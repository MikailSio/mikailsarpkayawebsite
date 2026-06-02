window.SQL_L10 = {

en: `<p class="l-text"><strong>Time to put it all together.</strong> A real analyst isn't asked "write a SELECT statement"; they're asked "find the at-risk high-value customers and propose a retention plan". This requires multi-step pipelines, intermediate aggregates, and clear final outputs.</p>
<p class="l-text">In this final lesson we build an end-to-end analytics pipeline: monthly cohorts, RFM segmentation, churn-risk features, and a customer-360 view. We export a CSV ready for downstream ML. By the end you will see how SQL alone takes you 80% of the way to a ML-ready dataset.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Translate a real analytics question into a multi-step SQL query</li><li>Combine CTEs, window functions, and joins into one production-grade query</li><li>Compute cohort retention and customer lifetime value end to end</li><li>Compare a SQL solution with the equivalent pandas pipeline</li><li>Document your SQL with comments and naming conventions reviewers will accept</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The analytics workflow</h2>
<p class="l-text">A typical analytics or ML feature-engineering job has four phases. SQL handles the first three; pandas/sklearn handles the last.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Inspect</div><div class="card-body">Schema, row counts, NULL distributions, top values. Always start here.</div></div>
<div class="calc-card"><div class="card-title">2. Transform</div><div class="card-body">Joins, derived columns, aggregations, window features.</div></div>
<div class="calc-card"><div class="card-title">3. Aggregate</div><div class="card-body">One row per analytic unit (customer, day, country) with all features.</div></div>
<div class="calc-card"><div class="card-title">4. Model / report</div><div class="card-body">Hand the table to pandas, sklearn, BI tool, or stakeholders.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Step 1 — sanity inspection</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      (SELECT COUNT(*) FROM customers)                AS n_customers,
      (SELECT COUNT(*) FROM orders)                   AS n_orders,
      (SELECT COUNT(*) FROM churn)                    AS n_churn,
      (SELECT COUNT(DISTINCT customer_id) FROM orders) AS unique_buyers,
      (SELECT MIN(order_date) FROM orders)            AS first_order,
      (SELECT MAX(order_date) FROM orders)            AS last_order,
      ROUND((SELECT AVG(churned) FROM churn), 3)      AS overall_churn_rate
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Seven scalar subqueries assembled into a one-row dashboard. 2) Lets you eyeball table sizes, date range, and base rate. 3) The overall churn rate is the baseline against which segments are compared. 4) Always run this kind of "smell test" before deeper work.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Step 2 — monthly cohort analysis</h2>
<p class="l-text">Group customers by signup month, then track their order behavior. The classic cohort table.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH cohorts AS (
        SELECT
          customer_id,
          strftime('%Y-%m', signup_date) AS cohort_month
        FROM customers
    ),
    cohort_orders AS (
        SELECT
          c.cohort_month,
          COUNT(DISTINCT c.customer_id) AS cohort_size,
          COUNT(o.order_id)             AS n_orders,
          ROUND(SUM(o.total_usd), 2)    AS revenue,
          ROUND(AVG(o.total_usd), 2)    AS avg_order
        FROM cohorts c
        LEFT JOIN orders o USING(customer_id)
        GROUP BY c.cohort_month
    )
    SELECT *,
      ROUND(revenue / NULLIF(cohort_size, 0), 2) AS revenue_per_customer
    FROM cohort_orders
    ORDER BY cohort_month
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) CTE 1: tag every customer with their signup month. 2) CTE 2: LEFT JOIN orders so cohorts with zero orders still appear. 3) Aggregate cohort size and order metrics. 4) Final SELECT adds a per-customer revenue metric — a fairer cross-cohort comparison than absolute revenue. 5) NULLIF avoids divide-by-zero on empty cohorts.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Step 3 — RFM segmentation</h2>
<p class="l-text">RFM = Recency, Frequency, Monetary. The canonical e-commerce segmentation: when did they last buy, how often, how much?</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH rfm_raw AS (
        SELECT
          customer_id,
          CAST(julianday('2026-05-01') - julianday(MAX(order_date)) AS INTEGER) AS recency_days,
          COUNT(*)            AS frequency,
          ROUND(SUM(total_usd), 2) AS monetary
        FROM orders
        GROUP BY customer_id
    ),
    rfm_scored AS (
        SELECT
          customer_id,
          recency_days,
          frequency,
          monetary,
          NTILE(4) OVER (ORDER BY recency_days DESC) AS r_score,
          NTILE(4) OVER (ORDER BY frequency)         AS f_score,
          NTILE(4) OVER (ORDER BY monetary)          AS m_score
        FROM rfm_raw
    )
    SELECT
      customer_id, recency_days, frequency, monetary,
      r_score, f_score, m_score,
      (r_score + f_score + m_score) AS rfm_total,
      CASE
        WHEN r_score &gt;= 3 AND f_score &gt;= 3 AND m_score &gt;= 3 THEN 'champions'
        WHEN r_score &gt;= 3 AND f_score &gt;= 2 THEN 'loyal'
        WHEN r_score &gt;= 3 THEN 'recent'
        WHEN f_score &gt;= 3 THEN 'frequent'
        WHEN m_score &gt;= 3 THEN 'big_spender'
        ELSE 'at_risk'
      END AS segment
    FROM rfm_scored
    ORDER BY rfm_total DESC
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>rfm_raw</code>: per-customer recency (days since last order), frequency (order count), monetary (total spend). 2) <code>rfm_scored</code>: NTILE(4) bins each customer into quartiles per dimension — note recency is sorted DESC so lower days → higher score. 3) Final CASE turns scores into actionable segments: champions, loyal, recent, etc. 4) Marketing teams use this directly — different segments get different messages.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Step 4 — customer 360 view</h2>
<p class="l-text">The holy grail: one row per customer, every relevant feature joined in. Feed this to a churn model.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH order_stats AS (
        SELECT
          customer_id,
          COUNT(*)        AS n_orders,
          ROUND(SUM(total_usd), 2) AS lifetime_spend,
          ROUND(AVG(total_usd), 2) AS avg_order_value,
          MAX(order_date) AS last_order,
          MIN(order_date) AS first_order,
          CAST(julianday('2026-05-01') - julianday(MAX(order_date)) AS INTEGER) AS days_since_last
        FROM orders
        GROUP BY customer_id
    )
    SELECT
      c.customer_id,
      c.first_name,
      c.country,
      c.signup_date,
      ch.contract_type,
      ch.monthly_charge,
      ch.tenure_months,
      ch.num_support_calls,
      ch.churned,
      COALESCE(o.n_orders, 0)        AS n_orders,
      COALESCE(o.lifetime_spend, 0)  AS lifetime_spend,
      COALESCE(o.avg_order_value, 0) AS avg_order_value,
      o.last_order,
      o.days_since_last
    FROM customers c
    LEFT JOIN churn ch       ON ch.customer_id = c.customer_id
    LEFT JOIN order_stats o  ON o.customer_id  = c.customer_id
    ORDER BY ch.churned DESC, o.lifetime_spend DESC
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>order_stats</code> CTE pre-aggregates per customer. 2) LEFT JOINs to customers so customers without churn or order rows still appear. 3) COALESCE turns missing aggregates into 0 — clean for ML. 4) Output: 14 features per customer, ready for sklearn. 5) ORDER BY surfaces churned high-value customers first — the most painful losses.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Step 5 — at-risk segment for retention</h2>
<p class="l-text">A targeted query for the retention team: high-value, short-tenure, recently-supported customers — the preventable churn pool.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH at_risk AS (
        SELECT
          c.customer_id,
          c.first_name,
          c.country,
          ch.monthly_charge,
          ch.tenure_months,
          ch.num_support_calls,
          ch.contract_type,
          ROUND(
            (CASE WHEN ch.contract_type = 'Month-to-month' THEN 0.4 ELSE 0 END) +
            (CASE WHEN ch.num_support_calls &gt;= 3          THEN 0.3 ELSE 0 END) +
            (CASE WHEN ch.tenure_months &lt; 12              THEN 0.2 ELSE 0 END) +
            (CASE WHEN ch.monthly_charge &gt; 80             THEN 0.1 ELSE 0 END)
          , 2) AS risk_score
        FROM customers c
        JOIN churn ch USING(customer_id)
        WHERE ch.churned = 0
    )
    SELECT *
    FROM at_risk
    WHERE risk_score &gt;= 0.5
    ORDER BY risk_score DESC, monthly_charge DESC
    LIMIT 25
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Heuristic risk score: weighted sum of four red flags. 2) Each CASE contributes its weight if the flag fires. 3) Filter to <code>churned = 0</code> — only customers we still have. 4) Threshold and sort — top of the list is the next call list. 5) In production, replace the heuristic with a logistic regression's predicted probability — same SQL plumbing, ML-derived score.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Step 6 — exporting to CSV for downstream ML</h2>
<p class="l-text">The handoff. A pandas DataFrame from <code>run_sql</code> writes to CSV trivially.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>features = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      ch.customer_id,
      ch.tenure_months,
      ch.monthly_charge,
      ch.total_charge,
      ch.num_support_calls,
      CASE WHEN ch.contract_type = 'Month-to-month' THEN 1 ELSE 0 END AS is_monthly,
      CASE WHEN ch.contract_type = 'One year'       THEN 1 ELSE 0 END AS is_yearly,
      CASE WHEN ch.contract_type = 'Two year'       THEN 1 ELSE 0 END AS is_two_year,
      ch.churned AS y
    FROM churn ch
"""</span>)
<span class="fn">print</span>(features.shape)
<span class="fn">print</span>(features.<span class="fn">head</span>())
<span class="cm"># In a real script:</span>
<span class="cm"># features.to_csv('/tmp/churn_features.csv', index=False)</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) SELECT with one-hot encoded contract_type — three boolean columns. 2) Renames churned to y for sklearn convention. 3) <code>features</code> is a 500-row DataFrame ready for <code>train_test_split</code> and <code>LogisticRegression</code>. 4) The CSV export is one line. 5) Same query into Snowflake or BigQuery would feed an Airflow DAG.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. From SQL to the broader stack</h2>
<p class="l-text">SQL is the glue. The same skills work everywhere data is structured.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PostgreSQL</div><div class="card-body">Most popular open-source OLTP. Slightly different functions (<code>NOW()</code> instead of <code>CURRENT_DATE</code>, <code>CONCAT</code> instead of <code>||</code> for safety with NULLs).</div></div>
<div class="calc-card"><div class="card-title">MySQL / MariaDB</div><div class="card-body">Web-stack default. Most syntax identical; some quirks around date functions.</div></div>
<div class="calc-card"><div class="card-title">Snowflake / BigQuery</div><div class="card-body">Cloud data warehouses. Same SQL core; richer window functions (QUALIFY), array types, JSON support.</div></div>
<div class="calc-card"><div class="card-title">DuckDB</div><div class="card-body">Embedded analytics — like SQLite but column-oriented, blazing on aggregates.</div></div>
<div class="calc-card"><div class="card-title">Spark SQL</div><div class="card-body">Distributed compute on petabytes. Same query, runs on a 1000-node cluster.</div></div>
<div class="calc-card"><div class="card-title">pandas read_sql_query</div><div class="card-body">Push the heavy lifting to the database, pull just what you need into Python.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Where to go next</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Window functions deep dive</div><div class="card-body">Frames, named windows, percentile_cont, advanced ranking patterns.</div></div>
<div class="calc-card"><div class="card-title">Query optimization</div><div class="card-body">Read EXPLAIN plans seriously, learn about hash joins vs merge joins.</div></div>
<div class="calc-card"><div class="card-title">Transactions & isolation levels</div><div class="card-body">BEGIN/COMMIT/ROLLBACK, ACID, dirty/non-repeatable/phantom reads.</div></div>
<div class="calc-card"><div class="card-title">dbt</div><div class="card-body">Modern transform tool — write SQL files as a DAG, get tests, docs, lineage.</div></div>
<div class="calc-card"><div class="card-title">SQLAlchemy</div><div class="card-body">Python ORM if you want object-oriented data access (with escape hatch to raw SQL).</div></div>
<div class="calc-card"><div class="card-title">Postgres-specific</div><div class="card-body">JSONB columns, full-text search, generated columns, partial indexes.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. The 10-step recap</h2>
<div class="think-box"><div class="think-label">10-LESSON RECAP</div><div class="think-body"><strong>L1.</strong> Tables, rows, columns, the playground.<br><strong>L2.</strong> SELECT, WHERE, ORDER BY, LIMIT, DISTINCT.<br><strong>L3.</strong> Aggregates, GROUP BY, HAVING.<br><strong>L4.</strong> JOINs — INNER, LEFT, RIGHT, FULL, self.<br><strong>L5.</strong> Subqueries and CTEs (WITH).<br><strong>L6.</strong> Window functions — rank, LAG/LEAD, running totals.<br><strong>L7.</strong> Dates, strings, CASE, NULL handling.<br><strong>L8.</strong> Indexes, EXPLAIN, performance.<br><strong>L9.</strong> Schema design, constraints, normalization.<br><strong>L10.</strong> Real analytics pipeline (this lesson).</div></div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Final key takeaways</h2>
<div class="think-box"><div class="think-label">FINAL TAKEAWAYS</div><div class="think-body"><strong>1.</strong> SQL takes you 80% of the way to a ML-ready dataset. Master it.<br><strong>2.</strong> Multi-step pipelines are CTE-stacks: inspect → transform → aggregate → export.<br><strong>3.</strong> Cohort analysis, RFM, customer-360 are reusable templates — adapt to any business.<br><strong>4.</strong> Push computation into the database; pull only the final aggregate into Python.<br><strong>5.</strong> Same SQL works on SQLite, Postgres, MySQL, Snowflake, BigQuery — pick based on scale and pricing.<br><strong>6.</strong> Production = SQL + version control (dbt, Liquibase) + tests + monitoring. Treat queries as code.</div></div>
</div>

<div class="calc-graph"><div id="sql-l10-plot-en" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{values:[35,25,20,12,8],labels:['Champions','Loyal','At-risk','Big spenders','Recent only'],type:'pie',marker:{colors:[T.accent,'#5dc9e8','#e88a4d','#c8a96e','#a06ee8']}}];
  var layout={paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},legend:{orientation:'h',y:-0.1,x:0.5,xanchor:'center'},margin:{t:30,r:30,b:80,l:30}};
  var elEN=document.getElementById('sql-l10-plot-en'); if(elEN) Plotly.newPlot(elEN,data,layout,{displayModeBar:false});
},250);</script>`,

tr: `<p class="l-text"><strong>Hepsini birleştirme zamanı.</strong> Gerçek bir analiste "bir SELECT yaz" sorulmaz; "risk altındaki yüksek değerli müşterileri bul ve bir elde tutma planı öner" sorulur. Bu çok adımlı hatlar, ara agregatlar ve net final çıktılar gerektirir.</p>
<p class="l-text">Bu son derste uçtan uca bir analitik hattı kuracağız: aylık kohortlar, RFM segmentasyon, kayıp risk öznitelikleri ve müşteri-360 görüntüsü. Aşağı akış ML için CSV dışa aktaracağız. Sonunda yalnız SQL'in sizi ML'e hazır veri kümesinin %80'ine götürdüğünü göreceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Gerçek bir analitik soruyu çok adımlı bir SQL sorgusuna çevir</li><li>CTE, window fonksiyonu ve join'i tek üretim düzeyinde sorguda birleştir</li><li>Cohort retention ve customer lifetime value'yu uçtan uca hesapla</li><li>Bir SQL çözümünü eşdeğer pandas pipeline'ı ile karşılaştır</li><li>SQL'ini reviewer'ların kabul edeceği yorum ve adlandırma kurallarıyla belgele</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Analitik iş akışı</h2>
<p class="l-text">Tipik bir analitik veya ML öznitelik mühendisliği işinin dört evresi vardır. SQL ilk üçünü, pandas/sklearn sonuncuyu üstlenir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. İncele</div><div class="card-body">Şema, satır sayısı, NULL dağılımı, top değerler. Daima buradan başla.</div></div>
<div class="calc-card"><div class="card-title">2. Dönüştür</div><div class="card-body">Join, türetilmiş sütun, agregat, pencere öznitelikleri.</div></div>
<div class="calc-card"><div class="card-title">3. Topla</div><div class="card-body">Analitik birim başına (müşteri, gün, ülke) tüm özniteliklerle bir satır.</div></div>
<div class="calc-card"><div class="card-title">4. Modelle / raporla</div><div class="card-body">Tabloyu pandas, sklearn, BI aracı veya paydaşlara ver.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Adım 1 — sağlamlık kontrolü</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      (SELECT COUNT(*) FROM customers)                AS n_customers,
      (SELECT COUNT(*) FROM orders)                   AS n_orders,
      (SELECT COUNT(*) FROM churn)                    AS n_churn,
      (SELECT COUNT(DISTINCT customer_id) FROM orders) AS unique_buyers,
      (SELECT MIN(order_date) FROM orders)            AS first_order,
      (SELECT MAX(order_date) FROM orders)            AS last_order,
      ROUND((SELECT AVG(churned) FROM churn), 3)      AS overall_churn_rate
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Yedi skaler alt sorgu tek satırlık panoya birleştirildi. 2) Tablo boyutu, tarih aralığı ve baz oranı bir bakışta. 3) Genel kayıp oranı, segmentlerin karşılaştırılacağı temel çizgi. 4) Daha derin işlerden önce her zaman bu "koku testini" çalıştırın.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Adım 2 — aylık kohort analizi</h2>
<p class="l-text">Müşterileri kayıt ayına göre grupla, sonra sipariş davranışlarını izle. Klasik kohort tablosu.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH cohorts AS (
        SELECT
          customer_id,
          strftime('%Y-%m', signup_date) AS cohort_month
        FROM customers
    ),
    cohort_orders AS (
        SELECT
          c.cohort_month,
          COUNT(DISTINCT c.customer_id) AS cohort_size,
          COUNT(o.order_id)             AS n_orders,
          ROUND(SUM(o.total_usd), 2)    AS revenue,
          ROUND(AVG(o.total_usd), 2)    AS avg_order
        FROM cohorts c
        LEFT JOIN orders o USING(customer_id)
        GROUP BY c.cohort_month
    )
    SELECT *,
      ROUND(revenue / NULLIF(cohort_size, 0), 2) AS revenue_per_customer
    FROM cohort_orders
    ORDER BY cohort_month
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) CTE 1: her müşteriyi kayıt ayıyla etiketle. 2) CTE 2: LEFT JOIN ile sıfır siparişli kohortlar da görünür. 3) Kohort boyutu ve sipariş metriklerini topla. 4) Final SELECT müşteri başı gelir ekler — kohortlar arası daha adil karşılaştırma. 5) NULLIF boş kohortta sıfıra bölmeyi engeller.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Adım 3 — RFM segmentasyon</h2>
<p class="l-text">RFM = Recency (son), Frequency (sıklık), Monetary (parasal). Klasik e-ticaret segmentasyonu: en son ne zaman aldı, ne sıklıkta, ne kadar?</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH rfm_raw AS (
        SELECT
          customer_id,
          CAST(julianday('2026-05-01') - julianday(MAX(order_date)) AS INTEGER) AS recency_days,
          COUNT(*)            AS frequency,
          ROUND(SUM(total_usd), 2) AS monetary
        FROM orders
        GROUP BY customer_id
    ),
    rfm_scored AS (
        SELECT
          customer_id,
          recency_days,
          frequency,
          monetary,
          NTILE(4) OVER (ORDER BY recency_days DESC) AS r_score,
          NTILE(4) OVER (ORDER BY frequency)         AS f_score,
          NTILE(4) OVER (ORDER BY monetary)          AS m_score
        FROM rfm_raw
    )
    SELECT
      customer_id, recency_days, frequency, monetary,
      r_score, f_score, m_score,
      (r_score + f_score + m_score) AS rfm_total,
      CASE
        WHEN r_score &gt;= 3 AND f_score &gt;= 3 AND m_score &gt;= 3 THEN 'şampiyon'
        WHEN r_score &gt;= 3 AND f_score &gt;= 2 THEN 'sadık'
        WHEN r_score &gt;= 3 THEN 'yeni_aktif'
        WHEN f_score &gt;= 3 THEN 'sık'
        WHEN m_score &gt;= 3 THEN 'büyük_harcayan'
        ELSE 'risk_altında'
      END AS segment
    FROM rfm_scored
    ORDER BY rfm_total DESC
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>rfm_raw</code>: müşteri başı recency (son siparişten beri gün), frequency (sipariş sayısı), monetary (toplam harcama). 2) <code>rfm_scored</code>: her boyutu NTILE(4) ile çeyreğe ayır — recency DESC, az gün → yüksek puan. 3) Final CASE puanları eylem yönelimli segmentlere çevirir: şampiyon, sadık vb. 4) Pazarlama ekipleri bunu doğrudan kullanır — farklı segmentlere farklı mesaj.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Adım 4 — müşteri 360 görüntüsü</h2>
<p class="l-text">Kutsal kase: müşteri başına bir satır, ilgili tüm öznitelikler birleştirilmiş. Bunu kayıp modeline besleyin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH order_stats AS (
        SELECT
          customer_id,
          COUNT(*)        AS n_orders,
          ROUND(SUM(total_usd), 2) AS lifetime_spend,
          ROUND(AVG(total_usd), 2) AS avg_order_value,
          MAX(order_date) AS last_order,
          MIN(order_date) AS first_order,
          CAST(julianday('2026-05-01') - julianday(MAX(order_date)) AS INTEGER) AS days_since_last
        FROM orders
        GROUP BY customer_id
    )
    SELECT
      c.customer_id,
      c.first_name,
      c.country,
      c.signup_date,
      ch.contract_type,
      ch.monthly_charge,
      ch.tenure_months,
      ch.num_support_calls,
      ch.churned,
      COALESCE(o.n_orders, 0)        AS n_orders,
      COALESCE(o.lifetime_spend, 0)  AS lifetime_spend,
      COALESCE(o.avg_order_value, 0) AS avg_order_value,
      o.last_order,
      o.days_since_last
    FROM customers c
    LEFT JOIN churn ch       ON ch.customer_id = c.customer_id
    LEFT JOIN order_stats o  ON o.customer_id  = c.customer_id
    ORDER BY ch.churned DESC, o.lifetime_spend DESC
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>order_stats</code> CTE müşteri başına önceden toplar. 2) customers'a LEFT JOIN'lar — churn veya sipariş satırı olmayan müşteriler de görünür. 3) COALESCE eksik agregatları 0 yapar — ML için temiz. 4) Çıktı: müşteri başı 14 öznitelik, sklearn'a hazır. 5) ORDER BY önce kaybedilen yüksek değerlileri öne çıkarır — en acı kayıplar.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Adım 5 — elde tutma için risk altındaki segment</h2>
<p class="l-text">Elde tutma ekibi için hedefli sorgu: yüksek değerli, kısa süreli, son zamanlarda destek aramış müşteriler — önlenebilir kayıp havuzu.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH at_risk AS (
        SELECT
          c.customer_id,
          c.first_name,
          c.country,
          ch.monthly_charge,
          ch.tenure_months,
          ch.num_support_calls,
          ch.contract_type,
          ROUND(
            (CASE WHEN ch.contract_type = 'Month-to-month' THEN 0.4 ELSE 0 END) +
            (CASE WHEN ch.num_support_calls &gt;= 3          THEN 0.3 ELSE 0 END) +
            (CASE WHEN ch.tenure_months &lt; 12              THEN 0.2 ELSE 0 END) +
            (CASE WHEN ch.monthly_charge &gt; 80             THEN 0.1 ELSE 0 END)
          , 2) AS risk_score
        FROM customers c
        JOIN churn ch USING(customer_id)
        WHERE ch.churned = 0
    )
    SELECT *
    FROM at_risk
    WHERE risk_score &gt;= 0.5
    ORDER BY risk_score DESC, monthly_charge DESC
    LIMIT 25
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Sezgisel risk skoru: dört kırmızı bayrağın ağırlıklı toplamı. 2) Her CASE bayrak yanarsa ağırlığını ekler. 3) <code>churned = 0</code> filtresiyle hala elimizde olanlar. 4) Eşik ve sırala — listenin başı bir sonraki arama listesi. 5) Üretimde sezgiyi lojistik regresyonun olasılığıyla değiştirin — aynı SQL su tesisatı, ML'den gelen skor.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Adım 6 — aşağı akış ML için CSV dışa aktarma</h2>
<p class="l-text">Devir teslimi. <code>run_sql</code>'den dönen pandas DataFrame CSV'ye basitçe yazılır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>features = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      ch.customer_id,
      ch.tenure_months,
      ch.monthly_charge,
      ch.total_charge,
      ch.num_support_calls,
      CASE WHEN ch.contract_type = 'Month-to-month' THEN 1 ELSE 0 END AS is_monthly,
      CASE WHEN ch.contract_type = 'One year'       THEN 1 ELSE 0 END AS is_yearly,
      CASE WHEN ch.contract_type = 'Two year'       THEN 1 ELSE 0 END AS is_two_year,
      ch.churned AS y
    FROM churn ch
"""</span>)
<span class="fn">print</span>(features.shape)
<span class="fn">print</span>(features.<span class="fn">head</span>())
<span class="cm"># Gerçek scriptte:</span>
<span class="cm"># features.to_csv('/tmp/churn_features.csv', index=False)</span></code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) contract_type'ı one-hot kodlanmış SELECT — üç boolean sütun. 2) churned'ı sklearn geleneğine göre y'ye yeniden adlandırır. 3) <code>features</code>, <code>train_test_split</code> ve <code>LogisticRegression</code>'a hazır 500 satırlık DataFrame. 4) CSV dışa aktarma tek satır. 5) Aynı sorgu Snowflake veya BigQuery'ye Airflow DAG'ı besler.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. SQL'den geniş yığına</h2>
<p class="l-text">SQL yapıştırıcıdır. Aynı beceriler verinin yapısal olduğu her yerde çalışır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PostgreSQL</div><div class="card-body">En popüler açık kaynak OLTP. Ufak fonksiyon farkları (<code>CURRENT_DATE</code> yerine <code>NOW()</code>, NULL güvenliği için <code>||</code> yerine <code>CONCAT</code>).</div></div>
<div class="calc-card"><div class="card-title">MySQL / MariaDB</div><div class="card-body">Web yığını varsayılanı. Çoğu söz dizimi aynı; tarih fonksiyonlarında bazı küçük farklar.</div></div>
<div class="calc-card"><div class="card-title">Snowflake / BigQuery</div><div class="card-body">Bulut veri ambarları. Aynı SQL özü; daha zengin pencere fonksiyonları (QUALIFY), dizi tipleri, JSON.</div></div>
<div class="calc-card"><div class="card-title">DuckDB</div><div class="card-body">Gömülü analitik — SQLite gibi ama sütun yönelimli, agregatta uçar.</div></div>
<div class="calc-card"><div class="card-title">Spark SQL</div><div class="card-body">Petabaytlarda dağıtık hesap. Aynı sorgu 1000 düğümlü kümede.</div></div>
<div class="calc-card"><div class="card-title">pandas read_sql_query</div><div class="card-body">Ağır işi veritabanına it, yalnız ihtiyacın olanı Python'a çek.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Bundan sonra nereye?</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pencere fonksiyonları derinleşme</div><div class="card-body">Çerçeveler, adlandırılmış pencereler, percentile_cont, ileri sıralama.</div></div>
<div class="calc-card"><div class="card-title">Sorgu optimizasyonu</div><div class="card-body">EXPLAIN planlarını ciddi okuyun, hash join vs merge join öğrenin.</div></div>
<div class="calc-card"><div class="card-title">Transaction & izolasyon</div><div class="card-body">BEGIN/COMMIT/ROLLBACK, ACID, dirty/non-repeatable/phantom okuma.</div></div>
<div class="calc-card"><div class="card-title">dbt</div><div class="card-body">Modern dönüşüm aracı — SQL dosyaları DAG; testler, dokümanlar, soy.</div></div>
<div class="calc-card"><div class="card-title">SQLAlchemy</div><div class="card-body">Nesne yönelimli veri erişimi (ham SQL'e kaçış kapısıyla).</div></div>
<div class="calc-card"><div class="card-title">Postgres'e özel</div><div class="card-body">JSONB sütunlar, tam metin arama, üretilmiş sütunlar, kısmi indeksler.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. 10 adımlı özet</h2>
<div class="think-box"><div class="think-label">10 DERS ÖZETİ</div><div class="think-body"><strong>L1.</strong> Tablo, satır, sütun, oyun alanı.<br><strong>L2.</strong> SELECT, WHERE, ORDER BY, LIMIT, DISTINCT.<br><strong>L3.</strong> Agregatlar, GROUP BY, HAVING.<br><strong>L4.</strong> JOIN — INNER, LEFT, RIGHT, FULL, self.<br><strong>L5.</strong> Alt sorgular ve CTE (WITH).<br><strong>L6.</strong> Pencere fonksiyonları — sıralama, LAG/LEAD, yürüyen toplam.<br><strong>L7.</strong> Tarihler, metinler, CASE, NULL ele alma.<br><strong>L8.</strong> İndeksler, EXPLAIN, performans.<br><strong>L9.</strong> Şema tasarımı, kısıtlar, normalleştirme.<br><strong>L10.</strong> Gerçek analitik hattı (bu ders).</div></div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Final çıkarımları</h2>
<div class="think-box"><div class="think-label">FİNAL ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> SQL sizi ML'e hazır veriye %80 götürür. Ustalaşın.<br><strong>2.</strong> Çok adımlı hatlar CTE yığınıdır: incele → dönüştür → topla → dışa aktar.<br><strong>3.</strong> Kohort analizi, RFM, müşteri-360 yeniden kullanılabilir şablonlardır — her işe uyarlayın.<br><strong>4.</strong> Hesabı veritabanına itin; yalnız son agregatı Python'a çekin.<br><strong>5.</strong> Aynı SQL SQLite, Postgres, MySQL, Snowflake, BigQuery'de çalışır — ölçek ve fiyata göre seçin.<br><strong>6.</strong> Üretim = SQL + sürüm kontrolü (dbt, Liquibase) + testler + izleme. Sorguyu kod gibi ele alın.</div></div>
</div>

<div class="calc-graph"><div id="sql-l10-plot-tr" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{values:[35,25,20,12,8],labels:['Şampiyon','Sadık','Risk altında','Büyük harcayan','Yeni aktif'],type:'pie',marker:{colors:[T.accent,'#5dc9e8','#e88a4d','#c8a96e','#a06ee8']}}];
  var layout={paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},legend:{orientation:'h',y:-0.1,x:0.5,xanchor:'center'},margin:{t:30,r:30,b:80,l:30}};
  var elTR=document.getElementById('sql-l10-plot-tr'); if(elTR) Plotly.newPlot(elTR,data,layout,{displayModeBar:false});
},250);</script>
`
};
