window.TIMESERIES_L10 = {

en: `<p class="l-text"><strong>Capstone time.</strong> You have learned classical models, deep nets, Transformers, and probabilistic forecasting. A real forecasting product needs all of them, glued together with data ingestion, feature engineering, evaluation, monitoring, and a retraining cadence. This lesson is the blueprint.</p>

<p class="l-text">We build an end-to-end pipeline on <code>df_stocks</code>: ingest OHLCV, engineer lag and calendar features, train a three-model ensemble (AR statistical baseline + GradientBoosting on lags + STL decomposition), evaluate with rolling-origin backtest, attach conformal intervals, then design the monitoring metrics and retraining triggers that keep the system honest in production.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Design a rolling-origin backtest that respects time order</li>
<li>Engineer lag, rolling-stat, and calendar features from raw OHLCV</li>
<li>Combine statistical (AR), ML (GBM), and decomposition (STL) into an ensemble</li>
<li>Wrap predictions with split conformal intervals</li>
<li>Compute MASE, sMAPE, MAE, coverage, and width on each fold</li>
<li>Define monitoring metrics and retraining triggers for production</li>
<li>Trace the full pipeline through 8 numbered stages</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Pipeline at a Glance</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Ingest</div><div class="card-body">Pull raw OHLCV. Validate schema, deduplicate, fill gaps.</div></div>
<div class="calc-card"><div class="card-title">2. Features</div><div class="card-body">Lags, rolling means, returns, volatility, calendar dummies.</div></div>
<div class="calc-card"><div class="card-title">3. Split</div><div class="card-body">Rolling-origin folds. Never random shuffle a time series.</div></div>
<div class="calc-card"><div class="card-title">4. Models</div><div class="card-body">AR baseline, GBM on lags, STL trend extrapolation.</div></div>
<div class="calc-card"><div class="card-title">5. Ensemble</div><div class="card-body">Weighted average tuned on validation MAE.</div></div>
<div class="calc-card"><div class="card-title">6. Intervals</div><div class="card-body">Split conformal on residuals.</div></div>
<div class="calc-card"><div class="card-title">7. Monitor</div><div class="card-body">Daily error tracking, drift alarms.</div></div>
<div class="calc-card"><div class="card-title">8. Retrain</div><div class="card-body">Triggers: time-based, error-based, drift-based.</div></div>
</div>
<div class="calc-highlight">Every block here is replaceable — swap GBM for PatchTST when data grows, swap STL for N-BEATS when seasonality is complex. The interfaces stay constant.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Stage 1 — Ingestion and Validation</h2>
<p class="l-text">Real ingestion is rarely clean: missing dates, duplicate rows, currency or unit changes. Lock in a schema, fail loud on violation, log everything.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

raw = df_stocks.<span class="fn">copy</span>()
raw[<span class="str">"Date"</span>] = pd.<span class="fn">to_datetime</span>(raw[<span class="str">"Date"</span>])
raw = raw.<span class="fn">sort_values</span>(<span class="str">"Date"</span>).<span class="fn">drop_duplicates</span>(<span class="str">"Date"</span>).<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)

<span class="cm"># schema check</span>
expected = {<span class="str">"Date"</span>, <span class="str">"Open"</span>, <span class="str">"High"</span>, <span class="str">"Low"</span>, <span class="str">"Close"</span>, <span class="str">"Volume"</span>}
missing  = expected - <span class="fn">set</span>(raw.columns)
<span class="kw">assert</span> <span class="kw">not</span> missing, <span class="fn">f</span><span class="str">"missing cols: {missing}"</span>

<span class="cm"># gap detection</span>
gaps = raw[<span class="str">"Date"</span>].<span class="fn">diff</span>().dt.days.<span class="fn">fillna</span>(<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"rows:"</span>, <span class="fn">len</span>(raw), <span class="str">" max gap (days):"</span>, <span class="fn">int</span>(gaps.<span class="fn">max</span>()))
<span class="fn">print</span>(<span class="str">"any NaN:"</span>, raw.<span class="fn">isna</span>().<span class="fn">any</span>().<span class="fn">any</span>())</code></pre></div>
<p class="l-text">Output goes to a clean <code>raw</code> DataFrame; downstream stages assume the schema holds.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Stage 2 — Feature Engineering</h2>
<p class="l-text">Three families: <em>lag features</em> (Close at t-1, t-7, t-30), <em>rolling stats</em> (7-day mean, 30-day std), <em>calendar</em> (day-of-week, month). All computed without leakage by using only past values.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

df = df_stocks.<span class="fn">copy</span>()
df[<span class="str">"Date"</span>] = pd.<span class="fn">to_datetime</span>(df[<span class="str">"Date"</span>])
df = df.<span class="fn">sort_values</span>(<span class="str">"Date"</span>).<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)

<span class="kw">for</span> lag <span class="kw">in</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">20</span>]:
    df[<span class="fn">f</span><span class="str">"close_lag_{lag}"</span>] = df[<span class="str">"Close"</span>].<span class="fn">shift</span>(lag)
df[<span class="str">"ma_7"</span>]   = df[<span class="str">"Close"</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">7</span>).<span class="fn">mean</span>()
df[<span class="str">"std_7"</span>]  = df[<span class="str">"Close"</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">7</span>).<span class="fn">std</span>()
df[<span class="str">"ret_1"</span>]  = df[<span class="str">"Close"</span>].<span class="fn">pct_change</span>().<span class="fn">shift</span>(<span class="num">1</span>)
df[<span class="str">"vol_ma"</span>] = df[<span class="str">"Volume"</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">7</span>).<span class="fn">mean</span>()
df[<span class="str">"dow"</span>]    = df[<span class="str">"Date"</span>].dt.dayofweek
df[<span class="str">"month"</span>]  = df[<span class="str">"Date"</span>].dt.month

feat_cols = [c <span class="kw">for</span> c <span class="kw">in</span> df.columns
             <span class="kw">if</span> c <span class="kw">not</span> <span class="kw">in</span> {<span class="str">"Date"</span>, <span class="str">"Open"</span>, <span class="str">"High"</span>, <span class="str">"Low"</span>, <span class="str">"Close"</span>, <span class="str">"Volume"</span>}]
df = df.<span class="fn">dropna</span>().<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
<span class="fn">print</span>(<span class="str">"features:"</span>, feat_cols)
<span class="fn">print</span>(<span class="str">"shape after dropna:"</span>, df.shape)</code></pre></div>
<p class="l-text">Note the <code>shift(1)</code> on every rolling stat — without it tomorrow's mean leaks tomorrow's value.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Stage 3 — Rolling-Origin Backtest</h2>
<p class="l-text">Random K-fold leaks the future. Rolling-origin keeps train always before test, sliding the cut forward. Five folds with a 30-day test window simulates five months of production.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Expanding window</div><div class="card-body">Train on [0, t], test on (t, t+H]. Train grows each fold.</div></div>
<div class="calc-card"><div class="card-title">Sliding window</div><div class="card-body">Train on [t-W, t]. Fixed train size — robust to drift.</div></div>
<div class="calc-card"><div class="card-title">Gap</div><div class="card-body">Insert a buffer between train and test if features use rolling windows.</div></div>
<div class="calc-card"><div class="card-title">Aggregate</div><div class="card-body">Average metrics across folds — single number is fragile.</div></div>
</div>
<div class="calc-highlight">A model that wins fold-by-fold but loses in mean is overfitting; one that wins in mean but loses three of five folds is fragile. Always look at both.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Stage 4 — Three Models</h2>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Train all three models — AR(5), GradientBoosting on lag features, STL trend extrapolation — on 80% of df_stocks and report 1-step MAE on the held-out 20%.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression, Ridge
<span class="kw">from</span> sklearn.ensemble    <span class="kw">import</span> GradientBoostingRegressor
<span class="kw">from</span> scipy.signal        <span class="kw">import</span> savgol_filter

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)

<span class="cm"># lag matrix</span>
lags = <span class="num">5</span>
X = np.<span class="fn">stack</span>([close[i:i+lags] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(close)-lags-<span class="num">1</span>)])
y = close[lags+<span class="num">1</span>:]
cut = <span class="fn">int</span>(<span class="fn">len</span>(X) * <span class="num">0.8</span>)

ar  = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X[:cut], y[:cut])
gbm = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">120</span>, max_depth=<span class="num">3</span>,
                                random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[:cut], y[:cut])

<span class="cm"># STL via Savitzky-Golay trend on training tail; extrapolate flat</span>
trend = <span class="fn">savgol_filter</span>(close[:cut+lags+<span class="num">1</span>], window_length=<span class="num">31</span>, polyorder=<span class="num">2</span>)
slope = (trend[-<span class="num">1</span>] - trend[-<span class="num">11</span>]) / <span class="num">10</span>
stl_pred = trend[-<span class="num">1</span>] + slope * np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="fn">len</span>(y[cut:]) + <span class="num">1</span>)

p_ar  = ar.<span class="fn">predict</span>(X[cut:])
p_gbm = gbm.<span class="fn">predict</span>(X[cut:])
truth = y[cut:]
<span class="kw">for</span> name, p <span class="kw">in</span> [(<span class="str">"AR"</span>, p_ar), (<span class="str">"GBM"</span>, p_gbm), (<span class="str">"STL"</span>, stl_pred)]:
    mae = np.<span class="fn">abs</span>(p - truth).<span class="fn">mean</span>()
    <span class="fn">print</span>(<span class="fn">f</span><span class="str">"{name:5s} MAE: {mae:.3f}"</span>)</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Stage 5 — Ensemble Weights</h2>
<p class="l-text">Weights come from validation, not training. Solve <span class="katex-block">$$\\min_{w \\geq 0,\\ \\sum w = 1} \\| Pw - y \\|^2$$</span> on a held-out fold via constrained least squares (or grid-search over a 3-simplex).</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Grid-search ensemble weights on a validation fold and report the best convex combination plus its MAE — and compare against the best individual model.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression
<span class="kw">from</span> sklearn.ensemble    <span class="kw">import</span> GradientBoostingRegressor
<span class="kw">from</span> scipy.signal        <span class="kw">import</span> savgol_filter

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
lags  = <span class="num">5</span>
X = np.<span class="fn">stack</span>([close[i:i+lags] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(close)-lags-<span class="num">1</span>)])
y = close[lags+<span class="num">1</span>:]
n = <span class="fn">len</span>(X)
i_tr, i_va = <span class="fn">int</span>(n*<span class="num">0.6</span>), <span class="fn">int</span>(n*<span class="num">0.8</span>)

ar  = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X[:i_tr], y[:i_tr])
gbm = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[:i_tr], y[:i_tr])
trend = <span class="fn">savgol_filter</span>(close[:i_tr+lags+<span class="num">1</span>], <span class="num">31</span>, <span class="num">2</span>)
slope = (trend[-<span class="num">1</span>] - trend[-<span class="num">11</span>]) / <span class="num">10</span>

<span class="kw">def</span> <span class="fn">stl_predict</span>(<span class="fn">range_n</span>):
    <span class="kw">return</span> trend[-<span class="num">1</span>] + slope * np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="fn">range_n</span> + <span class="num">1</span>)

<span class="cm"># predictions on validation</span>
p1 = ar.<span class="fn">predict</span>(X[i_tr:i_va])
p2 = gbm.<span class="fn">predict</span>(X[i_tr:i_va])
p3 = <span class="fn">stl_predict</span>(i_va - i_tr)
yv = y[i_tr:i_va]

best = (<span class="num">1e9</span>, <span class="kw">None</span>)
<span class="kw">for</span> w1 <span class="kw">in</span> np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, <span class="num">11</span>):
    <span class="kw">for</span> w2 <span class="kw">in</span> np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span> - w1, <span class="num">11</span>):
        w3 = <span class="num">1</span> - w1 - w2
        ens = w1*p1 + w2*p2 + w3*p3
        mae = np.<span class="fn">abs</span>(ens - yv).<span class="fn">mean</span>()
        <span class="kw">if</span> mae &lt; best[<span class="num">0</span>]:
            best = (mae, (w1, w2, w3))

<span class="fn">print</span>(<span class="fn">f</span><span class="str">"best weights (AR,GBM,STL): {best[1]}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"validation MAE ensemble:   {best[0]:.3f}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"validation MAE AR alone:   {np.abs(p1 - yv).mean():.3f}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"validation MAE GBM alone:  {np.abs(p2 - yv).mean():.3f}"</span>)</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Stage 6 — Conformal Intervals on the Ensemble</h2>
<p class="l-text">Treat the ensemble as a single black box. On a fresh calibration fold compute residuals and take the (1 - alpha) quantile as the radius. Test-time interval = ensemble_pred ± q.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
lags = <span class="num">5</span>; alpha = <span class="num">0.1</span>
X = np.<span class="fn">stack</span>([close[i:i+lags] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(close)-lags-<span class="num">1</span>)])
y = close[lags+<span class="num">1</span>:]
n = <span class="fn">len</span>(X)
i_tr, i_cal = <span class="fn">int</span>(n*<span class="num">0.6</span>), <span class="fn">int</span>(n*<span class="num">0.8</span>)
mdl = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X[:i_tr], y[:i_tr])

cal_resid = np.<span class="fn">abs</span>(y[i_tr:i_cal] - mdl.<span class="fn">predict</span>(X[i_tr:i_cal]))
n_cal = <span class="fn">len</span>(cal_resid)
q = np.<span class="fn">quantile</span>(cal_resid, <span class="fn">min</span>(np.<span class="fn">ceil</span>((n_cal+<span class="num">1</span>)*(<span class="num">1</span>-alpha))/n_cal, <span class="num">1.0</span>))

mu = mdl.<span class="fn">predict</span>(X[i_cal:])
lo, hi = mu - q, mu + q
yt = y[i_cal:]
cov = ((yt &gt;= lo) &amp; (yt &lt;= hi)).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"target {1-alpha:.0%}  empirical {cov:.0%}  width {2*q:.2f}"</span>)</code></pre></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Stage 7 — Evaluation Metrics</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MAE</div><div class="card-body">Mean Absolute Error. Same units as target.</div></div>
<div class="calc-card"><div class="card-title">sMAPE</div><div class="card-body">Symmetric percentage. Scale-free, fair across series.</div></div>
<div class="calc-card"><div class="card-title">MASE</div><div class="card-body">MAE divided by naive-seasonal MAE. &lt;1 means you beat the trivial baseline.</div></div>
<div class="calc-card"><div class="card-title">Coverage</div><div class="card-body">P(y in interval). Should equal 1 - alpha.</div></div>
<div class="calc-card"><div class="card-title">Width</div><div class="card-body">Average interval width. Lower is sharper.</div></div>
<div class="calc-card"><div class="card-title">CRPS</div><div class="card-body">Distribution-aware MAE generalization.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">smape</span>(y, p):
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">mean</span>(<span class="num">2</span> * np.<span class="fn">abs</span>(p - y) / (np.<span class="fn">abs</span>(p) + np.<span class="fn">abs</span>(y) + <span class="num">1e-9</span>)))

<span class="kw">def</span> <span class="fn">mase</span>(y, p, season=<span class="num">5</span>):
    naive = np.<span class="fn">abs</span>(np.<span class="fn">diff</span>(y, n=season)).<span class="fn">mean</span>() + <span class="num">1e-9</span>
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">abs</span>(p - y).<span class="fn">mean</span>() / naive)

y = df_stocks[<span class="str">"Close"</span>].values[-<span class="num">30</span>:]
p = y * <span class="num">1.01</span> + np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.5</span>, <span class="fn">len</span>(y))
<span class="fn">print</span>(<span class="str">"sMAPE:"</span>, <span class="fn">round</span>(<span class="fn">smape</span>(y, p), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"MASE :"</span>, <span class="fn">round</span>(<span class="fn">mase</span>(y, p), <span class="num">3</span>))</code></pre></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Stage 8 — Monitoring in Production</h2>
<p class="l-text">Once deployed the model degrades silently. Three monitors catch the slide:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rolling MAE</div><div class="card-body">Compute MAE on the last 30 days of actuals. Alert if it exceeds 1.5x the training MAE.</div></div>
<div class="calc-card"><div class="card-title">Coverage drift</div><div class="card-body">If empirical coverage of 90% intervals drops below 0.80 over a month, the world has shifted.</div></div>
<div class="calc-card"><div class="card-title">Feature drift</div><div class="card-body">PSI / KS test on each input feature vs training distribution. Catches data pipeline regressions.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.stats <span class="kw">import</span> ks_2samp

ref = df_stocks[<span class="str">"Close"</span>].values[:<span class="num">200</span>]
new = df_stocks[<span class="str">"Close"</span>].values[<span class="num">200</span>:]
stat, p = <span class="fn">ks_2samp</span>(ref, new)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"KS stat={stat:.3f}  p-value={p:.4f}"</span>)
<span class="fn">print</span>(<span class="str">"alert"</span> <span class="kw">if</span> p &lt; <span class="num">0.01</span> <span class="kw">else</span> <span class="str">"stable"</span>)</code></pre></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Stage 8 (cont.) — Retraining Cadence</h2>
<p class="l-text">Three retrain triggers, in increasing cost:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Time-based</div><div class="card-body">Every Sunday at 02:00 UTC. Predictable, easy to budget.</div></div>
<div class="calc-card"><div class="card-title">Error-based</div><div class="card-body">When rolling MAE breaches 1.5x baseline. Reactive, fast.</div></div>
<div class="calc-card"><div class="card-title">Drift-based</div><div class="card-body">When PSI &gt; 0.25 on any key feature. Catches silent shifts.</div></div>
<div class="calc-card"><div class="card-title">Manual</div><div class="card-body">Always keep a kill switch and a manual retrain endpoint.</div></div>
</div>
<div class="calc-highlight">Retraining is risky — every fit can degrade as well as improve. Always shadow the new model for one cycle, compare against the incumbent, then promote.</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Putting It All Together — One Backtest</h2>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Full rolling-origin backtest: 4 folds of 30 days each, ensemble + conformal interval, prints fold-by-fold MAE, sMAPE, coverage, and width.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression
<span class="kw">from</span> sklearn.ensemble    <span class="kw">import</span> GradientBoostingRegressor

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
lags  = <span class="num">5</span>
X = np.<span class="fn">stack</span>([close[i:i+lags] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(close)-lags-<span class="num">1</span>)])
y = close[lags+<span class="num">1</span>:]

n_total = <span class="fn">len</span>(X); H = <span class="num">30</span>; n_folds = <span class="num">4</span>
start = n_total - n_folds * H; alpha = <span class="num">0.1</span>

results = []
<span class="kw">for</span> f <span class="kw">in</span> <span class="fn">range</span>(n_folds):
    tr_end = start + f * H
    te_end = tr_end + H
    Xtr, ytr = X[:tr_end], y[:tr_end]
    Xte, yte = X[tr_end:te_end], y[tr_end:te_end]
    cal_split = <span class="fn">int</span>(<span class="fn">len</span>(Xtr) * <span class="num">0.85</span>)

    ar  = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(Xtr[:cal_split], ytr[:cal_split])
    gbm = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">80</span>, max_depth=<span class="num">3</span>,
                                    random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xtr[:cal_split], ytr[:cal_split])
    p_ar  = ar.<span class="fn">predict</span>(Xte)
    p_gbm = gbm.<span class="fn">predict</span>(Xte)
    ens   = <span class="num">0.5</span> * p_ar + <span class="num">0.5</span> * p_gbm

    cal_res = np.<span class="fn">abs</span>(ytr[cal_split:] - <span class="num">0.5</span>*ar.<span class="fn">predict</span>(Xtr[cal_split:])
                                          - <span class="num">0.5</span>*gbm.<span class="fn">predict</span>(Xtr[cal_split:]))
    q = np.<span class="fn">quantile</span>(cal_res, <span class="num">1</span> - alpha)
    lo, hi = ens - q, ens + q
    cov = ((yte &gt;= lo) &amp; (yte &lt;= hi)).<span class="fn">mean</span>()
    mae = np.<span class="fn">abs</span>(ens - yte).<span class="fn">mean</span>()
    smp = (<span class="num">2</span>*np.<span class="fn">abs</span>(ens - yte) / (np.<span class="fn">abs</span>(ens)+np.<span class="fn">abs</span>(yte)+<span class="num">1e-9</span>)).<span class="fn">mean</span>()
    results.<span class="fn">append</span>((f+<span class="num">1</span>, mae, smp, cov, <span class="num">2</span>*q))

<span class="fn">print</span>(<span class="str">"fold | MAE   sMAPE  cov   width"</span>)
<span class="kw">for</span> f, mae, smp, cov, w <span class="kw">in</span> results:
    <span class="fn">print</span>(<span class="fn">f</span><span class="str">"  {f}  | {mae:5.2f}  {smp:.3f}  {cov:.2f}  {w:5.2f}"</span>)
mean_mae = np.<span class="fn">mean</span>([r[<span class="num">1</span>] <span class="kw">for</span> r <span class="kw">in</span> results])
mean_cov = np.<span class="fn">mean</span>([r[<span class="num">3</span>] <span class="kw">for</span> r <span class="kw">in</span> results])
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"avg  | MAE={mean_mae:.2f}  cov={mean_cov:.2f}"</span>)</code></pre></div>
</div>
<p class="l-text">Run this every night and you have a working backtest harness. Add new models by extending the ensemble; the rest stays put.</p>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Foundation Models in the Production Pipeline</h2>
<p class="l-text"><strong>The 2024 foundation-model wave changes how you architect this pipeline.</strong> The traditional flow — ingest → feature engineer → train ARIMA / GBM / N-BEATS per series → backtest → serve — still works. But for cold-start series and zero-shot baselines, a pretrained forecaster like TimesFM or Chronos drops in as a no-fit model and often beats your XGBoost on series with &lt; 200 observations. The cards below are the six pretrained models you should be aware of when planning the pipeline.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">TimesFM (Google, Feb 2024)</div><div class="card-body">200M decoder-only, pre-trained on 100B time points. Drop-in zero-shot for univariate or multivariate. HuggingFace open weights — ship as a forecast() microservice.</div></div>
<div class="calc-card"><div class="card-title">Lag-Llama (ServiceNow, Feb 2024)</div><div class="card-body">200M probabilistic forecaster, student-t outputs. Lag-only input means radical simplicity in feature pipeline — no calendar joins. Great cold-start baseline.</div></div>
<div class="calc-card"><div class="card-title">Time-MoE (Oct 2024)</div><div class="card-body">Mixture-of-experts up to 2.4B params with sparse activation. Top-tier accuracy when long context is available; cost per forecast is still modest thanks to MoE routing.</div></div>
<div class="calc-card"><div class="card-title">MOIRAI v2 (Salesforce, 2024)</div><div class="card-body">Universal forecaster — one model handles any frequency and variate count. Open weights in three sizes. Perfect for inventory / demand pipelines spanning hourly + daily + weekly series.</div></div>
<div class="calc-card"><div class="card-title">Chronos-T5 (Amazon, Mar 2024)</div><div class="card-body">Tokenize-numeric trick on T5 backbone. Five sizes 8M–710M. Useful when you already have a transformers / vLLM serving stack and want minimal new infra.</div></div>
<div class="calc-card"><div class="card-title">TimeGPT-1 (Nixtla)</div><div class="card-body">Closed-API, fast, calibrated. Use as a commercial fallback or as a sanity check against your open-weight stack in CI.</div></div>
</div>
<div class="calc-highlight"><strong>Pipeline integration:</strong> add a "zero-shot foundation" model alongside your GBM/AR/ETS as a fourth ensemble member. For series with &lt; 200 observations or new SKUs, weight it highest. Retrain cadence does not apply (no per-series fitting) — only the ensemble combiner needs nightly refresh. Conformal intervals from L7 wrap cleanly around the foundation model's point forecasts.</div>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Where to Go Next</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Scale up</div><div class="card-body">Replace GBM with PatchTST or N-HITS once you have ≥ 100 series.</div></div>
<div class="calc-card"><div class="card-title">Foundation models</div><div class="card-body">Try Chronos / TimeGPT zero-shot as a baseline.</div></div>
<div class="calc-card"><div class="card-title">Hierarchies</div><div class="card-body">Reconciliation across product / region hierarchies (HierarchicalForecast).</div></div>
<div class="calc-card"><div class="card-title">Causal features</div><div class="card-body">Promotions, holidays, weather. Often more lift than fancier models.</div></div>
<div class="calc-card"><div class="card-title">Online learning</div><div class="card-body">River-style incremental updates instead of nightly retrain.</div></div>
<div class="calc-card"><div class="card-title">Deploy</div><div class="card-body">FastAPI + Docker + cron retrain. See the MLOps track.</div></div>
</div>
<div class="calc-highlight">You now have the full forecasting toolbox — statistical, ML, deep, probabilistic, plus the production scaffolding. The hard problem is rarely the model; it is the pipeline around it.</div>
</div>
`,
tr: `<p class="l-text"><strong>Capstone zamanı.</strong> Klasik modelleri, derin ağları, Transformer'ları ve olasılıksal tahminciliği öğrendin. Gerçek bir tahmincilik ürünü hepsine ihtiyaç duyar, veri alımı, özellik mühendisliği, değerlendirme, izleme ve yeniden eğitim kadansıyla birlikte yapıştırılmıştır. Bu ders bunun planıdır.</p>

<p class="l-text"><code>df_stocks</code> üzerinde uçtan uca bir hat inşa ediyoruz: OHLCV al, gecikme ve takvim özellikleri tasarla, üç modelli bir topluluk (AR istatistiksel referans + gecikmelerde GradientBoosting + STL ayrıştırma) eğit, kayan-orijin geriye dönük testle değerlendir, konformal aralıklar bağla, sonra sistemi üretimde dürüst tutan izleme metriklerini ve yeniden eğitim tetikleyicilerini tasarla.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Zaman sırasına saygı duyan kayan-orijin geriye dönük test tasarla</li>
<li>Ham OHLCV'den gecikme, hareketli istatistik ve takvim özellikleri tasarla</li>
<li>İstatistiksel (AR), ML (GBM) ve ayrıştırmayı (STL) bir topluluğa birleştir</li>
<li>Tahminleri bölünmüş konformal aralıklarla sar</li>
<li>Her katmanda MASE, sMAPE, MAE, kapsama ve genişliği hesapla</li>
<li>Üretim için izleme metrikleri ve yeniden eğitim tetikleyicileri tanımla</li>
<li>Tüm hattı 8 numaralı aşamada izle</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Hat Bir Bakışta</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Alım</div><div class="card-body">Ham OHLCV'yi çek. Şemayı doğrula, çoğaltmaları çıkar, boşlukları doldur.</div></div>
<div class="calc-card"><div class="card-title">2. Özellikler</div><div class="card-body">Gecikmeler, hareketli ortalamalar, getiriler, oynaklık, takvim dummy'leri.</div></div>
<div class="calc-card"><div class="card-title">3. Ayrım</div><div class="card-body">Kayan-orijin katmanları. Bir zaman serisini asla rastgele karıştırma.</div></div>
<div class="calc-card"><div class="card-title">4. Modeller</div><div class="card-body">AR referansı, gecikmelerde GBM, STL trend ekstrapolasyonu.</div></div>
<div class="calc-card"><div class="card-title">5. Topluluk</div><div class="card-body">Doğrulama MAE'si üzerinde ayarlanmış ağırlıklı ortalama.</div></div>
<div class="calc-card"><div class="card-title">6. Aralıklar</div><div class="card-body">Artıklarda bölünmüş konformal.</div></div>
<div class="calc-card"><div class="card-title">7. İzle</div><div class="card-body">Günlük hata izleme, sürüklenme alarmları.</div></div>
<div class="calc-card"><div class="card-title">8. Yeniden eğit</div><div class="card-body">Tetikleyiciler: zaman tabanlı, hata tabanlı, sürüklenme tabanlı.</div></div>
</div>
<div class="calc-highlight">Buradaki her blok değiştirilebilir — veri büyüdüğünde GBM'yi PatchTST ile değiştir, mevsimsellik karmaşık olduğunda STL'i N-BEATS ile değiştir. Arabirimler sabit kalır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Aşama 1 — Alım ve Doğrulama</h2>
<p class="l-text">Gerçek alım nadiren temizdir: eksik tarihler, çoğaltılmış satırlar, para birimi veya birim değişiklikleri. Bir şemada kilitle, ihlalde yüksek sesle başarısız ol, her şeyi günlüğe al.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

raw = df_stocks.<span class="fn">copy</span>()
raw[<span class="str">"Date"</span>] = pd.<span class="fn">to_datetime</span>(raw[<span class="str">"Date"</span>])
raw = raw.<span class="fn">sort_values</span>(<span class="str">"Date"</span>).<span class="fn">drop_duplicates</span>(<span class="str">"Date"</span>).<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)

<span class="cm"># şema kontrolü</span>
expected = {<span class="str">"Date"</span>, <span class="str">"Open"</span>, <span class="str">"High"</span>, <span class="str">"Low"</span>, <span class="str">"Close"</span>, <span class="str">"Volume"</span>}
missing  = expected - <span class="fn">set</span>(raw.columns)
<span class="kw">assert</span> <span class="kw">not</span> missing, <span class="fn">f</span><span class="str">"missing cols: {missing}"</span>

<span class="cm"># boşluk tespiti</span>
gaps = raw[<span class="str">"Date"</span>].<span class="fn">diff</span>().dt.days.<span class="fn">fillna</span>(<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"rows:"</span>, <span class="fn">len</span>(raw), <span class="str">" max gap (days):"</span>, <span class="fn">int</span>(gaps.<span class="fn">max</span>()))
<span class="fn">print</span>(<span class="str">"any NaN:"</span>, raw.<span class="fn">isna</span>().<span class="fn">any</span>().<span class="fn">any</span>())</code></pre></div>
<p class="l-text">Çıktı temiz bir <code>raw</code> DataFrame'e gider; alt aşamalar şemanın geçerli olduğunu varsayar.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Aşama 2 — Özellik Mühendisliği</h2>
<p class="l-text">Üç aile: <em>gecikme özellikleri</em> (t-1, t-7, t-30'da Close), <em>hareketli istatistikler</em> (7 günlük ortalama, 30 günlük std), <em>takvim</em> (haftanın günü, ay). Hepsi yalnızca geçmiş değerleri kullanarak sızıntısız hesaplandı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

df = df_stocks.<span class="fn">copy</span>()
df[<span class="str">"Date"</span>] = pd.<span class="fn">to_datetime</span>(df[<span class="str">"Date"</span>])
df = df.<span class="fn">sort_values</span>(<span class="str">"Date"</span>).<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)

<span class="kw">for</span> lag <span class="kw">in</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">20</span>]:
    df[<span class="fn">f</span><span class="str">"close_lag_{lag}"</span>] = df[<span class="str">"Close"</span>].<span class="fn">shift</span>(lag)
df[<span class="str">"ma_7"</span>]   = df[<span class="str">"Close"</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">7</span>).<span class="fn">mean</span>()
df[<span class="str">"std_7"</span>]  = df[<span class="str">"Close"</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">7</span>).<span class="fn">std</span>()
df[<span class="str">"ret_1"</span>]  = df[<span class="str">"Close"</span>].<span class="fn">pct_change</span>().<span class="fn">shift</span>(<span class="num">1</span>)
df[<span class="str">"vol_ma"</span>] = df[<span class="str">"Volume"</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">7</span>).<span class="fn">mean</span>()
df[<span class="str">"dow"</span>]    = df[<span class="str">"Date"</span>].dt.dayofweek
df[<span class="str">"month"</span>]  = df[<span class="str">"Date"</span>].dt.month

feat_cols = [c <span class="kw">for</span> c <span class="kw">in</span> df.columns
             <span class="kw">if</span> c <span class="kw">not</span> <span class="kw">in</span> {<span class="str">"Date"</span>, <span class="str">"Open"</span>, <span class="str">"High"</span>, <span class="str">"Low"</span>, <span class="str">"Close"</span>, <span class="str">"Volume"</span>}]
df = df.<span class="fn">dropna</span>().<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
<span class="fn">print</span>(<span class="str">"features:"</span>, feat_cols)
<span class="fn">print</span>(<span class="str">"shape after dropna:"</span>, df.shape)</code></pre></div>
<p class="l-text">Her hareketli istatistikte <code>shift(1)</code>'e dikkat edin — onsuz yarının ortalaması yarının değerini sızdırır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Aşama 3 — Kayan-Orijin Geriye Dönük Test</h2>
<p class="l-text">Rastgele K-katlama geleceği sızdırır. Kayan-orijin eğitimi her zaman testten önce tutar, kesimi ileri kaydırır. 30 günlük test penceresi ile beş katlama, beş ay üretimi simüle eder.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Genişleyen pencere</div><div class="card-body">[0, t]'de eğit, (t, t+H]'de test. Eğitim her katlamada büyür.</div></div>
<div class="calc-card"><div class="card-title">Kayan pencere</div><div class="card-body">[t-W, t]'de eğit. Sabit eğitim boyutu — sürüklenmeye dayanıklı.</div></div>
<div class="calc-card"><div class="card-title">Boşluk</div><div class="card-body">Özellikler hareketli pencereler kullanıyorsa eğitim ve test arasına bir tampon yerleştir.</div></div>
<div class="calc-card"><div class="card-title">Birleştir</div><div class="card-body">Katmanlar arasında metrikleri ortala — tek sayı kırılgandır.</div></div>
</div>
<div class="calc-highlight">Katlama-katlama kazanan ama ortalamada kaybeden bir model aşırı uyum yapıyor; ortalamada kazanan ama beşten üçünde kaybeden bir model kırılgan. Daima her ikisine de bakın.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Aşama 4 — Üç Model</h2>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Üç modeli — AR(5), gecikme özelliklerinde GradientBoosting, STL trend ekstrapolasyonu — df_stocks'un %80'i üzerinde eğit ve ayrılan %20'de 1-adım MAE'yi rapor et.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression, Ridge
<span class="kw">from</span> sklearn.ensemble    <span class="kw">import</span> GradientBoostingRegressor
<span class="kw">from</span> scipy.signal        <span class="kw">import</span> savgol_filter

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)

<span class="cm"># gecikme matrisi</span>
lags = <span class="num">5</span>
X = np.<span class="fn">stack</span>([close[i:i+lags] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(close)-lags-<span class="num">1</span>)])
y = close[lags+<span class="num">1</span>:]
cut = <span class="fn">int</span>(<span class="fn">len</span>(X) * <span class="num">0.8</span>)

ar  = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X[:cut], y[:cut])
gbm = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">120</span>, max_depth=<span class="num">3</span>,
                                random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[:cut], y[:cut])

<span class="cm"># Eğitim kuyruğunda Savitzky-Golay trendi ile STL; düz ekstrapole et</span>
trend = <span class="fn">savgol_filter</span>(close[:cut+lags+<span class="num">1</span>], window_length=<span class="num">31</span>, polyorder=<span class="num">2</span>)
slope = (trend[-<span class="num">1</span>] - trend[-<span class="num">11</span>]) / <span class="num">10</span>
stl_pred = trend[-<span class="num">1</span>] + slope * np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="fn">len</span>(y[cut:]) + <span class="num">1</span>)

p_ar  = ar.<span class="fn">predict</span>(X[cut:])
p_gbm = gbm.<span class="fn">predict</span>(X[cut:])
truth = y[cut:]
<span class="kw">for</span> name, p <span class="kw">in</span> [(<span class="str">"AR"</span>, p_ar), (<span class="str">"GBM"</span>, p_gbm), (<span class="str">"STL"</span>, stl_pred)]:
    mae = np.<span class="fn">abs</span>(p - truth).<span class="fn">mean</span>()
    <span class="fn">print</span>(<span class="fn">f</span><span class="str">"{name:5s} MAE: {mae:.3f}"</span>)</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Aşama 5 — Topluluk Ağırlıkları</h2>
<p class="l-text">Ağırlıklar eğitimden değil, doğrulamadan gelir. Ayrılmış bir katmanda kısıtlı en küçük karelerle (veya 3-simpleks üzerinde grid arama ile) <span class="katex-block">$$\\min_{w \\geq 0,\\ \\sum w = 1} \\| Pw - y \\|^2$$</span> çöz.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bir doğrulama katmanında topluluk ağırlıklarını grid arama ile bul ve en iyi konveks kombinasyonu ile MAE'sini rapor et — ve en iyi bireysel modele karşı karşılaştır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression
<span class="kw">from</span> sklearn.ensemble    <span class="kw">import</span> GradientBoostingRegressor
<span class="kw">from</span> scipy.signal        <span class="kw">import</span> savgol_filter

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
lags  = <span class="num">5</span>
X = np.<span class="fn">stack</span>([close[i:i+lags] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(close)-lags-<span class="num">1</span>)])
y = close[lags+<span class="num">1</span>:]
n = <span class="fn">len</span>(X)
i_tr, i_va = <span class="fn">int</span>(n*<span class="num">0.6</span>), <span class="fn">int</span>(n*<span class="num">0.8</span>)

ar  = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X[:i_tr], y[:i_tr])
gbm = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[:i_tr], y[:i_tr])
trend = <span class="fn">savgol_filter</span>(close[:i_tr+lags+<span class="num">1</span>], <span class="num">31</span>, <span class="num">2</span>)
slope = (trend[-<span class="num">1</span>] - trend[-<span class="num">11</span>]) / <span class="num">10</span>

<span class="kw">def</span> <span class="fn">stl_predict</span>(<span class="fn">range_n</span>):
    <span class="kw">return</span> trend[-<span class="num">1</span>] + slope * np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="fn">range_n</span> + <span class="num">1</span>)

<span class="cm"># doğrulamada tahminler</span>
p1 = ar.<span class="fn">predict</span>(X[i_tr:i_va])
p2 = gbm.<span class="fn">predict</span>(X[i_tr:i_va])
p3 = <span class="fn">stl_predict</span>(i_va - i_tr)
yv = y[i_tr:i_va]

best = (<span class="num">1e9</span>, <span class="kw">None</span>)
<span class="kw">for</span> w1 <span class="kw">in</span> np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, <span class="num">11</span>):
    <span class="kw">for</span> w2 <span class="kw">in</span> np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span> - w1, <span class="num">11</span>):
        w3 = <span class="num">1</span> - w1 - w2
        ens = w1*p1 + w2*p2 + w3*p3
        mae = np.<span class="fn">abs</span>(ens - yv).<span class="fn">mean</span>()
        <span class="kw">if</span> mae &lt; best[<span class="num">0</span>]:
            best = (mae, (w1, w2, w3))

<span class="fn">print</span>(<span class="fn">f</span><span class="str">"best weights (AR,GBM,STL): {best[1]}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"validation MAE ensemble:   {best[0]:.3f}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"validation MAE AR alone:   {np.abs(p1 - yv).mean():.3f}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"validation MAE GBM alone:  {np.abs(p2 - yv).mean():.3f}"</span>)</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Aşama 6 — Toplulukta Konformal Aralıklar</h2>
<p class="l-text">Topluluğu tek bir kara kutu olarak ele alın. Taze bir kalibrasyon katmanında artıkları hesaplayın ve (1 - alfa) kuantilini yarıçap olarak alın. Test zamanı aralık = topluluk_tahmin ± q.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
lags = <span class="num">5</span>; alpha = <span class="num">0.1</span>
X = np.<span class="fn">stack</span>([close[i:i+lags] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(close)-lags-<span class="num">1</span>)])
y = close[lags+<span class="num">1</span>:]
n = <span class="fn">len</span>(X)
i_tr, i_cal = <span class="fn">int</span>(n*<span class="num">0.6</span>), <span class="fn">int</span>(n*<span class="num">0.8</span>)
mdl = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X[:i_tr], y[:i_tr])

cal_resid = np.<span class="fn">abs</span>(y[i_tr:i_cal] - mdl.<span class="fn">predict</span>(X[i_tr:i_cal]))
n_cal = <span class="fn">len</span>(cal_resid)
q = np.<span class="fn">quantile</span>(cal_resid, <span class="fn">min</span>(np.<span class="fn">ceil</span>((n_cal+<span class="num">1</span>)*(<span class="num">1</span>-alpha))/n_cal, <span class="num">1.0</span>))

mu = mdl.<span class="fn">predict</span>(X[i_cal:])
lo, hi = mu - q, mu + q
yt = y[i_cal:]
cov = ((yt &gt;= lo) &amp; (yt &lt;= hi)).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"target {1-alpha:.0%}  empirical {cov:.0%}  width {2*q:.2f}"</span>)</code></pre></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Aşama 7 — Değerlendirme Metrikleri</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MAE</div><div class="card-body">Mean Absolute Error. Hedefle aynı birim.</div></div>
<div class="calc-card"><div class="card-title">sMAPE</div><div class="card-body">Simetrik yüzde. Ölçeksiz, seriler arasında adil.</div></div>
<div class="calc-card"><div class="card-title">MASE</div><div class="card-body">Naif-mevsimsel MAE'ye bölünmüş MAE. &lt;1, önemsiz referansı yendiğin anlamına gelir.</div></div>
<div class="calc-card"><div class="card-title">Kapsama</div><div class="card-body">P(y aralıkta). 1 - alfa'ya eşit olmalı.</div></div>
<div class="calc-card"><div class="card-title">Genişlik</div><div class="card-body">Ortalama aralık genişliği. Daha düşük daha keskindir.</div></div>
<div class="calc-card"><div class="card-title">CRPS</div><div class="card-body">Dağılım-farkında MAE genelleştirmesi.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">smape</span>(y, p):
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">mean</span>(<span class="num">2</span> * np.<span class="fn">abs</span>(p - y) / (np.<span class="fn">abs</span>(p) + np.<span class="fn">abs</span>(y) + <span class="num">1e-9</span>)))

<span class="kw">def</span> <span class="fn">mase</span>(y, p, season=<span class="num">5</span>):
    naive = np.<span class="fn">abs</span>(np.<span class="fn">diff</span>(y, n=season)).<span class="fn">mean</span>() + <span class="num">1e-9</span>
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">abs</span>(p - y).<span class="fn">mean</span>() / naive)

y = df_stocks[<span class="str">"Close"</span>].values[-<span class="num">30</span>:]
p = y * <span class="num">1.01</span> + np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.5</span>, <span class="fn">len</span>(y))
<span class="fn">print</span>(<span class="str">"sMAPE:"</span>, <span class="fn">round</span>(<span class="fn">smape</span>(y, p), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"MASE :"</span>, <span class="fn">round</span>(<span class="fn">mase</span>(y, p), <span class="num">3</span>))</code></pre></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Aşama 8 — Üretimde İzleme</h2>
<p class="l-text">Bir kez dağıtıldığında model sessizce bozulur. Üç izleyici düşüşü yakalar:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hareketli MAE</div><div class="card-body">Son 30 günlük gerçeklerde MAE hesapla. Eğitim MAE'sinin 1.5 katını aşarsa uyar.</div></div>
<div class="calc-card"><div class="card-title">Kapsama sürüklenmesi</div><div class="card-body">Bir ay boyunca %90 aralıklarının ampirik kapsaması 0.80'in altına düşerse, dünya kaymıştır.</div></div>
<div class="calc-card"><div class="card-title">Özellik sürüklenmesi</div><div class="card-body">Her giriş özelliğinde eğitim dağılımına karşı PSI / KS testi. Veri hattı regresyonlarını yakalar.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.stats <span class="kw">import</span> ks_2samp

ref = df_stocks[<span class="str">"Close"</span>].values[:<span class="num">200</span>]
new = df_stocks[<span class="str">"Close"</span>].values[<span class="num">200</span>:]
stat, p = <span class="fn">ks_2samp</span>(ref, new)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"KS stat={stat:.3f}  p-value={p:.4f}"</span>)
<span class="fn">print</span>(<span class="str">"alert"</span> <span class="kw">if</span> p &lt; <span class="num">0.01</span> <span class="kw">else</span> <span class="str">"stable"</span>)</code></pre></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Aşama 8 (devam) — Yeniden Eğitim Kadansı</h2>
<p class="l-text">Üç yeniden eğitim tetikleyicisi, artan maliyetle:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Zaman tabanlı</div><div class="card-body">Her Pazar 02:00 UTC. Öngörülebilir, bütçelemesi kolay.</div></div>
<div class="calc-card"><div class="card-title">Hata tabanlı</div><div class="card-body">Hareketli MAE temel çizginin 1.5 katını ihlal ettiğinde. Tepkisel, hızlı.</div></div>
<div class="calc-card"><div class="card-title">Sürüklenme tabanlı</div><div class="card-body">Herhangi bir anahtar özellikte PSI &gt; 0.25 olduğunda. Sessiz kaymaları yakalar.</div></div>
<div class="calc-card"><div class="card-title">Manuel</div><div class="card-body">Daima bir kapatma anahtarı ve manuel yeniden eğitim uç noktası tut.</div></div>
</div>
<div class="calc-highlight">Yeniden eğitim risklidir — her uydurma iyileştirebileceği kadar bozabilir. Daima yeni modeli bir döngü için gölgeleyin, mevcuda karşı karşılaştırın, sonra terfi ettirin.</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Hepsini Bir Araya Getir — Bir Geriye Dönük Test</h2>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tam kayan-orijin geriye dönük test: her biri 30 günlük 4 katlama, topluluk + konformal aralık, katlama-katlama MAE, sMAPE, kapsama ve genişliği yazdırır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression
<span class="kw">from</span> sklearn.ensemble    <span class="kw">import</span> GradientBoostingRegressor

close = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
lags  = <span class="num">5</span>
X = np.<span class="fn">stack</span>([close[i:i+lags] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(close)-lags-<span class="num">1</span>)])
y = close[lags+<span class="num">1</span>:]

n_total = <span class="fn">len</span>(X); H = <span class="num">30</span>; n_folds = <span class="num">4</span>
start = n_total - n_folds * H; alpha = <span class="num">0.1</span>

results = []
<span class="kw">for</span> f <span class="kw">in</span> <span class="fn">range</span>(n_folds):
    tr_end = start + f * H
    te_end = tr_end + H
    Xtr, ytr = X[:tr_end], y[:tr_end]
    Xte, yte = X[tr_end:te_end], y[tr_end:te_end]
    cal_split = <span class="fn">int</span>(<span class="fn">len</span>(Xtr) * <span class="num">0.85</span>)

    ar  = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(Xtr[:cal_split], ytr[:cal_split])
    gbm = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">80</span>, max_depth=<span class="num">3</span>,
                                    random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xtr[:cal_split], ytr[:cal_split])
    p_ar  = ar.<span class="fn">predict</span>(Xte)
    p_gbm = gbm.<span class="fn">predict</span>(Xte)
    ens   = <span class="num">0.5</span> * p_ar + <span class="num">0.5</span> * p_gbm

    cal_res = np.<span class="fn">abs</span>(ytr[cal_split:] - <span class="num">0.5</span>*ar.<span class="fn">predict</span>(Xtr[cal_split:])
                                          - <span class="num">0.5</span>*gbm.<span class="fn">predict</span>(Xtr[cal_split:]))
    q = np.<span class="fn">quantile</span>(cal_res, <span class="num">1</span> - alpha)
    lo, hi = ens - q, ens + q
    cov = ((yte &gt;= lo) &amp; (yte &lt;= hi)).<span class="fn">mean</span>()
    mae = np.<span class="fn">abs</span>(ens - yte).<span class="fn">mean</span>()
    smp = (<span class="num">2</span>*np.<span class="fn">abs</span>(ens - yte) / (np.<span class="fn">abs</span>(ens)+np.<span class="fn">abs</span>(yte)+<span class="num">1e-9</span>)).<span class="fn">mean</span>()
    results.<span class="fn">append</span>((f+<span class="num">1</span>, mae, smp, cov, <span class="num">2</span>*q))

<span class="fn">print</span>(<span class="str">"fold | MAE   sMAPE  cov   width"</span>)
<span class="kw">for</span> f, mae, smp, cov, w <span class="kw">in</span> results:
    <span class="fn">print</span>(<span class="fn">f</span><span class="str">"  {f}  | {mae:5.2f}  {smp:.3f}  {cov:.2f}  {w:5.2f}"</span>)
mean_mae = np.<span class="fn">mean</span>([r[<span class="num">1</span>] <span class="kw">for</span> r <span class="kw">in</span> results])
mean_cov = np.<span class="fn">mean</span>([r[<span class="num">3</span>] <span class="kw">for</span> r <span class="kw">in</span> results])
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"avg  | MAE={mean_mae:.2f}  cov={mean_cov:.2f}"</span>)</code></pre></div>
</div>
<p class="l-text">Bunu her gece çalıştırın ve çalışan bir geriye dönük test koşumunuz olur. Topluluğu genişleterek yeni modeller ekleyin; geri kalan yerinde durur.</p>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Üretim Hattındaki Foundation Modeller</h2>
<p class="l-text"><strong>2024 foundation-model dalgası bu hattı nasıl mimarlayacağınızı değiştirir.</strong> Geleneksel akış — alım → özellik mühendisliği → seri başına ARIMA / GBM / N-BEATS eğit → geriye dönük test → sun — hâlâ çalışıyor. Ama soğuk başlangıç serileri ve zero-shot referanslar için TimesFM veya Chronos gibi önceden eğitilmiş bir tahminci uydurma-yok bir model olarak takılır ve &lt; 200 gözlemli serilerde sıklıkla XGBoost'unuzu yener. Aşağıdaki kartlar, hattı planlarken bilmeniz gereken altı önceden eğitilmiş modeldir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">TimesFM (Google, Şub 2024)</div><div class="card-body">200M yalnızca-decoder, 100B zaman noktası üzerinde önceden eğitildi. Tek değişkenli veya çok değişkenli için tak-çalıştır zero-shot. HuggingFace açık ağırlıkları — bir forecast() mikroservisi olarak sevk edin.</div></div>
<div class="calc-card"><div class="card-title">Lag-Llama (ServiceNow, Şub 2024)</div><div class="card-body">200M olasılıksal tahminci, student-t çıktılar. Yalnızca gecikme girdisi özellik hattında radikal basitlik anlamına gelir — takvim birleştirmesi yok. Harika soğuk başlangıç referansı.</div></div>
<div class="calc-card"><div class="card-title">Time-MoE (Eki 2024)</div><div class="card-body">Seyrek aktivasyonla 2.4B parametreye kadar uzman karışımı. Uzun bağlam mevcutsa en üst seviye doğruluk; MoE yönlendirmesi sayesinde tahmin başına maliyet hâlâ mütevazı.</div></div>
<div class="calc-card"><div class="card-title">MOIRAI v2 (Salesforce, 2024)</div><div class="card-body">Evrensel tahminci — tek model herhangi bir frekansı ve değişken sayısını işler. Üç boyutta açık ağırlıklar. Saatlik + günlük + haftalık serilerine yayılan envanter / talep hatları için mükemmel.</div></div>
<div class="calc-card"><div class="card-title">Chronos-T5 (Amazon, Mar 2024)</div><div class="card-body">T5 omurgasında tokenize-sayısal hilesi. Beş boyut 8M–710M. Zaten bir transformers / vLLM sunum yığınınız varsa ve minimal yeni altyapı istediğinizde yararlı.</div></div>
<div class="calc-card"><div class="card-title">TimeGPT-1 (Nixtla)</div><div class="card-body">Kapalı-API, hızlı, kalibre edilmiş. Ticari bir yedek olarak veya açık-ağırlık yığınınıza karşı CI'da sağduyu kontrolü olarak kullanın.</div></div>
</div>
<div class="calc-highlight"><strong>Hat entegrasyonu:</strong> GBM/AR/ETS modellerinizin yanında dördüncü bir topluluk üyesi olarak "zero-shot foundation" modeli ekleyin. &lt; 200 gözlemli seriler veya yeni SKU'lar için en yüksek ağırlığı verin. Yeniden eğitim kadansı uygulanmaz (seri başına uydurma yok) — yalnızca topluluk birleştiricisi gecelik yenileme gerektirir. L7'nin konformal aralıkları, foundation modelin nokta tahminlerinin etrafına temiz bir şekilde sarılır.</div>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Sonraki Yön</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ölçek büyüt</div><div class="card-body">≥ 100 serin olduğunda GBM'yi PatchTST veya N-HITS ile değiştir.</div></div>
<div class="calc-card"><div class="card-title">Temel modeller</div><div class="card-body">Sıfır-atış referans olarak Chronos / TimeGPT dene.</div></div>
<div class="calc-card"><div class="card-title">Hiyerarşiler</div><div class="card-body">Ürün / bölge hiyerarşileri arasında uzlaştırma (HierarchicalForecast).</div></div>
<div class="calc-card"><div class="card-title">Nedensel özellikler</div><div class="card-body">Promosyonlar, tatiller, hava durumu. Genellikle daha süslü modellerden daha fazla artış.</div></div>
<div class="calc-card"><div class="card-title">Çevrim içi öğrenme</div><div class="card-body">Gece yeniden eğitim yerine River tarzı artımsal güncellemeler.</div></div>
<div class="calc-card"><div class="card-title">Dağıt</div><div class="card-body">FastAPI + Docker + cron yeniden eğitim. MLOps track'ine bakın.</div></div>
</div>
<div class="calc-highlight">Artık tam tahmincilik araç kutunuza sahipsiniz — istatistiksel, ML, derin, olasılıksal, artı üretim iskeleti. Zor problem nadiren modeldir; etrafındaki hattır.</div>
</div>
`
};
