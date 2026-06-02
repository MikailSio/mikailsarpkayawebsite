/* ml-L2.js — ML Theory Lesson 2: Lineer Regresyon (TR + EN) */
var ML_L2 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Lineer regresyon, makine öğrenmesinin en temel ve en eski algoritmasıdır. Müşteri verisi üzerinde <em>yaşa göre aylık ücret tahmini</em> gibi sayısal bir hedef tahmin etmeyi öğreneceksin. Modelin kalbi bir doğru denklemi <em>(y = wx + b)</em>; ama bu basitlik kapısının ardında MSE, gradyan iniş, normal denklem, polinom genişletme — her ML algoritmasında karşına çıkacak temel kavramlar var.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>y = wx + b ile tek değişkenli lineer regresyonu çıkaracaksın</li><li>MSE kaybını formülünden hesaplayıp gradyan inişle minimize edeceksin</li><li>Çoklu öznitelikli regresyonu normal denklem ile kapalı formda çözeceksin</li><li>Polinom genişletme ile lineer-olmayan ilişkileri lineer modele sığdıracaksın</li><li>sklearn.LinearRegression\'ı churn ücret verisinde fit edip R² ile değerlendireceksin</li></ul></div>'

+ '<h2 class="l-title">1. Regresyon Nedir?</h2>'

+ '<p class="l-text"><strong>Regresyon</strong>, hedef değerin <em>sürekli bir sayı</em> olduğu denetimli öğrenme görevidir. <a href="/tutorials/ai/ml/what-is-machine-learning">Ders 1</a>\'deki müşteri kayıp veri setimizden bir alt-problemi düşün: "Bu müşteri gelecek 12 ayda toplam ne kadar ödeyecek?" Cevap 1240 TL, 980 TL, 2150 TL gibi sürekli bir sayıdır. Sınıflandırmadan farkı budur — sınıflandırma "evet/hayır" gibi kesik etiketler verir; regresyon sayısal bir tahmin.</p>'

+ '<div class="calc-example"><div class="example-label">BU DERSİN MİNİ ÖRNEĞİ — YAŞ vs AYLIK ÜCRET</div><div class="example-body">'
+ '<p class="l-text">L1\'deki 6 müşteriden alınan basitleştirilmiş veri:</p>'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Müşteri</th><th style="padding:.5rem">Yaş (x)</th><th style="padding:.5rem">Aylık Ücret TL (y)</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">M1</td><td style="text-align:center">28</td><td style="text-align:center">120</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">M2</td><td style="text-align:center">62</td><td style="text-align:center">220</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">M3</td><td style="text-align:center">35</td><td style="text-align:center">85</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">M4</td><td style="text-align:center">48</td><td style="text-align:center">180</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">M5</td><td style="text-align:center">31</td><td style="text-align:center">95</td></tr>'
+ '<tr><td style="padding:.4rem">M6</td><td style="text-align:center">55</td><td style="text-align:center">240</td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text" style="margin-top:1rem">Görsel olarak yaş arttıkça ücret de artıyor gibi. Lineer regresyon bunu bir <strong>doğru</strong>yla yakalar.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Lineer Regresyon — Tek Değişken</h2>'

+ '<p class="l-text">En basit haliyle lineer regresyon bir <strong>doğru</strong>nun denklemini öğrenir:</p>'

+ '<div class="katex-block">$$\\hat{y} = w \\cdot x + b$$</div>'

+ '<p class="l-text">Burada:</p>'

+ '<ul class="l-list">'
+ '<li><em>x</em> — girdi özelliği (yaş)</li>'
+ '<li><em>y</em> — gerçek hedef (ücret)</li>'
+ '<li><em>ŷ</em> — modelin tahmini</li>'
+ '<li><em>w</em> — eğim (slope, ağırlık)</li>'
+ '<li><em>b</em> — kesim noktası (intercept, bias)</li>'
+ '</ul>'

+ '<p class="l-text">Eğitim, en iyi <em>w</em> ve <em>b</em>\'yi bulmaktır — yani veriye en iyi uyan doğruyu çekmek. "En iyi"nin ne olduğunu tanımlamak için bir <strong>kayıp fonksiyonu</strong>na ihtiyacımız var.</p>'

+ '<h2 class="l-title">3. MSE — Karelenmiş Hata Ortalaması</h2>'

+ '<p class="l-text">Bir doğru çekersen, her gerçek noktanın doğruya olan dikey uzaklığı bir <em>hata</em>dır. Tüm hataları yakalamak için <strong>karelerini</strong> alıp ortalarız:</p>'

+ '<div class="katex-block">$$\\text{MSE}(w, b) = \\frac{1}{n} \\sum_{i=1}^{n} \\bigl( y_i - (w x_i + b) \\bigr)^2$$</div>'

+ '<p class="l-text">Niye <em>kare</em>? İki sebep:</p>'

+ '<ul class="l-list">'
+ '<li><strong>İşaret etkisini kaldırır:</strong> +5 ile -5 hataları toplanınca 0 olur, yanıltıcı. Kareleyince ikisi de 25.</li>'
+ '<li><strong>Büyük hataları daha çok cezalandırır:</strong> 10 birimlik hata 100 olur, 2 birimlik hata 4 — model "çok yanlış" tahminlerden uzak durmayı öğrenir.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Mini hesap</h3>'

+ '<p class="l-text">Diyelim ki <em>w = 4, b = 0</em> denedik. M1\'de ŷ = 4·28 + 0 = 112, gerçek 120 → hata 8, kare 64. Tüm noktalar için yapıp ortalayınca MSE çıkar. Farklı (w, b) denedikçe farklı MSE değerleri buluruz; en küçük MSE\'yi veren (w, b) kazanır.</p>'

+ '<h2 class="l-title">4. Optimizasyon — En Düşük Kayıbı Bulmak</h2>'

+ '<p class="l-text">MSE bir fonksiyon: <em>w</em> ve <em>b</em>\'ye bağlı bir 3 boyutlu yüzey. Görsel olarak <strong>kâse şeklinde</strong> bir yüzey çıkar — sadece bir tane minimum noktası var (lineer regresyonda kayıp fonksiyonu konvekstir, bu özel bir özellik).</p>'

+ '<p class="l-text">Bu minimumu bulmanın iki yolu var:</p>'

+ '<h3 class="l-subtitle">Yöntem 1: Normal denklem (kapalı form)</h3>'

+ '<p class="l-text">Kalkülüs ile MSE\'nin türevini sıfıra eşitleyip <em>w</em> ve <em>b</em>\'yi doğrudan çözebiliriz. Çoklu özellik için matris formu:</p>'

+ '<div class="katex-block">$$\\hat{w} = (X^\\top X)^{-1} X^\\top y$$</div>'

+ '<p class="l-text">Tek satır matematik. Avantaj: tek adımda kesin çözüm. Dezavantaj: <em>X</em>\'in çok büyük olduğu durumlarda matris tersini almak çok pahalı (kübik karmaşıklık). Pratik olarak 10.000\'den fazla özellikte kullanılmaz.</p>'

+ '<h3 class="l-subtitle">Yöntem 2: Gradyan iniş (gradient descent)</h3>'

+ '<p class="l-text">Büyük veriler için iteratif yöntem: kayıp yüzeyinde "aşağı doğru" küçük adımlarla yürürüz.</p>'

+ '<div class="katex-block">$$w \\leftarrow w - \\eta \\cdot \\frac{\\partial \\text{MSE}}{\\partial w}, \\qquad b \\leftarrow b - \\eta \\cdot \\frac{\\partial \\text{MSE}}{\\partial b}$$</div>'

+ '<p class="l-text"><em>η</em> (eta) <strong>öğrenme oranı</strong>dır — adım büyüklüğü. Çok büyükse minimumu zıplayıp geçeriz; çok küçükse sonsuza kadar yürürüz. Tipik değerler 0.001-0.1.</p>'

+ '<div class="l-note"><strong>Sezgi:</strong> Kayıp yüzeyini sisli bir vadi gibi düşün. Top yamaçtan aşağı yuvarlanır, her adımda "şu an hangi yöne eğim aşağı?" sorusunun cevabıyla küçük bir hareket yapar. Yeterince adımdan sonra dibe ulaşır — burada (w, b) MSE\'yi minimize eder.</div>'

+ '<div class="plotly-graph"><div id="plot-fit-tr" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var x=[28,62,35,48,31,55];'
+ 'var y=[120,220,85,180,95,240];'
+ 'var w=4.05, b=-21.5;'
+ 'var lx=[25,65];'
+ 'var ly=[w*25+b, w*65+b];'
+ 'var t1={x:x,y:y,name:"Müşteriler",type:"scatter",mode:"markers",marker:{color:T.accent,size:12}};'
+ 'var t2={x:lx,y:ly,name:"En iyi doğru: y = 4.05·x − 21.5",type:"scatter",mode:"lines",line:{color:"rgba(248,113,113,.85)",width:3}};'
+ 'var layout={title:{text:"Lineer regresyon: yaşa göre aylık ücret",font:{color:T.text,size:13}},xaxis:{title:"Yaş",color:T.text,gridcolor:T.grid},yaxis:{title:"Aylık ücret (TL)",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-fit-tr"))Plotly.newPlot("plot-fit-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Mor noktalar 6 müşterimizi gösteriyor (yaş, aylık ücret). Kırmızı doğru, MSE\'yi minimize eden lineer regresyon sonucu — eğim 4.05, kesim noktası -21.5. Yorum: yaş 1 yıl artınca aylık ücret yaklaşık 4 TL artar. Mükemmel bir uyum yok (bazı noktalar uzakta), çünkü sadece "yaş" özelliğine bakıyoruz; gerçekte sözleşme tipi, kullanım süresi de etkiliyor — sonraki bölümde çok-değişkene geçeceğiz.</div>'

+ '<h2 class="l-title">5. Çoklu Lineer Regresyon — Çok Özellik</h2>'

+ '<p class="l-text">Gerçek dünyada bir şeyi tek bir özellik açıklamaz. Müşteri ücretini sadece yaş değil; kullanım süresi, sözleşme tipi de etkiler. <strong>Çoklu lineer regresyon</strong> birden çok girdiyi alır:</p>'

+ '<div class="katex-block">$$\\hat{y} = w_1 x_1 + w_2 x_2 + \\cdots + w_p x_p + b = \\mathbf{w}^\\top \\mathbf{x} + b$$</div>'

+ '<p class="l-text">Tek bir doğru yerine çok-boyutlu bir <strong>düzlem</strong> (2 özellik) veya <strong>hiperdüzlem</strong> (3+ özellik). Her özelliğin kendi ağırlığı var. Eğitim mantığı aynı — MSE\'yi minimize et.</p>'

+ '<p class="l-text">Vektör notasyonuyla matematiğin tamamı tek bir formüle indirgenir. Bu yüzden lineer cebir ML\'in temelidir (<a href="/tutorials/math/linalg/">Doğrusal Cebir kursu</a>).</p>'

+ '<h2 class="l-title">6. Lineer Olmayan İlişkiler — Polinom Genişletme</h2>'

+ '<p class="l-text">Müşteri verisinde aylık ücret yaşla <em>doğrusal değil</em> de <em>eğri</em> şeklinde artıyorsa? Lineer regresyonun tek doğrusu yetersiz kalır. Çözüm: <strong>polinom genişletme</strong>. Yeni özellikler türetiriz: x², x³ gibi.</p>'

+ '<div class="katex-block">$$\\hat{y} = w_1 x + w_2 x^2 + w_3 x^3 + b$$</div>'

+ '<p class="l-text">Model hâlâ <em>parametreler açısından lineer</em>; sadece girdileri zenginleştirdik. <code>sklearn.preprocessing.PolynomialFeatures</code> bunu otomatik yapar.</p>'

+ '<div class="calc-example"><div class="example-label">DERECE SEÇİMİ TEHLİKESİ</div><div class="example-body">'
+ '<p class="l-text">Polinom derecesini abartmak <strong>aşırı öğrenmeye</strong> (overfitting) yol açar:</p>'
+ '<ul class="l-list" style="margin-top:.4rem">'
+ '<li><strong>1. derece (doğru):</strong> Veriye yetersiz uyum (underfit). Karmaşık örüntüleri kaçırır.</li>'
+ '<li><strong>3. derece:</strong> Çoğu durum için iyi denge.</li>'
+ '<li><strong>15. derece:</strong> Eğitim noktalarına mükemmel uyar ama gürültüyü de öğrenir; yeni veride bozulur.</li>'
+ '</ul>'
+ '<p class="l-text" style="margin-top:.4rem">Bu denge sorununa <strong>bias-variance trade-off</strong> denir; <a href="/tutorials/ai/ml/generalization-bias-variance">Ders 4</a>\'te derinlemesine işleyeceğiz.</p>'
+ '</div></div>'

+ '<h2 class="l-title">7. Lineer Regresyonun Varsayımları</h2>'

+ '<p class="l-text">Lineer regresyon belirli varsayımlar altında en iyi sonucu verir:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Doğrusallık:</strong> Hedef ile özellikler arasında lineer (veya polinom genişletilmiş) ilişki olmalı.</li>'
+ '<li><strong>Bağımsızlık:</strong> Gözlemler birbirinden bağımsız olmalı (zaman serisinde değil).</li>'
+ '<li><strong>Homoscedasticity:</strong> Hata varyansı tüm girdilerde aynı olmalı.</li>'
+ '<li><strong>Normal hatalar:</strong> Hatalar ortalama 0 olan normal dağılım takip eder (istatistiksel çıkarım için).</li>'
+ '<li><strong>Çoklu doğrusallık (multicollinearity) yok:</strong> Özellikler birbirinden çok bağımlı olmamalı (örneğin "yaş" ve "doğum yılı" aynı bilgidir).</li>'
+ '</ul>'

+ '<p class="l-text">Pratikte tüm varsayımlar nadiren tutar; lineer regresyon yine de iyi bir <em>baseline</em>\'dır.</p>'

+ '<h2 class="l-title">8. Python — sklearn ile Lineer Regresyon</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Tek değişkenli lineer regresyon<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> numpy <span class="kw">as</span> np'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression'
+ '\n'
+ '\n<span class="cm"># L1\'deki 6 müşteri</span>'
+ '\nX = np.<span class="fn">array</span>([[<span class="num">28</span>], [<span class="num">62</span>], [<span class="num">35</span>], [<span class="num">48</span>], [<span class="num">31</span>], [<span class="num">55</span>]])'
+ '\ny = np.<span class="fn">array</span>([<span class="num">120</span>, <span class="num">220</span>, <span class="num">85</span>, <span class="num">180</span>, <span class="num">95</span>, <span class="num">240</span>])'
+ '\n'
+ '\nmodel = <span class="fn">LinearRegression</span>()'
+ '\nmodel.<span class="fn">fit</span>(X, y)'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="str">f"Eğim w = {model.coef_[0]:.2f}"</span>)         <span class="cm"># 4.05</span>'
+ '\n<span class="fn">print</span>(<span class="str">f"Kesim b = {model.intercept_:.2f}"</span>)       <span class="cm"># -21.5</span>'
+ '\n'
+ '\n<span class="cm"># Yeni bir 40 yaşındaki müşteri için tahmin</span>'
+ '\n<span class="fn">print</span>(model.<span class="fn">predict</span>([[<span class="num">40</span>]]))    <span class="cm"># [140.5]</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> sklearn\'in <code>LinearRegression</code> sınıfı normal denklemi kapalı formda çözer (büyük veri için <code>SGDRegressor</code> gradyan iniş kullanır). <code>X</code> matrisi 2 boyutlu olmalı (her satır bir örnek), <code>y</code> tek boyutlu vektör. Eğitim sonrası <code>model.coef_</code> öğrenilmiş ağırlıkları, <code>model.intercept_</code> bias\'ı verir. <code>predict</code> yeni veride tahmin üretir.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Çoklu özellik + polinom + değerlendirme<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> PolynomialFeatures'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> mean_squared_error, r2_score'
+ '\n'
+ '\n<span class="cm"># Çoklu özellik: yaş, kullanım süresi</span>'
+ '\nX = np.<span class="fn">array</span>([[<span class="num">28</span>,<span class="num">14</span>],[<span class="num">62</span>,<span class="num">3</span>],[<span class="num">35</span>,<span class="num">36</span>],[<span class="num">48</span>,<span class="num">2</span>],[<span class="num">31</span>,<span class="num">22</span>],[<span class="num">55</span>,<span class="num">5</span>]])'
+ '\ny = np.<span class="fn">array</span>([<span class="num">120</span>,<span class="num">220</span>,<span class="num">85</span>,<span class="num">180</span>,<span class="num">95</span>,<span class="num">240</span>])'
+ '\n'
+ '\n<span class="cm"># Polinom (derece 2) + lineer regresyon pipeline</span>'
+ '\nmodel = <span class="fn">make_pipeline</span>(<span class="fn">PolynomialFeatures</span>(<span class="num">2</span>), <span class="fn">LinearRegression</span>())'
+ '\nmodel.<span class="fn">fit</span>(X, y)'
+ '\n'
+ '\ny_pred = model.<span class="fn">predict</span>(X)'
+ '\n<span class="fn">print</span>(<span class="str">f"MSE: {mean_squared_error(y, y_pred):.2f}"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"R²:  {r2_score(y, y_pred):.3f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> İki özellik (yaş, kullanım süresi) ile çoklu lineer regresyon. <code>PolynomialFeatures(2)</code> derece 2\'ye kadar tüm polinom kombinasyonlarını otomatik üretir (x₁, x₂, x₁², x₁x₂, x₂²). <code>make_pipeline</code> bunu <code>LinearRegression</code>\'a bağlar. <code>r2_score</code> "modelin verinin varyansının yüzde kaçını açıklayabildiği"ni döner — 1\'e yakın iyi, 0 fena. <code>R² = 1</code> demek model her noktayı tam yakaladı (eğitim verisinde overfitting işaretidir!).</p>'

+ '<h2 class="l-title">9. R² — Açıklanan Varyans</h2>'

+ '<p class="l-text">MSE bir kayıp; ama "iyi mi kötü mü"yü yorumlamak için ölçek bağımlıdır (TL\'nin karesi). Bunun yerine sıkça <strong>R² (determinasyon katsayısı)</strong> kullanılır:</p>'

+ '<div class="katex-block">$$R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}$$</div>'

+ '<p class="l-text">Burada <em>ȳ</em> (y-bar) hedefin ortalamasıdır. Sezgi: "model, ortalama tahmin etmeye göre ne kadar iyi?"</p>'

+ '<ul class="l-list">'
+ '<li><strong>R² = 1:</strong> Mükemmel uyum, tüm varyans açıklandı.</li>'
+ '<li><strong>R² = 0:</strong> Model ortalamadan iyi değil.</li>'
+ '<li><strong>R² < 0:</strong> Model ortalamadan kötü (kötü model + yanlış yapılandırma).</li>'
+ '<li><strong>0.7-0.9:</strong> Pek çok pratik problemde iyi sayılır.</li>'
+ '</ul>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Lineer regresyon ile sayısal hedef tahminini öğrendik. Müşteri kayıp problemine geri döndüğümüzde aslında bize lazım olan farklı: "bu müşteri kayıp mı?" — sayı değil, evet/hayır cevabı. Bu sınıflandırma görevidir. <a href="/tutorials/ai/ml/logistic-regression-classification">Ders 3</a>\'te <strong>Lojistik Regresyon</strong> ile bunu çözmeye geçeceğiz. Lineer regresyonun kuzeni gibi düşünebilirsin — aynı doğrusal kombinasyon, ama çıktıyı 0-1 arası bir olasılığa sıkıştırıyor.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Regresyonun ne olduğunu (sürekli sayı tahmini) öğrendin. Lineer regresyonun denklemini (y = wx + b) ve geometrik anlamını gördün. MSE kayıp fonksiyonunu, niye kare aldığımızı kavradın. İki optimizasyon yöntemini (normal denklem ve gradyan iniş) ve avantajlarını tanıdın. Çoklu özellik ile çok-boyutlu hiperdüzlemleri, polinom genişletme ile lineer olmayan ilişkileri öğrendin. Lineer regresyonun varsayımlarını gördün. sklearn ile gerçek kod yazdın, R² metriği ile model kalitesini ölçtün.</div>'

,

en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> Linear regression is the most fundamental and oldest ML algorithm. You will learn to predict a numerical target — like <em>monthly fee from age</em> — on customer data. The model\'s heart is a line equation <em>(y = wx + b)</em>; behind that simplicity sit MSE, gradient descent, normal equation, polynomial expansion — concepts you will meet in every ML algorithm.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Derive single-variable linear regression as y = wx + b</li><li>Compute MSE from its formula and minimize it with gradient descent</li><li>Solve multi-feature regression in closed form with the normal equation</li><li>Fit non-linear relationships with polynomial expansion of features</li><li>Fit sklearn LinearRegression on churn fee data and score R²</li></ul></div>'

+ '<h2 class="l-title">1. What is Regression?</h2>'

+ '<p class="l-text"><strong>Regression</strong> is supervised learning where the target is a <em>continuous number</em>. From the customer churn data of <a href="/tutorials/ai/ml/what-is-machine-learning">Lesson 1</a> consider a sub-problem: "How much will this customer pay over the next 12 months?" The answer is a continuous number like $1,240 or $980 or $2,150. This differs from classification — classification produces discrete labels (yes/no); regression produces a numeric prediction.</p>'

+ '<div class="calc-example"><div class="example-label">RUNNING EXAMPLE — AGE vs MONTHLY FEE</div><div class="example-body">'
+ '<p class="l-text">Simplified data from L1\'s 6 customers:</p>'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Customer</th><th style="padding:.5rem">Age (x)</th><th style="padding:.5rem">Monthly Fee $ (y)</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">C1</td><td style="text-align:center">28</td><td style="text-align:center">30</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">C2</td><td style="text-align:center">62</td><td style="text-align:center">55</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">C3</td><td style="text-align:center">35</td><td style="text-align:center">22</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">C4</td><td style="text-align:center">48</td><td style="text-align:center">45</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">C5</td><td style="text-align:center">31</td><td style="text-align:center">24</td></tr>'
+ '<tr><td style="padding:.4rem">C6</td><td style="text-align:center">55</td><td style="text-align:center">60</td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text" style="margin-top:1rem">Visually fee seems to grow with age. Linear regression captures this with a <strong>line</strong>.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Linear Regression — One Variable</h2>'

+ '<p class="l-text">In its simplest form linear regression learns the equation of a <strong>line</strong>:</p>'

+ '<div class="katex-block">$$\\hat{y} = w \\cdot x + b$$</div>'

+ '<p class="l-text">Where:</p>'

+ '<ul class="l-list">'
+ '<li><em>x</em> — input feature (age)</li>'
+ '<li><em>y</em> — true target (fee)</li>'
+ '<li><em>ŷ</em> — model prediction</li>'
+ '<li><em>w</em> — slope (weight)</li>'
+ '<li><em>b</em> — intercept (bias)</li>'
+ '</ul>'

+ '<p class="l-text">Training is finding the best <em>w</em> and <em>b</em> — the line that best fits the data. To define "best" we need a <strong>loss function</strong>.</p>'

+ '<h2 class="l-title">3. MSE — Mean Squared Error</h2>'

+ '<p class="l-text">Once you draw a line, each true point\'s vertical distance to it is an <em>error</em>. To collect all errors we square them and average:</p>'

+ '<div class="katex-block">$$\\text{MSE}(w, b) = \\frac{1}{n} \\sum_{i=1}^{n} \\bigl( y_i - (w x_i + b) \\bigr)^2$$</div>'

+ '<p class="l-text">Why <em>square</em>? Two reasons:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Removes sign cancellation:</strong> +5 and -5 errors would sum to 0 — misleading. Squaring makes both 25.</li>'
+ '<li><strong>Penalises large errors more:</strong> a 10-unit error becomes 100, a 2-unit becomes 4 — the model learns to avoid "very wrong" predictions.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Quick computation</h3>'

+ '<p class="l-text">Suppose we try <em>w = 1, b = 0</em>. For C1, ŷ = 1·28 + 0 = 28, true 30 → error 2, squared 4. Doing this for all points and averaging gives MSE. Different (w, b) values give different MSE; the lowest one wins.</p>'

+ '<h2 class="l-title">4. Optimisation — Finding the Lowest Loss</h2>'

+ '<p class="l-text">MSE is a function of <em>w</em> and <em>b</em>: a 3D surface. It is <strong>bowl-shaped</strong> — exactly one minimum (in linear regression the loss is convex, a special property).</p>'

+ '<p class="l-text">Two ways to find this minimum:</p>'

+ '<h3 class="l-subtitle">Method 1: Normal equation (closed form)</h3>'

+ '<p class="l-text">Set the derivative of MSE to zero and solve directly. In matrix form for many features:</p>'

+ '<div class="katex-block">$$\\hat{w} = (X^\\top X)^{-1} X^\\top y$$</div>'

+ '<p class="l-text">One line of math. Pro: exact answer in one step. Con: inverting <em>X</em> is cubic in size — impractical past ~10,000 features.</p>'

+ '<h3 class="l-subtitle">Method 2: Gradient descent</h3>'

+ '<p class="l-text">For large data we iterate: take small steps "downhill" on the loss surface.</p>'

+ '<div class="katex-block">$$w \\leftarrow w - \\eta \\cdot \\frac{\\partial \\text{MSE}}{\\partial w}, \\qquad b \\leftarrow b - \\eta \\cdot \\frac{\\partial \\text{MSE}}{\\partial b}$$</div>'

+ '<p class="l-text"><em>η</em> (eta) is the <strong>learning rate</strong>. Too large: we overshoot the minimum. Too small: training takes forever. Typical values 0.001-0.1.</p>'

+ '<div class="l-note"><strong>Intuition:</strong> Picture the loss surface as a foggy valley. A ball rolls down each step, asking "which direction is steepest down right now?" After enough steps it reaches the bottom — there (w, b) minimises MSE.</div>'

+ '<div class="plotly-graph"><div id="plot-fit-en" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var x=[28,62,35,48,31,55];'
+ 'var y=[30,55,22,45,24,60];'
+ 'var w=1.05, b=-5.5;'
+ 'var lx=[25,65];'
+ 'var ly=[w*25+b, w*65+b];'
+ 'var t1={x:x,y:y,name:"Customers",type:"scatter",mode:"markers",marker:{color:T.accent,size:12}};'
+ 'var t2={x:lx,y:ly,name:"Best fit: y = 1.05·x − 5.5",type:"scatter",mode:"lines",line:{color:"rgba(248,113,113,.85)",width:3}};'
+ 'var layout={title:{text:"Linear regression: monthly fee by age",font:{color:T.text,size:13}},xaxis:{title:"Age",color:T.text,gridcolor:T.grid},yaxis:{title:"Monthly fee ($)",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-fit-en"))Plotly.newPlot("plot-fit-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Purple points are our 6 customers (age, monthly fee). The red line is the linear regression fit minimising MSE — slope ~1.05, intercept -5.5. Interpretation: each year of age adds ~$1 to the monthly fee. The fit is not perfect (some points are far) because we are using only "age"; in reality contract type and tenure also matter — multi-variable next.</div>'

+ '<h2 class="l-title">5. Multiple Linear Regression — Many Features</h2>'

+ '<p class="l-text">Real phenomena are rarely explained by a single feature. Customer fee depends not only on age but also on tenure and contract type. <strong>Multiple linear regression</strong> takes many inputs:</p>'

+ '<div class="katex-block">$$\\hat{y} = w_1 x_1 + w_2 x_2 + \\cdots + w_p x_p + b = \\mathbf{w}^\\top \\mathbf{x} + b$$</div>'

+ '<p class="l-text">Instead of a line we get a multi-dimensional <strong>plane</strong> (2 features) or <strong>hyperplane</strong> (3+). Every feature has its own weight. Training mechanics are identical — minimise MSE.</p>'

+ '<p class="l-text">In vector notation everything reduces to a single formula. This is why linear algebra is the foundation of ML (<a href="/tutorials/math/linalg/">Linear Algebra course</a>).</p>'

+ '<h2 class="l-title">6. Non-Linear Relationships — Polynomial Expansion</h2>'

+ '<p class="l-text">What if monthly fee grows with age <em>not as a line</em> but as a <em>curve</em>? A single straight line will not suffice. Solution: <strong>polynomial expansion</strong>. Derive new features: x², x³.</p>'

+ '<div class="katex-block">$$\\hat{y} = w_1 x + w_2 x^2 + w_3 x^3 + b$$</div>'

+ '<p class="l-text">The model is still <em>linear in parameters</em>; we just enriched the inputs. <code>sklearn.preprocessing.PolynomialFeatures</code> does this automatically.</p>'

+ '<div class="calc-example"><div class="example-label">DEGREE-CHOICE PITFALL</div><div class="example-body">'
+ '<p class="l-text">Using too high a polynomial degree leads to <strong>overfitting</strong>:</p>'
+ '<ul class="l-list" style="margin-top:.4rem">'
+ '<li><strong>Degree 1 (line):</strong> underfit — misses complex patterns.</li>'
+ '<li><strong>Degree 3:</strong> good balance for most problems.</li>'
+ '<li><strong>Degree 15:</strong> fits the training points perfectly but learns the noise too; breaks on new data.</li>'
+ '</ul>'
+ '<p class="l-text" style="margin-top:.4rem">This trade-off is called <strong>bias-variance trade-off</strong> — covered deeply in <a href="/tutorials/ai/ml/generalization-bias-variance">Lesson 4</a>.</p>'
+ '</div></div>'

+ '<h2 class="l-title">7. Assumptions of Linear Regression</h2>'

+ '<p class="l-text">Linear regression performs best under these assumptions:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Linearity:</strong> linear (or polynomial-expanded) relationship between target and features.</li>'
+ '<li><strong>Independence:</strong> observations are independent (not time-series).</li>'
+ '<li><strong>Homoscedasticity:</strong> error variance is constant across input values.</li>'
+ '<li><strong>Normal errors:</strong> errors follow a normal distribution centred at 0 (for statistical inference).</li>'
+ '<li><strong>No multicollinearity:</strong> features are not strongly dependent on one another (e.g. "age" and "birth year" are the same info).</li>'
+ '</ul>'

+ '<p class="l-text">In practice the assumptions rarely all hold; linear regression is still a solid <em>baseline</em>.</p>'

+ '<h2 class="l-title">8. Python — Linear Regression with sklearn</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Single-variable linear regression<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> numpy <span class="kw">as</span> np'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression'
+ '\n'
+ '\n<span class="cm"># 6 customers from L1</span>'
+ '\nX = np.<span class="fn">array</span>([[<span class="num">28</span>], [<span class="num">62</span>], [<span class="num">35</span>], [<span class="num">48</span>], [<span class="num">31</span>], [<span class="num">55</span>]])'
+ '\ny = np.<span class="fn">array</span>([<span class="num">30</span>, <span class="num">55</span>, <span class="num">22</span>, <span class="num">45</span>, <span class="num">24</span>, <span class="num">60</span>])'
+ '\n'
+ '\nmodel = <span class="fn">LinearRegression</span>()'
+ '\nmodel.<span class="fn">fit</span>(X, y)'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="str">f"Slope w = {model.coef_[0]:.2f}"</span>)        <span class="cm"># 1.05</span>'
+ '\n<span class="fn">print</span>(<span class="str">f"Intercept b = {model.intercept_:.2f}"</span>)   <span class="cm"># -5.5</span>'
+ '\n'
+ '\n<span class="cm"># Predict for a new 40-year-old customer</span>'
+ '\n<span class="fn">print</span>(model.<span class="fn">predict</span>([[<span class="num">40</span>]]))    <span class="cm"># [36.5]</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> sklearn\'s <code>LinearRegression</code> solves the normal equation in closed form (for big data use <code>SGDRegressor</code> which uses gradient descent). <code>X</code> must be 2D (each row an example), <code>y</code> 1D. After training, <code>model.coef_</code> gives the learned weights and <code>model.intercept_</code> the bias. <code>predict</code> generates predictions on new data.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Multi-feature + polynomial + evaluation<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> PolynomialFeatures'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> mean_squared_error, r2_score'
+ '\n'
+ '\n<span class="cm"># Multi-feature: age, tenure</span>'
+ '\nX = np.<span class="fn">array</span>([[<span class="num">28</span>,<span class="num">14</span>],[<span class="num">62</span>,<span class="num">3</span>],[<span class="num">35</span>,<span class="num">36</span>],[<span class="num">48</span>,<span class="num">2</span>],[<span class="num">31</span>,<span class="num">22</span>],[<span class="num">55</span>,<span class="num">5</span>]])'
+ '\ny = np.<span class="fn">array</span>([<span class="num">30</span>,<span class="num">55</span>,<span class="num">22</span>,<span class="num">45</span>,<span class="num">24</span>,<span class="num">60</span>])'
+ '\n'
+ '\n<span class="cm"># Polynomial (degree 2) + linear regression pipeline</span>'
+ '\nmodel = <span class="fn">make_pipeline</span>(<span class="fn">PolynomialFeatures</span>(<span class="num">2</span>), <span class="fn">LinearRegression</span>())'
+ '\nmodel.<span class="fn">fit</span>(X, y)'
+ '\n'
+ '\ny_pred = model.<span class="fn">predict</span>(X)'
+ '\n<span class="fn">print</span>(<span class="str">f"MSE: {mean_squared_error(y, y_pred):.2f}"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"R²:  {r2_score(y, y_pred):.3f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Multiple linear regression on two features (age, tenure). <code>PolynomialFeatures(2)</code> auto-generates all polynomial combinations up to degree 2 (x₁, x₂, x₁², x₁x₂, x₂²). <code>make_pipeline</code> chains it with <code>LinearRegression</code>. <code>r2_score</code> reports "what fraction of the target variance the model explains" — close to 1 is good, 0 is poor. <code>R² = 1</code> on training data is a sign of overfitting!</p>'

+ '<h2 class="l-title">9. R² — Explained Variance</h2>'

+ '<p class="l-text">MSE is a loss; "good or bad" is hard to read because it has units (dollars squared). The popular alternative is <strong>R² (coefficient of determination)</strong>:</p>'

+ '<div class="katex-block">$$R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}$$</div>'

+ '<p class="l-text">Where <em>ȳ</em> is the mean of the target. Intuition: "how much better is the model than always predicting the mean?"</p>'

+ '<ul class="l-list">'
+ '<li><strong>R² = 1:</strong> perfect fit, all variance explained.</li>'
+ '<li><strong>R² = 0:</strong> no better than predicting the mean.</li>'
+ '<li><strong>R² < 0:</strong> worse than the mean (broken model).</li>'
+ '<li><strong>0.7-0.9:</strong> good for many practical problems.</li>'
+ '</ul>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">Linear regression handled numeric prediction. Back to the churn problem: what we actually need is "is this customer going to leave?" — yes/no, not a number. That is classification. <a href="/tutorials/ai/ml/logistic-regression-classification">Lesson 3</a> moves to <strong>logistic regression</strong>. Think of it as linear regression\'s cousin — same linear combination, but the output is squashed into a probability between 0 and 1.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> What regression is (continuous-number prediction). The line equation (y = wx + b) and its geometric meaning. The MSE loss and why we square the errors. Two optimisation methods (normal equation and gradient descent) and their trade-offs. How multi-feature regression generalises to hyperplanes, and how polynomial expansion captures non-linear relationships. The assumptions of linear regression. Real sklearn code, and the R² metric for assessing model quality.</div>'

};
