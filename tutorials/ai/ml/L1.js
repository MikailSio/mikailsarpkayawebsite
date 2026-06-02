/* ml-L1.js — ML Theory Lesson 1: Makine Öğrenmesi Nedir? (TR + EN) */
var ML_L1 = {

tr:
'<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div><p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p><ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none"><li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrisler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L72)</span></li><li><a href="/tutorials/matematik/94" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Olasılık Temelleri</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L94)</span></li><li><a href="/tutorials/matematik/97" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Bayes Teoremi</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L97)</span></li><li><a href="/tutorials/matematik/101" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Beklenen Değer</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L101)</span></li></ul></div><script>(function(){var g=window;g.__mlChartDrawers=[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Makine öğrenmesi nedir, geleneksel programlamadan nasıl ayrılır, hangi türleri vardır. Tüm kurs boyunca takip edeceğimiz tek bir somut örnek tanıtılır: <em>bir telekom şirketinin müşteri kayıp (churn) tahmini</em>. Bu örnek bir veri seti üzerinden L2\'de regresyon, L3\'te sınıflandırma, L8\'de kümeleme, L9\'da boyut indirgeme — hepsini görüp birbirine bağlayacağız.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>ML\'i geleneksel kural-tabanlı programlamadan veri ⟶ kural perspektifiyle ayıracaksın</li><li>Telekom churn problemini bütün kursun örneği olarak çerçeveleyeceksin</li><li>Sayısal ve kategorik öznitelikleri ve hedef değişkenini tanımlayacaksın</li><li>Supervised, unsupervised ve reinforcement learning türlerini ayırt edeceksin</li><li>Veriden modele 7 adımlık ML iş akışını uygulayacaksın</li></ul></div>'

+ '<h2 class="l-title">1. Makine Öğrenmesi Nedir?</h2>'

+ '<p class="l-text"><strong>Makine öğrenmesi (ML)</strong>, bir bilgisayara <em>kuralları yazmadan</em> bir görevi yapmasını öğretmenin yöntemleridir. Geleneksel programlamada <em>"eğer X ise Y yap"</em> kurallarını biz yazarız; ML\'de modele örnekler veririz, kuralları o kendi çıkarır.</p>'

+ '<div class="calc-example"><div class="example-label">GELENEKSEL PROGRAMLAMA vs ML</div><div class="example-body">'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ '<strong>Geleneksel:</strong> Veri + Kurallar &nbsp;⟶&nbsp; Cevap'
+ '<br><strong>ML:</strong> Veri + Cevaplar &nbsp;⟶&nbsp; Kurallar (model)'
+ '</p>'
+ '<p class="l-text">Telekom örneğinde: "müşterinin abonelikten ayrılıp ayrılmayacağını tahmin et" görevi. Geleneksel yöntem için onlarca kuralı el ile yazmamız gerekirdi (yaş > 60 ve aylık ücret > 100 ise ... gibi). ML ise binlerce müşteri kaydından — hangileri ayrıldı, hangileri kaldı — kuralları kendi öğrenir.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Müşteri Kayıp Problemi — Tüm Kursun Örneği</h2>'

+ '<p class="l-text">Bütün ML derslerini tek bir gerçek dünya problemi üzerinden gideceğiz: <strong>müşteri kayıp (churn) tahmini</strong>. Bir telekom şirketinin müşteri verisini düşün — yaş, aylık ücret, sözleşme tipi, kullanım süresi vb. Bu özelliklere bakarak müşterinin yakında abonelikten ayrılıp ayrılmayacağını tahmin etmek istiyoruz.</p>'

+ '<div class="calc-example"><div class="example-label">MİNİ VERİ SETİ — 6 MÜŞTERİ</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Müşteri</th><th style="padding:.5rem">Yaş</th><th style="padding:.5rem">Ay/Ücret (TL)</th><th style="padding:.5rem">Süre (ay)</th><th style="padding:.5rem">Sözleşme</th><th style="padding:.5rem">Kayıp?</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">M1</td><td style="text-align:center">28</td><td style="text-align:center">120</td><td style="text-align:center">14</td><td style="text-align:center">Aylık</td><td style="text-align:center">Hayır</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">M2</td><td style="text-align:center">62</td><td style="text-align:center">220</td><td style="text-align:center">3</td><td style="text-align:center">Aylık</td><td style="text-align:center">Evet</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">M3</td><td style="text-align:center">35</td><td style="text-align:center">85</td><td style="text-align:center">36</td><td style="text-align:center">2 yıl</td><td style="text-align:center">Hayır</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">M4</td><td style="text-align:center">48</td><td style="text-align:center">180</td><td style="text-align:center">2</td><td style="text-align:center">Aylık</td><td style="text-align:center">Evet</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">M5</td><td style="text-align:center">31</td><td style="text-align:center">95</td><td style="text-align:center">22</td><td style="text-align:center">1 yıl</td><td style="text-align:center">Hayır</td></tr>'
+ '<tr><td style="padding:.4rem">M6</td><td style="text-align:center">55</td><td style="text-align:center">240</td><td style="text-align:center">5</td><td style="text-align:center">Aylık</td><td style="text-align:center">Evet</td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text" style="margin-top:1rem">Sezgisel olarak şu örüntüyü görebilirsin: yüksek aylık ücret + kısa süre + aylık sözleşme → kayıp olasılığı yüksek. Uzun süreli sözleşmesi olanlar daha az ayrılıyor. ML modeli işte bu örüntüyü otomatik çıkarmaya çalışacak.</p>'
+ '</div></div>'

+ '<h2 class="l-title">3. Veri Türleri — Özellikler ve Hedef</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Özellikler (features):</strong> Modelin <em>girdi</em> olarak kullandığı sütunlar. Yukarıda yaş, ücret, süre, sözleşme tipi.</li>'
+ '<li><strong>Hedef (target/label):</strong> Modelin <em>tahmin etmek istediği</em> sütun. Yukarıda "Kayıp?". Y harfi ile gösterilir.</li>'
+ '<li><strong>Sayısal (numerical):</strong> Yaş, ücret, süre — gerçek sayı.</li>'
+ '<li><strong>Kategorik (categorical):</strong> Sözleşme tipi (Aylık / 1 yıl / 2 yıl) — sınırlı sayıda etiket.</li>'
+ '<li><strong>İkili (binary):</strong> Kayıp evet/hayır — 0/1.</li>'
+ '</ul>'

+ '<p class="l-text">Veri matrisini matematiksel olarak şöyle gösteririz: <em>X</em> özellik matrisi (n satır × p sütun), <em>y</em> hedef vektörü (n eleman):</p>'

+ '<div class="katex-block">$$X \\in \\mathbb{R}^{n \\times p}, \\quad y \\in \\mathbb{R}^n \\text{ (regression)} \\text{ or } y \\in \\{0, 1\\}^n \\text{ (classification)}$$</div>'

+ '<h2 class="l-title">4. Üç Ana ML Türü</h2>'

+ '<h3 class="l-subtitle">Denetimli öğrenme (supervised)</h3>'

+ '<p class="l-text">Modele örnekleri <strong>etiketleriyle</strong> veririz: "bu müşteri ayrıldı, bu kalmıştı". Model girdiden çıktıya eşlemeyi öğrenir. Bu kursun büyük kısmı denetimli (L2-L7).</p>'

+ '<ul class="l-list">'
+ '<li><strong>Regresyon:</strong> Hedef sürekli sayı. <em>"Bu müşterinin gelecek 12 ayda toplam ne kadar ödeme yapması beklenir?"</em> → 1240 TL gibi.</li>'
+ '<li><strong>Sınıflandırma:</strong> Hedef kategori. <em>"Bu müşteri kayıp mı?"</em> → Evet/Hayır.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Denetimsiz öğrenme (unsupervised)</h3>'

+ '<p class="l-text">Etiket yok. Model verideki <em>yapıyı kendi keşfeder</em>: "bu müşteriler birbirine benziyor", "bu özellikler birlikte hareket ediyor". L8 (clustering) ve L9 (boyut indirgeme) bunu işler.</p>'

+ '<h3 class="l-subtitle">Pekiştirmeli öğrenme (reinforcement)</h3>'

+ '<p class="l-text">Bir ajan ortamla etkileşip <em>ödüller</em> alır, doğru kararları öğrenir. Oyun oynayan AI\'lar (AlphaGo), robotik, otonom araçlar. Bu kursta detaylanmaz ama kavramı bilmek önemli.</p>'

+ '<h2 class="l-title">5. ML İş Akışı — 7 Adım</h2>'

+ '<p class="l-text">Bir ML projesi şu sırayla ilerler. Her ders bu akışın farklı parçalarını derinleştirir.</p>'

+ '<ol class="l-list">'
+ '<li><strong>Problem tanımı:</strong> Ne tahmin edeceğiz? Başarı nasıl ölçülür?</li>'
+ '<li><strong>Veri toplama:</strong> Müşteri kayıtları, kullanım logları.</li>'
+ '<li><strong>Veri keşfi & temizleme:</strong> Eksik değerler, aykırılıklar, dağılımlar (L10).</li>'
+ '<li><strong>Özellik mühendisliği:</strong> Yeni sütunlar türet (L10).</li>'
+ '<li><strong>Model eğitimi:</strong> Algoritma seç, eğit (L2-L7).</li>'
+ '<li><strong>Değerlendirme:</strong> Model ne kadar iyi? (L4-L5)</li>'
+ '<li><strong>Üretim:</strong> Modeli sisteme entegre et, izle (L11).</li>'
+ '</ol>'

+ '<h2 class="l-title">6. Modelin "Öğrenmesi" Ne Demek?</h2>'

+ '<p class="l-text">"Öğrenme" sözcüğü romantiktir; aslında çok somut bir matematiksel iştir. Bir model, bir <strong>parametreler</strong> kümesi (örneğin lineer regresyonda ağırlık vektörü <em>w</em>) ve bu parametrelere göre tahmin yapan bir <strong>fonksiyon</strong> (<em>f(x; w)</em>) içerir. Eğitim, bu parametreleri öyle ayarlamaktır ki model verideki örüntüyü iyi yakalasın.</p>'

+ '<p class="l-text">Bunu ölçen şey <strong>kayıp fonksiyonu</strong>dur (<em>L</em>): tahminin gerçek değerden ne kadar saptığını sayısallaştırır.</p>'

+ '<div class="katex-block">$$\\hat{y} = f(x; w), \\qquad \\mathcal{L}(w) = \\frac{1}{n}\\sum_{i=1}^{n} \\ell\\bigl(\\hat{y}_i, y_i\\bigr)$$</div>'

+ '<p class="l-text">Eğitim, kaybı minimize eden <em>w</em>\'yi bulmaktır. Bu genelde <strong>gradyan iniş</strong> ile yapılır — sonraki derslerde detaylı.</p>'

+ '<h2 class="l-title">7. Geleneksel ML vs Derin Öğrenme — Ne Zaman Hangisi?</h2>'

+ '<p class="l-text">Hem klasik ML (Random Forest, XGBoost gibi) hem derin öğrenme (sinir ağları, transformerlar) güçlü araçlardır. Hangisini seçeceğin veri tipine ve büyüklüğüne bağlıdır:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Tablo verisi (müşteri kayıp gibi sütunlu):</strong> XGBoost, Random Forest sıkça en iyi. Klasik ML burada güçlü.</li>'
+ '<li><strong>Görüntü, ses, metin:</strong> Derin öğrenme açık ara önde (CNN, RNN, Transformer). NLP kursumuzun konusu.</li>'
+ '<li><strong>Az veri (küçük dataset):</strong> Klasik ML genelde daha iyi genelleme yapar; DL aşırı öğrenmeye eğilimli.</li>'
+ '<li><strong>Çok büyük veri:</strong> DL ölçeklenir, klasik ML doygunluğa ulaşır.</li>'
+ '</ul>'

+ '<p class="l-text">Bu kursta klasik ML\'i öğreniyoruz; derin öğrenme için Deep Learning kursuna gidebilirsin.</p>'

+ '<div class="plotly-graph"><div id="plot-mldl-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var sizes=[100,1000,10000,100000,1000000,10000000];'
+ 'var classical=[0.55,0.72,0.83,0.87,0.88,0.88];'
+ 'var dl=[0.40,0.55,0.78,0.88,0.93,0.96];'
+ 'var t1={x:sizes,y:classical,name:"Klasik ML",type:"scatter",mode:"lines+markers",line:{color:T.accent,width:3}};'
+ 'var t2={x:sizes,y:dl,name:"Derin Öğrenme",type:"scatter",mode:"lines+markers",line:{color:"rgba(248,113,113,.85)",width:3,dash:"dash"}};'
+ 'var layout={title:{text:"Veri büyüklüğü vs model performansı (sezgisel)",font:{color:T.text,size:13}},xaxis:{title:"Eğitim örnek sayısı",color:T.text,gridcolor:T.grid,type:"log"},yaxis:{title:"Doğruluk (yaklaşık)",color:T.text,gridcolor:T.grid,range:[0.3,1.0],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-mldl-tr"))Plotly.newPlot("plot-mldl-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Klasik ML küçük-orta veride (1.000-100.000 örnek) çok rekabetçi, sonra doygunluğa ulaşır. Derin öğrenme küçük veride zayıf ama veri büyüdükçe sürekli iyileşir. Telekom müşteri kayıp problemi tipik tablo verisi ve genelde 50.000-500.000 örnek aralığında — bu yüzden klasik ML çoğunlukla en iyi seçim.</div>'

+ '<h2 class="l-title">8. ML\'in Gerçek Dünya Kullanım Alanları</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Finans:</strong> Kredi onay/red, dolandırıcılık tespiti, hisse senedi tahmini.</li>'
+ '<li><strong>Sağlık:</strong> Hastalık tanısı, ilaç keşfi, MR/röntgen analizi.</li>'
+ '<li><strong>E-ticaret:</strong> Ürün önerme, fiyat optimizasyonu, müşteri segmentasyonu.</li>'
+ '<li><strong>Telekom (bizim örnek):</strong> Kayıp tahmini, ağ optimizasyonu, çağrı yönlendirme.</li>'
+ '<li><strong>Üretim:</strong> Bakım planlaması (predictive maintenance), kalite kontrol.</li>'
+ '<li><strong>Lojistik:</strong> Rota optimizasyonu, talep tahmini, depo yönetimi.</li>'
+ '<li><strong>Tarım:</strong> Verim tahmini, hastalık tespiti, sulama optimizasyonu.</li>'
+ '</ul>'

+ '<h2 class="l-title">9. Etik ve Sorumluluk — Kısa Not</h2>'

+ '<p class="l-text">ML modelleri insanları etkileyen kararlar verir: kredi onayı, iş başvurusu, hatta tıbbi tanı. Bu karar mekanizmasının bazı sorumlulukları vardır:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Veri yanlılığı:</strong> Eğitim verisindeki önyargılar modele yansır. Erkek ağırlıklı bir mühendis veri setinde eğitilen "iyi mühendis" modeli kadın adayları cezalandırabilir.</li>'
+ '<li><strong>Açıklanabilirlik:</strong> Model neden bu kararı verdi? Karmaşık modeller (deep nets, XGBoost) "kara kutu" olabilir; açıklamak için ayrı yöntemler (SHAP, LIME) gerekir.</li>'
+ '<li><strong>Adalet metrikleri:</strong> Modelin demografik gruplara göre performansı eşit mi? Cinsiyete, yaşa, gelire göre.</li>'
+ '<li><strong>Mahremiyet:</strong> Eğitim verisindeki kişisel bilgi sızabilir mi?</li>'
+ '</ul>'

+ '<p class="l-text">L11\'de (MLOps & Üretim) bu konuların pratik tarafına geri döneceğiz.</p>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Müşteri kayıp problemini tanıdık, ML\'in temel kavramlarını gördük. Şimdi gerçek bir ML algoritmasıyla başlayalım: <a href="/tutorials/ai/ml/linear-regression">Ders 2 — Lineer Regresyon</a>. Müşterinin gelecek 12 ayda ne kadar ödeyeceğini tahmin edeceğiz. Bu, en basit ama en temel öğrenme algoritmasıdır; gradyan iniş, MSE kaybı, polinom genişletme gibi her ML algoritmasında karşımıza çıkacak fikirleri öğreneceğiz.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> ML\'in geleneksel programlamadan farkını (kuralları yazma yerine örneklerden öğrenme) anladın. Müşteri kayıp problemini ve mini veri setimizi tanıdın — bu örnek tüm 14 ders boyunca rehberin olacak. Özellik/hedef ayrımını, sayısal/kategorik veri türlerini öğrendin. Üç ML türünü (denetimli, denetimsiz, pekiştirmeli) ve denetimliyi alt-bölen regresyon/sınıflandırma ayrımını gördün. ML iş akışının 7 adımını öğrendin. Modelin "öğrenmesi"nin parametre + kayıp fonksiyonu + minimizasyon olduğunu kavradın. Klasik ML ile derin öğrenmenin ne zaman tercih edildiğini öğrendin. ML\'in gerçek dünya kullanımını ve etik sorumlulukları kısaca tanıdın.</div>'

,

en:
'<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div><p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p><ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none"><li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrices</a> <span style="opacity:0.55;font-size:0.82em">(Math L72)</span></li><li><a href="/tutorials/matematik/94" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Probability Basics</a> <span style="opacity:0.55;font-size:0.82em">(Math L94)</span></li><li><a href="/tutorials/matematik/97" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Bayes\' Theorem</a> <span style="opacity:0.55;font-size:0.82em">(Math L97)</span></li><li><a href="/tutorials/matematik/101" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Expected Value &amp; Variance</a> <span style="opacity:0.55;font-size:0.82em">(Math L101)</span></li></ul></div><script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> What machine learning is, how it differs from traditional programming, and the main types. We introduce a single concrete example we will follow across the entire course: <em>predicting customer churn for a telecom company</em>. Through this dataset you will see regression in L2, classification in L3, clustering in L8, dimensionality reduction in L9 — all connected.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Distinguish ML from rule-based programming with the data-to-rules perspective</li><li>Frame the telecom churn problem as the running example for the whole course</li><li>Identify numerical and categorical features and the target variable</li><li>Tell apart supervised, unsupervised, and reinforcement learning</li><li>Apply the 7-step ML workflow from raw data to a deployed model</li></ul></div>'

+ '<h2 class="l-title">1. What is Machine Learning?</h2>'

+ '<p class="l-text"><strong>Machine learning (ML)</strong> is the set of methods to teach a computer to perform a task <em>without writing the rules</em>. In traditional programming we write rules like "if X then Y"; in ML we provide examples and the model derives the rules itself.</p>'

+ '<div class="calc-example"><div class="example-label">TRADITIONAL PROGRAMMING vs ML</div><div class="example-body">'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ '<strong>Traditional:</strong> Data + Rules &nbsp;⟶&nbsp; Answer'
+ '<br><strong>ML:</strong> Data + Answers &nbsp;⟶&nbsp; Rules (a model)'
+ '</p>'
+ '<p class="l-text">For the telecom example: the task is "predict whether the customer will leave their subscription". The traditional approach would require writing dozens of rules by hand (if age > 60 and monthly fee > 100 then ...). ML instead learns the rules from thousands of customer records — who left, who stayed.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. The Customer Churn Problem — Our Running Example</h2>'

+ '<p class="l-text">We will follow the entire ML course through one real-world problem: <strong>customer churn prediction</strong>. Imagine a telecom company\'s customer data — age, monthly fee, contract type, tenure, etc. From these features we want to predict whether a customer will soon cancel.</p>'

+ '<div class="calc-example"><div class="example-label">MINI DATASET — 6 CUSTOMERS</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Customer</th><th style="padding:.5rem">Age</th><th style="padding:.5rem">Monthly Fee</th><th style="padding:.5rem">Tenure (mo)</th><th style="padding:.5rem">Contract</th><th style="padding:.5rem">Churn?</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">C1</td><td style="text-align:center">28</td><td style="text-align:center">$30</td><td style="text-align:center">14</td><td style="text-align:center">Monthly</td><td style="text-align:center">No</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">C2</td><td style="text-align:center">62</td><td style="text-align:center">$55</td><td style="text-align:center">3</td><td style="text-align:center">Monthly</td><td style="text-align:center">Yes</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">C3</td><td style="text-align:center">35</td><td style="text-align:center">$22</td><td style="text-align:center">36</td><td style="text-align:center">2-year</td><td style="text-align:center">No</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">C4</td><td style="text-align:center">48</td><td style="text-align:center">$45</td><td style="text-align:center">2</td><td style="text-align:center">Monthly</td><td style="text-align:center">Yes</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.4rem">C5</td><td style="text-align:center">31</td><td style="text-align:center">$24</td><td style="text-align:center">22</td><td style="text-align:center">1-year</td><td style="text-align:center">No</td></tr>'
+ '<tr><td style="padding:.4rem">C6</td><td style="text-align:center">55</td><td style="text-align:center">$60</td><td style="text-align:center">5</td><td style="text-align:center">Monthly</td><td style="text-align:center">Yes</td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text" style="margin-top:1rem">Intuitively a pattern emerges: high monthly fee + short tenure + monthly contract → high churn risk. Customers on long contracts churn less. The ML model will try to extract exactly this kind of pattern automatically.</p>'
+ '</div></div>'

+ '<h2 class="l-title">3. Data Types — Features and Target</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Features:</strong> the columns the model uses as <em>input</em>. Above: age, fee, tenure, contract type.</li>'
+ '<li><strong>Target / label:</strong> the column the model <em>predicts</em>. Above: "Churn?". Denoted Y.</li>'
+ '<li><strong>Numerical:</strong> age, fee, tenure — real numbers.</li>'
+ '<li><strong>Categorical:</strong> contract type (Monthly / 1-year / 2-year) — finite labels.</li>'
+ '<li><strong>Binary:</strong> churn yes/no — 0/1.</li>'
+ '</ul>'

+ '<p class="l-text">Mathematically: <em>X</em> is the feature matrix (n rows × p columns), <em>y</em> is the target vector (n elements):</p>'

+ '<div class="katex-block">$$X \\in \\mathbb{R}^{n \\times p}, \\quad y \\in \\mathbb{R}^n \\text{ (regression)} \\text{ or } y \\in \\{0, 1\\}^n \\text{ (classification)}$$</div>'

+ '<h2 class="l-title">4. The Three Main Types of ML</h2>'

+ '<h3 class="l-subtitle">Supervised learning</h3>'

+ '<p class="l-text">We give the model examples <strong>with labels</strong>: "this customer churned, this one stayed". The model learns the input→output mapping. Most of this course is supervised (L2-L7).</p>'

+ '<ul class="l-list">'
+ '<li><strong>Regression:</strong> target is a continuous number. <em>"How much will this customer spend over the next 12 months?"</em> → $1,240.</li>'
+ '<li><strong>Classification:</strong> target is a category. <em>"Will this customer churn?"</em> → Yes/No.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Unsupervised learning</h3>'

+ '<p class="l-text">No labels. The model discovers <em>structure</em> in the data on its own: "these customers are similar", "these features move together". L8 (clustering) and L9 (dimensionality reduction) cover this.</p>'

+ '<h3 class="l-subtitle">Reinforcement learning</h3>'

+ '<p class="l-text">An agent interacts with an environment, receives <em>rewards</em>, and learns the right decisions. Game-playing AIs (AlphaGo), robotics, autonomous vehicles. Not detailed in this course but important to know exists.</p>'

+ '<h2 class="l-title">5. The ML Workflow — 7 Steps</h2>'

+ '<p class="l-text">An ML project usually follows this sequence. Each lesson dives into different parts.</p>'

+ '<ol class="l-list">'
+ '<li><strong>Problem framing:</strong> what are we predicting? How is success measured?</li>'
+ '<li><strong>Data collection:</strong> customer records, usage logs.</li>'
+ '<li><strong>EDA & cleaning:</strong> missing values, outliers, distributions (L10).</li>'
+ '<li><strong>Feature engineering:</strong> derive new columns (L10).</li>'
+ '<li><strong>Model training:</strong> pick an algorithm, train (L2-L7).</li>'
+ '<li><strong>Evaluation:</strong> how good is the model? (L4-L5)</li>'
+ '<li><strong>Production:</strong> integrate, monitor (L11).</li>'
+ '</ol>'

+ '<h2 class="l-title">6. What Does It Mean for a Model to "Learn"?</h2>'

+ '<p class="l-text">"Learning" sounds romantic; concretely it is a very specific math operation. A model has a set of <strong>parameters</strong> (e.g. a weight vector <em>w</em> for linear regression) and a <strong>function</strong> (<em>f(x; w)</em>) that uses these to predict. Training is choosing <em>w</em> so the model captures patterns in the data well.</p>'

+ '<p class="l-text">The thing that measures "well" is the <strong>loss function</strong> (<em>L</em>): how far the predictions deviate from the true labels.</p>'

+ '<div class="katex-block">$$\\hat{y} = f(x; w), \\qquad \\mathcal{L}(w) = \\frac{1}{n}\\sum_{i=1}^{n} \\ell\\bigl(\\hat{y}_i, y_i\\bigr)$$</div>'

+ '<p class="l-text">Training is finding the <em>w</em> that minimises the loss. This is typically done with <strong>gradient descent</strong> — covered in detail starting next lesson.</p>'

+ '<h2 class="l-title">7. Classical ML vs Deep Learning — When to Use Which</h2>'

+ '<p class="l-text">Both classical ML (Random Forest, XGBoost) and deep learning (neural networks, transformers) are powerful tools. Which to choose depends on your data type and size:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Tabular data (columns like the churn dataset):</strong> XGBoost and Random Forest often win. Classical ML is strong here.</li>'
+ '<li><strong>Images, audio, text:</strong> deep learning is far ahead (CNN, RNN, Transformer). Topic of our NLP course.</li>'
+ '<li><strong>Small data:</strong> classical ML usually generalises better; DL tends to overfit.</li>'
+ '<li><strong>Very large data:</strong> DL scales; classical ML saturates.</li>'
+ '</ul>'

+ '<p class="l-text">This course covers classical ML; for deep learning see the Deep Learning track.</p>'

+ '<div class="plotly-graph"><div id="plot-mldl-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var sizes=[100,1000,10000,100000,1000000,10000000];'
+ 'var classical=[0.55,0.72,0.83,0.87,0.88,0.88];'
+ 'var dl=[0.40,0.55,0.78,0.88,0.93,0.96];'
+ 'var t1={x:sizes,y:classical,name:"Classical ML",type:"scatter",mode:"lines+markers",line:{color:T.accent,width:3}};'
+ 'var t2={x:sizes,y:dl,name:"Deep Learning",type:"scatter",mode:"lines+markers",line:{color:"rgba(248,113,113,.85)",width:3,dash:"dash"}};'
+ 'var layout={title:{text:"Data size vs model performance (illustrative)",font:{color:T.text,size:13}},xaxis:{title:"Number of training examples",color:T.text,gridcolor:T.grid,type:"log"},yaxis:{title:"Approx. accuracy",color:T.text,gridcolor:T.grid,range:[0.3,1.0],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-mldl-en"))Plotly.newPlot("plot-mldl-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Classical ML is very competitive on small-to-medium data (1k-100k examples), then saturates. Deep learning is weak on small data but improves continuously as data grows. Telecom churn is typical tabular data, usually with 50k-500k records — this is why classical ML is most often the right choice.</div>'

+ '<h2 class="l-title">8. Real-World Use Cases</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Finance:</strong> credit approval, fraud detection, price forecasting.</li>'
+ '<li><strong>Healthcare:</strong> disease diagnosis, drug discovery, MR/X-ray analysis.</li>'
+ '<li><strong>E-commerce:</strong> product recommendation, price optimisation, customer segmentation.</li>'
+ '<li><strong>Telecom (our example):</strong> churn prediction, network optimisation, call routing.</li>'
+ '<li><strong>Manufacturing:</strong> predictive maintenance, quality control.</li>'
+ '<li><strong>Logistics:</strong> route optimisation, demand forecasting, warehouse management.</li>'
+ '<li><strong>Agriculture:</strong> yield prediction, disease detection, irrigation control.</li>'
+ '</ul>'

+ '<h2 class="l-title">9. Ethics and Responsibility — A Brief Note</h2>'

+ '<p class="l-text">ML models make decisions that affect people: credit approval, job applications, even medical diagnoses. This decision-making power carries responsibilities:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Data bias:</strong> biases in training data carry into the model. A "good engineer" model trained on a male-heavy engineering dataset may penalise female applicants.</li>'
+ '<li><strong>Explainability:</strong> why did the model decide this? Complex models (deep nets, XGBoost) can be "black boxes"; tools like SHAP and LIME help.</li>'
+ '<li><strong>Fairness metrics:</strong> is performance equal across demographic groups (gender, age, income)?</li>'
+ '<li><strong>Privacy:</strong> can personal information leak from training data?</li>'
+ '</ul>'

+ '<p class="l-text">L11 (MLOps & Production) returns to the practical side of these.</p>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">We have introduced the customer churn problem and the basics of ML. Now let us tackle a real ML algorithm: <a href="/tutorials/ai/ml/linear-regression">Lesson 2 — Linear Regression</a>. We will predict how much a customer is expected to spend over the next 12 months. It is the simplest yet most fundamental learning algorithm; we will meet ideas (gradient descent, MSE loss, polynomial expansion) that show up in every ML algorithm.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> The difference between traditional programming and ML (deriving rules from examples instead of writing them). The customer-churn problem and our mini dataset — your guide for all 14 lessons. The feature/target distinction; numerical/categorical/binary types. The three ML types (supervised, unsupervised, reinforcement) and the regression/classification split inside supervised. The 7-step ML workflow. The mathematical meaning of "a model learning": parameters + loss function + minimisation. When to choose classical ML vs deep learning. The real-world reach of ML and a brief note on ethics.</div>'

};
