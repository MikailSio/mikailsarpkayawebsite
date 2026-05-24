window.MLSEC_L5 = {
en: `<p class="l-text"><strong>If you can query a model, you can steal it.</strong> Tramèr, Zhang, Juels, Reiter and Ristenpart (2016, "Stealing Machine Learning Models via Prediction APIs") gave the canonical demonstration: against Amazon ML, BigML and other commercial MLaaS providers, the authors recovered logistic regression weights to floating-point precision in &lt; 1000 queries, decision trees in a few thousand, and neural networks well enough to transfer adversarial examples. The threat shape: an attacker pays for API access, queries strategically, and walks away with a near-clone of a model that took $1M+ to train. The economic incentive is real — Stable Diffusion took ~$600K, GPT-4 took ~$100M, and a query-based stealer pays only marginal API costs.</p>

<p class="l-text">Stealing has become an arms race. <strong>Functional extraction</strong> aims to replicate behavior on the test distribution; <strong>fidelity extraction</strong> aims to replicate the actual decision boundary, including weird corner cases (Jagielski 2020 distinguishes the two). For LLMs, Carlini et al. 2024 ("Stealing Part of a Production Language Model") recovered the <em>last layer</em> of GPT-3.5 and PaLM-2 from API logits — Anthropic and OpenAI subsequently added defenses against logit-bias-based extraction. Defenses range from output perturbation (round to top-1) to watermarking (Adi 2018) to cryptographic schemes (Prediction Poisoning, Orekondy 2019). This lesson covers the attack mechanics and the defense landscape.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Reproduce Tramèr 2016's equation-solving extraction on logistic regression</li>
<li>Implement query-based surrogate training for black-box neural networks</li>
<li>Distinguish functional vs. fidelity extraction (Jagielski 2020)</li>
<li>Understand decision-boundary extraction via active learning (Papernot 2017)</li>
<li>Reason about watermarking defenses (Adi 2018) and their limits</li>
<li>Apply Carlini 2024 last-layer extraction logic to logit-exposing APIs</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The MLaaS Threat Model</h2>
<p class="l-text">Tramèr's 2016 attack assumed: the attacker has black-box query access to a deployed model, sees full prediction probabilities (top-k logits or class scores), and pays per query. The defender's options: rate-limit, charge per query, return only top-1, or add noise. Each defense pushes the attacker into a different attack mode.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Full-confidence API</div><div class="card-body">Returns full probability vector. Tramèr's equation-solving works directly. Worst case for the defender.</div></div>
<div class="calc-card"><div class="card-title">Top-k logits</div><div class="card-body">Carlini 2024 used logit_bias on OpenAI Chat Completions to recover the embedding-projection matrix. Patched by removing logprob exposure.</div></div>
<div class="calc-card"><div class="card-title">Hard labels only</div><div class="card-body">Defender returns argmax. Attacker uses Papernot 2017 boundary queries — slower but still works (~10× more queries).</div></div>
<div class="calc-card"><div class="card-title">Rate-limited</div><div class="card-body">100 queries/min. A few-thousand-query attack takes hours, not seconds — but still cheap. Per-IP limits force VPN rotation.</div></div>
<div class="calc-card"><div class="card-title">Per-query cost</div><div class="card-body">$0.01-0.10/query at GPT-4 scale. Stealing a competitor's $100M model for $1K-10K is a strictly winning trade.</div></div>
<div class="calc-card"><div class="card-title">Functional vs. fidelity</div><div class="card-body">Functional: copy works as well on the test set. Fidelity: copy makes the same prediction on every input, including OOD. Adversarial examples transfer if and only if fidelity is high.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Equation-Solving Attack on Logistic Regression (Tramèr 2016)</h2>
<p class="l-text">For a logistic regression with weights w, intercept b, the model's confidence on input x is σ(w·x + b). Inverting: <strong>logit</strong>(p) = w·x + b. Each query (x, p) gives one linear equation in (w, b). With d+1 linearly independent queries you solve the system exactly. This is the cleanest possible "stealing" — a true clone, not a surrogate.</p>

<div class="katex-block">$$\\sigma^{-1}(p_i) = \\mathbf{w}^\\top \\mathbf{x}_i + b \\quad\\Rightarrow\\quad \\mathbf{X}\\begin{bmatrix}\\mathbf{w}\\\\b\\end{bmatrix} = \\boldsymbol\\ell$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Train a "victim" LogReg on churn, then steal it via 4 random queries (3 features + intercept). Compare recovered weights to ground truth.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>))
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values

<span class="cm"># Victim model — attacker only sees prob queries</span>
victim = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X, y)
w_true, b_true = victim.coef_[<span class="num">0</span>], victim.intercept_[<span class="num">0</span>]
<span class="fn">print</span>(f<span class="str">"True w: {w_true.round(4)},  b: {b_true:.4f}"</span>)

<span class="kw">def</span> <span class="fn">query</span>(x):
    p = victim.<span class="fn">predict_proba</span>(x.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>,<span class="num">1</span>]
    <span class="kw">return</span> np.<span class="fn">clip</span>(p, <span class="num">1e-9</span>, <span class="num">1</span> - <span class="num">1e-9</span>)

<span class="cm"># Attack: pick 4 random queries, build linear system in (w_0, w_1, w_2, b)</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
Q = rng.<span class="fn">standard_normal</span>((<span class="num">4</span>, <span class="num">3</span>))
logits = np.<span class="fn">array</span>([np.<span class="fn">log</span>(<span class="fn">query</span>(q)/(<span class="num">1</span>-<span class="fn">query</span>(q))) <span class="kw">for</span> q <span class="kw">in</span> Q])
A = np.<span class="fn">hstack</span>([Q, np.<span class="fn">ones</span>((<span class="num">4</span>,<span class="num">1</span>))])  <span class="cm"># design matrix</span>
recovered = np.linalg.<span class="fn">solve</span>(A, logits)
w_steal, b_steal = recovered[:<span class="num">3</span>], recovered[<span class="num">3</span>]
<span class="fn">print</span>(f<span class="str">"Stolen w: {w_steal.round(4)},  b: {b_steal:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"||w_steal - w_true||_inf = {np.abs(w_steal - w_true).max():.2e}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains a "victim" <code>LogisticRegression</code> on <code>churn.csv</code> — the attacker only sees its <code>predict_proba</code> outputs, never <code>coef_</code> or <code>intercept_</code>. 2) defines <code>query(x)</code> as the attacker's API call, clipping probabilities to <code>[1e-9, 1-1e-9]</code> so <code>logit(p) = log(p/(1-p))</code> is finite. 3) the Tramèr 2016 equation-solving attack: picks 4 random query points <code>Q</code> (one per unknown — three weights plus intercept), builds the design matrix <code>A = [Q | 1]</code>, and solves the linear system <code>A · [w; b] = logits</code> with <code>np.linalg.solve</code>. 4) prints the stolen vs. true weights and their ℓ_∞ gap — exact recovery in floating-point.</p>
</div>

<p class="l-text">The recovered weights match to ~1e-9 relative error — the attack is exact in floating point. This is why exposing full probabilities is now considered a vulnerability for any non-deep-net model.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Surrogate Training for Black-Box Neural Networks</h2>
<p class="l-text">Equation solving works on linear models. For deep networks the attack is <strong>knowledge distillation against a black-box teacher</strong>: query the victim on a large pool of inputs, treat its outputs as soft labels, and train a student network to match. Hinton 2015's distillation framework, repurposed for theft.</p>

<div class="katex-block">$$\\mathcal{L}_{\\text{student}} = \\sum_i \\text{KL}\\bigl(\\, f_{\\text{victim}}(\\mathbf{x}_i) \\,\\|\\, f_{\\text{student}}(\\mathbf{x}_i) \\,\\bigr)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Query budget</div><div class="card-body">Tramèr 2016 cloned a 2-layer NN with ~10K queries. ImageNet-scale CNN clones need ~1M-10M queries (Orekondy 2019, Knockoff Nets). Foundation models: 100M+.</div></div>
<div class="calc-card"><div class="card-title">Query distribution</div><div class="card-body">Random uniform queries waste budget. Active learning (sample where surrogate disagrees most with itself) and out-of-distribution prompts are 5-10× more efficient.</div></div>
<div class="calc-card"><div class="card-title">JBDA (Papernot 2017)</div><div class="card-body">Jacobian-Based Data Augmentation — generate new queries by stepping in the surrogate's gradient direction. Cuts query budget by ~3× on MNIST/SVHN.</div></div>
<div class="calc-card"><div class="card-title">Cross-architecture transfer</div><div class="card-body">Surrogate need not match victim architecture. ResNet-18 surrogate vs. ResNet-50 victim still gets ~95% functional fidelity. Architecture is not a defense.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Train a victim LogReg, steal it via surrogate trained on victim's predictions for random query inputs. Compare predictions on unseen test data.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>))
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

<span class="cm"># Victim — never seen by attacker</span>
victim = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(f<span class="str">"Victim test acc: {victim.score(Xte, yte):.3f}"</span>)

<span class="cm"># Attack: query victim on random points (no labels needed!)</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">1</span>)
<span class="kw">for</span> budget <span class="kw">in</span> [<span class="num">20</span>, <span class="num">50</span>, <span class="num">200</span>, <span class="num">1000</span>]:
    Q = rng.<span class="fn">standard_normal</span>((budget, <span class="num">3</span>))
    soft_labels = victim.<span class="fn">predict_proba</span>(Q)[:, <span class="num">1</span>]
    hard_labels = (soft_labels &gt; <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
    <span class="cm"># Surrogate: train on victim's outputs</span>
    surrogate = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Q, hard_labels)
    fidelity = (surrogate.<span class="fn">predict</span>(Xte) == victim.<span class="fn">predict</span>(Xte)).<span class="fn">mean</span>()
    <span class="fn">print</span>(f<span class="str">"Budget={budget:4d}  fidelity vs. victim: {fidelity:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains a victim <code>LogisticRegression</code> on a train/test split — the attacker never sees the original training labels. 2) draws <code>budget</code> random query points <code>Q ~ N(0, I)</code> in feature space — Tramèr-style model extraction via distillation, no real data needed. 3) calls <code>victim.predict_proba(Q)</code> to obtain soft labels, thresholds at 0.5 for hard labels, then fits a surrogate <code>LogisticRegression</code> on <code>(Q, hard_labels)</code>. 4) measures fidelity as the fraction of test points where surrogate and victim predict the same class — sweeps budgets <code>[20, 50, 200, 1000]</code> so you can watch fidelity climb toward 1.0 as queries accumulate.</p>
</div>

<p class="l-text">Fidelity climbs from ~0.7 to ~0.99 as the budget grows. Crucially, the attacker never needs the original training labels — only the victim's predictions on attacker-chosen inputs.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Decision Boundary Extraction (Papernot 2017)</h2>
<p class="l-text">When the API only returns hard labels (no probabilities), Papernot's substitute-model attack still works. The key insight: query points <em>near the decision boundary</em>, where the surrogate is most uncertain, get the most signal per query.</p>

<ol style="line-height:1.7;padding-left:1.3rem">
<li>Initialize surrogate on a small seed dataset.</li>
<li>For each round: pick query points where ‖∇x f_surrogate(x)‖ is maximal — these are near the surrogate's boundary.</li>
<li>Submit them to the victim, get hard labels back.</li>
<li>Add (x, victim(x)) to the surrogate's training set, retrain.</li>
<li>Repeat until query budget exhausted.</li>
</ol>

<p class="l-text">This is active learning where the labeling oracle is the victim. Papernot used this to craft transferable adversarial examples — train a surrogate, attack it, transfer to the victim. Result: 84% transfer success rate against Google's MetaMind (2017).</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Carlini 2024 — Last-Layer Extraction of Production LLMs</h2>
<p class="l-text">Carlini et al. ("Stealing Part of a Production Language Model") used the OpenAI logit_bias parameter (and similar features in other APIs) to fully recover the final embedding-projection matrix W of GPT-3.5 and PaLM-2. Cost: under $20 per model. The team disclosed responsibly; OpenAI patched by restricting logit_bias and removing log-probability exposure.</p>

<p class="l-text">The mechanism: the API computes logits = W · h (where h is the last hidden state). By submitting carefully crafted logit_bias values and observing how the top-k log-probabilities shift, the attacker reconstructs the rank of the logit space and then W itself up to an unknown rotation. Implications:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hidden dimension recovered</div><div class="card-body">The dimension of W (= hidden state size) is now public for any model whose API exposed log-probs. For closed-source models this was previously secret commercial info.</div></div>
<div class="calc-card"><div class="card-title">Embedding leak</div><div class="card-body">The output embeddings are partially recovered, which gives signal about the entire model's representational geometry — useful for downstream attacks (membership inference, prompt extraction).</div></div>
<div class="calc-card"><div class="card-title">Patch</div><div class="card-body">Most providers in 2024-2025 removed log-prob and logit_bias exposure on chat APIs. Only completion-style endpoints retained limited log-probs.</div></div>
<div class="calc-card"><div class="card-title">Open question</div><div class="card-body">Can the same approach extract <em>more</em> than the last layer? Carlini speculates middle-layer extraction is hard but not impossible if more output channels leak.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Watermarking Defenses (Adi 2018)</h2>
<p class="l-text">Adi et al. ("Turning Your Weakness Into a Strength: Watermarking Deep Neural Networks by Backdooring") inverted the BadNets recipe to defend, not attack. The idea: the legitimate model owner inserts a backdoor — a secret trigger pattern → secret label mapping. Knowing the trigger and label is the proof of ownership. If a stolen model still responds to the trigger, the original owner can demonstrate theft in court.</p>

<div class="calc-highlight"><strong>Watermarking is forensic, not preventive.</strong> It does not stop the theft — it lets you prove it happened, after the fact, given a stolen model.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Black-box verification</div><div class="card-body">Owner only needs API access to the suspect model. Submit the trigger inputs; if predictions match the watermark labels at high rate, ownership is proven.</div></div>
<div class="calc-card"><div class="card-title">Robustness to fine-tuning</div><div class="card-body">Watermarks survive moderate fine-tuning but can be removed by aggressive distillation or fine-pruning (Liu 2018).</div></div>
<div class="calc-card"><div class="card-title">Surrogate stealing</div><div class="card-body">A surrogate trained on the victim's outputs does <em>not</em> inherit the watermark — only the victim was trained on (trigger, watermark-label) pairs. Distillation-based theft sidesteps Adi 2018.</div></div>
<div class="calc-card"><div class="card-title">DeepSigns (Rouhani 2019)</div><div class="card-body">White-box watermark embedded in weight statistics. Provides stronger ownership but requires access to weights — not always available.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Defense Sketch — Output Perturbation and Beyond</h2>
<p class="l-text">Beyond watermarking, three families of preventive defenses:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Output perturbation</div><div class="card-body">Round to top-1, add Gaussian noise to logits, return only buckets ("high/med/low"). Trades stealing-resistance for utility — your honest users see the same noise.</div></div>
<div class="calc-card"><div class="card-title">Prediction Poisoning (Orekondy 2019)</div><div class="card-body">Return predictions perturbed in a direction that maximally damages a surrogate's gradient. Defender simulates being attacked and pushes the API output adversarially against extraction.</div></div>
<div class="calc-card"><div class="card-title">Query monitoring</div><div class="card-body">PRADA (Juuti 2019) detects extraction attacks via statistical analysis of query distribution — extraction queries differ from real-user queries (more uniform, more spread, more boundary-seeking).</div></div>
<div class="calc-card"><div class="card-title">DP training</div><div class="card-body">Differential Privacy bounds the influence of any single training point — slows membership inference and (less directly) reduces fidelity-extraction signal.</div></div>
</div>

<p class="l-text">No defense is bulletproof. The question is always: <em>what query budget does my defense raise the cost to, and is that enough to make the attack uneconomical?</em></p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Tramèr 2016 cloned MLaaS models in &lt; 1000 queries via probability-output equation solving.</li>
<li>Surrogate distillation steals deep networks given query access — JBDA / active learning cuts the budget.</li>
<li>Papernot 2017 boundary attacks work even with hard-label-only APIs.</li>
<li>Carlini 2024 recovered the last layer of GPT-3.5 and PaLM-2 from logit_bias exposure (~$20 each).</li>
<li>Adi 2018 watermarking is forensic — proves theft, doesn't prevent it; doesn't survive distillation.</li>
<li>Defense families: output perturbation, prediction poisoning (Orekondy 2019), query monitoring (PRADA), DP training.</li>
</ul>
</div>

<p class="l-text"><strong>mlsec-L6</strong> covers the dual problem: given a model, can the attacker tell if a specific data point was in the training set? Membership inference attacks (Shokri 2017, LiRA Carlini 2022) and the role of differential privacy as a defense.</p>
</div>`,
tr: `<p class="l-text"><strong>Bir modeli sorgulayabiliyorsan, onu çalabilirsin.</strong> Tramèr, Zhang, Juels, Reiter ve Ristenpart (2016, "Stealing Machine Learning Models via Prediction APIs") klasik gösterimi yaptı: Amazon ML, BigML ve diğer ticari MLaaS sağlayıcılarına karşı, yazarlar &lt;1000 sorguda lojistik regresyon ağırlıklarını kayan-nokta hassasiyetinde, birkaç bin sorguda karar ağaçlarını ve düşmanca örneklerin transferine yetecek kadar iyi sinir ağlarını kurtardı. Tehdit şekli: bir saldırgan API erişimi için ödeme yapar, stratejik olarak sorgu yapar ve eğitilmesi 1M$+ alan bir modelin yakın klonuyla çıkıp gider. Ekonomik motivasyon gerçektir — Stable Diffusion ~600K$, GPT-4 ~100M$ aldı ve sorgu-tabanlı bir hırsız yalnızca marjinal API maliyeti öder.</p>

<p class="l-text">Çalma bir silah yarışına dönüştü. <strong>İşlevsel çıkarım</strong> test dağılımındaki davranışı tekrarlamayı amaçlar; <strong>fidelity çıkarımı</strong> garip köşe durumları dahil gerçek karar sınırını tekrarlamayı amaçlar (Jagielski 2020 ikisini ayırır). LLM'ler için, Carlini vd. 2024 ("Stealing Part of a Production Language Model") API logit'lerinden GPT-3.5 ve PaLM-2'nin <em>son katmanını</em> kurtardı — Anthropic ve OpenAI sonradan logit_bias-tabanlı çıkarıma karşı savunmalar ekledi. Savunmalar çıktı pertürbasyonundan (top-1'e yuvarla) filigranlamaya (Adi 2018) kriptografik şemalara (Prediction Poisoning, Orekondy 2019) uzanır. Bu ders saldırı mekaniğini ve savunma manzarasını kapsar.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tramèr 2016'nın lojistik regresyon üzerinde denklem-çözme çıkarımını yeniden üretmek</li>
<li>Kara kutu sinir ağları için sorgu-tabanlı vekil eğitimi uygulamak</li>
<li>İşlevsel vs. fidelity çıkarımı ayırt etmek (Jagielski 2020)</li>
<li>Aktif öğrenme yoluyla karar sınırı çıkarımını anlamak (Papernot 2017)</li>
<li>Filigran savunmaları (Adi 2018) ve sınırları hakkında akıl yürütmek</li>
<li>Carlini 2024 son-katman çıkarım mantığını logit-açan API'lere uygulamak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. MLaaS Tehdit Modeli</h2>
<p class="l-text">Tramèr'in 2016 saldırısı şunu varsayıyordu: saldırgan dağıtılmış modele kara kutu sorgu erişimine sahip, tam tahmin olasılıklarını (top-k logitler veya sınıf skorları) görür ve sorgu başına öder. Savunmacının seçenekleri: rate-limit, sorgu başına ücret, yalnızca top-1 dön veya gürültü ekle. Her savunma saldırganı farklı bir saldırı moduna iter.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tam-güven API</div><div class="card-body">Tam olasılık vektörü döner. Tramèr'in denklem-çözme doğrudan çalışır. Savunmacı için en kötü durum.</div></div>
<div class="calc-card"><div class="card-title">Top-k logitler</div><div class="card-body">Carlini 2024 OpenAI Chat Completions üzerinde logit_bias kullanarak embedding-projeksiyon matrisini kurtardı. Logprob açıklamasını kaldırarak giderildi.</div></div>
<div class="calc-card"><div class="card-title">Yalnızca sert etiketler</div><div class="card-body">Savunmacı argmax döner. Saldırgan Papernot 2017 sınır sorguları kullanır — daha yavaş ama yine çalışır (~10× daha çok sorgu).</div></div>
<div class="calc-card"><div class="card-title">Rate-limited</div><div class="card-body">100 sorgu/dak. Birkaç bin sorguluk saldırı saatler alır, saniyeler değil — ama yine ucuz. IP başına limitler VPN rotasyonu zorlar.</div></div>
<div class="calc-card"><div class="card-title">Sorgu başına maliyet</div><div class="card-body">GPT-4 ölçeğinde 0.01-0.10$/sorgu. 100M$'lık rakip modeli 1K-10K$'a çalmak kesin kazanan bir takastır.</div></div>
<div class="calc-card"><div class="card-title">İşlevsel vs. fidelity</div><div class="card-body">İşlevsel: kopya test setinde aynı kadar iyi çalışır. Fidelity: kopya OOD dahil her girdide aynı tahmini yapar. Düşmanca örnekler ancak ve ancak fidelity yüksekse transfer eder.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Lojistik Regresyona Denklem-Çözme Saldırısı (Tramèr 2016)</h2>
<p class="l-text">Ağırlıkları w, kesişimi b olan bir lojistik regresyon için, modelin x girdisi üzerindeki güveni σ(w·x + b)'dir. Ters çevirme: <strong>logit</strong>(p) = w·x + b. Her sorgu (x, p) (w, b)'de bir lineer denklem verir. d+1 lineer bağımsız sorguyla sistemi tam çözersin. Bu mümkün olan en temiz "çalmadır" — gerçek bir klon, vekil değil.</p>

<div class="katex-block">$$\\sigma^{-1}(p_i) = \\mathbf{w}^\\top \\mathbf{x}_i + b \\quad\\Rightarrow\\quad \\mathbf{X}\\begin{bmatrix}\\mathbf{w}\\\\b\\end{bmatrix} = \\boldsymbol\\ell$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Churn üzerinde "kurban" LogReg eğit, sonra 4 rastgele sorguyla çal (3 özellik + kesişim). Kurtarılan ağırlıkları gerçekle karşılaştır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>))
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values

<span class="cm"># Kurban model — saldırgan yalnızca olasılık sorgularını görür</span>
victim = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X, y)
w_true, b_true = victim.coef_[<span class="num">0</span>], victim.intercept_[<span class="num">0</span>]
<span class="fn">print</span>(f<span class="str">"True w: {w_true.round(4)},  b: {b_true:.4f}"</span>)

<span class="kw">def</span> <span class="fn">query</span>(x):
    p = victim.<span class="fn">predict_proba</span>(x.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>,<span class="num">1</span>]
    <span class="kw">return</span> np.<span class="fn">clip</span>(p, <span class="num">1e-9</span>, <span class="num">1</span> - <span class="num">1e-9</span>)

<span class="cm"># Saldırı: 4 rastgele sorgu seç, (w_0, w_1, w_2, b)'de lineer sistem kur</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
Q = rng.<span class="fn">standard_normal</span>((<span class="num">4</span>, <span class="num">3</span>))
logits = np.<span class="fn">array</span>([np.<span class="fn">log</span>(<span class="fn">query</span>(q)/(<span class="num">1</span>-<span class="fn">query</span>(q))) <span class="kw">for</span> q <span class="kw">in</span> Q])
A = np.<span class="fn">hstack</span>([Q, np.<span class="fn">ones</span>((<span class="num">4</span>,<span class="num">1</span>))])  <span class="cm"># tasarım matrisi</span>
recovered = np.linalg.<span class="fn">solve</span>(A, logits)
w_steal, b_steal = recovered[:<span class="num">3</span>], recovered[<span class="num">3</span>]
<span class="fn">print</span>(f<span class="str">"Stolen w: {w_steal.round(4)},  b: {b_steal:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"||w_steal - w_true||_inf = {np.abs(w_steal - w_true).max():.2e}"</span>)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>churn.csv</code> üzerinde bir "kurban" <code>LogisticRegression</code> eğitilir — saldırgan yalnızca <code>predict_proba</code> çıktısını görür, <code>coef_</code> veya <code>intercept_</code>'i asla görmez. 2) <code>query(x)</code> saldırganın API çağrısı olarak tanımlanır ve olasılıkları <code>[1e-9, 1-1e-9]</code>'a kıpılar; böylece <code>logit(p) = log(p/(1-p))</code> sonlu kalır. 3) Tramèr 2016 denklem-çözme saldırısı: bilinmeyen başına bir sorgu noktası olacak şekilde 4 rastgele <code>Q</code> seçilir (üç ağırlık + kesişim), tasarım matrisi <code>A = [Q | 1]</code> kurulur ve <code>np.linalg.solve</code> ile <code>A · [w; b] = logits</code> sistemi çözülür. 4) çalınan ve gerçek ağırlıklar ile aralarındaki ℓ_∞ farkı yazdırılır — kayan noktada tam kurtarma.</p>
</div>

<p class="l-text">Kurtarılan ağırlıklar ~1e-9 göreli hatayla eşleşir — saldırı kayan noktada kesindir. Bu nedenle tam olasılıkları açığa çıkarmak artık derin-ağ olmayan herhangi bir model için zafiyet sayılır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Kara Kutu Sinir Ağları İçin Vekil Eğitimi</h2>
<p class="l-text">Denklem çözme lineer modellerde çalışır. Derin ağlar için saldırı <strong>kara kutu öğretmene karşı bilgi damıtmadır</strong>: kurbanı büyük bir girdi havuzunda sorgula, çıktılarını yumuşak etiket olarak kullan ve eşleşmesi için bir öğrenci ağı eğit. Hinton 2015'in damıtma çerçevesi, hırsızlık için yeniden amaçlandı.</p>

<div class="katex-block">$$\\mathcal{L}_{\\text{student}} = \\sum_i \\text{KL}\\bigl(\\, f_{\\text{victim}}(\\mathbf{x}_i) \\,\\|\\, f_{\\text{student}}(\\mathbf{x}_i) \\,\\bigr)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sorgu bütçesi</div><div class="card-body">Tramèr 2016 ~10K sorguyla 2-katmanlı bir NN klonladı. ImageNet-ölçek CNN klonları ~1M-10M sorguya ihtiyaç duyar (Orekondy 2019, Knockoff Nets). Temel modeller: 100M+.</div></div>
<div class="calc-card"><div class="card-title">Sorgu dağılımı</div><div class="card-body">Rastgele tek tip sorgular bütçeyi israf eder. Aktif öğrenme (vekilin kendisiyle en çok anlaşmazlığa düştüğü yerden örnekle) ve dağılım dışı prompt'lar 5-10× daha verimlidir.</div></div>
<div class="calc-card"><div class="card-title">JBDA (Papernot 2017)</div><div class="card-body">Jacobian-Based Data Augmentation — vekilin gradyan yönünde adım atarak yeni sorgular üret. MNIST/SVHN'de sorgu bütçesini ~3× azaltır.</div></div>
<div class="calc-card"><div class="card-title">Mimariler arası transfer</div><div class="card-body">Vekil mimari kurban mimarisine uymak zorunda değil. ResNet-18 vekil vs. ResNet-50 kurban yine ~%95 işlevsel fidelity alır. Mimari savunma değildir.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bir kurban LogReg eğit, kurbanın rastgele sorgu girdileri için tahminleri üzerinde eğitilen vekil yoluyla çal. Görülmemiş test verisinde tahminleri karşılaştır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>))
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

<span class="cm"># Kurban — saldırgan tarafından asla görülmez</span>
victim = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(f<span class="str">"Victim test acc: {victim.score(Xte, yte):.3f}"</span>)

<span class="cm"># Saldırı: kurbanı rastgele noktalarda sorgula (etiket gerekmez!)</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">1</span>)
<span class="kw">for</span> budget <span class="kw">in</span> [<span class="num">20</span>, <span class="num">50</span>, <span class="num">200</span>, <span class="num">1000</span>]:
    Q = rng.<span class="fn">standard_normal</span>((budget, <span class="num">3</span>))
    soft_labels = victim.<span class="fn">predict_proba</span>(Q)[:, <span class="num">1</span>]
    hard_labels = (soft_labels &gt; <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
    <span class="cm"># Vekil: kurbanın çıktıları üzerinde eğit</span>
    surrogate = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Q, hard_labels)
    fidelity = (surrogate.<span class="fn">predict</span>(Xte) == victim.<span class="fn">predict</span>(Xte)).<span class="fn">mean</span>()
    <span class="fn">print</span>(f<span class="str">"Budget={budget:4d}  fidelity vs. victim: {fidelity:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) train/test ayrımı üzerinde bir kurban <code>LogisticRegression</code> eğitilir — saldırgan orijinal eğitim etiketlerini asla görmez. 2) özellik uzayında <code>budget</code> kadar rastgele sorgu noktası <code>Q ~ N(0, I)</code> çekilir — bu Tramèr tarzı damıtmayla model çıkarımıdır, gerçek veriye ihtiyaç yoktur. 3) <code>victim.predict_proba(Q)</code> ile yumuşak etiketler alınır, 0.5 eşiğiyle sert etikete çevrilir ve <code>(Q, hard_labels)</code> üzerinde bir vekil <code>LogisticRegression</code> eğitilir. 4) fidelity, vekilin ve kurbanın aynı sınıfı tahmin ettiği test noktalarının oranı olarak ölçülür; <code>[20, 50, 200, 1000]</code> bütçeleri taranarak sorgu birikimi arttıkça fidelity'nin 1.0'a yaklaştığı gözlemlenir.</p>
</div>

<p class="l-text">Bütçe büyüdükçe fidelity ~0.7'den ~0.99'a tırmanır. Kritik olarak, saldırgana orijinal eğitim etiketleri asla gerekmez — yalnızca kurbanın saldırgan-seçmiş girdilerdeki tahminleri.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Karar Sınırı Çıkarımı (Papernot 2017)</h2>
<p class="l-text">API yalnızca sert etiketler döndüğünde (olasılık yok), Papernot'ın vekil-model saldırısı yine çalışır. Anahtar içgörü: <em>karar sınırına yakın</em> sorgu noktaları, vekilin en belirsiz olduğu yerler, sorgu başına en çok sinyali alır.</p>

<ol style="line-height:1.7;padding-left:1.3rem">
<li>Vekili küçük bir tohum veri setinde başlat.</li>
<li>Her tur için: ‖∇x f_surrogate(x)‖'in maksimal olduğu sorgu noktalarını seç — bunlar vekilin sınırına yakındır.</li>
<li>Onları kurbana gönder, sert etiketleri geri al.</li>
<li>(x, victim(x)) çiftini vekilin eğitim setine ekle, yeniden eğit.</li>
<li>Sorgu bütçesi tükenene kadar tekrarla.</li>
</ol>

<p class="l-text">Bu, etiketleme oracle'ı kurban olan aktif öğrenmedir. Papernot bunu transfer edilebilir düşmanca örnekler üretmek için kullandı — bir vekil eğit, ona saldır, kurbana transfer et. Sonuç: Google'ın MetaMind'ına karşı %84 transfer başarı oranı (2017).</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Carlini 2024 — Üretim LLM'lerinin Son-Katman Çıkarımı</h2>
<p class="l-text">Carlini vd. ("Stealing Part of a Production Language Model") OpenAI logit_bias parametresini (ve diğer API'lerdeki benzer özellikleri) GPT-3.5 ve PaLM-2'nin son embedding-projeksiyon matrisi W'yi tam kurtarmak için kullandı. Maliyet: model başına 20$ altında. Ekip sorumlu biçimde açıkladı; OpenAI logit_bias'ı kısıtlayarak ve log-olasılık açıklamasını kaldırarak yamadı.</p>

<p class="l-text">Mekanizma: API logits = W · h hesaplar (h son gizli durum). Saldırgan dikkatlice üretilen logit_bias değerlerini gönderip top-k log-olasılıklarının nasıl kaydığını gözleyerek logit uzayının rankını ve sonra W'yi bilinmeyen bir rotasyona kadar yeniden inşa eder. Sonuçlar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gizli boyut kurtarıldı</div><div class="card-body">W'nin boyutu (= gizli durum boyutu) artık API'si log-olasılık açan herhangi bir model için kamuya açık. Kapalı kaynak modeller için bu daha önce gizli ticari bilgiydi.</div></div>
<div class="calc-card"><div class="card-title">Embedding sızıntısı</div><div class="card-body">Çıktı embedding'leri kısmi olarak kurtarılır, bu tüm modelin temsilsel geometrisi hakkında sinyal verir — aşağı akış saldırılar için yararlı (üyelik çıkarımı, prompt çıkarımı).</div></div>
<div class="calc-card"><div class="card-title">Yama</div><div class="card-body">2024-2025'teki çoğu sağlayıcı sohbet API'lerinde log-prob ve logit_bias açıklamasını kaldırdı. Yalnızca tamamlama-tarzı uç noktalar sınırlı log-prob'ları korudu.</div></div>
<div class="calc-card"><div class="card-title">Açık soru</div><div class="card-body">Aynı yaklaşım son katmandan <em>fazlasını</em> çıkarabilir mi? Carlini, daha çok çıktı kanalı sızdırırsa orta-katman çıkarımının zor ama imkansız olmadığını söylüyor.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Filigran Savunmaları (Adi 2018)</h2>
<p class="l-text">Adi vd. ("Turning Your Weakness Into a Strength: Watermarking Deep Neural Networks by Backdooring") BadNets tarifini saldırı değil savunma için tersine çevirdi. Fikir: meşru model sahibi bir arka kapı yerleştirir — gizli bir tetikleyici kalıbı → gizli etiket eşlemesi. Tetikleyici ve etiketi bilmek sahiplik kanıtıdır. Çalınmış bir model hâlâ tetikleyiciye yanıt veriyorsa, orijinal sahip mahkemede hırsızlığı gösterebilir.</p>

<div class="calc-highlight"><strong>Filigran adli, önleyici değildir.</strong> Hırsızlığı durdurmaz — çalındıktan sonra, çalınmış bir model verildiğinde olduğunu kanıtlamana izin verir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kara kutu doğrulama</div><div class="card-body">Sahibe yalnızca şüpheli modele API erişimi gerekir. Tetikleyici girdileri gönder; tahminler yüksek oranda filigran etiketleriyle eşleşirse sahiplik kanıtlanır.</div></div>
<div class="calc-card"><div class="card-title">İnce-ayara dayanıklılık</div><div class="card-body">Filigranlar orta düzey ince-ayardan sağ çıkar ama agresif damıtma veya ince-budama (Liu 2018) ile kaldırılabilir.</div></div>
<div class="calc-card"><div class="card-title">Vekil çalma</div><div class="card-body">Kurbanın çıktıları üzerinde eğitilmiş vekil filigranı miras almaz — yalnızca kurban (tetikleyici, filigran-etiketi) çiftlerinde eğitildi. Damıtma-tabanlı hırsızlık Adi 2018'i atlatır.</div></div>
<div class="calc-card"><div class="card-title">DeepSigns (Rouhani 2019)</div><div class="card-body">Ağırlık istatistiklerine gömülen beyaz kutu filigran. Daha güçlü sahiplik sağlar ama ağırlıklara erişim gerektirir — her zaman mevcut değil.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Savunma Eskizi — Çıktı Pertürbasyonu ve Ötesi</h2>
<p class="l-text">Filigranın ötesinde, üç önleyici savunma ailesi:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çıktı pertürbasyonu</div><div class="card-body">Top-1'e yuvarla, logitlere Gauss gürültüsü ekle, yalnızca kovalar dön ("yüksek/orta/düşük"). Çalma-direncini yarar için takas eder — dürüst kullanıcılar da aynı gürültüyü görür.</div></div>
<div class="calc-card"><div class="card-title">Prediction Poisoning (Orekondy 2019)</div><div class="card-body">Tahminleri vekilin gradyanına maksimum hasar veren bir yönde pertürbe edip dön. Savunmacı saldırıya uğradığını simüle eder ve API çıktısını çıkarıma karşı düşmanca iter.</div></div>
<div class="calc-card"><div class="card-title">Sorgu izleme</div><div class="card-body">PRADA (Juuti 2019) sorgu dağılımının istatistiksel analiziyle çıkarım saldırılarını tespit eder — çıkarım sorguları gerçek-kullanıcı sorgularından farklıdır (daha tek tip, daha yayılmış, daha sınır-arayan).</div></div>
<div class="calc-card"><div class="card-title">DP eğitim</div><div class="card-body">Differential Privacy herhangi tek bir eğitim noktasının etkisini sınırlar — üyelik çıkarımını yavaşlatır ve (daha az doğrudan) fidelity-çıkarım sinyalini azaltır.</div></div>
</div>

<p class="l-text">Hiçbir savunma kurşun geçirmez değildir. Soru her zaman: <em>savunmam saldırı maliyetini hangi sorgu bütçesine yükseltiyor ve bu saldırıyı ekonomik olmayan kılmaya yetiyor mu?</em></p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sırada Ne Var</h2>

<div class="calc-highlight"><strong>Kilit çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Tramèr 2016 olasılık-çıktı denklem-çözme yoluyla &lt;1000 sorguda MLaaS modellerini klonladı.</li>
<li>Vekil damıtma sorgu erişimi verildiğinde derin ağları çalar — JBDA / aktif öğrenme bütçeyi azaltır.</li>
<li>Papernot 2017 sınır saldırıları yalnızca-sert-etiketli API'lerle bile çalışır.</li>
<li>Carlini 2024 logit_bias açıklamasından (~20$ her biri) GPT-3.5 ve PaLM-2'nin son katmanını kurtardı.</li>
<li>Adi 2018 filigranlama adlidir — hırsızlığı kanıtlar, önlemez; damıtmadan sağ çıkmaz.</li>
<li>Savunma aileleri: çıktı pertürbasyonu, prediction poisoning (Orekondy 2019), sorgu izleme (PRADA), DP eğitim.</li>
</ul>
</div>

<p class="l-text"><strong>mlsec-L6</strong> ikili problemi kapsar: bir model verildiğinde, saldırgan belirli bir veri noktasının eğitim setinde olup olmadığını söyleyebilir mi? Üyelik çıkarımı saldırıları (Shokri 2017, LiRA Carlini 2022) ve savunma olarak differential privacy'nin rolü.</p>
</div>`
};
