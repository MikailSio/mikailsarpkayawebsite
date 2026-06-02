window.PYTORCH_L3 = {

en: `<p class="l-text"><strong>nn.Module is the object-oriented container that turns scattered tensors and operations into a coherent neural network.</strong> Every model you load from HuggingFace, every example in the PyTorch tutorials, every research paper code release uses the same pattern: subclass <code>nn.Module</code>, declare your layers in <code>__init__</code>, define the forward pass in <code>forward()</code>. PyTorch handles the rest -- parameter registration, GPU movement, saving/loading, gradient flow.</p>

<p class="l-text">This lesson teaches the Module pattern, the common built-in layers (Linear, ReLU, Softmax, etc.), how to build models from <code>nn.Sequential</code> or by writing <code>forward</code> yourself, and how parameters are registered, counted, and serialized. By the end you will be able to read any model definition and write your own from scratch.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Subclass <code>nn.Module</code> with <code>__init__</code> and <code>forward</code> to define a custom network</li>
<li>Compose models with built-in layers: <code>Linear</code>, <code>ReLU</code>, <code>Dropout</code>, <code>LayerNorm</code>, <code>Softmax</code></li>
<li>Build a 3-layer MLP both with <code>nn.Sequential</code> and with a hand-written <code>forward</code></li>
<li>Enumerate parameters via <code>.parameters()</code> / <code>.named_parameters()</code> and count them</li>
<li>Save and load models with <code>state_dict</code> and switch between <code>.train()</code> / <code>.eval()</code> modes</li>
<li>Move whole models across devices with one <code>.to(device)</code> call</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Object-Oriented Models?</h2>

<p class="l-text">In Lesson 1 we wrote a forward pass as <code>y = X @ w + b</code>. For a single linear layer that is fine. For a 12-layer transformer with 100 million parameters, manually carrying around dozens of weight tensors gets unmanageable fast. <code>nn.Module</code> bundles parameters with the function that uses them, and gives you free utilities (move to GPU, count parameters, save to disk, switch between train/eval modes).</p>

<div class="calc-highlight"><strong>The Module contract:</strong> any class that subclasses <code>nn.Module</code> and defines <code>__init__</code> + <code>forward</code> automatically gets: parameter discovery, recursive <code>.to(device)</code>, recursive <code>.train()/.eval()</code> mode switching, <code>state_dict</code> serialization, and integration with optimizers and DataLoaders. You write the math; PyTorch handles the plumbing.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">__init__</div><div class="card-body">Where you create child modules and parameters. PyTorch tracks anything you store as <code>self.something</code> if it is itself a Module or a Parameter.</div></div>
<div class="calc-card"><div class="card-title">forward(x)</div><div class="card-body">Where you describe the computation. You call layers like functions: <code>self.fc(x)</code>. NEVER call <code>forward()</code> directly; call the module: <code>model(x)</code>.</div></div>
<div class="calc-card"><div class="card-title">parameters()</div><div class="card-body">An iterator over every learnable tensor inside the module, recursively. Used to feed an optimizer.</div></div>
<div class="calc-card"><div class="card-title">state_dict()</div><div class="card-body">A Python dict mapping parameter names to tensors. The standard format for saving and loading.</div></div>
<div class="calc-card"><div class="card-title">.to(device)</div><div class="card-body">Recursively moves all parameters and buffers. Returns self, so chainable.</div></div>
<div class="calc-card"><div class="card-title">.train() / .eval()</div><div class="card-body">Toggles dropout and batchnorm behavior. Always call <code>.eval()</code> before evaluation.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: a HuggingFace model is a stack of nn.Modules</div><div class="example-body"><code>BertForSequenceClassification</code> is a Module containing <code>BertModel</code> (Module), which contains <code>BertEmbeddings</code>, <code>BertEncoder</code>, <code>BertPooler</code> (all Modules). <code>BertEncoder</code> contains 12 <code>BertLayer</code> Modules, each with attention, intermediate, and output Modules. Composition all the way down -- one <code>model.to("cuda")</code> moves every weight in the tree.</div></div>

<div class="think-box"><div class="think-label">WHY NOT JUST FUNCTIONS?</div><div class="think-body">You could write a forward pass as a plain function and pass weights explicitly. JAX takes that approach. PyTorch chose objects because (1) parameters are numerous and tedious to thread through, (2) modes (train vs eval) and state (running BN statistics) need somewhere to live, (3) saving and loading needs a stable name -> tensor mapping. The Module class is just a clean way to keep all of this together.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Your First Module</h2>

<p class="l-text">Time to write one. Here is a tiny two-layer network for binary classification, hand-built to show every moving piece.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TinyMLP</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, in_dim=<span class="num">10</span>, hidden=<span class="num">32</span>, out_dim=<span class="num">2</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()                        <span class="cm"># always call super first</span>
        self.fc1 = nn.<span class="fn">Linear</span>(in_dim, hidden)      <span class="cm"># learnable: weight (32,10), bias (32,)</span>
        self.fc2 = nn.<span class="fn">Linear</span>(hidden, out_dim)     <span class="cm"># learnable: weight (2, 32), bias (2,)</span>
        self.relu = nn.<span class="fn">ReLU</span>()                     <span class="cm"># no parameters</span>

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="cm"># x has shape (batch, in_dim)</span>
        h = self.<span class="fn">fc1</span>(x)         <span class="cm"># (batch, hidden)</span>
        h = self.<span class="fn">relu</span>(h)        <span class="cm"># (batch, hidden)</span>
        logits = self.<span class="fn">fc2</span>(h)    <span class="cm"># (batch, out_dim)</span>
        <span class="kw">return</span> logits

model = <span class="fn">TinyMLP</span>(in_dim=<span class="num">10</span>, hidden=<span class="num">32</span>, out_dim=<span class="num">2</span>)
<span class="fn">print</span>(model)

x = torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">10</span>)         <span class="cm"># batch of 4 samples</span>
out = <span class="fn">model</span>(x)                 <span class="cm"># NOT model.forward(x); always call the instance</span>
<span class="fn">print</span>(out.shape)               <span class="cm"># torch.Size([4, 2])</span>

<span class="cm"># Inspect parameters</span>
<span class="kw">for</span> name, p <span class="kw">in</span> model.<span class="fn">named_parameters</span>():
    <span class="fn">print</span>(name, <span class="fn">tuple</span>(p.shape), p.requires_grad)
<span class="cm"># fc1.weight (32, 10) True</span>
<span class="cm"># fc1.bias   (32,)    True</span>
<span class="cm"># fc2.weight (2, 32)  True</span>
<span class="cm"># fc2.bias   (2,)     True</span>

n_params = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>() <span class="kw">if</span> p.requires_grad)
<span class="fn">print</span>(f<span class="str">"trainable params: {n_params}"</span>)    <span class="cm"># 32*10 + 32 + 2*32 + 2 = 386</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">We mimic nn.Module by writing a Python class with explicit forward(). Sklearn's BaseEstimator gives the same shape: .fit(), .predict(), parameters as attributes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

class MyLinearModel:
    def __init__(self, in_dim, out_dim, seed=0):
        rng = np.random.default_rng(seed)
        self.W = rng.standard_normal((in_dim, out_dim)) * 0.1
        self.b = np.zeros(out_dim)
    def forward(self, x):
        return x @ self.W + self.b
    def __call__(self, x):
        return self.forward(x)
    def parameters(self):
        return [self.W, self.b]

m = MyLinearModel(in_dim=4, out_dim=3)
x = np.random.randn(2, 4)
out = m(x)
print('out shape:', out.shape)
print('param shapes:', [p.shape for p in m.parameters()])
total = sum(p.size for p in m.parameters())
print(f'total params: {total}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Subclasses <code>nn.Module</code> and calls <code>super().__init__()</code> first -- this initializes the internal bookkeeping that tracks child modules and parameters. Forgetting this single line is one of the most common bugs. 2) Stores two <code>nn.Linear</code> layers and one <code>nn.ReLU</code> as instance attributes; PyTorch detects them automatically and registers their parameters. 3) Defines <code>forward(x)</code> with the chain of operations; the input shape is documented as a comment, which is a habit you should adopt because shape tracking is half of debugging. 4) Instantiates the model and prints it -- PyTorch produces a structured summary of every child. 5) Calls <code>model(x)</code> instead of <code>model.forward(x)</code>; the parenthesis form invokes <code>__call__</code> which adds hook support and other plumbing. 6) Iterates over named parameters to verify shapes and that they require gradients. 7) Counts trainable parameters with a one-liner -- the standard "model size" metric you see in every paper.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">super().__init__()</div><div class="card-body">Mandatory first line of every Module's <code>__init__</code>. Sets up parameter and submodule tracking.</div></div>
<div class="calc-card"><div class="card-title">self.layer = ...</div><div class="card-body">Storing a Module or Parameter as an attribute auto-registers it. Lists, dicts: use <code>nn.ModuleList</code> / <code>nn.ModuleDict</code>.</div></div>
<div class="calc-card"><div class="card-title">forward(self, x)</div><div class="card-body">Define the computation. Can take any number of args. Whatever you return is what <code>model(x)</code> returns.</div></div>
<div class="calc-card"><div class="card-title">model(x)</div><div class="card-body">Triggers <code>__call__</code> which wraps <code>forward</code> with hooks and tracking. Use this, not <code>.forward()</code>.</div></div>
<div class="calc-card"><div class="card-title">named_parameters()</div><div class="card-body">Yields (name, tensor) pairs. Useful for inspection, freezing, weight decay groups.</div></div>
<div class="calc-card"><div class="card-title">parameters()</div><div class="card-body">Yields just tensors. The form you pass to <code>torch.optim.Adam(model.parameters(), ...)</code>.</div></div>
</div>

<div class="l-warn"><strong>Pitfall (storing layers in lists):</strong> If you write <code>self.layers = [nn.Linear(10,10) for _ in range(3)]</code>, PyTorch will NOT register those layers because Python lists are not Module-aware. Always use <code>nn.ModuleList(...)</code> for ordered collections of submodules. Same for dicts: <code>nn.ModuleDict</code>.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. nn.Linear: the Workhorse</h2>

<p class="l-text">Almost every deep learning architecture is built on linear layers. The math is simple but worth nailing down precisely.</p>

<div class="katex-block">$$\\mathbf{y} = \\mathbf{x}W^T + \\mathbf{b}, \\quad W \\in \\mathbb{R}^{out \\times in}, \\;\\mathbf{b}\\in\\mathbb{R}^{out}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x</div><div class="card-body">Input vector of shape <code>(in_features,)</code>. In practice batched: shape <code>(B, in_features)</code> or any leading dims.</div></div>
<div class="calc-card"><div class="card-title">W</div><div class="card-body">Weight matrix; <code>nn.Linear</code> stores it as <code>(out, in)</code> and PyTorch transposes for you in the matmul.</div></div>
<div class="calc-card"><div class="card-title">b</div><div class="card-body">Bias vector of shape <code>(out_features,)</code>. Set <code>bias=False</code> in the constructor to skip it.</div></div>
<div class="calc-card"><div class="card-title">y</div><div class="card-body">Output vector of shape <code>(out_features,)</code>; broadcasted across the batch.</div></div>
<div class="calc-card"><div class="card-title">in_features</div><div class="card-body">Input dimensionality. For a transformer this is the hidden size (768 for BERT-base).</div></div>
<div class="calc-card"><div class="card-title">out_features</div><div class="card-body">Output dimensionality. The classifier head usually projects to <code>num_classes</code>.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Linear: in_features=4, out_features=3</span>
fc = nn.<span class="fn">Linear</span>(in_features=<span class="num">4</span>, out_features=<span class="num">3</span>, bias=<span class="kw">True</span>)
<span class="fn">print</span>(fc.weight.shape)   <span class="cm"># torch.Size([3, 4])  -- (out, in)</span>
<span class="fn">print</span>(fc.bias.shape)     <span class="cm"># torch.Size([3])</span>

<span class="cm"># Forward pass on a batch of 2</span>
x = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">4</span>)
y = <span class="fn">fc</span>(x)
<span class="fn">print</span>(y.shape)           <span class="cm"># torch.Size([2, 3])</span>

<span class="cm"># Manual replication: y = x @ W.T + b</span>
y_manual = x @ fc.weight.T + fc.bias
<span class="fn">print</span>(torch.<span class="fn">allclose</span>(y, y_manual))   <span class="cm"># True</span>

<span class="cm"># Linear works on any leading dimensions, applies to last dim</span>
seq = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">10</span>, <span class="num">4</span>)         <span class="cm"># batch=8, seq=10, dim=4</span>
out = <span class="fn">fc</span>(seq)
<span class="fn">print</span>(out.shape)        <span class="cm"># torch.Size([8, 10, 3])  -- only last dim is transformed</span>

<span class="cm"># Disable bias (common in transformers, gives a tiny speedup and slight accuracy gain)</span>
fc2 = nn.<span class="fn">Linear</span>(<span class="num">4</span>, <span class="num">3</span>, bias=<span class="kw">False</span>)
<span class="fn">print</span>(<span class="fn">list</span>(fc2.<span class="fn">named_parameters</span>()))   <span class="cm"># only 'weight'</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">nn.Linear is just an affine map W @ x + b. Sklearn's LinearRegression / LogisticRegression are productionized versions of this for fit-and-predict workflows.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LinearRegression

# Hand-built linear "layer"
rng = np.random.default_rng(0)
X = rng.standard_normal((100, 3))
y = X @ np.array([1.5, -2.0, 0.5]) + 0.3

# Manual init -- just like nn.Linear(3, 1)
W = rng.standard_normal((3, 1)) * 0.1
b = np.zeros(1)
y_hand = X @ W + b
print('hand-init prediction MSE:', float(((y_hand[:,0] - y) ** 2).mean().round(3)))

# Sklearn fits the same equation in closed form
lr = LinearRegression().fit(X, y)
y_lr = lr.predict(X)
print('sklearn fitted     MSE:', float(((y_lr - y) ** 2).mean().round(6)))
print('coef recovered:', lr.coef_.round(3), 'bias:', round(float(lr.intercept_), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a Linear layer with 4 inputs and 3 outputs. The weight is stored as <code>(3, 4)</code> -- the convention is <code>(out, in)</code> because PyTorch internally does <code>x @ W.T</code>. 2) Prints both parameter shapes; bias is just a 1-D vector matching <code>out_features</code>. 3) Forwards a batch of 2 vectors and gets a <code>(2, 3)</code> output. 4) Replicates the same operation by hand using raw matmul -- they agree, confirming the formula. 5) Shows the underrated property that Linear works on any tensor rank: only the last dimension is transformed. This is why the same Linear layer can be applied per-token in a transformer with shape <code>(B, T, D) -&gt; (B, T, D')</code>. 6) Demonstrates <code>bias=False</code> -- transformers commonly use it because LayerNorm provides an effective bias and removing one saves a small amount of memory and compute.</p>

<div class="l-note"><strong>Initialization:</strong> By default <code>nn.Linear</code> uses Kaiming uniform for the weight and a small uniform range for the bias. For special architectures (transformers, residual nets) you may want to override this with <code>nn.init.xavier_normal_</code> or your own scheme; do it in <code>__init__</code> after creating the layer.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Activation Functions</h2>

<p class="l-text">A network of stacked linear layers without nonlinearity is just one big linear layer -- the composition of linear maps is linear. Activations break that, letting the network represent arbitrary functions. The choice of activation matters more than beginners think.</p>

<div class="katex-block">$$\\text{ReLU}(x) = \\max(0, x), \\quad \\text{GELU}(x) \\approx x\\Phi(x), \\quad \\text{Tanh}(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}$$</div>

<div class="katex-block">$$\\sigma(x) = \\frac{1}{1+e^{-x}}, \\quad \\text{Softmax}(x_i) = \\frac{e^{x_i}}{\\sum_j e^{x_j}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ReLU</div><div class="card-body">Negatives -&gt; 0, positives unchanged. Default for hidden layers since 2012. Cheap, no vanishing gradient on positive side.</div></div>
<div class="calc-card"><div class="card-title">GELU</div><div class="card-body">Smooth approximation to ReLU using the Gaussian CDF. Used in BERT, GPT, and most transformers.</div></div>
<div class="calc-card"><div class="card-title">Tanh</div><div class="card-body">Output in (-1, 1), zero-centered. Old default; still used in RNN gates and LSTM cells.</div></div>
<div class="calc-card"><div class="card-title">Sigmoid</div><div class="card-body">Output in (0, 1), interpretable as probability. Used at the final layer of binary classifiers and gates.</div></div>
<div class="calc-card"><div class="card-title">Softmax</div><div class="card-body">Turns a vector into a probability distribution summing to 1. Used as the final layer of multi-class classifiers.</div></div>
<div class="calc-card"><div class="card-title">SiLU / Swish</div><div class="card-body">x * sigmoid(x). Smooth, slightly outperforms ReLU on many benchmarks. Used in EfficientNet, modern LLMs.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

x = torch.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">7</span>)

<span class="cm"># As Modules (stateful, store as attribute)</span>
relu  = nn.<span class="fn">ReLU</span>()
gelu  = nn.<span class="fn">GELU</span>()
tanh  = nn.<span class="fn">Tanh</span>()
sig   = nn.<span class="fn">Sigmoid</span>()

<span class="fn">print</span>(<span class="fn">relu</span>(x))    <span class="cm"># tensor([0, 0, 0, 0, 1, 2, 3])</span>
<span class="fn">print</span>(<span class="fn">gelu</span>(x))    <span class="cm"># smooth ReLU</span>
<span class="fn">print</span>(<span class="fn">tanh</span>(x))    <span class="cm"># bounded (-1, 1)</span>
<span class="fn">print</span>(<span class="fn">sig</span>(x))     <span class="cm"># bounded (0, 1)</span>

<span class="cm"># As functions (stateless, call directly)</span>
y = F.<span class="fn">relu</span>(x)
y = F.<span class="fn">gelu</span>(x)
y = F.<span class="fn">softmax</span>(x, dim=-<span class="num">1</span>)

<span class="cm"># Softmax on a 2D logit matrix</span>
logits = torch.<span class="fn">tensor</span>([[<span class="num">2.0</span>, <span class="num">1.0</span>, <span class="num">0.1</span>], [<span class="num">0.5</span>, <span class="num">0.5</span>, <span class="num">3.0</span>]])
probs = F.<span class="fn">softmax</span>(logits, dim=-<span class="num">1</span>)
<span class="fn">print</span>(probs)
<span class="cm"># tensor([[0.6590, 0.2424, 0.0986],</span>
<span class="cm">#         [0.1142, 0.1142, 0.7716]])</span>
<span class="fn">print</span>(probs.<span class="fn">sum</span>(dim=-<span class="num">1</span>))   <span class="cm"># tensor([1., 1.])</span>

<span class="cm"># Log-softmax: numerically more stable, used with NLLLoss</span>
log_probs = F.<span class="fn">log_softmax</span>(logits, dim=-<span class="num">1</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Activation functions in NumPy: ReLU, sigmoid, tanh, GELU. The same formulas torch.nn.functional applies element-wise on tensors.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.linspace(-3, 3, 7)

relu    = np.maximum(0, x)
sigmoid = 1 / (1 + np.exp(-x))
tanh    = np.tanh(x)
# GELU approx (Hendrycks & Gimpel)
gelu    = 0.5 * x * (1 + np.tanh(np.sqrt(2/np.pi) * (x + 0.044715 * x**3)))

print('x       :', x.round(3))
print('relu    :', relu.round(3))
print('sigmoid :', sigmoid.round(3))
print('tanh    :', tanh.round(3))
print('gelu    :', gelu.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a small input vector spanning negative and positive values to illustrate each activation. 2) Demonstrates the Module form: <code>nn.ReLU()</code> creates an instance you store as <code>self.relu</code> in your model; calling it applies the function. 3) Demonstrates the functional form from <code>torch.nn.functional</code> (conventionally aliased as <code>F</code>): no instance to store, just call <code>F.relu(x)</code>. Functional and Module forms are equivalent for stateless activations -- pick whichever feels cleaner. 4) Applies softmax to a 2D logit matrix along the last dimension, producing per-row probability distributions; <code>probs.sum(dim=-1)</code> confirms each row sums to 1. 5) Shows <code>log_softmax</code>, which combines log and softmax in one numerically stable computation -- essential for cross-entropy where you want log probabilities anyway.</p>

<div id="plot-pl3-activations-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The five most common activation functions on the same x-axis. ReLU clips at 0, GELU is a smooth version of the same idea (so it has a gradient at the kink), Tanh saturates at +-1 with zero-centered output, Sigmoid saturates at 0/1, and SiLU/Swish is non-monotonic and slightly negative just before 0. Modern transformers prefer GELU or SiLU over ReLU because the smooth gradient near zero helps optimization.</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Module form</div><div class="compare-item">Stored as attribute in <code>__init__</code></div><div class="compare-item">Visible in <code>print(model)</code></div><div class="compare-item">Has trainable parameters? Sometimes (e.g. PReLU)</div><div class="compare-item">Standard for "named building blocks"</div></div>
<div class="compare-col"><div class="compare-title">Functional form (F.)</div><div class="compare-item">Called directly in <code>forward</code></div><div class="compare-item">Not visible in <code>print(model)</code></div><div class="compare-item">Always stateless</div><div class="compare-item">Cleaner for one-off ops</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. nn.Sequential and nn.ModuleList</h2>

<p class="l-text">When your forward pass is just "apply layer 1, then layer 2, then layer 3", <code>nn.Sequential</code> saves you from writing <code>forward</code> at all. For more complex topologies (residual connections, multiple branches), use <code>nn.ModuleList</code> with a custom forward.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># 1) Sequential: linear chain of layers</span>
model = nn.<span class="fn">Sequential</span>(
    nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">64</span>),
    nn.<span class="fn">ReLU</span>(),
    nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">64</span>),
    nn.<span class="fn">ReLU</span>(),
    nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">2</span>),
)
x = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">10</span>)
<span class="fn">print</span>(<span class="fn">model</span>(x).shape)        <span class="cm"># torch.Size([8, 2])</span>

<span class="cm"># Index into Sequential like a list</span>
<span class="fn">print</span>(model[<span class="num">0</span>])              <span class="cm"># first Linear</span>
<span class="fn">print</span>(model[-<span class="num">1</span>].out_features)  <span class="cm"># 2</span>

<span class="cm"># Named Sequential (clearer for debugging)</span>
<span class="kw">from</span> collections <span class="kw">import</span> OrderedDict
model_named = nn.<span class="fn">Sequential</span>(<span class="fn">OrderedDict</span>([
    (<span class="str">"input"</span>,  nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">64</span>)),
    (<span class="str">"act1"</span>,   nn.<span class="fn">ReLU</span>()),
    (<span class="str">"hidden"</span>, nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">64</span>)),
    (<span class="str">"act2"</span>,   nn.<span class="fn">ReLU</span>()),
    (<span class="str">"output"</span>, nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">2</span>)),
]))
<span class="fn">print</span>(model_named.<span class="ty">input</span>)     <span class="cm"># access by name</span>

<span class="cm"># 2) ModuleList: keep submodules in a list, write your own forward</span>
<span class="kw">class</span> <span class="fn">ResNetBlock</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, dim, n=<span class="num">3</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.layers = nn.<span class="fn">ModuleList</span>([nn.<span class="fn">Linear</span>(dim, dim) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n)])
        self.act = nn.<span class="fn">ReLU</span>()
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        residual = x
        <span class="kw">for</span> layer <span class="kw">in</span> self.layers:
            x = self.<span class="fn">act</span>(<span class="fn">layer</span>(x))
        <span class="kw">return</span> x + residual            <span class="cm"># skip connection</span>

block = <span class="fn">ResNetBlock</span>(dim=<span class="num">32</span>, n=<span class="num">3</span>)
<span class="fn">print</span>(<span class="fn">block</span>(torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">32</span>)).shape)   <span class="cm"># (4, 32)</span>

<span class="cm"># 3) ModuleDict: dict of submodules</span>
<span class="kw">class</span> <span class="fn">MultiHead</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.heads = nn.<span class="fn">ModuleDict</span>({
            <span class="str">"sentiment"</span>: nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">2</span>),
            <span class="str">"topic"</span>:     nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">10</span>),
        })
    <span class="kw">def</span> <span class="fn">forward</span>(self, x, task):
        <span class="kw">return</span> self.heads[task](x)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">nn.Sequential = list of layers applied in order. We replicate it with a Python list and a for-loop.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def relu(x): return np.maximum(0, x)

rng = np.random.default_rng(0)
layers = [
    (rng.standard_normal((10, 32)) * 0.1, np.zeros(32)),
    (rng.standard_normal((32, 16)) * 0.1, np.zeros(16)),
    (rng.standard_normal((16,  3)) * 0.1, np.zeros(3)),
]

def forward(x):
    for i, (W, b) in enumerate(layers):
        x = x @ W + b
        if i < len(layers) - 1:
            x = relu(x)
    return x

x = np.random.randn(4, 10)
out = forward(x)
total_params = sum(W.size + b.size for W, b in layers)
print('input  shape:', x.shape)
print('output shape:', out.shape)
print('total params:', total_params)</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>nn.Sequential</code> takes a list of layers and applies them in order; the forward pass is implicit. This is perfect for plain MLPs and convolutional stacks. 2) Sequential supports indexing like a list, useful for accessing or replacing layers. 3) The OrderedDict form lets you give each layer a name -- the same model but with readable diagnostics in <code>print(model)</code> and <code>state_dict()</code>. 4) When the forward is not a simple chain (here we have a skip connection), <code>nn.ModuleList</code> stores layers as a list while letting you write a custom <code>forward</code>. The skip connection <code>x + residual</code> is the core of ResNet and shows up in every transformer block too. 5) <code>nn.ModuleDict</code> is the dictionary version -- great for multi-task models where the head depends on which task you are running.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">nn.Sequential</div><div class="card-body">Linear chain. No custom forward needed. Layers run in declaration order. Indexable.</div></div>
<div class="calc-card"><div class="card-title">nn.ModuleList</div><div class="card-body">Ordered list. Use when you need a custom forward or want to iterate. Length-aware, indexable.</div></div>
<div class="calc-card"><div class="card-title">nn.ModuleDict</div><div class="card-body">String-keyed. Use for multi-task heads or named branches. Behaves like a dict with module-aware semantics.</div></div>
<div class="calc-card"><div class="card-title">nn.ParameterList</div><div class="card-body">List of raw Parameters (not Modules). Use when you need a learnable but non-Module collection.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Train vs Eval Mode and Buffers</h2>

<p class="l-text">Some layers behave differently in training vs evaluation. Dropout zeros random units only during training; BatchNorm uses running statistics only during evaluation. PyTorch toggles all of these with one call: <code>model.train()</code> or <code>model.eval()</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">WithDropout</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc = nn.<span class="fn">Linear</span>(<span class="num">4</span>, <span class="num">4</span>)
        self.drop = nn.<span class="fn">Dropout</span>(p=<span class="num">0.5</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">drop</span>(self.<span class="fn">fc</span>(x))

m = <span class="fn">WithDropout</span>()
x = torch.<span class="fn">ones</span>(<span class="num">1</span>, <span class="num">4</span>)

m.<span class="fn">train</span>()                 <span class="cm"># dropout active</span>
<span class="fn">print</span>(<span class="fn">m</span>(x))               <span class="cm"># half the entries (in expectation) are zero</span>
m.<span class="fn">eval</span>()                  <span class="cm"># dropout off</span>
<span class="fn">print</span>(<span class="fn">m</span>(x))               <span class="cm"># all entries pass through</span>

<span class="cm"># Buffers: non-learnable persistent state (like running stats in BatchNorm)</span>
<span class="kw">class</span> <span class="fn">WithRunningMean</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, dim):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc = nn.<span class="fn">Linear</span>(dim, dim)
        <span class="cm"># register_buffer makes a tensor part of state_dict but NOT a parameter</span>
        self.<span class="fn">register_buffer</span>(<span class="str">"running_mean"</span>, torch.<span class="fn">zeros</span>(dim))
        self.momentum = <span class="num">0.1</span>

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">if</span> self.training:
            self.running_mean = (<span class="num">1</span> - self.momentum) * self.running_mean + self.momentum * x.<span class="fn">mean</span>(<span class="num">0</span>)
        out = self.<span class="fn">fc</span>(x - self.running_mean)
        <span class="kw">return</span> out

m2 = <span class="fn">WithRunningMean</span>(dim=<span class="num">4</span>)
<span class="fn">print</span>(m2.<span class="fn">state_dict</span>().<span class="fn">keys</span>())
<span class="cm"># odict_keys(['running_mean', 'fc.weight', 'fc.bias'])</span>
<span class="fn">print</span>(<span class="str">"running_mean is param:"</span>, <span class="str">"running_mean"</span> <span class="kw">in</span> <span class="fn">dict</span>(m2.<span class="fn">named_parameters</span>()))
<span class="cm"># False -- it is a buffer, not a parameter</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Train vs eval mode is most visible with dropout / batchnorm. We simulate inverted-dropout: random zeroing in train, identity in eval.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def dropout(x, p=0.3, training=True, seed=0):
    if not training:
        return x
    rng = np.random.default_rng(seed)
    mask = (rng.random(x.shape) > p).astype(float)
    return x * mask / (1 - p)   # inverted dropout scales for eval-equivalent magnitude

x = np.ones(8)
print('train mode :', dropout(x, training=True).round(3))
print('eval  mode :', dropout(x, training=False).round(3))
print('train mean ~ x.mean() because of inverted scaling:',
      dropout(np.random.randn(10000), training=True).mean().round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a tiny module with a dropout layer; calls <code>train()</code> and <code>eval()</code> to show the different forward behavior. In <code>train()</code> roughly half of the units are zeroed; in <code>eval()</code> all units pass through. 2) Demonstrates buffers via <code>register_buffer</code>: the running mean is part of the model's state (saved with <code>state_dict</code>, moved to GPU with <code>.to(device)</code>) but is NOT trained -- it has no <code>requires_grad</code> and is not in <code>parameters()</code>. 3) The <code>self.training</code> flag (set by <code>train()/eval()</code>) is what BatchNorm and Dropout check internally. You can use it in your own forward too, as shown for the running-mean update which happens only in training. 4) <code>state_dict</code> contains both buffers and parameters with their full names; <code>parameters()</code> contains only learnable ones.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Parameter</div><div class="compare-item">Learnable, has gradient</div><div class="compare-item">Updated by optimizer</div><div class="compare-item">In <code>parameters()</code> and <code>state_dict()</code></div><div class="compare-item">Examples: weights, biases</div></div>
<div class="compare-col"><div class="compare-title">Buffer</div><div class="compare-item">Not learnable, no gradient</div><div class="compare-item">Persisted but not optimized</div><div class="compare-item">Only in <code>state_dict()</code></div><div class="compare-item">Examples: BN running mean/var, position embeddings (sometimes)</div></div>
</div>

<div class="l-warn"><strong>Critical:</strong> Always call <code>model.eval()</code> before validation or inference. Otherwise dropout will randomly zero outputs and your accuracy will mysteriously drop. Pair it with <code>with torch.no_grad():</code> for memory savings.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Saving, Loading, and state_dict</h2>

<p class="l-text">After training, you save the model. After loading, you use it. The standard PyTorch idiom is to save and load the <code>state_dict</code> (the dict of name -&gt; tensor), not the model object itself.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TinyMLP</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc1 = nn.<span class="fn">Linear</span>(d, <span class="num">4</span>)
        self.fc2 = nn.<span class="fn">Linear</span>(<span class="num">4</span>, <span class="num">1</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">fc2</span>(torch.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x)))

model = <span class="fn">TinyMLP</span>(d=<span class="num">8</span>)

<span class="cm"># Save just the parameters (recommended)</span>
torch.<span class="fn">save</span>(model.<span class="fn">state_dict</span>(), <span class="str">"tiny.pt"</span>)

<span class="cm"># Load: build the same architecture, then load weights</span>
model2 = <span class="fn">TinyMLP</span>(d=<span class="num">8</span>)
model2.<span class="fn">load_state_dict</span>(torch.<span class="fn">load</span>(<span class="str">"tiny.pt"</span>))
model2.<span class="fn">eval</span>()

<span class="cm"># Inspect what's inside a state_dict</span>
sd = model.<span class="fn">state_dict</span>()
<span class="kw">for</span> k, v <span class="kw">in</span> sd.<span class="fn">items</span>():
    <span class="fn">print</span>(k, <span class="fn">tuple</span>(v.shape))
<span class="cm"># fc1.weight (4, 8)</span>
<span class="cm"># fc1.bias   (4,)</span>
<span class="cm"># fc2.weight (1, 4)</span>
<span class="cm"># fc2.bias   (1,)</span>

<span class="cm"># Save more: model + optimizer + epoch (for resuming training)</span>
checkpoint = {
    <span class="str">"epoch"</span>: <span class="num">10</span>,
    <span class="str">"model_state"</span>: model.<span class="fn">state_dict</span>(),
    <span class="cm"># "optim_state": optimizer.state_dict(),</span>
    <span class="str">"loss"</span>: <span class="num">0.123</span>,
}
torch.<span class="fn">save</span>(checkpoint, <span class="str">"ckpt.pt"</span>)
ck = torch.<span class="fn">load</span>(<span class="str">"ckpt.pt"</span>)
<span class="fn">print</span>(ck[<span class="str">"epoch"</span>], ck[<span class="str">"loss"</span>])

<span class="cm"># Strict vs non-strict loading (e.g. fine-tuning with extra heads)</span>
<span class="cm"># missing, unexpected = model2.load_state_dict(sd, strict=False)</span>
<span class="cm"># print(missing, unexpected)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Saving and loading: we serialize a model's parameter dict (list of NumPy arrays) with np.savez, just like torch.save(state_dict).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import io

# Build model state_dict
rng = np.random.default_rng(0)
state = {
    'W1': rng.standard_normal((4, 8)).astype(np.float32),
    'b1': np.zeros(8, dtype=np.float32),
    'W2': rng.standard_normal((8, 2)).astype(np.float32),
    'b2': np.zeros(2, dtype=np.float32),
}

# Save to in-memory buffer
buf = io.BytesIO()
np.savez(buf, **state)
print('serialized size (bytes):', len(buf.getvalue()))

# Load back
buf.seek(0)
loaded = np.load(buf)
print('keys:', list(loaded.keys()))
for k in loaded:
    print(f'  {k}: shape {loaded[k].shape}, dtype {loaded[k].dtype}')

# Verify identical
print('round-trip equal:', np.allclose(state['W1'], loaded['W1']))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a small MLP and saves only its <code>state_dict</code> -- a dict mapping parameter names to tensors. This is preferable to <code>torch.save(model, ...)</code> because it does not pickle the class itself, so loading does not break when you refactor your code. 2) To load, you re-instantiate the architecture (the Python class must match) and then call <code>load_state_dict</code>. 3) Iterates over the dict to inspect parameter names and shapes -- exactly what you want to verify when something fails to load. 4) Shows the standard "checkpoint" pattern for resuming training: a dict containing the model state, optimizer state, current epoch, and metrics. 5) Mentions <code>strict=False</code>, useful when your new model has extra layers (a fine-tuning head) that should not error out -- you can inspect the returned <code>missing</code> and <code>unexpected</code> lists to confirm only the expected differences.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: HuggingFace fine-tuning</div><div class="example-body">When you fine-tune a pretrained BERT for sentiment, the workflow is: (1) load the pretrained backbone with <code>BertModel.from_pretrained("bert-base")</code>, (2) wrap it in your model with a new classification head, (3) train, (4) save your model's full <code>state_dict</code>. The pretrained weights and your new classifier are saved together; loading only requires your wrapper class to match.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Building a Real NLP Classifier</h2>

<p class="l-text">Time to put everything together. We will build a small text classifier that takes pre-tokenized sequences, embeds them, pools the tokens, and predicts a class. This is the skeleton of a thousand NLP papers, and we will reuse it in later lessons.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TextClassifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, embed_dim=<span class="num">128</span>, hidden=<span class="num">64</span>, num_classes=<span class="num">2</span>, pad_idx=<span class="num">0</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed   = nn.<span class="fn">Embedding</span>(vocab_size, embed_dim, padding_idx=pad_idx)
        self.encoder = nn.<span class="fn">Sequential</span>(
            nn.<span class="fn">Linear</span>(embed_dim, hidden),
            nn.<span class="fn">ReLU</span>(),
            nn.<span class="fn">Dropout</span>(<span class="num">0.3</span>),
            nn.<span class="fn">Linear</span>(hidden, hidden),
            nn.<span class="fn">ReLU</span>(),
        )
        self.classifier = nn.<span class="fn">Linear</span>(hidden, num_classes)

    <span class="kw">def</span> <span class="fn">forward</span>(self, token_ids, attention_mask):
        <span class="cm"># token_ids: (B, T) int64</span>
        <span class="cm"># attention_mask: (B, T) float; 1 = real, 0 = padding</span>
        emb = self.<span class="fn">embed</span>(token_ids)              <span class="cm"># (B, T, E)</span>
        h = self.<span class="fn">encoder</span>(emb)                    <span class="cm"># (B, T, H)</span>
        <span class="cm"># mean-pool over real tokens only</span>
        mask = attention_mask.<span class="fn">unsqueeze</span>(-<span class="num">1</span>)      <span class="cm"># (B, T, 1)</span>
        pooled = (h * mask).<span class="fn">sum</span>(dim=<span class="num">1</span>) / mask.<span class="fn">sum</span>(dim=<span class="num">1</span>).<span class="fn">clamp</span>(<span class="ty">min</span>=<span class="num">1</span>)
        logits = self.<span class="fn">classifier</span>(pooled)         <span class="cm"># (B, C)</span>
        <span class="kw">return</span> logits

<span class="cm"># Instantiate</span>
model = <span class="fn">TextClassifier</span>(vocab_size=<span class="num">10000</span>, embed_dim=<span class="num">128</span>, hidden=<span class="num">64</span>, num_classes=<span class="num">2</span>)
<span class="fn">print</span>(model)

<span class="cm"># Fake batch</span>
B, T = <span class="num">4</span>, <span class="num">16</span>
ids = torch.<span class="fn">randint</span>(<span class="num">1</span>, <span class="num">10000</span>, (B, T))
ids[<span class="num">0</span>, <span class="num">10</span>:] = <span class="num">0</span>                            <span class="cm"># first sample only has 10 real tokens</span>
mask = (ids != <span class="num">0</span>).<span class="fn">float</span>()
logits = <span class="fn">model</span>(ids, mask)
<span class="fn">print</span>(logits.shape)                        <span class="cm"># (4, 2)</span>

<span class="cm"># Total parameters</span>
n = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())
<span class="fn">print</span>(f<span class="str">"total parameters: {n:,}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build a real text classifier with sklearn -- the same conceptual stack a torch nn.Module would: featurize text -> linear layer -> classification head.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

texts  = df_reviews['review'].tolist()
labels = df_reviews['label'].values

X_tr, X_te, y_tr, y_te = train_test_split(texts, labels, test_size=0.25, random_state=0)

vec = TfidfVectorizer(max_features=2000, ngram_range=(1, 2))
Xt_tr = vec.fit_transform(X_tr)
Xt_te = vec.transform(X_te)
print('feature dim:', Xt_tr.shape[1])

clf = LogisticRegression(max_iter=500).fit(Xt_tr, y_tr)
preds = clf.predict(Xt_te)
acc = accuracy_score(y_te, preds)
print(f'sentiment classifier accuracy: {acc:.3f}')
print('sample preds:', list(zip(preds[:5], y_te[:5])))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a four-layer architecture: embedding lookup, two-block MLP encoder, classifier head. <code>padding_idx=0</code> tells the embedding layer that index 0 is padding and its embedding should not be trained (kept at zero). 2) <code>forward</code> takes both token IDs and an attention mask -- the mask is essential for variable-length sequences so we do not average padding into the sentence representation. 3) Embedding lookup converts <code>(B, T)</code> integer IDs into <code>(B, T, E)</code> float embeddings. 4) The encoder applies the same MLP per token; output is <code>(B, T, H)</code>. 5) Mean pooling over the time dimension uses the mask: multiply, sum, then divide by the count of real tokens. <code>clamp(min=1)</code> prevents division by zero in the unlikely all-padding case. 6) The classifier projects the pooled vector to two logits per sample, ready for cross-entropy. 7) The fake-batch test confirms shapes: 4 samples, 2 classes, with one sample padded.</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Subclass <code>nn.Module</code>; declare layers in <code>__init__</code>; describe computation in <code>forward</code>. Always call <code>super().__init__()</code>.<br><strong>2.</strong> Call <code>model(x)</code>, never <code>model.forward(x)</code> -- the parenthesis form runs hooks and tracking.<br><strong>3.</strong> <code>nn.Linear</code> is the workhorse: <code>y = xW^T + b</code>, applies to last dim of any tensor.<br><strong>4.</strong> Activations come in Module form (<code>nn.ReLU()</code>) and functional form (<code>F.relu</code>); both are equivalent for stateless ones.<br><strong>5.</strong> <code>nn.Sequential</code> for plain stacks; <code>nn.ModuleList</code> / <code>nn.ModuleDict</code> for custom topologies. Plain Python lists do NOT register submodules.<br><strong>6.</strong> Use <code>register_buffer</code> for non-learnable state; toggle <code>train()/eval()</code> for dropout and batchnorm.<br><strong>7.</strong> Save and load <code>state_dict</code>, not the model object. Re-instantiate the class, then load weights.<br><strong>8.</strong> Next lesson: feed real data through this skeleton with <code>Dataset</code> and <code>DataLoader</code>.</div></div>
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

  function actPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var xs = []; for (var i=-60;i<=60;i++) xs.push(i/15);
    function relu(x){return Math.max(0,x);}
    function gelu(x){var s=Math.sqrt(2/Math.PI);return 0.5*x*(1+Math.tanh(s*(x+0.044715*x*x*x)));}
    function tanh(x){return Math.tanh(x);}
    function sig(x){return 1/(1+Math.exp(-x));}
    function silu(x){return x*sig(x);}
    var t1 = {x:xs, y:xs.map(relu), mode:'lines', type:'scatter', name:'ReLU', line:{color:T.accent, width:2.5}};
    var t2 = {x:xs, y:xs.map(gelu), mode:'lines', type:'scatter', name:'GELU', line:{color:'#4ecdc4', width:2.5}};
    var t3 = {x:xs, y:xs.map(tanh), mode:'lines', type:'scatter', name:'Tanh', line:{color:'#f87171', width:2.5}};
    var t4 = {x:xs, y:xs.map(sig),  mode:'lines', type:'scatter', name:'Sigmoid', line:{color:'#a78bfa', width:2.5}};
    var t5 = {x:xs, y:xs.map(silu), mode:'lines', type:'scatter', name:'SiLU/Swish', line:{color:'#fbbf24', width:2.5, dash:'dot'}};
    var layout = Object.assign({}, common, {
      title:{text: lang === 'tr' ? 'Aktivasyon Fonksiyonlari' : 'Activation Functions', font:{color:T.text,size:14}},
      xaxis:{title:'x', gridcolor:T.grid, zerolinecolor:T.zero, range:[-4,4]},
      yaxis:{title: lang==='tr'?'cikis':'output', gridcolor:T.grid, zerolinecolor:T.zero, range:[-1.5,3]},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2,t3,t4,t5], layout, {responsive:true, displayModeBar:false});
  }

  actPlot('plot-pl3-activations-en', 'en');
  actPlot('plot-pl3-activations-tr', 'tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>nn.Module, dağınık tensor'ları ve işlemleri tutarlı bir sinir ağına dönüştüren nesne yönelimli kapsayıcıdır.</strong> HuggingFace'ten yüklediğiniz her model, PyTorch tutorial'larındaki her örnek, her araştırma makalesi kod sürümü aynı kalıbı kullanır: <code>nn.Module</code>'u alt sınıflandır, katmanlarınızı <code>__init__</code>'te bildirin, ileri geçişi <code>forward()</code>'ta tanımlayın. PyTorch geri kalanı halleder -- parametre kaydı, GPU taşıma, kaydetme/yükleme, gradyan akışı.</p>

<p class="l-text">Bu ders Module kalıbını, yaygın yerleşik katmanları (Linear, ReLU, Softmax vb.), <code>nn.Sequential</code>'dan veya <code>forward</code>'u kendiniz yazarak nasıl model inşa edileceğini ve parametrelerin nasıl kaydedildiğini, sayıldığını ve serileştirildiğini öğretir. Bu dersin sonunda herhangi bir model tanımını okuyabilecek ve kendinizinkini sıfırdan yazabileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Özel bir ağ tanımlamak için <code>nn.Module</code>'u <code>__init__</code> ve <code>forward</code> ile alt sınıflandırmayı</li>
<li>Yerleşik katmanlarla model kurmayı: <code>Linear</code>, <code>ReLU</code>, <code>Dropout</code>, <code>LayerNorm</code>, <code>Softmax</code></li>
<li>3 katmanlı bir MLP'yi hem <code>nn.Sequential</code> ile hem elle yazılmış <code>forward</code> ile inşa etmeyi</li>
<li><code>.parameters()</code> / <code>.named_parameters()</code> ile parametreleri saymayı ve listelemeyi</li>
<li><code>state_dict</code> ile modelleri kaydetmeyi/yüklemeyi ve <code>.train()</code> / <code>.eval()</code> modları arasında geçiş yapmayı</li>
<li>Tüm modeli tek bir <code>.to(device)</code> çağrısıyla cihazlar arasında taşımayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Nesne Yönelimli Modeller?</h2>

<p class="l-text">Ders 1'de bir ileri geçişi <code>y = X @ w + b</code> olarak yazdık. Tek bir lineer katman için bu iyi. 100 milyon parametreli 12 katmanlı bir transformer için onlarca ağırlık tensor'unu manuel taşımak hızla yönetilemez hale gelir. <code>nn.Module</code> parametreleri onları kullanan fonksiyonla bir araya getirir ve size ücretsiz yardımcı programlar verir (GPU'ya taşı, parametre say, diske kaydet, eğitim/değerlendirme modları arasında geçiş yap).</p>

<div class="calc-highlight"><strong>Module sözleşmesi:</strong> <code>nn.Module</code>'u alt sınıflandıran ve <code>__init__</code> + <code>forward</code> tanımlayan herhangi bir sınıf otomatik olarak şunlara sahiptir: parametre keşfi, özyinelemeli <code>.to(device)</code>, özyinelemeli <code>.train()/.eval()</code> mod geçişi, <code>state_dict</code> serileştirmesi ve optimizer'lar ile DataLoader'larla entegrasyon. Siz matematiği yazarsınız; PyTorch tesisatı halleder.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">__init__</div><div class="card-body">Çocuk modülleri ve parametreleri oluşturduğunuz yer. <code>self.bir_şey</code> olarak sakladığınız bir Module veya Parameter ise PyTorch onu takip eder.</div></div>
<div class="calc-card"><div class="card-title">forward(x)</div><div class="card-body">Hesaplamayı tarif ettiğiniz yer. Katmanları fonksiyon gibi çağırırsınız: <code>self.fc(x)</code>. <code>forward()</code>'u ASLA doğrudan çağırmayın; modülü çağırın: <code>model(x)</code>.</div></div>
<div class="calc-card"><div class="card-title">parameters()</div><div class="card-body">Modül içindeki her öğrenilebilir tensor üzerinde özyinelemeli yineleyici. Bir optimizer'ı beslemek için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">state_dict()</div><div class="card-body">Parametre adlarını tensor'lara eşleyen bir Python sözlüğü. Kaydetme ve yükleme için standart format.</div></div>
<div class="calc-card"><div class="card-title">.to(device)</div><div class="card-body">Tüm parametreleri ve tamponları özyinelemeli olarak taşır. self döner, böylece zincirlenebilir.</div></div>
<div class="calc-card"><div class="card-title">.train() / .eval()</div><div class="card-body">Dropout ve batchnorm davranışını değiştirir. Değerlendirmeden önce her zaman <code>.eval()</code> çağırın.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: bir HuggingFace modeli nn.Module'lerin yığınıdır</div><div class="example-body"><code>BertForSequenceClassification</code>, <code>BertModel</code>'i (Module) içeren bir Module'dür ki o da <code>BertEmbeddings</code>, <code>BertEncoder</code>, <code>BertPooler</code> (hepsi Module) içerir. <code>BertEncoder</code> her biri attention, intermediate ve output Modüllerine sahip 12 <code>BertLayer</code> Modülü içerir. Sonuna kadar kompozisyon -- bir <code>model.to("cuda")</code> ağaçtaki her ağırlığı taşır.</div></div>

<div class="think-box"><div class="think-label">NEDEN SADECE FONKSİYONLAR DEĞİL?</div><div class="think-body">Bir ileri geçişi düz bir fonksiyon olarak yazıp ağırlıkları açıkça geçirebilirdiniz. JAX bu yaklaşımı benimser. PyTorch nesneleri seçti çünkü (1) parametreler çok ve onları geçirmek sıkıcı, (2) modlar (eğitim vs eval) ve durum (çalışan BN istatistikleri) yaşamak için bir yere ihtiyaç duyar, (3) kaydetme ve yükleme için kararlı bir ad -&gt; tensor eşlemesi gerekir. Module sınıfı tüm bunları bir arada tutmanın temiz bir yoludur.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. İlk Modülünüz</h2>

<p class="l-text">Bir tane yazma zamanı. İşte ikili sınıflandırma için minik iki katmanlı bir ağ, her hareketli parçayı göstermek için elle inşa edilmiş.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TinyMLP</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, in_dim=<span class="num">10</span>, hidden=<span class="num">32</span>, out_dim=<span class="num">2</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()                        <span class="cm"># her zaman önce super'i çağır</span>
        self.fc1 = nn.<span class="fn">Linear</span>(in_dim, hidden)      <span class="cm"># öğrenilebilir: weight (32,10), bias (32,)</span>
        self.fc2 = nn.<span class="fn">Linear</span>(hidden, out_dim)     <span class="cm"># öğrenilebilir: weight (2, 32), bias (2,)</span>
        self.relu = nn.<span class="fn">ReLU</span>()                     <span class="cm"># parametre yok</span>

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="cm"># x'in şekli (batch, in_dim)</span>
        h = self.<span class="fn">fc1</span>(x)         <span class="cm"># (batch, hidden)</span>
        h = self.<span class="fn">relu</span>(h)        <span class="cm"># (batch, hidden)</span>
        logits = self.<span class="fn">fc2</span>(h)    <span class="cm"># (batch, out_dim)</span>
        <span class="kw">return</span> logits

model = <span class="fn">TinyMLP</span>(in_dim=<span class="num">10</span>, hidden=<span class="num">32</span>, out_dim=<span class="num">2</span>)
<span class="fn">print</span>(model)

x = torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">10</span>)         <span class="cm"># 4 örneklik batch</span>
out = <span class="fn">model</span>(x)                 <span class="cm"># model.forward(x) DEĞİL; her zaman örneği çağır</span>
<span class="fn">print</span>(out.shape)               <span class="cm"># torch.Size([4, 2])</span>

<span class="cm"># Parametreleri incele</span>
<span class="kw">for</span> name, p <span class="kw">in</span> model.<span class="fn">named_parameters</span>():
    <span class="fn">print</span>(name, <span class="fn">tuple</span>(p.shape), p.requires_grad)
<span class="cm"># fc1.weight (32, 10) True</span>
<span class="cm"># fc1.bias   (32,)    True</span>
<span class="cm"># fc2.weight (2, 32)  True</span>
<span class="cm"># fc2.bias   (2,)     True</span>

n_params = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>() <span class="kw">if</span> p.requires_grad)
<span class="fn">print</span>(f<span class="str">"eğitilebilir param: {n_params}"</span>)    <span class="cm"># 32*10 + 32 + 2*32 + 2 = 386</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">nn.Module'ü açık forward() olan bir Python sınıfı ile taklit ediyoruz. Sklearn'in BaseEstimator'ü aynı yapıyı verir: .fit(), .predict(), parametreler attribute olarak.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

class MyLinearModel:
    def __init__(self, in_dim, out_dim, seed=0):
        rng = np.random.default_rng(seed)
        self.W = rng.standard_normal((in_dim, out_dim)) * 0.1
        self.b = np.zeros(out_dim)
    def forward(self, x):
        return x @ self.W + self.b
    def __call__(self, x):
        return self.forward(x)
    def parameters(self):
        return [self.W, self.b]

m = MyLinearModel(in_dim=4, out_dim=3)
x = np.random.randn(2, 4)
out = m(x)
print('out shape:', out.shape)
print('param shapes:', [p.shape for p in m.parameters()])
total = sum(p.size for p in m.parameters())
print(f'total params: {total}')</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>nn.Module</code>'u alt sınıflandırır ve önce <code>super().__init__()</code> çağırır -- bu çocuk modülleri ve parametreleri takip eden iç muhasebeyi başlatır. Bu tek satırı unutmak en yaygın hatalardan biridir. 2) İki <code>nn.Linear</code> katmanını ve bir <code>nn.ReLU</code>'yu örnek nitelikleri olarak saklar; PyTorch onları otomatik olarak algılar ve parametrelerini kaydeder. 3) İşlem zinciriyle <code>forward(x)</code>'i tanımlar; girdi şekli yorum olarak belgelenir, bu benimseyeceğiniz bir alışkanlıktır çünkü şekil takibi ayıklamanın yarısıdır. 4) Modeli örnekler ve yazdırır -- PyTorch her çocuğun yapılandırılmış bir özetini üretir. 5) <code>model.forward(x)</code> yerine <code>model(x)</code> çağırır; parantez formu hook desteği ve diğer tesisatları ekleyen <code>__call__</code>'ı çağırır. 6) Şekilleri ve gradyan gerektirmelerini doğrulamak için adlandırılmış parametreler üzerinde yineler. 7) Eğitilebilir parametreleri tek satırla sayar -- her makalede gördüğünüz standart "model boyutu" metriği.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">super().__init__()</div><div class="card-body">Her Module'ün <code>__init__</code>'inin zorunlu ilk satırı. Parametre ve alt modül takibini kurar.</div></div>
<div class="calc-card"><div class="card-title">self.layer = ...</div><div class="card-body">Bir Module veya Parameter'ı nitelik olarak saklamak otomatik kayıt yapar. Listeler, sözlükler: <code>nn.ModuleList</code> / <code>nn.ModuleDict</code> kullanın.</div></div>
<div class="calc-card"><div class="card-title">forward(self, x)</div><div class="card-body">Hesaplamayı tanımlayın. İstediğiniz kadar argüman alabilir. Döndürdüğünüz şey <code>model(x)</code>'in döndürdüğüdür.</div></div>
<div class="calc-card"><div class="card-title">model(x)</div><div class="card-body"><code>forward</code>'u hook'lar ve takiple saran <code>__call__</code>'ı tetikler. <code>.forward()</code> değil, bunu kullanın.</div></div>
<div class="calc-card"><div class="card-title">named_parameters()</div><div class="card-body">(ad, tensor) çiftleri verir. İnceleme, dondurma, weight decay grupları için kullanışlı.</div></div>
<div class="calc-card"><div class="card-title">parameters()</div><div class="card-body">Sadece tensor'ları verir. <code>torch.optim.Adam(model.parameters(), ...)</code>'a geçirdiğiniz form.</div></div>
</div>

<div class="l-warn"><strong>Tuzak (katmanları listede saklamak):</strong> <code>self.layers = [nn.Linear(10,10) for _ in range(3)]</code> yazarsanız PyTorch o katmanları KAYDETMEZ çünkü Python listeleri Module bilinçli değildir. Alt modüllerin sıralı koleksiyonları için her zaman <code>nn.ModuleList(...)</code> kullanın. Sözlükler için aynı: <code>nn.ModuleDict</code>.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. nn.Linear: İş Atı</h2>

<p class="l-text">Neredeyse her derin öğrenme mimarisi lineer katmanlar üzerine kuruludur. Matematik basit ama tam olarak bilmek değer.</p>

<div class="katex-block">$$\\mathbf{y} = \\mathbf{x}W^T + \\mathbf{b}, \\quad W \\in \\mathbb{R}^{out \\times in}, \\;\\mathbf{b}\\in\\mathbb{R}^{out}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x</div><div class="card-body">Şekli <code>(in_features,)</code> olan girdi vektörü. Pratikte batch'li: şekil <code>(B, in_features)</code> veya herhangi bir öncül boyut.</div></div>
<div class="calc-card"><div class="card-title">W</div><div class="card-body">Ağırlık matrisi; <code>nn.Linear</code> onu <code>(out, in)</code> olarak saklar ve PyTorch matmul'da sizin için transpoz eder.</div></div>
<div class="calc-card"><div class="card-title">b</div><div class="card-body">Şekli <code>(out_features,)</code> olan bias vektörü. Atlamak için kurucuya <code>bias=False</code> verin.</div></div>
<div class="calc-card"><div class="card-title">y</div><div class="card-body">Şekli <code>(out_features,)</code> olan çıktı vektörü; batch boyunca yayılır.</div></div>
<div class="calc-card"><div class="card-title">in_features</div><div class="card-body">Girdi boyutluluğu. Bir transformer için bu gizli boyuttur (BERT-base için 768).</div></div>
<div class="calc-card"><div class="card-title">out_features</div><div class="card-body">Çıktı boyutluluğu. Sınıflandırıcı kafası genellikle <code>num_classes</code>'a yansıtır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Linear: in_features=4, out_features=3</span>
fc = nn.<span class="fn">Linear</span>(in_features=<span class="num">4</span>, out_features=<span class="num">3</span>, bias=<span class="kw">True</span>)
<span class="fn">print</span>(fc.weight.shape)   <span class="cm"># torch.Size([3, 4])  -- (out, in)</span>
<span class="fn">print</span>(fc.bias.shape)     <span class="cm"># torch.Size([3])</span>

<span class="cm"># 2'lik batch üzerinde ileri geçiş</span>
x = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">4</span>)
y = <span class="fn">fc</span>(x)
<span class="fn">print</span>(y.shape)           <span class="cm"># torch.Size([2, 3])</span>

<span class="cm"># Manuel kopya: y = x @ W.T + b</span>
y_manual = x @ fc.weight.T + fc.bias
<span class="fn">print</span>(torch.<span class="fn">allclose</span>(y, y_manual))   <span class="cm"># True</span>

<span class="cm"># Linear herhangi öncül boyutlarda çalışır, son boyuta uygulanır</span>
seq = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">10</span>, <span class="num">4</span>)         <span class="cm"># batch=8, seq=10, dim=4</span>
out = <span class="fn">fc</span>(seq)
<span class="fn">print</span>(out.shape)        <span class="cm"># torch.Size([8, 10, 3])  -- yalnızca son boyut dönüştürülür</span>

<span class="cm"># Bias'ı devre dışı bırak (transformer'larda yaygın, küçük hız ve doğruluk kazanımı)</span>
fc2 = nn.<span class="fn">Linear</span>(<span class="num">4</span>, <span class="num">3</span>, bias=<span class="kw">False</span>)
<span class="fn">print</span>(<span class="fn">list</span>(fc2.<span class="fn">named_parameters</span>()))   <span class="cm"># yalnızca 'weight'</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">nn.Linear sadece W @ x + b afin haritasıdır. Sklearn'in LinearRegression / LogisticRegression bunun fit-and-predict iş akışları için üretim versiyonudur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LinearRegression

# Hand-built linear "layer"
rng = np.random.default_rng(0)
X = rng.standard_normal((100, 3))
y = X @ np.array([1.5, -2.0, 0.5]) + 0.3

# Manual init -- just like nn.Linear(3, 1)
W = rng.standard_normal((3, 1)) * 0.1
b = np.zeros(1)
y_hand = X @ W + b
print('hand-init prediction MSE:', float(((y_hand[:,0] - y) ** 2).mean().round(3)))

# Sklearn fits the same equation in closed form
lr = LinearRegression().fit(X, y)
y_lr = lr.predict(X)
print('sklearn fitted     MSE:', float(((y_lr - y) ** 2).mean().round(6)))
print('coef recovered:', lr.coef_.round(3), 'bias:', round(float(lr.intercept_), 3))</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) 4 girdi ve 3 çıktıyla bir Linear katman oluşturur. Ağırlık <code>(3, 4)</code> olarak saklanır -- konvansiyon <code>(out, in)</code>'dir çünkü PyTorch içsel olarak <code>x @ W.T</code> yapar. 2) İki parametre şeklini de yazdırır; bias sadece <code>out_features</code>'a uyan 1 boyutlu bir vektördür. 3) 2 vektörlük bir batch'i ileri besler ve <code>(2, 3)</code> çıktı alır. 4) Aynı işlemi ham matmul kullanarak elle kopyalar -- uyuşurlar, formülü doğrularlar. 5) Linear'in herhangi bir tensor rank'inde çalışan az takdir edilen özelliğini gösterir: yalnızca son boyut dönüştürülür. Bu, aynı Linear katmanın bir transformer'da <code>(B, T, D) -&gt; (B, T, D')</code> şekliyle her token başına uygulanabilmesinin sebebidir. 6) <code>bias=False</code>'ı gösterir -- transformer'lar bunu yaygın olarak kullanır çünkü LayerNorm etkili bir bias sağlar ve birini kaldırmak küçük miktarda bellek ve hesaplama tasarrufu sağlar.</p>

<div class="l-note"><strong>Başlatma:</strong> Varsayılan olarak <code>nn.Linear</code> ağırlık için Kaiming uniform ve bias için küçük bir uniform aralık kullanır. Özel mimariler için (transformer'lar, residual ağlar) bunu <code>nn.init.xavier_normal_</code> veya kendi şemanızla geçersiz kılmak isteyebilirsiniz; katmanı oluşturduktan sonra <code>__init__</code>'te yapın.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Aktivasyon Fonksiyonları</h2>

<p class="l-text">Lineer olmayanlık olmayan yığılmış lineer katmanlardan oluşan bir ağ sadece bir büyük lineer katmandır -- lineer haritaların kompozisyonu lineerdir. Aktivasyonlar bunu kırar, ağın keyfi fonksiyonları temsil etmesine izin verir. Aktivasyon seçimi başlangıçta düşünülenden daha önemlidir.</p>

<div class="katex-block">$$\\text{ReLU}(x) = \\max(0, x), \\quad \\text{GELU}(x) \\approx x\\Phi(x), \\quad \\text{Tanh}(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}$$</div>

<div class="katex-block">$$\\sigma(x) = \\frac{1}{1+e^{-x}}, \\quad \\text{Softmax}(x_i) = \\frac{e^{x_i}}{\\sum_j e^{x_j}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ReLU</div><div class="card-body">Negatifler -&gt; 0, pozitifler değişmez. 2012'den beri gizli katmanlar için varsayılan. Ucuz, pozitif tarafta vanishing gradient yok.</div></div>
<div class="calc-card"><div class="card-title">GELU</div><div class="card-body">Gauss CDF kullanan ReLU'nun pürüzsüz yaklaşımı. BERT, GPT ve çoğu transformer'da kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Tanh</div><div class="card-body">Çıktı (-1, 1)'de, sıfır merkezli. Eski varsayılan; hâlâ RNN kapılarında ve LSTM hücrelerinde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Sigmoid</div><div class="card-body">Çıktı (0, 1)'de, olasılık olarak yorumlanabilir. İkili sınıflandırıcıların ve kapıların son katmanında kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Softmax</div><div class="card-body">Bir vektörü 1'e toplanan olasılık dağılımına dönüştürür. Çok sınıflı sınıflandırıcıların son katmanı olarak kullanılır.</div></div>
<div class="calc-card"><div class="card-title">SiLU / Swish</div><div class="card-body">x * sigmoid(x). Pürüzsüz, birçok benchmark'ta ReLU'dan biraz daha iyi performans gösterir. EfficientNet, modern LLM'lerde kullanılır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

x = torch.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">7</span>)

<span class="cm"># Module olarak (durumlu, nitelik olarak sakla)</span>
relu  = nn.<span class="fn">ReLU</span>()
gelu  = nn.<span class="fn">GELU</span>()
tanh  = nn.<span class="fn">Tanh</span>()
sig   = nn.<span class="fn">Sigmoid</span>()

<span class="fn">print</span>(<span class="fn">relu</span>(x))    <span class="cm"># tensor([0, 0, 0, 0, 1, 2, 3])</span>
<span class="fn">print</span>(<span class="fn">gelu</span>(x))    <span class="cm"># pürüzsüz ReLU</span>
<span class="fn">print</span>(<span class="fn">tanh</span>(x))    <span class="cm"># sınırlı (-1, 1)</span>
<span class="fn">print</span>(<span class="fn">sig</span>(x))     <span class="cm"># sınırlı (0, 1)</span>

<span class="cm"># Fonksiyon olarak (durumsuz, doğrudan çağır)</span>
y = F.<span class="fn">relu</span>(x)
y = F.<span class="fn">gelu</span>(x)
y = F.<span class="fn">softmax</span>(x, dim=-<span class="num">1</span>)

<span class="cm"># 2 boyutlu logit matrisinde Softmax</span>
logits = torch.<span class="fn">tensor</span>([[<span class="num">2.0</span>, <span class="num">1.0</span>, <span class="num">0.1</span>], [<span class="num">0.5</span>, <span class="num">0.5</span>, <span class="num">3.0</span>]])
probs = F.<span class="fn">softmax</span>(logits, dim=-<span class="num">1</span>)
<span class="fn">print</span>(probs)
<span class="cm"># tensor([[0.6590, 0.2424, 0.0986],</span>
<span class="cm">#         [0.1142, 0.1142, 0.7716]])</span>
<span class="fn">print</span>(probs.<span class="fn">sum</span>(dim=-<span class="num">1</span>))   <span class="cm"># tensor([1., 1.])</span>

<span class="cm"># Log-softmax: sayısal olarak daha kararlı, NLLLoss ile kullanılır</span>
log_probs = F.<span class="fn">log_softmax</span>(logits, dim=-<span class="num">1</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy'da aktivasyon fonksiyonları: ReLU, sigmoid, tanh, GELU. torch.nn.functional'ın tensorlere element-wise uyguladığı formüllerin aynısı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.linspace(-3, 3, 7)

relu    = np.maximum(0, x)
sigmoid = 1 / (1 + np.exp(-x))
tanh    = np.tanh(x)
# GELU approx (Hendrycks & Gimpel)
gelu    = 0.5 * x * (1 + np.tanh(np.sqrt(2/np.pi) * (x + 0.044715 * x**3)))

print('x       :', x.round(3))
print('relu    :', relu.round(3))
print('sigmoid :', sigmoid.round(3))
print('tanh    :', tanh.round(3))
print('gelu    :', gelu.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Her aktivasyonu göstermek için negatif ve pozitif değerleri kapsayan küçük bir girdi vektörü oluşturur. 2) Module formunu gösterir: <code>nn.ReLU()</code> modelinizde <code>self.relu</code> olarak sakladığınız bir örnek oluşturur; çağrıldığında fonksiyonu uygular. 3) <code>torch.nn.functional</code>'dan (geleneksel olarak <code>F</code> olarak takma adlandırılır) fonksiyonel formu gösterir: saklanacak örnek yok, sadece <code>F.relu(x)</code> çağırın. Fonksiyonel ve Module formları durumsuz aktivasyonlar için eşdeğerdir -- hangisi daha temiz hissettiriyorsa onu seçin. 4) 2 boyutlu logit matrisine son boyut boyunca softmax uygular, satır başına olasılık dağılımları üretir; <code>probs.sum(dim=-1)</code> her satırın 1'e toplandığını doğrular. 5) Tek bir sayısal olarak kararlı hesaplamada log ve softmax'ı birleştiren <code>log_softmax</code>'ı gösterir -- zaten log olasılıkları istediğiniz cross-entropy için zorunludur.</p>

<div id="plot-pl3-activations-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> En yaygın beş aktivasyon fonksiyonu aynı x ekseninde. ReLU 0'da kırpar, GELU aynı fikrin pürüzsüz versiyonudur (yani kırılmada gradyana sahiptir), Tanh sıfır merkezli çıktıyla +-1'de doyar, Sigmoid 0/1'de doyar ve SiLU/Swish monotonik değildir ve 0'dan hemen önce hafif negatiftir. Modern transformer'lar GELU veya SiLU'yu ReLU'ya tercih eder çünkü sıfır yakınındaki pürüzsüz gradyan optimizasyona yardımcı olur.</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Module formu</div><div class="compare-item"><code>__init__</code>'te nitelik olarak saklanır</div><div class="compare-item"><code>print(model)</code>'da görünür</div><div class="compare-item">Eğitilebilir parametreleri var mı? Bazen (örn. PReLU)</div><div class="compare-item">"Adlandırılmış yapı taşları" için standart</div></div>
<div class="compare-col"><div class="compare-title">Fonksiyonel form (F.)</div><div class="compare-item"><code>forward</code>'da doğrudan çağrılır</div><div class="compare-item"><code>print(model)</code>'da görünmez</div><div class="compare-item">Her zaman durumsuz</div><div class="compare-item">Tek seferlik işlemler için daha temiz</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. nn.Sequential ve nn.ModuleList</h2>

<p class="l-text">İleri geçişiniz sadece "1. katmanı uygula, sonra 2., sonra 3." ise <code>nn.Sequential</code> sizi <code>forward</code> yazmaktan kurtarır. Daha karmaşık topolojiler için (residual bağlantılar, çoklu dallar) özel forward'lı <code>nn.ModuleList</code> kullanın.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># 1) Sequential: katmanların lineer zinciri</span>
model = nn.<span class="fn">Sequential</span>(
    nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">64</span>),
    nn.<span class="fn">ReLU</span>(),
    nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">64</span>),
    nn.<span class="fn">ReLU</span>(),
    nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">2</span>),
)
x = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">10</span>)
<span class="fn">print</span>(<span class="fn">model</span>(x).shape)        <span class="cm"># torch.Size([8, 2])</span>

<span class="cm"># Sequential'ı liste gibi indeksle</span>
<span class="fn">print</span>(model[<span class="num">0</span>])              <span class="cm"># ilk Linear</span>
<span class="fn">print</span>(model[-<span class="num">1</span>].out_features)  <span class="cm"># 2</span>

<span class="cm"># Adlandırılmış Sequential (ayıklama için daha açık)</span>
<span class="kw">from</span> collections <span class="kw">import</span> OrderedDict
model_named = nn.<span class="fn">Sequential</span>(<span class="fn">OrderedDict</span>([
    (<span class="str">"input"</span>,  nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">64</span>)),
    (<span class="str">"act1"</span>,   nn.<span class="fn">ReLU</span>()),
    (<span class="str">"hidden"</span>, nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">64</span>)),
    (<span class="str">"act2"</span>,   nn.<span class="fn">ReLU</span>()),
    (<span class="str">"output"</span>, nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">2</span>)),
]))
<span class="fn">print</span>(model_named.<span class="ty">input</span>)     <span class="cm"># adla erişim</span>

<span class="cm"># 2) ModuleList: alt modülleri listede tut, kendi forward'ını yaz</span>
<span class="kw">class</span> <span class="fn">ResNetBlock</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, dim, n=<span class="num">3</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.layers = nn.<span class="fn">ModuleList</span>([nn.<span class="fn">Linear</span>(dim, dim) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n)])
        self.act = nn.<span class="fn">ReLU</span>()
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        residual = x
        <span class="kw">for</span> layer <span class="kw">in</span> self.layers:
            x = self.<span class="fn">act</span>(<span class="fn">layer</span>(x))
        <span class="kw">return</span> x + residual            <span class="cm"># skip bağlantısı</span>

block = <span class="fn">ResNetBlock</span>(dim=<span class="num">32</span>, n=<span class="num">3</span>)
<span class="fn">print</span>(<span class="fn">block</span>(torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">32</span>)).shape)   <span class="cm"># (4, 32)</span>

<span class="cm"># 3) ModuleDict: alt modüllerin sözlüğü</span>
<span class="kw">class</span> <span class="fn">MultiHead</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.heads = nn.<span class="fn">ModuleDict</span>({
            <span class="str">"sentiment"</span>: nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">2</span>),
            <span class="str">"topic"</span>:     nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">10</span>),
        })
    <span class="kw">def</span> <span class="fn">forward</span>(self, x, task):
        <span class="kw">return</span> self.heads[task](x)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">nn.Sequential = sırayla uygulanan katman listesi. Python listesi ve for döngüsü ile aynısını yapıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def relu(x): return np.maximum(0, x)

rng = np.random.default_rng(0)
layers = [
    (rng.standard_normal((10, 32)) * 0.1, np.zeros(32)),
    (rng.standard_normal((32, 16)) * 0.1, np.zeros(16)),
    (rng.standard_normal((16,  3)) * 0.1, np.zeros(3)),
]

def forward(x):
    for i, (W, b) in enumerate(layers):
        x = x @ W + b
        if i < len(layers) - 1:
            x = relu(x)
    return x

x = np.random.randn(4, 10)
out = forward(x)
total_params = sum(W.size + b.size for W, b in layers)
print('input  shape:', x.shape)
print('output shape:', out.shape)
print('total params:', total_params)</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>nn.Sequential</code> bir katman listesi alır ve onları sırayla uygular; ileri geçiş örtüktür. Bu, düz MLP'ler ve evrişim yığınları için mükemmeldir. 2) Sequential liste gibi indekslemeyi destekler, katmanlara erişmek veya değiştirmek için kullanışlıdır. 3) OrderedDict formu her katmana bir ad vermenizi sağlar -- aynı model ama <code>print(model)</code> ve <code>state_dict()</code>'te okunabilir tanılar. 4) İleri geçiş basit bir zincir olmadığında (burada bir skip bağlantımız var), <code>nn.ModuleList</code> katmanları liste olarak saklarken özel bir <code>forward</code> yazmanıza izin verir. <code>x + residual</code> skip bağlantısı ResNet'in çekirdeğidir ve her transformer bloğunda da görünür. 5) <code>nn.ModuleDict</code> sözlük versiyonudur -- başlığın hangi görevi çalıştırdığınıza bağlı olduğu çoklu görev modelleri için harikadır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">nn.Sequential</div><div class="card-body">Lineer zincir. Özel forward gerekmez. Katmanlar bildirim sırasında çalışır. İndekslenebilir.</div></div>
<div class="calc-card"><div class="card-title">nn.ModuleList</div><div class="card-body">Sıralı liste. Özel forward gerektiğinde veya yinelemek istediğinizde kullanın. Uzunluk farkında, indekslenebilir.</div></div>
<div class="calc-card"><div class="card-title">nn.ModuleDict</div><div class="card-body">String anahtarlı. Çoklu görev başlıkları veya adlandırılmış dallar için kullanın. Modül bilinçli semantikle sözlük gibi davranır.</div></div>
<div class="calc-card"><div class="card-title">nn.ParameterList</div><div class="card-body">Ham Parameter'ların listesi (Module değil). Öğrenilebilir ama Module olmayan koleksiyon gerektiğinde kullanın.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Eğitim vs Eval Modu ve Tamponlar</h2>

<p class="l-text">Bazı katmanlar eğitim ve değerlendirmede farklı davranır. Dropout sadece eğitim sırasında rastgele birimleri sıfırlar; BatchNorm sadece değerlendirme sırasında çalışan istatistikleri kullanır. PyTorch tüm bunları tek bir çağrıyla değiştirir: <code>model.train()</code> veya <code>model.eval()</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">WithDropout</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc = nn.<span class="fn">Linear</span>(<span class="num">4</span>, <span class="num">4</span>)
        self.drop = nn.<span class="fn">Dropout</span>(p=<span class="num">0.5</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">drop</span>(self.<span class="fn">fc</span>(x))

m = <span class="fn">WithDropout</span>()
x = torch.<span class="fn">ones</span>(<span class="num">1</span>, <span class="num">4</span>)

m.<span class="fn">train</span>()                 <span class="cm"># dropout aktif</span>
<span class="fn">print</span>(<span class="fn">m</span>(x))               <span class="cm"># girdilerin yarısı (beklenen) sıfır</span>
m.<span class="fn">eval</span>()                  <span class="cm"># dropout kapalı</span>
<span class="fn">print</span>(<span class="fn">m</span>(x))               <span class="cm"># tüm girdiler geçer</span>

<span class="cm"># Tamponlar: öğrenilemez kalıcı durum (BatchNorm'da çalışan istatistikler gibi)</span>
<span class="kw">class</span> <span class="fn">WithRunningMean</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, dim):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc = nn.<span class="fn">Linear</span>(dim, dim)
        <span class="cm"># register_buffer bir tensor'u state_dict'in parçası yapar AMA parametre değil</span>
        self.<span class="fn">register_buffer</span>(<span class="str">"running_mean"</span>, torch.<span class="fn">zeros</span>(dim))
        self.momentum = <span class="num">0.1</span>

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">if</span> self.training:
            self.running_mean = (<span class="num">1</span> - self.momentum) * self.running_mean + self.momentum * x.<span class="fn">mean</span>(<span class="num">0</span>)
        out = self.<span class="fn">fc</span>(x - self.running_mean)
        <span class="kw">return</span> out

m2 = <span class="fn">WithRunningMean</span>(dim=<span class="num">4</span>)
<span class="fn">print</span>(m2.<span class="fn">state_dict</span>().<span class="fn">keys</span>())
<span class="cm"># odict_keys(['running_mean', 'fc.weight', 'fc.bias'])</span>
<span class="fn">print</span>(<span class="str">"running_mean param mi:"</span>, <span class="str">"running_mean"</span> <span class="kw">in</span> <span class="fn">dict</span>(m2.<span class="fn">named_parameters</span>()))
<span class="cm"># False -- bu bir tampon, parametre değil</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Eğitim vs eval modu en çok dropout / batchnorm'da görünür. Inverted dropout simüle ediyoruz: eğitimde rastgele sıfırlama, eval'de özdeşlik.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def dropout(x, p=0.3, training=True, seed=0):
    if not training:
        return x
    rng = np.random.default_rng(seed)
    mask = (rng.random(x.shape) > p).astype(float)
    return x * mask / (1 - p)   # inverted dropout scales for eval-equivalent magnitude

x = np.ones(8)
print('train mode :', dropout(x, training=True).round(3))
print('eval  mode :', dropout(x, training=False).round(3))
print('train mean ~ x.mean() because of inverted scaling:',
      dropout(np.random.randn(10000), training=True).mean().round(3))</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Dropout katmanlı minik bir modül tanımlar; farklı ileri geçiş davranışını göstermek için <code>train()</code> ve <code>eval()</code> çağırır. <code>train()</code>'de birimlerin yaklaşık yarısı sıfırlanır; <code>eval()</code>'da tüm birimler geçer. 2) <code>register_buffer</code> aracılığıyla tamponları gösterir: çalışan ortalama modelin durumunun parçasıdır (<code>state_dict</code> ile kaydedilir, <code>.to(device)</code> ile GPU'ya taşınır) ama eğitilmez -- <code>requires_grad</code> yoktur ve <code>parameters()</code>'da değildir. 3) <code>self.training</code> bayrağı (<code>train()/eval()</code> tarafından ayarlanır) BatchNorm ve Dropout'un içsel olarak kontrol ettiği şeydir. Bunu kendi forward'ınızda da kullanabilirsiniz, çalışan ortalama güncellemesi için gösterildiği gibi sadece eğitimde olur. 4) <code>state_dict</code> hem tamponları hem de parametreleri tam adlarıyla içerir; <code>parameters()</code> sadece öğrenilebilir olanları içerir.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Parameter</div><div class="compare-item">Öğrenilebilir, gradyanı var</div><div class="compare-item">Optimizer tarafından güncellenir</div><div class="compare-item"><code>parameters()</code> ve <code>state_dict()</code>'te</div><div class="compare-item">Örnekler: ağırlıklar, bias'lar</div></div>
<div class="compare-col"><div class="compare-title">Buffer</div><div class="compare-item">Öğrenilemez, gradyanı yok</div><div class="compare-item">Korunur ama optimize edilmez</div><div class="compare-item">Yalnızca <code>state_dict()</code>'te</div><div class="compare-item">Örnekler: BN çalışan ort/var, pozisyon embedding'leri (bazen)</div></div>
</div>

<div class="l-warn"><strong>Kritik:</strong> Doğrulama veya çıkarımdan önce her zaman <code>model.eval()</code> çağırın. Aksi halde dropout çıktıları rastgele sıfırlar ve doğruluğunuz gizemli bir şekilde düşer. Bellek tasarrufu için <code>with torch.no_grad():</code> ile eşleyin.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Kaydetme, Yükleme ve state_dict</h2>

<p class="l-text">Eğitimden sonra modeli kaydedersiniz. Yükledikten sonra kullanırsınız. Standart PyTorch deyimi <code>state_dict</code>'i (ad -&gt; tensor sözlüğü) kaydetmek ve yüklemektir, model nesnesinin kendisini değil.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TinyMLP</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc1 = nn.<span class="fn">Linear</span>(d, <span class="num">4</span>)
        self.fc2 = nn.<span class="fn">Linear</span>(<span class="num">4</span>, <span class="num">1</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">fc2</span>(torch.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x)))

model = <span class="fn">TinyMLP</span>(d=<span class="num">8</span>)

<span class="cm"># Yalnızca parametreleri kaydet (önerilen)</span>
torch.<span class="fn">save</span>(model.<span class="fn">state_dict</span>(), <span class="str">"tiny.pt"</span>)

<span class="cm"># Yükle: aynı mimariyi inşa et, sonra ağırlıkları yükle</span>
model2 = <span class="fn">TinyMLP</span>(d=<span class="num">8</span>)
model2.<span class="fn">load_state_dict</span>(torch.<span class="fn">load</span>(<span class="str">"tiny.pt"</span>))
model2.<span class="fn">eval</span>()

<span class="cm"># state_dict'in içeriğini incele</span>
sd = model.<span class="fn">state_dict</span>()
<span class="kw">for</span> k, v <span class="kw">in</span> sd.<span class="fn">items</span>():
    <span class="fn">print</span>(k, <span class="fn">tuple</span>(v.shape))
<span class="cm"># fc1.weight (4, 8)</span>
<span class="cm"># fc1.bias   (4,)</span>
<span class="cm"># fc2.weight (1, 4)</span>
<span class="cm"># fc2.bias   (1,)</span>

<span class="cm"># Daha fazla kaydet: model + optimizer + epoch (eğitime devam etmek için)</span>
checkpoint = {
    <span class="str">"epoch"</span>: <span class="num">10</span>,
    <span class="str">"model_state"</span>: model.<span class="fn">state_dict</span>(),
    <span class="cm"># "optim_state": optimizer.state_dict(),</span>
    <span class="str">"loss"</span>: <span class="num">0.123</span>,
}
torch.<span class="fn">save</span>(checkpoint, <span class="str">"ckpt.pt"</span>)
ck = torch.<span class="fn">load</span>(<span class="str">"ckpt.pt"</span>)
<span class="fn">print</span>(ck[<span class="str">"epoch"</span>], ck[<span class="str">"loss"</span>])

<span class="cm"># Strict vs strict olmayan yükleme (örn. ekstra başlıklarla ince ayar)</span>
<span class="cm"># missing, unexpected = model2.load_state_dict(sd, strict=False)</span>
<span class="cm"># print(missing, unexpected)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Kaydetme ve yükleme: bir modelin parametre dict'ini (NumPy dizilerinin listesi) np.savez ile serileştiriyoruz, torch.save(state_dict) gibi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import io

# Build model state_dict
rng = np.random.default_rng(0)
state = {
    'W1': rng.standard_normal((4, 8)).astype(np.float32),
    'b1': np.zeros(8, dtype=np.float32),
    'W2': rng.standard_normal((8, 2)).astype(np.float32),
    'b2': np.zeros(2, dtype=np.float32),
}

# Save to in-memory buffer
buf = io.BytesIO()
np.savez(buf, **state)
print('serialized size (bytes):', len(buf.getvalue()))

# Load back
buf.seek(0)
loaded = np.load(buf)
print('keys:', list(loaded.keys()))
for k in loaded:
    print(f'  {k}: shape {loaded[k].shape}, dtype {loaded[k].dtype}')

# Verify identical
print('round-trip equal:', np.allclose(state['W1'], loaded['W1']))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Küçük bir MLP tanımlar ve yalnızca <code>state_dict</code>'ini kaydeder -- parametre adlarını tensor'lara eşleyen bir sözlük. Bu <code>torch.save(model, ...)</code>'a tercih edilir çünkü sınıfın kendisini pickle etmez, böylece kodunuzu yeniden yapılandırdığınızda yükleme bozulmaz. 2) Yüklemek için mimariyi yeniden örnekleyip (Python sınıfı eşleşmeli) sonra <code>load_state_dict</code> çağırırsınız. 3) Parametre adlarını ve şekillerini incelemek için sözlük üzerinde yineler -- bir şey yüklemediğinde tam olarak doğrulamak istediğiniz şey. 4) Eğitime devam etmek için standart "checkpoint" kalıbını gösterir: model durumu, optimizer durumu, mevcut epoch ve metrikler içeren sözlük. 5) Yeni modelinizin hata vermemesi gereken ekstra katmanlara (ince ayar başlığı) sahip olduğunda kullanışlı <code>strict=False</code>'tan bahseder -- yalnızca beklenen farklılıkları doğrulamak için döndürülen <code>missing</code> ve <code>unexpected</code> listelerini inceleyebilirsiniz.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: HuggingFace ince ayarı</div><div class="example-body">Duygu için önceden eğitilmiş BERT'i ince ayarlarken iş akışı: (1) önceden eğitilmiş omurgayı <code>BertModel.from_pretrained("bert-base")</code> ile yükle, (2) yeni bir sınıflandırma başlığıyla onu modelinize sarın, (3) eğit, (4) modelinizin tam <code>state_dict</code>'ini kaydet. Önceden eğitilmiş ağırlıklar ve yeni sınıflandırıcınız birlikte kaydedilir; yükleme yalnızca sarmalayıcı sınıfınızın eşleşmesini gerektirir.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Gerçek Bir NLP Sınıflandırıcısı İnşa Etme</h2>

<p class="l-text">Her şeyi bir araya getirme zamanı. Önceden tokenize edilmiş diziler alan, onları gömen, token'ları havuzlayan ve bir sınıf tahmin eden küçük bir metin sınıflandırıcısı inşa edeceğiz. Bu binlerce NLP makalesinin iskeletidir ve sonraki derslerde yeniden kullanacağız.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TextClassifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, embed_dim=<span class="num">128</span>, hidden=<span class="num">64</span>, num_classes=<span class="num">2</span>, pad_idx=<span class="num">0</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed   = nn.<span class="fn">Embedding</span>(vocab_size, embed_dim, padding_idx=pad_idx)
        self.encoder = nn.<span class="fn">Sequential</span>(
            nn.<span class="fn">Linear</span>(embed_dim, hidden),
            nn.<span class="fn">ReLU</span>(),
            nn.<span class="fn">Dropout</span>(<span class="num">0.3</span>),
            nn.<span class="fn">Linear</span>(hidden, hidden),
            nn.<span class="fn">ReLU</span>(),
        )
        self.classifier = nn.<span class="fn">Linear</span>(hidden, num_classes)

    <span class="kw">def</span> <span class="fn">forward</span>(self, token_ids, attention_mask):
        <span class="cm"># token_ids: (B, T) int64</span>
        <span class="cm"># attention_mask: (B, T) float; 1 = gerçek, 0 = padding</span>
        emb = self.<span class="fn">embed</span>(token_ids)              <span class="cm"># (B, T, E)</span>
        h = self.<span class="fn">encoder</span>(emb)                    <span class="cm"># (B, T, H)</span>
        <span class="cm"># yalnızca gerçek token'lar üzerinde mean-pool</span>
        mask = attention_mask.<span class="fn">unsqueeze</span>(-<span class="num">1</span>)      <span class="cm"># (B, T, 1)</span>
        pooled = (h * mask).<span class="fn">sum</span>(dim=<span class="num">1</span>) / mask.<span class="fn">sum</span>(dim=<span class="num">1</span>).<span class="fn">clamp</span>(<span class="ty">min</span>=<span class="num">1</span>)
        logits = self.<span class="fn">classifier</span>(pooled)         <span class="cm"># (B, C)</span>
        <span class="kw">return</span> logits

<span class="cm"># Örnekle</span>
model = <span class="fn">TextClassifier</span>(vocab_size=<span class="num">10000</span>, embed_dim=<span class="num">128</span>, hidden=<span class="num">64</span>, num_classes=<span class="num">2</span>)
<span class="fn">print</span>(model)

<span class="cm"># Sahte batch</span>
B, T = <span class="num">4</span>, <span class="num">16</span>
ids = torch.<span class="fn">randint</span>(<span class="num">1</span>, <span class="num">10000</span>, (B, T))
ids[<span class="num">0</span>, <span class="num">10</span>:] = <span class="num">0</span>                            <span class="cm"># ilk örnekte yalnızca 10 gerçek token</span>
mask = (ids != <span class="num">0</span>).<span class="fn">float</span>()
logits = <span class="fn">model</span>(ids, mask)
<span class="fn">print</span>(logits.shape)                        <span class="cm"># (4, 2)</span>

<span class="cm"># Toplam parametreler</span>
n = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())
<span class="fn">print</span>(f<span class="str">"toplam parametreler: {n:,}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">sklearn ile gerçek bir metin sınıflandırıcı kur -- torch nn.Module'ün yapacağı aynı kavramsal yığın: metni özelleştir -> lineer katman -> sınıflandırma başı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

texts  = df_reviews['review'].tolist()
labels = df_reviews['label'].values

X_tr, X_te, y_tr, y_te = train_test_split(texts, labels, test_size=0.25, random_state=0)

vec = TfidfVectorizer(max_features=2000, ngram_range=(1, 2))
Xt_tr = vec.fit_transform(X_tr)
Xt_te = vec.transform(X_te)
print('feature dim:', Xt_tr.shape[1])

clf = LogisticRegression(max_iter=500).fit(Xt_tr, y_tr)
preds = clf.predict(Xt_te)
acc = accuracy_score(y_te, preds)
print(f'sentiment classifier accuracy: {acc:.3f}')
print('sample preds:', list(zip(preds[:5], y_te[:5])))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Dört katmanlı bir mimari tanımlar: embedding lookup, iki bloklu MLP encoder, sınıflandırıcı başlığı. <code>padding_idx=0</code> embedding katmanına 0 indeksinin padding olduğunu ve embedding'inin eğitilmemesi (sıfırda kalması) gerektiğini söyler. 2) <code>forward</code> hem token ID'lerini hem de bir dikkat maskesi alır -- maske değişken uzunluklu diziler için zorunludur, böylece padding'i cümle gösterimine ortalamayız. 3) Embedding lookup <code>(B, T)</code> tamsayı ID'leri <code>(B, T, E)</code> kayan nokta embedding'lerine dönüştürür. 4) Encoder her token başına aynı MLP'yi uygular; çıktı <code>(B, T, H)</code>. 5) Zaman boyutu üzerinde mean pooling maskeyi kullanır: çarp, topla, sonra gerçek token sayısına böl. <code>clamp(min=1)</code> olası tüm padding durumunda sıfıra bölmeyi önler. 6) Sınıflandırıcı havuzlanmış vektörü örnek başına iki logit'e yansıtır, cross-entropy için hazır. 7) Sahte batch testi şekilleri doğrular: 4 örnek, 2 sınıf, biri padding'li.</p>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> <code>nn.Module</code>'u alt sınıflandır; katmanları <code>__init__</code>'te bildir; hesaplamayı <code>forward</code>'da tarif et. Her zaman <code>super().__init__()</code> çağır.<br><strong>2.</strong> <code>model.forward(x)</code> değil <code>model(x)</code> çağır -- parantez formu hook'ları ve takibi çalıştırır.<br><strong>3.</strong> <code>nn.Linear</code> iş atı: <code>y = xW^T + b</code>, herhangi bir tensor'un son boyutuna uygulanır.<br><strong>4.</strong> Aktivasyonlar Module formunda (<code>nn.ReLU()</code>) ve fonksiyonel formda (<code>F.relu</code>) gelir; durumsuz olanlar için ikisi de eşdeğerdir.<br><strong>5.</strong> Düz yığınlar için <code>nn.Sequential</code>; özel topolojiler için <code>nn.ModuleList</code> / <code>nn.ModuleDict</code>. Düz Python listeleri alt modülleri KAYDETMEZ.<br><strong>6.</strong> Öğrenilemez durum için <code>register_buffer</code>; dropout ve batchnorm için <code>train()/eval()</code>'i değiştir.<br><strong>7.</strong> Model nesnesini değil <code>state_dict</code>'i kaydet ve yükle. Sınıfı yeniden örnekle, sonra ağırlıkları yükle.<br><strong>8.</strong> Sonraki ders: bu iskeletten <code>Dataset</code> ve <code>DataLoader</code> ile gerçek veri besle.</div></div>
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

  function actPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var xs = []; for (var i=-60;i<=60;i++) xs.push(i/15);
    function relu(x){return Math.max(0,x);}
    function gelu(x){var s=Math.sqrt(2/Math.PI);return 0.5*x*(1+Math.tanh(s*(x+0.044715*x*x*x)));}
    function tanh(x){return Math.tanh(x);}
    function sig(x){return 1/(1+Math.exp(-x));}
    function silu(x){return x*sig(x);}
    var t1 = {x:xs, y:xs.map(relu), mode:'lines', type:'scatter', name:'ReLU', line:{color:T.accent, width:2.5}};
    var t2 = {x:xs, y:xs.map(gelu), mode:'lines', type:'scatter', name:'GELU', line:{color:'#4ecdc4', width:2.5}};
    var t3 = {x:xs, y:xs.map(tanh), mode:'lines', type:'scatter', name:'Tanh', line:{color:'#f87171', width:2.5}};
    var t4 = {x:xs, y:xs.map(sig),  mode:'lines', type:'scatter', name:'Sigmoid', line:{color:'#a78bfa', width:2.5}};
    var t5 = {x:xs, y:xs.map(silu), mode:'lines', type:'scatter', name:'SiLU/Swish', line:{color:'#fbbf24', width:2.5, dash:'dot'}};
    var layout = Object.assign({}, common, {
      title:{text: lang === 'tr' ? 'Aktivasyon Fonksiyonlari' : 'Activation Functions', font:{color:T.text,size:14}},
      xaxis:{title:'x', gridcolor:T.grid, zerolinecolor:T.zero, range:[-4,4]},
      yaxis:{title: lang==='tr'?'cikis':'output', gridcolor:T.grid, zerolinecolor:T.zero, range:[-1.5,3]},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2,t3,t4,t5], layout, {responsive:true, displayModeBar:false});
  }

  actPlot('plot-pl3-activations-en', 'en');
  actPlot('plot-pl3-activations-tr', 'tr');
}, 250);</script>
`
};
