/* nlp-new-L8.js — NLP Course Lesson 8: Dil Modelleri — n-gram'dan Sinirsel LM'e (TR + EN) */
var NLP_L8 = {

tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=[];g.__nlpChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Dil modelleme — verili bir bağlamda bir sonraki kelimenin ne olacağını tahmin etme görevi. <em>"Bu film gerçekten ___"</em> sorusuna model "harikaydı", "sıkıcıydı", "harikaymış" gibi olası kelimeler atar. Klasik n-gram modellerinden başlayıp Markov varsayımı, perplexity, smoothing\'e gidip sinirsel dil modellerinin (RNN, Transformer) neden devrim yarattığını göreceksin. Bu görevi anlamak GPT\'yi ve modern LLM\'leri anlamanın kapısıdır.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Dil modellemeyi P(w_n | w_1..w_{n-1}) olarak formüle etmeyi</li>'
+ '<li>n-gram modellerini Markov varsayımı altında küçük corpus üzerinde elle eğitmeyi</li>'
+ '<li>Perplexity metriğini hesaplamayı ve dil modelini bununla değerlendirmeyi</li>'
+ '<li>Laplace, Good-Turing ve Kneser-Ney smoothing\'in neden gerekli olduğunu görmeyi</li>'
+ '<li>RNN ve Transformer tabanlı sinirsel dil modellerinin n-gram\'a üstünlüğünü anlamayı</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Dil Modeli Nedir?</h2>'

+ '<p class="l-text">Bir <strong>dil modeli (language model, LM)</strong>, bir kelime dizisinin olasılığını hesaplar:</p>'

+ '<div class="katex-block">$$P(w_1, w_2, \\dots, w_n)$$</div>'

+ '<p class="l-text">Yani bir cümlenin "ne kadar mantıklı bir dil cümlesi" olduğunu söyler. <em>"Bu film gerçekten harikaydı"</em> olasılığı yüksek; <em>"Harikaydı film bu gerçekten"</em> olasılığı düşük olmalı.</p>'

+ '<p class="l-text">Bunu zincir kuralıyla parçalayabiliriz: tüm dizinin olasılığı, her kelimenin önceki kelimelere koşullu olasılığının çarpımıdır.</p>'

+ '<div class="katex-block">$$P(w_1, \\dots, w_n) = \\prod_{i=1}^{n} P(w_i \\mid w_1, \\dots, w_{i-1})$$</div>'

+ '<p class="l-text">Yani asıl iş: <strong>verili önceki kelimelerle, sıradaki kelime ne olabilir?</strong> Bütün modern LLM\'ler (GPT, Claude, Llama) bu görevi yapacak şekilde eğitilirler. Cevabı dağılım olarak verirler — her olası kelime için bir olasılık.</p>'

+ '<div class="calc-example"><div class="example-label">DİL MODELİ İŞ BAŞINDA</div><div class="example-body">'
+ '<p class="l-text"><strong>Bağlam:</strong> "Bu film gerçekten ___"</p>'
+ '<p class="l-text"><strong>Olasılık dağılımı:</strong></p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'P(harikaydı | bağlam) = 0.18'
+ '<br>P(güzeldi | bağlam) = 0.14'
+ '<br>P(başarılıydı | bağlam) = 0.09'
+ '<br>P(sıkıcıydı | bağlam) = 0.06'
+ '<br>P(berbattı | bağlam) = 0.04'
+ '<br>P(masa | bağlam) = 0.0001  ← anlamsız'
+ '</p>'
+ '<p class="l-text">İyi bir dil modeli "harikaydı" gibi anlamlı devamlara yüksek olasılık verir, "masa" gibi anlamsızlara çok düşük.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Dil Modelinin Kullanımları</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Yazma yardımcısı:</strong> Sıradaki kelime önerisi (klavye otomatik tamamlama, GitHub Copilot).</li>'
+ '<li><strong>Makine çevirisi:</strong> Çıktı cümlesinin akıcı olup olmadığını ölçmek.</li>'
+ '<li><strong>Konuşma tanıma:</strong> Sesle yakalanan kelimeleri en olası dile-uygun cümleye atamak.</li>'
+ '<li><strong>Yazım denetimi:</strong> Hatalı bir kelime mi var, yoksa nadir ama doğru bir kelime mi?</li>'
+ '<li><strong>Üretim (Generation):</strong> GPT — tek başına bir dil modeli iken yeni metin üretebilir.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. n-gram Modeli — Markov Varsayımı</h2>'

+ '<p class="l-text">"Sıradaki kelime tüm geçmişe bağlıdır" demek hesapsal olarak çıkmaz: 100 kelimelik bir bağlamda <em>P(kelime | son 99 kelime)</em>\'yi sayım yapamayız (kombinasyon sayısı astronomik).</p>'

+ '<p class="l-text">n-gram modeli pragmatik bir varsayım yapar: <strong>sadece son n-1 kelime önemli</strong> (Markov varsayımı).</p>'

+ '<div class="katex-block">$$P(w_i \\mid w_1, \\dots, w_{i-1}) \\approx P(w_i \\mid w_{i-n+1}, \\dots, w_{i-1})$$</div>'

+ '<ul class="l-list">'
+ '<li><strong>Unigram (n=1):</strong> Bağlam yok. P(w<sub>i</sub>) = kelimenin genel sıklığı.</li>'
+ '<li><strong>Bigram (n=2):</strong> Sadece bir önceki kelime. P(w<sub>i</sub> | w<sub>i-1</sub>).</li>'
+ '<li><strong>Trigram (n=3):</strong> İki önceki kelime. P(w<sub>i</sub> | w<sub>i-2</sub>, w<sub>i-1</sub>).</li>'
+ '<li><strong>4-gram, 5-gram:</strong> Daha uzun bağlam ama veri seyrekliği patlar.</li>'
+ '</ul>'

+ '<h2 class="l-title">4. Bigram Modeli — Sayım ve Olasılık</h2>'

+ '<p class="l-text">Bigram olasılığı en basit haliyle bir oranla hesaplanır:</p>'

+ '<div class="katex-block">$$P(w_i \\mid w_{i-1}) = \\frac{\\text{count}(w_{i-1}, w_i)}{\\text{count}(w_{i-1})}$$</div>'

+ '<p class="l-text">"Bu film gerçekten ___" örneğine dönelim. Eğitim corpus\'unda:</p>'

+ '<div class="calc-example"><div class="example-label">BİGRAM SAYIMLARI (örnekleyici)</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'count("gerçekten") = 1.000'
+ '<br>count("gerçekten harikaydı") = 180'
+ '<br>count("gerçekten güzeldi") = 140'
+ '<br>count("gerçekten sıkıcıydı") = 60'
+ '<br>count("gerçekten masa") = 0'
+ '</p>'
+ '<p class="l-text">Bigram olasılıkları:</p>'
+ '<div class="katex-block">$$P(w_2 = \\text{harikaydi} \\mid w_1 = \\text{gercekten}) = \\tfrac{180}{1000} = 0.18$$</div>'
+ '<div class="katex-block">$$P(w_2 = \\text{masa} \\mid w_1 = \\text{gercekten}) = \\tfrac{0}{1000} = 0$$</div>'
+ '</div></div>'

+ '<p class="l-text">Sıfır olasılık çok kötüdür: tüm dizi olasılığı tek bir 0\'la sıfırlanır. Çözüm: <strong>smoothing</strong> (yumuşatma).</p>'

+ '<h2 class="l-title">5. Smoothing — Sıfır Olasılığı Önleme</h2>'

+ '<h3 class="l-subtitle">Laplace (Add-1) Smoothing</h3>'

+ '<p class="l-text">En basit yöntem: her sayıma 1 ekle, paydaya da kelime dağarcığı boyutunu (V) ekle.</p>'

+ '<div class="katex-block">$$P(w_i \\mid w_{i-1}) = \\frac{\\text{count}(w_{i-1}, w_i) + 1}{\\text{count}(w_{i-1}) + V}$$</div>'

+ '<p class="l-text">Hiç görülmemiş bigram\'lara bile küçük ama sıfır olmayan olasılık verir. Naive Bayes\'te de gördük (<a href="/tutorials/ai/nlp/text-classification">Ders 3</a>).</p>'

+ '<h3 class="l-subtitle">Daha gelişkin: Kneser-Ney Smoothing</h3>'

+ '<p class="l-text">Laplace çok agresif — yaygın kelimelerin olasılığını düşürür, nadirlerin olasılığını fazla yükseltir. <strong>Kneser-Ney</strong> daha akıllı: kelimenin <em>kaç farklı bağlamda göründüğüne</em> bakar. "Francisco" sadece "San Francisco" bağlamında geçer, "the" her yerde — bu fark Kneser-Ney\'in yakaladığı şeydir.</p>'

+ '<p class="l-text">Kneser-Ney 2010\'lara kadar n-gram dil modellemenin altın standardıydı. Hâlâ küçük bellek gereken senaryolar için kullanılır.</p>'

+ '<h2 class="l-title">6. Perplexity — Dil Modelinin Kalitesi Nasıl Ölçülür</h2>'

+ '<p class="l-text"><strong>Perplexity (PP)</strong>, bir dil modelinin görmediği bir test cümlesinde "ne kadar şaşırdığını" ölçer. Düşük perplexity = model cümleyi iyi tahmin etti.</p>'

+ '<div class="katex-block">$$\\text{PP}(W) = P(w_1, \\dots, w_n)^{-1/n} = \\sqrt[n]{\\prod_{i=1}^{n} \\frac{1}{P(w_i \\mid w_{1},\\dots,w_{i-1})}}$$</div>'

+ '<p class="l-text">Sezgisel olarak: model her adımda kaç farklı kelime arasında "kararsız" kalıyor? Perplexity 50 ise, model her adımda "50 olası kelime var, hangisi olduğundan emin değilim" diyor gibi.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Düşük PP iyi.</strong> İyi bir model dilin bir sonraki kelimesini iyi öngörür.</li>'
+ '<li>İngilizce için n-gram modeller PP ≈ 100-150 verir; sinirsel modeller PP ≈ 30-60.</li>'
+ '<li>Modern LLM\'ler (GPT-4 gibi) PP ≈ 10-20 verebilir.</li>'
+ '</ul>'

+ '<h2 class="l-title">7. n-gram\'ın Sınırları</h2>'

+ '<h3 class="l-subtitle">Sınır 1: Veri seyrekliği</h3>'

+ '<p class="l-text">Trigram için 30.000³ ≈ 27 trilyon olası üçlü var. Eğitim corpus\'u kaç milyar token olsa bile çoğu üçlü hiç görünmez. Smoothing yardım eder ama tam çözmez.</p>'

+ '<h3 class="l-subtitle">Sınır 2: Genelleme yok</h3>'

+ '<p class="l-text">"Bu film gerçekten harikaydı" gördüyse, "Bu dizi gerçekten harikaydı"yı tahmin edebilir mi? <strong>Hayır</strong>. n-gram için "film" ve "dizi" tamamen ayrı kelimeler, hiçbir benzerlik yok. Oysa <a href="/tutorials/ai/nlp/word-embeddings">Ders 5</a>\'teki embedding\'ler bu iki kelimeyi yakın vektörlere koyardı.</p>'

+ '<h3 class="l-subtitle">Sınır 3: Uzun bağlam yok</h3>'

+ '<p class="l-text">"Geçen yıl Erasmus için İspanya\'ya gitmiş arkadaşım Mikail\'in döndüğünden ___" cümlesinde model 15 kelime geride bağlamı kaybeder. Bigram\'da sadece "döndüğünden" görünür — "Mikail" bilgisi gitti.</p>'

+ '<h2 class="l-title">8. Sinirsel Dil Modelleri — Sürece Köprü</h2>'

+ '<p class="l-text">Bengio ve ekibi 2003\'te bir devrim başlattı: <strong>her kelimeyi bir vektör (embedding) olarak göstermek</strong> ve sinir ağıyla bağlamdan bir sonraki kelimeyi tahmin etmek. Bu yaklaşımın iki büyük avantajı:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Genelleme:</strong> "film" ile "dizi" yakın vektörlere sahip. "film harikaydı" gören model, "dizi harikaydı"yı doğal olarak iyi tahmin eder.</li>'
+ '<li><strong>Uzun bağlam:</strong> Sinir ağı (özellikle RNN — <a href="/tutorials/ai/nlp/seq2seq-attention">Ders 9</a>) çok daha uzun bağlamı taşıyabilir.</li>'
+ '</ul>'

+ '<p class="l-text">Sinirsel LM\'in temel hesaplaması:</p>'

+ '<div class="katex-block">$$P(w_t \\mid \\text{context}) = \\text{softmax}(W \\cdot h_t + b)$$</div>'

+ '<p class="l-text">Burada <em>h<sub>t</sub></em>, sinir ağının bağlamdan ürettiği gizli durum vektörü. Softmax tüm kelime dağarcığı üzerinde olasılık dağılımı verir. <strong>n-gram</strong>\'da olasılık tablodan okunur, sinirsel LM\'de hesaplanır.</p>'

+ '<p class="l-text">Bu modelin gelişimi şöyle ilerledi:</p>'

+ '<ol class="l-list">'
+ '<li><strong>2003 — Bengio NLM:</strong> Feedforward ağ ile sabit bağlam.</li>'
+ '<li><strong>2010 — RNN LM:</strong> Tekrarlayan ağlarla değişken uzunluklu bağlam (<a href="/tutorials/ai/nlp/seq2seq-attention">Ders 9</a>).</li>'
+ '<li><strong>2014 — LSTM LM:</strong> Uzun bağımlılıkları daha iyi yakalayan RNN varyantı.</li>'
+ '<li><strong>2017 — Transformer LM:</strong> Self-attention ile paralelleştirilebilir, çok uzun bağlam (<a href="/tutorials/ai/nlp/transformers-bert">Ders 10</a>).</li>'
+ '<li><strong>2018+ — GPT, BERT:</strong> Büyük corpus üzerinde önceden eğitilmiş Transformer\'lar (<a href="/tutorials/ai/nlp/generative-llms">Ders 11</a>).</li>'
+ '</ol>'

+ '<h2 class="l-title">9. Python\'da n-gram LM — NLTK ile</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> NLTK ile bigram dil modeli</div><div class="code-block"><pre><code><span class="kw">from</span> nltk.lm <span class="kw">import</span> Laplace'
+ '\n<span class="kw">from</span> nltk.lm.preprocessing <span class="kw">import</span> padded_everygram_pipeline'
+ '\n'
+ '\ncumleler = ['
+ '\n    [<span class="str">"bu"</span>, <span class="str">"film"</span>, <span class="str">"gerçekten"</span>, <span class="str">"harikaydı"</span>],'
+ '\n    [<span class="str">"film"</span>, <span class="str">"gerçekten"</span>, <span class="str">"güzeldi"</span>],'
+ '\n    [<span class="str">"bu"</span>, <span class="str">"film"</span>, <span class="str">"sıkıcıydı"</span>],'
+ '\n    <span class="cm"># ... binlerce cümle</span>'
+ '\n]'
+ '\n'
+ '\n<span class="cm"># bigram için (n=2) hazırlık</span>'
+ '\ntrain_data, padded_vocab = <span class="fn">padded_everygram_pipeline</span>(<span class="num">2</span>, cumleler)'
+ '\n'
+ '\nlm = <span class="fn">Laplace</span>(<span class="num">2</span>)  <span class="cm"># Laplace smoothing\'li bigram</span>'
+ '\nlm.<span class="fn">fit</span>(train_data, padded_vocab)'
+ '\n'
+ '\n<span class="cm"># Bir bigram olasılığı</span>'
+ '\n<span class="fn">print</span>(lm.<span class="fn">score</span>(<span class="str">"harikaydı"</span>, [<span class="str">"gerçekten"</span>]))  <span class="cm"># 0.04</span>'
+ '\n'
+ '\n<span class="cm"># Cümle üret</span>'
+ '\n<span class="fn">print</span>(lm.<span class="fn">generate</span>(<span class="num">5</span>, text_seed=[<span class="str">"bu"</span>], random_seed=<span class="num">7</span>))'
+ '\n<span class="cm"># [\'film\', \'gerçekten\', \'harikaydı\', \'</s>\', \'</s>\']</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Saf Python ile Laplace smoothing\'li bigram sayım modeli — NLTK\'nin <code>Laplace</code>\'ı ile aynı mantık.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from collections import Counter\nimport re\n\ncorpus = [\n    "bu film gerçekten harikaydı",\n    "bu film çok iyiydi",\n    "film kötüydü",\n    "gerçekten harika bir film",\n]\n\nunigrams = Counter()\nbigrams  = Counter()\nfor s in corpus:\n    toks = [\'&lt;s&gt;\'] + re.findall(r\'\\w+\', s.lower(), re.UNICODE) + [\'&lt;/s&gt;\']\n    unigrams.update(toks)\n    bigrams.update(zip(toks, toks[1:]))\n\nV = len(unigrams)\n\ndef p_bigram(w_prev, w):\n    return (bigrams[(w_prev, w)] + 1) / (unigrams[w_prev] + V)\n\nprint(\'P(harikaydı | gerçekten) =\', round(p_bigram(\'gerçekten\', \'harikaydı\'), 4))\nprint(\'P(kötüydü   | film)      =\', round(p_bigram(\'film\',      \'kötüydü\'),    4))\nprint(\'P(uçtu      | bu)        =\', round(p_bigram(\'bu\',        \'uçtu\'),      4))  # görülmemiş -&gt; smoothed</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> NLTK\'nin <code>Laplace</code> sınıfı bigram model + Laplace smoothing sağlar. <code>padded_everygram_pipeline</code> her cümleye başlangıç (<code>&lt;s&gt;</code>) ve son (<code>&lt;/s&gt;</code>) işaretleri ekler ve n-gram\'ları üretir. Eğitim sonrası <code>score</code> bir bigram\'ın olasılığını verir; <code>generate</code> verilen başlangıçtan başlayarak yeni cümle üretir (her adımda olasılığa göre rastgele kelime çeker).</p>'

+ '<div class="plotly-graph"><div id="plot-lm-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["Unigram","Bigram","Trigram","4-gram","RNN LM","LSTM LM","Transformer LM"];'
+ 'var pp=[440,180,120,105,75,50,28];'
+ 'var t1={x:k,y:pp,type:"bar",marker:{color:T.accent},text:pp.map(function(v){return v;}),textposition:"outside"};'
+ 'var layout={title:{text:"Test perplexity\'sinin yöntem evrimine göre düşüşü (örneklendirme)",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{color:T.text,gridcolor:T.grid,title:"Test perplexity (düşük=iyi)",type:"log"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:90,l:60}};'
+ 'if(document.getElementById("plot-lm-tr"))Plotly.newPlot("plot-lm-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Dil modelleme tarihinin temel ilerlemesi — her adımda perplexity (model şaşkınlığı) düşüyor. Unigram\'dan bigram\'a büyük sıçrama, n-gram\'lardan sinirsel modellere ikinci büyük sıçrama, Transformer ile son büyük adım. Düşey eksen logaritmik. Modern LLM\'ler bu eğrinin çok daha altındadır.</div>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Dil modeli kavramı modern NLP\'nin merkezindedir. n-gram\'larla görmediğin dezavantajları sinirsel modeller çözer. <a href="/tutorials/ai/nlp/seq2seq-attention">Ders 9</a>\'da <strong>RNN ve LSTM</strong>\'i göreceğiz — değişken uzunluklu bağlam taşıyan ilk başarılı sinirsel mimariler. Sonra <a href="/tutorials/ai/nlp/transformers-bert">Ders 10</a>\'da Transformer\'larla tanışacağız. Bu derste kurduğun temel — <em>sıradaki kelimeyi tahmin etme</em> — modern her LLM\'in özünde aynı kalır.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Dil modelinin ne olduğunu (kelime dizilerinin olasılığı) ve niye merkezde olduğunu öğrendin. Markov varsayımı ile n-gram modellerinin (unigram, bigram, trigram) nasıl tanımlandığını gördün. Bigram olasılıklarının elle hesabını yaptın. Sıfır olasılık probleminin çözümünü (Laplace ve Kneser-Ney smoothing) öğrendin. Perplexity ile dil modeli kalitesini ölçmenin standart yolunu kavradın. n-gram\'ın temel sınırlarını (veri seyrekliği, genelleme yok, kısa bağlam) anladın. Sinirsel LM\'lerin neden devrim yarattığını ve gelişim çizgisini (Bengio → RNN → LSTM → Transformer) gördün. NLTK ile gerçek bir bigram model eğittin.</div>'

,

en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> Language modelling — predicting the next word given context. <em>"This movie was truly ___"</em> → the model assigns probabilities to "amazing", "boring", "wonderful". Starting with classical n-gram models, you will learn the Markov assumption, perplexity, smoothing, and why neural language models (RNN, Transformer) revolutionised the field. Understanding this task is the gateway to GPT and modern LLMs.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Formulate language modeling as predicting P(w_n given w_1..w_{n-1})</li>'
+ '<li>Train n-gram models by hand on a small corpus under the Markov assumption</li>'
+ '<li>Compute perplexity and use it to evaluate and compare language models</li>'
+ '<li>Apply Laplace, Good-Turing, and Kneser-Ney smoothing to handle unseen n-grams</li>'
+ '<li>Explain why RNN and Transformer neural LMs outperform classical n-grams</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. What is a Language Model?</h2>'

+ '<p class="l-text">A <strong>language model (LM)</strong> computes the probability of a sequence of words:</p>'

+ '<div class="katex-block">$$P(w_1, w_2, \\dots, w_n)$$</div>'

+ '<p class="l-text">It tells us "how likely is this sentence under the language?". <em>"This movie was truly amazing"</em> should be highly probable; <em>"Amazing was movie truly this"</em> should be much less probable.</p>'

+ '<p class="l-text">By the chain rule we factor it: the probability of the whole sequence is the product of each word\'s probability conditional on previous words.</p>'

+ '<div class="katex-block">$$P(w_1, \\dots, w_n) = \\prod_{i=1}^{n} P(w_i \\mid w_1, \\dots, w_{i-1})$$</div>'

+ '<p class="l-text">So the real job is: <strong>given previous words, what is the next?</strong> All modern LLMs (GPT, Claude, Llama) are trained for this. They emit a distribution — a probability for every possible next word.</p>'

+ '<div class="calc-example"><div class="example-label">A LANGUAGE MODEL AT WORK</div><div class="example-body">'
+ '<p class="l-text"><strong>Context:</strong> "This movie was truly ___"</p>'
+ '<p class="l-text"><strong>Distribution:</strong></p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'P(amazing | ctx) = 0.18'
+ '<br>P(wonderful | ctx) = 0.14'
+ '<br>P(brilliant | ctx) = 0.09'
+ '<br>P(boring | ctx) = 0.06'
+ '<br>P(terrible | ctx) = 0.04'
+ '<br>P(table | ctx) = 0.0001  ← nonsense'
+ '</p>'
+ '<p class="l-text">A good LM gives high probability to natural continuations like "amazing" and very low probability to nonsense like "table".</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Uses of Language Models</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Writing assistants:</strong> next-word suggestions (autocomplete, GitHub Copilot).</li>'
+ '<li><strong>Machine translation:</strong> measuring whether the output is fluent.</li>'
+ '<li><strong>Speech recognition:</strong> picking the most language-likely sentence from acoustic candidates.</li>'
+ '<li><strong>Spell checking:</strong> typo or rare-but-correct word?</li>'
+ '<li><strong>Generation:</strong> GPT — by itself a language model that can produce new text.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. n-gram Model — Markov Assumption</h2>'

+ '<p class="l-text">"The next word depends on the entire history" is computationally hopeless: in a 100-word context we cannot count <em>P(word | last 99 words)</em> (the combinatorics are astronomical).</p>'

+ '<p class="l-text">n-gram makes a pragmatic assumption: <strong>only the last n-1 words matter</strong> (Markov assumption).</p>'

+ '<div class="katex-block">$$P(w_i \\mid w_1, \\dots, w_{i-1}) \\approx P(w_i \\mid w_{i-n+1}, \\dots, w_{i-1})$$</div>'

+ '<ul class="l-list">'
+ '<li><strong>Unigram (n=1):</strong> no context. P(w<sub>i</sub>) = the global frequency of the word.</li>'
+ '<li><strong>Bigram (n=2):</strong> previous word only. P(w<sub>i</sub> | w<sub>i-1</sub>).</li>'
+ '<li><strong>Trigram (n=3):</strong> last two words. P(w<sub>i</sub> | w<sub>i-2</sub>, w<sub>i-1</sub>).</li>'
+ '<li><strong>4-gram, 5-gram:</strong> longer context but data sparsity explodes.</li>'
+ '</ul>'

+ '<h2 class="l-title">4. Bigram Model — Counts and Probabilities</h2>'

+ '<p class="l-text">In its simplest form bigram probability is a ratio:</p>'

+ '<div class="katex-block">$$P(w_i \\mid w_{i-1}) = \\frac{\\text{count}(w_{i-1}, w_i)}{\\text{count}(w_{i-1})}$$</div>'

+ '<p class="l-text">Back to "This movie was truly ___". In a training corpus:</p>'

+ '<div class="calc-example"><div class="example-label">BIGRAM COUNTS (illustrative)</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'count("truly") = 1,000'
+ '<br>count("truly amazing") = 180'
+ '<br>count("truly wonderful") = 140'
+ '<br>count("truly boring") = 60'
+ '<br>count("truly table") = 0'
+ '</p>'
+ '<p class="l-text">Bigram probabilities:</p>'
+ '<div class="katex-block">$$P(\\text{amazing} \\mid \\text{truly}) = \\tfrac{180}{1000} = 0.18$$</div>'
+ '<div class="katex-block">$$P(\\text{table} \\mid \\text{truly}) = \\tfrac{0}{1000} = 0$$</div>'
+ '</div></div>'

+ '<p class="l-text">A zero is awful: the entire sequence probability collapses to zero on a single 0. The fix: <strong>smoothing</strong>.</p>'

+ '<h2 class="l-title">5. Smoothing — Avoiding Zero Probabilities</h2>'

+ '<h3 class="l-subtitle">Laplace (Add-1) Smoothing</h3>'

+ '<p class="l-text">The simplest method: add 1 to every count and add the vocabulary size (V) to the denominator.</p>'

+ '<div class="katex-block">$$P(w_i \\mid w_{i-1}) = \\frac{\\text{count}(w_{i-1}, w_i) + 1}{\\text{count}(w_{i-1}) + V}$$</div>'

+ '<p class="l-text">It assigns a small but non-zero probability even to never-seen bigrams. We saw the same trick in Naive Bayes (<a href="/tutorials/ai/nlp/text-classification">Lesson 3</a>).</p>'

+ '<h3 class="l-subtitle">More refined: Kneser-Ney Smoothing</h3>'

+ '<p class="l-text">Laplace is too aggressive — it under-shoots common words and over-shoots rare ones. <strong>Kneser-Ney</strong> is smarter: it considers <em>how many distinct contexts</em> a word appears in. "Francisco" only appears after "San", "the" appears everywhere — Kneser-Ney captures this difference.</p>'

+ '<p class="l-text">Kneser-Ney was the gold standard of n-gram language modelling until the 2010s. Still used where memory is tight.</p>'

+ '<h2 class="l-title">6. Perplexity — Measuring LM Quality</h2>'

+ '<p class="l-text"><strong>Perplexity (PP)</strong> measures how "surprised" a language model is by a held-out test sentence. Low perplexity = good predictions.</p>'

+ '<div class="katex-block">$$\\text{PP}(W) = P(w_1, \\dots, w_n)^{-1/n} = \\sqrt[n]{\\prod_{i=1}^{n} \\frac{1}{P(w_i \\mid w_{1},\\dots,w_{i-1})}}$$</div>'

+ '<p class="l-text">Intuitively: between how many words is the model effectively undecided at each step? PP=50 means "around 50 plausible words at each position".</p>'

+ '<ul class="l-list">'
+ '<li><strong>Lower PP is better.</strong> A good model predicts the next word well.</li>'
+ '<li>For English, n-gram models give PP ≈ 100-150; neural models PP ≈ 30-60.</li>'
+ '<li>Modern LLMs (e.g. GPT-4) reach PP ≈ 10-20.</li>'
+ '</ul>'

+ '<h2 class="l-title">7. Limits of n-grams</h2>'

+ '<h3 class="l-subtitle">Limit 1: Data sparsity</h3>'

+ '<p class="l-text">For trigrams there are 30,000³ ≈ 27 trillion possible triples. No matter how many billion tokens of training data, most are never seen. Smoothing helps but does not fully fix it.</p>'

+ '<h3 class="l-subtitle">Limit 2: No generalisation</h3>'

+ '<p class="l-text">If the model has seen "the movie was truly amazing", can it predict "the show was truly amazing"? <strong>No</strong>. For n-grams "movie" and "show" are entirely separate words with no similarity. Embeddings (<a href="/tutorials/ai/nlp/word-embeddings">Lesson 5</a>) on the other hand would place these close.</p>'

+ '<h3 class="l-subtitle">Limit 3: No long context</h3>'

+ '<p class="l-text">In "Last year my friend Mikail who went to Spain via Erasmus has now ___", the model loses context 15 words back. In a bigram only "now" is visible — the "Mikail" information is gone.</p>'

+ '<h2 class="l-title">8. Neural Language Models — The Bridge</h2>'

+ '<p class="l-text">Bengio et al. started a revolution in 2003: <strong>represent each word as an embedding</strong> and predict the next word from context with a neural network. Two big advantages:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Generalisation:</strong> "movie" and "show" have similar vectors. A model that saw "movie was amazing" naturally predicts "show was amazing".</li>'
+ '<li><strong>Long context:</strong> a neural network (especially RNN — <a href="/tutorials/ai/nlp/seq2seq-attention">Lesson 9</a>) can carry much longer context.</li>'
+ '</ul>'

+ '<p class="l-text">The core neural LM computation:</p>'

+ '<div class="katex-block">$$P(w_t \\mid \\text{context}) = \\text{softmax}(W \\cdot h_t + b)$$</div>'

+ '<p class="l-text">Here <em>h<sub>t</sub></em> is the hidden state vector the network produces from context. Softmax gives a probability distribution over the entire vocabulary. Where n-grams read probabilities from a table, neural LMs compute them.</p>'

+ '<p class="l-text">Evolution of neural LMs:</p>'

+ '<ol class="l-list">'
+ '<li><strong>2003 — Bengio NLM:</strong> feedforward net with fixed-size context.</li>'
+ '<li><strong>2010 — RNN LM:</strong> recurrent networks with variable-length context (<a href="/tutorials/ai/nlp/seq2seq-attention">Lesson 9</a>).</li>'
+ '<li><strong>2014 — LSTM LM:</strong> RNN variant that captures long dependencies better.</li>'
+ '<li><strong>2017 — Transformer LM:</strong> self-attention; parallelisable, very long context (<a href="/tutorials/ai/nlp/transformers-bert">Lesson 10</a>).</li>'
+ '<li><strong>2018+ — GPT, BERT:</strong> Transformers pretrained on massive corpora (<a href="/tutorials/ai/nlp/generative-llms">Lesson 11</a>).</li>'
+ '</ol>'

+ '<h2 class="l-title">9. n-gram LM in Python with NLTK</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Bigram language model with NLTK</div><div class="code-block"><pre><code><span class="kw">from</span> nltk.lm <span class="kw">import</span> Laplace'
+ '\n<span class="kw">from</span> nltk.lm.preprocessing <span class="kw">import</span> padded_everygram_pipeline'
+ '\n'
+ '\nsentences = ['
+ '\n    [<span class="str">"this"</span>, <span class="str">"movie"</span>, <span class="str">"was"</span>, <span class="str">"truly"</span>, <span class="str">"amazing"</span>],'
+ '\n    [<span class="str">"the"</span>, <span class="str">"movie"</span>, <span class="str">"was"</span>, <span class="str">"wonderful"</span>],'
+ '\n    [<span class="str">"this"</span>, <span class="str">"movie"</span>, <span class="str">"was"</span>, <span class="str">"boring"</span>],'
+ '\n    <span class="cm"># ... thousands more</span>'
+ '\n]'
+ '\n'
+ '\n<span class="cm"># Prepare for n=2 (bigram)</span>'
+ '\ntrain_data, padded_vocab = <span class="fn">padded_everygram_pipeline</span>(<span class="num">2</span>, sentences)'
+ '\n'
+ '\nlm = <span class="fn">Laplace</span>(<span class="num">2</span>)  <span class="cm"># bigram with Laplace smoothing</span>'
+ '\nlm.<span class="fn">fit</span>(train_data, padded_vocab)'
+ '\n'
+ '\n<span class="cm"># A bigram probability</span>'
+ '\n<span class="fn">print</span>(lm.<span class="fn">score</span>(<span class="str">"amazing"</span>, [<span class="str">"truly"</span>]))  <span class="cm"># 0.04</span>'
+ '\n'
+ '\n<span class="cm"># Generate text</span>'
+ '\n<span class="fn">print</span>(lm.<span class="fn">generate</span>(<span class="num">5</span>, text_seed=[<span class="str">"this"</span>], random_seed=<span class="num">7</span>))'
+ '\n<span class="cm"># [\'movie\', \'was\', \'truly\', \'amazing\', \'</s>\']</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Hand-rolled Laplace-smoothed bigram counter — same idea as NLTK\'s `Laplace`, in pure Python.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from collections import Counter\nimport re\n\ncorpus = [\n    "this movie was truly amazing",\n    "this film was really good",\n    "the movie was bad",\n    "truly amazing movie",\n]\n\nunigrams = Counter()\nbigrams  = Counter()\nfor s in corpus:\n    toks = [\'&lt;s&gt;\'] + re.findall(r\'\\w+\', s.lower()) + [\'&lt;/s&gt;\']\n    unigrams.update(toks)\n    bigrams.update(zip(toks, toks[1:]))\n\nV = len(unigrams)                       # vocabulary size\n\ndef p_bigram(w_prev, w):\n    return (bigrams[(w_prev, w)] + 1) / (unigrams[w_prev] + V)\n\nprint(\'P(amazing | truly) =\', round(p_bigram(\'truly\', \'amazing\'), 4))\nprint(\'P(bad     | was)   =\', round(p_bigram(\'was\',   \'bad\'),     4))\nprint(\'P(unicorn | the)   =\', round(p_bigram(\'the\',   \'unicorn\'), 4))  # unseen -&gt; smoothed</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> NLTK\'s <code>Laplace</code> class implements a bigram model with Laplace smoothing. <code>padded_everygram_pipeline</code> adds start (<code>&lt;s&gt;</code>) and end (<code>&lt;/s&gt;</code>) tokens and produces all n-grams. After training, <code>score</code> returns the probability of a bigram; <code>generate</code> samples a continuation from a seed (drawing each next word according to the learnt probabilities).</p>'

+ '<div class="plotly-graph"><div id="plot-lm-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["Unigram","Bigram","Trigram","4-gram","RNN LM","LSTM LM","Transformer LM"];'
+ 'var pp=[440,180,120,105,75,50,28];'
+ 'var t1={x:k,y:pp,type:"bar",marker:{color:T.accent},text:pp.map(function(v){return v;}),textposition:"outside"};'
+ 'var layout={title:{text:"Test perplexity across the evolution of LMs (illustrative)",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{color:T.text,gridcolor:T.grid,title:"Test perplexity (lower=better)",type:"log"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:90,l:60}};'
+ 'if(document.getElementById("plot-lm-en"))Plotly.newPlot("plot-lm-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> The arc of language modelling progress. Perplexity (model surprise) drops at every step. Big jumps from unigram to bigram, then from n-grams to neural, and the latest big leap with Transformers. Y-axis is log scale. Modern LLMs sit far below this curve.</div>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">Language modelling sits at the heart of modern NLP. The shortcomings of n-grams are exactly what neural models solve. <a href="/tutorials/ai/nlp/seq2seq-attention">Lesson 9</a> covers <strong>RNN and LSTM</strong> — the first successful neural architectures for variable-length context. Then <a href="/tutorials/ai/nlp/transformers-bert">Lesson 10</a> introduces Transformers. The core idea you learned here — <em>predict the next word</em> — stays the same in every modern LLM.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> What a language model is (probability of word sequences) and why it is central. The Markov assumption defining n-gram models (unigram, bigram, trigram). Bigram probabilities by hand. The zero-probability problem and Laplace and Kneser-Ney smoothing as fixes. Perplexity as the standard quality metric. The intrinsic limits of n-grams (data sparsity, no generalisation, short context). Why neural LMs were a revolution and the Bengio → RNN → LSTM → Transformer trajectory. Real code with NLTK to train a bigram LM.</div>'

};
