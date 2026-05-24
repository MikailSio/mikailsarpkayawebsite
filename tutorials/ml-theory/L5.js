/* ml-L5.js — ML Theory Lesson 5: Değerlendirme Metrikleri & Hyperparameter Tuning (TR + EN) */
var ML_L5 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> "Modelim iyi" demek tek bir sayıya bakmak değildir. Doğru metriği seçmek üretim modellerinin başarısını belirler. Müşteri kayıp probleminde accuracy yüzde 80 görünebilir ama hâlâ tüm kayıp müşterileri kaçırıyor olabiliriz. Confusion matrix, precision, recall, F1, ROC-AUC, log-loss; her birini hangi senaryoda kullanmalı. Sonra hyperparameter tuning — GridSearch ve Optuna ile en iyi modeli sistematik bulma.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Confusion matrix\'ten precision, recall, F1 ve accuracy çıkarmayı öğreneceksin</li><li>Precision-recall ödünleşimini eşik seçimiyle churn verisinde göstereceksin</li><li>ROC eğrisini çizip AUC\'yi sıralama gücü olarak yorumlayacaksın</li><li>Log-loss\'la olasılık kalibrasyonunu accuracy\'den ayırt edeceksin</li><li>GridSearchCV ve Optuna ile churn modelini sistematik olarak tune edeceksin</li></ul></div>'

+ '<h2 class="l-title">1. Tek Bir Sayı Niye Yetmez?</h2>'

+ '<p class="l-text">Müşteri kayıp veri setinde %80 müşteri kalmış, %20 kayıp gitmiş — tipik bir <em>dengesiz veri</em>. Bir model her şeye "kalan" derse:</p>'

+ '<div class="calc-formula">'
+ '<div class="formula-main"><strong>Accuracy</strong> = (Doğru tahmin) / (Toplam) = 80 / 100 = %80</div>'
+ '</div>'

+ '<p class="l-text">Bu model %80 doğruluğa sahip ama hiçbir kayıp müşteriyi tespit edemedi. Şirket için tamamen değersiz — kayıp müşterileri yakalayamayız ki onları geri kazanmaya çalışalım.</p>'

+ '<p class="l-text">Bu yüzden farklı metriklere ihtiyacımız var. Hangisi? Probleme bağlı.</p>'

+ '<h2 class="l-title">2. Confusion Matrix — Her Şeyin Temeli</h2>'

+ '<p class="l-text">İkili sınıflandırmada modelin ürettiği <strong>4 farklı sonuç</strong> vardır:</p>'

+ '<div class="calc-example"><div class="example-label">CONFUSION MATRIX — KAYIP TAHMİNİ</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem"></th><th style="padding:.5rem;color:var(--accent)">Tahmin: Kayıp</th><th style="padding:.5rem;color:var(--accent)">Tahmin: Kalan</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem;color:var(--accent)"><strong>Gerçek: Kayıp</strong></td><td style="text-align:center"><strong>TP</strong> (True Positive)<br><span style="color:var(--text-dim)">15</span></td><td style="text-align:center"><strong>FN</strong> (False Negative)<br><span style="color:var(--text-dim)">5</span></td></tr>'
+ '<tr><td style="padding:.5rem;color:var(--accent)"><strong>Gerçek: Kalan</strong></td><td style="text-align:center"><strong>FP</strong> (False Positive)<br><span style="color:var(--text-dim)">10</span></td><td style="text-align:center"><strong>TN</strong> (True Negative)<br><span style="color:var(--text-dim)">70</span></td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text" style="margin-top:1rem">Bu tabloya bakarak hangi tip hataların yaşandığını görüyoruz. Modelimiz 15 kayıp müşteriyi doğru yakaladı, 5 kayıp müşteriyi kaçırdı, 10 kalan müşteriyi yanlışlıkla "kayıp" dedi, 70 kalan müşteriyi doğru tanıdı.</p>'
+ '</div></div>'

+ '<ul class="l-list">'
+ '<li><strong>TP (True Positive):</strong> Gerçekten kayıp, model "kayıp" dedi ✓</li>'
+ '<li><strong>TN (True Negative):</strong> Gerçekten kalan, model "kalan" dedi ✓</li>'
+ '<li><strong>FP (False Positive):</strong> Aslında kalan, model yanlış "kayıp" dedi (tip 1 hatası — yanlış alarm)</li>'
+ '<li><strong>FN (False Negative):</strong> Aslında kayıp, model yanlış "kalan" dedi (tip 2 hatası — kaçırılan vaka)</li>'
+ '</ul>'

+ '<h2 class="l-title">3. Accuracy, Precision, Recall, F1</h2>'

+ '<p class="l-text">Bu 4 sayıdan farklı metrikler türetilir.</p>'

+ '<h3 class="l-subtitle">Accuracy — Doğruluk</h3>'

+ '<div class="katex-block">$$\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}$$</div>'

+ '<p class="l-text">"Toplamda yüzde kaçında haklıyım?" Üstteki örnekte (15+70)/100 = %85. Dengeli verilerde işe yarar; dengesizde yanıltıcıdır.</p>'

+ '<h3 class="l-subtitle">Precision — Kesinlik</h3>'

+ '<div class="katex-block">$$\\text{Precision} = \\frac{TP}{TP + FP}$$</div>'

+ '<p class="l-text">"Kayıp dediklerimin yüzde kaçı gerçekten kayıp?" Üstteki örnekte 15/(15+10) = %60. <strong>FP\'yi cezalandırır</strong> — yanlış alarmlardan kaçınmak istiyorsan precision\'a bak.</p>'

+ '<p class="l-text"><em>Pratik örnek:</em> Spam filtresinde precision yüksek olmalı — önemli e-postaları yanlışlıkla spam\'e atmak çok zarar verir.</p>'

+ '<h3 class="l-subtitle">Recall (Sensitivity, TPR) — Duyarlılık</h3>'

+ '<div class="katex-block">$$\\text{Recall} = \\frac{TP}{TP + FN}$$</div>'

+ '<p class="l-text">"Gerçek kayıpların yüzde kaçını yakaladım?" Üstteki örnekte 15/(15+5) = %75. <strong>FN\'yi cezalandırır</strong> — bir vakayı kaçırmak çok pahalıysa recall\'a bak.</p>'

+ '<p class="l-text"><em>Pratik örnek:</em> Kanser tarama testinde recall yüksek olmalı — gerçek bir hastayı sağlıklı saymak ölümcül olabilir, oysa sağlıklıyı yanlışlıkla "şüpheli" demek sadece daha fazla test gerektirir.</p>'

+ '<h3 class="l-subtitle">F1 Skoru — Precision ve Recall\'un Dengesi</h3>'

+ '<div class="katex-block">$$F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$</div>'

+ '<p class="l-text">Precision ve recall\'un <strong>harmonik ortalaması</strong>. Aritmetik değil — biri çok düşükse F1 de düşük olur. Üstteki örnekte 2·(0.6·0.75)/(0.6+0.75) = 0.667.</p>'

+ '<p class="l-text">F1 ne zaman: dengesiz veride tek bir özet skor gerekiyorsa. Çoğunlukla başlangıç noktasıdır.</p>'

+ '<h2 class="l-title">4. Precision-Recall Trade-Off — Eşik Seçimi</h2>'

+ '<p class="l-text">Lojistik regresyon (<a href="/tutorials/ml-theory/3">L3</a>) bir olasılık döner. Hangi olasılığın üstündekini "kayıp" sayacağız? Varsayılan 0.5; ama bu ayarlanabilir bir <strong>eşik</strong>tir.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Eşik düşük (0.3):</strong> daha çok müşteriyi "kayıp" der → recall yüksek, precision düşük</li>'
+ '<li><strong>Eşik yüksek (0.7):</strong> sadece çok emin olduğunda "kayıp" der → precision yüksek, recall düşük</li>'
+ '</ul>'

+ '<p class="l-text">İkisini birden maksimize edemezsin — bu trade-off\'tür. İş bağlamına göre seç:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Kampanya bütçesi sınırlı:</strong> sadece en olası kayıpları hedefle (yüksek precision)</li>'
+ '<li><strong>Müşteri kaybı çok pahalı, herkesi tut:</strong> daha çok kayıp yakala (yüksek recall)</li>'
+ '</ul>'

+ '<div class="plotly-graph"><div id="plot-prtradeoff-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var th=[];for(var i=5;i<=95;i+=5)th.push(i/100);'
+ 'var prec=th.map(function(t){return Math.min(0.95,0.3+t*0.85);});'
+ 'var rec=th.map(function(t){return Math.max(0.05,1.0-t*0.95);});'
+ 'var f1=th.map(function(t,i){return 2*prec[i]*rec[i]/(prec[i]+rec[i]);});'
+ 'var t1={x:th,y:prec,name:"Precision",type:"scatter",mode:"lines",line:{color:"rgba(78,205,196,.85)",width:3}};'
+ 'var t2={x:th,y:rec,name:"Recall",type:"scatter",mode:"lines",line:{color:"rgba(248,113,113,.85)",width:3}};'
+ 'var t3={x:th,y:f1,name:"F1",type:"scatter",mode:"lines",line:{color:T.accent,width:3,dash:"dash"}};'
+ 'var layout={xaxis:{title:"Karar eşiği",color:T.text,gridcolor:T.grid},yaxis:{title:"Skor",color:T.text,gridcolor:T.grid,range:[0,1.05],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.08,xanchor:"center",x:0.5}};'
+ 'if(document.getElementById("plot-prtradeoff-tr"))Plotly.newPlot("plot-prtradeoff-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Eşik düştükçe (sola) recall yükseliyor, precision düşüyor; eşik yükseldikçe (sağa) tersi. F1 ortada bir tepe yapar — orası dengeli noktadır. Pratikte iş gereksinimine göre eşiği bilinçli seçeriz, "0.5\'i otomatik kullan" demek genelde yanlış.</div>'

+ '<h2 class="l-title">5. ROC Eğrisi ve AUC</h2>'

+ '<p class="l-text"><strong>ROC eğrisi</strong> tüm olası eşikler için TPR (recall) ile FPR (false positive rate)\'i çizer. AUC (eğri altında kalan alan) modelin "iyi" sıralama yapma becerisini özetler.</p>'

+ '<div class="katex-block">$$\\text{TPR} = \\frac{TP}{TP+FN} = \\text{Recall}, \\qquad \\text{FPR} = \\frac{FP}{FP+TN}$$</div>'

+ '<ul class="l-list">'
+ '<li><strong>AUC = 1.0:</strong> Mükemmel ayrım.</li>'
+ '<li><strong>AUC = 0.5:</strong> Rastgele tahmin (köşegen çizgi).</li>'
+ '<li><strong>AUC = 0.7-0.9:</strong> Pek çok pratik sorunda iyi.</li>'
+ '</ul>'

+ '<p class="l-text">AUC eşikten bağımsızdır — modelin "kayıp olanları kalanlardan ne kadar iyi sıralayabildiğini" söyler. İki modeli karşılaştırırken yaygındır.</p>'

+ '<div class="l-warn"><strong>Uyarı:</strong> Çok dengesiz veride (örn. %1 pozitif sınıf) ROC-AUC yanıltıcı olabilir; bu durumda <strong>Precision-Recall AUC</strong> tercih edilir.</div>'

+ '<h2 class="l-title">6. Log-Loss — Olasılığın Doğru Olması</h2>'

+ '<p class="l-text">Şu ana kadar <em>tahmin</em>e baktık (sınıf etiketi). Ama lojistik regresyon olasılık döner; sadece doğru sınıfı tahmin etmek yetmez, <em>olasılığın da kalibre olması</em> gerekir. <strong>Log-loss (cross-entropy)</strong>:</p>'

+ '<div class="katex-block">$$\\text{LogLoss} = -\\frac{1}{n}\\sum_{i=1}^{n}\\bigl[\\,y_i \\log \\hat{p}_i + (1-y_i)\\log(1-\\hat{p}_i)\\,\\bigr]$$</div>'

+ '<p class="l-text">Model "0.99 olasılıkla kayıp" der ve gerçekten kayıpsa: log-loss çok düşük (iyi). Aynı tahmini der ama aslında kalansa: log-loss çok yüksek (kötü). Düşük log-loss = iyi olasılık tahminleri.</p>'

+ '<p class="l-text">Risk skoru üreten sistemlerde (kredi onay olasılığı, hastalık riski, ürün önerme) log-loss kritiktir.</p>'

+ '<h2 class="l-title">7. Regresyon Metrikleri — Kısa Özet</h2>'

+ '<ul class="l-list">'
+ '<li><strong>MSE:</strong> ortalama kare hata. Büyük hataları çok cezalandırır.</li>'
+ '<li><strong>RMSE:</strong> MSE\'nin karekökü. Hedefin biriminde — yorumlanması kolay (TL/dolar).</li>'
+ '<li><strong>MAE:</strong> ortalama mutlak hata. Aykırılıklara MSE\'den daha az duyarlı.</li>'
+ '<li><strong>MAPE:</strong> ortalama mutlak yüzde hata. Yüzde olarak yorum kolay ama y=0 yakın iken patlar.</li>'
+ '<li><strong>R² (<a href="/tutorials/ml-theory/2">L2</a>):</strong> açıklanan varyans oranı.</li>'
+ '</ul>'

+ '<h2 class="l-title">8. Çok Sınıflı Sınıflandırma</h2>'

+ '<p class="l-text">İkili olmayan problemlerde (örn. müşteri segmenti A/B/C/D) confusion matrix N×N olur. Per-sınıf precision/recall/F1 hesaplanır. Genel skor için iki strateji:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Macro average:</strong> her sınıfın F1\'ini ayrı ayrı hesapla, ortalama. Tüm sınıflara eşit ağırlık.</li>'
+ '<li><strong>Weighted average:</strong> her sınıfın F1\'i sınıfın boyutuyla ağırlıklandırılır. Büyük sınıflar baskın.</li>'
+ '<li><strong>Micro average:</strong> tüm TP, FP, FN\'leri toplayıp tek bir hesap yap. Genelde accuracy\'ye eşittir.</li>'
+ '</ul>'

+ '<p class="l-text">Dengesiz sınıflarda <strong>macro F1</strong> en adildir — küçük sınıflara da değer verir.</p>'

+ '<h2 class="l-title">9. Hyperparameter Tuning — En İyi Modeli Bulmak</h2>'

+ '<p class="l-text">Bir modelin parametreleri eğitim sırasında öğrenilir (ağırlıklar). <strong>Hyperparameters</strong> ise eğitim öncesi <em>biz</em> seçeriz — polinom derecesi, regularization gücü (C), kNN\'deki k, max_depth vs. Doğru değerleri bulmak <em>hyperparameter tuning</em>\'tir.</p>'

+ '<h3 class="l-subtitle">Yöntem 1: Grid Search</h3>'

+ '<p class="l-text">Her hyperparameter için bir değer listesi tanımla; tüm kombinasyonları dene. Basit, kapsamlı, ama kombinasyon patlaması var.</p>'

+ '<div class="calc-example"><div class="example-label">GRİD SEARCH ÖRNEĞI</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7">'
+ 'C ∈ {0.01, 0.1, 1, 10, 100}'
+ '<br>penalty ∈ {"l1", "l2"}'
+ '<br>= 5 × 2 = <strong>10 kombinasyon</strong>'
+ '</p>'
+ '<p class="l-text">Her kombinasyonu 5-fold CV ile değerlendir → 50 model eğitimi. En yüksek CV skoru veren kazanır.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Yöntem 2: Random Search</h3>'

+ '<p class="l-text">Tüm kombinasyonları denemek yerine rastgele <em>n</em> tane (örn. 50) seç. Yüksek-boyutlu hyperparameter uzaylarında grid search\'ten daha verimlidir — Bergstra & Bengio (2012) bunu kanıtladı.</p>'

+ '<h3 class="l-subtitle">Yöntem 3: Bayesian Optimization (Optuna)</h3>'

+ '<p class="l-text">Geçmiş denemelerden öğrenerek hangi noktayı sonra denemeli karar verir. Çok daha az denemeyle iyi sonuç verir. <strong>Optuna</strong> Python\'un en popüler aracıdır; XGBoost gibi karmaşık modeller için neredeyse standarttır.</p>'

+ '<h2 class="l-title">10. Python — Tüm Metrikler + Hyperparameter Tuning</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> classification_report ile detaylı metrikler<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report, confusion_matrix, roc_auc_score, log_loss'
+ '\n'
+ '\ny_pred = model.<span class="fn">predict</span>(X_test)'
+ '\ny_proba = model.<span class="fn">predict_proba</span>(X_test)[:, <span class="num">1</span>]'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="fn">confusion_matrix</span>(y_test, y_pred))'
+ '\n<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, y_pred,'
+ '\n      target_names=[<span class="str">"kalan"</span>, <span class="str">"kayıp"</span>]))'
+ '\n<span class="fn">print</span>(<span class="str">f"ROC-AUC: {roc_auc_score(y_test, y_proba):.3f}"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"LogLoss: {log_loss(y_test, y_proba):.3f}"</span>)'
+ '\n<span class="cm">#               precision  recall  f1-score</span>'
+ '\n<span class="cm">#  kalan         0.93       0.88    0.90</span>'
+ '\n<span class="cm">#  kayıp         0.60       0.75    0.67</span>'
+ '\n<span class="cm">#  macro avg     0.77       0.81    0.78</span>'
+ '\n<span class="cm"># ROC-AUC: 0.879</span>'
+ '\n<span class="cm"># LogLoss: 0.413</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> <code>classification_report</code> her sınıf için precision/recall/F1 ile macro/weighted ortalamaları tek tabloya döker. ROC-AUC için <em>olasılıkları</em> kullanırız (predict değil predict_proba), çünkü sıralama önemli. Log-loss da olasılık üzerinden. Çıktıdaki "kayıp" satırı dikkat çekici: precision 0.60, recall 0.75. Yani modelimiz kayıpların %75\'ini yakalıyor, ama "kayıp" dediklerinin sadece %60\'ı gerçekten kayıp — eşik düşürerek recall artırılabilir, iş hedefine göre.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> GridSearchCV ile tuning<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline'
+ '\n'
+ '\npipe = <span class="fn">Pipeline</span>(['
+ '\n    (<span class="str">"scaler"</span>, <span class="fn">StandardScaler</span>()),'
+ '\n    (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>)),'
+ '\n])'
+ '\n'
+ '\nparam_grid = {'
+ '\n    <span class="str">"clf__C"</span>: [<span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">1</span>, <span class="num">10</span>, <span class="num">100</span>],'
+ '\n    <span class="str">"clf__penalty"</span>: [<span class="str">"l1"</span>, <span class="str">"l2"</span>],'
+ '\n    <span class="str">"clf__solver"</span>: [<span class="str">"liblinear"</span>],'
+ '\n}'
+ '\n'
+ '\ngs = <span class="fn">GridSearchCV</span>(pipe, param_grid, cv=<span class="num">5</span>, scoring=<span class="str">"f1"</span>, n_jobs=-<span class="num">1</span>)'
+ '\ngs.<span class="fn">fit</span>(X_train, y_train)'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="str">f"En iyi parametreler: {gs.best_params_}"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"En iyi CV F1: {gs.best_score_:.3f}"</span>)'
+ '\n<span class="cm"># En iyi parametreler: {\'clf__C\': 1, \'clf__penalty\': \'l2\', \'clf__solver\': \'liblinear\'}</span>'
+ '\n<span class="cm"># En iyi CV F1: 0.834</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Pipeline + GridSearchCV. Pipeline\'da adımlara isim vererek (<code>"clf"</code>) parametreleri <code>clf__C</code> sözdizimiyle erişiriz. <code>scoring="f1"</code> hyperparameter seçim metriği — f1 yerine roc_auc, accuracy de seçilebilir. <code>n_jobs=-1</code> tüm CPU çekirdeklerini kullanır. <code>gs.best_params_</code> en iyi kombinasyonu, <code>gs.best_estimator_</code> eğitilmiş final modeli verir.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Optuna ile akıllı tuning<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> optuna'
+ '\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score'
+ '\n<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier'
+ '\n'
+ '\n<span class="kw">def</span> <span class="fn">objective</span>(trial):'
+ '\n    n_est = trial.<span class="fn">suggest_int</span>(<span class="str">"n_estimators"</span>, <span class="num">50</span>, <span class="num">500</span>)'
+ '\n    max_d = trial.<span class="fn">suggest_int</span>(<span class="str">"max_depth"</span>, <span class="num">3</span>, <span class="num">20</span>)'
+ '\n    min_samples = trial.<span class="fn">suggest_int</span>(<span class="str">"min_samples_leaf"</span>, <span class="num">1</span>, <span class="num">10</span>)'
+ '\n'
+ '\n    model = <span class="fn">RandomForestClassifier</span>('
+ '\n        n_estimators=n_est, max_depth=max_d,'
+ '\n        min_samples_leaf=min_samples, random_state=<span class="num">42</span>)'
+ '\n    score = <span class="fn">cross_val_score</span>(model, X_train, y_train, cv=<span class="num">5</span>, scoring=<span class="str">"f1"</span>).<span class="fn">mean</span>()'
+ '\n    <span class="kw">return</span> score'
+ '\n'
+ '\nstudy = optuna.<span class="fn">create_study</span>(direction=<span class="str">"maximize"</span>)'
+ '\nstudy.<span class="fn">optimize</span>(objective, n_trials=<span class="num">50</span>)'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="str">f"En iyi: {study.best_value:.3f}"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"Parametreler: {study.best_params}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Optuna\'nın felsefesi: bir <em>objective fonksiyonu</em> tanımla (puan döndüren), Optuna trial\'larla en iyi parametreleri arar. <code>suggest_int</code>, <code>suggest_float</code>, <code>suggest_categorical</code> ile arama uzayını tanımlarsın. 50 deneme genelde yeterlidir; grid search 10×10×10 = 1000 deneme yapardı, Optuna 50\'sinde benzer veya daha iyi sonuca ulaşır. XGBoost, LightGBM gibi 10+ hyperparameter\'lı modellerde fark açılır.</p>'

+ '<h2 class="l-title">11. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Modeli ölçmeyi öğrendik. Şimdi modelin <em>kendisini iyileştirme</em> yöntemlerine geçiyoruz. <a href="/tutorials/ml-theory/6">Ders 6</a>: <strong>Regularization</strong>. Modeli aşırı öğrenmeden korumak için L1/L2 cezaları, Ridge, Lasso, ElasticNet, dropout. Lineer regresyon ve lojistik regresyondaki "C" hyperparametresinin ne kontrol ettiğini öğreneceksin.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Tek bir metriğin (özellikle accuracy) niye yetmediğini ve dengesiz veride nasıl yanılttığını öğrendin. Confusion matrix\'in 4 temel sayısını (TP/TN/FP/FN) ve bunlardan türeyen precision, recall, F1\'i anladın. Precision-recall trade-off\'unu ve eşik seçiminin iş bağlamına bağlı olduğunu kavradın. ROC-AUC ve log-loss ile farklı bakış açılarını gördün. Çok sınıflı problemlerde macro/weighted ortalamayı, regresyon metriklerini özetledin. Hyperparameter tuning ile model arama: Grid Search, Random Search ve Bayesian (Optuna) yaklaşımlarını öğrendin. sklearn ve Optuna ile gerçek kod yazdın.</div>'

,

en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> "My model is good" is not a single number. Choosing the right metric is what determines whether a production model succeeds. On the churn problem you might see 80% accuracy yet still miss every churner. Confusion matrix, precision, recall, F1, ROC-AUC, log-loss — when to use which. Then hyperparameter tuning — GridSearch and Optuna for finding the best model systematically.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Compute precision, recall, F1, and accuracy from a confusion matrix</li><li>Tune the precision-recall trade-off by choosing a probability threshold on churn</li><li>Plot a ROC curve and interpret AUC as ranking power</li><li>Use log-loss to score probability calibration, not just predictions</li><li>Tune a churn classifier systematically with GridSearchCV and Optuna</li></ul></div>'

+ '<h2 class="l-title">1. Why a Single Number Is Not Enough</h2>'

+ '<p class="l-text">In the churn dataset 80% stay and 20% churn — typical <em>imbalanced data</em>. A model that always says "stay" gets:</p>'

+ '<div class="calc-formula">'
+ '<div class="formula-main"><strong>Accuracy</strong> = correct / total = 80 / 100 = 80%</div>'
+ '</div>'

+ '<p class="l-text">80% accuracy yet zero churners detected. Useless to the business — we cannot identify the customers we want to retain.</p>'

+ '<p class="l-text">So we need other metrics. Which one? Depends on the problem.</p>'

+ '<h2 class="l-title">2. Confusion Matrix — The Foundation</h2>'

+ '<p class="l-text">In binary classification a model produces <strong>4 outcome types</strong>:</p>'

+ '<div class="calc-example"><div class="example-label">CONFUSION MATRIX — CHURN PREDICTION</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem"></th><th style="padding:.5rem;color:var(--accent)">Predicted: Churn</th><th style="padding:.5rem;color:var(--accent)">Predicted: Stay</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem;color:var(--accent)"><strong>Actual: Churn</strong></td><td style="text-align:center"><strong>TP</strong> (True Positive)<br><span style="color:var(--text-dim)">15</span></td><td style="text-align:center"><strong>FN</strong> (False Negative)<br><span style="color:var(--text-dim)">5</span></td></tr>'
+ '<tr><td style="padding:.5rem;color:var(--accent)"><strong>Actual: Stay</strong></td><td style="text-align:center"><strong>FP</strong> (False Positive)<br><span style="color:var(--text-dim)">10</span></td><td style="text-align:center"><strong>TN</strong> (True Negative)<br><span style="color:var(--text-dim)">70</span></td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text" style="margin-top:1rem">From this we see what kinds of errors happened. Our model caught 15 churners correctly, missed 5, falsely flagged 10 stayers as churners, and correctly identified 70 stayers.</p>'
+ '</div></div>'

+ '<ul class="l-list">'
+ '<li><strong>TP:</strong> actually churned, predicted churn ✓</li>'
+ '<li><strong>TN:</strong> actually stayed, predicted stay ✓</li>'
+ '<li><strong>FP:</strong> actually stayed, predicted churn (type-1 error — false alarm)</li>'
+ '<li><strong>FN:</strong> actually churned, predicted stay (type-2 error — missed case)</li>'
+ '</ul>'

+ '<h2 class="l-title">3. Accuracy, Precision, Recall, F1</h2>'

+ '<p class="l-text">Different metrics derive from these 4 numbers.</p>'

+ '<h3 class="l-subtitle">Accuracy</h3>'

+ '<div class="katex-block">$$\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}$$</div>'

+ '<p class="l-text">"What fraction did I get right overall?" In the example: (15+70)/100 = 85%. Useful on balanced data; misleading on imbalanced.</p>'

+ '<h3 class="l-subtitle">Precision</h3>'

+ '<div class="katex-block">$$\\text{Precision} = \\frac{TP}{TP + FP}$$</div>'

+ '<p class="l-text">"Of those I called churn, how many really churned?" In the example: 15/(15+10) = 60%. <strong>Penalises FP</strong> — care about precision when false alarms are costly.</p>'

+ '<p class="l-text"><em>Practical example:</em> spam filter — high precision; mistakenly marking real emails as spam is very costly.</p>'

+ '<h3 class="l-subtitle">Recall (Sensitivity, TPR)</h3>'

+ '<div class="katex-block">$$\\text{Recall} = \\frac{TP}{TP + FN}$$</div>'

+ '<p class="l-text">"Of all true churners, how many did I catch?" In the example: 15/(15+5) = 75%. <strong>Penalises FN</strong> — care about recall when missing a case is expensive.</p>'

+ '<p class="l-text"><em>Practical example:</em> cancer screening — high recall; missing a true patient is dangerous, while flagging a healthy person merely causes more tests.</p>'

+ '<h3 class="l-subtitle">F1 Score — Balance of Precision and Recall</h3>'

+ '<div class="katex-block">$$F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$</div>'

+ '<p class="l-text">The <strong>harmonic mean</strong> of precision and recall — not arithmetic. If one is very low, F1 is low. Example: 2·(0.6·0.75)/(0.6+0.75) = 0.667.</p>'

+ '<p class="l-text">When to use F1: as a single summary score on imbalanced data. Often the default first metric.</p>'

+ '<h2 class="l-title">4. Precision-Recall Trade-Off — Choosing the Threshold</h2>'

+ '<p class="l-text">Logistic regression (<a href="/tutorials/ml-theory/3">L3</a>) outputs a probability. Above what probability do we say "churn"? The default 0.5 is just a tunable <strong>threshold</strong>.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Lower threshold (0.3):</strong> more customers flagged "churn" → higher recall, lower precision</li>'
+ '<li><strong>Higher threshold (0.7):</strong> only confident "churn" calls → higher precision, lower recall</li>'
+ '</ul>'

+ '<p class="l-text">You cannot maximise both — that is the trade-off. Pick based on the business cost:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Tight retention budget:</strong> only target most-likely churners (high precision)</li>'
+ '<li><strong>Losing customers is very expensive:</strong> catch as many as possible (high recall)</li>'
+ '</ul>'

+ '<div class="plotly-graph"><div id="plot-prtradeoff-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var th=[];for(var i=5;i<=95;i+=5)th.push(i/100);'
+ 'var prec=th.map(function(t){return Math.min(0.95,0.3+t*0.85);});'
+ 'var rec=th.map(function(t){return Math.max(0.05,1.0-t*0.95);});'
+ 'var f1=th.map(function(t,i){return 2*prec[i]*rec[i]/(prec[i]+rec[i]);});'
+ 'var t1={x:th,y:prec,name:"Precision",type:"scatter",mode:"lines",line:{color:"rgba(78,205,196,.85)",width:3}};'
+ 'var t2={x:th,y:rec,name:"Recall",type:"scatter",mode:"lines",line:{color:"rgba(248,113,113,.85)",width:3}};'
+ 'var t3={x:th,y:f1,name:"F1",type:"scatter",mode:"lines",line:{color:T.accent,width:3,dash:"dash"}};'
+ 'var layout={xaxis:{title:"Decision threshold",color:T.text,gridcolor:T.grid},yaxis:{title:"Score",color:T.text,gridcolor:T.grid,range:[0,1.05],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.08,xanchor:"center",x:0.5}};'
+ 'if(document.getElementById("plot-prtradeoff-en"))Plotly.newPlot("plot-prtradeoff-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> As the threshold drops (left) recall rises and precision falls; as it rises (right), the opposite. F1 forms a peak somewhere in between — that is the balanced point. In practice we choose the threshold deliberately by business need; "use 0.5 by default" is usually wrong.</div>'

+ '<h2 class="l-title">5. ROC Curve and AUC</h2>'

+ '<p class="l-text">The <strong>ROC curve</strong> plots TPR (recall) against FPR for every possible threshold. AUC (area under the curve) summarises the model\'s "ranking" ability.</p>'

+ '<div class="katex-block">$$\\text{TPR} = \\frac{TP}{TP+FN} = \\text{Recall}, \\qquad \\text{FPR} = \\frac{FP}{FP+TN}$$</div>'

+ '<ul class="l-list">'
+ '<li><strong>AUC = 1.0:</strong> perfect separation.</li>'
+ '<li><strong>AUC = 0.5:</strong> random guessing (diagonal line).</li>'
+ '<li><strong>AUC = 0.7-0.9:</strong> good for many practical problems.</li>'
+ '</ul>'

+ '<p class="l-text">AUC is threshold-independent — it tells you how well the model "ranks" churners above stayers. Common when comparing two models.</p>'

+ '<div class="l-warn"><strong>Caveat:</strong> on highly imbalanced data (e.g. 1% positive class) ROC-AUC can be misleading; <strong>Precision-Recall AUC</strong> is preferred there.</div>'

+ '<h2 class="l-title">6. Log-Loss — Calibrated Probabilities</h2>'

+ '<p class="l-text">So far we looked at <em>predictions</em> (class labels). But logistic regression outputs probabilities; predicting the right class is not enough — <em>the probability itself should be calibrated</em>. <strong>Log-loss (cross-entropy)</strong>:</p>'

+ '<div class="katex-block">$$\\text{LogLoss} = -\\frac{1}{n}\\sum_{i=1}^{n}\\bigl[\\,y_i \\log \\hat{p}_i + (1-y_i)\\log(1-\\hat{p}_i)\\,\\bigr]$$</div>'

+ '<p class="l-text">If the model says "0.99 probability of churn" and the customer truly churned: log-loss is very low (good). Same prediction but the customer stayed: log-loss is very high (bad). Low log-loss = well-calibrated probabilities.</p>'

+ '<p class="l-text">For systems that emit risk scores (credit approval, disease risk, recommendation) log-loss is critical.</p>'

+ '<h2 class="l-title">7. Regression Metrics — Quick Recap</h2>'

+ '<ul class="l-list">'
+ '<li><strong>MSE:</strong> mean squared error. Heavily penalises large errors.</li>'
+ '<li><strong>RMSE:</strong> square root of MSE. In target units — easy to interpret (TL/$).</li>'
+ '<li><strong>MAE:</strong> mean absolute error. Less sensitive to outliers than MSE.</li>'
+ '<li><strong>MAPE:</strong> mean absolute percentage error. Easy to interpret as %, but blows up near y=0.</li>'
+ '<li><strong>R² (<a href="/tutorials/ml-theory/2">L2</a>):</strong> fraction of variance explained.</li>'
+ '</ul>'

+ '<h2 class="l-title">8. Multiclass Classification</h2>'

+ '<p class="l-text">Beyond binary (e.g. customer segment A/B/C/D) the confusion matrix becomes N×N. Per-class precision/recall/F1 is computed. Two strategies for an overall score:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Macro average:</strong> compute F1 per class, then average. Equal weight to all classes.</li>'
+ '<li><strong>Weighted average:</strong> per-class F1 weighted by class size. Big classes dominate.</li>'
+ '<li><strong>Micro average:</strong> sum all TP, FP, FN globally and compute one score. Usually equals accuracy.</li>'
+ '</ul>'

+ '<p class="l-text">For imbalanced classes <strong>macro F1</strong> is fairest — it values small classes too.</p>'

+ '<h2 class="l-title">9. Hyperparameter Tuning — Finding the Best Model</h2>'

+ '<p class="l-text">Model parameters are learned during training (weights). <strong>Hyperparameters</strong> are chosen by <em>us</em> before training — polynomial degree, regularisation strength (C), kNN\'s k, max_depth, etc. Finding the right values is <em>hyperparameter tuning</em>.</p>'

+ '<h3 class="l-subtitle">Method 1: Grid Search</h3>'

+ '<p class="l-text">Define a list of values for each hyperparameter; try every combination. Simple, exhaustive, but combinatorially explosive.</p>'

+ '<div class="calc-example"><div class="example-label">GRID SEARCH EXAMPLE</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7">'
+ 'C ∈ {0.01, 0.1, 1, 10, 100}'
+ '<br>penalty ∈ {"l1", "l2"}'
+ '<br>= 5 × 2 = <strong>10 combinations</strong>'
+ '</p>'
+ '<p class="l-text">Evaluate each combination with 5-fold CV → 50 model trainings. The highest CV score wins.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Method 2: Random Search</h3>'

+ '<p class="l-text">Instead of all combinations, sample <em>n</em> random ones (e.g. 50). In high-dimensional hyperparameter spaces this is more efficient than grid — Bergstra & Bengio (2012) proved this.</p>'

+ '<h3 class="l-subtitle">Method 3: Bayesian Optimisation (Optuna)</h3>'

+ '<p class="l-text">Learns from past trials to decide what to try next. Reaches good results with far fewer trials. <strong>Optuna</strong> is the most popular tool in Python; almost standard for complex models like XGBoost.</p>'

+ '<h2 class="l-title">10. Python — All Metrics + Tuning</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Detailed metrics with classification_report<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report, confusion_matrix, roc_auc_score, log_loss'
+ '\n'
+ '\ny_pred = model.<span class="fn">predict</span>(X_test)'
+ '\ny_proba = model.<span class="fn">predict_proba</span>(X_test)[:, <span class="num">1</span>]'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="fn">confusion_matrix</span>(y_test, y_pred))'
+ '\n<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, y_pred,'
+ '\n      target_names=[<span class="str">"stay"</span>, <span class="str">"churn"</span>]))'
+ '\n<span class="fn">print</span>(<span class="str">f"ROC-AUC: {roc_auc_score(y_test, y_proba):.3f}"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"LogLoss: {log_loss(y_test, y_proba):.3f}"</span>)'
+ '\n<span class="cm">#               precision  recall  f1-score</span>'
+ '\n<span class="cm">#  stay          0.93       0.88    0.90</span>'
+ '\n<span class="cm">#  churn         0.60       0.75    0.67</span>'
+ '\n<span class="cm">#  macro avg     0.77       0.81    0.78</span>'
+ '\n<span class="cm"># ROC-AUC: 0.879</span>'
+ '\n<span class="cm"># LogLoss: 0.413</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> <code>classification_report</code> dumps precision/recall/F1 per class plus macro/weighted averages in one table. ROC-AUC uses <em>probabilities</em> (predict_proba, not predict) since ranking matters. Log-loss also uses probabilities. The "churn" row stands out: precision 0.60, recall 0.75. The model catches 75% of churners, but only 60% of those it calls "churn" really are — lowering the threshold raises recall further if the business prefers it.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> GridSearchCV tuning<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline'
+ '\n'
+ '\npipe = <span class="fn">Pipeline</span>(['
+ '\n    (<span class="str">"scaler"</span>, <span class="fn">StandardScaler</span>()),'
+ '\n    (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>)),'
+ '\n])'
+ '\n'
+ '\nparam_grid = {'
+ '\n    <span class="str">"clf__C"</span>: [<span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">1</span>, <span class="num">10</span>, <span class="num">100</span>],'
+ '\n    <span class="str">"clf__penalty"</span>: [<span class="str">"l1"</span>, <span class="str">"l2"</span>],'
+ '\n    <span class="str">"clf__solver"</span>: [<span class="str">"liblinear"</span>],'
+ '\n}'
+ '\n'
+ '\ngs = <span class="fn">GridSearchCV</span>(pipe, param_grid, cv=<span class="num">5</span>, scoring=<span class="str">"f1"</span>, n_jobs=-<span class="num">1</span>)'
+ '\ngs.<span class="fn">fit</span>(X_train, y_train)'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="str">f"Best params: {gs.best_params_}"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"Best CV F1: {gs.best_score_:.3f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Pipeline + GridSearchCV. By naming pipeline steps (<code>"clf"</code>) we access parameters via the <code>clf__C</code> syntax. <code>scoring="f1"</code> drives the choice — could also be roc_auc, accuracy. <code>n_jobs=-1</code> uses all CPU cores. <code>gs.best_params_</code> gives the winning combination, <code>gs.best_estimator_</code> gives the trained final model.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Smart tuning with Optuna<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> optuna'
+ '\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score'
+ '\n<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier'
+ '\n'
+ '\n<span class="kw">def</span> <span class="fn">objective</span>(trial):'
+ '\n    n_est = trial.<span class="fn">suggest_int</span>(<span class="str">"n_estimators"</span>, <span class="num">50</span>, <span class="num">500</span>)'
+ '\n    max_d = trial.<span class="fn">suggest_int</span>(<span class="str">"max_depth"</span>, <span class="num">3</span>, <span class="num">20</span>)'
+ '\n    min_samples = trial.<span class="fn">suggest_int</span>(<span class="str">"min_samples_leaf"</span>, <span class="num">1</span>, <span class="num">10</span>)'
+ '\n'
+ '\n    model = <span class="fn">RandomForestClassifier</span>('
+ '\n        n_estimators=n_est, max_depth=max_d,'
+ '\n        min_samples_leaf=min_samples, random_state=<span class="num">42</span>)'
+ '\n    score = <span class="fn">cross_val_score</span>(model, X_train, y_train, cv=<span class="num">5</span>, scoring=<span class="str">"f1"</span>).<span class="fn">mean</span>()'
+ '\n    <span class="kw">return</span> score'
+ '\n'
+ '\nstudy = optuna.<span class="fn">create_study</span>(direction=<span class="str">"maximize"</span>)'
+ '\nstudy.<span class="fn">optimize</span>(objective, n_trials=<span class="num">50</span>)'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="str">f"Best: {study.best_value:.3f}"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"Params: {study.best_params}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Optuna\'s philosophy: define an <em>objective function</em> (returns a score), and Optuna searches for the best parameters across trials. <code>suggest_int</code>, <code>suggest_float</code>, <code>suggest_categorical</code> define the search space. 50 trials are usually enough; grid search would take 10×10×10 = 1000 trials, Optuna reaches comparable or better in 50. The gap widens for models like XGBoost / LightGBM with 10+ hyperparameters.</p>'

+ '<h2 class="l-title">11. What\'s Next</h2>'

+ '<p class="l-text">We learned to measure models. Now we move to <em>improving them</em>. <a href="/tutorials/ml-theory/6">Lesson 6</a>: <strong>Regularisation</strong>. L1/L2 penalties, Ridge, Lasso, ElasticNet, dropout — keeping models from overfitting. You will learn what the "C" hyperparameter in linear/logistic regression really controls.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> Why a single metric (accuracy in particular) is not enough and how it misleads on imbalanced data. The 4 base counts of the confusion matrix (TP/TN/FP/FN) and the metrics derived from them: precision, recall, F1. The precision-recall trade-off and that the threshold should be chosen by business cost. ROC-AUC and log-loss as alternative views. Macro/weighted averages in multiclass, and a recap of regression metrics. Hyperparameter tuning across Grid Search, Random Search, and Bayesian (Optuna) approaches. Real code with sklearn and Optuna.</div>'

};
