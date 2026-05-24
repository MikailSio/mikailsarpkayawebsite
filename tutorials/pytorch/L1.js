window.PYTORCH_L1 = {

en: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/17" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Derivative Definition</a> <span style="opacity:0.55;font-size:0.82em">(Math L17)</span></li>
<li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrices &amp; Operations</a> <span style="opacity:0.55;font-size:0.82em">(Math L72)</span></li>
<li><a href="/tutorials/matematik/91" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Geometric Vectors</a> <span style="opacity:0.55;font-size:0.82em">(Math L91)</span></li>
<li><a href="/tutorials/matematik/40" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Functions &amp; Notation</a> <span style="opacity:0.55;font-size:0.82em">(Math L40)</span></li>
</ul>
</div>
<p class="l-text"><strong>PyTorch is the language deep learning is written in today.</strong> When you read a paper from 2024 about transformers, diffusion models, or LLM fine-tuning, the reference code is almost always in PyTorch. HuggingFace runs on PyTorch. Meta's LLaMA, OpenAI's Whisper, Stability's Stable Diffusion -- all PyTorch. Before we touch a single neural network, we need to understand the atomic building block on which everything is built: the <code>Tensor</code>.</p>

<p class="l-text">A tensor is a generalization of a NumPy array with two superpowers. First, it can live on a GPU and run computations 50-100x faster than a CPU array. Second, it tracks its own history so PyTorch can compute gradients automatically -- no manual calculus, ever again. This lesson teaches you to create tensors, reshape them, move them between devices, and convert back and forth with NumPy. Master this and the rest of PyTorch becomes easy.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Create tensors with <code>torch.tensor</code>, <code>zeros</code>, <code>randn</code>, <code>arange</code>, and <code>_like</code> factories</li>
<li>Reshape tensors with <code>view</code>, <code>reshape</code>, <code>permute</code>, <code>squeeze</code>, and <code>unsqueeze</code></li>
<li>Move tensors between CPU and GPU with <code>.to(device)</code> and pick the right <code>dtype</code></li>
<li>Convert losslessly between PyTorch tensors and NumPy arrays via <code>from_numpy</code> / <code>.numpy()</code></li>
<li>Apply broadcasting and indexing rules to manipulate <code>(batch, seq, hidden)</code> NLP shapes</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why PyTorch? Why Tensors?</h2>

<p class="l-text">Imagine you are training a transformer on 100 million sentences. Each forward pass multiplies matrices of shape <code>(batch, seq_len, hidden_dim)</code>, each backward pass differentiates millions of parameters. If you wrote this in NumPy with a Python loop, training would take months. PyTorch turns this into seconds-per-step on a GPU because tensors are designed from the ground up for parallel hardware.</p>

<div class="calc-highlight"><strong>The three pillars of PyTorch:</strong> 1) <em>Tensors</em> -- multi-dimensional arrays that run on CPU or GPU. 2) <em>Autograd</em> -- automatic gradient computation, no manual derivatives. 3) <em>nn.Module</em> -- object-oriented model building blocks. The other 95% of PyTorch is convenience layered on top of these three.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Multi-dimensional</div><div class="card-body">A scalar is a 0-D tensor, a vector is 1-D, a matrix is 2-D. NLP commonly uses 3-D <code>(batch, seq, hidden)</code> and 4-D <code>(batch, head, seq, head_dim)</code>.</div></div>
<div class="calc-card"><div class="card-title">Typed</div><div class="card-body">Every tensor has a fixed <code>dtype</code>: float32, float16, bfloat16, int64, bool. Mixing types raises an error -- a feature, not a bug, that catches mistakes early.</div></div>
<div class="calc-card"><div class="card-title">Device-aware</div><div class="card-body">A tensor lives on exactly one device: <code>cpu</code> or <code>cuda:0</code>. Operations between tensors require them to be on the same device.</div></div>
<div class="calc-card"><div class="card-title">Differentiable</div><div class="card-body">If <code>requires_grad=True</code>, PyTorch records every operation into a computational graph for automatic backprop -- this is the magic that powers all training.</div></div>
<div class="calc-card"><div class="card-title">Vectorized</div><div class="card-body">Tensor operations are written in C++ and CUDA. A single line like <code>X @ W</code> runs on thousands of GPU cores in parallel.</div></div>
<div class="calc-card"><div class="card-title">Pythonic</div><div class="card-body">Despite the C++ engine, the API feels like NumPy: indexing, slicing, broadcasting, in-place ops. The learning curve is mild for anyone who knows arrays.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP shape intuition</div><div class="example-body">When you tokenize "I loved this movie" with BERT, you get a tensor of shape <code>(1, 6)</code> -- one batch, six tokens including <code>[CLS]</code> and <code>[SEP]</code>. After the embedding layer it becomes <code>(1, 6, 768)</code> -- six tokens each represented by a 768-dimensional vector. After the attention layer it stays <code>(1, 6, 768)</code>. After pooling it becomes <code>(1, 768)</code>. After the classifier it becomes <code>(1, 2)</code> -- two logits for positive/negative. Every transformer paper you read is just shape transformations on tensors.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why not stick with NumPy? Two reasons stop you immediately. First, NumPy has no GPU support -- you cannot train a modern model on CPU in any reasonable time. Second, NumPy has no autograd -- you would have to derive and code every backward pass manually for every architecture you try, which is intractable for transformers with hundreds of operations. PyTorch solves both with a NumPy-like API, so the migration cost is small but the capability gain is enormous.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Creating Tensors</h2>

<p class="l-text">There are roughly five ways to create a tensor: from existing Python data, from NumPy, from a shape with random or constant values, from a range, or from another tensor. Each has its place. Knowing them by reflex saves you typing thousands of times.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) From a Python list -- shape is inferred from nesting</span>
a = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">3.0</span>])               <span class="cm"># shape (3,)</span>
b = torch.<span class="fn">tensor</span>([[<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>], [<span class="num">4</span>, <span class="num">5</span>, <span class="num">6</span>]])        <span class="cm"># shape (2, 3)</span>
<span class="fn">print</span>(a.shape, a.dtype)   <span class="cm"># torch.Size([3]) torch.float32</span>
<span class="fn">print</span>(b.shape, b.dtype)   <span class="cm"># torch.Size([2, 3]) torch.int64</span>

<span class="cm"># 2) From a NumPy array -- shares memory by default with from_numpy</span>
arr = np.<span class="fn">array</span>([[<span class="num">1.0</span>, <span class="num">2.0</span>], [<span class="num">3.0</span>, <span class="num">4.0</span>]])
t1 = torch.<span class="fn">from_numpy</span>(arr)        <span class="cm"># zero-copy, shares the buffer</span>
t2 = torch.<span class="fn">tensor</span>(arr)            <span class="cm"># makes a copy, safer</span>

<span class="cm"># 3) Shape-based factories (most common in real code)</span>
zeros  = torch.<span class="fn">zeros</span>(<span class="num">2</span>, <span class="num">3</span>)                 <span class="cm"># shape (2, 3) of 0.0</span>
ones   = torch.<span class="fn">ones</span>(<span class="num">4</span>)                     <span class="cm"># shape (4,) of 1.0</span>
empty  = torch.<span class="fn">empty</span>(<span class="num">2</span>, <span class="num">2</span>)                 <span class="cm"># uninitialized memory, fastest</span>
full   = torch.<span class="fn">full</span>((<span class="num">2</span>, <span class="num">3</span>), fill_value=<span class="num">7.0</span>)
eye    = torch.<span class="fn">eye</span>(<span class="num">3</span>)                      <span class="cm"># 3x3 identity</span>

<span class="cm"># 4) Random tensors</span>
torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)
r_uniform = torch.<span class="fn">rand</span>(<span class="num">2</span>, <span class="num">3</span>)               <span class="cm"># uniform in [0, 1)</span>
r_normal  = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">3</span>)              <span class="cm"># standard normal N(0, 1)</span>
r_int     = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">10</span>, (<span class="num">2</span>, <span class="num">3</span>))   <span class="cm"># integers in [0, 10)</span>

<span class="cm"># 5) Range and linspace</span>
rng    = torch.<span class="fn">arange</span>(<span class="num">0</span>, <span class="num">10</span>, step=<span class="num">2</span>)       <span class="cm"># [0, 2, 4, 6, 8]</span>
lin    = torch.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, steps=<span class="num">5</span>)     <span class="cm"># [0.00, 0.25, 0.50, 0.75, 1.00]</span>

<span class="cm"># 6) Like another tensor (preserves shape, dtype, device)</span>
zeros_like = torch.<span class="fn">zeros_like</span>(b)
rand_like  = torch.<span class="fn">randn_like</span>(a)

<span class="fn">print</span>(zeros)
<span class="fn">print</span>(r_normal)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy arrays follow the same factory pattern as torch tensors. The shapes, dtypes and random sampling APIs are nearly identical.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# 1) From a Python list -- shape inferred
a = np.array([1.0, 2.0, 3.0])
b = np.array([[1, 2, 3], [4, 5, 6]])
print('a:', a.shape, a.dtype)
print('b:', b.shape, b.dtype)

# 2) Shape-based factories
zeros = np.zeros((2, 3))
ones  = np.ones((4,))
full  = np.full((2, 3), 7.0)
eye   = np.eye(3)

# 3) Random tensors with seeded RNG
rng = np.random.default_rng(0)
r_uniform = rng.random((2, 3))
r_normal  = rng.standard_normal((2, 3))

# 4) Range and linspace
print('arange:', np.arange(0, 10, 2))
print('linspace:', np.linspace(0, 1, 5))
print('eye:', eye)
print('r_normal:\n', r_normal.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>torch.tensor</code> wraps a Python list and infers shape and dtype -- floats become <code>float32</code>, ints become <code>int64</code> by default. 2) <code>torch.from_numpy</code> shares memory with the NumPy array (no copy, very fast) while <code>torch.tensor(np_array)</code> copies, which is safer if you intend to modify either side. 3) Shape-based factories like <code>zeros</code>, <code>ones</code>, <code>full</code>, <code>eye</code> are the bread and butter for initializing weights, masks, and identity matrices. 4) <code>torch.rand</code> samples uniform [0,1), <code>randn</code> samples standard normal N(0,1) -- normal is what you almost always want for weight init. 5) <code>arange</code> mirrors Python's <code>range</code> for integer-style sequences; <code>linspace</code> gives you N evenly spaced floats including both endpoints. 6) The <code>_like</code> family creates a new tensor with the same shape, dtype, and device as a reference -- handy when you need a buffer matching an existing tensor in your model.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">torch.tensor(data)</div><div class="card-body">General constructor. Works with lists, tuples, NumPy arrays. Always copies. Use this 90% of the time for small data.</div></div>
<div class="calc-card"><div class="card-title">torch.zeros / ones</div><div class="card-body">Shape-based, fast, deterministic. Default dtype is <code>float32</code>. Pass <code>dtype=</code> to change it.</div></div>
<div class="calc-card"><div class="card-title">torch.randn</div><div class="card-body">Standard normal samples. The right default for weight initialization in shallow networks.</div></div>
<div class="calc-card"><div class="card-title">torch.arange</div><div class="card-body">Integer-style range. Common for building position indices, token IDs, mask templates.</div></div>
<div class="calc-card"><div class="card-title">torch.linspace</div><div class="card-body">Float range, both endpoints inclusive. Useful for grids, learning-rate schedules, plotting.</div></div>
<div class="calc-card"><div class="card-title">torch.empty</div><div class="card-body">Uninitialized buffer -- fastest allocation. Only use when you will overwrite every cell yourself.</div></div>
</div>

<div class="l-warn"><strong>Pitfall:</strong> <code>torch.Tensor(2, 3)</code> with capital T is the legacy class constructor and creates an <em>uninitialized</em> tensor of that shape -- not a tensor with values 2 and 3. Always use lowercase <code>torch.tensor</code> for value-based construction. This single confusion has burned every PyTorch beginner at least once.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Tensor Attributes: shape, dtype, device</h2>

<p class="l-text">Every tensor has three pieces of metadata that determine what you can do with it: <code>shape</code> (its dimensions), <code>dtype</code> (its element type), and <code>device</code> (where it lives in memory). Operations require these to match -- mismatch is the most common bug in PyTorch code.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

x = torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">8</span>, <span class="num">16</span>)        <span class="cm"># imagine: batch=4, seq=8, hidden=16</span>
<span class="fn">print</span>(x.shape)        <span class="cm"># torch.Size([4, 8, 16])</span>
<span class="fn">print</span>(x.<span class="fn">size</span>())       <span class="cm"># same as .shape -- both work</span>
<span class="fn">print</span>(x.<span class="fn">size</span>(<span class="num">0</span>))      <span class="cm"># 4   (size of dim 0)</span>
<span class="fn">print</span>(x.<span class="fn">dim</span>())        <span class="cm"># 3   (number of dimensions = rank)</span>
<span class="fn">print</span>(x.<span class="fn">numel</span>())      <span class="cm"># 512 (total number of elements = 4*8*16)</span>

<span class="cm"># dtype -- the element type</span>
<span class="fn">print</span>(x.dtype)        <span class="cm"># torch.float32</span>
<span class="fn">print</span>(x.<span class="fn">element_size</span>())  <span class="cm"># 4 bytes per float32</span>

<span class="cm"># Convert dtype with .to or specific methods</span>
x_half  = x.<span class="fn">to</span>(torch.float16)        <span class="cm"># half precision (2 bytes per elem)</span>
x_long  = x.<span class="fn">to</span>(torch.int64)          <span class="cm"># integers (truncates)</span>
x_bool  = (x &gt; <span class="num">0</span>)                    <span class="cm"># boolean mask</span>
x_f64   = x.<span class="fn">double</span>()                 <span class="cm"># alias for .to(torch.float64)</span>
x_f32   = x.<span class="fn">float</span>()                  <span class="cm"># alias for .to(torch.float32)</span>

<span class="cm"># device -- where the tensor lives</span>
<span class="fn">print</span>(x.device)       <span class="cm"># cpu</span>

<span class="cm"># Promote two tensors of different dtype: PyTorch picks the larger</span>
a = torch.<span class="fn">tensor</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>])             <span class="cm"># int64</span>
b = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">3.0</span>])       <span class="cm"># float32</span>
c = a + b                               <span class="cm"># promotes a to float32</span>
<span class="fn">print</span>(c.dtype)                          <span class="cm"># torch.float32</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy arrays expose the exact same metadata triplet (shape, dtype, ndim/size) that torch tensors do. The mental model carries over directly.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.random.randn(4, 8, 16)   # batch=4, seq=8, hidden=16
print('shape:', x.shape)
print('size  (numel):', x.size)
print('ndim  (rank):', x.ndim)
print('dtype:', x.dtype)
print('dim 0:', x.shape[0])

# Cast dtype (analog of .to(dtype))
x_f16 = x.astype(np.float16)
x_i32 = x.astype(np.int32)
print('float16 dtype:', x_f16.dtype, 'bytes:', x_f16.nbytes)
print('int32 dtype  :', x_i32.dtype, 'bytes:', x_i32.nbytes)

# device: NumPy is CPU-only -> mirrors what torch does without GPU
print('device equivalent: cpu (numpy is host-memory only)')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>x.shape</code> and <code>x.size()</code> are equivalent and return a <code>torch.Size</code> -- behaves like a Python tuple but with helper methods. 2) <code>x.size(0)</code> returns just the size of dimension 0; super useful when you write <code>batch_size = x.size(0)</code> in model code. 3) <code>x.dim()</code> tells you the rank (3 here for a typical NLP tensor); <code>x.numel()</code> gives the total cell count, useful for sanity checks like "does my parameter count match the model card?". 4) <code>dtype</code> determines how each element is stored -- float32 is the default and uses 4 bytes; float16 halves memory but loses precision; int64 is for indices; bool is for masks. 5) <code>.to(dtype)</code> returns a new tensor with the requested type; <code>.float()</code>, <code>.double()</code>, <code>.long()</code> are convenience aliases. 6) When you mix dtypes, PyTorch automatically promotes to the more general type (float beats int, float64 beats float32), so don't expect silent integer arithmetic when one side is float.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">float32 (default)</div><div class="compare-item">4 bytes per element</div><div class="compare-item">~7 decimal digits of precision</div><div class="compare-item">Universal default for training</div><div class="compare-item">Range: about 1e-38 to 3e38</div><div class="compare-item">Used by all standard NN layers</div></div>
<div class="compare-col"><div class="compare-title">float16 / bfloat16</div><div class="compare-item">2 bytes per element</div><div class="compare-item">~3-4 decimal digits</div><div class="compare-item">Halves memory, doubles speed on modern GPUs</div><div class="compare-item">Used in mixed-precision training (AMP)</div><div class="compare-item">bfloat16 has wider range, less precision</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP tensor shapes you will see daily</div><div class="example-body"><strong>(B, T):</strong> input token IDs, B=batch, T=sequence length. Dtype int64. <strong>(B, T, D):</strong> embeddings or hidden states, D=hidden dim (e.g. 768 for BERT-base). Dtype float32. <strong>(B, H, T, T):</strong> attention scores, H=number of heads. Dtype float32. <strong>(V, D):</strong> embedding lookup table, V=vocabulary size (~30k for BERT). <strong>(B, T):</strong> attention mask, dtype bool or float. Recognizing these shapes lets you read transformer code at a glance.</div></div>

<div class="l-note"><strong>Pro tip:</strong> When debugging shape mismatches, sprinkle <code>print("name", x.shape)</code> through your forward pass. The shape after each layer is the single most useful piece of information for understanding why a model crashes.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Reshaping: view, reshape, squeeze, unsqueeze, permute</h2>

<p class="l-text">Reshaping is the most common operation after creation. You receive a tensor of one shape and need another -- adding a batch dim, flattening, swapping axes, splitting heads. PyTorch gives you several tools that look similar but behave differently. Knowing which to reach for is part of fluency.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

x = torch.<span class="fn">arange</span>(<span class="num">24</span>)              <span class="cm"># shape (24,)</span>
<span class="fn">print</span>(x.shape)                    <span class="cm"># torch.Size([24])</span>

<span class="cm"># view -- requires contiguous memory, returns a VIEW (no copy)</span>
y = x.<span class="fn">view</span>(<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>)
<span class="fn">print</span>(y.shape)                    <span class="cm"># torch.Size([2, 3, 4])</span>
y[<span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>] = <span class="num">999</span>
<span class="fn">print</span>(x[<span class="num">0</span>])                       <span class="cm"># 999 -- shared memory!</span>

<span class="cm"># reshape -- works even if not contiguous, may copy</span>
z = x.<span class="fn">reshape</span>(<span class="num">4</span>, <span class="num">6</span>)

<span class="cm"># -1 means "infer this dimension"</span>
flat = y.<span class="fn">view</span>(-<span class="num">1</span>)                 <span class="cm"># shape (24,)</span>
mat  = y.<span class="fn">view</span>(<span class="num">2</span>, -<span class="num">1</span>)              <span class="cm"># shape (2, 12)</span>

<span class="cm"># squeeze / unsqueeze -- remove or add a size-1 dim</span>
a = torch.<span class="fn">randn</span>(<span class="num">1</span>, <span class="num">3</span>, <span class="num">1</span>, <span class="num">5</span>)
<span class="fn">print</span>(a.<span class="fn">squeeze</span>().shape)          <span class="cm"># torch.Size([3, 5])  -- removes ALL size-1</span>
<span class="fn">print</span>(a.<span class="fn">squeeze</span>(<span class="num">0</span>).shape)         <span class="cm"># torch.Size([3, 1, 5]) -- removes only dim 0</span>
b = torch.<span class="fn">randn</span>(<span class="num">3</span>, <span class="num">5</span>)
<span class="fn">print</span>(b.<span class="fn">unsqueeze</span>(<span class="num">0</span>).shape)       <span class="cm"># torch.Size([1, 3, 5]) -- add batch dim</span>
<span class="fn">print</span>(b.<span class="fn">unsqueeze</span>(-<span class="num">1</span>).shape)      <span class="cm"># torch.Size([3, 5, 1])</span>

<span class="cm"># permute -- arbitrary axis swap (transpose for &gt;2D)</span>
img = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">224</span>, <span class="num">224</span>, <span class="num">3</span>)         <span class="cm"># NHWC layout (TF-style)</span>
img_pt = img.<span class="fn">permute</span>(<span class="num">0</span>, <span class="num">3</span>, <span class="num">1</span>, <span class="num">2</span>)          <span class="cm"># NCHW (PyTorch style) -- (8, 3, 224, 224)</span>

<span class="cm"># transpose -- swap exactly two dims</span>
x2 = torch.<span class="fn">randn</span>(<span class="num">3</span>, <span class="num">5</span>)
<span class="fn">print</span>(x2.<span class="fn">transpose</span>(<span class="num">0</span>, <span class="num">1</span>).shape)           <span class="cm"># (5, 3)</span>

<span class="cm"># flatten -- collapse a range of dims</span>
emb = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">4</span>, <span class="num">8</span>)                <span class="cm"># batch=2, seq=4, dim=8</span>
flat_emb = emb.<span class="fn">flatten</span>(start_dim=<span class="num">1</span>)       <span class="cm"># (2, 32) -- batch dim preserved</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy reshape, squeeze, expand_dims and transpose are the direct analogues of torch view/reshape/squeeze/unsqueeze/permute.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.arange(12)                  # shape (12,)
print('flat:', x.shape)

# view / reshape -- NumPy: .reshape (always works)
y = x.reshape(3, 4)
print('reshape (3,4):', y.shape)

# unsqueeze (add a dim)  -> np.expand_dims
z = np.expand_dims(y, axis=0)      # (1, 3, 4)
print('expand_dims dim 0:', z.shape)

# squeeze (drop dims of size 1) -> np.squeeze
print('squeeze back:', np.squeeze(z).shape)

# permute / transpose
img = np.random.randn(3, 32, 32)   # (C, H, W)
img_hwc = np.transpose(img, (1, 2, 0))   # (H, W, C)
print('CHW -> HWC:', img.shape, '->', img_hwc.shape)

# flatten / contiguous
print('flatten:', y.flatten().shape)</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>view(2, 3, 4)</code> reinterprets a 24-element vector as a 2x3x4 tensor without copying memory -- the underlying buffer stays the same. Modifying the view modifies the original (line shows <code>x[0]</code> becomes 999). 2) <code>reshape</code> is the safer cousin: same goal but it falls back to a copy if the tensor is not contiguous. Default to <code>reshape</code> unless you specifically know the tensor is contiguous. 3) <code>-1</code> as one dimension tells PyTorch to compute it from the others, common idiom for flattening. 4) <code>squeeze</code> removes all dimensions of size 1; <code>squeeze(d)</code> removes only that specific dimension if it is size 1. <code>unsqueeze(d)</code> inserts a new dimension of size 1 at position d -- the canonical way to add a batch dimension. 5) <code>permute(0, 3, 1, 2)</code> rearranges axes by index -- here it converts the TensorFlow image layout (NHWC) to the PyTorch layout (NCHW). 6) <code>transpose(a, b)</code> is permute restricted to swapping exactly two dimensions; clearer when you only need to swap two. 7) <code>flatten(start_dim=1)</code> collapses dimensions 1 onwards into a single dim, preserving the batch dimension -- the standard way to feed a Conv output into a Linear layer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">view(...)</div><div class="card-body">No-copy reshape. Fast but requires contiguous memory; raises if not. Use after fresh creation.</div></div>
<div class="calc-card"><div class="card-title">reshape(...)</div><div class="card-body">Same intent as view but copies when needed. Safer default. Use whenever you are unsure.</div></div>
<div class="calc-card"><div class="card-title">unsqueeze(d)</div><div class="card-body">Insert a size-1 dim at position d. Adding a batch dim is <code>x.unsqueeze(0)</code>.</div></div>
<div class="calc-card"><div class="card-title">squeeze(d)</div><div class="card-body">Remove a size-1 dim. Without an argument, removes all of them.</div></div>
<div class="calc-card"><div class="card-title">permute(*dims)</div><div class="card-body">Reorder axes by index. Returns a view. Often you need <code>.contiguous()</code> after.</div></div>
<div class="calc-card"><div class="card-title">transpose(a, b)</div><div class="card-body">Swap exactly two dimensions. Equivalent to a 2-arg permute. Most common for matrix transpose.</div></div>
</div>

<div id="plot-pl1-shapes-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A typical transformer forward pass as a sequence of shape transformations. Input token IDs <code>(B,T)</code> become embeddings <code>(B,T,D)</code>, attention reshapes them to <code>(B,H,T,d)</code> for parallel multi-head computation, then collapses back, and finally pooling reduces the time dimension to produce a per-sample vector <code>(B,D)</code>. Reading transformer code is largely about tracking these shapes.</div>

<div class="l-warn"><strong>Pitfall:</strong> After <code>permute</code>, the tensor is non-contiguous. Calling <code>.view()</code> on it will raise. Either use <code>.reshape()</code>, or call <code>.contiguous()</code> first to get a fresh contiguous copy. This is an extremely common transformer-code error.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. CPU vs GPU: Devices, .to(), .cuda()</h2>

<p class="l-text">A tensor lives on exactly one piece of hardware: the CPU's main RAM, or one specific GPU's video memory (VRAM). Operations between two tensors require both on the same device, and moving data between devices is slow -- you want to do it once at the start of a batch, not in the middle of your forward pass.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># 1) Detect available device</span>
<span class="fn">print</span>(torch.cuda.<span class="fn">is_available</span>())          <span class="cm"># True if NVIDIA GPU + CUDA installed</span>
<span class="fn">print</span>(torch.cuda.<span class="fn">device_count</span>())          <span class="cm"># how many GPUs</span>
<span class="fn">print</span>(torch.cuda.<span class="fn">get_device_name</span>(<span class="num">0</span>))      <span class="cm"># e.g. 'NVIDIA RTX 4090'</span>

<span class="cm"># 2) Idiomatic device selection</span>
device = torch.<span class="fn">device</span>(<span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>)
<span class="fn">print</span>(device)                             <span class="cm"># cuda or cpu</span>

<span class="cm"># 3) Move a tensor to a device</span>
x = torch.<span class="fn">randn</span>(<span class="num">1024</span>, <span class="num">1024</span>)               <span class="cm"># created on CPU by default</span>
x_gpu = x.<span class="fn">to</span>(device)                      <span class="cm"># move to GPU (or no-op on CPU)</span>
<span class="fn">print</span>(x_gpu.device)                       <span class="cm"># cuda:0</span>

<span class="cm"># 4) Create directly on a device (faster -- no copy)</span>
x_direct = torch.<span class="fn">randn</span>(<span class="num">1024</span>, <span class="num">1024</span>, device=device)

<span class="cm"># 5) Operations require same device</span>
a = torch.<span class="fn">randn</span>(<span class="num">3</span>, device=<span class="str">"cpu"</span>)
b = torch.<span class="fn">randn</span>(<span class="num">3</span>, device=device)
<span class="cm"># c = a + b   # RuntimeError: expected all tensors on same device</span>
c = a.<span class="fn">to</span>(device) + b   <span class="cm"># OK</span>

<span class="cm"># 6) Move back to CPU before NumPy / plotting</span>
y = x_gpu.<span class="fn">cpu</span>()                           <span class="cm"># back on CPU</span>
y_np = y.<span class="fn">numpy</span>()                          <span class="cm"># NumPy array (zero-copy)</span>

<span class="cm"># 7) Apple Silicon: MPS backend</span>
<span class="cm"># device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pyodide runs only on CPU, but we can still compare a vectorized NumPy op to a Python loop -- the same speed-up principle (vectorization on parallel hardware) is what makes GPUs win for big tensors.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import time

n = 200_000
a = np.random.randn(n)
b = np.random.randn(n)

# Vectorized NumPy (calls C/SIMD under the hood)
t0 = time.time()
for _ in range(50):
    c = a * b + np.sin(a)
vec_ms = (time.time() - t0) * 1000

# Pure Python loop -- equivalent on a "slow device"
t0 = time.time()
for _ in range(2):  # only 2 reps, the loop is slow
    out = [a[i] * b[i] + math.sin(a[i]) for i in range(2000)]
loop_ms = (time.time() - t0) * 1000

print(f'Vectorized 50 reps over {n} elems : {vec_ms:7.2f} ms')
print(f'Python loop  2 reps over   2000   : {loop_ms:7.2f} ms')
print('GPU vs CPU follows the same pattern: parallel hw beats serial hw.')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>torch.cuda.is_available()</code> tells you whether CUDA is installed and a GPU is visible -- always gate your code on this so it falls back to CPU on machines without GPU. 2) The <code>torch.device("cuda" if available else "cpu")</code> idiom is universal in PyTorch code; you compute it once and pass it everywhere. 3) <code>.to(device)</code> moves a tensor; if it is already on that device the call is a no-op. The original tensor is untouched -- <code>.to()</code> returns a new tensor reference, but the data is the same buffer for same-device "moves". 4) <code>device=device</code> at creation time is faster because it avoids an unnecessary CPU allocation; prefer this in performance-critical code. 5) Mixing devices in a single op raises a clear error: PyTorch refuses to silently move data because moves are slow. 6) Before NumPy or matplotlib, move back to CPU; <code>.numpy()</code> works only on CPU tensors and shares memory. 7) On Apple Silicon Macs (M1/M2/M3) you can use the MPS backend; the API is identical, just substitute <code>"mps"</code> for <code>"cuda"</code>.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">CPU</div><div class="compare-item">Always available, no setup</div><div class="compare-item">Tens of cores, large RAM</div><div class="compare-item">Good for data loading, preprocessing</div><div class="compare-item">Slow for large matrix multiplies</div><div class="compare-item">Use for inference of small models</div></div>
<div class="compare-col"><div class="compare-title">GPU (CUDA)</div><div class="compare-item">Thousands of small cores</div><div class="compare-item">High-bandwidth VRAM (8-80 GB)</div><div class="compare-item">10-100x faster for matmul, conv</div><div class="compare-item">Limited memory; OOM is common</div><div class="compare-item">Required for training transformers</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: A correct training-step pattern</div><div class="example-body">In every training script you will write: <code>model.to(device)</code> moves all parameters once at the start. Then in the loop: <code>x, y = batch[0].to(device), batch[1].to(device)</code> moves each batch on entry. Never move inside the forward pass. The <em>three rules</em> of GPU code: (1) move parameters once, (2) move data per batch, (3) keep everything on the GPU until you log it.</div></div>

<div class="l-warn"><strong>Pitfall (CUDA out of memory):</strong> If you see "CUDA out of memory", check three things: are you accumulating tensors in a Python list without detaching? are your batch sizes too big? did you forget <code>torch.no_grad()</code> during evaluation? OOM is almost never about a single big tensor; it is usually thousands of small ones piling up.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Indexing, Slicing, and Boolean Masks</h2>

<p class="l-text">PyTorch indexing is essentially identical to NumPy indexing -- if you know NumPy, you already know this. The few PyTorch-specific notes (advanced indexing, boolean masks for variable-length data) are crucial for NLP though, where padding masks and attention masks are everywhere.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

x = torch.<span class="fn">arange</span>(<span class="num">20</span>).<span class="fn">reshape</span>(<span class="num">4</span>, <span class="num">5</span>)
<span class="fn">print</span>(x)
<span class="cm"># tensor([[ 0,  1,  2,  3,  4],</span>
<span class="cm">#         [ 5,  6,  7,  8,  9],</span>
<span class="cm">#         [10, 11, 12, 13, 14],</span>
<span class="cm">#         [15, 16, 17, 18, 19]])</span>

<span class="cm"># 1) Basic indexing</span>
<span class="fn">print</span>(x[<span class="num">0</span>])              <span class="cm"># row 0: tensor([0, 1, 2, 3, 4])</span>
<span class="fn">print</span>(x[<span class="num">0</span>, <span class="num">2</span>])           <span class="cm"># element: tensor(2)</span>
<span class="fn">print</span>(x[:, <span class="num">1</span>])           <span class="cm"># col 1:   tensor([1, 6, 11, 16])</span>
<span class="fn">print</span>(x[<span class="num">1</span>:<span class="num">3</span>, <span class="num">2</span>:<span class="num">4</span>])       <span class="cm"># 2x2 sub-block</span>

<span class="cm"># 2) Negative indices and steps</span>
<span class="fn">print</span>(x[-<span class="num">1</span>])             <span class="cm"># last row</span>
<span class="fn">print</span>(x[::<span class="num">2</span>])            <span class="cm"># every other row -- (2, 5)</span>

<span class="cm"># 3) Boolean mask -- the heart of NLP attention masking</span>
mask = x &gt; <span class="num">10</span>
<span class="fn">print</span>(mask)              <span class="cm"># bool tensor of shape (4, 5)</span>
<span class="fn">print</span>(x[mask])           <span class="cm"># 1-D tensor of values where mask is True</span>

<span class="cm"># 4) Index with a list of indices (advanced indexing)</span>
rows = torch.<span class="fn">tensor</span>([<span class="num">0</span>, <span class="num">2</span>, <span class="num">3</span>])
<span class="fn">print</span>(x[rows])           <span class="cm"># selects rows 0, 2, 3 -- shape (3, 5)</span>

<span class="cm"># 5) Padding mask example: sequence lengths</span>
seq = torch.<span class="fn">tensor</span>([
    [<span class="num">101</span>, <span class="num">2003</span>,  <span class="num">170</span>,  <span class="num">102</span>,    <span class="num">0</span>,    <span class="num">0</span>],   <span class="cm"># length 4</span>
    [<span class="num">101</span>, <span class="num">1037</span>,  <span class="num">189</span>, <span class="num">1567</span>,  <span class="num">202</span>,  <span class="num">102</span>],   <span class="cm"># length 6</span>
])
pad_mask = (seq != <span class="num">0</span>)    <span class="cm"># True where token is real, False for padding</span>
<span class="fn">print</span>(pad_mask)
<span class="cm"># tensor([[ True,  True,  True,  True, False, False],</span>
<span class="cm">#         [ True,  True,  True,  True,  True,  True]])</span>

<span class="cm"># 6) gather / scatter -- batched indexing</span>
emb = torch.<span class="fn">randn</span>(<span class="num">10</span>, <span class="num">4</span>)              <span class="cm"># 10 tokens, 4-dim embeddings</span>
ids = torch.<span class="fn">tensor</span>([<span class="num">3</span>, <span class="num">7</span>, <span class="num">1</span>])         <span class="cm"># which tokens to fetch</span>
selected = emb[ids]                   <span class="cm"># shape (3, 4)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy's indexing, slicing, fancy indexing and boolean masks behave identically to torch -- both libraries took inspiration from the same array-programming tradition.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.arange(20).reshape(4, 5)
print('matrix:\n', x)

print('row 0       :', x[0])
print('col 2       :', x[:, 2])
print('submatrix   :\n', x[1:3, 2:5])
print('last col    :', x[:, -1])

# Fancy indexing -- pick specific rows
idx = np.array([0, 2, 3])
print('rows [0,2,3]:\n', x[idx])

# Boolean mask
mask = x % 3 == 0
print('multiples of 3:', x[mask])

# Assignment via mask
x2 = x.copy()
x2[x2 < 5] = -1
print('after mask assign:\n', x2)</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Standard <code>x[row, col]</code> indexing returns scalars or sub-tensors with reduced rank; slicing with <code>:</code> keeps the dimension. 2) Negative indices count from the end (just like Python lists); strided slicing <code>::2</code> samples every second element. 3) Boolean masks are tensors of dtype <code>bool</code> with the same shape as the source; indexing flattens out only the True positions. This is exactly how attention masks select valid tokens during pooling. 4) Advanced indexing with a tensor of integers selects those specific rows -- same as <code>np.take</code>. 5) The padding-mask example mirrors what every NLP pipeline does: <code>(seq != pad_id)</code> produces a boolean tensor that downstream layers use to ignore padding when computing attention or losses. 6) <code>emb[ids]</code> is the hand-rolled equivalent of <code>nn.Embedding(...)(ids)</code> -- the embedding layer is just a learnable lookup table where indexing fetches rows.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x[i]</div><div class="card-body">Row i; reduces rank by 1.</div></div>
<div class="calc-card"><div class="card-title">x[:, i]</div><div class="card-body">Column i; works for any 2D+ tensor.</div></div>
<div class="calc-card"><div class="card-title">x[a:b]</div><div class="card-body">Slice rows a (inclusive) to b (exclusive).</div></div>
<div class="calc-card"><div class="card-title">x[bool_mask]</div><div class="card-body">All elements where mask is True; result is 1-D.</div></div>
<div class="calc-card"><div class="card-title">x[idx_tensor]</div><div class="card-body">Advanced indexing; pick specific rows by integer tensor.</div></div>
<div class="calc-card"><div class="card-title">x[..., -1]</div><div class="card-body">Ellipsis fills remaining dims; here it grabs the last element along the last axis.</div></div>
</div>

<div class="l-note"><strong>Why this matters for NLP:</strong> Padding masks, attention masks, and label masks are all boolean tensors. Cross-entropy with <code>ignore_index=-100</code>, attention with mask <code>-inf</code>, packed sequences -- all are flavors of indexing and masking on tensors. If you understand basic indexing, you understand 80% of transformer plumbing.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. NumPy Bridge and Common Operations</h2>

<p class="l-text">PyTorch and NumPy interoperate seamlessly, which matters because data loading, plotting, and a lot of preprocessing happen in NumPy. Crossing the bridge correctly -- and knowing when copies happen -- avoids subtle bugs.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># torch -&gt; numpy: zero-copy when on CPU</span>
t = torch.<span class="fn">randn</span>(<span class="num">3</span>, <span class="num">4</span>)
arr = t.<span class="fn">numpy</span>()
arr[<span class="num">0</span>, <span class="num">0</span>] = <span class="num">999</span>
<span class="fn">print</span>(t[<span class="num">0</span>, <span class="num">0</span>])         <span class="cm"># also 999 -- they share memory</span>

<span class="cm"># numpy -&gt; torch: from_numpy is zero-copy, torch.tensor copies</span>
np_arr = np.<span class="fn">array</span>([[<span class="num">1.0</span>, <span class="num">2.0</span>], [<span class="num">3.0</span>, <span class="num">4.0</span>]])
shared = torch.<span class="fn">from_numpy</span>(np_arr)        <span class="cm"># shares memory</span>
copied = torch.<span class="fn">tensor</span>(np_arr)            <span class="cm"># makes a copy</span>

<span class="cm"># Element-wise math (vectorized)</span>
x = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">3.0</span>])
<span class="fn">print</span>(x + <span class="num">1</span>)              <span class="cm"># tensor([2., 3., 4.])</span>
<span class="fn">print</span>(x * <span class="num">2</span>)              <span class="cm"># tensor([2., 4., 6.])</span>
<span class="fn">print</span>(x ** <span class="num">2</span>)             <span class="cm"># tensor([1., 4., 9.])</span>
<span class="fn">print</span>(torch.<span class="fn">exp</span>(x))       <span class="cm"># tensor([2.7183, 7.3891, 20.0855])</span>
<span class="fn">print</span>(torch.<span class="fn">log</span>(x))       <span class="cm"># natural log</span>

<span class="cm"># Reductions</span>
m = torch.<span class="fn">randn</span>(<span class="num">3</span>, <span class="num">4</span>)
<span class="fn">print</span>(m.<span class="fn">sum</span>())            <span class="cm"># scalar -- sum over all elements</span>
<span class="fn">print</span>(m.<span class="fn">sum</span>(dim=<span class="num">0</span>))       <span class="cm"># shape (4,) -- sum along rows</span>
<span class="fn">print</span>(m.<span class="fn">sum</span>(dim=<span class="num">1</span>))       <span class="cm"># shape (3,) -- sum along columns</span>
<span class="fn">print</span>(m.<span class="fn">mean</span>(dim=<span class="num">1</span>, keepdim=<span class="kw">True</span>))   <span class="cm"># shape (3, 1) -- keep the dim</span>
<span class="fn">print</span>(m.<span class="fn">argmax</span>(dim=<span class="num">1</span>))    <span class="cm"># index of max along each row</span>

<span class="cm"># Matrix multiply -- the most important op</span>
A = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">3</span>)
B = torch.<span class="fn">randn</span>(<span class="num">3</span>, <span class="num">5</span>)
C = A @ B                 <span class="cm"># shape (2, 5) -- prefer @ over torch.mm</span>
<span class="fn">print</span>(C.shape)

<span class="cm"># Batched matmul</span>
Bm = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">2</span>, <span class="num">3</span>)
Cm = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">3</span>, <span class="num">5</span>)
out = torch.<span class="fn">bmm</span>(Bm, Cm)   <span class="cm"># shape (8, 2, 5)</span>

<span class="cm"># In-place ops end with underscore</span>
x = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">3.0</span>])
x.<span class="fn">add_</span>(<span class="num">10</span>)                <span class="cm"># mutates x in place</span>
<span class="fn">print</span>(x)                  <span class="cm"># tensor([11., 12., 13.])</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Most torch math operations (sum, mean, argmax, matmul, broadcasting, einsum) have an exact NumPy equivalent with the same name and signature.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.random.randn(4, 6)
W = np.random.randn(6, 3)

# Matmul (@ is the same operator)
out = x @ W
print('x @ W shape:', out.shape)

# Reductions
print('mean (all)         :', x.mean().round(3))
print('mean axis=0 (per col):', x.mean(axis=0).round(3))
print('argmax axis=1 (per row):', x.argmax(axis=1))

# Broadcasting
bias = np.random.randn(3)
y = out + bias              # (4, 3) + (3,)
print('broadcast add:', y.shape)

# Einsum (also identical to torch.einsum)
attn = np.einsum('bi,bj->bij', x[:, :3], x[:, :3])
print('einsum result shape:', attn.shape)</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>.numpy()</code> on a CPU tensor gives a NumPy array sharing the same memory -- modifying one modifies the other. 2) <code>torch.from_numpy</code> is the reverse direction with the same sharing behavior; <code>torch.tensor(arr)</code> always copies, which is safer when you do not want surprises. 3) Element-wise math just works: scalar broadcasting, exp/log/sin/cos, all the usual NumPy functions exist on tensors with the same names. 4) Reductions like <code>sum</code>, <code>mean</code>, <code>argmax</code> take a <code>dim=</code> argument; without it they reduce over all elements. <code>keepdim=True</code> preserves a size-1 dimension which is essential for broadcasting back the result. 5) <code>@</code> is the matrix multiplication operator, identical to <code>torch.matmul</code>; this single op accounts for 90%+ of compute in transformers. 6) <code>torch.bmm</code> is batched matmul: <code>(B, n, m) @ (B, m, p) -&gt; (B, n, p)</code>, used inside attention. 7) Underscore-suffix methods like <code>add_</code>, <code>mul_</code>, <code>zero_</code> mutate in place -- saves memory but breaks autograd if used on tensors that require grad, so use them only for grad-free buffers.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">+ - * / **</div><div class="card-body">Element-wise arithmetic with broadcasting. Same rules as NumPy.</div></div>
<div class="calc-card"><div class="card-title">@</div><div class="card-body">Matrix multiplication. Use this everywhere instead of <code>torch.mm</code> or <code>torch.matmul</code>.</div></div>
<div class="calc-card"><div class="card-title">.sum(dim=...)</div><div class="card-body">Reduce along a specific axis. <code>keepdim=True</code> if you need to broadcast back.</div></div>
<div class="calc-card"><div class="card-title">.mean / .std / .max</div><div class="card-body">Standard reductions. <code>.max(dim=)</code> returns (values, indices) named tuple.</div></div>
<div class="calc-card"><div class="card-title">.argmax(dim=...)</div><div class="card-body">Indices of max -- the standard "predicted class" computation in classification.</div></div>
<div class="calc-card"><div class="card-title">_ suffix</div><div class="card-body">In-place mutation. Avoid on tensors with <code>requires_grad=True</code>.</div></div>
</div>

<div id="plot-pl1-numpy-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Speed comparison of a 2048x2048 matrix multiply on CPU NumPy, CPU PyTorch, and GPU PyTorch (typical 4090). NumPy and CPU PyTorch are similar (both wrap optimized BLAS); GPU PyTorch is roughly 50-100x faster. This single chart explains why deep learning moved off CPU in 2012 with AlexNet -- the gap is too big to ignore once you have any nontrivial network.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. NumPy vs PyTorch and Wrap-up</h2>

<p class="l-text">Why does PyTorch exist when NumPy is already a beautiful array library? Because two missing pieces -- GPU and autograd -- are non-negotiable for deep learning. Here is a side-by-side cheat sheet.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">NumPy</div><div class="compare-item">CPU only</div><div class="compare-item">No autograd</div><div class="compare-item">Default dtype: float64</div><div class="compare-item">Multiplication: <code>@</code> or <code>np.dot</code></div><div class="compare-item">Reshape: <code>.reshape</code></div><div class="compare-item">Transpose: <code>.T</code> or <code>np.transpose</code></div><div class="compare-item">Random: <code>np.random.randn</code></div><div class="compare-item">No batched ops by default</div></div>
<div class="compare-col"><div class="compare-title">PyTorch</div><div class="compare-item">CPU + GPU + MPS</div><div class="compare-item">Autograd built-in</div><div class="compare-item">Default dtype: float32</div><div class="compare-item">Multiplication: <code>@</code> or <code>torch.matmul</code></div><div class="compare-item">Reshape: <code>.view</code> or <code>.reshape</code></div><div class="compare-item">Transpose: <code>.T</code>, <code>.transpose</code>, <code>.permute</code></div><div class="compare-item">Random: <code>torch.randn</code></div><div class="compare-item"><code>bmm</code>, <code>einsum</code> for batched ops</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># Mini end-to-end: a hand-rolled linear regression forward pass</span>
torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)

<span class="cm"># Synthetic data: y = 3x + 2 + noise</span>
N = <span class="num">100</span>
X = torch.<span class="fn">randn</span>(N, <span class="num">1</span>)
y = <span class="num">3</span> * X + <span class="num">2</span> + <span class="num">0.1</span> * torch.<span class="fn">randn</span>(N, <span class="num">1</span>)

<span class="cm"># Parameters (pretend these are weights)</span>
w = torch.<span class="fn">randn</span>(<span class="num">1</span>, <span class="num">1</span>)
b = torch.<span class="fn">zeros</span>(<span class="num">1</span>)

<span class="cm"># Forward pass: y_hat = X @ w + b</span>
y_hat = X @ w + b               <span class="cm"># shape (N, 1)</span>

<span class="cm"># Loss: mean squared error</span>
loss = ((y_hat - y) ** <span class="num">2</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Initial loss: {loss.item():.4f}"</span>)

<span class="cm"># Manual gradient (we will replace this with autograd in L2)</span>
grad_w = (<span class="num">2</span> / N) * (X.T @ (y_hat - y))     <span class="cm"># shape (1, 1)</span>
grad_b = (<span class="num">2</span> / N) * (y_hat - y).<span class="fn">sum</span>()       <span class="cm"># scalar</span>

<span class="cm"># Gradient descent step</span>
lr = <span class="num">0.1</span>
w = w - lr * grad_w
b = b - lr * grad_b

<span class="cm"># Re-evaluate</span>
y_hat = X @ w + b
loss2 = ((y_hat - y) ** <span class="num">2</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"After one step: {loss2.item():.4f}"</span>)

<span class="cm"># Move it all to GPU if available</span>
device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>
X, y, w, b = [t.<span class="fn">to</span>(device) <span class="kw">for</span> t <span class="kw">in</span> (X, y, w, b)]
y_hat = X @ w + b
<span class="fn">print</span>(f<span class="str">"On {device}: shape {y_hat.shape}, dtype {y_hat.dtype}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A full mini-pipeline -- normalize features, classify with sklearn -- shows the workflow that PyTorch generalizes once you add autograd and GPUs.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Use the iris dataset from preamble
X = df_iris.iloc[:, :4].values
y = df_iris.iloc[:, 4].astype('category').cat.codes.values

scaler = StandardScaler()
Xs = scaler.fit_transform(X)
print('Xs mean (~0):', Xs.mean(axis=0).round(3))
print('Xs std  (~1):', Xs.std (axis=0).round(3))

clf = LogisticRegression(max_iter=500).fit(Xs, y)
acc = accuracy_score(y, clf.predict(Xs))
print(f'sklearn LR accuracy on iris: {acc:.3f}')
print('classes:', clf.classes_, 'n_features:', clf.n_features_in_)</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generates 100 synthetic samples from <code>y = 3x + 2 + noise</code>; <code>X</code> has shape <code>(100, 1)</code> so we can use matrix multiply. 2) Initializes a single weight and bias as random tensors -- no gradient tracking yet. 3) Forward pass: <code>y_hat = X @ w + b</code> uses broadcasting (b has shape (1,) but is added to (100,1) by stretching). 4) Computes mean squared error; <code>.item()</code> extracts the Python float from a 0-D tensor. 5) Hand-derives the gradients using calculus -- this is exactly what autograd will do for us automatically in the next lesson, but it is good to see it once by hand. 6) Performs one gradient-descent update and recomputes the loss; you should see it drop. 7) Demonstrates the device-move pattern: list comprehension across all tensors. The final shape and dtype prints confirm everything landed correctly on the target device.</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Tensors are NumPy arrays with two extras: GPU support and autograd. The API is intentionally NumPy-like.<br><strong>2.</strong> Always know your tensor's <code>shape</code>, <code>dtype</code>, and <code>device</code> -- mismatches are the #1 source of bugs.<br><strong>3.</strong> Reshape with <code>view</code> when contiguous, <code>reshape</code> when unsure; use <code>unsqueeze/squeeze</code> for adding/removing batch dims; use <code>permute</code> for arbitrary axis swaps.<br><strong>4.</strong> Move tensors to GPU once and keep them there; <code>.to(device)</code> is the universal verb.<br><strong>5.</strong> Boolean masks and integer indexing are the basis of attention masks and embedding lookups -- learn them deeply.<br><strong>6.</strong> Use <code>@</code> for matmul, <code>torch.bmm</code> for batched matmul, and reductions with <code>dim=</code> + <code>keepdim=</code> when you need to broadcast back.<br><strong>7.</strong> NumPy interop is free on CPU; cross the bridge before plotting and after data loading, never inside training loops.<br><strong>8.</strong> Next lesson: autograd makes those manual gradient derivations disappear -- you describe the forward pass and PyTorch differentiates it for you.</div></div>
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

  function shapesPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var stages = lang === 'tr'
      ? ['Token IDs', 'Embedding', 'Cok-bas Q/K/V', 'Attention', 'Pooling', 'Logits']
      : ['Token IDs', 'Embedding', 'Multi-head Q/K/V', 'Attention', 'Pooling', 'Logits'];
    var shapes = ['(B, T)', '(B, T, D)', '(B, H, T, d)', '(B, T, D)', '(B, D)', '(B, C)'];
    var sizes = [16, 12288, 12288, 12288, 768, 2];   // illustrative element counts (B=1, T=16, D=768, H=12, d=64, C=2)
    var trace = {x: stages, y: sizes, type:'bar', marker:{color:T.accent, line:{color:'rgba(255,255,255,0.2)',width:1}}, text: shapes, textposition:'outside'};
    var layout = Object.assign({}, common, {
      title:{text: lang === 'tr' ? 'Transformer Forward Pass: Sekil Donusumleri' : 'Transformer Forward Pass: Shape Transformations', font:{color:T.text,size:14}},
      yaxis:{title: lang === 'tr' ? 'Eleman sayisi (log)' : 'Element count (log)', type:'log', gridcolor:T.grid, zerolinecolor:T.zero},
      xaxis:{gridcolor:T.grid},
      margin:{t:60,r:30,b:80,l:60}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  function speedPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var labels = lang === 'tr'
      ? ['NumPy CPU', 'PyTorch CPU', 'PyTorch GPU']
      : ['NumPy CPU', 'PyTorch CPU', 'PyTorch GPU'];
    var times = [180, 165, 3.2];      // ms for 2048x2048 matmul (illustrative)
    var trace = {x: labels, y: times, type:'bar', marker:{color:[T.accent, T.accent, '#4ecdc4'], line:{color:'rgba(255,255,255,0.2)',width:1}}, text: times.map(function(t){return t + ' ms';}), textposition:'outside'};
    var layout = Object.assign({}, common, {
      title:{text: lang === 'tr' ? '2048x2048 Matris Carpimi: CPU vs GPU' : '2048x2048 Matmul: CPU vs GPU', font:{color:T.text,size:14}},
      yaxis:{title:'ms', gridcolor:T.grid, zerolinecolor:T.zero, type:'log'},
      xaxis:{gridcolor:T.grid}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  shapesPlot('plot-pl1-shapes-en', 'en');
  speedPlot('plot-pl1-numpy-en', 'en');
  shapesPlot('plot-pl1-shapes-tr', 'tr');
  speedPlot('plot-pl1-numpy-tr', 'tr');
}, 250);</script>`,

tr: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/17" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Türev Tanımı</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L17)</span></li>
<li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matris &amp; İşlemler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L72)</span></li>
<li><a href="/tutorials/matematik/91" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Vektörler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L91)</span></li>
<li><a href="/tutorials/matematik/40" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Fonksiyon Tanımı</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L40)</span></li>
</ul>
</div>
<p class="l-text"><strong>PyTorch, derin öğrenmenin bugün yazıldığı dildir.</strong> 2024'te transformer'lar, difüzyon modelleri veya LLM ince ayarı hakkında bir makale okuduğunuzda referans kod neredeyse her zaman PyTorch'tadır. HuggingFace PyTorch üzerinde çalışır. Meta'nın LLaMA'sı, OpenAI'nin Whisper'ı, Stability'nin Stable Diffusion'ı -- hepsi PyTorch. Tek bir sinir ağına dokunmadan önce, üzerine her şeyin inşa edildiği atomik yapı taşını anlamamız gerekiyor: <code>Tensor</code>.</p>

<p class="l-text">Tensor, iki süper güce sahip NumPy dizisinin genelleştirilmiş halidir. Birincisi, GPU'da yaşayabilir ve hesaplamaları CPU dizisinden 50-100 kat daha hızlı çalıştırabilir. İkincisi, kendi geçmişini takip eder, böylece PyTorch gradyanları otomatik olarak hesaplar -- bir daha asla manuel kalkülüs yok. Bu ders size tensor oluşturmayı, yeniden şekillendirmeyi, cihazlar arasında taşımayı ve NumPy ile ileri-geri dönüştürmeyi öğretir. Bunda ustalaşırsanız PyTorch'un geri kalanı kolaylaşır.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><code>torch.tensor</code>, <code>zeros</code>, <code>randn</code>, <code>arange</code> ve <code>_like</code> fabrikalarıyla tensor oluşturmayı</li>
<li><code>view</code>, <code>reshape</code>, <code>permute</code>, <code>squeeze</code> ve <code>unsqueeze</code> ile tensor şeklini değiştirmeyi</li>
<li>Tensor'ları <code>.to(device)</code> ile CPU/GPU arasında taşımayı ve doğru <code>dtype</code> seçmeyi</li>
<li><code>from_numpy</code> / <code>.numpy()</code> ile PyTorch tensor'ları ile NumPy arasında kayıpsız dönüşüm yapmayı</li>
<li>NLP'deki <code>(batch, seq, hidden)</code> şekillerini yönetmek için broadcasting ve indeksleme kurallarını uygulamayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden PyTorch? Neden Tensor?</h2>

<p class="l-text">100 milyon cümlede bir transformer eğittiğinizi düşünün. Her ileri geçiş <code>(batch, seq_len, hidden_dim)</code> şekilli matrisleri çarpar, her geri geçiş milyonlarca parametreye göre türev alır. Bunu Python döngüsüyle NumPy'da yazsaydınız eğitim aylar sürerdi. PyTorch bunu GPU'da adım başına saniyelere indirir, çünkü tensor'lar paralel donanım için sıfırdan tasarlanmıştır.</p>

<div class="calc-highlight"><strong>PyTorch'un üç temel direği:</strong> 1) <em>Tensor'lar</em> -- CPU veya GPU üzerinde çalışan çok boyutlu diziler. 2) <em>Autograd</em> -- otomatik gradyan hesaplama, manuel türev yok. 3) <em>nn.Module</em> -- nesne yönelimli model yapı taşları. PyTorch'un geri kalan %95'i bu üçünün üzerine inşa edilmiş kolaylıklardır.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çok boyutlu</div><div class="card-body">Skaler 0 boyutlu, vektör 1 boyutlu, matris 2 boyutlu tensor'dur. NLP yaygın olarak 3 boyutlu <code>(batch, seq, hidden)</code> ve 4 boyutlu <code>(batch, head, seq, head_dim)</code> kullanır.</div></div>
<div class="calc-card"><div class="card-title">Tipli</div><div class="card-body">Her tensor'un sabit bir <code>dtype</code>'ı vardır: float32, float16, bfloat16, int64, bool. Tipleri karıştırmak hata fırlatır -- hata değil özellik, çünkü hataları erkenden yakalar.</div></div>
<div class="calc-card"><div class="card-title">Cihaz bilinçli</div><div class="card-body">Bir tensor tam olarak bir cihazda yaşar: <code>cpu</code> veya <code>cuda:0</code>. Tensor'lar arası işlemler aynı cihazda olmalarını gerektirir.</div></div>
<div class="calc-card"><div class="card-title">Türevlenebilir</div><div class="card-body"><code>requires_grad=True</code> ise PyTorch otomatik backprop için her işlemi bir hesaplama grafiğine kaydeder -- tüm eğitimi besleyen sihir budur.</div></div>
<div class="calc-card"><div class="card-title">Vektörize</div><div class="card-body">Tensor işlemleri C++ ve CUDA ile yazılmıştır. <code>X @ W</code> gibi tek bir satır binlerce GPU çekirdeğinde paralel çalışır.</div></div>
<div class="calc-card"><div class="card-title">Pythonik</div><div class="card-body">C++ motoruna rağmen API NumPy gibi hissettirir: indeksleme, dilimleme, broadcasting, yerinde işlemler. Dizileri bilen herkes için öğrenme eğrisi yumuşaktır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP şekil sezgisi</div><div class="example-body">"I loved this movie" cümlesini BERT ile tokenize ettiğinizde <code>(1, 6)</code> şekilli bir tensor elde edersiniz -- bir batch, <code>[CLS]</code> ve <code>[SEP]</code> dahil altı token. Embedding katmanından sonra <code>(1, 6, 768)</code> olur -- her biri 768 boyutlu vektörle temsil edilen altı token. Attention katmanından sonra <code>(1, 6, 768)</code> kalır. Pooling'den sonra <code>(1, 768)</code> olur. Sınıflandırıcıdan sonra <code>(1, 2)</code> -- pozitif/negatif için iki logit. Okuduğunuz her transformer makalesi sadece tensor'lar üzerinde şekil dönüşümleridir.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜNMEYE DEĞER</div><div class="think-body">NumPy'da kalmak neden olmaz? İki sebep sizi anında durdurur. Birincisi, NumPy'da GPU desteği yok -- modern bir modeli makul bir sürede CPU'da eğitemezsiniz. İkincisi, NumPy'da autograd yok -- denediğiniz her mimari için her geri geçişi elle türetip kodlamanız gerekirdi, bu yüzlerce işlemli transformer'lar için pratik değil. PyTorch ikisini de NumPy benzeri bir API ile çözer, böylece geçiş maliyeti küçük ama yetenek kazanımı muazzamdır.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Tensor Oluşturma</h2>

<p class="l-text">Bir tensor oluşturmanın kabaca beş yolu vardır: mevcut Python verisinden, NumPy'dan, rastgele veya sabit değerlerle bir şekilden, bir aralıktan veya başka bir tensor'dan. Her birinin yeri vardır. Bunları refleks olarak bilmek size binlerce kez yazma zamanı kazandırır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) Python listesinden -- şekil iç içe yapıdan çıkarılır</span>
a = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">3.0</span>])               <span class="cm"># şekil (3,)</span>
b = torch.<span class="fn">tensor</span>([[<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>], [<span class="num">4</span>, <span class="num">5</span>, <span class="num">6</span>]])        <span class="cm"># şekil (2, 3)</span>
<span class="fn">print</span>(a.shape, a.dtype)   <span class="cm"># torch.Size([3]) torch.float32</span>
<span class="fn">print</span>(b.shape, b.dtype)   <span class="cm"># torch.Size([2, 3]) torch.int64</span>

<span class="cm"># 2) NumPy dizisinden -- from_numpy varsayılan olarak belleği paylaşır</span>
arr = np.<span class="fn">array</span>([[<span class="num">1.0</span>, <span class="num">2.0</span>], [<span class="num">3.0</span>, <span class="num">4.0</span>]])
t1 = torch.<span class="fn">from_numpy</span>(arr)        <span class="cm"># sıfır kopya, tamponu paylaşır</span>
t2 = torch.<span class="fn">tensor</span>(arr)            <span class="cm"># kopya yapar, daha güvenli</span>

<span class="cm"># 3) Şekil tabanlı fabrikalar (gerçek kodda en yaygın)</span>
zeros  = torch.<span class="fn">zeros</span>(<span class="num">2</span>, <span class="num">3</span>)                 <span class="cm"># 0.0 ile dolu (2, 3)</span>
ones   = torch.<span class="fn">ones</span>(<span class="num">4</span>)                     <span class="cm"># 1.0 ile dolu (4,)</span>
empty  = torch.<span class="fn">empty</span>(<span class="num">2</span>, <span class="num">2</span>)                 <span class="cm"># başlatılmamış bellek, en hızlı</span>
full   = torch.<span class="fn">full</span>((<span class="num">2</span>, <span class="num">3</span>), fill_value=<span class="num">7.0</span>)
eye    = torch.<span class="fn">eye</span>(<span class="num">3</span>)                      <span class="cm"># 3x3 birim matris</span>

<span class="cm"># 4) Rastgele tensor'lar</span>
torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)
r_uniform = torch.<span class="fn">rand</span>(<span class="num">2</span>, <span class="num">3</span>)               <span class="cm"># [0, 1) düzgün dağılım</span>
r_normal  = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">3</span>)              <span class="cm"># standart normal N(0, 1)</span>
r_int     = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">10</span>, (<span class="num">2</span>, <span class="num">3</span>))   <span class="cm"># [0, 10) tamsayılar</span>

<span class="cm"># 5) Aralık ve linspace</span>
rng    = torch.<span class="fn">arange</span>(<span class="num">0</span>, <span class="num">10</span>, step=<span class="num">2</span>)       <span class="cm"># [0, 2, 4, 6, 8]</span>
lin    = torch.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, steps=<span class="num">5</span>)     <span class="cm"># [0.00, 0.25, 0.50, 0.75, 1.00]</span>

<span class="cm"># 6) Başka bir tensor gibi (şekil, dtype, cihaz korunur)</span>
zeros_like = torch.<span class="fn">zeros_like</span>(b)
rand_like  = torch.<span class="fn">randn_like</span>(a)

<span class="fn">print</span>(zeros)
<span class="fn">print</span>(r_normal)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy dizileri torch tensorleri ile aynı fabrika kalıbını kullanır. Şekil, dtype ve rastgele örnekleme API'leri neredeyse aynı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# 1) From a Python list -- shape inferred
a = np.array([1.0, 2.0, 3.0])
b = np.array([[1, 2, 3], [4, 5, 6]])
print('a:', a.shape, a.dtype)
print('b:', b.shape, b.dtype)

# 2) Shape-based factories
zeros = np.zeros((2, 3))
ones  = np.ones((4,))
full  = np.full((2, 3), 7.0)
eye   = np.eye(3)

# 3) Random tensors with seeded RNG
rng = np.random.default_rng(0)
r_uniform = rng.random((2, 3))
r_normal  = rng.standard_normal((2, 3))

# 4) Range and linspace
print('arange:', np.arange(0, 10, 2))
print('linspace:', np.linspace(0, 1, 5))
print('eye:', eye)
print('r_normal:\n', r_normal.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>torch.tensor</code> bir Python listesini sarmalar ve şekli ile dtype'ı çıkarır -- ondalık sayılar varsayılan olarak <code>float32</code>, tamsayılar <code>int64</code> olur. 2) <code>torch.from_numpy</code> NumPy dizisi ile belleği paylaşır (kopya yok, çok hızlı), oysa <code>torch.tensor(np_array)</code> kopyalar; her iki tarafı değiştirmek istiyorsanız bu daha güvenlidir. 3) <code>zeros</code>, <code>ones</code>, <code>full</code>, <code>eye</code> gibi şekil tabanlı fabrikalar ağırlıkları, maskeleri ve birim matrisleri başlatmak için ekmek-su gibidir. 4) <code>torch.rand</code> [0,1) düzgün, <code>randn</code> standart normal N(0,1) örnekler -- ağırlık başlatma için neredeyse her zaman normal istersiniz. 5) <code>arange</code> Python'un <code>range</code>'inin tamsayı stilindeki karşılığıdır; <code>linspace</code> her iki uç dahil eşit aralıklı N kayan nokta verir. 6) <code>_like</code> ailesi referansla aynı şekil, dtype ve cihaza sahip yeni bir tensor oluşturur -- modelinizdeki mevcut bir tensor'la eşleşen bir tampon gerektiğinde kullanışlıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">torch.tensor(data)</div><div class="card-body">Genel kurucu. Listeler, tuple'lar, NumPy dizileriyle çalışır. Her zaman kopyalar. Küçük veriler için zamanın %90'ında bunu kullanın.</div></div>
<div class="calc-card"><div class="card-title">torch.zeros / ones</div><div class="card-body">Şekil tabanlı, hızlı, deterministik. Varsayılan dtype <code>float32</code>. Değiştirmek için <code>dtype=</code> geçin.</div></div>
<div class="calc-card"><div class="card-title">torch.randn</div><div class="card-body">Standart normal örnekler. Sığ ağlarda ağırlık başlatma için doğru varsayılan.</div></div>
<div class="calc-card"><div class="card-title">torch.arange</div><div class="card-body">Tamsayı stilinde aralık. Pozisyon indeksleri, token ID'leri, maske şablonları kurmak için yaygın.</div></div>
<div class="calc-card"><div class="card-title">torch.linspace</div><div class="card-body">Kayan nokta aralığı, her iki uç dahil. Izgaralar, öğrenme oranı çizelgeleri, çizim için kullanışlı.</div></div>
<div class="calc-card"><div class="card-title">torch.empty</div><div class="card-body">Başlatılmamış tampon -- en hızlı tahsis. Yalnızca her hücreyi kendiniz üzerine yazacaksanız kullanın.</div></div>
</div>

<div class="l-warn"><strong>Tuzak:</strong> Büyük T ile <code>torch.Tensor(2, 3)</code> eski sınıf kurucusudur ve o şekilde <em>başlatılmamış</em> bir tensor oluşturur -- 2 ve 3 değerleriyle bir tensor değil. Değer tabanlı oluşturma için her zaman küçük harf <code>torch.tensor</code> kullanın. Bu tek karışıklık her PyTorch acemisini en az bir kez yakmıştır.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Tensor Nitelikleri: shape, dtype, device</h2>

<p class="l-text">Her tensor'un onunla ne yapabileceğinizi belirleyen üç meta veri parçası vardır: <code>shape</code> (boyutları), <code>dtype</code> (eleman tipi) ve <code>device</code> (bellekte nerede yaşadığı). İşlemler bunların eşleşmesini gerektirir -- uyumsuzluk PyTorch kodundaki en yaygın hatadır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

x = torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">8</span>, <span class="num">16</span>)        <span class="cm"># düşünün: batch=4, seq=8, hidden=16</span>
<span class="fn">print</span>(x.shape)        <span class="cm"># torch.Size([4, 8, 16])</span>
<span class="fn">print</span>(x.<span class="fn">size</span>())       <span class="cm"># .shape ile aynı -- ikisi de çalışır</span>
<span class="fn">print</span>(x.<span class="fn">size</span>(<span class="num">0</span>))      <span class="cm"># 4   (boyut 0'ın boyutu)</span>
<span class="fn">print</span>(x.<span class="fn">dim</span>())        <span class="cm"># 3   (boyut sayısı = rank)</span>
<span class="fn">print</span>(x.<span class="fn">numel</span>())      <span class="cm"># 512 (toplam eleman sayısı = 4*8*16)</span>

<span class="cm"># dtype -- eleman tipi</span>
<span class="fn">print</span>(x.dtype)        <span class="cm"># torch.float32</span>
<span class="fn">print</span>(x.<span class="fn">element_size</span>())  <span class="cm"># her float32 başına 4 bayt</span>

<span class="cm"># .to ile veya özel metotlarla dtype dönüştür</span>
x_half  = x.<span class="fn">to</span>(torch.float16)        <span class="cm"># yarı hassasiyet (her eleman 2 bayt)</span>
x_long  = x.<span class="fn">to</span>(torch.int64)          <span class="cm"># tamsayılar (kırpılır)</span>
x_bool  = (x &gt; <span class="num">0</span>)                    <span class="cm"># boolean maske</span>
x_f64   = x.<span class="fn">double</span>()                 <span class="cm"># .to(torch.float64) için takma ad</span>
x_f32   = x.<span class="fn">float</span>()                  <span class="cm"># .to(torch.float32) için takma ad</span>

<span class="cm"># device -- tensor'un yaşadığı yer</span>
<span class="fn">print</span>(x.device)       <span class="cm"># cpu</span>

<span class="cm"># Farklı dtype'tan iki tensor: PyTorch daha büyüğünü seçer</span>
a = torch.<span class="fn">tensor</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>])             <span class="cm"># int64</span>
b = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">3.0</span>])       <span class="cm"># float32</span>
c = a + b                               <span class="cm"># a'yı float32'ye yükseltir</span>
<span class="fn">print</span>(c.dtype)                          <span class="cm"># torch.float32</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy dizileri torch tensorlerinin aynı (shape, dtype, ndim) üçlüsünü gösterir. Zihinsel model birebir taşınır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.random.randn(4, 8, 16)   # batch=4, seq=8, hidden=16
print('shape:', x.shape)
print('size  (numel):', x.size)
print('ndim  (rank):', x.ndim)
print('dtype:', x.dtype)
print('dim 0:', x.shape[0])

# Cast dtype (analog of .to(dtype))
x_f16 = x.astype(np.float16)
x_i32 = x.astype(np.int32)
print('float16 dtype:', x_f16.dtype, 'bytes:', x_f16.nbytes)
print('int32 dtype  :', x_i32.dtype, 'bytes:', x_i32.nbytes)

# device: NumPy is CPU-only -> mirrors what torch does without GPU
print('device equivalent: cpu (numpy is host-memory only)')</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>x.shape</code> ve <code>x.size()</code> eşdeğerdir ve bir <code>torch.Size</code> döner -- Python tuple gibi davranır ama yardımcı metotları vardır. 2) <code>x.size(0)</code> sadece 0. boyutun boyutunu döndürür; model kodunda <code>batch_size = x.size(0)</code> yazdığınızda çok kullanışlıdır. 3) <code>x.dim()</code> rank'i söyler (tipik bir NLP tensor'u için burada 3); <code>x.numel()</code> toplam hücre sayısını verir, "parametre sayım model kartıyla eşleşiyor mu?" gibi sağlık kontrolleri için kullanışlıdır. 4) <code>dtype</code> her elemanın nasıl saklanacağını belirler -- float32 varsayılandır ve 4 bayt kullanır; float16 belleği yarıya indirir ama hassasiyet kaybeder; int64 indeksler için; bool maskeler için. 5) <code>.to(dtype)</code> istenen tipte yeni bir tensor döner; <code>.float()</code>, <code>.double()</code>, <code>.long()</code> kolaylık takma adlarıdır. 6) Dtype'ları karıştırdığınızda PyTorch otomatik olarak daha genel tipe yükseltir (float, int'i yener; float64, float32'yi yener), bu yüzden bir taraf float olduğunda sessiz tamsayı aritmetiği beklemeyin.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">float32 (varsayılan)</div><div class="compare-item">Eleman başına 4 bayt</div><div class="compare-item">~7 ondalık basamak hassasiyet</div><div class="compare-item">Eğitim için evrensel varsayılan</div><div class="compare-item">Aralık: yaklaşık 1e-38 ile 3e38</div><div class="compare-item">Tüm standart NN katmanlarında kullanılır</div></div>
<div class="compare-col"><div class="compare-title">float16 / bfloat16</div><div class="compare-item">Eleman başına 2 bayt</div><div class="compare-item">~3-4 ondalık basamak</div><div class="compare-item">Modern GPU'larda belleği yarıya, hızı ikiye katlar</div><div class="compare-item">Karışık hassasiyet eğitimde (AMP) kullanılır</div><div class="compare-item">bfloat16 daha geniş aralık, daha az hassasiyet</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: Her gün göreceğiniz NLP tensor şekilleri</div><div class="example-body"><strong>(B, T):</strong> giriş token ID'leri, B=batch, T=dizi uzunluğu. Dtype int64. <strong>(B, T, D):</strong> embedding'ler veya gizli durumlar, D=gizli boyut (örn. BERT-base için 768). Dtype float32. <strong>(B, H, T, T):</strong> dikkat skorları, H=head sayısı. Dtype float32. <strong>(V, D):</strong> embedding lookup tablosu, V=sözlük boyutu (BERT için ~30k). <strong>(B, T):</strong> dikkat maskesi, dtype bool veya float. Bu şekilleri tanımak transformer kodunu bir bakışta okumanızı sağlar.</div></div>

<div class="l-note"><strong>Profesyonel ipucu:</strong> Şekil uyuşmazlıklarını ayıklarken ileri geçişinizin her yerine <code>print("isim", x.shape)</code> serpiştirin. Her katmandan sonraki şekil, bir modelin neden çöktüğünü anlamak için en kullanışlı tek bilgi parçasıdır.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Yeniden Şekillendirme: view, reshape, squeeze, unsqueeze, permute</h2>

<p class="l-text">Yeniden şekillendirme oluşturmadan sonraki en yaygın işlemdir. Bir şekilde bir tensor alıyor ve başka bir şekle ihtiyaç duyuyorsunuz -- batch boyutu eklemek, düzleştirmek, eksenleri yer değiştirmek, head'leri ayırmak. PyTorch size benzer görünen ama farklı davranan birkaç araç verir. Hangisine uzanacağınızı bilmek akıcılığın bir parçasıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

x = torch.<span class="fn">arange</span>(<span class="num">24</span>)              <span class="cm"># şekil (24,)</span>
<span class="fn">print</span>(x.shape)                    <span class="cm"># torch.Size([24])</span>

<span class="cm"># view -- bitişik bellek gerektirir, GÖRÜNÜM döner (kopya yok)</span>
y = x.<span class="fn">view</span>(<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>)
<span class="fn">print</span>(y.shape)                    <span class="cm"># torch.Size([2, 3, 4])</span>
y[<span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>] = <span class="num">999</span>
<span class="fn">print</span>(x[<span class="num">0</span>])                       <span class="cm"># 999 -- paylaşılan bellek!</span>

<span class="cm"># reshape -- bitişik olmasa da çalışır, kopyalayabilir</span>
z = x.<span class="fn">reshape</span>(<span class="num">4</span>, <span class="num">6</span>)

<span class="cm"># -1 "bu boyutu çıkar" anlamına gelir</span>
flat = y.<span class="fn">view</span>(-<span class="num">1</span>)                 <span class="cm"># şekil (24,)</span>
mat  = y.<span class="fn">view</span>(<span class="num">2</span>, -<span class="num">1</span>)              <span class="cm"># şekil (2, 12)</span>

<span class="cm"># squeeze / unsqueeze -- boyutu 1 olan eksen ekle veya çıkar</span>
a = torch.<span class="fn">randn</span>(<span class="num">1</span>, <span class="num">3</span>, <span class="num">1</span>, <span class="num">5</span>)
<span class="fn">print</span>(a.<span class="fn">squeeze</span>().shape)          <span class="cm"># torch.Size([3, 5])  -- TÜM 1 boyutluları çıkarır</span>
<span class="fn">print</span>(a.<span class="fn">squeeze</span>(<span class="num">0</span>).shape)         <span class="cm"># torch.Size([3, 1, 5]) -- yalnızca 0. boyutu çıkarır</span>
b = torch.<span class="fn">randn</span>(<span class="num">3</span>, <span class="num">5</span>)
<span class="fn">print</span>(b.<span class="fn">unsqueeze</span>(<span class="num">0</span>).shape)       <span class="cm"># torch.Size([1, 3, 5]) -- batch boyutu ekle</span>
<span class="fn">print</span>(b.<span class="fn">unsqueeze</span>(-<span class="num">1</span>).shape)      <span class="cm"># torch.Size([3, 5, 1])</span>

<span class="cm"># permute -- keyfi eksen değişimi (2 boyuttan büyük için transpoz)</span>
img = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">224</span>, <span class="num">224</span>, <span class="num">3</span>)         <span class="cm"># NHWC düzeni (TF stili)</span>
img_pt = img.<span class="fn">permute</span>(<span class="num">0</span>, <span class="num">3</span>, <span class="num">1</span>, <span class="num">2</span>)          <span class="cm"># NCHW (PyTorch stili) -- (8, 3, 224, 224)</span>

<span class="cm"># transpose -- tam olarak iki boyutu değiştir</span>
x2 = torch.<span class="fn">randn</span>(<span class="num">3</span>, <span class="num">5</span>)
<span class="fn">print</span>(x2.<span class="fn">transpose</span>(<span class="num">0</span>, <span class="num">1</span>).shape)           <span class="cm"># (5, 3)</span>

<span class="cm"># flatten -- bir boyut aralığını sıkıştır</span>
emb = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">4</span>, <span class="num">8</span>)                <span class="cm"># batch=2, seq=4, dim=8</span>
flat_emb = emb.<span class="fn">flatten</span>(start_dim=<span class="num">1</span>)       <span class="cm"># (2, 32) -- batch boyutu korunur</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy reshape, squeeze, expand_dims ve transpose; torch view/reshape/squeeze/unsqueeze/permute'un doğrudan karşılığıdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.arange(12)                  # shape (12,)
print('flat:', x.shape)

# view / reshape -- NumPy: .reshape (always works)
y = x.reshape(3, 4)
print('reshape (3,4):', y.shape)

# unsqueeze (add a dim)  -> np.expand_dims
z = np.expand_dims(y, axis=0)      # (1, 3, 4)
print('expand_dims dim 0:', z.shape)

# squeeze (drop dims of size 1) -> np.squeeze
print('squeeze back:', np.squeeze(z).shape)

# permute / transpose
img = np.random.randn(3, 32, 32)   # (C, H, W)
img_hwc = np.transpose(img, (1, 2, 0))   # (H, W, C)
print('CHW -> HWC:', img.shape, '->', img_hwc.shape)

# flatten / contiguous
print('flatten:', y.flatten().shape)</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>view(2, 3, 4)</code> 24 elemanlı bir vektörü belleği kopyalamadan 2x3x4 tensor olarak yeniden yorumlar -- alttaki tampon aynı kalır. Görünümü değiştirmek orijinali değiştirir (satır <code>x[0]</code>'ı 999 yapar). 2) <code>reshape</code> daha güvenli kuzendir: aynı amaç ama tensor bitişik değilse kopyaya geri döner. Tensor'un bitişik olduğunu özellikle bilmiyorsanız varsayılan olarak <code>reshape</code> kullanın. 3) Bir boyut olarak <code>-1</code> PyTorch'a onu diğerlerinden hesaplamasını söyler, düzleştirme için yaygın deyim. 4) <code>squeeze</code> boyutu 1 olan tüm eksenleri çıkarır; <code>squeeze(d)</code> yalnızca o belirli boyut 1 ise çıkarır. <code>unsqueeze(d)</code> d konumuna boyutu 1 olan yeni bir eksen ekler -- batch boyutu eklemenin kanonik yolu. 5) <code>permute(0, 3, 1, 2)</code> eksenleri indekse göre yeniden düzenler -- burada TensorFlow görüntü düzenini (NHWC) PyTorch düzenine (NCHW) dönüştürür. 6) <code>transpose(a, b)</code>, tam olarak iki boyutu değiştirmekle sınırlı permute'tür; sadece iki boyut değiştirmeniz gerektiğinde daha açıktır. 7) <code>flatten(start_dim=1)</code> 1. boyuttan itibaren boyutları tek bir boyuta sıkıştırır, batch boyutunu korur -- bir Conv çıktısını Linear katmana beslemenin standart yolu.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">view(...)</div><div class="card-body">Kopyasız yeniden şekillendirme. Hızlı ama bitişik bellek gerektirir; aksi halde hata verir. Yeni oluşturmadan sonra kullanın.</div></div>
<div class="calc-card"><div class="card-title">reshape(...)</div><div class="card-body">view ile aynı amaç ama gerektiğinde kopyalar. Daha güvenli varsayılan. Emin değilseniz kullanın.</div></div>
<div class="calc-card"><div class="card-title">unsqueeze(d)</div><div class="card-body">d konumuna boyutu 1 olan eksen ekler. Batch boyutu eklemek <code>x.unsqueeze(0)</code>.</div></div>
<div class="calc-card"><div class="card-title">squeeze(d)</div><div class="card-body">Boyutu 1 olan ekseni çıkarır. Argümansız tümünü çıkarır.</div></div>
<div class="calc-card"><div class="card-title">permute(*dims)</div><div class="card-body">Eksenleri indekse göre yeniden düzenler. Görünüm döner. Genellikle sonra <code>.contiguous()</code> gerekir.</div></div>
<div class="calc-card"><div class="card-title">transpose(a, b)</div><div class="card-body">Tam olarak iki boyutu değiştirir. 2 argümanlı permute'a eşdeğer. Matris transpozu için en yaygın.</div></div>
</div>

<div id="plot-pl1-shapes-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Tipik bir transformer ileri geçişi şekil dönüşümleri dizisi olarak. Giriş token ID'leri <code>(B,T)</code> embedding'lere <code>(B,T,D)</code> dönüşür, dikkat onları paralel çok-başlık hesaplama için <code>(B,H,T,d)</code>'ye yeniden şekillendirir, sonra geri sıkıştırır ve son olarak pooling zaman boyutunu azaltarak örnek başına bir vektör <code>(B,D)</code> üretir. Transformer kodunu okumak büyük ölçüde bu şekilleri takip etmektir.</div>

<div class="l-warn"><strong>Tuzak:</strong> <code>permute</code>'tan sonra tensor bitişik değildir. Üzerinde <code>.view()</code> çağırmak hata verir. Ya <code>.reshape()</code> kullanın ya da önce <code>.contiguous()</code> çağırarak yeni bir bitişik kopya alın. Bu son derece yaygın bir transformer kod hatasıdır.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. CPU vs GPU: Cihazlar, .to(), .cuda()</h2>

<p class="l-text">Bir tensor tam olarak bir donanım parçasında yaşar: CPU'nun ana RAM'inde veya bir belirli GPU'nun video belleğinde (VRAM). İki tensor arasındaki işlemler ikisinin de aynı cihazda olmasını gerektirir ve cihazlar arası veri taşıma yavaştır -- bunu bir batch'in başında bir kez yapmak istersiniz, ileri geçişin ortasında değil.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># 1) Mevcut cihazı tespit et</span>
<span class="fn">print</span>(torch.cuda.<span class="fn">is_available</span>())          <span class="cm"># NVIDIA GPU + CUDA kuruluysa True</span>
<span class="fn">print</span>(torch.cuda.<span class="fn">device_count</span>())          <span class="cm"># kaç GPU</span>
<span class="fn">print</span>(torch.cuda.<span class="fn">get_device_name</span>(<span class="num">0</span>))      <span class="cm"># örn. 'NVIDIA RTX 4090'</span>

<span class="cm"># 2) Deyimsel cihaz seçimi</span>
device = torch.<span class="fn">device</span>(<span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>)
<span class="fn">print</span>(device)                             <span class="cm"># cuda veya cpu</span>

<span class="cm"># 3) Bir tensor'u cihaza taşı</span>
x = torch.<span class="fn">randn</span>(<span class="num">1024</span>, <span class="num">1024</span>)               <span class="cm"># varsayılan olarak CPU'da oluşur</span>
x_gpu = x.<span class="fn">to</span>(device)                      <span class="cm"># GPU'ya taşı (veya CPU'da no-op)</span>
<span class="fn">print</span>(x_gpu.device)                       <span class="cm"># cuda:0</span>

<span class="cm"># 4) Doğrudan cihazda oluştur (daha hızlı -- kopya yok)</span>
x_direct = torch.<span class="fn">randn</span>(<span class="num">1024</span>, <span class="num">1024</span>, device=device)

<span class="cm"># 5) İşlemler aynı cihazı gerektirir</span>
a = torch.<span class="fn">randn</span>(<span class="num">3</span>, device=<span class="str">"cpu"</span>)
b = torch.<span class="fn">randn</span>(<span class="num">3</span>, device=device)
<span class="cm"># c = a + b   # RuntimeError: tüm tensor'lar aynı cihazda olmalı</span>
c = a.<span class="fn">to</span>(device) + b   <span class="cm"># OK</span>

<span class="cm"># 6) NumPy / çizimden önce CPU'ya geri taşı</span>
y = x_gpu.<span class="fn">cpu</span>()                           <span class="cm"># tekrar CPU'da</span>
y_np = y.<span class="fn">numpy</span>()                          <span class="cm"># NumPy dizisi (sıfır kopya)</span>

<span class="cm"># 7) Apple Silicon: MPS arka ucu</span>
<span class="cm"># device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pyodide sadece CPU'da çalışır ama vektörize NumPy işlemi ile Python döngüsünü karşılaştırabiliriz -- GPU'nun büyük tensorlerde kazanmasının ardındaki ilke (paralel donanımda vektörleştirme) tam olarak budur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import time

n = 200_000
a = np.random.randn(n)
b = np.random.randn(n)

# Vectorized NumPy (calls C/SIMD under the hood)
t0 = time.time()
for _ in range(50):
    c = a * b + np.sin(a)
vec_ms = (time.time() - t0) * 1000

# Pure Python loop -- equivalent on a "slow device"
t0 = time.time()
for _ in range(2):  # only 2 reps, the loop is slow
    out = [a[i] * b[i] + math.sin(a[i]) for i in range(2000)]
loop_ms = (time.time() - t0) * 1000

print(f'Vectorized 50 reps over {n} elems : {vec_ms:7.2f} ms')
print(f'Python loop  2 reps over   2000   : {loop_ms:7.2f} ms')
print('GPU vs CPU follows the same pattern: parallel hw beats serial hw.')</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>torch.cuda.is_available()</code> CUDA'nın kurulu ve bir GPU'nun görünür olup olmadığını söyler -- kodunuzu her zaman buna bağlayın ki GPU'su olmayan makinelerde CPU'ya geri düşsün. 2) <code>torch.device("cuda" if available else "cpu")</code> deyimi PyTorch kodunda evrenseldir; bunu bir kez hesaplayıp her yere geçirirsiniz. 3) <code>.to(device)</code> bir tensor'u taşır; zaten o cihazdaysa çağrı no-op'tür. Orijinal tensor'a dokunulmaz -- <code>.to()</code> yeni bir tensor referansı döner ama aynı cihaz "taşımaları" için veri aynı tampondadır. 4) Oluşturma sırasında <code>device=device</code> daha hızlıdır çünkü gereksiz bir CPU tahsisini önler; performans kritik kodda bunu tercih edin. 5) Tek bir işlemde cihazları karıştırmak net bir hata fırlatır: PyTorch verileri sessizce taşımayı reddeder çünkü taşımalar yavaştır. 6) NumPy veya matplotlib'den önce CPU'ya geri taşıyın; <code>.numpy()</code> yalnızca CPU tensor'larında çalışır ve belleği paylaşır. 7) Apple Silicon Mac'lerde (M1/M2/M3) MPS arka ucunu kullanabilirsiniz; API aynıdır, sadece <code>"cuda"</code> yerine <code>"mps"</code> koyun.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">CPU</div><div class="compare-item">Her zaman mevcut, kurulum yok</div><div class="compare-item">Onlarca çekirdek, büyük RAM</div><div class="compare-item">Veri yükleme, ön işleme için iyi</div><div class="compare-item">Büyük matris çarpımları için yavaş</div><div class="compare-item">Küçük model çıkarımı için kullanın</div></div>
<div class="compare-col"><div class="compare-title">GPU (CUDA)</div><div class="compare-item">Binlerce küçük çekirdek</div><div class="compare-item">Yüksek bant genişliğinde VRAM (8-80 GB)</div><div class="compare-item">Matmul, conv için 10-100x daha hızlı</div><div class="compare-item">Sınırlı bellek; OOM yaygındır</div><div class="compare-item">Transformer eğitimi için zorunlu</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: Doğru bir eğitim adımı kalıbı</div><div class="example-body">Yazacağınız her eğitim betiğinde: <code>model.to(device)</code> tüm parametreleri başlangıçta bir kez taşır. Sonra döngüde: <code>x, y = batch[0].to(device), batch[1].to(device)</code> her batch'i girişte taşır. İleri geçişin içinde asla taşımayın. GPU kodunun <em>üç kuralı</em>: (1) parametreleri bir kez taşıyın, (2) veriyi batch başına taşıyın, (3) loglayana kadar her şeyi GPU'da tutun.</div></div>

<div class="l-warn"><strong>Tuzak (CUDA out of memory):</strong> "CUDA out of memory" görürseniz üç şeyi kontrol edin: tensor'ları detach etmeden bir Python listesinde biriktiriyor musunuz? Batch boyutlarınız çok mu büyük? Değerlendirme sırasında <code>torch.no_grad()</code>'i mi unuttunuz? OOM neredeyse hiçbir zaman tek bir büyük tensor hakkında değildir; genellikle binlerce küçüğünün üst üste yığılmasıdır.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. İndeksleme, Dilimleme ve Boolean Maskeleri</h2>

<p class="l-text">PyTorch indekslemesi NumPy indekslemesi ile esasen aynıdır -- NumPy'ı biliyorsanız bunu zaten biliyorsunuz. Birkaç PyTorch'a özel not (gelişmiş indeksleme, değişken uzunluklu veri için boolean maskeler) NLP için çok önemli, çünkü padding maskeleri ve dikkat maskeleri her yerdedir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

x = torch.<span class="fn">arange</span>(<span class="num">20</span>).<span class="fn">reshape</span>(<span class="num">4</span>, <span class="num">5</span>)
<span class="fn">print</span>(x)
<span class="cm"># tensor([[ 0,  1,  2,  3,  4],</span>
<span class="cm">#         [ 5,  6,  7,  8,  9],</span>
<span class="cm">#         [10, 11, 12, 13, 14],</span>
<span class="cm">#         [15, 16, 17, 18, 19]])</span>

<span class="cm"># 1) Temel indeksleme</span>
<span class="fn">print</span>(x[<span class="num">0</span>])              <span class="cm"># 0. satır: tensor([0, 1, 2, 3, 4])</span>
<span class="fn">print</span>(x[<span class="num">0</span>, <span class="num">2</span>])           <span class="cm"># eleman: tensor(2)</span>
<span class="fn">print</span>(x[:, <span class="num">1</span>])           <span class="cm"># 1. sütun:   tensor([1, 6, 11, 16])</span>
<span class="fn">print</span>(x[<span class="num">1</span>:<span class="num">3</span>, <span class="num">2</span>:<span class="num">4</span>])       <span class="cm"># 2x2 alt-blok</span>

<span class="cm"># 2) Negatif indeksler ve adımlar</span>
<span class="fn">print</span>(x[-<span class="num">1</span>])             <span class="cm"># son satır</span>
<span class="fn">print</span>(x[::<span class="num">2</span>])            <span class="cm"># her ikinci satır -- (2, 5)</span>

<span class="cm"># 3) Boolean maske -- NLP dikkat maskelemesinin kalbi</span>
mask = x &gt; <span class="num">10</span>
<span class="fn">print</span>(mask)              <span class="cm"># şekil (4, 5) boolean tensor</span>
<span class="fn">print</span>(x[mask])           <span class="cm"># maskenin True olduğu değerlerden 1B tensor</span>

<span class="cm"># 4) İndeks listesi ile (gelişmiş indeksleme)</span>
rows = torch.<span class="fn">tensor</span>([<span class="num">0</span>, <span class="num">2</span>, <span class="num">3</span>])
<span class="fn">print</span>(x[rows])           <span class="cm"># 0, 2, 3 satırlarını seçer -- şekil (3, 5)</span>

<span class="cm"># 5) Padding maske örneği: dizi uzunlukları</span>
seq = torch.<span class="fn">tensor</span>([
    [<span class="num">101</span>, <span class="num">2003</span>,  <span class="num">170</span>,  <span class="num">102</span>,    <span class="num">0</span>,    <span class="num">0</span>],   <span class="cm"># uzunluk 4</span>
    [<span class="num">101</span>, <span class="num">1037</span>,  <span class="num">189</span>, <span class="num">1567</span>,  <span class="num">202</span>,  <span class="num">102</span>],   <span class="cm"># uzunluk 6</span>
])
pad_mask = (seq != <span class="num">0</span>)    <span class="cm"># token gerçekse True, padding ise False</span>
<span class="fn">print</span>(pad_mask)
<span class="cm"># tensor([[ True,  True,  True,  True, False, False],</span>
<span class="cm">#         [ True,  True,  True,  True,  True,  True]])</span>

<span class="cm"># 6) gather / scatter -- batch'li indeksleme</span>
emb = torch.<span class="fn">randn</span>(<span class="num">10</span>, <span class="num">4</span>)              <span class="cm"># 10 token, 4 boyutlu embedding'ler</span>
ids = torch.<span class="fn">tensor</span>([<span class="num">3</span>, <span class="num">7</span>, <span class="num">1</span>])         <span class="cm"># hangi token'ları getir</span>
selected = emb[ids]                   <span class="cm"># şekil (3, 4)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy'ın indeksleme, dilimleme, fancy indexing ve boolean maskeleri torch ile aynı davranır -- her iki kütüphane de aynı array-programming geleneğinden ilham aldı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.arange(20).reshape(4, 5)
print('matrix:\n', x)

print('row 0       :', x[0])
print('col 2       :', x[:, 2])
print('submatrix   :\n', x[1:3, 2:5])
print('last col    :', x[:, -1])

# Fancy indexing -- pick specific rows
idx = np.array([0, 2, 3])
print('rows [0,2,3]:\n', x[idx])

# Boolean mask
mask = x % 3 == 0
print('multiples of 3:', x[mask])

# Assignment via mask
x2 = x.copy()
x2[x2 < 5] = -1
print('after mask assign:\n', x2)</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Standart <code>x[satır, sütun]</code> indekslemesi azaltılmış rank ile skaler veya alt tensor döner; <code>:</code> ile dilimleme boyutu korur. 2) Negatif indeksler sondan sayar (Python listeleri gibi); adımlı dilimleme <code>::2</code> her ikinci elemanı örnekler. 3) Boolean maskeler kaynakla aynı şekilde <code>bool</code> dtype tensor'lardır; maskelemek yalnızca True konumlarını düzleştirip dışarı çıkarır. Bu tam olarak dikkat maskelerinin pooling sırasında geçerli token'ları seçtiği yöntemdir. 4) Tamsayı tensor'u ile gelişmiş indeksleme bu spesifik satırları seçer -- <code>np.take</code> ile aynıdır. 5) Padding maske örneği her NLP boru hattının yaptığını yansıtır: <code>(seq != pad_id)</code> aşağı akış katmanlarının dikkati hesaplarken veya kayıpta padding'i yok saymak için kullandığı boolean tensor üretir. 6) <code>emb[ids]</code> elle yapılmış <code>nn.Embedding(...)(ids)</code> eşdeğeridir -- embedding katmanı, indekslemenin satır getirdiği öğrenilebilir bir lookup tablosudur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x[i]</div><div class="card-body">i. satır; rank'i 1 azaltır.</div></div>
<div class="calc-card"><div class="card-title">x[:, i]</div><div class="card-body">i. sütun; herhangi bir 2 boyutlu+ tensor için çalışır.</div></div>
<div class="calc-card"><div class="card-title">x[a:b]</div><div class="card-body">a (dahil) ile b (hariç) arası satırları diliml.</div></div>
<div class="calc-card"><div class="card-title">x[bool_mask]</div><div class="card-body">Maskenin True olduğu tüm elemanlar; sonuç 1 boyutludur.</div></div>
<div class="calc-card"><div class="card-title">x[idx_tensor]</div><div class="card-body">Gelişmiş indeksleme; tamsayı tensor ile belirli satırları seç.</div></div>
<div class="calc-card"><div class="card-title">x[..., -1]</div><div class="card-body">Üç nokta kalan boyutları doldurur; burada son eksendeki son elemanı yakalar.</div></div>
</div>

<div class="l-note"><strong>Bunun NLP için neden önemli olduğu:</strong> Padding maskeleri, dikkat maskeleri ve etiket maskeleri hep boolean tensor'lardır. <code>ignore_index=-100</code> ile cross-entropy, <code>-inf</code> maskeli dikkat, paketlenmiş diziler -- hepsi tensor'lar üzerinde indeksleme ve maskelemenin çeşitleridir. Temel indekslemeyi anlıyorsanız transformer tesisatının %80'ini anlıyorsunuz.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. NumPy Köprüsü ve Yaygın İşlemler</h2>

<p class="l-text">PyTorch ve NumPy sorunsuz birlikte çalışır, bu önemli çünkü veri yükleme, çizim ve birçok ön işleme NumPy'da olur. Köprüyü doğru geçmek -- ve kopyaların ne zaman olduğunu bilmek -- ince hataları önler.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># torch -&gt; numpy: CPU'da sıfır kopya</span>
t = torch.<span class="fn">randn</span>(<span class="num">3</span>, <span class="num">4</span>)
arr = t.<span class="fn">numpy</span>()
arr[<span class="num">0</span>, <span class="num">0</span>] = <span class="num">999</span>
<span class="fn">print</span>(t[<span class="num">0</span>, <span class="num">0</span>])         <span class="cm"># ayrıca 999 -- belleği paylaşırlar</span>

<span class="cm"># numpy -&gt; torch: from_numpy sıfır kopya, torch.tensor kopyalar</span>
np_arr = np.<span class="fn">array</span>([[<span class="num">1.0</span>, <span class="num">2.0</span>], [<span class="num">3.0</span>, <span class="num">4.0</span>]])
shared = torch.<span class="fn">from_numpy</span>(np_arr)        <span class="cm"># belleği paylaşır</span>
copied = torch.<span class="fn">tensor</span>(np_arr)            <span class="cm"># kopya yapar</span>

<span class="cm"># Eleman bazlı matematik (vektörize)</span>
x = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">3.0</span>])
<span class="fn">print</span>(x + <span class="num">1</span>)              <span class="cm"># tensor([2., 3., 4.])</span>
<span class="fn">print</span>(x * <span class="num">2</span>)              <span class="cm"># tensor([2., 4., 6.])</span>
<span class="fn">print</span>(x ** <span class="num">2</span>)             <span class="cm"># tensor([1., 4., 9.])</span>
<span class="fn">print</span>(torch.<span class="fn">exp</span>(x))       <span class="cm"># tensor([2.7183, 7.3891, 20.0855])</span>
<span class="fn">print</span>(torch.<span class="fn">log</span>(x))       <span class="cm"># doğal logaritma</span>

<span class="cm"># Azaltmalar</span>
m = torch.<span class="fn">randn</span>(<span class="num">3</span>, <span class="num">4</span>)
<span class="fn">print</span>(m.<span class="fn">sum</span>())            <span class="cm"># skaler -- tüm elemanlar üzerinden toplam</span>
<span class="fn">print</span>(m.<span class="fn">sum</span>(dim=<span class="num">0</span>))       <span class="cm"># şekil (4,) -- satırlar boyunca toplam</span>
<span class="fn">print</span>(m.<span class="fn">sum</span>(dim=<span class="num">1</span>))       <span class="cm"># şekil (3,) -- sütunlar boyunca toplam</span>
<span class="fn">print</span>(m.<span class="fn">mean</span>(dim=<span class="num">1</span>, keepdim=<span class="kw">True</span>))   <span class="cm"># şekil (3, 1) -- boyutu koru</span>
<span class="fn">print</span>(m.<span class="fn">argmax</span>(dim=<span class="num">1</span>))    <span class="cm"># her satırdaki maks indeksi</span>

<span class="cm"># Matris çarpımı -- en önemli işlem</span>
A = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">3</span>)
B = torch.<span class="fn">randn</span>(<span class="num">3</span>, <span class="num">5</span>)
C = A @ B                 <span class="cm"># şekil (2, 5) -- @ kullan, torch.mm yerine</span>
<span class="fn">print</span>(C.shape)

<span class="cm"># Batch'li matmul</span>
Bm = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">2</span>, <span class="num">3</span>)
Cm = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">3</span>, <span class="num">5</span>)
out = torch.<span class="fn">bmm</span>(Bm, Cm)   <span class="cm"># şekil (8, 2, 5)</span>

<span class="cm"># Yerinde işlemler alt çizgi ile biter</span>
x = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">3.0</span>])
x.<span class="fn">add_</span>(<span class="num">10</span>)                <span class="cm"># x'i yerinde değiştirir</span>
<span class="fn">print</span>(x)                  <span class="cm"># tensor([11., 12., 13.])</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Çoğu torch matematik işlemi (sum, mean, argmax, matmul, broadcasting, einsum) NumPy'da aynı isim ve imza ile birebir karşılığa sahiptir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.random.randn(4, 6)
W = np.random.randn(6, 3)

# Matmul (@ is the same operator)
out = x @ W
print('x @ W shape:', out.shape)

# Reductions
print('mean (all)         :', x.mean().round(3))
print('mean axis=0 (per col):', x.mean(axis=0).round(3))
print('argmax axis=1 (per row):', x.argmax(axis=1))

# Broadcasting
bias = np.random.randn(3)
y = out + bias              # (4, 3) + (3,)
print('broadcast add:', y.shape)

# Einsum (also identical to torch.einsum)
attn = np.einsum('bi,bj->bij', x[:, :3], x[:, :3])
print('einsum result shape:', attn.shape)</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) CPU tensor'unda <code>.numpy()</code> aynı belleği paylaşan bir NumPy dizisi verir -- birini değiştirmek diğerini değiştirir. 2) <code>torch.from_numpy</code> aynı paylaşım davranışıyla ters yöndür; <code>torch.tensor(arr)</code> her zaman kopyalar, sürpriz istemediğinizde daha güvenlidir. 3) Eleman bazlı matematik öylece çalışır: skaler broadcast, exp/log/sin/cos, tüm olağan NumPy fonksiyonları aynı isimlerle tensor'larda vardır. 4) <code>sum</code>, <code>mean</code>, <code>argmax</code> gibi azaltmalar bir <code>dim=</code> argümanı alır; argümansız tüm elemanlar üzerinden azaltır. <code>keepdim=True</code> sonucu geri broadcast etmek için zorunlu olan boyutu 1 olan ekseni korur. 5) <code>@</code> matris çarpımı operatörüdür, <code>torch.matmul</code> ile aynı; bu tek işlem transformer'larda hesaplamanın %90+'ından sorumludur. 6) <code>torch.bmm</code> batch'li matmul'dur: <code>(B, n, m) @ (B, m, p) -&gt; (B, n, p)</code>, dikkatin içinde kullanılır. 7) <code>add_</code>, <code>mul_</code>, <code>zero_</code> gibi alt çizgi sonekli metotlar yerinde değiştirir -- bellek tasarrufu sağlar ama gradyan gerektiren tensor'larda kullanılırsa autograd'i bozar, bu yüzden onları yalnızca gradyan almayan tamponlar için kullanın.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">+ - * / **</div><div class="card-body">Broadcasting ile eleman bazlı aritmetik. NumPy ile aynı kurallar.</div></div>
<div class="calc-card"><div class="card-title">@</div><div class="card-body">Matris çarpımı. Bunu her yerde <code>torch.mm</code> veya <code>torch.matmul</code> yerine kullanın.</div></div>
<div class="calc-card"><div class="card-title">.sum(dim=...)</div><div class="card-body">Belirli bir eksen boyunca azalt. Geri broadcast etmeniz gerekiyorsa <code>keepdim=True</code>.</div></div>
<div class="calc-card"><div class="card-title">.mean / .std / .max</div><div class="card-body">Standart azaltmalar. <code>.max(dim=)</code> (değerler, indeksler) adlandırılmış tuple döner.</div></div>
<div class="calc-card"><div class="card-title">.argmax(dim=...)</div><div class="card-body">Maks'ın indeksleri -- sınıflandırmada standart "tahmin sınıfı" hesaplaması.</div></div>
<div class="calc-card"><div class="card-title">_ son eki</div><div class="card-body">Yerinde değiştirme. <code>requires_grad=True</code> olan tensor'larda kaçının.</div></div>
</div>

<div id="plot-pl1-numpy-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> CPU NumPy, CPU PyTorch ve GPU PyTorch'ta (tipik 4090) 2048x2048 matris çarpımının hız karşılaştırması. NumPy ve CPU PyTorch benzerdir (ikisi de optimize edilmiş BLAS sarmalayıcısıdır); GPU PyTorch yaklaşık 50-100 kat daha hızlıdır. Bu tek grafik, derin öğrenmenin neden 2012'de AlexNet ile CPU'dan ayrıldığını açıklar -- bir kez nontrivial bir ağa sahip olduğunuzda boşluk göz ardı edilemeyecek kadar büyüktür.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. NumPy vs PyTorch ve Toparlanma</h2>

<p class="l-text">NumPy zaten güzel bir dizi kütüphanesiyken PyTorch neden var? Çünkü iki eksik parça -- GPU ve autograd -- derin öğrenme için pazarlık konusu değildir. İşte yan yana bir kopya kağıdı.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">NumPy</div><div class="compare-item">Yalnızca CPU</div><div class="compare-item">Autograd yok</div><div class="compare-item">Varsayılan dtype: float64</div><div class="compare-item">Çarpma: <code>@</code> veya <code>np.dot</code></div><div class="compare-item">Yeniden şekil: <code>.reshape</code></div><div class="compare-item">Transpoz: <code>.T</code> veya <code>np.transpose</code></div><div class="compare-item">Rastgele: <code>np.random.randn</code></div><div class="compare-item">Varsayılan olarak batch'li işlem yok</div></div>
<div class="compare-col"><div class="compare-title">PyTorch</div><div class="compare-item">CPU + GPU + MPS</div><div class="compare-item">Autograd yerleşik</div><div class="compare-item">Varsayılan dtype: float32</div><div class="compare-item">Çarpma: <code>@</code> veya <code>torch.matmul</code></div><div class="compare-item">Yeniden şekil: <code>.view</code> veya <code>.reshape</code></div><div class="compare-item">Transpoz: <code>.T</code>, <code>.transpose</code>, <code>.permute</code></div><div class="compare-item">Rastgele: <code>torch.randn</code></div><div class="compare-item">Batch'li işlemler için <code>bmm</code>, <code>einsum</code></div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># Mini uçtan uca: elle yapılmış lineer regresyon ileri geçişi</span>
torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)

<span class="cm"># Sentetik veri: y = 3x + 2 + gürültü</span>
N = <span class="num">100</span>
X = torch.<span class="fn">randn</span>(N, <span class="num">1</span>)
y = <span class="num">3</span> * X + <span class="num">2</span> + <span class="num">0.1</span> * torch.<span class="fn">randn</span>(N, <span class="num">1</span>)

<span class="cm"># Parametreler (bunların ağırlık olduğunu varsayın)</span>
w = torch.<span class="fn">randn</span>(<span class="num">1</span>, <span class="num">1</span>)
b = torch.<span class="fn">zeros</span>(<span class="num">1</span>)

<span class="cm"># İleri geçiş: y_hat = X @ w + b</span>
y_hat = X @ w + b               <span class="cm"># şekil (N, 1)</span>

<span class="cm"># Kayıp: ortalama kare hata</span>
loss = ((y_hat - y) ** <span class="num">2</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"İlk kayıp: {loss.item():.4f}"</span>)

<span class="cm"># Manuel gradyan (L2'de bunu autograd ile değiştireceğiz)</span>
grad_w = (<span class="num">2</span> / N) * (X.T @ (y_hat - y))     <span class="cm"># şekil (1, 1)</span>
grad_b = (<span class="num">2</span> / N) * (y_hat - y).<span class="fn">sum</span>()       <span class="cm"># skaler</span>

<span class="cm"># Gradyan iniş adımı</span>
lr = <span class="num">0.1</span>
w = w - lr * grad_w
b = b - lr * grad_b

<span class="cm"># Yeniden değerlendir</span>
y_hat = X @ w + b
loss2 = ((y_hat - y) ** <span class="num">2</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Bir adımdan sonra: {loss2.item():.4f}"</span>)

<span class="cm"># Mevcutsa hepsini GPU'ya taşı</span>
device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>
X, y, w, b = [t.<span class="fn">to</span>(device) <span class="kw">for</span> t <span class="kw">in</span> (X, y, w, b)]
y_hat = X @ w + b
<span class="fn">print</span>(f<span class="str">"{device} üzerinde: şekil {y_hat.shape}, dtype {y_hat.dtype}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tam bir mini boru hattı -- özellikleri normalize et, sklearn ile sınıflandır -- PyTorch'un autograd ve GPU eklediğinde genelleştirdiği iş akışını gösterir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Use the iris dataset from preamble
X = df_iris.iloc[:, :4].values
y = df_iris.iloc[:, 4].astype('category').cat.codes.values

scaler = StandardScaler()
Xs = scaler.fit_transform(X)
print('Xs mean (~0):', Xs.mean(axis=0).round(3))
print('Xs std  (~1):', Xs.std (axis=0).round(3))

clf = LogisticRegression(max_iter=500).fit(Xs, y)
acc = accuracy_score(y, clf.predict(Xs))
print(f'sklearn LR accuracy on iris: {acc:.3f}')
print('classes:', clf.classes_, 'n_features:', clf.n_features_in_)</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>y = 3x + 2 + gürültü</code>'den 100 sentetik örnek üretir; matris çarpımı kullanabilmek için <code>X</code>'in şekli <code>(100, 1)</code>. 2) Tek bir ağırlığı ve bias'ı rastgele tensor olarak başlatır -- henüz gradyan takibi yok. 3) İleri geçiş: <code>y_hat = X @ w + b</code> broadcasting kullanır (b şekli (1,) ama (100,1)'e gerilerek eklenir). 4) Ortalama kare hatayı hesaplar; <code>.item()</code> 0 boyutlu tensor'dan Python float'ını çıkarır. 5) Kalkülüs kullanarak gradyanları elle türetir -- bu sonraki derste autograd'in bizim için otomatik yapacağı şeyin tam olarak aynısı, ama bunu bir kez elle görmek iyidir. 6) Bir gradyan iniş güncellemesi yapar ve kaybı yeniden hesaplar; düştüğünü görmelisiniz. 7) Cihaz taşıma kalıbını gösterir: tüm tensor'larda liste comprehension. Son şekil ve dtype baskıları her şeyin hedef cihaza doğru indiğini doğrular.</p>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Tensor'lar iki ekstra ile NumPy dizileridir: GPU desteği ve autograd. API kasıtlı olarak NumPy gibidir.<br><strong>2.</strong> Tensor'unuzun her zaman <code>shape</code>, <code>dtype</code> ve <code>device</code>'ını bilin -- uyumsuzluklar bir numaralı hata kaynağıdır.<br><strong>3.</strong> Bitişikse <code>view</code>, emin değilseniz <code>reshape</code> ile yeniden şekillendirin; batch boyutu ekleme/çıkarma için <code>unsqueeze/squeeze</code>; keyfi eksen değişimi için <code>permute</code> kullanın.<br><strong>4.</strong> Tensor'ları GPU'ya bir kez taşıyın ve orada tutun; <code>.to(device)</code> evrensel fiildir.<br><strong>5.</strong> Boolean maskeler ve tamsayı indeksleme dikkat maskelerinin ve embedding lookup'larının temelidir -- onları derinlemesine öğrenin.<br><strong>6.</strong> Matmul için <code>@</code>, batch'li matmul için <code>torch.bmm</code> ve geri broadcast etmeniz gerektiğinde <code>dim=</code> + <code>keepdim=</code> ile azaltmalar kullanın.<br><strong>7.</strong> CPU'da NumPy birlikte çalışabilirliği bedavadır; çizimden önce ve veri yüklemeden sonra köprüyü geçin, eğitim döngülerinin içinde asla.<br><strong>8.</strong> Sonraki ders: autograd o manuel gradyan türevlerini ortadan kaldırır -- ileri geçişi tarif ediyorsunuz ve PyTorch sizin için türev alıyor.</div></div>
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

  function shapesPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var stages = lang === 'tr'
      ? ['Token IDs', 'Embedding', 'Cok-bas Q/K/V', 'Attention', 'Pooling', 'Logits']
      : ['Token IDs', 'Embedding', 'Multi-head Q/K/V', 'Attention', 'Pooling', 'Logits'];
    var shapes = ['(B, T)', '(B, T, D)', '(B, H, T, d)', '(B, T, D)', '(B, D)', '(B, C)'];
    var sizes = [16, 12288, 12288, 12288, 768, 2];   // illustrative element counts (B=1, T=16, D=768, H=12, d=64, C=2)
    var trace = {x: stages, y: sizes, type:'bar', marker:{color:T.accent, line:{color:'rgba(255,255,255,0.2)',width:1}}, text: shapes, textposition:'outside'};
    var layout = Object.assign({}, common, {
      title:{text: lang === 'tr' ? 'Transformer Forward Pass: Sekil Donusumleri' : 'Transformer Forward Pass: Shape Transformations', font:{color:T.text,size:14}},
      yaxis:{title: lang === 'tr' ? 'Eleman sayisi (log)' : 'Element count (log)', type:'log', gridcolor:T.grid, zerolinecolor:T.zero},
      xaxis:{gridcolor:T.grid},
      margin:{t:60,r:30,b:80,l:60}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  function speedPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var labels = lang === 'tr'
      ? ['NumPy CPU', 'PyTorch CPU', 'PyTorch GPU']
      : ['NumPy CPU', 'PyTorch CPU', 'PyTorch GPU'];
    var times = [180, 165, 3.2];      // ms for 2048x2048 matmul (illustrative)
    var trace = {x: labels, y: times, type:'bar', marker:{color:[T.accent, T.accent, '#4ecdc4'], line:{color:'rgba(255,255,255,0.2)',width:1}}, text: times.map(function(t){return t + ' ms';}), textposition:'outside'};
    var layout = Object.assign({}, common, {
      title:{text: lang === 'tr' ? '2048x2048 Matris Carpimi: CPU vs GPU' : '2048x2048 Matmul: CPU vs GPU', font:{color:T.text,size:14}},
      yaxis:{title:'ms', gridcolor:T.grid, zerolinecolor:T.zero, type:'log'},
      xaxis:{gridcolor:T.grid}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  shapesPlot('plot-pl1-shapes-en', 'en');
  speedPlot('plot-pl1-numpy-en', 'en');
  shapesPlot('plot-pl1-shapes-tr', 'tr');
  speedPlot('plot-pl1-numpy-tr', 'tr');
}, 250);</script>
`
};
