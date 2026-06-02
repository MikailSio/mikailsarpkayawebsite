/* dl-new-L2.js — Deep Learning Lesson 2: Aktivasyon & Kayıp Fonksiyonları (TR + EN) */
var DL_L2 = {

tr:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Sinir ağının iki kritik yapı taşı: <strong>aktivasyon fonksiyonları</strong> (her nöronun çıktısını belirler) ve <strong>kayıp fonksiyonları</strong> (modelin "ne kadar yanıldığını" ölçer). Sigmoid, tanh, ReLU, Leaky ReLU, GELU, Swish — her birinin matematiği, ne zaman kullanılır, hangi tuzakları taşır. Plus regresyon için MSE, sınıflandırma için cross-entropy. MNIST üzerinde her seçimin pratikte etkisi.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Doğrusal olmamanın derin ağlarda neden zorunlu olduğunu açıklayacaksın</li><li>Sigmoid, tanh, ReLU, Leaky ReLU, GELU ve Swish\'i türev ve dead-neuron riski açısından karşılaştıracaksın</li><li>Çıktı katmanı için softmax, sigmoid veya identity\'i göreve göre seçeceksin</li><li>Regresyon için MSE, sınıflandırma için cross-entropy kaybını çıkaracaksın</li><li>MNIST üstünde aktivasyon + loss pipeline\'ını PyTorch ile kuracaksın</li></ul></div>'

+ '<h2 class="l-title">1. Aktivasyon Fonksiyonu Niye Var?</h2>'

+ '<p class="l-text"><a href="/tutorials/ai/dl/neural-networks-intro">Ders 1</a>\'de bir nöronun şunu yaptığını gördük: <em>z = w<sup>⊤</sup>x + b</em>, sonra <em>ŷ = f(z)</em>. Eğer <em>f</em> sadece özdeşlik (<em>f(z) = z</em>) olsaydı, bütün ağın yaptığı sadece lineer dönüşüm olurdu. Hangi kadar katman üst üste konursa konsun, sonuç hâlâ lineer.</p>'

+ '<div class="calc-example"><div class="example-label">DOĞRUSAL ÜSTÜ DOĞRUSAL HÂLÂ DOĞRUSAL</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Katman 1: <strong>z<sub>1</sub> = W<sub>1</sub>x + b<sub>1</sub></strong>'
+ '<br>Katman 2: <strong>z<sub>2</sub> = W<sub>2</sub>z<sub>1</sub> + b<sub>2</sub> = W<sub>2</sub>(W<sub>1</sub>x + b<sub>1</sub>) + b<sub>2</sub> = (W<sub>2</sub>W<sub>1</sub>)x + (W<sub>2</sub>b<sub>1</sub> + b<sub>2</sub>)</strong>'
+ '</p>'
+ '<p class="l-text">Üç katman da bir lineer dönüşüme indirgenir. Aktivasyon olmadan derin ağ "derin" değildir.</p>'
+ '</div></div>'

+ '<p class="l-text"><strong>Aktivasyon fonksiyonu doğrusal olmamalıdır.</strong> Bu doğrusal olmama özelliği ağa esneklik verir, lineer regresyonun ötesine taşır. Hangi doğrusal olmayan fonksiyonu seçeriz? Pek çok aday var; her birinin avantajları ve sorunları var.</p>'

+ '<h2 class="l-title">2. Sigmoid — En Eski</h2>'

+ '<div class="katex-block">$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>'

+ '<p class="l-text">Lojistik regresyondan tanıdık (<a href="/tutorials/ai/ml/logistic-regression-classification">ML L3</a>): herhangi bir reel sayıyı (0, 1) aralığına sıkıştırır. 0\'a yakın için σ ≈ 0.5; büyük pozitif için 1; büyük negatif için 0. İlk sinir ağlarının (1980-2010) varsayılan aktivasyonuydu.</p>'

+ '<p class="l-text"><strong>Sorunları:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>Vanishing gradient:</strong> z büyük olduğunda σ\'(z) ≈ 0. Geri yayılımda gradyan adeta yok olur — derin ağ eğitilemez.</li>'
+ '<li><strong>Sıfır merkezli değil:</strong> Çıktı hep [0, 1] aralığında, ortalaması 0.5. Sonraki katman için sürekli pozitif girdi → eğitim yavaşlar.</li>'
+ '<li><strong>Hesap pahalı:</strong> exp() yavaş.</li>'
+ '</ul>'

+ '<p class="l-text">Pratikte: gizli katmanlarda <em>kullanılmaz</em>. İkili sınıflandırmanın çıktı katmanında (P(y=1)\'i hesaplamak için) hâlâ kullanılır.</p>'

+ '<h2 class="l-title">3. Tanh — Sıfır Merkezli Sigmoid</h2>'

+ '<div class="katex-block">$$\\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}} = 2\\sigma(2z) - 1$$</div>'

+ '<p class="l-text">Tanh, sigmoid\'in iyileştirilmiş versiyonu: çıktı (-1, 1) aralığında, ortalaması 0. Sıfır merkezli olduğu için katmanlar arası eğitim daha sağlıklı.</p>'

+ '<p class="l-text">Yine de aynı vanishing gradient sorunu var — z büyük olduğunda türev sıfıra yakın. Tanh, RNN\'lerde (ders 8) gizli durumların aktivasyonu olarak hâlâ tercih edilir, ama tipik feedforward ağlarında ReLU\'ya yenildi.</p>'

+ '<h2 class="l-title">4. ReLU — Devrim</h2>'

+ '<div class="katex-block">$$\\text{ReLU}(z) = \\max(0, z)$$</div>'

+ '<p class="l-text"><strong>ReLU (Rectified Linear Unit)</strong> 2010\'da standart oldu. Görüntü olarak: z negatifse 0, pozitifse z. O kadar.</p>'

+ '<p class="l-text"><strong>Avantajları:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>Vanishing gradient yok (pozitif tarafta):</strong> z &gt; 0 için türev = 1. Gradyan hiç sönümlenmez.</li>'
+ '<li><strong>Hesap son derece hızlı:</strong> max() bir if-else. exp/log yok.</li>'
+ '<li><strong>Seyreklik (sparsity):</strong> Negatif girdiler 0\'a iner, ağın yarısı her batch\'te aktif değil — nöral düzeyde verimlilik.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Sorunu:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>Dying ReLU:</strong> Eğer bir nöronun girdileri sürekli negatif çıkarsa, türevi 0\'da sıkışır → ağırlıkları hiç güncellenmez → "ölü" nöron.</li>'
+ '</ul>'

+ '<p class="l-text">Bu sorun Leaky ReLU ile büyük ölçüde çözülür.</p>'

+ '<h2 class="l-title">5. Leaky ReLU & Türevleri</h2>'

+ '<div class="katex-block">$$\\text{LeakyReLU}(z) = \\begin{cases} z & \\text{if } z > 0 \\\\ \\alpha z & \\text{if } z \\leq 0 \\end{cases}$$</div>'

+ '<p class="l-text">Negatif tarafta tam sıfır yerine küçük bir eğim (<em>α ≈ 0.01</em>). Nöron "ölmez", gradyan akmaya devam eder.</p>'

+ '<p class="l-text">Varyantlar:</p>'

+ '<ul class="l-list">'
+ '<li><strong>PReLU:</strong> α öğrenilebilir parametre. Her nöronun kendi α\'sı vardır.</li>'
+ '<li><strong>ELU:</strong> Negatif tarafta α(e<sup>z</sup> - 1) eğrisi. Daha pürüzsüz, ortalaması sıfıra yakın.</li>'
+ '<li><strong>SELU:</strong> ELU + öz-normalleştirme özellikleri.</li>'
+ '</ul>'

+ '<h2 class="l-title">6. GELU & Swish — Modern Mimari Standardı</h2>'

+ '<p class="l-text">2018+ Transformer mimarileri (BERT, GPT) ReLU yerine yumuşak alternatifler kullanır.</p>'

+ '<h3 class="l-subtitle">GELU</h3>'

+ '<div class="katex-block">$$\\text{GELU}(z) = z \\cdot \\Phi(z)$$</div>'

+ '<p class="l-text">Burada Φ(z) standart normal dağılımın kümülatif dağılım fonksiyonu. Sezgi: girdiyi <em>olasılığa göre</em> ölçeklendir. Pozitif z: yaklaşık ReLU. Negatif z: küçük negatif değer (sıfır değil). Çok pürüzsüz, türevlenebilir, modern transformer\'larda standart.</p>'

+ '<h3 class="l-subtitle">Swish (SiLU)</h3>'

+ '<div class="katex-block">$$\\text{Swish}(z) = z \\cdot \\sigma(z)$$</div>'

+ '<p class="l-text">Google Brain (2017): "z çarpı sigmoid(z)". GELU\'ya benzer bir eğri, hesabı biraz daha hızlı. Mobilenet, EfficientNet gibi mimarilerde kullanılır.</p>'

+ '<div class="plotly-graph"><div id="plot-act-tr" style="width:100%;height:420px;"></div></div>'
+ '<script>setTimeout(function(){window.__dlRegDraw(function(){'
+ 'var T=window.__dlChartTheme();'
+ 'var z=[];for(var i=-50;i<=50;i++)z.push(i/10);'
+ 'var sig=z.map(function(v){return 1/(1+Math.exp(-v));});'
+ 'var tanh=z.map(function(v){return Math.tanh(v);});'
+ 'var relu=z.map(function(v){return Math.max(0,v);});'
+ 'var lrelu=z.map(function(v){return v>0?v:0.1*v;});'
+ 'var swish=z.map(function(v){return v/(1+Math.exp(-v));});'
+ 'var t1={x:z,y:sig,name:"Sigmoid",type:"scatter",mode:"lines",line:{color:"rgba(248,113,113,.85)",width:2}};'
+ 'var t2={x:z,y:tanh,name:"Tanh",type:"scatter",mode:"lines",line:{color:"rgba(78,205,196,.85)",width:2}};'
+ 'var t3={x:z,y:relu,name:"ReLU",type:"scatter",mode:"lines",line:{color:T.accent,width:3}};'
+ 'var t4={x:z,y:lrelu,name:"Leaky ReLU",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.85)",width:2,dash:"dash"}};'
+ 'var t5={x:z,y:swish,name:"Swish",type:"scatter",mode:"lines",line:{color:"rgba(255,206,84,.85)",width:2}};'
+ 'var layout={xaxis:{title:"z",color:T.text,gridcolor:T.grid,zerolinecolor:T.grid},yaxis:{title:"f(z)",color:T.text,gridcolor:T.grid,range:[-1.5,5]},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",x:0.5,xanchor:"center",y:1.08,yanchor:"bottom"}};'
+ 'if(document.getElementById("plot-act-tr"))Plotly.newPlot("plot-act-tr",[t1,t2,t3,t4,t5],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Beş aktivasyon fonksiyonu yan yana. Sigmoid ve Tanh "S" eğrisi — büyük z\'de doyar (gradyan kaybı). ReLU pozitif tarafta lineer, negatif tarafta tam 0. Leaky ReLU negatif tarafta küçük eğim (ölmez). Swish pürüzsüz, ReLU\'ya benzer ama sıfırın altında küçük negatif değerler verir. Modern mimariler için ReLU/GELU/Swish; gizli katmanlarda sigmoid/tanh artık tercih edilmez.</div>'

+ '<h2 class="l-title">7. Çıktı Katmanının Aktivasyonu — Görev Belirler</h2>'

+ '<p class="l-text">Gizli katmanlarda ReLU/GELU vs. ama <strong>çıktı katmanı görevin doğasına göre değişir</strong>:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Regresyon:</strong> Aktivasyon yok — düz lineer çıktı (örn. ev fiyatı tahmini).</li>'
+ '<li><strong>İkili sınıflandırma:</strong> Sigmoid → tek olasılık [0, 1].</li>'
+ '<li><strong>Çok sınıflı sınıflandırma (MNIST gibi):</strong> Softmax → her sınıf için olasılık, toplamı 1.</li>'
+ '<li><strong>Çok etiketli sınıflandırma:</strong> Bağımsız sigmoid (her etikete ayrı olasılık).</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Softmax — Çok sınıflı için kritik</h3>'

+ '<div class="katex-block">$$\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}$$</div>'

+ '<p class="l-text">K-boyutlu bir vektörü olasılık dağılımına çevirir: her bileşen [0,1] arası, toplamı 1. MNIST için 10 nöronun çıkışına softmax uygulanır → 10 rakam için olasılık.</p>'

+ '<h2 class="l-title">8. Kayıp Fonksiyonları — Modelin "Hata"sı</h2>'

+ '<p class="l-text"><a href="/tutorials/ai/ml/linear-regression">ML L2</a>\'de MSE, <a href="/tutorials/ai/ml/logistic-regression-classification">ML L3</a>\'te cross-entropy gördük. DL\'de aynı temelden başlarız.</p>'

+ '<h3 class="l-subtitle">Regresyon için: MSE & MAE</h3>'

+ '<div class="katex-block">$$\\text{MSE} = \\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2, \\qquad \\text{MAE} = \\frac{1}{n}\\sum_{i=1}^{n}|y_i - \\hat{y}_i|$$</div>'

+ '<p class="l-text">MSE büyük hataları kareyle cezalandırır — aykırılığa hassas. MAE doğrusal — daha sağlam ama gradyan sıfırda tanımsız. <strong>Huber loss</strong> ikisinin birleşimi: küçük hatalarda kare, büyük hatalarda lineer. DL\'de pek sık kullanılmaz; çoğu DL problemi sınıflandırmadır.</p>'

+ '<h3 class="l-subtitle">İkili sınıflandırma için: Binary Cross-Entropy (BCE)</h3>'

+ '<div class="katex-block">$$\\text{BCE} = -\\frac{1}{n}\\sum_{i=1}^{n}\\bigl[y_i \\log \\hat{p}_i + (1-y_i)\\log(1-\\hat{p}_i)\\bigr]$$</div>'

+ '<p class="l-text">Sigmoid çıktısı + BCE klasik ikili sınıflandırma çifti. Modelin "emin ve yanlış" olduğunda ağır cezalandırır.</p>'

+ '<h3 class="l-subtitle">Çok sınıflı sınıflandırma için: Cross-Entropy</h3>'

+ '<div class="katex-block">$$\\text{CE} = -\\frac{1}{n}\\sum_{i=1}^{n}\\sum_{k=1}^{K} y_{ik} \\log \\hat{p}_{ik}$$</div>'

+ '<p class="l-text">Burada <em>y<sub>ik</sub></em> one-hot etiket (gerçek sınıf 1, diğerleri 0). MNIST\'te K=10. Etiketin one-hot olduğunu göz önüne alırsak, formül sadeleşir:</p>'

+ '<div class="katex-block">$$\\text{CE} = -\\frac{1}{n}\\sum_{i=1}^{n} \\log \\hat{p}_{i, y_i}$$</div>'

+ '<p class="l-text">"Doğru sınıfa atanan olasılığın logaritması". Model gerçek sınıfa 0.9 dediyse log(0.9) ≈ -0.1; 0.01 dediyse log(0.01) = -4.6 — büyük ceza.</p>'

+ '<h3 class="l-subtitle">Logits + Loss — Numerical Stability Hilesi</h3>'

+ '<p class="l-text">Yukarıda softmax\'ı uygulayıp sonra log alıyor gibi görünür. Pratikte bu sayısal taşmaya yol açar (e<sup>1000</sup> = sonsuz). Modern kütüphaneler softmax + log\'u tek bir işlemde yapar (<code>log_softmax</code> + <code>nll_loss</code> = <code>cross_entropy</code>). Bu yüzden PyTorch\'ta son katmana softmax uygulamayız:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Doğru Pattern — softmax\'ı manuel uygulama<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn'
+ '\n'
+ '\n<span class="cm"># YANLIŞ — sayısal kararsız, eğitim instabil olur</span>'
+ '\nclass BadModel(nn.Module):'
+ '\n    def forward(self, x):'
+ '\n        z = self.<span class="fn">linear</span>(x)'
+ '\n        <span class="kw">return</span> nn.<span class="fn">functional</span>.<span class="fn">softmax</span>(z, dim=-<span class="num">1</span>)'
+ '\n'
+ '\n<span class="cm"># DOĞRU — logits dön, kayıp fonksiyonu softmax\'ı dahili yapar</span>'
+ '\n<span class="kw">class</span> GoodModel(nn.Module):'
+ '\n    <span class="kw">def</span> <span class="fn">forward</span>(self, x):'
+ '\n        <span class="kw">return</span> self.<span class="fn">linear</span>(x)  <span class="cm"># sadece logits</span>'
+ '\n'
+ '\nloss_fn = nn.<span class="fn">CrossEntropyLoss</span>()  <span class="cm"># softmax\'ı içinde uygular</span>'
+ '\nlogits = <span class="fn">model</span>(images)'
+ '\nloss = <span class="fn">loss_fn</span>(logits, labels)'
+ '\n'
+ '\n<span class="cm"># Tahmin almak için: torch.argmax(logits, dim=-1)</span>'
+ '\n<span class="cm"># Olasılık almak için: torch.softmax(logits, dim=-1)</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> İki yaygın hatayı vurguluyor. <code>nn.CrossEntropyLoss</code> dahili <code>log_softmax + nll</code> yapar — bu yüzden modelden <em>logit</em> (ham skor) bekler. Eğer modelinin son katmanında softmax uyguladıysan, çift softmax olur ve eğitim bozulur. Kural: <strong>logit dön, loss\'a softmax\'ı bırak</strong>. Tahmin için softmax\'i ayrıca uygula.</p>'

+ '<h2 class="l-title">9. Hangi Aktivasyonu Ne Zaman?</h2>'

+ '<div class="calc-example"><div class="example-label">PRATİK SEÇİM REHBERİ</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Yer</th><th style="padding:.5rem">Aktivasyon</th><th style="padding:.5rem">Niye</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">MLP gizli katman</td><td style="text-align:center">ReLU</td><td style="padding:.5rem;color:var(--text-dim)">Hızlı, basit, çoğu zaman yeterli</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">CNN gizli katman</td><td style="text-align:center">ReLU veya Leaky ReLU</td><td style="padding:.5rem;color:var(--text-dim)">Standart; ölü ReLU\'ya karşı Leaky güvence</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Transformer / LLM</td><td style="text-align:center">GELU veya Swish</td><td style="padding:.5rem;color:var(--text-dim)">BERT/GPT mimarisi, daha pürüzsüz gradyan</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">RNN/LSTM gizli durum</td><td style="text-align:center">Tanh</td><td style="padding:.5rem;color:var(--text-dim)">Sıfır merkezli, sınırlı çıktı (-1, 1)</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">İkili sınıflandırma çıktı</td><td style="text-align:center">Sigmoid</td><td style="padding:.5rem;color:var(--text-dim)">Olasılık [0, 1]</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Çok sınıflı çıktı</td><td style="text-align:center">Softmax</td><td style="padding:.5rem;color:var(--text-dim)">Sınıflar üzerinde olasılık dağılımı</td></tr>'
+ '<tr><td style="padding:.5rem">Regresyon çıktı</td><td style="text-align:center">Yok (lineer)</td><td style="padding:.5rem;color:var(--text-dim)">Sayı sınırsız olabilir</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<h2 class="l-title">10. PyTorch ile MNIST — Aktivasyon + Loss Pipeline</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Tam eğitim adımı<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch'
+ '\n<span class="kw">import</span> torch.nn <span class="kw">as</span> nn'
+ '\n<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F'
+ '\n'
+ '\n<span class="kw">class</span> MNISTNet(nn.Module):'
+ '\n    <span class="kw">def</span> <span class="fn">__init__</span>(self):'
+ '\n        <span class="fn">super</span>().<span class="fn">__init__</span>()'
+ '\n        self.fc1 = nn.<span class="fn">Linear</span>(<span class="num">784</span>, <span class="num">128</span>)'
+ '\n        self.fc2 = nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">64</span>)'
+ '\n        self.fc3 = nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">10</span>)'
+ '\n'
+ '\n    <span class="kw">def</span> <span class="fn">forward</span>(self, x):'
+ '\n        x = x.<span class="fn">view</span>(x.<span class="fn">size</span>(<span class="num">0</span>), -<span class="num">1</span>)        <span class="cm"># 28×28 → 784</span>'
+ '\n        x = F.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x))         <span class="cm"># 1. gizli katman</span>'
+ '\n        x = F.<span class="fn">relu</span>(self.<span class="fn">fc2</span>(x))         <span class="cm"># 2. gizli katman</span>'
+ '\n        <span class="kw">return</span> self.<span class="fn">fc3</span>(x)             <span class="cm"># logitleri dön (softmax YOK)</span>'
+ '\n'
+ '\nmodel = <span class="fn">MNISTNet</span>()'
+ '\nloss_fn = nn.<span class="fn">CrossEntropyLoss</span>()    <span class="cm"># softmax + log + nll bir arada</span>'
+ '\noptimizer = torch.optim.<span class="fn">Adam</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)'
+ '\n'
+ '\n<span class="cm"># Tek bir batch için eğitim adımı</span>'
+ '\nimages, labels = <span class="fn">next</span>(<span class="fn">iter</span>(train_loader))   <span class="cm"># (32, 1, 28, 28), (32,)</span>'
+ '\noptimizer.<span class="fn">zero_grad</span>()'
+ '\nlogits = <span class="fn">model</span>(images)'
+ '\nloss = <span class="fn">loss_fn</span>(logits, labels)'
+ '\nloss.<span class="fn">backward</span>()'
+ '\noptimizer.<span class="fn">step</span>()'
+ '\n<span class="fn">print</span>(<span class="str">f"Loss: {loss.item():.4f}"</span>)'
+ '\n'
+ '\n<span class="cm"># Tahmin için</span>'
+ '\nprobs = F.<span class="fn">softmax</span>(logits, dim=-<span class="num">1</span>)        <span class="cm"># (32, 10) olasılıklar</span>'
+ '\npreds = probs.<span class="fn">argmax</span>(dim=-<span class="num">1</span>)             <span class="cm"># (32,) tahminler</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Bütün L1+L2 öğretilenlerin tek pratiği. Model logit döndürür (10 boyutlu vektör — softmax yok). <code>CrossEntropyLoss</code> içinde softmax yapar; sayısal stabil. Eğitim adımı 4 satır: zero_grad → forward → backward → step. <code>backward()</code> Ders 3\'te göreceğimiz backpropagation\'ı çalıştırır — tüm parametreler için gradyanları hesaplar. <code>step()</code> Adam optimizer\'ı kullanarak parametreleri günceller (Ders 4).</p>'

+ '<h2 class="l-title">11. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Bir sinir ağının ileri tarafını (forward pass) ve değerlendirme matematiğini (kayıp) öğrendik. Ama bir kritik soru cevapsız kaldı: <em>kaybı azaltmak için ağırlıkları nasıl güncelleyeceğimizi bilmiyoruz.</em> ML\'de gradyan iniş gördük (<a href="/tutorials/ai/ml/linear-regression">ML L2</a>) ama derin ağda gradyanı verimli hesaplamak başlı başına bir matematiktir. <a href="/tutorials/ai/dl/backpropagation-computational-graphs">Ders 3</a>\'te <strong>backpropagation ve hesap grafları</strong>nı işliyoruz — derin öğrenmenin en güzel matematiksel hilelerinden biri.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Aktivasyon fonksiyonunun niye gerekli olduğunu (lineer üstü lineer hâlâ lineer) anladın. Sigmoid, tanh, ReLU, Leaky ReLU, GELU, Swish\'in matematiğini ve farklarını gördün. Vanishing gradient sorununu kavradın ve niye modern ağlarda sigmoid/tanh\'ın gizli katmanlarda kullanılmadığını öğrendin. Çıktı katmanı aktivasyonunun göreve göre değiştiğini (softmax çoklu sınıf, sigmoid ikili, lineer regresyon) gördün. MSE, BCE, Cross-Entropy kayıp fonksiyonlarını ve hangisinin ne zaman kullanılacağını öğrendin. Logits + loss\'un sayısal stabilite hilesini ve PyTorch pratiğini kavradın. PyTorch\'ta tam bir eğitim adımı (zero_grad, forward, backward, step) yazdın.</div>'

,

en:
'<script>(function(){var g=window;g.__dlChartDrawers=g.__dlChartDrawers||[];g.__dlChartTheme=g.__dlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=g.__dlRegDraw||function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> Two critical building blocks of neural networks: <strong>activation functions</strong> (what each neuron outputs) and <strong>loss functions</strong> (how wrong the model is). Sigmoid, tanh, ReLU, Leaky ReLU, GELU, Swish — the math of each, when to use them, the traps each carries. Plus MSE for regression, cross-entropy for classification. The practical effect of every choice on MNIST.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Explain why deep networks require non-linear activations between layers</li><li>Compare sigmoid, tanh, ReLU, Leaky ReLU, GELU, and Swish by gradient and dead-neuron risk</li><li>Pick output activation as softmax, sigmoid, or identity from the task</li><li>Derive MSE for regression and cross-entropy for classification losses</li><li>Build an activation-plus-loss pipeline on MNIST in PyTorch</li></ul></div>'

+ '<h2 class="l-title">1. Why Do We Need Activation Functions?</h2>'

+ '<p class="l-text">In <a href="/tutorials/ai/dl/neural-networks-intro">Lesson 1</a> we saw a neuron does this: <em>z = w<sup>⊤</sup>x + b</em>, then <em>ŷ = f(z)</em>. If <em>f</em> were just the identity (<em>f(z) = z</em>), the entire network would be a linear transformation. No matter how many layers you stack, the output is still linear.</p>'

+ '<div class="calc-example"><div class="example-label">LINEAR ON LINEAR IS STILL LINEAR</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Layer 1: <strong>z<sub>1</sub> = W<sub>1</sub>x + b<sub>1</sub></strong>'
+ '<br>Layer 2: <strong>z<sub>2</sub> = W<sub>2</sub>z<sub>1</sub> + b<sub>2</sub> = W<sub>2</sub>(W<sub>1</sub>x + b<sub>1</sub>) + b<sub>2</sub> = (W<sub>2</sub>W<sub>1</sub>)x + (W<sub>2</sub>b<sub>1</sub> + b<sub>2</sub>)</strong>'
+ '</p>'
+ '<p class="l-text">Three layers collapse to one linear transform. Without activations, a "deep" network is not deep at all.</p>'
+ '</div></div>'

+ '<p class="l-text"><strong>The activation must be non-linear.</strong> That non-linearity gives the network expressive power, taking it beyond linear regression. Which non-linear function should we choose? Many candidates, each with strengths and weaknesses.</p>'

+ '<h2 class="l-title">2. Sigmoid — The Old Guard</h2>'

+ '<div class="katex-block">$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>'

+ '<p class="l-text">Familiar from logistic regression (<a href="/tutorials/ai/ml/logistic-regression-classification">ML L3</a>): squashes any real number into (0, 1). For z near 0, σ ≈ 0.5; for large positive, ≈ 1; for large negative, ≈ 0. The default activation in early neural networks (1980-2010).</p>'

+ '<p class="l-text"><strong>Problems:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>Vanishing gradient:</strong> when z is large, σ\'(z) ≈ 0. In backpropagation the gradient effectively dies — deep networks cannot train.</li>'
+ '<li><strong>Not zero-centred:</strong> output always in [0, 1], mean ~0.5. Subsequent layers always receive positive inputs → slower training.</li>'
+ '<li><strong>Expensive:</strong> exp() is slow.</li>'
+ '</ul>'

+ '<p class="l-text">In practice: <em>not used</em> in hidden layers. Still common at the output of binary classification (to compute P(y=1)).</p>'

+ '<h2 class="l-title">3. Tanh — Zero-Centred Sigmoid</h2>'

+ '<div class="katex-block">$$\\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}} = 2\\sigma(2z) - 1$$</div>'

+ '<p class="l-text">Tanh is an improved sigmoid: output in (-1, 1), mean around 0. Being zero-centred makes layer-to-layer training healthier.</p>'

+ '<p class="l-text">Still suffers vanishing gradient — for large z the derivative is near zero. Tanh is still preferred in RNN hidden states (lesson 8) but lost to ReLU in typical feedforward networks.</p>'

+ '<h2 class="l-title">4. ReLU — A Revolution</h2>'

+ '<div class="katex-block">$$\\text{ReLU}(z) = \\max(0, z)$$</div>'

+ '<p class="l-text"><strong>ReLU (Rectified Linear Unit)</strong> became the standard around 2010. Visually: 0 for negative z, z for positive. That is all.</p>'

+ '<p class="l-text"><strong>Pros:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>No vanishing gradient (positive side):</strong> derivative is 1 for z &gt; 0. Gradients flow.</li>'
+ '<li><strong>Compute is trivially fast:</strong> max() is one if-else. No exp/log.</li>'
+ '<li><strong>Sparsity:</strong> negative inputs zero out, half the network is inactive each batch — neural-level efficiency.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Problem:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>Dying ReLU:</strong> if a neuron\'s inputs become persistently negative, its derivative gets stuck at 0 → its weights never update → "dead" neuron.</li>'
+ '</ul>'

+ '<p class="l-text">Largely solved by Leaky ReLU.</p>'

+ '<h2 class="l-title">5. Leaky ReLU & Variants</h2>'

+ '<div class="katex-block">$$\\text{LeakyReLU}(z) = \\begin{cases} z & \\text{if } z > 0 \\\\ \\alpha z & \\text{if } z \\leq 0 \\end{cases}$$</div>'

+ '<p class="l-text">A small slope on the negative side instead of zero (<em>α ≈ 0.01</em>). Neurons do not "die"; gradients keep flowing.</p>'

+ '<p class="l-text">Variants:</p>'

+ '<ul class="l-list">'
+ '<li><strong>PReLU:</strong> α is a learnable parameter, separate per neuron.</li>'
+ '<li><strong>ELU:</strong> on negative side a curve α(e<sup>z</sup> − 1). Smoother, mean closer to zero.</li>'
+ '<li><strong>SELU:</strong> ELU plus self-normalising properties.</li>'
+ '</ul>'

+ '<h2 class="l-title">6. GELU & Swish — Modern Standard</h2>'

+ '<p class="l-text">Post-2018 Transformer architectures (BERT, GPT) use smooth alternatives to ReLU.</p>'

+ '<h3 class="l-subtitle">GELU</h3>'

+ '<div class="katex-block">$$\\text{GELU}(z) = z \\cdot \\Phi(z)$$</div>'

+ '<p class="l-text">Where Φ(z) is the standard normal CDF. Intuition: scale the input <em>by the probability of being positive</em>. Positive z: roughly ReLU. Negative z: small negative value (not zero). Very smooth, differentiable everywhere — standard in modern transformers.</p>'

+ '<h3 class="l-subtitle">Swish (SiLU)</h3>'

+ '<div class="katex-block">$$\\text{Swish}(z) = z \\cdot \\sigma(z)$$</div>'

+ '<p class="l-text">Google Brain (2017): "z times sigmoid(z)". Curve similar to GELU, slightly faster to compute. Used in MobileNet, EfficientNet, etc.</p>'

+ '<div class="plotly-graph"><div id="plot-act-en" style="width:100%;height:420px;"></div></div>'
+ '<script>setTimeout(function(){window.__dlRegDraw(function(){'
+ 'var T=window.__dlChartTheme();'
+ 'var z=[];for(var i=-50;i<=50;i++)z.push(i/10);'
+ 'var sig=z.map(function(v){return 1/(1+Math.exp(-v));});'
+ 'var tanh=z.map(function(v){return Math.tanh(v);});'
+ 'var relu=z.map(function(v){return Math.max(0,v);});'
+ 'var lrelu=z.map(function(v){return v>0?v:0.1*v;});'
+ 'var swish=z.map(function(v){return v/(1+Math.exp(-v));});'
+ 'var t1={x:z,y:sig,name:"Sigmoid",type:"scatter",mode:"lines",line:{color:"rgba(248,113,113,.85)",width:2}};'
+ 'var t2={x:z,y:tanh,name:"Tanh",type:"scatter",mode:"lines",line:{color:"rgba(78,205,196,.85)",width:2}};'
+ 'var t3={x:z,y:relu,name:"ReLU",type:"scatter",mode:"lines",line:{color:T.accent,width:3}};'
+ 'var t4={x:z,y:lrelu,name:"Leaky ReLU",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.85)",width:2,dash:"dash"}};'
+ 'var t5={x:z,y:swish,name:"Swish",type:"scatter",mode:"lines",line:{color:"rgba(255,206,84,.85)",width:2}};'
+ 'var layout={xaxis:{title:"z",color:T.text,gridcolor:T.grid,zerolinecolor:T.grid},yaxis:{title:"f(z)",color:T.text,gridcolor:T.grid,range:[-1.5,5]},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",x:0.5,xanchor:"center",y:1.08,yanchor:"bottom"}};'
+ 'if(document.getElementById("plot-act-en"))Plotly.newPlot("plot-act-en",[t1,t2,t3,t4,t5],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Five activations side by side. Sigmoid and Tanh are S-shaped — saturate for large z (gradient vanishes). ReLU is linear on the positive side, exactly 0 on the negative. Leaky ReLU has a small slope on the negative side (does not die). Swish is smooth, similar to ReLU but with small negative outputs below zero. Modern architectures use ReLU/GELU/Swish; sigmoid/tanh are no longer preferred in hidden layers.</div>'

+ '<h2 class="l-title">7. Output Activations — Task-Driven</h2>'

+ '<p class="l-text">Hidden layers use ReLU/GELU etc., but <strong>the output activation depends on the task</strong>:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Regression:</strong> no activation — plain linear output (e.g. house price).</li>'
+ '<li><strong>Binary classification:</strong> sigmoid → single probability in [0, 1].</li>'
+ '<li><strong>Multiclass (e.g. MNIST):</strong> softmax → probability per class, summing to 1.</li>'
+ '<li><strong>Multilabel:</strong> independent sigmoids (one probability per label).</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Softmax — critical for multiclass</h3>'

+ '<div class="katex-block">$$\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}$$</div>'

+ '<p class="l-text">Turns a K-dim vector into a probability distribution: each component in [0,1], summing to 1. For MNIST, applied to the 10 output neurons → 10 digit probabilities.</p>'

+ '<h2 class="l-title">8. Loss Functions — The Model\'s "Error"</h2>'

+ '<p class="l-text">We saw MSE in <a href="/tutorials/ai/ml/linear-regression">ML L2</a> and cross-entropy in <a href="/tutorials/ai/ml/logistic-regression-classification">ML L3</a>. DL builds on the same foundation.</p>'

+ '<h3 class="l-subtitle">Regression: MSE & MAE</h3>'

+ '<div class="katex-block">$$\\text{MSE} = \\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2, \\qquad \\text{MAE} = \\frac{1}{n}\\sum_{i=1}^{n}|y_i - \\hat{y}_i|$$</div>'

+ '<p class="l-text">MSE penalises large errors quadratically — outlier-sensitive. MAE is linear — more robust but the gradient at zero is undefined. <strong>Huber loss</strong> blends them: quadratic for small errors, linear for large. DL rarely uses these; most DL problems are classification.</p>'

+ '<h3 class="l-subtitle">Binary classification: Binary Cross-Entropy (BCE)</h3>'

+ '<div class="katex-block">$$\\text{BCE} = -\\frac{1}{n}\\sum_{i=1}^{n}\\bigl[y_i \\log \\hat{p}_i + (1-y_i)\\log(1-\\hat{p}_i)\\bigr]$$</div>'

+ '<p class="l-text">Sigmoid output + BCE is the classic binary classification pair. Heavily penalises being "confident and wrong".</p>'

+ '<h3 class="l-subtitle">Multiclass classification: Cross-Entropy</h3>'

+ '<div class="katex-block">$$\\text{CE} = -\\frac{1}{n}\\sum_{i=1}^{n}\\sum_{k=1}^{K} y_{ik} \\log \\hat{p}_{ik}$$</div>'

+ '<p class="l-text">Where <em>y<sub>ik</sub></em> is the one-hot label (1 for the true class, 0 for the rest). For MNIST K=10. Given the one-hot, the formula simplifies to:</p>'

+ '<div class="katex-block">$$\\text{CE} = -\\frac{1}{n}\\sum_{i=1}^{n} \\log \\hat{p}_{i, y_i}$$</div>'

+ '<p class="l-text">"The log of the probability assigned to the correct class". If the model says 0.9 for the true class, log(0.9) ≈ -0.1; if 0.01, log(0.01) = -4.6 — heavy penalty.</p>'

+ '<h3 class="l-subtitle">Logits + Loss — A Numerical Stability Trick</h3>'

+ '<p class="l-text">Above we look like we apply softmax then take its log. In practice that overflows numerically (e<sup>1000</sup> = ∞). Modern libraries combine softmax and log into one operation (<code>log_softmax</code> + <code>nll_loss</code> = <code>cross_entropy</code>). That is why we do not apply softmax in the model\'s last layer in PyTorch:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Right pattern — do not apply softmax manually<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn'
+ '\n'
+ '\n<span class="cm"># WRONG — numerically unstable, training becomes unstable</span>'
+ '\nclass BadModel(nn.Module):'
+ '\n    def forward(self, x):'
+ '\n        z = self.<span class="fn">linear</span>(x)'
+ '\n        <span class="kw">return</span> nn.<span class="fn">functional</span>.<span class="fn">softmax</span>(z, dim=-<span class="num">1</span>)'
+ '\n'
+ '\n<span class="cm"># RIGHT — return logits, the loss applies softmax internally</span>'
+ '\n<span class="kw">class</span> GoodModel(nn.Module):'
+ '\n    <span class="kw">def</span> <span class="fn">forward</span>(self, x):'
+ '\n        <span class="kw">return</span> self.<span class="fn">linear</span>(x)  <span class="cm"># logits only</span>'
+ '\n'
+ '\nloss_fn = nn.<span class="fn">CrossEntropyLoss</span>()  <span class="cm"># applies softmax internally</span>'
+ '\nlogits = <span class="fn">model</span>(images)'
+ '\nloss = <span class="fn">loss_fn</span>(logits, labels)'
+ '\n'
+ '\n<span class="cm"># For predictions: torch.argmax(logits, dim=-1)</span>'
+ '\n<span class="cm"># For probabilities: torch.softmax(logits, dim=-1)</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Highlights two common mistakes. <code>nn.CrossEntropyLoss</code> internally does <code>log_softmax + nll</code> — it expects <em>logits</em> (raw scores). If your model already applies softmax, you double-softmax and training breaks. Rule: <strong>return logits, let the loss handle softmax</strong>. Apply softmax separately when you need probabilities.</p>'

+ '<h2 class="l-title">9. Which Activation When?</h2>'

+ '<div class="calc-example"><div class="example-label">PRACTICAL CHEAT SHEET</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Place</th><th style="padding:.5rem">Activation</th><th style="padding:.5rem">Why</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">MLP hidden layer</td><td style="text-align:center">ReLU</td><td style="padding:.5rem;color:var(--text-dim)">Fast, simple, usually enough</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">CNN hidden layer</td><td style="text-align:center">ReLU or Leaky ReLU</td><td style="padding:.5rem;color:var(--text-dim)">Standard; Leaky guards against dying ReLU</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Transformer / LLM</td><td style="text-align:center">GELU or Swish</td><td style="padding:.5rem;color:var(--text-dim)">BERT/GPT style, smoother gradient</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">RNN/LSTM hidden state</td><td style="text-align:center">Tanh</td><td style="padding:.5rem;color:var(--text-dim)">Zero-centred, bounded (-1, 1)</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Binary classification output</td><td style="text-align:center">Sigmoid</td><td style="padding:.5rem;color:var(--text-dim)">Probability in [0, 1]</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Multiclass output</td><td style="text-align:center">Softmax</td><td style="padding:.5rem;color:var(--text-dim)">Distribution over classes</td></tr>'
+ '<tr><td style="padding:.5rem">Regression output</td><td style="text-align:center">None (linear)</td><td style="padding:.5rem;color:var(--text-dim)">Output unbounded</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<h2 class="l-title">10. PyTorch on MNIST — Activation + Loss Pipeline</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> A full training step<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch'
+ '\n<span class="kw">import</span> torch.nn <span class="kw">as</span> nn'
+ '\n<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F'
+ '\n'
+ '\n<span class="kw">class</span> MNISTNet(nn.Module):'
+ '\n    <span class="kw">def</span> <span class="fn">__init__</span>(self):'
+ '\n        <span class="fn">super</span>().<span class="fn">__init__</span>()'
+ '\n        self.fc1 = nn.<span class="fn">Linear</span>(<span class="num">784</span>, <span class="num">128</span>)'
+ '\n        self.fc2 = nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">64</span>)'
+ '\n        self.fc3 = nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">10</span>)'
+ '\n'
+ '\n    <span class="kw">def</span> <span class="fn">forward</span>(self, x):'
+ '\n        x = x.<span class="fn">view</span>(x.<span class="fn">size</span>(<span class="num">0</span>), -<span class="num">1</span>)        <span class="cm"># 28×28 → 784</span>'
+ '\n        x = F.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x))         <span class="cm"># 1st hidden</span>'
+ '\n        x = F.<span class="fn">relu</span>(self.<span class="fn">fc2</span>(x))         <span class="cm"># 2nd hidden</span>'
+ '\n        <span class="kw">return</span> self.<span class="fn">fc3</span>(x)             <span class="cm"># return logits (NO softmax)</span>'
+ '\n'
+ '\nmodel = <span class="fn">MNISTNet</span>()'
+ '\nloss_fn = nn.<span class="fn">CrossEntropyLoss</span>()    <span class="cm"># softmax + log + nll combined</span>'
+ '\noptimizer = torch.optim.<span class="fn">Adam</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)'
+ '\n'
+ '\n<span class="cm"># One training step on a batch</span>'
+ '\nimages, labels = <span class="fn">next</span>(<span class="fn">iter</span>(train_loader))   <span class="cm"># (32, 1, 28, 28), (32,)</span>'
+ '\noptimizer.<span class="fn">zero_grad</span>()'
+ '\nlogits = <span class="fn">model</span>(images)'
+ '\nloss = <span class="fn">loss_fn</span>(logits, labels)'
+ '\nloss.<span class="fn">backward</span>()'
+ '\noptimizer.<span class="fn">step</span>()'
+ '\n<span class="fn">print</span>(<span class="str">f"Loss: {loss.item():.4f}"</span>)'
+ '\n'
+ '\n<span class="cm"># For predictions</span>'
+ '\nprobs = F.<span class="fn">softmax</span>(logits, dim=-<span class="num">1</span>)        <span class="cm"># (32, 10) probabilities</span>'
+ '\npreds = probs.<span class="fn">argmax</span>(dim=-<span class="num">1</span>)             <span class="cm"># (32,) predictions</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Everything from L1+L2 in one practical example. The model returns logits (10-dim, no softmax). <code>CrossEntropyLoss</code> applies softmax internally; numerically stable. The training step is four lines: zero_grad → forward → backward → step. <code>backward()</code> runs backpropagation (Lesson 3) — computes gradients for all parameters. <code>step()</code> uses Adam to update them (Lesson 4).</p>'

+ '<h2 class="l-title">11. What\'s Next</h2>'

+ '<p class="l-text">We have the forward side of a neural network and the math of evaluation (loss). One critical question remains: <em>we still do not know how to update weights to reduce the loss.</em> We saw gradient descent in ML (<a href="/tutorials/ai/ml/linear-regression">ML L2</a>) but computing gradients efficiently in a deep network is its own field. <a href="/tutorials/ai/dl/backpropagation-computational-graphs">Lesson 3</a> covers <strong>backpropagation and computational graphs</strong> — one of the most beautiful tricks in deep learning.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> Why activation functions are necessary (linear-on-linear is still linear). The math and trade-offs of sigmoid, tanh, ReLU, Leaky ReLU, GELU, Swish. The vanishing gradient problem and why sigmoid/tanh fell out of fashion in hidden layers. How output activations depend on the task (softmax for multiclass, sigmoid for binary, linear for regression). MSE, BCE, Cross-Entropy and when to use each. The logits + loss numerical-stability trick and the PyTorch idiom. A complete training step (zero_grad, forward, backward, step) in PyTorch.</div>'

};
