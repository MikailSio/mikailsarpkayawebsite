window.PYTORCH_L9 = {

en: `<p class="l-text"><strong>Transformers dominate modern NLP because attention lets every token look at every other token in parallel, with learned weights that depend on content.</strong> An RNN processes a sequence one step at a time, accumulating a hidden state that becomes increasingly noisy with distance. A transformer reads the whole sequence at once and lets each token query the others directly. The result: better long-range understanding, full parallelism on GPU, and a clean architectural primitive that scales from 100M to 100B parameters.</p>

<p class="l-text">In this lesson we build the transformer encoder block from scratch in PyTorch. We start from scaled dot-product attention, stack it into multi-head attention, add positional information, wire residuals and layer normalization, and finally compare with the high-level <code>nn.TransformerEncoderLayer</code>. By the end you will be able to read any transformer paper and implement it in PyTorch directly.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Implement scaled dot-product attention in &lt;20 lines of PyTorch with Q, K, V projections</li>
<li>Stack single-head attention into multi-head attention with split/concat reshape</li>
<li>Add sinusoidal positional encodings and explain why pure attention is permutation-invariant</li>
<li>Wire residual connections, LayerNorm, and the feed-forward sublayer into a full encoder block</li>
<li>Compare your scratch implementation against <code>nn.TransformerEncoderLayer</code> output</li>
<li>Visualize attention weights as a heatmap to inspect what each head learns</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Attention? RNN Limitations</h2>

<p class="l-text">Before attention, sequence models were RNNs and CNNs. Both worked, but both suffered. RNNs process tokens sequentially, so training cannot parallelize across the time dimension; long sequences are slow. Worse, gradients vanish or explode through long unrolls, so the network struggles to remember information from far back. CNNs are parallel but only see a fixed receptive field per layer; you need many layers to connect distant positions, and even then the path is indirect.</p>

<div class="calc-highlight"><strong>Attention solves both problems in one mechanism.</strong> Every output position can directly attend to every input position with a learned, content-dependent weight. The whole layer is a few matrix multiplications -- fully parallel and length-independent in depth.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">RNN bottleneck</div><div class="card-body">Sequential time loop. O(T) depth, gradients fade with distance.</div></div>
<div class="calc-card"><div class="card-title">CNN bottleneck</div><div class="card-body">Fixed receptive field per layer. Need O(log T) layers to connect ends.</div></div>
<div class="calc-card"><div class="card-title">Attention strength</div><div class="card-body">Constant depth to connect any two positions. O(T^2) compute, O(1) path length.</div></div>
<div class="calc-card"><div class="card-title">Parallelism</div><div class="card-body">All token interactions are matmul. Perfect GPU utilization.</div></div>
<div class="calc-card"><div class="card-title">Content-dependent</div><div class="card-body">Weights are not fixed; they are computed from query and key vectors at runtime.</div></div>
<div class="calc-card"><div class="card-title">Permutation-aware</div><div class="card-body">Order is injected via positional embeddings, not via architecture.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: long-range coreference</div><div class="example-body">"The trophy did not fit in the suitcase because <strong>it</strong> was too big." Resolving "it" requires looking back many tokens. An RNN must compress all of "the trophy" into a hidden state that survives the gap. Attention simply puts a high weight on "trophy" when computing the contextual vector at "it". This is exactly what self-attention learns from data with no architectural prior.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Scaled Dot-Product Attention</h2>

<div class="calc-highlight">📘 <strong>Theory home:</strong> <a href="/tutorials/nlp/10">NLP Lesson 10 — Transformer &amp; BERT</a> derives the attention mechanism from first principles in NLP context (where it was invented). This lesson focuses on the PyTorch implementation: tensor shapes, einsum, and <code>nn.functional.scaled_dot_product_attention</code>.</div>

<p class="l-text">The atom of every transformer. Three input matrices: Q (queries), K (keys), V (values). Each row of Q is "what am I looking for", each row of K is "what do I offer", each row of V is "what I would deliver if matched". The output is a weighted sum of values, where weights come from query-key similarity.</p>

<div class="katex-block">$$\\text{Attn}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^{T}}{\\sqrt{d_k}}\\right) V$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Q (query)</div><div class="card-body">Shape (B, T_q, d_k). Each row asks "which positions are relevant to me?".</div></div>
<div class="calc-card"><div class="card-title">K (key)</div><div class="card-body">Shape (B, T_k, d_k). Each row says "here is what I represent for matching".</div></div>
<div class="calc-card"><div class="card-title">V (value)</div><div class="card-body">Shape (B, T_k, d_v). Each row carries the content delivered when its key matches.</div></div>
<div class="calc-card"><div class="card-title">d_k</div><div class="card-body">Per-head key dimension. Controls how big the dot products grow.</div></div>
<div class="calc-card"><div class="card-title">sqrt(d_k) scaling</div><div class="card-body">Without it, Q dot K grows in magnitude with d_k, pushing softmax into saturation; gradients die.</div></div>
<div class="calc-card"><div class="card-title">softmax row-wise</div><div class="card-body">Each query gets a probability distribution over keys. Rows sum to 1.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">import</span> math

<span class="kw">def</span> <span class="fn">scaled_dot_product_attention</span>(Q, K, V, mask=<span class="kw">None</span>, dropout=<span class="kw">None</span>):
    <span class="cm"># Q: (B, H, T_q, d_k)</span>
    <span class="cm"># K: (B, H, T_k, d_k)</span>
    <span class="cm"># V: (B, H, T_k, d_v)</span>
    d_k = Q.<span class="fn">size</span>(-<span class="num">1</span>)

    <span class="cm"># 1) raw similarity scores</span>
    scores = Q @ K.<span class="fn">transpose</span>(-<span class="num">2</span>, -<span class="num">1</span>) / math.<span class="fn">sqrt</span>(d_k)   <span class="cm"># (B, H, T_q, T_k)</span>

    <span class="cm"># 2) optional mask: set illegal positions to -inf so softmax kills them</span>
    <span class="kw">if</span> mask <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
        scores = scores.<span class="fn">masked_fill</span>(mask == <span class="num">0</span>, <span class="fn">float</span>(<span class="str">"-inf"</span>))

    <span class="cm"># 3) softmax across keys (last dim)</span>
    attn = F.<span class="fn">softmax</span>(scores, dim=-<span class="num">1</span>)                    <span class="cm"># (B, H, T_q, T_k)</span>
    <span class="kw">if</span> dropout <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
        attn = <span class="fn">dropout</span>(attn)

    <span class="cm"># 4) weighted sum of values</span>
    out = attn @ V                                      <span class="cm"># (B, H, T_q, d_v)</span>
    <span class="kw">return</span> out, attn

<span class="cm"># Quick check</span>
B, H, T, d = <span class="num">2</span>, <span class="num">4</span>, <span class="num">16</span>, <span class="num">32</span>
Q = torch.<span class="fn">randn</span>(B, H, T, d)
K = torch.<span class="fn">randn</span>(B, H, T, d)
V = torch.<span class="fn">randn</span>(B, H, T, d)
out, attn = <span class="fn">scaled_dot_product_attention</span>(Q, K, V)
<span class="fn">print</span>(out.shape, attn.shape)   <span class="cm"># (2, 4, 16, 32)  (2, 4, 16, 16)</span>
<span class="fn">print</span>(attn[<span class="num">0</span>, <span class="num">0</span>, <span class="num">3</span>].<span class="fn">sum</span>())     <span class="cm"># ~1.0 (softmax row sums to 1)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Scaled dot-product attention from scratch in NumPy: softmax(Q @ K.T / sqrt(d)) @ V. The exact equation torch.nn.functional.scaled_dot_product_attention computes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.special import softmax

rng = np.random.default_rng(0)
seq_len, d_k, d_v = 4, 8, 8
Q = rng.standard_normal((seq_len, d_k))
K = rng.standard_normal((seq_len, d_k))
V = rng.standard_normal((seq_len, d_v))

scores = Q @ K.T / np.sqrt(d_k)            # (seq, seq)
attn   = softmax(scores, axis=-1)          # rows sum to 1
output = attn @ V                          # (seq, d_v)

print('scores shape    :', scores.shape)
print('attention shape :', attn.shape)
print('output shape    :', output.shape)
print('row-sum of attention (must be 1):', attn.sum(axis=-1).round(4))
print('attention matrix:\n', attn.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Computes raw similarity scores by multiplying Q with K transposed. The result has shape <code>(B, H, T_q, T_k)</code> -- one similarity per query-key pair, per head, per batch sample. We divide by <code>sqrt(d_k)</code> to keep the variance of the dot product around 1 regardless of d_k. 2) Optionally applies a mask to zero out forbidden positions: padding tokens for encoder, future tokens for causal/decoder attention. We use <code>-inf</code> so that after softmax those positions get weight 0. 3) Softmax across the last dimension turns scores into a probability distribution over keys for each query. 4) Multiplies the attention weights by V to get a weighted sum: each output row is a convex combination of value rows, weighted by content similarity. The shape check confirms attention rows sum to 1.</p>

<div class="l-warn"><strong>Why sqrt(d_k)?</strong> If Q and K entries have variance 1 and dimension d_k, then <code>Q dot K</code> has variance d_k. Without scaling, large d_k makes scores enormous, softmax saturates (one position takes nearly all weight), and the gradient through softmax vanishes. Dividing by sqrt(d_k) keeps the variance at 1 -- a tiny detail that completely changes training stability.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Multi-Head Attention</h2>

<p class="l-text">Single-head attention computes one set of weights per query. Multi-head attention computes several in parallel, each with its own learned projection of Q, K, V into a lower dimension. Different heads can attend to different relationships -- syntax, coreference, sentiment -- and the concatenation gives the model richer information.</p>

<div class="katex-block">$$\\text{MHA}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^{O}$$</div>

<div class="katex-block">$$\\text{head}_i = \\text{Attn}(QW_i^{Q},\\ KW_i^{K},\\ VW_i^{V})$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">h (num heads)</div><div class="card-body">Number of parallel attention computations. Common: 8, 12, 16.</div></div>
<div class="calc-card"><div class="card-title">d_model</div><div class="card-body">Total embedding dim. Split into h heads of size d_k = d_model / h.</div></div>
<div class="calc-card"><div class="card-title">W_Q, W_K, W_V</div><div class="card-body">Per-head linear projections. Implemented as one big Linear that is then reshaped.</div></div>
<div class="calc-card"><div class="card-title">W_O</div><div class="card-body">Final output projection that mixes heads back to d_model.</div></div>
<div class="calc-card"><div class="card-title">Why heads</div><div class="card-body">Each head can specialize. One might track subject-verb, another adjective-noun.</div></div>
<div class="calc-card"><div class="card-title">Same compute</div><div class="card-body">h heads of dim d_k = d_model/h cost the same as 1 head of dim d_model.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">import</span> math

<span class="kw">class</span> <span class="fn">MultiHeadAttention</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d_model, num_heads, dropout=<span class="num">0.1</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">assert</span> d_model % num_heads == <span class="num">0</span>
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads

        <span class="cm"># Three big linears (one each for Q, K, V) -- often fused into one</span>
        self.W_q = nn.<span class="fn">Linear</span>(d_model, d_model)
        self.W_k = nn.<span class="fn">Linear</span>(d_model, d_model)
        self.W_v = nn.<span class="fn">Linear</span>(d_model, d_model)
        self.W_o = nn.<span class="fn">Linear</span>(d_model, d_model)

        self.dropout = nn.<span class="fn">Dropout</span>(dropout)

    <span class="kw">def</span> <span class="fn">forward</span>(self, x_q, x_k, x_v, mask=<span class="kw">None</span>):
        <span class="cm"># x_q: (B, T_q, d_model); x_k, x_v: (B, T_k, d_model)</span>
        B, T_q, _ = x_q.shape
        T_k = x_k.<span class="fn">size</span>(<span class="num">1</span>)

        <span class="cm"># 1) project and reshape into heads: (B, T, d_model) -&gt; (B, H, T, d_k)</span>
        Q = self.<span class="fn">W_q</span>(x_q).<span class="fn">view</span>(B, T_q, self.num_heads, self.d_k).<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)
        K = self.<span class="fn">W_k</span>(x_k).<span class="fn">view</span>(B, T_k, self.num_heads, self.d_k).<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)
        V = self.<span class="fn">W_v</span>(x_v).<span class="fn">view</span>(B, T_k, self.num_heads, self.d_k).<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)

        <span class="cm"># 2) scaled dot-product attention per head</span>
        scores = Q @ K.<span class="fn">transpose</span>(-<span class="num">2</span>, -<span class="num">1</span>) / math.<span class="fn">sqrt</span>(self.d_k)
        <span class="kw">if</span> mask <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
            scores = scores.<span class="fn">masked_fill</span>(mask == <span class="num">0</span>, <span class="fn">float</span>(<span class="str">"-inf"</span>))
        attn = F.<span class="fn">softmax</span>(scores, dim=-<span class="num">1</span>)
        attn = self.<span class="fn">dropout</span>(attn)
        out = attn @ V                                         <span class="cm"># (B, H, T_q, d_k)</span>

        <span class="cm"># 3) merge heads: (B, H, T_q, d_k) -&gt; (B, T_q, d_model)</span>
        out = out.<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>).<span class="fn">contiguous</span>().<span class="fn">view</span>(B, T_q, self.d_model)

        <span class="cm"># 4) final output projection</span>
        <span class="kw">return</span> self.<span class="fn">W_o</span>(out), attn

mha = <span class="fn">MultiHeadAttention</span>(d_model=<span class="num">256</span>, num_heads=<span class="num">8</span>)
x = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">32</span>, <span class="num">256</span>)
out, attn = <span class="fn">mha</span>(x, x, x)               <span class="cm"># self-attention: q=k=v=x</span>
<span class="fn">print</span>(out.shape, attn.shape)            <span class="cm"># (2, 32, 256)  (2, 8, 32, 32)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Multi-head attention = h independent attention computations on slices of the embedding. We do 4 heads of dim=4 on a single sentence.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.special import softmax

rng = np.random.default_rng(0)
seq_len, d_model, n_heads = 5, 16, 4
d_head = d_model // n_heads

X = rng.standard_normal((seq_len, d_model))

# Project Q, K, V (random weights, no training)
Wq = rng.standard_normal((d_model, d_model))
Wk = rng.standard_normal((d_model, d_model))
Wv = rng.standard_normal((d_model, d_model))
Q = X @ Wq; K = X @ Wk; V = X @ Wv

# Reshape into heads
def split_heads(t):
    return t.reshape(seq_len, n_heads, d_head).transpose(1, 0, 2)
Qh, Kh, Vh = split_heads(Q), split_heads(K), split_heads(V)

# Per-head attention
heads_out = []
for h in range(n_heads):
    s = Qh[h] @ Kh[h].T / np.sqrt(d_head)
    a = softmax(s, axis=-1)
    heads_out.append(a @ Vh[h])

# Concat heads back
out = np.concatenate(heads_out, axis=-1)
print('per-head output shape:', heads_out[0].shape)
print('concatenated   shape :', out.shape, '   (matches input shape)')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Projects the input three times via three Linear layers to get raw Q, K, V of size <code>(B, T, d_model)</code>. We reshape into <code>(B, T, H, d_k)</code> then transpose the H and T axes so attention can broadcast cleanly: <code>(B, H, T, d_k)</code>. 2) Runs scaled dot-product attention independently per head; the H dimension is just a batch dimension to PyTorch's matmul. 3) Transposes back and reshapes to merge heads -- contiguous before view because transpose breaks memory layout. 4) Applies the final output projection W_O to mix information across heads back into the d_model space. Self-attention is the special case where query, key, and value all come from the same input <code>x</code>; cross-attention (used in encoder-decoder) feeds different tensors.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: head specialization in BERT</div><div class="example-body">When you visualize attention weights of a trained BERT, you see clear patterns by head. Some heads attend to the previous token (a learned bigram detector). Some attend to the next token. Some attend to the [SEP] separator. Some attend to coreferents -- when the query is "it", a high weight goes to the previously mentioned noun. This emergent specialization happens with no explicit supervision; it falls out of self-attention training on language modeling.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Positional Embeddings (Quick Refresh)</h2>

<p class="l-text">Self-attention is permutation-invariant: shuffle the input tokens and the output is shuffled the same way. To inject order, transformers add a positional embedding to the token embedding before the first layer.</p>

<div class="katex-block">$$\\text{PE}_{(pos, 2i)} = \\sin\\!\\left(\\frac{pos}{10000^{2i/d}}\\right), \\qquad \\text{PE}_{(pos, 2i+1)} = \\cos\\!\\left(\\frac{pos}{10000^{2i/d}}\\right)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">pos</div><div class="card-body">Sequence position 0, 1, 2, ...</div></div>
<div class="calc-card"><div class="card-title">i</div><div class="card-body">Dimension index, 0 to d/2 - 1.</div></div>
<div class="calc-card"><div class="card-title">d</div><div class="card-body">Embedding dimension.</div></div>
<div class="calc-card"><div class="card-title">10000</div><div class="card-body">Constant that spreads wavelengths from short to very long across dimensions.</div></div>
<div class="calc-card"><div class="card-title">Add not concat</div><div class="card-body">Position is summed elementwise into the token embedding.</div></div>
<div class="calc-card"><div class="card-title">Modern variants</div><div class="card-body">RoPE (LLaMA), ALiBi -- both extrapolate to longer sequences than seen.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> math

<span class="kw">class</span> <span class="fn">SinusoidalPositionalEmbedding</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d_model, max_len=<span class="num">5000</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        pe = torch.<span class="fn">zeros</span>(max_len, d_model)
        pos = torch.<span class="fn">arange</span>(max_len).<span class="fn">unsqueeze</span>(<span class="num">1</span>).<span class="fn">float</span>()
        div = torch.<span class="fn">exp</span>(torch.<span class="fn">arange</span>(<span class="num">0</span>, d_model, <span class="num">2</span>).<span class="fn">float</span>()
                        * -(math.<span class="fn">log</span>(<span class="num">10000.0</span>) / d_model))
        pe[:, <span class="num">0</span>::<span class="num">2</span>] = torch.<span class="fn">sin</span>(pos * div)
        pe[:, <span class="num">1</span>::<span class="num">2</span>] = torch.<span class="fn">cos</span>(pos * div)
        self.<span class="fn">register_buffer</span>(<span class="str">"pe"</span>, pe.<span class="fn">unsqueeze</span>(<span class="num">0</span>))   <span class="cm"># (1, max_len, d_model)</span>

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="cm"># x: (B, T, d_model)</span>
        <span class="kw">return</span> x + self.pe[:, : x.<span class="fn">size</span>(<span class="num">1</span>), :]

pe = <span class="fn">SinusoidalPositionalEmbedding</span>(d_model=<span class="num">128</span>)
x = torch.<span class="fn">zeros</span>(<span class="num">1</span>, <span class="num">50</span>, <span class="num">128</span>)
y = <span class="fn">pe</span>(x)
<span class="fn">print</span>(y.shape)            <span class="cm"># (1, 50, 128)</span>
<span class="cm"># y now contains pure positional information, ready to be added to token embeddings.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Positional embeddings -- here the sinusoidal flavor used by the original Transformer paper.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def positional_encoding(seq_len, d_model):
    pos = np.arange(seq_len)[:, None]
    i = np.arange(d_model)[None, :]
    rates = 1 / np.power(10000, (2 * (i // 2)) / d_model)
    angles = pos * rates
    pe = np.zeros((seq_len, d_model))
    pe[:, 0::2] = np.sin(angles[:, 0::2])
    pe[:, 1::2] = np.cos(angles[:, 1::2])
    return pe

pe = positional_encoding(seq_len=10, d_model=8)
print('pos encoding shape:', pe.shape)
print('positions 0..3:\n', pe[:4].round(3))
print('frobenius norm:', round(float(np.linalg.norm(pe)), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Pre-computes the sinusoidal table of shape <code>(max_len, d_model)</code> at construction time. We register it as a buffer so it moves with <code>.to(device)</code> but is not a learnable parameter. 2) The forward method slices the first <code>T</code> rows of the table and adds them elementwise to the input. 3) Different dimensions oscillate at exponentially different frequencies, so each position gets a unique fingerprint while neighboring positions remain similar -- the property attention needs to learn that "near" and "far" carry different meaning.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Encoder Block From Scratch</h2>

<p class="l-text">A transformer encoder block stacks multi-head self-attention, a position-wise feed-forward network, residual connections, layer normalization, and dropout. The recipe has not changed since 2017; only the hyperparameters scale up.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">FeedForward</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d_model, d_ff, dropout=<span class="num">0.1</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc1 = nn.<span class="fn">Linear</span>(d_model, d_ff)
        self.fc2 = nn.<span class="fn">Linear</span>(d_ff, d_model)
        self.act = nn.<span class="fn">GELU</span>()
        self.drop = nn.<span class="fn">Dropout</span>(dropout)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">fc2</span>(self.<span class="fn">drop</span>(self.<span class="fn">act</span>(self.<span class="fn">fc1</span>(x))))

<span class="kw">class</span> <span class="fn">TransformerEncoderBlock</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d_model, num_heads, d_ff, dropout=<span class="num">0.1</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.attn = <span class="fn">MultiHeadAttention</span>(d_model, num_heads, dropout)
        self.ffn = <span class="fn">FeedForward</span>(d_model, d_ff, dropout)
        self.ln1 = nn.<span class="fn">LayerNorm</span>(d_model)
        self.ln2 = nn.<span class="fn">LayerNorm</span>(d_model)
        self.drop = nn.<span class="fn">Dropout</span>(dropout)

    <span class="kw">def</span> <span class="fn">forward</span>(self, x, mask=<span class="kw">None</span>):
        <span class="cm"># 1) Self-attention with residual + layernorm (pre-norm style)</span>
        h = self.<span class="fn">ln1</span>(x)
        a, _ = self.<span class="fn">attn</span>(h, h, h, mask=mask)
        x = x + self.<span class="fn">drop</span>(a)

        <span class="cm"># 2) FFN with residual + layernorm</span>
        h = self.<span class="fn">ln2</span>(x)
        f = self.<span class="fn">ffn</span>(h)
        x = x + self.<span class="fn">drop</span>(f)
        <span class="kw">return</span> x

block = <span class="fn">TransformerEncoderBlock</span>(d_model=<span class="num">256</span>, num_heads=<span class="num">8</span>, d_ff=<span class="num">1024</span>)
x = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">32</span>, <span class="num">256</span>)
y = <span class="fn">block</span>(x)
<span class="fn">print</span>(y.shape)              <span class="cm"># (2, 32, 256) -- shape preserved</span>

<span class="cm"># Stack many blocks</span>
<span class="kw">class</span> <span class="fn">TransformerEncoder</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, num_layers, d_model, num_heads, d_ff, dropout=<span class="num">0.1</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.layers = nn.<span class="fn">ModuleList</span>([
            <span class="fn">TransformerEncoderBlock</span>(d_model, num_heads, d_ff, dropout)
            <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(num_layers)
        ])
        self.ln_final = nn.<span class="fn">LayerNorm</span>(d_model)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x, mask=<span class="kw">None</span>):
        <span class="kw">for</span> layer <span class="kw">in</span> self.layers:
            x = <span class="fn">layer</span>(x, mask)
        <span class="kw">return</span> self.<span class="fn">ln_final</span>(x)

enc = <span class="fn">TransformerEncoder</span>(num_layers=<span class="num">6</span>, d_model=<span class="num">256</span>, num_heads=<span class="num">8</span>, d_ff=<span class="num">1024</span>)
<span class="fn">print</span>(<span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> enc.<span class="fn">parameters</span>()) / <span class="num">1e6</span>, <span class="str">"M params"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Encoder block from scratch: attention -> add & norm -> FFN -> add & norm. We chain the pieces explicitly in NumPy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.special import softmax

def layer_norm(x, eps=1e-5):
    mean = x.mean(axis=-1, keepdims=True)
    std  = x.std(axis=-1, keepdims=True)
    return (x - mean) / (std + eps)

def attention(Q, K, V):
    d_k = Q.shape[-1]
    s = Q @ K.T / np.sqrt(d_k)
    return softmax(s, axis=-1) @ V

rng = np.random.default_rng(0)
d_model = 16
seq_len = 6
X = rng.standard_normal((seq_len, d_model))

# 1. Self-attention
attn_out = attention(X, X, X)
X1 = layer_norm(X + attn_out)

# 2. Feed-forward
W1 = rng.standard_normal((d_model, 32)) * 0.1
W2 = rng.standard_normal((32, d_model)) * 0.1
ffn_out = np.maximum(0, X1 @ W1) @ W2
X2 = layer_norm(X1 + ffn_out)

print('input  :', X.shape)
print('after attention+norm:', X1.shape)
print('after ffn+norm     :', X2.shape)
print('output norm        :', round(float(np.linalg.norm(X2)), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines the position-wise feed-forward network: two linears with GELU in between. The hidden dim <code>d_ff</code> is typically 4 * d_model -- this is where most transformer parameters live. 2) Defines the encoder block. We use the "pre-norm" variant (LayerNorm before each sub-block, then residual add) which trains more stably than the original "post-norm" recipe. 3) Inside forward: attention sub-block adds attention output to the input; FFN sub-block adds FFN output to the running stream. Both wrapped in residual + LayerNorm + Dropout. 4) Stacks N such blocks into a full encoder, with a final LayerNorm. Output shape equals input shape -- transformers are length-preserving. 5) Counts parameters: a 6-layer block with d_model=256 lands around 4.7M -- a "small" encoder. BERT-base has 12 layers, d_model=768 and ~110M parameters.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: pre-norm vs post-norm</div><div class="example-body">The 2017 paper used post-norm: <code>x = LayerNorm(x + Sublayer(x))</code>. Pre-norm flips it: <code>x = x + Sublayer(LayerNorm(x))</code>. Pre-norm trains stably without learning-rate warmup and scales to deep stacks (GPT, LLaMA, BERT-large all use pre-norm). Post-norm sometimes gets slightly higher final accuracy on small models but is fragile. Modern code uses pre-norm by default.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Using nn.TransformerEncoder Directly</h2>

<p class="l-text">PyTorch ships <code>nn.TransformerEncoderLayer</code> and <code>nn.TransformerEncoder</code> out of the box. They follow the same math, with a few practical knobs.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># 1) Single encoder layer</span>
layer = nn.<span class="fn">TransformerEncoderLayer</span>(
    d_model=<span class="num">256</span>,
    nhead=<span class="num">8</span>,
    dim_feedforward=<span class="num">1024</span>,
    dropout=<span class="num">0.1</span>,
    activation=<span class="str">"gelu"</span>,
    batch_first=<span class="kw">True</span>,        <span class="cm"># (B, T, D) layout, recommended</span>
    norm_first=<span class="kw">True</span>          <span class="cm"># pre-norm</span>
)

<span class="cm"># 2) Stack into a full encoder</span>
encoder = nn.<span class="fn">TransformerEncoder</span>(layer, num_layers=<span class="num">6</span>)

<span class="cm"># 3) Run it</span>
x = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">32</span>, <span class="num">256</span>)               <span class="cm"># (B, T, D)</span>
out = <span class="fn">encoder</span>(x)
<span class="fn">print</span>(out.shape)                          <span class="cm"># (2, 32, 256)</span>

<span class="cm"># 4) With key padding mask (True = ignore)</span>
pad_mask = torch.<span class="fn">zeros</span>(<span class="num">2</span>, <span class="num">32</span>, dtype=torch.<span class="ty">bool</span>)
pad_mask[<span class="num">0</span>, <span class="num">28</span>:] = <span class="kw">True</span>                   <span class="cm"># last 4 positions of sample 0 are padding</span>
out = <span class="fn">encoder</span>(x, src_key_padding_mask=pad_mask)
<span class="fn">print</span>(out.shape)

<span class="cm"># 5) Compare to a full BERT-style classifier head</span>
<span class="kw">class</span> <span class="fn">TextClassifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, d_model, num_heads, num_layers, num_classes, max_len=<span class="num">128</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(vocab_size, d_model, padding_idx=<span class="num">0</span>)
        self.pos = nn.<span class="fn">Embedding</span>(max_len, d_model)
        layer = nn.<span class="fn">TransformerEncoderLayer</span>(d_model, num_heads, dim_feedforward=<span class="num">4</span>*d_model,
                                           batch_first=<span class="kw">True</span>, norm_first=<span class="kw">True</span>, activation=<span class="str">"gelu"</span>)
        self.encoder = nn.<span class="fn">TransformerEncoder</span>(layer, num_layers=num_layers)
        self.cls = nn.<span class="fn">Linear</span>(d_model, num_classes)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids, pad_mask=<span class="kw">None</span>):
        B, T = ids.shape
        positions = torch.<span class="fn">arange</span>(T, device=ids.device).<span class="fn">unsqueeze</span>(<span class="num">0</span>).<span class="fn">expand</span>(B, T)
        x = self.<span class="fn">embed</span>(ids) + self.<span class="fn">pos</span>(positions)
        h = self.<span class="fn">encoder</span>(x, src_key_padding_mask=pad_mask)
        <span class="cm"># mean-pool excluding padding</span>
        <span class="kw">if</span> pad_mask <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
            mask = (~pad_mask).<span class="fn">unsqueeze</span>(-<span class="num">1</span>).<span class="fn">float</span>()
            h = (h * mask).<span class="fn">sum</span>(<span class="num">1</span>) / mask.<span class="fn">sum</span>(<span class="num">1</span>).<span class="fn">clamp</span>(<span class="ty">min</span>=<span class="num">1</span>)
        <span class="kw">else</span>:
            h = h.<span class="fn">mean</span>(<span class="num">1</span>)
        <span class="kw">return</span> self.<span class="fn">cls</span>(h)

m = <span class="fn">TextClassifier</span>(vocab_size=<span class="num">30000</span>, d_model=<span class="num">128</span>, num_heads=<span class="num">4</span>, num_layers=<span class="num">2</span>, num_classes=<span class="num">2</span>)
ids = torch.<span class="fn">randint</span>(<span class="num">1</span>, <span class="num">30000</span>, (<span class="num">4</span>, <span class="num">64</span>))
<span class="fn">print</span>(<span class="fn">m</span>(ids).shape)                       <span class="cm"># (4, 2) -- binary sentiment logits</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Stacking multiple encoder blocks: each block is a function, we just compose them in a Python loop.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.special import softmax

def layer_norm(x, eps=1e-5):
    return (x - x.mean(-1, keepdims=True)) / (x.std(-1, keepdims=True) + eps)

def encoder_block(X, params):
    Wq, Wk, Wv, W1, W2 = params
    Q, K, V = X @ Wq, X @ Wk, X @ Wv
    a = softmax(Q @ K.T / np.sqrt(Q.shape[-1]), axis=-1) @ V
    X1 = layer_norm(X + a)
    f = np.maximum(0, X1 @ W1) @ W2
    return layer_norm(X1 + f)

rng = np.random.default_rng(0)
d_model, seq_len = 16, 5
X = rng.standard_normal((seq_len, d_model))

# Stack 4 encoder blocks with random weights
def make_params():
    return [rng.standard_normal((d_model, d_model)) * 0.1 for _ in range(3)] +            [rng.standard_normal((d_model, 32)) * 0.1, rng.standard_normal((32, d_model)) * 0.1]

stack = [make_params() for _ in range(4)]
out = X
for i, p in enumerate(stack):
    out = encoder_block(out, p)
    print(f'after block {i}: shape={out.shape}, mean={out.mean():.3f}, std={out.std():.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Constructs a single encoder layer with <code>batch_first=True</code> so input is <code>(B, T, D)</code> -- the convention you want everywhere; the legacy default <code>(T, B, D)</code> is a footgun. <code>norm_first=True</code> turns on pre-norm. 2) Wraps N copies in <code>nn.TransformerEncoder</code>; this handles the loop and a final LayerNorm if requested. 3) Forward passes the input through; output shape matches input. 4) Demonstrates <code>src_key_padding_mask</code>: a boolean mask where True means "ignore this position". Padding tokens contribute nothing to attention. 5) Builds a small text classifier: token + position embedding, transformer encoder, mean-pool over non-padded tokens, linear head. This is the architecture under most BERT-style classification fine-tunes; only the embedding and classification head differ between tasks.</p>

<div class="l-warn"><strong>Mask conventions are confusing.</strong> PyTorch <code>nn.MultiheadAttention</code> uses <code>True = ignore</code>. Some custom code uses <code>True = keep</code>. HuggingFace tokenizers return <code>1 = keep</code>. Always check by feeding a sequence with known padding and verifying the model's output ignores those positions.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Visualizing Attention Weights</h2>

<p class="l-text">After training, the attention matrix tells you which tokens the model thinks are related. Visualizing it as a heatmap is one of the most useful debugging tools in NLP.</p>

<div id="plot-pl9-attn-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A learned self-attention heatmap from one head of a transformer, for the sentence "The cat sat on the mat because it was tired." Rows are query positions; columns are key positions. The bright cell at row "it", column "cat" reveals that the head learned coreference: when computing the contextual vector for "it", the model attends primarily to "cat". <strong>Why it matters for NLP:</strong> attention maps are interpretability gold -- they let you see whether the model relies on the right tokens for sentiment, NER, or coreference, and they often surface bugs (e.g. attending to padding) before they tank evaluation metrics.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">import</span> math

<span class="cm"># Toy attention pattern visualization (no training needed)</span>
torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)
T, d_k = <span class="num">9</span>, <span class="num">32</span>
Q = torch.<span class="fn">randn</span>(T, d_k)
K = torch.<span class="fn">randn</span>(T, d_k)

scores = Q @ K.T / math.<span class="fn">sqrt</span>(d_k)
attn = F.<span class="fn">softmax</span>(scores, dim=-<span class="num">1</span>)         <span class="cm"># (T, T)</span>

<span class="fn">print</span>(attn.shape)                        <span class="cm"># (9, 9)</span>
<span class="fn">print</span>(attn.<span class="fn">sum</span>(dim=-<span class="num">1</span>))                  <span class="cm"># all rows ~ 1.0</span>

<span class="cm"># In a real notebook:</span>
<span class="cm"># import matplotlib.pyplot as plt</span>
<span class="cm"># plt.imshow(attn.detach().numpy(), cmap="viridis")</span>
<span class="cm"># plt.xticks(range(T), tokens, rotation=45)</span>
<span class="cm"># plt.yticks(range(T), tokens)</span>
<span class="cm"># plt.colorbar(); plt.show()</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Visualize attention weights: we run scaled dot-product attention with one query against several keys -- the softmax distribution is what gets visualized in transformer papers.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.special import softmax

rng = np.random.default_rng(0)
d_k = 8
keys = rng.standard_normal((6, d_k))   # 6 keys
# Pick a query that is similar to key #2
query = keys[2] + rng.standard_normal(d_k) * 0.2

scores = query @ keys.T / np.sqrt(d_k)
attn   = softmax(scores)
print('scores            :', scores.round(3))
print('attention weights :', attn.round(3))
print('argmax (target)   :', int(attn.argmax()))
for i, w in enumerate(attn):
    bar = '#' * int(w * 40)
    print(f'  key {i}: weight {w:.3f}  {bar}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates random Q and K tensors of length T=9 -- pretend these came from token embeddings of a 9-word sentence. 2) Computes scaled scores and softmax row-wise to get a 9x9 attention matrix where each row is a probability distribution over keys. 3) Verifies rows sum to 1 (a sanity check you should run on every custom attention implementation). 4) The commented matplotlib code shows the standard visualization: matrix as heatmap with token labels on both axes; color intensity reads as "how much does this query attend to that key".</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Wrap-Up: Why It All Works</h2>

<div class="think-box"><div class="think-label">WHY sqrt(d_k)?</div><div class="think-body">If <code>q</code> and <code>k</code> are i.i.d. with mean 0 and variance 1, then their dot product over d_k dimensions has mean 0 and variance d_k. Without scaling, raw scores have standard deviation <code>sqrt(d_k)</code>; for d_k = 64 that is around 8 -- huge for softmax. Softmax of large positive values saturates: one position takes nearly all weight and the gradient vanishes. Dividing by <code>sqrt(d_k)</code> rescales scores back to variance 1, keeping softmax in its useful range. This is a one-line fix that took the attention paper from "it sort of works" to "it dominates everything".</div></div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Attention is content-dependent weighting: each query gets a softmax over keys, and the output is a weighted sum of values.<br><strong>2.</strong> Scaled dot-product attention divides by sqrt(d_k) to keep softmax in a healthy regime.<br><strong>3.</strong> Multi-head attention runs h parallel attention heads on lower-dim projections and concatenates them; same compute as one big head, much more expressive.<br><strong>4.</strong> Positional embeddings inject order; without them, attention is permutation-invariant.<br><strong>5.</strong> An encoder block = MHA + residual + LayerNorm + FFN + residual + LayerNorm. Pre-norm is the modern default.<br><strong>6.</strong> <code>nn.TransformerEncoderLayer</code> with <code>batch_first=True</code> and <code>norm_first=True</code> is the recommended high-level API.<br><strong>7.</strong> Always check mask conventions; padding mask bugs are silent and catastrophic.<br><strong>8.</strong> Next lesson: pretrained models and transfer learning -- how to skip training from scratch and fine-tune a 110M-parameter transformer in a few hundred lines.</div></div>
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

  function attnPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var tokens = ['The','cat','sat','on','the','mat','because','it','was'];
    // Hand-crafted attention pattern: "it" attends to "cat", others mostly diagonal
    var z = [];
    for (var i=0; i<tokens.length; i++) {
      var row = [];
      for (var j=0; j<tokens.length; j++) {
        var v = (i===j) ? 0.45 : 0.05;
        if (i===7 && j===1) v = 0.65;          // it -> cat
        if (i===5 && j===4) v = 0.30;          // mat -> the
        row.push(v);
      }
      // normalize row
      var s = row.reduce(function(a,b){return a+b;}, 0);
      row = row.map(function(v){return v/s;});
      z.push(row);
    }
    var data = [{
      z: z, x: tokens, y: tokens,
      type: 'heatmap',
      colorscale: [[0,'rgba(40,30,20,0.9)'],[0.5,'rgba(120,100,60,0.9)'],[1,T.accent]],
      showscale: true,
      colorbar: {title: lang==='tr'?'agirlik':'weight', tickfont:{color:T.text}}
    }];
    var layout = Object.assign({}, common, {
      title: {text: lang==='tr'?'Attention Heatmap (ornek)':'Attention Heatmap (example)', font:{color:T.text, size:14}},
      xaxis: {title: lang==='tr'?'anahtar (key)':'key', tickfont:{color:T.text}, side:'bottom'},
      yaxis: {title: lang==='tr'?'sorgu (query)':'query', tickfont:{color:T.text}, autorange:'reversed'},
      height: 480
    });
    Plotly.newPlot(id, data, layout, {responsive:true, displayModeBar:false});
  }

  attnPlot('plot-pl9-attn-en','en');
  attnPlot('plot-pl9-attn-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Transformer'lar modern NLP'ye hâkimdir çünkü attention her token'ın diğer tüm token'lara paralel olarak bakmasına izin verir; ağırlıklar içeriğe bağlı olarak öğrenilir.</strong> Bir RNN diziyi adım adım işler ve mesafeyle birlikte gittikçe gürültülenen bir gizli durum biriktirir. Bir transformer tüm diziyi tek seferde okur ve her token'ın diğerlerini doğrudan sorgulamasına izin verir. Sonuç: daha iyi uzun mesafeli anlayış, GPU'da tam paralellik ve 100M'den 100B parametreye kadar ölçeklenen temiz bir mimari ilkel.</p>

<p class="l-text">Bu derste PyTorch'ta transformer encoder bloğunu sıfırdan inşa ediyoruz. Ölçekli iç çarpım attention'dan başlıyoruz, multi-head attention'a yığıyoruz, pozisyonel bilgi ekliyoruz, residual ve layer normalization bağlıyoruz ve sonunda yüksek seviyeli <code>nn.TransformerEncoderLayer</code> ile karşılaştırıyoruz. Sonunda herhangi bir transformer makalesini okuyup doğrudan PyTorch'ta uygulayabileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Q, K, V projeksiyonlarıyla scaled dot-product attention'ı &lt;20 satır PyTorch'ta uygulamayı</li>
<li>Tek başlı attention'ı split/concat reshape ile multi-head attention'a yığmayı</li>
<li>Sinüzoidal pozisyonel kodlama eklemeyi ve saf attention'ın neden permütasyon-değişmez olduğunu açıklamayı</li>
<li>Residual bağlantıları, LayerNorm ve feed-forward alt katmanı tam bir encoder bloğuna bağlamayı</li>
<li>Sıfırdan yazılan uygulamanızı <code>nn.TransformerEncoderLayer</code> çıktısıyla karşılaştırmayı</li>
<li>Her başın ne öğrendiğini incelemek için attention ağırlıklarını ısı haritası olarak görselleştirmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Attention? RNN Sınırlamaları</h2>

<p class="l-text">Attention'dan önce dizi modelleri RNN'ler ve CNN'lerdi. İkisi de işliyordu ama ikisi de zorlanıyordu. RNN'ler token'ları sıralı işler, bu yüzden eğitim zaman boyutunda paralelleşemez; uzun diziler yavaştır. Daha kötüsü, gradyanlar uzun açılımlarda kaybolur veya patlar, ağ uzaktan gelen bilgiyi hatırlamakta zorlanır. CNN'ler paraleldir ama katman başına yalnızca sabit bir alıcı alan görürler; uzak pozisyonları bağlamak için çok katman gerekir ve o zaman bile yol dolaylıdır.</p>

<div class="calc-highlight"><strong>Attention her iki problemi de tek bir mekanizmayla çözer.</strong> Her çıktı pozisyonu, öğrenilmiş, içeriğe bağlı bir ağırlıkla her girdi pozisyonuna doğrudan bakabilir. Tüm katman birkaç matris çarpımıdır -- tamamen paralel ve derinlikte uzunluktan bağımsız.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">RNN darboğazı</div><div class="card-body">Sıralı zaman döngüsü. O(T) derinlik, mesafeyle gradyanlar solar.</div></div>
<div class="calc-card"><div class="card-title">CNN darboğazı</div><div class="card-body">Katman başına sabit alıcı alan. Uçları bağlamak için O(log T) katman gerekir.</div></div>
<div class="calc-card"><div class="card-title">Attention gücü</div><div class="card-body">İki pozisyonu bağlamak için sabit derinlik. O(T^2) hesaplama, O(1) yol uzunluğu.</div></div>
<div class="calc-card"><div class="card-title">Paralellik</div><div class="card-body">Tüm token etkileşimleri matmul'dur. Mükemmel GPU kullanımı.</div></div>
<div class="calc-card"><div class="card-title">İçeriğe bağlı</div><div class="card-body">Ağırlıklar sabit değildir; sorgu ve anahtar vektörlerinden çalışma zamanında hesaplanır.</div></div>
<div class="calc-card"><div class="card-title">Sıraya duyarlı</div><div class="card-body">Sıra mimari yoluyla değil, pozisyonel embedding'lerle enjekte edilir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: uzun mesafeli koreferans</div><div class="example-body">"Kupa bavula sığmadı çünkü <strong>o</strong> çok büyüktü." "O"yu çözmek birçok token geriye bakmayı gerektirir. Bir RNN "kupa"nın tamamını boşluktan sağ kalan bir gizli duruma sıkıştırmalıdır. Attention basitçe "o" için bağlamsal vektörü hesaplarken "kupa"ya yüksek ağırlık verir. Self-attention'ın mimari bir öncül olmadan veriden öğrendiği tam olarak budur.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Ölçekli İç Çarpım Attention</h2>

<div class="calc-highlight">📘 <strong>Teori evi:</strong> <a href="/tutorials/nlp/10">NLP Dersi 10 — Transformer &amp; BERT</a> attention mekanizmasını NLP bağlamında (icat edildiği yerde) ilk prensiplerden türetir. Bu ders PyTorch uygulamasına odaklanır: tensör şekilleri, einsum ve <code>nn.functional.scaled_dot_product_attention</code>.</div>

<p class="l-text">Her transformer'ın atomu. Üç giriş matrisi: Q (sorgu), K (anahtar), V (değer). Q'nun her satırı "ne arıyorum", K'nın her satırı "ne sunuyorum", V'nin her satırı "eşleşirsem ne teslim ederim". Çıktı, ağırlıkların sorgu-anahtar benzerliğinden geldiği bir değer ağırlıklı toplamıdır.</p>

<div class="katex-block">$$\\text{Attn}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^{T}}{\\sqrt{d_k}}\\right) V$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Q (sorgu)</div><div class="card-body">Şekil (B, T_q, d_k). Her satır "hangi pozisyonlar bana ilgili?" diye sorar.</div></div>
<div class="calc-card"><div class="card-title">K (anahtar)</div><div class="card-body">Şekil (B, T_k, d_k). Her satır "eşleştirme için neyi temsil ediyorum" der.</div></div>
<div class="calc-card"><div class="card-title">V (değer)</div><div class="card-body">Şekil (B, T_k, d_v). Her satır anahtarı eşleştiğinde teslim edilen içeriği taşır.</div></div>
<div class="calc-card"><div class="card-title">d_k</div><div class="card-body">Başlık başına anahtar boyutu. İç çarpımların ne kadar büyüdüğünü kontrol eder.</div></div>
<div class="calc-card"><div class="card-title">sqrt(d_k) ölçekleme</div><div class="card-body">Olmadan, Q nokta K büyüklüğü d_k ile büyür, softmax'ı doyuma iter; gradyanlar ölür.</div></div>
<div class="calc-card"><div class="card-title">Satır bazlı softmax</div><div class="card-body">Her sorgu anahtarlar üzerinde bir olasılık dağılımı alır. Satırlar 1'e toplanır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">import</span> math

<span class="kw">def</span> <span class="fn">scaled_dot_product_attention</span>(Q, K, V, mask=<span class="kw">None</span>, dropout=<span class="kw">None</span>):
    <span class="cm"># Q: (B, H, T_q, d_k)</span>
    <span class="cm"># K: (B, H, T_k, d_k)</span>
    <span class="cm"># V: (B, H, T_k, d_v)</span>
    d_k = Q.<span class="fn">size</span>(-<span class="num">1</span>)

    <span class="cm"># 1) ham benzerlik skorlari</span>
    scores = Q @ K.<span class="fn">transpose</span>(-<span class="num">2</span>, -<span class="num">1</span>) / math.<span class="fn">sqrt</span>(d_k)   <span class="cm"># (B, H, T_q, T_k)</span>

    <span class="cm"># 2) opsiyonel maske: yasakli pozisyonlari -inf yap</span>
    <span class="kw">if</span> mask <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
        scores = scores.<span class="fn">masked_fill</span>(mask == <span class="num">0</span>, <span class="fn">float</span>(<span class="str">"-inf"</span>))

    <span class="cm"># 3) anahtarlar uzerinde softmax</span>
    attn = F.<span class="fn">softmax</span>(scores, dim=-<span class="num">1</span>)
    <span class="kw">if</span> dropout <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
        attn = <span class="fn">dropout</span>(attn)

    <span class="cm"># 4) degerlerin agirlikli toplami</span>
    out = attn @ V                                      <span class="cm"># (B, H, T_q, d_v)</span>
    <span class="kw">return</span> out, attn

B, H, T, d = <span class="num">2</span>, <span class="num">4</span>, <span class="num">16</span>, <span class="num">32</span>
Q = torch.<span class="fn">randn</span>(B, H, T, d)
K = torch.<span class="fn">randn</span>(B, H, T, d)
V = torch.<span class="fn">randn</span>(B, H, T, d)
out, attn = <span class="fn">scaled_dot_product_attention</span>(Q, K, V)
<span class="fn">print</span>(out.shape, attn.shape)   <span class="cm"># (2, 4, 16, 32)  (2, 4, 16, 16)</span>
<span class="fn">print</span>(attn[<span class="num">0</span>, <span class="num">0</span>, <span class="num">3</span>].<span class="fn">sum</span>())     <span class="cm"># ~1.0</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sıfırdan NumPy'da ölçekli iç çarpım attention: softmax(Q @ K.T / sqrt(d)) @ V. torch.nn.functional.scaled_dot_product_attention'ın hesapladığı denklem.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.special import softmax

rng = np.random.default_rng(0)
seq_len, d_k, d_v = 4, 8, 8
Q = rng.standard_normal((seq_len, d_k))
K = rng.standard_normal((seq_len, d_k))
V = rng.standard_normal((seq_len, d_v))

scores = Q @ K.T / np.sqrt(d_k)            # (seq, seq)
attn   = softmax(scores, axis=-1)          # rows sum to 1
output = attn @ V                          # (seq, d_v)

print('scores shape    :', scores.shape)
print('attention shape :', attn.shape)
print('output shape    :', output.shape)
print('row-sum of attention (must be 1):', attn.sum(axis=-1).round(4))
print('attention matrix:\n', attn.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Q'yu transpoze edilmiş K ile çarparak ham benzerlik skorlarını hesaplar. Sonuç şekli <code>(B, H, T_q, T_k)</code> -- her sorgu-anahtar çifti, her başlık, her örnek için bir benzerlik. d_k'den bağımsız olarak iç çarpım varyansını 1 civarında tutmak için <code>sqrt(d_k)</code>'ye böleriz. 2) İsteğe bağlı olarak yasak pozisyonları sıfırlamak için bir maske uygular: encoder için padding token'ları, nedensel/decoder attention için gelecek token'lar. <code>-inf</code> kullanırız çünkü softmax sonrası bu pozisyonlar 0 ağırlık alır. 3) Son boyut üzerinde softmax skorları her sorgu için anahtarlar üzerinde olasılık dağılımına çevirir. 4) Attention ağırlıklarını V ile çarparak ağırlıklı toplamı verir: her çıktı satırı içerik benzerliği ile ağırlıklandırılmış değer satırlarının dışbükey kombinasyonudur. Şekil kontrolü attention satırlarının 1'e toplandığını doğrular.</p>

<div class="l-warn"><strong>Neden sqrt(d_k)?</strong> Q ve K girişleri varyansı 1 ve boyutu d_k ise <code>Q dot K</code> varyansı d_k'dir. Ölçekleme olmadan büyük d_k skorları kocaman yapar, softmax doyar (bir pozisyon neredeyse tüm ağırlığı alır) ve softmax'tan geçen gradyan kaybolur. <code>sqrt(d_k)</code>'ye bölmek varyansı 1'de tutar -- eğitim kararlılığını tamamen değiştiren küçük bir detay.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Multi-Head Attention</h2>

<p class="l-text">Tek başlıklı attention sorgu başına bir ağırlık seti hesaplar. Multi-head attention birkaçını paralel olarak hesaplar; her biri Q, K, V'nin daha düşük boyuta kendi öğrenilmiş projeksiyonunu yapar. Farklı başlıklar farklı ilişkilere bakabilir -- sözdizimi, koreferans, duygu -- ve birleştirme modele daha zengin bilgi verir.</p>

<div class="katex-block">$$\\text{MHA}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^{O}$$</div>

<div class="katex-block">$$\\text{head}_i = \\text{Attn}(QW_i^{Q},\\ KW_i^{K},\\ VW_i^{V})$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">h (başlık sayısı)</div><div class="card-body">Paralel attention hesaplaması sayısı. Yaygın: 8, 12, 16.</div></div>
<div class="calc-card"><div class="card-title">d_model</div><div class="card-body">Toplam embedding boyutu. d_k = d_model / h olan h başlığa bölünür.</div></div>
<div class="calc-card"><div class="card-title">W_Q, W_K, W_V</div><div class="card-body">Başlık başına lineer projeksiyonlar. Tek büyük Linear olarak uygulanıp yeniden şekillendirilir.</div></div>
<div class="calc-card"><div class="card-title">W_O</div><div class="card-body">Başlıkları d_model'e geri karıştıran son çıktı projeksiyonu.</div></div>
<div class="calc-card"><div class="card-title">Neden başlıklar</div><div class="card-body">Her başlık uzmanlaşabilir. Biri özne-yüklem, diğeri sıfat-isim takip edebilir.</div></div>
<div class="calc-card"><div class="card-title">Aynı hesaplama</div><div class="card-body">d_k = d_model/h olan h başlık, d_model boyutlu 1 başlıkla aynı maliyettedir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">import</span> math

<span class="kw">class</span> <span class="fn">MultiHeadAttention</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d_model, num_heads, dropout=<span class="num">0.1</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">assert</span> d_model % num_heads == <span class="num">0</span>
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads

        self.W_q = nn.<span class="fn">Linear</span>(d_model, d_model)
        self.W_k = nn.<span class="fn">Linear</span>(d_model, d_model)
        self.W_v = nn.<span class="fn">Linear</span>(d_model, d_model)
        self.W_o = nn.<span class="fn">Linear</span>(d_model, d_model)

        self.dropout = nn.<span class="fn">Dropout</span>(dropout)

    <span class="kw">def</span> <span class="fn">forward</span>(self, x_q, x_k, x_v, mask=<span class="kw">None</span>):
        B, T_q, _ = x_q.shape
        T_k = x_k.<span class="fn">size</span>(<span class="num">1</span>)

        <span class="cm"># 1) projekte et ve basliklara yeniden sekillendir</span>
        Q = self.<span class="fn">W_q</span>(x_q).<span class="fn">view</span>(B, T_q, self.num_heads, self.d_k).<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)
        K = self.<span class="fn">W_k</span>(x_k).<span class="fn">view</span>(B, T_k, self.num_heads, self.d_k).<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)
        V = self.<span class="fn">W_v</span>(x_v).<span class="fn">view</span>(B, T_k, self.num_heads, self.d_k).<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>)

        <span class="cm"># 2) her baslik icin olcekli ic carpim attention</span>
        scores = Q @ K.<span class="fn">transpose</span>(-<span class="num">2</span>, -<span class="num">1</span>) / math.<span class="fn">sqrt</span>(self.d_k)
        <span class="kw">if</span> mask <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
            scores = scores.<span class="fn">masked_fill</span>(mask == <span class="num">0</span>, <span class="fn">float</span>(<span class="str">"-inf"</span>))
        attn = F.<span class="fn">softmax</span>(scores, dim=-<span class="num">1</span>)
        attn = self.<span class="fn">dropout</span>(attn)
        out = attn @ V

        <span class="cm"># 3) basliklari birlestir</span>
        out = out.<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">2</span>).<span class="fn">contiguous</span>().<span class="fn">view</span>(B, T_q, self.d_model)

        <span class="cm"># 4) son cikis projeksiyonu</span>
        <span class="kw">return</span> self.<span class="fn">W_o</span>(out), attn

mha = <span class="fn">MultiHeadAttention</span>(d_model=<span class="num">256</span>, num_heads=<span class="num">8</span>)
x = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">32</span>, <span class="num">256</span>)
out, attn = <span class="fn">mha</span>(x, x, x)               <span class="cm"># self-attention</span>
<span class="fn">print</span>(out.shape, attn.shape)            <span class="cm"># (2, 32, 256)  (2, 8, 32, 32)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Multi-head attention = embedding'in dilimleri üzerinde h bağımsız attention hesabı. Tek bir cümle üzerinde 4 head, d=4 yapıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.special import softmax

rng = np.random.default_rng(0)
seq_len, d_model, n_heads = 5, 16, 4
d_head = d_model // n_heads

X = rng.standard_normal((seq_len, d_model))

# Project Q, K, V (random weights, no training)
Wq = rng.standard_normal((d_model, d_model))
Wk = rng.standard_normal((d_model, d_model))
Wv = rng.standard_normal((d_model, d_model))
Q = X @ Wq; K = X @ Wk; V = X @ Wv

# Reshape into heads
def split_heads(t):
    return t.reshape(seq_len, n_heads, d_head).transpose(1, 0, 2)
Qh, Kh, Vh = split_heads(Q), split_heads(K), split_heads(V)

# Per-head attention
heads_out = []
for h in range(n_heads):
    s = Qh[h] @ Kh[h].T / np.sqrt(d_head)
    a = softmax(s, axis=-1)
    heads_out.append(a @ Vh[h])

# Concat heads back
out = np.concatenate(heads_out, axis=-1)
print('per-head output shape:', heads_out[0].shape)
print('concatenated   shape :', out.shape, '   (matches input shape)')</code></pre></div>
</div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Girdiyi üç Linear katmanı yoluyla üç kez projekte ederek <code>(B, T, d_model)</code> boyutunda ham Q, K, V alır. <code>(B, T, H, d_k)</code> şeklinde yeniden şekillendiririz, sonra H ve T eksenlerini transpoze ederiz; böylece attention temiz şekilde yayılır: <code>(B, H, T, d_k)</code>. 2) Her başlık için bağımsız olarak ölçekli iç çarpım attention'ı çalıştırır; H boyutu PyTorch'un matmul'una göre sadece bir batch boyutudur. 3) Geri transpoze edip yeniden şekillendirerek başlıkları birleştirir -- view'dan önce contiguous, çünkü transpoze bellek düzenini bozar. 4) Bilgiyi başlıklar arasında d_model alanına geri karıştırmak için son çıktı projeksiyonu W_O'yu uygular. Self-attention sorgu, anahtar ve değerin hepsinin aynı girdi <code>x</code>'ten geldiği özel durumdur; çapraz attention (encoder-decoder'da kullanılır) farklı tensor'ları besler.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: BERT'te başlık uzmanlaşması</div><div class="example-body">Eğitilmiş bir BERT'in attention ağırlıklarını görselleştirdiğinizde, başlığa göre net örüntüler görürsünüz. Bazı başlıklar önceki token'a bakar (öğrenilmiş bir bigram dedektörü). Bazıları sonraki token'a bakar. Bazıları [SEP] ayırıcısına bakar. Bazıları koreferentlere bakar -- sorgu "o" olduğunda, daha önce bahsedilen isme yüksek ağırlık gider. Bu ortaya çıkan uzmanlaşma açık denetim olmadan olur; dil modellemesinde self-attention eğitiminden düşer.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Pozisyonel Embedding'ler (Hızlı Hatırlatma)</h2>

<p class="l-text">Self-attention permütasyon değişmezdir: girdi token'larını karıştırın, çıktı aynı şekilde karışır. Sırayı enjekte etmek için transformer'lar ilk katmandan önce token embedding'ine pozisyonel bir embedding ekler.</p>

<div class="katex-block">$$\\text{PE}_{(pos, 2i)} = \\sin\\!\\left(\\frac{pos}{10000^{2i/d}}\\right), \\qquad \\text{PE}_{(pos, 2i+1)} = \\cos\\!\\left(\\frac{pos}{10000^{2i/d}}\\right)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">pos</div><div class="card-body">Dizi pozisyonu 0, 1, 2, ...</div></div>
<div class="calc-card"><div class="card-title">i</div><div class="card-body">Boyut indeksi, 0 ile d/2 - 1 arası.</div></div>
<div class="calc-card"><div class="card-title">d</div><div class="card-body">Embedding boyutu.</div></div>
<div class="calc-card"><div class="card-title">10000</div><div class="card-body">Boyutlar arasında dalga boylarını kısadan çok uzuna yayan sabit.</div></div>
<div class="calc-card"><div class="card-title">Topla, birleştirme</div><div class="card-body">Pozisyon token embedding'e eleman bazlı toplanır.</div></div>
<div class="calc-card"><div class="card-title">Modern türler</div><div class="card-body">RoPE (LLaMA), ALiBi -- ikisi de görülenden daha uzun dizilere genişler.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> math

<span class="kw">class</span> <span class="fn">SinusoidalPositionalEmbedding</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d_model, max_len=<span class="num">5000</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        pe = torch.<span class="fn">zeros</span>(max_len, d_model)
        pos = torch.<span class="fn">arange</span>(max_len).<span class="fn">unsqueeze</span>(<span class="num">1</span>).<span class="fn">float</span>()
        div = torch.<span class="fn">exp</span>(torch.<span class="fn">arange</span>(<span class="num">0</span>, d_model, <span class="num">2</span>).<span class="fn">float</span>()
                        * -(math.<span class="fn">log</span>(<span class="num">10000.0</span>) / d_model))
        pe[:, <span class="num">0</span>::<span class="num">2</span>] = torch.<span class="fn">sin</span>(pos * div)
        pe[:, <span class="num">1</span>::<span class="num">2</span>] = torch.<span class="fn">cos</span>(pos * div)
        self.<span class="fn">register_buffer</span>(<span class="str">"pe"</span>, pe.<span class="fn">unsqueeze</span>(<span class="num">0</span>))

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> x + self.pe[:, : x.<span class="fn">size</span>(<span class="num">1</span>), :]

pe = <span class="fn">SinusoidalPositionalEmbedding</span>(d_model=<span class="num">128</span>)
x = torch.<span class="fn">zeros</span>(<span class="num">1</span>, <span class="num">50</span>, <span class="num">128</span>)
y = <span class="fn">pe</span>(x)
<span class="fn">print</span>(y.shape)            <span class="cm"># (1, 50, 128)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pozisyonel embedding'ler -- burada orijinal Transformer makalesinin kullandığı sinüzoidal varyant.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def positional_encoding(seq_len, d_model):
    pos = np.arange(seq_len)[:, None]
    i = np.arange(d_model)[None, :]
    rates = 1 / np.power(10000, (2 * (i // 2)) / d_model)
    angles = pos * rates
    pe = np.zeros((seq_len, d_model))
    pe[:, 0::2] = np.sin(angles[:, 0::2])
    pe[:, 1::2] = np.cos(angles[:, 1::2])
    return pe

pe = positional_encoding(seq_len=10, d_model=8)
print('pos encoding shape:', pe.shape)
print('positions 0..3:\n', pe[:4].round(3))
print('frobenius norm:', round(float(np.linalg.norm(pe)), 3))</code></pre></div>
</div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Yapım zamanında <code>(max_len, d_model)</code> şekilli sinüzoidal tabloyu önceden hesaplar. <code>.to(device)</code> ile birlikte hareket etsin diye buffer olarak kaydederiz ama öğrenilebilir parametre değildir. 2) Forward metodu tablonun ilk <code>T</code> satırını dilimler ve girdiye eleman bazlı ekler. 3) Farklı boyutlar üstel olarak farklı frekanslarda salınır, böylece her pozisyon benzersiz bir parmak izi alır ama komşu pozisyonlar benzer kalır -- attention'ın "yakın" ile "uzak"ın farklı anlam taşıdığını öğrenmesi için ihtiyaç duyduğu özellik.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Sıfırdan Encoder Bloğu</h2>

<p class="l-text">Bir transformer encoder bloğu multi-head self-attention, pozisyon bazlı feed-forward ağı, residual bağlantıları, layer normalization ve dropout'u yığar. 2017'den beri tarif değişmedi; sadece hiperparametreler büyüdü.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">FeedForward</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d_model, d_ff, dropout=<span class="num">0.1</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc1 = nn.<span class="fn">Linear</span>(d_model, d_ff)
        self.fc2 = nn.<span class="fn">Linear</span>(d_ff, d_model)
        self.act = nn.<span class="fn">GELU</span>()
        self.drop = nn.<span class="fn">Dropout</span>(dropout)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">fc2</span>(self.<span class="fn">drop</span>(self.<span class="fn">act</span>(self.<span class="fn">fc1</span>(x))))

<span class="kw">class</span> <span class="fn">TransformerEncoderBlock</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d_model, num_heads, d_ff, dropout=<span class="num">0.1</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.attn = <span class="fn">MultiHeadAttention</span>(d_model, num_heads, dropout)
        self.ffn = <span class="fn">FeedForward</span>(d_model, d_ff, dropout)
        self.ln1 = nn.<span class="fn">LayerNorm</span>(d_model)
        self.ln2 = nn.<span class="fn">LayerNorm</span>(d_model)
        self.drop = nn.<span class="fn">Dropout</span>(dropout)

    <span class="kw">def</span> <span class="fn">forward</span>(self, x, mask=<span class="kw">None</span>):
        <span class="cm"># 1) self-attention + residual + layernorm (pre-norm)</span>
        h = self.<span class="fn">ln1</span>(x)
        a, _ = self.<span class="fn">attn</span>(h, h, h, mask=mask)
        x = x + self.<span class="fn">drop</span>(a)

        <span class="cm"># 2) FFN + residual + layernorm</span>
        h = self.<span class="fn">ln2</span>(x)
        f = self.<span class="fn">ffn</span>(h)
        x = x + self.<span class="fn">drop</span>(f)
        <span class="kw">return</span> x

block = <span class="fn">TransformerEncoderBlock</span>(d_model=<span class="num">256</span>, num_heads=<span class="num">8</span>, d_ff=<span class="num">1024</span>)
x = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">32</span>, <span class="num">256</span>)
y = <span class="fn">block</span>(x)
<span class="fn">print</span>(y.shape)              <span class="cm"># (2, 32, 256)</span>

<span class="kw">class</span> <span class="fn">TransformerEncoder</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, num_layers, d_model, num_heads, d_ff, dropout=<span class="num">0.1</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.layers = nn.<span class="fn">ModuleList</span>([
            <span class="fn">TransformerEncoderBlock</span>(d_model, num_heads, d_ff, dropout)
            <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(num_layers)
        ])
        self.ln_final = nn.<span class="fn">LayerNorm</span>(d_model)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x, mask=<span class="kw">None</span>):
        <span class="kw">for</span> layer <span class="kw">in</span> self.layers:
            x = <span class="fn">layer</span>(x, mask)
        <span class="kw">return</span> self.<span class="fn">ln_final</span>(x)

enc = <span class="fn">TransformerEncoder</span>(num_layers=<span class="num">6</span>, d_model=<span class="num">256</span>, num_heads=<span class="num">8</span>, d_ff=<span class="num">1024</span>)
<span class="fn">print</span>(<span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> enc.<span class="fn">parameters</span>()) / <span class="num">1e6</span>, <span class="str">"M parametre"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sıfırdan encoder bloğu: attention -> add & norm -> FFN -> add & norm. Parçaları NumPy'da açıkça zincirliyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.special import softmax

def layer_norm(x, eps=1e-5):
    mean = x.mean(axis=-1, keepdims=True)
    std  = x.std(axis=-1, keepdims=True)
    return (x - mean) / (std + eps)

def attention(Q, K, V):
    d_k = Q.shape[-1]
    s = Q @ K.T / np.sqrt(d_k)
    return softmax(s, axis=-1) @ V

rng = np.random.default_rng(0)
d_model = 16
seq_len = 6
X = rng.standard_normal((seq_len, d_model))

# 1. Self-attention
attn_out = attention(X, X, X)
X1 = layer_norm(X + attn_out)

# 2. Feed-forward
W1 = rng.standard_normal((d_model, 32)) * 0.1
W2 = rng.standard_normal((32, d_model)) * 0.1
ffn_out = np.maximum(0, X1 @ W1) @ W2
X2 = layer_norm(X1 + ffn_out)

print('input  :', X.shape)
print('after attention+norm:', X1.shape)
print('after ffn+norm     :', X2.shape)
print('output norm        :', round(float(np.linalg.norm(X2)), 3))</code></pre></div>
</div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Pozisyon bazlı feed-forward ağını tanımlar: arada GELU olan iki linear. Gizli boyut <code>d_ff</code> tipik olarak 4 * d_model'dir -- transformer parametrelerinin çoğu burada yaşar. 2) Encoder bloğunu tanımlar. Orijinal "post-norm" tarifinden daha kararlı eğitilen "pre-norm" varyantını kullanırız (her alt blok öncesi LayerNorm, sonra residual ekleme). 3) Forward içinde: attention alt bloğu attention çıktısını girdiye ekler; FFN alt bloğu FFN çıktısını akan akışa ekler. İkisi de residual + LayerNorm + Dropout ile sarılı. 4) Tam bir encoder'a N blok yığar, son LayerNorm ile. Çıktı şekli girdi şekline eşittir -- transformer'lar uzunluk koruyandır. 5) Parametreleri sayar: d_model=256 olan 6 katmanlı blok yaklaşık 4.7M -- "küçük" bir encoder. BERT-base 12 katmana, d_model=768'e ve ~110M parametreye sahiptir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: pre-norm vs post-norm</div><div class="example-body">2017 makalesi post-norm kullandı: <code>x = LayerNorm(x + Sublayer(x))</code>. Pre-norm bunu çevirir: <code>x = x + Sublayer(LayerNorm(x))</code>. Pre-norm öğrenme oranı warmup'ı olmadan kararlı eğitilir ve derin yığınlara ölçeklenir (GPT, LLaMA, BERT-large hepsi pre-norm kullanır). Post-norm bazen küçük modellerde biraz daha yüksek son doğruluk alır ama kırılgandır. Modern kod varsayılan olarak pre-norm kullanır.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. nn.TransformerEncoder'ı Doğrudan Kullanma</h2>

<p class="l-text">PyTorch <code>nn.TransformerEncoderLayer</code> ve <code>nn.TransformerEncoder</code>'ı kutudan çıkar çıkmaz sunar. Aynı matematiği takip ederler, birkaç pratik düğmeyle.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># 1) Tek encoder katmani</span>
layer = nn.<span class="fn">TransformerEncoderLayer</span>(
    d_model=<span class="num">256</span>,
    nhead=<span class="num">8</span>,
    dim_feedforward=<span class="num">1024</span>,
    dropout=<span class="num">0.1</span>,
    activation=<span class="str">"gelu"</span>,
    batch_first=<span class="kw">True</span>,        <span class="cm"># (B, T, D) duzeni, onerilen</span>
    norm_first=<span class="kw">True</span>          <span class="cm"># pre-norm</span>
)

<span class="cm"># 2) Tam bir encoder'a yig</span>
encoder = nn.<span class="fn">TransformerEncoder</span>(layer, num_layers=<span class="num">6</span>)

<span class="cm"># 3) Calistir</span>
x = torch.<span class="fn">randn</span>(<span class="num">2</span>, <span class="num">32</span>, <span class="num">256</span>)
out = <span class="fn">encoder</span>(x)
<span class="fn">print</span>(out.shape)                          <span class="cm"># (2, 32, 256)</span>

<span class="cm"># 4) Key padding maskesi ile (True = yoksay)</span>
pad_mask = torch.<span class="fn">zeros</span>(<span class="num">2</span>, <span class="num">32</span>, dtype=torch.<span class="ty">bool</span>)
pad_mask[<span class="num">0</span>, <span class="num">28</span>:] = <span class="kw">True</span>
out = <span class="fn">encoder</span>(x, src_key_padding_mask=pad_mask)
<span class="fn">print</span>(out.shape)

<span class="cm"># 5) Tam bir BERT tarzi siniflandirici basligi</span>
<span class="kw">class</span> <span class="fn">TextClassifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, d_model, num_heads, num_layers, num_classes, max_len=<span class="num">128</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(vocab_size, d_model, padding_idx=<span class="num">0</span>)
        self.pos = nn.<span class="fn">Embedding</span>(max_len, d_model)
        layer = nn.<span class="fn">TransformerEncoderLayer</span>(d_model, num_heads, dim_feedforward=<span class="num">4</span>*d_model,
                                           batch_first=<span class="kw">True</span>, norm_first=<span class="kw">True</span>, activation=<span class="str">"gelu"</span>)
        self.encoder = nn.<span class="fn">TransformerEncoder</span>(layer, num_layers=num_layers)
        self.cls = nn.<span class="fn">Linear</span>(d_model, num_classes)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids, pad_mask=<span class="kw">None</span>):
        B, T = ids.shape
        positions = torch.<span class="fn">arange</span>(T, device=ids.device).<span class="fn">unsqueeze</span>(<span class="num">0</span>).<span class="fn">expand</span>(B, T)
        x = self.<span class="fn">embed</span>(ids) + self.<span class="fn">pos</span>(positions)
        h = self.<span class="fn">encoder</span>(x, src_key_padding_mask=pad_mask)
        <span class="kw">if</span> pad_mask <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
            mask = (~pad_mask).<span class="fn">unsqueeze</span>(-<span class="num">1</span>).<span class="fn">float</span>()
            h = (h * mask).<span class="fn">sum</span>(<span class="num">1</span>) / mask.<span class="fn">sum</span>(<span class="num">1</span>).<span class="fn">clamp</span>(<span class="ty">min</span>=<span class="num">1</span>)
        <span class="kw">else</span>:
            h = h.<span class="fn">mean</span>(<span class="num">1</span>)
        <span class="kw">return</span> self.<span class="fn">cls</span>(h)

m = <span class="fn">TextClassifier</span>(vocab_size=<span class="num">30000</span>, d_model=<span class="num">128</span>, num_heads=<span class="num">4</span>, num_layers=<span class="num">2</span>, num_classes=<span class="num">2</span>)
ids = torch.<span class="fn">randint</span>(<span class="num">1</span>, <span class="num">30000</span>, (<span class="num">4</span>, <span class="num">64</span>))
<span class="fn">print</span>(<span class="fn">m</span>(ids).shape)                       <span class="cm"># (4, 2)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Birden çok encoder bloğunu yığma: her blok bir fonksiyondur, Python döngüsünde basitçe komposize ediyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.special import softmax

def layer_norm(x, eps=1e-5):
    return (x - x.mean(-1, keepdims=True)) / (x.std(-1, keepdims=True) + eps)

def encoder_block(X, params):
    Wq, Wk, Wv, W1, W2 = params
    Q, K, V = X @ Wq, X @ Wk, X @ Wv
    a = softmax(Q @ K.T / np.sqrt(Q.shape[-1]), axis=-1) @ V
    X1 = layer_norm(X + a)
    f = np.maximum(0, X1 @ W1) @ W2
    return layer_norm(X1 + f)

rng = np.random.default_rng(0)
d_model, seq_len = 16, 5
X = rng.standard_normal((seq_len, d_model))

# Stack 4 encoder blocks with random weights
def make_params():
    return [rng.standard_normal((d_model, d_model)) * 0.1 for _ in range(3)] +            [rng.standard_normal((d_model, 32)) * 0.1, rng.standard_normal((32, d_model)) * 0.1]

stack = [make_params() for _ in range(4)]
out = X
for i, p in enumerate(stack):
    out = encoder_block(out, p)
    print(f'after block {i}: shape={out.shape}, mean={out.mean():.3f}, std={out.std():.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>batch_first=True</code> ile tek bir encoder katmanı kurar, böylece girdi <code>(B, T, D)</code>'dir -- her yerde isteyeceğiniz konvansiyon; eski varsayılan <code>(T, B, D)</code> bir hata kaynağıdır. <code>norm_first=True</code> pre-norm'u açar. 2) <code>nn.TransformerEncoder</code>'da N kopyayı sarar; bu döngüyü ve istenirse son LayerNorm'u halleder. 3) Forward girdiyi geçirir; çıktı şekli girdiyle eşleşir. 4) <code>src_key_padding_mask</code>'i gösterir: True'nun "bu pozisyonu yoksay" demek olduğu boolean maske. Padding token'ları attention'a hiçbir şey katmaz. 5) Küçük bir metin sınıflandırıcı kurar: token + pozisyon embedding, transformer encoder, padding olmayan token'lar üzerinde mean-pool, lineer baş. Bu çoğu BERT tarzı sınıflandırma ince ayarın altındaki mimaridir; görevler arasında yalnızca embedding ve sınıflandırma başı farklılık gösterir.</p>

<div class="l-warn"><strong>Maske konvansiyonları kafa karıştırıcıdır.</strong> PyTorch <code>nn.MultiheadAttention</code> <code>True = yoksay</code> kullanır. Bazı özel kodlar <code>True = tut</code> kullanır. HuggingFace tokenizer'lar <code>1 = tut</code> döner. Her zaman bilinen padding'li bir dizi besleyip modelin çıktısının o pozisyonları yoksaydığını doğrulayarak kontrol edin.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Attention Ağırlıklarını Görselleştirme</h2>

<p class="l-text">Eğitimden sonra attention matrisi modelin hangi token'ları ilişkili gördüğünü size söyler. Onu bir ısı haritası olarak görselleştirmek NLP'de en kullanışlı hata ayıklama araçlarından biridir.</p>

<div id="plot-pl9-attn-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Burada ne görüyoruz:</strong> Bir transformer'ın bir başlığından öğrenilmiş self-attention ısı haritası, "The cat sat on the mat because it was tired" cümlesi için. Satırlar sorgu pozisyonları; sütunlar anahtar pozisyonları. "it" satırı, "cat" sütunundaki parlak hücre başlığın koreferansı öğrendiğini ortaya koyar: "it" için bağlamsal vektörü hesaplarken model öncelikle "cat"e bakar. <strong>NLP için neden önemli:</strong> attention haritaları yorumlanabilirlik altınıdır -- modelin duygu, NER veya koreferans için doğru token'lara güvenip güvenmediğini görmenize izin verir ve sıklıkla değerlendirme metriklerini düşürmeden önce hataları (örn. padding'e dikkat) ortaya çıkarır.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">import</span> math

torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)
T, d_k = <span class="num">9</span>, <span class="num">32</span>
Q = torch.<span class="fn">randn</span>(T, d_k)
K = torch.<span class="fn">randn</span>(T, d_k)

scores = Q @ K.T / math.<span class="fn">sqrt</span>(d_k)
attn = F.<span class="fn">softmax</span>(scores, dim=-<span class="num">1</span>)         <span class="cm"># (T, T)</span>

<span class="fn">print</span>(attn.shape)                        <span class="cm"># (9, 9)</span>
<span class="fn">print</span>(attn.<span class="fn">sum</span>(dim=-<span class="num">1</span>))                  <span class="cm"># tum satirlar ~ 1.0</span>

<span class="cm"># Gercek bir notebook'ta:</span>
<span class="cm"># import matplotlib.pyplot as plt</span>
<span class="cm"># plt.imshow(attn.detach().numpy(), cmap="viridis")</span>
<span class="cm"># plt.xticks(range(T), tokens, rotation=45)</span>
<span class="cm"># plt.yticks(range(T), tokens)</span>
<span class="cm"># plt.colorbar(); plt.show()</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Attention ağırlıklarını görselleştir: birkaç anahtar karşısında bir sorguyla ölçekli iç çarpım attention çalıştırıyoruz -- transformer makalelerindeki softmax dağılımı budur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.special import softmax

rng = np.random.default_rng(0)
d_k = 8
keys = rng.standard_normal((6, d_k))   # 6 keys
# Pick a query that is similar to key #2
query = keys[2] + rng.standard_normal(d_k) * 0.2

scores = query @ keys.T / np.sqrt(d_k)
attn   = softmax(scores)
print('scores            :', scores.round(3))
print('attention weights :', attn.round(3))
print('argmax (target)   :', int(attn.argmax()))
for i, w in enumerate(attn):
    bar = '#' * int(w * 40)
    print(f'  key {i}: weight {w:.3f}  {bar}')</code></pre></div>
</div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) T=9 uzunluğunda rastgele Q ve K tensor'ları oluşturur -- bunların 9 kelimelik bir cümlenin token embedding'lerinden geldiğini varsayın. 2) Ölçekli skorları ve satır bazlı softmax'ı hesaplayarak her satırın anahtarlar üzerinde bir olasılık dağılımı olduğu 9x9 attention matrisini elde eder. 3) Satırların 1'e toplandığını doğrular (her özel attention uygulamasında çalıştırmanız gereken bir akıl sağlığı kontrolü). 4) Yorumlanmış matplotlib kodu standart görselleştirmeyi gösterir: matrisi her iki eksende token etiketleri olan ısı haritası olarak; renk yoğunluğu "bu sorgu o anahtara ne kadar bakıyor" diye okunur.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet: Hepsi Nasıl Çalışır</h2>

<div class="think-box"><div class="think-label">NEDEN sqrt(d_k)?</div><div class="think-body">Eğer <code>q</code> ve <code>k</code> bağımsız özdeş dağılımlı, ortalama 0 ve varyans 1 ise, d_k boyut üzerindeki iç çarpımları ortalama 0 ve varyans d_k'dir. Ölçekleme olmadan ham skorların standart sapması <code>sqrt(d_k)</code>'dir; d_k = 64 için bu yaklaşık 8'dir -- softmax için kocaman. Büyük pozitif değerlerin softmax'ı doyar: bir pozisyon neredeyse tüm ağırlığı alır ve gradyan kaybolur. <code>sqrt(d_k)</code>'ye bölmek skorları varyans 1'e ölçekler, softmax'ı yararlı aralığında tutar. Bu, attention makalesini "biraz çalışıyor"dan "her şeye hâkim"e götüren tek satırlık bir düzeltmedir.</div></div>

<div class="think-box"><div class="think-label">ANA NOKTALAR</div><div class="think-body"><strong>1.</strong> Attention içeriğe bağlı ağırlıklamadır: her sorgu anahtarlar üzerinde softmax alır ve çıktı değerlerin ağırlıklı toplamıdır.<br><strong>2.</strong> Ölçekli iç çarpım attention softmax'ı sağlıklı bir rejimde tutmak için sqrt(d_k)'ye böler.<br><strong>3.</strong> Multi-head attention daha düşük boyutlu projeksiyonlar üzerinde h paralel attention başlığı çalıştırır ve birleştirir; bir büyük başlıkla aynı hesaplama, çok daha ifade edici.<br><strong>4.</strong> Pozisyonel embedding'ler sırayı enjekte eder; onlarsız attention permütasyon değişmezdir.<br><strong>5.</strong> Bir encoder bloğu = MHA + residual + LayerNorm + FFN + residual + LayerNorm. Pre-norm modern varsayılandır.<br><strong>6.</strong> <code>nn.TransformerEncoderLayer</code> with <code>batch_first=True</code> ve <code>norm_first=True</code> önerilen yüksek seviyeli API'dir.<br><strong>7.</strong> Her zaman maske konvansiyonlarını kontrol edin; padding maske hataları sessiz ve felakettir.<br><strong>8.</strong> Sonraki ders: önceden eğitilmiş modeller ve transfer öğrenme -- sıfırdan eğitimi atlayıp 110M parametreli bir transformer'ı birkaç yüz satırda nasıl ince ayar yaparsınız.</div></div>
</div>`

};
