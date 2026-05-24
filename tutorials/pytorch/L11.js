window.PYTORCH_L11 = {

en: `<p class="l-text"><strong>Training is 10% of the work; deployment is 90%.</strong> Once a model gets good validation metrics, the real engineering starts: serializing weights, switching to inference mode, exporting to a deployment-friendly format, squeezing memory and latency, and verifying every step does not silently change predictions. Every NLP system you ship in production sits on top of these primitives -- the difference between a 200ms latency and a 20ms latency is not a model rewrite, it is the right combination of <code>.eval()</code>, <code>no_grad</code>, mixed precision, and quantization.</p>

<p class="l-text">In this lesson we cover the full PyTorch production stack: <code>torch.save</code> patterns, eval/no-grad mode, TorchScript tracing and scripting, ONNX export, automatic mixed precision, dynamic and static quantization, and profiling with <code>torch.profiler</code>. Each section ends with the gotcha that bites you in production if you skip the detail.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Save and reload models the portable way with <code>state_dict</code> and <code>load_state_dict</code></li>
<li>Run inference correctly with <code>model.eval()</code> and <code>torch.no_grad()</code> wrappers</li>
<li>Export models to TorchScript via <code>torch.jit.trace</code> and <code>torch.jit.script</code></li>
<li>Convert a PyTorch model to ONNX and verify outputs match across runtimes</li>
<li>Speed up training with mixed precision via <code>torch.cuda.amp.autocast</code> and <code>GradScaler</code></li>
<li>Apply dynamic and static quantization (int8) and measure latency with <code>torch.profiler</code></li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Saving and Loading: state_dict vs full Model</h2>

<p class="l-text">There are two ways to save a model. One is portable, future-proof, and recommended. The other is fragile and breaks when your code refactors. Pick the right one.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">state_dict (recommended)</div><div class="card-body">A Python dict mapping parameter names to tensors. Just the weights. Pickled.</div></div>
<div class="calc-card"><div class="card-title">torch.save(model)</div><div class="card-body">Pickles the entire model object including its class. Brittle: needs the exact code path.</div></div>
<div class="calc-card"><div class="card-title">Best practice</div><div class="card-body">Save state_dict + a small config dict describing the architecture.</div></div>
<div class="calc-card"><div class="card-title">Optimizer state</div><div class="card-body">Save its state_dict too if you want to resume training later.</div></div>
<div class="calc-card"><div class="card-title">Versioning</div><div class="card-body">Include PyTorch version, model arch hash, training step in the checkpoint dict.</div></div>
<div class="calc-card"><div class="card-title">map_location</div><div class="card-body">Always set when loading: avoids GPU vs CPU mismatch.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TextClassifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size=<span class="num">30000</span>, d_model=<span class="num">128</span>, num_classes=<span class="num">2</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(vocab_size, d_model)
        self.fc = nn.<span class="fn">Linear</span>(d_model, num_classes)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        <span class="kw">return</span> self.<span class="fn">fc</span>(self.<span class="fn">embed</span>(ids).<span class="fn">mean</span>(dim=<span class="num">1</span>))

model = <span class="fn">TextClassifier</span>()
optimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)

<span class="cm"># 1) Save state_dict only -- the recommended pattern</span>
torch.<span class="fn">save</span>(model.<span class="fn">state_dict</span>(), <span class="str">"model.pt"</span>)

<span class="cm"># 2) Save the full training state (resumable)</span>
torch.<span class="fn">save</span>({
    <span class="str">"epoch"</span>: <span class="num">5</span>,
    <span class="str">"model_state"</span>: model.<span class="fn">state_dict</span>(),
    <span class="str">"optimizer_state"</span>: optimizer.<span class="fn">state_dict</span>(),
    <span class="str">"config"</span>: {<span class="str">"vocab_size"</span>: <span class="num">30000</span>, <span class="str">"d_model"</span>: <span class="num">128</span>, <span class="str">"num_classes"</span>: <span class="num">2</span>},
    <span class="str">"torch_version"</span>: torch.__version__,
}, <span class="str">"checkpoint.pt"</span>)

<span class="cm"># 3) Load: instantiate the architecture first, then load weights</span>
model2 = <span class="fn">TextClassifier</span>(vocab_size=<span class="num">30000</span>, d_model=<span class="num">128</span>, num_classes=<span class="num">2</span>)
state = torch.<span class="fn">load</span>(<span class="str">"model.pt"</span>, map_location=<span class="str">"cpu"</span>)
model2.<span class="fn">load_state_dict</span>(state)
model2.<span class="fn">eval</span>()

<span class="cm"># 4) Resume training</span>
ckpt = torch.<span class="fn">load</span>(<span class="str">"checkpoint.pt"</span>, map_location=<span class="str">"cpu"</span>)
model3 = <span class="fn">TextClassifier</span>(**ckpt[<span class="str">"config"</span>])
model3.<span class="fn">load_state_dict</span>(ckpt[<span class="str">"model_state"</span>])
opt3 = torch.optim.<span class="fn">AdamW</span>(model3.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)
opt3.<span class="fn">load_state_dict</span>(ckpt[<span class="str">"optimizer_state"</span>])
start_epoch = ckpt[<span class="str">"epoch"</span>] + <span class="num">1</span>
<span class="fn">print</span>(f<span class="str">"resuming at epoch {start_epoch}"</span>)

<span class="cm"># 5) Strict=False allows missing/extra keys -- useful for partial loads</span>
<span class="cm"># (e.g. loading a backbone but skipping a head)</span>
model2.<span class="fn">load_state_dict</span>(state, strict=<span class="kw">False</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Save & load: pickle / joblib of a fitted sklearn model is the analog of torch.save(state_dict). Round-trip a classifier into bytes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import io
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=300)),
    ('clf', LogisticRegression(max_iter=200)),
])
pipe.fit(df_reviews['review'], df_reviews['label'])

# Save to in-memory buffer (analog of torch.save)
buf = io.BytesIO()
joblib.dump(pipe, buf)
print('serialized size  :', len(buf.getvalue()), 'bytes')

# Load back (analog of torch.load + load_state_dict)
buf.seek(0)
restored = joblib.load(buf)
sample   = df_reviews['review'].iloc[:3].tolist()
print('restored predictions:', restored.predict(sample).tolist())
print('original predictions:', pipe.predict(sample).tolist())</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>torch.save(model.state_dict(), path)</code> saves only the parameter and buffer tensors, keyed by their dotted names like <code>"embed.weight"</code>. This is portable: as long as you can re-instantiate the architecture, you can load these weights. 2) For full training state we save a checkpoint dict: model, optimizer, epoch, config, library version. The config lets us re-instantiate the right architecture with no guessing. 3) Loading: build an architecture-matched model, then call <code>load_state_dict</code>. <code>map_location="cpu"</code> ensures we can load a checkpoint trained on GPU even when no GPU is present. 4) Resuming training: rebuild model AND optimizer from their state dicts, then continue from <code>epoch + 1</code>. 5) <code>strict=False</code> tolerates mismatched keys -- handy when fine-tuning a head on top of a different backbone or migrating an architecture; you get a list of missing/unexpected keys you should always inspect.</p>

<div class="l-warn"><strong>Do NOT save the full model with <code>torch.save(model, path)</code>.</strong> It pickles the class definition. If you rename a Python file, move a class to a different module, or upgrade PyTorch in a way that breaks pickle compatibility, the load fails. The <code>state_dict</code> pattern is immune to all of these.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. eval() and no_grad: the Inference Switches</h2>

<p class="l-text">Two switches change the behavior of a PyTorch model between training and inference. Forgetting either is one of the most common production bugs in NLP.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">Net</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc = nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">5</span>)
        self.bn = nn.<span class="fn">BatchNorm1d</span>(<span class="num">5</span>)
        self.drop = nn.<span class="fn">Dropout</span>(<span class="num">0.5</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">drop</span>(self.<span class="fn">bn</span>(self.<span class="fn">fc</span>(x)))

m = <span class="fn">Net</span>()

<span class="cm"># 1) Training mode (default)</span>
m.<span class="fn">train</span>()
x = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">10</span>)
out_train = <span class="fn">m</span>(x)
<span class="fn">print</span>(<span class="str">"train:"</span>, out_train.<span class="fn">std</span>().<span class="fn">item</span>())   <span class="cm"># nonzero variance, dropout active</span>

<span class="cm"># 2) Eval mode -- disables dropout, switches batchnorm to running stats</span>
m.<span class="fn">eval</span>()
out_eval = <span class="fn">m</span>(x)
<span class="fn">print</span>(<span class="str">"eval:"</span>, out_eval.<span class="fn">std</span>().<span class="fn">item</span>())     <span class="cm"># different from train -- dropout off</span>

<span class="cm"># 3) torch.no_grad() -- disables autograd graph construction</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">m</span>(x)
    <span class="cm"># out.requires_grad is False; no graph, no gradient memory</span>

<span class="cm"># 4) inference_mode -- even faster than no_grad (no version counters)</span>
<span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
    out = <span class="fn">m</span>(x)

<span class="cm"># 5) Standard production inference recipe</span>
<span class="kw">def</span> <span class="fn">predict</span>(model, x):
    model.<span class="fn">eval</span>()
    <span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
        <span class="kw">return</span> <span class="fn">model</span>(x)

<span class="cm"># 6) The classic bug: forgetting .eval() on a model with dropout/batchnorm</span>
<span class="cm"># Symptom: predictions are noisy or batchnorm gives different results</span>
<span class="cm"># in test time vs train time. Fix: ALWAYS call .eval() before inference.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">eval() + no_grad analogs in sklearn: a fitted model just calls predict(), no gradient computation involved. We measure the speedup vs a tracked-gradient style approach.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import time
import numpy as np
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(0)
X = rng.standard_normal((2000, 64))
y = (X[:, 0] + X[:, 1] > 0).astype(int)

clf = LogisticRegression(max_iter=200).fit(X, y)

# Inference (analog of model.eval()+no_grad)
t0 = time.time()
for _ in range(50):
    preds = clf.predict(X)
inf_ms = (time.time() - t0) * 1000

# Re-fitting (analog of training, with grads)
t0 = time.time()
LogisticRegression(max_iter=200).fit(X, y)
fit_ms = (time.time() - t0) * 1000

print(f'inference x50 : {inf_ms:7.2f} ms')
print(f'one fit       : {fit_ms:7.2f} ms')
print('eval/no_grad mode in torch removes the grad bookkeeping, just like predict() vs fit() here.')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>model.train()</code> turns on training-time behavior: Dropout actually drops units, BatchNorm uses batch statistics. 2) <code>model.eval()</code> turns it off: Dropout becomes the identity, BatchNorm uses the running mean/variance accumulated during training. The output is now deterministic given the input. 3) <code>torch.no_grad()</code> wraps a block where no autograd graph is built. Tensors do not store the operations that produced them, halving memory and significantly speeding up inference. 4) <code>torch.inference_mode()</code> is even faster than <code>no_grad</code> -- it skips version-counter bookkeeping in addition to skipping autograd. Use it for any pure-inference path. 5) The canonical inference helper. 6) The classic bug -- in production NLP, forgetting <code>.eval()</code> means dropout randomly zeroes 10-20% of activations at test time. Predictions become non-deterministic and accuracy drops 1-3 points. Always call <code>.eval()</code> in your inference pipeline.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">model.eval()</div><div class="compare-item">Module-level switch</div><div class="compare-item">Affects Dropout, BatchNorm, etc.</div><div class="compare-item">Does NOT disable autograd</div><div class="compare-item">Required for correctness</div></div>
<div class="compare-col"><div class="compare-title">torch.no_grad()</div><div class="compare-item">Context manager</div><div class="compare-item">Disables autograd graph</div><div class="compare-item">Halves memory at inference</div><div class="compare-item">Required for performance</div></div>
<div class="compare-col"><div class="compare-title">torch.inference_mode()</div><div class="compare-item">Context manager</div><div class="compare-item">Stricter than no_grad</div><div class="compare-item">Even faster</div><div class="compare-item">Modern default for pure inference</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. TorchScript: Tracing vs Scripting</h2>

<p class="l-text">TorchScript is a serializable subset of Python that runs without Python at all. You compile a PyTorch model to a TorchScript module and ship it to a C++ server, an Android phone, or any environment where Python is not welcome.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">torch.jit.trace</div><div class="card-body">Run model on example input, record op graph. Captures actual control flow on that input.</div></div>
<div class="calc-card"><div class="card-title">torch.jit.script</div><div class="card-body">Parse Python source, support if/while/for. Captures dynamic control flow.</div></div>
<div class="calc-card"><div class="card-title">When to trace</div><div class="card-body">Pure tensor pipeline, fixed control flow. Most CNNs, simple transformers.</div></div>
<div class="calc-card"><div class="card-title">When to script</div><div class="card-body">Loops over variable lengths, conditional branches. RNNs, beam search, custom decoding.</div></div>
<div class="calc-card"><div class="card-title">.pt file</div><div class="card-body">Single self-contained binary with weights + graph. Loadable from C++.</div></div>
<div class="calc-card"><div class="card-title">Limitation</div><div class="card-body">TorchScript supports a subset of Python; some idioms (lambdas with closures, dicts with mixed types) need rewriting.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">Classifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc1 = nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">64</span>)
        self.fc2 = nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">2</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">fc2</span>(torch.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x)))

m = <span class="fn">Classifier</span>().<span class="fn">eval</span>()

<span class="cm"># 1) TRACING: pass an example input, record the op sequence</span>
example = torch.<span class="fn">randn</span>(<span class="num">1</span>, <span class="num">128</span>)
traced = torch.jit.<span class="fn">trace</span>(m, example)
<span class="fn">print</span>(traced.graph)             <span class="cm"># IR graph</span>

<span class="cm"># Save and load: cross-language compatible</span>
traced.<span class="fn">save</span>(<span class="str">"model_traced.pt"</span>)
loaded = torch.jit.<span class="fn">load</span>(<span class="str">"model_traced.pt"</span>)
<span class="fn">print</span>(<span class="fn">loaded</span>(torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">128</span>)).shape)   <span class="cm"># works with any batch size</span>

<span class="cm"># 2) SCRIPTING: parse the Python source itself</span>
<span class="kw">class</span> <span class="fn">RnnLike</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.cell = nn.<span class="fn">Linear</span>(<span class="num">32</span>, <span class="num">32</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="cm"># x: (T, 32)  -- variable length loop</span>
        h = torch.<span class="fn">zeros</span>(<span class="num">32</span>)
        <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(x.<span class="fn">size</span>(<span class="num">0</span>)):
            h = torch.<span class="fn">tanh</span>(self.<span class="fn">cell</span>(x[t]) + h)
        <span class="kw">return</span> h

scripted = torch.jit.<span class="fn">script</span>(<span class="fn">RnnLike</span>().<span class="fn">eval</span>())
out = <span class="fn">scripted</span>(torch.<span class="fn">randn</span>(<span class="num">7</span>, <span class="num">32</span>))
<span class="fn">print</span>(out.shape)               <span class="cm"># (32,)</span>

<span class="cm"># 3) Mixed: trace pieces, script the loop</span>
<span class="cm"># Tracing alone would freeze the loop length; scripting captures the loop.</span>

<span class="cm"># 4) Common gotcha: tracing locks shapes that depend on data</span>
<span class="cm"># If your forward has "if x.shape[0] &gt; 1: ..." you need scripting.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">TorchScript = compile a model into a portable IR. The sklearn analog is using a Pipeline as a single callable that you can pickle and ship.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import time
import joblib, io

pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=500)),
    ('clf', LogisticRegression(max_iter=200)),
])
pipe.fit(df_reviews['review'], df_reviews['label'])

# Treat the whole pipeline as a callable: this is what torch.jit.trace freezes
samples = df_reviews['review'].iloc[:50].tolist()

# Time 'compiled' single-shot forward
t0 = time.time()
for _ in range(20):
    pipe.predict(samples)
print(f'pipeline (trace-equivalent) inference: {(time.time()-t0)*1000:.2f} ms')

# Serializable
buf = io.BytesIO()
joblib.dump(pipe, buf)
print(f'serialized pipeline: {len(buf.getvalue())} bytes (portable across processes)')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Tracing runs the model on an example input and records the sequence of tensor ops. The result is a TorchScript module that runs the same graph; saving produces a single binary loadable from C++ via libtorch. The traced graph generalizes over batch size but freezes anything that branches on shape. 2) Scripting parses the Python source of the module. Loops, ifs, type-annotated arguments are all captured. The trade-off: only a subset of Python compiles; you may hit unsupported features (closures, complex dicts, dynamic types). 3) Mixed approach is common: trace the parts that are pure tensor ops, script the parts with dynamic control flow, then assemble. 4) The classic tracing gotcha: <code>if x.shape[0] &gt; 1</code> -- tracing records whichever branch fired on the example input and bakes that decision in. Inputs that go down the other branch will silently produce wrong results. Always use <code>torch.jit.script</code> when control flow depends on data.</p>

<div class="l-note"><strong>Verifying conversion:</strong> always run a parity check after tracing or scripting -- compare original PyTorch outputs to TorchScript outputs on a few held-out inputs and assert <code>torch.allclose(a, b, atol=1e-5)</code>. This catches silent breaks where tracing froze the wrong shape.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ONNX Export: Cross-Framework Deployment</h2>

<p class="l-text">ONNX (Open Neural Network Exchange) is a portable computation graph format. Export from PyTorch and run in ONNX Runtime, TensorRT, OpenVINO, or any other ONNX-compatible engine. Common reason: deploy to a serving stack that is not PyTorch.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">Net</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(<span class="num">30000</span>, <span class="num">128</span>)
        self.fc = nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">2</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        <span class="kw">return</span> self.<span class="fn">fc</span>(self.<span class="fn">embed</span>(ids).<span class="fn">mean</span>(dim=<span class="num">1</span>))

m = <span class="fn">Net</span>().<span class="fn">eval</span>()

<span class="cm"># 1) Export to ONNX</span>
example_ids = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">30000</span>, (<span class="num">1</span>, <span class="num">64</span>))   <span class="cm"># (B, T) input</span>

torch.onnx.<span class="fn">export</span>(
    m,
    args=(example_ids,),
    f=<span class="str">"model.onnx"</span>,
    input_names=[<span class="str">"input_ids"</span>],
    output_names=[<span class="str">"logits"</span>],
    dynamic_axes={
        <span class="str">"input_ids"</span>: {<span class="num">0</span>: <span class="str">"batch"</span>, <span class="num">1</span>: <span class="str">"seq"</span>},
        <span class="str">"logits"</span>: {<span class="num">0</span>: <span class="str">"batch"</span>},
    },
    opset_version=<span class="num">17</span>,
)

<span class="cm"># 2) Verify the ONNX model is valid</span>
<span class="cm"># pip install onnx onnxruntime</span>
<span class="kw">import</span> onnx
onnx_model = onnx.<span class="fn">load</span>(<span class="str">"model.onnx"</span>)
onnx.checker.<span class="fn">check_model</span>(onnx_model)

<span class="cm"># 3) Run inference with ONNX Runtime</span>
<span class="kw">import</span> onnxruntime <span class="kw">as</span> ort
<span class="kw">import</span> numpy <span class="kw">as</span> np

sess = ort.<span class="fn">InferenceSession</span>(<span class="str">"model.onnx"</span>, providers=[<span class="str">"CPUExecutionProvider"</span>])
inp = example_ids.<span class="fn">numpy</span>()
out = sess.<span class="fn">run</span>([<span class="str">"logits"</span>], {<span class="str">"input_ids"</span>: inp})[<span class="num">0</span>]
<span class="fn">print</span>(out.shape)                <span class="cm"># (1, 2)</span>

<span class="cm"># 4) Parity check vs PyTorch</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    py_out = <span class="fn">m</span>(example_ids).<span class="fn">numpy</span>()
np.testing.<span class="fn">assert_allclose</span>(py_out, out, atol=<span class="num">1e-5</span>)
<span class="fn">print</span>(<span class="str">"ONNX matches PyTorch"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">ONNX = open neural net format. sklearn supports skl2onnx; here we just demonstrate the concept by separating the pipeline into a 'feature extractor' graph and a 'classifier' graph that could each be exported.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Two stages -- in ONNX you would convert each into its own graph node
vec = TfidfVectorizer(max_features=200).fit(df_reviews['review'])
clf = LogisticRegression(max_iter=200).fit(vec.transform(df_reviews['review']), df_reviews['label'])

print('graph node 1 (TfidfVectorizer):')
print('  input  : list[str]')
print('  output : sparse matrix shape (n, %d)' % vec.transform(['hi']).shape[1])
print('graph node 2 (LogisticRegression):')
print('  input  : sparse matrix shape (n, %d)' % clf.coef_.shape[1])
print('  output : labels (n,)')

# Show a single forward pass through both 'nodes'
sample = ['this movie was amazing']
features = vec.transform(sample)
pred = clf.predict(features)
print(f'sample: {sample[0]!r}  ->  pred {pred[0]}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>torch.onnx.export</code> runs the model on the example input (a tracing-style export) and writes the graph and weights to an <code>.onnx</code> file. <code>dynamic_axes</code> tells ONNX which dimensions vary at inference time -- without this, batch and sequence dims get frozen to the example shape. 2) <code>onnx.checker.check_model</code> validates the graph -- catches malformed ops, shape mismatches, unsupported operators in the chosen opset. 3) ONNX Runtime is a fast cross-platform engine. <code>InferenceSession</code> loads the model; <code>sess.run</code> takes a numpy dict and returns numpy outputs. The CPU provider works everywhere; GPU and TensorRT providers give massive speedups when available. 4) The crucial parity check: same input through PyTorch and ONNX should agree to ~1e-5. If it does not, your <code>dynamic_axes</code> are wrong, your example input was unrepresentative, or your model uses an op the chosen opset does not support.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: ONNX Runtime vs PyTorch on CPU</div><div class="example-body">For a BERT-base sentiment classifier serving 128-token sequences, PyTorch CPU inference clocks around 80ms/sample. The same model exported to ONNX and run via ONNX Runtime with the CPU provider clocks around 35ms/sample -- a 2.3x speedup with no accuracy change. Adding ONNX Runtime's "graph optimization level=ALL" (kernel fusion, constant folding) shaves another 5-10%. This is one of the cheapest perf wins in production NLP.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Mixed Precision Training</h2>

<p class="l-text">Modern GPUs (Volta and newer) compute fp16 ops 8-16x faster than fp32 and use half the memory. Automatic mixed precision (AMP) keeps numerically sensitive ops in fp32 and runs the rest in fp16, giving you most of the speedup with no accuracy loss.</p>

<div class="katex-block">$$\\text{loss}_{\\text{fp16}} \\;\\xrightarrow{\\text{cast}}\\; \\text{loss}_{\\text{fp32}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">fp16</div><div class="card-body">16-bit float. Range about 6e-5 to 65k. Fast, low memory, can underflow.</div></div>
<div class="calc-card"><div class="card-title">bf16</div><div class="card-body">Brain float 16. Same range as fp32 but only 7 mantissa bits. Better for training stability.</div></div>
<div class="calc-card"><div class="card-title">autocast</div><div class="card-body">Context manager that picks fp16/bf16 for safe ops, fp32 for sensitive ones.</div></div>
<div class="calc-card"><div class="card-title">GradScaler</div><div class="card-body">Scales loss up to keep tiny gradients above the fp16 underflow threshold; un-scales before the optimizer step.</div></div>
<div class="calc-card"><div class="card-title">When to use</div><div class="card-body">Always for transformer training on V100/A100/H100. 2-3x throughput gain.</div></div>
<div class="calc-card"><div class="card-title">Inference</div><div class="card-body">fp16 inference is even simpler -- model.half() or autocast without GradScaler.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

device = torch.<span class="fn">device</span>(<span class="str">"cuda"</span>)
model = nn.<span class="fn">Linear</span>(<span class="num">1024</span>, <span class="num">1024</span>).<span class="fn">to</span>(device)
optimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="cm"># 1) AMP training loop with GradScaler (fp16 path)</span>
scaler = torch.cuda.amp.<span class="fn">GradScaler</span>()

x = torch.<span class="fn">randn</span>(<span class="num">64</span>, <span class="num">1024</span>, device=device)
y = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">1024</span>, (<span class="num">64</span>,), device=device)

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    optimizer.<span class="fn">zero_grad</span>()
    <span class="cm"># forward + loss in autocast region</span>
    <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=torch.float16):
        logits = <span class="fn">model</span>(x)
        loss = <span class="fn">loss_fn</span>(logits, y)
    <span class="cm"># scale loss to keep gradients in fp16 range</span>
    scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()
    <span class="cm"># un-scale and step</span>
    scaler.<span class="fn">unscale_</span>(optimizer)
    torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
    scaler.<span class="fn">step</span>(optimizer)
    scaler.<span class="fn">update</span>()
    <span class="fn">print</span>(f<span class="str">"step {step}: loss={loss.item():.4f}"</span>)

<span class="cm"># 2) bf16 (no GradScaler needed -- bf16 has fp32 range)</span>
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    optimizer.<span class="fn">zero_grad</span>()
    <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=torch.bfloat16):
        logits = <span class="fn">model</span>(x)
        loss = <span class="fn">loss_fn</span>(logits, y)
    loss.<span class="fn">backward</span>()
    optimizer.<span class="fn">step</span>()

<span class="cm"># 3) fp16 inference</span>
<span class="at">@torch.inference_mode</span>()
<span class="kw">def</span> <span class="fn">predict</span>(model, x):
    <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=torch.float16):
        <span class="kw">return</span> <span class="fn">model</span>(x)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mixed precision = compute in float16 for speed, keep weights in float32 for stability. We compare numerical error of float16 vs float32 matmul.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
A = rng.standard_normal((256, 256))
B = rng.standard_normal((256, 256))

C32 = (A.astype(np.float32) @ B.astype(np.float32))
C16 = (A.astype(np.float16) @ B.astype(np.float16)).astype(np.float32)

err = np.abs(C32 - C16)
print(f'float32 result mean   : {C32.mean():+.4e}')
print(f'float16 result mean   : {C16.mean():+.4e}')
print(f'max  abs error        : {err.max():.4e}')
print(f'mean abs error        : {err.mean():.4e}')
print('memory: float16 uses 50% of float32 -> bigger batches fit on GPU.')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Inside <code>autocast(dtype=torch.float16)</code>, PyTorch automatically picks fp16 for matmul/conv (where it is safe) and keeps fp32 for ops like reductions and softmax. <code>GradScaler.scale(loss)</code> multiplies the loss by a large constant so that the resulting fp16 gradients do not underflow to zero. After backward we <code>unscale_</code> the gradients before clipping and stepping. <code>scaler.update()</code> adapts the scale dynamically: if it sees inf/NaN, it lowers the scale and skips the step. 2) bf16 has the same dynamic range as fp32, so gradients never underflow -- you do not need a GradScaler. bf16 is the modern default on A100/H100/TPUs. 3) For inference you only need autocast; no GradScaler, no backward. <code>@torch.inference_mode()</code> further skips autograd bookkeeping.</p>

<div class="l-warn"><strong>The mixed precision casting trick:</strong> the compute happens in fp16, but the loss accumulation, the optimizer state (Adam's moments), and the master weights stay in fp32. This is the magic that gives you the speed of fp16 with the stability of fp32 -- if you naively cast everything to fp16, training diverges within a few hundred steps.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Quantization: int8 for Smaller, Faster Inference</h2>

<p class="l-text">Quantization replaces fp32 weights with int8. Result: 4x smaller models, 2-4x faster CPU inference, with usually less than 1 percentage point accuracy loss.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Dynamic quantization</div><div class="compare-item">Quantize weights to int8 ahead of time</div><div class="compare-item">Activations quantized on the fly</div><div class="compare-item">One line of code</div><div class="compare-item">Best for transformers, RNNs</div></div>
<div class="compare-col"><div class="compare-title">Static quantization</div><div class="compare-item">Quantize weights AND activations</div><div class="compare-item">Calibrate on a sample dataset</div><div class="compare-item">Faster than dynamic, more setup</div><div class="compare-item">Best for CNNs</div></div>
<div class="compare-col"><div class="compare-title">QAT (quant-aware training)</div><div class="compare-item">Simulate int8 during training</div><div class="compare-item">Best accuracy retention</div><div class="compare-item">Most setup</div><div class="compare-item">Use when post-training quant loses too much</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TinyTransformer</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(<span class="num">30000</span>, <span class="num">128</span>)
        self.fc1 = nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">256</span>)
        self.fc2 = nn.<span class="fn">Linear</span>(<span class="num">256</span>, <span class="num">2</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        x = self.<span class="fn">embed</span>(ids).<span class="fn">mean</span>(dim=<span class="num">1</span>)
        <span class="kw">return</span> self.<span class="fn">fc2</span>(torch.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x)))

model = <span class="fn">TinyTransformer</span>().<span class="fn">eval</span>()

<span class="cm"># 1) Dynamic quantization -- one line</span>
quantized = torch.quantization.<span class="fn">quantize_dynamic</span>(
    model,
    {nn.Linear},          <span class="cm"># only quantize Linear layers</span>
    dtype=torch.qint8
)

<span class="cm"># 2) Compare sizes</span>
<span class="kw">def</span> <span class="fn">model_size</span>(m):
    torch.<span class="fn">save</span>(m.<span class="fn">state_dict</span>(), <span class="str">"/tmp/_tmp.pt"</span>)
    <span class="kw">import</span> os
    <span class="kw">return</span> os.path.<span class="fn">getsize</span>(<span class="str">"/tmp/_tmp.pt"</span>) / <span class="num">1024</span>  <span class="cm"># KB</span>

<span class="fn">print</span>(f<span class="str">"fp32 size: {model_size(model):.1f} KB"</span>)
<span class="fn">print</span>(f<span class="str">"int8 size: {model_size(quantized):.1f} KB"</span>)
<span class="cm"># typically about 4x smaller</span>

<span class="cm"># 3) Verify outputs are similar</span>
x = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">30000</span>, (<span class="num">4</span>, <span class="num">32</span>))
<span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
    fp32_out = <span class="fn">model</span>(x)
    int8_out = <span class="fn">quantized</span>(x)
<span class="fn">print</span>((fp32_out - int8_out).<span class="fn">abs</span>().<span class="fn">max</span>().<span class="fn">item</span>())
<span class="cm"># typically &lt; 0.1 -- effectively identical predictions</span>

<span class="cm"># 4) Latency comparison (CPU)</span>
<span class="kw">import</span> time
<span class="kw">def</span> <span class="fn">bench</span>(m, x, n=<span class="num">100</span>):
    <span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):    <span class="cm"># warmup</span>
            <span class="fn">m</span>(x)
        t0 = time.<span class="fn">time</span>()
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n):
            <span class="fn">m</span>(x)
        <span class="kw">return</span> (time.<span class="fn">time</span>() - t0) / n * <span class="num">1000</span>  <span class="cm"># ms</span>

<span class="cm"># print(f"fp32: {bench(model, x):.2f} ms")</span>
<span class="cm"># print(f"int8: {bench(quantized, x):.2f} ms")</span>
<span class="cm"># int8 is typically 1.5-3x faster on CPU for transformer-style nets</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Quantization = represent weights with 8 bits instead of 32. We quantize a numpy weight matrix to int8 and measure the reconstruction error.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
W = rng.standard_normal((128, 64)).astype(np.float32)

# Symmetric int8 quantization
scale = np.max(np.abs(W)) / 127
W_q   = np.clip(np.round(W / scale), -128, 127).astype(np.int8)
W_dq  = W_q.astype(np.float32) * scale     # dequantize

err = np.abs(W - W_dq)
print(f'fp32 size : {W.nbytes:6d} bytes')
print(f'int8 size : {W_q.nbytes + 4:6d} bytes  (weights + scale)')
print(f'compression ratio: {W.nbytes / (W_q.nbytes + 4):.2f}x')
print(f'mean reconstruction error: {err.mean():.4e}')
print(f'max  reconstruction error: {err.max():.4e}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>quantize_dynamic</code> replaces every <code>nn.Linear</code> in the model with a fused int8 linear that quantizes activations on the fly during forward. The set <code>{nn.Linear}</code> chooses which module types to quantize; some users add <code>nn.LSTM</code> or <code>nn.GRU</code>. 2) Saves both versions and reports file sizes; int8 weights take 1 byte per parameter instead of 4, giving the expected 4x compression. 3) Runs both models on the same input and reports the maximum absolute difference. For dynamic quantization on linear-heavy networks, this is typically below 0.1 in logit space -- imperceptible to the downstream argmax. 4) A latency benchmark with warmup. On CPU you typically get 1.5-3x faster inference for the same accuracy. On GPU dynamic quantization is less impactful because GPUs are not as int8-optimized; for GPU you would use TensorRT or NVIDIA's dedicated quantization tooling.</p>

<div class="l-note"><strong>For HuggingFace transformers:</strong> dynamic quantization works on most models out of the box. <code>quantize_dynamic(bert_model, {nn.Linear})</code> compresses BERT-base from ~440MB to ~110MB and accelerates CPU inference 2-3x with under 1 point F1 loss on most GLUE tasks.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Profiling with torch.profiler and timeit</h2>

<p class="l-text">Before optimizing, measure. The wrong line of code accounts for 80% of latency more often than you think.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> time
<span class="kw">from</span> torch.profiler <span class="kw">import</span> profile, record_function, ProfilerActivity

<span class="kw">class</span> <span class="fn">Net</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(<span class="num">30000</span>, <span class="num">256</span>)
        self.fc1 = nn.<span class="fn">Linear</span>(<span class="num">256</span>, <span class="num">1024</span>)
        self.fc2 = nn.<span class="fn">Linear</span>(<span class="num">1024</span>, <span class="num">2</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        x = self.<span class="fn">embed</span>(ids).<span class="fn">mean</span>(dim=<span class="num">1</span>)
        x = torch.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x))
        <span class="kw">return</span> self.<span class="fn">fc2</span>(x)

m = <span class="fn">Net</span>().<span class="fn">eval</span>()
x = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">30000</span>, (<span class="num">32</span>, <span class="num">128</span>))

<span class="cm"># 1) Quick latency: timeit-style with warmup</span>
<span class="kw">def</span> <span class="fn">bench_ms</span>(fn, n=<span class="num">100</span>, warmup=<span class="num">10</span>):
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(warmup):
        <span class="fn">fn</span>()
    t0 = time.<span class="fn">perf_counter</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n):
        <span class="fn">fn</span>()
    <span class="kw">return</span> (time.<span class="fn">perf_counter</span>() - t0) / n * <span class="num">1000</span>

<span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
    <span class="fn">print</span>(f<span class="str">"forward: {bench_ms(lambda: m(x)):.3f} ms"</span>)

<span class="cm"># 2) torch.profiler -- breakdown by op</span>
<span class="kw">with</span> <span class="fn">profile</span>(activities=[ProfilerActivity.CPU], record_shapes=<span class="kw">True</span>) <span class="kw">as</span> prof:
    <span class="kw">with</span> <span class="fn">record_function</span>(<span class="str">"model_inference"</span>):
        <span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
            <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
                <span class="fn">m</span>(x)

<span class="fn">print</span>(prof.<span class="fn">key_averages</span>().<span class="fn">table</span>(sort_by=<span class="str">"cpu_time_total"</span>, row_limit=<span class="num">10</span>))

<span class="cm"># 3) GPU profiling (when CUDA is available)</span>
<span class="cm"># with profile(activities=[ProfilerActivity.CPU, ProfilerActivity.CUDA]) as prof:</span>
<span class="cm">#     ...</span>
<span class="cm"># print(prof.key_averages().table(sort_by="cuda_time_total"))</span>

<span class="cm"># 4) Save trace for chrome://tracing visualization</span>
<span class="cm"># prof.export_chrome_trace("trace.json")</span>

<span class="cm"># 5) Always benchmark: tokenizer, dataloader, model, post-processing</span>
<span class="cm"># In production NLP, tokenization is often 30-50% of total latency.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Profiling: use time.perf_counter to compare cost of three operations -- exactly what torch.profiler does, just with finer-grained kernels.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import time
import numpy as np

rng = np.random.default_rng(0)
A = rng.standard_normal((512, 512))
B = rng.standard_normal((512, 512))

ops = {
    'matmul       ': lambda: A @ B,
    'elementwise +': lambda: A + B,
    'svd (small)  ': lambda: np.linalg.svd(A[:64, :64]),
}

print(f'{"op":15s}  iters     ms_total   ms_per_iter')
for name, fn in ops.items():
    t0 = time.perf_counter()
    n = 20
    for _ in range(n):
        fn()
    dt = (time.perf_counter() - t0) * 1000
    print(f'{name}    {n:3d}  {dt:8.2f}    {dt/n:8.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The minimal <code>bench_ms</code> helper: warmup runs to skip JIT/CUDA-context startup, then time N runs and report average milliseconds. Always include warmup -- without it your first measurement includes one-time setup cost. 2) <code>torch.profiler</code> records per-op CPU time over a region marked with <code>record_function</code>. The table shows which ops dominate: typically matmul, GEMM, embedding lookup, softmax. 3) On GPU, add <code>ProfilerActivity.CUDA</code> to capture kernel times. The CPU and CUDA timelines together reveal whether you are GPU-bound or stalling on host work. 4) <code>export_chrome_trace</code> writes a JSON file you can drag into <code>chrome://tracing</code> for a flame-graph view of every op. Indispensable for chasing weird stalls. 5) The hard-won production lesson: always profile end-to-end, not just the model. NLP pipelines often spend more time in Python tokenization than in the GPU forward pass.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Latency Benchmark: PyTorch vs Optimized</h2>

<div id="plot-pl11-bench-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Per-sample inference latency in milliseconds for a BERT-base sentiment classifier on a single CPU core, across five deployment configurations: vanilla PyTorch fp32, PyTorch with TorchScript JIT, ONNX Runtime fp32, dynamic int8 quantization via PyTorch, and ONNX Runtime int8. Each step roughly halves the latency. The same model -- only the deployment stack changes. <strong>Why it matters for NLP:</strong> a real-time sentiment API at 80ms per request is a poor user experience; at 10ms it disappears into the page-load time. Most teams ship the leftmost bar and accept the latency, but every step right is a few hours of engineering for permanent throughput gains.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Sketch of how to produce the bars above</span>
<span class="kw">import</span> torch
<span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForSequenceClassification, AutoTokenizer

ckpt = <span class="str">"bert-base-uncased"</span>
tok = AutoTokenizer.<span class="fn">from_pretrained</span>(ckpt)
model = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(ckpt, num_labels=<span class="num">2</span>).<span class="fn">eval</span>()
text = <span class="str">"This movie was absolutely fantastic."</span> * <span class="num">4</span>
enc = <span class="fn">tok</span>(text, return_tensors=<span class="str">"pt"</span>, truncation=<span class="kw">True</span>, max_length=<span class="num">128</span>)

<span class="cm"># Benchmark configurations:</span>
<span class="cm"># 1) raw PyTorch fp32 -- baseline</span>
<span class="cm"># 2) torch.jit.trace(model, ...) -- TorchScript JIT</span>
<span class="cm"># 3) torch.onnx.export -&gt; onnxruntime.InferenceSession -- ORT fp32</span>
<span class="cm"># 4) torch.quantization.quantize_dynamic(model, {nn.Linear})  -- PyTorch int8</span>
<span class="cm"># 5) export quantized to ONNX, run via ORT -- ORT int8</span>

<span class="cm"># Each measurement: 100 iterations, mean ms with warmup of 10</span>
<span class="cm"># Numbers in the chart are typical CPU values; your hardware will vary.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Latency benchmark: compare a 'naive' pure-Python loop to a vectorized NumPy version on the same task -- analog of PyTorch eager vs optimized.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import time
import numpy as np

rng = np.random.default_rng(0)
n = 5000
a = rng.standard_normal(n)
b = rng.standard_normal(n)

# Naive Python
t0 = time.perf_counter()
out_py = []
for i in range(n):
    out_py.append(a[i] * b[i] + (a[i] - b[i]) ** 2)
py_ms = (time.perf_counter() - t0) * 1000

# Vectorized
t0 = time.perf_counter()
out_np = a * b + (a - b) ** 2
np_ms = (time.perf_counter() - t0) * 1000

print(f'naive python : {py_ms:8.2f} ms')
print(f'vectorized   : {np_ms:8.4f} ms')
print(f'speedup      : {py_ms / np_ms:8.1f}x')
print('all-equal:', np.allclose(out_py, out_np))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads BERT-base for sentiment, makes a representative input. 2) Sketches the five configurations to benchmark. The pattern is always: convert / export the model, run a warmup loop, then time 100 inference calls and report the mean. 3) The chart shows what you can expect; absolute numbers depend on your CPU, but the relative ratios (each step ~2x) are stable. The takeaway: production-grade NLP inference is rarely about model size; it is about the deployment stack you choose around the same weights.</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Save <code>state_dict</code>, not the full model object; include a config dict to re-instantiate the architecture.<br><strong>2.</strong> Always call <code>model.eval()</code> + <code>torch.inference_mode()</code> for inference. Forgetting either is a silent accuracy bug.<br><strong>3.</strong> TorchScript: trace for fixed control flow, script for loops/branches; always parity-check after conversion.<br><strong>4.</strong> ONNX export with <code>dynamic_axes</code> gives you cross-framework portability and 2-3x CPU speedup via ONNX Runtime.<br><strong>5.</strong> Mixed precision (fp16 with GradScaler, bf16 without) gives 2-3x training throughput at minimal accuracy cost.<br><strong>6.</strong> Dynamic int8 quantization compresses transformers 4x and accelerates CPU inference 2-3x with negligible accuracy loss.<br><strong>7.</strong> Profile before optimizing. Tokenization, post-processing, and dataloader stalls often dominate; the model itself may be 30% of latency, not 95%.<br><strong>8.</strong> Next lesson: end-to-end NLP project -- IMDB sentiment from raw text to a deployed inference function, applying everything from L1 to L11.</div></div>
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
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:60,r:30,b:80,l:80}};

  function benchPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var labels = lang==='tr'
      ? ['PyTorch fp32', 'TorchScript', 'ONNX fp32', 'PyTorch int8', 'ONNX int8']
      : ['PyTorch fp32', 'TorchScript', 'ONNX fp32', 'PyTorch int8', 'ONNX int8'];
    var values = [82, 65, 38, 24, 13];
    var colors = ['#f87171','#fbbf24','#4ecdc4','#a78bfa', T.accent];
    var data = [{
      type:'bar', x:labels, y:values,
      marker:{color: colors, line:{color:'rgba(255,255,255,0.2)', width:1}},
      text: values.map(function(v){return v + ' ms';}),
      textposition: 'outside',
      textfont:{color:T.text}
    }];
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'BERT-base Cikarim Latencysi (CPU, ornek/ms)':'BERT-base Inference Latency (CPU, ms/sample)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'dagitim yapilandirmasi':'deployment configuration', tickfont:{color:T.text}},
      yaxis:{title:lang==='tr'?'latency (ms)':'latency (ms)', gridcolor:T.grid, zerolinecolor:T.zero},
      height: 440
    });
    Plotly.newPlot(id, data, layout, {responsive:true, displayModeBar:false});
  }

  benchPlot('plot-pl11-bench-en','en');
  benchPlot('plot-pl11-bench-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Eğitim işin %10'u; dağıtım %90'ı.</strong> Bir model iyi validasyon metrikleri aldığında gerçek mühendislik başlar: ağırlıkları serileştirmek, çıkarım moduna geçmek, dağıtım dostu bir formata aktarmak, bellek ve gecikmeyi sıkıştırmak ve her adımın tahminleri sessizce değiştirmediğini doğrulamak. Üretimde gönderdiğiniz her NLP sistemi bu ilkellerin üstünde oturur -- 200ms gecikme ile 20ms gecikme arasındaki fark bir model yeniden yazımı değildir, doğru <code>.eval()</code>, <code>no_grad</code>, karışık hassasiyet ve niceleme kombinasyonudur.</p>

<p class="l-text">Bu derste tam PyTorch üretim yığınını kapsıyoruz: <code>torch.save</code> kalıpları, eval/no-grad modu, TorchScript tracing ve scripting, ONNX dışa aktarma, otomatik karışık hassasiyet, dinamik ve statik niceleme ve <code>torch.profiler</code> ile profilleme. Her bölüm, detayı atlarsanız sizi üretimde ısıran tuzakla biter.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Modelleri <code>state_dict</code> ve <code>load_state_dict</code> ile taşınabilir biçimde kaydetmeyi/yüklemeyi</li>
<li>Inference'ı <code>model.eval()</code> ve <code>torch.no_grad()</code> sarmalayıcılarıyla doğru çalıştırmayı</li>
<li>Modelleri <code>torch.jit.trace</code> ve <code>torch.jit.script</code> ile TorchScript'e dışa aktarmayı</li>
<li>Bir PyTorch modelini ONNX'e dönüştürmeyi ve çıktıların runtime'lar arasında eşleştiğini doğrulamayı</li>
<li>Eğitimi <code>torch.cuda.amp.autocast</code> ve <code>GradScaler</code> ile karışık hassasiyetle hızlandırmayı</li>
<li>Dinamik ve statik niceleme (int8) uygulamayı ve gecikmeyi <code>torch.profiler</code> ile ölçmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Kaydetme ve Yükleme: state_dict vs Tam Model</h2>

<p class="l-text">Bir modeli kaydetmenin iki yolu vardır. Biri taşınabilir, geleceğe dayanıklı ve önerilir. Diğeri kırılgan ve kodunuz yeniden düzenlendiğinde kırılır. Doğru olanı seçin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">state_dict (önerilen)</div><div class="card-body">Parametre adlarını tensor'lara eşleyen Python sözlüğü. Yalnızca ağırlıklar. Pickle'lanmış.</div></div>
<div class="calc-card"><div class="card-title">torch.save(model)</div><div class="card-body">Sınıfı dahil tüm model nesnesini pickle'lar. Kırılgan: tam kod yolunu gerektirir.</div></div>
<div class="calc-card"><div class="card-title">En iyi uygulama</div><div class="card-body">state_dict + mimariyi tanımlayan küçük bir config sözlüğü kaydet.</div></div>
<div class="calc-card"><div class="card-title">Optimizer durumu</div><div class="card-body">Daha sonra eğitime devam etmek istiyorsanız onun state_dict'ini de kaydedin.</div></div>
<div class="calc-card"><div class="card-title">Sürümleme</div><div class="card-body">Kontrol noktası sözlüğüne PyTorch sürümünü, model arch hash'ini, eğitim adımını dahil edin.</div></div>
<div class="calc-card"><div class="card-title">map_location</div><div class="card-body">Yüklerken her zaman ayarlayın: GPU vs CPU uyumsuzluğunu önler.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TextClassifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size=<span class="num">30000</span>, d_model=<span class="num">128</span>, num_classes=<span class="num">2</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(vocab_size, d_model)
        self.fc = nn.<span class="fn">Linear</span>(d_model, num_classes)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        <span class="kw">return</span> self.<span class="fn">fc</span>(self.<span class="fn">embed</span>(ids).<span class="fn">mean</span>(dim=<span class="num">1</span>))

model = <span class="fn">TextClassifier</span>()
optimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)

<span class="cm"># 1) Yalnizca state_dict kaydet -- onerilen kalip</span>
torch.<span class="fn">save</span>(model.<span class="fn">state_dict</span>(), <span class="str">"model.pt"</span>)

<span class="cm"># 2) Tum egitim durumunu kaydet (devam ettirilebilir)</span>
torch.<span class="fn">save</span>({
    <span class="str">"epoch"</span>: <span class="num">5</span>,
    <span class="str">"model_state"</span>: model.<span class="fn">state_dict</span>(),
    <span class="str">"optimizer_state"</span>: optimizer.<span class="fn">state_dict</span>(),
    <span class="str">"config"</span>: {<span class="str">"vocab_size"</span>: <span class="num">30000</span>, <span class="str">"d_model"</span>: <span class="num">128</span>, <span class="str">"num_classes"</span>: <span class="num">2</span>},
    <span class="str">"torch_version"</span>: torch.__version__,
}, <span class="str">"checkpoint.pt"</span>)

<span class="cm"># 3) Yukle: once mimariyi olustur, sonra agirliklari yukle</span>
model2 = <span class="fn">TextClassifier</span>(vocab_size=<span class="num">30000</span>, d_model=<span class="num">128</span>, num_classes=<span class="num">2</span>)
state = torch.<span class="fn">load</span>(<span class="str">"model.pt"</span>, map_location=<span class="str">"cpu"</span>)
model2.<span class="fn">load_state_dict</span>(state)
model2.<span class="fn">eval</span>()

<span class="cm"># 4) Egitime devam et</span>
ckpt = torch.<span class="fn">load</span>(<span class="str">"checkpoint.pt"</span>, map_location=<span class="str">"cpu"</span>)
model3 = <span class="fn">TextClassifier</span>(**ckpt[<span class="str">"config"</span>])
model3.<span class="fn">load_state_dict</span>(ckpt[<span class="str">"model_state"</span>])
opt3 = torch.optim.<span class="fn">AdamW</span>(model3.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)
opt3.<span class="fn">load_state_dict</span>(ckpt[<span class="str">"optimizer_state"</span>])
start_epoch = ckpt[<span class="str">"epoch"</span>] + <span class="num">1</span>
<span class="fn">print</span>(f<span class="str">"epoch {start_epoch}'tan devam ediliyor"</span>)

<span class="cm"># 5) strict=False eksik/fazla anahtarlara izin verir</span>
model2.<span class="fn">load_state_dict</span>(state, strict=<span class="kw">False</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Kaydet & yükle: fit edilmiş sklearn modelinin pickle / joblib'i torch.save(state_dict)'in analoğudur. Sınıflandırıcıyı byte'lara dönüştür.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import io
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=300)),
    ('clf', LogisticRegression(max_iter=200)),
])
pipe.fit(df_reviews['review'], df_reviews['label'])

# Save to in-memory buffer (analog of torch.save)
buf = io.BytesIO()
joblib.dump(pipe, buf)
print('serialized size  :', len(buf.getvalue()), 'bytes')

# Load back (analog of torch.load + load_state_dict)
buf.seek(0)
restored = joblib.load(buf)
sample   = df_reviews['review'].iloc[:3].tolist()
print('restored predictions:', restored.predict(sample).tolist())
print('original predictions:', pipe.predict(sample).tolist())</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>torch.save(model.state_dict(), path)</code> yalnızca parametre ve buffer tensor'larını <code>"embed.weight"</code> gibi noktalı isimlerle anahtarlanmış olarak kaydeder. Bu taşınabilirdir: mimariyi yeniden örneklendirebildiğiniz sürece bu ağırlıkları yükleyebilirsiniz. 2) Tam eğitim durumu için bir kontrol noktası sözlüğü kaydederiz: model, optimizer, epoch, config, kütüphane sürümü. Config tahmin etmeden doğru mimariyi yeniden örneklendirmemize izin verir. 3) Yükleme: mimari uyumlu bir model oluşturun, sonra <code>load_state_dict</code> çağırın. <code>map_location="cpu"</code> hiç GPU yoksa bile GPU'da eğitilmiş bir kontrol noktasını yükleyebilmemizi sağlar. 4) Eğitime devam: durum sözlüklerinden hem modeli HEM optimizer'ı yeniden inşa edin, sonra <code>epoch + 1</code>'den devam edin. 5) <code>strict=False</code> eşleşmeyen anahtarları tolere eder -- farklı bir omurga üstünde başlık ince ayar yaparken veya bir mimariyi göç ettirirken kullanışlıdır; her zaman incelemeniz gereken eksik/beklenmeyen anahtarların listesini alırsınız.</p>

<div class="l-warn"><strong>Tam modeli <code>torch.save(model, path)</code> ile KAYDETMEYİN.</strong> Sınıf tanımını pickle'lar. Bir Python dosyasını yeniden adlandırırsanız, bir sınıfı farklı bir modüle taşırsanız veya PyTorch'u pickle uyumluluğunu bozacak şekilde yükseltirseniz, yükleme başarısız olur. <code>state_dict</code> kalıbı tüm bunlara karşı bağışıktır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. eval() ve no_grad: Çıkarım Anahtarları</h2>

<p class="l-text">İki anahtar PyTorch modelinin eğitim ile çıkarım arasındaki davranışını değiştirir. Birini unutmak NLP'de en yaygın üretim hatalarından biridir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">Net</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc = nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">5</span>)
        self.bn = nn.<span class="fn">BatchNorm1d</span>(<span class="num">5</span>)
        self.drop = nn.<span class="fn">Dropout</span>(<span class="num">0.5</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">drop</span>(self.<span class="fn">bn</span>(self.<span class="fn">fc</span>(x)))

m = <span class="fn">Net</span>()

<span class="cm"># 1) Egitim modu (varsayilan)</span>
m.<span class="fn">train</span>()
x = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">10</span>)
out_train = <span class="fn">m</span>(x)
<span class="fn">print</span>(<span class="str">"egitim:"</span>, out_train.<span class="fn">std</span>().<span class="fn">item</span>())

<span class="cm"># 2) Eval modu -- dropout devre disi, batchnorm calisma istatistikleri</span>
m.<span class="fn">eval</span>()
out_eval = <span class="fn">m</span>(x)
<span class="fn">print</span>(<span class="str">"eval:"</span>, out_eval.<span class="fn">std</span>().<span class="fn">item</span>())

<span class="cm"># 3) torch.no_grad() -- autograd grafini devre disi birakir</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">m</span>(x)

<span class="cm"># 4) inference_mode -- no_grad'dan bile hizli</span>
<span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
    out = <span class="fn">m</span>(x)

<span class="cm"># 5) Standart uretim cikarim tarifi</span>
<span class="kw">def</span> <span class="fn">predict</span>(model, x):
    model.<span class="fn">eval</span>()
    <span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
        <span class="kw">return</span> <span class="fn">model</span>(x)

<span class="cm"># 6) Klasik hata: dropout/batchnorm olan bir modelde .eval() unutmak</span>
<span class="cm"># Belirti: tahminler gurultuludur veya batchnorm farkli sonuc verir</span>
<span class="cm"># Cozum: cikarimdan once HER ZAMAN .eval() cagirin.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">sklearn'de eval() + no_grad analogları: fit edilmiş model sadece predict() çağırır, hiç gradyan hesabı yok. Gradyan-takipli yaklaşıma göre hızlanmayı ölçüyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import time
import numpy as np
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(0)
X = rng.standard_normal((2000, 64))
y = (X[:, 0] + X[:, 1] > 0).astype(int)

clf = LogisticRegression(max_iter=200).fit(X, y)

# Inference (analog of model.eval()+no_grad)
t0 = time.time()
for _ in range(50):
    preds = clf.predict(X)
inf_ms = (time.time() - t0) * 1000

# Re-fitting (analog of training, with grads)
t0 = time.time()
LogisticRegression(max_iter=200).fit(X, y)
fit_ms = (time.time() - t0) * 1000

print(f'inference x50 : {inf_ms:7.2f} ms')
print(f'one fit       : {fit_ms:7.2f} ms')
print('eval/no_grad mode in torch removes the grad bookkeeping, just like predict() vs fit() here.')</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>model.train()</code> eğitim zamanı davranışını açar: Dropout gerçekten birimleri düşürür, BatchNorm batch istatistikleri kullanır. 2) <code>model.eval()</code> onu kapatır: Dropout özdeşlik olur, BatchNorm eğitim sırasında biriken running ortalama/varyansı kullanır. Çıktı artık girdi verildiğinde deterministiktir. 3) <code>torch.no_grad()</code> hiçbir autograd grafının inşa edilmediği bir bloğu sarar. Tensor'lar onları üreten işlemleri saklamaz, bellek yarıya iner ve çıkarım önemli ölçüde hızlanır. 4) <code>torch.inference_mode()</code> <code>no_grad</code>'dan bile hızlıdır -- autograd'ı atlamaya ek olarak sürüm sayacı bookkeeping'ini de atlar. Saf çıkarım yolu için kullanın. 5) Kanonik çıkarım yardımcısı. 6) Klasik hata -- üretim NLP'sinde, <code>.eval()</code>'i unutmak test zamanında dropout'un aktivasyonların %10-20'sini rastgele sıfırlaması anlamına gelir. Tahminler deterministik olmaktan çıkar ve doğruluk 1-3 puan düşer. Çıkarım ardışık düzeninizde her zaman <code>.eval()</code>'i çağırın.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">model.eval()</div><div class="compare-item">Modül seviyesi anahtar</div><div class="compare-item">Dropout, BatchNorm vb. etkiler</div><div class="compare-item">autograd'ı devre dışı BIRAKMAZ</div><div class="compare-item">Doğruluk için gerekli</div></div>
<div class="compare-col"><div class="compare-title">torch.no_grad()</div><div class="compare-item">Bağlam yöneticisi</div><div class="compare-item">autograd grafını devre dışı bırakır</div><div class="compare-item">Çıkarımda belleği yarıya indirir</div><div class="compare-item">Performans için gerekli</div></div>
<div class="compare-col"><div class="compare-title">torch.inference_mode()</div><div class="compare-item">Bağlam yöneticisi</div><div class="compare-item">no_grad'dan daha sıkı</div><div class="compare-item">Daha da hızlı</div><div class="compare-item">Saf çıkarım için modern varsayılan</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. TorchScript: Tracing vs Scripting</h2>

<p class="l-text">TorchScript Python olmadan çalışan, serileştirilebilir Python alt kümesidir. Bir PyTorch modelini TorchScript modülüne derlersiniz ve onu C++ sunucusuna, Android telefona veya Python'un hoş karşılanmadığı herhangi bir ortama gönderirsiniz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">torch.jit.trace</div><div class="card-body">Modeli örnek girdi üzerinde çalıştır, op grafiğini kaydet. O girdideki gerçek kontrol akışını yakalar.</div></div>
<div class="calc-card"><div class="card-title">torch.jit.script</div><div class="card-body">Python kaynağını ayrıştır, if/while/for'u destekle. Dinamik kontrol akışını yakalar.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman trace</div><div class="card-body">Saf tensor ardışık düzeni, sabit kontrol akışı. Çoğu CNN, basit transformer.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman script</div><div class="card-body">Değişken uzunluklar üzerinde döngüler, koşullu dallar. RNN'ler, beam search, özel decoding.</div></div>
<div class="calc-card"><div class="card-title">.pt dosyası</div><div class="card-body">Ağırlıklar + grafikle tek bağımsız ikili. C++'tan yüklenebilir.</div></div>
<div class="calc-card"><div class="card-title">Sınırlama</div><div class="card-body">TorchScript Python'un alt kümesini destekler; bazı deyimler (closure'lı lambda, karışık tipli sözlükler) yeniden yazma gerektirir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">Classifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc1 = nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">64</span>)
        self.fc2 = nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">2</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">fc2</span>(torch.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x)))

m = <span class="fn">Classifier</span>().<span class="fn">eval</span>()

<span class="cm"># 1) TRACING</span>
example = torch.<span class="fn">randn</span>(<span class="num">1</span>, <span class="num">128</span>)
traced = torch.jit.<span class="fn">trace</span>(m, example)
<span class="fn">print</span>(traced.graph)

traced.<span class="fn">save</span>(<span class="str">"model_traced.pt"</span>)
loaded = torch.jit.<span class="fn">load</span>(<span class="str">"model_traced.pt"</span>)
<span class="fn">print</span>(<span class="fn">loaded</span>(torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">128</span>)).shape)

<span class="cm"># 2) SCRIPTING</span>
<span class="kw">class</span> <span class="fn">RnnLike</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.cell = nn.<span class="fn">Linear</span>(<span class="num">32</span>, <span class="num">32</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="cm"># x: (T, 32)  -- degisken uzunlukta dongu</span>
        h = torch.<span class="fn">zeros</span>(<span class="num">32</span>)
        <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(x.<span class="fn">size</span>(<span class="num">0</span>)):
            h = torch.<span class="fn">tanh</span>(self.<span class="fn">cell</span>(x[t]) + h)
        <span class="kw">return</span> h

scripted = torch.jit.<span class="fn">script</span>(<span class="fn">RnnLike</span>().<span class="fn">eval</span>())
out = <span class="fn">scripted</span>(torch.<span class="fn">randn</span>(<span class="num">7</span>, <span class="num">32</span>))
<span class="fn">print</span>(out.shape)

<span class="cm"># 3) Karisik: parcalari trace et, donguyu script et</span>
<span class="cm"># 4) Klasik tuzak: tracing veriye bagli sekilleri kilitler</span>
<span class="cm"># Eger forward'da "if x.shape[0] &gt; 1: ..." varsa scripting gerekir.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">TorchScript = modeli taşınabilir IR'a derle. sklearn analoğu, Pipeline'ı tek bir çağrılabilir nesne olarak kullanmaktır; pickle edip dağıtabilirsiniz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import time
import joblib, io

pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=500)),
    ('clf', LogisticRegression(max_iter=200)),
])
pipe.fit(df_reviews['review'], df_reviews['label'])

# Treat the whole pipeline as a callable: this is what torch.jit.trace freezes
samples = df_reviews['review'].iloc[:50].tolist()

# Time 'compiled' single-shot forward
t0 = time.time()
for _ in range(20):
    pipe.predict(samples)
print(f'pipeline (trace-equivalent) inference: {(time.time()-t0)*1000:.2f} ms')

# Serializable
buf = io.BytesIO()
joblib.dump(pipe, buf)
print(f'serialized pipeline: {len(buf.getvalue())} bytes (portable across processes)')</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Tracing modeli örnek bir girdide çalıştırır ve tensor op'larının dizisini kaydeder. Sonuç aynı grafiği çalıştıran bir TorchScript modülüdür; kaydetmek libtorch aracılığıyla C++'tan yüklenebilir tek bir ikili üretir. İzlenmiş grafik batch boyutu üzerinde genelleşir ama şekil üzerinde dallanan herhangi bir şeyi dondurur. 2) Scripting modülün Python kaynağını ayrıştırır. Döngüler, if'ler, tip-açıklamalı argümanlar hepsi yakalanır. Takas: yalnızca Python alt kümesi derlenir; desteklenmeyen özelliklere (closure, karmaşık sözlükler, dinamik tipler) çarpabilirsiniz. 3) Karışık yaklaşım yaygındır: saf tensor op'ları olan kısımları trace edin, dinamik kontrol akışı olan kısımları script edin, sonra birleştirin. 4) Klasik tracing tuzağı: <code>if x.shape[0] &gt; 1</code> -- tracing örnek girdide hangi dal ateşlendiyse onu kaydeder ve o kararı kalıba alır. Diğer dala giden girdiler sessizce yanlış sonuç üretir. Kontrol akışı veriye bağlı olduğunda her zaman <code>torch.jit.script</code> kullanın.</p>

<div class="l-note"><strong>Dönüşümü doğrulama:</strong> tracing veya scripting sonrası her zaman bir parite kontrolü çalıştırın -- birkaç tutulan girdide orijinal PyTorch çıktılarını TorchScript çıktılarıyla karşılaştırın ve <code>torch.allclose(a, b, atol=1e-5)</code> ile doğrulayın. Bu, tracing'in yanlış şekli dondurduğu sessiz kırılmaları yakalar.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ONNX Dışa Aktarma: Çapraz Çerçeve Dağıtımı</h2>

<p class="l-text">ONNX (Open Neural Network Exchange) taşınabilir bir hesaplama grafı formatıdır. PyTorch'tan dışa aktarın ve ONNX Runtime, TensorRT, OpenVINO veya ONNX uyumlu herhangi bir başka motorda çalıştırın. Yaygın sebep: PyTorch olmayan bir sunum yığınına dağıtmak.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">Net</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(<span class="num">30000</span>, <span class="num">128</span>)
        self.fc = nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">2</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        <span class="kw">return</span> self.<span class="fn">fc</span>(self.<span class="fn">embed</span>(ids).<span class="fn">mean</span>(dim=<span class="num">1</span>))

m = <span class="fn">Net</span>().<span class="fn">eval</span>()

<span class="cm"># 1) ONNX'e disa aktar</span>
example_ids = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">30000</span>, (<span class="num">1</span>, <span class="num">64</span>))

torch.onnx.<span class="fn">export</span>(
    m,
    args=(example_ids,),
    f=<span class="str">"model.onnx"</span>,
    input_names=[<span class="str">"input_ids"</span>],
    output_names=[<span class="str">"logits"</span>],
    dynamic_axes={
        <span class="str">"input_ids"</span>: {<span class="num">0</span>: <span class="str">"batch"</span>, <span class="num">1</span>: <span class="str">"seq"</span>},
        <span class="str">"logits"</span>: {<span class="num">0</span>: <span class="str">"batch"</span>},
    },
    opset_version=<span class="num">17</span>,
)

<span class="cm"># 2) ONNX modelin gecerli oldugunu dogrula</span>
<span class="kw">import</span> onnx
onnx_model = onnx.<span class="fn">load</span>(<span class="str">"model.onnx"</span>)
onnx.checker.<span class="fn">check_model</span>(onnx_model)

<span class="cm"># 3) ONNX Runtime ile cikarim calistir</span>
<span class="kw">import</span> onnxruntime <span class="kw">as</span> ort
<span class="kw">import</span> numpy <span class="kw">as</span> np

sess = ort.<span class="fn">InferenceSession</span>(<span class="str">"model.onnx"</span>, providers=[<span class="str">"CPUExecutionProvider"</span>])
inp = example_ids.<span class="fn">numpy</span>()
out = sess.<span class="fn">run</span>([<span class="str">"logits"</span>], {<span class="str">"input_ids"</span>: inp})[<span class="num">0</span>]
<span class="fn">print</span>(out.shape)

<span class="cm"># 4) PyTorch'a karsi parite kontrolu</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    py_out = <span class="fn">m</span>(example_ids).<span class="fn">numpy</span>()
np.testing.<span class="fn">assert_allclose</span>(py_out, out, atol=<span class="num">1e-5</span>)
<span class="fn">print</span>(<span class="str">"ONNX PyTorch ile eşleşiyor"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">ONNX = açık sinir ağı formatı. sklearn skl2onnx destekler; burada konsepti sadece boru hattını ayrı 'özellik çıkarıcı' grafiği ve 'sınıflandırıcı' grafiğine ayırarak gösteriyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Two stages -- in ONNX you would convert each into its own graph node
vec = TfidfVectorizer(max_features=200).fit(df_reviews['review'])
clf = LogisticRegression(max_iter=200).fit(vec.transform(df_reviews['review']), df_reviews['label'])

print('graph node 1 (TfidfVectorizer):')
print('  input  : list[str]')
print('  output : sparse matrix shape (n, %d)' % vec.transform(['hi']).shape[1])
print('graph node 2 (LogisticRegression):')
print('  input  : sparse matrix shape (n, %d)' % clf.coef_.shape[1])
print('  output : labels (n,)')

# Show a single forward pass through both 'nodes'
sample = ['this movie was amazing']
features = vec.transform(sample)
pred = clf.predict(features)
print(f'sample: {sample[0]!r}  ->  pred {pred[0]}')</code></pre></div>
</div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>torch.onnx.export</code> modeli örnek girdi üzerinde çalıştırır (tracing tarzı bir dışa aktarma) ve grafiği ve ağırlıkları bir <code>.onnx</code> dosyasına yazar. <code>dynamic_axes</code> ONNX'e hangi boyutların çıkarım zamanında değiştiğini söyler -- bu olmadan batch ve seq boyutları örnek şekle dondurulur. 2) <code>onnx.checker.check_model</code> grafiği doğrular -- hatalı op'ları, şekil uyumsuzluklarını, seçilen opset'te desteklenmeyen operatörleri yakalar. 3) ONNX Runtime hızlı bir çapraz platform motorudur. <code>InferenceSession</code> modeli yükler; <code>sess.run</code> bir numpy sözlüğü alır ve numpy çıktıları döner. CPU sağlayıcısı her yerde çalışır; mevcut olduğunda GPU ve TensorRT sağlayıcıları büyük hızlanmalar verir. 4) Kritik parite kontrolü: aynı girdi PyTorch ve ONNX üzerinden ~1e-5'e kadar uyuşmalıdır. Uyuşmazsa <code>dynamic_axes</code>'iniz yanlış, örnek girdiniz temsili değil veya modeliniz seçilen opset'in desteklemediği bir op kullanıyordur.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: CPU'da ONNX Runtime vs PyTorch</div><div class="example-body">128 token dizilerini sunan bir BERT-base duygu sınıflandırıcısı için, PyTorch CPU çıkarımı yaklaşık 80ms/örnek hızında çalışır. ONNX'e aktarılmış ve ONNX Runtime ile CPU sağlayıcısı üzerinden çalıştırılan aynı model yaklaşık 35ms/örnek hızında çalışır -- doğruluk değişikliği olmadan 2.3x hızlanma. ONNX Runtime'ın "graph optimization level=ALL" (kernel füzyonu, sabit katlama) özelliğini eklemek %5-10 daha tıraşlar. Bu üretim NLP'sinde en ucuz performans kazançlarından biridir.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Karışık Hassasiyet Eğitimi</h2>

<p class="l-text">Modern GPU'lar (Volta ve sonrası) fp16 op'larını fp32'den 8-16x daha hızlı hesaplar ve yarısı kadar bellek kullanır. Otomatik karışık hassasiyet (AMP) sayısal olarak hassas op'ları fp32'de tutar ve geri kalanı fp16'da çalıştırır, size hızlanmanın çoğunu doğruluk kaybı olmadan verir.</p>

<div class="katex-block">$$\\text{loss}_{\\text{fp16}} \\;\\xrightarrow{\\text{cast}}\\; \\text{loss}_{\\text{fp32}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">fp16</div><div class="card-body">16 bit float. Aralık yaklaşık 6e-5 ile 65k. Hızlı, az bellek, alt taşabilir.</div></div>
<div class="calc-card"><div class="card-title">bf16</div><div class="card-body">Brain float 16. fp32 ile aynı aralık ama yalnızca 7 mantis biti. Eğitim kararlılığı için daha iyi.</div></div>
<div class="calc-card"><div class="card-title">autocast</div><div class="card-body">Güvenli op'lar için fp16/bf16 seçen, hassaslar için fp32 seçen bağlam yöneticisi.</div></div>
<div class="calc-card"><div class="card-title">GradScaler</div><div class="card-body">Küçük gradyanları fp16 alt taşma eşiğinin üzerinde tutmak için loss'u büyütür; optimizer adımından önce küçültür.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman kullan</div><div class="card-body">V100/A100/H100 üzerinde transformer eğitimi için her zaman. 2-3x throughput kazancı.</div></div>
<div class="calc-card"><div class="card-title">Çıkarım</div><div class="card-body">fp16 çıkarımı daha basit -- model.half() veya GradScaler olmadan autocast.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

device = torch.<span class="fn">device</span>(<span class="str">"cuda"</span>)
model = nn.<span class="fn">Linear</span>(<span class="num">1024</span>, <span class="num">1024</span>).<span class="fn">to</span>(device)
optimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="cm"># 1) GradScaler ile AMP egitim dongusu (fp16 yolu)</span>
scaler = torch.cuda.amp.<span class="fn">GradScaler</span>()

x = torch.<span class="fn">randn</span>(<span class="num">64</span>, <span class="num">1024</span>, device=device)
y = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">1024</span>, (<span class="num">64</span>,), device=device)

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    optimizer.<span class="fn">zero_grad</span>()
    <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=torch.float16):
        logits = <span class="fn">model</span>(x)
        loss = <span class="fn">loss_fn</span>(logits, y)
    scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()
    scaler.<span class="fn">unscale_</span>(optimizer)
    torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
    scaler.<span class="fn">step</span>(optimizer)
    scaler.<span class="fn">update</span>()
    <span class="fn">print</span>(f<span class="str">"adim {step}: loss={loss.item():.4f}"</span>)

<span class="cm"># 2) bf16 (GradScaler gerekmez)</span>
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    optimizer.<span class="fn">zero_grad</span>()
    <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=torch.bfloat16):
        logits = <span class="fn">model</span>(x)
        loss = <span class="fn">loss_fn</span>(logits, y)
    loss.<span class="fn">backward</span>()
    optimizer.<span class="fn">step</span>()

<span class="cm"># 3) fp16 cikarim</span>
<span class="at">@torch.inference_mode</span>()
<span class="kw">def</span> <span class="fn">predict</span>(model, x):
    <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=torch.float16):
        <span class="kw">return</span> <span class="fn">model</span>(x)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mixed precision = hız için float16 hesapla, kararlılık için ağırlıkları float32'de tut. float16 vs float32 matmul'un sayısal hatasını karşılaştırıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
A = rng.standard_normal((256, 256))
B = rng.standard_normal((256, 256))

C32 = (A.astype(np.float32) @ B.astype(np.float32))
C16 = (A.astype(np.float16) @ B.astype(np.float16)).astype(np.float32)

err = np.abs(C32 - C16)
print(f'float32 result mean   : {C32.mean():+.4e}')
print(f'float16 result mean   : {C16.mean():+.4e}')
print(f'max  abs error        : {err.max():.4e}')
print(f'mean abs error        : {err.mean():.4e}')
print('memory: float16 uses 50% of float32 -> bigger batches fit on GPU.')</code></pre></div>
</div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>autocast(dtype=torch.float16)</code> içinde, PyTorch matmul/conv için (güvenli olduğu yerde) otomatik olarak fp16 seçer ve indirgemeler ile softmax gibi op'lar için fp32 tutar. <code>GradScaler.scale(loss)</code> kayıpı büyük bir sabitle çarpar, böylece sonuç fp16 gradyanları sıfıra alt taşmaz. Backward'dan sonra kırpma ve adımdan önce gradyanları <code>unscale_</code> ederiz. <code>scaler.update()</code> ölçeği dinamik olarak uyarlar: inf/NaN görürse ölçeği düşürür ve adımı atlar. 2) bf16 fp32 ile aynı dinamik aralığa sahiptir, bu yüzden gradyanlar asla alt taşmaz -- GradScaler'a ihtiyacınız yoktur. bf16 A100/H100/TPU'larda modern varsayılandır. 3) Çıkarım için yalnızca autocast'e ihtiyacınız var; GradScaler yok, backward yok. <code>@torch.inference_mode()</code> autograd bookkeeping'ini de atlar.</p>

<div class="l-warn"><strong>Karışık hassasiyet cast hilesi:</strong> hesaplama fp16'da olur, ama loss biriktirme, optimizer durumu (Adam'ın momentleri) ve master ağırlıkları fp32'de kalır. Size fp32 kararlılığıyla fp16 hızını veren sihir budur -- her şeyi naif olarak fp16'ya cast ederseniz, eğitim birkaç yüz adım içinde uçar.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Niceleme: Daha Küçük, Daha Hızlı Çıkarım için int8</h2>

<p class="l-text">Niceleme fp32 ağırlıkları int8 ile değiştirir. Sonuç: 4x daha küçük modeller, 2-4x daha hızlı CPU çıkarımı, genellikle 1 yüzde puanından az doğruluk kaybıyla.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Dinamik niceleme</div><div class="compare-item">Ağırlıkları önceden int8'e nicele</div><div class="compare-item">Aktivasyonlar anlık nicelenir</div><div class="compare-item">Tek satır kod</div><div class="compare-item">Transformer'lar, RNN'ler için en iyisi</div></div>
<div class="compare-col"><div class="compare-title">Statik niceleme</div><div class="compare-item">Ağırlıkları VE aktivasyonları nicele</div><div class="compare-item">Örnek veri kümesinde kalibre et</div><div class="compare-item">Dinamikten daha hızlı, daha fazla kurulum</div><div class="compare-item">CNN'ler için en iyisi</div></div>
<div class="compare-col"><div class="compare-title">QAT (niceleme bilinçli eğitim)</div><div class="compare-item">Eğitim sırasında int8 simüle et</div><div class="compare-item">En iyi doğruluk korunması</div><div class="compare-item">En fazla kurulum</div><div class="compare-item">Eğitim sonrası niceleme çok kaybediyorsa kullanın</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TinyTransformer</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(<span class="num">30000</span>, <span class="num">128</span>)
        self.fc1 = nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">256</span>)
        self.fc2 = nn.<span class="fn">Linear</span>(<span class="num">256</span>, <span class="num">2</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        x = self.<span class="fn">embed</span>(ids).<span class="fn">mean</span>(dim=<span class="num">1</span>)
        <span class="kw">return</span> self.<span class="fn">fc2</span>(torch.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x)))

model = <span class="fn">TinyTransformer</span>().<span class="fn">eval</span>()

<span class="cm"># 1) Dinamik niceleme -- tek satir</span>
quantized = torch.quantization.<span class="fn">quantize_dynamic</span>(
    model,
    {nn.Linear},
    dtype=torch.qint8
)

<span class="cm"># 2) Boyutlari karsilastir</span>
<span class="kw">def</span> <span class="fn">model_size</span>(m):
    torch.<span class="fn">save</span>(m.<span class="fn">state_dict</span>(), <span class="str">"/tmp/_tmp.pt"</span>)
    <span class="kw">import</span> os
    <span class="kw">return</span> os.path.<span class="fn">getsize</span>(<span class="str">"/tmp/_tmp.pt"</span>) / <span class="num">1024</span>  <span class="cm"># KB</span>

<span class="fn">print</span>(f<span class="str">"fp32 boyut: {model_size(model):.1f} KB"</span>)
<span class="fn">print</span>(f<span class="str">"int8 boyut: {model_size(quantized):.1f} KB"</span>)

<span class="cm"># 3) Ciktilari dogrula</span>
x = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">30000</span>, (<span class="num">4</span>, <span class="num">32</span>))
<span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
    fp32_out = <span class="fn">model</span>(x)
    int8_out = <span class="fn">quantized</span>(x)
<span class="fn">print</span>((fp32_out - int8_out).<span class="fn">abs</span>().<span class="fn">max</span>().<span class="fn">item</span>())

<span class="cm"># 4) Gecikme karsilastirmasi (CPU)</span>
<span class="kw">import</span> time
<span class="kw">def</span> <span class="fn">bench</span>(m, x, n=<span class="num">100</span>):
    <span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
            <span class="fn">m</span>(x)
        t0 = time.<span class="fn">time</span>()
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n):
            <span class="fn">m</span>(x)
        <span class="kw">return</span> (time.<span class="fn">time</span>() - t0) / n * <span class="num">1000</span>  <span class="cm"># ms</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Niceleme = ağırlıkları 32 bit yerine 8 bit ile temsil et. Bir numpy ağırlık matrisini int8'e niceleyip yeniden inşa hatasını ölçüyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
W = rng.standard_normal((128, 64)).astype(np.float32)

# Symmetric int8 quantization
scale = np.max(np.abs(W)) / 127
W_q   = np.clip(np.round(W / scale), -128, 127).astype(np.int8)
W_dq  = W_q.astype(np.float32) * scale     # dequantize

err = np.abs(W - W_dq)
print(f'fp32 size : {W.nbytes:6d} bytes')
print(f'int8 size : {W_q.nbytes + 4:6d} bytes  (weights + scale)')
print(f'compression ratio: {W.nbytes / (W_q.nbytes + 4):.2f}x')
print(f'mean reconstruction error: {err.mean():.4e}')
print(f'max  reconstruction error: {err.max():.4e}')</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>quantize_dynamic</code> modeldeki her <code>nn.Linear</code>'ı, forward sırasında aktivasyonları anlık olarak niceleyen kaynaşmış int8 lineer ile değiştirir. <code>{nn.Linear}</code> kümesi hangi modül türlerinin niceleneceğini seçer; bazı kullanıcılar <code>nn.LSTM</code> veya <code>nn.GRU</code> ekler. 2) Her iki sürümü kaydeder ve dosya boyutlarını raporlar; int8 ağırlıkları parametre başına 4 yerine 1 bayt alır, beklenen 4x sıkıştırmayı verir. 3) Aynı girdide her iki modeli çalıştırır ve maksimum mutlak farkı raporlar. Doğrusal yoğun ağlarda dinamik niceleme için bu, logit uzayında tipik olarak 0.1'in altındadır -- aşağı akış argmax için fark edilmez. 4) Warmup ile bir gecikme benchmark'ı. CPU'da aynı doğruluk için tipik olarak 1.5-3x daha hızlı çıkarım alırsınız. GPU'da dinamik niceleme daha az etkilidir çünkü GPU'lar int8 için o kadar optimize değildir; GPU için TensorRT veya NVIDIA'nın özel niceleme aletini kullanırsınız.</p>

<div class="l-note"><strong>HuggingFace transformer'ları için:</strong> dinamik niceleme çoğu modelde kutudan çıkar çıkmaz çalışır. <code>quantize_dynamic(bert_model, {nn.Linear})</code> BERT-base'i ~440MB'dan ~110MB'a sıkıştırır ve çoğu GLUE görevinde 1 puan altı F1 kaybıyla CPU çıkarımını 2-3x hızlandırır.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. torch.profiler ve timeit ile Profilleme</h2>

<p class="l-text">Optimize etmeden önce ölç. Yanlış kod satırı, düşündüğünüzden daha sık gecikmenin %80'ini kaplar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> time
<span class="kw">from</span> torch.profiler <span class="kw">import</span> profile, record_function, ProfilerActivity

<span class="kw">class</span> <span class="fn">Net</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(<span class="num">30000</span>, <span class="num">256</span>)
        self.fc1 = nn.<span class="fn">Linear</span>(<span class="num">256</span>, <span class="num">1024</span>)
        self.fc2 = nn.<span class="fn">Linear</span>(<span class="num">1024</span>, <span class="num">2</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        x = self.<span class="fn">embed</span>(ids).<span class="fn">mean</span>(dim=<span class="num">1</span>)
        x = torch.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x))
        <span class="kw">return</span> self.<span class="fn">fc2</span>(x)

m = <span class="fn">Net</span>().<span class="fn">eval</span>()
x = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">30000</span>, (<span class="num">32</span>, <span class="num">128</span>))

<span class="cm"># 1) Hizli gecikme: warmup ile timeit tarzi</span>
<span class="kw">def</span> <span class="fn">bench_ms</span>(fn, n=<span class="num">100</span>, warmup=<span class="num">10</span>):
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(warmup):
        <span class="fn">fn</span>()
    t0 = time.<span class="fn">perf_counter</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n):
        <span class="fn">fn</span>()
    <span class="kw">return</span> (time.<span class="fn">perf_counter</span>() - t0) / n * <span class="num">1000</span>

<span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
    <span class="fn">print</span>(f<span class="str">"forward: {bench_ms(lambda: m(x)):.3f} ms"</span>)

<span class="cm"># 2) torch.profiler -- op bazinda dokum</span>
<span class="kw">with</span> <span class="fn">profile</span>(activities=[ProfilerActivity.CPU], record_shapes=<span class="kw">True</span>) <span class="kw">as</span> prof:
    <span class="kw">with</span> <span class="fn">record_function</span>(<span class="str">"model_inference"</span>):
        <span class="kw">with</span> torch.<span class="fn">inference_mode</span>():
            <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
                <span class="fn">m</span>(x)

<span class="fn">print</span>(prof.<span class="fn">key_averages</span>().<span class="fn">table</span>(sort_by=<span class="str">"cpu_time_total"</span>, row_limit=<span class="num">10</span>))

<span class="cm"># 3) GPU profilleme (CUDA mevcutken)</span>
<span class="cm"># 4) chrome://tracing icin trace kaydet</span>
<span class="cm"># prof.export_chrome_trace("trace.json")</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Profilleme: time.perf_counter ile üç işlemin maliyetini karşılaştır -- torch.profiler'in yaptığı tam olarak bu, sadece daha ince taneli kernellerle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import time
import numpy as np

rng = np.random.default_rng(0)
A = rng.standard_normal((512, 512))
B = rng.standard_normal((512, 512))

ops = {
    'matmul       ': lambda: A @ B,
    'elementwise +': lambda: A + B,
    'svd (small)  ': lambda: np.linalg.svd(A[:64, :64]),
}

print(f'{"op":15s}  iters     ms_total   ms_per_iter')
for name, fn in ops.items():
    t0 = time.perf_counter()
    n = 20
    for _ in range(n):
        fn()
    dt = (time.perf_counter() - t0) * 1000
    print(f'{name}    {n:3d}  {dt:8.2f}    {dt/n:8.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Minimal <code>bench_ms</code> yardımcısı: JIT/CUDA bağlamı başlatmasını atlamak için warmup çalıştırmaları, sonra N çalıştırmayı zamanla ve ortalama milisaniye olarak raporla. Her zaman warmup ekleyin -- onsuz ilk ölçümünüz tek seferlik kurulum maliyetini içerir. 2) <code>torch.profiler</code> <code>record_function</code> ile işaretlenmiş bir bölgede op başına CPU süresini kaydeder. Tablo hangi op'ların hâkim olduğunu gösterir: tipik olarak matmul, GEMM, embedding lookup, softmax. 3) GPU'da çekirdek sürelerini yakalamak için <code>ProfilerActivity.CUDA</code> ekleyin. CPU ve CUDA zaman çizelgesi birlikte GPU bağlı mı yoksa host işinde takılı mı olduğunuzu ortaya koyar. 4) <code>export_chrome_trace</code> her op'un alev grafı görünümü için <code>chrome://tracing</code>'e sürükleyebileceğiniz bir JSON dosyası yazar. Garip duraklamaları kovalamak için vazgeçilmez. 5) Zorlu üretim dersi: her zaman uçtan uca profilleyin, yalnızca model değil. NLP ardışık düzenleri sıklıkla GPU forward geçişinden çok Python tokenizasyonunda zaman geçirir.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Gecikme Benchmark'ı: PyTorch vs Optimize</h2>

<div id="plot-pl11-bench-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> Tek bir CPU çekirdeğinde BERT-base duygu sınıflandırıcısı için örnek başına çıkarım gecikmesi (milisaniye cinsinden), beş dağıtım yapılandırması arasında: ham PyTorch fp32, TorchScript JIT ile PyTorch, ONNX Runtime fp32, PyTorch aracılığıyla dinamik int8 niceleme ve ONNX Runtime int8. Her adım kabaca gecikmeyi yarıya indirir. Aynı model -- yalnızca dağıtım yığını değişiyor. <strong>NLP için neden önemli:</strong> istek başına 80ms'lik gerçek zamanlı bir duygu API'si zayıf bir kullanıcı deneyimidir; 10ms'de sayfa yükleme süresine karışır. Çoğu ekip en sol çubuğu gönderir ve gecikmeyi kabul eder, ama sağa doğru her adım kalıcı throughput kazançları için birkaç saatlik mühendisliktir.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Yukaridaki cubuklari nasil ureteceginiz icin taslak</span>
<span class="kw">import</span> torch
<span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForSequenceClassification, AutoTokenizer

ckpt = <span class="str">"bert-base-uncased"</span>
tok = AutoTokenizer.<span class="fn">from_pretrained</span>(ckpt)
model = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(ckpt, num_labels=<span class="num">2</span>).<span class="fn">eval</span>()
text = <span class="str">"This movie was absolutely fantastic."</span> * <span class="num">4</span>
enc = <span class="fn">tok</span>(text, return_tensors=<span class="str">"pt"</span>, truncation=<span class="kw">True</span>, max_length=<span class="num">128</span>)

<span class="cm"># Benchmark yapilandirmalari:</span>
<span class="cm"># 1) ham PyTorch fp32 -- baseline</span>
<span class="cm"># 2) torch.jit.trace(model, ...) -- TorchScript JIT</span>
<span class="cm"># 3) torch.onnx.export -&gt; onnxruntime.InferenceSession -- ORT fp32</span>
<span class="cm"># 4) torch.quantization.quantize_dynamic(model, {nn.Linear})  -- PyTorch int8</span>
<span class="cm"># 5) nicelenmis modeli ONNX'e aktar, ORT uzerinden calistir -- ORT int8</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Gecikme benchmark'ı: aynı görevde 'naif' saf-Python döngüsünü vektörize NumPy versiyonu ile karşılaştır -- PyTorch eager vs optimize'in analoğu.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import time
import numpy as np

rng = np.random.default_rng(0)
n = 5000
a = rng.standard_normal(n)
b = rng.standard_normal(n)

# Naive Python
t0 = time.perf_counter()
out_py = []
for i in range(n):
    out_py.append(a[i] * b[i] + (a[i] - b[i]) ** 2)
py_ms = (time.perf_counter() - t0) * 1000

# Vectorized
t0 = time.perf_counter()
out_np = a * b + (a - b) ** 2
np_ms = (time.perf_counter() - t0) * 1000

print(f'naive python : {py_ms:8.2f} ms')
print(f'vectorized   : {np_ms:8.4f} ms')
print(f'speedup      : {py_ms / np_ms:8.1f}x')
print('all-equal:', np.allclose(out_py, out_np))</code></pre></div>
</div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) BERT-base'i duygu için yükler, temsili bir girdi yapar. 2) Benchmark için beş yapılandırmayı özetler. Kalıp her zaman: modeli dönüştür / dışa aktar, warmup döngüsü çalıştır, sonra 100 çıkarım çağrısını zamanla ve ortalama raporla. 3) Grafik beklenebileceğinizi gösterir; mutlak sayılar CPU'nuza bağlıdır, ama göreceli oranlar (her adım ~2x) kararlıdır. Sonuç: üretim sınıfı NLP çıkarımı nadiren model boyutu hakkındadır; aynı ağırlıklar etrafında seçtiğiniz dağıtım yığını hakkındadır.</p>

<div class="think-box"><div class="think-label">ANA NOKTALAR</div><div class="think-body"><strong>1.</strong> Tam model nesnesini değil, <code>state_dict</code>'i kaydedin; mimariyi yeniden örneklendirmek için bir config sözlüğü dahil edin.<br><strong>2.</strong> Çıkarım için her zaman <code>model.eval()</code> + <code>torch.inference_mode()</code> çağırın. Birini unutmak sessiz bir doğruluk hatasıdır.<br><strong>3.</strong> TorchScript: sabit kontrol akışı için trace, döngü/dal için script; dönüşümden sonra her zaman parite kontrolü yapın.<br><strong>4.</strong> <code>dynamic_axes</code> ile ONNX dışa aktarma çapraz çerçeve taşınabilirlik ve ONNX Runtime aracılığıyla 2-3x CPU hızlanması verir.<br><strong>5.</strong> Karışık hassasiyet (GradScaler ile fp16, onsuz bf16) minimal doğruluk maliyetiyle 2-3x eğitim throughput'u verir.<br><strong>6.</strong> Dinamik int8 niceleme transformer'ları 4x sıkıştırır ve ihmal edilebilir doğruluk kaybıyla CPU çıkarımını 2-3x hızlandırır.<br><strong>7.</strong> Optimize etmeden önce profilleyin. Tokenizasyon, son işlem ve dataloader duraklamaları sıklıkla hâkimdir; modelin kendisi gecikmenin %95'i değil, %30'u olabilir.<br><strong>8.</strong> Sonraki ders: uçtan uca NLP projesi -- ham metinden dağıtılmış çıkarım fonksiyonuna IMDB duygu, L1'den L11'e kadar her şeyi uygulayarak.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  // Graph defined together with EN block above.
}, 250);</script>`

};
