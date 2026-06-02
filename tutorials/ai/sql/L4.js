window.SQL_L4 = {

en: `<p class="l-text"><strong>Real data lives in many tables.</strong> A single customer's full picture spans customers (profile), churn (subscription), and orders (transactions). JOINs are how you stitch them back together — and they are the single most important SQL skill after WHERE.</p>
<p class="l-text">In this lesson we cover INNER, LEFT, RIGHT, FULL OUTER joins; the difference between matching, non-matching, and "anti-join" patterns; and a self-join. Every example connects two of our nine real tables.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Write INNER, LEFT, RIGHT, and FULL OUTER JOINs across two tables</li><li>Recognize the normalization tradeoff that makes JOINs necessary</li><li>Join on multiple keys and disambiguate columns with table aliases</li><li>Diagnose row explosions caused by many-to-many joins</li><li>Choose between JOIN, EXISTS, and IN for relationship queries</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why JOIN — the normalization tradeoff</h2>
<p class="l-text">Storing one table with all customer profile + every order they made would create huge duplication: every order would repeat the customer's name, country, signup date. Bad for storage, terrible for updates (change country = update 200 rows).</p>
<p class="l-text">Instead we split: <code>customers</code> holds profile (one row per person), <code>orders</code> holds transactions (one row per purchase, linked by customer_id). When we need them together, we JOIN.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Foreign key</div><div class="card-body">orders.customer_id refers to customers.customer_id. The "link" between tables.</div></div>
<div class="calc-card"><div class="card-title">Cardinality</div><div class="card-body">One customer → many orders. JOIN preserves this; one customer row appears once per matching order.</div></div>
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">Big joins on un-indexed columns are slow. Indexes on join keys are critical (L8).</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. INNER JOIN — only matching rows</h2>
<p class="l-text">Returns only the rows where both sides have a match.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      c.customer_id,
      c.first_name,
      c.country,
      ch.monthly_charge,
      ch.contract_type,
      ch.churned
    FROM customers c
    INNER JOIN churn ch ON c.customer_id = ch.customer_id
    WHERE c.country = 'TR'
    ORDER BY ch.monthly_charge DESC
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Two table aliases: <code>c</code> for customers, <code>ch</code> for churn. 2) <code>ON c.customer_id = ch.customer_id</code> is the join condition. 3) WHERE on country runs after the join (in writing order). 4) Output: only Turkish customers who exist in BOTH tables. If a customer appears in customers but not in churn, they're dropped here.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. LEFT JOIN — keep all from the left</h2>
<p class="l-text">Returns every row from the left table, plus matched columns from the right (NULL where no match).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      c.customer_id,
      c.first_name,
      c.country,
      COUNT(o.order_id) AS num_orders,
      ROUND(COALESCE(SUM(o.total_usd),0), 2) AS total_spend
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.first_name, c.country
    ORDER BY total_spend DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>LEFT JOIN orders</code> keeps every customer, even those without orders. 2) For customers without orders, all <code>o.*</code> columns are NULL. 3) <code>COUNT(o.order_id)</code> ignores NULLs, so non-buyers get 0. 4) <code>COALESCE(SUM(...), 0)</code> turns NULL sums into 0 for cleaner output. 5) Top spenders surface — but the bottom of the list (after sorting differently) reveals dormant customers.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The anti-join pattern — find non-matches</h2>
<p class="l-text">Filter LEFT JOIN to where the right side is NULL — gets you "rows with no match in the other table". Hugely useful.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      c.customer_id,
      c.first_name,
      c.last_name,
      c.country,
      c.signup_date
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    WHERE o.order_id IS NULL
    ORDER BY c.signup_date
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) LEFT JOIN keeps all customers; non-buyers have NULL in <code>o.*</code>. 2) <code>WHERE o.order_id IS NULL</code> keeps only those non-matchers. 3) Result = customers who never ordered — a re-engagement campaign list. 4) Sort by signup_date to prioritize the longest-dormant.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. RIGHT JOIN and FULL OUTER JOIN</h2>
<p class="l-text">RIGHT JOIN is the mirror image of LEFT JOIN. FULL OUTER returns every row from both sides, NULLs where no match. SQLite added FULL OUTER in version 3.39 (2022) — earlier versions need a UNION trick.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      p.product_id,
      p.name,
      p.category,
      COUNT(o.order_id) AS times_ordered
    FROM products p
    LEFT JOIN orders o ON p.product_id = o.product_id
    GROUP BY p.product_id, p.name, p.category
    ORDER BY times_ordered ASC
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) LEFT JOIN ensures even unsold products appear (count = 0). 2) Group + count gives sales counts per product. 3) Sorting ASC reveals dead stock — products that have never sold. 4) Convert to RIGHT JOIN by swapping table order — same result, different mental model.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Three-table join — orders + customers + products</h2>
<p class="l-text">Real analytical queries chain joins. The pattern scales naturally.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      o.order_date,
      c.first_name || ' ' || c.last_name AS customer,
      c.country,
      p.name           AS product,
      p.category,
      o.quantity,
      o.total_usd
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN products  p ON o.product_id  = p.product_id
    WHERE o.total_usd &gt; 300
    ORDER BY o.total_usd DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Three tables, two ON clauses. 2) <code>||</code> concatenates strings in SQLite (Postgres too). 3) <code>JOIN</code> alone defaults to <code>INNER JOIN</code>. 4) WHERE filters after both joins are applied. 5) The result is a fully enriched transaction table — exactly what a BI dashboard would consume.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Aggregating after JOIN — top categories per country</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      c.country,
      p.category,
      COUNT(*)               AS n_orders,
      ROUND(SUM(o.total_usd),2) AS revenue
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN products  p ON o.product_id  = p.product_id
    GROUP BY c.country, p.category
    HAVING n_orders &gt;= 5
    ORDER BY c.country, revenue DESC
    LIMIT 25
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Three-way join then group by (country, category). 2) HAVING removes thin segments. 3) ORDER BY country first, then revenue descending — within each country the top categories surface. 4) This is the kind of analysis a category manager wants every Monday morning.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Self-JOIN — joining a table to itself</h2>
<p class="l-text">Useful when a table has a relationship to itself (manager-employee) or to compare rows within the same table. Here we find customers from the same city.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      a.first_name AS customer_a,
      b.first_name AS customer_b,
      a.city,
      a.country
    FROM customers a
    JOIN customers b
      ON a.city = b.city
     AND a.country = b.country
     AND a.customer_id &lt; b.customer_id
    ORDER BY a.country, a.city
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The same table aliased twice (<code>a</code> and <code>b</code>) makes a self-join. 2) Match on city + country. 3) <code>a.customer_id &lt; b.customer_id</code> avoids self-pairs (a=b) and duplicates ((a,b) and (b,a)). 4) Output: pairs of customers in the same location.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. JOIN gotchas to internalize</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cartesian product</div><div class="card-body">JOIN without ON multiplies rows. Customers (500) × orders (2000) = 1,000,000 rows. Always specify ON.</div></div>
<div class="calc-card"><div class="card-title">Row multiplication</div><div class="card-body">If left has 1 row matching 4 right rows, result has 4 rows. Aggregates can double-count if you JOIN before GROUP BY thinking carelessly.</div></div>
<div class="calc-card"><div class="card-title">NULL keys</div><div class="card-body">NULL = NULL is FALSE. Rows with NULL in the join key never match.</div></div>
<div class="calc-card"><div class="card-title">USING vs ON</div><div class="card-body"><code>USING(customer_id)</code> works when both columns share the exact same name and you want a single output column.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> INNER = only matches. LEFT = all from left + matched right. RIGHT = mirror. FULL = all from both.<br><strong>2.</strong> LEFT JOIN ... WHERE right.key IS NULL = anti-join (find non-matches).<br><strong>3.</strong> Chain joins for multi-table analysis: orders → customers → products.<br><strong>4.</strong> Always alias tables — short, lowercase, mnemonic.<br><strong>5.</strong> Join keys should be indexed (L8) for performance.<br><strong>6.</strong> Self-join is a self-table comparison — use strict inequality to avoid mirror duplicates.</div></div>
</div>

<div class="calc-graph"><div id="sql-l4-plot-en" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['INNER','LEFT','RIGHT','FULL OUTER','SELF','CROSS'],y:[60,28,3,4,4,1],type:'bar',marker:{color:T.accent}}];
  var layout={title:'Frequency of JOIN types in real codebases (illustrative)',paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid},yaxis:{gridcolor:T.grid,title:'%'},margin:{t:50,r:30,b:60,l:60}};
  var elEN=document.getElementById('sql-l4-plot-en'); if(elEN) Plotly.newPlot(elEN,data,layout,{displayModeBar:false});
},250);</script>`,

tr: `<p class="l-text"><strong>Gerçek veri birden çok tabloda yaşar.</strong> Bir müşterinin tam fotoğrafı customers (profil), churn (abonelik) ve orders (işlemler) tablolarına yayılır. JOIN bu parçaları yeniden birleştirme yöntemidir — ve WHERE'den sonra en önemli SQL becerisidir.</p>
<p class="l-text">Bu derste INNER, LEFT, RIGHT, FULL OUTER join'leri; eşleşen, eşleşmeyen ve "anti-join" kalıplarını; ve bir self-join'i ele alacağız. Her örnek dokuz gerçek tablomuzdan ikisini birbirine bağlar.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>İki tablo arasında INNER, LEFT, RIGHT ve FULL OUTER JOIN yaz</li><li>JOIN'leri gerekli kılan normalleştirme dengesini tanı</li><li>Birden fazla anahtarda join yap ve tablo takma adlarıyla sütun belirsizliğini gider</li><li>Many-to-many join'lerin neden olduğu satır patlamalarını teşhis et</li><li>İlişki sorguları için JOIN, EXISTS ve IN arasında seçim yap</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden JOIN — normalleştirme dengesi</h2>
<p class="l-text">Tüm müşteri profili + her bir siparişi tek tabloda tutmak büyük tekrara yol açar: her sipariş, müşterinin adını, ülkesini, kayıt tarihini tekrar eder. Depolama için kötü, güncellemeler için felaket (ülke değişirse 200 satır güncellenir).</p>
<p class="l-text">Bunun yerine ayırırız: <code>customers</code> profili (kişi başı bir satır), <code>orders</code> işlemleri (satın alma başı bir satır, customer_id ile bağlı). Birlikte gerektiklerinde JOIN yaparız.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yabancı anahtar</div><div class="card-body">orders.customer_id customers.customer_id'ye işaret eder. Tablolar arası "bağ".</div></div>
<div class="calc-card"><div class="card-title">Kardinalite</div><div class="card-body">Bir müşteri → çok sipariş. JOIN bunu korur; bir müşteri satırı eşleşen sipariş sayısı kadar görünür.</div></div>
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">İndekssiz büyük join'ler yavaştır. Join anahtarlarında indeks kritiktir (L8).</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. INNER JOIN — yalnızca eşleşenler</h2>
<p class="l-text">Yalnızca her iki tarafın eşleştiği satırları döner.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      c.customer_id,
      c.first_name,
      c.country,
      ch.monthly_charge,
      ch.contract_type,
      ch.churned
    FROM customers c
    INNER JOIN churn ch ON c.customer_id = ch.customer_id
    WHERE c.country = 'TR'
    ORDER BY ch.monthly_charge DESC
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) İki alias: <code>c</code> customers için, <code>ch</code> churn için. 2) <code>ON c.customer_id = ch.customer_id</code> join koşulu. 3) WHERE join'den sonra çalışır (yazılış sırasında). 4) Çıktı: HER İKİ tabloda bulunan Türk müşteriler. customers'ta olup churn'da olmayan biri burada düşer.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. LEFT JOIN — soldakilerin hepsini tut</h2>
<p class="l-text">Sol tablodaki her satırı + sağdaki eşleşen sütunları döner (eşleşme yoksa NULL).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      c.customer_id,
      c.first_name,
      c.country,
      COUNT(o.order_id) AS num_orders,
      ROUND(COALESCE(SUM(o.total_usd),0), 2) AS total_spend
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.first_name, c.country
    ORDER BY total_spend DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>LEFT JOIN orders</code> sipariş vermemiş müşterileri bile tutar. 2) Sipariş vermemiş müşteride tüm <code>o.*</code> sütunları NULL'dur. 3) <code>COUNT(o.order_id)</code> NULL'ları yok sayar — alıcısı olmayan 0 alır. 4) <code>COALESCE(SUM(...), 0)</code> NULL toplamı 0 yapar. 5) En çok harcayanlar yukarıda — listenin altı (farklı sıralamayla) uyuyan müşterileri açar.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Anti-join kalıbı — eşleşmeyenleri bul</h2>
<p class="l-text">LEFT JOIN'i sağ taraf NULL olanlara filtrelemek "öbür tabloda eşleşmesi olmayan" satırları getirir. Çok kullanışlı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      c.customer_id,
      c.first_name,
      c.last_name,
      c.country,
      c.signup_date
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    WHERE o.order_id IS NULL
    ORDER BY c.signup_date
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) LEFT JOIN tüm müşterileri tutar; alıcı olmayanların <code>o.*</code>'u NULL'dur. 2) <code>WHERE o.order_id IS NULL</code> yalnız bunları tutar. 3) Sonuç = hiç sipariş vermeyen müşteriler — yeniden bağlanma kampanyası listesi. 4) signup_date'e göre sıralamak en uzun uyuyanları öne alır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. RIGHT JOIN ve FULL OUTER JOIN</h2>
<p class="l-text">RIGHT JOIN, LEFT JOIN'in aynası. FULL OUTER her iki taraftan tüm satırları, eşleşmesiz yerlerde NULL ile döner. SQLite FULL OUTER'ı 3.39 sürümünde (2022) ekledi — eski sürümler UNION hilesi gerektirir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      p.product_id,
      p.name,
      p.category,
      COUNT(o.order_id) AS times_ordered
    FROM products p
    LEFT JOIN orders o ON p.product_id = o.product_id
    GROUP BY p.product_id, p.name, p.category
    ORDER BY times_ordered ASC
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) LEFT JOIN satılmamış ürünlerin de görünmesini sağlar (sayım = 0). 2) Group + count ürün başı satış sayısı. 3) ASC sıralama ölü stoğu açar — hiç satılmamış ürünler. 4) Tabloları yer değiştirip RIGHT JOIN yaparsanız aynı sonuç, farklı zihinsel model.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Üç tablolu join — orders + customers + products</h2>
<p class="l-text">Gerçek analitik sorgular join zincirler. Kalıp doğal olarak ölçeklenir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      o.order_date,
      c.first_name || ' ' || c.last_name AS customer,
      c.country,
      p.name           AS product,
      p.category,
      o.quantity,
      o.total_usd
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN products  p ON o.product_id  = p.product_id
    WHERE o.total_usd &gt; 300
    ORDER BY o.total_usd DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Üç tablo, iki ON. 2) <code>||</code> SQLite'ta (ve Postgres'te) metin birleştirir. 3) Sade <code>JOIN</code> varsayılan olarak <code>INNER JOIN</code>'dir. 4) WHERE iki join sonrası filtreler. 5) Sonuç tam zenginleştirilmiş işlem tablosu — bir BI panosunun beklediği şey.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. JOIN sonrası agregat — ülke başına en iyi kategoriler</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      c.country,
      p.category,
      COUNT(*)               AS n_orders,
      ROUND(SUM(o.total_usd),2) AS revenue
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN products  p ON o.product_id  = p.product_id
    GROUP BY c.country, p.category
    HAVING n_orders &gt;= 5
    ORDER BY c.country, revenue DESC
    LIMIT 25
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Üç yönlü join sonrası (country, category) gruplama. 2) HAVING ince segmentleri çıkarır. 3) Önce country, sonra revenue azalan — her ülkede zirve kategoriler öne çıkar. 4) Bir kategori yöneticisinin her pazartesi sabahı istediği analiz.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Self-JOIN — bir tabloyu kendiyle birleştirmek</h2>
<p class="l-text">Tablo kendiyle ilişkiliyse (yönetici-çalışan) veya aynı tablodaki satırları kıyaslarken kullanışlı. Burada aynı şehirden müşterileri buluruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      a.first_name AS customer_a,
      b.first_name AS customer_b,
      a.city,
      a.country
    FROM customers a
    JOIN customers b
      ON a.city = b.city
     AND a.country = b.country
     AND a.customer_id &lt; b.customer_id
    ORDER BY a.country, a.city
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Aynı tablo iki kez aliaslandı (<code>a</code> ve <code>b</code>) — self-join. 2) city + country eşleşmesi. 3) <code>a.customer_id &lt; b.customer_id</code> kendi-kendi çiftleri (a=b) ve tekrarları ((a,b) ve (b,a)) önler. 4) Çıktı: aynı yerleşimdeki müşteri çiftleri.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. JOIN tuzakları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kartezyen çarpım</div><div class="card-body">ON'suz JOIN satırları çarpar. Customers (500) × orders (2000) = 1.000.000 satır. Daima ON belirtin.</div></div>
<div class="calc-card"><div class="card-title">Satır çoğalması</div><div class="card-body">Sol 1 satır 4 sağ satıra eşleşirse sonuç 4 satır. JOIN'i GROUP BY'dan önce dikkatsizce yapmak çift sayıma neden olur.</div></div>
<div class="calc-card"><div class="card-title">NULL anahtarlar</div><div class="card-body">NULL = NULL FALSE'dır. Join anahtarında NULL'lu satır asla eşleşmez.</div></div>
<div class="calc-card"><div class="card-title">USING vs ON</div><div class="card-body"><code>USING(customer_id)</code> her iki sütun aynı isimliyse ve tek çıktı sütunu istiyorsanız çalışır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Önemli çıkarımlar</h2>
<div class="think-box"><div class="think-label">ÖNEMLİ NOKTALAR</div><div class="think-body"><strong>1.</strong> INNER = yalnız eşleşmeler. LEFT = sol + eşleşen sağ. RIGHT = ayna. FULL = her iki taraftan tümü.<br><strong>2.</strong> LEFT JOIN ... WHERE sağ.anahtar IS NULL = anti-join (eşleşmeyenleri bul).<br><strong>3.</strong> Çoklu tablo analizi için join zincirle: orders → customers → products.<br><strong>4.</strong> Tabloları daima alias'la — kısa, küçük harf, akılda kalıcı.<br><strong>5.</strong> Performans için join anahtarları indeksli olmalı (L8).<br><strong>6.</strong> Self-join aynı tablo karşılaştırmasıdır — ayna tekrarları için katı eşitsizlik.</div></div>
</div>

<div class="calc-graph"><div id="sql-l4-plot-tr" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['INNER','LEFT','RIGHT','FULL OUTER','SELF','CROSS'],y:[60,28,3,4,4,1],type:'bar',marker:{color:T.accent}}];
  var layout={title:'Gerçek kod tabanlarında JOIN tipi sıklığı (örnek)',paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid},yaxis:{gridcolor:T.grid,title:'%'},margin:{t:50,r:30,b:60,l:60}};
  var elTR=document.getElementById('sql-l4-plot-tr'); if(elTR) Plotly.newPlot(elTR,data,layout,{displayModeBar:false});
},250);</script>
`
};
