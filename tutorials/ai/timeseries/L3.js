window.TIMESERIES_L3 = {
en: `<p class="l-text"><strong>Prophet was Facebook's gift to overworked analysts.</strong> Released in 2017, it lets a non-statistician produce a credible forecast in five lines of code on data riddled with holidays, level shifts, multiple seasonalities, and missing weeks. Under the hood it's a structural model: trend(t) + seasonality(t) + holidays(t) + ε — fitted via Stan with sensible default priors.</p>
<p class="l-text">In this lesson we use Prophet on real data, learn its three killer features (changepoint detection, multiplicative seasonality, holiday effects), and then strip back to a manual STL implementation so you understand what's actually happening. By the end you'll know when Prophet wins (messy business data with holidays), when it loses (high-frequency, financial, scientific) and how to debug the trend that always seems to forecast straight up.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Prophet's structural model: trend + seasonality + holidays</li><li>Changepoint detection — automatic level/slope shift handling</li><li>Multiplicative vs additive seasonality (when each fits)</li><li>Adding country holidays and custom event regressors</li><li>Hands-on STL decomposition (Loess-based) for diagnostics</li><li>Cross-validation with Prophet's built-in rolling-origin tool</li><li>When Prophet is the wrong tool</li></ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Prophet's Structural Model</h2>
<p class="l-text">Prophet decomposes the series as:</p>
<div class="katex-block">$$y(t) = g(t) + s(t) + h(t) + \\varepsilon_t$$</div>
<ul style="line-height:1.7"><li><strong>g(t)</strong> — piecewise linear or logistic trend with automatic changepoints</li><li><strong>s(t)</strong> — Fourier series for periodic seasonality (yearly, weekly, daily)</li><li><strong>h(t)</strong> — holiday and event effects (user-supplied dates)</li><li><strong>ε</strong> — Gaussian noise</li></ul>
<p class="l-text">No autoregressive component. Prophet doesn't condition on y[t-1] — it fits curves to the timestamp index. That's both its strength (robust to gaps and outliers) and weakness (ignores short-term momentum a real ARIMA captures).</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Quickstart — The Five-Line Forecast</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> prophet <span class="kw">import</span> Prophet
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Prophet wants exactly two columns named ds (date) and y</span>
df = pd.<span class="fn">DataFrame</span>({
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>]),
    <span class="str">'y'</span>:  df_stocks[<span class="str">'close'</span>]
})

m = <span class="fn">Prophet</span>()
m.<span class="fn">fit</span>(df)

future = m.<span class="fn">make_future_dataframe</span>(periods=<span class="num">30</span>)   <span class="cm"># 30 days ahead</span>
forecast = m.<span class="fn">predict</span>(future)
<span class="fn">print</span>(forecast[[<span class="str">'ds'</span>, <span class="str">'yhat'</span>, <span class="str">'yhat_lower'</span>, <span class="str">'yhat_upper'</span>]].<span class="fn">tail</span>())
m.<span class="fn">plot</span>(forecast)
m.<span class="fn">plot_components</span>(forecast)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Manual Prophet-like model: piecewise linear trend (with changepoints) + Fourier seasonality, fit by least squares on df_stocks.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

y = df_stocks[<span class="str">'close'</span>].values
n = <span class="fn">len</span>(y)
t = np.<span class="fn">arange</span>(n)

<span class="cm"># 1) Build piecewise linear trend basis: 5 changepoints evenly spaced</span>
cps = np.<span class="fn">linspace</span>(n*<span class="num">0.1</span>, n*<span class="num">0.9</span>, <span class="num">5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
trend_basis = [t]                                <span class="cm"># base slope</span>
<span class="kw">for</span> cp <span class="kw">in</span> cps:
    trend_basis.<span class="fn">append</span>(np.<span class="fn">maximum</span>(<span class="num">0</span>, t - cp))    <span class="cm"># hinge at each cp</span>
trend_basis.<span class="fn">append</span>(np.<span class="fn">ones</span>(n))                   <span class="cm"># intercept</span>
X_trend = np.<span class="fn">column_stack</span>(trend_basis)

<span class="cm"># 2) Fourier seasonality: weekly (5 b-day cycle) and monthly (~21)</span>
<span class="kw">def</span> <span class="fn">fourier</span>(t, period, K):
    cols = []
    <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>):
        cols.<span class="fn">append</span>(np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*k*t/period))
        cols.<span class="fn">append</span>(np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*k*t/period))
    <span class="kw">return</span> np.<span class="fn">column_stack</span>(cols)

X_season = np.<span class="fn">column_stack</span>([<span class="fn">fourier</span>(t, <span class="num">5</span>, <span class="num">2</span>), <span class="fn">fourier</span>(t, <span class="num">21</span>, <span class="num">3</span>)])

<span class="cm"># 3) Combine and fit OLS</span>
X = np.<span class="fn">column_stack</span>([X_trend, X_season])
beta, *_ = np.linalg.<span class="fn">lstsq</span>(X, y, rcond=<span class="kw">None</span>)
fitted = X @ beta
<span class="fn">print</span>(<span class="str">'In-sample MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y - fitted)), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'Trend coefs:'</span>, np.<span class="fn">round</span>(beta[:<span class="fn">len</span>(trend_basis)], <span class="num">4</span>))
</code></pre></div></div>
<p class="l-text">The pyodide version captures Prophet's two key tricks: hinge basis for changepoints + sin/cos basis for seasonality. Add a holiday dummy column and you have a basic Prophet.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Changepoints — The Trend Bends</h2>
<p class="l-text">Real businesses don't grow linearly forever. Covid hit. The product launched. The competitor dumped prices. Prophet automatically places 25 candidate changepoints in the first 80% of the series and shrinks irrelevant ones to zero (Laplace prior, sparsity).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">changepoint_prior_scale</div><div class="card-body">Default 0.05. Higher (0.5) = trend bends more freely (overfits). Lower (0.001) = nearly straight line (underfits).</div></div>
<div class="calc-card"><div class="card-title">n_changepoints</div><div class="card-body">Default 25. Too few misses regime shifts; too many invites overfitting if prior_scale is large.</div></div>
<div class="calc-card"><div class="card-title">changepoints (manual)</div><div class="card-body">Pass a list of dates if you know exactly when the level shifted (product launch).</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> prophet <span class="kw">import</span> Prophet

m = <span class="fn">Prophet</span>(changepoint_prior_scale=<span class="num">0.1</span>, n_changepoints=<span class="num">10</span>)
m.<span class="fn">fit</span>(df)
future = m.<span class="fn">make_future_dataframe</span>(periods=<span class="num">60</span>)
fcst = m.<span class="fn">predict</span>(future)

<span class="cm"># Inspect detected changepoints</span>
<span class="kw">from</span> prophet.plot <span class="kw">import</span> add_changepoints_to_plot
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
fig = m.<span class="fn">plot</span>(fcst)
<span class="fn">add_changepoints_to_plot</span>(fig.<span class="fn">gca</span>(), m, fcst)
plt.<span class="fn">show</span>()

<span class="cm"># Significant changepoints (large delta)</span>
sig = m.changepoints[<span class="fn">abs</span>(m.params[<span class="str">'delta'</span>].<span class="fn">mean</span>(<span class="num">0</span>)) > <span class="num">0.01</span>]
<span class="fn">print</span>(<span class="str">'Significant changepoints:'</span>, sig.<span class="fn">tolist</span>())
</code></pre></div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Multiplicative vs Additive Seasonality</h2>
<p class="l-text">Additive: seasonal swings are constant in magnitude (+50 every December). Multiplicative: swings grow with the level (+10% every December — so $100 in 2020, $200 in 2026 means a $10 vs $20 December bump).</p>
<div class="katex-block">$$\\text{additive: } y = T + S \\qquad \\text{multiplicative: } y = T \\cdot (1 + S)$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>m_add  = <span class="fn">Prophet</span>(seasonality_mode=<span class="str">'additive'</span>).<span class="fn">fit</span>(df)
m_mult = <span class="fn">Prophet</span>(seasonality_mode=<span class="str">'multiplicative'</span>).<span class="fn">fit</span>(df)

<span class="cm"># Hold out 30 days, compare</span>
train = df.iloc[:-<span class="num">30</span>]
test  = df.iloc[-<span class="num">30</span>:]
ma  = <span class="fn">Prophet</span>(seasonality_mode=<span class="str">'additive'</span>).<span class="fn">fit</span>(train)
mm  = <span class="fn">Prophet</span>(seasonality_mode=<span class="str">'multiplicative'</span>).<span class="fn">fit</span>(train)

f_add  = ma.<span class="fn">predict</span>(test[[<span class="str">'ds'</span>]])
f_mult = mm.<span class="fn">predict</span>(test[[<span class="str">'ds'</span>]])
mae_add  = (test[<span class="str">'y'</span>].values - f_add[<span class="str">'yhat'</span>].values).<span class="fn">__abs__</span>().<span class="fn">mean</span>()
mae_mult = (test[<span class="str">'y'</span>].values - f_mult[<span class="str">'yhat'</span>].values).<span class="fn">__abs__</span>().<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">'Additive MAE: {mae_add:.3f}   Multiplicative MAE: {mae_mult:.3f}'</span>)
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Heuristic: if you log-transform the series and the seasonal swings become constant, you wanted multiplicative. Or just A/B test it.</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Holidays & Custom Events</h2>
<p class="l-text">Prophet ships with country holiday calendars (US, UK, TR, India, ...). You can also pass arbitrary "events" — Black Friday, product launch, a marketing campaign — as a dataframe of (holiday, ds, lower_window, upper_window).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> prophet <span class="kw">import</span> Prophet

events = pd.<span class="fn">DataFrame</span>({
    <span class="str">'holiday'</span>: [<span class="str">'black_friday'</span>, <span class="str">'black_friday'</span>, <span class="str">'launch'</span>],
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>([<span class="str">'2024-11-29'</span>, <span class="str">'2025-11-28'</span>, <span class="str">'2024-06-15'</span>]),
    <span class="str">'lower_window'</span>: [-<span class="num">1</span>, -<span class="num">1</span>, <span class="num">0</span>],   <span class="cm"># effect starts 1 day before</span>
    <span class="str">'upper_window'</span>: [<span class="num">3</span>,  <span class="num">3</span>,  <span class="num">7</span>],   <span class="cm"># effect lasts a few days after</span>
})

m = <span class="fn">Prophet</span>(holidays=events)
m.<span class="fn">add_country_holidays</span>(country_name=<span class="str">'US'</span>)
m.<span class="fn">fit</span>(df)
fcst = m.<span class="fn">predict</span>(m.<span class="fn">make_future_dataframe</span>(<span class="num">60</span>))

<span class="cm"># Inspect holiday effect components</span>
<span class="fn">print</span>(fcst[[<span class="str">'ds'</span>, <span class="str">'yhat'</span>, <span class="str">'holidays'</span>]].<span class="fn">tail</span>(<span class="num">10</span>))
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Holiday effect via dummy variables: add a 0/1 column for each event, fit OLS, the coefficient is the effect size.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

dates = pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>])
y = df_stocks[<span class="str">'close'</span>].values
t = np.<span class="fn">arange</span>(<span class="fn">len</span>(y))

<span class="cm"># Synthetic 'event' dates: every 30th business day, simulate a +5 spike</span>
event_idx = (dates.dt.day == <span class="num">1</span>).values.<span class="fn">astype</span>(<span class="fn">float</span>)   <span class="cm"># first-of-month effect</span>

<span class="cm"># OLS with [intercept, t, event_dummy]</span>
X = np.<span class="fn">column_stack</span>([np.<span class="fn">ones</span>(<span class="fn">len</span>(y)), t, event_idx])
beta, *_ = np.linalg.<span class="fn">lstsq</span>(X, y, rcond=<span class="kw">None</span>)
<span class="fn">print</span>(<span class="str">'Intercept:'</span>, <span class="fn">round</span>(beta[<span class="num">0</span>], <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'Trend slope/day:'</span>, <span class="fn">round</span>(beta[<span class="num">1</span>], <span class="num">4</span>))
<span class="fn">print</span>(<span class="str">'Event effect (1st-of-month):'</span>, <span class="fn">round</span>(beta[<span class="num">2</span>], <span class="num">3</span>))
</code></pre></div></div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. STL Decomposition Deep Dive</h2>
<p class="l-text">STL (Seasonal-Trend decomposition using Loess) is the industry-standard decomposition. Unlike classical decomposition, the seasonal component is allowed to evolve slowly. Three knobs:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">period</div><div class="card-body">Seasonal length (7 for daily/weekly, 12 for monthly/yearly).</div></div>
<div class="calc-card"><div class="card-title">seasonal</div><div class="card-body">Loess window for seasonal smoothing (odd, ≥7). Larger = more constant seasonal pattern.</div></div>
<div class="calc-card"><div class="card-title">robust</div><div class="card-body">If True, downweights outliers. Always set this on real data.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy.signal <span class="kw">import</span> savgol_filter

<span class="cm"># Manual STL-lite: trend = Savitzky-Golay smoothing, seasonal = day-of-week mean of detrended</span>
y = df_stocks[<span class="str">'close'</span>].<span class="fn">copy</span>()
y.index = pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>])

trend = pd.<span class="fn">Series</span>(<span class="fn">savgol_filter</span>(y.values, window_length=<span class="num">21</span>, polyorder=<span class="num">2</span>), index=y.index)
detrended = y - trend
season = detrended.<span class="fn">groupby</span>(detrended.index.dayofweek).<span class="fn">transform</span>(<span class="str">'mean'</span>)
resid = y - trend - season

<span class="fn">print</span>(<span class="str">'--- Decomposition summary ---'</span>)
<span class="fn">print</span>(f<span class="str">'Trend range : {trend.min():.2f} .. {trend.max():.2f}'</span>)
<span class="fn">print</span>(f<span class="str">'Season range: {season.min():.3f} .. {season.max():.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'Resid std   : {resid.std():.3f}'</span>)

<span class="cm"># A 'good' decomposition has resid that looks like white noise:</span>
<span class="cm"># - mean ~ 0</span>
<span class="cm"># - low autocorrelation</span>
<span class="fn">print</span>(f<span class="str">'Resid mean  : {resid.mean():.4f}'</span>)
<span class="fn">print</span>(f<span class="str">'Lag-1 ACF of resid: {resid.autocorr(1):.3f}'</span>)
</code></pre></div>
<p class="l-text">If the residual still has noticeable autocorrelation (lag-1 &gt; 0.2), your decomposition missed structure — increase period detail or add a longer seasonal cycle.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Prophet's Cross-Validation (Rolling Origin)</h2>
<p class="l-text">Prophet ships <code>cross_validation</code> — a rolling-origin evaluator that simulates real deployment.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> prophet.diagnostics <span class="kw">import</span> cross_validation, performance_metrics

m = <span class="fn">Prophet</span>().<span class="fn">fit</span>(df)
df_cv = <span class="fn">cross_validation</span>(m,
                         initial=<span class="str">'180 days'</span>,
                         period=<span class="str">'30 days'</span>,
                         horizon=<span class="str">'30 days'</span>)
df_p = <span class="fn">performance_metrics</span>(df_cv)
<span class="fn">print</span>(df_p[[<span class="str">'horizon'</span>, <span class="str">'mae'</span>, <span class="str">'rmse'</span>, <span class="str">'mape'</span>]].<span class="fn">head</span>(<span class="num">10</span>))
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Manual rolling-origin CV with naive forecaster on df_stocks.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

y = df_stocks[<span class="str">'close'</span>].values
horizon = <span class="num">10</span>
cutoffs = <span class="fn">list</span>(<span class="fn">range</span>(<span class="num">150</span>, <span class="fn">len</span>(y) - horizon, <span class="num">20</span>))   <span class="cm"># rolling cutoffs</span>

errors_by_h = {h: [] <span class="kw">for</span> h <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, horizon + <span class="num">1</span>)}
<span class="kw">for</span> cut <span class="kw">in</span> cutoffs:
    train = y[:cut]
    actual = y[cut:cut + horizon]
    forecast = np.<span class="fn">full</span>(horizon, train[-<span class="num">1</span>])    <span class="cm"># naive</span>
    <span class="kw">for</span> h <span class="kw">in</span> <span class="fn">range</span>(horizon):
        errors_by_h[h+<span class="num">1</span>].<span class="fn">append</span>(<span class="fn">abs</span>(actual[h] - forecast[h]))

<span class="fn">print</span>(<span class="str">'Rolling-origin MAE per horizon:'</span>)
<span class="kw">for</span> h, errs <span class="kw">in</span> errors_by_h.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">'  h={h:2d}: MAE={np.mean(errs):.3f}  n_cutoffs={len(errs)}'</span>)
</code></pre></div></div>
<p class="l-text">Notice MAE typically grows with horizon — the further you forecast, the harder it is. The growth shape tells you about your model's structure.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. When NOT to Use Prophet</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">High-frequency data</div><div class="card-body">Sub-hourly tick data, sensor streams. Prophet is too smooth. Use ARIMA / state-space / RNN.</div></div>
<div class="calc-card"><div class="card-title">Financial returns</div><div class="card-body">Stock prices have a near-random-walk structure. Prophet's smooth trend overconfidently extrapolates. Use ARIMA on returns.</div></div>
<div class="calc-card"><div class="card-title">Lots of related series</div><div class="card-body">10000 SKUs to forecast jointly. Prophet fits one at a time and is slow. Use global ML models (LightGBM, NeuralProphet, TFT).</div></div>
<div class="calc-card"><div class="card-title">No seasonality / no trend</div><div class="card-body">Stationary noise around a constant. Just predict the mean. Prophet adds complexity for nothing.</div></div>
</div>
<p class="l-text">Prophet's sweet spot: weekly/daily business KPIs, 1+ years of history, holiday and event effects matter, you need stakeholders to read the components plot.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Recap & Next Steps</h2>
<ul style="line-height:1.7"><li>Prophet = piecewise linear trend + Fourier seasonality + holiday dummies — fitted by Stan</li><li>Changepoints handle regime shifts automatically (tune <code>changepoint_prior_scale</code>)</li><li>Use multiplicative seasonality when swings scale with level</li><li>Holidays/events as event regressors capture spikes</li><li>STL gives you a clean diagnostic decomposition; check residual ACF</li><li>Prophet loses on high-frequency / financial / huge-multivariate problems</li></ul>
<p class="l-text">In <strong>L4</strong> we leave structural models behind and reframe forecasting as <em>tabular regression</em>: build lag features, rolling stats, calendar features, Fourier terms, and feed them to any sklearn model. This is how Kaggle winners and modern production stacks (LightGBM + mlforecast) actually work.</p>
</div>`,
tr: `<p class="l-text"><strong>Prophet, Facebook'un fazla çalışan analistlere hediyesiydi.</strong> 2017'de yayınlandı, bir istatistikçi olmayan kişinin tatiller, seviye kaymaları, çoklu mevsimsellikler ve eksik haftalarla dolu veri üzerinde beş satır kodla güvenilir bir tahmin üretmesini sağlar. Kaputun altında bir yapısal modeldir: trend(t) + mevsimsellik(t) + tatiller(t) + ε — Stan ile makul varsayılan önsel dağılımlarla uydurulur.</p>
<p class="l-text">Bu derste Prophet'ı gerçek veri üzerinde kullanıyoruz, üç katil özelliğini öğreniyoruz (değişim noktası tespiti, çarpımsal mevsimsellik, tatil etkileri) ve sonra aslında ne olduğunu anlamak için elle bir STL uygulamasına geri çekiliyoruz. Sonunda Prophet'ın ne zaman kazandığını (tatillerle dağınık iş verisi), ne zaman kaybettiğini (yüksek frekanslı, finansal, bilimsel) ve hep dik yukarı tahmin ediyor gibi görünen trendi nasıl ayıklayacağınızı bileceksiniz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Prophet'ın yapısal modeli: trend + mevsimsellik + tatiller</li><li>Değişim noktası tespiti — otomatik seviye/eğim kayması işleme</li><li>Çarpımsal vs toplamsal mevsimsellik (her birinin ne zaman uyduğu)</li><li>Ülke tatilleri ve özel olay regresörleri ekleme</li><li>Tanı için elle STL ayrıştırması (Loess tabanlı)</li><li>Prophet'ın yerleşik kayan-orijin aracı ile çapraz doğrulama</li><li>Prophet ne zaman yanlış araçtır</li></ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Prophet'ın Yapısal Modeli</h2>
<p class="l-text">Prophet seriyi şöyle ayrıştırır:</p>
<div class="katex-block">$$y(t) = g(t) + s(t) + h(t) + \\varepsilon_t$$</div>
<ul style="line-height:1.7"><li><strong>g(t)</strong> — otomatik değişim noktalarıyla parça parça doğrusal veya lojistik trend</li><li><strong>s(t)</strong> — periyodik mevsimsellik için Fourier serisi (yıllık, haftalık, günlük)</li><li><strong>h(t)</strong> — tatil ve olay etkileri (kullanıcı tarafından sağlanan tarihler)</li><li><strong>ε</strong> — Gauss gürültüsü</li></ul>
<p class="l-text">Otoregresif bileşen yok. Prophet y[t-1]'e koşullanmaz — zaman damgası dizinine eğriler uydurur. Bu hem güçlü yanıdır (boşluklara ve aykırı değerlere dayanıklı) hem de zayıf yanıdır (gerçek bir ARIMA'nın yakaladığı kısa vadeli momentumu yok sayar).</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Hızlı Başlangıç — Beş Satırlık Tahmin</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> prophet <span class="kw">import</span> Prophet
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Prophet ds (tarih) ve y olarak adlandırılan tam olarak iki sütun ister</span>
df = pd.<span class="fn">DataFrame</span>({
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>]),
    <span class="str">'y'</span>:  df_stocks[<span class="str">'close'</span>]
})

m = <span class="fn">Prophet</span>()
m.<span class="fn">fit</span>(df)

future = m.<span class="fn">make_future_dataframe</span>(periods=<span class="num">30</span>)   <span class="cm"># 30 gün ileri</span>
forecast = m.<span class="fn">predict</span>(future)
<span class="fn">print</span>(forecast[[<span class="str">'ds'</span>, <span class="str">'yhat'</span>, <span class="str">'yhat_lower'</span>, <span class="str">'yhat_upper'</span>]].<span class="fn">tail</span>())
m.<span class="fn">plot</span>(forecast)
m.<span class="fn">plot_components</span>(forecast)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Elle Prophet benzeri model: parça parça doğrusal trend (değişim noktalarıyla) + Fourier mevsimselliği, df_stocks üzerinde en küçük karelerle uydurulur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

y = df_stocks[<span class="str">'close'</span>].values
n = <span class="fn">len</span>(y)
t = np.<span class="fn">arange</span>(n)

<span class="cm"># 1) Parça parça doğrusal trend tabanı oluştur: 5 değişim noktası eşit aralıklı</span>
cps = np.<span class="fn">linspace</span>(n*<span class="num">0.1</span>, n*<span class="num">0.9</span>, <span class="num">5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
trend_basis = [t]                                <span class="cm"># temel eğim</span>
<span class="kw">for</span> cp <span class="kw">in</span> cps:
    trend_basis.<span class="fn">append</span>(np.<span class="fn">maximum</span>(<span class="num">0</span>, t - cp))    <span class="cm"># her cp'de menteşe</span>
trend_basis.<span class="fn">append</span>(np.<span class="fn">ones</span>(n))                   <span class="cm"># kesişim</span>
X_trend = np.<span class="fn">column_stack</span>(trend_basis)

<span class="cm"># 2) Fourier mevsimselliği: haftalık (5 iş-günü döngüsü) ve aylık (~21)</span>
<span class="kw">def</span> <span class="fn">fourier</span>(t, period, K):
    cols = []
    <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>):
        cols.<span class="fn">append</span>(np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*k*t/period))
        cols.<span class="fn">append</span>(np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*k*t/period))
    <span class="kw">return</span> np.<span class="fn">column_stack</span>(cols)

X_season = np.<span class="fn">column_stack</span>([<span class="fn">fourier</span>(t, <span class="num">5</span>, <span class="num">2</span>), <span class="fn">fourier</span>(t, <span class="num">21</span>, <span class="num">3</span>)])

<span class="cm"># 3) Birleştir ve OLS uydur</span>
X = np.<span class="fn">column_stack</span>([X_trend, X_season])
beta, *_ = np.linalg.<span class="fn">lstsq</span>(X, y, rcond=<span class="kw">None</span>)
fitted = X @ beta
<span class="fn">print</span>(<span class="str">'In-sample MAE:'</span>, <span class="fn">round</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y - fitted)), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'Trend coefs:'</span>, np.<span class="fn">round</span>(beta[:<span class="fn">len</span>(trend_basis)], <span class="num">4</span>))
</code></pre></div></div>
<p class="l-text">Pyodide sürümü Prophet'ın iki temel hilesini yakalar: değişim noktaları için menteşe tabanı + mevsimsellik için sin/cos tabanı. Bir tatil dummy sütunu ekleyin ve temel bir Prophet'ınız olur.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Değişim Noktaları — Trend Bükülür</h2>
<p class="l-text">Gerçek işletmeler sonsuza kadar doğrusal büyümez. Covid vurdu. Ürün lanse edildi. Rakip fiyatları düşürdü. Prophet otomatik olarak serinin ilk %80'inde 25 aday değişim noktası yerleştirir ve ilgisiz olanları sıfıra çeker (Laplace önseli, seyreklik).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">changepoint_prior_scale</div><div class="card-body">Varsayılan 0.05. Daha yüksek (0.5) = trend daha serbest bükülür (aşırı uyum). Daha düşük (0.001) = neredeyse düz çizgi (yetersiz uyum).</div></div>
<div class="calc-card"><div class="card-title">n_changepoints</div><div class="card-body">Varsayılan 25. Çok az ise rejim kaymalarını kaçırır; çok fazla ise prior_scale büyükse aşırı uyum davet eder.</div></div>
<div class="calc-card"><div class="card-title">changepoints (manuel)</div><div class="card-body">Seviyenin tam olarak ne zaman kaydığını biliyorsanız (ürün lansmanı) tarih listesi geçirin.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> prophet <span class="kw">import</span> Prophet

m = <span class="fn">Prophet</span>(changepoint_prior_scale=<span class="num">0.1</span>, n_changepoints=<span class="num">10</span>)
m.<span class="fn">fit</span>(df)
future = m.<span class="fn">make_future_dataframe</span>(periods=<span class="num">60</span>)
fcst = m.<span class="fn">predict</span>(future)

<span class="cm"># Tespit edilen değişim noktalarını incele</span>
<span class="kw">from</span> prophet.plot <span class="kw">import</span> add_changepoints_to_plot
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
fig = m.<span class="fn">plot</span>(fcst)
<span class="fn">add_changepoints_to_plot</span>(fig.<span class="fn">gca</span>(), m, fcst)
plt.<span class="fn">show</span>()

<span class="cm"># Önemli değişim noktaları (büyük delta)</span>
sig = m.changepoints[<span class="fn">abs</span>(m.params[<span class="str">'delta'</span>].<span class="fn">mean</span>(<span class="num">0</span>)) > <span class="num">0.01</span>]
<span class="fn">print</span>(<span class="str">'Significant changepoints:'</span>, sig.<span class="fn">tolist</span>())
</code></pre></div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Çarpımsal vs Toplamsal Mevsimsellik</h2>
<p class="l-text">Toplamsal: mevsimsel salınımlar büyüklükte sabittir (her Aralık +50). Çarpımsal: salınımlar seviyeyle birlikte büyür (her Aralık +%10 — yani 2020'de $100, 2026'da $200, $10'a karşı $20 Aralık artışı anlamına gelir).</p>
<div class="katex-block">$$\\text{additive: } y = T + S \\qquad \\text{multiplicative: } y = T \\cdot (1 + S)$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>m_add  = <span class="fn">Prophet</span>(seasonality_mode=<span class="str">'additive'</span>).<span class="fn">fit</span>(df)
m_mult = <span class="fn">Prophet</span>(seasonality_mode=<span class="str">'multiplicative'</span>).<span class="fn">fit</span>(df)

<span class="cm"># 30 gün ayır, karşılaştır</span>
train = df.iloc[:-<span class="num">30</span>]
test  = df.iloc[-<span class="num">30</span>:]
ma  = <span class="fn">Prophet</span>(seasonality_mode=<span class="str">'additive'</span>).<span class="fn">fit</span>(train)
mm  = <span class="fn">Prophet</span>(seasonality_mode=<span class="str">'multiplicative'</span>).<span class="fn">fit</span>(train)

f_add  = ma.<span class="fn">predict</span>(test[[<span class="str">'ds'</span>]])
f_mult = mm.<span class="fn">predict</span>(test[[<span class="str">'ds'</span>]])
mae_add  = (test[<span class="str">'y'</span>].values - f_add[<span class="str">'yhat'</span>].values).<span class="fn">__abs__</span>().<span class="fn">mean</span>()
mae_mult = (test[<span class="str">'y'</span>].values - f_mult[<span class="str">'yhat'</span>].values).<span class="fn">__abs__</span>().<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">'Additive MAE: {mae_add:.3f}   Multiplicative MAE: {mae_mult:.3f}'</span>)
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Pratik kural: seriyi log dönüştürürseniz ve mevsimsel salınımlar sabit hale gelirse, çarpımsal istemişsiniz demektir. Ya da sadece A/B test edin.</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Tatiller ve Özel Olaylar</h2>
<p class="l-text">Prophet ülke tatil takvimleriyle gelir (US, UK, TR, Hindistan, ...). Ayrıca rastgele "olayları" — Black Friday, ürün lansmanı, bir pazarlama kampanyası — (holiday, ds, lower_window, upper_window) şeklinde bir DataFrame olarak geçirebilirsiniz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> prophet <span class="kw">import</span> Prophet

events = pd.<span class="fn">DataFrame</span>({
    <span class="str">'holiday'</span>: [<span class="str">'black_friday'</span>, <span class="str">'black_friday'</span>, <span class="str">'launch'</span>],
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>([<span class="str">'2024-11-29'</span>, <span class="str">'2025-11-28'</span>, <span class="str">'2024-06-15'</span>]),
    <span class="str">'lower_window'</span>: [-<span class="num">1</span>, -<span class="num">1</span>, <span class="num">0</span>],   <span class="cm"># etki 1 gün önce başlar</span>
    <span class="str">'upper_window'</span>: [<span class="num">3</span>,  <span class="num">3</span>,  <span class="num">7</span>],   <span class="cm"># etki birkaç gün sonra sürer</span>
})

m = <span class="fn">Prophet</span>(holidays=events)
m.<span class="fn">add_country_holidays</span>(country_name=<span class="str">'US'</span>)
m.<span class="fn">fit</span>(df)
fcst = m.<span class="fn">predict</span>(m.<span class="fn">make_future_dataframe</span>(<span class="num">60</span>))

<span class="cm"># Tatil etki bileşenlerini incele</span>
<span class="fn">print</span>(fcst[[<span class="str">'ds'</span>, <span class="str">'yhat'</span>, <span class="str">'holidays'</span>]].<span class="fn">tail</span>(<span class="num">10</span>))
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Dummy değişkenler aracılığıyla tatil etkisi: her olay için 0/1 sütun ekle, OLS uydur, katsayı etki büyüklüğüdür.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

dates = pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>])
y = df_stocks[<span class="str">'close'</span>].values
t = np.<span class="fn">arange</span>(<span class="fn">len</span>(y))

<span class="cm"># Sentetik 'olay' tarihleri: her 30. iş günü, +5 ani yükseliş simüle et</span>
event_idx = (dates.dt.day == <span class="num">1</span>).values.<span class="fn">astype</span>(<span class="fn">float</span>)   <span class="cm"># ayın ilk günü etkisi</span>

<span class="cm"># [intercept, t, event_dummy] ile OLS</span>
X = np.<span class="fn">column_stack</span>([np.<span class="fn">ones</span>(<span class="fn">len</span>(y)), t, event_idx])
beta, *_ = np.linalg.<span class="fn">lstsq</span>(X, y, rcond=<span class="kw">None</span>)
<span class="fn">print</span>(<span class="str">'Intercept:'</span>, <span class="fn">round</span>(beta[<span class="num">0</span>], <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">'Trend slope/day:'</span>, <span class="fn">round</span>(beta[<span class="num">1</span>], <span class="num">4</span>))
<span class="fn">print</span>(<span class="str">'Event effect (1st-of-month):'</span>, <span class="fn">round</span>(beta[<span class="num">2</span>], <span class="num">3</span>))
</code></pre></div></div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. STL Ayrıştırması Derinlemesine</h2>
<p class="l-text">STL (Loess kullanan Mevsimsel-Trend ayrıştırması), endüstri standardı ayrıştırmadır. Klasik ayrıştırmanın aksine, mevsimsel bileşenin yavaşça evrilmesine izin verilir. Üç düğme:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">period</div><div class="card-body">Mevsimsel uzunluk (günlük/haftalık için 7, aylık/yıllık için 12).</div></div>
<div class="calc-card"><div class="card-title">seasonal</div><div class="card-body">Mevsimsel düzgünleştirme için Loess penceresi (tek, ≥7). Daha büyük = daha sabit mevsimsel desen.</div></div>
<div class="calc-card"><div class="card-title">robust</div><div class="card-body">True ise, aykırı değerleri azaltır. Gerçek veride daima bunu ayarlayın.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy.signal <span class="kw">import</span> savgol_filter

<span class="cm"># Elle STL-lite: trend = Savitzky-Golay düzgünleştirmesi, mevsimsel = trend'i çıkarılmışın haftanın günü ortalaması</span>
y = df_stocks[<span class="str">'close'</span>].<span class="fn">copy</span>()
y.index = pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>])

trend = pd.<span class="fn">Series</span>(<span class="fn">savgol_filter</span>(y.values, window_length=<span class="num">21</span>, polyorder=<span class="num">2</span>), index=y.index)
detrended = y - trend
season = detrended.<span class="fn">groupby</span>(detrended.index.dayofweek).<span class="fn">transform</span>(<span class="str">'mean'</span>)
resid = y - trend - season

<span class="fn">print</span>(<span class="str">'--- Decomposition summary ---'</span>)
<span class="fn">print</span>(f<span class="str">'Trend range : {trend.min():.2f} .. {trend.max():.2f}'</span>)
<span class="fn">print</span>(f<span class="str">'Season range: {season.min():.3f} .. {season.max():.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'Resid std   : {resid.std():.3f}'</span>)

<span class="cm"># 'İyi' bir ayrıştırma, beyaz gürültüye benzeyen artığa sahiptir:</span>
<span class="cm"># - mean ~ 0</span>
<span class="cm"># - düşük otokorelasyon</span>
<span class="fn">print</span>(f<span class="str">'Resid mean  : {resid.mean():.4f}'</span>)
<span class="fn">print</span>(f<span class="str">'Lag-1 ACF of resid: {resid.autocorr(1):.3f}'</span>)
</code></pre></div>
<p class="l-text">Eğer artık hâlâ belirgin bir otokorelasyona sahipse (gecikme-1 &gt; 0.2), ayrıştırmanız yapıyı kaçırmıştır — periyot ayrıntısını artırın veya daha uzun bir mevsimsel döngü ekleyin.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Prophet'ın Çapraz Doğrulaması (Kayan Orijin)</h2>
<p class="l-text">Prophet <code>cross_validation</code> ile gelir — gerçek dağıtımı simüle eden bir kayan-orijin değerlendiricisi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> prophet.diagnostics <span class="kw">import</span> cross_validation, performance_metrics

m = <span class="fn">Prophet</span>().<span class="fn">fit</span>(df)
df_cv = <span class="fn">cross_validation</span>(m,
                         initial=<span class="str">'180 days'</span>,
                         period=<span class="str">'30 days'</span>,
                         horizon=<span class="str">'30 days'</span>)
df_p = <span class="fn">performance_metrics</span>(df_cv)
<span class="fn">print</span>(df_p[[<span class="str">'horizon'</span>, <span class="str">'mae'</span>, <span class="str">'rmse'</span>, <span class="str">'mape'</span>]].<span class="fn">head</span>(<span class="num">10</span>))
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">df_stocks üzerinde naif tahminci ile elle kayan-orijin CV.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

y = df_stocks[<span class="str">'close'</span>].values
horizon = <span class="num">10</span>
cutoffs = <span class="fn">list</span>(<span class="fn">range</span>(<span class="num">150</span>, <span class="fn">len</span>(y) - horizon, <span class="num">20</span>))   <span class="cm"># kayan kesim noktaları</span>

errors_by_h = {h: [] <span class="kw">for</span> h <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, horizon + <span class="num">1</span>)}
<span class="kw">for</span> cut <span class="kw">in</span> cutoffs:
    train = y[:cut]
    actual = y[cut:cut + horizon]
    forecast = np.<span class="fn">full</span>(horizon, train[-<span class="num">1</span>])    <span class="cm"># naif</span>
    <span class="kw">for</span> h <span class="kw">in</span> <span class="fn">range</span>(horizon):
        errors_by_h[h+<span class="num">1</span>].<span class="fn">append</span>(<span class="fn">abs</span>(actual[h] - forecast[h]))

<span class="fn">print</span>(<span class="str">'Rolling-origin MAE per horizon:'</span>)
<span class="kw">for</span> h, errs <span class="kw">in</span> errors_by_h.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">'  h={h:2d}: MAE={np.mean(errs):.3f}  n_cutoffs={len(errs)}'</span>)
</code></pre></div></div>
<p class="l-text">MAE'nin tipik olarak ufukla büyüdüğüne dikkat edin — ne kadar uzağa tahmin ederseniz, o kadar zordur. Büyüme şekli, modelinizin yapısı hakkında bilgi verir.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Prophet'ı NE ZAMAN Kullanmamalı</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yüksek frekanslı veri</div><div class="card-body">Saat altı tick verisi, sensör akışları. Prophet çok düzgündür. ARIMA / durum-uzayı / RNN kullanın.</div></div>
<div class="calc-card"><div class="card-title">Finansal getiriler</div><div class="card-body">Hisse fiyatlarının neredeyse rastgele yürüyüş yapısı vardır. Prophet'ın düzgün trendi aşırı güvenle ekstrapole eder. Getiriler üzerinde ARIMA kullanın.</div></div>
<div class="calc-card"><div class="card-title">Çok sayıda ilişkili seri</div><div class="card-body">Birlikte tahmin edilecek 10000 SKU. Prophet birer birer uydurulur ve yavaştır. Global ML modelleri kullanın (LightGBM, NeuralProphet, TFT).</div></div>
<div class="calc-card"><div class="card-title">Mevsimsellik / trend yok</div><div class="card-body">Sabit etrafında durağan gürültü. Sadece ortalamayı tahmin edin. Prophet boşuna karmaşıklık ekler.</div></div>
</div>
<p class="l-text">Prophet'ın altın noktası: haftalık/günlük iş KPI'ları, 1+ yıllık tarihçe, tatil ve olay etkileri önemlidir, paydaşlarınızın bileşenler grafiğini okumasına ihtiyacınız vardır.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Özet ve Sonraki Adımlar</h2>
<ul style="line-height:1.7"><li>Prophet = parça parça doğrusal trend + Fourier mevsimselliği + tatil dummy'leri — Stan ile uydurulur</li><li>Değişim noktaları rejim kaymalarını otomatik olarak işler (<code>changepoint_prior_scale</code>'i ayarlayın)</li><li>Salınımlar seviyeyle ölçeklendiğinde çarpımsal mevsimsellik kullanın</li><li>Olay regresörleri olarak tatiller/olaylar ani yükselişleri yakalar</li><li>STL size temiz bir tanı ayrıştırması verir; artık ACF'sini kontrol edin</li><li>Prophet yüksek frekanslı / finansal / büyük çok değişkenli problemlerde kaybeder</li></ul>
<p class="l-text"><strong>L4</strong>'te yapısal modelleri arkamızda bırakıp tahminciliği <em>tablo regresyonu</em> olarak yeniden çerçeveliyoruz: gecikme özellikleri, hareketli istatistikler, takvim özellikleri, Fourier terimleri inşa et ve herhangi bir sklearn modeline besle. Bu, Kaggle galiplerinin ve modern üretim yığınlarının (LightGBM + mlforecast) gerçekte nasıl çalıştığıdır.</p>
</div>`
};
