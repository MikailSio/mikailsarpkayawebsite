/* nlp-new-L6.js — NLP Course Lesson 6: Konu Modelleme — LDA & NMF (TR + EN) */
var NLP_L6 = {

tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=[];g.__nlpChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Etiketsiz binlerce dökümanda hangi <em>konuların</em> gizlendiğini otomatik bulma. Konu modelleme, denetimli sınıflandırmadan farklıdır: önceden etiket yok, model konuları kendisi keşfeder. <strong>Latent Dirichlet Allocation (LDA)</strong> ile temel matematiği, mini bir Trendyol benzeri yorum corpus\'unda her dökümanın hangi konuların karışımı olduğunu, gensim ve sklearn ile uçtan uca uygulama göreceksin.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Denetimsiz konu modelleme ile denetimli sınıflandırma arasındaki farkı tanımlamayı</li>'
+ '<li>LDA\'nın üretici (generative) modelini ve Dirichlet ön dağılımını anlamayı</li>'
+ '<li>gensim ve sklearn ile Trendyol tarzı yorum corpus\'unda LDA eğitmeyi</li>'
+ '<li>Her döküman için konu karışımını ve her konu için en güçlü kelimeleri çıkarmayı</li>'
+ '<li>NMF ve BERTopic gibi modern alternatifleri LDA ile karşılaştırmayı</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Konu Modelleme Nedir?</h2>'

+ '<p class="l-text"><strong>Konu modelleme</strong> (topic modeling), büyük bir döküman koleksiyonundaki gizli temaları (konuları) otomatik keşfeden denetimsiz bir yöntemdir. "Denetimsiz" demek: önceden etiket vermiyoruz, model sadece kelime istatistiklerinden konuları çıkarıyor.</p>'

+ '<p class="l-text">Klasik kullanım senaryosu: bir e-ticaret sitesinin yorum havuzu. 100.000 yorum var, her biri farklı ürün hakkında ama tek bir kategori değil. Hangi konular var? Müşteriler en çok neyi konuşuyor — kargo? Ürün kalitesi? Müşteri hizmetleri? Konu modelleme bunu söyler.</p>'

+ '<div class="calc-example"><div class="example-label">KEŞFEDİLECEK KONU YAPISI</div><div class="example-body">'
+ '<p class="l-text">Trendyol yorumları üzerinde LDA çalıştırılırsa tipik olarak şöyle "konular" bulur (model her konuyu kelime listesi olarak verir):</p>'
+ '<ul class="l-list">'
+ '<li><strong>Konu 1 (Kargo):</strong> kargo, hızlı, geç, paket, kurye, gün</li>'
+ '<li><strong>Konu 2 (Beden/Boyut):</strong> beden, dar, geniş, küçük, büyük, ölçü</li>'
+ '<li><strong>Konu 3 (Kalite):</strong> kalite, kumaş, dayanıklı, ucuz, yıpranmış</li>'
+ '<li><strong>Konu 4 (Memnuniyet):</strong> harika, beğendim, tavsiye, mükemmel, teşekkür</li>'
+ '</ul>'
+ '<p class="l-text">Her dökümanın bu konuların bir karışımı olduğunu varsayıyoruz: bir yorum %60 kargo, %30 beden, %10 memnuniyet olabilir.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Kullanım Alanları</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Yorum analizi:</strong> Müşteriler en çok hangi konuları konuşuyor? Şikayet alanları, övgü alanları.</li>'
+ '<li><strong>Haber ve makale gruplama:</strong> Otomatik kategorilendirme, etiketleme.</li>'
+ '<li><strong>Akademik literatür taraması:</strong> Bir alandaki ana araştırma temalarını görmek.</li>'
+ '<li><strong>Sosyal medya tema tespiti:</strong> Bir hashtag etrafında dönen ana tartışma konuları.</li>'
+ '<li><strong>Müşteri hizmetleri tiketlerinin gruplanması:</strong> En sık karşılaşılan sorun türlerinin keşfi.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. LDA — Sezgi</h2>'

+ '<p class="l-text"><strong>LDA (Latent Dirichlet Allocation)</strong>, Blei, Ng ve Jordan\'ın 2003\'te yayınladığı yöntem, konu modellemenin altın standardı oldu. Sezgi şudur:</p>'

+ '<p class="l-text">Bir yazar bir döküman yazarken şöyle bir hayal kuralım:</p>'

+ '<ol class="l-list">'
+ '<li>Önce kafasında bir <strong>konu karışımı</strong> seçer: "%60 kargo, %30 beden, %10 memnuniyet".</li>'
+ '<li>Her kelimeyi yazarken önce bir konu çeker (yukarıdaki dağılımdan), sonra o konunun <strong>kelime dağılımından</strong> bir kelime seçer.</li>'
+ '<li>Bunu tüm kelimeler için tekrarlar.</li>'
+ '</ol>'

+ '<p class="l-text">LDA\'nın görevi: dökümanları görerek bu süreci tersine çevirmek. Hangi konu karışımları ve konu-kelime dağılımları bu corpus\'u en iyi açıklar?</p>'

+ '<h2 class="l-title">4. LDA\'nın Matematiği</h2>'

+ '<p class="l-text">LDA <strong>üretici</strong> (generative) bir modeldir. Her döküman <em>d</em> ve her kelime <em>w</em> için varsayım:</p>'

+ '<div class="calc-formula"><div class="formula-main"><div class="katex-block">$$\\theta_d \\sim \\text{Dirichlet}(\\alpha) \\quad \\text{(document topic mix)}$$</div></div></div>'

+ '<div class="calc-formula"><div class="formula-main"><div class="katex-block">$$\\phi_k \\sim \\text{Dirichlet}(\\beta) \\quad \\text{(per-topic word distribution)}$$</div></div></div>'

+ '<div class="calc-formula"><div class="formula-main"><div class="katex-block">$$z_{d,n} \\sim \\text{Categorical}(\\theta_d), \\quad w_{d,n} \\sim \\text{Categorical}(\\phi_{z_{d,n}})$$</div></div></div>'

+ '<p class="l-text">Burada:</p>'

+ '<ul class="l-list">'
+ '<li><strong>θ<sub>d</sub></strong> — döküman <em>d</em>\'nin konu dağılımı (mesela [0.6, 0.3, 0.1, 0])</li>'
+ '<li><strong>φ<sub>k</sub></strong> — konu <em>k</em>\'nın kelime dağılımı (kargo konusu için "kargo" yüksek olasılık, "beden" düşük)</li>'
+ '<li><strong>z<sub>d,n</sub></strong> — dökümandaki <em>n</em>\'nci kelimeyi üreten konu</li>'
+ '<li><strong>α, β</strong> — Dirichlet öncüllerinin (priors) hiperparametreleri</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Dirichlet dağılımı</strong> nedir? Olasılık simpleks\'i üzerinde bir dağılım — yani toplamı 1 olan vektörler için bir dağılım. Dirichlet, "bu konu karışımı ne kadar muhtemel?" sorusuna cevap verir. <em>α</em> küçük olduğunda dökümanlar az sayıda konuyu kullanır (sivri); büyük olduğunda her döküman tüm konulardan biraz alır (yumuşak).</p>'

+ '<h2 class="l-title">5. Mini Corpus — 6 Yorum, 3 Konu</h2>'

+ '<p class="l-text">Konuyu somutlaştırmak için küçük bir corpus üzerinde gidelim:</p>'

+ '<div class="calc-example"><div class="example-label">MİNİ CORPUS — 6 YORUM</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ '<strong>Y1:</strong> kargo hızlı geldi paket sağlam'
+ '<br><strong>Y2:</strong> beden çok dar geldi büyük geldi'
+ '<br><strong>Y3:</strong> ürün harika kalite tavsiye ederim'
+ '<br><strong>Y4:</strong> kargo geç geldi paketleme kötü'
+ '<br><strong>Y5:</strong> beden büyük geldi ürün geniş'
+ '<br><strong>Y6:</strong> kalite süper teşekkürler beğendim'
+ '</p>'
+ '<p class="l-text">Sezgisel olarak burada üç konu var: <em>kargo</em>, <em>beden</em>, <em>kalite/memnuniyet</em>. LDA bunu kelime istatistiklerinden çıkarmalı.</p>'
+ '</div></div>'

+ '<p class="l-text">3 konuyla LDA çalıştırınca tipik sonuç:</p>'

+ '<div class="plotly-graph"><div id="plot-topic-words-tr" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["kargo","paket","geldi","beden","dar","büyük","kalite","harika","tavsiye"];'
+ 'var t1={x:k,y:[0.32,0.18,0.22,0.02,0.01,0.04,0.03,0.05,0.04],name:"Konu 1 (Kargo)",type:"bar",marker:{color:T.accent}};'
+ 'var t2={x:k,y:[0.02,0.01,0.05,0.30,0.20,0.18,0.04,0.02,0.01],name:"Konu 2 (Beden)",type:"bar",marker:{color:"rgba(248,113,113,.85)"}};'
+ 'var t3={x:k,y:[0.04,0.02,0.03,0.04,0.01,0.02,0.28,0.22,0.18],name:"Konu 3 (Kalite)",type:"bar",marker:{color:"rgba(167,139,250,.85)"}};'
+ 'var layout={barmode:"group",xaxis:{color:T.text,gridcolor:T.grid},yaxis:{color:T.text,gridcolor:T.grid,title:"Olasılık",tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.08,x:0.5,xanchor:"center"}};'
+ 'if(document.getElementById("plot-topic-words-tr"))Plotly.newPlot("plot-topic-words-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> LDA her konu için bir kelime dağılımı verir. Konu 1 büyük olasılıkları "kargo, paket, geldi"ye atıyor — açıkça kargo konusu. Konu 2 "beden, dar, büyük"e — beden uyumu konusu. Konu 3 "kalite, harika, tavsiye"ye — memnuniyet/kalite konusu. Her konunun kelimeleri okuyarak insan yorumlanabilir bir etiket atanır.</div>'

+ '<h2 class="l-title">6. Çıkarım — Gibbs Sampling vs Variational Inference</h2>'

+ '<p class="l-text">LDA matematiksel olarak güzel ama parametreleri (θ, φ) tam olarak hesaplanamaz — toplamların integralleri çözülemez. Yaklaşık (approximate) yöntemler kullanılır:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Collapsed Gibbs Sampling:</strong> Her kelimeye iteratif olarak konu atar, yakınsayana kadar tekrar eder. Yavaş ama kalitesi yüksek. gensim varsayılan olarak bunu kullanır.</li>'
+ '<li><strong>Variational Inference:</strong> Posterior dağılımı daha basit bir aileyle yaklaşıklar. Hızlı, online (akan veri için) çalışır. sklearn ve gensim\'in <code>LdaModel</code> alternatifi olarak sunulur.</li>'
+ '</ul>'

+ '<h2 class="l-title">7. Python\'da Pratik — gensim ile</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> gensim ile LDA eğitimi</div><div class="code-block"><pre><code><span class="kw">from</span> gensim <span class="kw">import</span> corpora, models'
+ '\n'
+ '\nyorumlar_tokens = ['
+ '\n    [<span class="str">"kargo"</span>, <span class="str">"hızlı"</span>, <span class="str">"geldi"</span>, <span class="str">"paket"</span>, <span class="str">"sağlam"</span>],'
+ '\n    [<span class="str">"beden"</span>, <span class="str">"dar"</span>, <span class="str">"geldi"</span>, <span class="str">"büyük"</span>, <span class="str">"geldi"</span>],'
+ '\n    [<span class="str">"ürün"</span>, <span class="str">"harika"</span>, <span class="str">"kalite"</span>, <span class="str">"tavsiye"</span>],'
+ '\n    [<span class="str">"kargo"</span>, <span class="str">"geç"</span>, <span class="str">"geldi"</span>, <span class="str">"paketleme"</span>, <span class="str">"kötü"</span>],'
+ '\n    [<span class="str">"beden"</span>, <span class="str">"büyük"</span>, <span class="str">"geldi"</span>, <span class="str">"ürün"</span>, <span class="str">"geniş"</span>],'
+ '\n    [<span class="str">"kalite"</span>, <span class="str">"süper"</span>, <span class="str">"teşekkürler"</span>, <span class="str">"beğendim"</span>],'
+ '\n]'
+ '\n'
+ '\n<span class="cm"># Sözlük ve corpus oluştur</span>'
+ '\nsozluk = corpora.<span class="fn">Dictionary</span>(yorumlar_tokens)'
+ '\ncorpus = [sozluk.<span class="fn">doc2bow</span>(t) <span class="kw">for</span> t <span class="kw">in</span> yorumlar_tokens]'
+ '\n'
+ '\n<span class="cm"># LDA eğit</span>'
+ '\nlda = models.<span class="fn">LdaModel</span>('
+ '\n    corpus=corpus,'
+ '\n    id2word=sozluk,'
+ '\n    num_topics=<span class="num">3</span>,'
+ '\n    passes=<span class="num">20</span>,'
+ '\n    random_state=<span class="num">42</span>,'
+ '\n)'
+ '\n'
+ '\n<span class="cm"># Her konunun en bilgili 5 kelimesi</span>'
+ '\n<span class="kw">for</span> i, topic <span class="kw">in</span> lda.<span class="fn">print_topics</span>(num_words=<span class="num">5</span>):'
+ '\n    <span class="fn">print</span>(<span class="str">f"Konu {i}: {topic}"</span>)</code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">`df_reviews` üzerinde sklearn\'in `LatentDirichletAllocation`\'ı ile 3 konu çıkarımı — gensim yerine browser uyumlu LDA.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import CountVectorizer\nfrom sklearn.decomposition import LatentDirichletAllocation\nimport numpy as np\n\ntexts_local = df_reviews[\'text\'].astype(str).str.lower().tolist()[:300]\nvec = CountVectorizer(max_features=500, min_df=3, stop_words=\'english\')\nX = vec.fit_transform(texts_local)               # (docs, vocab) BoW count matrix\nvocab = vec.get_feature_names_out()\n\nlda = LatentDirichletAllocation(n_components=3, learning_method=\'online\', random_state=0, max_iter=15)\nlda.fit(X)\n\n# her konunun en olası 8 kelimesi\nfor k, comp in enumerate(lda.components_):\n    top = np.argsort(comp)[::-1][:8]\n    print(f\'Konu {k}:\', [vocab[i] for i in top])\n\n# bir dökümanın konu karışımı\ndoc_topic = lda.transform(X[:1])\nprint(\'\\nİlk dökümanın konu dağılımı:\', np.round(doc_topic[0], 2))</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Önce token\'lardan bir <code>Dictionary</code> (kelime → id eşlemesi) kurar, ardından her dökümanı (kelime_id, sayı) çiftleri listesine çevirir (BoW formatı). <code>LdaModel</code> 3 konuya bölmeye çalışır, 20 geçişte parametreleri günceller. <code>print_topics</code> her konuyu en yüksek olasılıklı 5 kelimesiyle gösterir — buradan konuyu insan-okunabilir bir etikete çevirebilirsin.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Bir döküman için konu karışımı</div><div class="code-block"><pre><code>yeni_yorum = [<span class="str">"kargo"</span>, <span class="str">"geldi"</span>, <span class="str">"beden"</span>, <span class="str">"büyük"</span>]'
+ '\nbow = sozluk.<span class="fn">doc2bow</span>(yeni_yorum)'
+ '\n'
+ '\nkonular = lda.<span class="fn">get_document_topics</span>(bow)'
+ '\n<span class="fn">print</span>(konular)'
+ '\n<span class="cm"># [(0, 0.42), (1, 0.55), (2, 0.03)]</span>'
+ '\n<span class="cm"># Yorum %42 kargo, %55 beden, %3 kalite konusu</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Yeni bir yorumu önce BoW\'a çevirir, sonra LDA modeline sorar. Çıktı her konunun bu dökümandaki olasılığı. "kargo geldi beden büyük" yorumu hem kargo hem beden konularını içerir — model bunu doğru yansıtır.</p>'

+ '<h2 class="l-title">8. Konu Sayısı Seçimi</h2>'

+ '<p class="l-text">LDA\'nın en kritik hiperparametresi <em>K</em> — konu sayısı. Çok az olursa konular karışık olur, çok fazla olursa anlamsız parçalanmalar olur. İki yaygın yöntem:</p>'

+ '<h3 class="l-subtitle">Coherence skoru</h3>'

+ '<p class="l-text"><strong>Coherence</strong>, bir konudaki en olası kelimelerin gerçekten birlikte sık görünüp görünmediğini ölçer. Yüksek coherence = anlamlı konu. Farklı <em>K</em> değerlerini dene, en yüksek coherence vereni seç.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Coherence ile K seçimi</div><div class="code-block"><pre><code><span class="kw">from</span> gensim.models <span class="kw">import</span> CoherenceModel'
+ '\n'
+ '\nscores = []'
+ '\n<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2</span>, <span class="num">11</span>):'
+ '\n    lda = models.<span class="fn">LdaModel</span>(corpus, id2word=sozluk, num_topics=k, passes=<span class="num">10</span>)'
+ '\n    cm = <span class="fn">CoherenceModel</span>(model=lda, texts=yorumlar_tokens, dictionary=sozluk, coherence=<span class="str">"c_v"</span>)'
+ '\n    scores.<span class="fn">append</span>((k, cm.<span class="fn">get_coherence</span>()))'
+ '\n'
+ '\n<span class="kw">for</span> k, score <span class="kw">in</span> scores:'
+ '\n    <span class="fn">print</span>(<span class="str">f"K={k}: coherence={score:.3f}"</span>)</code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Farklı K değerleriyle sklearn LDA fit edip perplexity karşılaştırması — gensim coherence yerine browser uyumlu proxy.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import CountVectorizer\nfrom sklearn.decomposition import LatentDirichletAllocation\n\ntexts_local = df_reviews[\'text\'].astype(str).str.lower().tolist()[:300]\nvec = CountVectorizer(max_features=500, min_df=3, stop_words=\'english\')\nX = vec.fit_transform(texts_local)\n\nfor k in [2, 3, 4, 5, 6, 8]:\n    lda = LatentDirichletAllocation(n_components=k, learning_method=\'online\', random_state=0, max_iter=10)\n    lda.fit(X)\n    pp = lda.perplexity(X)\n    print(f\'K={k}: perplexity={pp:.1f}\')\n\n# Düşük perplexity her zaman daha iyi konu kalitesi anlamına gelmez —\n# coherence (gensim) veya insan değerlendirmesi ile birlikte yorumla.</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> 2\'den 10\'a kadar farklı konu sayılarıyla LDA eğitir, her birinde coherence (c_v metriği) hesaplar. En yüksek skoru veren <em>K</em> seçilir. Genelde grafiği çizilir — bir "dirsek" noktası en iyi seçenektir.</p>'

+ '<h3 class="l-subtitle">İnsan değerlendirmesi</h3>'

+ '<p class="l-text">Coherence sadece bir ipucu. Sonuçta konuların anlamlı etiketlere dönüşmesi gerek — bu da insan değerlendirmesi gerektirir. Bir konu uzmanına konuların kelime listelerini gösterip "Bu liste sana ne çağrıştırıyor?" sormak en gerçekçi yöntemdir.</p>'

+ '<h2 class="l-title">9. LDA\'nın Sınırları ve Modern Alternatifler</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Kelime sırası kayıp.</strong> LDA BoW\'a dayanır; "kargo geç değil" ile "kargo geç değildi" aynı kelimeleri taşır.</li>'
+ '<li><strong>Sabit kelime dağılımı varsayımı.</strong> Konular zamanla değişir (yeni ürünler, yeni terimler) ama LDA bunu yakalamaz. Dynamic Topic Models (DTM) bu sorunu çözmeye çalışır.</li>'
+ '<li><strong>K\'yı önceden seçmek zorundasın.</strong> Hierarchical Dirichlet Process (HDP) konu sayısını otomatik bulur, ama daha karmaşık.</li>'
+ '<li><strong>Modern alternatif: BERTopic.</strong> Kontekstuel embedding\'lerle (BERT) cümleleri vektörleştirir, kümeler. LDA\'dan kalitatif olarak çok daha iyi sonuçlar verir, özellikle kısa metinlerde (tweet, yorum).</li>'
+ '</ul>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Şimdi denetimsiz olarak gizli temaları çıkarabiliyorsun. Ama ya cümle içindeki <em>her kelimeye</em> bir etiket atamak gerekirse — "Mikail" kişi adı, "İstanbul" yer adı gibi? <a href="/tutorials/nlp/7">Ders 7</a>\'de bu görevi öğreniyoruz: <strong>dizi etiketleme</strong> ve <strong>NER (Named Entity Recognition)</strong>. Konu modelleme döküman seviyesindeydi; NER kelime seviyesinde bir denetimli görev.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Konu modelleme nedir, neden denetimsiz bir görev olduğunu ve hangi gerçek-dünya problemlerinde kullanıldığını öğrendin. LDA\'nın "üretici hikaye" sezgisini, Dirichlet öncülleriyle dökümanların konu karışımı, konuların kelime dağılımı olarak tanımlandığını gördün. Mini corpus üzerinde 3 konunun nasıl ayrıldığını grafiği ile takip ettin. Gibbs sampling ve variational inference iki temel çıkarım yöntemini gördün. gensim ile gerçek kod yazdın, bir dökümanın konu karışımını çıkardın. Coherence skoru ile <em>K</em> seçimini öğrendin. LDA\'nın sınırlarını ve modern alternatif BERTopic\'i tanıdın.</div>'

,

en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> How to discover hidden <em>topics</em> across thousands of unlabelled documents. Topic modelling is unsupervised — no prior labels; the model finds topics on its own. We will cover <strong>Latent Dirichlet Allocation (LDA)</strong>, its math, walk a mini Trendyol-style review corpus end-to-end, and run gensim/sklearn implementations.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Distinguish unsupervised topic modeling from supervised text classification</li>'
+ '<li>Understand the LDA generative model and the Dirichlet prior over topics</li>'
+ '<li>Train an LDA model with gensim and sklearn on a Trendyol-style review corpus</li>'
+ '<li>Extract per-document topic mixtures and per-topic top words</li>'
+ '<li>Compare LDA with modern alternatives like NMF and BERTopic</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. What is Topic Modelling?</h2>'

+ '<p class="l-text"><strong>Topic modelling</strong> is an unsupervised method that automatically discovers latent themes in a large collection of documents. "Unsupervised" means: no labels are given; the model extracts topics from word statistics alone.</p>'

+ '<p class="l-text">Classic use case: a review pool from an e-commerce site. 100,000 reviews, all about different products. What topics are there? What do customers talk about most — shipping? Product quality? Customer service? Topic modelling answers this.</p>'

+ '<div class="calc-example"><div class="example-label">DISCOVERED TOPIC STRUCTURE</div><div class="example-body">'
+ '<p class="l-text">LDA on Trendyol reviews typically finds topics like (each topic is a word distribution):</p>'
+ '<ul class="l-list">'
+ '<li><strong>Topic 1 (Shipping):</strong> shipping, fast, late, package, courier, days</li>'
+ '<li><strong>Topic 2 (Sizing):</strong> size, tight, wide, small, large, fit</li>'
+ '<li><strong>Topic 3 (Quality):</strong> quality, fabric, durable, cheap, worn</li>'
+ '<li><strong>Topic 4 (Satisfaction):</strong> amazing, loved, recommend, perfect, thanks</li>'
+ '</ul>'
+ '<p class="l-text">Each document is assumed to be a mixture of these topics: a review may be 60% shipping, 30% sizing, 10% satisfaction.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Use Cases</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Review analysis:</strong> what do customers talk about most? Areas of complaint vs praise.</li>'
+ '<li><strong>News and article grouping:</strong> automatic categorisation, tagging.</li>'
+ '<li><strong>Academic literature scan:</strong> see the main research themes in a field.</li>'
+ '<li><strong>Social-media topic detection:</strong> what conversation is happening around a hashtag.</li>'
+ '<li><strong>Customer-service ticket clustering:</strong> discover the most common issue types.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. LDA — Intuition</h2>'

+ '<p class="l-text"><strong>LDA (Latent Dirichlet Allocation)</strong>, by Blei, Ng, and Jordan in 2003, became the gold standard for topic modelling. The intuition:</p>'

+ '<p class="l-text">Imagine an author writing a document like this:</p>'

+ '<ol class="l-list">'
+ '<li>First they pick a <strong>topic mixture</strong> in their head: "60% shipping, 30% sizing, 10% satisfaction".</li>'
+ '<li>For each word, they first sample a topic (from the mixture above) and then sample a word from that topic\'s <strong>word distribution</strong>.</li>'
+ '<li>Repeat for every word.</li>'
+ '</ol>'

+ '<p class="l-text">LDA\'s job: invert this process given the documents. Which topic mixtures and which topic-word distributions best explain the corpus?</p>'

+ '<h2 class="l-title">4. The Math of LDA</h2>'

+ '<p class="l-text">LDA is a <strong>generative</strong> model. For each document <em>d</em> and each word <em>w</em>:</p>'

+ '<div class="katex-block">$$\\theta_d \\sim \\text{Dirichlet}(\\alpha) \\quad \\text{(document\'s topic mixture)}$$</div>'

+ '<div class="katex-block">$$\\phi_k \\sim \\text{Dirichlet}(\\beta) \\quad \\text{(each topic\'s word distribution)}$$</div>'

+ '<div class="katex-block">$$z_{d,n} \\sim \\text{Categorical}(\\theta_d), \\quad w_{d,n} \\sim \\text{Categorical}(\\phi_{z_{d,n}})$$</div>'

+ '<p class="l-text">Where:</p>'

+ '<ul class="l-list">'
+ '<li><strong>θ<sub>d</sub></strong> — topic distribution for document <em>d</em> (e.g. [0.6, 0.3, 0.1, 0])</li>'
+ '<li><strong>φ<sub>k</sub></strong> — word distribution for topic <em>k</em> (the shipping topic puts high mass on "shipping", low on "size")</li>'
+ '<li><strong>z<sub>d,n</sub></strong> — the topic that generated the <em>n</em>-th word in the document</li>'
+ '<li><strong>α, β</strong> — Dirichlet prior hyperparameters</li>'
+ '</ul>'

+ '<p class="l-text">The <strong>Dirichlet distribution</strong> is a distribution over the probability simplex — vectors that sum to 1. It models "how plausible is this topic mixture?" Small <em>α</em> makes documents use few topics (peaked); large <em>α</em> spreads topic usage (smooth).</p>'

+ '<h2 class="l-title">5. Mini Corpus — 6 Reviews, 3 Topics</h2>'

+ '<p class="l-text">Let us walk through a concrete tiny corpus:</p>'

+ '<div class="calc-example"><div class="example-label">MINI CORPUS — 6 REVIEWS</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ '<strong>R1:</strong> shipping fast came package solid'
+ '<br><strong>R2:</strong> size very tight came large came'
+ '<br><strong>R3:</strong> product amazing quality recommend'
+ '<br><strong>R4:</strong> shipping late came packaging bad'
+ '<br><strong>R5:</strong> size large came product wide'
+ '<br><strong>R6:</strong> quality super thanks loved'
+ '</p>'
+ '<p class="l-text">Intuitively three topics: <em>shipping</em>, <em>sizing</em>, <em>quality/satisfaction</em>. LDA must extract this from word statistics.</p>'
+ '</div></div>'

+ '<p class="l-text">Running LDA with 3 topics typically yields:</p>'

+ '<div class="plotly-graph"><div id="plot-topic-words-en" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["shipping","package","came","size","tight","large","quality","amazing","recommend"];'
+ 'var t1={x:k,y:[0.32,0.18,0.22,0.02,0.01,0.04,0.03,0.05,0.04],name:"Topic 1 (Shipping)",type:"bar",marker:{color:T.accent}};'
+ 'var t2={x:k,y:[0.02,0.01,0.05,0.30,0.20,0.18,0.04,0.02,0.01],name:"Topic 2 (Sizing)",type:"bar",marker:{color:"rgba(248,113,113,.85)"}};'
+ 'var t3={x:k,y:[0.04,0.02,0.03,0.04,0.01,0.02,0.28,0.22,0.18],name:"Topic 3 (Quality)",type:"bar",marker:{color:"rgba(167,139,250,.85)"}};'
+ 'var layout={barmode:"group",xaxis:{color:T.text,gridcolor:T.grid},yaxis:{color:T.text,gridcolor:T.grid,title:"Probability",tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.08,x:0.5,xanchor:"center"}};'
+ 'if(document.getElementById("plot-topic-words-en"))Plotly.newPlot("plot-topic-words-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> LDA outputs a word distribution per topic. Topic 1 places high probability on "shipping, package, came" — clearly the shipping topic. Topic 2 on "size, tight, large" — the sizing topic. Topic 3 on "quality, amazing, recommend" — satisfaction. Reading each topic\'s top words you assign a human-interpretable label.</div>'

+ '<h2 class="l-title">6. Inference — Gibbs Sampling vs Variational Inference</h2>'

+ '<p class="l-text">LDA is mathematically clean but its parameters (θ, φ) cannot be computed exactly — the integrals are intractable. We use approximate methods:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Collapsed Gibbs Sampling:</strong> iteratively assigns a topic to each word, repeats until convergence. Slow, high quality. The default in gensim.</li>'
+ '<li><strong>Variational Inference:</strong> approximates the posterior with a simpler family. Fast, online (good for streaming data). sklearn and gensim both offer it.</li>'
+ '</ul>'

+ '<h2 class="l-title">7. Python Practice — gensim</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> LDA training with gensim</div><div class="code-block"><pre><code><span class="kw">from</span> gensim <span class="kw">import</span> corpora, models'
+ '\n'
+ '\nreviews_tokens = ['
+ '\n    [<span class="str">"shipping"</span>, <span class="str">"fast"</span>, <span class="str">"came"</span>, <span class="str">"package"</span>, <span class="str">"solid"</span>],'
+ '\n    [<span class="str">"size"</span>, <span class="str">"tight"</span>, <span class="str">"came"</span>, <span class="str">"large"</span>, <span class="str">"came"</span>],'
+ '\n    [<span class="str">"product"</span>, <span class="str">"amazing"</span>, <span class="str">"quality"</span>, <span class="str">"recommend"</span>],'
+ '\n    [<span class="str">"shipping"</span>, <span class="str">"late"</span>, <span class="str">"came"</span>, <span class="str">"packaging"</span>, <span class="str">"bad"</span>],'
+ '\n    [<span class="str">"size"</span>, <span class="str">"large"</span>, <span class="str">"came"</span>, <span class="str">"product"</span>, <span class="str">"wide"</span>],'
+ '\n    [<span class="str">"quality"</span>, <span class="str">"super"</span>, <span class="str">"thanks"</span>, <span class="str">"loved"</span>],'
+ '\n]'
+ '\n'
+ '\n<span class="cm"># Build dictionary and corpus</span>'
+ '\nvocab = corpora.<span class="fn">Dictionary</span>(reviews_tokens)'
+ '\ncorpus = [vocab.<span class="fn">doc2bow</span>(t) <span class="kw">for</span> t <span class="kw">in</span> reviews_tokens]'
+ '\n'
+ '\n<span class="cm"># Train LDA</span>'
+ '\nlda = models.<span class="fn">LdaModel</span>('
+ '\n    corpus=corpus,'
+ '\n    id2word=vocab,'
+ '\n    num_topics=<span class="num">3</span>,'
+ '\n    passes=<span class="num">20</span>,'
+ '\n    random_state=<span class="num">42</span>,'
+ '\n)'
+ '\n'
+ '\n<span class="cm"># Top-5 words per topic</span>'
+ '\n<span class="kw">for</span> i, topic <span class="kw">in</span> lda.<span class="fn">print_topics</span>(num_words=<span class="num">5</span>):'
+ '\n    <span class="fn">print</span>(<span class="str">f"Topic {i}: {topic}"</span>)</code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Run 3-topic LDA on `df_reviews` using sklearn\'s `LatentDirichletAllocation` — browser-friendly drop-in for gensim.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import CountVectorizer\nfrom sklearn.decomposition import LatentDirichletAllocation\nimport numpy as np\n\ntexts_local = df_reviews[\'text\'].astype(str).str.lower().tolist()[:300]\nvec = CountVectorizer(max_features=500, min_df=3, stop_words=\'english\')\nX = vec.fit_transform(texts_local)               # (docs, vocab) BoW count matrix\nvocab = vec.get_feature_names_out()\n\nlda = LatentDirichletAllocation(n_components=3, learning_method=\'online\', random_state=0, max_iter=15)\nlda.fit(X)\n\n# top-8 words per topic\nfor k, comp in enumerate(lda.components_):\n    top = np.argsort(comp)[::-1][:8]\n    print(f\'Topic {k}:\', [vocab[i] for i in top])\n\n# topic mixture for one document\ndoc_topic = lda.transform(X[:1])\nprint(\'\\nDoc-0 topic mixture:\', np.round(doc_topic[0], 2))</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> First builds a <code>Dictionary</code> (token → id) from the corpus, then converts each document to a list of (id, count) pairs (BoW format). <code>LdaModel</code> partitions into 3 topics, updating parameters over 20 passes. <code>print_topics</code> prints each topic with its top-probability words — you read these to assign a human label.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Topic mixture for a single document</div><div class="code-block"><pre><code>new_review = [<span class="str">"shipping"</span>, <span class="str">"came"</span>, <span class="str">"size"</span>, <span class="str">"large"</span>]'
+ '\nbow = vocab.<span class="fn">doc2bow</span>(new_review)'
+ '\n'
+ '\ntopics = lda.<span class="fn">get_document_topics</span>(bow)'
+ '\n<span class="fn">print</span>(topics)'
+ '\n<span class="cm"># [(0, 0.42), (1, 0.55), (2, 0.03)]</span>'
+ '\n<span class="cm"># Review is 42% shipping, 55% sizing, 3% quality</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Converts a new review to BoW and queries the LDA model. The output is the topic distribution for this document. "shipping came size large" mixes shipping and sizing — the model captures it correctly.</p>'

+ '<h2 class="l-title">8. Choosing the Number of Topics</h2>'

+ '<p class="l-text">LDA\'s key hyperparameter is <em>K</em> — the number of topics. Too few and topics are mixed; too many and we get nonsensical splits. Two common methods:</p>'

+ '<h3 class="l-subtitle">Coherence score</h3>'

+ '<p class="l-text"><strong>Coherence</strong> measures whether a topic\'s top words actually co-occur in the corpus. High coherence = meaningful topic. Try multiple <em>K</em> values and pick the one with the highest coherence.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Picking K via coherence</div><div class="code-block"><pre><code><span class="kw">from</span> gensim.models <span class="kw">import</span> CoherenceModel'
+ '\n'
+ '\nscores = []'
+ '\n<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2</span>, <span class="num">11</span>):'
+ '\n    lda = models.<span class="fn">LdaModel</span>(corpus, id2word=vocab, num_topics=k, passes=<span class="num">10</span>)'
+ '\n    cm = <span class="fn">CoherenceModel</span>(model=lda, texts=reviews_tokens, dictionary=vocab, coherence=<span class="str">"c_v"</span>)'
+ '\n    scores.<span class="fn">append</span>((k, cm.<span class="fn">get_coherence</span>()))'
+ '\n'
+ '\n<span class="kw">for</span> k, score <span class="kw">in</span> scores:'
+ '\n    <span class="fn">print</span>(<span class="str">f"K={k}: coherence={score:.3f}"</span>)</code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sweep `n_components` with sklearn LDA and compare perplexity — browser-friendly proxy for gensim coherence.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import CountVectorizer\nfrom sklearn.decomposition import LatentDirichletAllocation\n\ntexts_local = df_reviews[\'text\'].astype(str).str.lower().tolist()[:300]\nvec = CountVectorizer(max_features=500, min_df=3, stop_words=\'english\')\nX = vec.fit_transform(texts_local)\n\nfor k in [2, 3, 4, 5, 6, 8]:\n    lda = LatentDirichletAllocation(n_components=k, learning_method=\'online\', random_state=0, max_iter=10)\n    lda.fit(X)\n    pp = lda.perplexity(X)\n    print(f\'K={k}: perplexity={pp:.1f}\')\n\n# Lower perplexity does not always mean better topics —\n# pair with coherence (gensim) or human evaluation.</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Trains LDA with topic counts from 2 to 10 and computes coherence (c_v metric) for each. Pick the <em>K</em> with the highest score. Usually plotted — the "elbow" or peak is the best choice.</p>'

+ '<h3 class="l-subtitle">Human evaluation</h3>'

+ '<p class="l-text">Coherence is only a hint. Topics ultimately need to map to meaningful labels — and that requires human judgement. Showing the topic word lists to a domain expert and asking "what does this list suggest?" is the most reliable method.</p>'

+ '<h2 class="l-title">9. Limits of LDA and Modern Alternatives</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Word order is lost.</strong> LDA is BoW-based; "shipping was not late" and "shipping was late" share words.</li>'
+ '<li><strong>Static word distributions.</strong> Topics drift over time (new products, new terms) — LDA does not capture this. Dynamic Topic Models (DTM) try to fix it.</li>'
+ '<li><strong>You must pick K in advance.</strong> Hierarchical Dirichlet Process (HDP) finds the topic count automatically but is more complex.</li>'
+ '<li><strong>Modern alternative: BERTopic.</strong> Uses contextual (BERT) embeddings to vectorise sentences and clusters them. Qualitatively much better than LDA, especially on short texts (tweets, reviews).</li>'
+ '</ul>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">You can now extract latent themes without any labels. But what if we need a label on <em>each word</em> in a sentence — "Mikail" as a person, "Istanbul" as a location? <a href="/tutorials/nlp/7">Lesson 7</a> covers this task: <strong>sequence labelling</strong> and <strong>NER (Named Entity Recognition)</strong>. Topic modelling worked at the document level; NER is a supervised, word-level task.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> What topic modelling is and why it is unsupervised. The "generative story" intuition behind LDA — documents as topic mixtures, topics as word distributions, all generated under Dirichlet priors. You followed three topics emerging on a tiny corpus. You saw Gibbs sampling vs variational inference. You wrote real code with gensim and computed a document\'s topic mixture. You learned how to pick K with coherence. You met LDA\'s limits and the modern alternative BERTopic.</div>'

};
