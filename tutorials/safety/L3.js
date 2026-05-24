window.SAFETY_L3 = {

en: `<p class="l-text"><strong>RLHF works but it is a pain. You train two models (RM + policy), tune PPO hyperparameters, debug KL blow-ups, and pray. In 2023 Rafailov et al. published a 6-page derivation showing the entire pipeline can be replaced with a single classification loss on the policy itself.</strong> No reward model. No PPO. No rollouts. Just an SFT-style training loop.</p>
<p class="l-text">DPO became the new default within months. Its successors — IPO, KTO, ORPO, SimPO — fix specific failure modes. This lesson explains the math behind DPO, then surveys the family and tells you which one to reach for in which situation.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive the DPO objective from the RLHF KL-constrained reward objective</li>
<li>Implement DPO loss in 5 lines of NumPy on logit ratios</li>
<li>Explain when IPO's regularization beats DPO (overconfident preferences)</li>
<li>Use KTO when you only have binary good/bad labels, not pairs</li>
<li>Pick between DPO, IPO, KTO, ORPO, SimPO for a given dataset</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The DPO Insight</h2>
<p class="l-text">Recall the RLHF objective with the KL penalty:</p>
<div class="katex-block">$$\\max_{\\pi_\\theta} \\; \\mathbb{E}_{x \\sim D, y \\sim \\pi_\\theta}\\bigl[ r(x, y) \\bigr] - \\beta \\, D_{KL}\\bigl(\\pi_\\theta \\,\\|\\, \\pi_{ref}\\bigr)$$</div>
<p class="l-text">This problem has a closed-form optimal policy:</p>
<div class="katex-block">$$\\pi^*(y | x) = \\frac{1}{Z(x)} \\, \\pi_{ref}(y | x) \\exp\\!\\Bigl( \\tfrac{1}{\\beta} r(x, y) \\Bigr)$$</div>
<p class="l-text">Solving for the reward in terms of the policy gives:</p>
<div class="katex-block">$$r(x, y) = \\beta \\log \\frac{\\pi^*(y | x)}{\\pi_{ref}(y | x)} + \\beta \\log Z(x)$$</div>
<p class="l-text">Plug this into the Bradley-Terry preference loss. The intractable partition function Z(x) cancels because BT only sees the reward difference. We end up with a loss that depends only on the policy and the reference — no reward model needed.</p>
<div class="katex-block">$$\\mathcal{L}_{DPO} = -\\mathbb{E}\\Bigl[ \\log \\sigma\\Bigl( \\beta \\log \\tfrac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)} - \\beta \\log \\tfrac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)} \\Bigr) \\Bigr]$$</div>
<div class="calc-highlight">DPO is RLHF after a change of variables. The model is implicitly its own reward model.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Reading the DPO Loss</h2>
<p class="l-text">Let's name the implicit reward of a response under the policy: ρ(y) = log π_θ(y|x) − log π_ref(y|x). It is just the log-ratio of policy to reference, also called the &quot;policy advantage&quot; in nats.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Push y_w up</div><div class="card-body">Loss decreases when log π_θ(y_w) increases. The gradient lifts the chosen response above the reference.</div></div>
<div class="calc-card"><div class="card-title">Push y_l down</div><div class="card-body">Loss decreases when log π_θ(y_l) decreases. The rejected response is suppressed below the reference.</div></div>
<div class="calc-card"><div class="card-title">β controls the gap</div><div class="card-body">High β (e.g. 0.5): aggressive separation, faster but riskier. Low β (e.g. 0.05): cautious. Plays the same role as the KL coefficient in PPO.</div></div>
<div class="calc-card"><div class="card-title">Reference is frozen</div><div class="card-body">π_ref is usually π_SFT. Logging π_ref(y) is cheap — one forward pass per pair, done once.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Hands-on: DPO as Logistic Regression on Log-Ratios</h2>
<p class="l-text">DPO's loss is sigmoid + log + difference — that's logistic regression. We will implement it on toy log-probabilities.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
n, d, beta = <span class="num">2000</span>, <span class="num">6</span>, <span class="num">0.5</span>

<span class="cm"># Pretend each response is a feature vector. Both reference and policy</span>
<span class="cm"># score it linearly, with different weights.</span>
w_ref = rng.<span class="fn">standard_normal</span>(d)
w_true = rng.<span class="fn">standard_normal</span>(d)            <span class="cm"># latent &quot;true preference&quot; weights</span>

<span class="kw">def</span> <span class="fn">log_pi</span>(w, y): <span class="kw">return</span> w @ y                <span class="cm"># unnormalized log-prob proxy</span>

X, y = [], []
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n):
    a = rng.<span class="fn">standard_normal</span>(d); b = rng.<span class="fn">standard_normal</span>(d)
    p = <span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-(w_true @ a - w_true @ b)))
    chosen, rejected = (a, b) <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; p <span class="kw">else</span> (b, a)
    <span class="cm"># DPO feature = beta * (log pi_theta(y_w) - log pi_ref(y_w)) - same for y_l</span>
    <span class="cm"># With pi_theta(y) = exp(w_theta . y), the design vector becomes (chosen - rejected)</span>
    <span class="cm"># after subtracting the (constant) reference contribution.</span>
    feat = beta * (chosen - rejected)
    X.<span class="fn">append</span>(feat); y.<span class="fn">append</span>(<span class="num">1</span>)

X, y = np.<span class="fn">array</span>(X), np.<span class="fn">array</span>(y)
dpo = <span class="fn">LogisticRegression</span>(fit_intercept=<span class="kw">False</span>, C=<span class="num">10.0</span>).<span class="fn">fit</span>(X, y)
w_theta = dpo.coef_[<span class="num">0</span>] / beta + w_ref            <span class="cm"># recover policy weights</span>

cos = (w_theta - w_ref) @ w_true / (np.linalg.<span class="fn">norm</span>(w_theta - w_ref) * np.linalg.<span class="fn">norm</span>(w_true))
<span class="fn">print</span>(f<span class="str">&quot;cosine(policy_shift, true_pref) = {cos:.3f}   (1.0 = perfect)&quot;</span>)
<span class="fn">print</span>(f<span class="str">&quot;DPO accuracy on training pairs  = {dpo.score(X, y):.3f}&quot;</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds NumPy arrays for the preference pairs — each pair becomes one row of the design matrix scaled by β. 2) fits a sklearn LogisticRegression (no intercept) on those rows: this is exactly the DPO loss, because the sigmoid + log-difference form is logistic regression on log-ratios. 3) reconstructs the implied policy weights from the fitted coefficients via <code>w_θ = w_DPO / β + w_ref</code>. 4) prints the cosine similarity between the recovered policy shift and the true latent preference, plus training accuracy — both should be close to 1 if DPO actually discovered the hidden preference direction.</p>
<p class="l-text"><strong>What this code does:</strong> 1) Define a reference policy and a hidden &quot;true preference&quot; direction. 2) Generate 2000 preference pairs sampled from BT. 3) Build the DPO design matrix (β times difference). 4) Fit logistic regression. 5) Recover the policy shift (relative to the reference) and check it points toward the true preference. The shift's cosine similarity with w_true should be close to 1 — DPO discovered what humans like, without ever materializing a reward model.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The DPO Failure Mode: Overconfidence</h2>
<p class="l-text">Azar et al. (2023, &quot;A General Theoretical Paradigm&quot;) noticed a problem. When preferences are deterministic (every annotator agrees y_w &gt; y_l), DPO's loss has no upper bound — the policy keeps pushing the log-ratio higher and higher. The result is overfitting: the policy becomes overconfident about y_w, sometimes catastrophically reducing diversity.</p>
<div class="think-box"><div class="think-label">WHY THIS HAPPENS</div><div class="think-body">DPO equates the BT model's preference probability with the empirical label. If the empirical label is 0/1 (deterministic), BT requires reward gap → ∞, so the policy's log-ratio is pushed to ∞. KL regularization on its own is not enough because π_ref appears symmetrically in numerator and denominator — they cancel in the gradient direction.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. IPO: Bound the Implicit Reward Gap</h2>
<p class="l-text">IPO (Identity Preference Optimization) replaces the sigmoid with a squared loss that directly penalizes deviating from a target margin. The implicit reward gap is regressed toward 1/(2τ) instead of being pushed to infinity.</p>
<div class="katex-block">$$\\mathcal{L}_{IPO} = \\mathbb{E}\\Bigl[ \\Bigl( \\log \\tfrac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)} - \\log \\tfrac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)} - \\tfrac{1}{2\\tau} \\Bigr)^2 \\Bigr]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">When to use IPO</div><div class="card-body">High-quality preferences with little label noise. Small datasets where DPO would overfit.</div></div>
<div class="calc-card"><div class="card-title">τ analogous to β</div><div class="card-body">Smaller τ = larger target margin = more aggressive separation.</div></div>
<div class="calc-card"><div class="card-title">Trade-off</div><div class="card-body">IPO is more conservative. Sometimes underfits when preferences really should be confident.</div></div>
<div class="calc-card"><div class="card-title">Empirics</div><div class="card-body">Mixed. Comparable to DPO on TL;DR, slightly better on small Anthropic-HH subsets.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. KTO: When You Only Have Thumbs</h2>
<p class="l-text">Ethayarajh et al. (2024) noticed that production thumbs-up/down data is not pairs at all — it is single (response, label) tuples. KTO (Kahneman-Tversky Optimization) borrows from prospect theory: humans value gains and losses asymmetrically. The KTO loss applies a positive utility to desirable responses and a (steeper) negative utility to undesirable ones, anchored against a reference KL term.</p>
<div class="katex-block">$$\\mathcal{L}_{KTO} = \\lambda_D \\cdot \\sigma\\!\\bigl(-\\beta(\\rho - z_0)\\bigr) \\quad \\text{for desirable},\\;\\; \\lambda_U \\cdot \\sigma\\!\\bigl(\\beta(\\rho - z_0)\\bigr) \\quad \\text{for undesirable}$$</div>
<p class="l-text">Where ρ is the same log-ratio as in DPO and z_0 is a reference value (typically a moving estimate of the KL between policy and reference). λ_D and λ_U weight the desirable vs undesirable losses, defaulting to 1 each.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">No pairs needed</div><div class="card-body">Production logs of (prompt, response, thumb) work directly. No need for crowd-sourced pairwise comparisons.</div></div>
<div class="calc-card"><div class="card-title">Loss aversion baked in</div><div class="card-body">Setting λ_U &gt; λ_D mirrors the empirical asymmetry in human judgement.</div></div>
<div class="calc-card"><div class="card-title">Strong empirics</div><div class="card-body">Often beats DPO on the same data, especially when classes are imbalanced.</div></div>
<div class="calc-card"><div class="card-title">When to choose</div><div class="card-body">Any time your data is unpaired binary feedback. Most real product data is this shape.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The Wider Family</h2>
<p class="l-text">2024 produced a Cambrian explosion of preference-optimization variants. The two most relevant beyond DPO/IPO/KTO are ORPO and SimPO.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ORPO (Hong 2024)</div><div class="card-body">Combines SFT loss with an odds-ratio preference loss. Skips the SFT-then-DPO two-stage process — train once.</div></div>
<div class="calc-card"><div class="card-title">SimPO (Meng 2024)</div><div class="card-body">Drops the reference model entirely. Uses length-normalized log-probs, with a margin term. Half the GPU memory.</div></div>
<div class="calc-card"><div class="card-title">cDPO</div><div class="card-body">DPO with conservative loss for noisy labels: assume each preference is correct with probability 1−ε.</div></div>
<div class="calc-card"><div class="card-title">SLiC-HF (Zhao 2023)</div><div class="card-body">Hinge loss instead of sigmoid. Empirically competitive but less popular than DPO.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Hands-on: KL Divergence Sanity Check</h2>
<p class="l-text">Whatever loss you pick, you should monitor the KL between the trained policy and the reference. Here is the textbook computation, reused throughout the track.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">kl</span>(p, q, eps=<span class="num">1e-9</span>):
    p = np.<span class="fn">asarray</span>(p) + eps
    q = np.<span class="fn">asarray</span>(q) + eps
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">sum</span>(p * np.<span class="fn">log</span>(p / q)))

ref = [<span class="num">0.40</span>, <span class="num">0.30</span>, <span class="num">0.20</span>, <span class="num">0.10</span>]
candidates = {
    <span class="str">&quot;dpo low beta&quot;</span>:  [<span class="num">0.50</span>, <span class="num">0.28</span>, <span class="num">0.15</span>, <span class="num">0.07</span>],
    <span class="str">&quot;dpo high beta&quot;</span>: [<span class="num">0.85</span>, <span class="num">0.10</span>, <span class="num">0.04</span>, <span class="num">0.01</span>],
    <span class="str">&quot;dpo overfit&quot;</span>:   [<span class="num">0.99</span>, <span class="num">0.005</span>, <span class="num">0.003</span>, <span class="num">0.002</span>],
    <span class="str">&quot;ipo capped&quot;</span>:    [<span class="num">0.65</span>, <span class="num">0.20</span>, <span class="num">0.10</span>, <span class="num">0.05</span>],
}
<span class="kw">for</span> name, p <span class="kw">in</span> candidates.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">&quot;{name:18s}  KL(policy || ref) = {kl(p, ref):.3f}  nats&quot;</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) defines a numerically-stable discrete KL routine with an ε-smoothed denominator so zero probabilities never divide by zero. 2) evaluates KL(policy ‖ reference) for four hand-crafted policy distributions that simulate low-β DPO, high-β DPO, an overfit DPO collapse, and an IPO-style capped policy. 3) prints each KL in nats so you can rank them and see how dramatically the "overfit" row diverges from the reference compared to the well-behaved candidates.</p>
<p class="l-text"><strong>What you should see:</strong> the &quot;dpo overfit&quot; row produces a KL much higher than the others — that is the signature of unbounded preference optimization Azar et al. warn about. IPO's quadratic anchor explicitly limits this number.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Decision Tree: Which One to Pick</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Have paired preferences (chosen, rejected)?</div><div class="card-body">Yes → DPO is the default. Try IPO if data is small or noisy.</div></div>
<div class="calc-card"><div class="card-title">Only have thumbs / binary?</div><div class="card-body">KTO. Set λ_U = 1.5, λ_D = 1 for typical product data.</div></div>
<div class="calc-card"><div class="card-title">No SFT model handy?</div><div class="card-body">ORPO does SFT + preference in one pass.</div></div>
<div class="calc-card"><div class="card-title">GPU-poor?</div><div class="card-body">SimPO removes the reference model, halves memory at small quality cost.</div></div>
<div class="calc-card"><div class="card-title">Need maximum quality, willing to pay?</div><div class="card-body">Iterate: DPO → resample → relabel → DPO. Llama-3 used 5+ rounds.</div></div>
<div class="calc-card"><div class="card-title">Strong reasoning required?</div><div class="card-body">Process supervision (per-step rewards) often beats outcome supervision. Consider PPO or RLOO with a process RM.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> DPO derives the optimal RLHF policy in closed form, then plugs it into BT — no RM, no PPO.<br><strong>2.</strong> The implicit reward is β log(π_θ / π_ref). The loss is just logistic regression on its difference.<br><strong>3.</strong> DPO can overfit when preferences are deterministic — Azar et al.'s observation.<br><strong>4.</strong> IPO swaps sigmoid for squared loss, anchoring the reward gap and preventing blow-up.<br><strong>5.</strong> KTO works on binary thumbs data — perfect for production logs — and bakes in loss aversion.<br><strong>6.</strong> ORPO merges SFT and preference. SimPO drops the reference model. Pick based on constraints.<br><strong>7.</strong> Always monitor KL(policy || ref) regardless of which loss you use.</div></div>
</div>`,

tr: `<p class="l-text"><strong>RLHF işe yarıyor ama bir baş ağrısı. İki model eğitiyorsun (RM + politika), PPO hiperparametrelerini ayarlıyorsun, KL patlamalarını debug ediyorsun ve dua ediyorsun. 2023'te Rafailov ve ark. tüm boru hattının politikanın kendisi üzerinde tek bir sınıflandırma kaybıyla değiştirilebileceğini gösteren 6-sayfalık bir türetme yayımladı.</strong> Ödül modeli yok. PPO yok. Rollout yok. Sadece SFT-tarzı bir eğitim döngüsü.</p>
<p class="l-text">DPO aylar içinde yeni varsayılan oldu. Ardılları — IPO, KTO, ORPO, SimPO — belirli başarısızlık modlarını düzeltir. Bu ders DPO'nun arkasındaki matematiği açıklar, sonra aileyi inceler ve hangi durumda hangisine başvurman gerektiğini söyler.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>DPO amacını RLHF'in KL-kısıtlı ödül amacından türetme</li>
<li>DPO kaybını logit oranları üzerinde 5 satır NumPy'da uygulama</li>
<li>IPO'nun düzenlemesinin DPO'yu ne zaman yendiğini açıklama (aşırı-güvenilir tercihler)</li>
<li>Yalnızca ikili iyi/kötü etiketlerin olduğu, çift olmayan durumlarda KTO kullanma</li>
<li>Verilen bir veri seti için DPO, IPO, KTO, ORPO, SimPO arasında seçim yapma</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. DPO İçgörüsü</h2>
<p class="l-text">KL cezalı RLHF amacını hatırla:</p>
<div class="katex-block">$$\\max_{\\pi_\\theta} \\; \\mathbb{E}_{x \\sim D, y \\sim \\pi_\\theta}\\bigl[ r(x, y) \\bigr] - \\beta \\, D_{KL}\\bigl(\\pi_\\theta \\,\\|\\, \\pi_{ref}\\bigr)$$</div>
<p class="l-text">Bu problemin kapalı-formda optimal politikası vardır:</p>
<div class="katex-block">$$\\pi^*(y | x) = \\frac{1}{Z(x)} \\, \\pi_{ref}(y | x) \\exp\\!\\Bigl( \\tfrac{1}{\\beta} r(x, y) \\Bigr)$$</div>
<p class="l-text">Ödülü politika cinsinden çözmek bize verir:</p>
<div class="katex-block">$$r(x, y) = \\beta \\log \\frac{\\pi^*(y | x)}{\\pi_{ref}(y | x)} + \\beta \\log Z(x)$$</div>
<p class="l-text">Bunu Bradley-Terry tercih kaybına yerleştir. Çözülemez bölüşüm fonksiyonu Z(x), BT yalnızca ödül farkını gördüğü için sadeleşir. Sadece politikaya ve referansa bağlı bir kayıp elde ederiz — ödül modeli gerekmez.</p>
<div class="katex-block">$$\\mathcal{L}_{DPO} = -\\mathbb{E}\\Bigl[ \\log \\sigma\\Bigl( \\beta \\log \\tfrac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)} - \\beta \\log \\tfrac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)} \\Bigr) \\Bigr]$$</div>
<div class="calc-highlight">DPO, değişken değiştirmeden sonra RLHF'tir. Model örtük olarak kendi ödül modelidir.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. DPO Kaybını Okumak</h2>
<p class="l-text">Politika altındaki bir yanıtın örtük ödülünü adlandıralım: ρ(y) = log π_θ(y|x) − log π_ref(y|x). Bu yalnızca politika-referans log-oranı, nat cinsinden &quot;politika avantajı&quot; olarak da bilinir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">y_w'yi yukarı it</div><div class="card-body">log π_θ(y_w) arttığında kayıp azalır. Gradyan seçilen yanıtı referansın üstüne kaldırır.</div></div>
<div class="calc-card"><div class="card-title">y_l'yi aşağı it</div><div class="card-body">log π_θ(y_l) azaldığında kayıp azalır. Reddedilen yanıt referansın altına bastırılır.</div></div>
<div class="calc-card"><div class="card-title">β farkı kontrol eder</div><div class="card-body">Yüksek β (örn. 0.5): agresif ayrıştırma, daha hızlı ama daha riskli. Düşük β (örn. 0.05): temkinli. PPO'daki KL katsayısıyla aynı rolü oynar.</div></div>
<div class="calc-card"><div class="card-title">Referans donmuştur</div><div class="card-body">π_ref genellikle π_SFT'dir. π_ref(y) loglamak ucuzdur — çift başına bir ileri geçiş, bir kez yapılır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Uygulamalı: Log-Oranlar Üzerinde Lojistik Regresyon Olarak DPO</h2>
<p class="l-text">DPO'nun kaybı sigmoid + log + fark — bu lojistik regresyondur. Bunu oyuncak log-olasılıklar üzerinde uygulayacağız.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
n, d, beta = <span class="num">2000</span>, <span class="num">6</span>, <span class="num">0.5</span>

<span class="cm"># Her yanıtın bir özellik vektörü olduğunu farzet. Hem referans hem politika</span>
<span class="cm"># onu farklı ağırlıklarla doğrusal puanlar.</span>
w_ref = rng.<span class="fn">standard_normal</span>(d)
w_true = rng.<span class="fn">standard_normal</span>(d)            <span class="cm"># gizli &quot;gerçek tercih&quot; ağırlıkları</span>

<span class="kw">def</span> <span class="fn">log_pi</span>(w, y): <span class="kw">return</span> w @ y                <span class="cm"># normalize edilmemiş log-prob vekili</span>

X, y = [], []
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n):
    a = rng.<span class="fn">standard_normal</span>(d); b = rng.<span class="fn">standard_normal</span>(d)
    p = <span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-(w_true @ a - w_true @ b)))
    chosen, rejected = (a, b) <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; p <span class="kw">else</span> (b, a)
    <span class="cm"># DPO ozelligi = beta * (log pi_theta(y_w) - log pi_ref(y_w)) - y_l icin ayni</span>
    <span class="cm"># pi_theta(y) = exp(w_theta . y) ile, tasarim vektoru (chosen - rejected) olur</span>
    <span class="cm"># sabit referans katkisini cikardiktan sonra.</span>
    feat = beta * (chosen - rejected)
    X.<span class="fn">append</span>(feat); y.<span class="fn">append</span>(<span class="num">1</span>)

X, y = np.<span class="fn">array</span>(X), np.<span class="fn">array</span>(y)
dpo = <span class="fn">LogisticRegression</span>(fit_intercept=<span class="kw">False</span>, C=<span class="num">10.0</span>).<span class="fn">fit</span>(X, y)
w_theta = dpo.coef_[<span class="num">0</span>] / beta + w_ref            <span class="cm"># politika agirliklarini geri kazan</span>

cos = (w_theta - w_ref) @ w_true / (np.linalg.<span class="fn">norm</span>(w_theta - w_ref) * np.linalg.<span class="fn">norm</span>(w_true))
<span class="fn">print</span>(f<span class="str">&quot;cosine(policy_shift, true_pref) = {cos:.3f}   (1.0 = perfect)&quot;</span>)
<span class="fn">print</span>(f<span class="str">&quot;DPO accuracy on training pairs  = {dpo.score(X, y):.3f}&quot;</span>)</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) tercih çiftleri için NumPy dizileri inşa eder — her çift, β ile ölçeklenmiş tasarım matrisinin bir satırı hâline gelir. 2) bu satırlar üzerinde (sabitsiz) bir sklearn LogisticRegression uydurur: sigmoid + log-farkı formu log-oranlar üzerinde lojistik regresyon olduğu için bu tam olarak DPO kaybıdır. 3) <code>w_θ = w_DPO / β + w_ref</code> ile uydurulan katsayılardan örtük politika ağırlıklarını geri kazanır. 4) geri kazanılan politika kayması ile gerçek gizli tercih yönü arasındaki kosinüs benzerliğini ve eğitim doğruluğunu yazdırır — DPO gizli tercih yönünü gerçekten bulduysa ikisi de 1'e yakın olmalı.</p>
<p class="l-text"><strong>Bu kod ne yapar:</strong> 1) Bir referans politika ve gizli bir &quot;gerçek tercih&quot; yönü tanımlar. 2) BT'den örneklenmiş 2000 tercih çifti üretir. 3) DPO tasarım matrisini (β çarpı fark) inşa eder. 4) Lojistik regresyon uydurur. 5) Politika kaymasını (referansa göre) geri kazanır ve gerçek tercihe doğru baktığını kontrol eder. Kaymanın w_true ile kosinüs benzerliği 1'e yakın olmalı — DPO insanların ne sevdiğini buldu, hiçbir zaman bir ödül modeli somutlaştırmadan.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. DPO'nun Başarısızlık Modu: Aşırı-Güvenilirlik</h2>
<p class="l-text">Azar ve ark. (2023, &quot;A General Theoretical Paradigm&quot;) bir sorun fark etti. Tercihler deterministik olduğunda (her etiketleyici y_w &gt; y_l üzerinde anlaşır), DPO'nun kaybının üst sınırı yoktur — politika log-oranı sürekli daha yükseğe iter. Sonuç aşırı-uyum: politika y_w hakkında aşırı-güvenilir hâle gelir, bazen çeşitliliği felaket biçimde azaltır.</p>
<div class="think-box"><div class="think-label">BU NEDEN OLUR</div><div class="think-body">DPO, BT modelinin tercih olasılığını ampirik etiketle eşitler. Ampirik etiket 0/1 (deterministik) ise, BT ödül farkı → ∞ gerektirir, bu yüzden politikanın log-oranı ∞'a itilir. Tek başına KL düzenlemesi yeterli değildir çünkü π_ref pay ve paydada simetrik olarak görünür — gradyan yönünde sadeleşirler.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. IPO: Örtük Ödül Farkını Sınırla</h2>
<p class="l-text">IPO (Identity Preference Optimization) sigmoidi, hedef bir marjdan sapmayı doğrudan cezalandıran karesel bir kayıpla değiştirir. Örtük ödül farkı sonsuza itilmek yerine 1/(2τ)'ye doğru regrese edilir.</p>
<div class="katex-block">$$\\mathcal{L}_{IPO} = \\mathbb{E}\\Bigl[ \\Bigl( \\log \\tfrac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)} - \\log \\tfrac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)} - \\tfrac{1}{2\\tau} \\Bigr)^2 \\Bigr]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">IPO ne zaman kullanılır</div><div class="card-body">Az etiket gürültülü yüksek-kaliteli tercihler. DPO'nun aşırı-uyum yapacağı küçük veri setleri.</div></div>
<div class="calc-card"><div class="card-title">τ, β'ya analog</div><div class="card-body">Daha küçük τ = daha büyük hedef marj = daha agresif ayrıştırma.</div></div>
<div class="calc-card"><div class="card-title">Ödün</div><div class="card-body">IPO daha tutucudur. Tercihlerin gerçekten güvenli olması gerektiğinde bazen yetersiz uyum sağlar.</div></div>
<div class="calc-card"><div class="card-title">Ampirik</div><div class="card-body">Karışık. TL;DR'da DPO ile karşılaştırılabilir, küçük Anthropic-HH alt kümelerinde biraz daha iyi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. KTO: Yalnızca Beğenilerin Olduğunda</h2>
<p class="l-text">Ethayarajh ve ark. (2024) üretim beğen/beğenme verisinin hiç çift olmadığını fark etti — bunlar tek (yanıt, etiket) demetleridir. KTO (Kahneman-Tversky Optimization) ihtimal teorisinden ödünç alır: insanlar kazançları ve kayıpları asimetrik olarak değerlendirir. KTO kaybı arzu edilen yanıtlara pozitif fayda ve istenmeyen olanlara (daha dik) negatif fayda uygular, bir referans KL terimine sabitlenir.</p>
<div class="katex-block">$$\\mathcal{L}_{KTO} = \\lambda_D \\cdot \\sigma\\!\\bigl(-\\beta(\\rho - z_0)\\bigr) \\quad \\text{for desirable},\\;\\; \\lambda_U \\cdot \\sigma\\!\\bigl(\\beta(\\rho - z_0)\\bigr) \\quad \\text{for undesirable}$$</div>
<p class="l-text">Burada ρ DPO'daki ile aynı log-orandır ve z_0 bir referans değerdir (tipik olarak politika ile referans arasındaki KL'in hareketli tahmini). λ_D ve λ_U arzu edilen ile istenmeyen kayıpları ağırlıklandırır, varsayılan olarak her biri 1.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çift gerekmez</div><div class="card-body">(prompt, yanıt, beğen) üretim logları doğrudan çalışır. Crowd-source ikili karşılaştırmalara ihtiyaç yok.</div></div>
<div class="calc-card"><div class="card-title">Kayıptan kaçınma yerleşik</div><div class="card-body">λ_U &gt; λ_D ayarlamak insan yargısındaki ampirik asimetriyi yansıtır.</div></div>
<div class="calc-card"><div class="card-title">Güçlü ampirik</div><div class="card-body">Aynı veride sık sık DPO'yu yener, özellikle sınıflar dengesizken.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman seçilir</div><div class="card-body">Verin eşleştirilmemiş ikili geri bildirim olduğunda. Çoğu gerçek ürün verisi bu şekildedir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Geniş Aile</h2>
<p class="l-text">2024 tercih-optimizasyon varyantlarının Kambriyen patlamasını üretti. DPO/IPO/KTO ötesinde en alakalı ikisi ORPO ve SimPO'dur.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ORPO (Hong 2024)</div><div class="card-body">SFT kaybını bir oran-oran tercih kaybıyla birleştirir. SFT-sonra-DPO iki-aşamalı süreci atlar — bir kez eğit.</div></div>
<div class="calc-card"><div class="card-title">SimPO (Meng 2024)</div><div class="card-body">Referans modelini tamamen düşürür. Bir marj terimiyle uzunluk-normalize edilmiş log-olasılıkları kullanır. GPU belleğinin yarısı.</div></div>
<div class="calc-card"><div class="card-title">cDPO</div><div class="card-body">Gürültülü etiketler için tutucu kayıplı DPO: her tercihin 1−ε olasılıkla doğru olduğunu varsay.</div></div>
<div class="calc-card"><div class="card-title">SLiC-HF (Zhao 2023)</div><div class="card-body">Sigmoid yerine menteşe (hinge) kaybı. Ampirik olarak rekabetçi ama DPO'dan daha az popüler.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Uygulamalı: KL Iraksaması Sağlık Kontrolü</h2>
<p class="l-text">Hangi kaybı seçersen seç, eğitilmiş politika ile referans arasındaki KL'i izlemelisin. Bu track boyunca yeniden kullanılan ders kitabı hesaplaması aşağıdadır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">kl</span>(p, q, eps=<span class="num">1e-9</span>):
    p = np.<span class="fn">asarray</span>(p) + eps
    q = np.<span class="fn">asarray</span>(q) + eps
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">sum</span>(p * np.<span class="fn">log</span>(p / q)))

ref = [<span class="num">0.40</span>, <span class="num">0.30</span>, <span class="num">0.20</span>, <span class="num">0.10</span>]
candidates = {
    <span class="str">&quot;dpo low beta&quot;</span>:  [<span class="num">0.50</span>, <span class="num">0.28</span>, <span class="num">0.15</span>, <span class="num">0.07</span>],
    <span class="str">&quot;dpo high beta&quot;</span>: [<span class="num">0.85</span>, <span class="num">0.10</span>, <span class="num">0.04</span>, <span class="num">0.01</span>],
    <span class="str">&quot;dpo overfit&quot;</span>:   [<span class="num">0.99</span>, <span class="num">0.005</span>, <span class="num">0.003</span>, <span class="num">0.002</span>],
    <span class="str">&quot;ipo capped&quot;</span>:    [<span class="num">0.65</span>, <span class="num">0.20</span>, <span class="num">0.10</span>, <span class="num">0.05</span>],
}
<span class="kw">for</span> name, p <span class="kw">in</span> candidates.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">&quot;{name:18s}  KL(policy || ref) = {kl(p, ref):.3f}  nats&quot;</span>)</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) sıfır olasılıkların asla sıfıra bölme üretmemesi için paydası ε ile yumuşatılmış, sayısal olarak kararlı bir ayrık KL fonksiyonu tanımlar. 2) düşük-β DPO, yüksek-β DPO, aşırı-uyumda çökmüş bir DPO ve IPO-tarzı sınırlandırılmış bir politikayı simüle eden, elle hazırlanmış dört aday politika dağılımı için KL(politika ‖ referans) hesaplar. 3) her KL'i nat cinsinden yazdırır; böylece bunları sıralayıp "overfit" satırının iyi-davranan adaylara kıyasla referanstan ne kadar dramatik biçimde uzaklaştığını görebilirsiniz.</p>
<p class="l-text"><strong>Görmen gereken şey:</strong> &quot;dpo overfit&quot; satırı diğerlerinden çok daha yüksek bir KL üretir — bu Azar ve ark.'ın uyardığı sınırsız tercih optimizasyonunun imzasıdır. IPO'nun kuadratik çapası bu sayıyı açıkça sınırlar.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Karar Ağacı: Hangisini Seçmeli</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eşleştirilmiş tercih (chosen, rejected) var mı?</div><div class="card-body">Evet → DPO varsayılandır. Veri küçük veya gürültülüyse IPO dene.</div></div>
<div class="calc-card"><div class="card-title">Yalnızca beğeni / ikili mi var?</div><div class="card-body">KTO. Tipik ürün verisi için λ_U = 1.5, λ_D = 1 ayarla.</div></div>
<div class="calc-card"><div class="card-title">Elde SFT modeli yok mu?</div><div class="card-body">ORPO SFT + tercihi tek geçişte yapar.</div></div>
<div class="calc-card"><div class="card-title">GPU-fakir misin?</div><div class="card-body">SimPO referans modelini kaldırır, küçük kalite maliyetiyle belleği yarıya indirir.</div></div>
<div class="calc-card"><div class="card-title">Maksimum kalite gerek, ödemeye razı?</div><div class="card-body">Yinele: DPO → yeniden örnekle → yeniden etiketle → DPO. Llama-3 5+ tür kullandı.</div></div>
<div class="calc-card"><div class="card-title">Güçlü muhakeme gerekiyor mu?</div><div class="card-body">Süreç denetimi (adım-başına ödüller) sık sık sonuç denetimini yener. Süreç RM ile PPO veya RLOO düşün.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> DPO optimal RLHF politikasını kapalı formda türetir, sonra BT'ye yerleştirir — RM yok, PPO yok.<br><strong>2.</strong> Örtük ödül β log(π_θ / π_ref)'tir. Kayıp sadece farkı üzerinde lojistik regresyondur.<br><strong>3.</strong> Tercihler deterministik olduğunda DPO aşırı-uyum yapabilir — Azar ve ark.'ın gözlemi.<br><strong>4.</strong> IPO sigmoidi karesel kayıpla değiştirir, ödül farkını çapalar ve patlamayı önler.<br><strong>5.</strong> KTO ikili beğeni verisinde çalışır — üretim logları için mükemmel — ve kayıptan kaçınmayı yerleştirir.<br><strong>6.</strong> ORPO SFT ve tercihi birleştirir. SimPO referans modelini düşürür. Kısıtlara göre seç.<br><strong>7.</strong> Hangi kaybı kullanırsan kullan KL(policy || ref)'i her zaman izle.</div></div>
</div>`
};
