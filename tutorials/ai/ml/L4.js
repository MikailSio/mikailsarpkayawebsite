/* ml-L4.js — ML Theory Lesson 4: Genelleme — Bias-Variance, Train/Val/Test, Cross-Validation (TR + EN) */
var ML_L4 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> ML\'in en kritik kavramı: <em>genelleme</em>. Bir model eğitim verisinde mükemmel olabilir ama yeni veride berbat olabilir — bu felakettir, çünkü modelin değeri yeni verilerde yatar. Bu derste underfitting/overfitting, bias-variance trade-off, train/val/test ayrımı, ve cross-validation\'ı öğreneceksin. Lineer regresyondaki polinom derecesi seçimi sezgisel örneğin olacak.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Underfitting ve overfitting\'i polinom derecesiyle çizip teşhis edeceksin</li><li>Bias-variance ayrışmasını formülünden çıkaracaksın</li><li>Veriyi train/val/test ve sınıflandırma için stratified olarak böleceksin</li><li>K-fold cross-validation ile model performansını sağlamlaştıracaksın</li><li>Pipeline + fit/transform sırasıyla data leakage\'i önleyeceksin</li></ul></div>'

+ '<h2 class="l-title">1. Genelleme Sorunu</h2>'

+ '<p class="l-text"><strong>Genelleme</strong>, modelin <em>görmediği veride</em> de iyi tahmin yapabilme becerisidir. Bu, ML\'in tek hedefidir; eğitim verisinde mükemmel olmak işe yaramaz çünkü o verinin etiketlerini zaten biliyoruz.</p>'

+ '<div class="calc-example"><div class="example-label">İKİ ÖĞRENCİ ÖRNEĞİ</div><div class="example-body">'
+ '<p class="l-text"><strong>Öğrenci A:</strong> Geçmiş sınav sorularını ezberlemiş. Aynı sorular gelirse 100/100 alır. Yeni soru gelirse... %40.</p>'
+ '<p class="l-text"><strong>Öğrenci B:</strong> Konuyu kavramış, soruların altındaki mantığı çözmüş. Geçmiş sorularda %85, yeni sorularda da %82.</p>'
+ '<p class="l-text">Hangisini sınava girer ki gerçek bir sınava? Tabii ki B. ML\'de de aynı: A "ezberleme" (overfitting), B "öğrenme" (genelleme). Sadece eğitim performansına bakarsak A\'yı tercih ederiz, ama gerçekte B daha değerlidir.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Underfitting & Overfitting</h2>'

+ '<p class="l-text">Bir model iki şekilde başarısız olabilir:</p>'

+ '<h3 class="l-subtitle">Underfitting (yetersiz öğrenme)</h3>'

+ '<p class="l-text">Model verideki örüntüyü yakalayamayacak kadar basit. Hem eğitim hem test setinde kötü performans. Klasik örnek: lineer regresyonu eğri bir veriye uygulamak.</p>'

+ '<h3 class="l-subtitle">Overfitting (aşırı öğrenme)</h3>'

+ '<p class="l-text">Model çok karmaşık; eğitim verisindeki gürültüyü bile öğrenmiş. Eğitim setinde mükemmel, test setinde berbat. Klasik örnek: 6 noktalı veriye 15. derece polinom uydurmak — her noktadan tam geçer ama eğri zikzak yapar.</p>'

+ '<div class="plotly-graph"><div id="plot-fitting-tr" style="width:100%;height:420px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var x=[28,62,35,48,31,55];'
+ 'var y=[120,220,85,180,95,240];'
+ 'var lx=[];for(var i=20;i<=70;i++)lx.push(i);'
+ 'var underfit=lx.map(function(v){return v*0.5+90;});'
+ 'var good=lx.map(function(v){return v*4.05-21.5;});'
+ 'var overfit=lx.map(function(v){return 100+30*Math.sin((v-40)*0.5)+v*2;});'
+ 'var t1={x:x,y:y,name:"Veri",type:"scatter",mode:"markers",marker:{color:T.accent,size:13}};'
+ 'var t2={x:lx,y:underfit,name:"Underfit (sabit)",type:"scatter",mode:"lines",line:{color:"rgba(248,113,113,.7)",width:2}};'
+ 'var t3={x:lx,y:good,name:"İyi denge (lineer)",type:"scatter",mode:"lines",line:{color:"rgba(78,205,196,.85)",width:3}};'
+ 'var t4={x:lx,y:overfit,name:"Overfit (yüksek derece)",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.8)",width:2,dash:"dash"}};'
+ 'var layout={title:{text:"Underfit / İyi denge / Overfit — sezgisel görünüm",font:{color:T.text,size:13}},xaxis:{title:"Yaş",color:T.text,gridcolor:T.grid},yaxis:{title:"Aylık ücret",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.15}};'
+ 'if(document.getElementById("plot-fitting-tr"))Plotly.newPlot("plot-fitting-tr",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Aynı 6 müşteri verisinde üç farklı model. Kırmızı çizgi (underfit) çok basit, neredeyse sabit. Yeşil (iyi denge) verinin temel örüntüsünü yakalar. Mor kesikli (overfit) tüm noktalardan geçmek için zikzak yapar — yeni veriler için kötü genelleyecek. İdeal olan yeşildir: yeterince karmaşık ama gereksizce zikzaklı değil.</div>'

+ '<h2 class="l-title">3. Bias-Variance Trade-Off</h2>'

+ '<p class="l-text">Underfit/overfit\'i matematiksel olarak ifade eden ünlü ayrışım: bir modelin <strong>beklenen hatası</strong> üç bileşene ayrılır.</p>'

+ '<div class="katex-block">$$\\mathbb{E}[(\\hat{y} - y)^2] = \\underbrace{\\text{Bias}^2}_{\\text{model too simple}} + \\underbrace{\\text{Variance}}_{\\text{model too complex}} + \\underbrace{\\sigma^2}_{\\text{data noise}}$$</div>'

+ '<ul class="l-list">'
+ '<li><strong>Bias:</strong> Model gerçek örüntüden ne kadar sapıyor? Çok basit modellerde yüksek (underfit).</li>'
+ '<li><strong>Variance:</strong> Eğitim verisi değiştirilirse model ne kadar değişir? Çok karmaşık modellerde yüksek (overfit).</li>'
+ '<li><strong>İndirgenemez gürültü:</strong> Verinin doğal rastgeleliği. Ne yaparsan yap kalkmaz.</li>'
+ '</ul>'

+ '<p class="l-text">Trade-off: bias\'ı düşürmek için model karmaşıklığını artırırsan variance yükselir. İdeal model toplam hatayı en aza indirir.</p>'

+ '<div class="plotly-graph"><div id="plot-biasvar-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var c=[];for(var i=1;i<=10;i++)c.push(i);'
+ 'var bias=c.map(function(v){return 30/(v*v*0.5+1)+1;});'
+ 'var variance=c.map(function(v){return 0.2*v*v;});'
+ 'var total=c.map(function(v,i){return bias[i]+variance[i]+5;});'
+ 'var t1={x:c,y:bias,name:"Bias²",type:"scatter",mode:"lines+markers",line:{color:"rgba(248,113,113,.85)",width:2}};'
+ 'var t2={x:c,y:variance,name:"Variance",type:"scatter",mode:"lines+markers",line:{color:T.accent,width:2}};'
+ 'var t3={x:c,y:total,name:"Toplam hata",type:"scatter",mode:"lines+markers",line:{color:"rgba(78,205,196,.9)",width:3}};'
+ 'var layout={title:{text:"Model karmaşıklığı arttıkça hata bileşenleri",font:{color:T.text,size:13}},xaxis:{title:"Model karmaşıklığı (örn. polinom derecesi)",color:T.text,gridcolor:T.grid},yaxis:{title:"Hata",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-biasvar-tr"))Plotly.newPlot("plot-biasvar-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Model karmaşıklığı sağa gittikçe (örneğin polinom derecesi 1\'den 10\'a) bias düşer (kırmızı), variance yükselir (mor). Toplam hata (yeşil) U eğrisi çizer — bir noktada minimum yapar, ondan sonra karmaşıklık eklemek yarar değil zarar verir. Bizim hedefimiz toplam hatanın minimum olduğu noktayı bulmak.</div>'

+ '<h2 class="l-title">4. Train/Val/Test Ayrımı</h2>'

+ '<p class="l-text">Modelin gerçek genelleme performansını ölçmek için veriyi <strong>üç parçaya</strong> böleriz:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Train (%60-70):</strong> Modeli eğitiriz.</li>'
+ '<li><strong>Validation (%15-20):</strong> Hyperparametreleri seçeriz (polinom derecesi, regularization gücü, k vs).</li>'
+ '<li><strong>Test (%15-20):</strong> En son, sadece bir kez performansı ölçeriz. Bu verinin etiketleri "sınav sonu açıklanan cevaplar" gibidir.</li>'
+ '</ul>'

+ '<div class="l-warn"><strong>Kritik kural:</strong> Test setine eğitim sırasında <em>asla bakma</em>. Hangi modelin daha iyi olduğuna test setine bakarak karar verirsen, dolaylı olarak test setine "uydurmuş" olursun — performans yapay olarak yüksek görünür, gerçek dünyada düşer.</div>'

+ '<h3 class="l-subtitle">Pratik akış</h3>'

+ '<ol class="l-list">'
+ '<li>Train set üzerinde modeli eğit.</li>'
+ '<li>Val set üzerinde performansı ölç. Hyperparametre ayarla, başka model dene, val\'da en iyiyi seç.</li>'
+ '<li>Final modelle <em>tek seferlik</em> test setinde değerlendir. Bu rakamı raporla.</li>'
+ '<li>Test rakamına bakıp modeli değiştirme — yapsan veri sızıntısı olur.</li>'
+ '</ol>'

+ '<h2 class="l-title">5. Stratifiye Bölme — Sınıflandırma için Önemli</h2>'

+ '<p class="l-text">Veriyi rastgele 70/15/15 bölmek standart, ama sınıflandırmada bir tuzak: rastgele bölünce sınıf oranları kaybolabilir. Eğer veri %80 kalan, %20 kayıp ise, küçük test setinde rastgele 0 kayıp düşebilir!</p>'

+ '<p class="l-text"><strong>Stratifiye (stratified) bölme</strong> her bölmede orijinal sınıf oranlarını korur. sklearn\'de <code>train_test_split(..., stratify=y)</code> ile.</p>'

+ '<h2 class="l-title">6. Cross-Validation — Daha Güçlü Değerlendirme</h2>'

+ '<p class="l-text">Tek bir val set küçükse şanstan etkilenir. <strong>K-fold cross-validation</strong> bunu çözer:</p>'

+ '<ol class="l-list">'
+ '<li>Veriyi <em>k</em> eşit parçaya böl (genelde k=5 veya 10).</li>'
+ '<li>Her parçayı sırayla "validation" yap, geri kalan k-1 parçada eğit.</li>'
+ '<li>k farklı val skor elde edersin. Ortalama = modelin gerçek performans tahmini.</li>'
+ '</ol>'

+ '<div class="calc-example"><div class="example-label">5-FOLD CV ŞEMASI</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'Fold 1: <strong>[VAL]</strong> [tr] [tr] [tr] [tr] → val skoru = 0.83'
+ '<br>Fold 2: [tr] <strong>[VAL]</strong> [tr] [tr] [tr] → val skoru = 0.86'
+ '<br>Fold 3: [tr] [tr] <strong>[VAL]</strong> [tr] [tr] → val skoru = 0.81'
+ '<br>Fold 4: [tr] [tr] [tr] <strong>[VAL]</strong> [tr] → val skoru = 0.85'
+ '<br>Fold 5: [tr] [tr] [tr] [tr] <strong>[VAL]</strong> → val skoru = 0.84'
+ '<br><strong>Ortalama: 0.838 ± 0.018</strong>'
+ '</p>'
+ '<p class="l-text">Tek bir 0.83 yerine 0.838 ± 0.018 elde ettik — daha güvenilir bir tahmin, plus belirsizliği de biliyoruz.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">CV türleri</h3>'

+ '<ul class="l-list">'
+ '<li><strong>K-Fold:</strong> Klasik, sınıflandırma & regresyon için.</li>'
+ '<li><strong>Stratified K-Fold:</strong> Her fold\'da sınıf oranları korunur. Sınıflandırmada varsayılan.</li>'
+ '<li><strong>Leave-One-Out (LOO):</strong> k=n. Her örneği tek başına val olarak kullan. Çok küçük verilerde.</li>'
+ '<li><strong>Time Series Split:</strong> Zaman serisi için. Geleceği val olarak kullan, geçmişi train.</li>'
+ '<li><strong>Group K-Fold:</strong> Aynı gruptan örnekleri (mesela aynı müşterinin birden çok kaydı) ayrı bölmelerde tut.</li>'
+ '</ul>'

+ '<h2 class="l-title">7. Learning Curves — Underfit mi Overfit mi?</h2>'

+ '<p class="l-text"><strong>Learning curve</strong>, eğitim seti büyüklüğüne göre train ve val performansını çizer. Eğrinin şekli sorununu söyler:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Train ve val skoru ikisi de düşük + birbirine yakın:</strong> Underfitting. Daha güçlü model gerek.</li>'
+ '<li><strong>Train skor yüksek, val skor düşük + büyük gap:</strong> Overfitting. Daha çok veri / regularization / daha basit model.</li>'
+ '<li><strong>İkisi yakın ve yüksek:</strong> İyi denge. Daha çok veri marjinal yardım.</li>'
+ '</ul>'

+ '<p class="l-text">Bu eğri sayesinde "daha çok veri toplamak yarar mı?" sorusuna cevap verebilirsin. Gap büyükse evet; küçükse hayır.</p>'

+ '<h2 class="l-title">8. Veri Sızıntısı (Data Leakage) — En Sinsi Hata</h2>'

+ '<p class="l-text"><strong>Veri sızıntısı</strong>, test setinden eğitime bilgi karışmasıdır. Sonuç: eğitimde mükemmel görünen model, üretimde berbat.</p>'

+ '<div class="calc-example"><div class="example-label">SIZINTI ÖRNEKLERI</div><div class="example-body">'
+ '<ul class="l-list">'
+ '<li><strong>Tüm veride scaling yapmak:</strong> Train+test\'i birlikte standardize edersen, train test\'in dağılımını "görmüş" olur. Doğrusu: scaler\'ı sadece train\'e <code>fit</code> et, sonra test\'i <code>transform</code> et.</li>'
+ '<li><strong>Hedeften türetilen özellikler:</strong> "Müşteri kayıp olduktan sonra kalan ay sayısı" gibi bir özellik kayıp tahminine konursa, model bilgiye haksız erişir.</li>'
+ '<li><strong>Zaman serisi sızıntısı:</strong> Geleceği train\'de kullanıp geçmişi val yaparsan, model geleceği "görüyor".</li>'
+ '<li><strong>Yinelenen kayıtlar:</strong> Aynı müşteri hem train hem test\'te varsa, model ezberleyebilir.</li>'
+ '</ul>'
+ '</div></div>'

+ '<h2 class="l-title">9. Python — Train/Test Split + Cross-Validation</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Train/test split + stratifiye + CV<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> numpy <span class="kw">as</span> np'
+ '\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split, cross_val_score, StratifiedKFold'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n'
+ '\n<span class="cm"># Daha gerçekçi: 100 örnekli veri (rastgele üretim)</span>'
+ '\nnp.random.<span class="fn">seed</span>(<span class="num">42</span>)'
+ '\nX = np.random.<span class="fn">randn</span>(<span class="num">100</span>, <span class="num">3</span>)  <span class="cm"># 100 örnek, 3 özellik</span>'
+ '\ny = (X[:, <span class="num">0</span>] + X[:, <span class="num">1</span>]*<span class="num">0.5</span> > <span class="num">0</span>).<span class="fn">astype</span>(<span class="kw">int</span>)'
+ '\n'
+ '\n<span class="cm"># 1) Train/test ayrımı (stratified)</span>'
+ '\nX_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>('
+ '\n    X, y, test_size=<span class="num">0.2</span>, stratify=y, random_state=<span class="num">42</span>)'
+ '\n'
+ '\n<span class="cm"># 2) Pipeline: scaler + model</span>'
+ '\npipe = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">LogisticRegression</span>())'
+ '\n'
+ '\n<span class="cm"># 3) 5-fold CV — sadece train üzerinde!</span>'
+ '\ncv = <span class="fn">StratifiedKFold</span>(n_splits=<span class="num">5</span>, shuffle=<span class="kw">True</span>, random_state=<span class="num">42</span>)'
+ '\nscores = <span class="fn">cross_val_score</span>(pipe, X_train, y_train, cv=cv, scoring=<span class="str">"accuracy"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"CV doğruluğu: {scores.mean():.3f} ± {scores.std():.3f}"</span>)'
+ '\n<span class="cm"># CV doğruluğu: 0.825 ± 0.062</span>'
+ '\n'
+ '\n<span class="cm"># 4) Final değerlendirme — TEK SEFERLİK test seti</span>'
+ '\npipe.<span class="fn">fit</span>(X_train, y_train)'
+ '\n<span class="fn">print</span>(<span class="str">f"Test doğruluğu: {pipe.score(X_test, y_test):.3f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Bütünlüklü bir değerlendirme akışı. Adım 1: stratified train/test split (sınıf oranları korunur). Adım 2: pipeline ile scaler + model birleştir (sızıntıyı önler — scaler her fold\'un train\'inde fit olur). Adım 3: 5-fold stratified CV ile train üzerinde model performansı tahmin et — ortalama ve standart sapma. Adım 4: model seçimini bitirdikten sonra TEK SEFER test setinde değerlendir, bu rakamı raporla. Bu şablon her ML projesinin iskeletidir.</p>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Modelin "iyi" olduğunu nasıl anlarız sorusuna cevap aldık. Ama "iyi" tek bir sayı değil. <a href="/tutorials/ai/ml/evaluation-hyperparameter-tuning">Ders 5</a>\'te <strong>değerlendirme metriklerini</strong> derinlemesine işleyeceğiz — accuracy, precision, recall, F1, ROC-AUC, confusion matrix. Hangi metriği ne zaman kullanmalı? Plus, <strong>hyperparameter tuning</strong>: GridSearchCV, Optuna ile en iyi modeli sistematik olarak bulma.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Genelleme kavramının ML\'in tek hedefi olduğunu, eğitim performansının yanıltıcı olabileceğini öğrendin. Underfitting ve overfitting\'i somut görsellerle ayırt ettin. Bias-variance trade-off\'un matematiksel ayrışımını ve bunun model karmaşıklığıyla ilişkisini gördün. Train/val/test ayrımının niye kritik olduğunu, test setinin "kutsal" olduğunu kavradın. Stratifiye bölmenin sınıflandırmada niye gerektiğini öğrendin. K-fold cross-validation ile daha güvenilir performans tahminini, farklı CV türlerini tanıdın. Learning curve ile underfit/overfit teşhis etmeyi öğrendin. Veri sızıntısının en sinsi hata olduğunu ve nasıl önleneceğini gördün. sklearn ile profesyonel bir değerlendirme akışı yazdın.</div>'

,

en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> The most critical concept in ML: <em>generalisation</em>. A model can be perfect on training data and terrible on new data — disaster, since the model\'s value lies in new data. This lesson covers underfitting/overfitting, the bias-variance trade-off, train/val/test split, and cross-validation. Polynomial-degree choice from linear regression is your guiding intuition.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Diagnose underfitting and overfitting by plotting polynomial degree</li><li>Derive the bias-variance decomposition of expected test error</li><li>Split data into train/val/test and use stratified splits for classification</li><li>Use k-fold cross-validation to harden model evaluation</li><li>Avoid data leakage with sklearn pipelines and proper fit/transform order</li></ul></div>'

+ '<h2 class="l-title">1. The Generalisation Problem</h2>'

+ '<p class="l-text"><strong>Generalisation</strong> is the model\'s ability to predict well on <em>data it has not seen</em>. This is the only goal of ML; perfect on training is worthless because we already know those labels.</p>'

+ '<div class="calc-example"><div class="example-label">TWO STUDENTS</div><div class="example-body">'
+ '<p class="l-text"><strong>Student A:</strong> Memorised past exam questions. If the same questions appear: 100/100. New questions: ~40%.</p>'
+ '<p class="l-text"><strong>Student B:</strong> Understood the topic. Past exams: 85%. New questions: 82%.</p>'
+ '<p class="l-text">Whom would you send to a real exam? B, of course. Same in ML: A is "memorising" (overfit), B is "learning" (generalising). Looking only at training performance favours A — but B is what we actually want.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Underfitting & Overfitting</h2>'

+ '<p class="l-text">A model fails in two ways:</p>'

+ '<h3 class="l-subtitle">Underfitting</h3>'

+ '<p class="l-text">The model is too simple to capture the pattern. Poor on both train and test. Classic: linear regression on a curved dataset.</p>'

+ '<h3 class="l-subtitle">Overfitting</h3>'

+ '<p class="l-text">The model is too complex; it has memorised even the noise in the training data. Excellent on train, terrible on test. Classic: degree-15 polynomial on 6 data points — passes through every point but wiggles wildly.</p>'

+ '<div class="plotly-graph"><div id="plot-fitting-en" style="width:100%;height:420px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var x=[28,62,35,48,31,55];'
+ 'var y=[30,55,22,45,24,60];'
+ 'var lx=[];for(var i=20;i<=70;i++)lx.push(i);'
+ 'var underfit=lx.map(function(v){return v*0.1+30;});'
+ 'var good=lx.map(function(v){return v*1.05-5.5;});'
+ 'var overfit=lx.map(function(v){return 25+8*Math.sin((v-40)*0.5)+v*0.5;});'
+ 'var t1={x:x,y:y,name:"Data",type:"scatter",mode:"markers",marker:{color:T.accent,size:13}};'
+ 'var t2={x:lx,y:underfit,name:"Underfit (flat)",type:"scatter",mode:"lines",line:{color:"rgba(248,113,113,.7)",width:2}};'
+ 'var t3={x:lx,y:good,name:"Good fit (linear)",type:"scatter",mode:"lines",line:{color:"rgba(78,205,196,.85)",width:3}};'
+ 'var t4={x:lx,y:overfit,name:"Overfit (high degree)",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.8)",width:2,dash:"dash"}};'
+ 'var layout={title:{text:"Underfit / Good fit / Overfit — illustrative",font:{color:T.text,size:13}},xaxis:{title:"Age",color:T.text,gridcolor:T.grid},yaxis:{title:"Monthly fee",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.15}};'
+ 'if(document.getElementById("plot-fitting-en"))Plotly.newPlot("plot-fitting-en",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Three models on the same 6 customers. The red line (underfit) is too flat. Green (good fit) captures the basic pattern. The dashed purple (overfit) wiggles to pass through every training point — will generalise poorly. The ideal is green: complex enough but not unnecessarily wiggly.</div>'

+ '<h2 class="l-title">3. The Bias-Variance Trade-Off</h2>'

+ '<p class="l-text">The classical decomposition: a model\'s <strong>expected error</strong> splits into three parts.</p>'

+ '<div class="katex-block">$$\\mathbb{E}[(\\hat{y} - y)^2] = \\underbrace{\\text{Bias}^2}_{\\text{model too simple}} + \\underbrace{\\text{Variance}}_{\\text{model too complex}} + \\underbrace{\\sigma^2}_{\\text{data noise}}$$</div>'

+ '<ul class="l-list">'
+ '<li><strong>Bias:</strong> how far the model deviates from the true pattern. High in too-simple models (underfit).</li>'
+ '<li><strong>Variance:</strong> how much the model changes if the training data changes. High in too-complex models (overfit).</li>'
+ '<li><strong>Irreducible noise:</strong> the data\'s natural randomness. Cannot be removed.</li>'
+ '</ul>'

+ '<p class="l-text">The trade-off: increasing complexity reduces bias but raises variance. The ideal model minimises total error.</p>'

+ '<div class="plotly-graph"><div id="plot-biasvar-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var c=[];for(var i=1;i<=10;i++)c.push(i);'
+ 'var bias=c.map(function(v){return 30/(v*v*0.5+1)+1;});'
+ 'var variance=c.map(function(v){return 0.2*v*v;});'
+ 'var total=c.map(function(v,i){return bias[i]+variance[i]+5;});'
+ 'var t1={x:c,y:bias,name:"Bias²",type:"scatter",mode:"lines+markers",line:{color:"rgba(248,113,113,.85)",width:2}};'
+ 'var t2={x:c,y:variance,name:"Variance",type:"scatter",mode:"lines+markers",line:{color:T.accent,width:2}};'
+ 'var t3={x:c,y:total,name:"Total error",type:"scatter",mode:"lines+markers",line:{color:"rgba(78,205,196,.9)",width:3}};'
+ 'var layout={title:{text:"Error components vs model complexity",font:{color:T.text,size:13}},xaxis:{title:"Model complexity (e.g. polynomial degree)",color:T.text,gridcolor:T.grid},yaxis:{title:"Error",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-biasvar-en"))Plotly.newPlot("plot-biasvar-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> As complexity grows (e.g. polynomial degree 1→10) bias falls (red) and variance rises (purple). Total error (green) is U-shaped — minimum at some sweet spot, after which more complexity hurts rather than helps. Our job is to find that minimum.</div>'

+ '<h2 class="l-title">4. Train/Val/Test Split</h2>'

+ '<p class="l-text">To measure real generalisation we split data into <strong>three parts</strong>:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Train (60-70%):</strong> train the model.</li>'
+ '<li><strong>Validation (15-20%):</strong> select hyperparameters (polynomial degree, regularisation strength, k, etc.).</li>'
+ '<li><strong>Test (15-20%):</strong> measure performance only at the very end. Treat test labels as "answers revealed only at the end of the exam".</li>'
+ '</ul>'

+ '<div class="l-warn"><strong>Critical rule:</strong> <em>never look at the test set</em> during training. If you choose between models based on test performance you implicitly fit to it — performance looks artificially high but drops in production.</div>'

+ '<h3 class="l-subtitle">Practical workflow</h3>'

+ '<ol class="l-list">'
+ '<li>Train on the train set.</li>'
+ '<li>Evaluate on val. Tune hyperparameters, try other models, pick the best on val.</li>'
+ '<li>Evaluate the final model <em>only</em> on the test set. Report this number.</li>'
+ '<li>Do not change the model after seeing the test score — that is leakage.</li>'
+ '</ol>'

+ '<h2 class="l-title">5. Stratified Splitting — Important for Classification</h2>'

+ '<p class="l-text">Random 70/15/15 splitting is standard, but for classification it has a pitfall: random splits can lose the class ratio. If 80% stayed and 20% churned, a small test set can end up with 0 churners by chance!</p>'

+ '<p class="l-text"><strong>Stratified splitting</strong> preserves original class ratios in every split. In sklearn: <code>train_test_split(..., stratify=y)</code>.</p>'

+ '<h2 class="l-title">6. Cross-Validation — Stronger Evaluation</h2>'

+ '<p class="l-text">A single small val set is luck-dependent. <strong>K-fold cross-validation</strong> fixes this:</p>'

+ '<ol class="l-list">'
+ '<li>Split the data into <em>k</em> equal folds (commonly 5 or 10).</li>'
+ '<li>Use each fold as validation in turn, train on the remaining k-1 folds.</li>'
+ '<li>You get k different val scores. The average is a robust estimate of model performance.</li>'
+ '</ol>'

+ '<div class="calc-example"><div class="example-label">5-FOLD CV SCHEME</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'Fold 1: <strong>[VAL]</strong> [tr] [tr] [tr] [tr] → val = 0.83'
+ '<br>Fold 2: [tr] <strong>[VAL]</strong> [tr] [tr] [tr] → val = 0.86'
+ '<br>Fold 3: [tr] [tr] <strong>[VAL]</strong> [tr] [tr] → val = 0.81'
+ '<br>Fold 4: [tr] [tr] [tr] <strong>[VAL]</strong> [tr] → val = 0.85'
+ '<br>Fold 5: [tr] [tr] [tr] [tr] <strong>[VAL]</strong> → val = 0.84'
+ '<br><strong>Mean: 0.838 ± 0.018</strong>'
+ '</p>'
+ '<p class="l-text">Instead of one 0.83 we have 0.838 ± 0.018 — a more reliable estimate, plus we know the uncertainty.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">CV variants</h3>'

+ '<ul class="l-list">'
+ '<li><strong>K-Fold:</strong> classic, both classification and regression.</li>'
+ '<li><strong>Stratified K-Fold:</strong> preserves class ratios in every fold. Default for classification.</li>'
+ '<li><strong>Leave-One-Out (LOO):</strong> k=n. One example as val each time. For very small data.</li>'
+ '<li><strong>Time Series Split:</strong> for time series. Validate on the future, train on the past.</li>'
+ '<li><strong>Group K-Fold:</strong> keeps examples from the same group (e.g. multiple records of the same customer) within the same fold.</li>'
+ '</ul>'

+ '<h2 class="l-title">7. Learning Curves — Underfit or Overfit?</h2>'

+ '<p class="l-text">A <strong>learning curve</strong> plots training and validation performance vs training-set size. Its shape diagnoses the problem:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Both train and val low + close together:</strong> underfitting. Need a stronger model.</li>'
+ '<li><strong>Train high, val low + big gap:</strong> overfitting. Need more data / regularisation / simpler model.</li>'
+ '<li><strong>Both close and high:</strong> good fit. Extra data helps marginally.</li>'
+ '</ul>'

+ '<p class="l-text">From the curve you can answer "would more data help?". Big gap = yes; small gap = no.</p>'

+ '<h2 class="l-title">8. Data Leakage — The Most Insidious Bug</h2>'

+ '<p class="l-text"><strong>Data leakage</strong> is when information from the test set sneaks into training. Result: a model that looks great in training and fails in production.</p>'

+ '<div class="calc-example"><div class="example-label">LEAKAGE EXAMPLES</div><div class="example-body">'
+ '<ul class="l-list">'
+ '<li><strong>Scaling on the full data:</strong> if you standardise train+test together, train "sees" test\'s distribution. Correct: <code>fit</code> the scaler on train only, then <code>transform</code> test.</li>'
+ '<li><strong>Features derived from the target:</strong> a feature like "months remaining after churn" leaks the answer.</li>'
+ '<li><strong>Time-series leakage:</strong> training on the future and validating on the past lets the model "see" the future.</li>'
+ '<li><strong>Duplicate records:</strong> the same customer in both train and test lets the model memorise.</li>'
+ '</ul>'
+ '</div></div>'

+ '<h2 class="l-title">9. Python — Train/Test Split + Cross-Validation</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Train/test split + stratified + CV<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> numpy <span class="kw">as</span> np'
+ '\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split, cross_val_score, StratifiedKFold'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n'
+ '\n<span class="cm"># Realistic-ish: 100 random examples</span>'
+ '\nnp.random.<span class="fn">seed</span>(<span class="num">42</span>)'
+ '\nX = np.random.<span class="fn">randn</span>(<span class="num">100</span>, <span class="num">3</span>)  <span class="cm"># 100 examples, 3 features</span>'
+ '\ny = (X[:, <span class="num">0</span>] + X[:, <span class="num">1</span>]*<span class="num">0.5</span> > <span class="num">0</span>).<span class="fn">astype</span>(<span class="kw">int</span>)'
+ '\n'
+ '\n<span class="cm"># 1) Stratified train/test split</span>'
+ '\nX_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>('
+ '\n    X, y, test_size=<span class="num">0.2</span>, stratify=y, random_state=<span class="num">42</span>)'
+ '\n'
+ '\n<span class="cm"># 2) Pipeline: scaler + model (prevents leakage)</span>'
+ '\npipe = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">LogisticRegression</span>())'
+ '\n'
+ '\n<span class="cm"># 3) 5-fold CV — on train ONLY!</span>'
+ '\ncv = <span class="fn">StratifiedKFold</span>(n_splits=<span class="num">5</span>, shuffle=<span class="kw">True</span>, random_state=<span class="num">42</span>)'
+ '\nscores = <span class="fn">cross_val_score</span>(pipe, X_train, y_train, cv=cv, scoring=<span class="str">"accuracy"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"CV accuracy: {scores.mean():.3f} ± {scores.std():.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># 4) Final evaluation — ONE shot on test</span>'
+ '\npipe.<span class="fn">fit</span>(X_train, y_train)'
+ '\n<span class="fn">print</span>(<span class="str">f"Test accuracy: {pipe.score(X_test, y_test):.3f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> A clean evaluation flow. Step 1: stratified train/test split (preserves class ratios). Step 2: pipeline ties scaler + model (prevents leakage — scaler fits only on each fold\'s train). Step 3: 5-fold stratified CV on train data — mean and standard deviation of accuracy. Step 4: after model selection, evaluate ONCE on the test set; that is the number you report. This template is the skeleton of every ML project.</p>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">We answered "how do we know a model is good?". But "good" is not a single number. <a href="/tutorials/ai/ml/evaluation-hyperparameter-tuning">Lesson 5</a> dives into <strong>evaluation metrics</strong> — accuracy, precision, recall, F1, ROC-AUC, confusion matrix. Which metric for which task? Plus <strong>hyperparameter tuning</strong>: GridSearchCV, Optuna, finding the best model systematically.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> Generalisation is the only goal of ML, and training performance can be misleading. You distinguished underfitting from overfitting visually. You saw the bias-variance trade-off as a mathematical decomposition tied to model complexity. You learned why train/val/test splitting matters and why the test set is "sacred". You saw why stratified splitting is needed for classification. K-fold cross-validation gives a more reliable performance estimate; you learned its variants. Learning curves diagnose underfit/overfit. Data leakage is the most insidious bug and how to prevent it. You wrote a professional evaluation flow with sklearn.</div>'

};
