window.HF_L8 = {
en: `<p class="l-text"><strong>Full fine-tuning of a 7B model needs ~84GB of VRAM. LoRA needs 16GB. Same downstream accuracy.</strong> That ratio is why every modern fine-tuning recipe — instruction tuning, RLHF, domain adaptation — runs on top of PEFT (Parameter-Efficient Fine-Tuning). The math is elegant: instead of training all 7 billion parameters of a transformer, train two small low-rank matrices per layer whose product approximates the weight update you would have learned anyway.</p>

<p class="l-text">In this lesson we'll derive LoRA from first principles, look at QLoRA (the 4-bit-base + LoRA-update combo that put 70B fine-tunes on a single A100), tour the cousins (Adapter, Prefix-tuning, IA³), and walk through the merge step that fuses an adapter back into the base for zero-overhead inference. Every concept is paired with a runnable NumPy demo — LoRA's matrix decomposition is small enough that you can hand-construct it and verify the rank-r approximation.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The LoRA decomposition: W' = W + (alpha/r) * B @ A</li>
<li>Why rank 4-16 covers most fine-tuning tasks (intrinsic dimensionality)</li>
<li>QLoRA: NF4 quantization + double-quant + paged optimizers</li>
<li>Adapter, Prefix-tuning, IA3 — when each beats LoRA</li>
<li>Merging adapters for production zero-overhead inference</li>
<li>Multi-LoRA routing (one base model, many task adapters)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The LoRA Hypothesis</h2>
<p class="l-text">The empirical observation behind LoRA (Hu et al. 2021): when you fine-tune a large pretrained model, the change in weights <code>delta W</code> has an extremely low intrinsic rank — often as low as 4 or 8 — even when the original matrix is thousands by thousands. So instead of learning the full <code>delta W</code> in <code>R^(d x d)</code>, learn two skinny matrices whose product approximates it.</p>

<div class="katex-block">$$W' = W_0 + \\Delta W = W_0 + \\frac{\\alpha}{r} \\, B A, \\qquad A \\in \\mathbb{R}^{r \\times d},\\ B \\in \\mathbb{R}^{d \\times r}$$</div>

<p class="l-text">For <code>d = 4096</code> and <code>r = 8</code>, the full update has 16.7M parameters; the LoRA update has 65k — a <strong>250x reduction</strong>. <code>W_0</code> is frozen; only <code>A</code> and <code>B</code> get gradients. The scaling factor <code>alpha / r</code> is conventional — it makes the update magnitude roughly independent of the chosen rank.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">A initialization</div><div class="card-body">Gaussian (small variance). Acts as a random projection.</div></div>
<div class="calc-card"><div class="card-title">B initialization</div><div class="card-body">Zeros. So the update starts at 0 and the model behaves identically to the frozen base on step 0.</div></div>
<div class="calc-card"><div class="card-title">Trainable params</div><div class="card-body"><code>2 * d * r</code> per linear layer. For Llama-7B with LoRA on Q,K,V,O: ~16M trainable, vs 7B frozen.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. LoRA from Scratch in NumPy</h2>
<p class="l-text">Build a LoRA-augmented linear layer end-to-end. We'll show that for a small rank, <code>B @ A</code> can recover most of the signal in a synthetic <code>delta W</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

d = <span class="num">256</span>
r_lora = <span class="num">8</span>
alpha = <span class="num">16</span>

<span class="cm"># Frozen base weight + a "true" low-rank perturbation we will try to recover</span>
W0 = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.02</span>
true_A = rng.<span class="fn">standard_normal</span>((r_lora, d)) * <span class="num">0.1</span>
true_B = rng.<span class="fn">standard_normal</span>((d, r_lora)) * <span class="num">0.1</span>
true_delta = true_B @ true_A
W_full = W0 + true_delta             <span class="cm"># this is what full FT would converge to</span>

<span class="cm"># LoRA-style trainable parameters</span>
A = rng.<span class="fn">standard_normal</span>((r_lora, d)) * <span class="num">0.01</span>     <span class="cm"># gaussian init</span>
B = np.<span class="fn">zeros</span>((d, r_lora))                       <span class="cm"># zero init -> starts at W0</span>

<span class="kw">def</span> <span class="fn">lora_forward</span>(x):
    <span class="kw">return</span> x @ W0.T + (alpha/r_lora) * (x @ A.T) @ B.T

<span class="kw">def</span> <span class="fn">full_forward</span>(x):
    <span class="kw">return</span> x @ W_full.T

<span class="cm"># Train A, B by gradient descent on MSE between LoRA and full forward</span>
N = <span class="num">1000</span>
X = rng.<span class="fn">standard_normal</span>((N, d))
Y = <span class="fn">full_forward</span>(X)
lr = <span class="num">0.05</span>

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2000</span>):
    pred = <span class="fn">lora_forward</span>(X)
    err  = pred - Y
    loss = (err**<span class="num">2</span>).<span class="fn">mean</span>()

    <span class="cm"># gradients (chain rule through the BA product)</span>
    scale = alpha / r_lora
    grad_pred = <span class="num">2</span> * err / (N * d)
    <span class="cm"># d/dB:  err -> sum over batch of err^T @ (x A^T) ... in flat form:</span>
    XAt = X @ A.T                      <span class="cm"># (N, r)</span>
    grad_B = scale * (err.T @ XAt)
    BX = (X @ A.T) @ B.T               <span class="cm"># not directly used; below uses chain</span>
    grad_A = scale * (B.T @ err.T @ X)

    A -= lr * grad_A
    B -= lr * grad_B
    <span class="kw">if</span> step % <span class="num">400</span> == <span class="num">0</span>:
        cos = <span class="fn">float</span>((B @ A).<span class="fn">ravel</span>() @ true_delta.<span class="fn">ravel</span>() /
                    (np.linalg.<span class="fn">norm</span>(B @ A) * np.linalg.<span class="fn">norm</span>(true_delta) + <span class="num">1e-12</span>))
        <span class="fn">print</span>(f<span class="str">"step {step:4d}  loss={loss:.6f}  delta-cosine-sim={cos:.4f}"</span>)

<span class="fn">print</span>(<span class="str">"\\nfinal delta-W cosine vs truth:"</span>,
      <span class="fn">round</span>(<span class="fn">float</span>((B @ A).<span class="fn">ravel</span>() @ true_delta.<span class="fn">ravel</span>() /
            (np.linalg.<span class="fn">norm</span>(B @ A) * np.linalg.<span class="fn">norm</span>(true_delta))), <span class="num">4</span>))
<span class="fn">print</span>(f<span class="str">"trainable params: {A.size + B.size}  vs full FT: {d*d}  ({d*d/(A.size+B.size):.0f}x smaller)"</span>)
</code></pre></div>

<p class="l-text"><strong>How this NumPy LoRA experiment proves the math:</strong> 1) The setup creates a frozen base <code>W0</code> and a synthetic target <code>W_full = W0 + true_delta</code> where <code>true_delta = true_B @ true_A</code> is genuinely low-rank. 2) <code>A</code> is Gaussian-initialised and <code>B</code> starts at zero, so <code>lora_forward(x) = x @ W0.T + (alpha/r) * (x @ A.T) @ B.T</code> behaves exactly like the frozen base on step 0 — the safety property the calc-highlight calls out. 3) The 2000-step loop computes MSE between <code>lora_forward(X)</code> and <code>full_forward(X)</code>, then updates only <code>A</code> and <code>B</code> via manually derived chain-rule gradients. 4) The periodic prints track cosine similarity between <code>B @ A</code> and <code>true_delta</code>, ending with a final ratio: trainable params <code>2 * r * d = 4096</code> vs full FT <code>d*d = 65536</code> — a 16× reduction.</p>


<div class="calc-highlight">Notice that <code>B</code> starts at zero, so <code>delta_W = 0</code> at step 0 and the LoRA-augmented model behaves exactly like the frozen base. This is what makes adapters safe to attach without risking catastrophic forgetting on step 1.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The PEFT Library API</h2>
<p class="l-text">In practice, you do not implement LoRA by hand — HuggingFace's <code>peft</code> library handles it in three lines. The API is the same regardless of whether you target Q, K, V, O, MLP, or all of them.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — peft + transformers)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForCausalLM, AutoTokenizer
<span class="kw">from</span> peft <span class="kw">import</span> LoraConfig, get_peft_model, TaskType

base = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(
    <span class="str">"meta-llama/Llama-2-7b-hf"</span>,
    torch_dtype=<span class="str">"bfloat16"</span>,
    device_map=<span class="str">"auto"</span>,
)

lora_config = <span class="fn">LoraConfig</span>(
    task_type=TaskType.CAUSAL_LM,
    r=<span class="num">16</span>,                        <span class="cm"># rank</span>
    lora_alpha=<span class="num">32</span>,               <span class="cm"># scaling -> alpha/r = 2</span>
    lora_dropout=<span class="num">0.05</span>,
    target_modules=[<span class="str">"q_proj"</span>, <span class="str">"k_proj"</span>, <span class="str">"v_proj"</span>, <span class="str">"o_proj"</span>],
    bias=<span class="str">"none"</span>,
)

model = <span class="fn">get_peft_model</span>(base, lora_config)
model.<span class="fn">print_trainable_parameters</span>()
<span class="cm"># trainable params: 16,777,216 || all params: 6,755,192,832 || trainable%: 0.2484</span>

<span class="cm"># Train as usual with Trainer; only the LoRA weights move.</span>
<span class="cm"># Save just the adapter (a few MB):</span>
model.<span class="fn">save_pretrained</span>(<span class="str">"./llama-lora-adapter"</span>)
</code></pre></div>

<p class="l-text">The trainable percentage is the headline number: <strong>0.25%</strong> for a typical 7B + r=16 setup. That is the entire reason PEFT exists — and why every reasonable instruction-tuning recipe in 2026 starts with LoRA, not full FT.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. QLoRA — Quantized Base + LoRA Update</h2>
<p class="l-text">LoRA frees you from training the full weight tensor — but you still have to <em>store</em> it on the GPU for the forward pass. QLoRA (Dettmers et al. 2023) takes the next step: <strong>quantize the frozen base to 4-bit</strong>, keep the LoRA adapter in 16-bit, train normally. The 4-bit base saves 4x VRAM on the dominant term, and accuracy is essentially unchanged.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">NF4 quantization</div><div class="card-body">"NormalFloat 4-bit" — a 16-level non-linear quantization fit to the typical Gaussian-shaped weight distribution. Beats uniform INT4.</div></div>
<div class="calc-card"><div class="card-title">Double quantization</div><div class="card-body">The per-block scale factors themselves get quantized. Saves ~0.4 bits per parameter — adds up over 7B params.</div></div>
<div class="calc-card"><div class="card-title">Paged optimizers</div><div class="card-body">Optimizer states live in CPU memory and page in/out via NVIDIA Unified Memory. Survives momentary OOM spikes.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — bitsandbytes + peft)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForCausalLM, BitsAndBytesConfig
<span class="kw">from</span> peft <span class="kw">import</span> prepare_model_for_kbit_training, LoraConfig, get_peft_model

bnb_config = <span class="fn">BitsAndBytesConfig</span>(
    load_in_4bit=<span class="kw">True</span>,
    bnb_4bit_quant_type=<span class="str">"nf4"</span>,          <span class="cm"># NormalFloat-4</span>
    bnb_4bit_use_double_quant=<span class="kw">True</span>,     <span class="cm"># quantize the scale factors too</span>
    bnb_4bit_compute_dtype=<span class="str">"bfloat16"</span>,  <span class="cm"># de-quantize to bf16 for matmul</span>
)

model = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(
    <span class="str">"meta-llama/Llama-2-70b-hf"</span>,
    quantization_config=bnb_config,
    device_map=<span class="str">"auto"</span>,
)
model = <span class="fn">prepare_model_for_kbit_training</span>(model)   <span class="cm"># casts norms/embeds to fp32</span>

lora = <span class="fn">LoraConfig</span>(r=<span class="num">16</span>, lora_alpha=<span class="num">32</span>,
                  target_modules=[<span class="str">"q_proj"</span>,<span class="str">"k_proj"</span>,<span class="str">"v_proj"</span>,<span class="str">"o_proj"</span>],
                  bias=<span class="str">"none"</span>, task_type=<span class="str">"CAUSAL_LM"</span>)
model = <span class="fn">get_peft_model</span>(model, lora)
model.<span class="fn">print_trainable_parameters</span>()
<span class="cm"># Llama-70B fits on a single 48GB A6000 in QLoRA -- impossible without it.</span>
</code></pre></div>

<p class="l-text"><strong>How the QLoRA configuration combines bitsandbytes + PEFT:</strong> 1) <code>BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_use_double_quant=True, bnb_4bit_compute_dtype="bfloat16")</code> declares the 4-bit storage format (NormalFloat-4), enables double quantization of the per-block scales and asks bitsandbytes to de-quantize to bf16 for the actual matmul. 2) <code>AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-70b-hf", quantization_config=bnb_config, device_map="auto")</code> loads the 70B Llama with each frozen weight tensor stored in 4 bits. 3) <code>prepare_model_for_kbit_training(model)</code> casts layer norms and embeddings back to fp32 and freezes the base — essential for stable mixed-precision training. 4) <code>LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj","k_proj","v_proj","o_proj"], bias="none", task_type="CAUSAL_LM")</code> + <code>get_peft_model(model, lora)</code> attaches 16-bit LoRA adapters on top, letting a 70B model train on a single 48 GB A6000.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Simulate INT8 quantization of a weight matrix and measure the round-trip error. Same intuition as NF4 — pick a scale, round to integer, dequantize.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Pretend this is a transformer weight matrix</span>
W = rng.<span class="fn">standard_normal</span>((<span class="num">1024</span>, <span class="num">1024</span>)).<span class="fn">astype</span>(np.float32) * <span class="num">0.02</span>
<span class="fn">print</span>(<span class="str">"W bytes (fp32):"</span>, W.nbytes)

<span class="kw">def</span> <span class="fn">quant_int8_blockwise</span>(W, block=<span class="num">64</span>):
    <span class="str">"""Per-block symmetric INT8 quantization (the bitsandbytes recipe, simplified)."""</span>
    out_q = np.<span class="fn">zeros</span>(W.shape, dtype=np.int8)
    scales = np.<span class="fn">zeros</span>((W.shape[<span class="num">0</span>] // block, W.shape[<span class="num">1</span>] // block), dtype=np.float32)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, W.shape[<span class="num">0</span>], block):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, W.shape[<span class="num">1</span>], block):
            blk = W[i:i+block, j:j+block]
            s = np.<span class="fn">abs</span>(blk).<span class="fn">max</span>() / <span class="num">127</span> + <span class="num">1e-12</span>
            out_q[i:i+block, j:j+block] = np.<span class="fn">round</span>(blk / s).<span class="fn">clip</span>(-<span class="num">127</span>, <span class="num">127</span>).<span class="fn">astype</span>(np.int8)
            scales[i//block, j//block] = s
    <span class="kw">return</span> out_q, scales

<span class="kw">def</span> <span class="fn">dequant</span>(Q, scales, block=<span class="num">64</span>):
    out = np.<span class="fn">zeros</span>(Q.shape, dtype=np.float32)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, Q.shape[<span class="num">0</span>], block):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, Q.shape[<span class="num">1</span>], block):
            out[i:i+block, j:j+block] = Q[i:i+block, j:j+block] * scales[i//block, j//block]
    <span class="kw">return</span> out

Q, S = <span class="fn">quant_int8_blockwise</span>(W)
W_back = <span class="fn">dequant</span>(Q, S)

err = np.linalg.<span class="fn">norm</span>(W - W_back) / np.linalg.<span class="fn">norm</span>(W)
<span class="fn">print</span>(f<span class="str">"INT8 round-trip relative error: {err:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"storage:  fp32 = {W.nbytes/1024:.1f} KB,  int8+scales = {(Q.nbytes + S.nbytes)/1024:.1f} KB"</span>)

<span class="cm"># Forward pass error on a batch</span>
x = rng.<span class="fn">standard_normal</span>((<span class="num">32</span>, <span class="num">1024</span>)).<span class="fn">astype</span>(np.float32)
y_orig = x @ W.T
y_q    = x @ W_back.T
<span class="fn">print</span>(<span class="str">"output cosine sim:"</span>,
      <span class="fn">round</span>(<span class="fn">float</span>((y_orig.<span class="fn">ravel</span>() @ y_q.<span class="fn">ravel</span>()) /
                  (np.linalg.<span class="fn">norm</span>(y_orig)*np.linalg.<span class="fn">norm</span>(y_q))), <span class="num">6</span>))
</code></pre></div>
</div>

<p class="l-text"><strong>How the INT8 quantization demo mirrors what bitsandbytes does:</strong> 1) <code>W = rng.standard_normal((1024, 1024)).astype(np.float32) * 0.02</code> creates a realistic transformer-scale weight matrix and prints its fp32 byte count. 2) <code>quant_int8_blockwise(W, block=64)</code> walks the matrix in 64×64 tiles, picks a per-block scale <code>s = abs(blk).max() / 127</code>, and rounds + clips into INT8 — the exact recipe behind bnb\'s LLM.int8() loader. 3) <code>dequant(Q, scales, block=64)</code> reconstructs the fp32 view by multiplying each tile by its scale. 4) The two prints report the round-trip relative error and storage savings (fp32 → int8 + scales, ~4× reduction), and the final cosine similarity between <code>x @ W.T</code> and <code>x @ W_back.T</code> shows downstream forward outputs are visually identical despite the lossy round-trip.</p>


</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The PEFT Family Beyond LoRA</h2>
<p class="l-text">LoRA dominates, but it's not the only option. Three variants you should know about — each has a niche where it wins.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adapter (Houlsby 2019)</div><div class="card-body">Insert a small bottleneck MLP after each transformer block: <code>down -&gt; nonlinearity -&gt; up</code>, with a residual. Great for multi-task setups; slightly more inference overhead than LoRA.</div></div>
<div class="calc-card"><div class="card-title">Prefix-tuning</div><div class="card-body">Prepend learned virtual tokens to the K and V of every attention layer. The model "sees" them as context. Strong for generation tasks; weaker for classification.</div></div>
<div class="calc-card"><div class="card-title">IA3 (Liu 2022)</div><div class="card-body">Multiplicative scaling vectors on K, V, and the FFN intermediate. ~10x fewer trainable params than LoRA at comparable accuracy in low-data regimes.</div></div>
<div class="calc-card"><div class="card-title">DoRA / VeRA</div><div class="card-body">2024 evolutions. DoRA decomposes magnitude and direction; VeRA shares random A,B across layers and trains only per-layer scaling. State-of-the-art in 2025-26.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — peft variants)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> peft <span class="kw">import</span> (
    LoraConfig, AdaLoraConfig, IA3Config, PrefixTuningConfig, get_peft_model
)

<span class="cm"># Each just wraps the base model differently</span>
configs = {
    <span class="str">"lora"</span>:     <span class="fn">LoraConfig</span>(r=<span class="num">16</span>, lora_alpha=<span class="num">32</span>, target_modules=[<span class="str">"q_proj"</span>,<span class="str">"v_proj"</span>]),
    <span class="str">"adalora"</span>:  <span class="fn">AdaLoraConfig</span>(init_r=<span class="num">12</span>, target_r=<span class="num">8</span>, target_modules=[<span class="str">"q_proj"</span>,<span class="str">"v_proj"</span>]),
    <span class="str">"ia3"</span>:      <span class="fn">IA3Config</span>(target_modules=[<span class="str">"k_proj"</span>,<span class="str">"v_proj"</span>,<span class="str">"down_proj"</span>],
                          feedforward_modules=[<span class="str">"down_proj"</span>]),
    <span class="str">"prefix"</span>:   <span class="fn">PrefixTuningConfig</span>(num_virtual_tokens=<span class="num">20</span>),
}

<span class="cm"># Same get_peft_model() for all of them</span>
<span class="cm"># model = get_peft_model(base_model, configs["ia3"])</span>
<span class="cm"># model.print_trainable_parameters()</span>
</code></pre></div>
</div>

<p class="l-text"><strong>How the PEFT API unifies four different adapter families:</strong> 1) <code>LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj","v_proj"])</code> declares classical LoRA on attention Q/V projections. 2) <code>AdaLoraConfig(init_r=12, target_r=8, target_modules=[...])</code> starts with a higher rank that gets pruned to <code>target_r</code> during training — adaptive rank. 3) <code>IA3Config(target_modules=["k_proj","v_proj","down_proj"], feedforward_modules=["down_proj"])</code> trains tiny multiplicative scaling vectors — ~10× fewer params than LoRA in low-data regimes. 4) <code>PrefixTuningConfig(num_virtual_tokens=20)</code> prepends 20 learnable virtual tokens to every attention layer\'s K and V. The commented call site shows the unified pattern: <code>model = get_peft_model(base_model, configs["ia3"])</code> — swap one line and you swap the adapter family.</p>


<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Merging Adapters for Inference</h2>
<p class="l-text">During training, the LoRA adapter sits beside the base. During inference you often want zero overhead — no extra matrix multiply per layer. The fix: <code>model.merge_and_unload()</code> folds <code>(alpha/r) * B @ A</code> back into <code>W_0</code>, producing a single dense matrix that performs identically to the LoRA-augmented model but with no extra ops.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — peft merge)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> peft <span class="kw">import</span> PeftModel
<span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForCausalLM, AutoTokenizer

<span class="cm"># Load base + adapter</span>
base = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">"meta-llama/Llama-2-7b-hf"</span>, torch_dtype=<span class="str">"bfloat16"</span>)
model = PeftModel.<span class="fn">from_pretrained</span>(base, <span class="str">"./llama-lora-adapter"</span>)

<span class="cm"># Fuse the adapter into the base weights</span>
merged = model.<span class="fn">merge_and_unload</span>()

<span class="cm"># Save as a normal HF model -- no PEFT runtime dependency for inference</span>
merged.<span class="fn">save_pretrained</span>(<span class="str">"./llama-merged"</span>)

<span class="cm"># Now load it without peft installed at all</span>
plain = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">"./llama-merged"</span>, torch_dtype=<span class="str">"bfloat16"</span>)
<span class="cm"># Inference is bit-identical to base+adapter, but ~5-15% faster.</span>
</code></pre></div>

<p class="l-text"><strong>How adapter merging eliminates inference overhead:</strong> 1) <code>AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b-hf", torch_dtype="bfloat16")</code> + <code>PeftModel.from_pretrained(base, "./llama-lora-adapter")</code> reconstructs the trained model as a base + LoRA adapter pair. 2) <code>model.merge_and_unload()</code> folds <code>(alpha/r) * B @ A</code> back into <code>W_0</code>, producing a plain dense matrix per layer with no extra ops. 3) <code>merged.save_pretrained("./llama-merged")</code> writes the fused weights to disk as a standard HF checkpoint. 4) <code>AutoModelForCausalLM.from_pretrained("./llama-merged", torch_dtype="bfloat16")</code> can then load the model without <code>peft</code> installed at all — inference is bit-identical to base + adapter but ~5–15% faster because the runtime drops the extra matmul.</p>


<div class="calc-highlight">Caveat: merging is only correct in fp16/bf16. If your base is in 4-bit (QLoRA), you cannot merge directly — dequantize first, or keep the adapter on top at inference time.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Multi-LoRA Routing</h2>
<p class="l-text">Adapters are tiny (~50 MB for r=16 on a 7B model). That makes a beautiful production pattern possible: <strong>one base model in VRAM, dozens of adapters on disk, swap per request</strong>. vLLM, TGI, and LoRAX all support this natively in 2026.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Simulate a routing system: one frozen base, three task adapters</span>
d, r = <span class="num">128</span>, <span class="num">4</span>
W0 = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.02</span>
adapters = {
    <span class="str">"code"</span>:     {<span class="str">"A"</span>: rng.<span class="fn">standard_normal</span>((r, d))*<span class="num">0.05</span>, <span class="str">"B"</span>: rng.<span class="fn">standard_normal</span>((d, r))*<span class="num">0.05</span>},
    <span class="str">"medical"</span>:  {<span class="str">"A"</span>: rng.<span class="fn">standard_normal</span>((r, d))*<span class="num">0.05</span>, <span class="str">"B"</span>: rng.<span class="fn">standard_normal</span>((d, r))*<span class="num">0.05</span>},
    <span class="str">"legal"</span>:    {<span class="str">"A"</span>: rng.<span class="fn">standard_normal</span>((r, d))*<span class="num">0.05</span>, <span class="str">"B"</span>: rng.<span class="fn">standard_normal</span>((d, r))*<span class="num">0.05</span>},
}

<span class="kw">def</span> <span class="fn">route</span>(x, task):
    a = adapters[task]
    delta_W = a[<span class="str">"B"</span>] @ a[<span class="str">"A"</span>]
    <span class="kw">return</span> x @ (W0 + delta_W).T

x = rng.<span class="fn">standard_normal</span>((<span class="num">1</span>, d))
<span class="kw">for</span> task <span class="kw">in</span> [<span class="str">"code"</span>, <span class="str">"medical"</span>, <span class="str">"legal"</span>]:
    out = <span class="fn">route</span>(x, task)
    <span class="fn">print</span>(f<span class="str">"{task:8s}: out norm = {np.linalg.norm(out):.4f}"</span>)

<span class="cm"># Adapter sizes vs base</span>
<span class="kw">import</span> sys
adapter_bytes = <span class="fn">sum</span>(a[<span class="str">"A"</span>].nbytes + a[<span class="str">"B"</span>].nbytes <span class="kw">for</span> a <span class="kw">in</span> adapters.<span class="fn">values</span>())
<span class="fn">print</span>(f<span class="str">"\\nbase: {W0.nbytes:,} bytes  |  3 adapters total: {adapter_bytes:,} bytes "</span>
      f<span class="str">"({W0.nbytes / (adapter_bytes/3):.0f}x smaller per adapter)"</span>)
</code></pre></div>

<p class="l-text">The economics in production: instead of running 5 separate fine-tuned 7B endpoints (35B parameters resident), run one base + 5 adapters (~7.25B resident). VRAM cost drops 5x, throughput improves because the base's KV cache is shared.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Choosing r, alpha, and Targets</h2>
<p class="l-text">Three knobs, three rules of thumb that the field converged on through 2024-25 ablations.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rank r</div><div class="card-body">Start with r=8 for chat fine-tuning, r=16-32 for domain adaptation, r=64+ for hard tasks (code, multi-step reasoning). Past r=64 returns diminish.</div></div>
<div class="calc-card"><div class="card-title">Alpha</div><div class="card-body">Set <code>alpha = 2 * r</code> as a default (so the scaling factor alpha/r = 2). Some recipes use alpha = r (scale = 1). Both work; train on a small subset and pick by eval.</div></div>
<div class="calc-card"><div class="card-title">Target modules</div><div class="card-body">Q and V are the highest-leverage attention projections. Adding K and O is +50% params for marginal accuracy. MLP layers (<code>gate_proj</code>, <code>up_proj</code>, <code>down_proj</code>) help on knowledge-heavy tasks.</div></div>
<div class="calc-card"><div class="card-title">Dropout</div><div class="card-body">0.05-0.1 on the LoRA path is standard. Acts as regularization for the very high-capacity adapter.</div></div>
</div>

<p class="l-text">In aggregate: PEFT turned fine-tuning from "needs an 8xA100 cluster and a week" into "runs in a Colab notebook over lunch". That shift is what makes 2026's open-weights ecosystem viable — and why every "fine-tune your own model" tutorial begins with <code>get_peft_model</code>.</p>
</div>
`,
tr: `<p class="l-text"><strong>Bir 7B modelin tam ince ayarı ~84GB VRAM ister. LoRA 16GB ister. Aynı aşağı-akış doğruluğu.</strong> Bu oran, modern her ince ayar tarifinin — instruction tuning, RLHF, alan uyarlaması — PEFT (Parameter-Efficient Fine-Tuning) üstüne kurulu olmasının nedenidir. Matematik zarif: bir transformer'ın 7 milyar parametresinin tamamını eğitmek yerine, çarpımı zaten öğreneceğin ağırlık güncellemesini yaklaşan iki küçük düşük-rank matrisi katman başına eğit.</p>

<p class="l-text">Bu derste LoRA'yı ilk ilkelerden türeteceğiz, QLoRA'ya bakacağız (4-bit base + LoRA güncelleme kombosu, tek A100'de 70B ince ayarı yapan), kuzenleri (Adapter, Prefix-tuning, IA³) gezeceğiz ve adapter'ı tekrar base'e kaynatıp sıfır-yük çıkarımı sağlayan birleştirme adımını yürüyeceğiz. Her kavramı çalıştırılabilir bir NumPy demosuyla eşleştirdik — LoRA'nın matris ayrışımı elle inşa edip rank-r yaklaşımını doğrulayabilecek kadar küçük.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>LoRA ayrışımı: W' = W + (alpha/r) * B @ A</li>
<li>Çoğu ince ayar görevini neden rank 4-16 kapsar (intrinsic boyutluluk)</li>
<li>QLoRA: NF4 quantization + double-quant + paged optimizer'lar</li>
<li>Adapter, Prefix-tuning, IA3 — her birinin LoRA'yı ne zaman yendiği</li>
<li>Üretim için adapter'ları birleştirip sıfır-yük çıkarım</li>
<li>Multi-LoRA yönlendirme (tek base model, çok görev adapter'ı)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. LoRA Hipotezi</h2>
<p class="l-text">LoRA'nın arkasındaki ampirik gözlem (Hu vd. 2021): büyük bir önceden eğitilmiş modeli ince ayarladığında, ağırlıklardaki <code>delta W</code> değişimi son derece düşük intrinsic rank'a sahiptir — orijinal matris binlerce x binlerce olsa bile sıklıkla 4 ya da 8 kadar düşük. O hâlde tam <code>delta W</code>'yi <code>R^(d x d)</code>'de öğrenmek yerine, çarpımı onu yaklaşan iki ince matris öğren.</p>

<div class="katex-block">$$W' = W_0 + \\Delta W = W_0 + \\frac{\\alpha}{r} \\, B A, \\qquad A \\in \\mathbb{R}^{r \\times d},\\ B \\in \\mathbb{R}^{d \\times r}$$</div>

<p class="l-text"><code>d = 4096</code> ve <code>r = 8</code> için tam güncellemenin 16.7M parametresi var; LoRA güncellemesinin 65k — <strong>250x azalma</strong>. <code>W_0</code> donmuş; sadece <code>A</code> ve <code>B</code> gradyan alır. Ölçek faktörü <code>alpha / r</code> gelenekseldir — güncelleme büyüklüğünü seçilen rank'tan kabaca bağımsız kılar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">A başlatma</div><div class="card-body">Gauss (küçük varyans). Rastgele projeksiyon görevi görür.</div></div>
<div class="calc-card"><div class="card-title">B başlatma</div><div class="card-body">Sıfır. Böylece güncelleme 0'dan başlar ve model 0. adımda donmuş base ile birebir aynı davranır.</div></div>
<div class="calc-card"><div class="card-title">Eğitilebilir parametre</div><div class="card-body">Doğrusal katman başına <code>2 * d * r</code>. Llama-7B Q,K,V,O üzerinde LoRA ile: ~16M eğitilebilir, 7B donmuş.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. NumPy ile Sıfırdan LoRA</h2>
<p class="l-text">LoRA-genişletilmiş bir doğrusal katmanı baştan sona inşa et. Küçük bir rank için <code>B @ A</code>'nın sentetik bir <code>delta W</code>'deki sinyalin çoğunu geri kazanabildiğini göstereceğiz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

d = <span class="num">256</span>
r_lora = <span class="num">8</span>
alpha = <span class="num">16</span>

<span class="cm"># Donmuş base ağırlık + geri kazanmaya çalışacağımız "gerçek" düşük-rank perturbasyon</span>
W0 = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.02</span>
true_A = rng.<span class="fn">standard_normal</span>((r_lora, d)) * <span class="num">0.1</span>
true_B = rng.<span class="fn">standard_normal</span>((d, r_lora)) * <span class="num">0.1</span>
true_delta = true_B @ true_A
W_full = W0 + true_delta             <span class="cm"># tam FT'nin yakınsayacağı şey</span>

<span class="cm"># LoRA tarzı eğitilebilir parametreler</span>
A = rng.<span class="fn">standard_normal</span>((r_lora, d)) * <span class="num">0.01</span>     <span class="cm"># gauss başlatma</span>
B = np.<span class="fn">zeros</span>((d, r_lora))                       <span class="cm"># sıfır başlatma -> W0'dan başlar</span>

<span class="kw">def</span> <span class="fn">lora_forward</span>(x):
    <span class="kw">return</span> x @ W0.T + (alpha/r_lora) * (x @ A.T) @ B.T

<span class="kw">def</span> <span class="fn">full_forward</span>(x):
    <span class="kw">return</span> x @ W_full.T

<span class="cm"># A, B'yi LoRA ve tam ileri arasındaki MSE üzerinde gradyan inişi ile eğit</span>
N = <span class="num">1000</span>
X = rng.<span class="fn">standard_normal</span>((N, d))
Y = <span class="fn">full_forward</span>(X)
lr = <span class="num">0.05</span>

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2000</span>):
    pred = <span class="fn">lora_forward</span>(X)
    err  = pred - Y
    loss = (err**<span class="num">2</span>).<span class="fn">mean</span>()

    <span class="cm"># gradyanlar (BA çarpımı boyunca zincir kuralı)</span>
    scale = alpha / r_lora
    grad_pred = <span class="num">2</span> * err / (N * d)
    <span class="cm"># d/dB:  err -> batch üzerinde err^T @ (x A^T) toplamı ... düz formda:</span>
    XAt = X @ A.T                      <span class="cm"># (N, r)</span>
    grad_B = scale * (err.T @ XAt)
    BX = (X @ A.T) @ B.T               <span class="cm"># doğrudan kullanılmıyor; aşağıda zincir kullanılır</span>
    grad_A = scale * (B.T @ err.T @ X)

    A -= lr * grad_A
    B -= lr * grad_B
    <span class="kw">if</span> step % <span class="num">400</span> == <span class="num">0</span>:
        cos = <span class="fn">float</span>((B @ A).<span class="fn">ravel</span>() @ true_delta.<span class="fn">ravel</span>() /
                    (np.linalg.<span class="fn">norm</span>(B @ A) * np.linalg.<span class="fn">norm</span>(true_delta) + <span class="num">1e-12</span>))
        <span class="fn">print</span>(f<span class="str">"adım {step:4d}  loss={loss:.6f}  delta-kosinüs-benz={cos:.4f}"</span>)

<span class="fn">print</span>(<span class="str">"\\nson delta-W gerçek ile kosinüs:"</span>,
      <span class="fn">round</span>(<span class="fn">float</span>((B @ A).<span class="fn">ravel</span>() @ true_delta.<span class="fn">ravel</span>() /
            (np.linalg.<span class="fn">norm</span>(B @ A) * np.linalg.<span class="fn">norm</span>(true_delta))), <span class="num">4</span>))
<span class="fn">print</span>(f<span class="str">"eğitilebilir param: {A.size + B.size}  vs tam FT: {d*d}  ({d*d/(A.size+B.size):.0f}x daha küçük)"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu NumPy LoRA deneyi matematiği nasıl kanıtlıyor:</strong> 1) Kurulum, donmuş bir taban <code>W0</code> ve <code>true_delta = true_B @ true_A</code>\'nın gerçekten düşük ranklı olduğu sentetik bir hedef <code>W_full = W0 + true_delta</code> oluşturur. 2) <code>A</code> Gaussian başlatılır ve <code>B</code> sıfırdan başlar; böylece <code>lora_forward(x) = x @ W0.T + (alpha/r) * (x @ A.T) @ B.T</code> 0. adımda tam olarak donmuş taban gibi davranır — calc-highlight\'ın bahsettiği güvenlik özelliği. 3) 2000 adımlı döngü <code>lora_forward(X)</code> ile <code>full_forward(X)</code> arasındaki MSE\'yi hesaplar, ardından yalnızca <code>A</code> ve <code>B</code>\'yi manuel türetilmiş zincir kuralı gradyanlarıyla günceller. 4) Periyodik çıktılar <code>B @ A</code> ile <code>true_delta</code> arasındaki kosinüs benzerliğini izler ve son bir oranla biter: eğitilebilir parametre <code>2 * r * d = 4096</code> vs tam ince ayar <code>d*d = 65536</code> — 16× azalma.</p>


<div class="calc-highlight"><code>B</code>'nin sıfırdan başladığına dikkat et; bu nedenle 0. adımda <code>delta_W = 0</code> olur ve LoRA-genişletilmiş model donmuş base ile birebir davranır. Adapter'ları takmanın 1. adımda felaketsel unutma riski olmadan güvenli olmasının nedeni budur.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. PEFT Kütüphanesi API'si</h2>
<p class="l-text">Pratikte LoRA'yı elle uygulamazsın — HuggingFace'in <code>peft</code> kütüphanesi bunu üç satırda halleder. API; Q, K, V, O, MLP veya hepsini hedeflesen de aynıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — peft + transformers)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForCausalLM, AutoTokenizer
<span class="kw">from</span> peft <span class="kw">import</span> LoraConfig, get_peft_model, TaskType

base = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(
    <span class="str">"meta-llama/Llama-2-7b-hf"</span>,
    torch_dtype=<span class="str">"bfloat16"</span>,
    device_map=<span class="str">"auto"</span>,
)

lora_config = <span class="fn">LoraConfig</span>(
    task_type=TaskType.CAUSAL_LM,
    r=<span class="num">16</span>,                        <span class="cm"># rank</span>
    lora_alpha=<span class="num">32</span>,               <span class="cm"># ölçek -> alpha/r = 2</span>
    lora_dropout=<span class="num">0.05</span>,
    target_modules=[<span class="str">"q_proj"</span>, <span class="str">"k_proj"</span>, <span class="str">"v_proj"</span>, <span class="str">"o_proj"</span>],
    bias=<span class="str">"none"</span>,
)

model = <span class="fn">get_peft_model</span>(base, lora_config)
model.<span class="fn">print_trainable_parameters</span>()
<span class="cm"># trainable params: 16,777,216 || all params: 6,755,192,832 || trainable%: 0.2484</span>

<span class="cm"># Trainer ile her zamanki gibi eğit; yalnızca LoRA ağırlıkları hareket eder.</span>
<span class="cm"># Sadece adapter'ı kaydet (birkaç MB):</span>
model.<span class="fn">save_pretrained</span>(<span class="str">"./llama-lora-adapter"</span>)
</code></pre></div>

<p class="l-text">Eğitilebilir yüzde başlık rakamıdır: tipik 7B + r=16 kurulumu için <strong>%0.25</strong>. PEFT'in var olma sebebi ve 2026'daki her makul instruction-tuning tarifinin neden tam FT yerine LoRA ile başladığının nedeni budur.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. QLoRA — Quantize Edilmiş Base + LoRA Güncelleme</h2>
<p class="l-text">LoRA seni tam ağırlık tensörünü eğitmekten kurtarır — ama yine de ileri geçiş için onu GPU'da <em>tutmak</em> zorundasın. QLoRA (Dettmers vd. 2023) bir sonraki adımı atar: <strong>donmuş base'i 4-bit'e quantize et</strong>, LoRA adapter'ı 16-bit'te tut, normal eğit. 4-bit base baskın terimde 4x VRAM tasarrufu sağlar ve doğruluk neredeyse aynı kalır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">NF4 quantization</div><div class="card-body">"NormalFloat 4-bit" — tipik Gauss şekilli ağırlık dağılımına uydurulan 16 seviyeli doğrusal olmayan quantization. Eşit aralıklı INT4'ü yener.</div></div>
<div class="calc-card"><div class="card-title">Double quantization</div><div class="card-body">Blok-başı ölçek faktörlerinin kendisi de quantize edilir. Parametre başına ~0.4 bit kazandırır — 7B parametrede toplam etkilidir.</div></div>
<div class="calc-card"><div class="card-title">Paged optimizer'lar</div><div class="card-body">Optimizer durumları CPU belleğinde yaşar ve NVIDIA Unified Memory üzerinden sayfa-içeri/dışarı alınır. Anlık OOM tepelerine dayanır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — bitsandbytes + peft)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForCausalLM, BitsAndBytesConfig
<span class="kw">from</span> peft <span class="kw">import</span> prepare_model_for_kbit_training, LoraConfig, get_peft_model

bnb_config = <span class="fn">BitsAndBytesConfig</span>(
    load_in_4bit=<span class="kw">True</span>,
    bnb_4bit_quant_type=<span class="str">"nf4"</span>,          <span class="cm"># NormalFloat-4</span>
    bnb_4bit_use_double_quant=<span class="kw">True</span>,     <span class="cm"># ölçek faktörlerini de quantize et</span>
    bnb_4bit_compute_dtype=<span class="str">"bfloat16"</span>,  <span class="cm"># matmul için bf16'ya de-quantize</span>
)

model = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(
    <span class="str">"meta-llama/Llama-2-70b-hf"</span>,
    quantization_config=bnb_config,
    device_map=<span class="str">"auto"</span>,
)
model = <span class="fn">prepare_model_for_kbit_training</span>(model)   <span class="cm"># norm/embed'leri fp32'ye cast eder</span>

lora = <span class="fn">LoraConfig</span>(r=<span class="num">16</span>, lora_alpha=<span class="num">32</span>,
                  target_modules=[<span class="str">"q_proj"</span>,<span class="str">"k_proj"</span>,<span class="str">"v_proj"</span>,<span class="str">"o_proj"</span>],
                  bias=<span class="str">"none"</span>, task_type=<span class="str">"CAUSAL_LM"</span>)
model = <span class="fn">get_peft_model</span>(model, lora)
model.<span class="fn">print_trainable_parameters</span>()
<span class="cm"># Llama-70B QLoRA ile tek 48GB A6000'de sığar -- bu olmadan imkansız.</span>
</code></pre></div>

<p class="l-text"><strong>QLoRA yapılandırması bitsandbytes + PEFT\'i nasıl birleştiriyor:</strong> 1) <code>BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_use_double_quant=True, bnb_4bit_compute_dtype="bfloat16")</code> 4-bit saklama formatını (NormalFloat-4) bildirir, blok başına ölçeklerin çift quantization\'ını etkinleştirir ve bitsandbytes\'a gerçek matmul için bf16\'ya de-quantize etmesini söyler. 2) <code>AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-70b-hf", quantization_config=bnb_config, device_map="auto")</code> her donmuş ağırlık tensörü 4 bitte saklanmış olarak 70B Llama\'yı yükler. 3) <code>prepare_model_for_kbit_training(model)</code> layer normları ve gömmeleri fp32\'ye geri döker ve tabanı dondurur — kararlı karma hassasiyetli eğitim için zorunludur. 4) <code>LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj","k_proj","v_proj","o_proj"], bias="none", task_type="CAUSAL_LM")</code> + <code>get_peft_model(model, lora)</code> 16-bit LoRA adapterlerini üstüne ekler; bu sayede 70B model tek bir 48 GB A6000\'de eğitilebilir.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bir ağırlık matrisinin INT8 quantization'ını simüle et ve tür-dönüş hatasını ölç. NF4 ile aynı sezgi — bir ölçek seç, tam sayıya yuvarla, dequantize et.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Bunu bir transformer ağırlık matrisi varsay</span>
W = rng.<span class="fn">standard_normal</span>((<span class="num">1024</span>, <span class="num">1024</span>)).<span class="fn">astype</span>(np.float32) * <span class="num">0.02</span>
<span class="fn">print</span>(<span class="str">"W byte (fp32):"</span>, W.nbytes)

<span class="kw">def</span> <span class="fn">quant_int8_blockwise</span>(W, block=<span class="num">64</span>):
    <span class="str">"""Blok-başı simetrik INT8 quantization (bitsandbytes tarifinin sadeleşmiş hâli)."""</span>
    out_q = np.<span class="fn">zeros</span>(W.shape, dtype=np.int8)
    scales = np.<span class="fn">zeros</span>((W.shape[<span class="num">0</span>] // block, W.shape[<span class="num">1</span>] // block), dtype=np.float32)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, W.shape[<span class="num">0</span>], block):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, W.shape[<span class="num">1</span>], block):
            blk = W[i:i+block, j:j+block]
            s = np.<span class="fn">abs</span>(blk).<span class="fn">max</span>() / <span class="num">127</span> + <span class="num">1e-12</span>
            out_q[i:i+block, j:j+block] = np.<span class="fn">round</span>(blk / s).<span class="fn">clip</span>(-<span class="num">127</span>, <span class="num">127</span>).<span class="fn">astype</span>(np.int8)
            scales[i//block, j//block] = s
    <span class="kw">return</span> out_q, scales

<span class="kw">def</span> <span class="fn">dequant</span>(Q, scales, block=<span class="num">64</span>):
    out = np.<span class="fn">zeros</span>(Q.shape, dtype=np.float32)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, Q.shape[<span class="num">0</span>], block):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, Q.shape[<span class="num">1</span>], block):
            out[i:i+block, j:j+block] = Q[i:i+block, j:j+block] * scales[i//block, j//block]
    <span class="kw">return</span> out

Q, S = <span class="fn">quant_int8_blockwise</span>(W)
W_back = <span class="fn">dequant</span>(Q, S)

err = np.linalg.<span class="fn">norm</span>(W - W_back) / np.linalg.<span class="fn">norm</span>(W)
<span class="fn">print</span>(f<span class="str">"INT8 tur-dönüş göreli hata: {err:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"depolama:  fp32 = {W.nbytes/1024:.1f} KB,  int8+ölçekler = {(Q.nbytes + S.nbytes)/1024:.1f} KB"</span>)

<span class="cm"># Bir batch üzerinde ileri geçiş hatası</span>
x = rng.<span class="fn">standard_normal</span>((<span class="num">32</span>, <span class="num">1024</span>)).<span class="fn">astype</span>(np.float32)
y_orig = x @ W.T
y_q    = x @ W_back.T
<span class="fn">print</span>(<span class="str">"çıktı kosinüs benz:"</span>,
      <span class="fn">round</span>(<span class="fn">float</span>((y_orig.<span class="fn">ravel</span>() @ y_q.<span class="fn">ravel</span>()) /
                  (np.linalg.<span class="fn">norm</span>(y_orig)*np.linalg.<span class="fn">norm</span>(y_q))), <span class="num">6</span>))
</code></pre></div>
</div>

<p class="l-text"><strong>INT8 quantization demo\'su bitsandbytes\'ın yaptığını nasıl yansıtıyor:</strong> 1) <code>W = rng.standard_normal((1024, 1024)).astype(np.float32) * 0.02</code> gerçekçi transformer ölçeğinde bir ağırlık matrisi oluşturur ve fp32 bayt sayısını yazdırır. 2) <code>quant_int8_blockwise(W, block=64)</code> matrisi 64×64 fayanslarla gezer, blok başına bir ölçek <code>s = abs(blk).max() / 127</code> seçer ve INT8\'e yuvarlayıp clipler — bnb\'nin LLM.int8() yükleyicisinin tam tarifi. 3) <code>dequant(Q, scales, block=64)</code> her fayansı ölçeğiyle çarparak fp32 görünümünü yeniden inşa eder. 4) İki çıktı yuvarlama göreceli hatasını ve depolama tasarrufunu raporlar (fp32 → int8 + scales, ~4× azalma); <code>x @ W.T</code> ile <code>x @ W_back.T</code> arasındaki son kosinüs benzerliği, kayıplı yuvarlamaya rağmen aşağı akış ileri çıktılarının görsel olarak özdeş olduğunu gösterir.</p>


</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. LoRA'nın Ötesindeki PEFT Ailesi</h2>
<p class="l-text">LoRA hakim ama tek seçenek değil. Bilmen gereken üç varyant var — her birinin kazandığı bir niş alan var.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adapter (Houlsby 2019)</div><div class="card-body">Her transformer bloğundan sonra küçük bir bottleneck MLP ekle: <code>down -&gt; doğrusal olmayan -&gt; up</code>, residual ile. Multi-task kurulumlar için harika; LoRA'dan biraz daha çok çıkarım yükü.</div></div>
<div class="calc-card"><div class="card-title">Prefix-tuning</div><div class="card-body">Her attention katmanının K ve V'sine öğrenilmiş sanal token'lar ekler. Model bunları bağlam olarak "görür". Üretim görevleri için güçlü; sınıflandırma için zayıf.</div></div>
<div class="calc-card"><div class="card-title">IA3 (Liu 2022)</div><div class="card-body">K, V ve FFN ara katmanı üzerinde çarpımsal ölçek vektörleri. Düşük-veri rejimlerinde benzer doğrulukta LoRA'dan ~10x daha az eğitilebilir parametre.</div></div>
<div class="calc-card"><div class="card-title">DoRA / VeRA</div><div class="card-body">2024 evrimleri. DoRA büyüklük ve yönü ayrıştırır; VeRA katmanlar arasında rastgele A,B paylaşır ve sadece katman-başı ölçeği eğitir. 2025-26'da en iyi seviye.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — peft varyantları)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> peft <span class="kw">import</span> (
    LoraConfig, AdaLoraConfig, IA3Config, PrefixTuningConfig, get_peft_model
)

<span class="cm"># Her biri base modeli farklı şekilde sarar</span>
configs = {
    <span class="str">"lora"</span>:     <span class="fn">LoraConfig</span>(r=<span class="num">16</span>, lora_alpha=<span class="num">32</span>, target_modules=[<span class="str">"q_proj"</span>,<span class="str">"v_proj"</span>]),
    <span class="str">"adalora"</span>:  <span class="fn">AdaLoraConfig</span>(init_r=<span class="num">12</span>, target_r=<span class="num">8</span>, target_modules=[<span class="str">"q_proj"</span>,<span class="str">"v_proj"</span>]),
    <span class="str">"ia3"</span>:      <span class="fn">IA3Config</span>(target_modules=[<span class="str">"k_proj"</span>,<span class="str">"v_proj"</span>,<span class="str">"down_proj"</span>],
                          feedforward_modules=[<span class="str">"down_proj"</span>]),
    <span class="str">"prefix"</span>:   <span class="fn">PrefixTuningConfig</span>(num_virtual_tokens=<span class="num">20</span>),
}

<span class="cm"># Hepsi için aynı get_peft_model()</span>
<span class="cm"># model = get_peft_model(base_model, configs["ia3"])</span>
<span class="cm"># model.print_trainable_parameters()</span>
</code></pre></div>
</div>

<p class="l-text"><strong>PEFT API\'si dört farklı adapter ailesini nasıl birleştiriyor:</strong> 1) <code>LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj","v_proj"])</code> attention Q/V projeksiyonlarında klasik LoRA\'yı bildirir. 2) <code>AdaLoraConfig(init_r=12, target_r=8, target_modules=[...])</code> eğitim sırasında <code>target_r</code>\'ye kırpılan daha yüksek bir rank ile başlar — uyarlanabilir rank. 3) <code>IA3Config(target_modules=["k_proj","v_proj","down_proj"], feedforward_modules=["down_proj"])</code> küçük çarpımsal ölçekleme vektörleri eğitir — düşük veri rejimlerinde LoRA\'dan ~10× daha az parametre. 4) <code>PrefixTuningConfig(num_virtual_tokens=20)</code> her attention katmanının K ve V\'sine 20 öğrenilebilir sanal token ekler. Yorum satırındaki çağrı birleşik deseni gösterir: <code>model = get_peft_model(base_model, configs["ia3"])</code> — bir satır değiştirerek adapter ailesini değiştirirsin.</p>


<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Çıkarım için Adapter'ları Birleştirme</h2>
<p class="l-text">Eğitim sırasında LoRA adapter base'in yanında durur. Çıkarımda genellikle sıfır yük istersin — katman başına ekstra matris çarpımı yok. Çözüm: <code>model.merge_and_unload()</code>, <code>(alpha/r) * B @ A</code>'yı <code>W_0</code>'a katlar; LoRA-genişletilmiş model ile birebir aynı performans gösteren ama ekstra işlem içermeyen tek bir yoğun matris üretir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — peft merge)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> peft <span class="kw">import</span> PeftModel
<span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForCausalLM, AutoTokenizer

<span class="cm"># Base + adapter yükle</span>
base = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">"meta-llama/Llama-2-7b-hf"</span>, torch_dtype=<span class="str">"bfloat16"</span>)
model = PeftModel.<span class="fn">from_pretrained</span>(base, <span class="str">"./llama-lora-adapter"</span>)

<span class="cm"># Adapter'ı base ağırlıklarına kaynat</span>
merged = model.<span class="fn">merge_and_unload</span>()

<span class="cm"># Normal HF modeli olarak kaydet -- çıkarım için PEFT bağımlılığı yok</span>
merged.<span class="fn">save_pretrained</span>(<span class="str">"./llama-merged"</span>)

<span class="cm"># Şimdi peft hiç kurulu olmadan yükle</span>
plain = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(<span class="str">"./llama-merged"</span>, torch_dtype=<span class="str">"bfloat16"</span>)
<span class="cm"># Çıkarım base+adapter ile bit-aynı, ama ~%5-15 daha hızlı.</span>
</code></pre></div>

<p class="l-text"><strong>Adapter birleştirme çıkarım yükünü nasıl ortadan kaldırıyor:</strong> 1) <code>AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b-hf", torch_dtype="bfloat16")</code> + <code>PeftModel.from_pretrained(base, "./llama-lora-adapter")</code> eğitilmiş modeli taban + LoRA adapter çifti olarak yeniden inşa eder. 2) <code>model.merge_and_unload()</code> <code>(alpha/r) * B @ A</code>\'yı <code>W_0</code>\'a geri katlar; her katman için ekstra işlem olmadan düz bir yoğun matris üretir. 3) <code>merged.save_pretrained("./llama-merged")</code> birleştirilmiş ağırlıkları standart bir HF checkpoint olarak diske yazar. 4) <code>AutoModelForCausalLM.from_pretrained("./llama-merged", torch_dtype="bfloat16")</code> ardından modeli <code>peft</code> kurulu olmadan yükleyebilir — çıkarım taban + adapter ile bit-özdeştir ama ekstra matmul atıldığı için ~%5-15 daha hızlıdır.</p>


<div class="calc-highlight">Uyarı: birleştirme yalnızca fp16/bf16'da doğrudur. Base'in 4-bit'teyse (QLoRA), doğrudan birleştiremezsin — önce dequantize et veya adapter'ı çıkarım sırasında üstte tut.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Multi-LoRA Yönlendirme</h2>
<p class="l-text">Adapter'lar küçüktür (7B model üzerinde r=16 için ~50 MB). Bu güzel bir üretim desenini mümkün kılar: <strong>VRAM'de tek base model, diskte düzinelerce adapter, istek başına takas</strong>. vLLM, TGI ve LoRAX 2026'da bunu yerel olarak destekler.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Yönlendirme sistemini simüle et: tek donmuş base, üç görev adapter'ı</span>
d, r = <span class="num">128</span>, <span class="num">4</span>
W0 = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.02</span>
adapters = {
    <span class="str">"code"</span>:     {<span class="str">"A"</span>: rng.<span class="fn">standard_normal</span>((r, d))*<span class="num">0.05</span>, <span class="str">"B"</span>: rng.<span class="fn">standard_normal</span>((d, r))*<span class="num">0.05</span>},
    <span class="str">"medical"</span>:  {<span class="str">"A"</span>: rng.<span class="fn">standard_normal</span>((r, d))*<span class="num">0.05</span>, <span class="str">"B"</span>: rng.<span class="fn">standard_normal</span>((d, r))*<span class="num">0.05</span>},
    <span class="str">"legal"</span>:    {<span class="str">"A"</span>: rng.<span class="fn">standard_normal</span>((r, d))*<span class="num">0.05</span>, <span class="str">"B"</span>: rng.<span class="fn">standard_normal</span>((d, r))*<span class="num">0.05</span>},
}

<span class="kw">def</span> <span class="fn">route</span>(x, task):
    a = adapters[task]
    delta_W = a[<span class="str">"B"</span>] @ a[<span class="str">"A"</span>]
    <span class="kw">return</span> x @ (W0 + delta_W).T

x = rng.<span class="fn">standard_normal</span>((<span class="num">1</span>, d))
<span class="kw">for</span> task <span class="kw">in</span> [<span class="str">"code"</span>, <span class="str">"medical"</span>, <span class="str">"legal"</span>]:
    out = <span class="fn">route</span>(x, task)
    <span class="fn">print</span>(f<span class="str">"{task:8s}: çıktı normu = {np.linalg.norm(out):.4f}"</span>)

<span class="cm"># Adapter boyutları base'e karşı</span>
<span class="kw">import</span> sys
adapter_bytes = <span class="fn">sum</span>(a[<span class="str">"A"</span>].nbytes + a[<span class="str">"B"</span>].nbytes <span class="kw">for</span> a <span class="kw">in</span> adapters.<span class="fn">values</span>())
<span class="fn">print</span>(f<span class="str">"\\nbase: {W0.nbytes:,} byte  |  3 adapter toplam: {adapter_bytes:,} byte "</span>
      f<span class="str">"({W0.nbytes / (adapter_bytes/3):.0f}x daha küçük adapter başına)"</span>)
</code></pre></div>

<p class="l-text">Üretimde ekonomi: 5 ayrı ince ayarlı 7B endpoint (35B parametre yerleşik) çalıştırmak yerine bir base + 5 adapter (~7.25B yerleşik) çalıştır. VRAM maliyeti 5x düşer, base'in KV cache'i paylaşıldığı için throughput artar.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. r, alpha ve Hedefleri Seçme</h2>
<p class="l-text">Üç düğme, alanın 2024-25 ablasyonlarıyla yakınsadığı üç pratik kural.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rank r</div><div class="card-body">Sohbet ince ayarı için r=8 ile başla, alan uyarlaması için r=16-32, zor görevler (kod, çok-adımlı akıl yürütme) için r=64+. r=64 sonrası getiriler azalır.</div></div>
<div class="calc-card"><div class="card-title">Alpha</div><div class="card-body">Varsayılan olarak <code>alpha = 2 * r</code> ayarla (böylece ölçek alpha/r = 2). Bazı tarifler alpha = r (ölçek = 1) kullanır. İkisi de çalışır; küçük bir alt küme üzerinde eğit ve eval ile seç.</div></div>
<div class="calc-card"><div class="card-title">Hedef modüller</div><div class="card-body">Q ve V en yüksek kaldıraçlı attention projeksiyonlarıdır. K ve O eklemek marjinal doğruluk için +%50 parametredir. MLP katmanları (<code>gate_proj</code>, <code>up_proj</code>, <code>down_proj</code>) bilgi-yoğun görevlerde yardımcı olur.</div></div>
<div class="calc-card"><div class="card-title">Dropout</div><div class="card-body">LoRA yolunda 0.05-0.1 standarttır. Çok yüksek kapasiteli adapter için regülarizasyon görevi görür.</div></div>
</div>

<p class="l-text">Toplamda: PEFT, ince ayarı "8xA100 küme ve bir hafta gerek" durumundan "öğle yemeğinde Colab notebook'unda çalışır" durumuna dönüştürdü. Bu kayma, 2026'nın açık-ağırlık ekosistemini uygulanabilir kılan şeydir — ve her "kendi modelini ince ayarla" eğitiminin neden <code>get_peft_model</code> ile başladığının nedenidir.</p>
</div>
`
};
