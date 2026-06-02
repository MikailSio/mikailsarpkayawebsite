window.SQL_L2 = {

en: `<p class="l-text"><strong>Filtering is 80% of analytics.</strong> Once you can pull rows, the next question is always "which rows?" — only customers in Turkey, only orders above $100, only churned customers with month-to-month contracts.</p>
<p class="l-text">In this lesson we master <code>WHERE</code>, comparison and logical operators, <code>ORDER BY</code>, <code>LIMIT</code>/<code>OFFSET</code>, and <code>DISTINCT</code>. By the end you will write multi-condition filters as comfortably as a Python list comprehension.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Write the full SELECT shape: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT</li><li>Filter rows with comparison, BETWEEN, IN, LIKE, and IS NULL</li><li>Order results by multiple columns with ASC and DESC</li><li>Use DISTINCT to remove duplicates and LIMIT/OFFSET for pagination</li><li>Understand the logical execution order of a SELECT statement</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The full SELECT shape</h2>
<p class="l-text">Real queries layer many clauses. SQL forces a fixed order — even though you read it top-to-bottom, the engine evaluates differently. For now, learn the writing order.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SELECT</div><div class="card-body">Which columns to return.</div></div>
<div class="calc-card"><div class="card-title">FROM</div><div class="card-body">Which table(s) to read from.</div></div>
<div class="calc-card"><div class="card-title">WHERE</div><div class="card-body">Filter rows before grouping.</div></div>
<div class="calc-card"><div class="card-title">ORDER BY</div><div class="card-body">Sort the output.</div></div>
<div class="calc-card"><div class="card-title">LIMIT</div><div class="card-body">Cap the row count.</div></div>
<div class="calc-card"><div class="card-title">OFFSET</div><div class="card-body">Skip the first N rows.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. WHERE with comparison operators</h2>
<p class="l-text">Pick rows where a condition is true. Operators: <code>=</code>, <code>!=</code> (or <code>&lt;&gt;</code>), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT first_name, last_name, country, city
    FROM customers
    WHERE country = 'TR'
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>WHERE country = 'TR'</code> keeps only Turkish customers. 2) String literals use single quotes. 3) SQLite is case-sensitive for string equality by default — 'tr' would match nothing here. 4) LIMIT keeps the output readable.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Numeric filters on real data</h2>
<p class="l-text">High-value churn analysis: who pays a lot AND has churned?</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, monthly_charge, tenure_months, contract_type
    FROM churn
    WHERE monthly_charge &gt; 90
      AND churned = 1
    ORDER BY monthly_charge DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Two conditions joined by <code>AND</code> — both must be true. 2) <code>monthly_charge &gt; 90</code> is a numeric comparison. 3) <code>churned = 1</code> filters churned customers (the column stores 0/1). 4) <code>ORDER BY ... DESC</code> sorts highest charge first. 5) These are your most expensive lost customers — top retention priority.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. AND, OR, NOT — combining conditions</h2>
<p class="l-text">Boolean logic. Use parentheses generously — it never hurts and prevents subtle bugs.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, country, monthly_charge, contract_type, churned
    FROM churn c
    JOIN customers u USING(customer_id)
    WHERE (country = 'TR' OR country = 'DE')
      AND monthly_charge &gt; 70
      AND NOT contract_type = 'Two year'
    ORDER BY monthly_charge DESC
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) We join churn with customers (covered in L4 — preview here). 2) The OR group is wrapped in parens so AND binds correctly. 3) <code>NOT contract_type = 'Two year'</code> excludes 2-year contracts. 4) Result: high-value TR/DE customers on shorter contracts — the at-risk segment.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. BETWEEN and IN — cleaner sets</h2>
<p class="l-text"><code>BETWEEN a AND b</code> is inclusive on both ends. <code>IN (...)</code> matches any value in the list. Both are pure syntactic sugar over OR/AND but make queries readable.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT product_id, name, category, price_usd
    FROM products
    WHERE price_usd BETWEEN 20 AND 100
      AND category IN ('Electronics', 'Audio', 'Wearables')
    ORDER BY price_usd
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>BETWEEN 20 AND 100</code> equals <code>price_usd &gt;= 20 AND price_usd &lt;= 100</code>. 2) <code>IN (...)</code> equals <code>category = 'A' OR category = 'B' OR category = 'C'</code>. 3) Combined we get mid-priced tech products. 4) <code>ORDER BY price_usd</code> ascending by default.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. LIKE for pattern matching</h2>
<p class="l-text">Two wildcards: <code>%</code> matches any sequence (including empty), <code>_</code> matches exactly one character.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT first_name, last_name, email
    FROM customers
    WHERE email LIKE '%@gmail.com'
       OR first_name LIKE 'A%'
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>'%@gmail.com'</code> matches any email ending in @gmail.com. 2) <code>'A%'</code> matches names starting with A. 3) The OR returns customers matching either condition. 4) Note: leading <code>%</code> prevents index use (L8) — be aware in production.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. NULL — the absence of value</h2>
<p class="l-text">NULL is not zero, not empty string — it means "unknown". Crucially, <code>x = NULL</code> is never true. Always use <code>IS NULL</code> or <code>IS NOT NULL</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT order_id, customer_id, status, total_usd
    FROM orders
    WHERE status IS NOT NULL
      AND total_usd &gt; 200
    ORDER BY total_usd DESC
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>status IS NOT NULL</code> drops rows missing status. 2) Combined with the price filter — high-value orders with known status. 3) <code>WHERE status = NULL</code> would silently return zero rows even if NULLs exist — a classic bug.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. ORDER BY — multi-column, mixed direction</h2>
<p class="l-text">Sort by multiple columns; each can have its own direction.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT country, city, first_name, signup_date
    FROM customers
    ORDER BY country ASC, signup_date DESC
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Primary sort: country ascending (alphabetical). 2) Within each country, secondary sort: signup_date descending (newest first). 3) ASC is the default and can be omitted. 4) You can also sort by column position: <code>ORDER BY 1, 2</code> means first column, then second.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. LIMIT and OFFSET — pagination</h2>
<p class="l-text">Want page 3 of 10-row pages? <code>LIMIT 10 OFFSET 20</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, total_usd, order_date
    FROM orders
    ORDER BY total_usd DESC
    LIMIT 10 OFFSET 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sort orders by total descending. 2) Skip the first 20 rows. 3) Return the next 10 — these are ranks 21–30. 4) <strong>Warning:</strong> without ORDER BY, OFFSET pagination is non-deterministic — you may see duplicates or miss rows. Always sort.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. DISTINCT — removing duplicates</h2>
<p class="l-text">Get the unique values of a column or column combination.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT DISTINCT country
    FROM customers
    ORDER BY country
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>DISTINCT country</code> returns each country once. 2) Useful for "what values exist in this column?" 3) <code>SELECT DISTINCT a, b</code> dedupes on the (a,b) pair, not each separately.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT DISTINCT country, city
    FROM customers
    ORDER BY country, city
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Each unique (country, city) pair shown once. 2) Same city name in two countries? Both rows kept. 3) Sorted for readability.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Putting it all together — a real analyst query</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, monthly_charge, tenure_months, contract_type
    FROM churn
    WHERE contract_type IN ('Month-to-month', 'One year')
      AND monthly_charge BETWEEN 50 AND 110
      AND num_support_calls &gt;= 3
      AND churned = 1
    ORDER BY monthly_charge DESC, tenure_months ASC
    LIMIT 25
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Multi-condition filter combining IN, BETWEEN, range, equality. 2) Targets short-contract churned customers with high support call counts — a classic "preventable churn" segment. 3) Two-key sort: highest paying first, then shortest tenure (newer customers we lost faster). 4) This single query could drive a retention team's outreach list.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Key takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> WHERE filters rows; combine with AND/OR/NOT and parentheses.<br><strong>2.</strong> BETWEEN, IN, LIKE are sugar that improves readability.<br><strong>3.</strong> NULL needs IS NULL / IS NOT NULL — never <code>= NULL</code>.<br><strong>4.</strong> ORDER BY supports multiple columns and mixed ASC/DESC.<br><strong>5.</strong> LIMIT + OFFSET = pagination, but always pair with ORDER BY.<br><strong>6.</strong> DISTINCT dedupes; on multiple columns it dedupes the tuple.</div></div>
</div>

<div class="calc-graph"><div id="sql-l2-plot-en" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['=','!=','&lt;','&gt;','BETWEEN','IN','LIKE','IS NULL'],y:[100,80,70,75,55,60,45,40],type:'bar',marker:{color:T.accent}}];
  var layout={title:'Frequency of WHERE operators in real queries (illustrative)',paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid},yaxis:{gridcolor:T.grid,title:'use cases'},margin:{t:50,r:30,b:60,l:60}};
  var elEN=document.getElementById('sql-l2-plot-en'); if(elEN) Plotly.newPlot(elEN,data,layout,{displayModeBar:false});
},250);</script>`,

tr: `<p class="l-text"><strong>Filtreleme analitiğin %80'idir.</strong> Satır çekmeyi öğrendikten sonra bir sonraki soru daima "hangi satırlar?" olur — yalnız Türkiye'deki müşteriler, yalnız 100 doların üstü siparişler, yalnız aylık sözleşmeli ve kaybedilmiş müşteriler.</p>
<p class="l-text">Bu derste <code>WHERE</code>, karşılaştırma ve mantık operatörleri, <code>ORDER BY</code>, <code>LIMIT</code>/<code>OFFSET</code> ve <code>DISTINCT</code> konularını ustalaşacağız. Sonunda çok koşullu filtreleri Python list comprehension kadar rahat yazacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Tam SELECT şeklini yaz: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT</li><li>Karşılaştırma, BETWEEN, IN, LIKE ve IS NULL ile satırları filtrele</li><li>Sonuçları birden fazla sütunda ASC ve DESC ile sırala</li><li>Tekrarları kaldırmak için DISTINCT ve sayfalama için LIMIT/OFFSET kullan</li><li>Bir SELECT ifadesinin mantıksal yürütme sırasını anla</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Tam SELECT şekli</h2>
<p class="l-text">Gerçek sorgular birçok cümlecik katmanlar. SQL bu sırayı zorunlu kılar — yukarıdan aşağı okusanız da motor farklı sırada değerlendirir. Şimdilik yazma sırasını öğrenin.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SELECT</div><div class="card-body">Hangi sütunlar dönsün.</div></div>
<div class="calc-card"><div class="card-title">FROM</div><div class="card-body">Hangi tablo(lar)dan.</div></div>
<div class="calc-card"><div class="card-title">WHERE</div><div class="card-body">Gruplamadan önce satır filtresi.</div></div>
<div class="calc-card"><div class="card-title">ORDER BY</div><div class="card-body">Çıktıyı sıralar.</div></div>
<div class="calc-card"><div class="card-title">LIMIT</div><div class="card-body">Satır sayısını sınırlar.</div></div>
<div class="calc-card"><div class="card-title">OFFSET</div><div class="card-body">İlk N satırı atlar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Karşılaştırma operatörleriyle WHERE</h2>
<p class="l-text">Koşulun doğru olduğu satırları seçer. Operatörler: <code>=</code>, <code>!=</code> (veya <code>&lt;&gt;</code>), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT first_name, last_name, country, city
    FROM customers
    WHERE country = 'TR'
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>WHERE country = 'TR'</code> sadece Türk müşterileri tutar. 2) Metin sabitleri tek tırnakla yazılır. 3) SQLite metin eşitliğinde varsayılan olarak büyük/küçük harf duyarlıdır — 'tr' burada hiçbir şeyle eşleşmez. 4) LIMIT çıktıyı okunaklı tutar.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Gerçek veride sayısal filtre</h2>
<p class="l-text">Yüksek değerli kayıp analizi: çok ödeyen VE kaybedilmiş kim?</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, monthly_charge, tenure_months, contract_type
    FROM churn
    WHERE monthly_charge &gt; 90
      AND churned = 1
    ORDER BY monthly_charge DESC
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) İki koşul <code>AND</code> ile bağlandı — ikisi de doğru olmalı. 2) <code>monthly_charge &gt; 90</code> sayısal karşılaştırma. 3) <code>churned = 1</code> kaybedilmiş müşterileri filtreler (sütun 0/1 saklar). 4) <code>ORDER BY ... DESC</code> en yüksek faturadan başlar. 5) Bunlar en pahalı kaybedilen müşterileriniz — elde tutma önceliği.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. AND, OR, NOT — koşulları birleştirmek</h2>
<p class="l-text">Mantık. Parantezi cömertçe kullanın — zarar vermez, ince hataları önler.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, country, monthly_charge, contract_type, churned
    FROM churn c
    JOIN customers u USING(customer_id)
    WHERE (country = 'TR' OR country = 'DE')
      AND monthly_charge &gt; 70
      AND NOT contract_type = 'Two year'
    ORDER BY monthly_charge DESC
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) churn ile customers'ı birleştirdik (L4'te derinlemesine — burada önizleme). 2) OR grubu parantez içinde, AND doğru bağlasın diye. 3) <code>NOT contract_type = 'Two year'</code> 2 yıllıkları çıkarır. 4) Sonuç: kısa sözleşmeli yüksek değerli TR/DE müşterileri — risk segmenti.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. BETWEEN ve IN — temiz kümeler</h2>
<p class="l-text"><code>BETWEEN a AND b</code> her iki uçta dahildir. <code>IN (...)</code> listedeki herhangi bir değerle eşleşir. İkisi de OR/AND'in şekerlemesidir ama okunaklılık katar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT product_id, name, category, price_usd
    FROM products
    WHERE price_usd BETWEEN 20 AND 100
      AND category IN ('Electronics', 'Audio', 'Wearables')
    ORDER BY price_usd
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>BETWEEN 20 AND 100</code> = <code>price_usd &gt;= 20 AND price_usd &lt;= 100</code>. 2) <code>IN (...)</code> = <code>category = 'A' OR ...</code>. 3) Birleşince orta segmentte teknoloji ürünleri. 4) <code>ORDER BY price_usd</code> varsayılan artan.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. LIKE ile desen eşleştirme</h2>
<p class="l-text">İki joker: <code>%</code> herhangi bir dizi (boş dahil), <code>_</code> tam olarak bir karakter.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT first_name, last_name, email
    FROM customers
    WHERE email LIKE '%@gmail.com'
       OR first_name LIKE 'A%'
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>'%@gmail.com'</code> @gmail.com ile biten her e-posta. 2) <code>'A%'</code> A ile başlayan adlar. 3) OR ile ya bir ya öbürü. 4) Not: baştaki <code>%</code> indeks kullanımını engeller (L8) — üretimde dikkat.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. NULL — değerin yokluğu</h2>
<p class="l-text">NULL sıfır değildir, boş metin değildir — "bilinmiyor" demektir. Önemli: <code>x = NULL</code> asla doğru olmaz. Daima <code>IS NULL</code> veya <code>IS NOT NULL</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT order_id, customer_id, status, total_usd
    FROM orders
    WHERE status IS NOT NULL
      AND total_usd &gt; 200
    ORDER BY total_usd DESC
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>status IS NOT NULL</code> durumu eksik satırları atar. 2) Fiyat filtresiyle birlikte — durumu bilinen yüksek fiyatlı siparişler. 3) <code>WHERE status = NULL</code> NULL'lar varsa bile sessizce sıfır satır döner — klasik bir hata.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. ORDER BY — çoklu sütun, karışık yön</h2>
<p class="l-text">Birden çok sütuna göre sıralayın; her birinin kendi yönü olabilir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT country, city, first_name, signup_date
    FROM customers
    ORDER BY country ASC, signup_date DESC
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Birincil: country artan (alfabetik). 2) Her ülke içinde ikincil: signup_date azalan (en yeniler önce). 3) ASC varsayılan, atlanabilir. 4) Sütun pozisyonuyla da sıralanabilir: <code>ORDER BY 1, 2</code> = ilk, sonra ikinci sütun.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. LIMIT ve OFFSET — sayfalama</h2>
<p class="l-text">10 satırlık sayfaların 3. sayfasını mı istiyorsunuz? <code>LIMIT 10 OFFSET 20</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, total_usd, order_date
    FROM orders
    ORDER BY total_usd DESC
    LIMIT 10 OFFSET 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Siparişleri tutara göre azalan sırala. 2) İlk 20'yi atla. 3) Sonraki 10'u döndür — bunlar 21–30. sıralar. 4) <strong>Uyarı:</strong> ORDER BY olmadan OFFSET deterministik değildir — tekrarlar veya kayıplar olabilir. Daima sıralayın.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. DISTINCT — tekrarları silmek</h2>
<p class="l-text">Bir sütun veya sütun kombinasyonunun benzersiz değerlerini alır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT DISTINCT country
    FROM customers
    ORDER BY country
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>DISTINCT country</code> her ülkeyi bir kez döner. 2) "Bu sütunda hangi değerler var?" için ideal. 3) <code>SELECT DISTINCT a, b</code> (a,b) çiftine göre tekilleştirir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT DISTINCT country, city
    FROM customers
    ORDER BY country, city
    LIMIT 20
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Her benzersiz (ülke, şehir) çifti bir kez. 2) Aynı şehir adı iki ülkede mi? İkisi de kalır. 3) Okunabilir olsun diye sıralı.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Hepsini birleştirmek — gerçek bir analist sorgusu</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT customer_id, monthly_charge, tenure_months, contract_type
    FROM churn
    WHERE contract_type IN ('Month-to-month', 'One year')
      AND monthly_charge BETWEEN 50 AND 110
      AND num_support_calls &gt;= 3
      AND churned = 1
    ORDER BY monthly_charge DESC, tenure_months ASC
    LIMIT 25
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) IN, BETWEEN, aralık, eşitlik birleşimi. 2) Yüksek destek çağrı sayılı, kısa sözleşmeli, kaybedilmiş müşterileri hedefler — klasik "önlenebilir kayıp" segmenti. 3) İki anahtarlı sıralama: önce en yüksek ödeyen, sonra en kısa süreli (en hızlı kaybettiklerimiz). 4) Bu tek sorgu bir elde tutma ekibinin arama listesini doğurabilir.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Önemli çıkarımlar</h2>
<div class="think-box"><div class="think-label">ÖNEMLİ NOKTALAR</div><div class="think-body"><strong>1.</strong> WHERE satır filtreler; AND/OR/NOT ve parantezle birleştir.<br><strong>2.</strong> BETWEEN, IN, LIKE okunaklılık katan şekerlemelerdir.<br><strong>3.</strong> NULL için IS NULL / IS NOT NULL — asla <code>= NULL</code> değil.<br><strong>4.</strong> ORDER BY çoklu sütun ve karışık ASC/DESC destekler.<br><strong>5.</strong> LIMIT + OFFSET = sayfalama, daima ORDER BY ile.<br><strong>6.</strong> DISTINCT tekilleştirir; çoklu sütunda demete göre.</div></div>
</div>

<div class="calc-graph"><div id="sql-l2-plot-tr" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['=','!=','&lt;','&gt;','BETWEEN','IN','LIKE','IS NULL'],y:[100,80,70,75,55,60,45,40],type:'bar',marker:{color:T.accent}}];
  var layout={title:'Gerçek sorgularda WHERE operatörlerinin sıklığı (örnek)',paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid},yaxis:{gridcolor:T.grid,title:'kullanım'},margin:{t:50,r:30,b:60,l:60}};
  var elTR=document.getElementById('sql-l2-plot-tr'); if(elTR) Plotly.newPlot(elTR,data,layout,{displayModeBar:false});
},250);</script>
`
};
