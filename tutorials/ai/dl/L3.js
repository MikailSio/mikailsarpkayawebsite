/* dl-new-L3.js — Deep Learning Lesson 3: Backpropagation & Hesap Grafı (TR + EN) */
var DL_L3 = {

tr:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Backpropagation — derin öğrenmenin tek motoru. Hesap grafı (computational graph) nedir, zincir kuralı (<a href="/tutorials/math/calculus/chain-rule-backprop">Calculus L4</a>) nasıl çalışır, bir MLP\'de gradyanlar katmandan katmana nasıl akar. Manuel hesap, sonra otomatik türev (autograd). Kayıp fonksiyonundan girdiye doğru "geri" giderek her ağırlığın hatayı ne kadar etkilediğini öğrenmek — sinir ağı eğitiminin kalbi bu.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Computational graph üzerinden zincir kuralını uçtan uca uygulayacaksın</li><li>2 katmanlı bir MLP\'de backward pass\'i sayısal olarak elden hesaplayacaksın</li><li>L katman için ağırlık ve bias gradyanlarının genel formülünü çıkaracaksın</li><li>PyTorch autograd\'ı çağırıp manuel gradyanlarınla doğrulama yapacaksın</li><li>Gradient checking ile backprop kodunu finite-difference\'a karşı test edeceksin</li></ul></div>'

+ '<h2 class="l-title">1. Sorun: Milyonlarca Parametrenin Türevini Nasıl Alacağız?</h2>'

+ '<p class="l-text">MNIST için kurduğumuz basit ağı hatırla (<a href="/tutorials/ai/dl/neural-networks-intro">Ders 1</a>): 784→128→10. Toplam parametre: 784·128 + 128 + 128·10 + 10 = <strong>101.770 ağırlık</strong>. Daha büyük ağlarda milyonlar, milyarlar. Eğitmek için her ağırlığın <em>kayıp fonksiyonuna katkısının türevini</em> bilmemiz gerek.</p>'

+ '<div class="calc-highlight"><strong>Naïve yaklaşım:</strong> Her ağırlığı tek tek küçük bir <em>ε</em> kadar değiştir, kaybı yeniden hesapla, farkı al. <em>O(n)</em> forward pass — n parametre için n kez tüm ağı çalıştırmak demek. 100k parametre × 60k örnek = <strong>imkânsız</strong>.</div>'

+ '<p class="l-text">Backpropagation tek bir akıllı pas ile <strong>tüm gradyanları aynı anda</strong> çıkarır. Süre maliyeti: bir forward pass\'ten sadece ~2-3× daha pahalı. 1986\'da Rumelhart, Hinton ve Williams\'ın çalışması bu sayede modern derin öğrenmeyi mümkün kıldı.</p>'

+ '<h2 class="l-title">2. Hesap Grafı (Computational Graph)</h2>'

+ '<p class="l-text">Her hesaplama bir grafa açılabilir: düğümler değişkenler/operatörler, kenarlar veri akışı. Çok basit bir örnekle başlayalım.</p>'

+ '<div class="calc-example"><div class="example-label">ÖRNEK: <em>L = (a·b + c)<sup>2</sup></em></div><div class="example-body">'
+ '<p class="l-text">Bu ifadeyi adımlara bölelim:</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:2">'
+ '<strong>u = a · b</strong> &nbsp;(çarpma düğümü)'
+ '<br><strong>v = u + c</strong> &nbsp;(toplama düğümü)'
+ '<br><strong>L = v<sup>2</sup></strong> &nbsp;(kare düğümü)'
+ '</p>'
+ '<p class="l-text"><em>a=2, b=3, c=4</em> verilsin: u = 6, v = 10, L = 100. Bu <strong>forward pass</strong>.</p>'
+ '</div></div>'

+ '<p class="l-text">Şimdi <em>L\'nin a, b, c\'ye göre türevini</em> hesaplamak istiyoruz. Yani: a\'yı biraz değiştirsem L ne kadar değişir? Cevap zincir kuralından gelir.</p>'

+ '<h2 class="l-title">3. Zincir Kuralı — Tek Cümle</h2>'

+ '<div class="katex-block">$$\\frac{\\partial L}{\\partial a} = \\frac{\\partial L}{\\partial v} \\cdot \\frac{\\partial v}{\\partial u} \\cdot \\frac{\\partial u}{\\partial a}$$</div>'

+ '<p class="l-text">Üç düğümü geriye doğru zincirle: her ara bağlantının yerel türevini al, çarp, geç. <a href="/tutorials/math/calculus/chain-rule-backprop">Calculus L4</a>\'te zincir kuralının formal türevini gördük; burada yapacağımız tam olarak o, ama bilgisayar üzerinde sistematik biçimde.</p>'

+ '<div class="calc-example"><div class="example-label">YEREL TÜREVLER</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);line-height:2">'
+ '<strong>L = v²</strong> → ∂L/∂v = 2v = 2·10 = <strong>20</strong>'
+ '<br><strong>v = u + c</strong> → ∂v/∂u = <strong>1</strong>'
+ '<br><strong>u = a · b</strong> → ∂u/∂a = b = <strong>3</strong>'
+ '</p>'
+ '<p class="l-text"><strong>Çarp:</strong> ∂L/∂a = 20 · 1 · 3 = <strong>60</strong>.</p>'
+ '<p class="l-text">Aynı şekilde ∂L/∂b = 20·1·a = 40, ∂L/∂c = 20·1 = 20.</p>'
+ '</div></div>'

+ '<h2 class="l-title">4. Backward Pass — Geriye Akış</h2>'

+ '<p class="l-text">Yukarıdaki örnekte üç türevi bulduk; ama her birinde aynı parçayı (∂L/∂v) tekrar hesapladık. Backpropagation\'ın "akıllı" yanı şu: <strong>her düğümün gradyanı bir kez hesaplanır, ileri zincirde yerine konur</strong>.</p>'

+ '<div class="calc-highlight"><strong>Algoritma:</strong>'
+ '<br>1. <strong>Forward:</strong> Girdiden çıktıya doğru tüm ara değerleri hesapla, sakla (a, b, c, u, v, L).'
+ '<br>2. <strong>Backward:</strong> Çıktıdan girdiye doğru her düğümde:'
+ '<br>&nbsp;&nbsp;&nbsp;a) Yukarıdan gelen gradyanı al.'
+ '<br>&nbsp;&nbsp;&nbsp;b) Yerel türevle çarp.'
+ '<br>&nbsp;&nbsp;&nbsp;c) Düğümün girdilerine dağıt.'
+ '</div>'

+ '<p class="l-text">Toplama düğümü gradyanı eşit dağıtır: ∂(u+c)/∂u = 1, ∂(u+c)/∂c = 1. Çarpma düğümü "diğer girdiyi" kullanır: ∂(a·b)/∂a = b, ∂(a·b)/∂b = a. Bu iki kuralla pratikte her şey çözülür.</p>'

+ '<h2 class="l-title">5. Bir Nöronun Backpropagation\'u</h2>'

+ '<p class="l-text">Şimdi gerçek senaryoya geçelim. Tek bir nöron + sigmoid aktivasyon + binary cross-entropy:</p>'

+ '<div class="katex-block">$$z = w \\cdot x + b, \\quad a = \\sigma(z), \\quad L = -[y \\log a + (1-y) \\log(1-a)]$$</div>'

+ '<p class="l-text">Türevini almak istediğimiz: <em>∂L/∂w</em>. Zincir kuralını uygula:</p>'

+ '<div class="katex-block">$$\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial a} \\cdot \\frac{\\partial a}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}$$</div>'

+ '<p class="l-text">Her parça:</p>'

+ '<ul class="l-list">'
+ '<li><strong>∂L/∂a</strong> = -(y/a) + (1-y)/(1-a)</li>'
+ '<li><strong>∂a/∂z</strong> = σ(z)·(1-σ(z)) = a(1-a) (sigmoid türevi)</li>'
+ '<li><strong>∂z/∂w</strong> = x</li>'
+ '</ul>'

+ '<p class="l-text">Bunları çarpıp sadeleştirince çok temiz bir sonuç çıkar:</p>'

+ '<div class="katex-block">$$\\frac{\\partial L}{\\partial w} = (a - y) \\cdot x$$</div>'

+ '<p class="l-text"><strong>"Tahmin eksi gerçek" çarpı girdi.</strong> İşte bu kadar. Sigmoid + cross-entropy kombinasyonunun türevi tam olarak hatadır. Bu güzel sadeleşme tesadüf değil — cross-entropy ile sigmoid bilerek eşleştirilmiştir (ve softmax + cross-entropy de aynı şekilde davranır).</p>'

+ '<h2 class="l-title">6. Çok Katmanlı Ağ — Genel Formül</h2>'

+ '<p class="l-text">Şimdi MLP\'ye genelleştirelim. <em>L</em> katmanlı bir ağ olsun, her katman:</p>'

+ '<div class="katex-block">$$z^{(\\ell)} = W^{(\\ell)} a^{(\\ell-1)} + b^{(\\ell)}, \\quad a^{(\\ell)} = f(z^{(\\ell)})$$</div>'

+ '<p class="l-text">Burada <em>a<sup>(0)</sup> = x</em> (girdi), <em>a<sup>(L)</sup> = ŷ</em> (çıktı). <em>δ<sup>(ℓ)</sup> = ∂Loss/∂z<sup>(ℓ)</sup></em> tanımlayalım — "katman ℓ\'deki hata sinyali".</p>'

+ '<div class="calc-example"><div class="example-label">İKİ ADIM REKÜRSİYON</div><div class="example-body">'
+ '<p class="l-text"><strong>Çıktı katmanı (sigmoid + BCE veya softmax + CE için):</strong></p>'
+ '<div class="katex-block">$$\\delta^{(L)} = a^{(L)} - y$$</div>'
+ '<p class="l-text"><strong>Geriye doğru her katman için:</strong></p>'
+ '<div class="katex-block">$$\\delta^{(\\ell)} = (W^{(\\ell+1)})^\\top \\delta^{(\\ell+1)} \\odot f\'(z^{(\\ell)})$$</div>'
+ '<p class="l-text"><strong>Ağırlık ve bias gradyanları:</strong></p>'
+ '<div class="katex-block">$$\\frac{\\partial L}{\\partial W^{(\\ell)}} = \\delta^{(\\ell)} (a^{(\\ell-1)})^\\top, \\quad \\frac{\\partial L}{\\partial b^{(\\ell)}} = \\delta^{(\\ell)}$$</div>'
+ '</div></div>'

+ '<p class="l-text"><strong>⊙</strong> = elementwise (Hadamard) çarpım. <strong>f\'</strong> = aktivasyon türevi (ReLU için 1 veya 0; sigmoid için a(1-a); tanh için 1-tanh²(z)).</p>'

+ '<p class="l-text">Tek satıra inelim: <em>her katmanın hata sinyali, sonraki katmandan gelen sinyalin geri-çarpılmış hâlidir</em>. Çıkıştan girdiye doğru her şey otomatik akar.</p>'

+ '<h2 class="l-title">7. Sayısal Bir Örnek — 2 Katmanlı Ağ</h2>'

+ '<p class="l-text">Çok küçük bir örnek üzerinden adım adım ilerleyelim. <em>x = [1, 2]</em>, <em>y = 1</em>, sigmoid, BCE.</p>'

+ '<div class="calc-example"><div class="example-label">FORWARD PASS</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'W₁ = [[0.5, -0.3], [0.2, 0.8]], &nbsp; b₁ = [0, 0]'
+ '<br>W₂ = [[0.7, -0.5]], &nbsp; b₂ = [0]'
+ '<br>'
+ '<br>z₁ = W₁·x + b₁ = [0.5·1 + (-0.3)·2, &nbsp; 0.2·1 + 0.8·2] = <strong>[-0.1, 1.8]</strong>'
+ '<br>a₁ = σ(z₁) = <strong>[0.475, 0.858]</strong>'
+ '<br>z₂ = W₂·a₁ + b₂ = 0.7·0.475 + (-0.5)·0.858 = <strong>-0.096</strong>'
+ '<br>a₂ = σ(-0.096) = <strong>0.476</strong> &nbsp;(tahmin)'
+ '<br>L = -log(0.476) = <strong>0.742</strong>'
+ '</p>'
+ '</div></div>'

+ '<div class="calc-example"><div class="example-label">BACKWARD PASS</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'δ₂ = a₂ - y = 0.476 - 1 = <strong>-0.524</strong>'
+ '<br>'
+ '<br>∂L/∂W₂ = δ₂ · a₁ᵀ = -0.524 · [0.475, 0.858] = <strong>[-0.249, -0.450]</strong>'
+ '<br>∂L/∂b₂ = δ₂ = <strong>-0.524</strong>'
+ '<br>'
+ '<br>δ₁ = (W₂ᵀ · δ₂) ⊙ σ\'(z₁)'
+ '<br>&nbsp;&nbsp;&nbsp;= ([0.7, -0.5]ᵀ · (-0.524)) ⊙ [0.249, 0.122]'
+ '<br>&nbsp;&nbsp;&nbsp;= [-0.367, 0.262] ⊙ [0.249, 0.122] = <strong>[-0.0913, 0.0320]</strong>'
+ '<br>'
+ '<br>∂L/∂W₁ = δ₁ · xᵀ = [[-0.0913, -0.183], [0.032, 0.064]]'
+ '<br>∂L/∂b₁ = δ₁ = <strong>[-0.0913, 0.0320]</strong>'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Sonra <em>W ← W - η·∂L/∂W</em> adımıyla ağırlıkları güncelle. Bir gradient descent adımı tamamlandı.</p>'

+ '<h2 class="l-title">8. Otomatik Türev (Autograd)</h2>'

+ '<p class="l-text">Modern derin öğrenme kütüphaneleri (<strong>PyTorch, TensorFlow, JAX</strong>) bu zinciri otomatik kurar. Sen forward pass\'i yazarsın, kütüphane:</p>'

+ '<ul class="l-list">'
+ '<li>Hesap grafını kurar (her tensör üzerindeki operasyonu kaydeder).</li>'
+ '<li>Gradient hesabı için her operasyonun yerel türev kuralını bilir.</li>'
+ '<li><code>.backward()</code> çağrıldığında zinciri tersine çalıştırır.</li>'
+ '</ul>'

+ '<div class="calc-example"><div class="example-label">PYTORCH AUTOGRAD</div><div class="example-body"><div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch\n\n<span class="cm"># Skaler örnek: L = (a*b + c)^2</span>\na = torch.<span class="fn">tensor</span>(<span class="num">2.0</span>, requires_grad=<span class="kw">True</span>)\nb = torch.<span class="fn">tensor</span>(<span class="num">3.0</span>, requires_grad=<span class="kw">True</span>)\nc = torch.<span class="fn">tensor</span>(<span class="num">4.0</span>, requires_grad=<span class="kw">True</span>)\n\nL = (a * b + c) ** <span class="num">2</span>\nL.<span class="fn">backward</span>()  <span class="cm"># geri yayılım</span>\n\n<span class="fn">print</span>(a.grad)  <span class="cm"># 60.0</span>\n<span class="fn">print</span>(b.grad)  <span class="cm"># 40.0</span>\n<span class="fn">print</span>(c.grad)  <span class="cm"># 20.0</span></code></pre></div></div></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> <code>requires_grad=True</code> olan tensörler "izlenecek". Her aritmetik operasyon hesap grafına eklenir. <code>L.backward()</code> grafı tersine yürüyüp her tensörün <code>.grad</code> alanını doldurur. Manuel olarak ne hesapladığımızla aynı: 60, 40, 20.</p>'

+ '<p class="l-text">Pratikte sadece manuel olarak doğrulamak istediğin küçük örneklerde böyle yazarsın. Gerçek modellerde <code>nn.Module</code> ve <code>optimizer</code> kullanılır:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># MNIST eğitim adımı</span>\noptimizer.<span class="fn">zero_grad</span>()      <span class="cm"># eski gradyanları sıfırla</span>\nlogits = <span class="fn">model</span>(x_batch)    <span class="cm"># forward — graf otomatik kurulur</span>\nloss = <span class="fn">criterion</span>(logits, y_batch)\nloss.<span class="fn">backward</span>()            <span class="cm"># graf tersine — tüm parametrelerin .grad\'ı dolar</span>\noptimizer.<span class="fn">step</span>()           <span class="cm"># W ← W - η·.grad</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> 4 satırda derin öğrenmenin tüm motoru. <code>zero_grad()</code> bir önceki batch\'in gradyanlarını siler (yoksa birikir). <code>backward()</code> backpropagation\'ı tetikler. <code>step()</code> ağırlıkları günceller.</p>'

+ '<h2 class="l-title">9. Forward & Backward Akışı — Görsel</h2>'

+ '<p class="l-text">Aşağıda 2 katmanlı ağda hesap grafının düğümlerini gösteriyoruz. Forward sol→sağ; backward sağ→sol aynı kenarlardan ters yöne akar:</p>'

+ '<div class="calc-graph" style="height:420px"><div id="dl-l3-flow"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l3-flow"))return;var th=window.__dlChartTheme();var nodesX=[0.5, 2.5, 2.5, 4.5, 4.5, 6.5, 8.5];var nodesY=[2, 3, 1, 3, 1, 2, 2];var labels=["x","z₁ⁱ","z₁ⁱⁱ","a₁ⁱ","a₁ⁱⁱ","z₂","L"];var edges=[[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[5,6]];var traces=[];edges.forEach(function(e){traces.push({type:"scatter",mode:"lines",x:[nodesX[e[0]],nodesX[e[1]]],y:[nodesY[e[0]],nodesY[e[1]]],line:{color:th.accent,width:2.5},showlegend:false,hoverinfo:"skip"});});traces.push({type:"scatter",mode:"markers+text",x:nodesX,y:nodesY,text:labels,textposition:"middle center",textfont:{color:th.text,size:14,family:"monospace"},marker:{size:42,color:th.paper,line:{color:th.accent,width:2.5}},hoverinfo:"skip",showlegend:false});Plotly.newPlot("dl-l3-flow",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{visible:false,range:[-0.2,9.2]},yaxis:{visible:false,range:[0,4]},margin:{t:50,r:20,b:20,l:20},height:400,title:{text:"Forward: x → z₁ → a₁ → z₂ → L &nbsp;&nbsp;|&nbsp;&nbsp; Backward: aynı kenarlar ters yönde",font:{color:th.text,size:13}},showlegend:false},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<p class="l-text">Her ok bir hesaplama bağıntısıdır. Forward pass\'te ok yönünde gidersin, sonuçları saklarsın. Backward pass\'te aynı oklarda <em>ters yönde</em> gidersin, gradyanları taşırsın. Saklanan ara değerler (a₁, z₂...) geri yolda kullanılır — bu yüzden ağ büyüdükçe <strong>bellek</strong> artar (büyük modelleri eğitirken VRAM bottleneck olmasının ana nedeni).</p>'

+ '<h2 class="l-title">10. Gradient Checking — Doğrulama</h2>'

+ '<p class="l-text">Backprop kodunu kendin yazıyorsan (deneysel modellerde sıkça olur), <strong>gradient checking</strong> ile doğrulamalısın. Sayısal türevle karşılaştır:</p>'

+ '<div class="katex-block">$$\\frac{\\partial L}{\\partial w} \\approx \\frac{L(w + \\epsilon) - L(w - \\epsilon)}{2\\epsilon}, \\quad \\epsilon = 10^{-7}$$</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">def</span> <span class="fn">check_grad</span>(loss_fn, w, analytical_grad, eps=<span class="num">1e</span>-<span class="num">7</span>):\n    w_pos = w + eps\n    w_neg = w - eps\n    numerical = (<span class="fn">loss_fn</span>(w_pos) - <span class="fn">loss_fn</span>(w_neg)) / (<span class="num">2</span> * eps)\n    rel_error = <span class="fn">abs</span>(analytical_grad - numerical) / (<span class="fn">abs</span>(analytical_grad) + <span class="fn">abs</span>(numerical) + <span class="num">1e</span>-<span class="num">12</span>)\n    <span class="kw">return</span> rel_error  <span class="cm"># 1e-7 altında ise doğru</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Bir parametreyi ε kadar ileri-geri oynatıp kayıp farkından sayısal türev çıkarır. Senin yazdığın analitik gradyanla kıyaslar. Göreli hata 10⁻⁷\'den küçükse implementasyon doğrudur.</p>'

+ '<p class="l-text">PyTorch/TensorFlow autograd kullanıyorsan buna gerek yok — kütüphane zaten test edilmiştir. Sadece custom kernel/operator yazıyorsan gradient checking şarttır.</p>'

+ '<h2 class="l-title">11. Tipik Tuzaklar</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Vanishing gradient</div><div class="card-body">Çok katmanlı ağda <em>δ</em> her katmanda küçülürse (özellikle sigmoid/tanh ile), ilk katmanlar hiç öğrenmez. Çözüm: ReLU, batch normalization, residual connection — Ders 5 ve 6\'da detayda.</div></div>'
+ '<div class="calc-card"><div class="card-title">Exploding gradient</div><div class="card-body">δ her katmanda büyürse gradyan patlar — NaN değerler ortaya çıkar. Çözüm: gradient clipping, dikkatli ağırlık başlatma (He, Xavier).</div></div>'
+ '<div class="calc-card"><div class="card-title">Gradyan biriktirme</div><div class="card-body"><code>zero_grad()</code> unutmak — gradyanlar batch\'ten batch\'e toplanır, eğitim kaotik olur. PyTorch\'ta her step başında çağrılması zorunlu.</div></div>'
+ '<div class="calc-card"><div class="card-title">In-place ops + autograd</div><div class="card-body"><code>x += 1</code> tensörü bozar, autograd hata verir. Yeni tensör oluştur: <code>x = x + 1</code>.</div></div>'
+ '</div>'

+ '<div class="think-box"><strong>📌 Özetle:</strong> Backpropagation = zincir kuralı + akıllı önbellekleme. Forward pass\'te ara değerleri sakla, backward pass\'te çıkıştan girdiye geri akıt. Modern kütüphaneler bunu otomatik yapar — sen forward pass\'i yazarsın, gradyanlar bedava gelir. <strong>Bir sonraki ders: Optimizasyon.</strong> Gradyan elde ettik; şimdi en akıllı şekilde nasıl kullanacağız? SGD, momentum, Adam, learning rate scheduling.</div>'

,

en:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn in this lesson:</strong> Backpropagation — the single engine of deep learning. What a computational graph is, how the chain rule (<a href="/tutorials/math/calculus/chain-rule-backprop">Calculus L4</a>) works, how gradients flow layer by layer through an MLP. Manual computation first, then automatic differentiation (autograd). Going "backwards" from the loss to the input to learn how much each weight affects the error — this is the heart of neural network training.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 IN THIS LESSON YOU WILL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Apply the chain rule end-to-end on a computational graph</li><li>Compute the backward pass numerically by hand for a 2-layer MLP</li><li>Derive the general formulas for weight and bias gradients in an L-layer network</li><li>Call PyTorch autograd and verify against your manual gradients</li><li>Test your backprop code against finite-difference gradient checking</li></ul></div>'

+ '<h2 class="l-title">1. The Problem: How Do We Differentiate Millions of Parameters?</h2>'

+ '<p class="l-text">Recall the simple network we built for MNIST (<a href="/tutorials/ai/dl/neural-networks-intro">Lesson 1</a>): 784→128→10. Total parameters: 784·128 + 128 + 128·10 + 10 = <strong>101,770 weights</strong>. Larger networks have millions or billions. To train them, we need to know <em>the derivative of the loss function with respect to every single weight</em>.</p>'

+ '<div class="calc-highlight"><strong>Naïve approach:</strong> Perturb each weight by a tiny <em>ε</em>, recompute the loss, take the difference. <em>O(n)</em> forward passes — meaning we run the entire network n times for n parameters. 100k parameters × 60k examples = <strong>impossible</strong>.</div>'

+ '<p class="l-text">Backpropagation extracts <strong>all gradients at once</strong> with a single clever pass. Cost: only ~2-3× more expensive than one forward pass. The 1986 work of Rumelhart, Hinton and Williams made modern deep learning possible thanks to this.</p>'

+ '<h2 class="l-title">2. The Computational Graph</h2>'

+ '<p class="l-text">Every computation can be unrolled into a graph: nodes are variables/operators, edges are data flow. Let us start with a very simple example.</p>'

+ '<div class="calc-example"><div class="example-label">EXAMPLE: <em>L = (a·b + c)<sup>2</sup></em></div><div class="example-body">'
+ '<p class="l-text">Let us break this expression into steps:</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:2">'
+ '<strong>u = a · b</strong> &nbsp;(multiplication node)'
+ '<br><strong>v = u + c</strong> &nbsp;(addition node)'
+ '<br><strong>L = v<sup>2</sup></strong> &nbsp;(square node)'
+ '</p>'
+ '<p class="l-text">Given <em>a=2, b=3, c=4</em>: u = 6, v = 10, L = 100. This is the <strong>forward pass</strong>.</p>'
+ '</div></div>'

+ '<p class="l-text">Now we want to compute <em>the derivative of L with respect to a, b, c</em>. That is: if I change a a bit, how much does L change? The answer comes from the chain rule.</p>'

+ '<h2 class="l-title">3. The Chain Rule — In One Sentence</h2>'

+ '<div class="katex-block">$$\\frac{\\partial L}{\\partial a} = \\frac{\\partial L}{\\partial v} \\cdot \\frac{\\partial v}{\\partial u} \\cdot \\frac{\\partial u}{\\partial a}$$</div>'

+ '<p class="l-text">Chain three nodes backwards: take each intermediate connection\'s local derivative, multiply, move on. We saw the formal derivation of the chain rule in <a href="/tutorials/math/calculus/chain-rule-backprop">Calculus L4</a>; what we are doing here is exactly that, but systematically on a computer.</p>'

+ '<div class="calc-example"><div class="example-label">LOCAL DERIVATIVES</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);line-height:2">'
+ '<strong>L = v²</strong> → ∂L/∂v = 2v = 2·10 = <strong>20</strong>'
+ '<br><strong>v = u + c</strong> → ∂v/∂u = <strong>1</strong>'
+ '<br><strong>u = a · b</strong> → ∂u/∂a = b = <strong>3</strong>'
+ '</p>'
+ '<p class="l-text"><strong>Multiply:</strong> ∂L/∂a = 20 · 1 · 3 = <strong>60</strong>.</p>'
+ '<p class="l-text">Similarly ∂L/∂b = 20·1·a = 40, ∂L/∂c = 20·1 = 20.</p>'
+ '</div></div>'

+ '<h2 class="l-title">4. The Backward Pass — Flow Backwards</h2>'

+ '<p class="l-text">In the example above we found three derivatives, but in each one we recomputed the same piece (∂L/∂v). The "clever" part of backpropagation is this: <strong>each node\'s gradient is computed once and reused along the chain</strong>.</p>'

+ '<div class="calc-highlight"><strong>Algorithm:</strong>'
+ '<br>1. <strong>Forward:</strong> Compute and cache all intermediate values from input to output (a, b, c, u, v, L).'
+ '<br>2. <strong>Backward:</strong> From output back to input, at each node:'
+ '<br>&nbsp;&nbsp;&nbsp;a) Take the gradient coming from above.'
+ '<br>&nbsp;&nbsp;&nbsp;b) Multiply by the local derivative.'
+ '<br>&nbsp;&nbsp;&nbsp;c) Distribute to the node\'s inputs.'
+ '</div>'

+ '<p class="l-text">An addition node distributes the gradient equally: ∂(u+c)/∂u = 1, ∂(u+c)/∂c = 1. A multiplication node uses "the other input": ∂(a·b)/∂a = b, ∂(a·b)/∂b = a. With these two rules in practice everything is solved.</p>'

+ '<h2 class="l-title">5. Backpropagation Through a Single Neuron</h2>'

+ '<p class="l-text">Now let us move to a real scenario. A single neuron + sigmoid activation + binary cross-entropy:</p>'

+ '<div class="katex-block">$$z = w \\cdot x + b, \\quad a = \\sigma(z), \\quad L = -[y \\log a + (1-y) \\log(1-a)]$$</div>'

+ '<p class="l-text">The derivative we want: <em>∂L/∂w</em>. Apply the chain rule:</p>'

+ '<div class="katex-block">$$\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial a} \\cdot \\frac{\\partial a}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}$$</div>'

+ '<p class="l-text">Each piece:</p>'

+ '<ul class="l-list">'
+ '<li><strong>∂L/∂a</strong> = -(y/a) + (1-y)/(1-a)</li>'
+ '<li><strong>∂a/∂z</strong> = σ(z)·(1-σ(z)) = a(1-a) (sigmoid derivative)</li>'
+ '<li><strong>∂z/∂w</strong> = x</li>'
+ '</ul>'

+ '<p class="l-text">When you multiply and simplify these, a very clean result emerges:</p>'

+ '<div class="katex-block">$$\\frac{\\partial L}{\\partial w} = (a - y) \\cdot x$$</div>'

+ '<p class="l-text"><strong>"Prediction minus ground truth" times the input.</strong> That is all. The derivative of the sigmoid + cross-entropy combination is exactly the error. This nice simplification is no coincidence — cross-entropy was deliberately paired with sigmoid (and softmax + cross-entropy behaves the same way).</p>'

+ '<h2 class="l-title">6. Multi-Layer Network — The General Formula</h2>'

+ '<p class="l-text">Now let us generalize to an MLP. Suppose we have an <em>L</em>-layer network, where each layer is:</p>'

+ '<div class="katex-block">$$z^{(\\ell)} = W^{(\\ell)} a^{(\\ell-1)} + b^{(\\ell)}, \\quad a^{(\\ell)} = f(z^{(\\ell)})$$</div>'

+ '<p class="l-text">Here <em>a<sup>(0)</sup> = x</em> (input), <em>a<sup>(L)</sup> = ŷ</em> (output). Define <em>δ<sup>(ℓ)</sup> = ∂Loss/∂z<sup>(ℓ)</sup></em> — the "error signal at layer ℓ".</p>'

+ '<div class="calc-example"><div class="example-label">TWO-STEP RECURSION</div><div class="example-body">'
+ '<p class="l-text"><strong>Output layer (for sigmoid + BCE or softmax + CE):</strong></p>'
+ '<div class="katex-block">$$\\delta^{(L)} = a^{(L)} - y$$</div>'
+ '<p class="l-text"><strong>Backward, for each layer:</strong></p>'
+ '<div class="katex-block">$$\\delta^{(\\ell)} = (W^{(\\ell+1)})^\\top \\delta^{(\\ell+1)} \\odot f\'(z^{(\\ell)})$$</div>'
+ '<p class="l-text"><strong>Weight and bias gradients:</strong></p>'
+ '<div class="katex-block">$$\\frac{\\partial L}{\\partial W^{(\\ell)}} = \\delta^{(\\ell)} (a^{(\\ell-1)})^\\top, \\quad \\frac{\\partial L}{\\partial b^{(\\ell)}} = \\delta^{(\\ell)}$$</div>'
+ '</div></div>'

+ '<p class="l-text"><strong>⊙</strong> = elementwise (Hadamard) product. <strong>f\'</strong> = activation derivative (1 or 0 for ReLU; a(1-a) for sigmoid; 1-tanh²(z) for tanh).</p>'

+ '<p class="l-text">In one sentence: <em>each layer\'s error signal is the back-multiplied version of the signal coming from the next layer</em>. Everything flows automatically from output to input.</p>'

+ '<h2 class="l-title">7. A Numerical Example — 2-Layer Network</h2>'

+ '<p class="l-text">Let us walk through a tiny example step by step. <em>x = [1, 2]</em>, <em>y = 1</em>, sigmoid, BCE.</p>'

+ '<div class="calc-example"><div class="example-label">FORWARD PASS</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'W₁ = [[0.5, -0.3], [0.2, 0.8]], &nbsp; b₁ = [0, 0]'
+ '<br>W₂ = [[0.7, -0.5]], &nbsp; b₂ = [0]'
+ '<br>'
+ '<br>z₁ = W₁·x + b₁ = [0.5·1 + (-0.3)·2, &nbsp; 0.2·1 + 0.8·2] = <strong>[-0.1, 1.8]</strong>'
+ '<br>a₁ = σ(z₁) = <strong>[0.475, 0.858]</strong>'
+ '<br>z₂ = W₂·a₁ + b₂ = 0.7·0.475 + (-0.5)·0.858 = <strong>-0.096</strong>'
+ '<br>a₂ = σ(-0.096) = <strong>0.476</strong> &nbsp;(prediction)'
+ '<br>L = -log(0.476) = <strong>0.742</strong>'
+ '</p>'
+ '</div></div>'

+ '<div class="calc-example"><div class="example-label">BACKWARD PASS</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'δ₂ = a₂ - y = 0.476 - 1 = <strong>-0.524</strong>'
+ '<br>'
+ '<br>∂L/∂W₂ = δ₂ · a₁ᵀ = -0.524 · [0.475, 0.858] = <strong>[-0.249, -0.450]</strong>'
+ '<br>∂L/∂b₂ = δ₂ = <strong>-0.524</strong>'
+ '<br>'
+ '<br>δ₁ = (W₂ᵀ · δ₂) ⊙ σ\'(z₁)'
+ '<br>&nbsp;&nbsp;&nbsp;= ([0.7, -0.5]ᵀ · (-0.524)) ⊙ [0.249, 0.122]'
+ '<br>&nbsp;&nbsp;&nbsp;= [-0.367, 0.262] ⊙ [0.249, 0.122] = <strong>[-0.0913, 0.0320]</strong>'
+ '<br>'
+ '<br>∂L/∂W₁ = δ₁ · xᵀ = [[-0.0913, -0.183], [0.032, 0.064]]'
+ '<br>∂L/∂b₁ = δ₁ = <strong>[-0.0913, 0.0320]</strong>'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Then update the weights with the step <em>W ← W - η·∂L/∂W</em>. One gradient descent step is complete.</p>'

+ '<h2 class="l-title">8. Automatic Differentiation (Autograd)</h2>'

+ '<p class="l-text">Modern deep learning libraries (<strong>PyTorch, TensorFlow, JAX</strong>) build this chain automatically. You write the forward pass, the library:</p>'

+ '<ul class="l-list">'
+ '<li>Builds the computational graph (records every operation on each tensor).</li>'
+ '<li>Knows the local derivative rule for every operation.</li>'
+ '<li>Runs the chain in reverse when <code>.backward()</code> is called.</li>'
+ '</ul>'

+ '<div class="calc-example"><div class="example-label">PYTORCH AUTOGRAD</div><div class="example-body"><div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch\n\n<span class="cm"># Scalar example: L = (a*b + c)^2</span>\na = torch.<span class="fn">tensor</span>(<span class="num">2.0</span>, requires_grad=<span class="kw">True</span>)\nb = torch.<span class="fn">tensor</span>(<span class="num">3.0</span>, requires_grad=<span class="kw">True</span>)\nc = torch.<span class="fn">tensor</span>(<span class="num">4.0</span>, requires_grad=<span class="kw">True</span>)\n\nL = (a * b + c) ** <span class="num">2</span>\nL.<span class="fn">backward</span>()  <span class="cm"># backpropagation</span>\n\n<span class="fn">print</span>(a.grad)  <span class="cm"># 60.0</span>\n<span class="fn">print</span>(b.grad)  <span class="cm"># 40.0</span>\n<span class="fn">print</span>(c.grad)  <span class="cm"># 20.0</span></code></pre></div></div></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Tensors with <code>requires_grad=True</code> will be "tracked". Every arithmetic operation is added to the computational graph. <code>L.backward()</code> walks the graph in reverse and fills the <code>.grad</code> field of every tensor. Same as what we computed manually: 60, 40, 20.</p>'

+ '<p class="l-text">In practice, you only write code like this for small examples to manually verify gradients. In real models you use <code>nn.Module</code> and an <code>optimizer</code>:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># MNIST training step</span>\noptimizer.<span class="fn">zero_grad</span>()      <span class="cm"># clear old gradients</span>\nlogits = <span class="fn">model</span>(x_batch)    <span class="cm"># forward — graph is built automatically</span>\nloss = <span class="fn">criterion</span>(logits, y_batch)\nloss.<span class="fn">backward</span>()            <span class="cm"># reverse the graph — every parameter\'s .grad is filled</span>\noptimizer.<span class="fn">step</span>()           <span class="cm"># W ← W - η·.grad</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> The entire engine of deep learning in 4 lines. <code>zero_grad()</code> clears the previous batch\'s gradients (otherwise they accumulate). <code>backward()</code> triggers backpropagation. <code>step()</code> updates the weights.</p>'

+ '<h2 class="l-title">9. Forward & Backward Flow — Visualization</h2>'

+ '<p class="l-text">Below we show the nodes of the computational graph in a 2-layer network. Forward goes left→right; backward goes right→left along the same edges in the reverse direction:</p>'

+ '<div class="calc-graph" style="height:420px"><div id="dl-l3-flow-en"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l3-flow-en"))return;var th=window.__dlChartTheme();var nodesX=[0.5, 2.5, 2.5, 4.5, 4.5, 6.5, 8.5];var nodesY=[2, 3, 1, 3, 1, 2, 2];var labels=["x","z₁ⁱ","z₁ⁱⁱ","a₁ⁱ","a₁ⁱⁱ","z₂","L"];var edges=[[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[5,6]];var traces=[];edges.forEach(function(e){traces.push({type:"scatter",mode:"lines",x:[nodesX[e[0]],nodesX[e[1]]],y:[nodesY[e[0]],nodesY[e[1]]],line:{color:th.accent,width:2.5},showlegend:false,hoverinfo:"skip"});});traces.push({type:"scatter",mode:"markers+text",x:nodesX,y:nodesY,text:labels,textposition:"middle center",textfont:{color:th.text,size:14,family:"monospace"},marker:{size:42,color:th.paper,line:{color:th.accent,width:2.5}},hoverinfo:"skip",showlegend:false});Plotly.newPlot("dl-l3-flow-en",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{visible:false,range:[-0.2,9.2]},yaxis:{visible:false,range:[0,4]},margin:{t:50,r:20,b:20,l:20},height:400,title:{text:"Forward: x → z₁ → a₁ → z₂ → L &nbsp;&nbsp;|&nbsp;&nbsp; Backward: same edges in reverse",font:{color:th.text,size:13}},showlegend:false},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<p class="l-text">Each arrow is a computational dependency. In the forward pass you go in the direction of the arrow and store results. In the backward pass you go through the same arrows in the <em>reverse direction</em> and carry gradients. The cached intermediate values (a₁, z₂...) are used on the way back — this is why <strong>memory</strong> grows as the network grows (the main reason VRAM is the bottleneck when training large models).</p>'

+ '<h2 class="l-title">10. Gradient Checking — Verification</h2>'

+ '<p class="l-text">If you write the backprop code yourself (often the case in experimental models), you should verify it with <strong>gradient checking</strong>. Compare against the numerical derivative:</p>'

+ '<div class="katex-block">$$\\frac{\\partial L}{\\partial w} \\approx \\frac{L(w + \\epsilon) - L(w - \\epsilon)}{2\\epsilon}, \\quad \\epsilon = 10^{-7}$$</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">def</span> <span class="fn">check_grad</span>(loss_fn, w, analytical_grad, eps=<span class="num">1e</span>-<span class="num">7</span>):\n    w_pos = w + eps\n    w_neg = w - eps\n    numerical = (<span class="fn">loss_fn</span>(w_pos) - <span class="fn">loss_fn</span>(w_neg)) / (<span class="num">2</span> * eps)\n    rel_error = <span class="fn">abs</span>(analytical_grad - numerical) / (<span class="fn">abs</span>(analytical_grad) + <span class="fn">abs</span>(numerical) + <span class="num">1e</span>-<span class="num">12</span>)\n    <span class="kw">return</span> rel_error  <span class="cm"># correct if below 1e-7</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Nudges a parameter forward and backward by ε and extracts the numerical derivative from the loss difference. Compares it against your analytical gradient. If the relative error is below 10⁻⁷, the implementation is correct.</p>'

+ '<p class="l-text">If you are using PyTorch/TensorFlow autograd, you do not need this — the library is already tested. Gradient checking is only essential when writing custom kernels/operators.</p>'

+ '<h2 class="l-title">11. Common Pitfalls</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Vanishing gradient</div><div class="card-body">In a deep network if <em>δ</em> shrinks at each layer (especially with sigmoid/tanh), the early layers do not learn at all. Solution: ReLU, batch normalization, residual connection — covered in detail in Lessons 5 and 6.</div></div>'
+ '<div class="calc-card"><div class="card-title">Exploding gradient</div><div class="card-body">If δ grows at each layer the gradient explodes — NaN values appear. Solution: gradient clipping, careful weight initialization (He, Xavier).</div></div>'
+ '<div class="calc-card"><div class="card-title">Gradient accumulation</div><div class="card-body">Forgetting <code>zero_grad()</code> — gradients sum from batch to batch and training becomes chaotic. In PyTorch it is mandatory to call it at the start of every step.</div></div>'
+ '<div class="calc-card"><div class="card-title">In-place ops + autograd</div><div class="card-body"><code>x += 1</code> mutates the tensor and autograd raises an error. Create a new tensor: <code>x = x + 1</code>.</div></div>'
+ '</div>'

+ '<div class="think-box"><strong>📌 In summary:</strong> Backpropagation = chain rule + clever caching. In the forward pass cache intermediate values; in the backward pass flow them from output to input. Modern libraries do this automatically — you write the forward pass, gradients come for free. <strong>Next lesson: Optimization.</strong> We have the gradients; now how do we use them in the smartest way? SGD, momentum, Adam, learning rate scheduling.</div>'

};
