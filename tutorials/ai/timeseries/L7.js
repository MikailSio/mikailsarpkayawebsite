window.TIMESERIES_L7 = {

en: `<p class="l-text"><strong>Deep learning forecasters were a black box until N-BEATS dropped.</strong> Oreshkin et al. (2019, Element AI) showed that a stack of fully-connected blocks, each emitting a basis decomposition (trend + seasonality + identity), could beat the M4 winner without any LSTM, attention, or hand-engineered feature. Three years later N-HITS extended the idea with hierarchical interpolation, beating long-horizon Transformers at one tenth of the cost.</p>

<p class="l-text">In this lesson you will dissect the N-BEATS block, derive the polynomial trend basis and the Fourier seasonality basis with NumPy on <code>df_stocks</code>, then see how N-HITS adds multi-rate sampling. We end with a tour of the <code>neuralforecast</code> library — the production-ready home for both models.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain backcast vs forecast and the doubly-residual stacking trick</li>
<li>Construct polynomial trend and Fourier seasonality bases by hand</li>
<li>Reproduce a one-block N-BEATS forecast with NumPy least squares</li>
<li>Distinguish generic blocks from interpretable blocks</li>
<li>Describe the multi-rate hierarchical interpolation in N-HITS</li>
<li>Use the neuralforecast API to fit both models on related series</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Big Idea — Stack of Residual MLPs</h2>
<p class="l-text">N-BEATS treats forecasting as basis fitting. Each block <em>b</em> takes the residual lookback signal, projects it through a small MLP, and outputs two coefficient vectors — one for backcast (reconstruction of the input window), one for forecast (the next horizon). The next block sees <em>input minus backcast</em>. Stacks add up the forecast contributions.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Backcast</div><div class="card-body">Block's reconstruction of the lookback window. Subtract from input → next block's input.</div></div>
<div class="calc-card"><div class="card-title">Forecast</div><div class="card-body">Block's contribution to the future. Sum across blocks to get final prediction.</div></div>
<div class="calc-card"><div class="card-title">Doubly residual</div><div class="card-body">Subtraction in backcast space, addition in forecast space. Stable and expressive.</div></div>
<div class="calc-card"><div class="card-title">No recurrence</div><div class="card-body">Pure feed-forward. Embarrassingly parallel — fits batch-100 in one GPU pass.</div></div>
</div>
<div class="calc-highlight">N-BEATS won M4 in 2019 with a generic configuration that knew nothing about the data. The interpretable variant came second and explained itself.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Block — Two MLPs, Two Heads</h2>
<p class="l-text">Inside one block: 4 dense layers with ReLU, then two linear heads producing coefficient vectors <span class="katex-block">$$\\theta^{b}, \\theta^{f} = \\text{Linear}(\\text{MLP}(x))$$</span> A fixed (or learned) basis matrix <em>V</em> maps coefficients to time-domain signals: backcast = <em>V_b</em> &middot; <em>theta_b</em>, forecast = <em>V_f</em> &middot; <em>theta_f</em>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> neuralforecast.models <span class="kw">import</span> NBEATS
<span class="kw">from</span> neuralforecast <span class="kw">import</span> NeuralForecast

model = <span class="fn">NBEATS</span>(input_size=<span class="num">30</span>, h=<span class="num">5</span>, stack_types=[<span class="str">"trend"</span>, <span class="str">"seasonality"</span>],
               n_blocks=[<span class="num">3</span>, <span class="num">3</span>], mlp_units=[[<span class="num">256</span>, <span class="num">256</span>]] * <span class="num">2</span>)
nf = <span class="fn">NeuralForecast</span>(models=[model], freq=<span class="str">"D"</span>)
nf.<span class="fn">fit</span>(df=train_df)
preds = nf.<span class="fn">predict</span>()</code></pre></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Polynomial Trend Basis — By Hand</h2>
<p class="l-text">The trend basis is a low-degree polynomial: <em>V_t = [1, t, t^2, t^3]</em>. Fitting it is just least squares — and that is exactly what one N-BEATS trend block converges to.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
window = close[-<span class="num">60</span>:]                <span class="cm"># last 60 days lookback</span>
t = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, <span class="fn">len</span>(window))
V = np.<span class="fn">stack</span>([t**k <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>)], axis=<span class="num">1</span>)   <span class="cm"># 60 x 4</span>
theta, *_ = np.linalg.<span class="fn">lstsq</span>(V, window, rcond=<span class="kw">None</span>)
backcast = V @ theta
<span class="fn">print</span>(<span class="str">"theta:"</span>, theta.<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"backcast MSE:"</span>, ((backcast - window)**<span class="num">2</span>).<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text">A 4-coefficient polynomial captures most of the slow drift. The residual goes to the next block.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Fourier Seasonality Basis — By Hand</h2>
<p class="l-text">The seasonality basis is a truncated Fourier series. For horizon length H you stack sin and cos at periods that divide H: <em>V_s = [cos(2 pi k t), sin(2 pi k t)]</em> for k = 1..K. The N-BEATS seasonality block learns the amplitudes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
resid = close[-<span class="num">60</span>:] - close[-<span class="num">60</span>:].<span class="fn">mean</span>()
N = <span class="fn">len</span>(resid); K = <span class="num">4</span>
t = np.<span class="fn">arange</span>(N) / N

V = np.<span class="fn">column_stack</span>([np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*k*t) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>)] +
                    [np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*k*t) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>)])
theta, *_ = np.linalg.<span class="fn">lstsq</span>(V, resid, rcond=<span class="kw">None</span>)
fit = V @ theta
<span class="fn">print</span>(<span class="str">"explained variance:"</span>, (<span class="num">1</span> - ((resid-fit)**<span class="num">2</span>).<span class="fn">sum</span>() / (resid**<span class="num">2</span>).<span class="fn">sum</span>()).<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"top harmonic:"</span>, <span class="fn">int</span>(np.<span class="fn">abs</span>(theta).<span class="fn">argmax</span>()) + <span class="num">1</span>)</code></pre></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. One Full Block — Trend + Seasonality + Forecast</h2>
<p class="l-text">Now we put both bases together: fit trend on the raw window, fit seasonality on the residual, then extrapolate each basis H steps into the future and sum.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Hand-built two-block N-BEATS: trend block then seasonality block on the residual. Forecast 5 days ahead and report MAE vs the held-out tail.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
L, H = <span class="num">60</span>, <span class="num">5</span>
window = close[-(L+H):-H]; truth = close[-H:]

<span class="cm"># --- Trend block ---</span>
t  = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>,    L)
tf = np.<span class="fn">linspace</span>(<span class="num">1</span>, <span class="num">1</span> + H/L, H)
Vb = np.<span class="fn">stack</span>([t**k  <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>)], axis=<span class="num">1</span>)
Vf = np.<span class="fn">stack</span>([tf**k <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>)], axis=<span class="num">1</span>)
theta_t, *_ = np.linalg.<span class="fn">lstsq</span>(Vb, window, rcond=<span class="kw">None</span>)
trend_back = Vb @ theta_t
trend_fore = Vf @ theta_t
resid = window - trend_back

<span class="cm"># --- Seasonality block on residual ---</span>
K = <span class="num">4</span>
Sb = np.<span class="fn">column_stack</span>([np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*k*t)  <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>)] +
                     [np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*k*t)  <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>)])
Sf = np.<span class="fn">column_stack</span>([np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*k*tf) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>)] +
                     [np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*k*tf) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>)])
theta_s, *_ = np.linalg.<span class="fn">lstsq</span>(Sb, resid, rcond=<span class="kw">None</span>)
seas_fore = Sf @ theta_s

forecast = trend_fore + seas_fore
mae = np.<span class="fn">abs</span>(forecast - truth).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">"forecast:"</span>, forecast.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"truth:   "</span>, truth.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"MAE:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(mae), <span class="num">3</span>))</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Generic vs Interpretable — Pick Your Basis</h2>
<p class="l-text">In the generic configuration the basis matrix <em>V</em> is itself learned (a final Linear layer with no constraint). It usually scores 1-2% better but tells you nothing. The interpretable variant fixes <em>V</em> to polynomial+Fourier so each block's <em>theta</em> is human-readable.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Generic</div><div class="card-body">Best raw accuracy. Black box. Use when you are scoring a leaderboard.</div></div>
<div class="calc-card"><div class="card-title">Interpretable</div><div class="card-body">Slightly worse but theta_trend = polynomial coeffs, theta_seas = harmonic amps.</div></div>
<div class="calc-card"><div class="card-title">Ensemble</div><div class="card-body">Authors averaged 18 random seeds. Critical to reproduce paper numbers.</div></div>
<div class="calc-card"><div class="card-title">Transferable</div><div class="card-body">A model trained on M4 generalizes to other domains zero-shot — N-BEATS-T (2021).</div></div>
</div>
<div class="calc-highlight">If your stakeholders want to know <em>why</em> the forecast went up, ship the interpretable variant — the trend coefficients are a story.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. N-HITS — Hierarchical Interpolation</h2>
<p class="l-text">Challu et al. (2023) noticed that long horizons explode parameter count. N-HITS solves it with multi-rate sampling: each stack pools the input at a different rate (e.g. 1, 4, 16) so different stacks attend to different frequency bands. The forecast is then interpolated up to the full horizon.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MaxPool input</div><div class="card-body">Stack i pools the lookback by factor k_i. High k = low frequency.</div></div>
<div class="calc-card"><div class="card-title">Small forecast</div><div class="card-body">Each stack predicts only n_h_i &lt; H points.</div></div>
<div class="calc-card"><div class="card-title">Interpolate up</div><div class="card-body">Linear / cubic interpolation to length H. Tiny matrices, huge horizons.</div></div>
<div class="calc-card"><div class="card-title">Result</div><div class="card-body">2-3x faster than N-BEATS on H=720 with comparable or better MAE.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Hierarchical Interpolation — Mini Demo</h2>
<p class="l-text">The forecast head emits 5 control points; we interpolate to 30 points for the final horizon. This is the core trick that lets N-HITS scale.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Take the last 30 closes, compress to 5 control points, then linearly upscale back to 30 — the data path inside one N-HITS block.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

H = <span class="num">30</span>
truth = df_stocks[<span class="str">"Close"</span>].values[-H:].<span class="fn">astype</span>(<span class="str">"float32"</span>)

<span class="cm"># Compress: average pool into 5 buckets (low-frequency control points)</span>
n_ctrl = <span class="num">5</span>
ctrl = truth.<span class="fn">reshape</span>(n_ctrl, H // n_ctrl).<span class="fn">mean</span>(axis=<span class="num">1</span>)

<span class="cm"># Interpolate back to length H</span>
xp = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, n_ctrl)
xq = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, H)
recon = np.<span class="fn">interp</span>(xq, xp, ctrl)

mae = np.<span class="fn">abs</span>(recon - truth).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">"control pts:"</span>, ctrl.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"params used: 5  /  output length:"</span>, H)
<span class="fn">print</span>(<span class="str">"MAE vs truth:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(mae), <span class="num">3</span>))</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. neuralforecast — The Production Library</h2>
<p class="l-text">The Nixtla team maintains <code>neuralforecast</code> as the canonical home for N-BEATS, N-HITS, TFT, PatchTST, iTransformer and a dozen others. It expects a long-format DataFrame: <code>unique_id</code>, <code>ds</code>, <code>y</code>. Once your data is in shape every model is one line.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> neuralforecast <span class="kw">import</span> NeuralForecast
<span class="kw">from</span> neuralforecast.models <span class="kw">import</span> NHITS, NBEATS

models = [<span class="fn">NHITS</span>(input_size=<span class="num">60</span>, h=<span class="num">14</span>, max_steps=<span class="num">500</span>),
          <span class="fn">NBEATS</span>(input_size=<span class="num">60</span>, h=<span class="num">14</span>, max_steps=<span class="num">500</span>)]
nf = <span class="fn">NeuralForecast</span>(models=models, freq=<span class="str">"D"</span>)
nf.<span class="fn">fit</span>(df=long_df)                 <span class="cm"># columns unique_id, ds, y</span>
fcst = nf.<span class="fn">predict</span>()
<span class="fn">print</span>(fcst.<span class="fn">head</span>())</code></pre></div>
<p class="l-text">Both models share the same fit/predict surface as classic <code>statsforecast</code>, so you can ensemble statistical and deep models in the same pipeline.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Choosing Between N-BEATS and N-HITS</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Short H (≤ 30)</div><div class="card-body">N-BEATS is simpler and just as accurate.</div></div>
<div class="calc-card"><div class="card-title">Long H (60-720)</div><div class="card-body">N-HITS dominates. Interpolation keeps params small.</div></div>
<div class="calc-card"><div class="card-title">Need explanations</div><div class="card-body">N-BEATS interpretable. N-HITS bands are less intuitive.</div></div>
<div class="calc-card"><div class="card-title">Many series</div><div class="card-body">Either, trained globally with shared weights.</div></div>
</div>
<div class="calc-highlight">When unsure, fit both and ensemble. Diversity in inductive bias is free accuracy.</div>
</div>
`,
tr: `<p class="l-text"><strong>Derin öğrenme tahmincileri, N-BEATS düşene kadar bir kara kutuydu.</strong> Oreshkin ve diğerleri (2019, Element AI), her biri bir taban ayrıştırması (trend + mevsimsellik + özdeşlik) yayan tam bağlantılı bloklardan oluşan bir yığının LSTM, dikkat veya elle tasarlanmış özellik olmadan M4 galibini yenebileceğini gösterdi. Üç yıl sonra N-HITS, hiyerarşik enterpolasyon ile fikri genişletti ve uzun ufuklu Transformer'ları maliyetinin onda biriyle yendi.</p>

<p class="l-text">Bu derste N-BEATS bloğunu inceliyorsun, NumPy ile <code>df_stocks</code> üzerinde polinom trend tabanını ve Fourier mevsimsellik tabanını türetiyor, sonra N-HITS'in çoklu hız örneklemeyi nasıl eklediğini görüyorsun. <code>neuralforecast</code> kütüphanesinin turuyla bitiriyoruz — her iki model için üretime hazır ev.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Backcast vs forecast'ı ve çift-artıklı yığma hilesini açıkla</li>
<li>Polinom trend ve Fourier mevsimsellik tabanlarını elle inşa et</li>
<li>NumPy en küçük karelerle tek-bloklu bir N-BEATS tahmini yeniden üret</li>
<li>Genel blokları yorumlanabilir bloklardan ayırt et</li>
<li>N-HITS'teki çoklu hız hiyerarşik enterpolasyonu açıkla</li>
<li>İlişkili seriler üzerinde her iki modeli uydurmak için neuralforecast API'sini kullan</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Büyük Fikir — Artık MLP'lerden Yığın</h2>
<p class="l-text">N-BEATS tahminciliği taban uydurma olarak ele alır. Her blok <em>b</em> artık geriye bakma sinyalini alır, küçük bir MLP'den geçirir ve iki katsayı vektörü çıkarır — biri backcast (giriş penceresinin yeniden inşası), biri forecast (sonraki ufuk). Sonraki blok <em>giriş eksi backcast</em>'i görür. Yığınlar tahmin katkılarını toplar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Backcast</div><div class="card-body">Bloğun geriye bakma penceresi yeniden inşası. Girişten çıkar → sonraki bloğun girişi.</div></div>
<div class="calc-card"><div class="card-title">Forecast</div><div class="card-body">Bloğun geleceğe katkısı. Son tahmini almak için bloklar arasında topla.</div></div>
<div class="calc-card"><div class="card-title">Çift artıklı</div><div class="card-body">Backcast uzayında çıkarma, forecast uzayında ekleme. Kararlı ve ifade edici.</div></div>
<div class="calc-card"><div class="card-title">Özyineleme yok</div><div class="card-body">Saf ileri besleme. Utanç verici şekilde paralel — bir GPU geçişinde batch-100 uydurur.</div></div>
</div>
<div class="calc-highlight">N-BEATS, 2019'da veri hakkında hiçbir şey bilmeyen genel bir yapılandırma ile M4'ü kazandı. Yorumlanabilir varyant ikinci geldi ve kendini açıkladı.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Blok — İki MLP, İki Kafa</h2>
<p class="l-text">Bir bloğun içinde: ReLU ile 4 yoğun katman, sonra katsayı vektörleri üreten iki doğrusal kafa <span class="katex-block">$$\\theta^{b}, \\theta^{f} = \\text{Linear}(\\text{MLP}(x))$$</span> Sabit (veya öğrenilmiş) bir taban matrisi <em>V</em>, katsayıları zaman alanı sinyallerine eşler: backcast = <em>V_b</em> &middot; <em>theta_b</em>, forecast = <em>V_f</em> &middot; <em>theta_f</em>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> neuralforecast.models <span class="kw">import</span> NBEATS
<span class="kw">from</span> neuralforecast <span class="kw">import</span> NeuralForecast

model = <span class="fn">NBEATS</span>(input_size=<span class="num">30</span>, h=<span class="num">5</span>, stack_types=[<span class="str">"trend"</span>, <span class="str">"seasonality"</span>],
               n_blocks=[<span class="num">3</span>, <span class="num">3</span>], mlp_units=[[<span class="num">256</span>, <span class="num">256</span>]] * <span class="num">2</span>)
nf = <span class="fn">NeuralForecast</span>(models=[model], freq=<span class="str">"D"</span>)
nf.<span class="fn">fit</span>(df=train_df)
preds = nf.<span class="fn">predict</span>()</code></pre></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Polinom Trend Tabanı — Elle</h2>
<p class="l-text">Trend tabanı düşük dereceli bir polinomdur: <em>V_t = [1, t, t^2, t^3]</em>. Onu uydurmak sadece en küçük karelerdir — ve bir N-BEATS trend bloğunun yakınsadığı tam olarak budur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
window = close[-<span class="num">60</span>:]                <span class="cm"># son 60 gün geriye bakma</span>
t = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, <span class="fn">len</span>(window))
V = np.<span class="fn">stack</span>([t**k <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>)], axis=<span class="num">1</span>)   <span class="cm"># 60 x 4</span>
theta, *_ = np.linalg.<span class="fn">lstsq</span>(V, window, rcond=<span class="kw">None</span>)
backcast = V @ theta
<span class="fn">print</span>(<span class="str">"theta:"</span>, theta.<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"backcast MSE:"</span>, ((backcast - window)**<span class="num">2</span>).<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text">4 katsayılı bir polinom yavaş sürüklenmenin çoğunu yakalar. Artık sonraki bloğa gider.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Fourier Mevsimsellik Tabanı — Elle</h2>
<p class="l-text">Mevsimsellik tabanı kesik bir Fourier serisidir. H ufuk uzunluğu için, H'yi bölen periyotlarda sin ve cos yığınlarsın: <em>V_s = [cos(2 pi k t), sin(2 pi k t)]</em>, k = 1..K için. N-BEATS mevsimsellik bloğu genlikleri öğrenir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
resid = close[-<span class="num">60</span>:] - close[-<span class="num">60</span>:].<span class="fn">mean</span>()
N = <span class="fn">len</span>(resid); K = <span class="num">4</span>
t = np.<span class="fn">arange</span>(N) / N

V = np.<span class="fn">column_stack</span>([np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*k*t) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>)] +
                    [np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*k*t) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>)])
theta, *_ = np.linalg.<span class="fn">lstsq</span>(V, resid, rcond=<span class="kw">None</span>)
fit = V @ theta
<span class="fn">print</span>(<span class="str">"explained variance:"</span>, (<span class="num">1</span> - ((resid-fit)**<span class="num">2</span>).<span class="fn">sum</span>() / (resid**<span class="num">2</span>).<span class="fn">sum</span>()).<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"top harmonic:"</span>, <span class="fn">int</span>(np.<span class="fn">abs</span>(theta).<span class="fn">argmax</span>()) + <span class="num">1</span>)</code></pre></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tam Bir Blok — Trend + Mevsimsellik + Tahmin</h2>
<p class="l-text">Şimdi her iki tabanı bir araya getiriyoruz: trend'i ham pencereye uydur, mevsimselliği artığa uydur, sonra her tabanı geleceğe H adım ekstrapole et ve topla.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Elle inşa edilmiş iki bloklu N-BEATS: trend bloğu sonra artık üzerinde mevsimsellik bloğu. 5 gün ileri tahmin et ve ayrılan kuyruğa karşı MAE'yi rapor et.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
L, H = <span class="num">60</span>, <span class="num">5</span>
window = close[-(L+H):-H]; truth = close[-H:]

<span class="cm"># --- Trend bloğu ---</span>
t  = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>,    L)
tf = np.<span class="fn">linspace</span>(<span class="num">1</span>, <span class="num">1</span> + H/L, H)
Vb = np.<span class="fn">stack</span>([t**k  <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>)], axis=<span class="num">1</span>)
Vf = np.<span class="fn">stack</span>([tf**k <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>)], axis=<span class="num">1</span>)
theta_t, *_ = np.linalg.<span class="fn">lstsq</span>(Vb, window, rcond=<span class="kw">None</span>)
trend_back = Vb @ theta_t
trend_fore = Vf @ theta_t
resid = window - trend_back

<span class="cm"># --- Artık üzerinde mevsimsellik bloğu ---</span>
K = <span class="num">4</span>
Sb = np.<span class="fn">column_stack</span>([np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*k*t)  <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>)] +
                     [np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*k*t)  <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>)])
Sf = np.<span class="fn">column_stack</span>([np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*k*tf) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>)] +
                     [np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*k*tf) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>)])
theta_s, *_ = np.linalg.<span class="fn">lstsq</span>(Sb, resid, rcond=<span class="kw">None</span>)
seas_fore = Sf @ theta_s

forecast = trend_fore + seas_fore
mae = np.<span class="fn">abs</span>(forecast - truth).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">"forecast:"</span>, forecast.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"truth:   "</span>, truth.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"MAE:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(mae), <span class="num">3</span>))</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Genel vs Yorumlanabilir — Tabanını Seç</h2>
<p class="l-text">Genel yapılandırmada taban matrisi <em>V</em>'nin kendisi öğrenilir (kısıtsız son bir Linear katmanı). Genellikle %1-2 daha iyi puan alır ama size hiçbir şey söylemez. Yorumlanabilir varyant <em>V</em>'yi polinom+Fourier'e sabitler, böylece her bloğun <em>theta</em>'sı insan tarafından okunabilir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Genel</div><div class="card-body">En iyi ham doğruluk. Kara kutu. Bir lider tablosu puanlıyorsanız kullanın.</div></div>
<div class="calc-card"><div class="card-title">Yorumlanabilir</div><div class="card-body">Hafifçe daha kötü ama theta_trend = polinom katsayıları, theta_seas = harmonik genlikler.</div></div>
<div class="calc-card"><div class="card-title">Topluluk</div><div class="card-body">Yazarlar 18 rastgele tohumun ortalamasını aldı. Makale sayılarını yeniden üretmek için kritik.</div></div>
<div class="calc-card"><div class="card-title">Aktarılabilir</div><div class="card-body">M4 üzerinde eğitilmiş bir model diğer alanlara sıfır-atış genelleşir — N-BEATS-T (2021).</div></div>
</div>
<div class="calc-highlight">Paydaşlarınız tahminin <em>neden</em> yükseldiğini bilmek istiyorsa, yorumlanabilir varyantı gönderin — trend katsayıları bir hikayedir.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. N-HITS — Hiyerarşik Enterpolasyon</h2>
<p class="l-text">Challu ve diğerleri (2023) uzun ufukların parametre sayısını patlattığını fark etti. N-HITS bunu çoklu hız örnekleme ile çözer: her yığın girdiyi farklı bir hızda havuzlar (örneğin 1, 4, 16) böylece farklı yığınlar farklı frekans bantlarına dikkat eder. Tahmin sonra tam ufka kadar enterpole edilir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MaxPool girişi</div><div class="card-body">Yığın i geriye bakmayı k_i faktörü ile havuzlar. Yüksek k = düşük frekans.</div></div>
<div class="calc-card"><div class="card-title">Küçük tahmin</div><div class="card-body">Her yığın yalnızca n_h_i &lt; H nokta tahmin eder.</div></div>
<div class="calc-card"><div class="card-title">Yukarı enterpole et</div><div class="card-body">H uzunluğuna doğrusal / kübik enterpolasyon. Küçük matrisler, büyük ufuklar.</div></div>
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">H=720'de N-BEATS'ten 2-3x daha hızlı, karşılaştırılabilir veya daha iyi MAE ile.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Hiyerarşik Enterpolasyon — Mini Demo</h2>
<p class="l-text">Tahmin kafası 5 kontrol noktası yayar; son ufuk için 30 noktaya enterpole ediyoruz. Bu, N-HITS'in ölçeklenmesine izin veren temel hiledir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Son 30 kapanışı al, 5 kontrol noktasına sıkıştır, sonra doğrusal olarak 30'a yükselt — bir N-HITS bloğu içindeki veri yolu.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

H = <span class="num">30</span>
truth = df_stocks[<span class="str">"Close"</span>].values[-H:].<span class="fn">astype</span>(<span class="str">"float32"</span>)

<span class="cm"># Sıkıştır: 5 kovaya ortalama havuzla (düşük frekans kontrol noktaları)</span>
n_ctrl = <span class="num">5</span>
ctrl = truth.<span class="fn">reshape</span>(n_ctrl, H // n_ctrl).<span class="fn">mean</span>(axis=<span class="num">1</span>)

<span class="cm"># H uzunluğuna geri enterpole et</span>
xp = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, n_ctrl)
xq = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, H)
recon = np.<span class="fn">interp</span>(xq, xp, ctrl)

mae = np.<span class="fn">abs</span>(recon - truth).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">"control pts:"</span>, ctrl.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"params used: 5  /  output length:"</span>, H)
<span class="fn">print</span>(<span class="str">"MAE vs truth:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(mae), <span class="num">3</span>))</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. neuralforecast — Üretim Kütüphanesi</h2>
<p class="l-text">Nixtla ekibi <code>neuralforecast</code>'u N-BEATS, N-HITS, TFT, PatchTST, iTransformer ve bir düzine başkası için kanonik ev olarak korur. Uzun formatlı bir DataFrame bekler: <code>unique_id</code>, <code>ds</code>, <code>y</code>. Veriniz şekle girdikten sonra her model bir satırdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> neuralforecast <span class="kw">import</span> NeuralForecast
<span class="kw">from</span> neuralforecast.models <span class="kw">import</span> NHITS, NBEATS

models = [<span class="fn">NHITS</span>(input_size=<span class="num">60</span>, h=<span class="num">14</span>, max_steps=<span class="num">500</span>),
          <span class="fn">NBEATS</span>(input_size=<span class="num">60</span>, h=<span class="num">14</span>, max_steps=<span class="num">500</span>)]
nf = <span class="fn">NeuralForecast</span>(models=models, freq=<span class="str">"D"</span>)
nf.<span class="fn">fit</span>(df=long_df)                 <span class="cm"># sütunlar unique_id, ds, y</span>
fcst = nf.<span class="fn">predict</span>()
<span class="fn">print</span>(fcst.<span class="fn">head</span>())</code></pre></div>
<p class="l-text">Her iki model klasik <code>statsforecast</code> ile aynı fit/predict yüzeyini paylaşır, böylece istatistiksel ve derin modelleri aynı hatta birleştirebilirsiniz.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. N-BEATS ve N-HITS Arasında Seçim</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kısa H (≤ 30)</div><div class="card-body">N-BEATS daha basit ve aynı derecede doğru.</div></div>
<div class="calc-card"><div class="card-title">Uzun H (60-720)</div><div class="card-body">N-HITS hâkim. Enterpolasyon parametreleri küçük tutar.</div></div>
<div class="calc-card"><div class="card-title">Açıklama gerekli</div><div class="card-body">N-BEATS yorumlanabilir. N-HITS bantları daha az sezgiseldir.</div></div>
<div class="calc-card"><div class="card-title">Birçok seri</div><div class="card-body">Her ikisi de, paylaşılan ağırlıklarla küresel olarak eğitilmiş.</div></div>
</div>
<div class="calc-highlight">Emin değilsen, ikisini de uydur ve birleştir. Endüktif yanlılıkta çeşitlilik bedava doğruluktur.</div>
</div>
`
};
