/* nlp-new-L9.js — NLP Course Lesson 9: Seq2Seq + Attention — Makine Çevirisi & Üretim (TR + EN) */
var NLP_L9 = {

tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=[];g.__nlpChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Şimdiye kadar her görev tek-yönlü idi: girdi → tek etiket veya tek-cümle çıktı. Bu derste <strong>diziden diziye (sequence-to-sequence)</strong> görevleri öğreniyoruz: girdi bir cümle, çıktı da bir cümle. Makine çevirisi, özetleme, soru-cevap. Encoder-decoder mimarisini, neden saf RNN\'in uzun cümlelerde tıkandığını ve bunu çözen <strong>attention (dikkat)</strong> mekanizmasını adım adım göreceksin. Attention, Transformer\'ın temel taşıdır — bu ders <a href="/tutorials/nlp/10">Ders 10</a>\'a doğrudan köprü kurar.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Çeviri, özetleme ve soru-cevap görevlerini diziden diziye olarak formüle etmeyi</li>'
+ '<li>RNN tabanlı encoder-decoder mimarisini PyTorch\'ta kurmayı</li>'
+ '<li>Saf RNN\'in uzun cümlelerde neden bottleneck yaşadığını teşhis etmeyi</li>'
+ '<li>Bahdanau ve Luong attention mekanizmalarını formüle döküp uygulamayı</li>'
+ '<li>Çeviri çıktısını BLEU skoru ile değerlendirmeyi ve attention\'ı görselleştirmeyi</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Diziden Diziye Görevler</h2>'

+ '<p class="l-text"><strong>Seq2seq</strong> görevlerinde girdi de çıktı da kelime dizisidir, ama farklı uzunlukta olabilirler ve farklı sözcük dağarcıklarından gelebilirler. Tipik örnekler:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Makine çevirisi:</strong> "Bu film harikaydı" → "This movie was amazing"</li>'
+ '<li><strong>Özetleme:</strong> 500 kelimelik haber → 3 cümle özet</li>'
+ '<li><strong>Soru-cevap:</strong> "Türkiye\'nin başkenti nedir?" → "Ankara"</li>'
+ '<li><strong>Konuşma → metin → konuşma:</strong> Sesli asistanların kalbi</li>'
+ '<li><strong>Kod üretimi:</strong> "Bir liste sırala" → <code>list.sort()</code></li>'
+ '</ul>'

+ '<h2 class="l-title">2. Encoder-Decoder Mimarisi — Sezgi</h2>'

+ '<p class="l-text">Sutskever ve ekibinin 2014\'teki çığır açıcı fikri: girdi cümlesini sabit-boyutlu bir vektöre <em>sıkıştır</em>, sonra bu vektörden çıktı cümlesini <em>üret</em>.</p>'

+ '<div class="calc-example"><div class="example-label">İKİ AŞAMALI YAPI</div><div class="example-body">'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ '<strong>Encoder</strong> aşaması:'
+ '<br>"Bu" → "film" → "harikaydı" &nbsp; ⟶ &nbsp; bağlam vektörü <em>c</em>'
+ '<br><br><strong>Decoder</strong> aşaması:'
+ '<br><em>c</em> &nbsp; ⟶ &nbsp; "This" → "movie" → "was" → "amazing"'
+ '</p>'
+ '<p class="l-text">Encoder ve decoder ayrı RNN\'ler. Encoder cümleyi okur, son gizli durumu <em>c</em>\'ye atar. Decoder bu <em>c</em>\'yi alıp adım adım çıktı kelimelerini üretir.</p>'
+ '</div></div>'

+ '<p class="l-text">Decoder her adımda iki bilgiyi kullanır: encoder\'dan gelen <em>c</em> bağlam vektörü, ve şimdiye kadar ürettiği kendi çıktı kelimeleri. Üretim bir <code>&lt;END&gt;</code> token\'ı çıkana kadar devam eder.</p>'

+ '<h2 class="l-title">3. RNN ile Encoder/Decoder</h2>'

+ '<p class="l-text">Encoder ve decoder genelde <strong>LSTM</strong> ya da <strong>GRU</strong> hücreleri kullanır (RNN\'in iyileştirilmiş versiyonları). RNN\'in temel hesaplaması:</p>'

+ '<div class="katex-block">$$h_t = \\tanh(W_h h_{t-1} + W_x x_t + b)$$</div>'

+ '<p class="l-text">Her zaman adımında, önceki gizli durum <em>h<sub>t-1</sub></em> ve şimdiki kelime girdisi <em>x<sub>t</sub></em> kullanılarak yeni gizli durum hesaplanır. Encoder\'da bu süreç boyunca son <em>h<sub>T</sub></em> bağlam vektörü <em>c</em> olarak alınır.</p>'

+ '<p class="l-text">Decoder ise her adımda:</p>'

+ '<div class="katex-block">$$P(y_t \\mid y_{<t}, c) = \\text{softmax}(W \\cdot s_t + b)$$</div>'

+ '<p class="l-text">Burada <em>s<sub>t</sub></em> decoder\'ın o anki gizli durumu, <em>y<sub>&lt;t</sub></em> şimdiye kadar ürettiği kelimeler. Çıktı dağarcığı üzerinde olasılık dağılımı verir.</p>'

+ '<h2 class="l-title">4. Vanilla Seq2Seq\'in Sorunu — Bilgi Darboğazı</h2>'

+ '<p class="l-text">Saf encoder-decoder bir şeyi unutur: <strong>uzun cümleyi tek bir vektöre sıkıştırmak</strong> bilgi kaybıdır. 5 kelimelik bir cümleyi 512 boyutlu bir vektöre sığdırmak makul; 50 kelimelik bir paragrafı aynı vektöre sığdırmak felakettir.</p>'

+ '<div class="plotly-graph"><div id="plot-bottleneck-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=[5,10,15,20,30,40,50,60];'
+ 'var bleu_vanilla=[28,27,25,22,18,14,11,9];'
+ 'var bleu_attention=[28,28,28,27,26,25,24,23];'
+ 'var t1={x:k,y:bleu_vanilla,name:"Saf Seq2Seq",type:"scatter",mode:"lines+markers",line:{color:"rgba(248,113,113,.85)"}};'
+ 'var t2={x:k,y:bleu_attention,name:"Attention\'lı Seq2Seq",type:"scatter",mode:"lines+markers",line:{color:T.accent}};'
+ 'var layout={title:{text:"Cümle uzunluğunun BLEU skoruna etkisi",font:{color:T.text,size:13}},xaxis:{title:"Cümle uzunluğu (kelime)",color:T.text,gridcolor:T.grid},yaxis:{title:"BLEU",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-bottleneck-tr"))Plotly.newPlot("plot-bottleneck-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Saf seq2seq cümle uzadıkça hızla bozulur — 50+ kelimelik girdiler için BLEU skoru yarılanır. Attention\'lı seq2seq aynı cümle uzunluklarında neredeyse sabit kalır. Sebep: attention, decoder\'ın her adımda <em>tüm</em> encoder durumlarına bakmasını sağlar; tek vektörlü darboğaz kalkar.</div>'

+ '<h2 class="l-title">5. Attention — Bilgiye Erişim Yolu</h2>'

+ '<p class="l-text">Bahdanau ve ekibinin 2014\'teki fikri devrimseldi: <strong>decoder her adımda encoder\'ın tüm durumlarına bakabilir</strong>, her birine "ne kadar bakacağını" da kendisi öğrenir.</p>'

+ '<p class="l-text">Sezgi şudur: çeviri yaparken bir insan da kaynak cümlenin tüm kelimelerine değil, hedef kelimeye karşılık gelen birkaç kaynak kelimesine odaklanır. "<em>Bu film harikaydı</em>" → "<em>This movie was amazing</em>" çevirirken "amazing"i üretirken kaynak cümledeki "harikaydı"ya ağırlık verilir, "Bu"ya az.</p>'

+ '<div class="calc-example"><div class="example-label">DİKKAT HİZALAMASI — SEZGI</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'Decoder "<strong>This</strong>" üretirken &nbsp;⟶&nbsp; en çok "<strong>Bu</strong>"ya bakar (ağırlık 0.85)'
+ '<br>Decoder "<strong>movie</strong>" üretirken &nbsp;⟶&nbsp; en çok "<strong>film</strong>"e bakar (0.78)'
+ '<br>Decoder "<strong>amazing</strong>" üretirken &nbsp;⟶&nbsp; en çok "<strong>harikaydı</strong>"ya bakar (0.91)'
+ '</p>'
+ '<p class="l-text">Bu ağırlıklar model tarafından otomatik öğrenilir, hizalama denetimi gerektirmez. Çıktıdaki her kelime için kaynak cümle üzerinde bir "bakış dağılımı" olur.</p>'
+ '</div></div>'

+ '<h2 class="l-title">6. Attention\'ın Matematiği — Üç Adım</h2>'

+ '<p class="l-text">Decoder\'ın <em>t</em> adımındaki gizli durumu <em>s<sub>t</sub></em> ve encoder\'ın tüm gizli durumları <em>{h<sub>1</sub>, ..., h<sub>T</sub>}</em>. Attention üç adımda hesaplanır:</p>'

+ '<h3 class="l-subtitle">Adım 1: skor hesabı</h3>'

+ '<div class="katex-block">$$e_{t,i} = \\text{score}(s_t, h_i)$$</div>'

+ '<p class="l-text">Decoder\'ın o andaki durumuyla her bir encoder durumunun ne kadar "uyumlu" olduğunu ölçen bir skor. En basit form noktasal çarpım: <em>e<sub>t,i</sub> = s<sub>t</sub><sup>⊤</sup> h<sub>i</sub></em>.</p>'

+ '<h3 class="l-subtitle">Adım 2: softmax ile ağırlık</h3>'

+ '<div class="katex-block">$$\\alpha_{t,i} = \\frac{\\exp(e_{t,i})}{\\sum_{j=1}^{T} \\exp(e_{t,j})}$$</div>'

+ '<p class="l-text">Skorları olasılık dağılımına çevirir. <em>α<sub>t,i</sub></em>\'nin toplamı 1, her biri 0-1 arası. "Her bir kaynak kelimeye ne kadar bakacağız" payı.</p>'

+ '<h3 class="l-subtitle">Adım 3: bağlam vektörü</h3>'

+ '<div class="katex-block">$$c_t = \\sum_{i=1}^{T} \\alpha_{t,i} \\cdot h_i$$</div>'

+ '<p class="l-text">Encoder durumlarının ağırlıklı toplamı. Bu yeni <em>c<sub>t</sub></em>, decoder\'ın o adıma özel bağlam vektörüdür — sabit değil, dinamik. Decoder bunu kendi gizli durumuyla birleştirip o adımdaki çıktı dağılımını üretir.</p>'

+ '<h2 class="l-title">7. Attention Türleri</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Dot-product attention:</strong> <em>e<sub>t,i</sub> = s<sub>t</sub><sup>⊤</sup> h<sub>i</sub></em>. En basit, hızlı.</li>'
+ '<li><strong>Scaled dot-product:</strong> <em>e<sub>t,i</sub> = s<sub>t</sub><sup>⊤</sup> h<sub>i</sub> / √d</em>. Boyut büyüdükçe skorlar büyür, softmax doyar; bölme normalleştirir. Transformer\'ın temeli.</li>'
+ '<li><strong>Additive (Bahdanau):</strong> <em>e<sub>t,i</sub> = v<sup>⊤</sup> tanh(W<sub>1</sub>s<sub>t</sub> + W<sub>2</sub>h<sub>i</sub>)</em>. İlk önerilen, küçük ağ. Özellikle farklı boyutlu vektörler için iyi.</li>'
+ '<li><strong>Multi-head attention:</strong> Aynı işi paralel birden fazla "kafa" ile yap. Her kafa farklı ilişkiler yakalar. Transformer\'ın merkezindedir, <a href="/tutorials/nlp/10">Ders 10</a>\'da detayında.</li>'
+ '</ul>'

+ '<h2 class="l-title">8. BLEU — Çeviri Kalitesini Ölçme</h2>'

+ '<p class="l-text">Çeviri çıktıları hangisi referansa "yakın" sorusuyla değerlendirilir. <strong>BLEU (Bilingual Evaluation Understudy)</strong> standart metriktir.</p>'

+ '<p class="l-text">BLEU\'nun mantığı: makine çıktısının n-gram\'ları referans çıktıda var mı? 1-gram, 2-gram, 3-gram, 4-gram örtüşmesinin geometrik ortalaması alınır, ayrıca çok kısa çevirileri cezalandıran bir <em>brevity penalty</em> uygulanır.</p>'

+ '<div class="katex-block">$$\\text{BLEU} = \\text{BP} \\cdot \\exp\\Bigl( \\sum_{n=1}^{4} w_n \\log p_n \\Bigr)$$</div>'

+ '<p class="l-text">Burada <em>p<sub>n</sub></em> n-gram precision, <em>BP</em> brevity penalty. Sonuç 0-1 arasında (sıkça %100 olarak yazılır). 25-30 makul, 35+ iyi, 40+ profesyonel kalitede.</p>'

+ '<div class="l-warn"><strong>BLEU\'nun sınırları:</strong> Sadece kelime örtüşmesine bakar — anlam koruyan farklı çevirileri cezalandırır. Bu yüzden modern değerlendirmede <strong>BERTScore</strong> ve <strong>COMET</strong> de kullanılır; bunlar embedding bazlıdır.</div>'

+ '<h2 class="l-title">9. PyTorch ile Mini Seq2Seq + Attention</h2>'

+ '<p class="l-text">Tam bir seq2seq sistemi yazmak çok uzun sürer; burada <strong>çekirdek attention adımını</strong> gösterelim:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Scaled dot-product attention (PyTorch)</div><div class="code-block"><pre><code><span class="kw">import</span> torch'
+ '\n<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F'
+ '\n'
+ '\n<span class="kw">def</span> <span class="fn">attention</span>(query, keys, values):'
+ '\n    <span class="cm"># query: (d,) — decoder\'ın o adımdaki durumu</span>'
+ '\n    <span class="cm"># keys, values: (T, d) — encoder durumları</span>'
+ '\n    d = query.<span class="fn">size</span>(-<span class="num">1</span>)'
+ '\n'
+ '\n    <span class="cm"># 1. Skorları hesapla</span>'
+ '\n    scores = (keys @ query) / (d ** <span class="num">0.5</span>)        <span class="cm"># (T,)</span>'
+ '\n'
+ '\n    <span class="cm"># 2. Softmax ile ağırlığa çevir</span>'
+ '\n    weights = F.<span class="fn">softmax</span>(scores, dim=<span class="num">0</span>)            <span class="cm"># (T,)</span>'
+ '\n'
+ '\n    <span class="cm"># 3. Bağlam vektörü = ağırlıklı toplam</span>'
+ '\n    context = (weights.<span class="fn">unsqueeze</span>(-<span class="num">1</span>) * values).<span class="fn">sum</span>(<span class="num">0</span>)  <span class="cm"># (d,)</span>'
+ '\n    <span class="kw">return</span> context, weights'
+ '\n'
+ '\n<span class="cm"># Mini test</span>'
+ '\nT, d = <span class="num">5</span>, <span class="num">8</span>'
+ '\nq = torch.<span class="fn">randn</span>(d)'
+ '\nk = torch.<span class="fn">randn</span>(T, d)'
+ '\nv = torch.<span class="fn">randn</span>(T, d)'
+ '\nctx, w = <span class="fn">attention</span>(q, k, v)'
+ '\n<span class="fn">print</span>(<span class="str">"ağırlıklar:"</span>, w)        <span class="cm"># T elemanlı, toplamı 1</span>'
+ '\n<span class="fn">print</span>(<span class="str">"bağlam:"</span>, ctx.<span class="fn">shape</span>)    <span class="cm"># torch.Size([8])</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Küçük Q, K, V matrisleri üzerinde scaled-dot-product attention\'ın numpy uygulaması — her transformer\'ın çekirdeği.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np\nrng = np.random.default_rng(0)\n\n# 4 tokens, 8-dim embeddings\nseq, d = 4, 8\nX = rng.normal(size=(seq, d))\n\n# Random projections\nWq, Wk, Wv = rng.normal(size=(3, d, d)) * 0.1\nQ = X @ Wq;  K = X @ Wk;  V = X @ Wv\n\nscores = Q @ K.T / np.sqrt(d)\nattn = np.exp(scores - scores.max(axis=1, keepdims=True))\nattn = attn / attn.sum(axis=1, keepdims=True)\n\nout = attn @ V\n\nprint(\'attn matrix:\\n\', attn.round(2))\nprint(\'row-sum check:\', attn.sum(axis=1).round(3))\nprint(\'output shape :\', out.shape)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Scaled dot-product attention\'ın 3 adımını PyTorch\'ta uygular. <code>query</code> decoder\'ın o adımdaki gizli durumu, <code>keys</code> ve <code>values</code> encoder çıktıları (genelde aynıdır seq2seq\'te). Skorlar matris çarpımıyla hesaplanır, <code>√d</code>\'ye bölünür (büyük boyutlarda softmax doymasını önlemek için), sonra softmax ağırlıkları döner. Bağlam vektörü ağırlıklı toplamla bulunur. Bu fonksiyon Transformer\'ın da temelidir — sadece batch\'lenmiş ve multi-head\'li versiyonu.</p>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Bu derste seq2seq görevlerini, encoder-decoder mimarisini, RNN\'in bilgi darboğazını ve attention\'ın bunu nasıl çözdüğünü öğrendin. Attention\'ın tek başına Transformer\'ın temelidir. <a href="/tutorials/nlp/10">Ders 10</a>\'da Vaswani ve ekibinin "Attention is All You Need" çalışmasıyla RNN\'leri nasıl tamamen attention\'a değiştirdiğini, multi-head self-attention\'ın nasıl çalıştığını ve Transformer\'ın paralelliğin neden NLP için devrim niteliğinde olduğunu göreceksin. BERT ve GPT bu mimarinin üzerine inşa edilir.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Diziden diziye görevlerin ne olduğunu (çeviri, özetleme, soru-cevap) ve neden öncekilerden farklı olduğunu öğrendin. Encoder-decoder mimarisinin sezgisini ve RNN tabanlı uygulamasını gördün. Saf seq2seq\'in tek-vektör darboğazını ve uzun cümlelerde neden bozulduğunu somut olarak gördün. Attention\'ın bunu nasıl çözdüğünü hem sezgisel hem matematiksel olarak takip ettin (skor → softmax → ağırlıklı toplam). Farklı attention türlerini (dot-product, scaled, additive, multi-head) tanıdın. BLEU ile çeviri değerlendirmesini öğrendin. PyTorch\'ta gerçek scaled dot-product attention kodu yazdın — Transformer\'ın da çekirdeği bu.</div>'

,

en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> Until now every task was one-directional: input → single label or single-sentence output. This lesson covers <strong>sequence-to-sequence</strong> tasks: input is a sentence, output is also a sentence. Machine translation, summarisation, question answering. The encoder-decoder architecture, why vanilla RNN seq2seq breaks on long sentences, and how the <strong>attention</strong> mechanism fixes it. Attention is the foundation of the Transformer — this lesson is the direct bridge to <a href="/tutorials/nlp/10">Lesson 10</a>.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Frame translation, summarization, and QA as sequence-to-sequence tasks</li>'
+ '<li>Build an RNN-based encoder-decoder architecture in PyTorch</li>'
+ '<li>Diagnose why vanilla RNN seq2seq breaks on long sentences (bottleneck)</li>'
+ '<li>Derive and implement Bahdanau and Luong attention mechanisms</li>'
+ '<li>Evaluate translation output with BLEU and visualize attention weights</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Sequence-to-Sequence Tasks</h2>'

+ '<p class="l-text">In <strong>seq2seq</strong> tasks both input and output are sequences of words, but they may have different lengths and come from different vocabularies. Common examples:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Machine translation:</strong> "Bu film harikaydı" → "This movie was amazing"</li>'
+ '<li><strong>Summarisation:</strong> 500-word article → 3-sentence summary</li>'
+ '<li><strong>Question answering:</strong> "What is the capital of Turkey?" → "Ankara"</li>'
+ '<li><strong>Speech → text → speech:</strong> the heart of voice assistants</li>'
+ '<li><strong>Code generation:</strong> "sort a list" → <code>list.sort()</code></li>'
+ '</ul>'

+ '<h2 class="l-title">2. Encoder-Decoder Architecture — Intuition</h2>'

+ '<p class="l-text">Sutskever et al. (2014) had the breakthrough idea: <em>compress</em> the input sentence into a fixed-size vector, then <em>generate</em> the output sentence from it.</p>'

+ '<div class="calc-example"><div class="example-label">TWO-STAGE STRUCTURE</div><div class="example-body">'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ '<strong>Encoder</strong> stage:'
+ '<br>"Bu" → "film" → "harikaydı" &nbsp; ⟶ &nbsp; context vector <em>c</em>'
+ '<br><br><strong>Decoder</strong> stage:'
+ '<br><em>c</em> &nbsp; ⟶ &nbsp; "This" → "movie" → "was" → "amazing"'
+ '</p>'
+ '<p class="l-text">Encoder and decoder are separate RNNs. Encoder reads the sentence and emits its final hidden state as <em>c</em>. Decoder takes <em>c</em> and produces output words one by one.</p>'
+ '</div></div>'

+ '<p class="l-text">At each decoder step two pieces of information are used: the encoder context vector <em>c</em>, and the words already produced. Generation continues until an <code>&lt;END&gt;</code> token appears.</p>'

+ '<h2 class="l-title">3. RNN-based Encoder/Decoder</h2>'

+ '<p class="l-text">Encoder and decoder typically use <strong>LSTM</strong> or <strong>GRU</strong> cells (improved RNN variants). The basic RNN computation:</p>'

+ '<div class="katex-block">$$h_t = \\tanh(W_h h_{t-1} + W_x x_t + b)$$</div>'

+ '<p class="l-text">At each time step, the new hidden state is computed from the previous hidden state <em>h<sub>t-1</sub></em> and the current input word <em>x<sub>t</sub></em>. In the encoder, the final <em>h<sub>T</sub></em> is taken as the context vector <em>c</em>.</p>'

+ '<p class="l-text">The decoder at each step:</p>'

+ '<div class="katex-block">$$P(y_t \\mid y_{<t}, c) = \\text{softmax}(W \\cdot s_t + b)$$</div>'

+ '<p class="l-text">Where <em>s<sub>t</sub></em> is the decoder\'s current hidden state and <em>y<sub>&lt;t</sub></em> are the words produced so far. Output is a probability distribution over the target vocabulary.</p>'

+ '<h2 class="l-title">4. The Vanilla Seq2Seq Problem — Information Bottleneck</h2>'

+ '<p class="l-text">Plain encoder-decoder forgets one thing: <strong>squeezing a long sentence into a single vector</strong> loses information. Compressing a 5-word sentence into a 512-dim vector is fine; squeezing a 50-word paragraph into the same vector is disastrous.</p>'

+ '<div class="plotly-graph"><div id="plot-bottleneck-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=[5,10,15,20,30,40,50,60];'
+ 'var bleu_vanilla=[28,27,25,22,18,14,11,9];'
+ 'var bleu_attention=[28,28,28,27,26,25,24,23];'
+ 'var t1={x:k,y:bleu_vanilla,name:"Vanilla Seq2Seq",type:"scatter",mode:"lines+markers",line:{color:"rgba(248,113,113,.85)"}};'
+ 'var t2={x:k,y:bleu_attention,name:"Seq2Seq + Attention",type:"scatter",mode:"lines+markers",line:{color:T.accent}};'
+ 'var layout={title:{text:"Effect of sentence length on BLEU",font:{color:T.text,size:13}},xaxis:{title:"Sentence length (words)",color:T.text,gridcolor:T.grid},yaxis:{title:"BLEU",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-bottleneck-en"))Plotly.newPlot("plot-bottleneck-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Vanilla seq2seq degrades sharply as sentences grow — BLEU halves on 50+ word inputs. Seq2seq with attention stays nearly flat. Reason: attention lets the decoder look at <em>all</em> encoder states at every step; the single-vector bottleneck disappears.</div>'

+ '<h2 class="l-title">5. Attention — A Path to All Information</h2>'

+ '<p class="l-text">Bahdanau et al. (2014) had a revolutionary idea: <strong>let the decoder peek at all encoder states</strong> at every step, learning how much weight to give each.</p>'

+ '<p class="l-text">The intuition: when humans translate, we do not look at the entire source sentence equally — we focus on the few source words corresponding to the target word being produced. Translating "<em>Bu film harikaydı</em>" → "<em>This movie was amazing</em>", we focus on "harikaydı" when producing "amazing", less on "Bu".</p>'

+ '<div class="calc-example"><div class="example-label">ATTENTION ALIGNMENT — INTUITION</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'Decoder generating "<strong>This</strong>" &nbsp;⟶&nbsp; mostly attends to "<strong>Bu</strong>" (weight 0.85)'
+ '<br>Decoder generating "<strong>movie</strong>" &nbsp;⟶&nbsp; mostly attends to "<strong>film</strong>" (0.78)'
+ '<br>Decoder generating "<strong>amazing</strong>" &nbsp;⟶&nbsp; mostly attends to "<strong>harikaydı</strong>" (0.91)'
+ '</p>'
+ '<p class="l-text">These weights are learnt automatically; no alignment supervision needed. Each output word induces an "attention distribution" over the source.</p>'
+ '</div></div>'

+ '<h2 class="l-title">6. The Math of Attention — Three Steps</h2>'

+ '<p class="l-text">Decoder hidden state at step <em>t</em> is <em>s<sub>t</sub></em>; encoder hidden states are <em>{h<sub>1</sub>, ..., h<sub>T</sub>}</em>. Attention is computed in three steps:</p>'

+ '<h3 class="l-subtitle">Step 1: scores</h3>'

+ '<div class="katex-block">$$e_{t,i} = \\text{score}(s_t, h_i)$$</div>'

+ '<p class="l-text">A score that measures how "compatible" the decoder\'s current state is with each encoder state. Simplest form is dot product: <em>e<sub>t,i</sub> = s<sub>t</sub><sup>⊤</sup> h<sub>i</sub></em>.</p>'

+ '<h3 class="l-subtitle">Step 2: softmax to weights</h3>'

+ '<div class="katex-block">$$\\alpha_{t,i} = \\frac{\\exp(e_{t,i})}{\\sum_{j=1}^{T} \\exp(e_{t,j})}$$</div>'

+ '<p class="l-text">Turns scores into a probability distribution. <em>α<sub>t,i</sub></em> sums to 1, each between 0 and 1. The "share of attention" each source word receives.</p>'

+ '<h3 class="l-subtitle">Step 3: context vector</h3>'

+ '<div class="katex-block">$$c_t = \\sum_{i=1}^{T} \\alpha_{t,i} \\cdot h_i$$</div>'

+ '<p class="l-text">A weighted sum of encoder states. This new <em>c<sub>t</sub></em> is the decoder\'s step-specific context vector — dynamic, not fixed. The decoder mixes it with its hidden state to produce the output distribution at that step.</p>'

+ '<h2 class="l-title">7. Variants of Attention</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Dot-product attention:</strong> <em>e<sub>t,i</sub> = s<sub>t</sub><sup>⊤</sup> h<sub>i</sub></em>. Simplest, fastest.</li>'
+ '<li><strong>Scaled dot-product:</strong> <em>e<sub>t,i</sub> = s<sub>t</sub><sup>⊤</sup> h<sub>i</sub> / √d</em>. Scores grow with dimension and softmax saturates; dividing fixes that. The basis of Transformers.</li>'
+ '<li><strong>Additive (Bahdanau):</strong> <em>e<sub>t,i</sub> = v<sup>⊤</sup> tanh(W<sub>1</sub>s<sub>t</sub> + W<sub>2</sub>h<sub>i</sub>)</em>. The original. A small network. Helpful when query and key live in different spaces.</li>'
+ '<li><strong>Multi-head attention:</strong> run several attention "heads" in parallel; each captures a different relation. The core of the Transformer, detailed in <a href="/tutorials/nlp/10">Lesson 10</a>.</li>'
+ '</ul>'

+ '<h2 class="l-title">8. BLEU — Measuring Translation Quality</h2>'

+ '<p class="l-text">Translation outputs are evaluated by how close they are to a reference. <strong>BLEU (Bilingual Evaluation Understudy)</strong> is the standard metric.</p>'

+ '<p class="l-text">BLEU\'s logic: do the machine output\'s n-grams appear in the reference? Take the geometric mean of 1-, 2-, 3-, 4-gram precisions, plus a <em>brevity penalty</em> for too-short translations.</p>'

+ '<div class="katex-block">$$\\text{BLEU} = \\text{BP} \\cdot \\exp\\Bigl( \\sum_{n=1}^{4} w_n \\log p_n \\Bigr)$$</div>'

+ '<p class="l-text">Here <em>p<sub>n</sub></em> is n-gram precision and <em>BP</em> the brevity penalty. The result lies in [0,1] (often reported as a percentage). 25-30 is reasonable, 35+ good, 40+ professional quality.</p>'

+ '<div class="l-warn"><strong>Limits of BLEU:</strong> only looks at word overlap — penalises meaning-preserving paraphrases. Modern evaluation also uses <strong>BERTScore</strong> and <strong>COMET</strong>, which are embedding-based.</div>'

+ '<h2 class="l-title">9. PyTorch — Mini Seq2Seq + Attention</h2>'

+ '<p class="l-text">A full seq2seq system is long; here is the <strong>core attention step</strong>:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Scaled dot-product attention (PyTorch)</div><div class="code-block"><pre><code><span class="kw">import</span> torch'
+ '\n<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F'
+ '\n'
+ '\n<span class="kw">def</span> <span class="fn">attention</span>(query, keys, values):'
+ '\n    <span class="cm"># query: (d,) — decoder hidden state at this step</span>'
+ '\n    <span class="cm"># keys, values: (T, d) — encoder hidden states</span>'
+ '\n    d = query.<span class="fn">size</span>(-<span class="num">1</span>)'
+ '\n'
+ '\n    <span class="cm"># 1. Compute scores</span>'
+ '\n    scores = (keys @ query) / (d ** <span class="num">0.5</span>)        <span class="cm"># (T,)</span>'
+ '\n'
+ '\n    <span class="cm"># 2. Softmax to weights</span>'
+ '\n    weights = F.<span class="fn">softmax</span>(scores, dim=<span class="num">0</span>)            <span class="cm"># (T,)</span>'
+ '\n'
+ '\n    <span class="cm"># 3. Context vector = weighted sum</span>'
+ '\n    context = (weights.<span class="fn">unsqueeze</span>(-<span class="num">1</span>) * values).<span class="fn">sum</span>(<span class="num">0</span>)  <span class="cm"># (d,)</span>'
+ '\n    <span class="kw">return</span> context, weights'
+ '\n'
+ '\n<span class="cm"># Mini test</span>'
+ '\nT, d = <span class="num">5</span>, <span class="num">8</span>'
+ '\nq = torch.<span class="fn">randn</span>(d)'
+ '\nk = torch.<span class="fn">randn</span>(T, d)'
+ '\nv = torch.<span class="fn">randn</span>(T, d)'
+ '\nctx, w = <span class="fn">attention</span>(q, k, v)'
+ '\n<span class="fn">print</span>(<span class="str">"weights:"</span>, w)        <span class="cm"># T elements summing to 1</span>'
+ '\n<span class="fn">print</span>(<span class="str">"context:"</span>, ctx.<span class="fn">shape</span>)    <span class="cm"># torch.Size([8])</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Numpy implementation of scaled-dot-product attention on small Q, K, V matrices — the core of every transformer.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np\nrng = np.random.default_rng(0)\n\n# 4 tokens, 8-dim embeddings\nseq, d = 4, 8\nX = rng.normal(size=(seq, d))\n\n# Random projections\nWq, Wk, Wv = rng.normal(size=(3, d, d)) * 0.1\nQ = X @ Wq;  K = X @ Wk;  V = X @ Wv\n\nscores = Q @ K.T / np.sqrt(d)\nattn = np.exp(scores - scores.max(axis=1, keepdims=True))\nattn = attn / attn.sum(axis=1, keepdims=True)\n\nout = attn @ V\n\nprint(\'attn matrix:\\n\', attn.round(2))\nprint(\'row-sum check:\', attn.sum(axis=1).round(3))\nprint(\'output shape :\', out.shape)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Implements the three-step scaled dot-product attention in PyTorch. <code>query</code> is the decoder\'s hidden state at this step; <code>keys</code> and <code>values</code> are the encoder outputs (usually the same in seq2seq). Scores via matrix multiplication, divided by <code>√d</code> (to keep softmax well-behaved at high dimensions), then softmaxed into weights. Context vector via weighted sum. This same function is at the heart of the Transformer — only batched and made multi-head.</p>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">In this lesson you learned seq2seq tasks, the encoder-decoder architecture, the information bottleneck of vanilla RNNs, and how attention solves it. Attention alone is the foundation of the Transformer. <a href="/tutorials/nlp/10">Lesson 10</a> covers Vaswani et al.\'s "Attention is All You Need" — replacing RNNs entirely with attention, how multi-head self-attention works, and why parallelism made the Transformer revolutionary for NLP. BERT and GPT are built on this architecture.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> Sequence-to-sequence tasks (translation, summarisation, QA) and why they differ from earlier tasks. The encoder-decoder architecture and its RNN implementation. The single-vector bottleneck of vanilla seq2seq, and how it breaks on long sentences. How attention solves it both intuitively and mathematically (score → softmax → weighted sum). Variants of attention (dot-product, scaled, additive, multi-head). BLEU for translation evaluation. Real PyTorch code for scaled dot-product attention — the same core that drives the Transformer.</div>'

};
