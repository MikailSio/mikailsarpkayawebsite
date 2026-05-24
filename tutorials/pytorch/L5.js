window.PYTORCH_L5 = {

en: `<p class="l-text"><strong>The training loop is the heartbeat of every PyTorch model.</strong> Once you have a Module and a DataLoader, the loop that turns data into a trained model is shockingly short -- five lines at its core. The depth comes from understanding what each line does, why we use the loss functions and optimizers we use, and how to recognize when training is going wrong.</p>

<p class="l-text">This lesson covers loss functions (MSE, CrossEntropy, BCE), optimizers (SGD, Momentum, Adam, AdamW), learning-rate schedulers, and the standard training loop end to end. By the end you will train a real text classifier from scratch and watch the loss curves bend toward zero.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Write the canonical 5-line PyTorch training step (zero_grad, forward, loss, backward, step)</li>
<li>Pick the right loss: <code>MSELoss</code>, <code>CrossEntropyLoss</code>, <code>BCEWithLogitsLoss</code> for the task</li>
<li>Compare optimizers: SGD vs Momentum vs Adam vs AdamW and tune learning rates</li>
<li>Use LR schedulers like <code>StepLR</code>, <code>CosineAnnealingLR</code>, and warmup with linear decay</li>
<li>Train and validate a real text classifier and plot loss/accuracy curves per epoch</li>
<li>Spot diverging or stuck training and apply fixes (gradient clipping, lower LR)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Five-Line Training Loop</h2>

<p class="l-text">Strip everything else away and a PyTorch training step is exactly five lines. Internalize this rhythm and every more sophisticated trainer (HuggingFace Trainer, PyTorch Lightning) is just decoration around the same core.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(num_epochs):
    <span class="kw">for</span> x, y <span class="kw">in</span> loader:
        optimizer.<span class="fn">zero_grad</span>()       <span class="cm"># 1) clear stale gradients</span>
        logits = <span class="fn">model</span>(x)           <span class="cm"># 2) forward pass</span>
        loss = <span class="fn">loss_fn</span>(logits, y)   <span class="cm"># 3) compute scalar loss</span>
        loss.<span class="fn">backward</span>()             <span class="cm"># 4) compute gradients via autograd</span>
        optimizer.<span class="fn">step</span>()            <span class="cm"># 5) apply gradient descent update</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">The five-line PyTorch training loop reduces to: forward, loss, gradient, step, repeat. Here we do exactly that with NumPy on logistic regression.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
X = rng.standard_normal((200, 3))
y = (X[:, 0] - X[:, 1] + 0.5 * X[:, 2] > 0).astype(float)

w = np.zeros(3)
b = 0.0
lr = 0.5

for epoch in range(20):
    z    = X @ w + b               # forward
    p    = 1 / (1 + np.exp(-z))
    loss = -(y * np.log(p+1e-9) + (1-y) * np.log(1-p+1e-9)).mean()
    dz   = (p - y) / X.shape[0]    # gradient
    w   -= lr * (X.T @ dz)         # step
    b   -= lr * dz.sum()
    if epoch % 5 == 0:
        print(f'epoch {epoch:2d}  loss {loss:.4f}  acc {(p>0.5==y).mean():.3f}')

print('final w:', w.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>optimizer.zero_grad()</code> resets <code>.grad</code> on every parameter -- without it, gradients from the previous batch would accumulate. 2) <code>model(x)</code> runs the forward pass; this is where autograd records every operation into the graph. 3) <code>loss_fn(logits, y)</code> compares predictions to targets, returning a scalar loss; the choice of loss function depends on the task. 4) <code>loss.backward()</code> walks the recorded graph from the loss back to every parameter, filling in <code>.grad</code>. 5) <code>optimizer.step()</code> reads <code>.grad</code> on each parameter and applies an update rule (SGD, Adam, etc.) to push parameters in the direction that reduces loss.</p>

<div class="calc-highlight"><strong>The training loop has two nested layers:</strong> <em>epochs</em> (full passes over the dataset) and <em>steps</em> (one batch per step). On a 50k-sample dataset with batch size 32, one epoch is about 1500 steps. You typically train for 3-30 epochs depending on dataset size and model capacity.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">epoch</div><div class="card-body">One full pass over the training data. Conventionally how training time is measured.</div></div>
<div class="calc-card"><div class="card-title">step / iteration</div><div class="card-body">One forward + backward + optimizer step on one batch. Inner loop unit.</div></div>
<div class="calc-card"><div class="card-title">batch_size</div><div class="card-body">How many samples per step. Larger = smoother gradients, more memory, fewer steps per epoch.</div></div>
<div class="calc-card"><div class="card-title">loss</div><div class="card-body">Scalar measure of how wrong the model is on this batch. Lower = better.</div></div>
<div class="calc-card"><div class="card-title">gradient</div><div class="card-body"><code>dLoss/dParameter</code> for every parameter. Computed by <code>backward()</code>.</div></div>
<div class="calc-card"><div class="card-title">update</div><div class="card-body">The change applied to parameters at each step. Driven by gradient and optimizer rule.</div></div>
</div>

<div class="think-box"><div class="think-label">DON'T SKIP zero_grad</div><div class="think-body">Forgetting <code>optimizer.zero_grad()</code> is the single most common bug in beginner PyTorch code. Symptom: training loss keeps going down... and down... but accuracy stays at random. What's happening: gradients accumulate from every batch, growing wildly, and updates become huge but mostly wrong-direction. Always pair <code>step()</code> with <code>zero_grad()</code>.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Loss Functions: MSE, CrossEntropy, BCE</h2>

<p class="l-text">The loss function turns the model's output and the target into a single number. The choice depends entirely on the task: regression, multi-class classification, or multi-label / binary classification.</p>

<div class="katex-block">$$L_{\\text{MSE}} = \\frac{1}{N}\\sum_{i=1}^{N}(\\hat{y}_i - y_i)^2$$</div>

<div class="katex-block">$$L_{\\text{CE}} = -\\frac{1}{N}\\sum_{i=1}^{N}\\sum_{c=1}^{C} y_{i,c}\\log\\hat{p}_{i,c}, \\quad \\hat{p}_{i,c} = \\frac{e^{z_{i,c}}}{\\sum_{c'}e^{z_{i,c'}}}$$</div>

<div class="katex-block">$$L_{\\text{BCE}} = -\\frac{1}{N}\\sum_{i=1}^{N}\\bigl[y_i\\log\\sigma(z_i) + (1-y_i)\\log(1-\\sigma(z_i))\\bigr]$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">y_hat / y</div><div class="card-body">Prediction and target. Continuous for regression, integer class for CE, binary for BCE.</div></div>
<div class="calc-card"><div class="card-title">N</div><div class="card-body">Batch size; loss is averaged over the batch by default. Use <code>reduction="sum"</code> for total.</div></div>
<div class="calc-card"><div class="card-title">C</div><div class="card-body">Number of classes for cross-entropy. C=2 is binary; C=10 is digit classification.</div></div>
<div class="calc-card"><div class="card-title">z (logits)</div><div class="card-body">Raw outputs before softmax/sigmoid. PyTorch's CE/BCE-with-logits expect these directly.</div></div>
<div class="calc-card"><div class="card-title">p_hat</div><div class="card-body">Predicted probability after softmax (CE) or sigmoid (BCE).</div></div>
<div class="calc-card"><div class="card-title">- log p</div><div class="card-body">Negative log likelihood. Penalizes confident wrong predictions much more than uncertain ones.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

<span class="cm"># 1) MSE -- regression</span>
mse = nn.<span class="fn">MSELoss</span>()
y_hat = torch.<span class="fn">tensor</span>([<span class="num">2.5</span>, <span class="num">0.0</span>, <span class="num">2.0</span>])
y     = torch.<span class="fn">tensor</span>([<span class="num">3.0</span>, -<span class="num">0.5</span>, <span class="num">2.0</span>])
<span class="fn">print</span>(<span class="fn">mse</span>(y_hat, y).<span class="fn">item</span>())     <span class="cm"># 0.0833... = ((0.5)^2 + (0.5)^2 + 0)/3</span>

<span class="cm"># 2) CrossEntropy -- multi-class classification</span>
<span class="cm"># IMPORTANT: takes raw LOGITS, not probabilities (it applies softmax internally)</span>
ce = nn.<span class="fn">CrossEntropyLoss</span>()
logits = torch.<span class="fn">tensor</span>([[<span class="num">2.0</span>, <span class="num">1.0</span>, <span class="num">0.1</span>],
                       [<span class="num">0.5</span>, <span class="num">0.5</span>, <span class="num">3.0</span>]])
labels = torch.<span class="fn">tensor</span>([<span class="num">0</span>, <span class="num">2</span>])     <span class="cm"># int64 class indices, NOT one-hot</span>
<span class="fn">print</span>(<span class="fn">ce</span>(logits, labels).<span class="fn">item</span>())  <span class="cm"># ~0.55</span>

<span class="cm"># 3) BCE-with-logits -- binary or multi-label</span>
<span class="cm"># takes raw logits and applies sigmoid internally; numerically stable</span>
bce = nn.<span class="fn">BCEWithLogitsLoss</span>()
logits_bin = torch.<span class="fn">tensor</span>([<span class="num">2.0</span>, -<span class="num">1.5</span>, <span class="num">0.5</span>])
targets    = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">0.0</span>, <span class="num">1.0</span>])    <span class="cm"># float, 0 or 1</span>
<span class="fn">print</span>(<span class="fn">bce</span>(logits_bin, targets).<span class="fn">item</span>())

<span class="cm"># 4) Cross-entropy with class weights -- for imbalanced classes</span>
class_weights = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">5.0</span>])    <span class="cm"># class 1 is rarer, weight higher</span>
ce_w = nn.<span class="fn">CrossEntropyLoss</span>(weight=class_weights)

<span class="cm"># 5) Cross-entropy with ignore_index -- skip padding tokens in NLP</span>
ce_ig = nn.<span class="fn">CrossEntropyLoss</span>(ignore_index=-<span class="num">100</span>)
seq_logits = torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">6</span>, <span class="num">30000</span>)         <span class="cm"># (B, T, V)</span>
seq_labels = torch.<span class="fn">tensor</span>([[<span class="num">5</span>, <span class="num">12</span>, <span class="num">89</span>, -<span class="num">100</span>, -<span class="num">100</span>, -<span class="num">100</span>],
                           [<span class="num">3</span>, <span class="num">7</span>,  -<span class="num">100</span>, -<span class="num">100</span>, -<span class="num">100</span>, -<span class="num">100</span>],
                           [<span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, -<span class="num">100</span>],
                           [<span class="num">2</span>, <span class="num">4</span>, <span class="num">6</span>, <span class="num">8</span>, <span class="num">10</span>, <span class="num">12</span>]])
loss = <span class="fn">ce_ig</span>(seq_logits.<span class="fn">reshape</span>(-<span class="num">1</span>, <span class="num">30000</span>), seq_labels.<span class="fn">reshape</span>(-<span class="num">1</span>))
<span class="fn">print</span>(loss.<span class="fn">item</span>())</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">MSE, BCE and CrossEntropy implemented from formulas -- the same numbers torch.nn.MSELoss, BCELoss and CrossEntropyLoss return.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Regression: MSE
y_true_r = np.array([1.0, 2.0, 3.0])
y_pred_r = np.array([1.1, 1.9, 2.7])
mse = ((y_true_r - y_pred_r) ** 2).mean()

# Binary: BCE
y_true_b = np.array([1.0, 0.0, 1.0, 1.0])
y_pred_b = np.array([0.9, 0.2, 0.8, 0.4])
bce = -(y_true_b * np.log(y_pred_b+1e-9) + (1-y_true_b) * np.log(1-y_pred_b+1e-9)).mean()

# Multi-class: CrossEntropy from logits
logits = np.array([[2.0, 1.0, 0.1],
                   [0.5, 2.5, 0.3]])
labels = np.array([0, 1])
exp = np.exp(logits - logits.max(axis=1, keepdims=True))
probs = exp / exp.sum(axis=1, keepdims=True)
ce = -np.log(probs[np.arange(len(labels)), labels] + 1e-9).mean()

print(f'MSE         : {mse:.4f}')
print(f'BCE         : {bce:.4f}')
print(f'CrossEntropy: {ce:.4f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) MSE: squared difference averaged across the batch -- the standard regression loss. 2) CrossEntropy: takes raw logits (NOT probabilities, not softmax outputs), applies log-softmax internally, then computes negative log likelihood. The targets must be integer class indices, not one-hot vectors. This is the #1 confusion for beginners. 3) BCEWithLogitsLoss: equivalent for binary/multi-label; takes raw logits, applies sigmoid internally. Always prefer this over <code>BCELoss + sigmoid</code> for numerical stability. 4) Class weights re-weight the loss to combat imbalance: a rare class gets a higher weight so the gradient pays more attention to it. 5) <code>ignore_index=-100</code> is essential for NLP where padding tokens get label -100 and are skipped from the loss. The reshape collapses batch and time into a single dimension because CE expects 2D logits.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">CrossEntropyLoss</div><div class="compare-item">Multi-class single-label</div><div class="compare-item">Targets: int64 class indices</div><div class="compare-item">Input: raw logits (B, C)</div><div class="compare-item">Internally: log_softmax + NLL</div><div class="compare-item">Use for sentiment, topic, classification heads</div></div>
<div class="compare-col"><div class="compare-title">BCEWithLogitsLoss</div><div class="compare-item">Binary or multi-label</div><div class="compare-item">Targets: float 0/1, same shape as logits</div><div class="compare-item">Input: raw logits (B,) or (B, K)</div><div class="compare-item">Internally: sigmoid + BCE</div><div class="compare-item">Use for tag prediction, multi-label classification</div></div>
</div>

<div class="l-warn"><strong>Pitfall:</strong> Never apply softmax to your model output before passing it to CrossEntropyLoss. The loss expects raw logits and applies softmax itself. If you softmax twice, the gradients become tiny and training stalls.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Optimizers: SGD, Momentum, Adam, AdamW</h2>

<p class="l-text">An optimizer reads gradients and updates parameters. The update rule is the difference between optimizers; the choice has a huge impact on training speed and final quality.</p>

<div class="katex-block">$$\\text{SGD: } \\theta_{t+1} = \\theta_t - \\eta\\,g_t$$</div>

<div class="katex-block">$$\\text{Momentum: } v_t = \\mu v_{t-1} + g_t, \\quad \\theta_{t+1} = \\theta_t - \\eta\\,v_t$$</div>

<div class="katex-block">$$\\text{Adam: } m_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t, \\;\\; v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2, \\;\\; \\theta_{t+1} = \\theta_t - \\eta\\,\\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t}+\\varepsilon}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">theta</div><div class="card-body">The parameter being optimized.</div></div>
<div class="calc-card"><div class="card-title">eta</div><div class="card-body">Learning rate. Most important hyperparameter. Typical: 1e-3 for Adam, 1e-2 for SGD.</div></div>
<div class="calc-card"><div class="card-title">g_t</div><div class="card-body">Gradient at step t.</div></div>
<div class="calc-card"><div class="card-title">v_t (Momentum)</div><div class="card-body">Velocity: exponential moving average of gradients. Smooths the trajectory.</div></div>
<div class="calc-card"><div class="card-title">m_t / v_t (Adam)</div><div class="card-body">First and second moments of gradient. Adam adapts step per parameter using these.</div></div>
<div class="calc-card"><div class="card-title">beta_1, beta_2</div><div class="card-body">Decay rates: 0.9 and 0.999 by default. Almost never tuned.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

model = nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">2</span>)

<span class="cm"># 1) Plain SGD</span>
opt = torch.optim.<span class="fn">SGD</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">0.01</span>)

<span class="cm"># 2) SGD with momentum (almost always better than plain SGD)</span>
opt = torch.optim.<span class="fn">SGD</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">0.01</span>, momentum=<span class="num">0.9</span>)

<span class="cm"># 3) Adam -- adaptive, default for most NLP/transformer work</span>
opt = torch.optim.<span class="fn">Adam</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>, betas=(<span class="num">0.9</span>, <span class="num">0.999</span>))

<span class="cm"># 4) AdamW -- Adam with proper decoupled weight decay (preferred for transformers)</span>
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>, weight_decay=<span class="num">0.01</span>)

<span class="cm"># 5) Different learning rates per parameter group</span>
<span class="cm"># Common pattern in fine-tuning: small LR for pretrained, larger for new head</span>
opt = torch.optim.<span class="fn">AdamW</span>([
    {<span class="str">"params"</span>: model.weight, <span class="str">"lr"</span>: <span class="num">1e-5</span>},
    {<span class="str">"params"</span>: model.bias,   <span class="str">"lr"</span>: <span class="num">1e-3</span>},
], weight_decay=<span class="num">0.01</span>)

<span class="cm"># Anatomy of an optimizer step</span>
loss = (<span class="fn">model</span>(torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">10</span>)) ** <span class="num">2</span>).<span class="fn">mean</span>()
loss.<span class="fn">backward</span>()
<span class="fn">print</span>(<span class="str">"before step, weight.mean():"</span>, model.weight.<span class="fn">mean</span>().<span class="fn">item</span>())
opt.<span class="fn">step</span>()
<span class="fn">print</span>(<span class="str">"after step,  weight.mean():"</span>, model.weight.<span class="fn">mean</span>().<span class="fn">item</span>())
opt.<span class="fn">zero_grad</span>()</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">SGD vs SGD+momentum vs Adam -- coded by hand on a quadratic loss to show why momentum and adaptive lr converge faster.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Loss: L(w) = sum w_i^2 with very different curvatures
def grad(w): return np.array([2 * w[0], 20 * w[1]])
w_init = np.array([4.0, 4.0])

def sgd():
    w, lr = w_init.copy(), 0.05
    for _ in range(40):
        w -= lr * grad(w)
    return w

def sgd_mom():
    w, lr, beta = w_init.copy(), 0.05, 0.9
    v = np.zeros_like(w)
    for _ in range(40):
        v = beta * v + grad(w)
        w -= lr * v
    return w

def adam():
    w, lr = w_init.copy(), 0.5
    m = np.zeros_like(w); v = np.zeros_like(w)
    b1, b2, eps = 0.9, 0.999, 1e-8
    for t in range(1, 41):
        g = grad(w)
        m = b1*m + (1-b1)*g
        v = b2*v + (1-b2)*g*g
        m_hat = m / (1 - b1**t); v_hat = v / (1 - b2**t)
        w -= lr * m_hat / (np.sqrt(v_hat) + eps)
    return w

for name, w_final in [('SGD', sgd()), ('SGD+momentum', sgd_mom()), ('Adam', adam())]:
    dist = np.linalg.norm(w_final)
    print(f'{name:14s} after 40 steps: w={w_final.round(3)}, dist to opt={dist:.4f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Plain SGD updates parameters by subtracting <code>lr * grad</code>. Simple but slow to converge on noisy losses. 2) SGD with momentum keeps a velocity vector that smooths the trajectory; <code>momentum=0.9</code> is the universal default. 3) Adam adapts the learning rate per parameter using the running variance of gradients. Default for transformers and NLP. 4) AdamW fixes a subtle bug in Adam's weight decay; for transformer fine-tuning AdamW is now the standard. 5) Parameter groups let you set different hyperparameters per layer -- essential for fine-tuning where you want a small LR on the pretrained backbone and a larger LR on a fresh classifier head. 6) The before/after print shows the optimizer in action: <code>step()</code> mutates parameters in place; <code>zero_grad()</code> clears the grad buffer for the next iteration.</p>

<div id="plot-pl5-optimizers-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Loss curves for SGD, SGD+momentum, and Adam on a non-convex toy problem. Plain SGD oscillates and converges slowly. Momentum smooths and reaches a lower loss. Adam adapts per-parameter and reaches the lowest loss fastest. The pattern is typical: Adam wins for most NLP work, while SGD+momentum is preferred for ResNets and very large models where Adam's memory overhead matters.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: AdamW for BERT fine-tuning</div><div class="example-body">The recipe in 99% of HuggingFace fine-tuning scripts: <code>AdamW(model.parameters(), lr=2e-5, betas=(0.9, 0.999), eps=1e-8, weight_decay=0.01)</code>. The small LR (2e-5 to 5e-5) prevents catastrophic forgetting of pretrained features; weight decay regularizes; AdamW handles weight decay properly without affecting bias and LayerNorm parameters.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Learning Rate Schedulers</h2>

<p class="l-text">A constant learning rate is rarely optimal. Most modern training uses a schedule: warm up the LR linearly at the start (so early gradients do not destabilize the model), then decay it over time (so later updates make smaller, more refined corrections).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.optim.lr_scheduler <span class="kw">import</span> StepLR, CosineAnnealingLR, OneCycleLR, LambdaLR

model = nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">2</span>)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)

<span class="cm"># 1) StepLR: drop LR by gamma every step_size epochs</span>
sched = <span class="fn">StepLR</span>(opt, step_size=<span class="num">10</span>, gamma=<span class="num">0.5</span>)
<span class="cm"># Epoch 0-9: lr=1e-3; 10-19: lr=5e-4; 20-29: lr=2.5e-4; ...</span>

<span class="cm"># 2) CosineAnnealingLR: smooth cosine decay over T_max steps</span>
sched = <span class="fn">CosineAnnealingLR</span>(opt, T_max=<span class="num">100</span>, eta_min=<span class="num">1e-6</span>)

<span class="cm"># 3) OneCycleLR: warmup + cosine decay (state of the art for many tasks)</span>
sched = <span class="fn">OneCycleLR</span>(opt, max_lr=<span class="num">1e-3</span>, total_steps=<span class="num">1000</span>,
                   pct_start=<span class="num">0.1</span>,         <span class="cm"># 10% warmup</span>
                   anneal_strategy=<span class="str">"cos"</span>)

<span class="cm"># 4) LambdaLR with custom function -- maximally flexible</span>
<span class="kw">def</span> <span class="fn">warmup_then_constant</span>(step):
    <span class="kw">if</span> step &lt; <span class="num">100</span>:
        <span class="kw">return</span> step / <span class="num">100.0</span>
    <span class="kw">return</span> <span class="num">1.0</span>
sched = <span class="fn">LambdaLR</span>(opt, lr_lambda=warmup_then_constant)

<span class="cm"># Standard usage: call sched.step() ONCE per training step (or per epoch, check docs)</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2</span>):
    <span class="kw">for</span> batch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
        opt.<span class="fn">zero_grad</span>()
        <span class="cm"># ... loss = ... ; loss.backward()</span>
        opt.<span class="fn">step</span>()
        sched.<span class="fn">step</span>()                           <span class="cm"># most schedulers want per-step</span>
    <span class="fn">print</span>(f<span class="str">"epoch {epoch}, lr = {sched.get_last_lr()[0]:.2e}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">LR schedulers = simple math functions of the step number. Step, cosine and warmup schedules in 5 lines each.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

base_lr = 0.1
n_steps = 100

# Step decay every 30 steps, gamma 0.5
step_lr   = [base_lr * (0.5 ** (s // 30)) for s in range(n_steps)]
# Cosine annealing
cos_lr    = [base_lr * 0.5 * (1 + np.cos(np.pi * s / n_steps)) for s in range(n_steps)]
# Linear warmup over 10 steps then constant
warmup_lr = [base_lr * min(1.0, (s+1) / 10) for s in range(n_steps)]

print('step  step_lr   cos_lr   warmup_lr')
for s in (0, 5, 10, 30, 50, 90):
    print(f'{s:3d}  {step_lr[s]:.4f}  {cos_lr[s]:.4f}   {warmup_lr[s]:.4f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>StepLR</code> drops the LR by a factor of <code>gamma</code> every <code>step_size</code> epochs -- the simplest schedule, used in classic image classification. 2) <code>CosineAnnealingLR</code> decays the LR following a cosine curve from the initial value down to <code>eta_min</code>; smooth and parameter-free. 3) <code>OneCycleLR</code> combines a warm-up phase with cosine decay; <code>pct_start=0.1</code> means the first 10% of training is warm-up. This is the schedule used in most modern fine-tuning. 4) <code>LambdaLR</code> with a custom function gives you full control; HuggingFace's <code>get_linear_schedule_with_warmup</code> is implemented this way. 5) The training loop calls <code>scheduler.step()</code> after <code>optimizer.step()</code>; for most schedulers this should be once per training step (not per epoch). Check the docstring -- some older schedulers expect per-epoch.</p>

<div id="plot-pl5-schedulers-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Three common LR schedules over 1000 training steps. StepLR drops the LR sharply at fixed intervals. CosineAnnealing decays smoothly. OneCycleLR warms up linearly to <code>max_lr</code> in the first 10% of steps, then decays via cosine. The "warmup" piece prevents large early updates from destabilizing the model -- critical for transformers where the LayerNorm scale parameters need a few hundred steps to settle.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">StepLR</div><div class="card-body">Drop by factor every N epochs. Simple, predictable. Classic for image classification.</div></div>
<div class="calc-card"><div class="card-title">CosineAnnealingLR</div><div class="card-body">Smooth cosine decay. No tuning. Often best for NLP.</div></div>
<div class="calc-card"><div class="card-title">OneCycleLR</div><div class="card-body">Warmup + cosine decay in one. Modern default for fine-tuning.</div></div>
<div class="calc-card"><div class="card-title">ReduceLROnPlateau</div><div class="card-body">Drop LR when validation loss stops improving. Adaptive but requires monitoring.</div></div>
<div class="calc-card"><div class="card-title">LinearLR / ConstantLR</div><div class="card-body">Linear warmup or hold constant; use as building blocks of <code>SequentialLR</code>.</div></div>
<div class="calc-card"><div class="card-title">LambdaLR</div><div class="card-body">Custom function. Use when no built-in schedule fits.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Validation, Metrics, and Early Stopping</h2>

<p class="l-text">Training loss alone is not enough. You need to evaluate on held-out data to know if your model generalizes. The validation loop runs in <code>eval()</code> mode with no gradients, computing loss and metrics on each batch then aggregating.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="at">@torch.no_grad</span>()
<span class="kw">def</span> <span class="fn">evaluate</span>(model, loader, device, loss_fn):
    model.<span class="fn">eval</span>()
    total_loss, total_correct, total_n = <span class="num">0.0</span>, <span class="num">0</span>, <span class="num">0</span>
    <span class="kw">for</span> batch <span class="kw">in</span> loader:
        x = batch[<span class="str">"input_ids"</span>].<span class="fn">to</span>(device)
        y = batch[<span class="str">"labels"</span>].<span class="fn">to</span>(device)
        mask = batch[<span class="str">"attention_mask"</span>].<span class="fn">to</span>(device)
        logits = <span class="fn">model</span>(x, mask)
        loss = <span class="fn">loss_fn</span>(logits, y)
        total_loss += loss.<span class="fn">item</span>() * y.<span class="fn">size</span>(<span class="num">0</span>)
        preds = logits.<span class="fn">argmax</span>(dim=-<span class="num">1</span>)
        total_correct += (preds == y).<span class="fn">sum</span>().<span class="fn">item</span>()
        total_n += y.<span class="fn">size</span>(<span class="num">0</span>)
    <span class="kw">return</span> {<span class="str">"loss"</span>: total_loss / total_n, <span class="str">"acc"</span>: total_correct / total_n}

<span class="cm"># Early stopping pattern</span>
<span class="kw">class</span> EarlyStopper:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, patience=<span class="num">3</span>, min_delta=<span class="num">0.0</span>):
        self.patience = patience
        self.min_delta = min_delta
        self.best = <span class="fn">float</span>(<span class="str">"inf"</span>)
        self.counter = <span class="num">0</span>
    <span class="kw">def</span> <span class="fn">step</span>(self, val_loss):
        <span class="kw">if</span> val_loss &lt; self.best - self.min_delta:
            self.best = val_loss
            self.counter = <span class="num">0</span>
            <span class="kw">return</span> <span class="kw">False</span>        <span class="cm"># do not stop, this is a new best</span>
        self.counter += <span class="num">1</span>
        <span class="kw">return</span> self.counter &gt;= self.patience

<span class="cm"># Usage</span>
stopper = <span class="fn">EarlyStopper</span>(patience=<span class="num">3</span>)
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
    <span class="cm"># ... train one epoch ...</span>
    metrics = <span class="fn">evaluate</span>(model, val_loader, device, loss_fn)
    <span class="kw">if</span> stopper.<span class="fn">step</span>(metrics[<span class="str">"loss"</span>]):
        <span class="fn">print</span>(f<span class="str">"early stopping at epoch {epoch}"</span>)
        <span class="kw">break</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Validation, metrics, early stopping -- all three are simple Python: track val loss each epoch, stop if it has not improved for K epochs.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X = df_iris.iloc[:, :4].values
y = df_iris.iloc[:, 4].astype('category').cat.codes.values
X_tr, X_va, y_tr, y_va = train_test_split(X, y, test_size=0.3, random_state=0)

clf = SGDClassifier(loss='log_loss', learning_rate='constant', eta0=0.05, random_state=0)
classes = np.unique(y_tr)

best_acc, patience, no_improve = -1, 5, 0
for epoch in range(40):
    clf.partial_fit(X_tr, y_tr, classes=classes)
    val_acc = accuracy_score(y_va, clf.predict(X_va))
    if val_acc > best_acc:
        best_acc = val_acc
        no_improve = 0
        marker = '  *best'
    else:
        no_improve += 1
        marker = ''
    if epoch % 5 == 0:
        print(f'epoch {epoch:2d}  val_acc={val_acc:.3f}{marker}')
    if no_improve >= patience:
        print(f'early stop at epoch {epoch}, best={best_acc:.3f}')
        break</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The <code>@torch.no_grad()</code> decorator disables gradient tracking inside the function, saving memory and time. <code>model.eval()</code> switches dropout off and tells BatchNorm to use running statistics. 2) The validation loop accumulates loss and correct counts; we weight by batch size to get a true per-sample average even when batches are uneven. 3) <code>preds = logits.argmax(dim=-1)</code> picks the highest-scoring class per sample -- the standard "hard prediction" for classification metrics. 4) <code>EarlyStopper</code> tracks the best validation loss and stops training when it has not improved for <code>patience</code> epochs. 5) The full training loop calls <code>evaluate</code> after each epoch and checks the stopper; this prevents wasting compute on a model that has plateaued or started overfitting.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: choosing the right metric</div><div class="example-body">Accuracy is the default but is misleading on imbalanced data. For a 95% positive class, predicting "always positive" gives 95% accuracy with zero useful information. Use <strong>F1 score</strong> for imbalanced binary, <strong>macro-F1</strong> for imbalanced multi-class, <strong>AUROC</strong> when the threshold matters, <strong>BLEU/ROUGE</strong> for generation. Sklearn's <code>classification_report</code> is your friend.</div></div>

<div class="l-warn"><strong>Pitfall (overfitting):</strong> If training loss drops but validation loss starts climbing, you are overfitting. Solutions: more dropout, more weight decay, fewer epochs, more training data, smaller model, early stopping. The validation curve is your overfitting alarm.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Gradient Clipping and Common Tricks</h2>

<p class="l-text">A handful of tricks have moved from "research" to "default practice" in modern training. Skip them at your peril.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

model = nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">2</span>)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="cm"># Trick 1: gradient clipping -- prevents exploding gradients in RNNs/transformers</span>
<span class="kw">for</span> batch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
    opt.<span class="fn">zero_grad</span>()
    x = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">10</span>)
    y = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, (<span class="num">8</span>,))
    loss = <span class="fn">loss_fn</span>(<span class="fn">model</span>(x), y)
    loss.<span class="fn">backward</span>()
    <span class="cm"># Clip gradients so their global norm is at most 1.0</span>
    torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), max_norm=<span class="num">1.0</span>)
    opt.<span class="fn">step</span>()

<span class="cm"># Trick 2: separate weight decay for bias and LayerNorm</span>
<span class="kw">def</span> <span class="fn">get_optimizer_groups</span>(model, weight_decay=<span class="num">0.01</span>):
    decay_params, no_decay_params = [], []
    <span class="kw">for</span> name, p <span class="kw">in</span> model.<span class="fn">named_parameters</span>():
        <span class="kw">if</span> <span class="kw">not</span> p.requires_grad: <span class="kw">continue</span>
        <span class="kw">if</span> name.<span class="fn">endswith</span>(<span class="str">".bias"</span>) <span class="kw">or</span> <span class="str">"norm"</span> <span class="kw">in</span> name.<span class="fn">lower</span>():
            no_decay_params.<span class="fn">append</span>(p)
        <span class="kw">else</span>:
            decay_params.<span class="fn">append</span>(p)
    <span class="kw">return</span> [
        {<span class="str">"params"</span>: decay_params,    <span class="str">"weight_decay"</span>: weight_decay},
        {<span class="str">"params"</span>: no_decay_params, <span class="str">"weight_decay"</span>: <span class="num">0.0</span>},
    ]
groups = <span class="fn">get_optimizer_groups</span>(model)
opt2 = torch.optim.<span class="fn">AdamW</span>(groups, lr=<span class="num">1e-3</span>)

<span class="cm"># Trick 3: gradient accumulation for big effective batch sizes</span>
accum_steps = <span class="num">4</span>
opt.<span class="fn">zero_grad</span>()
<span class="kw">for</span> step, (x, y) <span class="kw">in</span> <span class="fn">enumerate</span>([(torch.<span class="fn">randn</span>(<span class="num">8</span>,<span class="num">10</span>), torch.<span class="fn">randint</span>(<span class="num">0</span>,<span class="num">2</span>,(<span class="num">8</span>,))) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>)]):
    loss = <span class="fn">loss_fn</span>(<span class="fn">model</span>(x), y) / accum_steps     <span class="cm"># scale down</span>
    loss.<span class="fn">backward</span>()
    <span class="kw">if</span> (step + <span class="num">1</span>) % accum_steps == <span class="num">0</span>:
        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
        opt.<span class="fn">step</span>()
        opt.<span class="fn">zero_grad</span>()</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Gradient clipping caps the L2 norm of the gradient -- here, manual implementation showing how the trick prevents exploding updates.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def clip_grad_norm(grad, max_norm=1.0):
    n = np.linalg.norm(grad)
    if n > max_norm:
        return grad * (max_norm / n)
    return grad

# Simulate exploding gradient
grad = np.array([5.0, -8.0, 12.0])
print('original norm :', round(float(np.linalg.norm(grad)), 3))
clipped = clip_grad_norm(grad, max_norm=1.0)
print('clipped       :', clipped.round(3))
print('clipped norm  :', round(float(np.linalg.norm(clipped)), 3))

# Apply during one step
w = np.array([1.0, 1.0, 1.0])
lr = 0.1
w_no_clip   = w - lr * grad
w_with_clip = w - lr * clipped
print('w step no clip   :', w_no_clip.round(3),
      '  ||delta||=', round(float(np.linalg.norm(lr*grad)), 3))
print('w step with clip :', w_with_clip.round(3),
      '  ||delta||=', round(float(np.linalg.norm(lr*clipped)), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>clip_grad_norm_</code> rescales all gradients so that their global L2 norm is at most <code>max_norm</code>. This prevents the catastrophic "loss goes NaN" caused by exploding gradients in RNNs and the early steps of transformer training. 2) The optimizer-group pattern excludes biases and LayerNorm parameters from weight decay -- decaying them often hurts performance. This pattern is in every HuggingFace fine-tuning script. 3) Gradient accumulation simulates a large batch on a small GPU: do K small forward+backwards without zeroing in between, then step once and zero. Loss is scaled by <code>1/accum_steps</code> so the effective learning rate matches what you'd get from one big batch. This is how researchers train BERT on a single GPU when the official recipe wants 256 batch size.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">clip_grad_norm_</div><div class="card-body">Rescale gradients to global norm ≤ max_norm. Essential for RNNs and transformer training stability.</div></div>
<div class="calc-card"><div class="card-title">no decay for bias/norm</div><div class="card-body">Standard pattern in BERT/GPT training. Improves generalization.</div></div>
<div class="calc-card"><div class="card-title">gradient accumulation</div><div class="card-body">Simulate larger batches by accumulating across mini-batches before stepping.</div></div>
<div class="calc-card"><div class="card-title">label smoothing</div><div class="card-body">Soften one-hot targets by epsilon. <code>CrossEntropyLoss(label_smoothing=0.1)</code>. Helps generalization.</div></div>
<div class="calc-card"><div class="card-title">mixed precision</div><div class="card-body">Train in float16/bfloat16 for 2x speed and half memory. Covered in L11.</div></div>
<div class="calc-card"><div class="card-title">checkpointing</div><div class="card-body">Save every epoch; resume from checkpoint after crashes. Always have it in production runs.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. End-to-End: Training a Text Classifier</h2>

<p class="l-text">All the pieces fit together now: Dataset, DataLoader, Model, Loss, Optimizer, Scheduler, training loop, evaluation. Here is the complete, runnable script that trains a small text classifier on toy data.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader, random_split
<span class="kw">from</span> torch.nn.utils.rnn <span class="kw">import</span> pad_sequence

torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)
device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>

<span class="cm"># --- data (reuse from L4) ---</span>
<span class="kw">class</span> <span class="fn">TextDS</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, texts, labels, vocab, max_len=<span class="num">20</span>):
        self.texts, self.labels, self.vocab, self.max_len = texts, labels, vocab, max_len
    <span class="kw">def</span> <span class="fn">__len__</span>(self): <span class="kw">return</span> <span class="fn">len</span>(self.texts)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i):
        ids = [self.vocab.<span class="fn">get</span>(t, <span class="num">1</span>) <span class="kw">for</span> t <span class="kw">in</span> self.texts[i].<span class="fn">lower</span>().<span class="fn">split</span>()][:self.max_len]
        <span class="kw">return</span> {<span class="str">"input_ids"</span>: torch.<span class="fn">tensor</span>(ids, dtype=torch.long),
                <span class="str">"label"</span>: torch.<span class="fn">tensor</span>(self.labels[i], dtype=torch.long)}

<span class="kw">def</span> <span class="fn">collate</span>(batch):
    ids = [b[<span class="str">"input_ids"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch]
    labels = torch.<span class="fn">stack</span>([b[<span class="str">"label"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch])
    padded = <span class="fn">pad_sequence</span>(ids, batch_first=<span class="kw">True</span>, padding_value=<span class="num">0</span>)
    mask = (padded != <span class="num">0</span>).<span class="fn">float</span>()
    <span class="kw">return</span> {<span class="str">"input_ids"</span>: padded, <span class="str">"attention_mask"</span>: mask, <span class="str">"labels"</span>: labels}

<span class="cm"># --- model (reuse from L3) ---</span>
<span class="kw">class</span> <span class="fn">Classifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, V, E=<span class="num">64</span>, H=<span class="num">32</span>, C=<span class="num">2</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(V, E, padding_idx=<span class="num">0</span>)
        self.fc1 = nn.<span class="fn">Linear</span>(E, H); self.act = nn.<span class="fn">ReLU</span>(); self.drop = nn.<span class="fn">Dropout</span>(<span class="num">0.3</span>)
        self.fc2 = nn.<span class="fn">Linear</span>(H, C)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids, mask):
        e = self.<span class="fn">embed</span>(ids)                           <span class="cm"># (B, T, E)</span>
        m = mask.<span class="fn">unsqueeze</span>(-<span class="num">1</span>)
        pooled = (e * m).<span class="fn">sum</span>(<span class="num">1</span>) / m.<span class="fn">sum</span>(<span class="num">1</span>).<span class="fn">clamp</span>(<span class="ty">min</span>=<span class="num">1</span>)  <span class="cm"># (B, E)</span>
        h = self.<span class="fn">drop</span>(self.<span class="fn">act</span>(self.<span class="fn">fc1</span>(pooled)))
        <span class="kw">return</span> self.<span class="fn">fc2</span>(h)                            <span class="cm"># logits (B, C)</span>

<span class="cm"># --- toy data ---</span>
texts = [<span class="str">"amazing movie"</span>, <span class="str">"terrible film"</span>, <span class="str">"great cast"</span>, <span class="str">"boring plot"</span>,
         <span class="str">"loved it"</span>, <span class="str">"hated it"</span>, <span class="str">"fantastic experience"</span>, <span class="str">"awful waste"</span>] * <span class="num">10</span>
labels = [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>] * <span class="num">10</span>
vocab = {<span class="str">"&lt;pad&gt;"</span>:<span class="num">0</span>, <span class="str">"&lt;unk&gt;"</span>:<span class="num">1</span>}
<span class="kw">for</span> t <span class="kw">in</span> texts:
    <span class="kw">for</span> w <span class="kw">in</span> t.<span class="fn">lower</span>().<span class="fn">split</span>():
        vocab.<span class="fn">setdefault</span>(w, <span class="fn">len</span>(vocab))

ds = <span class="fn">TextDS</span>(texts, labels, vocab)
gen = torch.<span class="fn">Generator</span>().<span class="fn">manual_seed</span>(<span class="num">0</span>)
train_ds, val_ds = <span class="fn">random_split</span>(ds, [<span class="num">0.8</span>, <span class="num">0.2</span>], generator=gen)
train_loader = <span class="fn">DataLoader</span>(train_ds, batch_size=<span class="num">8</span>, shuffle=<span class="kw">True</span>, collate_fn=collate)
val_loader = <span class="fn">DataLoader</span>(val_ds, batch_size=<span class="num">8</span>, collate_fn=collate)

<span class="cm"># --- training setup ---</span>
model = <span class="fn">Classifier</span>(V=<span class="fn">len</span>(vocab)).<span class="fn">to</span>(device)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>, weight_decay=<span class="num">0.01</span>)
sched = torch.optim.lr_scheduler.<span class="fn">CosineAnnealingLR</span>(opt, T_max=<span class="num">10</span>*<span class="fn">len</span>(train_loader))
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="cm"># --- train ---</span>
<span class="kw">def</span> <span class="fn">evaluate</span>(loader):
    model.<span class="fn">eval</span>()
    correct, total, loss_sum = <span class="num">0</span>, <span class="num">0</span>, <span class="num">0.0</span>
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        <span class="kw">for</span> batch <span class="kw">in</span> loader:
            ids = batch[<span class="str">"input_ids"</span>].<span class="fn">to</span>(device)
            mask = batch[<span class="str">"attention_mask"</span>].<span class="fn">to</span>(device)
            y = batch[<span class="str">"labels"</span>].<span class="fn">to</span>(device)
            logits = <span class="fn">model</span>(ids, mask)
            loss = <span class="fn">loss_fn</span>(logits, y)
            loss_sum += loss.<span class="fn">item</span>() * y.<span class="fn">size</span>(<span class="num">0</span>)
            correct += (logits.<span class="fn">argmax</span>(-<span class="num">1</span>) == y).<span class="fn">sum</span>().<span class="fn">item</span>()
            total += y.<span class="fn">size</span>(<span class="num">0</span>)
    model.<span class="fn">train</span>()
    <span class="kw">return</span> loss_sum / total, correct / total

history = []
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
    model.<span class="fn">train</span>()
    train_loss = <span class="num">0.0</span>
    <span class="kw">for</span> batch <span class="kw">in</span> train_loader:
        opt.<span class="fn">zero_grad</span>()
        ids = batch[<span class="str">"input_ids"</span>].<span class="fn">to</span>(device)
        mask = batch[<span class="str">"attention_mask"</span>].<span class="fn">to</span>(device)
        y = batch[<span class="str">"labels"</span>].<span class="fn">to</span>(device)
        logits = <span class="fn">model</span>(ids, mask)
        loss = <span class="fn">loss_fn</span>(logits, y)
        loss.<span class="fn">backward</span>()
        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
        opt.<span class="fn">step</span>(); sched.<span class="fn">step</span>()
        train_loss += loss.<span class="fn">item</span>()
    train_loss /= <span class="fn">len</span>(train_loader)
    val_loss, val_acc = <span class="fn">evaluate</span>(val_loader)
    history.<span class="fn">append</span>((train_loss, val_loss, val_acc))
    <span class="fn">print</span>(f<span class="str">"epoch {epoch+1}: train={train_loss:.4f}  val={val_loss:.4f}  acc={val_acc:.3f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">End-to-end text classifier with sklearn -- the same conceptual pipeline a torch training loop builds, but in 8 lines.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)
pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=2000, ngram_range=(1,2))),
    ('clf', LogisticRegression(max_iter=500, C=1.0)),
])
pipe.fit(X_tr, y_tr)
print(classification_report(y_te, pipe.predict(X_te), digits=3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up Dataset, collate_fn, and DataLoaders exactly as in Lesson 4 -- variable-length token IDs padded per batch with attention masks. 2) Defines a small embedding+MLP classifier that mean-pools tokens with the mask, exactly the architecture from Lesson 3. 3) Instantiates the model on the appropriate device, an AdamW optimizer with weight decay, and a cosine LR schedule that runs for 10 epochs * steps_per_epoch total steps. 4) The <code>evaluate</code> function runs in <code>eval()</code> mode with <code>no_grad</code>, computing loss and accuracy on the validation set; switches the model back to <code>train()</code> at the end. 5) The training loop is the canonical 5-line core (zero-forward-loss-backward-step) plus gradient clipping and the scheduler; we accumulate train loss for logging and call evaluate after each epoch. 6) Per-epoch printout gives you the standard three numbers: training loss going down, validation loss going down (until it does not), validation accuracy going up.</p>

<div id="plot-pl5-curves-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A typical training run for 30 epochs on a small text classifier. Training loss (gold) drops monotonically as the model fits the data. Validation loss (cyan) drops at first then bottoms out around epoch 12 -- after which it would creep up if we kept training, the textbook overfitting signature. The right curve to watch is validation; train alone tells you nothing about generalization.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Diagnosing a Training Run</h2>

<p class="l-text">When training does not work, the first task is to read the curves. Here is a quick diagnostic guide and the takeaways for the lesson.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Symptom: loss is NaN</div><div class="compare-item">Learning rate too high</div><div class="compare-item">Exploding gradient (no clipping)</div><div class="compare-item">Bad input: NaN or inf in data</div><div class="compare-item">Loss applied to wrong shape</div><div class="compare-item">Fix: clip grads, lower LR, sanitize inputs</div></div>
<div class="compare-col"><div class="compare-title">Symptom: loss flat</div><div class="compare-item">Learning rate too low</div><div class="compare-item">Forgot zero_grad (gradients accumulate)</div><div class="compare-item">Wrong loss function for the task</div><div class="compare-item">Model is broken (e.g. detached output)</div><div class="compare-item">Fix: 10x LR, check zero_grad, verify dtype</div></div>
</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Symptom: train ↓, val ↑</div><div class="compare-item">Overfitting</div><div class="compare-item">Model too large for data</div><div class="compare-item">Not enough regularization</div><div class="compare-item">Fix: dropout, weight decay, early stop, more data</div></div>
<div class="compare-col"><div class="compare-title">Symptom: val acc stuck at random</div><div class="compare-item">Labels reversed?</div><div class="compare-item">Wrong loss (e.g. softmax then CE)</div><div class="compare-item">Trivial baseline issue (always one class)</div><div class="compare-item">Fix: print a batch of preds + labels, check loss curve</div></div>
</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> The training loop is 5 lines: zero_grad, forward, loss, backward, step. Internalize the rhythm.<br><strong>2.</strong> Loss = MSE for regression, CrossEntropyLoss (with raw logits) for multi-class, BCEWithLogitsLoss for binary/multi-label.<br><strong>3.</strong> Optimizer: AdamW for transformers, SGD+momentum for ResNets and very large models. lr is the most important hyperparameter.<br><strong>4.</strong> Use a scheduler -- OneCycleLR or CosineAnnealing with linear warmup is the modern default.<br><strong>5.</strong> Always evaluate on a held-out validation set; use <code>model.eval()</code> + <code>torch.no_grad()</code>.<br><strong>6.</strong> Add gradient clipping and exclude bias/norm from weight decay -- the two highest-impact tricks per line of code.<br><strong>7.</strong> Early stop when val loss stops improving; you save compute and avoid overfitting.<br><strong>8.</strong> Next lesson: convolutional networks, with a brief NLP detour into 1D Conv text classifiers.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid: 'rgba(255,255,255,0.06)',
    zero: 'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:60,r:30,b:60,l:60}};

  function optPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var steps = []; for (var i=0;i<200;i++) steps.push(i);
    function curve(decay, jitter, seed) {
      var s = seed; var v = 2.0; var out = [];
      for (var i=0;i<200;i++){
        s = (s*9301+49297)%233280;
        v = v*decay + (s/233280-0.5)*jitter;
        if (v<0.1) v = 0.1;
        out.push(v);
      }
      return out;
    }
    var sgd = curve(0.992, 0.05, 1);
    var mom = curve(0.985, 0.02, 7);
    var adm = curve(0.97, 0.01, 13);
    var t1 = {x:steps, y:sgd, mode:'lines', type:'scatter', name:'SGD', line:{color:'#f87171',width:2}};
    var t2 = {x:steps, y:mom, mode:'lines', type:'scatter', name:'SGD+Momentum', line:{color:'#4ecdc4',width:2}};
    var t3 = {x:steps, y:adm, mode:'lines', type:'scatter', name:'Adam', line:{color:T.accent,width:2.5}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Optimizer Karşılaştırması (Kayıp Eğrileri)':'Optimizer Comparison (Loss Curves)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'adım':'step', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'kayıp':'loss', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2,t3], layout, {responsive:true, displayModeBar:false});
  }

  function schedPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var steps = []; for (var i=0;i<1000;i++) steps.push(i);
    var step_lr = steps.map(function(s){
      if (s<300) return 1.0;
      if (s<600) return 0.5;
      if (s<900) return 0.25;
      return 0.125;
    });
    var cos_lr = steps.map(function(s){return 0.5*(1+Math.cos(Math.PI*s/1000));});
    var oc_lr = steps.map(function(s){
      if (s<100) return s/100;
      var t = (s-100)/900;
      return 0.5*(1+Math.cos(Math.PI*t));
    });
    var t1 = {x:steps, y:step_lr, mode:'lines', type:'scatter', name:'StepLR', line:{color:'#f87171',width:2}};
    var t2 = {x:steps, y:cos_lr, mode:'lines', type:'scatter', name:'CosineAnnealing', line:{color:'#4ecdc4',width:2}};
    var t3 = {x:steps, y:oc_lr, mode:'lines', type:'scatter', name:'OneCycleLR', line:{color:T.accent,width:2.5}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Öğrenme Oranı Çizelgeleri':'Learning Rate Schedules', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'adım':'step', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'lr (göreli)':'lr (relative)', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2,t3], layout, {responsive:true, displayModeBar:false});
  }

  function curvesPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var epochs = []; for (var i=1;i<=30;i++) epochs.push(i);
    var train = epochs.map(function(e){return Math.max(0.05, 0.7*Math.exp(-e/8) + 0.04 + (Math.random()-0.5)*0.02);});
    var val = epochs.map(function(e){
      if (e<13) return Math.max(0.15, 0.7*Math.exp(-e/9) + 0.13 + (Math.random()-0.5)*0.03);
      return 0.20 + (e-13)*0.012 + (Math.random()-0.5)*0.02;
    });
    var t1 = {x:epochs, y:train, mode:'lines+markers', type:'scatter', name:lang==='tr'?'eğitim kaybı':'train loss', line:{color:T.accent,width:2.5}, marker:{size:6}};
    var t2 = {x:epochs, y:val, mode:'lines+markers', type:'scatter', name:lang==='tr'?'doğrulama kaybı':'val loss', line:{color:'#4ecdc4',width:2.5}, marker:{size:6}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Eğitim Eğrileri (overfit göstergesi 13. epoch civarı)':'Training Curves (overfit signature ~epoch 13)', font:{color:T.text,size:14}},
      xaxis:{title:'epoch', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'kayıp':'loss', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2], layout, {responsive:true, displayModeBar:false});
  }

  optPlot('plot-pl5-optimizers-en','en');
  schedPlot('plot-pl5-schedulers-en','en');
  curvesPlot('plot-pl5-curves-en','en');
  optPlot('plot-pl5-optimizers-tr','tr');
  schedPlot('plot-pl5-schedulers-tr','tr');
  curvesPlot('plot-pl5-curves-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Eğitim döngüsü her PyTorch modelinin kalp atışıdır.</strong> Bir Module ve bir DataLoader'ınız olduğunda, veriyi eğitilmiş bir modele dönüştüren döngü şaşırtıcı derecede kısadır -- özünde beş satır. Derinlik her satırın ne yaptığını, neden kullandığımız kayıp fonksiyonlarını ve optimizer'ları kullandığımızı ve eğitimin ne zaman yanlış gittiğini nasıl tanıyacağımızı anlamaktan gelir.</p>

<p class="l-text">Bu ders kayıp fonksiyonlarını (MSE, CrossEntropy, BCE), optimizer'ları (SGD, Momentum, Adam, AdamW), öğrenme oranı schedule'larını ve uçtan uca standart eğitim döngüsünü kapsar. Sonunda sıfırdan gerçek bir metin sınıflandırıcısı eğitecek ve kayıp eğrilerinin sıfıra doğru büküldüğünü izleyeceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Kanonik 5 satırlık PyTorch eğitim adımını yazmayı (zero_grad, forward, loss, backward, step)</li>
<li>Göreve uygun loss seçmeyi: <code>MSELoss</code>, <code>CrossEntropyLoss</code>, <code>BCEWithLogitsLoss</code></li>
<li>Optimizer'ları kıyaslamayı: SGD vs Momentum vs Adam vs AdamW ve learning rate ayarlamayı</li>
<li><code>StepLR</code>, <code>CosineAnnealingLR</code> gibi LR scheduler'ları ve linear decay ile warmup kullanmayı</li>
<li>Gerçek bir metin sınıflandırıcısını eğitmeyi ve epoch başına loss/accuracy eğrilerini çizmeyi</li>
<li>Iraksayan veya sıkışan eğitimi fark etmeyi ve düzeltmeleri (gradient clipping, daha düşük LR) uygulamayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Beş Satırlık Eğitim Döngüsü</h2>

<p class="l-text">Geri kalan her şeyi sıyırın ve bir PyTorch eğitim adımı tam olarak beş satırdır. Bu ritmi içselleştirin ve her daha sofistike trainer (HuggingFace Trainer, PyTorch Lightning) aynı çekirdek etrafında sadece süslemedir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(num_epochs):
    <span class="kw">for</span> x, y <span class="kw">in</span> loader:
        optimizer.<span class="fn">zero_grad</span>()       <span class="cm"># 1) eski gradyanları temizle</span>
        logits = <span class="fn">model</span>(x)           <span class="cm"># 2) ileri geçiş</span>
        loss = <span class="fn">loss_fn</span>(logits, y)   <span class="cm"># 3) skaler kaybı hesapla</span>
        loss.<span class="fn">backward</span>()             <span class="cm"># 4) autograd ile gradyanları hesapla</span>
        optimizer.<span class="fn">step</span>()            <span class="cm"># 5) gradyan iniş güncellemesini uygula</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Beş satırlık PyTorch eğitim döngüsü şuna iner: ileri, kayıp, gradyan, adım, tekrarla. Tam olarak bunu NumPy ile lojistik regresyonda yapıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
X = rng.standard_normal((200, 3))
y = (X[:, 0] - X[:, 1] + 0.5 * X[:, 2] > 0).astype(float)

w = np.zeros(3)
b = 0.0
lr = 0.5

for epoch in range(20):
    z    = X @ w + b               # forward
    p    = 1 / (1 + np.exp(-z))
    loss = -(y * np.log(p+1e-9) + (1-y) * np.log(1-p+1e-9)).mean()
    dz   = (p - y) / X.shape[0]    # gradient
    w   -= lr * (X.T @ dz)         # step
    b   -= lr * dz.sum()
    if epoch % 5 == 0:
        print(f'epoch {epoch:2d}  loss {loss:.4f}  acc {(p>0.5==y).mean():.3f}')

print('final w:', w.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>optimizer.zero_grad()</code> her parametrenin <code>.grad</code>'ını sıfırlar -- onsuz, önceki batch'in gradyanları birikirdi. 2) <code>model(x)</code> ileri geçişi çalıştırır; autograd burada her işlemi grafiğe kaydeder. 3) <code>loss_fn(logits, y)</code> tahminleri hedeflerle karşılaştırır, skaler kayıp döner; kayıp fonksiyon seçimi göreve bağlıdır. 4) <code>loss.backward()</code> kaydedilen grafiği kayıptan her parametreye geri dolaşır, <code>.grad</code>'ı doldurur. 5) <code>optimizer.step()</code> her parametrede <code>.grad</code>'ı okur ve parametreleri kayıbı azaltma yönüne itmek için bir güncelleme kuralı (SGD, Adam vb.) uygular.</p>

<div class="calc-highlight"><strong>Eğitim döngüsünün iki iç içe katmanı vardır:</strong> <em>epoch'lar</em> (veri seti üzerinde tam geçişler) ve <em>adımlar</em> (adım başına bir batch). Batch boyutu 32 olan 50k örneklik veri setinde bir epoch yaklaşık 1500 adımdır. Veri seti boyutuna ve model kapasitesine bağlı olarak genellikle 3-30 epoch eğitirsiniz.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">epoch</div><div class="card-body">Eğitim verisi üzerinde tam bir geçiş. Geleneksel olarak eğitim süresinin nasıl ölçüldüğü.</div></div>
<div class="calc-card"><div class="card-title">step / iterasyon</div><div class="card-body">Bir batch üzerinde bir ileri + geri + optimizer adımı. İç döngü birimi.</div></div>
<div class="calc-card"><div class="card-title">batch_size</div><div class="card-body">Adım başına kaç örnek. Daha büyük = daha pürüzsüz gradyanlar, daha fazla bellek, epoch başına daha az adım.</div></div>
<div class="calc-card"><div class="card-title">loss</div><div class="card-body">Modelin bu batch'te ne kadar yanlış olduğunun skaler ölçüsü. Daha düşük = daha iyi.</div></div>
<div class="calc-card"><div class="card-title">gradyan</div><div class="card-body">Her parametre için <code>dLoss/dParameter</code>. <code>backward()</code> ile hesaplanır.</div></div>
<div class="calc-card"><div class="card-title">güncelleme</div><div class="card-body">Her adımda parametrelere uygulanan değişim. Gradyan ve optimizer kuralı tarafından yönlendirilir.</div></div>
</div>

<div class="think-box"><div class="think-label">zero_grad'i ATLAMAYIN</div><div class="think-body"><code>optimizer.zero_grad()</code>'i unutmak başlangıç PyTorch kodundaki en yaygın hatadır. Belirti: eğitim kaybı düşmeye devam eder... ve düşer... ama doğruluk rastgele kalır. Olan: gradyanlar her batch'ten birikir, çılgınca büyür ve güncellemeler büyük ama çoğunlukla yanlış yön olur. Her zaman <code>step()</code>'i <code>zero_grad()</code> ile eşleyin.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Kayıp Fonksiyonları: MSE, CrossEntropy, BCE</h2>

<p class="l-text">Kayıp fonksiyonu modelin çıktısını ve hedefi tek bir sayıya dönüştürür. Seçim tamamen göreve bağlıdır: regresyon, çok sınıflı sınıflandırma veya çoklu etiket / ikili sınıflandırma.</p>

<div class="katex-block">$$L_{\\text{MSE}} = \\frac{1}{N}\\sum_{i=1}^{N}(\\hat{y}_i - y_i)^2$$</div>

<div class="katex-block">$$L_{\\text{CE}} = -\\frac{1}{N}\\sum_{i=1}^{N}\\sum_{c=1}^{C} y_{i,c}\\log\\hat{p}_{i,c}, \\quad \\hat{p}_{i,c} = \\frac{e^{z_{i,c}}}{\\sum_{c'}e^{z_{i,c'}}}$$</div>

<div class="katex-block">$$L_{\\text{BCE}} = -\\frac{1}{N}\\sum_{i=1}^{N}\\bigl[y_i\\log\\sigma(z_i) + (1-y_i)\\log(1-\\sigma(z_i))\\bigr]$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">y_hat / y</div><div class="card-body">Tahmin ve hedef. Regresyon için sürekli, CE için tamsayı sınıf, BCE için ikili.</div></div>
<div class="calc-card"><div class="card-title">N</div><div class="card-body">Batch boyutu; varsayılan olarak kayıp batch üzerinde ortalanır. Toplam için <code>reduction="sum"</code> kullanın.</div></div>
<div class="calc-card"><div class="card-title">C</div><div class="card-body">Cross-entropy için sınıf sayısı. C=2 ikili; C=10 rakam sınıflandırma.</div></div>
<div class="calc-card"><div class="card-title">z (logits)</div><div class="card-body">Softmax/sigmoid'den önce ham çıktılar. PyTorch'un CE/BCE-with-logits'i bunları doğrudan bekler.</div></div>
<div class="calc-card"><div class="card-title">p_hat</div><div class="card-body">Softmax (CE) veya sigmoid (BCE) sonrası tahmin edilen olasılık.</div></div>
<div class="calc-card"><div class="card-title">- log p</div><div class="card-body">Negatif log olabilirlik. Belirsiz olanlardan çok daha fazla emin yanlış tahminleri cezalandırır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

<span class="cm"># 1) MSE -- regresyon</span>
mse = nn.<span class="fn">MSELoss</span>()
y_hat = torch.<span class="fn">tensor</span>([<span class="num">2.5</span>, <span class="num">0.0</span>, <span class="num">2.0</span>])
y     = torch.<span class="fn">tensor</span>([<span class="num">3.0</span>, -<span class="num">0.5</span>, <span class="num">2.0</span>])
<span class="fn">print</span>(<span class="fn">mse</span>(y_hat, y).<span class="fn">item</span>())     <span class="cm"># 0.0833... = ((0.5)^2 + (0.5)^2 + 0)/3</span>

<span class="cm"># 2) CrossEntropy -- çok sınıflı sınıflandırma</span>
<span class="cm"># ÖNEMLİ: ham LOGIT alır, olasılık değil (içsel olarak softmax uygular)</span>
ce = nn.<span class="fn">CrossEntropyLoss</span>()
logits = torch.<span class="fn">tensor</span>([[<span class="num">2.0</span>, <span class="num">1.0</span>, <span class="num">0.1</span>],
                       [<span class="num">0.5</span>, <span class="num">0.5</span>, <span class="num">3.0</span>]])
labels = torch.<span class="fn">tensor</span>([<span class="num">0</span>, <span class="num">2</span>])     <span class="cm"># int64 sınıf indeksleri, one-hot DEĞİL</span>
<span class="fn">print</span>(<span class="fn">ce</span>(logits, labels).<span class="fn">item</span>())  <span class="cm"># ~0.55</span>

<span class="cm"># 3) BCE-with-logits -- ikili veya çoklu etiket</span>
<span class="cm"># ham logit alır ve içsel olarak sigmoid uygular; sayısal olarak kararlı</span>
bce = nn.<span class="fn">BCEWithLogitsLoss</span>()
logits_bin = torch.<span class="fn">tensor</span>([<span class="num">2.0</span>, -<span class="num">1.5</span>, <span class="num">0.5</span>])
targets    = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">0.0</span>, <span class="num">1.0</span>])    <span class="cm"># float, 0 veya 1</span>
<span class="fn">print</span>(<span class="fn">bce</span>(logits_bin, targets).<span class="fn">item</span>())

<span class="cm"># 4) Sınıf ağırlıklı cross-entropy -- dengesiz sınıflar için</span>
class_weights = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">5.0</span>])    <span class="cm"># sınıf 1 daha nadir, ağırlık daha yüksek</span>
ce_w = nn.<span class="fn">CrossEntropyLoss</span>(weight=class_weights)

<span class="cm"># 5) ignore_index ile cross-entropy -- NLP'de padding token'ları atla</span>
ce_ig = nn.<span class="fn">CrossEntropyLoss</span>(ignore_index=-<span class="num">100</span>)
seq_logits = torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">6</span>, <span class="num">30000</span>)         <span class="cm"># (B, T, V)</span>
seq_labels = torch.<span class="fn">tensor</span>([[<span class="num">5</span>, <span class="num">12</span>, <span class="num">89</span>, -<span class="num">100</span>, -<span class="num">100</span>, -<span class="num">100</span>],
                           [<span class="num">3</span>, <span class="num">7</span>,  -<span class="num">100</span>, -<span class="num">100</span>, -<span class="num">100</span>, -<span class="num">100</span>],
                           [<span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, -<span class="num">100</span>],
                           [<span class="num">2</span>, <span class="num">4</span>, <span class="num">6</span>, <span class="num">8</span>, <span class="num">10</span>, <span class="num">12</span>]])
loss = <span class="fn">ce_ig</span>(seq_logits.<span class="fn">reshape</span>(-<span class="num">1</span>, <span class="num">30000</span>), seq_labels.<span class="fn">reshape</span>(-<span class="num">1</span>))
<span class="fn">print</span>(loss.<span class="fn">item</span>())</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">MSE, BCE ve CrossEntropy formüllerden uygulanmış -- torch.nn.MSELoss, BCELoss ve CrossEntropyLoss'un döndürdüğü sayıların aynısı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Regression: MSE
y_true_r = np.array([1.0, 2.0, 3.0])
y_pred_r = np.array([1.1, 1.9, 2.7])
mse = ((y_true_r - y_pred_r) ** 2).mean()

# Binary: BCE
y_true_b = np.array([1.0, 0.0, 1.0, 1.0])
y_pred_b = np.array([0.9, 0.2, 0.8, 0.4])
bce = -(y_true_b * np.log(y_pred_b+1e-9) + (1-y_true_b) * np.log(1-y_pred_b+1e-9)).mean()

# Multi-class: CrossEntropy from logits
logits = np.array([[2.0, 1.0, 0.1],
                   [0.5, 2.5, 0.3]])
labels = np.array([0, 1])
exp = np.exp(logits - logits.max(axis=1, keepdims=True))
probs = exp / exp.sum(axis=1, keepdims=True)
ce = -np.log(probs[np.arange(len(labels)), labels] + 1e-9).mean()

print(f'MSE         : {mse:.4f}')
print(f'BCE         : {bce:.4f}')
print(f'CrossEntropy: {ce:.4f}')</code></pre></div>
</div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) MSE: batch üzerinde ortalanan kareli fark -- standart regresyon kaybı. 2) CrossEntropy: ham logit alır (olasılık DEĞİL, softmax çıktıları değil), içsel olarak log-softmax uygular, sonra negatif log olabilirlik hesaplar. Hedefler tamsayı sınıf indeksleri olmalı, one-hot vektörler değil. Bu başlangıç için bir numaralı karışıklık. 3) BCEWithLogitsLoss: ikili/çoklu etiket için eşdeğer; ham logit alır, içsel olarak sigmoid uygular. Sayısal kararlılık için her zaman bunu <code>BCELoss + sigmoid</code>'a tercih edin. 4) Sınıf ağırlıkları, dengesizlikle savaşmak için kaybı yeniden ağırlıklandırır: nadir bir sınıf daha yüksek ağırlık alır böylece gradyan ona daha fazla dikkat eder. 5) <code>ignore_index=-100</code> NLP için zorunludur, padding token'ları -100 etiketi alır ve kayıptan atlanır. Reshape, batch ve zamanı tek bir boyutta sıkıştırır çünkü CE 2 boyutlu logit bekler.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">CrossEntropyLoss</div><div class="compare-item">Çok sınıflı tek etiket</div><div class="compare-item">Hedefler: int64 sınıf indeksleri</div><div class="compare-item">Girdi: ham logit (B, C)</div><div class="compare-item">İçsel: log_softmax + NLL</div><div class="compare-item">Duygu, konu, sınıflandırma başlıkları için kullan</div></div>
<div class="compare-col"><div class="compare-title">BCEWithLogitsLoss</div><div class="compare-item">İkili veya çoklu etiket</div><div class="compare-item">Hedefler: float 0/1, logitlerle aynı şekil</div><div class="compare-item">Girdi: ham logit (B,) veya (B, K)</div><div class="compare-item">İçsel: sigmoid + BCE</div><div class="compare-item">Etiket tahmini, çoklu etiket sınıflandırma için kullan</div></div>
</div>

<div class="l-warn"><strong>Tuzak:</strong> Model çıktınıza CrossEntropyLoss'a geçirmeden önce asla softmax uygulamayın. Kayıp ham logit bekler ve softmax'i kendisi uygular. İki kez softmax uygularsanız gradyanlar çok küçük olur ve eğitim takılır.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Optimizer'lar: SGD, Momentum, Adam, AdamW</h2>

<p class="l-text">Optimizer gradyanları okur ve parametreleri günceller. Güncelleme kuralı optimizer'lar arasındaki farktır; seçim eğitim hızı ve son kalite üzerinde büyük etkiye sahiptir.</p>

<div class="katex-block">$$\\text{SGD: } \\theta_{t+1} = \\theta_t - \\eta\\,g_t$$</div>

<div class="katex-block">$$\\text{Momentum: } v_t = \\mu v_{t-1} + g_t, \\quad \\theta_{t+1} = \\theta_t - \\eta\\,v_t$$</div>

<div class="katex-block">$$\\text{Adam: } m_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t, \\;\\; v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2, \\;\\; \\theta_{t+1} = \\theta_t - \\eta\\,\\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t}+\\varepsilon}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">theta</div><div class="card-body">Optimize edilen parametre.</div></div>
<div class="calc-card"><div class="card-title">eta</div><div class="card-body">Öğrenme oranı. En önemli hiperparametre. Tipik: Adam için 1e-3, SGD için 1e-2.</div></div>
<div class="calc-card"><div class="card-title">g_t</div><div class="card-body">t adımındaki gradyan.</div></div>
<div class="calc-card"><div class="card-title">v_t (Momentum)</div><div class="card-body">Hız: gradyanların üstel hareketli ortalaması. Yörüngeyi pürüzsüzleştirir.</div></div>
<div class="calc-card"><div class="card-title">m_t / v_t (Adam)</div><div class="card-body">Gradyanın birinci ve ikinci momentleri. Adam bunları kullanarak parametre başına adım uyarlar.</div></div>
<div class="calc-card"><div class="card-title">beta_1, beta_2</div><div class="card-body">Sönüm oranları: varsayılan 0.9 ve 0.999. Neredeyse hiç ayarlanmaz.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

model = nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">2</span>)

<span class="cm"># 1) Düz SGD</span>
opt = torch.optim.<span class="fn">SGD</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">0.01</span>)

<span class="cm"># 2) Momentumlu SGD (neredeyse her zaman düz SGD'den daha iyi)</span>
opt = torch.optim.<span class="fn">SGD</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">0.01</span>, momentum=<span class="num">0.9</span>)

<span class="cm"># 3) Adam -- adaptif, çoğu NLP/transformer işi için varsayılan</span>
opt = torch.optim.<span class="fn">Adam</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>, betas=(<span class="num">0.9</span>, <span class="num">0.999</span>))

<span class="cm"># 4) AdamW -- doğru ayrılmış weight decay'li Adam (transformer'lar için tercih edilen)</span>
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>, weight_decay=<span class="num">0.01</span>)

<span class="cm"># 5) Parametre grubu başına farklı öğrenme oranları</span>
<span class="cm"># İnce ayarda yaygın kalıp: önceden eğitilmiş için küçük LR, yeni başlık için daha büyük</span>
opt = torch.optim.<span class="fn">AdamW</span>([
    {<span class="str">"params"</span>: model.weight, <span class="str">"lr"</span>: <span class="num">1e-5</span>},
    {<span class="str">"params"</span>: model.bias,   <span class="str">"lr"</span>: <span class="num">1e-3</span>},
], weight_decay=<span class="num">0.01</span>)

<span class="cm"># Bir optimizer adımının anatomisi</span>
loss = (<span class="fn">model</span>(torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">10</span>)) ** <span class="num">2</span>).<span class="fn">mean</span>()
loss.<span class="fn">backward</span>()
<span class="fn">print</span>(<span class="str">"adımdan önce, weight.mean():"</span>, model.weight.<span class="fn">mean</span>().<span class="fn">item</span>())
opt.<span class="fn">step</span>()
<span class="fn">print</span>(<span class="str">"adımdan sonra,  weight.mean():"</span>, model.weight.<span class="fn">mean</span>().<span class="fn">item</span>())
opt.<span class="fn">zero_grad</span>()</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">SGD vs SGD+momentum vs Adam -- kuadratik kayıpta elle kodlanarak momentum ve adaptif lr'nin neden daha hızlı yakınsadığı gösterilir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Loss: L(w) = sum w_i^2 with very different curvatures
def grad(w): return np.array([2 * w[0], 20 * w[1]])
w_init = np.array([4.0, 4.0])

def sgd():
    w, lr = w_init.copy(), 0.05
    for _ in range(40):
        w -= lr * grad(w)
    return w

def sgd_mom():
    w, lr, beta = w_init.copy(), 0.05, 0.9
    v = np.zeros_like(w)
    for _ in range(40):
        v = beta * v + grad(w)
        w -= lr * v
    return w

def adam():
    w, lr = w_init.copy(), 0.5
    m = np.zeros_like(w); v = np.zeros_like(w)
    b1, b2, eps = 0.9, 0.999, 1e-8
    for t in range(1, 41):
        g = grad(w)
        m = b1*m + (1-b1)*g
        v = b2*v + (1-b2)*g*g
        m_hat = m / (1 - b1**t); v_hat = v / (1 - b2**t)
        w -= lr * m_hat / (np.sqrt(v_hat) + eps)
    return w

for name, w_final in [('SGD', sgd()), ('SGD+momentum', sgd_mom()), ('Adam', adam())]:
    dist = np.linalg.norm(w_final)
    print(f'{name:14s} after 40 steps: w={w_final.round(3)}, dist to opt={dist:.4f}')</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Düz SGD parametreleri <code>lr * grad</code> çıkararak günceller. Basit ama gürültülü kayıplarda yakınsaması yavaş. 2) Momentumlu SGD yörüngeyi pürüzsüzleştiren bir hız vektörü tutar; <code>momentum=0.9</code> evrensel varsayılandır. 3) Adam gradyanların çalışan varyansını kullanarak parametre başına öğrenme oranını uyarlar. Transformer ve NLP için varsayılan. 4) AdamW Adam'ın weight decay'inde ince bir hatayı düzeltir; transformer ince ayarı için AdamW artık standarttır. 5) Parametre grupları katman başına farklı hiperparametreler ayarlamanıza izin verir -- önceden eğitilmiş omurgada küçük LR ve taze sınıflandırıcı başlıkta daha büyük LR istediğiniz ince ayar için zorunludur. 6) Önce/sonra yazdırma optimizer'ı eylemde gösterir: <code>step()</code> parametreleri yerinde değiştirir; <code>zero_grad()</code> sonraki yineleme için grad tamponunu temizler.</p>

<div id="plot-pl5-optimizers-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Konveks olmayan oyuncak problemde SGD, SGD+momentum ve Adam için kayıp eğrileri. Düz SGD salınır ve yavaş yakınsar. Momentum pürüzsüzleştirir ve daha düşük kayba ulaşır. Adam parametre başına uyarlar ve en hızlı en düşük kayba ulaşır. Kalıp tipiktir: Adam çoğu NLP işi için kazanır, oysa SGD+momentum, Adam'ın bellek ek yükünün önemli olduğu ResNet'ler ve çok büyük modeller için tercih edilir.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: BERT ince ayarı için AdamW</div><div class="example-body">HuggingFace ince ayar betiklerinin %99'undaki tarif: <code>AdamW(model.parameters(), lr=2e-5, betas=(0.9, 0.999), eps=1e-8, weight_decay=0.01)</code>. Küçük LR (2e-5 ile 5e-5) önceden eğitilmiş özelliklerin felaket unutulmasını önler; weight decay düzenler; AdamW bias ve LayerNorm parametrelerini etkilemeden weight decay'i doğru yönetir.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Öğrenme Oranı Çizelgeleri</h2>

<p class="l-text">Sabit bir öğrenme oranı nadiren optimaldir. Çoğu modern eğitim bir çizelge kullanır: başlangıçta LR'yi lineer olarak ısıtın (erken gradyanlar modeli istikrarsızlaştırmasın diye), sonra zamanla söndürün (sonraki güncellemeler daha küçük, daha rafine düzeltmeler yapsın diye).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.optim.lr_scheduler <span class="kw">import</span> StepLR, CosineAnnealingLR, OneCycleLR, LambdaLR

model = nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">2</span>)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)

<span class="cm"># 1) StepLR: her step_size epoch'ta LR'yi gamma kadar düşür</span>
sched = <span class="fn">StepLR</span>(opt, step_size=<span class="num">10</span>, gamma=<span class="num">0.5</span>)
<span class="cm"># Epoch 0-9: lr=1e-3; 10-19: lr=5e-4; 20-29: lr=2.5e-4; ...</span>

<span class="cm"># 2) CosineAnnealingLR: T_max adım üzerinde pürüzsüz cosinus sönümü</span>
sched = <span class="fn">CosineAnnealingLR</span>(opt, T_max=<span class="num">100</span>, eta_min=<span class="num">1e-6</span>)

<span class="cm"># 3) OneCycleLR: warmup + cosinus söndürme (birçok görev için son teknoloji)</span>
sched = <span class="fn">OneCycleLR</span>(opt, max_lr=<span class="num">1e-3</span>, total_steps=<span class="num">1000</span>,
                   pct_start=<span class="num">0.1</span>,         <span class="cm"># %10 warmup</span>
                   anneal_strategy=<span class="str">"cos"</span>)

<span class="cm"># 4) Özel fonksiyonlu LambdaLR -- maksimum esnek</span>
<span class="kw">def</span> <span class="fn">warmup_then_constant</span>(step):
    <span class="kw">if</span> step &lt; <span class="num">100</span>:
        <span class="kw">return</span> step / <span class="num">100.0</span>
    <span class="kw">return</span> <span class="num">1.0</span>
sched = <span class="fn">LambdaLR</span>(opt, lr_lambda=warmup_then_constant)

<span class="cm"># Standart kullanım: eğitim adımı başına BİR KEZ sched.step() çağır (veya epoch başına, dokümana bak)</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2</span>):
    <span class="kw">for</span> batch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
        opt.<span class="fn">zero_grad</span>()
        <span class="cm"># ... loss = ... ; loss.backward()</span>
        opt.<span class="fn">step</span>()
        sched.<span class="fn">step</span>()                           <span class="cm"># çoğu scheduler adım başına ister</span>
    <span class="fn">print</span>(f<span class="str">"epoch {epoch}, lr = {sched.get_last_lr()[0]:.2e}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">LR çizelgeleri = adım sayısının basit matematik fonksiyonu. Step, cosine ve warmup çizelgelerinin her biri 5 satırda.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

base_lr = 0.1
n_steps = 100

# Step decay every 30 steps, gamma 0.5
step_lr   = [base_lr * (0.5 ** (s // 30)) for s in range(n_steps)]
# Cosine annealing
cos_lr    = [base_lr * 0.5 * (1 + np.cos(np.pi * s / n_steps)) for s in range(n_steps)]
# Linear warmup over 10 steps then constant
warmup_lr = [base_lr * min(1.0, (s+1) / 10) for s in range(n_steps)]

print('step  step_lr   cos_lr   warmup_lr')
for s in (0, 5, 10, 30, 50, 90):
    print(f'{s:3d}  {step_lr[s]:.4f}  {cos_lr[s]:.4f}   {warmup_lr[s]:.4f}')</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>StepLR</code> her <code>step_size</code> epoch'ta LR'yi <code>gamma</code> faktörü kadar düşürür -- klasik görüntü sınıflandırmada kullanılan en basit çizelge. 2) <code>CosineAnnealingLR</code> başlangıç değerinden <code>eta_min</code>'e kadar bir kosinüs eğrisi izleyerek LR'yi söndürür; pürüzsüz ve parametresiz. 3) <code>OneCycleLR</code> bir warmup aşamasını cosinus söndürmesiyle birleştirir; <code>pct_start=0.1</code> eğitimin ilk %10'unun warmup olduğu anlamına gelir. Bu çoğu modern ince ayarda kullanılan çizelgedir. 4) Özel fonksiyonlu <code>LambdaLR</code> size tam kontrol verir; HuggingFace'in <code>get_linear_schedule_with_warmup</code>'ı bu şekilde uygulanmıştır. 5) Eğitim döngüsü <code>optimizer.step()</code>'ten sonra <code>scheduler.step()</code>'i çağırır; çoğu scheduler için bu eğitim adımı başına bir kez olmalıdır (epoch başına değil). Docstring'i kontrol edin -- bazı eski scheduler'lar epoch başına bekler.</p>

<div id="plot-pl5-schedulers-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> 1000 eğitim adımı üzerinde üç yaygın LR çizelgesi. StepLR LR'yi sabit aralıklarla keskin şekilde düşürür. CosineAnnealing pürüzsüzce söndürür. OneCycleLR ilk %10 adımda lineer olarak <code>max_lr</code>'ye ısınır, sonra kosinüs aracılığıyla söndürür. "Warmup" parçası büyük erken güncellemelerin modeli istikrarsızlaştırmasını önler -- LayerNorm ölçek parametrelerinin yerleşmek için birkaç yüz adım gerektirdiği transformer'lar için kritiktir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">StepLR</div><div class="card-body">Her N epoch'ta faktör kadar düşür. Basit, öngörülebilir. Görüntü sınıflandırma için klasik.</div></div>
<div class="calc-card"><div class="card-title">CosineAnnealingLR</div><div class="card-body">Pürüzsüz kosinüs sönümü. Ayar yok. NLP için sıklıkla en iyi.</div></div>
<div class="calc-card"><div class="card-title">OneCycleLR</div><div class="card-body">Warmup + kosinüs sönümü bir arada. İnce ayar için modern varsayılan.</div></div>
<div class="calc-card"><div class="card-title">ReduceLROnPlateau</div><div class="card-body">Doğrulama kaybı iyileşmeyi durdurduğunda LR düşür. Adaptif ama izleme gerektirir.</div></div>
<div class="calc-card"><div class="card-title">LinearLR / ConstantLR</div><div class="card-body">Lineer warmup veya sabit tut; <code>SequentialLR</code>'in yapı taşları olarak kullan.</div></div>
<div class="calc-card"><div class="card-title">LambdaLR</div><div class="card-body">Özel fonksiyon. Yerleşik çizelge uymadığında kullan.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Doğrulama, Metrikler ve Erken Durdurma</h2>

<p class="l-text">Eğitim kaybı tek başına yeterli değildir. Modelinizin genelleştirip genelleştirmediğini bilmek için ayrılmış veri üzerinde değerlendirmeniz gerekir. Doğrulama döngüsü gradyansız <code>eval()</code> modunda çalışır, her batch'te kayıp ve metrikleri hesaplar sonra toplar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="at">@torch.no_grad</span>()
<span class="kw">def</span> <span class="fn">evaluate</span>(model, loader, device, loss_fn):
    model.<span class="fn">eval</span>()
    total_loss, total_correct, total_n = <span class="num">0.0</span>, <span class="num">0</span>, <span class="num">0</span>
    <span class="kw">for</span> batch <span class="kw">in</span> loader:
        x = batch[<span class="str">"input_ids"</span>].<span class="fn">to</span>(device)
        y = batch[<span class="str">"labels"</span>].<span class="fn">to</span>(device)
        mask = batch[<span class="str">"attention_mask"</span>].<span class="fn">to</span>(device)
        logits = <span class="fn">model</span>(x, mask)
        loss = <span class="fn">loss_fn</span>(logits, y)
        total_loss += loss.<span class="fn">item</span>() * y.<span class="fn">size</span>(<span class="num">0</span>)
        preds = logits.<span class="fn">argmax</span>(dim=-<span class="num">1</span>)
        total_correct += (preds == y).<span class="fn">sum</span>().<span class="fn">item</span>()
        total_n += y.<span class="fn">size</span>(<span class="num">0</span>)
    <span class="kw">return</span> {<span class="str">"loss"</span>: total_loss / total_n, <span class="str">"acc"</span>: total_correct / total_n}

<span class="cm"># Erken durdurma kalıbı</span>
<span class="kw">class</span> EarlyStopper:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, patience=<span class="num">3</span>, min_delta=<span class="num">0.0</span>):
        self.patience = patience
        self.min_delta = min_delta
        self.best = <span class="fn">float</span>(<span class="str">"inf"</span>)
        self.counter = <span class="num">0</span>
    <span class="kw">def</span> <span class="fn">step</span>(self, val_loss):
        <span class="kw">if</span> val_loss &lt; self.best - self.min_delta:
            self.best = val_loss
            self.counter = <span class="num">0</span>
            <span class="kw">return</span> <span class="kw">False</span>        <span class="cm"># durdurma, bu yeni bir en iyi</span>
        self.counter += <span class="num">1</span>
        <span class="kw">return</span> self.counter &gt;= self.patience

<span class="cm"># Kullanım</span>
stopper = <span class="fn">EarlyStopper</span>(patience=<span class="num">3</span>)
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
    <span class="cm"># ... bir epoch eğit ...</span>
    metrics = <span class="fn">evaluate</span>(model, val_loader, device, loss_fn)
    <span class="kw">if</span> stopper.<span class="fn">step</span>(metrics[<span class="str">"loss"</span>]):
        <span class="fn">print</span>(f<span class="str">"epoch {epoch}'ta erken durdurma"</span>)
        <span class="kw">break</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Doğrulama, metrikler, erken durdurma -- üçü de basit Python: her epoch val kaybını takip et, K epoch boyunca iyileşmediyse dur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X = df_iris.iloc[:, :4].values
y = df_iris.iloc[:, 4].astype('category').cat.codes.values
X_tr, X_va, y_tr, y_va = train_test_split(X, y, test_size=0.3, random_state=0)

clf = SGDClassifier(loss='log_loss', learning_rate='constant', eta0=0.05, random_state=0)
classes = np.unique(y_tr)

best_acc, patience, no_improve = -1, 5, 0
for epoch in range(40):
    clf.partial_fit(X_tr, y_tr, classes=classes)
    val_acc = accuracy_score(y_va, clf.predict(X_va))
    if val_acc > best_acc:
        best_acc = val_acc
        no_improve = 0
        marker = '  *best'
    else:
        no_improve += 1
        marker = ''
    if epoch % 5 == 0:
        print(f'epoch {epoch:2d}  val_acc={val_acc:.3f}{marker}')
    if no_improve >= patience:
        print(f'early stop at epoch {epoch}, best={best_acc:.3f}')
        break</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>@torch.no_grad()</code> dekoratörü fonksiyon içinde gradyan takibini devre dışı bırakır, bellek ve zaman tasarrufu sağlar. <code>model.eval()</code> dropout'u kapatır ve BatchNorm'a çalışan istatistikleri kullanmasını söyler. 2) Doğrulama döngüsü kaybı ve doğru sayıları biriktirir; batch'ler eşit olmadığında bile gerçek örnek başına ortalama almak için batch boyutuyla ağırlıklandırırız. 3) <code>preds = logits.argmax(dim=-1)</code> örnek başına en yüksek puanlı sınıfı seçer -- sınıflandırma metrikleri için standart "sert tahmin". 4) <code>EarlyStopper</code> en iyi doğrulama kaybını takip eder ve <code>patience</code> epoch boyunca iyileşmediğinde eğitimi durdurur. 5) Tam eğitim döngüsü her epoch'tan sonra <code>evaluate</code>'i çağırır ve durdurucuyu kontrol eder; bu, plato olan veya overfitmeye başlayan bir modelde hesaplama israfını önler.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: doğru metriği seçme</div><div class="example-body">Doğruluk varsayılandır ama dengesiz veride yanıltıcıdır. %95 pozitif sınıf için "her zaman pozitif" tahmini sıfır faydalı bilgiyle %95 doğruluk verir. Dengesiz ikili için <strong>F1 skor</strong>, dengesiz çok sınıflı için <strong>macro-F1</strong>, eşik önemli olduğunda <strong>AUROC</strong>, üretim için <strong>BLEU/ROUGE</strong> kullanın. Sklearn'ün <code>classification_report</code>'u dostunuzdur.</div></div>

<div class="l-warn"><strong>Tuzak (overfitting):</strong> Eğitim kaybı düşerken doğrulama kaybı tırmanmaya başlarsa overfitiyorsunuz demektir. Çözümler: daha fazla dropout, daha fazla weight decay, daha az epoch, daha fazla eğitim verisi, daha küçük model, erken durdurma. Doğrulama eğrisi overfit alarmınızdır.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Gradyan Kırpma ve Yaygın Hileler</h2>

<p class="l-text">Bir avuç hile modern eğitimde "araştırma"dan "varsayılan pratik"e taşınmıştır. Bunları tehlikenize atlayın.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

model = nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">2</span>)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="cm"># Hile 1: gradyan kırpma -- RNN/transformer'larda patlayan gradyanları önler</span>
<span class="kw">for</span> batch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
    opt.<span class="fn">zero_grad</span>()
    x = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">10</span>)
    y = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, (<span class="num">8</span>,))
    loss = <span class="fn">loss_fn</span>(<span class="fn">model</span>(x), y)
    loss.<span class="fn">backward</span>()
    <span class="cm"># Gradyanları küresel normları en fazla 1.0 olacak şekilde kırp</span>
    torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), max_norm=<span class="num">1.0</span>)
    opt.<span class="fn">step</span>()

<span class="cm"># Hile 2: bias ve LayerNorm için ayrı weight decay</span>
<span class="kw">def</span> <span class="fn">get_optimizer_groups</span>(model, weight_decay=<span class="num">0.01</span>):
    decay_params, no_decay_params = [], []
    <span class="kw">for</span> name, p <span class="kw">in</span> model.<span class="fn">named_parameters</span>():
        <span class="kw">if</span> <span class="kw">not</span> p.requires_grad: <span class="kw">continue</span>
        <span class="kw">if</span> name.<span class="fn">endswith</span>(<span class="str">".bias"</span>) <span class="kw">or</span> <span class="str">"norm"</span> <span class="kw">in</span> name.<span class="fn">lower</span>():
            no_decay_params.<span class="fn">append</span>(p)
        <span class="kw">else</span>:
            decay_params.<span class="fn">append</span>(p)
    <span class="kw">return</span> [
        {<span class="str">"params"</span>: decay_params,    <span class="str">"weight_decay"</span>: weight_decay},
        {<span class="str">"params"</span>: no_decay_params, <span class="str">"weight_decay"</span>: <span class="num">0.0</span>},
    ]
groups = <span class="fn">get_optimizer_groups</span>(model)
opt2 = torch.optim.<span class="fn">AdamW</span>(groups, lr=<span class="num">1e-3</span>)

<span class="cm"># Hile 3: büyük etkili batch boyutları için gradyan birikimi</span>
accum_steps = <span class="num">4</span>
opt.<span class="fn">zero_grad</span>()
<span class="kw">for</span> step, (x, y) <span class="kw">in</span> <span class="fn">enumerate</span>([(torch.<span class="fn">randn</span>(<span class="num">8</span>,<span class="num">10</span>), torch.<span class="fn">randint</span>(<span class="num">0</span>,<span class="num">2</span>,(<span class="num">8</span>,))) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>)]):
    loss = <span class="fn">loss_fn</span>(<span class="fn">model</span>(x), y) / accum_steps     <span class="cm"># ölçekle düşür</span>
    loss.<span class="fn">backward</span>()
    <span class="kw">if</span> (step + <span class="num">1</span>) % accum_steps == <span class="num">0</span>:
        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
        opt.<span class="fn">step</span>()
        opt.<span class="fn">zero_grad</span>()</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Gradyan kırpma gradyanın L2 normunu sınırlar -- burada elle uygulama, hilenin patlayan güncellemeleri nasıl engellediğini gösterir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def clip_grad_norm(grad, max_norm=1.0):
    n = np.linalg.norm(grad)
    if n > max_norm:
        return grad * (max_norm / n)
    return grad

# Simulate exploding gradient
grad = np.array([5.0, -8.0, 12.0])
print('original norm :', round(float(np.linalg.norm(grad)), 3))
clipped = clip_grad_norm(grad, max_norm=1.0)
print('clipped       :', clipped.round(3))
print('clipped norm  :', round(float(np.linalg.norm(clipped)), 3))

# Apply during one step
w = np.array([1.0, 1.0, 1.0])
lr = 0.1
w_no_clip   = w - lr * grad
w_with_clip = w - lr * clipped
print('w step no clip   :', w_no_clip.round(3),
      '  ||delta||=', round(float(np.linalg.norm(lr*grad)), 3))
print('w step with clip :', w_with_clip.round(3),
      '  ||delta||=', round(float(np.linalg.norm(lr*clipped)), 3))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>clip_grad_norm_</code> tüm gradyanları küresel L2 normları en fazla <code>max_norm</code> olacak şekilde yeniden ölçeklendirir. Bu RNN'lerde ve transformer eğitiminin erken adımlarında patlayan gradyanların neden olduğu felaket "kayıp NaN olur"u önler. 2) Optimizer grup kalıbı bias'ları ve LayerNorm parametrelerini weight decay'den dışlar -- onları decay etmek genellikle performansa zarar verir. Bu kalıp her HuggingFace ince ayar betiğinde vardır. 3) Gradyan birikimi küçük bir GPU'da büyük batch'i simüle eder: arada sıfırlamadan K küçük ileri+geri yapın, sonra bir kez adım atın ve sıfırlayın. Kayıp <code>1/accum_steps</code> ile ölçeklenir, böylece etkili öğrenme oranı bir büyük batch'ten alacağınızla eşleşir. Resmi tarif 256 batch boyutu istediğinde araştırmacılar BERT'i tek bir GPU'da bu şekilde eğitir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">clip_grad_norm_</div><div class="card-body">Gradyanları küresel norm ≤ max_norm olacak şekilde yeniden ölçeklendir. RNN'ler ve transformer eğitim kararlılığı için zorunlu.</div></div>
<div class="calc-card"><div class="card-title">bias/norm için decay yok</div><div class="card-body">BERT/GPT eğitimde standart kalıp. Genelleştirmeyi iyileştirir.</div></div>
<div class="calc-card"><div class="card-title">gradyan birikimi</div><div class="card-body">Adım atmadan önce mini-batch'ler arası birikerek daha büyük batch'leri simüle et.</div></div>
<div class="calc-card"><div class="card-title">label smoothing</div><div class="card-body">One-hot hedefleri epsilon kadar yumuşat. <code>CrossEntropyLoss(label_smoothing=0.1)</code>. Genelleştirmeye yardım eder.</div></div>
<div class="calc-card"><div class="card-title">karışık hassasiyet</div><div class="card-body">2x hız ve yarı bellek için float16/bfloat16'da eğit. L11'de kapsanır.</div></div>
<div class="calc-card"><div class="card-title">checkpointing</div><div class="card-body">Her epoch kaydet; çökmelerden sonra checkpoint'ten devam et. Üretim çalıştırmalarında her zaman olsun.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Uçtan Uca: Bir Metin Sınıflandırıcısı Eğitme</h2>

<p class="l-text">Tüm parçalar artık bir araya geliyor: Dataset, DataLoader, Model, Loss, Optimizer, Scheduler, eğitim döngüsü, değerlendirme. İşte oyuncak verisinde küçük bir metin sınıflandırıcısı eğiten tam, çalıştırılabilir betik.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader, random_split
<span class="kw">from</span> torch.nn.utils.rnn <span class="kw">import</span> pad_sequence

torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)
device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>

<span class="cm"># --- veri (L4'ten yeniden kullan) ---</span>
<span class="kw">class</span> <span class="fn">TextDS</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, texts, labels, vocab, max_len=<span class="num">20</span>):
        self.texts, self.labels, self.vocab, self.max_len = texts, labels, vocab, max_len
    <span class="kw">def</span> <span class="fn">__len__</span>(self): <span class="kw">return</span> <span class="fn">len</span>(self.texts)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i):
        ids = [self.vocab.<span class="fn">get</span>(t, <span class="num">1</span>) <span class="kw">for</span> t <span class="kw">in</span> self.texts[i].<span class="fn">lower</span>().<span class="fn">split</span>()][:self.max_len]
        <span class="kw">return</span> {<span class="str">"input_ids"</span>: torch.<span class="fn">tensor</span>(ids, dtype=torch.long),
                <span class="str">"label"</span>: torch.<span class="fn">tensor</span>(self.labels[i], dtype=torch.long)}

<span class="kw">def</span> <span class="fn">collate</span>(batch):
    ids = [b[<span class="str">"input_ids"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch]
    labels = torch.<span class="fn">stack</span>([b[<span class="str">"label"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch])
    padded = <span class="fn">pad_sequence</span>(ids, batch_first=<span class="kw">True</span>, padding_value=<span class="num">0</span>)
    mask = (padded != <span class="num">0</span>).<span class="fn">float</span>()
    <span class="kw">return</span> {<span class="str">"input_ids"</span>: padded, <span class="str">"attention_mask"</span>: mask, <span class="str">"labels"</span>: labels}

<span class="cm"># --- model (L3'ten yeniden kullan) ---</span>
<span class="kw">class</span> <span class="fn">Classifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, V, E=<span class="num">64</span>, H=<span class="num">32</span>, C=<span class="num">2</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(V, E, padding_idx=<span class="num">0</span>)
        self.fc1 = nn.<span class="fn">Linear</span>(E, H); self.act = nn.<span class="fn">ReLU</span>(); self.drop = nn.<span class="fn">Dropout</span>(<span class="num">0.3</span>)
        self.fc2 = nn.<span class="fn">Linear</span>(H, C)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids, mask):
        e = self.<span class="fn">embed</span>(ids)                           <span class="cm"># (B, T, E)</span>
        m = mask.<span class="fn">unsqueeze</span>(-<span class="num">1</span>)
        pooled = (e * m).<span class="fn">sum</span>(<span class="num">1</span>) / m.<span class="fn">sum</span>(<span class="num">1</span>).<span class="fn">clamp</span>(<span class="ty">min</span>=<span class="num">1</span>)  <span class="cm"># (B, E)</span>
        h = self.<span class="fn">drop</span>(self.<span class="fn">act</span>(self.<span class="fn">fc1</span>(pooled)))
        <span class="kw">return</span> self.<span class="fn">fc2</span>(h)                            <span class="cm"># logit (B, C)</span>

<span class="cm"># --- oyuncak veri ---</span>
texts = [<span class="str">"amazing movie"</span>, <span class="str">"terrible film"</span>, <span class="str">"great cast"</span>, <span class="str">"boring plot"</span>,
         <span class="str">"loved it"</span>, <span class="str">"hated it"</span>, <span class="str">"fantastic experience"</span>, <span class="str">"awful waste"</span>] * <span class="num">10</span>
labels = [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>] * <span class="num">10</span>
vocab = {<span class="str">"&lt;pad&gt;"</span>:<span class="num">0</span>, <span class="str">"&lt;unk&gt;"</span>:<span class="num">1</span>}
<span class="kw">for</span> t <span class="kw">in</span> texts:
    <span class="kw">for</span> w <span class="kw">in</span> t.<span class="fn">lower</span>().<span class="fn">split</span>():
        vocab.<span class="fn">setdefault</span>(w, <span class="fn">len</span>(vocab))

ds = <span class="fn">TextDS</span>(texts, labels, vocab)
gen = torch.<span class="fn">Generator</span>().<span class="fn">manual_seed</span>(<span class="num">0</span>)
train_ds, val_ds = <span class="fn">random_split</span>(ds, [<span class="num">0.8</span>, <span class="num">0.2</span>], generator=gen)
train_loader = <span class="fn">DataLoader</span>(train_ds, batch_size=<span class="num">8</span>, shuffle=<span class="kw">True</span>, collate_fn=collate)
val_loader = <span class="fn">DataLoader</span>(val_ds, batch_size=<span class="num">8</span>, collate_fn=collate)

<span class="cm"># --- eğitim kurulumu ---</span>
model = <span class="fn">Classifier</span>(V=<span class="fn">len</span>(vocab)).<span class="fn">to</span>(device)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>, weight_decay=<span class="num">0.01</span>)
sched = torch.optim.lr_scheduler.<span class="fn">CosineAnnealingLR</span>(opt, T_max=<span class="num">10</span>*<span class="fn">len</span>(train_loader))
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="cm"># --- eğit ---</span>
<span class="kw">def</span> <span class="fn">evaluate</span>(loader):
    model.<span class="fn">eval</span>()
    correct, total, loss_sum = <span class="num">0</span>, <span class="num">0</span>, <span class="num">0.0</span>
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        <span class="kw">for</span> batch <span class="kw">in</span> loader:
            ids = batch[<span class="str">"input_ids"</span>].<span class="fn">to</span>(device)
            mask = batch[<span class="str">"attention_mask"</span>].<span class="fn">to</span>(device)
            y = batch[<span class="str">"labels"</span>].<span class="fn">to</span>(device)
            logits = <span class="fn">model</span>(ids, mask)
            loss = <span class="fn">loss_fn</span>(logits, y)
            loss_sum += loss.<span class="fn">item</span>() * y.<span class="fn">size</span>(<span class="num">0</span>)
            correct += (logits.<span class="fn">argmax</span>(-<span class="num">1</span>) == y).<span class="fn">sum</span>().<span class="fn">item</span>()
            total += y.<span class="fn">size</span>(<span class="num">0</span>)
    model.<span class="fn">train</span>()
    <span class="kw">return</span> loss_sum / total, correct / total

history = []
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
    model.<span class="fn">train</span>()
    train_loss = <span class="num">0.0</span>
    <span class="kw">for</span> batch <span class="kw">in</span> train_loader:
        opt.<span class="fn">zero_grad</span>()
        ids = batch[<span class="str">"input_ids"</span>].<span class="fn">to</span>(device)
        mask = batch[<span class="str">"attention_mask"</span>].<span class="fn">to</span>(device)
        y = batch[<span class="str">"labels"</span>].<span class="fn">to</span>(device)
        logits = <span class="fn">model</span>(ids, mask)
        loss = <span class="fn">loss_fn</span>(logits, y)
        loss.<span class="fn">backward</span>()
        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
        opt.<span class="fn">step</span>(); sched.<span class="fn">step</span>()
        train_loss += loss.<span class="fn">item</span>()
    train_loss /= <span class="fn">len</span>(train_loader)
    val_loss, val_acc = <span class="fn">evaluate</span>(val_loader)
    history.<span class="fn">append</span>((train_loss, val_loss, val_acc))
    <span class="fn">print</span>(f<span class="str">"epoch {epoch+1}: train={train_loss:.4f}  val={val_loss:.4f}  acc={val_acc:.3f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">sklearn ile uçtan uca metin sınıflandırıcı -- torch eğitim döngüsünün kurduğu aynı kavramsal boru hattı, ama 8 satırda.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)
pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=2000, ngram_range=(1,2))),
    ('clf', LogisticRegression(max_iter=500, C=1.0)),
])
pipe.fit(X_tr, y_tr)
print(classification_report(y_te, pipe.predict(X_te), digits=3))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Tam olarak Ders 4'teki gibi Dataset, collate_fn ve DataLoader'ları kurar -- dikkat maskeleriyle batch başına padlenmiş değişken uzunluklu token ID'leri. 2) Tam olarak Ders 3'teki mimari, maske ile token'ları ortalama-havuzlayan küçük bir embedding+MLP sınıflandırıcı tanımlar. 3) Modeli uygun cihazda örnekler, weight decay ile bir AdamW optimizer ve toplam 10 epoch * adım/epoch için çalışan bir kosinüs LR çizelgesi. 4) <code>evaluate</code> fonksiyonu <code>no_grad</code> ile <code>eval()</code> modunda çalışır, doğrulama setinde kayıp ve doğruluk hesaplar; sonunda modeli <code>train()</code>'e geri çevirir. 5) Eğitim döngüsü kanonik 5 satırlık çekirdektir (sıfırla-ileri-kayıp-geri-adım) artı gradyan kırpma ve scheduler; loglama için eğitim kaybını biriktirir ve her epoch'tan sonra evaluate çağırır. 6) Epoch başına yazdırma size standart üç sayıyı verir: eğitim kaybı düşüyor, doğrulama kaybı düşüyor (düşmediği yere kadar), doğrulama doğruluğu artıyor.</p>

<div id="plot-pl5-curves-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Küçük bir metin sınıflandırıcısında 30 epoch için tipik bir eğitim çalıştırması. Eğitim kaybı (altın) model veriyi öğrendikçe monoton düşer. Doğrulama kaybı (cam göbeği) önce düşer, sonra epoch 12 civarında dibe vurur -- ondan sonra eğitime devam edersek tırmanırdı, ders kitabı overfitting imzası. İzlenecek doğru eğri doğrulamadır; tek başına eğitim genelleştirme hakkında size hiçbir şey söylemez.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Bir Eğitim Çalıştırmasını Teşhis Etme</h2>

<p class="l-text">Eğitim çalışmadığında, ilk görev eğrileri okumaktır. İşte hızlı bir tanılama kılavuzu ve dersin çıkarımları.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Belirti: kayıp NaN</div><div class="compare-item">Öğrenme oranı çok yüksek</div><div class="compare-item">Patlayan gradyan (kırpma yok)</div><div class="compare-item">Bozuk girdi: veride NaN veya inf</div><div class="compare-item">Yanlış şekle uygulanan kayıp</div><div class="compare-item">Çözüm: gradyanları kırp, LR düşür, girdileri temizle</div></div>
<div class="compare-col"><div class="compare-title">Belirti: kayıp düz</div><div class="compare-item">Öğrenme oranı çok düşük</div><div class="compare-item">zero_grad unutuldu (gradyanlar birikiyor)</div><div class="compare-item">Görev için yanlış kayıp fonksiyonu</div><div class="compare-item">Model bozuk (örn. detached çıktı)</div><div class="compare-item">Çözüm: 10x LR, zero_grad kontrol et, dtype doğrula</div></div>
</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Belirti: train düşer, val tırmanır</div><div class="compare-item">Overfitting</div><div class="compare-item">Veri için model çok büyük</div><div class="compare-item">Yetersiz düzenleme</div><div class="compare-item">Çözüm: dropout, weight decay, erken durdurma, daha fazla veri</div></div>
<div class="compare-col"><div class="compare-title">Belirti: val acc rastgelede takılı</div><div class="compare-item">Etiketler ters mi?</div><div class="compare-item">Yanlış kayıp (örn. softmax sonra CE)</div><div class="compare-item">Önemsiz baseline sorunu (her zaman tek sınıf)</div><div class="compare-item">Çözüm: tahmin + etiket batch'i yazdır, kayıp eğrisini kontrol et</div></div>
</div>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Eğitim döngüsü 5 satırdır: zero_grad, forward, loss, backward, step. Ritmi içselleştirin.<br><strong>2.</strong> Kayıp = regresyon için MSE, çok sınıflı için CrossEntropyLoss (ham logit ile), ikili/çoklu etiket için BCEWithLogitsLoss.<br><strong>3.</strong> Optimizer: transformer'lar için AdamW, ResNet'ler ve çok büyük modeller için SGD+momentum. lr en önemli hiperparametredir.<br><strong>4.</strong> Bir scheduler kullanın -- lineer warmup'lı OneCycleLR veya CosineAnnealing modern varsayılandır.<br><strong>5.</strong> Her zaman ayrılmış doğrulama setinde değerlendirin; <code>model.eval()</code> + <code>torch.no_grad()</code> kullanın.<br><strong>6.</strong> Gradyan kırpma ekleyin ve bias/norm'u weight decay'den dışlayın -- kod satırı başına en yüksek etkili iki hile.<br><strong>7.</strong> Val kaybı iyileşmeyi durdurduğunda erken durdurun; hesaplama tasarrufu yapar ve overfitting'i önlersiniz.<br><strong>8.</strong> Sonraki ders: 1B Conv metin sınıflandırıcılarına kısa NLP yan yolu ile evrişimsel ağlar.</div></div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid: 'rgba(255,255,255,0.06)',
    zero: 'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:60,r:30,b:60,l:60}};

  function optPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var steps = []; for (var i=0;i<200;i++) steps.push(i);
    function curve(decay, jitter, seed) {
      var s = seed; var v = 2.0; var out = [];
      for (var i=0;i<200;i++){
        s = (s*9301+49297)%233280;
        v = v*decay + (s/233280-0.5)*jitter;
        if (v<0.1) v = 0.1;
        out.push(v);
      }
      return out;
    }
    var sgd = curve(0.992, 0.05, 1);
    var mom = curve(0.985, 0.02, 7);
    var adm = curve(0.97, 0.01, 13);
    var t1 = {x:steps, y:sgd, mode:'lines', type:'scatter', name:'SGD', line:{color:'#f87171',width:2}};
    var t2 = {x:steps, y:mom, mode:'lines', type:'scatter', name:'SGD+Momentum', line:{color:'#4ecdc4',width:2}};
    var t3 = {x:steps, y:adm, mode:'lines', type:'scatter', name:'Adam', line:{color:T.accent,width:2.5}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Optimizer Karşılaştırması (Kayıp Eğrileri)':'Optimizer Comparison (Loss Curves)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'adım':'step', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'kayıp':'loss', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2,t3], layout, {responsive:true, displayModeBar:false});
  }

  function schedPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var steps = []; for (var i=0;i<1000;i++) steps.push(i);
    var step_lr = steps.map(function(s){
      if (s<300) return 1.0;
      if (s<600) return 0.5;
      if (s<900) return 0.25;
      return 0.125;
    });
    var cos_lr = steps.map(function(s){return 0.5*(1+Math.cos(Math.PI*s/1000));});
    var oc_lr = steps.map(function(s){
      if (s<100) return s/100;
      var t = (s-100)/900;
      return 0.5*(1+Math.cos(Math.PI*t));
    });
    var t1 = {x:steps, y:step_lr, mode:'lines', type:'scatter', name:'StepLR', line:{color:'#f87171',width:2}};
    var t2 = {x:steps, y:cos_lr, mode:'lines', type:'scatter', name:'CosineAnnealing', line:{color:'#4ecdc4',width:2}};
    var t3 = {x:steps, y:oc_lr, mode:'lines', type:'scatter', name:'OneCycleLR', line:{color:T.accent,width:2.5}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Öğrenme Oranı Çizelgeleri':'Learning Rate Schedules', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'adım':'step', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'lr (göreli)':'lr (relative)', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2,t3], layout, {responsive:true, displayModeBar:false});
  }

  function curvesPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var epochs = []; for (var i=1;i<=30;i++) epochs.push(i);
    var train = epochs.map(function(e){return Math.max(0.05, 0.7*Math.exp(-e/8) + 0.04 + (Math.random()-0.5)*0.02);});
    var val = epochs.map(function(e){
      if (e<13) return Math.max(0.15, 0.7*Math.exp(-e/9) + 0.13 + (Math.random()-0.5)*0.03);
      return 0.20 + (e-13)*0.012 + (Math.random()-0.5)*0.02;
    });
    var t1 = {x:epochs, y:train, mode:'lines+markers', type:'scatter', name:lang==='tr'?'eğitim kaybı':'train loss', line:{color:T.accent,width:2.5}, marker:{size:6}};
    var t2 = {x:epochs, y:val, mode:'lines+markers', type:'scatter', name:lang==='tr'?'doğrulama kaybı':'val loss', line:{color:'#4ecdc4',width:2.5}, marker:{size:6}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Eğitim Eğrileri (overfit göstergesi 13. epoch civarı)':'Training Curves (overfit signature ~epoch 13)', font:{color:T.text,size:14}},
      xaxis:{title:'epoch', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'kayıp':'loss', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2], layout, {responsive:true, displayModeBar:false});
  }

  optPlot('plot-pl5-optimizers-en','en');
  schedPlot('plot-pl5-schedulers-en','en');
  curvesPlot('plot-pl5-curves-en','en');
  optPlot('plot-pl5-optimizers-tr','tr');
  schedPlot('plot-pl5-schedulers-tr','tr');
  curvesPlot('plot-pl5-curves-tr','tr');
}, 250);</script>
`
};
