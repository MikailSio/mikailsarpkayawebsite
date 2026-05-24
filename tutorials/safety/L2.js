window.SAFETY_L2 = {

en: `<p class="l-text"><strong>RLHF is the recipe that turned GPT-3 into ChatGPT. Same weights, dramatically different behaviour. The difference is roughly 30,000 human preference comparisons and a clever loss function borrowed from 1952 horse-racing statistics.</strong> It is also the workhorse of Llama-2-Chat, Claude, Gemini, and almost every modern instruction-following model.</p>
<p class="l-text">This lesson is the deep dive of the track. We derive the Bradley-Terry preference model from scratch, walk through the three-stage pipeline (SFT then reward model then PPO), explain PPO's clipping and the KL-to-reference penalty, and finish with a complete TRL-style training script. By the end you should be able to write an RLHF loop on paper.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive the Bradley-Terry preference loss from a single axiom</li>
<li>Train a reward model end-to-end on (chosen, rejected) pairs</li>
<li>Walk the SFT then RM then PPO pipeline used by InstructGPT and Llama-2-Chat</li>
<li>Read and explain the clipped surrogate objective of PPO</li>
<li>Justify the KL-to-reference penalty and choose its coefficient β</li>
<li>Diagnose reward hacking, mode collapse, and KL blow-up in practice</li>
<li>Write a TRL training loop for a 1B-parameter assistant</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Not Just Supervised Fine-Tuning?</h2>
<p class="l-text">Supervised fine-tuning (SFT) on demonstrations is cheap and gets you most of the way: take a base LLM, show it a few thousand high-quality (prompt, response) pairs, do MLE. The resulting model speaks like an assistant. So why bother with RL on top?</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Demonstrations are expensive</div><div class="card-body">Writing a perfect response is hard. Comparing two responses ("which is better?") is roughly 5x faster.</div></div>
<div class="calc-card"><div class="card-title">Demonstrations have a ceiling</div><div class="card-body">SFT can only imitate humans. With preference learning, the model can be better than the average labeller.</div></div>
<div class="calc-card"><div class="card-title">Negative signal</div><div class="card-body">SFT only knows "this is good". Preferences also tell you "this is worse than that" — useful for refusing harmful asks.</div></div>
<div class="calc-card"><div class="card-title">Distributional control</div><div class="card-body">RL lets you shape the entire distribution of outputs (politeness, length, refusal style), not just put mass on demonstrations.</div></div>
</div>
<p class="l-text">InstructGPT (Ouyang et al., 2022) measured this: a 1.3B RLHF model was preferred over a 175B SFT-only model on most prompts. Preference data is dramatically more sample-efficient than demonstrations.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Bradley-Terry Preference Model</h2>
<p class="l-text">We have pairs of responses (y_w, y_l) where y_w is chosen and y_l is rejected. We want a scalar reward function r(x, y) such that high reward means humans prefer y. The Bradley-Terry model (1952) gives us a likelihood.</p>
<div class="katex-block">$$P(y_w \\succ y_l \\mid x) = \\frac{\\exp(r(x, y_w))}{\\exp(r(x, y_w)) + \\exp(r(x, y_l))} = \\sigma\\bigl(r(x, y_w) - r(x, y_l)\\bigr)$$</div>
<p class="l-text">In words: the probability that a human prefers y_w over y_l is the sigmoid of the reward gap. If r is a neural network with parameters φ, the negative log-likelihood gives us the loss to minimize on a dataset of N comparisons.</p>
<div class="katex-block">$$\\mathcal{L}_{RM}(\\phi) = -\\frac{1}{N} \\sum_{i=1}^{N} \\log \\sigma\\bigl(r_\\phi(x_i, y_w^i) - r_\\phi(x_i, y_l^i)\\bigr)$$</div>
<div class="calc-highlight">This is exactly logistic regression on the difference of rewards. The "label" is always 1 (the chosen response wins). The "feature" is the reward gap.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Hands-on: Train a Reward Model with Logistic Regression</h2>
<p class="l-text">Let's prove the equivalence. We will pretend each response is a vector and the reward is a linear function r(y) = w · y. Bradley-Terry then collapses to logistic regression on the difference vector y_w − y_l.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
d = <span class="num">8</span>
w_true = rng.<span class="fn">standard_normal</span>(d)              <span class="cm"># the latent &quot;goodness&quot; weights humans use</span>

<span class="kw">def</span> <span class="fn">make_pair</span>():
    a = rng.<span class="fn">standard_normal</span>(d)
    b = rng.<span class="fn">standard_normal</span>(d)
    <span class="cm"># human prefers whichever has higher w_true . y, with some noise</span>
    p_a = <span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-(w_true @ a - w_true @ b)))
    chosen, rejected = (a, b) <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; p_a <span class="kw">else</span> (b, a)
    <span class="kw">return</span> chosen - rejected   <span class="cm"># BT trick: feed the difference</span>

X = np.<span class="fn">array</span>([<span class="fn">make_pair</span>() <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3000</span>)])
y = np.<span class="fn">ones</span>(<span class="fn">len</span>(X))                     <span class="cm"># chosen always wins by construction</span>

<span class="cm"># No intercept: BT loss has no constant term</span>
rm = <span class="fn">LogisticRegression</span>(fit_intercept=<span class="kw">False</span>, C=<span class="num">10.0</span>).<span class="fn">fit</span>(X, y)
w_hat = rm.coef_[<span class="num">0</span>]

cos = (w_hat @ w_true) / (np.linalg.<span class="fn">norm</span>(w_hat) * np.linalg.<span class="fn">norm</span>(w_true))
<span class="fn">print</span>(f<span class="str">&quot;cosine(w_hat, w_true) = {cos:.3f}   (1.0 = perfect recovery)&quot;</span>)
<span class="fn">print</span>(f<span class="str">&quot;train accuracy        = {rm.score(X, y):.3f}&quot;</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Invent a hidden weight vector that defines &quot;what humans like&quot;. 2) Sample 3000 (a, b) response pairs and let the human prefer one according to a Bradley-Terry coin flip. 3) Train logistic regression on the difference vector — that is literally the BT loss. 4) Compare the recovered weights to the true ones via cosine similarity. With enough pairs, the recovery is near-perfect.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The Three-Stage Pipeline</h2>
<p class="l-text">Modern RLHF, as standardized by InstructGPT and copied by every major lab, has three stages. Each stage takes the previous one as its starting point.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stage 1 — SFT</div><div class="card-body">Fine-tune the base LM on ~10k high-quality (prompt, response) demonstrations. Cross-entropy loss. Output: π_SFT.</div></div>
<div class="calc-card"><div class="card-title">Stage 2 — Reward model</div><div class="card-body">Use π_SFT to sample 4 responses per prompt; humans rank them. Train r_φ on ~30k pairwise preferences with the BT loss above.</div></div>
<div class="calc-card"><div class="card-title">Stage 3 — RL (PPO)</div><div class="card-body">Initialize policy π_θ from π_SFT. Sample responses, score with r_φ, update π_θ with PPO. Add KL penalty against π_SFT.</div></div>
<div class="calc-card"><div class="card-title">Optional — Iterate</div><div class="card-body">Collect new preferences on the new policy's outputs, retrain RM, run PPO again. Llama-2 did 5 iterations.</div></div>
</div>
<p class="l-text">A subtle point: the reward model and the policy are usually two different networks. The RM has a scalar regression head; the policy has the original LM head. They can also share a backbone to save compute (this is what Anthropic does).</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The PPO Objective, Decomposed</h2>
<p class="l-text">PPO (Schulman et al., 2017) is the policy-gradient method of choice for RLHF. It improves on vanilla policy gradient by clipping how much the policy can move per update, which prevents catastrophic collapse on noisy reward signals like ours.</p>
<div class="katex-block">$$L^{CLIP}(\\theta) = \\mathbb{E}_t \\Bigl[ \\min\\bigl( r_t(\\theta) \\hat{A}_t,\\; \\text{clip}(r_t(\\theta), 1-\\epsilon, 1+\\epsilon) \\hat{A}_t \\bigr) \\Bigr]$$</div>
<p class="l-text">Here r_t(θ) = π_θ(a_t|s_t) / π_old(a_t|s_t) is the importance ratio between the new and old policy, A_t is the advantage (how much better than average action a_t looked), and ε is typically 0.1 or 0.2.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Importance ratio r_t</div><div class="card-body">If r_t &gt; 1 the new policy makes the action more likely. We clip it to keep updates small.</div></div>
<div class="calc-card"><div class="card-title">Advantage A_t</div><div class="card-body">Reward minus a learned value baseline. Tells the policy whether this action was above average.</div></div>
<div class="calc-card"><div class="card-title">Clip with min</div><div class="card-body">The min keeps the bound pessimistic — we never let the surrogate exceed what is safe.</div></div>
<div class="calc-card"><div class="card-title">Token-level credit</div><div class="card-body">In LLM RLHF the &quot;action&quot; at each step is a token. Per-token advantages come from a learned value head plus the final reward.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hands-on: PPO Clipping on a Toy Bandit</h2>
<p class="l-text">Strip everything down: one-step bandit, two actions, known true reward. Watch how clipping prevents the policy from over-committing on noisy advantages.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Two arms. Arm 0 has true reward 0.4, arm 1 has true reward 0.6.</span>
true_r = np.<span class="fn">array</span>([<span class="num">0.4</span>, <span class="num">0.6</span>])
logits = np.<span class="fn">array</span>([<span class="num">0.0</span>, <span class="num">0.0</span>])             <span class="cm"># start uniform</span>
old_logits = logits.<span class="fn">copy</span>()
eps, lr = <span class="num">0.2</span>, <span class="num">0.1</span>

<span class="kw">def</span> <span class="fn">softmax</span>(z): e = np.<span class="fn">exp</span>(z - z.<span class="fn">max</span>()); <span class="kw">return</span> e / e.<span class="fn">sum</span>()

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">300</span>):
    pi_old = <span class="fn">softmax</span>(old_logits)
    a = rng.<span class="fn">choice</span>(<span class="num">2</span>, p=pi_old)
    r = true_r[a] + <span class="num">0.3</span> * rng.<span class="fn">standard_normal</span>()    <span class="cm"># noisy reward</span>
    A = r - true_r.<span class="fn">mean</span>()                            <span class="cm"># advantage vs baseline</span>

    <span class="cm"># PPO surrogate gradient w.r.t. logits, clipped</span>
    pi_new = <span class="fn">softmax</span>(logits)
    ratio = pi_new[a] / (pi_old[a] + <span class="num">1e-8</span>)
    clipped = np.<span class="fn">clip</span>(ratio, <span class="num">1</span>-eps, <span class="num">1</span>+eps)
    use_clip = (ratio * A &gt; clipped * A)                <span class="cm"># take the pessimistic min</span>
    eff_ratio = clipped <span class="kw">if</span> use_clip <span class="kw">else</span> ratio

    grad = np.<span class="fn">zeros</span>(<span class="num">2</span>)
    <span class="kw">if</span> <span class="kw">not</span> use_clip:                                  <span class="cm"># no gradient when clipped</span>
        grad[a]      += A * (<span class="num">1</span> - pi_new[a])
        grad[<span class="num">1</span>-a]    += -A * pi_new[<span class="num">1</span>-a]
    logits += lr * grad

    <span class="kw">if</span> step % <span class="num">60</span> == <span class="num">0</span>:
        <span class="fn">print</span>(f<span class="str">&quot;step {step:3d} | pi_new = {pi_new.round(3)} | ratio = {ratio:.2f}&quot;</span>)
        old_logits = logits.<span class="fn">copy</span>()                    <span class="cm"># refresh ref every K steps</span>

<span class="fn">print</span>(<span class="str">&quot;final pi:&quot;</span>, <span class="fn">softmax</span>(logits).<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Define a 2-arm bandit with the better arm having true reward 0.6. 2) Sample an action from the current policy and observe a noisy reward. 3) Compute the importance ratio against the old policy snapshot. 4) Clip the ratio to [0.8, 1.2]; if clipped, the gradient is zero — the policy refuses to update further on that batch. 5) Periodically refresh the old policy. The final distribution should put most mass on arm 1.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The KL-to-Reference Penalty</h2>
<p class="l-text">Optimizing the reward model alone causes a known failure: the policy drifts into "weird" text that scores high on the RM but is gibberish, repetitive, or unsafe — because the RM was only trained near the SFT distribution and extrapolates badly far from it. The fix is a KL penalty against π_SFT.</p>
<div class="katex-block">$$\\text{reward}_{total}(x, y) = r_\\phi(x, y) - \\beta \\cdot D_{KL}\\bigl(\\pi_\\theta(\\cdot|x) \\,\\|\\, \\pi_{SFT}(\\cdot|x)\\bigr)$$</div>
<p class="l-text">In practice the KL is computed per-token and added to the reward at each step. Typical β values are between 0.01 and 0.2. Too small: the policy hacks the RM. Too large: the policy never moves and you spent compute for nothing.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">kl</span>(p, q, eps=<span class="num">1e-9</span>):
    p = p + eps; q = q + eps
    <span class="kw">return</span> np.<span class="fn">sum</span>(p * np.<span class="fn">log</span>(p / q))

p_sft = np.<span class="fn">array</span>([<span class="num">0.40</span>, <span class="num">0.35</span>, <span class="num">0.15</span>, <span class="num">0.10</span>])
<span class="kw">for</span> name, p <span class="kw">in</span> [
    (<span class="str">&quot;same as SFT&quot;</span>,        np.<span class="fn">array</span>([<span class="num">0.40</span>, <span class="num">0.35</span>, <span class="num">0.15</span>, <span class="num">0.10</span>])),
    (<span class="str">&quot;mild drift&quot;</span>,         np.<span class="fn">array</span>([<span class="num">0.55</span>, <span class="num">0.25</span>, <span class="num">0.15</span>, <span class="num">0.05</span>])),
    (<span class="str">&quot;reward hacked&quot;</span>,      np.<span class="fn">array</span>([<span class="num">0.97</span>, <span class="num">0.01</span>, <span class="num">0.01</span>, <span class="num">0.01</span>])),
]:
    <span class="fn">print</span>(f<span class="str">&quot;{name:20s}  KL = {kl(p, p_sft):.3f}&quot;</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) defines a small KL divergence helper for two discrete distributions, with an epsilon to avoid log(0). 2) fixes a reference distribution π_SFT and evaluates KL for three candidate policies: identical to SFT, mildly drifted, and reward-hacked into a near-delta.</p>
<p class="l-text"><strong>What this code does:</strong> three candidate policies measured against the SFT reference. Notice how the &quot;reward hacked&quot; one explodes in KL — that's the signal a training run uses to know β should be higher.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. End-to-End: A TRL Training Loop (DEMO)</h2>
<p class="l-text">Hugging Face TRL is the de-facto open-source RLHF library. Here is the abridged flow for fine-tuning a 1B-parameter model. The actual run needs at least one A100; the code below is the demo skeleton.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM
<span class="kw">from</span> trl <span class="kw">import</span> PPOConfig, PPOTrainer, AutoModelForCausalLMWithValueHead
<span class="kw">import</span> torch

model_name = <span class="str">&quot;meta-llama/Llama-3.2-1B-Instruct&quot;</span>
tok        = AutoTokenizer.<span class="fn">from_pretrained</span>(model_name)
policy     = AutoModelForCausalLMWithValueHead.<span class="fn">from_pretrained</span>(model_name)
ref        = AutoModelForCausalLMWithValueHead.<span class="fn">from_pretrained</span>(model_name)   <span class="cm"># frozen pi_SFT</span>
reward_fn  = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">&quot;OpenAssistant/reward-model-deberta-v3&quot;</span>)

cfg = <span class="fn">PPOConfig</span>(
    learning_rate=<span class="num">1.41e-5</span>,
    batch_size=<span class="num">64</span>,
    mini_batch_size=<span class="num">8</span>,
    cliprange=<span class="num">0.2</span>,
    init_kl_coef=<span class="num">0.05</span>,        <span class="cm"># beta in our equation</span>
    target=<span class="num">6</span>,                  <span class="cm"># adaptive KL target (in nats)</span>
)

trainer = <span class="fn">PPOTrainer</span>(cfg, policy, ref, tok)

<span class="kw">for</span> batch <span class="kw">in</span> dataloader:
    queries = [tok.<span class="fn">encode</span>(p, return_tensors=<span class="str">&quot;pt&quot;</span>) <span class="kw">for</span> p <span class="kw">in</span> batch[<span class="str">&quot;prompt&quot;</span>]]
    responses = trainer.<span class="fn">generate</span>(queries, max_new_tokens=<span class="num">128</span>, top_p=<span class="num">0.9</span>)
    rewards   = [<span class="fn">score</span>(reward_fn, q, r) <span class="kw">for</span> q, r <span class="kw">in</span> <span class="fn">zip</span>(queries, responses)]
    stats     = trainer.<span class="fn">step</span>(queries, responses, rewards)
    <span class="fn">print</span>(stats[<span class="str">&quot;ppo/mean_scores&quot;</span>], stats[<span class="str">&quot;objective/kl&quot;</span>])</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) loads a 1B Llama as both the trainable policy (with a value head) and the frozen reference π_SFT, plus a separate pretrained reward model. 2) configures PPO with a clip range, an initial KL coefficient β, and an adaptive KL target in nats. 3) runs the generate → score → PPO-step loop and logs mean reward and KL divergence every batch.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">trl + transformers cannot run in the browser. We approximate the loop on a tiny tabular &quot;LLM&quot; (one categorical action per prompt) and watch the KL penalty stabilize training.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

V = 6                                 # &quot;vocab size&quot; / candidate responses
true_r  = np.array([0.1, 0.4, 0.9, 0.6, 0.2, 0.0])
sft_logits = np.array([0.0]*V)        # uniform pi_SFT
policy = sft_logits.copy()
beta, lr, eps = 0.05, 0.1, 0.2

def softmax(z): e = np.exp(z - z.max()); return e / e.sum()

for step in range(400):
    pi = softmax(policy)
    pi_sft = softmax(sft_logits)
    a = rng.choice(V, p=pi)
    noisy_r = true_r[a] + 0.1 * rng.standard_normal()
    kl_term = np.sum(pi * np.log((pi + 1e-9) / (pi_sft + 1e-9)))
    reward_total = noisy_r - beta * kl_term

    grad = np.zeros(V)
    grad[a] = reward_total
    grad -= reward_total * pi          # baseline subtraction
    policy = np.clip(policy + lr * grad, -eps*10, eps*10)

print(&quot;final pi:&quot;, softmax(policy).round(3))
print(&quot;true r :&quot;, true_r)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) sets up a 6-action toy &quot;LLM&quot; whose true reward peaks at action 2. 2) at each step samples an action from the current policy, observes a noisy reward, and subtracts β·KL(π‖π_SFT) — exactly the per-step reward used by real RLHF. 3) takes a clipped policy-gradient step on the combined signal.</p>
</div>
<p class="l-text"><strong>What this demo shows:</strong> the toy &quot;LLM&quot; converges to put mass on action 2 (true reward 0.9) but the KL penalty prevents collapse — it still spreads some probability across nearby actions. Drop β to 0 and the policy will become a delta on whichever action got lucky early.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Things That Go Wrong</h2>
<p class="l-text">RLHF training is notoriously finicky. Llama-2's paper devotes pages to the diagnostics. Here are the failure modes you will see in any real run.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reward hacking</div><div class="card-body">Model learns spurious patterns the RM rewards (long answers, sycophancy, &quot;As an AI language model&quot; preambles).</div></div>
<div class="calc-card"><div class="card-title">Mode collapse</div><div class="card-body">Policy entropy drops, all completions look identical. Symptom: low KL early then plateau.</div></div>
<div class="calc-card"><div class="card-title">KL blow-up</div><div class="card-body">KL diverges, reward also climbs but on bizarre text. β too low, or RM out-of-distribution. Mitigation: adaptive KL.</div></div>
<div class="calc-card"><div class="card-title">RM saturation</div><div class="card-body">Reward score ceiling hits. The RM cannot distinguish outputs at the new policy's quality. Time to collect new prefs and retrain RM.</div></div>
</div>
<div class="think-box"><div class="think-label">PRACTICAL TIPS</div><div class="think-body">Always log: mean reward, KL to ref, response length distribution, and a small held-out qualitative sample. Watch length carefully — RLHF policies famously get longer over training because longer answers trigger more &quot;helpful&quot; reward.</div></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> RLHF turns a base LM into an instruction follower using preference data, not demonstrations.<br><strong>2.</strong> Bradley-Terry: P(y_w wins) = σ(r(y_w) − r(y_l)). Loss = −log of that. Logistic regression on differences.<br><strong>3.</strong> Pipeline = SFT then RM then PPO. Possibly iterate.<br><strong>4.</strong> PPO clips importance ratios so noisy reward gradients cannot blow up the policy.<br><strong>5.</strong> KL-to-reference (β term) keeps the policy close to π_SFT and stops reward hacking.<br><strong>6.</strong> Failure modes: reward hacking, mode collapse, KL blow-up, RM saturation. Log everything.<br><strong>7.</strong> TRL is the standard open-source library. The actual loop is just generate → score → step.</div></div>
</div>`,

tr: `<p class="l-text"><strong>RLHF, GPT-3'ü ChatGPT'ye dönüştüren tariftir. Aynı ağırlıklar, dramatik biçimde farklı davranış. Aradaki fark kabaca 30.000 insan tercih karşılaştırması ve 1952 at yarışı istatistiklerinden ödünç alınmış akıllı bir kayıp fonksiyonudur.</strong> Aynı zamanda Llama-2-Chat, Claude, Gemini ve neredeyse her modern talimat-takip eden modelin iş atıdır.</p>
<p class="l-text">Bu ders track'in derin dalışıdır. Bradley-Terry tercih modelini sıfırdan türetiyoruz, üç-aşamalı boru hattını (SFT sonra ödül modeli sonra PPO) yürüyoruz, PPO'nun kırpmasını ve KL-referans cezasını açıklıyoruz ve tam bir TRL tarzı eğitim scriptiyle bitiriyoruz. Sonunda kâğıt üzerinde bir RLHF döngüsü yazabilmelisin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bradley-Terry tercih kaybını tek bir aksiyomdan türetme</li>
<li>(chosen, rejected) çiftleri üzerinde uçtan uca bir ödül modeli eğitme</li>
<li>InstructGPT ve Llama-2-Chat'in kullandığı SFT-RM-PPO boru hattını yürüme</li>
<li>PPO'nun kırpılmış vekil amacını okuma ve açıklama</li>
<li>KL-referans cezasını gerekçelendirme ve katsayısı β'yı seçme</li>
<li>Pratikte ödül hack'ini, mod çöküşünü ve KL patlamasını teşhis etme</li>
<li>1B-parametreli bir asistan için TRL eğitim döngüsü yazma</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Sadece Denetimli İnce-Ayar Değil?</h2>
<p class="l-text">Gösterimlerde denetimli ince-ayar (SFT) ucuzdur ve seni uzaklara götürür: bir taban LLM al, ona birkaç bin yüksek-kaliteli (prompt, yanıt) çifti göster, MLE yap. Sonuçta ortaya çıkan model bir asistan gibi konuşur. Peki neden üstüne RL uğraşası?</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gösterimler pahalı</div><div class="card-body">Mükemmel bir yanıt yazmak zor. İki yanıtı karşılaştırmak ("hangisi daha iyi?") kabaca 5 kat daha hızlı.</div></div>
<div class="calc-card"><div class="card-title">Gösterimlerin tavanı var</div><div class="card-body">SFT yalnızca insanları taklit edebilir. Tercih öğrenmesiyle, model ortalama etiketleyiciden daha iyi olabilir.</div></div>
<div class="calc-card"><div class="card-title">Negatif sinyal</div><div class="card-body">SFT yalnızca "bu iyi"yi bilir. Tercihler sana ayrıca "bu şundan daha kötü"yü de söyler — zararlı isteklerin reddi için faydalı.</div></div>
<div class="calc-card"><div class="card-title">Dağılım kontrolü</div><div class="card-body">RL, tüm çıktı dağılımını şekillendirmeni sağlar (kibarlık, uzunluk, ret tarzı), sadece gösterimlere kütle yerleştirmek değil.</div></div>
</div>
<p class="l-text">InstructGPT (Ouyang ve ark., 2022) bunu ölçtü: 1.3B RLHF modeli, çoğu prompt'ta 175B sadece-SFT modeline tercih edildi. Tercih verisi, gösterimlerden dramatik biçimde daha örneklem-verimlidir.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bradley-Terry Tercih Modeli</h2>
<p class="l-text">y_w'nin seçildiği ve y_l'nin reddedildiği yanıt çiftlerimiz (y_w, y_l) var. Yüksek ödülün insanların y'yi tercih ettiği anlamına geldiği bir skaler ödül fonksiyonu r(x, y) istiyoruz. Bradley-Terry modeli (1952) bize bir olabilirlik verir.</p>
<div class="katex-block">$$P(y_w \\succ y_l \\mid x) = \\frac{\\exp(r(x, y_w))}{\\exp(r(x, y_w)) + \\exp(r(x, y_l))} = \\sigma\\bigl(r(x, y_w) - r(x, y_l)\\bigr)$$</div>
<p class="l-text">Sözel olarak: bir insanın y_w'yi y_l'ye tercih etme olasılığı, ödül farkının sigmoididir. r, parametreleri φ olan bir sinir ağıysa, negatif log-olabilirlik bize N karşılaştırmadan oluşan veri setinde minimize edilecek kaybı verir.</p>
<div class="katex-block">$$\\mathcal{L}_{RM}(\\phi) = -\\frac{1}{N} \\sum_{i=1}^{N} \\log \\sigma\\bigl(r_\\phi(x_i, y_w^i) - r_\\phi(x_i, y_l^i)\\bigr)$$</div>
<div class="calc-highlight">Bu tam olarak ödüllerin farkı üzerinde lojistik regresyondur. "Etiket" her zaman 1'dir (seçilen yanıt kazanır). "Özellik" ödül farkıdır.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Uygulamalı: Lojistik Regresyonla Ödül Modeli Eğitme</h2>
<p class="l-text">Eşdeğerliği kanıtlayalım. Her yanıtın bir vektör olduğunu ve ödülün doğrusal bir fonksiyon r(y) = w · y olduğunu varsayacağız. Bradley-Terry o zaman fark vektörü y_w − y_l üzerinde lojistik regresyona indirgenir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
d = <span class="num">8</span>
w_true = rng.<span class="fn">standard_normal</span>(d)              <span class="cm"># insanların kullandığı gizli &quot;iyilik&quot; ağırlıkları</span>

<span class="kw">def</span> <span class="fn">make_pair</span>():
    a = rng.<span class="fn">standard_normal</span>(d)
    b = rng.<span class="fn">standard_normal</span>(d)
    <span class="cm"># insan biraz gürültüyle daha yüksek w_true . y olanı tercih eder</span>
    p_a = <span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-(w_true @ a - w_true @ b)))
    chosen, rejected = (a, b) <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; p_a <span class="kw">else</span> (b, a)
    <span class="kw">return</span> chosen - rejected   <span class="cm"># BT hilesi: farkı besle</span>

X = np.<span class="fn">array</span>([<span class="fn">make_pair</span>() <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3000</span>)])
y = np.<span class="fn">ones</span>(<span class="fn">len</span>(X))                     <span class="cm"># inşa gereği seçilen hep kazanır</span>

<span class="cm"># Sabit yok: BT kaybının sabit terimi yoktur</span>
rm = <span class="fn">LogisticRegression</span>(fit_intercept=<span class="kw">False</span>, C=<span class="num">10.0</span>).<span class="fn">fit</span>(X, y)
w_hat = rm.coef_[<span class="num">0</span>]

cos = (w_hat @ w_true) / (np.linalg.<span class="fn">norm</span>(w_hat) * np.linalg.<span class="fn">norm</span>(w_true))
<span class="fn">print</span>(f<span class="str">&quot;cosine(w_hat, w_true) = {cos:.3f}   (1.0 = perfect recovery)&quot;</span>)
<span class="fn">print</span>(f<span class="str">&quot;train accuracy        = {rm.score(X, y):.3f}&quot;</span>)</code></pre></div>

<p class="l-text"><strong>Burada neler oluyor:</strong> 1) "İnsanların ne sevdiğini" tanımlayan gizli bir ağırlık vektörü icat eder. 2) 3000 (a, b) yanıt çifti örnekler ve insanın bir Bradley-Terry yazı-tura atışına göre birini tercih etmesini sağlar. 3) Fark vektörü üzerinde lojistik regresyon eğitir — bu kelimenin tam anlamıyla BT kaybıdır. 4) Geri kazanılan ağırlıkları kosinüs benzerliği ile gerçek olanlarla karşılaştırır. Yeterli çiftle, geri kazanım neredeyse mükemmeldir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Üç-Aşamalı Boru Hattı</h2>
<p class="l-text">InstructGPT tarafından standartlaştırılan ve her büyük lab tarafından kopyalanan modern RLHF, üç aşamalıdır. Her aşama bir öncekini başlangıç noktası olarak alır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aşama 1 — SFT</div><div class="card-body">Taban LM'i ~10k yüksek-kaliteli (prompt, yanıt) gösterimde ince-ayarla. Çapraz-entropi kaybı. Çıktı: π_SFT.</div></div>
<div class="calc-card"><div class="card-title">Aşama 2 — Ödül modeli</div><div class="card-body">π_SFT'yi prompt başına 4 yanıt örneklemek için kullan; insanlar bunları sıralar. r_φ'yi ~30k ikili tercih üzerinde yukarıdaki BT kaybı ile eğit.</div></div>
<div class="calc-card"><div class="card-title">Aşama 3 — RL (PPO)</div><div class="card-body">Politikayı π_θ'yı π_SFT'den başlat. Yanıtları örnekle, r_φ ile puanla, π_θ'yı PPO ile güncelle. π_SFT'ye karşı KL cezası ekle.</div></div>
<div class="calc-card"><div class="card-title">Opsiyonel — Yinele</div><div class="card-body">Yeni politikanın çıktıları üzerinde yeni tercihler topla, RM'i yeniden eğit, PPO'yu tekrar çalıştır. Llama-2 5 yineleme yaptı.</div></div>
</div>
<p class="l-text">İnce bir nokta: ödül modeli ve politika genellikle iki farklı ağdır. RM'in skaler bir regresyon başlığı vardır; politikanın orijinal LM başlığı vardır. İşlem gücünden tasarruf etmek için bir omurgayı paylaşabilirler de (Anthropic'in yaptığı budur).</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. PPO Amacı, Parçalanmış</h2>
<p class="l-text">PPO (Schulman ve ark., 2017) RLHF için tercih edilen politika-gradyanı yöntemidir. Politikanın güncelleme başına ne kadar hareket edebileceğini kırparak vanilya politika gradyanını geliştirir, bu da bizimki gibi gürültülü ödül sinyallerinde felaket çöküşü önler.</p>
<div class="katex-block">$$L^{CLIP}(\\theta) = \\mathbb{E}_t \\Bigl[ \\min\\bigl( r_t(\\theta) \\hat{A}_t,\\; \\text{clip}(r_t(\\theta), 1-\\epsilon, 1+\\epsilon) \\hat{A}_t \\bigr) \\Bigr]$$</div>
<p class="l-text">Burada r_t(θ) = π_θ(a_t|s_t) / π_old(a_t|s_t) yeni ve eski politika arasındaki önem oranıdır, A_t avantajdır (a_t aksiyonu ortalamadan ne kadar daha iyi göründü) ve ε tipik olarak 0.1 veya 0.2'dir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Önem oranı r_t</div><div class="card-body">r_t &gt; 1 ise yeni politika aksiyonu daha olası kılar. Güncellemeleri küçük tutmak için kırparız.</div></div>
<div class="calc-card"><div class="card-title">Avantaj A_t</div><div class="card-body">Ödül eksi öğrenilmiş bir değer temeli. Politikaya bu aksiyonun ortalamanın üstünde olup olmadığını söyler.</div></div>
<div class="calc-card"><div class="card-title">min ile kırpma</div><div class="card-body">min sınırı kötümser tutar — vekilin güvenli olanı aşmasına asla izin vermeyiz.</div></div>
<div class="calc-card"><div class="card-title">Token-düzeyi atıf</div><div class="card-body">LLM RLHF'inde her adımdaki "aksiyon" bir token'dır. Token-başına avantajlar öğrenilmiş bir değer başlığı artı nihai ödülden gelir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Uygulamalı: Bir Oyuncak Bandit Üzerinde PPO Kırpması</h2>
<p class="l-text">Her şeyi basitleştir: tek-adım bandit, iki aksiyon, bilinen gerçek ödül. Kırpmanın gürültülü avantajlarda politikanın aşırı taahhütte bulunmasını nasıl önlediğini izle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># İki kol. Kol 0'ın gerçek ödülü 0.4, kol 1'in gerçek ödülü 0.6.</span>
true_r = np.<span class="fn">array</span>([<span class="num">0.4</span>, <span class="num">0.6</span>])
logits = np.<span class="fn">array</span>([<span class="num">0.0</span>, <span class="num">0.0</span>])             <span class="cm"># tekdüze başla</span>
old_logits = logits.<span class="fn">copy</span>()
eps, lr = <span class="num">0.2</span>, <span class="num">0.1</span>

<span class="kw">def</span> <span class="fn">softmax</span>(z): e = np.<span class="fn">exp</span>(z - z.<span class="fn">max</span>()); <span class="kw">return</span> e / e.<span class="fn">sum</span>()

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">300</span>):
    pi_old = <span class="fn">softmax</span>(old_logits)
    a = rng.<span class="fn">choice</span>(<span class="num">2</span>, p=pi_old)
    r = true_r[a] + <span class="num">0.3</span> * rng.<span class="fn">standard_normal</span>()    <span class="cm"># gürültülü ödül</span>
    A = r - true_r.<span class="fn">mean</span>()                            <span class="cm"># temele karşı avantaj</span>

    <span class="cm"># logitlere göre PPO vekil gradyanı, kırpılmış</span>
    pi_new = <span class="fn">softmax</span>(logits)
    ratio = pi_new[a] / (pi_old[a] + <span class="num">1e-8</span>)
    clipped = np.<span class="fn">clip</span>(ratio, <span class="num">1</span>-eps, <span class="num">1</span>+eps)
    use_clip = (ratio * A &gt; clipped * A)                <span class="cm"># kötümser min'i al</span>
    eff_ratio = clipped <span class="kw">if</span> use_clip <span class="kw">else</span> ratio

    grad = np.<span class="fn">zeros</span>(<span class="num">2</span>)
    <span class="kw">if</span> <span class="kw">not</span> use_clip:                                  <span class="cm"># kırpıldığında gradyan yok</span>
        grad[a]      += A * (<span class="num">1</span> - pi_new[a])
        grad[<span class="num">1</span>-a]    += -A * pi_new[<span class="num">1</span>-a]
    logits += lr * grad

    <span class="kw">if</span> step % <span class="num">60</span> == <span class="num">0</span>:
        <span class="fn">print</span>(f<span class="str">&quot;step {step:3d} | pi_new = {pi_new.round(3)} | ratio = {ratio:.2f}&quot;</span>)
        old_logits = logits.<span class="fn">copy</span>()                    <span class="cm"># her K adımda referansı tazele</span>

<span class="fn">print</span>(<span class="str">&quot;final pi:&quot;</span>, <span class="fn">softmax</span>(logits).<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>

<p class="l-text"><strong>Bu kodda:</strong> 1) Daha iyi kolun gerçek ödülü 0.6 olan 2-kollu bandit tanımla. 2) Mevcut politikadan bir aksiyon örnekle ve gürültülü bir ödül gözlemle. 3) Eski politika anlık görüntüsüne karşı önem oranını hesapla. 4) Oranı [0.8, 1.2]'ye kırp; kırpılırsa gradyan sıfırdır — politika o batch'te daha fazla güncellenmeyi reddeder. 5) Periyodik olarak eski politikayı tazele. Nihai dağılım kütlenin çoğunu kol 1'e koymalı.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. KL-Referans Cezası</h2>
<p class="l-text">Sadece ödül modelini optimize etmek bilinen bir hataya yol açar: politika RM'de yüksek puan alan ama anlamsız, tekrarlayıcı veya güvensiz "garip" metne sürüklenir — çünkü RM yalnızca SFT dağılımı yakınında eğitildi ve oradan uzaklaştıkça kötü ekstrapolasyon yapar. Düzeltme π_SFT'ye karşı bir KL cezasıdır.</p>
<div class="katex-block">$$\\text{reward}_{total}(x, y) = r_\\phi(x, y) - \\beta \\cdot D_{KL}\\bigl(\\pi_\\theta(\\cdot|x) \\,\\|\\, \\pi_{SFT}(\\cdot|x)\\bigr)$$</div>
<p class="l-text">Pratikte KL token-başına hesaplanır ve her adımda ödüle eklenir. Tipik β değerleri 0.01 ile 0.2 arasındadır. Çok küçük: politika RM'i hack'ler. Çok büyük: politika asla hareket etmez ve hiçbir şey için işlem gücü harcamış olursunuz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">kl</span>(p, q, eps=<span class="num">1e-9</span>):
    p = p + eps; q = q + eps
    <span class="kw">return</span> np.<span class="fn">sum</span>(p * np.<span class="fn">log</span>(p / q))

p_sft = np.<span class="fn">array</span>([<span class="num">0.40</span>, <span class="num">0.35</span>, <span class="num">0.15</span>, <span class="num">0.10</span>])
<span class="kw">for</span> name, p <span class="kw">in</span> [
    (<span class="str">&quot;same as SFT&quot;</span>,        np.<span class="fn">array</span>([<span class="num">0.40</span>, <span class="num">0.35</span>, <span class="num">0.15</span>, <span class="num">0.10</span>])),
    (<span class="str">&quot;mild drift&quot;</span>,         np.<span class="fn">array</span>([<span class="num">0.55</span>, <span class="num">0.25</span>, <span class="num">0.15</span>, <span class="num">0.05</span>])),
    (<span class="str">&quot;reward hacked&quot;</span>,      np.<span class="fn">array</span>([<span class="num">0.97</span>, <span class="num">0.01</span>, <span class="num">0.01</span>, <span class="num">0.01</span>])),
]:
    <span class="fn">print</span>(f<span class="str">&quot;{name:20s}  KL = {kl(p, p_sft):.3f}&quot;</span>)</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) iki ayrık dağılım için küçük bir KL ıraksaklık yardımcısı tanımlar, log(0)'dan kaçınmak için bir epsilon ile. 2) bir referans dağılım π_SFT sabitler ve üç aday politika için KL'yi değerlendirir: SFT ile özdeş, hafifçe sürüklenmiş ve neredeyse-delta'ya kadar ödül-hack'lenmiş.</p>
<p class="l-text"><strong>Bu kod ne yapar:</strong> SFT referansına karşı ölçülen üç aday politika. "Reward hacked" olanın KL'inin nasıl patladığına dikkat et — bu, β'nın daha yüksek olması gerektiğini bilmek için bir eğitim koşusunun kullandığı sinyaldir.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Uçtan Uca: Bir TRL Eğitim Döngüsü (DEMO)</h2>
<p class="l-text">Hugging Face TRL, fiili açık-kaynak RLHF kütüphanesidir. 1B-parametreli bir modeli ince-ayarlamak için kısaltılmış akış. Gerçek koşu en az bir A100 gerektirir; aşağıdaki kod demo iskeletidir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM
<span class="kw">from</span> trl <span class="kw">import</span> PPOConfig, PPOTrainer, AutoModelForCausalLMWithValueHead
<span class="kw">import</span> torch

model_name = <span class="str">&quot;meta-llama/Llama-3.2-1B-Instruct&quot;</span>
tok        = AutoTokenizer.<span class="fn">from_pretrained</span>(model_name)
policy     = AutoModelForCausalLMWithValueHead.<span class="fn">from_pretrained</span>(model_name)
ref        = AutoModelForCausalLMWithValueHead.<span class="fn">from_pretrained</span>(model_name)   <span class="cm"># dondurulmuş pi_SFT</span>
reward_fn  = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">&quot;OpenAssistant/reward-model-deberta-v3&quot;</span>)

cfg = <span class="fn">PPOConfig</span>(
    learning_rate=<span class="num">1.41e-5</span>,
    batch_size=<span class="num">64</span>,
    mini_batch_size=<span class="num">8</span>,
    cliprange=<span class="num">0.2</span>,
    init_kl_coef=<span class="num">0.05</span>,        <span class="cm"># denklemimizdeki beta</span>
    target=<span class="num">6</span>,                  <span class="cm"># adaptif KL hedefi (nat cinsinden)</span>
)

trainer = <span class="fn">PPOTrainer</span>(cfg, policy, ref, tok)

<span class="kw">for</span> batch <span class="kw">in</span> dataloader:
    queries = [tok.<span class="fn">encode</span>(p, return_tensors=<span class="str">&quot;pt&quot;</span>) <span class="kw">for</span> p <span class="kw">in</span> batch[<span class="str">&quot;prompt&quot;</span>]]
    responses = trainer.<span class="fn">generate</span>(queries, max_new_tokens=<span class="num">128</span>, top_p=<span class="num">0.9</span>)
    rewards   = [<span class="fn">score</span>(reward_fn, q, r) <span class="kw">for</span> q, r <span class="kw">in</span> <span class="fn">zip</span>(queries, responses)]
    stats     = trainer.<span class="fn">step</span>(queries, responses, rewards)
    <span class="fn">print</span>(stats[<span class="str">&quot;ppo/mean_scores&quot;</span>], stats[<span class="str">&quot;objective/kl&quot;</span>])</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) 1B'lik bir Llama'yı hem eğitilebilir politika (değer başlığıyla) hem de dondurulmuş referans π_SFT olarak yükler, artı ayrı bir ön-eğitilmiş ödül modeli. 2) PPO'yu bir kırpma aralığı, başlangıç KL katsayısı β ve nat cinsinden adaptif bir KL hedefi ile yapılandırır. 3) generate → puanla → PPO-adım döngüsünü çalıştırır ve her batch'te ortalama ödül ile KL ıraksaklığını loglar.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">trl + transformers tarayıcıda çalışamaz. Döngüyü küçük tablo şeklindeki bir &quot;LLM&quot; üzerinde (prompt başına bir kategorik aksiyon) yaklaşık olarak yapıyoruz ve KL cezasının eğitimi nasıl stabilize ettiğini izliyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

V = 6                                 # &quot;vocab boyutu&quot; / aday yanıtlar
true_r  = np.array([0.1, 0.4, 0.9, 0.6, 0.2, 0.0])
sft_logits = np.array([0.0]*V)        # tekdüze pi_SFT
policy = sft_logits.copy()
beta, lr, eps = 0.05, 0.1, 0.2

def softmax(z): e = np.exp(z - z.max()); return e / e.sum()

for step in range(400):
    pi = softmax(policy)
    pi_sft = softmax(sft_logits)
    a = rng.choice(V, p=pi)
    noisy_r = true_r[a] + 0.1 * rng.standard_normal()
    kl_term = np.sum(pi * np.log((pi + 1e-9) / (pi_sft + 1e-9)))
    reward_total = noisy_r - beta * kl_term

    grad = np.zeros(V)
    grad[a] = reward_total
    grad -= reward_total * pi          # temel çıkarması
    policy = np.clip(policy + lr * grad, -eps*10, eps*10)

print(&quot;final pi:&quot;, softmax(policy).round(3))
print(&quot;true r :&quot;, true_r)</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) gerçek ödülü 2. aksiyonda zirve yapan 6-aksiyonlu bir oyuncak "LLM" kurar. 2) her adımda mevcut politikadan bir aksiyon örnekler, gürültülü bir ödül gözlemler ve β·KL(π‖π_SFT)'yi çıkarır — tam olarak gerçek RLHF'in adım-başına kullandığı ödül. 3) birleşik sinyal üzerinde kırpılmış bir politika-gradyanı adımı atar.</p>
</div>
<p class="l-text"><strong>Bu demo ne gösterir:</strong> oyuncak &quot;LLM&quot; aksiyon 2'ye (gerçek ödül 0.9) kütle koymaya yakınsar ama KL cezası çöküşü önler — yine de yakınki aksiyonlara biraz olasılık yayar. β'yı 0'a indir ve politika erken şanslı olan herhangi bir aksiyonda bir delta hâline gelir.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Yanlış Giden Şeyler</h2>
<p class="l-text">RLHF eğitimi efsanevi şekilde titizdir. Llama-2'nin makalesi sayfaları teşhise ayırır. Herhangi bir gerçek koşuda göreceğin başarısızlık modları aşağıdadır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ödül hack'i</div><div class="card-body">Model RM'in ödüllendirdiği sahte desenleri öğrenir (uzun yanıtlar, yağcılık, &quot;Bir YZ dil modeli olarak&quot; ön sözleri).</div></div>
<div class="calc-card"><div class="card-title">Mod çöküşü</div><div class="card-body">Politika entropisi düşer, tüm tamamlamalar özdeş görünür. Belirti: erken düşük KL sonra plato.</div></div>
<div class="calc-card"><div class="card-title">KL patlaması</div><div class="card-body">KL ıraksar, ödül de tırmanır ama tuhaf metinde. β çok düşük veya RM dağılım dışı. Azaltım: adaptif KL.</div></div>
<div class="calc-card"><div class="card-title">RM doygunluğu</div><div class="card-body">Ödül skoru tavanı vurur. RM yeni politikanın kalitesindeki çıktıları ayırt edemez. Yeni tercihler toplama ve RM'i yeniden eğitme zamanı.</div></div>
</div>
<div class="think-box"><div class="think-label">PRATİK İPUÇLARI</div><div class="think-body">Her zaman logla: ortalama ödül, referansa KL, yanıt uzunluğu dağılımı ve küçük bir held-out kalitatif örnek. Uzunluğu dikkatle izle — RLHF politikaları ünlü biçimde eğitim boyunca uzar çünkü uzun yanıtlar daha fazla &quot;yardımsever&quot; ödül tetikler.</div></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> RLHF tercih verisi kullanarak — gösterim değil — bir taban LM'i talimat-takip edene dönüştürür.<br><strong>2.</strong> Bradley-Terry: P(y_w kazanır) = σ(r(y_w) − r(y_l)). Kayıp = −log of that. Farklar üzerinde lojistik regresyon.<br><strong>3.</strong> Boru hattı = SFT sonra RM sonra PPO. Olası yineleme.<br><strong>4.</strong> PPO önem oranlarını kırpar, böylece gürültülü ödül gradyanları politikayı patlamaz.<br><strong>5.</strong> KL-referans (β terimi) politikayı π_SFT'ye yakın tutar ve ödül hack'ini durdurur.<br><strong>6.</strong> Başarısızlık modları: ödül hack'i, mod çöküşü, KL patlaması, RM doygunluğu. Her şeyi logla.<br><strong>7.</strong> TRL standart açık-kaynak kütüphanesidir. Gerçek döngü sadece üret → puanla → adım at.</div></div>
</div>`
};
