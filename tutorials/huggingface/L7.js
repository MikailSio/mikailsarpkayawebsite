window.HF_L7 = {
en: `<p class="l-text"><strong>Trainer makes single-GPU training trivial; multi-GPU and trillion-parameter training make it indispensable.</strong> The HuggingFace <code>Trainer</code> looks innocent — three lines and a model fine-tunes — but underneath it is a carefully engineered orchestration of mixed precision, gradient accumulation, distributed launchers, checkpointing, callbacks, and (with one config flag) DeepSpeed or FSDP sharding. Knowing what those flags actually do is the difference between "training crashes at epoch 2 with OOM" and "we shipped Llama-2-7B fine-tunes on a single A100".</p>

<p class="l-text">In this lesson we open the box. We will cover the Trainer lifecycle and where callbacks hook in; the math of gradient accumulation; the three big options for going past one GPU (DDP, DeepSpeed ZeRO, FSDP); when each one is the right answer; and gradient checkpointing — the trick that trades a little compute for a lot of memory. Every concept is paired with a runnable Pyodide demo using sklearn so you can feel the loop end-to-end without any GPU.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The Trainer lifecycle and where to inject custom logic with callbacks</li>
<li>Gradient accumulation: how it simulates a larger batch on a single GPU</li>
<li>DDP vs DeepSpeed ZeRO 1/2/3 vs FSDP — the right tool for each scale</li>
<li>Gradient checkpointing and the activation-memory tradeoff</li>
<li>Accelerate as the unifying CLI for any of the above</li>
<li>Practical OOM debugging recipes for 7B-70B models on consumer GPUs</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Trainer Lifecycle</h2>
<p class="l-text">When you call <code>trainer.train()</code>, fifteen things happen in a strict order. Knowing the sequence makes callbacks predictable instead of mysterious.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">on_init_end</div><div class="card-body">After Trainer constructor finishes; model, optimizer, scheduler all built.</div></div>
<div class="calc-card"><div class="card-title">on_train_begin</div><div class="card-body">Once before the first epoch. Use for logging setup, freezing weights, etc.</div></div>
<div class="calc-card"><div class="card-title">on_step_begin / on_step_end</div><div class="card-body">Wraps each optimizer step (after any gradient accumulation).</div></div>
<div class="calc-card"><div class="card-title">on_log / on_evaluate / on_save</div><div class="card-body">Fire on logging cadence, eval cadence, and checkpoint save respectively.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — transformers)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> (
    Trainer, TrainingArguments,
    AutoModelForSequenceClassification, AutoTokenizer,
    TrainerCallback,
)

<span class="kw">class</span> <span class="fn">EarlyStopOnPlateau</span>(TrainerCallback):
    <span class="str">"""Custom callback: stop if eval loss does not improve for N evals."""</span>
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, patience=<span class="num">3</span>, min_delta=<span class="num">1e-3</span>):
        <span class="kw">self</span>.patience, <span class="kw">self</span>.min_delta = patience, min_delta
        <span class="kw">self</span>.best = <span class="fn">float</span>(<span class="str">"inf"</span>); <span class="kw">self</span>.bad = <span class="num">0</span>

    <span class="kw">def</span> <span class="fn">on_evaluate</span>(<span class="kw">self</span>, args, state, control, metrics, **kw):
        loss = metrics.<span class="fn">get</span>(<span class="str">"eval_loss"</span>, <span class="fn">float</span>(<span class="str">"inf"</span>))
        <span class="kw">if</span> loss &lt; <span class="kw">self</span>.best - <span class="kw">self</span>.min_delta:
            <span class="kw">self</span>.best = loss; <span class="kw">self</span>.bad = <span class="num">0</span>
        <span class="kw">else</span>:
            <span class="kw">self</span>.bad += <span class="num">1</span>
            <span class="kw">if</span> <span class="kw">self</span>.bad &gt;= <span class="kw">self</span>.patience:
                <span class="fn">print</span>(f<span class="str">"early stop at step {state.global_step}"</span>)
                control.should_training_stop = <span class="kw">True</span>

trainer = <span class="fn">Trainer</span>(
    model=model, args=training_args,
    train_dataset=ds_train, eval_dataset=ds_eval,
    callbacks=[<span class="fn">EarlyStopOnPlateau</span>(patience=<span class="num">2</span>)],
)
trainer.<span class="fn">train</span>()
</code></pre></div>

<p class="l-text"><strong>How this custom early-stop callback hooks into Trainer:</strong> 1) <code>class EarlyStopOnPlateau(TrainerCallback)</code> tracks <code>self.best</code> and <code>self.bad</code> counters in <code>__init__</code> with a configurable <code>patience</code> and <code>min_delta</code>. 2) <code>on_evaluate(self, args, state, control, metrics, **kw)</code> fires after every evaluation pass — it reads <code>metrics["eval_loss"]</code> and resets the counter when loss improves by more than <code>min_delta</code>. 3) Once <code>self.bad &gt;= self.patience</code>, setting <code>control.should_training_stop = True</code> tells Trainer to break out of the training loop on the next iteration. 4) Passing <code>callbacks=[EarlyStopOnPlateau(patience=2)]</code> to the <code>Trainer(...)</code> constructor registers the hook; <code>trainer.train()</code> then runs with automatic plateau detection.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A miniature trainer loop with the same lifecycle hooks — using sklearn's logistic regression on the iris dataset. The callback pattern is identical.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> SGDClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> log_loss

X = df_iris.<span class="fn">drop</span>(columns=[<span class="str">"species"</span>]).values
y = (df_iris[<span class="str">"species"</span>] == <span class="str">"setosa"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
Xtr, Xev, ytr, yev = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

<span class="kw">class</span> TinyTrainer:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, model, callbacks=()):
        <span class="kw">self</span>.model, <span class="kw">self</span>.callbacks = model, <span class="fn">list</span>(callbacks)
        <span class="kw">self</span>.state = {<span class="str">"step"</span>: <span class="num">0</span>, <span class="str">"best_eval"</span>: <span class="fn">float</span>(<span class="str">"inf"</span>), <span class="str">"stop"</span>: <span class="kw">False</span>}

    <span class="kw">def</span> <span class="fn">fire</span>(<span class="kw">self</span>, name, **kw):
        <span class="kw">for</span> cb <span class="kw">in</span> <span class="kw">self</span>.callbacks:
            <span class="fn">getattr</span>(cb, name, <span class="kw">lambda</span> **_: <span class="kw">None</span>)(<span class="kw">self</span>.state, **kw)

    <span class="kw">def</span> <span class="fn">train</span>(<span class="kw">self</span>, Xtr, ytr, Xev, yev, n_epochs=<span class="num">20</span>):
        <span class="kw">self</span>.<span class="fn">fire</span>(<span class="str">"on_train_begin"</span>)
        <span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(n_epochs):
            <span class="kw">if</span> <span class="kw">self</span>.state[<span class="str">"stop"</span>]: <span class="kw">break</span>
            <span class="kw">self</span>.<span class="fn">fire</span>(<span class="str">"on_step_begin"</span>)
            <span class="kw">self</span>.model.<span class="fn">partial_fit</span>(Xtr, ytr, classes=[<span class="num">0</span>,<span class="num">1</span>])
            <span class="kw">self</span>.state[<span class="str">"step"</span>] += <span class="num">1</span>
            proba = <span class="kw">self</span>.model.<span class="fn">predict_proba</span>(Xev)
            loss  = <span class="fn">log_loss</span>(yev, proba, labels=[<span class="num">0</span>,<span class="num">1</span>])
            <span class="kw">self</span>.<span class="fn">fire</span>(<span class="str">"on_evaluate"</span>, eval_loss=loss)
        <span class="kw">self</span>.<span class="fn">fire</span>(<span class="str">"on_train_end"</span>)

<span class="kw">class</span> EarlyStop:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, patience=<span class="num">3</span>, min_delta=<span class="num">1e-4</span>):
        <span class="kw">self</span>.p, <span class="kw">self</span>.d, <span class="kw">self</span>.bad = patience, min_delta, <span class="num">0</span>
    <span class="kw">def</span> <span class="fn">on_evaluate</span>(<span class="kw">self</span>, state, eval_loss, **_):
        <span class="kw">if</span> eval_loss &lt; state[<span class="str">"best_eval"</span>] - <span class="kw">self</span>.d:
            state[<span class="str">"best_eval"</span>] = eval_loss; <span class="kw">self</span>.bad = <span class="num">0</span>
        <span class="kw">else</span>:
            <span class="kw">self</span>.bad += <span class="num">1</span>
            <span class="kw">if</span> <span class="kw">self</span>.bad &gt;= <span class="kw">self</span>.p:
                <span class="fn">print</span>(f<span class="str">"early stop at step {state['step']} (best={state['best_eval']:.4f})"</span>)
                state[<span class="str">"stop"</span>] = <span class="kw">True</span>

t = <span class="fn">TinyTrainer</span>(<span class="fn">SGDClassifier</span>(loss=<span class="str">"log_loss"</span>, random_state=<span class="num">0</span>),
                callbacks=[<span class="fn">EarlyStop</span>(patience=<span class="num">3</span>)])
t.<span class="fn">train</span>(Xtr, ytr, Xev, yev)
<span class="fn">print</span>(<span class="str">"final state:"</span>, t.state)
</code></pre></div>
</div>

<p class="l-text"><strong>How the Pyodide mini-trainer mirrors the real one:</strong> 1) <code>TinyTrainer</code> stores the model, callback list and a <code>state</code> dict (<code>step</code>, <code>best_eval</code>, <code>stop</code>) — the same shape as Trainer\'s internal state. 2) <code>fire(name, **kw)</code> dispatches lifecycle events to every callback, defaulting to a no-op when a hook is missing. 3) The <code>train(...)</code> loop calls <code>on_train_begin</code>, then per epoch: <code>on_step_begin</code> → <code>model.partial_fit(Xtr, ytr, classes=[0,1])</code> → <code>predict_proba</code> + <code>log_loss</code> → <code>on_evaluate</code>; <code>state["stop"]=True</code> ends training. 4) <code>EarlyStop.on_evaluate</code> replicates the patience logic and flips <code>state["stop"]</code>, demonstrating that the production callback contract translates 1:1 to plain Python.</p>


</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Gradient Accumulation</h2>
<p class="l-text">Batch size 32 doesn't fit on your GPU but you need batch 32 for stable training? Run 8 forward-backward passes of micro-batch 4 and only call <code>optimizer.step()</code> on the 8th. The gradients accumulate naturally because PyTorch sums into <code>.grad</code> by default.</p>

<div class="katex-block">$$g_{\\text{eff}} = \\sum_{i=1}^{N_{\\text{accum}}} \\nabla L(x_i, \\theta) \\Big/ N_{\\text{accum}}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

<span class="cm"># Simulate gradient accumulation: average mini-batch gradients</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
n, d = <span class="num">1000</span>, <span class="num">10</span>
X = rng.<span class="fn">standard_normal</span>((n, d))
true_w = rng.<span class="fn">standard_normal</span>(d)
y = (X @ true_w + <span class="num">0.1</span>*rng.<span class="fn">standard_normal</span>(n) &gt; <span class="num">0</span>).<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="kw">def</span> <span class="fn">grad</span>(w, Xb, yb):
    p = <span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-Xb @ w))
    <span class="kw">return</span> Xb.T @ (p - yb) / <span class="fn">len</span>(yb)

<span class="cm"># Train two ways: BIG batch, vs ACCUMULATED small batches</span>
<span class="kw">def</span> <span class="fn">train</span>(batch_size, accum=<span class="num">1</span>, lr=<span class="num">0.5</span>, steps=<span class="num">100</span>):
    w = np.<span class="fn">zeros</span>(d)
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(steps):
        g_acc = np.<span class="fn">zeros</span>(d)
        <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(accum):
            idx = rng.<span class="fn">integers</span>(<span class="num">0</span>, n, batch_size)
            g_acc += <span class="fn">grad</span>(w, X[idx], y[idx])
        w -= lr * g_acc / accum
    <span class="kw">return</span> w

w_big   = <span class="fn">train</span>(batch_size=<span class="num">32</span>, accum=<span class="num">1</span>)
w_accum = <span class="fn">train</span>(batch_size=<span class="num">4</span>,  accum=<span class="num">8</span>)   <span class="cm"># same effective batch</span>
<span class="fn">print</span>(<span class="str">"big-batch    final loss:"</span>, <span class="fn">round</span>(np.<span class="fn">mean</span>((<span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-X<span class="kw">@w_big</span>))   - y)**<span class="num">2</span>), <span class="num">4</span>))
<span class="fn">print</span>(<span class="str">"accum 8x4    final loss:"</span>, <span class="fn">round</span>(np.<span class="fn">mean</span>((<span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-X<span class="kw">@w_accum</span>)) - y)**<span class="num">2</span>), <span class="num">4</span>))
<span class="fn">print</span>(<span class="str">"weights cosine sim:"</span>,
      <span class="fn">round</span>(<span class="fn">float</span>(w_big @ w_accum / (np.linalg.<span class="fn">norm</span>(w_big)*np.linalg.<span class="fn">norm</span>(w_accum))), <span class="num">4</span>))
</code></pre></div>

<p class="l-text"><strong>How the gradient-accumulation experiment is set up:</strong> 1) <code>X</code>, <code>true_w</code>, <code>y</code> generate a 1000-sample binary logistic dataset, and <code>grad(w, Xb, yb)</code> returns the standard logistic gradient. 2) <code>train(batch_size, accum=1, lr=0.5, steps=100)</code> runs the optimization: every step it sums <code>accum</code> mini-batch gradients into <code>g_acc</code> and applies <code>w -= lr * g_acc / accum</code> — exactly what PyTorch does internally. 3) Two runs use the same effective batch (32): one big batch (<code>batch_size=32, accum=1</code>) and one accumulated (<code>batch_size=4, accum=8</code>). 4) The printed losses and the cosine similarity between <code>w_big</code> and <code>w_accum</code> demonstrate that accumulation reproduces the big-batch update direction within numerical noise.</p>


<div class="calc-highlight">In Trainer: set <code>per_device_train_batch_size=4</code> and <code>gradient_accumulation_steps=8</code>. Effective batch = 32. Memory cost = micro-batch only. The activations and intermediate buffers shrink linearly.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Going Multi-GPU: DDP</h2>
<p class="l-text"><strong>DistributedDataParallel</strong> is the entry-level multi-GPU strategy. Every GPU holds a full copy of the model; each one sees a different shard of the batch; gradients are <em>all-reduced</em> across GPUs after the backward pass. Synchronization is one collective per step. Simple, fast, and the right answer when the model fits on one GPU.</p>

<div class="katex-block">$$g_{\\text{global}} = \\frac{1}{N_{\\text{gpu}}} \\sum_{i=1}^{N_{\\text{gpu}}} g_i$$</div>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO — accelerate)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Launch the SAME training script on 4 GPUs with DDP</span>
accelerate launch \\
    --multi_gpu \\
    --num_processes <span class="num">4</span> \\
    --mixed_precision bf16 \\
    train.py \\
    --per_device_train_batch_size <span class="num">8</span> \\
    --gradient_accumulation_steps <span class="num">4</span>   <span class="cm"># effective batch = 8 * 4 * 4 = 128</span>
</code></pre></div>

<p class="l-text"><strong>How <code>accelerate launch</code> turns a single-GPU script into a 4-GPU DDP run:</strong> 1) <code>--multi_gpu</code> enables DistributedDataParallel; <code>--num_processes 4</code> spawns one worker per GPU. 2) <code>--mixed_precision bf16</code> turns on bf16 autocast for the forward pass and stores activations in 16-bit, roughly halving memory pressure on Ampere/Hopper hardware. 3) <code>--per_device_train_batch_size 8</code> + <code>--gradient_accumulation_steps 4</code> gives a global effective batch of 8 × 4 × 4 = 128 without changing a single line of <code>train.py</code>. 4) The same script that ran on one GPU now scales out because <code>accelerate</code> wraps the model, optimizer and DataLoader behind the scenes.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Simulate DDP gradient averaging across N "GPUs" by splitting the batch and averaging the per-shard gradients.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

n, d = <span class="num">800</span>, <span class="num">8</span>
X = rng.<span class="fn">standard_normal</span>((n, d))
true_w = rng.<span class="fn">standard_normal</span>(d)
y = (X @ true_w &gt; <span class="num">0</span>).<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="kw">def</span> <span class="fn">grad</span>(w, Xb, yb):
    p = <span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-Xb @ w))
    <span class="kw">return</span> Xb.T @ (p - yb) / <span class="fn">len</span>(yb)

<span class="kw">def</span> <span class="fn">ddp_step</span>(w, X_batch, y_batch, n_gpu=<span class="num">4</span>, lr=<span class="num">0.3</span>):
    <span class="str">"""Split batch across n_gpu shards, compute local grads, average (all-reduce)."""</span>
    shards_X = np.<span class="fn">array_split</span>(X_batch, n_gpu)
    shards_y = np.<span class="fn">array_split</span>(y_batch, n_gpu)
    local_grads = [<span class="fn">grad</span>(w, sx, sy) <span class="kw">for</span> sx, sy <span class="kw">in</span> <span class="fn">zip</span>(shards_X, shards_y)]
    g_global = np.<span class="fn">mean</span>(local_grads, axis=<span class="num">0</span>)        <span class="cm"># all-reduce mean</span>
    <span class="kw">return</span> w - lr * g_global

w = np.<span class="fn">zeros</span>(d)
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    idx = rng.<span class="fn">integers</span>(<span class="num">0</span>, n, <span class="num">64</span>)
    w = <span class="fn">ddp_step</span>(w, X[idx], y[idx], n_gpu=<span class="num">4</span>)

acc = ((<span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-X<span class="kw">@w</span>)) &gt; <span class="num">0.5</span>) == y).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"DDP-simulated training accuracy: {acc:.3f}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>How the simulated DDP step demonstrates all-reduce:</strong> 1) <code>ddp_step(w, X_batch, y_batch, n_gpu=4, lr=0.3)</code> uses <code>np.array_split</code> to slice the global batch into <code>n_gpu</code> shards — one per simulated GPU. 2) <code>local_grads = [grad(w, sx, sy) for sx, sy in zip(shards_X, shards_y)]</code> computes a gradient per shard exactly like each real GPU would. 3) <code>g_global = np.mean(local_grads, axis=0)</code> is the numpy stand-in for NCCL\'s all-reduce mean — the operation real DDP performs on every backward pass. 4) After 200 steps, the final accuracy print confirms the synthetic 4-GPU update reaches the same quality as a single-process baseline, mirroring the convergence guarantees of true DDP.</p>


</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. DeepSpeed ZeRO — Sharding the Optimizer</h2>
<p class="l-text">DDP keeps a full model copy per GPU, which means a full <em>optimizer state</em> per GPU too. Adam holds two moment buffers per parameter — that's <strong>3x the model size</strong> in optimizer state, on every GPU. For a 7B model in fp32 Adam: 84 GB per GPU. ZeRO shards this state across GPUs so each holds only <code>1/N</code>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ZeRO-1</div><div class="card-body">Shards optimizer state. Per-GPU memory drops from 12B to ~6B for a 1B-param fp32 model.</div></div>
<div class="calc-card"><div class="card-title">ZeRO-2</div><div class="card-body">Also shards gradients. Roughly halves again.</div></div>
<div class="calc-card"><div class="card-title">ZeRO-3</div><div class="card-body">Also shards parameters. The full model never lives on one GPU. Trains 100B+ models on commodity clusters. Communication overhead is highest.</div></div>
<div class="calc-card"><div class="card-title">CPU offload</div><div class="card-body">Optionally swap optimizer state to host RAM or NVMe. Slower step time, but unlocks 70B-on-a-single-A100.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>JSON (DEMO — DeepSpeed config)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>{
  <span class="str">"train_micro_batch_size_per_gpu"</span>: <span class="num">4</span>,
  <span class="str">"gradient_accumulation_steps"</span>: <span class="num">8</span>,
  <span class="str">"bf16"</span>: { <span class="str">"enabled"</span>: true },
  <span class="str">"zero_optimization"</span>: {
    <span class="str">"stage"</span>: <span class="num">3</span>,
    <span class="str">"offload_optimizer"</span>: { <span class="str">"device"</span>: <span class="str">"cpu"</span>,  <span class="str">"pin_memory"</span>: true },
    <span class="str">"offload_param"</span>:     { <span class="str">"device"</span>: <span class="str">"nvme"</span>, <span class="str">"nvme_path"</span>: <span class="str">"/scratch/zero"</span> },
    <span class="str">"overlap_comm"</span>: true,
    <span class="str">"contiguous_gradients"</span>: true
  },
  <span class="str">"gradient_clipping"</span>: <span class="num">1.0</span>,
  <span class="str">"wall_clock_breakdown"</span>: false
}
</code></pre></div>

<p class="l-text">Pass this with <code>TrainingArguments(deepspeed="ds_config.json")</code> and Trainer wires up DeepSpeed for you. The same script that ran on one GPU now scales to a cluster.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. FSDP — PyTorch's Native Alternative</h2>
<p class="l-text"><strong>Fully Sharded Data Parallel</strong> is PyTorch's first-party implementation of ZeRO-3-style sharding. It is now the default sharding strategy in <code>accelerate</code> for new projects — same idea as DeepSpeed ZeRO-3 but tighter integration with PyTorch's autograd and distributed primitives.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FULL_SHARD</div><div class="card-body">Equivalent to ZeRO-3. Parameters, gradients, and optimizer state all sharded.</div></div>
<div class="calc-card"><div class="card-title">SHARD_GRAD_OP</div><div class="card-body">Equivalent to ZeRO-2. Less comm, more memory.</div></div>
<div class="calc-card"><div class="card-title">NO_SHARD</div><div class="card-body">Falls back to DDP. Useful for the smallest models in a heterogeneous training script.</div></div>
<div class="calc-card"><div class="card-title">HYBRID_SHARD</div><div class="card-body">Shard within a node, replicate across nodes. Best when intra-node bandwidth (NVLink) far exceeds inter-node (Ethernet/IB).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO — accelerate FSDP)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># accelerate config (interactive) -> picks FSDP, then:</span>
accelerate launch \\
    --use_fsdp \\
    --fsdp_sharding_strategy FULL_SHARD \\
    --fsdp_auto_wrap_policy TRANSFORMER_BASED_WRAP \\
    --fsdp_transformer_layer_cls_to_wrap LlamaDecoderLayer \\
    --mixed_precision bf16 \\
    train.py
</code></pre></div>

<p class="l-text"><strong>How <code>accelerate launch</code> enables FSDP:</strong> 1) <code>--use_fsdp</code> swaps DDP for Fully Sharded Data Parallel — PyTorch\'s native ZeRO-3-style sharding. 2) <code>--fsdp_sharding_strategy FULL_SHARD</code> shards parameters, gradients and optimizer state across every GPU; lighter alternatives like <code>SHARD_GRAD_OP</code> and <code>HYBRID_SHARD</code> trade memory for less communication. 3) <code>--fsdp_auto_wrap_policy TRANSFORMER_BASED_WRAP</code> + <code>--fsdp_transformer_layer_cls_to_wrap LlamaDecoderLayer</code> tells FSDP to treat each Llama decoder block as a sharding unit — this is how huge models flow through the cluster without manually wrapping modules. 4) <code>--mixed_precision bf16</code> keeps activations in 16-bit for further memory savings on Ampere/Hopper GPUs.</p>


<div class="calc-highlight">Rule of thumb in 2026: FSDP first if you're already in PyTorch and your model is from <code>transformers</code>. DeepSpeed if you need ZeRO-Infinity (NVMe offload), CPU offload of optimizer state at scale, or its inference engine.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Gradient Checkpointing</h2>
<p class="l-text">Forward passes save activations at every layer so backward can reuse them. For a 32-layer transformer, that's 32 sets of activations resident in memory. Gradient checkpointing throws most of them away and <em>recomputes</em> them during backward. You pay roughly 33% more compute and save ~70% of activation memory.</p>

<div class="katex-block">$$\\text{mem}_{\\text{ckpt}} \\approx \\frac{\\text{mem}_{\\text{act}}}{\\sqrt{N_{\\text{layers}}}} \\quad\\text{(with optimal segmentation)}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — transformers)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> TrainingArguments

args = <span class="fn">TrainingArguments</span>(
    output_dir=<span class="str">"out"</span>,
    per_device_train_batch_size=<span class="num">8</span>,
    gradient_accumulation_steps=<span class="num">4</span>,
    gradient_checkpointing=<span class="kw">True</span>,           <span class="cm"># &lt;-- the magic flag</span>
    gradient_checkpointing_kwargs={<span class="str">"use_reentrant"</span>: <span class="kw">False</span>},
    bf16=<span class="kw">True</span>,
    optim=<span class="str">"adamw_torch_fused"</span>,
    learning_rate=<span class="num">2e-5</span>,
    num_train_epochs=<span class="num">3</span>,
    logging_steps=<span class="num">10</span>,
    save_strategy=<span class="str">"epoch"</span>,
    eval_strategy=<span class="str">"epoch"</span>,
)
</code></pre></div>

<p class="l-text">Combine all three (gradient_accumulation + gradient_checkpointing + bf16) and a 7B model trains comfortably on a single 24GB consumer GPU. Without them you OOM at parameter loading.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Memory Math — Will It Fit?</h2>
<p class="l-text">Before launching, estimate. The biggest predictable cost is optimizer state, not weights. For a P-parameter model:</p>

<div class="katex-block">$$\\text{mem}_{\\text{train}} \\approx \\underbrace{2P}_{\\text{fp16 weights}} + \\underbrace{2P}_{\\text{fp32 master}} + \\underbrace{8P}_{\\text{Adam m,v fp32}} + \\underbrace{2P}_{\\text{grads}} + \\text{activations}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> math

<span class="kw">def</span> <span class="fn">memory_estimate</span>(n_params_billion, optimizer=<span class="str">"adam"</span>,
                    precision=<span class="str">"bf16"</span>, zero_stage=<span class="num">0</span>, n_gpu=<span class="num">1</span>):
    <span class="str">"""Rough VRAM-per-GPU estimate in GB for transformer training."""</span>
    P = n_params_billion * <span class="num">1e9</span>
    bytes_per_param = <span class="num">2</span> <span class="kw">if</span> precision <span class="kw">in</span> (<span class="str">"fp16"</span>, <span class="str">"bf16"</span>) <span class="kw">else</span> <span class="num">4</span>
    weights = P * bytes_per_param
    master  = P * <span class="num">4</span> <span class="kw">if</span> precision <span class="kw">in</span> (<span class="str">"fp16"</span>, <span class="str">"bf16"</span>) <span class="kw">else</span> <span class="num">0</span>
    grads   = P * bytes_per_param
    <span class="kw">if</span> optimizer == <span class="str">"adam"</span>:
        opt = P * <span class="num">8</span>                  <span class="cm"># m + v in fp32</span>
    <span class="kw">elif</span> optimizer == <span class="str">"sgd"</span>:
        opt = P * <span class="num">4</span>                  <span class="cm"># momentum only</span>
    <span class="kw">else</span>:
        opt = <span class="num">0</span>

    <span class="cm"># ZeRO sharding factor</span>
    <span class="kw">if</span>   zero_stage == <span class="num">1</span>: opt   /= n_gpu
    <span class="kw">elif</span> zero_stage == <span class="num">2</span>: opt   /= n_gpu; grads  /= n_gpu
    <span class="kw">elif</span> zero_stage == <span class="num">3</span>: opt   /= n_gpu; grads  /= n_gpu; weights /= n_gpu

    total_gb = (weights + master + grads + opt) / <span class="num">1e9</span>
    <span class="kw">return</span> <span class="fn">round</span>(total_gb, <span class="num">1</span>)

<span class="cm"># Llama-7B on a single GPU vs ZeRO-3 across 8 GPUs</span>
<span class="fn">print</span>(<span class="str">"7B  fp32 Adam, 1 GPU :"</span>, <span class="fn">memory_estimate</span>(<span class="num">7</span>, precision=<span class="str">"fp32"</span>), <span class="str">"GB"</span>)
<span class="fn">print</span>(<span class="str">"7B  bf16 Adam, 1 GPU :"</span>, <span class="fn">memory_estimate</span>(<span class="num">7</span>), <span class="str">"GB"</span>)
<span class="fn">print</span>(<span class="str">"70B bf16 Adam, ZeRO-3 8 GPU/each:"</span>,
      <span class="fn">memory_estimate</span>(<span class="num">70</span>, zero_stage=<span class="num">3</span>, n_gpu=<span class="num">8</span>), <span class="str">"GB"</span>)
<span class="fn">print</span>(<span class="str">"70B + CPU-offload-optimizer (~halves opt term, very roughly):"</span>,
      <span class="fn">memory_estimate</span>(<span class="num">70</span>, zero_stage=<span class="num">3</span>, n_gpu=<span class="num">8</span>) - <span class="num">70</span>*<span class="num">8</span>/<span class="num">8</span>/<span class="num">2</span>, <span class="str">"GB approx"</span>)
</code></pre></div>

<p class="l-text"><strong>How the memory estimator breaks down VRAM usage:</strong> 1) <code>memory_estimate(n_params_billion, optimizer="adam", precision="bf16", zero_stage=0, n_gpu=1)</code> sums the four big training tensors per parameter: <code>weights</code>, <code>master</code> (fp32 master copy when using bf16/fp16 mixed precision), <code>grads</code> and <code>opt</code>. 2) Adam costs 8 bytes/param for the two fp32 moment buffers; SGD halves that to 4 bytes/param. 3) The <code>zero_stage</code> branches divide the optimizer (<code>stage=1</code>), gradients (<code>stage=2</code>) and weights (<code>stage=3</code>) by <code>n_gpu</code> — modeling exactly how DeepSpeed/FSDP shards each tier. 4) The four <code>print</code> calls compare 7B fp32 Adam on one GPU, 7B bf16 Adam on one GPU, 70B bf16 Adam with ZeRO-3 across 8 GPUs, and the same with crude CPU-offload accounting.</p>


<div class="calc-highlight">Most "I can't fit this" surprises come from forgetting Adam's 8 bytes/parameter. Switch to <code>adamw_8bit</code> (bitsandbytes) and that 8 becomes 2 — instant 4x reduction on the dominant term.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The OOM Debugging Recipe</h2>
<p class="l-text">When training OOMs, walk this list in order. Each step is a constant factor; the first three solve 90% of cases.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Lower micro-batch</div><div class="card-body">Halve <code>per_device_train_batch_size</code>, double <code>gradient_accumulation_steps</code>. Effective batch unchanged, activation memory halved.</div></div>
<div class="calc-card"><div class="card-title">2. bf16 + gradient_checkpointing</div><div class="card-body">Together they typically free 60-70% of memory at the cost of ~30% throughput.</div></div>
<div class="calc-card"><div class="card-title">3. 8-bit optimizer</div><div class="card-body"><code>optim="paged_adamw_8bit"</code>. Cuts the dominant Adam term by 4x.</div></div>
<div class="calc-card"><div class="card-title">4. ZeRO-2 / FSDP_GRAD_OP</div><div class="card-body">Shard gradients and optimizer state across GPUs. Linear scaling.</div></div>
<div class="calc-card"><div class="card-title">5. ZeRO-3 / FSDP_FULL_SHARD</div><div class="card-body">Also shard parameters. Required past ~10B model on consumer GPUs.</div></div>
<div class="calc-card"><div class="card-title">6. CPU/NVMe offload</div><div class="card-body">Last resort. Pushes optimizer state out of VRAM. Step time grows 2-4x.</div></div>
</div>

<p class="l-text">Pair this list with the memory estimator above and OOM stops being a guessing game. The Trainer is doing the work; you are choosing the configuration. Knowing the lifecycle and the sharding ladder is what separates "I have a 7B model crashing" from "I shipped a fine-tune over the weekend".</p>
</div>
`,
tr: `<p class="l-text"><strong>Trainer tek GPU eğitimini çocuk oyuncağına dönüştürür; çoklu GPU ve trilyon parametreli eğitimde ise vazgeçilmez olur.</strong> HuggingFace <code>Trainer</code> ilk bakışta masum görünür — üç satır kod ve model ince ayar yapılır — ama altında karma hassasiyet, gradyan biriktirme, dağıtık başlatıcılar, checkpoint yönetimi, callback'ler ve (tek bir config bayrağıyla) DeepSpeed veya FSDP parçalama gibi özenle tasarlanmış bir orkestrasyon yatar. Bu bayrakların ne işe yaradığını bilmek, "epoch 2'de OOM ile çöküyor" ile "tek bir A100 üzerinde Llama-2-7B ince ayarı yayınladık" arasındaki farktır.</p>

<p class="l-text">Bu derste kutuyu açıyoruz. Trainer yaşam döngüsünü ve callback'lerin nereye takıldığını; gradyan biriktirmenin matematiğini; tek GPU'yu aşmanın üç büyük seçeneğini (DDP, DeepSpeed ZeRO, FSDP); her birinin ne zaman doğru cevap olduğunu; ve <em>gradient checkpointing</em>'i — biraz hesabı çok bellek için takas eden numarayı — ele alacağız. Her kavramı sklearn kullanan çalıştırılabilir bir Pyodide demosuyla eşleştirdik; böylece GPU olmadan döngüyü baştan sona hissedebilirsin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Trainer yaşam döngüsü ve callback'lerle özel mantığı nereye enjekte edeceğin</li>
<li>Gradyan biriktirme: tek GPU'da daha büyük batch'i nasıl simüle eder</li>
<li>DDP vs DeepSpeed ZeRO 1/2/3 vs FSDP — her ölçek için doğru araç</li>
<li>Gradient checkpointing ve aktivasyon-bellek takası</li>
<li>accelerate: hepsi için birleştirici CLI</li>
<li>Tüketici GPU'larda 7B-70B modeller için pratik OOM ayıklama tarifleri</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Trainer Yaşam Döngüsü</h2>
<p class="l-text"><code>trainer.train()</code> çağırdığında on beş şey katı bir sırayla gerçekleşir. Sırayı bilmek callback'leri gizemli olmaktan çıkarıp tahmin edilebilir kılar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">on_init_end</div><div class="card-body">Trainer kurucusu bittikten sonra; model, optimizer, scheduler hepsi kurulmuş.</div></div>
<div class="calc-card"><div class="card-title">on_train_begin</div><div class="card-body">İlk epoch'tan önce bir kez. Loglama kurulumu, ağırlık dondurma vs için kullan.</div></div>
<div class="calc-card"><div class="card-title">on_step_begin / on_step_end</div><div class="card-body">Her optimizer adımını (gradyan biriktirmenin sonrası) sarar.</div></div>
<div class="calc-card"><div class="card-title">on_log / on_evaluate / on_save</div><div class="card-body">Sırasıyla loglama, değerlendirme ve checkpoint kayıt frekansında tetiklenir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — transformers)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> (
    Trainer, TrainingArguments,
    AutoModelForSequenceClassification, AutoTokenizer,
    TrainerCallback,
)

<span class="kw">class</span> <span class="fn">EarlyStopOnPlateau</span>(TrainerCallback):
    <span class="str">"""Özel callback: eval loss N değerlendirme boyunca iyileşmezse durdur."""</span>
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, patience=<span class="num">3</span>, min_delta=<span class="num">1e-3</span>):
        <span class="kw">self</span>.patience, <span class="kw">self</span>.min_delta = patience, min_delta
        <span class="kw">self</span>.best = <span class="fn">float</span>(<span class="str">"inf"</span>); <span class="kw">self</span>.bad = <span class="num">0</span>

    <span class="kw">def</span> <span class="fn">on_evaluate</span>(<span class="kw">self</span>, args, state, control, metrics, **kw):
        loss = metrics.<span class="fn">get</span>(<span class="str">"eval_loss"</span>, <span class="fn">float</span>(<span class="str">"inf"</span>))
        <span class="kw">if</span> loss &lt; <span class="kw">self</span>.best - <span class="kw">self</span>.min_delta:
            <span class="kw">self</span>.best = loss; <span class="kw">self</span>.bad = <span class="num">0</span>
        <span class="kw">else</span>:
            <span class="kw">self</span>.bad += <span class="num">1</span>
            <span class="kw">if</span> <span class="kw">self</span>.bad &gt;= <span class="kw">self</span>.patience:
                <span class="fn">print</span>(f<span class="str">"adım {state.global_step}'te erken durdurma"</span>)
                control.should_training_stop = <span class="kw">True</span>

trainer = <span class="fn">Trainer</span>(
    model=model, args=training_args,
    train_dataset=ds_train, eval_dataset=ds_eval,
    callbacks=[<span class="fn">EarlyStopOnPlateau</span>(patience=<span class="num">2</span>)],
)
trainer.<span class="fn">train</span>()
</code></pre></div>

<p class="l-text"><strong>Bu özel erken durdurma callback\'i Trainer\'a nasıl bağlanıyor:</strong> 1) <code>class EarlyStopOnPlateau(TrainerCallback)</code>, <code>__init__</code>\'te yapılandırılabilir <code>patience</code> ve <code>min_delta</code> ile birlikte <code>self.best</code> ve <code>self.bad</code> sayaçlarını izler. 2) <code>on_evaluate(self, args, state, control, metrics, **kw)</code> her değerlendirme geçişinden sonra tetiklenir — <code>metrics["eval_loss"]</code>\'u okur ve kayıp <code>min_delta</code>\'dan fazla iyileştiğinde sayacı sıfırlar. 3) <code>self.bad &gt;= self.patience</code> olduğunda <code>control.should_training_stop = True</code> ayarlamak, Trainer\'a bir sonraki yinelemede eğitim döngüsünden çıkmasını söyler. 4) <code>Trainer(...)</code> yapıcısına <code>callbacks=[EarlyStopOnPlateau(patience=2)]</code> geçmek hook\'u kaydeder; <code>trainer.train()</code> ardından otomatik plato algılamayla çalışır.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı yaşam döngüsü kancalarına sahip mini bir trainer döngüsü — iris veri kümesinde sklearn lojistik regresyonu kullanır. Callback deseni birebir aynıdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> SGDClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> log_loss

X = df_iris.<span class="fn">drop</span>(columns=[<span class="str">"species"</span>]).values
y = (df_iris[<span class="str">"species"</span>] == <span class="str">"setosa"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
Xtr, Xev, ytr, yev = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

<span class="kw">class</span> TinyTrainer:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, model, callbacks=()):
        <span class="kw">self</span>.model, <span class="kw">self</span>.callbacks = model, <span class="fn">list</span>(callbacks)
        <span class="kw">self</span>.state = {<span class="str">"step"</span>: <span class="num">0</span>, <span class="str">"best_eval"</span>: <span class="fn">float</span>(<span class="str">"inf"</span>), <span class="str">"stop"</span>: <span class="kw">False</span>}

    <span class="kw">def</span> <span class="fn">fire</span>(<span class="kw">self</span>, name, **kw):
        <span class="kw">for</span> cb <span class="kw">in</span> <span class="kw">self</span>.callbacks:
            <span class="fn">getattr</span>(cb, name, <span class="kw">lambda</span> **_: <span class="kw">None</span>)(<span class="kw">self</span>.state, **kw)

    <span class="kw">def</span> <span class="fn">train</span>(<span class="kw">self</span>, Xtr, ytr, Xev, yev, n_epochs=<span class="num">20</span>):
        <span class="kw">self</span>.<span class="fn">fire</span>(<span class="str">"on_train_begin"</span>)
        <span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(n_epochs):
            <span class="kw">if</span> <span class="kw">self</span>.state[<span class="str">"stop"</span>]: <span class="kw">break</span>
            <span class="kw">self</span>.<span class="fn">fire</span>(<span class="str">"on_step_begin"</span>)
            <span class="kw">self</span>.model.<span class="fn">partial_fit</span>(Xtr, ytr, classes=[<span class="num">0</span>,<span class="num">1</span>])
            <span class="kw">self</span>.state[<span class="str">"step"</span>] += <span class="num">1</span>
            proba = <span class="kw">self</span>.model.<span class="fn">predict_proba</span>(Xev)
            loss  = <span class="fn">log_loss</span>(yev, proba, labels=[<span class="num">0</span>,<span class="num">1</span>])
            <span class="kw">self</span>.<span class="fn">fire</span>(<span class="str">"on_evaluate"</span>, eval_loss=loss)
        <span class="kw">self</span>.<span class="fn">fire</span>(<span class="str">"on_train_end"</span>)

<span class="kw">class</span> EarlyStop:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, patience=<span class="num">3</span>, min_delta=<span class="num">1e-4</span>):
        <span class="kw">self</span>.p, <span class="kw">self</span>.d, <span class="kw">self</span>.bad = patience, min_delta, <span class="num">0</span>
    <span class="kw">def</span> <span class="fn">on_evaluate</span>(<span class="kw">self</span>, state, eval_loss, **_):
        <span class="kw">if</span> eval_loss &lt; state[<span class="str">"best_eval"</span>] - <span class="kw">self</span>.d:
            state[<span class="str">"best_eval"</span>] = eval_loss; <span class="kw">self</span>.bad = <span class="num">0</span>
        <span class="kw">else</span>:
            <span class="kw">self</span>.bad += <span class="num">1</span>
            <span class="kw">if</span> <span class="kw">self</span>.bad &gt;= <span class="kw">self</span>.p:
                <span class="fn">print</span>(f<span class="str">"adım {state['step']}'te erken durdurma (en iyi={state['best_eval']:.4f})"</span>)
                state[<span class="str">"stop"</span>] = <span class="kw">True</span>

t = <span class="fn">TinyTrainer</span>(<span class="fn">SGDClassifier</span>(loss=<span class="str">"log_loss"</span>, random_state=<span class="num">0</span>),
                callbacks=[<span class="fn">EarlyStop</span>(patience=<span class="num">3</span>)])
t.<span class="fn">train</span>(Xtr, ytr, Xev, yev)
<span class="fn">print</span>(<span class="str">"son durum:"</span>, t.state)
</code></pre></div>
</div>

<p class="l-text"><strong>Pyodide mini-trainer\'ı gerçek olanı nasıl yansıtıyor:</strong> 1) <code>TinyTrainer</code>, modeli, callback listesini ve bir <code>state</code> sözlüğünü (<code>step</code>, <code>best_eval</code>, <code>stop</code>) saklar — Trainer\'ın iç durumunun aynı şekli. 2) <code>fire(name, **kw)</code>, yaşam döngüsü olaylarını her callback\'e gönderir; bir hook eksik olduğunda no-op\'a varsayılır. 3) <code>train(...)</code> döngüsü önce <code>on_train_begin</code> çağırır, ardından her epoch için: <code>on_step_begin</code> → <code>model.partial_fit(Xtr, ytr, classes=[0,1])</code> → <code>predict_proba</code> + <code>log_loss</code> → <code>on_evaluate</code>; <code>state["stop"]=True</code> eğitimi sonlandırır. 4) <code>EarlyStop.on_evaluate</code> sabır mantığını çoğaltır ve <code>state["stop"]</code>\'u çevirir; üretim callback sözleşmesinin saf Python\'a 1:1 çevrildiğini gösterir.</p>


</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Gradyan Biriktirme</h2>
<p class="l-text">Batch boyutu 32 GPU'na sığmıyor ama kararlı eğitim için 32 lazım mı? Mikro-batch 4 ile 8 ileri-geri geçişi yap ve <code>optimizer.step()</code>'i sadece 8.'de çağır. Gradyanlar doğal olarak birikir çünkü PyTorch varsayılan olarak <code>.grad</code>'a toplar.</p>

<div class="katex-block">$$g_{\\text{eff}} = \\sum_{i=1}^{N_{\\text{accum}}} \\nabla L(x_i, \\theta) \\Big/ N_{\\text{accum}}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

<span class="cm"># Gradyan biriktirmeyi simüle et: mini-batch gradyanlarının ortalamasını al</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
n, d = <span class="num">1000</span>, <span class="num">10</span>
X = rng.<span class="fn">standard_normal</span>((n, d))
true_w = rng.<span class="fn">standard_normal</span>(d)
y = (X @ true_w + <span class="num">0.1</span>*rng.<span class="fn">standard_normal</span>(n) &gt; <span class="num">0</span>).<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="kw">def</span> <span class="fn">grad</span>(w, Xb, yb):
    p = <span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-Xb @ w))
    <span class="kw">return</span> Xb.T @ (p - yb) / <span class="fn">len</span>(yb)

<span class="cm"># İki şekilde eğit: BÜYÜK batch vs BİRİKTİRİLMİŞ küçük batch'ler</span>
<span class="kw">def</span> <span class="fn">train</span>(batch_size, accum=<span class="num">1</span>, lr=<span class="num">0.5</span>, steps=<span class="num">100</span>):
    w = np.<span class="fn">zeros</span>(d)
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(steps):
        g_acc = np.<span class="fn">zeros</span>(d)
        <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(accum):
            idx = rng.<span class="fn">integers</span>(<span class="num">0</span>, n, batch_size)
            g_acc += <span class="fn">grad</span>(w, X[idx], y[idx])
        w -= lr * g_acc / accum
    <span class="kw">return</span> w

w_big   = <span class="fn">train</span>(batch_size=<span class="num">32</span>, accum=<span class="num">1</span>)
w_accum = <span class="fn">train</span>(batch_size=<span class="num">4</span>,  accum=<span class="num">8</span>)   <span class="cm"># aynı efektif batch</span>
<span class="fn">print</span>(<span class="str">"büyük-batch  son loss:"</span>, <span class="fn">round</span>(np.<span class="fn">mean</span>((<span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-X<span class="kw">@w_big</span>))   - y)**<span class="num">2</span>), <span class="num">4</span>))
<span class="fn">print</span>(<span class="str">"accum 8x4    son loss:"</span>, <span class="fn">round</span>(np.<span class="fn">mean</span>((<span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-X<span class="kw">@w_accum</span>)) - y)**<span class="num">2</span>), <span class="num">4</span>))
<span class="fn">print</span>(<span class="str">"ağırlık kosinüs benzerliği:"</span>,
      <span class="fn">round</span>(<span class="fn">float</span>(w_big @ w_accum / (np.linalg.<span class="fn">norm</span>(w_big)*np.linalg.<span class="fn">norm</span>(w_accum))), <span class="num">4</span>))
</code></pre></div>

<p class="l-text"><strong>Gradyan biriktirme deneyi nasıl kurulmuş:</strong> 1) <code>X</code>, <code>true_w</code>, <code>y</code> 1000 örneklik bir ikili lojistik veri seti üretir; <code>grad(w, Xb, yb)</code> standart lojistik gradyanı döndürür. 2) <code>train(batch_size, accum=1, lr=0.5, steps=100)</code> optimizasyonu çalıştırır: her adımda <code>accum</code> mini-batch gradyanını <code>g_acc</code>\'ye toplar ve <code>w -= lr * g_acc / accum</code> uygular — PyTorch\'un içsel olarak yaptığı şey budur. 3) İki çalıştırma aynı efektif batch\'i (32) kullanır: tek büyük batch (<code>batch_size=32, accum=1</code>) ve biriktirilen (<code>batch_size=4, accum=8</code>). 4) Yazdırılan kayıplar ve <code>w_big</code> ile <code>w_accum</code> arasındaki kosinüs benzerliği, biriktirmenin büyük batch güncelleme yönünü sayısal gürültü içinde yeniden ürettiğini gösterir.</p>


<div class="calc-highlight">Trainer'da: <code>per_device_train_batch_size=4</code> ve <code>gradient_accumulation_steps=8</code> ayarla. Efektif batch = 32. Bellek maliyeti = sadece mikro-batch. Aktivasyonlar ve ara tamponlar doğrusal olarak küçülür.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Çoklu GPU'ya Geçiş: DDP</h2>
<p class="l-text"><strong>DistributedDataParallel</strong> giriş seviyesi çoklu GPU stratejisidir. Her GPU modelin tam bir kopyasını tutar; her biri batch'in farklı bir parçasını görür; geri yayılımdan sonra gradyanlar GPU'lar arasında <em>all-reduce</em> edilir. Senkronizasyon adım başına tek bir kolektif çağrıdır. Basit, hızlı ve model tek GPU'ya sığdığında doğru cevaptır.</p>

<div class="katex-block">$$g_{\\text{global}} = \\frac{1}{N_{\\text{gpu}}} \\sum_{i=1}^{N_{\\text{gpu}}} g_i$$</div>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO — accelerate)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># AYNI eğitim scriptini DDP ile 4 GPU'da başlat</span>
accelerate launch \\
    --multi_gpu \\
    --num_processes <span class="num">4</span> \\
    --mixed_precision bf16 \\
    train.py \\
    --per_device_train_batch_size <span class="num">8</span> \\
    --gradient_accumulation_steps <span class="num">4</span>   <span class="cm"># efektif batch = 8 * 4 * 4 = 128</span>
</code></pre></div>

<p class="l-text"><strong><code>accelerate launch</code> tek GPU\'lu bir script\'i 4 GPU\'lu DDP koşusuna nasıl dönüştürür:</strong> 1) <code>--multi_gpu</code> DistributedDataParallel\'i etkinleştirir; <code>--num_processes 4</code> GPU başına bir worker üretir. 2) <code>--mixed_precision bf16</code> ileri geçiş için bf16 autocast\'i açar ve aktivasyonları 16-bit\'te saklar; Ampere/Hopper donanımında bellek baskısını kabaca yarıya indirir. 3) <code>--per_device_train_batch_size 8</code> + <code>--gradient_accumulation_steps 4</code>, <code>train.py</code>\'de tek bir satır değiştirmeden 8 × 4 × 4 = 128 küresel efektif batch verir. 4) Tek GPU\'da çalışan aynı script artık ölçeklenir çünkü <code>accelerate</code> modeli, optimizer\'ı ve DataLoader\'ı arka planda sarar.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Batch'i bölüp parça başına gradyanların ortalamasını alarak DDP gradyan ortalamasını N "GPU" üzerinde simüle et.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

n, d = <span class="num">800</span>, <span class="num">8</span>
X = rng.<span class="fn">standard_normal</span>((n, d))
true_w = rng.<span class="fn">standard_normal</span>(d)
y = (X @ true_w &gt; <span class="num">0</span>).<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="kw">def</span> <span class="fn">grad</span>(w, Xb, yb):
    p = <span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-Xb @ w))
    <span class="kw">return</span> Xb.T @ (p - yb) / <span class="fn">len</span>(yb)

<span class="kw">def</span> <span class="fn">ddp_step</span>(w, X_batch, y_batch, n_gpu=<span class="num">4</span>, lr=<span class="num">0.3</span>):
    <span class="str">"""Batch'i n_gpu parçaya böl, yerel gradyanları hesapla, ortala (all-reduce)."""</span>
    shards_X = np.<span class="fn">array_split</span>(X_batch, n_gpu)
    shards_y = np.<span class="fn">array_split</span>(y_batch, n_gpu)
    local_grads = [<span class="fn">grad</span>(w, sx, sy) <span class="kw">for</span> sx, sy <span class="kw">in</span> <span class="fn">zip</span>(shards_X, shards_y)]
    g_global = np.<span class="fn">mean</span>(local_grads, axis=<span class="num">0</span>)        <span class="cm"># all-reduce ortalama</span>
    <span class="kw">return</span> w - lr * g_global

w = np.<span class="fn">zeros</span>(d)
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    idx = rng.<span class="fn">integers</span>(<span class="num">0</span>, n, <span class="num">64</span>)
    w = <span class="fn">ddp_step</span>(w, X[idx], y[idx], n_gpu=<span class="num">4</span>)

acc = ((<span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-X<span class="kw">@w</span>)) &gt; <span class="num">0.5</span>) == y).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"DDP-simüle eğitim doğruluğu: {acc:.3f}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>Simüle edilen DDP adımı all-reduce\'u nasıl gösteriyor:</strong> 1) <code>ddp_step(w, X_batch, y_batch, n_gpu=4, lr=0.3)</code> global batch\'i <code>n_gpu</code> parçaya bölmek için <code>np.array_split</code> kullanır — her simüle edilmiş GPU için bir tane. 2) <code>local_grads = [grad(w, sx, sy) for sx, sy in zip(shards_X, shards_y)]</code> tıpkı her gerçek GPU\'nun yapacağı gibi parça başına bir gradyan hesaplar. 3) <code>g_global = np.mean(local_grads, axis=0)</code>, NCCL\'in all-reduce mean işleminin numpy karşılığıdır — gerçek DDP\'nin her geri yayımda yaptığı işlem. 4) 200 adım sonra son doğruluk çıktısı, sentetik 4 GPU güncellemesinin tek süreçli bir temelle aynı kaliteye ulaştığını doğrular ve gerçek DDP\'nin yakınsama garantilerini yansıtır.</p>


</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. DeepSpeed ZeRO — Optimizer'ı Parçalama</h2>
<p class="l-text">DDP her GPU'da modelin tam kopyasını tutar; bu da her GPU'da tam bir <em>optimizer durumu</em> demektir. Adam parametre başına iki moment tamponu tutar — bu <strong>model boyutunun 3 katı</strong> optimizer durumu, her GPU'da. fp32 Adam ile 7B model için: GPU başına 84 GB. ZeRO bu durumu GPU'lar arasında parçalar; her biri sadece <code>1/N</code>'ini tutar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ZeRO-1</div><div class="card-body">Optimizer durumunu parçalar. 1B parametreli fp32 model için GPU başı bellek 12B'den ~6B'ye düşer.</div></div>
<div class="calc-card"><div class="card-title">ZeRO-2</div><div class="card-body">Gradyanları da parçalar. Yaklaşık tekrar yarıya iner.</div></div>
<div class="calc-card"><div class="card-title">ZeRO-3</div><div class="card-body">Parametreleri de parçalar. Tam model hiçbir zaman tek GPU'da bulunmaz. 100B+ modelleri sıradan kümelerde eğitir. Haberleşme yükü en yüksektir.</div></div>
<div class="calc-card"><div class="card-title">CPU offload</div><div class="card-body">İsteğe bağlı olarak optimizer durumunu host RAM'e veya NVMe'ye gönderir. Adım süresi yavaşlar ama tek A100'de 70B'yi açar.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>JSON (DEMO — DeepSpeed config)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>{
  <span class="str">"train_micro_batch_size_per_gpu"</span>: <span class="num">4</span>,
  <span class="str">"gradient_accumulation_steps"</span>: <span class="num">8</span>,
  <span class="str">"bf16"</span>: { <span class="str">"enabled"</span>: true },
  <span class="str">"zero_optimization"</span>: {
    <span class="str">"stage"</span>: <span class="num">3</span>,
    <span class="str">"offload_optimizer"</span>: { <span class="str">"device"</span>: <span class="str">"cpu"</span>,  <span class="str">"pin_memory"</span>: true },
    <span class="str">"offload_param"</span>:     { <span class="str">"device"</span>: <span class="str">"nvme"</span>, <span class="str">"nvme_path"</span>: <span class="str">"/scratch/zero"</span> },
    <span class="str">"overlap_comm"</span>: true,
    <span class="str">"contiguous_gradients"</span>: true
  },
  <span class="str">"gradient_clipping"</span>: <span class="num">1.0</span>,
  <span class="str">"wall_clock_breakdown"</span>: false
}
</code></pre></div>

<p class="l-text">Bunu <code>TrainingArguments(deepspeed="ds_config.json")</code> ile geçir; Trainer DeepSpeed'i senin için bağlar. Tek GPU'da çalışan aynı script artık küme ölçeğine genişler.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. FSDP — PyTorch'un Yerli Alternatifi</h2>
<p class="l-text"><strong>Fully Sharded Data Parallel</strong>, PyTorch'un ZeRO-3 tarzı parçalamanın birinci taraf uygulamasıdır. Yeni projelerde <code>accelerate</code>'in varsayılan parçalama stratejisi olmuştur — DeepSpeed ZeRO-3 ile aynı fikir, ama PyTorch'un autograd ve dağıtık ilkelleriyle daha sıkı entegre.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FULL_SHARD</div><div class="card-body">ZeRO-3 ile eşdeğer. Parametreler, gradyanlar ve optimizer durumu hepsi parçalanır.</div></div>
<div class="calc-card"><div class="card-title">SHARD_GRAD_OP</div><div class="card-body">ZeRO-2 ile eşdeğer. Daha az haberleşme, daha çok bellek.</div></div>
<div class="calc-card"><div class="card-title">NO_SHARD</div><div class="card-body">DDP'ye geri düşer. Heterojen bir eğitim scriptindeki en küçük modeller için kullanışlı.</div></div>
<div class="calc-card"><div class="card-title">HYBRID_SHARD</div><div class="card-body">Düğüm içinde parçala, düğümler arasında çoğalt. Düğüm-içi bant genişliği (NVLink) düğümler-arasını (Ethernet/IB) çok aştığında en iyi.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO — accelerate FSDP)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># accelerate config (etkileşimli) -> FSDP seç, ardından:</span>
accelerate launch \\
    --use_fsdp \\
    --fsdp_sharding_strategy FULL_SHARD \\
    --fsdp_auto_wrap_policy TRANSFORMER_BASED_WRAP \\
    --fsdp_transformer_layer_cls_to_wrap LlamaDecoderLayer \\
    --mixed_precision bf16 \\
    train.py
</code></pre></div>

<p class="l-text"><strong><code>accelerate launch</code> FSDP\'yi nasıl etkinleştiriyor:</strong> 1) <code>--use_fsdp</code>, DDP\'yi Fully Sharded Data Parallel ile değiştirir — PyTorch\'un yerel ZeRO-3 tarzı parçalaması. 2) <code>--fsdp_sharding_strategy FULL_SHARD</code> parametreleri, gradyanları ve optimizer state\'i her GPU\'da parçalar; <code>SHARD_GRAD_OP</code> ve <code>HYBRID_SHARD</code> gibi hafif alternatifler iletişimi azaltmak için bellekten taviz verir. 3) <code>--fsdp_auto_wrap_policy TRANSFORMER_BASED_WRAP</code> + <code>--fsdp_transformer_layer_cls_to_wrap LlamaDecoderLayer</code> FSDP\'ye her Llama decoder bloğunu bir parçalama birimi olarak ele almasını söyler — büyük modellerin modülleri elle sarmadan kümeye akma şekli budur. 4) <code>--mixed_precision bf16</code> aktivasyonları 16-bit\'te tutarak Ampere/Hopper GPU\'larda ek bellek tasarrufu sağlar.</p>


<div class="calc-highlight">2026'da pratik kural: PyTorch'taysan ve modelin <code>transformers</code>'tan geliyorsa önce FSDP. ZeRO-Infinity (NVMe offload), büyük ölçekte optimizer durumu CPU offload'u veya inference motoru istiyorsan DeepSpeed.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Gradient Checkpointing</h2>
<p class="l-text">İleri geçişler her katmanda aktivasyonları kaydeder ki geri geçiş yeniden kullanabilsin. 32 katmanlı bir transformer için bu, bellekte 32 küme aktivasyon demektir. <em>Gradient checkpointing</em> bunların çoğunu atar ve geri yayılım sırasında <em>yeniden hesaplar</em>. Yaklaşık %33 daha çok hesap ödersin ve ~%70 aktivasyon belleğinden tasarruf edersin.</p>

<div class="katex-block">$$\\text{mem}_{\\text{ckpt}} \\approx \\frac{\\text{mem}_{\\text{act}}}{\\sqrt{N_{\\text{layers}}}} \\quad\\text{(with optimal segmentation)}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — transformers)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> TrainingArguments

args = <span class="fn">TrainingArguments</span>(
    output_dir=<span class="str">"out"</span>,
    per_device_train_batch_size=<span class="num">8</span>,
    gradient_accumulation_steps=<span class="num">4</span>,
    gradient_checkpointing=<span class="kw">True</span>,           <span class="cm"># &lt;-- sihirli bayrak</span>
    gradient_checkpointing_kwargs={<span class="str">"use_reentrant"</span>: <span class="kw">False</span>},
    bf16=<span class="kw">True</span>,
    optim=<span class="str">"adamw_torch_fused"</span>,
    learning_rate=<span class="num">2e-5</span>,
    num_train_epochs=<span class="num">3</span>,
    logging_steps=<span class="num">10</span>,
    save_strategy=<span class="str">"epoch"</span>,
    eval_strategy=<span class="str">"epoch"</span>,
)
</code></pre></div>

<p class="l-text">Üçünü birleştir (gradient_accumulation + gradient_checkpointing + bf16) ve bir 7B model 24GB tüketici GPU'da rahatça eğitilir. Bunlar olmadan parametre yüklerken bile OOM yersin.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Bellek Matematiği — Sığacak mı?</h2>
<p class="l-text">Başlatmadan önce tahmin et. En büyük öngörülebilir maliyet ağırlıklar değil, optimizer durumudur. P-parametreli bir model için:</p>

<div class="katex-block">$$\\text{mem}_{\\text{train}} \\approx \\underbrace{2P}_{\\text{fp16 weights}} + \\underbrace{2P}_{\\text{fp32 master}} + \\underbrace{8P}_{\\text{Adam m,v fp32}} + \\underbrace{2P}_{\\text{grads}} + \\text{activations}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> math

<span class="kw">def</span> <span class="fn">memory_estimate</span>(n_params_billion, optimizer=<span class="str">"adam"</span>,
                    precision=<span class="str">"bf16"</span>, zero_stage=<span class="num">0</span>, n_gpu=<span class="num">1</span>):
    <span class="str">"""Transformer eğitimi için GPU başına yaklaşık VRAM tahmini (GB)."""</span>
    P = n_params_billion * <span class="num">1e9</span>
    bytes_per_param = <span class="num">2</span> <span class="kw">if</span> precision <span class="kw">in</span> (<span class="str">"fp16"</span>, <span class="str">"bf16"</span>) <span class="kw">else</span> <span class="num">4</span>
    weights = P * bytes_per_param
    master  = P * <span class="num">4</span> <span class="kw">if</span> precision <span class="kw">in</span> (<span class="str">"fp16"</span>, <span class="str">"bf16"</span>) <span class="kw">else</span> <span class="num">0</span>
    grads   = P * bytes_per_param
    <span class="kw">if</span> optimizer == <span class="str">"adam"</span>:
        opt = P * <span class="num">8</span>                  <span class="cm"># fp32'de m + v</span>
    <span class="kw">elif</span> optimizer == <span class="str">"sgd"</span>:
        opt = P * <span class="num">4</span>                  <span class="cm"># sadece momentum</span>
    <span class="kw">else</span>:
        opt = <span class="num">0</span>

    <span class="cm"># ZeRO parçalama faktörü</span>
    <span class="kw">if</span>   zero_stage == <span class="num">1</span>: opt   /= n_gpu
    <span class="kw">elif</span> zero_stage == <span class="num">2</span>: opt   /= n_gpu; grads  /= n_gpu
    <span class="kw">elif</span> zero_stage == <span class="num">3</span>: opt   /= n_gpu; grads  /= n_gpu; weights /= n_gpu

    total_gb = (weights + master + grads + opt) / <span class="num">1e9</span>
    <span class="kw">return</span> <span class="fn">round</span>(total_gb, <span class="num">1</span>)

<span class="cm"># Tek GPU'da Llama-7B vs 8 GPU'da ZeRO-3</span>
<span class="fn">print</span>(<span class="str">"7B  fp32 Adam, 1 GPU :"</span>, <span class="fn">memory_estimate</span>(<span class="num">7</span>, precision=<span class="str">"fp32"</span>), <span class="str">"GB"</span>)
<span class="fn">print</span>(<span class="str">"7B  bf16 Adam, 1 GPU :"</span>, <span class="fn">memory_estimate</span>(<span class="num">7</span>), <span class="str">"GB"</span>)
<span class="fn">print</span>(<span class="str">"70B bf16 Adam, ZeRO-3 8 GPU/her biri:"</span>,
      <span class="fn">memory_estimate</span>(<span class="num">70</span>, zero_stage=<span class="num">3</span>, n_gpu=<span class="num">8</span>), <span class="str">"GB"</span>)
<span class="fn">print</span>(<span class="str">"70B + CPU-offload-optimizer (~opt terimini yarıya indirir, kabaca):"</span>,
      <span class="fn">memory_estimate</span>(<span class="num">70</span>, zero_stage=<span class="num">3</span>, n_gpu=<span class="num">8</span>) - <span class="num">70</span>*<span class="num">8</span>/<span class="num">8</span>/<span class="num">2</span>, <span class="str">"GB yaklaşık"</span>)
</code></pre></div>

<p class="l-text"><strong>Bellek tahminleyicisi VRAM kullanımını nasıl ayırıyor:</strong> 1) <code>memory_estimate(n_params_billion, optimizer="adam", precision="bf16", zero_stage=0, n_gpu=1)</code> parametre başına dört büyük eğitim tensörünü toplar: <code>weights</code>, <code>master</code> (bf16/fp16 karma hassasiyet kullanıldığında fp32 ana kopya), <code>grads</code> ve <code>opt</code>. 2) Adam, iki fp32 moment tampon için parametre başına 8 bayta mal olur; SGD bunu parametre başına 4 bayta indirir. 3) <code>zero_stage</code> dalları optimizer\'ı (<code>stage=1</code>), gradyanları (<code>stage=2</code>) ve ağırlıkları (<code>stage=3</code>) <code>n_gpu</code>\'ya böler — DeepSpeed/FSDP\'nin her katmanı nasıl parçaladığını modelleyerek. 4) Dört <code>print</code> çağrısı tek GPU\'da 7B fp32 Adam, tek GPU\'da 7B bf16 Adam, 8 GPU\'da ZeRO-3 ile 70B bf16 Adam ve aynısını kaba CPU-offload muhasebesiyle karşılaştırır.</p>


<div class="calc-highlight">"Bu sığmıyor" sürprizlerinin çoğu Adam'ın 8 byte/parametresini unutmaktan gelir. <code>adamw_8bit</code>'e (bitsandbytes) geç ve o 8, 2 olur — baskın terimde anında 4x azalma.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. OOM Ayıklama Tarifi</h2>
<p class="l-text">Eğitim OOM verdiğinde bu listeyi sırayla yürü. Her adım sabit bir çarpan; ilk üçü vakaların %90'ını çözer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Mikro-batch'i düşür</div><div class="card-body"><code>per_device_train_batch_size</code>'ı yarıya indir, <code>gradient_accumulation_steps</code>'i ikiye katla. Efektif batch değişmez, aktivasyon belleği yarıya iner.</div></div>
<div class="calc-card"><div class="card-title">2. bf16 + gradient_checkpointing</div><div class="card-body">Birlikte tipik olarak ~%30 throughput karşılığında belleğin %60-70'ini boşaltır.</div></div>
<div class="calc-card"><div class="card-title">3. 8-bit optimizer</div><div class="card-body"><code>optim="paged_adamw_8bit"</code>. Baskın Adam terimini 4x azaltır.</div></div>
<div class="calc-card"><div class="card-title">4. ZeRO-2 / FSDP_GRAD_OP</div><div class="card-body">Gradyanları ve optimizer durumunu GPU'lara parçala. Doğrusal ölçekleme.</div></div>
<div class="calc-card"><div class="card-title">5. ZeRO-3 / FSDP_FULL_SHARD</div><div class="card-body">Parametreleri de parçala. Tüketici GPU'larda ~10B üstünde gerekli.</div></div>
<div class="calc-card"><div class="card-title">6. CPU/NVMe offload</div><div class="card-body">Son çare. Optimizer durumunu VRAM dışına iter. Adım süresi 2-4x büyür.</div></div>
</div>

<p class="l-text">Bu listeyi yukarıdaki bellek tahmincisiyle eşleştir; OOM tahmin oyunu olmaktan çıkar. Trainer işi yapıyor; sen sadece konfigürasyonu seçiyorsun. Yaşam döngüsünü ve parçalama merdivenini bilmek "7B modelim çöküyor" ile "hafta sonu bir ince ayar yayınladım" arasındaki farkı yaratır.</p>
</div>
`
};
