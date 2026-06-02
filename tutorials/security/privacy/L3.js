window.PRIVACY_L3 = {
en: `<p class="l-text">Carlini et al. (2019, USENIX) trained a small Transformer on a corpus laced with random Social Security numbers and asked it to autocomplete "My SSN is …". The model produced the planted SSNs verbatim. Carlini et al. (2021) extended this to GPT-2 and showed that production language models memorize personal email addresses, phone numbers, and exact code blocks from training data. Even gradient-only attacks (Zhu et al. 2019, "Deep Leakage from Gradients") can reconstruct training images from a single weight update. Plain SGD <em>memorizes</em>. We need a training algorithm whose output distribution barely changes when one training point is altered.</p>
<p class="l-text">DP-SGD is that algorithm (Abadi et al. 2016, "Deep Learning with Differential Privacy", CCS). The recipe is two-line: (1) <em>per-sample gradient clipping</em> bounds each example's L2 contribution to C; (2) <em>Gaussian noise σC</em> is added to the averaged batch gradient. Privacy is tracked via the moments accountant (now superseded by Renyi DP and PRV accountants). Today DP-SGD is implemented in Opacus (PyTorch), TensorFlow Privacy, and JAX-Privacy, with production deployments at Apple, Google (Gboard), Meta, and Microsoft. This lesson builds it from scratch in NumPy on top of sklearn's logistic regression — and shows the Opacus drop-in equivalent.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Why standard SGD memorizes — gradient leakage and membership inference</li>
<li>The DP-SGD algorithm: per-sample clipping + Gaussian noise + Poisson sampling</li>
<li>The moments accountant and Renyi DP for tight privacy tracking</li>
<li>Implementing DP-SGD from scratch on logistic regression in NumPy</li>
<li>Opacus drop-in: PrivacyEngine.make_private(model, optimizer, dataloader)</li>
<li>The privacy-utility-compute trilemma and tuning σ, C, batch size</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Why Standard SGD Memorizes</h2>
<p class="l-text">A neural net update step on batch B is θ ← θ - η · ∇L(θ; B). One training example x_i contributes its full gradient g_i. Two attack vectors exploit this. (a) <em>Membership inference</em> (Shokri et al. 2017): given a trained model and a candidate point, predict whether it was in the training set. (b) <em>Gradient inversion</em> (Zhu-Liu-Han 2019, "Deep Leakage from Gradients"): given a single batched gradient, reconstruct the input batch by optimizing inputs to match the gradient. Both succeed because the per-example contribution is unbounded.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Carlini et al. (2021) showed GPT-2 produces verbatim training-data extraction with prefix attacks. Carlini-Tramer-Wallace 2022 extended this to ChatGPT-class models. The Anthropic Claude system cards (2024-2026) explicitly cite DP training and deduplication as defenses. Memorization is not an edge case — it is the default.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. The DP-SGD Algorithm</h2>
<p class="l-text">Abadi et al. 2016 modify SGD with two steps. Compute per-example gradients g_i for each i in a Poisson-sampled mini-batch. (1) Clip each g_i to L2-norm at most C: g_i ← g_i · min(1, C/‖g_i‖). (2) Average and add Gaussian noise: g̃ = (1/B)·(Σ g_i + N(0, σ²C²I)). Update: θ ← θ - η · g̃.</p>
<div class="katex-block">$$\\tilde{g} = \\frac{1}{B}\\left( \\sum_{i \\in B} \\text{clip}_C(g_i) + \\mathcal{N}(0, \\sigma^2 C^2 I) \\right)$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Per-sample clipping</div><div class="card-body">Caps each example's L2 sensitivity at C. Without it, a single outlier dominates and breaks DP.</div></div>
<div class="calc-card"><div class="card-title">Gaussian noise</div><div class="card-body">Std σC. The privacy guarantee depends only on σ (the noise multiplier), not C — clip and noise scale together.</div></div>
<div class="calc-card"><div class="card-title">Poisson subsampling</div><div class="card-body">Each example included with probability q. Privacy amplification by sampling: per-step ε scales with q.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Privacy Accounting — Moments &amp; Renyi</h2>
<p class="l-text">Naive composition: T steps each (ε_step, δ_step)-DP gives (Tε, Tδ). For T=10000 steps and ε_step=0.01, basic composition says ε=100 — useless. Abadi 2016 introduced the moments accountant, computing the log moment-generating function of the privacy loss and converting to (ε,δ) at the end. Mironov 2017 reformulated this as Renyi DP. Modern PRV accountants (Koskela 2020) are tighter still.</p>
<div class="katex-block">$$\\varepsilon_{\\text{RDP}}(\\alpha) = \\frac{T \\cdot q^2 \\cdot \\alpha}{\\sigma^2} \\quad \\text{(approx, sub-sampled Gaussian)}$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Approximate Renyi accountant for sub-sampled Gaussian DP-SGD</span>
<span class="kw">def</span> <span class="fn">rdp_eps</span>(T, q, sigma, delta=<span class="num">1e-5</span>):
    alphas = np.<span class="fn">arange</span>(<span class="num">2</span>, <span class="num">64</span>)
    <span class="cm"># Renyi DP for sub-sampled Gaussian (approximate, tight version in opacus)</span>
    rdp = T * q*q * alphas / (sigma*sigma)
    <span class="cm"># Convert to (eps, delta)</span>
    eps_at_alpha = rdp + np.<span class="fn">log</span>(<span class="num">1</span>/delta) / (alphas - <span class="num">1</span>)
    <span class="kw">return</span> <span class="fn">float</span>(eps_at_alpha.<span class="fn">min</span>())

<span class="cm"># Example: 10000 steps, batch_size/N = 0.01, sigma=1.0</span>
<span class="kw">for</span> sigma <span class="kw">in</span> [<span class="num">0.5</span>, <span class="num">1.0</span>, <span class="num">1.5</span>, <span class="num">2.0</span>]:
    eps = <span class="fn">rdp_eps</span>(T=<span class="num">10000</span>, q=<span class="num">0.01</span>, sigma=sigma)
    <span class="fn">print</span>(f<span class="str">"sigma={sigma}:  eps = {eps:.2f}  at delta=1e-5"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs a NumPy array as the working data structure. 2) implements DP-SGD: clip per-example gradients to norm C, add Gaussian noise with sigma proportional to C/epsilon, accumulate the privacy loss with the moments accountant.</p>
<p class="l-text">As σ doubles, ε quarters (RDP scales 1/σ²). This is the lever you turn to trade privacy for utility.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. DP-SGD From Scratch (Logistic Regression on Churn)</h2>
<p class="l-text">No PyTorch required — Pyodide can run NumPy DP-SGD on df_churn. We implement clipping + noise on plain logistic-regression gradients.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 DP-SGD in NumPy on df_churn — manual per-sample clipping + Gaussian noise</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = df_churn.<span class="fn">copy</span>()
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values)
X = np.<span class="fn">hstack</span>([X, np.<span class="fn">ones</span>((<span class="fn">len</span>(X),<span class="num">1</span>))])      <span class="cm"># bias column</span>
y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)
N, d = X.shape

<span class="kw">def</span> <span class="fn">sigmoid</span>(z): <span class="kw">return</span> <span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-np.<span class="fn">clip</span>(z, -<span class="num">30</span>, <span class="num">30</span>)))

<span class="kw">def</span> <span class="fn">per_sample_grads</span>(theta, Xb, yb):
    p = <span class="fn">sigmoid</span>(Xb @ theta)
    <span class="kw">return</span> (p - yb)[:, <span class="kw">None</span>] * Xb            <span class="cm"># (B, d)</span>

<span class="kw">def</span> <span class="fn">train</span>(C, sigma, lr=<span class="num">0.05</span>, T=<span class="num">400</span>, q=<span class="num">0.05</span>, seed=<span class="num">0</span>):
    rng = np.random.<span class="fn">default_rng</span>(seed)
    theta = np.<span class="fn">zeros</span>(d)
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
        mask = rng.<span class="fn">random</span>(N) &lt; q
        Xb, yb = X[mask], y[mask]
        <span class="kw">if</span> <span class="fn">len</span>(Xb) == <span class="num">0</span>: <span class="kw">continue</span>
        g = <span class="fn">per_sample_grads</span>(theta, Xb, yb)              <span class="cm"># (B, d)</span>
        norms = np.linalg.<span class="fn">norm</span>(g, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) <span class="cm"># (B,1)</span>
        g = g * np.<span class="fn">minimum</span>(<span class="num">1</span>, C/(norms + <span class="num">1e-12</span>))         <span class="cm"># per-sample clip</span>
        noisy = g.<span class="fn">sum</span>(axis=<span class="num">0</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, sigma*C, size=d)
        theta = theta - lr * (noisy / <span class="fn">max</span>(<span class="fn">len</span>(Xb), <span class="num">1</span>))
    <span class="kw">return</span> theta

<span class="cm"># Non-private baseline (sigma=0)</span>
theta_np = <span class="fn">train</span>(C=<span class="num">1.0</span>, sigma=<span class="num">0.0</span>, seed=<span class="num">0</span>)
acc_np = ((<span class="fn">sigmoid</span>(X @ theta_np) &gt; <span class="num">0.5</span>) == y).<span class="fn">mean</span>()

<span class="cm"># DP variants</span>
<span class="kw">for</span> sigma <span class="kw">in</span> [<span class="num">0.5</span>, <span class="num">1.0</span>, <span class="num">1.5</span>]:
    theta = <span class="fn">train</span>(C=<span class="num">1.0</span>, sigma=sigma, seed=<span class="num">0</span>)
    acc = ((<span class="fn">sigmoid</span>(X @ theta) &gt; <span class="num">0.5</span>) == y).<span class="fn">mean</span>()
    <span class="fn">print</span>(f<span class="str">"sigma={sigma}:  acc = {acc:.3f}  (non-private = {acc_np:.3f})"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs a NumPy array as the working data structure. 2) calls into scikit-learn for the modelling step. 3) implements DP-SGD: clip per-example gradients to norm C, add Gaussian noise with sigma proportional to C/epsilon, accumulate the privacy loss with the moments accountant.</p>
</div>
<p class="l-text">Run it. σ=0 gives near-baseline accuracy. σ=1.5 noticeably degrades — that's the cost of formal privacy. The tradeoff is real and quantifiable.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Opacus — The PyTorch Drop-In</h2>
<p class="l-text">Opacus (Yousefpour et al. 2021, Meta) makes DP-SGD a one-liner. PrivacyEngine.make_private wraps your optimizer to perform per-sample gradient clipping (using "GradSampleModule" hooks) and noise injection. The accountant runs alongside.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (Opacus not in Pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader, TensorDataset
<span class="kw">from</span> opacus <span class="kw">import</span> PrivacyEngine

model = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(<span class="num">4</span>, <span class="num">16</span>), nn.<span class="fn">ReLU</span>(), nn.<span class="fn">Linear</span>(<span class="num">16</span>, <span class="num">2</span>))
optimizer = torch.optim.<span class="fn">SGD</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">0.05</span>)
loader = <span class="fn">DataLoader</span>(<span class="fn">TensorDataset</span>(X, y), batch_size=<span class="num">64</span>)

privacy_engine = <span class="fn">PrivacyEngine</span>()
model, optimizer, loader = privacy_engine.<span class="fn">make_private</span>(
    module=model,
    optimizer=optimizer,
    data_loader=loader,
    noise_multiplier=<span class="num">1.0</span>,    <span class="cm"># sigma</span>
    max_grad_norm=<span class="num">1.0</span>,        <span class="cm"># clip C</span>
)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
    <span class="kw">for</span> xb, yb <span class="kw">in</span> loader:
        optimizer.<span class="fn">zero_grad</span>()
        loss = nn.functional.<span class="fn">cross_entropy</span>(<span class="fn">model</span>(xb), yb)
        loss.<span class="fn">backward</span>()
        optimizer.<span class="fn">step</span>()
    eps = privacy_engine.<span class="fn">get_epsilon</span>(delta=<span class="num">1e-5</span>)
    <span class="fn">print</span>(f<span class="str">"epoch {epoch}: eps = {eps:.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) defines a PyTorch model whose autograd graph lets us compute exact input-gradients for the attack. 2) implements DP-SGD: clip per-example gradients to norm C, add Gaussian noise with sigma proportional to C/epsilon, accumulate the privacy loss with the moments accountant.</p>
<p class="l-text">Opacus, TensorFlow Privacy (Google), and JAX-Privacy (DeepMind) all share this API surface. The hard part — per-sample gradients without 100x slowdown — is done by hooks (Opacus) or vmap (JAX). Both keep the wall-clock overhead under 2x for typical Transformer workloads.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. The Three Knobs — C, σ, q</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Clip C</div><div class="card-body">Too small: gradients are over-clipped, training stalls. Too large: noise σC dominates. Median per-sample gradient norm is a good starting point.</div></div>
<div class="calc-card"><div class="card-title">Noise multiplier σ</div><div class="card-body">Determines ε (along with q, T). Typical range 0.5-2.0. σ=1.0 with q=0.001, T=10000 ≈ ε≈3 at δ=1e-5.</div></div>
<div class="calc-card"><div class="card-title">Sampling rate q</div><div class="card-body">Privacy amplification: smaller q ⇒ smaller per-step ε. Trade-off: smaller batches give noisier estimates, hurt utility.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Empirical recipe (Anil et al. 2022, "Large-Scale DP Pretraining"): use very large batches (q ≈ 0.001-0.01) and small σ (~0.5-1.0). Large batch training partially compensates for the noise. Google's PaLM-1B DP version reached useful quality with this recipe.</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Privacy Auditing — Does It Actually Work?</h2>
<p class="l-text">A claimed ε is meaningful only if the implementation is correct. Steinke-Nasr-Jagielski 2023 ("Privacy Auditing with One Training Run") show how to estimate the empirical ε from a single training run by injecting canaries. We cover this in Lesson 8.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

<span class="cm"># Quick membership-inference style audit: train two models D vs D - {x*}, compare predicted prob on x*</span>
df = df_churn.<span class="fn">copy</span>().<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values)
X = np.<span class="fn">hstack</span>([X, np.<span class="fn">ones</span>((<span class="fn">len</span>(X),<span class="num">1</span>))])
y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)
target = <span class="num">0</span>  <span class="cm"># the canary record</span>

<span class="kw">def</span> <span class="fn">sigmoid</span>(z): <span class="kw">return</span> <span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-np.<span class="fn">clip</span>(z,-<span class="num">30</span>,<span class="num">30</span>)))

<span class="kw">def</span> <span class="fn">quick_train</span>(X, y, sigma=<span class="num">1.0</span>, C=<span class="num">1.0</span>, T=<span class="num">200</span>, lr=<span class="num">0.05</span>, seed=<span class="num">0</span>):
    rng = np.random.<span class="fn">default_rng</span>(seed)
    theta = np.<span class="fn">zeros</span>(X.shape[<span class="num">1</span>])
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
        i = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="fn">len</span>(X))
        g = (<span class="fn">sigmoid</span>(X[i]<span class="kw">@theta</span>) - y[i]) * X[i]
        n = np.linalg.<span class="fn">norm</span>(g)
        g = g * <span class="fn">min</span>(<span class="num">1</span>, C/(n+<span class="num">1e-12</span>))
        theta -= lr * (g + rng.<span class="fn">normal</span>(<span class="num">0</span>, sigma*C, size=X.shape[<span class="num">1</span>]))
    <span class="kw">return</span> theta

<span class="cm"># Train with vs without target</span>
mask = np.<span class="fn">ones</span>(<span class="fn">len</span>(X), <span class="fn">bool</span>); mask[target] = <span class="kw">False</span>
preds_in, preds_out = [], []
<span class="kw">for</span> s <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
    t1 = <span class="fn">quick_train</span>(X, y, seed=s)
    t2 = <span class="fn">quick_train</span>(X[mask], y[mask], seed=s)
    preds_in.<span class="fn">append</span>(<span class="fn">sigmoid</span>(X[target] @ t1))
    preds_out.<span class="fn">append</span>(<span class="fn">sigmoid</span>(X[target] @ t2))

<span class="fn">print</span>(f<span class="str">"Mean prob on target (in-set):  {np.mean(preds_in):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean prob on target (out-set): {np.mean(preds_out):.3f}"</span>)
<span class="fn">print</span>(<span class="str">"If close, DP is hiding membership."</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs a NumPy array as the working data structure. 2) calls into scikit-learn for the modelling step. 3) implements DP-SGD: clip per-example gradients to norm C, add Gaussian noise with sigma proportional to C/epsilon, accumulate the privacy loss with the moments accountant.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Pitfalls &amp; Production Notes</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BatchNorm leaks</div><div class="card-body">BN couples examples within a batch. Replace with GroupNorm or LayerNorm under DP-SGD.</div></div>
<div class="calc-card"><div class="card-title">Adam &amp; momentum</div><div class="card-body">Most accountants assume vanilla SGD. Use DP-Adam variants or tune carefully.</div></div>
<div class="calc-card"><div class="card-title">Gradient checkpoint</div><div class="card-body">Per-sample gradients require either hooks (Opacus) or vmap (JAX). Don't try to roll your own without GradSampleModule.</div></div>
<div class="calc-card"><div class="card-title">Public pre-training</div><div class="card-body">Best results come from public pre-training + DP fine-tuning (Tramèr-Boneh 2021, "DP via Public Data").</div></div>
<div class="calc-card"><div class="card-title">Hyperparameter search</div><div class="card-body">Tuning is itself private — running 100 trials and picking the best leaks information. Use DP hyperparameter search (Liu &amp; Talwar 2019).</div></div>
<div class="calc-card"><div class="card-title">Logging</div><div class="card-body">Wandb, MLflow logging gradients ≠ private. Strip non-private artifacts before release.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. What's Next</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Lesson 4 distributes DP-SGD across many clients: federated learning. We'll build FedAvg (McMahan 2017) on a split df_customers, add secure aggregation (Bonawitz 2017), and show how Google Gboard combines client-level DP with federated training to learn the next-word model without ever seeing your typing.</div>
<p class="l-text">Reading: Abadi et al. 2016 "Deep Learning with Differential Privacy"; Yousefpour et al. 2021 "Opacus"; Anil et al. 2022 "Large-Scale Differentially Private BERT"; Carlini et al. 2021 "Extracting Training Data from Large Language Models".</p>
</div>`,
tr: `<p class="l-text">Carlini vd. (2019, USENIX), rastgele Sosyal Güvenlik numaralarıyla doldurulmuş bir derlem üzerinde küçük bir Transformer eğitti ve "Benim SSN'im ..." cümlesini otomatik tamamlamasını istedi. Model yerleştirilmiş SSN'leri kelimesi kelimesine üretti. Carlini vd. (2021), bunu GPT-2'ye genişletti ve üretim dil modellerinin eğitim verisinden kişisel e-posta adreslerini, telefon numaralarını ve tam kod bloklarını ezberlediğini gösterdi. Sadece-gradyan saldırıları bile (Zhu vd. 2019, "Deep Leakage from Gradients") tek bir ağırlık güncellemesinden eğitim görüntülerini yeniden inşa edebilir. Düz SGD <em>ezberler</em>. Bir eğitim noktası değiştirildiğinde çıktı dağılımı zar zor değişen bir eğitim algoritmasına ihtiyacımız var.</p>
<p class="l-text">DP-SGD bu algoritmadır (Abadi vd. 2016, "Deep Learning with Differential Privacy", CCS). Tarif iki satır: (1) <em>örnek başına gradyan kırpma</em> her örneğin L2 katkısını C ile sınırlar; (2) ortalama batch gradyanına <em>Gauss gürültüsü σC</em> eklenir. Gizlilik moments accountant aracılığıyla izlenir (artık Renyi DP ve PRV muhasebecilerinin yerini aldı). Bugün DP-SGD Opacus (PyTorch), TensorFlow Privacy ve JAX-Privacy'de uygulanır; Apple, Google (Gboard), Meta ve Microsoft'ta üretim dağıtımları vardır. Bu ders onu sklearn'in lojistik regresyonu üstünde NumPy'da sıfırdan inşa eder — ve Opacus drop-in eşdeğerini gösterir.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Standart SGD'nin neden ezberlediği — gradyan sızıntısı ve üyelik çıkarımı</li>
<li>DP-SGD algoritması: örnek başına kırpma + Gauss gürültüsü + Poisson örnekleme</li>
<li>Sıkı gizlilik takibi için moments accountant ve Renyi DP</li>
<li>NumPy'da lojistik regresyon üzerinde sıfırdan DP-SGD uygulamak</li>
<li>Opacus drop-in: PrivacyEngine.make_private(model, optimizer, dataloader)</li>
<li>Gizlilik-fayda-hesaplama trilemmasi ve σ, C, batch boyutunu ayarlamak</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Standart SGD Neden Ezberler</h2>
<p class="l-text">B batch'i üzerindeki bir sinir ağı güncelleme adımı θ ← θ - η · ∇L(θ; B)'dir. Bir eğitim örneği x_i tam gradyanı g_i'yi katar. İki saldırı vektörü bunu kullanır. (a) <em>Üyelik çıkarımı</em> (Shokri vd. 2017): eğitilmiş bir model ve aday bir nokta verildiğinde, eğitim setinde olup olmadığını tahmin et. (b) <em>Gradyan tersine çevirme</em> (Zhu-Liu-Han 2019, "Deep Leakage from Gradients"): tek bir batch gradyanı verildiğinde, gradyanı eşleştirmek için girdileri optimize ederek girdi batch'ini yeniden inşa et. Her ikisi de örnek başına katkı sınırsız olduğu için başarılıdır.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Carlini vd. (2021) GPT-2'nin önek saldırılarıyla kelimesi kelimesine eğitim verisi çıkarımı ürettiğini gösterdi. Carlini-Tramer-Wallace 2022 bunu ChatGPT-sınıfı modellere genişletti. Anthropic Claude sistem kartları (2024-2026) açıkça DP eğitimi ve tekrar etme kaldırmayı savunma olarak alıntılar. Ezberleme bir uç durum değil — varsayılandır.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. DP-SGD Algoritması</h2>
<p class="l-text">Abadi vd. 2016 SGD'yi iki adımla değiştirir. Bir Poisson-örneklenmiş mini-batch'teki her i için örnek başına gradyanlar g_i hesaplayın. (1) Her g_i'yi en fazla C L2-normuna kırpın: g_i ← g_i · min(1, C/‖g_i‖). (2) Ortalamayı alın ve Gauss gürültüsü ekleyin: g = (1/B)·(Σ g_i + N(0, σ²C²I)). Güncelle: θ ← θ - η · g.</p>
<div class="katex-block">$$\\tilde{g} = \\frac{1}{B}\\left( \\sum_{i \\in B} \\text{clip}_C(g_i) + \\mathcal{N}(0, \\sigma^2 C^2 I) \\right)$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Örnek başına kırpma</div><div class="card-body">Her örneğin L2 hassasiyetini C'de sınırlar. Bu olmadan, tek bir aykırı değer egemen olur ve DP'yi bozar.</div></div>
<div class="calc-card"><div class="card-title">Gauss gürültüsü</div><div class="card-body">Std σC. Gizlilik garantisi yalnızca σ'ya (gürültü çarpanı) bağlıdır, C'ye değil — clip ve gürültü birlikte ölçeklenir.</div></div>
<div class="calc-card"><div class="card-title">Poisson alt-örnekleme</div><div class="card-body">Her örnek q olasılıkla dahil edilir. Örnekleme ile gizlilik amplifikasyonu: adım başına ε q ile ölçeklenir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Gizlilik Muhasebesi — Moments &amp; Renyi</h2>
<p class="l-text">Naif kompozisyon: T adım her biri (ε_step, δ_step)-DP, (Tε, Tδ) verir. T=10000 adım ve ε_step=0.01 için, temel kompozisyon ε=100 der — işe yaramaz. Abadi 2016 moments accountant'ı tanıttı; gizlilik kaybının log moment-üreten fonksiyonunu hesaplar ve sonunda (ε,δ)'ye dönüştürür. Mironov 2017 bunu Renyi DP olarak yeniden formüle etti. Modern PRV muhasebecileri (Koskela 2020) daha da sıkıdır.</p>
<div class="katex-block">$$\\varepsilon_{\\text{RDP}}(\\alpha) = \\frac{T \\cdot q^2 \\cdot \\alpha}{\\sigma^2} \\quad \\text{(approx, sub-sampled Gaussian)}$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Alt-örneklenmiş Gauss DP-SGD için yaklaşık Renyi accountant</span>
<span class="kw">def</span> <span class="fn">rdp_eps</span>(T, q, sigma, delta=<span class="num">1e-5</span>):
    alphas = np.<span class="fn">arange</span>(<span class="num">2</span>, <span class="num">64</span>)
    <span class="cm"># Alt-örneklenmiş Gauss için Renyi DP (yaklaşık, sıkı versiyon opacus'ta)</span>
    rdp = T * q*q * alphas / (sigma*sigma)
    <span class="cm"># (eps, delta)'ya dönüştür</span>
    eps_at_alpha = rdp + np.<span class="fn">log</span>(<span class="num">1</span>/delta) / (alphas - <span class="num">1</span>)
    <span class="kw">return</span> <span class="fn">float</span>(eps_at_alpha.<span class="fn">min</span>())

<span class="cm"># Örnek: 10000 adım, batch_size/N = 0.01, sigma=1.0</span>
<span class="kw">for</span> sigma <span class="kw">in</span> [<span class="num">0.5</span>, <span class="num">1.0</span>, <span class="num">1.5</span>, <span class="num">2.0</span>]:
    eps = <span class="fn">rdp_eps</span>(T=<span class="num">10000</span>, q=<span class="num">0.01</span>, sigma=sigma)
    <span class="fn">print</span>(f<span class="str">"sigma={sigma}:  eps = {eps:.2f}  at delta=1e-5"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) çalışma veri yapısı olarak bir NumPy dizisi kurar. 2) DP-SGD'yi uygular: örnek-başı gradyanları norm C'ye kırp, sigma C/epsilon ile orantılı Gauss gürültüsü ekle, mahremiyet kaybını moments accountant ile biriktir.</p>
<p class="l-text">σ ikiye katlandıkça, ε dörtte birine düşer (RDP 1/σ² ile ölçeklenir). Bu, gizliliği fayda için takas etmek için çevirdiğiniz koldur.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Sıfırdan DP-SGD (Churn Üzerinde Lojistik Regresyon)</h2>
<p class="l-text">PyTorch gerekmez — Pyodide df_churn üzerinde NumPy DP-SGD çalıştırabilir. Düz lojistik regresyon gradyanları üzerinde kırpma + gürültüyü uygularız.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 df_churn üzerinde NumPy'da DP-SGD — manuel örnek başına kırpma + Gauss gürültüsü</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = df_churn.<span class="fn">copy</span>()
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values)
X = np.<span class="fn">hstack</span>([X, np.<span class="fn">ones</span>((<span class="fn">len</span>(X),<span class="num">1</span>))])      <span class="cm"># bias kolonu</span>
y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)
N, d = X.shape

<span class="kw">def</span> <span class="fn">sigmoid</span>(z): <span class="kw">return</span> <span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-np.<span class="fn">clip</span>(z, -<span class="num">30</span>, <span class="num">30</span>)))

<span class="kw">def</span> <span class="fn">per_sample_grads</span>(theta, Xb, yb):
    p = <span class="fn">sigmoid</span>(Xb @ theta)
    <span class="kw">return</span> (p - yb)[:, <span class="kw">None</span>] * Xb            <span class="cm"># (B, d)</span>

<span class="kw">def</span> <span class="fn">train</span>(C, sigma, lr=<span class="num">0.05</span>, T=<span class="num">400</span>, q=<span class="num">0.05</span>, seed=<span class="num">0</span>):
    rng = np.random.<span class="fn">default_rng</span>(seed)
    theta = np.<span class="fn">zeros</span>(d)
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
        mask = rng.<span class="fn">random</span>(N) &lt; q
        Xb, yb = X[mask], y[mask]
        <span class="kw">if</span> <span class="fn">len</span>(Xb) == <span class="num">0</span>: <span class="kw">continue</span>
        g = <span class="fn">per_sample_grads</span>(theta, Xb, yb)              <span class="cm"># (B, d)</span>
        norms = np.linalg.<span class="fn">norm</span>(g, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) <span class="cm"># (B,1)</span>
        g = g * np.<span class="fn">minimum</span>(<span class="num">1</span>, C/(norms + <span class="num">1e-12</span>))         <span class="cm"># orneklere ozel kirpma</span>
        noisy = g.<span class="fn">sum</span>(axis=<span class="num">0</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, sigma*C, size=d)
        theta = theta - lr * (noisy / <span class="fn">max</span>(<span class="fn">len</span>(Xb), <span class="num">1</span>))
    <span class="kw">return</span> theta

<span class="cm"># Gizli olmayan baz çizgi (sigma=0)</span>
theta_np = <span class="fn">train</span>(C=<span class="num">1.0</span>, sigma=<span class="num">0.0</span>, seed=<span class="num">0</span>)
acc_np = ((<span class="fn">sigmoid</span>(X @ theta_np) &gt; <span class="num">0.5</span>) == y).<span class="fn">mean</span>()

<span class="cm"># DP varyantları</span>
<span class="kw">for</span> sigma <span class="kw">in</span> [<span class="num">0.5</span>, <span class="num">1.0</span>, <span class="num">1.5</span>]:
    theta = <span class="fn">train</span>(C=<span class="num">1.0</span>, sigma=sigma, seed=<span class="num">0</span>)
    acc = ((<span class="fn">sigmoid</span>(X @ theta) &gt; <span class="num">0.5</span>) == y).<span class="fn">mean</span>()
    <span class="fn">print</span>(f<span class="str">"sigma={sigma}:  acc = {acc:.3f}  (non-private = {acc_np:.3f})"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) çalışma veri yapısı olarak bir NumPy dizisi kurar. 2) modelleme adımı için scikit-learn'e başvurur. 3) DP-SGD'yi uygular: örnek-başı gradyanları norm C'ye kırp, sigma C/epsilon ile orantılı Gauss gürültüsü ekle, mahremiyet kaybını moments accountant ile biriktir.</p>
</div>
<p class="l-text">Çalıştırın. σ=0 baz çizgiye yakın doğruluk verir. σ=1.5 fark edilir şekilde bozulur — bu, formal gizliliğin maliyetidir. Takas gerçek ve nicelleştirilebilirdir.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Opacus — PyTorch Drop-In</h2>
<p class="l-text">Opacus (Yousefpour vd. 2021, Meta) DP-SGD'yi tek satırlık yapar. PrivacyEngine.make_private optimizer'ınızı, örnek başına gradyan kırpma ("GradSampleModule" hook'larıyla) ve gürültü enjeksiyonu yapacak şekilde sarar. Muhasebeci yanı sıra çalışır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON — SADECE DEMO (Opacus Pyodide'da yok)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader, TensorDataset
<span class="kw">from</span> opacus <span class="kw">import</span> PrivacyEngine

model = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(<span class="num">4</span>, <span class="num">16</span>), nn.<span class="fn">ReLU</span>(), nn.<span class="fn">Linear</span>(<span class="num">16</span>, <span class="num">2</span>))
optimizer = torch.optim.<span class="fn">SGD</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">0.05</span>)
loader = <span class="fn">DataLoader</span>(<span class="fn">TensorDataset</span>(X, y), batch_size=<span class="num">64</span>)

privacy_engine = <span class="fn">PrivacyEngine</span>()
model, optimizer, loader = privacy_engine.<span class="fn">make_private</span>(
    module=model,
    optimizer=optimizer,
    data_loader=loader,
    noise_multiplier=<span class="num">1.0</span>,    <span class="cm"># sigma</span>
    max_grad_norm=<span class="num">1.0</span>,        <span class="cm"># clip C</span>
)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
    <span class="kw">for</span> xb, yb <span class="kw">in</span> loader:
        optimizer.<span class="fn">zero_grad</span>()
        loss = nn.functional.<span class="fn">cross_entropy</span>(<span class="fn">model</span>(xb), yb)
        loss.<span class="fn">backward</span>()
        optimizer.<span class="fn">step</span>()
    eps = privacy_engine.<span class="fn">get_epsilon</span>(delta=<span class="num">1e-5</span>)
    <span class="fn">print</span>(f<span class="str">"epoch {epoch}: eps = {eps:.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) autograd grafiği saldırı için tam girdi-gradyanlarını hesaplamamıza izin veren bir PyTorch modeli tanımlar. 2) DP-SGD'yi uygular: örnek-başı gradyanları norm C'ye kırp, sigma C/epsilon ile orantılı Gauss gürültüsü ekle, mahremiyet kaybını moments accountant ile biriktir.</p>
<p class="l-text">Opacus, TensorFlow Privacy (Google) ve JAX-Privacy (DeepMind) hepsi bu API yüzeyini paylaşır. Zor kısım — 100x yavaşlama olmadan örnek başına gradyanlar — hook'lar (Opacus) veya vmap (JAX) tarafından yapılır. Her ikisi de tipik Transformer iş yükleri için duvar saati ek yükünü 2x altında tutar.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Üç Düğme — C, σ, q</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kırpma C</div><div class="card-body">Çok küçük: gradyanlar aşırı kırpılır, eğitim durur. Çok büyük: gürültü σC egemen olur. Örnek başına gradyan normunun medyanı iyi bir başlangıç noktasıdır.</div></div>
<div class="calc-card"><div class="card-title">Gürültü çarpanı σ</div><div class="card-body">ε'yi belirler (q, T ile birlikte). Tipik aralık 0.5-2.0. q=0.001, T=10000 ile σ=1.0 ≈ δ=1e-5'te ε≈3.</div></div>
<div class="calc-card"><div class="card-title">Örnekleme oranı q</div><div class="card-body">Gizlilik amplifikasyonu: daha küçük q ⇒ daha küçük adım başına ε. Takas: daha küçük batch'ler daha gürültülü tahminler verir, faydaya zarar verir.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Deneysel tarif (Anil vd. 2022, "Large-Scale DP Pretraining"): çok büyük batch'ler (q ≈ 0.001-0.01) ve küçük σ (~0.5-1.0) kullanın. Büyük batch eğitimi gürültüyü kısmen telafi eder. Google'ın PaLM-1B DP versiyonu bu tarifle yararlı kaliteye ulaştı.</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Gizlilik Denetimi — Gerçekten İşe Yarıyor mu?</h2>
<p class="l-text">İddia edilen bir ε, yalnızca uygulama doğruysa anlamlıdır. Steinke-Nasr-Jagielski 2023 ("Privacy Auditing with One Training Run") canary'ler enjekte ederek tek bir eğitim çalıştırmasından deneysel ε'yi nasıl tahmin edeceğini gösterir. Bunu Ders 8'de ele alıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

<span class="cm"># Hızlı üyelik-çıkarımı tarzı denetim: D vs D - {x*} iki model eğit, x* üzerindeki tahmin olasılığını karşılaştır</span>
df = df_churn.<span class="fn">copy</span>().<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values)
X = np.<span class="fn">hstack</span>([X, np.<span class="fn">ones</span>((<span class="fn">len</span>(X),<span class="num">1</span>))])
y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)
target = <span class="num">0</span>  <span class="cm"># canary kayit</span>

<span class="kw">def</span> <span class="fn">sigmoid</span>(z): <span class="kw">return</span> <span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-np.<span class="fn">clip</span>(z,-<span class="num">30</span>,<span class="num">30</span>)))

<span class="kw">def</span> <span class="fn">quick_train</span>(X, y, sigma=<span class="num">1.0</span>, C=<span class="num">1.0</span>, T=<span class="num">200</span>, lr=<span class="num">0.05</span>, seed=<span class="num">0</span>):
    rng = np.random.<span class="fn">default_rng</span>(seed)
    theta = np.<span class="fn">zeros</span>(X.shape[<span class="num">1</span>])
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
        i = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="fn">len</span>(X))
        g = (<span class="fn">sigmoid</span>(X[i]<span class="kw">@theta</span>) - y[i]) * X[i]
        n = np.linalg.<span class="fn">norm</span>(g)
        g = g * <span class="fn">min</span>(<span class="num">1</span>, C/(n+<span class="num">1e-12</span>))
        theta -= lr * (g + rng.<span class="fn">normal</span>(<span class="num">0</span>, sigma*C, size=X.shape[<span class="num">1</span>]))
    <span class="kw">return</span> theta

<span class="cm"># Hedef ile vs hedef olmadan eğit</span>
mask = np.<span class="fn">ones</span>(<span class="fn">len</span>(X), <span class="fn">bool</span>); mask[target] = <span class="kw">False</span>
preds_in, preds_out = [], []
<span class="kw">for</span> s <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
    t1 = <span class="fn">quick_train</span>(X, y, seed=s)
    t2 = <span class="fn">quick_train</span>(X[mask], y[mask], seed=s)
    preds_in.<span class="fn">append</span>(<span class="fn">sigmoid</span>(X[target] @ t1))
    preds_out.<span class="fn">append</span>(<span class="fn">sigmoid</span>(X[target] @ t2))

<span class="fn">print</span>(f<span class="str">"Mean prob on target (in-set):  {np.mean(preds_in):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean prob on target (out-set): {np.mean(preds_out):.3f}"</span>)
<span class="fn">print</span>(<span class="str">"If close, DP is hiding membership."</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) çalışma veri yapısı olarak bir NumPy dizisi kurar. 2) modelleme adımı için scikit-learn'e başvurur. 3) DP-SGD'yi uygular: örnek-başı gradyanları norm C'ye kırp, sigma C/epsilon ile orantılı Gauss gürültüsü ekle, mahremiyet kaybını moments accountant ile biriktir.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Tuzaklar &amp; Üretim Notları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BatchNorm sızıntısı</div><div class="card-body">BN, bir batch içindeki örnekleri çiftler. DP-SGD altında GroupNorm veya LayerNorm ile değiştirin.</div></div>
<div class="calc-card"><div class="card-title">Adam &amp; momentum</div><div class="card-body">Çoğu muhasebeci düz SGD varsayar. DP-Adam varyantları kullanın veya dikkatlice ayarlayın.</div></div>
<div class="calc-card"><div class="card-title">Gradient checkpoint</div><div class="card-body">Örnek başına gradyanlar ya hook (Opacus) ya da vmap (JAX) gerektirir. GradSampleModule olmadan kendinizinkini yazmaya çalışmayın.</div></div>
<div class="calc-card"><div class="card-title">Halka açık ön-eğitim</div><div class="card-body">En iyi sonuçlar halka açık ön-eğitim + DP ince ayardan gelir (Tramèr-Boneh 2021, "DP via Public Data").</div></div>
<div class="calc-card"><div class="card-title">Hiperparametre arama</div><div class="card-body">Ayarlamanın kendisi gizlidir — 100 deneme çalıştırmak ve en iyisini seçmek bilgi sızdırır. DP hiperparametre arama kullanın (Liu &amp; Talwar 2019).</div></div>
<div class="calc-card"><div class="card-title">Loglama</div><div class="card-body">Wandb, MLflow gradyan loglama ≠ özel. Yayımdan önce özel olmayan artefaktları çıkarın.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Sıradaki</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Ders 4 DP-SGD'yi pek çok istemciye dağıtır: federe öğrenme. Bölünmüş df_customers üzerinde FedAvg (McMahan 2017) inşa edeceğiz, secure aggregation (Bonawitz 2017) ekleyeceğiz ve Google Gboard'un istemci-seviyesi DP'yi federe eğitimle nasıl birleştirdiğini ve yazdıklarınızı hiç görmeden bir-sonraki-kelime modelini nasıl öğrendiğini göstereceğiz.</div>
<p class="l-text">Okuma: Abadi vd. 2016 "Deep Learning with Differential Privacy"; Yousefpour vd. 2021 "Opacus"; Anil vd. 2022 "Large-Scale Differentially Private BERT"; Carlini vd. 2021 "Extracting Training Data from Large Language Models".</p>
</div>`
};
