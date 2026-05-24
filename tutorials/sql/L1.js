window.SQL_L1 = {

en: `<p class="l-text"><strong>SQL is the daily language of data.</strong> Whether you are analyzing customer churn, building dashboards, or feeding machine learning pipelines, almost every dataset you will ever touch lives in a relational database. SQL (Structured Query Language) is how you ask that database questions.</p>
<p class="l-text">In this first lesson, we will demystify what a "table" actually is, see the 9 real tables loaded in this site's playground, and run our very first query. By the end you will read your first SQL output as a pandas DataFrame and understand exactly what every cell means.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Explain why SQL is declarative and how the query planner optimizes execution</li><li>Identify rows, columns, schemas, primary keys, and foreign keys in real tables</li><li>Inspect the 9 playground tables and read their column types</li><li>Run your first SELECT and read the result as a pandas DataFrame</li><li>Connect run_sql() in Pyodide to a real SQLite engine in the browser</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. What is SQL and why does everyone use it?</h2>
<p class="l-text">SQL was invented in the 1970s at IBM and has outlasted dozens of programming trends. The reason is simple: when your data has structure (rows of customers, orders, prices), SQL gives you a declarative way to extract any slice of it without writing a loop.</p>
<p class="l-text">You describe <em>what</em> you want, and the database engine figures out <em>how</em> to fetch it efficiently — using indexes, query plans, and decades of optimization research.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Declarative</div><div class="card-body">You write the question, not the algorithm. "Give me top 10 customers by spending" — not a for-loop.</div></div>
<div class="calc-card"><div class="card-title">Universal</div><div class="card-body">PostgreSQL, MySQL, SQLite, Snowflake, BigQuery — all speak SQL with small dialect differences.</div></div>
<div class="calc-card"><div class="card-title">Fast</div><div class="card-body">Decades of optimization. Billions of rows scanned per second on modern engines.</div></div>
<div class="calc-card"><div class="card-title">Composable</div><div class="card-body">Subqueries, CTEs, window functions — build complex analyses from simple pieces.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Tables, rows, columns — the mental model</h2>
<p class="l-text">A relational database is a collection of <strong>tables</strong>. A table is just a spreadsheet with rules: every column has a fixed type (text, integer, date), and every row represents one entity (one customer, one order, one tweet).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Row</div><div class="card-body">One record. One customer. One order. One tweet. Also called a "tuple".</div></div>
<div class="calc-card"><div class="card-title">Column</div><div class="card-body">One attribute. customer_id, age, country, price. Also called a "field" or "attribute".</div></div>
<div class="calc-card"><div class="card-title">Schema</div><div class="card-body">The blueprint: which tables exist, what columns each has, what types they use.</div></div>
<div class="calc-card"><div class="card-title">Primary Key</div><div class="card-body">A column (or combination) that uniquely identifies a row. Like customer_id.</div></div>
<div class="calc-card"><div class="card-title">Foreign Key</div><div class="card-body">A column referring to a primary key in another table. Connects orders to customers.</div></div>
<div class="calc-card"><div class="card-title">Index</div><div class="card-body">A behind-the-scenes data structure that makes lookups fast (covered in L8).</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The 9 tables loaded in this playground</h2>
<p class="l-text">This site has a SQLite database pre-loaded with 9 real tables totaling ~4,300 rows of realistic data. Let's list them.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT name
    FROM sqlite_master
    WHERE type='table'
    ORDER BY name
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>sqlite_master</code> is a built-in catalog table that SQLite maintains automatically — it knows every object in the database. 2) We filter <code>WHERE type='table'</code> to exclude indexes and views. 3) <code>ORDER BY name</code> alphabetizes. 4) <code>run_sql</code> ships the SQL string to SQLite, gets back rows, and wraps them in a pandas DataFrame so you can <code>print</code> nicely.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">churn (500)</div><div class="card-body">Telecom customer churn data — 12 columns including monthly_charge, tenure_months, contract_type, churned.</div></div>
<div class="calc-card"><div class="card-title">customers (500)</div><div class="card-body">Customer profile — first_name, last_name, email, country, city, signup_date. Joins to churn via customer_id.</div></div>
<div class="calc-card"><div class="card-title">products (39)</div><div class="card-body">Catalog — product_id, name, category, price_usd, stock.</div></div>
<div class="calc-card"><div class="card-title">orders (2000)</div><div class="card-body">Transactions — order_id, customer_id, product_id, quantity, order_date, total_usd, status.</div></div>
<div class="calc-card"><div class="card-title">reviews (300)</div><div class="card-body">Product reviews with sentiment label, category, rating, word_count.</div></div>
<div class="calc-card"><div class="card-title">tweets (300)</div><div class="card-body">Social posts — text, language, sentiment, hashtags, mentions, has_url, length.</div></div>
<div class="calc-card"><div class="card-title">housing (200)</div><div class="card-body">Real estate — bedrooms, bathrooms, area_m2, age_years, district, price_try.</div></div>
<div class="calc-card"><div class="card-title">stocks (261)</div><div class="card-body">Daily OHLCV — date, open, high, low, close, volume.</div></div>
<div class="calc-card"><div class="card-title">iris (150)</div><div class="card-body">Classic ML dataset — sepal/petal measurements, species.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Your first SELECT</h2>
<p class="l-text">The <code>SELECT</code> statement is the workhorse of SQL. Its simplest form: pick columns from a table.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT *
    FROM customers
    LIMIT 5
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>SELECT *</code> means "all columns". 2) <code>FROM customers</code> picks the source table. 3) <code>LIMIT 5</code> caps the output at 5 rows so we don't drown in data. 4) The result is a 5-row pandas DataFrame with columns customer_id, first_name, last_name, email, country, city, signup_date.</p>
<p class="l-text">Reading the output: each row is one real customer record. The DataFrame index on the left (0,1,2,3,4) is added by pandas — it is not part of the SQL result.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Picking specific columns</h2>
<p class="l-text">Selecting all columns with <code>*</code> is fine for exploration but wasteful in production — networks transfer all data, even what you don't need. Be explicit.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT first_name, last_name, country
    FROM customers
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) We list 3 columns separated by commas. 2) The order in SELECT controls the output column order. 3) The LIMIT trims to 10 rows for readable output. 4) Compare this to <code>SELECT *</code> — only 3 columns now.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Counting rows — your second SQL skill</h2>
<p class="l-text">Before any analysis, you should always know how many rows you have. <code>COUNT(*)</code> is the universal answer.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT COUNT(*) AS total_customers
    FROM customers
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>COUNT(*)</code> counts every row. 2) <code>AS total_customers</code> gives the result column a friendly name (this is called an <em>alias</em>). 3) The output is a 1-row DataFrame with one column. 4) Without LIMIT here — aggregate functions return one row anyway.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pandas vs SQL — same concepts, different syntax</h2>
<p class="l-text">If you know pandas, SQL is mostly translation work. The mental model is identical.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">df[col]</div><div class="card-body">SQL: <code>SELECT col FROM df</code></div></div>
<div class="calc-card"><div class="card-title">df[df.x &gt; 5]</div><div class="card-body">SQL: <code>WHERE x &gt; 5</code></div></div>
<div class="calc-card"><div class="card-title">df.groupby(c).mean()</div><div class="card-body">SQL: <code>GROUP BY c</code> with <code>AVG()</code></div></div>
<div class="calc-card"><div class="card-title">df.sort_values</div><div class="card-body">SQL: <code>ORDER BY</code></div></div>
<div class="calc-card"><div class="card-title">df.merge</div><div class="card-body">SQL: <code>JOIN</code></div></div>
<div class="calc-card"><div class="card-title">df.head(5)</div><div class="card-body">SQL: <code>LIMIT 5</code></div></div>
</div>
<p class="l-text">SQL has one big advantage: it pushes computation to the database, which can scan billions of rows because the data never leaves the engine. Pandas pulls data into RAM first.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Getting comfortable — explore the schema</h2>
<p class="l-text">Run this to see the columns of any table — useful when you don't remember a schema.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    PRAGMA table_info(churn)
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>PRAGMA</code> is SQLite-specific syntax for metadata queries. 2) <code>table_info(churn)</code> returns one row per column with name, type, nullable, default value, primary key flag. 3) Use this whenever you forget what columns exist. 4) Other databases use <code>INFORMATION_SCHEMA.COLUMNS</code> for the same purpose.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Key takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> SQL is declarative — you describe the result, not the steps.<br><strong>2.</strong> A table is rows (records) and columns (attributes), with strict types.<br><strong>3.</strong> <code>SELECT col FROM table LIMIT n</code> is the fundamental query shape.<br><strong>4.</strong> Use <code>SELECT *</code> for exploration, named columns for production.<br><strong>5.</strong> The 9 site tables (churn, customers, products, orders, reviews, tweets, housing, stocks, iris) are real and joined where it makes sense.<br><strong>6.</strong> <code>run_sql()</code> on this site returns a pandas DataFrame — bridging SQL and Python.</div></div>
</div>

<div class="calc-graph"><div id="sql-l1-plot-en" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['churn','customers','orders','products','reviews','tweets','housing','stocks','iris'],y:[500,500,2000,39,300,300,200,261,150],type:'bar',marker:{color:T.accent}}];
  var layout={title:'Rows per table in playground',paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid},yaxis:{gridcolor:T.grid,title:'rows'},margin:{t:50,r:30,b:80,l:60}};
  var elEN=document.getElementById('sql-l1-plot-en'); if(elEN) Plotly.newPlot(elEN,data,layout,{displayModeBar:false});
},250);</script>`,

tr: `<p class="l-text"><strong>SQL, verinin günlük dilidir.</strong> İster müşteri kaybını analiz ediyor olun, ister panolar inşa ediyor, ister makine öğrenmesi hatlarını besliyor olun — dokunacağınız neredeyse her veri kümesi bir ilişkisel veritabanında yaşar. SQL (Structured Query Language) bu veritabanına soru sorma biçiminizdir.</p>
<p class="l-text">Bu ilk derste "tablo" kavramını netleştirecek, bu sitenin oyun alanında yüklü 9 gerçek tabloyu göreceğiz ve ilk sorgumuzu çalıştıracağız. Ders sonunda ilk SQL çıktınızı bir pandas DataFrame olarak okuyup her hücrenin ne anlama geldiğini bileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>SQL'in neden declarative olduğunu ve query planner'ın çalışmayı nasıl optimize ettiğini açıkla</li><li>Gerçek tablolarda satır, sütun, şema, primary key ve foreign key'leri tanı</li><li>9 oyun alanı tablosunu incele ve sütun türlerini oku</li><li>İlk SELECT'i çalıştır ve sonucu pandas DataFrame olarak oku</li><li>Pyodide'daki run_sql() ile tarayıcıdaki gerçek SQLite motoruna bağlan</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. SQL nedir, neden bu kadar yaygın?</h2>
<p class="l-text">SQL 1970'lerde IBM'de icat edildi ve onlarca programlama akımından sağ çıktı. Sebebi basit: verinizin yapısı varsa (müşteri satırları, sipariş satırları, fiyat satırları), SQL size döngü yazmadan herhangi bir dilimi alma imkanı verir.</p>
<p class="l-text"><em>Ne</em> istediğinizi tarif edersiniz; veritabanı motoru indeksleri, sorgu planını ve onlarca yıllık optimizasyon araştırmasını kullanarak <em>nasıl</em> getireceğine kendisi karar verir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bildirimsel</div><div class="card-body">Soruyu yazarsınız, algoritmayı değil. "Harcamaya göre ilk 10 müşteri" — for döngüsü değil.</div></div>
<div class="calc-card"><div class="card-title">Evrensel</div><div class="card-body">PostgreSQL, MySQL, SQLite, Snowflake, BigQuery — hepsi küçük lehçe farklarıyla SQL konuşur.</div></div>
<div class="calc-card"><div class="card-title">Hızlı</div><div class="card-body">Onlarca yıl optimizasyon. Modern motorlarda saniyede milyarlarca satır taranır.</div></div>
<div class="calc-card"><div class="card-title">Bileşken</div><div class="card-body">Alt sorgular, CTE'ler, pencere fonksiyonları — küçük parçalardan büyük analizler.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Tablolar, satırlar, sütunlar — zihinsel model</h2>
<p class="l-text">İlişkisel veritabanı bir <strong>tablo</strong> koleksiyonudur. Bir tablo, kuralları olan bir elektronik tablodur: her sütunun sabit bir tipi vardır (metin, tamsayı, tarih) ve her satır bir varlığı temsil eder (bir müşteri, bir sipariş, bir tweet).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Satır</div><div class="card-body">Bir kayıt. Bir müşteri. Bir sipariş. Bir tweet. "Tuple" da denir.</div></div>
<div class="calc-card"><div class="card-title">Sütun</div><div class="card-body">Bir özellik. customer_id, age, country, price. "Alan" veya "öznitelik" de denir.</div></div>
<div class="calc-card"><div class="card-title">Şema</div><div class="card-body">Plan: hangi tablolar var, her birinin sütunları, kullanılan tipler.</div></div>
<div class="calc-card"><div class="card-title">Birincil Anahtar</div><div class="card-body">Satırı tek başına tanımlayan sütun (veya kombinasyon). customer_id gibi.</div></div>
<div class="calc-card"><div class="card-title">Yabancı Anahtar</div><div class="card-body">Başka tablonun birincil anahtarına işaret eden sütun. Siparişleri müşterilere bağlar.</div></div>
<div class="calc-card"><div class="card-title">İndeks</div><div class="card-body">Aramaları hızlandıran arka plan veri yapısı (L8'de).</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Bu oyun alanındaki 9 tablo</h2>
<p class="l-text">Bu sitede 9 gerçek tablo ve toplam ~4.300 satırlık gerçekçi veri içeren bir SQLite veritabanı önceden yüklü. Önce listeleyelim.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT name
    FROM sqlite_master
    WHERE type='table'
    ORDER BY name
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>sqlite_master</code> SQLite'ın otomatik tuttuğu yerleşik katalog tablosudur. 2) <code>WHERE type='table'</code> ile indeks ve view'leri ayıklarız. 3) <code>ORDER BY name</code> alfabetik sıralar. 4) <code>run_sql</code> SQL'i SQLite'a iletir, satırları alır, pandas DataFrame'e sarar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">churn (500)</div><div class="card-body">Telekom müşteri kayıp verisi — monthly_charge, tenure_months, contract_type, churned dahil 12 sütun.</div></div>
<div class="calc-card"><div class="card-title">customers (500)</div><div class="card-body">Müşteri profili — ad, soyad, e-posta, ülke, şehir, kayıt tarihi. customer_id ile churn'a bağlı.</div></div>
<div class="calc-card"><div class="card-title">products (39)</div><div class="card-body">Katalog — product_id, name, category, price_usd, stock.</div></div>
<div class="calc-card"><div class="card-title">orders (2000)</div><div class="card-body">İşlemler — order_id, customer_id, product_id, quantity, order_date, total_usd, status.</div></div>
<div class="calc-card"><div class="card-title">reviews (300)</div><div class="card-body">Ürün yorumları — sentiment etiketi, kategori, puan, kelime sayısı.</div></div>
<div class="calc-card"><div class="card-title">tweets (300)</div><div class="card-body">Sosyal paylaşım — metin, dil, duygu, hashtagler, mention, link, uzunluk.</div></div>
<div class="calc-card"><div class="card-title">housing (200)</div><div class="card-body">Emlak — oda, banyo, m2, yaş, ilçe, fiyat (TL).</div></div>
<div class="calc-card"><div class="card-title">stocks (261)</div><div class="card-body">Günlük OHLCV — tarih, açılış, yüksek, düşük, kapanış, hacim.</div></div>
<div class="calc-card"><div class="card-title">iris (150)</div><div class="card-body">Klasik ML veri kümesi — sepal/petal ölçümleri, tür.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. İlk SELECT'iniz</h2>
<p class="l-text"><code>SELECT</code> SQL'in beygiridir. En basit hali: bir tablodan sütun seçmek.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT *
    FROM customers
    LIMIT 5
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>SELECT *</code> "tüm sütunlar" demek. 2) <code>FROM customers</code> kaynak tabloyu seçer. 3) <code>LIMIT 5</code> çıktıyı 5 satırla sınırlar — veriye boğulmamak için. 4) Sonuç customer_id, first_name, last_name, email, country, city, signup_date sütunlarını içeren 5 satırlık bir DataFrame.</p>
<p class="l-text">Çıktıyı okumak: her satır gerçek bir müşteri kaydı. Soldaki indeks (0,1,2,3,4) pandas tarafından eklenir — SQL sonucunun parçası değildir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Belirli sütunları seçmek</h2>
<p class="l-text"><code>*</code> ile her şeyi seçmek keşif için iyi ama üretimde israftır — ağ tüm veriyi taşır, ihtiyacınız olmasa bile. Açık olun.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT first_name, last_name, country
    FROM customers
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Virgülle ayrılmış 3 sütun listeleriz. 2) SELECT'teki sıra çıktıdaki sütun sırasını belirler. 3) LIMIT 10 satıra düşer. 4) <code>SELECT *</code> ile karşılaştırın — şimdi yalnız 3 sütun.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Satır saymak — ikinci SQL beceriniz</h2>
<p class="l-text">Herhangi bir analizden önce kaç satırınız olduğunu bilmelisiniz. <code>COUNT(*)</code> evrensel cevaptır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT COUNT(*) AS total_customers
    FROM customers
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>COUNT(*)</code> her satırı sayar. 2) <code>AS total_customers</code> sonuç sütununa okunaklı bir ad verir (bu <em>alias</em>tır). 3) Çıktı 1 satır 1 sütun. 4) LIMIT yok — agregat fonksiyonlar zaten tek satır döner.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pandas ve SQL — aynı kavramlar, farklı sözdizimi</h2>
<p class="l-text">Pandas biliyorsanız SQL büyük ölçüde çeviri işidir. Zihinsel model özdeştir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">df[col]</div><div class="card-body">SQL: <code>SELECT col FROM df</code></div></div>
<div class="calc-card"><div class="card-title">df[df.x &gt; 5]</div><div class="card-body">SQL: <code>WHERE x &gt; 5</code></div></div>
<div class="calc-card"><div class="card-title">df.groupby(c).mean()</div><div class="card-body">SQL: <code>GROUP BY c</code> + <code>AVG()</code></div></div>
<div class="calc-card"><div class="card-title">df.sort_values</div><div class="card-body">SQL: <code>ORDER BY</code></div></div>
<div class="calc-card"><div class="card-title">df.merge</div><div class="card-body">SQL: <code>JOIN</code></div></div>
<div class="calc-card"><div class="card-title">df.head(5)</div><div class="card-body">SQL: <code>LIMIT 5</code></div></div>
</div>
<p class="l-text">SQL'in büyük avantajı: hesabı veritabanına iter, veri motordan çıkmadığı için milyarlarca satır taranabilir. Pandas önce RAM'e çeker.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Şemayı keşfetmek</h2>
<p class="l-text">Herhangi bir tablonun sütunlarını görmek için — şemayı hatırlamadığınızda işe yarar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    PRAGMA table_info(churn)
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>PRAGMA</code> SQLite'a özgü meta sorgu sözdizimidir. 2) <code>table_info(churn)</code> her sütun için ad, tip, null kabul, varsayılan, birincil anahtar bayrağı içeren bir satır döner. 3) Sütunları unuttuğunuzda kullanın. 4) Diğer veritabanları aynı amaçla <code>INFORMATION_SCHEMA.COLUMNS</code> kullanır.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Önemli çıkarımlar</h2>
<div class="think-box"><div class="think-label">ÖNEMLİ NOKTALAR</div><div class="think-body"><strong>1.</strong> SQL bildirimseldir — sonucu tarif edersiniz, adımları değil.<br><strong>2.</strong> Tablo = satırlar (kayıtlar) + sütunlar (öznitelikler), kesin tiplerle.<br><strong>3.</strong> <code>SELECT col FROM table LIMIT n</code> temel sorgu kalıbıdır.<br><strong>4.</strong> Keşif için <code>SELECT *</code>, üretimde isimli sütunlar.<br><strong>5.</strong> Sitedeki 9 tablo (churn, customers, products, orders, reviews, tweets, housing, stocks, iris) gerçek ve mantıklı yerlerde birbirine bağlı.<br><strong>6.</strong> <code>run_sql()</code> bir pandas DataFrame döner — SQL ile Python'u köprüler.</div></div>
</div>

<div class="calc-graph"><div id="sql-l1-plot-tr" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['churn','customers','orders','products','reviews','tweets','housing','stocks','iris'],y:[500,500,2000,39,300,300,200,261,150],type:'bar',marker:{color:T.accent}}];
  var layout={title:'Oyun alanındaki tablo başına satır sayısı',paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid},yaxis:{gridcolor:T.grid,title:'satır'},margin:{t:50,r:30,b:80,l:60}};
  var elTR=document.getElementById('sql-l1-plot-tr'); if(elTR) Plotly.newPlot(elTR,data,layout,{displayModeBar:false});
},250);</script>
`
};
