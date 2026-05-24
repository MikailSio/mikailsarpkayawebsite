window.MATPLOTLIB_L6 = {

en: `<p class="l-text"><strong>This is the lesson where Matplotlib stops being a plotting library and becomes part of your ML reporting toolchain.</strong> Every model evaluation produces the same five plots: a confusion matrix heatmap, an ROC curve, a learning curve with confidence band, a feature importance bar chart, and a residual plot. Reading them is what tells you whether your model is good, where it fails, and what to fix next. We will draw all five with publication-quality styling, then close with the export pipeline -- DPI, formats, vector vs raster, and a brief look at FuncAnimation -- so the figures land in your thesis correctly.</p>

<p class="l-text">By the end you own a small ML cookbook of recipes you can copy-paste into any future evaluation notebook, plus the savefig settings that make sure your figures print at the resolution your committee expects.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Draw a confusion-matrix heatmap with annotated counts and a clean colour scale</li><li>Plot an ROC curve with AUC in the legend and a diagonal reference line</li><li>Build learning curves that show train vs validation mean +/- std with <code>fill_between</code></li><li>Sort and render a feature-importance bar chart from a fitted estimator</li><li>Diagnose regression fit with a residual plot (residuals vs predicted, zero line)</li><li>Export publication figures with <code>savefig</code>: DPI, PNG vs PDF vs SVG, <code>bbox_inches="tight"</code></li><li>Animate a plot with <code>FuncAnimation</code> and save it as MP4 / GIF for slide decks</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Confusion Matrix Heatmap</h2>

<p class="l-text">The first plot you should always make after evaluating a classifier. Already covered in lesson 5; here we put it next to the next four to make the cookbook complete.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> confusion_matrix

<span class="kw">def</span> <span class="fn">plot_confusion</span>(ax, y_true, y_pred, classes, normalise=<span class="kw">True</span>, cmap=<span class="str">"Blues"</span>):
    cm = <span class="fn">confusion_matrix</span>(y_true, y_pred)
    <span class="kw">if</span> normalise:
        cm = cm / cm.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    im = ax.<span class="fn">imshow</span>(cm, cmap=cmap, vmin=<span class="num">0</span>, vmax=<span class="num">1</span> <span class="kw">if</span> normalise <span class="kw">else</span> <span class="kw">None</span>)
    ax.<span class="fn">set_xticks</span>(<span class="fn">range</span>(<span class="fn">len</span>(classes))); ax.<span class="fn">set_yticks</span>(<span class="fn">range</span>(<span class="fn">len</span>(classes)))
    ax.<span class="fn">set_xticklabels</span>(classes, rotation=<span class="num">30</span>, ha=<span class="str">"right"</span>); ax.<span class="fn">set_yticklabels</span>(classes)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(cm.shape[<span class="num">0</span>]):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(cm.shape[<span class="num">1</span>]):
            v = cm[i, j]
            colour = <span class="str">"white"</span> <span class="kw">if</span> v &gt; <span class="num">0.5</span> <span class="kw">else</span> <span class="str">"black"</span>
            txt = f<span class="str">"{v:.2f}"</span> <span class="kw">if</span> normalise <span class="kw">else</span> f<span class="str">"{int(v)}"</span>
            ax.<span class="fn">text</span>(j, i, txt, ha=<span class="str">"center"</span>, va=<span class="str">"center"</span>,
                    color=colour, fontsize=<span class="num">10</span>)
    ax.<span class="fn">set_xlabel</span>(<span class="str">"predicted"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"true"</span>)
    ax.<span class="fn">set_title</span>(<span class="str">"confusion matrix"</span>)
    <span class="kw">return</span> im

<span class="cm"># Demo with synthetic predictions</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
y_true = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">5</span>, size=<span class="num">400</span>)
y_pred = y_true.<span class="fn">copy</span>()
mask = rng.<span class="fn">uniform</span>(size=<span class="num">400</span>) &lt; <span class="num">0.25</span>            <span class="cm"># 25% mistakes</span>
y_pred[mask] = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">5</span>, size=mask.<span class="fn">sum</span>())

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">7</span>, <span class="num">6</span>), constrained_layout=<span class="kw">True</span>)
im = <span class="fn">plot_confusion</span>(ax, y_true, y_pred,
                    classes=[<span class="str">"neg"</span>, <span class="str">"weak-neg"</span>, <span class="str">"neutral"</span>, <span class="str">"weak-pos"</span>, <span class="str">"pos"</span>])
fig.<span class="fn">colorbar</span>(im, ax=ax, label=<span class="str">"proportion"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>plot_confusion</code> wraps the imshow + numeric overlay pattern into a reusable function so you do not repeat the bookkeeping every time. 2) <code>sklearn.metrics.confusion_matrix(y_true, y_pred)</code> builds the count matrix; row-normalising turns counts into per-class recall proportions and lets you compare across classes with very different supports. 3) <code>vmin=0, vmax=1</code> when normalised pins the colour scale -- crucial when comparing matrices across different runs or models. 4) The text colour switch (<code>"white" if v &gt; 0.5 else "black"</code>) keeps numbers readable on both pale and dark cells. 5) The demo generates 400 fake predictions where 25% of the time the model picks a random class -- the confusion matrix shows a strong diagonal with light off-diagonal noise.</p>

<div id="plot-mpl-l6-cm-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A row-normalised 5-class confusion matrix. Diagonal cells (correct predictions) are dark blue at around 0.75; off-diagonal cells are pale, indicating the model rarely confuses one class with another. The numeric overlay turns the colour into an exact proportion, so the figure stands alone as a self-contained table. Always make this first.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. ROC Curve</h2>

<p class="l-text">For any binary or one-vs-rest classifier with a probability output, the <strong>ROC curve</strong> shows the trade-off between true positive rate and false positive rate as the decision threshold moves. The area under it (AUC) is the most common single-number summary of probabilistic ranking quality.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_curve, auc

<span class="cm"># Three pretend models with different ranking quality</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">1</span>)
n = <span class="num">400</span>
y = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">2</span>, size=n)
scores_a = np.<span class="fn">where</span>(y == <span class="num">1</span>, rng.<span class="fn">normal</span>(<span class="num">2.0</span>, <span class="num">1.0</span>, n), rng.<span class="fn">normal</span>(<span class="num">0.0</span>, <span class="num">1.0</span>, n))
scores_b = np.<span class="fn">where</span>(y == <span class="num">1</span>, rng.<span class="fn">normal</span>(<span class="num">1.5</span>, <span class="num">1.2</span>, n), rng.<span class="fn">normal</span>(<span class="num">0.0</span>, <span class="num">1.2</span>, n))
scores_c = np.<span class="fn">where</span>(y == <span class="num">1</span>, rng.<span class="fn">normal</span>(<span class="num">0.5</span>, <span class="num">1.5</span>, n), rng.<span class="fn">normal</span>(<span class="num">0.0</span>, <span class="num">1.5</span>, n))

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">7</span>, <span class="num">6</span>))
<span class="kw">for</span> label, scores, color <span class="kw">in</span> [
    (<span class="str">"model A"</span>, scores_a, <span class="str">"#c8a96e"</span>),
    (<span class="str">"model B"</span>, scores_b, <span class="str">"#4ecdc4"</span>),
    (<span class="str">"model C"</span>, scores_c, <span class="str">"#ff6b6b"</span>),
]:
    fpr, tpr, _ = <span class="fn">roc_curve</span>(y, scores)
    a = <span class="fn">auc</span>(fpr, tpr)
    ax.<span class="fn">plot</span>(fpr, tpr, linewidth=<span class="num">2</span>, color=color,
            label=f<span class="str">"{label} (AUC = {a:.2f})"</span>)

<span class="cm"># Diagonal: random classifier</span>
ax.<span class="fn">plot</span>([<span class="num">0</span>, <span class="num">1</span>], [<span class="num">0</span>, <span class="num">1</span>], linestyle=<span class="str">"--"</span>, color=<span class="str">"gray"</span>,
        linewidth=<span class="num">1.0</span>, label=<span class="str">"random"</span>)

ax.<span class="fn">set_xlim</span>(<span class="num">0</span>, <span class="num">1</span>); ax.<span class="fn">set_ylim</span>(<span class="num">0</span>, <span class="num">1.02</span>)
ax.<span class="fn">set_xlabel</span>(<span class="str">"false positive rate"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"true positive rate"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"ROC curves for three models"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"lower right"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds three pretend score sets for the same true labels: A separates the classes well (mean gap 2.0, std 1.0), B is mediocre (gap 1.5, std 1.2), C is barely better than random (gap 0.5, std 1.5). 2) For each model, <code>sklearn.metrics.roc_curve</code> sweeps every possible threshold and returns parallel arrays of false positive rate and true positive rate; <code>auc</code> integrates the area under the resulting curve. 3) Each curve is drawn in a distinct project colour with the AUC value baked into the legend label. 4) The grey dashed diagonal is the "random classifier" baseline -- any curve above it is at least better than random. 5) The axes limits, labels, title, legend, and grid round out a presentable figure. The closer a curve hugs the top-left corner, the better the model.</p>

<div id="plot-mpl-l6-roc-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Three ROC curves on the same axes -- model A (gold) hugs the top-left corner with AUC near 0.92, model B (teal) is the mediocre middle, model C (coral) barely beats the random baseline. The dashed grey diagonal is the random classifier reference. Reading ROC together with AUC is the standard way to compare classifiers across thresholds.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Learning Curves with fill_between (mean +/- std)</h2>

<p class="l-text">A learning curve plots training and validation performance as a function of dataset size or training iterations, usually with a confidence band showing variability across multiple seeds. The band is what tells you whether the difference between two models is real or noise.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Pretend we have 20 epochs and 5 seeds for two models</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">2</span>)
epochs = np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="num">21</span>)

<span class="kw">def</span> <span class="fn">fake_curve</span>(base, noise, n_seeds=<span class="num">5</span>):
    <span class="str">"""Return (mean, std) over seeds."""</span>
    runs = np.<span class="fn">array</span>([
        base * np.<span class="fn">exp</span>(-epochs / <span class="num">6</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, noise, <span class="fn">len</span>(epochs))
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n_seeds)
    ])
    <span class="kw">return</span> runs.<span class="fn">mean</span>(axis=<span class="num">0</span>), runs.<span class="fn">std</span>(axis=<span class="num">0</span>)

mean_a, std_a = <span class="fn">fake_curve</span>(<span class="num">0.9</span>, noise=<span class="num">0.04</span>)         <span class="cm"># model A</span>
mean_b, std_b = <span class="fn">fake_curve</span>(<span class="num">0.95</span>, noise=<span class="num">0.06</span>)        <span class="cm"># model B (worse, noisier)</span>

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">5.5</span>))

<span class="cm"># Model A</span>
ax.<span class="fn">plot</span>(epochs, mean_a, color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>, label=<span class="str">"model A (mean)"</span>)
ax.<span class="fn">fill_between</span>(epochs, mean_a - std_a, mean_a + std_a,
                color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.15</span>, label=<span class="str">"A +/- std"</span>)

<span class="cm"># Model B</span>
ax.<span class="fn">plot</span>(epochs, mean_b, color=<span class="str">"#4ecdc4"</span>, linewidth=<span class="num">2</span>, label=<span class="str">"model B (mean)"</span>)
ax.<span class="fn">fill_between</span>(epochs, mean_b - std_b, mean_b + std_b,
                color=<span class="str">"#4ecdc4"</span>, alpha=<span class="num">0.15</span>, label=<span class="str">"B +/- std"</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"epoch"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"validation loss"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Learning curves: 5 seeds per model, mean +/- std"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>); ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>fake_curve</code> simulates 5 random seeds of the same model: each seed produces a 20-epoch validation-loss trace; we then compute mean and std across seeds at each epoch. In a real notebook you would store actual seed runs in a NumPy array and apply <code>.mean(axis=0)</code> and <code>.std(axis=0)</code>. 2) For each model we draw two layers: a thick mean line, and a translucent <code>fill_between</code> band of <code>mean - std</code> to <code>mean + std</code>. The <code>alpha=0.15</code> makes the band soft enough to overlap with the other model's band. 3) <code>fill_between(x, lower, upper, color=...)</code> is the canonical idiom for "shaded confidence band". 4) When the bands of two models overlap heavily, the apparent gap between their means is not statistically distinguishable from noise; when they are clearly disjoint, you have evidence that one model is genuinely better. This is the difference between rigorous and decorative model comparison.</p>

<div id="plot-mpl-l6-lc-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Two models' learning curves, each as the mean across 5 seeds with a translucent +/- 1 std band. Model A (gold) has a lower mean and narrower band -- both better and more reliable. Model B (teal) is worse on average and noisier across seeds. Always plot bands, never single lines, when comparing models -- single lines lie about the variance and let you draw conclusions from random fluctuations.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Feature Importance Bar Chart</h2>

<p class="l-text">For tree ensembles (Random Forest, Gradient Boosting, XGBoost) and many linear models, you get a numeric importance per feature. The standard plot is a horizontal bar chart sorted by magnitude.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Pretend feature names and importances</span>
features = np.<span class="fn">array</span>([
    <span class="str">"n_words"</span>, <span class="str">"uppercase_ratio"</span>, <span class="str">"exclamation_count"</span>,
    <span class="str">"avg_word_len"</span>, <span class="str">"polarity_score"</span>, <span class="str">"subjectivity"</span>,
    <span class="str">"negation_count"</span>, <span class="str">"punctuation_density"</span>, <span class="str">"url_present"</span>,
    <span class="str">"emoji_count"</span>, <span class="str">"hashtag_count"</span>, <span class="str">"char_n_grams"</span>
])
importance = np.<span class="fn">array</span>([<span class="num">0.18</span>, <span class="num">0.04</span>, <span class="num">0.07</span>, <span class="num">0.03</span>, <span class="num">0.22</span>, <span class="num">0.11</span>,
                       <span class="num">0.06</span>, <span class="num">0.08</span>, <span class="num">0.02</span>, <span class="num">0.05</span>, <span class="num">0.06</span>, <span class="num">0.08</span>])

<span class="cm"># Sort by importance, descending in the eye, ascending in the array</span>
order = np.<span class="fn">argsort</span>(importance)
features  = features[order]
importance = importance[order]

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">6.5</span>))
bars = ax.<span class="fn">barh</span>(features, importance,
               color=<span class="str">"#c8a96e"</span>, edgecolor=<span class="str">"white"</span>, linewidth=<span class="num">0.8</span>)

<span class="cm"># Highlight top-3 in a different colour</span>
<span class="kw">for</span> b <span class="kw">in</span> bars[-<span class="num">3</span>:]:
    b.<span class="fn">set_color</span>(<span class="str">"#4ecdc4"</span>)

<span class="cm"># Annotate each bar with its value</span>
<span class="kw">for</span> b, v <span class="kw">in</span> <span class="fn">zip</span>(bars, importance):
    ax.<span class="fn">text</span>(v + <span class="num">0.003</span>, b.<span class="fn">get_y</span>() + b.<span class="fn">get_height</span>() / <span class="num">2</span>,
            f<span class="str">"{v:.2f}"</span>, va=<span class="str">"center"</span>, fontsize=<span class="num">9</span>, color=<span class="str">"#888"</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"importance"</span>); ax.<span class="fn">set_title</span>(<span class="str">"Feature importance (top three highlighted)"</span>)
ax.<span class="fn">set_xlim</span>(<span class="num">0</span>, importance.<span class="fn">max</span>() * <span class="num">1.15</span>)
ax.spines[<span class="str">"top"</span>].<span class="fn">set_visible</span>(<span class="kw">False</span>); ax.spines[<span class="str">"right"</span>].<span class="fn">set_visible</span>(<span class="kw">False</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Twelve fake feature names and importance values -- exactly the kind of output you would get from <code>model.feature_importances_</code> on a tree ensemble. 2) <code>np.argsort(importance)</code> returns the indices that would sort the array in ascending order; we use that index to reorder both arrays in parallel. Sorting is essential -- an unsorted feature importance bar chart is much harder to read. 3) <code>ax.barh(features, importance, ...)</code> draws horizontal bars; horizontal is preferred for feature names because they are usually long and read better as horizontal labels than as rotated x ticks. 4) The for-loop recolours the top three bars (last three in our ascending sort) in a contrast colour to draw the eye to the most important features. 5) The second for-loop annotates each bar with its numeric value just past the bar end. 6) Hiding the top and right spines is a small but effective minimalist touch that makes the data the focus.</p>

<div id="plot-mpl-l6-fi-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Twelve features ranked by their importance for predicting sentiment, with the top three highlighted in teal. The three most predictive features (polarity_score, n_words, subjectivity) account for roughly half the model's decision power. A horizontal bar chart with sorted values and per-bar numeric labels is the unambiguous standard for feature importance reporting.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Residual Plot</h2>

<p class="l-text">For regression, the most diagnostic plot is the <strong>residual plot</strong>: predicted vs (true minus predicted). If the model is well-calibrated, residuals scatter symmetrically around zero with no visible pattern. If you see a curve, a fan, or a trend, the model is biased.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">3</span>)
n = <span class="num">300</span>
y_true = rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">10</span>, size=n)
<span class="cm"># A model that is right on average but has a slight quadratic bias</span>
y_pred = y_true + <span class="num">0.1</span> * (y_true - <span class="num">5</span>) ** <span class="num">2</span> - <span class="num">0.25</span> + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.6</span>, n)
residual = y_true - y_pred

fig, axes = plt.<span class="fn">subplots</span>(<span class="num">1</span>, <span class="num">2</span>, figsize=(<span class="num">13</span>, <span class="num">5</span>), constrained_layout=<span class="kw">True</span>)

<span class="cm"># Panel 1: predicted vs true</span>
axes[<span class="num">0</span>].<span class="fn">scatter</span>(y_pred, y_true, s=<span class="num">14</span>, color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.7</span>,
                edgecolor=<span class="str">"white"</span>, linewidth=<span class="num">0.4</span>)
mn = <span class="fn">min</span>(y_pred.<span class="fn">min</span>(), y_true.<span class="fn">min</span>()); mx = <span class="fn">max</span>(y_pred.<span class="fn">max</span>(), y_true.<span class="fn">max</span>())
axes[<span class="num">0</span>].<span class="fn">plot</span>([mn, mx], [mn, mx], <span class="str">"--"</span>, color=<span class="str">"gray"</span>, linewidth=<span class="num">1</span>,
             label=<span class="str">"ideal y_pred = y_true"</span>)
axes[<span class="num">0</span>].<span class="fn">set_xlabel</span>(<span class="str">"predicted"</span>); axes[<span class="num">0</span>].<span class="fn">set_ylabel</span>(<span class="str">"true"</span>)
axes[<span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"Predicted vs true"</span>); axes[<span class="num">0</span>].<span class="fn">legend</span>()
axes[<span class="num">0</span>].<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

<span class="cm"># Panel 2: residual vs predicted</span>
axes[<span class="num">1</span>].<span class="fn">scatter</span>(y_pred, residual, s=<span class="num">14</span>, color=<span class="str">"#4ecdc4"</span>, alpha=<span class="num">0.7</span>,
                edgecolor=<span class="str">"white"</span>, linewidth=<span class="num">0.4</span>)
axes[<span class="num">1</span>].<span class="fn">axhline</span>(<span class="num">0</span>, color=<span class="str">"gray"</span>, linestyle=<span class="str">"--"</span>, linewidth=<span class="num">1</span>)
axes[<span class="num">1</span>].<span class="fn">set_xlabel</span>(<span class="str">"predicted"</span>); axes[<span class="num">1</span>].<span class="fn">set_ylabel</span>(<span class="str">"residual (true - pred)"</span>)
axes[<span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"Residual plot"</span>)
axes[<span class="num">1</span>].<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a regression dataset of 300 points with a model that has a small but real quadratic bias (the <code>0.1 * (y_true - 5) ** 2</code> term). 2) Panel 1 plots <code>predicted</code> on the x-axis and <code>true</code> on the y-axis; a perfect model would put every point on the dashed identity line. 3) Panel 2 is the residual plot: <code>predicted</code> on x, <code>true - predicted</code> on y. The horizontal dashed line at zero is the "no error" reference. 4) When the residuals are a featureless cloud around zero, the model is well-calibrated. In our case the cloud has a visible quadratic curve -- highest residuals at the extremes, lowest in the middle -- which signals that the linear assumption is wrong and the model would benefit from a quadratic term, a tree ensemble, or a non-linear transformation.</p>

<div class="calc-highlight"><strong>The diagnostic value:</strong> if your residual plot shows a clear shape (curve, fan, trend), the model is leaving information on the table. The shape <em>tells you exactly how to improve it</em> -- a curve means missing non-linearity, a fan means heteroscedasticity (variance changing with mean), a trend means a missing covariate.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. savefig: DPI, Format, bbox_inches</h2>

<p class="l-text">When the figure looks right on screen, the next step is exporting it. Three knobs do most of the work: file format, DPI, and bounding-box trimming.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) * np.<span class="fn">exp</span>(-x / <span class="num">8</span>), color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Damped sine"</span>); ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

<span class="cm"># 1) PNG raster, fine for slides and web</span>
fig.<span class="fn">savefig</span>(<span class="str">"plot.png"</span>,
            dpi=<span class="num">200</span>,                <span class="cm"># higher = sharper but bigger file</span>
            bbox_inches=<span class="str">"tight"</span>,    <span class="cm"># trim white margins</span>
            pad_inches=<span class="num">0.05</span>,        <span class="cm"># tiny padding</span>
            facecolor=<span class="str">"white"</span>)      <span class="cm"># background colour for transparency-aware viewers</span>

<span class="cm"># 2) PDF vector, perfect for thesis / paper</span>
fig.<span class="fn">savefig</span>(<span class="str">"plot.pdf"</span>,
            bbox_inches=<span class="str">"tight"</span>,    <span class="cm"># DPI ignored for vector formats</span>
            pad_inches=<span class="num">0.05</span>)

<span class="cm"># 3) SVG vector, perfect for web embedding</span>
fig.<span class="fn">savefig</span>(<span class="str">"plot.svg"</span>,
            bbox_inches=<span class="str">"tight"</span>,
            pad_inches=<span class="num">0.05</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a small standalone figure to export. 2) The first <code>savefig</code> writes a PNG at 200 DPI with tight bbox; PNG is a raster format -- pixels in a grid -- and DPI is what controls sharpness. For papers, 300 DPI is the typical floor; for slides, 150-200 is fine. 3) <code>bbox_inches="tight"</code> trims the surrounding whitespace so your figure lands inside its container without padding. <code>pad_inches=0.05</code> adds back a tiny consistent margin. 4) The second writes a PDF; PDFs are vector format -- the figure is stored as drawing instructions, so it scales to any size without blurring. DPI is irrelevant for vector files. 5) The third writes an SVG; SVG is also vector, but XML-based, ideal for embedding in web pages or for editing in Inkscape/Illustrator before final inclusion.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Raster (PNG, JPG)</div><div class="compare-item">Pixel grid, fixed resolution</div><div class="compare-item">DPI controls sharpness</div><div class="compare-item">Small file size</div><div class="compare-item">Blurs when zoomed in</div><div class="compare-item">Use for: web, slides, screenshots</div></div>
<div class="compare-col"><div class="compare-title">Vector (PDF, SVG)</div><div class="compare-item">Drawing instructions, infinite resolution</div><div class="compare-item">DPI irrelevant</div><div class="compare-item">Larger file size for complex plots</div><div class="compare-item">Crisp at any zoom</div><div class="compare-item">Use for: thesis, journal papers, posters</div></div>
</div>

<div class="calc-highlight"><strong>The thesis recipe:</strong> always export figures as PDF. Embed the PDF directly in LaTeX with <code>\\\\includegraphics</code>, no resolution loss, no jagged text, no banding. The only time you should ship raster from a thesis-context notebook is when the figure has thousands of points (very large scatter plots) where the vector file would balloon to many MB.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. FuncAnimation: A Brief Look at Movement</h2>

<p class="l-text">Sometimes the story is the dynamics, not a snapshot. <strong>FuncAnimation</strong> redraws a figure many times to produce an MP4 or GIF -- great for showing optimisation paths, training over epochs, or attention rolling token-by-token.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">from</span> matplotlib.animation <span class="kw">import</span> FuncAnimation
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">4</span> * np.pi, <span class="num">200</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">4</span>))
line, = ax.<span class="fn">plot</span>([], [], color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>)
ax.<span class="fn">set_xlim</span>(<span class="num">0</span>, <span class="num">4</span> * np.pi); ax.<span class="fn">set_ylim</span>(-<span class="num">1.5</span>, <span class="num">1.5</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Travelling sin wave"</span>)
ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"sin(x - phi)"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

<span class="kw">def</span> <span class="fn">init</span>():
    line.<span class="fn">set_data</span>([], [])
    <span class="kw">return</span> (line,)

<span class="kw">def</span> <span class="fn">update</span>(frame):
    phi = frame * <span class="num">0.1</span>
    line.<span class="fn">set_data</span>(x, np.<span class="fn">sin</span>(x - phi))
    <span class="kw">return</span> (line,)

anim = <span class="fn">FuncAnimation</span>(fig, update, init_func=init,
                     frames=<span class="num">120</span>, interval=<span class="num">40</span>, blit=<span class="kw">True</span>)

<span class="cm"># anim.save("travelling.mp4", writer="ffmpeg", dpi=150)   # needs ffmpeg</span>
<span class="cm"># anim.save("travelling.gif", writer="pillow", dpi=120)   # produces a GIF</span>
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up a static figure with an empty <code>line</code> object that will be re-filled each frame -- the animation engine works by mutating an existing artist rather than redrawing the whole figure. 2) <code>init</code> establishes the empty starting state and returns the artists that change each frame. 3) <code>update(frame)</code> is the per-frame callback: it computes a phase shift, replaces the line's x and y data with the new wave, and returns the changed artists. 4) <code>FuncAnimation(fig, update, init_func=init, frames=120, interval=40, blit=True)</code> stitches it together: 120 frames, 40 ms per frame (so 25 fps), and <code>blit=True</code> only re-renders the changed pixels for speed. 5) <code>anim.save</code> writes to MP4 (requires ffmpeg) or GIF (uses pillow). 6) In Jupyter <code>plt.show()</code> embeds an HTML5 video player.</p>

<div class="l-note"><strong>When animation pays off:</strong> showing optimisation paths over time, attention rolling left-to-right over a sentence, the loss landscape changing as you sweep a hyperparameter, embedding clusters reorganising during training. For a thesis, prefer PDF stills with arrows and inset zooms; for a presentation or web post, an MP4 or GIF can convey dynamics no static image can.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Wrap-up: The ML Cookbook</h2>

<p class="l-text">A condensed reference of the figures every ML paper or thesis needs.</p>

<div class="calc-steps">
<div class="step-row"><div class="step-num">1</div><div class="step-body"><strong>Confusion matrix heatmap</strong> -- always make this first when evaluating a classifier. Use <code>imshow</code> + numeric overlay + <code>vmin=0, vmax=1</code>.</div></div>
<div class="step-row"><div class="step-num">2</div><div class="step-body"><strong>ROC curve</strong> -- one plot for each model, AUC in the legend, dashed grey diagonal as the random baseline.</div></div>
<div class="step-row"><div class="step-num">3</div><div class="step-body"><strong>Learning curves with bands</strong> -- run multiple seeds, plot mean line + <code>fill_between</code> for +/- std. Single-seed lines lie about variance.</div></div>
<div class="step-row"><div class="step-num">4</div><div class="step-body"><strong>Feature importance</strong> -- horizontal bars sorted by magnitude, top-three highlighted, numeric labels next to each bar.</div></div>
<div class="step-row"><div class="step-num">5</div><div class="step-body"><strong>Residual plot</strong> -- predicted vs (true - predicted) for regression. A clear shape diagnoses the missing model assumption.</div></div>
<div class="step-row"><div class="step-num">6</div><div class="step-body"><strong>Export as PDF</strong> for thesis (<code>fig.savefig("plot.pdf", bbox_inches="tight")</code>), PNG at 200 DPI for slides.</div></div>
<div class="step-row"><div class="step-num">7</div><div class="step-body"><strong>Animate</strong> only when dynamics is the story; for thesis figures, prefer high-DPI PDF stills.</div></div>
</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> The five-figure cookbook (confusion matrix, ROC, learning curves with bands, feature importance, residual plot) covers most of what an ML thesis needs. Memorise the recipes.<br><strong>2.</strong> Always plot bands, not single lines, when comparing models -- a single seed lies about variance and lets you draw conclusions from noise.<br><strong>3.</strong> A residual plot with a clear shape is a debugging tool: the shape tells you exactly what assumption is wrong.<br><strong>4.</strong> Sort feature importance bar charts by magnitude, highlight the top few, and annotate each bar with its numeric value.<br><strong>5.</strong> Always include a colorbar with continuous-colour plots, and always overlay numbers on confusion matrices.<br><strong>6.</strong> For thesis export use PDF (vector). For slides, PNG at 200-300 DPI. SVG when you want to edit in Inkscape afterwards.<br><strong>7.</strong> <code>bbox_inches="tight"</code> + <code>pad_inches=0.05</code> on every <code>savefig</code> trims white margins -- non-negotiable for clean LaTeX inclusion.<br><strong>8.</strong> FuncAnimation is occasionally useful for presentations and web posts but is the wrong choice for a thesis figure. Static + arrows + inset zooms is more rigorous.</div></div>
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

  // 1. Confusion matrix
  function cmDemo(id, title, labels, lblPred, lblTrue, lblProp){
    var el = document.getElementById(id); if(!el) return;
    var raw = [
      [62, 5, 4, 3, 2],
      [ 6,55, 8, 4, 3],
      [ 4, 7,58, 7, 5],
      [ 3, 4,10,52, 8],
      [ 2, 3, 4, 7,60]
    ];
    var cm=[]; for (var i=0;i<5;i++){var s=raw[i].reduce(function(a,b){return a+b;},0); var row=[]; for (var j=0;j<5;j++){row.push(raw[i][j]/s);} cm.push(row);}
    var ann=[];
    for (var i=0;i<5;i++) for (var j=0;j<5;j++){
      ann.push({x:labels[j],y:labels[i],text:cm[i][j].toFixed(2),showarrow:false,font:{color:cm[i][j]>0.5?'white':'black',size:11}});
    }
    var trace = {x:labels,y:labels,z:cm,type:'heatmap',colorscale:'Blues',zmin:0,zmax:1,colorbar:{title:lblProp}};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:lblPred,gridcolor:T.grid},
      yaxis:{title:lblTrue,gridcolor:T.grid,autorange:'reversed'},
      annotations:ann,height:480
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  cmDemo('plot-mpl-l6-cm-en','Row-normalised confusion matrix',['neg','weak-neg','neutral','weak-pos','pos'],'predicted','true','proportion');
  cmDemo('plot-mpl-l6-cm-tr','Satir-normalize karisiklik matrisi',['neg','zayif-neg','notr','zayif-poz','poz'],'tahmin','gercek','oran');

  // 2. ROC curves
  function rocDemo(id, title, lblFpr, lblTpr, lblRandom){
    var el = document.getElementById(id); if(!el) return;
    function curve(auc){
      var fpr=[], tpr=[];
      for (var i=0;i<=100;i++){var f=i/100; fpr.push(f); tpr.push(Math.min(1, Math.pow(f, 1/(2*auc-0.5))));}
      return {fpr:fpr,tpr:tpr};
    }
    var cA = curve(0.92), cB = curve(0.78), cC = curve(0.62);
    var traces = [
      {x:cA.fpr,y:cA.tpr,mode:'lines',line:{color:'#c8a96e',width:2.5},name:'model A (AUC = 0.92)'},
      {x:cB.fpr,y:cB.tpr,mode:'lines',line:{color:'#4ecdc4',width:2.5},name:'model B (AUC = 0.78)'},
      {x:cC.fpr,y:cC.tpr,mode:'lines',line:{color:'#ff6b6b',width:2.5},name:'model C (AUC = 0.62)'},
      {x:[0,1],y:[0,1],mode:'lines',line:{color:'gray',width:1,dash:'dash'},name:lblRandom}
    ];
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:lblFpr,range:[0,1],gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:lblTpr,range:[0,1.02],gridcolor:T.grid,zerolinecolor:T.zero},
      legend:{font:{color:T.text}},height:460
    });
    Plotly.newPlot(id,traces,layout,{responsive:true,displayModeBar:false});
  }
  rocDemo('plot-mpl-l6-roc-en','ROC curves for three models','false positive rate','true positive rate','random');
  rocDemo('plot-mpl-l6-roc-tr','Uc model icin ROC egrileri','yanlis pozitif orani','dogru pozitif orani','rastgele');

  // 3. Learning curve with band
  function lcDemo(id, title, xl, yl, lblA, lblB, lblBandA, lblBandB){
    var el = document.getElementById(id); if(!el) return;
    var ep=[], mA=[], mB=[], sA=[], sB=[];
    for (var i=1;i<=20;i++){
      ep.push(i);
      mA.push(0.9*Math.exp(-i/6));
      mB.push(0.95*Math.exp(-i/6)+0.04);
      sA.push(0.04+0.01*Math.sin(i));
      sB.push(0.07+0.02*Math.cos(i));
    }
    var bandA = {x:ep.concat(ep.slice().reverse()),y:mA.map(function(v,i){return v+sA[i];}).concat(mA.map(function(v,i){return v-sA[i];}).reverse()),fill:'toself',fillcolor:'rgba(200,169,110,0.18)',line:{color:'rgba(0,0,0,0)'},name:lblBandA,type:'scatter',hoverinfo:'skip'};
    var bandB = {x:ep.concat(ep.slice().reverse()),y:mB.map(function(v,i){return v+sB[i];}).concat(mB.map(function(v,i){return v-sB[i];}).reverse()),fill:'toself',fillcolor:'rgba(78,205,196,0.18)',line:{color:'rgba(0,0,0,0)'},name:lblBandB,type:'scatter',hoverinfo:'skip'};
    var lA = {x:ep,y:mA,mode:'lines',line:{color:'#c8a96e',width:2.5},name:lblA};
    var lB = {x:ep,y:mB,mode:'lines',line:{color:'#4ecdc4',width:2.5},name:lblB};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero,dtick:2},
      yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero},
      legend:{font:{color:T.text}},height:460
    });
    Plotly.newPlot(id,[bandA,bandB,lA,lB],layout,{responsive:true,displayModeBar:false});
  }
  lcDemo('plot-mpl-l6-lc-en','Learning curves: 5 seeds per model','epoch','validation loss','model A (mean)','model B (mean)','A +/- std','B +/- std');
  lcDemo('plot-mpl-l6-lc-tr','Ogrenme egrileri: model basina 5 tohum','epok','dogrulama kaybi','model A (ort)','model B (ort)','A +/- std','B +/- std');

  // 4. Feature importance horizontal bars
  function fiDemo(id, title, xl){
    var el = document.getElementById(id); if(!el) return;
    var feats = ['url_present','avg_word_len','uppercase_ratio','emoji_count','negation_count','hashtag_count','exclamation_count','char_n_grams','punctuation_density','subjectivity','n_words','polarity_score'];
    var imp   = [0.02,0.03,0.04,0.05,0.06,0.06,0.07,0.08,0.08,0.11,0.18,0.22];
    var colors = imp.map(function(_,i){return i>=imp.length-3?'#4ecdc4':'#c8a96e';});
    var trace = {x:imp,y:feats,type:'bar',orientation:'h',marker:{color:colors,line:{color:'white',width:0.8}},text:imp.map(function(v){return v.toFixed(2);}),textposition:'outside',textfont:{color:T.text}};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero,range:[0, Math.max.apply(null,imp)*1.18]},
      yaxis:{gridcolor:T.grid,zerolinecolor:T.zero},
      height:520, showlegend:false
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  fiDemo('plot-mpl-l6-fi-en','Feature importance (top three highlighted)','importance');
  fiDemo('plot-mpl-l6-fi-tr','Ozellik onemi (en yuksek uc vurgulu)','onem');
},250);</script>`,

tr: `<p class="l-text"><strong>Bu, Matplotlib'in bir çizim kütüphanesi olmaktan çıkıp ML raporlama araç zincirinizin parçası haline geldiği derstir.</strong> Her model değerlendirmesi aynı beş grafiği üretir: bir karışıklık matrisi ısı haritası, bir ROC eğrisi, güven bandı olan bir öğrenme eğrisi, bir özellik önemi çubuk grafiği ve bir artık grafiği. Bunları okumak modelinizin iyi olup olmadığını, nerede başarısız olduğunu ve sonra neyi düzeltmeniz gerektiğini söyler. Beşini de yayın kalitesinde biçimleyerek çizeceğiz, sonra dışa aktarım hattıyla kapatacağız -- DPI, formatlar, vektör vs raster ve FuncAnimation'a kısa bir bakış -- böylece figürler tezinize doğru şekilde iner.</p>

<p class="l-text">Sonunda gelecekteki herhangi bir değerlendirme not defterine kopyalayıp yapıştırabileceğiniz küçük bir ML tarif kitabınız olacak, ayrıca figürlerinizin komitenizin beklediği çözünürlükte yazdırıldığından emin olan savefig ayarları.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Sayı etiketli ve temiz renk ölçekli bir karışıklık matrisi (confusion matrix) ısı haritası çiz</li><li>Legend'da AUC değeri ve köşegen referans çizgisi olan bir ROC eğrisi çiz</li><li><code>fill_between</code> ile train vs validation ortalama +/- std gösteren öğrenme eğrileri kur</li><li>Eğitilmiş bir modelden özellik önemini sıralayıp çubuk grafik olarak göster</li><li>Regresyon uyumunu artık grafiği (residuals vs predicted + sıfır çizgisi) ile teşhis et</li><li><code>savefig</code> ile yayına hazır figürleri dışa aktar: DPI, PNG vs PDF vs SVG, <code>bbox_inches="tight"</code></li><li><code>FuncAnimation</code> ile grafik canlandır ve slayt sunumları için MP4 / GIF olarak kaydet</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Karışıklık Matrisi Isı Haritası</h2>

<p class="l-text">Bir sınıflandırıcıyı değerlendirdikten sonra her zaman yapmanız gereken ilk grafik. Ders 5'te zaten ele alındı; burada tarif kitabını tamamlamak için sonraki dördünün yanına koyuyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> confusion_matrix

<span class="kw">def</span> <span class="fn">plot_confusion</span>(ax, y_true, y_pred, classes, normalise=<span class="kw">True</span>, cmap=<span class="str">"Blues"</span>):
    cm = <span class="fn">confusion_matrix</span>(y_true, y_pred)
    <span class="kw">if</span> normalise:
        cm = cm / cm.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    im = ax.<span class="fn">imshow</span>(cm, cmap=cmap, vmin=<span class="num">0</span>, vmax=<span class="num">1</span> <span class="kw">if</span> normalise <span class="kw">else</span> <span class="kw">None</span>)
    ax.<span class="fn">set_xticks</span>(<span class="fn">range</span>(<span class="fn">len</span>(classes))); ax.<span class="fn">set_yticks</span>(<span class="fn">range</span>(<span class="fn">len</span>(classes)))
    ax.<span class="fn">set_xticklabels</span>(classes, rotation=<span class="num">30</span>, ha=<span class="str">"right"</span>); ax.<span class="fn">set_yticklabels</span>(classes)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(cm.shape[<span class="num">0</span>]):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(cm.shape[<span class="num">1</span>]):
            v = cm[i, j]
            colour = <span class="str">"white"</span> <span class="kw">if</span> v &gt; <span class="num">0.5</span> <span class="kw">else</span> <span class="str">"black"</span>
            txt = f<span class="str">"{v:.2f}"</span> <span class="kw">if</span> normalise <span class="kw">else</span> f<span class="str">"{int(v)}"</span>
            ax.<span class="fn">text</span>(j, i, txt, ha=<span class="str">"center"</span>, va=<span class="str">"center"</span>,
                    color=colour, fontsize=<span class="num">10</span>)
    ax.<span class="fn">set_xlabel</span>(<span class="str">"tahmin"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"gercek"</span>)
    ax.<span class="fn">set_title</span>(<span class="str">"karisiklik matrisi"</span>)
    <span class="kw">return</span> im

<span class="cm"># Sentetik tahminlerle gosterim</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
y_true = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">5</span>, size=<span class="num">400</span>)
y_pred = y_true.<span class="fn">copy</span>()
mask = rng.<span class="fn">uniform</span>(size=<span class="num">400</span>) &lt; <span class="num">0.25</span>            <span class="cm"># %25 hata</span>
y_pred[mask] = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">5</span>, size=mask.<span class="fn">sum</span>())

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">7</span>, <span class="num">6</span>), constrained_layout=<span class="kw">True</span>)
im = <span class="fn">plot_confusion</span>(ax, y_true, y_pred,
                    classes=[<span class="str">"neg"</span>, <span class="str">"zayif-neg"</span>, <span class="str">"notr"</span>, <span class="str">"zayif-poz"</span>, <span class="str">"poz"</span>])
fig.<span class="fn">colorbar</span>(im, ax=ax, label=<span class="str">"oran"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>plot_confusion</code>, imshow + sayısal kaplama örüntüsünü yeniden kullanılabilir bir fonksiyona sarar, böylece kayıt tutmayı her seferinde tekrarlamazsınız. 2) <code>sklearn.metrics.confusion_matrix(y_true, y_pred)</code> sayım matrisini kurar; satır-normalize etme sayıları sınıf başına geri çağırma oranlarına dönüştürür ve çok farklı destekleri olan sınıflar arasında karşılaştırmaya izin verir. 3) Normalize edildiğinde <code>vmin=0, vmax=1</code> renk ölçeğini sabitler -- farklı koşular veya modeller arasında matrisleri karşılaştırırken kritiktir. 4) Metin rengi anahtarı (<code>"white" if v &gt; 0.5 else "black"</code>) hem soluk hem koyu hücrelerde sayıları okunabilir tutar. 5) Gösterim, modelin %25 oranında rastgele bir sınıf seçtiği 400 sahte tahmin üretir -- karışıklık matrisi soluk köşegen dışı gürültüyle güçlü bir köşegen gösterir.</p>

<div id="plot-mpl-l6-cm-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Görselin işaret ettiği:</strong> Satır-normalize 5 sınıflı karışıklık matrisi. Köşegen hücreler (doğru tahminler) yaklaşık 0.75'te koyu mavidir; köşegen dışı hücreler soluktur, modelin bir sınıfı diğeriyle nadiren karıştırdığını gösterir. Sayısal kaplama rengi tam orana dönüştürür, böylece figür kendi başına yeten bir tablo olarak durur. Her zaman önce bunu yapın.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. ROC Eğrisi</h2>

<p class="l-text">Olasılık çıktısı olan herhangi bir ikili veya bir-vs-rest sınıflandırıcı için <strong>ROC eğrisi</strong>, karar eşiği hareket ettikçe doğru pozitif oranı ile yanlış pozitif oranı arasındaki ödünleşimi gösterir. Altındaki alan (AUC), olasılıksal sıralama kalitesinin en yaygın tek sayılı özetidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_curve, auc

<span class="cm"># Farkli siralama kalitesinde uc taklit model</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">1</span>)
n = <span class="num">400</span>
y = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">2</span>, size=n)
scores_a = np.<span class="fn">where</span>(y == <span class="num">1</span>, rng.<span class="fn">normal</span>(<span class="num">2.0</span>, <span class="num">1.0</span>, n), rng.<span class="fn">normal</span>(<span class="num">0.0</span>, <span class="num">1.0</span>, n))
scores_b = np.<span class="fn">where</span>(y == <span class="num">1</span>, rng.<span class="fn">normal</span>(<span class="num">1.5</span>, <span class="num">1.2</span>, n), rng.<span class="fn">normal</span>(<span class="num">0.0</span>, <span class="num">1.2</span>, n))
scores_c = np.<span class="fn">where</span>(y == <span class="num">1</span>, rng.<span class="fn">normal</span>(<span class="num">0.5</span>, <span class="num">1.5</span>, n), rng.<span class="fn">normal</span>(<span class="num">0.0</span>, <span class="num">1.5</span>, n))

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">7</span>, <span class="num">6</span>))
<span class="kw">for</span> label, scores, color <span class="kw">in</span> [
    (<span class="str">"model A"</span>, scores_a, <span class="str">"#c8a96e"</span>),
    (<span class="str">"model B"</span>, scores_b, <span class="str">"#4ecdc4"</span>),
    (<span class="str">"model C"</span>, scores_c, <span class="str">"#ff6b6b"</span>),
]:
    fpr, tpr, _ = <span class="fn">roc_curve</span>(y, scores)
    a = <span class="fn">auc</span>(fpr, tpr)
    ax.<span class="fn">plot</span>(fpr, tpr, linewidth=<span class="num">2</span>, color=color,
            label=f<span class="str">"{label} (AUC = {a:.2f})"</span>)

<span class="cm"># Kosegen: rastgele siniflandirici</span>
ax.<span class="fn">plot</span>([<span class="num">0</span>, <span class="num">1</span>], [<span class="num">0</span>, <span class="num">1</span>], linestyle=<span class="str">"--"</span>, color=<span class="str">"gray"</span>,
        linewidth=<span class="num">1.0</span>, label=<span class="str">"rastgele"</span>)

ax.<span class="fn">set_xlim</span>(<span class="num">0</span>, <span class="num">1</span>); ax.<span class="fn">set_ylim</span>(<span class="num">0</span>, <span class="num">1.02</span>)
ax.<span class="fn">set_xlabel</span>(<span class="str">"yanlış pozitif orani"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"doğru pozitif orani"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Uc model için ROC egrileri"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"lower right"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Aynı gerçek etiketler için üç taklit puan seti kurar: A sınıfları iyi ayırır (ortalama fark 2.0, std 1.0), B vasattır (fark 1.5, std 1.2), C rastgeleden zar zor daha iyidir (fark 0.5, std 1.5). 2) Her model için <code>sklearn.metrics.roc_curve</code> her olası eşiği tarar ve yanlış pozitif oranı ile doğru pozitif oranının paralel dizilerini döndürür; <code>auc</code> ortaya çıkan eğrinin altındaki alanı integral alır. 3) Her eğri farklı bir proje renginde çizilir ve AUC değeri açıklama etiketine yerleştirilir. 4) Gri kesikli köşegen "rastgele sınıflandırıcı" temelidir -- üzerindeki herhangi bir eğri en azından rastgeleden iyidir. 5) Eksen sınırları, etiketler, başlık, açıklama ve ızgara sunulabilir bir figürü tamamlar. Bir eğri sol-üst köşeye ne kadar yakınsa, model o kadar iyidir.</p>

<div id="plot-mpl-l6-roc-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Görselin işaret ettiği:</strong> Aynı eksende üç ROC eğrisi -- model A (altın) yaklaşık 0.92 AUC ile sol-üst köşeye yapışır, model B (teal) vasat ortadır, model C (mercan) rastgele temelini zar zor geçer. Gri kesikli köşegen rastgele sınıflandırıcı referansıdır. ROC'u AUC ile birlikte okumak eşikler arasında sınıflandırıcıları karşılaştırmanın standart yoludur.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. fill_between ile Öğrenme Eğrileri (ortalama +/- std)</h2>

<p class="l-text">Öğrenme eğrisi, eğitim ve doğrulama performansını veri seti boyutu veya eğitim iterasyonlarının fonksiyonu olarak çizer, genellikle birden çok tohum üzerindeki değişkenliği gösteren bir güven bandıyla. Bant, iki model arasındaki farkın gerçek mi yoksa gürültü mü olduğunu söyleyen şeydir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Iki model için 20 epok ve 5 tohum oldugunu varsayalim</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">2</span>)
epochs = np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="num">21</span>)

<span class="kw">def</span> <span class="fn">fake_curve</span>(base, noise, n_seeds=<span class="num">5</span>):
    <span class="str">"""Tohumlar uzerindeki (ortalama, std)'yi dondurur."""</span>
    runs = np.<span class="fn">array</span>([
        base * np.<span class="fn">exp</span>(-epochs / <span class="num">6</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, noise, <span class="fn">len</span>(epochs))
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n_seeds)
    ])
    <span class="kw">return</span> runs.<span class="fn">mean</span>(axis=<span class="num">0</span>), runs.<span class="fn">std</span>(axis=<span class="num">0</span>)

mean_a, std_a = <span class="fn">fake_curve</span>(<span class="num">0.9</span>, noise=<span class="num">0.04</span>)         <span class="cm"># model A</span>
mean_b, std_b = <span class="fn">fake_curve</span>(<span class="num">0.95</span>, noise=<span class="num">0.06</span>)        <span class="cm"># model B (daha kotu, daha gurultulu)</span>

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">5.5</span>))

<span class="cm"># Model A</span>
ax.<span class="fn">plot</span>(epochs, mean_a, color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>, label=<span class="str">"model A (ortalama)"</span>)
ax.<span class="fn">fill_between</span>(epochs, mean_a - std_a, mean_a + std_a,
                color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.15</span>, label=<span class="str">"A +/- std"</span>)

<span class="cm"># Model B</span>
ax.<span class="fn">plot</span>(epochs, mean_b, color=<span class="str">"#4ecdc4"</span>, linewidth=<span class="num">2</span>, label=<span class="str">"model B (ortalama)"</span>)
ax.<span class="fn">fill_between</span>(epochs, mean_b - std_b, mean_b + std_b,
                color=<span class="str">"#4ecdc4"</span>, alpha=<span class="num">0.15</span>, label=<span class="str">"B +/- std"</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"epok"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"doğrulama kaybi"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Öğrenme egrileri: model basina 5 tohum, ort +/- std"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>); ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>fake_curve</code> aynı modelin 5 rastgele tohumunu simüle eder: her tohum 20 epoklu bir doğrulama-kayıp izi üretir; sonra her epokta tohumlar arasında ortalama ve std hesaplarız. Gerçek bir not defterinde gerçek tohum koşularını bir NumPy dizisinde saklar ve <code>.mean(axis=0)</code> ile <code>.std(axis=0)</code> uygularsınız. 2) Her model için iki katman çizeriz: kalın bir ortalama çizgi ve <code>mean - std</code>'den <code>mean + std</code>'ye yarı saydam bir <code>fill_between</code> bandı. <code>alpha=0.15</code> bandı diğer modelin bandıyla örtüşecek kadar yumuşak yapar. 3) <code>fill_between(x, lower, upper, color=...)</code> "gölgeli güven bandı" için standart deyimdir. 4) İki modelin bantları yoğun şekilde örtüştüğünde, ortalamaları arasındaki görünen fark istatistiksel olarak gürültüden ayırt edilemez; açıkça ayrık olduklarında, bir modelin gerçekten daha iyi olduğuna dair kanıtınız var. Bu, titiz model karşılaştırması ile süslü olan arasındaki farktır.</p>

<div id="plot-mpl-l6-lc-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> İki modelin öğrenme eğrileri, her biri 5 tohum üzerindeki ortalama olarak yarı saydam +/- 1 std bandıyla. Model A (altın) daha düşük ortalamaya ve daha dar banda sahiptir -- hem daha iyi hem de daha güvenilir. Model B (teal) ortalamada daha kötüdür ve tohumlar arasında daha gürültülüdür. Modelleri karşılaştırırken her zaman bantları çizin, asla tek çizgileri çizmeyin -- tek çizgiler varyans hakkında yalan söyler ve rastgele dalgalanmalardan sonuç çıkarmanıza izin verir.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Özellik Önemi Çubuk Grafiği</h2>

<p class="l-text">Ağaç ansamblleri (Random Forest, Gradient Boosting, XGBoost) ve birçok doğrusal model için, özellik başına sayısal bir önem alırsınız. Standart grafik, büyüklüğe göre sıralanmış yatay bir çubuk grafiğidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Özellik adlari ve onemleri taklit</span>
features = np.<span class="fn">array</span>([
    <span class="str">"n_words"</span>, <span class="str">"uppercase_ratio"</span>, <span class="str">"exclamation_count"</span>,
    <span class="str">"avg_word_len"</span>, <span class="str">"polarity_score"</span>, <span class="str">"subjectivity"</span>,
    <span class="str">"negation_count"</span>, <span class="str">"punctuation_density"</span>, <span class="str">"url_present"</span>,
    <span class="str">"emoji_count"</span>, <span class="str">"hashtag_count"</span>, <span class="str">"char_n_grams"</span>
])
importance = np.<span class="fn">array</span>([<span class="num">0.18</span>, <span class="num">0.04</span>, <span class="num">0.07</span>, <span class="num">0.03</span>, <span class="num">0.22</span>, <span class="num">0.11</span>,
                       <span class="num">0.06</span>, <span class="num">0.08</span>, <span class="num">0.02</span>, <span class="num">0.05</span>, <span class="num">0.06</span>, <span class="num">0.08</span>])

<span class="cm"># Oneme gore sirala, gozde azalan, dizide artan</span>
order = np.<span class="fn">argsort</span>(importance)
features  = features[order]
importance = importance[order]

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">6.5</span>))
bars = ax.<span class="fn">barh</span>(features, importance,
               color=<span class="str">"#c8a96e"</span>, edgecolor=<span class="str">"white"</span>, linewidth=<span class="num">0.8</span>)

<span class="cm"># En yüksek 3'u farkli renkle vurgula</span>
<span class="kw">for</span> b <span class="kw">in</span> bars[-<span class="num">3</span>:]:
    b.<span class="fn">set_color</span>(<span class="str">"#4ecdc4"</span>)

<span class="cm"># Her cubugu degeriyle isaretle</span>
<span class="kw">for</span> b, v <span class="kw">in</span> <span class="fn">zip</span>(bars, importance):
    ax.<span class="fn">text</span>(v + <span class="num">0.003</span>, b.<span class="fn">get_y</span>() + b.<span class="fn">get_height</span>() / <span class="num">2</span>,
            f<span class="str">"{v:.2f}"</span>, va=<span class="str">"center"</span>, fontsize=<span class="num">9</span>, color=<span class="str">"#888"</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"önem"</span>); ax.<span class="fn">set_title</span>(<span class="str">"Özellik onemi (en yüksek uc vurgulu)"</span>)
ax.<span class="fn">set_xlim</span>(<span class="num">0</span>, importance.<span class="fn">max</span>() * <span class="num">1.15</span>)
ax.spines[<span class="str">"top"</span>].<span class="fn">set_visible</span>(<span class="kw">False</span>); ax.spines[<span class="str">"right"</span>].<span class="fn">set_visible</span>(<span class="kw">False</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) On iki sahte özellik adı ve önem değeri -- bir ağaç topluluğunda <code>model.feature_importances_</code>'tan alacağınız tam çıktı türü. 2) <code>np.argsort(importance)</code> diziyi artan sırada sıralayacak indeksleri döndürür; bu indeksi her iki diziyi paralel olarak yeniden sıralamak için kullanırız. Sıralama esastır -- sıralanmamış bir özellik önemi çubuk grafiği okumak çok daha zordur. 3) <code>ax.barh(features, importance, ...)</code> yatay çubuklar çizer; özellik adları için yatay tercih edilir çünkü genellikle uzundurlar ve döndürülmüş x tikleri yerine yatay etiketler olarak daha iyi okunurlar. 4) For döngüsü en yüksek üç çubuğu (artan sıralamamızın son üçü) en önemli özelliklere gözü çekmek için kontrast bir renkte yeniden renklendirir. 5) İkinci for döngüsü her çubuğu sayısal değeriyle çubuk sonunun hemen ötesinde işaretler. 6) Üst ve sağ omurgaları gizlemek küçük ama etkili bir minimalist dokunuştur ve veriyi odak noktası yapar.</p>

<div id="plot-mpl-l6-fi-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> Duyguyu tahmin etmek için önemlerine göre sıralanmış on iki özellik, en yüksek üçü teal renginde vurgulanmış. En tahmin edici üç özellik (polarity_score, n_words, subjectivity), modelin karar gücünün kabaca yarısını oluşturur. Sıralanmış değerler ve çubuk başına sayısal etiketler içeren yatay bir çubuk grafiği, özellik önemi raporlamasının net standardıdır.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Artık Grafiği</h2>

<p class="l-text">Regresyon için en tanılayıcı grafik <strong>artık grafiği</strong>dir: tahmin edilen vs (gerçek eksi tahmin edilen). Model iyi kalibre edilmişse, artıklar sıfır etrafında simetrik olarak görünür örüntü olmadan saçılır. Bir eğri, bir yelpaze veya bir trend görürseniz, model yanlıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">3</span>)
n = <span class="num">300</span>
y_true = rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">10</span>, size=n)
<span class="cm"># Ortalamada doğru olan ama hafif kuadratik onyargisi olan bir model</span>
y_pred = y_true + <span class="num">0.1</span> * (y_true - <span class="num">5</span>) ** <span class="num">2</span> - <span class="num">0.25</span> + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.6</span>, n)
residual = y_true - y_pred

fig, axes = plt.<span class="fn">subplots</span>(<span class="num">1</span>, <span class="num">2</span>, figsize=(<span class="num">13</span>, <span class="num">5</span>), constrained_layout=<span class="kw">True</span>)

<span class="cm"># Panel 1: tahmin vs gercek</span>
axes[<span class="num">0</span>].<span class="fn">scatter</span>(y_pred, y_true, s=<span class="num">14</span>, color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.7</span>,
                edgecolor=<span class="str">"white"</span>, linewidth=<span class="num">0.4</span>)
mn = <span class="fn">min</span>(y_pred.<span class="fn">min</span>(), y_true.<span class="fn">min</span>()); mx = <span class="fn">max</span>(y_pred.<span class="fn">max</span>(), y_true.<span class="fn">max</span>())
axes[<span class="num">0</span>].<span class="fn">plot</span>([mn, mx], [mn, mx], <span class="str">"--"</span>, color=<span class="str">"gray"</span>, linewidth=<span class="num">1</span>,
             label=<span class="str">"ideal y_pred = y_true"</span>)
axes[<span class="num">0</span>].<span class="fn">set_xlabel</span>(<span class="str">"tahmin"</span>); axes[<span class="num">0</span>].<span class="fn">set_ylabel</span>(<span class="str">"gercek"</span>)
axes[<span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"Tahmin vs gercek"</span>); axes[<span class="num">0</span>].<span class="fn">legend</span>()
axes[<span class="num">0</span>].<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

<span class="cm"># Panel 2: artik vs tahmin</span>
axes[<span class="num">1</span>].<span class="fn">scatter</span>(y_pred, residual, s=<span class="num">14</span>, color=<span class="str">"#4ecdc4"</span>, alpha=<span class="num">0.7</span>,
                edgecolor=<span class="str">"white"</span>, linewidth=<span class="num">0.4</span>)
axes[<span class="num">1</span>].<span class="fn">axhline</span>(<span class="num">0</span>, color=<span class="str">"gray"</span>, linestyle=<span class="str">"--"</span>, linewidth=<span class="num">1</span>)
axes[<span class="num">1</span>].<span class="fn">set_xlabel</span>(<span class="str">"tahmin"</span>); axes[<span class="num">1</span>].<span class="fn">set_ylabel</span>(<span class="str">"artik (gercek - tahmin)"</span>)
axes[<span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"Artik grafigi"</span>)
axes[<span class="num">1</span>].<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Küçük ama gerçek bir kuadratik önyargısı olan (<code>0.1 * (y_true - 5) ** 2</code> terimi) bir modelle 300 noktalık bir regresyon veri seti kurar. 2) Panel 1, x ekseninde <code>predicted</code> ve y ekseninde <code>true</code>'yu çizer; mükemmel bir model her noktayı kesikli özdeşlik çizgisine yerleştirirdi. 3) Panel 2 artık grafiğidir: x'te <code>predicted</code>, y'de <code>true - predicted</code>. Sıfırdaki yatay kesikli çizgi "hata yok" referansıdır. 4) Artıklar sıfır etrafında özelliksiz bir bulutsa, model iyi kalibre edilmiştir. Bizim durumumuzda bulutta görünür bir kuadratik eğri vardır -- aşırı uçlarda en yüksek artıklar, ortada en düşük -- bu, doğrusal varsayımın yanlış olduğunu ve modelin bir kuadratik terimden, bir ağaç topluluğundan veya doğrusal olmayan bir dönüşümden yararlanacağını işaret eder.</p>

<div class="calc-highlight"><strong>Tanılayıcı değer:</strong> artık grafiğiniz net bir şekil gösterirse (eğri, yelpaze, trend), model masada bilgi bırakıyordur. Şekil <em>onu nasıl iyileştireceğinizi tam olarak söyler</em> -- bir eğri eksik doğrusal olmamayı, bir yelpaze heteroskedastisiteyi (varyansın ortalamayla değişmesi), bir trend eksik bir eşdeğişkeni anlamına gelir.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. savefig: DPI, Format, bbox_inches</h2>

<p class="l-text">Figür ekranda doğru göründüğünde sonraki adım dışa aktarmadır. Üç düğme işin çoğunu yapar: dosya formatı, DPI ve sınırlama kutusu kırpma.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) * np.<span class="fn">exp</span>(-x / <span class="num">8</span>), color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Sonumlu sinus"</span>); ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

<span class="cm"># 1) PNG raster, slaytlar ve web için uygun</span>
fig.<span class="fn">savefig</span>(<span class="str">"plot.png"</span>,
            dpi=<span class="num">200</span>,                <span class="cm"># daha yüksek = daha keskin ama dosya büyük</span>
            bbox_inches=<span class="str">"tight"</span>,    <span class="cm"># beyaz bosluklari kirp</span>
            pad_inches=<span class="num">0.05</span>,        <span class="cm"># küçük dolgu</span>
            facecolor=<span class="str">"white"</span>)      <span class="cm"># seffafliga duyarli izleyiciler için arka plan</span>

<span class="cm"># 2) PDF vektor, tez/makale için mukemmel</span>
fig.<span class="fn">savefig</span>(<span class="str">"plot.pdf"</span>,
            bbox_inches=<span class="str">"tight"</span>,    <span class="cm"># vektor formatlar için DPI yok sayilir</span>
            pad_inches=<span class="num">0.05</span>)

<span class="cm"># 3) SVG vektor, web gomulmesi için mukemmel</span>
fig.<span class="fn">savefig</span>(<span class="str">"plot.svg"</span>,
            bbox_inches=<span class="str">"tight"</span>,
            pad_inches=<span class="num">0.05</span>)</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Dışa aktarılacak küçük bağımsız bir figür kurar. 2) İlk <code>savefig</code> sıkı bbox ile 200 DPI'da bir PNG yazar; PNG bir raster formattır -- ızgaradaki pikseller -- ve DPI keskinliği kontrol eder. Makaleler için 300 DPI tipik tabandır; slaytlar için 150-200 yeterlidir. 3) <code>bbox_inches="tight"</code> çevredeki beyaz boşluğu keser, böylece figür dolgusuz olarak konteynerine iner. <code>pad_inches=0.05</code> küçük tutarlı bir kenar boşluğu ekler. 4) İkincisi bir PDF yazar; PDF'ler vektör formatıdır -- figür çizim talimatları olarak saklanır, böylece bulanıklaşmadan herhangi bir boyuta ölçeklenir. DPI vektör dosyaları için ilgisizdir. 5) Üçüncüsü bir SVG yazar; SVG de vektördür ama XML tabanlıdır, web sayfalarına gömme veya son dahil etmeden önce Inkscape/Illustrator'da düzenleme için idealdir.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Raster (PNG, JPG)</div><div class="compare-item">Piksel ızgarası, sabit çözünürlük</div><div class="compare-item">DPI keskinliği kontrol eder</div><div class="compare-item">Küçük dosya boyutu</div><div class="compare-item">Yakınlaştırıldığında bulanıklaşır</div><div class="compare-item">Kullanım: web, slaytlar, ekran görüntüleri</div></div>
<div class="compare-col"><div class="compare-title">Vektör (PDF, SVG)</div><div class="compare-item">Çizim talimatları, sonsuz çözünürlük</div><div class="compare-item">DPI ilgisiz</div><div class="compare-item">Karmaşık grafikler için daha büyük dosya</div><div class="compare-item">Her yakınlaştırmada keskin</div><div class="compare-item">Kullanım: tez, dergi makaleleri, posterler</div></div>
</div>

<div class="calc-highlight"><strong>Tez tarifi:</strong> figürleri her zaman PDF olarak dışa aktarın. PDF'i doğrudan LaTeX'e <code>\\\\includegraphics</code> ile gömün, çözünürlük kaybı yok, dişli metin yok, bantlama yok. Tez bağlamında bir not defterinden raster göndermeniz gereken tek zaman, vektör dosyasının çok MB'a şişeceği binlerce noktalı bir figür (çok büyük saçılım grafikleri) olduğunda.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. FuncAnimation: Hareket Üzerine Kısa Bakış</h2>

<p class="l-text">Bazen hikâye bir anlık görüntü değil, dinamiklerdir. <strong>FuncAnimation</strong>, bir MP4 veya GIF üretmek için bir figürü birçok kez yeniden çizer -- optimizasyon yollarını, epoklar boyunca eğitimi veya token-token rüzgar yapan dikkati göstermek için harikadır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">from</span> matplotlib.animation <span class="kw">import</span> FuncAnimation
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">4</span> * np.pi, <span class="num">200</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">4</span>))
line, = ax.<span class="fn">plot</span>([], [], color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>)
ax.<span class="fn">set_xlim</span>(<span class="num">0</span>, <span class="num">4</span> * np.pi); ax.<span class="fn">set_ylim</span>(-<span class="num">1.5</span>, <span class="num">1.5</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Yolculuk yapan sinus dalgasi"</span>)
ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"sin(x - phi)"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

<span class="kw">def</span> <span class="fn">init</span>():
    line.<span class="fn">set_data</span>([], [])
    <span class="kw">return</span> (line,)

<span class="kw">def</span> <span class="fn">update</span>(frame):
    phi = frame * <span class="num">0.1</span>
    line.<span class="fn">set_data</span>(x, np.<span class="fn">sin</span>(x - phi))
    <span class="kw">return</span> (line,)

anim = <span class="fn">FuncAnimation</span>(fig, update, init_func=init,
                     frames=<span class="num">120</span>, interval=<span class="num">40</span>, blit=<span class="kw">True</span>)

<span class="cm"># anim.save("yolcu.mp4", writer="ffmpeg", dpi=150)   # ffmpeg gerektirir</span>
<span class="cm"># anim.save("yolcu.gif", writer="pillow", dpi=120)   # GIF uretir</span>
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Her karede yeniden doldurulacak boş bir <code>line</code> nesnesi olan statik bir figür kurar -- animasyon motoru tüm figürü yeniden çizmek yerine mevcut bir sanatçıyı değiştirerek çalışır. 2) <code>init</code> boş başlangıç durumunu kurar ve her karede değişen sanatçıları döndürür. 3) <code>update(frame)</code> kare başına geri çağırmadır: bir faz kayması hesaplar, çizginin x ve y verisini yeni dalgayla değiştirir ve değişen sanatçıları döndürür. 4) <code>FuncAnimation(fig, update, init_func=init, frames=120, interval=40, blit=True)</code> her şeyi birleştirir: 120 kare, kare başına 40 ms (yani 25 fps) ve <code>blit=True</code> hız için yalnızca değişen pikselleri yeniden render eder. 5) <code>anim.save</code> MP4'e (ffmpeg gerektirir) veya GIF'e (pillow kullanır) yazar. 6) Jupyter'de <code>plt.show()</code> bir HTML5 video oynatıcısı gömer.</p>

<div class="l-note"><strong>Animasyonun karşılığını verdiği zaman:</strong> zaman içinde optimizasyon yollarını göstermek, bir cümle üzerinde soldan sağa yuvarlanan dikkat, bir hiperparametreyi tararken değişen kayıp manzarası, eğitim sırasında yeniden düzenlenen gömme kümeleri. Bir tez için, oklu ve inset yakınlaştırmalı PDF stillerini tercih edin; bir sunum veya web yazısı için, bir MP4 veya GIF hiçbir statik görüntünün iletemeyeceği dinamikleri iletebilir.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet: ML Tarif Kitabı</h2>

<p class="l-text">Her ML makalesinin veya tezinin ihtiyaç duyduğu figürlerin yoğunlaştırılmış bir referansı.</p>

<div class="calc-steps">
<div class="step-row"><div class="step-num">1</div><div class="step-body"><strong>Karışıklık matrisi ısı haritası</strong> -- bir sınıflandırıcıyı değerlendirirken her zaman önce bunu yapın. <code>imshow</code> + sayısal kaplama + <code>vmin=0, vmax=1</code> kullanın.</div></div>
<div class="step-row"><div class="step-num">2</div><div class="step-body"><strong>ROC eğrisi</strong> -- her model için bir grafik, açıklamada AUC, rastgele temeli olarak gri kesikli köşegen.</div></div>
<div class="step-row"><div class="step-num">3</div><div class="step-body"><strong>Bantlı öğrenme eğrileri</strong> -- birden çok tohum çalıştırın, ortalama çizgi + +/- std için <code>fill_between</code> çizin. Tek tohumlu çizgiler varyans hakkında yalan söyler.</div></div>
<div class="step-row"><div class="step-num">4</div><div class="step-body"><strong>Özellik önemi</strong> -- büyüklüğe göre sıralanmış yatay çubuklar, en yüksek üçü vurgulanmış, her çubuğun yanında sayısal etiketler.</div></div>
<div class="step-row"><div class="step-num">5</div><div class="step-body"><strong>Artık grafiği</strong> -- regresyon için tahmin vs (gerçek - tahmin). Net bir şekil eksik model varsayımını teşhis eder.</div></div>
<div class="step-row"><div class="step-num">6</div><div class="step-body"><strong>Tez için PDF olarak dışa aktarın</strong> (<code>fig.savefig("plot.pdf", bbox_inches="tight")</code>), slaytlar için 200 DPI'da PNG.</div></div>
<div class="step-row"><div class="step-num">7</div><div class="step-body"><strong>Yalnızca dinamik hikâye olduğunda canlandırın</strong>; tez figürleri için yüksek-DPI PDF stillerini tercih edin.</div></div>
</div>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Beş figürlük tarif kitabı (karışıklık matrisi, ROC, bantlı öğrenme eğrileri, özellik önemi, artık grafiği) bir ML tezinin ihtiyaç duyduğunun çoğunu kapsar. Tarifleri ezberleyin.<br><strong>2.</strong> Modelleri karşılaştırırken her zaman bantları çizin, tek çizgileri çizmeyin -- tek tohum varyans hakkında yalan söyler ve gürültüden sonuç çıkarmanıza izin verir.<br><strong>3.</strong> Net bir şekli olan bir artık grafiği bir hata ayıklama aracıdır: şekil hangi varsayımın yanlış olduğunu tam olarak söyler.<br><strong>4.</strong> Özellik önemi çubuk grafiklerini büyüklüğe göre sıralayın, en yüksek birkaçını vurgulayın ve her çubuğu sayısal değeriyle işaretleyin.<br><strong>5.</strong> Sürekli renkli grafiklerle her zaman bir renk çubuğu ekleyin ve karışıklık matrislerine her zaman sayıları bindirin.<br><strong>6.</strong> Tez dışa aktarımı için PDF (vektör) kullanın. Slaytlar için 200-300 DPI'da PNG. Sonradan Inkscape'te düzenlemek istediğinizde SVG.<br><strong>7.</strong> Her <code>savefig</code>'te <code>bbox_inches="tight"</code> + <code>pad_inches=0.05</code> beyaz kenar boşluklarını keser -- temiz LaTeX dahil etme için tartışılmaz.<br><strong>8.</strong> FuncAnimation sunumlar ve web yazıları için ara sıra yararlıdır ama bir tez figürü için yanlış seçimdir. Statik + oklar + inset yakınlaştırmaları daha titizdir.</div></div>
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

  // 1. Confusion matrix
  function cmDemo(id, title, labels, lblPred, lblTrue, lblProp){
    var el = document.getElementById(id); if(!el) return;
    var raw = [
      [62, 5, 4, 3, 2],
      [ 6,55, 8, 4, 3],
      [ 4, 7,58, 7, 5],
      [ 3, 4,10,52, 8],
      [ 2, 3, 4, 7,60]
    ];
    var cm=[]; for (var i=0;i<5;i++){var s=raw[i].reduce(function(a,b){return a+b;},0); var row=[]; for (var j=0;j<5;j++){row.push(raw[i][j]/s);} cm.push(row);}
    var ann=[];
    for (var i=0;i<5;i++) for (var j=0;j<5;j++){
      ann.push({x:labels[j],y:labels[i],text:cm[i][j].toFixed(2),showarrow:false,font:{color:cm[i][j]>0.5?'white':'black',size:11}});
    }
    var trace = {x:labels,y:labels,z:cm,type:'heatmap',colorscale:'Blues',zmin:0,zmax:1,colorbar:{title:lblProp}};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:lblPred,gridcolor:T.grid},
      yaxis:{title:lblTrue,gridcolor:T.grid,autorange:'reversed'},
      annotations:ann,height:480
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  cmDemo('plot-mpl-l6-cm-en','Row-normalised confusion matrix',['neg','weak-neg','neutral','weak-pos','pos'],'predicted','true','proportion');
  cmDemo('plot-mpl-l6-cm-tr','Satir-normalize karisiklik matrisi',['neg','zayif-neg','notr','zayif-poz','poz'],'tahmin','gercek','oran');

  // 2. ROC curves
  function rocDemo(id, title, lblFpr, lblTpr, lblRandom){
    var el = document.getElementById(id); if(!el) return;
    function curve(auc){
      var fpr=[], tpr=[];
      for (var i=0;i<=100;i++){var f=i/100; fpr.push(f); tpr.push(Math.min(1, Math.pow(f, 1/(2*auc-0.5))));}
      return {fpr:fpr,tpr:tpr};
    }
    var cA = curve(0.92), cB = curve(0.78), cC = curve(0.62);
    var traces = [
      {x:cA.fpr,y:cA.tpr,mode:'lines',line:{color:'#c8a96e',width:2.5},name:'model A (AUC = 0.92)'},
      {x:cB.fpr,y:cB.tpr,mode:'lines',line:{color:'#4ecdc4',width:2.5},name:'model B (AUC = 0.78)'},
      {x:cC.fpr,y:cC.tpr,mode:'lines',line:{color:'#ff6b6b',width:2.5},name:'model C (AUC = 0.62)'},
      {x:[0,1],y:[0,1],mode:'lines',line:{color:'gray',width:1,dash:'dash'},name:lblRandom}
    ];
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:lblFpr,range:[0,1],gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:lblTpr,range:[0,1.02],gridcolor:T.grid,zerolinecolor:T.zero},
      legend:{font:{color:T.text}},height:460
    });
    Plotly.newPlot(id,traces,layout,{responsive:true,displayModeBar:false});
  }
  rocDemo('plot-mpl-l6-roc-en','ROC curves for three models','false positive rate','true positive rate','random');
  rocDemo('plot-mpl-l6-roc-tr','Uc model için ROC egrileri','yanlış pozitif orani','doğru pozitif orani','rastgele');

  // 3. Learning curve with band
  function lcDemo(id, title, xl, yl, lblA, lblB, lblBandA, lblBandB){
    var el = document.getElementById(id); if(!el) return;
    var ep=[], mA=[], mB=[], sA=[], sB=[];
    for (var i=1;i<=20;i++){
      ep.push(i);
      mA.push(0.9*Math.exp(-i/6));
      mB.push(0.95*Math.exp(-i/6)+0.04);
      sA.push(0.04+0.01*Math.sin(i));
      sB.push(0.07+0.02*Math.cos(i));
    }
    var bandA = {x:ep.concat(ep.slice().reverse()),y:mA.map(function(v,i){return v+sA[i];}).concat(mA.map(function(v,i){return v-sA[i];}).reverse()),fill:'toself',fillcolor:'rgba(200,169,110,0.18)',line:{color:'rgba(0,0,0,0)'},name:lblBandA,type:'scatter',hoverinfo:'skip'};
    var bandB = {x:ep.concat(ep.slice().reverse()),y:mB.map(function(v,i){return v+sB[i];}).concat(mB.map(function(v,i){return v-sB[i];}).reverse()),fill:'toself',fillcolor:'rgba(78,205,196,0.18)',line:{color:'rgba(0,0,0,0)'},name:lblBandB,type:'scatter',hoverinfo:'skip'};
    var lA = {x:ep,y:mA,mode:'lines',line:{color:'#c8a96e',width:2.5},name:lblA};
    var lB = {x:ep,y:mB,mode:'lines',line:{color:'#4ecdc4',width:2.5},name:lblB};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero,dtick:2},
      yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero},
      legend:{font:{color:T.text}},height:460
    });
    Plotly.newPlot(id,[bandA,bandB,lA,lB],layout,{responsive:true,displayModeBar:false});
  }
  lcDemo('plot-mpl-l6-lc-en','Learning curves: 5 seeds per model','epoch','validation loss','model A (mean)','model B (mean)','A +/- std','B +/- std');
  lcDemo('plot-mpl-l6-lc-tr','Öğrenme egrileri: model basina 5 tohum','epok','doğrulama kaybi','model A (ort)','model B (ort)','A +/- std','B +/- std');

  // 4. Feature importance horizontal bars
  function fiDemo(id, title, xl){
    var el = document.getElementById(id); if(!el) return;
    var feats = ['url_present','avg_word_len','uppercase_ratio','emoji_count','negation_count','hashtag_count','exclamation_count','char_n_grams','punctuation_density','subjectivity','n_words','polarity_score'];
    var imp   = [0.02,0.03,0.04,0.05,0.06,0.06,0.07,0.08,0.08,0.11,0.18,0.22];
    var colors = imp.map(function(_,i){return i>=imp.length-3?'#4ecdc4':'#c8a96e';});
    var trace = {x:imp,y:feats,type:'bar',orientation:'h',marker:{color:colors,line:{color:'white',width:0.8}},text:imp.map(function(v){return v.toFixed(2);}),textposition:'outside',textfont:{color:T.text}};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero,range:[0, Math.max.apply(null,imp)*1.18]},
      yaxis:{gridcolor:T.grid,zerolinecolor:T.zero},
      height:520, showlegend:false
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  fiDemo('plot-mpl-l6-fi-en','Feature importance (top three highlighted)','importance');
  fiDemo('plot-mpl-l6-fi-tr','Özellik onemi (en yüksek uc vurgulu)','önem');
},250);</script>
`
};
