/* dl-new-L8.js — Deep Learning Lesson 8: RNN & LSTM (Sıralı Modeller) (TR + EN) */
var DL_L8 = {

tr:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Sıralı veri (metin, zaman serisi, ses) için <strong>Recurrent Neural Network (RNN)</strong>. Vanilya RNN\'in matematiği, BPTT (Backpropagation Through Time), neden uzun sıralarda başarısız (vanishing gradient), ve çözümü: <strong>LSTM</strong> (Long Short-Term Memory) ve <strong>GRU</strong>. PyTorch ile metin sınıflandırma örneği. Transformer öncesi NLP\'nin omurgası.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Vanilya RNN\'in hidden state güncellemesini ve BPTT\'yi çıkaracaksın</li><li>Vanishing gradient\'in uzun sırada RNN\'i neden bitirdiğini göstereceksin</li><li>LSTM\'in forget, input ve output kapılarının cell state\'i nasıl koruduğunu açıklayacaksın</li><li>GRU\'yu LSTM\'le parametre ve kapı sayısı açısından karşılaştıracaksın</li><li>PyTorch nn.LSTM ile bidirectional bir metin sınıflandırıcı eğitip gradient clipping uygulayacaksın</li></ul></div>'

+ '<h2 class="l-title">1. Niye Yeni Bir Mimari?</h2>'

+ '<p class="l-text">Şimdiye kadarki tüm mimariler (FC, CNN) <em>sabit boyutlu</em> girdi alır. Ama metin, ses, zaman serisi değişken uzunlukta. "Bu film harikaydı" 4 kelime, "Bu yıl gördüğüm en kötü film" 6 kelime. Aynı modele nasıl verirsin?</p>'

+ '<p class="l-text">Daha derin sorun: <strong>sıra önemli</strong>. "Köpek adamı ısırdı" ≠ "adam köpeği ısırdı". CNN bir cümleyi alıp filtre uygulayabilir ama uzun-mesafeli bağımlılıkları (cümlenin başıyla sonu arasındaki ilişki) iyi modelleyemez.</p>'

+ '<p class="l-text"><strong>RNN fikri:</strong> Bir <em>gizli durum (hidden state)</em> tut. Her zaman adımında girdiyi al + gizli durumu güncelle. Gizli durum "şimdiye kadarki sıradan ne hatırlıyorum"u temsil eder.</p>'

+ '<h2 class="l-title">2. Vanilya RNN — Matematik</h2>'

+ '<div class="katex-block">$$h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)$$</div>'
+ '<div class="katex-block">$$y_t = W_{hy} h_t + b_y$$</div>'

+ '<p class="l-text"><em>x<sub>t</sub></em> = t. zamandaki girdi (örn. kelime embedding\'i). <em>h<sub>t</sub></em> = t. zamandaki gizli durum. <em>W<sub>hh</sub>, W<sub>xh</sub>, W<sub>hy</sub></em> = öğrenilebilir matrisler — <strong>her zaman adımında AYNI</strong> (parametre paylaşımı, CNN\'deki gibi).</p>'

+ '<div class="calc-example"><div class="example-label">UNROLLED RNN — 4 ZAMAN ADIMI</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:2">'
+ 'h₀ = 0 (başlangıç)'
+ '<br>h₁ = tanh(W_hh · h₀ + W_xh · x₁ + b_h)'
+ '<br>h₂ = tanh(W_hh · h₁ + W_xh · x₂ + b_h)'
+ '<br>h₃ = tanh(W_hh · h₂ + W_xh · x₃ + b_h)'
+ '<br>h₄ = tanh(W_hh · h₃ + W_xh · x₄ + b_h)'
+ '<br>'
+ '<br>y₄ = W_hy · h₄ + b_y &nbsp;&nbsp;(son tahmin)'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Aynı W matrisleri 4 kez kullanıldı — RNN bir "döngü" değil, aynı katmanın <em>zaman ekseninde tekrarı</em>. Backprop bu tekrarı açıp normal zincir kuralını uygular: <strong>BPTT — Backpropagation Through Time</strong>.</p>'

+ '<h2 class="l-title">3. RNN Görevleri</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Many-to-one</div><div class="card-body">Sıra al, tek tahmin yap. Örnek: cümle sentiment analysis. Sadece son h\'yi kullan.</div></div>'
+ '<div class="calc-card"><div class="card-title">Many-to-many (aligned)</div><div class="card-body">Her zaman adımında bir çıktı. Örnek: POS tagging, NER. Her h\'den bir y çıkar.</div></div>'
+ '<div class="calc-card"><div class="card-title">Many-to-many (seq2seq)</div><div class="card-body">Sıra → farklı uzunlukta sıra. Örnek: çeviri. Encoder + decoder yapısı.</div></div>'
+ '<div class="calc-card"><div class="card-title">One-to-many</div><div class="card-body">Tek girdi → sıra. Örnek: image captioning (görüntü → cümle).</div></div>'
+ '</div>'

+ '<h2 class="l-title">4. Vanishing Gradient — RNN\'in Aşil Topuğu</h2>'

+ '<p class="l-text">BPTT\'yi düşün: gradyan zaman geriye doğru aktarılırken her adımda <em>W<sub>hh</sub></em>\'nin transposu ile çarpılır. T zaman adımı için:</p>'

+ '<div class="katex-block">$$\\frac{\\partial L}{\\partial h_0} \\propto \\prod_{t=1}^{T} W_{hh}^\\top \\cdot \\text{diag}(\\tanh\'(z_t))$$</div>'

+ '<p class="l-text">tanh\' türevi en fazla 1, çoğu yerde 0\'a yakın. <em>W<sub>hh</sub></em>\'nin spektral yarıçapı (en büyük özdeğeri) 1\'den küçükse → çarpan üstel olarak küçülür → gradyan kaybolur. Büyükse → patlar.</p>'

+ '<p class="l-text">Pratikte 10-15 zaman adımının ötesinde gradyan o kadar küçülür ki, RNN \'erken kelimeleri\' öğrenemez. "Cümlenin başında kim olduğu" sona ulaşmaz.</p>'

+ '<p class="l-text"><strong>Çözüm:</strong> Mimaride yapısal değişiklik — bilgiyi uzun mesafede taşıyacak bir "otoyol". Bu fikir LSTM ve GRU\'nun temelidir.</p>'

+ '<h2 class="l-title">5. LSTM — Uzun Hafıza</h2>'

+ '<p class="l-text"><strong>Hochreiter &amp; Schmidhuber 1997.</strong> Vanilya RNN\'in tek h<sub>t</sub>\'sine ek olarak bir <strong>cell state</strong> <em>c<sub>t</sub></em> tutar. Üç adet "gate" (kapı) onu yönetir:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Forget gate (f)</div><div class="card-body">Eski cell state\'in ne kadarını unutalım? Sigmoid çıkışı (0-1).</div></div>'
+ '<div class="calc-card"><div class="card-title">Input gate (i)</div><div class="card-body">Yeni bilgiyi cell state\'e ne kadar ekleyelim? Sigmoid + tanh.</div></div>'
+ '<div class="calc-card"><div class="card-title">Output gate (o)</div><div class="card-body">Cell state\'in ne kadarını gizli duruma yansıtalım? Sigmoid çıkışı.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Denklemler:</strong></p>'

+ '<div class="katex-block">$$f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f)$$</div>'
+ '<div class="katex-block">$$i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i), \\quad \\tilde{c}_t = \\tanh(W_c [h_{t-1}, x_t] + b_c)$$</div>'
+ '<div class="katex-block">$$c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t$$</div>'
+ '<div class="katex-block">$$o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o), \\quad h_t = o_t \\odot \\tanh(c_t)$$</div>'

+ '<p class="l-text"><strong>Kritik satır:</strong> <em>c<sub>t</sub> = f<sub>t</sub> ⊙ c<sub>t-1</sub> + i<sub>t</sub> ⊙ c̃<sub>t</sub></em> (sağdaki <em>c̃<sub>t</sub></em> aday/candidate cell state — yukarıdaki <code>\\tilde{c}_t</code>). Burada f<sub>t</sub> ≈ 1 ise eski cell state neredeyse hiç değişmeden bir sonrakine taşınır. Yani <strong>gradyan c üzerinden uzun mesafede çarpılmadan akar</strong> — vanishing gradient çözüldü.</p>'

+ '<h2 class="l-title">6. GRU — Daha Az Parametreyle</h2>'

+ '<p class="l-text"><strong>Cho et al. 2014.</strong> LSTM\'in basitleştirilmiş hâli: cell state ve hidden state birleştirilir, 3 gate yerine 2 gate.</p>'

+ '<div class="katex-block">$$r_t = \\sigma(W_r [h_{t-1}, x_t]) \\quad (\\text{reset gate})$$</div>'
+ '<div class="katex-block">$$z_t = \\sigma(W_z [h_{t-1}, x_t]) \\quad (\\text{update gate})$$</div>'
+ '<div class="katex-block">$$\\tilde{h}_t = \\tanh(W [r_t \\odot h_{t-1}, x_t])$$</div>'
+ '<div class="katex-block">$$h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t$$</div>'

+ '<p class="l-text">~25% daha az parametre, çoğu görevde LSTM\'le neredeyse aynı performans. Pratik tavsiye: önce GRU dene; LSTM gerçekten daha iyiyse geç.</p>'

+ '<h2 class="l-title">7. PyTorch ile RNN/LSTM</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="kw">class</span> <span class="fn">TextClassifier</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, vocab_size, embed_dim=<span class="num">128</span>, hidden=<span class="num">256</span>, num_classes=<span class="num">2</span>):\n        <span class="fn">super</span>().<span class="fn">__init__</span>()\n        <span class="kw">self</span>.embedding = nn.<span class="fn">Embedding</span>(vocab_size, embed_dim, padding_idx=<span class="num">0</span>)\n        <span class="kw">self</span>.lstm = nn.<span class="fn">LSTM</span>(\n            input_size=embed_dim,\n            hidden_size=hidden,\n            num_layers=<span class="num">2</span>,\n            batch_first=<span class="kw">True</span>,\n            bidirectional=<span class="kw">True</span>,\n            dropout=<span class="num">0.3</span>,\n        )\n        <span class="kw">self</span>.fc = nn.<span class="fn">Linear</span>(hidden * <span class="num">2</span>, num_classes)\n\n    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x):\n        <span class="cm"># x: (batch, seq_len)</span>\n        emb = <span class="kw">self</span>.<span class="fn">embedding</span>(x)              <span class="cm"># (batch, seq_len, embed_dim)</span>\n        out, (h_n, c_n) = <span class="kw">self</span>.<span class="fn">lstm</span>(emb)     <span class="cm"># out: (batch, seq_len, hidden*2)</span>\n        <span class="cm"># son zaman adımının çift yönlü hidden state\'i</span>\n        last = out[:, -<span class="num">1</span>, :]                 <span class="cm"># (batch, hidden*2)</span>\n        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">fc</span>(last)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Kelime ID\'leri → embedding → 2 katmanlı bidirectional LSTM → son zaman adımının gizli durumundan sınıflandırma. <code>bidirectional=True</code>: hem soldan sağa hem sağdan sola işle, ikisini concatenate et — sentiment için cümlenin sonu kadar başının da önemli olduğu durumlarda kritik.</p>'

+ '<p class="l-text"><strong>padding_idx=0:</strong> Değişken uzunlukta cümleler aynı uzunluğa pad edilir; index 0\'lık embedding\'i sıfır vektör olarak tut, gradient akıtma. Pratik standart.</p>'

+ '<h2 class="l-title">8. Bidirectional RNN</h2>'

+ '<p class="l-text">Tek yönlü RNN sadece geçmişi görür. Ama "Bu film bir başyapıt değildi" cümlesinde "değildi" tüm cümlenin anlamını tersine çevirir — başına dönmek lazım.</p>'

+ '<p class="l-text"><strong>Bidirectional RNN:</strong> Aynı sırayı iki yönde işle: bir RNN soldan sağa (h<sup>→</sup>), diğeri sağdan sola (h<sup>←</sup>). Her zaman adımında ikisini concatenate et: h<sub>t</sub> = [h<sup>→</sup><sub>t</sub>; h<sup>←</sup><sub>t</sub>].</p>'

+ '<p class="l-text">NER, sentiment, sequence labeling görevlerinde standart. Sadece <em>causal</em> görevlerde (örn. dil modelleme — sonraki kelimeyi tahmin) tek yönlü kullanılır.</p>'

+ '<h2 class="l-title">9. Gradient Clipping & Practical Tricks</h2>'

+ '<p class="l-text">RNN\'lerde exploding gradient sıkça olur. Standart koruma:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code>loss.<span class="fn">backward</span>()\ntorch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), max_norm=<span class="num">5.0</span>)\noptimizer.<span class="fn">step</span>()</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Tüm gradyanların L2 normu 5\'ten büyükse, normu 5 olacak şekilde ölçekler. Yön korunur, büyüklük sınırlanır. RNN/LSTM eğitiminde olmazsa olmaz.</p>'

+ '<p class="l-text"><strong>Diğer pratik notlar:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>pack_padded_sequence:</strong> Değişken uzunlukta batch\'lerde padded zaman adımlarını atla, hem hız hem doğruluk kazanırsın.</li>'
+ '<li><strong>Truncated BPTT:</strong> Çok uzun sıralarda gradient zincirini örn. 50 adımla sınırla.</li>'
+ '<li><strong>Layer normalization:</strong> RNN\'lerde BatchNorm yerine LN kullan (Ders 5).</li>'
+ '<li><strong>Initialization:</strong> LSTM\'in forget gate bias\'ını 1 ile başlat — başta "her şeyi hatırla" eğilimi ver.</li>'
+ '</ul>'

+ '<h2 class="l-title">10. Karşılaştırma — Sıralı Modeller</h2>'

+ '<div class="calc-graph" style="height:380px"><div id="dl-l8-cmp"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l8-cmp"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var seq=[5,10,20,50,100,200];var rnn=[88,82,68,42,25,12];var lstm=[90,88,86,82,78,72];var gru=[89,88,85,81,77,71];var trf=[91,91,90,90,89,89];var traces=[{x:seq,y:rnn,mode:"lines+markers",name:"Vanilya RNN",line:{color:hex2rgba(th.accent,0.4),width:2}},{x:seq,y:lstm,mode:"lines+markers",name:"LSTM",line:{color:hex2rgba(th.accent,0.7),width:2}},{x:seq,y:gru,mode:"lines+markers",name:"GRU",line:{color:hex2rgba(th.accent,0.55),width:2,dash:"dot"}},{x:seq,y:trf,mode:"lines+markers",name:"Transformer (referans)",line:{color:th.accent,width:3}}];Plotly.newPlot("dl-l8-cmp",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{title:{text:"Sıra uzunluğu",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text,type:"log"},yaxis:{title:{text:"Accuracy (%)",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text,range:[0,100]},margin:{t:50,r:30,b:60,l:60},height:360,legend:{font:{color:th.text}},title:{text:"Uzun sıralarda performans (temsili)",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<p class="l-text">Vanilya RNN uzun sıralarda hızla düşer. LSTM/GRU 100+ adımı taşıyabilir. Transformer (Ders 9) uzunluktan neredeyse bağımsız — bu yüzden modern NLP\'de standart oldu.</p>'

+ '<h2 class="l-title">11. RNN\'lerin Bugünü</h2>'

+ '<p class="l-text">2017\'de Transformer çıktıktan sonra LSTM/GRU NLP\'de büyük ölçüde tahtından indi. Ama hâlâ değerli oldukları yerler:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Düşük kaynak:</strong> Edge cihazlar, gömülü sistemler — Transformer çok ağır gelir, küçük LSTM yeter.</li>'
+ '<li><strong>Streaming/online inference:</strong> Token tek tek geliyor; RNN\'in <em>O(1)</em> per-step maliyeti vardır, Transformer\'ın <em>O(n)</em>.</li>'
+ '<li><strong>Uzun zaman serileri:</strong> Finansal, sensör verisi — bazen LSTM hâlâ rekabetçi.</li>'
+ '<li><strong>Yeni varyantlar:</strong> Mamba/SSM gibi state-space modeller LSTM\'in fikrini canlandırıyor — Transformer\'a alternatif.</li>'
+ '</ul>'

+ '<div class="think-box"><strong>📌 Özetle:</strong> RNN = sıralı veriyi işlemek için döngü ile çalışan ağ. Vanilya RNN vanishing gradient nedeniyle uzun sıralarda yetersiz. LSTM/GRU gate\'lerle bilgiyi uzun mesafede taşır. Bidirectional + dropout + gradient clipping standart hijyen. <strong>Bir sonraki ders: Attention & Transformers.</strong> RNN\'in en büyük problemini (paralelleştirilemez, uzun bağımlılık zor) bambaşka bir yapıyla çözen mimari.</div>'

,

en:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn in this lesson:</strong> The <strong>Recurrent Neural Network (RNN)</strong> for sequential data (text, time series, audio). The math of the vanilla RNN, BPTT (Backpropagation Through Time), why it fails on long sequences (vanishing gradient), and the fix: <strong>LSTM</strong> (Long Short-Term Memory) and <strong>GRU</strong>. A text classification example with PyTorch. The backbone of pre-Transformer NLP.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 IN THIS LESSON YOU WILL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Derive the hidden state update of the vanilla RNN and BPTT</li><li>Show why vanishing gradients kill the RNN on long sequences</li><li>Explain how the forget, input and output gates of an LSTM preserve the cell state</li><li>Compare GRU and LSTM in terms of parameter count and number of gates</li><li>Train a bidirectional text classifier with PyTorch nn.LSTM and apply gradient clipping</li></ul></div>'

+ '<h2 class="l-title">1. Why a New Architecture?</h2>'

+ '<p class="l-text">All the architectures so far (FC, CNN) take <em>fixed-size</em> input. But text, audio and time series have variable length. "This movie was great" is 4 words; "the worst movie I have seen this year" is 9 words. How do you feed the same model?</p>'

+ '<p class="l-text">A deeper issue: <strong>order matters</strong>. "Dog bit man" ≠ "Man bit dog". A CNN can take a sentence and apply filters but cannot model long-range dependencies (the relationship between the beginning and end of the sentence) well.</p>'

+ '<p class="l-text"><strong>The RNN idea:</strong> Maintain a <em>hidden state</em>. At each time step take the input + update the hidden state. The hidden state represents "what do I remember from the sequence so far".</p>'

+ '<h2 class="l-title">2. The Vanilla RNN — Math</h2>'

+ '<div class="katex-block">$$h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)$$</div>'
+ '<div class="katex-block">$$y_t = W_{hy} h_t + b_y$$</div>'

+ '<p class="l-text"><em>x<sub>t</sub></em> = input at time t (e.g. word embedding). <em>h<sub>t</sub></em> = hidden state at time t. <em>W<sub>hh</sub>, W<sub>xh</sub>, W<sub>hy</sub></em> = learnable matrices — <strong>the SAME at every time step</strong> (parameter sharing, as in CNNs).</p>'

+ '<div class="calc-example"><div class="example-label">UNROLLED RNN — 4 TIME STEPS</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:2">'
+ 'h₀ = 0 (initial)'
+ '<br>h₁ = tanh(W_hh · h₀ + W_xh · x₁ + b_h)'
+ '<br>h₂ = tanh(W_hh · h₁ + W_xh · x₂ + b_h)'
+ '<br>h₃ = tanh(W_hh · h₂ + W_xh · x₃ + b_h)'
+ '<br>h₄ = tanh(W_hh · h₃ + W_xh · x₄ + b_h)'
+ '<br>'
+ '<br>y₄ = W_hy · h₄ + b_y &nbsp;&nbsp;(final prediction)'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">The same W matrices are used 4 times — the RNN is not a "loop" but the <em>same layer repeated along the time axis</em>. Backprop unrolls this repetition and applies the regular chain rule: <strong>BPTT — Backpropagation Through Time</strong>.</p>'

+ '<h2 class="l-title">3. RNN Tasks</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Many-to-one</div><div class="card-body">Take a sequence, make a single prediction. Example: sentence sentiment analysis. Use only the last h.</div></div>'
+ '<div class="calc-card"><div class="card-title">Many-to-many (aligned)</div><div class="card-body">One output per time step. Example: POS tagging, NER. Emit a y from each h.</div></div>'
+ '<div class="calc-card"><div class="card-title">Many-to-many (seq2seq)</div><div class="card-body">Sequence → sequence of a different length. Example: translation. Encoder + decoder structure.</div></div>'
+ '<div class="calc-card"><div class="card-title">One-to-many</div><div class="card-body">Single input → sequence. Example: image captioning (image → sentence).</div></div>'
+ '</div>'

+ '<h2 class="l-title">4. Vanishing Gradient — The Achilles Heel of RNN</h2>'

+ '<p class="l-text">Think about BPTT: while the gradient is passed back in time, at each step it is multiplied by the transpose of <em>W<sub>hh</sub></em>. For T time steps:</p>'

+ '<div class="katex-block">$$\\frac{\\partial L}{\\partial h_0} \\propto \\prod_{t=1}^{T} W_{hh}^\\top \\cdot \\text{diag}(\\tanh\'(z_t))$$</div>'

+ '<p class="l-text">tanh\' has a maximum of 1 and is close to 0 in most places. If the spectral radius (largest eigenvalue) of <em>W<sub>hh</sub></em> is less than 1 → the factor shrinks exponentially → the gradient vanishes. If greater → it explodes.</p>'

+ '<p class="l-text">In practice, beyond 10-15 time steps the gradient shrinks so much that the RNN cannot learn "early words". The information about "who was at the start of the sentence" does not reach the end.</p>'

+ '<p class="l-text"><strong>The solution:</strong> A structural change in the architecture — a "highway" that carries information over long distances. This idea is the foundation of LSTM and GRU.</p>'

+ '<h2 class="l-title">5. LSTM — Long-Term Memory</h2>'

+ '<p class="l-text"><strong>Hochreiter &amp; Schmidhuber 1997.</strong> In addition to the vanilla RNN\'s single h<sub>t</sub>, it maintains a <strong>cell state</strong> <em>c<sub>t</sub></em>. Three "gates" manage it:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Forget gate (f)</div><div class="card-body">How much of the old cell state should we forget? Sigmoid output (0-1).</div></div>'
+ '<div class="calc-card"><div class="card-title">Input gate (i)</div><div class="card-body">How much new information should we add to the cell state? Sigmoid + tanh.</div></div>'
+ '<div class="calc-card"><div class="card-title">Output gate (o)</div><div class="card-body">How much of the cell state should we project to the hidden state? Sigmoid output.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Equations:</strong></p>'

+ '<div class="katex-block">$$f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f)$$</div>'
+ '<div class="katex-block">$$i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i), \\quad \\tilde{c}_t = \\tanh(W_c [h_{t-1}, x_t] + b_c)$$</div>'
+ '<div class="katex-block">$$c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t$$</div>'
+ '<div class="katex-block">$$o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o), \\quad h_t = o_t \\odot \\tanh(c_t)$$</div>'

+ '<p class="l-text"><strong>The critical line:</strong> <em>c<sub>t</sub> = f<sub>t</sub> ⊙ c<sub>t-1</sub> + i<sub>t</sub> ⊙ c̃<sub>t</sub></em> (the right-hand <em>c̃<sub>t</sub></em> is the candidate cell state — the <code>\\tilde{c}_t</code> from the equations above). Here if f<sub>t</sub> ≈ 1, the old cell state is carried over almost unchanged. That is, <strong>the gradient flows through c over long distances without being multiplied</strong> — vanishing gradient is solved.</p>'

+ '<h2 class="l-title">6. GRU — Fewer Parameters</h2>'

+ '<p class="l-text"><strong>Cho et al. 2014.</strong> A simplified version of LSTM: cell state and hidden state are merged, and there are 2 gates instead of 3.</p>'

+ '<div class="katex-block">$$r_t = \\sigma(W_r [h_{t-1}, x_t]) \\quad (\\text{reset gate})$$</div>'
+ '<div class="katex-block">$$z_t = \\sigma(W_z [h_{t-1}, x_t]) \\quad (\\text{update gate})$$</div>'
+ '<div class="katex-block">$$\\tilde{h}_t = \\tanh(W [r_t \\odot h_{t-1}, x_t])$$</div>'
+ '<div class="katex-block">$$h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t$$</div>'

+ '<p class="l-text">~25% fewer parameters, nearly identical performance to LSTM on most tasks. Practical advice: try GRU first; switch to LSTM only if it really is better.</p>'

+ '<h2 class="l-title">7. RNN/LSTM with PyTorch</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="kw">class</span> <span class="fn">TextClassifier</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, vocab_size, embed_dim=<span class="num">128</span>, hidden=<span class="num">256</span>, num_classes=<span class="num">2</span>):\n        <span class="fn">super</span>().<span class="fn">__init__</span>()\n        <span class="kw">self</span>.embedding = nn.<span class="fn">Embedding</span>(vocab_size, embed_dim, padding_idx=<span class="num">0</span>)\n        <span class="kw">self</span>.lstm = nn.<span class="fn">LSTM</span>(\n            input_size=embed_dim,\n            hidden_size=hidden,\n            num_layers=<span class="num">2</span>,\n            batch_first=<span class="kw">True</span>,\n            bidirectional=<span class="kw">True</span>,\n            dropout=<span class="num">0.3</span>,\n        )\n        <span class="kw">self</span>.fc = nn.<span class="fn">Linear</span>(hidden * <span class="num">2</span>, num_classes)\n\n    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x):\n        <span class="cm"># x: (batch, seq_len)</span>\n        emb = <span class="kw">self</span>.<span class="fn">embedding</span>(x)              <span class="cm"># (batch, seq_len, embed_dim)</span>\n        out, (h_n, c_n) = <span class="kw">self</span>.<span class="fn">lstm</span>(emb)     <span class="cm"># out: (batch, seq_len, hidden*2)</span>\n        <span class="cm"># bidirectional hidden state of the last time step</span>\n        last = out[:, -<span class="num">1</span>, :]                 <span class="cm"># (batch, hidden*2)</span>\n        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">fc</span>(last)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Word IDs → embedding → 2-layer bidirectional LSTM → classification from the last time step\'s hidden state. <code>bidirectional=True</code>: process from left to right and right to left, then concatenate — critical in cases like sentiment where the end of the sentence matters as much as the beginning.</p>'

+ '<p class="l-text"><strong>padding_idx=0:</strong> Variable-length sentences are padded to the same length; keep the index-0 embedding as a zero vector and stop gradient flow there. A practical standard.</p>'

+ '<h2 class="l-title">8. Bidirectional RNN</h2>'

+ '<p class="l-text">A unidirectional RNN only sees the past. But in "This movie was not a masterpiece", "not" reverses the meaning of the entire sentence — you need to go back to the beginning.</p>'

+ '<p class="l-text"><strong>Bidirectional RNN:</strong> Process the same sequence in two directions: one RNN left to right (h<sup>→</sup>), another right to left (h<sup>←</sup>). At each time step concatenate the two: h<sub>t</sub> = [h<sup>→</sup><sub>t</sub>; h<sup>←</sup><sub>t</sub>].</p>'

+ '<p class="l-text">A standard for NER, sentiment, sequence labeling tasks. Only used unidirectionally in <em>causal</em> tasks (e.g. language modeling — predicting the next word).</p>'

+ '<h2 class="l-title">9. Gradient Clipping & Practical Tricks</h2>'

+ '<p class="l-text">Exploding gradients happen often in RNNs. The standard guard:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code>loss.<span class="fn">backward</span>()\ntorch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), max_norm=<span class="num">5.0</span>)\noptimizer.<span class="fn">step</span>()</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> If the L2 norm of all gradients is greater than 5, scale so the norm becomes 5. Direction is preserved, magnitude is bounded. A must-have in RNN/LSTM training.</p>'

+ '<p class="l-text"><strong>Other practical notes:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>pack_padded_sequence:</strong> Skip padded time steps in variable-length batches — gain both speed and accuracy.</li>'
+ '<li><strong>Truncated BPTT:</strong> On very long sequences cap the gradient chain at e.g. 50 steps.</li>'
+ '<li><strong>Layer normalization:</strong> Use LN instead of BatchNorm in RNNs (Lesson 5).</li>'
+ '<li><strong>Initialization:</strong> Initialize the LSTM forget gate bias to 1 — a "remember everything" tendency at the start.</li>'
+ '</ul>'

+ '<h2 class="l-title">10. Comparison — Sequential Models</h2>'

+ '<div class="calc-graph" style="height:380px"><div id="dl-l8-cmp-en"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l8-cmp-en"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var seq=[5,10,20,50,100,200];var rnn=[88,82,68,42,25,12];var lstm=[90,88,86,82,78,72];var gru=[89,88,85,81,77,71];var trf=[91,91,90,90,89,89];var traces=[{x:seq,y:rnn,mode:"lines+markers",name:"Vanilla RNN",line:{color:hex2rgba(th.accent,0.4),width:2}},{x:seq,y:lstm,mode:"lines+markers",name:"LSTM",line:{color:hex2rgba(th.accent,0.7),width:2}},{x:seq,y:gru,mode:"lines+markers",name:"GRU",line:{color:hex2rgba(th.accent,0.55),width:2,dash:"dot"}},{x:seq,y:trf,mode:"lines+markers",name:"Transformer (reference)",line:{color:th.accent,width:3}}];Plotly.newPlot("dl-l8-cmp-en",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{title:{text:"Sequence length",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text,type:"log"},yaxis:{title:{text:"Accuracy (%)",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text,range:[0,100]},margin:{t:50,r:30,b:60,l:60},height:360,legend:{font:{color:th.text}},title:{text:"Performance on long sequences (illustrative)",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<p class="l-text">Vanilla RNNs drop sharply on long sequences. LSTM/GRU can carry 100+ steps. The Transformer (Lesson 9) is almost independent of length — that is why it became the standard in modern NLP.</p>'

+ '<h2 class="l-title">11. RNNs Today</h2>'

+ '<p class="l-text">After the Transformer appeared in 2017, LSTM/GRU were largely dethroned in NLP. But they are still valuable in some places:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Low resource:</strong> Edge devices, embedded systems — Transformer is too heavy, a small LSTM is enough.</li>'
+ '<li><strong>Streaming/online inference:</strong> Tokens arrive one by one; an RNN has <em>O(1)</em> per-step cost, while a Transformer has <em>O(n)</em>.</li>'
+ '<li><strong>Long time series:</strong> Financial, sensor data — sometimes LSTM is still competitive.</li>'
+ '<li><strong>New variants:</strong> State-space models like Mamba/SSM are reviving the LSTM idea — an alternative to the Transformer.</li>'
+ '</ul>'

+ '<div class="think-box"><strong>📌 In summary:</strong> RNN = a network with a loop to process sequential data. The vanilla RNN is insufficient on long sequences due to vanishing gradients. LSTM/GRU carry information over long distances via gates. Bidirectional + dropout + gradient clipping are standard hygiene. <strong>Next lesson: Attention & Transformers.</strong> The architecture that solves the biggest problems of RNNs (non-parallelizable, long-range dependencies are hard) with a completely different design.</div>'

};
