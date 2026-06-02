window.SKLEARN_L6 = {

en: `<p class="l-text"><strong>Accuracy alone is a beginner's metric.</strong> The moment your classes are imbalanced, accuracy lies; the moment costs of errors differ, accuracy lies; the moment you need to threshold-tune, accuracy lies. To do real ML you need fluency in the family of metrics that tell the truth: precision, recall, F1, ROC-AUC, PR-AUC, log-loss, and the Brier score. They form a small toolbox -- knowing exactly which one to pick for your problem is what separates a thesis-grade evaluation from a demo.</p>

<p class="l-text">In this lesson we anchor everything to the <strong>confusion matrix</strong> -- the 2x2 table from which all classification metrics are derived. Then we walk through binary metrics (precision, recall, F1, ROC-AUC, PR-AUC), multi-class extensions (macro/micro/weighted), threshold tuning, and probability calibration. Every formula is paired with a code snippet and a plot.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Read confusion matrix and compute precision/recall/F1</li><li>Plot ROC curve and interpret AUC</li><li>Use precision-recall curve for imbalanced data</li><li>Pick the right multi-class averaging (macro/micro/weighted)</li><li>Tune decision threshold for cost-sensitive predictions</li><li>Check probability calibration with reliability diagram</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Confusion Matrix: Foundation of Everything</h2>

<p class="l-text">For binary classification, predictions and truth fall into four buckets:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">TP (True Positive)</div><div class="card-body">Model said positive, truth was positive. The "win" cell.</div></div>
<div class="calc-card"><div class="card-title">FP (False Positive)</div><div class="card-body">Model said positive, truth was negative. A "false alarm" -- type-I error.</div></div>
<div class="calc-card"><div class="card-title">FN (False Negative)</div><div class="card-body">Model said negative, truth was positive. A "miss" -- type-II error.</div></div>
<div class="calc-card"><div class="card-title">TN (True Negative)</div><div class="card-body">Model said negative, truth was negative. The other "win" cell.</div></div>
<div class="calc-card"><div class="card-title">Total positive</div><div class="card-body">P = TP + FN. The number of true positives in the data.</div></div>
<div class="calc-card"><div class="card-title">Total negative</div><div class="card-body">N = TN + FP. The number of true negatives in the data.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> confusion_matrix, ConfusionMatrixDisplay

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
<span class="cm"># In sklearn, breast-cancer's target is 1 = benign, 0 = malignant</span>
<span class="cm"># We will flip so positive = malignant (the disease) for clarity</span>
y = <span class="num">1</span> - y
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>, stratify=y)

pipe = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()),
                 (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>))]).<span class="fn">fit</span>(X_tr, y_tr)
y_pred = pipe.<span class="fn">predict</span>(X_te)

cm = <span class="fn">confusion_matrix</span>(y_te, y_pred)
<span class="fn">print</span>(cm)
<span class="cm"># [[88  2]   <- row 0 = negative</span>
<span class="cm">#  [ 1 52]]  <- row 1 = positive (malignant)</span>

<span class="cm"># Unpack:</span>
tn, fp, fn, tp = cm.<span class="fn">ravel</span>()
<span class="fn">print</span>(f<span class="str">"TP = {tp}  (correctly identified malignant)"</span>)
<span class="fn">print</span>(f<span class="str">"FP = {fp}  (false alarms)"</span>)
<span class="fn">print</span>(f<span class="str">"FN = {fn}  (missed cancers !)"</span>)
<span class="fn">print</span>(f<span class="str">"TN = {tn}  (correctly identified benign)"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads breast-cancer and flips the labels so 1 = malignant (the "interesting" class). This convention matters: in medical ML, the disease is conventionally the positive class. 2) Trains a logistic regression and predicts on test. 3) <code>confusion_matrix(y_true, y_pred)</code> returns a 2x2 NumPy array; rows are true labels, columns are predicted labels. The convention is row 0 = true negative, row 1 = true positive. 4) <code>cm.ravel()</code> flattens to (TN, FP, FN, TP) in row-major order -- memorize this order or you will misread your own results. 5) The verbal labels make clear what each cell means in context; an FN here is an undiagnosed cancer, which is far costlier than a FP (a false alarm sent to a follow-up exam).</p>

<div id="plot-l6-cm-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The confusion matrix as a heatmap. The diagonal cells (TN and TP) are the correct predictions; off-diagonal cells (FP and FN) are the errors. Color intensity scales with cell count, so a "good" classifier shows a heavy diagonal and a faint off-diagonal. This single visualization tells you everything: total accuracy, the type of errors the model makes, and whether errors are balanced or skewed toward false alarms or misses.</div>

<div class="l-warn"><strong>Sklearn convention:</strong> the confusion matrix has rows = true class and columns = predicted class. Some textbooks and Wikipedia use the opposite convention (rows predicted, columns true). When you compare to outside sources, always check the orientation -- otherwise you swap precision and recall and embarrass yourself in a presentation.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Precision, Recall, F1, and Specificity</h2>

<p class="l-text">From the four cells of the confusion matrix, the canonical metrics are:</p>

<div class="katex-block">$$\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}$$</div>

<div class="katex-block">$$\\text{Precision} = \\frac{TP}{TP + FP}, \\quad \\text{Recall} = \\frac{TP}{TP + FN}, \\quad F_1 = \\frac{2 \\cdot P \\cdot R}{P + R}$$</div>

<div class="katex-block">$$\\text{Specificity} = \\frac{TN}{TN + FP}, \\quad \\text{Sensitivity} = \\text{Recall} = \\frac{TP}{TP+FN}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Accuracy</div><div class="card-body">Fraction of correct predictions overall. Useful only when classes are balanced and errors cost the same.</div></div>
<div class="calc-card"><div class="card-title">Precision</div><div class="card-body">Of all positive predictions, how many were truly positive? "When I shout, am I right?"</div></div>
<div class="calc-card"><div class="card-title">Recall (Sensitivity, TPR)</div><div class="card-body">Of all true positives, how many did I catch? "Of the real cases, how many did I find?"</div></div>
<div class="calc-card"><div class="card-title">F1 score</div><div class="card-body">Harmonic mean of P and R. Penalizes models with extreme imbalance between them.</div></div>
<div class="calc-card"><div class="card-title">Specificity (TNR)</div><div class="card-body">Of all true negatives, how many did I correctly reject? Mirror of recall.</div></div>
<div class="calc-card"><div class="card-title">Trade-off</div><div class="card-body">P and R trade off against each other: lowering threshold catches more positives (R up) but adds false alarms (P down).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> (accuracy_score, precision_score, recall_score,
                             f1_score, classification_report, fbeta_score)

acc = <span class="fn">accuracy_score</span>(y_te, y_pred)
prec = <span class="fn">precision_score</span>(y_te, y_pred)
rec  = <span class="fn">recall_score</span>(y_te, y_pred)
f1   = <span class="fn">f1_score</span>(y_te, y_pred)
spec = <span class="fn">recall_score</span>(y_te, y_pred, pos_label=<span class="num">0</span>)   <span class="cm"># specificity = recall on negative class</span>
<span class="fn">print</span>(f<span class="str">"Accuracy     : {acc:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Precision    : {prec:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Recall       : {rec:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"F1           : {f1:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Specificity  : {spec:.3f}"</span>)

<span class="cm"># All four together via the report</span>
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_te, y_pred, target_names=[<span class="str">"benign"</span>, <span class="str">"malignant"</span>]))
<span class="cm">#               precision    recall  f1-score   support</span>
<span class="cm">#       benign       0.99      0.98      0.98        90</span>
<span class="cm">#    malignant       0.96      0.98      0.97        53</span>

<span class="cm"># F-beta for asymmetric importance: F2 weighs recall higher</span>
f2 = <span class="fn">fbeta_score</span>(y_te, y_pred, beta=<span class="num">2</span>)
<span class="fn">print</span>(f<span class="str">"F2 (recall-leaning): {f2:.3f}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Computes the four classical binary metrics individually. 2) <code>recall_score(..., pos_label=0)</code> is a clean way to get specificity (recall measured on the negative class). 3) <code>classification_report</code> is the one-liner that prints precision/recall/F1/support for both classes plus macro and weighted averages -- ideal for a thesis result table. 4) <code>fbeta_score</code> generalizes F1: <code>beta=2</code> weighs recall twice as heavily as precision (use for medical screening), <code>beta=0.5</code> weighs precision more (use for high-stakes false-alarm scenarios). 5) Choosing the right metric depends on your domain: cancer screening cares about recall (do not miss a tumor), spam filtering cares about precision (do not flag legitimate email).</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Optimize Precision when</div><div class="compare-item">False alarms are costly (spam filters, medical retesting)</div><div class="compare-item">You can afford to miss some positives</div><div class="compare-item">Negatives outnumber positives heavily</div><div class="compare-item">Use F1 or F0.5 score</div></div>
<div class="compare-col"><div class="compare-title">Optimize Recall when</div><div class="compare-item">Missing positives is costly (cancer, fraud, security)</div><div class="compare-item">Some false alarms are acceptable</div><div class="compare-item">Catching the few positives is the goal</div><div class="compare-item">Use F2 score, or directly recall at fixed precision</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP fake-news detection</div><div class="example-body">If you are flagging fake news headlines, false positives (real news flagged as fake) are reputational damage, while false negatives (fake news that slips through) cause real harm. The right metric is not accuracy but a curve: report <em>recall at 95% precision</em> -- "we catch X% of fake news while only mislabeling 5% of real news". This single number is interpretable and aligns with product constraints.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ROC Curve and AUC</h2>

<p class="l-text">All the metrics so far depend on a fixed threshold (default 0.5). But classifiers output probabilities, and choosing the threshold is a separate question. The <strong>ROC curve</strong> plots the trade-off between TPR (recall) and FPR (1 - specificity) as the threshold sweeps from 1 to 0:</p>

<div class="katex-block">$$\\text{TPR} = \\frac{TP}{TP+FN}, \\quad \\text{FPR} = \\frac{FP}{FP+TN}$$</div>

<p class="l-text">The <strong>AUC</strong> (Area Under the ROC Curve) is the integral of the curve. It is a threshold-independent measure of how well the classifier ranks positives above negatives:</p>

<div class="katex-block">$$\\text{AUC} = \\int_0^1 \\text{TPR}(\\text{FPR}) \\, d(\\text{FPR}) = P(\\hat{p}_+ > \\hat{p}_-)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">AUC = 0.5</div><div class="card-body">Random classifier. Diagonal line.</div></div>
<div class="calc-card"><div class="card-title">AUC = 1.0</div><div class="card-body">Perfect classifier. Curve hugs the top-left corner.</div></div>
<div class="calc-card"><div class="card-title">AUC = 0.0</div><div class="card-body">Anti-perfect. Just flip predictions to get a perfect classifier.</div></div>
<div class="calc-card"><div class="card-title">Threshold-free</div><div class="card-body">AUC summarizes ALL thresholds in one number. Different thresholds correspond to different points on the curve.</div></div>
<div class="calc-card"><div class="card-title">Robust to imbalance</div><div class="card-body">More robust than accuracy, but PR-AUC is preferred under heavy imbalance.</div></div>
<div class="calc-card"><div class="card-title">Probabilistic interpretation</div><div class="card-body">P(random positive scored higher than random negative).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_curve, roc_auc_score, RocCurveDisplay
<span class="kw">import</span> numpy <span class="kw">as</span> np

y_proba = pipe.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>]    <span class="cm"># probability of positive class</span>

<span class="cm"># Compute the ROC curve points</span>
fpr, tpr, thresholds = <span class="fn">roc_curve</span>(y_te, y_proba)
auc = <span class="fn">roc_auc_score</span>(y_te, y_proba)
<span class="fn">print</span>(f<span class="str">"AUC = {auc:.4f}"</span>)

<span class="cm"># A few representative threshold/TPR/FPR triples</span>
<span class="kw">for</span> i <span class="kw">in</span> [<span class="num">0</span>, <span class="fn">len</span>(thresholds)//<span class="num">4</span>, <span class="fn">len</span>(thresholds)//<span class="num">2</span>, -<span class="num">2</span>]:
    <span class="fn">print</span>(f<span class="str">"  threshold={thresholds[i]:.3f}  TPR={tpr[i]:.3f}  FPR={fpr[i]:.3f}"</span>)

<span class="cm"># Compare two models on the same plot</span>
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
rf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X_tr, y_tr)
fpr_rf, tpr_rf, _ = <span class="fn">roc_curve</span>(y_te, rf.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>])
auc_rf = <span class="fn">roc_auc_score</span>(y_te, rf.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>])
<span class="fn">print</span>(f<span class="str">"AUC (logreg) = {auc:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"AUC (rf)     = {auc_rf:.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>predict_proba(X)[:, 1]</code> grabs the predicted probability for the positive class (column 1). 2) <code>roc_curve(y_true, scores)</code> sweeps the threshold from very high (mostly negatives predicted) to very low (mostly positives predicted) and returns (FPR, TPR, threshold) triples for each unique score. 3) <code>roc_auc_score</code> computes the area under that curve in one call. 4) The loop prints a few sample (threshold, TPR, FPR) values so you can see the trade-off in action -- as threshold drops, both TPR and FPR rise. 5) Comparing models on the same plot is the most common ROC use case; if curve A is above curve B everywhere, A dominates. If they cross, neither model is universally better -- the right choice depends on the threshold you operate at.</p>

<div id="plot-l6-roc-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Two ROC curves on the same axes -- a logistic regression and a random forest on breast cancer. Both hug the top-left corner, indicating excellent classifiers; their AUCs are 0.99+ and visually indistinguishable. The dashed diagonal is the "random guess" baseline (AUC=0.5). The closer your curve gets to (0, 1), the better; the area under the curve is the AUC. ROC plots are the standard visualization for comparing binary classifiers.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Precision-Recall Curve and PR-AUC</h2>

<p class="l-text">When classes are heavily imbalanced (1% positive, 99% negative), ROC-AUC can be misleading -- a classifier that ranks the few positives slightly above some negatives still gets high AUC because there are so many true negatives. The Precision-Recall curve focuses only on the positive class:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> precision_recall_curve, average_precision_score
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_classification
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Heavily imbalanced: 1% positives</span>
X_imb, y_imb = <span class="fn">make_classification</span>(n_samples=<span class="num">10000</span>, n_features=<span class="num">20</span>,
                                   weights=[<span class="num">0.99</span>, <span class="num">0.01</span>], random_state=<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">"Class balance:"</span>, np.<span class="fn">bincount</span>(y_imb))

<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X_imb, y_imb, random_state=<span class="num">42</span>, stratify=y_imb)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>, class_weight=<span class="str">"balanced"</span>).<span class="fn">fit</span>(X_tr, y_tr)
y_proba = clf.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>]

<span class="cm"># PR curve and average precision (PR-AUC)</span>
prec, rec, thresh = <span class="fn">precision_recall_curve</span>(y_te, y_proba)
ap = <span class="fn">average_precision_score</span>(y_te, y_proba)
<span class="fn">print</span>(f<span class="str">"Average precision (PR-AUC): {ap:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"ROC AUC: {roc_auc_score(y_te, y_proba):.4f}"</span>)
<span class="cm"># Often AUC is 0.95+ but AP only 0.50 because of imbalance</span>

<span class="cm"># Find threshold for a target precision</span>
target_prec = <span class="num">0.80</span>
idx = np.<span class="fn">searchsorted</span>(-prec, -target_prec)   <span class="cm"># find first prec >= 0.80</span>
<span class="kw">if</span> idx < <span class="fn">len</span>(prec):
    <span class="fn">print</span>(f<span class="str">"At precision {prec[idx]:.3f}, recall is {rec[idx]:.3f},"</span>
          f<span class="str">" threshold = {thresh[idx-1] if idx > 0 else 0.5:.3f}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a heavily imbalanced synthetic dataset (1% positive). 2) Trains logistic regression with <code>class_weight="balanced"</code> which automatically reweights the loss to counter imbalance. 3) <code>precision_recall_curve</code> sweeps the threshold and returns (precision, recall, threshold) triples. 4) <code>average_precision_score</code> is the area under the PR curve, often called PR-AUC; on imbalanced data it is much more honest than ROC-AUC. 5) The last block shows how to pick a threshold operationally: "I need at least 80% precision -- what is the highest recall I can achieve?" This is the standard product-driven way to operationalize a classifier.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">ROC-AUC</div><div class="compare-item">X-axis: FPR; Y-axis: TPR</div><div class="compare-item">Insensitive to class imbalance proportionally -- can mislead under heavy imbalance</div><div class="compare-item">Random baseline = 0.5</div><div class="compare-item">Use when classes are balanced or both errors matter equally</div></div>
<div class="compare-col"><div class="compare-title">PR-AUC (avg_precision)</div><div class="compare-item">X-axis: Recall; Y-axis: Precision</div><div class="compare-item">Focused on positive class -- honest under heavy imbalance</div><div class="compare-item">Random baseline = positive class fraction</div><div class="compare-item">Use when positives are rare and you care about catching them</div></div>
</div>

<div id="plot-l6-pr-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A precision-recall curve. The horizontal axis is recall, the vertical is precision; as we drop the decision threshold, recall climbs (we catch more positives) but precision often falls (false alarms creep in). The area under this curve is the average precision. The horizontal dashed line at 1% is the "random classifier" baseline -- on a 1%-positive dataset, a random guess gets 1% precision regardless of recall. A useful classifier sits well above that baseline. PR curves are the right visualization for needle-in-haystack problems like fraud, anomaly, and rare-disease screening.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP toxic-comment detection</div><div class="example-body">In a comment moderation system, ~2% of comments are toxic. ROC-AUC of 0.95 sounds great but hides reality: at the threshold that gives 95% recall, precision could be 10% (90% of flags are wrong, moderators rage-quit). PR-AUC and "precision at 80% recall" are the right metrics. Always plot both ROC and PR for imbalanced NLP problems -- if their pictures disagree, the PR picture is the truth.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Multi-class Metrics: Macro, Micro, and Weighted Averages</h2>

<p class="l-text">For multi-class problems (3+ classes), each metric (precision, recall, F1) is defined per class. To get a single number we have three averaging schemes:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Macro average</div><div class="card-body">Compute metric per class, then take simple mean. Treats all classes equally, even rare ones.</div></div>
<div class="calc-card"><div class="card-title">Weighted average</div><div class="card-body">Per-class metric weighted by support (number of samples). Reflects overall data distribution.</div></div>
<div class="calc-card"><div class="card-title">Micro average</div><div class="card-body">Pool TP/FP/FN globally then compute the metric. For multi-class, often equals accuracy.</div></div>
<div class="calc-card"><div class="card-title">Per-class</div><div class="card-body">Just report each class separately. Most informative; classification_report gives this for free.</div></div>
<div class="calc-card"><div class="card-title">When to use macro</div><div class="card-body">All classes are equally important; rare classes matter as much as frequent ones.</div></div>
<div class="calc-card"><div class="card-title">When to use weighted</div><div class="card-body">Classes have natural importance proportional to their frequency.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_digits
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> (classification_report, confusion_matrix,
                             precision_score, recall_score, f1_score)

digits = <span class="fn">load_digits</span>()
X, y = digits.data, digits.target
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>, stratify=y)
clf = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()),
                (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>))]).<span class="fn">fit</span>(X_tr, y_tr)
y_pred = clf.<span class="fn">predict</span>(X_te)

<span class="cm"># All averages at once</span>
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_te, y_pred, digits=<span class="num">3</span>))

<span class="cm"># Specific averages</span>
<span class="fn">print</span>(f<span class="str">"Macro F1   : {f1_score(y_te, y_pred, average='macro'):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Weighted F1: {f1_score(y_te, y_pred, average='weighted'):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Micro F1   : {f1_score(y_te, y_pred, average='micro'):.3f}"</span>)
<span class="cm"># For balanced multi-class, all three are usually similar</span>
<span class="cm"># For imbalanced, macro and weighted diverge</span>

<span class="cm"># Multi-class confusion matrix (10x10)</span>
cm = <span class="fn">confusion_matrix</span>(y_te, y_pred)
<span class="fn">print</span>(<span class="str">"Confusion matrix shape:"</span>, cm.shape)   <span class="cm"># (10, 10)</span>
<span class="cm"># Diagonal entries are correct, off-diagonal are confusions</span>
<span class="cm"># cm[i, j] = number of samples truly i predicted as j</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads digits (10-class, 8x8 grayscale) for a real multi-class problem. 2) <code>classification_report</code> shows precision/recall/F1 for each of the 10 classes, plus the three averaging schemes. 3) <code>average='macro'</code> computes per-class F1 and averages -- equally weighting digits 0 through 9. 4) <code>average='weighted'</code> weights each class's F1 by how many examples that class has -- a class with 10 samples has 10x less impact than one with 100. 5) <code>average='micro'</code> pools all TP/FP/FN globally before computing F1 -- in multi-class single-label classification, this is mathematically equal to accuracy. 6) The 10x10 confusion matrix tells you which digits are confused: <code>cm[8, 3]</code> = how often a true 8 is predicted as 3. Inspecting these reveals systematic errors, e.g. 4 vs 9 or 3 vs 8 in handwriting.</p>

<div id="plot-l6-cmmulti-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A 10-class confusion matrix on the digits dataset. The strong diagonal indicates accurate predictions; off-diagonal cells show specific confusions. Notice the small darker cells near (4, 9) and (3, 8) -- handwritten 4 vs 9 and 3 vs 8 are classic confusions because of stroke similarity. This visualization gives you an instant diagnostic of where your model fails: if any off-diagonal cell is darker than expected, you have a targeted improvement opportunity (collect more samples of those classes, or add features to disambiguate them).</div>

<div class="l-warn"><strong>Multi-class ROC-AUC:</strong> sklearn supports it via <code>roc_auc_score(y_true, y_proba, multi_class='ovr')</code> (one-vs-rest) or <code>'ovo'</code> (one-vs-one). The OVR version is most common -- compute ROC-AUC per class against all others, then average. Always pair it with macro/weighted averaging.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Threshold Tuning and Probability Calibration</h2>

<p class="l-text">A classifier outputs probabilities, but predict() applies a hard threshold of 0.5. If your problem favors recall over precision (or vice versa), the optimal threshold is rarely 0.5. Threshold tuning lets you slide along the precision-recall curve to find the operating point that matches your business constraints.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> precision_recall_curve, f1_score
<span class="kw">from</span> sklearn.calibration <span class="kw">import</span> CalibratedClassifierCV, calibration_curve
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier

<span class="cm"># Use the imbalanced data from before</span>
y_proba = clf.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>]    <span class="cm"># assume binary problem</span>

<span class="cm"># Find the threshold that maximizes F1</span>
prec, rec, thresh = <span class="fn">precision_recall_curve</span>(y_te, y_proba)
f1_at_each = <span class="num">2</span> * prec * rec / (prec + rec + <span class="num">1e-9</span>)
best = np.<span class="fn">argmax</span>(f1_at_each)
<span class="fn">print</span>(f<span class="str">"Best threshold for F1: {thresh[best-1] if best > 0 else 0.5:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"  -> precision={prec[best]:.3f}, recall={rec[best]:.3f}, F1={f1_at_each[best]:.3f}"</span>)

<span class="cm"># Or pick threshold for fixed precision (e.g. 0.90)</span>
target = <span class="num">0.90</span>
ok = prec >= target
<span class="kw">if</span> ok.<span class="fn">any</span>():
    i = np.<span class="fn">argmax</span>(rec[ok])
    <span class="fn">print</span>(f<span class="str">"At precision >= {target}, max recall = {rec[ok][i]:.3f}"</span>)

<span class="cm"># Probability calibration: are predicted probabilities trustworthy?</span>
prob_true, prob_pred = <span class="fn">calibration_curve</span>(y_te, y_proba, n_bins=<span class="num">10</span>)
<span class="kw">for</span> pt, pp <span class="kw">in</span> <span class="fn">zip</span>(prob_true, prob_pred):
    <span class="fn">print</span>(f<span class="str">"  predicted ~{pp:.2f}, true positive fraction = {pt:.2f}"</span>)

<span class="cm"># Wrap a poorly-calibrated model in CalibratedClassifierCV</span>
rf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>)
calibrated = <span class="fn">CalibratedClassifierCV</span>(rf, method=<span class="str">"isotonic"</span>, cv=<span class="num">5</span>).<span class="fn">fit</span>(X_tr, y_tr)
<span class="cm"># Now calibrated.predict_proba returns better-calibrated probabilities</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Computes the F1 score at every threshold from the PR curve and picks the threshold that maximizes F1 -- an automatic, defensible operating point. 2) For asymmetric requirements ("precision must be at least 90%"), find the highest-recall threshold meeting that constraint. 3) <code>calibration_curve</code> bins predictions by predicted probability and reports the actual positive rate in each bin -- a perfectly calibrated model has equal predicted and true rates (the diagonal). 4) Random forests and gradient boosting are notoriously poorly calibrated; logistic regression is naturally well-calibrated. 5) <code>CalibratedClassifierCV</code> wraps any classifier in an isotonic or sigmoid post-processor that learns the calibration curve and inverts it -- after fitting, <code>.predict_proba</code> returns trustworthy probabilities. Critical for any application where you need real probability estimates (ranking, expected-value decisions).</p>

<div class="calc-step"><strong>Calibration recipe:</strong> 1) Train your model normally. 2) Plot calibration curve on validation. 3) If curve deviates from diagonal, wrap in <code>CalibratedClassifierCV(estimator, cv=5, method="isotonic")</code>. 4) Re-plot calibration curve -- it should now hug the diagonal.</div>

<div id="plot-l6-calib-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Reliability diagrams for two classifiers. The dashed diagonal is perfect calibration -- predicted probability equals true positive rate. The orange line is a logistic regression: well calibrated, hugs the diagonal. The teal line is a random forest before calibration: confidently predicts probabilities near 0 and 1 even when reality is near 0.5 (the curve is S-shaped). After applying <code>CalibratedClassifierCV</code>, the random forest's curve would shift to align with the diagonal. For any application that uses probabilities directly (ranking, threshold tuning, expected-value cost-benefit analysis), calibration is non-negotiable.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: thesis-grade evaluation table</div><div class="example-body">For your master's thesis sentiment chapter, report a table per model: ROC-AUC, PR-AUC, F1 (macro), F1 at default threshold, F1 at threshold-tuned, calibration error (Brier score). Include 95% confidence intervals via 5-fold CV. This single table is what reviewers want to see; it shows you understand the difference between ranking quality (AUC), thresholded performance (F1), and probability quality (calibration). It is the level of rigor that separates published from rejected work.</div></div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Confusion matrix is the foundation: TP, FP, FN, TN tell the whole binary classification story.<br><strong>2.</strong> Accuracy is a beginner trap; switch to precision/recall/F1 the moment classes are imbalanced.<br><strong>3.</strong> ROC-AUC measures ranking quality, threshold-free. PR-AUC focuses on the positive class -- preferred for imbalanced data.<br><strong>4.</strong> For multi-class, choose between macro (treat all classes equally), weighted (proportional), or per-class (most informative).<br><strong>5.</strong> The threshold of 0.5 is rarely optimal. Tune it on validation data to maximize F1, or to satisfy a precision constraint.<br><strong>6.</strong> Use <code>classification_report</code> for a complete one-line summary; print confusion matrices to understand where errors live.<br><strong>7.</strong> Probability calibration is essential when probabilities are used downstream. Wrap RF/GBM in <code>CalibratedClassifierCV</code>.<br><strong>8.</strong> The metric you optimize is the metric you ship -- pick it before training, not after seeing the result.</div></div>
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

  // 1. Confusion matrix heatmap (binary)
  var elC = document.getElementById('plot-l6-cm-en');
  if (elC){
    var z = [[88,2],[1,52]];
    var t = {z:z, x:['Pred Neg','Pred Pos'], y:['True Neg','True Pos'], type:'heatmap',
             colorscale:[[0,'rgba(78,205,196,0.15)'],[1,T.accent]], showscale:true,
             text:[['TN: 88','FP: 2'],['FN: 1','TP: 52']], texttemplate:'%{text}', textfont:{color:'#ebe6dc',size:14}};
    var layout = Object.assign({}, common, {title:{text:'Confusion matrix: breast cancer (malignant=positive)',font:{color:T.text,size:14}},xaxis:{side:'top',gridcolor:T.grid},yaxis:{autorange:'reversed',gridcolor:T.grid},margin:{t:80,r:30,b:30,l:80},height:380});
    Plotly.newPlot('plot-l6-cm-en',[t],layout,{responsive:true,displayModeBar:false});
  }

  // 2. ROC curves
  var elR = document.getElementById('plot-l6-roc-en');
  if (elR){
    // synthetic ROC for two strong classifiers
    var fpr1=[], tpr1=[], fpr2=[], tpr2=[];
    for (var i=0;i<=200;i++){
      var t = i/200;
      // logreg-ish curve: AUC ~ 0.99
      fpr1.push(t);
      tpr1.push( 1 - Math.pow(1 - Math.pow(t, 0.05), 1.5) );
      // rf: AUC ~ 0.995
      fpr2.push(t);
      tpr2.push( 1 - Math.pow(1 - Math.pow(t, 0.03), 1.7) );
    }
    var t1 = {x:fpr1,y:tpr1,mode:'lines',type:'scatter',name:'LogReg (AUC=0.99)',line:{color:T.accent,width:3}};
    var t2 = {x:fpr2,y:tpr2,mode:'lines',type:'scatter',name:'RandomForest (AUC=0.995)',line:{color:'#4ecdc4',width:3,dash:'dot'}};
    var diag = {x:[0,1],y:[0,1],mode:'lines',type:'scatter',name:'Random',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'}};
    var layout = Object.assign({}, common, {title:{text:'ROC curves: two binary classifiers',font:{color:T.text,size:14}},xaxis:{title:'False positive rate',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},yaxis:{title:'True positive rate',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l6-roc-en',[diag,t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // 3. PR curve
  var elP = document.getElementById('plot-l6-pr-en');
  if (elP){
    var rec=[], prec=[];
    for (var i=0;i<=200;i++){
      var r = i/200;
      // PR curve typical shape: starts high precision, drops as recall grows
      var p = 0.95 * Math.exp(-2.5*r) + 0.05;
      if (p < 0.01) p = 0.01;
      rec.push(r); prec.push(p);
    }
    var t1 = {x:rec,y:prec,mode:'lines',type:'scatter',name:'Logreg (AP=0.42)',line:{color:T.accent,width:3}};
    var base = {x:[0,1],y:[0.01,0.01],mode:'lines',type:'scatter',name:'Random (positive rate ~1%)',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'}};
    var layout = Object.assign({}, common, {title:{text:'Precision-Recall curve (1% positive class)',font:{color:T.text,size:14}},xaxis:{title:'Recall',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},yaxis:{title:'Precision',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l6-pr-en',[t1,base],layout,{responsive:true,displayModeBar:false});
  }

  // 4. Multi-class confusion (10x10) on digits
  var elM = document.getElementById('plot-l6-cmmulti-en');
  if (elM){
    // Construct a synthetic 10x10 confusion matrix mostly diagonal with some realistic confusions
    var z=[];
    for (var i=0;i<10;i++){
      var row=[];
      for (var j=0;j<10;j++){
        if (i===j) row.push(40 + (i%3));
        else if ((i===4 && j===9) || (i===9 && j===4)) row.push(3);
        else if ((i===3 && j===8) || (i===8 && j===3)) row.push(2);
        else if ((i===5 && j===6) || (i===6 && j===5)) row.push(2);
        else row.push(((i*7+j*3)%2));
      }
      z.push(row);
    }
    var labels = ['0','1','2','3','4','5','6','7','8','9'];
    var t = {z:z,x:labels,y:labels,type:'heatmap',colorscale:[[0,'rgba(78,205,196,0.10)'],[0.1,'rgba(78,205,196,0.30)'],[1,T.accent]],showscale:true};
    var layout = Object.assign({}, common, {title:{text:'10-class confusion matrix (digits)',font:{color:T.text,size:14}},xaxis:{title:'Predicted class',side:'top',gridcolor:T.grid},yaxis:{title:'True class',autorange:'reversed',gridcolor:T.grid},margin:{t:80,r:30,b:30,l:80},height:440});
    Plotly.newPlot('plot-l6-cmmulti-en',[t],layout,{responsive:true,displayModeBar:false});
  }

  // 5. Calibration plot
  var elCal = document.getElementById('plot-l6-calib-en');
  if (elCal){
    var diag = {x:[0,1],y:[0,1],mode:'lines',type:'scatter',name:'Perfect',line:{color:'rgba(200,200,200,0.5)',width:1,dash:'dash'}};
    // logreg: well-calibrated
    var lx=[0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95];
    var ly=[0.06,0.14,0.27,0.34,0.46,0.54,0.64,0.76,0.84,0.94];
    var t1 = {x:lx,y:ly,mode:'lines+markers',type:'scatter',name:'LogReg (well calibrated)',line:{color:T.accent,width:3},marker:{size:8}};
    // rf: pulled to ends (over-confident)
    var rx=[0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95];
    var ry=[0.18,0.22,0.30,0.38,0.46,0.55,0.63,0.70,0.74,0.80];
    var t2 = {x:rx,y:ry,mode:'lines+markers',type:'scatter',name:'RF (uncalibrated)',line:{color:'#4ecdc4',width:3,dash:'dot'},marker:{size:8}};
    var layout = Object.assign({}, common, {title:{text:'Calibration: predicted vs actual positive rate',font:{color:T.text,size:14}},xaxis:{title:'Mean predicted probability',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1]},yaxis:{title:'Actual positive fraction',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l6-calib-en',[diag,t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elCtr = document.getElementById('plot-l6-cm-tr');
  if (elCtr){
    var z = [[88,2],[1,52]];
    var t = {z:z, x:['Tah Neg','Tah Poz'], y:['Gerc Neg','Gerc Poz'], type:'heatmap',
             colorscale:[[0,'rgba(78,205,196,0.15)'],[1,T.accent]], showscale:true,
             text:[['TN: 88','FP: 2'],['FN: 1','TP: 52']], texttemplate:'%{text}', textfont:{color:'#ebe6dc',size:14}};
    var layout = Object.assign({}, common, {title:{text:'Karisiklik matrisi: meme kanseri',font:{color:T.text,size:14}},xaxis:{side:'top',gridcolor:T.grid},yaxis:{autorange:'reversed',gridcolor:T.grid},margin:{t:80,r:30,b:30,l:80},height:380});
    Plotly.newPlot('plot-l6-cm-tr',[t],layout,{responsive:true,displayModeBar:false});
  }
  var elRtr = document.getElementById('plot-l6-roc-tr');
  if (elRtr){
    var fpr1=[], tpr1=[], fpr2=[], tpr2=[];
    for (var i=0;i<=200;i++){
      var t = i/200;
      fpr1.push(t); tpr1.push( 1 - Math.pow(1 - Math.pow(t, 0.05), 1.5) );
      fpr2.push(t); tpr2.push( 1 - Math.pow(1 - Math.pow(t, 0.03), 1.7) );
    }
    var t1 = {x:fpr1,y:tpr1,mode:'lines',type:'scatter',name:'LogReg (AUC=0.99)',line:{color:T.accent,width:3}};
    var t2 = {x:fpr2,y:tpr2,mode:'lines',type:'scatter',name:'RandomForest (AUC=0.995)',line:{color:'#4ecdc4',width:3,dash:'dot'}};
    var diag = {x:[0,1],y:[0,1],mode:'lines',type:'scatter',name:'Rastgele',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'}};
    var layout = Object.assign({}, common, {title:{text:'ROC egrileri: iki ikili siniflandirici',font:{color:T.text,size:14}},xaxis:{title:'Yanlis pozitif orani',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},yaxis:{title:'Dogru pozitif orani',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l6-roc-tr',[diag,t1,t2],layout,{responsive:true,displayModeBar:false});
  }
  var elPtr = document.getElementById('plot-l6-pr-tr');
  if (elPtr){
    var rec=[], prec=[];
    for (var i=0;i<=200;i++){
      var r = i/200;
      var p = 0.95 * Math.exp(-2.5*r) + 0.05;
      if (p < 0.01) p = 0.01;
      rec.push(r); prec.push(p);
    }
    var t1 = {x:rec,y:prec,mode:'lines',type:'scatter',name:'Logreg (AP=0.42)',line:{color:T.accent,width:3}};
    var base = {x:[0,1],y:[0.01,0.01],mode:'lines',type:'scatter',name:'Rastgele (poz~%1)',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'}};
    var layout = Object.assign({}, common, {title:{text:'Precision-Recall egrisi (%1 pozitif sinif)',font:{color:T.text,size:14}},xaxis:{title:'Recall',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},yaxis:{title:'Precision',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l6-pr-tr',[t1,base],layout,{responsive:true,displayModeBar:false});
  }
  var elMtr = document.getElementById('plot-l6-cmmulti-tr');
  if (elMtr){
    var z=[];
    for (var i=0;i<10;i++){
      var row=[];
      for (var j=0;j<10;j++){
        if (i===j) row.push(40 + (i%3));
        else if ((i===4 && j===9) || (i===9 && j===4)) row.push(3);
        else if ((i===3 && j===8) || (i===8 && j===3)) row.push(2);
        else if ((i===5 && j===6) || (i===6 && j===5)) row.push(2);
        else row.push(((i*7+j*3)%2));
      }
      z.push(row);
    }
    var labels = ['0','1','2','3','4','5','6','7','8','9'];
    var t = {z:z,x:labels,y:labels,type:'heatmap',colorscale:[[0,'rgba(78,205,196,0.10)'],[0.1,'rgba(78,205,196,0.30)'],[1,T.accent]],showscale:true};
    var layout = Object.assign({}, common, {title:{text:'10-sinif karisiklik matrisi (digits)',font:{color:T.text,size:14}},xaxis:{title:'Tahmin edilen sinif',side:'top',gridcolor:T.grid},yaxis:{title:'Gercek sinif',autorange:'reversed',gridcolor:T.grid},margin:{t:80,r:30,b:30,l:80},height:440});
    Plotly.newPlot('plot-l6-cmmulti-tr',[t],layout,{responsive:true,displayModeBar:false});
  }
  var elCaltr = document.getElementById('plot-l6-calib-tr');
  if (elCaltr){
    var diag = {x:[0,1],y:[0,1],mode:'lines',type:'scatter',name:'Mukemmel',line:{color:'rgba(200,200,200,0.5)',width:1,dash:'dash'}};
    var lx=[0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95];
    var ly=[0.06,0.14,0.27,0.34,0.46,0.54,0.64,0.76,0.84,0.94];
    var t1 = {x:lx,y:ly,mode:'lines+markers',type:'scatter',name:'LogReg (iyi kalibre)',line:{color:T.accent,width:3},marker:{size:8}};
    var rx=[0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95];
    var ry=[0.18,0.22,0.30,0.38,0.46,0.55,0.63,0.70,0.74,0.80];
    var t2 = {x:rx,y:ry,mode:'lines+markers',type:'scatter',name:'RF (kalibresiz)',line:{color:'#4ecdc4',width:3,dash:'dot'},marker:{size:8}};
    var layout = Object.assign({}, common, {title:{text:'Kalibrasyon: tahmin vs gercek pozitif orani',font:{color:T.text,size:14}},xaxis:{title:'Ortalama tahmin olasiligi',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1]},yaxis:{title:'Gercek pozitif orani',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l6-calib-tr',[diag,t1,t2],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>`,

tr: `<p class="l-text"><strong>Tek başına doğruluk yeni başlayanın metriğidir.</strong> Sınıflarınız dengesiz hâle geldiği an doğruluk yalan söyler; hata maliyetleri farklılaştığı an doğruluk yalan söyler; eşik ayarlamanız gereken an doğruluk yalan söyler. Gerçek ML yapmak için gerçeği söyleyen metrik ailesinde akıcılığa ihtiyacınız var: precision, recall, F1, ROC-AUC, PR-AUC, log-loss ve Brier skoru. Küçük bir araç kutusu oluştururlar -- probleminiz için hangisinin tam olarak doğru olduğunu bilmek tez kalitesinde bir değerlendirmeyi bir demodan ayıran şeydir.</p>

<p class="l-text">Bu derste her şeyi <strong>karışıklık matrisine</strong> bağlıyoruz -- tüm sınıflandırma metriklerinin türetildiği 2x2 tablo. Sonra ikili metrikler (precision, recall, F1, ROC-AUC, PR-AUC), çok sınıflı uzantılar (macro/micro/weighted), eşik ayarlama ve olasılık kalibrasyonu üzerinden yürüyoruz. Her formül bir kod parçası ve bir grafikle eşleştirilmiştir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Karışıklık matrisini oku; precision/recall/F1 hesapla</li><li>ROC eğrisini çiz ve AUC'yi yorumla</li><li>Dengesiz veri için precision-recall eğrisi kullan</li><li>Çok sınıflı için doğru ortalama yöntemini seç (macro/micro/weighted)</li><li>Maliyete duyarlı tahminler için karar eşiğini ayarla</li><li>Reliability diagram ile olasılık kalibrasyonunu kontrol et</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Karışıklık Matrisi: Her Şeyin Temeli</h2>

<p class="l-text">İkili sınıflandırma için tahminler ve gerçek dört kovaya düşer:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">TP (Doğru Pozitif)</div><div class="card-body">Model pozitif dedi, gerçek pozitifti. "Kazanç" hücresi.</div></div>
<div class="calc-card"><div class="card-title">FP (Yanlış Pozitif)</div><div class="card-body">Model pozitif dedi, gerçek negatifti. "Yanlış alarm" -- tip-I hata.</div></div>
<div class="calc-card"><div class="card-title">FN (Yanlış Negatif)</div><div class="card-body">Model negatif dedi, gerçek pozitifti. "Kaçırma" -- tip-II hata.</div></div>
<div class="calc-card"><div class="card-title">TN (Doğru Negatif)</div><div class="card-body">Model negatif dedi, gerçek negatifti. Diğer "kazanç" hücresi.</div></div>
<div class="calc-card"><div class="card-title">Toplam pozitif</div><div class="card-body">P = TP + FN. Veride gerçek pozitiflerin sayısı.</div></div>
<div class="calc-card"><div class="card-title">Toplam negatif</div><div class="card-body">N = TN + FP. Veride gerçek negatiflerin sayısı.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> confusion_matrix

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
y = <span class="num">1</span> - y   <span class="cm"># netlik icin pozitifi malign yapiyoruz</span>
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>, stratify=y)

pipe = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()),
                 (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>))]).<span class="fn">fit</span>(X_tr, y_tr)
y_pred = pipe.<span class="fn">predict</span>(X_te)

cm = <span class="fn">confusion_matrix</span>(y_te, y_pred)
<span class="fn">print</span>(cm)

tn, fp, fn, tp = cm.<span class="fn">ravel</span>()
<span class="fn">print</span>(f<span class="str">"TP = {tp}  (dogru tespit malign)"</span>)
<span class="fn">print</span>(f<span class="str">"FP = {fp}  (yanlis alarmlar)"</span>)
<span class="fn">print</span>(f<span class="str">"FN = {fn}  (kacirilan kanser !)"</span>)
<span class="fn">print</span>(f<span class="str">"TN = {tn}  (dogru tespit benign)"</span>)</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Breast-cancer'ı yükler ve etiketleri çevirir, böylece 1 = malign ("ilginç" sınıf). Bu konvansiyon önemlidir: tıbbi ML'de hastalık geleneksel olarak pozitif sınıftır. 2) Lojistik regresyon eğitir ve testte tahmin eder. 3) <code>confusion_matrix(y_true, y_pred)</code> bir 2x2 NumPy dizisi döndürür; satırlar gerçek etiketler, sütunlar tahmin edilen etiketlerdir. Konvansiyon: satır 0 = gerçek negatif, satır 1 = gerçek pozitif. 4) <code>cm.ravel()</code> satır-büyük sırayla (TN, FP, FN, TP) düzleştirir -- bu sırayı ezberleyin yoksa kendi sonuçlarınızı yanlış okursunuz. 5) Sözel etiketler her hücrenin bağlamda ne anlama geldiğini netleştirir; buradaki bir FN tanı konmamış bir kanserdir, FP'den (takip muayenesine gönderilen yanlış alarm) çok daha pahalıdır.</p>

<div id="plot-l6-cm-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin verdiği mesaj:</strong> Karışıklık matrisi bir ısı haritası olarak. Köşegen hücreler (TN ve TP) doğru tahminlerdir; köşegen-dışı hücreler (FP ve FN) hatalardır. Renk yoğunluğu hücre sayısıyla ölçeklenir, dolayısıyla "iyi" bir sınıflandırıcı ağır bir köşegen ve soluk bir köşegen-dışı gösterir. Bu tek görselleştirme size her şeyi söyler: toplam doğruluk, modelin yaptığı hata türü ve hataların dengeli mi yoksa yanlış alarmlara mı yoksa kaçırmalara mı yatkın olduğu.</div>

<div class="l-warn"><strong>sklearn konvansiyonu:</strong> karışıklık matrisinde satırlar = gerçek sınıf ve sütunlar = tahmin edilen sınıf. Bazı ders kitapları ve Wikipedia tersini kullanır (satırlar tahmin, sütunlar gerçek). Dış kaynaklarla karşılaştırırken daima yönlendirmeyi kontrol edin -- aksi takdirde precision ve recall'u değiştirip sunumda kendinizi mahcup edersiniz.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Precision, Recall, F1 ve Specificity</h2>

<p class="l-text">Karışıklık matrisinin dört hücresinden kanonik metrikler:</p>

<div class="katex-block">$$\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}$$</div>

<div class="katex-block">$$\\text{Precision} = \\frac{TP}{TP + FP}, \\quad \\text{Recall} = \\frac{TP}{TP + FN}, \\quad F_1 = \\frac{2 \\cdot P \\cdot R}{P + R}$$</div>

<div class="katex-block">$$\\text{Specificity} = \\frac{TN}{TN + FP}, \\quad \\text{Sensitivity} = \\text{Recall} = \\frac{TP}{TP+FN}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğruluk</div><div class="card-body">Genel olarak doğru tahminlerin oranı. Yalnızca sınıflar dengeli ve hatalar aynı maliyette olduğunda yararlıdır.</div></div>
<div class="calc-card"><div class="card-title">Precision</div><div class="card-body">Tüm pozitif tahminlerden kaçı gerçekten pozitifti? "Bağırdığımda haklı mıyım?"</div></div>
<div class="calc-card"><div class="card-title">Recall (Hassasiyet, TPR)</div><div class="card-body">Tüm gerçek pozitiflerden kaçını yakaladım? "Gerçek vakalardan kaçını buldum?"</div></div>
<div class="calc-card"><div class="card-title">F1 skoru</div><div class="card-body">P ve R'nin harmonik ortalaması. Aralarında aşırı dengesizliği olan modelleri cezalandırır.</div></div>
<div class="calc-card"><div class="card-title">Specificity (TNR)</div><div class="card-body">Tüm gerçek negatiflerden kaçını doğru reddettim? Recall'un aynası.</div></div>
<div class="calc-card"><div class="card-title">Takas</div><div class="card-body">P ve R birbirine karşı takas eder: eşiği düşürmek daha çok pozitif yakalar (R yukarı) ama yanlış alarm ekler (P aşağı).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> (accuracy_score, precision_score, recall_score,
                             f1_score, classification_report, fbeta_score)

acc = <span class="fn">accuracy_score</span>(y_te, y_pred)
prec = <span class="fn">precision_score</span>(y_te, y_pred)
rec  = <span class="fn">recall_score</span>(y_te, y_pred)
f1   = <span class="fn">f1_score</span>(y_te, y_pred)
spec = <span class="fn">recall_score</span>(y_te, y_pred, pos_label=<span class="num">0</span>)
<span class="fn">print</span>(f<span class="str">"Dogruluk     : {acc:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Precision    : {prec:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Recall       : {rec:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"F1           : {f1:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Specificity  : {spec:.3f}"</span>)

<span class="fn">print</span>(<span class="fn">classification_report</span>(y_te, y_pred, target_names=[<span class="str">"benign"</span>, <span class="str">"malign"</span>]))

<span class="cm"># F-beta -- recall agirlikli F2</span>
f2 = <span class="fn">fbeta_score</span>(y_te, y_pred, beta=<span class="num">2</span>)
<span class="fn">print</span>(f<span class="str">"F2 (recall-yanli): {f2:.3f}"</span>)</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Dört klasik ikili metriği ayrı ayrı hesaplar. 2) <code>recall_score(..., pos_label=0)</code> specificity'yi (negatif sınıf üzerinde ölçülen recall) almak için temiz bir yoldur. 3) <code>classification_report</code> her iki sınıf için precision/recall/F1/support artı macro ve weighted ortalamaları yazdıran tek satırdır -- tez sonuç tablosu için ideal. 4) <code>fbeta_score</code> F1'i genelleştirir: <code>beta=2</code> recall'u precision'ın iki katı ağırlıkla tartar (tıbbi tarama için kullanın), <code>beta=0.5</code> precision'ı daha çok tartar (yüksek riskli yanlış alarm senaryoları için kullanın). 5) Doğru metriği seçmek alanınıza bağlıdır: kanser taraması recall'u önemser (tümörü kaçırmayın), spam filtreleme precision'ı önemser (meşru e-postayı işaretlemeyin).</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Precision'ı optimize et</div><div class="compare-item">Yanlış alarmlar pahalıysa (spam filtreleri, tıbbi yeniden test)</div><div class="compare-item">Bazı pozitifleri kaçırmayı göze alabilirseniz</div><div class="compare-item">Negatifler pozitiflerden ağır basıyorsa</div><div class="compare-item">F1 veya F0.5 skoru kullanın</div></div>
<div class="compare-col"><div class="compare-title">Recall'u optimize et</div><div class="compare-item">Pozitifleri kaçırmak pahalıysa (kanser, dolandırıcılık, güvenlik)</div><div class="compare-item">Bazı yanlış alarmlar kabul edilebilirse</div><div class="compare-item">Az pozitifi yakalamak amaç</div><div class="compare-item">F2 skoru veya sabit precision'da recall</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP sahte haber tespiti</div><div class="example-body">Sahte haber başlıklarını işaretliyorsanız, yanlış pozitifler (sahte olarak işaretlenen gerçek haber) itibar zararıdır, yanlış negatifler (kaçan sahte haber) gerçek zarar verir. Doğru metrik doğruluk değil bir eğridir: <em>%95 precision'da recall</em> raporlayın -- "gerçek haberlerin yalnızca %5'ini yanlış etiketlerken sahte haberin X%'ini yakalıyoruz". Bu tek sayı yorumlanabilir ve ürün kısıtlamalarıyla hizalıdır.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ROC Eğrisi ve AUC</h2>

<p class="l-text">Şimdiye kadarki tüm metrikler sabit bir eşiğe (varsayılan 0.5) bağlıdır. Ama sınıflandırıcılar olasılık çıktısı verir ve eşiği seçmek ayrı bir sorudur. <strong>ROC eğrisi</strong> eşik 1'den 0'a süpürdükçe TPR (recall) ile FPR (1 - specificity) arasındaki takası çizer:</p>

<div class="katex-block">$$\\text{TPR} = \\frac{TP}{TP+FN}, \\quad \\text{FPR} = \\frac{FP}{FP+TN}$$</div>

<p class="l-text"><strong>AUC</strong> (ROC Eğrisinin Altındaki Alan) eğrinin integralidir. Sınıflandırıcının pozitifleri negatiflerin üzerinde ne kadar iyi sıraladığının eşik-bağımsız bir ölçüsüdür:</p>

<div class="katex-block">$$\\text{AUC} = \\int_0^1 \\text{TPR}(\\text{FPR}) \\, d(\\text{FPR}) = P(\\hat{p}_+ > \\hat{p}_-)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">AUC = 0.5</div><div class="card-body">Rastgele sınıflandırıcı. Köşegen çizgi.</div></div>
<div class="calc-card"><div class="card-title">AUC = 1.0</div><div class="card-body">Mükemmel sınıflandırıcı. Eğri sol üst köşeyi sarar.</div></div>
<div class="calc-card"><div class="card-title">AUC = 0.0</div><div class="card-body">Anti-mükemmel. Tahminleri çevirin, mükemmel sınıflandırıcı olur.</div></div>
<div class="calc-card"><div class="card-title">Eşiksiz</div><div class="card-body">AUC TÜM eşikleri tek bir sayıda özetler. Farklı eşikler eğri üzerinde farklı noktalara karşılık gelir.</div></div>
<div class="calc-card"><div class="card-title">Dengesizliğe dayanıklı</div><div class="card-body">Doğruluktan daha dayanıklı, ama ağır dengesizlikte PR-AUC tercih edilir.</div></div>
<div class="calc-card"><div class="card-title">Olasılıksal yorum</div><div class="card-body">P(rastgele pozitif rastgele negatiften daha yüksek skor aldı).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_curve, roc_auc_score
<span class="kw">import</span> numpy <span class="kw">as</span> np

y_proba = pipe.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>]

fpr, tpr, thresholds = <span class="fn">roc_curve</span>(y_te, y_proba)
auc = <span class="fn">roc_auc_score</span>(y_te, y_proba)
<span class="fn">print</span>(f<span class="str">"AUC = {auc:.4f}"</span>)

<span class="kw">for</span> i <span class="kw">in</span> [<span class="num">0</span>, <span class="fn">len</span>(thresholds)//<span class="num">4</span>, <span class="fn">len</span>(thresholds)//<span class="num">2</span>, -<span class="num">2</span>]:
    <span class="fn">print</span>(f<span class="str">"  esik={thresholds[i]:.3f}  TPR={tpr[i]:.3f}  FPR={fpr[i]:.3f}"</span>)

<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
rf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X_tr, y_tr)
fpr_rf, tpr_rf, _ = <span class="fn">roc_curve</span>(y_te, rf.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>])
auc_rf = <span class="fn">roc_auc_score</span>(y_te, rf.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>])
<span class="fn">print</span>(f<span class="str">"AUC (logreg) = {auc:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"AUC (rf)     = {auc_rf:.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>predict_proba(X)[:, 1]</code> pozitif sınıf için tahmin edilen olasılığı (sütun 1) alır. 2) <code>roc_curve(y_true, scores)</code> eşiği çok yüksekten (çoğunlukla negatif tahmin edildi) çok düşüğe (çoğunlukla pozitif tahmin edildi) süpürür ve her benzersiz skor için (FPR, TPR, eşik) üçlüleri döndürür. 3) <code>roc_auc_score</code> bu eğrinin altındaki alanı tek çağrıda hesaplar. 4) Döngü birkaç örnek (eşik, TPR, FPR) değerini yazdırır, böylece takası eylem hâlinde görebilirsiniz -- eşik düştükçe hem TPR hem FPR yükselir. 5) Aynı grafikte modelleri karşılaştırmak en yaygın ROC kullanım durumudur; A eğrisi B'nin her yerde üzerindeyse A baskındır. Çakışırlarsa hiçbir model evrensel olarak daha iyi değildir -- doğru seçim çalıştığınız eşiğe bağlıdır.</p>

<div id="plot-l6-roc-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Burada ne görüyoruz:</strong> Aynı eksenlerde iki ROC eğrisi -- meme kanserinde bir lojistik regresyon ve bir random forest. Her ikisi de sol üst köşeyi sarar, mükemmel sınıflandırıcılara işaret eder; AUC'leri 0.99+ ve görsel olarak ayırt edilemez. Kesikli köşegen "rastgele tahmin" baseline'ıdır (AUC=0.5). Eğriniz (0, 1)'e ne kadar yakınsa o kadar iyidir; eğrinin altındaki alan AUC'dir. ROC çizimleri ikili sınıflandırıcıları karşılaştırmak için standart görselleştirmedir.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Precision-Recall Eğrisi ve PR-AUC</h2>

<p class="l-text">Sınıflar ağır dengesizleştiğinde (%1 pozitif, %99 negatif), ROC-AUC yanıltıcı olabilir -- az pozitifi bazı negatiflerin üzerinde sıralayan bir sınıflandırıcı, çok fazla gerçek negatif olduğu için yine de yüksek AUC alır. Precision-Recall eğrisi yalnızca pozitif sınıfa odaklanır:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> precision_recall_curve, average_precision_score, roc_auc_score
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_classification
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">import</span> numpy <span class="kw">as</span> np

X_imb, y_imb = <span class="fn">make_classification</span>(n_samples=<span class="num">10000</span>, n_features=<span class="num">20</span>,
                                   weights=[<span class="num">0.99</span>, <span class="num">0.01</span>], random_state=<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">"Sinif dengesi:"</span>, np.<span class="fn">bincount</span>(y_imb))

X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X_imb, y_imb, random_state=<span class="num">42</span>, stratify=y_imb)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>, class_weight=<span class="str">"balanced"</span>).<span class="fn">fit</span>(X_tr, y_tr)
y_proba = clf.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>]

prec, rec, thresh = <span class="fn">precision_recall_curve</span>(y_te, y_proba)
ap = <span class="fn">average_precision_score</span>(y_te, y_proba)
<span class="fn">print</span>(f<span class="str">"Ortalama precision (PR-AUC): {ap:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"ROC AUC: {roc_auc_score(y_te, y_proba):.4f}"</span>)
<span class="cm"># Genellikle AUC 0.95+ ama AP yalnizca 0.50</span>

target_prec = <span class="num">0.80</span>
ok = prec >= target_prec
<span class="kw">if</span> ok.<span class="fn">any</span>():
    i = np.<span class="fn">argmax</span>(rec[ok])
    <span class="fn">print</span>(f<span class="str">"Precision >= {target_prec}'de max recall = {rec[ok][i]:.3f}"</span>)</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Ağır dengesiz sentetik bir veri seti kurar (%1 pozitif). 2) Dengesizliğe karşı kaybı otomatik yeniden ağırlıklandıran <code>class_weight="balanced"</code> ile lojistik regresyon eğitir. 3) <code>precision_recall_curve</code> eşiği süpürür ve (precision, recall, eşik) üçlüleri döndürür. 4) <code>average_precision_score</code> PR eğrisinin altındaki alandır, sıklıkla PR-AUC olarak adlandırılır; dengesiz veride ROC-AUC'den çok daha dürüsttür. 5) Son blok bir eşiği operasyonel olarak nasıl seçeceğinizi gösterir: "En az %80 precision'a ihtiyacım var -- ulaşabileceğim en yüksek recall nedir?" Bu bir sınıflandırıcıyı operasyonel hâle getirmenin standart ürün-odaklı yoludur.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">ROC-AUC</div><div class="compare-item">X-ekseni: FPR; Y-ekseni: TPR</div><div class="compare-item">Sınıf dengesizliğine orantılı olarak duyarsız -- ağır dengesizlikte yanıltabilir</div><div class="compare-item">Rastgele baseline = 0.5</div><div class="compare-item">Sınıflar dengeli veya her iki hata eşit önemliyse kullanın</div></div>
<div class="compare-col"><div class="compare-title">PR-AUC (avg_precision)</div><div class="compare-item">X-ekseni: Recall; Y-ekseni: Precision</div><div class="compare-item">Pozitif sınıfa odaklı -- ağır dengesizlikte dürüst</div><div class="compare-item">Rastgele baseline = pozitif sınıf oranı</div><div class="compare-item">Pozitifler nadir ve onları yakalamayı önemsiyorsanız kullanın</div></div>
</div>

<div id="plot-l6-pr-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Buradaki resim:</strong> Bir precision-recall eğrisi. Yatay eksen recall, dikey precision'dır; karar eşiğini düşürdükçe recall yükselir (daha çok pozitif yakalarız) ama precision sıklıkla düşer (yanlış alarmlar sızar). Bu eğrinin altındaki alan ortalama precision'dır. %1'deki yatay kesikli çizgi "rastgele sınıflandırıcı" baseline'ıdır -- %1-pozitif veri setinde rastgele tahmin recall'dan bağımsız %1 precision alır. Yararlı bir sınıflandırıcı bu baseline'ın çok üzerindedir. PR eğrileri dolandırıcılık, anomali ve nadir hastalık taraması gibi samanlıkta iğne problemleri için doğru görselleştirmedir.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP zehirli yorum tespiti</div><div class="example-body">Bir yorum moderasyon sisteminde yorumların ~%2'si zehirlidir. 0.95 ROC-AUC harika gibi gelir ama gerçeği gizler: %95 recall veren eşikte precision %10 olabilir (işaretlerin %90'ı yanlış, moderatörler öfke ile bırakır). PR-AUC ve "%80 recall'da precision" doğru metriklerdir. Dengesiz NLP problemleri için daima hem ROC hem PR çizin -- resimleri uyuşmuyorsa PR resmi doğrudur.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Çok Sınıflı Metrikler: Macro, Micro ve Weighted Ortalamalar</h2>

<p class="l-text">Çok sınıflı problemler için (3+ sınıf), her metrik (precision, recall, F1) sınıf başına tanımlanır. Tek bir sayı almak için üç ortalamalama şemamız vardır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Macro ortalama</div><div class="card-body">Sınıf başına metriği hesapla, sonra basit ortalama al. Tüm sınıflara eşit muamele eder, nadir olanlar bile.</div></div>
<div class="calc-card"><div class="card-title">Weighted ortalama</div><div class="card-body">Sınıf başına metrik support (örnek sayısı) ile ağırlıklandırılır. Genel veri dağılımını yansıtır.</div></div>
<div class="calc-card"><div class="card-title">Micro ortalama</div><div class="card-body">TP/FP/FN'yi global topla, sonra metriği hesapla. Çok sınıf için sıklıkla doğruluğa eşittir.</div></div>
<div class="calc-card"><div class="card-title">Sınıf başına</div><div class="card-body">Her sınıfı ayrı raporla. En bilgilendirici; classification_report bunu ücretsiz verir.</div></div>
<div class="calc-card"><div class="card-title">Macro ne zaman</div><div class="card-body">Tüm sınıflar eşit önemli; nadir sınıflar sık olanlar kadar önemli.</div></div>
<div class="calc-card"><div class="card-title">Weighted ne zaman</div><div class="card-body">Sınıfların doğal önemi frekanslarıyla orantılıdır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_digits
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report, confusion_matrix, f1_score

digits = <span class="fn">load_digits</span>()
X, y = digits.data, digits.target
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>, stratify=y)
clf = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()),
                (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>))]).<span class="fn">fit</span>(X_tr, y_tr)
y_pred = clf.<span class="fn">predict</span>(X_te)

<span class="fn">print</span>(<span class="fn">classification_report</span>(y_te, y_pred, digits=<span class="num">3</span>))

<span class="fn">print</span>(f<span class="str">"Macro F1   : {f1_score(y_te, y_pred, average='macro'):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Weighted F1: {f1_score(y_te, y_pred, average='weighted'):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Micro F1   : {f1_score(y_te, y_pred, average='micro'):.3f}"</span>)

cm = <span class="fn">confusion_matrix</span>(y_te, y_pred)
<span class="fn">print</span>(<span class="str">"Karisiklik matrisi sekli:"</span>, cm.shape)</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Gerçek bir çok sınıflı problem için digits'i (10-sınıf, 8x8 gri tonlama) yükler. 2) <code>classification_report</code> 10 sınıfın her biri için precision/recall/F1 ve üç ortalamalama şemasını gösterir. 3) <code>average='macro'</code> sınıf başına F1'i hesaplar ve ortalar -- 0'dan 9'a rakamları eşit ağırlıklandırır. 4) <code>average='weighted'</code> her sınıfın F1'ini o sınıfın kaç örneğe sahip olduğuyla ağırlıklandırır -- 10 örnekli sınıf 100'lü olandan 10x daha az etkiye sahiptir. 5) <code>average='micro'</code> F1'i hesaplamadan önce tüm TP/FP/FN'yi global toplar -- çok sınıflı tek etiket sınıflandırmada bu matematiksel olarak doğruluğa eşittir. 6) 10x10 karışıklık matrisi hangi rakamların karıştırıldığını söyler: <code>cm[8, 3]</code> = bir gerçek 8'in ne sıklıkla 3 olarak tahmin edildiği. Bunları incelemek sistematik hataları ortaya çıkarır, örneğin el yazısında 4 vs 9 veya 3 vs 8.</p>

<div id="plot-l6-cmmulti-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> Digits veri setinde 10-sınıflı bir karışıklık matrisi. Güçlü köşegen doğru tahminleri gösterir; köşegen-dışı hücreler belirli karışıklıkları gösterir. (4, 9) ve (3, 8) yakınındaki küçük daha koyu hücrelere dikkat edin -- el yazısı 4 vs 9 ve 3 vs 8 vuruş benzerliği nedeniyle klasik karışıklıklardır. Bu görselleştirme size modelinizin nerede başarısız olduğunun anlık bir teşhisini verir: herhangi bir köşegen-dışı hücre beklenenden koyuysa, hedeflenmiş bir iyileştirme fırsatınız var (o sınıfların daha çok örneğini toplayın veya onları ayırt etmek için özellik ekleyin).</div>

<div class="l-warn"><strong>Çok sınıflı ROC-AUC:</strong> sklearn bunu <code>roc_auc_score(y_true, y_proba, multi_class='ovr')</code> (one-vs-rest) veya <code>'ovo'</code> (one-vs-one) yoluyla destekler. OVR sürümü en yaygındır -- her sınıf için diğerlerine karşı ROC-AUC hesapla, sonra ortala. Daima macro/weighted ortalama ile eşleştirin.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Eşik Ayarlama ve Olasılık Kalibrasyonu</h2>

<p class="l-text">Bir sınıflandırıcı olasılık çıktısı verir, ama predict() 0.5'lik sert bir eşik uygular. Probleminiz precision yerine recall'u (veya tersini) tercih ederse, optimal eşik nadiren 0.5'tir. Eşik ayarlama precision-recall eğrisi boyunca kayarak iş kısıtlamalarınıza uyan çalışma noktasını bulmanıza izin verir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> precision_recall_curve
<span class="kw">from</span> sklearn.calibration <span class="kw">import</span> CalibratedClassifierCV, calibration_curve

y_proba = clf.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>]

prec, rec, thresh = <span class="fn">precision_recall_curve</span>(y_te, y_proba)
f1_at_each = <span class="num">2</span> * prec * rec / (prec + rec + <span class="num">1e-9</span>)
best = np.<span class="fn">argmax</span>(f1_at_each)
<span class="fn">print</span>(f<span class="str">"F1 icin en iyi esik: {thresh[best-1] if best > 0 else 0.5:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"  -> precision={prec[best]:.3f}, recall={rec[best]:.3f}, F1={f1_at_each[best]:.3f}"</span>)

target = <span class="num">0.90</span>
ok = prec >= target
<span class="kw">if</span> ok.<span class="fn">any</span>():
    i = np.<span class="fn">argmax</span>(rec[ok])
    <span class="fn">print</span>(f<span class="str">"Precision >= {target}'da max recall = {rec[ok][i]:.3f}"</span>)

prob_true, prob_pred = <span class="fn">calibration_curve</span>(y_te, y_proba, n_bins=<span class="num">10</span>)
<span class="kw">for</span> pt, pp <span class="kw">in</span> <span class="fn">zip</span>(prob_true, prob_pred):
    <span class="fn">print</span>(f<span class="str">"  tahmin ~{pp:.2f}, gercek pozitif orani = {pt:.2f}"</span>)

<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
rf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>)
calibrated = <span class="fn">CalibratedClassifierCV</span>(rf, method=<span class="str">"isotonic"</span>, cv=<span class="num">5</span>).<span class="fn">fit</span>(X_tr, y_tr)</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) PR eğrisinden her eşikteki F1 skorunu hesaplar ve F1'i maksimize eden eşiği seçer -- otomatik, savunulabilir bir çalışma noktası. 2) Asimetrik gereksinimler için ("precision en az %90 olmalı"), bu kısıtlamayı karşılayan en yüksek recall eşiğini bulun. 3) <code>calibration_curve</code> tahminleri tahmin edilen olasılığa göre kovalar ve her kovadaki gerçek pozitif oranını raporlar -- mükemmel kalibre edilmiş bir model eşit tahmin ve gerçek oranlara sahiptir (köşegen). 4) Random forest'lar ve gradient boosting kötü kalibre edilmiş olarak ünlüdür; lojistik regresyon doğal olarak iyi kalibre edilmiştir. 5) <code>CalibratedClassifierCV</code> herhangi bir sınıflandırıcıyı kalibrasyon eğrisini öğrenen ve tersine çeviren bir izotonik veya sigmoid son işlemciye sarar -- uydurduktan sonra <code>.predict_proba</code> güvenilir olasılıklar döndürür. Gerçek olasılık tahminlerine ihtiyacınız olan herhangi bir uygulama için kritik (sıralama, beklenen değer kararları).</p>

<div class="calc-step"><strong>Kalibrasyon tarifi:</strong> 1) Modelinizi normal eğitin. 2) Doğrulamada kalibrasyon eğrisi çizin. 3) Eğri köşegenden saparsa, <code>CalibratedClassifierCV(estimator, cv=5, method="isotonic")</code>'a sarın. 4) Kalibrasyon eğrisini yeniden çizin -- şimdi köşegeni sarıyor olmalıdır.</div>

<div id="plot-l6-calib-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Buradaki resim:</strong> İki sınıflandırıcı için güvenilirlik diyagramları. Kesikli köşegen mükemmel kalibrasyondur -- tahmin edilen olasılık gerçek pozitif oranına eşittir. Turuncu çizgi bir lojistik regresyondur: iyi kalibre edilmiş, köşegeni sarar. Turkuaz çizgi kalibrasyondan önceki random forest'tır: gerçek 0.5'e yakın olduğunda bile 0 ve 1'e yakın olasılıkları kendinden emin tahmin eder (eğri S şeklindedir). <code>CalibratedClassifierCV</code> uygulandıktan sonra random forest'ın eğrisi köşegenle hizalanmak için kayar. Olasılıkları doğrudan kullanan herhangi bir uygulama için (sıralama, eşik ayarlama, beklenen değer maliyet-fayda analizi), kalibrasyon vazgeçilmezdir.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: yayın kalitesinde değerlendirme tablosu</div><div class="example-body">Duygu analizi raporunuz için her model için bir tablo raporlayın: ROC-AUC, PR-AUC, F1 (macro), varsayılan eşikte F1, eşik-ayarlanmış F1, kalibrasyon hatası (Brier skoru). 5-fold CV yoluyla %95 güven aralıkları dahil edin. Bu tek tablo hakemlerin görmek istediğidir; sıralama kalitesi (AUC), eşiklenmiş performans (F1) ve olasılık kalitesi (kalibrasyon) arasındaki farkı anladığınızı gösterir. Yayınlanan ile reddedilen işi ayıran titizlik seviyesidir.</div></div>

<div class="think-box"><div class="think-label">ÖZET ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Karışıklık matrisi temeldir: TP, FP, FN, TN tüm ikili sınıflandırma hikayesini anlatır.<br><strong>2.</strong> Doğruluk yeni başlayan tuzağıdır; sınıflar dengesizleştiği an precision/recall/F1'e geçin.<br><strong>3.</strong> ROC-AUC sıralama kalitesini ölçer, eşik-bağımsız. PR-AUC pozitif sınıfa odaklanır -- dengesiz veri için tercih edilir.<br><strong>4.</strong> Çok sınıf için macro (tüm sınıflara eşit muamele), weighted (orantısal) veya sınıf-başına (en bilgilendirici) arasında seçin.<br><strong>5.</strong> 0.5 eşiği nadiren optimaldir. F1'i maksimize etmek veya bir precision kısıtlamasını karşılamak için doğrulama verisinde ayarlayın.<br><strong>6.</strong> Tam tek satırlı özet için <code>classification_report</code> kullanın; hataların nerede yaşadığını anlamak için karışıklık matrislerini yazdırın.<br><strong>7.</strong> Olasılıklar aşağı akışta kullanıldığında olasılık kalibrasyonu elzemdir. RF/GBM'yi <code>CalibratedClassifierCV</code>'ye sarın.<br><strong>8.</strong> Optimize ettiğiniz metrik dağıttığınız metriktir -- sonucu görmeden önce eğitimden önce seçin.</div></div>
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

  // 1. Confusion matrix heatmap (binary)
  var elC = document.getElementById('plot-l6-cm-en');
  if (elC){
    var z = [[88,2],[1,52]];
    var t = {z:z, x:['Pred Neg','Pred Pos'], y:['True Neg','True Pos'], type:'heatmap',
             colorscale:[[0,'rgba(78,205,196,0.15)'],[1,T.accent]], showscale:true,
             text:[['TN: 88','FP: 2'],['FN: 1','TP: 52']], texttemplate:'%{text}', textfont:{color:'#ebe6dc',size:14}};
    var layout = Object.assign({}, common, {title:{text:'Confusion matrix: breast cancer (malignant=positive)',font:{color:T.text,size:14}},xaxis:{side:'top',gridcolor:T.grid},yaxis:{autorange:'reversed',gridcolor:T.grid},margin:{t:80,r:30,b:30,l:80},height:380});
    Plotly.newPlot('plot-l6-cm-en',[t],layout,{responsive:true,displayModeBar:false});
  }

  // 2. ROC curves
  var elR = document.getElementById('plot-l6-roc-en');
  if (elR){
    // synthetic ROC for two strong classifiers
    var fpr1=[], tpr1=[], fpr2=[], tpr2=[];
    for (var i=0;i<=200;i++){
      var t = i/200;
      // logreg-ish curve: AUC ~ 0.99
      fpr1.push(t);
      tpr1.push( 1 - Math.pow(1 - Math.pow(t, 0.05), 1.5) );
      // rf: AUC ~ 0.995
      fpr2.push(t);
      tpr2.push( 1 - Math.pow(1 - Math.pow(t, 0.03), 1.7) );
    }
    var t1 = {x:fpr1,y:tpr1,mode:'lines',type:'scatter',name:'LogReg (AUC=0.99)',line:{color:T.accent,width:3}};
    var t2 = {x:fpr2,y:tpr2,mode:'lines',type:'scatter',name:'RandomForest (AUC=0.995)',line:{color:'#4ecdc4',width:3,dash:'dot'}};
    var diag = {x:[0,1],y:[0,1],mode:'lines',type:'scatter',name:'Random',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'}};
    var layout = Object.assign({}, common, {title:{text:'ROC curves: two binary classifiers',font:{color:T.text,size:14}},xaxis:{title:'False positive rate',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},yaxis:{title:'True positive rate',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l6-roc-en',[diag,t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // 3. PR curve
  var elP = document.getElementById('plot-l6-pr-en');
  if (elP){
    var rec=[], prec=[];
    for (var i=0;i<=200;i++){
      var r = i/200;
      // PR curve typical shape: starts high precision, drops as recall grows
      var p = 0.95 * Math.exp(-2.5*r) + 0.05;
      if (p < 0.01) p = 0.01;
      rec.push(r); prec.push(p);
    }
    var t1 = {x:rec,y:prec,mode:'lines',type:'scatter',name:'Logreg (AP=0.42)',line:{color:T.accent,width:3}};
    var base = {x:[0,1],y:[0.01,0.01],mode:'lines',type:'scatter',name:'Random (positive rate ~1%)',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'}};
    var layout = Object.assign({}, common, {title:{text:'Precision-Recall curve (1% positive class)',font:{color:T.text,size:14}},xaxis:{title:'Duyarlılık',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},yaxis:{title:'Kesinlik',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l6-pr-en',[t1,base],layout,{responsive:true,displayModeBar:false});
  }

  // 4. Multi-class confusion (10x10) on digits
  var elM = document.getElementById('plot-l6-cmmulti-en');
  if (elM){
    // Construct a synthetic 10x10 confusion matrix mostly diagonal with some realistic confusions
    var z=[];
    for (var i=0;i<10;i++){
      var row=[];
      for (var j=0;j<10;j++){
        if (i===j) row.push(40 + (i%3));
        else if ((i===4 && j===9) || (i===9 && j===4)) row.push(3);
        else if ((i===3 && j===8) || (i===8 && j===3)) row.push(2);
        else if ((i===5 && j===6) || (i===6 && j===5)) row.push(2);
        else row.push(((i*7+j*3)%2));
      }
      z.push(row);
    }
    var labels = ['0','1','2','3','4','5','6','7','8','9'];
    var t = {z:z,x:labels,y:labels,type:'heatmap',colorscale:[[0,'rgba(78,205,196,0.10)'],[0.1,'rgba(78,205,196,0.30)'],[1,T.accent]],showscale:true};
    var layout = Object.assign({}, common, {title:{text:'10-class confusion matrix (digits)',font:{color:T.text,size:14}},xaxis:{title:'Predicted class',side:'top',gridcolor:T.grid},yaxis:{title:'True class',autorange:'reversed',gridcolor:T.grid},margin:{t:80,r:30,b:30,l:80},height:440});
    Plotly.newPlot('plot-l6-cmmulti-en',[t],layout,{responsive:true,displayModeBar:false});
  }

  // 5. Calibration plot
  var elCal = document.getElementById('plot-l6-calib-en');
  if (elCal){
    var diag = {x:[0,1],y:[0,1],mode:'lines',type:'scatter',name:'Perfect',line:{color:'rgba(200,200,200,0.5)',width:1,dash:'dash'}};
    // logreg: well-calibrated
    var lx=[0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95];
    var ly=[0.06,0.14,0.27,0.34,0.46,0.54,0.64,0.76,0.84,0.94];
    var t1 = {x:lx,y:ly,mode:'lines+markers',type:'scatter',name:'LogReg (well calibrated)',line:{color:T.accent,width:3},marker:{size:8}};
    // rf: pulled to ends (over-confident)
    var rx=[0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95];
    var ry=[0.18,0.22,0.30,0.38,0.46,0.55,0.63,0.70,0.74,0.80];
    var t2 = {x:rx,y:ry,mode:'lines+markers',type:'scatter',name:'RF (uncalibrated)',line:{color:'#4ecdc4',width:3,dash:'dot'},marker:{size:8}};
    var layout = Object.assign({}, common, {title:{text:'Calibration: predicted vs actual positive rate',font:{color:T.text,size:14}},xaxis:{title:'Mean predicted probability',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1]},yaxis:{title:'Actual positive fraction',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l6-calib-en',[diag,t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elCtr = document.getElementById('plot-l6-cm-tr');
  if (elCtr){
    var z = [[88,2],[1,52]];
    var t = {z:z, x:['Tah Neg','Tah Poz'], y:['Gerc Neg','Gerc Poz'], type:'heatmap',
             colorscale:[[0,'rgba(78,205,196,0.15)'],[1,T.accent]], showscale:true,
             text:[['TN: 88','FP: 2'],['FN: 1','TP: 52']], texttemplate:'%{text}', textfont:{color:'#ebe6dc',size:14}};
    var layout = Object.assign({}, common, {title:{text:'Karisiklik matrisi: meme kanseri',font:{color:T.text,size:14}},xaxis:{side:'top',gridcolor:T.grid},yaxis:{autorange:'reversed',gridcolor:T.grid},margin:{t:80,r:30,b:30,l:80},height:380});
    Plotly.newPlot('plot-l6-cm-tr',[t],layout,{responsive:true,displayModeBar:false});
  }
  var elRtr = document.getElementById('plot-l6-roc-tr');
  if (elRtr){
    var fpr1=[], tpr1=[], fpr2=[], tpr2=[];
    for (var i=0;i<=200;i++){
      var t = i/200;
      fpr1.push(t); tpr1.push( 1 - Math.pow(1 - Math.pow(t, 0.05), 1.5) );
      fpr2.push(t); tpr2.push( 1 - Math.pow(1 - Math.pow(t, 0.03), 1.7) );
    }
    var t1 = {x:fpr1,y:tpr1,mode:'lines',type:'scatter',name:'LogReg (AUC=0.99)',line:{color:T.accent,width:3}};
    var t2 = {x:fpr2,y:tpr2,mode:'lines',type:'scatter',name:'RandomForest (AUC=0.995)',line:{color:'#4ecdc4',width:3,dash:'dot'}};
    var diag = {x:[0,1],y:[0,1],mode:'lines',type:'scatter',name:'Rastgele',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'}};
    var layout = Object.assign({}, common, {title:{text:'ROC egrileri: iki ikili siniflandirici',font:{color:T.text,size:14}},xaxis:{title:'Yanlis pozitif orani',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},yaxis:{title:'Dogru pozitif orani',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l6-roc-tr',[diag,t1,t2],layout,{responsive:true,displayModeBar:false});
  }
  var elPtr = document.getElementById('plot-l6-pr-tr');
  if (elPtr){
    var rec=[], prec=[];
    for (var i=0;i<=200;i++){
      var r = i/200;
      var p = 0.95 * Math.exp(-2.5*r) + 0.05;
      if (p < 0.01) p = 0.01;
      rec.push(r); prec.push(p);
    }
    var t1 = {x:rec,y:prec,mode:'lines',type:'scatter',name:'Logreg (AP=0.42)',line:{color:T.accent,width:3}};
    var base = {x:[0,1],y:[0.01,0.01],mode:'lines',type:'scatter',name:'Rastgele (poz~%1)',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'}};
    var layout = Object.assign({}, common, {title:{text:'Kesinlik-Duyarlılık eğrisi (%1 pozitif sınıf)',font:{color:T.text,size:14}},xaxis:{title:'Duyarlılık',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},yaxis:{title:'Kesinlik',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.02]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l6-pr-tr',[t1,base],layout,{responsive:true,displayModeBar:false});
  }
  var elMtr = document.getElementById('plot-l6-cmmulti-tr');
  if (elMtr){
    var z=[];
    for (var i=0;i<10;i++){
      var row=[];
      for (var j=0;j<10;j++){
        if (i===j) row.push(40 + (i%3));
        else if ((i===4 && j===9) || (i===9 && j===4)) row.push(3);
        else if ((i===3 && j===8) || (i===8 && j===3)) row.push(2);
        else if ((i===5 && j===6) || (i===6 && j===5)) row.push(2);
        else row.push(((i*7+j*3)%2));
      }
      z.push(row);
    }
    var labels = ['0','1','2','3','4','5','6','7','8','9'];
    var t = {z:z,x:labels,y:labels,type:'heatmap',colorscale:[[0,'rgba(78,205,196,0.10)'],[0.1,'rgba(78,205,196,0.30)'],[1,T.accent]],showscale:true};
    var layout = Object.assign({}, common, {title:{text:'10-sinif karisiklik matrisi (digits)',font:{color:T.text,size:14}},xaxis:{title:'Tahmin edilen sinif',side:'top',gridcolor:T.grid},yaxis:{title:'Gercek sinif',autorange:'reversed',gridcolor:T.grid},margin:{t:80,r:30,b:30,l:80},height:440});
    Plotly.newPlot('plot-l6-cmmulti-tr',[t],layout,{responsive:true,displayModeBar:false});
  }
  var elCaltr = document.getElementById('plot-l6-calib-tr');
  if (elCaltr){
    var diag = {x:[0,1],y:[0,1],mode:'lines',type:'scatter',name:'Mukemmel',line:{color:'rgba(200,200,200,0.5)',width:1,dash:'dash'}};
    var lx=[0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95];
    var ly=[0.06,0.14,0.27,0.34,0.46,0.54,0.64,0.76,0.84,0.94];
    var t1 = {x:lx,y:ly,mode:'lines+markers',type:'scatter',name:'LogReg (iyi kalibre)',line:{color:T.accent,width:3},marker:{size:8}};
    var rx=[0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95];
    var ry=[0.18,0.22,0.30,0.38,0.46,0.55,0.63,0.70,0.74,0.80];
    var t2 = {x:rx,y:ry,mode:'lines+markers',type:'scatter',name:'RF (kalibresiz)',line:{color:'#4ecdc4',width:3,dash:'dot'},marker:{size:8}};
    var layout = Object.assign({}, common, {title:{text:'Kalibrasyon: tahmin vs gerçek pozitif oranı',font:{color:T.text,size:14}},xaxis:{title:'Ortalama tahmin olasiligi',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1]},yaxis:{title:'Gercek pozitif orani',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l6-calib-tr',[diag,t1,t2],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>
`
};
