window.FAIRNESS_L2 = {
en: `<p class="l-text">Lesson 1 told the stories. This lesson does the math. Every fairness debate ultimately reduces to a small number of <em>conditional independence statements</em> between three random variables: the protected attribute A, the true outcome Y, and the prediction Ŷ. Each independence is a different fairness criterion, and Chouldechova (2017) and Kleinberg, Mullainathan &amp; Raghavan (2017) proved you cannot satisfy all the most-cited ones simultaneously when group base rates differ. There is no neutral ground — choosing a metric is choosing a political stance about which errors matter most.</p>
<p class="l-text">We will derive each metric from first principles, prove the impossibility theorem in a five-line argument, implement every metric in scikit-learn on the churn dataset, and finish with a comparison of mitigation strategies (reweighting, threshold optimization, post-hoc fairness via Hardt 2016). By the end you will read any "AI bias" headline and know which metric was measured and which were silently violated.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Independence, separation, sufficiency — the three meta-criteria</li>
<li>Statistical / demographic parity and disparate impact ratio (4/5ths rule)</li>
<li>Equalized odds and equal opportunity (Hardt, Price &amp; Srebro 2016)</li>
<li>Predictive parity and calibration within groups</li>
<li>Individual fairness (Dwork et al. 2012)</li>
<li>The impossibility theorem (Chouldechova 2017) — proof and intuition</li>
<li>Threshold-optimization mitigation and its limits</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. The Three Meta-Criteria</h2>
<p class="l-text">Barocas, Hardt &amp; Narayanan organize fairness criteria by which conditional independence they require, where A is the protected attribute, Y the true label, and Ŷ (or score R) the prediction.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Independence</div><div class="card-body">Ŷ ⊥ A. Predictions don't depend on group. Demographic / statistical parity.</div></div>
<div class="calc-card"><div class="card-title">Separation</div><div class="card-body">Ŷ ⊥ A | Y. Conditional on the true label, predictions are group-independent. Equalized odds, equal opportunity.</div></div>
<div class="calc-card"><div class="card-title">Sufficiency</div><div class="card-body">Y ⊥ A | Ŷ. Conditional on the prediction, true label is group-independent. Calibration, predictive parity.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Independence ignores Y entirely (only the rate matters). Separation conditions on Y (errors must be group-equal). Sufficiency conditions on Ŷ (the score must mean the same thing across groups). Different metrics, different harm models, mostly mutually exclusive.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Demographic Parity (Independence)</h2>
<div class="katex-block">$$P(\\hat{Y}=1 \\mid A=0) = P(\\hat{Y}=1 \\mid A=1)$$</div>
<p class="l-text">Equal positive-prediction rate. The 4/5ths rule from U.S. employment law (29 CFR § 1607.4) is a tolerant version: ratio ≥ 0.8.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'A'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>]&gt;df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.7</span>,<span class="fn">len</span>(df)),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,<span class="fn">len</span>(df)))

X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
y = df[<span class="str">'churned'</span>].values; A = df[<span class="str">'A'</span>].values

X_tr, X_te, y_tr, y_te, A_tr, A_te = <span class="fn">train_test_split</span>(X,y,A,test_size=<span class="num">0.3</span>,random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X_tr, y_tr)
yh = clf.<span class="fn">predict</span>(X_te)

<span class="kw">def</span> <span class="fn">demographic_parity</span>(yh, A):
    p1 = yh[A==<span class="num">1</span>].<span class="fn">mean</span>(); p0 = yh[A==<span class="num">0</span>].<span class="fn">mean</span>()
    <span class="kw">return</span> p1 - p0, p1/<span class="fn">max</span>(p0,<span class="num">1e-9</span>)

diff, ratio = <span class="fn">demographic_parity</span>(yh, A_te)
<span class="fn">print</span>(f<span class="str">"Demographic parity diff:  {diff:+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Disparate impact ratio:   {ratio:.3f}   (4/5ths rule: must be in [0.8, 1.25])"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains a LogisticRegression on the churn features and predicts hard labels on the test set. 2) defines <code>demographic_parity</code> as the difference and ratio of positive-prediction rates between A=1 and A=0. 3) prints both the additive gap (P(Ŷ=1|A=1) − P(Ŷ=1|A=0)) and the disparate-impact ratio, which is the quantity the 4/5ths rule applies to.</p>
<p class="l-text">Disparate impact ratio &lt; 0.8 → group A=1 is under-selected; ratio &gt; 1.25 → over-selected. U.S. courts use this as a prima-facie evidence threshold.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Equalized Odds &amp; Equal Opportunity (Separation)</h2>
<p class="l-text">Hardt, Price &amp; Srebro (2016) — "Equality of Opportunity in Supervised Learning". Equal TPR <em>and</em> equal FPR across groups.</p>
<div class="katex-block">$$P(\\hat{Y}=1 \\mid Y=y, A=0) = P(\\hat{Y}=1 \\mid Y=y, A=1) \\quad \\forall y \\in \\{0,1\\}$$</div>
<p class="l-text">Equal opportunity is the relaxation requiring only equality at Y=1 (equal TPR). Hardt's claim: in many settings (loans, hiring), equal opportunity is the morally relevant constraint — qualified members of every group should have equal access.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">odds_metrics</span>(yh, y, A):
    out = {}
    <span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
        m = (A==a)
        tp = ((yh==<span class="num">1</span>)&amp;(y==<span class="num">1</span>)&amp;m).<span class="fn">sum</span>(); fn = ((yh==<span class="num">0</span>)&amp;(y==<span class="num">1</span>)&amp;m).<span class="fn">sum</span>()
        fp = ((yh==<span class="num">1</span>)&amp;(y==<span class="num">0</span>)&amp;m).<span class="fn">sum</span>(); tn = ((yh==<span class="num">0</span>)&amp;(y==<span class="num">0</span>)&amp;m).<span class="fn">sum</span>()
        tpr = tp/<span class="fn">max</span>(tp+fn,<span class="num">1</span>); fpr = fp/<span class="fn">max</span>(fp+tn,<span class="num">1</span>)
        out[a] = {<span class="str">'TPR'</span>:tpr, <span class="str">'FPR'</span>:fpr}
    <span class="kw">return</span> out

<span class="cm"># (assumes yh, y_te, A_te from previous block)</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
df = df_churn.<span class="fn">copy</span>(); np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'A'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>]&gt;df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.7</span>,<span class="fn">len</span>(df)),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,<span class="fn">len</span>(df)))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
y = df[<span class="str">'churned'</span>].values; A = df[<span class="str">'A'</span>].values
X_tr,X_te,y_tr,y_te,A_tr,A_te = <span class="fn">train_test_split</span>(X,y,A,test_size=<span class="num">0.3</span>,random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X_tr,y_tr); yh = clf.<span class="fn">predict</span>(X_te)

m = <span class="fn">odds_metrics</span>(yh, y_te, A_te)
<span class="fn">print</span>(f<span class="str">"Group 0:  TPR={m[0]['TPR']:.3f}  FPR={m[0]['FPR']:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Group 1:  TPR={m[1]['TPR']:.3f}  FPR={m[1]['FPR']:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Equal-opportunity gap (TPR diff): {m[1]['TPR']-m[0]['TPR']:+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Equalized-odds  FPR diff:         {m[1]['FPR']-m[0]['FPR']:+.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) defines <code>odds_metrics</code>, which iterates over groups, builds a 2×2 confusion matrix per group, and derives TPR and FPR from it. 2) trains the same churn classifier as before and predicts on the test set. 3) prints per-group TPR / FPR plus the equal-opportunity gap (TPR difference) and the equalized-odds FPR difference — separation diagnostics conditional on Y.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Predictive Parity / Calibration (Sufficiency)</h2>
<p class="l-text">Equal positive predictive value: of those flagged positive, equal fraction are truly positive across groups. Calibration generalizes to a per-score statement:</p>
<div class="katex-block">$$P(Y=1 \\mid \\hat{R}=r, A=a) = r \\quad \\forall a$$</div>
<p class="l-text">This is what Northpointe meant by "COMPAS is fair." A score of 7 means the same recidivism rate regardless of race.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">copy</span>(); np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'A'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>]&gt;df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.7</span>,<span class="fn">len</span>(df)),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,<span class="fn">len</span>(df)))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
y = df[<span class="str">'churned'</span>].values; A = df[<span class="str">'A'</span>].values
X_tr,X_te,y_tr,y_te,A_tr,A_te = <span class="fn">train_test_split</span>(X,y,A,test_size=<span class="num">0.3</span>,random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X_tr,y_tr)

p = clf.<span class="fn">predict_proba</span>(X_te)[:,<span class="num">1</span>]; yh = (p&gt;=<span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)

<span class="cm"># Predictive parity: PPV per group</span>
<span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
    m = (A_te==a)&amp;(yh==<span class="num">1</span>)
    ppv = y_te[m].<span class="fn">mean</span>() <span class="kw">if</span> m.<span class="fn">any</span>() <span class="kw">else</span> <span class="fn">float</span>(<span class="str">'nan'</span>)
    <span class="fn">print</span>(f<span class="str">"Group {a}: PPV (precision) = {ppv:.3f}"</span>)

<span class="cm"># Calibration plot data</span>
df_te = pd.<span class="fn">DataFrame</span>({<span class="str">'p'</span>:p,<span class="str">'y'</span>:y_te,<span class="str">'A'</span>:A_te})
df_te[<span class="str">'bin'</span>] = pd.<span class="fn">cut</span>(df_te[<span class="str">'p'</span>], bins=[<span class="num">0</span>,.25,.5,.75,<span class="num">1</span>.])
cal = df_te.<span class="fn">groupby</span>([<span class="str">'bin'</span>,<span class="str">'A'</span>], observed=<span class="kw">True</span>)[<span class="str">'y'</span>].<span class="fn">mean</span>().<span class="fn">unstack</span>()
<span class="fn">print</span>(<span class="str">"\\nEmpirical positive rate per score-bin per group:"</span>)
<span class="fn">print</span>(cal)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains a LogisticRegression and converts its <code>predict_proba</code> output into hard predictions at the default 0.5 threshold. 2) computes PPV (precision) per group — the predictive-parity quantity: of those flagged positive, what fraction are truly positive. 3) bins the predicted probabilities and builds a per-group calibration table so you can see whether a score of 0.5 means the same risk in both groups (sufficiency, Y ⊥ A | Ŷ).</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. The Impossibility Theorem (Chouldechova 2017)</h2>
<p class="l-text">Suppose two groups have different base rates: P(Y=1|A=0) ≠ P(Y=1|A=1). Then no non-perfect classifier can satisfy <em>both</em> equalized odds and predictive parity.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem"><strong>Sketch.</strong> By definition, PPV = TPR · π / (TPR · π + FPR · (1−π)) where π = P(Y=1). If TPR and FPR are equal across groups but π differs, PPV must differ. So sufficiency and separation force either base rates equal (often false) or perfect prediction (always false in practice). □</div>
<p class="l-text">Kleinberg, Mullainathan &amp; Raghavan (2017) extended this: any two of {calibration, balance for positive class, balance for negative class} cannot hold simultaneously when base rates differ.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Demonstrate the impossibility numerically</span>
<span class="kw">def</span> <span class="fn">metrics</span>(yh, y, A):
    res = {}
    <span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
        m = (A==a)
        tp = ((yh==<span class="num">1</span>)&amp;(y==<span class="num">1</span>)&amp;m).<span class="fn">sum</span>(); fn = ((yh==<span class="num">0</span>)&amp;(y==<span class="num">1</span>)&amp;m).<span class="fn">sum</span>()
        fp = ((yh==<span class="num">1</span>)&amp;(y==<span class="num">0</span>)&amp;m).<span class="fn">sum</span>(); tn = ((yh==<span class="num">0</span>)&amp;(y==<span class="num">0</span>)&amp;m).<span class="fn">sum</span>()
        res[a] = <span class="fn">dict</span>(
            TPR=tp/<span class="fn">max</span>(tp+fn,<span class="num">1</span>), FPR=fp/<span class="fn">max</span>(fp+tn,<span class="num">1</span>),
            PPV=tp/<span class="fn">max</span>(tp+fp,<span class="num">1</span>), base=(tp+fn)/<span class="fn">max</span>(tp+fn+fp+tn,<span class="num">1</span>))
    <span class="kw">return</span> res

<span class="cm"># Synthetic: groups with different base rates</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>); n = <span class="num">5000</span>
A = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.5</span>, n)
y = np.<span class="fn">where</span>(A==<span class="num">1</span>, np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.6</span>,n), np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,n))
<span class="cm"># A "good" classifier with equal TPR / FPR across groups</span>
score = <span class="num">0.7</span>*y + <span class="num">0.3</span>*np.random.<span class="fn">rand</span>(n)
yh = (score &gt; <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
m = <span class="fn">metrics</span>(yh, y, A)
<span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
    <span class="fn">print</span>(f<span class="str">"A={a}: base={m[a]['base']:.2f}  TPR={m[a]['TPR']:.2f}  FPR={m[a]['FPR']:.2f}  PPV={m[a]['PPV']:.2f}"</span>)
<span class="fn">print</span>(f<span class="str">"\\nTPR diff: {m[1]['TPR']-m[0]['TPR']:+.3f},  PPV diff: {m[1]['PPV']-m[0]['PPV']:+.3f}"</span>)
<span class="cm"># When base rates differ, equal TPR/FPR forces unequal PPV.</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a synthetic dataset where the two groups have deliberately different base rates (0.6 vs 0.3). 2) constructs a "well-behaved" score that depends on y plus noise, then thresholds at 0.5 to get predictions with roughly equal TPR and FPR across groups. 3) computes per-group base rate, TPR, FPR, and PPV — and prints the TPR/PPV gaps to show numerically that matching TPR/FPR forces PPV to diverge when base rates differ.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Individual Fairness (Dwork et al. 2012)</h2>
<p class="l-text">Group fairness averages over groups. <strong>Individual fairness</strong> demands: similar individuals receive similar predictions. Formally, with metric d on inputs and D on outputs:</p>
<div class="katex-block">$$D(\\hat{Y}(x), \\hat{Y}(x')) \\;\\leq\\; L \\cdot d(x, x')$$</div>
<p class="l-text">A Lipschitz condition on the classifier with respect to a problem-specific similarity metric. The hard part is defining d — that is itself a normative choice. Recent work (Yurochkin 2020, Mukherjee 2020) learns d from human judgments.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Mitigation: Threshold Optimization (Hardt 2016)</h2>
<p class="l-text">Given a calibrated probabilistic classifier, choose group-specific thresholds to satisfy equalized odds. Hardt et al. show this can be solved by linear programming, and yields the optimal classifier subject to the fairness constraint.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">copy</span>(); np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'A'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>]&gt;df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.7</span>,<span class="fn">len</span>(df)),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,<span class="fn">len</span>(df)))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
y = df[<span class="str">'churned'</span>].values; A = df[<span class="str">'A'</span>].values
X_tr,X_te,y_tr,y_te,A_tr,A_te = <span class="fn">train_test_split</span>(X,y,A,test_size=<span class="num">0.3</span>,random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X_tr,y_tr)
p = clf.<span class="fn">predict_proba</span>(X_te)[:,<span class="num">1</span>]

<span class="cm"># Find per-group thresholds that match TPR</span>
<span class="kw">def</span> <span class="fn">tpr_at</span>(thr, p, y):
    yh = (p&gt;=thr).<span class="fn">astype</span>(<span class="fn">int</span>)
    pos = (y==<span class="num">1</span>)
    <span class="kw">return</span> (yh[pos]==<span class="num">1</span>).<span class="fn">mean</span>() <span class="kw">if</span> pos.<span class="fn">any</span>() <span class="kw">else</span> <span class="num">0</span>

target = <span class="num">0.7</span>
thrs = {}
<span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
    m = (A_te==a); ps, ys = p[m], y_te[m]
    grid = np.<span class="fn">linspace</span>(<span class="num">0.05</span>, <span class="num">0.95</span>, <span class="num">91</span>)
    diff = np.<span class="fn">array</span>([<span class="fn">abs</span>(<span class="fn">tpr_at</span>(t, ps, ys) - target) <span class="kw">for</span> t <span class="kw">in</span> grid])
    thrs[a] = grid[diff.<span class="fn">argmin</span>()]
<span class="fn">print</span>(f<span class="str">"Group thresholds for TPR≈{target}: {thrs}"</span>)

<span class="cm"># Apply group-specific thresholds</span>
yh_fair = np.<span class="fn">where</span>(A_te==<span class="num">1</span>, p&gt;=thrs[<span class="num">1</span>], p&gt;=thrs[<span class="num">0</span>]).<span class="fn">astype</span>(<span class="fn">int</span>)
<span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
    m = (A_te==a)
    tpr = ((yh_fair==<span class="num">1</span>)&amp;(y_te==<span class="num">1</span>)&amp;m).<span class="fn">sum</span>()/<span class="fn">max</span>(((y_te==<span class="num">1</span>)&amp;m).<span class="fn">sum</span>(),<span class="num">1</span>)
    <span class="fn">print</span>(f<span class="str">"  Group {a}: TPR after threshold-fix = {tpr:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains a calibrated LogisticRegression and pulls its probability scores on the test set. 2) defines <code>tpr_at(thr, p, y)</code>, a helper that thresholds the scores at <code>thr</code> and returns the true-positive rate. 3) grid-searches a per-group threshold so that each group's TPR lands near a target (here 0.7), then applies the chosen thresholds via <code>np.where(A_te==1, ...)</code> — a minimal Hardt-style post-hoc fix for equal opportunity.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Trade-off: matching TPR breaks calibration (different thresholds = different score-meaning per group). The impossibility theorem in action — every fix moves the violation, never eliminates it.</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Other Mitigation Strategies</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reweighting (Kamiran 2012)</div><div class="card-body">Pre-processing: weight training samples by inverse joint probability of (A, Y) to break the (A, Y) correlation.</div></div>
<div class="calc-card"><div class="card-title">Adversarial Debiasing (Zhang 2018)</div><div class="card-body">In-processing: train predictor jointly with adversary that tries to predict A from Ŷ; predictor wins by hiding A.</div></div>
<div class="calc-card"><div class="card-title">Reject Option Classification (Kamiran 2012)</div><div class="card-body">Post-processing: near the decision boundary, flip predictions in favor of the disadvantaged group.</div></div>
<div class="calc-card"><div class="card-title">Fairlearn / AIF360</div><div class="card-body">IBM's AIF360 and Microsoft's Fairlearn implement most of these in sklearn-compatible APIs.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Choosing a Metric — A Practical Guide</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Allocation of scarce good (loan, job)</div><div class="card-body">Demographic parity if you believe historical data underrepresents the target group; equal opportunity if a "qualified" Y is well-defined.</div></div>
<div class="calc-card"><div class="card-title">Risk assessment (recidivism, fraud)</div><div class="card-body">Equalized odds (FPR matters: false flags ruin lives) or calibration (score interpretability matters for human users).</div></div>
<div class="calc-card"><div class="card-title">Medical screening</div><div class="card-body">Calibration is critical for clinicians; equal TPR ensures equal health access.</div></div>
<div class="calc-card"><div class="card-title">Personalization</div><div class="card-body">Individual fairness — similar users get similar offers. Group metrics are weak guides for one-on-one decisions.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">No metric is universally correct. Document your choice in the model card (Mitchell 2019), state the impossibility trade-offs you accepted, and pair group fairness with the causal audit from Causal Lesson 6 — the two perspectives catch different bugs.</div>
<p class="l-text">Reading: Hardt, Price &amp; Srebro (2016) NeurIPS; Chouldechova (2017) Big Data; Kleinberg, Mullainathan &amp; Raghavan (2017) ITCS; Dwork et al. (2012) ITCS; Barocas, Hardt &amp; Narayanan, <em>Fairness and Machine Learning</em> (free online).</p>
</div>`,
tr: `<p class="l-text">Ders 1 hikayeleri anlattı. Bu ders matematiği yapar. Her adalet tartışması nihayetinde üç rastgele değişken arasındaki az sayıda <em>koşullu bağımsızlık ifadesine</em> indirgenir: korunan özellik A, gerçek sonuç Y ve tahmin Ŷ. Her bağımsızlık farklı bir adalet kriteridir ve Chouldechova (2017) ile Kleinberg, Mullainathan &amp; Raghavan (2017) grup temel oranları farklı olduğunda en sık alıntılananları aynı anda sağlayamayacağınızı kanıtladı. Tarafsız bir zemin yok — bir metrik seçmek hangi hataların en önemli olduğu konusunda politik bir tutum seçmektir.</p>
<p class="l-text">Her metriği temel ilkelerden türeteceğiz, imkansızlık teoremini beş satırlık bir argümanla kanıtlayacağız, her metriği churn veri setinde scikit-learn'de uygulayacağız ve hafifletme stratejilerinin (yeniden ağırlıklandırma, eşik optimizasyonu, Hardt 2016 yoluyla post-hoc adalet) karşılaştırmasıyla bitireceğiz. Ders sonunda herhangi bir "AI yanlılığı" manşetini okuyacak ve hangi metriğin ölçüldüğünü ve hangilerinin sessizce ihlal edildiğini bileceksiniz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bağımsızlık, ayırma, yeterlilik — üç meta-kriter</li>
<li>İstatistiksel / demografik eşitlik ve farklı etki oranı (4/5 kuralı)</li>
<li>Eşitlenmiş olasılıklar ve eşit fırsat (Hardt, Price &amp; Srebro 2016)</li>
<li>Tahminsel eşitlik ve gruplar içinde kalibrasyon</li>
<li>Bireysel adalet (Dwork ve ark. 2012)</li>
<li>İmkansızlık teoremi (Chouldechova 2017) — kanıt ve sezgi</li>
<li>Eşik-optimizasyon hafifletmesi ve sınırları</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Üç Meta-Kriter</h2>
<p class="l-text">Barocas, Hardt &amp; Narayanan adalet kriterlerini gerektirdikleri koşullu bağımsızlığa göre düzenler, A korunan özellik, Y gerçek etiket ve Ŷ (veya skor R) tahmin olduğunda.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bağımsızlık</div><div class="card-body">Ŷ ⊥ A. Tahminler gruba bağlı değil. Demografik / istatistiksel eşitlik.</div></div>
<div class="calc-card"><div class="card-title">Ayırma</div><div class="card-body">Ŷ ⊥ A | Y. Gerçek etikete bağlı olarak, tahminler gruptan bağımsızdır. Eşitlenmiş olasılıklar, eşit fırsat.</div></div>
<div class="calc-card"><div class="card-title">Yeterlilik</div><div class="card-body">Y ⊥ A | Ŷ. Tahmine bağlı olarak, gerçek etiket gruptan bağımsızdır. Kalibrasyon, tahminsel eşitlik.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Bağımsızlık Y'yi tamamen göz ardı eder (yalnızca oran önemlidir). Ayırma Y'yi koşullar (hatalar grup-eşit olmalı). Yeterlilik Ŷ'yi koşullar (skor gruplar arasında aynı anlama gelmeli). Farklı metrikler, farklı zarar modelleri, çoğunlukla karşılıklı dışlayıcı.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Demografik Eşitlik (Bağımsızlık)</h2>
<div class="katex-block">$$P(\\hat{Y}=1 \\mid A=0) = P(\\hat{Y}=1 \\mid A=1)$$</div>
<p class="l-text">Eşit pozitif-tahmin oranı. ABD istihdam yasasından (29 CFR § 1607.4) 4/5 kuralı toleranslı bir versiyondur: oran ≥ 0.8.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'A'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>]&gt;df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.7</span>,<span class="fn">len</span>(df)),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,<span class="fn">len</span>(df)))

X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
y = df[<span class="str">'churned'</span>].values; A = df[<span class="str">'A'</span>].values

X_tr, X_te, y_tr, y_te, A_tr, A_te = <span class="fn">train_test_split</span>(X,y,A,test_size=<span class="num">0.3</span>,random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X_tr, y_tr)
yh = clf.<span class="fn">predict</span>(X_te)

<span class="kw">def</span> <span class="fn">demographic_parity</span>(yh, A):
    p1 = yh[A==<span class="num">1</span>].<span class="fn">mean</span>(); p0 = yh[A==<span class="num">0</span>].<span class="fn">mean</span>()
    <span class="kw">return</span> p1 - p0, p1/<span class="fn">max</span>(p0,<span class="num">1e-9</span>)

diff, ratio = <span class="fn">demographic_parity</span>(yh, A_te)
<span class="fn">print</span>(f<span class="str">"Demographic parity diff:  {diff:+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Disparate impact ratio:   {ratio:.3f}   (4/5ths rule: must be in [0.8, 1.25])"</span>)
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Churn özellikleri üzerinde bir LogisticRegression eğitir ve test setinde sert etiketler üretir. 2) <code>demographic_parity</code>'yi A=1 ile A=0 gruplarının pozitif-tahmin oranlarının farkı ve oranı olarak tanımlar. 3) Hem toplamsal farkı (P(Ŷ=1|A=1) − P(Ŷ=1|A=0)) hem de 4/5 kuralının uygulandığı disparate-impact oranını yazdırır.</p>
<p class="l-text">Farklı etki oranı &lt; 0.8 → A=1 grubu az-seçildi; oran &gt; 1.25 → çok-seçildi. ABD mahkemeleri bunu prima-facie kanıt eşiği olarak kullanır.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Eşitlenmiş Olasılıklar &amp; Eşit Fırsat (Ayırma)</h2>
<p class="l-text">Hardt, Price &amp; Srebro (2016) — "Gözetimli Öğrenmede Fırsat Eşitliği". Gruplar arasında eşit TPR <em>ve</em> eşit FPR.</p>
<div class="katex-block">$$P(\\hat{Y}=1 \\mid Y=y, A=0) = P(\\hat{Y}=1 \\mid Y=y, A=1) \\quad \\forall y \\in \\{0,1\\}$$</div>
<p class="l-text">Eşit fırsat, yalnızca Y=1'de eşitlik gerektiren gevşemedir (eşit TPR). Hardt'ın iddiası: birçok ortamda (krediler, işe alım), eşit fırsat ahlaki olarak ilgili kısıtlamadır — her grubun nitelikli üyelerinin eşit erişimi olmalıdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">odds_metrics</span>(yh, y, A):
    out = {}
    <span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
        m = (A==a)
        tp = ((yh==<span class="num">1</span>)&amp;(y==<span class="num">1</span>)&amp;m).<span class="fn">sum</span>(); fn = ((yh==<span class="num">0</span>)&amp;(y==<span class="num">1</span>)&amp;m).<span class="fn">sum</span>()
        fp = ((yh==<span class="num">1</span>)&amp;(y==<span class="num">0</span>)&amp;m).<span class="fn">sum</span>(); tn = ((yh==<span class="num">0</span>)&amp;(y==<span class="num">0</span>)&amp;m).<span class="fn">sum</span>()
        tpr = tp/<span class="fn">max</span>(tp+fn,<span class="num">1</span>); fpr = fp/<span class="fn">max</span>(fp+tn,<span class="num">1</span>)
        out[a] = {<span class="str">'TPR'</span>:tpr, <span class="str">'FPR'</span>:fpr}
    <span class="kw">return</span> out

<span class="cm"># (assumes yh, y_te, A_te from previous block)</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
df = df_churn.<span class="fn">copy</span>(); np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'A'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>]&gt;df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.7</span>,<span class="fn">len</span>(df)),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,<span class="fn">len</span>(df)))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
y = df[<span class="str">'churned'</span>].values; A = df[<span class="str">'A'</span>].values
X_tr,X_te,y_tr,y_te,A_tr,A_te = <span class="fn">train_test_split</span>(X,y,A,test_size=<span class="num">0.3</span>,random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X_tr,y_tr); yh = clf.<span class="fn">predict</span>(X_te)

m = <span class="fn">odds_metrics</span>(yh, y_te, A_te)
<span class="fn">print</span>(f<span class="str">"Group 0:  TPR={m[0]['TPR']:.3f}  FPR={m[0]['FPR']:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Group 1:  TPR={m[1]['TPR']:.3f}  FPR={m[1]['FPR']:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Equal-opportunity gap (TPR diff): {m[1]['TPR']-m[0]['TPR']:+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Equalized-odds  FPR diff:         {m[1]['FPR']-m[0]['FPR']:+.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>odds_metrics</code> fonksiyonu gruplar üzerinde döner, her grup için 2×2 karışıklık matrisi kurar ve oradan TPR ile FPR'yi çıkarır. 2) Önceki ile aynı churn sınıflandırıcısını eğitir ve test setinde tahminler üretir. 3) Grup başına TPR / FPR ile birlikte eşit-fırsat farkını (TPR farkı) ve eşitlenmiş olasılıklar FPR farkını — Y koşullu ayırma tanılarını — yazdırır.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Tahminsel Eşitlik / Kalibrasyon (Yeterlilik)</h2>
<p class="l-text">Eşit pozitif tahmin değeri: pozitif olarak işaretlenenler arasında, gruplar arasında eşit oranda gerçekten pozitif. Kalibrasyon, skor-başına bir ifadeye genelleşir:</p>
<div class="katex-block">$$P(Y=1 \\mid \\hat{R}=r, A=a) = r \\quad \\forall a$$</div>
<p class="l-text">Northpointe'un "COMPAS adildir" derken kastettiği buydu. 7 skoru, ırktan bağımsız olarak aynı yeniden suç işleme oranını ifade eder.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">copy</span>(); np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'A'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>]&gt;df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.7</span>,<span class="fn">len</span>(df)),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,<span class="fn">len</span>(df)))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
y = df[<span class="str">'churned'</span>].values; A = df[<span class="str">'A'</span>].values
X_tr,X_te,y_tr,y_te,A_tr,A_te = <span class="fn">train_test_split</span>(X,y,A,test_size=<span class="num">0.3</span>,random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X_tr,y_tr)

p = clf.<span class="fn">predict_proba</span>(X_te)[:,<span class="num">1</span>]; yh = (p&gt;=<span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)

<span class="cm"># Predictive parity: PPV per group</span>
<span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
    m = (A_te==a)&amp;(yh==<span class="num">1</span>)
    ppv = y_te[m].<span class="fn">mean</span>() <span class="kw">if</span> m.<span class="fn">any</span>() <span class="kw">else</span> <span class="fn">float</span>(<span class="str">'nan'</span>)
    <span class="fn">print</span>(f<span class="str">"Group {a}: PPV (precision) = {ppv:.3f}"</span>)

<span class="cm"># Calibration plot data</span>
df_te = pd.<span class="fn">DataFrame</span>({<span class="str">'p'</span>:p,<span class="str">'y'</span>:y_te,<span class="str">'A'</span>:A_te})
df_te[<span class="str">'bin'</span>] = pd.<span class="fn">cut</span>(df_te[<span class="str">'p'</span>], bins=[<span class="num">0</span>,.25,.5,.75,<span class="num">1</span>.])
cal = df_te.<span class="fn">groupby</span>([<span class="str">'bin'</span>,<span class="str">'A'</span>], observed=<span class="kw">True</span>)[<span class="str">'y'</span>].<span class="fn">mean</span>().<span class="fn">unstack</span>()
<span class="fn">print</span>(<span class="str">"\\nEmpirical positive rate per score-bin per group:"</span>)
<span class="fn">print</span>(cal)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Bir LogisticRegression eğitir ve <code>predict_proba</code> çıktısını varsayılan 0.5 eşiğinde sert tahminlere çevirir. 2) Grup başına PPV'yi (kesinlik) hesaplar — tahminsel eşitlik niceliği: pozitif olarak işaretlenenler arasında gerçekten pozitif olanların oranı. 3) Tahmin olasılıklarını binler ve grup başına bir kalibrasyon tablosu kurar; böylece 0.5 skorunun her iki grup için aynı riski ifade edip etmediğini görürsün (yeterlilik, Y ⊥ A | Ŷ).</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. İmkansızlık Teoremi (Chouldechova 2017)</h2>
<p class="l-text">Diyelim ki iki grubun temel oranları farklı: P(Y=1|A=0) ≠ P(Y=1|A=1). O zaman mükemmel olmayan hiçbir sınıflandırıcı eşitlenmiş olasılıkları <em>ve</em> tahminsel eşitliği aynı anda sağlayamaz.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem"><strong>Taslak.</strong> Tanım gereği, PPV = TPR · π / (TPR · π + FPR · (1−π)) burada π = P(Y=1). TPR ve FPR gruplar arasında eşitse ama π farklıysa, PPV farklı olmalıdır. Yani yeterlilik ve ayırma ya temel oranların eşit olmasını (genellikle yanlış) ya da mükemmel tahmini (pratikte her zaman yanlış) zorlar. □</div>
<p class="l-text">Kleinberg, Mullainathan &amp; Raghavan (2017) bunu genişletti: temel oranlar farklı olduğunda {kalibrasyon, pozitif sınıf için denge, negatif sınıf için denge} kümesinden herhangi ikisi aynı anda tutamaz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Demonstrate the impossibility numerically</span>
<span class="kw">def</span> <span class="fn">metrics</span>(yh, y, A):
    res = {}
    <span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
        m = (A==a)
        tp = ((yh==<span class="num">1</span>)&amp;(y==<span class="num">1</span>)&amp;m).<span class="fn">sum</span>(); fn = ((yh==<span class="num">0</span>)&amp;(y==<span class="num">1</span>)&amp;m).<span class="fn">sum</span>()
        fp = ((yh==<span class="num">1</span>)&amp;(y==<span class="num">0</span>)&amp;m).<span class="fn">sum</span>(); tn = ((yh==<span class="num">0</span>)&amp;(y==<span class="num">0</span>)&amp;m).<span class="fn">sum</span>()
        res[a] = <span class="fn">dict</span>(
            TPR=tp/<span class="fn">max</span>(tp+fn,<span class="num">1</span>), FPR=fp/<span class="fn">max</span>(fp+tn,<span class="num">1</span>),
            PPV=tp/<span class="fn">max</span>(tp+fp,<span class="num">1</span>), base=(tp+fn)/<span class="fn">max</span>(tp+fn+fp+tn,<span class="num">1</span>))
    <span class="kw">return</span> res

<span class="cm"># Synthetic: groups with different base rates</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>); n = <span class="num">5000</span>
A = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.5</span>, n)
y = np.<span class="fn">where</span>(A==<span class="num">1</span>, np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.6</span>,n), np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,n))
<span class="cm"># A "good" classifier with equal TPR / FPR across groups</span>
score = <span class="num">0.7</span>*y + <span class="num">0.3</span>*np.random.<span class="fn">rand</span>(n)
yh = (score &gt; <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
m = <span class="fn">metrics</span>(yh, y, A)
<span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
    <span class="fn">print</span>(f<span class="str">"A={a}: base={m[a]['base']:.2f}  TPR={m[a]['TPR']:.2f}  FPR={m[a]['FPR']:.2f}  PPV={m[a]['PPV']:.2f}"</span>)
<span class="fn">print</span>(f<span class="str">"\\nTPR diff: {m[1]['TPR']-m[0]['TPR']:+.3f},  PPV diff: {m[1]['PPV']-m[0]['PPV']:+.3f}"</span>)
<span class="cm"># When base rates differ, equal TPR/FPR forces unequal PPV.</span>
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) İki grubun bilinçli olarak farklı temel oranlara (0.6 vs 0.3) sahip olduğu sentetik bir veri seti kurar. 2) y'ye ve gürültüye bağlı "iyi davranan" bir skor üretir, sonra 0.5'ten eşikler — gruplar arası TPR ve FPR kabaca eşit olur. 3) Grup başına temel oran, TPR, FPR ve PPV'yi hesaplar — temel oranlar farklı olduğunda TPR/FPR'yi eşitlemenin PPV'yi nasıl ıraksamaya zorladığını sayısal olarak gösterir.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Bireysel Adalet (Dwork ve ark. 2012)</h2>
<p class="l-text">Grup adaleti gruplar üzerinde ortalama alır. <strong>Bireysel adalet</strong> şunu ister: benzer bireyler benzer tahminler alır. Formal olarak, girdilerde d metriği ve çıktılarda D ile:</p>
<div class="katex-block">$$D(\\hat{Y}(x), \\hat{Y}(x')) \\;\\leq\\; L \\cdot d(x, x')$$</div>
<p class="l-text">Probleme özel bir benzerlik metriğine göre sınıflandırıcı üzerinde bir Lipschitz koşulu. Zor kısım d'yi tanımlamaktır — bu kendisi normatif bir seçimdir. Son çalışmalar (Yurochkin 2020, Mukherjee 2020) d'yi insan yargılarından öğrenir.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Hafifletme: Eşik Optimizasyonu (Hardt 2016)</h2>
<p class="l-text">Kalibre edilmiş bir olasılıksal sınıflandırıcı verildiğinde, eşitlenmiş olasılıkları sağlamak için gruba özel eşikler seç. Hardt ve ark. bunun doğrusal programlama ile çözülebileceğini ve adalet kısıtlaması altında optimal sınıflandırıcıyı verdiğini gösteriyor.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">copy</span>(); np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'A'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>]&gt;df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.7</span>,<span class="fn">len</span>(df)),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,<span class="fn">len</span>(df)))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
y = df[<span class="str">'churned'</span>].values; A = df[<span class="str">'A'</span>].values
X_tr,X_te,y_tr,y_te,A_tr,A_te = <span class="fn">train_test_split</span>(X,y,A,test_size=<span class="num">0.3</span>,random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X_tr,y_tr)
p = clf.<span class="fn">predict_proba</span>(X_te)[:,<span class="num">1</span>]

<span class="cm"># Find per-group thresholds that match TPR</span>
<span class="kw">def</span> <span class="fn">tpr_at</span>(thr, p, y):
    yh = (p&gt;=thr).<span class="fn">astype</span>(<span class="fn">int</span>)
    pos = (y==<span class="num">1</span>)
    <span class="kw">return</span> (yh[pos]==<span class="num">1</span>).<span class="fn">mean</span>() <span class="kw">if</span> pos.<span class="fn">any</span>() <span class="kw">else</span> <span class="num">0</span>

target = <span class="num">0.7</span>
thrs = {}
<span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
    m = (A_te==a); ps, ys = p[m], y_te[m]
    grid = np.<span class="fn">linspace</span>(<span class="num">0.05</span>, <span class="num">0.95</span>, <span class="num">91</span>)
    diff = np.<span class="fn">array</span>([<span class="fn">abs</span>(<span class="fn">tpr_at</span>(t, ps, ys) - target) <span class="kw">for</span> t <span class="kw">in</span> grid])
    thrs[a] = grid[diff.<span class="fn">argmin</span>()]
<span class="fn">print</span>(f<span class="str">"Group thresholds for TPR≈{target}: {thrs}"</span>)

<span class="cm"># Apply group-specific thresholds</span>
yh_fair = np.<span class="fn">where</span>(A_te==<span class="num">1</span>, p&gt;=thrs[<span class="num">1</span>], p&gt;=thrs[<span class="num">0</span>]).<span class="fn">astype</span>(<span class="fn">int</span>)
<span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
    m = (A_te==a)
    tpr = ((yh_fair==<span class="num">1</span>)&amp;(y_te==<span class="num">1</span>)&amp;m).<span class="fn">sum</span>()/<span class="fn">max</span>(((y_te==<span class="num">1</span>)&amp;m).<span class="fn">sum</span>(),<span class="num">1</span>)
    <span class="fn">print</span>(f<span class="str">"  Group {a}: TPR after threshold-fix = {tpr:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Kalibre bir LogisticRegression eğitir ve test setindeki olasılık skorlarını çeker. 2) <code>tpr_at(thr, p, y)</code> yardımcısını tanımlar: skorları <code>thr</code>'da eşikler ve gerçek-pozitif oranını döner. 3) Her grubun TPR'si bir hedefe (burada 0.7) yakın düşecek şekilde grup başına eşiği grid arama ile bulur, sonra <code>np.where(A_te==1, ...)</code> ile seçilen eşikleri uygular — eşit fırsat için minimal Hardt tarzı post-hoc düzeltme.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Takas: TPR'yi eşleştirmek kalibrasyonu kırar (farklı eşikler = grup başına farklı skor anlamı). İmkansızlık teoremi iş başında — her düzeltme ihlali hareket ettirir, asla ortadan kaldırmaz.</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Diğer Hafifletme Stratejileri</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yeniden Ağırlıklandırma (Kamiran 2012)</div><div class="card-body">Ön-işleme: (A, Y) korelasyonunu kırmak için eğitim örneklerini (A, Y) bileşik olasılığının tersi ile ağırlıklandır.</div></div>
<div class="calc-card"><div class="card-title">Çekişmeli Yanlılık-Giderme (Zhang 2018)</div><div class="card-body">İç-işleme: Ŷ'den A'yı tahmin etmeye çalışan bir hasım ile birlikte tahmin ediciyi eğit; tahmin edici A'yı gizleyerek kazanır.</div></div>
<div class="calc-card"><div class="card-title">Reddet Seçeneği Sınıflandırma (Kamiran 2012)</div><div class="card-body">Son-işleme: karar sınırına yakın, dezavantajlı grubun lehine tahminleri ters çevir.</div></div>
<div class="calc-card"><div class="card-title">Fairlearn / AIF360</div><div class="card-body">IBM'in AIF360'ı ve Microsoft'un Fairlearn'ü bunların çoğunu sklearn-uyumlu API'lerde uygular.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Bir Metrik Seçme — Pratik Bir Kılavuz</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kıt malın tahsisi (kredi, iş)</div><div class="card-body">Tarihsel verinin hedef grubu az temsil ettiğine inanıyorsan demografik eşitlik; "nitelikli" Y iyi tanımlanmışsa eşit fırsat.</div></div>
<div class="calc-card"><div class="card-title">Risk değerlendirmesi (yeniden suç işleme, dolandırıcılık)</div><div class="card-body">Eşitlenmiş olasılıklar (FPR önemli: yanlış işaretler hayatları mahveder) veya kalibrasyon (skor yorumlanabilirliği insan kullanıcılar için önemlidir).</div></div>
<div class="calc-card"><div class="card-title">Tıbbi tarama</div><div class="card-body">Klinisyenler için kalibrasyon kritiktir; eşit TPR eşit sağlık erişimini sağlar.</div></div>
<div class="calc-card"><div class="card-title">Kişiselleştirme</div><div class="card-body">Bireysel adalet — benzer kullanıcılar benzer teklifler alır. Grup metrikleri bire-bir kararlar için zayıf rehberlerdir.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Hiçbir metrik evrensel olarak doğru değildir. Seçiminizi model kartında belgeleyin (Mitchell 2019), kabul ettiğiniz imkansızlık takaslarını belirtin ve grup adaletini Nedensel Ders 6'daki nedensel denetimle eşleştirin — iki perspektif farklı hataları yakalar.</div>
<p class="l-text">Okuma: Hardt, Price &amp; Srebro (2016) NeurIPS; Chouldechova (2017) Big Data; Kleinberg, Mullainathan &amp; Raghavan (2017) ITCS; Dwork ve ark. (2012) ITCS; Barocas, Hardt &amp; Narayanan, <em>Fairness and Machine Learning</em> (çevrimiçi ücretsiz).</p>
</div>`
};
