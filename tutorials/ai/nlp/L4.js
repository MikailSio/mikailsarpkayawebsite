/* nlp-new-L4.js — NLP Course Lesson 4: Duygu Analizi (Sentiment Analysis) — TR + EN */
var NLP_L4 = {

tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=[];g.__nlpChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Duygu analizi nedir, gerçek dünyada ne işe yarar, hangi zorlukları vardır. <a href="/tutorials/ai/nlp/text-preprocessing">Ders 1-3</a>\'te öğrendiğin tüm parçaları (ön işleme, vektörleştirme, sınıflandırma) bir araya getirip Türkçe yorum verisi üzerinde uçtan uca bir duygu analizi sistemi kuracaksın. Olumlu/olumsuz/nötr sınıflandırmadan, yön (aspect) bazlı analize, sözlük tabanlı yöntemlerden modern derin öğrenme yaklaşımlarına kadar geniş bir manzara göreceksin.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Türkçe yorum verisi üzerinde olumlu/olumsuz/nötr sınıflandırma yapmayı</li>'
+ '<li>Sözlük tabanlı (lexicon) ve makine öğrenmesi tabanlı yaklaşımları karşılaştırmayı</li>'
+ '<li>Aspect-based sentiment analysis ile "kargo iyi, ürün kötü" gibi yön başına duygu çıkarmayı</li>'
+ '<li>Türkçe-özel zorlukları (negation, ironi, emoji, sözlük yetersizliği) yönetmeyi</li>'
+ '<li>HuggingFace BERTurk ile fine-tuned modern bir duygu sınıflandırıcısı çalıştırmayı</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Duygu Analizi Nedir?</h2>'

+ '<p class="l-text"><strong>Duygu analizi</strong> (sentiment analysis veya opinion mining), bir metnin taşıdığı duygu kutbunu otomatik olarak tespit etme görevidir. En basit haliyle metni <em>olumlu, olumsuz, nötr</em> olarak sınıflandırır. Daha gelişkin sürümleri duygunun şiddetini, hangi konuya yönelik olduğunu, hatta hangi duygu (kızgınlık, sevinç, üzüntü) olduğunu çıkarır.</p>'

+ '<p class="l-text">Türkiye\'de en yaygın kullanım alanı e-ticaret platformlarındaki <strong>ürün yorumları</strong>: Trendyol, Hepsiburada, Çiçeksepeti, Amazon TR. Müşteri ne hissetmiş, hangi ürünü beğenmiş, hangisinden şikayetçi — milyonlarca yorumu insan eliyle okumak imkânsız. Otomatik duygu analizi bu işin omurgasıdır.</p>'

+ '<div class="calc-example"><div class="example-label">GERÇEK DÜNYA ÖRNEĞİ — TRENDYOL YORUM</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ '<code>"Kargo çok hızlıydı, ürün de tam beklediğim gibi. Tavsiye ederim 👍"</code> &nbsp;→&nbsp; <strong>olumlu</strong>'
+ '<br><code>"Bedeni tamamen yanlış geldi, fotoğraftaki gibi değil hiç."</code> &nbsp;→&nbsp; <strong>olumsuz</strong>'
+ '<br><code>"Ürün geldi, paketi sağlamdı. Henüz denemedim."</code> &nbsp;→&nbsp; <strong>nötr</strong>'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Bu derste odak Türkçe sentiment\'idir, ama ilkeler her dile aynıdır. Asıl zorluklar dilin morfolojisinden, yazım çeşitliliğinden ve bağlam bağımlı duygu sinyallerinden gelir.</p>'

+ '<h2 class="l-title">2. Kullanım Alanları</h2>'

+ '<ul class="l-list">'
+ '<li><strong>E-ticaret yorum analizi:</strong> Hangi ürün hangi özelliği için sevilir/eleştirilir? Pazarlama ve ürün geliştirme için hayati.</li>'
+ '<li><strong>Marka takibi:</strong> Sosyal medyada bir marka hakkında yapılan paylaşımlar genel olarak olumlu mu, kriz var mı?</li>'
+ '<li><strong>Müşteri hizmetleri:</strong> Gelen mesajların tonu — kızgın müşteri öncelikli işleme alınmalı.</li>'
+ '<li><strong>Finans:</strong> Haber metinlerinden hisse senedi duygusu çıkarma; algoritmik trading sinyali.</li>'
+ '<li><strong>Politik analiz:</strong> Seçim kampanyalarında kamu duygusunun zaman içindeki değişimi.</li>'
+ '<li><strong>Sağlık:</strong> Hasta forumlarında ilaç yan etkilerinin ve memnuniyetin tespiti.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. Duygu Analizinin Üç Zorluğu</h2>'

+ '<h3 class="l-subtitle">Zorluk 1: Olumsuzlama (negation)</h3>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text" style="text-align:center"><code>"film güzeldi"</code> (olumlu) &nbsp; vs. &nbsp; <code>"film güzel değildi"</code> (olumsuz)</p>'
+ '<p class="l-text">Tek kelime fark, anlam tersine döner. Bag-of-Words bunu yakalayamaz. Bigram\'lar (Ders 2) ve modern dil modelleri çözer.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Zorluk 2: İroni ve sarkazm</h3>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text"><code>"Harika bir gün, üç saattir trafikteyim 🙃"</code></p>'
+ '<p class="l-text">"Harika" pozitif bir kelime, ama bu cümlede ironik kullanılıyor — gerçek duygu olumsuz. Klasik kelime sayma yöntemleri yanılır. İroni tespiti hâlâ NLP\'nin en zor problemlerinden.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Zorluk 3: Yön (aspect) bağımlı duygu</h3>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text"><code>"Telefonun ekranı harika ama bataryası çok kısa sürüyor."</code></p>'
+ '<p class="l-text">Tek bir cümlede iki ayrı yön (ekran, batarya) için iki ayrı duygu var. Cümle bütününe "olumlu" demek yetersiz. <strong>Aspect-based sentiment analysis (ABSA)</strong> bu inceliği çözer.</p>'
+ '</div></div>'

+ '<h2 class="l-title">4. Üç Yaklaşım — Sözlük, Klasik ML, Derin Öğrenme</h2>'

+ '<h3 class="l-subtitle">Yöntem 1: Sözlük tabanlı (lexicon-based)</h3>'

+ '<p class="l-text">En basit yöntem: olumlu ve olumsuz kelimelerden oluşan iki liste tut. Cümledeki kelimeleri say, hangi listede daha çok varsa o duygudur.</p>'

+ '<ul class="l-list">'
+ '<li>Olumlu: <em>harika, güzel, mükemmel, hızlı, kaliteli, tavsiye, beğendim</em></li>'
+ '<li>Olumsuz: <em>kötü, berbat, yavaş, kalitesiz, üzücü, beğenmedim, iade</em></li>'
+ '</ul>'

+ '<p class="l-text"><strong>Avantaj:</strong> Eğitim verisi gerekmez, hızlıdır, yorumlanabilir. <strong>Dezavantaj:</strong> Olumsuzlamayı kaçırır, yön ayırt edemez, kelime listesi her dile için tek tek hazırlanmalı. Türkçe için yaygın sözlük: <strong>SentiTurkNet</strong>, <strong>HBVDH</strong>.</p>'

+ '<h3 class="l-subtitle">Yöntem 2: Klasik makine öğrenmesi</h3>'

+ '<p class="l-text"><a href="/tutorials/ai/nlp/text-classification">Ders 3</a>\'te öğrendiğimiz Naive Bayes ve lojistik regresyon. TF-IDF + bigram + lojistik regresyon kombinasyonu pek çok Türkçe sentiment veri setinde %85-90 doğruluk verir. Pratik, hızlı, üretimde sıkça kullanılır.</p>'

+ '<h3 class="l-subtitle">Yöntem 3: Derin öğrenme (BERT türevleri)</h3>'

+ '<p class="l-text">Türkçe için <strong>BERTurk</strong> (dbmdz tarafından eğitilen Türkçe BERT) ince ayar (fine-tuning) ile %92-95 doğruluk verir. Daha pahalı ama olumsuzlama, ironi ve uzun bağlam konularında klasik yöntemlerden açık ara önde. <a href="/tutorials/ai/nlp/transformers-bert">Ders 10</a> ve <a href="/tutorials/ai/nlp/generative-llms">Ders 11</a>\'de detaylanır.</p>'

+ '<h2 class="l-title">5. Türkçe Yorum Verisi — Mini Pipeline</h2>'

+ '<p class="l-text">Bu bölümde uçtan uca bir Türkçe sentiment pipeline\'ı kuracağız. 6 yorumdan oluşan minik bir eğitim seti hazırlayalım:</p>'

+ '<div class="calc-example"><div class="example-label">EĞİTİM VERİSİ — 6 TÜRKÇE YORUM</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Yorum</th><th style="padding:.5rem">Etiket</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Ürün gerçekten harikaydı, çok beğendim</td><td style="text-align:center">olumlu</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Kargo hızlı geldi, kaliteli ürün</td><td style="text-align:center">olumlu</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Tavsiye ederim, fiyat performans iyi</td><td style="text-align:center">olumlu</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Çok kötü, hiç beğenmedim, iade ettim</td><td style="text-align:center">olumsuz</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Berbat kalitesiz ürün, kandırıldım</td><td style="text-align:center">olumsuz</td></tr>'
+ '<tr><td style="padding:.5rem">Ürün resimle uyuşmuyor, üzgünüm</td><td style="text-align:center">olumsuz</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Uçtan uca Türkçe sentiment pipeline<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline'
+ '\n'
+ '\nyorumlar = ['
+ '\n    <span class="str">"Ürün gerçekten harikaydı çok beğendim"</span>,'
+ '\n    <span class="str">"Kargo hızlı geldi kaliteli ürün"</span>,'
+ '\n    <span class="str">"Tavsiye ederim fiyat performans iyi"</span>,'
+ '\n    <span class="str">"Çok kötü hiç beğenmedim iade ettim"</span>,'
+ '\n    <span class="str">"Berbat kalitesiz ürün kandırıldım"</span>,'
+ '\n    <span class="str">"Ürün resimle uyuşmuyor üzgünüm"</span>,'
+ '\n]'
+ '\netiketler = [<span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>]'
+ '\n'
+ '\n<span class="cm"># Türkçe stop words (kısa liste, "değil" YOK!)</span>'
+ '\ntr_stops = {<span class="str">"ve"</span>, <span class="str">"ile"</span>, <span class="str">"bir"</span>, <span class="str">"bu"</span>, <span class="str">"şu"</span>, <span class="str">"da"</span>, <span class="str">"de"</span>, <span class="str">"için"</span>}'
+ '\n'
+ '\npipe = <span class="fn">Pipeline</span>(['
+ '\n    (<span class="str">"vec"</span>, <span class="fn">TfidfVectorizer</span>('
+ '\n        ngram_range=(<span class="num">1</span>, <span class="num">2</span>),     <span class="cm"># bigram kritik (negation için)</span>'
+ '\n        stop_words=<span class="fn">list</span>(tr_stops),'
+ '\n        min_df=<span class="num">1</span>,'
+ '\n    )),'
+ '\n    (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>)),'
+ '\n])'
+ '\n'
+ '\npipe.<span class="fn">fit</span>(yorumlar, etiketler)'
+ '\n'
+ '\nyeni = [<span class="str">"ürün harika kaliteli"</span>, <span class="str">"berbat hiç beğenmedim"</span>]'
+ '\n<span class="fn">print</span>(pipe.<span class="fn">predict</span>(yeni))         <span class="cm"># [1 0]</span>'
+ '\n<span class="fn">print</span>(pipe.<span class="fn">predict_proba</span>(yeni).<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> sklearn\'ün <code>Pipeline</code> yapısı ile vektörleştirme + sınıflandırma adımlarını tek nesneye sarar. Eğitim sırasında veriyi otomatik vektörleştirir, modeli eğitir; tahmin sırasında aynı vectorizer ile yeni metni dönüştürür. Stop word listesinde "değil" yok — sentiment için kritik. <code>ngram_range=(1, 2)</code> sayesinde "hiç beğenmedim" gibi bigram\'lar yakalanır.</p>'

+ '<h2 class="l-title">6. Türkçeye Özgü Sorunlar</h2>'

+ '<h3 class="l-subtitle">"Değil" ve olumsuzlama ekleri</h3>'

+ '<p class="l-text">Türkçede olumsuzluk hem ayrı kelime ("değil") hem fiil eki olarak ifade edilir: "beğendim" → "beğenmedim". Bu ekler kelime köküne yapışık, fakat anlamı tersine döndürür. <strong>Çözüm:</strong> Stemming yapma (kök "beğen" anlamı kaybeder), ya da <em>özel bir negation tagger</em> kullan.</p>'

+ '<h3 class="l-subtitle">Yazım çeşitliliği ve Türkçe karakter sorunu</h3>'

+ '<p class="l-text">Sosyal medyada "harika" yerine "harikaaa", "harikaydı" (ı yerine i), "haarika" gibi varyantlar görülür. Bu varyantlar BoW açısından farklı kelimeler. <strong>Çözüm:</strong> Karakter normalizasyonu (Türkçe karakterleri standardize et), tekrarlayan harfleri sıkıştır ("harikaaaa" → "harika").</p>'

+ '<h3 class="l-subtitle">Argo, emoji ve kısaltmalar</h3>'

+ '<p class="l-text">"Aşırı güzel", "süper", "💯", "bayıldım", "iyiymiş", "iyiymişş", "ahanda budur" — gerçek dünya verisinde sıkça karşılaşılır. Sözlüklerde nadiren bulunur. Modern transformer modelleri bunları doğal olarak yakalar; klasik modeller için emoji → token dönüşümü yapmak iyi pratiktir.</p>'

+ '<h2 class="l-title">7. Aspect-Based Sentiment Analysis (ABSA)</h2>'

+ '<p class="l-text">Cümle bazlı sınıflandırmadan bir adım ileri: aynı yorumda farklı yönler (özellikler) için ayrı duygu skoru çıkarmak.</p>'

+ '<div class="calc-example"><div class="example-label">YÖN BAZLI ANALİZ — TELEFON YORUMU</div><div class="example-body">'
+ '<p class="l-text"><code>"Telefonun ekranı harika ama bataryası çok kısa sürüyor."</code></p>'
+ '<p class="l-text" style="margin-top:.8rem">Yön bazlı çıkarım:</p>'
+ '<ul class="l-list" style="margin-top:.4rem">'
+ '<li><strong>ekran</strong> → olumlu (harika)</li>'
+ '<li><strong>batarya</strong> → olumsuz (çok kısa sürüyor)</li>'
+ '</ul>'
+ '<p class="l-text" style="margin-top:.8rem">Ürün yöneticisi için bu çok daha bilgilidir: "Bataryayı düzeltirsek ekran tasarımına dokunmadan müşteri memnuniyetini artırırız."</p>'
+ '</div></div>'

+ '<p class="l-text">ABSA iki adımlı bir görevdir: (1) cümledeki yönleri (aspects) çıkar, (2) her yön için duygu kutbunu tespit et. <a href="/tutorials/ai/nlp/sequence-labeling">Ders 7</a>\'deki dizi etiketleme yöntemleri (NER tarzı BIO etiketleme) yön çıkarımında kullanılır. Modern yaklaşımlar her iki adımı tek bir BERT temelli model ile yapar (joint learning).</p>'

+ '<h2 class="l-title">8. Değerlendirme — Sentiment\'e Özel Notlar</h2>'

+ '<p class="l-text">Accuracy tek başına yeterli değildir, özellikle <strong>dengesiz veri setlerinde</strong>. Diyelim ki yorumların %80\'i olumlu — model her şeye "olumlu" derse bile %80 accuracy alır, ama olumsuzları hiç tespit edemez. Bu yüzden daha fazla metrik kullanılır:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Precision (kesinlik):</strong> "Olumlu" dediklerimin kaçı gerçekten olumlu? FP\'leri cezalandırır.</li>'
+ '<li><strong>Recall (duyarlılık):</strong> Gerçekten olumlu olanların kaçını yakaladım? FN\'leri cezalandırır.</li>'
+ '<li><strong>F1:</strong> Precision ve recall\'un harmonik ortalaması. Tek skor istediğinde standarttır.</li>'
+ '<li><strong>Macro F1:</strong> Her sınıfın F1\'inin ortalaması. Dengesiz veri setlerinde adildir.</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> classification_report ile detaylı metrikler<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report'
+ '\n'
+ '\ny_pred = pipe.<span class="fn">predict</span>(y_test_yorumlar)'
+ '\n<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, y_pred,'
+ '\n      target_names=[<span class="str">"olumsuz"</span>, <span class="str">"olumlu"</span>]))'
+ '\n<span class="cm">#               precision  recall  f1-score</span>'
+ '\n<span class="cm">#  olumsuz       0.88       0.79    0.83</span>'
+ '\n<span class="cm">#  olumlu        0.85       0.92    0.88</span>'
+ '\n<span class="cm">#  macro avg     0.87       0.86    0.86</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> sklearn\'ün <code>classification_report</code> fonksiyonu her sınıf için precision, recall ve F1\'i, ayrıca makro ortalamaları tek bir tabloda verir. Dengeli bakış için ideal. Yukarıdaki örnek çıktıda model olumlu sınıfı daha iyi yakalıyor (recall=0.92), olumsuzda biraz zayıf (recall=0.79) — eğitim setinde olumsuz örnek azsa beklenen bir durum.</p>'

+ '<div class="plotly-graph"><div id="plot-sent-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["Sözlük","BoW + Naive Bayes","TF-IDF + Logistic Reg.","TF-IDF + LR + bigram","BERTurk fine-tune"];'
+ 'var acc=[0.71,0.84,0.87,0.90,0.94];'
+ 'var t1={x:k,y:acc,type:"bar",marker:{color:T.accent},text:acc.map(function(v){return (v*100).toFixed(0)+"%";}),textposition:"outside"};'
+ 'var layout={title:{text:"Türkçe sentiment: yöntemlerin tipik doğruluğu",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{color:T.text,gridcolor:T.grid,title:"Doğruluk",range:[0.5,1.0],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:100,l:60}};'
+ 'if(document.getElementById("plot-sent-tr"))Plotly.newPlot("plot-sent-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Türkçe sentiment veri setlerinde tipik olarak görülen doğruluk seviyeleri. Sözlük tabanlı yöntemler hızlı ama %70 civarı tavanlanır. Klasik ML (TF-IDF + lojistik regresyon) %85-90\'a çıkar — bigram\'lar olumsuzlama yakalar, +%3 katkı. BERTurk fine-tune en güçlü, %94 civarı; ama eğitim maliyeti ve donanım gereksinimi çok daha yüksek.</div>'

+ '<h2 class="l-title">9. Üretim İpuçları</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Veri kalitesi her şeyden önce gelir.</strong> 1000 iyi etiketlenmiş yorum, 10.000 gürültülü yorumdan iyidir.</li>'
+ '<li><strong>Sınıf dengesi.</strong> Olumsuz yorumlar genelde azdır (memnun müşteri sessizdir). Class weight veya oversampling kullan.</li>'
+ '<li><strong>Anlamlı baseline kur.</strong> Önce sözlük tabanlı, sonra TF-IDF + LR, sonra BERTurk dene. Hangisi gerçekten gerekli?</li>'
+ '<li><strong>Hata analizi.</strong> Modelin yanıldığı 100 örneği oku — öğrendiğin şey kütüphane API\'sinden çok daha değerli.</li>'
+ '<li><strong>Dağıtım kayması (distribution shift).</strong> Eğitim verisi 2022, kullandığın yer 2026 ise dil değişmiştir. Periyodik olarak yeniden eğit.</li>'
+ '<li><strong>İronik içerikler.</strong> Modelin emin olmadığı (olasılık 0.4-0.6 arası) örnekleri insan denetimine yönlendir.</li>'
+ '</ul>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Sentiment, klasik NLP\'nin en olgun ve sık kullanılan görevlerinden biri. Şu ana kadar gördüklerimiz "kelime bir özelliktir" varsayımına dayalıydı. Ama "harika" ile "muhteşem" yakın anlamlar — model bunu BoW açısından bilmez. <a href="/tutorials/ai/nlp/word-embeddings">Ders 5</a>\'te bu boşluğu dolduracağız: <strong>kelime gömmeleri (word embeddings)</strong>. Word2Vec, GloVe, FastText — kelimeleri anlamı yansıtan dense vektörlere çeviren yöntemler.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Duygu analizinin ne olduğunu, gerçek dünyadaki kullanım alanlarını, üç temel zorluğunu (negation, ironi, aspect) öğrendin. Üç yaklaşımı (sözlük, klasik ML, derin öğrenme) karşılaştırdın. Türkçe yorum verisi üzerinde uçtan uca bir pipeline kurdun. Türkçeye özgü sorunları (negation ekleri, yazım çeşitliliği, argo) gördün. Aspect-based sentiment ile cümle ötesine geçtin. Dengesiz veri setlerinde precision, recall, F1, macro F1 ile değerlendirme yaptın. Üretim için pratik ipuçlarını öğrendin.</div>'

,

en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> What sentiment analysis is, where it is used in the real world, and what makes it hard. You will combine all the parts from <a href="/tutorials/ai/nlp/text-preprocessing">Lessons 1-3</a> (preprocessing, vectorization, classification) into an end-to-end sentiment system, focused on Turkish review data. From positive/negative/neutral classification to aspect-based analysis, from lexicon-based to modern deep learning approaches.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Train a positive/negative/neutral sentiment classifier on Turkish review data</li>'
+ '<li>Compare lexicon-based scoring against ML-based supervised classifiers</li>'
+ '<li>Extract aspect-based sentiment ("shipping good, product bad") per facet</li>'
+ '<li>Handle Turkish-specific challenges: negation, irony, emoji, lexicon gaps</li>'
+ '<li>Run a fine-tuned BERTurk sentiment model from HuggingFace on real reviews</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. What is Sentiment Analysis?</h2>'

+ '<p class="l-text"><strong>Sentiment analysis</strong> (also called opinion mining) is the task of automatically detecting the emotional polarity of a text. In its simplest form it classifies text as <em>positive, negative, neutral</em>. More sophisticated versions extract sentiment intensity, the topic the sentiment is about, or even specific emotions (anger, joy, sadness).</p>'

+ '<p class="l-text">In Turkey the most common use is e-commerce <strong>product reviews</strong>: Trendyol, Hepsiburada, Amazon TR. Millions of reviews — humans cannot read them all. Automatic sentiment analysis is the backbone of this work.</p>'

+ '<div class="calc-example"><div class="example-label">REAL WORLD EXAMPLE — TRENDYOL REVIEW</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ '<code>"Shipping was super fast and the product is exactly what I expected. Recommended 👍"</code> &nbsp;→&nbsp; <strong>positive</strong>'
+ '<br><code>"Wrong size, nothing like the photo at all."</code> &nbsp;→&nbsp; <strong>negative</strong>'
+ '<br><code>"Product arrived, package was sealed. Have not tried yet."</code> &nbsp;→&nbsp; <strong>neutral</strong>'
+ '</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Use Cases</h2>'

+ '<ul class="l-list">'
+ '<li><strong>E-commerce review analysis:</strong> which product is loved/criticised for which feature? Vital for marketing and product development.</li>'
+ '<li><strong>Brand monitoring:</strong> overall sentiment toward a brand on social media; is there a crisis?</li>'
+ '<li><strong>Customer service:</strong> tone of incoming messages — angry customers should be prioritised.</li>'
+ '<li><strong>Finance:</strong> extract stock sentiment from news; algorithmic trading signal.</li>'
+ '<li><strong>Political analysis:</strong> public sentiment over time during election campaigns.</li>'
+ '<li><strong>Healthcare:</strong> detecting drug side effects and patient satisfaction in patient forums.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. Three Hard Problems in Sentiment Analysis</h2>'

+ '<h3 class="l-subtitle">Problem 1: negation</h3>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text" style="text-align:center"><code>"the movie was good"</code> (positive) &nbsp; vs. &nbsp; <code>"the movie was not good"</code> (negative)</p>'
+ '<p class="l-text">A single word changes meaning entirely. Bag-of-Words misses this. Bigrams (Lesson 2) and modern language models solve it.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Problem 2: irony and sarcasm</h3>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text"><code>"What an amazing day, I have been stuck in traffic for three hours 🙃"</code></p>'
+ '<p class="l-text">"Amazing" is a positive word, but in this sentence it is ironic — the actual sentiment is negative. Word counting fails. Sarcasm detection is still one of NLP\'s hardest problems.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Problem 3: aspect-dependent sentiment</h3>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text"><code>"The phone screen is amazing but the battery dies fast."</code></p>'
+ '<p class="l-text">One sentence, two aspects (screen, battery), two different sentiments. Calling the whole sentence "positive" is too coarse. <strong>Aspect-based sentiment analysis (ABSA)</strong> handles this nuance.</p>'
+ '</div></div>'

+ '<h2 class="l-title">4. Three Approaches — Lexicon, Classical ML, Deep Learning</h2>'

+ '<h3 class="l-subtitle">Approach 1: lexicon-based</h3>'

+ '<p class="l-text">The simplest method: keep two lists, one of positive and one of negative words. Count words in the sentence, classify by which list dominates.</p>'

+ '<ul class="l-list">'
+ '<li>Positive: <em>amazing, great, perfect, fast, quality, recommend, love</em></li>'
+ '<li>Negative: <em>bad, terrible, slow, low-quality, sad, return, refund</em></li>'
+ '</ul>'

+ '<p class="l-text"><strong>Pros:</strong> No training data needed, fast, interpretable. <strong>Cons:</strong> misses negation, cannot separate aspects, the word list must be built per language. For English: <strong>VADER</strong>, <strong>SentiWordNet</strong>. For Turkish: <strong>SentiTurkNet</strong>, <strong>HBVDH</strong>.</p>'

+ '<h3 class="l-subtitle">Approach 2: classical machine learning</h3>'

+ '<p class="l-text">The Naive Bayes and logistic regression we learned in <a href="/tutorials/ai/nlp/text-classification">Lesson 3</a>. The combination of TF-IDF + bigrams + logistic regression hits 85-90% on most Turkish sentiment datasets. Practical, fast, and still common in production.</p>'

+ '<h3 class="l-subtitle">Approach 3: deep learning (BERT family)</h3>'

+ '<p class="l-text">For Turkish, fine-tuning <strong>BERTurk</strong> (the Turkish BERT trained by dbmdz) gives 92-95% accuracy. More expensive but clearly ahead of classical methods on negation, irony, and long context. See <a href="/tutorials/ai/nlp/transformers-bert">Lesson 10</a> and <a href="/tutorials/ai/nlp/generative-llms">Lesson 11</a>.</p>'

+ '<h2 class="l-title">5. End-to-End Sentiment Pipeline</h2>'

+ '<p class="l-text">In this section we build an end-to-end Turkish sentiment pipeline. A tiny six-review training set:</p>'

+ '<div class="calc-example"><div class="example-label">TRAINING DATA — 6 TURKISH REVIEWS</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Review</th><th style="padding:.5rem">Label</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Ürün gerçekten harikaydı, çok beğendim</td><td style="text-align:center">positive</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Kargo hızlı geldi, kaliteli ürün</td><td style="text-align:center">positive</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Tavsiye ederim, fiyat performans iyi</td><td style="text-align:center">positive</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Çok kötü, hiç beğenmedim, iade ettim</td><td style="text-align:center">negative</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Berbat kalitesiz ürün, kandırıldım</td><td style="text-align:center">negative</td></tr>'
+ '<tr><td style="padding:.5rem">Ürün resimle uyuşmuyor, üzgünüm</td><td style="text-align:center">negative</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> End-to-end Turkish sentiment pipeline<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline'
+ '\n'
+ '\nreviews = ['
+ '\n    <span class="str">"Ürün gerçekten harikaydı çok beğendim"</span>,'
+ '\n    <span class="str">"Kargo hızlı geldi kaliteli ürün"</span>,'
+ '\n    <span class="str">"Tavsiye ederim fiyat performans iyi"</span>,'
+ '\n    <span class="str">"Çok kötü hiç beğenmedim iade ettim"</span>,'
+ '\n    <span class="str">"Berbat kalitesiz ürün kandırıldım"</span>,'
+ '\n    <span class="str">"Ürün resimle uyuşmuyor üzgünüm"</span>,'
+ '\n]'
+ '\nlabels = [<span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>]'
+ '\n'
+ '\n<span class="cm"># Turkish stop words (short list, "değil" is NOT here!)</span>'
+ '\ntr_stops = {<span class="str">"ve"</span>, <span class="str">"ile"</span>, <span class="str">"bir"</span>, <span class="str">"bu"</span>, <span class="str">"şu"</span>, <span class="str">"da"</span>, <span class="str">"de"</span>, <span class="str">"için"</span>}'
+ '\n'
+ '\npipe = <span class="fn">Pipeline</span>(['
+ '\n    (<span class="str">"vec"</span>, <span class="fn">TfidfVectorizer</span>('
+ '\n        ngram_range=(<span class="num">1</span>, <span class="num">2</span>),     <span class="cm"># bigrams critical for negation</span>'
+ '\n        stop_words=<span class="fn">list</span>(tr_stops),'
+ '\n        min_df=<span class="num">1</span>,'
+ '\n    )),'
+ '\n    (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>)),'
+ '\n])'
+ '\n'
+ '\npipe.<span class="fn">fit</span>(reviews, labels)'
+ '\n'
+ '\nnew = [<span class="str">"ürün harika kaliteli"</span>, <span class="str">"berbat hiç beğenmedim"</span>]'
+ '\n<span class="fn">print</span>(pipe.<span class="fn">predict</span>(new))         <span class="cm"># [1 0]</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> sklearn\'s <code>Pipeline</code> wraps vectorization + classification into a single object. During fit it auto-vectorises and trains; during prediction it transforms new text with the same vectorizer. Note that "değil" (Turkish "not") is NOT in the stop word list — critical for sentiment. <code>ngram_range=(1, 2)</code> captures bigrams like "hiç beğenmedim" which carry negation.</p>'

+ '<h2 class="l-title">6. Turkish-Specific Pitfalls</h2>'

+ '<h3 class="l-subtitle">"Değil" and negation suffixes</h3>'

+ '<p class="l-text">Turkish expresses negation both as a separate word ("değil") and as a verb suffix: "beğendim" (I liked) → "beğenmedim" (I did not like). The suffix attaches directly to the stem and flips meaning. <strong>Solution:</strong> avoid stemming (the stem "beğen" loses information), or use a dedicated <em>negation tagger</em>.</p>'

+ '<h3 class="l-subtitle">Spelling variation and Turkish character issues</h3>'

+ '<p class="l-text">On social media you see "harikaaa", "harikaydi" (with i instead of ı), "haarika" — all variants of "harika". To BoW these are different words. <strong>Solution:</strong> character normalisation, collapse repeated letters ("harikaaaa" → "harika").</p>'

+ '<h3 class="l-subtitle">Slang, emojis, and abbreviations</h3>'

+ '<p class="l-text">"Aşırı güzel", "süper", "💯", "bayıldım" — common in real data, rarely in dictionaries. Modern transformers pick these up naturally; classical models benefit from emoji-to-token conversion.</p>'

+ '<h2 class="l-title">7. Aspect-Based Sentiment Analysis (ABSA)</h2>'

+ '<p class="l-text">A step beyond sentence-level classification: extract separate sentiment scores for different aspects of the same review.</p>'

+ '<div class="calc-example"><div class="example-label">ASPECT-BASED — PHONE REVIEW</div><div class="example-body">'
+ '<p class="l-text"><code>"The phone screen is amazing but the battery dies fast."</code></p>'
+ '<p class="l-text" style="margin-top:.8rem">Aspect-based output:</p>'
+ '<ul class="l-list" style="margin-top:.4rem">'
+ '<li><strong>screen</strong> → positive (amazing)</li>'
+ '<li><strong>battery</strong> → negative (dies fast)</li>'
+ '</ul>'
+ '<p class="l-text" style="margin-top:.8rem">For a product manager this is far more useful: "Fix the battery without changing the screen design and we lift customer satisfaction."</p>'
+ '</div></div>'

+ '<p class="l-text">ABSA is two tasks: (1) extract aspects from the sentence, (2) classify sentiment per aspect. Sequence labelling methods from <a href="/tutorials/ai/nlp/sequence-labeling">Lesson 7</a> (BIO tagging) are used for aspect extraction. Modern approaches do both jointly with a single BERT-based model.</p>'

+ '<h2 class="l-title">8. Evaluation — Sentiment-Specific Notes</h2>'

+ '<p class="l-text">Accuracy alone is not enough, especially with <strong>imbalanced datasets</strong>. If 80% of reviews are positive, a model predicting "positive" for everything still gets 80% accuracy — but catches no negatives. So use richer metrics:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Precision:</strong> Of the ones I called "positive", how many really are? Penalises false positives.</li>'
+ '<li><strong>Recall:</strong> Of the truly positive ones, how many did I catch? Penalises false negatives.</li>'
+ '<li><strong>F1:</strong> Harmonic mean of precision and recall. Standard single-number summary.</li>'
+ '<li><strong>Macro F1:</strong> Mean of per-class F1. Fair on imbalanced data.</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> classification_report for full metrics<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report'
+ '\n'
+ '\ny_pred = pipe.<span class="fn">predict</span>(test_reviews)'
+ '\n<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, y_pred,'
+ '\n      target_names=[<span class="str">"negative"</span>, <span class="str">"positive"</span>]))'
+ '\n<span class="cm">#               precision  recall  f1-score</span>'
+ '\n<span class="cm">#  negative      0.88       0.79    0.83</span>'
+ '\n<span class="cm">#  positive      0.85       0.92    0.88</span>'
+ '\n<span class="cm">#  macro avg     0.87       0.86    0.86</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> <code>classification_report</code> returns precision, recall, F1 per class plus macro averages in a single table. The example output shows the model catches positives well (recall=0.92) and is weaker on negatives (recall=0.79) — typical when the negative class has fewer training examples.</p>'

+ '<div class="plotly-graph"><div id="plot-sent-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["Lexicon","BoW + Naive Bayes","TF-IDF + LogReg","TF-IDF + LR + bigram","BERTurk fine-tune"];'
+ 'var acc=[0.71,0.84,0.87,0.90,0.94];'
+ 'var t1={x:k,y:acc,type:"bar",marker:{color:T.accent},text:acc.map(function(v){return (v*100).toFixed(0)+"%";}),textposition:"outside"};'
+ 'var layout={title:{text:"Turkish sentiment: typical accuracy by method",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{color:T.text,gridcolor:T.grid,title:"Accuracy",range:[0.5,1.0],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:100,l:60}};'
+ 'if(document.getElementById("plot-sent-en"))Plotly.newPlot("plot-sent-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Typical accuracy levels seen on Turkish sentiment datasets. Lexicon methods are fast but cap around 70%. Classical ML (TF-IDF + LR) reaches 85-90% — bigrams catch negation, +3% gain. BERTurk fine-tune is the strongest at ~94%; but training cost and hardware needs are much higher.</div>'

+ '<h2 class="l-title">9. Production Tips</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Data quality first.</strong> 1,000 well-labelled reviews beat 10,000 noisy ones.</li>'
+ '<li><strong>Class balance.</strong> Negative reviews are usually rarer (happy customers stay quiet). Use class weights or oversampling.</li>'
+ '<li><strong>Establish a real baseline.</strong> Try lexicon, then TF-IDF + LR, then BERTurk. Which is actually needed?</li>'
+ '<li><strong>Error analysis.</strong> Read 100 mispredictions. What you learn beats any library docs.</li>'
+ '<li><strong>Distribution shift.</strong> If training is 2022 and you deploy in 2026, language has shifted. Retrain periodically.</li>'
+ '<li><strong>Sarcastic content.</strong> Route low-confidence predictions (probability 0.4-0.6) to human review.</li>'
+ '</ul>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">Sentiment is one of classical NLP\'s most mature and most-used tasks. Everything we have done relies on the assumption that "a word is just a feature". But "amazing" and "wonderful" are close in meaning — BoW does not know this. <a href="/tutorials/ai/nlp/word-embeddings">Lesson 5</a> closes that gap with <strong>word embeddings</strong>. Word2Vec, GloVe, FastText — methods that turn words into dense vectors that capture meaning.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> What sentiment analysis is, where it is used, and the three core hard problems (negation, irony, aspect). You compared three approaches (lexicon, classical ML, deep learning). You built an end-to-end Turkish review pipeline. You saw Turkish-specific pitfalls (negation suffixes, spelling variation, slang). You learned aspect-based sentiment. You used precision, recall, F1, macro F1 for fair evaluation on imbalanced data. You learned production tips that matter beyond model accuracy.</div>'

};
