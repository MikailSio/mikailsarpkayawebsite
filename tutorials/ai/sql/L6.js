window.SQL_L6 = {

en: `<p class="l-text"><strong>Window functions are SQL's superpower.</strong> They compute per-row metrics that depend on other rows — running totals, ranks, moving averages, day-over-day changes — without collapsing the result to one row per group.</p>
<p class="l-text">If GROUP BY is "fold many rows into one", windows are "compute over many rows but keep them all". Once you see them, you cannot unsee them. This lesson covers ROW_NUMBER, RANK, DENSE_RANK, LAG/LEAD, running aggregates, and NTILE.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Write window functions with OVER, PARTITION BY, and ORDER BY clauses</li><li>Use ROW_NUMBER, RANK, and DENSE_RANK to deduplicate or rank rows</li><li>Compute running totals and moving averages with SUM and AVG over a window</li><li>Compare rows with LAG and LEAD for time series and event analysis</li><li>Build a customer lifetime value query using window functions</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The shape of a window function</h2>
<p class="l-text">Anatomy: <code>function() OVER (PARTITION BY ... ORDER BY ...)</code>.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">function()</div><div class="card-body">The aggregate or ranking: SUM, AVG, ROW_NUMBER, RANK, LAG, etc.</div></div>
<div class="calc-card"><div class="card-title">PARTITION BY</div><div class="card-body">Optional. Splits rows into groups; the window resets per group. Like GROUP BY but rows survive.</div></div>
<div class="calc-card"><div class="card-title">ORDER BY</div><div class="card-body">Optional. Defines order within each partition — required for ranks, LAG, running totals.</div></div>
<div class="calc-card"><div class="card-title">Frame (advanced)</div><div class="card-body">ROWS BETWEEN ... — explicit window of rows for moving averages.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. ROW_NUMBER — assign unique ranks</h2>
<p class="l-text">Numbers each row 1, 2, 3, ... within its partition, in the specified order.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      customer_id,
      total_usd,
      order_date,
      ROW_NUMBER() OVER (
        PARTITION BY customer_id
        ORDER BY order_date
      ) AS order_seq
    FROM orders
    ORDER BY customer_id, order_seq
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) For each customer, number their orders 1, 2, 3 by date. 2) <code>PARTITION BY customer_id</code> resets numbering per customer. 3) <code>ORDER BY order_date</code> defines "first" = earliest order. 4) Useful for finding "first order ever per customer" by filtering <code>order_seq = 1</code> in an outer query.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. RANK vs DENSE_RANK vs ROW_NUMBER</h2>
<p class="l-text">Three ranking functions, three handling of ties.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ROW_NUMBER</div><div class="card-body">Always unique. Two equal values get arbitrary distinct numbers.</div></div>
<div class="calc-card"><div class="card-title">RANK</div><div class="card-body">Ties share a rank; gaps follow. 1, 2, 2, 4 — skips 3.</div></div>
<div class="calc-card"><div class="card-title">DENSE_RANK</div><div class="card-body">Ties share a rank; no gaps. 1, 2, 2, 3.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      name,
      category,
      price_usd,
      ROW_NUMBER() OVER (PARTITION BY category ORDER BY price_usd DESC) AS rn,
      RANK()       OVER (PARTITION BY category ORDER BY price_usd DESC) AS rk,
      DENSE_RANK() OVER (PARTITION BY category ORDER BY price_usd DESC) AS drk
    FROM products
    ORDER BY category, rn
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Three rankings side by side, partitioned by category. 2) Compare RN, RK, DRK columns: identical when prices are unique, diverge on ties. 3) Use ROW_NUMBER when you need exactly one row per rank (e.g., top product per category). 4) Use RANK when ties matter for business semantics ("there's no clear #1").</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Top N per group — the cleanest pattern</h2>
<p class="l-text">"Top 3 products per category by revenue." Window function inside a CTE, then filter.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH ranked AS (
      SELECT
        p.category,
        p.name,
        SUM(o.total_usd) AS revenue,
        ROW_NUMBER() OVER (
          PARTITION BY p.category
          ORDER BY SUM(o.total_usd) DESC
        ) AS rn
      FROM products p
      JOIN orders o ON o.product_id = p.product_id
      GROUP BY p.category, p.name
    )
    SELECT category, name, ROUND(revenue,2) AS revenue
    FROM ranked
    WHERE rn &lt;= 3
    ORDER BY category, rn
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Aggregate revenue per (category, product). 2) <code>ROW_NUMBER()</code> ranks within each category by revenue. 3) Outer query keeps only top 3. 4) Notice: window functions can use aggregate expressions — <code>SUM(o.total_usd)</code> works in both SELECT and ORDER BY of OVER. 5) Same pattern works for "top 5 customers per country", "first 2 orders per customer", etc.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. LAG and LEAD — peek at neighbors</h2>
<p class="l-text"><code>LAG(col, n)</code> returns the value of <code>col</code> from <em>n</em> rows back in the partition. <code>LEAD</code> looks forward. Perfect for day-over-day changes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      date,
      close,
      LAG(close, 1) OVER (ORDER BY date) AS prev_close,
      ROUND(close - LAG(close, 1) OVER (ORDER BY date), 2) AS change_abs,
      ROUND(100.0 * (close - LAG(close, 1) OVER (ORDER BY date))
                  / LAG(close, 1) OVER (ORDER BY date), 2) AS change_pct
    FROM stocks
    ORDER BY date
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>LAG(close, 1) OVER (ORDER BY date)</code> = previous day's close. 2) Subtract for absolute change. 3) Divide for percent change. 4) The first row's prev_close is NULL — there is no previous day. 5) This single query reproduces what pandas <code>pct_change()</code> does, computed inside the database.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Running totals with SUM OVER</h2>
<p class="l-text">Add ORDER BY inside OVER and an aggregate becomes <em>cumulative</em>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      customer_id,
      order_date,
      total_usd,
      ROUND(SUM(total_usd) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
      ), 2) AS cumulative_spend
    FROM orders
    WHERE customer_id IN (1, 2, 3)
    ORDER BY customer_id, order_date
    LIMIT 30
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>SUM(total_usd) OVER (PARTITION BY customer_id ORDER BY order_date)</code> = running total per customer. 2) Each row shows total spent up to that order. 3) Without ORDER BY, the SUM would be the grand total per partition (no cumulation). 4) Limited to 3 customers for readability — remove the WHERE for full data.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Moving averages — explicit frames</h2>
<p class="l-text">For a 7-day moving average, specify a frame: <code>ROWS BETWEEN 6 PRECEDING AND CURRENT ROW</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      date,
      close,
      ROUND(AVG(close) OVER (
        ORDER BY date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
      ), 2) AS ma7
    FROM stocks
    ORDER BY date
    LIMIT 25
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Frame = window of 7 rows ending at current. 2) <code>AVG</code> over that window = 7-day moving average. 3) The first 6 rows have shorter windows (no error — they just average what exists). 4) Replace AVG with SUM, MIN, MAX, STDEV for other windowed stats. 5) This is identical to pandas <code>rolling(7).mean()</code>.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. NTILE — bucket rows into N equal-sized groups</h2>
<p class="l-text">Useful for percentile bins, deciles, quartiles.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH spend AS (
      SELECT customer_id, SUM(total_usd) AS total_spend
      FROM orders
      GROUP BY customer_id
    )
    SELECT
      customer_id,
      ROUND(total_spend, 2) AS total_spend,
      NTILE(4) OVER (ORDER BY total_spend) AS quartile
    FROM spend
    ORDER BY total_spend DESC
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Compute per-customer total spend. 2) <code>NTILE(4)</code> assigns each customer to a quartile (1 = lowest spend, 4 = highest). 3) Useful for VIP segmentation, cohort analysis, fairness checks. 4) NTILE(10) for deciles, NTILE(100) for percentiles.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Customer rank within country by spend</h2>
<p class="l-text">A real analyst question: "Who is the #1 spender in each country, the #2, etc.?"</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH spend AS (
      SELECT c.customer_id, c.country, c.first_name,
             SUM(o.total_usd) AS total
      FROM customers c
      JOIN orders o ON o.customer_id = c.customer_id
      GROUP BY c.customer_id, c.country, c.first_name
    )
    , ranked AS (
      SELECT country, first_name, ROUND(total,2) AS total,
             RANK() OVER (PARTITION BY country ORDER BY total DESC) AS rk
      FROM spend
    )
    SELECT * FROM ranked WHERE rk &lt;= 3 ORDER BY country, rk
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) CTE 1: spend per (customer, country). 2) CTE 2: RANK partitioned by country. 3) Final SELECT keeps only the top 3. 4) On engines that support <code>QUALIFY</code> (BigQuery, Snowflake, modern SQLite), the second CTE can be skipped and the filter written inline. 5) Output: top 3 spenders per country, ranks intact.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Window function gotchas</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cannot filter in WHERE</div><div class="card-body">Window functions run AFTER WHERE. Wrap in CTE/subquery to filter on them.</div></div>
<div class="calc-card"><div class="card-title">Default frame</div><div class="card-body">With ORDER BY, default frame is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — running. Without ORDER BY, the whole partition.</div></div>
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">Window functions need sorted partitions — can be expensive on huge tables. Index on partition+order columns helps.</div></div>
<div class="calc-card"><div class="card-title">Vs GROUP BY</div><div class="card-body">GROUP BY collapses; windows preserve. Pick based on whether you need every row in the output.</div></div>
</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Key takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Window functions compute per-row metrics over related rows without collapsing.<br><strong>2.</strong> <code>OVER (PARTITION BY ... ORDER BY ...)</code> is the universal shape.<br><strong>3.</strong> ROW_NUMBER, RANK, DENSE_RANK differ in tie handling.<br><strong>4.</strong> LAG/LEAD enable day-over-day, churn-since-last-event analysis.<br><strong>5.</strong> SUM/AVG with ORDER BY = running totals; with frames = moving windows.<br><strong>6.</strong> NTILE buckets rows into equal-sized groups for percentile analysis.</div></div>
</div>

<div class="calc-graph"><div id="sql-l6-plot-en" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var x=[1,2,3,4,5,6,7,8,9,10,11,12];
  var raw=[100,103,98,105,110,108,115,112,118,122,120,125];
  var ma=raw.map(function(v,i){var s=0,c=0; for(var k=Math.max(0,i-2);k<=i;k++){s+=raw[k];c++;} return s/c;});
  var data=[{x:x,y:raw,type:'scatter',mode:'lines+markers',name:'price'},{x:x,y:ma,type:'scatter',mode:'lines',name:'3-day MA',line:{color:T.accent,width:3}}];
  var layout={paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid,title:'day'},yaxis:{gridcolor:T.grid,title:'price'},legend:{orientation:'h',y:-0.25,x:0.5,xanchor:'center'},margin:{t:30,r:30,b:80,l:60}};
  var elEN=document.getElementById('sql-l6-plot-en'); if(elEN) Plotly.newPlot(elEN,data,layout,{displayModeBar:false});
},250);</script>`,

tr: `<p class="l-text"><strong>Pencere fonksiyonları SQL'in süper gücüdür.</strong> Diğer satırlara bağımlı satır başı metrikleri hesaplar — yürüyen toplamlar, sıralamalar, hareketli ortalamalar, gün-üstüne-gün değişimler — sonucu grup başına tek satıra indirgemeden.</p>
<p class="l-text">GROUP BY "çok satırı bir satıra katlamak" ise, pencereler "çok satır üstünde hesap yap ama hepsini koru". Bir kez gördüğünüzde geri dönemezsiniz. Bu derste ROW_NUMBER, RANK, DENSE_RANK, LAG/LEAD, yürüyen agregatlar ve NTILE.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>OVER, PARTITION BY ve ORDER BY ifadeleri ile pencere fonksiyonu yaz</li><li>Satırları yinelemesini kaldırmak veya sıralamak için ROW_NUMBER, RANK, DENSE_RANK kullan</li><li>Pencere üzerinden SUM ve AVG ile yürüyen toplam ve hareketli ortalama hesapla</li><li>Zaman serisi ve olay analizi için LAG ve LEAD ile satırları karşılaştır</li><li>Pencere fonksiyonlarıyla bir müşteri yaşam boyu değeri (CLV) sorgusu inşa et</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Pencere fonksiyonunun şekli</h2>
<p class="l-text">Anatomi: <code>function() OVER (PARTITION BY ... ORDER BY ...)</code>.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">function()</div><div class="card-body">Agregat veya sıralama: SUM, AVG, ROW_NUMBER, RANK, LAG, vb.</div></div>
<div class="calc-card"><div class="card-title">PARTITION BY</div><div class="card-body">Opsiyonel. Satırları gruplara ayırır; pencere grup başına sıfırlanır. GROUP BY gibi ama satırlar yaşar.</div></div>
<div class="calc-card"><div class="card-title">ORDER BY</div><div class="card-body">Opsiyonel. Bölme içinde sıra tanımlar — sıralama, LAG, yürüyen toplam için zorunlu.</div></div>
<div class="calc-card"><div class="card-title">Frame (ileri)</div><div class="card-body">ROWS BETWEEN ... — hareketli ortalama için açık satır penceresi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. ROW_NUMBER — benzersiz numara</h2>
<p class="l-text">Her satırı bölmesi içinde 1, 2, 3, ... ile numaralar, belirtilen sıraya göre.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      customer_id,
      total_usd,
      order_date,
      ROW_NUMBER() OVER (
        PARTITION BY customer_id
        ORDER BY order_date
      ) AS order_seq
    FROM orders
    ORDER BY customer_id, order_seq
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Her müşteri için siparişlerini tarihe göre 1, 2, 3 numaralar. 2) <code>PARTITION BY customer_id</code> her müşteride numarayı sıfırlar. 3) <code>ORDER BY order_date</code> "ilk" = en erken sipariş. 4) Dış sorguda <code>order_seq = 1</code> filtresi "her müşterinin ilk siparişi"ni verir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. RANK vs DENSE_RANK vs ROW_NUMBER</h2>
<p class="l-text">Üç sıralama, üç farklı eşitlik davranışı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ROW_NUMBER</div><div class="card-body">Daima benzersiz. İki eşit değer rastgele farklı numara alır.</div></div>
<div class="calc-card"><div class="card-title">RANK</div><div class="card-body">Eşitler aynı sırayı paylaşır; sonra boşluk atlar. 1, 2, 2, 4 — 3 atlanır.</div></div>
<div class="calc-card"><div class="card-title">DENSE_RANK</div><div class="card-body">Eşitler aynı sıra; boşluk yok. 1, 2, 2, 3.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      name,
      category,
      price_usd,
      ROW_NUMBER() OVER (PARTITION BY category ORDER BY price_usd DESC) AS rn,
      RANK()       OVER (PARTITION BY category ORDER BY price_usd DESC) AS rk,
      DENSE_RANK() OVER (PARTITION BY category ORDER BY price_usd DESC) AS drk
    FROM products
    ORDER BY category, rn
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Üç sıralama yan yana, kategoriye bölünmüş. 2) RN, RK, DRK sütunlarını kıyaslayın: fiyatlar tekse aynı, eşitlik varsa farklı. 3) ROW_NUMBER her sırada tam tek satır gerektiğinde (kategori başı en iyi ürün). 4) RANK iş semantiği için eşitlik önemli olduğunda ("net 1 yok").</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Grup başına ilk N — en temiz kalıp</h2>
<p class="l-text">"Kategori başına gelirde ilk 3 ürün." CTE içinde pencere fonksiyonu, sonra filtre.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH ranked AS (
      SELECT
        p.category,
        p.name,
        SUM(o.total_usd) AS revenue,
        ROW_NUMBER() OVER (
          PARTITION BY p.category
          ORDER BY SUM(o.total_usd) DESC
        ) AS rn
      FROM products p
      JOIN orders o ON o.product_id = p.product_id
      GROUP BY p.category, p.name
    )
    SELECT category, name, ROUND(revenue,2) AS revenue
    FROM ranked
    WHERE rn &lt;= 3
    ORDER BY category, rn
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) (Kategori, ürün) başına gelir topla. 2) <code>ROW_NUMBER()</code> her kategoride gelire göre sıralar. 3) Dış sorgu yalnız ilk 3'ü tutar. 4) Pencere fonksiyonları agregat ifade kullanabilir — <code>SUM(o.total_usd)</code> hem SELECT hem OVER ORDER BY içinde geçerli. 5) Aynı kalıp "ülke başı ilk 5 müşteri", "müşteri başı ilk 2 sipariş" için.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. LAG ve LEAD — komşulara bak</h2>
<p class="l-text"><code>LAG(col, n)</code> bölme içinde <em>n</em> satır geriye gitmiş <code>col</code> değerini döner. <code>LEAD</code> ileriye bakar. Gün-üstüne-gün değişim için ideal.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      date,
      close,
      LAG(close, 1) OVER (ORDER BY date) AS prev_close,
      ROUND(close - LAG(close, 1) OVER (ORDER BY date), 2) AS change_abs,
      ROUND(100.0 * (close - LAG(close, 1) OVER (ORDER BY date))
                  / LAG(close, 1) OVER (ORDER BY date), 2) AS change_pct
    FROM stocks
    ORDER BY date
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>LAG(close, 1) OVER (ORDER BY date)</code> = önceki günün kapanışı. 2) Çıkar = mutlak değişim. 3) Böl = yüzde değişim. 4) İlk satırda prev_close NULL — önceki gün yok. 5) Bu tek sorgu pandas <code>pct_change()</code>'i veritabanı içinde yapar.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. SUM OVER ile yürüyen toplam</h2>
<p class="l-text">OVER içine ORDER BY ekleyin, agregat <em>kümülatif</em> olur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      customer_id,
      order_date,
      total_usd,
      ROUND(SUM(total_usd) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
      ), 2) AS cumulative_spend
    FROM orders
    WHERE customer_id IN (1, 2, 3)
    ORDER BY customer_id, order_date
    LIMIT 30
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>SUM(total_usd) OVER (PARTITION BY customer_id ORDER BY order_date)</code> = müşteri başı yürüyen toplam. 2) Her satır o siparişe kadar harcanan toplam. 3) ORDER BY olmazsa SUM bölme genel toplamı olur (yürümez). 4) Okunabilir olsun diye 3 müşteriyle sınırlı — WHERE'i kaldırın tam veri için.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Hareketli ortalama — açık çerçeve</h2>
<p class="l-text">7 günlük hareketli ortalama için çerçeve belirtin: <code>ROWS BETWEEN 6 PRECEDING AND CURRENT ROW</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      date,
      close,
      ROUND(AVG(close) OVER (
        ORDER BY date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
      ), 2) AS ma7
    FROM stocks
    ORDER BY date
    LIMIT 25
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Çerçeve = mevcutta biten 7 satırlık pencere. 2) Bu pencerede <code>AVG</code> = 7 günlük hareketli ortalama. 3) İlk 6 satırda pencere kısa olur (hata yok — sadece var olanı ortalar). 4) AVG yerine SUM, MIN, MAX, STDEV ile farklı pencereli istatistikler. 5) pandas <code>rolling(7).mean()</code> ile özdeş.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. NTILE — N eşit gruba dağıt</h2>
<p class="l-text">Persentil dilimleri, desil, çeyrek için kullanışlı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH spend AS (
      SELECT customer_id, SUM(total_usd) AS total_spend
      FROM orders
      GROUP BY customer_id
    )
    SELECT
      customer_id,
      ROUND(total_spend, 2) AS total_spend,
      NTILE(4) OVER (ORDER BY total_spend) AS quartile
    FROM spend
    ORDER BY total_spend DESC
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Müşteri başı toplam harcama. 2) <code>NTILE(4)</code> her müşteriyi bir çeyreğe atar (1 = en düşük, 4 = en yüksek). 3) VIP segmentasyon, kohort analizi, adalet kontrolleri için. 4) NTILE(10) desil, NTILE(100) persentil.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Ülke içinde harcamaya göre müşteri sırası</h2>
<p class="l-text">Gerçek analist sorusu: "Her ülkenin 1. harcayanı kim, 2., 3.?"</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH spend AS (
      SELECT c.customer_id, c.country, c.first_name,
             SUM(o.total_usd) AS total
      FROM customers c
      JOIN orders o ON o.customer_id = c.customer_id
      GROUP BY c.customer_id, c.country, c.first_name
    ), ranked AS (
      SELECT country, first_name, ROUND(total,2) AS total,
             RANK() OVER (PARTITION BY country ORDER BY total DESC) AS rk
      FROM spend
    )
    SELECT * FROM ranked WHERE rk &lt;= 3 ORDER BY country, rk
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) CTE 1: (müşteri, ülke) başı harcama. 2) CTE 2: ülkeye göre RANK. 3) Son SELECT ilk 3'ü tutar. 4) <code>QUALIFY</code>'ı destekleyen motorlarda (BigQuery, Snowflake, modern SQLite) ikinci CTE'siz tek adımda yazılabilir. 5) Çıktı: ülke başı en yüksek harcayan 3 müşteri, sıralarıyla.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Pencere fonksiyonu tuzakları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">WHERE'de filtrelenmez</div><div class="card-body">Pencere WHERE'den SONRA çalışır. CTE/alt sorguya sarıp filtreleyin.</div></div>
<div class="calc-card"><div class="card-title">Varsayılan çerçeve</div><div class="card-body">ORDER BY varsa varsayılan RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — yürüyen. Yoksa tüm bölme.</div></div>
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">Sıralı bölme gerektirir — büyük tabloda pahalı olabilir. Bölme+sıra sütunlarında indeks yardım eder.</div></div>
<div class="calc-card"><div class="card-title">GROUP BY ile fark</div><div class="card-body">GROUP BY satırı sıkıştırır; pencere korur. Çıktıda her satır gerekiyor mu sorusuna göre seçin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Önemli çıkarımlar</h2>
<div class="think-box"><div class="think-label">ÖNEMLİ NOKTALAR</div><div class="think-body"><strong>1.</strong> Pencere fonksiyonları satırları sıkıştırmadan ilişkili satırlar üstünde hesaplar.<br><strong>2.</strong> Evrensel şekil <code>OVER (PARTITION BY ... ORDER BY ...)</code>.<br><strong>3.</strong> ROW_NUMBER, RANK, DENSE_RANK eşitlikte farklı.<br><strong>4.</strong> LAG/LEAD ile gün-üstüne-gün, son olaydan beri analizi.<br><strong>5.</strong> ORDER BY'lı SUM/AVG = yürüyen; çerçeveli = hareketli.<br><strong>6.</strong> NTILE persentil için satırları eşit kovalara böler.</div></div>
</div>

<div class="calc-graph"><div id="sql-l6-plot-tr" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var x=[1,2,3,4,5,6,7,8,9,10,11,12];
  var raw=[100,103,98,105,110,108,115,112,118,122,120,125];
  var ma=raw.map(function(v,i){var s=0,c=0; for(var k=Math.max(0,i-2);k<=i;k++){s+=raw[k];c++;} return s/c;});
  var data=[{x:x,y:raw,type:'scatter',mode:'lines+markers',name:'fiyat'},{x:x,y:ma,type:'scatter',mode:'lines',name:'3 günlük HO',line:{color:T.accent,width:3}}];
  var layout={paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid,title:'gün'},yaxis:{gridcolor:T.grid,title:'fiyat'},legend:{orientation:'h',y:-0.25,x:0.5,xanchor:'center'},margin:{t:30,r:30,b:80,l:60}};
  var elTR=document.getElementById('sql-l6-plot-tr'); if(elTR) Plotly.newPlot(elTR,data,layout,{displayModeBar:false});
},250);</script>
`
};
