window.TIMESERIES_L1 = {
en: `<p class="l-text"><strong>Time series data is everywhere</strong> — stock prices, server CPU usage, daily active users, hourly temperature, weekly sales, electrocardiograms. What makes it different from ordinary tabular data is one thing: <em>order matters</em>. You cannot shuffle rows. Yesterday influences today. Last December's sales tell you about this December's. Every model you build must respect this temporal structure or it will silently leak the future into the past and lie to you with beautiful validation scores.</p>
<p class="l-text">Before any forecasting, every analyst does the same three checks: <strong>is the series stationary?</strong> (does its mean and variance change over time?) <strong>can I decompose it</strong> into trend + seasonality + residual? and <strong>does my fancy model actually beat a naive baseline</strong> (just predict yesterday)? In this lesson we build that foundation — ADF tests, STL decomposition, and the three baselines (naive, seasonal-naive, mean) you must always beat before claiming victory.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>What time series data is and why ordinary ML breaks on it</li><li>The three components: trend, seasonality, residual</li><li>Stationarity, the ADF test, and differencing</li><li>STL decomposition (Seasonal-Trend decomposition using Loess)</li><li>Three baseline forecasts: naive, seasonal naive, mean</li><li>Honest evaluation with MAE / RMSE / MAPE</li></ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. What Makes a Time Series Special?</h2>
<p class="l-text">A time series is a sequence of observations indexed by time: <code>(t_1, y_1), (t_2, y_2), ...</code> Three properties separate it from ordinary tabular data:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Order matters</div><div class="card-body">You cannot shuffle the dataset. Splitting into train/test must be chronological — the test set is always the future.</div></div>
<div class="calc-card"><div class="card-title">Autocorrelation</div><div class="card-body">y[t] is correlated with y[t-1], y[t-7], y[t-365]. Independence assumption of standard ML is violated.</div></div>
<div class="calc-card"><div class="card-title">Non-stationarity</div><div class="card-body">Mean and variance change over time. A model trained on 2020 data may be useless in 2026 if the underlying process drifted.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">⚠ Random shuffling in cross-validation is the #1 cause of fake good results in time series. Always use TimeSeriesSplit or walk-forward.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. The Classical Decomposition</h2>
<p class="l-text">Most time series can be decomposed additively: <strong>y[t] = Trend[t] + Season[t] + Residual[t]</strong>. Or multiplicatively when the seasonal amplitude grows with the level: <strong>y[t] = Trend[t] × Season[t] × Residual[t]</strong>.</p>
<div class="katex-block">$$y_t = T_t + S_t + R_t \\quad \\text{(additive)} \\qquad y_t = T_t \\cdot S_t \\cdot R_t \\quad \\text{(multiplicative)}$$</div>
<p class="l-text">The trend is the long-term direction (your subscriber count growing). The seasonality is the periodic pattern (Sunday traffic dip, December sales spike). The residual is what remains — ideally white noise.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Build a synthetic series: linear trend + weekly seasonality + noise</span>
n = <span class="num">365</span>
t = np.<span class="fn">arange</span>(n)
trend = <span class="num">0.05</span> * t                       <span class="cm"># slow upward drift</span>
season = <span class="num">3.0</span> * np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * t / <span class="num">7</span>)  <span class="cm"># weekly cycle</span>
noise = np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">1.0</span>, n)
y = <span class="num">20</span> + trend + season + noise

ts = pd.<span class="fn">Series</span>(y, index=pd.<span class="fn">date_range</span>(<span class="str">"2024-01-01"</span>, periods=n, freq=<span class="str">"D"</span>))
<span class="fn">print</span>(ts.<span class="fn">head</span>())
<span class="fn">print</span>(<span class="str">"Mean:"</span>, ts.<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">2</span>), <span class="str">" Std:"</span>, ts.<span class="fn">std</span>().<span class="fn">round</span>(<span class="num">2</span>))
</code></pre></div>
<p class="l-text">This synthetic series gives us a controlled example: known trend slope (0.05/day), known weekly period (7), known noise scale (1.0). When we decompose it, we should recover those three pieces.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. STL Decomposition</h2>
<p class="l-text">STL = Seasonal-Trend decomposition using Loess. It is the workhorse decomposition algorithm: robust to outliers, handles any seasonality, and (unlike classical decomposition) lets the seasonal component change slowly over time.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> statsmodels.tsa.seasonal <span class="kw">import</span> STL

stl = <span class="fn">STL</span>(ts, period=<span class="num">7</span>, robust=<span class="kw">True</span>).<span class="fn">fit</span>()
<span class="fn">print</span>(stl.trend.<span class="fn">head</span>())
<span class="fn">print</span>(stl.seasonal.<span class="fn">head</span>())
<span class="fn">print</span>(stl.resid.<span class="fn">head</span>())
stl.<span class="fn">plot</span>()
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Manual STL using rolling-mean trend + grouped seasonal averaging. Works on df_stocks (real data, daily) — preloaded.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># df_stocks is preloaded: 261 daily rows</span>
y = df_stocks[<span class="str">'close'</span>].<span class="fn">copy</span>()
y.index = pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>])

<span class="cm"># 1) Trend: centered rolling mean</span>
period = <span class="num">5</span>  <span class="cm"># weekly business days</span>
trend = y.<span class="fn">rolling</span>(period, center=<span class="kw">True</span>).<span class="fn">mean</span>()

<span class="cm"># 2) Detrend, then average by day-of-week to get seasonal pattern</span>
detrended = y - trend
season_pattern = detrended.<span class="fn">groupby</span>(detrended.index.dayofweek).<span class="fn">transform</span>(<span class="str">'mean'</span>)

<span class="cm"># 3) Residual is what's left</span>
resid = y - trend - season_pattern

<span class="fn">print</span>(<span class="str">'Trend (last 5):'</span>, trend.<span class="fn">dropna</span>().<span class="fn">tail</span>().<span class="fn">round</span>(<span class="num">2</span>).values)
<span class="fn">print</span>(<span class="str">'Seasonal range:'</span>, season_pattern.<span class="fn">min</span>().<span class="fn">round</span>(<span class="num">2</span>), <span class="str">'to'</span>, season_pattern.<span class="fn">max</span>().<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">'Resid std:'</span>, resid.<span class="fn">std</span>().<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div></div>
<p class="l-text">The seasonal component shows the systematic day-of-week effect; the residual std tells you the irreducible noise floor — your model can never be more accurate than this.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Stationarity & the ADF Test</h2>
<p class="l-text">A series is <strong>(weakly) stationary</strong> if its mean, variance, and autocovariance do not depend on time. Most classical time-series methods (ARIMA, AR, MA) assume stationarity. Real series rarely are — they have trends, level shifts, varying volatility.</p>
<div class="katex-block">$$\\text{Stationary} \\iff E[y_t] = \\mu, \\quad \\text{Var}(y_t) = \\sigma^2, \\quad \\text{Cov}(y_t, y_{t+k}) = \\gamma(k)$$</div>
<p class="l-text">The <strong>Augmented Dickey-Fuller (ADF) test</strong> tests the null hypothesis that the series has a unit root (= non-stationary). p &lt; 0.05 means we reject H0 and call the series stationary.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy <span class="kw">import</span> stats

<span class="cm"># Simple ADF-style check on df_stocks closing prices</span>
y = df_stocks[<span class="str">'close'</span>].values

<span class="cm"># Difference once: y_diff[t] = y[t] - y[t-1]</span>
y_diff = np.<span class="fn">diff</span>(y)

<span class="cm"># Levels: usually trending => non-stationary (high mean shift across windows)</span>
window_means_levels = [y[:<span class="num">130</span>].<span class="fn">mean</span>(), y[<span class="num">130</span>:].<span class="fn">mean</span>()]
window_means_diff = [y_diff[:<span class="num">130</span>].<span class="fn">mean</span>(), y_diff[<span class="num">130</span>:].<span class="fn">mean</span>()]
<span class="fn">print</span>(<span class="str">'Levels means by half:'</span>, np.<span class="fn">round</span>(window_means_levels, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">'Diffs  means by half:'</span>, np.<span class="fn">round</span>(window_means_diff, <span class="num">4</span>))
<span class="cm"># Diffs should be near zero and similar => differenced series ~ stationary</span>
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">If your series fails ADF (p &gt; 0.05), <strong>difference it</strong>: y_diff = y[t] - y[t-1]. Most price series are non-stationary in level but stationary in returns.</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Three Baseline Forecasts</h2>
<p class="l-text">Before you fit ARIMA, Prophet, LSTM, or any sexy model, you must beat three trivial baselines:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Naive (random walk)</div><div class="card-body">ŷ[t+1] = y[t]. Just predict the last observed value. Brutally hard to beat for stock prices.</div></div>
<div class="calc-card"><div class="card-title">Seasonal naive</div><div class="card-body">ŷ[t+1] = y[t+1-m] where m is the period. For weekly seasonal data, ŷ[Monday] = last_Monday.</div></div>
<div class="calc-card"><div class="card-title">Mean / drift</div><div class="card-body">ŷ[t+1] = mean(y) or extrapolate the linear trend from first to last point.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

y = df_stocks[<span class="str">'close'</span>].values
train, test = y[:-<span class="num">30</span>], y[-<span class="num">30</span>:]   <span class="cm"># hold out last 30 days</span>

<span class="cm"># 1) Naive: predict last train value for all 30 days</span>
naive_forecast = np.<span class="fn">full</span>(<span class="num">30</span>, train[-<span class="num">1</span>])

<span class="cm"># 2) Seasonal naive (period=5 business week): repeat last 5 train values</span>
season = train[-<span class="num">5</span>:]
seasonal_forecast = np.<span class="fn">tile</span>(season, <span class="fn">int</span>(np.<span class="fn">ceil</span>(<span class="num">30</span>/<span class="num">5</span>)))[:<span class="num">30</span>]

<span class="cm"># 3) Mean: predict the historical mean</span>
mean_forecast = np.<span class="fn">full</span>(<span class="num">30</span>, train.<span class="fn">mean</span>())

<span class="cm"># Drift: linear extrapolation from first to last point</span>
slope = (train[-<span class="num">1</span>] - train[<span class="num">0</span>]) / (<span class="fn">len</span>(train) - <span class="num">1</span>)
drift_forecast = train[-<span class="num">1</span>] + slope * np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="num">31</span>)

<span class="fn">print</span>(<span class="str">'Naive    MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">abs</span>(test - naive_forecast).<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'Seasonal MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">abs</span>(test - seasonal_forecast).<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'Mean     MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">abs</span>(test - mean_forecast).<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'Drift    MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">abs</span>(test - drift_forecast).<span class="fn">mean</span>(), <span class="num">3</span>))
</code></pre></div>
<p class="l-text">Run this on df_stocks: you'll usually find naive is strongest for stock prices (efficient-market intuition), while seasonal naive wins for weekly retail traffic. Whichever wins is your <em>floor</em> — anything fancier must beat it.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Honest Evaluation Metrics</h2>
<p class="l-text">Three metrics dominate forecasting:</p>
<div class="katex-block">$$\\text{MAE} = \\frac{1}{n}\\sum |y_t - \\hat{y}_t| \\qquad \\text{RMSE} = \\sqrt{\\frac{1}{n}\\sum (y_t - \\hat{y}_t)^2} \\qquad \\text{MAPE} = \\frac{100}{n}\\sum \\left|\\frac{y_t - \\hat{y}_t}{y_t}\\right|$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MAE</div><div class="card-body">Median of errors. Robust to outliers. Same units as y. Easy to explain to a PM.</div></div>
<div class="calc-card"><div class="card-title">RMSE</div><div class="card-body">Penalizes big errors quadratically. Use when one large miss is much worse than many small ones.</div></div>
<div class="calc-card"><div class="card-title">MAPE</div><div class="card-body">Percentage error. Scale-free, comparable across products. <strong>Explodes when y near zero.</strong> Use sMAPE or MASE instead for sparse series.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">mae</span>(y, yhat):  <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y - yhat)))
<span class="kw">def</span> <span class="fn">rmse</span>(y, yhat): <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">sqrt</span>(np.<span class="fn">mean</span>((y - yhat)**<span class="num">2</span>)))
<span class="kw">def</span> <span class="fn">mape</span>(y, yhat): <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>((y - yhat) / y)) * <span class="num">100</span>)
<span class="kw">def</span> <span class="fn">mase</span>(y, yhat, train, m=<span class="num">1</span>):
    <span class="cm"># Mean Absolute Scaled Error: MAE / MAE_naive_seasonal</span>
    naive_err = np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(np.<span class="fn">diff</span>(train, n=m)))
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y - yhat)) / naive_err)

<span class="cm"># On the naive forecast from above:</span>
<span class="fn">print</span>(<span class="str">'MAE :'</span>, <span class="fn">round</span>(<span class="fn">mae</span>(test, naive_forecast), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'RMSE:'</span>, <span class="fn">round</span>(<span class="fn">rmse</span>(test, naive_forecast), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'MAPE:'</span>, <span class="fn">round</span>(<span class="fn">mape</span>(test, naive_forecast), <span class="num">2</span>), <span class="str">'%'</span>)
<span class="fn">print</span>(<span class="str">'MASE:'</span>, <span class="fn">round</span>(<span class="fn">mase</span>(test, naive_forecast, train, m=<span class="num">1</span>), <span class="num">3</span>))
</code></pre></div>
<p class="l-text">MASE &lt; 1 means your model beat the naive baseline. MASE &gt;= 1 means: stop, go back, simplify.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Train / Test Split for Time Series</h2>
<p class="l-text">Random shuffle is forbidden. The test set must be the most recent contiguous block. The train set is everything before it. This mimics deployment: you train on history, predict the future.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

y = df_stocks[<span class="str">'close'</span>].<span class="fn">copy</span>()
y.index = pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>])

<span class="cm"># Hold out the last 20% as test</span>
split = <span class="fn">int</span>(<span class="fn">len</span>(y) * <span class="num">0.8</span>)
train, test = y.iloc[:split], y.iloc[split:]
<span class="fn">print</span>(f<span class="str">'Train: {train.index[0].date()} .. {train.index[-1].date()}  n={len(train)}'</span>)
<span class="fn">print</span>(f<span class="str">'Test : {test.index[0].date()} .. {test.index[-1].date()}  n={len(test)}'</span>)

<span class="cm"># Baseline: naive</span>
naive = np.<span class="fn">full</span>(<span class="fn">len</span>(test), train.iloc[-<span class="num">1</span>])
err = (test.values - naive)
<span class="fn">print</span>(<span class="str">'Naive MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">abs</span>(err).<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'Naive bias (mean error):'</span>, <span class="fn">round</span>(err.<span class="fn">mean</span>(), <span class="num">3</span>))
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">The mean error (bias) tells you if you're systematically over- or under-forecasting — a fixable problem. RMSE/MAE only tell you total magnitude.</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Recap & Next Steps</h2>
<p class="l-text">You now have the foundation:</p>
<ul style="line-height:1.7"><li>Decompose every series first (trend + seasonal + residual) — this tells you what to model and what is irreducible noise</li><li>Test stationarity with ADF; difference until stationary if needed</li><li>Always benchmark against naive, seasonal naive, mean, and drift before claiming any model "works"</li><li>Use MAE/RMSE/MASE — never random-shuffle CV</li></ul>
<p class="l-text">In <strong>L2</strong> we build the first real models: AR, MA, ARIMA, SARIMA, and exponential smoothing (ETS / Holt-Winters). These dominated forecasting for 50 years and still win Kaggle competitions on small datasets.</p>
</div>`,
tr: `<p class="l-text"><strong>Zaman serisi verisi her yerdedir</strong> — hisse fiyatları, sunucu CPU kullanımı, günlük aktif kullanıcılar, saatlik sıcaklık, haftalık satışlar, elektrokardiyogramlar. Sıradan tablo verisinden farkı tek bir şeydir: <em>sıra önemlidir</em>. Satırları karıştıramazsınız. Dün bugünü etkiler. Geçen Aralık'ın satışları size bu Aralık hakkında bilgi verir. Kurduğunuz her model bu zamansal yapıya saygı duymalıdır, yoksa geleceği sessizce geçmişe sızdırır ve güzel doğrulama puanlarıyla size yalan söyler.</p>
<p class="l-text">Herhangi bir tahminden önce, her analist aynı üç kontrolü yapar: <strong>seri durağan mı?</strong> (ortalaması ve varyansı zamanla değişiyor mu?) <strong>onu trend + mevsimsellik + artık olarak ayrıştırabilir miyim?</strong> ve <strong>süslü modelim aslında naif bir referansı (sadece dünü tahmin et) yenebiliyor mu?</strong> Bu derste o temeli inşa ediyoruz — ADF testleri, STL ayrıştırması ve zafer ilan etmeden önce mutlaka yenmeniz gereken üç referans (naif, mevsimsel-naif, ortalama).</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Zaman serisi verisinin ne olduğunu ve sıradan ML'in neden bozulduğunu</li><li>Üç bileşen: trend, mevsimsellik, artık</li><li>Durağanlık, ADF testi ve fark alma</li><li>STL ayrıştırması (Loess kullanan Mevsimsel-Trend ayrıştırması)</li><li>Üç referans tahmin: naif, mevsimsel naif, ortalama</li><li>MAE / RMSE / MAPE ile dürüst değerlendirme</li></ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Bir Zaman Serisini Özel Yapan Nedir?</h2>
<p class="l-text">Bir zaman serisi, zamana göre indekslenmiş gözlem dizisidir: <code>(t_1, y_1), (t_2, y_2), ...</code> Onu sıradan tablo verisinden ayıran üç özellik vardır:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sıra önemlidir</div><div class="card-body">Veri kümesini karıştıramazsınız. Eğitim/test ayrımı kronolojik olmalı — test kümesi her zaman gelecektir.</div></div>
<div class="calc-card"><div class="card-title">Otokorelasyon</div><div class="card-body">y[t] ile y[t-1], y[t-7], y[t-365] korelasyonludur. Standart ML'in bağımsızlık varsayımı ihlal edilmiştir.</div></div>
<div class="calc-card"><div class="card-title">Durağansızlık</div><div class="card-body">Ortalama ve varyans zamanla değişir. 2020 verisiyle eğitilmiş bir model, alttaki süreç kaymışsa 2026'da kullanışsız olabilir.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">⚠ Çapraz doğrulamada rastgele karıştırma, zaman serilerinde sahte iyi sonuçların 1 numaralı nedenidir. Daima TimeSeriesSplit veya ileri-yürüme kullanın.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Klasik Ayrıştırma</h2>
<p class="l-text">Çoğu zaman serisi toplamsal olarak ayrıştırılabilir: <strong>y[t] = Trend[t] + Mevsim[t] + Artık[t]</strong>. Veya mevsimsel genlik seviyeyle birlikte büyüdüğünde çarpımsal olarak: <strong>y[t] = Trend[t] × Mevsim[t] × Artık[t]</strong>.</p>
<div class="katex-block">$$y_t = T_t + S_t + R_t \\quad \\text{(additive)} \\qquad y_t = T_t \\cdot S_t \\cdot R_t \\quad \\text{(multiplicative)}$$</div>
<p class="l-text">Trend uzun vadeli yöndür (abone sayınızın büyümesi). Mevsimsellik periyodik desendir (Pazar trafik düşüşü, Aralık satış zirvesi). Artık geriye kalandır — ideal olarak beyaz gürültü.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Sentetik bir seri kur: doğrusal trend + haftalık mevsimsellik + gürültü</span>
n = <span class="num">365</span>
t = np.<span class="fn">arange</span>(n)
trend = <span class="num">0.05</span> * t                       <span class="cm"># yavaş yukarı sürüklenme</span>
season = <span class="num">3.0</span> * np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * t / <span class="num">7</span>)  <span class="cm"># haftalık döngü</span>
noise = np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">1.0</span>, n)
y = <span class="num">20</span> + trend + season + noise

ts = pd.<span class="fn">Series</span>(y, index=pd.<span class="fn">date_range</span>(<span class="str">"2024-01-01"</span>, periods=n, freq=<span class="str">"D"</span>))
<span class="fn">print</span>(ts.<span class="fn">head</span>())
<span class="fn">print</span>(<span class="str">"Mean:"</span>, ts.<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">2</span>), <span class="str">" Std:"</span>, ts.<span class="fn">std</span>().<span class="fn">round</span>(<span class="num">2</span>))
</code></pre></div>
<p class="l-text">Bu sentetik seri bize kontrollü bir örnek verir: bilinen trend eğimi (0.05/gün), bilinen haftalık periyot (7), bilinen gürültü ölçeği (1.0). Onu ayrıştırdığımızda, bu üç parçayı geri kazanmalıyız.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. STL Ayrıştırması</h2>
<p class="l-text">STL = Loess kullanan Mevsimsel-Trend ayrıştırması. Bu, ayrıştırma algoritmalarının iş atıdır: aykırı değerlere karşı dayanıklı, herhangi bir mevsimselliği işler ve (klasik ayrıştırmanın aksine) mevsimsel bileşenin zamanla yavaşça değişmesine izin verir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> statsmodels.tsa.seasonal <span class="kw">import</span> STL

stl = <span class="fn">STL</span>(ts, period=<span class="num">7</span>, robust=<span class="kw">True</span>).<span class="fn">fit</span>()
<span class="fn">print</span>(stl.trend.<span class="fn">head</span>())
<span class="fn">print</span>(stl.seasonal.<span class="fn">head</span>())
<span class="fn">print</span>(stl.resid.<span class="fn">head</span>())
stl.<span class="fn">plot</span>()
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Hareketli ortalama trendi + grup bazlı mevsimsel ortalama ile elle STL. df_stocks üzerinde çalışır (gerçek veri, günlük) — önceden yüklenmiş.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># df_stocks önceden yüklenmiş: 261 günlük satır</span>
y = df_stocks[<span class="str">'close'</span>].<span class="fn">copy</span>()
y.index = pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>])

<span class="cm"># 1) Trend: ortalanmış hareketli ortalama</span>
period = <span class="num">5</span>  <span class="cm"># haftalık iş günleri</span>
trend = y.<span class="fn">rolling</span>(period, center=<span class="kw">True</span>).<span class="fn">mean</span>()

<span class="cm"># 2) Trend'i çıkar, sonra mevsimsel deseni elde etmek için haftanın gününe göre ortala</span>
detrended = y - trend
season_pattern = detrended.<span class="fn">groupby</span>(detrended.index.dayofweek).<span class="fn">transform</span>(<span class="str">'mean'</span>)

<span class="cm"># 3) Artık geriye kalandır</span>
resid = y - trend - season_pattern

<span class="fn">print</span>(<span class="str">'Trend (last 5):'</span>, trend.<span class="fn">dropna</span>().<span class="fn">tail</span>().<span class="fn">round</span>(<span class="num">2</span>).values)
<span class="fn">print</span>(<span class="str">'Seasonal range:'</span>, season_pattern.<span class="fn">min</span>().<span class="fn">round</span>(<span class="num">2</span>), <span class="str">'to'</span>, season_pattern.<span class="fn">max</span>().<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">'Resid std:'</span>, resid.<span class="fn">std</span>().<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div></div>
<p class="l-text">Mevsimsel bileşen, sistematik haftanın günü etkisini gösterir; artık standart sapması, indirgenemez gürültü tabanını söyler — modeliniz asla bundan daha doğru olamaz.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Durağanlık ve ADF Testi</h2>
<p class="l-text">Bir seri, ortalaması, varyansı ve otokovaryansı zamana bağlı değilse <strong>(zayıf) durağandır</strong>. Çoğu klasik zaman serisi yöntemi (ARIMA, AR, MA) durağanlığı varsayar. Gerçek seriler nadiren durağandır — trendleri, seviye kaymaları, değişken oynaklıkları vardır.</p>
<div class="katex-block">$$\\text{Stationary} \\iff E[y_t] = \\mu, \\quad \\text{Var}(y_t) = \\sigma^2, \\quad \\text{Cov}(y_t, y_{t+k}) = \\gamma(k)$$</div>
<p class="l-text"><strong>Genişletilmiş Dickey-Fuller (ADF) testi</strong>, serinin bir birim köke sahip olduğu (= durağan değil) sıfır hipotezini test eder. p &lt; 0.05, H0'ı reddedip seriyi durağan olarak adlandırdığımız anlamına gelir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy <span class="kw">import</span> stats

<span class="cm"># df_stocks kapanış fiyatları üzerinde basit ADF tarzı kontrol</span>
y = df_stocks[<span class="str">'close'</span>].values

<span class="cm"># Bir kez fark al: y_diff[t] = y[t] - y[t-1]</span>
y_diff = np.<span class="fn">diff</span>(y)

<span class="cm"># Seviyeler: genellikle trendli => durağan değil (pencereler arasında yüksek ortalama kayması)</span>
window_means_levels = [y[:<span class="num">130</span>].<span class="fn">mean</span>(), y[<span class="num">130</span>:].<span class="fn">mean</span>()]
window_means_diff = [y_diff[:<span class="num">130</span>].<span class="fn">mean</span>(), y_diff[<span class="num">130</span>:].<span class="fn">mean</span>()]
<span class="fn">print</span>(<span class="str">'Levels means by half:'</span>, np.<span class="fn">round</span>(window_means_levels, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">'Diffs  means by half:'</span>, np.<span class="fn">round</span>(window_means_diff, <span class="num">4</span>))
<span class="cm"># Farklar sıfıra yakın ve benzer olmalı => fark alınmış seri ~ durağan</span>
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Seriniz ADF'de başarısız olursa (p &gt; 0.05), <strong>onun farkını alın</strong>: y_diff = y[t] - y[t-1]. Çoğu fiyat serisi seviyede durağan değildir ama getirilerde durağandır.</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Üç Referans Tahmin</h2>
<p class="l-text">ARIMA, Prophet, LSTM veya herhangi bir seksi model uydurmadan önce, üç önemsiz referansı yenmelisiniz:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Naif (rastgele yürüyüş)</div><div class="card-body">ŷ[t+1] = y[t]. Sadece son gözlemlenen değeri tahmin et. Hisse fiyatları için yenilmesi acımasız zor.</div></div>
<div class="calc-card"><div class="card-title">Mevsimsel naif</div><div class="card-body">ŷ[t+1] = y[t+1-m], burada m periyottur. Haftalık mevsimsel veri için, ŷ[Pazartesi] = son_Pazartesi.</div></div>
<div class="calc-card"><div class="card-title">Ortalama / sürüklenme</div><div class="card-body">ŷ[t+1] = mean(y) veya ilk noktadan son noktaya doğrusal trendi ekstrapole et.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

y = df_stocks[<span class="str">'close'</span>].values
train, test = y[:-<span class="num">30</span>], y[-<span class="num">30</span>:]   <span class="cm"># son 30 günü ayır</span>

<span class="cm"># 1) Naif: tüm 30 gün için son eğitim değerini tahmin et</span>
naive_forecast = np.<span class="fn">full</span>(<span class="num">30</span>, train[-<span class="num">1</span>])

<span class="cm"># 2) Mevsimsel naif (period=5 iş haftası): son 5 eğitim değerini tekrarla</span>
season = train[-<span class="num">5</span>:]
seasonal_forecast = np.<span class="fn">tile</span>(season, <span class="fn">int</span>(np.<span class="fn">ceil</span>(<span class="num">30</span>/<span class="num">5</span>)))[:<span class="num">30</span>]

<span class="cm"># 3) Ortalama: tarihsel ortalamayı tahmin et</span>
mean_forecast = np.<span class="fn">full</span>(<span class="num">30</span>, train.<span class="fn">mean</span>())

<span class="cm"># Sürüklenme: ilk noktadan son noktaya doğrusal ekstrapolasyon</span>
slope = (train[-<span class="num">1</span>] - train[<span class="num">0</span>]) / (<span class="fn">len</span>(train) - <span class="num">1</span>)
drift_forecast = train[-<span class="num">1</span>] + slope * np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="num">31</span>)

<span class="fn">print</span>(<span class="str">'Naive    MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">abs</span>(test - naive_forecast).<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'Seasonal MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">abs</span>(test - seasonal_forecast).<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'Mean     MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">abs</span>(test - mean_forecast).<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'Drift    MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">abs</span>(test - drift_forecast).<span class="fn">mean</span>(), <span class="num">3</span>))
</code></pre></div>
<p class="l-text">Bunu df_stocks üzerinde çalıştırın: hisse fiyatları için genellikle naif en güçlüsüdür (etkin piyasa sezgisi), haftalık perakende trafiği için ise mevsimsel naif kazanır. Hangisi kazanırsa o sizin <em>tabanınızdır</em> — daha süslü olan herhangi bir şey onu yenmek zorundadır.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Dürüst Değerlendirme Metrikleri</h2>
<p class="l-text">Üç metrik tahminciliğe hâkimdir:</p>
<div class="katex-block">$$\\text{MAE} = \\frac{1}{n}\\sum |y_t - \\hat{y}_t| \\qquad \\text{RMSE} = \\sqrt{\\frac{1}{n}\\sum (y_t - \\hat{y}_t)^2} \\qquad \\text{MAPE} = \\frac{100}{n}\\sum \\left|\\frac{y_t - \\hat{y}_t}{y_t}\\right|$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MAE</div><div class="card-body">Hataların medyanı. Aykırı değerlere dayanıklı. y ile aynı birim. Bir PM'e açıklamak kolay.</div></div>
<div class="calc-card"><div class="card-title">RMSE</div><div class="card-body">Büyük hataları karesel olarak cezalandırır. Bir büyük kaçış, birçok küçükten çok daha kötüyse kullanın.</div></div>
<div class="calc-card"><div class="card-title">MAPE</div><div class="card-body">Yüzde hata. Ölçeksiz, ürünler arasında karşılaştırılabilir. <strong>y sıfıra yakınken patlar.</strong> Seyrek seriler için sMAPE veya MASE kullanın.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">mae</span>(y, yhat):  <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y - yhat)))
<span class="kw">def</span> <span class="fn">rmse</span>(y, yhat): <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">sqrt</span>(np.<span class="fn">mean</span>((y - yhat)**<span class="num">2</span>)))
<span class="kw">def</span> <span class="fn">mape</span>(y, yhat): <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>((y - yhat) / y)) * <span class="num">100</span>)
<span class="kw">def</span> <span class="fn">mase</span>(y, yhat, train, m=<span class="num">1</span>):
    <span class="cm"># Ortalama Mutlak Ölçeklendirilmiş Hata: MAE / MAE_naive_seasonal</span>
    naive_err = np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(np.<span class="fn">diff</span>(train, n=m)))
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y - yhat)) / naive_err)

<span class="cm"># Yukarıdaki naif tahmin üzerinde:</span>
<span class="fn">print</span>(<span class="str">'MAE :'</span>, <span class="fn">round</span>(<span class="fn">mae</span>(test, naive_forecast), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'RMSE:'</span>, <span class="fn">round</span>(<span class="fn">rmse</span>(test, naive_forecast), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'MAPE:'</span>, <span class="fn">round</span>(<span class="fn">mape</span>(test, naive_forecast), <span class="num">2</span>), <span class="str">'%'</span>)
<span class="fn">print</span>(<span class="str">'MASE:'</span>, <span class="fn">round</span>(<span class="fn">mase</span>(test, naive_forecast, train, m=<span class="num">1</span>), <span class="num">3</span>))
</code></pre></div>
<p class="l-text">MASE &lt; 1, modelinizin naif referansı yendiği anlamına gelir. MASE &gt;= 1 demek: dur, geri dön, basitleştir.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Zaman Serisi için Eğitim / Test Ayrımı</h2>
<p class="l-text">Rastgele karıştırma yasaktır. Test kümesi en yeni bitişik blok olmalıdır. Eğitim kümesi ondan öncesindeki her şeydir. Bu, dağıtımı taklit eder: tarihçeyle eğitir, geleceği tahmin edersiniz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

y = df_stocks[<span class="str">'close'</span>].<span class="fn">copy</span>()
y.index = pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>])

<span class="cm"># Son %20'yi test olarak ayır</span>
split = <span class="fn">int</span>(<span class="fn">len</span>(y) * <span class="num">0.8</span>)
train, test = y.iloc[:split], y.iloc[split:]
<span class="fn">print</span>(f<span class="str">'Train: {train.index[0].date()} .. {train.index[-1].date()}  n={len(train)}'</span>)
<span class="fn">print</span>(f<span class="str">'Test : {test.index[0].date()} .. {test.index[-1].date()}  n={len(test)}'</span>)

<span class="cm"># Referans: naif</span>
naive = np.<span class="fn">full</span>(<span class="fn">len</span>(test), train.iloc[-<span class="num">1</span>])
err = (test.values - naive)
<span class="fn">print</span>(<span class="str">'Naive MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">abs</span>(err).<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'Naive bias (mean error):'</span>, <span class="fn">round</span>(err.<span class="fn">mean</span>(), <span class="num">3</span>))
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Ortalama hata (yanlılık), sistematik olarak fazla mı yoksa az mı tahminde bulunduğunuzu söyler — düzeltilebilir bir problem. RMSE/MAE size sadece toplam büyüklüğü söyler.</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Özet ve Sonraki Adımlar</h2>
<p class="l-text">Artık temele sahipsiniz:</p>
<ul style="line-height:1.7"><li>Her seriyi önce ayrıştırın (trend + mevsimsel + artık) — bu size neyi modelleyeceğinizi ve neyin indirgenemez gürültü olduğunu söyler</li><li>Durağanlığı ADF ile test edin; gerekirse durağan olana kadar fark alın</li><li>Bir modelin "çalıştığını" iddia etmeden önce daima naif, mevsimsel naif, ortalama ve sürüklenmeye karşı karşılaştırın</li><li>MAE/RMSE/MASE kullanın — asla rastgele karıştırılmış CV kullanmayın</li></ul>
<p class="l-text"><strong>L2</strong>'de ilk gerçek modelleri inşa ediyoruz: AR, MA, ARIMA, SARIMA ve üstel düzgünleştirme (ETS / Holt-Winters). Bunlar 50 yıl boyunca tahminciliğe hâkim oldu ve hâlâ küçük veri kümelerinde Kaggle yarışmalarını kazanıyor.</p>
</div>`
};
