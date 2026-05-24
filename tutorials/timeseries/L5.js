window.TIMESERIES_L5 = {
en: `<p class="l-text"><strong>This is where modern production forecasting lives.</strong> Take the feature matrix from L4, drop it into LightGBM or XGBoost, validate with TimeSeriesSplit and walk-forward, and you have a system that scales to thousands of series, handles exogenous variables natively, and routinely beats Prophet and ARIMA. Every Kaggle M5/M6 winner used this exact recipe. So do Uber, Walmart, and most retail giants.</p>
<p class="l-text">In this lesson we wire the L4 features to a gradient-boosted regressor, run a proper rolling-origin cross-validation, build a recursive multi-step forecaster, and benchmark the result against the L1 naive baseline. We also touch the <code>mlforecast</code> library that automates all of this for many series at once. By the end you'll have a complete ML forecasting pipeline you can lift into production.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>LightGBM / XGBoost / sklearn GBR on lag-feature DataFrames</li><li>TimeSeriesSplit and walk-forward (rolling-origin) CV</li><li>Recursive vs direct multi-step forecasting strategies</li><li>The <code>mlforecast</code> library for many-series at once</li><li>Quantile regression for prediction intervals</li><li>Benchmarking against naive / ARIMA / Prophet baselines</li><li>Feature importance for time series and what to do with it</li></ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. The Pipeline at a Glance</h2>
<ol style="line-height:1.8"><li><strong>Build features</strong> with L4's <code>make_features</code> → DataFrame X with lags, rolling, calendar, Fourier</li><li><strong>Chronological split</strong> into train / valid / test — no random shuffle, ever</li><li><strong>Fit a gradient-boosted regressor</strong> on (X_train, y_train)</li><li><strong>Validate</strong> with TimeSeriesSplit or walk-forward — measure MAE per horizon</li><li><strong>Forecast multi-step</strong> recursively or directly</li><li><strong>Benchmark</strong> against naive / seasonal naive — compute MASE</li></ol>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">If your fancy GBM doesn't beat seasonal-naive on MASE, you have a bug or your features are leaky. This is THE most common failure mode of Kaggle beginners.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Building the Feature Matrix (Recap from L4)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="kw">def</span> <span class="fn">make_features</span>(dates, y, lags=(<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">5</span>,<span class="num">10</span>,<span class="num">21</span>), wins=(<span class="num">3</span>,<span class="num">7</span>,<span class="num">14</span>,<span class="num">30</span>)):
    df = pd.<span class="fn">DataFrame</span>({<span class="str">'y'</span>: np.<span class="fn">asarray</span>(y)}, index=pd.<span class="fn">to_datetime</span>(dates))
    <span class="kw">for</span> lag <span class="kw">in</span> lags:
        df[f<span class="str">'lag_{lag}'</span>] = df[<span class="str">'y'</span>].<span class="fn">shift</span>(lag)
    y_past = df[<span class="str">'y'</span>].<span class="fn">shift</span>(<span class="num">1</span>)
    <span class="kw">for</span> w <span class="kw">in</span> wins:
        df[f<span class="str">'mean_{w}'</span>] = y_past.<span class="fn">rolling</span>(w).<span class="fn">mean</span>()
        df[f<span class="str">'std_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">std</span>()
    idx = df.index
    df[<span class="str">'dow'</span>]   = idx.dayofweek
    df[<span class="str">'month'</span>] = idx.month
    df[<span class="str">'dow_sin'</span>] = np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*df[<span class="str">'dow'</span>]/<span class="num">7</span>)
    df[<span class="str">'dow_cos'</span>] = np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*df[<span class="str">'dow'</span>]/<span class="num">7</span>)
    <span class="kw">return</span> df

feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
<span class="fn">print</span>(<span class="str">'Feature matrix:'</span>, feat.shape)
<span class="fn">print</span>(<span class="str">'Columns:'</span>, feat.columns.<span class="fn">tolist</span>())
</code></pre></div>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. First Model — Sklearn GradientBoostingRegressor</h2>
<p class="l-text">LightGBM and XGBoost are blocked in Pyodide, so we use sklearn's <code>GradientBoostingRegressor</code> — same algorithm family, slower but identical interface. Production code reads identically.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

<span class="cm"># Feature matrix</span>
feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
y = feat[<span class="str">'y'</span>].values
X = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>]).values
feature_names = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>]).columns.<span class="fn">tolist</span>()

<span class="cm"># Chronological split — last 30 days as test</span>
split = <span class="fn">len</span>(feat) - <span class="num">30</span>
X_tr, X_te = X[:split], X[split:]
y_tr, y_te = y[:split], y[split:]

<span class="cm"># Fit</span>
gbr = <span class="fn">GradientBoostingRegressor</span>(
    n_estimators=<span class="num">200</span>, max_depth=<span class="num">4</span>,
    learning_rate=<span class="num">0.05</span>, subsample=<span class="num">0.8</span>,
    random_state=<span class="num">42</span>
).<span class="fn">fit</span>(X_tr, y_tr)

pred = gbr.<span class="fn">predict</span>(X_te)
mae  = <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y_te - pred)))
rmse = <span class="fn">float</span>(np.<span class="fn">sqrt</span>(np.<span class="fn">mean</span>((y_te - pred)**<span class="num">2</span>)))
<span class="fn">print</span>(f<span class="str">'GBR test MAE: {mae:.3f}   RMSE: {rmse:.3f}'</span>)

<span class="cm"># Naive baseline for comparison</span>
naive = np.<span class="fn">full</span>(<span class="fn">len</span>(y_te), y_tr[-<span class="num">1</span>])
naive_mae = <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y_te - naive)))
<span class="fn">print</span>(f<span class="str">'Naive  test MAE: {naive_mae:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'MASE: {mae / naive_mae:.3f}  ({<span class="str">"GOOD"</span> if mae < naive_mae else <span class="str">"BEAT BY NAIVE"</span>})'</span>)
</code></pre></div>
<p class="l-text">If MASE &lt; 1, the GBM is doing real work. If MASE &gt;= 1, your features aren't carrying signal — go back to L4 and add lag_7, rolling_std, or exogenous variables.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. TimeSeriesSplit — The Right Cross-Validation</h2>
<p class="l-text">Standard <code>KFold</code> would shuffle and leak the future into training folds. <code>TimeSeriesSplit</code> uses expanding windows: each fold trains on everything before its test slice.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> TimeSeriesSplit
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
y = feat[<span class="str">'y'</span>].values
X = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>]).values

tscv = <span class="fn">TimeSeriesSplit</span>(n_splits=<span class="num">5</span>, test_size=<span class="num">20</span>)
fold_mae = []
<span class="kw">for</span> fold, (tr_idx, te_idx) <span class="kw">in</span> <span class="fn">enumerate</span>(tscv.<span class="fn">split</span>(X), <span class="num">1</span>):
    model = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">150</span>, max_depth=<span class="num">3</span>,
                                       learning_rate=<span class="num">0.05</span>).<span class="fn">fit</span>(X[tr_idx], y[tr_idx])
    pred = model.<span class="fn">predict</span>(X[te_idx])
    mae = <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y[te_idx] - pred)))
    fold_mae.<span class="fn">append</span>(mae)
    <span class="fn">print</span>(f<span class="str">'Fold {fold}: train n={len(tr_idx):3d}  test n={len(te_idx)}  MAE={mae:.3f}'</span>)

<span class="fn">print</span>(f<span class="str">'\\nMean CV MAE: {np.mean(fold_mae):.3f}  std: {np.std(fold_mae):.3f}'</span>)
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">If your CV MAE bounces wildly between folds (std/mean &gt; 0.3), the model is unstable. Add regularization, drop low-importance features, or smooth the target.</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Walk-Forward (Rolling-Origin) Validation</h2>
<p class="l-text">The gold standard. At each step: fit on everything before time t, predict t+1..t+h, advance t by 1, refit. Mimics live deployment exactly.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
y = feat[<span class="str">'y'</span>].values
X = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>]).values

<span class="cm"># Rolling-origin: refit every step, forecast 1 step</span>
start = <span class="fn">len</span>(feat) - <span class="num">30</span>   <span class="cm"># last 30 days as walk-forward window</span>
horizon_errors = []

<span class="kw">for</span> cut <span class="kw">in</span> <span class="fn">range</span>(start, <span class="fn">len</span>(feat)):
    model = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">100</span>, max_depth=<span class="num">3</span>,
                                       learning_rate=<span class="num">0.05</span>).<span class="fn">fit</span>(X[:cut], y[:cut])
    pred = model.<span class="fn">predict</span>(X[cut:cut+<span class="num">1</span>])[<span class="num">0</span>]
    err = <span class="fn">abs</span>(y[cut] - pred)
    horizon_errors.<span class="fn">append</span>(err)

<span class="fn">print</span>(f<span class="str">'Walk-forward 1-step MAE: {np.mean(horizon_errors):.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'Worst day: {max(horizon_errors):.3f}   Best day: {min(horizon_errors):.3f}'</span>)
</code></pre></div>
<p class="l-text">Refitting at every step is expensive but gives the most honest number. In production with 1000s of series, refit weekly and accept the slight drift.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Multi-Step Forecasting — Recursive vs Direct</h2>
<p class="l-text">You usually need to forecast more than 1 step ahead. Two strategies:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Recursive</div><div class="card-body">Train one model on h=1. To forecast h=2, plug your h=1 prediction in as the lag-1 feature. Repeat. Simple but errors compound.</div></div>
<div class="calc-card"><div class="card-title">Direct</div><div class="card-body">Train H separate models — one per horizon. Each predicts h-step-ahead from the same lag features. No error compounding, more compute.</div></div>
<div class="calc-card"><div class="card-title">Hybrid (DirRec)</div><div class="card-body">Direct models that also see previous-horizon predictions as features. Best of both, harder to debug.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

<span class="cm"># RECURSIVE multi-step</span>
feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
y = feat[<span class="str">'y'</span>].values
X = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>])
feat_cols = X.columns.<span class="fn">tolist</span>()

split = <span class="fn">len</span>(feat) - <span class="num">10</span>  <span class="cm"># 10-day forecast</span>
model = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">150</span>, max_depth=<span class="num">3</span>,
                                   learning_rate=<span class="num">0.05</span>).<span class="fn">fit</span>(X.iloc[:split], y[:split])

<span class="cm"># Roll forward, plug predictions back into lag features</span>
history = <span class="fn">list</span>(y[:split])
predictions = []
last_row = X.iloc[split-<span class="num">1</span>].<span class="fn">to_dict</span>()

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
    <span class="cm"># Update lag columns from history</span>
    <span class="kw">if</span> <span class="str">'lag_1'</span> <span class="kw">in</span> last_row: last_row[<span class="str">'lag_1'</span>] = history[-<span class="num">1</span>]
    <span class="kw">if</span> <span class="str">'lag_2'</span> <span class="kw">in</span> last_row: last_row[<span class="str">'lag_2'</span>] = history[-<span class="num">2</span>]
    <span class="kw">if</span> <span class="str">'lag_3'</span> <span class="kw">in</span> last_row: last_row[<span class="str">'lag_3'</span>] = history[-<span class="num">3</span>]
    <span class="kw">if</span> <span class="str">'lag_5'</span> <span class="kw">in</span> last_row <span class="kw">and</span> <span class="fn">len</span>(history) >= <span class="num">5</span>: last_row[<span class="str">'lag_5'</span>] = history[-<span class="num">5</span>]
    <span class="cm"># Update rolling means (simple version)</span>
    <span class="kw">if</span> <span class="str">'mean_3'</span> <span class="kw">in</span> last_row: last_row[<span class="str">'mean_3'</span>] = np.<span class="fn">mean</span>(history[-<span class="num">3</span>:])
    <span class="kw">if</span> <span class="str">'mean_7'</span> <span class="kw">in</span> last_row: last_row[<span class="str">'mean_7'</span>] = np.<span class="fn">mean</span>(history[-<span class="num">7</span>:])

    x_step = pd.<span class="fn">DataFrame</span>([last_row])[feat_cols].values
    pred = <span class="fn">float</span>(model.<span class="fn">predict</span>(x_step)[<span class="num">0</span>])
    predictions.<span class="fn">append</span>(pred)
    history.<span class="fn">append</span>(pred)

actual = y[split:split+<span class="num">10</span>]
mae = np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(actual - np.<span class="fn">array</span>(predictions)))
<span class="fn">print</span>(f<span class="str">'Recursive 10-step MAE: {mae:.3f}'</span>)
<span class="fn">print</span>(<span class="str">'Forecasts:'</span>, np.<span class="fn">round</span>(predictions, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">'Actuals  :'</span>, np.<span class="fn">round</span>(actual, <span class="num">2</span>))
</code></pre></div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. mlforecast — Many Series at Once</h2>
<p class="l-text">In production you forecast 10000 SKUs across 50 stores = 500K series. <code>mlforecast</code> from Nixtla automates the L4 + L5 pipeline for that scale: builds features per series, fits one global model, forecasts all simultaneously.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> mlforecast <span class="kw">import</span> MLForecast
<span class="kw">from</span> mlforecast.lag_transforms <span class="kw">import</span> RollingMean, ExpandingMean
<span class="kw">import</span> lightgbm <span class="kw">as</span> lgb

<span class="cm"># df_long: long-format with columns [unique_id, ds, y]</span>
df_long = df_orders[[<span class="str">'product_id'</span>, <span class="str">'order_date'</span>, <span class="str">'amount'</span>]].<span class="fn">rename</span>(
    columns={<span class="str">'product_id'</span>: <span class="str">'unique_id'</span>, <span class="str">'order_date'</span>: <span class="str">'ds'</span>, <span class="str">'amount'</span>: <span class="str">'y'</span>})
df_long[<span class="str">'ds'</span>] = pd.<span class="fn">to_datetime</span>(df_long[<span class="str">'ds'</span>])

mlf = <span class="fn">MLForecast</span>(
    models=[lgb.<span class="fn">LGBMRegressor</span>(n_estimators=<span class="num">300</span>, learning_rate=<span class="num">0.05</span>)],
    freq=<span class="str">'D'</span>,
    lags=[<span class="num">1</span>, <span class="num">7</span>, <span class="num">14</span>, <span class="num">28</span>],
    lag_transforms={<span class="num">1</span>: [<span class="fn">RollingMean</span>(<span class="num">7</span>), <span class="fn">RollingMean</span>(<span class="num">28</span>)]},
    date_features=[<span class="str">'dayofweek'</span>, <span class="str">'month'</span>],
)
mlf.<span class="fn">fit</span>(df_long)
forecasts = mlf.<span class="fn">predict</span>(h=<span class="num">14</span>)
<span class="fn">print</span>(forecasts.<span class="fn">head</span>())
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Manual many-series global model on df_orders: build per-product lag features, fit one sklearn GBR for all products jointly.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

<span class="cm"># Aggregate orders to daily totals per product</span>
df = df_orders.<span class="fn">copy</span>()
df[<span class="str">'date'</span>] = pd.<span class="fn">to_datetime</span>(df[<span class="str">'order_date'</span>])
daily = df.<span class="fn">groupby</span>([<span class="str">'product_id'</span>, <span class="str">'date'</span>])[<span class="str">'amount'</span>].<span class="fn">sum</span>().<span class="fn">reset_index</span>()

<span class="cm"># Build lag features per product, stack into one big training set</span>
rows = []
<span class="kw">for</span> pid, g <span class="kw">in</span> daily.<span class="fn">groupby</span>(<span class="str">'product_id'</span>):
    g = g.<span class="fn">sort_values</span>(<span class="str">'date'</span>).<span class="fn">set_index</span>(<span class="str">'date'</span>)
    g[<span class="str">'lag_1'</span>] = g[<span class="str">'amount'</span>].<span class="fn">shift</span>(<span class="num">1</span>)
    g[<span class="str">'lag_7'</span>] = g[<span class="str">'amount'</span>].<span class="fn">shift</span>(<span class="num">7</span>)
    g[<span class="str">'mean_7'</span>] = g[<span class="str">'amount'</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">7</span>).<span class="fn">mean</span>()
    g[<span class="str">'dow'</span>] = g.index.dayofweek
    g[<span class="str">'product_id'</span>] = pid
    rows.<span class="fn">append</span>(g.<span class="fn">dropna</span>())

big = pd.<span class="fn">concat</span>(rows).<span class="fn">reset_index</span>()
<span class="fn">print</span>(f<span class="str">'Stacked rows: {len(big)}, products: {big.product_id.nunique()}'</span>)

<span class="cm"># Train ONE global model across all products</span>
y_all = big[<span class="str">'amount'</span>].values
X_all = big[[<span class="str">'lag_1'</span>, <span class="str">'lag_7'</span>, <span class="str">'mean_7'</span>, <span class="str">'dow'</span>, <span class="str">'product_id'</span>]].values

split = <span class="fn">int</span>(<span class="fn">len</span>(big) * <span class="num">0.8</span>)
model = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">100</span>, max_depth=<span class="num">4</span>).<span class="fn">fit</span>(X_all[:split], y_all[:split])
pred = model.<span class="fn">predict</span>(X_all[split:])
mae = <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y_all[split:] - pred)))
<span class="fn">print</span>(f<span class="str">'Global model MAE across all products: {mae:.3f}'</span>)
</code></pre></div></div>
<p class="l-text">A single model that has seen 500 products often beats 500 individual product models — the data sharing acts as regularization. This is the "global vs local" debate that dominated the M5 competition.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Prediction Intervals via Quantile Regression</h2>
<p class="l-text">Train two extra models targeting the 5th and 95th quantiles. Combine for a 90% PI.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
y = feat[<span class="str">'y'</span>].values
X = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>]).values

split = <span class="fn">len</span>(feat) - <span class="num">30</span>
y_tr, y_te = y[:split], y[split:]
X_tr, X_te = X[:split], X[split:]

<span class="cm"># Three models: median, low quantile, high quantile</span>
m_med = <span class="fn">GradientBoostingRegressor</span>(loss=<span class="str">'quantile'</span>, alpha=<span class="num">0.50</span>,
                                   n_estimators=<span class="num">150</span>, max_depth=<span class="num">3</span>).<span class="fn">fit</span>(X_tr, y_tr)
m_lo  = <span class="fn">GradientBoostingRegressor</span>(loss=<span class="str">'quantile'</span>, alpha=<span class="num">0.05</span>,
                                   n_estimators=<span class="num">150</span>, max_depth=<span class="num">3</span>).<span class="fn">fit</span>(X_tr, y_tr)
m_hi  = <span class="fn">GradientBoostingRegressor</span>(loss=<span class="str">'quantile'</span>, alpha=<span class="num">0.95</span>,
                                   n_estimators=<span class="num">150</span>, max_depth=<span class="num">3</span>).<span class="fn">fit</span>(X_tr, y_tr)

med = m_med.<span class="fn">predict</span>(X_te)
lo  = m_lo.<span class="fn">predict</span>(X_te)
hi  = m_hi.<span class="fn">predict</span>(X_te)

<span class="cm"># Coverage check</span>
covered = ((y_te >= lo) & (y_te <= hi)).<span class="fn">mean</span>()
width   = (hi - lo).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">'Empirical 90% coverage: {covered*100:.1f}%   target 90%'</span>)
<span class="fn">print</span>(f<span class="str">'Mean PI width: {width:.3f}'</span>)
</code></pre></div>
<p class="l-text">If coverage is far from 90%, your model is mis-calibrated — try conformal prediction (post-hoc width adjustment to hit nominal coverage).</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Feature Importance — What Actually Matters</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
y = feat[<span class="str">'y'</span>].values
X = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>])

model = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">200</span>, max_depth=<span class="num">3</span>,
                                   learning_rate=<span class="num">0.05</span>).<span class="fn">fit</span>(X.values, y)

imp = pd.<span class="fn">DataFrame</span>({
    <span class="str">'feature'</span>: X.columns,
    <span class="str">'importance'</span>: model.feature_importances_
}).<span class="fn">sort_values</span>(<span class="str">'importance'</span>, ascending=<span class="kw">False</span>)

<span class="fn">print</span>(<span class="str">'Top 10 features by importance:'</span>)
<span class="fn">print</span>(imp.<span class="fn">head</span>(<span class="num">10</span>).<span class="fn">to_string</span>(index=<span class="kw">False</span>))
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">In stock data, lag_1 dominates (random walk). In retail, lag_7 + day-of-week dominate. If your top feature is something weird (e.g. <code>std_30</code> alone), audit for leakage.</div>
</div>

<div class="lesson-block" id="section-10"><h2 class="lesson-title">10. Track Recap & Where to Go Next</h2>
<p class="l-text">Across L1-L5 you built the complete time-series stack:</p>
<ul style="line-height:1.7"><li><strong>L1</strong> — decomposition, stationarity, baselines, evaluation</li><li><strong>L2</strong> — ARIMA, SARIMA, Holt-Winters classical models</li><li><strong>L3</strong> — Prophet for messy business data, STL diagnostics</li><li><strong>L4</strong> — feature engineering: lags, rolling, calendar, Fourier, target encoding</li><li><strong>L5</strong> — ML models on those features, TimeSeriesSplit, walk-forward, multi-step, mlforecast, quantile PIs</li></ul>
<p class="l-text"><strong>What to study next:</strong></p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Deep learning</div><div class="card-body">N-BEATS, NHITS, TFT, PatchTST — Transformer/MLP models that win recent competitions on multivariate data with rich exogenous regressors.</div></div>
<div class="calc-card"><div class="card-title">Probabilistic forecasting</div><div class="card-body">DeepAR, Conformal Prediction, full distributional output — beyond single-quantile PIs.</div></div>
<div class="calc-card"><div class="card-title">Hierarchical reconciliation</div><div class="card-body">Forecast at SKU + store + region levels, then reconcile so they sum consistently. Library: <code>hierarchicalforecast</code>.</div></div>
<div class="calc-card"><div class="card-title">Anomaly detection</div><div class="card-body">Same feature pipeline, but the target is "is this an outlier?" — fraud, server health, IoT.</div></div>
</div>
<p class="l-text">You now have the foundations. The rest is repetition on real datasets.</p>
</div>`,
tr: `<p class="l-text"><strong>Modern üretim tahminciliğinin yaşadığı yer burasıdır.</strong> L4'ten gelen özellik matrisini al, LightGBM veya XGBoost'a bırak, TimeSeriesSplit ve ileri-yürüme ile doğrula ve binlerce seriye ölçeklenen, dışsal değişkenleri yerel olarak işleyen ve rutin olarak Prophet ve ARIMA'yı yenen bir sisteme sahip olursun. Her Kaggle M5/M6 galibi tam olarak bu tarifi kullandı. Uber, Walmart ve çoğu perakende devi de öyle.</p>
<p class="l-text">Bu derste L4 özelliklerini bir gradyan artırılmış regresöre bağlıyoruz, doğru bir kayan-orijin çapraz doğrulaması çalıştırıyoruz, özyinelemeli bir çok adımlı tahminci inşa ediyoruz ve sonucu L1 naif referansa karşı kıyaslıyoruz. Ayrıca aynı anda birçok seri için tüm bunları otomatikleştiren <code>mlforecast</code> kütüphanesine de değiniyoruz. Sonunda üretime kaldırabileceğiniz tam bir ML tahmin hattınız olacak.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Gecikme özellikli DataFrame'ler üzerinde LightGBM / XGBoost / sklearn GBR</li><li>TimeSeriesSplit ve ileri-yürüme (kayan-orijin) CV</li><li>Özyinelemeli vs doğrudan çok adımlı tahmin stratejileri</li><li>Aynı anda birçok seri için <code>mlforecast</code> kütüphanesi</li><li>Tahmin aralıkları için kuantil regresyonu</li><li>Naif / ARIMA / Prophet referanslarına karşı kıyaslama</li><li>Zaman serisi için özellik önemi ve onunla ne yapılacağı</li></ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Hat Bir Bakışta</h2>
<ol style="line-height:1.8"><li>L4'ün <code>make_features</code>'ı ile <strong>özellikler oluştur</strong> → gecikmeler, hareketli, takvim, Fourier'li DataFrame X</li><li>Eğitim / doğrulama / test'e <strong>kronolojik ayrım</strong> — asla rastgele karıştırma</li><li>(X_train, y_train) üzerinde <strong>gradyan artırılmış regresör uydur</strong></li><li>TimeSeriesSplit veya ileri-yürüme ile <strong>doğrula</strong> — ufuk başına MAE'yi ölç</li><li>Özyinelemeli veya doğrudan <strong>çok adımlı tahmin yap</strong></li><li>Naif / mevsimsel naife karşı <strong>kıyasla</strong> — MASE hesapla</li></ol>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Süslü GBM'iniz MASE'de mevsimsel-naifi yenmiyorsa, bir hatanız var ya da özellikleriniz sızıntılı. Bu, Kaggle yeni başlayanlarının EN yaygın başarısızlık moddur.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Özellik Matrisini Oluşturma (L4'ten Özet)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="kw">def</span> <span class="fn">make_features</span>(dates, y, lags=(<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">5</span>,<span class="num">10</span>,<span class="num">21</span>), wins=(<span class="num">3</span>,<span class="num">7</span>,<span class="num">14</span>,<span class="num">30</span>)):
    df = pd.<span class="fn">DataFrame</span>({<span class="str">'y'</span>: np.<span class="fn">asarray</span>(y)}, index=pd.<span class="fn">to_datetime</span>(dates))
    <span class="kw">for</span> lag <span class="kw">in</span> lags:
        df[f<span class="str">'lag_{lag}'</span>] = df[<span class="str">'y'</span>].<span class="fn">shift</span>(lag)
    y_past = df[<span class="str">'y'</span>].<span class="fn">shift</span>(<span class="num">1</span>)
    <span class="kw">for</span> w <span class="kw">in</span> wins:
        df[f<span class="str">'mean_{w}'</span>] = y_past.<span class="fn">rolling</span>(w).<span class="fn">mean</span>()
        df[f<span class="str">'std_{w}'</span>]  = y_past.<span class="fn">rolling</span>(w).<span class="fn">std</span>()
    idx = df.index
    df[<span class="str">'dow'</span>]   = idx.dayofweek
    df[<span class="str">'month'</span>] = idx.month
    df[<span class="str">'dow_sin'</span>] = np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*df[<span class="str">'dow'</span>]/<span class="num">7</span>)
    df[<span class="str">'dow_cos'</span>] = np.<span class="fn">cos</span>(<span class="num">2</span>*np.pi*df[<span class="str">'dow'</span>]/<span class="num">7</span>)
    <span class="kw">return</span> df

feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
<span class="fn">print</span>(<span class="str">'Feature matrix:'</span>, feat.shape)
<span class="fn">print</span>(<span class="str">'Columns:'</span>, feat.columns.<span class="fn">tolist</span>())
</code></pre></div>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. İlk Model — Sklearn GradientBoostingRegressor</h2>
<p class="l-text">LightGBM ve XGBoost Pyodide'de engellidir, bu yüzden sklearn'ün <code>GradientBoostingRegressor</code>'ını kullanıyoruz — aynı algoritma ailesi, daha yavaş ama özdeş arabirim. Üretim kodu aynı şekilde okunur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

<span class="cm"># Özellik matrisi</span>
feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
y = feat[<span class="str">'y'</span>].values
X = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>]).values
feature_names = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>]).columns.<span class="fn">tolist</span>()

<span class="cm"># Kronolojik ayrım — son 30 gün test olarak</span>
split = <span class="fn">len</span>(feat) - <span class="num">30</span>
X_tr, X_te = X[:split], X[split:]
y_tr, y_te = y[:split], y[split:]

<span class="cm"># Uydur</span>
gbr = <span class="fn">GradientBoostingRegressor</span>(
    n_estimators=<span class="num">200</span>, max_depth=<span class="num">4</span>,
    learning_rate=<span class="num">0.05</span>, subsample=<span class="num">0.8</span>,
    random_state=<span class="num">42</span>
).<span class="fn">fit</span>(X_tr, y_tr)

pred = gbr.<span class="fn">predict</span>(X_te)
mae  = <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y_te - pred)))
rmse = <span class="fn">float</span>(np.<span class="fn">sqrt</span>(np.<span class="fn">mean</span>((y_te - pred)**<span class="num">2</span>)))
<span class="fn">print</span>(f<span class="str">'GBR test MAE: {mae:.3f}   RMSE: {rmse:.3f}'</span>)

<span class="cm"># Karşılaştırma için naif referans</span>
naive = np.<span class="fn">full</span>(<span class="fn">len</span>(y_te), y_tr[-<span class="num">1</span>])
naive_mae = <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y_te - naive)))
<span class="fn">print</span>(f<span class="str">'Naive  test MAE: {naive_mae:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'MASE: {mae / naive_mae:.3f}  ({<span class="str">"GOOD"</span> if mae < naive_mae else <span class="str">"BEAT BY NAIVE"</span>})'</span>)
</code></pre></div>
<p class="l-text">MASE &lt; 1 ise, GBM gerçek iş yapıyor. MASE &gt;= 1 ise, özellikleriniz sinyal taşımıyor — L4'e geri dönün ve lag_7, rolling_std veya dışsal değişkenler ekleyin.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. TimeSeriesSplit — Doğru Çapraz Doğrulama</h2>
<p class="l-text">Standart <code>KFold</code> karıştırır ve geleceği eğitim katmanlarına sızdırır. <code>TimeSeriesSplit</code> genişleyen pencereler kullanır: her katman, test diliminden önceki her şey üzerinde eğitir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> TimeSeriesSplit
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
y = feat[<span class="str">'y'</span>].values
X = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>]).values

tscv = <span class="fn">TimeSeriesSplit</span>(n_splits=<span class="num">5</span>, test_size=<span class="num">20</span>)
fold_mae = []
<span class="kw">for</span> fold, (tr_idx, te_idx) <span class="kw">in</span> <span class="fn">enumerate</span>(tscv.<span class="fn">split</span>(X), <span class="num">1</span>):
    model = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">150</span>, max_depth=<span class="num">3</span>,
                                       learning_rate=<span class="num">0.05</span>).<span class="fn">fit</span>(X[tr_idx], y[tr_idx])
    pred = model.<span class="fn">predict</span>(X[te_idx])
    mae = <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y[te_idx] - pred)))
    fold_mae.<span class="fn">append</span>(mae)
    <span class="fn">print</span>(f<span class="str">'Fold {fold}: train n={len(tr_idx):3d}  test n={len(te_idx)}  MAE={mae:.3f}'</span>)

<span class="fn">print</span>(f<span class="str">'\\nMean CV MAE: {np.mean(fold_mae):.3f}  std: {np.std(fold_mae):.3f}'</span>)
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">CV MAE'niz katmanlar arasında çılgınca zıplıyorsa (std/ortalama &gt; 0.3), model kararsızdır. Düzenlileştirme ekleyin, düşük öneme sahip özellikleri düşürün veya hedefi düzgünleştirin.</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. İleri-Yürüme (Kayan-Orijin) Doğrulaması</h2>
<p class="l-text">Altın standart. Her adımda: t'den önceki her şey üzerinde uydur, t+1..t+h'yi tahmin et, t'yi 1 ileri al, yeniden uydur. Canlı dağıtımı tam olarak taklit eder.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
y = feat[<span class="str">'y'</span>].values
X = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>]).values

<span class="cm"># Kayan-orijin: her adımda yeniden uydur, 1 adım tahmin et</span>
start = <span class="fn">len</span>(feat) - <span class="num">30</span>   <span class="cm"># son 30 gün ileri-yürüme penceresi olarak</span>
horizon_errors = []

<span class="kw">for</span> cut <span class="kw">in</span> <span class="fn">range</span>(start, <span class="fn">len</span>(feat)):
    model = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">100</span>, max_depth=<span class="num">3</span>,
                                       learning_rate=<span class="num">0.05</span>).<span class="fn">fit</span>(X[:cut], y[:cut])
    pred = model.<span class="fn">predict</span>(X[cut:cut+<span class="num">1</span>])[<span class="num">0</span>]
    err = <span class="fn">abs</span>(y[cut] - pred)
    horizon_errors.<span class="fn">append</span>(err)

<span class="fn">print</span>(f<span class="str">'Walk-forward 1-step MAE: {np.mean(horizon_errors):.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'Worst day: {max(horizon_errors):.3f}   Best day: {min(horizon_errors):.3f}'</span>)
</code></pre></div>
<p class="l-text">Her adımda yeniden uydurma pahalıdır ama en dürüst sayıyı verir. 1000'lerce seri olan üretimde, haftalık yeniden uydurun ve hafif sürüklenmeyi kabul edin.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Çok Adımlı Tahmin — Özyinelemeli vs Doğrudan</h2>
<p class="l-text">Genellikle 1 adımdan fazla ileri tahmin etmeniz gerekir. İki strateji:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Özyinelemeli</div><div class="card-body">h=1 üzerinde bir model eğit. h=2'yi tahmin etmek için, h=1 tahmininizi gecikme-1 özelliği olarak takın. Tekrarlayın. Basit ama hatalar birikir.</div></div>
<div class="calc-card"><div class="card-title">Doğrudan</div><div class="card-body">H ayrı model eğit — her ufuk için bir tane. Her biri aynı gecikme özelliklerinden h-adım-ileri tahmin eder. Hata birikmesi yok, daha fazla hesaplama.</div></div>
<div class="calc-card"><div class="card-title">Hibrit (DirRec)</div><div class="card-body">Önceki ufuk tahminlerini de özellik olarak gören doğrudan modeller. İkisinin en iyisi, ayıklaması zor.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

<span class="cm"># ÖZYİNELEMELİ çok adımlı</span>
feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
y = feat[<span class="str">'y'</span>].values
X = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>])
feat_cols = X.columns.<span class="fn">tolist</span>()

split = <span class="fn">len</span>(feat) - <span class="num">10</span>  <span class="cm"># 10 günlük tahmin</span>
model = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">150</span>, max_depth=<span class="num">3</span>,
                                   learning_rate=<span class="num">0.05</span>).<span class="fn">fit</span>(X.iloc[:split], y[:split])

<span class="cm"># İleri yürü, tahminleri gecikme özelliklerine geri tak</span>
history = <span class="fn">list</span>(y[:split])
predictions = []
last_row = X.iloc[split-<span class="num">1</span>].<span class="fn">to_dict</span>()

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
    <span class="cm"># Gecikme sütunlarını tarihçeden güncelle</span>
    <span class="kw">if</span> <span class="str">'lag_1'</span> <span class="kw">in</span> last_row: last_row[<span class="str">'lag_1'</span>] = history[-<span class="num">1</span>]
    <span class="kw">if</span> <span class="str">'lag_2'</span> <span class="kw">in</span> last_row: last_row[<span class="str">'lag_2'</span>] = history[-<span class="num">2</span>]
    <span class="kw">if</span> <span class="str">'lag_3'</span> <span class="kw">in</span> last_row: last_row[<span class="str">'lag_3'</span>] = history[-<span class="num">3</span>]
    <span class="kw">if</span> <span class="str">'lag_5'</span> <span class="kw">in</span> last_row <span class="kw">and</span> <span class="fn">len</span>(history) >= <span class="num">5</span>: last_row[<span class="str">'lag_5'</span>] = history[-<span class="num">5</span>]
    <span class="cm"># Hareketli ortalamaları güncelle (basit sürüm)</span>
    <span class="kw">if</span> <span class="str">'mean_3'</span> <span class="kw">in</span> last_row: last_row[<span class="str">'mean_3'</span>] = np.<span class="fn">mean</span>(history[-<span class="num">3</span>:])
    <span class="kw">if</span> <span class="str">'mean_7'</span> <span class="kw">in</span> last_row: last_row[<span class="str">'mean_7'</span>] = np.<span class="fn">mean</span>(history[-<span class="num">7</span>:])

    x_step = pd.<span class="fn">DataFrame</span>([last_row])[feat_cols].values
    pred = <span class="fn">float</span>(model.<span class="fn">predict</span>(x_step)[<span class="num">0</span>])
    predictions.<span class="fn">append</span>(pred)
    history.<span class="fn">append</span>(pred)

actual = y[split:split+<span class="num">10</span>]
mae = np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(actual - np.<span class="fn">array</span>(predictions)))
<span class="fn">print</span>(f<span class="str">'Recursive 10-step MAE: {mae:.3f}'</span>)
<span class="fn">print</span>(<span class="str">'Forecasts:'</span>, np.<span class="fn">round</span>(predictions, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">'Actuals  :'</span>, np.<span class="fn">round</span>(actual, <span class="num">2</span>))
</code></pre></div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. mlforecast — Aynı Anda Birçok Seri</h2>
<p class="l-text">Üretimde 50 mağazada 10000 SKU = 500K seri tahmin edersiniz. Nixtla'dan <code>mlforecast</code>, L4 + L5 hattını bu ölçek için otomatikleştirir: seri başına özellikler oluşturur, bir global model uydurur, hepsini aynı anda tahmin eder.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> mlforecast <span class="kw">import</span> MLForecast
<span class="kw">from</span> mlforecast.lag_transforms <span class="kw">import</span> RollingMean, ExpandingMean
<span class="kw">import</span> lightgbm <span class="kw">as</span> lgb

<span class="cm"># df_long: [unique_id, ds, y] sütunlu uzun format</span>
df_long = df_orders[[<span class="str">'product_id'</span>, <span class="str">'order_date'</span>, <span class="str">'amount'</span>]].<span class="fn">rename</span>(
    columns={<span class="str">'product_id'</span>: <span class="str">'unique_id'</span>, <span class="str">'order_date'</span>: <span class="str">'ds'</span>, <span class="str">'amount'</span>: <span class="str">'y'</span>})
df_long[<span class="str">'ds'</span>] = pd.<span class="fn">to_datetime</span>(df_long[<span class="str">'ds'</span>])

mlf = <span class="fn">MLForecast</span>(
    models=[lgb.<span class="fn">LGBMRegressor</span>(n_estimators=<span class="num">300</span>, learning_rate=<span class="num">0.05</span>)],
    freq=<span class="str">'D'</span>,
    lags=[<span class="num">1</span>, <span class="num">7</span>, <span class="num">14</span>, <span class="num">28</span>],
    lag_transforms={<span class="num">1</span>: [<span class="fn">RollingMean</span>(<span class="num">7</span>), <span class="fn">RollingMean</span>(<span class="num">28</span>)]},
    date_features=[<span class="str">'dayofweek'</span>, <span class="str">'month'</span>],
)
mlf.<span class="fn">fit</span>(df_long)
forecasts = mlf.<span class="fn">predict</span>(h=<span class="num">14</span>)
<span class="fn">print</span>(forecasts.<span class="fn">head</span>())
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">df_orders üzerinde elle çoklu seri global modeli: ürün başına gecikme özellikleri oluştur, tüm ürünler için ortak bir sklearn GBR uydur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

<span class="cm"># Siparişleri ürün başına günlük toplamlara topla</span>
df = df_orders.<span class="fn">copy</span>()
df[<span class="str">'date'</span>] = pd.<span class="fn">to_datetime</span>(df[<span class="str">'order_date'</span>])
daily = df.<span class="fn">groupby</span>([<span class="str">'product_id'</span>, <span class="str">'date'</span>])[<span class="str">'amount'</span>].<span class="fn">sum</span>().<span class="fn">reset_index</span>()

<span class="cm"># Ürün başına gecikme özellikleri oluştur, tek büyük eğitim kümesinde yığ</span>
rows = []
<span class="kw">for</span> pid, g <span class="kw">in</span> daily.<span class="fn">groupby</span>(<span class="str">'product_id'</span>):
    g = g.<span class="fn">sort_values</span>(<span class="str">'date'</span>).<span class="fn">set_index</span>(<span class="str">'date'</span>)
    g[<span class="str">'lag_1'</span>] = g[<span class="str">'amount'</span>].<span class="fn">shift</span>(<span class="num">1</span>)
    g[<span class="str">'lag_7'</span>] = g[<span class="str">'amount'</span>].<span class="fn">shift</span>(<span class="num">7</span>)
    g[<span class="str">'mean_7'</span>] = g[<span class="str">'amount'</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">7</span>).<span class="fn">mean</span>()
    g[<span class="str">'dow'</span>] = g.index.dayofweek
    g[<span class="str">'product_id'</span>] = pid
    rows.<span class="fn">append</span>(g.<span class="fn">dropna</span>())

big = pd.<span class="fn">concat</span>(rows).<span class="fn">reset_index</span>()
<span class="fn">print</span>(f<span class="str">'Stacked rows: {len(big)}, products: {big.product_id.nunique()}'</span>)

<span class="cm"># Tüm ürünler arasında TEK global model eğit</span>
y_all = big[<span class="str">'amount'</span>].values
X_all = big[[<span class="str">'lag_1'</span>, <span class="str">'lag_7'</span>, <span class="str">'mean_7'</span>, <span class="str">'dow'</span>, <span class="str">'product_id'</span>]].values

split = <span class="fn">int</span>(<span class="fn">len</span>(big) * <span class="num">0.8</span>)
model = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">100</span>, max_depth=<span class="num">4</span>).<span class="fn">fit</span>(X_all[:split], y_all[:split])
pred = model.<span class="fn">predict</span>(X_all[split:])
mae = <span class="fn">float</span>(np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(y_all[split:] - pred)))
<span class="fn">print</span>(f<span class="str">'Global model MAE across all products: {mae:.3f}'</span>)
</code></pre></div></div>
<p class="l-text">500 ürün görmüş tek bir model, çoğu zaman 500 bireysel ürün modelini yener — veri paylaşımı düzenlileştirme gibi davranır. Bu, M5 yarışmasına hâkim olan "global vs yerel" tartışmasıdır.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Kuantil Regresyonu ile Tahmin Aralıkları</h2>
<p class="l-text">5. ve 95. kuantilleri hedefleyen iki ekstra model eğitin. %90'lık bir PI için birleştirin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
y = feat[<span class="str">'y'</span>].values
X = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>]).values

split = <span class="fn">len</span>(feat) - <span class="num">30</span>
y_tr, y_te = y[:split], y[split:]
X_tr, X_te = X[:split], X[split:]

<span class="cm"># Üç model: medyan, düşük kuantil, yüksek kuantil</span>
m_med = <span class="fn">GradientBoostingRegressor</span>(loss=<span class="str">'quantile'</span>, alpha=<span class="num">0.50</span>,
                                   n_estimators=<span class="num">150</span>, max_depth=<span class="num">3</span>).<span class="fn">fit</span>(X_tr, y_tr)
m_lo  = <span class="fn">GradientBoostingRegressor</span>(loss=<span class="str">'quantile'</span>, alpha=<span class="num">0.05</span>,
                                   n_estimators=<span class="num">150</span>, max_depth=<span class="num">3</span>).<span class="fn">fit</span>(X_tr, y_tr)
m_hi  = <span class="fn">GradientBoostingRegressor</span>(loss=<span class="str">'quantile'</span>, alpha=<span class="num">0.95</span>,
                                   n_estimators=<span class="num">150</span>, max_depth=<span class="num">3</span>).<span class="fn">fit</span>(X_tr, y_tr)

med = m_med.<span class="fn">predict</span>(X_te)
lo  = m_lo.<span class="fn">predict</span>(X_te)
hi  = m_hi.<span class="fn">predict</span>(X_te)

<span class="cm"># Kapsama kontrolü</span>
covered = ((y_te >= lo) & (y_te <= hi)).<span class="fn">mean</span>()
width   = (hi - lo).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">'Empirical 90% coverage: {covered*100:.1f}%   target 90%'</span>)
<span class="fn">print</span>(f<span class="str">'Mean PI width: {width:.3f}'</span>)
</code></pre></div>
<p class="l-text">Kapsama %90'dan uzaksa, modeliniz kalibre edilmemiş — konformal tahmin deneyin (nominal kapsamayı tutturmak için sonradan genişlik ayarı).</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Özellik Önemi — Aslında Ne Önemlidir</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

feat = <span class="fn">make_features</span>(df_stocks[<span class="str">'date'</span>], df_stocks[<span class="str">'close'</span>]).<span class="fn">dropna</span>()
y = feat[<span class="str">'y'</span>].values
X = feat.<span class="fn">drop</span>(columns=[<span class="str">'y'</span>])

model = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">200</span>, max_depth=<span class="num">3</span>,
                                   learning_rate=<span class="num">0.05</span>).<span class="fn">fit</span>(X.values, y)

imp = pd.<span class="fn">DataFrame</span>({
    <span class="str">'feature'</span>: X.columns,
    <span class="str">'importance'</span>: model.feature_importances_
}).<span class="fn">sort_values</span>(<span class="str">'importance'</span>, ascending=<span class="kw">False</span>)

<span class="fn">print</span>(<span class="str">'Top 10 features by importance:'</span>)
<span class="fn">print</span>(imp.<span class="fn">head</span>(<span class="num">10</span>).<span class="fn">to_string</span>(index=<span class="kw">False</span>))
</code></pre></div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.8rem 1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.92rem">Hisse verilerinde, lag_1 hâkimdir (rastgele yürüyüş). Perakendede, lag_7 + haftanın günü hâkimdir. En iyi özelliğiniz tuhaf bir şeyse (örneğin tek başına <code>std_30</code>), sızıntı denetleyin.</div>
</div>

<div class="lesson-block" id="section-10"><h2 class="lesson-title">10. Track Özeti ve Sonraki Yön</h2>
<p class="l-text">L1-L5 boyunca tam zaman serisi yığınını inşa ettiniz:</p>
<ul style="line-height:1.7"><li><strong>L1</strong> — ayrıştırma, durağanlık, referanslar, değerlendirme</li><li><strong>L2</strong> — ARIMA, SARIMA, Holt-Winters klasik modeller</li><li><strong>L3</strong> — dağınık iş verisi için Prophet, STL tanıları</li><li><strong>L4</strong> — özellik mühendisliği: gecikmeler, hareketli, takvim, Fourier, hedef kodlaması</li><li><strong>L5</strong> — bu özelliklerde ML modelleri, TimeSeriesSplit, ileri-yürüme, çok adımlı, mlforecast, kuantil PI'lar</li></ul>
<p class="l-text"><strong>Sonra ne çalışılır:</strong></p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Derin öğrenme</div><div class="card-body">N-BEATS, NHITS, TFT, PatchTST — zengin dışsal regresörlü çok değişkenli verilerde son yarışmaları kazanan Transformer/MLP modelleri.</div></div>
<div class="calc-card"><div class="card-title">Olasılıksal tahmincilik</div><div class="card-body">DeepAR, Konformal Tahmin, tam dağılımsal çıktı — tek kuantil PI'ların ötesinde.</div></div>
<div class="calc-card"><div class="card-title">Hiyerarşik uzlaştırma</div><div class="card-body">SKU + mağaza + bölge seviyelerinde tahmin et, sonra tutarlı toplanacak şekilde uzlaştır. Kütüphane: <code>hierarchicalforecast</code>.</div></div>
<div class="calc-card"><div class="card-title">Anomali tespiti</div><div class="card-body">Aynı özellik hattı, ama hedef "bu bir aykırı değer mi?" — dolandırıcılık, sunucu sağlığı, IoT.</div></div>
</div>
<p class="l-text">Artık temellere sahipsiniz. Geri kalanı gerçek veri kümeleri üzerinde tekrardır.</p>
</div>`
};
