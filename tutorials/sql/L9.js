window.SQL_L9 = {

en: `<p class="l-text"><strong>Schema is destiny.</strong> A well-designed schema makes queries elegant and data correct by construction. A bad schema makes every query a workaround. Most production database problems trace back to poor early decisions about tables and columns.</p>
<p class="l-text">In this lesson we cover types, constraints (PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT), normalization (1NF/2NF/3NF intuitively), the star schema for analytics, and a brief note on when to deliberately denormalize.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Define tables with CREATE TABLE, column types, and NOT NULL constraints</li><li>Add primary keys, foreign keys, and unique constraints for data integrity</li><li>Insert, update, and delete rows safely inside transactions</li><li>Wrap multiple statements in BEGIN / COMMIT / ROLLBACK for atomicity</li><li>Migrate schemas with ALTER TABLE and reason about backward compatibility</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. CREATE TABLE — the basics</h2>
<p class="l-text">A table definition specifies columns, types, and constraints. SQLite is permissive about types (it has "type affinity" rather than strict types), but treat them seriously — your queries and downstream tools will benefit.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    CREATE TABLE IF NOT EXISTS demo_employees (
      employee_id   INTEGER PRIMARY KEY,
      first_name    TEXT NOT NULL,
      last_name     TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      hire_date     TEXT DEFAULT CURRENT_DATE,
      salary        REAL CHECK (salary &gt;= 0),
      department_id INTEGER
    )
"""</span>)
<span class="fn">print</span>(result)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"PRAGMA table_info(demo_employees)"</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Six columns with types: INTEGER, TEXT, REAL. 2) <code>PRIMARY KEY</code> = unique + indexed automatically. 3) <code>NOT NULL</code> rejects missing values. 4) <code>UNIQUE</code> rejects duplicate emails. 5) <code>DEFAULT CURRENT_DATE</code> fills hire_date if omitted. 6) <code>CHECK</code> validates: salary cannot be negative. 7) <code>PRAGMA table_info</code> verifies the schema is what we wrote.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. SQLite type affinity</h2>
<p class="l-text">SQLite is "duck-typed". A column declared INTEGER will accept text or floats, applying conversion rules. Five storage classes:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">NULL</div><div class="card-body">The absence of value.</div></div>
<div class="calc-card"><div class="card-title">INTEGER</div><div class="card-body">Whole numbers, 1–8 byte signed.</div></div>
<div class="calc-card"><div class="card-title">REAL</div><div class="card-body">Floating point, 8-byte IEEE 754.</div></div>
<div class="calc-card"><div class="card-title">TEXT</div><div class="card-body">UTF-8/16 string.</div></div>
<div class="calc-card"><div class="card-title">BLOB</div><div class="card-body">Raw bytes (images, files).</div></div>
</div>
<p class="l-text">Other databases (PostgreSQL, MySQL) enforce types strictly. Always declare types explicitly — your tools and your future self will thank you.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Constraints — making bad data impossible</h2>
<p class="l-text">Constraints push data integrity into the database itself, not application code. The benefit: every program writing to the table — yours, a colleague's, a cron job — must obey.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PRIMARY KEY</div><div class="card-body">Unique row identifier. Auto-indexed. Prevents duplicates.</div></div>
<div class="calc-card"><div class="card-title">FOREIGN KEY</div><div class="card-body">References another table's PK. Prevents orphaned rows.</div></div>
<div class="calc-card"><div class="card-title">UNIQUE</div><div class="card-body">No duplicates. Allows NULLs (each NULL is distinct).</div></div>
<div class="calc-card"><div class="card-title">NOT NULL</div><div class="card-body">Value must be supplied.</div></div>
<div class="calc-card"><div class="card-title">CHECK</div><div class="card-body">Custom predicate. Rejects rows that fail it.</div></div>
<div class="calc-card"><div class="card-title">DEFAULT</div><div class="card-body">Fallback value when column is omitted on INSERT.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Foreign keys — relational integrity</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    CREATE TABLE IF NOT EXISTS demo_departments (
      department_id INTEGER PRIMARY KEY,
      name          TEXT NOT NULL UNIQUE
    )
"""</span>)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"""
    CREATE TABLE IF NOT EXISTS demo_employees_v2 (
      employee_id INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      dept_id     INTEGER,
      FOREIGN KEY (dept_id) REFERENCES demo_departments(department_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
    )
"""</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Two tables linked by FK from demo_employees_v2.dept_id to demo_departments.department_id. 2) <code>ON DELETE SET NULL</code> = if a department is deleted, employees' dept_id becomes NULL. 3) <code>ON UPDATE CASCADE</code> = if department_id changes, child rows update too. 4) Other options: RESTRICT (block delete), CASCADE (also delete children), NO ACTION. 5) Note: SQLite requires <code>PRAGMA foreign_keys = ON</code> to enforce — most modern setups do.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Normalization — 1NF, 2NF, 3NF</h2>
<p class="l-text">A schema design discipline. The high-level rule: every fact in exactly one place.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1NF</div><div class="card-body">Atomic columns. No "phone1, phone2, phone3" — make a phones table.</div></div>
<div class="calc-card"><div class="card-title">2NF</div><div class="card-body">Every non-key column depends on the WHOLE primary key, not part of it (matters for composite keys).</div></div>
<div class="calc-card"><div class="card-title">3NF</div><div class="card-body">Non-key columns depend on the key only — not on other non-key columns. No transitive dependencies.</div></div>
<div class="calc-card"><div class="card-title">BCNF / 4NF / 5NF</div><div class="card-body">Stricter forms. Rarely worth the cognitive cost in practice.</div></div>
</div>
<p class="l-text">A useful heuristic: if updating one fact requires changing many rows, you're under-normalized. If you need 8 joins for a basic query, you're over-normalized.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Worked example — denormalized vs normalized</h2>
<p class="l-text">Imagine an order log with everything in one table:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bad (1 table)</div><div class="card-body">order_id, customer_name, customer_email, customer_country, product_name, product_price, quantity, order_date</div></div>
<div class="calc-card"><div class="card-title">Good (3 tables)</div><div class="card-body">customers (id, name, email, country) · products (id, name, price) · orders (id, customer_id, product_id, quantity, date)</div></div>
</div>
<p class="l-text">In the bad version, changing a customer's email means updating every one of their orders — and any miss creates inconsistent data. In the good version, one row in customers changes; orders join in to display the up-to-date email automatically.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Star schema — for analytics</h2>
<p class="l-text">Operational systems use highly normalized OLTP schemas. Analytics systems often use a <strong>star schema</strong>: a central <em>fact table</em> (transactions, events) surrounded by <em>dimension tables</em> (date, product, customer, location).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fact table</div><div class="card-body">Many narrow rows: foreign keys + a few measures (price, quantity, duration).</div></div>
<div class="calc-card"><div class="card-title">Dimension tables</div><div class="card-body">Few wide rows: rich descriptive attributes for slicing and dicing.</div></div>
<div class="calc-card"><div class="card-title">Example</div><div class="card-body">Our orders is the fact; customers and products are dimensions. A "date" dimension would add weekday, holiday flag, fiscal quarter.</div></div>
<div class="calc-card"><div class="card-title">Why star?</div><div class="card-body">Predictable joins, fast aggregations, BI-tool friendly.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Inspecting the playground schema</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT name, sql
    FROM sqlite_master
    WHERE type='table'
      AND name IN ('customers','orders','products','churn')
    ORDER BY name
"""</span>)
<span class="kw">for</span> _, row <span class="kw">in</span> result.<span class="fn">iterrows</span>():
    <span class="fn">print</span>(row[<span class="str">'name'</span>])
    <span class="fn">print</span>(row[<span class="str">'sql'</span>])
    <span class="fn">print</span>(<span class="str">'---'</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>sqlite_master</code> stores the original CREATE TABLE statement in <code>sql</code>. 2) Filter to four tables. 3) Iterate rows in pandas to print each schema. 4) Read these definitions to understand what types and constraints the playground actually uses.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Denormalization — when speed beats purity</h2>
<p class="l-text">Reading a fully normalized schema can require many joins. For analytics workloads where reads dominate writes, copying a few columns into the fact table (denormalization) is a sane tradeoff.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">When to denormalize</div><div class="card-body">Read-heavy analytics, near-static reference data, columns used in every query, very wide joins.</div></div>
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">Extra storage. Update propagation responsibility shifts to the ETL.</div></div>
<div class="calc-card"><div class="card-title">Modern data warehouse</div><div class="card-body">BigQuery, Snowflake, Redshift charge for I/O — denormalized "wide tables" can be cheaper.</div></div>
<div class="calc-card"><div class="card-title">Materialized views</div><div class="card-body">A controlled compromise: pre-compute and store aggregates / joins.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. ER diagrams in prose</h2>
<p class="l-text">An entity-relationship diagram shows tables as boxes and relationships as lines, with cardinality marks (1, N, M). For our playground:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">customers (1) - (N) orders</div><div class="card-body">One customer has many orders.</div></div>
<div class="calc-card"><div class="card-title">products (1) - (N) orders</div><div class="card-body">One product appears in many order rows.</div></div>
<div class="calc-card"><div class="card-title">customers (1) - (1) churn</div><div class="card-body">Each customer has one churn profile (telecom subscription).</div></div>
</div>
<p class="l-text">Drawing the ER before writing CREATE TABLE saves rewrites later. Tools like dbdiagram.io let you sketch in plain text.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Inserting data — a brief detour</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    INSERT INTO demo_employees (first_name, last_name, email, salary)
    VALUES ('Ada', 'Lovelace', 'ada@example.com', 9999.00),
           ('Alan', 'Turing',  'alan@example.com', 9999.00)
"""</span>)
<span class="fn">print</span>(result)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"SELECT * FROM demo_employees ORDER BY last_name"</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Insert two rows. 2) Columns omitted (employee_id, hire_date) get auto/default values. 3) Multi-row INSERT is faster than two single-row INSERTs. 4) The CHECK constraint validates salary &gt;= 0 — try a negative value and it errors.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Key takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Declare types explicitly even in SQLite — clarity for tools and humans.<br><strong>2.</strong> Constraints (PK, FK, UNIQUE, NOT NULL, CHECK) push integrity into the database.<br><strong>3.</strong> Normalize so each fact lives in exactly one place — easier updates, less inconsistency.<br><strong>4.</strong> Star schema (fact + dimensions) suits analytics; OLTP often goes higher normal form.<br><strong>5.</strong> Denormalize deliberately when reads dominate and joins hurt throughput.<br><strong>6.</strong> Sketch the ER diagram before writing CREATE TABLE.</div></div>
</div>

<div class="calc-graph"><div id="sql-l9-plot-en" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['1NF','2NF','3NF','BCNF','Star schema','Denormalized'],y:[100,90,80,40,70,55],type:'bar',marker:{color:T.accent},name:'frequency %'}];
  var layout={paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid,title:'schema pattern'},yaxis:{gridcolor:T.grid,title:'%'},legend:{orientation:'h',y:-0.25,x:0.5,xanchor:'center'},margin:{t:30,r:30,b:80,l:60}};
  var elEN=document.getElementById('sql-l9-plot-en'); if(elEN) Plotly.newPlot(elEN,data,layout,{displayModeBar:false});
},250);</script>`,

tr: `<p class="l-text"><strong>Şema kaderdir.</strong> İyi tasarlanmış şema sorguları zarif, veriyi yapısal olarak doğru yapar. Kötü şema her sorguyu çözüm üretmeye dönüştürür. Üretim veritabanı sorunlarının çoğu erken tablo/sütun kararlarına dayanır.</p>
<p class="l-text">Bu derste tipler, kısıtlar (PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT), normalleştirme (1NF/2NF/3NF sezgisel), analitik için yıldız şema ve bilinçli denormalizasyon.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>CREATE TABLE, sütun türleri ve NOT NULL kısıtlarıyla tablo tanımla</li><li>Veri bütünlüğü için primary key, foreign key ve unique kısıt ekle</li><li>İşlemler içinde satırları güvenle insert, update ve delete yap</li><li>Atomicity için birden fazla ifadeyi BEGIN / COMMIT / ROLLBACK ile sar</li><li>ALTER TABLE ile şemayı taşı ve geriye dönük uyumluluğu düşün</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. CREATE TABLE — temeller</h2>
<p class="l-text">Tablo tanımı sütunları, tipleri ve kısıtları belirtir. SQLite tipler konusunda esnektir ("type affinity"), ama yine de ciddi davranın — sorgularınız ve sonraki araçlar fayda görür.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    CREATE TABLE IF NOT EXISTS demo_employees (
      employee_id   INTEGER PRIMARY KEY,
      first_name    TEXT NOT NULL,
      last_name     TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      hire_date     TEXT DEFAULT CURRENT_DATE,
      salary        REAL CHECK (salary &gt;= 0),
      department_id INTEGER
    )
"""</span>)
<span class="fn">print</span>(result)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"PRAGMA table_info(demo_employees)"</span>))</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Altı sütun: INTEGER, TEXT, REAL. 2) <code>PRIMARY KEY</code> = otomatik benzersiz + indeksli. 3) <code>NOT NULL</code> eksik değeri reddeder. 4) <code>UNIQUE</code> e-posta tekrarını engeller. 5) <code>DEFAULT CURRENT_DATE</code> hire_date verilmezse doldurur. 6) <code>CHECK</code> doğrular: maaş negatif olamaz. 7) <code>PRAGMA table_info</code> şemayı doğrular.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. SQLite type affinity</h2>
<p class="l-text">SQLite "ördek-tipli"dir. INTEGER tanımlı sütun metin veya kayan nokta kabul eder, dönüştürür. Beş depolama sınıfı:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">NULL</div><div class="card-body">Değerin yokluğu.</div></div>
<div class="calc-card"><div class="card-title">INTEGER</div><div class="card-body">Tam sayı, 1–8 bayt işaretli.</div></div>
<div class="calc-card"><div class="card-title">REAL</div><div class="card-body">Kayan nokta, 8 bayt IEEE 754.</div></div>
<div class="calc-card"><div class="card-title">TEXT</div><div class="card-body">UTF-8/16 metin.</div></div>
<div class="calc-card"><div class="card-title">BLOB</div><div class="card-body">Ham bayt (görüntü, dosya).</div></div>
</div>
<p class="l-text">Diğer veritabanları (PostgreSQL, MySQL) tipi katı uygular. Tipleri her zaman açık tanımlayın — araçlar ve gelecekteki siz teşekkür eder.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Kısıtlar — kötü veriyi imkansız kıl</h2>
<p class="l-text">Kısıtlar veri bütünlüğünü uygulama koduna değil, veritabanına iter. Kazanç: tabloya yazan her program — sizin, meslektaşınızın, cron'un — uymak zorunda.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PRIMARY KEY</div><div class="card-body">Benzersiz satır kimliği. Otomatik indeks. Tekrarı önler.</div></div>
<div class="calc-card"><div class="card-title">FOREIGN KEY</div><div class="card-body">Başka tablonun PK'sine referans. Sahipsiz satırı önler.</div></div>
<div class="calc-card"><div class="card-title">UNIQUE</div><div class="card-body">Tekrar yok. NULL'lara izin verir (her NULL ayrı sayılır).</div></div>
<div class="calc-card"><div class="card-title">NOT NULL</div><div class="card-body">Değer sağlanmalı.</div></div>
<div class="calc-card"><div class="card-title">CHECK</div><div class="card-body">Özel koşul. Sağlamayan satırı reddeder.</div></div>
<div class="calc-card"><div class="card-title">DEFAULT</div><div class="card-body">INSERT'te sütun atlanırsa varsayılan.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Yabancı anahtarlar — ilişkisel bütünlük</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    CREATE TABLE IF NOT EXISTS demo_departments (
      department_id INTEGER PRIMARY KEY,
      name          TEXT NOT NULL UNIQUE
    )
"""</span>)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"""
    CREATE TABLE IF NOT EXISTS demo_employees_v2 (
      employee_id INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      dept_id     INTEGER,
      FOREIGN KEY (dept_id) REFERENCES demo_departments(department_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
    )
"""</span>))</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) İki tablo, dept_id ile demo_departments.department_id'ye FK. 2) <code>ON DELETE SET NULL</code> = departman silinirse çalışanın dept_id'si NULL olur. 3) <code>ON UPDATE CASCADE</code> = department_id değişirse alt satırlar da güncellenir. 4) Diğer seçenekler: RESTRICT (silmeyi engelle), CASCADE (alt satırları da sil), NO ACTION. 5) Not: SQLite uygulamak için <code>PRAGMA foreign_keys = ON</code> ister — modern kurulumların çoğu açar.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Normalleştirme — 1NF, 2NF, 3NF</h2>
<p class="l-text">Şema tasarım disiplini. Üst düzey kural: her olgu tek bir yerde.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1NF</div><div class="card-body">Atomik sütunlar. "phone1, phone2, phone3" yok — phones tablosu yap.</div></div>
<div class="calc-card"><div class="card-title">2NF</div><div class="card-body">Anahtar olmayan her sütun TÜM birincil anahtara bağlı, parçasına değil (bileşik anahtarda önemli).</div></div>
<div class="calc-card"><div class="card-title">3NF</div><div class="card-body">Anahtar olmayan sütunlar yalnız anahtara bağlı — başka anahtar olmayan sütuna değil. Geçişli bağımlılık yok.</div></div>
<div class="calc-card"><div class="card-title">BCNF / 4NF / 5NF</div><div class="card-body">Daha katı biçimler. Pratikte bilişsel maliyete nadiren değer.</div></div>
</div>
<p class="l-text">Faydalı buluştuk: bir olguyu güncellemek çok satır değiştirmeyi gerektiriyorsa az normalleştirilmiş; basit sorgu için 8 join gerekiyorsa fazla normalleştirilmişsiniz.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Çalışılmış örnek — denormalize vs normalize</h2>
<p class="l-text">Tek tabloda her şey olan bir sipariş günlüğü hayal edin:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kötü (1 tablo)</div><div class="card-body">order_id, customer_name, customer_email, customer_country, product_name, product_price, quantity, order_date</div></div>
<div class="calc-card"><div class="card-title">İyi (3 tablo)</div><div class="card-body">customers (id, name, email, country) · products (id, name, price) · orders (id, customer_id, product_id, quantity, date)</div></div>
</div>
<p class="l-text">Kötü versiyonda müşterinin e-postasını değiştirmek tüm siparişlerini güncellemeyi gerektirir — her atlama tutarsız veri yaratır. İyi versiyonda customers'ta tek satır değişir; orders join ile güncel e-postayı otomatik gösterir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Yıldız şema — analitik için</h2>
<p class="l-text">Operasyonel sistemler yüksek normalleştirilmiş OLTP şemalarını kullanır. Analitik sistemler sıkça <strong>yıldız şemayı</strong> kullanır: merkezi <em>fact tablosu</em> (işlemler, olaylar) etrafında <em>boyut tabloları</em> (tarih, ürün, müşteri, konum).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fact tablosu</div><div class="card-body">Çok dar satır: yabancı anahtarlar + birkaç ölçüm (fiyat, miktar, süre).</div></div>
<div class="calc-card"><div class="card-title">Boyut tablosu</div><div class="card-body">Az geniş satır: dilimleme için zengin tanımsal öznitelikler.</div></div>
<div class="calc-card"><div class="card-title">Örnek</div><div class="card-body">orders fact; customers ve products boyut. "date" boyutu hafta günü, tatil bayrağı, mali çeyrek ekler.</div></div>
<div class="calc-card"><div class="card-title">Neden yıldız?</div><div class="card-body">Öngörülebilir join, hızlı toplama, BI araç dostu.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Oyun alanı şemasını incelemek</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT name, sql
    FROM sqlite_master
    WHERE type='table'
      AND name IN ('customers','orders','products','churn')
    ORDER BY name
"""</span>)
<span class="kw">for</span> _, row <span class="kw">in</span> result.<span class="fn">iterrows</span>():
    <span class="fn">print</span>(row[<span class="str">'name'</span>])
    <span class="fn">print</span>(row[<span class="str">'sql'</span>])
    <span class="fn">print</span>(<span class="str">'---'</span>)</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>sqlite_master</code> orijinal CREATE TABLE'ı <code>sql</code>'de saklar. 2) Dört tabloya filtre. 3) Pandas ile satırları gezerek her şemayı yazdır. 4) Bu tanımları okuyarak oyun alanının gerçekte hangi tip ve kısıtları kullandığını öğrenin.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Denormalizasyon — hızın saflığı yendiği zamanlar</h2>
<p class="l-text">Tamamen normalleştirilmiş şemayı okumak çok join gerektirebilir. Yazmadan çok okumanın baskın olduğu analitik yüklerde, fact tablosuna birkaç sütun kopyalamak (denormalizasyon) makul bir takastır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ne zaman denormalize</div><div class="card-body">Okuma yoğun analitik, neredeyse durağan referans veri, her sorguda kullanılan sütunlar, çok geniş join.</div></div>
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">Ek depolama. Güncelleme sorumluluğu ETL'e geçer.</div></div>
<div class="calc-card"><div class="card-title">Modern veri ambarı</div><div class="card-body">BigQuery, Snowflake, Redshift I/O ücreti alır — denormalize "geniş tablolar" daha ucuz olabilir.</div></div>
<div class="calc-card"><div class="card-title">Materyalize view</div><div class="card-body">Kontrollü uzlaşma: agregat / join'i önceden hesapla ve sakla.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. ER diyagramları (yazılı)</h2>
<p class="l-text">Varlık-ilişki diyagramı tabloları kutu, ilişkileri çizgi olarak, kardinalite işaretleriyle (1, N, M) gösterir. Bizim oyun alanı için:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">customers (1) - (N) orders</div><div class="card-body">Bir müşterinin çok siparişi.</div></div>
<div class="calc-card"><div class="card-title">products (1) - (N) orders</div><div class="card-body">Bir ürün çok sipariş satırında görünür.</div></div>
<div class="calc-card"><div class="card-title">customers (1) - (1) churn</div><div class="card-body">Her müşterinin tek churn profili (telekom aboneliği).</div></div>
</div>
<p class="l-text">CREATE TABLE'dan önce ER çizmek sonra yeniden yazmaktan kurtarır. dbdiagram.io gibi araçlar düz metinle eskiz çizdirir.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Veri eklemek — kısa bir ek not</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    INSERT INTO demo_employees (first_name, last_name, email, salary)
    VALUES ('Ada', 'Lovelace', 'ada@example.com', 9999.00),
           ('Alan', 'Turing',  'alan@example.com', 9999.00)
"""</span>)
<span class="fn">print</span>(result)
<span class="fn">print</span>(<span class="fn">run_sql</span>(<span class="str">"SELECT * FROM demo_employees ORDER BY last_name"</span>))</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) İki satır ekler. 2) Atlanan sütunlar (employee_id, hire_date) otomatik/varsayılan değer alır. 3) Çoklu satır INSERT iki tek satırlık INSERT'ten hızlıdır. 4) CHECK kısıtı salary &gt;= 0'ı doğrular — negatif denerseniz hata verir.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Önemli çıkarımlar</h2>
<div class="think-box"><div class="think-label">ÖNEMLİ NOKTALAR</div><div class="think-body"><strong>1.</strong> SQLite'ta bile tipi açık tanımlayın — araçlar ve insanlar için netlik.<br><strong>2.</strong> Kısıtlar (PK, FK, UNIQUE, NOT NULL, CHECK) bütünlüğü veritabanına iter.<br><strong>3.</strong> Her olgu tek yerde yaşasın diye normalleştirin — kolay güncelleme, az tutarsızlık.<br><strong>4.</strong> Yıldız şema (fact + boyut) analitik için; OLTP daha yüksek normal forma gider.<br><strong>5.</strong> Okuma baskın ve join'ler yavaşlatıyorsa bilinçli denormalize edin.<br><strong>6.</strong> CREATE TABLE'dan önce ER diyagramı çizin.</div></div>
</div>

<div class="calc-graph"><div id="sql-l9-plot-tr" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['1NF','2NF','3NF','BCNF','Yıldız şema','Denormalize'],y:[100,90,80,40,70,55],type:'bar',marker:{color:T.accent},name:'sıklık %'}];
  var layout={paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid,title:'şema deseni'},yaxis:{gridcolor:T.grid,title:'%'},legend:{orientation:'h',y:-0.25,x:0.5,xanchor:'center'},margin:{t:30,r:30,b:80,l:60}};
  var elTR=document.getElementById('sql-l9-plot-tr'); if(elTR) Plotly.newPlot(elTR,data,layout,{displayModeBar:false});
},250);</script>
`
};
