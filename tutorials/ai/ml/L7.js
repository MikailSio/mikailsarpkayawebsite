/* ml-L7.js — ML Theory Lesson 7: Karar Ağaçları & Ensemble — XGBoost (TR + EN) */
var ML_L7 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Tablo verisinde gerçek dünyanın en güçlü ML aileyle tanışma: <strong>karar ağaçları ve ensemble yöntemleri</strong>. Tek bir karar ağacının sezgisinden başlayıp, Random Forest ile "kalabalığın bilgeliğine", sonra Gradient Boosting ve XGBoost\'un dünya rekorları kıran mimarisine geçeceğiz. Müşteri kayıp tahmini için XGBoost neden ilk seçim — bu derste anlayacaksın.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Bir karar ağacını bilgi kazancı (Gini, entropy) ile böleceksin</li><li>Bagging ile Random Forest\'in tek ağacın varyansını nasıl kırdığını göstereceksin</li><li>Gradient Boosting\'in artık üzerinde ardışık ağaç eğittiğini çıkaracaksın</li><li>XGBoost, LightGBM ve CatBoost\'u hız ve kategorik desteği açısından karşılaştıracaksın</li><li>XGBoost ile churn modeli eğitip feature importance ile en önemli özellikleri sıralayacaksın</li></ul></div>'

+ '<h2 class="l-title">1. Lineer Modellerin Sınırı</h2>'

+ '<p class="l-text">Lineer regresyon ve lojistik regresyon (L2, L3) güçlü ama bir varsayımları var: özellikler ile hedef arasında <em>doğrusal</em> bir ilişki. Gerçek dünyada bu çoğu zaman tutmaz.</p>'

+ '<div class="calc-example"><div class="example-label">LINEER OLMAYAN ÖRÜNTÜ</div><div class="example-body">'
+ '<p class="l-text">Müşteri kayıp problemini düşün:</p>'
+ '<ul class="l-list">'
+ '<li>Aylık ücret düşük + uzun süre → kalır.</li>'
+ '<li>Aylık ücret yüksek + kısa süre → kayıp.</li>'
+ '<li>Aylık ücret düşük + kısa süre → genelde kalır (zaten yeni müşteri).</li>'
+ '<li>Aylık ücret yüksek + uzun süre → genelde kalır (sadık müşteri).</li>'
+ '</ul>'
+ '<p class="l-text">Bu bir <em>etkileşim</em>: sadece ücret veya sadece süre değil, ikisinin birleşimi önemli. Lojistik regresyon bunu doğal yakalayamaz; biz polinom genişletme yapmazsak. Karar ağaçları ise <strong>etkileşimleri otomatik öğrenir</strong>.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Karar Ağacı — Sezgi</h2>'

+ '<p class="l-text">Bir karar ağacı, veriyi <strong>art arda evet/hayır soruları</strong>yla bölen bir akış şemasıdır. Her iç düğüm bir özellik üzerinde bir eşik (örneğin "süre &lt; 12 mi?"); her yaprak bir tahmin (örneğin "%85 kayıp olasılığı").</p>'

+ '<div class="calc-example"><div class="example-label">KAYIP TAHMİNİ KARAR AĞACI (sezgisel)</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7">'
+ '┌─ <strong>Süre &lt; 12 ay?</strong>'
+ '<br>│   ├─ Evet ─▶ <strong>Aylık ücret > 150?</strong>'
+ '<br>│   │   ├─ Evet ─▶ <span style="color:var(--accent)">KAYIP</span> (%92)'
+ '<br>│   │   └─ Hayır ─▶ <span style="color:var(--accent)">KAYIP</span> (%65)'
+ '<br>│   └─ Hayır ─▶ <strong>Sözleşme tipi?</strong>'
+ '<br>│       ├─ Aylık ─▶ <span style="color:var(--accent)">KAYIP</span> (%55)'
+ '<br>│       └─ 1+ yıl ─▶ <span style="color:var(--accent)">KALAN</span> (%88)'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Avantajlar: yorumlanabilir (her karar görünür), lineer olmayan, özellik ölçeğine duyarsız (scaling gerekmez), kategorik özellikleri doğal işler. Bu özellikler tablo verisinde değer taşır.</p>'

+ '<h2 class="l-title">3. Karar Ağacı Nasıl Eğitilir? — Bilgi Kazancı</h2>'

+ '<p class="l-text">Ağacın "iyi sorular" sorması nasıl öğrenir? Algoritma her düğümde şu soruyu sorar: <em>"Hangi özellik + hangi eşikte böl ki, alt-gruplar daha saf olsun?"</em></p>'

+ '<p class="l-text">"Saflık" iki yaygın metrikten biriyle ölçülür:</p>'

+ '<h3 class="l-subtitle">Gini impurity</h3>'

+ '<div class="katex-block">$$\\text{Gini} = 1 - \\sum_{k=1}^{K} p_k^2$$</div>'

+ '<p class="l-text"><em>p<sub>k</sub></em>: o düğümdeki <em>k</em>. sınıfın oranı. Gini = 0 saf düğüm (tüm örnekler aynı sınıf); Gini = 0.5 ikili sınıflandırmada en kötü (50/50 karışım).</p>'

+ '<h3 class="l-subtitle">Entropi</h3>'

+ '<div class="katex-block">$$H = -\\sum_{k=1}^{K} p_k \\log_2 p_k$$</div>'

+ '<p class="l-text">Bilgi teorisinden gelir. Entropi = 0 saf; ikili sınıflandırmada en yüksek 1 (50/50). Pratikte Gini ile entropi çok yakın sonuçlar verir, hangisi seçilse fark etmez.</p>'

+ '<h3 class="l-subtitle">Information Gain — bölmeyi seçme</h3>'

+ '<p class="l-text">Bir bölmenin "iyi" olduğunu nasıl ölçeriz? Bölme öncesi impurity ile bölme sonrası ağırlıklı impurity arasındaki fark:</p>'

+ '<div class="katex-block">$$\\text{IG} = H_{\\text{parent}} - \\sum_{i \\in \\text{children}} \\frac{n_i}{n} \\cdot H_i$$</div>'

+ '<p class="l-text">Algoritma her özelliğin her olası eşiğini deneyip en yüksek IG\'i veren bölmeyi seçer. <strong>Açgözlü</strong> (greedy) yaklaşım — her adımda en iyi adımı al, geriye dönüş yok.</p>'

+ '<h2 class="l-title">4. Karar Ağacının Zayıflıkları</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Overfit eğilimi:</strong> Yeterince derinleşirse her noktayı kendi yaprağına koyar. Eğitim setinde mükemmel, test setinde berbat.</li>'
+ '<li><strong>Yüksek varyans:</strong> Eğitim verisi biraz değişirse ağaç tamamen farklı olabilir.</li>'
+ '<li><strong>Eksen-paralel sınırlar:</strong> Sadece tek tek özellik üzerinde böler; çapraz desenleri yakalamak için derinleşmesi gerekir.</li>'
+ '</ul>'

+ '<p class="l-text">Çözüm: <strong>tek ağaç değil, çok ağaç</strong>. İşte ensemble yöntemleri burada devreye girer.</p>'

+ '<h2 class="l-title">5. Bagging & Random Forest — Kalabalığın Bilgeliği</h2>'

+ '<p class="l-text"><strong>Bagging (Bootstrap Aggregating)</strong>: aynı algoritmayı (karar ağacını) birden çok kez farklı veri alt-örneklerinde eğit, sonuçları birleştir.</p>'

+ '<ol class="l-list">'
+ '<li>Eğitim setinden bootstrap örneklemeyle (yerine koyarak rastgele seçim) <em>B</em> adet alt-set üret. (Örn. B=100 ağaç için 100 alt-set.)</li>'
+ '<li>Her alt-set\'te bir karar ağacı eğit.</li>'
+ '<li>Tahmin için: <em>B</em> ağacın oylamasını/ortalamasını al.</li>'
+ '</ol>'

+ '<p class="l-text"><strong>Random Forest</strong> bagging\'in iyileştirilmiş hali: her bölmede <em>tüm özelliklerden değil</em>, rastgele bir alt-küme seçer. Bu, ağaçların birbirinden daha bağımsız olmasını sağlar — daha güçlü ensemble.</p>'

+ '<div class="katex-block">$$\\hat{y}_{\\text{RF}}(\\mathbf{x}) = \\frac{1}{B} \\sum_{b=1}^{B} \\hat{y}_b(\\mathbf{x})$$</div>'

+ '<p class="l-text">Niye işe yarar? Tek ağacın yüksek varyansı vardı. <em>B</em> bağımsız ağacın ortalaması <em>B</em> kat varyans azaltır. Bias hafif artar ama varyans çok düşer — net etki: daha iyi genelleme.</p>'

+ '<div class="l-note"><strong>Pratik:</strong> Random Forest neredeyse her zaman tek karar ağacından iyidir. Hyperparametre ayarlamadan bile makul sonuç verir. <code>n_estimators=100</code> tipik başlangıç.</div>'

+ '<h2 class="l-title">6. Boosting — Hatadan Öğrenmek</h2>'

+ '<p class="l-text">Bagging ağaçları paralel ve bağımsız eğitir. <strong>Boosting</strong> farklı: ağaçları <em>sırayla</em> ekler, her yeni ağaç önceki ağaçların <em>hatalarını</em> düzeltmeye odaklanır.</p>'

+ '<div class="calc-example"><div class="example-label">BOOSTING SEZGISI</div><div class="example-body">'
+ '<ol class="l-list">'
+ '<li>Ağaç 1\'i eğit. Bazı örnekleri yanlış sınıflandırır.</li>'
+ '<li>Yanlış örneklere daha fazla ağırlık ver. Ağaç 2\'yi bu ağırlıklı veride eğit.</li>'
+ '<li>Ağaç 2 hâlâ yanlış olanlara odaklanır.</li>'
+ '<li>... Bunu yüzlerce kez tekrar et.</li>'
+ '<li>Final tahmin = ağaçların ağırlıklı oylaması.</li>'
+ '</ol>'
+ '<p class="l-text">Sonuç: tek başına zayıf "öğreniciler" (sığ ağaçlar) toplandığında çok güçlü bir model olur.</p>'
+ '</div></div>'

+ '<p class="l-text">İlk popüler boosting algoritması <strong>AdaBoost</strong> (1995). Ama günümüzde <strong>Gradient Boosting</strong> ve özellikle XGBoost taht sahibidir.</p>'

+ '<h2 class="l-title">7. Gradient Boosting — Matematiğin Kalbi</h2>'

+ '<p class="l-text">Gradient Boosting şu fikre dayanır: kayıp fonksiyonunu adım adım minimize et, her adımda kayıp gradyanına yaklaşan yeni bir ağaç ekle.</p>'

+ '<div class="katex-block">$$F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\eta \\cdot h_m(\\mathbf{x})$$</div>'

+ '<p class="l-text">Burada:</p>'

+ '<ul class="l-list">'
+ '<li><em>F<sub>m-1</sub></em>: önceki <em>m-1</em> ağacın birikmiş tahmini</li>'
+ '<li><em>h<sub>m</sub></em>: yeni eklenen ağaç (kayıp gradyanına yaklaşmaya çalışır)</li>'
+ '<li><em>η</em>: öğrenme oranı (genelde 0.01-0.3)</li>'
+ '</ul>'

+ '<p class="l-text">Yeni ağaç <em>h<sub>m</sub></em> "rezidüye" (gerçek - şimdiki tahmin) uydurulur — yani önceki modelin hatalarını öğrenir. Pseudo-rezidü:</p>'

+ '<div class="katex-block">$$r_i^{(m)} = -\\left[ \\frac{\\partial \\mathcal{L}(y_i, F(\\mathbf{x}_i))}{\\partial F(\\mathbf{x}_i)} \\right]_{F = F_{m-1}}$$</div>'

+ '<p class="l-text">Bu, <em>fonksiyon uzayında gradyan iniş</em>tir: ağırlık vektörü değil, fonksiyonun kendisi adım adım iyileşir.</p>'

+ '<h2 class="l-title">8. XGBoost / LightGBM / CatBoost</h2>'

+ '<p class="l-text">Modern Gradient Boosting kütüphaneleri:</p>'

+ '<ul class="l-list">'
+ '<li><strong>XGBoost (2014):</strong> Performans sıçraması — paralel ağaç bölme, akıllı eksik değer işleme, GPU desteği. Kaggle yarışmalarında 2014-2018 dönemini domine etti.</li>'
+ '<li><strong>LightGBM (2017, Microsoft):</strong> Daha hızlı (histogram tabanlı bölme, leaf-wise growth). Çok büyük verilerde XGBoost\'tan 5-10x hızlı.</li>'
+ '<li><strong>CatBoost (2017, Yandex):</strong> Kategorik özellikleri doğal işlemede özellikle iyi. One-hot encoding\'e çok ihtiyacın olmaz.</li>'
+ '</ul>'

+ '<p class="l-text">Üçü de aynı temel matematiği paylaşır; farklar mühendislik ve detaylarda. Pratikte: önce XGBoost dene, çok yavaşsa LightGBM\'e geç.</p>'

+ '<h2 class="l-title">9. Önemli Hyperparametreler</h2>'

+ '<ul class="l-list">'
+ '<li><strong>n_estimators (ağaç sayısı):</strong> 100-1000. Çok artırma — early stopping kullan.</li>'
+ '<li><strong>max_depth:</strong> 3-8. Derin ağaçlar daha esnek ama overfit\'e eğilimli. XGBoost\'ta sıkça 6.</li>'
+ '<li><strong>learning_rate (eta):</strong> 0.01-0.3. Düşük eta = daha çok ağaç gerekir ama daha iyi genelleme.</li>'
+ '<li><strong>subsample:</strong> 0.7-1.0. Her ağaç için verinin yüzde kaçı kullanılır. <1 olursa stochastic gradient boosting.</li>'
+ '<li><strong>colsample_bytree:</strong> 0.6-1.0. Her ağaç için kaç özellik kullanılır.</li>'
+ '<li><strong>reg_alpha (L1) / reg_lambda (L2):</strong> Regularization güçleri.</li>'
+ '</ul>'

+ '<h2 class="l-title">10. Feature Importance — Hangi Özellik Önemli?</h2>'

+ '<p class="l-text">Ensemble modeller "kara kutu" olabilir ama <strong>feature importance</strong> ile en azından özelliklerin göreli önemini bilebiliriz. Bir özelliğin önemi: tüm ağaçlardaki bölmelerde toplam IG\'inin toplamı (ya da gain).</p>'

+ '<div class="plotly-graph"><div id="plot-fi-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var f=["sözleşme süresi","aylık ücret","yaş","kullanım türü","ödeme yöntemi","cinsiyet"];'
+ 'var imp=[0.42,0.28,0.15,0.09,0.04,0.02];'
+ 'var t1={x:imp,y:f,type:"bar",orientation:"h",marker:{color:T.accent},text:imp.map(function(v){return (v*100).toFixed(0)+"%";}),textposition:"outside"};'
+ 'var layout={title:{text:"XGBoost feature importance — kayıp tahmini",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickformat:".0%"},yaxis:{color:T.text,gridcolor:T.grid,automargin:true},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:60,b:60,l:140}};'
+ 'if(document.getElementById("plot-fi-tr"))Plotly.newPlot("plot-fi-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> XGBoost müşteri kayıp veri setinde feature importance üretti. "Sözleşme süresi" en büyük belirleyici — uzun sözleşmeli müşteriler kalıyor. "Aylık ücret" ikinci. "Cinsiyet" neredeyse hiç bilgi taşımıyor — modelden çıkarsan kalite düşmez.</div>'

+ '<p class="l-text">Daha güvenilir bir alternatif: <strong>SHAP değerleri</strong>. Her tahmin için her özelliğin katkısını oyun teorisi temelli olarak hesaplar. Detaylı yorumlanabilirlik için altın standart.</p>'

+ '<h2 class="l-title">11. Python — XGBoost ile Müşteri Kayıp Tahmini</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Random Forest baseline<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier'
+ '\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report'
+ '\n'
+ '\nrf = <span class="fn">RandomForestClassifier</span>('
+ '\n    n_estimators=<span class="num">100</span>,'
+ '\n    max_depth=<span class="num">8</span>,'
+ '\n    min_samples_leaf=<span class="num">5</span>,'
+ '\n    random_state=<span class="num">42</span>,'
+ '\n    n_jobs=-<span class="num">1</span>,'
+ '\n)'
+ '\nrf.<span class="fn">fit</span>(X_train, y_train)'
+ '\n<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, rf.<span class="fn">predict</span>(X_test)))</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> sklearn\'in Random Forest\'ını eğitir. <code>n_estimators=100</code> 100 ağaç, <code>max_depth=8</code> her ağaç en fazla 8 derinlikte, <code>min_samples_leaf=5</code> her yaprakta en az 5 örnek (overfit önleme). <code>n_jobs=-1</code> tüm CPU çekirdekleri paralel kullanılır.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> XGBoost — modern güç<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> xgboost <span class="kw">as</span> xgb'
+ '\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score'
+ '\n'
+ '\nmodel = xgb.<span class="fn">XGBClassifier</span>('
+ '\n    n_estimators=<span class="num">500</span>,'
+ '\n    max_depth=<span class="num">6</span>,'
+ '\n    learning_rate=<span class="num">0.1</span>,'
+ '\n    subsample=<span class="num">0.8</span>,'
+ '\n    colsample_bytree=<span class="num">0.8</span>,'
+ '\n    reg_lambda=<span class="num">1.0</span>,'
+ '\n    objective=<span class="str">"binary:logistic"</span>,'
+ '\n    eval_metric=<span class="str">"auc"</span>,'
+ '\n    early_stopping_rounds=<span class="num">20</span>,'
+ '\n    random_state=<span class="num">42</span>,'
+ '\n)'
+ '\n'
+ '\nmodel.<span class="fn">fit</span>(X_train, y_train,'
+ '\n          eval_set=[(X_val, y_val)],'
+ '\n          verbose=<span class="kw">False</span>)'
+ '\n'
+ '\ny_proba = model.<span class="fn">predict_proba</span>(X_test)[:, <span class="num">1</span>]'
+ '\n<span class="fn">print</span>(<span class="str">f"Test AUC: {roc_auc_score(y_test, y_proba):.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># Feature importance</span>'
+ '\nxgb.<span class="fn">plot_importance</span>(model, max_num_features=<span class="num">10</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> XGBoost ile sınıflandırıcı eğitir. <code>n_estimators=500</code> ama <code>early_stopping_rounds=20</code> sayesinde val performansı 20 round iyileşmezse durur — overfit önleme. <code>eval_set</code> validation verisini gösterir; her iterasyonda val AUC hesaplanır. <code>plot_importance</code> en önemli özellikleri otomatik çizer.</p>'

+ '<h2 class="l-title">12. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Denetimli öğrenmenin en güçlü ailesini öğrendik. Şimdi tamamen farklı bir alana — etiket olmadan veriden bilgi çıkarmaya — geçiyoruz. <a href="/tutorials/ai/ml/clustering">Ders 8</a>: <strong>Denetimsiz öğrenme — Clustering</strong>. k-Means, DBSCAN, hierarchical, müşteri segmentasyonu. Etiketsiz müşteri verisinde "doğal grupları" otomatik keşfetme.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Lineer modellerin sınırlarını, karar ağaçlarının lineer olmayan etkileşimleri otomatik yakaladığını öğrendin. Karar ağacının nasıl eğitildiğini (Gini, entropi, information gain) gördün. Tek ağacın overfit ve yüksek varyans sorunlarını anladın. Bagging ve Random Forest\'ın bunu çoklu ağacın oylamasıyla nasıl çözdüğünü kavradın. Boosting\'in farklı felsefesini (sıralı, hatadan öğrenme) gördün. Gradient Boosting\'in fonksiyon uzayında gradyan iniş olduğunu öğrendin. XGBoost, LightGBM, CatBoost arasındaki farkları tanıdın. Önemli hyperparametreleri ve feature importance\'ı kavradın. sklearn ve XGBoost ile gerçek kod yazdın.</div>'

,

en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> Meet the strongest ML family for tabular data: <strong>decision trees and ensemble methods</strong>. From the intuition of a single tree to Random Forest\'s "wisdom of the crowd", to Gradient Boosting and the world-record-breaking architecture of XGBoost. After this lesson you will understand why XGBoost is the first choice for problems like customer churn.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Split a decision tree node by information gain (Gini, entropy)</li><li>Show how bagging in Random Forest cuts a single tree\'s variance</li><li>Derive that Gradient Boosting fits sequential trees on residuals</li><li>Compare XGBoost, LightGBM, and CatBoost by speed and categorical support</li><li>Train an XGBoost churn model and rank top features by importance</li></ul></div>'

+ '<h2 class="l-title">1. The Limits of Linear Models</h2>'

+ '<p class="l-text">Linear and logistic regression (L2, L3) are powerful but assume a <em>linear</em> relationship between features and target. Real data often violates this.</p>'

+ '<div class="calc-example"><div class="example-label">A NON-LINEAR PATTERN</div><div class="example-body">'
+ '<p class="l-text">Consider churn:</p>'
+ '<ul class="l-list">'
+ '<li>Low fee + long tenure → stays.</li>'
+ '<li>High fee + short tenure → churns.</li>'
+ '<li>Low fee + short tenure → usually stays (just a new customer).</li>'
+ '<li>High fee + long tenure → usually stays (loyal customer).</li>'
+ '</ul>'
+ '<p class="l-text">This is an <em>interaction</em>: not just fee or tenure individually but their combination matters. Logistic regression cannot capture this without explicit polynomial expansion. Decision trees <strong>learn interactions automatically</strong>.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Decision Tree — Intuition</h2>'

+ '<p class="l-text">A decision tree is a flowchart of <strong>yes/no questions</strong>. Each internal node is a threshold on a feature ("is tenure &lt; 12?"); each leaf is a prediction ("85% churn probability").</p>'

+ '<div class="calc-example"><div class="example-label">A CHURN DECISION TREE (illustrative)</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7">'
+ '┌─ <strong>tenure &lt; 12 mo?</strong>'
+ '<br>│   ├─ Yes ─▶ <strong>monthly fee > $40?</strong>'
+ '<br>│   │   ├─ Yes ─▶ <span style="color:var(--accent)">CHURN</span> (92%)'
+ '<br>│   │   └─ No  ─▶ <span style="color:var(--accent)">CHURN</span> (65%)'
+ '<br>│   └─ No  ─▶ <strong>contract type?</strong>'
+ '<br>│       ├─ Monthly ─▶ <span style="color:var(--accent)">CHURN</span> (55%)'
+ '<br>│       └─ 1+ year ─▶ <span style="color:var(--accent)">STAY</span>  (88%)'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Pros: interpretable (every decision visible), non-linear, scale-invariant (no scaling needed), handles categorical features natively. Big advantages on tabular data.</p>'

+ '<h2 class="l-title">3. How Is a Decision Tree Trained? — Information Gain</h2>'

+ '<p class="l-text">How does the tree learn to ask "good questions"? At every node it asks: <em>"Which feature + threshold splits the data into groups that are more pure?"</em></p>'

+ '<p class="l-text">"Purity" is measured by one of two common metrics:</p>'

+ '<h3 class="l-subtitle">Gini impurity</h3>'

+ '<div class="katex-block">$$\\text{Gini} = 1 - \\sum_{k=1}^{K} p_k^2$$</div>'

+ '<p class="l-text"><em>p<sub>k</sub></em>: fraction of class <em>k</em> in the node. Gini = 0 means pure (all examples one class); Gini = 0.5 is the worst case in binary (50/50 mix).</p>'

+ '<h3 class="l-subtitle">Entropy</h3>'

+ '<div class="katex-block">$$H = -\\sum_{k=1}^{K} p_k \\log_2 p_k$$</div>'

+ '<p class="l-text">From information theory. Entropy = 0 is pure; max 1 in binary (50/50). In practice Gini and entropy give very similar results — choose either.</p>'

+ '<h3 class="l-subtitle">Information Gain — picking the split</h3>'

+ '<p class="l-text">How do we measure a split\'s "goodness"? The drop in impurity from parent to weighted children:</p>'

+ '<div class="katex-block">$$\\text{IG} = H_{\\text{parent}} - \\sum_{i \\in \\text{children}} \\frac{n_i}{n} \\cdot H_i$$</div>'

+ '<p class="l-text">The algorithm tries every threshold for every feature and picks the one with the highest IG. <strong>Greedy</strong> approach — best step at each node, no backtracking.</p>'

+ '<h2 class="l-title">4. Weaknesses of a Single Tree</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Overfit-prone:</strong> deep enough, the tree assigns each example its own leaf. Perfect on train, terrible on test.</li>'
+ '<li><strong>High variance:</strong> small changes in training data can yield a completely different tree.</li>'
+ '<li><strong>Axis-aligned splits:</strong> only one feature at a time; diagonal patterns require deep trees.</li>'
+ '</ul>'

+ '<p class="l-text">The fix: <strong>not one tree, many trees</strong>. Enter ensemble methods.</p>'

+ '<h2 class="l-title">5. Bagging & Random Forest — Wisdom of the Crowd</h2>'

+ '<p class="l-text"><strong>Bagging (Bootstrap Aggregating)</strong>: train the same algorithm (decision tree) on multiple subsamples and aggregate.</p>'

+ '<ol class="l-list">'
+ '<li>Generate <em>B</em> bootstrap samples (random with replacement) from the training set. (E.g. B=100 trees → 100 subsamples.)</li>'
+ '<li>Train one decision tree per subsample.</li>'
+ '<li>Predict by voting/averaging across the <em>B</em> trees.</li>'
+ '</ol>'

+ '<p class="l-text"><strong>Random Forest</strong> upgrades bagging: at each split, only a random subset of features is considered. This makes the trees more independent of each other — a stronger ensemble.</p>'

+ '<div class="katex-block">$$\\hat{y}_{\\text{RF}}(\\mathbf{x}) = \\frac{1}{B} \\sum_{b=1}^{B} \\hat{y}_b(\\mathbf{x})$$</div>'

+ '<p class="l-text">Why does this work? A single tree had high variance. Averaging <em>B</em> independent trees reduces variance by a factor of <em>B</em>. Bias rises slightly but variance falls more — net gain in generalisation.</p>'

+ '<div class="l-note"><strong>Practical:</strong> Random Forest almost always beats a single tree. Even without tuning it gives reasonable results. <code>n_estimators=100</code> is a typical start.</div>'

+ '<h2 class="l-title">6. Boosting — Learning from Mistakes</h2>'

+ '<p class="l-text">Bagging trains trees in parallel and independently. <strong>Boosting</strong> is different: it adds trees <em>sequentially</em>, each new tree focused on correcting previous trees\' <em>mistakes</em>.</p>'

+ '<div class="calc-example"><div class="example-label">BOOSTING INTUITION</div><div class="example-body">'
+ '<ol class="l-list">'
+ '<li>Train tree 1. Some examples are misclassified.</li>'
+ '<li>Up-weight the misclassified ones. Train tree 2 on this weighted data.</li>'
+ '<li>Tree 2 focuses on what tree 1 got wrong.</li>'
+ '<li>... repeat hundreds of times.</li>'
+ '<li>Final prediction = weighted vote of all trees.</li>'
+ '</ol>'
+ '<p class="l-text">Result: a chorus of weak learners (shallow trees) becomes a very strong model.</p>'
+ '</div></div>'

+ '<p class="l-text">The first popular boosting algorithm was <strong>AdaBoost</strong> (1995). Today the throne belongs to <strong>Gradient Boosting</strong>, especially XGBoost.</p>'

+ '<h2 class="l-title">7. Gradient Boosting — The Math at the Core</h2>'

+ '<p class="l-text">Gradient Boosting: minimise the loss step by step, each step adding a new tree that approximates the loss gradient.</p>'

+ '<div class="katex-block">$$F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\eta \\cdot h_m(\\mathbf{x})$$</div>'

+ '<p class="l-text">Where:</p>'

+ '<ul class="l-list">'
+ '<li><em>F<sub>m-1</sub></em>: cumulative prediction of the previous <em>m-1</em> trees</li>'
+ '<li><em>h<sub>m</sub></em>: the newly added tree (tries to approximate the loss gradient)</li>'
+ '<li><em>η</em>: learning rate (typically 0.01-0.3)</li>'
+ '</ul>'

+ '<p class="l-text">The new tree <em>h<sub>m</sub></em> is fit to the "residuals" (true − current prediction) — i.e. it learns the previous model\'s errors. Pseudo-residuals:</p>'

+ '<div class="katex-block">$$r_i^{(m)} = -\\left[ \\frac{\\partial \\mathcal{L}(y_i, F(\\mathbf{x}_i))}{\\partial F(\\mathbf{x}_i)} \\right]_{F = F_{m-1}}$$</div>'

+ '<p class="l-text">This is <em>gradient descent in function space</em>: not a weight vector but the function itself improves step by step.</p>'

+ '<h2 class="l-title">8. XGBoost / LightGBM / CatBoost</h2>'

+ '<p class="l-text">Modern Gradient Boosting libraries:</p>'

+ '<ul class="l-list">'
+ '<li><strong>XGBoost (2014):</strong> performance leap — parallel split finding, smart missing-value handling, GPU support. Dominated Kaggle 2014-2018.</li>'
+ '<li><strong>LightGBM (2017, Microsoft):</strong> faster (histogram-based splits, leaf-wise growth). On very large datasets 5-10x faster than XGBoost.</li>'
+ '<li><strong>CatBoost (2017, Yandex):</strong> excellent native handling of categorical features. Less need for manual one-hot encoding.</li>'
+ '</ul>'

+ '<p class="l-text">All three share the same core math; differences are engineering. In practice: try XGBoost first, switch to LightGBM if it is too slow.</p>'

+ '<h2 class="l-title">9. Key Hyperparameters</h2>'

+ '<ul class="l-list">'
+ '<li><strong>n_estimators (number of trees):</strong> 100-1000. Do not bump too high — use early stopping.</li>'
+ '<li><strong>max_depth:</strong> 3-8. Deeper trees are more flexible but overfit-prone. XGBoost default 6 is common.</li>'
+ '<li><strong>learning_rate (eta):</strong> 0.01-0.3. Smaller eta needs more trees but generalises better.</li>'
+ '<li><strong>subsample:</strong> 0.7-1.0. Fraction of data per tree. <1 gives stochastic gradient boosting.</li>'
+ '<li><strong>colsample_bytree:</strong> 0.6-1.0. Fraction of features per tree.</li>'
+ '<li><strong>reg_alpha (L1) / reg_lambda (L2):</strong> regularisation strengths.</li>'
+ '</ul>'

+ '<h2 class="l-title">10. Feature Importance — Which Feature Matters?</h2>'

+ '<p class="l-text">Ensemble models can feel like black boxes, but <strong>feature importance</strong> tells us at least the relative ranking of features. A feature\'s importance: total IG (or gain) summed across all splits in all trees.</p>'

+ '<div class="plotly-graph"><div id="plot-fi-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var f=["contract length","monthly fee","age","usage type","payment method","gender"];'
+ 'var imp=[0.42,0.28,0.15,0.09,0.04,0.02];'
+ 'var t1={x:imp,y:f,type:"bar",orientation:"h",marker:{color:T.accent},text:imp.map(function(v){return (v*100).toFixed(0)+"%";}),textposition:"outside"};'
+ 'var layout={title:{text:"XGBoost feature importance — churn prediction",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickformat:".0%"},yaxis:{color:T.text,gridcolor:T.grid,automargin:true},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:60,b:60,l:140}};'
+ 'if(document.getElementById("plot-fi-en"))Plotly.newPlot("plot-fi-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> XGBoost feature importance on the churn dataset. "Contract length" is the strongest driver — long-contract customers stay. "Monthly fee" comes second. "Gender" is nearly noise — drop it without hurting performance.</div>'

+ '<p class="l-text">A more reliable alternative: <strong>SHAP values</strong>. They compute each feature\'s contribution per prediction using game theory. The gold standard for detailed interpretability.</p>'

+ '<h2 class="l-title">11. Python — Churn Prediction with XGBoost</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Random Forest baseline<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier'
+ '\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report'
+ '\n'
+ '\nrf = <span class="fn">RandomForestClassifier</span>('
+ '\n    n_estimators=<span class="num">100</span>,'
+ '\n    max_depth=<span class="num">8</span>,'
+ '\n    min_samples_leaf=<span class="num">5</span>,'
+ '\n    random_state=<span class="num">42</span>,'
+ '\n    n_jobs=-<span class="num">1</span>,'
+ '\n)'
+ '\nrf.<span class="fn">fit</span>(X_train, y_train)'
+ '\n<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, rf.<span class="fn">predict</span>(X_test)))</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Trains sklearn\'s Random Forest. <code>n_estimators=100</code> = 100 trees, <code>max_depth=8</code> caps each tree\'s depth, <code>min_samples_leaf=5</code> requires at least 5 examples per leaf (overfit prevention). <code>n_jobs=-1</code> uses all CPU cores in parallel.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> XGBoost — modern power<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> xgboost <span class="kw">as</span> xgb'
+ '\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score'
+ '\n'
+ '\nmodel = xgb.<span class="fn">XGBClassifier</span>('
+ '\n    n_estimators=<span class="num">500</span>,'
+ '\n    max_depth=<span class="num">6</span>,'
+ '\n    learning_rate=<span class="num">0.1</span>,'
+ '\n    subsample=<span class="num">0.8</span>,'
+ '\n    colsample_bytree=<span class="num">0.8</span>,'
+ '\n    reg_lambda=<span class="num">1.0</span>,'
+ '\n    objective=<span class="str">"binary:logistic"</span>,'
+ '\n    eval_metric=<span class="str">"auc"</span>,'
+ '\n    early_stopping_rounds=<span class="num">20</span>,'
+ '\n    random_state=<span class="num">42</span>,'
+ '\n)'
+ '\n'
+ '\nmodel.<span class="fn">fit</span>(X_train, y_train,'
+ '\n          eval_set=[(X_val, y_val)],'
+ '\n          verbose=<span class="kw">False</span>)'
+ '\n'
+ '\ny_proba = model.<span class="fn">predict_proba</span>(X_test)[:, <span class="num">1</span>]'
+ '\n<span class="fn">print</span>(<span class="str">f"Test AUC: {roc_auc_score(y_test, y_proba):.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># Feature importance</span>'
+ '\nxgb.<span class="fn">plot_importance</span>(model, max_num_features=<span class="num">10</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Trains an XGBoost classifier. <code>n_estimators=500</code> but with <code>early_stopping_rounds=20</code> training stops if val performance does not improve for 20 rounds — overfit prevention. <code>eval_set</code> provides validation data; val AUC is computed at every iteration. <code>plot_importance</code> auto-plots the most important features.</p>'

+ '<h2 class="l-title">12. What\'s Next</h2>'

+ '<p class="l-text">We have learned the strongest family of supervised learning. Now to a different territory — extracting structure from data without labels. <a href="/tutorials/ai/ml/clustering">Lesson 8</a>: <strong>unsupervised learning — clustering</strong>. k-Means, DBSCAN, hierarchical, customer segmentation. Discovering "natural groups" in unlabelled customer data.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> The limits of linear models, and how decision trees automatically capture non-linear interactions. How a tree is trained (Gini, entropy, information gain). The overfit and high-variance problems of single trees. How bagging and Random Forest solve them by averaging multiple trees. The different philosophy of boosting (sequential, learn from errors). Gradient Boosting as gradient descent in function space. Differences between XGBoost, LightGBM, CatBoost. Important hyperparameters and feature importance. Real code in sklearn and XGBoost.</div>'

};
