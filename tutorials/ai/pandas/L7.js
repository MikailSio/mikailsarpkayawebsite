window.PANDAS_L7 = {

en: `<p class="l-text"><strong>Time series data is everywhere</strong> -- stock prices, server logs, sensor readings, web traffic, daily sales, tweet timestamps, log timestamps, and even NLP datasets that need to be split by time. The defining feature is <strong>order matters</strong>: today's value depends on yesterday's, and you cannot shuffle rows without destroying the signal.</p>

<p class="l-text">This lesson teaches you how Pandas handles datetimes from the ground up: parsing strings into <code>Timestamp</code> objects, building <code>DatetimeIndex</code>es, slicing by date, resampling to a different frequency, computing rolling statistics, generating lag features for ML, and converting timezones. By the end you will be able to take a raw log file with messy timestamps and turn it into a clean, ML-ready feature matrix.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Convert strings to datetimes with pd.to_datetime() and parse formats</li><li>Set a DatetimeIndex and select rows by date strings or slices</li><li>Resample to higher or lower frequencies with .resample() and aggregations</li><li>Smooth and trend-detect with rolling and expanding windows</li><li>Extract date parts (year, month, dayofweek) with the .dt accessor</li><li>Handle timezones, daylight saving and irregular frequencies</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Time Series?</h2>

<p class="l-text">Imagine you have a CSV with one million rows of customer support tickets. Each row has a <code>created_at</code> column like <code>"2024-03-15 14:32:08"</code>. You want to answer: <em>How many tickets per day? Per week? Are Mondays busier than Fridays? Is the trend going up?</em> Without proper time handling, every one of these questions becomes a painful loop with string parsing and counting dictionaries. With Pandas time series tools, each one is a single line.</p>

<div class="calc-highlight"><strong>The defining property of time series data:</strong> the row order encodes information. In a regular DataFrame you can shuffle rows freely. In a time series, shuffling destroys the signal -- yesterday's stock price is correlated with today's, and that correlation only exists because of the temporal order.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ordered</div><div class="card-body">Each observation has a position in time. The index is monotonic (increasing) and rows are not interchangeable.</div></div>
<div class="calc-card"><div class="card-title">Regular vs Irregular</div><div class="card-body">Regular: equal spacing (every minute, every day). Irregular: arbitrary timestamps (event logs, tweets). Different tools apply.</div></div>
<div class="calc-card"><div class="card-title">Trend</div><div class="card-body">Long-term direction: stock going up over years, website growing, sensor degrading. The slow signal beneath the noise.</div></div>
<div class="calc-card"><div class="card-title">Seasonality</div><div class="card-body">Repeating patterns: daily (rush hour), weekly (weekend dip), yearly (Christmas spike). Predictable and exploitable.</div></div>
<div class="calc-card"><div class="card-title">Autocorrelation</div><div class="card-body">Today depends on yesterday. The value at time t is correlated with the value at t-1, t-7, t-30. This is what makes forecasting possible.</div></div>
<div class="calc-card"><div class="card-title">Stationarity</div><div class="card-body">A series is stationary if its mean and variance do not change over time. Most ML models assume stationarity -- you may need to difference the data first.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP timestamps</div><div class="example-body">In sentiment analysis, you might have a tweet column and a created_at column. Useful features include: <strong>hour of day</strong> (negative tweets peak in the evening), <strong>day of week</strong> (Mondays are grumpier), <strong>days since signup</strong> (new users post more), and <strong>weekend flag</strong>. Each is a one-line feature in Pandas once your timestamps are parsed correctly.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why not just store timestamps as strings? Two reasons. First, performance: filtering 10M string timestamps takes seconds, filtering Pandas Timestamps takes milliseconds because they are stored as int64 nanoseconds since 1970. Second, semantics: <code>"2024-03-15"</code> as a string sorts lexicographically and breaks at <code>"2024-3-15"</code>; as a Timestamp, the order is mathematically guaranteed.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Parsing Datetimes with pd.to_datetime</h2>

<p class="l-text">The first step in any time-series pipeline is converting your raw strings (or integers, or weird hybrid columns) into Pandas <code>Timestamp</code> objects. <code>pd.to_datetime()</code> is the swiss army knife for this -- it handles dozens of formats automatically and gives you fine-grained control when auto-detection fails.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Single value -- returns a Timestamp scalar</span>
ts = pd.<span class="fn">to_datetime</span>(<span class="str">"2024-03-15 14:32:08"</span>)
<span class="fn">print</span>(ts)            <span class="cm"># 2024-03-15 14:32:08</span>
<span class="fn">print</span>(<span class="fn">type</span>(ts))      <span class="cm"># &lt;class 'pandas._libs.tslibs.timestamps.Timestamp'&gt;</span>

<span class="cm"># A whole column at once -- returns a Series of datetime64[ns]</span>
s = pd.<span class="fn">Series</span>([<span class="str">"2024-01-01"</span>, <span class="str">"2024-02-15"</span>, <span class="str">"2024-03-30"</span>])
dt = pd.<span class="fn">to_datetime</span>(s)
<span class="fn">print</span>(dt.dtype)      <span class="cm"># datetime64[ns]</span>

<span class="cm"># Mixed formats -- Pandas tries to figure it out</span>
mixed = pd.<span class="fn">Series</span>([<span class="str">"2024-03-15"</span>, <span class="str">"March 16, 2024"</span>, <span class="str">"2024/03/17"</span>, <span class="str">"17 Mar 2024"</span>])
<span class="fn">print</span>(pd.<span class="fn">to_datetime</span>(mixed))
<span class="cm"># 0   2024-03-15</span>
<span class="cm"># 1   2024-03-16</span>
<span class="cm"># 2   2024-03-17</span>
<span class="cm"># 3   2024-03-17</span>

<span class="cm"># Explicit format string -- 100x faster on large data because no auto-detection</span>
ts2 = pd.<span class="fn">to_datetime</span>(s, <span class="ty">format</span>=<span class="str">"%Y-%m-%d"</span>)

<span class="cm"># errors='coerce' -- turn unparseable values into NaT (Not a Time) instead of raising</span>
bad = pd.<span class="fn">Series</span>([<span class="str">"2024-03-15"</span>, <span class="str">"not a date"</span>, <span class="str">"2024-13-99"</span>])
<span class="fn">print</span>(pd.<span class="fn">to_datetime</span>(bad, errors=<span class="str">"coerce"</span>))
<span class="cm"># 0   2024-03-15</span>
<span class="cm"># 1          NaT</span>
<span class="cm"># 2          NaT</span>

<span class="cm"># Unix timestamps (seconds since 1970)</span>
unix = pd.<span class="fn">Series</span>([<span class="num">1710503528</span>, <span class="num">1710589928</span>, <span class="num">1710676328</span>])
<span class="fn">print</span>(pd.<span class="fn">to_datetime</span>(unix, unit=<span class="str">"s"</span>))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Converts a single string to a <code>Timestamp</code> -- a Pandas-native datetime object backed by a 64-bit integer. 2) Converts an entire Series to <code>datetime64[ns]</code> dtype -- nanosecond-precision NumPy timestamps stored contiguously, vectorized for speed. 3) Auto-detects mixed formats by trying multiple parsers; slow but tolerant. 4) Uses an explicit <code>format=</code> string for speed when you know the layout in advance (the <code>%Y-%m-%d</code> codes match strftime). 5) <code>errors="coerce"</code> swallows bad values into <code>NaT</code> so your pipeline does not crash. 6) Converts Unix epoch integers to timestamps, useful for log files and APIs that store seconds since 1970.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">%Y</div><div class="card-body">4-digit year, e.g. 2024. Use <code>%y</code> for 2-digit (24).</div></div>
<div class="calc-card"><div class="card-title">%m / %d</div><div class="card-body">Month (01-12) and day (01-31), zero-padded. Use <code>%-m</code> on Linux for non-padded.</div></div>
<div class="calc-card"><div class="card-title">%H / %M / %S</div><div class="card-body">Hour (00-23), minute, second. Use <code>%I</code> with <code>%p</code> for 12-hour AM/PM format.</div></div>
<div class="calc-card"><div class="card-title">%B / %b</div><div class="card-body">Full month name (March) or abbreviated (Mar). Locale-dependent.</div></div>
<div class="calc-card"><div class="card-title">%A / %a</div><div class="card-body">Full weekday name (Monday) or abbreviated (Mon).</div></div>
<div class="calc-card"><div class="card-title">%z / %Z</div><div class="card-body">Timezone offset (+0300) or name (UTC). Critical for global log data.</div></div>
</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">String column</div><div class="compare-item">dtype: object</div><div class="compare-item">Each cell is a Python string object</div><div class="compare-item">Sorting is lexicographic (breaks on padding)</div><div class="compare-item">No vectorized .dt accessor</div><div class="compare-item">Slow to filter and group</div><div class="compare-item">Memory: ~50 bytes per row</div></div>
<div class="compare-col"><div class="compare-title">Timestamp column</div><div class="compare-item">dtype: datetime64[ns]</div><div class="compare-item">Stored as contiguous int64 array</div><div class="compare-item">Sorting is mathematical (always correct)</div><div class="compare-item">Full .dt accessor: .year, .month, .hour</div><div class="compare-item">Vectorized filter and groupby (10-100x faster)</div><div class="compare-item">Memory: 8 bytes per row</div></div>
</div>

<div class="l-warn"><strong>Pitfall:</strong> If your CSV has timestamps with mixed timezones (some UTC, some local), <code>pd.to_datetime</code> may silently drop the timezone or raise. Always check <code>df["created_at"].dt.tz</code> and use <code>utc=True</code> to force UTC during parsing if you have global data.</div>

<p class="l-text"><strong>Quick summary:</strong> use <code>pd.to_datetime</code> on every timestamp column right after loading, prefer explicit <code>format=</code> for speed, and use <code>errors="coerce"</code> for robustness against dirty data.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Building DatetimeIndex with pd.date_range</h2>

<p class="l-text">Sometimes you do not have raw timestamps -- you need to <em>generate</em> them. Maybe you want to create a 365-row DataFrame of daily values, or a 1440-row table for every minute of a day, or a fixed schedule of business days. <code>pd.date_range()</code> generates evenly-spaced timestamps and is the foundation of synthetic time-series data.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Daily, between two dates (both endpoints inclusive)</span>
days = pd.<span class="fn">date_range</span>(start=<span class="str">"2024-01-01"</span>, end=<span class="str">"2024-01-07"</span>)
<span class="fn">print</span>(days)
<span class="cm"># DatetimeIndex(['2024-01-01', '2024-01-02', ..., '2024-01-07'],</span>
<span class="cm">#               dtype='datetime64[ns]', freq='D')</span>

<span class="cm"># Specify count instead of end</span>
hours = pd.<span class="fn">date_range</span>(start=<span class="str">"2024-03-15 09:00"</span>, periods=<span class="num">8</span>, freq=<span class="str">"h"</span>)
<span class="fn">print</span>(hours)
<span class="cm"># DatetimeIndex(['2024-03-15 09:00:00', ..., '2024-03-15 16:00:00'],</span>
<span class="cm">#               dtype='datetime64[ns]', freq='h')</span>

<span class="cm"># Business days only (skip weekends)</span>
bdays = pd.<span class="fn">date_range</span>(start=<span class="str">"2024-01-01"</span>, periods=<span class="num">10</span>, freq=<span class="str">"B"</span>)

<span class="cm"># Month ends</span>
month_ends = pd.<span class="fn">date_range</span>(start=<span class="str">"2024-01-01"</span>, end=<span class="str">"2024-12-31"</span>, freq=<span class="str">"ME"</span>)
<span class="cm"># 2024-01-31, 2024-02-29, 2024-03-31, ..., 2024-12-31</span>

<span class="cm"># Use as a DataFrame index</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df = pd.<span class="fn">DataFrame</span>(
    {<span class="str">"sales"</span>: np.random.<span class="fn">randint</span>(<span class="num">50</span>, <span class="num">200</span>, size=<span class="num">30</span>)},
    index=pd.<span class="fn">date_range</span>(<span class="str">"2024-03-01"</span>, periods=<span class="num">30</span>, freq=<span class="str">"D"</span>)
)
<span class="fn">print</span>(df.<span class="fn">head</span>())
<span class="cm">#             sales</span>
<span class="cm"># 2024-03-01    194</span>
<span class="cm"># 2024-03-02    197</span>
<span class="cm"># 2024-03-03    114</span>
<span class="cm"># ...</span>

<span class="cm"># Slice by partial string -- super powerful</span>
<span class="fn">print</span>(df.loc[<span class="str">"2024-03-15"</span>:<span class="str">"2024-03-20"</span>])</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generates a daily index between two endpoints (note: both inclusive, unlike Python's <code>range()</code>). 2) Generates 8 hourly timestamps starting from a fixed point using <code>periods=</code> instead of <code>end=</code>. 3) Uses <code>freq="B"</code> for business days, automatically skipping Saturday and Sunday -- crucial for finance data. 4) Generates month-end timestamps with <code>freq="ME"</code> -- every entry is the last day of a month, accounting for leap years. 5) Attaches the generated index to a DataFrame, turning it into a proper time series. 6) Demonstrates partial string slicing: <code>df.loc["2024-03-15":"2024-03-20"]</code> works because Pandas understands the index is a DatetimeIndex.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">D / B</div><div class="card-body">D = calendar day. B = business day (Mon-Fri). Use B for stocks, D for sensors.</div></div>
<div class="calc-card"><div class="card-title">h / min / s</div><div class="card-body">Hour, minute, second. <code>freq="15min"</code> gives 15-minute intervals -- common for IoT.</div></div>
<div class="calc-card"><div class="card-title">W / W-MON</div><div class="card-body">Weekly. Default ends on Sunday. <code>W-MON</code> means weekly with weeks ending on Monday.</div></div>
<div class="calc-card"><div class="card-title">ME / MS</div><div class="card-body">Month End vs Month Start. ME gives Jan 31, Feb 29, ... ; MS gives Jan 1, Feb 1, ... .</div></div>
<div class="calc-card"><div class="card-title">QE / QS</div><div class="card-body">Quarter End/Start. Standard fiscal quarters end Mar/Jun/Sep/Dec.</div></div>
<div class="calc-card"><div class="card-title">YE / YS</div><div class="card-body">Year End/Start. Useful for annual reports and yearly aggregates.</div></div>
</div>

<div id="plot-l7-daterange-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A 30-day synthetic daily-sales time series generated with <code>pd.date_range</code> and random integers. The horizontal axis is the DatetimeIndex; the vertical axis is the sales count. Notice that the x-axis is automatically formatted as dates because the index is a DatetimeIndex -- this would not happen with a plain integer index.</div>

<div class="l-note"><strong>Period vs Timestamp:</strong> <code>pd.date_range</code> creates point-in-time timestamps. If you want spans (a whole month, a whole quarter), use <code>pd.period_range</code> -- it returns a <code>PeriodIndex</code> where each entry represents an interval, useful for accounting and reporting.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The .dt Accessor: Extracting Time Features</h2>

<p class="l-text">Once your column is a proper datetime, the <code>.dt</code> accessor unlocks a whole world of time-based features. These are essential for ML: <strong>hour of day, day of week, is weekend, quarter, days since</strong> -- all common predictors that ML models can use directly.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># A series of tweet timestamps for sentiment analysis</span>
tweets = pd.<span class="fn">DataFrame</span>({
    <span class="str">"text"</span>: [<span class="str">"Great service!"</span>, <span class="str">"Terrible product"</span>, <span class="str">"Loved it"</span>,
             <span class="str">"Disappointed"</span>, <span class="str">"Best ever"</span>, <span class="str">"Meh"</span>, <span class="str">"Excellent!"</span>],
    <span class="str">"created_at"</span>: pd.<span class="fn">to_datetime</span>([
        <span class="str">"2024-03-15 14:32:08"</span>, <span class="str">"2024-03-16 09:15:22"</span>,
        <span class="str">"2024-03-16 22:48:01"</span>, <span class="str">"2024-03-17 11:03:55"</span>,
        <span class="str">"2024-03-18 19:27:13"</span>, <span class="str">"2024-03-19 02:11:44"</span>,
        <span class="str">"2024-03-20 16:55:30"</span>
    ]),
    <span class="str">"label"</span>: [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>]
})

<span class="cm"># .dt extracts components from a datetime Series</span>
tweets[<span class="str">"year"</span>]       = tweets[<span class="str">"created_at"</span>].dt.year
tweets[<span class="str">"month"</span>]      = tweets[<span class="str">"created_at"</span>].dt.month
tweets[<span class="str">"day"</span>]        = tweets[<span class="str">"created_at"</span>].dt.day
tweets[<span class="str">"hour"</span>]       = tweets[<span class="str">"created_at"</span>].dt.hour
tweets[<span class="str">"dayofweek"</span>]  = tweets[<span class="str">"created_at"</span>].dt.dayofweek    <span class="cm"># 0=Mon, 6=Sun</span>
tweets[<span class="str">"day_name"</span>]   = tweets[<span class="str">"created_at"</span>].dt.<span class="fn">day_name</span>()   <span class="cm"># 'Friday'</span>
tweets[<span class="str">"quarter"</span>]    = tweets[<span class="str">"created_at"</span>].dt.quarter
tweets[<span class="str">"is_weekend"</span>] = tweets[<span class="str">"created_at"</span>].dt.dayofweek &gt;= <span class="num">5</span>
tweets[<span class="str">"is_month_end"</span>] = tweets[<span class="str">"created_at"</span>].dt.is_month_end
tweets[<span class="str">"week_of_year"</span>] = tweets[<span class="str">"created_at"</span>].dt.<span class="fn">isocalendar</span>().week

<span class="cm"># Time of day buckets (for behavioral features)</span>
<span class="kw">def</span> <span class="fn">time_bucket</span>(h):
    <span class="kw">if</span> h &lt; <span class="num">6</span>:  <span class="kw">return</span> <span class="str">"night"</span>
    <span class="kw">if</span> h &lt; <span class="num">12</span>: <span class="kw">return</span> <span class="str">"morning"</span>
    <span class="kw">if</span> h &lt; <span class="num">18</span>: <span class="kw">return</span> <span class="str">"afternoon"</span>
    <span class="kw">return</span> <span class="str">"evening"</span>

tweets[<span class="str">"time_bucket"</span>] = tweets[<span class="str">"hour"</span>].<span class="fn">apply</span>(time_bucket)

<span class="fn">print</span>(tweets[[<span class="str">"created_at"</span>, <span class="str">"hour"</span>, <span class="str">"day_name"</span>, <span class="str">"is_weekend"</span>, <span class="str">"time_bucket"</span>]])</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a DataFrame of fake tweets with parsed timestamps and binary sentiment labels. 2) <code>.dt.year, .dt.month, .dt.day</code> extract calendar components -- vectorized, no loops. 3) <code>.dt.hour</code> grabs the hour (0-23), useful for "evening users are grumpier" hypotheses. 4) <code>.dt.dayofweek</code> returns 0 for Monday through 6 for Sunday -- the integer is a clean ML feature. 5) <code>.dt.day_name()</code> returns human-readable strings, good for plots. 6) <code>.dt.is_weekend</code> is just <code>dayofweek &gt;= 5</code>, but readable. 7) <code>.dt.is_month_end</code> is a boolean useful for end-of-month reporting effects. 8) The custom <code>time_bucket</code> function turns hours into named periods -- a categorical feature that often beats raw hour for tree models.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.dt.year / .dt.month / .dt.day</div><div class="card-body">Calendar components as integers. Use for trend features and calendar-based grouping.</div></div>
<div class="calc-card"><div class="card-title">.dt.hour / .dt.minute / .dt.second</div><div class="card-body">Time-of-day components. <code>.dt.hour</code> is the most common feature -- captures rush hour, late-night patterns.</div></div>
<div class="calc-card"><div class="card-title">.dt.dayofweek</div><div class="card-body">0=Monday, 6=Sunday. Cyclical, so you may want to encode as sin/cos for linear models.</div></div>
<div class="calc-card"><div class="card-title">.dt.dayofyear</div><div class="card-body">1-366. Useful for yearly seasonality features in retail or weather data.</div></div>
<div class="calc-card"><div class="card-title">.dt.is_month_end</div><div class="card-body">Boolean. Salary days, billing cycles, and reporting deadlines often cluster at month end.</div></div>
<div class="calc-card"><div class="card-title">.dt.normalize()</div><div class="card-body">Strip the time component, keeping only the date (set time to 00:00:00). Useful for daily groupby.</div></div>
</div>

<div id="plot-l7-hourdist-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Distribution of tweet timestamps by hour of day, computed via <code>.dt.hour</code>. The peaks at 9am and 8pm represent the typical commute and evening leisure usage windows -- exactly the kind of pattern you cannot see without proper datetime parsing. For sentiment analysis, hour-of-day is often a top-3 predictor: late-night posts skew negative.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP feature engineering</div><div class="example-body">Suppose you are training a sentiment classifier on customer reviews. Beyond the text, the timestamp gives you free features: <code>hour</code>, <code>is_weekend</code>, <code>is_holiday</code>, <code>days_since_signup</code>. In real benchmarks, adding these temporal features adds 1-3 percentage points of accuracy with zero extra labeling cost. The <code>.dt</code> accessor is your gateway.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Resampling: Changing Frequencies</h2>

<p class="l-text">You have minute-level sensor data but want hourly averages. You have daily sales but want monthly totals. You have irregular event timestamps but want a uniform daily count. <code>df.resample()</code> is the answer -- it is like <code>groupby</code> for time series, where the groups are time buckets.</p>

<div class="calc-highlight"><strong>Two directions:</strong> <em>Downsampling</em> = going from fine to coarse (minute -&gt; hour, day -&gt; month). You aggregate (mean, sum, max). <em>Upsampling</em> = going from coarse to fine (month -&gt; day). You fill (forward fill, interpolate).</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Daily traffic data for one year</span>
np.random.<span class="fn">seed</span>(<span class="num">42</span>)
idx = pd.<span class="fn">date_range</span>(<span class="str">"2024-01-01"</span>, <span class="str">"2024-12-31"</span>, freq=<span class="str">"D"</span>)
trend = np.<span class="fn">linspace</span>(<span class="num">100</span>, <span class="num">180</span>, <span class="fn">len</span>(idx))
season = <span class="num">30</span> * np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * np.<span class="fn">arange</span>(<span class="fn">len</span>(idx)) / <span class="num">7</span>)   <span class="cm"># weekly seasonality</span>
noise = np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">15</span>, <span class="fn">len</span>(idx))
df = pd.<span class="fn">DataFrame</span>({<span class="str">"visits"</span>: trend + season + noise}, index=idx)

<span class="cm"># DOWNSAMPLE: daily -&gt; monthly mean</span>
monthly = df.<span class="fn">resample</span>(<span class="str">"ME"</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(monthly.<span class="fn">head</span>())
<span class="cm">#             visits</span>
<span class="cm"># 2024-01-31  103.4</span>
<span class="cm"># 2024-02-29  108.7</span>
<span class="cm"># 2024-03-31  117.5</span>
<span class="cm"># ...</span>

<span class="cm"># Multiple aggregations at once</span>
monthly_full = df.<span class="fn">resample</span>(<span class="str">"ME"</span>).<span class="fn">agg</span>([<span class="str">"mean"</span>, <span class="str">"sum"</span>, <span class="str">"min"</span>, <span class="str">"max"</span>, <span class="str">"std"</span>])
<span class="fn">print</span>(monthly_full.<span class="fn">head</span>(<span class="num">3</span>))

<span class="cm"># OHLC -- common for finance (open/high/low/close per period)</span>
ohlc = df.<span class="fn">resample</span>(<span class="str">"ME"</span>)[<span class="str">"visits"</span>].<span class="fn">ohlc</span>()

<span class="cm"># Weekly business sum</span>
weekly_sum = df.<span class="fn">resample</span>(<span class="str">"W"</span>).<span class="fn">sum</span>()

<span class="cm"># UPSAMPLE: daily -&gt; hourly with forward fill</span>
sub = df.iloc[:<span class="num">5</span>]
hourly_ffill = sub.<span class="fn">resample</span>(<span class="str">"h"</span>).<span class="fn">ffill</span>()
hourly_interp = sub.<span class="fn">resample</span>(<span class="str">"h"</span>).<span class="fn">interpolate</span>(method=<span class="str">"linear"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a synthetic daily series with three components: a linear trend (100 to 180 over the year), a weekly sine wave (captures Mon-Sun rhythm), and Gaussian noise. 2) <code>resample("ME").mean()</code> groups by month-end and averages -- this is downsampling: 365 daily points become 12 monthly averages. 3) <code>.agg(["mean", "sum", ...])</code> computes multiple statistics simultaneously, returning a wide DataFrame with multi-level columns. 4) <code>.ohlc()</code> returns the open/high/low/close per bucket -- the standard financial summary. 5) Weekly sum aggregates 7 days of visits into a single number per week. 6) Upsampling expands 5 daily rows to 5*24=120 hourly rows; <code>ffill</code> repeats the last known value, while <code>interpolate</code> draws straight lines between known points.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Downsampling</div><div class="compare-item">Fine to coarse (1min -&gt; 1h)</div><div class="compare-item">Information loss is expected</div><div class="compare-item">Use mean, sum, max, std, count</div><div class="compare-item">Fewer rows, less noise</div><div class="compare-item">Common for plotting and reporting</div></div>
<div class="compare-col"><div class="compare-title">Upsampling</div><div class="compare-item">Coarse to fine (1d -&gt; 1h)</div><div class="compare-item">No new information -- just filling</div><div class="compare-item">Use ffill, bfill, interpolate</div><div class="compare-item">More rows, often introduces bias</div><div class="compare-item">Common for aligning multi-source data</div></div>
</div>

<div id="plot-l7-resample-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The raw daily visits (light line, noisy) versus the monthly-mean resample (thick gold line). The monthly average dampens the daily noise and exposes the underlying upward trend (100 to 180) that is hard to see in the raw data. This is exactly why analysts plot monthly aggregates in dashboards rather than the raw daily series -- humans cannot read 365 noisy points but can read 12 smooth ones.</div>

<div class="l-warn"><strong>Pitfall:</strong> When you resample to a coarser frequency with <code>.mean()</code>, missing days are silently treated as the value of nearby days. If you have gaps and care about them, use <code>.count()</code> or check <code>df.resample("D").size()</code> to see how many original points went into each bucket.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Rolling and Expanding Windows</h2>

<p class="l-text">Sometimes you do not want one number per month; you want a <em>smoothed</em> version of the original series at the original frequency. That is what rolling windows do: at each timestamp t, look back w days and compute a statistic. The result has the same length as the input but is smoother.</p>

<div class="katex-block">$$\\bar{x}_t^{(w)} = \\frac{1}{w}\\sum_{i=t-w+1}^{t} x_i$$</div>

<p class="l-text">This is the <strong>simple moving average</strong> with window size w. Each output point is the unweighted mean of the most recent w inputs. The exponentially weighted moving average (EWM) gives more weight to recent points:</p>

<div class="katex-block">$$\\bar{x}_t = \\alpha \\, x_t + (1-\\alpha)\\,\\bar{x}_{t-1}, \\quad \\alpha = \\frac{2}{w+1}$$</div>

<p class="l-text">EWM has no hard cutoff -- old data fades exponentially, never fully forgotten. It reacts faster to changes than a simple rolling mean.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
idx = pd.<span class="fn">date_range</span>(<span class="str">"2024-01-01"</span>, periods=<span class="num">120</span>, freq=<span class="str">"D"</span>)
df = pd.<span class="fn">DataFrame</span>({<span class="str">"price"</span>: <span class="num">100</span> + np.<span class="fn">cumsum</span>(np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">2</span>, <span class="num">120</span>))}, index=idx)

<span class="cm"># Simple rolling mean -- 7-day and 30-day</span>
df[<span class="str">"ma_7"</span>]  = df[<span class="str">"price"</span>].<span class="fn">rolling</span>(window=<span class="num">7</span>).<span class="fn">mean</span>()
df[<span class="str">"ma_30"</span>] = df[<span class="str">"price"</span>].<span class="fn">rolling</span>(window=<span class="num">30</span>).<span class="fn">mean</span>()

<span class="cm"># Rolling standard deviation -- volatility proxy</span>
df[<span class="str">"std_30"</span>] = df[<span class="str">"price"</span>].<span class="fn">rolling</span>(window=<span class="num">30</span>).<span class="fn">std</span>()

<span class="cm"># Exponentially weighted -- spans control alpha</span>
df[<span class="str">"ewm_7"</span>] = df[<span class="str">"price"</span>].<span class="fn">ewm</span>(span=<span class="num">7</span>, adjust=<span class="kw">False</span>).<span class="fn">mean</span>()

<span class="cm"># Custom function with .apply</span>
df[<span class="str">"roll_max_7"</span>] = df[<span class="str">"price"</span>].<span class="fn">rolling</span>(window=<span class="num">7</span>).<span class="fn">apply</span>(np.<span class="ty">max</span>, raw=<span class="kw">True</span>)

<span class="cm"># min_periods -- how many real values are required before computing</span>
df[<span class="str">"ma_7_strict"</span>] = df[<span class="str">"price"</span>].<span class="fn">rolling</span>(window=<span class="num">7</span>, min_periods=<span class="num">7</span>).<span class="fn">mean</span>()
<span class="cm"># First 6 rows are NaN, then the rolling mean kicks in</span>

<span class="cm"># Expanding window -- grows from the start (cumulative average)</span>
df[<span class="str">"expanding_mean"</span>] = df[<span class="str">"price"</span>].<span class="fn">expanding</span>().<span class="fn">mean</span>()

<span class="fn">print</span>(df.<span class="fn">head</span>(<span class="num">10</span>).<span class="fn">round</span>(<span class="num">2</span>))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a 120-day random walk starting at 100 -- a noisy but trending series mimicking daily prices. 2) <code>rolling(window=7).mean()</code> computes the 7-day simple moving average; the first 6 rows are NaN because there are not enough preceding points. 3) The 30-day MA is much smoother -- bigger window = more aggregation = less noise. 4) <code>rolling(window=30).std()</code> measures volatility: high std means the series is jumpy in that 30-day window. 5) <code>ewm(span=7).mean()</code> is the exponentially weighted version; <code>span</code> approximates a window of that size but with smooth decay. 6) <code>.apply(np.max, raw=True)</code> shows you can plug in any function -- here it returns the max within the rolling window. 7) <code>min_periods=7</code> forces strict enforcement: NaN until exactly 7 real values are available. 8) <code>expanding()</code> is "infinite-window rolling" -- each output is the average of <em>all</em> prior values, so it converges to the global mean as you go.</p>

<div id="plot-l7-rolling-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Three traces overlaid -- the raw noisy daily price (faded), the 7-day rolling mean (medium smoothing), and the 30-day rolling mean (heavy smoothing). As the window grows, the trace becomes smoother but lags behind sudden changes. This is the fundamental trade-off in time-series smoothing: smaller window = more responsive but noisier; larger window = stable but slow to react. EWM tries to give you both, weighing recent points more.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.rolling(w).mean()</div><div class="card-body">Simple moving average. Equal weight to last w points, then drops them entirely.</div></div>
<div class="calc-card"><div class="card-title">.rolling(w).std()</div><div class="card-body">Rolling standard deviation. Used as volatility, and as input to Bollinger Bands.</div></div>
<div class="calc-card"><div class="card-title">.ewm(span=w).mean()</div><div class="card-body">Exponentially weighted MA. Smooth fade, more responsive to recent changes.</div></div>
<div class="calc-card"><div class="card-title">.rolling(w).apply(fn)</div><div class="card-body">Plug in any function -- median, IQR, custom logic. Slower but flexible.</div></div>
<div class="calc-card"><div class="card-title">.expanding().mean()</div><div class="card-body">Cumulative average from the start. Converges to global mean over time.</div></div>
<div class="calc-card"><div class="card-title">center=True</div><div class="card-body">By default, the rolling window is right-aligned (uses past only). <code>center=True</code> centers it -- but uses future values, so do NOT use this for forecasting.</div></div>
</div>

<div class="l-warn"><strong>Pitfall (data leakage):</strong> If you are building features for a forecasting model, NEVER use <code>center=True</code> or any rolling that includes future values. You will get fantastic backtest results that disappear in production. Always use right-aligned (the default) so the feature at time t depends only on times &lt;= t.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Lag Features and Differencing</h2>

<p class="l-text">For ML forecasting, the most powerful features are usually the past values themselves: yesterday's value, last week's value, last month's value. <code>.shift()</code> gives you these directly. <code>.diff()</code> and <code>.pct_change()</code> give you period-over-period changes -- often more stationary and easier for models.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

idx = pd.<span class="fn">date_range</span>(<span class="str">"2024-01-01"</span>, periods=<span class="num">10</span>, freq=<span class="str">"D"</span>)
df = pd.<span class="fn">DataFrame</span>({<span class="str">"sales"</span>: [<span class="num">100</span>, <span class="num">110</span>, <span class="num">105</span>, <span class="num">120</span>, <span class="num">130</span>, <span class="num">125</span>, <span class="num">140</span>, <span class="num">150</span>, <span class="num">145</span>, <span class="num">160</span>]}, index=idx)

<span class="cm"># shift(n) -- move values DOWN by n positions (lag)</span>
df[<span class="str">"sales_lag_1"</span>] = df[<span class="str">"sales"</span>].<span class="fn">shift</span>(<span class="num">1</span>)   <span class="cm"># yesterday's value</span>
df[<span class="str">"sales_lag_7"</span>] = df[<span class="str">"sales"</span>].<span class="fn">shift</span>(<span class="num">7</span>)   <span class="cm"># one week ago</span>

<span class="cm"># shift(-n) -- move values UP (peek into future, only for label creation)</span>
df[<span class="str">"sales_next"</span>] = df[<span class="str">"sales"</span>].<span class="fn">shift</span>(-<span class="num">1</span>)

<span class="cm"># diff -- difference between consecutive values</span>
df[<span class="str">"delta_1"</span>] = df[<span class="str">"sales"</span>].<span class="fn">diff</span>(<span class="num">1</span>)        <span class="cm"># x_t - x_(t-1)</span>
df[<span class="str">"delta_7"</span>] = df[<span class="str">"sales"</span>].<span class="fn">diff</span>(<span class="num">7</span>)        <span class="cm"># x_t - x_(t-7), week-over-week</span>

<span class="cm"># pct_change -- relative change (good for non-stationary series)</span>
df[<span class="str">"pct"</span>] = df[<span class="str">"sales"</span>].<span class="fn">pct_change</span>(<span class="num">1</span>) * <span class="num">100</span>   <span class="cm"># percent vs yesterday</span>

<span class="cm"># Build full feature set for an ML model</span>
features = pd.<span class="fn">DataFrame</span>(index=df.index)
features[<span class="str">"lag_1"</span>]    = df[<span class="str">"sales"</span>].<span class="fn">shift</span>(<span class="num">1</span>)
features[<span class="str">"lag_7"</span>]    = df[<span class="str">"sales"</span>].<span class="fn">shift</span>(<span class="num">7</span>)
features[<span class="str">"lag_30"</span>]   = df[<span class="str">"sales"</span>].<span class="fn">shift</span>(<span class="num">30</span>) <span class="kw">if</span> <span class="fn">len</span>(df) &gt; <span class="num">30</span> <span class="kw">else</span> <span class="kw">None</span>
features[<span class="str">"roll_7"</span>]   = df[<span class="str">"sales"</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">7</span>).<span class="fn">mean</span>()    <span class="cm"># past-only rolling</span>
features[<span class="str">"delta_1"</span>]  = df[<span class="str">"sales"</span>].<span class="fn">diff</span>(<span class="num">1</span>)
features[<span class="str">"target"</span>]   = df[<span class="str">"sales"</span>]

<span class="fn">print</span>(df.<span class="fn">head</span>(<span class="num">10</span>))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a 10-day sales DataFrame as our base. 2) <code>shift(1)</code> aligns each row with the previous row's value -- the result for day t is the sales of day t-1. The first row becomes NaN because there is no day before it. 3) <code>shift(7)</code> gives you the value from a week ago; useful when there is weekly seasonality. 4) <code>shift(-1)</code> shifts in the opposite direction -- this is for creating <em>targets</em> ("predict tomorrow given today's features"), NEVER for input features. 5) <code>diff(1)</code> equals <code>x_t - x_{t-1}</code> -- the day-over-day change. 6) <code>pct_change()</code> gives the relative change, scaled to a percentage. 7) The final <code>features</code> DataFrame combines lags, a rolling window <em>computed on shifted values</em> (this is the leak-safe way to build a moving-average feature), and the target. Critically, <code>shift(1).rolling(7).mean()</code> first shifts then rolls, so the t-th feature uses days t-7 through t-1 only.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: Sales forecasting feature matrix</div><div class="example-body"><strong>Goal:</strong> predict tomorrow's sales given history. <strong>Features (all leak-free):</strong> <code>lag_1</code> (yesterday), <code>lag_7</code> (last week same day), <code>lag_30</code> (last month same day), <code>roll_7</code> (last week's mean), <code>roll_30</code> (last month's mean), <code>delta_1</code> (yesterday's change), <code>day_of_week</code>, <code>is_weekend</code>, <code>is_holiday</code>. <strong>Target:</strong> <code>shift(-1)</code> of sales. Train a gradient-boosted model on these and you have a competitive baseline forecaster in 30 lines of Pandas.</div></div>

<div id="plot-l7-lag-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A scatter plot of sales vs lag-1 sales (each point is one day). The strong diagonal pattern reveals high autocorrelation -- today's sales are very similar to yesterday's. This visual is the basis of autoregressive models: if the scatter is tight along the diagonal, a simple "predict yesterday's value" baseline (the persistence forecast) is hard to beat.</div>

<div class="l-note"><strong>Differencing for stationarity:</strong> Many ML models assume the input is stationary (constant mean and variance). A trending series like stock prices is not stationary, but its first difference (<code>diff(1)</code>) often is. Always plot the differenced series to check before fitting models.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Time Zones and a Real Pipeline</h2>

<p class="l-text">If your data comes from multiple regions (servers, users, sources), timezones become unavoidable. Pandas handles them explicitly via <code>tz_localize</code> (attach a timezone to naive timestamps) and <code>tz_convert</code> (convert to a different timezone).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Naive timestamps -- no timezone information</span>
naive = pd.<span class="fn">to_datetime</span>([<span class="str">"2024-03-15 14:00"</span>, <span class="str">"2024-03-15 15:00"</span>])
<span class="fn">print</span>(naive.tz)   <span class="cm"># None</span>

<span class="cm"># Localize -- attach a timezone (does NOT change the wall-clock time)</span>
utc = naive.<span class="fn">tz_localize</span>(<span class="str">"UTC"</span>)
<span class="fn">print</span>(utc)
<span class="cm"># DatetimeIndex(['2024-03-15 14:00:00+00:00', ...], tz='UTC')</span>

<span class="cm"># Convert -- shift to another timezone (changes wall-clock, same instant)</span>
istanbul = utc.<span class="fn">tz_convert</span>(<span class="str">"Europe/Istanbul"</span>)
<span class="fn">print</span>(istanbul)
<span class="cm"># DatetimeIndex(['2024-03-15 17:00:00+03:00', ...], tz='Europe/Istanbul')</span>

<span class="cm"># Strip tz when you no longer need it</span>
back_naive = istanbul.<span class="fn">tz_localize</span>(<span class="kw">None</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Parses two strings into naive timestamps -- <code>.tz</code> is None, meaning Pandas does not know the timezone. 2) <code>tz_localize("UTC")</code> declares "these are UTC times"; the wall-clock numbers do not change but the timezone is now attached. 3) <code>tz_convert("Europe/Istanbul")</code> takes the UTC instant and re-expresses it in Istanbul time -- 14:00 UTC becomes 17:00 in Istanbul. The underlying instant is unchanged. 4) <code>tz_localize(None)</code> strips the timezone again, leaving the local wall-clock time as a naive timestamp.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">tz_localize</div><div class="compare-item">Attaches timezone to naive timestamps</div><div class="compare-item">Wall-clock numbers stay the same</div><div class="compare-item">Use after parsing CSV with known TZ</div><div class="compare-item">Errors if already localized</div></div>
<div class="compare-col"><div class="compare-title">tz_convert</div><div class="compare-item">Converts between timezones</div><div class="compare-item">Wall-clock changes, instant stays the same</div><div class="compare-item">Use to align multi-region data</div><div class="compare-item">Errors if NOT already localized</div></div>
</div>

<p class="l-text"><strong>Putting it all together -- a realistic NLP/log pipeline:</strong></p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Step 1: load raw log</span>
<span class="cm"># logs.csv has: ts (string), user_id, event, sentiment_score</span>
df = pd.<span class="fn">read_csv</span>(<span class="str">"logs.csv"</span>)

<span class="cm"># Step 2: parse the timestamp column</span>
df[<span class="str">"ts"</span>] = pd.<span class="fn">to_datetime</span>(df[<span class="str">"ts"</span>], errors=<span class="str">"coerce"</span>, utc=<span class="kw">True</span>)
df = df.<span class="fn">dropna</span>(subset=[<span class="str">"ts"</span>])
df[<span class="str">"ts_local"</span>] = df[<span class="str">"ts"</span>].dt.<span class="fn">tz_convert</span>(<span class="str">"Europe/Istanbul"</span>)

<span class="cm"># Step 3: set the timestamp as the index (essential for resample/rolling)</span>
df = df.<span class="fn">set_index</span>(<span class="str">"ts_local"</span>).<span class="fn">sort_index</span>()

<span class="cm"># Step 4: extract calendar features</span>
df[<span class="str">"hour"</span>]       = df.index.hour
df[<span class="str">"dayofweek"</span>]  = df.index.dayofweek
df[<span class="str">"is_weekend"</span>] = df[<span class="str">"dayofweek"</span>] &gt;= <span class="num">5</span>

<span class="cm"># Step 5: aggregate to daily user-level stats</span>
daily = (
    df.<span class="fn">groupby</span>([pd.<span class="fn">Grouper</span>(freq=<span class="str">"D"</span>), <span class="str">"user_id"</span>])
      .<span class="fn">agg</span>(events=(<span class="str">"event"</span>, <span class="str">"count"</span>),
           avg_sentiment=(<span class="str">"sentiment_score"</span>, <span class="str">"mean"</span>))
      .<span class="fn">reset_index</span>()
)

<span class="cm"># Step 6: build rolling features per user</span>
daily = daily.<span class="fn">sort_values</span>([<span class="str">"user_id"</span>, <span class="str">"ts_local"</span>])
daily[<span class="str">"sent_ma_7"</span>]  = (daily.<span class="fn">groupby</span>(<span class="str">"user_id"</span>)[<span class="str">"avg_sentiment"</span>]
                            .<span class="fn">transform</span>(<span class="kw">lambda</span> s: s.<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">7</span>).<span class="fn">mean</span>()))
daily[<span class="str">"events_lag_1"</span>] = daily.<span class="fn">groupby</span>(<span class="str">"user_id"</span>)[<span class="str">"events"</span>].<span class="fn">shift</span>(<span class="num">1</span>)

<span class="cm"># Step 7: filter to users with enough history and ready for ML</span>
ready = daily.<span class="fn">dropna</span>(subset=[<span class="str">"sent_ma_7"</span>, <span class="str">"events_lag_1"</span>])
<span class="fn">print</span>(ready.<span class="fn">head</span>())</code></pre></div>

<p class="l-text"><strong>What this pipeline does, step by step:</strong> 1) Loads a raw CSV that contains string timestamps and per-event sentiment scores (typical NLP+log mix). 2) Parses timestamps to UTC, dropping unparseable rows so the rest of the pipeline is safe. 3) Adds a local-time column for human-readable analysis while keeping UTC available. 4) Sets the timestamp as the index and sorts -- a prerequisite for both resample and time-based slicing. 5) Extracts calendar features (hour, day of week, weekend flag) using the index's <code>.hour</code>, <code>.dayofweek</code> attributes. 6) Aggregates to one row per (day, user) using <code>pd.Grouper(freq="D")</code> -- it groups by day and user simultaneously, computing event count and mean sentiment. 7) Sorts by user then time, then computes a rolling 7-day mean of sentiment <em>per user</em> using <code>shift(1).rolling(7)</code> to avoid leakage; <code>events_lag_1</code> is yesterday's count. 8) Drops rows where rolling features are NaN (early days for each user) -- the result is a clean, leak-free, ML-ready feature matrix.</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Always convert string timestamps to <code>datetime64[ns]</code> with <code>pd.to_datetime</code> -- it unlocks every other tool in this lesson.<br><strong>2.</strong> Use <code>pd.date_range</code> with the right freq code (D, h, B, ME, etc.) to generate synthetic time indexes.<br><strong>3.</strong> The <code>.dt</code> accessor turns timestamps into ML features in one line: <code>.dt.hour</code>, <code>.dt.dayofweek</code>, <code>.dt.is_weekend</code>.<br><strong>4.</strong> <code>.resample</code> changes frequencies; use mean/sum for downsampling and ffill/interpolate for upsampling.<br><strong>5.</strong> Rolling and EWM smooth a series at the same frequency. Always right-align (default) for forecasting features to avoid leakage.<br><strong>6.</strong> <code>.shift</code> creates lag features, <code>.diff</code> creates change features. The combo of lags + rolling on shifted data = leak-free ML features.<br><strong>7.</strong> Localize before converting timezones. UTC for storage, local for display.<br><strong>8.</strong> A real pipeline = parse + index + resample + rolling-on-shift + dropna. This shape works for everything from sales to logs to NLP timestamps.</div></div>
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
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:50,r:30,b:50,l:60}};

  // 1. date_range demo: 30-day synthetic sales
  var el1 = document.getElementById('plot-l7-daterange-en');
  if (el1) {
    var dates = []; for (var i=0;i<30;i++){var d=new Date(2024,2,1+i);dates.push(d.toISOString().slice(0,10));}
    var sales = [194,197,114,179,71,158,165,84,189,98,176,140,193,170,154,122,182,150,108,160,175,99,168,142,121,187,103,156,178,144];
    var trace = {x:dates,y:sales,mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2},marker:{color:T.accent,size:6}};
    var layout = Object.assign({}, common, {title:{text:'30-Day Synthetic Daily Sales (DatetimeIndex)',font:{color:T.text,size:14}},xaxis:{gridcolor:T.grid,title:'Date'},yaxis:{gridcolor:T.grid,zerolinecolor:T.zero,title:'Sales'}});
    Plotly.newPlot('plot-l7-daterange-en',[trace],layout,{responsive:true,displayModeBar:false});
  }

  // 2. hour-of-day distribution
  var el2 = document.getElementById('plot-l7-hourdist-en');
  if (el2) {
    var hours = []; var counts = [3,2,2,1,1,1,2,4,7,12,10,8,9,11,9,8,9,10,11,13,12,9,6,4];
    for (var h=0;h<24;h++) hours.push(h);
    var trace = {x:hours,y:counts,type:'bar',marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Tweet Distribution by Hour of Day',font:{color:T.text,size:14}},xaxis:{title:'Hour (0-23)',gridcolor:T.grid,dtick:2},yaxis:{title:'Tweet count',gridcolor:T.grid,zerolinecolor:T.zero}});
    Plotly.newPlot('plot-l7-hourdist-en',[trace],layout,{responsive:true,displayModeBar:false});
  }

  // 3. resample comparison
  var el3 = document.getElementById('plot-l7-resample-en');
  if (el3) {
    var dates = []; for (var i=0;i<365;i++){var d=new Date(2024,0,1+i);dates.push(d.toISOString().slice(0,10));}
    var raw = []; var monthly = [];
    var seed = 42;
    function rand(){seed=(seed*9301+49297)%233280;return seed/233280;}
    for (var i=0;i<365;i++){var trend=100+(80*i/365);var season=30*Math.sin(2*Math.PI*i/7);var noise=(rand()-0.5)*30;raw.push(trend+season+noise);}
    var monthDates=[]; var monthVals=[];
    for (var m=0;m<12;m++){var dStart=new Date(2024,m,1);var dEnd=new Date(2024,m+1,0);var sum=0;var n=0;for (var i=0;i<365;i++){var di=new Date(2024,0,1+i);if(di>=dStart&&di<=dEnd){sum+=raw[i];n++;}}monthDates.push(dEnd.toISOString().slice(0,10));monthVals.push(sum/n);}
    var t1 = {x:dates,y:raw,mode:'lines',type:'scatter',name:'Raw daily',line:{color:'rgba(200,169,110,0.35)',width:1}};
    var t2 = {x:monthDates,y:monthVals,mode:'lines+markers',type:'scatter',name:'Monthly mean',line:{color:T.accent,width:3},marker:{size:8}};
    var layout = Object.assign({}, common, {title:{text:'Daily vs Monthly Resampled Visits',font:{color:T.text,size:14}},xaxis:{title:'Date',gridcolor:T.grid},yaxis:{title:'Visits',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-resample-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // 4. rolling means
  var el4 = document.getElementById('plot-l7-rolling-en');
  if (el4) {
    var dates=[]; var price=[]; var seed=7;
    function rand2(){seed=(seed*9301+49297)%233280;return seed/233280;}
    var p=100;
    for (var i=0;i<120;i++){p+=(rand2()-0.5)*4;price.push(p);var d=new Date(2024,0,1+i);dates.push(d.toISOString().slice(0,10));}
    function roll(arr,w){var out=[];for(var i=0;i<arr.length;i++){if(i<w-1){out.push(null);}else{var s=0;for(var j=i-w+1;j<=i;j++)s+=arr[j];out.push(s/w);}}return out;}
    var ma7 = roll(price,7); var ma30 = roll(price,30);
    var t1 = {x:dates,y:price,mode:'lines',type:'scatter',name:'Raw price',line:{color:'rgba(200,169,110,0.3)',width:1}};
    var t2 = {x:dates,y:ma7,mode:'lines',type:'scatter',name:'7-day MA',line:{color:'#4ecdc4',width:2}};
    var t3 = {x:dates,y:ma30,mode:'lines',type:'scatter',name:'30-day MA',line:{color:T.accent,width:3}};
    var layout = Object.assign({}, common, {title:{text:'Price with 7-day and 30-day Rolling Means',font:{color:T.text,size:14}},xaxis:{title:'Date',gridcolor:T.grid},yaxis:{title:'Price',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-rolling-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  // 5. lag scatter
  var el5 = document.getElementById('plot-l7-lag-en');
  if (el5) {
    var seed=11; function rand3(){seed=(seed*9301+49297)%233280;return seed/233280;}
    var sales=[]; var p=100; for (var i=0;i<150;i++){p+=(rand3()-0.5)*8;sales.push(p);}
    var x=[]; var y=[]; for (var i=1;i<sales.length;i++){x.push(sales[i-1]);y.push(sales[i]);}
    var t1 = {x:x,y:y,mode:'markers',type:'scatter',marker:{color:T.accent,size:6,opacity:0.6,line:{color:'rgba(255,255,255,0.2)',width:1}},name:'Sales'};
    var minV=Math.min.apply(null,x.concat(y)); var maxV=Math.max.apply(null,x.concat(y));
    var t2 = {x:[minV,maxV],y:[minV,maxV],mode:'lines',type:'scatter',line:{color:'#f87171',width:2,dash:'dash'},name:'y = x (perfect autocorr)'};
    var layout = Object.assign({}, common, {title:{text:'Sales[t] vs Sales[t-1]: autocorrelation visible',font:{color:T.text,size:14}},xaxis:{title:'Sales[t-1]',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Sales[t]',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-lag-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // TR plots (mirror)
  var el1tr = document.getElementById('plot-l7-daterange-tr');
  if (el1tr) {
    var dates = []; for (var i=0;i<30;i++){var d=new Date(2024,2,1+i);dates.push(d.toISOString().slice(0,10));}
    var sales = [194,197,114,179,71,158,165,84,189,98,176,140,193,170,154,122,182,150,108,160,175,99,168,142,121,187,103,156,178,144];
    var trace = {x:dates,y:sales,mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2},marker:{color:T.accent,size:6}};
    var layout = Object.assign({}, common, {title:{text:'30 Gunluk Sentetik Gunluk Satislar (DatetimeIndex)',font:{color:T.text,size:14}},xaxis:{gridcolor:T.grid,title:'Tarih'},yaxis:{gridcolor:T.grid,zerolinecolor:T.zero,title:'Satis'}});
    Plotly.newPlot('plot-l7-daterange-tr',[trace],layout,{responsive:true,displayModeBar:false});
  }
  var el2tr = document.getElementById('plot-l7-hourdist-tr');
  if (el2tr) {
    var hours = []; var counts = [3,2,2,1,1,1,2,4,7,12,10,8,9,11,9,8,9,10,11,13,12,9,6,4];
    for (var h=0;h<24;h++) hours.push(h);
    var trace = {x:hours,y:counts,type:'bar',marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Saate Gore Tweet Dagilimi',font:{color:T.text,size:14}},xaxis:{title:'Saat (0-23)',gridcolor:T.grid,dtick:2},yaxis:{title:'Tweet sayisi',gridcolor:T.grid,zerolinecolor:T.zero}});
    Plotly.newPlot('plot-l7-hourdist-tr',[trace],layout,{responsive:true,displayModeBar:false});
  }
  var el3tr = document.getElementById('plot-l7-resample-tr');
  if (el3tr) {
    var dates = []; for (var i=0;i<365;i++){var d=new Date(2024,0,1+i);dates.push(d.toISOString().slice(0,10));}
    var raw = [];
    var seed = 42;
    function rand(){seed=(seed*9301+49297)%233280;return seed/233280;}
    for (var i=0;i<365;i++){var trend=100+(80*i/365);var season=30*Math.sin(2*Math.PI*i/7);var noise=(rand()-0.5)*30;raw.push(trend+season+noise);}
    var monthDates=[]; var monthVals=[];
    for (var m=0;m<12;m++){var dStart=new Date(2024,m,1);var dEnd=new Date(2024,m+1,0);var sum=0;var n=0;for (var i=0;i<365;i++){var di=new Date(2024,0,1+i);if(di>=dStart&&di<=dEnd){sum+=raw[i];n++;}}monthDates.push(dEnd.toISOString().slice(0,10));monthVals.push(sum/n);}
    var t1 = {x:dates,y:raw,mode:'lines',type:'scatter',name:'Ham gunluk',line:{color:'rgba(200,169,110,0.35)',width:1}};
    var t2 = {x:monthDates,y:monthVals,mode:'lines+markers',type:'scatter',name:'Aylik ortalama',line:{color:T.accent,width:3},marker:{size:8}};
    var layout = Object.assign({}, common, {title:{text:'Gunluk vs Aylik Yeniden Orneklenmis Ziyaretler',font:{color:T.text,size:14}},xaxis:{title:'Tarih',gridcolor:T.grid},yaxis:{title:'Ziyaret',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-resample-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }
  var el4tr = document.getElementById('plot-l7-rolling-tr');
  if (el4tr) {
    var dates=[]; var price=[]; var seed=7;
    function rand2(){seed=(seed*9301+49297)%233280;return seed/233280;}
    var p=100;
    for (var i=0;i<120;i++){p+=(rand2()-0.5)*4;price.push(p);var d=new Date(2024,0,1+i);dates.push(d.toISOString().slice(0,10));}
    function roll(arr,w){var out=[];for(var i=0;i<arr.length;i++){if(i<w-1){out.push(null);}else{var s=0;for(var j=i-w+1;j<=i;j++)s+=arr[j];out.push(s/w);}}return out;}
    var ma7 = roll(price,7); var ma30 = roll(price,30);
    var t1 = {x:dates,y:price,mode:'lines',type:'scatter',name:'Ham fiyat',line:{color:'rgba(200,169,110,0.3)',width:1}};
    var t2 = {x:dates,y:ma7,mode:'lines',type:'scatter',name:'7 gunluk MA',line:{color:'#4ecdc4',width:2}};
    var t3 = {x:dates,y:ma30,mode:'lines',type:'scatter',name:'30 gunluk MA',line:{color:T.accent,width:3}};
    var layout = Object.assign({}, common, {title:{text:'7 ve 30 Gunluk Hareketli Ortalamalarla Fiyat',font:{color:T.text,size:14}},xaxis:{title:'Tarih',gridcolor:T.grid},yaxis:{title:'Fiyat',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-rolling-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
  var el5tr = document.getElementById('plot-l7-lag-tr');
  if (el5tr) {
    var seed=11; function rand3(){seed=(seed*9301+49297)%233280;return seed/233280;}
    var sales=[]; var p=100; for (var i=0;i<150;i++){p+=(rand3()-0.5)*8;sales.push(p);}
    var x=[]; var y=[]; for (var i=1;i<sales.length;i++){x.push(sales[i-1]);y.push(sales[i]);}
    var t1 = {x:x,y:y,mode:'markers',type:'scatter',marker:{color:T.accent,size:6,opacity:0.6,line:{color:'rgba(255,255,255,0.2)',width:1}},name:'Satis'};
    var minV=Math.min.apply(null,x.concat(y)); var maxV=Math.max.apply(null,x.concat(y));
    var t2 = {x:[minV,maxV],y:[minV,maxV],mode:'lines',type:'scatter',line:{color:'#f87171',width:2,dash:'dash'},name:'y = x (mukemmel oto-korelasyon)'};
    var layout = Object.assign({}, common, {title:{text:'Satis[t] vs Satis[t-1]: oto-korelasyon gorunur',font:{color:T.text,size:14}},xaxis:{title:'Satis[t-1]',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Satis[t]',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-lag-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>`,

tr: `<p class="l-text"><strong>Zaman serisi verileri her yerde</strong> -- hisse senedi fiyatları, sunucu logları, sensör okumaları, web trafiği, günlük satışlar, tweet zaman damgaları, log zaman damgaları ve hatta zamana göre bölünmesi gereken NLP veri setleri. Belirleyici özellik şu: <strong>sıra önemlidir</strong>: bugünün değeri dünün değerine bağlıdır ve sinyali bozmadan satırları karıştıramazsınız.</p>

<p class="l-text">Bu ders size Pandas'ın tarih/saatleri sıfırdan nasıl ele aldığını öğretir: stringleri <code>Timestamp</code> nesnelerine ayrıştırmak, <code>DatetimeIndex</code> oluşturmak, tarihe göre dilimlemek, farklı bir frekansa yeniden örneklemek, kayan istatistikler hesaplamak, ML için lag özellikleri üretmek ve zaman dilimlerini dönüştürmek. Ders sonunda dağınık zaman damgalarına sahip ham bir log dosyasını alıp temiz, ML için hazır bir özellik matrisine dönüştürebileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>pd.to_datetime() ile metinleri tarihe dönüştür ve formatları ayrıştır</li><li>DatetimeIndex ata; tarih dizesi veya dilimle satır seç</li><li>.resample() ve agregasyonlarla daha yüksek/düşük frekansa örnekle</li><li>Rolling ve expanding pencerelerle yumuşat ve trend tespit et</li><li>.dt erişimcisiyle yıl, ay, haftanın günü gibi tarih parçalarını çıkar</li><li>Saat dilimleri, yaz saati ve düzensiz frekansları yönet</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Zaman Serisi?</h2>

<p class="l-text">Bir milyon satır müşteri destek bileti içeren bir CSV'niz olduğunu düşünün. Her satırda <code>"2024-03-15 14:32:08"</code> gibi bir <code>created_at</code> sütunu var. Şu soruları yanıtlamak istiyorsunuz: <em>Günde kaç bilet açılıyor? Haftada? Pazartesileri Cumalardan daha mı yoğun? Trend yukarı mı gidiyor?</em> Düzgün zaman işleme olmadan, bu soruların her biri string ayrıştırma ve sayma sözlükleriyle dolu acı verici bir döngüye dönüşür. Pandas zaman serisi araçlarıyla, her biri tek bir satırdır.</p>

<div class="calc-highlight"><strong>Zaman serisi verisinin belirleyici özelliği:</strong> satır sırası bilgi taşır. Normal bir DataFrame'de satırları özgürce karıştırabilirsiniz. Zaman serisinde karıştırmak sinyali yok eder -- dünün hisse fiyatı bugünün fiyatıyla ilişkilidir ve bu ilişki yalnızca zamansal sıra nedeniyle vardır.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sıralı</div><div class="card-body">Her gözlemin zaman içinde bir konumu vardır. İndeks monoton (artan) ve satırlar değiştirilemez.</div></div>
<div class="calc-card"><div class="card-title">Düzenli vs Düzensiz</div><div class="card-body">Düzenli: eşit aralıklı (her dakika, her gün). Düzensiz: keyfi zaman damgaları (olay logları, tweetler). Farklı araçlar uygulanır.</div></div>
<div class="calc-card"><div class="card-title">Trend</div><div class="card-body">Uzun vadeli yön: yıllar boyu yükselen hisse, büyüyen web sitesi, eskiyen sensör. Gürültünün altındaki yavaş sinyal.</div></div>
<div class="calc-card"><div class="card-title">Mevsimsellik</div><div class="card-body">Tekrarlayan örüntüler: günlük (yoğun saatler), haftalık (hafta sonu düşüşü), yıllık (yılbaşı zirvesi). Tahmin edilebilir ve kullanışlı.</div></div>
<div class="calc-card"><div class="card-title">Oto-korelasyon</div><div class="card-body">Bugün düne bağlıdır. t zamanındaki değer t-1, t-7, t-30 zamanlarındaki değerle ilişkilidir. Tahmini mümkün kılan budur.</div></div>
<div class="calc-card"><div class="card-title">Durağanlık</div><div class="card-body">Bir seri durağansa ortalaması ve varyansı zamanla değişmez. Çoğu ML modeli durağanlık varsayar -- önce diff almanız gerekebilir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP zaman damgaları</div><div class="example-body">Duygu analizinde, bir tweet sütununuz ve bir created_at sütununuz olabilir. Faydalı özellikler şunlardır: <strong>günün saati</strong> (negatif tweetler akşam zirve yapar), <strong>haftanın günü</strong> (Pazartesiler daha aksi), <strong>kayıttan beri geçen gün</strong> (yeni kullanıcılar daha çok yazar) ve <strong>hafta sonu bayrağı</strong>. Zaman damgalarınız doğru ayrıştırılmışsa her biri Pandas'ta tek satırlık bir özelliktir.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Neden zaman damgalarını sadece string olarak saklamayalım? İki neden. Birincisi performans: 10 milyon string zaman damgasını filtrelemek saniyeler sürer, Pandas Timestamp'larını filtrelemek milisaniyeler sürer çünkü 1970'ten beri int64 nanosaniye olarak saklanırlar. İkincisi anlam: <code>"2024-03-15"</code> string olarak alfabetik sıralanır ve <code>"2024-3-15"</code>'te bozulur; Timestamp olarak sıra matematiksel olarak garantilidir.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. pd.to_datetime ile Tarih Ayrıştırma</h2>

<p class="l-text">Herhangi bir zaman serisi pipeline'ında ilk adım, ham stringlerinizi (veya tam sayıları, veya garip melez sütunları) Pandas <code>Timestamp</code> nesnelerine dönüştürmektir. <code>pd.to_datetime()</code> bunun için İsviçre çakısıdır -- onlarca formatı otomatik olarak ele alır ve otomatik algılama başarısız olduğunda size ince ayar kontrolü verir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Tek bir değer -- bir Timestamp skaleri döndürür</span>
ts = pd.<span class="fn">to_datetime</span>(<span class="str">"2024-03-15 14:32:08"</span>)
<span class="fn">print</span>(ts)            <span class="cm"># 2024-03-15 14:32:08</span>

<span class="cm"># Tüm bir sütun -- datetime64[ns] türünde Series döndürür</span>
s = pd.<span class="fn">Series</span>([<span class="str">"2024-01-01"</span>, <span class="str">"2024-02-15"</span>, <span class="str">"2024-03-30"</span>])
dt = pd.<span class="fn">to_datetime</span>(s)
<span class="fn">print</span>(dt.dtype)      <span class="cm"># datetime64[ns]</span>

<span class="cm"># Karışık formatlar -- Pandas çözmeye çalışır</span>
karisik = pd.<span class="fn">Series</span>([<span class="str">"2024-03-15"</span>, <span class="str">"March 16, 2024"</span>, <span class="str">"2024/03/17"</span>, <span class="str">"17 Mar 2024"</span>])
<span class="fn">print</span>(pd.<span class="fn">to_datetime</span>(karisik))

<span class="cm"># Açık format string -- büyük veride 100 kat daha hızlı (otomatik algılama yok)</span>
ts2 = pd.<span class="fn">to_datetime</span>(s, <span class="ty">format</span>=<span class="str">"%Y-%m-%d"</span>)

<span class="cm"># errors='coerce' -- ayrıştırılamayan değerleri NaT (Not a Time) yapar, hata fırlatmaz</span>
bozuk = pd.<span class="fn">Series</span>([<span class="str">"2024-03-15"</span>, <span class="str">"tarih degil"</span>, <span class="str">"2024-13-99"</span>])
<span class="fn">print</span>(pd.<span class="fn">to_datetime</span>(bozuk, errors=<span class="str">"coerce"</span>))
<span class="cm"># 0   2024-03-15</span>
<span class="cm"># 1          NaT</span>
<span class="cm"># 2          NaT</span>

<span class="cm"># Unix zaman damgaları (1970'ten beri saniye)</span>
unix = pd.<span class="fn">Series</span>([<span class="num">1710503528</span>, <span class="num">1710589928</span>, <span class="num">1710676328</span>])
<span class="fn">print</span>(pd.<span class="fn">to_datetime</span>(unix, unit=<span class="str">"s"</span>))</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Tek bir stringi <code>Timestamp</code>'a dönüştürür -- 64-bit tam sayıyla desteklenen Pandas'a özgü bir tarih nesnesi. 2) Tüm bir Series'i <code>datetime64[ns]</code> türüne çevirir -- ardışık olarak saklanan, hız için vektörize edilmiş nanosaniye hassasiyetli NumPy zaman damgaları. 3) Karışık formatları otomatik algılar; yavaş ama toleranslıdır. 4) Düzeni önceden biliyorsanız hız için açık <code>format=</code> stringi kullanır (<code>%Y-%m-%d</code> kodları strftime ile eşleşir). 5) <code>errors="coerce"</code> bozuk değerleri <code>NaT</code> yaparak pipeline'ınızın çökmemesini sağlar. 6) Unix epoch tam sayılarını zaman damgalarına çevirir, log dosyaları ve 1970'ten beri saniye saklayan API'ler için faydalıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">%Y</div><div class="card-body">4 haneli yıl, ör. 2024. 2 haneli için <code>%y</code> kullanın (24).</div></div>
<div class="calc-card"><div class="card-title">%m / %d</div><div class="card-body">Ay (01-12) ve gün (01-31), sıfır dolgulu.</div></div>
<div class="calc-card"><div class="card-title">%H / %M / %S</div><div class="card-body">Saat (00-23), dakika, saniye. 12 saatlik AM/PM için <code>%I</code> ile <code>%p</code> kullanın.</div></div>
<div class="calc-card"><div class="card-title">%B / %b</div><div class="card-body">Tam ay adı (March) veya kısaltılmış (Mar). Locale'a bağlı.</div></div>
<div class="calc-card"><div class="card-title">%A / %a</div><div class="card-body">Tam haftanın günü (Monday) veya kısaltılmış (Mon).</div></div>
<div class="calc-card"><div class="card-title">%z / %Z</div><div class="card-body">Saat dilimi farkı (+0300) veya adı (UTC). Küresel log verisi için kritik.</div></div>
</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">String sütun</div><div class="compare-item">dtype: object</div><div class="compare-item">Her hücre bir Python string nesnesi</div><div class="compare-item">Sıralama alfabetik (dolguda bozulur)</div><div class="compare-item">Vektörize .dt erişimi yok</div><div class="compare-item">Filtreleme ve gruplama yavaş</div><div class="compare-item">Bellek: satır başına ~50 bayt</div></div>
<div class="compare-col"><div class="compare-title">Timestamp sütun</div><div class="compare-item">dtype: datetime64[ns]</div><div class="compare-item">Ardışık int64 dizisi olarak saklanır</div><div class="compare-item">Sıralama matematiksel (her zaman doğru)</div><div class="compare-item">Tam .dt erişimi: .year, .month, .hour</div><div class="compare-item">Vektörize filtre ve groupby (10-100 kat hızlı)</div><div class="compare-item">Bellek: satır başına 8 bayt</div></div>
</div>

<div class="l-warn"><strong>Tuzak:</strong> CSV'nizde karışık saat dilimleri varsa (bazıları UTC, bazıları yerel), <code>pd.to_datetime</code> sessizce saat dilimini düşürebilir veya hata fırlatabilir. Her zaman <code>df["created_at"].dt.tz</code>'yi kontrol edin ve küresel veriniz varsa ayrıştırma sırasında UTC'yi zorlamak için <code>utc=True</code> kullanın.</div>

<p class="l-text"><strong>Hızlı özet:</strong> her zaman damgası sütununu yükledikten hemen sonra <code>pd.to_datetime</code> ile dönüştürün, hız için açık <code>format=</code> tercih edin ve kirli verilere karşı dayanıklılık için <code>errors="coerce"</code> kullanın.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. pd.date_range ile DatetimeIndex Oluşturma</h2>

<p class="l-text">Bazen ham zaman damgalarınız yoktur -- bunları <em>üretmeniz</em> gerekir. Belki günlük değerlerden 365 satırlık bir DataFrame oluşturmak veya günün her dakikası için 1440 satırlık bir tablo veya iş günlerinin sabit bir programı istiyorsunuz. <code>pd.date_range()</code> eşit aralıklı zaman damgaları üretir ve sentetik zaman serisi verilerinin temelidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Günlük, iki tarih arasında (her iki uç dahil)</span>
gunler = pd.<span class="fn">date_range</span>(start=<span class="str">"2024-01-01"</span>, end=<span class="str">"2024-01-07"</span>)

<span class="cm"># Bitiş yerine sayı belirt</span>
saatler = pd.<span class="fn">date_range</span>(start=<span class="str">"2024-03-15 09:00"</span>, periods=<span class="num">8</span>, freq=<span class="str">"h"</span>)

<span class="cm"># Yalnızca iş günleri (hafta sonları atlanır)</span>
isgunleri = pd.<span class="fn">date_range</span>(start=<span class="str">"2024-01-01"</span>, periods=<span class="num">10</span>, freq=<span class="str">"B"</span>)

<span class="cm"># Ay sonları</span>
ay_sonlari = pd.<span class="fn">date_range</span>(start=<span class="str">"2024-01-01"</span>, end=<span class="str">"2024-12-31"</span>, freq=<span class="str">"ME"</span>)

<span class="cm"># DataFrame indeksi olarak kullan</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df = pd.<span class="fn">DataFrame</span>(
    {<span class="str">"satis"</span>: np.random.<span class="fn">randint</span>(<span class="num">50</span>, <span class="num">200</span>, size=<span class="num">30</span>)},
    index=pd.<span class="fn">date_range</span>(<span class="str">"2024-03-01"</span>, periods=<span class="num">30</span>, freq=<span class="str">"D"</span>)
)
<span class="fn">print</span>(df.<span class="fn">head</span>())

<span class="cm"># Kısmi string ile dilimleme -- süper güçlü</span>
<span class="fn">print</span>(df.loc[<span class="str">"2024-03-15"</span>:<span class="str">"2024-03-20"</span>])</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) İki uç nokta arasında günlük indeks üretir (her iki uç dahil, Python'un <code>range()</code>'ından farklı). 2) Sabit bir noktadan başlayarak <code>periods=</code> kullanarak 8 saatlik zaman damgası üretir. 3) <code>freq="B"</code> iş günleri için hafta sonlarını otomatik atlar -- finans verisi için kritik. 4) <code>freq="ME"</code> ile ay-sonu zaman damgaları üretir -- her giriş bir ayın son günüdür, artık yıl hesaplanır. 5) Üretilen indeksi DataFrame'e bağlar, onu uygun bir zaman serisine çevirir. 6) Kısmi string dilimlemesini gösterir: <code>df.loc["2024-03-15":"2024-03-20"]</code> çalışır çünkü Pandas indeksin DatetimeIndex olduğunu anlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">D / B</div><div class="card-body">D = takvim günü. B = iş günü (Pzt-Cum). Hisse için B, sensör için D.</div></div>
<div class="calc-card"><div class="card-title">h / min / s</div><div class="card-body">Saat, dakika, saniye. <code>freq="15min"</code> 15 dakikalık aralıklar verir -- IoT'de yaygın.</div></div>
<div class="calc-card"><div class="card-title">W / W-MON</div><div class="card-body">Haftalık. Varsayılan Pazar biter. <code>W-MON</code> Pazartesi biten haftalar.</div></div>
<div class="calc-card"><div class="card-title">ME / MS</div><div class="card-body">Ay Sonu vs Ay Başı. ME 31 Oca, 29 Şub, ... ; MS 1 Oca, 1 Şub, ... .</div></div>
<div class="calc-card"><div class="card-title">QE / QS</div><div class="card-body">Çeyrek Son/Baş. Standart mali çeyrekler Mar/Haz/Eyl/Ara biter.</div></div>
<div class="calc-card"><div class="card-title">YE / YS</div><div class="card-body">Yıl Son/Baş. Yıllık raporlar ve yıllık toplamlar için faydalı.</div></div>
</div>

<div id="plot-l7-daterange-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Görselin işaret ettiği:</strong> <code>pd.date_range</code> ile rastgele tam sayılar kullanılarak üretilen 30 günlük sentetik bir günlük satış zaman serisi. Yatay eksen DatetimeIndex; dikey eksen satış sayısıdır. Dikkat edin: x ekseni otomatik olarak tarih biçiminde -- bu, düz tam sayı indeksi ile gerçekleşmezdi.</div>

<div class="l-note"><strong>Period vs Timestamp:</strong> <code>pd.date_range</code> nokta-zaman damgaları üretir. Aralıklar (tüm bir ay, tüm bir çeyrek) istiyorsanız <code>pd.period_range</code> kullanın -- her giriş bir aralığı temsil eden bir <code>PeriodIndex</code> döner; muhasebe ve raporlama için faydalıdır.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. .dt Erişimcisi: Zaman Özelliklerini Çıkarma</h2>

<p class="l-text">Sütununuz uygun bir tarih olduğunda, <code>.dt</code> erişimcisi zamana dayalı özelliklerin tüm bir dünyasını açar. Bunlar ML için temeldir: <strong>günün saati, haftanın günü, hafta sonu mu, çeyrek, beri geçen gün</strong> -- ML modellerinin doğrudan kullanabileceği yaygın tahmin ediciler.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Duygu analizi için tweet zaman damgaları</span>
tweetler = pd.<span class="fn">DataFrame</span>({
    <span class="str">"metin"</span>: [<span class="str">"Harika hizmet!"</span>, <span class="str">"Berbat ürün"</span>, <span class="str">"Çok beğendim"</span>,
              <span class="str">"Hayal kırıklığı"</span>, <span class="str">"En iyisi"</span>, <span class="str">"İdare eder"</span>, <span class="str">"Mükemmel!"</span>],
    <span class="str">"olusturulma"</span>: pd.<span class="fn">to_datetime</span>([
        <span class="str">"2024-03-15 14:32:08"</span>, <span class="str">"2024-03-16 09:15:22"</span>,
        <span class="str">"2024-03-16 22:48:01"</span>, <span class="str">"2024-03-17 11:03:55"</span>,
        <span class="str">"2024-03-18 19:27:13"</span>, <span class="str">"2024-03-19 02:11:44"</span>,
        <span class="str">"2024-03-20 16:55:30"</span>
    ]),
    <span class="str">"etiket"</span>: [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>]
})

<span class="cm"># .dt bileşenleri datetime Series'inden çıkarır</span>
tweetler[<span class="str">"yil"</span>]         = tweetler[<span class="str">"olusturulma"</span>].dt.year
tweetler[<span class="str">"ay"</span>]          = tweetler[<span class="str">"olusturulma"</span>].dt.month
tweetler[<span class="str">"gun"</span>]         = tweetler[<span class="str">"olusturulma"</span>].dt.day
tweetler[<span class="str">"saat"</span>]        = tweetler[<span class="str">"olusturulma"</span>].dt.hour
tweetler[<span class="str">"haftanin_gunu"</span>] = tweetler[<span class="str">"olusturulma"</span>].dt.dayofweek    <span class="cm"># 0=Pzt, 6=Paz</span>
tweetler[<span class="str">"gun_adi"</span>]     = tweetler[<span class="str">"olusturulma"</span>].dt.<span class="fn">day_name</span>()
tweetler[<span class="str">"ceyrek"</span>]      = tweetler[<span class="str">"olusturulma"</span>].dt.quarter
tweetler[<span class="str">"hafta_sonu"</span>]  = tweetler[<span class="str">"olusturulma"</span>].dt.dayofweek &gt;= <span class="num">5</span>
tweetler[<span class="str">"ay_sonu_mu"</span>]  = tweetler[<span class="str">"olusturulma"</span>].dt.is_month_end

<span class="cm"># Davranışsal özellikler için günün saat dilimleri</span>
<span class="kw">def</span> <span class="fn">saat_dilimi</span>(s):
    <span class="kw">if</span> s &lt; <span class="num">6</span>:  <span class="kw">return</span> <span class="str">"gece"</span>
    <span class="kw">if</span> s &lt; <span class="num">12</span>: <span class="kw">return</span> <span class="str">"sabah"</span>
    <span class="kw">if</span> s &lt; <span class="num">18</span>: <span class="kw">return</span> <span class="str">"ogleden_sonra"</span>
    <span class="kw">return</span> <span class="str">"aksam"</span>

tweetler[<span class="str">"dilim"</span>] = tweetler[<span class="str">"saat"</span>].<span class="fn">apply</span>(saat_dilimi)

<span class="fn">print</span>(tweetler[[<span class="str">"olusturulma"</span>, <span class="str">"saat"</span>, <span class="str">"gun_adi"</span>, <span class="str">"hafta_sonu"</span>, <span class="str">"dilim"</span>]])</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Ayrıştırılmış zaman damgaları ve ikili duygu etiketleri olan sahte bir tweet DataFrame'i oluşturur. 2) <code>.dt.year, .dt.month, .dt.day</code> takvim bileşenlerini çıkarır -- vektörize, döngü yok. 3) <code>.dt.hour</code> saati alır (0-23), "akşam kullanıcıları daha aksi" hipotezleri için faydalı. 4) <code>.dt.dayofweek</code> Pazartesi için 0, Pazar için 6 döner -- tam sayı temiz bir ML özelliğidir. 5) <code>.dt.day_name()</code> insan tarafından okunabilir stringler döner, grafikler için iyidir. 6) <code>.dt.is_weekend</code> sadece <code>dayofweek &gt;= 5</code>'tir, ama okunaklıdır. 7) <code>.dt.is_month_end</code> ay-sonu raporlama etkileri için faydalı bir booleandır. 8) Özel <code>saat_dilimi</code> fonksiyonu saatleri adlandırılmış dönemlere çevirir -- ağaç modelleri için genellikle ham saatten daha iyi çalışan kategorik bir özellik.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.dt.year / .dt.month / .dt.day</div><div class="card-body">Tam sayı olarak takvim bileşenleri. Trend özellikleri ve takvim tabanlı gruplama için kullanın.</div></div>
<div class="calc-card"><div class="card-title">.dt.hour / .dt.minute / .dt.second</div><div class="card-body">Günün saati bileşenleri. <code>.dt.hour</code> en yaygın özellik -- yoğun saat ve gece geç saat örüntülerini yakalar.</div></div>
<div class="calc-card"><div class="card-title">.dt.dayofweek</div><div class="card-body">0=Pazartesi, 6=Pazar. Döngüseldir, doğrusal modeller için sin/cos olarak kodlamak isteyebilirsiniz.</div></div>
<div class="calc-card"><div class="card-title">.dt.dayofyear</div><div class="card-body">1-366. Perakende veya hava verisinde yıllık mevsimsellik özellikleri için faydalı.</div></div>
<div class="calc-card"><div class="card-title">.dt.is_month_end</div><div class="card-body">Boolean. Maaş günleri, faturalama döngüleri ve raporlama son tarihleri sıklıkla ay sonunda toplanır.</div></div>
<div class="calc-card"><div class="card-title">.dt.normalize()</div><div class="card-body">Saat bileşenini sıyır, yalnızca tarihi tut (saati 00:00:00 yapar). Günlük groupby için faydalı.</div></div>
</div>

<div id="plot-l7-hourdist-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> <code>.dt.hour</code> ile hesaplanan, günün saatine göre tweet zaman damgaları dağılımı. Sabah 9 ve akşam 8'deki zirveler tipik işe gidip gelme ve akşam boş zaman pencereleridir -- tam da uygun datetime ayrıştırması olmadan göremeyeceğiniz türden bir örüntü. Duygu analizi için günün saati genellikle ilk 3 tahmin ediciden biridir: gece geç saatte yapılan paylaşımlar negatif eğilimlidir.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP özellik mühendisliği</div><div class="example-body">Müşteri yorumları üzerinde duygu sınıflandırıcısı eğittiğinizi varsayın. Metnin ötesinde, zaman damgası size ücretsiz özellikler verir: <code>saat</code>, <code>hafta_sonu</code>, <code>tatil_mi</code>, <code>kayittan_beri_gun</code>. Gerçek karşılaştırmalarda, bu zamansal özellikleri eklemek sıfır ek etiketleme maliyetiyle 1-3 puan doğruluk ekler. <code>.dt</code> erişimcisi bunun kapısıdır.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Yeniden Örnekleme: Frekans Değiştirme</h2>

<p class="l-text">Dakika seviyesinde sensör veriniz var ama saatlik ortalamalar istiyorsunuz. Günlük satışlarınız var ama aylık toplamlar istiyorsunuz. Düzensiz olay zaman damgalarınız var ama tek tip günlük sayım istiyorsunuz. <code>df.resample()</code> cevaptır -- zaman serisi için <code>groupby</code> gibidir, gruplar zaman kovalarıdır.</p>

<div class="calc-highlight"><strong>İki yön:</strong> <em>Aşağı örnekleme</em> = ince'den kabaya gitmek (dakika -&gt; saat, gün -&gt; ay). Toplulaştırırsınız (ortalama, toplam, max). <em>Yukarı örnekleme</em> = kabadan inceye gitmek (ay -&gt; gün). Doldurursunuz (ileri doldurma, interpolasyon).</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Bir yıl için günlük trafik verisi</span>
np.random.<span class="fn">seed</span>(<span class="num">42</span>)
idx = pd.<span class="fn">date_range</span>(<span class="str">"2024-01-01"</span>, <span class="str">"2024-12-31"</span>, freq=<span class="str">"D"</span>)
trend = np.<span class="fn">linspace</span>(<span class="num">100</span>, <span class="num">180</span>, <span class="fn">len</span>(idx))
mevsim = <span class="num">30</span> * np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * np.<span class="fn">arange</span>(<span class="fn">len</span>(idx)) / <span class="num">7</span>)
gurultu = np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">15</span>, <span class="fn">len</span>(idx))
df = pd.<span class="fn">DataFrame</span>({<span class="str">"ziyaret"</span>: trend + mevsim + gurultu}, index=idx)

<span class="cm"># AŞAĞI ÖRNEKLEME: günlük -&gt; aylık ortalama</span>
aylik = df.<span class="fn">resample</span>(<span class="str">"ME"</span>).<span class="fn">mean</span>()

<span class="cm"># Aynı anda birden fazla toplulaştırma</span>
aylik_genis = df.<span class="fn">resample</span>(<span class="str">"ME"</span>).<span class="fn">agg</span>([<span class="str">"mean"</span>, <span class="str">"sum"</span>, <span class="str">"min"</span>, <span class="str">"max"</span>, <span class="str">"std"</span>])

<span class="cm"># OHLC -- finans için yaygın (open/high/low/close)</span>
ohlc = df.<span class="fn">resample</span>(<span class="str">"ME"</span>)[<span class="str">"ziyaret"</span>].<span class="fn">ohlc</span>()

<span class="cm"># Haftalık iş toplamı</span>
haftalik_toplam = df.<span class="fn">resample</span>(<span class="str">"W"</span>).<span class="fn">sum</span>()

<span class="cm"># YUKARI ÖRNEKLEME: günlük -&gt; saatlik, ileri doldurma</span>
alt = df.iloc[:<span class="num">5</span>]
saatlik_ffill = alt.<span class="fn">resample</span>(<span class="str">"h"</span>).<span class="fn">ffill</span>()
saatlik_interp = alt.<span class="fn">resample</span>(<span class="str">"h"</span>).<span class="fn">interpolate</span>(method=<span class="str">"linear"</span>)</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Üç bileşenli sentetik bir günlük seri kurar: doğrusal trend (yıl boyunca 100'den 180'e), haftalık sinüs dalgası (Pzt-Paz ritmini yakalar) ve Gaussian gürültü. 2) <code>resample("ME").mean()</code> ay-sonuna göre gruplar ve ortalar -- bu aşağı örnekleme: 365 günlük nokta 12 aylık ortalama olur. 3) <code>.agg(["mean", "sum", ...])</code> aynı anda birden fazla istatistik hesaplar, çok seviyeli sütunlu geniş bir DataFrame döndürür. 4) <code>.ohlc()</code> kova başına açılış/yüksek/düşük/kapanış döndürür -- standart finans özeti. 5) Haftalık toplam 7 günlük ziyareti hafta başına tek bir sayıya toplar. 6) Yukarı örnekleme 5 günlük satırı 5*24=120 saatlik satıra genişletir; <code>ffill</code> son bilinen değeri tekrarlar, <code>interpolate</code> bilinen noktalar arasında düz çizgiler çizer.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Aşağı örnekleme</div><div class="compare-item">İnce'den kabaya (1dk -&gt; 1s)</div><div class="compare-item">Bilgi kaybı beklenir</div><div class="compare-item">mean, sum, max, std, count kullanın</div><div class="compare-item">Daha az satır, daha az gürültü</div><div class="compare-item">Grafikleme ve raporlama için yaygın</div></div>
<div class="compare-col"><div class="compare-title">Yukarı örnekleme</div><div class="compare-item">Kabadan inceye (1g -&gt; 1s)</div><div class="compare-item">Yeni bilgi yok -- yalnızca doldurma</div><div class="compare-item">ffill, bfill, interpolate kullanın</div><div class="compare-item">Daha çok satır, sıklıkla bias getirir</div><div class="compare-item">Çoklu kaynak verisini hizalama için yaygın</div></div>
</div>

<div id="plot-l7-resample-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> Ham günlük ziyaretler (açık çizgi, gürültülü) ile aylık ortalama yeniden örnekleme (kalın altın çizgi). Aylık ortalama günlük gürültüyü yumuşatır ve ham veride zor görülen altta yatan yukarı trendi (100'den 180'e) ortaya çıkarır. İşte bu yüzden analistler dashboardlarda ham günlük seriyi değil aylık toplamları çizer -- insanlar 365 gürültülü noktayı okuyamaz ama 12 düz noktayı okuyabilir.</div>

<div class="l-warn"><strong>Tuzak:</strong> <code>.mean()</code> ile daha kaba bir frekansa yeniden örneklediğinizde, eksik günler sessizce yakın günlerin değeri olarak ele alınır. Boşluklarınız varsa ve önemsiyorsanız, her kovaya kaç orijinal nokta gittiğini görmek için <code>.count()</code> veya <code>df.resample("D").size()</code> kullanın.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Kayan ve Genişleyen Pencereler</h2>

<p class="l-text">Bazen ay başına bir sayı istemezsiniz; orijinal frekansta orijinal serinin <em>düzleştirilmiş</em> bir versiyonunu istersiniz. Kayan pencereler bunu yapar: her t zaman damgasında, geriye w gün bakın ve bir istatistik hesaplayın. Sonuç girdiyle aynı uzunluktadır ama daha düzgündür.</p>

<div class="katex-block">$$\\bar{x}_t^{(w)} = \\frac{1}{w}\\sum_{i=t-w+1}^{t} x_i$$</div>

<p class="l-text">Bu, w pencere boyutuyla <strong>basit hareketli ortalama</strong>'dır. Her çıktı noktası en son w girdinin ağırlıksız ortalamasıdır. Üstel ağırlıklı hareketli ortalama (EWM) son noktalara daha fazla ağırlık verir:</p>

<div class="katex-block">$$\\bar{x}_t = \\alpha \\, x_t + (1-\\alpha)\\,\\bar{x}_{t-1}, \\quad \\alpha = \\frac{2}{w+1}$$</div>

<p class="l-text">EWM'in sert kesimi yoktur -- eski veri üstel olarak solar, asla tamamen unutulmaz. Basit kayan ortalamadan değişikliklere daha hızlı tepki verir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
idx = pd.<span class="fn">date_range</span>(<span class="str">"2024-01-01"</span>, periods=<span class="num">120</span>, freq=<span class="str">"D"</span>)
df = pd.<span class="fn">DataFrame</span>({<span class="str">"fiyat"</span>: <span class="num">100</span> + np.<span class="fn">cumsum</span>(np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">2</span>, <span class="num">120</span>))}, index=idx)

<span class="cm"># Basit kayan ortalama -- 7 gün ve 30 gün</span>
df[<span class="str">"ma_7"</span>]  = df[<span class="str">"fiyat"</span>].<span class="fn">rolling</span>(window=<span class="num">7</span>).<span class="fn">mean</span>()
df[<span class="str">"ma_30"</span>] = df[<span class="str">"fiyat"</span>].<span class="fn">rolling</span>(window=<span class="num">30</span>).<span class="fn">mean</span>()

<span class="cm"># Kayan standart sapma -- volatilite vekili</span>
df[<span class="str">"std_30"</span>] = df[<span class="str">"fiyat"</span>].<span class="fn">rolling</span>(window=<span class="num">30</span>).<span class="fn">std</span>()

<span class="cm"># Üstel ağırlıklı -- span alpha'yı kontrol eder</span>
df[<span class="str">"ewm_7"</span>] = df[<span class="str">"fiyat"</span>].<span class="fn">ewm</span>(span=<span class="num">7</span>, adjust=<span class="kw">False</span>).<span class="fn">mean</span>()

<span class="cm"># .apply ile özel fonksiyon</span>
df[<span class="str">"max_7"</span>] = df[<span class="str">"fiyat"</span>].<span class="fn">rolling</span>(window=<span class="num">7</span>).<span class="fn">apply</span>(np.<span class="ty">max</span>, raw=<span class="kw">True</span>)

<span class="cm"># min_periods -- hesaplamadan önce kaç gerçek değer gerekli</span>
df[<span class="str">"ma_7_kati"</span>] = df[<span class="str">"fiyat"</span>].<span class="fn">rolling</span>(window=<span class="num">7</span>, min_periods=<span class="num">7</span>).<span class="fn">mean</span>()

<span class="cm"># Genişleyen pencere -- baştan büyür (kümülatif ortalama)</span>
df[<span class="str">"genisleyen"</span>] = df[<span class="str">"fiyat"</span>].<span class="fn">expanding</span>().<span class="fn">mean</span>()</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) 100'den başlayan 120 günlük rastgele yürüyüş oluşturur -- günlük fiyatları taklit eden gürültülü ama trendli bir seri. 2) <code>rolling(window=7).mean()</code> 7 günlük basit hareketli ortalamayı hesaplar; ilk 6 satır NaN'dır çünkü yeterli önceki nokta yoktur. 3) 30 günlük MA çok daha düzgündür -- daha büyük pencere = daha çok toplulaştırma = daha az gürültü. 4) <code>rolling(window=30).std()</code> volatiliteyi ölçer: yüksek std seri o 30 günlük pencerede sıçrayıcı demektir. 5) <code>ewm(span=7).mean()</code> üstel ağırlıklı versiyondur; <code>span</code> o boyutta bir pencereye yaklaşır ama düz bozulma ile. 6) <code>.apply(np.max, raw=True)</code> her fonksiyonu takabileceğinizi gösterir -- burada kayan pencere içindeki max'ı döner. 7) <code>min_periods=7</code> katı uygulamayı zorlar: tam 7 gerçek değer mevcut olana kadar NaN. 8) <code>expanding()</code> "sonsuz pencere kayan"dır -- her çıktı tüm <em>önceki</em> değerlerin ortalamasıdır, böylece global ortalamaya yakınsar.</p>

<div id="plot-l7-rolling-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu görselin söylediği:</strong> Üst üste üç iz -- ham gürültülü günlük fiyat (soluk), 7 günlük kayan ortalama (orta düzleştirme) ve 30 günlük kayan ortalama (ağır düzleştirme). Pencere büyüdükçe iz daha düzgün olur ama ani değişikliklerin gerisinde kalır. Bu, zaman serisi düzleştirmesinin temel ödünleşmesidir: küçük pencere = daha duyarlı ama gürültülü; büyük pencere = stabil ama yavaş tepki. EWM size her ikisini de vermeye çalışır, son noktalara daha fazla ağırlık vererek.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.rolling(w).mean()</div><div class="card-body">Basit hareketli ortalama. Son w noktaya eşit ağırlık, sonra onları tamamen düşürür.</div></div>
<div class="calc-card"><div class="card-title">.rolling(w).std()</div><div class="card-body">Kayan standart sapma. Volatilite olarak ve Bollinger Bantları girdisi olarak kullanılır.</div></div>
<div class="calc-card"><div class="card-title">.ewm(span=w).mean()</div><div class="card-body">Üstel ağırlıklı MA. Yumuşak solma, son değişikliklere daha duyarlı.</div></div>
<div class="calc-card"><div class="card-title">.rolling(w).apply(fn)</div><div class="card-body">Herhangi bir fonksiyon takın -- medyan, IQR, özel mantık. Daha yavaş ama esnek.</div></div>
<div class="calc-card"><div class="card-title">.expanding().mean()</div><div class="card-body">Baştan kümülatif ortalama. Zamanla global ortalamaya yakınsar.</div></div>
<div class="calc-card"><div class="card-title">center=True</div><div class="card-body">Varsayılan olarak kayan pencere sağa hizalıdır (yalnızca geçmişi kullanır). <code>center=True</code> ortalar -- ama gelecek değerleri kullanır, tahmin için ASLA kullanmayın.</div></div>
</div>

<div class="l-warn"><strong>Tuzak (veri sızıntısı):</strong> Bir tahmin modeli için özellikler oluşturuyorsanız, ASLA <code>center=True</code> veya gelecek değerleri içeren herhangi bir kayan kullanmayın. Üretimde kaybolan harika backtest sonuçları alırsınız. Her zaman sağa hizalı (varsayılan) kullanın, böylece t zamanındaki özellik yalnızca &lt;= t zamanlarına bağlıdır.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Lag Özellikleri ve Diferansiyasyon</h2>

<p class="l-text">ML tahmini için, en güçlü özellikler genellikle geçmiş değerlerin kendisidir: dünün değeri, geçen haftanın değeri, geçen ayın değeri. <code>.shift()</code> bunları doğrudan verir. <code>.diff()</code> ve <code>.pct_change()</code> dönem-üstüne-dönem değişiklikleri verir -- genellikle daha durağan ve modeller için daha kolay.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

idx = pd.<span class="fn">date_range</span>(<span class="str">"2024-01-01"</span>, periods=<span class="num">10</span>, freq=<span class="str">"D"</span>)
df = pd.<span class="fn">DataFrame</span>({<span class="str">"satis"</span>: [<span class="num">100</span>, <span class="num">110</span>, <span class="num">105</span>, <span class="num">120</span>, <span class="num">130</span>, <span class="num">125</span>, <span class="num">140</span>, <span class="num">150</span>, <span class="num">145</span>, <span class="num">160</span>]}, index=idx)

<span class="cm"># shift(n) -- değerleri AŞAĞI kaydır (lag)</span>
df[<span class="str">"satis_lag_1"</span>] = df[<span class="str">"satis"</span>].<span class="fn">shift</span>(<span class="num">1</span>)   <span class="cm"># dünün değeri</span>
df[<span class="str">"satis_lag_7"</span>] = df[<span class="str">"satis"</span>].<span class="fn">shift</span>(<span class="num">7</span>)   <span class="cm"># bir hafta önce</span>

<span class="cm"># shift(-n) -- değerleri YUKARI kaydır (geleceğe bak, yalnızca etiket için)</span>
df[<span class="str">"satis_yarin"</span>] = df[<span class="str">"satis"</span>].<span class="fn">shift</span>(-<span class="num">1</span>)

<span class="cm"># diff -- ardışık değerler arasındaki fark</span>
df[<span class="str">"delta_1"</span>] = df[<span class="str">"satis"</span>].<span class="fn">diff</span>(<span class="num">1</span>)        <span class="cm"># x_t - x_(t-1)</span>
df[<span class="str">"delta_7"</span>] = df[<span class="str">"satis"</span>].<span class="fn">diff</span>(<span class="num">7</span>)        <span class="cm"># x_t - x_(t-7)</span>

<span class="cm"># pct_change -- göreceli değişim (durağan olmayan seriler için iyi)</span>
df[<span class="str">"yuzde"</span>] = df[<span class="str">"satis"</span>].<span class="fn">pct_change</span>(<span class="num">1</span>) * <span class="num">100</span>

<span class="cm"># ML modeli için tam özellik seti oluştur</span>
ozellikler = pd.<span class="fn">DataFrame</span>(index=df.index)
ozellikler[<span class="str">"lag_1"</span>]    = df[<span class="str">"satis"</span>].<span class="fn">shift</span>(<span class="num">1</span>)
ozellikler[<span class="str">"lag_7"</span>]    = df[<span class="str">"satis"</span>].<span class="fn">shift</span>(<span class="num">7</span>)
ozellikler[<span class="str">"roll_7"</span>]   = df[<span class="str">"satis"</span>].<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">7</span>).<span class="fn">mean</span>()    <span class="cm"># geçmiş-yalnız kayan</span>
ozellikler[<span class="str">"delta_1"</span>]  = df[<span class="str">"satis"</span>].<span class="fn">diff</span>(<span class="num">1</span>)
ozellikler[<span class="str">"hedef"</span>]    = df[<span class="str">"satis"</span>]</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Temel olarak 10 günlük bir satış DataFrame'i oluşturur. 2) <code>shift(1)</code> her satırı önceki satırın değeriyle hizalar -- t günü için sonuç t-1 gününün satışıdır. İlk satır NaN olur çünkü öncesi yoktur. 3) <code>shift(7)</code> bir hafta önceki değeri verir; haftalık mevsimsellik olduğunda faydalıdır. 4) <code>shift(-1)</code> ters yönde kayar -- bu <em>hedefler</em> oluşturmak içindir ("bugünkü özelliklerle yarını tahmin et"), ASLA girdi özellikleri için değil. 5) <code>diff(1)</code> = <code>x_t - x_{t-1}</code> -- gün-üzeri-gün değişim. 6) <code>pct_change()</code> göreceli değişimi yüzde olarak verir. 7) Son <code>ozellikler</code> DataFrame'i lag'leri, <em>kaydırılmış değerler üzerinde hesaplanan</em> bir kayan pencereyi (hareketli-ortalama özelliği oluşturmanın sızıntısız yolu budur) ve hedefi birleştirir. Kritik olarak, <code>shift(1).rolling(7).mean()</code> önce kaydırır sonra kayan ortalamaya alır, böylece t. özellik yalnızca t-7'den t-1'e kadar olan günleri kullanır.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: Satış tahmin özellik matrisi</div><div class="example-body"><strong>Hedef:</strong> geçmişe göre yarınki satışı tahmin et. <strong>Özellikler (hepsi sızıntısız):</strong> <code>lag_1</code> (dün), <code>lag_7</code> (geçen hafta aynı gün), <code>lag_30</code> (geçen ay aynı gün), <code>roll_7</code> (geçen haftanın ortalaması), <code>roll_30</code> (geçen ayın ortalaması), <code>delta_1</code> (dünün değişimi), <code>haftanin_gunu</code>, <code>hafta_sonu</code>, <code>tatil_mi</code>. <strong>Hedef:</strong> satışın <code>shift(-1)</code>'i. Bunlar üzerine bir gradient-boost modeli eğitin ve 30 satır Pandas ile rekabetçi bir baseline tahminciniz olur.</div></div>

<div id="plot-l7-lag-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu görselin söylediği:</strong> Satış vs lag-1 satış saçılım grafiği (her nokta bir gün). Güçlü diyagonal örüntü yüksek oto-korelasyonu ortaya çıkarır -- bugünün satışları dünüye çok benzer. Bu görsel oto-regresif modellerin temelidir: saçılım diyagonal etrafında sıkıysa, basit bir "dünün değerini tahmin et" baseline'ı (kalıcılık tahmini) yenmek zordur.</div>

<div class="l-note"><strong>Durağanlık için diferansiyasyon:</strong> Çoğu ML modeli girdinin durağan olduğunu varsayar (sabit ortalama ve varyans). Hisse fiyatları gibi trendli bir seri durağan değildir, ama ilk farkı (<code>diff(1)</code>) genellikle durağandır. Modelleri yerleştirmeden önce kontrol etmek için her zaman fark alınmış seriyi çizin.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Saat Dilimleri ve Gerçek Bir Pipeline</h2>

<p class="l-text">Verileriniz birden fazla bölgeden (sunucular, kullanıcılar, kaynaklar) geliyorsa, saat dilimleri kaçınılmaz olur. Pandas bunları açıkça <code>tz_localize</code> (naive zaman damgalarına saat dilimi ekle) ve <code>tz_convert</code> (farklı bir saat dilimine dönüştür) ile ele alır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Naive zaman damgaları -- saat dilimi bilgisi yok</span>
naive = pd.<span class="fn">to_datetime</span>([<span class="str">"2024-03-15 14:00"</span>, <span class="str">"2024-03-15 15:00"</span>])
<span class="fn">print</span>(naive.tz)   <span class="cm"># None</span>

<span class="cm"># Localize -- saat dilimi ekle (duvar saatini DEĞİŞTİRMEZ)</span>
utc = naive.<span class="fn">tz_localize</span>(<span class="str">"UTC"</span>)

<span class="cm"># Convert -- başka saat dilimine kaydır (duvar saati değişir, an aynı kalır)</span>
istanbul = utc.<span class="fn">tz_convert</span>(<span class="str">"Europe/Istanbul"</span>)
<span class="fn">print</span>(istanbul)
<span class="cm"># 2024-03-15 17:00:00+03:00, ...</span>

<span class="cm"># tz'yi sıyır</span>
naive_geri = istanbul.<span class="fn">tz_localize</span>(<span class="kw">None</span>)</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) İki stringi naive zaman damgalarına ayrıştırır -- <code>.tz</code> None'dur, Pandas saat dilimini bilmez. 2) <code>tz_localize("UTC")</code> "bunlar UTC zamanları" der; duvar saati sayıları değişmez ama saat dilimi şimdi eklidir. 3) <code>tz_convert("Europe/Istanbul")</code> UTC anını alır ve Istanbul saatinde yeniden ifade eder -- 14:00 UTC, Istanbul'da 17:00 olur. Altta yatan an değişmemiştir. 4) <code>tz_localize(None)</code> saat dilimini tekrar sıyırır, yerel duvar saatini naive zaman damgası olarak bırakır.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">tz_localize</div><div class="compare-item">Naive zaman damgalarına saat dilimi ekler</div><div class="compare-item">Duvar saati sayıları aynı kalır</div><div class="compare-item">Bilinen TZ ile CSV ayrıştırma sonrası kullanın</div><div class="compare-item">Zaten localize edilmişse hata verir</div></div>
<div class="compare-col"><div class="compare-title">tz_convert</div><div class="compare-item">Saat dilimleri arasında dönüştürür</div><div class="compare-item">Duvar saati değişir, an aynı kalır</div><div class="compare-item">Çok bölgeli veriyi hizalamak için kullanın</div><div class="compare-item">Henüz localize EDİLMEMİŞSE hata verir</div></div>
</div>

<p class="l-text"><strong>Hepsini birleştirme -- gerçekçi bir NLP/log pipeline'ı:</strong></p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Adım 1: ham logu yükle</span>
<span class="cm"># logs.csv: ts (string), user_id, event, sentiment_score</span>
df = pd.<span class="fn">read_csv</span>(<span class="str">"logs.csv"</span>)

<span class="cm"># Adım 2: zaman damgası sütununu ayrıştır</span>
df[<span class="str">"ts"</span>] = pd.<span class="fn">to_datetime</span>(df[<span class="str">"ts"</span>], errors=<span class="str">"coerce"</span>, utc=<span class="kw">True</span>)
df = df.<span class="fn">dropna</span>(subset=[<span class="str">"ts"</span>])
df[<span class="str">"ts_yerel"</span>] = df[<span class="str">"ts"</span>].dt.<span class="fn">tz_convert</span>(<span class="str">"Europe/Istanbul"</span>)

<span class="cm"># Adım 3: zaman damgasını indeks yap (resample/rolling için şart)</span>
df = df.<span class="fn">set_index</span>(<span class="str">"ts_yerel"</span>).<span class="fn">sort_index</span>()

<span class="cm"># Adım 4: takvim özelliklerini çıkar</span>
df[<span class="str">"saat"</span>]         = df.index.hour
df[<span class="str">"haftanin_gunu"</span>] = df.index.dayofweek
df[<span class="str">"hafta_sonu"</span>]   = df[<span class="str">"haftanin_gunu"</span>] &gt;= <span class="num">5</span>

<span class="cm"># Adım 5: günlük kullanıcı seviyesi istatistiklere toplulaştır</span>
gunluk = (
    df.<span class="fn">groupby</span>([pd.<span class="fn">Grouper</span>(freq=<span class="str">"D"</span>), <span class="str">"user_id"</span>])
      .<span class="fn">agg</span>(olay=(<span class="str">"event"</span>, <span class="str">"count"</span>),
           ort_duygu=(<span class="str">"sentiment_score"</span>, <span class="str">"mean"</span>))
      .<span class="fn">reset_index</span>()
)

<span class="cm"># Adım 6: kullanıcı başına kayan özellikler oluştur</span>
gunluk = gunluk.<span class="fn">sort_values</span>([<span class="str">"user_id"</span>, <span class="str">"ts_yerel"</span>])
gunluk[<span class="str">"duygu_ma_7"</span>] = (gunluk.<span class="fn">groupby</span>(<span class="str">"user_id"</span>)[<span class="str">"ort_duygu"</span>]
                              .<span class="fn">transform</span>(<span class="kw">lambda</span> s: s.<span class="fn">shift</span>(<span class="num">1</span>).<span class="fn">rolling</span>(<span class="num">7</span>).<span class="fn">mean</span>()))
gunluk[<span class="str">"olay_lag_1"</span>] = gunluk.<span class="fn">groupby</span>(<span class="str">"user_id"</span>)[<span class="str">"olay"</span>].<span class="fn">shift</span>(<span class="num">1</span>)

<span class="cm"># Adım 7: yeterli geçmişi olan kullanıcılara filtrele, ML için hazır</span>
hazir = gunluk.<span class="fn">dropna</span>(subset=[<span class="str">"duygu_ma_7"</span>, <span class="str">"olay_lag_1"</span>])</code></pre></div>

<p class="l-text"><strong>Bu pipeline adım adım ne yapar:</strong> 1) String zaman damgaları ve olay başına duygu skorları içeren ham bir CSV yükler (tipik NLP+log karışımı). 2) Zaman damgalarını UTC'ye ayrıştırır, ayrıştırılamayan satırları düşürür, böylece pipeline'ın geri kalanı güvenlidir. 3) İnsan tarafından okunabilir analiz için yerel-zaman sütunu ekler, UTC'yi de korur. 4) Zaman damgasını indeks yapar ve sıralar -- hem resample hem zaman tabanlı dilimleme için ön koşul. 5) İndeksin <code>.hour</code>, <code>.dayofweek</code> niteliklerini kullanarak takvim özelliklerini (saat, haftanın günü, hafta sonu bayrağı) çıkarır. 6) <code>pd.Grouper(freq="D")</code> kullanarak (gün, kullanıcı) başına bir satıra toplulaştırır -- aynı anda gün ve kullanıcıya göre gruplar, olay sayısını ve ortalama duyguyu hesaplar. 7) Kullanıcıya sonra zamana göre sıralar, sonra sızıntıyı önlemek için <code>shift(1).rolling(7)</code> kullanarak <em>kullanıcı başına</em> 7 günlük kayan ortalama duygu hesaplar; <code>olay_lag_1</code> dünün sayısıdır. 8) Kayan özelliklerin NaN olduğu satırları (her kullanıcının ilk günleri) düşürür -- sonuç temiz, sızıntısız, ML için hazır bir özellik matrisidir.</p>

<div class="think-box"><div class="think-label">TEMEL ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Her zaman string zaman damgalarını <code>pd.to_datetime</code> ile <code>datetime64[ns]</code>'ye dönüştürün -- bu derste tüm diğer araçları açar.<br><strong>2.</strong> Sentetik zaman indeksleri üretmek için doğru freq kodu (D, h, B, ME, vb.) ile <code>pd.date_range</code> kullanın.<br><strong>3.</strong> <code>.dt</code> erişimcisi zaman damgalarını tek satırda ML özelliklerine çevirir: <code>.dt.hour</code>, <code>.dt.dayofweek</code>, <code>.dt.is_weekend</code>.<br><strong>4.</strong> <code>.resample</code> frekansları değiştirir; aşağı örnekleme için mean/sum, yukarı örnekleme için ffill/interpolate.<br><strong>5.</strong> Rolling ve EWM bir seriyi aynı frekansta düzleştirir. Tahmin özellikleri için sızıntıyı önlemek üzere her zaman sağa hizala (varsayılan).<br><strong>6.</strong> <code>.shift</code> lag özellikleri, <code>.diff</code> değişim özellikleri oluşturur. Kaydırılmış veride lag + rolling kombinasyonu = sızıntısız ML özellikleri.<br><strong>7.</strong> Saat dilimlerini dönüştürmeden önce localize edin. Saklama için UTC, gösterim için yerel.<br><strong>8.</strong> Gerçek bir pipeline = parse + index + resample + shift'te-rolling + dropna. Bu şekil satışlardan loglara, NLP zaman damgalarına kadar her şey için çalışır.</div></div>
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
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:50,r:30,b:50,l:60}};

  // 1. date_range demo: 30-day synthetic sales
  var el1 = document.getElementById('plot-l7-daterange-en');
  if (el1) {
    var dates = []; for (var i=0;i<30;i++){var d=new Date(2024,2,1+i);dates.push(d.toISOString().slice(0,10));}
    var sales = [194,197,114,179,71,158,165,84,189,98,176,140,193,170,154,122,182,150,108,160,175,99,168,142,121,187,103,156,178,144];
    var trace = {x:dates,y:sales,mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2},marker:{color:T.accent,size:6}};
    var layout = Object.assign({}, common, {title:{text:'30-Day Synthetic Daily Sales (DatetimeIndex)',font:{color:T.text,size:14}},xaxis:{gridcolor:T.grid,title:'Date'},yaxis:{gridcolor:T.grid,zerolinecolor:T.zero,title:'Sales'}});
    Plotly.newPlot('plot-l7-daterange-en',[trace],layout,{responsive:true,displayModeBar:false});
  }

  // 2. hour-of-day distribution
  var el2 = document.getElementById('plot-l7-hourdist-en');
  if (el2) {
    var hours = []; var counts = [3,2,2,1,1,1,2,4,7,12,10,8,9,11,9,8,9,10,11,13,12,9,6,4];
    for (var h=0;h<24;h++) hours.push(h);
    var trace = {x:hours,y:counts,type:'bar',marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Tweet Distribution by Hour of Day',font:{color:T.text,size:14}},xaxis:{title:'Hour (0-23)',gridcolor:T.grid,dtick:2},yaxis:{title:'Tweet count',gridcolor:T.grid,zerolinecolor:T.zero}});
    Plotly.newPlot('plot-l7-hourdist-en',[trace],layout,{responsive:true,displayModeBar:false});
  }

  // 3. resample comparison
  var el3 = document.getElementById('plot-l7-resample-en');
  if (el3) {
    var dates = []; for (var i=0;i<365;i++){var d=new Date(2024,0,1+i);dates.push(d.toISOString().slice(0,10));}
    var raw = []; var monthly = [];
    var seed = 42;
    function rand(){seed=(seed*9301+49297)%233280;return seed/233280;}
    for (var i=0;i<365;i++){var trend=100+(80*i/365);var season=30*Math.sin(2*Math.PI*i/7);var noise=(rand()-0.5)*30;raw.push(trend+season+noise);}
    var monthDates=[]; var monthVals=[];
    for (var m=0;m<12;m++){var dStart=new Date(2024,m,1);var dEnd=new Date(2024,m+1,0);var sum=0;var n=0;for (var i=0;i<365;i++){var di=new Date(2024,0,1+i);if(di>=dStart&&di<=dEnd){sum+=raw[i];n++;}}monthDates.push(dEnd.toISOString().slice(0,10));monthVals.push(sum/n);}
    var t1 = {x:dates,y:raw,mode:'lines',type:'scatter',name:'Raw daily',line:{color:'rgba(200,169,110,0.35)',width:1}};
    var t2 = {x:monthDates,y:monthVals,mode:'lines+markers',type:'scatter',name:'Monthly mean',line:{color:T.accent,width:3},marker:{size:8}};
    var layout = Object.assign({}, common, {title:{text:'Daily vs Monthly Resampled Visits',font:{color:T.text,size:14}},xaxis:{title:'Date',gridcolor:T.grid},yaxis:{title:'Visits',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-resample-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // 4. rolling means
  var el4 = document.getElementById('plot-l7-rolling-en');
  if (el4) {
    var dates=[]; var price=[]; var seed=7;
    function rand2(){seed=(seed*9301+49297)%233280;return seed/233280;}
    var p=100;
    for (var i=0;i<120;i++){p+=(rand2()-0.5)*4;price.push(p);var d=new Date(2024,0,1+i);dates.push(d.toISOString().slice(0,10));}
    function roll(arr,w){var out=[];for(var i=0;i<arr.length;i++){if(i<w-1){out.push(null);}else{var s=0;for(var j=i-w+1;j<=i;j++)s+=arr[j];out.push(s/w);}}return out;}
    var ma7 = roll(price,7); var ma30 = roll(price,30);
    var t1 = {x:dates,y:price,mode:'lines',type:'scatter',name:'Raw price',line:{color:'rgba(200,169,110,0.3)',width:1}};
    var t2 = {x:dates,y:ma7,mode:'lines',type:'scatter',name:'7-day MA',line:{color:'#4ecdc4',width:2}};
    var t3 = {x:dates,y:ma30,mode:'lines',type:'scatter',name:'30-day MA',line:{color:T.accent,width:3}};
    var layout = Object.assign({}, common, {title:{text:'Price with 7-day and 30-day Rolling Means',font:{color:T.text,size:14}},xaxis:{title:'Date',gridcolor:T.grid},yaxis:{title:'Price',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-rolling-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  // 5. lag scatter
  var el5 = document.getElementById('plot-l7-lag-en');
  if (el5) {
    var seed=11; function rand3(){seed=(seed*9301+49297)%233280;return seed/233280;}
    var sales=[]; var p=100; for (var i=0;i<150;i++){p+=(rand3()-0.5)*8;sales.push(p);}
    var x=[]; var y=[]; for (var i=1;i<sales.length;i++){x.push(sales[i-1]);y.push(sales[i]);}
    var t1 = {x:x,y:y,mode:'markers',type:'scatter',marker:{color:T.accent,size:6,opacity:0.6,line:{color:'rgba(255,255,255,0.2)',width:1}},name:'Sales'};
    var minV=Math.min.apply(null,x.concat(y)); var maxV=Math.max.apply(null,x.concat(y));
    var t2 = {x:[minV,maxV],y:[minV,maxV],mode:'lines',type:'scatter',line:{color:'#f87171',width:2,dash:'dash'},name:'y = x (perfect autocorr)'};
    var layout = Object.assign({}, common, {title:{text:'Sales[t] vs Sales[t-1]: autocorrelation visible',font:{color:T.text,size:14}},xaxis:{title:'Sales[t-1]',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Sales[t]',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-lag-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // TR plots (mirror)
  var el1tr = document.getElementById('plot-l7-daterange-tr');
  if (el1tr) {
    var dates = []; for (var i=0;i<30;i++){var d=new Date(2024,2,1+i);dates.push(d.toISOString().slice(0,10));}
    var sales = [194,197,114,179,71,158,165,84,189,98,176,140,193,170,154,122,182,150,108,160,175,99,168,142,121,187,103,156,178,144];
    var trace = {x:dates,y:sales,mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2},marker:{color:T.accent,size:6}};
    var layout = Object.assign({}, common, {title:{text:'30 Gunluk Sentetik Gunluk Satislar (DatetimeIndex)',font:{color:T.text,size:14}},xaxis:{gridcolor:T.grid,title:'Tarih'},yaxis:{gridcolor:T.grid,zerolinecolor:T.zero,title:'Satis'}});
    Plotly.newPlot('plot-l7-daterange-tr',[trace],layout,{responsive:true,displayModeBar:false});
  }
  var el2tr = document.getElementById('plot-l7-hourdist-tr');
  if (el2tr) {
    var hours = []; var counts = [3,2,2,1,1,1,2,4,7,12,10,8,9,11,9,8,9,10,11,13,12,9,6,4];
    for (var h=0;h<24;h++) hours.push(h);
    var trace = {x:hours,y:counts,type:'bar',marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Saate Göre Tweet Dağılımı',font:{color:T.text,size:14}},xaxis:{title:'Saat (0-23)',gridcolor:T.grid,dtick:2},yaxis:{title:'Tweet sayısı',gridcolor:T.grid,zerolinecolor:T.zero}});
    Plotly.newPlot('plot-l7-hourdist-tr',[trace],layout,{responsive:true,displayModeBar:false});
  }
  var el3tr = document.getElementById('plot-l7-resample-tr');
  if (el3tr) {
    var dates = []; for (var i=0;i<365;i++){var d=new Date(2024,0,1+i);dates.push(d.toISOString().slice(0,10));}
    var raw = [];
    var seed = 42;
    function rand(){seed=(seed*9301+49297)%233280;return seed/233280;}
    for (var i=0;i<365;i++){var trend=100+(80*i/365);var season=30*Math.sin(2*Math.PI*i/7);var noise=(rand()-0.5)*30;raw.push(trend+season+noise);}
    var monthDates=[]; var monthVals=[];
    for (var m=0;m<12;m++){var dStart=new Date(2024,m,1);var dEnd=new Date(2024,m+1,0);var sum=0;var n=0;for (var i=0;i<365;i++){var di=new Date(2024,0,1+i);if(di>=dStart&&di<=dEnd){sum+=raw[i];n++;}}monthDates.push(dEnd.toISOString().slice(0,10));monthVals.push(sum/n);}
    var t1 = {x:dates,y:raw,mode:'lines',type:'scatter',name:'Ham gunluk',line:{color:'rgba(200,169,110,0.35)',width:1}};
    var t2 = {x:monthDates,y:monthVals,mode:'lines+markers',type:'scatter',name:'Aylik ortalama',line:{color:T.accent,width:3},marker:{size:8}};
    var layout = Object.assign({}, common, {title:{text:'Günlük vs Aylık Yeniden Örneklenmiş Ziyaretler',font:{color:T.text,size:14}},xaxis:{title:'Tarih',gridcolor:T.grid},yaxis:{title:'Ziyaret',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-resample-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }
  var el4tr = document.getElementById('plot-l7-rolling-tr');
  if (el4tr) {
    var dates=[]; var price=[]; var seed=7;
    function rand2(){seed=(seed*9301+49297)%233280;return seed/233280;}
    var p=100;
    for (var i=0;i<120;i++){p+=(rand2()-0.5)*4;price.push(p);var d=new Date(2024,0,1+i);dates.push(d.toISOString().slice(0,10));}
    function roll(arr,w){var out=[];for(var i=0;i<arr.length;i++){if(i<w-1){out.push(null);}else{var s=0;for(var j=i-w+1;j<=i;j++)s+=arr[j];out.push(s/w);}}return out;}
    var ma7 = roll(price,7); var ma30 = roll(price,30);
    var t1 = {x:dates,y:price,mode:'lines',type:'scatter',name:'Ham fiyat',line:{color:'rgba(200,169,110,0.3)',width:1}};
    var t2 = {x:dates,y:ma7,mode:'lines',type:'scatter',name:'7 gunluk MA',line:{color:'#4ecdc4',width:2}};
    var t3 = {x:dates,y:ma30,mode:'lines',type:'scatter',name:'30 gunluk MA',line:{color:T.accent,width:3}};
    var layout = Object.assign({}, common, {title:{text:'7 ve 30 Gunluk Hareketli Ortalamalarla Fiyat',font:{color:T.text,size:14}},xaxis:{title:'Tarih',gridcolor:T.grid},yaxis:{title:'Fiyat',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-rolling-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
  var el5tr = document.getElementById('plot-l7-lag-tr');
  if (el5tr) {
    var seed=11; function rand3(){seed=(seed*9301+49297)%233280;return seed/233280;}
    var sales=[]; var p=100; for (var i=0;i<150;i++){p+=(rand3()-0.5)*8;sales.push(p);}
    var x=[]; var y=[]; for (var i=1;i<sales.length;i++){x.push(sales[i-1]);y.push(sales[i]);}
    var t1 = {x:x,y:y,mode:'markers',type:'scatter',marker:{color:T.accent,size:6,opacity:0.6,line:{color:'rgba(255,255,255,0.2)',width:1}},name:'Satis'};
    var minV=Math.min.apply(null,x.concat(y)); var maxV=Math.max.apply(null,x.concat(y));
    var t2 = {x:[minV,maxV],y:[minV,maxV],mode:'lines',type:'scatter',line:{color:'#f87171',width:2,dash:'dash'},name:'y = x (mukemmel oto-korelasyon)'};
    var layout = Object.assign({}, common, {title:{text:'Satış[t] vs Satış[t-1]: oto-korelasyon görünür',font:{color:T.text,size:14}},xaxis:{title:'Satis[t-1]',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Satis[t]',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-lag-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>
`
};
