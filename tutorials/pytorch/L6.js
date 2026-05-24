window.PYTORCH_L6 = {

en: `<p class="l-text"><strong>Convolutional networks are the architecture that started the deep learning revolution in 2012.</strong> Even though transformers now dominate, CNNs are still everywhere: image classification, audio, and crucially for us, text classification with 1D convolutions. A 1D Conv layer over word embeddings detects local n-gram patterns far cheaper than an attention layer, which makes it the right tool for many production NLP pipelines where latency matters.</p>

<p class="l-text">This lesson covers convolutions briefly with an NLP focus: 2D Conv for images for intuition, 1D Conv for text classification in depth, pooling, and a working CNN text classifier. We will not derive convolution from scratch -- the goal is fluency in PyTorch's <code>Conv1d</code> and <code>Conv2d</code>, which is what you actually need.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compute output shapes for <code>Conv1d</code> / <code>Conv2d</code> from kernel, stride, and padding</li>
<li>Apply 1D convolutions over <code>(B, T, E)</code> word embeddings to detect n-gram patterns</li>
<li>Reshape between <code>(B, T, E)</code> and <code>(B, E, T)</code> as required by PyTorch's Conv1d API</li>
<li>Implement Kim's 2014 TextCNN with multiple kernel widths and global max pooling</li>
<li>Train and evaluate the CNN sentiment classifier and compare it against an MLP baseline</li>
<li>Decide when Conv1d beats attention on cost vs accuracy for short-sequence NLP tasks</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Convolutions for NLP?</h2>

<p class="l-text">An MLP applied to <code>(B, T, E)</code> embeddings treats each token independently. It misses local patterns -- "not good" should mean something different from "not" and "good" separately. A 1D convolution slides a small window over the sequence and detects exactly these short n-gram patterns.</p>

<div class="calc-highlight"><strong>Convolution = local pattern detector with shared weights.</strong> Same kernel applied at every position; one weight matrix learns to detect "negation + adjective" no matter where it appears. This <em>weight sharing</em> is what makes CNNs efficient.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Locality</div><div class="card-body">Each output position depends only on a small window of inputs. Cheap to compute, captures local structure.</div></div>
<div class="calc-card"><div class="card-title">Weight sharing</div><div class="card-body">The same kernel applies at every position. Far fewer parameters than a fully-connected layer.</div></div>
<div class="calc-card"><div class="card-title">Translation invariance</div><div class="card-body">A pattern detected at position 5 will also be detected at position 50. Useful when location varies across samples.</div></div>
<div class="calc-card"><div class="card-title">Hierarchy</div><div class="card-body">Stack convolutions and the receptive field grows -- early layers see characters/words, late layers see phrases.</div></div>
<div class="calc-card"><div class="card-title">Parallelism</div><div class="card-body">All output positions computed in parallel on GPU. Much faster than RNNs.</div></div>
<div class="calc-card"><div class="card-title">Cheap vs attention</div><div class="card-body">Conv1d cost is O(T) per layer; attention is O(T^2). For short sequences and latency-critical apps, Conv wins.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: when to reach for Conv1d in NLP</div><div class="example-body">Production sentiment classifier on tweet-length text? Conv1d is faster than transformers, often within 1-2 points of accuracy. Speech recognition phoneme classifier? Conv1d. NER baseline? CNN-BiLSTM-CRF was state of the art before BERT. The 2014 Kim "Convolutional Neural Networks for Sentence Classification" paper showed a single Conv1d layer over word embeddings beats logistic regression on most tasks.</div></div>

<div class="think-box"><div class="think-label">CNN vs RNN vs TRANSFORMER for NLP</div><div class="think-body">CNN sees fixed local windows, parallelizable, cheap. RNN sees long-range dependencies sequentially, slow. Transformer sees everything at once via attention, expensive but most accurate. Choose CNN for short text + low latency, RNN for streaming/online inference, transformer for accuracy. Many production systems still use Conv-LSTM hybrids because they hit the cost/accuracy sweet spot.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. 2D Convolution Intuition (Images)</h2>

<p class="l-text">Before we use Conv1d for text, a quick visit to 2D convolution on images grounds the intuition. The math is identical; just one extra spatial dimension.</p>

<div class="katex-block">$$(I * K)(i, j) = \\sum_{m}\\sum_{n} I(i+m, j+n)\\,K(m, n)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">I</div><div class="card-body">Input image (or feature map). Shape <code>(C_in, H, W)</code>.</div></div>
<div class="calc-card"><div class="card-title">K</div><div class="card-body">Kernel (filter), small learnable matrix. Shape <code>(C_out, C_in, kH, kW)</code>.</div></div>
<div class="calc-card"><div class="card-title">i, j</div><div class="card-body">Output position. The convolution slides K over I.</div></div>
<div class="calc-card"><div class="card-title">m, n</div><div class="card-body">Indices inside the kernel. Sum over the kernel's window at each output position.</div></div>
<div class="calc-card"><div class="card-title">stride</div><div class="card-body">How many positions to jump per output. stride=1 dense, stride=2 halves spatial dim.</div></div>
<div class="calc-card"><div class="card-title">padding</div><div class="card-body">Zeros (or reflect, etc.) added around input so output size matches expectations.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Image batch: (batch=2, channels=3 RGB, height=32, width=32)</span>
img = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">3</span>, <span class="num">32</span>, <span class="num">32</span>)

<span class="cm"># Conv2d: 16 output channels, 3x3 kernel, stride 1, padding 1</span>
conv = nn.<span class="fn">Conv2d</span>(in_channels=<span class="num">3</span>, out_channels=<span class="num">16</span>, kernel_size=<span class="num">3</span>,
                 stride=<span class="num">1</span>, padding=<span class="num">1</span>)
out = <span class="fn">conv</span>(img)
<span class="fn">print</span>(out.shape)              <span class="cm"># torch.Size([2, 16, 32, 32])</span>

<span class="cm"># What does padding=1 do?</span>
<span class="cm"># Without padding: 32x32 -&gt; 30x30 because the kernel cannot reach edges fully</span>
<span class="cm"># With padding=1: zeros added on every side so 32x32 stays 32x32</span>
no_pad = nn.<span class="fn">Conv2d</span>(<span class="num">3</span>, <span class="num">16</span>, <span class="num">3</span>, padding=<span class="num">0</span>)(img)
<span class="fn">print</span>(no_pad.shape)           <span class="cm"># torch.Size([2, 16, 30, 30])</span>

<span class="cm"># Stride 2 halves spatial dimensions -- a downsampling pattern</span>
down = nn.<span class="fn">Conv2d</span>(<span class="num">3</span>, <span class="num">16</span>, <span class="num">3</span>, stride=<span class="num">2</span>, padding=<span class="num">1</span>)(img)
<span class="fn">print</span>(down.shape)             <span class="cm"># torch.Size([2, 16, 16, 16])</span>

<span class="cm"># Parameters: out * in * kH * kW + out (bias)</span>
<span class="fn">print</span>(conv.weight.shape)      <span class="cm"># torch.Size([16, 3, 3, 3])  -- (out, in, kH, kW)</span>
<span class="fn">print</span>(conv.bias.shape)        <span class="cm"># torch.Size([16])</span>
<span class="fn">print</span>(<span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> conv.<span class="fn">parameters</span>()))   <span class="cm"># 16*3*3*3 + 16 = 448</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A 2D convolution is a sliding sum-product. We hand-roll a 3x3 edge filter on a small numpy 'image' to show the operation visually.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.signal import correlate2d

img = np.array([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
], dtype=float)

# Sobel-x (vertical edge detector)
kernel = np.array([[-1, 0, 1],
                   [-2, 0, 2],
                   [-1, 0, 1]])

out = correlate2d(img, kernel, mode='valid')
print('input image:\n', img.astype(int))
print('Sobel-x output (vertical edges):\n', out.astype(int))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a fake batch of 2 RGB 32x32 images, the canonical CIFAR-10 shape. PyTorch uses NCHW layout: (batch, channels, height, width). 2) Applies a Conv2d with 16 output filters and a 3x3 kernel; the output has 16 channels at the same spatial size because padding=1 compensates for kernel reach. 3) Without padding the output is 30x30 -- the kernel cannot center over edge pixels, so spatial size shrinks by (kernel_size - 1). 4) Stride 2 jumps two positions per output, halving spatial dimensions; this is the standard "downsampling convolution" used between blocks in ResNet. 5) The weight tensor has shape <code>(out, in, kH, kW)</code> -- 16 filters, each a 3x3x3 tensor that scans across all input channels. Total parameters: 448, far fewer than a fully connected layer mapping 32*32*3 = 3072 inputs to 32*32*16 = 16384 outputs (which would be 50M params).</p>

<div id="plot-pl6-conv-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Schematic of 2D convolution: a 3x3 kernel slides over a 5x5 input, producing a 3x3 output (no padding). At each output position the 9 cells of the input window are multiplied element-wise with the kernel and summed. Move the kernel one step right and repeat. This same machinery, applied in 1D, is what we use for text.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Conv1d for Text: the Setup</h2>

<p class="l-text">For text, the input is a sequence of token embeddings: shape <code>(B, T, E)</code> from your embedding layer. Conv1d expects channels-first: <code>(B, E, T)</code>. So the first thing we do is transpose. After convolution, we transpose back if needed, or pool right away.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

B, T, E = <span class="num">4</span>, <span class="num">20</span>, <span class="num">64</span>       <span class="cm"># batch=4, seq_len=20, embed_dim=64</span>

<span class="cm"># Step 1: standard embedding output</span>
emb = torch.<span class="fn">randn</span>(B, T, E)
<span class="fn">print</span>(<span class="str">"embedding:"</span>, emb.shape)         <span class="cm"># (4, 20, 64)</span>

<span class="cm"># Step 2: transpose to channels-first for Conv1d</span>
x = emb.<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)                 <span class="cm"># (4, 64, 20) -- (B, C_in, T)</span>
<span class="fn">print</span>(<span class="str">"after transpose:"</span>, x.shape)

<span class="cm"># Step 3: Conv1d with 100 filters of size 3 (a "trigram detector")</span>
conv = nn.<span class="fn">Conv1d</span>(in_channels=<span class="num">64</span>, out_channels=<span class="num">100</span>, kernel_size=<span class="num">3</span>, padding=<span class="num">1</span>)
y = <span class="fn">conv</span>(x)
<span class="fn">print</span>(<span class="str">"after conv1d:"</span>, y.shape)         <span class="cm"># (4, 100, 20) -- 100 channels, same length</span>

<span class="cm"># Activation</span>
y = torch.<span class="fn">relu</span>(y)

<span class="cm"># Multiple kernel sizes -- the Kim 2014 trick</span>
<span class="kw">class</span> <span class="fn">TextCNN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, embed_dim=<span class="num">64</span>, num_filters=<span class="num">100</span>, kernel_sizes=(<span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>)):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.convs = nn.<span class="fn">ModuleList</span>([
            nn.<span class="fn">Conv1d</span>(embed_dim, num_filters, k, padding=k//<span class="num">2</span>)
            <span class="kw">for</span> k <span class="kw">in</span> kernel_sizes
        ])
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="cm"># x: (B, T, E) -&gt; (B, E, T)</span>
        x = x.<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)
        outs = [torch.<span class="fn">relu</span>(<span class="fn">conv</span>(x)) <span class="kw">for</span> conv <span class="kw">in</span> self.convs]
        <span class="kw">return</span> outs              <span class="cm"># list of (B, num_filters, T)</span>

cnn = <span class="fn">TextCNN</span>()
out_list = <span class="fn">cnn</span>(emb)
<span class="kw">for</span> o <span class="kw">in</span> out_list:
    <span class="fn">print</span>(o.shape)              <span class="cm"># (4, 100, 20) for each kernel size</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Conv1d for text = sliding window of weights over token embeddings. We do this by hand on a fake (sentence x embedding) matrix.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.signal import correlate

# Fake "embedding" sequence: 8 tokens x 4 dim
seq = np.random.default_rng(0).standard_normal((8, 4))

# 3-token window kernel (kernel_size=3, in_ch=4 -> out=1)
kernel = np.random.default_rng(1).standard_normal((3, 4))

# Compute conv as windowed dot products
out = []
for start in range(seq.shape[0] - 3 + 1):
    window = seq[start:start+3]                # (3, 4)
    out.append(float((window * kernel).sum())) # dot
out = np.array(out)
print('seq shape    :', seq.shape)
print('kernel shape :', kernel.shape)
print('conv output  :', out.round(3))
print('output length: input_len - kernel_size + 1 =', len(out))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Imagines an embedding output of shape <code>(B, T, E) = (4, 20, 64)</code> -- a standard NLP starting point. 2) Transposes to <code>(B, E, T)</code> because <code>nn.Conv1d</code> expects the convolved dimension last and channels in the middle. This single transpose is the most-forgotten step in NLP CNN code. 3) Applies a Conv1d with 100 output filters and kernel size 3; <code>padding=1</code> keeps the time dimension at 20. The output shape <code>(B, 100, T)</code> means we now have 100 feature channels per position, where each channel is the response of a learned trigram detector. 4) ReLU adds nonlinearity, just like in MLPs. 5) The TextCNN class implements the canonical Kim 2014 architecture: parallel convolutions of multiple kernel sizes (3, 4, 5) capture short, medium, and longer n-gram patterns simultaneously. The forward returns a list of feature maps that we will pool and concatenate next.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">in_channels</div><div class="card-body">Embedding dim for the first Conv layer (e.g. 64, 300, 768).</div></div>
<div class="calc-card"><div class="card-title">out_channels</div><div class="card-body">Number of filters / feature channels in output. Each is a separate detector.</div></div>
<div class="calc-card"><div class="card-title">kernel_size</div><div class="card-body">Window size in time. 3 = trigram, 5 = 5-gram. Common: 3, 4, 5 in parallel.</div></div>
<div class="calc-card"><div class="card-title">padding=k//2</div><div class="card-body">Padding equal to half the kernel keeps output length equal to input length.</div></div>
<div class="calc-card"><div class="card-title">stride</div><div class="card-body">Usually 1 in NLP; pooling handles downsampling.</div></div>
<div class="calc-card"><div class="card-title">dilation</div><div class="card-body">Spacing between kernel elements. Dilated convs cover wider context with same parameter count.</div></div>
</div>

<div class="l-warn"><strong>Pitfall:</strong> Forgetting the transpose. If you feed <code>(B, T, E)</code> directly to <code>Conv1d(in=E, ...)</code>, it will think E is the time axis and convolve along it -- you get garbage, no error. Always transpose first or use <code>einops.rearrange</code> for clarity.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Pooling: Max, Average, Adaptive</h2>

<p class="l-text">Pooling reduces a length-T feature map to a fixed-size representation, summarizing the most important features regardless of where they appeared. Max pooling is the standard choice for text -- "this filter fired strongly somewhere" is a useful signal.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

x = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">100</span>, <span class="num">20</span>)          <span class="cm"># (B, C, T)</span>

<span class="cm"># 1) Global max pool -- one number per channel</span>
pooled = F.<span class="fn">adaptive_max_pool1d</span>(x, output_size=<span class="num">1</span>).<span class="fn">squeeze</span>(-<span class="num">1</span>)
<span class="fn">print</span>(pooled.shape)                  <span class="cm"># (2, 100)</span>

<span class="cm"># 2) Local max pool with kernel 2, stride 2 -- halves length</span>
local = F.<span class="fn">max_pool1d</span>(x, kernel_size=<span class="num">2</span>, stride=<span class="num">2</span>)
<span class="fn">print</span>(local.shape)                   <span class="cm"># (2, 100, 10)</span>

<span class="cm"># 3) Global average pool</span>
avg = F.<span class="fn">adaptive_avg_pool1d</span>(x, output_size=<span class="num">1</span>).<span class="fn">squeeze</span>(-<span class="num">1</span>)
<span class="fn">print</span>(avg.shape)                     <span class="cm"># (2, 100)</span>

<span class="cm"># 4) k-max pooling (top-k values per channel) -- richer than just max</span>
<span class="kw">def</span> <span class="fn">k_max_pool</span>(x, k=<span class="num">3</span>):
    <span class="cm"># x: (B, C, T)</span>
    <span class="kw">return</span> torch.<span class="fn">topk</span>(x, k, dim=-<span class="num">1</span>).values      <span class="cm"># (B, C, k)</span>
<span class="fn">print</span>(<span class="fn">k_max_pool</span>(x, k=<span class="num">3</span>).shape)      <span class="cm"># (2, 100, 3)</span>

<span class="cm"># Putting it together: a TextCNN forward with multi-kernel + global max</span>
<span class="kw">class</span> <span class="fn">TextCNN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, embed_dim=<span class="num">128</span>, num_filters=<span class="num">100</span>,
                 kernel_sizes=(<span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>), num_classes=<span class="num">2</span>, dropout=<span class="num">0.5</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(vocab_size, embed_dim, padding_idx=<span class="num">0</span>)
        self.convs = nn.<span class="fn">ModuleList</span>([
            nn.<span class="fn">Conv1d</span>(embed_dim, num_filters, k, padding=k//<span class="num">2</span>)
            <span class="kw">for</span> k <span class="kw">in</span> kernel_sizes
        ])
        self.dropout = nn.<span class="fn">Dropout</span>(dropout)
        self.fc = nn.<span class="fn">Linear</span>(num_filters * <span class="fn">len</span>(kernel_sizes), num_classes)

    <span class="kw">def</span> <span class="fn">forward</span>(self, ids, mask=<span class="kw">None</span>):
        <span class="cm"># ids: (B, T)</span>
        x = self.<span class="fn">embed</span>(ids)                   <span class="cm"># (B, T, E)</span>
        x = x.<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)                 <span class="cm"># (B, E, T)</span>
        <span class="cm"># Apply each conv, ReLU, then global max-pool over time</span>
        feats = []
        <span class="kw">for</span> conv <span class="kw">in</span> self.convs:
            f = torch.<span class="fn">relu</span>(<span class="fn">conv</span>(x))            <span class="cm"># (B, F, T)</span>
            <span class="kw">if</span> mask <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
                <span class="cm"># mask out padding before pooling</span>
                mb = mask.<span class="fn">unsqueeze</span>(<span class="num">1</span>).<span class="fn">bool</span>()  <span class="cm"># (B, 1, T)</span>
                f = f.<span class="fn">masked_fill</span>(~mb, <span class="fn">float</span>(<span class="str">"-inf"</span>))
            f = F.<span class="fn">adaptive_max_pool1d</span>(f, <span class="num">1</span>).<span class="fn">squeeze</span>(-<span class="num">1</span>)   <span class="cm"># (B, F)</span>
            feats.<span class="fn">append</span>(f)
        h = torch.<span class="fn">cat</span>(feats, dim=-<span class="num">1</span>)          <span class="cm"># (B, F * num_kernel_sizes)</span>
        h = self.<span class="fn">dropout</span>(h)
        <span class="kw">return</span> self.<span class="fn">fc</span>(h)                     <span class="cm"># (B, C)</span>

cnn = <span class="fn">TextCNN</span>(vocab_size=<span class="num">10000</span>)
ids = torch.<span class="fn">randint</span>(<span class="num">1</span>, <span class="num">10000</span>, (<span class="num">4</span>, <span class="num">20</span>))
mask = torch.<span class="fn">ones</span>(<span class="num">4</span>, <span class="num">20</span>)
out = <span class="fn">cnn</span>(ids, mask)
<span class="fn">print</span>(out.shape)                              <span class="cm"># (4, 2)</span>
<span class="fn">print</span>(<span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> cnn.<span class="fn">parameters</span>()))  <span class="cm"># parameter count</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pooling reduces sequence length: max-pool keeps the strongest activation, mean-pool the average -- both implemented with NumPy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.array([3.0, 1.0, 4.0, 1.0, 5.0, 9.0, 2.0, 6.0, 5.0, 3.0])

# Max pool with kernel=2, stride=2
def max_pool1d(x, k=2):
    return np.array([x[i:i+k].max() for i in range(0, len(x) - k + 1, k)])
def avg_pool1d(x, k=2):
    return np.array([x[i:i+k].mean() for i in range(0, len(x) - k + 1, k)])

# Adaptive pool to a target length L (chunk-then-mean)
def adaptive_avg_pool1d(x, L):
    chunks = np.array_split(x, L)
    return np.array([c.mean() for c in chunks])

print('input             :', x)
print('max_pool (k=2)    :', max_pool1d(x, 2))
print('avg_pool (k=2)    :', avg_pool1d(x, 2).round(3))
print('adaptive_avg L=3  :', adaptive_avg_pool1d(x, 3).round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>adaptive_max_pool1d(x, 1)</code> takes the maximum across the time dimension regardless of input length -- this is "global max pool" and produces one number per channel. We squeeze the trailing dim of size 1 to get <code>(B, C)</code>. 2) Local max pool with stride 2 halves the time dimension; useful for hierarchical CNNs but rare in NLP (we usually pool globally at the end). 3) Global average pool is the same idea but with averaging. Less common in text -- max captures "did this pattern appear?" while mean captures "how strongly on average?". 4) k-max pooling keeps the top-k values per channel, which retains more information than just the max -- useful for richer representations. 5) The full TextCNN runs each conv in parallel, applies ReLU, masks padding to <code>-inf</code> so it can never be the max, global-max-pools each, and concatenates into a single vector. The final Linear projects to class logits. This architecture, with maybe 200k parameters, often beats LSTMs on short-text classification at a fraction of the compute.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Max pool</div><div class="compare-item">Picks the strongest activation per channel</div><div class="compare-item">Captures "did this feature appear?"</div><div class="compare-item">Default for text classification</div><div class="compare-item">Position-invariant</div></div>
<div class="compare-col"><div class="compare-title">Average pool</div><div class="compare-item">Averages all activations per channel</div><div class="compare-item">Captures "how often / how strong on average"</div><div class="compare-item">Common for image regression heads</div><div class="compare-item">Smoother gradients than max</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Visualizing Filter Behavior</h2>

<p class="l-text">After training, what has the CNN learned? You can visualize which n-grams trigger each filter most strongly -- this is the closest thing to "interpretability" the architecture offers.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

<span class="cm"># Pretend we have a trained TextCNN with a single Conv1d layer of kernel size 3</span>
<span class="cm"># and we want to find what trigrams excite filter #7 most.</span>

<span class="cm"># embeddings: (V, E) -- the vocab embedding matrix</span>
<span class="cm"># conv.weight: (F, E, 3) -- F filters, embed dim E, kernel 3</span>

<span class="at">@torch.no_grad</span>()
<span class="kw">def</span> <span class="fn">top_trigrams_for_filter</span>(model, vocab, sentences, filter_idx=<span class="num">7</span>, top_k=<span class="num">5</span>):
    model.<span class="fn">eval</span>()
    scores_per_trigram = {}
    <span class="kw">for</span> sent <span class="kw">in</span> sentences:
        ids = torch.<span class="fn">tensor</span>([[vocab.<span class="fn">get</span>(w, <span class="num">1</span>) <span class="kw">for</span> w <span class="kw">in</span> sent.<span class="fn">split</span>()]])
        emb = model.<span class="fn">embed</span>(ids).<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)        <span class="cm"># (1, E, T)</span>
        <span class="cm"># Apply only one conv (assume model has self.convs[0] of kernel size 3)</span>
        feat = model.convs[<span class="num">0</span>](emb)                    <span class="cm"># (1, F, T)</span>
        <span class="cm"># Activation values for our filter at every position</span>
        f_act = feat[<span class="num">0</span>, filter_idx]                   <span class="cm"># (T,)</span>
        <span class="cm"># The trigram centered at position t is words[t-1: t+2] (with padding)</span>
        words = sent.<span class="fn">split</span>()
        <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="fn">len</span>(words)-<span class="num">1</span>):
            tri = <span class="str">" "</span>.<span class="fn">join</span>(words[t-<span class="num">1</span>: t+<span class="num">2</span>])
            scores_per_trigram[tri] = <span class="fn">max</span>(scores_per_trigram.<span class="fn">get</span>(tri, -<span class="num">1e9</span>),
                                          f_act[t].<span class="fn">item</span>())
    <span class="cm"># Top-k</span>
    <span class="kw">return</span> <span class="fn">sorted</span>(scores_per_trigram.<span class="fn">items</span>(), key=<span class="kw">lambda</span> kv: -kv[<span class="num">1</span>])[:top_k]

<span class="cm"># Example output (mock, illustrative):</span>
<span class="cm"># filter 7 fires hardest on:</span>
<span class="cm">#   ("not very good", 4.21)</span>
<span class="cm">#   ("absolutely awful film", 4.05)</span>
<span class="cm">#   ("really really bad", 3.98)</span>
<span class="cm">#   ("hated every minute", 3.91)</span>
<span class="cm">#   ("worst movie ever", 3.87)</span>
<span class="cm"># -&gt; filter 7 has learned to detect "negative sentiment trigrams"</span>
<span class="fn">print</span>(<span class="str">"Pretend output: filter 7 has learned negative sentiment cues"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Visualize what filters detect: apply 4 random 3x3 filters to a noisy image -- their activations highlight different patterns.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.signal import correlate2d

rng = np.random.default_rng(0)
image  = rng.standard_normal((10, 10))
filters = rng.standard_normal((4, 3, 3))   # 4 filters

print('per-filter activation stats:')
for i, k in enumerate(filters):
    fmap = correlate2d(image, k, mode='valid')
    print(f'  filter {i}: shape {fmap.shape}, '
          f'mean {fmap.mean():.3f}, max {fmap.max():.3f}, min {fmap.min():.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Iterates over a list of sentences and runs each through the embedding + first Conv1d. 2) Extracts the activation map of one specific filter (here filter 7); each position in this map is the response of the filter at that trigram. 3) For each trigram in each sentence, records the maximum activation observed for that trigram. 4) Returns the top-k trigrams that fire the filter hardest -- these are the patterns the filter has learned to detect. 5) After training a TextCNN on sentiment, you typically find filters that have specialized: some fire on negation patterns, some on superlatives, some on emotion words. This kind of post-hoc interpretation is how researchers verify a CNN has learned "the right thing".</p>

<div class="calc-example"><div class="example-label">EXAMPLE: production interpretability</div><div class="example-body">A real production trick: when a sentiment classifier predicts strongly negative, look at which 1-2 filters fired hardest and which trigrams triggered them. You can show the user "this review was flagged because of: 'absolutely awful', 'waste of time', 'never again'" -- a transparent explanation in plain English. Try this with a transformer and you get attention heatmaps that are far harder to interpret cleanly.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Stacked CNNs and Receptive Field</h2>

<p class="l-text">A single Conv layer with kernel size 3 sees only 3 tokens. Stack two and each output position sees 5; stack three and it sees 7. This growing window is called the <em>receptive field</em>. With stride or dilation, it grows even faster.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

<span class="kw">class</span> <span class="fn">DeepTextCNN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, embed_dim=<span class="num">128</span>, hidden=<span class="num">128</span>, num_classes=<span class="num">2</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(vocab_size, embed_dim, padding_idx=<span class="num">0</span>)
        <span class="cm"># 4 stacked convs: kernel 3, padding 1, hidden channels</span>
        self.layers = nn.<span class="fn">Sequential</span>(
            nn.<span class="fn">Conv1d</span>(embed_dim, hidden, <span class="num">3</span>, padding=<span class="num">1</span>),
            nn.<span class="fn">ReLU</span>(),
            nn.<span class="fn">Conv1d</span>(hidden, hidden, <span class="num">3</span>, padding=<span class="num">1</span>),
            nn.<span class="fn">ReLU</span>(),
            nn.<span class="fn">Conv1d</span>(hidden, hidden, <span class="num">3</span>, padding=<span class="num">1</span>, dilation=<span class="num">2</span>),   <span class="cm"># dilation widens RF</span>
            nn.<span class="fn">ReLU</span>(),
            nn.<span class="fn">Conv1d</span>(hidden, hidden, <span class="num">3</span>, padding=<span class="num">1</span>, dilation=<span class="num">4</span>),
            nn.<span class="fn">ReLU</span>(),
        )
        self.fc = nn.<span class="fn">Linear</span>(hidden, num_classes)

    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        x = self.<span class="fn">embed</span>(ids).<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)        <span class="cm"># (B, E, T)</span>
        x = self.<span class="fn">layers</span>(x)                          <span class="cm"># (B, H, T)</span>
        x = F.<span class="fn">adaptive_max_pool1d</span>(x, <span class="num">1</span>).<span class="fn">squeeze</span>(-<span class="num">1</span>)
        <span class="kw">return</span> self.<span class="fn">fc</span>(x)

<span class="cm"># Receptive field: with kernel 3 and dilations 1, 1, 2, 4 we see 1 + 2 + 2 + 4 + 8 = 17 positions</span>
<span class="cm"># Without dilation it would be only 1 + 2*4 = 9 positions for the same depth</span>
m = <span class="fn">DeepTextCNN</span>(vocab_size=<span class="num">10000</span>)
ids = torch.<span class="fn">randint</span>(<span class="num">1</span>, <span class="num">10000</span>, (<span class="num">4</span>, <span class="num">64</span>))
out = <span class="fn">m</span>(ids)
<span class="fn">print</span>(out.shape)            <span class="cm"># (4, 2)</span>
<span class="fn">print</span>(<span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> m.<span class="fn">parameters</span>()))</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Stacked CNNs grow the receptive field. Two 3x3 layers see effectively a 5x5 region -- we check this by counting which input cells affect a single output.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.signal import correlate2d

x = np.zeros((9, 9))
x[4, 4] = 1.0   # single bright pixel in the center

k1 = np.ones((3, 3))
k2 = np.ones((3, 3))

# After one conv: 3x3 region lit up around (4,4)
out1 = correlate2d(x, k1, mode='same')
# After two convs stacked
out2 = correlate2d(out1, k2, mode='same')

# Count how many cells are affected
print('after 1 conv: nonzero cells =', int((out1 != 0).sum()))
print('after 2 conv: nonzero cells =', int((out2 != 0).sum()))
print('receptive field grows from 3x3 (=9) to 5x5 (=25) -- exactly the pattern.')
print('out2 around the center:\n', out2[2:7, 2:7].astype(int))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a 4-layer deep CNN with the same hidden width across layers. Each Conv1d keeps the time dimension constant via <code>padding=1</code>. 2) Layers 3 and 4 use <em>dilation</em>: kernels with gaps between elements. Dilation 2 means the kernel spans 5 input positions but only uses 3 of them (every other), and dilation 4 spans 9 positions for 3 elements. This widens the receptive field exponentially without adding parameters. 3) Receptive field arithmetic: with kernel 3 and dilations <code>(1, 1, 2, 4)</code>, the final output sees about 17 input positions -- enough to capture meaningful sentence-level patterns. 4) After all conv layers, global max pooling collapses the time dimension and the linear head produces logits. This kind of dilated TextCNN is the architecture behind WaveNet (audio) and several non-transformer NLP encoders.</p>

<div id="plot-pl6-rf-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Receptive field growth across stacked Conv1d layers with kernel 3. Dense convolutions (no dilation) grow linearly: layer L sees about 2L+1 positions. Dilated convolutions grow exponentially when dilations are 1, 2, 4, 8: layer 4 sees about 17 positions, layer 6 about 65. This is exactly how audio models like WaveNet capture seconds of context efficiently.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Mini End-to-End: Sentiment with TextCNN</h2>

<p class="l-text">Time to train a TextCNN for real (well, on toy data). The script reuses Lesson 5's training loop, swapping the model for our CNN.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader, random_split
<span class="kw">from</span> torch.nn.utils.rnn <span class="kw">import</span> pad_sequence

torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)
device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>

<span class="cm"># --- model ---</span>
<span class="kw">class</span> <span class="fn">TextCNN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, V, E=<span class="num">128</span>, F=<span class="num">64</span>, kernel_sizes=(<span class="num">3</span>,<span class="num">4</span>,<span class="num">5</span>), C=<span class="num">2</span>, drop=<span class="num">0.3</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(V, E, padding_idx=<span class="num">0</span>)
        self.convs = nn.<span class="fn">ModuleList</span>([nn.<span class="fn">Conv1d</span>(E, F, k, padding=k//<span class="num">2</span>) <span class="kw">for</span> k <span class="kw">in</span> kernel_sizes])
        self.drop = nn.<span class="fn">Dropout</span>(drop)
        self.fc = nn.<span class="fn">Linear</span>(F * <span class="fn">len</span>(kernel_sizes), C)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids, mask):
        x = self.<span class="fn">embed</span>(ids).<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)        <span class="cm"># (B, E, T)</span>
        feats = []
        <span class="kw">for</span> conv <span class="kw">in</span> self.convs:
            f = torch.<span class="fn">relu</span>(<span class="fn">conv</span>(x))                 <span class="cm"># (B, F, T)</span>
            mb = mask.<span class="fn">unsqueeze</span>(<span class="num">1</span>).<span class="fn">bool</span>()
            f = f.<span class="fn">masked_fill</span>(~mb, <span class="fn">float</span>(<span class="str">"-inf"</span>))
            f = <span class="fn">F_pool</span>(f).<span class="fn">squeeze</span>(-<span class="num">1</span>)
            feats.<span class="fn">append</span>(f)
        h = self.<span class="fn">drop</span>(torch.<span class="fn">cat</span>(feats, dim=-<span class="num">1</span>))
        <span class="kw">return</span> self.<span class="fn">fc</span>(h)

<span class="kw">def</span> <span class="fn">F_pool</span>(x):
    <span class="kw">return</span> F.<span class="fn">adaptive_max_pool1d</span>(x, <span class="num">1</span>)

<span class="cm"># --- data, copy from L5 toy ---</span>
<span class="kw">class</span> <span class="fn">TextDS</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, texts, labels, vocab, max_len=<span class="num">20</span>):
        self.t, self.y, self.v, self.m = texts, labels, vocab, max_len
    <span class="kw">def</span> <span class="fn">__len__</span>(self): <span class="kw">return</span> <span class="fn">len</span>(self.t)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i):
        ids = [self.v.<span class="fn">get</span>(t, <span class="num">1</span>) <span class="kw">for</span> t <span class="kw">in</span> self.t[i].<span class="fn">lower</span>().<span class="fn">split</span>()][:self.m]
        <span class="kw">return</span> {<span class="str">"input_ids"</span>: torch.<span class="fn">tensor</span>(ids, dtype=torch.long),
                <span class="str">"label"</span>: torch.<span class="fn">tensor</span>(self.y[i], dtype=torch.long)}

<span class="kw">def</span> <span class="fn">collate</span>(batch):
    ids = [b[<span class="str">"input_ids"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch]
    y = torch.<span class="fn">stack</span>([b[<span class="str">"label"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch])
    p = <span class="fn">pad_sequence</span>(ids, batch_first=<span class="kw">True</span>, padding_value=<span class="num">0</span>)
    m = (p != <span class="num">0</span>).<span class="fn">float</span>()
    <span class="kw">return</span> {<span class="str">"input_ids"</span>: p, <span class="str">"attention_mask"</span>: m, <span class="str">"labels"</span>: y}

texts = [<span class="str">"amazing movie"</span>, <span class="str">"terrible film"</span>, <span class="str">"great cast"</span>, <span class="str">"boring plot"</span>,
         <span class="str">"loved it"</span>, <span class="str">"hated it"</span>, <span class="str">"fantastic experience"</span>, <span class="str">"awful waste"</span>] * <span class="num">15</span>
labels = [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>] * <span class="num">15</span>
vocab = {<span class="str">"&lt;pad&gt;"</span>:<span class="num">0</span>, <span class="str">"&lt;unk&gt;"</span>:<span class="num">1</span>}
<span class="kw">for</span> t <span class="kw">in</span> texts:
    <span class="kw">for</span> w <span class="kw">in</span> t.<span class="fn">lower</span>().<span class="fn">split</span>(): vocab.<span class="fn">setdefault</span>(w, <span class="fn">len</span>(vocab))

ds = <span class="fn">TextDS</span>(texts, labels, vocab)
gen = torch.<span class="fn">Generator</span>().<span class="fn">manual_seed</span>(<span class="num">0</span>)
tr, va = <span class="fn">random_split</span>(ds, [<span class="num">0.8</span>, <span class="num">0.2</span>], generator=gen)
tl = <span class="fn">DataLoader</span>(tr, batch_size=<span class="num">8</span>, shuffle=<span class="kw">True</span>, collate_fn=collate)
vl = <span class="fn">DataLoader</span>(va, batch_size=<span class="num">8</span>, collate_fn=collate)

model = <span class="fn">TextCNN</span>(V=<span class="fn">len</span>(vocab)).<span class="fn">to</span>(device)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>, weight_decay=<span class="num">0.01</span>)
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>):
    model.<span class="fn">train</span>()
    <span class="kw">for</span> b <span class="kw">in</span> tl:
        opt.<span class="fn">zero_grad</span>()
        ids, m, y = b[<span class="str">"input_ids"</span>].<span class="fn">to</span>(device), b[<span class="str">"attention_mask"</span>].<span class="fn">to</span>(device), b[<span class="str">"labels"</span>].<span class="fn">to</span>(device)
        loss = <span class="fn">loss_fn</span>(<span class="fn">model</span>(ids, m), y)
        loss.<span class="fn">backward</span>()
        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
        opt.<span class="fn">step</span>()
    <span class="cm"># eval</span>
    model.<span class="fn">eval</span>()
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        correct = total = <span class="num">0</span>
        <span class="kw">for</span> b <span class="kw">in</span> vl:
            ids, m, y = b[<span class="str">"input_ids"</span>].<span class="fn">to</span>(device), b[<span class="str">"attention_mask"</span>].<span class="fn">to</span>(device), b[<span class="str">"labels"</span>].<span class="fn">to</span>(device)
            correct += (<span class="fn">model</span>(ids, m).<span class="fn">argmax</span>(-<span class="num">1</span>) == y).<span class="fn">sum</span>().<span class="fn">item</span>()
            total += y.<span class="fn">size</span>(<span class="num">0</span>)
    <span class="fn">print</span>(f<span class="str">"epoch {epoch+1}: val_acc = {correct/total:.3f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mini end-to-end text classifier with character n-gram TF-IDF + logistic regression -- a sklearn analog of a TextCNN.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)

# Character n-grams = TextCNN style local feature detectors
vec = TfidfVectorizer(analyzer='char_wb', ngram_range=(3, 5), max_features=3000)
Xt_tr = vec.fit_transform(X_tr)
Xt_te = vec.transform(X_te)

clf = LogisticRegression(max_iter=500, C=2.0).fit(Xt_tr, y_tr)
acc = accuracy_score(y_te, clf.predict(Xt_te))
print(f'char-ngram TF-IDF + LR accuracy: {acc:.3f}')
print('feature dim:', Xt_tr.shape[1])</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines TextCNN exactly as discussed: embedding, three parallel Conv1d branches with kernel sizes 3, 4, 5, ReLU, masked global-max-pool, concatenate, dropout, classifier. 2) Reuses the Lesson 4/5 data pipeline -- toy positive/negative sentences, custom collate with padding and mask. 3) Builds train/val DataLoaders with reproducible split. 4) Trains for 8 epochs with AdamW, weight decay, gradient clipping -- the standard recipe from Lesson 5. 5) Each epoch evaluates on validation; you should see accuracy climb to 1.0 on this trivial toy data within 2-3 epochs. On real IMDb (50k reviews) this same architecture reaches ~88% accuracy in a few minutes -- close to LSTMs at a tiny fraction of the compute.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: when CNN beats transformer</div><div class="example-body">Your latency budget per request is 10ms on CPU. A BERT-base inference is 50-200ms; a TextCNN with 200k params is 1-3ms. For toxic-comment moderation on a chat platform with a million messages a day, the TextCNN is the right answer. You give up a couple percentage points of accuracy and gain 50x throughput. Choose tools by constraints.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Wrap-Up</h2>

<p class="l-text">CNNs are the right tool more often than you might think for NLP. They are fast, parallelizable, interpretable, and competitive on short-text tasks. The transformer revolution is real but it does not erase the cases where a 200k-parameter CNN is exactly the right answer.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">CNN strengths</div><div class="compare-item">Fast inference (1-3ms on CPU)</div><div class="compare-item">Few parameters</div><div class="compare-item">Easy to interpret per-filter</div><div class="compare-item">Good on short text, latency-critical apps</div><div class="compare-item">No quadratic memory cost</div></div>
<div class="compare-col"><div class="compare-title">CNN weaknesses</div><div class="compare-item">Limited receptive field for long docs</div><div class="compare-item">Position-invariance can hurt syntactic tasks</div><div class="compare-item">Not state of the art on most benchmarks</div><div class="compare-item">No long-range dependency modeling</div><div class="compare-item">Replaced by transformers in research</div></div>
</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Convolution = local pattern detector with shared weights. Cheap and parallelizable.<br><strong>2.</strong> <code>nn.Conv2d</code> for images uses NCHW: <code>(B, C, H, W)</code>. Weight shape <code>(out, in, kH, kW)</code>.<br><strong>3.</strong> <code>nn.Conv1d</code> for text uses <code>(B, C, T)</code>. ALWAYS transpose embedding output <code>(B, T, E) -&gt; (B, E, T)</code> first.<br><strong>4.</strong> Multi-kernel TextCNN (Kim 2014): parallel Conv1d with kernels 3, 4, 5; ReLU; global max-pool; concatenate; classify.<br><strong>5.</strong> Mask padding before pooling so it never becomes the max: <code>f.masked_fill(~mask_bool, float("-inf"))</code>.<br><strong>6.</strong> Stack convs to grow the receptive field linearly; use dilation to grow exponentially without extra parameters.<br><strong>7.</strong> Filter visualization (top-k trigrams per filter) is the cheapest interpretability tool you can deploy.<br><strong>8.</strong> Next lesson: RNNs and LSTMs -- sequential models that handle longer dependencies, slower but more expressive.</div></div>
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

  function convPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    // Build a 5x5 input grid as heatmap with kernel 3x3 highlight
    var z = [];
    for (var i=0;i<5;i++){var row=[];for (var j=0;j<5;j++){row.push((i+j)%3 + Math.random()*0.3);}z.push(row);}
    var inputTr = {z: z, type:'heatmap', colorscale:[[0,'rgba(40,30,20,0.4)'],[1,'rgba(200,169,110,0.9)']], showscale:false, name:'input'};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'2D Konvolüsyon: 3x3 çekirdek 5x5 girdi üzerinde':'2D Convolution: 3x3 kernel over 5x5 input', font:{color:T.text,size:14}},
      xaxis:{visible:false, scaleanchor:'y'},
      yaxis:{visible:false, autorange:'reversed'},
      shapes:[
        {type:'rect', x0:-0.5, y0:-0.5, x1:2.5, y1:2.5, line:{color:'#4ecdc4', width:3}},
        {type:'rect', x0:0.5, y0:0.5, x1:3.5, y1:3.5, line:{color:'#4ecdc4', width:1, dash:'dot'}},
      ],
      annotations:[{x:1, y:1, text: lang==='tr'?'çekirdek pozisyon 1':'kernel pos 1', showarrow:false, font:{color:'white',size:10}}]
    });
    Plotly.newPlot(id, [inputTr], layout, {responsive:true, displayModeBar:false});
  }

  function rfPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var depth = [1,2,3,4,5,6,7,8];
    var dense = depth.map(function(L){return 2*L + 1;});
    var dilated = depth.map(function(L){return Math.pow(2, L+1) + 1;});
    var t1 = {x:depth, y:dense, mode:'lines+markers', type:'scatter', name:lang==='tr'?'yoğun (dilation=1)':'dense (dilation=1)', line:{color:T.accent, width:2.5}, marker:{size:10}};
    var t2 = {x:depth, y:dilated, mode:'lines+markers', type:'scatter', name:lang==='tr'?'genişletilmiş (dilation=2^L)':'dilated (dilation=2^L)', line:{color:'#4ecdc4', width:2.5}, marker:{size:10}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Conv Derinliği vs Alıcı Alan':'Conv Depth vs Receptive Field', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'derinlik':'depth', gridcolor:T.grid, zerolinecolor:T.zero, dtick:1},
      yaxis:{title:lang==='tr'?'alıcı alan (token)':'receptive field (tokens)', gridcolor:T.grid, zerolinecolor:T.zero, type:'log'},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2], layout, {responsive:true, displayModeBar:false});
  }

  convPlot('plot-pl6-conv-en','en');
  rfPlot('plot-pl6-rf-en','en');
  convPlot('plot-pl6-conv-tr','tr');
  rfPlot('plot-pl6-rf-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Evrişimsel ağlar 2012'de derin öğrenme devrimini başlatan mimaridir.</strong> Transformer'lar şimdi hakim olsa da CNN'ler hâlâ her yerde: görüntü sınıflandırma, ses ve bizim için kritik olarak 1B evrişimle metin sınıflandırma. Kelime embedding'leri üzerinde 1B Conv katmanı yerel n-gram örüntülerini bir attention katmanından çok daha ucuza algılar, bu da onu gecikmenin önemli olduğu birçok üretim NLP boru hattı için doğru araç yapar.</p>

<p class="l-text">Bu ders evrişimleri NLP odağıyla kısaca kapsar: sezgi için görüntüler için 2B Conv, derinlemesine metin sınıflandırma için 1B Conv, pooling ve çalışan bir CNN metin sınıflandırıcısı. Evrişimi sıfırdan türetmeyeceğiz -- amaç PyTorch'un <code>Conv1d</code> ve <code>Conv2d</code>'sinde akıcılıktır ki gerçekten ihtiyacınız olan budur.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Kernel, stride ve padding'den <code>Conv1d</code> / <code>Conv2d</code> çıktı şekillerini hesaplamayı</li>
<li>n-gram örüntülerini algılamak için <code>(B, T, E)</code> kelime embedding'lerine 1B evrişim uygulamayı</li>
<li>PyTorch Conv1d API'sinin gerektirdiği gibi <code>(B, T, E)</code> ve <code>(B, E, T)</code> arasında şekil değiştirmeyi</li>
<li>Kim'in 2014 TextCNN'ini birden çok kernel genişliği ve global max pooling ile uygulamayı</li>
<li>CNN duygu sınıflandırıcısını eğitip değerlendirmeyi ve MLP baseline ile karşılaştırmayı</li>
<li>Kısa dizili NLP görevlerinde Conv1d'nin attention'ı maliyet/doğrulukta ne zaman yendiğine karar vermeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. NLP için Neden Evrişimler?</h2>

<p class="l-text"><code>(B, T, E)</code> embedding'lerine uygulanan bir MLP her token'ı bağımsız ele alır. Yerel örüntüleri kaçırır -- "not good" "not" ve "good"dan ayrı bir şey ifade etmelidir. 1B evrişim dizinin üzerinde küçük bir pencere kaydırır ve tam olarak bu kısa n-gram örüntülerini algılar.</p>

<div class="calc-highlight"><strong>Evrişim = paylaşılan ağırlıklı yerel örüntü algılayıcı.</strong> Her pozisyonda aynı kernel uygulanır; bir ağırlık matrisi nerede görünürse görünsün "olumsuzluk + sıfat" algılamayı öğrenir. Bu <em>ağırlık paylaşımı</em> CNN'leri verimli yapan şeydir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yerellik</div><div class="card-body">Her çıktı pozisyonu yalnızca küçük bir girdi penceresine bağlıdır. Hesaplaması ucuz, yerel yapıyı yakalar.</div></div>
<div class="calc-card"><div class="card-title">Ağırlık paylaşımı</div><div class="card-body">Aynı kernel her pozisyonda uygulanır. Tam bağlı katmandan çok daha az parametre.</div></div>
<div class="calc-card"><div class="card-title">Öteleme değişmezliği</div><div class="card-body">Pozisyon 5'te algılanan bir örüntü pozisyon 50'de de algılanır. Konum örnekler arasında değiştiğinde kullanışlı.</div></div>
<div class="calc-card"><div class="card-title">Hiyerarşi</div><div class="card-body">Evrişimleri yığın ve alıcı alan büyür -- erken katmanlar karakter/kelime, geç katmanlar ifade görür.</div></div>
<div class="calc-card"><div class="card-title">Paralelizm</div><div class="card-body">Tüm çıktı pozisyonları GPU'da paralel hesaplanır. RNN'lerden çok daha hızlı.</div></div>
<div class="calc-card"><div class="card-title">Attention'a karşı ucuz</div><div class="card-body">Conv1d maliyeti katman başına O(T); attention O(T^2). Kısa diziler ve gecikme kritik uygulamalar için Conv kazanır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP'de ne zaman Conv1d'ye uzanılır</div><div class="example-body">Tweet uzunluklu metinde üretim duygu sınıflandırıcısı? Conv1d transformer'lardan daha hızlıdır, sıklıkla doğrulukta 1-2 puan içindedir. Konuşma tanıma fonem sınıflandırıcısı? Conv1d. NER baseline? CNN-BiLSTM-CRF, BERT'ten önce son teknolojiydi. 2014 Kim "Convolutional Neural Networks for Sentence Classification" makalesi, kelime embedding'leri üzerinde tek bir Conv1d katmanının çoğu görevde lojistik regresyonu yendiğini gösterdi.</div></div>

<div class="think-box"><div class="think-label">NLP için CNN vs RNN vs TRANSFORMER</div><div class="think-body">CNN sabit yerel pencereler görür, paralelize edilebilir, ucuz. RNN uzun mesafe bağımlılıklarını sıralı görür, yavaş. Transformer attention aracılığıyla her şeyi aynı anda görür, pahalı ama en doğru. Kısa metin + düşük gecikme için CNN seçin, akış/online çıkarım için RNN, doğruluk için transformer. Birçok üretim sistemi hâlâ Conv-LSTM hibritleri kullanır çünkü maliyet/doğruluk sweet spot'una vururlar.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. 2B Konvolüsyon Sezgisi (Görüntüler)</h2>

<p class="l-text">Metin için Conv1d kullanmadan önce, görüntülerde 2B konvolüsyona kısa bir ziyaret sezgiyi temellendirir. Matematik aynıdır; sadece bir ekstra mekansal boyut.</p>

<div class="katex-block">$$(I * K)(i, j) = \\sum_{m}\\sum_{n} I(i+m, j+n)\\,K(m, n)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">I</div><div class="card-body">Girdi görüntüsü (veya öznitelik haritası). Şekil <code>(C_in, H, W)</code>.</div></div>
<div class="calc-card"><div class="card-title">K</div><div class="card-body">Kernel (filtre), küçük öğrenilebilir matris. Şekil <code>(C_out, C_in, kH, kW)</code>.</div></div>
<div class="calc-card"><div class="card-title">i, j</div><div class="card-body">Çıktı pozisyonu. Konvolüsyon K'yı I üzerinde kaydırır.</div></div>
<div class="calc-card"><div class="card-title">m, n</div><div class="card-body">Kernel içindeki indeksler. Her çıktı pozisyonunda kernel penceresi üzerinde toplam.</div></div>
<div class="calc-card"><div class="card-title">stride</div><div class="card-body">Çıktı başına kaç pozisyon atlanacağı. stride=1 yoğun, stride=2 mekansal boyutu yarıya indirir.</div></div>
<div class="calc-card"><div class="card-title">padding</div><div class="card-body">Çıktı boyutu beklentilere uysun diye girdi etrafına eklenen sıfırlar (veya yansıma vb.).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Görüntü batch'i: (batch=2, channels=3 RGB, height=32, width=32)</span>
img = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">3</span>, <span class="num">32</span>, <span class="num">32</span>)

<span class="cm"># Conv2d: 16 çıkış kanalı, 3x3 kernel, stride 1, padding 1</span>
conv = nn.<span class="fn">Conv2d</span>(in_channels=<span class="num">3</span>, out_channels=<span class="num">16</span>, kernel_size=<span class="num">3</span>,
                 stride=<span class="num">1</span>, padding=<span class="num">1</span>)
out = <span class="fn">conv</span>(img)
<span class="fn">print</span>(out.shape)              <span class="cm"># torch.Size([2, 16, 32, 32])</span>

<span class="cm"># padding=1 ne yapar?</span>
<span class="cm"># Padding olmadan: 32x32 -&gt; 30x30 çünkü kernel kenarlara tam ulaşamaz</span>
<span class="cm"># padding=1 ile: her kenara sıfır eklenir, 32x32 32x32 kalır</span>
no_pad = nn.<span class="fn">Conv2d</span>(<span class="num">3</span>, <span class="num">16</span>, <span class="num">3</span>, padding=<span class="num">0</span>)(img)
<span class="fn">print</span>(no_pad.shape)           <span class="cm"># torch.Size([2, 16, 30, 30])</span>

<span class="cm"># Stride 2 mekansal boyutları yarıya indirir -- bir downsampling kalıbı</span>
down = nn.<span class="fn">Conv2d</span>(<span class="num">3</span>, <span class="num">16</span>, <span class="num">3</span>, stride=<span class="num">2</span>, padding=<span class="num">1</span>)(img)
<span class="fn">print</span>(down.shape)             <span class="cm"># torch.Size([2, 16, 16, 16])</span>

<span class="cm"># Parametreler: out * in * kH * kW + out (bias)</span>
<span class="fn">print</span>(conv.weight.shape)      <span class="cm"># torch.Size([16, 3, 3, 3])  -- (out, in, kH, kW)</span>
<span class="fn">print</span>(conv.bias.shape)        <span class="cm"># torch.Size([16])</span>
<span class="fn">print</span>(<span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> conv.<span class="fn">parameters</span>()))   <span class="cm"># 16*3*3*3 + 16 = 448</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">2B konvolüsyon kayan toplam-çarpımdır. Küçük numpy 'görüntü' üzerinde elle 3x3 kenar filtresi uygulayarak işlemi görsel olarak gösteriyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.signal import correlate2d

img = np.array([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
], dtype=float)

# Sobel-x (vertical edge detector)
kernel = np.array([[-1, 0, 1],
                   [-2, 0, 2],
                   [-1, 0, 1]])

out = correlate2d(img, kernel, mode='valid')
print('input image:\n', img.astype(int))
print('Sobel-x output (vertical edges):\n', out.astype(int))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Kanonik CIFAR-10 şekli olan 2 RGB 32x32 görüntülük sahte bir batch oluşturur. PyTorch NCHW düzenini kullanır: (batch, kanal, yükseklik, genişlik). 2) 16 çıkış filtresi ve 3x3 kernel ile bir Conv2d uygular; padding=1 kernel erişimini telafi ettiği için çıktı aynı mekansal boyutta 16 kanala sahiptir. 3) Padding olmadan çıktı 30x30 -- kernel kenar piksellerinin üzerinde merkezleyemediği için mekansal boyut (kernel_size - 1) küçülür. 4) Stride 2 çıktı başına iki pozisyon atlar, mekansal boyutları yarıya indirir; bu ResNet'te bloklar arasında kullanılan standart "downsampling konvolüsyonu"dur. 5) Ağırlık tensor şekli <code>(out, in, kH, kW)</code> -- 16 filtre, her biri tüm girdi kanalları arasında tarayan 3x3x3 tensor. Toplam parametreler: 448, 32*32*3 = 3072 girdiyi 32*32*16 = 16384 çıktıya eşleyen tam bağlı katmandan çok daha az (50M parametre olurdu).</p>

<div id="plot-pl6-conv-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> 2B konvolüsyonun şematiği: 3x3 kernel 5x5 girdi üzerinde kayar, 3x3 çıktı üretir (padding yok). Her çıktı pozisyonunda girdi penceresinin 9 hücresi kernel ile eleman bazlı çarpılır ve toplanır. Kernel'i bir adım sağa kaydır ve tekrar et. Aynı mekanizma 1B'de uygulanır, metin için kullandığımız budur.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Metin için Conv1d: Kurulum</h2>

<p class="l-text">Metin için girdi token embedding'leri dizisidir: embedding katmanınızdan <code>(B, T, E)</code> şekli. Conv1d kanal-önce bekler: <code>(B, E, T)</code>. Bu yüzden yaptığımız ilk şey transpoz almak. Konvolüsyondan sonra gerekirse geri transpoz alırız veya hemen havuzlarız.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

B, T, E = <span class="num">4</span>, <span class="num">20</span>, <span class="num">64</span>       <span class="cm"># batch=4, seq_len=20, embed_dim=64</span>

<span class="cm"># Adım 1: standart embedding çıktısı</span>
emb = torch.<span class="fn">randn</span>(B, T, E)
<span class="fn">print</span>(<span class="str">"embedding:"</span>, emb.shape)         <span class="cm"># (4, 20, 64)</span>

<span class="cm"># Adım 2: Conv1d için kanal-önce'ye transpoz al</span>
x = emb.<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)                 <span class="cm"># (4, 64, 20) -- (B, C_in, T)</span>
<span class="fn">print</span>(<span class="str">"transpoz sonrası:"</span>, x.shape)

<span class="cm"># Adım 3: 100 filtre boyut 3 ile Conv1d (bir "trigram algılayıcı")</span>
conv = nn.<span class="fn">Conv1d</span>(in_channels=<span class="num">64</span>, out_channels=<span class="num">100</span>, kernel_size=<span class="num">3</span>, padding=<span class="num">1</span>)
y = <span class="fn">conv</span>(x)
<span class="fn">print</span>(<span class="str">"conv1d sonrası:"</span>, y.shape)         <span class="cm"># (4, 100, 20) -- 100 kanal, aynı uzunluk</span>

<span class="cm"># Aktivasyon</span>
y = torch.<span class="fn">relu</span>(y)

<span class="cm"># Çoklu kernel boyutları -- Kim 2014 hilesi</span>
<span class="kw">class</span> <span class="fn">TextCNN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, embed_dim=<span class="num">64</span>, num_filters=<span class="num">100</span>, kernel_sizes=(<span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>)):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.convs = nn.<span class="fn">ModuleList</span>([
            nn.<span class="fn">Conv1d</span>(embed_dim, num_filters, k, padding=k//<span class="num">2</span>)
            <span class="kw">for</span> k <span class="kw">in</span> kernel_sizes
        ])
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="cm"># x: (B, T, E) -&gt; (B, E, T)</span>
        x = x.<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)
        outs = [torch.<span class="fn">relu</span>(<span class="fn">conv</span>(x)) <span class="kw">for</span> conv <span class="kw">in</span> self.convs]
        <span class="kw">return</span> outs              <span class="cm"># her kernel boyutu için (B, num_filters, T) listesi</span>

cnn = <span class="fn">TextCNN</span>()
out_list = <span class="fn">cnn</span>(emb)
<span class="kw">for</span> o <span class="kw">in</span> out_list:
    <span class="fn">print</span>(o.shape)              <span class="cm"># her kernel boyutu için (4, 100, 20)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Metin için Conv1d = token embedding'leri üzerinde kayan ağırlık penceresi. Sahte (cümle x embedding) matrisinde elle yapıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.signal import correlate

# Fake "embedding" sequence: 8 tokens x 4 dim
seq = np.random.default_rng(0).standard_normal((8, 4))

# 3-token window kernel (kernel_size=3, in_ch=4 -> out=1)
kernel = np.random.default_rng(1).standard_normal((3, 4))

# Compute conv as windowed dot products
out = []
for start in range(seq.shape[0] - 3 + 1):
    window = seq[start:start+3]                # (3, 4)
    out.append(float((window * kernel).sum())) # dot
out = np.array(out)
print('seq shape    :', seq.shape)
print('kernel shape :', kernel.shape)
print('conv output  :', out.round(3))
print('output length: input_len - kernel_size + 1 =', len(out))</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Standart NLP başlangıç noktası olan <code>(B, T, E) = (4, 20, 64)</code> şekilli bir embedding çıktısını hayal eder. 2) <code>nn.Conv1d</code> evrişim yapılan boyutu son ve kanalları ortada beklediği için <code>(B, E, T)</code>'ye transpoz alır. Bu tek transpoz NLP CNN kodunda en çok unutulan adımdır. 3) 100 çıkış filtresi ve kernel boyutu 3 ile bir Conv1d uygular; <code>padding=1</code> zaman boyutunu 20'de tutar. Çıkış şekli <code>(B, 100, T)</code>, artık her pozisyon başına 100 öznitelik kanalına sahibiz, her kanal öğrenilmiş bir trigram algılayıcısının yanıtıdır. 4) ReLU MLP'lerdeki gibi lineer olmayanlık ekler. 5) TextCNN sınıfı kanonik Kim 2014 mimarisini uygular: birden fazla kernel boyutunun (3, 4, 5) paralel evrişimleri kısa, orta ve daha uzun n-gram örüntülerini eş zamanlı yakalar. Forward sonra havuzlayıp birleştireceğimiz bir öznitelik haritası listesi döner.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">in_channels</div><div class="card-body">İlk Conv katmanı için embedding boyutu (örn. 64, 300, 768).</div></div>
<div class="calc-card"><div class="card-title">out_channels</div><div class="card-body">Çıktıdaki filtre / öznitelik kanalı sayısı. Her biri ayrı bir algılayıcı.</div></div>
<div class="calc-card"><div class="card-title">kernel_size</div><div class="card-body">Zamanda pencere boyutu. 3 = trigram, 5 = 5-gram. Yaygın: paralel 3, 4, 5.</div></div>
<div class="calc-card"><div class="card-title">padding=k//2</div><div class="card-body">Kernel'in yarısına eşit padding çıktı uzunluğunu girdi uzunluğuna eşit tutar.</div></div>
<div class="calc-card"><div class="card-title">stride</div><div class="card-body">NLP'de genellikle 1; pooling downsampling'i halleder.</div></div>
<div class="calc-card"><div class="card-title">dilation</div><div class="card-body">Kernel elemanları arasındaki boşluk. Genişletilmiş conv'lar aynı parametre sayısıyla daha geniş bağlam kapsar.</div></div>
</div>

<div class="l-warn"><strong>Tuzak:</strong> Transpoz almayı unutmak. <code>(B, T, E)</code>'yi doğrudan <code>Conv1d(in=E, ...)</code>'ye verirseniz, E'yi zaman ekseni sanır ve onun boyunca evrişim yapar -- çöp alırsınız, hata yok. Her zaman önce transpoz alın veya netlik için <code>einops.rearrange</code> kullanın.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Pooling: Maks, Ortalama, Adaptif</h2>

<p class="l-text">Pooling T uzunluklu bir öznitelik haritasını sabit boyutlu bir gösterime indirger, en önemli öznitelikleri nerede göründüklerinden bağımsız özetler. Maks pooling metin için standart seçimdir -- "bu filtre bir yerde güçlü ateşledi" kullanışlı bir sinyaldir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

x = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">100</span>, <span class="num">20</span>)          <span class="cm"># (B, C, T)</span>

<span class="cm"># 1) Küresel maks pool -- kanal başına bir sayı</span>
pooled = F.<span class="fn">adaptive_max_pool1d</span>(x, output_size=<span class="num">1</span>).<span class="fn">squeeze</span>(-<span class="num">1</span>)
<span class="fn">print</span>(pooled.shape)                  <span class="cm"># (2, 100)</span>

<span class="cm"># 2) Kernel 2, stride 2 ile yerel maks pool -- uzunluğu yarıya indirir</span>
local = F.<span class="fn">max_pool1d</span>(x, kernel_size=<span class="num">2</span>, stride=<span class="num">2</span>)
<span class="fn">print</span>(local.shape)                   <span class="cm"># (2, 100, 10)</span>

<span class="cm"># 3) Küresel ortalama pool</span>
avg = F.<span class="fn">adaptive_avg_pool1d</span>(x, output_size=<span class="num">1</span>).<span class="fn">squeeze</span>(-<span class="num">1</span>)
<span class="fn">print</span>(avg.shape)                     <span class="cm"># (2, 100)</span>

<span class="cm"># 4) k-maks pooling (kanal başına en üst k değer) -- yalnızca maks'tan daha zengin</span>
<span class="kw">def</span> <span class="fn">k_max_pool</span>(x, k=<span class="num">3</span>):
    <span class="cm"># x: (B, C, T)</span>
    <span class="kw">return</span> torch.<span class="fn">topk</span>(x, k, dim=-<span class="num">1</span>).values      <span class="cm"># (B, C, k)</span>
<span class="fn">print</span>(<span class="fn">k_max_pool</span>(x, k=<span class="num">3</span>).shape)      <span class="cm"># (2, 100, 3)</span>

<span class="cm"># Bir araya getirelim: çoklu kernel + küresel maks ile TextCNN forward</span>
<span class="kw">class</span> <span class="fn">TextCNN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, embed_dim=<span class="num">128</span>, num_filters=<span class="num">100</span>,
                 kernel_sizes=(<span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>), num_classes=<span class="num">2</span>, dropout=<span class="num">0.5</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(vocab_size, embed_dim, padding_idx=<span class="num">0</span>)
        self.convs = nn.<span class="fn">ModuleList</span>([
            nn.<span class="fn">Conv1d</span>(embed_dim, num_filters, k, padding=k//<span class="num">2</span>)
            <span class="kw">for</span> k <span class="kw">in</span> kernel_sizes
        ])
        self.dropout = nn.<span class="fn">Dropout</span>(dropout)
        self.fc = nn.<span class="fn">Linear</span>(num_filters * <span class="fn">len</span>(kernel_sizes), num_classes)

    <span class="kw">def</span> <span class="fn">forward</span>(self, ids, mask=<span class="kw">None</span>):
        <span class="cm"># ids: (B, T)</span>
        x = self.<span class="fn">embed</span>(ids)                   <span class="cm"># (B, T, E)</span>
        x = x.<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)                 <span class="cm"># (B, E, T)</span>
        <span class="cm"># Her conv'u uygula, ReLU, sonra zaman üzerinde küresel maks-pool</span>
        feats = []
        <span class="kw">for</span> conv <span class="kw">in</span> self.convs:
            f = torch.<span class="fn">relu</span>(<span class="fn">conv</span>(x))            <span class="cm"># (B, F, T)</span>
            <span class="kw">if</span> mask <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
                <span class="cm"># padding'i pooling'den önce maskele</span>
                mb = mask.<span class="fn">unsqueeze</span>(<span class="num">1</span>).<span class="fn">bool</span>()  <span class="cm"># (B, 1, T)</span>
                f = f.<span class="fn">masked_fill</span>(~mb, <span class="fn">float</span>(<span class="str">"-inf"</span>))
            f = F.<span class="fn">adaptive_max_pool1d</span>(f, <span class="num">1</span>).<span class="fn">squeeze</span>(-<span class="num">1</span>)   <span class="cm"># (B, F)</span>
            feats.<span class="fn">append</span>(f)
        h = torch.<span class="fn">cat</span>(feats, dim=-<span class="num">1</span>)          <span class="cm"># (B, F * num_kernel_sizes)</span>
        h = self.<span class="fn">dropout</span>(h)
        <span class="kw">return</span> self.<span class="fn">fc</span>(h)                     <span class="cm"># (B, C)</span>

cnn = <span class="fn">TextCNN</span>(vocab_size=<span class="num">10000</span>)
ids = torch.<span class="fn">randint</span>(<span class="num">1</span>, <span class="num">10000</span>, (<span class="num">4</span>, <span class="num">20</span>))
mask = torch.<span class="fn">ones</span>(<span class="num">4</span>, <span class="num">20</span>)
out = <span class="fn">cnn</span>(ids, mask)
<span class="fn">print</span>(out.shape)                              <span class="cm"># (4, 2)</span>
<span class="fn">print</span>(<span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> cnn.<span class="fn">parameters</span>()))  <span class="cm"># parametre sayısı</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pooling dizinin uzunluğunu azaltır: max-pool en güçlü aktivasyonu, mean-pool ortalamayı tutar -- ikisi de NumPy ile uygulanmış.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.array([3.0, 1.0, 4.0, 1.0, 5.0, 9.0, 2.0, 6.0, 5.0, 3.0])

# Max pool with kernel=2, stride=2
def max_pool1d(x, k=2):
    return np.array([x[i:i+k].max() for i in range(0, len(x) - k + 1, k)])
def avg_pool1d(x, k=2):
    return np.array([x[i:i+k].mean() for i in range(0, len(x) - k + 1, k)])

# Adaptive pool to a target length L (chunk-then-mean)
def adaptive_avg_pool1d(x, L):
    chunks = np.array_split(x, L)
    return np.array([c.mean() for c in chunks])

print('input             :', x)
print('max_pool (k=2)    :', max_pool1d(x, 2))
print('avg_pool (k=2)    :', avg_pool1d(x, 2).round(3))
print('adaptive_avg L=3  :', adaptive_avg_pool1d(x, 3).round(3))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>adaptive_max_pool1d(x, 1)</code> girdi uzunluğundan bağımsız olarak zaman boyutu boyunca maksimumu alır -- bu "küresel maks pool"dur ve kanal başına bir sayı üretir. <code>(B, C)</code> almak için boyutu 1 olan sondaki ekseni squeeze ederiz. 2) Stride 2 ile yerel maks pool zaman boyutunu yarıya indirir; hiyerarşik CNN'ler için kullanışlı ama NLP'de nadir (genellikle sonda küresel olarak havuzlarız). 3) Küresel ortalama pool aynı fikir ama ortalama ile. Metinde daha az yaygın -- maks "bu örüntü göründü mü?" yakalarken ortalama "ne kadar güçlü ortalama?" yakalar. 4) k-maks pooling kanal başına en yüksek k değeri tutar, bu yalnızca maks'tan daha fazla bilgi tutar -- daha zengin gösterimler için kullanışlı. 5) Tam TextCNN her conv'u paralel çalıştırır, ReLU uygular, padding'i <code>-inf</code>'e maskeler ki asla maks olamasın, her birini küresel-maks-havuzlar ve tek bir vektöre birleştirir. Son Linear sınıf logitlerine yansıtır. Bu mimari, belki 200k parametreyle, hesaplamanın çok küçük bir kısmıyla kısa metin sınıflandırmada sıklıkla LSTM'leri yener.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Maks pool</div><div class="compare-item">Kanal başına en güçlü aktivasyonu seçer</div><div class="compare-item">"Bu özellik göründü mü?" yakalar</div><div class="compare-item">Metin sınıflandırması için varsayılan</div><div class="compare-item">Pozisyon değişmez</div></div>
<div class="compare-col"><div class="compare-title">Ortalama pool</div><div class="compare-item">Kanal başına tüm aktivasyonları ortalar</div><div class="compare-item">"Ortalama olarak ne sıklıkla / ne kadar güçlü" yakalar</div><div class="compare-item">Görüntü regresyon başlıkları için yaygın</div><div class="compare-item">Maks'tan daha pürüzsüz gradyanlar</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Filtre Davranışını Görselleştirme</h2>

<p class="l-text">Eğitimden sonra CNN ne öğrendi? Hangi n-gram'ların her filtreyi en güçlü tetiklediğini görselleştirebilirsiniz -- bu mimarinin sunduğu "yorumlanabilirliğe" en yakın şeydir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

<span class="cm"># Diyelim ki kernel boyutu 3 ve tek bir Conv1d katmanı olan eğitilmiş bir TextCNN'imiz var</span>
<span class="cm"># ve filtre #7'yi en çok hangi trigram'ların heyecanlandırdığını bulmak istiyoruz.</span>

<span class="cm"># embeddings: (V, E) -- sözlük embedding matrisi</span>
<span class="cm"># conv.weight: (F, E, 3) -- F filtre, embed boyutu E, kernel 3</span>

<span class="at">@torch.no_grad</span>()
<span class="kw">def</span> <span class="fn">top_trigrams_for_filter</span>(model, vocab, sentences, filter_idx=<span class="num">7</span>, top_k=<span class="num">5</span>):
    model.<span class="fn">eval</span>()
    scores_per_trigram = {}
    <span class="kw">for</span> sent <span class="kw">in</span> sentences:
        ids = torch.<span class="fn">tensor</span>([[vocab.<span class="fn">get</span>(w, <span class="num">1</span>) <span class="kw">for</span> w <span class="kw">in</span> sent.<span class="fn">split</span>()]])
        emb = model.<span class="fn">embed</span>(ids).<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)        <span class="cm"># (1, E, T)</span>
        <span class="cm"># Yalnızca bir conv uygula (modelin self.convs[0] kernel boyutu 3 olduğunu varsay)</span>
        feat = model.convs[<span class="num">0</span>](emb)                    <span class="cm"># (1, F, T)</span>
        <span class="cm"># Filtremizin her pozisyondaki aktivasyon değerleri</span>
        f_act = feat[<span class="num">0</span>, filter_idx]                   <span class="cm"># (T,)</span>
        <span class="cm"># Pozisyon t'de merkezlenmiş trigram words[t-1: t+2] (padding ile)</span>
        words = sent.<span class="fn">split</span>()
        <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="fn">len</span>(words)-<span class="num">1</span>):
            tri = <span class="str">" "</span>.<span class="fn">join</span>(words[t-<span class="num">1</span>: t+<span class="num">2</span>])
            scores_per_trigram[tri] = <span class="fn">max</span>(scores_per_trigram.<span class="fn">get</span>(tri, -<span class="num">1e9</span>),
                                          f_act[t].<span class="fn">item</span>())
    <span class="cm"># Top-k</span>
    <span class="kw">return</span> <span class="fn">sorted</span>(scores_per_trigram.<span class="fn">items</span>(), key=<span class="kw">lambda</span> kv: -kv[<span class="num">1</span>])[:top_k]

<span class="cm"># Örnek çıktı (sahte, açıklayıcı):</span>
<span class="cm"># filtre 7 en sert ateşler:</span>
<span class="cm">#   ("not very good", 4.21)</span>
<span class="cm">#   ("absolutely awful film", 4.05)</span>
<span class="cm">#   ("really really bad", 3.98)</span>
<span class="cm">#   ("hated every minute", 3.91)</span>
<span class="cm">#   ("worst movie ever", 3.87)</span>
<span class="cm"># -&gt; filtre 7 "negatif duygu trigramlarını" algılamayı öğrenmiş</span>
<span class="fn">print</span>(<span class="str">"Sahte çıktı: filtre 7 negatif duygu ipuçlarını öğrenmiş"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Filtrelerin ne yakaladığını görselleştir: gürültülü bir görüntüye 4 rastgele 3x3 filtre uygula -- aktivasyonları farklı kalıpları öne çıkarır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.signal import correlate2d

rng = np.random.default_rng(0)
image  = rng.standard_normal((10, 10))
filters = rng.standard_normal((4, 3, 3))   # 4 filters

print('per-filter activation stats:')
for i, k in enumerate(filters):
    fmap = correlate2d(image, k, mode='valid')
    print(f'  filter {i}: shape {fmap.shape}, '
          f'mean {fmap.mean():.3f}, max {fmap.max():.3f}, min {fmap.min():.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Cümle listesi üzerinde yineler ve her birini embedding + ilk Conv1d üzerinden çalıştırır. 2) Belirli bir filtrenin (burada filtre 7) aktivasyon haritasını çıkarır; bu haritada her pozisyon o trigram'da filtrenin yanıtıdır. 3) Her cümledeki her trigram için, o trigram için gözlenen maksimum aktivasyonu kaydeder. 4) Filtreyi en sert ateşleyen ilk k trigram'ı döner -- bunlar filtrenin algılamayı öğrendiği örüntülerdir. 5) Duygu üzerine bir TextCNN eğittikten sonra, genellikle uzmanlaşmış filtreler bulursunuz: bazıları olumsuzluk örüntülerinde, bazıları üstün dereceli sıfatlarda, bazıları duygu kelimelerinde ateşler. Bu tür post-hoc yorumlama araştırmacıların CNN'in "doğru şeyi" öğrendiğini doğrulama yöntemidir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: üretim yorumlanabilirliği</div><div class="example-body">Gerçek bir üretim hilesi: bir duygu sınıflandırıcısı güçlü negatif tahmin ettiğinde, hangi 1-2 filtrenin en sert ateşlediğine ve hangi trigramların onları tetiklediğine bakın. Kullanıcıya "bu inceleme şunlar nedeniyle işaretlendi: 'absolutely awful', 'waste of time', 'never again'" gösterebilirsiniz -- düz İngilizcede şeffaf bir açıklama. Bunu bir transformer ile deneyin ve net yorumlanması çok daha zor olan attention ısı haritaları alırsınız.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Yığılmış CNN'ler ve Alıcı Alan</h2>

<p class="l-text">Kernel boyutu 3 olan tek Conv katmanı yalnızca 3 token görür. İki yığın ve her çıktı pozisyonu 5 görür; üç yığın ve 7 görür. Bu büyüyen pencereye <em>alıcı alan</em> denir. Stride veya dilation ile daha da hızlı büyür.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

<span class="kw">class</span> <span class="fn">DeepTextCNN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, embed_dim=<span class="num">128</span>, hidden=<span class="num">128</span>, num_classes=<span class="num">2</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(vocab_size, embed_dim, padding_idx=<span class="num">0</span>)
        <span class="cm"># 4 yığılmış conv: kernel 3, padding 1, gizli kanallar</span>
        self.layers = nn.<span class="fn">Sequential</span>(
            nn.<span class="fn">Conv1d</span>(embed_dim, hidden, <span class="num">3</span>, padding=<span class="num">1</span>),
            nn.<span class="fn">ReLU</span>(),
            nn.<span class="fn">Conv1d</span>(hidden, hidden, <span class="num">3</span>, padding=<span class="num">1</span>),
            nn.<span class="fn">ReLU</span>(),
            nn.<span class="fn">Conv1d</span>(hidden, hidden, <span class="num">3</span>, padding=<span class="num">1</span>, dilation=<span class="num">2</span>),   <span class="cm"># dilation alıcı alanı genişletir</span>
            nn.<span class="fn">ReLU</span>(),
            nn.<span class="fn">Conv1d</span>(hidden, hidden, <span class="num">3</span>, padding=<span class="num">1</span>, dilation=<span class="num">4</span>),
            nn.<span class="fn">ReLU</span>(),
        )
        self.fc = nn.<span class="fn">Linear</span>(hidden, num_classes)

    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        x = self.<span class="fn">embed</span>(ids).<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)        <span class="cm"># (B, E, T)</span>
        x = self.<span class="fn">layers</span>(x)                          <span class="cm"># (B, H, T)</span>
        x = F.<span class="fn">adaptive_max_pool1d</span>(x, <span class="num">1</span>).<span class="fn">squeeze</span>(-<span class="num">1</span>)
        <span class="kw">return</span> self.<span class="fn">fc</span>(x)

<span class="cm"># Alıcı alan: kernel 3 ve dilation 1, 1, 2, 4 ile 1 + 2 + 2 + 4 + 8 = 17 pozisyon görürüz</span>
<span class="cm"># Dilation olmadan aynı derinlik için yalnızca 1 + 2*4 = 9 pozisyon olurdu</span>
m = <span class="fn">DeepTextCNN</span>(vocab_size=<span class="num">10000</span>)
ids = torch.<span class="fn">randint</span>(<span class="num">1</span>, <span class="num">10000</span>, (<span class="num">4</span>, <span class="num">64</span>))
out = <span class="fn">m</span>(ids)
<span class="fn">print</span>(out.shape)            <span class="cm"># (4, 2)</span>
<span class="fn">print</span>(<span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> m.<span class="fn">parameters</span>()))</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Yığılmış CNN'ler alıcı alanı büyütür. Üst üste iki 3x3 katman etkili olarak 5x5 bir bölgeyi görür -- bunu tek bir çıktıyı etkileyen giriş hücrelerini sayarak doğruluyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.signal import correlate2d

x = np.zeros((9, 9))
x[4, 4] = 1.0   # single bright pixel in the center

k1 = np.ones((3, 3))
k2 = np.ones((3, 3))

# After one conv: 3x3 region lit up around (4,4)
out1 = correlate2d(x, k1, mode='same')
# After two convs stacked
out2 = correlate2d(out1, k2, mode='same')

# Count how many cells are affected
print('after 1 conv: nonzero cells =', int((out1 != 0).sum()))
print('after 2 conv: nonzero cells =', int((out2 != 0).sum()))
print('receptive field grows from 3x3 (=9) to 5x5 (=25) -- exactly the pattern.')
print('out2 around the center:\n', out2[2:7, 2:7].astype(int))</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Katmanlar arasında aynı gizli genişlikte 4 katmanlı derin bir CNN tanımlar. Her Conv1d zaman boyutunu <code>padding=1</code> ile sabit tutar. 2) Katman 3 ve 4 <em>dilation</em> kullanır: elemanlar arasında boşluklu kerneller. Dilation 2, kernel'in 5 girdi pozisyonunu kapsadığı ama yalnızca 3'ünü kullandığı (her ikinciyi) anlamına gelir ve dilation 4, 3 eleman için 9 pozisyon kapsar. Bu, parametre eklemeden alıcı alanı üstel olarak genişletir. 3) Alıcı alan aritmetiği: kernel 3 ve dilation <code>(1, 1, 2, 4)</code> ile son çıktı yaklaşık 17 girdi pozisyonu görür -- anlamlı cümle seviyesi örüntüleri yakalamak için yeterli. 4) Tüm conv katmanlarından sonra küresel maks pooling zaman boyutunu çökertir ve lineer başlık logit üretir. Bu tür genişletilmiş TextCNN, WaveNet'in (ses) ve birkaç transformer olmayan NLP encoder'ın arkasındaki mimaridir.</p>

<div id="plot-pl6-rf-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Kernel 3 ile yığılmış Conv1d katmanları boyunca alıcı alan büyümesi. Yoğun konvolüsyonlar (dilation yok) lineer büyür: katman L yaklaşık 2L+1 pozisyon görür. Genişletilmiş konvolüsyonlar dilation 1, 2, 4, 8 olduğunda üstel büyür: katman 4 yaklaşık 17 pozisyon, katman 6 yaklaşık 65. WaveNet gibi ses modelleri bu şekilde verimli şekilde saniyelerce bağlam yakalar.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Mini Uçtan Uca: TextCNN ile Duygu</h2>

<p class="l-text">Bir TextCNN'i gerçekten eğitme zamanı (yani oyuncak veride). Betik Ders 5'in eğitim döngüsünü yeniden kullanır, modeli CNN'imize değiştirir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader, random_split
<span class="kw">from</span> torch.nn.utils.rnn <span class="kw">import</span> pad_sequence

torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)
device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>

<span class="cm"># --- model ---</span>
<span class="kw">class</span> <span class="fn">TextCNN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, V, E=<span class="num">128</span>, F=<span class="num">64</span>, kernel_sizes=(<span class="num">3</span>,<span class="num">4</span>,<span class="num">5</span>), C=<span class="num">2</span>, drop=<span class="num">0.3</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(V, E, padding_idx=<span class="num">0</span>)
        self.convs = nn.<span class="fn">ModuleList</span>([nn.<span class="fn">Conv1d</span>(E, F, k, padding=k//<span class="num">2</span>) <span class="kw">for</span> k <span class="kw">in</span> kernel_sizes])
        self.drop = nn.<span class="fn">Dropout</span>(drop)
        self.fc = nn.<span class="fn">Linear</span>(F * <span class="fn">len</span>(kernel_sizes), C)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids, mask):
        x = self.<span class="fn">embed</span>(ids).<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)        <span class="cm"># (B, E, T)</span>
        feats = []
        <span class="kw">for</span> conv <span class="kw">in</span> self.convs:
            f = torch.<span class="fn">relu</span>(<span class="fn">conv</span>(x))                 <span class="cm"># (B, F, T)</span>
            mb = mask.<span class="fn">unsqueeze</span>(<span class="num">1</span>).<span class="fn">bool</span>()
            f = f.<span class="fn">masked_fill</span>(~mb, <span class="fn">float</span>(<span class="str">"-inf"</span>))
            f = <span class="fn">F_pool</span>(f).<span class="fn">squeeze</span>(-<span class="num">1</span>)
            feats.<span class="fn">append</span>(f)
        h = self.<span class="fn">drop</span>(torch.<span class="fn">cat</span>(feats, dim=-<span class="num">1</span>))
        <span class="kw">return</span> self.<span class="fn">fc</span>(h)

<span class="kw">def</span> <span class="fn">F_pool</span>(x):
    <span class="kw">return</span> F.<span class="fn">adaptive_max_pool1d</span>(x, <span class="num">1</span>)

<span class="cm"># --- veri, L5 oyuncaktan kopyala ---</span>
<span class="kw">class</span> <span class="fn">TextDS</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, texts, labels, vocab, max_len=<span class="num">20</span>):
        self.t, self.y, self.v, self.m = texts, labels, vocab, max_len
    <span class="kw">def</span> <span class="fn">__len__</span>(self): <span class="kw">return</span> <span class="fn">len</span>(self.t)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i):
        ids = [self.v.<span class="fn">get</span>(t, <span class="num">1</span>) <span class="kw">for</span> t <span class="kw">in</span> self.t[i].<span class="fn">lower</span>().<span class="fn">split</span>()][:self.m]
        <span class="kw">return</span> {<span class="str">"input_ids"</span>: torch.<span class="fn">tensor</span>(ids, dtype=torch.long),
                <span class="str">"label"</span>: torch.<span class="fn">tensor</span>(self.y[i], dtype=torch.long)}

<span class="kw">def</span> <span class="fn">collate</span>(batch):
    ids = [b[<span class="str">"input_ids"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch]
    y = torch.<span class="fn">stack</span>([b[<span class="str">"label"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch])
    p = <span class="fn">pad_sequence</span>(ids, batch_first=<span class="kw">True</span>, padding_value=<span class="num">0</span>)
    m = (p != <span class="num">0</span>).<span class="fn">float</span>()
    <span class="kw">return</span> {<span class="str">"input_ids"</span>: p, <span class="str">"attention_mask"</span>: m, <span class="str">"labels"</span>: y}

texts = [<span class="str">"amazing movie"</span>, <span class="str">"terrible film"</span>, <span class="str">"great cast"</span>, <span class="str">"boring plot"</span>,
         <span class="str">"loved it"</span>, <span class="str">"hated it"</span>, <span class="str">"fantastic experience"</span>, <span class="str">"awful waste"</span>] * <span class="num">15</span>
labels = [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>] * <span class="num">15</span>
vocab = {<span class="str">"&lt;pad&gt;"</span>:<span class="num">0</span>, <span class="str">"&lt;unk&gt;"</span>:<span class="num">1</span>}
<span class="kw">for</span> t <span class="kw">in</span> texts:
    <span class="kw">for</span> w <span class="kw">in</span> t.<span class="fn">lower</span>().<span class="fn">split</span>(): vocab.<span class="fn">setdefault</span>(w, <span class="fn">len</span>(vocab))

ds = <span class="fn">TextDS</span>(texts, labels, vocab)
gen = torch.<span class="fn">Generator</span>().<span class="fn">manual_seed</span>(<span class="num">0</span>)
tr, va = <span class="fn">random_split</span>(ds, [<span class="num">0.8</span>, <span class="num">0.2</span>], generator=gen)
tl = <span class="fn">DataLoader</span>(tr, batch_size=<span class="num">8</span>, shuffle=<span class="kw">True</span>, collate_fn=collate)
vl = <span class="fn">DataLoader</span>(va, batch_size=<span class="num">8</span>, collate_fn=collate)

model = <span class="fn">TextCNN</span>(V=<span class="fn">len</span>(vocab)).<span class="fn">to</span>(device)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>, weight_decay=<span class="num">0.01</span>)
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>):
    model.<span class="fn">train</span>()
    <span class="kw">for</span> b <span class="kw">in</span> tl:
        opt.<span class="fn">zero_grad</span>()
        ids, m, y = b[<span class="str">"input_ids"</span>].<span class="fn">to</span>(device), b[<span class="str">"attention_mask"</span>].<span class="fn">to</span>(device), b[<span class="str">"labels"</span>].<span class="fn">to</span>(device)
        loss = <span class="fn">loss_fn</span>(<span class="fn">model</span>(ids, m), y)
        loss.<span class="fn">backward</span>()
        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
        opt.<span class="fn">step</span>()
    <span class="cm"># eval</span>
    model.<span class="fn">eval</span>()
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        correct = total = <span class="num">0</span>
        <span class="kw">for</span> b <span class="kw">in</span> vl:
            ids, m, y = b[<span class="str">"input_ids"</span>].<span class="fn">to</span>(device), b[<span class="str">"attention_mask"</span>].<span class="fn">to</span>(device), b[<span class="str">"labels"</span>].<span class="fn">to</span>(device)
            correct += (<span class="fn">model</span>(ids, m).<span class="fn">argmax</span>(-<span class="num">1</span>) == y).<span class="fn">sum</span>().<span class="fn">item</span>()
            total += y.<span class="fn">size</span>(<span class="num">0</span>)
    <span class="fn">print</span>(f<span class="str">"epoch {epoch+1}: val_acc = {correct/total:.3f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Karakter n-gram TF-IDF + lojistik regresyon ile mini uçtan uca metin sınıflandırıcı -- TextCNN'in sklearn karşılığı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)

# Character n-grams = TextCNN style local feature detectors
vec = TfidfVectorizer(analyzer='char_wb', ngram_range=(3, 5), max_features=3000)
Xt_tr = vec.fit_transform(X_tr)
Xt_te = vec.transform(X_te)

clf = LogisticRegression(max_iter=500, C=2.0).fit(Xt_tr, y_tr)
acc = accuracy_score(y_te, clf.predict(Xt_te))
print(f'char-ngram TF-IDF + LR accuracy: {acc:.3f}')
print('feature dim:', Xt_tr.shape[1])</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Tartışıldığı gibi tam olarak TextCNN tanımlar: embedding, kernel boyutları 3, 4, 5 olan üç paralel Conv1d dalı, ReLU, maskelenmiş küresel-maks-pool, birleştir, dropout, sınıflandırıcı. 2) Ders 4/5 veri boru hattını yeniden kullanır -- oyuncak pozitif/negatif cümleler, padding ve maske ile özel collate. 3) Yeniden üretilebilir bölme ile train/val DataLoader'ları kurar. 4) AdamW, weight decay, gradyan kırpma ile 8 epoch eğitir -- Ders 5'ten standart tarif. 5) Her epoch doğrulamada değerlendirir; bu önemsiz oyuncak veride 2-3 epoch içinde doğruluğun 1.0'a tırmandığını görmelisiniz. Gerçek IMDb'de (50k inceleme) bu aynı mimari birkaç dakikada ~%88 doğruluğa ulaşır -- hesaplamanın küçük bir kısmında LSTM'lere yakın.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: CNN ne zaman transformer'ı yener</div><div class="example-body">İstek başına gecikme bütçeniz CPU'da 10ms. BERT-base çıkarımı 50-200ms; 200k parametreli TextCNN 1-3ms. Günde milyon mesajlı bir sohbet platformunda toksik yorum moderasyonu için TextCNN doğru cevaptır. Birkaç yüzde puan doğruluk verirsiniz ve 50x verim kazanırsınız. Araçları kısıtlamalara göre seçin.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Toparlanma</h2>

<p class="l-text">CNN'ler NLP için düşündüğünüzden daha sık doğru araçtır. Hızlı, paralelize edilebilir, yorumlanabilir ve kısa metin görevlerinde rekabetçidirler. Transformer devrimi gerçektir ama 200k parametreli bir CNN'in tam olarak doğru cevap olduğu durumları silmez.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">CNN güçlü yönleri</div><div class="compare-item">Hızlı çıkarım (CPU'da 1-3ms)</div><div class="compare-item">Az parametre</div><div class="compare-item">Filtre başına yorumlaması kolay</div><div class="compare-item">Kısa metin, gecikme kritik uygulamalarda iyi</div><div class="compare-item">Karesel bellek maliyeti yok</div></div>
<div class="compare-col"><div class="compare-title">CNN zayıflıkları</div><div class="compare-item">Uzun belgeler için sınırlı alıcı alan</div><div class="compare-item">Pozisyon değişmezliği sözdizimsel görevlere zarar verebilir</div><div class="compare-item">Çoğu benchmark'ta son teknoloji değil</div><div class="compare-item">Uzun mesafe bağımlılık modellemesi yok</div><div class="compare-item">Araştırmada transformer'larla değiştirildi</div></div>
</div>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Konvolüsyon = paylaşılan ağırlıklı yerel örüntü algılayıcı. Ucuz ve paralelize edilebilir.<br><strong>2.</strong> Görüntüler için <code>nn.Conv2d</code> NCHW kullanır: <code>(B, C, H, W)</code>. Ağırlık şekli <code>(out, in, kH, kW)</code>.<br><strong>3.</strong> Metin için <code>nn.Conv1d</code> <code>(B, C, T)</code> kullanır. Embedding çıktısını HER ZAMAN önce <code>(B, T, E) -&gt; (B, E, T)</code> transpoze edin.<br><strong>4.</strong> Çoklu kernel TextCNN (Kim 2014): kernel 3, 4, 5 ile paralel Conv1d; ReLU; küresel maks-pool; birleştir; sınıflandır.<br><strong>5.</strong> Padding'i pooling'den önce maskeleyin ki asla maks olmasın: <code>f.masked_fill(~mask_bool, float("-inf"))</code>.<br><strong>6.</strong> Alıcı alanı lineer büyütmek için conv'ları yığın; ekstra parametre olmadan üstel büyütmek için dilation kullanın.<br><strong>7.</strong> Filtre görselleştirme (filtre başına top-k trigram) konuşlandırabileceğiniz en ucuz yorumlanabilirlik aracıdır.<br><strong>8.</strong> Sonraki ders: RNN'ler ve LSTM'ler -- daha uzun bağımlılıkları yöneten sıralı modeller, daha yavaş ama daha ifade gücü yüksek.</div></div>
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

  function convPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    // Build a 5x5 input grid as heatmap with kernel 3x3 highlight
    var z = [];
    for (var i=0;i<5;i++){var row=[];for (var j=0;j<5;j++){row.push((i+j)%3 + Math.random()*0.3);}z.push(row);}
    var inputTr = {z: z, type:'heatmap', colorscale:[[0,'rgba(40,30,20,0.4)'],[1,'rgba(200,169,110,0.9)']], showscale:false, name:'input'};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'2D Konvolüsyon: 3x3 çekirdek 5x5 girdi üzerinde':'2D Convolution: 3x3 kernel over 5x5 input', font:{color:T.text,size:14}},
      xaxis:{visible:false, scaleanchor:'y'},
      yaxis:{visible:false, autorange:'reversed'},
      shapes:[
        {type:'rect', x0:-0.5, y0:-0.5, x1:2.5, y1:2.5, line:{color:'#4ecdc4', width:3}},
        {type:'rect', x0:0.5, y0:0.5, x1:3.5, y1:3.5, line:{color:'#4ecdc4', width:1, dash:'dot'}},
      ],
      annotations:[{x:1, y:1, text: lang==='tr'?'çekirdek pozisyon 1':'kernel pos 1', showarrow:false, font:{color:'white',size:10}}]
    });
    Plotly.newPlot(id, [inputTr], layout, {responsive:true, displayModeBar:false});
  }

  function rfPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var depth = [1,2,3,4,5,6,7,8];
    var dense = depth.map(function(L){return 2*L + 1;});
    var dilated = depth.map(function(L){return Math.pow(2, L+1) + 1;});
    var t1 = {x:depth, y:dense, mode:'lines+markers', type:'scatter', name:lang==='tr'?'yoğun (dilation=1)':'dense (dilation=1)', line:{color:T.accent, width:2.5}, marker:{size:10}};
    var t2 = {x:depth, y:dilated, mode:'lines+markers', type:'scatter', name:lang==='tr'?'genişletilmiş (dilation=2^L)':'dilated (dilation=2^L)', line:{color:'#4ecdc4', width:2.5}, marker:{size:10}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Conv Derinliği vs Alıcı Alan':'Conv Depth vs Receptive Field', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'derinlik':'depth', gridcolor:T.grid, zerolinecolor:T.zero, dtick:1},
      yaxis:{title:lang==='tr'?'alıcı alan (token)':'receptive field (tokens)', gridcolor:T.grid, zerolinecolor:T.zero, type:'log'},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2], layout, {responsive:true, displayModeBar:false});
  }

  convPlot('plot-pl6-conv-en','en');
  rfPlot('plot-pl6-rf-en','en');
  convPlot('plot-pl6-conv-tr','tr');
  rfPlot('plot-pl6-rf-tr','tr');
}, 250);</script>
`
};
