window.TIMESERIES_L2 = {
en: `<p class="l-text"><strong>ARIMA and exponential smoothing are the bedrock</strong> of classical forecasting. Walk into any retail planning team or a power-grid forecasting group and you'll find these models running in production — not LSTMs, not Transformers. Why? They are interpretable, work on tiny data (50 points is enough), require no GPU, and famously win the M-competitions when ensembled.</p>
<p class="l-text">In this lesson we build them from first principles: an autoregressive model is just linear regression on lags; a moving-average model is regression on past errors; ARIMA combines them on a differenced series; SARIMA extends to seasonal lags; and Holt-Winters is exponential smoothing with separate level/trend/season state variables. By the end you'll know exactly when to reach for each — and why a (1,1,1) ARIMA usually does 80% of the job.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>AR(p), MA(q), ARMA, ARIMA(p,d,q) explained as linear regression on history</li><li>SARIMA(p,d,q)(P,D,Q,m) for seasonal data</li><li>How to choose p, d, q from ACF / PACF plots</li><li>Exponential smoothing: simple, double (Holt), triple (Holt-Winters)</li><li>statsmodels API for ARIMA, SARIMAX, ExponentialSmoothing, ETS</li><li>Forecast intervals and how to read them honestly</li></ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. AR(p) — Autoregression</h2>
<p class="l-text">An <strong>AR(p)</strong> model says: today's value is a linear combination of the last p values plus noise.</p>
<div class="katex-block">$$y_t = c + \\phi_1 y_{t-1} + \\phi_2 y_{t-2} + \\ldots + \\phi_p y_{t-p} + \\varepsilon_t$$</div>
<p class="l-text">If you squint, this is just linear regression where the features are <code>[y[t-1], y[t-2], ..., y[t-p]]</code> and the target is <code>y[t]</code>. That insight is the whole secret — AR is regression on lags.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression

<span class="cm"># Fit AR(3) by hand on df_stocks closing returns</span>
y = np.<span class="fn">diff</span>(df_stocks[<span class="str">'close'</span>].values)   <span class="cm"># work on returns => stationary</span>
p = <span class="num">3</span>

<span class="cm"># Build lag matrix</span>
X = np.<span class="fn">column_stack</span>([y[p-i-<span class="num">1</span> : <span class="fn">len</span>(y)-i-<span class="num">1</span>] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(p)])
target = y[p:]

model = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X, target)
<span class="fn">print</span>(<span class="str">'AR(3) coefs:'</span>, np.<span class="fn">round</span>(model.coef_, <span class="num">4</span>))
<span class="fn">print</span>(<span class="str">'Intercept  :'</span>, <span class="fn">round</span>(model.intercept_, <span class="num">4</span>))

<span class="cm"># One-step-ahead forecast:</span>
last_3 = y[-<span class="num">3</span>:][::-<span class="num">1</span>]   <span class="cm"># most recent first</span>
yhat = model.intercept_ + np.<span class="fn">dot</span>(model.coef_, last_3)
<span class="fn">print</span>(<span class="str">'Next-day return forecast:'</span>, <span class="fn">round</span>(yhat, <span class="num">4</span>))
</code></pre></div>
<p class="l-text">For stock returns the coefficients are usually tiny (efficient markets eat the autocorrelation). For sales / traffic, AR(7) on daily data captures the weekly cycle nicely.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. MA(q) — Moving Average of Errors</h2>
<p class="l-text">An <strong>MA(q)</strong> model says: today's value is a linear combination of the last q forecast errors plus noise. It models <em>shock persistence</em>.</p>
<div class="katex-block">$$y_t = \\mu + \\varepsilon_t + \\theta_1 \\varepsilon_{t-1} + \\theta_2 \\varepsilon_{t-2} + \\ldots + \\theta_q \\varepsilon_{t-q}$$</div>
<p class="l-text">Where AR has long memory of values, MA has short memory of shocks: a surprise event last week still slightly nudges this week's prediction. MA is harder to fit than AR (errors aren't observed) — typically estimated by maximum likelihood.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Use AR when</div><div class="card-body">Series shows persistent trends — value today close to value yesterday. ACF decays slowly.</div></div>
<div class="calc-card"><div class="card-title">Use MA when</div><div class="card-body">Series mean-reverts quickly after shocks. ACF cuts off sharply after lag q.</div></div>
<div class="calc-card"><div class="card-title">Use ARMA when</div><div class="card-body">Both behaviours present. Most real series.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. ARIMA(p, d, q) — Integrated</h2>
<p class="l-text">If your series isn't stationary, difference it d times until it is, then fit ARMA on the differenced series. That's ARIMA.</p>
<div class="katex-block">$$\\text{ARIMA}(p, d, q): \\quad (1 - \\phi_1 B - \\ldots - \\phi_p B^p)(1-B)^d y_t = (1 + \\theta_1 B + \\ldots + \\theta_q B^q)\\varepsilon_t$$</div>
<p class="l-text">B is the backshift operator (B y[t] = y[t-1]). The (1-B)^d factor is differencing d times. d=0 means already stationary. d=1 means model the first differences. d=2 (rare) means differences of differences.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> statsmodels.tsa.arima.model <span class="kw">import</span> ARIMA

y = df_stocks[<span class="str">'close'</span>]
train, test = y[:-<span class="num">30</span>], y[-<span class="num">30</span>:]

model = <span class="fn">ARIMA</span>(train, order=(<span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>)).<span class="fn">fit</span>()
<span class="fn">print</span>(model.<span class="fn">summary</span>())

forecast = model.<span class="fn">forecast</span>(steps=<span class="num">30</span>)
<span class="fn">print</span>(<span class="str">'30-day forecast head:'</span>, forecast.<span class="fn">head</span>().<span class="fn">round</span>(<span class="num">2</span>).values)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Manual ARIMA(1,1,0): difference once, fit AR(1) by least squares, then re-integrate to forecast levels.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

y = df_stocks[<span class="str">'close'</span>].values
train, test = y[:-<span class="num">30</span>], y[-<span class="num">30</span>:]

<span class="cm"># Step 1: difference</span>
d_train = np.<span class="fn">diff</span>(train)

<span class="cm"># Step 2: fit AR(1) on differences via OLS  d_t = phi * d_{t-1} + eps</span>
X = d_train[:-<span class="num">1</span>].<span class="fn">reshape</span>(-<span class="num">1</span>, <span class="num">1</span>)
T = d_train[<span class="num">1</span>:]
phi = <span class="fn">float</span>(np.linalg.<span class="fn">lstsq</span>(X, T, rcond=<span class="kw">None</span>)[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">'AR(1) phi on diffs:'</span>, <span class="fn">round</span>(phi, <span class="num">4</span>))

<span class="cm"># Step 3: forecast 30 steps ahead in difference space, then cumsum + last train level</span>
last_diff = d_train[-<span class="num">1</span>]
diff_forecasts = []
d = last_diff
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">30</span>):
    d = phi * d
    diff_forecasts.<span class="fn">append</span>(d)
level_forecasts = train[-<span class="num">1</span>] + np.<span class="fn">cumsum</span>(diff_forecasts)

mae = <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(test - level_forecasts)))
<span class="fn">print</span>(<span class="str">'ARIMA(1,1,0) MAE on 30-day test:'</span>, <span class="fn">round</span>(mae, <span class="num">3</span>))
</code></pre></div></div>
<p class="l-text">The pyodide version captures the essence: ARIMA in level space = AR in difference space + cumulative sum at the end. statsmodels just adds MA terms and MLE.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Choosing p, d, q from ACF / PACF</h2>
<p class="l-text">The diagnostic ritual:</p>
<ol style="line-height:1.7"><li>Plot the series. Trending? Need d ≥ 1. Heteroskedastic? Maybe log-transform first.</li><li>Plot ACF (autocorrelation function) and PACF (partial autocorrelation).</li><li>If PACF cuts off after lag p and ACF decays → AR(p)</li><li>If ACF cuts off after lag q and PACF decays → MA(q)</li><li>If both decay → mixed ARMA, try (1,1,1) and iterate</li></ol>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">acf</span>(y, max_lag=<span class="num">20</span>):
    y = y - y.<span class="fn">mean</span>()
    var = (y * y).<span class="fn">mean</span>()
    <span class="kw">return</span> [<span class="fn">float</span>((y[:-k] * y[k:]).<span class="fn">mean</span>() / var) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, max_lag + <span class="num">1</span>)]

<span class="cm"># Returns (stationary)</span>
returns = np.<span class="fn">diff</span>(df_stocks[<span class="str">'close'</span>].values)
<span class="fn">print</span>(<span class="str">'ACF lags 1..10 of returns:'</span>)
<span class="kw">for</span> k, v <span class="kw">in</span> <span class="fn">enumerate</span>(<span class="fn">acf</span>(returns, <span class="num">10</span>), <span class="num">1</span>):
    bar = '<span class="cm">#' * int(abs(v) * 50)</span>
    <span class="fn">print</span>(f<span class="str">'  lag {k:2d}: {v:+.3f}  {bar}'</span>)
</code></pre></div>
<p class="l-text">Real-world tip: don't agonize. <code>(1,1,1)</code>, <code>(2,1,2)</code>, <code>(0,1,1)</code> cover 90% of cases. Use AIC/BIC to compare.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. SARIMA — Seasonal ARIMA</h2>
<p class="l-text">SARIMA(p,d,q)(P,D,Q,m) adds a second set of (P,D,Q) terms operating at the seasonal lag m. For daily data with weekly seasonality, m=7. For monthly with yearly seasonality, m=12.</p>
<div class="katex-block">$$\\text{SARIMA}(p,d,q)(P,D,Q,m): \\quad \\Phi(B^m)\\phi(B)(1-B)^d (1-B^m)^D y_t = \\Theta(B^m)\\theta(B)\\varepsilon_t$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> statsmodels.tsa.statespace.sarimax <span class="kw">import</span> SARIMAX

<span class="cm"># SARIMA(1,1,1)(1,1,1,7) — non-seasonal + weekly seasonal</span>
model = <span class="fn">SARIMAX</span>(train, order=(<span class="num">1</span>,<span class="num">1</span>,<span class="num">1</span>), seasonal_order=(<span class="num">1</span>,<span class="num">1</span>,<span class="num">1</span>,<span class="num">7</span>),
                enforce_stationarity=<span class="kw">False</span>, enforce_invertibility=<span class="kw">False</span>).<span class="fn">fit</span>(disp=<span class="kw">False</span>)
forecast = model.<span class="fn">forecast</span>(<span class="num">30</span>)
<span class="fn">print</span>(forecast.<span class="fn">head</span>().<span class="fn">round</span>(<span class="num">2</span>))
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Approximate SARIMA: subtract seasonal (day-of-week) means, fit AR on residuals, add seasonal back when forecasting.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

y = df_stocks[<span class="str">'close'</span>].<span class="fn">copy</span>()
y.index = pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>])
train, test = y.iloc[:-<span class="num">30</span>], y.iloc[-<span class="num">30</span>:]

<span class="cm"># 1) Seasonal pattern: per day-of-week mean of differences</span>
diffs = train.<span class="fn">diff</span>().<span class="fn">dropna</span>()
season = diffs.<span class="fn">groupby</span>(diffs.index.dayofweek).<span class="fn">mean</span>()  <span class="cm"># 5-7 values</span>
<span class="fn">print</span>(<span class="str">'Per-DOW mean diff:'</span>, season.<span class="fn">round</span>(<span class="num">4</span>).<span class="fn">to_dict</span>())

<span class="cm"># 2) Build forecast: at each future day, add back DOW seasonal increment</span>
last_level = train.iloc[-<span class="num">1</span>]
forecasts = []
<span class="kw">for</span> date <span class="kw">in</span> test.index:
    last_level = last_level + season[date.dayofweek]
    forecasts.<span class="fn">append</span>(last_level)

forecasts = np.<span class="fn">array</span>(forecasts)
mae = <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(test.values - forecasts)))
<span class="fn">print</span>(<span class="str">'Seasonal-AR MAE:'</span>, <span class="fn">round</span>(mae, <span class="num">3</span>))
</code></pre></div></div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Exponential Smoothing — Simple, Holt, Holt-Winters</h2>
<p class="l-text">Exponential smoothing is the other classical pillar. Recursive, fast, no matrix algebra. Three flavors:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SES (Simple)</div><div class="card-body">L[t] = α·y[t] + (1-α)·L[t-1]. Forecasts a flat line at the current level. No trend, no seasonality.</div></div>
<div class="calc-card"><div class="card-title">Holt (Double)</div><div class="card-body">Adds a trend component. Two state variables: level L and trend T. ŷ[t+h] = L[t] + h·T[t].</div></div>
<div class="calc-card"><div class="card-title">Holt-Winters (Triple)</div><div class="card-body">Adds seasonality S of period m. Three state vars. The classic for retail / utilities.</div></div>
</div>
<div class="katex-block">$$L_t = \\alpha y_t + (1-\\alpha) L_{t-1} \\qquad \\hat{y}_{t+1} = L_t \\quad (\\text{SES})$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

y = df_stocks[<span class="str">'close'</span>].values
train, test = y[:-<span class="num">30</span>], y[-<span class="num">30</span>:]

<span class="cm"># Simple Exponential Smoothing from scratch</span>
<span class="kw">def</span> <span class="fn">ses</span>(y, alpha=<span class="num">0.3</span>):
    L = y[<span class="num">0</span>]
    out = [L]
    <span class="kw">for</span> v <span class="kw">in</span> y[<span class="num">1</span>:]:
        L = alpha * v + (<span class="num">1</span> - alpha) * L
        out.<span class="fn">append</span>(L)
    <span class="kw">return</span> np.<span class="fn">array</span>(out)

L_series = <span class="fn">ses</span>(train, alpha=<span class="num">0.3</span>)
forecast = np.<span class="fn">full</span>(<span class="num">30</span>, L_series[-<span class="num">1</span>])
<span class="fn">print</span>(<span class="str">'SES MAE :'</span>, <span class="fn">round</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(test - forecast)), <span class="num">3</span>))

<span class="cm"># Holt's linear (level + trend)</span>
<span class="kw">def</span> <span class="fn">holt</span>(y, alpha=<span class="num">0.3</span>, beta=<span class="num">0.1</span>):
    L, T = y[<span class="num">0</span>], y[<span class="num">1</span>] - y[<span class="num">0</span>]
    levels, trends = [L], [T]
    <span class="kw">for</span> v <span class="kw">in</span> y[<span class="num">1</span>:]:
        L_new = alpha * v + (<span class="num">1</span> - alpha) * (L + T)
        T = beta * (L_new - L) + (<span class="num">1</span> - beta) * T
        L = L_new
        levels.<span class="fn">append</span>(L); trends.<span class="fn">append</span>(T)
    <span class="kw">return</span> np.<span class="fn">array</span>(levels), np.<span class="fn">array</span>(trends)

L, T = <span class="fn">holt</span>(train, alpha=<span class="num">0.3</span>, beta=<span class="num">0.1</span>)
holt_forecast = L[-<span class="num">1</span>] + T[-<span class="num">1</span>] * np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="num">31</span>)
<span class="fn">print</span>(<span class="str">'Holt MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(test - holt_forecast)), <span class="num">3</span>))
</code></pre></div>
<p class="l-text">α near 1 = trust new data heavily (responsive but jittery). α near 0 = trust history (smooth but lagging). Tune by grid search on a validation slice.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. ETS — Error / Trend / Seasonality Framework</h2>
<p class="l-text">ETS generalizes exponential smoothing into a state-space framework with explicit error component. Each of E, T, S can be Additive (A), Multiplicative (M), or None (N). Notation: ETS(A,A,A) = additive error + additive trend + additive seasonality = additive Holt-Winters.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> statsmodels.tsa.holtwinters <span class="kw">import</span> ExponentialSmoothing

model = <span class="fn">ExponentialSmoothing</span>(train, trend=<span class="str">'add'</span>, seasonal=<span class="str">'add'</span>,
                             seasonal_periods=<span class="num">7</span>).<span class="fn">fit</span>()
forecast = model.<span class="fn">forecast</span>(<span class="num">30</span>)
<span class="fn">print</span>(forecast.<span class="fn">head</span>().<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">'Holt-Winters MAE:'</span>, <span class="fn">round</span>((test - forecast).<span class="fn">abs</span>().<span class="fn">mean</span>(), <span class="num">3</span>))
</code></pre></div>
<p class="l-text">ETS(M,A,M) (multiplicative seasonal) is what to reach for when seasonal swings grow proportionally with the level — classic retail (December peak gets bigger every year).</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Forecast Intervals — Don't Lie About Uncertainty</h2>
<p class="l-text">A point forecast is half a forecast. Always emit prediction intervals. The simplest: <strong>residual bootstrap</strong>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

y = df_stocks[<span class="str">'close'</span>].values
train, test = y[:-<span class="num">30</span>], y[-<span class="num">30</span>:]

<span class="cm"># Naive in-sample residuals</span>
in_sample_naive = train[:-<span class="num">1</span>]
in_sample_actual = train[<span class="num">1</span>:]
residuals = in_sample_actual - in_sample_naive
sigma = residuals.<span class="fn">std</span>()
<span class="fn">print</span>(<span class="str">'Residual std:'</span>, <span class="fn">round</span>(sigma, <span class="num">3</span>))

<span class="cm"># 95% PI for a 1-step naive forecast</span>
point = train[-<span class="num">1</span>]
lo, hi = point - <span class="num">1.96</span> * sigma, point + <span class="num">1.96</span> * sigma
<span class="fn">print</span>(f<span class="str">'1-step naive forecast: {point:.2f}  (95% PI: {lo:.2f} .. {hi:.2f})'</span>)

<span class="cm"># h-step PI grows with sqrt(h) under random walk assumption</span>
<span class="kw">for</span> h <span class="kw">in</span> [<span class="num">1</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">30</span>]:
    band = <span class="num">1.96</span> * sigma * np.<span class="fn">sqrt</span>(h)
    <span class="fn">print</span>(f<span class="str">'  h={h:2d}-step: ± {band:.2f}'</span>)
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">A common production failure: a forecast says "$120" with confidence — but the 95% PI is [$80, $160]. Always show the PI to the decision-maker.</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Recap & Next Steps</h2>
<ul style="line-height:1.7"><li>AR / MA / ARIMA — interpretable, tiny-data friendly, still SOTA on M-competitions when ensembled</li><li>SARIMA for explicit seasonal structure</li><li>Holt-Winters / ETS for level + trend + seasonal state</li><li>Always emit prediction intervals; point forecasts alone are dangerous</li></ul>
<p class="l-text">In <strong>L3</strong> we move to Facebook Prophet — the practitioner's favorite for messy real-world data with holidays, multiple seasonalities, and changepoints. We'll also dig deeper into STL.</p>
</div>`,
tr: `<p class="l-text"><strong>ARIMA ve üstel düzgünleştirme, klasik tahminciliğin temel taşıdır.</strong> Herhangi bir perakende planlama ekibine veya bir elektrik şebekesi tahmin grubuna girin ve bu modellerin üretimde çalıştığını göreceksiniz — LSTM'ler değil, Transformer'lar değil. Neden? Yorumlanabilirler, küçük verilerde çalışırlar (50 nokta yeterlidir), GPU gerektirmezler ve birleştirildiğinde M-yarışmalarını kazanmalarıyla ünlüdürler.</p>
<p class="l-text">Bu derste onları temel ilkelerden inşa ediyoruz: bir otoregresif model, gecikmeler üzerinde sadece doğrusal regresyondur; bir hareketli ortalama modeli, geçmiş hatalar üzerinde regresyondur; ARIMA, fark alınmış bir seri üzerinde bunları birleştirir; SARIMA mevsimsel gecikmelere genişletir; ve Holt-Winters, ayrı seviye/trend/mevsim durum değişkenleriyle üstel düzgünleştirmedir. Sonunda her birine ne zaman uzanacağınızı tam olarak bileceksiniz — ve neden bir (1,1,1) ARIMA'nın genellikle işin %80'ini yaptığını.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>AR(p), MA(q), ARMA, ARIMA(p,d,q) tarihçe üzerinde doğrusal regresyon olarak açıklanır</li><li>Mevsimsel veri için SARIMA(p,d,q)(P,D,Q,m)</li><li>p, d, q'yu ACF / PACF grafiklerinden nasıl seçeceğiniz</li><li>Üstel düzgünleştirme: basit, çift (Holt), üçlü (Holt-Winters)</li><li>ARIMA, SARIMAX, ExponentialSmoothing, ETS için statsmodels API</li><li>Tahmin aralıkları ve onları dürüstçe nasıl okuyacağınız</li></ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. AR(p) — Otoregresyon</h2>
<p class="l-text">Bir <strong>AR(p)</strong> modeli şunu söyler: bugünün değeri, son p değerin doğrusal bir kombinasyonu artı gürültüdür.</p>
<div class="katex-block">$$y_t = c + \\phi_1 y_{t-1} + \\phi_2 y_{t-2} + \\ldots + \\phi_p y_{t-p} + \\varepsilon_t$$</div>
<p class="l-text">Eğer gözlerinizi kısarsanız, bu sadece özelliklerin <code>[y[t-1], y[t-2], ..., y[t-p]]</code> ve hedefin <code>y[t]</code> olduğu doğrusal regresyondur. Bu içgörü tüm sırrı oluşturur — AR, gecikmeler üzerinde regresyondur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression

<span class="cm"># df_stocks kapanış getirileri üzerinde elle AR(3) uydurma</span>
y = np.<span class="fn">diff</span>(df_stocks[<span class="str">'close'</span>].values)   <span class="cm"># getiriler üzerinde çalış => durağan</span>
p = <span class="num">3</span>

<span class="cm"># Gecikme matrisi oluştur</span>
X = np.<span class="fn">column_stack</span>([y[p-i-<span class="num">1</span> : <span class="fn">len</span>(y)-i-<span class="num">1</span>] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(p)])
target = y[p:]

model = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X, target)
<span class="fn">print</span>(<span class="str">'AR(3) coefs:'</span>, np.<span class="fn">round</span>(model.coef_, <span class="num">4</span>))
<span class="fn">print</span>(<span class="str">'Intercept  :'</span>, <span class="fn">round</span>(model.intercept_, <span class="num">4</span>))

<span class="cm"># Bir adım ileri tahmin:</span>
last_3 = y[-<span class="num">3</span>:][::-<span class="num">1</span>]   <span class="cm"># en yeni önce</span>
yhat = model.intercept_ + np.<span class="fn">dot</span>(model.coef_, last_3)
<span class="fn">print</span>(<span class="str">'Next-day return forecast:'</span>, <span class="fn">round</span>(yhat, <span class="num">4</span>))
</code></pre></div>
<p class="l-text">Hisse getirileri için katsayılar genellikle çok küçüktür (etkin piyasalar otokorelasyonu yer bitirir). Satışlar / trafik için, günlük veri üzerinde AR(7) haftalık döngüyü güzelce yakalar.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. MA(q) — Hataların Hareketli Ortalaması</h2>
<p class="l-text">Bir <strong>MA(q)</strong> modeli şunu söyler: bugünün değeri, son q tahmin hatasının doğrusal bir kombinasyonu artı gürültüdür. <em>Şok kalıcılığını</em> modeller.</p>
<div class="katex-block">$$y_t = \\mu + \\varepsilon_t + \\theta_1 \\varepsilon_{t-1} + \\theta_2 \\varepsilon_{t-2} + \\ldots + \\theta_q \\varepsilon_{t-q}$$</div>
<p class="l-text">AR'nin değerlere uzun belleği varken, MA'nın şoklara kısa belleği vardır: geçen haftaki sürpriz bir olay, bu haftaki tahmini hâlâ hafifçe iter. MA, AR'den daha zor uydurulur (hatalar gözlemlenmez) — tipik olarak en yüksek olasılıkla tahmin edilir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">AR'yi şu durumda kullan</div><div class="card-body">Seri kalıcı trendler gösterir — bugünün değeri dünün değerine yakın. ACF yavaş bozulur.</div></div>
<div class="calc-card"><div class="card-title">MA'yı şu durumda kullan</div><div class="card-body">Seri şoklardan sonra hızla ortalamaya geri döner. ACF, gecikme q'dan sonra keskin biter.</div></div>
<div class="calc-card"><div class="card-title">ARMA'yı şu durumda kullan</div><div class="card-body">Her iki davranış da var. Çoğu gerçek seri.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. ARIMA(p, d, q) — Tümleşik</h2>
<p class="l-text">Eğer seriniz durağan değilse, durağan olana kadar d kez fark alın, sonra fark alınmış seri üzerinde ARMA uydurun. İşte ARIMA budur.</p>
<div class="katex-block">$$\\text{ARIMA}(p, d, q): \\quad (1 - \\phi_1 B - \\ldots - \\phi_p B^p)(1-B)^d y_t = (1 + \\theta_1 B + \\ldots + \\theta_q B^q)\\varepsilon_t$$</div>
<p class="l-text">B geriye kaydırma operatörüdür (B y[t] = y[t-1]). (1-B)^d faktörü d kez fark almadır. d=0, zaten durağan demektir. d=1, ilk farkları modelle demektir. d=2 (nadir), farkların farkları demektir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> statsmodels.tsa.arima.model <span class="kw">import</span> ARIMA

y = df_stocks[<span class="str">'close'</span>]
train, test = y[:-<span class="num">30</span>], y[-<span class="num">30</span>:]

model = <span class="fn">ARIMA</span>(train, order=(<span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>)).<span class="fn">fit</span>()
<span class="fn">print</span>(model.<span class="fn">summary</span>())

forecast = model.<span class="fn">forecast</span>(steps=<span class="num">30</span>)
<span class="fn">print</span>(<span class="str">'30-day forecast head:'</span>, forecast.<span class="fn">head</span>().<span class="fn">round</span>(<span class="num">2</span>).values)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Elle ARIMA(1,1,0): bir kez fark al, en küçük karelerle AR(1) uydur, sonra seviyeleri tahmin etmek için yeniden tümleştir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

y = df_stocks[<span class="str">'close'</span>].values
train, test = y[:-<span class="num">30</span>], y[-<span class="num">30</span>:]

<span class="cm"># Adım 1: fark al</span>
d_train = np.<span class="fn">diff</span>(train)

<span class="cm"># Adım 2: farklar üzerinde OLS ile AR(1) uydur  d_t = phi * d_{t-1} + eps</span>
X = d_train[:-<span class="num">1</span>].<span class="fn">reshape</span>(-<span class="num">1</span>, <span class="num">1</span>)
T = d_train[<span class="num">1</span>:]
phi = <span class="fn">float</span>(np.linalg.<span class="fn">lstsq</span>(X, T, rcond=<span class="kw">None</span>)[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">'AR(1) phi on diffs:'</span>, <span class="fn">round</span>(phi, <span class="num">4</span>))

<span class="cm"># Adım 3: fark uzayında 30 adım ileri tahmin et, sonra cumsum + son eğitim seviyesi</span>
last_diff = d_train[-<span class="num">1</span>]
diff_forecasts = []
d = last_diff
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">30</span>):
    d = phi * d
    diff_forecasts.<span class="fn">append</span>(d)
level_forecasts = train[-<span class="num">1</span>] + np.<span class="fn">cumsum</span>(diff_forecasts)

mae = <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(test - level_forecasts)))
<span class="fn">print</span>(<span class="str">'ARIMA(1,1,0) MAE on 30-day test:'</span>, <span class="fn">round</span>(mae, <span class="num">3</span>))
</code></pre></div></div>
<p class="l-text">Pyodide sürümü özünü yakalar: seviye uzayında ARIMA = fark uzayında AR + sonunda kümülatif toplam. statsmodels sadece MA terimleri ve MLE ekler.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. ACF / PACF'den p, d, q Seçimi</h2>
<p class="l-text">Tanı ritüeli:</p>
<ol style="line-height:1.7"><li>Seriyi çiz. Trendli mi? d ≥ 1 gerekir. Heteroskedastik mi? Önce log dönüşümü olabilir.</li><li>ACF (otokorelasyon fonksiyonu) ve PACF (kısmi otokorelasyon) çiz.</li><li>PACF gecikme p'den sonra biterse ve ACF bozulursa → AR(p)</li><li>ACF gecikme q'dan sonra biterse ve PACF bozulursa → MA(q)</li><li>Her ikisi de bozulursa → karışık ARMA, (1,1,1) deneyin ve yineleyin</li></ol>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">acf</span>(y, max_lag=<span class="num">20</span>):
    y = y - y.<span class="fn">mean</span>()
    var = (y * y).<span class="fn">mean</span>()
    <span class="kw">return</span> [<span class="fn">float</span>((y[:-k] * y[k:]).<span class="fn">mean</span>() / var) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, max_lag + <span class="num">1</span>)]

<span class="cm"># Getiriler (durağan)</span>
returns = np.<span class="fn">diff</span>(df_stocks[<span class="str">'close'</span>].values)
<span class="fn">print</span>(<span class="str">'ACF lags 1..10 of returns:'</span>)
<span class="kw">for</span> k, v <span class="kw">in</span> <span class="fn">enumerate</span>(<span class="fn">acf</span>(returns, <span class="num">10</span>), <span class="num">1</span>):
    bar = '<span class="cm">#' * int(abs(v) * 50)</span>
    <span class="fn">print</span>(f<span class="str">'  lag {k:2d}: {v:+.3f}  {bar}'</span>)
</code></pre></div>
<p class="l-text">Gerçek dünya ipucu: stres yapmayın. <code>(1,1,1)</code>, <code>(2,1,2)</code>, <code>(0,1,1)</code> vakaların %90'ını kapsar. Karşılaştırmak için AIC/BIC kullanın.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. SARIMA — Mevsimsel ARIMA</h2>
<p class="l-text">SARIMA(p,d,q)(P,D,Q,m), mevsimsel gecikme m'de çalışan ikinci bir (P,D,Q) terim kümesi ekler. Haftalık mevsimselliği olan günlük veri için, m=7. Yıllık mevsimselliği olan aylık için, m=12.</p>
<div class="katex-block">$$\\text{SARIMA}(p,d,q)(P,D,Q,m): \\quad \\Phi(B^m)\\phi(B)(1-B)^d (1-B^m)^D y_t = \\Theta(B^m)\\theta(B)\\varepsilon_t$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> statsmodels.tsa.statespace.sarimax <span class="kw">import</span> SARIMAX

<span class="cm"># SARIMA(1,1,1)(1,1,1,7) — mevsimsel olmayan + haftalık mevsimsel</span>
model = <span class="fn">SARIMAX</span>(train, order=(<span class="num">1</span>,<span class="num">1</span>,<span class="num">1</span>), seasonal_order=(<span class="num">1</span>,<span class="num">1</span>,<span class="num">1</span>,<span class="num">7</span>),
                enforce_stationarity=<span class="kw">False</span>, enforce_invertibility=<span class="kw">False</span>).<span class="fn">fit</span>(disp=<span class="kw">False</span>)
forecast = model.<span class="fn">forecast</span>(<span class="num">30</span>)
<span class="fn">print</span>(forecast.<span class="fn">head</span>().<span class="fn">round</span>(<span class="num">2</span>))
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Yaklaşık SARIMA: mevsimsel (haftanın günü) ortalamalarını çıkar, artıklar üzerinde AR uydur, tahmin yaparken mevsimi geri ekle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

y = df_stocks[<span class="str">'close'</span>].<span class="fn">copy</span>()
y.index = pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>])
train, test = y.iloc[:-<span class="num">30</span>], y.iloc[-<span class="num">30</span>:]

<span class="cm"># 1) Mevsimsel desen: farkların haftanın günü başına ortalaması</span>
diffs = train.<span class="fn">diff</span>().<span class="fn">dropna</span>()
season = diffs.<span class="fn">groupby</span>(diffs.index.dayofweek).<span class="fn">mean</span>()  <span class="cm"># 5-7 değer</span>
<span class="fn">print</span>(<span class="str">'Per-DOW mean diff:'</span>, season.<span class="fn">round</span>(<span class="num">4</span>).<span class="fn">to_dict</span>())

<span class="cm"># 2) Tahmin oluştur: her gelecek günde, DOW mevsimsel artışı geri ekle</span>
last_level = train.iloc[-<span class="num">1</span>]
forecasts = []
<span class="kw">for</span> date <span class="kw">in</span> test.index:
    last_level = last_level + season[date.dayofweek]
    forecasts.<span class="fn">append</span>(last_level)

forecasts = np.<span class="fn">array</span>(forecasts)
mae = <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(test.values - forecasts)))
<span class="fn">print</span>(<span class="str">'Seasonal-AR MAE:'</span>, <span class="fn">round</span>(mae, <span class="num">3</span>))
</code></pre></div></div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Üstel Düzgünleştirme — Basit, Holt, Holt-Winters</h2>
<p class="l-text">Üstel düzgünleştirme, diğer klasik sütundur. Özyinelemeli, hızlı, matris cebiri yok. Üç çeşit:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SES (Basit)</div><div class="card-body">L[t] = α·y[t] + (1-α)·L[t-1]. Mevcut seviyede düz bir çizgi tahmin eder. Trend yok, mevsimsellik yok.</div></div>
<div class="calc-card"><div class="card-title">Holt (Çift)</div><div class="card-body">Bir trend bileşeni ekler. İki durum değişkeni: seviye L ve trend T. ŷ[t+h] = L[t] + h·T[t].</div></div>
<div class="calc-card"><div class="card-title">Holt-Winters (Üçlü)</div><div class="card-body">m periyodunda mevsimsellik S ekler. Üç durum değişkeni. Perakende / kamu hizmetleri için klasiktir.</div></div>
</div>
<div class="katex-block">$$L_t = \\alpha y_t + (1-\\alpha) L_{t-1} \\qquad \\hat{y}_{t+1} = L_t \\quad (\\text{SES})$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

y = df_stocks[<span class="str">'close'</span>].values
train, test = y[:-<span class="num">30</span>], y[-<span class="num">30</span>:]

<span class="cm"># Sıfırdan Basit Üstel Düzgünleştirme</span>
<span class="kw">def</span> <span class="fn">ses</span>(y, alpha=<span class="num">0.3</span>):
    L = y[<span class="num">0</span>]
    out = [L]
    <span class="kw">for</span> v <span class="kw">in</span> y[<span class="num">1</span>:]:
        L = alpha * v + (<span class="num">1</span> - alpha) * L
        out.<span class="fn">append</span>(L)
    <span class="kw">return</span> np.<span class="fn">array</span>(out)

L_series = <span class="fn">ses</span>(train, alpha=<span class="num">0.3</span>)
forecast = np.<span class="fn">full</span>(<span class="num">30</span>, L_series[-<span class="num">1</span>])
<span class="fn">print</span>(<span class="str">'SES MAE :'</span>, <span class="fn">round</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(test - forecast)), <span class="num">3</span>))

<span class="cm"># Holt'un doğrusal yöntemi (seviye + trend)</span>
<span class="kw">def</span> <span class="fn">holt</span>(y, alpha=<span class="num">0.3</span>, beta=<span class="num">0.1</span>):
    L, T = y[<span class="num">0</span>], y[<span class="num">1</span>] - y[<span class="num">0</span>]
    levels, trends = [L], [T]
    <span class="kw">for</span> v <span class="kw">in</span> y[<span class="num">1</span>:]:
        L_new = alpha * v + (<span class="num">1</span> - alpha) * (L + T)
        T = beta * (L_new - L) + (<span class="num">1</span> - beta) * T
        L = L_new
        levels.<span class="fn">append</span>(L); trends.<span class="fn">append</span>(T)
    <span class="kw">return</span> np.<span class="fn">array</span>(levels), np.<span class="fn">array</span>(trends)

L, T = <span class="fn">holt</span>(train, alpha=<span class="num">0.3</span>, beta=<span class="num">0.1</span>)
holt_forecast = L[-<span class="num">1</span>] + T[-<span class="num">1</span>] * np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="num">31</span>)
<span class="fn">print</span>(<span class="str">'Holt MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(test - holt_forecast)), <span class="num">3</span>))
</code></pre></div>
<p class="l-text">α 1'e yakın = yeni veriye çok güven (duyarlı ama titrek). α 0'a yakın = tarihçeye güven (düzgün ama gecikmeli). Bir doğrulama dilimi üzerinde grid arama ile ayarlayın.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. ETS — Hata / Trend / Mevsimsellik Çerçevesi</h2>
<p class="l-text">ETS, üstel düzgünleştirmeyi açık hata bileşenli bir durum-uzayı çerçevesine genelleştirir. E, T, S'nin her biri Toplamsal (A), Çarpımsal (M) veya Yok (N) olabilir. Notasyon: ETS(A,A,A) = toplamsal hata + toplamsal trend + toplamsal mevsimsellik = toplamsal Holt-Winters.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> statsmodels.tsa.holtwinters <span class="kw">import</span> ExponentialSmoothing

model = <span class="fn">ExponentialSmoothing</span>(train, trend=<span class="str">'add'</span>, seasonal=<span class="str">'add'</span>,
                             seasonal_periods=<span class="num">7</span>).<span class="fn">fit</span>()
forecast = model.<span class="fn">forecast</span>(<span class="num">30</span>)
<span class="fn">print</span>(forecast.<span class="fn">head</span>().<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">'Holt-Winters MAE:'</span>, <span class="fn">round</span>((test - forecast).<span class="fn">abs</span>().<span class="fn">mean</span>(), <span class="num">3</span>))
</code></pre></div>
<p class="l-text">ETS(M,A,M) (çarpımsal mevsimsel), mevsimsel salınımlar seviyeyle orantılı olarak büyüdüğünde uzanmanız gereken şeydir — klasik perakende (Aralık zirvesi her yıl daha büyük olur).</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Tahmin Aralıkları — Belirsizlik Hakkında Yalan Söylemeyin</h2>
<p class="l-text">Bir nokta tahmini, yarım tahmindir. Daima tahmin aralıkları yayınlayın. En basiti: <strong>artık önyüklemesi (residual bootstrap)</strong>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

y = df_stocks[<span class="str">'close'</span>].values
train, test = y[:-<span class="num">30</span>], y[-<span class="num">30</span>:]

<span class="cm"># Naif örneklem-içi artıklar</span>
in_sample_naive = train[:-<span class="num">1</span>]
in_sample_actual = train[<span class="num">1</span>:]
residuals = in_sample_actual - in_sample_naive
sigma = residuals.<span class="fn">std</span>()
<span class="fn">print</span>(<span class="str">'Residual std:'</span>, <span class="fn">round</span>(sigma, <span class="num">3</span>))

<span class="cm"># 1-adımlık naif tahmin için %95 PI</span>
point = train[-<span class="num">1</span>]
lo, hi = point - <span class="num">1.96</span> * sigma, point + <span class="num">1.96</span> * sigma
<span class="fn">print</span>(f<span class="str">'1-step naive forecast: {point:.2f}  (95% PI: {lo:.2f} .. {hi:.2f})'</span>)

<span class="cm"># h-adım PI rastgele yürüyüş varsayımı altında sqrt(h) ile büyür</span>
<span class="kw">for</span> h <span class="kw">in</span> [<span class="num">1</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">30</span>]:
    band = <span class="num">1.96</span> * sigma * np.<span class="fn">sqrt</span>(h)
    <span class="fn">print</span>(f<span class="str">'  h={h:2d}-step: ± {band:.2f}'</span>)
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Yaygın bir üretim hatası: bir tahmin güvenle "$120" der — ama %95 PI [$80, $160]'tir. PI'yı daima karar vericiye gösterin.</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Özet ve Sonraki Adımlar</h2>
<ul style="line-height:1.7"><li>AR / MA / ARIMA — yorumlanabilir, küçük veri dostu, birleştirildiğinde M-yarışmalarında hâlâ SOTA</li><li>Açık mevsimsel yapı için SARIMA</li><li>Seviye + trend + mevsimsel durum için Holt-Winters / ETS</li><li>Daima tahmin aralıkları yayınlayın; tek başına nokta tahminleri tehlikelidir</li></ul>
<p class="l-text"><strong>L3</strong>'te Facebook Prophet'a geçiyoruz — tatiller, çoklu mevsimsellikler ve değişim noktaları olan dağınık gerçek dünya verisi için pratisyenlerin favorisi. STL'i de daha derinlemesine kazacağız.</p>
</div>`
};
