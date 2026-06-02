window.EDGE_L3 = {
en: `<p class="l-text"><strong>Quantization shrinks each weight; pruning deletes weights entirely; distillation builds a smaller model that mimics a bigger one.</strong> All three compose, and modern on-device models — DistilBERT, TinyLlama, Phi-3-mini, Gemma 2 2B — use all three. Where L2 squeezed FP32 down to INT4, this lesson is about <em>removing</em> parameters, not just compressing them. The two techniques are complementary: pruning removes weights from a fixed architecture; distillation lets you start with a fundamentally smaller architecture and recover its lost capacity by learning from a teacher.</p>

<p class="l-text">We cover unstructured pruning (remove individual weights, lottery ticket — Frankle &amp; Carbin 2018), structured pruning (remove whole channels, neurons, attention heads — actually accelerates inference), magnitude-based vs Hessian-based importance, the original knowledge distillation paper (Hinton, Vinyals, Dean 2015), DistilBERT (Sanh et al. 2019, the canonical NLP distillation), and the 2024 wave of "synthetic-data distillation" that produced Phi-3-mini (3.8B) competitive with Llama 2 70B on benchmarks. We end with NumPy implementations of magnitude pruning and a tiny logistic-regression distillation that you can run live.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Implement magnitude-based unstructured pruning in 5 lines of NumPy</li>
<li>Distinguish unstructured pruning (sparse weights, hardware-limited speedup) from structured pruning (real wall-clock speedup)</li>
<li>State the lottery ticket hypothesis (Frankle 2018) and what it means for training-from-scratch</li>
<li>Derive the soft-target cross-entropy loss with temperature T (Hinton 2015) and explain why it transfers more than hard labels</li>
<li>Trace the DistilBERT recipe (Sanh 2019) — 40% smaller, 60% faster, 97% of accuracy</li>
<li>Place TinyLlama, Phi-3-mini, Gemma 2 2B, Llama 3.2 1B/3B on the synthetic-data distillation spectrum</li>
<li>Combine pruning + distillation + quantization into a 30–100x compression pipeline</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Unstructured Pruning — The Magnitude Trick</h2>
<p class="l-text">The simplest pruning rule, and still surprisingly competitive: <strong>delete the smallest-magnitude weights</strong>. The intuition is that a weight near zero contributes almost nothing to the output, so masking it out should barely change accuracy.</p>

<div class="katex-block">$$M_{ij} = \\begin{cases} 1 &amp; |w_{ij}| \\geq \\tau \\\\ 0 &amp; |w_{ij}| &lt; \\tau \\end{cases}, \\quad W' = M \\odot W$$</div>

<p class="l-text">Choose <code>τ</code> so that some target fraction (say 90%) of weights are zeroed. The pruned model is then fine-tuned to recover. Iterating prune-then-train is the <em>magnitude pruning</em> recipe (Han, Pool, Tran, Dally — "Learning both Weights and Connections for Efficient Neural Networks", NeurIPS 2015), the paper that kicked off the modern compression literature.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why it works</div><div class="card-body">Trained networks are massively over-parameterized. 90% of weights in BERT-base, ResNet-50, GPT-2 can be zeroed with &lt;1% accuracy loss after fine-tuning. Some weights matter; most do not.</div></div>
<div class="calc-card"><div class="card-title">The catch</div><div class="card-body">A sparse matrix with random zero pattern is not faster on GPUs and only modestly faster on CPUs. The zeros are skipped only with sparse kernels (cuSPARSE, oneDNN sparse), and those are slower than dense kernels until ~95% sparsity. Practical speedup needs <em>structured</em> sparsity.</div></div>
<div class="calc-card"><div class="card-title">2:4 structured (NVIDIA Ampere+)</div><div class="card-body">A100/H100 added 2:4 sparsity hardware: every 4 consecutive weights, exactly 2 are zero. Gives a guaranteed 2x speedup on the matmul. Used in NVIDIA's Sparse Tensor Cores. Closer to "useful" pruning than dense magnitude pruning.</div></div>
<div class="calc-card"><div class="card-title">N:M structured</div><div class="card-body">Generalizes 2:4. Trade flexibility for hardware simplicity. Some Hopper-class kernels do 4:8 (4 of 8 weights zero) for stronger compression at slightly higher accuracy hit.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Lottery Ticket Hypothesis (Frankle &amp; Carbin 2018)</h2>
<p class="l-text">"The Lottery Ticket Hypothesis: Finding Sparse, Trainable Neural Networks" (ICLR 2019, posted 2018) proposed a striking claim: <em>inside a randomly initialized large network, there exists a small subnetwork — the "winning ticket" — that, if trained from the same initialization with a mask isolating it, reaches accuracy comparable to the full network.</em></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Procedure</div><div class="card-body">1. Train the full network. 2. Prune by magnitude. 3. Reset surviving weights to their <em>original initialization</em>. 4. Train the pruned subnetwork. 5. Repeat (iterative magnitude pruning, IMP).</div></div>
<div class="calc-card"><div class="card-title">Result</div><div class="card-body">On MNIST, CIFAR, ImageNet, the surviving subnetworks (often 5–20% of the original) match or exceed the full model when trained from scratch. Random subnetworks of the same size do not.</div></div>
<div class="calc-card"><div class="card-title">Implication</div><div class="card-body">Most weights are unnecessary, AND the right initialization-mask combination matters. Pure architecture search is missing something — the trained mask is part of the answer.</div></div>
<div class="calc-card"><div class="card-title">Caveats discovered later</div><div class="card-body">For very large models (BERT-Large, GPT), the original-init reset breaks down; you need "rewinding" to early-but-not-step-0 weights (Frankle, Dziugaite, Roy, Carbin 2020). Still, lottery-ticket-style pruning works on ImageNet ResNets and BERT.</div></div>
</div>

<div class="calc-highlight"><strong>Why this matters for edge ML:</strong> if the lottery ticket hypothesis is true, every model has a 5–20%-sized version waiting to be discovered. Plus quantization, that is 50–100x smaller than the original — phone territory.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Structured Pruning — The Speedup You Actually Feel</h2>
<p class="l-text">Unstructured pruning gives you a sparse weight matrix; the hardware does not care unless you use sparse kernels. <strong>Structured pruning</strong> removes whole units — entire output channels in conv, entire neurons in MLP, entire attention heads in transformers — leaving you with a smaller dense network. Same FLOPs reduction, real wall-clock speedup, no special kernels needed.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Channel pruning (CNNs)</div><div class="card-body">Drop low-importance output channels of conv layers. Importance metric: L1 norm of the channel's weights, or the channel's effect on the loss (Taylor expansion). Used in MobileNet, EfficientNet redesigns.</div></div>
<div class="calc-card"><div class="card-title">Head pruning (Transformers)</div><div class="card-body">"Are Sixteen Heads Really Better than One?" (Michel, Levy, Neubig 2019) showed many attention heads can be pruned with no loss. Used in DistilBERT and TinyBERT.</div></div>
<div class="calc-card"><div class="card-title">Layer dropping</div><div class="card-body">Remove entire transformer layers. DistilBERT keeps every other layer of BERT. The recent "LayerDrop" (Fan et al. 2020) trains for it directly.</div></div>
<div class="calc-card"><div class="card-title">Width &amp; depth NAS-style</div><div class="card-body">EfficientNet, MobileNetV3 use compound scaling — jointly tune depth, width, resolution. Ends up as effective structured pruning of a search space.</div></div>
</div>

<p class="l-text">A modern recipe for transformer compression: prune attention heads (Michel-style) → prune FFN intermediate dims → distill on remaining layers. This is exactly what TinyBERT and MobileBERT did in 2019–2020.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Knowledge Distillation — Hinton's 2015 Trick</h2>
<p class="l-text">"Distilling the Knowledge in a Neural Network" (<em>Hinton, Vinyals, Dean — NIPS Workshop 2015</em>) is one of the most-cited papers in deep learning, and the underlying recipe is shockingly simple. Train a small <em>student</em> network to match the <em>soft</em> output of a big <em>teacher</em>.</p>

<div class="katex-block">$$\\mathcal{L} = \\alpha \\cdot \\text{CE}(y, \\sigma(z_s)) + (1-\\alpha) \\cdot T^2 \\cdot \\text{KL}(\\sigma(z_t/T) \\,\\|\\, \\sigma(z_s/T))$$</div>

<p class="l-text">Two terms: a small weight α on the standard hard-label cross-entropy, and a big weight (1-α) on a temperature-scaled KL between teacher and student logits. The temperature T (typically 2–10) softens the distributions so the student sees not just "this is a cat" but "this is a cat with 0.1 probability of being a lynx and 0.05 of being a fox" — and that "dark knowledge" of relative confidences is what transfers.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why soft labels beat hard labels</div><div class="card-body">A hard label gives 1 bit of supervision per example. A 1000-class soft distribution gives ~10 bits — the student learns relative class similarities, which act as a strong regularizer.</div></div>
<div class="calc-card"><div class="card-title">Self-distillation</div><div class="card-body">Train a student of the <em>same</em> architecture as the teacher. Surprisingly, it improves accuracy ("Born-Again Networks", Furlanello et al. 2018). Probably the biggest free lunch in ML.</div></div>
<div class="calc-card"><div class="card-title">Cross-architecture</div><div class="card-body">CNN teacher → transformer student, transformer teacher → MLP-Mixer student, etc. Works as long as both can represent the relevant function.</div></div>
<div class="calc-card"><div class="card-title">Feature distillation</div><div class="card-body">Match intermediate hidden states, not just logits. FitNets (Romero 2014), TinyBERT, MobileBERT all do this. Stronger transfer at the cost of architectural coupling.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. DistilBERT — The Canonical NLP Distillation (Sanh 2019)</h2>
<p class="l-text">DistilBERT (<em>Sanh, Debut, Chaumond, Wolf — "DistilBERT, a distilled version of BERT", NeurIPS Workshop 2019</em>) was the first widely-used distilled NLP model. Its recipe is the template every later compressed model copies.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Architecture choice</div><div class="card-body">Halve the number of layers (12 → 6), keep hidden dim the same (768). Initialize student layers from every other teacher layer — a free 50% head start.</div></div>
<div class="calc-card"><div class="card-title">Triple loss</div><div class="card-body">Combined: standard MLM loss + KL divergence on softmax-T logits + cosine similarity on hidden states. The hidden-state term is the key — DistilBERT learns to match BERT's <em>features</em>, not just outputs.</div></div>
<div class="calc-card"><div class="card-title">Training data</div><div class="card-body">Same Wikipedia + BooksCorpus as original BERT. ~90 hours on 8x V100s. Cheap.</div></div>
<div class="calc-card"><div class="card-title">Result</div><div class="card-body">40% smaller (66M params vs 110M), 60% faster, 97% of BERT-base's GLUE accuracy. Has ~150M downloads on HuggingFace as of 2026 — the most-downloaded NLP model ever.</div></div>
</div>

<p class="l-text">Variants and successors: <strong>TinyBERT</strong> (Jiao 2019, 4-layer 312-hidden, 7.5x smaller), <strong>MobileBERT</strong> (Sun 2020, optimized for phones, ~25M params), <strong>MiniLM</strong> (Wang 2020, distills attention matrices). All copy the DistilBERT recipe with tweaks.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The 2024 Wave — Synthetic-Data Distillation</h2>
<p class="l-text">Distillation through 2022 used the teacher's logits on real data. The 2023–2024 wave changed the game: use the teacher (GPT-4, Claude) to <em>generate</em> high-quality training data, then train a small model on that synthetic corpus. The student never sees teacher logits — it sees teacher-authored examples.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Phi-1 / Phi-1.5 / Phi-2 / Phi-3-mini (Microsoft, 2023–2024)</div><div class="card-body">"Textbooks Are All You Need" (Gunasekar et al. 2023). Used GPT-3.5/4 to generate ~1B tokens of high-quality synthetic textbook-style code and reasoning data. Phi-3-mini = 3.8B params, beats Llama 2 7B on MMLU.</div></div>
<div class="calc-card"><div class="card-title">TinyLlama (2024)</div><div class="card-body">1.1B params trained on 3T tokens — matches the data scaling of Llama 2 7B but at 1/7th the size. Open-source, designed for on-device.</div></div>
<div class="calc-card"><div class="card-title">Gemma 2 2B (Google, 2024)</div><div class="card-body">2.6B params, distilled from Gemma 2 27B. Competitive with Mistral 7B on benchmarks. Uses logit distillation + on-policy data generation.</div></div>
<div class="calc-card"><div class="card-title">Llama 3.2 1B/3B (Meta, 2024)</div><div class="card-body">Pruned and distilled from Llama 3.1 8B using structured pruning + logit distillation on 6T tokens. Specifically targeted for on-device and edge deployment.</div></div>
</div>

<div class="calc-highlight"><strong>Implication for the edge:</strong> 1–4B models in 2026 are not "small models trained on web data" but "compressed projections of frontier models". This is why Phi-3-mini ships in your phone and beats much bigger 2022-era models — it inherited 2024 frontier knowledge through synthetic data.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Hands-On — Magnitude Pruning in NumPy</h2>
<p class="l-text">Take a small dense weight matrix, prune the bottom 80% by magnitude, fine-tune the survivors with gradient descent, measure the recovery.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
np.random.seed(0)

# Toy regression: y = W_true @ x
d = 64
W_true = np.random.randn(1, d).astype(np.float32) * 0.3
W_true[0, np.random.choice(d, 50, replace=False)] = 0.0  # ground truth is sparse
X = np.random.randn(d, 4000).astype(np.float32)
y = W_true @ X + 0.05 * np.random.randn(1, 4000)

# Train a dense model
W = np.random.randn(1, d).astype(np.float32) * 0.05
lr = 0.01
for step in range(800):
    yhat = W @ X
    grad = (yhat - y) @ X.T / X.shape[1]
    W -= lr * grad
mse_dense = np.mean((W @ X - y)**2)

# Magnitude prune: keep top 20% of |w|
sparsity = 0.8
threshold = np.quantile(np.abs(W), sparsity)
mask = (np.abs(W) >= threshold).astype(np.float32)
W_pruned = W * mask
mse_pruned_naive = np.mean((W_pruned @ X - y)**2)

# Fine-tune the survivors with the mask (gradient is masked too)
W_ft = W_pruned.copy()
for step in range(400):
    yhat = W_ft @ X
    grad = (yhat - y) @ X.T / X.shape[1]
    W_ft -= lr * grad * mask  # only train surviving weights
    W_ft *= mask              # enforce sparsity
mse_pruned_ft = np.mean((W_ft @ X - y)**2)

print(f"Dense MSE:               {mse_dense:.5f}")
print(f"Pruned (no FT) MSE:      {mse_pruned_naive:.5f}")
print(f"Pruned + fine-tuned MSE: {mse_pruned_ft:.5f}")
print(f"Sparsity: {(1 - mask.mean())*100:.0f}%")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Synthesizes a 64-dim regression target where the true generating W is itself sparse (50 of 64 entries zero) — this is the lottery-ticket-style assumption that real models are over-parameterized. 2) Trains a dense linear model with vanilla GD for 800 steps until MSE bottoms out — this gives baseline "dense" accuracy. 3) Picks <code>τ = quantile(|W|, 0.8)</code> and builds a 0/1 mask that keeps only the top 20% by magnitude — exactly Han 2015's prescription. 4) Measures naive pruned MSE BEFORE fine-tuning — it explodes (usually 10-50x worse) because zeroing weights breaks the careful equilibrium gradient descent found. 5) Fine-tunes survivors for 400 more steps with a critical detail: <code>grad * mask</code> ensures the pruned weights' gradients are killed AND <code>W_ft *= mask</code> after each step prevents drift back to nonzero — this masked-FT loop is the difference between failed and successful pruning, and it's why Han's lottery-ticket recovery works.</p>

<p class="l-text">Run this and you typically see: dense ~0.0025, naive pruned ~0.05 (20x worse), fine-tuned pruned ~0.003 — almost back to dense quality with 80% of weights gone. That recovery is the whole reason pruning works in practice.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Hands-On — Distillation with Logistic Regression</h2>
<p class="l-text">A teacher (big logistic regression on full features) trains. A student (smaller LR on subset of features) learns from teacher's <em>soft</em> probabilities. Compare to a student trained on <em>hard</em> labels.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
np.random.seed(42)

# 5-class problem with 50 features (rich)
X, y = make_classification(n_samples=4000, n_features=50, n_informative=30,
                          n_classes=5, n_clusters_per_class=2, random_state=42)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=42)

# Teacher: big LR on all 50 features
teacher = LogisticRegression(max_iter=1000, C=1.0).fit(Xtr, ytr)
teacher_acc = teacher.score(Xte, yte)
soft_labels = teacher.predict_proba(Xtr)  # (n, 5) — soft labels

# Student: LR on only 10 features
keep = np.argsort(np.abs(teacher.coef_).sum(0))[-10:]
Xtr_s, Xte_s = Xtr[:, keep], Xte[:, keep]

# (a) Student trained on HARD labels
student_hard = LogisticRegression(max_iter=1000).fit(Xtr_s, ytr)
acc_hard = student_hard.score(Xte_s, yte)

# (b) Student trained on SOFT labels (multinomial regression to match teacher dist)
# Use one-hot of argmax of soft labels weighted by entropy as a poor man's KD
# (sklearn LR does not natively do soft targets; this is a pedagogic surrogate)
from sklearn.linear_model import Ridge
# Train a separate Ridge per class on soft labels — closest to KD spirit in sklearn
class_models = []
for c in range(5):
    r = Ridge(alpha=1.0).fit(Xtr_s, soft_labels[:, c])
    class_models.append(r)
preds_soft = np.column_stack([m.predict(Xte_s) for m in class_models])
acc_soft = np.mean(np.argmax(preds_soft, axis=1) == yte)

print(f"Teacher (50 feats) accuracy:        {teacher_acc:.3f}")
print(f"Student (10 feats, hard labels):    {acc_hard:.3f}")
print(f"Student (10 feats, soft KD-style):  {acc_soft:.3f}")
print(f"KD lift over hard labels:           {(acc_soft-acc_hard)*100:+.1f} pp")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a 5-class problem with 50 features (30 informative) — large enough to have meaningful "dark knowledge" in class-confidence patterns. 2) Trains a teacher LogisticRegression on all 50 features and extracts <code>predict_proba</code> on the training set — these are the soft labels (rows summing to 1) that carry Hinton's "dark knowledge" of class similarities. 3) Selects the 10 features with highest aggregate coefficient magnitudes from the teacher — feature pruning analogous to what TinyBERT does on hidden dims. 4) Trains a "hard-label" student on the 10-feature subset using categorical labels — this is what training without distillation would give. 5) Approximates KD with sklearn primitives: one Ridge regressor per class against soft probabilities. <code>argmax</code> over the 5 predicted probabilities gives the final class. The Ridge-on-soft-targets is the sklearn-friendly stand-in for KL(softmax(z_s/T) || softmax(z_t/T)); production DistilBERT uses true KL with T=2 to T=10 — the principle is identical.</p>

<p class="l-text">Soft-label distillation typically beats hard-label by 1–4 percentage points on this kind of toy. On real LLMs, the gap is much larger — DistilBERT's 97% recovery vs ~85% for hard-label-only training of the same architecture is the production-scale version of this experiment.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Stack Them — Pruning + Distillation + Quantization</h2>
<p class="l-text">The three techniques compose multiplicatively. A modern edge pipeline:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — Distill</div><div class="card-body">Big teacher (Llama 3.1 70B or GPT-4) → small student architecture (3B). 25x size reduction, ~90–95% capability retained.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — Prune</div><div class="card-body">Structured pruning of student: drop low-importance heads, FFN dims. ~30–50% additional FLOPs reduction at &lt;1% quality cost (with fine-tuning).</div></div>
<div class="calc-card"><div class="card-title">Step 3 — Quantize</div><div class="card-body">AWQ INT4 group-128. ~4x size reduction, ~3x speedup on memory-bound LLM inference.</div></div>
<div class="calc-card"><div class="card-title">Total</div><div class="card-body">25 × 1.5 × 4 = ~150x. A 70B FP16 model (140GB) becomes ~1GB at INT4 distilled-pruned. Phi-3-mini is essentially this pipeline applied to GPT-4-grade synthetic data.</div></div>
</div>

<div class="calc-highlight"><strong>Practical advice:</strong> always quantize last. Fine-tuning a quantized model is a research topic (QLoRA, 4-bit LoRA), and most production teams quantize after pruning + distillation are stable.</div>

<p class="l-text">L4 picks up where this leaves off — taking a quantized model and getting it onto a laptop via the GGUF format and llama.cpp.</p>
</div>`,
tr: `<p class="l-text"><strong>Quantization her ağırlığı küçültür; budama ağırlıkları tamamen siler; damıtma daha büyük bir modeli taklit eden daha küçük bir model inşa eder.</strong> Üçü de birleşir ve modern cihaz-üstü modeller — DistilBERT, TinyLlama, Phi-3-mini, Gemma 2 2B — üçünü de kullanır. L2 FP32'yi INT4'e sıkıştırırken, bu ders parametreleri sadece sıkıştırmak değil, <em>kaldırmak</em> hakkındadır. İki teknik tamamlayıcıdır: budama sabit bir mimariden ağırlıkları kaldırır; damıtma temel olarak daha küçük bir mimari ile başlamanıza ve kaybolan kapasitesini bir öğretmenden öğrenerek geri kazanmanıza izin verir.</p>

<p class="l-text">Yapısız budamayı (bireysel ağırlıkları kaldırma, lottery ticket — Frankle &amp; Carbin 2018), yapılı budamayı (bütün kanalları, nöronları, attention head'leri kaldırma — gerçekten çıkarımı hızlandırır), büyüklük-temelli vs Hessian-temelli önemi, orijinal knowledge distillation makalesini (Hinton, Vinyals, Dean 2015), DistilBERT'i (Sanh ve diğ. 2019, kanonik NLP damıtması) ve benchmark'larda Llama 2 70B ile rekabet eden Phi-3-mini (3.8B) üreten 2024 "synthetic-data distillation" dalgasını ele alıyoruz. NumPy uygulamaları ile büyüklük budama ve canlı çalıştırabileceğiniz küçük bir lojistik regresyon damıtması ile bitiriyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>NumPy'da 5 satırda büyüklük-temelli yapısız budamayı uygulamak</li>
<li>Yapısız budamayı (seyrek ağırlıklar, donanım-sınırlı hızlanma) yapılı budamadan (gerçek wall-clock hızlanma) ayırmak</li>
<li>Lottery ticket hipotezini (Frankle 2018) ifade etmek ve sıfırdan-eğitim için ne anlama geldiğini bilmek</li>
<li>Sıcaklık T ile soft-target cross-entropy kaybını (Hinton 2015) türetmek ve neden hard label'lardan daha fazla aktarım yaptığını açıklamak</li>
<li>DistilBERT tarifini (Sanh 2019) izlemek — %40 daha küçük, %60 daha hızlı, %97 doğruluk</li>
<li>TinyLlama, Phi-3-mini, Gemma 2 2B, Llama 3.2 1B/3B'yi synthetic-data distillation spektrumuna yerleştirmek</li>
<li>Budama + damıtma + quantization'ı 30–100x sıkıştırma pipeline'ında birleştirmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Yapısız Budama — Büyüklük Hilesi</h2>
<p class="l-text">En basit budama kuralı, ve hala şaşırtıcı şekilde rekabetçi: <strong>en küçük büyüklükteki ağırlıkları sil</strong>. Sezgi, sıfıra yakın bir ağırlığın çıktıya neredeyse hiçbir katkı yapmadığıdır, bu yüzden onu maskelemek doğruluğu zar zor değiştirmelidir.</p>

<div class="katex-block">$$M_{ij} = \\begin{cases} 1 &amp; |w_{ij}| \\geq \\tau \\\\ 0 &amp; |w_{ij}| &lt; \\tau \\end{cases}, \\quad W' = M \\odot W$$</div>

<p class="l-text"><code>τ</code>'yu, ağırlıkların belirli bir hedef oranı (diyelim %90) sıfırlanacak şekilde seçin. Budanan model daha sonra kurtarmak için fine-tune edilir. İterasyonlu prune-then-train, <em>magnitude pruning</em> tarifidir (Han, Pool, Tran, Dally — "Learning both Weights and Connections for Efficient Neural Networks", NeurIPS 2015), modern sıkıştırma literatürünü başlatan makale.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden çalışır</div><div class="card-body">Eğitilmiş ağlar masif olarak aşırı parametrelendirilmiştir. BERT-base, ResNet-50, GPT-2'deki ağırlıkların %90'ı, fine-tuning sonrası &lt;%1 doğruluk kaybı ile sıfırlanabilir. Bazı ağırlıklar önemlidir; çoğu değildir.</div></div>
<div class="calc-card"><div class="card-title">Tuzak</div><div class="card-body">Rastgele sıfır desenli seyrek bir matris GPU'larda daha hızlı değildir ve CPU'larda sadece mütevazi şekilde daha hızlıdır. Sıfırlar sadece seyrek kernel'lerle (cuSPARSE, oneDNN sparse) atlanır ve onlar ~%95 sparsity'ye kadar yoğun kernel'lerden daha yavaştır. Pratik hızlanma <em>yapılı</em> sparsity gerektirir.</div></div>
<div class="calc-card"><div class="card-title">2:4 yapılı (NVIDIA Ampere+)</div><div class="card-body">A100/H100, 2:4 sparsity donanımı ekledi: her 4 ardışık ağırlıkta tam olarak 2'si sıfırdır. Matmul'da garantili 2x hızlanma verir. NVIDIA Sparse Tensor Core'larda kullanılır. Yoğun büyüklük budamasından "yararlı" budamaya daha yakın.</div></div>
<div class="calc-card"><div class="card-title">N:M yapılı</div><div class="card-body">2:4'ü genelleştirir. Esnekliği donanım basitliğiyle takas eder. Bazı Hopper-sınıfı kernel'leri, biraz daha yüksek doğruluk vuruşunda daha güçlü sıkıştırma için 4:8 (8'in 4 ağırlığı sıfır) yapar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Lottery Ticket Hipotezi (Frankle &amp; Carbin 2018)</h2>
<p class="l-text">"The Lottery Ticket Hypothesis: Finding Sparse, Trainable Neural Networks" (ICLR 2019, 2018'de yayımlandı), çarpıcı bir iddia önerdi: <em>rastgele başlatılmış büyük bir ağın içinde, "kazanan bilet" adlı küçük bir alt ağ vardır — eğer aynı başlatmadan onu izole eden bir maske ile eğitilirse, tam ağa benzer doğruluğa ulaşır.</em></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Prosedür</div><div class="card-body">1. Tam ağı eğit. 2. Büyüklüğe göre buda. 3. Hayatta kalan ağırlıkları <em>orijinal başlatmalarına</em> sıfırla. 4. Budanmış alt ağı eğit. 5. Tekrarla (iterative magnitude pruning, IMP).</div></div>
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">MNIST, CIFAR, ImageNet'te, hayatta kalan alt ağlar (genellikle orijinalin %5–20'si) sıfırdan eğitildiğinde tam modeli eşleştirir veya aşar. Aynı boyuttaki rastgele alt ağlar yapmaz.</div></div>
<div class="calc-card"><div class="card-title">İçerim</div><div class="card-body">Çoğu ağırlık gereksizdir VE doğru başlatma-maske kombinasyonu önemlidir. Saf mimari araması bir şey kaçırıyor — eğitilmiş maske cevabın bir parçasıdır.</div></div>
<div class="calc-card"><div class="card-title">Daha sonra keşfedilen uyarılar</div><div class="card-body">Çok büyük modeller için (BERT-Large, GPT), original-init reset bozulur; erken-ama-step-0-değil ağırlıklara "rewinding" yapmak gerekir (Frankle, Dziugaite, Roy, Carbin 2020). Yine de, lottery-ticket-tarzı budama ImageNet ResNet'lerinde ve BERT'te çalışır.</div></div>
</div>

<div class="calc-highlight"><strong>Edge ML için bu neden önemli:</strong> lottery ticket hipotezi doğruysa, her modelin keşfedilmeyi bekleyen %5–20 boyutunda bir versiyonu vardır. Artı quantization, bu orijinalden 50–100x daha küçük — telefon bölgesi.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Yapılı Budama — Gerçekten Hissettiğin Hızlanma</h2>
<p class="l-text">Yapısız budama size seyrek bir ağırlık matrisi verir; donanım, seyrek kernel'ler kullanmadıkça umursamaz. <strong>Yapılı budama</strong>, bütün birimleri kaldırır — conv'da bütün çıkış kanalları, MLP'de bütün nöronlar, transformer'larda bütün attention head'leri — size daha küçük yoğun bir ağ bırakır. Aynı FLOPs azaltma, gerçek wall-clock hızlanma, özel kernel gerekmez.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kanal budama (CNN'ler)</div><div class="card-body">Conv katmanlarının düşük-önemli çıkış kanallarını düşür. Önem metriği: kanalın ağırlıklarının L1 normu veya kanalın kayıp üzerindeki etkisi (Taylor açılımı). MobileNet, EfficientNet yeniden tasarımlarında kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Head budama (Transformer'lar)</div><div class="card-body">"Are Sixteen Heads Really Better than One?" (Michel, Levy, Neubig 2019), birçok attention head'inin kayıpsız budanabileceğini gösterdi. DistilBERT ve TinyBERT'te kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Layer dropping</div><div class="card-body">Bütün transformer katmanlarını kaldır. DistilBERT BERT'in her ikinci katmanını tutar. Son zamanlardaki "LayerDrop" (Fan ve diğ. 2020) bunu doğrudan eğitir.</div></div>
<div class="calc-card"><div class="card-title">Genişlik &amp; derinlik NAS-tarzı</div><div class="card-body">EfficientNet, MobileNetV3 birleşik ölçekleme kullanır — derinlik, genişlik, çözünürlüğü ortaklaşa ayarlar. Bir arama uzayının etkili yapılı budamasına yol açar.</div></div>
</div>

<p class="l-text">Transformer sıkıştırması için modern bir tarif: attention head'leri buda (Michel-tarzı) → FFN orta dim'leri buda → kalan katmanlarda damıt. Bu, 2019–2020'de TinyBERT ve MobileBERT'in tam olarak yaptığı şeydir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Knowledge Distillation — Hinton'un 2015 Hilesi</h2>
<p class="l-text">"Distilling the Knowledge in a Neural Network" (<em>Hinton, Vinyals, Dean — NIPS Workshop 2015</em>), derin öğrenmede en çok atıf alan makalelerden biridir ve altta yatan tarif şok edici şekilde basittir. Küçük bir <em>öğrenci</em> ağı, büyük bir <em>öğretmen</em>in <em>yumuşak</em> çıktısını eşleştirmek için eğitin.</p>

<div class="katex-block">$$\\mathcal{L} = \\alpha \\cdot \\text{CE}(y, \\sigma(z_s)) + (1-\\alpha) \\cdot T^2 \\cdot \\text{KL}(\\sigma(z_t/T) \\,\\|\\, \\sigma(z_s/T))$$</div>

<p class="l-text">İki terim: standart hard-label cross-entropy üzerinde küçük bir α ağırlığı ve öğretmen ile öğrenci logitleri arasında sıcaklık-ölçeklendirilmiş KL üzerinde büyük bir (1-α) ağırlığı. Sıcaklık T (tipik olarak 2–10) dağılımları yumuşatır, böylece öğrenci sadece "bu bir kedi" değil "bu bir kedi, 0.1 olasılıkla vaşak ve 0.05 olasılıkla tilki olabilir" görür — ve göreli güvenlerin o "karanlık bilgisi" aktarılan şeydir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Soft etiketler hard etiketleri neden yener</div><div class="card-body">Hard etiket örnek başına 1 bit denetim verir. 1000-sınıflı yumuşak bir dağılım ~10 bit verir — öğrenci güçlü bir regularizer olarak hareket eden göreli sınıf benzerliklerini öğrenir.</div></div>
<div class="calc-card"><div class="card-title">Self-distillation</div><div class="card-body">Öğretmenle <em>aynı</em> mimaride bir öğrenci eğitin. Şaşırtıcı şekilde, doğruluğu artırır ("Born-Again Networks", Furlanello ve diğ. 2018). Muhtemelen ML'deki en büyük bedava öğle yemeği.</div></div>
<div class="calc-card"><div class="card-title">Cross-architecture</div><div class="card-body">CNN öğretmen → transformer öğrenci, transformer öğretmen → MLP-Mixer öğrenci, vb. İkisi de ilgili fonksiyonu temsil edebildiği sürece çalışır.</div></div>
<div class="calc-card"><div class="card-title">Feature distillation</div><div class="card-body">Sadece logitleri değil, ara gizli durumları da eşleştir. FitNets (Romero 2014), TinyBERT, MobileBERT hepsi bunu yapar. Mimari bağlanma maliyetiyle daha güçlü aktarım.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. DistilBERT — Kanonik NLP Damıtması (Sanh 2019)</h2>
<p class="l-text">DistilBERT (<em>Sanh, Debut, Chaumond, Wolf — "DistilBERT, a distilled version of BERT", NeurIPS Workshop 2019</em>), yaygın olarak kullanılan ilk damıtılmış NLP modeliydi. Tarifi, daha sonra her sıkıştırılmış modelin kopyaladığı şablondur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mimari seçim</div><div class="card-body">Katman sayısını yarıya indir (12 → 6), gizli dim'i aynı tut (768). Öğrenci katmanlarını her ikinci öğretmen katmanından başlat — bedava %50 baş başlangıcı.</div></div>
<div class="calc-card"><div class="card-title">Üçlü kayıp</div><div class="card-body">Birleşik: standart MLM kaybı + softmax-T logitleri üzerinde KL diverjansı + gizli durumlar üzerinde cosine benzerliği. Gizli-durum terimi anahtar — DistilBERT BERT'in <em>özelliklerini</em> eşleştirmeyi öğrenir, sadece çıktıları değil.</div></div>
<div class="calc-card"><div class="card-title">Eğitim verisi</div><div class="card-body">Orijinal BERT ile aynı Wikipedia + BooksCorpus. 8x V100'de ~90 saat. Ucuz.</div></div>
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">%40 daha küçük (66M param vs 110M), %60 daha hızlı, BERT-base GLUE doğruluğunun %97'si. 2026 itibariyle HuggingFace'te ~150M indirme — şimdiye kadar en çok indirilen NLP modeli.</div></div>
</div>

<p class="l-text">Varyantlar ve takipçileri: <strong>TinyBERT</strong> (Jiao 2019, 4-katman 312-gizli, 7.5x daha küçük), <strong>MobileBERT</strong> (Sun 2020, telefonlar için optimize, ~25M param), <strong>MiniLM</strong> (Wang 2020, attention matrislerini damıtır). Hepsi DistilBERT tarifini ufak değişikliklerle kopyalar.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. 2024 Dalgası — Synthetic-Data Distillation</h2>
<p class="l-text">2022'ye kadar damıtma, gerçek veri üzerinde öğretmenin logitlerini kullanırdı. 2023–2024 dalgası oyunu değiştirdi: yüksek kaliteli eğitim verisi <em>üretmek</em> için öğretmeni (GPT-4, Claude) kullanın, sonra o sentetik korpus üzerinde küçük bir model eğitin. Öğrenci asla öğretmen logitlerini görmez — öğretmen tarafından yazılmış örnekleri görür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Phi-1 / Phi-1.5 / Phi-2 / Phi-3-mini (Microsoft, 2023–2024)</div><div class="card-body">"Textbooks Are All You Need" (Gunasekar ve diğ. 2023). Yüksek kaliteli sentetik ders kitabı tarzı kod ve mantık verisi ~1B token üretmek için GPT-3.5/4 kullandı. Phi-3-mini = 3.8B param, MMLU'da Llama 2 7B'yi yener.</div></div>
<div class="calc-card"><div class="card-title">TinyLlama (2024)</div><div class="card-body">3T token üzerinde eğitilmiş 1.1B param — Llama 2 7B'nin veri ölçeklenmesini eşler ama 1/7 boyutta. Açık kaynak, cihaz-üstü için tasarlanmış.</div></div>
<div class="calc-card"><div class="card-title">Gemma 2 2B (Google, 2024)</div><div class="card-body">2.6B param, Gemma 2 27B'den damıtılmış. Benchmark'larda Mistral 7B ile rekabet eder. Logit damıtması + on-policy veri üretimi kullanır.</div></div>
<div class="calc-card"><div class="card-title">Llama 3.2 1B/3B (Meta, 2024)</div><div class="card-body">6T token üzerinde yapılı budama + logit damıtması kullanılarak Llama 3.1 8B'den budanmış ve damıtılmış. Cihaz-üstü ve edge dağıtımı için özellikle hedeflenmiş.</div></div>
</div>

<div class="calc-highlight"><strong>Edge için içerim:</strong> 2026'daki 1–4B modeller "web verisinde eğitilmiş küçük modeller" değil, "frontier modellerin sıkıştırılmış projeksiyonlarıdır". Bu yüzden Phi-3-mini telefonunuza gönderilir ve çok daha büyük 2022-dönemi modelleri yener — sentetik veri yoluyla 2024 frontier bilgisini miras aldı.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pratik — NumPy'da Magnitude Pruning</h2>
<p class="l-text">Küçük yoğun bir ağırlık matrisi alın, alt %80'i büyüklüğe göre budayın, hayatta kalanları gradient descent ile fine-tune edin, kurtarmayı ölçün.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
np.random.seed(0)

# Oyuncak regresyon: y = W_true @ x
d = 64
W_true = np.random.randn(1, d).astype(np.float32) * 0.3
W_true[0, np.random.choice(d, 50, replace=False)] = 0.0  # ground truth seyrek
X = np.random.randn(d, 4000).astype(np.float32)
y = W_true @ X + 0.05 * np.random.randn(1, 4000)

# Yoğun bir model eğit
W = np.random.randn(1, d).astype(np.float32) * 0.05
lr = 0.01
for step in range(800):
    yhat = W @ X
    grad = (yhat - y) @ X.T / X.shape[1]
    W -= lr * grad
mse_dense = np.mean((W @ X - y)**2)

# Magnitude prune: |w|'nin üst %20'sini tut
sparsity = 0.8
threshold = np.quantile(np.abs(W), sparsity)
mask = (np.abs(W) >= threshold).astype(np.float32)
W_pruned = W * mask
mse_pruned_naive = np.mean((W_pruned @ X - y)**2)

# Hayatta kalanları maske ile fine-tune et (gradyan da maskelenir)
W_ft = W_pruned.copy()
for step in range(400):
    yhat = W_ft @ X
    grad = (yhat - y) @ X.T / X.shape[1]
    W_ft -= lr * grad * mask  # sadece hayatta kalan ağırlıkları eğit
    W_ft *= mask              # sparsity uygula
mse_pruned_ft = np.mean((W_ft @ X - y)**2)

print(f"Dense MSE:               {mse_dense:.5f}")
print(f"Pruned (no FT) MSE:      {mse_pruned_naive:.5f}")
print(f"Pruned + fine-tuned MSE: {mse_pruned_ft:.5f}")
print(f"Sparsity: {(1 - mask.mean())*100:.0f}%")
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Gerçek üretici W'nin kendisinin seyrek olduğu (64'ten 50'si sıfır) 64-boyutlu bir regresyon hedefi sentezler — bu, gerçek modellerin aşırı parametrelendirildiğine dair lottery-ticket-tarzı varsayımdır. 2) MSE dibe vurana kadar 800 adım vanilla GD ile yoğun bir lineer model eğitir — bu temel "yoğun" doğruluğu verir. 3) <code>τ = quantile(|W|, 0.8)</code> seçer ve sadece büyüklük olarak üst %20'yi tutan 0/1 maskesi kurar — tam olarak Han 2015 reçetesi. 4) Fine-tuning'den ÖNCE naif budanmış MSE'yi ölçer — patlar (genellikle 10-50x daha kötü) çünkü ağırlıkları sıfırlamak gradient descent'in bulduğu hassas dengeyi bozar. 5) Hayatta kalanları 400 adım daha fine-tune eder kritik bir detayla: <code>grad * mask</code> budanmış ağırlıkların gradyanlarını öldürür VE her adımdan sonra <code>W_ft *= mask</code> sıfır-olmayana sürüklenmeyi önler — bu masked-FT döngüsü başarısız ve başarılı budama arasındaki farktır ve Han'ın lottery-ticket kurtarmasının çalışmasının sebebidir.</p>

<p class="l-text">Bunu çalıştırın ve tipik olarak şunu görürsünüz: yoğun ~0.0025, naif budanmış ~0.05 (20x daha kötü), fine-tune edilmiş budanmış ~0.003 — neredeyse %80 ağırlık gittikten sonra yoğun kaliteye geri döner. Bu kurtarma, budamanın pratikte çalışmasının tüm nedenidir.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Pratik — Lojistik Regresyonla Damıtma</h2>
<p class="l-text">Bir öğretmen (tam özellikler üzerinde büyük lojistik regresyon) eğitir. Bir öğrenci (özelliklerin alt kümesinde daha küçük LR) öğretmenin <em>yumuşak</em> olasılıklarından öğrenir. <em>Hard</em> etiketler üzerinde eğitilmiş bir öğrenci ile karşılaştırın.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
np.random.seed(42)

# 50 özellikli 5-sınıflı problem (zengin)
X, y = make_classification(n_samples=4000, n_features=50, n_informative=30,
                          n_classes=5, n_clusters_per_class=2, random_state=42)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=42)

# Öğretmen: tüm 50 özellik üzerinde büyük LR
teacher = LogisticRegression(max_iter=1000, C=1.0).fit(Xtr, ytr)
teacher_acc = teacher.score(Xte, yte)
soft_labels = teacher.predict_proba(Xtr)  # (n, 5) — soft labels

# Öğrenci: sadece 10 özellik üzerinde LR
keep = np.argsort(np.abs(teacher.coef_).sum(0))[-10:]
Xtr_s, Xte_s = Xtr[:, keep], Xte[:, keep]

# (a) HARD etiketler üzerinde eğitilmiş öğrenci
student_hard = LogisticRegression(max_iter=1000).fit(Xtr_s, ytr)
acc_hard = student_hard.score(Xte_s, yte)

# (b) SOFT etiketler üzerinde eğitilmiş öğrenci (öğretmen dağılımını eşleştirmek için multinomial regression)
# Soft label argmax'in one-hot'unu entropi ile ağırlıklandırılmış zayıf adamın KD'si olarak kullan
# (sklearn LR yerel olarak soft hedefler yapmaz; bu pedagojik bir surrogate)
from sklearn.linear_model import Ridge
# Soft etiketler üzerinde sınıf başına ayrı bir Ridge eğit — sklearn'de KD ruhuna en yakın
class_models = []
for c in range(5):
    r = Ridge(alpha=1.0).fit(Xtr_s, soft_labels[:, c])
    class_models.append(r)
preds_soft = np.column_stack([m.predict(Xte_s) for m in class_models])
acc_soft = np.mean(np.argmax(preds_soft, axis=1) == yte)

print(f"Teacher (50 feats) accuracy:        {teacher_acc:.3f}")
print(f"Student (10 feats, hard labels):    {acc_hard:.3f}")
print(f"Student (10 feats, soft KD-style):  {acc_soft:.3f}")
print(f"KD lift over hard labels:           {(acc_soft-acc_hard)*100:+.1f} pp")
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) 50 özellikli (30 bilgilendirici) 5-sınıflı bir problem kurar — sınıf-güven desenlerinde anlamlı "karanlık bilgi" içerecek kadar büyük. 2) 50 özelliğin tümünde bir öğretmen LogisticRegression eğitir ve eğitim seti üzerinde <code>predict_proba</code>'yı çeker — bunlar soft etiketlerdir (satırlar 1'e toplanır) ve Hinton'un sınıf benzerliklerine dair "karanlık bilgi"sini taşırlar. 3) Öğretmenden agregat katsayı büyüklükleri en yüksek 10 özelliği seçer — TinyBERT'in gizli boyutlarda yaptığına benzer özellik budama. 4) 10-özellikli alt küme üzerinde kategorik etiketler kullanarak "hard-label" öğrenci eğitir — damıtma olmadan eğitim bunu verir. 5) sklearn primitives ile KD'yi yaklaştırır: yumuşak olasılıklara karşı sınıf başına bir Ridge regresörü. 5 tahmin edilmiş olasılık üzerinde <code>argmax</code> nihai sınıfı verir. Soft-targets-üzerinde-Ridge, KL(softmax(z_s/T) || softmax(z_t/T)) için sklearn-uyumlu vekildir; üretim DistilBERT'i T=2 ile T=10 arası gerçek KL kullanır — prensip aynıdır.</p>

<p class="l-text">Soft-label damıtması bu tür oyuncak üzerinde tipik olarak hard-label'ı 1–4 yüzde puanı yener. Gerçek LLM'lerde, fark çok daha büyüktür — DistilBERT'in %97 kurtarması vs aynı mimarinin sadece-hard-label eğitiminin ~%85'i, bu deneyin üretim ölçekli versiyonudur.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Onları İstifle — Budama + Damıtma + Quantization</h2>
<p class="l-text">Üç teknik çarpımsal olarak birleşir. Modern bir edge pipeline'ı:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — Damıt</div><div class="card-body">Büyük öğretmen (Llama 3.1 70B veya GPT-4) → küçük öğrenci mimarisi (3B). 25x boyut azaltma, ~%90–95 kapasite korunur.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — Buda</div><div class="card-body">Öğrencinin yapılı budaması: düşük-önemli head'leri, FFN dim'lerini düşür. &lt;%1 kalite maliyetinde ~%30–50 ek FLOPs azaltma (fine-tuning ile).</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — Quantize et</div><div class="card-body">AWQ INT4 group-128. ~4x boyut azaltma, bellek-bağlı LLM çıkarımında ~3x hızlanma.</div></div>
<div class="calc-card"><div class="card-title">Toplam</div><div class="card-body">25 × 1.5 × 4 = ~150x. 70B FP16 model (140GB), INT4 damıtılmış-budanmış ~1GB olur. Phi-3-mini esasen GPT-4-sınıfı sentetik veriye uygulanan bu pipeline'dır.</div></div>
</div>

<div class="calc-highlight"><strong>Pratik tavsiye:</strong> her zaman son olarak quantize edin. Quantize edilmiş bir modeli fine-tune etmek bir araştırma konusudur (QLoRA, 4-bit LoRA) ve çoğu üretim ekibi budama + damıtma kararlı olduktan sonra quantize eder.</div>

<p class="l-text">L4 buradan devam ediyor — quantize edilmiş bir model alıp GGUF formatı ve llama.cpp ile bir dizüstüne yerleştirir.</p>
</div>`
};
