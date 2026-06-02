window.TIMESERIES_L8 = {

en: `<p class="l-text"><strong>For four years the time-series Transformer was a punchline.</strong> Every six months a new variant — Informer, Autoformer, FEDformer — claimed to beat the linear baseline, and every six months Zeng et al. (2022) showed that a one-line MLP could match or beat them. Then PatchTST and iTransformer landed in 2023 with two surprisingly simple ideas — channel-independent patching and inverted attention — and the leaderboard finally moved.</p>

<p class="l-text">In this lesson you trace the evolution: TFT (Lim 2021) for interpretable multi-horizon, Autoformer (Wu 2021) for trend-seasonality decomposition, PatchTST (Nie 2023) for the patch revolution, iTransformer (Liu 2023) for the channel inversion. We implement the patching and the attention by hand on patches of <code>df_stocks</code>.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Trace the four-generation evolution from Informer to iTransformer</li>
<li>Build TFT's variable-selection-network conceptually and read its attention map</li>
<li>Implement PatchTST patching and self-attention by hand in NumPy</li>
<li>Explain why iTransformer's inversion (treat each variable as a token) works</li>
<li>Decide when a Transformer beats N-HITS — and when it loses to a linear baseline</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Time-Series Transformers Are Hard</h2>
<p class="l-text">Vanilla self-attention is O(L^2) in lookback length. A 720-step horizon with a 1440-step lookback blows past 2M attention scores per layer. Worse, time series are usually low-rank and noisy, so attention overfits to spurious lags.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Quadratic cost</div><div class="card-body">L=2048 means 4M attention entries per head. Need sparse, local, or kernelized attention.</div></div>
<div class="calc-card"><div class="card-title">Permutation invariance</div><div class="card-body">Attention has no innate notion of order. Position encoding must carry the time signal.</div></div>
<div class="calc-card"><div class="card-title">Channel mixing</div><div class="card-body">Multivariate series — should attention mix across channels every step? Often hurts.</div></div>
<div class="calc-card"><div class="card-title">Distribution shift</div><div class="card-body">Train mean ≠ test mean. RevIN normalization fixes most of it.</div></div>
</div>
<div class="calc-highlight">Each Transformer generation answers one of these in a different way — and the simplest answers usually win.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. TFT — Temporal Fusion Transformer (Lim 2021)</h2>
<p class="l-text">TFT was the first transformer-style model to ship in production at scale (Google). It mixes LSTM encoders with attention and adds a Variable Selection Network that gates each input feature per timestep.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Variable selection</div><div class="card-body">Per-step softmax over input features. Gives feature-importance bars for free.</div></div>
<div class="calc-card"><div class="card-title">LSTM encoder/decoder</div><div class="card-body">Captures local order before attention smooths the long-range view.</div></div>
<div class="calc-card"><div class="card-title">Multi-head attention</div><div class="card-body">Aggregated across heads → interpretable temporal importance map.</div></div>
<div class="calc-card"><div class="card-title">Quantile loss</div><div class="card-body">Predicts P10/P50/P90 jointly — covered in lesson 9.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> neuralforecast <span class="kw">import</span> NeuralForecast
<span class="kw">from</span> neuralforecast.models <span class="kw">import</span> TFT

m = <span class="fn">TFT</span>(h=<span class="num">14</span>, input_size=<span class="num">60</span>,
        hidden_size=<span class="num">64</span>, n_head=<span class="num">4</span>,
        loss=<span class="str">"quantile"</span>, max_steps=<span class="num">800</span>)
nf = <span class="fn">NeuralForecast</span>(models=[m], freq=<span class="str">"D"</span>)
nf.<span class="fn">fit</span>(long_df)
fcst = nf.<span class="fn">predict</span>()
<span class="cm"># attention weights live on m.tft_attention</span></code></pre></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Autoformer — Decomposition Inside the Block (Wu 2021)</h2>
<p class="l-text">Autoformer puts a moving-average trend extractor <em>before every attention layer</em>. Attention only sees the seasonal residual; the trend is added back at the end. This is the classical STL idea baked into a Transformer.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
window = close[-<span class="num">60</span>:]

<span class="cm"># Series decomposition block from Autoformer</span>
k = <span class="num">9</span>                                       <span class="cm"># moving-avg kernel</span>
pad = np.<span class="fn">concatenate</span>([np.<span class="fn">full</span>(k//<span class="num">2</span>, window[<span class="num">0</span>]),
                      window,
                      np.<span class="fn">full</span>(k//<span class="num">2</span>, window[-<span class="num">1</span>])])
trend = np.<span class="fn">convolve</span>(pad, np.<span class="fn">ones</span>(k)/k, mode=<span class="str">"valid"</span>)
seasonal = window - trend
<span class="fn">print</span>(<span class="str">"trend var:"</span>, trend.<span class="fn">var</span>().<span class="fn">round</span>(<span class="num">3</span>),
      <span class="str">"seasonal var:"</span>, seasonal.<span class="fn">var</span>().<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text">Inside Autoformer the seasonal part feeds Auto-Correlation (a discrete-Fourier-transform-based replacement for self-attention) while the trend is forecast linearly.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The Linear Baseline That Embarrassed Everyone</h2>
<p class="l-text">Zeng et al. (NeurIPS 2022, "Are Transformers Effective for Time Series Forecasting?") trained a single Linear layer mapping lookback to horizon and matched or beat Informer, Autoformer, and FEDformer on every benchmark.</p>
<div class="calc-highlight">DLinear: decompose into trend + seasonal, fit one Linear per component, sum. 100 lines of code, beats six papers.</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
z = (z - z.<span class="fn">mean</span>()) / z.<span class="fn">std</span>()
L, H = <span class="num">60</span>, <span class="num">14</span>
X = np.<span class="fn">stack</span>([z[i:i+L]    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z)-L-H)])
Y = np.<span class="fn">stack</span>([z[i+L:i+L+H] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z)-L-H)])
cut = <span class="fn">int</span>(<span class="fn">len</span>(X) * <span class="num">0.8</span>)
mdl = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X[:cut], Y[:cut])
mse = ((mdl.<span class="fn">predict</span>(X[cut:]) - Y[cut:])**<span class="num">2</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">"linear baseline MSE:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(mse), <span class="num">4</span>))</code></pre></div>
<p class="l-text">Beating this with attention is the bar PatchTST and iTransformer had to clear.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. PatchTST — Tokens Are Patches, Not Steps (Nie 2023)</h2>
<p class="l-text">Two clean ideas:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Patching</div><div class="card-body">Slice the lookback into non-overlapping patches of length P (e.g. 16). Each patch is one token.</div></div>
<div class="calc-card"><div class="card-title">Channel-independent</div><div class="card-body">Process each variable as its own univariate sequence — share the encoder weights.</div></div>
<div class="calc-card"><div class="card-title">RevIN</div><div class="card-body">Reversible instance normalization: per-window mean/std, restored at the output.</div></div>
<div class="calc-card"><div class="card-title">Linear head</div><div class="card-body">Concatenate patch outputs, project to horizon. No fancy decoder.</div></div>
</div>
<div class="calc-highlight">Patching cuts L from 720 to 45. Quadratic attention becomes affordable, and each token represents a meaningful local window instead of a single noisy point.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. PatchTST Patching — By Hand</h2>
<p class="l-text">Lookback 64, patch length 16 → 4 tokens. Each token is a 16-dim vector. We compute a single self-attention head on these 4 tokens.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Patch the last 64 closes into 4 patches of 16. Project to Q/K/V with random matrices, run scaled-dot-product attention, and inspect the 4x4 attention map.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">7</span>)

z = df_stocks[<span class="str">"Close"</span>].values[-<span class="num">64</span>:].<span class="fn">astype</span>(<span class="str">"float32"</span>)
z = (z - z.<span class="fn">mean</span>()) / z.<span class="fn">std</span>()           <span class="cm"># RevIN-style</span>

P = <span class="num">16</span>; N = <span class="fn">len</span>(z) // P                 <span class="cm"># 4 patches</span>
patches = z.<span class="fn">reshape</span>(N, P)                  <span class="cm"># 4 x 16 tokens</span>
d = <span class="num">8</span>                                       <span class="cm"># head dim</span>

Wq = np.random.<span class="fn">randn</span>(P, d) * <span class="num">0.1</span>
Wk = np.random.<span class="fn">randn</span>(P, d) * <span class="num">0.1</span>
Wv = np.random.<span class="fn">randn</span>(P, d) * <span class="num">0.1</span>
Q = patches @ Wq; K = patches @ Wk; V = patches @ Wv

scores = Q @ K.T / np.<span class="fn">sqrt</span>(d)
attn = np.<span class="fn">exp</span>(scores - scores.<span class="fn">max</span>(<span class="num">1</span>, keepdims=<span class="kw">True</span>))
attn = attn / attn.<span class="fn">sum</span>(<span class="num">1</span>, keepdims=<span class="kw">True</span>)
ctx = attn @ V
<span class="fn">print</span>(<span class="str">"patches:"</span>, patches.shape, <span class="str">"  ctx:"</span>, ctx.shape)
<span class="fn">print</span>(<span class="str">"attention map (4x4):"</span>)
<span class="fn">print</span>(attn.<span class="fn">round</span>(<span class="num">2</span>))</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. iTransformer — Just Invert the Tokens (Liu 2023)</h2>
<p class="l-text">iTransformer's insight is even simpler than PatchTST's: do not tokenize time, tokenize <em>variables</em>. Each variable becomes a single token whose embedding is the entire lookback. Self-attention then learns inter-variable correlations directly. Position encoding becomes optional because there is no longer a temporal axis at the token level.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Token = variable</div><div class="card-body">N variables → N tokens. Embedding = MLP(lookback for that variable).</div></div>
<div class="calc-card"><div class="card-title">Attention = correlation</div><div class="card-body">Inter-variable dependencies replace inter-time dependencies.</div></div>
<div class="calc-card"><div class="card-title">FFN = temporal</div><div class="card-body">The pointwise MLP across the embedding axis acts as the temporal model.</div></div>
<div class="calc-card"><div class="card-title">SOTA on M5/Solar</div><div class="card-body">Beats PatchTST on multivariate benchmarks at similar cost.</div></div>
</div>
<div class="calc-highlight">iTransformer is a one-page implementation that flips a sign in the reshape — and currently sits at or near the top of every multivariate leaderboard.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Long-Horizon Benchmarking</h2>
<p class="l-text">Standard horizons are 96, 192, 336, 720 on ETT, Weather, Electricity, Traffic. Always report all four — a model that wins at 96 may lose at 720.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
z = (z - z.<span class="fn">mean</span>()) / z.<span class="fn">std</span>()
L = <span class="num">96</span>
horizons = [<span class="num">5</span>, <span class="num">14</span>, <span class="num">30</span>, <span class="num">60</span>]
results = {}
<span class="kw">for</span> H <span class="kw">in</span> horizons:
    n = <span class="fn">len</span>(z) - L - H
    X = np.<span class="fn">stack</span>([z[i:i+L]    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n)])
    Y = np.<span class="fn">stack</span>([z[i+L:i+L+H] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n)])
    cut = <span class="fn">int</span>(n * <span class="num">0.8</span>)
    mdl = <span class="fn">Ridge</span>(alpha=<span class="num">1.0</span>).<span class="fn">fit</span>(X[:cut], Y[:cut])
    mse = ((mdl.<span class="fn">predict</span>(X[cut:]) - Y[cut:])**<span class="num">2</span>).<span class="fn">mean</span>()
    results[H] = <span class="fn">round</span>(<span class="fn">float</span>(mse), <span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"horizon → MSE:"</span>, results)</code></pre></div>
<p class="l-text">Notice MSE rises monotonically with H — the irreducible noise grows. Ranking models by win-rate across horizons is more robust than reporting a single number.</p>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Time-Series Foundation Models</h2>
<p class="l-text"><strong>The time-series field finally got its foundation-model moment in 2024.</strong> Following the Chronos / TimeGPT / MOIRAI v1 trio of late 2023, five new pretrained forecasters shipped in a single year — and three of them (TimesFM, Lag-Llama, Time-MoE) are open-weight. The cards below are the shortlist you should actually try as zero-shot baselines before you train anything custom. Pretrain on billions of time points, predict your horizon, no per-series fitting required.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">TimesFM (Google, Feb 2024)</div><div class="card-body">200M decoder-only Transformer, pre-trained on 100B real-world time points (Google Trends, Wiki pageviews, synthetic). Patch-based input, autoregressive output. Strong zero-shot on Monash and ETT benchmarks; open weights on HuggingFace.</div></div>
<div class="calc-card"><div class="card-title">Lag-Llama (ServiceNow, Feb 2024)</div><div class="card-body">200M decoder-only, probabilistic forecasting via student-t output. Input is only lag features (no calendar covariates by default) — radically simple. Pretrained on 27 diverse public datasets; the first truly open foundation forecaster.</div></div>
<div class="calc-card"><div class="card-title">Time-MoE (2024-10)</div><div class="card-body">Mixture-of-experts architecture for time series, scales to 2.4B parameters with sparse activation. Decoder-only with point and probabilistic heads. Beats TimesFM on long-horizon when sufficient context is available.</div></div>
<div class="calc-card"><div class="card-title">MOIRAI v2 (Salesforce, 2024)</div><div class="card-body">Unified universal forecaster — single model handles any frequency (hourly, daily, monthly) and any number of variates via masked-encoder Transformer. v2 adds longer context and better probabilistic output. Open weights, three sizes (small/base/large).</div></div>
<div class="calc-card"><div class="card-title">Chronos-T5 (Amazon, Mar 2024)</div><div class="card-body">Tokenize numeric values into a fixed vocabulary, then fine-tune T5 to predict next tokens. Five sizes from tiny (8M) to large (710M). Surprisingly strong zero-shot; the model that proved "time-series-as-text" actually works.</div></div>
<div class="calc-card"><div class="card-title">TimeGPT-1 (Nixtla, late 2023)</div><div class="card-body">Closed-API foundation forecaster, very fast inference, calibrated uncertainty intervals. The commercial baseline to beat — useful as a sanity check even when you ship open weights in production.</div></div>
</div>
<div class="calc-highlight"><strong>How to choose:</strong> start with Chronos-Bolt or TimesFM as a zero-shot baseline (no fitting, two lines of code). Move to MOIRAI v2 for multi-frequency multi-variate inventory forecasting. Pick Lag-Llama when you want probabilistic forecasts with minimal feature engineering. Time-MoE is the heavy-hitter when you have long context and need state-of-the-art accuracy. TimeGPT-1 stays useful as a no-infra commercial fallback.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Picking a Transformer (or Not)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Univariate, short H</div><div class="card-body">DLinear or N-BEATS. Transformer is overkill.</div></div>
<div class="calc-card"><div class="card-title">Multivariate, long H</div><div class="card-body">PatchTST or iTransformer.</div></div>
<div class="calc-card"><div class="card-title">Need explanations</div><div class="card-body">TFT — variable selection + attention map.</div></div>
<div class="calc-card"><div class="card-title">Strong seasonality</div><div class="card-body">Autoformer's decomposition front-end helps.</div></div>
<div class="calc-card"><div class="card-title">Tiny dataset</div><div class="card-body">Anything but a Transformer. Statistical model wins.</div></div>
<div class="calc-card"><div class="card-title">Foundation model</div><div class="card-body">TimeGPT, Chronos, MOIRAI — zero-shot strong baselines (2024).</div></div>
</div>
<div class="calc-highlight">Always benchmark your Transformer against the linear baseline from section 4. If you cannot beat it, do not deploy it.</div>
</div>
`,
tr: `<p class="l-text"><strong>Dört yıl boyunca zaman serisi Transformer'ı bir alay konusuydu.</strong> Her altı ayda bir yeni bir varyant — Informer, Autoformer, FEDformer — doğrusal referansı yenmeyi iddia etti, ve her altı ayda Zeng ve diğerleri (2022) tek satırlık bir MLP'nin bunlarla eşleşebileceğini veya yenebileceğini gösterdi. Sonra 2023'te PatchTST ve iTransformer şaşırtıcı derecede basit iki fikirle indi — kanal-bağımsız patching ve ters dikkat — ve lider tablo sonunda hareket etti.</p>

<p class="l-text">Bu derste evrimi izlersin: yorumlanabilir çok ufuklu için TFT (Lim 2021), trend-mevsimsellik ayrıştırması için Autoformer (Wu 2021), patch devrimi için PatchTST (Nie 2023), kanal tersine çevirme için iTransformer (Liu 2023). Patching ve dikkati <code>df_stocks</code>'un patch'leri üzerinde elle uyguluyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Informer'dan iTransformer'a dört nesillik evrimi izle</li>
<li>TFT'nin değişken-seçim-ağını kavramsal olarak inşa et ve dikkat haritasını oku</li>
<li>NumPy'da PatchTST patching'ini ve öz-dikkati elle uygula</li>
<li>iTransformer'ın tersine çevirmesinin (her değişkeni token olarak ele alma) neden çalıştığını açıkla</li>
<li>Bir Transformer'ın N-HITS'i ne zaman yendiğine — ve doğrusal referansa ne zaman kaybettiğine — karar ver</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Zaman Serisi Transformer'ları Neden Zordur</h2>
<p class="l-text">Vanilla öz-dikkat geriye bakma uzunluğunda O(L^2)'dir. 1440 adımlık bir geriye bakma ile 720 adımlık ufuk, katman başına 2M dikkat puanını aşar. Daha kötüsü, zaman serileri genellikle düşük dereceli ve gürültülüdür, bu yüzden dikkat sahte gecikmelere aşırı uyum yapar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Karesel maliyet</div><div class="card-body">L=2048 her kafa için 4M dikkat girişi demektir. Seyrek, yerel veya çekirdek tabanlı dikkat gerekir.</div></div>
<div class="calc-card"><div class="card-title">Permütasyon değişmezliği</div><div class="card-body">Dikkatin doğuştan sıra kavramı yoktur. Konum kodlamasının zaman sinyalini taşıması gerekir.</div></div>
<div class="calc-card"><div class="card-title">Kanal karıştırma</div><div class="card-body">Çok değişkenli seriler — dikkat her adımda kanallar arasında karıştırmalı mı? Genellikle zarar verir.</div></div>
<div class="calc-card"><div class="card-title">Dağılım kayması</div><div class="card-body">Eğitim ortalaması ≠ test ortalaması. RevIN normalleştirmesi çoğunu düzeltir.</div></div>
</div>
<div class="calc-highlight">Her Transformer nesli bunlardan birine farklı bir şekilde yanıt verir — ve en basit yanıtlar genellikle kazanır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. TFT — Temporal Fusion Transformer (Lim 2021)</h2>
<p class="l-text">TFT, ölçekli üretimde gönderilen ilk transformer tarzı modeldi (Google). LSTM kodlayıcılarını dikkatle karıştırır ve her zaman damgasında her giriş özelliğini kapayan bir Değişken Seçim Ağı ekler.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Değişken seçimi</div><div class="card-body">Giriş özellikleri üzerinde adım başına softmax. Bedava özellik-önemi çubukları verir.</div></div>
<div class="calc-card"><div class="card-title">LSTM kodlayıcı/kod çözücü</div><div class="card-body">Dikkat uzun menzilli görüşü düzgünleştirmeden önce yerel sırayı yakalar.</div></div>
<div class="calc-card"><div class="card-title">Çok kafalı dikkat</div><div class="card-body">Kafalar arasında toplanmış → yorumlanabilir zamansal önem haritası.</div></div>
<div class="calc-card"><div class="card-title">Kuantil kaybı</div><div class="card-body">P10/P50/P90'ı ortak tahmin eder — ders 9'da kapsanmıştır.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> neuralforecast <span class="kw">import</span> NeuralForecast
<span class="kw">from</span> neuralforecast.models <span class="kw">import</span> TFT

m = <span class="fn">TFT</span>(h=<span class="num">14</span>, input_size=<span class="num">60</span>,
        hidden_size=<span class="num">64</span>, n_head=<span class="num">4</span>,
        loss=<span class="str">"quantile"</span>, max_steps=<span class="num">800</span>)
nf = <span class="fn">NeuralForecast</span>(models=[m], freq=<span class="str">"D"</span>)
nf.<span class="fn">fit</span>(long_df)
fcst = nf.<span class="fn">predict</span>()
<span class="cm"># dikkat ağırlıkları m.tft_attention'da yaşar</span></code></pre></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Autoformer — Blok İçinde Ayrıştırma (Wu 2021)</h2>
<p class="l-text">Autoformer her dikkat katmanından önce <em>her dikkat katmanından önce</em> bir hareketli ortalama trend çıkarıcısı yerleştirir. Dikkat yalnızca mevsimsel artığı görür; trend sonunda geri eklenir. Bu, klasik STL fikrinin bir Transformer'a yedirilmiş halidir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
window = close[-<span class="num">60</span>:]

<span class="cm"># Autoformer'dan seri ayrıştırma bloğu</span>
k = <span class="num">9</span>                                       <span class="cm"># hareketli ortalama çekirdeği</span>
pad = np.<span class="fn">concatenate</span>([np.<span class="fn">full</span>(k//<span class="num">2</span>, window[<span class="num">0</span>]),
                      window,
                      np.<span class="fn">full</span>(k//<span class="num">2</span>, window[-<span class="num">1</span>])])
trend = np.<span class="fn">convolve</span>(pad, np.<span class="fn">ones</span>(k)/k, mode=<span class="str">"valid"</span>)
seasonal = window - trend
<span class="fn">print</span>(<span class="str">"trend var:"</span>, trend.<span class="fn">var</span>().<span class="fn">round</span>(<span class="num">3</span>),
      <span class="str">"seasonal var:"</span>, seasonal.<span class="fn">var</span>().<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text">Autoformer'ın içinde mevsimsel kısım Auto-Correlation'ı (öz-dikkat için ayrık-Fourier-dönüşümü tabanlı bir yedek) besler, trend ise doğrusal olarak tahmin edilir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Herkesi Mahcup Eden Doğrusal Referans</h2>
<p class="l-text">Zeng ve diğerleri (NeurIPS 2022, "Are Transformers Effective for Time Series Forecasting?"), geriye bakmayı ufka eşleyen tek bir Linear katmanı eğitti ve her referansta Informer, Autoformer ve FEDformer ile eşleşti veya yendi.</p>
<div class="calc-highlight">DLinear: trend + mevsimsel olarak ayrıştır, bileşen başına bir Linear uydur, topla. 100 satır kod, altı makaleyi yener.</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
z = (z - z.<span class="fn">mean</span>()) / z.<span class="fn">std</span>()
L, H = <span class="num">60</span>, <span class="num">14</span>
X = np.<span class="fn">stack</span>([z[i:i+L]    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z)-L-H)])
Y = np.<span class="fn">stack</span>([z[i+L:i+L+H] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z)-L-H)])
cut = <span class="fn">int</span>(<span class="fn">len</span>(X) * <span class="num">0.8</span>)
mdl = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X[:cut], Y[:cut])
mse = ((mdl.<span class="fn">predict</span>(X[cut:]) - Y[cut:])**<span class="num">2</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">"linear baseline MSE:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(mse), <span class="num">4</span>))</code></pre></div>
<p class="l-text">Bunu dikkatle yenmek, PatchTST ve iTransformer'ın aşması gereken bardı.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. PatchTST — Token'lar Patch'lerdir, Adımlar Değil (Nie 2023)</h2>
<p class="l-text">İki temiz fikir:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Patching</div><div class="card-body">Geriye bakmayı P (örneğin 16) uzunluğunda örtüşmeyen patch'lere böl. Her patch bir token'dır.</div></div>
<div class="calc-card"><div class="card-title">Kanal-bağımsız</div><div class="card-body">Her değişkeni kendi tek değişkenli dizisi olarak işle — kodlayıcı ağırlıklarını paylaş.</div></div>
<div class="calc-card"><div class="card-title">RevIN</div><div class="card-body">Tersinir örnek normalleştirmesi: pencere başına ortalama/std, çıkışta geri yüklenir.</div></div>
<div class="calc-card"><div class="card-title">Doğrusal kafa</div><div class="card-body">Patch çıkışlarını birleştir, ufka projekte et. Süslü kod çözücü yok.</div></div>
</div>
<div class="calc-highlight">Patching L'yi 720'den 45'e keser. Karesel dikkat erişilebilir hale gelir ve her token tek bir gürültülü nokta yerine anlamlı bir yerel pencereyi temsil eder.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. PatchTST Patching — Elle</h2>
<p class="l-text">Geriye bakma 64, patch uzunluğu 16 → 4 token. Her token 16 boyutlu bir vektördür. Bu 4 token üzerinde tek bir öz-dikkat kafası hesaplıyoruz.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Son 64 kapanışı 16'lık 4 patch'e böl. Rastgele matrislerle Q/K/V'ye projekte et, ölçekli-nokta-çarpım dikkati çalıştır ve 4x4 dikkat haritasını incele.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">7</span>)

z = df_stocks[<span class="str">"Close"</span>].values[-<span class="num">64</span>:].<span class="fn">astype</span>(<span class="str">"float32"</span>)
z = (z - z.<span class="fn">mean</span>()) / z.<span class="fn">std</span>()           <span class="cm"># RevIN tarzı</span>

P = <span class="num">16</span>; N = <span class="fn">len</span>(z) // P                 <span class="cm"># 4 patch</span>
patches = z.<span class="fn">reshape</span>(N, P)                  <span class="cm"># 4 x 16 token</span>
d = <span class="num">8</span>                                       <span class="cm"># kafa boyutu</span>

Wq = np.random.<span class="fn">randn</span>(P, d) * <span class="num">0.1</span>
Wk = np.random.<span class="fn">randn</span>(P, d) * <span class="num">0.1</span>
Wv = np.random.<span class="fn">randn</span>(P, d) * <span class="num">0.1</span>
Q = patches @ Wq; K = patches @ Wk; V = patches @ Wv

scores = Q @ K.T / np.<span class="fn">sqrt</span>(d)
attn = np.<span class="fn">exp</span>(scores - scores.<span class="fn">max</span>(<span class="num">1</span>, keepdims=<span class="kw">True</span>))
attn = attn / attn.<span class="fn">sum</span>(<span class="num">1</span>, keepdims=<span class="kw">True</span>)
ctx = attn @ V
<span class="fn">print</span>(<span class="str">"patches:"</span>, patches.shape, <span class="str">"  ctx:"</span>, ctx.shape)
<span class="fn">print</span>(<span class="str">"attention map (4x4):"</span>)
<span class="fn">print</span>(attn.<span class="fn">round</span>(<span class="num">2</span>))</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. iTransformer — Sadece Token'ları Tersine Çevir (Liu 2023)</h2>
<p class="l-text">iTransformer'ın içgörüsü PatchTST'ninkinden bile daha basittir: zamanı belirteçleştirme, <em>değişkenleri</em> belirteçleştir. Her değişken, gömüsü tüm geriye bakma olan tek bir token olur. Öz-dikkat sonra değişkenler arası korelasyonları doğrudan öğrenir. Token seviyesinde artık zamansal eksen olmadığı için konum kodlaması isteğe bağlı hale gelir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Token = değişken</div><div class="card-body">N değişken → N token. Gömü = MLP(o değişken için geriye bakma).</div></div>
<div class="calc-card"><div class="card-title">Dikkat = korelasyon</div><div class="card-body">Değişkenler arası bağımlılıklar zamanlar arası bağımlılıkların yerini alır.</div></div>
<div class="calc-card"><div class="card-title">FFN = zamansal</div><div class="card-body">Gömü ekseninde noktasal MLP zamansal model olarak hareket eder.</div></div>
<div class="calc-card"><div class="card-title">M5/Solar'da SOTA</div><div class="card-body">Çok değişkenli referanslarda PatchTST'yi benzer maliyette yener.</div></div>
</div>
<div class="calc-highlight">iTransformer, reshape'te bir işareti çeviren bir sayfalık bir uygulamadır — ve şu anda her çok değişkenli lider tablosunun tepesinde veya yakınında oturuyor.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Uzun Ufuk Kıyaslaması</h2>
<p class="l-text">Standart ufuklar ETT, Weather, Electricity, Traffic'te 96, 192, 336, 720'dir. Daima dördünü de rapor edin — 96'da kazanan bir model 720'de kaybedebilir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
z = (z - z.<span class="fn">mean</span>()) / z.<span class="fn">std</span>()
L = <span class="num">96</span>
horizons = [<span class="num">5</span>, <span class="num">14</span>, <span class="num">30</span>, <span class="num">60</span>]
results = {}
<span class="kw">for</span> H <span class="kw">in</span> horizons:
    n = <span class="fn">len</span>(z) - L - H
    X = np.<span class="fn">stack</span>([z[i:i+L]    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n)])
    Y = np.<span class="fn">stack</span>([z[i+L:i+L+H] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n)])
    cut = <span class="fn">int</span>(n * <span class="num">0.8</span>)
    mdl = <span class="fn">Ridge</span>(alpha=<span class="num">1.0</span>).<span class="fn">fit</span>(X[:cut], Y[:cut])
    mse = ((mdl.<span class="fn">predict</span>(X[cut:]) - Y[cut:])**<span class="num">2</span>).<span class="fn">mean</span>()
    results[H] = <span class="fn">round</span>(<span class="fn">float</span>(mse), <span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"horizon → MSE:"</span>, results)</code></pre></div>
<p class="l-text">MSE'nin H ile monoton arttığına dikkat edin — indirgenemez gürültü büyür. Modelleri ufuklar arasında kazanma oranıyla sıralamak, tek bir sayı raporlamaktan daha sağlamdır.</p>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Zaman Serisi Sınır Modelleri</h2>
<p class="l-text"><strong>Zaman serisi alanı nihayet 2024'te foundation-model anını yaşadı.</strong> 2023 sonu Chronos / TimeGPT / MOIRAI v1 üçlüsünün ardından, bir yıl içinde beş yeni önceden-eğitilmiş tahmin modeli çıktı — ve üçü (TimesFM, Lag-Llama, Time-MoE) açık-ağırlık. Aşağıdaki kartlar, özel bir şey eğitmeden önce zero-shot referans olarak gerçekten denemeniz gereken kısa listedir. Milyarlarca zaman noktası üzerinde önceden eğitin, ufkunuzu tahmin edin, seri başına uydurma gerekmez.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">TimesFM (Google, Şub 2024)</div><div class="card-body">200M yalnızca-decoder Transformer, 100B gerçek dünya zaman noktası üzerinde önceden eğitildi (Google Trends, Wiki sayfa görüntülemeleri, sentetik). Patch tabanlı girdi, otoregresif çıktı. Monash ve ETT kıyaslamalarında güçlü zero-shot; HuggingFace'te açık ağırlıklar.</div></div>
<div class="calc-card"><div class="card-title">Lag-Llama (ServiceNow, Şub 2024)</div><div class="card-body">200M yalnızca-decoder, student-t çıktısıyla olasılıksal tahmin. Girdi yalnızca gecikme özellikleri (varsayılan olarak takvim ortak değişkenleri yok) — radikal biçimde basit. 27 çeşitli kamu veri setinde önceden eğitildi; gerçekten ilk açık foundation tahminci.</div></div>
<div class="calc-card"><div class="card-title">Time-MoE (2024-10)</div><div class="card-body">Zaman serisi için uzman karışımı mimarisi, seyrek aktivasyonla 2.4B parametreye ölçeklenir. Yalnızca-decoder, nokta ve olasılıksal başlıklar. Yeterli bağlam mevcut olduğunda uzun ufukta TimesFM'i yener.</div></div>
<div class="calc-card"><div class="card-title">MOIRAI v2 (Salesforce, 2024)</div><div class="card-body">Birleşik evrensel tahminci — tek model herhangi bir frekansı (saatlik, günlük, aylık) ve herhangi sayıda değişkeni maskelenmiş-encoder Transformer ile işler. v2 daha uzun bağlam ve daha iyi olasılıksal çıktı ekler. Açık ağırlıklar, üç boyut (küçük/temel/büyük).</div></div>
<div class="calc-card"><div class="card-title">Chronos-T5 (Amazon, Mar 2024)</div><div class="card-body">Sayısal değerleri sabit bir kelime dağarcığına tokenize et, sonra T5'i sonraki token'ları tahmin etmek için ince ayar yap. Beş boyut: tiny (8M) ile large (710M) arası. Şaşırtıcı biçimde güçlü zero-shot; "zaman-serisi-olarak-metin"in gerçekten işe yaradığını kanıtlayan model.</div></div>
<div class="calc-card"><div class="card-title">TimeGPT-1 (Nixtla, 2023 sonu)</div><div class="card-body">Kapalı-API foundation tahminci, çok hızlı çıkarım, kalibre edilmiş belirsizlik aralıkları. Yenilmesi gereken ticari referans — üretimde açık ağırlıklar sevk etseniz bile sağduyu kontrolü olarak yararlı.</div></div>
</div>
<div class="calc-highlight"><strong>Nasıl seçilir:</strong> zero-shot referans olarak Chronos-Bolt veya TimesFM ile başlayın (uydurma yok, iki satır kod). Çok-frekanslı çok-değişkenli envanter tahmini için MOIRAI v2'ye geçin. Minimal özellik mühendisliğiyle olasılıksal tahminler istediğinizde Lag-Llama'yı seçin. Uzun bağlamınız olduğunda ve en yüksek doğruluk gerektiğinde Time-MoE ağır vuran. TimeGPT-1, altyapısız ticari yedek olarak yararlı kalır.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Bir Transformer Seçmek (veya Seçmemek)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tek değişkenli, kısa H</div><div class="card-body">DLinear veya N-BEATS. Transformer aşırıya kaçar.</div></div>
<div class="calc-card"><div class="card-title">Çok değişkenli, uzun H</div><div class="card-body">PatchTST veya iTransformer.</div></div>
<div class="calc-card"><div class="card-title">Açıklama gerekli</div><div class="card-body">TFT — değişken seçimi + dikkat haritası.</div></div>
<div class="calc-card"><div class="card-title">Güçlü mevsimsellik</div><div class="card-body">Autoformer'ın ayrıştırma ön ucu yardımcı olur.</div></div>
<div class="calc-card"><div class="card-title">Küçük veri kümesi</div><div class="card-body">Transformer dışında her şey. İstatistiksel model kazanır.</div></div>
<div class="calc-card"><div class="card-title">Temel model</div><div class="card-body">TimeGPT, Chronos, MOIRAI — sıfır-atış güçlü referanslar (2024).</div></div>
</div>
<div class="calc-highlight">Transformer'ınızı daima 4. bölümdeki doğrusal referansa karşı kıyaslayın. Onu yenemiyorsanız, dağıtmayın.</div>
</div>
`
};
