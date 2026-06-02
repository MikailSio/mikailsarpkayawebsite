window.SQL_L3 = {

en: `<p class="l-text"><strong>Aggregation turns rows into insights.</strong> A table of 2,000 orders is data; "average order value per country, sorted descending" is a finding. The bridge is GROUP BY plus aggregate functions.</p>
<p class="l-text">In this lesson we cover COUNT, SUM, AVG, MIN, MAX, multi-column grouping, and the often-confused HAVING clause. Every example pulls a real insight from churn, customers, products or orders.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Aggregate rows with COUNT, SUM, AVG, MIN, and MAX functions</li><li>Group rows with GROUP BY and filter aggregates with HAVING</li><li>Compute conditional aggregates using SUM(CASE WHEN ...)</li><li>Handle NULLs correctly inside aggregates and avoid silent miscounts</li><li>Combine GROUP BY with multiple columns to build summary tables</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The five workhorse aggregates</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">COUNT(*)</div><div class="card-body">Total rows including those with NULLs.</div></div>
<div class="calc-card"><div class="card-title">COUNT(col)</div><div class="card-body">Non-NULL values in that column.</div></div>
<div class="calc-card"><div class="card-title">SUM(col)</div><div class="card-body">Total of numeric values, NULLs ignored.</div></div>
<div class="calc-card"><div class="card-title">AVG(col)</div><div class="card-body">Arithmetic mean of non-NULL numeric values.</div></div>
<div class="calc-card"><div class="card-title">MIN / MAX</div><div class="card-body">Smallest / largest. Works on numbers, dates, and strings.</div></div>
</div>
<p class="l-text">The arithmetic mean used by AVG:</p>
<div class="katex-block">$$\\text{AVG} = \\frac{1}{N}\\sum_{i=1}^{N} x_i$$</div>
<p class="l-text">where N is the number of non-NULL rows in the group. Median, mode, percentiles need different functions or window tricks (L6).</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Aggregating the whole table</h2>
<p class="l-text">Without GROUP BY, an aggregate collapses the entire table to one row.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      COUNT(*)              AS n_customers,
      AVG(monthly_charge)   AS avg_monthly,
      MIN(monthly_charge)   AS min_monthly,
      MAX(monthly_charge)   AS max_monthly,
      SUM(total_charge)     AS total_revenue
    FROM churn
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Five aggregates over the entire churn table. 2) Output is one row with five columns. 3) Notice how aliases (<code>AS ...</code>) make the result self-documenting. 4) This single query gives you a snapshot of the customer base.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col)</h2>
<p class="l-text">Three different counts, three different meanings — knowing the difference saves you from silent bugs.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      COUNT(*)                       AS total_rows,
      COUNT(status)                  AS rows_with_status,
      COUNT(DISTINCT customer_id)    AS unique_customers,
      COUNT(DISTINCT product_id)     AS unique_products
    FROM orders
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>COUNT(*)</code> counts every row. 2) <code>COUNT(status)</code> counts rows where status is not NULL — useful for "how complete is this column?" 3) <code>COUNT(DISTINCT customer_id)</code> tells how many unique buyers exist. 4) Compare unique_customers to total_rows: ratio reveals repeat-purchase intensity.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. GROUP BY — one bucket per value</h2>
<p class="l-text">GROUP BY splits rows into buckets by column values, then runs aggregates per bucket.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      contract_type,
      COUNT(*)              AS customers,
      AVG(monthly_charge)   AS avg_charge,
      AVG(churned)          AS churn_rate
    FROM churn
    GROUP BY contract_type
    ORDER BY churn_rate DESC
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>GROUP BY contract_type</code> creates one bucket per distinct contract type. 2) Each output row shows: count of customers, average monthly charge, and churn rate for that contract. 3) Because churned is 0/1, <code>AVG(churned)</code> equals the fraction churned — a clean trick. 4) The result almost always shows month-to-month with the highest churn — a real business insight.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Multi-column GROUP BY</h2>
<p class="l-text">Group by more than one dimension to see cross-tabulated patterns.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      contract_type,
      payment_method,
      COUNT(*)            AS n,
      AVG(churned)        AS churn_rate,
      AVG(monthly_charge) AS avg_charge
    FROM churn
    GROUP BY contract_type, payment_method
    HAVING n &gt;= 10
    ORDER BY churn_rate DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Two-key grouping makes one bucket per (contract_type, payment_method) combination. 2) <code>HAVING n &gt;= 10</code> drops thin segments where the rate would be noisy. 3) Sorting by churn_rate surfaces the most fragile combinations first. 4) Insight: month-to-month + electronic check is typically the worst — a clear retention target.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. WHERE vs HAVING — when each fires</h2>
<p class="l-text">A frequent confusion. The simple rule: WHERE filters individual rows <em>before</em> grouping; HAVING filters whole groups <em>after</em> aggregating.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">WHERE</div><div class="card-body">Per-row condition. Cannot use aggregate functions.</div></div>
<div class="calc-card"><div class="card-title">HAVING</div><div class="card-body">Per-group condition. Can use aggregates like COUNT, AVG.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      category,
      COUNT(*)         AS n_products,
      AVG(price_usd)   AS avg_price,
      MAX(price_usd)   AS max_price
    FROM products
    WHERE stock &gt; 0
    GROUP BY category
    HAVING AVG(price_usd) &gt; 50
    ORDER BY avg_price DESC
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>WHERE stock &gt; 0</code> excludes out-of-stock items <em>row by row</em>, before grouping. 2) <code>GROUP BY category</code> aggregates remaining rows per category. 3) <code>HAVING AVG(price_usd) &gt; 50</code> drops categories whose average is too low. 4) ORDER BY puts pricier categories first. 5) WHERE on a non-aggregate, HAVING on the aggregate — clean separation.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Aggregating with conditional sums (CASE)</h2>
<p class="l-text">A classic trick: count or sum only when a condition holds. Useful for "rate" calculations on multiple slices in one query.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      contract_type,
      COUNT(*)                                               AS total,
      SUM(CASE WHEN churned = 1 THEN 1 ELSE 0 END)           AS lost,
      SUM(CASE WHEN churned = 0 THEN 1 ELSE 0 END)           AS kept,
      ROUND(100.0 * SUM(CASE WHEN churned = 1 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_lost
    FROM churn
    GROUP BY contract_type
    ORDER BY pct_lost DESC
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>CASE WHEN ... THEN 1 ELSE 0 END</code> emits 1 only for matching rows. 2) <code>SUM</code> over those zeros and ones counts matches — same as filtered count. 3) <code>ROUND(... , 1)</code> trims to one decimal. 4) <code>100.0 *</code> forces float division (integer-divided 0/1 would give zero in some dialects). 5) Output: total, lost, kept, and percent lost per contract — board-ready.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Top countries by customers</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      country,
      COUNT(*) AS n_customers
    FROM customers
    GROUP BY country
    ORDER BY n_customers DESC
    LIMIT 5
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Group customers by country. 2) Count rows per group. 3) ORDER BY DESC then LIMIT 5 = top 5. 4) Replace COUNT(*) with SUM(total_charge) (joining with churn) to get "top 5 countries by revenue".</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Order analytics — revenue per status</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      status,
      COUNT(*)               AS n_orders,
      ROUND(SUM(total_usd),2) AS revenue,
      ROUND(AVG(total_usd),2) AS avg_order,
      MIN(order_date)        AS first_seen,
      MAX(order_date)        AS last_seen
    FROM orders
    WHERE status IS NOT NULL
    GROUP BY status
    ORDER BY revenue DESC
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Drops rows with NULL status before grouping. 2) Six aggregates per status — count, total revenue, average ticket, date range. 3) MIN/MAX on a date column give earliest/latest order dates. 4) ROUND(... , 2) keeps two decimals — readable for currency.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Common gotchas</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Non-grouped columns</div><div class="card-body">If a column appears in SELECT but not in an aggregate, it must be in GROUP BY. Otherwise behavior is undefined or errors.</div></div>
<div class="calc-card"><div class="card-title">NULL in GROUP BY</div><div class="card-body">All NULLs collapse into one bucket — you may need <code>COALESCE(col, 'unknown')</code>.</div></div>
<div class="calc-card"><div class="card-title">Integer division</div><div class="card-body">In SQLite <code>1/2 = 0</code>. Use <code>1.0/2</code> or <code>CAST(x AS REAL)</code>.</div></div>
<div class="calc-card"><div class="card-title">Empty groups</div><div class="card-body">A group is only created if at least one row exists. To force "all categories even if zero", use a left-join from a dimension table.</div></div>
</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Key takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Aggregates collapse rows: COUNT, SUM, AVG, MIN, MAX.<br><strong>2.</strong> COUNT(*) ≠ COUNT(col) ≠ COUNT(DISTINCT col).<br><strong>3.</strong> GROUP BY creates buckets; aggregates run per bucket.<br><strong>4.</strong> WHERE filters rows; HAVING filters groups.<br><strong>5.</strong> AVG on a 0/1 column equals the rate — useful pattern.<br><strong>6.</strong> Use SUM(CASE WHEN ...) for conditional aggregates in one query.</div></div>
</div>

<div class="calc-graph"><div id="sql-l3-plot-en" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['Month-to-month','One year','Two year'],y:[42,11,3],type:'bar',marker:{color:T.accent}}];
  var layout={title:'Illustrative churn rate (%) by contract type',paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid},yaxis:{gridcolor:T.grid,title:'churn %'},margin:{t:50,r:30,b:60,l:60}};
  var elEN=document.getElementById('sql-l3-plot-en'); if(elEN) Plotly.newPlot(elEN,data,layout,{displayModeBar:false});
},250);</script>`,

tr: `<p class="l-text"><strong>Toplama (aggregation) satırları içgörüye dönüştürür.</strong> 2.000 siparişlik bir tablo veridir; "ülke başına ortalama sipariş tutarı, azalan sıralı" bir bulgudur. Köprü GROUP BY ve toplama fonksiyonlarıdır.</p>
<p class="l-text">Bu derste COUNT, SUM, AVG, MIN, MAX, çoklu sütun gruplama ve sıkça karıştırılan HAVING'i ele alırız. Her örnek churn, customers, products veya orders'tan gerçek bir içgörü çeker.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>COUNT, SUM, AVG, MIN ve MAX fonksiyonlarıyla satırları topla</li><li>GROUP BY ile satırları grupla ve HAVING ile toplulukları filtrele</li><li>SUM(CASE WHEN ...) kullanarak koşullu toplulukları hesapla</li><li>Topluluklar içinde NULL'ları doğru işle ve sessiz yanlış sayımdan kaçın</li><li>Özet tablolar inşa etmek için GROUP BY'ı birden fazla sütunla birleştir</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Beş ana toplama fonksiyonu</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">COUNT(*)</div><div class="card-body">NULL'lar dahil toplam satır sayısı.</div></div>
<div class="calc-card"><div class="card-title">COUNT(col)</div><div class="card-body">O sütundaki NULL olmayan değerler.</div></div>
<div class="calc-card"><div class="card-title">SUM(col)</div><div class="card-body">Sayısal değerlerin toplamı, NULL'lar yok sayılır.</div></div>
<div class="calc-card"><div class="card-title">AVG(col)</div><div class="card-body">NULL olmayan sayısal değerlerin aritmetik ortalaması.</div></div>
<div class="calc-card"><div class="card-title">MIN / MAX</div><div class="card-body">En küçük / en büyük. Sayı, tarih, metin üzerinde çalışır.</div></div>
</div>
<p class="l-text">AVG'nin kullandığı aritmetik ortalama:</p>
<div class="katex-block">$$\\text{AVG} = \\frac{1}{N}\\sum_{i=1}^{N} x_i$$</div>
<p class="l-text">N gruptaki NULL olmayan satır sayısıdır. Medyan, mod, persentiller farklı fonksiyonlar veya pencere hileleri ister (L6).</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Tüm tabloyu özetlemek</h2>
<p class="l-text">GROUP BY olmadan agregat tüm tabloyu tek satıra indirir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      COUNT(*)              AS n_customers,
      AVG(monthly_charge)   AS avg_monthly,
      MIN(monthly_charge)   AS min_monthly,
      MAX(monthly_charge)   AS max_monthly,
      SUM(total_charge)     AS total_revenue
    FROM churn
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Tüm churn tablosu üzerinde beş agregat. 2) Çıktı tek satır beş sütun. 3) Aliaslar (<code>AS ...</code>) sonucu kendi kendini açıklayan hale getirir. 4) Bu tek sorgu müşteri tabanının fotoğrafıdır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col)</h2>
<p class="l-text">Üç farklı sayım, üç farklı anlam — farkı bilmek sessiz hatalardan korur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      COUNT(*)                       AS total_rows,
      COUNT(status)                  AS rows_with_status,
      COUNT(DISTINCT customer_id)    AS unique_customers,
      COUNT(DISTINCT product_id)     AS unique_products
    FROM orders
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>COUNT(*)</code> her satırı sayar. 2) <code>COUNT(status)</code> NULL olmayan satırları sayar — "bu sütun ne kadar dolu?" için. 3) <code>COUNT(DISTINCT customer_id)</code> kaç farklı alıcı var. 4) unique_customers'ı total_rows'a oranlayın: tekrar satın alma yoğunluğu.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. GROUP BY — değer başına bir kova</h2>
<p class="l-text">GROUP BY satırları sütun değerlerine göre kovalara ayırır, sonra agregatları kova başına çalıştırır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      contract_type,
      COUNT(*)              AS customers,
      AVG(monthly_charge)   AS avg_charge,
      AVG(churned)          AS churn_rate
    FROM churn
    GROUP BY contract_type
    ORDER BY churn_rate DESC
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>GROUP BY contract_type</code> her ayrı sözleşme tipi için bir kova. 2) Her çıktı satırı: o sözleşmedeki müşteri sayısı, ortalama aylık ücret, kayıp oranı. 3) churned 0/1 olduğundan <code>AVG(churned)</code> kayıp oranına eşit — temiz bir hile. 4) Sonuç neredeyse her zaman aylık (month-to-month) sözleşmeyi en yüksek kayıpla gösterir — gerçek bir iş içgörüsü.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Çoklu sütunlu GROUP BY</h2>
<p class="l-text">Birden fazla boyutta gruplayarak çapraz örüntüleri görün.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      contract_type,
      payment_method,
      COUNT(*)            AS n,
      AVG(churned)        AS churn_rate,
      AVG(monthly_charge) AS avg_charge
    FROM churn
    GROUP BY contract_type, payment_method
    HAVING n &gt;= 10
    ORDER BY churn_rate DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) İki anahtarlı gruplama (contract_type, payment_method) çiftleri için kovalar üretir. 2) <code>HAVING n &gt;= 10</code> oranın gürültülü olacağı ince segmentleri eler. 3) churn_rate'e göre sıralama en kırılganları öne çıkarır. 4) İçgörü: aylık + elektronik çek genellikle en kötüdür — net bir elde tutma hedefi.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. WHERE vs HAVING — hangisi ne zaman</h2>
<p class="l-text">Sık karıştırılır. Basit kural: WHERE bireysel satırları gruplama <em>öncesi</em> filtreler; HAVING grupları toplama <em>sonrası</em> filtreler.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">WHERE</div><div class="card-body">Satır başı koşul. Agregat fonksiyon kullanılamaz.</div></div>
<div class="calc-card"><div class="card-title">HAVING</div><div class="card-body">Grup başı koşul. COUNT, AVG gibi agregatlar kullanılır.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      category,
      COUNT(*)         AS n_products,
      AVG(price_usd)   AS avg_price,
      MAX(price_usd)   AS max_price
    FROM products
    WHERE stock &gt; 0
    GROUP BY category
    HAVING AVG(price_usd) &gt; 50
    ORDER BY avg_price DESC
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>WHERE stock &gt; 0</code> stokta olmayanları <em>satır satır</em>, gruplamadan önce eler. 2) <code>GROUP BY category</code> kalanları kategoriye göre toplar. 3) <code>HAVING AVG(price_usd) &gt; 50</code> ortalaması düşük kategorileri atar. 4) ORDER BY pahalı kategoriyi öne alır. 5) WHERE agregatsızda, HAVING agregatta — temiz ayrım.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Koşullu toplama (CASE) ile agregat</h2>
<p class="l-text">Klasik hile: yalnızca koşul sağlandığında say veya topla. Tek sorguda birden fazla "oran" hesaplamak için.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      contract_type,
      COUNT(*)                                               AS total,
      SUM(CASE WHEN churned = 1 THEN 1 ELSE 0 END)           AS lost,
      SUM(CASE WHEN churned = 0 THEN 1 ELSE 0 END)           AS kept,
      ROUND(100.0 * SUM(CASE WHEN churned = 1 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_lost
    FROM churn
    GROUP BY contract_type
    ORDER BY pct_lost DESC
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>CASE WHEN ... THEN 1 ELSE 0 END</code> yalnızca eşleşen satırlarda 1 üretir. 2) Bu 0/1'lerin <code>SUM</code>'u eşleşme sayısına eşittir. 3) <code>ROUND(... , 1)</code> bir ondalığa kırpar. 4) <code>100.0 *</code> kayan nokta bölmeyi zorlar (tam sayı 0/1 bazı lehçelerde sıfır verir). 5) Çıktı: sözleşme başına toplam, kayıp, kalan ve kayıp yüzdesi — yöneticiye hazır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Müşteri sayısına göre ülke sıralaması</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      country,
      COUNT(*) AS n_customers
    FROM customers
    GROUP BY country
    ORDER BY n_customers DESC
    LIMIT 5
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Müşterileri ülkeye göre grupla. 2) Grup başına satır say. 3) ORDER BY DESC + LIMIT 5 = ilk 5. 4) COUNT(*) yerine SUM(total_charge) (churn ile join) "gelirde ilk 5 ülke" verir.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Sipariş analitiği — duruma göre gelir</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      status,
      COUNT(*)               AS n_orders,
      ROUND(SUM(total_usd),2) AS revenue,
      ROUND(AVG(total_usd),2) AS avg_order,
      MIN(order_date)        AS first_seen,
      MAX(order_date)        AS last_seen
    FROM orders
    WHERE status IS NOT NULL
    GROUP BY status
    ORDER BY revenue DESC
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Gruplamadan önce NULL durumlu satırları atar. 2) Durum başına altı agregat — sayı, gelir, ortalama, tarih aralığı. 3) Tarih sütununda MIN/MAX en erken/en geç sipariş tarihini verir. 4) ROUND(... , 2) iki ondalığa yuvarlar — para için okunaklı.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Yaygın tuzaklar</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gruplanmamış sütun</div><div class="card-body">SELECT'te ama agregatta olmayan sütun GROUP BY'da olmalı. Yoksa davranış tanımsız ya da hata.</div></div>
<div class="calc-card"><div class="card-title">GROUP BY'da NULL</div><div class="card-body">Tüm NULL'lar tek kovaya düşer — <code>COALESCE(col, 'unknown')</code> isteyebilirsiniz.</div></div>
<div class="calc-card"><div class="card-title">Tam sayı bölme</div><div class="card-body">SQLite'ta <code>1/2 = 0</code>. <code>1.0/2</code> veya <code>CAST(x AS REAL)</code> kullanın.</div></div>
<div class="calc-card"><div class="card-title">Boş gruplar</div><div class="card-body">Bir grup ancak en az bir satır varsa oluşur. "Sıfır olsa bile tüm kategoriler" için boyut tablosundan LEFT JOIN gerek.</div></div>
</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Önemli çıkarımlar</h2>
<div class="think-box"><div class="think-label">ÖNEMLİ NOKTALAR</div><div class="think-body"><strong>1.</strong> Agregatlar satırı sıkıştırır: COUNT, SUM, AVG, MIN, MAX.<br><strong>2.</strong> COUNT(*) ≠ COUNT(col) ≠ COUNT(DISTINCT col).<br><strong>3.</strong> GROUP BY kovalar üretir; agregatlar kova başına.<br><strong>4.</strong> WHERE satır filtreler; HAVING grup filtreler.<br><strong>5.</strong> 0/1 sütununda AVG = oran — kullanışlı kalıp.<br><strong>6.</strong> Tek sorguda koşullu toplama için SUM(CASE WHEN ...).</div></div>
</div>

<div class="calc-graph"><div id="sql-l3-plot-tr" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['Month-to-month','One year','Two year'],y:[42,11,3],type:'bar',marker:{color:T.accent}}];
  var layout={title:'Sözleşme tipine göre örnek kayıp oranı (%)',paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid},yaxis:{gridcolor:T.grid,title:'kayıp %'},margin:{t:50,r:30,b:60,l:60}};
  var elTR=document.getElementById('sql-l3-plot-tr'); if(elTR) Plotly.newPlot(elTR,data,layout,{displayModeBar:false});
},250);</script>
`
};
