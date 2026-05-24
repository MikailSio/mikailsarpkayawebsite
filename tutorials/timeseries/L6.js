window.TIMESERIES_L6 = {

en: `<p class="l-text"><strong>ARIMA hits a wall when the season is irregular, the trend is non-linear, and the dataset is wide.</strong> Once you have hundreds of related series — products in a catalog, sensors in a factory — fitting one statistical model per series stops scaling. Deep nets shine here: one shared network learns from every series and transfers patterns.</p>

<p class="l-text">In this lesson you will build the deep-learning baselines for forecasting: a vanilla RNN, an LSTM, a 1D CNN, and an encoder-decoder. You will see how seq-to-one is enough for a one-step ahead bet but seq-to-seq is the right tool when the horizon stretches to a week. We use <code>df_stocks</code> (261 days OHLCV) end-to-end so every code block is reproducible.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Frame a forecast as a supervised learning problem with sliding windows</li>
<li>Implement a hand-coded RNN recurrence in NumPy on real OHLCV data</li>
<li>Compare LSTM, GRU, and 1D-CNN baselines on the same loss</li>
<li>Distinguish sequence-to-one from sequence-to-sequence and pick the right one</li>
<li>Build a teacher-forced encoder-decoder for multi-step forecasting</li>
<li>Diagnose exposure bias and choose between recursive and direct strategies</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. From Time Series to Tensors</h2>
<p class="l-text">A neural network does not know what a time index is. We must reshape the series into <em>(samples, lookback, features)</em> windows. A lookback of 30 means the model sees one month of history; a horizon of 5 means it predicts the next trading week.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Lookback (L)</div><div class="card-body">How many past steps fed in. Too short = no signal, too long = noise dominates.</div></div>
<div class="calc-card"><div class="card-title">Horizon (H)</div><div class="card-body">How many future steps to predict. H=1 is one-step-ahead, H&gt;1 is multi-horizon.</div></div>
<div class="calc-card"><div class="card-title">Stride (s)</div><div class="card-body">Step between consecutive windows. s=1 maximizes data, s=L gives non-overlapping samples.</div></div>
<div class="calc-card"><div class="card-title">Features (F)</div><div class="card-body">Channels per step: Close only is F=1, OHLCV is F=5.</div></div>
</div>
<div class="calc-highlight">A 261-day series with L=30, H=5, s=1 yields 227 training windows — small for deep nets but enough to demo every architecture below.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Building Windows on df_stocks</h2>
<p class="l-text">We standardize Close, then slice it into supervised pairs. Pure NumPy, no Torch needed for this step.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
mu, sd = close.<span class="fn">mean</span>(), close.<span class="fn">std</span>()
z = (close - mu) / sd

L, H = <span class="num">30</span>, <span class="num">5</span>
X, Y = [], []
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z) - L - H + <span class="num">1</span>):
    X.<span class="fn">append</span>(z[i:i+L])
    Y.<span class="fn">append</span>(z[i+L:i+L+H])
X = np.<span class="fn">array</span>(X); Y = np.<span class="fn">array</span>(Y)
<span class="fn">print</span>(<span class="str">"X:"</span>, X.shape, <span class="str">"Y:"</span>, Y.shape)
<span class="fn">print</span>(<span class="str">"first window mean:"</span>, X[<span class="num">0</span>].<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text">This window-and-stack pattern is the universal first step — the rest of the lesson assumes <code>X</code> and <code>Y</code> already exist.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Vanilla RNN — The Recurrence by Hand</h2>
<p class="l-text">An RNN updates a hidden state at each step: <span class="katex-block">$$h_t = \\tanh(W_x x_t + W_h h_{t-1} + b)$$</span> The output head reads the final hidden state. Implemented in NumPy this is a 5-line loop.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="ty">RNN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, hid=<span class="num">32</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.rnn = nn.<span class="fn">RNN</span>(<span class="num">1</span>, hid, batch_first=<span class="kw">True</span>)
        self.out = nn.<span class="fn">Linear</span>(hid, <span class="num">1</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        h, _ = self.<span class="fn">rnn</span>(x)
        <span class="kw">return</span> self.<span class="fn">out</span>(h[:, -<span class="num">1</span>])</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Hand-coded RNN forward pass on the first 30-day window. Random weights so MSE is huge — the point is the recurrence shape.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
z = (close - close.<span class="fn">mean</span>()) / close.<span class="fn">std</span>()
x = z[:<span class="num">30</span>]                     <span class="cm"># lookback window</span>
target = z[<span class="num">30</span>]

H = <span class="num">8</span>
Wx = np.random.<span class="fn">randn</span>(H) * <span class="num">0.1</span>
Wh = np.random.<span class="fn">randn</span>(H, H) * <span class="num">0.1</span>
b  = np.<span class="fn">zeros</span>(H)
Wo = np.random.<span class="fn">randn</span>(H) * <span class="num">0.1</span>

h = np.<span class="fn">zeros</span>(H)
<span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(x)):
    h = np.<span class="fn">tanh</span>(Wx * x[t] + Wh @ h + b)
y_hat = Wo @ h
<span class="fn">print</span>(<span class="str">"y_hat:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(y_hat), <span class="num">4</span>), <span class="str">"target:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(target), <span class="num">4</span>))
<span class="fn">print</span>(<span class="str">"hidden norm:"</span>, np.linalg.<span class="fn">norm</span>(h).<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. LSTM and GRU — Memory That Survives Backprop</h2>
<p class="l-text">Vanilla RNNs vanish after roughly 20 steps. LSTM cells add a gated memory: <span class="katex-block">$$c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t, \\quad h_t = o_t \\odot \\tanh(c_t)$$</span> The forget gate <em>f</em>, input gate <em>i</em>, and output gate <em>o</em> are sigmoid functions of <em>(x, h)</em>. GRU collapses this into 2 gates and is roughly 25% cheaper.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">RNN</div><div class="card-body">Cheapest, vanishes after ~20 steps. Fine for L &lt;= 15.</div></div>
<div class="calc-card"><div class="card-title">LSTM</div><div class="card-body">Industry workhorse 2015-2020. Stable up to L ~ 200.</div></div>
<div class="calc-card"><div class="card-title">GRU</div><div class="card-body">Slightly faster, often ties LSTM. Default for short sequences.</div></div>
<div class="calc-card"><div class="card-title">1D-CNN</div><div class="card-body">Embarrassingly parallel. Great for fixed-length local patterns.</div></div>
</div>
<div class="calc-highlight">If your loss curve plateaus and your validation MSE jitters, it is almost always exposure bias or scale drift — not the cell type.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. 1D-CNN Baseline — Forecasting With Filters</h2>
<p class="l-text">A 1D convolution slides a small filter (kernel=3 or 5) along the time axis. Stack a few layers, add a linear head, and you have a forecaster that often matches an LSTM at a tenth of the wall-clock time. Below is a hand-rolled 1D conv on a 30-day window.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.signal <span class="kw">import</span> convolve

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
z = (close - close.<span class="fn">mean</span>()) / close.<span class="fn">std</span>()

kernel = np.<span class="fn">array</span>([<span class="num">0.2</span>, <span class="num">0.5</span>, <span class="num">0.3</span>])           <span class="cm"># learnable in real CNN</span>
feat   = <span class="fn">convolve</span>(z[:<span class="num">30</span>], kernel, mode=<span class="str">"valid"</span>)
w_out  = np.<span class="fn">linspace</span>(<span class="num">0.01</span>, <span class="num">0.04</span>, <span class="fn">len</span>(feat))    <span class="cm"># pretend trained head</span>
y_hat  = (feat * w_out).<span class="fn">sum</span>()
<span class="fn">print</span>(<span class="str">"feat shape:"</span>, feat.shape, <span class="str">"y_hat:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(y_hat), <span class="num">4</span>))</code></pre></div>
<p class="l-text">Real PyTorch <code>Conv1d</code> learns the kernel by gradient descent. The shape of computation is identical to what you just ran.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Sequence-to-One vs Sequence-to-Sequence</h2>
<p class="l-text">Seq-to-one feeds a window in and emits a single number — tomorrow's Close. Seq-to-seq feeds a window in and emits a vector — the next 5 days. The architectural difference is the head: one Linear layer (1 unit) vs one Linear layer (H units), or a decoder network that unrolls.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Seq2One direct</div><div class="card-body">One model per horizon. H models if you want H steps. Simple, no exposure bias.</div></div>
<div class="calc-card"><div class="card-title">Seq2One recursive</div><div class="card-body">Predict t+1, feed it back, predict t+2. One model, but errors compound fast.</div></div>
<div class="calc-card"><div class="card-title">Seq2Seq (MIMO)</div><div class="card-body">Single forward pass emits all H steps. Joint loss handles correlations.</div></div>
<div class="calc-card"><div class="card-title">Encoder-Decoder</div><div class="card-body">Encoder summarizes the past; decoder unrolls H steps with optional teacher forcing.</div></div>
</div>
<div class="calc-highlight">For H &lt;= 5 the MIMO head is a strong default. Beyond H=12 the encoder-decoder usually wins because the decoder can use auto-regressive features.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Encoder-Decoder With Teacher Forcing</h2>
<p class="l-text">During training the decoder receives the <em>true</em> previous target instead of its own prediction — this is teacher forcing. It speeds up convergence but creates exposure bias at inference: the decoder has never seen its own mistakes. Scheduled sampling and curriculum learning fix this.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="ty">EncDec</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, hid=<span class="num">32</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.enc = nn.<span class="fn">GRU</span>(<span class="num">1</span>, hid, batch_first=<span class="kw">True</span>)
        self.dec = nn.<span class="fn">GRUCell</span>(<span class="num">1</span>, hid)
        self.out = nn.<span class="fn">Linear</span>(hid, <span class="num">1</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x, target=<span class="kw">None</span>, H=<span class="num">5</span>):
        _, h = self.<span class="fn">enc</span>(x); h = h.<span class="fn">squeeze</span>(<span class="num">0</span>)
        y_prev = x[:, -<span class="num">1</span>]; preds = []
        <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(H):
            h = self.<span class="fn">dec</span>(y_prev, h)
            y = self.<span class="fn">out</span>(h); preds.<span class="fn">append</span>(y)
            y_prev = target[:, t:t+<span class="num">1</span>] <span class="kw">if</span> target <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span> <span class="kw">else</span> y
        <span class="kw">return</span> torch.<span class="fn">cat</span>(preds, dim=<span class="num">1</span>)</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Recursive vs direct (MIMO) prediction with sklearn linear regression on lag features. Watch the recursive error compound past step 3.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
z = (z - z.<span class="fn">mean</span>()) / z.<span class="fn">std</span>()
L, H = <span class="num">10</span>, <span class="num">5</span>
X = np.<span class="fn">stack</span>([z[i:i+L] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z) - L - H)])
Y = np.<span class="fn">stack</span>([z[i+L:i+L+H] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z) - L - H)])

<span class="cm"># MIMO direct</span>
mimo = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X[:<span class="num">200</span>], Y[:<span class="num">200</span>])
mimo_mse = ((mimo.<span class="fn">predict</span>(X[<span class="num">200</span>:]) - Y[<span class="num">200</span>:])**<span class="num">2</span>).<span class="fn">mean</span>(<span class="num">0</span>)

<span class="cm"># Recursive: 1-step model rolled forward</span>
rec = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X[:<span class="num">200</span>], Y[:<span class="num">200</span>, <span class="num">0</span>])
preds = []
<span class="kw">for</span> x <span class="kw">in</span> X[<span class="num">200</span>:]:
    cur, out = x.<span class="fn">copy</span>(), []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(H):
        p = rec.<span class="fn">predict</span>(cur[<span class="kw">None</span>])[<span class="num">0</span>]
        out.<span class="fn">append</span>(p); cur = np.<span class="fn">roll</span>(cur, -<span class="num">1</span>); cur[-<span class="num">1</span>] = p
    preds.<span class="fn">append</span>(out)
rec_mse = ((np.<span class="fn">array</span>(preds) - Y[<span class="num">200</span>:])**<span class="num">2</span>).<span class="fn">mean</span>(<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">"step  mimo  recursive"</span>)
<span class="kw">for</span> h <span class="kw">in</span> <span class="fn">range</span>(H):
    <span class="fn">print</span>(<span class="fn">f</span><span class="str">"  {h+1}   {mimo_mse[h]:.3f}   {rec_mse[h]:.3f}"</span>)</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Training Recipe and Evaluation</h2>
<p class="l-text">Loss is MSE on the standardized target. Optimizer Adam at 1e-3 with reduce-on-plateau. Validation split is the tail (never random) to avoid leaking the future. Report MAE and sMAPE in the original units after inverse-standardizing.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.neural_network <span class="kw">import</span> MLPRegressor
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> mean_absolute_error

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
mu, sd = z.<span class="fn">mean</span>(), z.<span class="fn">std</span>()
zn = (z - mu) / sd
L, H = <span class="num">20</span>, <span class="num">3</span>
X = np.<span class="fn">stack</span>([zn[i:i+L] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(zn) - L - H)])
Y = np.<span class="fn">stack</span>([zn[i+L:i+L+H] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(zn) - L - H)])

cut = <span class="fn">int</span>(<span class="fn">len</span>(X) * <span class="num">0.8</span>)
mdl = <span class="fn">MLPRegressor</span>(hidden_layer_sizes=(<span class="num">32</span>, <span class="num">16</span>), max_iter=<span class="num">300</span>,
                   random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[:cut], Y[:cut])
pred = mdl.<span class="fn">predict</span>(X[cut:])
mae_units = <span class="fn">mean_absolute_error</span>(Y[cut:] * sd + mu, pred * sd + mu)
<span class="fn">print</span>(<span class="str">"val MAE (currency units):"</span>, <span class="fn">round</span>(<span class="fn">float</span>(mae_units), <span class="num">3</span>))</code></pre></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. When Deep Learning Wins (and When It Loses)</h2>
<p class="l-text">A 2022 M5-style audit by Makridakis showed deep nets beat ETS only when the dataset has <em>many related</em> series. On a single-series univariate problem, naive seasonal and ETS still win two thirds of the time at a fraction of the cost.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DL wins</div><div class="card-body">100+ related series, exogenous features, long horizon, regime shifts.</div></div>
<div class="calc-card"><div class="card-title">DL ties</div><div class="card-body">Medium catalog (10-100 series), moderate seasonality.</div></div>
<div class="calc-card"><div class="card-title">DL loses</div><div class="card-body">Single short series, strong known seasonality, no covariates.</div></div>
<div class="calc-card"><div class="card-title">Always</div><div class="card-body">Compare against naive seasonal — if you cannot beat it, do not deploy a net.</div></div>
</div>
<div class="calc-highlight">The next two lessons (N-BEATS, Transformers) raise the ceiling further — but only when you have the data to feed them.</div>
</div>
`,
tr: `<p class="l-text"><strong>ARIMA, mevsim düzensiz olduğunda, trend doğrusal olmadığında ve veri kümesi geniş olduğunda bir duvara çarpar.</strong> Yüzlerce ilişkili seriniz olduğunda — bir kataloğdaki ürünler, bir fabrikadaki sensörler — seri başına bir istatistiksel model uydurmak ölçeklenmeyi keser. Derin ağlar burada parlar: tek bir paylaşılan ağ her seriden öğrenir ve desenleri aktarır.</p>

<p class="l-text">Bu derste tahmincilik için derin öğrenme referanslarını inşa edeceksin: bir vanilla RNN, bir LSTM, bir 1D CNN ve bir kodlayıcı-kod çözücü. Bir adım ileri bir bahis için seq-to-one'ın yeterli olduğunu, ufuk bir haftaya uzandığında seq-to-seq'in doğru araç olduğunu göreceksin. Her kod bloğunun yeniden üretilebilir olması için <code>df_stocks</code>'u (261 gün OHLCV) baştan sona kullanıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir tahmini kayan pencerelerle denetimli öğrenme problemi olarak çerçevele</li>
<li>Gerçek OHLCV verisi üzerinde NumPy'da elle kodlanmış bir RNN özyinelemesi uygula</li>
<li>Aynı kayıp üzerinde LSTM, GRU ve 1D-CNN referanslarını karşılaştır</li>
<li>Sequence-to-one'ı sequence-to-sequence'tan ayırt et ve doğrusunu seç</li>
<li>Çok adımlı tahmin için öğretmen-zorlamalı bir kodlayıcı-kod çözücü inşa et</li>
<li>Maruziyet yanlılığını ayıkla ve özyinelemeli ile doğrudan stratejiler arasında seçim yap</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Zaman Serisinden Tensörlere</h2>
<p class="l-text">Bir sinir ağı zaman indeksinin ne olduğunu bilmez. Seriyi <em>(örnek, geriye bakma, özellik)</em> pencerelerine yeniden şekillendirmeliyiz. 30'luk geriye bakma, modelin bir aylık tarihçeyi gördüğü anlamına gelir; 5'lik bir ufuk, sonraki işlem haftasını tahmin ettiği anlamına gelir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Geriye bakma (L)</div><div class="card-body">Kaç geçmiş adım beslenir. Çok kısa = sinyal yok, çok uzun = gürültü hâkim.</div></div>
<div class="calc-card"><div class="card-title">Ufuk (H)</div><div class="card-body">Tahmin edilecek kaç gelecek adım. H=1 bir adım ileri, H&gt;1 çok ufuklu.</div></div>
<div class="calc-card"><div class="card-title">Adım (s)</div><div class="card-body">Ardışık pencereler arasındaki adım. s=1 veriyi maksimize eder, s=L örtüşmeyen örnekler verir.</div></div>
<div class="calc-card"><div class="card-title">Özellikler (F)</div><div class="card-body">Adım başına kanal: yalnızca Close ise F=1, OHLCV ise F=5.</div></div>
</div>
<div class="calc-highlight">L=30, H=5, s=1 ile 261 günlük seri 227 eğitim penceresi verir — derin ağlar için küçük ama aşağıdaki her mimariyi göstermeye yeter.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. df_stocks Üzerinde Pencere Oluşturma</h2>
<p class="l-text">Close'u standartlaştırırız, sonra denetimli çiftler halinde dilimleriz. Saf NumPy, bu adım için Torch gerekmez.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
mu, sd = close.<span class="fn">mean</span>(), close.<span class="fn">std</span>()
z = (close - mu) / sd

L, H = <span class="num">30</span>, <span class="num">5</span>
X, Y = [], []
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z) - L - H + <span class="num">1</span>):
    X.<span class="fn">append</span>(z[i:i+L])
    Y.<span class="fn">append</span>(z[i+L:i+L+H])
X = np.<span class="fn">array</span>(X); Y = np.<span class="fn">array</span>(Y)
<span class="fn">print</span>(<span class="str">"X:"</span>, X.shape, <span class="str">"Y:"</span>, Y.shape)
<span class="fn">print</span>(<span class="str">"first window mean:"</span>, X[<span class="num">0</span>].<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text">Bu pencere-ve-yığ deseni evrensel ilk adımdır — dersin geri kalanı <code>X</code> ve <code>Y</code>'nin zaten var olduğunu varsayar.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Vanilla RNN — Özyineleme Elle</h2>
<p class="l-text">Bir RNN her adımda bir gizli durumu günceller: <span class="katex-block">$$h_t = \\tanh(W_x x_t + W_h h_{t-1} + b)$$</span> Çıktı kafası son gizli durumu okur. NumPy'da uygulandığında bu 5 satırlık bir döngüdür.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="ty">RNN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, hid=<span class="num">32</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.rnn = nn.<span class="fn">RNN</span>(<span class="num">1</span>, hid, batch_first=<span class="kw">True</span>)
        self.out = nn.<span class="fn">Linear</span>(hid, <span class="num">1</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        h, _ = self.<span class="fn">rnn</span>(x)
        <span class="kw">return</span> self.<span class="fn">out</span>(h[:, -<span class="num">1</span>])</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">İlk 30 günlük pencere üzerinde elle kodlanmış RNN ileri geçişi. Rastgele ağırlıklar olduğu için MSE çok büyüktür — amaç özyineleme şeklini göstermektir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
z = (close - close.<span class="fn">mean</span>()) / close.<span class="fn">std</span>()
x = z[:<span class="num">30</span>]                     <span class="cm"># geriye bakma penceresi</span>
target = z[<span class="num">30</span>]

H = <span class="num">8</span>
Wx = np.random.<span class="fn">randn</span>(H) * <span class="num">0.1</span>
Wh = np.random.<span class="fn">randn</span>(H, H) * <span class="num">0.1</span>
b  = np.<span class="fn">zeros</span>(H)
Wo = np.random.<span class="fn">randn</span>(H) * <span class="num">0.1</span>

h = np.<span class="fn">zeros</span>(H)
<span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(x)):
    h = np.<span class="fn">tanh</span>(Wx * x[t] + Wh @ h + b)
y_hat = Wo @ h
<span class="fn">print</span>(<span class="str">"y_hat:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(y_hat), <span class="num">4</span>), <span class="str">"target:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(target), <span class="num">4</span>))
<span class="fn">print</span>(<span class="str">"hidden norm:"</span>, np.linalg.<span class="fn">norm</span>(h).<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. LSTM ve GRU — Geri Yayılımı Atlatan Bellek</h2>
<p class="l-text">Vanilla RNN'ler kabaca 20 adım sonra kaybolur. LSTM hücreleri kapılı bir bellek ekler: <span class="katex-block">$$c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t, \\quad h_t = o_t \\odot \\tanh(c_t)$$</span> Unutma kapısı <em>f</em>, giriş kapısı <em>i</em> ve çıkış kapısı <em>o</em>, <em>(x, h)</em>'in sigmoid fonksiyonlarıdır. GRU bunu 2 kapıya sıkıştırır ve kabaca %25 daha ucuzdur.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">RNN</div><div class="card-body">En ucuz, ~20 adım sonra kaybolur. L &lt;= 15 için iyidir.</div></div>
<div class="calc-card"><div class="card-title">LSTM</div><div class="card-body">2015-2020 arası endüstri iş atı. L ~ 200'e kadar kararlı.</div></div>
<div class="calc-card"><div class="card-title">GRU</div><div class="card-body">Hafifçe daha hızlı, genellikle LSTM ile berabere. Kısa diziler için varsayılan.</div></div>
<div class="calc-card"><div class="card-title">1D-CNN</div><div class="card-body">Utanç verici şekilde paralel. Sabit uzunluklu yerel desenler için harika.</div></div>
</div>
<div class="calc-highlight">Kayıp eğriniz plato yapıyor ve doğrulama MSE'niz titriyorsa, neredeyse her zaman maruziyet yanlılığı veya ölçek sürüklenmesidir — hücre türü değil.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. 1D-CNN Referansı — Filtrelerle Tahmincilik</h2>
<p class="l-text">1D evrişim, küçük bir filtreyi (kernel=3 veya 5) zaman ekseni boyunca kaydırır. Birkaç katman yığın, doğrusal kafa ekle ve genellikle bir LSTM'le eşleşen ama duvar saati zamanının onda biriyle çalışan bir tahminciye sahip olursun. Aşağıda 30 günlük bir pencere üzerinde elle yapılmış bir 1D conv var.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.signal <span class="kw">import</span> convolve

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
z = (close - close.<span class="fn">mean</span>()) / close.<span class="fn">std</span>()

kernel = np.<span class="fn">array</span>([<span class="num">0.2</span>, <span class="num">0.5</span>, <span class="num">0.3</span>])           <span class="cm"># gerçek CNN'de öğrenilebilir</span>
feat   = <span class="fn">convolve</span>(z[:<span class="num">30</span>], kernel, mode=<span class="str">"valid"</span>)
w_out  = np.<span class="fn">linspace</span>(<span class="num">0.01</span>, <span class="num">0.04</span>, <span class="fn">len</span>(feat))    <span class="cm"># eğitilmiş kafa varsay</span>
y_hat  = (feat * w_out).<span class="fn">sum</span>()
<span class="fn">print</span>(<span class="str">"feat shape:"</span>, feat.shape, <span class="str">"y_hat:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(y_hat), <span class="num">4</span>))</code></pre></div>
<p class="l-text">Gerçek PyTorch <code>Conv1d</code>, çekirdeği gradyan inişi ile öğrenir. Hesaplama şekli, az önce çalıştırdığınızla özdeştir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Sequence-to-One vs Sequence-to-Sequence</h2>
<p class="l-text">Seq-to-one bir pencere besler ve tek bir sayı yayar — yarınki Close. Seq-to-seq bir pencere besler ve bir vektör yayar — sonraki 5 gün. Mimari fark kafadır: bir Linear katmanı (1 birim) vs bir Linear katmanı (H birim) ya da açan bir kod çözücü ağı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Seq2One doğrudan</div><div class="card-body">Ufuk başına bir model. H adım istiyorsan H model. Basit, maruziyet yanlılığı yok.</div></div>
<div class="calc-card"><div class="card-title">Seq2One özyinelemeli</div><div class="card-body">t+1'i tahmin et, geri besle, t+2'yi tahmin et. Tek model, ama hatalar hızlı birikir.</div></div>
<div class="calc-card"><div class="card-title">Seq2Seq (MIMO)</div><div class="card-body">Tek ileri geçiş tüm H adımı yayar. Ortak kayıp korelasyonları işler.</div></div>
<div class="calc-card"><div class="card-title">Kodlayıcı-Kod Çözücü</div><div class="card-body">Kodlayıcı geçmişi özetler; kod çözücü isteğe bağlı öğretmen zorlamasıyla H adım açar.</div></div>
</div>
<div class="calc-highlight">H &lt;= 5 için MIMO kafa güçlü bir varsayılandır. H=12'nin ötesinde kodlayıcı-kod çözücü genellikle kazanır çünkü kod çözücü oto-regresif özellikleri kullanabilir.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Öğretmen Zorlamalı Kodlayıcı-Kod Çözücü</h2>
<p class="l-text">Eğitim sırasında kod çözücü kendi tahmini yerine <em>gerçek</em> önceki hedefi alır — bu öğretmen zorlamasıdır. Yakınsamayı hızlandırır ama çıkarımda maruziyet yanlılığı yaratır: kod çözücü kendi hatalarını hiç görmemiştir. Programlanmış örnekleme ve müfredat öğrenmesi bunu düzeltir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="ty">EncDec</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, hid=<span class="num">32</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.enc = nn.<span class="fn">GRU</span>(<span class="num">1</span>, hid, batch_first=<span class="kw">True</span>)
        self.dec = nn.<span class="fn">GRUCell</span>(<span class="num">1</span>, hid)
        self.out = nn.<span class="fn">Linear</span>(hid, <span class="num">1</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x, target=<span class="kw">None</span>, H=<span class="num">5</span>):
        _, h = self.<span class="fn">enc</span>(x); h = h.<span class="fn">squeeze</span>(<span class="num">0</span>)
        y_prev = x[:, -<span class="num">1</span>]; preds = []
        <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(H):
            h = self.<span class="fn">dec</span>(y_prev, h)
            y = self.<span class="fn">out</span>(h); preds.<span class="fn">append</span>(y)
            y_prev = target[:, t:t+<span class="num">1</span>] <span class="kw">if</span> target <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span> <span class="kw">else</span> y
        <span class="kw">return</span> torch.<span class="fn">cat</span>(preds, dim=<span class="num">1</span>)</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Gecikme özellikleri üzerinde sklearn doğrusal regresyonuyla özyinelemeli vs doğrudan (MIMO) tahmin. Özyinelemeli hatanın 3. adımdan sonra biriktiğine dikkat et.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
z = (z - z.<span class="fn">mean</span>()) / z.<span class="fn">std</span>()
L, H = <span class="num">10</span>, <span class="num">5</span>
X = np.<span class="fn">stack</span>([z[i:i+L] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z) - L - H)])
Y = np.<span class="fn">stack</span>([z[i+L:i+L+H] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z) - L - H)])

<span class="cm"># MIMO doğrudan</span>
mimo = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X[:<span class="num">200</span>], Y[:<span class="num">200</span>])
mimo_mse = ((mimo.<span class="fn">predict</span>(X[<span class="num">200</span>:]) - Y[<span class="num">200</span>:])**<span class="num">2</span>).<span class="fn">mean</span>(<span class="num">0</span>)

<span class="cm"># Özyinelemeli: 1-adım model ileri yuvarlanmış</span>
rec = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X[:<span class="num">200</span>], Y[:<span class="num">200</span>, <span class="num">0</span>])
preds = []
<span class="kw">for</span> x <span class="kw">in</span> X[<span class="num">200</span>:]:
    cur, out = x.<span class="fn">copy</span>(), []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(H):
        p = rec.<span class="fn">predict</span>(cur[<span class="kw">None</span>])[<span class="num">0</span>]
        out.<span class="fn">append</span>(p); cur = np.<span class="fn">roll</span>(cur, -<span class="num">1</span>); cur[-<span class="num">1</span>] = p
    preds.<span class="fn">append</span>(out)
rec_mse = ((np.<span class="fn">array</span>(preds) - Y[<span class="num">200</span>:])**<span class="num">2</span>).<span class="fn">mean</span>(<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">"step  mimo  recursive"</span>)
<span class="kw">for</span> h <span class="kw">in</span> <span class="fn">range</span>(H):
    <span class="fn">print</span>(<span class="fn">f</span><span class="str">"  {h+1}   {mimo_mse[h]:.3f}   {rec_mse[h]:.3f}"</span>)</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Eğitim Tarifi ve Değerlendirme</h2>
<p class="l-text">Kayıp, standartlaştırılmış hedef üzerinde MSE'dir. Optimize edici, plato üzerinde-azaltma ile 1e-3'te Adam. Doğrulama ayrımı kuyruktur (asla rastgele) — geleceği sızdırmamak için. Ters standartlaştırmadan sonra orijinal birimlerde MAE ve sMAPE rapor edin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.neural_network <span class="kw">import</span> MLPRegressor
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> mean_absolute_error

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
mu, sd = z.<span class="fn">mean</span>(), z.<span class="fn">std</span>()
zn = (z - mu) / sd
L, H = <span class="num">20</span>, <span class="num">3</span>
X = np.<span class="fn">stack</span>([zn[i:i+L] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(zn) - L - H)])
Y = np.<span class="fn">stack</span>([zn[i+L:i+L+H] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(zn) - L - H)])

cut = <span class="fn">int</span>(<span class="fn">len</span>(X) * <span class="num">0.8</span>)
mdl = <span class="fn">MLPRegressor</span>(hidden_layer_sizes=(<span class="num">32</span>, <span class="num">16</span>), max_iter=<span class="num">300</span>,
                   random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[:cut], Y[:cut])
pred = mdl.<span class="fn">predict</span>(X[cut:])
mae_units = <span class="fn">mean_absolute_error</span>(Y[cut:] * sd + mu, pred * sd + mu)
<span class="fn">print</span>(<span class="str">"val MAE (currency units):"</span>, <span class="fn">round</span>(<span class="fn">float</span>(mae_units), <span class="num">3</span>))</code></pre></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Derin Öğrenme Ne Zaman Kazanır (ve Ne Zaman Kaybeder)</h2>
<p class="l-text">Makridakis tarafından 2022 M5 tarzı bir denetim, derin ağların ETS'yi yalnızca veri kümesi <em>birçok ilişkili</em> seriye sahip olduğunda yendiğini gösterdi. Tek-seri tek değişkenli bir problemde, naif mevsimsel ve ETS hâlâ üçte ikisinin maliyetinin küçük bir kısmında kazanır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DL kazanır</div><div class="card-body">100+ ilişkili seri, dışsal özellikler, uzun ufuk, rejim kaymaları.</div></div>
<div class="calc-card"><div class="card-title">DL berabere</div><div class="card-body">Orta katalog (10-100 seri), orta mevsimsellik.</div></div>
<div class="calc-card"><div class="card-title">DL kaybeder</div><div class="card-body">Tek kısa seri, güçlü bilinen mevsimsellik, ortak değişken yok.</div></div>
<div class="calc-card"><div class="card-title">Daima</div><div class="card-body">Naif mevsimsele karşı karşılaştır — yenemiyorsan, ağ dağıtma.</div></div>
</div>
<div class="calc-highlight">Sonraki iki ders (N-BEATS, Transformer'lar) tavanı daha da yükseltir — ama yalnızca onları beslemek için verin varsa.</div>
</div>
`
};
