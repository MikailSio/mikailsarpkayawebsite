/* nlp-new-L5.js — NLP Course Lesson 5: Kelime Gömmeleri — Word2Vec, GloVe, FastText (TR + EN) */
var NLP_L5 = {

tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=[];g.__nlpChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> <a href="/tutorials/nlp/2">Ders 2</a>\'de cümleleri 30.000 boyutlu seyrek vektörlere çeviriyorduk; her kelime ayrı bir sütundu, hiçbir kelime diğeriyle "akraba" değildi. Bu derste o boşluğu kapatacağız: <strong>kelime gömmeleri (word embeddings)</strong>. Word2Vec, GloVe ve FastText ile kelimeleri 100-300 boyutlu yoğun (dense) vektörlere çevireceğiz — vektörler artık <em>anlam</em> taşıyacak. "kral - erkek + kadın ≈ kraliçe" gibi büyülü görünen aritmetiğin nasıl mümkün olduğunu adım adım göreceğiz.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Kelimeleri 100-300 boyutlu yoğun vektörlere çevirmenin neden seyrek BoW\'tan üstün olduğunu</li>'
+ '<li>Word2Vec\'in CBOW ve Skip-gram mimarilerini ve negative sampling\'i anlamayı</li>'
+ '<li>GloVe ve FastText\'i Word2Vec ile karşılaştırmayı, FastText\'in subword avantajını</li>'
+ '<li>gensim ile Word2Vec eğitmeyi ve kosinüs benzerliğiyle en yakın kelimeleri bulmayı</li>'
+ '<li>"kral - erkek + kadın ≈ kraliçe" analoji aritmetiğini Türkçe modelle test etmeyi</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Niye Embedding\'lere İhtiyaç Var?</h2>'

+ '<p class="l-text">BoW ve TF-IDF iki temel sınırla geliyor:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Anlam yakınlığı yok:</strong> "harika" ve "muhteşem" anlamca yakındır, ama BoW açısından iki ayrı sütun, sıfır ilişki. Eğitim setinde "harika" gören bir model, test setinde "muhteşem" görünce hiçbir şey çıkaramaz.</li>'
+ '<li><strong>Yüksek boyut, yüksek seyreklik:</strong> 30.000 kelimelik dağarcıkta vektörün %99.9\'u sıfırdır. Hesaplama maliyetli, depolama zor.</li>'
+ '</ul>'

+ '<p class="l-text">Embedding\'ler her iki sorunu birden çözer: kelimeleri 100-300 boyutlu <strong>yoğun</strong> vektörlere çevirir, ve bu vektörlerin <strong>geometrisi anlamı yansıtır</strong>. Yakın anlamlı kelimeler vektör uzayında birbirine yakın durur.</p>'

+ '<h2 class="l-title">2. One-hot vs Dense Vektör</h2>'

+ '<p class="l-text">İkisini yan yana koyalım. 30.000 kelimelik dağarcıkta "harika" kelimesi şöyle gösterilir:</p>'

+ '<div class="calc-example"><div class="example-label">İKİ TEMSİL — AYNI KELİME</div><div class="example-body">'
+ '<p class="l-text"><strong>One-hot (BoW):</strong> 30.000 boyutlu vektör. Sadece "harika"nın indeksinde 1, gerisi sıfır.</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem">[0, 0, ..., 0, <span style="color:var(--accent)"><strong>1</strong></span>, 0, ..., 0]</p>'
+ '<p class="l-text" style="margin-top:.8rem"><strong>Dense embedding (Word2Vec):</strong> 300 boyutlu vektör. Her boyut bir gerçek sayı, hiçbiri sıfır değil.</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem">[0.21, -0.45, 0.13, 0.87, -0.32, ..., 0.55]</p>'
+ '<p class="l-text" style="margin-top:.8rem">Dense vektör 100x daha küçük, ama 100x daha bilgili — her boyut anlamın bir yönünü yakalar.</p>'
+ '</div></div>'

+ '<h2 class="l-title">3. Word2Vec — Sezgisel Anlamı Öğrenmek</h2>'

+ '<p class="l-text"><strong>Word2Vec</strong> (Mikolov ve ekibi, 2013) çığır açıcı bir fikre dayanır: <em>"Bir kelimenin anlamı, etrafındaki kelimelerden gelir."</em> (Distributional Hypothesis). Eğer iki kelime sürekli benzer komşularla görünüyorsa, anlamca yakın olmalılar.</p>'

+ '<div class="calc-example"><div class="example-label">DAĞILIMSAL VARSAYIM</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ '<code>"Bu film gerçekten <strong>harika</strong>ydı"</code>'
+ '<br><code>"Bu film gerçekten <strong>muhteşem</strong>di"</code>'
+ '<br><code>"Bu film gerçekten <strong>mükemmel</strong>di"</code>'
+ '</p>'
+ '<p class="l-text">"harika", "muhteşem", "mükemmel" hep aynı bağlamlarda geçiyor. Word2Vec bu üç kelimeye birbirine yakın vektörler atar — onları gerçekten "kelime" olarak değil, içinde göründükleri komşulardan tanır.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">İki mimari: CBOW ve Skip-gram</h3>'

+ '<p class="l-text">Word2Vec iki farklı eğitim hedefi sunar:</p>'

+ '<ul class="l-list">'
+ '<li><strong>CBOW (Continuous Bag of Words):</strong> Çevredeki kelimelerden merkez kelimeyi tahmin et. <em>"Bu film ___ harikaydı"</em> → "gerçekten". Hızlı, sık kelimelerde iyi.</li>'
+ '<li><strong>Skip-gram:</strong> Merkez kelimeden çevre kelimeleri tahmin et. <em>"gerçekten"</em> → ["bu", "film", "harika", "ydı"]. Yavaş ama nadir kelimelerde daha iyi.</li>'
+ '</ul>'

+ '<p class="l-text">İkisi de aynı temel fikri takip eder: bir kelime için bir vektör öğren öyle ki o vektör çevresindeki kelimeleri iyi tahmin etsin.</p>'

+ '<h2 class="l-title">4. Skip-gram\'ın Matematiği</h2>'

+ '<p class="l-text">Skip-gram her kelimeye iki vektör atar: kendisi için bir <em>kelime vektörü</em> ve komşu olarak göründüğünde için bir <em>bağlam vektörü</em>. Bir merkez kelime <em>w</em> verildiğinde, komşu <em>c</em>\'nin oluşma olasılığı softmax ile tanımlanır:</p>'

+ '<div class="katex-block">$$P(c \\mid w) = \\frac{\\exp(\\mathbf{u}_c^\\top \\mathbf{v}_w)}{\\sum_{c\' \\in V} \\exp(\\mathbf{u}_{c\'}^\\top \\mathbf{v}_w)}$$</div>'

+ '<p class="l-text">Burada:</p>'

+ '<ul class="l-list">'
+ '<li><strong>v<sub>w</sub></strong> — merkez kelimenin vektörü</li>'
+ '<li><strong>u<sub>c</sub></strong> — bağlam kelimesinin vektörü</li>'
+ '<li><strong>V</strong> — tüm dağarcık (paydadaki büyük toplam)</li>'
+ '</ul>'

+ '<p class="l-text">Eğitim hedefi: gerçek komşular için bu olasılığı maksimize etmek. Tüm corpus üzerinde toplam log olasılık:</p>'

+ '<div class="katex-block">$$\\mathcal{L} = \\sum_{w \\in \\text{corpus}} \\sum_{c \\in \\text{context}(w)} \\log P(c \\mid w)$$</div>'

+ '<div class="l-warn"><strong>Hesaplama sorunu:</strong> Softmax\'in paydası tüm dağarcık üzerinde toplam — 30.000 kelimelik bir corpus için her güncellemede 30.000 üstel hesap demek. Çok yavaş. Çözüm: <strong>negative sampling</strong>. Tüm dağarcık yerine birkaç (5-10) rastgele "olumsuz" örnek seç. Hız 100x artar, kalite neredeyse aynı kalır.</div>'

+ '<h2 class="l-title">5. Vektör Aritmetiği — En Çarpıcı Bulgu</h2>'

+ '<p class="l-text">Word2Vec\'in beklenmedik bir yan etkisi vardı: vektörler arasında <strong>basit aritmetik anlamlı sonuçlar</strong> verir.</p>'

+ '<div class="calc-example"><div class="example-label">EFSANEVİ ÖRNEK</div><div class="example-body">'
+ '<div class="katex-block">$$\\mathbf{v}_{\\text{king}} - \\mathbf{v}_{\\text{man}} + \\mathbf{v}_{\\text{woman}} \\approx \\mathbf{v}_{\\text{queen}}$$</div>'
+ '<p class="l-text">Yani "kral - erkek" işlemi sanki cinsiyet bilgisini siliyor, geriye "kraliyet" anlamı kalıyor. Üzerine "kadın" eklenince model "kraliçe"ye en yakın vektörü buluyor.</p>'
+ '</div></div>'

+ '<p class="l-text">Aynı geometri başka ilişkilerde de görülür:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Türetim:</strong> v(walking) - v(walk) + v(swim) ≈ v(swimming)</li>'
+ '<li><strong>Çoğul:</strong> v(cars) - v(car) + v(book) ≈ v(books)</li>'
+ '<li><strong>Başkent:</strong> v(Paris) - v(France) + v(Türkiye) ≈ v(Ankara)</li>'
+ '<li><strong>Karşıt:</strong> v(iyi) ile v(kötü) yakın olabilir — ikisi de değerlendirme/yargı içerirler. Bu Word2Vec\'in zayıf yanlarından biri.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Benzerlik nasıl ölçülür?</h3>'

+ '<p class="l-text">İki kelimenin yakınlığı <strong>kosinüs benzerliği</strong> ile ölçülür — vektörler arasındaki açının kosinüsü:</p>'

+ '<div class="katex-block">$$\\text{sim}(\\mathbf{a}, \\mathbf{b}) = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{\\|\\mathbf{a}\\|\\,\\|\\mathbf{b}\\|}$$</div>'

+ '<p class="l-text">Sonuç -1 ile 1 arasında. 1\'e yakın → çok benzer; 0 → ilişkisiz; -1 → tam zıt yönde. Pratikte 0.6 üstü "anlamlı yakın" sayılır.</p>'

+ '<h2 class="l-title">6. GloVe — Küresel Eş Görülme İstatistikleri</h2>'

+ '<p class="l-text">Word2Vec yerel komşulara bakar (her kelimenin etrafındaki birkaç kelime). <strong>GloVe</strong> (Pennington ve ekibi, 2014) bunu büyütür: tüm corpus üzerinde <em>kelime çiftlerinin ne kadar sık birlikte göründüğüne</em> bakar.</p>'

+ '<p class="l-text">Önce bir <strong>eş görülme matrisi</strong> kurulur. <em>X<sub>ij</sub></em> = <em>j</em> kelimesinin <em>i</em>\'nin bağlamında kaç kez göründüğü. Sonra şu kayıp fonksiyonu minimize edilir:</p>'

+ '<div class="katex-block">$$\\mathcal{L} = \\sum_{i,j} f(X_{ij}) \\bigl( \\mathbf{w}_i^\\top \\tilde{\\mathbf{w}}_j + b_i + \\tilde{b}_j - \\log X_{ij} \\bigr)^2$$</div>'

+ '<p class="l-text">Sezgi: iki kelimenin vektör çarpımı, eş görülme oranlarının logaritmasına yakın olsun. Pratikte Word2Vec ile çok benzer sonuçlar verir, ama eğitim daha kararlı.</p>'

+ '<h2 class="l-title">7. FastText — Alt-Kelime Embedding\'leri</h2>'

+ '<p class="l-text">Word2Vec ve GloVe\'un büyük zayıflığı: sadece eğitim setinde gördükleri kelimeler için embedding üretirler. <em>OOV (out-of-vocabulary)</em> kelime gelirse — yazım hatası, yeni türetim, jargon — model boş döner.</p>'

+ '<p class="l-text">Bu Türkçe için ciddi bir sorundur. Türkçenin eklemeli yapısı (<a href="/tutorials/nlp/1">Ders 1</a>\'i hatırla) tek bir kökten yüzlerce farklı çekim üretebilir: <em>evlerimizdekilerden, evimizdekilerden, evimdekilerden</em>. Word2Vec bunları farklı kelimeler olarak görür ve her biri için ayrı bir vektör öğrenmesi gerek.</p>'

+ '<p class="l-text"><strong>FastText</strong> (Bojanowski ve ekibi, 2016, Facebook) çözümü güzel: bir kelimeyi <strong>karakter n-gramları</strong>nın toplamı olarak temsil et.</p>'

+ '<div class="calc-example"><div class="example-label">FASTTEXT NASIL ÇALIŞIR</div><div class="example-body">'
+ '<p class="l-text"><code>"harika"</code> kelimesi 3-gram\'larına bölünür (kelime sınırları için &lt; ve &gt; eklenir):</p>'
+ '<p class="l-text" style="font-family:var(--mono);text-align:center"><code>&lt;ha, har, ari, rik, ika, ka&gt;</code></p>'
+ '<p class="l-text">Kelime vektörü = bu 3-gram\'ların vektörlerinin toplamı. Sonuç: <em>"harikaaa"</em> gibi varyantlar bile aynı 3-gram\'ları çoğunlukla paylaşır, otomatik benzer vektör alır. <em>"evlerimizdekilerden"</em> gibi yeni çekimler de "ev", "ler" gibi tanıdık parçalardan inşa edilir.</p>'
+ '</div></div>'

+ '<p class="l-text"><strong>Türkçe için tavsiye edilen embedding yöntemi FastText\'tir.</strong> Eklemeli yapıyı doğal olarak yakalar, OOV problemini büyük ölçüde çözer.</p>'

+ '<h2 class="l-title">8. Python\'da — gensim ile Word2Vec</h2>'

+ '<p class="l-text">gensim kütüphanesi kelime gömmelerini eğitmek ve kullanmak için endüstri standardıdır.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Word2Vec eğitimi</div><div class="code-block"><pre><code><span class="kw">from</span> gensim.models <span class="kw">import</span> Word2Vec'
+ '\n'
+ '\n<span class="cm"># Cümleleri kelime listelerine ayrılmış olarak ver</span>'
+ '\nsentences = ['
+ '\n    [<span class="str">"bu"</span>, <span class="str">"film"</span>, <span class="str">"gerçekten"</span>, <span class="str">"harika"</span>],'
+ '\n    [<span class="str">"film"</span>, <span class="str">"çok"</span>, <span class="str">"kötü"</span>, <span class="str">"beğenmedim"</span>],'
+ '\n    [<span class="str">"film"</span>, <span class="str">"harika"</span>, <span class="str">"tavsiye"</span>, <span class="str">"ederim"</span>],'
+ '\n    <span class="cm"># ... binlerce cümle daha</span>'
+ '\n]'
+ '\n'
+ '\nmodel = <span class="fn">Word2Vec</span>('
+ '\n    sentences,'
+ '\n    vector_size=<span class="num">100</span>,    <span class="cm"># embedding boyutu</span>'
+ '\n    window=<span class="num">5</span>,           <span class="cm"># bağlam penceresi</span>'
+ '\n    min_count=<span class="num">2</span>,        <span class="cm"># 2\'den az geçen kelimeleri at</span>'
+ '\n    sg=<span class="num">1</span>,               <span class="cm"># 1=skip-gram, 0=CBOW</span>'
+ '\n    epochs=<span class="num">10</span>,'
+ '\n)'
+ '\n'
+ '\n<span class="cm"># Bir kelimenin vektörü</span>'
+ '\n<span class="fn">print</span>(model.wv[<span class="str">"harika"</span>].shape)  <span class="cm"># (100,)</span>'
+ '\n'
+ '\n<span class="cm"># En yakın 5 kelime</span>'
+ '\n<span class="fn">print</span>(model.wv.<span class="fn">most_similar</span>(<span class="str">"harika"</span>, topn=<span class="num">5</span>))'
+ '\n<span class="cm"># [(\'mükemmel\', 0.84), (\'muhteşem\', 0.81), ...]</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">`df_reviews`\'ten kurulan eş-dizinim matrisi üzerinde TruncatedSVD ile Word2Vec yaklaşımı — aynı yoğun vektör fikri, gensim olmadan.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import CountVectorizer\nfrom sklearn.decomposition import TruncatedSVD\nimport numpy as np\n\ntexts_local = df_reviews[\'text\'].astype(str).str.lower().tolist()[:200]\nvec = CountVectorizer(max_features=300, min_df=2)\nM = vec.fit_transform(texts_local)              # (docs, vocab)\nC = (M.T @ M).toarray().astype(np.float32)      # vocab x vocab co-occurrence\n\nsvd = TruncatedSVD(n_components=16, random_state=0)\nemb = svd.fit_transform(C)                       # vocab x 16 dense vectors\n\nvocab = vec.get_feature_names_out()\nprint(\'vocab:\', len(vocab), \'  embedding dim:\', emb.shape[1])\n\n# nearest neighbours of first word\nfrom sklearn.metrics.pairwise import cosine_similarity\nsims = cosine_similarity(emb[:1], emb)[0]\ntop = np.argsort(-sims)[1:6]\nprint(f\'similar to {vocab[0]!r}:\', [vocab[i] for i in top])</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Cümle listesinden Word2Vec eğitir. <code>vector_size</code> embedding boyutu, <code>window</code> bağlam penceresi (her kelimenin sağında ve solunda kaç kelimeye bakılacağı), <code>min_count</code> nadir kelimeleri filtreler, <code>sg=1</code> skip-gram modunu seçer. Eğitim sonrası <code>model.wv["kelime"]</code> ile vektör alınır, <code>most_similar</code> ile en yakın komşular bulunur.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Vektör aritmetiği</div><div class="code-block"><pre><code><span class="cm"># Klasik analoji: kral - erkek + kadın</span>'
+ '\nresult = model.wv.<span class="fn">most_similar</span>('
+ '\n    positive=[<span class="str">"kral"</span>, <span class="str">"kadın"</span>],'
+ '\n    negative=[<span class="str">"erkek"</span>],'
+ '\n    topn=<span class="num">3</span>,'
+ '\n)'
+ '\n<span class="fn">print</span>(result)'
+ '\n<span class="cm"># [(\'kraliçe\', 0.78), (\'prenses\', 0.71), ...]</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> "pozitif" listesindeki vektörlerin toplamından "negatif" listesindekileri çıkarır, sonuç vektöre en yakın kelimeleri döner. <code>positive=["kral", "kadın"]</code>, <code>negative=["erkek"]</code> demek = <em>kral + kadın - erkek</em> hesaplaması. Yeterince büyük bir corpus üzerinde eğitilmişse "kraliçe" ilk sırada gelir.</p>'

+ '<h2 class="l-title">9. Türkçe için Pratik İpuçları</h2>'

+ '<ul class="l-list">'
+ '<li><strong>FastText kullan, Word2Vec değil.</strong> Türkçenin eklemeli yapısı için karakter n-gram\'lar olmazsa olmaz.</li>'
+ '<li><strong>Hazır model varsa onu indir.</strong> Sıfırdan eğitmek yerine: <code>fasttext.cc</code> üzerinde Türkçe önceden eğitilmiş 300 boyutlu vektörler vardır (Wikipedia + Common Crawl, milyarlarca token üzerinden eğitilmiş).</li>'
+ '<li><strong>Domain\'in özelse kendin eğit.</strong> Genel Türkçe Wikipedia hekimlik jargonunu bilmez. Kendi corpus\'undan FastText eğit, hazır modelle birleştir.</li>'
+ '<li><strong>Karakter normalizasyonu önemli.</strong> "ı" ile "i" karışıklığı, ASCII\'ye düşürme alışkanlığı vektör kalitesini düşürür. Eğitim ve kullanım sırasında aynı normalizasyonu uygula.</li>'
+ '<li><strong>Vektör boyutu:</strong> 100-300 yaygındır. Daha büyük embedding küçük corpus\'ta ezberleme yapar.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Embedding\'leri sınıflandırıcıda kullanmak</h3>'

+ '<p class="l-text">Bir cümleyi tek vektöre indirmek için en yaygın yol: cümledeki tüm kelimelerin vektörlerinin <strong>ortalamasını</strong> almak. Daha gelişkin yöntemler RNN/Transformer kullanır (sonraki dersler), ama ortalama bile sıkça TF-IDF\'ten iyi sonuç verir.</p>'

+ '<div class="plotly-graph"><div id="plot-emb-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["TF-IDF + LR","Word2Vec ortalaması","FastText ortalaması","BERT [CLS] vektörü"];'
+ 'var f1=[0.85,0.86,0.88,0.93];'
+ 'var t1={x:k,y:f1,type:"bar",marker:{color:T.accent},text:f1.map(function(v){return (v*100).toFixed(0)+"%";}),textposition:"outside"};'
+ 'var layout={title:{text:"Türkçe duygu analizi: temsil yöntemine göre F1",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{color:T.text,gridcolor:T.grid,title:"F1 skoru",range:[0.7,1.0],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:90,l:60}};'
+ 'if(document.getElementById("plot-emb-tr"))Plotly.newPlot("plot-emb-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Aynı Türkçe sentiment veri setinde temsilden temsile geçiş tipik kazanım. TF-IDF + lojistik regresyon bir baseline. Word2Vec/FastText ortalaması az ama tutarlı bir iyileştirme verir, ama asıl büyük sıçrama BERT (kontekstuel embedding) ile gelir — "harika" kelimesinin vektörü artık cümleye göre değişir, "harika kötü oldu" cümlesinde farklı çıkar.</div>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Şimdi her kelimenin anlamı yansıtan bir vektörü var. Ama hâlâ sabit bir vektör — "harika" kelimesi her cümlede aynı şekilde temsil ediliyor, oysa bağlama göre anlamı değişebilir ("harika bir gün" vs. "harika, yine geç kaldım"). <a href="/tutorials/nlp/6">Ders 6</a>\'da konu modelleme ile metinlerin altındaki gizli temaları yakalamayı, <a href="/tutorials/nlp/9">Ders 9</a>\'dan itibaren ise bağlama duyarlı (contextual) embedding\'lere — RNN ve Transformer çıktıları — geçeceğiz.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> One-hot temsilin sınırlarını ve dense embedding\'lerin neden gerektiğini anladın. Word2Vec\'in dağılımsal varsayıma dayandığını, CBOW ve Skip-gram mimarilerini, softmax + negative sampling matematiğini gördün. Vektör aritmetiğinin (kral - erkek + kadın ≈ kraliçe) nasıl mümkün olduğunu kavradın. GloVe\'un küresel eş görülme istatistiklerine dayandığını öğrendin. FastText\'in alt-kelime n-gramlarıyla OOV ve eklemeli dilleri çözdüğünü gördün — Türkçe için neden tercih edildiğini anladın. gensim ile gerçek kod yazdın. Cümle vektörü olarak ortalama ve son metrik karşılaştırmasıyla embedding\'lerin pratikteki etkisini gördün.</div>'

,

en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> In <a href="/tutorials/nlp/2">Lesson 2</a> we turned sentences into 30,000-dimensional sparse vectors; every word was a separate column with no kinship to other words. This lesson closes that gap: <strong>word embeddings</strong>. Word2Vec, GloVe, and FastText let us turn words into dense 100–300 dimensional vectors that carry <em>meaning</em>. We will see exactly how the famous "king − man + woman ≈ queen" arithmetic becomes possible.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Understand why dense 100-300 dim vectors beat sparse BoW for similarity</li>'
+ '<li>Walk through Word2Vec CBOW and Skip-gram with negative sampling</li>'
+ '<li>Compare Word2Vec, GloVe, and FastText including the subword advantage</li>'
+ '<li>Train a Word2Vec model with gensim and find nearest neighbors via cosine similarity</li>'
+ '<li>Test the king - man + woman analogy arithmetic on a pretrained model</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Why Do We Need Embeddings?</h2>'

+ '<p class="l-text">BoW and TF-IDF have two fundamental limits:</p>'

+ '<ul class="l-list">'
+ '<li><strong>No semantic similarity:</strong> "amazing" and "wonderful" are close in meaning, but BoW treats them as two separate columns with zero relationship. A model that learnt about "amazing" in training has no idea what to do with "wonderful" at test time.</li>'
+ '<li><strong>High dimensionality, high sparsity:</strong> in a 30,000-word vocabulary 99.9% of the vector is zeros. Computation is expensive, storage is bulky.</li>'
+ '</ul>'

+ '<p class="l-text">Embeddings solve both: words become 100–300 dimensional <strong>dense</strong> vectors, and the geometry of these vectors <strong>reflects meaning</strong>. Semantically close words sit close in vector space.</p>'

+ '<h2 class="l-title">2. One-hot vs Dense Vector</h2>'

+ '<p class="l-text">Compare them side by side. In a 30,000-word vocabulary "amazing" looks like:</p>'

+ '<div class="calc-example"><div class="example-label">TWO REPRESENTATIONS — SAME WORD</div><div class="example-body">'
+ '<p class="l-text"><strong>One-hot (BoW):</strong> 30,000-dimensional vector. Only the index of "amazing" is 1, the rest zero.</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem">[0, 0, ..., 0, <span style="color:var(--accent)"><strong>1</strong></span>, 0, ..., 0]</p>'
+ '<p class="l-text" style="margin-top:.8rem"><strong>Dense embedding (Word2Vec):</strong> 300-dimensional vector. Each dimension a real number, none zero.</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem">[0.21, -0.45, 0.13, 0.87, -0.32, ..., 0.55]</p>'
+ '<p class="l-text" style="margin-top:.8rem">100x smaller, 100x more informative — each dimension captures a facet of meaning.</p>'
+ '</div></div>'

+ '<h2 class="l-title">3. Word2Vec — Learning Meaning from Context</h2>'

+ '<p class="l-text"><strong>Word2Vec</strong> (Mikolov et al., 2013) is built on a deep idea: <em>"The meaning of a word comes from the company it keeps."</em> (the Distributional Hypothesis). If two words consistently appear with similar neighbours, they must be close in meaning.</p>'

+ '<div class="calc-example"><div class="example-label">DISTRIBUTIONAL HYPOTHESIS</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ '<code>"This movie was truly <strong>amazing</strong>"</code>'
+ '<br><code>"This movie was truly <strong>wonderful</strong>"</code>'
+ '<br><code>"This movie was truly <strong>brilliant</strong>"</code>'
+ '</p>'
+ '<p class="l-text">"amazing", "wonderful", "brilliant" appear in the same contexts. Word2Vec gives them similar vectors — recognising them not as words per se, but by the company they keep.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Two architectures: CBOW and Skip-gram</h3>'

+ '<p class="l-text">Word2Vec offers two training objectives:</p>'

+ '<ul class="l-list">'
+ '<li><strong>CBOW (Continuous Bag of Words):</strong> predict the centre word from its neighbours. <em>"This movie was ___ amazing"</em> → "truly". Fast, good on frequent words.</li>'
+ '<li><strong>Skip-gram:</strong> predict neighbours from the centre word. <em>"truly"</em> → ["this", "movie", "was", "amazing"]. Slower but better on rare words.</li>'
+ '</ul>'

+ '<p class="l-text">Both follow the same idea: learn a vector per word so that vector predicts surrounding words well.</p>'

+ '<h2 class="l-title">4. The Math of Skip-gram</h2>'

+ '<p class="l-text">Skip-gram assigns each word two vectors: a <em>word vector</em> for when it is the centre, and a <em>context vector</em> for when it is a neighbour. Given a centre word <em>w</em>, the probability of a context word <em>c</em> is defined via softmax:</p>'

+ '<div class="katex-block">$$P(c \\mid w) = \\frac{\\exp(\\mathbf{u}_c^\\top \\mathbf{v}_w)}{\\sum_{c\' \\in V} \\exp(\\mathbf{u}_{c\'}^\\top \\mathbf{v}_w)}$$</div>'

+ '<p class="l-text">Where:</p>'

+ '<ul class="l-list">'
+ '<li><strong>v<sub>w</sub></strong> — vector of the centre word</li>'
+ '<li><strong>u<sub>c</sub></strong> — vector of the context word</li>'
+ '<li><strong>V</strong> — full vocabulary (the big sum in the denominator)</li>'
+ '</ul>'

+ '<p class="l-text">Training maximises this probability for true neighbours. Total log probability over the corpus:</p>'

+ '<div class="katex-block">$$\\mathcal{L} = \\sum_{w \\in \\text{corpus}} \\sum_{c \\in \\text{context}(w)} \\log P(c \\mid w)$$</div>'

+ '<div class="l-warn"><strong>Computational pain:</strong> the softmax denominator sums over the full vocabulary — for a 30,000-word corpus that is 30,000 exponentials per update. Way too slow. The fix: <strong>negative sampling</strong>. Instead of the whole vocabulary, pick a few (5–10) random "negative" examples. Speed up 100x, quality nearly identical.</div>'

+ '<h2 class="l-title">5. Vector Arithmetic — The Magic Result</h2>'

+ '<p class="l-text">An unexpected property emerged in Word2Vec: simple <strong>arithmetic between vectors gives meaningful results</strong>.</p>'

+ '<div class="calc-example"><div class="example-label">THE LEGENDARY EXAMPLE</div><div class="example-body">'
+ '<div class="katex-block">$$\\mathbf{v}_{\\text{king}} - \\mathbf{v}_{\\text{man}} + \\mathbf{v}_{\\text{woman}} \\approx \\mathbf{v}_{\\text{queen}}$$</div>'
+ '<p class="l-text">It is as if "king − man" strips out the gender, leaving the "royalty" component. Adding "woman" lands us nearest to "queen".</p>'
+ '</div></div>'

+ '<p class="l-text">The same geometry shows up for many relations:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Inflection:</strong> v(walking) − v(walk) + v(swim) ≈ v(swimming)</li>'
+ '<li><strong>Plural:</strong> v(cars) − v(car) + v(book) ≈ v(books)</li>'
+ '<li><strong>Capital:</strong> v(Paris) − v(France) + v(Turkey) ≈ v(Ankara)</li>'
+ '<li><strong>Antonym caveat:</strong> v(good) and v(bad) can be close — both involve evaluation. A known weakness of Word2Vec.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">How is similarity measured?</h3>'

+ '<p class="l-text">Closeness is measured by <strong>cosine similarity</strong> — the cosine of the angle between vectors:</p>'

+ '<div class="katex-block">$$\\text{sim}(\\mathbf{a}, \\mathbf{b}) = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{\\|\\mathbf{a}\\|\\,\\|\\mathbf{b}\\|}$$</div>'

+ '<p class="l-text">Result is between -1 and 1. Close to 1 → very similar; 0 → unrelated; -1 → opposite. In practice, above 0.6 counts as "meaningfully close".</p>'

+ '<h2 class="l-title">6. GloVe — Global Co-occurrence Statistics</h2>'

+ '<p class="l-text">Word2Vec looks at local neighbourhoods (a few words around each centre). <strong>GloVe</strong> (Pennington et al., 2014) scales up: it looks at <em>how often pairs of words co-occur</em> across the entire corpus.</p>'

+ '<p class="l-text">First a <strong>co-occurrence matrix</strong> is built. <em>X<sub>ij</sub></em> = how many times word <em>j</em> appears in the context of word <em>i</em>. Then this loss is minimised:</p>'

+ '<div class="katex-block">$$\\mathcal{L} = \\sum_{i,j} f(X_{ij}) \\bigl( \\mathbf{w}_i^\\top \\tilde{\\mathbf{w}}_j + b_i + \\tilde{b}_j - \\log X_{ij} \\bigr)^2$$</div>'

+ '<p class="l-text">Intuition: the dot product of two word vectors should approximate the log of their co-occurrence ratio. In practice GloVe gives results similar to Word2Vec, but training is more stable.</p>'

+ '<h2 class="l-title">7. FastText — Subword Embeddings</h2>'

+ '<p class="l-text">A big weakness of Word2Vec and GloVe: they only have embeddings for words seen during training. If an <em>OOV (out-of-vocabulary)</em> word arrives — typo, new derivation, jargon — the model returns nothing.</p>'

+ '<p class="l-text">This is severe for Turkish. The agglutinative structure (recall <a href="/tutorials/nlp/1">Lesson 1</a>) generates hundreds of inflected forms from a single root: <em>evlerimizdekilerden, evimizdekilerden, evimdekilerden</em>. Word2Vec sees these as different words and needs a separate vector for each.</p>'

+ '<p class="l-text"><strong>FastText</strong> (Bojanowski et al., 2016, Facebook) has an elegant fix: represent a word as the sum of its <strong>character n-grams</strong>.</p>'

+ '<div class="calc-example"><div class="example-label">HOW FASTTEXT WORKS</div><div class="example-body">'
+ '<p class="l-text"><code>"amazing"</code> is broken into character 3-grams (with &lt; and &gt; for word boundaries):</p>'
+ '<p class="l-text" style="font-family:var(--mono);text-align:center"><code>&lt;am, ama, maz, azi, zin, ing, ng&gt;</code></p>'
+ '<p class="l-text">The word vector = the sum of vectors of its 3-grams. Result: variants like <em>"amazingg"</em> share most 3-grams and automatically get a similar vector. New inflected forms like <em>"evlerimizdekilerden"</em> are built up from familiar pieces ("ev", "ler", etc.).</p>'
+ '</div></div>'

+ '<p class="l-text"><strong>For Turkish, FastText is the recommended embedding method.</strong> It naturally handles agglutinative morphology and largely solves the OOV problem.</p>'

+ '<h2 class="l-title">8. Python — Word2Vec with gensim</h2>'

+ '<p class="l-text">The gensim library is the industry standard for training and using word embeddings.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Word2Vec training</div><div class="code-block"><pre><code><span class="kw">from</span> gensim.models <span class="kw">import</span> Word2Vec'
+ '\n'
+ '\n<span class="cm"># Pass sentences as lists of tokens</span>'
+ '\nsentences = ['
+ '\n    [<span class="str">"this"</span>, <span class="str">"movie"</span>, <span class="str">"was"</span>, <span class="str">"truly"</span>, <span class="str">"amazing"</span>],'
+ '\n    [<span class="str">"the"</span>, <span class="str">"movie"</span>, <span class="str">"was"</span>, <span class="str">"terrible"</span>],'
+ '\n    [<span class="str">"amazing"</span>, <span class="str">"movie"</span>, <span class="str">"recommend"</span>, <span class="str">"everyone"</span>],'
+ '\n    <span class="cm"># ... thousands more sentences</span>'
+ '\n]'
+ '\n'
+ '\nmodel = <span class="fn">Word2Vec</span>('
+ '\n    sentences,'
+ '\n    vector_size=<span class="num">100</span>,    <span class="cm"># embedding size</span>'
+ '\n    window=<span class="num">5</span>,           <span class="cm"># context window</span>'
+ '\n    min_count=<span class="num">2</span>,        <span class="cm"># drop words seen < 2 times</span>'
+ '\n    sg=<span class="num">1</span>,               <span class="cm"># 1=skip-gram, 0=CBOW</span>'
+ '\n    epochs=<span class="num">10</span>,'
+ '\n)'
+ '\n'
+ '\n<span class="fn">print</span>(model.wv[<span class="str">"amazing"</span>].shape)  <span class="cm"># (100,)</span>'
+ '\n<span class="fn">print</span>(model.wv.<span class="fn">most_similar</span>(<span class="str">"amazing"</span>, topn=<span class="num">5</span>))</code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Approximate Word2Vec with TruncatedSVD on a co-occurrence matrix built from `df_reviews` — same dense vector idea, no gensim.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import CountVectorizer\nfrom sklearn.decomposition import TruncatedSVD\nimport numpy as np\n\ntexts_local = df_reviews[\'text\'].astype(str).str.lower().tolist()[:200]\nvec = CountVectorizer(max_features=300, min_df=2)\nM = vec.fit_transform(texts_local)              # (docs, vocab)\nC = (M.T @ M).toarray().astype(np.float32)      # vocab x vocab co-occurrence\n\nsvd = TruncatedSVD(n_components=16, random_state=0)\nemb = svd.fit_transform(C)                       # vocab x 16 dense vectors\n\nvocab = vec.get_feature_names_out()\nprint(\'vocab:\', len(vocab), \'  embedding dim:\', emb.shape[1])\n\n# nearest neighbours of first word\nfrom sklearn.metrics.pairwise import cosine_similarity\nsims = cosine_similarity(emb[:1], emb)[0]\ntop = np.argsort(-sims)[1:6]\nprint(f\'similar to {vocab[0]!r}:\', [vocab[i] for i in top])</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Trains Word2Vec from a list of tokenised sentences. <code>vector_size</code> is the embedding dimensionality, <code>window</code> is the context window size, <code>min_count</code> filters out rare words, <code>sg=1</code> selects skip-gram. After training, <code>model.wv["word"]</code> retrieves the vector and <code>most_similar</code> finds nearest neighbours.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Vector arithmetic</div><div class="code-block"><pre><code><span class="cm"># The classic analogy: king - man + woman</span>'
+ '\nresult = model.wv.<span class="fn">most_similar</span>('
+ '\n    positive=[<span class="str">"king"</span>, <span class="str">"woman"</span>],'
+ '\n    negative=[<span class="str">"man"</span>],'
+ '\n    topn=<span class="num">3</span>,'
+ '\n)'
+ '\n<span class="fn">print</span>(result)'
+ '\n<span class="cm"># [(\'queen\', 0.78), (\'princess\', 0.71), ...]</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Adds the vectors in <code>positive</code>, subtracts the ones in <code>negative</code>, and returns words closest to the resulting vector. <code>positive=["king", "woman"]</code>, <code>negative=["man"]</code> means <em>king + woman − man</em>. With a large enough corpus, "queen" lands first.</p>'

+ '<h2 class="l-title">9. Practical Tips for Turkish</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Use FastText, not Word2Vec.</strong> Subword n-grams are essential for Turkish\'s agglutinative morphology.</li>'
+ '<li><strong>Use pretrained models when available.</strong> Save training time: <code>fasttext.cc</code> hosts pretrained 300-dim vectors for Turkish (Wikipedia + Common Crawl, billions of tokens).</li>'
+ '<li><strong>Train your own for niche domains.</strong> General Turkish Wikipedia does not know medical jargon. Train FastText on your corpus and combine with the pretrained one.</li>'
+ '<li><strong>Character normalisation matters.</strong> Confusing "ı" with "i", or naively ASCII-stripping, degrades vector quality. Apply the same normalisation at training and inference.</li>'
+ '<li><strong>Vector size:</strong> 100–300 is the sweet spot. Larger embeddings overfit small corpora.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Using embeddings in a classifier</h3>'

+ '<p class="l-text">The simplest way to turn a sentence into one vector: <strong>average</strong> the vectors of all its words. More sophisticated methods use RNNs or Transformers (later lessons), but even averaging often beats TF-IDF.</p>'

+ '<div class="plotly-graph"><div id="plot-emb-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["TF-IDF + LR","Word2Vec average","FastText average","BERT [CLS] vector"];'
+ 'var f1=[0.85,0.86,0.88,0.93];'
+ 'var t1={x:k,y:f1,type:"bar",marker:{color:T.accent},text:f1.map(function(v){return (v*100).toFixed(0)+"%";}),textposition:"outside"};'
+ 'var layout={title:{text:"Sentiment F1 by representation method",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{color:T.text,gridcolor:T.grid,title:"F1 score",range:[0.7,1.0],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:90,l:60}};'
+ 'if(document.getElementById("plot-emb-en"))Plotly.newPlot("plot-emb-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Typical jump going from one representation to another on the same sentiment dataset. TF-IDF + LR baseline. Averaged Word2Vec/FastText gives a small but consistent gain. The big leap is BERT — contextual embeddings whose vectors change with the sentence around them.</div>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">Every word now has a vector that reflects its meaning. But it is still a static vector — "amazing" is represented the same way in every sentence, even though the meaning can shift with context ("amazing day" vs. "amazing, late again"). <a href="/tutorials/nlp/6">Lesson 6</a> tackles topic modelling — finding latent themes across documents — and starting from <a href="/tutorials/nlp/9">Lesson 9</a> we move to contextual embeddings (RNN and Transformer outputs).</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> The limits of one-hot vectors and why dense embeddings exist. The distributional hypothesis behind Word2Vec, both CBOW and Skip-gram, the softmax + negative sampling math. Why and how vector arithmetic (king − man + woman ≈ queen) works. How GloVe replaces local windows with global co-occurrence statistics. How FastText\'s subword n-grams solve OOV and agglutinative morphology — and why FastText is preferred for Turkish. Real code with gensim. Sentence vectors via averaging, and the practical impact in a final benchmark.</div>'

};
