/* ml-L10.js — ML Theory Lesson 10: Özellik Mühendisliği & Dengesiz Veri (TR + EN) */
var ML_L10 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Veri bilim çalışmalarının %70\'inin geçtiği yer: <strong>özellik mühendisliği</strong>. Eksik değer doldurma, scaling, encoding (one-hot/target), polinom etkileşimleri, log dönüşümleri. Plus dengesiz veri ile mücadele: SMOTE, class weights, threshold tuning. "Daha iyi model değil daha iyi özellik kazanır" — bu derste niye olduğunu anlayacaksın.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Eksik değerleri SimpleImputer/KNNImputer ile mantıklı doldurma yapacaksın</li><li>StandardScaler, MinMaxScaler ve RobustScaler\'ı uygun veriyle eşleştireceksin</li><li>Kategorik özellikleri one-hot ve target encoding ile sayısala çevireceksin</li><li>Log/Box-Cox dönüşümüyle çarpık dağılımı düzleştireceksin</li><li>SMOTE, class_weight ve eşik ayarıyla dengesiz churn verisinde recall yükselteceksin</li></ul></div>'

+ '<h2 class="l-title">1. Niye Özellik Mühendisliği?</h2>'

+ '<p class="l-text">Bir Kaggle yarışması düşün: 10.000 takım aynı modeli kullanıyor — XGBoost veya LightGBM. Hyperparametreler ayarlıyor. Aralarındaki fark genelde model değil; <strong>kim hangi özellikleri yarattı</strong>. İlk 100\'e girenlerin sırrı genelde özellik mühendisliğidir.</p>'

+ '<p class="l-text">"Müşteri kayıp" örneğinde ham veri 30 sütun olabilir. Ama:</p>'

+ '<ul class="l-list">'
+ '<li>Yaş + sözleşme süresi → "kullanım süresi / yaş oranı" (yeni türev özellik)</li>'
+ '<li>Aylık ücret + toplam ücret → "ortalama fatura" (öğrencilerin/emeklilerin farklı bütçesi)</li>'
+ '<li>Çağrı geçmişi → "son 30 gün çağrı sayısı" (en taze sinyal)</li>'
+ '</ul>'

+ '<p class="l-text">Bu türev özellikler ham 30 sütundan daha bilgili olabilir. Model burada vurguyu yakalar.</p>'

+ '<h2 class="l-title">2. Eksik Değer Doldurma (Imputation)</h2>'

+ '<p class="l-text">Gerçek veri her zaman eksiklerle gelir: kullanıcı yaş alanını boş bırakmış, sensör çevrimdışı, kayıt güncellenmemiş. <code>NaN</code> değerler model eğitiminde hata verir. Birkaç strateji:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Mean / Median:</strong> Sayısal sütunda eksik değeri ortalama/medyan ile doldur. Hızlı, basit. Aykırılıklara dayanıklı olduğu için medyan tercihen.</li>'
+ '<li><strong>Mode:</strong> Kategorik sütunda en sık değeri kullan.</li>'
+ '<li><strong>Domain default:</strong> "Eksik = 0" (örn. çağrı sayısı eksikse 0 olabilir). Domain bilgisi gerek.</li>'
+ '<li><strong>Forward/backward fill:</strong> Zaman serisinde önceki/sonraki değer.</li>'
+ '<li><strong>kNN imputer:</strong> Eksik noktanın benzer komşularının ortalamasını kullan. Daha akıllı.</li>'
+ '<li><strong>Iterative (MICE):</strong> Diğer sütunları kullanarak eksik değeri tahmin eden bir mini-model. En sofistike.</li>'
+ '</ul>'

+ '<div class="l-warn"><strong>Önemli:</strong> "Eksik" bilgi de bilgidir. Ek bir <em>"X_was_missing"</em> bayrak sütunu oluşturmak çoğu zaman yararlıdır — özellikle eksiklik rastgele değilse (MNAR — missing not at random).</div>'

+ '<h2 class="l-title">3. Scaling — Ölçeklendirme</h2>'

+ '<p class="l-text">Yaş 0-100 arası, aylık ücret 0-1000 arası. Bu farklı ölçekler bazı algoritmalar için sorun:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Mesafe tabanlı (kNN, k-Means, SVM):</strong> Büyük ölçekli özellik mesafeye baskın olur. Scaling şart.</li>'
+ '<li><strong>Gradyan tabanlı (lojistik regresyon, sinir ağları):</strong> Yakınsama hızlanır. Scaling tavsiye.</li>'
+ '<li><strong>Ağaç tabanlı (Random Forest, XGBoost):</strong> Eşik bazlı bölme yaptıkları için ölçeğe duyarsız. Scaling gerekmez.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Yöntem 1: StandardScaler (z-score)</h3>'

+ '<div class="katex-block">$$x_{\\text{scaled}} = \\frac{x - \\mu}{\\sigma}$$</div>'

+ '<p class="l-text">Her özelliği ortalama 0, varyans 1\'e dönüştürür. En yaygın. Aykırılıklara duyarlı.</p>'

+ '<h3 class="l-subtitle">Yöntem 2: MinMaxScaler</h3>'

+ '<div class="katex-block">$$x_{\\text{scaled}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}$$</div>'

+ '<p class="l-text">[0, 1] aralığına sıkıştırır. Sınır değerleri sabit aralıkta tutmak istediğinde (resim pikselleri 0-1) iyi.</p>'

+ '<h3 class="l-subtitle">Yöntem 3: RobustScaler</h3>'

+ '<p class="l-text">Ortalama yerine medyan, std yerine IQR (interquartile range) kullanır. Aykırılıklı verilere dayanıklı.</p>'

+ '<div class="l-warn"><strong>Sızıntı tehlikesi (<a href="/tutorials/ai/ml/generalization-bias-variance">L4</a>):</strong> Scaler\'ı sadece <em>train</em> setinde fit et. Test\'i train\'in istatistikleriyle transform et. Pipeline kullanırsan otomatik halleder.</div>'

+ '<h2 class="l-title">4. Encoding — Kategorik Özellikler</h2>'

+ '<p class="l-text">Sözleşme tipi: "Aylık" / "1 yıl" / "2 yıl" — model bunları sayı olarak ister. Çevirme yöntemleri:</p>'

+ '<h3 class="l-subtitle">Label Encoding</h3>'

+ '<p class="l-text">Her kategoriye bir sayı: Aylık=0, 1 yıl=1, 2 yıl=2. <strong>Sıralı kategorilerde kullan</strong> (small/medium/large gibi). Sıralı olmayan kategoride ("kırmızı"/"yeşil"/"mavi") yapay sıralama yaratır — yanıltıcı.</p>'

+ '<h3 class="l-subtitle">One-Hot Encoding</h3>'

+ '<p class="l-text">Her kategori için ayrı bir sütun, 0/1 değerli. <em>n</em> kategori = <em>n</em> sütun. Kategoriler az ise (n<10) iyi. Çok ise boyut patlar.</p>'

+ '<div class="calc-example"><div class="example-label">SÖZLEŞME TİPİ — ONE-HOT</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="padding:.5rem;color:var(--accent)">Müşteri</th><th style="padding:.5rem">Aylık</th><th style="padding:.5rem">1 yıl</th><th style="padding:.5rem">2 yıl</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">M1 (aylık)</td><td style="text-align:center">1</td><td style="text-align:center">0</td><td style="text-align:center">0</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">M3 (2 yıl)</td><td style="text-align:center">0</td><td style="text-align:center">0</td><td style="text-align:center">1</td></tr>'
+ '<tr><td style="padding:.4rem">M5 (1 yıl)</td><td style="text-align:center">0</td><td style="text-align:center">1</td><td style="text-align:center">0</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Target Encoding</h3>'

+ '<p class="l-text">Yüksek kardinaliteli kategoriler için (örn. 5000 farklı şehir). Her kategoriyi <em>o kategorideki ortalama hedef değer</em> ile değiştir.</p>'

+ '<p class="l-text">Örnek: "İstanbul" şehrinde müşterilerin %18\'i kayıp gitmiş → İstanbul = 0.18. "Ankara" için %12 → Ankara = 0.12. Tek sütun, anlamlı bilgi.</p>'

+ '<div class="l-warn"><strong>Sızıntı tuzağı:</strong> Target encoding doğrudan yapılırsa hedef sızıntısı olur. Çözüm: cross-validation içinde uygula (her fold için ayrı encoding). Veya Bayes smoothing kullan.</div>'

+ '<h3 class="l-subtitle">Diğer encoding\'ler</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Frequency encoding:</strong> Kategori = o kategorinin sıklığı.</li>'
+ '<li><strong>Hash encoding:</strong> Yüksek kardinalitede sabit boyutlu hash\'lere indirgeme.</li>'
+ '<li><strong>Embedding (DL):</strong> Sinir ağı her kategori için bir vektör öğrenir.</li>'
+ '</ul>'

+ '<h2 class="l-title">5. Türev Özellikler — En Yaratıcı Kısım</h2>'

+ '<p class="l-text">Var olan özelliklerden yenilerini türetmek. Domain bilgisi burada kritiktir.</p>'

+ '<h3 class="l-subtitle">Aritmetik kombinasyonlar</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Oran:</strong> aylık ücret / yaş, toplam ücret / süre</li>'
+ '<li><strong>Çarpma:</strong> yaş × aylık ücret (etkileşim)</li>'
+ '<li><strong>Fark:</strong> bu ay - geçen ay (trend)</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Tarih/zaman özellikleri</h3>'

+ '<p class="l-text">Bir tarihten birçok özellik türetilir: ay, gün, hafta günü, hafta sonu mu, yılın günü, mevsim, son satın almadan beri geçen gün... Her biri farklı sinyal taşır.</p>'

+ '<h3 class="l-subtitle">Aggregations (gruplama)</h3>'

+ '<p class="l-text">"Müşterinin son 30 günde toplam çağrı sayısı", "aynı bölgedeki müşterilerin ortalama kaybı" — domaine özel agregeler güçlü.</p>'

+ '<h3 class="l-subtitle">Polinom / etkileşim özellikleri</h3>'

+ '<p class="l-text">sklearn\'in <code>PolynomialFeatures(degree=2, interaction_only=True)</code> tüm ikili çarpımları otomatik üretir. Ağaç tabanlı modeller etkileşimleri kendi öğrenir; ama lineer modeller için manuel ekleme şart.</p>'

+ '<h2 class="l-title">6. Log/Box-Cox Dönüşümü</h2>'

+ '<p class="l-text">Bazı sayısal değişkenler <strong>çarpık (skewed)</strong> dağılır: aylık ücret çoğu müşteride 50-200 TL ama bir-iki müşteri 5000 TL. Bu çarpıklık hem outlier sorunu yaratır hem normal dağılım varsayan modelleri kötü etkiler.</p>'

+ '<p class="l-text">Çözüm: <strong>log dönüşümü</strong>:</p>'

+ '<div class="katex-block">$$x_{\\text{log}} = \\log(1 + x)$$</div>'

+ '<p class="l-text">5000 değeri 8.5\'e düşer; 50 değeri 3.9\'a. Çarpık dağılım daha simetrik olur.</p>'

+ '<p class="l-text"><strong>Box-Cox dönüşümü</strong> daha genel — λ parametresine göre log\'dan kareköke kadar bir aile. <code>sklearn.preprocessing.PowerTransformer</code> otomatik en iyi λ\'yı bulur.</p>'

+ '<h2 class="l-title">7. Dengesiz Veri Sorunu</h2>'

+ '<p class="l-text">Müşteri kayıp veri setinde tipik dağılım: %85 kalan, %15 kayıp. Bu <strong>dengesiz</strong>. Daha kötü senaryolar:</p>'

+ '<ul class="l-list">'
+ '<li>Dolandırıcılık tespiti: %0.1 dolandırıcı, %99.9 normal.</li>'
+ '<li>Nadir hastalık tanısı: %0.01 hasta.</li>'
+ '<li>Üretimde kusur tespiti: %2 kusurlu.</li>'
+ '</ul>'

+ '<p class="l-text">Bu durumda model "hep çoğunluğa söyle" stratejisini öğrenir. Accuracy %99.9 görünür ama bir tek dolandırıcılığı bile yakalayamaz. <a href="/tutorials/ai/ml/evaluation-hyperparameter-tuning">Ders 5</a>\'te gördük; çözüm ne?</p>'

+ '<h2 class="l-title">8. Dört Çözüm: Resampling, Class Weights, Threshold</h2>'

+ '<h3 class="l-subtitle">Çözüm 1: Oversampling — SMOTE</h3>'

+ '<p class="l-text"><strong>SMOTE (Synthetic Minority Oversampling Technique)</strong>: azınlık sınıftan <em>yapay yeni örnekler</em> üret. Mantık: iki gerçek azınlık örneğinin arasında yeni bir noktayı interpolasyonla yarat.</p>'

+ '<div class="katex-block">$$\\mathbf{x}_{\\text{new}} = \\mathbf{x}_i + \\delta \\cdot (\\mathbf{x}_j - \\mathbf{x}_i), \\quad \\delta \\sim U(0, 1)$$</div>'

+ '<p class="l-text">Bu, azınlık sınıfı eğitim setinde "büyütür". Sonuç: dengeli bir dağılım. Modelin azınlık örneklerini ciddiye alması sağlanır.</p>'

+ '<p class="l-text">Varyantları: Borderline-SMOTE (sadece sınır noktalarında yeni örnek), ADASYN (zor sınıflandırılan azınlık örneklerine odaklan).</p>'

+ '<h3 class="l-subtitle">Çözüm 2: Undersampling</h3>'

+ '<p class="l-text">Çoğunluk sınıfından rastgele örnek <em>çıkar</em>. Veri kaybı var ama çok büyük veride pratik. <strong>Tomek Links</strong> ve <strong>NearMiss</strong> daha akıllı undersampling teknikleri.</p>'

+ '<h3 class="l-subtitle">Çözüm 3: Class Weights</h3>'

+ '<p class="l-text">Veriyi değiştirmek yerine, kayıp fonksiyonuna ağırlık ver. Azınlık sınıfta hata yapmak <em>k</em> kat daha pahalı. sklearn modellerinde <code>class_weight="balanced"</code> ile otomatik:</p>'

+ '<div class="katex-block">$$w_k = \\frac{n}{K \\cdot n_k}$$</div>'

+ '<p class="l-text">n: toplam örnek, K: sınıf sayısı, n<sub>k</sub>: k. sınıfın örnek sayısı. Sonuç: tüm sınıflar dengeli ağırlıkta.</p>'

+ '<h3 class="l-subtitle">Çözüm 4: Threshold Tuning</h3>'

+ '<p class="l-text">Modeli olduğu gibi eğit, ama karar eşiğini değiştir. Varsayılan 0.5 yerine 0.3 yaparsan azınlık sınıfı daha sık tahmin edilir. Recall artar, precision düşer. <a href="/tutorials/ai/ml/evaluation-hyperparameter-tuning">L5</a>\'te gördüğümüz precision-recall trade-off.</p>'

+ '<div class="plotly-graph"><div id="plot-imb-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var methods=["Hiçbir şey","Class weights","SMOTE","Threshold tuning","Class weights + threshold"];'
+ 'var f1_minor=[0.45,0.62,0.68,0.65,0.74];'
+ 'var t1={x:methods,y:f1_minor,type:"bar",marker:{color:T.accent},text:f1_minor.map(function(v){return (v*100).toFixed(0)+"%";}),textposition:"outside"};'
+ 'var layout={title:{text:"Dengesiz veri çözümleri — azınlık F1",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{title:"Azınlık sınıfı F1",color:T.text,gridcolor:T.grid,range:[0.3,0.85],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:90,l:60}};'
+ 'if(document.getElementById("plot-imb-tr"))Plotly.newPlot("plot-imb-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Aynı dengesiz veri setinde farklı çözümler ve azınlık sınıfı F1 skoru. Hiçbir şey yapmamak %45 verir. Class weights tek başına büyük sıçrama (+%17). SMOTE benzer kazanım. En iyi: class weights + threshold tuning kombinasyonu (%74). Genel kural — birden çok yöntem birleştirildiğinde sonuç daha güçlü.</div>'

+ '<h2 class="l-title">9. Python — sklearn ColumnTransformer ile Tüm Pipeline</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Sayısal + kategorik özellikler birlikte<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.compose <span class="kw">import</span> ColumnTransformer'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler, OneHotEncoder'
+ '\n<span class="kw">from</span> sklearn.impute <span class="kw">import</span> SimpleImputer'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n'
+ '\n<span class="cm"># Sayısal sütunlar için: eksik = medyan, sonra scale</span>'
+ '\nnumeric_cols = [<span class="str">"yas"</span>, <span class="str">"aylik_ucret"</span>, <span class="str">"sure"</span>]'
+ '\nnumeric_pipe = <span class="fn">Pipeline</span>(['
+ '\n    (<span class="str">"impute"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"median"</span>)),'
+ '\n    (<span class="str">"scale"</span>, <span class="fn">StandardScaler</span>()),'
+ '\n])'
+ '\n'
+ '\n<span class="cm"># Kategorik sütunlar için: eksik = en sık, sonra one-hot</span>'
+ '\ncategorical_cols = [<span class="str">"sozlesme_tipi"</span>, <span class="str">"odeme_yontemi"</span>]'
+ '\ncategorical_pipe = <span class="fn">Pipeline</span>(['
+ '\n    (<span class="str">"impute"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"most_frequent"</span>)),'
+ '\n    (<span class="str">"onehot"</span>, <span class="fn">OneHotEncoder</span>(handle_unknown=<span class="str">"ignore"</span>)),'
+ '\n])'
+ '\n'
+ '\n<span class="cm"># Tüm sütunları birleştir</span>'
+ '\npreprocessor = <span class="fn">ColumnTransformer</span>(transformers=['
+ '\n    (<span class="str">"num"</span>, numeric_pipe, numeric_cols),'
+ '\n    (<span class="str">"cat"</span>, categorical_pipe, categorical_cols),'
+ '\n])'
+ '\n'
+ '\n<span class="cm"># Final pipeline</span>'
+ '\nfull_pipe = <span class="fn">Pipeline</span>(['
+ '\n    (<span class="str">"prep"</span>, preprocessor),'
+ '\n    (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(class_weight=<span class="str">"balanced"</span>, max_iter=<span class="num">1000</span>)),'
+ '\n])'
+ '\n'
+ '\nfull_pipe.<span class="fn">fit</span>(X_train, y_train)'
+ '\n<span class="fn">print</span>(<span class="str">f"Test F1: {full_pipe.score(X_test, y_test):.3f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Profesyonel bir önişleme pipeline\'ı. <code>ColumnTransformer</code> sayısal ve kategorik sütunlara farklı dönüşümler uygular paralel. Her sütun grubu kendi pipeline\'ını alır: önce eksik doldurma, sonra scaling/encoding. <code>handle_unknown="ignore"</code> test setinde train\'de görülmemiş kategoriler için güvenli (sıfır vektörü döner). En sona <code>class_weight="balanced"</code> ile dengesizlik tek satırda halledildi.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> SMOTE ile dengesizlik fix\'i<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> imblearn.over_sampling <span class="kw">import</span> SMOTE'
+ '\n<span class="kw">from</span> imblearn.pipeline <span class="kw">import</span> Pipeline <span class="kw">as</span> ImbPipeline'
+ '\n'
+ '\n<span class="cm"># NOT: imblearn\'in pipeline\'ı kullan — SMOTE\'u sadece train\'e uygulasın</span>'
+ '\npipe = <span class="fn">ImbPipeline</span>(['
+ '\n    (<span class="str">"prep"</span>, preprocessor),'
+ '\n    (<span class="str">"smote"</span>, <span class="fn">SMOTE</span>(random_state=<span class="num">42</span>)),'
+ '\n    (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>)),'
+ '\n])'
+ '\n'
+ '\npipe.<span class="fn">fit</span>(X_train, y_train)'
+ '\n<span class="fn">print</span>(pipe.<span class="fn">score</span>(X_test, y_test))'
+ '\n<span class="cm"># SMOTE sadece eğitim sırasında uygulanır, test seti dokunulmaz</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> <code>imblearn</code> kütüphanesinin <code>ImbPipeline</code>\'ı sklearn\'inkine benzer ama SMOTE gibi resampling adımlarını <em>sadece eğitim sırasında</em> uygular — test setine dokunmaz. Bu, sızıntıyı engellemek için kritik. Standart sklearn pipeline\'ı kullanırsan SMOTE test setinde de uygulanır, sonuçlar yanıltıcı olur.</p>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Modeli ve veriyi en iyi haline getirdik. Şimdi son aşamaya: <em>üretime nasıl çıkarırız?</em> <a href="/tutorials/ai/ml/mlops-production">Ders 11</a>: <strong>MLOps & Üretim</strong>. sklearn Pipeline serileştirme, REST API, izleme, model drift, CI/CD, A/B testleri. Eğitilmiş bir modelin gerçek değeri burada yatar.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Veri biliminin %70\'ini oluşturan özellik mühendisliğinin değerini öğrendin. Eksik değer doldurmanın 6 stratejisini, scaling türlerini (Standard/MinMax/Robust) ve hangi algoritmaların scaling gerektirdiğini gördün. Encoding yöntemlerini (Label, One-Hot, Target, Frequency) ve ne zaman hangisini kullanacağını öğrendin. Türev özelliklerin (oran, çarpım, tarih/zaman, agregeler) yaratıcı gücünü kavradın. Log/Box-Cox dönüşümü ile çarpık dağılımları nasıl ehlileştireceğini öğrendin. Dengesiz veri probleminin önemini ve dört çözüm yöntemini (SMOTE, undersampling, class weights, threshold) gördün. sklearn ColumnTransformer ile profesyonel pipeline\'lar yazdın.</div>'

,

en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> Where 70% of data-science work happens: <strong>feature engineering</strong>. Imputation, scaling, encoding (one-hot/target), polynomial interactions, log transforms. Plus fighting imbalanced data: SMOTE, class weights, threshold tuning. "Better features beat better models" — this lesson shows you why.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Impute missing values with SimpleImputer and KNNImputer</li><li>Match StandardScaler, MinMaxScaler, and RobustScaler to data shape</li><li>Encode categorical features with one-hot and target encoding</li><li>Tame skewed distributions with log and Box-Cox transforms</li><li>Boost recall on imbalanced churn with SMOTE, class weights, and threshold tuning</li></ul></div>'

+ '<h2 class="l-title">1. Why Feature Engineering?</h2>'

+ '<p class="l-text">Picture a Kaggle competition: 10,000 teams using the same model — XGBoost or LightGBM. They all tune hyperparameters. The difference is rarely the model; it is <strong>who created what features</strong>. Top-100 finishers usually win on feature engineering.</p>'

+ '<p class="l-text">In our churn example raw data may be 30 columns. But:</p>'

+ '<ul class="l-list">'
+ '<li>Age + tenure → "tenure-to-age ratio" (new derived feature)</li>'
+ '<li>Monthly fee + total fee → "average billing" (different age groups have different budgets)</li>'
+ '<li>Call history → "call count in last 30 days" (most recent signal)</li>'
+ '</ul>'

+ '<p class="l-text">These derived features can be more informative than the original 30. The model picks up the right emphasis.</p>'

+ '<h2 class="l-title">2. Missing-Value Imputation</h2>'

+ '<p class="l-text">Real data always has missing values: a user left age blank, a sensor went offline, a record was not updated. <code>NaN</code> values break model training. Strategies:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Mean / Median:</strong> fill numeric columns. Median preferred — robust to outliers.</li>'
+ '<li><strong>Mode:</strong> for categorical columns, use the most frequent value.</li>'
+ '<li><strong>Domain default:</strong> "missing = 0" (e.g. call count missing = 0 calls). Requires domain knowledge.</li>'
+ '<li><strong>Forward/backward fill:</strong> in time series, use previous/next value.</li>'
+ '<li><strong>kNN imputer:</strong> use the average of nearest similar rows.</li>'
+ '<li><strong>Iterative (MICE):</strong> a mini-model that predicts missing values from the other columns. Most sophisticated.</li>'
+ '</ul>'

+ '<div class="l-warn"><strong>Important:</strong> "missingness" is information too. Adding a flag column <em>"X_was_missing"</em> often helps, especially when missingness is not random (MNAR — missing not at random).</div>'

+ '<h2 class="l-title">3. Scaling</h2>'

+ '<p class="l-text">Age 0-100, monthly fee 0-1000. These different scales are a problem for some algorithms:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Distance-based (kNN, k-Means, SVM):</strong> the larger-scale feature dominates the distance. Scaling required.</li>'
+ '<li><strong>Gradient-based (logistic regression, neural nets):</strong> faster convergence with scaling. Recommended.</li>'
+ '<li><strong>Tree-based (Random Forest, XGBoost):</strong> threshold splits, scale-invariant. No scaling needed.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Method 1: StandardScaler (z-score)</h3>'

+ '<div class="katex-block">$$x_{\\text{scaled}} = \\frac{x - \\mu}{\\sigma}$$</div>'

+ '<p class="l-text">Each feature → mean 0, variance 1. Most common. Outlier-sensitive.</p>'

+ '<h3 class="l-subtitle">Method 2: MinMaxScaler</h3>'

+ '<div class="katex-block">$$x_{\\text{scaled}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}$$</div>'

+ '<p class="l-text">Squashes to [0, 1]. Good when fixed range matters (image pixels).</p>'

+ '<h3 class="l-subtitle">Method 3: RobustScaler</h3>'

+ '<p class="l-text">Uses median instead of mean and IQR instead of std. Robust to outliers.</p>'

+ '<div class="l-warn"><strong>Leakage warning (<a href="/tutorials/ai/ml/generalization-bias-variance">L4</a>):</strong> fit the scaler only on the <em>train</em> set; transform test using train\'s statistics. Pipelines handle this automatically.</div>'

+ '<h2 class="l-title">4. Encoding — Categorical Features</h2>'

+ '<p class="l-text">Contract type: "Monthly" / "1-year" / "2-year" — the model wants numbers. Encoding methods:</p>'

+ '<h3 class="l-subtitle">Label Encoding</h3>'

+ '<p class="l-text">Each category gets a number: Monthly=0, 1-year=1, 2-year=2. <strong>Use only for ordered categories</strong> (small/medium/large). For unordered ("red"/"green"/"blue") it invents a fake ordering — misleading.</p>'

+ '<h3 class="l-subtitle">One-Hot Encoding</h3>'

+ '<p class="l-text">A separate 0/1 column per category. <em>n</em> categories = <em>n</em> columns. Good for few categories (n<10). Many categories explodes the dimension.</p>'

+ '<div class="calc-example"><div class="example-label">CONTRACT TYPE — ONE-HOT</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="padding:.5rem;color:var(--accent)">Customer</th><th style="padding:.5rem">Monthly</th><th style="padding:.5rem">1-year</th><th style="padding:.5rem">2-year</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">C1 (monthly)</td><td style="text-align:center">1</td><td style="text-align:center">0</td><td style="text-align:center">0</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">C3 (2-year)</td><td style="text-align:center">0</td><td style="text-align:center">0</td><td style="text-align:center">1</td></tr>'
+ '<tr><td style="padding:.4rem">C5 (1-year)</td><td style="text-align:center">0</td><td style="text-align:center">1</td><td style="text-align:center">0</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Target Encoding</h3>'

+ '<p class="l-text">For high-cardinality categories (e.g. 5,000 different cities). Replace each category with the <em>average target value</em> in that category.</p>'

+ '<p class="l-text">Example: in "Istanbul" 18% of customers churned → Istanbul = 0.18. In "Ankara" 12% → Ankara = 0.12. One column, meaningful info.</p>'

+ '<div class="l-warn"><strong>Leakage trap:</strong> done naïvely, target encoding leaks the target. Apply it inside cross-validation (separate encoding per fold). Or use Bayesian smoothing.</div>'

+ '<h3 class="l-subtitle">Other encodings</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Frequency encoding:</strong> category = its own frequency.</li>'
+ '<li><strong>Hash encoding:</strong> reduces high-cardinality to fixed-size hashes.</li>'
+ '<li><strong>Embeddings (DL):</strong> a neural net learns a vector for each category.</li>'
+ '</ul>'

+ '<h2 class="l-title">5. Derived Features — The Most Creative Part</h2>'

+ '<p class="l-text">Derive new features from existing ones. Domain knowledge is critical here.</p>'

+ '<h3 class="l-subtitle">Arithmetic combinations</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Ratios:</strong> monthly fee / age, total fee / tenure</li>'
+ '<li><strong>Products:</strong> age × monthly fee (interaction)</li>'
+ '<li><strong>Differences:</strong> this month − last month (trend)</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Date/time features</h3>'

+ '<p class="l-text">From a timestamp derive many: month, day, weekday, is_weekend, day_of_year, season, days since last purchase. Each carries different signal.</p>'

+ '<h3 class="l-subtitle">Aggregations</h3>'

+ '<p class="l-text">"Total calls in last 30 days", "average churn rate in customer\'s region" — domain-specific aggregates are powerful.</p>'

+ '<h3 class="l-subtitle">Polynomial / interaction features</h3>'

+ '<p class="l-text">sklearn\'s <code>PolynomialFeatures(degree=2, interaction_only=True)</code> auto-generates all pairwise products. Tree models learn interactions on their own; for linear models you need to add them manually.</p>'

+ '<h2 class="l-title">6. Log / Box-Cox Transforms</h2>'

+ '<p class="l-text">Some numeric variables are <strong>skewed</strong>: most customers pay $50-200/month, but a few pay $5,000. Skewness creates outlier issues and hurts models that assume normality.</p>'

+ '<p class="l-text">Fix: <strong>log transform</strong>:</p>'

+ '<div class="katex-block">$$x_{\\text{log}} = \\log(1 + x)$$</div>'

+ '<p class="l-text">5,000 → 8.5; 50 → 3.9. Skew flattens, distribution becomes more symmetric.</p>'

+ '<p class="l-text"><strong>Box-Cox</strong> is more general — a parameterised family from log to square root via λ. <code>sklearn.preprocessing.PowerTransformer</code> finds the best λ automatically.</p>'

+ '<h2 class="l-title">7. The Imbalanced-Data Problem</h2>'

+ '<p class="l-text">Typical churn dataset: 85% stay, 15% churn. <strong>Imbalanced</strong>. Worse cases:</p>'

+ '<ul class="l-list">'
+ '<li>Fraud detection: 0.1% fraud, 99.9% normal.</li>'
+ '<li>Rare disease diagnosis: 0.01% positive.</li>'
+ '<li>Defect detection: 2% defective.</li>'
+ '</ul>'

+ '<p class="l-text">In such cases the model learns "always predict majority". Accuracy looks like 99.9% but it catches no fraud at all. We saw this in <a href="/tutorials/ai/ml/evaluation-hyperparameter-tuning">Lesson 5</a>; what to do?</p>'

+ '<h2 class="l-title">8. Four Fixes: Resampling, Class Weights, Threshold</h2>'

+ '<h3 class="l-subtitle">Fix 1: Oversampling — SMOTE</h3>'

+ '<p class="l-text"><strong>SMOTE (Synthetic Minority Oversampling Technique)</strong>: generate <em>synthetic new examples</em> of the minority class. Logic: interpolate between two real minority points to create a new one.</p>'

+ '<div class="katex-block">$$\\mathbf{x}_{\\text{new}} = \\mathbf{x}_i + \\delta \\cdot (\\mathbf{x}_j - \\mathbf{x}_i), \\quad \\delta \\sim U(0, 1)$$</div>'

+ '<p class="l-text">This "grows" the minority in the training set. The result is a balanced distribution and the model takes minority examples seriously.</p>'

+ '<p class="l-text">Variants: Borderline-SMOTE (only at decision borders), ADASYN (focuses on hard-to-classify minority points).</p>'

+ '<h3 class="l-subtitle">Fix 2: Undersampling</h3>'

+ '<p class="l-text">Randomly <em>drop</em> majority examples. Loses data but is practical on very large data. <strong>Tomek Links</strong> and <strong>NearMiss</strong> are smarter undersampling techniques.</p>'

+ '<h3 class="l-subtitle">Fix 3: Class Weights</h3>'

+ '<p class="l-text">Instead of changing data, weight the loss. Errors on the minority class cost <em>k</em>x more. In sklearn most models have <code>class_weight="balanced"</code> for this:</p>'

+ '<div class="katex-block">$$w_k = \\frac{n}{K \\cdot n_k}$$</div>'

+ '<p class="l-text">n: total examples, K: number of classes, n<sub>k</sub>: examples in class k. Result: all classes are equally weighted.</p>'

+ '<h3 class="l-subtitle">Fix 4: Threshold Tuning</h3>'

+ '<p class="l-text">Train as usual, but lower the decision threshold. Default 0.5 → 0.3 makes the minority class predicted more often. Recall goes up, precision down — the precision-recall trade-off from <a href="/tutorials/ai/ml/evaluation-hyperparameter-tuning">L5</a>.</p>'

+ '<div class="plotly-graph"><div id="plot-imb-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var methods=["Nothing","Class weights","SMOTE","Threshold tuning","Class weights + threshold"];'
+ 'var f1_minor=[0.45,0.62,0.68,0.65,0.74];'
+ 'var t1={x:methods,y:f1_minor,type:"bar",marker:{color:T.accent},text:f1_minor.map(function(v){return (v*100).toFixed(0)+"%";}),textposition:"outside"};'
+ 'var layout={title:{text:"Imbalanced data fixes — minority F1",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{title:"Minority class F1",color:T.text,gridcolor:T.grid,range:[0.3,0.85],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:90,l:60}};'
+ 'if(document.getElementById("plot-imb-en"))Plotly.newPlot("plot-imb-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Different fixes on the same imbalanced dataset and minority-class F1. Doing nothing yields 45%. Class weights alone give a big jump (+17%). SMOTE comparable. The best is class weights + threshold tuning combined (74%). General rule — combining multiple methods tends to win.</div>'

+ '<h2 class="l-title">9. Python — Full Pipeline with sklearn ColumnTransformer</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Numeric + categorical features together<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.compose <span class="kw">import</span> ColumnTransformer'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler, OneHotEncoder'
+ '\n<span class="kw">from</span> sklearn.impute <span class="kw">import</span> SimpleImputer'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n'
+ '\n<span class="cm"># Numeric: median imputation + scaling</span>'
+ '\nnumeric_cols = [<span class="str">"age"</span>, <span class="str">"monthly_fee"</span>, <span class="str">"tenure"</span>]'
+ '\nnumeric_pipe = <span class="fn">Pipeline</span>(['
+ '\n    (<span class="str">"impute"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"median"</span>)),'
+ '\n    (<span class="str">"scale"</span>, <span class="fn">StandardScaler</span>()),'
+ '\n])'
+ '\n'
+ '\n<span class="cm"># Categorical: most-frequent imputation + one-hot</span>'
+ '\ncategorical_cols = [<span class="str">"contract_type"</span>, <span class="str">"payment_method"</span>]'
+ '\ncategorical_pipe = <span class="fn">Pipeline</span>(['
+ '\n    (<span class="str">"impute"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"most_frequent"</span>)),'
+ '\n    (<span class="str">"onehot"</span>, <span class="fn">OneHotEncoder</span>(handle_unknown=<span class="str">"ignore"</span>)),'
+ '\n])'
+ '\n'
+ '\n<span class="cm"># Combine all columns</span>'
+ '\npreprocessor = <span class="fn">ColumnTransformer</span>(transformers=['
+ '\n    (<span class="str">"num"</span>, numeric_pipe, numeric_cols),'
+ '\n    (<span class="str">"cat"</span>, categorical_pipe, categorical_cols),'
+ '\n])'
+ '\n'
+ '\n<span class="cm"># Final pipeline</span>'
+ '\nfull_pipe = <span class="fn">Pipeline</span>(['
+ '\n    (<span class="str">"prep"</span>, preprocessor),'
+ '\n    (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(class_weight=<span class="str">"balanced"</span>, max_iter=<span class="num">1000</span>)),'
+ '\n])'
+ '\n'
+ '\nfull_pipe.<span class="fn">fit</span>(X_train, y_train)'
+ '\n<span class="fn">print</span>(<span class="str">f"Test F1: {full_pipe.score(X_test, y_test):.3f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> A professional preprocessing pipeline. <code>ColumnTransformer</code> applies different transforms to numeric and categorical columns in parallel. Each column group gets its own pipeline: imputation, then scaling/encoding. <code>handle_unknown="ignore"</code> safely handles unseen categories at test time (returns a zero vector). Adding <code>class_weight="balanced"</code> at the end addresses imbalance in one line.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> SMOTE for imbalance<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> imblearn.over_sampling <span class="kw">import</span> SMOTE'
+ '\n<span class="kw">from</span> imblearn.pipeline <span class="kw">import</span> Pipeline <span class="kw">as</span> ImbPipeline'
+ '\n'
+ '\n<span class="cm"># NOTE: use imblearn\'s pipeline so SMOTE is applied to train only</span>'
+ '\npipe = <span class="fn">ImbPipeline</span>(['
+ '\n    (<span class="str">"prep"</span>, preprocessor),'
+ '\n    (<span class="str">"smote"</span>, <span class="fn">SMOTE</span>(random_state=<span class="num">42</span>)),'
+ '\n    (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>)),'
+ '\n])'
+ '\n'
+ '\npipe.<span class="fn">fit</span>(X_train, y_train)'
+ '\n<span class="fn">print</span>(pipe.<span class="fn">score</span>(X_test, y_test))'
+ '\n<span class="cm"># SMOTE applied at fit time only; test set is untouched</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> The <code>imblearn</code> library\'s <code>ImbPipeline</code> mirrors sklearn\'s but applies resampling steps like SMOTE <em>only during training</em> — never to the test set. Critical for preventing leakage. Using a regular sklearn pipeline would apply SMOTE to test as well, giving misleading results.</p>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">We have polished both model and data. Now the final stage: <em>how do we deploy?</em> <a href="/tutorials/ai/ml/mlops-production">Lesson 11</a>: <strong>MLOps & Production</strong>. sklearn pipeline serialisation, REST APIs, monitoring, model drift, CI/CD, A/B testing. The bedrock of a trained model\'s real value.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> The value of feature engineering, which makes up 70% of data-science work. Six imputation strategies and how missingness itself can be informative. Scaling types (Standard/MinMax/Robust) and which algorithms require them. Encoding methods (Label, One-Hot, Target, Frequency) and when to use each. The creative power of derived features (ratios, products, date/time, aggregations). Log/Box-Cox transforms for taming skewed distributions. The imbalanced-data problem and four fixes (SMOTE, undersampling, class weights, threshold tuning). Real ColumnTransformer pipelines with sklearn.</div>'

};
