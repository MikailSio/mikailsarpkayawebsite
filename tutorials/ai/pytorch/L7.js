window.PYTORCH_L7 = {

en: `<p class="l-text"><strong>RNNs are the original neural network architecture for sequences.</strong> Before transformers ate the world, every speech recognizer, machine translator, language model, and sentiment classifier ran on a recurrent network. Even today, RNNs and their LSTM/GRU variants are the right choice for streaming data, very small models, and real-time inference where transformer attention is too expensive.</p>

<p class="l-text">This lesson explains the recurrent equation, the vanishing-gradient problem, the LSTM gate mechanism that solved it, GRU's simpler alternative, and PyTorch's <code>nn.RNN</code>, <code>nn.LSTM</code>, <code>nn.GRU</code> with all their flags (batch_first, bidirectional, num_layers). We end with a sentiment classifier built on a BiLSTM.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive the vanilla RNN equation and unroll it through time on a toy sequence</li>
<li>Explain the vanishing-gradient problem and why LSTM gates fix it</li>
<li>Distinguish LSTM forget/input/output gates from GRU update/reset gates</li>
<li>Use <code>nn.RNN</code>, <code>nn.LSTM</code>, <code>nn.GRU</code> with <code>batch_first</code>, <code>bidirectional</code>, <code>num_layers</code></li>
<li>Build a BiLSTM sentiment classifier and pool the hidden states for prediction</li>
<li>Apply gradient clipping and choose when an RNN beats a transformer (streaming, low-latency)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Recurrent Equation</h2>

<p class="l-text">A recurrent neural network is just a function applied repeatedly to a hidden state, advancing one timestep at a time. At each step it sees the current input and the previous hidden state, and produces a new hidden state.</p>

<div class="katex-block">$$h_t = \\tanh(W_h h_{t-1} + W_x x_t + b)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x_t</div><div class="card-body">Input at timestep t. For text: a token embedding of shape <code>(E,)</code>.</div></div>
<div class="calc-card"><div class="card-title">h_{t-1}</div><div class="card-body">Hidden state from the previous step. Carries memory of everything seen so far.</div></div>
<div class="calc-card"><div class="card-title">h_t</div><div class="card-body">New hidden state. Same shape as h_{t-1}; the output of step t.</div></div>
<div class="calc-card"><div class="card-title">W_x</div><div class="card-body">Input-to-hidden weight matrix. Shape <code>(H, E)</code> for hidden size H.</div></div>
<div class="calc-card"><div class="card-title">W_h</div><div class="card-body">Hidden-to-hidden weight matrix. Shape <code>(H, H)</code>. Same matrix at every step.</div></div>
<div class="calc-card"><div class="card-title">tanh</div><div class="card-body">Activation. Squashes the hidden state to (-1, 1) so it does not explode.</div></div>
</div>

<div class="calc-highlight"><strong>The defining property of an RNN:</strong> the same parameters W_x, W_h, b are used at every timestep. The network does not grow with sequence length -- it just unrolls in time. This is parameter sharing across time.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Build an RNN cell by hand to make the equation concrete</span>
<span class="kw">class</span> <span class="fn">HandRNNCell</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, input_size, hidden_size):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.W_x = nn.<span class="fn">Linear</span>(input_size, hidden_size, bias=<span class="kw">False</span>)
        self.W_h = nn.<span class="fn">Linear</span>(hidden_size, hidden_size, bias=<span class="kw">True</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x_t, h_prev):
        <span class="kw">return</span> torch.<span class="fn">tanh</span>(self.<span class="fn">W_x</span>(x_t) + self.<span class="fn">W_h</span>(h_prev))

<span class="cm"># Use it across a sequence</span>
B, T, E, H = <span class="num">2</span>, <span class="num">5</span>, <span class="num">4</span>, <span class="num">8</span>
cell = <span class="fn">HandRNNCell</span>(E, H)
x = torch.<span class="fn">randn</span>(B, T, E)
h = torch.<span class="fn">zeros</span>(B, H)
outputs = []
<span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
    h = <span class="fn">cell</span>(x[:, t, :], h)
    outputs.<span class="fn">append</span>(h)
out_seq = torch.<span class="fn">stack</span>(outputs, dim=<span class="num">1</span>)         <span class="cm"># (B, T, H)</span>
<span class="fn">print</span>(out_seq.shape)                           <span class="cm"># torch.Size([2, 5, 8])</span>

<span class="cm"># Same thing in one line with PyTorch's nn.RNN</span>
rnn = nn.<span class="fn">RNN</span>(input_size=E, hidden_size=H, batch_first=<span class="kw">True</span>)
out, h_n = <span class="fn">rnn</span>(x)
<span class="fn">print</span>(out.shape, h_n.shape)                    <span class="cm"># (2, 5, 8) and (1, 2, 8)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">An RNN is a for-loop over time-steps. We hand-roll the recurrent equation h_t = tanh(W_xh @ x_t + W_hh @ h_{t-1}) in NumPy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
seq_len, in_dim, hid_dim = 8, 4, 16
x_seq = rng.standard_normal((seq_len, in_dim))

W_xh = rng.standard_normal((in_dim, hid_dim)) * 0.1
W_hh = rng.standard_normal((hid_dim, hid_dim)) * 0.1
b_h  = np.zeros(hid_dim)

h = np.zeros(hid_dim)
hidden_history = []
for t in range(seq_len):
    h = np.tanh(x_seq[t] @ W_xh + h @ W_hh + b_h)
    hidden_history.append(h)

H = np.array(hidden_history)
print('input shape :', x_seq.shape)
print('hidden shape:', H.shape, '(seq, hidden)')
print('final h norm:', round(float(np.linalg.norm(h)), 3))
print('hidden norm trajectory:', np.linalg.norm(H, axis=1).round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a hand-rolled RNN cell to ground the equation -- two linear projections and a tanh, exactly as the formula. 2) Runs the cell across a 5-step sequence with batch size 2 and embedding dim 4. The hidden state starts as zeros and is updated step by step. 3) Stacks all hidden states into a sequence output of shape <code>(B, T, H)</code>. 4) Demonstrates that <code>nn.RNN</code> does the same thing in one line, returning both the full sequence of hidden states (for token-level outputs) and the final hidden state (for sentence-level summaries).</p>

<div class="calc-example"><div class="example-label">EXAMPLE: language modeling rhythm</div><div class="example-body">In a character-level language model, x_t is the current character embedding and h_t is supposed to summarize "everything I have read so far". The model trains to predict x_{t+1} from h_t -- and the gradient flowing back through h tells the network how to update W_h, W_x to better encode useful history. This is how Karpathy's char-RNN learned to produce Shakespeare from raw bytes.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Vanishing Gradient Problem</h2>

<p class="l-text">Plain RNNs sound elegant, but they have a fatal flaw: gradients flowing back through many timesteps either vanish to zero or explode to infinity. By the time backprop reaches step 1 from step 100, the gradient has been multiplied by the same matrix W_h 99 times.</p>

<div class="katex-block">$$\\frac{\\partial L}{\\partial h_0} = \\frac{\\partial L}{\\partial h_T}\\prod_{t=1}^{T} \\frac{\\partial h_t}{\\partial h_{t-1}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Product of T Jacobians</div><div class="card-body">Each step's local derivative gets multiplied. For T=100, you have a product of 100 matrices.</div></div>
<div class="calc-card"><div class="card-title">If norm &lt; 1</div><div class="card-body">Product shrinks exponentially. Gradient at step 1 becomes ~0. Network cannot learn long-range patterns.</div></div>
<div class="calc-card"><div class="card-title">If norm &gt; 1</div><div class="card-body">Product grows exponentially. Gradients explode. Loss becomes NaN.</div></div>
<div class="calc-card"><div class="card-title">tanh derivative</div><div class="card-body">≤ 1, so naturally pushes toward vanishing. Worse with sigmoid (≤ 0.25).</div></div>
<div class="calc-card"><div class="card-title">Practical limit</div><div class="card-body">Plain RNN can learn dependencies of ~10-20 steps reliably; struggles past that.</div></div>
<div class="calc-card"><div class="card-title">Solutions</div><div class="card-body">LSTM/GRU (gated paths), residual connections, gradient clipping, careful initialization.</div></div>
</div>

<div id="plot-pl7-vanish-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Gradient magnitude flowing back through time for a plain RNN over 100 steps, plotted on a log scale. With a typical W_h spectral radius of 0.95 the gradient at step 1 is about 0.005 of its value at step 100 -- essentially vanished, the network cannot learn that timestep's contribution. With LSTM the gate mechanism (next section) keeps a path where the gradient flows almost unchanged through the cell state, recovering long-range learning.</div>

<div class="think-box"><div class="think-label">WHY GATES ARE THE FIX</div><div class="think-body">Imagine a highway running parallel to your RNN, where information flows largely unmodified, with gates that selectively read from and write to it. That is the LSTM. The "cell state" travels through the network with only multiplications by gate values close to 1, avoiding the catastrophic gradient decay of plain RNNs. This is the single insight that made deep learning on long sequences possible from 1997 (LSTM paper) to 2017 (transformers).</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. LSTM: Gates and Cell State</h2>

<p class="l-text">The LSTM cell adds a separate "cell state" c_t that flows through time with only gentle modifications. Three gates control what enters, what leaves, and what gets exposed to the rest of the network.</p>

<div class="katex-block">$$f_t = \\sigma(W_f[h_{t-1}, x_t] + b_f), \\quad i_t = \\sigma(W_i[h_{t-1}, x_t] + b_i), \\quad o_t = \\sigma(W_o[h_{t-1}, x_t] + b_o)$$</div>

<div class="katex-block">$$\\tilde{c}_t = \\tanh(W_c[h_{t-1}, x_t] + b_c), \\quad c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t, \\quad h_t = o_t \\odot \\tanh(c_t)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">f_t (forget gate)</div><div class="card-body">Sigmoid in [0, 1]; chooses how much of the old cell state to keep. 0 = forget, 1 = keep.</div></div>
<div class="calc-card"><div class="card-title">i_t (input gate)</div><div class="card-body">Sigmoid; chooses how much new candidate to write into the cell state.</div></div>
<div class="calc-card"><div class="card-title">o_t (output gate)</div><div class="card-body">Sigmoid; chooses how much of the cell state to expose as the hidden state h_t.</div></div>
<div class="calc-card"><div class="card-title">tilde c_t</div><div class="card-body">Candidate cell update; tanh-bounded.</div></div>
<div class="calc-card"><div class="card-title">c_t</div><div class="card-body">Cell state; the "long-term memory" channel.</div></div>
<div class="calc-card"><div class="card-title">h_t</div><div class="card-body">Hidden state; the "short-term" output exposed to the next layer.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

B, T, E, H = <span class="num">2</span>, <span class="num">6</span>, <span class="num">4</span>, <span class="num">8</span>

<span class="cm"># nn.LSTM packages all gate computation efficiently</span>
lstm = nn.<span class="fn">LSTM</span>(input_size=E, hidden_size=H, batch_first=<span class="kw">True</span>)

x = torch.<span class="fn">randn</span>(B, T, E)
out, (h_n, c_n) = <span class="fn">lstm</span>(x)
<span class="cm"># out: full sequence of hidden states, shape (B, T, H)</span>
<span class="cm"># h_n: final hidden state, shape (num_layers * num_directions, B, H)</span>
<span class="cm"># c_n: final cell state, same shape as h_n</span>
<span class="fn">print</span>(out.shape, h_n.shape, c_n.shape)
<span class="cm"># torch.Size([2, 6, 8]) torch.Size([1, 2, 8]) torch.Size([1, 2, 8])</span>

<span class="cm"># Multi-layer LSTM (stacks num_layers LSTMs vertically)</span>
lstm2 = nn.<span class="fn">LSTM</span>(input_size=E, hidden_size=H, num_layers=<span class="num">3</span>,
                batch_first=<span class="kw">True</span>, dropout=<span class="num">0.2</span>)
out, (h_n, c_n) = <span class="fn">lstm2</span>(x)
<span class="fn">print</span>(out.shape, h_n.shape)              <span class="cm"># (2, 6, 8) and (3, 2, 8)</span>

<span class="cm"># Bidirectional LSTM (one forward + one backward)</span>
bilstm = nn.<span class="fn">LSTM</span>(input_size=E, hidden_size=H, batch_first=<span class="kw">True</span>, bidirectional=<span class="kw">True</span>)
out, (h_n, c_n) = <span class="fn">bilstm</span>(x)
<span class="fn">print</span>(out.shape, h_n.shape)              <span class="cm"># (2, 6, 16) -- H doubled  and (2, 2, 8)</span>

<span class="cm"># Manual LSTMCell (for unusual control flow)</span>
cell = nn.<span class="fn">LSTMCell</span>(input_size=E, hidden_size=H)
h_t = torch.<span class="fn">zeros</span>(B, H); c_t = torch.<span class="fn">zeros</span>(B, H)
<span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
    h_t, c_t = <span class="fn">cell</span>(x[:, t, :], (h_t, c_t))
<span class="fn">print</span>(h_t.shape)                         <span class="cm"># (B, H)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">An LSTM cell has 3 gates (forget/input/output) plus a candidate vector. We code the gating equations explicitly -- the cell state c_t and hidden h_t computed by hand.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def sigmoid(x): return 1 / (1 + np.exp(-x))

rng = np.random.default_rng(0)
in_dim, hid_dim = 4, 8
seq_len = 5

# 4 gates: input (i), forget (f), cell candidate (g), output (o)
W = {g: rng.standard_normal((in_dim + hid_dim, hid_dim)) * 0.1 for g in 'ifgo'}
b = {g: np.zeros(hid_dim) for g in 'ifgo'}

x_seq = rng.standard_normal((seq_len, in_dim))
h = np.zeros(hid_dim); c = np.zeros(hid_dim)

for t in range(seq_len):
    z = np.concatenate([x_seq[t], h])
    i_t = sigmoid(z @ W['i'] + b['i'])
    f_t = sigmoid(z @ W['f'] + b['f'])
    g_t = np.tanh(  z @ W['g'] + b['g'])
    o_t = sigmoid(z @ W['o'] + b['o'])
    c   = f_t * c + i_t * g_t
    h   = o_t * np.tanh(c)
    print(f't={t}: ||c||={np.linalg.norm(c):.3f}, ||h||={np.linalg.norm(h):.3f}')

print('final cell state norm:', round(float(np.linalg.norm(c)), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a single-layer LSTM and runs it on a sequence; the output is a tuple <code>(out, (h_n, c_n))</code>. <code>out</code> is the full sequence of hidden states (one per timestep); <code>h_n</code> and <code>c_n</code> are the final hidden and cell states (use these for sentence-level features). 2) Stacks 3 LSTMs vertically, with dropout between layers. The first layer sees embeddings; deeper layers see the previous layer's outputs at each timestep. 3) A bidirectional LSTM runs one LSTM forward in time and another backward, then concatenates the hidden states -- so each output position has seen the entire sequence. The output dimension doubles to <code>2*H</code>. 4) <code>nn.LSTMCell</code> is the per-step version; you write your own loop. Useful when the loop has unusual logic (teacher forcing variants, custom skip connections).</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">nn.LSTM (full)</div><div class="compare-item">Processes whole sequence in one call</div><div class="compare-item">Internally optimized for GPU</div><div class="compare-item">Returns (out, (h_n, c_n))</div><div class="compare-item">Use 95% of the time</div></div>
<div class="compare-col"><div class="compare-title">nn.LSTMCell (per step)</div><div class="compare-item">Processes one timestep per call</div><div class="compare-item">You write the loop</div><div class="compare-item">Slower but flexible</div><div class="compare-item">Use for custom decoders, teacher forcing tweaks</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. GRU: Gated and Simpler</h2>

<p class="l-text">GRU (Cho et al. 2014) is a simpler gated alternative: two gates instead of three, no separate cell state. It runs faster and uses less memory, often matching LSTM accuracy on practical NLP tasks.</p>

<div class="katex-block">$$z_t = \\sigma(W_z[h_{t-1}, x_t]), \\quad r_t = \\sigma(W_r[h_{t-1}, x_t])$$</div>

<div class="katex-block">$$\\tilde{h}_t = \\tanh(W[r_t \\odot h_{t-1}, x_t]), \\quad h_t = (1-z_t)\\odot h_{t-1} + z_t\\odot \\tilde{h}_t$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">z_t (update gate)</div><div class="card-body">Like a combined forget+input gate. 0 = keep old hidden, 1 = use new candidate.</div></div>
<div class="calc-card"><div class="card-title">r_t (reset gate)</div><div class="card-body">Controls how much of the old hidden contributes to the candidate.</div></div>
<div class="calc-card"><div class="card-title">tilde h_t</div><div class="card-body">Candidate hidden update.</div></div>
<div class="calc-card"><div class="card-title">h_t</div><div class="card-body">New hidden state, an interpolation between old and new candidate.</div></div>
<div class="calc-card"><div class="card-title">No cell state</div><div class="card-body">Simpler than LSTM. Single channel of memory.</div></div>
<div class="calc-card"><div class="card-title">Speed</div><div class="card-body">~25% faster than LSTM at the same hidden size; nearly identical accuracy in many tasks.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

gru = nn.<span class="fn">GRU</span>(input_size=<span class="num">64</span>, hidden_size=<span class="num">128</span>, num_layers=<span class="num">2</span>,
             batch_first=<span class="kw">True</span>, bidirectional=<span class="kw">True</span>, dropout=<span class="num">0.3</span>)
x = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">50</span>, <span class="num">64</span>)              <span class="cm"># (B, T, E)</span>
out, h_n = <span class="fn">gru</span>(x)
<span class="fn">print</span>(out.shape)                        <span class="cm"># (8, 50, 256)  -- 2 directions, hidden=128</span>
<span class="fn">print</span>(h_n.shape)                        <span class="cm"># (4, 8, 128)   -- 2 layers * 2 directions</span>

<span class="cm"># Choose the last position (or mean-pool, depending on task)</span>
last = out[:, -<span class="num">1</span>, :]                    <span class="cm"># (8, 256)</span>
mean = out.<span class="fn">mean</span>(dim=<span class="num">1</span>)                  <span class="cm"># (8, 256)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">GRU has 3 gates (reset, update, candidate) -- simpler than LSTM and often comparable. Hand-coded in NumPy below.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def sigmoid(x): return 1 / (1 + np.exp(-x))

rng = np.random.default_rng(0)
in_dim, hid_dim = 4, 8
W_r = rng.standard_normal((in_dim+hid_dim, hid_dim))*0.1
W_z = rng.standard_normal((in_dim+hid_dim, hid_dim))*0.1
W_h = rng.standard_normal((in_dim+hid_dim, hid_dim))*0.1

x_seq = rng.standard_normal((5, in_dim))
h = np.zeros(hid_dim)

for t in range(5):
    z_in = np.concatenate([x_seq[t], h])
    r = sigmoid(z_in @ W_r)         # reset gate
    z = sigmoid(z_in @ W_z)         # update gate
    z_in_r = np.concatenate([x_seq[t], r * h])
    h_tilde = np.tanh(z_in_r @ W_h)
    h = (1 - z) * h + z * h_tilde
    print(f't={t}: ||h||={np.linalg.norm(h):.3f}, gate_z mean={z.mean():.3f}')

print('GRU has only 3 gates vs LSTM 4 -> ~25% fewer params.')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a 2-layer bidirectional GRU with hidden size 128 and dropout 0.3 between layers. 2) Forwards a batch of 8 sequences of length 50, embedding dimension 64. 3) The output shape <code>(8, 50, 256)</code> shows that the bidirectional concatenation doubles hidden size, and the layered hidden states are <code>(4, 8, 128)</code> = 2 layers * 2 directions, batch, hidden. 4) For sentence-level features you can take the last timestep (good for unidirectional left-to-right) or mean-pool over time (works for bidirectional and avoids padding sensitivity).</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Variable-Length Sequences with pack_padded_sequence</h2>

<p class="l-text">When sequences in a batch have different lengths, naive use of nn.LSTM/GRU wastes compute on padded positions and can corrupt the final hidden state with garbage. PyTorch's <code>pack_padded_sequence</code> tells the cuDNN backend to skip padding properly.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.nn.utils.rnn <span class="kw">import</span> pack_padded_sequence, pad_packed_sequence

<span class="cm"># Pretend batch with three sequences, lengths 5, 3, 4</span>
ids = torch.<span class="fn">tensor</span>([
    [<span class="num">11</span>, <span class="num">22</span>, <span class="num">33</span>, <span class="num">44</span>, <span class="num">55</span>],
    [<span class="num">88</span>, <span class="num">99</span>, <span class="num">11</span>, <span class="num">0</span>, <span class="num">0</span>],
    [<span class="num">22</span>, <span class="num">44</span>, <span class="num">66</span>, <span class="num">88</span>, <span class="num">0</span>],
])
lengths = torch.<span class="fn">tensor</span>([<span class="num">5</span>, <span class="num">3</span>, <span class="num">4</span>])
emb = nn.<span class="fn">Embedding</span>(<span class="num">100</span>, <span class="num">16</span>, padding_idx=<span class="num">0</span>)(ids)    <span class="cm"># (3, 5, 16)</span>

<span class="cm"># Pack: tells the LSTM to stop computing past length_i for each sample</span>
<span class="cm"># IMPORTANT: must be sorted by length descending, OR use enforce_sorted=False</span>
packed = <span class="fn">pack_padded_sequence</span>(emb, lengths, batch_first=<span class="kw">True</span>, enforce_sorted=<span class="kw">False</span>)

lstm = nn.<span class="fn">LSTM</span>(input_size=<span class="num">16</span>, hidden_size=<span class="num">32</span>, batch_first=<span class="kw">True</span>)
packed_out, (h_n, c_n) = <span class="fn">lstm</span>(packed)
<span class="cm"># h_n[-1] is the TRUE last hidden state per sample, ignoring padding</span>

<span class="cm"># Unpack to get a regular padded tensor back</span>
out, out_lens = <span class="fn">pad_packed_sequence</span>(packed_out, batch_first=<span class="kw">True</span>)
<span class="fn">print</span>(out.shape, out_lens)
<span class="cm"># torch.Size([3, 5, 32]) tensor([5, 3, 4])</span>

<span class="cm"># h_n[-1] is the correct sentence representation</span>
sent = h_n[-<span class="num">1</span>]                              <span class="cm"># (3, 32)</span>
<span class="fn">print</span>(sent.shape)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Variable-length sequences need padding + masking. We mimic pack_padded_sequence by computing per-row lengths and using a mask in reductions.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Three sequences of different lengths, pre-padded to length 6
seqs = np.array([
    [1, 2, 3, 4, 5, 6],
    [7, 8, 9, 0, 0, 0],
    [10, 11, 12, 13, 0, 0],
])
lengths = np.array([6, 3, 4])
max_len = seqs.shape[1]

# Build mask
mask = (np.arange(max_len)[None, :] < lengths[:, None]).astype(float)
print('mask:\n', mask.astype(int))

# Use mask to compute per-sequence "mean over valid positions"
masked_sum = (seqs * mask).sum(axis=1)
masked_avg = masked_sum / lengths
print('masked sum :', masked_sum)
print('masked mean:', masked_avg.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds three padded sequences with true lengths 5, 3, 4 -- the trailing 0s are padding tokens. 2) Embeds them; this gives a uniform tensor of shape <code>(3, 5, 16)</code>. 3) <code>pack_padded_sequence</code> turns the padded tensor into a <code>PackedSequence</code> object that the cuDNN LSTM kernel can consume efficiently, computing only the real timesteps for each sample. <code>enforce_sorted=False</code> handles unsorted batches at a small cost. 4) Runs the LSTM on the packed sequence; <code>h_n</code> contains the true final hidden state per sample (the timestep just before padding starts). 5) <code>pad_packed_sequence</code> converts back to a padded tensor if you need the full sequence of outputs (e.g. for token-level tagging). 6) For sentence-level classification, <code>h_n[-1]</code> is exactly the sentence representation, with no padding contamination.</p>

<div class="l-warn"><strong>Pitfall:</strong> If you skip packing and just feed a padded batch to nn.LSTM, the cell will keep computing through all padding positions, and h_n will reflect "the LSTM after seeing padding tokens" -- typically wrong. Always pack for variable-length data, or mean-pool with a mask afterward.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Bidirectional Sentiment Classifier</h2>

<p class="l-text">Putting it all together: a BiLSTM sentiment classifier with packed sequences and proper masking.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.nn.utils.rnn <span class="kw">import</span> pack_padded_sequence, pad_packed_sequence

<span class="kw">class</span> <span class="fn">BiLSTMClassifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, embed_dim=<span class="num">128</span>, hidden=<span class="num">64</span>,
                 num_layers=<span class="num">1</span>, num_classes=<span class="num">2</span>, dropout=<span class="num">0.3</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(vocab_size, embed_dim, padding_idx=<span class="num">0</span>)
        self.lstm = nn.<span class="fn">LSTM</span>(embed_dim, hidden, num_layers=num_layers,
                            batch_first=<span class="kw">True</span>, bidirectional=<span class="kw">True</span>,
                            dropout=dropout <span class="kw">if</span> num_layers&gt;<span class="num">1</span> <span class="kw">else</span> <span class="num">0</span>)
        self.drop = nn.<span class="fn">Dropout</span>(dropout)
        self.fc = nn.<span class="fn">Linear</span>(hidden * <span class="num">2</span>, num_classes)

    <span class="kw">def</span> <span class="fn">forward</span>(self, ids, lengths):
        x = self.<span class="fn">embed</span>(ids)                                 <span class="cm"># (B, T, E)</span>
        packed = <span class="fn">pack_padded_sequence</span>(x, lengths.<span class="fn">cpu</span>(),
                                      batch_first=<span class="kw">True</span>,
                                      enforce_sorted=<span class="kw">False</span>)
        packed_out, (h_n, c_n) = self.<span class="fn">lstm</span>(packed)
        out, _ = <span class="fn">pad_packed_sequence</span>(packed_out, batch_first=<span class="kw">True</span>)
        <span class="cm"># Mean pool with mask</span>
        mask = (ids != <span class="num">0</span>).<span class="fn">unsqueeze</span>(-<span class="num">1</span>).<span class="fn">float</span>()             <span class="cm"># (B, T, 1)</span>
        pooled = (out * mask).<span class="fn">sum</span>(dim=<span class="num">1</span>) / mask.<span class="fn">sum</span>(dim=<span class="num">1</span>).<span class="fn">clamp</span>(<span class="ty">min</span>=<span class="num">1</span>)
        <span class="kw">return</span> self.<span class="fn">fc</span>(self.<span class="fn">drop</span>(pooled))                   <span class="cm"># (B, C)</span>

<span class="cm"># quick test</span>
m = <span class="fn">BiLSTMClassifier</span>(vocab_size=<span class="num">10000</span>)
ids = torch.<span class="fn">tensor</span>([[<span class="num">3</span>,<span class="num">4</span>,<span class="num">5</span>,<span class="num">6</span>,<span class="num">7</span>,<span class="num">0</span>,<span class="num">0</span>],[<span class="num">8</span>,<span class="num">9</span>,<span class="num">10</span>,<span class="num">11</span>,<span class="num">12</span>,<span class="num">13</span>,<span class="num">14</span>]])
lengths = torch.<span class="fn">tensor</span>([<span class="num">5</span>, <span class="num">7</span>])
out = <span class="fn">m</span>(ids, lengths)
<span class="fn">print</span>(out.shape)                                            <span class="cm"># (2, 2)</span>
<span class="fn">print</span>(<span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> m.<span class="fn">parameters</span>()))</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bidirectional sentiment classifier -- with sklearn we get the equivalent expressive power via TF-IDF (which captures both directions naturally).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)
pipe_vec = TfidfVectorizer(ngram_range=(1, 2), max_features=2500)
Xt_tr = pipe_vec.fit_transform(X_tr)
Xt_te = pipe_vec.transform(X_te)
clf = LogisticRegression(max_iter=500, C=1.5).fit(Xt_tr, y_tr)
print(classification_report(y_te, clf.predict(Xt_te), digits=3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a single-layer BiLSTM classifier; output dimension is doubled because the LSTM is bidirectional. 2) The forward pass embeds, packs the sequences using actual lengths, runs the LSTM efficiently, and unpacks. 3) Mean-pools over the time dimension using the padding mask -- handles variable lengths cleanly without contamination from padding tokens. 4) A single Linear head projects to class logits. This architecture, with maybe 200k parameters and bidirectional context, often achieves 88-90% on IMDb sentiment, beating CNNs by a few points at 2-3x the compute.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: BiLSTM-CRF for NER</div><div class="example-body">Before BERT, the standard NER architecture was BiLSTM with a CRF head. The BiLSTM produces per-token features in both directions, the CRF layer enforces label transitions (e.g. "I-PER cannot follow B-LOC"). On CoNLL-2003 it got ~91 F1. BERT-base hits ~93 F1 but is 30x slower; in many production settings BiLSTM-CRF is still preferred for low-latency NER.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Visualizing Gate Activations</h2>

<p class="l-text">When a trained LSTM works, individual gate units learn semantically meaningful behavior. Karpathy's classic 2015 visualization shows units that activate inside parentheses, units that fire on commas, units that track quote nesting -- all without any explicit supervision for these patterns.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># After training, run the LSTM step by step and record cell-state values</span>
<span class="at">@torch.no_grad</span>()
<span class="kw">def</span> <span class="fn">trace_cell_state</span>(model, ids, unit_idx=<span class="num">42</span>):
    cell = nn.<span class="fn">LSTMCell</span>(model.embed.embedding_dim,
                       model.lstm.hidden_size).<span class="fn">to</span>(ids.device)
    <span class="cm"># Initialize cell from model's first layer (omitted for brevity)</span>
    <span class="cm"># In practice you'd extract weights from model.lstm and copy into the cell.</span>
    <span class="cm"># Then iterate:</span>
    h = torch.<span class="fn">zeros</span>(<span class="num">1</span>, model.lstm.hidden_size)
    c = torch.<span class="fn">zeros</span>(<span class="num">1</span>, model.lstm.hidden_size)
    trace = []
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(ids.<span class="fn">size</span>(<span class="num">1</span>)):
        x_t = model.<span class="fn">embed</span>(ids[:, t])           <span class="cm"># (1, E)</span>
        h, c = <span class="fn">cell</span>(x_t, (h, c))
        trace.<span class="fn">append</span>(c[<span class="num">0</span>, unit_idx].<span class="fn">item</span>())
    <span class="kw">return</span> trace

<span class="cm"># Real workflow:</span>
<span class="cm"># 1) Train BiLSTM on a corpus (e.g. Penn Treebank)</span>
<span class="cm"># 2) Pick a sentence and tokenize</span>
<span class="cm"># 3) For each hidden unit, plot c_t over time</span>
<span class="cm"># 4) Find units whose activation correlates with a meaningful feature</span>
<span class="cm">#    (parenthesis depth, sentence length, sentiment polarity, ...)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Visualize gate-like activation patterns: simulate what a forget gate would do over a sequence (mostly closed for noise, open for signal).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
seq_len = 12
signal = np.zeros(seq_len)
signal[3] = 1.0
signal[7] = 1.0
signal[10] = -1.0
noise  = rng.standard_normal(seq_len) * 0.2

# Forget gate is sigmoid of a learned function of input.
# If gate ~ 1 => keep, ~0 => forget. Pretend it tracks the absolute value.
gate = 1 / (1 + np.exp(-(np.abs(signal + noise) - 0.3) * 4))
print('step  signal+noise  gate (sigmoid)')
for t in range(seq_len):
    bar = '#' * int(gate[t] * 20)
    print(f'{t:3d}    {signal[t]+noise[t]:+.3f}      {gate[t]:.3f}  {bar}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a helper that runs an LSTM cell step-by-step on a sequence and records the value of one specific cell-state unit at each timestep. 2) The full workflow (commented) is to train a BiLSTM, pick interpretable units by plotting cell states over many sentences, and visualize them. 3) The famous result: in a character-level LSTM trained on Linux source code, one unit tracks indentation depth; another fires inside string literals; another counts open braces. This kind of self-organized structure is part of why LSTMs were considered "interpretable enough" for years before transformer attention arrived.</p>

<div id="plot-pl7-gates-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Three LSTM cell-state units traced over a 30-step sequence. Unit 12 (forget-gate-driven) decays exponentially when nothing interesting happens. Unit 27 (input-driven) spikes whenever a key word appears. Unit 41 (long-term memory) keeps a stable level encoding "polarity so far". This kind of self-organization is what made LSTMs feel "magical" before the transformer era.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. When to Choose RNN/LSTM/GRU</h2>

<p class="l-text">Knowing when each tool fits the problem is the practical deliverable of this lesson.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Use RNN/LSTM/GRU when</div><div class="compare-item">Streaming inference (one token at a time)</div><div class="compare-item">Very long sequences (transformers OOM)</div><div class="compare-item">Tiny memory budget (mobile, edge)</div><div class="compare-item">Language modeling for character-level small data</div><div class="compare-item">Sequence-to-sequence with limited compute</div></div>
<div class="compare-col"><div class="compare-title">Use transformer when</div><div class="compare-item">Fine-tuning a pretrained model (BERT, GPT)</div><div class="compare-item">Short to medium sequences (≤ 512 tokens)</div><div class="compare-item">Accuracy is the top priority</div><div class="compare-item">You have GPU compute available</div><div class="compare-item">Long-range dependencies matter</div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Plain RNN</div><div class="card-body">Almost never; replaced by LSTM/GRU. Useful only as teaching example.</div></div>
<div class="calc-card"><div class="card-title">LSTM</div><div class="card-body">The classic for long dependencies. Higher capacity than GRU.</div></div>
<div class="calc-card"><div class="card-title">GRU</div><div class="card-body">Often as good as LSTM, ~25% faster. Good default for variable-length text.</div></div>
<div class="calc-card"><div class="card-title">BiLSTM/BiGRU</div><div class="card-body">Whenever you can afford full sequence access. Standard for tagging/classification.</div></div>
<div class="calc-card"><div class="card-title">Stacked (2-3 layers)</div><div class="card-body">More capacity per token, slower. Add only if shallow underfits.</div></div>
<div class="calc-card"><div class="card-title">Hybrid CNN-LSTM</div><div class="card-body">CNN for local features + LSTM for sequence dynamics. Common in speech.</div></div>
</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> An RNN is the same function applied at every timestep, with parameters shared across time.<br><strong>2.</strong> Plain RNN suffers from vanishing/exploding gradients on sequences longer than ~20 steps.<br><strong>3.</strong> LSTM solves this with a separate cell state and three gates (forget, input, output) -- gradient flows almost unmodified through the cell channel.<br><strong>4.</strong> GRU is a simpler 2-gate alternative; ~25% faster than LSTM with similar accuracy.<br><strong>5.</strong> <code>nn.LSTM</code> / <code>nn.GRU</code> handle the whole sequence in one call; <code>nn.LSTMCell</code> is per-step for unusual control flow.<br><strong>6.</strong> For variable-length batches use <code>pack_padded_sequence</code> -- otherwise the final hidden state is corrupted by padding.<br><strong>7.</strong> Bidirectional gives you context from both sides; standard for tagging and classification.<br><strong>8.</strong> Next lesson: embeddings -- how raw token IDs become the dense vectors that all of these models actually consume.</div></div>
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

  function vanishPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var steps = []; for (var i=0;i<=100;i++) steps.push(i);
    var rnn = steps.map(function(s){return Math.pow(0.95, 100-s);});
    var lstm = steps.map(function(s){return Math.exp(-(100-s)/200);});
    var t1 = {x:steps, y:rnn, mode:'lines', type:'scatter', name:'Plain RNN', line:{color:'#f87171', width:2.5}};
    var t2 = {x:steps, y:lstm, mode:'lines', type:'scatter', name:'LSTM (cell path)', line:{color:T.accent, width:2.5}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Zaman İçinde Gradyan Akışı (log ölçek)':'Gradient Flow Backwards Through Time (log)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman adımı (sondan geri)':'timestep (from end)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'gradyan büyüklüğü':'gradient magnitude', gridcolor:T.grid, zerolinecolor:T.zero, type:'log'},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2], layout, {responsive:true, displayModeBar:false});
  }

  function gatesPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var t = []; for (var i=0;i<30;i++) t.push(i);
    var u12 = t.map(function(i){return Math.exp(-i/8) + (Math.random()-0.5)*0.05;});
    var u27 = t.map(function(i){var spikes=[5,12,18,25];var v=0.1;spikes.forEach(function(s){v+=Math.exp(-(i-s)*(i-s)/2);});return v;});
    var u41 = t.map(function(i){return 0.6 + 0.3*Math.sin(i/8) + (Math.random()-0.5)*0.05;});
    var t1 = {x:t, y:u12, mode:'lines+markers', type:'scatter', name:lang==='tr'?'Birim 12 (forget)':'Unit 12 (forget)', line:{color:'#f87171', width:2}, marker:{size:5}};
    var t2 = {x:t, y:u27, mode:'lines+markers', type:'scatter', name:lang==='tr'?'Birim 27 (girdi)':'Unit 27 (input)', line:{color:'#4ecdc4', width:2}, marker:{size:5}};
    var t3 = {x:t, y:u41, mode:'lines+markers', type:'scatter', name:lang==='tr'?'Birim 41 (uzun süreli)':'Unit 41 (long-term)', line:{color:T.accent, width:2}, marker:{size:5}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Zaman İçinde LSTM Hücre Durumu Birimleri':'LSTM Cell-State Units Over Time', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman adımı':'timestep', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'aktivasyon':'activation', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2,t3], layout, {responsive:true, displayModeBar:false});
  }

  vanishPlot('plot-pl7-vanish-en','en');
  gatesPlot('plot-pl7-gates-en','en');
  vanishPlot('plot-pl7-vanish-tr','tr');
  gatesPlot('plot-pl7-gates-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>RNN'ler diziler için orijinal sinir ağı mimarisidir.</strong> Transformer'lar dünyayı yutmadan önce, her konuşma tanıyıcı, makine çevirmen, dil modeli ve duygu sınıflandırıcı bir tekrarlayan ağda çalışıyordu. Bugün bile RNN'ler ve LSTM/GRU varyantları, transformer attention'ın çok pahalı olduğu akış verisi, çok küçük modeller ve gerçek zamanlı çıkarım için doğru seçimdir.</p>

<p class="l-text">Bu ders tekrarlayan denklemi, yokolma-gradyan problemini, onu çözen LSTM kapı mekanizmasını, GRU'nun daha basit alternatifini ve PyTorch'un <code>nn.RNN</code>, <code>nn.LSTM</code>, <code>nn.GRU</code>'sunu tüm bayraklarıyla (batch_first, bidirectional, num_layers) açıklar. Bir BiLSTM üzerine kurulu duygu sınıflandırıcısıyla bitiriyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Vanilla RNN denklemini türetmeyi ve oyuncak bir dizi üzerinde zamanda açmayı</li>
<li>Yokolma-gradyan problemini açıklamayı ve LSTM kapılarının onu nasıl çözdüğünü</li>
<li>LSTM forget/input/output kapıları ile GRU update/reset kapılarını ayırt etmeyi</li>
<li><code>nn.RNN</code>, <code>nn.LSTM</code>, <code>nn.GRU</code>'yu <code>batch_first</code>, <code>bidirectional</code>, <code>num_layers</code> ile kullanmayı</li>
<li>Bir BiLSTM duygu sınıflandırıcısı kurmayı ve gizli durumları tahmin için pool'lamayı</li>
<li>Gradient clipping uygulamayı ve RNN'nin ne zaman transformer'ı yendiğini (akış, düşük gecikme) seçmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Tekrarlayan Denklem</h2>

<p class="l-text">Bir tekrarlayan sinir ağı, gizli bir duruma defalarca uygulanan ve bir zaman adımı ilerleyen bir fonksiyondur. Her adımda mevcut girdiyi ve önceki gizli durumu görür ve yeni bir gizli durum üretir.</p>

<div class="katex-block">$$h_t = \\tanh(W_h h_{t-1} + W_x x_t + b)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x_t</div><div class="card-body">t zaman adımındaki girdi. Metin için: <code>(E,)</code> şekilli bir token embedding'i.</div></div>
<div class="calc-card"><div class="card-title">h_{t-1}</div><div class="card-body">Önceki adımdan gizli durum. Şimdiye kadar görülen her şeyin hafızasını taşır.</div></div>
<div class="calc-card"><div class="card-title">h_t</div><div class="card-body">Yeni gizli durum. h_{t-1} ile aynı şekilde; t adımının çıktısı.</div></div>
<div class="calc-card"><div class="card-title">W_x</div><div class="card-body">Girdiden gizliye ağırlık matrisi. Gizli boyutu H için <code>(H, E)</code> şekli.</div></div>
<div class="calc-card"><div class="card-title">W_h</div><div class="card-body">Gizliden gizliye ağırlık matrisi. Şekil <code>(H, H)</code>. Her adımda aynı matris.</div></div>
<div class="calc-card"><div class="card-title">tanh</div><div class="card-body">Aktivasyon. Patlamasın diye gizli durumu (-1, 1)'e sıkıştırır.</div></div>
</div>

<div class="calc-highlight"><strong>Bir RNN'in tanımlayıcı özelliği:</strong> aynı W_x, W_h, b parametreleri her zaman adımında kullanılır. Ağ dizi uzunluğuyla büyümez -- sadece zamanda açılır. Bu zaman boyunca parametre paylaşımıdır.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Denklemi somutlaştırmak için elle bir RNN hücresi inşa et</span>
<span class="kw">class</span> <span class="fn">HandRNNCell</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, input_size, hidden_size):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.W_x = nn.<span class="fn">Linear</span>(input_size, hidden_size, bias=<span class="kw">False</span>)
        self.W_h = nn.<span class="fn">Linear</span>(hidden_size, hidden_size, bias=<span class="kw">True</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x_t, h_prev):
        <span class="kw">return</span> torch.<span class="fn">tanh</span>(self.<span class="fn">W_x</span>(x_t) + self.<span class="fn">W_h</span>(h_prev))

<span class="cm"># Bir dizi boyunca kullan</span>
B, T, E, H = <span class="num">2</span>, <span class="num">5</span>, <span class="num">4</span>, <span class="num">8</span>
cell = <span class="fn">HandRNNCell</span>(E, H)
x = torch.<span class="fn">randn</span>(B, T, E)
h = torch.<span class="fn">zeros</span>(B, H)
outputs = []
<span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
    h = <span class="fn">cell</span>(x[:, t, :], h)
    outputs.<span class="fn">append</span>(h)
out_seq = torch.<span class="fn">stack</span>(outputs, dim=<span class="num">1</span>)         <span class="cm"># (B, T, H)</span>
<span class="fn">print</span>(out_seq.shape)                           <span class="cm"># torch.Size([2, 5, 8])</span>

<span class="cm"># Aynı şey PyTorch'un nn.RNN'iyle tek satırda</span>
rnn = nn.<span class="fn">RNN</span>(input_size=E, hidden_size=H, batch_first=<span class="kw">True</span>)
out, h_n = <span class="fn">rnn</span>(x)
<span class="fn">print</span>(out.shape, h_n.shape)                    <span class="cm"># (2, 5, 8) ve (1, 2, 8)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">RNN zaman adımları üzerinde bir for döngüsüdür. Tekrarlayan denklem h_t = tanh(W_xh @ x_t + W_hh @ h_{t-1})'i NumPy ile elle yazıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
seq_len, in_dim, hid_dim = 8, 4, 16
x_seq = rng.standard_normal((seq_len, in_dim))

W_xh = rng.standard_normal((in_dim, hid_dim)) * 0.1
W_hh = rng.standard_normal((hid_dim, hid_dim)) * 0.1
b_h  = np.zeros(hid_dim)

h = np.zeros(hid_dim)
hidden_history = []
for t in range(seq_len):
    h = np.tanh(x_seq[t] @ W_xh + h @ W_hh + b_h)
    hidden_history.append(h)

H = np.array(hidden_history)
print('input shape :', x_seq.shape)
print('hidden shape:', H.shape, '(seq, hidden)')
print('final h norm:', round(float(np.linalg.norm(h)), 3))
print('hidden norm trajectory:', np.linalg.norm(H, axis=1).round(3))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Denklemi temellendirmek için elle yapılmış bir RNN hücresi inşa eder -- formül gibi tam olarak iki lineer projeksiyon ve bir tanh. 2) Hücreyi batch boyutu 2 ve embedding boyutu 4 olan 5 adımlı bir dizi boyunca çalıştırır. Gizli durum sıfırlardan başlar ve adım adım güncellenir. 3) Tüm gizli durumları <code>(B, T, H)</code> şekilli bir dizi çıkışına yığar. 4) <code>nn.RNN</code>'in aynı şeyi tek satırda yaptığını gösterir, hem tüm gizli durum dizisini (token seviyesi çıktılar için) hem de son gizli durumu (cümle seviyesi özetler için) döndürür.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: dil modelleme ritmi</div><div class="example-body">Karakter seviyesinde bir dil modelinde x_t mevcut karakter embedding'idir ve h_t "şimdiye kadar okuduğum her şeyi" özetlemesi gerekir. Model h_t'den x_{t+1}'i tahmin etmek için eğitilir -- ve h aracılığıyla geri akan gradyan ağa kullanışlı geçmişi daha iyi kodlamak için W_h, W_x'i nasıl güncelleyeceğini söyler. Karpathy'nin char-RNN'i ham baytlardan Shakespeare üretmeyi böyle öğrendi.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Yokolma Gradyan Problemi</h2>

<p class="l-text">Düz RNN'ler şık görünür, ama ölümcül bir kusurları vardır: birçok zaman adımı boyunca geri akan gradyanlar ya sıfıra yokolur ya da sonsuza patlar. Backprop adım 100'den adım 1'e ulaşana kadar gradyan aynı W_h matrisiyle 99 kez çarpılmıştır.</p>

<div class="katex-block">$$\\frac{\\partial L}{\\partial h_0} = \\frac{\\partial L}{\\partial h_T}\\prod_{t=1}^{T} \\frac{\\partial h_t}{\\partial h_{t-1}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">T Jacobian'ın çarpımı</div><div class="card-body">Her adımın yerel türevi çarpılır. T=100 için 100 matrisin çarpımına sahipsiniz.</div></div>
<div class="calc-card"><div class="card-title">Norm &lt; 1 ise</div><div class="card-body">Çarpım üstel olarak küçülür. 1. adımdaki gradyan ~0 olur. Ağ uzun mesafe örüntüleri öğrenemez.</div></div>
<div class="calc-card"><div class="card-title">Norm &gt; 1 ise</div><div class="card-body">Çarpım üstel olarak büyür. Gradyanlar patlar. Kayıp NaN olur.</div></div>
<div class="calc-card"><div class="card-title">tanh türevi</div><div class="card-body">≤ 1, doğal olarak yokolmaya iter. Sigmoid ile daha kötü (≤ 0.25).</div></div>
<div class="calc-card"><div class="card-title">Pratik sınır</div><div class="card-body">Düz RNN ~10-20 adım bağımlılıkları güvenilir öğrenebilir; ötesinde zorlanır.</div></div>
<div class="calc-card"><div class="card-title">Çözümler</div><div class="card-body">LSTM/GRU (kapılı yollar), residual bağlantılar, gradyan kırpma, dikkatli başlatma.</div></div>
</div>

<div id="plot-pl7-vanish-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Düz RNN için 100 adımda zamanda geri akan gradyan büyüklüğü, log ölçekte çizilmiş. Tipik W_h spektral yarıçapı 0.95 ile, adım 1'deki gradyan adım 100'deki değerinin yaklaşık 0.005'idir -- esasen yok oldu, ağ o zaman adımının katkısını öğrenemez. LSTM ile kapı mekanizması (sonraki bölüm) gradyanın hücre durumunda neredeyse değişmeden aktığı bir yol tutar, uzun mesafe öğrenmesini kurtarır.</div>

<div class="think-box"><div class="think-label">KAPILAR NEDEN ÇÖZÜMDÜR</div><div class="think-body">RNN'inize paralel uzanan, bilginin büyük ölçüde değiştirilmemiş aktığı bir otobanı, ondan seçici olarak okuyup ona yazan kapılarla hayal edin. İşte LSTM. "Hücre durumu" 1'e yakın kapı değerleriyle yalnızca çarpmalarla ağ boyunca gider, düz RNN'lerin felaket gradyan sönümünden kaçınır. Bu, 1997'den (LSTM makalesi) 2017'ye (transformer'lar) kadar uzun dizilerde derin öğrenmeyi mümkün kılan tek anlayıştır.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. LSTM: Kapılar ve Hücre Durumu</h2>

<p class="l-text">LSTM hücresi, zamanda yalnızca hafif değişikliklerle akan ayrı bir "hücre durumu" c_t ekler. Üç kapı neyin girdiğini, neyin çıktığını ve ağın geri kalanına neyin maruz kaldığını kontrol eder.</p>

<div class="katex-block">$$f_t = \\sigma(W_f[h_{t-1}, x_t] + b_f), \\quad i_t = \\sigma(W_i[h_{t-1}, x_t] + b_i), \\quad o_t = \\sigma(W_o[h_{t-1}, x_t] + b_o)$$</div>

<div class="katex-block">$$\\tilde{c}_t = \\tanh(W_c[h_{t-1}, x_t] + b_c), \\quad c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t, \\quad h_t = o_t \\odot \\tanh(c_t)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">f_t (forget kapısı)</div><div class="card-body">[0, 1]'de sigmoid; eski hücre durumunun ne kadarının tutulacağını seçer. 0 = unut, 1 = tut.</div></div>
<div class="calc-card"><div class="card-title">i_t (input kapısı)</div><div class="card-body">Sigmoid; hücre durumuna ne kadar yeni aday yazılacağını seçer.</div></div>
<div class="calc-card"><div class="card-title">o_t (output kapısı)</div><div class="card-body">Sigmoid; hücre durumunun ne kadarının gizli durum h_t olarak maruz kalacağını seçer.</div></div>
<div class="calc-card"><div class="card-title">tilde c_t</div><div class="card-body">Aday hücre güncellemesi; tanh sınırlı.</div></div>
<div class="calc-card"><div class="card-title">c_t</div><div class="card-body">Hücre durumu; "uzun süreli hafıza" kanalı.</div></div>
<div class="calc-card"><div class="card-title">h_t</div><div class="card-body">Gizli durum; sonraki katmana maruz kalan "kısa süreli" çıktı.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

B, T, E, H = <span class="num">2</span>, <span class="num">6</span>, <span class="num">4</span>, <span class="num">8</span>

<span class="cm"># nn.LSTM tüm kapı hesaplamasını verimli paketler</span>
lstm = nn.<span class="fn">LSTM</span>(input_size=E, hidden_size=H, batch_first=<span class="kw">True</span>)

x = torch.<span class="fn">randn</span>(B, T, E)
out, (h_n, c_n) = <span class="fn">lstm</span>(x)
<span class="cm"># out: tüm gizli durumlar dizisi, şekil (B, T, H)</span>
<span class="cm"># h_n: son gizli durum, şekil (num_layers * num_directions, B, H)</span>
<span class="cm"># c_n: son hücre durumu, h_n ile aynı şekil</span>
<span class="fn">print</span>(out.shape, h_n.shape, c_n.shape)
<span class="cm"># torch.Size([2, 6, 8]) torch.Size([1, 2, 8]) torch.Size([1, 2, 8])</span>

<span class="cm"># Çok katmanlı LSTM (num_layers LSTM'i dikey yığar)</span>
lstm2 = nn.<span class="fn">LSTM</span>(input_size=E, hidden_size=H, num_layers=<span class="num">3</span>,
                batch_first=<span class="kw">True</span>, dropout=<span class="num">0.2</span>)
out, (h_n, c_n) = <span class="fn">lstm2</span>(x)
<span class="fn">print</span>(out.shape, h_n.shape)              <span class="cm"># (2, 6, 8) ve (3, 2, 8)</span>

<span class="cm"># Çift yönlü LSTM (bir ileri + bir geri)</span>
bilstm = nn.<span class="fn">LSTM</span>(input_size=E, hidden_size=H, batch_first=<span class="kw">True</span>, bidirectional=<span class="kw">True</span>)
out, (h_n, c_n) = <span class="fn">bilstm</span>(x)
<span class="fn">print</span>(out.shape, h_n.shape)              <span class="cm"># (2, 6, 16) -- H ikiye katlandı  ve (2, 2, 8)</span>

<span class="cm"># Manuel LSTMCell (alışılmadık kontrol akışı için)</span>
cell = nn.<span class="fn">LSTMCell</span>(input_size=E, hidden_size=H)
h_t = torch.<span class="fn">zeros</span>(B, H); c_t = torch.<span class="fn">zeros</span>(B, H)
<span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
    h_t, c_t = <span class="fn">cell</span>(x[:, t, :], (h_t, c_t))
<span class="fn">print</span>(h_t.shape)                         <span class="cm"># (B, H)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">LSTM hücresinin 3 kapısı vardır (forget/input/output) + 1 candidate vektör. Kapı denklemlerini açıkça kodluyoruz -- hücre durumu c_t ve gizli h_t elle hesaplanıyor.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def sigmoid(x): return 1 / (1 + np.exp(-x))

rng = np.random.default_rng(0)
in_dim, hid_dim = 4, 8
seq_len = 5

# 4 gates: input (i), forget (f), cell candidate (g), output (o)
W = {g: rng.standard_normal((in_dim + hid_dim, hid_dim)) * 0.1 for g in 'ifgo'}
b = {g: np.zeros(hid_dim) for g in 'ifgo'}

x_seq = rng.standard_normal((seq_len, in_dim))
h = np.zeros(hid_dim); c = np.zeros(hid_dim)

for t in range(seq_len):
    z = np.concatenate([x_seq[t], h])
    i_t = sigmoid(z @ W['i'] + b['i'])
    f_t = sigmoid(z @ W['f'] + b['f'])
    g_t = np.tanh(  z @ W['g'] + b['g'])
    o_t = sigmoid(z @ W['o'] + b['o'])
    c   = f_t * c + i_t * g_t
    h   = o_t * np.tanh(c)
    print(f't={t}: ||c||={np.linalg.norm(c):.3f}, ||h||={np.linalg.norm(h):.3f}')

print('final cell state norm:', round(float(np.linalg.norm(c)), 3))</code></pre></div>
</div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Tek katmanlı bir LSTM oluşturur ve onu bir dizide çalıştırır; çıktı bir tuple <code>(out, (h_n, c_n))</code>'tür. <code>out</code> tüm gizli durumlar dizisidir (zaman adımı başına bir); <code>h_n</code> ve <code>c_n</code> son gizli ve hücre durumlarıdır (cümle seviyesi öznitelikler için bunları kullanın). 2) 3 LSTM'i dikey yığar, katmanlar arası dropout ile. İlk katman embedding'leri görür; daha derin katmanlar her zaman adımında önceki katmanın çıktılarını görür. 3) Çift yönlü LSTM bir LSTM'i zamanda ileri, diğerini geri çalıştırır, sonra gizli durumları birleştirir -- böylece her çıktı pozisyonu tüm diziyi görmüştür. Çıktı boyutu <code>2*H</code>'ye iki katlanır. 4) <code>nn.LSTMCell</code> adım başına versiyondur; kendi döngünüzü yazarsınız. Döngünün alışılmadık mantığı olduğunda kullanışlı (öğretmen zorlaması varyantları, özel skip bağlantılar).</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">nn.LSTM (tam)</div><div class="compare-item">Tüm diziyi tek çağrıda işler</div><div class="compare-item">GPU için içsel olarak optimize</div><div class="compare-item">(out, (h_n, c_n)) döner</div><div class="compare-item">Zamanın %95'inde kullanın</div></div>
<div class="compare-col"><div class="compare-title">nn.LSTMCell (adım başına)</div><div class="compare-item">Çağrı başına bir zaman adımı işler</div><div class="compare-item">Döngüyü siz yazarsınız</div><div class="compare-item">Daha yavaş ama esnek</div><div class="compare-item">Özel decoder, öğretmen zorlama ayarları için kullan</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. GRU: Kapılı ve Daha Basit</h2>

<p class="l-text">GRU (Cho ve diğ. 2014) daha basit kapılı bir alternatiftir: üç yerine iki kapı, ayrı hücre durumu yok. Daha hızlı çalışır ve daha az bellek kullanır, sıklıkla pratik NLP görevlerinde LSTM doğruluğuna eşleşir.</p>

<div class="katex-block">$$z_t = \\sigma(W_z[h_{t-1}, x_t]), \\quad r_t = \\sigma(W_r[h_{t-1}, x_t])$$</div>

<div class="katex-block">$$\\tilde{h}_t = \\tanh(W[r_t \\odot h_{t-1}, x_t]), \\quad h_t = (1-z_t)\\odot h_{t-1} + z_t\\odot \\tilde{h}_t$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">z_t (update kapısı)</div><div class="card-body">Birleştirilmiş forget+input kapısı gibi. 0 = eski gizliyi tut, 1 = yeni adayı kullan.</div></div>
<div class="calc-card"><div class="card-title">r_t (reset kapısı)</div><div class="card-body">Adaya eski gizlinin ne kadar katkıda bulunduğunu kontrol eder.</div></div>
<div class="calc-card"><div class="card-title">tilde h_t</div><div class="card-body">Aday gizli güncelleme.</div></div>
<div class="calc-card"><div class="card-title">h_t</div><div class="card-body">Yeni gizli durum, eski ile yeni aday arası interpolasyon.</div></div>
<div class="calc-card"><div class="card-title">Hücre durumu yok</div><div class="card-body">LSTM'den daha basit. Tek hafıza kanalı.</div></div>
<div class="calc-card"><div class="card-title">Hız</div><div class="card-body">Aynı gizli boyutta LSTM'den ~%25 daha hızlı; birçok görevde neredeyse aynı doğruluk.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

gru = nn.<span class="fn">GRU</span>(input_size=<span class="num">64</span>, hidden_size=<span class="num">128</span>, num_layers=<span class="num">2</span>,
             batch_first=<span class="kw">True</span>, bidirectional=<span class="kw">True</span>, dropout=<span class="num">0.3</span>)
x = torch.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">50</span>, <span class="num">64</span>)              <span class="cm"># (B, T, E)</span>
out, h_n = <span class="fn">gru</span>(x)
<span class="fn">print</span>(out.shape)                        <span class="cm"># (8, 50, 256)  -- 2 yön, hidden=128</span>
<span class="fn">print</span>(h_n.shape)                        <span class="cm"># (4, 8, 128)   -- 2 katman * 2 yön</span>

<span class="cm"># Son pozisyonu seç (veya görev'e göre mean-pool)</span>
last = out[:, -<span class="num">1</span>, :]                    <span class="cm"># (8, 256)</span>
mean = out.<span class="fn">mean</span>(dim=<span class="num">1</span>)                  <span class="cm"># (8, 256)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">GRU'nun 3 kapısı vardır (reset, update, aday) -- LSTM'den daha basit, çoğu zaman karşılaştırılabilir performans verir. Aşağıda NumPy ile elle kodlandı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def sigmoid(x): return 1 / (1 + np.exp(-x))

rng = np.random.default_rng(0)
in_dim, hid_dim = 4, 8
W_r = rng.standard_normal((in_dim+hid_dim, hid_dim))*0.1
W_z = rng.standard_normal((in_dim+hid_dim, hid_dim))*0.1
W_h = rng.standard_normal((in_dim+hid_dim, hid_dim))*0.1

x_seq = rng.standard_normal((5, in_dim))
h = np.zeros(hid_dim)

for t in range(5):
    z_in = np.concatenate([x_seq[t], h])
    r = sigmoid(z_in @ W_r)         # reset gate
    z = sigmoid(z_in @ W_z)         # update gate
    z_in_r = np.concatenate([x_seq[t], r * h])
    h_tilde = np.tanh(z_in_r @ W_h)
    h = (1 - z) * h + z * h_tilde
    print(f't={t}: ||h||={np.linalg.norm(h):.3f}, gate_z mean={z.mean():.3f}')

print('GRU has only 3 gates vs LSTM 4 -> ~25% fewer params.')</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Gizli boyutu 128 ve katmanlar arası dropout 0.3 olan 2 katmanlı çift yönlü bir GRU oluşturur. 2) Embedding boyutu 64 ile uzunluk 50 olan 8 dizilik bir batch'i ileri besler. 3) <code>(8, 50, 256)</code> çıkış şekli, çift yönlü birleştirmenin gizli boyutu iki katladığını gösterir ve katmanlı gizli durumlar <code>(4, 8, 128)</code> = 2 katman * 2 yön, batch, gizlidir. 4) Cümle seviyesi öznitelikler için son zaman adımını alabilir (tek yönlü soldan sağa için iyi) veya zaman üzerinde mean-pool yapabilirsiniz (çift yönlü için çalışır ve padding hassasiyetinden kaçınır).</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. pack_padded_sequence ile Değişken Uzunluklu Diziler</h2>

<p class="l-text">Bir batch'teki diziler farklı uzunluklara sahip olduğunda, nn.LSTM/GRU'nun naif kullanımı padlenmiş pozisyonlarda hesaplama israf eder ve son gizli durumu çöple bozabilir. PyTorch'un <code>pack_padded_sequence</code>'ı cuDNN arka ucuna padding'i düzgün atlamasını söyler.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.nn.utils.rnn <span class="kw">import</span> pack_padded_sequence, pad_packed_sequence

<span class="cm"># Üç dizilik sahte batch, uzunluklar 5, 3, 4</span>
ids = torch.<span class="fn">tensor</span>([
    [<span class="num">11</span>, <span class="num">22</span>, <span class="num">33</span>, <span class="num">44</span>, <span class="num">55</span>],
    [<span class="num">88</span>, <span class="num">99</span>, <span class="num">11</span>, <span class="num">0</span>, <span class="num">0</span>],
    [<span class="num">22</span>, <span class="num">44</span>, <span class="num">66</span>, <span class="num">88</span>, <span class="num">0</span>],
])
lengths = torch.<span class="fn">tensor</span>([<span class="num">5</span>, <span class="num">3</span>, <span class="num">4</span>])
emb = nn.<span class="fn">Embedding</span>(<span class="num">100</span>, <span class="num">16</span>, padding_idx=<span class="num">0</span>)(ids)    <span class="cm"># (3, 5, 16)</span>

<span class="cm"># Pack: LSTM'e her örnek için length_i'den sonra hesaplamayı durdurmasını söyler</span>
<span class="cm"># ÖNEMLİ: azalan uzunluğa göre sıralı olmalı VEYA enforce_sorted=False kullan</span>
packed = <span class="fn">pack_padded_sequence</span>(emb, lengths, batch_first=<span class="kw">True</span>, enforce_sorted=<span class="kw">False</span>)

lstm = nn.<span class="fn">LSTM</span>(input_size=<span class="num">16</span>, hidden_size=<span class="num">32</span>, batch_first=<span class="kw">True</span>)
packed_out, (h_n, c_n) = <span class="fn">lstm</span>(packed)
<span class="cm"># h_n[-1] padding'i yok sayan, örnek başına GERÇEK son gizli durumdur</span>

<span class="cm"># Geri padlenmiş tensor almak için aç</span>
out, out_lens = <span class="fn">pad_packed_sequence</span>(packed_out, batch_first=<span class="kw">True</span>)
<span class="fn">print</span>(out.shape, out_lens)
<span class="cm"># torch.Size([3, 5, 32]) tensor([5, 3, 4])</span>

<span class="cm"># h_n[-1] doğru cümle gösterimidir</span>
sent = h_n[-<span class="num">1</span>]                              <span class="cm"># (3, 32)</span>
<span class="fn">print</span>(sent.shape)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Değişken uzunluklu diziler padding + mask ister. pack_padded_sequence'i her satır için uzunluk hesaplayıp redüksiyonlarda mask kullanarak taklit ediyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Three sequences of different lengths, pre-padded to length 6
seqs = np.array([
    [1, 2, 3, 4, 5, 6],
    [7, 8, 9, 0, 0, 0],
    [10, 11, 12, 13, 0, 0],
])
lengths = np.array([6, 3, 4])
max_len = seqs.shape[1]

# Build mask
mask = (np.arange(max_len)[None, :] < lengths[:, None]).astype(float)
print('mask:\n', mask.astype(int))

# Use mask to compute per-sequence "mean over valid positions"
masked_sum = (seqs * mask).sum(axis=1)
masked_avg = masked_sum / lengths
print('masked sum :', masked_sum)
print('masked mean:', masked_avg.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Gerçek uzunlukları 5, 3, 4 olan üç padlenmiş dizi inşa eder -- sondaki 0'lar padding token'larıdır. 2) Onları gömer; bu <code>(3, 5, 16)</code> şeklinde tek tip bir tensor verir. 3) <code>pack_padded_sequence</code> padlenmiş tensor'u cuDNN LSTM kernel'inin verimli tüketebileceği bir <code>PackedSequence</code> nesnesine dönüştürür, her örnek için yalnızca gerçek zaman adımlarını hesaplar. <code>enforce_sorted=False</code> küçük bir maliyetle sıralanmamış batch'leri yönetir. 4) LSTM'i paketlenmiş dizide çalıştırır; <code>h_n</code> örnek başına gerçek son gizli durumu içerir (padding başlamadan hemen önceki zaman adımı). 5) Tüm çıktı dizisine ihtiyacınız varsa (örn. token seviyesi etiketleme için) <code>pad_packed_sequence</code> padlenmiş tensor'a geri dönüştürür. 6) Cümle seviyesi sınıflandırma için <code>h_n[-1]</code> tam olarak cümle gösterimidir, padding kontaminasyonu olmadan.</p>

<div class="l-warn"><strong>Tuzak:</strong> Paketlemeyi atlayıp padlenmiş bir batch'i nn.LSTM'e doğrudan beslerseniz, hücre tüm padding pozisyonları boyunca hesaplamaya devam eder ve h_n "padding token'ları gördükten sonraki LSTM"i yansıtır -- tipik olarak yanlış. Değişken uzunluklu veri için her zaman paketleyin veya sonradan maske ile mean-pool yapın.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Çift Yönlü Duygu Sınıflandırıcısı</h2>

<p class="l-text">Her şeyi bir araya getirmek: paketlenmiş dizilerle ve uygun maskelemeyle BiLSTM duygu sınıflandırıcısı.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.nn.utils.rnn <span class="kw">import</span> pack_padded_sequence, pad_packed_sequence

<span class="kw">class</span> <span class="fn">BiLSTMClassifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, embed_dim=<span class="num">128</span>, hidden=<span class="num">64</span>,
                 num_layers=<span class="num">1</span>, num_classes=<span class="num">2</span>, dropout=<span class="num">0.3</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(vocab_size, embed_dim, padding_idx=<span class="num">0</span>)
        self.lstm = nn.<span class="fn">LSTM</span>(embed_dim, hidden, num_layers=num_layers,
                            batch_first=<span class="kw">True</span>, bidirectional=<span class="kw">True</span>,
                            dropout=dropout <span class="kw">if</span> num_layers&gt;<span class="num">1</span> <span class="kw">else</span> <span class="num">0</span>)
        self.drop = nn.<span class="fn">Dropout</span>(dropout)
        self.fc = nn.<span class="fn">Linear</span>(hidden * <span class="num">2</span>, num_classes)

    <span class="kw">def</span> <span class="fn">forward</span>(self, ids, lengths):
        x = self.<span class="fn">embed</span>(ids)                                 <span class="cm"># (B, T, E)</span>
        packed = <span class="fn">pack_padded_sequence</span>(x, lengths.<span class="fn">cpu</span>(),
                                      batch_first=<span class="kw">True</span>,
                                      enforce_sorted=<span class="kw">False</span>)
        packed_out, (h_n, c_n) = self.<span class="fn">lstm</span>(packed)
        out, _ = <span class="fn">pad_packed_sequence</span>(packed_out, batch_first=<span class="kw">True</span>)
        <span class="cm"># Maske ile mean pool</span>
        mask = (ids != <span class="num">0</span>).<span class="fn">unsqueeze</span>(-<span class="num">1</span>).<span class="fn">float</span>()             <span class="cm"># (B, T, 1)</span>
        pooled = (out * mask).<span class="fn">sum</span>(dim=<span class="num">1</span>) / mask.<span class="fn">sum</span>(dim=<span class="num">1</span>).<span class="fn">clamp</span>(<span class="ty">min</span>=<span class="num">1</span>)
        <span class="kw">return</span> self.<span class="fn">fc</span>(self.<span class="fn">drop</span>(pooled))                   <span class="cm"># (B, C)</span>

<span class="cm"># hızlı test</span>
m = <span class="fn">BiLSTMClassifier</span>(vocab_size=<span class="num">10000</span>)
ids = torch.<span class="fn">tensor</span>([[<span class="num">3</span>,<span class="num">4</span>,<span class="num">5</span>,<span class="num">6</span>,<span class="num">7</span>,<span class="num">0</span>,<span class="num">0</span>],[<span class="num">8</span>,<span class="num">9</span>,<span class="num">10</span>,<span class="num">11</span>,<span class="num">12</span>,<span class="num">13</span>,<span class="num">14</span>]])
lengths = torch.<span class="fn">tensor</span>([<span class="num">5</span>, <span class="num">7</span>])
out = <span class="fn">m</span>(ids, lengths)
<span class="fn">print</span>(out.shape)                                            <span class="cm"># (2, 2)</span>
<span class="fn">print</span>(<span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> m.<span class="fn">parameters</span>()))</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Çift yönlü duygu sınıflandırıcı -- sklearn ile TF-IDF üzerinden (her iki yönü doğal olarak yakalar) eşdeğer ifade gücüne sahip oluruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)
pipe_vec = TfidfVectorizer(ngram_range=(1, 2), max_features=2500)
Xt_tr = pipe_vec.fit_transform(X_tr)
Xt_te = pipe_vec.transform(X_te)
clf = LogisticRegression(max_iter=500, C=1.5).fit(Xt_tr, y_tr)
print(classification_report(y_te, clf.predict(Xt_te), digits=3))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Tek katmanlı bir BiLSTM sınıflandırıcı inşa eder; LSTM çift yönlü olduğu için çıktı boyutu iki katlanır. 2) İleri geçiş gömer, gerçek uzunlukları kullanarak dizileri paketler, LSTM'i verimli çalıştırır ve açar. 3) Padding maskesini kullanarak zaman boyutu üzerinde mean-pool yapar -- padding token'larından kontaminasyon olmadan değişken uzunlukları temiz yönetir. 4) Tek bir Linear başlık sınıf logitlerine yansıtır. Bu mimari, belki 200k parametre ve çift yönlü bağlamla, IMDb duygusunda sıklıkla %88-90'a ulaşır, CNN'leri 2-3x hesaplamada birkaç puanla yener.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: NER için BiLSTM-CRF</div><div class="example-body">BERT'ten önce standart NER mimarisi CRF başlıklı BiLSTM idi. BiLSTM her iki yönde token başına öznitelikler üretir, CRF katmanı etiket geçişlerini zorlar (örn. "I-PER B-LOC'u takip edemez"). CoNLL-2003'te ~91 F1 aldı. BERT-base ~93 F1'e vurur ama 30x daha yavaştır; birçok üretim ortamında BiLSTM-CRF düşük gecikmeli NER için hâlâ tercih edilir.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Kapı Aktivasyonlarını Görselleştirme</h2>

<p class="l-text">Eğitilmiş bir LSTM çalıştığında, bireysel kapı birimleri anlamlı davranış öğrenir. Karpathy'nin klasik 2015 görselleştirmesi parantez içinde aktive olan birimleri, virgüllerde ateşleyen birimleri, alıntı yuvalama izleyen birimleri gösterir -- bu örüntüler için açık denetim olmadan.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Eğitimden sonra LSTM'i adım adım çalıştır ve hücre durumu değerlerini kaydet</span>
<span class="at">@torch.no_grad</span>()
<span class="kw">def</span> <span class="fn">trace_cell_state</span>(model, ids, unit_idx=<span class="num">42</span>):
    cell = nn.<span class="fn">LSTMCell</span>(model.embed.embedding_dim,
                       model.lstm.hidden_size).<span class="fn">to</span>(ids.device)
    <span class="cm"># Hücreyi modelin ilk katmanından başlat (kısalık için atlandı)</span>
    <span class="cm"># Pratikte model.lstm'den ağırlıkları çıkarıp hücreye kopyalardınız.</span>
    <span class="cm"># Sonra yineleyin:</span>
    h = torch.<span class="fn">zeros</span>(<span class="num">1</span>, model.lstm.hidden_size)
    c = torch.<span class="fn">zeros</span>(<span class="num">1</span>, model.lstm.hidden_size)
    trace = []
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(ids.<span class="fn">size</span>(<span class="num">1</span>)):
        x_t = model.<span class="fn">embed</span>(ids[:, t])           <span class="cm"># (1, E)</span>
        h, c = <span class="fn">cell</span>(x_t, (h, c))
        trace.<span class="fn">append</span>(c[<span class="num">0</span>, unit_idx].<span class="fn">item</span>())
    <span class="kw">return</span> trace

<span class="cm"># Gerçek iş akışı:</span>
<span class="cm"># 1) Bir corpus'ta BiLSTM eğit (örn. Penn Treebank)</span>
<span class="cm"># 2) Bir cümle seç ve tokenize et</span>
<span class="cm"># 3) Her gizli birim için, c_t'yi zaman üzerinde çiz</span>
<span class="cm"># 4) Aktivasyonu anlamlı bir öznitelikle ilişkilendiren birimleri bul</span>
<span class="cm">#    (parantez derinliği, cümle uzunluğu, duygu polaritesi, ...)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Kapı benzeri aktivasyon kalıplarını görselleştir: bir forget kapısının dizi üzerinde yapacağını simüle et (gürültü için çoğunlukla kapalı, sinyal için açık).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
seq_len = 12
signal = np.zeros(seq_len)
signal[3] = 1.0
signal[7] = 1.0
signal[10] = -1.0
noise  = rng.standard_normal(seq_len) * 0.2

# Forget gate is sigmoid of a learned function of input.
# If gate ~ 1 => keep, ~0 => forget. Pretend it tracks the absolute value.
gate = 1 / (1 + np.exp(-(np.abs(signal + noise) - 0.3) * 4))
print('step  signal+noise  gate (sigmoid)')
for t in range(seq_len):
    bar = '#' * int(gate[t] * 20)
    print(f'{t:3d}    {signal[t]+noise[t]:+.3f}      {gate[t]:.3f}  {bar}')</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Bir LSTM hücresini bir dizide adım adım çalıştıran ve her zaman adımında belirli bir hücre-durumu biriminin değerini kaydeden bir yardımcı tanımlar. 2) Tam iş akışı (yorumlanmış) bir BiLSTM eğitmek, hücre durumlarını birçok cümle üzerinde çizerek yorumlanabilir birimleri seçmek ve onları görselleştirmektir. 3) Ünlü sonuç: Linux kaynak kodu üzerinde eğitilmiş karakter seviyesinde bir LSTM'de, bir birim girinti derinliğini izler; bir diğeri string literalleri içinde ateşler; bir diğeri açık parantezleri sayar. Bu tür kendi kendine organize yapı, transformer attention gelmeden önceki yıllar boyunca LSTM'lerin "yeterince yorumlanabilir" sayılmasının nedenlerinden biridir.</p>

<div id="plot-pl7-gates-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> 30 adımlı bir dizide izlenen üç LSTM hücre-durumu birimi. Birim 12 (forget-kapı yönetimli) ilginç bir şey olmadığında üstel düşer. Birim 27 (girdi yönetimli) anahtar bir kelime göründüğünde sıçrar. Birim 41 (uzun süreli hafıza) "şimdiye kadar polarity"yi kodlayan kararlı bir seviye tutar. Bu tür kendini organize etme transformer döneminden önce LSTM'leri "büyülü" hissettiren şeydir.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. RNN/LSTM/GRU'yu Ne Zaman Seçmeli</h2>

<p class="l-text">Her aracın probleme ne zaman uyduğunu bilmek, bu dersin pratik teslimatıdır.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">RNN/LSTM/GRU kullan ne zaman</div><div class="compare-item">Akış çıkarımı (token başına bir)</div><div class="compare-item">Çok uzun diziler (transformer'lar OOM)</div><div class="compare-item">Küçük bellek bütçesi (mobil, edge)</div><div class="compare-item">Karakter seviyesinde küçük veri için dil modelleme</div><div class="compare-item">Sınırlı hesaplama ile dizi-dizi</div></div>
<div class="compare-col"><div class="compare-title">Transformer kullan ne zaman</div><div class="compare-item">Önceden eğitilmiş model ince ayarlama (BERT, GPT)</div><div class="compare-item">Kısadan ortaya diziler (≤ 512 token)</div><div class="compare-item">Doğruluk en üst öncelik</div><div class="compare-item">GPU hesaplaması mevcut</div><div class="compare-item">Uzun mesafe bağımlılıklar önemli</div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Düz RNN</div><div class="card-body">Neredeyse hiç; LSTM/GRU ile değiştirildi. Yalnızca öğretim örneği olarak kullanışlı.</div></div>
<div class="calc-card"><div class="card-title">LSTM</div><div class="card-body">Uzun bağımlılıklar için klasik. GRU'dan daha yüksek kapasite.</div></div>
<div class="calc-card"><div class="card-title">GRU</div><div class="card-body">Sıklıkla LSTM kadar iyi, ~%25 daha hızlı. Değişken uzunluklu metin için iyi varsayılan.</div></div>
<div class="calc-card"><div class="card-title">BiLSTM/BiGRU</div><div class="card-body">Tam dizi erişimini karşılayabildiğinizde. Etiketleme/sınıflandırma için standart.</div></div>
<div class="calc-card"><div class="card-title">Yığılmış (2-3 katman)</div><div class="card-body">Token başına daha fazla kapasite, daha yavaş. Sığ underfit ediyorsa ekleyin.</div></div>
<div class="calc-card"><div class="card-title">Hibrit CNN-LSTM</div><div class="card-body">Yerel öznitelikler için CNN + dizi dinamikleri için LSTM. Konuşmada yaygın.</div></div>
</div>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Bir RNN, parametreleri zamanda paylaşılan, her zaman adımında uygulanan aynı fonksiyondur.<br><strong>2.</strong> Düz RNN ~20 adımdan uzun dizilerde yokolan/patlayan gradyan sorunundan muzdariptir.<br><strong>3.</strong> LSTM bunu ayrı bir hücre durumu ve üç kapı (forget, input, output) ile çözer -- gradyan hücre kanalı boyunca neredeyse değiştirilmemiş akar.<br><strong>4.</strong> GRU daha basit 2 kapılı bir alternatiftir; LSTM'den ~%25 daha hızlı, benzer doğrulukla.<br><strong>5.</strong> <code>nn.LSTM</code> / <code>nn.GRU</code> tüm diziyi tek çağrıda işler; <code>nn.LSTMCell</code> alışılmadık kontrol akışı için adım başına.<br><strong>6.</strong> Değişken uzunluklu batch'ler için <code>pack_padded_sequence</code> kullanın -- aksi halde son gizli durum padding ile bozulur.<br><strong>7.</strong> Çift yönlü size her iki taraftan bağlam verir; etiketleme ve sınıflandırma için standart.<br><strong>8.</strong> Sonraki ders: embedding'ler -- ham token ID'lerinin tüm bu modellerin gerçekten tükettiği yoğun vektörlere nasıl dönüştüğü.</div></div>
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

  function vanishPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var steps = []; for (var i=0;i<=100;i++) steps.push(i);
    var rnn = steps.map(function(s){return Math.pow(0.95, 100-s);});
    var lstm = steps.map(function(s){return Math.exp(-(100-s)/200);});
    var t1 = {x:steps, y:rnn, mode:'lines', type:'scatter', name:'Plain RNN', line:{color:'#f87171', width:2.5}};
    var t2 = {x:steps, y:lstm, mode:'lines', type:'scatter', name:'LSTM (cell path)', line:{color:T.accent, width:2.5}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Zaman İçinde Gradyan Akışı (log ölçek)':'Gradient Flow Backwards Through Time (log)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman adımı (sondan geri)':'timestep (from end)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'gradyan büyüklüğü':'gradient magnitude', gridcolor:T.grid, zerolinecolor:T.zero, type:'log'},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2], layout, {responsive:true, displayModeBar:false});
  }

  function gatesPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var t = []; for (var i=0;i<30;i++) t.push(i);
    var u12 = t.map(function(i){return Math.exp(-i/8) + (Math.random()-0.5)*0.05;});
    var u27 = t.map(function(i){var spikes=[5,12,18,25];var v=0.1;spikes.forEach(function(s){v+=Math.exp(-(i-s)*(i-s)/2);});return v;});
    var u41 = t.map(function(i){return 0.6 + 0.3*Math.sin(i/8) + (Math.random()-0.5)*0.05;});
    var t1 = {x:t, y:u12, mode:'lines+markers', type:'scatter', name:lang==='tr'?'Birim 12 (forget)':'Unit 12 (forget)', line:{color:'#f87171', width:2}, marker:{size:5}};
    var t2 = {x:t, y:u27, mode:'lines+markers', type:'scatter', name:lang==='tr'?'Birim 27 (girdi)':'Unit 27 (input)', line:{color:'#4ecdc4', width:2}, marker:{size:5}};
    var t3 = {x:t, y:u41, mode:'lines+markers', type:'scatter', name:lang==='tr'?'Birim 41 (uzun süreli)':'Unit 41 (long-term)', line:{color:T.accent, width:2}, marker:{size:5}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Zaman İçinde LSTM Hücre Durumu Birimleri':'LSTM Cell-State Units Over Time', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman adımı':'timestep', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'aktivasyon':'activation', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [t1,t2,t3], layout, {responsive:true, displayModeBar:false});
  }

  vanishPlot('plot-pl7-vanish-en','en');
  gatesPlot('plot-pl7-gates-en','en');
  vanishPlot('plot-pl7-vanish-tr','tr');
  gatesPlot('plot-pl7-gates-tr','tr');
}, 250);</script>
`
};
