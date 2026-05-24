window.RECSYS_L1 = {

en: `<p class="l-text"><strong>Netflix attributes 80% of watch hours to its recommender. Spotify's Discover Weekly produces 2.3 billion plays a quarter. Amazon's "customers also bought" was reportedly the source of 35% of revenue back in 2013.</strong> Recommendation is the silent backbone of the modern web — every product feed, news stream, autoplay queue, and dating app is one big ranker.</p>
<p class="l-text">In this opening lesson we set the stage: <em>what is a recommender</em>, the two classical families (collaborative vs content-based), why <em>popularity</em> is a stronger baseline than people expect, and the difference between <em>rating prediction</em> (RMSE) and <em>top-K ranking</em> (NDCG, HitRate, MAP, MRR). You will build a popularity baseline on the orders dataset and measure HitRate@10 on held-out purchases.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish collaborative filtering from content-based filtering by the signal they use</li>
<li>Explain why popularity is hard to beat and is the right baseline for any new system</li>
<li>Pick the right metric: RMSE for ratings, HitRate / NDCG / MAP / MRR for top-K ranking</li>
<li>Build a leave-last-out evaluation split on real purchase logs</li>
<li>Implement a popularity recommender on df_orders and report HitRate@10</li>
<li>Read a recommendation paper without getting lost in notation</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. What Is a Recommender?</h2>
<p class="l-text">A recommender takes a user (or context) and returns a short ordered list of items the user is most likely to engage with. The signal can be explicit (1–5 star ratings) or implicit (clicks, purchases, watch time). Most modern systems use implicit signals because users rate almost nothing but click on almost everything.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Input</div><div class="card-body">User id, optionally context (time of day, device, recent history).</div></div>
<div class="calc-card"><div class="card-title">Catalog</div><div class="card-body">Item id pool — products, songs, videos, jobs, partners.</div></div>
<div class="calc-card"><div class="card-title">Output</div><div class="card-body">Ordered top-K list. K is small (10–50) but candidates may be millions.</div></div>
<div class="calc-card"><div class="card-title">Goal</div><div class="card-body">Maximize an engagement metric — clicks, watch time, revenue, retention.</div></div>
</div>
<div class="calc-highlight">A recommender is a search engine where the query is the user themselves.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Collaborative vs Content-Based</h2>
<p class="l-text">The two classical families look at the same problem from opposite angles. Collaborative filtering says "people like you bought X, so you might too." Content-based says "you liked items with property P, here are more items with property P." Modern hybrids combine both.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Collaborative (CF)</div><div class="card-body">Uses the user-item interaction matrix. No item features needed. Suffers from the cold-start problem for new items and new users.</div></div>
<div class="calc-card"><div class="card-title">Content-based</div><div class="card-body">Uses item features (text, tags, image embeddings). Handles new items well but cannot capture taste signals not present in features.</div></div>
<div class="calc-card"><div class="card-title">Hybrid</div><div class="card-body">Combine both: CF for popular items, content for the long tail and cold start. This is what real systems ship.</div></div>
<div class="calc-card"><div class="card-title">Knowledge / rules</div><div class="card-body">Hand-crafted constraints ("show diverse genres", "no duplicates from same brand"). Always present in production.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Popularity: The Baseline You Must Beat</h2>
<p class="l-text">Before any fancy model, compute the most popular items globally and recommend them to everyone. This trivial baseline catches a surprising fraction of real engagement because user preferences are highly skewed — the head of the long tail dominates. If your shiny deep model cannot beat <em>top-10 most purchased</em>, something is wrong.</p>
<div class="calc-highlight">Rule of thumb: a popularity baseline often achieves 5–10% HitRate@10 on retail data. Beating it requires personalization that adds real signal, not noise.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Rating Prediction vs Top-K Ranking</h2>
<p class="l-text">Older systems (Netflix Prize era) predicted star ratings and were judged by RMSE. Modern systems return ranked lists and are judged by ranking quality at the top of the list. The difference matters: a model can have great RMSE on average yet rank the user's favorite item below ten mediocre ones.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">RMSE (rating)</div><div class="card-body">Root mean squared error between predicted and actual ratings. Sensitive to outliers, blind to ranking.</div></div>
<div class="calc-card"><div class="card-title">HitRate@K</div><div class="card-body">Fraction of users for whom the held-out item appears in top-K. Simple, intuitive, the workhorse.</div></div>
<div class="calc-card"><div class="card-title">NDCG@K</div><div class="card-body">Normalized Discounted Cumulative Gain — rewards relevant items higher in the list.</div></div>
<div class="calc-card"><div class="card-title">MAP / MRR</div><div class="card-body">Mean Average Precision and Mean Reciprocal Rank — both reward early hits.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The Math of NDCG</h2>
<p class="l-text">NDCG is the metric you will see in every recsys paper. The numerator is the discounted gain of the ranking the model produced; the denominator normalizes by the gain of the ideal ranking, so NDCG is in [0, 1].</p>
<div class="katex-block">$$\\text{DCG@K} = \\sum_{i=1}^{K} \\frac{2^{rel_i} - 1}{\\log_2(i + 1)}, \\quad \\text{NDCG@K} = \\frac{\\text{DCG@K}}{\\text{IDCG@K}}$$</div>
<p class="l-text">For binary relevance (item bought or not), \\(2^{rel_i} - 1\\) is just 0 or 1, and the metric becomes a position-discounted hit rate. The \\(\\log_2(i+1)\\) discount is steep at the top of the list — being 3rd is much better than being 10th.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Building the Evaluation Split</h2>
<p class="l-text">The standard recsys evaluation is <em>leave-last-out</em>: for each user, hold out the most recent purchase and try to predict it from earlier purchases. This respects time and avoids leaking the future into the training set.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># df_orders has: customer_id, product_id, order_date, quantity, total_price</span>
df = df_orders.<span class="fn">sort_values</span>([<span class="str">"customer_id"</span>, <span class="str">"order_date"</span>])
df[<span class="str">"rank"</span>] = df.<span class="fn">groupby</span>(<span class="str">"customer_id"</span>).<span class="fn">cumcount</span>(ascending=<span class="kw">False</span>)
test = df[df[<span class="str">"rank"</span>] == <span class="num">0</span>]                <span class="cm"># last purchase per user</span>
train = df[df[<span class="str">"rank"</span>] &gt; <span class="num">0</span>]                <span class="cm"># everything earlier</span>
<span class="fn">print</span>(<span class="str">"train rows:"</span>, <span class="fn">len</span>(train), <span class="str">"test rows:"</span>, <span class="fn">len</span>(test))
<span class="fn">print</span>(<span class="str">"unique users in test:"</span>, test[<span class="str">"customer_id"</span>].<span class="fn">nunique</span>())</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sort orders chronologically per user. 2) Rank within user, with 0 being the most recent. 3) Carve off rank-0 rows as the test set and the rest as train. 4) Print sizes — typically each user has multiple orders so most appear in both splits.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Popularity Recommender + HitRate@10</h2>
<p class="l-text">Now we count training-set purchases per item, recommend the top 10 to every user, and check whether their held-out item appears in that list.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

df = df_orders.<span class="fn">sort_values</span>([<span class="str">"customer_id"</span>, <span class="str">"order_date"</span>])
df[<span class="str">"rank"</span>] = df.<span class="fn">groupby</span>(<span class="str">"customer_id"</span>).<span class="fn">cumcount</span>(ascending=<span class="kw">False</span>)
train = df[df[<span class="str">"rank"</span>] &gt; <span class="num">0</span>]
test = df[df[<span class="str">"rank"</span>] == <span class="num">0</span>]

<span class="cm"># Top-10 most popular items in training data</span>
pop = train[<span class="str">"product_id"</span>].<span class="fn">value_counts</span>().<span class="fn">head</span>(<span class="num">10</span>).index.<span class="fn">tolist</span>()
<span class="fn">print</span>(<span class="str">"Top-10 popular items:"</span>, pop)

<span class="cm"># HitRate@10: did each user's held-out item land in the top-10 list?</span>
hits = test[<span class="str">"product_id"</span>].<span class="fn">isin</span>(pop).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"HitRate@10 (popularity): {hits:.3f}"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Build the leave-last-out split. 2) Count product purchases in train and take the top 10 ids. 3) For each test row, check whether its product_id is in that list. 4) The mean of the boolean vector is HitRate@10. Expect roughly 0.05–0.15 — anything later in the course must beat this.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Reading a Recsys Paper</h2>
<p class="l-text">When you open a paper, look for these five things in order: dataset, evaluation protocol, baselines, headline metric, and ablation. If a paper claims a 0.4% NDCG bump but evaluates on a non-standard split with only popularity as a baseline, treat the claim as decorative. The same caution applies to your own experiments.</p>
<div class="think-box"><div class="think-label">INTUITION</div><div class="think-body">The most useful recsys mental model is a funnel: <strong>retrieval</strong> narrows millions of items to ~1000 candidates with a cheap model (matrix factorization, two-tower); <strong>ranking</strong> reorders those with an expensive model (deep network, gradient boosting); <strong>re-ranking</strong> applies business rules (diversity, freshness, no duplicates). The lessons in this track will visit each layer.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Popularity Curve Visualization</h2>
<p class="l-text">The long-tail shape is universal. Plotting purchase counts per product reveals why popularity already does decently — most demand concentrates on a handful of items.</p>
<div id="recsys1-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> A recommender returns a top-K list — it is search where the query is the user.<br><strong>2.</strong> Collaborative uses interactions; content-based uses item features; production hybrids both.<br><strong>3.</strong> Popularity is the baseline you must beat — surprisingly hard.<br><strong>4.</strong> Pick metrics by use case: RMSE for ratings, HitRate / NDCG for top-K ranking.<br><strong>5.</strong> Use leave-last-out to respect time and avoid leakage.<br><strong>6.</strong> Treat the funnel — retrieval → ranking → re-ranking — as the master pattern.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var n = 39;
  var counts = [];
  for (var i=0; i&lt;n; i++) counts.push(Math.round(400 * Math.pow(0.92, i) + Math.random()*8));
  counts.sort(function(a,b){return b-a;});
  var x = counts.map(function(_,i){return i+1;});
  var data = [{x:x, y:counts, type:'bar', marker:{color:T.accent}, name:'purchases'}];
  var layout = {title:'Long-tail of product popularity', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{title:'Product rank by popularity', gridcolor:T.grid}, yaxis:{title:'Purchase count', gridcolor:T.grid}, margin:{t:50,r:30,b:50,l:60}};
  var layoutTr = Object.assign({}, layout, {title:'Ürün popülerliğinin uzun kuyruğu', xaxis:{title:'Popülerliğe göre ürün sırası', gridcolor:T.grid}, yaxis:{title:'Satın alma sayısı', gridcolor:T.grid}});
  var elEn = document.getElementById('recsys1-plot-en');
  if(elEn && window.Plotly) Plotly.newPlot('recsys1-plot-en', data, layout, {displayModeBar:false});
  var elTr = document.getElementById('recsys1-plot-tr');
  if(elTr && window.Plotly) Plotly.newPlot('recsys1-plot-tr', data, layoutTr, {displayModeBar:false});
},250);
</script>`,

tr: `<p class="l-text"><strong>Netflix izleme saatlerinin %80'ini öneri sistemine bağlıyor. Spotify'ın Discover Weekly listesi çeyrekte 2,3 milyar dinleme üretiyor. Amazon'un "müşteriler bunları da aldı" özelliği 2013'te gelirin %35'ini sağlamıştı.</strong> Öneri, modern web'in sessiz omurgasıdır — her ürün akışı, haber listesi, otomatik oynatma kuyruğu ve flört uygulaması büyük bir sıralayıcıdır.</p>
<p class="l-text">Bu açılış dersinde sahneyi kuruyoruz: <em>öneri sistemi nedir</em>, iki klasik aile (işbirlikçi vs içerik tabanlı), <em>popülerlik</em>'in neden insanların düşündüğünden çok daha güçlü bir taban olduğu ve <em>puan tahmini</em> (RMSE) ile <em>top-K sıralama</em> (NDCG, HitRate, MAP, MRR) arasındaki fark. Sipariş veri seti üzerinde bir popülerlik tabanı kuracak ve tutulan satın alımlarda HitRate@10 ölçeceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>İşbirlikçi filtreleme ile içerik tabanlı filtrelemeyi kullandıkları sinyale göre ayırt et</li>
<li>Popülerliği yenmenin neden zor olduğunu ve her yeni sistem için doğru taban olduğunu açıkla</li>
<li>Doğru metriği seç: puanlar için RMSE, top-K sıralama için HitRate / NDCG / MAP / MRR</li>
<li>Gerçek satın alma kayıtları üzerinde leave-last-out değerlendirme bölmesi kur</li>
<li>df_orders üzerinde bir popülerlik öneri sistemi yap ve HitRate@10 raporla</li>
<li>Bir öneri makalesini gösterimde kaybolmadan oku</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Öneri Sistemi Nedir?</h2>
<p class="l-text">Bir öneri sistemi, bir kullanıcıyı (veya bağlamı) alır ve kullanıcının en çok ilgileneceği maddelerin kısa ve sıralı bir listesini döndürür. Sinyal açık (1-5 yıldız puan) veya örtük (tıklama, satın alma, izleme süresi) olabilir. Modern sistemlerin çoğu örtük sinyal kullanır çünkü kullanıcılar hemen hiçbir şeyi puanlamaz ama hemen her şeye tıklar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Girdi</div><div class="card-body">Kullanıcı kimliği, isteğe bağlı bağlam (günün saati, cihaz, son geçmiş).</div></div>
<div class="calc-card"><div class="card-title">Katalog</div><div class="card-body">Madde kimlik havuzu — ürünler, şarkılar, videolar, işler, partnerler.</div></div>
<div class="calc-card"><div class="card-title">Çıktı</div><div class="card-body">Sıralı top-K listesi. K küçük (10-50) ama adaylar milyonlarca olabilir.</div></div>
<div class="calc-card"><div class="card-title">Hedef</div><div class="card-body">Bir etkileşim metriğini en üst seviyeye çıkarmak — tıklamalar, izleme süresi, gelir, tutma.</div></div>
</div>
<div class="calc-highlight">Bir öneri sistemi, sorgusu kullanıcının kendisi olan bir arama motorudur.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. İşbirlikçi vs İçerik Tabanlı</h2>
<p class="l-text">İki klasik aile aynı probleme zıt açılardan bakar. İşbirlikçi filtreleme der ki "senin gibi insanlar X aldı, sen de alabilirsin." İçerik tabanlı der ki "P özelliğine sahip maddeleri sevdin, işte P özelliğine sahip daha fazla madde." Modern hibritler her ikisini birleştirir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">İşbirlikçi (CF)</div><div class="card-body">Kullanıcı-madde etkileşim matrisini kullanır. Madde özelliği gerekmez. Yeni maddeler ve yeni kullanıcılar için soğuk başlangıç sorunu yaşar.</div></div>
<div class="calc-card"><div class="card-title">İçerik tabanlı</div><div class="card-body">Madde özelliklerini (metin, etiket, görsel gömme) kullanır. Yeni maddeleri iyi karşılar ama özelliklerde olmayan zevk sinyallerini yakalayamaz.</div></div>
<div class="calc-card"><div class="card-title">Hibrit</div><div class="card-body">İkisini birleştir: popüler maddeler için CF, uzun kuyruk ve soğuk başlangıç için içerik. Gerçek sistemlerin sahaya sürdüğü şey budur.</div></div>
<div class="calc-card"><div class="card-title">Bilgi / kurallar</div><div class="card-body">El yapımı kısıtlamalar ("çeşitli türleri göster", "aynı markadan tekrar yok"). Üretimde her zaman vardır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Popülerlik: Yenmen Gereken Taban</h2>
<p class="l-text">Herhangi bir gösterişli modelden önce, küresel olarak en popüler maddeleri hesapla ve herkese öner. Bu önemsiz taban, gerçek etkileşimin şaşırtıcı bir kısmını yakalar çünkü kullanıcı tercihleri çok çarpıktır — uzun kuyruğun başı talebe hakimdir. Eğer parlak derin modelin <em>en çok satın alınan top-10</em>'u yenemiyorsa bir şeyler yanlıştır.</p>
<div class="calc-highlight">Pratik kural: bir popülerlik tabanı, perakende verilerde sıklıkla %5-10 HitRate@10'a ulaşır. Bunu yenmek, gürültü değil gerçek sinyal ekleyen kişiselleştirme gerektirir.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Puan Tahmini vs Top-K Sıralama</h2>
<p class="l-text">Eski sistemler (Netflix Prize dönemi) yıldız puanlarını tahmin ederdi ve RMSE ile değerlendirilirdi. Modern sistemler sıralı listeler döndürür ve listenin tepesindeki sıralama kalitesiyle değerlendirilir. Fark önemli: bir model ortalamada harika bir RMSE'ye sahip olabilir ama kullanıcının favori maddesini on vasat maddenin altına sıralayabilir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">RMSE (puan)</div><div class="card-body">Tahmin edilen ve gerçek puanlar arasındaki kök ortalama kare hata. Aykırı değerlere duyarlı, sıralamaya kör.</div></div>
<div class="calc-card"><div class="card-title">HitRate@K</div><div class="card-body">Tutulan maddesi top-K'da görünen kullanıcıların oranı. Basit, sezgisel, beygir.</div></div>
<div class="calc-card"><div class="card-title">NDCG@K</div><div class="card-body">Normalized Discounted Cumulative Gain — listenin üstündeki ilgili maddeleri ödüllendirir.</div></div>
<div class="calc-card"><div class="card-title">MAP / MRR</div><div class="card-body">Mean Average Precision ve Mean Reciprocal Rank — ikisi de erken isabetleri ödüllendirir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. NDCG'nin Matematiği</h2>
<p class="l-text">NDCG her recsys makalesinde göreceğin metriktir. Pay, modelin ürettiği sıralamanın indirimli kazancıdır; payda ise ideal sıralamanın kazancıyla normalize eder, böylece NDCG [0, 1] aralığındadır.</p>
<div class="katex-block">$$\\text{DCG@K} = \\sum_{i=1}^{K} \\frac{2^{rel_i} - 1}{\\log_2(i + 1)}, \\quad \\text{NDCG@K} = \\frac{\\text{DCG@K}}{\\text{IDCG@K}}$$</div>
<p class="l-text">İkili ilgi için (madde alındı veya alınmadı), \\(2^{rel_i} - 1\\) sadece 0 veya 1'dir ve metrik konum-indirimli bir isabet oranına dönüşür. \\(\\log_2(i+1)\\) indirimi listenin üstünde diktir — 3. olmak 10. olmaktan çok daha iyidir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Değerlendirme Bölmesini Kurmak</h2>
<p class="l-text">Standart recsys değerlendirmesi <em>leave-last-out</em>'tür: her kullanıcı için en son satın alımı tut ve önceki satın alımlardan tahmin etmeye çalış. Bu, zamana saygı duyar ve geleceğin eğitim setine sızmasını engeller.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># df_orders sütunları: customer_id, product_id, order_date, quantity, total_price</span>
df = df_orders.<span class="fn">sort_values</span>([<span class="str">"customer_id"</span>, <span class="str">"order_date"</span>])
df[<span class="str">"rank"</span>] = df.<span class="fn">groupby</span>(<span class="str">"customer_id"</span>).<span class="fn">cumcount</span>(ascending=<span class="kw">False</span>)
test = df[df[<span class="str">"rank"</span>] == <span class="num">0</span>]                <span class="cm"># kullanıcı başına son satın alım</span>
train = df[df[<span class="str">"rank"</span>] &gt; <span class="num">0</span>]                <span class="cm"># önceki her şey</span>
<span class="fn">print</span>(<span class="str">"train rows:"</span>, <span class="fn">len</span>(train), <span class="str">"test rows:"</span>, <span class="fn">len</span>(test))
<span class="fn">print</span>(<span class="str">"unique users in test:"</span>, test[<span class="str">"customer_id"</span>].<span class="fn">nunique</span>())</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) Siparişleri kullanıcı başına kronolojik sırala. 2) Kullanıcı içinde sırala, 0 en yenisi olacak şekilde. 3) Rank-0 satırlarını test seti olarak ayır, geri kalanı train. 4) Boyutları yazdır — tipik olarak her kullanıcının birden fazla siparişi olduğu için çoğu hem train'de hem test'te görünür.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Popülerlik Öneri Sistemi + HitRate@10</h2>
<p class="l-text">Şimdi madde başına eğitim seti satın alımlarını sayıyoruz, top 10'u herkese öneriyoruz ve tutulan maddesinin bu listede olup olmadığını kontrol ediyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

df = df_orders.<span class="fn">sort_values</span>([<span class="str">"customer_id"</span>, <span class="str">"order_date"</span>])
df[<span class="str">"rank"</span>] = df.<span class="fn">groupby</span>(<span class="str">"customer_id"</span>).<span class="fn">cumcount</span>(ascending=<span class="kw">False</span>)
train = df[df[<span class="str">"rank"</span>] &gt; <span class="num">0</span>]
test = df[df[<span class="str">"rank"</span>] == <span class="num">0</span>]

<span class="cm"># Eğitim verisindeki en popüler 10 madde</span>
pop = train[<span class="str">"product_id"</span>].<span class="fn">value_counts</span>().<span class="fn">head</span>(<span class="num">10</span>).index.<span class="fn">tolist</span>()
<span class="fn">print</span>(<span class="str">"Top-10 popüler madde:"</span>, pop)

<span class="cm"># HitRate@10: her kullanıcının tutulan maddesi top-10 listesinde mi?</span>
hits = test[<span class="str">"product_id"</span>].<span class="fn">isin</span>(pop).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"HitRate@10 (popülerlik): {hits:.3f}"</span>)</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) Leave-last-out bölmesini kur. 2) Train'deki ürün satın alımlarını say ve en popüler 10 kimliği al. 3) Her test satırı için product_id'sinin bu listede olup olmadığını kontrol et. 4) Boolean vektörünün ortalaması HitRate@10'dur. Yaklaşık 0,05-0,15 bekle — kursun ilerisindeki her şey bunu yenmelidir.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Bir Recsys Makalesi Okumak</h2>
<p class="l-text">Bir makale açtığında şu beş şeyi bu sırayla ara: veri seti, değerlendirme protokolü, tabanlar, ana metrik ve ablation. Eğer bir makale %0,4 NDCG kazanımı iddia ediyor ama yalnızca popülerlik tabanına karşı standart olmayan bir bölmede değerlendirme yapıyorsa iddiayı dekoratif olarak değerlendir. Aynı dikkat kendi deneylerin için de geçerlidir.</p>
<div class="think-box"><div class="think-label">SEZGİ</div><div class="think-body">En kullanışlı recsys zihinsel modeli bir hunidir: <strong>retrieval (geri çağırma)</strong> milyonlarca maddeyi ucuz bir modelle (matris çarpanlama, two-tower) ~1000 adaya daraltır; <strong>ranking (sıralama)</strong> bunları pahalı bir modelle (derin ağ, gradient boosting) yeniden sıralar; <strong>re-ranking</strong> iş kurallarını uygular (çeşitlilik, tazelik, tekrar yok). Bu pisteki dersler her katmanı ziyaret edecek.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Popülerlik Eğrisi Görselleştirmesi</h2>
<p class="l-text">Uzun kuyruk şekli evrenseldir. Ürün başına satın alma sayılarını çizmek, popülerliğin neden zaten iyi iş çıkardığını gösterir — talebin çoğu birkaç madde üzerinde yoğunlaşır.</p>
<div id="recsys1-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Ana Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANA ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Bir öneri sistemi top-K listesi döndürür — sorgusu kullanıcı olan aramadır.<br><strong>2.</strong> İşbirlikçi etkileşimleri kullanır; içerik tabanlı madde özelliklerini kullanır; üretim hibritleri ikisini de.<br><strong>3.</strong> Popülerlik yenmen gereken tabandır — şaşırtıcı derecede zor.<br><strong>4.</strong> Kullanım durumuna göre metrik seç: puanlar için RMSE, top-K sıralama için HitRate / NDCG.<br><strong>5.</strong> Zamana saygı duymak ve sızıntıyı önlemek için leave-last-out kullan.<br><strong>6.</strong> Huniyi — retrieval → ranking → re-ranking — ana desen olarak ele al.</div></div>
</div>

<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>`
};
