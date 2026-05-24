window.SQL_L5 = {

en: `<p class="l-text"><strong>Subqueries and CTEs let you stack queries.</strong> The output of one query becomes the input of another, just like piping commands in a shell. This is how you express multi-step analyses without leaving SQL.</p>
<p class="l-text">In this lesson we cover subqueries in WHERE / FROM / SELECT, the modern <code>WITH</code> (CTE) syntax that makes complex queries readable, and a glimpse of recursive CTEs. By the end you will refactor a 5-step pandas pipeline into one elegant SQL statement.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Write scalar, column, and table subqueries in WHERE, FROM, and SELECT</li><li>Refactor nested subqueries into readable WITH (CTE) statements</li><li>Chain multiple CTEs to build multi-step analyses</li><li>Recognize when a correlated subquery will be slow and rewrite it</li><li>Use a recursive CTE to traverse hierarchies like org charts or trees</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. What is a subquery?</h2>
<p class="l-text">A subquery is a SELECT statement nested inside another query. It runs first; its output is used by the outer query. There are three places it commonly appears: WHERE, FROM, and SELECT.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Scalar subquery</div><div class="card-body">Returns a single value. Usable anywhere a value is allowed.</div></div>
<div class="calc-card"><div class="card-title">Column subquery</div><div class="card-body">Returns one column with many rows. Used with <code>IN</code>, <code>NOT IN</code>, <code>ANY</code>.</div></div>
<div class="calc-card"><div class="card-title">Table subquery</div><div class="card-body">Returns a full result set. Used in FROM (a "derived table").</div></div>
<div class="calc-card"><div class="card-title">Correlated</div><div class="card-body">References columns from the outer query. Re-evaluated per outer row — can be slow.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Scalar subquery — comparing to an aggregate</h2>
<p class="l-text">"Customers above the overall average monthly charge."</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, monthly_charge, contract_type
    FROM churn
    WHERE monthly_charge &gt; (SELECT AVG(monthly_charge) FROM churn)
    ORDER BY monthly_charge DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The inner query <code>SELECT AVG(...)</code> returns one number — the average monthly charge across all rows. 2) The outer query compares each row's monthly_charge to this scalar. 3) WHERE keeps rows above the average. 4) The inner query runs once, not per row — fast.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Subquery with IN — set membership</h2>
<p class="l-text">"Customers who have placed at least one order over $400."</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, first_name, last_name, country
    FROM customers
    WHERE customer_id IN (
        SELECT DISTINCT customer_id
        FROM orders
        WHERE total_usd &gt; 400
    )
    ORDER BY country, last_name
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Inner query produces a set of customer_ids who have any order &gt; $400. 2) Outer query keeps customers whose ID is in that set. 3) <code>DISTINCT</code> isn't strictly necessary (IN dedupes implicitly) but makes intent clear. 4) Equivalent to a JOIN + DISTINCT — but reads as "customers IN this set", which often matches business language better.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. NOT IN vs NOT EXISTS — the NULL trap</h2>
<p class="l-text">"Customers with no orders." Two ways to write it; they behave differently when NULLs sneak in.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, first_name, last_name, country
    FROM customers c
    WHERE NOT EXISTS (
        SELECT 1
        FROM orders o
        WHERE o.customer_id = c.customer_id
    )
    ORDER BY country
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>NOT EXISTS</code> is a correlated subquery — for each customer, check if any matching order exists. 2) <code>SELECT 1</code> is convention; the value doesn't matter, only existence. 3) Unlike <code>NOT IN</code>, <code>NOT EXISTS</code> handles NULLs sensibly. 4) <code>NOT IN (SELECT customer_id FROM orders)</code> can return zero rows if any customer_id in orders is NULL — a famous gotcha. Prefer <code>NOT EXISTS</code> in production.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Derived table (subquery in FROM)</h2>
<p class="l-text">Wrap a query in parentheses, alias it, treat it as a table. Useful when you need to aggregate then join or filter on the aggregate.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      c.country,
      stats.n_orders,
      stats.revenue
    FROM (
        SELECT customer_id, COUNT(*) AS n_orders, SUM(total_usd) AS revenue
        FROM orders
        GROUP BY customer_id
    ) AS stats
    JOIN customers c ON c.customer_id = stats.customer_id
    WHERE stats.n_orders &gt;= 5
    ORDER BY stats.revenue DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The inner query aggregates orders per customer. 2) Aliased as <code>stats</code> — now usable like a table. 3) JOIN with customers brings back profile fields. 4) WHERE filters on the aggregate (we couldn't do this directly without the derived table). 5) Output: top spenders enriched with country.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. CTE — the modern, readable way</h2>
<p class="l-text">A CTE (Common Table Expression) is a derived table written as a named block at the top with <code>WITH</code>. Same effect, far better readability, and reusable across the query.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH customer_stats AS (
        SELECT customer_id,
               COUNT(*)        AS n_orders,
               SUM(total_usd)  AS revenue,
               AVG(total_usd)  AS avg_order
        FROM orders
        GROUP BY customer_id
    )
    SELECT c.first_name, c.country, s.n_orders, s.revenue, s.avg_order
    FROM customer_stats s
    JOIN customers c ON c.customer_id = s.customer_id
    WHERE s.n_orders &gt;= 5
    ORDER BY s.revenue DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>WITH customer_stats AS (...)</code> defines a named temporary result set. 2) The main SELECT references <code>customer_stats</code> like any table. 3) Compared to a derived table, this scales — multiple CTEs stack neatly. 4) Same plan, more readable code. 5) CTEs can be referenced multiple times in one query — derived tables cannot.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Multiple CTEs — chain steps</h2>
<p class="l-text">Comma-separate multiple CTEs. Each can refer to the previous ones. Now real analytical pipelines are clean.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH customer_revenue AS (
        SELECT customer_id, SUM(total_usd) AS revenue
        FROM orders
        GROUP BY customer_id
    ),
    country_revenue AS (
        SELECT c.country, SUM(cr.revenue) AS country_total
        FROM customer_revenue cr
        JOIN customers c ON c.customer_id = cr.customer_id
        GROUP BY c.country
    ),
    ranked AS (
        SELECT country, country_total,
               RANK() OVER (ORDER BY country_total DESC) AS rk
        FROM country_revenue
    )
    SELECT * FROM ranked WHERE rk &lt;= 5
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>customer_revenue</code> aggregates per customer. 2) <code>country_revenue</code> rolls up to country, using the previous CTE. 3) <code>ranked</code> applies a window function (preview of L6). 4) Final SELECT picks top 5. 5) Each step is small and readable — same query as a 30-line nested subquery would be unreadable.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Top product per category — a classic problem</h2>
<p class="l-text">The "greatest N per group" pattern. Solved cleanly with a CTE plus a self-anti-join or a window function. Here, with a CTE.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH product_sales AS (
        SELECT p.category, p.name, SUM(o.total_usd) AS revenue
        FROM products p
        JOIN orders o ON o.product_id = p.product_id
        GROUP BY p.category, p.name
    ),
    category_top AS (
        SELECT category, MAX(revenue) AS top_revenue
        FROM product_sales
        GROUP BY category
    )
    SELECT ps.category, ps.name, ps.revenue
    FROM product_sales ps
    JOIN category_top ct
      ON ps.category = ct.category
     AND ps.revenue  = ct.top_revenue
    ORDER BY ps.revenue DESC
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>product_sales</code> = revenue per (category, product). 2) <code>category_top</code> = max revenue per category. 3) Self-join finds rows whose revenue equals the category max — the winner. 4) Window-function alternative is shorter (L6) but this version works on any SQL engine.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Recursive CTE — a brief look</h2>
<p class="l-text">CTEs can reference themselves to handle hierarchies, sequences, graph traversals. Here we generate a date sequence — useful for filling gaps in time series.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH RECURSIVE numbers(n) AS (
        SELECT 1
        UNION ALL
        SELECT n + 1 FROM numbers WHERE n &lt; 10
    )
    SELECT * FROM numbers
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>WITH RECURSIVE</code> tells the engine the CTE refers to itself. 2) Anchor: <code>SELECT 1</code> is the seed. 3) Recursive part: each iteration adds 1 until <code>n &lt; 10</code> fails. 4) <code>UNION ALL</code> stacks anchor and recursive results. 5) Output: 1..10. 6) Real use: generating calendars, walking org charts, BOM explosions.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Above-average spending per country</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH customer_total AS (
        SELECT c.customer_id, c.country,
               SUM(o.total_usd) AS spend
        FROM customers c
        JOIN orders o ON o.customer_id = c.customer_id
        GROUP BY c.customer_id, c.country
    ),
    country_avg AS (
        SELECT country, AVG(spend) AS avg_spend
        FROM customer_total
        GROUP BY country
    )
    SELECT ct.customer_id, ct.country, ct.spend, ca.avg_spend
    FROM customer_total ct
    JOIN country_avg ca USING(country)
    WHERE ct.spend &gt; ca.avg_spend
    ORDER BY ct.country, ct.spend DESC
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Step 1: total per customer. 2) Step 2: average spend per country. 3) Final: customers above their country's average. 4) <code>USING(country)</code> joins on the shared column. 5) Result: high-value customers segmented by country baseline — fairer than a global cut.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Key takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Subqueries nest queries; CTEs name them at the top with WITH.<br><strong>2.</strong> Three common spots: WHERE (filter), FROM (derived table), SELECT (computed value).<br><strong>3.</strong> Prefer <code>NOT EXISTS</code> over <code>NOT IN</code> when NULLs may appear.<br><strong>4.</strong> Stack CTEs to break a complex query into named, readable steps.<br><strong>5.</strong> Recursive CTE handles hierarchies and sequences.<br><strong>6.</strong> Same plan as nested subqueries; far better readability and reuse.</div></div>
</div>

<div class="calc-graph"><div id="sql-l5-plot-en" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['Subquery in WHERE','Subquery in FROM','Single CTE','Multiple CTEs','Recursive CTE'],y:[40,25,60,45,8],type:'bar',marker:{color:T.accent}}];
  var layout={title:'Use cases per pattern (illustrative)',paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid},yaxis:{gridcolor:T.grid},margin:{t:50,r:30,b:80,l:60}};
  var elEN=document.getElementById('sql-l5-plot-en'); if(elEN) Plotly.newPlot(elEN,data,layout,{displayModeBar:false});
  var elTR=document.getElementById('sql-l5-plot-tr'); if(elTR) Plotly.newPlot(elTR,data,Object.assign({},layout,{title:'Kalip basina kullanim (ornek)'}),{displayModeBar:false});
},250);</script>`,

tr: `<p class="l-text"><strong>Alt sorgular ve CTE'ler sorguları üst üste yığmanızı sağlar.</strong> Bir sorgunun çıktısı diğerinin girdisi olur — kabuktaki pipe gibi. Çok adımlı analizleri SQL'den çıkmadan ifade etmenin yolu budur.</p>
<p class="l-text">Bu derste WHERE / FROM / SELECT içindeki alt sorguları, karmaşık sorguları okunaklı kılan modern <code>WITH</code> (CTE) sözdizimini ve özyinelemeli CTE'lere bir bakış işleyeceğiz. Sonunda 5 adımlık pandas hattını tek bir zarif SQL ifadesine dönüştüreceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>WHERE, FROM ve SELECT içinde scalar, column ve table subquery yaz</li><li>İç içe subquery'leri okunabilir WITH (CTE) ifadelerine dönüştür</li><li>Çok adımlı analizler inşa etmek için birden fazla CTE'yi zincirle</li><li>Bir correlated subquery'nin ne zaman yavaş olacağını tanı ve yeniden yaz</li><li>Org şeması veya ağaç gibi hiyerarşileri dolaşmak için recursive CTE kullan</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Alt sorgu nedir?</h2>
<p class="l-text">Alt sorgu, başka bir sorgu içine yuvalanmış bir SELECT'tir. Önce çalışır; çıktısı dış sorguda kullanılır. Üç yerde sıkça görünür: WHERE, FROM ve SELECT.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Skaler alt sorgu</div><div class="card-body">Tek değer döner. Değer beklenen her yerde kullanılabilir.</div></div>
<div class="calc-card"><div class="card-title">Sütun alt sorgu</div><div class="card-body">Tek sütun, çok satır. <code>IN</code>, <code>NOT IN</code>, <code>ANY</code> ile.</div></div>
<div class="calc-card"><div class="card-title">Tablo alt sorgu</div><div class="card-body">Tam sonuç kümesi. FROM'da kullanılır ("derived table").</div></div>
<div class="calc-card"><div class="card-title">Korelasyonlu</div><div class="card-body">Dış sorgudan sütun kullanır. Dış satır başına yeniden değerlendirilir — yavaş olabilir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Skaler alt sorgu — bir agregat ile karşılaştırma</h2>
<p class="l-text">"Genel ortalama aylık ücretin üstündeki müşteriler."</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, monthly_charge, contract_type
    FROM churn
    WHERE monthly_charge &gt; (SELECT AVG(monthly_charge) FROM churn)
    ORDER BY monthly_charge DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) İçteki <code>SELECT AVG(...)</code> tek sayı döner — tüm satırlardaki ortalama. 2) Dış sorgu her satırın ücretini bu skalerle karşılaştırır. 3) WHERE ortalama üstündekini tutar. 4) İç sorgu satır başı değil, bir kez çalışır — hızlı.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. IN ile alt sorgu — küme üyeliği</h2>
<p class="l-text">"En az bir 400 doların üstü siparişi olan müşteriler."</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, first_name, last_name, country
    FROM customers
    WHERE customer_id IN (
        SELECT DISTINCT customer_id
        FROM orders
        WHERE total_usd &gt; 400
    )
    ORDER BY country, last_name
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) İçteki sorgu 400 dolar üstü siparişi olan müşteri ID kümesi. 2) Dış sorgu ID'si kümede olan müşterileri tutar. 3) <code>DISTINCT</code> şart değil (IN örtük tekilleştirir) ama niyeti netleştirir. 4) JOIN + DISTINCT eşdeğeri — ama "şu kümedeki müşteriler" iş diline daha yakın okunur.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. NOT IN vs NOT EXISTS — NULL tuzağı</h2>
<p class="l-text">"Hiç sipariş vermeyen müşteriler." İki yazılışı var; NULL araya girince farklı davranırlar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, first_name, last_name, country
    FROM customers c
    WHERE NOT EXISTS (
        SELECT 1
        FROM orders o
        WHERE o.customer_id = c.customer_id
    )
    ORDER BY country
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>NOT EXISTS</code> korelasyonlu alt sorgu — her müşteri için eşleşen sipariş var mı? 2) <code>SELECT 1</code> gelenek; değer önemli değil, varlık önemli. 3) <code>NOT IN</code>'in aksine NOT EXISTS NULL'ları doğru ele alır. 4) <code>NOT IN (SELECT customer_id FROM orders)</code> orders'taki herhangi bir customer_id NULL'sa sıfır satır döner — meşhur tuzak. Üretimde NOT EXISTS tercih edin.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Türetilmiş tablo (FROM içinde alt sorgu)</h2>
<p class="l-text">Bir sorguyu paranteze al, alias ver, tablo gibi kullan. Önce toplama yapıp sonra join veya agregat üzerinden filtre gerektiğinde işe yarar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      c.country,
      stats.n_orders,
      stats.revenue
    FROM (
        SELECT customer_id, COUNT(*) AS n_orders, SUM(total_usd) AS revenue
        FROM orders
        GROUP BY customer_id
    ) AS stats
    JOIN customers c ON c.customer_id = stats.customer_id
    WHERE stats.n_orders &gt;= 5
    ORDER BY stats.revenue DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) İçteki sorgu siparişleri müşteri başına özetler. 2) <code>stats</code> alias — artık tablo gibi. 3) customers ile join profil alanlarını getirir. 4) WHERE agregat üstünde filtreler (türetilmiş tablo olmadan doğrudan yapamayız). 5) Çıktı: ülkeyle zenginleştirilmiş en çok harcayanlar.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. CTE — modern, okunaklı yol</h2>
<p class="l-text">CTE (Common Table Expression) <code>WITH</code> ile en üstte adlandırılmış blok olarak yazılan türetilmiş tablodur. Aynı etki, çok daha iyi okunaklılık ve sorgu içinde yeniden kullanılabilir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH customer_stats AS (
        SELECT customer_id,
               COUNT(*)        AS n_orders,
               SUM(total_usd)  AS revenue,
               AVG(total_usd)  AS avg_order
        FROM orders
        GROUP BY customer_id
    )
    SELECT c.first_name, c.country, s.n_orders, s.revenue, s.avg_order
    FROM customer_stats s
    JOIN customers c ON c.customer_id = s.customer_id
    WHERE s.n_orders &gt;= 5
    ORDER BY s.revenue DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>WITH customer_stats AS (...)</code> adlandırılmış geçici sonuç kümesi. 2) Asıl SELECT <code>customer_stats</code>'a tablo gibi başvurur. 3) Türetilmiş tabloyla kıyasla ölçeklenir — birden çok CTE rahatça yığılır. 4) Aynı plan, daha okunaklı kod. 5) CTE'ler tek sorguda birden çok kez referanslanabilir — türetilmiş tablo edemez.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Çoklu CTE — adımları zincirle</h2>
<p class="l-text">Birden çok CTE virgülle ayrılır. Her biri öncekilere referans verebilir. Gerçek analitik hatlar artık temiz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH customer_revenue AS (
        SELECT customer_id, SUM(total_usd) AS revenue
        FROM orders
        GROUP BY customer_id
    ),
    country_revenue AS (
        SELECT c.country, SUM(cr.revenue) AS country_total
        FROM customer_revenue cr
        JOIN customers c ON c.customer_id = cr.customer_id
        GROUP BY c.country
    ),
    ranked AS (
        SELECT country, country_total,
               RANK() OVER (ORDER BY country_total DESC) AS rk
        FROM country_revenue
    )
    SELECT * FROM ranked WHERE rk &lt;= 5
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>customer_revenue</code> müşteri başına. 2) <code>country_revenue</code> öncekini kullanarak ülkeye yuvarlar. 3) <code>ranked</code> pencere fonksiyonu uygular (L6 önizleme). 4) Son SELECT ilk 5'i alır. 5) Her adım küçük ve okunaklı — aynı sorgu 30 satır iç içe alt sorguyla okunamaz olurdu.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Kategori başına en iyi ürün — klasik problem</h2>
<p class="l-text">"Grup başına en büyük N" kalıbı. CTE + self-anti-join veya pencere fonksiyonu ile temiz çözülür. Burada CTE ile.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH product_sales AS (
        SELECT p.category, p.name, SUM(o.total_usd) AS revenue
        FROM products p
        JOIN orders o ON o.product_id = p.product_id
        GROUP BY p.category, p.name
    ),
    category_top AS (
        SELECT category, MAX(revenue) AS top_revenue
        FROM product_sales
        GROUP BY category
    )
    SELECT ps.category, ps.name, ps.revenue
    FROM product_sales ps
    JOIN category_top ct
      ON ps.category = ct.category
     AND ps.revenue  = ct.top_revenue
    ORDER BY ps.revenue DESC
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>product_sales</code> = (kategori, ürün) başı gelir. 2) <code>category_top</code> = kategori başı maksimum gelir. 3) Self-join geliri kategori maksimumuna eşit satırı bulur — kazanan. 4) Pencere fonksiyonlu alternatif daha kısa (L6) ama bu yazım her motorda çalışır.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özyinelemeli CTE — kısa bakış</h2>
<p class="l-text">CTE'ler kendine başvurarak hiyerarşileri, dizileri, graf gezinmeyi ele alır. Burada bir tarih dizisi üretiyoruz — zaman serisi boşluklarını doldurmak için kullanışlı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH RECURSIVE numbers(n) AS (
        SELECT 1
        UNION ALL
        SELECT n + 1 FROM numbers WHERE n &lt; 10
    )
    SELECT * FROM numbers
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>WITH RECURSIVE</code> motora CTE'nin kendine atıf yaptığını söyler. 2) Çapa: <code>SELECT 1</code> tohum. 3) Özyineleme: <code>n &lt; 10</code> sağlanırken n+1 ekler. 4) <code>UNION ALL</code> çapayla özyinelenen sonuçları yığar. 5) Çıktı: 1..10. 6) Gerçek kullanım: takvim üretmek, organizasyon ağacı, BOM patlatma.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Ülke bazlı ortalama üstü harcama</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    WITH customer_total AS (
        SELECT c.customer_id, c.country,
               SUM(o.total_usd) AS spend
        FROM customers c
        JOIN orders o ON o.customer_id = c.customer_id
        GROUP BY c.customer_id, c.country
    ),
    country_avg AS (
        SELECT country, AVG(spend) AS avg_spend
        FROM customer_total
        GROUP BY country
    )
    SELECT ct.customer_id, ct.country, ct.spend, ca.avg_spend
    FROM customer_total ct
    JOIN country_avg ca USING(country)
    WHERE ct.spend &gt; ca.avg_spend
    ORDER BY ct.country, ct.spend DESC
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Adım 1: müşteri başı toplam. 2) Adım 2: ülke başı ortalama. 3) Final: ülkesinin ortalamasının üstündeki müşteriler. 4) <code>USING(country)</code> ortak sütunla join. 5) Sonuç: ülke baz çizgisine göre yüksek değerli segmentlemek — küresel kesimden daha adil.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Önemli çıkarımlar</h2>
<div class="think-box"><div class="think-label">ÖNEMLİ NOKTALAR</div><div class="think-body"><strong>1.</strong> Alt sorgular yuvalanır; CTE'ler WITH ile en üstte adlanır.<br><strong>2.</strong> Üç yaygın yer: WHERE (filtre), FROM (türetilmiş tablo), SELECT (hesaplanan değer).<br><strong>3.</strong> NULL ihtimali varsa <code>NOT IN</code> yerine <code>NOT EXISTS</code>.<br><strong>4.</strong> Karmaşık sorguyu adlandırılmış, okunaklı adımlara bölmek için CTE'leri yığ.<br><strong>5.</strong> Özyinelemeli CTE hiyerarşi ve dizileri ele alır.<br><strong>6.</strong> Yuvalanan alt sorgularla aynı plan; çok daha iyi okunaklılık ve yeniden kullanım.</div></div>
</div>

<div class="calc-graph"><div id="sql-l5-plot-tr" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['Subquery in WHERE','Subquery in FROM','Single CTE','Multiple CTEs','Recursive CTE'],y:[40,25,60,45,8],type:'bar',marker:{color:T.accent}}];
  var layout={title:'Kalıp başına kullanım (örnek)',paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid},yaxis:{gridcolor:T.grid},margin:{t:50,r:30,b:80,l:60}};
  var elEN=document.getElementById('sql-l5-plot-en'); if(elEN) Plotly.newPlot(elEN,data,layout,{displayModeBar:false});
  var elTR=document.getElementById('sql-l5-plot-tr'); if(elTR) Plotly.newPlot(elTR,data,Object.assign({},layout,{title:'Kalip basina kullanim (ornek)'}),{displayModeBar:false});
},250);</script>
`
};
