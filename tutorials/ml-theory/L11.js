/* ml-L11.js — ML Theory Lesson 11: MLOps & Üretim (TR + EN) */
var ML_L11 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> 10 ders boyunca model eğittik. Ama bir model defterde değil, <em>üretimde</em> değer üretir. Bu son ders MLOps\'un (ML + DevOps) temellerini işliyor: pipeline serileştirme, REST API ile servis, model izleme, drift tespiti, A/B testleri, CI/CD. Müşteri kayıp modelinizi laboratuvardan canlı sisteme nasıl taşıyacağınızı baştan sona göreceksiniz.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Bir sklearn pipeline\'ını joblib ile sürümleyip diske yazacaksın</li><li>FastAPI ile churn modelinin REST endpoint\'ini canlı yayınlayacaksın</li><li>PSI (Population Stability Index) ile veri drift\'ini ölçeceksin</li><li>İki model arasında A/B test kurup istatistiksel anlamlılığı değerlendireceksin</li><li>SHAP değerleriyle modelin tahminlerini birey bazında açıklayacaksın</li></ul></div>'

+ '<h2 class="l-title">1. MLOps Nedir, Niye Önemlidir?</h2>'

+ '<p class="l-text"><strong>MLOps</strong>, ML modellerini üretime alma, çalıştırma, izleme, güncelleme süreçlerinin disiplinidir. DevOps\'un ML\'e uyarlanması gibi düşünebilirsin.</p>'

+ '<p class="l-text">Veri biliminin meşhur sırrı: <em>"Bir Jupyter notebook\'taki model üretim koduyla aynı şey değildir."</em> Lab\'de %92 F1 alan model üretimde:</p>'

+ '<ul class="l-list">'
+ '<li>Yanlış sıra ile veri alır.</li>'
+ '<li>Eksik değerlerle başa çıkamaz.</li>'
+ '<li>Veri dağılımı değişince tahminleri bozulur.</li>'
+ '<li>Yüksek trafikte gecikir/çöker.</li>'
+ '<li>Hatalarını fark etmen aylar sürebilir.</li>'
+ '</ul>'

+ '<p class="l-text">MLOps bu sorunları sistematik çözer. Üretim ML\'i kuran bir mühendisin %50 zamanı buraya gider.</p>'

+ '<h2 class="l-title">2. Modeli Serileştirme — Diske Yazma</h2>'

+ '<p class="l-text">Eğitilmiş model bir Python objesi. Onu kaydedip sonra yüklemek (servis için) gerek. İki yaygın yol:</p>'

+ '<h3 class="l-subtitle">pickle / joblib</h3>'

+ '<p class="l-text"><strong>joblib</strong> sklearn için tavsiye edilir — pickle\'dan büyük NumPy dizilerinde daha hızlı.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Model kaydet/yükle<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> joblib'
+ '\n'
+ '\n<span class="cm"># Eğitilmiş pipeline\'ı diske yaz</span>'
+ '\njoblib.<span class="fn">dump</span>(pipeline, <span class="str">"churn_model.joblib"</span>)'
+ '\n<span class="cm"># Dosya boyutu: birkaç KB - birkaç MB</span>'
+ '\n'
+ '\n<span class="cm"># Yükle</span>'
+ '\nmodel = joblib.<span class="fn">load</span>(<span class="str">"churn_model.joblib"</span>)'
+ '\nprediction = model.<span class="fn">predict</span>(new_customer_data)'
+ '\n'
+ '\n<span class="cm"># DİKKAT: pickle güvenlik riski. Tanımadığın kaynaklardan model yüklemeyin.</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> joblib pipeline\'ın tamamını (preprocessor + model) tek dosyaya serileştirir. Üretimde bu dosyayı yüklersin, aynı önişlemeyi alıp tahmini yaparsın. Pipeline\'ı kaydetmek kritik: ham veriyi alıp doğrudan tahmin verir, manuel scaling/encoding hatası olmaz.</p>'

+ '<h3 class="l-subtitle">ONNX / PMML</h3>'

+ '<p class="l-text">Python bağımlılığından kurtulmak için <strong>ONNX</strong> (Open Neural Network Exchange) modeli dile-bağımsız bir formatta saklar. C++/Java/JS\'den çağırabilirsin. Mobile uygulamalar veya gömülü cihazlar için kritik.</p>'

+ '<h2 class="l-title">3. Servis Mimarileri</h2>'

+ '<p class="l-text">Modeli nasıl çalıştırırsın? Uygulamaya göre üç ana yaklaşım:</p>'

+ '<h3 class="l-subtitle">Yaklaşım 1: Batch Tahmin</h3>'

+ '<p class="l-text">Her gece tüm müşterilerin kayıp olasılığını hesapla, sonuçları DB\'ye yaz. Pazarlama ekibi sabah o tabloyu okur. Avantajları: hesaplama ucuz (büyük batch), basit. Dezavantajı: gerçek zamanlı değil — yeni gelen müşteri için 24 saat beklenir.</p>'

+ '<h3 class="l-subtitle">Yaklaşım 2: REST API</h3>'

+ '<p class="l-text">FastAPI/Flask ile bir web servis yaz. İstek geldiğinde model çağırır, anlık cevap döner. Standart yaklaşım, çoğu ürün için yeterli.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> FastAPI ile model servisi<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI'
+ '\n<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel'
+ '\n<span class="kw">from</span> pandas <span class="kw">import</span> DataFrame'
+ '\n<span class="kw">import</span> joblib'
+ '\n'
+ '\napp = <span class="fn">FastAPI</span>()'
+ '\nmodel = joblib.<span class="fn">load</span>(<span class="str">"churn_model.joblib"</span>)'
+ '\n'
+ '\n<span class="kw">class</span> Customer(BaseModel):'
+ '\n    age: <span class="kw">int</span>'
+ '\n    monthly_fee: <span class="kw">float</span>'
+ '\n    tenure: <span class="kw">int</span>'
+ '\n    contract_type: <span class="kw">str</span>'
+ '\n'
+ '\n<span class="kw">@</span>app.<span class="fn">post</span>(<span class="str">"/predict"</span>)'
+ '\n<span class="kw">def</span> <span class="fn">predict</span>(c: Customer):'
+ '\n    df = <span class="fn">DataFrame</span>([c.<span class="fn">dict</span>()])'
+ '\n    proba = model.<span class="fn">predict_proba</span>(df)[<span class="num">0</span>][<span class="num">1</span>]'
+ '\n    <span class="kw">return</span> {<span class="str">"churn_probability"</span>: <span class="fn">float</span>(proba)}'
+ '\n'
+ '\n<span class="cm"># Çalıştır: uvicorn main:app --host 0.0.0.0 --port 8000</span>'
+ '\n<span class="cm"># Test:    curl -X POST localhost:8000/predict -d \'{"age":40,"monthly_fee":150,...}\'</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> FastAPI ile 20 satırda bir tahmin servisi. <code>Customer</code> Pydantic modeli ile girdi tipi kontrolü; istek gelince DataFrame\'e çevirir, model.predict_proba ile olasılık alır, JSON döner. Production\'da Docker container\'a paketle, Kubernetes ile ölçekle.</p>'

+ '<h3 class="l-subtitle">Yaklaşım 3: Streaming / Edge</h3>'

+ '<p class="l-text">Çok düşük gecikme gerek (örn. dolandırıcılık tespiti — &lt;100ms): Kafka stream\'inden olayları tüketen bir consumer + cache\'lenmiş model. Veya tarayıcıda/telefonda çalışan ONNX/TF Lite modeli (edge inference).</p>'

+ '<h2 class="l-title">4. Model İzleme — Gerçek Tehlike</h2>'

+ '<p class="l-text">Model üretimde çalışır çalışmaz iş bitmedi. Aksine: <em>asıl iş başlar</em>. ML modellerinin sessizce bozulmasının iki ana nedeni:</p>'

+ '<h3 class="l-subtitle">Data drift (veri kayması)</h3>'

+ '<p class="l-text">Üretimde gelen verinin dağılımı eğitim verisinden farklılaşır. Örneğin:</p>'

+ '<ul class="l-list">'
+ '<li>Yeni rakip pazara girdi → müşteri profili değişti.</li>'
+ '<li>Pandemi → kullanım örüntüleri tamamen değişti.</li>'
+ '<li>Yeni ürün lansmanı → eski özellikler farklı anlamda.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Concept drift (kavram kayması)</h3>'

+ '<p class="l-text">Girdi-çıktı ilişkisi değişir. "Yüksek aylık ücretli müşteri kayıp gider" ilişkisi belki yeni rekabet ortamında değişti. Veriler aynı görünebilir ama davranış farklılaştı.</p>'

+ '<h3 class="l-subtitle">İzleme — neyi takip et?</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Tahmin dağılımı:</strong> Modelin verdiği olasılıklar nasıl dağılıyor? Aniden değişti mi?</li>'
+ '<li><strong>Özellik dağılımı:</strong> Her özelliğin ortalaması/std\'si değişti mi? KS testi, PSI metrikleri.</li>'
+ '<li><strong>Performans (etiket gelene kadar bekle):</strong> Gerçek kayıp etiketlerini gözle, F1\'i izle.</li>'
+ '<li><strong>Sistem metrikleri:</strong> gecikme, hata oranı, QPS, bellek.</li>'
+ '</ul>'

+ '<p class="l-text">Araçlar: <strong>Evidently AI</strong> (açık kaynak drift detection), <strong>Arize</strong>, <strong>WhyLabs</strong> (ticari), Prometheus + Grafana (sistem metrikleri).</p>'

+ '<h2 class="l-title">5. PSI — Population Stability Index</h2>'

+ '<p class="l-text">Drift\'i nicel ölçen klasik metrik. Bir özelliğin eğitim ile üretim dağılımları arasındaki farkı ölçer:</p>'

+ '<div class="katex-block">$$\\text{PSI} = \\sum_{i} (p_i^{\\text{prod}} - p_i^{\\text{train}}) \\cdot \\ln\\!\\left( \\frac{p_i^{\\text{prod}}}{p_i^{\\text{train}}} \\right)$$</div>'

+ '<p class="l-text">Yorum:</p>'

+ '<ul class="l-list">'
+ '<li><strong>PSI &lt; 0.1:</strong> ihmal edilebilir kayma.</li>'
+ '<li><strong>0.1 &lt; PSI &lt; 0.2:</strong> orta kayma — dikkat et.</li>'
+ '<li><strong>PSI &gt; 0.2:</strong> ciddi kayma — modeli yeniden eğit.</li>'
+ '</ul>'

+ '<p class="l-text">Bankacılıkta credit risk modellerinde PSI standardır.</p>'

+ '<h2 class="l-title">6. Yeniden Eğitim Stratejileri</h2>'

+ '<p class="l-text">Drift tespit edildiğinde ne yapmalı? Tek cevap: yeni veriyle modeli yeniden eğit.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Periyodik:</strong> Her hafta/ay otomatik yeniden eğit. Basit, güvenli.</li>'
+ '<li><strong>Tetik tabanlı:</strong> Drift metriği eşiği aşarsa eğit. Daha akıllı, kaynak tasarruflu.</li>'
+ '<li><strong>Continual learning:</strong> Her yeni örnekle modeli azar azar güncelle. Karmaşık, az kullanılır.</li>'
+ '</ul>'

+ '<p class="l-text">Yeniden eğitim yapıldığında: önce yeni model val\'da eski modelden iyi mi? Sonra A/B testte üretimde sınanır.</p>'

+ '<h2 class="l-title">7. A/B Testi — Yeni Model Daha mı İyi?</h2>'

+ '<p class="l-text">Yeni model val\'da iyi olabilir ama gerçekte iyi mi? <strong>A/B testi</strong> bunu test eder:</p>'

+ '<ol class="l-list">'
+ '<li>Trafiği iki gruba ayır: %50 eski model (kontrol), %50 yeni model (variant).</li>'
+ '<li>İş metriğini ölç: gerçek kayıp yakalama oranı, kampanya geri dönüşü, müşteri tutma.</li>'
+ '<li>İstatistiksel anlamlılık testi (t-test, mann-whitney).</li>'
+ '<li>Yeni model anlamlı şekilde iyiyse %100\'e yükselt.</li>'
+ '</ol>'

+ '<p class="l-text">Tehlike: A/B testleri 1-4 hafta sürer. Kritik karar bekleyen iş için <strong>shadow deployment</strong>: yeni model trafik alır ama tahminleri etkilemez, sadece karşılaştırma için loglanır.</p>'

+ '<h2 class="l-title">8. CI/CD for ML — Pipeline Otomasyonu</h2>'

+ '<p class="l-text">Geleneksel yazılımda CI/CD: kod değiştiğinde otomatik test + deploy. ML\'de buna iki şey daha eklenir:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Veri testleri:</strong> Yeni veri formatı uygun mu? Eksik sütun var mı? Beklenmedik değer aralığı?</li>'
+ '<li><strong>Model testleri:</strong> Yeni model eski performansı koruyor mu? Karşı-örneklerde (edge cases) tutarlı mı?</li>'
+ '</ul>'

+ '<p class="l-text">Araçlar: <strong>MLflow</strong> (deney izleme + model registry), <strong>DVC</strong> (veri versiyonlama), <strong>Kubeflow</strong> (pipeline orchestration), <strong>GitHub Actions</strong> (CI/CD).</p>'

+ '<h2 class="l-title">9. Yorumlanabilirlik & SHAP</h2>'

+ '<p class="l-text">Üretim modelleri "kara kutu" olamaz. Bir müşterinin kredisi reddedildiğinde "neden?" sorusuna cevap vermek hem etik hem yasal gereklilik (GDPR, AB AI Act).</p>'

+ '<p class="l-text"><strong>SHAP (SHapley Additive exPlanations)</strong> oyun teorisi temelli, her tahmin için her özelliğin katkısını hesaplar. <a href="/tutorials/ml-theory/7">L7</a>\'de bahsettik; pratik:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> SHAP ile model açıklama<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> shap'
+ '\n'
+ '\n<span class="cm"># XGBoost veya benzeri ağaç tabanlı model için</span>'
+ '\nexplainer = shap.<span class="fn">TreeExplainer</span>(model)'
+ '\nshap_values = explainer.<span class="fn">shap_values</span>(X_test)'
+ '\n'
+ '\n<span class="cm"># Tek bir tahmin için açıklama</span>'
+ '\nshap.<span class="fn">force_plot</span>(explainer.expected_value, shap_values[<span class="num">0</span>], X_test.<span class="fn">iloc</span>[<span class="num">0</span>])'
+ '\n<span class="cm"># Bu müşterinin kayıp tahminini en çok hangi özellikler artırdı?</span>'
+ '\n'
+ '\n<span class="cm"># Global özet</span>'
+ '\nshap.<span class="fn">summary_plot</span>(shap_values, X_test)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> SHAP her tahmin için her özelliğin katkısını "force plot" ile görsel anlatır. Force plot örnek bir müşterinin kayıp olasılığının hangi özellikten geldiğini gösterir — pazarlama ekibi "bu müşteriyi kısa süre nedeniyle değil, yüksek ücret nedeniyle kaybediyoruz" diyebilir. Summary plot tüm test seti üzerinde özelliklerin etkisini özetler.</p>'

+ '<h2 class="l-title">10. Üretim ML Projesi — Toplu Mimari</h2>'

+ '<div class="calc-example"><div class="example-label">TİPİK BİR ÜRETİM ML SİSTEMİ</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ '┌─ <strong>Veri kaynakları</strong> (CRM, sensörler, loglar)'
+ '<br>│'
+ '<br>├─▶ <strong>Veri pipeline\'ı</strong> (Airflow, dbt)'
+ '<br>│       └─ Temizleme, aggregation, feature store'
+ '<br>│'
+ '<br>├─▶ <strong>Eğitim pipeline\'ı</strong> (MLflow, Kubeflow)'
+ '<br>│       └─ Hyperparameter tuning, validation, kayıt'
+ '<br>│'
+ '<br>├─▶ <strong>Model registry</strong> (MLflow, Vertex AI)'
+ '<br>│       └─ Versiyonlama, staging, production tag\'leri'
+ '<br>│'
+ '<br>├─▶ <strong>Servis</strong> (FastAPI + Docker + Kubernetes)'
+ '<br>│       └─ REST API, otomatik ölçekleme'
+ '<br>│'
+ '<br>└─▶ <strong>İzleme</strong> (Evidently, Prometheus, Grafana)'
+ '<br>        └─ Drift, performance, sistem metrikleri'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Her birim ayrı sorumluluk taşır, biri bozulduğunda diğerleri etkilenmez. Bu mimariyi öğrenmek bir veri bilim mühendisinin yolunu açar.</p>'

+ '<h2 class="l-title">11. Sevk Öncesi 10-Kontrol Listesi</h2>'

+ '<p class="l-text">Modeli üretime almadan önce şunları doğrula:</p>'

+ '<ol class="l-list">'
+ '<li>Test seti modelin gerçek dağılımını temsil ediyor mu?</li>'
+ '<li>Veri sızıntısı yok mu? (özellikle target encoding, scaling pipeline\'larında)</li>'
+ '<li>Pipeline tek bir <code>fit-predict</code> ile çalışıyor mu? (notebook\'tan kod parçaları üretime taşınmaz)</li>'
+ '<li>Latency sınırı var mı? (tahmin başına &lt;100ms istiyor musun?)</li>'
+ '<li>Modelin gerçek dünya örneklerinde sanity check\'i yaptın mı?</li>'
+ '<li>Edge case\'ler test edildi mi? (eksik veri, yeni kategori, boş string, aşırı değerler)</li>'
+ '<li>Adalet metrikleri demografik gruplar arasında eşit mi?</li>'
+ '<li>Açıklanabilirlik (SHAP) müşteri için anlamlı mı?</li>'
+ '<li>Drift izleme ve uyarı sistemleri kurulu mu?</li>'
+ '<li>Geri çekme planı var mı? (yeni model bozulursa ne yaparız?)</li>'
+ '</ol>'

+ '<h2 class="l-title">12. Tebrikler — 11 Dersi Bitirdin</h2>'

+ '<p class="l-text">11 dersle Makine Öğrenmesinin tüm omurgasını öğrendin: temellerden (L1) lineer ve lojistik regresyona (L2-L3), genelleme ve değerlendirmeye (L4-L5), regularization\'a (L6), ağaç tabanlı modellerden ensemble\'lara (L7), denetimsiz öğrenmeye (L8-L9), özellik mühendisliğine (L10) ve şimdi üretime (L11). Müşteri kayıp tahmini örneği üzerinden uçtan uca bir ML projesinin nasıl kurulduğunu gördün.</p>'

+ '<p class="l-text">Sonraki adımlar:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Klasik ML\'in derinleri:</strong> SVM\'in matematiği, kernel hilesi, ROC eğrilerinin daha derinlemesine analizi, time series ML.</li>'
+ '<li><strong>Derin Öğrenme:</strong> Sinir ağları, CNN\'ler, RNN\'ler için <a href="/tutorials/deep/">DL kursumuza</a> geç.</li>'
+ '<li><strong>NLP:</strong> Metin işleme, transformer\'lar, LLM\'ler için <a href="/tutorials/nlp/">NLP kursumuza</a> bak.</li>'
+ '<li><strong>Pratik proje:</strong> Kaggle\'da bir yarışmaya gir, ya da kendi domain\'inde bir ML problemi seç. Gerçek projede öğrenirsin.</li>'
+ '<li><strong>Akademik:</strong> The Elements of Statistical Learning, Pattern Recognition and Machine Learning gibi klasik kitapları oku.</li>'
+ '</ul>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> MLOps\'un model eğitiminden farklı, kendi başına bir disiplin olduğunu anladın. Modeli serileştirme (joblib, ONNX) ve farklı servis mimarilerini (batch, REST API, streaming) öğrendin. FastAPI ile model servisi yazmayı gördün. Üretimde modelin sessizce bozulmasının iki nedenini (data drift, concept drift) ve PSI ile ölçmeyi kavradın. Yeniden eğitim stratejilerini, A/B testlerini, shadow deployment\'ı tanıdın. ML için CI/CD\'nin geleneksel yazılımdan farklarını gördün. SHAP ile yorumlanabilirlik konusunu işledin. Tipik bir üretim ML mimarisinin tüm bileşenlerini gözden geçirdin. Sevk öncesi 10-kontrol listesini öğrendin. <strong>Bu kursla ML\'in akademik temelinden üretim mühendisliğine kadar tüm yelpazesi tamam.</strong></div>'

,

en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> Across 10 lessons we trained models. But a model only creates value <em>in production</em>, not in a notebook. This final lesson covers MLOps (ML + DevOps): pipeline serialisation, REST APIs, monitoring, drift detection, A/B testing, CI/CD. You will see how to take your churn model from lab to live system end-to-end.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Version a sklearn pipeline with joblib and save it to disk</li><li>Serve a churn model as a FastAPI REST endpoint</li><li>Measure data drift in production with PSI (Population Stability Index)</li><li>Run an A/B test between two models and assess statistical significance</li><li>Explain individual predictions with SHAP values</li></ul></div>'

+ '<h2 class="l-title">1. What is MLOps and Why It Matters</h2>'

+ '<p class="l-text"><strong>MLOps</strong> is the discipline of taking ML models to production, running them, monitoring them, and updating them. Think of it as DevOps adapted for ML.</p>'

+ '<p class="l-text">A famous data-science secret: <em>"a model in a Jupyter notebook is not the same thing as production code."</em> A model that gets 92% F1 in lab can in production:</p>'

+ '<ul class="l-list">'
+ '<li>Receive features in the wrong order.</li>'
+ '<li>Fail on missing values.</li>'
+ '<li>Degrade silently when data distribution shifts.</li>'
+ '<li>Lag/crash under load.</li>'
+ '<li>Take months for you to notice it broke.</li>'
+ '</ul>'

+ '<p class="l-text">MLOps systematically solves these. A production-ML engineer spends ~50% of time here.</p>'

+ '<h2 class="l-title">2. Model Serialisation — Saving to Disk</h2>'

+ '<p class="l-text">A trained model is a Python object. We need to save and reload it (for serving). Two common methods:</p>'

+ '<h3 class="l-subtitle">pickle / joblib</h3>'

+ '<p class="l-text"><strong>joblib</strong> is recommended for sklearn — faster than pickle for large NumPy arrays.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Save/load a model<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> joblib'
+ '\n'
+ '\n<span class="cm"># Save the trained pipeline to disk</span>'
+ '\njoblib.<span class="fn">dump</span>(pipeline, <span class="str">"churn_model.joblib"</span>)'
+ '\n<span class="cm"># File size: a few KB to a few MB</span>'
+ '\n'
+ '\n<span class="cm"># Load</span>'
+ '\nmodel = joblib.<span class="fn">load</span>(<span class="str">"churn_model.joblib"</span>)'
+ '\nprediction = model.<span class="fn">predict</span>(new_customer_data)'
+ '\n'
+ '\n<span class="cm"># NOTE: pickle is a security risk. Never load models from untrusted sources.</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> joblib serialises the entire pipeline (preprocessor + model) to one file. In production you load that file and feed raw data — same preprocessing applied automatically. Saving the whole pipeline is critical: it takes raw input and gives back a prediction with no manual scaling/encoding mistakes.</p>'

+ '<h3 class="l-subtitle">ONNX / PMML</h3>'

+ '<p class="l-text">To escape Python dependency, <strong>ONNX</strong> (Open Neural Network Exchange) stores the model in a language-agnostic format. Call from C++/Java/JS. Critical for mobile or embedded devices.</p>'

+ '<h2 class="l-title">3. Serving Architectures</h2>'

+ '<p class="l-text">How do you actually run the model? Three main approaches by use case:</p>'

+ '<h3 class="l-subtitle">Approach 1: Batch Prediction</h3>'

+ '<p class="l-text">Every night, score every customer\'s churn probability and write the results to a database. Marketing reads the table in the morning. Pros: cheap (large batches), simple. Cons: not real-time — a new customer waits 24 hours.</p>'

+ '<h3 class="l-subtitle">Approach 2: REST API</h3>'

+ '<p class="l-text">Build a web service with FastAPI/Flask. A request invokes the model and returns a response. Standard approach, sufficient for most products.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Model service with FastAPI<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI'
+ '\n<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel'
+ '\n<span class="kw">from</span> pandas <span class="kw">import</span> DataFrame'
+ '\n<span class="kw">import</span> joblib'
+ '\n'
+ '\napp = <span class="fn">FastAPI</span>()'
+ '\nmodel = joblib.<span class="fn">load</span>(<span class="str">"churn_model.joblib"</span>)'
+ '\n'
+ '\n<span class="kw">class</span> Customer(BaseModel):'
+ '\n    age: <span class="kw">int</span>'
+ '\n    monthly_fee: <span class="kw">float</span>'
+ '\n    tenure: <span class="kw">int</span>'
+ '\n    contract_type: <span class="kw">str</span>'
+ '\n'
+ '\n<span class="kw">@</span>app.<span class="fn">post</span>(<span class="str">"/predict"</span>)'
+ '\n<span class="kw">def</span> <span class="fn">predict</span>(c: Customer):'
+ '\n    df = <span class="fn">DataFrame</span>([c.<span class="fn">dict</span>()])'
+ '\n    proba = model.<span class="fn">predict_proba</span>(df)[<span class="num">0</span>][<span class="num">1</span>]'
+ '\n    <span class="kw">return</span> {<span class="str">"churn_probability"</span>: <span class="fn">float</span>(proba)}'
+ '\n'
+ '\n<span class="cm"># Run:  uvicorn main:app --host 0.0.0.0 --port 8000</span>'
+ '\n<span class="cm"># Test: curl -X POST localhost:8000/predict -d \'{"age":40,"monthly_fee":50,...}\'</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> A 20-line prediction service with FastAPI. Pydantic\'s <code>Customer</code> validates input types; on a request the data is wrapped in a DataFrame, model.predict_proba returns the probability, and the API returns JSON. In production wrap in Docker, scale on Kubernetes.</p>'

+ '<h3 class="l-subtitle">Approach 3: Streaming / Edge</h3>'

+ '<p class="l-text">For very low latency (e.g. fraud detection — &lt;100ms): a Kafka consumer + cached model. Or a model running in the browser/phone via ONNX/TF Lite (edge inference).</p>'

+ '<h2 class="l-title">4. Model Monitoring — The Real Danger</h2>'

+ '<p class="l-text">When the model is in production, the work is not done — it just begins. Two main reasons models silently degrade:</p>'

+ '<h3 class="l-subtitle">Data drift</h3>'

+ '<p class="l-text">Production input distribution diverges from training. For example:</p>'

+ '<ul class="l-list">'
+ '<li>A new competitor entered the market → customer profile changed.</li>'
+ '<li>Pandemic → usage patterns changed entirely.</li>'
+ '<li>New product launch → old features take new meaning.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Concept drift</h3>'

+ '<p class="l-text">The input-output relationship changes. "High monthly fee → likely churn" may no longer hold under new competition. Inputs may look identical but behaviour shifted.</p>'

+ '<h3 class="l-subtitle">What to monitor?</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Prediction distribution:</strong> how do output probabilities distribute? Sudden change?</li>'
+ '<li><strong>Feature distribution:</strong> mean/std of each feature changed? KS test, PSI.</li>'
+ '<li><strong>Performance (after labels arrive):</strong> compare against true churns, track F1.</li>'
+ '<li><strong>System metrics:</strong> latency, error rate, QPS, memory.</li>'
+ '</ul>'

+ '<p class="l-text">Tools: <strong>Evidently AI</strong> (open-source drift detection), <strong>Arize</strong>, <strong>WhyLabs</strong> (commercial), Prometheus + Grafana (system).</p>'

+ '<h2 class="l-title">5. PSI — Population Stability Index</h2>'

+ '<p class="l-text">A classical numerical measure of drift. Compares a feature\'s training and production distributions:</p>'

+ '<div class="katex-block">$$\\text{PSI} = \\sum_{i} (p_i^{\\text{prod}} - p_i^{\\text{train}}) \\cdot \\ln\\!\\left( \\frac{p_i^{\\text{prod}}}{p_i^{\\text{train}}} \\right)$$</div>'

+ '<p class="l-text">Interpretation:</p>'

+ '<ul class="l-list">'
+ '<li><strong>PSI &lt; 0.1:</strong> negligible drift.</li>'
+ '<li><strong>0.1 &lt; PSI &lt; 0.2:</strong> moderate drift — investigate.</li>'
+ '<li><strong>PSI &gt; 0.2:</strong> significant drift — retrain.</li>'
+ '</ul>'

+ '<p class="l-text">PSI is standard for credit risk models in banking.</p>'

+ '<h2 class="l-title">6. Retraining Strategies</h2>'

+ '<p class="l-text">When drift is detected, what next? The main answer: retrain the model on fresh data.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Periodic:</strong> auto-retrain weekly/monthly. Simple, safe.</li>'
+ '<li><strong>Triggered:</strong> retrain when drift metric crosses a threshold. Smarter, saves resources.</li>'
+ '<li><strong>Continual learning:</strong> update the model with each new example. Complex, rarely used.</li>'
+ '</ul>'

+ '<p class="l-text">After retraining: does the new model beat the old on val? Then validate in an A/B test.</p>'

+ '<h2 class="l-title">7. A/B Testing — Is the New Model Actually Better?</h2>'

+ '<p class="l-text">A new model can be better on val but worse in reality. <strong>A/B testing</strong> tests this:</p>'

+ '<ol class="l-list">'
+ '<li>Split traffic: 50% old model (control), 50% new (variant).</li>'
+ '<li>Measure the business metric: real churn capture, campaign return, retention.</li>'
+ '<li>Statistical significance test (t-test, Mann-Whitney).</li>'
+ '<li>If new is significantly better, ramp up to 100%.</li>'
+ '</ol>'

+ '<p class="l-text">Caveat: A/B tests take 1-4 weeks. For business that cannot wait, use <strong>shadow deployment</strong>: the new model receives traffic but does not affect production decisions, only logged for comparison.</p>'

+ '<h2 class="l-title">8. CI/CD for ML — Pipeline Automation</h2>'

+ '<p class="l-text">In traditional software CI/CD: code change → automated tests + deploy. In ML two more layers:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Data tests:</strong> is the new data format valid? Missing columns? Unexpected value ranges?</li>'
+ '<li><strong>Model tests:</strong> does the new model maintain old performance? Behaves consistently on edge cases?</li>'
+ '</ul>'

+ '<p class="l-text">Tools: <strong>MLflow</strong> (experiment tracking + model registry), <strong>DVC</strong> (data versioning), <strong>Kubeflow</strong> (pipeline orchestration), <strong>GitHub Actions</strong> (CI/CD).</p>'

+ '<h2 class="l-title">9. Interpretability & SHAP</h2>'

+ '<p class="l-text">Production models cannot be "black boxes". When a customer\'s credit is denied "why?" must be answerable — both ethical and legal (GDPR, EU AI Act).</p>'

+ '<p class="l-text"><strong>SHAP (SHapley Additive exPlanations)</strong> uses game theory to compute each feature\'s contribution per prediction. Mentioned in <a href="/tutorials/ml-theory/7">L7</a>; in practice:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Explaining a model with SHAP<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> shap'
+ '\n'
+ '\n<span class="cm"># For XGBoost or any tree-based model</span>'
+ '\nexplainer = shap.<span class="fn">TreeExplainer</span>(model)'
+ '\nshap_values = explainer.<span class="fn">shap_values</span>(X_test)'
+ '\n'
+ '\n<span class="cm"># Explain a single prediction</span>'
+ '\nshap.<span class="fn">force_plot</span>(explainer.expected_value, shap_values[<span class="num">0</span>], X_test.<span class="fn">iloc</span>[<span class="num">0</span>])'
+ '\n<span class="cm"># Which features pushed this customer\'s churn probability up?</span>'
+ '\n'
+ '\n<span class="cm"># Global summary</span>'
+ '\nshap.<span class="fn">summary_plot</span>(shap_values, X_test)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> SHAP visualises each feature\'s contribution per prediction with "force plots". The force plot shows which features pushed a particular customer\'s probability up or down — marketing can say "this customer is at risk because of high fee, not because of short tenure". Summary plots aggregate effects across the full test set.</p>'

+ '<h2 class="l-title">10. A Production ML Project — End-to-End Architecture</h2>'

+ '<div class="calc-example"><div class="example-label">A TYPICAL PRODUCTION ML SYSTEM</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ '┌─ <strong>Data sources</strong> (CRM, sensors, logs)'
+ '<br>│'
+ '<br>├─▶ <strong>Data pipeline</strong> (Airflow, dbt)'
+ '<br>│       └─ cleaning, aggregation, feature store'
+ '<br>│'
+ '<br>├─▶ <strong>Training pipeline</strong> (MLflow, Kubeflow)'
+ '<br>│       └─ hyperparameter tuning, validation, registration'
+ '<br>│'
+ '<br>├─▶ <strong>Model registry</strong> (MLflow, Vertex AI)'
+ '<br>│       └─ versioning, staging/production tags'
+ '<br>│'
+ '<br>├─▶ <strong>Serving</strong> (FastAPI + Docker + Kubernetes)'
+ '<br>│       └─ REST API, autoscaling'
+ '<br>│'
+ '<br>└─▶ <strong>Monitoring</strong> (Evidently, Prometheus, Grafana)'
+ '<br>        └─ drift, performance, system metrics'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Each component owns a responsibility, isolated from the others. Mastering this architecture opens the door to a data-science engineer career.</p>'

+ '<h2 class="l-title">11. Pre-Ship 10-Item Checklist</h2>'

+ '<p class="l-text">Before going to production verify:</p>'

+ '<ol class="l-list">'
+ '<li>Does the test set represent the model\'s real distribution?</li>'
+ '<li>No data leakage? (especially in target encoding, scaling pipelines)</li>'
+ '<li>Pipeline runs as a single fit-predict? (no notebook fragments shipped)</li>'
+ '<li>Latency budget? (do you need &lt;100ms per prediction?)</li>'
+ '<li>Sanity-checked predictions on real-world examples?</li>'
+ '<li>Edge cases tested? (missing data, new categories, empty strings, extreme values)</li>'
+ '<li>Fairness metrics balanced across demographic groups?</li>'
+ '<li>Interpretability (SHAP) understandable to a customer?</li>'
+ '<li>Drift monitoring and alerting in place?</li>'
+ '<li>Rollback plan? (what if the new model breaks?)</li>'
+ '</ol>'

+ '<h2 class="l-title">12. Congratulations — You Finished the 11 Lessons</h2>'

+ '<p class="l-text">In 11 lessons you covered the full backbone of Machine Learning: from foundations (L1) to linear and logistic regression (L2-L3), generalisation and evaluation (L4-L5), regularisation (L6), trees and ensembles (L7), unsupervised learning (L8-L9), feature engineering (L10), and now production (L11). Through the running churn example you saw how an end-to-end ML project takes shape.</p>'

+ '<p class="l-text">Next steps:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Deeper classical ML:</strong> SVM math, kernel trick, deeper ROC analysis, time-series ML.</li>'
+ '<li><strong>Deep Learning:</strong> neural nets, CNNs, RNNs — see our <a href="/tutorials/deep/">DL course</a>.</li>'
+ '<li><strong>NLP:</strong> text processing, transformers, LLMs — see our <a href="/tutorials/nlp/">NLP course</a>.</li>'
+ '<li><strong>Real project:</strong> enter a Kaggle competition or pick an ML problem in your domain. Real projects teach.</li>'
+ '<li><strong>Academic:</strong> read classics like The Elements of Statistical Learning or Pattern Recognition and Machine Learning.</li>'
+ '</ul>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> MLOps is its own discipline distinct from model training. Model serialisation (joblib, ONNX) and serving architectures (batch, REST API, streaming). Writing a model service with FastAPI. The two reasons production models silently break (data drift, concept drift) and quantifying them with PSI. Retraining strategies, A/B testing, shadow deployment. How CI/CD differs for ML compared to traditional software. Interpretability with SHAP. The components of a typical production ML architecture. A pre-ship 10-item checklist. <strong>This course covers ML from academic foundations to production engineering.</strong></div>'

};
