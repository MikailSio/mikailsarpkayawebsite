window.TIMESERIES_L4 = {
en: `<p class="l-text"><strong>The single most important skill in modern forecasting is feature engineering.</strong> Once you can convert a time series into a tabular dataset of lag features, rolling stats, calendar dummies, and Fourier terms, you can throw any sklearn model at it — Random Forest, LightGBM, XGBoost, even linear regression — and routinely beat ARIMA. Every Kaggle time-series winner of the past five years has done exactly this.</p>
<p class="l-text">In this lesson we build the full feature factory step by step on real daily stock data. We engineer lags, expanding/rolling means, day-of-week and month-end flags, sin/cos Fourier seasonals, target encodings, and exogenous regressors. By the end you'll have a reusable function that turns a raw <code>(date, value)</code> series into a 30+ column feature matrix ready for L5's gradient boosting.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Lag features and how many lags to use</li><li>Rolling stats (mean, std, min, max) over multiple windows</li><li>Calendar features: dow, dom, month, quarter, is_holiday, is_month_end</li><li>Fourier terms for smooth multi-period seasonality</li><li>Target encoding (mean encoding) for categorical IDs</li><li>Exogenous variables and the "no future leakage" rule</li><li>Building a complete feature DataFrame for ML forecasting</li></ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. The Big Reframe — Forecasting as Regression</h2>
<p class="l-text">A time series <code>y[1], y[2], ..., y[T]</code> can be reshaped into a regression dataset:</p>
<div class="katex-block">$$X_t = [y_{t-1}, y_{t-2}, \\ldots, y_{t-p}, \\text{dow}(t), \\text{month}(t), \\sin(2\\pi t / m), \\ldots] \\quad \\to \\quad y_t$$</div>
<p class="l-text">Each row is one timestamp. Columns are everything you knew <strong>strictly before</strong> that timestamp. Once in this form, time disappears and you have a plain supervised learning problem. The only rule: <em>never include a feature you wouldn't have at prediction time</em>.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Leakage trap: rolling-mean over a window centered on t includes future values. Always use trailing (right-aligned) windows. Pandas: <code>rolling(window=7).mean().shift(1)</code> — the shift makes it strictly past.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Lag Features</h2>
<p class="l-text">The most basic feature: yesterday's value, last week's value, last year's value. Different horizons capture different patterns.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Lag 1, 2, 3</div><div class="card-body">Short-term momentum. Captures persistence.</div></div>
<div class="calc-card"><div class="card-title">Lag 7, 14</div><div class="card-body">Weekly cycles. Useful for any business KPI.</div></div>
<div class="calc-card"><div class="card-title">Lag 28, 30</div><div class="card-body">Monthly billing cycle / payday effects.</div></div>
<div class="calc-card"><div class="card-title">Lag 365</div><div class="card-body">Year-on-year. Critical for retail, tourism.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Start a feature DataFrame from df_stocks</span>
df = pd.<span class="fn">DataFrame</span>({
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>]),
    <span class="str">'y'</span>:  df_stocks[<span class="str">'close'</span>]
}).<span class="fn">set_index</span>(<span class="str">'ds'</span>)

<span class="cm"># Add lag features</span>
<span class="kw">for</span> lag <span class="kw">in</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">21</span>]:
    df[f<span class="str">'lag_{lag}'</span>] = df[<span class="str">'y'</span>].<span class="fn">shift</span>(lag)

<span class="fn">print</span>(df.<span class="fn">head</span>(<span class="num">10</span>))
<span class="fn">print</span>(<span class="str">'Shape:'</span>, df.shape)
<span class="fn">print</span>(<span class="str">'NaN per col:'</span>, df.<span class="fn">isna</span>().<span class="fn">sum</span>().<span class="fn">to_dict</span>())
</code></pre></div>
<p class="l-text">Notice the NaN rows at the start — you lose <code>max(lag)</code> rows. Always drop them before fitting: <code>df.dropna()</code>.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Rolling Statistics</h2>
<p class="l-text">Windowed aggregates capture local trends and volatility. Mean, std, min, max are the core four. Use multiple window sizes (3, 7, 14, 30) so the model can pick the right scale.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

df = pd.<span class="fn">DataFrame</span>({
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>]),
    <span class="str">'y'</span>:  df_stocks[<span class="str">'close'</span>]
}).<span class="fn">set_index</span>(<span class="str">'ds'</span>)

<span class="cm"># CRITICAL: shift(1) before rolling to avoid leakage</span>
y_past = df[<span class="str">'y'</span>].<span class="fn">shift</span>(<span class="num">1</span>)

<span class="kw">for</span> w <span class="kw">in</span> [<span class="num">3</span>, <span class="num">7</span>, <span class="num">14</span>, <span class="num">30</span>]:
    df[f<span class="str">'roll_mean_{w}'</span>] = y_past.<span class="fn">rolling</span>(w).<span class="fn">mean</span>()
    df[f<span class="str">'roll_std_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">std</span>()
    df[f<span class="str">'roll_min_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">min</span>()
    df[f<span class="str">'roll_max_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">max</span>()

<span class="cm"># Bollinger-style: how many stds is current value from rolling mean?</span>
df[<span class="str">'z_30'</span>] = (df[<span class="str">'y'</span>] - df[<span class="str">'roll_mean_30'</span>]) / df[<span class="str">'roll_std_30'</span>]

<span class="cm"># EWM (exponentially weighted) — smoother, recency-weighted</span>
<span class="kw">for</span> span <span class="kw">in</span> [<span class="num">5</span>, <span class="num">20</span>]:
    df[f<span class="str">'ewm_{span}'</span>] = y_past.<span class="fn">ewm</span>(span=span).<span class="fn">mean</span>()

<span class="fn">print</span>(df.<span class="fn">dropna</span>().<span class="fn">head</span>(<span class="num">5</span>).<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(f<span class="str">'Total feature columns: {df.shape[1]}'</span>)
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Rolling std is your best volatility feature. Quants pay millions for this number. Add it to almost any forecasting model — it usually improves accuracy by 5-10%.</div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Calendar Features</h2>
<p class="l-text">Time of week / month / year. Cheap, leakage-free, often the single biggest gain.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

df = pd.<span class="fn">DataFrame</span>({
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>]),
    <span class="str">'y'</span>:  df_stocks[<span class="str">'close'</span>]
}).<span class="fn">set_index</span>(<span class="str">'ds'</span>)

idx = df.index
df[<span class="str">'dow'</span>]         = idx.dayofweek          <span class="cm"># 0=Mon .. 6=Sun</span>
df[<span class="str">'day'</span>]         = idx.day
df[<span class="str">'month'</span>]       = idx.month
df[<span class="str">'quarter'</span>]     = idx.quarter
df[<span class="str">'weekofyear'</span>]  = idx.<span class="fn">isocalendar</span>().week.<span class="fn">astype</span>(<span class="fn">int</span>)
df[<span class="str">'is_month_start'</span>] = idx.is_month_start.<span class="fn">astype</span>(<span class="fn">int</span>)
df[<span class="str">'is_month_end'</span>]   = idx.is_month_end.<span class="fn">astype</span>(<span class="fn">int</span>)
df[<span class="str">'is_quarter_end'</span>] = idx.is_quarter_end.<span class="fn">astype</span>(<span class="fn">int</span>)
df[<span class="str">'days_to_month_end'</span>] = (idx + pd.offsets.<span class="fn">MonthEnd</span>(<span class="num">0</span>) - idx).days

<span class="cm"># Cyclic encoding — better than raw integers for tree models too</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
df[<span class="str">'dow_sin'</span>]   = np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * df[<span class="str">'dow'</span>]   / <span class="num">7</span>)
df[<span class="str">'dow_cos'</span>]   = np.<span class="fn">cos</span>(<span class="num">2</span> * np.pi * df[<span class="str">'dow'</span>]   / <span class="num">7</span>)
df[<span class="str">'month_sin'</span>] = np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * df[<span class="str">'month'</span>] / <span class="num">12</span>)
df[<span class="str">'month_cos'</span>] = np.<span class="fn">cos</span>(<span class="num">2</span> * np.pi * df[<span class="str">'month'</span>] / <span class="num">12</span>)

<span class="fn">print</span>(df.<span class="fn">head</span>(<span class="num">7</span>)[[<span class="str">'dow'</span>, <span class="str">'day'</span>, <span class="str">'month'</span>, <span class="str">'is_month_end'</span>, <span class="str">'dow_sin'</span>, <span class="str">'dow_cos'</span>]].<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>
<p class="l-text">Why sin/cos? Raw <code>dow=6</code> (Sunday) and <code>dow=0</code> (Monday) are far apart in integer space but adjacent in cyclic time. Sin/cos encoding makes them close in feature space.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Fourier Terms — Smooth Multi-Period Seasonality</h2>
<p class="l-text">For long periods (yearly = 365.25, weekly + yearly together), discrete dummies blow up. Fourier series compress arbitrary smooth periodicity into 2K columns where K is the order.</p>
<div class="katex-block">$$\\text{Fourier}(t, m, K) = \\bigcup_{k=1}^{K} \\left\\{ \\sin\\left(\\frac{2\\pi k t}{m}\\right), \\cos\\left(\\frac{2\\pi k t}{m}\\right) \\right\\}$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="kw">def</span> <span class="fn">fourier_features</span>(t, period, K, prefix):
    out = {}
    <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K + <span class="num">1</span>):
        out[f<span class="str">'{prefix}_sin_{k}'</span>] = np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * k * t / period)
        out[f<span class="str">'{prefix}_cos_{k}'</span>] = np.<span class="fn">cos</span>(<span class="num">2</span> * np.pi * k * t / period)
    <span class="kw">return</span> pd.<span class="fn">DataFrame</span>(out)

df = pd.<span class="fn">DataFrame</span>({
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>]),
    <span class="str">'y'</span>:  df_stocks[<span class="str">'close'</span>]
}).<span class="fn">set_index</span>(<span class="str">'ds'</span>)

t = np.<span class="fn">arange</span>(<span class="fn">len</span>(df))
weekly = <span class="fn">fourier_features</span>(t, period=<span class="num">5</span>,    K=<span class="num">2</span>, prefix=<span class="str">'wk'</span>)   <span class="cm"># 5 = business week</span>
monthly = <span class="fn">fourier_features</span>(t, period=<span class="num">21</span>,  K=<span class="num">3</span>, prefix=<span class="str">'mo'</span>)   <span class="cm"># ~21 b-days</span>
yearly  = <span class="fn">fourier_features</span>(t, period=<span class="num">252</span>, K=<span class="num">4</span>, prefix=<span class="str">'yr'</span>)   <span class="cm"># ~252 b-days/yr</span>

fourier = pd.<span class="fn">concat</span>([weekly, monthly, yearly], axis=<span class="num">1</span>)
fourier.index = df.index
df = pd.<span class="fn">concat</span>([df, fourier], axis=<span class="num">1</span>)

<span class="fn">print</span>(<span class="str">'Fourier columns:'</span>, fourier.columns.<span class="fn">tolist</span>())
<span class="fn">print</span>(<span class="str">'Total cols:'</span>, df.shape[<span class="num">1</span>])
</code></pre></div>
<p class="l-text">Rule of thumb: K = 2 for weekly, K = 3-5 for yearly. Higher K fits sharper peaks but overfits.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Target Encoding for Categorical IDs</h2>
<p class="l-text">When forecasting many series at once (1000 SKUs, 50 stores, 200 sensor IDs), you need a numeric encoding for the ID. One-hot blows up. Target encoding: replace each category by the historical mean target, computed only on past data.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Pretend df_orders has product_id and amount — multiple series at once</span>
df_o = df_orders.<span class="fn">copy</span>()
df_o[<span class="str">'date'</span>] = pd.<span class="fn">to_datetime</span>(df_o[<span class="str">'order_date'</span>])
df_o = df_o.<span class="fn">sort_values</span>(<span class="str">'date'</span>).<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)

<span class="cm"># Expanding mean of target by product_id, shifted by 1 to avoid leakage</span>
df_o[<span class="str">'prod_mean_target'</span>] = (
    df_o.<span class="fn">groupby</span>(<span class="str">'product_id'</span>)[<span class="str">'amount'</span>]
        .<span class="fn">transform</span>(<span class="kw">lambda</span> s: s.<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">expanding</span>().<span class="fn">mean</span>())
)

<span class="fn">print</span>(df_o[[<span class="str">'date'</span>, <span class="str">'product_id'</span>, <span class="str">'amount'</span>, <span class="str">'prod_mean_target'</span>]].<span class="fn">head</span>(<span class="num">15</span>))
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Smoothed target encoding: <code>(n·mean_cat + α·mean_global) / (n + α)</code> with α = 10. Prevents overfitting to small categories with few observations.</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Exogenous Variables — and the Future Information Problem</h2>
<p class="l-text">External signals (weather, marketing spend, competitor price) are gold — when you have them at forecast time. Two strategies:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Known future (calendar, planned events)</div><div class="card-body">School holidays, scheduled marketing pushes, your own price changes. Available, use directly.</div></div>
<div class="calc-card"><div class="card-title">Forecast first (weather, FX rates)</div><div class="card-body">Use a separate forecast (or scenario) for the exogenous, propagate uncertainty.</div></div>
<div class="calc-card"><div class="card-title">Lagged exogenous</div><div class="card-body">Last week's marketing spend predicting this week's sales. Always available, no future leakage.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Simulate exogenous: synthetic 'volume' series from df_stocks</span>
df = pd.<span class="fn">DataFrame</span>({
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>]),
    <span class="str">'y'</span>:  df_stocks[<span class="str">'close'</span>],
    <span class="str">'volume'</span>: df_stocks[<span class="str">'volume'</span>]
}).<span class="fn">set_index</span>(<span class="str">'ds'</span>)

<span class="cm"># Lag the exogenous so it's strictly past</span>
df[<span class="str">'vol_lag1'</span>] = df[<span class="str">'volume'</span>].<span class="fn">shift</span>(<span class="num">1</span>)
df[<span class="str">'vol_lag5_mean'</span>] = df[<span class="str">'volume'</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">5</span>).<span class="fn">mean</span>()
df[<span class="str">'vol_change'</span>]    = df[<span class="str">'volume'</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">pct_change</span>()

<span class="cm"># Interaction: volume surge × yesterday's close</span>
df[<span class="str">'vol_yclose'</span>] = df[<span class="str">'vol_lag1'</span>] * df[<span class="str">'y'</span>].<span class="fn">shift</span>(<span class="num">1</span>)

<span class="fn">print</span>(df.<span class="fn">dropna</span>().<span class="fn">head</span>(<span class="num">5</span>).<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Putting It Together — make_features()</h2>
<p class="l-text">A reusable feature factory. Pass in a (date, y) series, get a 30+ column DataFrame ready for ML.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="kw">def</span> <span class="fn">make_features</span>(dates, y, lags=(<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">7</span>,<span class="num">14</span>), wins=(<span class="num">3</span>,<span class="num">7</span>,<span class="num">14</span>,<span class="num">30</span>), fourier_periods=((<span class="num">5</span>,<span class="num">2</span>),(<span class="num">21</span>,<span class="num">3</span>))):
    df = pd.<span class="fn">DataFrame</span>({<span class="str">'y'</span>: y}, index=pd.<span class="fn">to_datetime</span>(dates))

    <span class="cm"># Lags</span>
    <span class="kw">for</span> lag <span class="kw">in</span> lags:
        df[f<span class="str">'lag_{lag}'</span>] = df[<span class="str">'y'</span>].<span class="fn">shift</span>(lag)

    <span class="cm"># Rolling stats (shifted to be strictly past)</span>
    y_past = df[<span class="str">'y'</span>].<span class="fn">shift</span>(<span class="num">1</span>)
    <span class="kw">for</span> w <span class="kw">in</span> wins:
        df[f<span class="str">'mean_{w}'</span>] = y_past.<span class="fn">rolling</span>(w).<span class="fn">mean</span>()
        df[f<span class="str">'std_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">std</span>()
        df[f<span class="str">'min_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">min</span>()
        df[f<span class="str">'max_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">max</span>()

    <span class="cm"># Calendar</span>
    idx = df.index
    df[<span class="str">'dow'</span>]   = idx.dayofweek
    df[<span class="str">'month'</span>] = idx.month
    df[<span class="str">'day'</span>]   = idx.day
    df[<span class="str">'is_month_end'</span>] = idx.is_month_end.<span class="fn">astype</span>(<span class="fn">int</span>)
    df[<span class="str">'dow_sin'</span>]   = np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*df[<span class="str">'dow'</span>]  /<span class="num">7</span>)
    df[<span class="str">'dow_cos'</span>]   = np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*df[<span class="str">'dow'</span>]  /<span class="num">7</span>)
    df[<span class="str">'month_sin'</span>] = np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*df[<span class="str">'month'</span>]/<span class="num">12</span>)
    df[<span class="str">'month_cos'</span>] = np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*df[<span class="str">'month'</span>]/<span class="num">12</span>)

    <span class="cm"># Fourier</span>
    t = np.<span class="fn">arange</span>(<span class="fn">len</span>(df))
    <span class="kw">for</span> period, K <span class="kw">in</span> fourier_periods:
        <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>):
            df[f<span class="str">'fr_{period}_s{k}'</span>] = np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*k*t/period)
            df[f<span class="str">'fr_{period}_c{k}'</span>] = np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*k*t/period)

    <span class="kw">return</span> df

feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>])
feat = feat.<span class="fn">dropna</span>()
<span class="fn">print</span>(f<span class="str">'Feature matrix: {feat.shape[0]} rows × {feat.shape[1]} cols'</span>)
<span class="fn">print</span>(<span class="str">'Columns:'</span>, feat.columns.<span class="fn">tolist</span>())
<span class="fn">print</span>(feat.<span class="fn">head</span>(<span class="num">3</span>).<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>
<p class="l-text">This single function is the input to every modern ML forecasting pipeline. In L5 we drop it straight into LightGBM and watch it beat ARIMA.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Recap & Next Steps</h2>
<ul style="line-height:1.7"><li>Lag features = AR-style memory; pick lags that match your domain cycles</li><li>Rolling stats = local trend & volatility; <strong>always shift(1) before rolling</strong></li><li>Calendar features (dow/month/holiday) often dominate other signals</li><li>Fourier terms = smooth multi-period seasonality at low column cost</li><li>Target encoding = scalable categorical encoding for many series</li><li>Exogenous: only use what you'll have at prediction time, or forecast it first</li></ul>
<p class="l-text">In <strong>L5</strong> we feed this feature matrix to LightGBM, set up TimeSeriesSplit + walk-forward CV, and benchmark against the L1 baselines and L2 ARIMA. Tabular ML for time series is the production reality at most ML-driven companies.</p>
</div>`,
tr: `<p class="l-text"><strong>Modern tahminciliğin tek en önemli becerisi özellik mühendisliğidir.</strong> Bir zaman serisini gecikme özellikleri, hareketli istatistikler, takvim dummy'leri ve Fourier terimlerinden oluşan bir tablo veri kümesine dönüştürebildiğinizde, herhangi bir sklearn modelini ona atabilirsiniz — Random Forest, LightGBM, XGBoost, hatta doğrusal regresyon — ve rutin olarak ARIMA'yı yenebilirsiniz. Son beş yılın her Kaggle zaman serisi galibi tam olarak bunu yapmıştır.</p>
<p class="l-text">Bu derste tam özellik fabrikasını gerçek günlük hisse verileri üzerinde adım adım inşa ediyoruz. Gecikmeler, genişleyen/hareketli ortalamalar, haftanın günü ve ay sonu bayrakları, sin/cos Fourier mevsimselleri, hedef kodlamaları ve dışsal regresörler tasarlıyoruz. Sonunda ham bir <code>(tarih, değer)</code> serisini L5'in gradyan artırması için hazır 30+ sütunlu bir özellik matrisine dönüştüren yeniden kullanılabilir bir fonksiyonunuz olacak.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Gecikme özellikleri ve kaç gecikme kullanılacağı</li><li>Birden çok pencere üzerinde hareketli istatistikler (ortalama, std, min, max)</li><li>Takvim özellikleri: dow, dom, ay, çeyrek, is_holiday, is_month_end</li><li>Düzgün çoklu periyot mevsimselliği için Fourier terimleri</li><li>Kategorik kimlikler için hedef kodlaması (ortalama kodlama)</li><li>Dışsal değişkenler ve "gelecek sızıntısı yok" kuralı</li><li>ML tahminciliği için tam özellik DataFrame'i oluşturma</li></ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Büyük Yeniden Çerçeveleme — Tahmincilik Regresyon Olarak</h2>
<p class="l-text">Bir zaman serisi <code>y[1], y[2], ..., y[T]</code> bir regresyon veri kümesine yeniden şekillendirilebilir:</p>
<div class="katex-block">$$X_t = [y_{t-1}, y_{t-2}, \\ldots, y_{t-p}, \\text{dow}(t), \\text{month}(t), \\sin(2\\pi t / m), \\ldots] \\quad \\to \\quad y_t$$</div>
<p class="l-text">Her satır bir zaman damgasıdır. Sütunlar, o zaman damgasından <strong>kesinlikle önce</strong> bildiğiniz her şeydir. Bu forma girdikten sonra zaman kaybolur ve sade bir denetimli öğrenme problemine sahip olursunuz. Tek kural: <em>tahmin zamanında elinizde olmayan bir özelliği asla dahil etmeyin</em>.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Sızıntı tuzağı: t üzerine ortalanmış pencere üzerindeki hareketli ortalama gelecek değerleri içerir. Daima sondan (sağa hizalı) pencere kullanın. Pandas: <code>rolling(window=7).mean().shift(1)</code> — shift onu kesinlikle geçmiş yapar.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Gecikme Özellikleri</h2>
<p class="l-text">En temel özellik: dünün değeri, geçen haftanın değeri, geçen yılın değeri. Farklı ufuklar farklı desenleri yakalar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gecikme 1, 2, 3</div><div class="card-body">Kısa vadeli momentum. Kalıcılığı yakalar.</div></div>
<div class="calc-card"><div class="card-title">Gecikme 7, 14</div><div class="card-body">Haftalık döngüler. Herhangi bir iş KPI'sı için yararlıdır.</div></div>
<div class="calc-card"><div class="card-title">Gecikme 28, 30</div><div class="card-body">Aylık faturalama döngüsü / maaş günü etkileri.</div></div>
<div class="calc-card"><div class="card-title">Gecikme 365</div><div class="card-body">Yıllık bazda. Perakende, turizm için kritik.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># df_stocks'tan bir özellik DataFrame'i başlat</span>
df = pd.<span class="fn">DataFrame</span>({
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>]),
    <span class="str">'y'</span>:  df_stocks[<span class="str">'close'</span>]
}).<span class="fn">set_index</span>(<span class="str">'ds'</span>)

<span class="cm"># Gecikme özellikleri ekle</span>
<span class="kw">for</span> lag <span class="kw">in</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">21</span>]:
    df[f<span class="str">'lag_{lag}'</span>] = df[<span class="str">'y'</span>].<span class="fn">shift</span>(lag)

<span class="fn">print</span>(df.<span class="fn">head</span>(<span class="num">10</span>))
<span class="fn">print</span>(<span class="str">'Shape:'</span>, df.shape)
<span class="fn">print</span>(<span class="str">'NaN per col:'</span>, df.<span class="fn">isna</span>().<span class="fn">sum</span>().<span class="fn">to_dict</span>())
</code></pre></div>
<p class="l-text">Başlangıçta NaN satırlarına dikkat edin — <code>max(lag)</code> satırı kaybedersiniz. Uydurmadan önce daima onları düşürün: <code>df.dropna()</code>.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Hareketli İstatistikler</h2>
<p class="l-text">Pencereli toplamlar yerel trendleri ve oynaklığı yakalar. Mean, std, min, max temel dörttür. Birden çok pencere boyutu (3, 7, 14, 30) kullanın ki model doğru ölçeği seçebilsin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

df = pd.<span class="fn">DataFrame</span>({
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>]),
    <span class="str">'y'</span>:  df_stocks[<span class="str">'close'</span>]
}).<span class="fn">set_index</span>(<span class="str">'ds'</span>)

<span class="cm"># KRİTİK: sızıntıyı önlemek için rolling'den önce shift(1)</span>
y_past = df[<span class="str">'y'</span>].<span class="fn">shift</span>(<span class="num">1</span>)

<span class="kw">for</span> w <span class="kw">in</span> [<span class="num">3</span>, <span class="num">7</span>, <span class="num">14</span>, <span class="num">30</span>]:
    df[f<span class="str">'roll_mean_{w}'</span>] = y_past.<span class="fn">rolling</span>(w).<span class="fn">mean</span>()
    df[f<span class="str">'roll_std_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">std</span>()
    df[f<span class="str">'roll_min_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">min</span>()
    df[f<span class="str">'roll_max_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">max</span>()

<span class="cm"># Bollinger tarzı: mevcut değer hareketli ortalamadan kaç std uzakta?</span>
df[<span class="str">'z_30'</span>] = (df[<span class="str">'y'</span>] - df[<span class="str">'roll_mean_30'</span>]) / df[<span class="str">'roll_std_30'</span>]

<span class="cm"># EWM (üstel ağırlıklı) — daha düzgün, yenilik ağırlıklı</span>
<span class="kw">for</span> span <span class="kw">in</span> [<span class="num">5</span>, <span class="num">20</span>]:
    df[f<span class="str">'ewm_{span}'</span>] = y_past.<span class="fn">ewm</span>(span=span).<span class="fn">mean</span>()

<span class="fn">print</span>(df.<span class="fn">dropna</span>().<span class="fn">head</span>(<span class="num">5</span>).<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(f<span class="str">'Total feature columns: {df.shape[1]}'</span>)
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Hareketli std en iyi oynaklık özelliğinizdir. Quant'lar bu sayı için milyonlar öderler. Onu hemen hemen herhangi bir tahmin modeline ekleyin — genellikle doğruluğu %5-10 artırır.</div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Takvim Özellikleri</h2>
<p class="l-text">Hafta / ay / yıl zamanı. Ucuz, sızıntısız, genellikle tek başına en büyük kazanç.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

df = pd.<span class="fn">DataFrame</span>({
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>]),
    <span class="str">'y'</span>:  df_stocks[<span class="str">'close'</span>]
}).<span class="fn">set_index</span>(<span class="str">'ds'</span>)

idx = df.index
df[<span class="str">'dow'</span>]         = idx.dayofweek          <span class="cm"># 0=Pzt .. 6=Paz</span>
df[<span class="str">'day'</span>]         = idx.day
df[<span class="str">'month'</span>]       = idx.month
df[<span class="str">'quarter'</span>]     = idx.quarter
df[<span class="str">'weekofyear'</span>]  = idx.<span class="fn">isocalendar</span>().week.<span class="fn">astype</span>(<span class="fn">int</span>)
df[<span class="str">'is_month_start'</span>] = idx.is_month_start.<span class="fn">astype</span>(<span class="fn">int</span>)
df[<span class="str">'is_month_end'</span>]   = idx.is_month_end.<span class="fn">astype</span>(<span class="fn">int</span>)
df[<span class="str">'is_quarter_end'</span>] = idx.is_quarter_end.<span class="fn">astype</span>(<span class="fn">int</span>)
df[<span class="str">'days_to_month_end'</span>] = (idx + pd.offsets.<span class="fn">MonthEnd</span>(<span class="num">0</span>) - idx).days

<span class="cm"># Döngüsel kodlama — ham tam sayılardan ağaç modelleri için bile daha iyi</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
df[<span class="str">'dow_sin'</span>]   = np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * df[<span class="str">'dow'</span>]   / <span class="num">7</span>)
df[<span class="str">'dow_cos'</span>]   = np.<span class="fn">cos</span>(<span class="num">2</span> * np.pi * df[<span class="str">'dow'</span>]   / <span class="num">7</span>)
df[<span class="str">'month_sin'</span>] = np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * df[<span class="str">'month'</span>] / <span class="num">12</span>)
df[<span class="str">'month_cos'</span>] = np.<span class="fn">cos</span>(<span class="num">2</span> * np.pi * df[<span class="str">'month'</span>] / <span class="num">12</span>)

<span class="fn">print</span>(df.<span class="fn">head</span>(<span class="num">7</span>)[[<span class="str">'dow'</span>, <span class="str">'day'</span>, <span class="str">'month'</span>, <span class="str">'is_month_end'</span>, <span class="str">'dow_sin'</span>, <span class="str">'dow_cos'</span>]].<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>
<p class="l-text">Neden sin/cos? Ham <code>dow=6</code> (Pazar) ve <code>dow=0</code> (Pazartesi) tam sayı uzayında uzaktır ama döngüsel zamanda bitişiktir. Sin/cos kodlaması onları özellik uzayında yakın yapar.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Fourier Terimleri — Düzgün Çoklu Periyot Mevsimselliği</h2>
<p class="l-text">Uzun periyotlar için (yıllık = 365.25, haftalık + yıllık birlikte), ayrık dummy'ler patlar. Fourier serisi rastgele düzgün periyodikliği 2K sütununa sıkıştırır, burada K mertebedir.</p>
<div class="katex-block">$$\\text{Fourier}(t, m, K) = \\bigcup_{k=1}^{K} \\left\\{ \\sin\\left(\\frac{2\\pi k t}{m}\\right), \\cos\\left(\\frac{2\\pi k t}{m}\\right) \\right\\}$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="kw">def</span> <span class="fn">fourier_features</span>(t, period, K, prefix):
    out = {}
    <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K + <span class="num">1</span>):
        out[f<span class="str">'{prefix}_sin_{k}'</span>] = np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * k * t / period)
        out[f<span class="str">'{prefix}_cos_{k}'</span>] = np.<span class="fn">cos</span>(<span class="num">2</span> * np.pi * k * t / period)
    <span class="kw">return</span> pd.<span class="fn">DataFrame</span>(out)

df = pd.<span class="fn">DataFrame</span>({
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>]),
    <span class="str">'y'</span>:  df_stocks[<span class="str">'close'</span>]
}).<span class="fn">set_index</span>(<span class="str">'ds'</span>)

t = np.<span class="fn">arange</span>(<span class="fn">len</span>(df))
weekly = <span class="fn">fourier_features</span>(t, period=<span class="num">5</span>,    K=<span class="num">2</span>, prefix=<span class="str">'wk'</span>)   <span class="cm"># 5 = iş haftası</span>
monthly = <span class="fn">fourier_features</span>(t, period=<span class="num">21</span>,  K=<span class="num">3</span>, prefix=<span class="str">'mo'</span>)   <span class="cm"># ~21 iş günü</span>
yearly  = <span class="fn">fourier_features</span>(t, period=<span class="num">252</span>, K=<span class="num">4</span>, prefix=<span class="str">'yr'</span>)   <span class="cm"># ~252 iş günü/yıl</span>

fourier = pd.<span class="fn">concat</span>([weekly, monthly, yearly], axis=<span class="num">1</span>)
fourier.index = df.index
df = pd.<span class="fn">concat</span>([df, fourier], axis=<span class="num">1</span>)

<span class="fn">print</span>(<span class="str">'Fourier columns:'</span>, fourier.columns.<span class="fn">tolist</span>())
<span class="fn">print</span>(<span class="str">'Total cols:'</span>, df.shape[<span class="num">1</span>])
</code></pre></div>
<p class="l-text">Pratik kural: haftalık için K = 2, yıllık için K = 3-5. Daha yüksek K daha keskin zirveler uydurur ama aşırı uyum yapar.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Kategorik Kimlikler için Hedef Kodlaması</h2>
<p class="l-text">Aynı anda birçok seri tahmin ettiğinizde (1000 SKU, 50 mağaza, 200 sensör kimliği), kimlik için sayısal bir kodlamaya ihtiyacınız olur. One-hot patlar. Hedef kodlaması: her kategoriyi yalnızca geçmiş veriler üzerinde hesaplanan tarihsel ortalama hedefle değiştirin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># df_orders'ın product_id ve amount sütunları olduğunu varsayalım — aynı anda birden çok seri</span>
df_o = df_orders.<span class="fn">copy</span>()
df_o[<span class="str">'date'</span>] = pd.<span class="fn">to_datetime</span>(df_o[<span class="str">'order_date'</span>])
df_o = df_o.<span class="fn">sort_values</span>(<span class="str">'date'</span>).<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)

<span class="cm"># Sızıntıyı önlemek için 1 ile kaydırılmış product_id bazında hedefin genişleyen ortalaması</span>
df_o[<span class="str">'prod_mean_target'</span>] = (
    df_o.<span class="fn">groupby</span>(<span class="str">'product_id'</span>)[<span class="str">'amount'</span>]
        .<span class="fn">transform</span>(<span class="kw">lambda</span> s: s.<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">expanding</span>().<span class="fn">mean</span>())
)

<span class="fn">print</span>(df_o[[<span class="str">'date'</span>, <span class="str">'product_id'</span>, <span class="str">'amount'</span>, <span class="str">'prod_mean_target'</span>]].<span class="fn">head</span>(<span class="num">15</span>))
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Düzgünleştirilmiş hedef kodlaması: <code>(n·mean_cat + α·mean_global) / (n + α)</code>, α = 10. Az gözlemli küçük kategorilere aşırı uyumu önler.</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Dışsal Değişkenler — ve Gelecek Bilgisi Problemi</h2>
<p class="l-text">Dış sinyaller (hava durumu, pazarlama harcaması, rakip fiyatı) altındır — tahmin zamanında elinizdeyse. İki strateji:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bilinen gelecek (takvim, planlanmış olaylar)</div><div class="card-body">Okul tatilleri, planlanmış pazarlama atılımları, kendi fiyat değişiklikleriniz. Mevcut, doğrudan kullanın.</div></div>
<div class="calc-card"><div class="card-title">Önce tahmin (hava durumu, döviz kurları)</div><div class="card-body">Dışsal için ayrı bir tahmin (veya senaryo) kullanın, belirsizliği yayın.</div></div>
<div class="calc-card"><div class="card-title">Gecikmeli dışsal</div><div class="card-body">Geçen haftaki pazarlama harcaması bu haftaki satışları tahmin eder. Daima mevcut, gelecek sızıntısı yok.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Dışsalı simüle et: df_stocks'tan sentetik 'volume' serisi</span>
df = pd.<span class="fn">DataFrame</span>({
    <span class="str">'ds'</span>: pd.<span class="fn">to_datetime</span>(df_stocks[<span class="str">'date'</span>]),
    <span class="str">'y'</span>:  df_stocks[<span class="str">'close'</span>],
    <span class="str">'volume'</span>: df_stocks[<span class="str">'volume'</span>]
}).<span class="fn">set_index</span>(<span class="str">'ds'</span>)

<span class="cm"># Dışsalı kesinlikle geçmiş olacak şekilde geciktir</span>
df[<span class="str">'vol_lag1'</span>] = df[<span class="str">'volume'</span>].<span class="fn">shift</span>(<span class="num">1</span>)
df[<span class="str">'vol_lag5_mean'</span>] = df[<span class="str">'volume'</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">5</span>).<span class="fn">mean</span>()
df[<span class="str">'vol_change'</span>]    = df[<span class="str">'volume'</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">pct_change</span>()

<span class="cm"># Etkileşim: hacim artışı × dünkü kapanış</span>
df[<span class="str">'vol_yclose'</span>] = df[<span class="str">'vol_lag1'</span>] * df[<span class="str">'y'</span>].<span class="fn">shift</span>(<span class="num">1</span>)

<span class="fn">print</span>(df.<span class="fn">dropna</span>().<span class="fn">head</span>(<span class="num">5</span>).<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Hepsini Bir Araya Getir — make_features()</h2>
<p class="l-text">Yeniden kullanılabilir bir özellik fabrikası. Bir (tarih, y) serisi geçirin, ML için hazır 30+ sütunlu bir DataFrame alın.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="kw">def</span> <span class="fn">make_features</span>(dates, y, lags=(<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">7</span>,<span class="num">14</span>), wins=(<span class="num">3</span>,<span class="num">7</span>,<span class="num">14</span>,<span class="num">30</span>), fourier_periods=((<span class="num">5</span>,<span class="num">2</span>),(<span class="num">21</span>,<span class="num">3</span>))):
    df = pd.<span class="fn">DataFrame</span>({<span class="str">'y'</span>: y}, index=pd.<span class="fn">to_datetime</span>(dates))

    <span class="cm"># Gecikmeler</span>
    <span class="kw">for</span> lag <span class="kw">in</span> lags:
        df[f<span class="str">'lag_{lag}'</span>] = df[<span class="str">'y'</span>].<span class="fn">shift</span>(lag)

    <span class="cm"># Hareketli istatistikler (kesinlikle geçmiş olacak şekilde kaydırılmış)</span>
    y_past = df[<span class="str">'y'</span>].<span class="fn">shift</span>(<span class="num">1</span>)
    <span class="kw">for</span> w <span class="kw">in</span> wins:
        df[f<span class="str">'mean_{w}'</span>] = y_past.<span class="fn">rolling</span>(w).<span class="fn">mean</span>()
        df[f<span class="str">'std_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">std</span>()
        df[f<span class="str">'min_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">min</span>()
        df[f<span class="str">'max_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">max</span>()

    <span class="cm"># Takvim</span>
    idx = df.index
    df[<span class="str">'dow'</span>]   = idx.dayofweek
    df[<span class="str">'month'</span>] = idx.month
    df[<span class="str">'day'</span>]   = idx.day
    df[<span class="str">'is_month_end'</span>] = idx.is_month_end.<span class="fn">astype</span>(<span class="fn">int</span>)
    df[<span class="str">'dow_sin'</span>]   = np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*df[<span class="str">'dow'</span>]  /<span class="num">7</span>)
    df[<span class="str">'dow_cos'</span>]   = np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*df[<span class="str">'dow'</span>]  /<span class="num">7</span>)
    df[<span class="str">'month_sin'</span>] = np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*df[<span class="str">'month'</span>]/<span class="num">12</span>)
    df[<span class="str">'month_cos'</span>] = np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*df[<span class="str">'month'</span>]/<span class="num">12</span>)

    <span class="cm"># Fourier</span>
    t = np.<span class="fn">arange</span>(<span class="fn">len</span>(df))
    <span class="kw">for</span> period, K <span class="kw">in</span> fourier_periods:
        <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, K+<span class="num">1</span>):
            df[f<span class="str">'fr_{period}_s{k}'</span>] = np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*k*t/period)
            df[f<span class="str">'fr_{period}_c{k}'</span>] = np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*k*t/period)

    <span class="kw">return</span> df

feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>])
feat = feat.<span class="fn">dropna</span>()
<span class="fn">print</span>(f<span class="str">'Feature matrix: {feat.shape[0]} rows × {feat.shape[1]} cols'</span>)
<span class="fn">print</span>(<span class="str">'Columns:'</span>, feat.columns.<span class="fn">tolist</span>())
<span class="fn">print</span>(feat.<span class="fn">head</span>(<span class="num">3</span>).<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>
<p class="l-text">Bu tek fonksiyon her modern ML tahmin hattının girdisidir. L5'te onu doğrudan LightGBM'e bırakıyoruz ve ARIMA'yı yendiğini izliyoruz.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Özet ve Sonraki Adımlar</h2>
<ul style="line-height:1.7"><li>Gecikme özellikleri = AR tarzı bellek; alan döngülerinize uyan gecikmeler seçin</li><li>Hareketli istatistikler = yerel trend ve oynaklık; <strong>rolling'den önce daima shift(1)</strong></li><li>Takvim özellikleri (dow/ay/tatil) genellikle diğer sinyallere hâkimdir</li><li>Fourier terimleri = düşük sütun maliyetiyle düzgün çoklu periyot mevsimselliği</li><li>Hedef kodlaması = birçok seri için ölçeklenebilir kategorik kodlama</li><li>Dışsal: yalnızca tahmin zamanında elinizde olacak olanı kullanın veya önce onu tahmin edin</li></ul>
<p class="l-text"><strong>L5</strong>'te bu özellik matrisini LightGBM'e besliyoruz, TimeSeriesSplit + ileri-yürüme CV kuruyoruz ve L1 referansları ile L2 ARIMA'ya karşı kıyaslıyoruz. Zaman serisi için tablo ML'i, çoğu ML odaklı şirkette üretim gerçekliğidir.</p>
</div>`
};
