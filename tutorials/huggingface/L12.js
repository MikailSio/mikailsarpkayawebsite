window.HF_L12 = {
en: `<p class="l-text"><strong>Pretraining gives you a model that knows everything and follows nothing. Fine-tuning is how you make it useful.</strong> The recipe space exploded in 2023-2025: SFT on instructions, then DPO, then ORPO, then RLHF with PPO, then KTO, then RLAIF. Most teams do not need to know all of them — they need to know which one fits their data, their compute budget, and their downstream metric. This lesson is the field guide.</p>

<p class="l-text">We'll walk top-down: SFT (supervised fine-tuning) as the universal first step, then the preference-optimization family (DPO -&gt; ORPO -&gt; KTO) that replaces full RLHF for most use cases, when full PPO-RLHF is still worth the trouble, and the often-overlooked half — dataset preparation and the eval suite that tells you whether the recipe is working. Every step has a runnable Pyodide demo using sklearn that captures the essential mechanics without needing a 7B model on your laptop.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>SFT chat templates and how chat-format leakage breaks fine-tunes</li>
<li>The DPO loss derivation — why "RLHF without RL" works</li>
<li>ORPO and KTO — the 2024-25 family of single-stage preference losses</li>
<li>When full PPO-RLHF is worth its 5x complexity premium</li>
<li>Dataset preparation: deduplication, decontamination, mixing ratios</li>
<li>The eval suite every fine-tune should run before shipping</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. SFT — The Universal First Step</h2>
<p class="l-text">Every modern fine-tune starts with <strong>Supervised Fine-Tuning</strong>: standard cross-entropy on (prompt, response) pairs. The trick is the chat template — formatting tokens like <code>&lt;|user|&gt;</code>, <code>&lt;|assistant|&gt;</code>, <code>&lt;|im_start|&gt;</code> that the base model has never seen. Get this wrong and you'll fine-tune the model to emit literal "&lt;|user|&gt;" strings forever.</p>

<div class="katex-block">$$\\mathcal{L}_{\\text{SFT}} = -\\sum_{t \\in \\text{response}} \\log P_\\theta(y_t \\mid y_{&lt;t},\\ x_{\\text{prompt}})$$</div>

<p class="l-text">Note the sum is over <em>response tokens only</em>. Loss masking on prompt tokens is essential — otherwise you train the model to predict the user's question, which is both pointless and detrimental.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — trl SFT)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> trl <span class="kw">import</span> SFTTrainer, SFTConfig
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM

tok   = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"Qwen/Qwen2.5-7B"</span>)
model = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">"Qwen/Qwen2.5-7B"</span>, torch_dtype=<span class="str">"bfloat16"</span>)

<span class="cm"># A standard instruction dataset; trl handles the chat-template formatting</span>
ds = <span class="fn">load_dataset</span>(<span class="str">"HuggingFaceH4/ultrachat_200k"</span>, split=<span class="str">"train_sft[:5000]"</span>)

cfg = <span class="fn">SFTConfig</span>(
    output_dir=<span class="str">"./sft-out"</span>,
    per_device_train_batch_size=<span class="num">4</span>,
    gradient_accumulation_steps=<span class="num">8</span>,
    num_train_epochs=<span class="num">1</span>,
    learning_rate=<span class="num">2e-5</span>,
    bf16=<span class="kw">True</span>,
    gradient_checkpointing=<span class="kw">True</span>,
    packing=<span class="kw">True</span>,                       <span class="cm"># concat short examples for GPU efficiency</span>
    max_seq_length=<span class="num">2048</span>,
    optim=<span class="str">"paged_adamw_8bit"</span>,
    eos_token=tok.eos_token,            <span class="cm"># CRITICAL: prevent loss leak across examples</span>
)

trainer = <span class="fn">SFTTrainer</span>(
    model=model, tokenizer=tok,
    train_dataset=ds,
    args=cfg,
    formatting_func=<span class="kw">lambda</span> ex: tok.<span class="fn">apply_chat_template</span>(ex[<span class="str">"messages"</span>], tokenize=<span class="kw">False</span>),
)
trainer.<span class="fn">train</span>()
</code></pre></div>

<p class="l-text"><strong>How the SFT setup is wired:</strong> the tokenizer and base Qwen-7B model load together so we get matching chat-template handlers. <code>ultrachat_200k</code> arrives as Apache Arrow shards (lazy-mapped) and the <code>formatting_func</code> calls <code>apply_chat_template</code> on each row — that is where the <code>&lt;|user|&gt;</code> / <code>&lt;|assistant|&gt;</code> tokens get inserted. The non-obvious knobs are <code>packing=True</code> (concatenates short examples into 2048-token sequences for GPU efficiency), <code>paged_adamw_8bit</code> (paged optimizer for memory), and <code>eos_token=tok.eos_token</code> (the comment flags why). The trainer then iterates batches, masks loss on prompt tokens, and checkpoints — all behind <code>trainer.train()</code>.</p>


<div class="calc-highlight">The most common SFT bug: forgetting <code>eos_token</code>. If examples concatenate without an EOS, the loss leaks across boundaries and the model learns "after one assistant turn comes another assistant turn" — making it ramble forever at inference.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Limits of SFT</h2>
<p class="l-text">SFT teaches a model to imitate good responses. It does <em>not</em> teach the model to recognize bad ones. After SFT a model still hallucinates, still flatters, and still produces low-quality outputs the demonstrations never explicitly forbade. This is the problem preference optimization was invented for.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SFT teaches</div><div class="card-body">"This is what a good answer looks like."</div></div>
<div class="calc-card"><div class="card-title">Preference optimization adds</div><div class="card-body">"This response is better than that response — push probability mass toward the chosen one and away from the rejected one."</div></div>
<div class="calc-card"><div class="card-title">RLHF adds further</div><div class="card-body">"A learned reward model scores any candidate; sample many, optimize toward high reward subject to a KL constraint to the SFT model."</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. DPO — Direct Preference Optimization</h2>
<p class="l-text"><strong>Direct Preference Optimization</strong> (Rafailov et al. 2023) is the lightning bolt that hit the field. The key insight: under a reward model based on the Bradley-Terry pairwise comparison assumption, the optimal policy has a closed form in terms of the reference policy. You can therefore optimize the policy directly on (chosen, rejected) pairs — no reward model, no PPO, no KL trickery as a separate term. The KL constraint is baked in.</p>

<div class="katex-block">$$\\mathcal{L}_{\\text{DPO}} = -\\log \\sigma\\left( \\beta \\log \\frac{\\pi_\\theta(y_w | x)}{\\pi_{\\text{ref}}(y_w | x)} - \\beta \\log \\frac{\\pi_\\theta(y_l | x)}{\\pi_{\\text{ref}}(y_l | x)} \\right)$$</div>

<p class="l-text">Where <code>y_w</code> is the chosen (winning) response, <code>y_l</code> is the rejected, <code>pi_ref</code> is the SFT model frozen, and <code>beta</code> (typically 0.1) controls how much the new policy is allowed to drift from the reference. You feed it preference pairs and it just trains.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — trl DPO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> trl <span class="kw">import</span> DPOTrainer, DPOConfig
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM

tok = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"./sft-out"</span>)
model    = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">"./sft-out"</span>, torch_dtype=<span class="str">"bfloat16"</span>)
ref_model = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">"./sft-out"</span>, torch_dtype=<span class="str">"bfloat16"</span>)

<span class="cm"># Each row has columns: prompt, chosen, rejected</span>
prefs = <span class="fn">load_dataset</span>(<span class="str">"HuggingFaceH4/ultrafeedback_binarized"</span>, split=<span class="str">"train_prefs[:10000]"</span>)

cfg = <span class="fn">DPOConfig</span>(
    output_dir=<span class="str">"./dpo-out"</span>,
    beta=<span class="num">0.1</span>,                            <span class="cm"># KL strength; lower = drift more</span>
    per_device_train_batch_size=<span class="num">4</span>,
    gradient_accumulation_steps=<span class="num">4</span>,
    learning_rate=<span class="num">5e-7</span>,                  <span class="cm"># MUCH smaller than SFT</span>
    num_train_epochs=<span class="num">1</span>,
    bf16=<span class="kw">True</span>,
    loss_type=<span class="str">"sigmoid"</span>,                 <span class="cm"># vanilla DPO; alternatives below</span>
)

trainer = <span class="fn">DPOTrainer</span>(model=model, ref_model=ref_model, tokenizer=tok,
                     train_dataset=prefs, args=cfg)
trainer.<span class="fn">train</span>()
</code></pre></div>

<p class="l-text"><strong>How the DPO wiring differs from SFT:</strong> notice we load <em>two</em> copies of the SFT checkpoint — one trainable (<code>model</code>) and one frozen (<code>ref_model</code>). The DPO loss needs both: it pushes <code>model</code>'s log-prob of the chosen response up and the rejected response down, but only <em>relative to</em> the frozen reference. <code>beta=0.1</code> is the KL anchor — smaller values let the model drift further from the SFT init. The learning rate is <code>5e-7</code>, two orders of magnitude smaller than the SFT lr, because DPO is correcting an already-trained model, not learning from scratch. The dataset must have <code>prompt / chosen / rejected</code> columns; <code>ultrafeedback_binarized</code> ships them.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Implement the DPO loss on a toy preference dataset. We use a sklearn LogisticRegression as the "policy" (so log-prob is well defined) and watch the chosen-vs-rejected margin grow.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Toy: 200 prompts, each with a chosen and a rejected response represented as feature vectors.</span>
<span class="cm"># A "good" response is closer to the prompt's preferred direction.</span>
n, d = <span class="num">200</span>, <span class="num">16</span>
prompts = rng.<span class="fn">standard_normal</span>((n, d))
preferred_dir = rng.<span class="fn">standard_normal</span>(d)
chosen   = prompts + <span class="num">0.3</span> * preferred_dir + <span class="num">0.1</span> * rng.<span class="fn">standard_normal</span>((n, d))
rejected = prompts - <span class="num">0.3</span> * preferred_dir + <span class="num">0.1</span> * rng.<span class="fn">standard_normal</span>((n, d))

<span class="cm"># "policy" = logistic-shaped scoring on a learned weight w</span>
<span class="kw">def</span> <span class="fn">log_prob</span>(w, x):
    <span class="str">"""Pseudo log-prob: -|x - w|^2 (closer to w -> higher logprob)."""</span>
    <span class="kw">return</span> -np.<span class="fn">sum</span>((x - w)**<span class="num">2</span>, axis=-<span class="num">1</span>)

w_ref = np.<span class="fn">zeros</span>(d)              <span class="cm"># reference policy = origin</span>
w     = np.<span class="fn">zeros</span>(d)              <span class="cm"># policy to train</span>

beta = <span class="num">0.1</span>; lr = <span class="num">0.05</span>
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2000</span>):
    <span class="cm"># DPO loss = -log sigmoid( beta * (log pi(yw) - log pi_ref(yw) - log pi(yl) + log pi_ref(yl)) )</span>
    log_pi_w   = <span class="fn">log_prob</span>(w,     chosen)
    log_pi_l   = <span class="fn">log_prob</span>(w,     rejected)
    log_ref_w  = <span class="fn">log_prob</span>(w_ref, chosen)
    log_ref_l  = <span class="fn">log_prob</span>(w_ref, rejected)

    margin = beta * ((log_pi_w - log_ref_w) - (log_pi_l - log_ref_l))
    loss   = -np.<span class="fn">mean</span>(np.<span class="fn">log</span>(<span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-margin)) + <span class="num">1e-12</span>))

    <span class="cm"># gradient via finite difference for clarity (in real code: autograd)</span>
    g = np.<span class="fn">zeros</span>(d); eps = <span class="num">1e-3</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(d):
        w_p = w.<span class="fn">copy</span>(); w_p[i] += eps
        log_pi_w_p = <span class="fn">log_prob</span>(w_p, chosen); log_pi_l_p = <span class="fn">log_prob</span>(w_p, rejected)
        margin_p = beta * ((log_pi_w_p - log_ref_w) - (log_pi_l_p - log_ref_l))
        loss_p = -np.<span class="fn">mean</span>(np.<span class="fn">log</span>(<span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-margin_p)) + <span class="num">1e-12</span>))
        g[i] = (loss_p - loss) / eps
    w -= lr * g
    <span class="kw">if</span> step % <span class="num">400</span> == <span class="num">0</span>:
        chosen_pref = <span class="fn">float</span>(np.<span class="fn">mean</span>(log_pi_w &gt; log_pi_l))
        <span class="fn">print</span>(f<span class="str">"step {step:4d}  loss={loss:.4f}  chosen-preferred={chosen_pref:.3f}"</span>)

<span class="fn">print</span>(f<span class="str">"\\nfinal: chosen-vs-rejected preference rate = "</span>
      f<span class="str">"{float(np.mean(log_prob(w, chosen) &gt; log_prob(w, rejected))):.3f}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>How the toy DPO loop plays out:</strong> the "policy" is a single weight vector <code>w</code> in d=16 — log-prob is just <code>-||x - w||^2</code>, so the closer <code>w</code> is to a vector the higher its log-prob. The reference policy <code>w_ref</code> stays at the origin (no drift baseline). Each step computes the four log-probs the DPO loss needs, takes the margin <code>beta * (delta_w_chosen - delta_w_rejected)</code>, and finite-differences the gradient (autograd would do this in a real trainer). Watch the printed preference rate climb from ~0.5 (random) toward 1.0 over 2000 steps — that's DPO learning, in 30 lines of numpy.</p>

</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ORPO — One-Step SFT + Preference</h2>
<p class="l-text"><strong>ORPO</strong> (Hong et al. 2024) sidesteps DPO's two-stage pipeline. Instead of SFT first then DPO, ORPO combines the two in one loss with a single fine-tune. It adds an odds-ratio penalty term to the standard SFT loss that suppresses the rejected responses.</p>

<div class="katex-block">$$\\mathcal{L}_{\\text{ORPO}} = \\mathcal{L}_{\\text{SFT}}(y_w) + \\lambda \\cdot \\mathcal{L}_{\\text{OR}}, \\quad \\mathcal{L}_{\\text{OR}} = -\\log \\sigma\\left( \\log \\frac{\\text{odds}(y_w)}{\\text{odds}(y_l)} \\right)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ORPO win</div><div class="card-body">One training run instead of two. No reference model needed (no extra forward pass). Faster, cheaper, simpler ops.</div></div>
<div class="calc-card"><div class="card-title">DPO win</div><div class="card-body">Slightly higher peak quality on hard datasets (more knobs). Reference model gives a stable anchor against drift.</div></div>
<div class="calc-card"><div class="card-title">Practical 2026</div><div class="card-body">ORPO is the new default for under-budget teams. DPO is still common when an SFT checkpoint already exists.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — trl ORPO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> trl <span class="kw">import</span> ORPOTrainer, ORPOConfig
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM

tok   = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"Qwen/Qwen2.5-7B"</span>)
model = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">"Qwen/Qwen2.5-7B"</span>, torch_dtype=<span class="str">"bfloat16"</span>)

prefs = <span class="fn">load_dataset</span>(<span class="str">"HuggingFaceH4/ultrafeedback_binarized"</span>, split=<span class="str">"train_prefs"</span>)

cfg = <span class="fn">ORPOConfig</span>(
    output_dir=<span class="str">"./orpo-out"</span>,
    beta=<span class="num">0.1</span>,                            <span class="cm"># the lambda in the formula</span>
    learning_rate=<span class="num">8e-6</span>,
    per_device_train_batch_size=<span class="num">4</span>,
    gradient_accumulation_steps=<span class="num">4</span>,
    num_train_epochs=<span class="num">1</span>,
    bf16=<span class="kw">True</span>,
)

trainer = <span class="fn">ORPOTrainer</span>(model=model, tokenizer=tok, train_dataset=prefs, args=cfg)
trainer.<span class="fn">train</span>()
<span class="cm"># Result: a model that is both instruction-tuned AND preference-aligned in one pass.</span>
</code></pre></div>

<p class="l-text"><strong>How ORPO simplifies the pipeline:</strong> compare this to the DPO snippet two sections back — there is no <code>ref_model</code>, no SFT pre-pass, no two-stage orchestration. The ORPOTrainer starts from the base Qwen-7B and the same <code>ultrafeedback_binarized</code> preference data, then computes the combined loss (SFT cross-entropy on the chosen response + a small odds-ratio penalty against the rejected one). The <code>beta=0.1</code> here is the lambda weight from the formula above. Learning rate <code>8e-6</code> is between SFT and DPO — it has to do real learning on the chosen response, not just realignment. One <code>trainer.train()</code> and you have an aligned model.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Full PPO-RLHF — When It's Still Worth It</h2>
<p class="l-text">DPO and friends made full RLHF unnecessary for most teams. Three cases where it's still the right answer:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Online learning</div><div class="card-body">You can collect preferences continuously from production traffic. PPO can ingest them in flight; DPO requires a fixed offline dataset.</div></div>
<div class="calc-card"><div class="card-title">Reward model = classifier</div><div class="card-body">When safety/quality scoring is best done by a learned reward model (not pairwise prefs), PPO uses it directly.</div></div>
<div class="calc-card"><div class="card-title">Multi-objective</div><div class="card-body">PPO can combine multiple reward heads (helpfulness + safety + brevity) with weighted sums and tunable KL.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — trl PPO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> trl <span class="kw">import</span> PPOTrainer, PPOConfig, AutoModelForCausalLMWithValueHead
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer

tok = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"./sft-out"</span>)
policy   = AutoModelForCausalLMWithValueHead.<span class="fn">from_pretrained</span>(<span class="str">"./sft-out"</span>)
ref      = AutoModelForCausalLMWithValueHead.<span class="fn">from_pretrained</span>(<span class="str">"./sft-out"</span>)
reward_model = ...   <span class="cm"># a fine-tuned classifier you scored alignment with</span>

cfg = <span class="fn">PPOConfig</span>(
    learning_rate=<span class="num">1e-6</span>,
    batch_size=<span class="num">64</span>, mini_batch_size=<span class="num">8</span>,
    init_kl_coef=<span class="num">0.2</span>, target_kl=<span class="num">6.0</span>, adap_kl_ctrl=<span class="kw">True</span>,    <span class="cm"># KL guardrail</span>
    cliprange=<span class="num">0.2</span>,
)

ppo = <span class="fn">PPOTrainer</span>(cfg, policy, ref_model=ref, tokenizer=tok)

<span class="kw">for</span> batch <span class="kw">in</span> dataloader:
    queries = batch[<span class="str">"input_ids"</span>]
    responses = ppo.<span class="fn">generate</span>(queries, max_new_tokens=<span class="num">128</span>)
    rewards = <span class="fn">reward_model</span>(responses)            <span class="cm"># shape (batch,)</span>
    stats = ppo.<span class="fn">step</span>(queries, responses, rewards)
    ppo.<span class="fn">log_stats</span>(stats, batch, rewards)
</code></pre></div>

<p class="l-text"><strong>How the PPO loop differs from DPO:</strong> notice the explicit per-batch loop — that is the cost. Each iteration generates responses with <code>ppo.generate</code> (a forward pass through the policy), scores them with an external <code>reward_model</code> (another forward pass), and then runs the PPO update which itself involves the policy, the reference (for KL), and the value head. The KL guardrails — <code>init_kl_coef</code>, <code>target_kl</code>, <code>adap_kl_ctrl</code> — keep the policy from drifting catastrophically from the SFT init; without them PPO famously collapses into degenerate outputs. <code>cliprange=0.2</code> is the standard PPO importance-sampling clip.</p>


<div class="calc-highlight">PPO is 5-10x more expensive than DPO per epoch (you do generation + scoring + a value-head update inside the loop). For most teams in 2026 the rule is: start with ORPO, only escalate to PPO when you measurably need online learning or multi-objective rewards.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Dataset Preparation — The Unglamorous 80%</h2>
<p class="l-text">Recipes get the headlines; data quality decides the outcome. The same DPO run on a deduplicated, decontaminated dataset and on raw scraped data can differ by 10+ MMLU points. Three preparation steps every team should run.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Deduplication</div><div class="card-body">MinHash + LSH at ~80% n-gram similarity. Ultrachat originally had ~30% near-duplicates; cleaned versions train faster and generalize better.</div></div>
<div class="calc-card"><div class="card-title">Decontamination</div><div class="card-body">Remove training examples that 13-gram match your eval set. Otherwise you measure memorization. Scripts: <code>lm-eval/decontamination</code>.</div></div>
<div class="calc-card"><div class="card-title">Mixing ratios</div><div class="card-body">Blend domains by sqrt-frequency or upsample the rarest skills. A good chat fine-tune might mix 60% general-instruct + 20% reasoning + 10% safety + 10% format-following.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> HashingVectorizer

<span class="cm"># Hash-based near-duplicate detection (a poor man's MinHash) on the reviews dataset</span>
texts = df_reviews[<span class="str">"text"</span>].<span class="fn">astype</span>(<span class="fn">str</span>).<span class="fn">tolist</span>()[:<span class="num">200</span>]
vec = <span class="fn">HashingVectorizer</span>(n_features=<span class="num">2</span>**<span class="num">12</span>, alternate_sign=<span class="kw">False</span>, norm=<span class="str">"l2"</span>)
X = vec.<span class="fn">fit_transform</span>(texts).<span class="fn">toarray</span>()

<span class="cm"># Pairwise cosine similarity</span>
S = X @ X.T
np.<span class="fn">fill_diagonal</span>(S, <span class="num">0</span>)

<span class="cm"># Flag pairs with similarity &gt; 0.9 as near-dup</span>
i, j = np.<span class="fn">where</span>(S &gt; <span class="num">0.9</span>)
keep_pairs = [(<span class="fn">int</span>(a), <span class="fn">int</span>(b)) <span class="kw">for</span> a, b <span class="kw">in</span> <span class="fn">zip</span>(i, j) <span class="kw">if</span> a &lt; b]
<span class="fn">print</span>(f<span class="str">"flagged near-dup pairs: {len(keep_pairs)}"</span>)
<span class="fn">print</span>(<span class="str">"examples:"</span>)
<span class="kw">for</span> a, b <span class="kw">in</span> keep_pairs[:<span class="num">3</span>]:
    <span class="fn">print</span>(f<span class="str">"  [{a}] {texts[a][:55]}"</span>)
    <span class="fn">print</span>(f<span class="str">"  [{b}] {texts[b][:55]}"</span>)
    <span class="fn">print</span>()

<span class="cm"># Mixing-ratio simulation: blend three "domains" with sqrt-frequency weighting</span>
domain_sizes = {<span class="str">"chat"</span>: 100_000, <span class="str">"reasoning"</span>: 25_000, <span class="str">"safety"</span>: 5_000}
sqrt_w = {k: np.<span class="fn">sqrt</span>(v) <span class="kw">for</span> k, v <span class="kw">in</span> domain_sizes.<span class="fn">items</span>()}
total = <span class="fn">sum</span>(sqrt_w.<span class="fn">values</span>())
ratios = {k: <span class="fn">round</span>(v/total, <span class="num">3</span>) <span class="kw">for</span> k, v <span class="kw">in</span> sqrt_w.<span class="fn">items</span>()}
<span class="fn">print</span>(<span class="str">"sqrt-frequency mix:"</span>, ratios)
</code></pre></div>

<p class="l-text"><strong>How this snippet imitates two production checks:</strong> the first block is a "poor man's MinHash" — HashingVectorizer turns 200 reviews into l2-normalized sparse vectors, then a single matrix multiply gives the full pairwise cosine matrix. Anything above 0.9 is flagged as a near-duplicate; we print three concrete pairs so you can spot what survives an apparently-clean dataset. The second block is the mixing-ratio rule: take square roots of domain sizes and normalize — this upweights smaller domains relative to a naive token-count blend, so reasoning (25k) and safety (5k) don't get drowned by chat (100k). Real pipelines tune these knobs per recipe.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The Eval Suite — Run This Before Shipping</h2>
<p class="l-text">A fine-tuned model needs at minimum these four signals before you let it touch production traffic. Skip any one and you'll regret it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Capability</div><div class="card-body">MMLU-Pro + GSM8K + HellaSwag via lm-eval-harness. Catches catastrophic forgetting from over-fine-tuning on a narrow domain.</div></div>
<div class="calc-card"><div class="card-title">Instruction-following</div><div class="card-body">IFEval and MT-Bench. Measures whether the model actually obeys prompts in the post-fine-tune format.</div></div>
<div class="calc-card"><div class="card-title">Safety</div><div class="card-body">XSTest (over-refusal) + ToxiGen + a small in-house adversarial set. Most fine-tunes regress on at least one of these — measure or be surprised.</div></div>
<div class="calc-card"><div class="card-title">Alignment with target</div><div class="card-body">Held-out preference pairs from your own data, scored as win-rate vs the SFT baseline. The metric closest to actual product quality.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — eval pipeline)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Standardized eval pipeline you can drop into a CI job</span>
<span class="kw">import</span> subprocess, json, pathlib

MODEL = <span class="str">"./orpo-out"</span>

<span class="cm"># 1. Capability via lm-eval</span>
subprocess.<span class="fn">run</span>([
    <span class="str">"lm_eval"</span>, <span class="str">"--model"</span>, <span class="str">"vllm"</span>,
    <span class="str">"--model_args"</span>, f<span class="str">"pretrained={MODEL},dtype=bfloat16"</span>,
    <span class="str">"--tasks"</span>, <span class="str">"mmlu_pro,gsm8k,hellaswag,truthfulqa"</span>,
    <span class="str">"--num_fewshot"</span>, <span class="str">"5"</span>,
    <span class="str">"--output_path"</span>, <span class="str">"./eval/capability.json"</span>,
])

<span class="cm"># 2. Instruction-following via IFEval</span>
subprocess.<span class="fn">run</span>([
    <span class="str">"lm_eval"</span>, <span class="str">"--model"</span>, <span class="str">"vllm"</span>,
    <span class="str">"--model_args"</span>, f<span class="str">"pretrained={MODEL}"</span>,
    <span class="str">"--tasks"</span>, <span class="str">"ifeval"</span>,
    <span class="str">"--output_path"</span>, <span class="str">"./eval/ifeval.json"</span>,
])

<span class="cm"># 3. Safety: XSTest over-refusal</span>
subprocess.<span class="fn">run</span>([
    <span class="str">"lm_eval"</span>, <span class="str">"--model"</span>, <span class="str">"vllm"</span>,
    <span class="str">"--model_args"</span>, f<span class="str">"pretrained={MODEL}"</span>,
    <span class="str">"--tasks"</span>, <span class="str">"xstest"</span>,
    <span class="str">"--output_path"</span>, <span class="str">"./eval/safety.json"</span>,
])

<span class="cm"># 4. Held-out preference win rate (custom)</span>
<span class="kw">def</span> <span class="fn">compare_models</span>(model_a, model_b, prompts_path, judge=<span class="str">"gpt-4o-mini"</span>):
    <span class="str">"""Pairwise comparison via an LLM judge. Returns win/tie/lose counts."""</span>
    <span class="cm"># ... scaffold left to the reader; tools: judges/Arena-style</span>
    <span class="kw">return</span> {<span class="str">"win"</span>: <span class="num">0</span>, <span class="str">"tie"</span>: <span class="num">0</span>, <span class="str">"lose"</span>: <span class="num">0</span>}

results = {p.stem: json.<span class="fn">loads</span>(p.<span class="fn">read_text</span>()) <span class="kw">for</span> p <span class="kw">in</span> pathlib.<span class="fn">Path</span>(<span class="str">"./eval"</span>).<span class="fn">glob</span>(<span class="str">"*.json"</span>)}
<span class="fn">print</span>(json.<span class="fn">dumps</span>(results, indent=<span class="num">2</span>)[:<span class="num">500</span>])
</code></pre></div>

<p class="l-text"><strong>How the four eval calls map to the four signals:</strong> three identical-shape <code>lm_eval</code> invocations cover capability, instruction-following and safety — same CLI, different task lists, all results dumped as JSON so a CI job can pass/fail on thresholds. The fourth signal, hardest to automate, is <code>compare_models</code> — a pairwise LLM-judge comparison against the SFT baseline on your own held-out prompts. The function body is left as a sketch on purpose: every team's judge prompts and arena format differ; what matters is wiring all four results into one JSON blob the CI can grep for regressions before promotion.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The Recipe Tree — Pick One</h2>
<p class="l-text">Walk this tree. The first match is usually the right answer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Domain SFT only</div><div class="card-body">Have only demonstration data, no preferences. Run SFT on cleaned data + LoRA + bf16. 1-3 epochs. Eval suite. Ship.</div></div>
<div class="calc-card"><div class="card-title">Light alignment, single GPU</div><div class="card-body">Have preference pairs and a tight budget. Run ORPO end-to-end. One training pass, no reference model. Best $-per-quality in 2026.</div></div>
<div class="calc-card"><div class="card-title">Already SFT'd, want to align</div><div class="card-body">Have an SFT checkpoint + preference pairs. Run DPO with beta=0.1 on top. Two-stage but each stage is short.</div></div>
<div class="calc-card"><div class="card-title">Multi-objective or online</div><div class="card-body">Need to combine helpfulness, safety, formatting rewards, or learn from live traffic. Train a reward model, run PPO. Pay the 5x compute premium.</div></div>
<div class="calc-card"><div class="card-title">No preferences at all</div><div class="card-body">Use Constitutional AI / RLAIF: bootstrap synthetic preferences with a stronger model. Then back to ORPO/DPO.</div></div>
<div class="calc-card"><div class="card-title">Tiny dataset (under 1k pairs)</div><div class="card-body">KTO (Kahneman-Tversky Optimization). Works on unpaired binary feedback ("good"/"bad") — easier to collect.</div></div>
</div>

<p class="l-text">Two patterns to internalize. First: <strong>data quality &gt; recipe choice</strong>. A clean SFT often beats a contaminated DPO. Second: <strong>always run the full eval suite</strong> — capability AND instruction-following AND safety AND your in-house judge — before shipping a fine-tune. The recipes give you a model; the evals tell you whether to trust it.</p>
</div>
`,
tr: `<p class="l-text"><strong>Önceden eğitim sana her şeyi bilen ama hiçbir şeyi takip etmeyen bir model verir. İnce ayar onu yararlı hâle getirme yoludur.</strong> Tarif uzayı 2023-2025'te patladı: instruction'larda SFT, sonra DPO, sonra ORPO, sonra PPO ile RLHF, sonra KTO, sonra RLAIF. Çoğu ekibin hepsini bilmesi gerekmez — verisine, hesap bütçesine ve aşağı-akış metriğine uyanı bilmesi gerekir. Bu ders saha kılavuzudur.</p>

<p class="l-text">Yukarıdan aşağıya yürüyeceğiz: SFT (denetimli ince ayar) evrensel ilk adım olarak, sonra çoğu kullanım durumunda tam RLHF'in yerini alan tercih-optimizasyon ailesi (DPO -&gt; ORPO -&gt; KTO), tam PPO-RLHF'in hâlâ ne zaman zahmete değer olduğu ve sıkça gözden kaçan yarı — veri kümesi hazırlığı ve tarifin işe yarayıp yaramadığını söyleyen değerlendirme paketi. Her adımın laptop'unda 7B model gerektirmeden temel mekaniği yakalayan sklearn kullanan çalıştırılabilir bir Pyodide demosu var.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>SFT chat şablonları ve chat-format sızıntısının ince ayarları nasıl bozduğu</li>
<li>DPO loss türetmesi — "RL'siz RLHF" neden çalışır</li>
<li>ORPO ve KTO — 2024-25 tek-aşamalı tercih loss'ları ailesi</li>
<li>Tam PPO-RLHF'in 5x karmaşıklık primine ne zaman değdiği</li>
<li>Veri kümesi hazırlığı: deduplikasyon, dekontaminasyon, karıştırma oranları</li>
<li>Yayınlamadan önce her ince ayarın çalıştırması gereken değerlendirme paketi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. SFT — Evrensel İlk Adım</h2>
<p class="l-text">Her modern ince ayar <strong>Denetimli İnce Ayar</strong> ile başlar: (prompt, yanıt) çiftlerinde standart cross-entropy. Hile chat şablonudur — base modelin hiç görmediği <code>&lt;|user|&gt;</code>, <code>&lt;|assistant|&gt;</code>, <code>&lt;|im_start|&gt;</code> gibi biçimlendirme token'ları. Bunu yanlış yap ve modeli sonsuza kadar literal "&lt;|user|&gt;" string'leri üretmeye ince ayarlamış olursun.</p>

<div class="katex-block">$$\\mathcal{L}_{\\text{SFT}} = -\\sum_{t \\in \\text{response}} \\log P_\\theta(y_t \\mid y_{&lt;t},\\ x_{\\text{prompt}})$$</div>

<p class="l-text">Toplamın yalnızca <em>yanıt token'ları üzerinde</em> olduğuna dikkat et. Prompt token'larında loss maskelemesi şarttır — aksi hâlde modeli kullanıcının sorusunu tahmin etmeye eğitirsin ki bu hem anlamsız hem zararlıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — trl SFT)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> trl <span class="kw">import</span> SFTTrainer, SFTConfig
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM

tok   = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"Qwen/Qwen2.5-7B"</span>)
model = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">"Qwen/Qwen2.5-7B"</span>, torch_dtype=<span class="str">"bfloat16"</span>)

<span class="cm"># Standart bir instruction veri kümesi; trl chat-şablonu biçimlendirmesini halleder</span>
ds = <span class="fn">load_dataset</span>(<span class="str">"HuggingFaceH4/ultrachat_200k"</span>, split=<span class="str">"train_sft[:5000]"</span>)

cfg = <span class="fn">SFTConfig</span>(
    output_dir=<span class="str">"./sft-out"</span>,
    per_device_train_batch_size=<span class="num">4</span>,
    gradient_accumulation_steps=<span class="num">8</span>,
    num_train_epochs=<span class="num">1</span>,
    learning_rate=<span class="num">2e-5</span>,
    bf16=<span class="kw">True</span>,
    gradient_checkpointing=<span class="kw">True</span>,
    packing=<span class="kw">True</span>,                       <span class="cm"># GPU verimliliği için kısa örnekleri concat et</span>
    max_seq_length=<span class="num">2048</span>,
    optim=<span class="str">"paged_adamw_8bit"</span>,
    eos_token=tok.eos_token,            <span class="cm"># KRİTİK: örnekler arası loss sızıntısını önle</span>
)

trainer = <span class="fn">SFTTrainer</span>(
    model=model, tokenizer=tok,
    train_dataset=ds,
    args=cfg,
    formatting_func=<span class="kw">lambda</span> ex: tok.<span class="fn">apply_chat_template</span>(ex[<span class="str">"messages"</span>], tokenize=<span class="kw">False</span>),
)
trainer.<span class="fn">train</span>()
</code></pre></div>

<p class="l-text"><strong>SFT kurulumu nasıl bağlanıyor:</strong> tokenizer ve Qwen-7B base modeli birlikte yüklenir — bu sayede chat-template işleyicileri eşleşir. <code>ultrachat_200k</code> Apache Arrow shard'ları olarak gelir (tembel-eşlenmiş) ve <code>formatting_func</code> her satıra <code>apply_chat_template</code> uygular — <code>&lt;|user|&gt;</code> / <code>&lt;|assistant|&gt;</code> token'ları işte burada eklenir. Belirgin olmayan düğmeler: <code>packing=True</code> (kısa örnekleri 2048 token'lık dizilere birleştirir, GPU verimliliği için), <code>paged_adamw_8bit</code> (bellek için sayfalı optimizer) ve <code>eos_token=tok.eos_token</code> (yorum nedenini söylüyor). Sonra trainer batch'leri döner, prompt token'larında loss'u maskeler ve checkpoint atar — hepsi <code>trainer.train()</code> arkasında.</p>


<div class="calc-highlight">En yaygın SFT bug'ı: <code>eos_token</code>'ı unutmak. Örnekler EOS olmadan birleşirse loss sınırlar arasında sızar ve model "bir asistan turundan sonra başka bir asistan turu gelir" öğrenir — çıkarımda sonsuza kadar konuşmasına neden olur.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. SFT'nin Sınırları</h2>
<p class="l-text">SFT bir modele iyi yanıtları taklit etmeyi öğretir. Modele kötü olanları tanımayı öğretmez. SFT'den sonra model hâlâ halüsinasyon yapar, hâlâ yağcılık eder ve gösterilerin asla açıkça yasaklamadığı düşük kaliteli çıktılar üretir. Tercih optimizasyonu bu problem için icat edildi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SFT öğretir</div><div class="card-body">"İyi bir yanıt böyle görünür."</div></div>
<div class="calc-card"><div class="card-title">Tercih optimizasyonu ekler</div><div class="card-body">"Bu yanıt şundan daha iyidir — olasılık kütlesini seçileni tarafa it ve reddedilenden uzaklaştır."</div></div>
<div class="calc-card"><div class="card-title">RLHF dahası ekler</div><div class="card-body">"Öğrenilmiş bir reward model herhangi bir adayı puanlar; çok örnekle, SFT modeline KL kısıtı altında yüksek reward'a doğru optimize et."</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. DPO — Direct Preference Optimization</h2>
<p class="l-text"><strong>Direct Preference Optimization</strong> (Rafailov vd. 2023) alana çarpan yıldırımdır. Anahtar içgörü: Bradley-Terry ikili karşılaştırma varsayımına dayalı bir reward modeli altında, optimal politika referans politika cinsinden kapalı forma sahiptir. Dolayısıyla politikayı doğrudan (seçilen, reddedilen) çiftleri üzerinde optimize edebilirsin — reward modeli yok, PPO yok, ayrı bir terim olarak KL hilesi yok. KL kısıtı içine pişirilmiştir.</p>

<div class="katex-block">$$\\mathcal{L}_{\\text{DPO}} = -\\log \\sigma\\left( \\beta \\log \\frac{\\pi_\\theta(y_w | x)}{\\pi_{\\text{ref}}(y_w | x)} - \\beta \\log \\frac{\\pi_\\theta(y_l | x)}{\\pi_{\\text{ref}}(y_l | x)} \\right)$$</div>

<p class="l-text">Burada <code>y_w</code> seçilen (kazanan) yanıt, <code>y_l</code> reddedilen, <code>pi_ref</code> donmuş SFT modeli ve <code>beta</code> (tipik 0.1) yeni politikanın referanstan ne kadar uzaklaşmasına izin verildiğini kontrol eder. Tercih çiftleri verirsin ve eğitir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — trl DPO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> trl <span class="kw">import</span> DPOTrainer, DPOConfig
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM

tok = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"./sft-out"</span>)
model    = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">"./sft-out"</span>, torch_dtype=<span class="str">"bfloat16"</span>)
ref_model = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">"./sft-out"</span>, torch_dtype=<span class="str">"bfloat16"</span>)

<span class="cm"># Her satırda sütunlar var: prompt, chosen, rejected</span>
prefs = <span class="fn">load_dataset</span>(<span class="str">"HuggingFaceH4/ultrafeedback_binarized"</span>, split=<span class="str">"train_prefs[:10000]"</span>)

cfg = <span class="fn">DPOConfig</span>(
    output_dir=<span class="str">"./dpo-out"</span>,
    beta=<span class="num">0.1</span>,                            <span class="cm"># KL gücü; düşük = daha çok sapar</span>
    per_device_train_batch_size=<span class="num">4</span>,
    gradient_accumulation_steps=<span class="num">4</span>,
    learning_rate=<span class="num">5e-7</span>,                  <span class="cm"># SFT'den ÇOK daha küçük</span>
    num_train_epochs=<span class="num">1</span>,
    bf16=<span class="kw">True</span>,
    loss_type=<span class="str">"sigmoid"</span>,                 <span class="cm"># vanilla DPO; alternatifler aşağıda</span>
)

trainer = <span class="fn">DPOTrainer</span>(model=model, ref_model=ref_model, tokenizer=tok,
                     train_dataset=prefs, args=cfg)
trainer.<span class="fn">train</span>()
</code></pre></div>

<p class="l-text"><strong>DPO bağlantısı SFT'den nasıl ayrılıyor:</strong> SFT checkpoint'inin <em>iki</em> kopyasını yüklediğimize dikkat et — biri eğitilebilir (<code>model</code>), biri donmuş (<code>ref_model</code>). DPO loss'u her ikisine ihtiyaç duyar: <code>model</code>'in seçilen yanıttaki log-olasılığını yukarı, reddedilenin log-olasılığını aşağı iter — ama yalnızca donmuş referansa <em>göreceli olarak</em>. <code>beta=0.1</code> KL çapasıdır — küçük değerler SFT başlangıcından daha çok sapmaya izin verir. Learning rate <code>5e-7</code>, SFT'nin iki büyüklük mertebesi altındadır, çünkü DPO sıfırdan öğrenmiyor, zaten eğitilmiş bir modeli düzeltiyor. Veri kümesinin <code>prompt / chosen / rejected</code> sütunları olmalı; <code>ultrafeedback_binarized</code> bunları sağlar.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak bir tercih veri kümesinde DPO loss'unu uygula. "Politika" olarak sklearn LogisticRegression kullanıyoruz (böylece log-olasılık iyi tanımlı) ve seçilen-vs-reddedilen marjının büyüdüğünü izliyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Oyuncak: 200 prompt, her birinin özellik vektörleri olarak temsil edilen seçilen ve reddedilen yanıtı.</span>
<span class="cm"># "İyi" bir yanıt prompt'un tercih edilen yönüne daha yakındır.</span>
n, d = <span class="num">200</span>, <span class="num">16</span>
prompts = rng.<span class="fn">standard_normal</span>((n, d))
preferred_dir = rng.<span class="fn">standard_normal</span>(d)
chosen   = prompts + <span class="num">0.3</span> * preferred_dir + <span class="num">0.1</span> * rng.<span class="fn">standard_normal</span>((n, d))
rejected = prompts - <span class="num">0.3</span> * preferred_dir + <span class="num">0.1</span> * rng.<span class="fn">standard_normal</span>((n, d))

<span class="cm"># "politika" = öğrenilmiş ağırlık w üzerinde lojistik şekilli puanlama</span>
<span class="kw">def</span> <span class="fn">log_prob</span>(w, x):
    <span class="str">"""Pseudo log-olasılık: -|x - w|^2 (w'ye yakın -> daha yüksek logprob)."""</span>
    <span class="kw">return</span> -np.<span class="fn">sum</span>((x - w)**<span class="num">2</span>, axis=-<span class="num">1</span>)

w_ref = np.<span class="fn">zeros</span>(d)              <span class="cm"># referans politika = orijin</span>
w     = np.<span class="fn">zeros</span>(d)              <span class="cm"># eğitilecek politika</span>

beta = <span class="num">0.1</span>; lr = <span class="num">0.05</span>
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2000</span>):
    <span class="cm"># DPO loss = -log sigmoid( beta * (log pi(yw) - log pi_ref(yw) - log pi(yl) + log pi_ref(yl)) )</span>
    log_pi_w   = <span class="fn">log_prob</span>(w,     chosen)
    log_pi_l   = <span class="fn">log_prob</span>(w,     rejected)
    log_ref_w  = <span class="fn">log_prob</span>(w_ref, chosen)
    log_ref_l  = <span class="fn">log_prob</span>(w_ref, rejected)

    margin = beta * ((log_pi_w - log_ref_w) - (log_pi_l - log_ref_l))
    loss   = -np.<span class="fn">mean</span>(np.<span class="fn">log</span>(<span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-margin)) + <span class="num">1e-12</span>))

    <span class="cm"># netlik için sonlu fark gradyanı (gerçek kodda: autograd)</span>
    g = np.<span class="fn">zeros</span>(d); eps = <span class="num">1e-3</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(d):
        w_p = w.<span class="fn">copy</span>(); w_p[i] += eps
        log_pi_w_p = <span class="fn">log_prob</span>(w_p, chosen); log_pi_l_p = <span class="fn">log_prob</span>(w_p, rejected)
        margin_p = beta * ((log_pi_w_p - log_ref_w) - (log_pi_l_p - log_ref_l))
        loss_p = -np.<span class="fn">mean</span>(np.<span class="fn">log</span>(<span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-margin_p)) + <span class="num">1e-12</span>))
        g[i] = (loss_p - loss) / eps
    w -= lr * g
    <span class="kw">if</span> step % <span class="num">400</span> == <span class="num">0</span>:
        chosen_pref = <span class="fn">float</span>(np.<span class="fn">mean</span>(log_pi_w &gt; log_pi_l))
        <span class="fn">print</span>(f<span class="str">"adım {step:4d}  loss={loss:.4f}  seçilen-tercih={chosen_pref:.3f}"</span>)

<span class="fn">print</span>(f<span class="str">"\\nson: seçilen-vs-reddedilen tercih oranı = "</span>
      f<span class="str">"{float(np.mean(log_prob(w, chosen) &gt; log_prob(w, rejected))):.3f}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>Oyuncak DPO döngüsü nasıl işliyor:</strong> "politika" d=16'da tek bir ağırlık vektörü <code>w</code> — log-olasılık sadece <code>-||x - w||^2</code>, yani <code>w</code> bir vektöre ne kadar yakınsa o vektörün log-olasılığı o kadar yüksek. Referans politika <code>w_ref</code> orijinde kalır (sapma baseline'ı yok). Her adım DPO loss'unun ihtiyaç duyduğu dört log-olasılığı hesaplar, <code>beta * (delta_w_chosen - delta_w_rejected)</code> marjını alır ve sonlu farkla gradyanı çıkarır (gerçek bir trainer'da autograd bunu yapar). Yazdırılan tercih oranının 2000 adımda ~0.5'ten (rastgele) 1.0'a doğru tırmandığını izle — bu, 30 satır numpy içinde DPO öğreniyor demektir.</p>


</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ORPO — Tek Adımlı SFT + Tercih</h2>
<p class="l-text"><strong>ORPO</strong> (Hong vd. 2024) DPO'nun iki aşamalı pipeline'ını atlatır. Önce SFT sonra DPO yerine, ORPO ikisini tek bir loss'ta tek bir ince ayarda birleştirir. Standart SFT loss'una reddedilen yanıtları bastıran odds-oranı ceza terimi ekler.</p>

<div class="katex-block">$$\\mathcal{L}_{\\text{ORPO}} = \\mathcal{L}_{\\text{SFT}}(y_w) + \\lambda \\cdot \\mathcal{L}_{\\text{OR}}, \\quad \\mathcal{L}_{\\text{OR}} = -\\log \\sigma\\left( \\log \\frac{\\text{odds}(y_w)}{\\text{odds}(y_l)} \\right)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ORPO kazancı</div><div class="card-body">İki yerine bir eğitim çalışması. Referans model gerekmiyor (ekstra ileri geçiş yok). Daha hızlı, daha ucuz, daha basit ops.</div></div>
<div class="calc-card"><div class="card-title">DPO kazancı</div><div class="card-body">Zor veri kümelerinde biraz daha yüksek tepe kalitesi (daha çok düğme). Referans model sapmaya karşı kararlı bir çapa sağlar.</div></div>
<div class="calc-card"><div class="card-title">2026 pratiği</div><div class="card-body">ORPO bütçe-altı ekipler için yeni varsayılan. SFT checkpoint'i zaten varsa DPO hâlâ yaygın.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — trl ORPO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> trl <span class="kw">import</span> ORPOTrainer, ORPOConfig
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM

tok   = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"Qwen/Qwen2.5-7B"</span>)
model = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">"Qwen/Qwen2.5-7B"</span>, torch_dtype=<span class="str">"bfloat16"</span>)

prefs = <span class="fn">load_dataset</span>(<span class="str">"HuggingFaceH4/ultrafeedback_binarized"</span>, split=<span class="str">"train_prefs"</span>)

cfg = <span class="fn">ORPOConfig</span>(
    output_dir=<span class="str">"./orpo-out"</span>,
    beta=<span class="num">0.1</span>,                            <span class="cm"># formüldeki lambda</span>
    learning_rate=<span class="num">8e-6</span>,
    per_device_train_batch_size=<span class="num">4</span>,
    gradient_accumulation_steps=<span class="num">4</span>,
    num_train_epochs=<span class="num">1</span>,
    bf16=<span class="kw">True</span>,
)

trainer = <span class="fn">ORPOTrainer</span>(model=model, tokenizer=tok, train_dataset=prefs, args=cfg)
trainer.<span class="fn">train</span>()
<span class="cm"># Sonuç: tek bir geçişte hem instruction-tuned HEM tercih-hizalanmış model.</span>
</code></pre></div>

<p class="l-text"><strong>ORPO pipeline'ı nasıl basitleştiriyor:</strong> bunu iki bölüm geriye DPO parçacığıyla karşılaştır — <code>ref_model</code> yok, SFT ön-geçişi yok, iki aşamalı orkestrasyon yok. ORPOTrainer base Qwen-7B'den ve aynı <code>ultrafeedback_binarized</code> tercih verisinden başlar, sonra birleşik loss'u hesaplar (seçilen yanıtta SFT cross-entropy + reddedilene karşı küçük bir odds-oranı cezası). Buradaki <code>beta=0.1</code> formüldeki lambda ağırlığıdır. Learning rate <code>8e-6</code>, SFT ile DPO arasındadır — seçilen yanıtta gerçek öğrenme yapması lazım, sadece yeniden hizalama değil. Tek <code>trainer.train()</code> ve hizalanmış modelin var.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tam PPO-RLHF — Hâlâ Ne Zaman Buna Değer</h2>
<p class="l-text">DPO ve dostları tam RLHF'i çoğu ekip için gereksiz kıldı. Hâlâ doğru cevap olduğu üç durum:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Online öğrenme</div><div class="card-body">Üretim trafiğinden tercihleri sürekli toplayabilirsin. PPO uçuşta alabilir; DPO sabit offline veri kümesi gerektirir.</div></div>
<div class="calc-card"><div class="card-title">Reward modeli = sınıflandırıcı</div><div class="card-body">Güvenlik/kalite puanlaması en iyi öğrenilmiş reward modeliyle yapıldığında (ikili tercihler değil), PPO onu doğrudan kullanır.</div></div>
<div class="calc-card"><div class="card-title">Çok-amaçlı</div><div class="card-body">PPO birden fazla reward kafasını (yardımseverlik + güvenlik + kısalık) ağırlıklı toplam ve ayarlanabilir KL ile birleştirebilir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — trl PPO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> trl <span class="kw">import</span> PPOTrainer, PPOConfig, AutoModelForCausalLMWithValueHead
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer

tok = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"./sft-out"</span>)
policy   = AutoModelForCausalLMWithValueHead.<span class="fn">from_pretrained</span>(<span class="str">"./sft-out"</span>)
ref      = AutoModelForCausalLMWithValueHead.<span class="fn">from_pretrained</span>(<span class="str">"./sft-out"</span>)
reward_model = ...   <span class="cm"># hizalamayı puanladığın ince ayarlı bir sınıflandırıcı</span>

cfg = <span class="fn">PPOConfig</span>(
    learning_rate=<span class="num">1e-6</span>,
    batch_size=<span class="num">64</span>, mini_batch_size=<span class="num">8</span>,
    init_kl_coef=<span class="num">0.2</span>, target_kl=<span class="num">6.0</span>, adap_kl_ctrl=<span class="kw">True</span>,    <span class="cm"># KL koruma çubuğu</span>
    cliprange=<span class="num">0.2</span>,
)

ppo = <span class="fn">PPOTrainer</span>(cfg, policy, ref_model=ref, tokenizer=tok)

<span class="kw">for</span> batch <span class="kw">in</span> dataloader:
    queries = batch[<span class="str">"input_ids"</span>]
    responses = ppo.<span class="fn">generate</span>(queries, max_new_tokens=<span class="num">128</span>)
    rewards = <span class="fn">reward_model</span>(responses)            <span class="cm"># şekil (batch,)</span>
    stats = ppo.<span class="fn">step</span>(queries, responses, rewards)
    ppo.<span class="fn">log_stats</span>(stats, batch, rewards)
</code></pre></div>

<p class="l-text"><strong>PPO döngüsü DPO'dan nasıl ayrılıyor:</strong> açık batch başı döngüye dikkat et — maliyet işte burada. Her iterasyon önce <code>ppo.generate</code> ile yanıt üretir (policy üzerinde bir ileri geçiş), ardından dışsal bir <code>reward_model</code> ile puanlar (başka bir ileri geçiş), sonra PPO güncellemesi çalıştırılır — bu da policy, referans (KL için) ve value head'in tümünü içerir. KL koruma çubukları — <code>init_kl_coef</code>, <code>target_kl</code>, <code>adap_kl_ctrl</code> — policy'nin SFT başlangıcından felaketsel sapmasını engeller; onlarsız PPO meşhur şekilde dejenere çıktılara çöker. <code>cliprange=0.2</code> standart PPO importance-sampling clip'idir.</p>


<div class="calc-highlight">PPO epoch başına DPO'dan 5-10x daha pahalıdır (döngü içinde üretim + puanlama + value-kafa güncellemesi yaparsın). 2026'da çoğu ekip için kural: ORPO ile başla, yalnızca online öğrenme veya çok-amaçlı reward'lara ölçülebilir şekilde ihtiyacın olduğunda PPO'ya yükselt.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Veri Kümesi Hazırlığı — Göz Alıcı Olmayan %80</h2>
<p class="l-text">Manşetleri tarifler alır; sonucu veri kalitesi belirler. Aynı DPO çalışması deduplike ve dekontamine bir veri kümesinde ve ham kazınmış veride 10+ MMLU puanı farklı olabilir. Her ekibin çalıştırması gereken üç hazırlık adımı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Deduplikasyon</div><div class="card-body">~%80 n-gram benzerliğinde MinHash + LSH. Ultrachat'ın orijinalinde ~%30 yakın-tekrar vardı; temizlenmiş sürümler daha hızlı eğitilir ve daha iyi genelleşir.</div></div>
<div class="calc-card"><div class="card-title">Dekontaminasyon</div><div class="card-body">Değerlendirme kümen ile 13-gram eşleşen eğitim örneklerini kaldır. Aksi hâlde ezberi ölçersin. Script'ler: <code>lm-eval/decontamination</code>.</div></div>
<div class="calc-card"><div class="card-title">Karıştırma oranları</div><div class="card-body">Alanları karekök-frekansla karıştır veya en nadir becerileri yukarı-örnekle. İyi bir sohbet ince ayarı %60 genel-instruct + %20 akıl yürütme + %10 güvenlik + %10 biçim takip karıştırabilir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> HashingVectorizer

<span class="cm"># reviews veri kümesinde hash-tabanlı yakın-tekrar tespiti (yoksul adamın MinHash'i)</span>
texts = df_reviews[<span class="str">"text"</span>].<span class="fn">astype</span>(<span class="fn">str</span>).<span class="fn">tolist</span>()[:<span class="num">200</span>]
vec = <span class="fn">HashingVectorizer</span>(n_features=<span class="num">2</span>**<span class="num">12</span>, alternate_sign=<span class="kw">False</span>, norm=<span class="str">"l2"</span>)
X = vec.<span class="fn">fit_transform</span>(texts).<span class="fn">toarray</span>()

<span class="cm"># İkili kosinüs benzerliği</span>
S = X @ X.T
np.<span class="fn">fill_diagonal</span>(S, <span class="num">0</span>)

<span class="cm"># Benzerliği &gt; 0.9 olan çiftleri yakın-tekrar olarak işaretle</span>
i, j = np.<span class="fn">where</span>(S &gt; <span class="num">0.9</span>)
keep_pairs = [(<span class="fn">int</span>(a), <span class="fn">int</span>(b)) <span class="kw">for</span> a, b <span class="kw">in</span> <span class="fn">zip</span>(i, j) <span class="kw">if</span> a &lt; b]
<span class="fn">print</span>(f<span class="str">"işaretlenen yakın-tekrar çifti: {len(keep_pairs)}"</span>)
<span class="fn">print</span>(<span class="str">"örnekler:"</span>)
<span class="kw">for</span> a, b <span class="kw">in</span> keep_pairs[:<span class="num">3</span>]:
    <span class="fn">print</span>(f<span class="str">"  [{a}] {texts[a][:55]}"</span>)
    <span class="fn">print</span>(f<span class="str">"  [{b}] {texts[b][:55]}"</span>)
    <span class="fn">print</span>()

<span class="cm"># Karıştırma-oranı simülasyonu: üç "alan"ı karekök-frekans ağırlığıyla harmanla</span>
domain_sizes = {<span class="str">"chat"</span>: 100_000, <span class="str">"reasoning"</span>: 25_000, <span class="str">"safety"</span>: 5_000}
sqrt_w = {k: np.<span class="fn">sqrt</span>(v) <span class="kw">for</span> k, v <span class="kw">in</span> domain_sizes.<span class="fn">items</span>()}
total = <span class="fn">sum</span>(sqrt_w.<span class="fn">values</span>())
ratios = {k: <span class="fn">round</span>(v/total, <span class="num">3</span>) <span class="kw">for</span> k, v <span class="kw">in</span> sqrt_w.<span class="fn">items</span>()}
<span class="fn">print</span>(<span class="str">"karekök-frekans karışım:"</span>, ratios)
</code></pre></div>

<p class="l-text"><strong>Bu parça iki üretim kontrolünü nasıl taklit ediyor:</strong> ilk blok "yoksul adamın MinHash'i" — HashingVectorizer 200 yorumu l2-normalize sparse vektörlere çevirir, sonra tek bir matris çarpımı tüm ikili kosinüs matrisini verir. 0.9'un üzerindeki herhangi bir şey yakın-tekrar olarak işaretlenir; ne tür şeylerin görünüşte temiz bir veri kümesinde hayatta kaldığını görebilesin diye üç somut çifti yazdırıyoruz. İkinci blok karıştırma oranı kuralıdır: alan boyutlarının karekökünü al ve normalize et — bu, naif token-sayısı karışımına göre küçük alanları yukarı ağırlıklandırır, böylece reasoning (25k) ve safety (5k) chat (100k) tarafından boğulmaz. Gerçek pipeline'lar bu düğmeleri tarife göre ayarlar.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Değerlendirme Paketi — Yayınlamadan Önce Bunu Çalıştır</h2>
<p class="l-text">İnce ayarlı bir model üretim trafiğine dokunmasına izin vermeden önce en azından bu dört sinyale ihtiyaç duyar. Birini bile atla ve pişman ol.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yetenek</div><div class="card-body">lm-eval-harness üzerinden MMLU-Pro + GSM8K + HellaSwag. Dar bir alanda aşırı ince ayardan kaynaklı felaketsel unutmayı yakalar.</div></div>
<div class="calc-card"><div class="card-title">Instruction takibi</div><div class="card-body">IFEval ve MT-Bench. Modelin ince-ayar-sonrası biçimde gerçekten prompt'lara uyup uymadığını ölçer.</div></div>
<div class="calc-card"><div class="card-title">Güvenlik</div><div class="card-body">XSTest (aşırı reddi) + ToxiGen + küçük bir ev içi düşmanca kümesi. Çoğu ince ayar bunlardan en az birinde geriler — ölç ya da sürpriz yaşa.</div></div>
<div class="calc-card"><div class="card-title">Hedefle hizalanma</div><div class="card-body">Kendi verinden held-out tercih çiftleri, SFT baseline'ına karşı kazanma oranı olarak puanlanır. Gerçek ürün kalitesine en yakın metrik.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — değerlendirme pipeline'ı)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># CI işine bırakabileceğin standartlaştırılmış değerlendirme pipeline'ı</span>
<span class="kw">import</span> subprocess, json, pathlib

MODEL = <span class="str">"./orpo-out"</span>

<span class="cm"># 1. lm-eval ile yetenek</span>
subprocess.<span class="fn">run</span>([
    <span class="str">"lm_eval"</span>, <span class="str">"--model"</span>, <span class="str">"vllm"</span>,
    <span class="str">"--model_args"</span>, f<span class="str">"pretrained={MODEL},dtype=bfloat16"</span>,
    <span class="str">"--tasks"</span>, <span class="str">"mmlu_pro,gsm8k,hellaswag,truthfulqa"</span>,
    <span class="str">"--num_fewshot"</span>, <span class="str">"5"</span>,
    <span class="str">"--output_path"</span>, <span class="str">"./eval/capability.json"</span>,
])

<span class="cm"># 2. IFEval ile instruction-takibi</span>
subprocess.<span class="fn">run</span>([
    <span class="str">"lm_eval"</span>, <span class="str">"--model"</span>, <span class="str">"vllm"</span>,
    <span class="str">"--model_args"</span>, f<span class="str">"pretrained={MODEL}"</span>,
    <span class="str">"--tasks"</span>, <span class="str">"ifeval"</span>,
    <span class="str">"--output_path"</span>, <span class="str">"./eval/ifeval.json"</span>,
])

<span class="cm"># 3. Güvenlik: XSTest aşırı-reddi</span>
subprocess.<span class="fn">run</span>([
    <span class="str">"lm_eval"</span>, <span class="str">"--model"</span>, <span class="str">"vllm"</span>,
    <span class="str">"--model_args"</span>, f<span class="str">"pretrained={MODEL}"</span>,
    <span class="str">"--tasks"</span>, <span class="str">"xstest"</span>,
    <span class="str">"--output_path"</span>, <span class="str">"./eval/safety.json"</span>,
])

<span class="cm"># 4. Held-out tercih kazanma oranı (özel)</span>
<span class="kw">def</span> <span class="fn">compare_models</span>(model_a, model_b, prompts_path, judge=<span class="str">"gpt-4o-mini"</span>):
    <span class="str">"""LLM yargıcı ile ikili karşılaştırma. Kazan/berabere/kaybet sayılarını döner."""</span>
    <span class="cm"># ... iskelet okuyucuya bırakılmış; araçlar: judges/Arena-stili</span>
    <span class="kw">return</span> {<span class="str">"win"</span>: <span class="num">0</span>, <span class="str">"tie"</span>: <span class="num">0</span>, <span class="str">"lose"</span>: <span class="num">0</span>}

results = {p.stem: json.<span class="fn">loads</span>(p.<span class="fn">read_text</span>()) <span class="kw">for</span> p <span class="kw">in</span> pathlib.<span class="fn">Path</span>(<span class="str">"./eval"</span>).<span class="fn">glob</span>(<span class="str">"*.json"</span>)}
<span class="fn">print</span>(json.<span class="fn">dumps</span>(results, indent=<span class="num">2</span>)[:<span class="num">500</span>])
</code></pre></div>

<p class="l-text"><strong>Dört eval çağrısı dört sinyale nasıl karşılık geliyor:</strong> üç birebir-biçimli <code>lm_eval</code> çağrısı yetenek, instruction-takibi ve güvenliği kapsar — aynı CLI, farklı görev listeleri, hepsi JSON olarak dökülür ki bir CI işi eşiklere göre pass/fail verebilsin. Otomasyonu en zor dördüncü sinyal <code>compare_models</code> — kendi tutulan prompt'larında SFT baseline'ına karşı ikili LLM-yargıç karşılaştırması. Fonksiyon gövdesi bilinçli olarak iskelet bırakılmış: her ekibin yargıç prompt'ları ve arena biçimi farklıdır; önemli olan dört sonucu da terfi öncesi CI'ın gerilemeler için grep'leyebileceği tek bir JSON blob'una bağlamaktır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Tarif Ağacı — Birini Seç</h2>
<p class="l-text">Bu ağacı yürü. İlk eşleşme genellikle doğru cevaptır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sadece alan SFT</div><div class="card-body">Yalnızca gösterim verin var, tercih yok. Temizlenmiş veride SFT + LoRA + bf16 çalıştır. 1-3 epoch. Değerlendirme paketi. Yayınla.</div></div>
<div class="calc-card"><div class="card-title">Hafif hizalama, tek GPU</div><div class="card-body">Tercih çiftlerin ve sıkı bütçen var. Uçtan uca ORPO çalıştır. Tek eğitim geçişi, referans model yok. 2026'da en iyi $-başına-kalite.</div></div>
<div class="calc-card"><div class="card-title">Zaten SFT yapılmış, hizalamak istiyor</div><div class="card-body">SFT checkpoint + tercih çiftlerin var. Üstüne beta=0.1 ile DPO çalıştır. İki aşama ama her aşama kısa.</div></div>
<div class="calc-card"><div class="card-title">Çok-amaçlı veya online</div><div class="card-body">Yardımseverlik, güvenlik, biçim reward'larını birleştirmen veya canlı trafikten öğrenmen gerekiyor. Reward modeli eğit, PPO çalıştır. 5x hesap primini öde.</div></div>
<div class="calc-card"><div class="card-title">Hiç tercih yok</div><div class="card-body">Constitutional AI / RLAIF kullan: daha güçlü bir modelle sentetik tercihler bootstrap et. Sonra ORPO/DPO'ya dön.</div></div>
<div class="calc-card"><div class="card-title">Minik veri kümesi (1k çiftin altında)</div><div class="card-body">KTO (Kahneman-Tversky Optimization). Eşlenmemiş ikili geri bildirimde ("iyi"/"kötü") çalışır — toplaması daha kolay.</div></div>
</div>

<p class="l-text">İçselleştirilmesi gereken iki desen. Birincisi: <strong>veri kalitesi &gt; tarif seçimi</strong>. Temiz bir SFT genellikle kontamine bir DPO'yu yener. İkincisi: <strong>her zaman tam değerlendirme paketini çalıştır</strong> — yetenek VE instruction takibi VE güvenlik VE ev içi yargıcın — ince ayarı yayınlamadan önce. Tarifler sana modeli verir; değerlendirmeler ona güvenip güvenmeyeceğini söyler.</p>
</div>
`
};
