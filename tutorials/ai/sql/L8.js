window.SQL_L8 = {

en: `<p class="l-text"><strong>A query that takes 50 ms can take 50 seconds on the same data — same SQL, no index.</strong> Indexes are the difference between scanning every row and jumping straight to the right one. They are the most important performance lever in any database.</p>
<p class="l-text">In this lesson we cover what an index actually is (a B-tree), when it helps, when it hurts, how to read <code>EXPLAIN QUERY PLAN</code>, composite indexes, and the most common pitfalls that defeat indexes silently.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Explain how a B-tree index turns a full scan into a logarithmic lookup</li><li>Create single-column and composite indexes with CREATE INDEX</li><li>Read EXPLAIN QUERY PLAN to see whether your index is used</li><li>Decide when an index is worth the insert and storage cost</li><li>Avoid common index pitfalls like leading wildcard LIKE and function calls</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. What is an index?</h2>
<p class="l-text">A table without indexes is a list. To find a row matching <code>email = 'alice@x.com'</code> the engine must read every row — a full scan. With 500 rows that's instant; with 500 million rows that's coffee-break time.</p>
<p class="l-text">An index is a separate sorted data structure (typically a B-tree) keyed by one or more columns. The engine uses it to jump directly to matching rows, much like the index at the back of a book.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">B-tree</div><div class="card-body">Self-balancing tree. O(log N) lookup. SQLite default index type.</div></div>
<div class="calc-card"><div class="card-title">Primary key</div><div class="card-body">Automatically indexed. SQLite's INTEGER PRIMARY KEY is the rowid itself — no extra structure.</div></div>
<div class="calc-card"><div class="card-title">Trade-off</div><div class="card-body">Faster reads, slower writes (every INSERT/UPDATE updates indexes too), more disk space.</div></div>
<div class="calc-card"><div class="card-title">Cardinality</div><div class="card-body">Indexes shine on columns with many distinct values. An index on a "is_active" boolean rarely helps.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. EXPLAIN QUERY PLAN — see what the engine does</h2>
<p class="l-text">Before optimizing, look at the plan. SQLite's <code>EXPLAIN QUERY PLAN</code> prefix tells you whether your query uses an index or scans.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT * FROM customers WHERE email = 'sample@example.com'
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>EXPLAIN QUERY PLAN</code> returns the execution strategy without running the query. 2) Look for "SCAN" (bad — full table) vs "SEARCH" (good — index used). 3) Output describes each step: which table, which index, what condition. 4) On our small playground, "SCAN" is fast anyway — but mentally rehearse on big data.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Creating an index</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    CREATE INDEX IF NOT EXISTS idx_customers_email
    ON customers(email)
"""</span>)
<span class="fn">print</span>(result)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT * FROM customers WHERE email = 'sample@example.com'
"""</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>CREATE INDEX IF NOT EXISTS</code> creates if missing — idempotent. 2) Naming convention: <code>idx_table_column</code>. 3) After creating, run EXPLAIN again — you should see "SEARCH ... USING INDEX idx_customers_email". 4) On a 500-row table the speedup is invisible; on 5M rows it's a 1000× difference.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Composite indexes — multi-column</h2>
<p class="l-text">An index on (a, b) is sorted by a, then b within ties. It helps queries that filter on a, or on a AND b — but not on b alone.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    CREATE INDEX IF NOT EXISTS idx_orders_customer_date
    ON orders(customer_id, order_date)
"""</span>)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT * FROM orders
    WHERE customer_id = 42
      AND order_date &gt;= '2025-01-01'
"""</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Composite index on (customer_id, order_date). 2) The query filters on the leading column (customer_id) and a range on the second — perfect use case. 3) The engine seeks to the customer_id range, then scans only that customer's orders sorted by date. 4) An index on (order_date, customer_id) would NOT help this query — leading column rule.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The leading column rule</h2>
<p class="l-text">A composite index on (a, b, c) helps queries that filter on:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">a</div><div class="card-body">Yes — left-anchored.</div></div>
<div class="calc-card"><div class="card-title">a AND b</div><div class="card-body">Yes — both leading.</div></div>
<div class="calc-card"><div class="card-title">a AND b AND c</div><div class="card-body">Yes — full match.</div></div>
<div class="calc-card"><div class="card-title">b alone</div><div class="card-body">No — gap on the leading column.</div></div>
<div class="calc-card"><div class="card-title">a AND c (skipping b)</div><div class="card-body">Partial — uses index for a, then filters c row by row.</div></div>
<div class="calc-card"><div class="card-title">c alone</div><div class="card-body">No.</div></div>
</div>
<p class="l-text">Lesson: order columns by selectivity (most distinct values first) and by what your queries actually filter on.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Indexes for JOIN keys</h2>
<p class="l-text">Every foreign key column should be indexed. JOINs without an index on the key turn into nested loops over the entire other table.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
    CREATE INDEX IF NOT EXISTS idx_orders_product_id  ON orders(product_id);
"""</span>)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT c.country, p.category, COUNT(*) AS n
    FROM orders o
    JOIN customers c ON c.customer_id = o.customer_id
    JOIN products  p ON p.product_id  = o.product_id
    GROUP BY c.country, p.category
"""</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Two indexes — one per join key on orders. 2) The plan now shows USING INDEX for both joins. 3) Without these, the engine would do nested-loop joins — quadratic in the worst case. 4) Indexing FK columns is the single highest-ROI tuning act in most databases.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pitfalls — when indexes are silently ignored</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Function on column</div><div class="card-body"><code>WHERE LOWER(email) = '...'</code> defeats the index on email. Solution: store lowercased copy or use a functional index.</div></div>
<div class="calc-card"><div class="card-title">Leading wildcard</div><div class="card-body"><code>LIKE '%foo'</code> can't use a B-tree index. <code>LIKE 'foo%'</code> can.</div></div>
<div class="calc-card"><div class="card-title">Type mismatch</div><div class="card-body">If column is TEXT and you compare to INTEGER, implicit conversions may skip the index.</div></div>
<div class="calc-card"><div class="card-title">OR clauses</div><div class="card-body"><code>WHERE a = 1 OR b = 2</code> may not use either index. Sometimes UNION of two indexed queries is faster.</div></div>
<div class="calc-card"><div class="card-title">Low selectivity</div><div class="card-body">If WHERE matches 80% of rows, a full scan is faster than an index lookup. The optimizer knows this.</div></div>
<div class="calc-card"><div class="card-title">Negation</div><div class="card-body"><code>WHERE col != 5</code> rarely uses an index — too many rows match.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Demonstrating a pitfall</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result_bad = <span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT * FROM customers WHERE LOWER(email) = 'a@b.com'
"""</span>)
<span class="fn">print</span>(<span class="str">'Bad (function on indexed column):'</span>)
<span class="fn">print</span>(result_bad)

result_good = <span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT * FROM customers WHERE email = 'a@b.com'
"""</span>)
<span class="fn">print</span>(<span class="str">'Good (direct comparison):'</span>)
<span class="fn">print</span>(result_good)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Both queries logically equivalent if email is already lowercase. 2) The first wraps email in LOWER() — engine must compute LOWER(email) for every row to compare, defeating the index. 3) The second uses the column directly — index does its job. 4) Always make the indexed column appear "naked" on one side of the comparison.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Covering indexes — index-only scans</h2>
<p class="l-text">If the index contains every column the query needs, the engine never visits the table — fastest possible scan. Add the needed columns to the index definition.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    CREATE INDEX IF NOT EXISTS idx_orders_cover
    ON orders(customer_id, order_date, total_usd)
"""</span>)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT customer_id, order_date, total_usd
    FROM orders
    WHERE customer_id = 50
"""</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The index includes total_usd even though it's not part of the WHERE — but it IS in SELECT. 2) Engine reads everything from the index alone — no table fetch needed. 3) Plan may say "USING COVERING INDEX". 4) Use sparingly — wider indexes cost more disk and slow down writes.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. When NOT to index</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tiny tables</div><div class="card-body">Under ~1000 rows, scans are cheap. Indexes mostly waste space.</div></div>
<div class="calc-card"><div class="card-title">Write-heavy tables</div><div class="card-body">Logging tables with billions of inserts and few reads — every index slows writes.</div></div>
<div class="calc-card"><div class="card-title">Low cardinality</div><div class="card-body">Boolean or 3-value columns rarely benefit. The optimizer may pick a scan anyway.</div></div>
<div class="calc-card"><div class="card-title">Rarely queried columns</div><div class="card-body">Don't index "just in case". Index based on actual query patterns.</div></div>
</div>
<p class="l-text">A useful default: index every primary key (automatic), every foreign key, and every column you frequently filter, sort, or group by.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. ANALYZE — keeping stats fresh</h2>
<p class="l-text">The query optimizer uses statistics about table size and column cardinality to decide whether to use an index. After bulk loads or large changes, run <code>ANALYZE</code> to refresh these stats.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"ANALYZE"</span>)
<span class="fn">print</span>(result)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"SELECT name FROM sqlite_master WHERE type='index' ORDER BY name"</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>ANALYZE</code> walks each table and index, updating internal statistics. 2) Run after major data changes. 3) The follow-up query lists every index in the database — useful for auditing what exists.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Key takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Indexes turn O(N) scans into O(log N) lookups — the difference between 50ms and 50s.<br><strong>2.</strong> Use EXPLAIN QUERY PLAN to verify index usage; look for SEARCH not SCAN.<br><strong>3.</strong> Always index foreign keys and frequently filtered columns.<br><strong>4.</strong> Composite index obeys the leading-column rule — order matters.<br><strong>5.</strong> Function-wrapped columns, leading wildcards, and OR can defeat indexes.<br><strong>6.</strong> Indexes cost write speed and disk; don't add what you won't query.</div></div>
</div>

<div class="calc-graph"><div id="sql-l8-plot-en" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var n=[1e3,1e4,1e5,1e6,1e7,1e8];
  var scan=n.map(function(v){return v/1e6;});
  var idx=n.map(function(v){return Math.log(v)/Math.log(2)/30;});
  var data=[{x:n,y:scan,type:'scatter',mode:'lines+markers',name:'Full scan O(N)',line:{color:'#e88a4d'}},{x:n,y:idx,type:'scatter',mode:'lines+markers',name:'Index O(log N)',line:{color:T.accent,width:3}}];
  var layout={paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{type:'log',gridcolor:T.grid,title:'rows'},yaxis:{type:'log',gridcolor:T.grid,title:'seconds'},legend:{orientation:'h',y:-0.25,x:0.5,xanchor:'center'},margin:{t:30,r:30,b:80,l:60}};
  var elEN=document.getElementById('sql-l8-plot-en'); if(elEN) Plotly.newPlot(elEN,data,layout,{displayModeBar:false});
},250);</script>`,

tr: `<p class="l-text"><strong>50 ms süren bir sorgu aynı veride 50 saniye sürebilir — aynı SQL, indeks yok.</strong> İndeksler her satırı taramakla doğrudan doğruya hedefe atlamak arasındaki farktır. Her veritabanındaki en önemli performans kaldıracıdır.</p>
<p class="l-text">Bu derste indeksin gerçekte ne olduğunu (B-ağacı), ne zaman yardım ettiğini, ne zaman zarar verdiğini, <code>EXPLAIN QUERY PLAN</code>'i nasıl okuyacağınızı, bileşik indeksleri ve sessizce indeksi yenen yaygın tuzakları işliyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Bir B-tree index'in tam taramayı logaritmik aramaya nasıl dönüştürdüğünü açıkla</li><li>CREATE INDEX ile tek sütunlu ve bileşik index oluştur</li><li>Index'inin kullanılıp kullanılmadığını görmek için EXPLAIN QUERY PLAN oku</li><li>Bir index'in insert ve depolama maliyetine değip değmeyeceğine karar ver</li><li>Leading wildcard LIKE ve fonksiyon çağrıları gibi yaygın index tuzaklarından kaçın</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. İndeks nedir?</h2>
<p class="l-text">İndekssiz tablo bir listedir. <code>email = 'alice@x.com'</code> eşleşen satırı bulmak için motor her satırı okumak zorunda — tam tarama. 500 satırda anlık; 500 milyonda kahve molası.</p>
<p class="l-text">İndeks bir veya daha fazla sütuna göre anahtarlanmış ayrı, sıralı bir veri yapısıdır (genelde B-ağacı). Motor onu kitap arkasındaki dizin gibi kullanarak doğrudan eşleşen satırlara atlar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">B-ağacı</div><div class="card-body">Kendini dengeleyen ağaç. O(log N) arama. SQLite varsayılanı.</div></div>
<div class="calc-card"><div class="card-title">Birincil anahtar</div><div class="card-body">Otomatik indekslenir. SQLite'ta INTEGER PRIMARY KEY rowid'in kendisidir — ek yapı yok.</div></div>
<div class="calc-card"><div class="card-title">Denge</div><div class="card-body">Hızlı okuma, yavaş yazma (her INSERT/UPDATE indeksleri de günceller), daha fazla disk.</div></div>
<div class="calc-card"><div class="card-title">Kardinalite</div><div class="card-body">Çok farklı değerli sütunda parlar. "is_active" bool sütununa indeks nadiren yardım eder.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. EXPLAIN QUERY PLAN — motor ne yapıyor?</h2>
<p class="l-text">Optimize etmeden önce planı görün. SQLite'ın <code>EXPLAIN QUERY PLAN</code> öneki sorgunuzun indeks mi taradığını mı söyler.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT * FROM customers WHERE email = 'sample@example.com'
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>EXPLAIN QUERY PLAN</code> sorguyu çalıştırmadan stratejiyi döner. 2) "SCAN" (kötü — tam tablo) ile "SEARCH" (iyi — indeks) arayın. 3) Çıktı her adımı tarif eder: tablo, indeks, koşul. 4) Küçük oyun alanımızda "SCAN" zaten hızlı — ama büyük veriyi düşünerek alıştırın.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. İndeks oluşturmak</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    CREATE INDEX IF NOT EXISTS idx_customers_email
    ON customers(email)
"""</span>)
<span class="fn">print</span>(result)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT * FROM customers WHERE email = 'sample@example.com'
"""</span>))</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>CREATE INDEX IF NOT EXISTS</code> yoksa oluşturur — idempotent. 2) İsim kuralı: <code>idx_tablo_sutun</code>. 3) Oluşturduktan sonra EXPLAIN'i tekrar çalıştırın — "SEARCH ... USING INDEX idx_customers_email" görmelisiniz. 4) 500 satırda hızlanma görünmez; 5M satırda 1000× fark.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Bileşik indeks — çoklu sütun</h2>
<p class="l-text">(a, b) üzerinde indeks önce a'ya sonra (eşitlikte) b'ye göre sıralıdır. a üstünde veya a AND b üstünde filtreyi destekler — yalnız b'yi desteklemez.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    CREATE INDEX IF NOT EXISTS idx_orders_customer_date
    ON orders(customer_id, order_date)
"""</span>)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT * FROM orders
    WHERE customer_id = 42
      AND order_date &gt;= '2025-01-01'
"""</span>))</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) (customer_id, order_date) bileşik indeksi. 2) Sorgu lider sütun (customer_id) ve ikincide aralık üzerinde — mükemmel eşleşme. 3) Motor customer_id aralığına atlar, sonra o müşterinin tarihe göre sıralı siparişlerini tarar. 4) (order_date, customer_id) bu sorguya yardım ETMEZ — lider sütun kuralı.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Lider sütun kuralı</h2>
<p class="l-text">(a, b, c) üzerinde bileşik indeks şu filtrelere yardım eder:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">a</div><div class="card-body">Evet — sola dayanmış.</div></div>
<div class="calc-card"><div class="card-title">a AND b</div><div class="card-body">Evet — ikisi lider.</div></div>
<div class="calc-card"><div class="card-title">a AND b AND c</div><div class="card-body">Evet — tam eşleşme.</div></div>
<div class="calc-card"><div class="card-title">yalnız b</div><div class="card-body">Hayır — lider sütunda boşluk.</div></div>
<div class="calc-card"><div class="card-title">a AND c (b atlandı)</div><div class="card-body">Kısmi — a için indeks, sonra c satır satır.</div></div>
<div class="calc-card"><div class="card-title">yalnız c</div><div class="card-body">Hayır.</div></div>
</div>
<p class="l-text">Ders: sütunları seçiciliğe (en farklı değer öne) ve sorgularınızın gerçekte filtrelediği şeye göre sıralayın.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. JOIN anahtarları için indeks</h2>
<p class="l-text">Her yabancı anahtar sütunu indekslenmeli. Anahtar üstünde indeks olmadan JOIN diğer tabloyu içeren iç içe döngülere döner.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
    CREATE INDEX IF NOT EXISTS idx_orders_product_id  ON orders(product_id);
"""</span>)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT c.country, p.category, COUNT(*) AS n
    FROM orders o
    JOIN customers c ON c.customer_id = o.customer_id
    JOIN products  p ON p.product_id  = o.product_id
    GROUP BY c.country, p.category
"""</span>))</code></pre></div>
<p class="l-text"><strong>Burada dört önemli detay var:</strong> 1) İki indeks — orders'taki her join anahtarı. 2) Plan artık iki join'de USING INDEX gösterir. 3) Bunlar olmadan motor iç içe döngü join yapar — en kötü durumda kuadratik. 4) FK sütunlarını indekslemek çoğu veritabanındaki tek en yüksek-getirili ayar hareketidir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Tuzaklar — indeksin sessizce yok sayıldığı yerler</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sütunda fonksiyon</div><div class="card-body"><code>WHERE LOWER(email) = '...'</code> email indeksini yener. Çözüm: küçük harf kopya saklayın veya fonksiyonel indeks.</div></div>
<div class="calc-card"><div class="card-title">Baştaki joker</div><div class="card-body"><code>LIKE '%foo'</code> B-ağacı kullanamaz. <code>LIKE 'foo%'</code> kullanır.</div></div>
<div class="calc-card"><div class="card-title">Tip uyumsuzluğu</div><div class="card-body">Sütun TEXT ve INTEGER ile karşılaştırırsanız örtük dönüşüm indeksi atlatabilir.</div></div>
<div class="calc-card"><div class="card-title">OR cümleleri</div><div class="card-body"><code>WHERE a = 1 OR b = 2</code> hiçbirini kullanmayabilir. Bazen iki indekslemiş sorgunun UNION'u daha hızlı.</div></div>
<div class="calc-card"><div class="card-title">Düşük seçicilik</div><div class="card-body">WHERE satırların %80'iyle eşleşiyorsa tam tarama indeks aramasından hızlıdır. Optimizör bunu bilir.</div></div>
<div class="calc-card"><div class="card-title">Olumsuzlama</div><div class="card-body"><code>WHERE col != 5</code> indeksi nadiren kullanır — çok satır eşleşir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Tuzağı göstermek</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result_bad = <span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT * FROM customers WHERE LOWER(email) = 'a@b.com'
"""</span>)
<span class="fn">print</span>(<span class="str">'Kotu (indeksli sutuna fonksiyon):'</span>)
<span class="fn">print</span>(result_bad)

result_good = <span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT * FROM customers WHERE email = 'a@b.com'
"""</span>)
<span class="fn">print</span>(<span class="str">'Iyi (dogrudan karsilastirma):'</span>)
<span class="fn">print</span>(result_good)</code></pre></div>
<p class="l-text"><strong>Burada dört önemli detay var:</strong> 1) email zaten küçük harfse iki sorgu eşdeğer. 2) İlki email'i LOWER()'a sarar — motor karşılaştırmak için her satırda LOWER(email) hesaplamak zorunda, indeks yenilir. 3) İkincisi sütunu doğrudan kullanır — indeks işini yapar. 4) İndeksli sütun karşılaştırmanın bir tarafında daima "çıplak" olsun.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Kapsayan indeks — yalnız indeks taraması</h2>
<p class="l-text">İndeks sorgunun ihtiyacı her sütunu içerirse motor tabloya hiç gitmez — en hızlı tarama. Tanıma gereken sütunları ekleyin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    CREATE INDEX IF NOT EXISTS idx_orders_cover
    ON orders(customer_id, order_date, total_usd)
"""</span>)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"""
    EXPLAIN QUERY PLAN
    SELECT customer_id, order_date, total_usd
    FROM orders
    WHERE customer_id = 50
"""</span>))</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) İndeks total_usd'yi de içerir — WHERE'in parçası değil ama SELECT'te var. 2) Motor her şeyi yalnız indeksten okur — tablo getirişi yok. 3) Plan "USING COVERING INDEX" diyebilir. 4) Tasarrufla kullanın — geniş indeks daha çok disk ve yavaş yazma.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Ne zaman indekslemeyin</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çok küçük tablolar</div><div class="card-body">~1000 satır altı taramalar ucuz. İndeksler genelde alan israfı.</div></div>
<div class="calc-card"><div class="card-title">Yazma yoğun tablolar</div><div class="card-body">Az okumalı milyarlarca insert'li log tabloları — her indeks yazmayı yavaşlatır.</div></div>
<div class="calc-card"><div class="card-title">Düşük kardinalite</div><div class="card-body">Bool veya 3 değerli sütun nadiren kazandırır. Optimizör zaten taramayı seçebilir.</div></div>
<div class="calc-card"><div class="card-title">Nadiren sorgulanan sütun</div><div class="card-body">"Belki gerekir" diye indekslemeyin. Gerçek desenler temelinde indeksleyin.</div></div>
</div>
<p class="l-text">Faydalı varsayılan: her birincil anahtar (otomatik), her yabancı anahtar ve sıkça filtre/sıralama/grup yaptığınız her sütun.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. ANALYZE — istatistikleri taze tutun</h2>
<p class="l-text">Sorgu optimizörü tablo boyutu ve sütun kardinalitesi istatistiklerini kullanır. Toplu yüklemelerden veya büyük değişikliklerden sonra <code>ANALYZE</code> çalıştırın.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"ANALYZE"</span>)
<span class="fn">print</span>(result)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"SELECT name FROM sqlite_master WHERE type='index' ORDER BY name"</span>))</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>ANALYZE</code> her tablo ve indeksi gezerek dahili istatistikleri günceller. 2) Büyük veri değişikliklerinden sonra çalıştırın. 3) İkinci sorgu veritabanındaki tüm indeksleri listeler — denetim için.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Önemli çıkarımlar</h2>
<div class="think-box"><div class="think-label">ÖNEMLİ NOKTALAR</div><div class="think-body"><strong>1.</strong> İndeksler O(N) taramayı O(log N) aramaya çevirir — 50ms ile 50s arası fark.<br><strong>2.</strong> İndeks kullanımını doğrulamak için EXPLAIN QUERY PLAN; SCAN değil SEARCH arayın.<br><strong>3.</strong> Yabancı anahtarları ve sıkça filtre yaptığınız sütunları daima indeksleyin.<br><strong>4.</strong> Bileşik indeks lider sütun kuralına uyar — sıra önemli.<br><strong>5.</strong> Sütuna sarılmış fonksiyon, baştaki joker, OR indeksi yenebilir.<br><strong>6.</strong> İndeksler yazma hızı ve diske mal olur; sorgulamayacağınızı eklemeyin.</div></div>
</div>

<div class="calc-graph"><div id="sql-l8-plot-tr" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var n=[1e3,1e4,1e5,1e6,1e7,1e8];
  var scan=n.map(function(v){return v/1e6;});
  var idx=n.map(function(v){return Math.log(v)/Math.log(2)/30;});
  var data=[{x:n,y:scan,type:'scatter',mode:'lines+markers',name:'Tam tarama O(N)',line:{color:'#e88a4d'}},{x:n,y:idx,type:'scatter',mode:'lines+markers',name:'İndeks O(log N)',line:{color:T.accent,width:3}}];
  var layout={paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{type:'log',gridcolor:T.grid,title:'satır sayısı'},yaxis:{type:'log',gridcolor:T.grid,title:'saniye'},legend:{orientation:'h',y:-0.25,x:0.5,xanchor:'center'},margin:{t:30,r:30,b:80,l:60}};
  var elTR=document.getElementById('sql-l8-plot-tr'); if(elTR) Plotly.newPlot(elTR,data,layout,{displayModeBar:false});
},250);</script>
`
};
