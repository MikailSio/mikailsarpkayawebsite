window.PANDAS_L10 = {
en: `<p class="l-text"><strong>Polars is what pandas would look like if it were designed in 2024 from scratch on top of Rust and Apache Arrow.</strong> Same dataframe abstraction, different soul: columnar storage, SIMD-vectorized kernels, a true query optimizer, lazy evaluation by default, and built-in parallelism. On a single laptop, Polars routinely runs typical group-by-aggregate workloads 5–30x faster than pandas, and on data that does not fit in RAM it can still stream through the whole file. Since the 1.0 release in mid-2024 it has become the default for new data-engineering pipelines at fast-moving teams; pandas remains the lingua franca for analysis notebooks, sklearn interop, and the long tail of "I just need a quick frame".</p>

<p class="l-text">In this lesson we map every pandas idiom you know to its Polars equivalent, then introduce the one thing pandas cannot match: the lazy frame. We write the same query in three styles — pandas chained, Polars eager, Polars lazy — and inspect the optimized query plan that lazy mode produces. We benchmark on the orders dataset (small but representative), discuss when the lazy-mode wins compound (filter pushdown, projection pushdown, common-subexpression elimination), and lay out the decision rule for switching: data size, group-by complexity, and whether your downstream stack is sklearn (pandas) or DuckDB / Parquet / Delta (Polars).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Translate pandas <code>.loc</code>, <code>.assign</code>, <code>groupby</code>, <code>merge</code> idioms to Polars expressions</li>
<li>Distinguish eager <code>pl.DataFrame</code> from lazy <code>pl.LazyFrame</code>, and call <code>.collect()</code> at the right moment</li>
<li>Read a Polars query plan and identify projection / predicate pushdown</li>
<li>Use <code>pl.scan_csv()</code> / <code>pl.scan_parquet()</code> to query files that do not fit in RAM</li>
<li>Decide when to switch from pandas to Polars: data size, group-by cardinality, downstream stack</li>
<li>Avoid the three migration mistakes: assuming row-by-row mutation works, expecting NumPy interop to be free, fighting Polars expressions instead of writing them idiomatically</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Same Idea, Different Foundation</h2>
<p class="l-text">Pandas was created in 2008 on top of NumPy. NumPy is row-major in memory by default, single-threaded, and assumes everything fits in RAM. Polars was created in 2020 on top of Apache Arrow. Arrow is columnar, zero-copy across processes, designed for SIMD, and has been adopted by every modern engine (DuckDB, Spark 3.x, BigQuery export, Snowflake, Hugging Face datasets). Polars also wraps a real query optimizer that rewrites your code before running it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pandas (NumPy + Python)</div><div class="card-body">Row labels everywhere (Index, MultiIndex). String columns are <code>object</code> dtype — slow. Single-threaded by default. <code>df.apply</code> falls back to a Python loop. Excellent ecosystem: sklearn, statsmodels, every plotting lib.</div></div>
<div class="calc-card"><div class="card-title">Polars (Arrow + Rust)</div><div class="card-body">No row index — positional only. Strings are dictionary-encoded native arrays. Multi-threaded by default. Expressions compile to vectorized Rust. Native Parquet, IPC, JSON, CSV streaming. Smaller ecosystem but growing fast.</div></div>
<div class="calc-card"><div class="card-title">Why it matters</div><div class="card-body">Same group-by aggregate often runs 5–30x faster on Polars without code changes beyond syntax. Memory use can drop 2–5x. And the lazy mode lets you query datasets larger than RAM.</div></div>
</div>

<div class="calc-highlight"><strong>The 2026 split:</strong> notebooks, exploration, and sklearn pipelines stay on pandas; ETL, scheduled jobs, large-data feature engineering, and anything reading Parquet move to Polars. Most teams use both — and that is fine.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Pandas / Polars Cheatsheet</h2>
<p class="l-text">Almost every pandas operation has a one-line Polars equivalent. The biggest mental shift: Polars works through <em>expressions</em> (<code>pl.col("x") * 2</code>) that get evaluated inside a <code>select</code> / <code>filter</code> / <code>with_columns</code> / <code>group_by</code>, rather than chained methods on the Series itself.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Select columns</div><div class="card-body">pandas: <code>df[["a","b"]]</code><br>polars: <code>df.select(["a","b"])</code> or <code>df.select(pl.col("a","b"))</code></div></div>
<div class="calc-card"><div class="card-title">Filter rows</div><div class="card-body">pandas: <code>df[df.a &gt; 5]</code><br>polars: <code>df.filter(pl.col("a") &gt; 5)</code></div></div>
<div class="calc-card"><div class="card-title">Add column</div><div class="card-body">pandas: <code>df.assign(c=df.a + df.b)</code><br>polars: <code>df.with_columns((pl.col("a") + pl.col("b")).alias("c"))</code></div></div>
<div class="calc-card"><div class="card-title">Group + agg</div><div class="card-body">pandas: <code>df.groupby("k").agg(s=("v","sum"))</code><br>polars: <code>df.group_by("k").agg(pl.col("v").sum().alias("s"))</code></div></div>
<div class="calc-card"><div class="card-title">Join</div><div class="card-body">pandas: <code>a.merge(b, on="k", how="inner")</code><br>polars: <code>a.join(b, on="k", how="inner")</code></div></div>
<div class="calc-card"><div class="card-title">Sort</div><div class="card-body">pandas: <code>df.sort_values(["a","b"])</code><br>polars: <code>df.sort(["a","b"])</code></div></div>
</div>

<p class="l-text">Two things to internalize. First: there is no row index in Polars — you select rows by filter or by integer position via <code>df[0]</code>. Second: every transformation returns a new frame; mutation in place does not exist (and that is intentional — it is what makes the optimizer safe).</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Same Query in Three Styles</h2>
<p class="l-text">Take a single business question: <em>"For each customer, sum their order amounts in 2024 above $50, and return the top 10 customers."</em> Here is how it looks in pandas (chained), Polars eager, and Polars lazy.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Polars syntax shown, runs require local install)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># --- Pandas chained ---</span>
<span class="kw">import</span> pandas <span class="kw">as</span> pd
result_pd = (df
    .<span class="fn">query</span>(<span class="str">"amount &gt; 50 and order_date &gt;= '2024-01-01'"</span>)
    .<span class="fn">groupby</span>(<span class="str">"customer_id"</span>, as_index=<span class="kw">False</span>)[<span class="str">"amount"</span>].<span class="fn">sum</span>()
    .<span class="fn">sort_values</span>(<span class="str">"amount"</span>, ascending=<span class="kw">False</span>)
    .<span class="fn">head</span>(<span class="num">10</span>))

<span class="cm"># --- Polars eager ---</span>
<span class="kw">import</span> polars <span class="kw">as</span> pl
df_pl = pl.<span class="fn">from_pandas</span>(df)
result_eager = (df_pl
    .<span class="fn">filter</span>((pl.<span class="fn">col</span>(<span class="str">"amount"</span>) &gt; <span class="num">50</span>) &amp; (pl.<span class="fn">col</span>(<span class="str">"order_date"</span>) &gt;= pl.<span class="fn">date</span>(<span class="num">2024</span>,<span class="num">1</span>,<span class="num">1</span>)))
    .<span class="fn">group_by</span>(<span class="str">"customer_id"</span>)
    .<span class="fn">agg</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>).<span class="fn">sum</span>())
    .<span class="fn">sort</span>(<span class="str">"amount"</span>, descending=<span class="kw">True</span>)
    .<span class="fn">head</span>(<span class="num">10</span>))

<span class="cm"># --- Polars lazy ---</span>
result_lazy = (pl.<span class="fn">scan_csv</span>(<span class="str">"orders.csv"</span>)              <span class="cm"># nothing read yet</span>
    .<span class="fn">filter</span>((pl.<span class="fn">col</span>(<span class="str">"amount"</span>) &gt; <span class="num">50</span>) &amp; (pl.<span class="fn">col</span>(<span class="str">"order_date"</span>) &gt;= pl.<span class="fn">date</span>(<span class="num">2024</span>,<span class="num">1</span>,<span class="num">1</span>)))
    .<span class="fn">group_by</span>(<span class="str">"customer_id"</span>)
    .<span class="fn">agg</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>).<span class="fn">sum</span>())
    .<span class="fn">sort</span>(<span class="str">"amount"</span>, descending=<span class="kw">True</span>)
    .<span class="fn">head</span>(<span class="num">10</span>)
    .<span class="fn">collect</span>())                                       <span class="cm"># NOW it runs, optimized</span>
</code></pre></div>

<p class="l-text">All three return identical data. The differences are runtime. Pandas executes each step eagerly: it materializes a filtered frame, then a grouped frame, then a sorted frame. Polars eager does the same but on Arrow, multi-threaded. Polars lazy builds an unevaluated plan, optimizes it (push the filter into the scan, only read needed columns), and runs the whole pipeline as one streaming operation.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent — pandas, lazy-style chain</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Polars itself does not run in Pyodide; the equivalent pandas chain produces the same result so you can verify the logic in-browser.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

df = df_orders.<span class="fn">copy</span>()
df[<span class="str">"order_date"</span>] = pd.<span class="fn">to_datetime</span>(df[<span class="str">"order_date"</span>])

result = (df
    .<span class="fn">query</span>(<span class="str">"amount &gt; 50 and order_date &gt;= '2024-01-01'"</span>)
    .<span class="fn">groupby</span>(<span class="str">"customer_id"</span>, as_index=<span class="kw">False</span>)[<span class="str">"amount"</span>].<span class="fn">sum</span>()
    .<span class="fn">sort_values</span>(<span class="str">"amount"</span>, ascending=<span class="kw">False</span>)
    .<span class="fn">head</span>(<span class="num">10</span>))

<span class="fn">print</span>(<span class="str">"Top 10 customers by 2024 spend (above $50 orders):"</span>)
<span class="fn">print</span>(result.<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(f<span class="str">"\\nTotal qualifying orders: {(df.query('amount &gt; 50 and order_date &gt;= \\\"2024-01-01\\\"').shape[0])}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Lazy Evaluation and Query Plans</h2>
<p class="l-text">Lazy mode is the headline Polars feature. <code>pl.scan_csv(path)</code> returns a <code>LazyFrame</code> — a description of "I plan to read this file" — without doing any I/O. Every subsequent <code>.filter</code>, <code>.group_by</code>, <code>.with_columns</code> appends a node to the plan. <code>.collect()</code> hands the whole plan to the optimizer, which rewrites it before any data moves.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Predicate pushdown</div><div class="card-body">A <code>.filter(pl.col("date") &gt;= ...)</code> at the end of your chain gets moved <em>into</em> the scan. Polars only reads rows that pass. On Parquet this can be 100x faster.</div></div>
<div class="calc-card"><div class="card-title">Projection pushdown</div><div class="card-body">If your final result only needs columns A and B, the scan only reads those columns. Wide tables (50+ columns) often see 5–10x speed-up here alone.</div></div>
<div class="calc-card"><div class="card-title">Common-subexpression elimination</div><div class="card-body">If <code>(pl.col("a")+pl.col("b"))</code> appears three times in <code>with_columns</code>, it is computed once.</div></div>
<div class="calc-card"><div class="card-title">Streaming</div><div class="card-body"><code>.collect(streaming=True)</code> processes the plan in chunks instead of loading everything. Lets you query datasets larger than RAM.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Polars)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> polars <span class="kw">as</span> pl

q = (pl.<span class="fn">scan_csv</span>(<span class="str">"orders.csv"</span>)
     .<span class="fn">filter</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>) &gt; <span class="num">50</span>)
     .<span class="fn">group_by</span>(<span class="str">"customer_id"</span>)
     .<span class="fn">agg</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>).<span class="fn">sum</span>().<span class="fn">alias</span>(<span class="str">"total"</span>))
     .<span class="fn">sort</span>(<span class="str">"total"</span>, descending=<span class="kw">True</span>)
     .<span class="fn">head</span>(<span class="num">10</span>))

<span class="cm"># Show the unoptimized plan</span>
<span class="fn">print</span>(q.<span class="fn">explain</span>(optimized=<span class="kw">False</span>))

<span class="cm"># Show the optimized plan — filter is now inside the scan</span>
<span class="fn">print</span>(q.<span class="fn">explain</span>(optimized=<span class="kw">True</span>))

<span class="cm"># Show the resource plan as a graph</span>
<span class="cm"># q.show_graph()       # requires graphviz</span>

result = q.<span class="fn">collect</span>()      <span class="cm"># now it runs</span>
<span class="fn">print</span>(result)
</code></pre></div>

<p class="l-text">The output of <code>.explain(optimized=True)</code> tells you what Polars is actually going to do. Reading it is the single most useful debugging skill: if your filter is not pushed down (e.g. because it depends on a derived column), the plan will tell you.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. When Polars Wins (and By How Much)</h2>
<p class="l-text">Benchmarks like H2O.ai's db-benchmark and the more recent TPCH_pyperf suites show a consistent picture across 2023–2026. The crossover where Polars decisively beats pandas is roughly:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Data size</div><div class="card-body">Below ~100 MB the overhead of starting the Polars query engine eats the win — pandas is often comparable. Above 1 GB, Polars is usually 5–10x faster eager, 10–30x faster lazy. Above 10 GB and pandas starts running out of RAM.</div></div>
<div class="calc-card"><div class="card-title">Group-by cardinality</div><div class="card-body">High-cardinality group-bys (millions of groups) are where Polars' parallel hash aggregation crushes pandas' single-threaded path. Often 20x or more.</div></div>
<div class="calc-card"><div class="card-title">String operations</div><div class="card-body">Pandas <code>object</code> strings vs Arrow dictionary-encoded strings — Polars is typically 10–50x on regex / string filtering / value_counts.</div></div>
<div class="calc-card"><div class="card-title">Joins</div><div class="card-body">Polars uses parallel hash joins by default. On large many-to-many joins (1M × 1M) the gap can be 50x. On tiny lookup joins, both are instant.</div></div>
</div>

<div class="calc-highlight"><strong>Switching rule of thumb:</strong> if your job runs in &lt; 5 seconds in pandas, do not migrate. If it runs in &gt; 30 seconds or the file is &gt; 1 GB, Polars is almost always worth it. If it runs out of memory, you have no choice — Polars streaming or DuckDB.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. A Realistic Benchmark on Orders</h2>
<p class="l-text">The orders dataset is small (2000 rows), so the absolute numbers are not meaningful — but we can still illustrate the chain pattern and show that the same logic produces the same answer. The Polars block is DEMO; the pandas block runs in Pyodide.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> time

df = df_orders.<span class="fn">copy</span>()
df[<span class="str">"order_date"</span>] = pd.<span class="fn">to_datetime</span>(df[<span class="str">"order_date"</span>])

<span class="cm"># Simulate the lazy-style chain in pandas</span>
<span class="kw">def</span> <span class="fn">run</span>():
    <span class="kw">return</span> (df
            .<span class="fn">query</span>(<span class="str">"amount &gt; 50 and order_date &gt;= '2024-01-01'"</span>)
            .<span class="fn">groupby</span>(<span class="str">"customer_id"</span>, as_index=<span class="kw">False</span>)[<span class="str">"amount"</span>].<span class="fn">sum</span>()
            .<span class="fn">sort_values</span>(<span class="str">"amount"</span>, ascending=<span class="kw">False</span>)
            .<span class="fn">head</span>(<span class="num">10</span>))

<span class="cm"># Warm up + time</span>
_ = <span class="fn">run</span>()
t0 = time.<span class="fn">perf_counter</span>()
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>): r = <span class="fn">run</span>()
ms = (time.<span class="fn">perf_counter</span>() - t0) / <span class="num">200</span> * <span class="num">1000</span>
<span class="fn">print</span>(f<span class="str">"pandas chain: {ms:.2f} ms/call ({len(r)} rows)"</span>)
<span class="fn">print</span>(r.<span class="fn">to_string</span>(index=<span class="kw">False</span>))

<span class="fn">print</span>(<span class="str">"\\nOn a 50M-row file with 5M unique customers, the same logic in Polars lazy"</span>)
<span class="fn">print</span>(<span class="str">"typically completes in 1-3 seconds; pandas usually OOMs above 10M rows."</span>)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Polars equivalent (DEMO — for local install)</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> polars <span class="kw">as</span> pl
<span class="kw">import</span> time

df_pl = pl.<span class="fn">from_pandas</span>(df_orders).<span class="fn">with_columns</span>(
    pl.<span class="fn">col</span>(<span class="str">"order_date"</span>).<span class="fn">str</span>.<span class="fn">to_date</span>())

<span class="kw">def</span> <span class="fn">run_eager</span>():
    <span class="kw">return</span> (df_pl
            .<span class="fn">filter</span>((pl.<span class="fn">col</span>(<span class="str">"amount"</span>) &gt; <span class="num">50</span>) &amp;
                    (pl.<span class="fn">col</span>(<span class="str">"order_date"</span>) &gt;= pl.<span class="fn">date</span>(<span class="num">2024</span>,<span class="num">1</span>,<span class="num">1</span>)))
            .<span class="fn">group_by</span>(<span class="str">"customer_id"</span>)
            .<span class="fn">agg</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>).<span class="fn">sum</span>().<span class="fn">alias</span>(<span class="str">"total"</span>))
            .<span class="fn">sort</span>(<span class="str">"total"</span>, descending=<span class="kw">True</span>)
            .<span class="fn">head</span>(<span class="num">10</span>))

<span class="kw">def</span> <span class="fn">run_lazy</span>():
    <span class="kw">return</span> (df_pl.<span class="fn">lazy</span>()
            .<span class="fn">filter</span>((pl.<span class="fn">col</span>(<span class="str">"amount"</span>) &gt; <span class="num">50</span>) &amp;
                    (pl.<span class="fn">col</span>(<span class="str">"order_date"</span>) &gt;= pl.<span class="fn">date</span>(<span class="num">2024</span>,<span class="num">1</span>,<span class="num">1</span>)))
            .<span class="fn">group_by</span>(<span class="str">"customer_id"</span>)
            .<span class="fn">agg</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>).<span class="fn">sum</span>().<span class="fn">alias</span>(<span class="str">"total"</span>))
            .<span class="fn">sort</span>(<span class="str">"total"</span>, descending=<span class="kw">True</span>)
            .<span class="fn">head</span>(<span class="num">10</span>)
            .<span class="fn">collect</span>())

<span class="cm"># Both produce identical output; lazy is faster on large data</span>
<span class="fn">print</span>(<span class="fn">run_lazy</span>())
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Reading Files at Scale</h2>
<p class="l-text">The strongest single argument for Polars on a junior data-engineer's desk is <code>pl.scan_parquet</code> + <code>collect(streaming=True)</code>. You can query a 50 GB Parquet directory on a 16 GB laptop and get answers without thinking about chunking.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Polars)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> polars <span class="kw">as</span> pl

<span class="cm"># Scan a partitioned Parquet directory — no I/O yet</span>
q = (pl.<span class="fn">scan_parquet</span>(<span class="str">"data/events/year=*/month=*/*.parquet"</span>)
     .<span class="fn">filter</span>(pl.<span class="fn">col</span>(<span class="str">"event_type"</span>) == <span class="str">"purchase"</span>)
     .<span class="fn">filter</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>) &gt; <span class="num">0</span>)
     .<span class="fn">group_by</span>([<span class="str">"country"</span>, <span class="str">"device"</span>])
     .<span class="fn">agg</span>([
         pl.<span class="fn">col</span>(<span class="str">"amount"</span>).<span class="fn">sum</span>().<span class="fn">alias</span>(<span class="str">"revenue"</span>),
         pl.<span class="fn">len</span>().<span class="fn">alias</span>(<span class="str">"n_events"</span>),
     ])
     .<span class="fn">sort</span>(<span class="str">"revenue"</span>, descending=<span class="kw">True</span>))

<span class="cm"># Streaming collect — processes the plan in chunks</span>
df = q.<span class="fn">collect</span>(streaming=<span class="kw">True</span>)
<span class="fn">print</span>(df.<span class="fn">head</span>(<span class="num">20</span>))
</code></pre></div>

<p class="l-text">Two real wins are visible here. First, the partition wildcard — Polars uses Hive-style partition pruning, so if your filter touches only <code>year=2024</code> directories, it never opens the others. Second, streaming collect — the engine emits chunks of group-by state, never holding the whole result set in memory unless it must.</p>

<div class="calc-highlight"><strong>For data engineering pipelines:</strong> Polars + Parquet + Hive partitioning routinely replaces a Spark cluster on data up to a few hundred GB. Above that, the right answer is usually DuckDB or Spark — not because Polars cannot, but because the operational story (Iceberg, catalog, multi-node) is more mature.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Migration Pitfalls</h2>
<p class="l-text">Most pandas users hit the same three walls when they first try Polars. Knowing them in advance saves an afternoon.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">No in-place mutation</div><div class="card-body">There is no Polars equivalent of <code>df["new"] = df["a"] * 2</code>. You must write <code>df = df.with_columns((pl.col("a")*2).alias("new"))</code>. Frustrating at first; it is what makes the optimizer correct.</div></div>
<div class="calc-card"><div class="card-title">No row index</div><div class="card-body">Polars frames have positional rows only. If your pandas code relies on a meaningful index (<code>df.loc[some_id]</code>), you keep it as a column and use <code>.filter(pl.col("id") == some_id)</code> instead.</div></div>
<div class="calc-card"><div class="card-title">NumPy interop costs a copy</div><div class="card-body"><code>df.to_numpy()</code> in Polars copies (Arrow → NumPy strided). For sklearn handoff this is fine on small frames, painful on big ones. Workaround: stay on Polars for feature engineering, switch to NumPy / sklearn only at the final feature matrix stage.</div></div>
<div class="calc-card"><div class="card-title">Different default behaviors</div><div class="card-body">NaN vs Null: pandas treats them as one; Polars distinguishes. Group-by sort: pandas sorts groups by key; Polars does not (use <code>.sort()</code> after). Window functions: <code>.over()</code> instead of <code>groupby().transform()</code>.</div></div>
</div>

<p class="l-text">A practical migration order: rewrite the heaviest single notebook in Polars first, leave the rest in pandas, and let your team feel the difference before forcing a global switch. The Polars team explicitly recommends interoperation, not replacement.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Recap and What's Next</h2>
<p class="l-text">Polars is pandas done in Rust on Arrow, with a query optimizer and lazy mode bolted on. The eager API is a near drop-in once you accept "expressions inside select/filter/with_columns/group_by". The lazy API is the real magic: predicate and projection pushdown, common-subexpression elimination, and streaming collect let you query datasets that pandas physically cannot load. The decision rule is honest: under 100 MB or in a sklearn pipeline, stay on pandas; above 1 GB or in scheduled ETL, switch.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Polars = Arrow columnar storage + Rust kernels + query optimizer + parallel by default.</li>
<li>API mapping is direct: <code>filter</code>, <code>select</code>, <code>with_columns</code>, <code>group_by</code>, <code>join</code> — but inside expressions, not on the Series.</li>
<li>Lazy mode (<code>pl.scan_csv</code> / <code>pl.scan_parquet</code> + <code>.collect()</code>) is where the optimizer earns its keep.</li>
<li>Predicate pushdown, projection pushdown, CSE, streaming — read <code>.explain(optimized=True)</code> to see them.</li>
<li>Switch when data &gt; 1 GB, group-by cardinality is high, string-heavy work, or you need streaming. Stay on pandas for sklearn / notebooks / small data.</li>
<li>Migration walls: no in-place mutation, no row index, NumPy interop copies, NaN ≠ Null. All learnable in a day.</li>
</ul>
</div>

<p class="l-text">This closes the pandas track at 10 lessons. The natural next steps in our curriculum are <strong>mlops-L3</strong> (data pipelines with Polars + DuckDB + Parquet) and <strong>sql-L7</strong> (window functions and CTEs, which Polars expressions also support via <code>.over()</code>). For pure DataFrame mastery, the recommended outside reading is the Polars User Guide and Wes McKinney's 2024 talk "Apache Arrow and the Future of Data Frames".</p>
</div>`,
tr: `<p class="l-text"><strong>Polars, pandas'ın 2024'te Rust ve Apache Arrow üzerinde sıfırdan tasarlansaydı nasıl görüneceğidir.</strong> Aynı dataframe soyutlaması, farklı ruh: sütunlu depolama, SIMD-vektörleştirilmiş çekirdekler, gerçek bir sorgu optimize edicisi, varsayılan tembel değerlendirme ve yerleşik paralellik. Tek bir dizüstü bilgisayarda Polars, tipik group-by-agregasyon iş yüklerini pandas'tan rutin olarak 5–30x daha hızlı çalıştırır ve RAM'e sığmayan verilerde bile tüm dosyayı akış olarak işleyebilir. 2024 ortasında 1.0 yayınından bu yana, hızlı ilerleyen ekiplerde yeni veri mühendisliği pipeline'ları için varsayılan olmuştur; pandas, analiz defterleri, sklearn birlikte çalışabilirliği ve "sadece hızlı bir çerçeveye ihtiyacım var" durumlarının uzun kuyruğu için ortak dil olarak kalıyor.</p>

<p class="l-text">Bu derste bildiğin her pandas deyimini Polars eşdeğerine eşliyor, sonra pandas'ın eşleşemediği tek şeyi tanıtıyoruz: tembel çerçeve. Aynı sorguyu üç stilde yazıyoruz — pandas zincirlenmiş, Polars açık (eager), Polars tembel — ve tembel modun ürettiği optimize edilmiş sorgu planını inceliyoruz. Orders veri kümesinde (küçük ama temsili) kıyaslama yapıyor, tembel-mod kazanımlarının nasıl birleştiğini (filtre itme, projeksiyon itme, ortak alt-ifade eleme) tartışıyor ve geçiş için karar kuralını ortaya koyuyoruz: veri boyutu, group-by karmaşıklığı ve alt akış yığınınızın sklearn (pandas) mı yoksa DuckDB / Parquet / Delta (Polars) mı olduğu.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>pandas <code>.loc</code>, <code>.assign</code>, <code>groupby</code>, <code>merge</code> deyimlerini Polars ifadelerine çevirmek</li>
<li>Açık <code>pl.DataFrame</code>'i tembel <code>pl.LazyFrame</code>'den ayırmak ve <code>.collect()</code>'i doğru anda çağırmak</li>
<li>Bir Polars sorgu planını okumak ve projeksiyon / yüklem itmesini tanımlamak</li>
<li>RAM'e sığmayan dosyaları sorgulamak için <code>pl.scan_csv()</code> / <code>pl.scan_parquet()</code> kullanmak</li>
<li>Pandas'tan Polars'a ne zaman geçmek gerektiğine karar vermek: veri boyutu, group-by kardinalitesi, alt akış yığını</li>
<li>Üç göç hatasından kaçınmak: satır-satır mutasyonun çalıştığını varsaymak, NumPy birlikte çalışabilirliğinin bedava olduğunu beklemek, Polars ifadelerini deyimsel yazmak yerine onlarla savaşmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Aynı Fikir, Farklı Temel</h2>
<p class="l-text">Pandas 2008'de NumPy üzerine yaratıldı. NumPy varsayılan olarak bellekte satır-ana, tek iş parçacıklı ve her şeyin RAM'e sığdığını varsayar. Polars 2020'de Apache Arrow üzerine yaratıldı. Arrow sütunlu, süreçler arası sıfır-kopya, SIMD için tasarlanmış ve her modern motor (DuckDB, Spark 3.x, BigQuery dışa aktarımı, Snowflake, Hugging Face datasets) tarafından benimsenmiştir. Polars ayrıca kodunuzu çalıştırmadan önce yeniden yazan gerçek bir sorgu optimize edicisini de sarmalar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pandas (NumPy + Python)</div><div class="card-body">Her yerde satır etiketleri (Index, MultiIndex). Dize sütunları <code>object</code> dtype — yavaş. Varsayılan tek iş parçacıklı. <code>df.apply</code> Python döngüsüne düşer. Mükemmel ekosistem: sklearn, statsmodels, her çizim kütüphanesi.</div></div>
<div class="calc-card"><div class="card-title">Polars (Arrow + Rust)</div><div class="card-body">Satır indeksi yok — yalnızca konumsal. Dizgiler sözlük-kodlanmış doğal dizilerdir. Varsayılan çok iş parçacıklı. İfadeler vektörleştirilmiş Rust'a derlenir. Doğal Parquet, IPC, JSON, CSV akışı. Daha küçük ekosistem ama hızla büyüyor.</div></div>
<div class="calc-card"><div class="card-title">Neden önemli</div><div class="card-body">Aynı group-by agregasyonu, sözdizimi dışında kod değişikliği olmadan Polars'ta sıklıkla 5–30x daha hızlı çalışır. Bellek kullanımı 2–5x düşebilir. Ve tembel mod RAM'den büyük veri kümelerini sorgulamana izin verir.</div></div>
</div>

<div class="calc-highlight"><strong>2026 ayrımı:</strong> defterler, keşif ve sklearn pipeline'ları pandas'ta kalır; ETL, zamanlanmış işler, büyük veri özellik mühendisliği ve Parquet okuyan her şey Polars'a geçer. Çoğu ekip her ikisini de kullanır — ve bu sorun değildir.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Pandas / Polars Hile Kağıdı</h2>
<p class="l-text">Neredeyse her pandas işleminin tek satırlık bir Polars eşdeğeri vardır. En büyük zihinsel kayma: Polars, Series'in kendisindeki zincirlenmiş yöntemler yerine bir <code>select</code> / <code>filter</code> / <code>with_columns</code> / <code>group_by</code> içinde değerlendirilen <em>ifadeler</em> (<code>pl.col("x") * 2</code>) ile çalışır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sütun seç</div><div class="card-body">pandas: <code>df[["a","b"]]</code><br>polars: <code>df.select(["a","b"])</code> veya <code>df.select(pl.col("a","b"))</code></div></div>
<div class="calc-card"><div class="card-title">Satır filtrele</div><div class="card-body">pandas: <code>df[df.a &gt; 5]</code><br>polars: <code>df.filter(pl.col("a") &gt; 5)</code></div></div>
<div class="calc-card"><div class="card-title">Sütun ekle</div><div class="card-body">pandas: <code>df.assign(c=df.a + df.b)</code><br>polars: <code>df.with_columns((pl.col("a") + pl.col("b")).alias("c"))</code></div></div>
<div class="calc-card"><div class="card-title">Grupla + agrega</div><div class="card-body">pandas: <code>df.groupby("k").agg(s=("v","sum"))</code><br>polars: <code>df.group_by("k").agg(pl.col("v").sum().alias("s"))</code></div></div>
<div class="calc-card"><div class="card-title">Birleştir</div><div class="card-body">pandas: <code>a.merge(b, on="k", how="inner")</code><br>polars: <code>a.join(b, on="k", how="inner")</code></div></div>
<div class="calc-card"><div class="card-title">Sırala</div><div class="card-body">pandas: <code>df.sort_values(["a","b"])</code><br>polars: <code>df.sort(["a","b"])</code></div></div>
</div>

<p class="l-text">İçselleştirilecek iki şey. Birincisi: Polars'ta satır indeksi yoktur — satırları filtreyle veya <code>df[0]</code> aracılığıyla tamsayı pozisyonuyla seçersin. İkincisi: her dönüşüm yeni bir çerçeve döndürür; yerinde mutasyon yoktur (ve bu kasıtlıdır — optimize ediciyi güvenli kılan şey budur).</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Aynı Sorgu Üç Stilde</h2>
<p class="l-text">Tek bir iş sorusu al: <em>"Her müşteri için, 50 doların üstündeki 2024 sipariş tutarlarını topla ve en üstteki 10 müşteriyi döndür."</em> İşte pandas (zincirli), Polars açık ve Polars tembelde nasıl görünüyor.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Polars sözdizimi gösterilmiştir, çalışma yerel kurulum gerektirir)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># --- Pandas zincirli ---</span>
<span class="kw">import</span> pandas <span class="kw">as</span> pd
result_pd = (df
    .<span class="fn">query</span>(<span class="str">"amount &gt; 50 and order_date &gt;= '2024-01-01'"</span>)
    .<span class="fn">groupby</span>(<span class="str">"customer_id"</span>, as_index=<span class="kw">False</span>)[<span class="str">"amount"</span>].<span class="fn">sum</span>()
    .<span class="fn">sort_values</span>(<span class="str">"amount"</span>, ascending=<span class="kw">False</span>)
    .<span class="fn">head</span>(<span class="num">10</span>))

<span class="cm"># --- Polars açık (eager) ---</span>
<span class="kw">import</span> polars <span class="kw">as</span> pl
df_pl = pl.<span class="fn">from_pandas</span>(df)
result_eager = (df_pl
    .<span class="fn">filter</span>((pl.<span class="fn">col</span>(<span class="str">"amount"</span>) &gt; <span class="num">50</span>) &amp; (pl.<span class="fn">col</span>(<span class="str">"order_date"</span>) &gt;= pl.<span class="fn">date</span>(<span class="num">2024</span>,<span class="num">1</span>,<span class="num">1</span>)))
    .<span class="fn">group_by</span>(<span class="str">"customer_id"</span>)
    .<span class="fn">agg</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>).<span class="fn">sum</span>())
    .<span class="fn">sort</span>(<span class="str">"amount"</span>, descending=<span class="kw">True</span>)
    .<span class="fn">head</span>(<span class="num">10</span>))

<span class="cm"># --- Polars tembel ---</span>
result_lazy = (pl.<span class="fn">scan_csv</span>(<span class="str">"orders.csv"</span>)              <span class="cm"># henüz hiçbir şey okunmadı</span>
    .<span class="fn">filter</span>((pl.<span class="fn">col</span>(<span class="str">"amount"</span>) &gt; <span class="num">50</span>) &amp; (pl.<span class="fn">col</span>(<span class="str">"order_date"</span>) &gt;= pl.<span class="fn">date</span>(<span class="num">2024</span>,<span class="num">1</span>,<span class="num">1</span>)))
    .<span class="fn">group_by</span>(<span class="str">"customer_id"</span>)
    .<span class="fn">agg</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>).<span class="fn">sum</span>())
    .<span class="fn">sort</span>(<span class="str">"amount"</span>, descending=<span class="kw">True</span>)
    .<span class="fn">head</span>(<span class="num">10</span>)
    .<span class="fn">collect</span>())                                       <span class="cm"># ŞİMDİ çalışıyor, optimize</span>
</code></pre></div>

<p class="l-text">Üçü de aynı veriyi döndürür. Farklar çalışma zamanındadır. Pandas her adımı açıkça yürütür: filtrelenmiş bir çerçeve, sonra gruplanmış bir çerçeve, sonra sıralanmış bir çerçeve maddeleştirir. Polars açık aynı şeyi yapar ama Arrow üzerinde, çok iş parçacıklı. Polars tembel değerlendirilmemiş bir plan kurar, optimize eder (filtreyi taramaya it, yalnızca gerekli sütunları oku) ve tüm pipeline'ı tek bir akış işlemi olarak çalıştırır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri — pandas, tembel-stil zincir</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Polars Pyodide'de çalışmaz; eşdeğer pandas zinciri aynı sonucu üretir, böylece mantığı tarayıcıda doğrulayabilirsin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

df = df_orders.<span class="fn">copy</span>()
df[<span class="str">"order_date"</span>] = pd.<span class="fn">to_datetime</span>(df[<span class="str">"order_date"</span>])

result = (df
    .<span class="fn">query</span>(<span class="str">"amount &gt; 50 and order_date &gt;= '2024-01-01'"</span>)
    .<span class="fn">groupby</span>(<span class="str">"customer_id"</span>, as_index=<span class="kw">False</span>)[<span class="str">"amount"</span>].<span class="fn">sum</span>()
    .<span class="fn">sort_values</span>(<span class="str">"amount"</span>, ascending=<span class="kw">False</span>)
    .<span class="fn">head</span>(<span class="num">10</span>))

<span class="fn">print</span>(<span class="str">"2024 harcamasına göre en üstteki 10 müşteri ($50 üstü siparişler):"</span>)
<span class="fn">print</span>(result.<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(f<span class="str">"\\nUygun sipariş toplamı: {(df.query('amount &gt; 50 and order_date &gt;= \\\"2024-01-01\\\"').shape[0])}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Tembel Değerlendirme ve Sorgu Planları</h2>
<p class="l-text">Tembel mod, Polars'ın manşet özelliğidir. <code>pl.scan_csv(path)</code> bir <code>LazyFrame</code> döndürür — "bu dosyayı okumayı planlıyorum" tanımı — herhangi bir G/Ç yapmadan. Sonraki her <code>.filter</code>, <code>.group_by</code>, <code>.with_columns</code> plana bir düğüm ekler. <code>.collect()</code> tüm planı optimize ediciye verir, optimize edici de veri hareket etmeden önce onu yeniden yazar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yüklem itme (predicate pushdown)</div><div class="card-body">Zincirinin sonunda bir <code>.filter(pl.col("date") &gt;= ...)</code> taramanın <em>içine</em> taşınır. Polars yalnızca geçen satırları okur. Parquet'te 100x daha hızlı olabilir.</div></div>
<div class="calc-card"><div class="card-title">Projeksiyon itme</div><div class="card-body">Son sonucun yalnızca A ve B sütunlarına ihtiyacı varsa, tarama yalnızca onları okur. Geniş tablolar (50+ sütun) yalnızca burada 5–10x hızlanma görür.</div></div>
<div class="calc-card"><div class="card-title">Ortak alt-ifade eleme</div><div class="card-body"><code>(pl.col("a")+pl.col("b"))</code> <code>with_columns</code> içinde üç kez geçerse, bir kez hesaplanır.</div></div>
<div class="calc-card"><div class="card-title">Akış</div><div class="card-body"><code>.collect(streaming=True)</code> planı her şeyi yüklemek yerine parçalar halinde işler. RAM'den büyük veri kümelerini sorgulamana izin verir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Polars)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> polars <span class="kw">as</span> pl

q = (pl.<span class="fn">scan_csv</span>(<span class="str">"orders.csv"</span>)
     .<span class="fn">filter</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>) &gt; <span class="num">50</span>)
     .<span class="fn">group_by</span>(<span class="str">"customer_id"</span>)
     .<span class="fn">agg</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>).<span class="fn">sum</span>().<span class="fn">alias</span>(<span class="str">"total"</span>))
     .<span class="fn">sort</span>(<span class="str">"total"</span>, descending=<span class="kw">True</span>)
     .<span class="fn">head</span>(<span class="num">10</span>))

<span class="cm"># Optimize edilmemiş planı göster</span>
<span class="fn">print</span>(q.<span class="fn">explain</span>(optimized=<span class="kw">False</span>))

<span class="cm"># Optimize edilmiş planı göster — filtre artık taramanın içinde</span>
<span class="fn">print</span>(q.<span class="fn">explain</span>(optimized=<span class="kw">True</span>))

<span class="cm"># Kaynak planını grafik olarak göster</span>
<span class="cm"># q.show_graph()       # graphviz gerektirir</span>

result = q.<span class="fn">collect</span>()      <span class="cm"># şimdi çalışıyor</span>
<span class="fn">print</span>(result)
</code></pre></div>

<p class="l-text"><code>.explain(optimized=True)</code> çıktısı sana Polars'ın gerçekten ne yapacağını söyler. Onu okumak en faydalı tek hata ayıklama becerisidir: filtren itilmediyse (örneğin türetilmiş bir sütuna bağlı olduğu için), plan bunu sana söyler.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Polars Ne Zaman Kazanır (ve Ne Kadarla)</h2>
<p class="l-text">H2O.ai'nin db-benchmark'ı ve daha yeni TPCH_pyperf paketleri gibi kıyaslamalar 2023–2026 arası tutarlı bir resim gösteriyor. Polars'ın pandas'ı kesin olarak yendiği geçiş noktası kabaca:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Veri boyutu</div><div class="card-body">~100 MB altında Polars sorgu motorunu başlatma yükü kazancı yer — pandas genellikle karşılaştırılabilir. 1 GB üstünde Polars genellikle 5–10x daha hızlı açık, 10–30x daha hızlı tembel. 10 GB üstünde pandas RAM'i tüketmeye başlar.</div></div>
<div class="calc-card"><div class="card-title">Group-by kardinalitesi</div><div class="card-body">Yüksek kardinaliteli group-by'lar (milyonlarca grup) Polars'ın paralel hash agregasyonunun pandas'ın tek iş parçacıklı yolunu ezdiği yerdir. Genellikle 20x veya daha fazla.</div></div>
<div class="calc-card"><div class="card-title">Dize işlemleri</div><div class="card-body">Pandas <code>object</code> dizgileri vs Arrow sözlük-kodlanmış dizgileri — Polars regex / dize filtrelemesinde / value_counts'ta tipik olarak 10–50x.</div></div>
<div class="calc-card"><div class="card-title">Birleştirmeler</div><div class="card-body">Polars varsayılan olarak paralel hash birleşmeleri kullanır. Büyük çoka-çok birleşmelerde (1M × 1M) fark 50x olabilir. Küçük arama birleşmelerinde her ikisi de anındadır.</div></div>
</div>

<div class="calc-highlight"><strong>Geçiş kuralı:</strong> işin pandas'ta &lt; 5 saniyede çalışıyorsa göç etme. &gt; 30 saniyede çalışıyorsa veya dosya &gt; 1 GB ise Polars neredeyse her zaman değer. Bellek tükeniyorsa, başka seçeneğin yok — Polars akışı veya DuckDB.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Orders Üzerinde Gerçekçi Bir Kıyaslama</h2>
<p class="l-text">Orders veri kümesi küçük (2000 satır), bu yüzden mutlak sayılar anlamlı değil — ama yine de zincir kalıbını gösterebilir ve aynı mantığın aynı cevabı ürettiğini ortaya koyabiliriz. Polars bloğu DEMO'dur; pandas bloğu Pyodide'de çalışır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> time

df = df_orders.<span class="fn">copy</span>()
df[<span class="str">"order_date"</span>] = pd.<span class="fn">to_datetime</span>(df[<span class="str">"order_date"</span>])

<span class="cm"># Tembel-stil zinciri pandas'ta simüle et</span>
<span class="kw">def</span> <span class="fn">run</span>():
    <span class="kw">return</span> (df
            .<span class="fn">query</span>(<span class="str">"amount &gt; 50 and order_date &gt;= '2024-01-01'"</span>)
            .<span class="fn">groupby</span>(<span class="str">"customer_id"</span>, as_index=<span class="kw">False</span>)[<span class="str">"amount"</span>].<span class="fn">sum</span>()
            .<span class="fn">sort_values</span>(<span class="str">"amount"</span>, ascending=<span class="kw">False</span>)
            .<span class="fn">head</span>(<span class="num">10</span>))

<span class="cm"># Isınma + zaman</span>
_ = <span class="fn">run</span>()
t0 = time.<span class="fn">perf_counter</span>()
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>): r = <span class="fn">run</span>()
ms = (time.<span class="fn">perf_counter</span>() - t0) / <span class="num">200</span> * <span class="num">1000</span>
<span class="fn">print</span>(f<span class="str">"pandas zincir: {ms:.2f} ms/çağrı ({len(r)} satır)"</span>)
<span class="fn">print</span>(r.<span class="fn">to_string</span>(index=<span class="kw">False</span>))

<span class="fn">print</span>(<span class="str">"\\n5M benzersiz müşterili 50M satırlık bir dosyada, aynı mantık Polars tembelde"</span>)
<span class="fn">print</span>(<span class="str">"genellikle 1-3 saniyede tamamlanır; pandas genellikle 10M satırın üstünde OOM olur."</span>)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Polars eşdeğeri (DEMO — yerel kurulum için)</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> polars <span class="kw">as</span> pl
<span class="kw">import</span> time

df_pl = pl.<span class="fn">from_pandas</span>(df_orders).<span class="fn">with_columns</span>(
    pl.<span class="fn">col</span>(<span class="str">"order_date"</span>).<span class="fn">str</span>.<span class="fn">to_date</span>())

<span class="kw">def</span> <span class="fn">run_eager</span>():
    <span class="kw">return</span> (df_pl
            .<span class="fn">filter</span>((pl.<span class="fn">col</span>(<span class="str">"amount"</span>) &gt; <span class="num">50</span>) &amp;
                    (pl.<span class="fn">col</span>(<span class="str">"order_date"</span>) &gt;= pl.<span class="fn">date</span>(<span class="num">2024</span>,<span class="num">1</span>,<span class="num">1</span>)))
            .<span class="fn">group_by</span>(<span class="str">"customer_id"</span>)
            .<span class="fn">agg</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>).<span class="fn">sum</span>().<span class="fn">alias</span>(<span class="str">"total"</span>))
            .<span class="fn">sort</span>(<span class="str">"total"</span>, descending=<span class="kw">True</span>)
            .<span class="fn">head</span>(<span class="num">10</span>))

<span class="kw">def</span> <span class="fn">run_lazy</span>():
    <span class="kw">return</span> (df_pl.<span class="fn">lazy</span>()
            .<span class="fn">filter</span>((pl.<span class="fn">col</span>(<span class="str">"amount"</span>) &gt; <span class="num">50</span>) &amp;
                    (pl.<span class="fn">col</span>(<span class="str">"order_date"</span>) &gt;= pl.<span class="fn">date</span>(<span class="num">2024</span>,<span class="num">1</span>,<span class="num">1</span>)))
            .<span class="fn">group_by</span>(<span class="str">"customer_id"</span>)
            .<span class="fn">agg</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>).<span class="fn">sum</span>().<span class="fn">alias</span>(<span class="str">"total"</span>))
            .<span class="fn">sort</span>(<span class="str">"total"</span>, descending=<span class="kw">True</span>)
            .<span class="fn">head</span>(<span class="num">10</span>)
            .<span class="fn">collect</span>())

<span class="cm"># Her ikisi de aynı çıktıyı üretir; tembel büyük veride daha hızlıdır</span>
<span class="fn">print</span>(<span class="fn">run_lazy</span>())
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Ölçekte Dosya Okuma</h2>
<p class="l-text">Bir genç veri-mühendisinin masasında Polars için en güçlü tek argüman <code>pl.scan_parquet</code> + <code>collect(streaming=True)</code>'dir. 16 GB'lık bir dizüstü bilgisayarda 50 GB'lık bir Parquet dizinini sorgulayabilir ve parçalama hakkında düşünmeden cevap alabilirsin.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Polars)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> polars <span class="kw">as</span> pl

<span class="cm"># Bölümlenmiş bir Parquet dizinini tara — henüz G/Ç yok</span>
q = (pl.<span class="fn">scan_parquet</span>(<span class="str">"data/events/year=*/month=*/*.parquet"</span>)
     .<span class="fn">filter</span>(pl.<span class="fn">col</span>(<span class="str">"event_type"</span>) == <span class="str">"purchase"</span>)
     .<span class="fn">filter</span>(pl.<span class="fn">col</span>(<span class="str">"amount"</span>) &gt; <span class="num">0</span>)
     .<span class="fn">group_by</span>([<span class="str">"country"</span>, <span class="str">"device"</span>])
     .<span class="fn">agg</span>([
         pl.<span class="fn">col</span>(<span class="str">"amount"</span>).<span class="fn">sum</span>().<span class="fn">alias</span>(<span class="str">"revenue"</span>),
         pl.<span class="fn">len</span>().<span class="fn">alias</span>(<span class="str">"n_events"</span>),
     ])
     .<span class="fn">sort</span>(<span class="str">"revenue"</span>, descending=<span class="kw">True</span>))

<span class="cm"># Akış collect — planı parçalar halinde işler</span>
df = q.<span class="fn">collect</span>(streaming=<span class="kw">True</span>)
<span class="fn">print</span>(df.<span class="fn">head</span>(<span class="num">20</span>))
</code></pre></div>

<p class="l-text">Burada görünen iki gerçek kazanç var. Birincisi, bölüm joker karakteri — Polars Hive-stili bölüm budama kullanır, bu yüzden filtren yalnızca <code>year=2024</code> dizinlerine değiyorsa diğerlerini hiç açmaz. İkincisi, akış collect — motor group-by durum parçalarını yayar, gerekmedikçe tüm sonuç kümesini bellekte tutmaz.</p>

<div class="calc-highlight"><strong>Veri mühendisliği pipeline'ları için:</strong> Polars + Parquet + Hive bölümlemesi, birkaç yüz GB'ye kadar veride bir Spark kümesini rutin olarak değiştirir. Bunun üzerinde, doğru cevap genellikle DuckDB veya Spark'tır — Polars yapamadığı için değil, operasyonel hikaye (Iceberg, katalog, çok düğümlü) daha olgun olduğu için.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Göç Tuzakları</h2>
<p class="l-text">Çoğu pandas kullanıcısı Polars'ı ilk denediğinde aynı üç duvara çarpar. Onları önceden bilmek bir öğleden sonrayı kurtarır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yerinde mutasyon yok</div><div class="card-body"><code>df["new"] = df["a"] * 2</code>'nin Polars eşdeğeri yoktur. <code>df = df.with_columns((pl.col("a")*2).alias("new"))</code> yazmalısın. Başlangıçta sinir bozucu; optimize ediciyi doğru kılan şey budur.</div></div>
<div class="calc-card"><div class="card-title">Satır indeksi yok</div><div class="card-body">Polars çerçevelerinin yalnızca konumsal satırları vardır. Pandas kodun anlamlı bir indekse dayanıyorsa (<code>df.loc[some_id]</code>), onu sütun olarak tutar ve <code>.filter(pl.col("id") == some_id)</code> kullanırsın.</div></div>
<div class="calc-card"><div class="card-title">NumPy birlikte çalışabilirliği kopya gerektirir</div><div class="card-body">Polars'ta <code>df.to_numpy()</code> kopyalar (Arrow → NumPy adımlı). sklearn'a aktarımda küçük çerçevelerde sorun değil, büyük çerçevelerde acılı. Çözüm: özellik mühendisliği için Polars'ta kal, yalnızca son özellik matrisi aşamasında NumPy / sklearn'a geç.</div></div>
<div class="calc-card"><div class="card-title">Farklı varsayılan davranışlar</div><div class="card-body">NaN vs Null: pandas onları bir olarak ele alır; Polars ayırır. Group-by sıralama: pandas grupları anahtara göre sıralar; Polars sıralamaz (sonra <code>.sort()</code> kullan). Pencere fonksiyonları: <code>groupby().transform()</code> yerine <code>.over()</code>.</div></div>
</div>

<p class="l-text">Pratik bir göç sırası: önce en ağır tek defteri Polars'ta yeniden yaz, geri kalanı pandas'ta bırak ve takımının küresel bir geçişi zorlamadan önce farkı hissetmesine izin ver. Polars takımı açıkça birlikte çalışmayı, değiştirmeyi değil tavsiye eder.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet ve Sıradaki</h2>
<p class="l-text">Polars, Arrow üzerinde Rust ile yapılmış pandas'tır, bir sorgu optimize edicisi ve tembel mod eklenmiş. Açık API, "ifadeler select/filter/with_columns/group_by içinde" kabul ettikten sonra neredeyse drop-in'dir. Tembel API gerçek sihirdir: yüklem ve projeksiyon itmesi, ortak alt-ifade eleme ve akış collect, pandas'ın fiziksel olarak yükleyemediği veri kümelerini sorgulamana izin verir. Karar kuralı dürüsttür: 100 MB altında veya bir sklearn pipeline'ında pandas'ta kal; 1 GB üstünde veya zamanlanmış ETL'de geç.</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Polars = Arrow sütunlu depolama + Rust çekirdekleri + sorgu optimize edicisi + varsayılan paralel.</li>
<li>API eşlemesi doğrudan: <code>filter</code>, <code>select</code>, <code>with_columns</code>, <code>group_by</code>, <code>join</code> — ama ifadeler içinde, Series üzerinde değil.</li>
<li>Tembel mod (<code>pl.scan_csv</code> / <code>pl.scan_parquet</code> + <code>.collect()</code>) optimize edicinin değerini kanıtladığı yerdir.</li>
<li>Yüklem itmesi, projeksiyon itmesi, CSE, akış — onları görmek için <code>.explain(optimized=True)</code> oku.</li>
<li>Veri &gt; 1 GB, group-by kardinalitesi yüksek, dize-ağır iş veya akış gerekiyorsa geç. sklearn / defterler / küçük veri için pandas'ta kal.</li>
<li>Göç duvarları: yerinde mutasyon yok, satır indeksi yok, NumPy birlikte çalışabilirliği kopyalar, NaN ≠ Null. Hepsi bir günde öğrenilebilir.</li>
</ul>
</div>

<p class="l-text">Bu, pandas track'ini 10 derste kapatır. Müfredatımızdaki doğal sonraki adımlar <strong>mlops-L3</strong> (Polars + DuckDB + Parquet ile veri pipeline'ları) ve <strong>sql-L7</strong> (pencere fonksiyonları ve CTE'ler, ki Polars ifadeleri de <code>.over()</code> aracılığıyla destekler) olur. Saf DataFrame ustalığı için önerilen dış okuma Polars User Guide ve Wes McKinney'nin 2024 konuşması "Apache Arrow and the Future of Data Frames"dir.</p>
</div>`
};
