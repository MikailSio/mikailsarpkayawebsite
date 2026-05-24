/* ml-L12.js — ML Theory Lesson 12: Support Vector Machines (TR + EN) */
var ML_L12 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> <a href="/tutorials/ml-theory/3">Ders 3</a>\'te lojistik regresyonun lineer karar sınırı çizdiğini, lineer olmadığında çekirdek (kernel) gerektiğini söylemiştik. Şimdi o sözü tutuyoruz: <strong>Support Vector Machine (SVM)</strong>. SVM\'nin tek bir doğru değil, <em>en geniş marjlı</em> doğruyu nasıl seçtiğini, Lagrange dualinin niye "destek vektörü" doğurduğunu, çekirdek hilesinin nasıl 2 boyuttaki dairesel kümeyi sonsuz boyutta lineer ayırdığını ve 2026\'da derin öğrenme çağında SVM\'in hâlâ niye anlamlı olduğunu göreceksin.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Maksimum marj sezgisi — niye en geniş şeritli ayırıcı en iyi genelleyendir</li><li>Primal optimizasyon problemini geometrik olarak kurmayı</li><li>Lagrange dualinin "destek vektörü" kavramını niye doğurduğunu</li><li>Soft margin: C parametresi ve slack ile gerçek dünyaya uyum</li><li>Çekirdek hilesi: φ(x) hesaplamadan iç çarpımı K(x,x\') ile elde etme</li><li>RBF, polinom, sigmoid çekirdeklerin karakter farkı</li><li>Çoklu sınıfta one-vs-rest ve one-vs-one stratejisi</li><li>SVM\'i lojistik regresyon ve random forest ile ne zaman tercih edersin</li></ul></div>'

+ '<h2 class="l-title">1. Marj Sezgisi — Niye Tek Bir Doğru Yetmez</h2>'

+ '<p class="l-text">İki sınıflı, lineer ayrılabilir bir veride lojistik regresyon <em>bir</em> ayırıcı doğru bulur. Ama sonsuz tane doğru iki kümeyi ayırabilir — hangisi en iyi? Lojistik regresyon "olabilirlik" maksimize eder ve bir doğru seçer; SVM ise <strong>geometrik bir kriter</strong> kullanır: <em>iki sınıfa en uzak olan</em> doğruyu seç.</p>'

+ '<p class="l-text">Bir doğrunun "iki sınıfa uzaklığı" denilen şey, ona en yakın noktanın uzaklığıdır. SVM bu uzaklığı her iki taraftan da maksimum yapan doğruyu arar — buna <strong>maksimum marj hiper düzlem</strong> denir. Marj ne kadar genişse, doğru o kadar "rahat" — küçük gürültü onu yanlış tarafa düşürmez.</p>'

+ '<div class="plotly-graph"><div id="plot-l12-margin-tr" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var x_neg=[1.0,1.4,1.8,2.2,1.6,2.4];var y_neg=[2.0,3.2,2.4,1.6,1.2,2.8];'
+ 'var x_pos=[4.0,4.4,4.8,5.2,4.6,5.0];var y_pos=[4.0,5.2,4.4,3.6,3.2,4.8];'
+ 'var bx=[0.5,6.0];var by=[1.5,5.5];'
+ 'var ux=[0.5,6.0];var uy=[2.7,6.7];'
+ 'var lx=[0.5,6.0];var ly=[0.3,4.3];'
+ 'var t1={x:x_neg,y:y_neg,name:"Sınıf -1",type:"scatter",mode:"markers",marker:{color:T.accent,size:13,symbol:"circle"}};'
+ 'var t2={x:x_pos,y:y_pos,name:"Sınıf +1",type:"scatter",mode:"markers",marker:{color:"rgba(248,113,113,.85)",size:13,symbol:"x"}};'
+ 'var t3={x:bx,y:by,name:"Karar düzlemi",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.95)",width:3}};'
+ 'var t4={x:ux,y:uy,name:"Marj +",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.4)",width:1,dash:"dash"}};'
+ 'var t5={x:lx,y:ly,name:"Marj -",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.4)",width:1,dash:"dash"}};'
+ 'var t6={x:[1.4,4.0],y:[3.2,4.0],name:"Destek vektörleri",type:"scatter",mode:"markers",marker:{color:"rgba(252,211,77,.9)",size:20,symbol:"circle-open",line:{width:3}}};'
+ 'var layout={xaxis:{title:"x₁",color:T.text,gridcolor:T.grid},yaxis:{title:"x₂",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:80,r:30,b:60,l:60},legend:{font:{color:T.text,size:10},orientation:"h",y:1.12,x:0.5,xanchor:"center"}};'
+ 'if(document.getElementById("plot-l12-margin-tr"))Plotly.newPlot("plot-l12-margin-tr",[t1,t2,t3,t4,t5,t6],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Mor düz çizgi SVM\'in seçtiği karar düzlemi; iki kesikli paralel çizgi marjın sınırlarını gösteriyor. Sarı halkalı iki nokta <em>destek vektörleri</em> — marja değen, doğrunun konumunu tamamen belirleyen noktalar. Diğer tüm noktalar silinse bile sınıflandırıcı değişmez. Bu "az sayıda kritik nokta" özelliği SVM\'in özüdür.</div>'

+ '<h2 class="l-title">2. Primal Problem — Geometrik Formülasyon</h2>'

+ '<p class="l-text">Karar düzlemini <em>w<sup>⊤</sup>x + b = 0</em> ile yazalım. Bir <em>x</em> noktasının bu düzleme uzaklığı:</p>'

+ '<div class="katex-block">$$d(\\mathbf{x}) = \\frac{|\\mathbf{w}^\\top \\mathbf{x} + b|}{\\lVert \\mathbf{w} \\rVert}$$</div>'

+ '<p class="l-text">Sınıf etiketlerini <em>y<sub>i</sub> ∈ {-1, +1}</em> seçersek (lojistik regresyonun {0,1} aksine), "doğru taraf" koşulunu tek formülle yazabiliriz: <em>y<sub>i</sub>(w<sup>⊤</sup>x<sub>i</sub> + b) ≥ 1</em>. Buradaki "1" ölçeklemeden gelir — w ve b\'yi öyle normalize ederiz ki marja en yakın noktada eşitlik tam olur.</p>'

+ '<p class="l-text">Marjın genişliği <em>2 / ‖w‖</em> olduğundan, marjı maksimize etmek <em>‖w‖</em>\'yi minimize etmektir. Hesap kolaylığı için karesini alıyoruz:</p>'

+ '<div class="katex-block">$$\\min_{\\mathbf{w}, b} \\; \\tfrac{1}{2} \\lVert \\mathbf{w} \\rVert^2 \\quad \\text{s.t.} \\quad y_i(\\mathbf{w}^\\top \\mathbf{x}_i + b) \\geq 1, \\;\\; \\forall i$$</div>'

+ '<p class="l-text">Bu bir <strong>kuadratik programlama (QP)</strong> problemidir: konveks amaç + lineer kısıtlar. Tek global minimum vardır — lojistik regresyondaki gibi yerel minimum derdi yok.</p>'

+ '<div class="calc-example"><div class="example-label">NIYE 1/2 ‖w‖²</div><div class="example-body">'
+ '<p class="l-text">‖w‖ ile ‖w‖² aynı minimumu verir (kare monotondur), ama ‖w‖² türevlenebilirdir (‖w‖ orijinde köşeli). 1/2 katsayısı türev alınınca güzelce sadeleşsin diye konur: <em>d/dw [½‖w‖²] = w</em>. Tamamen kozmetik bir tercih.</p>'
+ '</div></div>'

+ '<h2 class="l-title">3. Lagrange Duali — "Destek" Vektörü Niye Var</h2>'

+ '<p class="l-text">QP problemini Lagrange çarpanları ile yeniden yazalım. Her kısıt için bir <em>α<sub>i</sub> ≥ 0</em> çarpanı:</p>'

+ '<div class="katex-block">$$\\mathcal{L}(\\mathbf{w}, b, \\boldsymbol{\\alpha}) = \\tfrac{1}{2}\\lVert \\mathbf{w} \\rVert^2 - \\sum_{i=1}^{n} \\alpha_i \\bigl[\\, y_i(\\mathbf{w}^\\top \\mathbf{x}_i + b) - 1 \\,\\bigr]$$</div>'

+ '<p class="l-text">w ve b\'ye göre türev alıp sıfıra eşitleyerek <em>w = Σ α<sub>i</sub> y<sub>i</sub> x<sub>i</sub></em> ve <em>Σ α<sub>i</sub> y<sub>i</sub> = 0</em> elde ederiz. Bunları geri koyarsak primal yerine <strong>dual problem</strong> ortaya çıkar:</p>'

+ '<div class="katex-block">$$\\max_{\\boldsymbol{\\alpha}} \\; \\sum_{i=1}^{n} \\alpha_i - \\tfrac{1}{2} \\sum_{i,j} \\alpha_i \\alpha_j y_i y_j \\, \\mathbf{x}_i^\\top \\mathbf{x}_j \\quad \\text{s.t.} \\quad \\alpha_i \\geq 0, \\; \\sum_i \\alpha_i y_i = 0$$</div>'

+ '<p class="l-text">Bu formülün üç büyük güzelliği var:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Veri sadece iç çarpım olarak görünür (x<sub>i</sub><sup>⊤</sup>x<sub>j</sub>).</strong> İleride çekirdek hilesi tam buradan girecek — iç çarpımı başka bir fonksiyonla değiştireceğiz.</li>'
+ '<li><strong>KKT koşulları çoğu α<sub>i</sub>\'yi sıfır yapar.</strong> Yalnızca marja değen (veya ileride göreceğimiz gibi marjı ihlal eden) noktalarda <em>α<sub>i</sub> &gt; 0</em>. Bu noktalar <em>destek vektörleri</em>.</li>'
+ '<li><strong>Tahmin de sadece destek vektörlerini kullanır:</strong> <em>f(x) = sign(Σ<sub>i ∈ SV</sub> α<sub>i</sub> y<sub>i</sub> x<sub>i</sub><sup>⊤</sup>x + b)</em>.</li>'
+ '</ul>'

+ '<p class="l-text">İşte SVM\'in adının kaynağı bu: model tüm eğitim verisini değil, <em>küçük bir destek vektörü kümesini</em> "taşır". 10000 örnekle eğitilse bile, tahmin zamanı belki 200 destek vektörüyle çalışır — verimli ve yorumlanabilir.</p>'

+ '<h2 class="l-title">4. Soft Margin — Gerçek Dünyada Kusursuz Ayrım Yok</h2>'

+ '<p class="l-text">Şimdiye kadar veri <em>lineer ayrılabilir</em> varsayıldı. Pratikte gürültü, etiket hatası, doğal örtüşme yüzünden bu çok nadirdir. Cortes &amp; Vapnik (1995) çözümü: <strong>slack değişkenleri</strong> <em>ξ<sub>i</sub> ≥ 0</em> ekle, her örnek için marjı bir miktar ihlal etmeye izin ver:</p>'

+ '<div class="katex-block">$$\\min_{\\mathbf{w},b,\\boldsymbol{\\xi}} \\; \\tfrac{1}{2}\\lVert \\mathbf{w} \\rVert^2 + C \\sum_{i=1}^{n} \\xi_i \\quad \\text{s.t.} \\quad y_i(\\mathbf{w}^\\top \\mathbf{x}_i + b) \\geq 1 - \\xi_i, \\;\\; \\xi_i \\geq 0$$</div>'

+ '<p class="l-text"><em>C</em> parametresi modelin dikkatini ayarlar:</p>'

+ '<ul class="l-list">'
+ '<li><strong>C büyük (örn. 1000):</strong> ihlal pahalı, model olabildiğince az hata yapmaya çalışır → dar marj, overfit riski.</li>'
+ '<li><strong>C küçük (örn. 0.01):</strong> ihlal ucuz, model geniş marj kurmaya odaklanır → bazı eğitim hataları kabul, daha iyi genelleme.</li>'
+ '<li><strong>C → ∞:</strong> hard margin\'a (Bölüm 2) geri dönülür.</li>'
+ '</ul>'

+ '<p class="l-text">C\'nin doğru değeri verilerin gürültü seviyesine ve örtüşmesine bağlıdır — <a href="/tutorials/ml-theory/4">Ders 4</a>\'teki cross-validation ile bulunur. Pratik tavsiye: log-uzayda <em>C ∈ {0.01, 0.1, 1, 10, 100}</em> ızgarası ile başla.</p>'

+ '<h2 class="l-title">5. Çekirdek Hilesi — Yüksek Boyutta Lineer Ayrım</h2>'

+ '<p class="l-text">Veri lineer ayrılabilir değilse ne yapacağız? Klasik fikir: özellikleri öyle bir <em>φ(x)</em> dönüşümüyle yüksek boyutlu uzaya taşı ki orada lineer ayrılabilir olsun. Örneğin 2 boyutta dairesel veri, <em>φ(x, y) = (x, y, x² + y²)</em> ile 3 boyutta yatay düzlemle ayrılabilir.</p>'

+ '<p class="l-text">Sorun: φ(x) çok yüksek boyutlu olabilir (hatta sonsuz). Bunu açıkça hesaplamak çoğu zaman imkânsız. Ama bölüm 3\'te gördük ki SVM\'in dual formülünde veri sadece iç çarpım olarak görünür. O zaman bizim ihtiyacımız olan tek şey:</p>'

+ '<div class="katex-block">$$K(\\mathbf{x}, \\mathbf{x}\') = \\phi(\\mathbf{x})^\\top \\phi(\\mathbf{x}\')$$</div>'

+ '<p class="l-text">Yani φ\'yi açıkça hesaplamadan, sadece "yüksek boyuttaki iç çarpımı" verebilecek bir K fonksiyonu yeterli. Buna <strong>çekirdek hilesi (kernel trick)</strong> denir. Mercer teoremi diyor ki: K simetrik ve pozitif yarı tanımlı ise, böyle bir φ <em>vardır</em> — onu hiç görmesek de.</p>'

+ '<div class="calc-example"><div class="example-label">SOMUT ÖRNEK — POLINOM ÇEKIRDEK</div><div class="example-body">'
+ '<p class="l-text">2 boyutta polinom çekirdek <em>K(x, x\') = (x<sup>⊤</sup>x\' + 1)²</em>. Açarsak:</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7;padding:.5rem 1rem">'
+ '(x₁x₁\' + x₂x₂\' + 1)² ='
+ '<br>x₁²x₁\'² + x₂²x₂\'² + 2x₁x₂x₁\'x₂\' + 2x₁x₁\' + 2x₂x₂\' + 1'
+ '</p>'
+ '<p class="l-text">Bu <em>φ(x) = (x₁², x₂², √2·x₁x₂, √2·x₁, √2·x₂, 1)</em> ile iç çarpıma eşit — 6 boyutlu özellik uzayı. K\'yı doğrudan hesaplamak O(d), φ üzerinden hesaplamak O(d²) — büyük d için fark muazzam.</p>'
+ '</div></div>'

+ '<h2 class="l-title">6. Popüler Çekirdekler — Karakterleri</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Lineer</div><div class="card-body"><em>K(x, x\') = x<sup>⊤</sup>x\'</em>. Hiç dönüşüm yok, sadece iç çarpım. Yüksek boyutlu seyrek verilerde (metin, TF-IDF) tercih edilir — özellikler zaten yeterince ayrımcı.</div></div>'
+ '<div class="calc-card"><div class="card-title">Polinom</div><div class="card-body"><em>K(x, x\') = (γ x<sup>⊤</sup>x\' + r)<sup>d</sup></em>. Derece <em>d</em> kontrol eder. Düşük dereceler (2-3) genelde yeter; yüksek derecelerde sayısal patlama ve overfit.</div></div>'
+ '<div class="calc-card"><div class="card-title">RBF (Gauss)</div><div class="card-body"><em>K(x, x\') = exp(-γ ‖x - x\'‖²)</em>. Sonsuz boyutlu φ\'ye karşılık gelir. Genel amaçlı, "varsayılan" tercih. γ küçük → geniş yumuşak sınır; γ büyük → dar dalgalı sınır.</div></div>'
+ '<div class="calc-card"><div class="card-title">Sigmoid</div><div class="card-body"><em>K(x, x\') = tanh(γ x<sup>⊤</sup>x\' + r)</em>. Bazı γ, r için Mercer şartını sağlamaz — pozitif tanımlı olmayabilir. Tarihsel olarak ilginç (yapay sinir ağına benzer) ama pratikte nadir tercih edilir.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>γ parametresi RBF\'in canıdır.</strong> Tek bir eğitim noktasının "etki alanını" belirler. γ büyükse her nokta etrafına dar bir tepe kurar — model her noktayı ezberlemeye yatkın, overfit. γ küçükse tepe geniş — model çok yumuşak, underfit. C ile γ birlikte tune edilir (genelde 2D ızgara araması).</p>'

+ '<div class="plotly-graph"><div id="plot-l12-kernels-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var xs=[];for(var i=-30;i<=30;i++)xs.push(i/10);'
+ 'var rbf_small=[],rbf_med=[],rbf_large=[];'
+ 'for(var i=0;i<xs.length;i++){'
+ 'rbf_small.push(Math.exp(-0.1*xs[i]*xs[i]));'
+ 'rbf_med.push(Math.exp(-1.0*xs[i]*xs[i]));'
+ 'rbf_large.push(Math.exp(-5.0*xs[i]*xs[i]));'
+ '}'
+ 'var t1={x:xs,y:rbf_small,name:"γ = 0.1 (geniş)",type:"scatter",mode:"lines",line:{color:T.accent,width:3}};'
+ 'var t2={x:xs,y:rbf_med,name:"γ = 1.0 (orta)",type:"scatter",mode:"lines",line:{color:"rgba(78,205,196,.9)",width:3}};'
+ 'var t3={x:xs,y:rbf_large,name:"γ = 5.0 (dar)",type:"scatter",mode:"lines",line:{color:"rgba(248,113,113,.9)",width:3}};'
+ 'var layout={xaxis:{title:"x",color:T.text,gridcolor:T.grid},yaxis:{title:"K(0, x)",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:80,r:30,b:60,l:60},legend:{font:{color:T.text,size:10},orientation:"h",y:1.12,x:0.5,xanchor:"center"}};'
+ 'if(document.getElementById("plot-l12-kernels-tr"))Plotly.newPlot("plot-l12-kernels-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> RBF çekirdeği <em>K(0, x) = exp(-γx²)</em> orijindeki bir eğitim noktasının komşu noktalarla benzerliğini gösterir. γ küçükse benzerlik uzağa yayılır (geniş tepe → yumuşak sınır). γ büyükse benzerlik sadece çok yakın noktalara — model her noktayı ayrı bir adacık olarak görür, overfit. γ\'yı sezgisel düşünebilirsin: "kaç komşuya benzersin?"</div>'

+ '<h2 class="l-title">7. Çoklu Sınıf — One-vs-Rest vs One-vs-One</h2>'

+ '<p class="l-text">SVM doğası gereği ikili sınıflandırıcıdır. K sınıf varsa iki strateji:</p>'

+ '<ul class="l-list">'
+ '<li><strong>One-vs-Rest (OvR):</strong> K tane sınıflandırıcı eğit. Her biri "ben mi, gerisi mi?" sorusunu sorar. Tahminde en yüksek skoru veren sınıfı seç. Eğitim ucuz (K model), ama sınıflar dengesiz olur (1 vs K-1).</li>'
+ '<li><strong>One-vs-One (OvO):</strong> Her sınıf çifti için bir model — toplam K(K-1)/2 model. Tahminde oy çoğunluğu. Her model küçük veri üstünde eğitildiği için hızlı; ama K büyükse model sayısı patlar.</li>'
+ '</ul>'

+ '<p class="l-text">sklearn\'de <em>SVC</em> varsayılan olarak OvO kullanır (10 sınıf = 45 model), <em>LinearSVC</em> ise OvR. Pratikte K ≤ 10 için OvO, K büyükse OvR daha mantıklı.</p>'

+ '<h2 class="l-title">8. SVM vs Lojistik Regresyon vs Random Forest</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Lojistik Regresyon</div><div class="card-body">Doğal olasılık çıktısı, kalibre. Yorumlanabilir katsayılar. Lineer karar sınırı (kernel\'siz). Çok büyük veride (milyon örnek) ölçeklenir.</div></div>'
+ '<div class="calc-card"><div class="card-title">SVM (RBF)</div><div class="card-body">Lineer olmayan sınırlarda güçlü. Az veride, çok özellikte (n &lt; p durumu) parlar — örn. genomik. Olasılık vermez (Platt scaling ile sonradan eklenir). O(n²)-O(n³) — &gt; 50k örnekte yavaş.</div></div>'
+ '<div class="calc-card"><div class="card-title">Random Forest</div><div class="card-body">Karışık tipler (sayısal + kategorik), eksik veri, doğrusal-olmayan etkileşimler — hepsi sıfır ayar. Özellik önem skoru bonus. Ama metin gibi seyrek yüksek-boyutta SVM\'e yenilir.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Ne zaman SVM seç?</strong></p>'

+ '<ul class="l-list">'
+ '<li>Veri orta büyüklükte (~1k - 50k örnek), özellik sayısı yüksek</li>'
+ '<li>Özellikler zaten ön-işlenmiş, ölçeklenmiş (SVM scale\'e duyarlıdır)</li>'
+ '<li>Lineer sınır yetmiyor ama derin ağ kurmak için veri/zaman yok</li>'
+ '<li>Metin sınıflandırma baseline (TF-IDF + LinearSVC klasik tarif)</li>'
+ '<li>Bioinformatik, görüntüde özel özellikler (HOG, SIFT) üstünde sınıflandırma</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Ne zaman SVM kaçır?</strong> Veri çok büyükse (&gt; 100k), eğitim O(n²)-O(n³) yüzünden çile olur. Karışık tipli tablo verisinde gradient boosting (XGBoost, LightGBM) daha az emek ile daha iyi sonuç verir. Sinir ağlarının "feature öğrenmesi" gerektiği görsel/ses problemlerinde rakip değildir.</p>'

+ '<h2 class="l-title">9. Lineer Ayrılamaz Toy Veri — Çekirdek Demo</h2>'

+ '<p class="l-text">Şimdi somut bir örnek: iç içe iki daire — lineer hiçbir doğru ayıramaz. Lojistik regresyon başarısız olur (~%50). RBF çekirdekli SVM dairesel bir sınır öğrenir ve neredeyse mükemmel ayırır.</p>'

+ '<div class="plotly-graph"><div id="plot-l12-circles-tr" style="width:100%;height:420px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'function rng(s){return function(){s=(s*9301+49297)%233280;return s/233280;};}'
+ 'var r=rng(11);'
+ 'var inX=[],inY=[],outX=[],outY=[];'
+ 'for(var i=0;i<80;i++){var th=2*Math.PI*r();var rad=0.3+0.15*r();inX.push(rad*Math.cos(th));inY.push(rad*Math.sin(th));}'
+ 'for(var i=0;i<120;i++){var th=2*Math.PI*r();var rad=0.8+0.15*r();outX.push(rad*Math.cos(th));outY.push(rad*Math.sin(th));}'
+ 'var bx=[],by=[];for(var i=0;i<=360;i++){var th=i*Math.PI/180;bx.push(0.55*Math.cos(th));by.push(0.55*Math.sin(th));}'
+ 'var t1={x:inX,y:inY,name:"Sınıf -1",type:"scatter",mode:"markers",marker:{color:T.accent,size:9,symbol:"circle"}};'
+ 'var t2={x:outX,y:outY,name:"Sınıf +1",type:"scatter",mode:"markers",marker:{color:"rgba(248,113,113,.85)",size:9,symbol:"x"}};'
+ 'var t3={x:bx,y:by,name:"RBF-SVM karar sınırı",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.95)",width:3,dash:"dash"}};'
+ 'var layout={xaxis:{title:"x₁",color:T.text,gridcolor:T.grid,range:[-1.2,1.2]},yaxis:{title:"x₂",color:T.text,gridcolor:T.grid,range:[-1.2,1.2],scaleanchor:"x"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:80,r:30,b:60,l:60},legend:{font:{color:T.text,size:10},orientation:"h",y:1.12,x:0.5,xanchor:"center"}};'
+ 'if(document.getElementById("plot-l12-circles-tr"))Plotly.newPlot("plot-l12-circles-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> İçteki mor küme ile dıştaki kırmızı halka düz bir çizgiyle ayrılamaz — lojistik regresyon bu veride neredeyse rastgele tahmin yapar. RBF çekirdekli SVM ise φ ile veriyi yüksek boyuta taşır, orada düz bir hiperdüzlemle ayırır; o düzlem orijinal 2B uzaya geri yansıtıldığında <em>daire</em> olur. Çekirdek hilesi tek satırla (kernel=\'rbf\') bunu sağlar — açıkça φ tanımlamayız.</div>'

+ '<h2 class="l-title">10. Özet — 2026\'da SVM Niye Hâlâ Önemli</h2>'

+ '<p class="l-text">Transformer\'ların ve büyük dil modellerinin gölgesinde SVM bazen "eski moda" gibi görünür. Ama 2026 pratiğinde hâlâ çok geçerli yerleri var:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Küçük veri rejimi:</strong> 100-5000 örnekte derin ağlar overfit ederken SVM dürüst çalışır. Tıbbi görüntüleme, nadir hastalık sınıflandırması, küçük ölçekli A/B test sonuçları.</li>'
+ '<li><strong>Metin baseline:</strong> Yeni bir NLP problemine ilk darbeyi atarken TF-IDF + LinearSVC hâlâ standart referans. BERT\'in marjinal kazançını ölçmek için bu baseline\'ı geçmen gerekir.</li>'
+ '<li><strong>Tablo verisi, az gürültü:</strong> Bioinformatik özellik vektörleri, sinyal işleme sonrası çıkarılan istatistiksel öznitelikler.</li>'
+ '<li><strong>Yorumlanabilirlik:</strong> Lineer SVM\'in ağırlıkları doğrudan "hangi özellik kararı ne kadar etkiledi"\'yi söyler.</li>'
+ '<li><strong>Olasılık değil, karar gerektiren senaryolar:</strong> Bir-sınıf SVM (OneClassSVM) ile anomali tespiti.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Ne zaman SVM\'i geçtik?</strong> Görüntü, ses, doğal dil <em>üretimi</em> görevlerinde derin ağlar tartışmasız üstündür — çünkü bu modallar "feature öğrenme" gerektirir, SVM\'in beklediği "hazır feature vektörü" varsayımı kırılır. Büyük tablo veride (&gt; 1M satır) gradient boosting ailesinin (XGBoost, LightGBM, CatBoost) hız ve doğruluk avantajı belirgindir.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Maksimum marj sezgisini — niye sonsuz ayrıcıdan en geniş şeritlisini seçtiğimizi — kavradın. Primal kuadratik problemi geometrik olarak kurabilir, Lagrange duali aracılığıyla destek vektörü kavramının niye doğal olarak ortaya çıktığını açıklayabilirsin. Soft margin\'da C parametresinin marj genişliği ile eğitim hatası arasındaki dengeyi nasıl ayarladığını gördün. Çekirdek hilesini — φ\'yi açıkça hesaplamadan yüksek-boyut iç çarpımını K ile elde etmeyi — öğrendin. RBF, polinom ve diğer çekirdeklerin pratik karakter farkını biliyorsun. Çoklu sınıfta one-vs-rest ve one-vs-one stratejilerini, SVM\'in lojistik regresyon ve random forest karşısında ne zaman tercih edileceğini ve 2026\'da hâlâ neden anlamlı olduğunu öğrendin. <a href="/tutorials/sklearn/9">Sklearn Ders 9</a>\'da bu teoriyi sklearn API\'siyle hayata geçireceğiz: SVC, kernel seçimi, GridSearchCV ile C ve γ ayarı, LinearSVC ve SVR.</div>'

,

en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> In <a href="/tutorials/ml-theory/3">Lesson 3</a> we said logistic regression draws a linear decision boundary, and when that is not enough you need kernels. Time to deliver on that promise: <strong>Support Vector Machines (SVM)</strong>. You will see why SVM picks not just any separator but the <em>maximum-margin</em> one, why the Lagrangian dual gives rise to "support vectors", how the kernel trick lets us draw a circular boundary in 2D by going to infinite dimensions, and why SVMs still earn their place in the deep-learning era of 2026.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>The margin intuition — why the widest-corridor separator generalises best</li><li>Formulate the primal SVM optimisation geometrically</li><li>How the Lagrangian dual naturally gives rise to "support vectors"</li><li>Soft margin: how C and slack variables handle real-world overlap</li><li>The kernel trick: getting inner products in φ-space without computing φ</li><li>Practical differences between RBF, polynomial, and sigmoid kernels</li><li>Multi-class strategies: one-vs-rest vs one-vs-one</li><li>When to pick SVM over logistic regression or random forest</li></ul></div>'

+ '<h2 class="l-title">1. The Margin Intuition — Why One Line Is Not Enough</h2>'

+ '<p class="l-text">On a linearly separable 2-class dataset, logistic regression finds <em>a</em> separating line. But infinitely many lines separate the two clusters — which is best? Logistic regression maximises likelihood and picks one; SVM uses a <strong>geometric criterion</strong> instead: pick the line that is <em>furthest from both classes</em>.</p>'

+ '<p class="l-text">The "distance from both classes" is the distance to the nearest point. SVM maximises this distance on both sides — the resulting line is called the <strong>maximum-margin hyperplane</strong>. The wider the margin, the more "comfortable" the boundary: small noise will not flip the verdict.</p>'

+ '<div class="plotly-graph"><div id="plot-l12-margin-en" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var x_neg=[1.0,1.4,1.8,2.2,1.6,2.4];var y_neg=[2.0,3.2,2.4,1.6,1.2,2.8];'
+ 'var x_pos=[4.0,4.4,4.8,5.2,4.6,5.0];var y_pos=[4.0,5.2,4.4,3.6,3.2,4.8];'
+ 'var bx=[0.5,6.0];var by=[1.5,5.5];'
+ 'var ux=[0.5,6.0];var uy=[2.7,6.7];'
+ 'var lx=[0.5,6.0];var ly=[0.3,4.3];'
+ 'var t1={x:x_neg,y:y_neg,name:"Class -1",type:"scatter",mode:"markers",marker:{color:T.accent,size:13,symbol:"circle"}};'
+ 'var t2={x:x_pos,y:y_pos,name:"Class +1",type:"scatter",mode:"markers",marker:{color:"rgba(248,113,113,.85)",size:13,symbol:"x"}};'
+ 'var t3={x:bx,y:by,name:"Decision boundary",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.95)",width:3}};'
+ 'var t4={x:ux,y:uy,name:"Margin +",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.4)",width:1,dash:"dash"}};'
+ 'var t5={x:lx,y:ly,name:"Margin -",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.4)",width:1,dash:"dash"}};'
+ 'var t6={x:[1.4,4.0],y:[3.2,4.0],name:"Support vectors",type:"scatter",mode:"markers",marker:{color:"rgba(252,211,77,.9)",size:20,symbol:"circle-open",line:{width:3}}};'
+ 'var layout={xaxis:{title:"x₁",color:T.text,gridcolor:T.grid},yaxis:{title:"x₂",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:80,r:30,b:60,l:60},legend:{font:{color:T.text,size:10},orientation:"h",y:1.12,x:0.5,xanchor:"center"}};'
+ 'if(document.getElementById("plot-l12-margin-en"))Plotly.newPlot("plot-l12-margin-en",[t1,t2,t3,t4,t5,t6],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> The solid purple line is the SVM boundary; the two dashed parallels mark the edges of the margin. The two ringed points are the <em>support vectors</em> — they touch the margin and entirely determine where the boundary sits. Delete every other point and the classifier does not change. This "a few critical points" property is the very essence of SVM.</div>'

+ '<h2 class="l-title">2. The Primal Problem — Geometric Formulation</h2>'

+ '<p class="l-text">Write the boundary as <em>w<sup>⊤</sup>x + b = 0</em>. The distance from a point <em>x</em> to this hyperplane is:</p>'

+ '<div class="katex-block">$$d(\\mathbf{x}) = \\frac{|\\mathbf{w}^\\top \\mathbf{x} + b|}{\\lVert \\mathbf{w} \\rVert}$$</div>'

+ '<p class="l-text">Encode class labels as <em>y<sub>i</sub> ∈ {-1, +1}</em> (instead of logistic regression\'s {0, 1}) and the "correct side" condition collapses to a single inequality: <em>y<sub>i</sub>(w<sup>⊤</sup>x<sub>i</sub> + b) ≥ 1</em>. The "1" is a normalisation choice — we rescale w and b so equality holds exactly for the closest point.</p>'

+ '<p class="l-text">The margin width turns out to be <em>2 / ‖w‖</em>, so maximising the margin equals minimising <em>‖w‖</em>. For convenience we square it:</p>'

+ '<div class="katex-block">$$\\min_{\\mathbf{w}, b} \\; \\tfrac{1}{2} \\lVert \\mathbf{w} \\rVert^2 \\quad \\text{s.t.} \\quad y_i(\\mathbf{w}^\\top \\mathbf{x}_i + b) \\geq 1, \\;\\; \\forall i$$</div>'

+ '<p class="l-text">This is a <strong>quadratic programme (QP)</strong>: convex objective plus linear constraints. There is a single global minimum — none of the local-minimum headaches that plague non-convex learning.</p>'

+ '<div class="calc-example"><div class="example-label">WHY 1/2 ‖w‖²</div><div class="example-body">'
+ '<p class="l-text">Minimising ‖w‖ and ‖w‖² yield the same optimum (squaring is monotonic), but ‖w‖² is differentiable everywhere (‖w‖ has a kink at the origin). The 1/2 just makes the derivative clean: <em>d/dw [½‖w‖²] = w</em>. Pure cosmetic convenience.</p>'
+ '</div></div>'

+ '<h2 class="l-title">3. The Lagrangian Dual — Why "Support" Vectors</h2>'

+ '<p class="l-text">Rewrite the QP with Lagrange multipliers. One <em>α<sub>i</sub> ≥ 0</em> per constraint:</p>'

+ '<div class="katex-block">$$\\mathcal{L}(\\mathbf{w}, b, \\boldsymbol{\\alpha}) = \\tfrac{1}{2}\\lVert \\mathbf{w} \\rVert^2 - \\sum_{i=1}^{n} \\alpha_i \\bigl[\\, y_i(\\mathbf{w}^\\top \\mathbf{x}_i + b) - 1 \\,\\bigr]$$</div>'

+ '<p class="l-text">Take partial derivatives in w and b, set them to zero: <em>w = Σ α<sub>i</sub> y<sub>i</sub> x<sub>i</sub></em> and <em>Σ α<sub>i</sub> y<sub>i</sub> = 0</em>. Substituting back yields the <strong>dual problem</strong>:</p>'

+ '<div class="katex-block">$$\\max_{\\boldsymbol{\\alpha}} \\; \\sum_{i=1}^{n} \\alpha_i - \\tfrac{1}{2} \\sum_{i,j} \\alpha_i \\alpha_j y_i y_j \\, \\mathbf{x}_i^\\top \\mathbf{x}_j \\quad \\text{s.t.} \\quad \\alpha_i \\geq 0, \\; \\sum_i \\alpha_i y_i = 0$$</div>'

+ '<p class="l-text">Three beautiful consequences fall out:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Data appears only as inner products (x<sub>i</sub><sup>⊤</sup>x<sub>j</sub>).</strong> This is exactly where the kernel trick will enter — we swap the inner product for any valid kernel.</li>'
+ '<li><strong>KKT conditions force most α<sub>i</sub> = 0.</strong> Only points touching the margin (or, later, violating it) get <em>α<sub>i</sub> &gt; 0</em>. These are the <em>support vectors</em>.</li>'
+ '<li><strong>Prediction uses only support vectors:</strong> <em>f(x) = sign(Σ<sub>i ∈ SV</sub> α<sub>i</sub> y<sub>i</sub> x<sub>i</sub><sup>⊤</sup>x + b)</em>.</li>'
+ '</ul>'

+ '<p class="l-text">That is where the name comes from: the model "carries" not the whole training set but a small support set. Train on 10 000 examples and you may end up with 200 support vectors — efficient at inference and somewhat interpretable.</p>'

+ '<h2 class="l-title">4. Soft Margin — No Real Data Is Perfectly Separable</h2>'

+ '<p class="l-text">So far we assumed the data is <em>linearly separable</em>. In practice noise, mislabels, and natural overlap make that rare. Cortes &amp; Vapnik (1995) fixed this with <strong>slack variables</strong> <em>ξ<sub>i</sub> ≥ 0</em> — allow each example to violate the margin a bit:</p>'

+ '<div class="katex-block">$$\\min_{\\mathbf{w},b,\\boldsymbol{\\xi}} \\; \\tfrac{1}{2}\\lVert \\mathbf{w} \\rVert^2 + C \\sum_{i=1}^{n} \\xi_i \\quad \\text{s.t.} \\quad y_i(\\mathbf{w}^\\top \\mathbf{x}_i + b) \\geq 1 - \\xi_i, \\;\\; \\xi_i \\geq 0$$</div>'

+ '<p class="l-text">The parameter <em>C</em> sets how strict the model is:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Large C (e.g. 1000):</strong> violations expensive, model fits training tightly → narrow margin, overfit risk.</li>'
+ '<li><strong>Small C (e.g. 0.01):</strong> violations cheap, model favours a wide margin → tolerates some training errors, often generalises better.</li>'
+ '<li><strong>C → ∞:</strong> reduces to the hard-margin formulation of Section 2.</li>'
+ '</ul>'

+ '<p class="l-text">The right C depends on noise level and class overlap — find it via cross-validation (<a href="/tutorials/ml-theory/4">Lesson 4</a>). Practical recipe: start with a log-spaced grid <em>C ∈ {0.01, 0.1, 1, 10, 100}</em>.</p>'

+ '<h2 class="l-title">5. The Kernel Trick — Linearity in a Higher Dimension</h2>'

+ '<p class="l-text">What if the data is not linearly separable? Classical idea: map features via some <em>φ(x)</em> into a higher-dimensional space where they become separable. Two-dimensional concentric circles? Map <em>φ(x, y) = (x, y, x² + y²)</em> and they separate with a flat plane in 3D.</p>'

+ '<p class="l-text">Problem: φ(x) can be huge (even infinite-dimensional). Computing it explicitly is often impossible. But Section 3 showed that the SVM dual only ever sees inner products. So all we really need is:</p>'

+ '<div class="katex-block">$$K(\\mathbf{x}, \\mathbf{x}\') = \\phi(\\mathbf{x})^\\top \\phi(\\mathbf{x}\')$$</div>'

+ '<p class="l-text">A function K that returns the inner product in φ-space, without ever materialising φ. This is the <strong>kernel trick</strong>. Mercer\'s theorem guarantees that whenever K is symmetric and positive semi-definite, <em>some</em> φ exists — even if we never see it.</p>'

+ '<div class="calc-example"><div class="example-label">CONCRETE EXAMPLE — POLYNOMIAL KERNEL</div><div class="example-body">'
+ '<p class="l-text">In 2D the polynomial kernel <em>K(x, x\') = (x<sup>⊤</sup>x\' + 1)²</em>. Expand:</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7;padding:.5rem 1rem">'
+ '(x₁x₁\' + x₂x₂\' + 1)² ='
+ '<br>x₁²x₁\'² + x₂²x₂\'² + 2x₁x₂x₁\'x₂\' + 2x₁x₁\' + 2x₂x₂\' + 1'
+ '</p>'
+ '<p class="l-text">This is the inner product of <em>φ(x) = (x₁², x₂², √2·x₁x₂, √2·x₁, √2·x₂, 1)</em> — a 6-dimensional feature space. Computing K directly costs O(d), via φ it would cost O(d²) — the gap grows enormously with d.</p>'
+ '</div></div>'

+ '<h2 class="l-title">6. Popular Kernels — Their Personalities</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Linear</div><div class="card-body"><em>K(x, x\') = x<sup>⊤</sup>x\'</em>. No mapping at all, just the inner product. Best for high-dim sparse data (text, TF-IDF) where features are already discriminative.</div></div>'
+ '<div class="calc-card"><div class="card-title">Polynomial</div><div class="card-body"><em>K(x, x\') = (γ x<sup>⊤</sup>x\' + r)<sup>d</sup></em>. Degree <em>d</em> controls flexibility. Low degrees (2-3) usually suffice; high degrees blow up numerically and overfit.</div></div>'
+ '<div class="calc-card"><div class="card-title">RBF (Gaussian)</div><div class="card-body"><em>K(x, x\') = exp(-γ ‖x - x\'‖²)</em>. Corresponds to an infinite-dimensional φ. The default general-purpose choice. Small γ → wide soft boundary; large γ → tight wiggly boundary.</div></div>'
+ '<div class="calc-card"><div class="card-title">Sigmoid</div><div class="card-body"><em>K(x, x\') = tanh(γ x<sup>⊤</sup>x\' + r)</em>. Not positive semi-definite for all γ, r — Mercer may fail. Historically interesting (looks like a neural net), rarely chosen in practice.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>γ is the soul of RBF.</strong> It sets the "reach" of each training point. Large γ → each point has a narrow bump → model memorises individual points, overfits. Small γ → wide bump → model is too smooth, underfits. γ is tuned jointly with C (typically a 2D grid search).</p>'

+ '<div class="plotly-graph"><div id="plot-l12-kernels-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var xs=[];for(var i=-30;i<=30;i++)xs.push(i/10);'
+ 'var rbf_small=[],rbf_med=[],rbf_large=[];'
+ 'for(var i=0;i<xs.length;i++){'
+ 'rbf_small.push(Math.exp(-0.1*xs[i]*xs[i]));'
+ 'rbf_med.push(Math.exp(-1.0*xs[i]*xs[i]));'
+ 'rbf_large.push(Math.exp(-5.0*xs[i]*xs[i]));'
+ '}'
+ 'var t1={x:xs,y:rbf_small,name:"γ = 0.1 (wide)",type:"scatter",mode:"lines",line:{color:T.accent,width:3}};'
+ 'var t2={x:xs,y:rbf_med,name:"γ = 1.0 (medium)",type:"scatter",mode:"lines",line:{color:"rgba(78,205,196,.9)",width:3}};'
+ 'var t3={x:xs,y:rbf_large,name:"γ = 5.0 (narrow)",type:"scatter",mode:"lines",line:{color:"rgba(248,113,113,.9)",width:3}};'
+ 'var layout={xaxis:{title:"x",color:T.text,gridcolor:T.grid},yaxis:{title:"K(0, x)",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:80,r:30,b:60,l:60},legend:{font:{color:T.text,size:10},orientation:"h",y:1.12,x:0.5,xanchor:"center"}};'
+ 'if(document.getElementById("plot-l12-kernels-en"))Plotly.newPlot("plot-l12-kernels-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> The RBF similarity <em>K(0, x) = exp(-γx²)</em> as we vary γ. Small γ spreads similarity widely (broad peak → smooth boundary). Large γ keeps similarity local (narrow peak → each point an island, overfit). A simple way to think about γ: "how many neighbours do I resemble?"</div>'

+ '<h2 class="l-title">7. Multi-Class — One-vs-Rest vs One-vs-One</h2>'

+ '<p class="l-text">SVM is binary by construction. For K classes there are two strategies:</p>'

+ '<ul class="l-list">'
+ '<li><strong>One-vs-Rest (OvR):</strong> train K classifiers, each asking "me vs everyone else". Predict the class with the highest score. Cheap (K models) but classes become imbalanced (1 vs K-1).</li>'
+ '<li><strong>One-vs-One (OvO):</strong> train one model per class pair — K(K-1)/2 in total. Predict by majority vote. Each model is fast (small data) but with many classes the count explodes.</li>'
+ '</ul>'

+ '<p class="l-text">In sklearn, <em>SVC</em> defaults to OvO (10 classes → 45 models), while <em>LinearSVC</em> uses OvR. Rule of thumb: OvO for K ≤ 10, OvR when K is much larger.</p>'

+ '<h2 class="l-title">8. SVM vs Logistic Regression vs Random Forest</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Logistic Regression</div><div class="card-body">Native, calibrated probability outputs. Interpretable coefficients. Linear boundary (without kernels). Scales to millions of examples.</div></div>'
+ '<div class="calc-card"><div class="card-title">SVM (RBF)</div><div class="card-body">Strong on non-linear boundaries. Shines when n is small and p is large (n &lt; p), e.g. genomics. No native probabilities (Platt scaling added post-hoc). O(n²)-O(n³) — slow past ~50k examples.</div></div>'
+ '<div class="calc-card"><div class="card-title">Random Forest</div><div class="card-body">Handles mixed types, missing values, non-linear interactions out of the box. Free feature-importance scores. But loses to SVM on sparse high-dim data like text.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Pick SVM when:</strong></p>'

+ '<ul class="l-list">'
+ '<li>Data is moderate size (~1k - 50k examples) with many features</li>'
+ '<li>Features are already preprocessed and scaled (SVM is scale-sensitive)</li>'
+ '<li>A linear boundary is not enough but you lack data/time for a deep net</li>'
+ '<li>Text classification baseline (TF-IDF + LinearSVC is the classical recipe)</li>'
+ '<li>Bioinformatics, or hand-crafted features in vision (HOG, SIFT)</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Skip SVM when:</strong> data is large (&gt; 100k) — the O(n²)-O(n³) training becomes painful. On mixed tabular data, gradient boosting (XGBoost, LightGBM) usually wins with less effort. On vision, audio, or language modelling where the model must <em>learn features</em>, deep nets are not a contest.</p>'

+ '<h2 class="l-title">9. Non-Linear Toy Data — A Kernel Demo</h2>'

+ '<p class="l-text">A concrete example: two concentric rings — no straight line can separate them. Logistic regression fails (~50%). An RBF-kernel SVM learns a circular boundary and nails it.</p>'

+ '<div class="plotly-graph"><div id="plot-l12-circles-en" style="width:100%;height:420px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'function rng(s){return function(){s=(s*9301+49297)%233280;return s/233280;};}'
+ 'var r=rng(11);'
+ 'var inX=[],inY=[],outX=[],outY=[];'
+ 'for(var i=0;i<80;i++){var th=2*Math.PI*r();var rad=0.3+0.15*r();inX.push(rad*Math.cos(th));inY.push(rad*Math.sin(th));}'
+ 'for(var i=0;i<120;i++){var th=2*Math.PI*r();var rad=0.8+0.15*r();outX.push(rad*Math.cos(th));outY.push(rad*Math.sin(th));}'
+ 'var bx=[],by=[];for(var i=0;i<=360;i++){var th=i*Math.PI/180;bx.push(0.55*Math.cos(th));by.push(0.55*Math.sin(th));}'
+ 'var t1={x:inX,y:inY,name:"Class -1",type:"scatter",mode:"markers",marker:{color:T.accent,size:9,symbol:"circle"}};'
+ 'var t2={x:outX,y:outY,name:"Class +1",type:"scatter",mode:"markers",marker:{color:"rgba(248,113,113,.85)",size:9,symbol:"x"}};'
+ 'var t3={x:bx,y:by,name:"RBF-SVM boundary",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.95)",width:3,dash:"dash"}};'
+ 'var layout={xaxis:{title:"x₁",color:T.text,gridcolor:T.grid,range:[-1.2,1.2]},yaxis:{title:"x₂",color:T.text,gridcolor:T.grid,range:[-1.2,1.2],scaleanchor:"x"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:80,r:30,b:60,l:60},legend:{font:{color:T.text,size:10},orientation:"h",y:1.12,x:0.5,xanchor:"center"}};'
+ 'if(document.getElementById("plot-l12-circles-en"))Plotly.newPlot("plot-l12-circles-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> The inner purple cluster and outer red ring cannot be split by a straight line — logistic regression performs near random here. An RBF-SVM lifts the data into a higher-dim space via φ, draws a flat hyperplane there, and the projection of that hyperplane back into 2D is a <em>circle</em>. The kernel trick gives us this with a single line of code (kernel=\'rbf\') — we never write φ down.</div>'

+ '<h2 class="l-title">10. Summary — Why SVMs Still Matter in 2026</h2>'

+ '<p class="l-text">In the shadow of transformers and large language models, SVMs can look quaint. But in 2026 practice they still have several solid niches:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Small-data regime:</strong> 100-5000 examples where a deep net would overfit. Medical imaging on rare conditions, niche A/B test analyses, small clinical trials.</li>'
+ '<li><strong>Text baseline:</strong> TF-IDF + LinearSVC remains the standard "first pass" for any new NLP problem. You have to beat this baseline before claiming BERT or GPT helped.</li>'
+ '<li><strong>Clean tabular data:</strong> bioinformatics feature vectors, hand-crafted signal-processing features.</li>'
+ '<li><strong>Interpretability:</strong> a linear SVM\'s weights tell you directly which feature pushed the decision how much.</li>'
+ '<li><strong>Decision-only scenarios:</strong> OneClassSVM for anomaly detection when you only have "normal" examples.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>When SVM is outclassed:</strong> any task that requires learning features from raw input — images, audio, language modelling — belongs to deep nets. On very large tabular data (&gt; 1M rows) the gradient-boosting family (XGBoost, LightGBM, CatBoost) is faster and usually more accurate.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> The maximum-margin intuition — why we pick the widest-corridor separator out of infinitely many. You can formulate the primal quadratic problem geometrically and explain how the Lagrangian dual makes the notion of support vectors fall out naturally. You saw how the C parameter in the soft-margin formulation trades margin width against training error. You learned the kernel trick — getting an inner product in φ-space without ever computing φ — and the practical personalities of RBF, polynomial, and other kernels. You know the one-vs-rest and one-vs-one strategies for multi-class, and when SVM beats logistic regression or random forest, and why SVMs are still worth knowing in 2026. <a href="/tutorials/sklearn/9">Sklearn Lesson 9</a> takes this theory and runs it through the actual sklearn API: SVC, kernel choice, GridSearchCV over C and γ, LinearSVC, and SVR.</div>'

};
