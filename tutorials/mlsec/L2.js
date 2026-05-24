window.MLSEC_L2 = {
en: `<p class="l-text"><strong>An adversarial example is an input that looks normal to a human but causes a model to fail confidently.</strong> Goodfellow, Shlens and Szegedy formalized them in 2014 ("Explaining and Harnessing Adversarial Examples") and showed that the fragility is not a bug of any one architecture — it is a structural property of high-dimensional linear classifiers, inherited by every deep net built on top of them. In a famous figure, a panda image with imperceptible noise added (ε = 0.007 in pixel space, ℓ_∞ norm) is classified as "gibbon" with 99.3% confidence by GoogLeNet. Eleven years later, this has not been fully solved — RobustBench's 2026 leaderboard still tops out around 71% robust accuracy on CIFAR-10 at ε = 8/255, far below clean accuracy of 95%+.</p>

<p class="l-text">In this lesson we build the three canonical attacks from scratch. <strong>FGSM</strong> (Goodfellow 2014) is one step along the gradient sign — the cheapest baseline. <strong>PGD</strong> (Madry 2017) iterates FGSM with projection back into the perturbation ball — empirically the strongest first-order attack and the standard for adversarial training. <strong>Carlini-Wagner</strong> (2017) reformulates as a continuous optimization with a confidence margin — slow, but the strongest white-box attack and the gold standard for defense evaluation. We also cover <em>transferability</em> (Papernot 2017 — adversarial examples crafted on one model fool another) and <em>physical-world attacks</em> (Eykholt 2018 stop signs, Sharif 2016 eyeglass frames) which break the assumption that "the attacker can only modify pixels".</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive FGSM from a first-order Taylor expansion of the loss</li>
<li>Implement PGD as iterated FGSM with projection — the strongest practical first-order attack</li>
<li>Understand Carlini-Wagner's confidence margin and binary search over c</li>
<li>Quantify transferability and explain why it threatens black-box defenses</li>
<li>Read robust-accuracy numbers (RobustBench, ε = 8/255, ℓ_∞ vs. ℓ_2) without confusion</li>
<li>Reason about physical-world attacks and EOT (Expectation Over Transformations)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The High-Dimensional Linearity Argument</h2>
<p class="l-text">Goodfellow's 2014 insight: deep nets are <em>too linear</em>, not too non-linear. A linear classifier with weight w on input x outputs w · x. If we perturb x by η with ‖η‖_∞ ≤ ε, the output changes by w · η, which is bounded by ε · ‖w‖_1. In low dimensions ‖w‖_1 is small; in high dimensions (image inputs are 224·224·3 ≈ 150K dimensions) it is huge. A tiny per-pixel change ε produces a large logit change.</p>

<div class="katex-block">$$\\Delta(\\mathbf{w}\\cdot\\mathbf{x}) = \\mathbf{w}\\cdot\\boldsymbol\\eta \\le \\varepsilon \\,\\|\\mathbf{w}\\|_1$$</div>

<p class="l-text">The optimal η that maximizes this is η = ε · sign(w). For a classifier f(x) = w · x + b with cross-entropy loss L, the analogous optimal one-step perturbation against the loss is η = ε · sign(∇_x L). That is FGSM.</p>

<div class="calc-highlight"><strong>The mental model:</strong> in 150K-dim pixel space, every input is surprisingly close to a class boundary. A small ε in ℓ_∞ (max absolute change per pixel) is a huge step in ℓ_2 (Euclidean), and the model's local linear approximation falls apart.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. FGSM — Fast Gradient Sign Method</h2>
<p class="l-text">FGSM is one line of math:</p>

<div class="katex-block">$$\\mathbf{x}_{\\text{adv}} = \\mathbf{x} + \\varepsilon \\cdot \\text{sign}\\bigl(\\nabla_{\\mathbf{x}} L(f(\\mathbf{x}), y)\\bigr)$$</div>

<p class="l-text">Step in the direction that <em>increases</em> the loss for the true label y. The result is an untargeted attack — the model gets it wrong, but you don't choose what wrong class. For targeted FGSM, replace L(f(x), y) with −L(f(x), y_target) and step toward the desired wrong class.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (TORCH — DEMO ONLY)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># FGSM on a torch image classifier — runs on a real GPU/CPU box</span>
<span class="kw">import</span> torch, torch.nn.functional <span class="kw">as</span> F
<span class="kw">def</span> <span class="fn">fgsm</span>(model, x, y, eps):
    x = x.<span class="fn">clone</span>().<span class="fn">detach</span>().<span class="fn">requires_grad_</span>(<span class="kw">True</span>)
    loss = F.<span class="fn">cross_entropy</span>(<span class="fn">model</span>(x), y)
    loss.<span class="fn">backward</span>()
    <span class="kw">return</span> torch.<span class="fn">clamp</span>(x + eps * x.grad.<span class="fn">sign</span>(), <span class="num">0</span>, <span class="num">1</span>).<span class="fn">detach</span>()

<span class="cm"># Standard call:</span>
<span class="cm"># x_adv = fgsm(resnet50, x, y_true, eps=8/255)</span>
<span class="cm"># acc_adv = (resnet50(x_adv).argmax(1) == y_true).float().mean()</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) defines <code>fgsm(model, x, y, eps)</code> and detaches the input with <code>requires_grad_(True)</code> so autograd can record the input-gradient. 2) computes <code>F.cross_entropy(model(x), y)</code> and calls <code>loss.backward()</code> — this populates <code>x.grad</code> with ∂L/∂x. 3) returns one step along the sign of that gradient, <code>x + eps * x.grad.sign()</code>, then clamps to [0, 1] so the adversarial image stays a valid image.</p>

<p class="l-text">On ImageNet ResNet-50 with ε = 8/255, untargeted FGSM drops top-1 accuracy from ~76% to ~5%. That is a single gradient step. Eight years of research have made nets dramatically more robust on toy datasets (CIFAR-10 robust acc ~71% in 2026); on ImageNet at the same ε, robust accuracy is still only ~50%.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">FGSM on a sklearn LogisticRegression — the gradient is closed-form, no autograd needed. Tabular data, but the same algorithm.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
sc = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X); X = sc.<span class="fn">transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(<span class="str">"clean acc:"</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(Xte, yte), <span class="num">3</span>))

<span class="cm"># Gradient of binary cross-entropy w.r.t. x for LogReg:</span>
<span class="cm">#   dL/dx = (sigmoid(w.x+b) - y) * w</span>
<span class="kw">def</span> <span class="fn">fgsm_logreg</span>(clf, X, y, eps):
    p = clf.<span class="fn">predict_proba</span>(X)[:, <span class="num">1</span>]
    grad = (p - y)[:, <span class="kw">None</span>] * clf.coef_  <span class="cm"># shape (n, d)</span>
    <span class="kw">return</span> X + eps * np.<span class="fn">sign</span>(grad)

<span class="kw">for</span> eps <span class="kw">in</span> [<span class="num">0.05</span>, <span class="num">0.1</span>, <span class="num">0.3</span>, <span class="num">0.5</span>, <span class="num">1.0</span>]:
    Xa = <span class="fn">fgsm_logreg</span>(clf, Xte, yte, eps)
    <span class="fn">print</span>(f<span class="str">"eps={eps}: adv acc = {clf.score(Xa, yte):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) loads <code>churn.csv</code>, standardises three numeric features and fits a <code>LogisticRegression</code> — its closed-form gradient ∂L/∂x equals <code>(sigmoid(w·x+b) − y) · w</code>. 2) <code>fgsm_logreg</code> builds the per-row gradient with <code>(p - y)[:, None] * clf.coef_</code> and takes one step <code>X + eps * np.sign(grad)</code>. 3) sweeps <code>eps ∈ [0.05, 0.1, 0.3, 0.5, 1.0]</code> and prints clean vs. adversarial accuracy so you can watch the curve collapse as ε grows.</p>
</div>

<p class="l-text">You will see accuracy degrade smoothly with ε. The same code, with autograd swapped in for the closed-form gradient, becomes the deep-net attack. The math is identical.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. PGD — Projected Gradient Descent (Madry 2017)</h2>
<p class="l-text">FGSM uses one big step. PGD uses many small steps with projection back into the ε-ball after each step:</p>

<div class="katex-block">$$\\mathbf{x}^{t+1} = \\Pi_{B(\\mathbf{x}, \\varepsilon)}\\Bigl(\\mathbf{x}^t + \\alpha \\cdot \\text{sign}\\bigl(\\nabla_{\\mathbf{x}} L(f(\\mathbf{x}^t), y)\\bigr)\\Bigr)$$</div>

<p class="l-text">Where Π is projection onto the ℓ_∞ ball of radius ε around the original x, and α is a step size (typically α = ε/4 for K = 10–40 steps). Madry et al. (2017) proved empirically that PGD is the strongest first-order attack — no other gradient-based attack we know of beats it consistently — and used this fact to define adversarial training (mlsec-L3) as min-max optimization with PGD as the inner max.</p>

<p class="l-text">Three details matter for correctness:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Random initialization</div><div class="card-body">Start at x₀ = x + Uniform(−ε, ε) instead of x. Without random restart, PGD can stall at gradient-masking points; with restart, it finds the true worst case much more reliably.</div></div>
<div class="calc-card"><div class="card-title">Multiple restarts</div><div class="card-body">For evaluation, run PGD with 10–100 random starts and take the worst case. A defense that only beats single-start PGD is suspicious.</div></div>
<div class="calc-card"><div class="card-title">Step count and α</div><div class="card-body">K=20, α=ε/4 is a sane default. AutoAttack (Croce 2020) tunes these adaptively and is the modern standard — single PGD with bad α can dramatically under-estimate vulnerability.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">PGD on the same LogReg — iterate FGSM with projection back into the ε-ball.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(Xtr, ytr)

<span class="kw">def</span> <span class="fn">pgd</span>(clf, X, y, eps, alpha, K=<span class="num">20</span>, restarts=<span class="num">3</span>):
    best = X.<span class="fn">copy</span>(); best_loss = -np.<span class="fn">ones</span>(<span class="fn">len</span>(X)) * <span class="num">1e9</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(restarts):
        <span class="cm"># random init in the eps-ball</span>
        delta = np.random.<span class="fn">uniform</span>(-eps, eps, size=X.shape)
        Xa = X + delta
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K):
            p = clf.<span class="fn">predict_proba</span>(Xa)[:, <span class="num">1</span>]
            grad = (p - y)[:, <span class="kw">None</span>] * clf.coef_
            Xa = Xa + alpha * np.<span class="fn">sign</span>(grad)
            <span class="cm"># project back into eps-ball around X</span>
            Xa = np.<span class="fn">clip</span>(Xa, X - eps, X + eps)
        <span class="cm"># keep the worst-case adversary</span>
        p = clf.<span class="fn">predict_proba</span>(Xa)[:, <span class="num">1</span>]
        loss = -(y*np.<span class="fn">log</span>(p+<span class="num">1e-9</span>) + (<span class="num">1</span>-y)*np.<span class="fn">log</span>(<span class="num">1</span>-p+<span class="num">1e-9</span>))
        better = loss > best_loss
        best[better] = Xa[better]; best_loss[better] = loss[better]
    <span class="kw">return</span> best

<span class="kw">for</span> eps <span class="kw">in</span> [<span class="num">0.1</span>, <span class="num">0.3</span>, <span class="num">0.5</span>]:
    Xa = <span class="fn">pgd</span>(clf, Xte, yte, eps=eps, alpha=eps/<span class="num">4</span>, K=<span class="num">20</span>, restarts=<span class="num">3</span>)
    <span class="fn">print</span>(f<span class="str">"eps={eps}: clean={clf.score(Xte, yte):.3f}, PGD adv={clf.score(Xa, yte):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains a <code>LogisticRegression</code> on standardised <code>churn.csv</code> as the white-box target. 2) <code>pgd(clf, X, y, eps, alpha, K, restarts)</code> runs <code>restarts</code> random initialisations: it draws <code>delta ~ Uniform(-eps, eps)</code>, then iterates <code>K</code> sign-gradient steps and projects back with <code>np.clip(Xa, X - eps, X + eps)</code> so the perturbation never leaves the ℓ_∞ ball. 3) after each restart it scores binary cross-entropy and keeps the example with the largest loss in <code>best</code> — this is the empirical worst case. 4) sweeps ε to show that iterated, projected steps strictly beat one-step FGSM at the same budget.</p>
</div>

<p class="l-text">Compare PGD's adversarial accuracy to FGSM's at the same ε. PGD is uniformly stronger — and the gap is even larger on deep nets where the loss surface is highly non-linear.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Carlini-Wagner — The Strongest White-Box Attack</h2>
<p class="l-text">Carlini and Wagner (2017, "Towards Evaluating the Robustness of Neural Networks") reformulated adversarial example generation as a constrained continuous optimization. The key reformulation: instead of perturbing x and projecting back, parameterize the perturbation in an unconstrained variable w (via change-of-variables x_adv = ½(tanh(w)+1) for [0,1]-bounded inputs) and minimize:</p>

<div class="katex-block">$$\\mathcal{L}(\\mathbf{w}) = \\|\\mathbf{x}_{\\text{adv}}(\\mathbf{w}) - \\mathbf{x}\\|_2^2 + c \\cdot f(\\mathbf{x}_{\\text{adv}}(\\mathbf{w}))$$</div>

<p class="l-text">Where f is a margin-based "this is misclassified with confidence κ" objective, e.g. f(x') = max(Z(x')_y − max_{i≠y} Z(x')_i, −κ) using pre-softmax logits Z. The constant c balances perturbation size against attack success — found by binary search.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why margin instead of cross-entropy</div><div class="card-body">Cross-entropy saturates: once the model is confidently wrong, gradients vanish. Margin-based loss keeps gradient signal until exactly the desired confidence κ is reached, producing minimal-norm adversarial examples.</div></div>
<div class="calc-card"><div class="card-title">Why tanh change of variables</div><div class="card-body">Eliminates the box constraint x ∈ [0,1]^d. The optimizer (Adam) runs unconstrained on w, the box is enforced for free.</div></div>
<div class="calc-card"><div class="card-title">Why binary search on c</div><div class="card-body">Too small c → attack fails (perturbation term dominates). Too large c → wastes perturbation budget. C&amp;W binary searches log_2 c ∈ [-3, 10] to find the smallest c that succeeds, giving genuinely minimal adversarial examples.</div></div>
</div>

<p class="l-text">Empirically C&amp;W finds adversarial examples ~30-50% smaller (in ℓ_2) than PGD on the same network. It is slow — minutes per image on a single GPU — but a defense that does not survive C&amp;W is not a defense.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">C&amp;W on LogReg using scipy.optimize. We minimize ‖δ‖² + c·max(margin, −κ) and binary-search c.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy.optimize <span class="kw">import</span> minimize
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(Xtr, ytr)

<span class="kw">def</span> <span class="fn">cw_one</span>(x, y_true, c, kappa=<span class="num">0.0</span>):
    <span class="cm"># binary classifier: logit z = w.x + b. "Margin" = (1-2y)*z (positive when correctly classified)</span>
    w = clf.coef_[<span class="num">0</span>]; b = clf.intercept_[<span class="num">0</span>]
    <span class="kw">def</span> <span class="fn">loss</span>(delta):
        xa = x + delta
        z = w @ xa + b
        margin = (<span class="num">1</span> - <span class="num">2</span>*y_true) * z         <span class="cm"># positive = correct</span>
        f = <span class="fn">max</span>(margin + kappa, <span class="num">0.0</span>)         <span class="cm"># 0 once we cross the boundary by kappa</span>
        <span class="kw">return</span> np.<span class="fn">sum</span>(delta**<span class="num">2</span>) + c * f
    <span class="cm"># warm start at zero</span>
    res = <span class="fn">minimize</span>(loss, np.<span class="fn">zeros_like</span>(x), method=<span class="str">"L-BFGS-B"</span>)
    <span class="kw">return</span> res.x

<span class="cm"># binary search c per-example</span>
<span class="kw">def</span> <span class="fn">cw_attack</span>(X, y, c_grid=(<span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">1.0</span>, <span class="num">10.0</span>)):
    out = X.<span class="fn">copy</span>()
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(X)):
        <span class="kw">for</span> c <span class="kw">in</span> c_grid:
            d = <span class="fn">cw_one</span>(X[i], y[i], c)
            xa = X[i] + d
            pred = clf.<span class="fn">predict</span>([xa])[<span class="num">0</span>]
            <span class="kw">if</span> pred != y[i]:
                out[i] = xa; <span class="kw">break</span>
    <span class="kw">return</span> out

idx = np.<span class="fn">arange</span>(<span class="num">50</span>)
Xa = <span class="fn">cw_attack</span>(Xte[idx], yte[idx])
acc = clf.<span class="fn">score</span>(Xa, yte[idx])
delta_norm = np.linalg.<span class="fn">norm</span>(Xa - Xte[idx], axis=<span class="num">1</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"C&W adv acc on 50 samples: {acc:.3f}, mean ||delta||_2 = {delta_norm:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>cw_one(x, y_true, c)</code> defines the C&amp;W objective <code>‖δ‖² + c · max((1-2y)·z + κ, 0)</code> — the hinge term goes to zero once the logit margin flips past κ, leaving only the ℓ_2 perturbation term. 2) calls <code>scipy.optimize.minimize(..., method="L-BFGS-B")</code> from a zero warm start, returning the smallest δ that crosses the boundary. 3) <code>cw_attack</code> walks <code>c_grid = (0.01, 0.1, 1.0, 10.0)</code> per example — the per-row equivalent of Carlini-Wagner's binary search on c — and keeps the first successful δ. 4) prints adversarial accuracy and mean <code>‖δ‖₂</code> on 50 test points so you can compare C&amp;W's perturbation budget against PGD's.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Transferability — Black-Box Attack via Substitute Model</h2>
<p class="l-text">Papernot et al. (2017, "Practical Black-Box Attacks against Machine Learning") observed: an adversarial example crafted on model A often fools model B trained on the same task, even when A and B have different architectures. This destroys the naive defense "just hide your weights" — an attacker trains their own substitute (querying the target API to label data) and runs white-box attacks on the substitute.</p>

<div class="calc-highlight"><strong>Why transferability happens:</strong> models trained on the same data learn similar features. Adversarial examples exploit shared decision-boundary structure. Goodfellow's "linear" hypothesis predicts this — perturbations along high-saliency directions of one linear model mostly align with those of another.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ResNet → VGG transfer</div><div class="card-body">PGD examples crafted on ResNet-50 fool VGG-16 ~60% of the time at ε=8/255 on ImageNet. Quite high.</div></div>
<div class="calc-card"><div class="card-title">CNN → Transformer transfer</div><div class="card-body">Lower (~30-40%) — different inductive biases. But ensemble attacks (craft on K models) push it back up.</div></div>
<div class="calc-card"><div class="card-title">Defended → undefended transfer</div><div class="card-body">Adversarial-trained models still partially transfer-attack regular models. Robust features generalize.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Physical-World Attacks</h2>
<p class="l-text">If adversarial examples only existed in pixel space, you could defend by re-encoding inputs (JPEG compression, random crops). Eykholt et al. (2018, "Robust Physical-World Attacks on Deep Learning Visual Classification") killed that hope. Black-and-white stickers placed on a real stop sign were classified as "Speed Limit 45" by a state-of-the-art classifier across 80% of viewing angles, distances, and lighting conditions.</p>

<p class="l-text">The technique is <strong>Expectation Over Transformations (EOT)</strong> — instead of solving min ‖δ‖ s.t. f(x+δ) ≠ y, solve min ‖δ‖ s.t. E_T[f(T(x+δ)) ≠ y] over a distribution of transformations T (rotation, scale, brightness, perspective). The resulting perturbation is robust to the imaging pipeline.</p>

<div class="katex-block">$$\\min_{\\boldsymbol\\delta} \\; \\mathbb{E}_{T \\sim \\mathcal{T}}\\bigl[L\\bigl(f(T(\\mathbf{x}+\\boldsymbol\\delta)), y\\bigr)\\bigr] + \\lambda \\|\\boldsymbol\\delta\\|$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eykholt 2018 — stop signs</div><div class="card-body">Black/white stickers, 4 rectangles. Drive-by experiment: 100% attack success on a parked sign, 84% in a moving vehicle.</div></div>
<div class="calc-card"><div class="card-title">Sharif 2016 — eyeglass frames</div><div class="card-body">Printed eyeglass frames evade face recognition or impersonate a target identity. Worked on production face-recognition APIs.</div></div>
<div class="calc-card"><div class="card-title">Athalye 2017 — 3D-printed turtle</div><div class="card-body">A 3D-printed turtle that ImageNet classifies as "rifle" from every angle. EOT applied to 3D rendering.</div></div>
<div class="calc-card"><div class="card-title">Adversarial T-shirts (Xu 2020)</div><div class="card-body">Wearable adversarial patches that hide a person from YOLOv2/v3 person detectors.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Reading Robustness Numbers — RobustBench &amp; ε-Conventions</h2>
<p class="l-text">Robustness papers report numbers in a small standard format. Decoding them:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CIFAR-10, ℓ_∞, ε=8/255</div><div class="card-body">The canonical benchmark. Clean accuracy ~95%+, robust accuracy as of 2026 ~71% (Wang et al., diffusion-augmented adversarial training). The gap of 25 points has been closing about 1pt/year.</div></div>
<div class="calc-card"><div class="card-title">ImageNet, ℓ_∞, ε=4/255</div><div class="card-body">Harder. Clean ~75%, robust ~50% (Liu 2024). Larger ε=8/255 only used in some papers.</div></div>
<div class="calc-card"><div class="card-title">ℓ_2 vs. ℓ_∞</div><div class="card-body">ℓ_2 ε=0.5 (CIFAR) is roughly comparable to ℓ_∞ ε=8/255. Different attack/defense methods are stronger on different norms — never compare across norms naively.</div></div>
<div class="calc-card"><div class="card-title">Robust accuracy = AutoAttack</div><div class="card-body">A reported robust acc must use AutoAttack (Croce 2020) — a parameter-free ensemble of APGD-CE, APGD-DLR, FAB, Square. Numbers from a single PGD run are meaningless.</div></div>
</div>

<p class="l-text">RobustBench (<code>robustbench.github.io</code>) maintains the leaderboard. Cite it.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7b. FGSM epsilon vs accuracy (visual)</h2>
<p class="l-text">Sweeping ε from 0 to 0.1 (L∞ pixel perturbation, [0,1] scale) on CIFAR-10 ResNet-18 shows how dramatically a tiny perturbation drops accuracy. Adversarial training raises the curve but does not flatten it completely.</p>
<div id="plot-mlsec-l2-fgsm-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var text = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc';
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var grid = 'rgba(255,255,255,0.06)';
  var eps = [0, 0.005, 0.01, 0.015, 0.02, 0.03, 0.04, 0.06, 0.08, 0.10];
  var clean = [94, 92, 88, 80, 70, 52, 38, 18,  9,  4];
  var advTrained = [88, 87, 86, 85, 83, 78, 72, 60, 48, 38];
  var data = [
    { x:eps, y:clean, type:'scatter', mode:'lines+markers', name:'Standard ResNet-18',
      line:{color:'#ff6b6b', width:2.5}, marker:{size:8} },
    { x:eps, y:advTrained, type:'scatter', mode:'lines+markers', name:'PGD-adv trained',
      line:{color:accent, width:2.5}, marker:{size:8} }
  ];
  var layout = { paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:text},
    xaxis:{title:'epsilon (L∞ perturbation, [0,1] scale)', gridcolor:grid},
    yaxis:{title:'accuracy (%)', gridcolor:grid, range:[0,100]},
    margin:{t:50,r:20,b:60,l:60}, title:{text:'FGSM attack: accuracy vs perturbation budget (CIFAR-10)', font:{color:text, size:14}}, height:380,
    legend:{x:0.65,y:0.95,bgcolor:'rgba(0,0,0,0.2)'} };
  Plotly.newPlot('plot-mlsec-l2-fgsm-en', data, layout, {responsive:true, displayModeBar:false});
  var trDiv = document.getElementById('plot-mlsec-l2-fgsm-tr');
  if (trDiv) Plotly.newPlot('plot-mlsec-l2-fgsm-tr', data, layout, {responsive:true, displayModeBar:false});
}, 250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Standard models collapse around ε=0.03 — a perturbation invisible to humans. Adversarial training (Madry-style PGD) sacrifices ~6% clean accuracy in exchange for graceful degradation up to ε=0.08. There is no free lunch in robustness.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>FGSM: x_adv = x + ε · sign(∇_x L). One step. Cheap, noisy. Goodfellow 2014.</li>
<li>PGD: iterate FGSM with projection. With random restarts, the strongest first-order attack. Madry 2017.</li>
<li>C&amp;W: continuous optimization with margin loss + binary search on c. Slowest, smallest-perturbation, gold standard. Carlini-Wagner 2017.</li>
<li>Transferability: adversarial examples cross models. Black-box defenses must be evaluated under substitute attacks. Papernot 2017.</li>
<li>Physical attacks: EOT makes perturbations survive cameras and angles. Eykholt 2018.</li>
<li>Always evaluate with AutoAttack at the standard ε; cite RobustBench.</li>
</ul>
</div>

<p class="l-text">In <strong>mlsec-L3</strong> we move to defenses: Madry's adversarial training (the only thing that works at scale), TRADES (Zhang 2019, the regularization trick), and certified randomized smoothing (Cohen 2019, the only provable defense). We also dissect Athalye 2018 — why the field is littered with broken defenses, and what "obfuscated gradients" actually means.</p>
</div>`,
tr: `<p class="l-text"><strong>Düşmanca örnek, bir insana normal görünen ama bir modelin güvenle hata yapmasına neden olan bir girdidir.</strong> Goodfellow, Shlens ve Szegedy bunları 2014'te formalize etti ("Explaining and Harnessing Adversarial Examples") ve kırılganlığın herhangi bir mimarinin bug'ı olmadığını gösterdi — yüksek-boyutlu lineer sınıflandırıcıların yapısal bir özelliğidir, üstüne kurulan her derin ağ tarafından miras alınır. Ünlü bir figürde, algılanamaz gürültü eklenmiş bir panda görüntüsü (piksel uzayında ε = 0.007, ℓ_∞ normu) GoogLeNet tarafından %99.3 güvenle "gibon" olarak sınıflandırılır. On bir yıl sonra bu tam olarak çözülmedi — RobustBench'in 2026 lider tablosu hâlâ CIFAR-10'da ε = 8/255'te yaklaşık %71 dayanıklı doğrulukta tepe yapıyor, %95+ temiz doğruluğun çok altında.</p>

<p class="l-text">Bu derste klasik üç saldırıyı sıfırdan kuracağız. <strong>FGSM</strong> (Goodfellow 2014) gradyan işareti boyunca tek adım — en ucuz temel. <strong>PGD</strong> (Madry 2017) FGSM'i pertürbasyon topuna geri yansıtarak yineler — ampirik olarak en güçlü birinci-derece saldırı ve düşmanca eğitimin standardı. <strong>Carlini-Wagner</strong> (2017) güven marjlı sürekli optimizasyon olarak yeniden formüle eder — yavaş ama en güçlü beyaz kutu saldırı ve savunma değerlendirmesinin altın standardı. Ayrıca <em>transfer edilebilirlik</em>'i (Papernot 2017 — bir modelde üretilen düşmanca örnekler diğerini kandırır) ve <em>fiziksel dünya saldırıları</em>nı (Eykholt 2018 dur işaretleri, Sharif 2016 gözlük çerçeveleri) ele alıyoruz; bunlar "saldırgan yalnızca pikselleri değiştirebilir" varsayımını yıkar.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>FGSM'i kayıp fonksiyonunun birinci-derece Taylor açılımından türetmek</li>
<li>PGD'yi projeksiyonlu yinelemeli FGSM olarak uygulamak — en güçlü pratik birinci-derece saldırı</li>
<li>Carlini-Wagner'in güven marjını ve c üzerinde ikili aramayı anlamak</li>
<li>Transfer edilebilirliği sayısallaştırmak ve kara kutu savunmaları neden tehdit ettiğini açıklamak</li>
<li>Dayanıklı doğruluk sayılarını (RobustBench, ε = 8/255, ℓ_∞ vs. ℓ_2) karışıklık olmadan okumak</li>
<li>Fiziksel dünya saldırıları ve EOT (Expectation Over Transformations) hakkında akıl yürütmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Yüksek-Boyutlu Lineerlik Argümanı</h2>
<p class="l-text">Goodfellow'un 2014 içgörüsü: derin ağlar <em>fazla doğrusal</em>, fazla doğrusal-değil değil. x girdisi üzerinde w ağırlığı olan lineer bir sınıflandırıcı w · x verir. x'i ‖η‖_∞ ≤ ε ile η kadar bozarsak, çıktı w · η kadar değişir, bu da ε · ‖w‖_1 ile sınırlıdır. Düşük boyutlarda ‖w‖_1 küçüktür; yüksek boyutlarda (görüntü girdileri 224·224·3 ≈ 150K boyut) çok büyüktür. Pikselbaşı küçük bir ε değişimi büyük bir logit değişimi üretir.</p>

<div class="katex-block">$$\\Delta(\\mathbf{w}\\cdot\\mathbf{x}) = \\mathbf{w}\\cdot\\boldsymbol\\eta \\le \\varepsilon \\,\\|\\mathbf{w}\\|_1$$</div>

<p class="l-text">Bunu maksimize eden optimal η, η = ε · sign(w)'dir. f(x) = w · x + b sınıflandırıcısı için L cross-entropy kayıbıyla, kayba karşı analog optimal tek-adım pertürbasyonu η = ε · sign(∇_x L)'dir. Bu FGSM'dir.</p>

<div class="calc-highlight"><strong>Zihinsel model:</strong> 150K boyutlu piksel uzayında her girdi şaşırtıcı derecede sınıf sınırına yakındır. ℓ_∞'da küçük bir ε (piksel başına maksimum mutlak değişim) ℓ_2'de (Öklid) büyük bir adımdır ve modelin yerel lineer yaklaşımı çöker.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. FGSM — Hızlı Gradyan İşaret Yöntemi</h2>
<p class="l-text">FGSM tek satırlık matematiktir:</p>

<div class="katex-block">$$\\mathbf{x}_{\\text{adv}} = \\mathbf{x} + \\varepsilon \\cdot \\text{sign}\\bigl(\\nabla_{\\mathbf{x}} L(f(\\mathbf{x}), y)\\bigr)$$</div>

<p class="l-text">Gerçek y etiketi için kayıbı <em>artıran</em> yönde adım at. Sonuç hedeflenmemiş bir saldırıdır — model yanlış yapar ama hangi yanlış sınıfı seçemezsin. Hedeflenmiş FGSM için L(f(x), y)'yi −L(f(x), y_target) ile değiştir ve istenen yanlış sınıfa doğru adım at.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (TORCH — DEMO ONLY)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Bir torch görüntü sınıflandırıcısında FGSM — gerçek bir GPU/CPU kutusunda çalışır</span>
<span class="kw">import</span> torch, torch.nn.functional <span class="kw">as</span> F
<span class="kw">def</span> <span class="fn">fgsm</span>(model, x, y, eps):
    x = x.<span class="fn">clone</span>().<span class="fn">detach</span>().<span class="fn">requires_grad_</span>(<span class="kw">True</span>)
    loss = F.<span class="fn">cross_entropy</span>(<span class="fn">model</span>(x), y)
    loss.<span class="fn">backward</span>()
    <span class="kw">return</span> torch.<span class="fn">clamp</span>(x + eps * x.grad.<span class="fn">sign</span>(), <span class="num">0</span>, <span class="num">1</span>).<span class="fn">detach</span>()

<span class="cm"># Standart çağrı:</span>
<span class="cm"># x_adv = fgsm(resnet50, x, y_true, eps=8/255)</span>
<span class="cm"># acc_adv = (resnet50(x_adv).argmax(1) == y_true).float().mean()</span>
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>fgsm(model, x, y, eps)</code> fonksiyonu girdiyi <code>requires_grad_(True)</code> ile koparıp autograd'ın ∂L/∂x'i kaydetmesine olanak tanır. 2) <code>F.cross_entropy(model(x), y)</code> kayıbını hesaplar ve <code>loss.backward()</code> çağrısı <code>x.grad</code>'ı kayıp gradyanıyla doldurur. 3) <code>x + eps * x.grad.sign()</code> ile o gradyanın işareti yönünde tek adım atıp sonucu <code>[0, 1]</code> aralığına <code>clamp</code> eder; böylece üretilen düşmanca görüntü hâlâ geçerli bir görüntü olarak kalır.</p>

<p class="l-text">ImageNet ResNet-50'de ε = 8/255 ile, hedeflenmemiş FGSM top-1 doğruluğunu ~%76'dan ~%5'e düşürür. Bu tek bir gradyan adımıdır. Sekiz yıllık araştırma oyuncak veri setlerinde ağları dramatik olarak daha dayanıklı yaptı (CIFAR-10 dayanıklı doğruluk 2026'da ~%71); ImageNet'te aynı ε'da dayanıklı doğruluk hâlâ yalnızca ~%50.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">sklearn LogisticRegression üzerinde FGSM — gradyan kapalı formdadır, autograd gerekmez. Tablosal veri ama aynı algoritma.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
sc = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X); X = sc.<span class="fn">transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(<span class="str">"clean acc:"</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(Xte, yte), <span class="num">3</span>))

<span class="cm"># LogReg için x'e göre binary cross-entropy gradyanı:</span>
<span class="cm">#   dL/dx = (sigmoid(w.x+b) - y) * w</span>
<span class="kw">def</span> <span class="fn">fgsm_logreg</span>(clf, X, y, eps):
    p = clf.<span class="fn">predict_proba</span>(X)[:, <span class="num">1</span>]
    grad = (p - y)[:, <span class="kw">None</span>] * clf.coef_  <span class="cm"># şekil (n, d)</span>
    <span class="kw">return</span> X + eps * np.<span class="fn">sign</span>(grad)

<span class="kw">for</span> eps <span class="kw">in</span> [<span class="num">0.05</span>, <span class="num">0.1</span>, <span class="num">0.3</span>, <span class="num">0.5</span>, <span class="num">1.0</span>]:
    Xa = <span class="fn">fgsm_logreg</span>(clf, Xte, yte, eps)
    <span class="fn">print</span>(f<span class="str">"eps={eps}: adv acc = {clf.score(Xa, yte):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>churn.csv</code>'yi yükler, üç sayısal özelliği standartlaştırır ve bir <code>LogisticRegression</code> eğitir — bu modelin x'e göre kapalı form gradyanı <code>(sigmoid(w·x+b) − y) · w</code>'dir. 2) <code>fgsm_logreg</code> satır-başına gradyanı <code>(p - y)[:, None] * clf.coef_</code> ile kurar ve tek adım <code>X + eps * np.sign(grad)</code> atar. 3) <code>eps ∈ [0.05, 0.1, 0.3, 0.5, 1.0]</code> üzerinde döner ve temiz ile saldırı altı doğruluğu yazdırır; böylece ε büyüdükçe eğrinin nasıl çöktüğünü gözlemleyebilirsin.</p>
</div>

<p class="l-text">ε ile birlikte doğruluğun düzgün şekilde düştüğünü göreceksin. Aynı kod, kapalı form gradyan yerine autograd ile takıldığında derin-ağ saldırısı olur. Matematik aynıdır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. PGD — Yansıtmalı Gradyan İnişi (Madry 2017)</h2>
<p class="l-text">FGSM tek büyük adım kullanır. PGD, her adımdan sonra ε-topuna geri yansıtarak birçok küçük adım kullanır:</p>

<div class="katex-block">$$\\mathbf{x}^{t+1} = \\Pi_{B(\\mathbf{x}, \\varepsilon)}\\Bigl(\\mathbf{x}^t + \\alpha \\cdot \\text{sign}\\bigl(\\nabla_{\\mathbf{x}} L(f(\\mathbf{x}^t), y)\\bigr)\\Bigr)$$</div>

<p class="l-text">Burada Π, orijinal x etrafında ε yarıçaplı ℓ_∞ topuna projeksiyondur ve α adım büyüklüğüdür (tipik olarak K = 10–40 adım için α = ε/4). Madry vd. (2017) ampirik olarak PGD'nin en güçlü birinci-derece saldırı olduğunu kanıtladı — bildiğimiz başka hiçbir gradyan-tabanlı saldırı tutarlı olarak onu yenmez — ve bu gerçeği düşmanca eğitimi (mlsec-L3) iç max olarak PGD ile min-max optimizasyonu olarak tanımlamak için kullandı.</p>

<p class="l-text">Doğruluk için üç detay önemlidir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rastgele başlatma</div><div class="card-body">x₀ = x yerine x₀ = x + Uniform(−ε, ε)'da başla. Rastgele yeniden başlatma olmadan PGD gradyan-maskeleme noktalarında takılabilir; yeniden başlatmayla, gerçek en kötü durumu çok daha güvenilir bulur.</div></div>
<div class="calc-card"><div class="card-title">Çoklu yeniden başlatmalar</div><div class="card-body">Değerlendirme için, 10–100 rastgele başlangıçla PGD çalıştır ve en kötü durumu al. Yalnızca tek-başlangıç PGD'yi yenen bir savunma şüphelidir.</div></div>
<div class="calc-card"><div class="card-title">Adım sayısı ve α</div><div class="card-body">K=20, α=ε/4 makul varsayılan. AutoAttack (Croce 2020) bunları uyarlamalı olarak ayarlar ve modern standarttır — kötü α ile tek PGD kırılganlığı dramatik olarak az tahmin edebilir.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı LogReg üzerinde PGD — FGSM'i ε-topuna geri projeksiyonla yinele.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(Xtr, ytr)

<span class="kw">def</span> <span class="fn">pgd</span>(clf, X, y, eps, alpha, K=<span class="num">20</span>, restarts=<span class="num">3</span>):
    best = X.<span class="fn">copy</span>(); best_loss = -np.<span class="fn">ones</span>(<span class="fn">len</span>(X)) * <span class="num">1e9</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(restarts):
        <span class="cm"># eps-topunda rastgele başlatma</span>
        delta = np.random.<span class="fn">uniform</span>(-eps, eps, size=X.shape)
        Xa = X + delta
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K):
            p = clf.<span class="fn">predict_proba</span>(Xa)[:, <span class="num">1</span>]
            grad = (p - y)[:, <span class="kw">None</span>] * clf.coef_
            Xa = Xa + alpha * np.<span class="fn">sign</span>(grad)
            <span class="cm"># X etrafındaki eps-topuna geri yansıt</span>
            Xa = np.<span class="fn">clip</span>(Xa, X - eps, X + eps)
        <span class="cm"># en kötü durum saldırısını sakla</span>
        p = clf.<span class="fn">predict_proba</span>(Xa)[:, <span class="num">1</span>]
        loss = -(y*np.<span class="fn">log</span>(p+<span class="num">1e-9</span>) + (<span class="num">1</span>-y)*np.<span class="fn">log</span>(<span class="num">1</span>-p+<span class="num">1e-9</span>))
        better = loss > best_loss
        best[better] = Xa[better]; best_loss[better] = loss[better]
    <span class="kw">return</span> best

<span class="kw">for</span> eps <span class="kw">in</span> [<span class="num">0.1</span>, <span class="num">0.3</span>, <span class="num">0.5</span>]:
    Xa = <span class="fn">pgd</span>(clf, Xte, yte, eps=eps, alpha=eps/<span class="num">4</span>, K=<span class="num">20</span>, restarts=<span class="num">3</span>)
    <span class="fn">print</span>(f<span class="str">"eps={eps}: clean={clf.score(Xte, yte):.3f}, PGD adv={clf.score(Xa, yte):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) standartlaştırılmış <code>churn.csv</code> üzerinde beyaz kutu hedef olarak bir <code>LogisticRegression</code> eğitir. 2) <code>pgd(clf, X, y, eps, alpha, K, restarts)</code> her restart için <code>delta ~ Uniform(-eps, eps)</code> rastgele başlatma çeker, ardından <code>K</code> kez işaret gradyanı adımı atar ve <code>np.clip(Xa, X - eps, X + eps)</code> ile her seferinde ℓ_∞ topuna geri yansıtır; pertürbasyon hiçbir zaman bütçeyi aşmaz. 3) her restart sonunda ikili cross-entropy hesaplanır ve <code>best</code> içinde örnek başına en yüksek kayba sahip varyant tutulur — bu ampirik en kötü durumdur. 4) ε taraması yaparak yinelemeli, projeksiyonlu adımların aynı bütçede tek-adım FGSM'i kesin olarak yendiğini gösterir.</p>
</div>

<p class="l-text">PGD'nin düşmanca doğruluğunu aynı ε'da FGSM'inkiyle karşılaştır. PGD tek tip olarak daha güçlüdür — ve fark, kayıp yüzeyinin yüksek derecede doğrusal olmadığı derin ağlarda daha da büyüktür.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Carlini-Wagner — En Güçlü Beyaz Kutu Saldırı</h2>
<p class="l-text">Carlini ve Wagner (2017, "Towards Evaluating the Robustness of Neural Networks") düşmanca örnek üretimini kısıtlı sürekli optimizasyon olarak yeniden formüle etti. Anahtar yeniden formülasyon: x'i bozup geri yansıtmak yerine, pertürbasyonu kısıtsız bir w değişkeninde parametrize et ([0,1] sınırlı girdiler için x_adv = ½(tanh(w)+1) değişken değişimi yoluyla) ve şunu minimize et:</p>

<div class="katex-block">$$\\mathcal{L}(\\mathbf{w}) = \\|\\mathbf{x}_{\\text{adv}}(\\mathbf{w}) - \\mathbf{x}\\|_2^2 + c \\cdot f(\\mathbf{x}_{\\text{adv}}(\\mathbf{w}))$$</div>

<p class="l-text">Burada f, marj-tabanlı bir "bu κ güveniyle yanlış sınıflandırıldı" amaç fonksiyonudur, örn. softmax-öncesi logitler Z kullanılarak f(x') = max(Z(x')_y − max_{i≠y} Z(x')_i, −κ). c sabiti, pertürbasyon büyüklüğünü saldırı başarısına karşı dengeler — ikili aramayla bulunur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cross-entropy yerine neden marj</div><div class="card-body">Cross-entropy doyar: model güvenle yanlış olduğunda gradyanlar kaybolur. Marj-tabanlı kayıp, tam istenen κ güvenine ulaşılana kadar gradyan sinyalini korur ve minimal-norm düşmanca örnekler üretir.</div></div>
<div class="calc-card"><div class="card-title">Neden tanh değişken değişimi</div><div class="card-body">x ∈ [0,1]^d kutu kısıtını ortadan kaldırır. Optimize edici (Adam) w üzerinde kısıtsız çalışır, kutu bedavaya uygulanır.</div></div>
<div class="calc-card"><div class="card-title">Neden c üzerinde ikili arama</div><div class="card-body">Çok küçük c → saldırı başarısız (pertürbasyon terimi baskın). Çok büyük c → pertürbasyon bütçesi israf edilir. C&amp;W, başarılı en küçük c'yi bulmak için log_2 c ∈ [-3, 10] aralığında ikili arar ve gerçekten minimal düşmanca örnekler verir.</div></div>
</div>

<p class="l-text">Ampirik olarak C&amp;W aynı ağda PGD'den ~%30-50 daha küçük (ℓ_2'de) düşmanca örnekler bulur. Yavaştır — tek GPU'da görüntü başına dakikalar — ama C&amp;W'den sağ çıkmayan bir savunma savunma değildir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">scipy.optimize kullanarak LogReg üzerinde C&amp;W. ‖δ‖² + c·max(margin, −κ) minimize edip c'yi ikili-ararız.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy.optimize <span class="kw">import</span> minimize
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(Xtr, ytr)

<span class="kw">def</span> <span class="fn">cw_one</span>(x, y_true, c, kappa=<span class="num">0.0</span>):
    <span class="cm"># ikili sınıflandırıcı: logit z = w.x + b. "Marj" = (1-2y)*z (doğru sınıflandırıldığında pozitif)</span>
    w = clf.coef_[<span class="num">0</span>]; b = clf.intercept_[<span class="num">0</span>]
    <span class="kw">def</span> <span class="fn">loss</span>(delta):
        xa = x + delta
        z = w @ xa + b
        margin = (<span class="num">1</span> - <span class="num">2</span>*y_true) * z         <span class="cm"># pozitif = doğru</span>
        f = <span class="fn">max</span>(margin + kappa, <span class="num">0.0</span>)         <span class="cm"># sınırı kappa kadar geçince 0</span>
        <span class="kw">return</span> np.<span class="fn">sum</span>(delta**<span class="num">2</span>) + c * f
    <span class="cm"># sıfırda sıcak başlatma</span>
    res = <span class="fn">minimize</span>(loss, np.<span class="fn">zeros_like</span>(x), method=<span class="str">"L-BFGS-B"</span>)
    <span class="kw">return</span> res.x

<span class="cm"># örnek başına ikili arama c</span>
<span class="kw">def</span> <span class="fn">cw_attack</span>(X, y, c_grid=(<span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">1.0</span>, <span class="num">10.0</span>)):
    out = X.<span class="fn">copy</span>()
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(X)):
        <span class="kw">for</span> c <span class="kw">in</span> c_grid:
            d = <span class="fn">cw_one</span>(X[i], y[i], c)
            xa = X[i] + d
            pred = clf.<span class="fn">predict</span>([xa])[<span class="num">0</span>]
            <span class="kw">if</span> pred != y[i]:
                out[i] = xa; <span class="kw">break</span>
    <span class="kw">return</span> out

idx = np.<span class="fn">arange</span>(<span class="num">50</span>)
Xa = <span class="fn">cw_attack</span>(Xte[idx], yte[idx])
acc = clf.<span class="fn">score</span>(Xa, yte[idx])
delta_norm = np.linalg.<span class="fn">norm</span>(Xa - Xte[idx], axis=<span class="num">1</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"C&W adv acc on 50 samples: {acc:.3f}, mean ||delta||_2 = {delta_norm:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>cw_one(x, y_true, c)</code> C&amp;W amaç fonksiyonunu <code>‖δ‖² + c · max((1-2y)·z + κ, 0)</code> olarak tanımlar — menteşe terimi, logit marjı κ'yı geçtiği anda sıfıra düşer ve geriye yalnızca ℓ_2 pertürbasyon terimi kalır. 2) <code>scipy.optimize.minimize(..., method="L-BFGS-B")</code> sıfırdan sıcak başlatmayla çağrılır ve sınırı geçen en küçük δ'yı döndürür. 3) <code>cw_attack</code> örnek başına <code>c_grid = (0.01, 0.1, 1.0, 10.0)</code> üzerinde yürür — bu Carlini-Wagner'in c üzerindeki ikili aramasının satır-bazlı karşılığıdır — ve ilk başarılı δ'yı saklar. 4) 50 test noktası üzerinde düşmanca doğruluk ve ortalama <code>‖δ‖₂</code> yazdırır; böylece C&amp;W'in pertürbasyon bütçesini PGD'ninkiyle karşılaştırabilirsin.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Transfer Edilebilirlik — Vekil Modelle Kara Kutu Saldırı</h2>
<p class="l-text">Papernot vd. (2017, "Practical Black-Box Attacks against Machine Learning") gözlemledi: model A üzerinde üretilen düşmanca örnek, A ve B farklı mimarilere sahip olsa bile aynı görevde eğitilmiş model B'yi sıkça kandırır. Bu naif "ağırlıklarını sakla" savunmasını yıkar — bir saldırgan kendi vekilini eğitir (veriyi etiketlemek için hedef API'yi sorgulayarak) ve vekilde beyaz kutu saldırılar çalıştırır.</p>

<div class="calc-highlight"><strong>Transfer edilebilirlik neden olur:</strong> aynı veride eğitilmiş modeller benzer özellikleri öğrenir. Düşmanca örnekler paylaşılan karar-sınırı yapısını sömürür. Goodfellow'un "lineer" hipotezi bunu öngörür — bir lineer modelin yüksek-belirginlikli yönlerindeki pertürbasyonlar büyük ölçüde diğerininkilerle hizalanır.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ResNet → VGG transferi</div><div class="card-body">ResNet-50 üzerinde üretilen PGD örnekleri ImageNet'te ε=8/255'te VGG-16'yı zamanın ~%60'ı kandırır. Oldukça yüksek.</div></div>
<div class="calc-card"><div class="card-title">CNN → Transformer transferi</div><div class="card-body">Daha düşük (~%30-40) — farklı tümevarımsal önyargılar. Ama topluluk saldırıları (K modelde üret) tekrar yukarı iter.</div></div>
<div class="calc-card"><div class="card-title">Savunmalı → savunmasız transfer</div><div class="card-body">Düşmanca-eğitilmiş modeller hâlâ kısmi olarak sıradan modellere transfer-saldırı yapar. Dayanıklı özellikler genelleşir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Fiziksel Dünya Saldırıları</h2>
<p class="l-text">Düşmanca örnekler yalnızca piksel uzayında var olsaydı, girdiyi yeniden kodlayarak savunabilirdin (JPEG sıkıştırma, rastgele kırpma). Eykholt vd. (2018, "Robust Physical-World Attacks on Deep Learning Visual Classification") bu umudu öldürdü. Gerçek bir dur işaretine yerleştirilen siyah-beyaz çıkartmalar, görüntüleme açıları, mesafeler ve aydınlatma koşullarının %80'inde son teknoloji bir sınıflandırıcı tarafından "Hız Limiti 45" olarak sınıflandırıldı.</p>

<p class="l-text">Teknik <strong>Expectation Over Transformations (EOT)</strong>'tür — min ‖δ‖ s.t. f(x+δ) ≠ y çözmek yerine, T (rotasyon, ölçek, parlaklık, perspektif) dönüşümler dağılımı üzerinde min ‖δ‖ s.t. E_T[f(T(x+δ)) ≠ y] çözer. Sonuçtaki pertürbasyon görüntüleme hattına dayanıklıdır.</p>

<div class="katex-block">$$\\min_{\\boldsymbol\\delta} \\; \\mathbb{E}_{T \\sim \\mathcal{T}}\\bigl[L\\bigl(f(T(\\mathbf{x}+\\boldsymbol\\delta)), y\\bigr)\\bigr] + \\lambda \\|\\boldsymbol\\delta\\|$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eykholt 2018 — dur işaretleri</div><div class="card-body">Siyah/beyaz çıkartmalar, 4 dikdörtgen. Sürüş deneyi: park edilmiş işarette %100 saldırı başarısı, hareket eden bir araçta %84.</div></div>
<div class="calc-card"><div class="card-title">Sharif 2016 — gözlük çerçeveleri</div><div class="card-body">Basılı gözlük çerçeveleri yüz tanımayı atlatır veya hedef kimliği taklit eder. Üretim yüz-tanıma API'lerinde çalıştı.</div></div>
<div class="calc-card"><div class="card-title">Athalye 2017 — 3D-baskı kaplumbağa</div><div class="card-body">ImageNet'in her açıdan "tüfek" olarak sınıflandırdığı 3D-baskı bir kaplumbağa. EOT 3D işlemeye uygulandı.</div></div>
<div class="calc-card"><div class="card-title">Düşmanca tişörtler (Xu 2020)</div><div class="card-body">Bir kişiyi YOLOv2/v3 kişi dedektörlerinden gizleyen giyilebilir düşmanca yamalar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Dayanıklılık Sayılarını Okuma — RobustBench ve ε-Konvansiyonları</h2>
<p class="l-text">Dayanıklılık makaleleri sayıları küçük bir standart formatta raporlar. Bunları çözmek:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CIFAR-10, ℓ_∞, ε=8/255</div><div class="card-body">Klasik benchmark. Temiz doğruluk ~%95+, 2026 itibarıyla dayanıklı doğruluk ~%71 (Wang vd., difüzyon-artırılmış düşmanca eğitim). 25 puanlık fark yılda yaklaşık 1 puan kapanıyor.</div></div>
<div class="calc-card"><div class="card-title">ImageNet, ℓ_∞, ε=4/255</div><div class="card-body">Daha zor. Temiz ~%75, dayanıklı ~%50 (Liu 2024). Daha büyük ε=8/255 yalnızca bazı makalelerde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">ℓ_2 vs. ℓ_∞</div><div class="card-body">ℓ_2 ε=0.5 (CIFAR) kabaca ℓ_∞ ε=8/255'e karşılık gelir. Farklı saldırı/savunma yöntemleri farklı normlarda daha güçlüdür — normlar arası asla naif karşılaştırma yapma.</div></div>
<div class="calc-card"><div class="card-title">Dayanıklı doğruluk = AutoAttack</div><div class="card-body">Raporlanan dayanıklı doğruluk AutoAttack (Croce 2020) kullanmalıdır — APGD-CE, APGD-DLR, FAB, Square'in parametre-ücretsiz topluluğu. Tek bir PGD çalıştırmasından gelen sayılar anlamsızdır.</div></div>
</div>

<p class="l-text">RobustBench (<code>robustbench.github.io</code>) lider tablosunu tutar. Onu kaynak göster.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7b. FGSM epsilon vs doğruluk (görsel)</h2>
<p class="l-text">ε'i 0'dan 0.1'e (L∞ piksel pertürbasyonu, [0,1] ölçek) tarayarak CIFAR-10 ResNet-18 üstünde ne kadar küçük bir pertürbasyonun doğruluğu çarpıcı biçimde düşürdüğünü görüyoruz. Adversarial eğitim eğriyi yukarı kaldırır ama tamamen düzleştirmez.</p>
<div id="plot-mlsec-l2-fgsm-tr" class="plotly-graph" style="width:100%;height:380px;"></div>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Standart modeller ε=0.03 civarında çöker — insan gözüne görünmez bir pertürbasyon. Adversarial eğitim (Madry-stili PGD) ε=0.08'e kadar zarif bozulma karşılığında ~6% temiz doğruluk feda eder. Dayanıklılıkta bedava öğle yemeği yoktur.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sırada Ne Var</h2>

<div class="calc-highlight"><strong>Kilit çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>FGSM: x_adv = x + ε · sign(∇_x L). Tek adım. Ucuz, gürültülü. Goodfellow 2014.</li>
<li>PGD: FGSM'i projeksiyonla yinele. Rastgele yeniden başlatmalarla, en güçlü birinci-derece saldırı. Madry 2017.</li>
<li>C&amp;W: marj kayıpla sürekli optimizasyon + c üzerinde ikili arama. En yavaş, en küçük-pertürbasyon, altın standart. Carlini-Wagner 2017.</li>
<li>Transfer edilebilirlik: düşmanca örnekler modeller arasında geçer. Kara kutu savunmaları vekil saldırılar altında değerlendirilmelidir. Papernot 2017.</li>
<li>Fiziksel saldırılar: EOT pertürbasyonların kameralar ve açılar arasında hayatta kalmasını sağlar. Eykholt 2018.</li>
<li>Her zaman standart ε'da AutoAttack ile değerlendir; RobustBench'i kaynak göster.</li>
</ul>
</div>

<p class="l-text"><strong>mlsec-L3</strong>'te savunmalara geçeriz: Madry'nin düşmanca eğitimi (ölçekte çalışan tek şey), TRADES (Zhang 2019, regularizasyon hilesi) ve sertifikalı rastgele yumuşatma (Cohen 2019, kanıtlanabilir tek savunma). Ayrıca Athalye 2018'i ayırırız — alanın neden bozuk savunmalarla dolu olduğu ve "obfuscated gradients"in gerçekte ne anlama geldiği.</p>
</div>`
};
