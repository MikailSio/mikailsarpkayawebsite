window.PANDAS_L9 = {
en: `<p class="l-text"><strong>A MultiIndex is what you reach for when a single row label cannot describe a row.</strong> Sales by (store, product), returns by (date, ticker), survey responses by (year, country, age_bracket) — the data is fundamentally hierarchical, and forcing it into a flat <code>RangeIndex</code> with three repeated columns means writing <code>.groupby(["store","product"])</code> for the rest of your life. A MultiIndex moves the hierarchy from the columns into the index, where pandas can use it directly: cross-sections become O(log n) lookups, partial slicing is one syntax, and broadcasting across levels is built in.</p>

<p class="l-text">In this lesson we build MultiIndex frames from real datasets — orders aggregated by (customer_id × product_id), stocks by (date hierarchy), reviews grouped with hierarchical aggregations — and then exercise the operations that make MultiIndex actually useful: <code>.xs()</code> for cross-sections, <code>.loc[]</code> with tuples, <code>swaplevel</code>, <code>stack</code>/<code>unstack</code> to pivot between long and wide, and <code>reset_index</code>/<code>set_index</code> to move in and out. We then benchmark MultiIndex group-by against <code>pivot_table</code> and discover when one wins. Finally, we draw the line: when a MultiIndex is the right tool, and when it is just complexity for its own sake.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Build a MultiIndex from <code>set_index([cols])</code>, <code>groupby(...).agg()</code>, or <code>pd.MultiIndex.from_product</code></li>
<li>Slice with <code>.loc[(a,b)]</code>, <code>.xs(key, level=...)</code>, and <code>pd.IndexSlice</code> for ranges</li>
<li>Reshape with <code>stack</code>, <code>unstack</code>, <code>swaplevel</code>, <code>sort_index</code> — and know which to call</li>
<li>Compare MultiIndex group-bys vs <code>pivot_table</code> — performance and ergonomics</li>
<li>Recognize when a MultiIndex is right (truly hierarchical, repeated cross-sections) vs wrong (one-shot reshape, downstream wants flat tidy data)</li>
<li>Avoid the three classic foot-guns: unsorted index slicing errors, accidental level reordering, MultiIndex columns that break <code>to_csv</code> round-trips</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why MultiIndex Exists</h2>
<p class="l-text">A pandas <code>Index</code> is a labeled axis. The default is integer positions <code>0..n-1</code>, but the index can be dates, strings, or — when one label is not enough — a tuple. A <strong>MultiIndex</strong> is exactly that: each row is keyed by a tuple <code>(level_0, level_1, ...)</code>. Internally pandas stores it as one array per level plus integer codes, so the memory cost is small and equality checks are fast.</p>

<p class="l-text">The reason to use one is operational. Once your data is indexed by <code>(customer_id, product_id)</code>, asking "all rows for customer 42" is <code>df.loc[42]</code> — no group-by, no boolean mask. Asking "all rows for product 7 across all customers" is <code>df.xs(7, level="product_id")</code>. Reshaping "customer × product" into a wide matrix is <code>df["amount"].unstack()</code>. Each of these would take a longer expression on a flat frame, and would re-scan the data each time.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Flat frame</div><div class="card-body">One row label per row. Repeating keys live in columns. Every cross-section needs <code>df[df.col==x]</code> or a fresh <code>groupby</code>. Simple, predictable, what beginners write.</div></div>
<div class="calc-card"><div class="card-title">MultiIndex frame</div><div class="card-body">Multiple labels per row, stored as a tuple. Cross-sections are <code>O(log n)</code> dictionary lookups against the level codes. Reshape between long and wide is one call.</div></div>
<div class="calc-card"><div class="card-title">When to switch</div><div class="card-body">If you do the same group-by 5+ times per script, set the group keys as the index once. If you need it once and then pass to sklearn / Plotly, stay flat — those tools want <code>RangeIndex</code>.</div></div>
</div>

<div class="calc-highlight"><strong>Mental model:</strong> a MultiIndex is a sorted dictionary of tuples → row positions. Everything else (xs, slicing, unstack) is sugar over that lookup.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Building a MultiIndex on Real Orders Data</h2>
<p class="l-text">We start with the <code>orders</code> dataset (2000 rows, columns <code>customer_id</code>, <code>product_id</code>, <code>quantity</code>, <code>amount</code>, <code>order_date</code>). The natural hierarchy is (customer, product) — every customer buys multiple products, every product is bought by multiple customers. We aggregate then index.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># df_orders is preloaded (2000 rows). Aggregate to (customer, product) totals.</span>
agg = (df_orders
       .<span class="fn">groupby</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>])
       .<span class="fn">agg</span>(total_amount=(<span class="str">"amount"</span>, <span class="str">"sum"</span>),
            total_qty=(<span class="str">"quantity"</span>, <span class="str">"sum"</span>),
            n_orders=(<span class="str">"amount"</span>, <span class="str">"size"</span>))
       .<span class="fn">sort_index</span>())

<span class="fn">print</span>(<span class="str">"MultiIndex levels:"</span>, agg.index.nlevels)
<span class="fn">print</span>(<span class="str">"Level names:"</span>, agg.index.names)
<span class="fn">print</span>(<span class="str">"Shape:"</span>, agg.shape)
<span class="fn">print</span>(agg.<span class="fn">head</span>(<span class="num">8</span>))
<span class="fn">print</span>(<span class="str">"\\nLevel 0 unique customers:"</span>, agg.index.<span class="fn">get_level_values</span>(<span class="num">0</span>).<span class="fn">nunique</span>())
<span class="fn">print</span>(<span class="str">"Level 1 unique products:"</span>, agg.index.<span class="fn">get_level_values</span>(<span class="num">1</span>).<span class="fn">nunique</span>())
</code></pre></div>

<p class="l-text">The <code>groupby(...).agg(...)</code> call is what creates the MultiIndex — group keys become the index automatically. <code>sort_index()</code> at the end is essential: unsorted MultiIndexes raise <code>UnsortedIndexError</code> on partial slicing. Always sort once after construction.</p>

<div class="calc-highlight"><strong>Three ways to build:</strong> (1) <code>groupby(keys).agg(...)</code> — most common; (2) <code>df.set_index(["a","b"])</code> on existing columns; (3) <code>pd.MultiIndex.from_product([A, B])</code> for a dense Cartesian grid (useful for forecasting frames).</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Slicing — loc, xs, and IndexSlice</h2>
<p class="l-text">There are three idiomatic ways to slice a MultiIndex, and they behave subtly differently. Knowing which to reach for is most of the skill.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title"><code>df.loc[key]</code></div><div class="card-body">Selects on the outer level. <code>df.loc[42]</code> returns all rows where level 0 equals 42, with level 0 dropped. Tuple form <code>df.loc[(42, 7)]</code> selects exactly one row.</div></div>
<div class="calc-card"><div class="card-title"><code>df.xs(key, level=...)</code></div><div class="card-body">Cross-section on any level by name. <code>df.xs(7, level="product_id")</code> selects all customers who bought product 7. The selected level is dropped from the result.</div></div>
<div class="calc-card"><div class="card-title"><code>pd.IndexSlice</code></div><div class="card-body">For ranges across multiple levels. <code>idx = pd.IndexSlice; df.loc[idx[10:20, 5:8], :]</code> picks customers 10–20 and products 5–8. Required when you want a slice rather than a single label.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

agg = (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>,<span class="str">"product_id"</span>])
       .<span class="fn">agg</span>(total=(<span class="str">"amount"</span>,<span class="str">"sum"</span>)).<span class="fn">sort_index</span>())

<span class="cm"># 1. Outer-level selection</span>
<span class="fn">print</span>(<span class="str">"--- All rows for customer 5 ---"</span>)
<span class="fn">print</span>(agg.loc[<span class="num">5</span>].<span class="fn">head</span>())

<span class="cm"># 2. Specific tuple</span>
<span class="fn">print</span>(<span class="str">"\\n--- Customer 5, product 3 ---"</span>)
<span class="fn">print</span>(agg.loc[(<span class="num">5</span>, <span class="num">3</span>)] <span class="kw">if</span> (<span class="num">5</span>,<span class="num">3</span>) <span class="kw">in</span> agg.index <span class="kw">else</span> <span class="str">"no such pair"</span>)

<span class="cm"># 3. Cross-section on inner level</span>
<span class="fn">print</span>(<span class="str">"\\n--- All customers who bought product 7 ---"</span>)
<span class="fn">print</span>(agg.<span class="fn">xs</span>(<span class="num">7</span>, level=<span class="str">"product_id"</span>).<span class="fn">head</span>())

<span class="cm"># 4. IndexSlice for ranges</span>
idx = pd.IndexSlice
sub = agg.loc[idx[<span class="num">10</span>:<span class="num">20</span>, <span class="num">1</span>:<span class="num">5</span>], :]
<span class="fn">print</span>(f<span class="str">"\\n--- IndexSlice (customers 10-20, products 1-5): {len(sub)} rows ---"</span>)
<span class="fn">print</span>(sub.<span class="fn">head</span>(<span class="num">8</span>))
</code></pre></div>

<p class="l-text">The slicing only works because we called <code>sort_index()</code> at construction. Try removing it and re-running the IndexSlice line — pandas raises <code>UnsortedIndexError: 'Key length (2) was greater than MultiIndex lexsort depth (0)'</code>. The lexsort depth is the number of fully sorted levels from the outside in; you need depth ≥ slice depth.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Reshape — stack, unstack, swaplevel</h2>
<p class="l-text">A MultiIndex frame is "long" by default. <code>unstack(level)</code> moves an index level into the columns, producing a wide frame; <code>stack()</code> goes the other way. This is the engine behind all pivoting in pandas — <code>pivot_table</code> is just <code>groupby + unstack</code> internally.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

agg = (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>,<span class="str">"product_id"</span>])
       .<span class="fn">agg</span>(total=(<span class="str">"amount"</span>,<span class="str">"sum"</span>)).<span class="fn">sort_index</span>())

<span class="cm"># Wide form: rows = customers, columns = products, values = total amount</span>
wide = agg[<span class="str">"total"</span>].<span class="fn">unstack</span>(level=<span class="str">"product_id"</span>, fill_value=<span class="num">0.0</span>)
<span class="fn">print</span>(<span class="str">"Wide shape:"</span>, wide.shape)
<span class="fn">print</span>(wide.iloc[:<span class="num">6</span>, :<span class="num">6</span>])

<span class="cm"># Back to long</span>
long = wide.<span class="fn">stack</span>().<span class="fn">rename</span>(<span class="str">"total"</span>).<span class="fn">to_frame</span>()
<span class="fn">print</span>(<span class="str">"\\nLong shape:"</span>, long.shape)

<span class="cm"># Swap levels and re-sort</span>
swapped = agg.<span class="fn">swaplevel</span>(<span class="num">0</span>, <span class="num">1</span>).<span class="fn">sort_index</span>()
<span class="fn">print</span>(<span class="str">"\\nSwapped first 5 rows (now indexed product_id, customer_id):"</span>)
<span class="fn">print</span>(swapped.<span class="fn">head</span>())
</code></pre></div>

<p class="l-text">Two warnings. First, <code>unstack</code> with sparse data creates many NaN cells — pass <code>fill_value=0</code> for counts/sums. Second, <code>swaplevel</code> changes lexsort depth back to zero on the new outer level, so <code>sort_index()</code> after every swap is mandatory if you plan to slice.</p>

<div class="calc-highlight"><strong>Reshape rules of thumb:</strong> use <code>unstack</code> for "make a heatmap-shaped matrix"; use <code>stack</code> for "tidy this back to a column"; use <code>pivot_table</code> when you want <code>aggfunc</code> and <code>fill_value</code> in one shot.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Hierarchical Aggregation on Reviews</h2>
<p class="l-text">The <code>reviews</code> dataset (300 rows, columns <code>product_id</code>, <code>rating</code>, <code>sentiment</code>, <code>helpful_votes</code>) is a natural fit for a (sentiment × rating) hierarchy. We compute mean helpful_votes and review counts at the leaf level, then roll up.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># df_reviews is preloaded</span>
h = (df_reviews
     .<span class="fn">groupby</span>([<span class="str">"sentiment"</span>, <span class="str">"rating"</span>])
     .<span class="fn">agg</span>(n=(<span class="str">"rating"</span>, <span class="str">"size"</span>),
          mean_helpful=(<span class="str">"helpful_votes"</span>, <span class="str">"mean"</span>))
     .<span class="fn">sort_index</span>())

<span class="fn">print</span>(<span class="str">"--- Leaf-level (sentiment x rating) ---"</span>)
<span class="fn">print</span>(h)

<span class="cm"># Roll up to sentiment only via groupby on level</span>
roll_sent = h.<span class="fn">groupby</span>(level=<span class="str">"sentiment"</span>).<span class="fn">agg</span>(
    total=(<span class="str">"n"</span>, <span class="str">"sum"</span>),
    mean_helpful=(<span class="str">"mean_helpful"</span>, <span class="str">"mean"</span>))
<span class="fn">print</span>(<span class="str">"\\n--- Rolled up to sentiment ---"</span>)
<span class="fn">print</span>(roll_sent)

<span class="cm"># Cross-section: only 5-star ratings, across sentiments</span>
five_star = h.<span class="fn">xs</span>(<span class="num">5</span>, level=<span class="str">"rating"</span>)
<span class="fn">print</span>(<span class="str">"\\n--- 5-star reviews by sentiment ---"</span>)
<span class="fn">print</span>(five_star)
</code></pre></div>

<p class="l-text">Notice <code>groupby(level=...)</code> — when the group key is already in the index, you do not need to <code>reset_index</code>. This is the everyday MultiIndex win: aggregations stay in place, the index keeps its meaning, and downstream code can keep slicing.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Date Hierarchy on Stocks</h2>
<p class="l-text">The <code>stocks</code> dataset (261 rows, columns <code>date</code>, <code>ticker</code>, <code>close</code>, <code>volume</code>) lets us build a (year, month, ticker) MultiIndex from a flat date column. This is the standard pattern for financial panel data.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

s = df_stocks.<span class="fn">copy</span>()
s[<span class="str">"date"</span>] = pd.<span class="fn">to_datetime</span>(s[<span class="str">"date"</span>])
s[<span class="str">"year"</span>] = s[<span class="str">"date"</span>].dt.year
s[<span class="str">"month"</span>] = s[<span class="str">"date"</span>].dt.month

panel = (s.<span class="fn">set_index</span>([<span class="str">"year"</span>, <span class="str">"month"</span>, <span class="str">"ticker"</span>])
         .<span class="fn">sort_index</span>()[[<span class="str">"close"</span>, <span class="str">"volume"</span>]])

<span class="fn">print</span>(<span class="str">"Panel index nlevels:"</span>, panel.index.nlevels)
<span class="fn">print</span>(panel.<span class="fn">head</span>(<span class="num">10</span>))

<span class="cm"># Monthly mean close per ticker via level groupby</span>
monthly = panel.<span class="fn">groupby</span>(level=[<span class="str">"year"</span>,<span class="str">"month"</span>,<span class="str">"ticker"</span>])[<span class="str">"close"</span>].<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">"\\nMonthly mean close (head):"</span>)
<span class="fn">print</span>(monthly.<span class="fn">head</span>(<span class="num">10</span>))

<span class="cm"># Cross-section: all rows for AAPL across years/months</span>
<span class="kw">if</span> <span class="str">"AAPL"</span> <span class="kw">in</span> panel.index.<span class="fn">get_level_values</span>(<span class="str">"ticker"</span>):
    aapl = panel.<span class="fn">xs</span>(<span class="str">"AAPL"</span>, level=<span class="str">"ticker"</span>)
    <span class="fn">print</span>(<span class="str">"\\nAAPL panel head:"</span>)
    <span class="fn">print</span>(aapl.<span class="fn">head</span>())
<span class="kw">else</span>:
    tk = panel.index.<span class="fn">get_level_values</span>(<span class="str">"ticker"</span>)[<span class="num">0</span>]
    <span class="fn">print</span>(f<span class="str">"\\nFirst ticker {tk!r} cross-section:"</span>)
    <span class="fn">print</span>(panel.<span class="fn">xs</span>(tk, level=<span class="str">"ticker"</span>).<span class="fn">head</span>())
</code></pre></div>

<p class="l-text">For real time-series work, a <code>DatetimeIndex</code> with a single date level is usually better than a (year, month, ticker) MultiIndex — pandas has special-case fast paths for date arithmetic. Use the hierarchical version when you genuinely need to roll up by year and month independently.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. MultiIndex vs pivot_table — Benchmark</h2>
<p class="l-text">Newcomers often ask whether to use <code>groupby + unstack</code> or <code>pivot_table</code>. The answer is "they are nearly the same thing, with different ergonomics." Let's measure.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> time

<span class="kw">def</span> <span class="fn">t</span>(fn, n=<span class="num">50</span>):
    t0 = time.<span class="fn">perf_counter</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n): <span class="fn">fn</span>()
    <span class="kw">return</span> (time.<span class="fn">perf_counter</span>() - t0) / n * <span class="num">1000</span>  <span class="cm"># ms per call</span>

<span class="kw">def</span> <span class="fn">via_groupby</span>():
    <span class="kw">return</span> (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>,<span class="str">"product_id"</span>])
            [<span class="str">"amount"</span>].<span class="fn">sum</span>().<span class="fn">unstack</span>(fill_value=<span class="num">0.0</span>))

<span class="kw">def</span> <span class="fn">via_pivot</span>():
    <span class="kw">return</span> df_orders.<span class="fn">pivot_table</span>(index=<span class="str">"customer_id"</span>,
                                 columns=<span class="str">"product_id"</span>,
                                 values=<span class="str">"amount"</span>,
                                 aggfunc=<span class="str">"sum"</span>,
                                 fill_value=<span class="num">0.0</span>)

ms_g = <span class="fn">t</span>(via_groupby)
ms_p = <span class="fn">t</span>(via_pivot)
<span class="fn">print</span>(f<span class="str">"groupby+unstack: {ms_g:.2f} ms/call"</span>)
<span class="fn">print</span>(f<span class="str">"pivot_table:     {ms_p:.2f} ms/call"</span>)
<span class="fn">print</span>(f<span class="str">"ratio:           {ms_p/ms_g:.2f}x"</span>)

<span class="cm"># Verify identical output</span>
a = <span class="fn">via_groupby</span>(); b = <span class="fn">via_pivot</span>()
<span class="fn">print</span>(<span class="str">"\\nShapes match:"</span>, a.shape == b.shape)
<span class="fn">print</span>(<span class="str">"Values close:"</span>, ((a - b).<span class="fn">abs</span>().<span class="fn">max</span>().<span class="fn">max</span>() &lt; <span class="num">1e-9</span>))
</code></pre></div>

<p class="l-text">On this dataset they are within a factor of two. <code>pivot_table</code> wins on readability when you want a single aggregation; <code>groupby + unstack</code> wins when you want multiple aggregations or further chaining. For pivoting frames with many columns at once (named-agg style), <code>groupby</code> is faster because it sees all aggregations in one pass.</p>

<div class="calc-highlight"><strong>Production tip:</strong> if you find yourself calling <code>pivot_table</code> on the same frame inside a loop, do the <code>set_index</code> + <code>sort_index</code> once outside the loop and slice the MultiIndex inside. The amortized cost drops by 10x or more.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. When MultiIndex Is Wrong</h2>
<p class="l-text">MultiIndex is power, but power has a tax. Three cases where it is the wrong tool:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">You only need it once</div><div class="card-body">If you do one pivot, plot it, and move on, <code>pivot_table</code> is shorter. The MultiIndex setup overhead is not paid back.</div></div>
<div class="calc-card"><div class="card-title">Downstream wants flat data</div><div class="card-body">scikit-learn, XGBoost, most plotting libs, and CSV consumers want <code>RangeIndex</code> with feature columns. Doing <code>set_index</code> just to <code>reset_index</code> three lines later is noise.</div></div>
<div class="calc-card"><div class="card-title">Sparse hierarchy</div><div class="card-body">If most (level_0, level_1) combinations do not exist, <code>unstack</code> creates a giant sparse matrix. Stay long, use <code>groupby</code> on demand, or move to <code>scipy.sparse</code>.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Anti-pattern: MultiIndex round-trip for nothing</span>
bad = (df_orders.<span class="fn">set_index</span>([<span class="str">"customer_id"</span>,<span class="str">"product_id"</span>])
       .<span class="fn">sort_index</span>()
       .<span class="fn">reset_index</span>()           <span class="cm"># immediately undone</span>
       .<span class="fn">head</span>())
<span class="fn">print</span>(<span class="str">"Anti-pattern result (just use the original):"</span>)
<span class="fn">print</span>(bad)

<span class="cm"># Correct: stay flat if you only need group totals once</span>
totals = (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>,<span class="str">"product_id"</span>])
          [<span class="str">"amount"</span>].<span class="fn">sum</span>().<span class="fn">reset_index</span>())
<span class="fn">print</span>(<span class="str">"\\nFlat groupby result (good for plotting / sklearn):"</span>)
<span class="fn">print</span>(totals.<span class="fn">head</span>(<span class="num">8</span>))
</code></pre></div>

<p class="l-text">A simple test: if your next two operations are <code>reset_index</code> and pass-to-sklearn, you did not need the MultiIndex. If your next two operations are <code>.xs(...)</code> and <code>.unstack(...)</code>, you very much did.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Common Foot-Guns</h2>
<p class="l-text">MultiIndex bugs are usually one of three. Recognize them and you save hours.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">UnsortedIndexError</div><div class="card-body"><code>df.loc[idx[10:20, :], :]</code> raises if the index is not lexsorted to depth 2. Fix: call <code>df.sort_index()</code> after every <code>set_index</code>, <code>swaplevel</code>, or <code>concat</code>.</div></div>
<div class="calc-card"><div class="card-title">Hidden level reorder</div><div class="card-body"><code>concat</code> across frames with different level orders silently reorders. Always pass <code>names=</code> explicitly or compare <code>.index.names</code> after.</div></div>
<div class="calc-card"><div class="card-title">CSV does not round-trip</div><div class="card-body">MultiIndex columns serialize as multi-row headers; reading back with <code>read_csv</code> needs <code>header=[0,1]</code>. Easier: <code>reset_index</code> + flatten columns before <code>to_csv</code>, or use Parquet which handles MultiIndex natively.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Demonstrate the unsorted error and the fix</span>
agg = (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>,<span class="str">"product_id"</span>])
       .<span class="fn">agg</span>(total=(<span class="str">"amount"</span>,<span class="str">"sum"</span>)))   <span class="cm"># NOT sorted</span>
<span class="fn">print</span>(<span class="str">"Lexsort depth (unsorted):"</span>, agg.index.lexsort_depth)

idx = pd.IndexSlice
<span class="kw">try</span>:
    _ = agg.loc[idx[<span class="num">10</span>:<span class="num">20</span>, <span class="num">1</span>:<span class="num">5</span>], :]
<span class="kw">except</span> Exception <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">"Error type:"</span>, <span class="fn">type</span>(e).__name__)
    <span class="fn">print</span>(<span class="str">"Message:"</span>, <span class="fn">str</span>(e)[:<span class="num">120</span>])

agg = agg.<span class="fn">sort_index</span>()
<span class="fn">print</span>(<span class="str">"\\nLexsort depth after sort:"</span>, agg.index.lexsort_depth)
<span class="fn">print</span>(<span class="str">"Slice now works, rows:"</span>, <span class="fn">len</span>(agg.loc[idx[<span class="num">10</span>:<span class="num">20</span>, <span class="num">1</span>:<span class="num">5</span>], :]))

<span class="cm"># Flatten MultiIndex columns for CSV-friendly export</span>
wide = agg[<span class="str">"total"</span>].<span class="fn">unstack</span>(fill_value=<span class="num">0</span>).iloc[:<span class="num">5</span>, :<span class="num">5</span>]
wide.columns = [f<span class="str">"prod_{c}"</span> <span class="kw">for</span> c <span class="kw">in</span> wide.columns]
<span class="fn">print</span>(<span class="str">"\\nFlattened columns:"</span>, <span class="fn">list</span>(wide.columns))
</code></pre></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Recap and What's Next</h2>
<p class="l-text">A MultiIndex is the right tool when (a) your row identity is genuinely a tuple and (b) you will repeatedly slice or reshape along that hierarchy. Build it with <code>groupby(...).agg(...)</code> or <code>set_index([cols])</code>, always <code>sort_index()</code>, and reach for <code>.xs()</code> and <code>pd.IndexSlice</code> for everyday work. Use <code>unstack</code> for wide views and <code>pivot_table</code> when you want a one-shot pivot with aggregation and fill in a single call.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>MultiIndex = sorted dict of tuples → row positions; everything else is sugar.</li>
<li>Always <code>sort_index()</code> after <code>set_index</code>, <code>swaplevel</code>, or <code>concat</code> — or partial slicing raises.</li>
<li><code>.loc[]</code> for outer-level or full tuple, <code>.xs()</code> for any level by name, <code>pd.IndexSlice</code> for ranges.</li>
<li><code>groupby + unstack</code> ≈ <code>pivot_table</code> — pick on readability for one-shot, on chaining for pipelines.</li>
<li>Stay flat when downstream is sklearn / Plotly / CSV; use MultiIndex when you slice and reshape repeatedly.</li>
<li>Three foot-guns: unsorted slicing, hidden level reorder on concat, CSV round-trip — all fixable with explicit <code>sort_index</code>, <code>names=</code>, and Parquet.</li>
</ul>
</div>

<p class="l-text">In <strong>pandas-L10</strong> we leave pandas itself and meet <em>Polars</em>, the Rust-backed columnar query engine that has eaten roughly half the new data-engineering work since 2024. We will see how its lazy frame turns a chain of <code>filter → groupby → agg → join</code> into an optimized query plan, when the speed-up is real (large data, complex group-bys), and when staying with pandas is the right call.</p>
</div>`,
tr: `<p class="l-text"><strong>MultiIndex, tek bir satır etiketinin satırı tanımlamaya yetmediği zaman başvurduğun yapıdır.</strong> (mağaza, ürün) bazında satışlar, (tarih, ticker) bazında getiriler, (yıl, ülke, yaş_grubu) bazında anket yanıtları — veri özünde hiyerarşiktir ve bunu üç tekrarlı sütunlu düz bir <code>RangeIndex</code>'e zorlamak, hayatının geri kalanında <code>.groupby(["store","product"])</code> yazmak demektir. MultiIndex, hiyerarşiyi sütunlardan indekse taşır; orada pandas onu doğrudan kullanabilir: kesitler O(log n) aramaya dönüşür, kısmi dilimleme tek sözdizimidir ve seviyeler arası yayma (broadcasting) yerleşik olarak gelir.</p>

<p class="l-text">Bu derste gerçek veri kümelerinden MultiIndex çerçeveleri kuruyoruz — (customer_id × product_id) bazında toplanan siparişler, (tarih hiyerarşisi) bazında hisse senetleri, hiyerarşik agregasyonlarla gruplanan değerlendirmeler — sonra MultiIndex'i gerçekten faydalı kılan işlemleri çalıştırıyoruz: kesitler için <code>.xs()</code>, demetlerle <code>.loc[]</code>, <code>swaplevel</code>, uzun ve geniş arasında pivot için <code>stack</code>/<code>unstack</code> ve giriş çıkış için <code>reset_index</code>/<code>set_index</code>. Sonra MultiIndex grup-bazını <code>pivot_table</code>'a karşı kıyaslıyoruz ve hangisinin kazandığını görüyoruz. Son olarak sınırı çiziyoruz: MultiIndex ne zaman doğru araç, ne zaman sadece kendi başına karmaşıklık.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><code>set_index([cols])</code>, <code>groupby(...).agg()</code> veya <code>pd.MultiIndex.from_product</code> ile MultiIndex kurmak</li>
<li><code>.loc[(a,b)]</code>, <code>.xs(key, level=...)</code> ile dilimleme ve aralıklar için <code>pd.IndexSlice</code></li>
<li><code>stack</code>, <code>unstack</code>, <code>swaplevel</code>, <code>sort_index</code> ile yeniden şekillendirme — ve hangisini çağıracağını bilmek</li>
<li>MultiIndex grup-bazlarını <code>pivot_table</code> ile karşılaştırmak — performans ve ergonomi</li>
<li>MultiIndex'in ne zaman doğru olduğunu (gerçekten hiyerarşik, tekrarlı kesitler) ve ne zaman yanlış olduğunu (tek seferlik şekillendirme, alt akış düz tidy veri ister) tanımak</li>
<li>Üç klasik tuzaktan kaçınmak: sıralanmamış indeks dilimleme hataları, kazara seviye yeniden sıralama, <code>to_csv</code> turunu bozan MultiIndex sütunlar</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. MultiIndex Neden Var?</h2>
<p class="l-text">Pandas <code>Index</code>'i etiketli bir eksendir. Varsayılan, <code>0..n-1</code> tamsayı pozisyonlarıdır, ancak indeks tarihler, dizgiler veya — bir etiket yetmediğinde — bir demet olabilir. <strong>MultiIndex</strong> tam olarak budur: her satır bir <code>(level_0, level_1, ...)</code> demetiyle anahtarlanır. Pandas bunu içeride seviye başına bir dizi artı tamsayı kodları olarak depolar; bellek maliyeti düşüktür ve eşitlik kontrolleri hızlıdır.</p>

<p class="l-text">Kullanma sebebi operasyoneldir. Verin bir kez <code>(customer_id, product_id)</code> ile indekslendikten sonra "müşteri 42'nin tüm satırları" sorusu <code>df.loc[42]</code>'dir — group-by yok, boolean maske yok. "Tüm müşteriler genelinde 7 numaralı ürünün tüm satırları" sorusu <code>df.xs(7, level="product_id")</code>'dir. "müşteri × ürün"ü geniş bir matrise dönüştürmek <code>df["amount"].unstack()</code>'tır. Bunların her biri düz bir çerçevede daha uzun bir ifade olur ve her seferinde veriyi yeniden tarar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Düz çerçeve</div><div class="card-body">Satır başına bir satır etiketi. Tekrarlanan anahtarlar sütunlarda yaşar. Her kesit <code>df[df.col==x]</code> veya yeni bir <code>groupby</code> gerektirir. Basit, tahmin edilebilir, başlangıç düzeyi yazımı.</div></div>
<div class="calc-card"><div class="card-title">MultiIndex çerçeve</div><div class="card-body">Satır başına birden çok etiket, demet olarak depolanır. Kesitler seviye kodlarına karşı <code>O(log n)</code> sözlük aramalarıdır. Uzun ve geniş arasında yeniden şekillendirme tek çağrıdır.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman geçilir</div><div class="card-body">Aynı group-by'ı bir betikte 5+ kez yapıyorsan, grup anahtarlarını bir kez indeks olarak ata. Bir kez yapıp sklearn / Plotly'ye geçirmen gerekirse düz kal — bu araçlar <code>RangeIndex</code> ister.</div></div>
</div>

<div class="calc-highlight"><strong>Zihinsel model:</strong> MultiIndex, demetlerin sıralı bir sözlüğüdür → satır pozisyonları. Geri kalan her şey (xs, dilimleme, unstack) bu aramanın üzerinde şekerlemedir.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Gerçek Sipariş Verisi Üzerinde MultiIndex Kurmak</h2>
<p class="l-text"><code>orders</code> veri kümesiyle başlıyoruz (2000 satır, sütunlar <code>customer_id</code>, <code>product_id</code>, <code>quantity</code>, <code>amount</code>, <code>order_date</code>). Doğal hiyerarşi (müşteri, ürün) — her müşteri birden çok ürün alır, her ürün birden çok müşteri tarafından alınır. Önce topluyoruz sonra indeksliyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># df_orders önceden yüklenmiş (2000 satır). (müşteri, ürün) toplamlarına agrega et.</span>
agg = (df_orders
       .<span class="fn">groupby</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>])
       .<span class="fn">agg</span>(total_amount=(<span class="str">"amount"</span>, <span class="str">"sum"</span>),
            total_qty=(<span class="str">"quantity"</span>, <span class="str">"sum"</span>),
            n_orders=(<span class="str">"amount"</span>, <span class="str">"size"</span>))
       .<span class="fn">sort_index</span>())

<span class="fn">print</span>(<span class="str">"MultiIndex levels:"</span>, agg.index.nlevels)
<span class="fn">print</span>(<span class="str">"Level names:"</span>, agg.index.names)
<span class="fn">print</span>(<span class="str">"Shape:"</span>, agg.shape)
<span class="fn">print</span>(agg.<span class="fn">head</span>(<span class="num">8</span>))
<span class="fn">print</span>(<span class="str">"\\nLevel 0 unique customers:"</span>, agg.index.<span class="fn">get_level_values</span>(<span class="num">0</span>).<span class="fn">nunique</span>())
<span class="fn">print</span>(<span class="str">"Level 1 unique products:"</span>, agg.index.<span class="fn">get_level_values</span>(<span class="num">1</span>).<span class="fn">nunique</span>())
</code></pre></div>

<p class="l-text"><code>groupby(...).agg(...)</code> çağrısı MultiIndex'i oluşturan şeydir — grup anahtarları otomatik olarak indeks olur. Sondaki <code>sort_index()</code> şarttır: sıralanmamış MultiIndex'ler kısmi dilimlemede <code>UnsortedIndexError</code> fırlatır. Yapım sonrası daima bir kez sırala.</p>

<div class="calc-highlight"><strong>Üç kurma yolu:</strong> (1) <code>groupby(keys).agg(...)</code> — en yaygın; (2) mevcut sütunlar üzerinde <code>df.set_index(["a","b"])</code>; (3) yoğun bir Kartezyen ızgara için <code>pd.MultiIndex.from_product([A, B])</code> (tahmin çerçeveleri için faydalı).</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Dilimleme — loc, xs ve IndexSlice</h2>
<p class="l-text">Bir MultiIndex'i dilimlemenin üç deyimsel yolu vardır ve incelikli olarak farklı davranırlar. Hangisini kullanacağını bilmek becerinin çoğunu oluşturur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title"><code>df.loc[key]</code></div><div class="card-body">Dış seviyede seçer. <code>df.loc[42]</code>, seviye 0'ın 42'ye eşit olduğu tüm satırları döndürür ve seviye 0 düşer. Demet biçimi <code>df.loc[(42, 7)]</code> tam olarak bir satır seçer.</div></div>
<div class="calc-card"><div class="card-title"><code>df.xs(key, level=...)</code></div><div class="card-body">Herhangi bir seviyede ada göre kesit. <code>df.xs(7, level="product_id")</code> 7 numaralı ürünü alan tüm müşterileri seçer. Seçilen seviye sonuçtan düşer.</div></div>
<div class="calc-card"><div class="card-title"><code>pd.IndexSlice</code></div><div class="card-body">Birden çok seviyede aralıklar için. <code>idx = pd.IndexSlice; df.loc[idx[10:20, 5:8], :]</code> 10–20 müşterileri ve 5–8 ürünleri seçer. Tek bir etiket yerine bir dilim istediğinde gerekli.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

agg = (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>,<span class="str">"product_id"</span>])
       .<span class="fn">agg</span>(total=(<span class="str">"amount"</span>,<span class="str">"sum"</span>)).<span class="fn">sort_index</span>())

<span class="cm"># 1. Dış seviye seçimi</span>
<span class="fn">print</span>(<span class="str">"--- Tüm satırlar müşteri 5 için ---"</span>)
<span class="fn">print</span>(agg.loc[<span class="num">5</span>].<span class="fn">head</span>())

<span class="cm"># 2. Belirli demet</span>
<span class="fn">print</span>(<span class="str">"\\n--- Müşteri 5, ürün 3 ---"</span>)
<span class="fn">print</span>(agg.loc[(<span class="num">5</span>, <span class="num">3</span>)] <span class="kw">if</span> (<span class="num">5</span>,<span class="num">3</span>) <span class="kw">in</span> agg.index <span class="kw">else</span> <span class="str">"böyle bir çift yok"</span>)

<span class="cm"># 3. İç seviyede kesit</span>
<span class="fn">print</span>(<span class="str">"\\n--- Ürün 7'yi alan tüm müşteriler ---"</span>)
<span class="fn">print</span>(agg.<span class="fn">xs</span>(<span class="num">7</span>, level=<span class="str">"product_id"</span>).<span class="fn">head</span>())

<span class="cm"># 4. Aralıklar için IndexSlice</span>
idx = pd.IndexSlice
sub = agg.loc[idx[<span class="num">10</span>:<span class="num">20</span>, <span class="num">1</span>:<span class="num">5</span>], :]
<span class="fn">print</span>(f<span class="str">"\\n--- IndexSlice (müşteri 10-20, ürün 1-5): {len(sub)} satır ---"</span>)
<span class="fn">print</span>(sub.<span class="fn">head</span>(<span class="num">8</span>))
</code></pre></div>

<p class="l-text">Dilimleme yalnızca yapımda <code>sort_index()</code> çağırdığımız için çalışır. Onu kaldırıp IndexSlice satırını yeniden çalıştırmayı dene — pandas <code>UnsortedIndexError: 'Key length (2) was greater than MultiIndex lexsort depth (0)'</code> fırlatır. Lexsort derinliği, dıştan içe tamamen sıralanmış seviye sayısıdır; derinlik ≥ dilim derinliği gerekir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Yeniden Şekillendirme — stack, unstack, swaplevel</h2>
<p class="l-text">Bir MultiIndex çerçevesi varsayılan olarak "uzun"dur. <code>unstack(level)</code> bir indeks seviyesini sütunlara taşır ve geniş bir çerçeve üretir; <code>stack()</code> tersini yapar. Pandas'taki tüm pivotlamanın motoru budur — <code>pivot_table</code> içeride sadece <code>groupby + unstack</code>'tır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

agg = (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>,<span class="str">"product_id"</span>])
       .<span class="fn">agg</span>(total=(<span class="str">"amount"</span>,<span class="str">"sum"</span>)).<span class="fn">sort_index</span>())

<span class="cm"># Geniş biçim: satırlar = müşteriler, sütunlar = ürünler, değerler = toplam tutar</span>
wide = agg[<span class="str">"total"</span>].<span class="fn">unstack</span>(level=<span class="str">"product_id"</span>, fill_value=<span class="num">0.0</span>)
<span class="fn">print</span>(<span class="str">"Wide shape:"</span>, wide.shape)
<span class="fn">print</span>(wide.iloc[:<span class="num">6</span>, :<span class="num">6</span>])

<span class="cm"># Uzuna geri</span>
long = wide.<span class="fn">stack</span>().<span class="fn">rename</span>(<span class="str">"total"</span>).<span class="fn">to_frame</span>()
<span class="fn">print</span>(<span class="str">"\\nLong shape:"</span>, long.shape)

<span class="cm"># Seviyeleri takasla ve yeniden sırala</span>
swapped = agg.<span class="fn">swaplevel</span>(<span class="num">0</span>, <span class="num">1</span>).<span class="fn">sort_index</span>()
<span class="fn">print</span>(<span class="str">"\\nSwapped first 5 rows (artık product_id, customer_id ile indekslenmiş):"</span>)
<span class="fn">print</span>(swapped.<span class="fn">head</span>())
</code></pre></div>

<p class="l-text">İki uyarı. Birincisi, <code>unstack</code> seyrek veriyle birçok NaN hücresi yaratır — sayımlar/toplamlar için <code>fill_value=0</code> geçirin. İkincisi, <code>swaplevel</code> yeni dış seviyede lexsort derinliğini sıfıra döndürür; dilimleme planlıyorsan her takastan sonra <code>sort_index()</code> zorunludur.</p>

<div class="calc-highlight"><strong>Yeniden şekillendirme yöntem kuralları:</strong> "ısı haritası şekilli matris yap" için <code>unstack</code>, "bunu bir sütuna geri tidyle" için <code>stack</code>, tek seferde <code>aggfunc</code> ve <code>fill_value</code> istediğinde <code>pivot_table</code> kullan.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Yorumlar Üzerinde Hiyerarşik Agregasyon</h2>
<p class="l-text"><code>reviews</code> veri kümesi (300 satır, sütunlar <code>product_id</code>, <code>rating</code>, <code>sentiment</code>, <code>helpful_votes</code>) (sentiment × rating) hiyerarşisi için doğal bir uyumdur. Yaprak seviyesinde ortalama helpful_votes ve değerlendirme sayılarını hesaplıyoruz, sonra yukarı yuvarlıyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># df_reviews önceden yüklenmiş</span>
h = (df_reviews
     .<span class="fn">groupby</span>([<span class="str">"sentiment"</span>, <span class="str">"rating"</span>])
     .<span class="fn">agg</span>(n=(<span class="str">"rating"</span>, <span class="str">"size"</span>),
          mean_helpful=(<span class="str">"helpful_votes"</span>, <span class="str">"mean"</span>))
     .<span class="fn">sort_index</span>())

<span class="fn">print</span>(<span class="str">"--- Yaprak seviyesi (sentiment x rating) ---"</span>)
<span class="fn">print</span>(h)

<span class="cm"># Seviyede groupby ile sentiment'a yuvarla</span>
roll_sent = h.<span class="fn">groupby</span>(level=<span class="str">"sentiment"</span>).<span class="fn">agg</span>(
    total=(<span class="str">"n"</span>, <span class="str">"sum"</span>),
    mean_helpful=(<span class="str">"mean_helpful"</span>, <span class="str">"mean"</span>))
<span class="fn">print</span>(<span class="str">"\\n--- Sentiment'a yuvarlanmış ---"</span>)
<span class="fn">print</span>(roll_sent)

<span class="cm"># Kesit: yalnızca 5 yıldızlı, sentiment'lar arası</span>
five_star = h.<span class="fn">xs</span>(<span class="num">5</span>, level=<span class="str">"rating"</span>)
<span class="fn">print</span>(<span class="str">"\\n--- 5 yıldızlı yorumlar sentiment'a göre ---"</span>)
<span class="fn">print</span>(five_star)
</code></pre></div>

<p class="l-text"><code>groupby(level=...)</code>'a dikkat — grup anahtarı zaten indekste olduğunda <code>reset_index</code>'e gerek yoktur. Bu, MultiIndex'in günlük kazancı: agregasyonlar yerinde kalır, indeks anlamını korur ve alt akış kodu dilimlemeye devam edebilir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hisse Senedi Üzerinde Tarih Hiyerarşisi</h2>
<p class="l-text"><code>stocks</code> veri kümesi (261 satır, sütunlar <code>date</code>, <code>ticker</code>, <code>close</code>, <code>volume</code>) düz bir tarih sütunundan (yıl, ay, ticker) MultiIndex kurmamızı sağlar. Bu, finansal panel verisi için standart bir kalıptır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

s = df_stocks.<span class="fn">copy</span>()
s[<span class="str">"date"</span>] = pd.<span class="fn">to_datetime</span>(s[<span class="str">"date"</span>])
s[<span class="str">"year"</span>] = s[<span class="str">"date"</span>].dt.year
s[<span class="str">"month"</span>] = s[<span class="str">"date"</span>].dt.month

panel = (s.<span class="fn">set_index</span>([<span class="str">"year"</span>, <span class="str">"month"</span>, <span class="str">"ticker"</span>])
         .<span class="fn">sort_index</span>()[[<span class="str">"close"</span>, <span class="str">"volume"</span>]])

<span class="fn">print</span>(<span class="str">"Panel index nlevels:"</span>, panel.index.nlevels)
<span class="fn">print</span>(panel.<span class="fn">head</span>(<span class="num">10</span>))

<span class="cm"># Seviye groupby ile ticker başına aylık ortalama close</span>
monthly = panel.<span class="fn">groupby</span>(level=[<span class="str">"year"</span>,<span class="str">"month"</span>,<span class="str">"ticker"</span>])[<span class="str">"close"</span>].<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">"\\nAylık ortalama close (head):"</span>)
<span class="fn">print</span>(monthly.<span class="fn">head</span>(<span class="num">10</span>))

<span class="cm"># Kesit: yıllar/aylar arası AAPL'nin tüm satırları</span>
<span class="kw">if</span> <span class="str">"AAPL"</span> <span class="kw">in</span> panel.index.<span class="fn">get_level_values</span>(<span class="str">"ticker"</span>):
    aapl = panel.<span class="fn">xs</span>(<span class="str">"AAPL"</span>, level=<span class="str">"ticker"</span>)
    <span class="fn">print</span>(<span class="str">"\\nAAPL panel head:"</span>)
    <span class="fn">print</span>(aapl.<span class="fn">head</span>())
<span class="kw">else</span>:
    tk = panel.index.<span class="fn">get_level_values</span>(<span class="str">"ticker"</span>)[<span class="num">0</span>]
    <span class="fn">print</span>(f<span class="str">"\\nİlk ticker {tk!r} kesiti:"</span>)
    <span class="fn">print</span>(panel.<span class="fn">xs</span>(tk, level=<span class="str">"ticker"</span>).<span class="fn">head</span>())
</code></pre></div>

<p class="l-text">Gerçek zaman serisi işi için tek bir tarih seviyesine sahip <code>DatetimeIndex</code>, (yıl, ay, ticker) MultiIndex'ten genelde daha iyidir — pandas tarih aritmetiği için özel hızlı yollara sahiptir. Yıla ve aya bağımsız olarak yuvarlamak gerçekten gerekiyorsa hiyerarşik sürümü kullan.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. MultiIndex vs pivot_table — Kıyaslama</h2>
<p class="l-text">Yeni başlayanlar genellikle <code>groupby + unstack</code> mı yoksa <code>pivot_table</code> mı kullanmaları gerektiğini sorar. Cevap "ergonomileri farklı, neredeyse aynı şey." Ölçelim.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> time

<span class="kw">def</span> <span class="fn">t</span>(fn, n=<span class="num">50</span>):
    t0 = time.<span class="fn">perf_counter</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n): <span class="fn">fn</span>()
    <span class="kw">return</span> (time.<span class="fn">perf_counter</span>() - t0) / n * <span class="num">1000</span>  <span class="cm"># çağrı başına ms</span>

<span class="kw">def</span> <span class="fn">via_groupby</span>():
    <span class="kw">return</span> (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>,<span class="str">"product_id"</span>])
            [<span class="str">"amount"</span>].<span class="fn">sum</span>().<span class="fn">unstack</span>(fill_value=<span class="num">0.0</span>))

<span class="kw">def</span> <span class="fn">via_pivot</span>():
    <span class="kw">return</span> df_orders.<span class="fn">pivot_table</span>(index=<span class="str">"customer_id"</span>,
                                 columns=<span class="str">"product_id"</span>,
                                 values=<span class="str">"amount"</span>,
                                 aggfunc=<span class="str">"sum"</span>,
                                 fill_value=<span class="num">0.0</span>)

ms_g = <span class="fn">t</span>(via_groupby)
ms_p = <span class="fn">t</span>(via_pivot)
<span class="fn">print</span>(f<span class="str">"groupby+unstack: {ms_g:.2f} ms/call"</span>)
<span class="fn">print</span>(f<span class="str">"pivot_table:     {ms_p:.2f} ms/call"</span>)
<span class="fn">print</span>(f<span class="str">"oran:            {ms_p/ms_g:.2f}x"</span>)

<span class="cm"># Aynı çıktıyı doğrula</span>
a = <span class="fn">via_groupby</span>(); b = <span class="fn">via_pivot</span>()
<span class="fn">print</span>(<span class="str">"\\nShapes match:"</span>, a.shape == b.shape)
<span class="fn">print</span>(<span class="str">"Values close:"</span>, ((a - b).<span class="fn">abs</span>().<span class="fn">max</span>().<span class="fn">max</span>() &lt; <span class="num">1e-9</span>))
</code></pre></div>

<p class="l-text">Bu veri kümesinde iki kat içinde farklılar. Tek bir agregasyon istediğinde okunabilirlikte <code>pivot_table</code> kazanır; birden çok agregasyon veya daha fazla zincirleme istediğinde <code>groupby + unstack</code> kazanır. Aynı anda birçok sütunu pivotlama (named-agg stili) için <code>groupby</code> daha hızlıdır çünkü tüm agregasyonları tek geçişte görür.</p>

<div class="calc-highlight"><strong>Üretim ipucu:</strong> kendinizi bir döngü içinde aynı çerçevede <code>pivot_table</code> çağırırken bulursanız, <code>set_index</code> + <code>sort_index</code>'i döngünün dışında bir kez yapın ve içeride MultiIndex'i dilimleyin. Amortize edilmiş maliyet 10 kat veya daha fazla düşer.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. MultiIndex Ne Zaman Yanlış</h2>
<p class="l-text">MultiIndex güçtür, ama gücün bir vergisi vardır. Yanlış araç olduğu üç durum:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sadece bir kez ihtiyacın var</div><div class="card-body">Bir pivot yapıp çiziyor ve devam ediyorsan, <code>pivot_table</code> daha kısadır. MultiIndex kurma yükü geri ödenmez.</div></div>
<div class="calc-card"><div class="card-title">Alt akış düz veri ister</div><div class="card-body">scikit-learn, XGBoost, çoğu çizim kütüphanesi ve CSV tüketicileri özellik sütunlarıyla <code>RangeIndex</code> ister. Üç satır sonra <code>reset_index</code> yapmak için <code>set_index</code> yapmak gürültüdür.</div></div>
<div class="calc-card"><div class="card-title">Seyrek hiyerarşi</div><div class="card-body">Çoğu (level_0, level_1) kombinasyonu yoksa, <code>unstack</code> dev bir seyrek matris yaratır. Uzun kal, talep üzerine <code>groupby</code> kullan veya <code>scipy.sparse</code>'a geç.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Anti-pattern: hiçbir şey için MultiIndex tur</span>
bad = (df_orders.<span class="fn">set_index</span>([<span class="str">"customer_id"</span>,<span class="str">"product_id"</span>])
       .<span class="fn">sort_index</span>()
       .<span class="fn">reset_index</span>()           <span class="cm"># hemen geri alındı</span>
       .<span class="fn">head</span>())
<span class="fn">print</span>(<span class="str">"Anti-pattern sonucu (orijinali kullan):"</span>)
<span class="fn">print</span>(bad)

<span class="cm"># Doğru: yalnızca bir kez grup toplamlarına ihtiyacın varsa düz kal</span>
totals = (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>,<span class="str">"product_id"</span>])
          [<span class="str">"amount"</span>].<span class="fn">sum</span>().<span class="fn">reset_index</span>())
<span class="fn">print</span>(<span class="str">"\\nDüz groupby sonucu (çizim / sklearn için iyi):"</span>)
<span class="fn">print</span>(totals.<span class="fn">head</span>(<span class="num">8</span>))
</code></pre></div>

<p class="l-text">Basit bir test: sonraki iki işlemin <code>reset_index</code> ve sklearn'a geçirme ise, MultiIndex'e ihtiyacın yoktu. Sonraki iki işlemin <code>.xs(...)</code> ve <code>.unstack(...)</code> ise, fazlasıyla vardı.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Yaygın Tuzaklar</h2>
<p class="l-text">MultiIndex hataları genellikle üçten biridir. Onları tanı, saatlerce zaman kazanırsın.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">UnsortedIndexError</div><div class="card-body">İndeks 2. derinliğe leksort edilmemişse <code>df.loc[idx[10:20, :], :]</code> hata verir. Düzeltme: her <code>set_index</code>, <code>swaplevel</code> veya <code>concat</code> sonrası <code>df.sort_index()</code> çağır.</div></div>
<div class="calc-card"><div class="card-title">Gizli seviye yeniden sıralaması</div><div class="card-body">Farklı seviye sıralarına sahip çerçevelerde <code>concat</code> sessizce yeniden sıralar. Daima açıkça <code>names=</code> geçir veya sonra <code>.index.names</code>'i karşılaştır.</div></div>
<div class="calc-card"><div class="card-title">CSV turlamıyor</div><div class="card-body">MultiIndex sütunlar çok satırlı başlıklar olarak serileşir; <code>read_csv</code> ile geri okuma <code>header=[0,1]</code> gerektirir. Daha kolayı: <code>to_csv</code>'den önce <code>reset_index</code> + sütunları düzleştir veya MultiIndex'i doğal olarak işleyen Parquet kullan.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Sıralanmamış hatayı ve düzeltmeyi göster</span>
agg = (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>,<span class="str">"product_id"</span>])
       .<span class="fn">agg</span>(total=(<span class="str">"amount"</span>,<span class="str">"sum"</span>)))   <span class="cm"># sıralanmamış</span>
<span class="fn">print</span>(<span class="str">"Lexsort depth (sıralanmamış):"</span>, agg.index.lexsort_depth)

idx = pd.IndexSlice
<span class="kw">try</span>:
    _ = agg.loc[idx[<span class="num">10</span>:<span class="num">20</span>, <span class="num">1</span>:<span class="num">5</span>], :]
<span class="kw">except</span> Exception <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">"Hata türü:"</span>, <span class="fn">type</span>(e).__name__)
    <span class="fn">print</span>(<span class="str">"Mesaj:"</span>, <span class="fn">str</span>(e)[:<span class="num">120</span>])

agg = agg.<span class="fn">sort_index</span>()
<span class="fn">print</span>(<span class="str">"\\nLexsort depth sıraladıktan sonra:"</span>, agg.index.lexsort_depth)
<span class="fn">print</span>(<span class="str">"Dilim artık çalışıyor, satır:"</span>, <span class="fn">len</span>(agg.loc[idx[<span class="num">10</span>:<span class="num">20</span>, <span class="num">1</span>:<span class="num">5</span>], :]))

<span class="cm"># CSV-dostu dışa aktarım için MultiIndex sütunları düzleştir</span>
wide = agg[<span class="str">"total"</span>].<span class="fn">unstack</span>(fill_value=<span class="num">0</span>).iloc[:<span class="num">5</span>, :<span class="num">5</span>]
wide.columns = [f<span class="str">"prod_{c}"</span> <span class="kw">for</span> c <span class="kw">in</span> wide.columns]
<span class="fn">print</span>(<span class="str">"\\nDüzleştirilmiş sütunlar:"</span>, <span class="fn">list</span>(wide.columns))
</code></pre></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sıradaki</h2>
<p class="l-text">MultiIndex, (a) satır kimliğin gerçekten bir demet olduğunda ve (b) bu hiyerarşi boyunca tekrarlı olarak dilimleyeceğin veya yeniden şekillendireceğin zaman doğru araçtır. Onu <code>groupby(...).agg(...)</code> veya <code>set_index([cols])</code> ile kur, daima <code>sort_index()</code> uygula ve günlük iş için <code>.xs()</code> ve <code>pd.IndexSlice</code>'a uzan. Geniş görünümler için <code>unstack</code> kullan ve tek çağrıda agregasyon ve fill ile tek seferlik bir pivot istediğinde <code>pivot_table</code> kullan.</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>MultiIndex = demetlerin sıralı sözlüğü → satır pozisyonları; geri kalan her şey şekerleme.</li>
<li><code>set_index</code>, <code>swaplevel</code> veya <code>concat</code> sonrası daima <code>sort_index()</code> — yoksa kısmi dilimleme hata verir.</li>
<li>Dış seviye veya tam demet için <code>.loc[]</code>, ada göre herhangi bir seviye için <code>.xs()</code>, aralıklar için <code>pd.IndexSlice</code>.</li>
<li><code>groupby + unstack</code> ≈ <code>pivot_table</code> — tek seferlik için okunabilirliğe, pipeline'lar için zincirlemeye göre seç.</li>
<li>Alt akış sklearn / Plotly / CSV ise düz kal; tekrarlı dilimliyor ve yeniden şekillendiriyorsan MultiIndex kullan.</li>
<li>Üç tuzak: sıralanmamış dilimleme, concat'te gizli seviye yeniden sıralaması, CSV turu — hepsi açık <code>sort_index</code>, <code>names=</code> ve Parquet ile düzeltilebilir.</li>
</ul>
</div>

<p class="l-text"><strong>pandas-L10</strong>'da pandas'ın kendisini bırakıyor ve <em>Polars</em> ile tanışıyoruz — 2024'ten beri yeni veri-mühendisliği işinin yaklaşık yarısını yiyen Rust destekli sütunlu sorgu motoru. Tembel çerçevesinin <code>filter → groupby → agg → join</code> zincirini optimize edilmiş bir sorgu planına nasıl çevirdiğini, hızlanmanın gerçek olduğu durumları (büyük veri, karmaşık group-by'lar) ve pandas'ta kalmanın doğru çağrı olduğu zamanı göreceğiz.</p>
</div>`
};
