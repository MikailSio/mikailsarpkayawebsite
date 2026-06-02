window.FAIRNESS_L6 = {
en: `<p class="l-text"><strong>"Your loan was denied because feature_42 had SHAP value -0.18" is not actionable.</strong> "Your loan would have been approved if your annual income had been \$8,200 higher" is. The shift from feature attribution to <em>counterfactual</em> explanation is the difference between describing a model and giving someone a route. Wachter, Mittelstadt &amp; Russell's 2017 paper <em>Counterfactual Explanations Without Opening the Black Box: Automated Decisions and the GDPR</em> (Harvard JOLT) argued — successfully — that counterfactuals are the form of explanation that legal frameworks like GDPR Article 22 implicitly require, because only counterfactuals tell the affected person what to do.</p>

<p class="l-text">In this lesson we formulate counterfactual search as an optimization problem (minimize change subject to flipping the prediction), implement it in three flavors — naive grid search, gradient descent on a differentiable model, and the diverse-counterfactual approach of DiCE (Mothilal, Sharma &amp; Tan, FAccT 2020) — and learn the new vocabulary that makes counterfactuals operationally useful: <em>actionable recourse</em> (Ustun, Spangher &amp; Liu, FAccT 2019), <em>plausibility</em> (don't ask someone to change their birth year), and <em>FACE</em> (Poyiadzi et al. 2020) which only proposes counterfactuals reachable through a graph of similar real examples. By the end you can build a counterfactual generator that proposes realistic, minimal, diverse changes — the explanation form a regulator (and a customer) actually accepts.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Formulate counterfactual search as constrained optimization (Wachter 2017) and solve it three ways</li>
<li>Distinguish minimal (closest), diverse (DiCE), plausible (on-manifold), and actionable (recourse) counterfactuals</li>
<li>Implement counterfactual generation via grid search, gradient descent, and FACE-style graph traversal</li>
<li>Recognize the GDPR / EU AI Act link: why counterfactuals beat feature importance for "right to explanation"</li>
<li>Spot the unfair-recourse trap: equal models can offer cheaper counterfactuals to one group than another</li>
<li>Use counterfactuals to audit fairness — measure cost-of-recourse parity, not just outcome parity</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Wachter 2017 Formulation</h2>
<p class="l-text">A counterfactual <code>x'</code> for a prediction <code>f(x) = y</code> is the closest input that the model would classify differently. Formally:</p>

<div class="katex-block">$$x' = \\arg\\min_{x'} \\;\\; d(x, x') \\quad \\text{subject to} \\quad f(x') \\neq f(x)$$</div>

<p class="l-text">Wachter et al. relaxed the hard constraint into a Lagrangian:</p>

<div class="katex-block">$$\\mathcal{L}(x', \\lambda) = \\lambda \\bigl(f(x') - y_{target}\\bigr)^2 + d(x, x')$$</div>

<p class="l-text">Minimize jointly over <code>x'</code> with <code>λ</code> increased iteratively until the prediction does flip. The distance <code>d</code> is usually L1 (encourages sparse changes — fewer features changed) on standardized features, or weighted L1 reflecting the "cost" of changing each feature (income easy to change, age impossible).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Closeness</div><div class="card-body">Counterfactual is near the original — implies a small change suffices. L1 picks sparse counterfactuals (changing 2 features rather than all 20).</div></div>
<div class="calc-card"><div class="card-title">Validity</div><div class="card-body">The counterfactual actually flips the prediction. Hard constraint, enforced via λ schedule or projection.</div></div>
<div class="calc-card"><div class="card-title">Plausibility</div><div class="card-body">The counterfactual lies on the data manifold. Adding "income = \$10⁹" is mathematically valid but practically nonsense.</div></div>
<div class="calc-card"><div class="card-title">Actionability</div><div class="card-body">The features changed are ones the person can actually modify (income yes, race / birth year no). Ustun 2019 formalizes this as <em>algorithmic recourse</em>.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Naive Grid Search Counterfactuals</h2>
<p class="l-text">For low-dimensional, low-cardinality problems, brute-force search works and is the most reliable starting point. Pick a feature subset, enumerate values, find the smallest-change point that flips the prediction.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier

feats = df_churn.<span class="fn">select_dtypes</span>(<span class="str">'number'</span>).columns.<span class="fn">tolist</span>()[:<span class="num">6</span>]
X = df_churn[feats].<span class="fn">fillna</span>(<span class="num">0</span>).values
y = df_churn[<span class="str">'churned'</span>].values
clf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">120</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)

<span class="cm"># Standardize features for fair distance comparisons</span>
mu, sd = X.<span class="fn">mean</span>(axis=<span class="num">0</span>), X.<span class="fn">std</span>(axis=<span class="num">0</span>) + <span class="num">1e-9</span>

<span class="kw">def</span> <span class="fn">cost</span>(x, x_prime):
    <span class="kw">return</span> np.<span class="fn">abs</span>((x_prime - x) / sd).<span class="fn">sum</span>()    <span class="cm"># weighted L1</span>

<span class="kw">def</span> <span class="fn">grid_counterfactual</span>(x, target_class, n_grid=<span class="num">15</span>):
    <span class="str">"""Search single-feature changes first; then pairs."""</span>
    best = <span class="kw">None</span>
    <span class="cm"># Single-feature sweeps</span>
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(x)):
        grid = np.<span class="fn">linspace</span>(x[j] - <span class="num">3</span>*sd[j], x[j] + <span class="num">3</span>*sd[j], n_grid)
        <span class="kw">for</span> v <span class="kw">in</span> grid:
            xp = x.<span class="fn">copy</span>(); xp[j] = v
            <span class="kw">if</span> clf.<span class="fn">predict</span>(xp.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>] == target_class:
                c = <span class="fn">cost</span>(x, xp)
                <span class="kw">if</span> best <span class="kw">is</span> <span class="kw">None</span> <span class="kw">or</span> c &lt; best[<span class="num">0</span>]:
                    best = (c, xp.<span class="fn">copy</span>(), [(feats[j], x[j], v)])
    <span class="kw">return</span> best

x_target = X[<span class="num">0</span>]
current = clf.<span class="fn">predict</span>(x_target.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>]
target  = <span class="num">1</span> - current
result = <span class="fn">grid_counterfactual</span>(x_target, target)
<span class="kw">if</span> result:
    cost_v, xp, changes = result
    <span class="fn">print</span>(f<span class="str">'Original prediction: {current}, counterfactual: {target}, cost: {cost_v:.3f}'</span>)
    <span class="kw">for</span> f, before, after <span class="kw">in</span> changes:
        <span class="fn">print</span>(f<span class="str">'  change {f}: {before:.2f} → {after:.2f}  (Δ={after-before:+.2f})'</span>)
<span class="kw">else</span>:
    <span class="fn">print</span>(<span class="str">'No single-feature counterfactual found; would need multi-feature search.'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) fits a <code>RandomForestClassifier</code> on six churn features and stores per-feature standard deviations <code>sd</code> so distances can be standardised — <code>cost(x, x_prime)</code> is the weighted-L1 sum <code>|Δ|/sd</code>. 2) <code>grid_counterfactual(x, target_class, n_grid)</code> sweeps each single feature <code>j</code> across a 15-point grid centred on <code>x[j] ± 3·sd[j]</code>, calls <code>clf.predict(...)</code> on every candidate, and keeps the lowest-cost change that flips the prediction to <code>target_class</code>. 3) calls the helper on <code>X[0]</code> with target = the opposite of the current prediction and prints the (feature, before, after) tuple — the cheapest single-feature counterfactual on the chosen row.</p>

<p class="l-text">Grid search scales as <code>O(d^k · grid_size^k)</code> for k-feature changes — fine for k=1, painful for k=2, hopeless for k=3+. For higher dimensions we need gradient or sampling methods.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Gradient-Based Counterfactuals</h2>
<p class="l-text">When the model is differentiable (logistic regression, neural nets, gradient-boosted trees with smoothing), Wachter's Lagrangian can be optimized by gradient descent on <code>x'</code>. The gradient of the validity term pulls <code>x'</code> across the decision boundary; the gradient of the distance term pulls it back toward <code>x</code>. The balance <code>λ</code> is increased every few hundred steps until validity is achieved.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Gradient descent counterfactual on a logistic regression — finite differences for grad</span>
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">import</span> numpy <span class="kw">as</span> np

lr = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(X, y)
x = X[<span class="num">0</span>].<span class="fn">copy</span>().<span class="fn">astype</span>(<span class="fn">float</span>)
target = <span class="num">1</span> - <span class="fn">int</span>(lr.<span class="fn">predict</span>(x.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>])

<span class="kw">def</span> <span class="fn">loss</span>(xp, lam):
    f = lr.<span class="fn">predict_proba</span>(xp.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>, target]
    valid = (<span class="num">1</span> - f)**<span class="num">2</span>                                <span class="cm"># want f → 1, so penalty 0</span>
    dist  = np.<span class="fn">abs</span>((xp - x) / sd).<span class="fn">sum</span>()
    <span class="kw">return</span> lam * valid + dist

<span class="cm"># Approximate gradient by finite differences (works without autograd)</span>
<span class="kw">def</span> <span class="fn">grad</span>(xp, lam, eps=<span class="num">1e-3</span>):
    g = np.<span class="fn">zeros_like</span>(xp)
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(xp)):
        xp_p = xp.<span class="fn">copy</span>(); xp_p[j] += eps
        g[j] = (<span class="fn">loss</span>(xp_p, lam) - <span class="fn">loss</span>(xp, lam)) / eps
    <span class="kw">return</span> g

xp = x.<span class="fn">copy</span>()
lam = <span class="num">1.0</span>
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    xp = xp - <span class="num">0.05</span> * <span class="fn">grad</span>(xp, lam)
    <span class="kw">if</span> step % <span class="num">50</span> == <span class="num">49</span>:
        lam *= <span class="num">2</span>                                       <span class="cm"># increase validity weight</span>
        pred = <span class="fn">int</span>(lr.<span class="fn">predict</span>(xp.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>])
        <span class="fn">print</span>(f<span class="str">'step {step+1}: pred={pred}, cost={cost(x, xp):.3f}, lam={lam}'</span>)

changed = [(feats[j], x[j], xp[j]) <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(x)) <span class="kw">if</span> <span class="fn">abs</span>(xp[j] - x[j]) &gt; <span class="num">0.05</span>*sd[j]]
<span class="fn">print</span>(<span class="str">'Final counterfactual changes:'</span>)
<span class="kw">for</span> f, before, after <span class="kw">in</span> changed:
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;20s} {before:.2f} → {after:.2f}  (Δ={after-before:+.2f})'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) fits a <code>LogisticRegression</code> and defines <code>loss(xp, lam) = lam·(1−f)² + ‖(xp−x)/sd‖₁</code> — Wachter's Lagrangian with the validity term pulling <code>xp</code> toward the target class and the distance term keeping it near <code>x</code>. 2) approximates the gradient with finite differences (<code>(loss(xp_p) − loss(xp))/eps</code> per coordinate) so it works without autograd, then runs 200 steps of plain gradient descent <code>xp = xp − 0.05·grad(xp, lam)</code>. 3) doubles <code>lam</code> every 50 steps until <code>lr.predict(xp)</code> flips to the target, then reports the features whose absolute change exceeds <code>0.05·sd[j]</code> — the active dimensions of the counterfactual.</p>

<p class="l-text">In a real PyTorch setup the inner loop becomes <code>(xp - lr * xp.grad)</code> with autograd — same algorithm, much faster. The DiCE library implements this with a few extra terms (diversity, plausibility) discussed below.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. DiCE: Diverse Counterfactual Explanations (Mothilal 2020)</h2>
<p class="l-text">A single counterfactual is brittle — small perturbations in the input give totally different counterfactuals, and the user gets no sense of what other routes exist. Mothilal, Sharma &amp; Tan (FAccT 2020) extended Wachter's loss with a <em>diversity</em> term that encourages multiple counterfactuals to differ from each other:</p>

<div class="katex-block">$$\\mathcal{L}_{DiCE} = \\sum_k \\bigl[\\lambda_1 \\, \\text{validity}(x_k') + \\lambda_2 \\, d(x, x_k')\\bigr] - \\lambda_3 \\, \\text{diversity}(\\{x_k'\\})$$</div>

<p class="l-text">Diversity is measured as the determinant of a kernel matrix over the counterfactual set (determinantal point process — Kulesza &amp; Taskar 2012). Larger determinant = more spread-out set. The user receives 3-5 alternative routes and picks the one most achievable for them.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Validity</div><div class="card-body">Each counterfactual flips the prediction.</div></div>
<div class="calc-card"><div class="card-title">Proximity</div><div class="card-body">Each is close to the original.</div></div>
<div class="calc-card"><div class="card-title">Diversity</div><div class="card-body">The set spans different feature changes — not 5 variants of the same change.</div></div>
<div class="calc-card"><div class="card-title">Sparsity</div><div class="card-body">Each changes few features. Easier to act on.</div></div>
</div>

<p class="l-text">DiCE supports four backends: <code>sklearn</code> (random sampling), <code>tensorflow</code>, <code>pytorch</code>, and a generic <code>genetic</code> algorithm. The genetic backend is particularly useful when the model is not differentiable and grid search is too expensive.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Plausibility &amp; FACE (Poyiadzi 2020)</h2>
<p class="l-text">A counterfactual that lies far off the training-data manifold is mathematically valid but useless: "approve loan if applicant has 50 children" is not advice anyone can act on. Poyiadzi, Sokol, Santos-Rodriguez, De Bie &amp; Flach (AIES 2020) <em>FACE: Feasible and Actionable Counterfactual Explanations</em> reframed the search as a graph traversal: build a k-NN graph over training points, weight edges by density, find the shortest path from <code>x</code> to a region of the opposite class. Every step is on the data manifold by construction.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># FACE-style counterfactual: shortest path through real training points</span>
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> heapq

<span class="kw">def</span> <span class="fn">face_counterfactual</span>(x, X_train, y_train, model, target_class, k=<span class="num">5</span>):
    nn = <span class="fn">NearestNeighbors</span>(n_neighbors=k).<span class="fn">fit</span>(X_train)
    <span class="cm"># Dijkstra from x: nodes are training rows, edges to k nearest neighbors</span>
    queue = [(<span class="num">0.0</span>, -<span class="num">1</span>, [-<span class="num">1</span>])]                               <span class="cm"># virtual start</span>
    visited = <span class="fn">set</span>()
    <span class="cm"># Start: connect to k neighbors of x</span>
    dists, idx = nn.<span class="fn">kneighbors</span>(x.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))
    <span class="kw">for</span> d, i <span class="kw">in</span> <span class="fn">zip</span>(dists[<span class="num">0</span>], idx[<span class="num">0</span>]):
        heapq.<span class="fn">heappush</span>(queue, (d, <span class="fn">int</span>(i), [<span class="fn">int</span>(i)]))
    <span class="kw">while</span> queue:
        d, node, path = heapq.<span class="fn">heappop</span>(queue)
        <span class="kw">if</span> node <span class="kw">in</span> visited: <span class="kw">continue</span>
        visited.<span class="fn">add</span>(node)
        <span class="kw">if</span> model.<span class="fn">predict</span>(X_train[node].<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>] == target_class:
            <span class="kw">return</span> X_train[node], path, d
        nd, ni = nn.<span class="fn">kneighbors</span>(X_train[node].<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))
        <span class="kw">for</span> dd, jj <span class="kw">in</span> <span class="fn">zip</span>(nd[<span class="num">0</span>], ni[<span class="num">0</span>]):
            jj = <span class="fn">int</span>(jj)
            <span class="kw">if</span> jj <span class="kw">not</span> <span class="kw">in</span> visited:
                heapq.<span class="fn">heappush</span>(queue, (d + dd, jj, path + [jj]))
    <span class="kw">return</span> <span class="kw">None</span>, <span class="kw">None</span>, <span class="kw">None</span>

x_target = X[<span class="num">0</span>]
current = clf.<span class="fn">predict</span>(x_target.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>]
xp, path, total_dist = <span class="fn">face_counterfactual</span>(x_target, X, y, clf, <span class="num">1</span> - current, k=<span class="num">8</span>)
<span class="kw">if</span> xp <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
    <span class="fn">print</span>(f<span class="str">'FACE counterfactual found via {len(path)} steps, total path distance {total_dist:.2f}'</span>)
    <span class="fn">print</span>(f<span class="str">'Original features: {dict(zip(feats, x_target.round(2)))}'</span>)
    <span class="fn">print</span>(f<span class="str">'Counterfactual:    {dict(zip(feats, xp.round(2)))}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a <code>NearestNeighbors(n_neighbors=k)</code> index over the training rows so every node has an edge to its k closest real-world neighbours — the graph FACE walks. 2) inside <code>face_counterfactual</code> runs a Dijkstra-style search with <code>heapq</code>: seed the priority queue from <code>nn.kneighbors(x)</code>, then pop the closest unvisited node, check <code>model.predict(X_train[node]) == target_class</code>, and push that node's k neighbours back into the heap with cumulative distance <code>d + dd</code>. 3) returns the first node whose prediction matches the target plus the path that reached it — a counterfactual built entirely from on-manifold training rows, never an interpolated fantasy.</p>

<p class="l-text">FACE counterfactuals are more believable but typically larger (the path through real points is rarely the straightest line). The trade-off is closeness vs. plausibility; in practice, regulators and lay users prefer plausible-larger over close-implausible.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Algorithmic Recourse (Ustun, Spangher &amp; Liu 2019)</h2>
<p class="l-text">Ustun, Spangher &amp; Liu (FAccT 2019) sharpened the formulation further: not all features are <em>actionable</em>. Race, birthplace, age cannot be changed; education, savings can. Recourse formulates counterfactual search with a hard constraint that only actionable features may move, and an explicit cost function reflecting the real-world difficulty of each change ("increase income by \$10k" might cost 10 units; "complete a 4-year degree" might cost 100).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Immutable features</div><div class="card-body">Race, sex, birthplace, age (in many contexts), national origin. Hard constraint: counterfactual must equal original on these.</div></div>
<div class="calc-card"><div class="card-title">Conditionally mutable</div><div class="card-body">Address (changeable but costly), employment status (changeable), education (changeable but slow). Bounded constraints.</div></div>
<div class="calc-card"><div class="card-title">Freely mutable</div><div class="card-body">Loan amount requested, repayment term, declared expenses. The model's "knobs" the user can turn most easily.</div></div>
</div>

<p class="l-text">Ustun's framework lets you compute the <em>cost of recourse</em> for each rejected applicant and report it to them: "to be approved you would need to increase income by \$8k AND extend term by 12 months — total cost score 14". This is the form regulators (UK ICO, EU AI Act) increasingly expect for high-stakes denials.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The GDPR / EU AI Act Connection</h2>
<p class="l-text">GDPR Article 22 (in force 2018) gives EU residents the right not to be subject to solely automated decisions with legal effect, plus the right to "obtain human intervention, express a point of view, contest the decision". Wachter et al. 2017 argued — and most legal scholars later agreed — that <em>contesting</em> implicitly requires a counterfactual: you cannot contest "your loan was denied" without knowing what would have changed it.</p>

<p class="l-text">The EU AI Act (entry into force 2024, full application 2026) goes further: high-risk systems must provide explanations "appropriate to the affected person", which most commentators interpret as actionable rather than feature-importance-based. The US FTC and CFPB have signaled similar expectations. Counterfactuals are not legally mandated by name in either framework, but they are the form of explanation the laws were written to require.</p>

<div class="calc-highlight"><strong>Operational consequence:</strong> if your model makes high-stakes decisions on EU residents in 2026+, your explanation pipeline should include counterfactuals (DiCE or equivalent) by default — not as an extra, but as the primary user-facing explanation. SHAP and LIME become diagnostic tools for the data science team; counterfactuals become the customer-facing artifact.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Counterfactual Fairness Audits</h2>
<p class="l-text">Counterfactuals enable a fairness metric that aggregates do not: <em>cost-of-recourse parity</em>. Compute the counterfactual cost for every rejected applicant, group by protected attribute, and check whether the average cost is comparable. If group A's rejected applicants need a \$5k income bump while group B's need \$12k, the model is unfair even if outcome rates match.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Cost-of-recourse audit</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
s = (rng.<span class="fn">random</span>(<span class="fn">len</span>(X)) &lt; <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
preds = clf.<span class="fn">predict</span>(X)
rejected_idx = np.<span class="fn">where</span>(preds == <span class="num">1</span>)[<span class="num">0</span>]                 <span class="cm"># 1=churn, treat as 'rejected'</span>

costs_by_group = {<span class="num">0</span>: [], <span class="num">1</span>: []}
<span class="kw">for</span> idx <span class="kw">in</span> rejected_idx[:<span class="num">30</span>]:
    target = <span class="num">1</span> - preds[idx]
    res = <span class="fn">grid_counterfactual</span>(X[idx], target)
    <span class="kw">if</span> res <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
        costs_by_group[s[idx]].<span class="fn">append</span>(res[<span class="num">0</span>])

<span class="kw">for</span> g, costs <span class="kw">in</span> costs_by_group.<span class="fn">items</span>():
    <span class="kw">if</span> costs:
        <span class="fn">print</span>(f<span class="str">'Group {g}: mean recourse cost = {np.mean(costs):.2f}  (n={len(costs)})'</span>)
<span class="fn">print</span>(<span class="str">'A large gap → unequal recourse → fairness concern even if outcome rates match.'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) synthesises a binary protected attribute <code>s</code> with <code>rng.random() &lt; 0.5</code>, runs <code>clf.predict(X)</code>, and treats the rows where churn=1 as "rejected" (the population that needs recourse). 2) iterates over the first 30 rejected indices, calls <code>grid_counterfactual</code> on each to find the cheapest single-feature flip, and appends the returned cost to <code>costs_by_group[s[idx]]</code>. 3) reports the mean recourse cost per group — if group 0 averages <code>cost=2.1</code> and group 1 averages <code>cost=5.8</code>, the model is asking one group to work much harder for the same approval even when overall outcome rates match.</p>

<p class="l-text">Sharma, Henderson &amp; Ghosh (FAccT 2020) <em>CERTIFAI</em> built an entire fairness framework around exactly this — counterfactual cost is the basis of their "burden-of-recourse" metric. Sometimes the fairest model is not the one with closest outcome rates but the one with closest recourse costs.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Pitfalls &amp; Production Notes</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Time-shift</div><div class="card-body">A counterfactual computed today may be invalid tomorrow if the model is retrained. Barocas, Selbst &amp; Raghavan (FAccT 2020) call this <em>recourse drift</em>; promises made on Monday may not hold on Friday.</div></div>
<div class="calc-card"><div class="card-title">Strategic gaming</div><div class="card-body">Once you publish counterfactuals, applicants can game them. If "increase income by \$5k" approves you, every borderline applicant claims +\$5k. Hardt, Megiddo, Papadimitriou &amp; Wootters (ITCS 2016) showed strategic classification anticipates and partially mitigates this.</div></div>
<div class="calc-card"><div class="card-title">Causation vs. correlation</div><div class="card-body">A counterfactual that says "raise FICO score" is not actionable if FICO is itself an effect, not a cause. Karimi, Schölkopf &amp; Valera (NeurIPS 2020) <em>recourse with causal interventions</em> requires a structural causal model.</div></div>
<div class="calc-card"><div class="card-title">Multiple flips</div><div class="card-body">Counterfactual generators sometimes propose changes that flip the prediction back-and-forth across thresholds. Always verify the counterfactual still flips on a fresh model evaluation.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Summary &amp; Next</h2>
<p class="l-text">Counterfactuals shift explanation from "what mattered" to "what would have changed". The mathematics is a constrained optimization (Wachter 2017); the practice is a balance of closeness, validity, plausibility, diversity, and actionability. DiCE handles diversity, FACE handles plausibility, recourse frameworks (Ustun 2019) handle actionability — pick the combination matching your application.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Counterfactual = closest input that flips the prediction. Wachter 2017 Lagrangian: <code>λ·validity + d(x, x')</code>.</li>
<li>Three solvers: grid search (low-D), gradient descent (differentiable models), graph-based FACE (high-D, plausibility-first).</li>
<li>DiCE (Mothilal 2020) returns 3-5 diverse counterfactuals via determinantal point process.</li>
<li>Recourse (Ustun 2019) restricts moves to actionable features and weights them by real-world cost.</li>
<li>GDPR / EU AI Act expectations: counterfactuals are increasingly the customer-facing explanation; SHAP/LIME stay internal.</li>
<li>Cost-of-recourse parity is a fairness metric outcome-rate parity cannot capture.</li>
</ul>
</div>

<p class="l-text"><strong>fairness-L7</strong> opens the black-box of LLMs themselves with mechanistic interpretability — Olah's circuits, sparse autoencoders, and Anthropic's 2024 Scaling Monosemanticity work. <strong>L8</strong> capstones the entire track on a fair, explainable loan model.</p>
</div>`,
tr: `<p class="l-text"><strong>"Krediniz reddedildi çünkü feature_42 SHAP değeri -0.18'di" eyleme dönük değil.</strong> "Yıllık geliriniz \$8.200 daha yüksek olsaydı krediniz onaylanırdı" eyleme dönüktür. Özellik atfından <em>karşı-olgu</em> açıklamasına geçiş, bir modeli betimlemekle birine bir rota vermek arasındaki farktır. Wachter, Mittelstadt &amp; Russell'ın 2017 makalesi <em>Kara Kutuyu Açmadan Karşı-Olgu Açıklamaları: Otomatik Kararlar ve GDPR</em> (Harvard JOLT), karşı-olguların GDPR Madde 22 gibi yasal çerçevelerin örtük olarak gerektirdiği açıklama formu olduğunu savundu — başarıyla — çünkü yalnızca karşı-olgular etkilenen kişiye ne yapacağını söyler.</p>

<p class="l-text">Bu derste karşı-olgu aramayı bir optimizasyon problemi olarak formüle ediyoruz (tahmini çevirme kısıtı altında değişikliği minimize et), üç türde uyguluyoruz — saf ızgara araması, türevlenebilir bir modelde gradyan inişi ve DiCE'nin (Mothilal, Sharma &amp; Tan, FAccT 2020) çeşitli-karşı-olgu yaklaşımı — ve karşı-olguları operasyonel olarak yararlı kılan yeni kelime dağarcığını öğreniyoruz: <em>eyleme dönük rota</em> (Ustun, Spangher &amp; Liu, FAccT 2019), <em>akla yatkınlık</em> (kimseden doğum yılını değiştirmesini isteme) ve yalnızca benzer gerçek örneklerin grafiği üzerinden ulaşılabilir karşı-olgular öneren <em>FACE</em> (Poyiadzi ve ark. 2020). Sonunda gerçekçi, minimal, çeşitli değişiklikler öneren bir karşı-olgu üreticisi inşa edebileceksin — bir düzenleyicinin (ve bir müşterinin) gerçekten kabul ettiği açıklama formu.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Karşı-olgu aramayı kısıtlı optimizasyon olarak formüle et (Wachter 2017) ve üç şekilde çöz</li>
<li>Minimal (en yakın), çeşitli (DiCE), akla yatkın (manifold üzerinde) ve eyleme dönük (rota) karşı-olguları ayırt et</li>
<li>Karşı-olgu üretimini ızgara araması, gradyan inişi ve FACE-tarzı grafik geçişi ile uygula</li>
<li>GDPR / EU AI Act bağlantısını tanı: "açıklama hakkı" için neden karşı-olgular özellik öneminden üstündür</li>
<li>Adil olmayan rota tuzağını fark et: eşit modeller bir gruba diğerinden daha ucuz karşı-olgu sunabilir</li>
<li>Karşı-olguları adillik denetiminde kullan — yalnızca sonuç paritesi değil, rota maliyeti paritesini ölç</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Wachter 2017 Formülasyonu</h2>
<p class="l-text"><code>f(x) = y</code> tahmini için karşı-olgu <code>x'</code>, modelin farklı sınıflandıracağı en yakın girdidir. Resmi olarak:</p>

<div class="katex-block">$$x' = \\arg\\min_{x'} \\;\\; d(x, x') \\quad \\text{subject to} \\quad f(x') \\neq f(x)$$</div>

<p class="l-text">Wachter ve ark. sert kısıtı bir Lagrangian'a gevşettiler:</p>

<div class="katex-block">$$\\mathcal{L}(x', \\lambda) = \\lambda \\bigl(f(x') - y_{target}\\bigr)^2 + d(x, x')$$</div>

<p class="l-text"><code>x'</code> üzerinde ortak olarak minimize et, <code>λ</code>'yı tahmin gerçekten çevrilene kadar kademeli olarak artır. Mesafe <code>d</code> genellikle standartlaştırılmış öznitelikler üzerinde L1 (seyrek değişiklikleri teşvik eder — daha az öznitelik değiştirilir) veya her özniteliği değiştirmenin "maliyetini" yansıtan ağırlıklı L1'dir (gelir kolay değişir, yaş imkânsız).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yakınlık</div><div class="card-body">Karşı-olgu orijinale yakın — küçük bir değişikliğin yeterli olduğunu ima eder. L1 seyrek karşı-olguları seçer (20 yerine 2 öznitelik değiştir).</div></div>
<div class="calc-card"><div class="card-title">Geçerlilik</div><div class="card-body">Karşı-olgu tahmini gerçekten çevirir. Sert kısıt, λ programı veya projeksiyonla uygulanır.</div></div>
<div class="calc-card"><div class="card-title">Akla yatkınlık</div><div class="card-body">Karşı-olgu veri manifoldunda yer alır. "gelir = \$10⁹" eklemek matematiksel olarak geçerli ama pratik olarak saçma.</div></div>
<div class="calc-card"><div class="card-title">Eyleme dönüklük</div><div class="card-body">Değiştirilen öznitelikler kişinin gerçekten değiştirebileceği olanlar (gelir evet, ırk / doğum yılı hayır). Ustun 2019 bunu <em>algoritmik rota</em> olarak resmileştirir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Saf Izgara Araması Karşı-Olguları</h2>
<p class="l-text">Düşük boyutlu, düşük kardinaliteli problemler için kaba kuvvet araması işe yarar ve en güvenilir başlangıç noktasıdır. Bir öznitelik alt kümesi seç, değerleri numaralandır, tahmini çeviren en küçük değişikliğe sahip noktayı bul.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier

feats = df_churn.<span class="fn">select_dtypes</span>(<span class="str">'number'</span>).columns.<span class="fn">tolist</span>()[:<span class="num">6</span>]
X = df_churn[feats].<span class="fn">fillna</span>(<span class="num">0</span>).values
y = df_churn[<span class="str">'churned'</span>].values
clf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">120</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)

<span class="cm"># Standardize features for fair distance comparisons</span>
mu, sd = X.<span class="fn">mean</span>(axis=<span class="num">0</span>), X.<span class="fn">std</span>(axis=<span class="num">0</span>) + <span class="num">1e-9</span>

<span class="kw">def</span> <span class="fn">cost</span>(x, x_prime):
    <span class="kw">return</span> np.<span class="fn">abs</span>((x_prime - x) / sd).<span class="fn">sum</span>()    <span class="cm"># weighted L1</span>

<span class="kw">def</span> <span class="fn">grid_counterfactual</span>(x, target_class, n_grid=<span class="num">15</span>):
    <span class="str">"""Search single-feature changes first; then pairs."""</span>
    best = <span class="kw">None</span>
    <span class="cm"># Single-feature sweeps</span>
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(x)):
        grid = np.<span class="fn">linspace</span>(x[j] - <span class="num">3</span>*sd[j], x[j] + <span class="num">3</span>*sd[j], n_grid)
        <span class="kw">for</span> v <span class="kw">in</span> grid:
            xp = x.<span class="fn">copy</span>(); xp[j] = v
            <span class="kw">if</span> clf.<span class="fn">predict</span>(xp.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>] == target_class:
                c = <span class="fn">cost</span>(x, xp)
                <span class="kw">if</span> best <span class="kw">is</span> <span class="kw">None</span> <span class="kw">or</span> c &lt; best[<span class="num">0</span>]:
                    best = (c, xp.<span class="fn">copy</span>(), [(feats[j], x[j], v)])
    <span class="kw">return</span> best

x_target = X[<span class="num">0</span>]
current = clf.<span class="fn">predict</span>(x_target.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>]
target  = <span class="num">1</span> - current
result = <span class="fn">grid_counterfactual</span>(x_target, target)
<span class="kw">if</span> result:
    cost_v, xp, changes = result
    <span class="fn">print</span>(f<span class="str">'Original prediction: {current}, counterfactual: {target}, cost: {cost_v:.3f}'</span>)
    <span class="kw">for</span> f, before, after <span class="kw">in</span> changes:
        <span class="fn">print</span>(f<span class="str">'  change {f}: {before:.2f} → {after:.2f}  (Δ={after-before:+.2f})'</span>)
<span class="kw">else</span>:
    <span class="fn">print</span>(<span class="str">'No single-feature counterfactual found; would need multi-feature search.'</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Altı churn özniteliği üzerinde bir <code>RandomForestClassifier</code> oturtur ve mesafeleri standartlaştırmak için öznitelik başına standart sapmaları <code>sd</code>'de tutar — <code>cost(x, x_prime)</code> ağırlıklı L1 toplamı <code>|Δ|/sd</code>'dir. 2) <code>grid_counterfactual(x, target_class, n_grid)</code>, her tekil özniteliği <code>x[j] ± 3·sd[j]</code> merkezli 15-noktalık bir grid üzerinde tarar, her aday için <code>clf.predict(...)</code> çağırır ve tahmini <code>target_class</code>'a çeviren en düşük maliyetli değişikliği saklar. 3) Yardımcı fonksiyonu <code>X[0]</code> üzerinde — hedef = mevcut tahminin tersi — çağırır ve (öznitelik, önce, sonra) üçlüsünü yazdırır; seçilen satır için en ucuz tek-öznitelik karşı-olgu.</p>

<p class="l-text">Izgara araması k-öznitelik değişiklikleri için <code>O(d^k · grid_size^k)</code> olarak ölçeklenir — k=1 için iyi, k=2 için ağrılı, k=3+ için umutsuz. Daha yüksek boyutlar için gradyan veya örnekleme yöntemleri gerekir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Gradyan Tabanlı Karşı-Olgular</h2>
<p class="l-text">Model türevlenebilir olduğunda (lojistik regresyon, sinir ağları, yumuşatmalı gradyan-boostlu ağaçlar), Wachter'in Lagrangian'ı <code>x'</code> üzerinde gradyan inişi ile optimize edilebilir. Geçerlilik teriminin gradyanı <code>x'</code>'i karar sınırının karşısına çeker; mesafe teriminin gradyanı onu <code>x</code>'e doğru geri çeker. Geçerlilik sağlanana kadar denge <code>λ</code> her birkaç yüz adımda artırılır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Gradient descent counterfactual on a logistic regression — finite differences for grad</span>
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">import</span> numpy <span class="kw">as</span> np

lr = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(X, y)
x = X[<span class="num">0</span>].<span class="fn">copy</span>().<span class="fn">astype</span>(<span class="fn">float</span>)
target = <span class="num">1</span> - <span class="fn">int</span>(lr.<span class="fn">predict</span>(x.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>])

<span class="kw">def</span> <span class="fn">loss</span>(xp, lam):
    f = lr.<span class="fn">predict_proba</span>(xp.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>, target]
    valid = (<span class="num">1</span> - f)**<span class="num">2</span>                                <span class="cm"># want f → 1, so penalty 0</span>
    dist  = np.<span class="fn">abs</span>((xp - x) / sd).<span class="fn">sum</span>()
    <span class="kw">return</span> lam * valid + dist

<span class="cm"># Approximate gradient by finite differences (works without autograd)</span>
<span class="kw">def</span> <span class="fn">grad</span>(xp, lam, eps=<span class="num">1e-3</span>):
    g = np.<span class="fn">zeros_like</span>(xp)
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(xp)):
        xp_p = xp.<span class="fn">copy</span>(); xp_p[j] += eps
        g[j] = (<span class="fn">loss</span>(xp_p, lam) - <span class="fn">loss</span>(xp, lam)) / eps
    <span class="kw">return</span> g

xp = x.<span class="fn">copy</span>()
lam = <span class="num">1.0</span>
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    xp = xp - <span class="num">0.05</span> * <span class="fn">grad</span>(xp, lam)
    <span class="kw">if</span> step % <span class="num">50</span> == <span class="num">49</span>:
        lam *= <span class="num">2</span>                                       <span class="cm"># increase validity weight</span>
        pred = <span class="fn">int</span>(lr.<span class="fn">predict</span>(xp.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>])
        <span class="fn">print</span>(f<span class="str">'step {step+1}: pred={pred}, cost={cost(x, xp):.3f}, lam={lam}'</span>)

changed = [(feats[j], x[j], xp[j]) <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(x)) <span class="kw">if</span> <span class="fn">abs</span>(xp[j] - x[j]) &gt; <span class="num">0.05</span>*sd[j]]
<span class="fn">print</span>(<span class="str">'Final counterfactual changes:'</span>)
<span class="kw">for</span> f, before, after <span class="kw">in</span> changed:
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;20s} {before:.2f} → {after:.2f}  (Δ={after-before:+.2f})'</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Bir <code>LogisticRegression</code> oturtur ve <code>loss(xp, lam) = lam·(1−f)² + ‖(xp−x)/sd‖₁</code>'i tanımlar — Wachter'in Lagrangian'ı: geçerlilik terimi <code>xp</code>'yi hedef sınıfa, mesafe terimi onu <code>x</code>'e yakın tutar. 2) Gradyanı sonlu farklarla (<code>(loss(xp_p) − loss(xp))/eps</code> her koordinat için) yaklaşıklar — böylece autograd olmadan çalışır — sonra 200 adım sade gradyan inişi koşturur: <code>xp = xp − 0.05·grad(xp, lam)</code>. 3) <code>lr.predict(xp)</code> hedefe çevrilene kadar her 50 adımda <code>lam</code>'ı iki katına çıkarır, sonra mutlak değişimi <code>0.05·sd[j]</code>'yi aşan öznitelikleri raporlar — karşı-olgu boyutları aktif olan boyutlar.</p>

<p class="l-text">Gerçek bir PyTorch kurulumunda iç döngü autograd ile <code>(xp - lr * xp.grad)</code> olur — aynı algoritma, çok daha hızlı. DiCE kütüphanesi bunu aşağıda tartışılan birkaç ekstra terimle (çeşitlilik, akla yatkınlık) uygular.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. DiCE: Çeşitli Karşı-Olgu Açıklamaları (Mothilal 2020)</h2>
<p class="l-text">Tek bir karşı-olgu kırılgandır — girdideki küçük pertürbasyonlar tamamen farklı karşı-olgular verir ve kullanıcı başka hangi rotaların var olduğunu hiç bilmez. Mothilal, Sharma &amp; Tan (FAccT 2020), Wachter'in kaybını birden fazla karşı-olgunun birbirinden farklı olmasını teşvik eden bir <em>çeşitlilik</em> terimi ile genişletti:</p>

<div class="katex-block">$$\\mathcal{L}_{DiCE} = \\sum_k \\bigl[\\lambda_1 \\, \\text{validity}(x_k') + \\lambda_2 \\, d(x, x_k')\\bigr] - \\lambda_3 \\, \\text{diversity}(\\{x_k'\\})$$</div>

<p class="l-text">Çeşitlilik, karşı-olgu kümesi üzerinde bir çekirdek matrisinin determinantı olarak ölçülür (determinantal nokta süreci — Kulesza &amp; Taskar 2012). Daha büyük determinant = daha yayılmış küme. Kullanıcı 3-5 alternatif rota alır ve kendileri için en ulaşılabilir olanı seçer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Geçerlilik</div><div class="card-body">Her karşı-olgu tahmini çevirir.</div></div>
<div class="calc-card"><div class="card-title">Yakınlık</div><div class="card-body">Her biri orijinale yakın.</div></div>
<div class="calc-card"><div class="card-title">Çeşitlilik</div><div class="card-body">Küme farklı öznitelik değişikliklerini kapsar — aynı değişikliğin 5 varyantı değil.</div></div>
<div class="calc-card"><div class="card-title">Seyreklik</div><div class="card-body">Her biri az öznitelik değiştirir. Üzerinde harekete geçmek daha kolay.</div></div>
</div>

<p class="l-text">DiCE dört arka uç destekler: <code>sklearn</code> (rastgele örnekleme), <code>tensorflow</code>, <code>pytorch</code> ve genel bir <code>genetic</code> algoritma. Genetik arka uç özellikle modelin türevlenebilir olmadığı ve ızgara aramasının çok pahalı olduğu durumlarda yararlıdır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Akla Yatkınlık ve FACE (Poyiadzi 2020)</h2>
<p class="l-text">Eğitim verisi manifoldunun çok dışında yer alan bir karşı-olgu matematiksel olarak geçerlidir ama yararsızdır: "başvuru sahibinin 50 çocuğu varsa krediyi onayla" kimsenin harekete geçemeyeceği bir tavsiyedir. Poyiadzi, Sokol, Santos-Rodriguez, De Bie &amp; Flach (AIES 2020) <em>FACE: Uygulanabilir ve Eyleme Dönük Karşı-Olgu Açıklamaları</em>, aramayı bir grafik geçişi olarak yeniden çerçeveledi: eğitim noktaları üzerinde k-NN grafiği oluştur, kenarları yoğunluğa göre ağırlıklandır, <code>x</code>'ten karşıt sınıfın bir bölgesine en kısa yolu bul. Her adım yapım gereği veri manifoldundadır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># FACE-style counterfactual: shortest path through real training points</span>
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> heapq

<span class="kw">def</span> <span class="fn">face_counterfactual</span>(x, X_train, y_train, model, target_class, k=<span class="num">5</span>):
    nn = <span class="fn">NearestNeighbors</span>(n_neighbors=k).<span class="fn">fit</span>(X_train)
    <span class="cm"># Dijkstra from x: nodes are training rows, edges to k nearest neighbors</span>
    queue = [(<span class="num">0.0</span>, -<span class="num">1</span>, [-<span class="num">1</span>])]                               <span class="cm"># virtual start</span>
    visited = <span class="fn">set</span>()
    <span class="cm"># Start: connect to k neighbors of x</span>
    dists, idx = nn.<span class="fn">kneighbors</span>(x.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))
    <span class="kw">for</span> d, i <span class="kw">in</span> <span class="fn">zip</span>(dists[<span class="num">0</span>], idx[<span class="num">0</span>]):
        heapq.<span class="fn">heappush</span>(queue, (d, <span class="fn">int</span>(i), [<span class="fn">int</span>(i)]))
    <span class="kw">while</span> queue:
        d, node, path = heapq.<span class="fn">heappop</span>(queue)
        <span class="kw">if</span> node <span class="kw">in</span> visited: <span class="kw">continue</span>
        visited.<span class="fn">add</span>(node)
        <span class="kw">if</span> model.<span class="fn">predict</span>(X_train[node].<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>] == target_class:
            <span class="kw">return</span> X_train[node], path, d
        nd, ni = nn.<span class="fn">kneighbors</span>(X_train[node].<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))
        <span class="kw">for</span> dd, jj <span class="kw">in</span> <span class="fn">zip</span>(nd[<span class="num">0</span>], ni[<span class="num">0</span>]):
            jj = <span class="fn">int</span>(jj)
            <span class="kw">if</span> jj <span class="kw">not</span> <span class="kw">in</span> visited:
                heapq.<span class="fn">heappush</span>(queue, (d + dd, jj, path + [jj]))
    <span class="kw">return</span> <span class="kw">None</span>, <span class="kw">None</span>, <span class="kw">None</span>

x_target = X[<span class="num">0</span>]
current = clf.<span class="fn">predict</span>(x_target.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>]
xp, path, total_dist = <span class="fn">face_counterfactual</span>(x_target, X, y, clf, <span class="num">1</span> - current, k=<span class="num">8</span>)
<span class="kw">if</span> xp <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
    <span class="fn">print</span>(f<span class="str">'FACE counterfactual found via {len(path)} steps, total path distance {total_dist:.2f}'</span>)
    <span class="fn">print</span>(f<span class="str">'Original features: {dict(zip(feats, x_target.round(2)))}'</span>)
    <span class="fn">print</span>(f<span class="str">'Counterfactual:    {dict(zip(feats, xp.round(2)))}'</span>)
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Eğitim satırları üzerinde bir <code>NearestNeighbors(n_neighbors=k)</code> indeksi kurar; her düğüm k tane en yakın gerçek-dünya komşusuna bir kenara sahip olur — FACE'in yürüdüğü grafik. 2) <code>face_counterfactual</code> içinde <code>heapq</code> ile Dijkstra-tarzı bir arama koşturur: öncelik kuyruğunu <code>nn.kneighbors(x)</code> ile tohumlar, sonra en yakın ziyaret edilmemiş düğümü çıkarır, <code>model.predict(X_train[node]) == target_class</code>'ı kontrol eder ve o düğümün k komşusunu kümülatif mesafe <code>d + dd</code> ile heap'e geri iter. 3) Tahmini hedefe eşleşen ilk düğümü ve oraya ulaşan yolu döner — tamamen manifold üzerindeki eğitim satırlarından inşa edilmiş, hiç enterpolasyonlu hayal içermeyen bir karşı-olgu.</p>

<p class="l-text">FACE karşı-olguları daha inandırıcıdır ama tipik olarak daha büyüktür (gerçek noktalardan geçen yol nadiren en düz çizgidir). Değiş tokuş yakınlık vs. akla yatkınlıktır; pratikte düzenleyiciler ve sıradan kullanıcılar yakın-akla yatkın olmayan yerine akla yatkın-daha büyüğü tercih ederler.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Algoritmik Rota (Ustun, Spangher &amp; Liu 2019)</h2>
<p class="l-text">Ustun, Spangher &amp; Liu (FAccT 2019) formülasyonu daha da keskinleştirdi: tüm öznitelikler <em>eyleme dönük</em> değildir. Irk, doğum yeri, yaş değiştirilemez; eğitim, tasarruf değiştirilebilir. Rota, yalnızca eyleme dönük özniteliklerin hareket edebileceği sert bir kısıt ve her değişikliğin gerçek-dünya zorluğunu yansıtan açık bir maliyet fonksiyonu ile karşı-olgu aramayı formüle eder ("geliri \$10k artır" 10 birim maliyet olabilir; "4 yıllık derece tamamla" 100 maliyet olabilir).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Değişmez öznitelikler</div><div class="card-body">Irk, cinsiyet, doğum yeri, yaş (birçok bağlamda), ulusal köken. Sert kısıt: karşı-olgu bunlarda orijinale eşit olmalı.</div></div>
<div class="calc-card"><div class="card-title">Koşullu olarak değişebilir</div><div class="card-body">Adres (değişebilir ama maliyetli), istihdam durumu (değişebilir), eğitim (değişebilir ama yavaş). Sınırlı kısıtlar.</div></div>
<div class="calc-card"><div class="card-title">Serbestçe değişebilir</div><div class="card-body">Talep edilen kredi tutarı, geri ödeme süresi, beyan edilen giderler. Kullanıcının en kolay çevirebileceği modelin "düğmeleri".</div></div>
</div>

<p class="l-text">Ustun'un çerçevesi, her reddedilen başvuran için <em>rota maliyetini</em> hesaplamana ve onlara raporlamana izin verir: "onaylanmak için geliri \$8k artırman VE süreyi 12 ay uzatman gerekir — toplam maliyet skoru 14". Bu, düzenleyicilerin (UK ICO, EU AI Act) yüksek-bahisli reddedilmeler için giderek daha çok beklediği biçimdir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. GDPR / EU AI Act Bağlantısı</h2>
<p class="l-text">GDPR Madde 22 (2018'den itibaren yürürlükte), AB sakinlerine yasal etkiye sahip yalnızca otomatik kararlara tabi olmama hakkı, artı "insan müdahalesi elde etme, görüş bildirme, kararı itiraz etme" hakkı verir. Wachter ve ark. 2017 — ve çoğu hukuk akademisyeni daha sonra hemfikir oldu — <em>itiraz etmenin</em> örtük olarak bir karşı-olgu gerektirdiğini savundu: "krediniz reddedildi"e neyin değiştireceğini bilmeden itiraz edemezsin.</p>

<p class="l-text">EU AI Act (2024'te yürürlüğe girer, 2026'da tam uygulama) daha da ileri gider: yüksek-riskli sistemler "etkilenen kişiye uygun" açıklamalar sağlamalıdır; çoğu yorumcu bunu özellik-önemi tabanlı yerine eyleme dönük olarak yorumlar. ABD FTC ve CFPB benzer beklentiler işaret etti. Karşı-olgular her iki çerçevede de adıyla yasal olarak zorunlu kılınmamıştır, ancak yasaların gerektirmek üzere yazıldığı açıklama formudur.</p>

<div class="calc-highlight"><strong>Operasyonel sonuç:</strong> modelin 2026+ AB sakinleri üzerinde yüksek-bahisli kararlar veriyorsa, açıklama hattın varsayılan olarak karşı-olguları (DiCE veya eşdeğeri) içermeli — ekstra olarak değil, birincil kullanıcıya dönük açıklama olarak. SHAP ve LIME veri bilimi ekibi için tanı araçları haline gelir; karşı-olgular müşteriye dönük artefakt olur.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Karşı-Olgu Adillik Denetimleri</h2>
<p class="l-text">Karşı-olgular, toplulaştırılanların yapamayacağı bir adillik metriğini etkinleştirir: <em>rota maliyeti paritesi</em>. Her reddedilen başvuran için karşı-olgu maliyetini hesapla, korunan özniteliğe göre grupla ve ortalama maliyetin karşılaştırılabilir olup olmadığını kontrol et. A grubunun reddedilen başvurularına \$5k gelir artışı gerekirken B grubuna \$12k gerekiyorsa, sonuç oranları eşleşse bile model adil değildir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Cost-of-recourse audit</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
s = (rng.<span class="fn">random</span>(<span class="fn">len</span>(X)) &lt; <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
preds = clf.<span class="fn">predict</span>(X)
rejected_idx = np.<span class="fn">where</span>(preds == <span class="num">1</span>)[<span class="num">0</span>]                 <span class="cm"># 1=churn, treat as 'rejected'</span>

costs_by_group = {<span class="num">0</span>: [], <span class="num">1</span>: []}
<span class="kw">for</span> idx <span class="kw">in</span> rejected_idx[:<span class="num">30</span>]:
    target = <span class="num">1</span> - preds[idx]
    res = <span class="fn">grid_counterfactual</span>(X[idx], target)
    <span class="kw">if</span> res <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
        costs_by_group[s[idx]].<span class="fn">append</span>(res[<span class="num">0</span>])

<span class="kw">for</span> g, costs <span class="kw">in</span> costs_by_group.<span class="fn">items</span>():
    <span class="kw">if</span> costs:
        <span class="fn">print</span>(f<span class="str">'Group {g}: mean recourse cost = {np.mean(costs):.2f}  (n={len(costs)})'</span>)
<span class="fn">print</span>(<span class="str">'A large gap → unequal recourse → fairness concern even if outcome rates match.'</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>rng.random() &lt; 0.5</code> ile ikili korunan öznitelik <code>s</code> üretir, <code>clf.predict(X)</code> çalıştırır ve churn=1 olan satırları "reddedildi" (rota gerektiren nüfus) olarak ele alır. 2) İlk 30 reddedilen indeks üzerinde döner, her birine en ucuz tek-öznitelik çevirmeyi bulmak için <code>grid_counterfactual</code> çağırır ve dönen maliyeti <code>costs_by_group[s[idx]]</code>'a ekler. 3) Grup başına ortalama rota maliyetini raporlar — grup 0 <code>cost=2.1</code> ortalarken grup 1 <code>cost=5.8</code> ortalıyorsa, model genel sonuç oranları eşleşse bile aynı onay için bir gruptan çok daha fazla çalışma istiyor demektir.</p>

<p class="l-text">Sharma, Henderson &amp; Ghosh (FAccT 2020) <em>CERTIFAI</em>, tüm bir adillik çerçevesini tam olarak bunun etrafında inşa etti — karşı-olgu maliyeti onların "rota yükü" metriğinin temelidir. Bazen en adil model, en yakın sonuç oranlarına sahip olan değil, en yakın rota maliyetlerine sahip olandır.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Tuzaklar ve Üretim Notları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Zaman kayması</div><div class="card-body">Bugün hesaplanan bir karşı-olgu, model yeniden eğitilirse yarın geçersiz olabilir. Barocas, Selbst &amp; Raghavan (FAccT 2020) buna <em>rota sürüklenmesi</em> der; Pazartesi verilen sözler Cuma tutmayabilir.</div></div>
<div class="calc-card"><div class="card-title">Stratejik oyun</div><div class="card-body">Karşı-olguları yayımladığında, başvuranlar onları oynayabilir. "Geliri \$5k artır" seni onaylıyorsa, her sınırdaki başvuran +\$5k iddia eder. Hardt, Megiddo, Papadimitriou &amp; Wootters (ITCS 2016), stratejik sınıflandırmanın bunu öngördüğünü ve kısmen azalttığını gösterdi.</div></div>
<div class="calc-card"><div class="card-title">Nedensellik vs. korelasyon</div><div class="card-body">"FICO skorunu yükselt" diyen bir karşı-olgu, FICO kendisi bir neden değil bir etki ise eyleme dönük değildir. Karimi, Schölkopf &amp; Valera (NeurIPS 2020) <em>nedensel müdahalelerle rota</em>, yapısal bir nedensel model gerektirir.</div></div>
<div class="calc-card"><div class="card-title">Çoklu çevirmeler</div><div class="card-body">Karşı-olgu üreticileri bazen tahmini eşikler arasında ileri-geri çeviren değişiklikler önerir. Karşı-olgunun yeni bir model değerlendirmesinde hâlâ çevirdiğini her zaman doğrula.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sonraki</h2>
<p class="l-text">Karşı-olgular açıklamayı "ne önemliydi"den "neyi değiştirebilirdi"e kaydırır. Matematik kısıtlı bir optimizasyondur (Wachter 2017); pratik yakınlık, geçerlilik, akla yatkınlık, çeşitlilik ve eyleme dönüklük dengesidir. DiCE çeşitliliği işler, FACE akla yatkınlığı işler, rota çerçeveleri (Ustun 2019) eyleme dönüklüğü işler — uygulamana uyan kombinasyonu seç.</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Karşı-olgu = tahmini çeviren en yakın girdi. Wachter 2017 Lagrangian: <code>λ·geçerlilik + d(x, x')</code>.</li>
<li>Üç çözücü: ızgara araması (düşük-D), gradyan inişi (türevlenebilir modeller), grafik tabanlı FACE (yüksek-D, akla yatkınlık öncelikli).</li>
<li>DiCE (Mothilal 2020) determinantal nokta süreci aracılığıyla 3-5 çeşitli karşı-olgu döndürür.</li>
<li>Rota (Ustun 2019) hareketleri eyleme dönük özniteliklere sınırlar ve gerçek-dünya maliyeti ile ağırlıklandırır.</li>
<li>GDPR / EU AI Act beklentileri: karşı-olgular giderek müşteriye dönük açıklamadır; SHAP/LIME dahili kalır.</li>
<li>Rota maliyeti paritesi, sonuç oranı paritesinin yakalayamayacağı bir adillik metriğidir.</li>
</ul>
</div>

<p class="l-text"><strong>fairness-L7</strong>, LLM'lerin kendisinin kara-kutusunu mekanistik yorumlanabilirlikle açar — Olah'ın devreleri, seyrek otoencoderler ve Anthropic'in 2024 Scaling Monosemanticity çalışması. <strong>L8</strong>, tüm parçayı adil, açıklanabilir bir kredi modelinde taçlandırır.</p>
</div>`
};
