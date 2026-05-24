window.PYTORCH_L2 = {

en: `<p class="l-text"><strong>Autograd is the single feature that turns PyTorch from a fast NumPy into a deep learning library.</strong> In Lesson 1 you computed gradients by hand for a tiny linear model. That works for one weight and one bias; it is hopeless for a transformer with hundreds of millions of parameters and dozens of nonlinearities. Autograd watches your forward pass, builds a directed graph of every operation, and when you call <code>.backward()</code> it walks that graph in reverse to compute every gradient -- the chain rule, but free.</p>

<p class="l-text">This lesson teaches you the mental model: a computational graph is built dynamically from the operations you run on tensors with <code>requires_grad=True</code>; <code>.backward()</code> traverses it; <code>.grad</code> stores the result. We will hand-derive a tiny example so you trust the system, then explore <code>detach</code>, <code>no_grad</code>, gradient accumulation, and the most common autograd footguns.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Build a dynamic computational graph by setting <code>requires_grad=True</code> on input tensors</li>
<li>Compute gradients with <code>loss.backward()</code> and read them from <code>.grad</code> attributes</li>
<li>Verify autograd by hand-deriving a tiny linear model and matching the numbers</li>
<li>Use <code>detach()</code> and <code>torch.no_grad()</code> to stop gradient flow during inference</li>
<li>Handle <code>.grad</code> accumulation correctly with <code>optimizer.zero_grad()</code> in training loops</li>
<li>Diagnose common footguns: in-place ops, leaf tensor errors, retained graphs</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Computational Graph Intuition</h2>

<p class="l-text">Every PyTorch operation that involves a tensor with <code>requires_grad=True</code> records itself in a hidden graph. Each node is a tensor; each edge is the operation that produced it. When the loss is computed, you call <code>.backward()</code> on it and PyTorch walks the graph backwards from loss to inputs, applying the chain rule at each node.</p>

<div class="calc-highlight"><strong>The chain rule, in one sentence:</strong> if a function is a composition of simpler functions, its derivative is the product of the simpler functions' derivatives. Autograd applies this mechanically. You define forward; PyTorch produces backward.</div>

<div class="katex-block">$$y = f(g(h(x))) \\;\\Rightarrow\\; \\frac{dy}{dx} = \\frac{df}{dg}\\cdot\\frac{dg}{dh}\\cdot\\frac{dh}{dx}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x</div><div class="card-body">The input tensor, the variable we want a gradient with respect to.</div></div>
<div class="calc-card"><div class="card-title">h, g, f</div><div class="card-body">Intermediate functions. In a real network these are linear layers, activations, attention, etc.</div></div>
<div class="calc-card"><div class="card-title">y</div><div class="card-body">The final output (the loss). It must be a scalar to call <code>.backward()</code> without arguments.</div></div>
<div class="calc-card"><div class="card-title">dy/dx</div><div class="card-body">The gradient -- how much y changes when x changes. The product of local derivatives along the path.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: a tiny computation</div><div class="example-body">Take <code>x = 3.0</code>, then <code>h = x^2 = 9</code>, <code>g = h + 1 = 10</code>, <code>y = 2g = 20</code>. The chain rule: dy/dg = 2, dg/dh = 1, dh/dx = 2x = 6. So dy/dx = 2 * 1 * 6 = 12. PyTorch will compute exactly this -- you will see it in code shortly.</div></div>

<div class="think-box"><div class="think-label">DYNAMIC vs STATIC GRAPHS</div><div class="think-body">Older frameworks like TensorFlow 1 required you to declare the entire graph up front, then execute it. PyTorch builds the graph <em>as you run</em> the forward pass. This is called <em>dynamic computation</em> and it has two huge advantages: (1) you can use Python control flow (if, for, while) inside the forward pass and it just works, (2) debugging is easy because errors point to the exact line in your code. The trade-off is a tiny per-op overhead, which JIT compilation (TorchScript, torch.compile) can recover when needed.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. requires_grad and .backward()</h2>

<p class="l-text">By default a freshly created tensor does not track gradients. You opt in with <code>requires_grad=True</code> at construction (or via <code>.requires_grad_()</code> later). Once a tensor tracks gradients, every operation that consumes it produces a tensor that also tracks gradients, building the graph.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># 1) Opt into autograd at creation</span>
x = torch.<span class="fn">tensor</span>(<span class="num">3.0</span>, requires_grad=<span class="kw">True</span>)
<span class="fn">print</span>(x.requires_grad)        <span class="cm"># True</span>
<span class="fn">print</span>(x.grad)                 <span class="cm"># None -- gradient not computed yet</span>

<span class="cm"># 2) Build a small expression graph: y = 2 * (x^2 + 1)</span>
h = x ** <span class="num">2</span>          <span class="cm"># h = 9.0</span>
g = h + <span class="num">1</span>           <span class="cm"># g = 10.0</span>
y = <span class="num">2</span> * g           <span class="cm"># y = 20.0</span>
<span class="fn">print</span>(y)            <span class="cm"># tensor(20., grad_fn=&lt;MulBackward0&gt;)</span>
<span class="fn">print</span>(y.grad_fn)    <span class="cm"># &lt;MulBackward0&gt; -- the op that produced y</span>

<span class="cm"># 3) Compute gradients by walking the graph backwards</span>
y.<span class="fn">backward</span>()        <span class="cm"># populates x.grad</span>
<span class="fn">print</span>(x.grad)       <span class="cm"># tensor(12.) -- exactly dy/dx as we computed by hand</span>

<span class="cm"># 4) Multiple inputs</span>
a = torch.<span class="fn">tensor</span>(<span class="num">2.0</span>, requires_grad=<span class="kw">True</span>)
b = torch.<span class="fn">tensor</span>(<span class="num">5.0</span>, requires_grad=<span class="kw">True</span>)
loss = (a * b + a ** <span class="num">2</span>).<span class="fn">sum</span>()
loss.<span class="fn">backward</span>()
<span class="fn">print</span>(a.grad)       <span class="cm"># b + 2a = 5 + 4 = 9</span>
<span class="fn">print</span>(b.grad)       <span class="cm"># a = 2</span>

<span class="cm"># 5) Vector-valued inputs and a scalar loss</span>
w = torch.<span class="fn">randn</span>(<span class="num">3</span>, requires_grad=<span class="kw">True</span>)
x_in = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">3.0</span>])
loss = (w * x_in).<span class="fn">sum</span>()       <span class="cm"># &lt;w, x&gt; -- scalar</span>
loss.<span class="fn">backward</span>()
<span class="fn">print</span>(w.grad)                 <span class="cm"># equals x_in -- d(&lt;w,x&gt;)/dw = x</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">We hand-compute a gradient with NumPy: define f(w) = (w*x - y)^2 and apply chain rule by hand. This is the math autograd automates.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Forward
x = np.array([1.0, 2.0, 3.0])
y = np.array([2.0, 4.0, 7.0])
w = 1.5

pred = w * x
err  = pred - y
loss = (err ** 2).mean()

# Hand-derived backward: d loss / d w = mean( 2 * err * x )
grad_w = (2 * err * x).mean()

print(f'loss     = {loss:.4f}')
print(f'grad_w   = {grad_w:.4f}   (autograd would give the same)')

# One gradient-descent step
lr = 0.1
w_new = w - lr * grad_w
loss_new = ((w_new * x - y) ** 2).mean()
print(f'w  before = {w:.3f},  loss = {loss:.4f}')
print(f'w  after  = {w_new:.3f},  loss = {loss_new:.4f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a leaf tensor <code>x</code> with autograd enabled. <code>x.grad</code> is <code>None</code> because no backward has been called yet. 2) Builds a chain of three operations. Notice <code>y</code> has a <code>grad_fn</code> attached -- that is PyTorch remembering "you got here via a multiply"; when backward runs it uses these to apply the right local derivatives. 3) <code>y.backward()</code> walks the graph from <code>y</code> back to <code>x</code>, multiplying local derivatives along the way. The result, 12, matches the manual chain-rule derivation. 4) With multiple inputs, calling <code>.backward()</code> populates each leaf's <code>.grad</code> simultaneously -- one backward pass, all gradients. 5) For a scalar loss <code>L = w . x</code>, the gradient with respect to <code>w</code> is just <code>x</code>; PyTorch confirms this with <code>w.grad == x_in</code>. This is the mechanism that gradient descent uses on every weight in your model.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">requires_grad</div><div class="card-body">Boolean attribute. Set on leaf tensors (parameters, inputs you want gradients for). Propagates: any output of an op with a grad-tracking input also tracks grad.</div></div>
<div class="calc-card"><div class="card-title">grad_fn</div><div class="card-body">The function that produced this non-leaf tensor. Used by backward to apply local derivatives.</div></div>
<div class="calc-card"><div class="card-title">.backward()</div><div class="card-body">Triggers reverse traversal. Must be called on a scalar (or pass <code>gradient=</code> tensor for vector outputs).</div></div>
<div class="calc-card"><div class="card-title">.grad</div><div class="card-body">Where the computed gradient is stored, on each leaf. Has the same shape as the leaf.</div></div>
<div class="calc-card"><div class="card-title">Leaf tensor</div><div class="card-body">A user-created tensor with <code>requires_grad=True</code>. The graph terminates here on backward.</div></div>
<div class="calc-card"><div class="card-title">Non-leaf tensor</div><div class="card-body">Result of an op. Tracks <code>grad_fn</code>. By default does NOT keep its own gradient unless you call <code>.retain_grad()</code>.</div></div>
</div>

<div id="plot-pl2-graph-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A schematic of the computational graph for <code>y = 2 * (x^2 + 1)</code>. Forward arrows go left to right (input to output); backward arrows go right to left and accumulate the chain-rule product. Each node stores a small bit of state: the local Jacobian. When you call <code>y.backward()</code>, PyTorch walks the right-to-left arrows and multiplies the local derivatives, ending up with <code>dy/dx</code> at the leftmost node.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Hand-Deriving a Linear Layer Gradient</h2>

<p class="l-text">To trust autograd, derive a real example by hand and check the numbers. We do exactly this with the simplest learnable function: a linear layer followed by mean squared error.</p>

<div class="katex-block">$$\\hat{y} = wx + b, \\quad L = \\frac{1}{N}\\sum_{i=1}^{N}(\\hat{y}_i - y_i)^2$$</div>

<p class="l-text">Take the partial derivatives with the chain rule:</p>

<div class="katex-block">$$\\frac{\\partial L}{\\partial w} = \\frac{2}{N}\\sum_i (\\hat{y}_i - y_i)\\,x_i, \\quad \\frac{\\partial L}{\\partial b} = \\frac{2}{N}\\sum_i (\\hat{y}_i - y_i)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">w, b</div><div class="card-body">Scalar weight and bias -- the parameters we are optimizing.</div></div>
<div class="calc-card"><div class="card-title">x_i, y_i</div><div class="card-body">Input feature and target for sample i.</div></div>
<div class="calc-card"><div class="card-title">y_hat_i</div><div class="card-body">Model prediction for sample i.</div></div>
<div class="calc-card"><div class="card-title">L</div><div class="card-body">Mean squared error across N samples; the scalar we minimize.</div></div>
<div class="calc-card"><div class="card-title">2/N</div><div class="card-body">Constant from differentiating the squared term and the mean.</div></div>
<div class="calc-card"><div class="card-title">(y_hat - y)</div><div class="card-body">Per-sample residual; multiplied by x for dL/dw and summed for dL/db.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)
N = <span class="num">10</span>
X = torch.<span class="fn">randn</span>(N)
y = <span class="num">3</span> * X + <span class="num">2</span> + <span class="num">0.1</span> * torch.<span class="fn">randn</span>(N)

<span class="cm"># Parameters with autograd</span>
w = torch.<span class="fn">tensor</span>(<span class="num">0.0</span>, requires_grad=<span class="kw">True</span>)
b = torch.<span class="fn">tensor</span>(<span class="num">0.0</span>, requires_grad=<span class="kw">True</span>)

<span class="cm"># Forward</span>
y_hat = w * X + b
loss  = ((y_hat - y) ** <span class="num">2</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"loss = {loss.item():.4f}"</span>)

<span class="cm"># Autograd</span>
loss.<span class="fn">backward</span>()
<span class="fn">print</span>(f<span class="str">"autograd dL/dw = {w.grad.item():.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"autograd dL/db = {b.grad.item():.6f}"</span>)

<span class="cm"># Manual computation -- should match exactly</span>
manual_dw = (<span class="num">2</span> / N) * ((y_hat - y) * X).<span class="fn">sum</span>().<span class="fn">item</span>()
manual_db = (<span class="num">2</span> / N) * (y_hat - y).<span class="fn">sum</span>().<span class="fn">item</span>()
<span class="fn">print</span>(f<span class="str">"manual   dL/dw = {manual_dw:.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"manual   dL/db = {manual_db:.6f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Re-derive the gradient of a linear layer y = x @ W + b -- the closed form (dL/dW = x.T @ dL/dy) is exactly what autograd ships in C++.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
x = rng.standard_normal((4, 5))      # batch=4, in=5
W = rng.standard_normal((5, 3))      # in=5, out=3
b = np.zeros(3)
y_true = rng.standard_normal((4, 3))

# Forward
y_hat = x @ W + b
loss  = ((y_hat - y_true) ** 2).mean()

# Backward (closed form)
dL_dy = 2 * (y_hat - y_true) / y_true.size   # (4, 3)
dL_dW = x.T @ dL_dy                          # (5, 3)
dL_db = dL_dy.sum(axis=0)                    # (3,)
dL_dx = dL_dy @ W.T                          # (4, 5)

print(f'loss   = {loss:.4f}')
print('shapes -> dW', dL_dW.shape, 'db', dL_db.shape, 'dx', dL_dx.shape)
print('||dW|| =', np.linalg.norm(dL_dW).round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates 10 synthetic samples from <code>y = 3x + 2 + noise</code>. 2) Initializes <code>w = 0</code>, <code>b = 0</code> with autograd; both will be optimized. 3) Computes the forward pass and the scalar loss; PyTorch silently records every multiply, add, square, and mean as nodes in the graph. 4) Calls <code>loss.backward()</code> which walks the recorded graph from the scalar loss back to the leaves <code>w</code> and <code>b</code>, accumulating the gradient at each. 5) Computes the same gradient by hand using the closed-form expression we derived. 6) Prints both -- they will agree to about six decimal places, because float arithmetic is the only difference. This match is the mathematical guarantee that lets you stop deriving gradients ever again.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: gradient descent loop using autograd</div><div class="example-body">A full training loop is just: (1) <code>w.grad.zero_()</code> to clear leftover gradients, (2) compute loss, (3) <code>loss.backward()</code>, (4) <code>w.data -= lr * w.grad</code>. Loop. That is the entire deep-learning training algorithm in 4 lines. Everything else (optimizers, schedulers, mixed precision) is performance polish.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. detach(), with torch.no_grad(), and Memory</h2>

<p class="l-text">Sometimes you want to compute with a tensor without recording the operation in the graph. Three reasons: evaluation/inference (no backward needed, save memory), freezing parts of a model, and metric computation. PyTorch gives you several tools for this.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

x = torch.<span class="fn">tensor</span>(<span class="num">2.0</span>, requires_grad=<span class="kw">True</span>)

<span class="cm"># 1) detach -- return a new tensor that shares data but is OUT of the graph</span>
y = x ** <span class="num">2</span>          <span class="cm"># in graph</span>
z = y.<span class="fn">detach</span>()      <span class="cm"># same value, no grad_fn</span>
<span class="fn">print</span>(y.requires_grad, y.grad_fn)   <span class="cm"># True, &lt;PowBackward0&gt;</span>
<span class="fn">print</span>(z.requires_grad, z.grad_fn)   <span class="cm"># False, None</span>

<span class="cm"># 2) torch.no_grad() context -- everything inside is graph-free</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    a = x * <span class="num">5</span>
    <span class="fn">print</span>(a.requires_grad)          <span class="cm"># False</span>
    <span class="cm"># Common pattern: evaluation</span>
    <span class="cm"># for batch in val_loader:</span>
    <span class="cm">#     out = model(batch.x)</span>
    <span class="cm">#     metric.update(out, batch.y)</span>

<span class="cm"># 3) torch.inference_mode() -- like no_grad but even faster (PyTorch 1.9+)</span>
<span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
    out = x * <span class="num">5</span>

<span class="cm"># 4) Manual parameter updates inside no_grad to avoid graph pollution</span>
w = torch.<span class="fn">randn</span>(<span class="num">3</span>, requires_grad=<span class="kw">True</span>)
loss = (w ** <span class="num">2</span>).<span class="fn">sum</span>()
loss.<span class="fn">backward</span>()
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    w -= <span class="num">0.1</span> * w.grad     <span class="cm"># update; not tracked</span>
    w.grad.<span class="fn">zero_</span>()        <span class="cm"># reset gradient buffer for next step</span>

<span class="cm"># 5) Decorator form -- the whole function is graph-free</span>
<span class="at">@torch.no_grad</span>()
<span class="kw">def</span> <span class="fn">evaluate</span>(model, x):
    <span class="kw">return</span> <span class="fn">model</span>(x)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">detach() == 'use the value, don't track the history'. We mimic it with NumPy by simply storing a value as a constant array, breaking the autograd connection.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Track a 'graph' manually: keep grad function in a tuple
class Var:
    def __init__(self, v, parents=()): self.v, self.parents = v, parents

x = Var(np.array([2.0, 3.0]))
y = Var(x.v * 5.0, parents=(x,))   # y depends on x
z = Var(y.v + 1.0, parents=(y,))   # z depends on y

# detach: take the value, drop the parent links
y_det = Var(y.v.copy())
z2    = Var(y_det.v + 1.0, parents=(y_det,))

print('z  parents (full graph) :', len(z.parents))
print('z2 parents (after detach):', len(z2.parents))
print('values still equal:', np.allclose(z.v, z2.v))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>y.detach()</code> returns a new tensor with the same numerical value but no <code>grad_fn</code> -- it is now a "leaf without history". You use detach when you need a tensor's value but you do not want gradients to flow through it (for example, target labels in a teacher-student distillation). 2) <code>torch.no_grad()</code> is a context manager that disables graph construction inside its block; perfect for evaluation and inference where backward will never be called. 3) <code>torch.inference_mode()</code> is a stricter, faster version: it makes some additional assumptions and skips even more bookkeeping. Use it for production inference. 4) When you write a manual SGD step, you wrap the update in <code>no_grad</code> so that the assignment <code>w -= ...</code> does not get added to the graph -- otherwise you would build an ever-growing graph across training steps. 5) <code>@torch.no_grad()</code> as a decorator applies the same rule to the whole function; idiomatic for evaluation utilities.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">.detach()</div><div class="compare-item">Returns a NEW tensor</div><div class="compare-item">Same data buffer (zero copy)</div><div class="compare-item">No grad_fn, no backward through it</div><div class="compare-item">Use to "freeze" intermediate values</div><div class="compare-item">Common for target tensors in distillation</div></div>
<div class="compare-col"><div class="compare-title">torch.no_grad()</div><div class="compare-item">Context manager / decorator</div><div class="compare-item">Disables graph construction in scope</div><div class="compare-item">Saves memory and time</div><div class="compare-item">Use for eval, inference, manual updates</div><div class="compare-item">Same concept as TensorFlow's "training=False"</div></div>
</div>

<div class="l-warn"><strong>Pitfall (autograd memory):</strong> Forgetting <code>no_grad</code> during evaluation is the #1 cause of OOM during validation. Each forward pass builds a graph, and if you do many forward passes without backward, those graphs pile up and exhaust GPU memory. Always wrap your evaluation loop in <code>with torch.no_grad():</code>.</div>

<div class="l-note"><strong>What about <code>.data</code>?</strong> Older code uses <code>x.data</code> to get the raw tensor without autograd. This still works but is unsafe -- it can silently corrupt the graph. <code>x.detach()</code> is the modern, correct replacement.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Gradient Accumulation: when .grad survives</h2>

<p class="l-text">PyTorch <em>accumulates</em> gradients into <code>.grad</code> instead of overwriting them. This is by design -- it lets you split a large batch into smaller pieces. But it also means you must zero out gradients before each backward, or your updates will be wrong.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

w = torch.<span class="fn">tensor</span>(<span class="num">2.0</span>, requires_grad=<span class="kw">True</span>)

<span class="cm"># Two backward calls without zeroing -- gradients add</span>
loss1 = (w ** <span class="num">2</span>).<span class="fn">sum</span>()    <span class="cm"># dL/dw = 2w = 4</span>
loss1.<span class="fn">backward</span>()
<span class="fn">print</span>(w.grad)              <span class="cm"># tensor(4.)</span>

loss2 = (<span class="num">3</span> * w).<span class="fn">sum</span>()      <span class="cm"># dL/dw = 3</span>
loss2.<span class="fn">backward</span>()
<span class="fn">print</span>(w.grad)              <span class="cm"># tensor(7.) -- 4 + 3, accumulated!</span>

<span class="cm"># The fix: zero the grad before each step</span>
w.grad.<span class="fn">zero_</span>()
loss3 = (w ** <span class="num">2</span>).<span class="fn">sum</span>()
loss3.<span class="fn">backward</span>()
<span class="fn">print</span>(w.grad)              <span class="cm"># tensor(4.) -- fresh</span>

<span class="cm"># Real training loop pattern</span>
<span class="cm"># for x, y in loader:</span>
<span class="cm">#     optimizer.zero_grad()    # reset .grad on every parameter</span>
<span class="cm">#     loss = model(x, y)</span>
<span class="cm">#     loss.backward()</span>
<span class="cm">#     optimizer.step()         # apply update</span>
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Gradient accumulation = 'do not zero between steps'. With NumPy we add gradients across mini-batches before stepping the weight.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(1)
X = rng.standard_normal((20, 4))
y = rng.standard_normal(20)
w = np.zeros(4)
lr = 0.05

# Process 4 mini-batches of 5 each, accumulate grad before stepping
grad_acc = np.zeros_like(w)
for bi in range(4):
    xb = X[bi*5:(bi+1)*5]
    yb = y[bi*5:(bi+1)*5]
    pred = xb @ w
    grad = 2 * xb.T @ (pred - yb) / xb.shape[0]
    grad_acc += grad
    print(f'batch {bi}: ||grad_acc|| = {np.linalg.norm(grad_acc):.4f}')

# Single update with the accumulated grad
w -= lr * (grad_acc / 4)
print('updated w:', w.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Calls backward on <code>loss1 = w^2</code>, gradient is 2w = 4. 2) Without zeroing, calls backward on a different loss <code>loss2 = 3w</code>, whose gradient is 3 -- but <code>w.grad</code> is now 7, the sum of both. PyTorch added the new gradient to the existing one. 3) After <code>w.grad.zero_()</code>, the next backward gives a clean 4. 4) The standard training loop calls <code>optimizer.zero_grad()</code> at the top of every iteration to reset <code>.grad</code> on every parameter. Forgetting this single line is one of the most common bugs in beginner PyTorch code -- training silently diverges because gradients keep growing.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: gradient accumulation for huge batches</div><div class="example-body">Suppose you want effective batch size 64 but only 8 samples fit in GPU memory. The trick: do 8 forward+backward passes on mini-batches of 8 <em>without</em> zeroing in between, then call <code>optimizer.step()</code> + <code>optimizer.zero_grad()</code>. The <code>.grad</code> after 8 backwards is the sum of 8 mini-batch gradients, which is what you would get from one batch of 64 (up to a 1/64 vs 1/8 normalization). This trick is how researchers train BERT on a single GPU.</div></div>

<div class="l-warn"><strong>Pitfall:</strong> Always pair <code>optimizer.step()</code> with <code>optimizer.zero_grad()</code>. Some people put zero_grad at the bottom of the loop, some at the top -- both work, but pick one and stick with it. Mixing them between scripts is how you accidentally do 2x or 0.5x updates.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Visualizing Gradient Descent</h2>

<p class="l-text">Autograd gives you the gradient. Gradient descent uses it: take a step in the negative gradient direction, repeat. Let us watch this happen on a 2D loss landscape so the geometry is unambiguous.</p>

<div class="katex-block">$$\\theta_{t+1} = \\theta_t - \\eta\\,\\nabla_\\theta L(\\theta_t)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">theta</div><div class="card-body">The parameters being optimized (weights, biases). At step t we have theta_t.</div></div>
<div class="calc-card"><div class="card-title">eta</div><div class="card-body">The learning rate -- how big a step to take. Too big diverges; too small crawls.</div></div>
<div class="calc-card"><div class="card-title">grad L</div><div class="card-body">The gradient of the loss; what autograd computes for you in one call.</div></div>
<div class="calc-card"><div class="card-title">- sign</div><div class="card-body">We move opposite the gradient because the gradient points uphill; we want downhill.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># A 2D quadratic loss: L(a, b) = (a - 3)^2 + (b + 1)^2</span>
<span class="cm"># Minimum at (a, b) = (3, -1)</span>
a = torch.<span class="fn">tensor</span>(<span class="num">0.0</span>, requires_grad=<span class="kw">True</span>)
b = torch.<span class="fn">tensor</span>(<span class="num">0.0</span>, requires_grad=<span class="kw">True</span>)
lr = <span class="num">0.1</span>

trajectory = []
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">40</span>):
    <span class="kw">if</span> a.grad <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>: a.grad.<span class="fn">zero_</span>()
    <span class="kw">if</span> b.grad <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>: b.grad.<span class="fn">zero_</span>()
    loss = (a - <span class="num">3</span>) ** <span class="num">2</span> + (b + <span class="num">1</span>) ** <span class="num">2</span>
    loss.<span class="fn">backward</span>()
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        a -= lr * a.grad
        b -= lr * b.grad
    trajectory.<span class="fn">append</span>((a.<span class="fn">item</span>(), b.<span class="fn">item</span>(), loss.<span class="fn">item</span>()))

<span class="fn">print</span>(<span class="str">"final:"</span>, a.<span class="fn">item</span>(), b.<span class="fn">item</span>())   <span class="cm"># close to (3, -1)</span>
<span class="fn">print</span>(<span class="str">"loss :"</span>, trajectory[-<span class="num">1</span>][<span class="num">2</span>])    <span class="cm"># close to 0</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Visualize gradient descent on a 1-D quadratic loss. Each step moves the parameter against the gradient -- the same dynamic backprop drives.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Loss L(w) = (w - 3)^2
def loss_fn(w): return (w - 3) ** 2
def grad_fn(w): return 2 * (w - 3)

w = -2.0
lr = 0.1
history = []
for step in range(30):
    history.append((w, loss_fn(w)))
    w = w - lr * grad_fn(w)

print('step  w       loss')
for s, (wi, li) in enumerate(history[::3]):
    print(f'{s*3:3d}  {wi:6.3f}  {li:6.3f}')
print(f'final w = {w:.3f}  (true min = 3.0)')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a quadratic loss with a known minimum at <code>(3, -1)</code>; this is the simplest non-trivial 2D landscape. 2) Initializes parameters at the origin <code>(0, 0)</code>. 3) Loops 40 steps; each step zeros the gradients, builds the forward graph, calls <code>backward()</code>, and updates parameters with a gradient-descent step inside <code>no_grad</code>. 4) Records the trajectory as a list of triples for plotting. 5) After 40 steps the parameters land near <code>(3, -1)</code> and the loss is near zero -- the classic geometric picture of "rolling downhill" on a bowl-shaped landscape.</p>

<div id="plot-pl2-descent-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The loss landscape of <code>L(a,b) = (a-3)^2 + (b+1)^2</code> as a contour map, with the trajectory of gradient descent overlaid. Each arrow is one update step. Notice how the path bends toward the minimum, never overshooting because the learning rate is moderate. With a too-large learning rate the path would oscillate and diverge; with a too-small one it would barely move. Tuning the learning rate is the most important single hyperparameter in deep learning.</div>

<div class="think-box"><div class="think-label">WHAT IF THE LANDSCAPE IS NOT A BOWL?</div><div class="think-body">Real deep-learning losses are not convex bowls -- they have ridges, saddles, plateaus, and many local minima. Vanilla gradient descent gets stuck or oscillates. This is why we use better optimizers: SGD with momentum smooths the trajectory, Adam adapts the step per parameter, learning-rate schedules anneal the step over time. Lesson 5 covers all of these. Autograd remains the foundation -- it gives you the gradient; what you do with it is the optimizer's job.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Higher-Order Gradients and create_graph</h2>

<p class="l-text">Sometimes you need a gradient of a gradient -- second derivatives for advanced optimization, or for losses that themselves involve gradients (gradient penalty in WGAN-GP, MAML meta-learning). PyTorch supports this with <code>create_graph=True</code> in backward, which makes the backward graph itself differentiable.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

x = torch.<span class="fn">tensor</span>(<span class="num">2.0</span>, requires_grad=<span class="kw">True</span>)
y = x ** <span class="num">3</span>                                <span class="cm"># y = 8</span>

<span class="cm"># First derivative: dy/dx = 3x^2 = 12</span>
y.<span class="fn">backward</span>(create_graph=<span class="kw">True</span>)
first = x.grad                            <span class="cm"># tensor(12., grad_fn=&lt;...&gt;) -- itself differentiable!</span>
<span class="fn">print</span>(first)

<span class="cm"># Second derivative: d2y/dx2 = 6x = 12</span>
x.grad = <span class="kw">None</span>    <span class="cm"># reset (since first holds a reference)</span>
first.<span class="fn">backward</span>()
<span class="fn">print</span>(x.grad)    <span class="cm"># tensor(12.)</span>

<span class="cm"># A cleaner API: torch.autograd.grad</span>
x = torch.<span class="fn">tensor</span>(<span class="num">2.0</span>, requires_grad=<span class="kw">True</span>)
y = x ** <span class="num">3</span>
g1 = torch.autograd.<span class="fn">grad</span>(y, x, create_graph=<span class="kw">True</span>)[<span class="num">0</span>]   <span class="cm"># 12</span>
g2 = torch.autograd.<span class="fn">grad</span>(g1, x)[<span class="num">0</span>]                     <span class="cm"># 12</span>
<span class="fn">print</span>(g1, g2)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Higher-order derivatives via finite differences -- the second derivative of f(x) = x^3 at x=2 should be 12.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def f(x):    return x ** 3
def f1(x):   return 3 * x ** 2     # known first derivative
def f2(x):   return 6 * x          # known second derivative

x = 2.0
h = 1e-4

# Numerical first derivative
df_num = (f(x + h) - f(x - h)) / (2 * h)
# Numerical second derivative
d2f_num = (f(x + h) - 2 * f(x) + f(x - h)) / (h ** 2)

print(f'f(x)  exact = {f(x):.6f}')
print(f"f'(x)  exact = {f1(x):.6f},  numerical = {df_num:.6f}")
print(f"f''(x) exact = {f2(x):.6f},  numerical = {d2f_num:.6f}")
print('higher-order autograd does this analytically and exactly.')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Computes <code>y = x^3</code> at <code>x=2</code>, so <code>y=8</code>. 2) Calls backward with <code>create_graph=True</code> -- this not only fills <code>x.grad</code> but also keeps the backward computation as a graph that we can differentiate again. 3) The first derivative is 12, and crucially has its own <code>grad_fn</code>, meaning we can call backward on <em>it</em>. 4) Calling <code>first.backward()</code> gives us the second derivative <code>d2y/dx2 = 6x = 12</code> at <code>x=2</code>. 5) The functional API <code>torch.autograd.grad</code> is cleaner for higher-order work: it takes outputs and inputs explicitly and returns the gradients without touching <code>.grad</code> attributes -- much easier to reason about for nested optimizers.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: gradient penalty in WGAN-GP</div><div class="example-body">In Wasserstein GAN with gradient penalty, the loss includes <code>(||grad of D|| - 1)^2</code>. Computing this requires getting the gradient of the discriminator with respect to its input, treating that gradient as a tensor, taking its norm, and including it in the loss. PyTorch makes this natural: <code>grad = torch.autograd.grad(D(x), x, create_graph=True)[0]</code>; <code>penalty = (grad.norm() - 1) ** 2</code>; the outer <code>loss.backward()</code> differentiates through the inner gradient.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Common Footguns and Wrap-up</h2>

<p class="l-text">Autograd is reliable, but a handful of patterns cause confusion every single time. Here is the consolidated list, then a key-takeaways box.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Common mistakes</div><div class="compare-item">Forgetting <code>optimizer.zero_grad()</code> -- gradients accumulate</div><div class="compare-item">Forgetting <code>no_grad</code> in eval -- OOM or slow</div><div class="compare-item">In-place op on a tensor in the graph -- "leaf tensor modified" error</div><div class="compare-item">Calling <code>.backward()</code> twice without <code>retain_graph=True</code> -- "trying to backward through the graph a second time"</div><div class="compare-item">Using <code>.data</code> instead of <code>.detach()</code> -- silently corrupts grads</div></div>
<div class="compare-col"><div class="compare-title">Best practices</div><div class="compare-item">Always pair <code>optimizer.step()</code> with <code>optimizer.zero_grad()</code></div><div class="compare-item">Wrap evaluation in <code>with torch.no_grad():</code></div><div class="compare-item">Use <code>tensor.clone()</code> if you need a writable copy in-graph</div><div class="compare-item">Prefer <code>torch.autograd.grad</code> for higher-order or selective backward</div><div class="compare-item">Use <code>tensor.detach()</code>, never <code>tensor.data</code></div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># A complete autograd-powered training of one parameter</span>
<span class="cm"># Goal: find x that minimizes (x - 5)^2</span>

x = torch.<span class="fn">tensor</span>(<span class="num">0.0</span>, requires_grad=<span class="kw">True</span>)
optimizer = torch.optim.<span class="fn">SGD</span>([x], lr=<span class="num">0.1</span>)

losses = []
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    optimizer.<span class="fn">zero_grad</span>()
    loss = (x - <span class="num">5</span>) ** <span class="num">2</span>
    loss.<span class="fn">backward</span>()
    optimizer.<span class="fn">step</span>()
    losses.<span class="fn">append</span>(loss.<span class="fn">item</span>())

<span class="fn">print</span>(f<span class="str">"final x = {x.item():.4f}  (target: 5.0)"</span>)
<span class="fn">print</span>(f<span class="str">"final loss = {losses[-1]:.6f}"</span>)

<span class="cm"># Gradient check: PyTorch ships a numerical gradient checker</span>
<span class="kw">def</span> <span class="fn">f</span>(t):
    <span class="kw">return</span> (t - <span class="num">5</span>) ** <span class="num">2</span>

x_test = torch.<span class="fn">randn</span>(<span class="num">1</span>, dtype=torch.double, requires_grad=<span class="kw">True</span>)
ok = torch.autograd.<span class="fn">gradcheck</span>(f, (x_test,), eps=<span class="num">1e-6</span>, atol=<span class="num">1e-4</span>)
<span class="fn">print</span>(f<span class="str">"gradcheck passed: {ok}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Wrap-up demo: the full forward/backward/step cycle of one training iteration in 15 lines of pure NumPy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
X = rng.standard_normal((32, 4))
y_true = (X[:, 0] + 2 * X[:, 1] - X[:, 2] > 0).astype(float)

w = rng.standard_normal(4) * 0.1
b = 0.0
lr = 0.5

for step in range(40):
    z = X @ w + b
    p = 1 / (1 + np.exp(-z))                     # sigmoid
    loss = -(y_true * np.log(p+1e-9) + (1-y_true) * np.log(1-p+1e-9)).mean()
    dz = (p - y_true) / X.shape[0]
    w -= lr * (X.T @ dz)
    b -= lr * dz.sum()
    if step % 10 == 0:
        acc = ((p > 0.5) == y_true).mean()
        print(f'step {step:2d}  loss {loss:.4f}  acc {acc:.3f}')

print('final w:', w.round(3), 'b:', round(b, 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up a single-parameter optimization: find <code>x</code> minimizing <code>(x-5)^2</code>; the answer is obviously 5. 2) Creates an SGD optimizer that tracks our parameter; the optimizer is just a glorified subtraction loop -- it knows how to apply <code>x -= lr * x.grad</code>. 3) The classic 5-line training loop: zero, forward, backward, step, log. After 50 steps the parameter converges to 5. 4) <code>torch.autograd.gradcheck</code> compares autograd's gradient to a finite-difference approximation; if they agree, your forward and backward are mutually consistent. This is a debugging tool you should reach for whenever you write a custom autograd Function.</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Autograd builds a dynamic computational graph from your forward pass; <code>.backward()</code> traverses it in reverse to compute gradients via the chain rule.<br><strong>2.</strong> Opt in with <code>requires_grad=True</code>; gradients land in <code>.grad</code> on each leaf; the loss must be a scalar to call <code>.backward()</code> without args.<br><strong>3.</strong> <code>.grad</code> accumulates -- always call <code>optimizer.zero_grad()</code> (or <code>.grad.zero_()</code>) before each backward.<br><strong>4.</strong> Use <code>torch.no_grad()</code> for evaluation and <code>tensor.detach()</code> for "freeze this value here" -- both stop graph construction.<br><strong>5.</strong> <code>create_graph=True</code> enables higher-order gradients for advanced uses (WGAN-GP, MAML).<br><strong>6.</strong> Manual gradient derivation matches autograd to floating-point precision -- the system is correct, you can stop deriving.<br><strong>7.</strong> Common bugs: forgetting zero_grad, forgetting no_grad in eval, calling backward twice, using <code>.data</code> instead of <code>.detach()</code>.<br><strong>8.</strong> Next lesson: assemble these primitives into <code>nn.Module</code> -- the object-oriented way to build neural networks where parameters, forward pass, and gradient flow are all packaged together.</div></div>
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

  function graphPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var nodes = lang === 'tr'
      ? ['x', 'h = x^2', 'g = h+1', 'y = 2g']
      : ['x', 'h = x^2', 'g = h+1', 'y = 2g'];
    var xs = [0, 1, 2, 3];
    var ys = [0, 0, 0, 0];
    var fwd = {x: xs, y: ys, mode:'lines+markers+text', type:'scatter', text: nodes, textposition:'top center',
               marker:{size:24, color:T.accent, line:{color:'rgba(255,255,255,0.3)',width:2}},
               line:{color:T.accent, width:3}, name: lang==='tr'?'Forward':'Forward'};
    var bwd_x = [3, 2.5, 2, 1.5, 1, 0.5, 0];
    var bwd_y = [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4, -0.4];
    var bwd = {x: bwd_x, y: bwd_y, mode:'lines+markers', type:'scatter',
               marker:{size:8, color:'#4ecdc4', symbol:'triangle-left'},
               line:{color:'#4ecdc4', width:2, dash:'dash'},
               name: lang==='tr'?'Backward (gradyan)':'Backward (gradient)'};
    var labels = {x:[3, 2, 1, 0], y:[-0.7,-0.7,-0.7,-0.7],
                  mode:'text', type:'scatter', showlegend:false,
                  text: ['dy/dy=1','dy/dg=2','dg/dh=1','dh/dx=2x=6'], textfont:{color:T.text,size:12}};
    var layout = Object.assign({}, common, {
      title:{text: lang === 'tr' ? 'Hesaplama Grafiği: y = 2(x^2 + 1)' : 'Computational Graph: y = 2(x^2 + 1)', font:{color:T.text,size:14}},
      xaxis:{visible:false, range:[-0.5, 3.5]},
      yaxis:{visible:false, range:[-1, 0.6]},
      legend:{font:{color:T.text}},
      margin:{t:60,r:30,b:30,l:30}
    });
    Plotly.newPlot(id, [fwd, bwd, labels], layout, {responsive:true, displayModeBar:false});
  }

  function descentPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    // Build contour grid for L(a,b) = (a-3)^2 + (b+1)^2
    var aa = []; var bb = []; var zz = [];
    for (var i=0;i<=40;i++){ aa.push(-1 + 6*i/40); }
    for (var j=0;j<=40;j++){ bb.push(-4 + 6*j/40); }
    for (var j=0;j<=40;j++){
      var row = [];
      for (var i=0;i<=40;i++){
        var a=aa[i], b=bb[j];
        row.push((a-3)*(a-3) + (b+1)*(b+1));
      }
      zz.push(row);
    }
    // Trajectory of gradient descent with lr=0.1, 20 steps
    var ax = [0]; var bx = [0];
    var a=0, b=0, lr=0.1;
    for (var k=0;k<20;k++){
      var ga = 2*(a-3); var gb = 2*(b+1);
      a = a - lr*ga; b = b - lr*gb;
      ax.push(a); bx.push(b);
    }
    var contour = {x: aa, y: bb, z: zz, type:'contour', colorscale:[[0, 'rgba(200,169,110,0.05)'],[0.5,'rgba(200,169,110,0.3)'],[1,'rgba(200,169,110,0.7)']], showscale:false, contours:{coloring:'lines'}};
    var traj = {x: ax, y: bx, mode:'lines+markers', type:'scatter',
                line:{color:'#4ecdc4', width:3},
                marker:{size:8, color:'#4ecdc4', line:{color:'rgba(255,255,255,0.4)', width:1}},
                name: lang==='tr'?'Gradyan inişi':'Gradient descent'};
    var minPt = {x:[3], y:[-1], mode:'markers', type:'scatter',
                 marker:{size:18, color:'#f87171', symbol:'star', line:{color:'white',width:2}},
                 name: lang==='tr'?'Minimum (3,-1)':'Minimum (3,-1)'};
    var layout = Object.assign({}, common, {
      title:{text: lang === 'tr' ? 'Gradyan İnişi: L(a,b) = (a-3)^2 + (b+1)^2' : 'Gradient Descent: L(a,b) = (a-3)^2 + (b+1)^2', font:{color:T.text,size:14}},
      xaxis:{title:'a', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:'b', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [contour, traj, minPt], layout, {responsive:true, displayModeBar:false});
  }

  graphPlot('plot-pl2-graph-en', 'en');
  descentPlot('plot-pl2-descent-en', 'en');
  graphPlot('plot-pl2-graph-tr', 'tr');
  descentPlot('plot-pl2-descent-tr', 'tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Autograd, PyTorch'u hızlı bir NumPy'dan derin öğrenme kütüphanesine dönüştüren tek özelliktir.</strong> 1. Derste minik bir lineer model için gradyanları elle hesapladınız. Bu bir ağırlık ve bir bias için işe yarar; yüzlerce milyon parametre ve onlarca lineer olmayanlığa sahip bir transformer için umutsuz. Autograd ileri geçişinizi izler, her işlemin yönlendirilmiş bir grafiğini kurar ve <code>.backward()</code>'u çağırdığınızda her gradyanı hesaplamak için o grafiği tersten dolaşır -- zincir kuralı, ama bedava.</p>

<p class="l-text">Bu ders size zihinsel modeli öğretir: bir hesaplama grafiği <code>requires_grad=True</code> olan tensor'larda çalıştırdığınız işlemlerden dinamik olarak inşa edilir; <code>.backward()</code> onu dolaşır; <code>.grad</code> sonucu saklar. Sisteme güvenmeniz için minik bir örneği elle türeteceğiz, sonra <code>detach</code>, <code>no_grad</code>, gradyan birikimi ve en yaygın autograd tuzaklarını keşfedeceğiz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Girdi tensor'larına <code>requires_grad=True</code> vererek dinamik hesaplama grafiği kurmayı</li>
<li><code>loss.backward()</code> ile gradyan hesaplamayı ve <code>.grad</code> alanından okumayı</li>
<li>Minik bir lineer modeli elle türeterek autograd'in çıkardığı sayıları doğrulamayı</li>
<li>Inference sırasında gradyan akışını durdurmak için <code>detach()</code> ve <code>torch.no_grad()</code> kullanmayı</li>
<li>Eğitim döngüsünde <code>.grad</code> birikimini <code>optimizer.zero_grad()</code> ile doğru yönetmeyi</li>
<li>Yaygın tuzakları teşhis etmeyi: in-place işlemler, leaf tensor hataları, retained graph</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Hesaplama Grafiği Sezgisi</h2>

<p class="l-text"><code>requires_grad=True</code> olan bir tensor içeren her PyTorch işlemi kendini gizli bir grafiğe kaydeder. Her düğüm bir tensor; her kenar onu üreten işlemdir. Kayıp hesaplandığında üzerinde <code>.backward()</code> çağırırsınız ve PyTorch grafiği kayıptan girdilere doğru geriye dolaşır, her düğümde zincir kuralını uygular.</p>

<div class="calc-highlight"><strong>Zincir kuralı, tek cümlede:</strong> bir fonksiyon daha basit fonksiyonların bileşkesi ise türevi, daha basit fonksiyonların türevlerinin çarpımıdır. Autograd bunu mekanik olarak uygular. Siz forward'ı tanımlarsınız; PyTorch backward'ı üretir.</div>

<div class="katex-block">$$y = f(g(h(x))) \\;\\Rightarrow\\; \\frac{dy}{dx} = \\frac{df}{dg}\\cdot\\frac{dg}{dh}\\cdot\\frac{dh}{dx}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x</div><div class="card-body">Girdi tensor'u, gradyan istediğimiz değişken.</div></div>
<div class="calc-card"><div class="card-title">h, g, f</div><div class="card-body">Ara fonksiyonlar. Gerçek bir ağda bunlar lineer katmanlar, aktivasyonlar, dikkat vb.</div></div>
<div class="calc-card"><div class="card-title">y</div><div class="card-body">Son çıktı (kayıp). Argümansız <code>.backward()</code> çağırmak için skaler olmalıdır.</div></div>
<div class="calc-card"><div class="card-title">dy/dx</div><div class="card-body">Gradyan -- x değiştiğinde y'nin ne kadar değiştiği. Yol boyunca yerel türevlerin çarpımı.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: minik bir hesaplama</div><div class="example-body"><code>x = 3.0</code> alın, sonra <code>h = x^2 = 9</code>, <code>g = h + 1 = 10</code>, <code>y = 2g = 20</code>. Zincir kuralı: dy/dg = 2, dg/dh = 1, dh/dx = 2x = 6. Yani dy/dx = 2 * 1 * 6 = 12. PyTorch tam olarak bunu hesaplayacak -- birazdan kodda göreceksiniz.</div></div>

<div class="think-box"><div class="think-label">DİNAMİK vs STATİK GRAFİKLER</div><div class="think-body">TensorFlow 1 gibi eski çerçeveler tüm grafiği önceden bildirmenizi, sonra çalıştırmanızı gerektiriyordu. PyTorch ileri geçişi <em>çalıştırırken</em> grafiği inşa eder. Buna <em>dinamik hesaplama</em> denir ve iki büyük avantajı vardır: (1) ileri geçişin içinde Python kontrol akışı (if, for, while) kullanabilirsiniz ve sadece çalışır, (2) hata ayıklama kolaydır çünkü hatalar kodunuzdaki tam satırı işaret eder. Karşılığında işlem başına minik bir ek yük vardır ki JIT derlemesi (TorchScript, torch.compile) gerektiğinde bunu geri kazanabilir.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. requires_grad ve .backward()</h2>

<p class="l-text">Yeni oluşturulmuş bir tensor varsayılan olarak gradyanları takip etmez. Oluşturmada <code>requires_grad=True</code> ile (veya sonradan <code>.requires_grad_()</code> ile) buna katılırsınız. Bir tensor gradyanları takip etmeye başladığında, onu tüketen her işlem aynı zamanda gradyanları takip eden bir tensor üretir, grafiği inşa eder.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># 1) Oluşturmada autograd'e katıl</span>
x = torch.<span class="fn">tensor</span>(<span class="num">3.0</span>, requires_grad=<span class="kw">True</span>)
<span class="fn">print</span>(x.requires_grad)        <span class="cm"># True</span>
<span class="fn">print</span>(x.grad)                 <span class="cm"># None -- gradyan henüz hesaplanmadı</span>

<span class="cm"># 2) Küçük bir ifade grafiği inşa et: y = 2 * (x^2 + 1)</span>
h = x ** <span class="num">2</span>          <span class="cm"># h = 9.0</span>
g = h + <span class="num">1</span>           <span class="cm"># g = 10.0</span>
y = <span class="num">2</span> * g           <span class="cm"># y = 20.0</span>
<span class="fn">print</span>(y)            <span class="cm"># tensor(20., grad_fn=&lt;MulBackward0&gt;)</span>
<span class="fn">print</span>(y.grad_fn)    <span class="cm"># &lt;MulBackward0&gt; -- y'yi üreten işlem</span>

<span class="cm"># 3) Grafiği geriye doğru dolaşarak gradyanları hesapla</span>
y.<span class="fn">backward</span>()        <span class="cm"># x.grad'ı doldurur</span>
<span class="fn">print</span>(x.grad)       <span class="cm"># tensor(12.) -- elle hesapladığımız dy/dx ile aynı</span>

<span class="cm"># 4) Çoklu girdiler</span>
a = torch.<span class="fn">tensor</span>(<span class="num">2.0</span>, requires_grad=<span class="kw">True</span>)
b = torch.<span class="fn">tensor</span>(<span class="num">5.0</span>, requires_grad=<span class="kw">True</span>)
loss = (a * b + a ** <span class="num">2</span>).<span class="fn">sum</span>()
loss.<span class="fn">backward</span>()
<span class="fn">print</span>(a.grad)       <span class="cm"># b + 2a = 5 + 4 = 9</span>
<span class="fn">print</span>(b.grad)       <span class="cm"># a = 2</span>

<span class="cm"># 5) Vektör değerli girdiler ve skaler kayıp</span>
w = torch.<span class="fn">randn</span>(<span class="num">3</span>, requires_grad=<span class="kw">True</span>)
x_in = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">3.0</span>])
loss = (w * x_in).<span class="fn">sum</span>()       <span class="cm"># &lt;w, x&gt; -- skaler</span>
loss.<span class="fn">backward</span>()
<span class="fn">print</span>(w.grad)                 <span class="cm"># x_in'e eşittir -- d(&lt;w,x&gt;)/dw = x</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy ile elle bir gradyan hesaplıyoruz: f(w) = (w*x - y)^2 tanımla ve zincir kuralını elle uygula. Autograd'ın otomatize ettiği matematik tam olarak bu.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Forward
x = np.array([1.0, 2.0, 3.0])
y = np.array([2.0, 4.0, 7.0])
w = 1.5

pred = w * x
err  = pred - y
loss = (err ** 2).mean()

# Hand-derived backward: d loss / d w = mean( 2 * err * x )
grad_w = (2 * err * x).mean()

print(f'loss     = {loss:.4f}')
print(f'grad_w   = {grad_w:.4f}   (autograd would give the same)')

# One gradient-descent step
lr = 0.1
w_new = w - lr * grad_w
loss_new = ((w_new * x - y) ** 2).mean()
print(f'w  before = {w:.3f},  loss = {loss:.4f}')
print(f'w  after  = {w_new:.3f},  loss = {loss_new:.4f}')</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Autograd etkin yaprak tensor <code>x</code> oluşturur. <code>x.grad</code> henüz backward çağrılmadığı için <code>None</code>'dır. 2) Üç işlemden oluşan bir zincir kurar. <code>y</code>'nin bir <code>grad_fn</code> eklendiğine dikkat edin -- bu PyTorch'un "buraya çarpma yoluyla geldiniz" hatırlamasıdır; backward çalıştığında bunları doğru yerel türevleri uygulamak için kullanır. 3) <code>y.backward()</code> grafiği <code>y</code>'den <code>x</code>'e doğru dolaşır, yol boyunca yerel türevleri çarpar. Sonuç 12, manuel zincir kuralı türetmesiyle eşleşir. 4) Çoklu girdilerle <code>.backward()</code> çağrısı her yaprağın <code>.grad</code>'ını aynı anda doldurur -- bir backward geçişi, tüm gradyanlar. 5) Skaler kayıp <code>L = w . x</code> için <code>w</code>'ya göre gradyan sadece <code>x</code>'tir; PyTorch bunu <code>w.grad == x_in</code> ile doğrular. Bu, gradyan inişin modelinizdeki her ağırlıkta kullandığı mekanizmadır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">requires_grad</div><div class="card-body">Boolean nitelik. Yaprak tensor'larda ayarlanır (parametreler, gradyan istediğiniz girdiler). Yayılır: gradyan takip eden bir girdiyle yapılan işlemin çıktısı da gradyan takip eder.</div></div>
<div class="calc-card"><div class="card-title">grad_fn</div><div class="card-body">Bu yaprak olmayan tensor'u üreten fonksiyon. Yerel türevleri uygulamak için backward tarafından kullanılır.</div></div>
<div class="calc-card"><div class="card-title">.backward()</div><div class="card-body">Ters dolaşmayı tetikler. Skaler üzerinde çağrılmalı (veya vektör çıktılar için <code>gradient=</code> tensor geçin).</div></div>
<div class="calc-card"><div class="card-title">.grad</div><div class="card-body">Hesaplanan gradyanın saklandığı yer, her yaprakta. Yaprakla aynı şekle sahiptir.</div></div>
<div class="calc-card"><div class="card-title">Yaprak tensor</div><div class="card-body">Kullanıcının oluşturduğu <code>requires_grad=True</code> olan tensor. Backward'da grafik burada sonlanır.</div></div>
<div class="calc-card"><div class="card-title">Yaprak olmayan tensor</div><div class="card-body">Bir işlemin sonucu. <code>grad_fn</code>'i takip eder. Varsayılan olarak <code>.retain_grad()</code> çağırmadıkça kendi gradyanını TUTMAZ.</div></div>
</div>

<div id="plot-pl2-graph-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> <code>y = 2 * (x^2 + 1)</code> için hesaplama grafiğinin şematiği. İleri oklar soldan sağa gider (girdiden çıktıya); geriye oklar sağdan sola gider ve zincir kuralı çarpımını biriktirir. Her düğüm küçük bir durum saklar: yerel Jacobian. <code>y.backward()</code> çağırdığınızda PyTorch sağdan sola okları dolaşır ve yerel türevleri çarpar, en soldaki düğümde <code>dy/dx</code> ile sonuçlanır.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Bir Lineer Katman Gradyanını Elle Türetme</h2>

<p class="l-text">Autograd'e güvenmek için elle gerçek bir örnek türetin ve sayıları kontrol edin. Bunu en basit öğrenilebilir fonksiyonla tam olarak yapıyoruz: bir lineer katman ve ardından ortalama kare hata.</p>

<div class="katex-block">$$\\hat{y} = wx + b, \\quad L = \\frac{1}{N}\\sum_{i=1}^{N}(\\hat{y}_i - y_i)^2$$</div>

<p class="l-text">Zincir kuralıyla kısmi türevleri al:</p>

<div class="katex-block">$$\\frac{\\partial L}{\\partial w} = \\frac{2}{N}\\sum_i (\\hat{y}_i - y_i)\\,x_i, \\quad \\frac{\\partial L}{\\partial b} = \\frac{2}{N}\\sum_i (\\hat{y}_i - y_i)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">w, b</div><div class="card-body">Skaler ağırlık ve bias -- optimize ettiğimiz parametreler.</div></div>
<div class="calc-card"><div class="card-title">x_i, y_i</div><div class="card-body">i. örnek için girdi özelliği ve hedef.</div></div>
<div class="calc-card"><div class="card-title">y_hat_i</div><div class="card-body">i. örnek için model tahmini.</div></div>
<div class="calc-card"><div class="card-title">L</div><div class="card-body">N örnek üzerinde ortalama kare hata; minimize ettiğimiz skaler.</div></div>
<div class="calc-card"><div class="card-title">2/N</div><div class="card-body">Kareli terimi ve ortalamayı türevlemekten gelen sabit.</div></div>
<div class="calc-card"><div class="card-title">(y_hat - y)</div><div class="card-body">Örnek başına kalıntı; dL/dw için x ile çarpılır ve dL/db için toplanır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)
N = <span class="num">10</span>
X = torch.<span class="fn">randn</span>(N)
y = <span class="num">3</span> * X + <span class="num">2</span> + <span class="num">0.1</span> * torch.<span class="fn">randn</span>(N)

<span class="cm"># Autograd'li parametreler</span>
w = torch.<span class="fn">tensor</span>(<span class="num">0.0</span>, requires_grad=<span class="kw">True</span>)
b = torch.<span class="fn">tensor</span>(<span class="num">0.0</span>, requires_grad=<span class="kw">True</span>)

<span class="cm"># İleri</span>
y_hat = w * X + b
loss  = ((y_hat - y) ** <span class="num">2</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"loss = {loss.item():.4f}"</span>)

<span class="cm"># Autograd</span>
loss.<span class="fn">backward</span>()
<span class="fn">print</span>(f<span class="str">"autograd dL/dw = {w.grad.item():.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"autograd dL/db = {b.grad.item():.6f}"</span>)

<span class="cm"># Manuel hesaplama -- tam olarak eşleşmeli</span>
manual_dw = (<span class="num">2</span> / N) * ((y_hat - y) * X).<span class="fn">sum</span>().<span class="fn">item</span>()
manual_db = (<span class="num">2</span> / N) * (y_hat - y).<span class="fn">sum</span>().<span class="fn">item</span>()
<span class="fn">print</span>(f<span class="str">"manuel   dL/dw = {manual_dw:.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"manuel   dL/db = {manual_db:.6f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bir lineer katmanın gradyanını yeniden türetiyoruz: y = x @ W + b. Kapalı form (dL/dW = x.T @ dL/dy) autograd'ın C++ ile sağladığının aynısı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
x = rng.standard_normal((4, 5))      # batch=4, in=5
W = rng.standard_normal((5, 3))      # in=5, out=3
b = np.zeros(3)
y_true = rng.standard_normal((4, 3))

# Forward
y_hat = x @ W + b
loss  = ((y_hat - y_true) ** 2).mean()

# Backward (closed form)
dL_dy = 2 * (y_hat - y_true) / y_true.size   # (4, 3)
dL_dW = x.T @ dL_dy                          # (5, 3)
dL_db = dL_dy.sum(axis=0)                    # (3,)
dL_dx = dL_dy @ W.T                          # (4, 5)

print(f'loss   = {loss:.4f}')
print('shapes -> dW', dL_dW.shape, 'db', dL_db.shape, 'dx', dL_dx.shape)
print('||dW|| =', np.linalg.norm(dL_dW).round(3))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>y = 3x + 2 + gürültü</code>'den 10 sentetik örnek oluşturur. 2) Autograd ile <code>w = 0</code>, <code>b = 0</code> başlatır; ikisi de optimize edilecek. 3) İleri geçişi ve skaler kaybı hesaplar; PyTorch sessizce her çarpma, toplama, kare alma ve ortalama almayı grafikteki düğümler olarak kaydeder. 4) <code>loss.backward()</code> çağırır, kaydedilen grafiği skaler kayıptan yapraklar <code>w</code> ve <code>b</code>'ye geri dolaşır, her birinde gradyanı biriktirir. 5) Aynı gradyanı türettiğimiz kapalı form ifadesini kullanarak elle hesaplar. 6) İkisini de yazdırır -- yaklaşık altı ondalık basamağa kadar uyuşacaklar, çünkü tek fark kayan nokta aritmetiğidir. Bu eşleşme, gradyan türetmeyi sonsuza dek bırakmanıza izin veren matematiksel garantidir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: autograd kullanarak gradyan iniş döngüsü</div><div class="example-body">Tam bir eğitim döngüsü sadece şudur: (1) eski gradyanları temizlemek için <code>w.grad.zero_()</code>, (2) kaybı hesapla, (3) <code>loss.backward()</code>, (4) <code>w.data -= lr * w.grad</code>. Döngü. 4 satırda tüm derin öğrenme eğitim algoritması bu. Geri kalan her şey (optimizer'lar, scheduler'lar, karışık hassasiyet) performans cilasıdır.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. detach(), torch.no_grad() ve Bellek</h2>

<p class="l-text">Bazen bir tensor ile işlemi grafiğe kaydetmeden hesaplamak istersiniz. Üç sebep: değerlendirme/çıkarım (backward gerekmez, bellek tasarrufu), modelin parçalarını dondurmak ve metrik hesaplama. PyTorch bunun için size birkaç araç verir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

x = torch.<span class="fn">tensor</span>(<span class="num">2.0</span>, requires_grad=<span class="kw">True</span>)

<span class="cm"># 1) detach -- veriyi paylaşan ama grafiğin DIŞINDA olan yeni tensor döner</span>
y = x ** <span class="num">2</span>          <span class="cm"># grafikte</span>
z = y.<span class="fn">detach</span>()      <span class="cm"># aynı değer, grad_fn yok</span>
<span class="fn">print</span>(y.requires_grad, y.grad_fn)   <span class="cm"># True, &lt;PowBackward0&gt;</span>
<span class="fn">print</span>(z.requires_grad, z.grad_fn)   <span class="cm"># False, None</span>

<span class="cm"># 2) torch.no_grad() bağlamı -- içerideki her şey grafiksiz</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    a = x * <span class="num">5</span>
    <span class="fn">print</span>(a.requires_grad)          <span class="cm"># False</span>
    <span class="cm"># Yaygın kalıp: değerlendirme</span>
    <span class="cm"># for batch in val_loader:</span>
    <span class="cm">#     out = model(batch.x)</span>
    <span class="cm">#     metric.update(out, batch.y)</span>

<span class="cm"># 3) torch.inference_mode() -- no_grad gibi ama daha da hızlı (PyTorch 1.9+)</span>
<span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
    out = x * <span class="num">5</span>

<span class="cm"># 4) Grafiği kirletmemek için no_grad içinde manuel parametre güncellemeleri</span>
w = torch.<span class="fn">randn</span>(<span class="num">3</span>, requires_grad=<span class="kw">True</span>)
loss = (w ** <span class="num">2</span>).<span class="fn">sum</span>()
loss.<span class="fn">backward</span>()
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    w -= <span class="num">0.1</span> * w.grad     <span class="cm"># güncelleme; takip edilmez</span>
    w.grad.<span class="fn">zero_</span>()        <span class="cm"># sonraki adım için gradyan tamponunu sıfırla</span>

<span class="cm"># 5) Dekoratör formu -- tüm fonksiyon grafiksiz</span>
<span class="at">@torch.no_grad</span>()
<span class="kw">def</span> <span class="fn">evaluate</span>(model, x):
    <span class="kw">return</span> <span class="fn">model</span>(x)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">detach() == 'değeri kullan, geçmişini takip etme'. NumPy ile aynısını taklit ediyoruz: bir değeri sabit dizi olarak saklamak autograd bağlantısını kırar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Track a 'graph' manually: keep grad function in a tuple
class Var:
    def __init__(self, v, parents=()): self.v, self.parents = v, parents

x = Var(np.array([2.0, 3.0]))
y = Var(x.v * 5.0, parents=(x,))   # y depends on x
z = Var(y.v + 1.0, parents=(y,))   # z depends on y

# detach: take the value, drop the parent links
y_det = Var(y.v.copy())
z2    = Var(y_det.v + 1.0, parents=(y_det,))

print('z  parents (full graph) :', len(z.parents))
print('z2 parents (after detach):', len(z2.parents))
print('values still equal:', np.allclose(z.v, z2.v))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>y.detach()</code> aynı sayısal değere ama <code>grad_fn</code> olmayan yeni bir tensor döner -- artık "geçmişsiz bir yaprak"tır. Bir tensor'un değerine ihtiyaç duyduğunuzda ama gradyanların ondan akmasını istemediğinizde detach kullanırsınız (örneğin öğretmen-öğrenci damıtmasında hedef etiketler). 2) <code>torch.no_grad()</code> bloğunun içinde grafik inşasını devre dışı bırakan bir bağlam yöneticisidir; backward'in asla çağrılmayacağı değerlendirme ve çıkarım için mükemmeldir. 3) <code>torch.inference_mode()</code> daha katı, daha hızlı bir versiyondur: bazı ek varsayımlar yapar ve daha fazla muhasebeyi atlar. Üretim çıkarımı için kullanın. 4) Manuel SGD adımı yazdığınızda güncellemeyi <code>no_grad</code> içine sararsınız ki <code>w -= ...</code> ataması grafiğe eklenmez -- aksi halde eğitim adımları boyunca sürekli büyüyen bir grafik kurarsınız. 5) <code>@torch.no_grad()</code> dekoratör olarak aynı kuralı tüm fonksiyona uygular; değerlendirme yardımcı programları için deyimseldir.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">.detach()</div><div class="compare-item">YENİ bir tensor döner</div><div class="compare-item">Aynı veri tamponu (sıfır kopya)</div><div class="compare-item">grad_fn yok, üzerinden backward yok</div><div class="compare-item">Ara değerleri "dondurmak" için kullan</div><div class="compare-item">Damıtmada hedef tensor'lar için yaygın</div></div>
<div class="compare-col"><div class="compare-title">torch.no_grad()</div><div class="compare-item">Bağlam yöneticisi / dekoratör</div><div class="compare-item">Kapsamda grafik inşasını devre dışı bırakır</div><div class="compare-item">Bellek ve zaman tasarrufu</div><div class="compare-item">Eval, çıkarım, manuel güncellemeler için kullan</div><div class="compare-item">TensorFlow'un "training=False" ile aynı kavram</div></div>
</div>

<div class="l-warn"><strong>Tuzak (autograd belleği):</strong> Değerlendirme sırasında <code>no_grad</code>'i unutmak doğrulama sırasındaki bir numaralı OOM sebebidir. Her ileri geçiş bir grafik inşa eder ve backward olmadan birçok ileri geçiş yaparsanız, o grafikler birikir ve GPU belleğini tüketir. Değerlendirme döngünüzü her zaman <code>with torch.no_grad():</code> ile sarın.</div>

<div class="l-note"><strong>Peki <code>.data</code>?</strong> Eski kod autograd'siz ham tensor'u almak için <code>x.data</code> kullanır. Bu hâlâ çalışır ama güvenli değildir -- grafiği sessizce bozabilir. <code>x.detach()</code> modern, doğru değişimdir.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Gradyan Birikimi: .grad ne zaman hayatta kalır</h2>

<p class="l-text">PyTorch gradyanları üzerine yazmak yerine <code>.grad</code> içine <em>biriktirir</em>. Bu tasarımdandır -- büyük bir batch'i daha küçük parçalara bölmenize izin verir. Ama bu aynı zamanda her backward'dan önce gradyanları sıfırlamanız gerektiği anlamına gelir, yoksa güncellemeleriniz yanlış olur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

w = torch.<span class="fn">tensor</span>(<span class="num">2.0</span>, requires_grad=<span class="kw">True</span>)

<span class="cm"># Sıfırlamadan iki backward çağrısı -- gradyanlar toplanır</span>
loss1 = (w ** <span class="num">2</span>).<span class="fn">sum</span>()    <span class="cm"># dL/dw = 2w = 4</span>
loss1.<span class="fn">backward</span>()
<span class="fn">print</span>(w.grad)              <span class="cm"># tensor(4.)</span>

loss2 = (<span class="num">3</span> * w).<span class="fn">sum</span>()      <span class="cm"># dL/dw = 3</span>
loss2.<span class="fn">backward</span>()
<span class="fn">print</span>(w.grad)              <span class="cm"># tensor(7.) -- 4 + 3, biriktirildi!</span>

<span class="cm"># Çözüm: her adımdan önce grad'i sıfırla</span>
w.grad.<span class="fn">zero_</span>()
loss3 = (w ** <span class="num">2</span>).<span class="fn">sum</span>()
loss3.<span class="fn">backward</span>()
<span class="fn">print</span>(w.grad)              <span class="cm"># tensor(4.) -- taze</span>

<span class="cm"># Gerçek eğitim döngüsü kalıbı</span>
<span class="cm"># for x, y in loader:</span>
<span class="cm">#     optimizer.zero_grad()    # her parametrenin .grad'ını sıfırla</span>
<span class="cm">#     loss = model(x, y)</span>
<span class="cm">#     loss.backward()</span>
<span class="cm">#     optimizer.step()         # güncellemeyi uygula</span>
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Gradyan birikimi = 'adımlar arasında sıfırlama'. NumPy ile bir batch'in gradyanlarını ağırlık adımı atmadan önce topluyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(1)
X = rng.standard_normal((20, 4))
y = rng.standard_normal(20)
w = np.zeros(4)
lr = 0.05

# Process 4 mini-batches of 5 each, accumulate grad before stepping
grad_acc = np.zeros_like(w)
for bi in range(4):
    xb = X[bi*5:(bi+1)*5]
    yb = y[bi*5:(bi+1)*5]
    pred = xb @ w
    grad = 2 * xb.T @ (pred - yb) / xb.shape[0]
    grad_acc += grad
    print(f'batch {bi}: ||grad_acc|| = {np.linalg.norm(grad_acc):.4f}')

# Single update with the accumulated grad
w -= lr * (grad_acc / 4)
print('updated w:', w.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>loss1 = w^2</code> üzerinde backward çağırır, gradyan 2w = 4. 2) Sıfırlama olmadan farklı bir kayıp <code>loss2 = 3w</code> üzerinde backward çağırır, gradyanı 3 -- ama <code>w.grad</code> artık 7, ikisinin toplamı. PyTorch yeni gradyanı mevcut olana ekledi. 3) <code>w.grad.zero_()</code>'dan sonra bir sonraki backward temiz bir 4 verir. 4) Standart eğitim döngüsü her yinelemenin başında her parametrenin <code>.grad</code>'ını sıfırlamak için <code>optimizer.zero_grad()</code> çağırır. Bu tek satırı unutmak başlangıç PyTorch kodundaki en yaygın hatalardan biridir -- gradyanlar büyümeye devam ettiği için eğitim sessizce ıraksar.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: dev batch'ler için gradyan birikimi</div><div class="example-body">Etkili batch boyutu 64 istediğinizi ama GPU belleğine sadece 8 örnek sığdığını varsayın. Hile: aralarda sıfırlama <em>yapmadan</em> 8 mini-batch üzerinde 8 ileri+geri geçiş yapın, sonra <code>optimizer.step()</code> + <code>optimizer.zero_grad()</code> çağırın. 8 backward'dan sonraki <code>.grad</code>, 8 mini-batch gradyanının toplamıdır ki bu 64'lük tek bir batch'ten alacağınız şeydir (1/64 vs 1/8 normalleştirmeye kadar). Bu hile araştırmacıların BERT'i tek bir GPU'da nasıl eğittiğidir.</div></div>

<div class="l-warn"><strong>Tuzak:</strong> Her zaman <code>optimizer.step()</code>'i <code>optimizer.zero_grad()</code> ile eşleyin. Bazıları zero_grad'i döngünün altına, bazıları üstüne koyar -- ikisi de çalışır ama birini seçin ve buna sadık kalın. Betikler arası karıştırmak yanlışlıkla 2x veya 0.5x güncelleme yapmanın yoludur.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Gradyan İnişini Görselleştirme</h2>

<p class="l-text">Autograd size gradyanı verir. Gradyan inişi onu kullanır: negatif gradyan yönünde bir adım at, tekrarla. Geometri açık olsun diye bunun 2 boyutlu bir kayıp manzarası üzerinde olmasını izleyelim.</p>

<div class="katex-block">$$\\theta_{t+1} = \\theta_t - \\eta\\,\\nabla_\\theta L(\\theta_t)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">theta</div><div class="card-body">Optimize edilen parametreler (ağırlıklar, bias'lar). t adımında theta_t var.</div></div>
<div class="calc-card"><div class="card-title">eta</div><div class="card-body">Öğrenme oranı -- ne kadar büyük adım atılacağı. Çok büyük ıraksar; çok küçük emekler.</div></div>
<div class="calc-card"><div class="card-title">grad L</div><div class="card-body">Kaybın gradyanı; autograd'in tek çağrıda sizin için hesapladığı şey.</div></div>
<div class="calc-card"><div class="card-title">- işareti</div><div class="card-body">Gradyanın tersine hareket ederiz çünkü gradyan yokuş yukarıyı işaret eder; biz aşağıyı isteriz.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># 2 boyutlu kuadratik kayıp: L(a, b) = (a - 3)^2 + (b + 1)^2</span>
<span class="cm"># Minimum (a, b) = (3, -1)'de</span>
a = torch.<span class="fn">tensor</span>(<span class="num">0.0</span>, requires_grad=<span class="kw">True</span>)
b = torch.<span class="fn">tensor</span>(<span class="num">0.0</span>, requires_grad=<span class="kw">True</span>)
lr = <span class="num">0.1</span>

trajectory = []
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">40</span>):
    <span class="kw">if</span> a.grad <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>: a.grad.<span class="fn">zero_</span>()
    <span class="kw">if</span> b.grad <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>: b.grad.<span class="fn">zero_</span>()
    loss = (a - <span class="num">3</span>) ** <span class="num">2</span> + (b + <span class="num">1</span>) ** <span class="num">2</span>
    loss.<span class="fn">backward</span>()
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        a -= lr * a.grad
        b -= lr * b.grad
    trajectory.<span class="fn">append</span>((a.<span class="fn">item</span>(), b.<span class="fn">item</span>(), loss.<span class="fn">item</span>()))

<span class="fn">print</span>(<span class="str">"son:"</span>, a.<span class="fn">item</span>(), b.<span class="fn">item</span>())   <span class="cm"># (3, -1)'e yakın</span>
<span class="fn">print</span>(<span class="str">"kayıp :"</span>, trajectory[-<span class="num">1</span>][<span class="num">2</span>])    <span class="cm"># 0'a yakın</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">1B kuadratik kayıpta gradyan inişini görselleştir. Her adım parametreyi gradyanın tersine taşır -- backprop'un sürdüğü dinamik aynısı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Loss L(w) = (w - 3)^2
def loss_fn(w): return (w - 3) ** 2
def grad_fn(w): return 2 * (w - 3)

w = -2.0
lr = 0.1
history = []
for step in range(30):
    history.append((w, loss_fn(w)))
    w = w - lr * grad_fn(w)

print('step  w       loss')
for s, (wi, li) in enumerate(history[::3]):
    print(f'{s*3:3d}  {wi:6.3f}  {li:6.3f}')
print(f'final w = {w:.3f}  (true min = 3.0)')</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>(3, -1)</code>'de bilinen bir minimumla kuadratik bir kayıp tanımlar; bu en basit önemsiz olmayan 2 boyutlu manzaradır. 2) Parametreleri orijinde <code>(0, 0)</code> başlatır. 3) 40 adım döngüye girer; her adım gradyanları sıfırlar, ileri grafiği inşa eder, <code>backward()</code> çağırır ve <code>no_grad</code> içinde bir gradyan iniş adımıyla parametreleri günceller. 4) Çizim için tuple üçlüleri listesi olarak yörüngeyi kaydeder. 5) 40 adımdan sonra parametreler <code>(3, -1)</code> civarına iner ve kayıp sıfıra yakındır -- kase şeklindeki bir manzarada "yokuş aşağı yuvarlanmanın" klasik geometrik resmidir.</p>

<div id="plot-pl2-descent-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> <code>L(a,b) = (a-3)^2 + (b+1)^2</code> kayıp manzarası kontur haritası olarak, üzerine gradyan inişin yörüngesi konulmuş. Her ok bir güncelleme adımı. Yolun minimuma doğru nasıl büküldüğüne, öğrenme oranı ılımlı olduğu için aşmadığına dikkat edin. Çok büyük öğrenme oranıyla yol salınır ve ıraksar; çok küçük olanla zar zor hareket eder. Öğrenme oranını ayarlamak derin öğrenmedeki en önemli tek hiperparametredir.</div>

<div class="think-box"><div class="think-label">YA MANZARA KASE DEĞİLSE?</div><div class="think-body">Gerçek derin öğrenme kayıpları konveks kaseler değildir -- sırtları, eyerleri, platoları ve birçok yerel minimumu vardır. Sade gradyan iniş takılır veya salınır. Bu yüzden daha iyi optimizer'lar kullanırız: momentum'lu SGD yörüngeyi yumuşatır, Adam adımı parametre başına uyarlar, öğrenme oranı çizelgeleri zaman içinde adımı söndürür. Ders 5 hepsini kapsar. Autograd temel olarak kalır -- size gradyanı verir; onunla ne yapacağınız optimizer'ın işidir.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Yüksek Mertebeli Gradyanlar ve create_graph</h2>

<p class="l-text">Bazen bir gradyanın gradyanına ihtiyacınız vardır -- gelişmiş optimizasyon için ikinci türevler veya kendisi gradyan içeren kayıplar (WGAN-GP'de gradyan cezası, MAML meta-öğrenme). PyTorch bunu backward'da <code>create_graph=True</code> ile destekler ki bu backward grafiğinin kendisini türevlenebilir yapar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

x = torch.<span class="fn">tensor</span>(<span class="num">2.0</span>, requires_grad=<span class="kw">True</span>)
y = x ** <span class="num">3</span>                                <span class="cm"># y = 8</span>

<span class="cm"># Birinci türev: dy/dx = 3x^2 = 12</span>
y.<span class="fn">backward</span>(create_graph=<span class="kw">True</span>)
first = x.grad                            <span class="cm"># tensor(12., grad_fn=&lt;...&gt;) -- kendisi türevlenebilir!</span>
<span class="fn">print</span>(first)

<span class="cm"># İkinci türev: d2y/dx2 = 6x = 12</span>
x.grad = <span class="kw">None</span>    <span class="cm"># sıfırla (first bir referans tuttuğu için)</span>
first.<span class="fn">backward</span>()
<span class="fn">print</span>(x.grad)    <span class="cm"># tensor(12.)</span>

<span class="cm"># Daha temiz API: torch.autograd.grad</span>
x = torch.<span class="fn">tensor</span>(<span class="num">2.0</span>, requires_grad=<span class="kw">True</span>)
y = x ** <span class="num">3</span>
g1 = torch.autograd.<span class="fn">grad</span>(y, x, create_graph=<span class="kw">True</span>)[<span class="num">0</span>]   <span class="cm"># 12</span>
g2 = torch.autograd.<span class="fn">grad</span>(g1, x)[<span class="num">0</span>]                     <span class="cm"># 12</span>
<span class="fn">print</span>(g1, g2)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sonlu farklar ile yüksek mertebeli türevler -- f(x) = x^3'ün x=2'deki ikinci türevi 12 olmalı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def f(x):    return x ** 3
def f1(x):   return 3 * x ** 2     # known first derivative
def f2(x):   return 6 * x          # known second derivative

x = 2.0
h = 1e-4

# Numerical first derivative
df_num = (f(x + h) - f(x - h)) / (2 * h)
# Numerical second derivative
d2f_num = (f(x + h) - 2 * f(x) + f(x - h)) / (h ** 2)

print(f'f(x)  exact = {f(x):.6f}')
print(f"f'(x)  exact = {f1(x):.6f},  numerical = {df_num:.6f}")
print(f"f''(x) exact = {f2(x):.6f},  numerical = {d2f_num:.6f}")
print('higher-order autograd does this analytically and exactly.')</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>x=2</code>'de <code>y = x^3</code> hesaplar, yani <code>y=8</code>. 2) <code>create_graph=True</code> ile backward çağırır -- bu sadece <code>x.grad</code>'ı doldurmakla kalmaz, aynı zamanda backward hesaplamasını tekrar türevleyebileceğimiz bir grafik olarak tutar. 3) Birinci türev 12'dir ve önemlisi kendi <code>grad_fn</code>'ine sahiptir, yani <em>onun</em> üzerinde backward çağırabiliriz. 4) <code>first.backward()</code> çağrısı bize <code>x=2</code>'de ikinci türev <code>d2y/dx2 = 6x = 12</code>'yi verir. 5) Fonksiyonel API <code>torch.autograd.grad</code> yüksek mertebeli iş için daha temizdir: çıktıları ve girdileri açıkça alır ve <code>.grad</code> niteliklerine dokunmadan gradyanları döner -- iç içe optimizer'lar için akıl yürütmek çok daha kolaydır.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: WGAN-GP'de gradyan cezası</div><div class="example-body">Gradyan cezalı Wasserstein GAN'da kayıp <code>(||grad of D|| - 1)^2</code>'yi içerir. Bunu hesaplamak, ayırıcının girdisine göre gradyanını almayı, bu gradyanı tensor olarak ele almayı, normunu almayı ve onu kayba dahil etmeyi gerektirir. PyTorch bunu doğal yapar: <code>grad = torch.autograd.grad(D(x), x, create_graph=True)[0]</code>; <code>penalty = (grad.norm() - 1) ** 2</code>; dış <code>loss.backward()</code> iç gradyandan türev alır.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Yaygın Tuzaklar ve Toparlanma</h2>

<p class="l-text">Autograd güvenilirdir ama bir avuç kalıp her seferinde kafa karışıklığına neden olur. İşte konsolide liste, sonra anahtar çıkarımlar kutusu.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Yaygın hatalar</div><div class="compare-item"><code>optimizer.zero_grad()</code> unutmak -- gradyanlar birikir</div><div class="compare-item">Eval'da <code>no_grad</code> unutmak -- OOM veya yavaş</div><div class="compare-item">Grafikteki bir tensor'da yerinde işlem -- "leaf tensor modified" hatası</div><div class="compare-item"><code>retain_graph=True</code> olmadan iki kez <code>.backward()</code> çağırmak -- "trying to backward through the graph a second time"</div><div class="compare-item"><code>.detach()</code> yerine <code>.data</code> kullanmak -- gradyanları sessizce bozar</div></div>
<div class="compare-col"><div class="compare-title">En iyi uygulamalar</div><div class="compare-item">Her zaman <code>optimizer.step()</code>'i <code>optimizer.zero_grad()</code> ile eşle</div><div class="compare-item">Değerlendirmeyi <code>with torch.no_grad():</code> içine sar</div><div class="compare-item">Grafikte yazılabilir kopya gerekirse <code>tensor.clone()</code> kullan</div><div class="compare-item">Yüksek mertebeli veya seçici backward için <code>torch.autograd.grad</code> tercih et</div><div class="compare-item">Asla <code>tensor.data</code> değil, <code>tensor.detach()</code> kullan</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># Tek parametrenin tam autograd destekli eğitimi</span>
<span class="cm"># Hedef: (x - 5)^2'yi minimize eden x'i bul</span>

x = torch.<span class="fn">tensor</span>(<span class="num">0.0</span>, requires_grad=<span class="kw">True</span>)
optimizer = torch.optim.<span class="fn">SGD</span>([x], lr=<span class="num">0.1</span>)

losses = []
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    optimizer.<span class="fn">zero_grad</span>()
    loss = (x - <span class="num">5</span>) ** <span class="num">2</span>
    loss.<span class="fn">backward</span>()
    optimizer.<span class="fn">step</span>()
    losses.<span class="fn">append</span>(loss.<span class="fn">item</span>())

<span class="fn">print</span>(f<span class="str">"son x = {x.item():.4f}  (hedef: 5.0)"</span>)
<span class="fn">print</span>(f<span class="str">"son kayıp = {losses[-1]:.6f}"</span>)

<span class="cm"># Gradyan kontrolü: PyTorch bir sayısal gradyan kontrolcüsü ile gelir</span>
<span class="kw">def</span> <span class="fn">f</span>(t):
    <span class="kw">return</span> (t - <span class="num">5</span>) ** <span class="num">2</span>

x_test = torch.<span class="fn">randn</span>(<span class="num">1</span>, dtype=torch.double, requires_grad=<span class="kw">True</span>)
ok = torch.autograd.<span class="fn">gradcheck</span>(f, (x_test,), eps=<span class="num">1e-6</span>, atol=<span class="num">1e-4</span>)
<span class="fn">print</span>(f<span class="str">"gradcheck geçti: {ok}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Toparlanma demo: bir eğitim iterasyonunun tam ileri/geri/adım döngüsü, 15 satır saf NumPy ile.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
X = rng.standard_normal((32, 4))
y_true = (X[:, 0] + 2 * X[:, 1] - X[:, 2] > 0).astype(float)

w = rng.standard_normal(4) * 0.1
b = 0.0
lr = 0.5

for step in range(40):
    z = X @ w + b
    p = 1 / (1 + np.exp(-z))                     # sigmoid
    loss = -(y_true * np.log(p+1e-9) + (1-y_true) * np.log(1-p+1e-9)).mean()
    dz = (p - y_true) / X.shape[0]
    w -= lr * (X.T @ dz)
    b -= lr * dz.sum()
    if step % 10 == 0:
        acc = ((p > 0.5) == y_true).mean()
        print(f'step {step:2d}  loss {loss:.4f}  acc {acc:.3f}')

print('final w:', w.round(3), 'b:', round(b, 3))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Tek parametreli optimizasyon kurar: <code>(x-5)^2</code>'yi minimize eden <code>x</code>'i bul; cevap belli ki 5. 2) Parametremizi takip eden bir SGD optimizer oluşturur; optimizer sadece şişirilmiş bir çıkarma döngüsüdür -- <code>x -= lr * x.grad</code> uygulamayı bilir. 3) Klasik 5 satırlık eğitim döngüsü: sıfırla, ileri, geri, adım, logla. 50 adımdan sonra parametre 5'e yakınsar. 4) <code>torch.autograd.gradcheck</code> autograd'in gradyanını sonlu farklar yaklaşımıyla karşılaştırır; uyuşurlarsa ileri ve geri geçişiniz karşılıklı tutarlıdır. Bu, özel bir autograd Function yazdığınızda başvurmanız gereken bir hata ayıklama aracıdır.</p>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Autograd ileri geçişinizden dinamik bir hesaplama grafiği inşa eder; <code>.backward()</code> zincir kuralı yoluyla gradyanları hesaplamak için onu tersten dolaşır.<br><strong>2.</strong> <code>requires_grad=True</code> ile katılın; gradyanlar her yaprakta <code>.grad</code>'a iner; argümansız <code>.backward()</code> çağırmak için kayıp skaler olmalıdır.<br><strong>3.</strong> <code>.grad</code> birikir -- her backward'dan önce her zaman <code>optimizer.zero_grad()</code> (veya <code>.grad.zero_()</code>) çağırın.<br><strong>4.</strong> Değerlendirme için <code>torch.no_grad()</code> ve "bu değeri burada dondur" için <code>tensor.detach()</code> kullanın -- ikisi de grafik inşasını durdurur.<br><strong>5.</strong> <code>create_graph=True</code> gelişmiş kullanımlar için yüksek mertebeli gradyanları etkinleştirir (WGAN-GP, MAML).<br><strong>6.</strong> Manuel gradyan türetmesi autograd ile kayan nokta hassasiyetinde eşleşir -- sistem doğrudur, türetmeyi bırakabilirsiniz.<br><strong>7.</strong> Yaygın hatalar: zero_grad unutmak, eval'da no_grad unutmak, iki kez backward çağırmak, <code>.detach()</code> yerine <code>.data</code> kullanmak.<br><strong>8.</strong> Sonraki ders: bu ilkel yapıları <code>nn.Module</code>'a birleştirin -- parametrelerin, ileri geçişin ve gradyan akışının hepsinin birlikte paketlendiği nesne yönelimli sinir ağı kurma şekli.</div></div>
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

  function graphPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var nodes = lang === 'tr'
      ? ['x', 'h = x^2', 'g = h+1', 'y = 2g']
      : ['x', 'h = x^2', 'g = h+1', 'y = 2g'];
    var xs = [0, 1, 2, 3];
    var ys = [0, 0, 0, 0];
    var fwd = {x: xs, y: ys, mode:'lines+markers+text', type:'scatter', text: nodes, textposition:'top center',
               marker:{size:24, color:T.accent, line:{color:'rgba(255,255,255,0.3)',width:2}},
               line:{color:T.accent, width:3}, name: lang==='tr'?'Forward':'Forward'};
    var bwd_x = [3, 2.5, 2, 1.5, 1, 0.5, 0];
    var bwd_y = [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4, -0.4];
    var bwd = {x: bwd_x, y: bwd_y, mode:'lines+markers', type:'scatter',
               marker:{size:8, color:'#4ecdc4', symbol:'triangle-left'},
               line:{color:'#4ecdc4', width:2, dash:'dash'},
               name: lang==='tr'?'Backward (gradyan)':'Backward (gradient)'};
    var labels = {x:[3, 2, 1, 0], y:[-0.7,-0.7,-0.7,-0.7],
                  mode:'text', type:'scatter', showlegend:false,
                  text: ['dy/dy=1','dy/dg=2','dg/dh=1','dh/dx=2x=6'], textfont:{color:T.text,size:12}};
    var layout = Object.assign({}, common, {
      title:{text: lang === 'tr' ? 'Hesaplama Grafiği: y = 2(x^2 + 1)' : 'Computational Graph: y = 2(x^2 + 1)', font:{color:T.text,size:14}},
      xaxis:{visible:false, range:[-0.5, 3.5]},
      yaxis:{visible:false, range:[-1, 0.6]},
      legend:{font:{color:T.text}},
      margin:{t:60,r:30,b:30,l:30}
    });
    Plotly.newPlot(id, [fwd, bwd, labels], layout, {responsive:true, displayModeBar:false});
  }

  function descentPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    // Build contour grid for L(a,b) = (a-3)^2 + (b+1)^2
    var aa = []; var bb = []; var zz = [];
    for (var i=0;i<=40;i++){ aa.push(-1 + 6*i/40); }
    for (var j=0;j<=40;j++){ bb.push(-4 + 6*j/40); }
    for (var j=0;j<=40;j++){
      var row = [];
      for (var i=0;i<=40;i++){
        var a=aa[i], b=bb[j];
        row.push((a-3)*(a-3) + (b+1)*(b+1));
      }
      zz.push(row);
    }
    // Trajectory of gradient descent with lr=0.1, 20 steps
    var ax = [0]; var bx = [0];
    var a=0, b=0, lr=0.1;
    for (var k=0;k<20;k++){
      var ga = 2*(a-3); var gb = 2*(b+1);
      a = a - lr*ga; b = b - lr*gb;
      ax.push(a); bx.push(b);
    }
    var contour = {x: aa, y: bb, z: zz, type:'contour', colorscale:[[0, 'rgba(200,169,110,0.05)'],[0.5,'rgba(200,169,110,0.3)'],[1,'rgba(200,169,110,0.7)']], showscale:false, contours:{coloring:'lines'}};
    var traj = {x: ax, y: bx, mode:'lines+markers', type:'scatter',
                line:{color:'#4ecdc4', width:3},
                marker:{size:8, color:'#4ecdc4', line:{color:'rgba(255,255,255,0.4)', width:1}},
                name: lang==='tr'?'Gradyan inişi':'Gradient descent'};
    var minPt = {x:[3], y:[-1], mode:'markers', type:'scatter',
                 marker:{size:18, color:'#f87171', symbol:'star', line:{color:'white',width:2}},
                 name: lang==='tr'?'Minimum (3,-1)':'Minimum (3,-1)'};
    var layout = Object.assign({}, common, {
      title:{text: lang === 'tr' ? 'Gradyan İnişi: L(a,b) = (a-3)^2 + (b+1)^2' : 'Gradient Descent: L(a,b) = (a-3)^2 + (b+1)^2', font:{color:T.text,size:14}},
      xaxis:{title:'a', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:'b', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [contour, traj, minPt], layout, {responsive:true, displayModeBar:false});
  }

  graphPlot('plot-pl2-graph-en', 'en');
  descentPlot('plot-pl2-descent-en', 'en');
  graphPlot('plot-pl2-graph-tr', 'tr');
  descentPlot('plot-pl2-descent-tr', 'tr');
}, 250);</script>
`
};
