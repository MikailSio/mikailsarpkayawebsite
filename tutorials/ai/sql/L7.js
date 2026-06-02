window.SQL_L7 = {

en: `<p class="l-text"><strong>Real data is messy.</strong> Dates need parsing, strings need cleaning, NULLs are everywhere, and business logic often turns continuous values into categorical buckets. SQL has a rich set of scalar functions for exactly these tasks.</p>
<p class="l-text">In this lesson we cover SQLite's date/time functions, string manipulation (LIKE, LOWER, SUBSTR, REPLACE, etc.), the powerful <code>CASE WHEN</code> expression, and NULL-safe coalescing. By the end your queries will handle real-world dirt elegantly.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Store and parse dates as ISO 8601 text in SQLite</li><li>Extract year, month, day, and weekday with strftime</li><li>Compute date differences with julianday and date arithmetic</li><li>Bucket events into days, weeks, and months for time-series reporting</li><li>Handle timezones and avoid common UTC vs local-time bugs</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. SQLite date/time — text-based but capable</h2>
<p class="l-text">SQLite stores dates as text in ISO 8601 format ('2025-04-15'). The <code>strftime</code>, <code>date</code>, and <code>julianday</code> functions handle parsing, formatting, and arithmetic.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">date(x)</div><div class="card-body">Returns YYYY-MM-DD form.</div></div>
<div class="calc-card"><div class="card-title">strftime(fmt, x)</div><div class="card-body">Formats: '%Y' year, '%m' month, '%d' day, '%w' weekday.</div></div>
<div class="calc-card"><div class="card-title">julianday(x)</div><div class="card-body">Days since 4713 BC. Subtract two julianday values for day differences.</div></div>
<div class="calc-card"><div class="card-title">CURRENT_DATE</div><div class="card-body">Today's date as text.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Days since signup — date arithmetic</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      customer_id,
      first_name,
      country,
      signup_date,
      CAST(julianday('2026-05-01') - julianday(signup_date) AS INTEGER) AS days_since_signup
    FROM customers
    ORDER BY days_since_signup DESC
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>julianday('2026-05-01')</code> converts our anchor date to a numeric day count. 2) Subtracting julianday values gives a number of days as a float. 3) <code>CAST AS INTEGER</code> truncates to whole days. 4) Replace the literal with <code>CURRENT_DATE</code> in production. 5) Sort DESC to find the longest-tenured customers — useful for loyalty programs.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Group by month — strftime extraction</h2>
<p class="l-text">"How many orders per month?"</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      strftime('%Y-%m', order_date) AS month,
      COUNT(*)                       AS n_orders,
      ROUND(SUM(total_usd), 2)       AS revenue,
      ROUND(AVG(total_usd), 2)       AS avg_ticket
    FROM orders
    GROUP BY month
    ORDER BY month
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>strftime('%Y-%m', order_date)</code> trims a date to "2025-04". 2) GROUP BY that string buckets orders into months. 3) Three aggregates per month — count, revenue, average ticket. 4) Output is a clean monthly cohort table — feed this to a chart and you have a dashboard.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Day of week patterns</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      CASE strftime('%w', order_date)
        WHEN '0' THEN 'Sun'
        WHEN '1' THEN 'Mon'
        WHEN '2' THEN 'Tue'
        WHEN '3' THEN 'Wed'
        WHEN '4' THEN 'Thu'
        WHEN '5' THEN 'Fri'
        WHEN '6' THEN 'Sat'
      END AS dow,
      COUNT(*)              AS n_orders,
      ROUND(AVG(total_usd),2) AS avg_total
    FROM orders
    GROUP BY dow
    ORDER BY MIN(strftime('%w', order_date))
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>strftime('%w', date)</code> returns 0–6 (Sun–Sat). 2) <code>CASE</code> maps to readable labels. 3) Group + count by day of week. 4) <code>ORDER BY MIN(strftime('%w', order_date))</code> keeps the natural week order. 5) Useful for staffing decisions ("Saturdays are 1.5× busier").</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. String functions — cleaning and inspecting text</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">LOWER / UPPER</div><div class="card-body">Case conversion. Useful before equality comparison on user input.</div></div>
<div class="calc-card"><div class="card-title">LENGTH</div><div class="card-body">Character count.</div></div>
<div class="calc-card"><div class="card-title">SUBSTR(s, start, len)</div><div class="card-body">Slice. 1-indexed.</div></div>
<div class="calc-card"><div class="card-title">INSTR(s, sub)</div><div class="card-body">Position of substring or 0 if not found.</div></div>
<div class="calc-card"><div class="card-title">REPLACE(s, a, b)</div><div class="card-body">All occurrences of a → b.</div></div>
<div class="calc-card"><div class="card-title">TRIM / LTRIM / RTRIM</div><div class="card-body">Strip whitespace.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      first_name,
      LOWER(email)                       AS email_lc,
      LENGTH(email)                      AS email_len,
      SUBSTR(email, INSTR(email, '@') + 1) AS domain,
      REPLACE(email, '@', ' [at] ')      AS safe_email
    FROM customers
    LIMIT 8
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>LOWER</code> normalizes the email. 2) <code>LENGTH</code> counts chars. 3) <code>INSTR(email, '@')</code> finds the @ position; <code>SUBSTR(email, that+1)</code> returns everything after it — the domain. 4) <code>REPLACE</code> swaps the @. 5) These five primitives cover 80% of practical text cleaning.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Pattern matching on tweets</h2>
<p class="l-text">Find tweets mentioning Python or featuring URLs.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      id,
      sentiment,
      length,
      SUBSTR(text, 1, 80) || '...' AS preview
    FROM tweets
    WHERE LOWER(text) LIKE '%python%'
       OR has_url = 1
    ORDER BY length DESC
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>LOWER(text) LIKE '%python%'</code> finds case-insensitive matches. 2) <code>has_url = 1</code> uses the boolean column. 3) <code>SUBSTR(text, 1, 80) || '...'</code> truncates for readable output. 4) Sort by length puts the longest tweets first. 5) The pattern <code>LOWER(col) LIKE '%term%'</code> is the canonical case-insensitive substring search in SQL.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. CASE WHEN — inline if/else</h2>
<p class="l-text">CASE turns continuous values into categories or applies if/else logic. Two forms: simple (one comparison column) and searched (arbitrary conditions).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      customer_id,
      monthly_charge,
      CASE
        WHEN monthly_charge &lt; 40  THEN 'low'
        WHEN monthly_charge &lt; 80  THEN 'medium'
        WHEN monthly_charge &lt; 120 THEN 'high'
        ELSE 'premium'
      END AS charge_tier,
      tenure_months,
      CASE
        WHEN tenure_months &lt; 6   THEN 'new'
        WHEN tenure_months &lt; 24  THEN 'mid'
        ELSE 'loyal'
      END AS tenure_segment
    FROM churn
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Two CASE expressions create two derived columns. 2) Each <code>WHEN</code> is checked top-down; first match wins. 3) <code>ELSE</code> catches everything else. 4) Without ELSE, unmatched rows get NULL. 5) These derived columns are perfect for downstream GROUP BY analysis.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Combining CASE with GROUP BY</h2>
<p class="l-text">Aggregating by a CASE-derived bucket gives you cohort analysis in one query.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      CASE
        WHEN tenure_months &lt; 6   THEN '0-5 months'
        WHEN tenure_months &lt; 24  THEN '6-23 months'
        WHEN tenure_months &lt; 48  THEN '24-47 months'
        ELSE '48+ months'
      END AS tenure_bucket,
      COUNT(*)            AS n,
      ROUND(AVG(churned), 3) AS churn_rate,
      ROUND(AVG(monthly_charge), 2) AS avg_charge
    FROM churn
    GROUP BY tenure_bucket
    ORDER BY MIN(tenure_months)
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) CASE buckets tenure into 4 segments. 2) GROUP BY uses that bucket — note: in SQLite you can group by the alias. 3) Per-bucket aggregates: count, churn rate, average charge. 4) <code>ORDER BY MIN(tenure_months)</code> ensures buckets stay in numeric order. 5) Insight: usually the youngest cohort churns the most — the activation problem.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. NULL handling — IFNULL and COALESCE</h2>
<p class="l-text"><code>IFNULL(x, y)</code> returns y if x is NULL, else x. <code>COALESCE(a, b, c, ...)</code> returns the first non-NULL — useful for fallbacks across multiple columns.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      order_id,
      customer_id,
      COALESCE(status, 'unknown') AS status,
      IFNULL(total_usd, 0)         AS total_safe
    FROM orders
    WHERE total_usd IS NULL
       OR status IS NULL
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>COALESCE</code> replaces NULL status with 'unknown'. 2) <code>IFNULL</code> turns missing totals into 0. 3) The WHERE clause grabs only rows where these substitutions actually happen — useful for QA. 4) In production, NULLs in totals are usually a data pipeline bug; in reporting, COALESCE prevents downstream NaN cascades.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. NULLIF — the inverse trick</h2>
<p class="l-text"><code>NULLIF(a, b)</code> returns NULL if a = b, else a. Classic use: avoid divide-by-zero.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      customer_id,
      monthly_charge,
      total_charge,
      ROUND(total_charge / NULLIF(monthly_charge, 0), 1) AS implied_months
    FROM churn
    ORDER BY implied_months DESC
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>NULLIF(monthly_charge, 0)</code> turns 0 into NULL. 2) Dividing by NULL gives NULL — no error, no infinity. 3) Implied tenure (total_charge / monthly_charge) is computed safely. 4) Far cleaner than a CASE WHEN to handle zero divisor.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Real query — sentiment by tweet length bucket</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      CASE
        WHEN length &lt; 50  THEN '&lt;50'
        WHEN length &lt; 100 THEN '50-99'
        WHEN length &lt; 200 THEN '100-199'
        ELSE '200+'
      END AS len_bucket,
      sentiment,
      COUNT(*) AS n
    FROM tweets
    WHERE sentiment IS NOT NULL
    GROUP BY len_bucket, sentiment
    ORDER BY MIN(length), sentiment
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) CASE buckets tweet length. 2) Cross-tab with sentiment. 3) Filter NULL sentiments out. 4) ORDER BY keeps buckets in numeric order. 5) Insight: extreme negative sentiment often clusters in longer texts (rant length correlates with intensity).</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Key takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> SQLite dates are ISO text; use strftime/julianday for math.<br><strong>2.</strong> LIKE + LOWER() = case-insensitive substring search.<br><strong>3.</strong> SUBSTR + INSTR + REPLACE handle most string surgery.<br><strong>4.</strong> CASE WHEN turns continuous values into buckets — the foundation of cohort analysis.<br><strong>5.</strong> COALESCE(x, fallback), IFNULL(x, y) handle missing values; NULLIF avoids divide-by-zero.<br><strong>6.</strong> Combine CASE with GROUP BY to produce one-shot reports.</div></div>
</div>

<div class="calc-graph"><div id="sql-l7-plot-en" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['<50','50-99','100-199','200+'],y:[40,55,38,22],type:'bar',marker:{color:T.accent},name:'positive'},{x:['<50','50-99','100-199','200+'],y:[20,35,42,28],type:'bar',marker:{color:'#e88a4d'},name:'negative'}];
  var layout={barmode:'group',paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid,title:'length bucket'},yaxis:{gridcolor:T.grid,title:'count'},legend:{orientation:'h',y:-0.25,x:0.5,xanchor:'center'},margin:{t:30,r:30,b:80,l:60}};
  var elEN=document.getElementById('sql-l7-plot-en'); if(elEN) Plotly.newPlot(elEN,data,layout,{displayModeBar:false});
},250);</script>`,

tr: `<p class="l-text"><strong>Gerçek veri dağınıktır.</strong> Tarihlerin ayrıştırılması, metinlerin temizlenmesi, NULL'ların her yerde olması, ve iş kuralının sürekli değerleri kategorik kovalara dönüştürmesi gerekir. SQL'in bu görevler için zengin bir skaler fonksiyon kümesi vardır.</p>
<p class="l-text">Bu derste SQLite tarih/saat fonksiyonlarını, metin işleme (LIKE, LOWER, SUBSTR, REPLACE vb.), güçlü <code>CASE WHEN</code> ifadesini ve NULL-güvenli birleştirmeyi ele alıyoruz. Sonunda sorgularınız gerçek dünyanın kirini zarifçe ele alacak.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>SQLite'da tarihleri ISO 8601 metni olarak sakla ve ayrıştır</li><li>strftime ile yıl, ay, gün ve hafta günü çıkar</li><li>julianday ve tarih aritmetiği ile tarih farkı hesapla</li><li>Zaman serisi raporlaması için olayları gün, hafta ve aylara grupla</li><li>Saat dilimlerini işle ve yaygın UTC ile yerel saat hatalarından kaçın</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. SQLite tarih/saat — metin tabanlı ama yetenekli</h2>
<p class="l-text">SQLite tarihleri ISO 8601 metni olarak saklar ('2025-04-15'). <code>strftime</code>, <code>date</code> ve <code>julianday</code> fonksiyonları ayrıştırma, biçimleme ve aritmetik için.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">date(x)</div><div class="card-body">YYYY-MM-DD biçimini döner.</div></div>
<div class="calc-card"><div class="card-title">strftime(fmt, x)</div><div class="card-body">Biçimler: '%Y' yıl, '%m' ay, '%d' gün, '%w' haftanın günü.</div></div>
<div class="calc-card"><div class="card-title">julianday(x)</div><div class="card-body">MÖ 4713'ten itibaren günler. İki julianday'i çıkarınca gün farkı.</div></div>
<div class="calc-card"><div class="card-title">CURRENT_DATE</div><div class="card-body">Bugünün tarihi (metin).</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Kayıttan beri geçen gün — tarih aritmetiği</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      customer_id,
      first_name,
      country,
      signup_date,
      CAST(julianday('2026-05-01') - julianday(signup_date) AS INTEGER) AS days_since_signup
    FROM customers
    ORDER BY days_since_signup DESC
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>julianday('2026-05-01')</code> referans tarihi sayısala çevirir. 2) İki julianday'in farkı kayan nokta gün sayısı. 3) <code>CAST AS INTEGER</code> tam güne keser. 4) Üretimde literal yerine <code>CURRENT_DATE</code>. 5) DESC sıralayınca en uzun süreli müşteriler — sadakat programları için.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Aya göre grupla — strftime çıkarımı</h2>
<p class="l-text">"Ay başına kaç sipariş?"</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      strftime('%Y-%m', order_date) AS month,
      COUNT(*)                       AS n_orders,
      ROUND(SUM(total_usd), 2)       AS revenue,
      ROUND(AVG(total_usd), 2)       AS avg_ticket
    FROM orders
    GROUP BY month
    ORDER BY month
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>strftime('%Y-%m', order_date)</code> tarihi "2025-04"e indirger. 2) GROUP BY siparişleri aylara kovalar. 3) Ay başı üç agregat — sayı, gelir, ortalama. 4) Çıktı temiz aylık kohort tablosu — grafiğe atın, panonuz hazır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Haftanın günü örüntüleri</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      CASE strftime('%w', order_date)
        WHEN '0' THEN 'Paz'
        WHEN '1' THEN 'Pzt'
        WHEN '2' THEN 'Sal'
        WHEN '3' THEN 'Cars'
        WHEN '4' THEN 'Per'
        WHEN '5' THEN 'Cum'
        WHEN '6' THEN 'Cmt'
      END AS dow,
      COUNT(*)              AS n_orders,
      ROUND(AVG(total_usd),2) AS avg_total
    FROM orders
    GROUP BY dow
    ORDER BY MIN(strftime('%w', order_date))
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>strftime('%w', date)</code> 0–6 (Pazar–Cumartesi) döner. 2) <code>CASE</code> okunaklı etiketlere eşler. 3) Haftanın gününe göre grup + sayım. 4) <code>ORDER BY MIN(strftime('%w', order_date))</code> doğal hafta sırasını korur. 5) Personel kararları için kullanışlı ("Cumartesileri 1.5x yoğun").</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Metin fonksiyonları — temizlik ve inceleme</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">LOWER / UPPER</div><div class="card-body">Büyük/küçük çevrimi. Kullanıcı girişinde eşitlik öncesi.</div></div>
<div class="calc-card"><div class="card-title">LENGTH</div><div class="card-body">Karakter sayısı.</div></div>
<div class="calc-card"><div class="card-title">SUBSTR(s, start, len)</div><div class="card-body">Dilim. 1'den başlar.</div></div>
<div class="calc-card"><div class="card-title">INSTR(s, sub)</div><div class="card-body">Alt metnin pozisyonu, yoksa 0.</div></div>
<div class="calc-card"><div class="card-title">REPLACE(s, a, b)</div><div class="card-body">Tüm a'lar → b.</div></div>
<div class="calc-card"><div class="card-title">TRIM / LTRIM / RTRIM</div><div class="card-body">Boşluk temizler.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      first_name,
      LOWER(email)                       AS email_lc,
      LENGTH(email)                      AS email_len,
      SUBSTR(email, INSTR(email, '@') + 1) AS domain,
      REPLACE(email, '@', ' [at] ')      AS safe_email
    FROM customers
    LIMIT 8
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>LOWER</code> e-postayı normalleştirir. 2) <code>LENGTH</code> karakter sayar. 3) <code>INSTR(email, '@')</code> @ konumunu bulur; <code>SUBSTR(email, o+1)</code> sonrasını verir — alan adı. 4) <code>REPLACE</code> @ yerini değiştirir. 5) Bu beş fonksiyon pratik metin temizliğinin %80'ini kapsar.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Tweetlerde desen eşleme</h2>
<p class="l-text">Python geçen veya URL içeren tweetleri bul.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      id,
      sentiment,
      length,
      SUBSTR(text, 1, 80) || '...' AS preview
    FROM tweets
    WHERE LOWER(text) LIKE '%python%'
       OR has_url = 1
    ORDER BY length DESC
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>LOWER(text) LIKE '%python%'</code> büyük/küçük duyarsız eşleşme. 2) <code>has_url = 1</code> bool sütunu kullanır. 3) <code>SUBSTR(text, 1, 80) || '...'</code> önizleme için kısaltır. 4) Uzunluğa göre sıralama en uzunları öne alır. 5) <code>LOWER(col) LIKE '%kelime%'</code> SQL'de kanonik büyük/küçük duyarsız alt metin aramasıdır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. CASE WHEN — satır içi if/else</h2>
<p class="l-text">CASE sürekli değerleri kategoriye dönüştürür veya if/else mantığı uygular. İki biçim: basit (tek karşılaştırma sütunu) ve aranan (keyfi koşullar).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      customer_id,
      monthly_charge,
      CASE
        WHEN monthly_charge &lt; 40  THEN 'low'
        WHEN monthly_charge &lt; 80  THEN 'medium'
        WHEN monthly_charge &lt; 120 THEN 'high'
        ELSE 'premium'
      END AS charge_tier,
      tenure_months,
      CASE
        WHEN tenure_months &lt; 6   THEN 'new'
        WHEN tenure_months &lt; 24  THEN 'mid'
        ELSE 'loyal'
      END AS tenure_segment
    FROM churn
    LIMIT 15
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) İki CASE iki türetilmiş sütun üretir. 2) Her <code>WHEN</code> yukarıdan aşağı kontrol; ilk eşleşen kazanır. 3) <code>ELSE</code> kalanları yakalar. 4) ELSE'siz eşleşmeyen NULL alır. 5) Bu türetilmiş sütunlar sonraki GROUP BY analizleri için ideal.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. CASE'i GROUP BY ile birleştirmek</h2>
<p class="l-text">CASE ile türetilmiş kovaya göre toplama tek sorguda kohort analizi verir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      CASE
        WHEN tenure_months &lt; 6   THEN '0-5 ay'
        WHEN tenure_months &lt; 24  THEN '6-23 ay'
        WHEN tenure_months &lt; 48  THEN '24-47 ay'
        ELSE '48+ ay'
      END AS tenure_bucket,
      COUNT(*)            AS n,
      ROUND(AVG(churned), 3) AS churn_rate,
      ROUND(AVG(monthly_charge), 2) AS avg_charge
    FROM churn
    GROUP BY tenure_bucket
    ORDER BY MIN(tenure_months)
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) CASE süreyi 4 segmente kovalar. 2) GROUP BY o kovayı kullanır — SQLite'ta alias üzerinden gruplama mümkün. 3) Kova başı agregatlar: sayı, kayıp oranı, ortalama ücret. 4) <code>ORDER BY MIN(tenure_months)</code> kovaları sayısal sırada tutar. 5) İçgörü: genellikle en genç kohort en çok kaybeder — etkinleştirme problemi.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. NULL ele alma — IFNULL ve COALESCE</h2>
<p class="l-text"><code>IFNULL(x, y)</code> x NULL ise y, değilse x. <code>COALESCE(a, b, c, ...)</code> ilk NULL olmayanı döner — birden çok sütun üzerinde geri çekilme için.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      order_id,
      customer_id,
      COALESCE(status, 'unknown') AS status,
      IFNULL(total_usd, 0)         AS total_safe
    FROM orders
    WHERE total_usd IS NULL
       OR status IS NULL
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>COALESCE</code> NULL durumu 'unknown' yapar. 2) <code>IFNULL</code> eksik totalları 0 yapar. 3) WHERE bu ikamenin gerçekten olduğu satırları getirir — QA için. 4) Üretimde total NULL'u veri hattı hatasıdır; raporlamada COALESCE NaN zincirini önler.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. NULLIF — tersi hile</h2>
<p class="l-text"><code>NULLIF(a, b)</code> a = b ise NULL, değilse a. Klasik kullanım: sıfıra bölmeden kaçınmak.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      customer_id,
      monthly_charge,
      total_charge,
      ROUND(total_charge / NULLIF(monthly_charge, 0), 1) AS implied_months
    FROM churn
    ORDER BY implied_months DESC
    LIMIT 10
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>NULLIF(monthly_charge, 0)</code> 0'ı NULL yapar. 2) NULL'a bölme NULL döner — hata yok, sonsuz yok. 3) Üstü kapalı süre (total_charge / monthly_charge) güvenle hesaplanır. 4) Sıfır böleni ele almak için CASE WHEN'den çok daha temiz.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Gerçek sorgu — uzunluk dilimine göre tweet duygu</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>result = <span class="fn">run_sql</span>(<span class="str">"""
    SELECT
      CASE
        WHEN length &lt; 50  THEN '&lt;50'
        WHEN length &lt; 100 THEN '50-99'
        WHEN length &lt; 200 THEN '100-199'
        ELSE '200+'
      END AS len_bucket,
      sentiment,
      COUNT(*) AS n
    FROM tweets
    WHERE sentiment IS NOT NULL
    GROUP BY len_bucket, sentiment
    ORDER BY MIN(length), sentiment
"""</span>)
<span class="fn">print</span>(result)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) CASE tweet uzunluğunu kovalar. 2) Duygu ile çapraz tablo. 3) NULL duyguları çıkarır. 4) ORDER BY kovaları sayısal sırada tutar. 5) İçgörü: aşırı negatif duygu sıkça uzun metinlerde toplanır (söylenme uzunluğu yoğunluğa bağlıdır).</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Önemli çıkarımlar</h2>
<div class="think-box"><div class="think-label">ÖNEMLİ NOKTALAR</div><div class="think-body"><strong>1.</strong> SQLite tarihleri ISO metnidir; matematik için strftime/julianday.<br><strong>2.</strong> LIKE + LOWER() = büyük/küçük duyarsız alt metin araması.<br><strong>3.</strong> SUBSTR + INSTR + REPLACE çoğu metin ameliyatını halleder.<br><strong>4.</strong> CASE WHEN sürekli değerleri kovalara çevirir — kohort analizinin temeli.<br><strong>5.</strong> COALESCE(x, fallback), IFNULL(x, y) eksik değerleri ele alır; NULLIF sıfıra bölmeyi engeller.<br><strong>6.</strong> CASE'i GROUP BY ile birleştir, tek seferde rapor üret.</div></div>
</div>

<div class="calc-graph"><div id="sql-l7-plot-tr" style="width:100%;height:380px"></div></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=(window.getThemeColors&&window.getThemeColors())||{accent:'#4de87a',text:'#e8e8e8',grid:'rgba(255,255,255,.1)',paper:'rgba(0,0,0,0)'};
  var data=[{x:['<50','50-99','100-199','200+'],y:[40,55,38,22],type:'bar',marker:{color:T.accent},name:'pozitif'},{x:['<50','50-99','100-199','200+'],y:[20,35,42,28],type:'bar',marker:{color:'#e88a4d'},name:'negatif'}];
  var layout={barmode:'group',paper_bgcolor:T.paper,plot_bgcolor:T.paper,font:{color:T.text},xaxis:{gridcolor:T.grid,title:'uzunluk dilimi'},yaxis:{gridcolor:T.grid,title:'sayım'},legend:{orientation:'h',y:-0.25,x:0.5,xanchor:'center'},margin:{t:30,r:30,b:80,l:60}};
  var elTR=document.getElementById('sql-l7-plot-tr'); if(elTR) Plotly.newPlot(elTR,data,layout,{displayModeBar:false});
},250);</script>
`
};
