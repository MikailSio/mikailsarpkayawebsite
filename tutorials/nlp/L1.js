/* nlp-new-L1.js — NLP Course Lesson 1: NLP'ye Giriş ve Metin Ön İşleme (TR + EN)
 * Pedagojik vizyon: konu anlatım kursu — somut örnek üzerinden, sıralı, açıklamalı.
 * Türkçe ana dil; "Bu film gerçekten harikaydı." örneğiyle baştan sona ilerler.
 */
var NLP_L1 = {

/* ================================================================
   TÜRKÇE
   ================================================================ */
tr:
'<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div><p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p><ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none"><li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrisler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L72)</span></li><li><a href="/tutorials/matematik/91" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Vektörler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L91)</span></li><li><a href="/tutorials/matematik/94" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Olasılık Temelleri</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L94)</span></li></ul></div><script>(function(){var g=window;g.__nlpChartDrawers=[];g.__nlpChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Doğal Dil İşleme (NLP) nedir, neyi neden çözer, bir bilgisayar bir cümleyi gerçekte nasıl "okur". Bütün bunları tek bir somut örnek üzerinden — <em>"Bu film gerçekten harikaydı."</em> — baştan sona göreceksin. Ham metnin nasıl temizlendiğini, parçalara ayrıldığını, normalize edildiğini, gereksiz kelimelerden arındırıldığını ve nihayet kelimelerin köke indirgenip makinenin tüketebileceği temiz bir token dizisine dönüştürüldüğünü adım adım takip edeceksin.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>NLP\'nin ne olduğunu ve bilgisayarın bir cümleyi nasıl karakter dizisi olarak gördüğünü açıklamayı</li>'
+ '<li>Türkçe bir cümleyi NLTK ve regex ile token\'lara ayırmayı (tokenization)</li>'
+ '<li>Lowercasing, noktalama temizleme ve stop word filtreleme adımlarını uygulamayı</li>'
+ '<li>Stemming ve lemmatization farkını görüp Türkçe köke indirgeme yapmayı</li>'
+ '<li>Tüm adımları birleştirip ham metni temiz token listesine çeviren bir pipeline yazmayı</li>'
+ '</ul>'
+ '</div>'

/* ============================================
   1. NLP Nedir?
   ============================================ */
+ '<h2 class="l-title">1. NLP Nedir?</h2>'

+ '<p class="l-text">Doğal Dil İşleme (NLP, Natural Language Processing), bilgisayarların insan dilini anlamasını, üretmesini ve dönüştürmesini sağlayan yöntemler bütünüdür. Yapay zekânın bir alt dalıdır ve dilbilim, istatistik, makine öğrenmesi ve son yıllarda derin öğrenmenin kesişiminde durur.</p>'

+ '<p class="l-text">Konuya somut bir örnekle giriyoruz. Bütün ders boyunca aşağıdaki cümleyi takip edeceğiz:</p>'

+ '<div class="calc-example"><div class="example-label">DERS BOYUNCA TAKİP EDECEĞİMİZ ÖRNEK</div><div class="example-body">'
+ '<p class="l-text" style="font-size:1.25rem;text-align:center;margin:1rem 0"><code style="font-size:1.2rem">"Bu film gerçekten harikaydı."</code></p>'
+ '<p class="l-text">Sen bu cümleyi okuyunca anında şunları biliyorsun:</p>'
+ '<ul class="l-list">'
+ '<li>Cümle bir <strong>film</strong> hakkında.</li>'
+ '<li>Konuşan kişi filmi <strong>beğenmiş</strong> — yani cümle olumlu duygu (pozitif sentiment) taşıyor.</li>'
+ '<li><strong>"gerçekten"</strong> kelimesi vurguyu artırıyor; sıradan bir "iyi"den daha güçlü bir beğenme.</li>'
+ '<li><strong>"harikaydı"</strong> geçmiş zamanda; konuşan kişi filmi izlemiş bitirmiş, şimdi bunu söylüyor.</li>'
+ '</ul>'
+ '</div></div>'

+ '<p class="l-text">Bu çıkarımları sen birkaç milisaniyede yaptın. Yıllarca dil öğrenip cümle yapısını içselleştirdiğin için. Peki bilgisayar? Onun için bu cümle başlangıçta sadece bir <strong>karakter dizisidir</strong>. Bilgisayarın gördüğü şey, her harfin sayısal karşılığıdır:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>BAYTLAR</span> Cümlenin karakter karşılıkları (UTF-8)</div><div class="code-block"><pre><code><span class="cm"># "Bu film gerçekten harikaydı." cümlesinin sayısal karşılığı</span>'
+ '\nB = 66    u = 117   (boşluk) = 32'
+ '\nf = 102   i = 105   l = 108   m = 109   (boşluk) = 32'
+ '\ng = 103   e = 101   r = 114   ç = 231   e = 101   k = 107   t = 116   e = 101   n = 110   (boşluk) = 32'
+ '\nh = 104   a = 97    r = 114   i = 105   k = 107   a = 97    y = 121   d = 100   ı = 305'
+ '\n. = 46</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne anlatıyor:</strong> Bilgisayar "film" gördüğünde aslında 102, 105, 108, 109 sayılarını görür. "harikaydı" sadece on bir farklı sayının yan yana dizilişidir. Bu sayılar tek başına anlam taşımaz. NLP\'nin görevi tam burada başlar: bu sayı dizisinden, senin kafanda otomatik olarak yaptığın çıkarımlara — "Cümle ne hakkında?", "Olumlu mu olumsuz mu?", "Hangi zamandayız?" — bilgisayarı ulaştırabilmek.</p>'

+ '<h3 class="l-subtitle">NLP Neden Zor Bir Problemdir?</h3>'

+ '<p class="l-text">Dil, hayatımızda o kadar doğal akar ki onu bir mühendislik problemi olarak görmek zorlanırız. Oysa NLP\'nin uğraştığı pek çok zorluk vardır:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Belirsizlik:</strong> "Yüzünü yıkadı" cümlesinde "yüz" hangisi — vücudun bir parçası mı, yoksa "yüz" sayısı mı? Bağlam çözer.</li>'
+ '<li><strong>İronik kullanım:</strong> "Harika bir gün, üç saattir trafikteyim" cümlesindeki "harika" pozitif değil, ironik. Klasik kelime sayma yöntemleri bunu kaçırır.</li>'
+ '<li><strong>Türkçenin eklemeli yapısı:</strong> Tek kelime cümle olabilir — "<em>evlerimizdekilerden</em>" tek kelimedir ama İngilizcede yedi kelime gerekir: "<em>from those that are in our houses</em>".</li>'
+ '<li><strong>Yazım çeşitliliği:</strong> "harikaydı", "HARİKAYDI", "harika idi", "hârikaydı" — hepsi aynı anlam, farklı yazım. Model için her birisi farklı bir kelime gibi görünebilir.</li>'
+ '</ul>'

+ '<div class="l-note"><strong>Önemli:</strong> NLP "büyü" yapmaz. Adım adım, matematiksel ve istatistiksel işlemlerle bu karakter dizisini önce <em>kelimelere</em>, sonra <em>sayılara</em>, sonra <em>vektörlere</em>, en sonunda da <em>anlam temsillerine</em> dönüştürür. Bu kursun ilk birkaç dersi tam olarak bu basamakları öğretecek; bu ders en alttaki basamağı, ham metni temizleyip token\'lara çevirme adımını ele alır.</div>'

/* ============================================
   2. NLP nerelerde kullanılır?
   ============================================ */
+ '<h2 class="l-title">2. NLP Nerelerde Kullanılır?</h2>'

+ '<p class="l-text">NLP, günlük hayatın her köşesindedir. Belki farkında olmadan her gün düzinelerce NLP sistemiyle etkileşim kuruyorsun:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Arama motorları:</strong> Google\'a "havalimanına nasıl giderim" yazdığında, motor cümleyi bir bütün olarak anlayıp ulaşım önerileri getirir. Bu, basit kelime eşleştirmesinin çok ötesidir; kullanıcının niyetini çıkarmaktır.</li>'
+ '<li><strong>Makine çevirisi:</strong> Google Translate, DeepL gibi araçlar bir dilden diğerine çeviri yapar. Modern çeviri kelime kelime değil, cümlenin bütününü anlamlandırarak çevirir.</li>'
+ '<li><strong>Sesli asistanlar:</strong> Siri, Alexa, Google Assistant — önce sesi metne dönüştürür, sonra metni anlamlandırır, en sonunda uygun bir cevap üretir. Üç ayrı NLP/ses problemi peş peşe.</li>'
+ '<li><strong>Duygu analizi (sentiment):</strong> Trendyol, Hepsiburada gibi platformlarda ürün yorumlarının olumlu mu olumsuz mu olduğunu otomatik tespit eder. Müşteri hizmetleri ve ürün yönetimi için kritiktir. Bu kursun <a href="/tutorials/nlp/4">Ders 4</a>\'ünün ana konusudur.</li>'
+ '<li><strong>Chatbotlar:</strong> Banka, sigorta ve e-ticaret sitelerinde sıkça karşılaşılan otomatik müşteri temsilcileri. Modern örnekler büyük dil modelleri (LLM) kullanır — <a href="/tutorials/nlp/11">Ders 11</a> ve <a href="/tutorials/nlp/12">Ders 12</a>.</li>'
+ '<li><strong>Otomatik özetleme:</strong> Uzun bir haberi üç cümleye, bir tıbbi raporu bir paragrafa indirgeme.</li>'
+ '<li><strong>Adlandırılmış varlık tanıma (NER):</strong> Bir gazete haberinde kişi-yer-kurum isimlerini, bir tıbbi raporda hastalık adlarını otomatik ayıklama. <a href="/tutorials/nlp/7">Ders 7</a>.</li>'
+ '<li><strong>Sahte içerik tespiti:</strong> Sosyal medyadaki bot mesajlarını, sahte yorumları, dezenformasyonu yakalama.</li>'
+ '</ul>'

+ '<p class="l-text">Bu kursta yukarıdaki görevlerin nasıl yapıldığını sırayla öğreneceğiz. İşte 12 dersin yol haritası:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Ders 1 (şu an)</div><div class="card-body">Ham metni temizleyip token haline getirme — bilgisayara verilebilecek temiz bir veri üretmek.</div></div>'
+ '<div class="calc-card"><div class="card-title">Ders 2-3</div><div class="card-body">Token\'ları sayılara çevirme: Bag-of-Words, TF-IDF. İlk klasik sınıflandırıcılar (Naive Bayes, lojistik regresyon).</div></div>'
+ '<div class="calc-card"><div class="card-title">Ders 4-6</div><div class="card-body">Duygu analizi, kelime gömmeleri (Word2Vec/GloVe), konu modelleme (LDA).</div></div>'
+ '<div class="calc-card"><div class="card-title">Ders 7-9</div><div class="card-body">Sıralı modeller: dizi etiketleme/NER, dil modelleri, RNN/LSTM, dikkat (attention) mekanizması.</div></div>'
+ '<div class="calc-card"><div class="card-title">Ders 10-11</div><div class="card-body">Transformer mimarisi, BERT, GPT, büyük dil modelleri ve görev-özelinde ince ayar (fine-tuning).</div></div>'
+ '<div class="calc-card"><div class="card-title">Ders 12</div><div class="card-body">Üretim sistemleri: RAG, ajanlar, çok dilli NLP, etik konular, uçtan uca proje şablonu.</div></div>'
+ '</div>'

/* ============================================
   3. Ham metnin sorunları
   ============================================ */
+ '<h2 class="l-title">3. Ham Metnin Sorunları</h2>'

+ '<p class="l-text">"Bu film gerçekten harikaydı." cümlesi gerçek dünyada nadiren bu kadar temiz gelir. Kullanıcılar bir IMDB veya Sinemalar yorumu yazarken, bir tweet atarken veya bir Trendyol değerlendirmesi bırakırken çok daha kaotik metinler üretirler. İşte aynı duyguyu taşıyan gerçek bir IMDB yorumu nasıl görünebilir:</p>'

+ '<div class="calc-example"><div class="example-label">GERÇEK DÜNYA — KİRLİ METİN</div><div class="example-body">'
+ '<p class="l-text"><strong>Ham yorum:</strong></p>'
+ '<pre style="background:rgba(248,113,113,0.08);padding:1rem;border-radius:8px;font-size:.95rem;white-space:pre-wrap;word-wrap:break-word">' + '&lt;p&gt;BU FİLM GERÇEKTEN HARİKAYDI!!!  😍😍 izleyin tavsiye ederim 👍 https://imdb.com/title/tt12345 #harika #musthave  &lt;/p&gt;' + '</pre>'
+ '<p class="l-text"><strong>İstediğimiz hâl:</strong></p>'
+ '<pre style="background:rgba(78,205,196,0.08);padding:1rem;border-radius:8px;font-size:.95rem">bu film gerçekten harikaydı izleyin tavsiye ederim</pre>'
+ '</div></div>'

+ '<p class="l-text">Aradaki fark ne? Kirli versiyonda HTML etiketleri (<code>&lt;p&gt;</code>), büyük-küçük harf karmaşası, fazladan boşluklar, emojiler, URL\'ler, hashtag\'ler, ünlem işaretleri var. Hiçbiri bilgi taşımıyor — hepsi <strong>gürültü</strong>. Klasik makine öğrenmesi modelleri (Naive Bayes, SVM gibi) bu gürültüye karşı çok hassastır: her farklı yazılış için ayrı bir özellik (feature) tutarlar. "Harika", "harika", "HARİKA" üç ayrı sütun olarak görünür ve sinyal aralarında dağılır.</p>'

+ '<p class="l-text">Modern büyük dil modelleri (BERT, GPT) bu gürültüye karşı daha dayanıklıdır çünkü onlar zaten kirli internet metni üzerinde eğitilmişlerdir. Yine de HTML etiketlerini ve URL\'leri temizlemek her durumda mantıklıdır — hatta zorunludur. Bu derste klasik modeller için gerekli olan tüm temizleme adımlarını öğreneceğiz; modern modeller için hangilerinin gerçekten gerekli olduğunu ders sonunda netleştireceğiz.</p>'

+ '<div class="l-note"><strong>NLP\'nin altın kuralı:</strong> Hiçbir model, kendisine verilen veriden daha akıllı değildir. Çöp girer, çöp çıkar (<em>garbage in, garbage out</em>). Ön işleme görkemli bir iş değildir, ama bir NLP boru hattındaki en yüksek etkiye sahip tek adımdır.</div>'

/* ============================================
   4. Tokenization
   ============================================ */
+ '<h2 class="l-title">4. Tokenization — Cümleyi Parçalara Bölmek</h2>'

+ '<p class="l-text">Bilgisayar bir cümlenin tamamını birden işleyemez. Önce cümleyi <strong>token</strong> dediğimiz küçük parçalara bölmemiz gerekir. Token genellikle bir kelimedir, ama bir noktalama işareti, bir sayı veya alt-kelime parçası da olabilir. Bu işleme <strong>tokenization</strong> (parçalara ayırma) denir ve neredeyse her NLP boru hattının ilk adımıdır.</p>'

+ '<p class="l-text">En basit yaklaşım, cümleyi boşluklara göre kesmektir. Sezgisel olarak şöyle:</p>'

+ '<div class="calc-example"><div class="example-label">TOKENIZATION — TEMEL SEZGİ</div><div class="example-body">'
+ '<p class="l-text" style="text-align:center"><code style="font-size:1.05rem">"Bu film gerçekten harikaydı."</code></p>'
+ '<p class="l-text" style="text-align:center;color:var(--accent)">↓ boşluklara göre böl</p>'
+ '<p class="l-text" style="text-align:center"><code style="font-size:1.05rem">["Bu", "film", "gerçekten", "harikaydı."]</code></p>'
+ '<p class="l-text">Dikkat: nokta hâlâ "harikaydı."ya yapışık. Daha akıllı bir tokenizer noktalama işaretini ayrı bir token olarak çıkarır:</p>'
+ '<p class="l-text" style="text-align:center"><code style="font-size:1.05rem">["Bu", "film", "gerçekten", "harikaydı", "."]</code></p>'
+ '</div></div>'

+ '<p class="l-text">Python\'da bu işin iki yaygın yolu vardır.</p>'

+ '<h3 class="l-subtitle">Yol 1: Basit boşluk bölme</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Boşluğa göre bölme</div><div class="code-block"><pre><code>text = <span class="str">"Bu film gerçekten harikaydı."</span>'
+ '\ntokens = text.<span class="fn">split</span>()'
+ '\n<span class="fn">print</span>(tokens)'
+ '\n<span class="cm"># [\'Bu\', \'film\', \'gerçekten\', \'harikaydı.\']</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Python\'un yerleşik <code>split()</code> metodu cümleyi boşluk karakterlerinden böler. Hızlıdır, hiçbir kütüphane gerektirmez. Ama noktalamayı kelimeden ayıramaz — "harikaydı." tek token olarak kalır. Hızlı bir prototipte işe yarar, ciddi projeler için yetmez.</p>'

+ '<h3 class="l-subtitle">Yol 2: NLTK ile akıllı tokenization</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> NLTK\'nin word_tokenize fonksiyonu</div><div class="code-block"><pre><code><span class="kw">import</span> nltk'
+ '\nnltk.<span class="fn">download</span>(<span class="str">\'punkt_tab\'</span>)  <span class="cm"># tokenizer modelini indir (bir kez)</span>'
+ '\n<span class="kw">from</span> nltk.tokenize <span class="kw">import</span> word_tokenize'
+ '\n'
+ '\ntokens = <span class="fn">word_tokenize</span>(<span class="str">"Bu film gerçekten harikaydı."</span>)'
+ '\n<span class="fn">print</span>(tokens)'
+ '\n<span class="cm"># [\'Bu\', \'film\', \'gerçekten\', \'harikaydı\', \'.\']</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı fikri sadece Python\'un `re` modülü ile uyguluyoruz — cümleyi noktalama dahil token\'lara bölüyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>import re\ntext = "Bu film gerçekten harikaydı."\ntokens = re.findall(r"\\w+|[^\\w\\s]", text, re.UNICODE)\nprint(tokens)\n# [\'Bu\', \'film\', \'gerçekten\', \'harikaydı\', \'.\']\nprint(\'# tokens:\', len(tokens))</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> NLTK kütüphanesinin <code>word_tokenize</code> fonksiyonu cümleyi alır ve her noktalama işaretini ayrı bir token olarak çıkarır. "Dr. Ahmet" gibi kısaltmaları da bütün tutar — yani noktayı cümle sonu zannetmez. Türkçe için kabul edilebilir bir başlangıçtır; daha derinlemesine Türkçe analiz için Zemberek gibi yerli kütüphaneler vardır.</p>'

+ '<div class="l-note"><strong>Yan bilgi — cümle tokenization:</strong> Bir paragrafı önce cümlelere bölmek istersen NLTK\'nin <code>sent_tokenize</code> fonksiyonu vardır. Mantık aynıdır ama ayraç olarak nokta, soru ve ünlem işaretlerini kullanır, kısaltmalardaki noktaları (Dr., Prof.) atlamayı bilir.</div>'

+ '<h3 class="l-subtitle">Türkçenin Tokenization Zorluğu</h3>'

+ '<p class="l-text">Türkçe <strong>eklemeli (sondan eklemeli, agglutinative)</strong> bir dildir. Tek bir kelime pek çok ek alarak uzayabilir; İngilizcede üç-dört ayrı kelimeyle ifade edilen anlam, Türkçede tek kelimeye sığar:</p>'

+ '<div class="calc-example"><div class="example-label">TÜRKÇE EKLEMELİ YAPI</div><div class="example-body">'
+ '<p class="l-text"><code>evlerimizdekilerden</code></p>'
+ '<p class="l-text">= ev + ler + imiz + de + ki + ler + den</p>'
+ '<p class="l-text">İngilizce karşılığı: <em>"from those (which are) at our houses"</em> — yedi kelime.</p>'
+ '</div></div>'

+ '<p class="l-text">Bu yapı tokenization için gerçek bir zorluktur. "evlerimizdekilerden" tek bir token olarak kaldığında, model bu kelimeyi neredeyse hiç görmediği için genelleyemez. Çözüm yolları:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Morfolojik analizör (Zemberek):</strong> Kelimeyi gerçek dilbilgisi kurallarına göre eklerine ayırır. Türkçeye özel, doğru ama yavaş.</li>'
+ '<li><strong>Alt-kelime (subword) tokenization:</strong> Kelimeyi istatistiksel olarak öğrenilmiş alt-parçalara böler. Modern büyük dil modellerinin (BERT, GPT) tercih ettiği yaklaşım. <a href="/tutorials/nlp/5">Ders 5</a>\'te detayında göreceğiz.</li>'
+ '</ul>'

/* ============================================
   5. Normalizasyon
   ============================================ */
+ '<h2 class="l-title">5. Normalizasyon — Aynı Anlamı Aynı Yazıma Getirmek</h2>'

+ '<p class="l-text">Şu üç token\'a bak:</p>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text" style="text-align:center"><code>"Harikaydı"</code> &nbsp; <code>"harikaydı"</code> &nbsp; <code>"HARİKAYDI"</code></p>'
+ '</div></div>'

+ '<p class="l-text">Sen üçünün de aynı anlama geldiğini biliyorsun. Bilgisayar bilmez. Klasik makine öğrenmesi modelleri her farklı yazılışı ayrı bir özellik olarak tutar. Üç ayrı sütun, üçe bölünmüş sinyal. Çözüm: hepsini tek bir biçime indirmek. En yaygın yöntem her şeyi küçük harfe çevirmektir.</p>'

+ '<h3 class="l-subtitle">Küçük harfe çevirme</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Basit lowercase</div><div class="code-block"><pre><code>text = <span class="str">"Bu Film Gerçekten Harikaydı."</span>'
+ '\ntext_kucuk = text.<span class="fn">lower</span>()'
+ '\n<span class="fn">print</span>(text_kucuk)'
+ '\n<span class="cm"># "bu film gerçekten harikaydı."</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Python\'un <code>lower()</code> metodu metindeki tüm büyük harfleri küçük harfe çevirir. Tek satır, hızlı bir işlem.</p>'

+ '<div class="l-warn"><strong>Türkçe tuzağı:</strong> Türkçedeki büyük <strong>İ</strong> harfi, Python\'un standart <code>lower()</code> metodunda bazen "i" şeklinde noktalı bir karaktere dönüşür (i + üzerinde fazladan bir nokta birleşik karakter). Bu encoding kaynaklı tuhaf bir durumdur. Türkçe metin işlerken <code>str.casefold()</code> daha güvenilirdir, veya <code>locale</code> ayarıyla doğru lowercase elde edilir. Üretim sistemlerinde mutlaka birkaç Türkçe örnekle test et — yoksa sessizce kelimelerin yarısını kaybedebilirsin.</div>'

+ '<h3 class="l-subtitle">HTML, URL ve Emoji Temizliği</h3>'

+ '<p class="l-text">Web\'den gelen metinler genellikle HTML etiketleri ve URL\'lerle birlikte gelir. Bunları silmek için <strong>regex</strong> (düzenli ifadeler) kullanılır. Regex bir desendir; metin içindeki belirli kalıpları yakalayıp değiştirmemizi sağlar.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Regex ile temizleme</div><div class="code-block"><pre><code><span class="kw">import</span> re'
+ '\n'
+ '\nham = <span class="str">"&lt;p&gt;Bu film gerçekten harikaydı https://imdb.com/abc 😍&lt;/p&gt;"</span>'
+ '\n'
+ '\n<span class="cm"># 1. HTML etiketlerini sil</span>'
+ '\ntext = re.<span class="fn">sub</span>(<span class="str">r\'&lt;[^&gt;]+&gt;\'</span>, <span class="str">\'\'</span>, ham)'
+ '\n<span class="cm"># 2. URL\'leri sil</span>'
+ '\ntext = re.<span class="fn">sub</span>(<span class="str">r\'https?://\\S+\'</span>, <span class="str">\'\'</span>, text)'
+ '\n<span class="cm"># 3. Birden fazla boşluğu tek boşluğa indir</span>'
+ '\ntext = re.<span class="fn">sub</span>(<span class="str">r\'\\s+\'</span>, <span class="str">\' \'</span>, text).<span class="fn">strip</span>()'
+ '\n<span class="fn">print</span>(text)'
+ '\n<span class="cm"># "Bu film gerçekten harikaydı 😍"</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Üç adımda metni temizler. Birinci satır HTML etiketlerini siler — köşeli parantezler içindeki her şeyi (<code>&lt;p&gt;</code>, <code>&lt;br&gt;</code>, <code>&lt;a href="..."&gt;</code> gibi). İkinci satır URL\'leri siler — "https://" veya "http://" ile başlayıp ilk boşluğa kadar süren her şeyi. Üçüncü satır arka arkaya gelen boşlukları tek boşluğa indirir ve baş-son boşlukları kırpar. Emojiler bu örnekte korunur; eğer onları da silmek istersen ayrı bir Unicode regex deseni gerekir.</p>'

/* ============================================
   6. Stop words
   ============================================ */
+ '<h2 class="l-title">6. Stop Words — Yardımcı Kelimeleri Atmak</h2>'

+ '<p class="l-text">Bir cümlede bazı kelimeler hemen her yerde geçer ama tek başlarına anlam taşımazlar. Türkçede <em>ve, ile, bir, bu, şu, için, ama, da, de</em>; İngilizcede <em>the, is, a, of, at, in, on</em> gibi. Bunlara <strong>stop words</strong> (durdurma kelimeleri) denir. Klasik modellerde bu kelimeleri atmak, modelin gerçek bilgi taşıyan kelimelere odaklanmasını sağlar ve hesaplama maliyetini düşürür.</p>'

+ '<div class="calc-example"><div class="example-label">STOP WORDS UYGULAMA</div><div class="example-body">'
+ '<p class="l-text"><strong>Önce:</strong> <code>"Bu film gerçekten ama gerçekten çok harikaydı"</code></p>'
+ '<p class="l-text"><strong>Sonra:</strong> <code>"film gerçekten gerçekten harikaydı"</code></p>'
+ '<p class="l-text">Atılan kelimeler: <em>Bu, ama, çok</em>. Cümlenin filmi beğendiğine dair sinyali korunur, kelime sayısı azalır.</p>'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> NLTK ile Türkçe stop words</div><div class="code-block"><pre><code><span class="kw">import</span> nltk'
+ '\nnltk.<span class="fn">download</span>(<span class="str">\'stopwords\'</span>)'
+ '\n<span class="kw">from</span> nltk.corpus <span class="kw">import</span> stopwords'
+ '\n'
+ '\ntr_stops = <span class="fn">set</span>(stopwords.<span class="fn">words</span>(<span class="str">\'turkish\'</span>))'
+ '\ntokens = [<span class="str">"bu"</span>, <span class="str">"film"</span>, <span class="str">"gerçekten"</span>, <span class="str">"ama"</span>, <span class="str">"gerçekten"</span>, <span class="str">"çok"</span>, <span class="str">"harikaydı"</span>]'
+ '\n'
+ '\ntemiz = [t <span class="kw">for</span> t <span class="kw">in</span> tokens <span class="kw">if</span> t <span class="kw">not</span> <span class="kw">in</span> tr_stops]'
+ '\n<span class="fn">print</span>(temiz)'
+ '\n<span class="cm"># [\'film\', \'gerçekten\', \'gerçekten\', \'harikaydı\']</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Küçük bir stopword listesi tanımlayıp filtreliyoruz — NLTK gerekmez.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>STOP = {\'bir\',\'bu\',\'şu\',\'o\',\'ile\',\'ve\',\'ama\',\'ki\',\'de\',\'da\',\'için\',\'mi\',\'mu\',\'ne\'}\n\ntext = "Bu film gerçekten harikaydı ve ben çok beğendim."\nimport re\ntokens = [t.lower() for t in re.findall(r"\\w+", text, re.UNICODE)]\nfiltered = [t for t in tokens if t not in STOP]\n\nprint(\'all     :\', tokens)\nprint(\'filtered:\', filtered)\nprint(\'removed :\', set(tokens) - set(filtered))</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> NLTK\'nin Türkçe stop word listesini yükler ve token listesinden bu kelimeleri çıkarır. <code>set</code> kullanmamızın sebebi performans: stop word kontrolü <code>liste</code>\'de O(n) sürerken <code>set</code>\'te O(1) sürer — binlerce yorumu işlerken aradaki fark çok büyük.</p>'

+ '<div class="l-warn"><strong>DİKKAT — duygu analizi tuzağı:</strong> Türkçedeki <code>"değil"</code> kelimesi bazı stop word listelerinde bulunur. Ama duygu analizi yapıyorsan bu kelimeyi <em>asla</em> atma! <em>"film güzeldi"</em> ile <em>"film güzel değildi"</em> arasındaki fark sadece bu kelimedir. Aynı tuzak İngilizcede <code>"not"</code> için geçerlidir. Stop word listesini körü körüne uygulama — projenin amacına göre özelleştir, gerekirse listeyi okuyup elle düzenle.</div>'

/* ============================================
   7. Stemming & Lemmatization
   ============================================ */
+ '<h2 class="l-title">7. Stemming &amp; Lemmatization — Kelimeleri Köke İndirmek</h2>'

+ '<p class="l-text">Şu üç kelimeye bak:</p>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text" style="text-align:center"><code>"harikaydı"</code> &nbsp; <code>"harikaymış"</code> &nbsp; <code>"harika"</code></p>'
+ '</div></div>'

+ '<p class="l-text">Üçü de aynı sıfatın farklı formlarıdır. Anlam aynıdır, ek farklıdır. Eğer model bunları üç ayrı kelime sayarsa, "Bu film harikaydı" cümlesindeki bilgi "Bu film harika" cümlesindeki bilgiyle ilişkilendirilemez. <strong>Köke indirme</strong> bu üç formu tek bir biçime — ya da yakın bir biçime — çevirir.</p>'

+ '<p class="l-text">Bu işin iki temel yöntemi vardır: <strong>stemming</strong> ve <strong>lemmatization</strong>. İkisi farklı işlerdir, sıkça karıştırılır.</p>'

+ '<h3 class="l-subtitle">Stemming — Hızlı ve kuralcı</h3>'

+ '<p class="l-text"><strong>Stemming</strong>, kelimenin sonundaki ekleri kaba kurallarla keser. Çok hızlıdır ama elde ettiği "kök" gerçek bir kelime olmayabilir. Türkçe için Snowball stemmer aşağıdaki gibi davranır:</p>'

+ '<ul class="l-list">'
+ '<li>"harikaydı" → "harika"</li>'
+ '<li>"geliyor" → "gel"</li>'
+ '<li>"ağaçlar" → "ağaç"</li>'
+ '<li>"kitabı" → "kitab" (gerçek bir kelime değil, ama tutarlı bir biçim)</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Lemmatization — Yavaş ama akıllı</h3>'

+ '<p class="l-text"><strong>Lemmatization</strong> morfolojik analiz yapar; sözlükte gerçekten var olan kök kelimeyi (lemma) bulur. Daha yavaştır çünkü dilbilgisi kuralları gerektirir, ama sonuçlar gerçek kelimelerdir:</p>'

+ '<ul class="l-list">'
+ '<li>"harikaydı" → "harika"</li>'
+ '<li>"geldi" → "gelmek"</li>'
+ '<li>"kitapları" → "kitap"</li>'
+ '<li>"daha iyi" → "iyi" (karşılaştırma çözümlenir)</li>'
+ '</ul>'

+ '<p class="l-text">Türkçe için en güçlü morfolojik analizör <strong>Zemberek</strong>\'tir (Java tabanlı, Python wrapper\'ı vardır). NLTK ve spaCy Türkçeyi tam desteklemediği için, ciddi Türkçe NLP işlerinde Zemberek\'e geçmek genelde gerekir.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Snowball ile Türkçe stemming</div><div class="code-block"><pre><code><span class="kw">from</span> nltk.stem.snowball <span class="kw">import</span> SnowballStemmer'
+ '\n'
+ '\nstemmer = <span class="fn">SnowballStemmer</span>(<span class="str">"turkish"</span>)'
+ '\nkelimeler = [<span class="str">"harikaydı"</span>, <span class="str">"harikaymış"</span>, <span class="str">"geliyor"</span>, <span class="str">"ağaçlar"</span>]'
+ '\nkokler = [stemmer.<span class="fn">stem</span>(k) <span class="kw">for</span> k <span class="kw">in</span> kelimeler]'
+ '\n<span class="fn">print</span>(kokler)'
+ '\n<span class="cm"># [\'harika\', \'harikamış\', \'gel\', \'ağaç\']</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Saf Python\'da oyuncak ek-kesme stemmer\'ı — Porter/Snowball ile aynı amaç.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>def stem(word):\n    for suf in [\'lerden\',\'larin\',\'ların\',\'lerin\',\'larda\',\'lerde\',\'lar\',\'ler\',\'dan\',\'den\',\'tan\',\'ten\',\'dir\',\'tir\',\'ydi\',\'ydı\',\'ing\',\'ed\',\'s\']:\n        if word.endswith(suf) and len(word) > len(suf) + 2:\n            return word[:-len(suf)]\n    return word\n\nwords = [\'evlerimizden\',\'arabaların\',\'güzellik\',\'running\',\'played\',\'cats\']\nfor w in words:\n    print(f\'{w:>20} -> {stem(w)}\')</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> NLTK\'nin Snowball Türkçe stemmer\'ını kullanarak her kelimeyi kabaca köküne indirir. Snowball kuralları sınırlıdır; "harikaymış" gibi karmaşık çekimleri tam çözemez (sadece son ek "ydı"yı atar). Snowball Türkçenin zenginliği için yetersiz kalır — Zemberek bu noktalarda çok daha doğru sonuç verir.</p>'

+ '<h3 class="l-subtitle">Köke İndirmenin Etkisi — Kelime Dağarcığı Küçülür</h3>'

+ '<p class="l-text">Köke indirme tek başına bir görev değildir; asıl faydası kelime dağarcığını (vocabulary) küçültmesidir. Aynı anlamı taşıyan beş çekim yerine tek bir kök kalır. Bu, klasik makine öğrenmesi modellerinin daha az parametreyle daha iyi genelleme yapmasını sağlar.</p>'

+ '<div class="plotly-graph"><div id="plot-vocab-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var asama=["Ham","Küçük harf","Stop words yok","Stem"];'
+ 'var vocab=[45200,32800,29400,16500];'
+ 'var t1={x:asama,y:vocab,type:"bar",marker:{color:T.accent},text:vocab.map(function(v){return v.toLocaleString("tr");}),textposition:"outside"};'
+ 'var layout={title:{text:"Ön İşleme Adımlarının Kelime Dağarcığına Etkisi",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid},yaxis:{color:T.text,gridcolor:T.grid,title:"Benzersiz token sayısı"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,margin:{t:50,r:30,b:60,l:80},font:{color:T.text,size:11}};'
+ 'if(document.getElementById("plot-vocab-tr"))Plotly.newPlot("plot-vocab-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> 50.000 film yorumundan oluşan bir veri setinde 45.200 farklı kelime ile başlanır. Sadece küçük harfe çevirmek 12.000 kelimeyi azaltır (büyük/küçük harf varyantları birleşir). Stop words atınca 3.400 daha düşer. Stemming en agresif adımdır: "harikaydı, harikaymış, harikaydır" tek köke indiği için sözcük dağarcığı yarıdan azına iner. Küçük dağarcık demek, klasik modeller için daha hızlı eğitim ve daha iyi genelleme demek.</div>'

/* ============================================
   8. Hepsini birleştirme - Pipeline
   ============================================ */
+ '<h2 class="l-title">8. Hepsini Birleştirme — Mini Pipeline</h2>'

+ '<p class="l-text">Şimdi öğrendiğimiz her adımı tek bir <strong>boru hattı</strong> (pipeline) hâlinde birleştirelim. Boru hattı kavramı önemlidir: ham veriyi alır, ardışık adımlardan geçirir, en sondan temiz bir token listesi olarak çıkar. Her adımın çıktısı bir sonrakinin girdisidir.</p>'

+ '<div class="calc-example"><div class="example-label">PIPELINE AKIŞI</div><div class="example-body">'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ '&lt;p&gt;BU FİLM GERÇEKTEN HARİKAYDI!!! 😍 https://imdb.com&lt;/p&gt;'
+ '<br>↓ <em>HTML/URL temizliği</em>'
+ '<br><span style="opacity:.65;font-size:.85em">etiketler (&lt;p&gt;) ve bağlantı adresleri silinir</span>'
+ '<br>BU FİLM GERÇEKTEN HARİKAYDI!!! 😍'
+ '<br>↓ <em>küçük harfe çevir</em>'
+ '<br><span style="opacity:.65;font-size:.85em">aynı kelimenin büyük/küçük varyantları tek biçime gelir</span>'
+ '<br>bu film gerçekten harikaydı!!! 😍'
+ '<br>↓ <em>tokenize</em>'
+ '<br><span style="opacity:.65;font-size:.85em">cümle kelimelere ve noktalamaya parçalanır</span>'
+ '<br>["bu", "film", "gerçekten", "harikaydı", "!", "!", "!", "😍"]'
+ '<br>↓ <em>noktalama / emoji / sayı at</em>'
+ '<br><span style="opacity:.65;font-size:.85em">sadece harf içeren tokenlar tutulur, gerisi düşer</span>'
+ '<br>["bu", "film", "gerçekten", "harikaydı"]'
+ '<br>↓ <em>stop words at</em>'
+ '<br><span style="opacity:.65;font-size:.85em">"bu" gibi anlam taşımayan yardımcı kelimeler çıkarılır</span>'
+ '<br>["film", "gerçekten", "harikaydı"]'
+ '<br>↓ <em>stemming (köke indir)</em>'
+ '<br><span style="opacity:.65;font-size:.85em">"harikaydı" → "harika" gibi ekler atılır, anlam kökü kalır</span>'
+ '<br>["film", "gerçek", "harika"]'
+ '</p>'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Uçtan uca tek fonksiyon</div><div class="code-block"><pre><code><span class="kw">import</span> re'
+ '\n<span class="kw">import</span> nltk'
+ '\n<span class="kw">from</span> nltk.tokenize <span class="kw">import</span> word_tokenize'
+ '\n<span class="kw">from</span> nltk.corpus <span class="kw">import</span> stopwords'
+ '\n<span class="kw">from</span> nltk.stem.snowball <span class="kw">import</span> SnowballStemmer'
+ '\n'
+ '\nnltk.<span class="fn">download</span>(<span class="str">\'punkt_tab\'</span>, quiet=<span class="kw">True</span>)'
+ '\nnltk.<span class="fn">download</span>(<span class="str">\'stopwords\'</span>, quiet=<span class="kw">True</span>)'
+ '\n'
+ '\nstops = <span class="fn">set</span>(stopwords.<span class="fn">words</span>(<span class="str">\'turkish\'</span>))'
+ '\nstemmer = <span class="fn">SnowballStemmer</span>(<span class="str">"turkish"</span>)'
+ '\n'
+ '\n<span class="kw">def</span> <span class="fn">on_isle</span>(metin):'
+ '\n    metin = re.<span class="fn">sub</span>(<span class="str">r\'&lt;[^&gt;]+&gt;\'</span>, <span class="str">\'\'</span>, metin)            <span class="cm"># HTML at</span>'
+ '\n    metin = re.<span class="fn">sub</span>(<span class="str">r\'https?://\\S+\'</span>, <span class="str">\'\'</span>, metin)         <span class="cm"># URL at</span>'
+ '\n    metin = metin.<span class="fn">lower</span>()                              <span class="cm"># küçük harfe çevir</span>'
+ '\n    tokens = <span class="fn">word_tokenize</span>(metin)                     <span class="cm"># parçalara böl</span>'
+ '\n    tokens = [t <span class="kw">for</span> t <span class="kw">in</span> tokens <span class="kw">if</span> t.<span class="fn">isalpha</span>()]    <span class="cm"># sadece harfler</span>'
+ '\n    tokens = [t <span class="kw">for</span> t <span class="kw">in</span> tokens <span class="kw">if</span> t <span class="kw">not</span> <span class="kw">in</span> stops] <span class="cm"># stop words at</span>'
+ '\n    tokens = [stemmer.<span class="fn">stem</span>(t) <span class="kw">for</span> t <span class="kw">in</span> tokens]      <span class="cm"># köke indir</span>'
+ '\n    <span class="kw">return</span> tokens'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="fn">on_isle</span>(<span class="str">"Bu film gerçekten harikaydı! &lt;br&gt; https://imdb.com"</span>))'
+ '\n<span class="cm"># [\'film\', \'gerçek\', \'harika\']</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı fikri sadece Python\'un `re` modülü ile uyguluyoruz — cümleyi noktalama dahil token\'lara bölüyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>import re\ntext = "Bu film gerçekten harikaydı."\ntokens = re.findall(r"\\w+|[^\\w\\s]", text, re.UNICODE)\nprint(tokens)\n# [\'Bu\', \'film\', \'gerçekten\', \'harikaydı\', \'.\']\nprint(\'# tokens:\', len(tokens))</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Bir cümleyi alır ve sırayla şu adımları uygular: HTML etiketleri sil, URL\'leri sil, küçük harfe çevir, kelime ve noktalamaya böl, sadece harfler içeren token\'ları tut, stop word\'leri at, kalan kelimeleri köke indir. Sonuç: temiz, normalize edilmiş, sayılaştırmaya hazır bir token listesi. Bu fonksiyonu binlerce yorum üzerinde döngüyle çağırarak tüm veri setini işleyebilirsin.</p>'

+ '<h3 class="l-subtitle">Sıralama Neden Önemli?</h3>'

+ '<p class="l-text">Pipeline\'da adımların sırası bilinçli seçilir. Yanlış sıra, sessizce bilgi kaybına yol açar. Birkaç tipik örnek:</p>'

+ '<ul class="l-list">'
+ '<li><strong>HTML temizliği önce</strong> gelmeli. Yoksa <code>&lt;br&gt;</code> gibi etiket içerikleri tokenize edilirse "br" gerçek bir kelimeymiş gibi token olur ve sözcük dağarcığını kirletir.</li>'
+ '<li><strong>Küçük harfe çevirme stop word filtrelemeden önce</strong> yapılmalı. Aksi hâlde <code>"Bu"</code> küçük harfli stop word listesindeki <code>"bu"</code> ile eşleşmez, atılmaz.</li>'
+ '<li><strong>Stemming en sonda</strong> olmalı. Önce stem yaparsan "değildir" → "değil" olur ve stop word listende "değildir" varsa kaçırırsın. Daha kötüsü, sentiment için kritik olan "değil" kelimesi düşebilir.</li>'
+ '</ul>'

/* ============================================
   9. Görev tablosu
   ============================================ */
+ '<h2 class="l-title">9. Hangi Görevde Ne Yapmalı?</h2>'

+ '<p class="l-text">Yukarıda öğrendiğin adımların hepsini her görevde uygulamak <strong>doğru değildir</strong>. Görevin türüne göre bazı adımlar zorunlu, bazıları zararlıdır. Aşağıdaki tablo pratikte sık karşılaşılan görevler için iyi bir başlangıç noktasıdır:</p>'

+ '<div style="overflow-x:auto;margin:1.2rem 0">'
+ '<table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.6rem;color:var(--accent)">Görev</th><th style="padding:.6rem">Küçük harf</th><th style="padding:.6rem">Stop words at</th><th style="padding:.6rem">Stemming</th><th style="padding:.6rem">Notlar</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.6rem"><strong>Duygu analizi</strong></td><td style="text-align:center">✓</td><td style="text-align:center">Hayır</td><td style="text-align:center">Bazen</td><td style="padding:.6rem;color:var(--text-dim)">"değil" gibi olumsuzluk kelimelerini koru</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.6rem"><strong>Belge sınıflandırma</strong></td><td style="text-align:center">✓</td><td style="text-align:center">✓</td><td style="text-align:center">✓</td><td style="padding:.6rem;color:var(--text-dim)">Maksimum sıkıştırma genelde uygun</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.6rem"><strong>Adlandırılmış varlık (NER)</strong></td><td style="text-align:center">Hayır</td><td style="text-align:center">Hayır</td><td style="text-align:center">Hayır</td><td style="padding:.6rem;color:var(--text-dim)">Büyük harf isim sinyalidir, korunmalı</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.6rem"><strong>Soru-cevap</strong></td><td style="text-align:center">Hayır</td><td style="text-align:center">Hayır</td><td style="text-align:center">Hayır</td><td style="padding:.6rem;color:var(--text-dim)">Anlam tam korunmalı</td></tr>'
+ '<tr><td style="padding:.6rem"><strong>BERT/GPT girdisi</strong></td><td style="text-align:center">Hayır</td><td style="text-align:center">Hayır</td><td style="text-align:center">Hayır</td><td style="padding:.6rem;color:var(--text-dim)">Sadece HTML/URL temizle</td></tr>'
+ '</tbody></table></div>'

+ '<p class="l-text">Tablodan çıkan kural: <strong>klasik makine öğrenmesi (Naive Bayes, SVM) agresif temizlik ister; modern transformer\'lar (BERT, GPT) zaten alt-kelime tokenizer\'ı kullandığı için neredeyse hiç temizlik istemez.</strong> 2018 öncesi ön işleme bir sanattı; 2020 sonrası giderek daha az önem taşır olmuştur. Yine de HTML/URL gibi gerçek gürültüyü temizlemek her zaman, her modelde mantıklıdır.</p>'

/* ============================================
   10. Sonraki adım
   ============================================ */
+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Şu anda elinde temiz bir token listesi var: <code>["film", "gerçek", "harika"]</code>. Ama bir makine öğrenmesi modeli kelimeleri değil, <strong>sayıları</strong> ister. <a href="/tutorials/nlp/2">Ders 2</a>\'de bu token\'ları nasıl sayılara çevireceğimizi öğreneceğiz: <strong>Bag-of-Words</strong> ve <strong>TF-IDF</strong>. Bunlar klasik NLP\'nin temel taşlarıdır ve hâlâ pek çok pratik problemde kullanılır.</p>'

+ '<p class="l-text">Sonra <a href="/tutorials/nlp/3">Ders 3</a>\'te bu sayıları gerçek bir sınıflandırıcıya bağlayıp ilk NLP modelimizi eğiteceğiz. Sonrasında derin öğrenmeye, Transformer\'lara, BERT ve GPT\'ye geçeceğiz. Ama hepsinin altında bu dersteki adımlar yatar — temiz veri olmadan akıllı model olmaz.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> NLP\'nin ne olduğunu ve nerelerde kullanıldığını gördün. Bilgisayarın bir cümleyi nasıl gördüğünü (karakter dizisi olarak) anladın. Ham metni temizlemek için tokenization, küçük harfe çevirme, regex ile gürültü temizliği, stop word atma, stemming ve lemmatization adımlarını öğrendin. Hepsini bir pipeline hâlinde birleştirip "Bu film gerçekten harikaydı." örneği üzerinden uçtan uca uyguladın. Görevin türüne göre hangi adımların gerekli olduğunu da kavradın.</div>'

,

/* ================================================================
   ENGLISH
   ================================================================ */
en:
'<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div><p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p><ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none"><li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrices</a> <span style="opacity:0.55;font-size:0.82em">(Math L72)</span></li><li><a href="/tutorials/matematik/91" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Geometric Vectors</a> <span style="opacity:0.55;font-size:0.82em">(Math L91)</span></li><li><a href="/tutorials/matematik/94" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Probability Basics</a> <span style="opacity:0.55;font-size:0.82em">(Math L94)</span></li></ul></div><script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> What Natural Language Processing (NLP) is, what it solves and why, and how a computer actually "reads" a sentence. We will follow a single concrete example throughout — <em>"This movie was truly amazing."</em> — from raw text to a clean token list ready for a machine learning model. Tokenization, lowercasing, noise removal, stop word filtering, and reducing words to roots — every step in order.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Explain what NLP is and how a computer sees a sentence as a byte stream</li>'
+ '<li>Tokenize a sentence with NLTK and regex into clean word units</li>'
+ '<li>Apply lowercasing, punctuation stripping, and stop-word filtering</li>'
+ '<li>Compare stemming and lemmatization and reduce words to their roots</li>'
+ '<li>Combine every step into a working raw-text-to-token-list pipeline</li>'
+ '</ul>'
+ '</div>'

/* 1. What is NLP? */
+ '<h2 class="l-title">1. What is NLP?</h2>'

+ '<p class="l-text">Natural Language Processing (NLP) is the set of methods that let computers understand, generate, and manipulate human language. It is a subfield of artificial intelligence sitting at the intersection of linguistics, statistics, machine learning, and in recent years deep learning.</p>'

+ '<p class="l-text">Let us start with a concrete example we will follow throughout the lesson:</p>'

+ '<div class="calc-example"><div class="example-label">RUNNING EXAMPLE FOR THIS LESSON</div><div class="example-body">'
+ '<p class="l-text" style="font-size:1.25rem;text-align:center;margin:1rem 0"><code style="font-size:1.2rem">"This movie was truly amazing."</code></p>'
+ '<p class="l-text">When you read this sentence, you instantly know:</p>'
+ '<ul class="l-list">'
+ '<li>The sentence is about a <strong>movie</strong>.</li>'
+ '<li>The speaker <strong>liked</strong> it — the sentiment is positive.</li>'
+ '<li>The word <strong>"truly"</strong> intensifies the praise; this is stronger than a plain "good".</li>'
+ '<li><strong>"was"</strong> is past tense; the speaker has already watched the movie.</li>'
+ '</ul>'
+ '</div></div>'

+ '<p class="l-text">You made these inferences in milliseconds because you have spent years internalising language. For a computer the same sentence is initially just a <strong>string of characters</strong>. What the computer literally sees is the numerical code of each character:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>BYTES</span> Numerical codes for each character (UTF-8)</div><div class="code-block"><pre><code><span class="cm"># UTF-8 codes for "This movie was truly amazing."</span>'
+ '\nT = 84    h = 104   i = 105   s = 115   (space) = 32'
+ '\nm = 109   o = 111   v = 118   i = 105   e = 101   (space) = 32'
+ '\nw = 119   a = 97    s = 115   (space) = 32'
+ '\nt = 116   r = 114   u = 117   l = 108   y = 121   (space) = 32'
+ '\na = 97    m = 109   a = 97    z = 122   i = 105   n = 110   g = 103   . = 46</code></pre></div></div>'

+ '<p class="l-text"><strong>What this shows:</strong> When the computer sees "movie" it actually sees the numbers 109, 111, 118, 105, 101. "amazing" is just seven numbers in a row. By themselves these numbers carry no meaning. NLP\'s job starts here: to take this character sequence and bring the computer to the inferences you just made effortlessly — "What is this about?", "Positive or negative?", "Past or present?".</p>'

+ '<h3 class="l-subtitle">Why is NLP a Hard Problem?</h3>'

+ '<p class="l-text">Language flows so naturally in our daily lives that thinking of it as an engineering problem feels strange. Yet NLP grapples with many real difficulties:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Ambiguity:</strong> "He saw the man with the telescope." Did he use the telescope, or did the man have it? Context decides.</li>'
+ '<li><strong>Sarcasm and irony:</strong> "What an amazing day, three hours stuck in traffic." The word "amazing" is not positive here — it is ironic. Naïve word counts miss this.</li>'
+ '<li><strong>Morphological richness:</strong> Some languages pack many ideas into a single word. Turkish "<em>evlerimizdekilerden</em>" is one word that requires seven words in English: "<em>from those that are in our houses</em>".</li>'
+ '<li><strong>Spelling variation:</strong> "amazing", "AMAZING", "amaaazing", "amazng" — all the same idea, all different strings to a model.</li>'
+ '</ul>'

+ '<div class="l-note"><strong>Important:</strong> NLP is not magic. Step by step, with mathematical and statistical operations, we turn this character string first into <em>words</em>, then into <em>numbers</em>, then into <em>vectors</em>, and finally into <em>meaning representations</em>. The first few lessons of this course climb those steps one at a time. This lesson covers the very first one — turning raw text into clean tokens.</div>'

/* 2. Where is NLP used? */
+ '<h2 class="l-title">2. Where is NLP Used?</h2>'

+ '<p class="l-text">NLP is everywhere in daily life. You probably interact with dozens of NLP systems every day without realising it:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Search engines:</strong> When you type "how do I get to the airport" into Google, the engine reads the whole sentence and returns travel directions, not just keyword matches. This is intent understanding.</li>'
+ '<li><strong>Machine translation:</strong> Google Translate, DeepL, and similar tools translate between languages by understanding whole sentences, not by word-by-word substitution.</li>'
+ '<li><strong>Voice assistants:</strong> Siri, Alexa, Google Assistant — first convert speech to text, then understand the meaning, then generate a response. Three NLP/speech problems chained together.</li>'
+ '<li><strong>Sentiment analysis:</strong> Platforms like Amazon and IMDB automatically detect whether a review is positive or negative. Critical for customer service at scale. The main subject of <a href="/tutorials/nlp/4">Lesson 4</a>.</li>'
+ '<li><strong>Chatbots:</strong> Automated customer-service agents on banking, insurance, and e-commerce sites. Modern examples use large language models — see <a href="/tutorials/nlp/11">Lesson 11</a> and <a href="/tutorials/nlp/12">Lesson 12</a>.</li>'
+ '<li><strong>Summarisation:</strong> Reducing a long news article to three sentences, or a clinical report to one paragraph.</li>'
+ '<li><strong>Named Entity Recognition (NER):</strong> Pulling out person/place/organisation names from news, or disease names from clinical notes. <a href="/tutorials/nlp/7">Lesson 7</a>.</li>'
+ '<li><strong>Spam &amp; fake content detection:</strong> Catching bot messages, fake reviews, and disinformation on social media.</li>'
+ '</ul>'

+ '<p class="l-text">In this course we will progressively build the techniques behind these applications. Here is the 12-lesson roadmap:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Lesson 1 (now)</div><div class="card-body">Cleaning raw text and turning it into tokens — producing the kind of data a computer can actually work with.</div></div>'
+ '<div class="calc-card"><div class="card-title">Lessons 2-3</div><div class="card-body">Turning tokens into numbers: Bag-of-Words, TF-IDF. First classical classifiers (Naive Bayes, logistic regression).</div></div>'
+ '<div class="calc-card"><div class="card-title">Lessons 4-6</div><div class="card-body">Sentiment analysis, word embeddings (Word2Vec/GloVe), topic modelling (LDA).</div></div>'
+ '<div class="calc-card"><div class="card-title">Lessons 7-9</div><div class="card-body">Sequential models: sequence labelling/NER, language models, RNN/LSTM, attention.</div></div>'
+ '<div class="calc-card"><div class="card-title">Lessons 10-11</div><div class="card-body">Transformer architecture, BERT, GPT, large language models, task-specific fine-tuning.</div></div>'
+ '<div class="calc-card"><div class="card-title">Lesson 12</div><div class="card-body">Production systems: RAG, agents, multilingual NLP, ethics, end-to-end project template.</div></div>'
+ '</div>'

/* 3. Problems with raw text */
+ '<h2 class="l-title">3. The Problems with Raw Text</h2>'

+ '<p class="l-text">"This movie was truly amazing." rarely arrives this clean in the real world. Users on review sites, social media, and forums produce far messier text. Here is what a real IMDB review carrying the same sentiment might look like:</p>'

+ '<div class="calc-example"><div class="example-label">REAL WORLD — MESSY TEXT</div><div class="example-body">'
+ '<p class="l-text"><strong>Raw:</strong></p>'
+ '<pre style="background:rgba(248,113,113,0.08);padding:1rem;border-radius:8px;font-size:.95rem;white-space:pre-wrap;word-wrap:break-word">' + '&lt;p&gt;THIS MOVIE WAS TRULY AMAZING!!!  😍😍 you must watch it 👍 https://imdb.com/title/tt12345 #amazing #musthave  &lt;/p&gt;' + '</pre>'
+ '<p class="l-text"><strong>What we want:</strong></p>'
+ '<pre style="background:rgba(78,205,196,0.08);padding:1rem;border-radius:8px;font-size:.95rem">this movie was truly amazing you must watch it</pre>'
+ '</div></div>'

+ '<p class="l-text">The difference: the messy version has HTML tags (<code>&lt;p&gt;</code>), wild capitalisation, extra whitespace, emojis, URLs, hashtags, and exclamation marks. None of it carries information. It is all <strong>noise</strong>. Classical machine learning models (Naive Bayes, SVM) suffer badly here — they treat every distinct spelling as a separate feature, splitting the signal across many sparse columns.</p>'

+ '<p class="l-text">Modern large language models (BERT, GPT) are far more robust to this noise because they were trained on dirty internet text in the first place. Even so, stripping HTML and URLs is always sensible. This lesson covers the cleaning steps required for classical models; at the end we summarise which ones still matter for modern models.</p>'

+ '<div class="l-note"><strong>The golden rule of NLP:</strong> No model is smarter than the data it receives. Garbage in, garbage out. Preprocessing is unglamorous work, but it is the single highest-impact step in an NLP pipeline.</div>'

/* 4. Tokenization */
+ '<h2 class="l-title">4. Tokenization — Splitting Sentences into Pieces</h2>'

+ '<p class="l-text">A computer cannot process an entire sentence as one blob. It first needs to break the sentence into smaller units called <strong>tokens</strong>. A token is usually a word, but can be a punctuation mark, a number, or a subword piece. The process is called <strong>tokenization</strong> and it is the first step of nearly every NLP pipeline.</p>'

+ '<p class="l-text">The simplest approach is to split on whitespace. Intuitively:</p>'

+ '<div class="calc-example"><div class="example-label">TOKENIZATION — BASIC INTUITION</div><div class="example-body">'
+ '<p class="l-text" style="text-align:center"><code style="font-size:1.05rem">"This movie was truly amazing."</code></p>'
+ '<p class="l-text" style="text-align:center;color:var(--accent)">↓ split on whitespace</p>'
+ '<p class="l-text" style="text-align:center"><code style="font-size:1.05rem">["This", "movie", "was", "truly", "amazing."]</code></p>'
+ '<p class="l-text">Notice: the period is still attached to "amazing." A smarter tokenizer separates punctuation as its own token:</p>'
+ '<p class="l-text" style="text-align:center"><code style="font-size:1.05rem">["This", "movie", "was", "truly", "amazing", "."]</code></p>'
+ '</div></div>'

+ '<p class="l-text">There are two common ways to do this in Python.</p>'

+ '<h3 class="l-subtitle">Way 1: Simple whitespace split</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Whitespace split</div><div class="code-block"><pre><code>text = <span class="str">"This movie was truly amazing."</span>'
+ '\ntokens = text.<span class="fn">split</span>()'
+ '\n<span class="fn">print</span>(tokens)'
+ '\n<span class="cm"># [\'This\', \'movie\', \'was\', \'truly\', \'amazing.\']</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Python\'s built-in <code>split()</code> method splits the string on whitespace. Fast, no library required. But it cannot separate punctuation — "amazing." stays as one token. Useful for quick experiments, not enough for real projects.</p>'

+ '<h3 class="l-subtitle">Way 2: NLTK\'s smart tokenizer</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> NLTK word_tokenize</div><div class="code-block"><pre><code><span class="kw">import</span> nltk'
+ '\nnltk.<span class="fn">download</span>(<span class="str">\'punkt_tab\'</span>)  <span class="cm"># tokenizer model (one time)</span>'
+ '\n<span class="kw">from</span> nltk.tokenize <span class="kw">import</span> word_tokenize'
+ '\n'
+ '\ntokens = <span class="fn">word_tokenize</span>(<span class="str">"This movie was truly amazing."</span>)'
+ '\n<span class="fn">print</span>(tokens)'
+ '\n<span class="cm"># [\'This\', \'movie\', \'was\', \'truly\', \'amazing\', \'.\']</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same idea using only Python\'s `re` module — split a sentence into tokens including punctuation.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>import re\ntext = "This movie was truly amazing."\ntokens = re.findall(r"\\w+|[^\\w\\s]", text, re.UNICODE)\nprint(tokens)\n# [\'This\', \'movie\', \'was\', \'truly\', \'amazing\', \'.\']\nprint(\'# tokens:\', len(tokens))</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> NLTK\'s <code>word_tokenize</code> function emits each punctuation mark as its own token and keeps abbreviations like "Dr." intact (so it does not mistake the dot for a sentence end). A reasonable default for English; for richer Turkish handling there is Zemberek.</p>'

+ '<div class="l-note"><strong>Side note — sentence tokenization:</strong> If you want to split a paragraph into sentences first, NLTK provides <code>sent_tokenize</code>. The logic is similar but uses periods, question marks, and exclamation marks as separators while skipping the dots in abbreviations (Dr., Prof.).</div>'

+ '<h3 class="l-subtitle">The Tokenization Challenge of Turkish</h3>'

+ '<p class="l-text">Turkish is an <strong>agglutinative</strong> language — a single word can carry many suffixes that English needs whole phrases to express:</p>'

+ '<div class="calc-example"><div class="example-label">TURKISH AGGLUTINATIVE STRUCTURE</div><div class="example-body">'
+ '<p class="l-text"><code>evlerimizdekilerden</code></p>'
+ '<p class="l-text">= ev (house) + ler (plural) + imiz (our) + de (in) + ki (those) + ler (plural) + den (from)</p>'
+ '<p class="l-text">English: <em>"from those that are in our houses"</em> — seven words.</p>'
+ '</div></div>'

+ '<p class="l-text">This is hard for tokenization. If "evlerimizdekilerden" stays as one token, the model sees a very rare word and cannot generalise. Solutions:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Morphological analyser (Zemberek):</strong> Splits the word into its suffixes using real grammar rules. Turkish-specific, accurate, but slower.</li>'
+ '<li><strong>Subword tokenization:</strong> Breaks words into statistically learned subword units. The default approach used by modern large language models (BERT, GPT). Covered in <a href="/tutorials/nlp/5">Lesson 5</a>.</li>'
+ '</ul>'

/* 5. Normalization */
+ '<h2 class="l-title">5. Normalization — Mapping Same Meaning to Same Form</h2>'

+ '<p class="l-text">Look at these three tokens:</p>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text" style="text-align:center"><code>"Amazing"</code> &nbsp; <code>"amazing"</code> &nbsp; <code>"AMAZING"</code></p>'
+ '</div></div>'

+ '<p class="l-text">You know they all mean the same thing. The computer does not. Classical models treat each spelling as a separate feature; three tokens means three columns and the signal scatters. The fix: bring them all to one form. The most common method is to lowercase everything.</p>'

+ '<h3 class="l-subtitle">Lowercasing</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Simple lowercase</div><div class="code-block"><pre><code>text = <span class="str">"This Movie Was Truly Amazing."</span>'
+ '\ntext_lower = text.<span class="fn">lower</span>()'
+ '\n<span class="fn">print</span>(text_lower)'
+ '\n<span class="cm"># "this movie was truly amazing."</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Python\'s <code>lower()</code> method converts every uppercase letter to lowercase. One line, fast.</p>'

+ '<div class="l-warn"><strong>Turkish trap:</strong> The Turkish letter <strong>İ</strong> (capital dotted I) under Python\'s default <code>lower()</code> can become <code>"i"</code> (an i with a combining dot above) instead of plain <code>"i"</code>. This is an encoding subtlety. For Turkish, prefer <code>str.casefold()</code> or set the locale correctly. Always test with a few Turkish examples in production — otherwise you can silently lose half of your words.</div>'

+ '<h3 class="l-subtitle">Stripping HTML, URLs, and Emojis</h3>'

+ '<p class="l-text">Web text typically arrives with HTML tags and URLs. The standard tool for stripping these is the <strong>regular expression</strong> (regex). A regex is a pattern; it lets us find and replace specific shapes inside text.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Cleaning with regex</div><div class="code-block"><pre><code><span class="kw">import</span> re'
+ '\n'
+ '\nraw = <span class="str">"&lt;p&gt;This movie was truly amazing https://imdb.com/abc 😍&lt;/p&gt;"</span>'
+ '\n'
+ '\n<span class="cm"># 1. Strip HTML tags</span>'
+ '\ntext = re.<span class="fn">sub</span>(<span class="str">r\'&lt;[^&gt;]+&gt;\'</span>, <span class="str">\'\'</span>, raw)'
+ '\n<span class="cm"># 2. Strip URLs</span>'
+ '\ntext = re.<span class="fn">sub</span>(<span class="str">r\'https?://\\S+\'</span>, <span class="str">\'\'</span>, text)'
+ '\n<span class="cm"># 3. Collapse multiple spaces to one</span>'
+ '\ntext = re.<span class="fn">sub</span>(<span class="str">r\'\\s+\'</span>, <span class="str">\' \'</span>, text).<span class="fn">strip</span>()'
+ '\n<span class="fn">print</span>(text)'
+ '\n<span class="cm"># "This movie was truly amazing 😍"</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Three steps clean the text. The first line removes HTML tags — anything inside angle brackets (<code>&lt;p&gt;</code>, <code>&lt;br&gt;</code>, <code>&lt;a href="..."&gt;</code> etc.). The second strips URLs — anything starting with "https://" or "http://" up to the next whitespace. The third collapses runs of whitespace to a single space and trims the ends. The emoji is preserved here; if you also want to strip emojis you need a separate Unicode regex pattern.</p>'

/* 6. Stop words */
+ '<h2 class="l-title">6. Stop Words — Removing Filler</h2>'

+ '<p class="l-text">Some words appear in nearly every sentence and carry little meaning on their own. In English: <em>the, is, a, of, at, in, on</em>. In Turkish: <em>ve, ile, bir, bu, şu, için</em>. These are called <strong>stop words</strong>. For classical models, removing them lets the model focus on the words that actually carry information and reduces compute cost.</p>'

+ '<div class="calc-example"><div class="example-label">STOP WORDS APPLIED</div><div class="example-body">'
+ '<p class="l-text"><strong>Before:</strong> <code>"This movie was really truly amazing"</code></p>'
+ '<p class="l-text"><strong>After:</strong> <code>"movie really truly amazing"</code></p>'
+ '<p class="l-text">Removed: <em>This, was</em>. The signal that the speaker liked the movie is preserved; the word count drops.</p>'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> NLTK English stop words</div><div class="code-block"><pre><code><span class="kw">import</span> nltk'
+ '\nnltk.<span class="fn">download</span>(<span class="str">\'stopwords\'</span>)'
+ '\n<span class="kw">from</span> nltk.corpus <span class="kw">import</span> stopwords'
+ '\n'
+ '\nen_stops = <span class="fn">set</span>(stopwords.<span class="fn">words</span>(<span class="str">\'english\'</span>))'
+ '\ntokens = [<span class="str">"this"</span>, <span class="str">"movie"</span>, <span class="str">"was"</span>, <span class="str">"really"</span>, <span class="str">"truly"</span>, <span class="str">"amazing"</span>]'
+ '\n'
+ '\nclean = [t <span class="kw">for</span> t <span class="kw">in</span> tokens <span class="kw">if</span> t <span class="kw">not</span> <span class="kw">in</span> en_stops]'
+ '\n<span class="fn">print</span>(clean)'
+ '\n<span class="cm"># [\'movie\', \'really\', \'truly\', \'amazing\']</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Hard-code a tiny stopword list and filter — no NLTK needed.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>STOP = {\'a\',\'an\',\'the\',\'is\',\'was\',\'this\',\'that\',\'with\',\'and\',\'but\',\'of\',\'in\',\'to\',\'for\',\'on\',\'at\',\'be\',\'are\'}\n\ntext = "This movie was truly amazing and I really enjoyed it."\nimport re\ntokens = [t.lower() for t in re.findall(r"\\w+", text, re.UNICODE)]\nfiltered = [t for t in tokens if t not in STOP]\n\nprint(\'all     :\', tokens)\nprint(\'filtered:\', filtered)\nprint(\'removed :\', set(tokens) - set(filtered))</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Loads NLTK\'s English stop word list and filters the listed tokens. We use a <code>set</code> for the lookup because membership in a list is O(n) but in a set is O(1) — much faster across thousands of reviews.</p>'

+ '<div class="l-warn"><strong>WATCH OUT — sentiment analysis trap:</strong> The word <code>"not"</code> is in many stop word lists. NEVER drop it for sentiment analysis. <em>"the movie was good"</em> versus <em>"the movie was not good"</em> differ only by this single word. The same trap exists for Turkish <code>"değil"</code>. Do not blindly apply a stop word list — customise it for the task, read it through and edit by hand if needed.</div>'

/* 7. Stemming & Lemmatization */
+ '<h2 class="l-title">7. Stemming &amp; Lemmatization — Reducing to Roots</h2>'

+ '<p class="l-text">Look at these three tokens:</p>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text" style="text-align:center"><code>"amazing"</code> &nbsp; <code>"amazed"</code> &nbsp; <code>"amazes"</code></p>'
+ '</div></div>'

+ '<p class="l-text">All three are forms of the verb <em>"to amaze"</em>. The meaning is shared; the inflection differs. If a model treats them as three separate words, the information in "the movie amazed me" cannot be linked to "the movie amazes me". <strong>Reducing to a root</strong> maps these inflections to a single (or near-single) form.</p>'

+ '<p class="l-text">There are two methods: <strong>stemming</strong> and <strong>lemmatization</strong>. They are different jobs, often confused.</p>'

+ '<h3 class="l-subtitle">Stemming — Fast and rule-based</h3>'

+ '<p class="l-text"><strong>Stemming</strong> chops suffixes off words using rough rules. Fast, but the resulting "stem" may not be a real word. The Porter stemmer for English produces:</p>'

+ '<ul class="l-list">'
+ '<li>"amazing" → "amaz"</li>'
+ '<li>"running" → "run"</li>'
+ '<li>"flies" → "fli" (not a real word, but a consistent form)</li>'
+ '<li>"happiness" → "happi"</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Lemmatization — Slow but smart</h3>'

+ '<p class="l-text"><strong>Lemmatization</strong> performs morphological analysis to find the actual dictionary form (the lemma). Slower because it needs grammar rules, but the results are real words:</p>'

+ '<ul class="l-list">'
+ '<li>"amazing" → "amaze"</li>'
+ '<li>"flies" → "fly"</li>'
+ '<li>"better" → "good" (comparison resolved)</li>'
+ '<li>"went" → "go"</li>'
+ '</ul>'

+ '<p class="l-text">For Turkish, the most powerful morphological analyser is <strong>Zemberek</strong> (Java-based with a Python wrapper). NLTK and spaCy do not fully support Turkish, so serious Turkish NLP work usually calls Zemberek.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Porter stemmer (English)</div><div class="code-block"><pre><code><span class="kw">from</span> nltk.stem <span class="kw">import</span> PorterStemmer'
+ '\n'
+ '\nstemmer = <span class="fn">PorterStemmer</span>()'
+ '\nwords = [<span class="str">"amazing"</span>, <span class="str">"amazed"</span>, <span class="str">"running"</span>, <span class="str">"happiness"</span>, <span class="str">"better"</span>]'
+ '\nstems = [stemmer.<span class="fn">stem</span>(w) <span class="kw">for</span> w <span class="kw">in</span> words]'
+ '\n<span class="fn">print</span>(stems)'
+ '\n<span class="cm"># [\'amaz\', \'amaz\', \'run\', \'happi\', \'better\']</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy suffix-stripping stemmer in pure Python — same purpose as Porter/Snowball.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>def stem(word):\n    for suf in [\'lerden\',\'larin\',\'ların\',\'lerin\',\'larda\',\'lerde\',\'lar\',\'ler\',\'dan\',\'den\',\'tan\',\'ten\',\'dir\',\'tir\',\'ydi\',\'ydı\',\'ing\',\'ed\',\'s\']:\n        if word.endswith(suf) and len(word) > len(suf) + 2:\n            return word[:-len(suf)]\n    return word\n\nwords = [\'evlerimizden\',\'arabaların\',\'güzellik\',\'running\',\'played\',\'cats\']\nfor w in words:\n    print(f\'{w:>20} -> {stem(w)}\')</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Uses NLTK\'s Porter stemmer (a classic algorithm from 1980) to chop suffixes by rules. "amazing" and "amazed" both collapse to "amaz" — the stemmer does not produce a real word, but produces a consistent form. Notice that "better" stays as "better" — Porter does not know it is the comparative of "good". A lemmatizer would catch that.</p>'

+ '<h3 class="l-subtitle">Why Reducing to Roots Matters — Vocabulary Shrinks</h3>'

+ '<p class="l-text">Reducing to roots is rarely an end in itself; its real benefit is shrinking the vocabulary. Five inflected forms of the same root collapse to one. Classical machine learning models then need fewer parameters and generalise better.</p>'

+ '<div class="plotly-graph"><div id="plot-vocab-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var stage=["Raw","Lowercased","Stop words removed","Stemmed"];'
+ 'var vocab=[45200,32800,29400,16500];'
+ 'var t1={x:stage,y:vocab,type:"bar",marker:{color:T.accent},text:vocab.map(function(v){return v.toLocaleString("en");}),textposition:"outside"};'
+ 'var layout={title:{text:"Effect of preprocessing steps on vocabulary size",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid},yaxis:{color:T.text,gridcolor:T.grid,title:"Unique tokens"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,margin:{t:50,r:30,b:60,l:80},font:{color:T.text,size:11}};'
+ 'if(document.getElementById("plot-vocab-en"))Plotly.newPlot("plot-vocab-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Starting from 45,200 unique tokens in a movie-review corpus. Lowercasing alone removes ~12,000 (case variants merge). Stop word removal drops another 3,400. Stemming is the most aggressive: "amazing, amazed, amazes" collapse to one stem and the vocabulary halves. Smaller vocabulary = faster training and better generalisation for classical models.</div>'

/* 8. Pipeline */
+ '<h2 class="l-title">8. Putting It Together — A Mini Pipeline</h2>'

+ '<p class="l-text">Now let us combine every step into a single <strong>pipeline</strong>. The pipeline concept matters: it takes raw data, runs it through a series of steps, and emits clean tokens at the end. Each step\'s output is the next step\'s input.</p>'

+ '<div class="calc-example"><div class="example-label">PIPELINE FLOW</div><div class="example-body">'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ '&lt;p&gt;THIS MOVIE WAS TRULY AMAZING!!! 😍 https://imdb.com&lt;/p&gt;'
+ '<br>↓ <em>strip HTML/URL</em>'
+ '<br><span style="opacity:.65;font-size:.85em">tags (&lt;p&gt;) and links are removed</span>'
+ '<br>THIS MOVIE WAS TRULY AMAZING!!! 😍'
+ '<br>↓ <em>lowercase</em>'
+ '<br><span style="opacity:.65;font-size:.85em">capital and lowercase variants of the same word collapse to one</span>'
+ '<br>this movie was truly amazing!!! 😍'
+ '<br>↓ <em>tokenize</em>'
+ '<br><span style="opacity:.65;font-size:.85em">the sentence is split into words and punctuation marks</span>'
+ '<br>["this", "movie", "was", "truly", "amazing", "!", "!", "!", "😍"]'
+ '<br>↓ <em>drop punctuation / emoji / numbers</em>'
+ '<br><span style="opacity:.65;font-size:.85em">only tokens that are letters are kept, the rest are dropped</span>'
+ '<br>["this", "movie", "was", "truly", "amazing"]'
+ '<br>↓ <em>drop stop words</em>'
+ '<br><span style="opacity:.65;font-size:.85em">filler words like "this" and "was" are removed</span>'
+ '<br>["movie", "truly", "amazing"]'
+ '<br>↓ <em>stem (reduce to root)</em>'
+ '<br><span style="opacity:.65;font-size:.85em">"amazing" → "amaz" — suffixes are chopped, the meaning core stays</span>'
+ '<br>["movi", "truli", "amaz"]'
+ '</p>'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> End-to-end pipeline</div><div class="code-block"><pre><code><span class="kw">import</span> re'
+ '\n<span class="kw">import</span> nltk'
+ '\n<span class="kw">from</span> nltk.tokenize <span class="kw">import</span> word_tokenize'
+ '\n<span class="kw">from</span> nltk.corpus <span class="kw">import</span> stopwords'
+ '\n<span class="kw">from</span> nltk.stem <span class="kw">import</span> PorterStemmer'
+ '\n'
+ '\nnltk.<span class="fn">download</span>(<span class="str">\'punkt_tab\'</span>, quiet=<span class="kw">True</span>)'
+ '\nnltk.<span class="fn">download</span>(<span class="str">\'stopwords\'</span>, quiet=<span class="kw">True</span>)'
+ '\n'
+ '\nstops = <span class="fn">set</span>(stopwords.<span class="fn">words</span>(<span class="str">\'english\'</span>))'
+ '\nstemmer = <span class="fn">PorterStemmer</span>()'
+ '\n'
+ '\n<span class="kw">def</span> <span class="fn">preprocess</span>(text):'
+ '\n    text = re.<span class="fn">sub</span>(<span class="str">r\'&lt;[^&gt;]+&gt;\'</span>, <span class="str">\'\'</span>, text)            <span class="cm"># strip HTML</span>'
+ '\n    text = re.<span class="fn">sub</span>(<span class="str">r\'https?://\\S+\'</span>, <span class="str">\'\'</span>, text)         <span class="cm"># strip URLs</span>'
+ '\n    text = text.<span class="fn">lower</span>()                              <span class="cm"># lowercase</span>'
+ '\n    tokens = <span class="fn">word_tokenize</span>(text)                      <span class="cm"># tokenize</span>'
+ '\n    tokens = [t <span class="kw">for</span> t <span class="kw">in</span> tokens <span class="kw">if</span> t.<span class="fn">isalpha</span>()]    <span class="cm"># keep letters only</span>'
+ '\n    tokens = [t <span class="kw">for</span> t <span class="kw">in</span> tokens <span class="kw">if</span> t <span class="kw">not</span> <span class="kw">in</span> stops] <span class="cm"># drop stop words</span>'
+ '\n    tokens = [stemmer.<span class="fn">stem</span>(t) <span class="kw">for</span> t <span class="kw">in</span> tokens]      <span class="cm"># stem</span>'
+ '\n    <span class="kw">return</span> tokens'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="fn">preprocess</span>(<span class="str">"This movie was truly amazing! &lt;br&gt; https://imdb.com"</span>))'
+ '\n<span class="cm"># [\'movi\', \'truli\', \'amaz\']</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">End-to-end mini pipeline in pure Python — strip, lowercase, tokenize, filter, stem.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>import re\n\nSTOP = {\'a\',\'an\',\'the\',\'is\',\'was\',\'this\',\'that\',\'with\',\'and\',\'but\',\'of\',\'in\',\'to\',\'for\',\'on\',\'at\',\'be\'}\n\ndef stem(w):\n    for suf in [\'ing\',\'ed\',\'ly\',\'es\',\'s\']:\n        if w.endswith(suf) and len(w) > len(suf) + 2:\n            return w[:-len(suf)]\n    return w\n\ndef preprocess(text):\n    text = re.sub(r\'&lt;[^&gt;]+&gt;\', \'\', text)\n    text = re.sub(r\'https?://\\S+\', \'\', text)\n    text = text.lower()\n    tokens = re.findall(r"\\w+", text, re.UNICODE)\n    tokens = [t for t in tokens if t not in STOP]\n    return [stem(t) for t in tokens]\n\nprint(preprocess("This movie was truly amazing! &lt;br&gt; https://imdb.com"))</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Takes a sentence and applies, in order: strip HTML tags, strip URLs, lowercase, tokenize into words and punctuation, keep only alphabetic tokens, drop stop words, stem the rest. The output is a clean, normalised, ready-to-vectorize token list. Call this function in a loop over thousands of reviews to preprocess an entire dataset.</p>'

+ '<h3 class="l-subtitle">Why Order Matters</h3>'

+ '<p class="l-text">Pipeline steps are intentionally ordered. The wrong order silently loses information. A few typical examples:</p>'

+ '<ul class="l-list">'
+ '<li><strong>HTML stripping comes first.</strong> Otherwise tag content like <code>&lt;br&gt;</code> ends up tokenized — "br" appears as a real-looking word and pollutes the vocabulary.</li>'
+ '<li><strong>Lowercase before stop word filtering.</strong> Otherwise "The" cannot be matched against the lowercase stop word "the" and stays in.</li>'
+ '<li><strong>Stemming last.</strong> If you stem first, "doesn\'t" becomes "doesn" and your stop word list (which expects "doesn\'t") misses it. Worse, for sentiment "not" might collapse and drop critical negation.</li>'
+ '</ul>'

/* 9. Task table */
+ '<h2 class="l-title">9. Which Steps for Which Task?</h2>'

+ '<p class="l-text">Applying every step in every project is <strong>wrong</strong>. The right preprocessing depends on the task. The table below is a reasonable starting point for common tasks:</p>'

+ '<div style="overflow-x:auto;margin:1.2rem 0">'
+ '<table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.6rem;color:var(--accent)">Task</th><th style="padding:.6rem">Lowercase</th><th style="padding:.6rem">Stop words</th><th style="padding:.6rem">Stemming</th><th style="padding:.6rem">Notes</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.6rem"><strong>Sentiment analysis</strong></td><td style="text-align:center">✓</td><td style="text-align:center">No</td><td style="text-align:center">Sometimes</td><td style="padding:.6rem;color:var(--text-dim)">Keep negation words like "not"</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.6rem"><strong>Document classification</strong></td><td style="text-align:center">✓</td><td style="text-align:center">✓</td><td style="text-align:center">✓</td><td style="padding:.6rem;color:var(--text-dim)">Maximum compression usually OK</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.6rem"><strong>Named Entity Recognition (NER)</strong></td><td style="text-align:center">No</td><td style="text-align:center">No</td><td style="text-align:center">No</td><td style="padding:.6rem;color:var(--text-dim)">Capitalisation signals names</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.6rem"><strong>Question answering</strong></td><td style="text-align:center">No</td><td style="text-align:center">No</td><td style="text-align:center">No</td><td style="padding:.6rem;color:var(--text-dim)">Preserve full meaning</td></tr>'
+ '<tr><td style="padding:.6rem"><strong>BERT/GPT input</strong></td><td style="text-align:center">No</td><td style="text-align:center">No</td><td style="text-align:center">No</td><td style="padding:.6rem;color:var(--text-dim)">Just strip HTML/URLs</td></tr>'
+ '</tbody></table></div>'

+ '<p class="l-text">The takeaway: <strong>classical ML (Naive Bayes, SVM) wants aggressive cleaning; modern transformers (BERT, GPT) need almost none because subword tokenizers handle case and rare words natively.</strong> Pre-2018, preprocessing was an art. Post-2020, it matters less and less — but stripping HTML and URLs is still always sensible.</p>'

/* 10. Next */
+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">You now have a clean token list: <code>["movi", "truli", "amaz"]</code>. But machine learning models do not consume words; they consume <strong>numbers</strong>. <a href="/tutorials/nlp/2">Lesson 2</a> shows how to turn these tokens into numbers using <strong>Bag-of-Words</strong> and <strong>TF-IDF</strong> — the foundations of classical NLP, still widely used in practice.</p>'

+ '<p class="l-text">Then in <a href="/tutorials/nlp/3">Lesson 3</a> we plug those numbers into a real classifier and train our first NLP model. After that we move to deep learning, transformers, BERT and GPT. But everything stands on the steps you learned today — without clean data, no clever model is smart enough.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> What NLP is and where it is used. How a computer sees a sentence (a string of characters). The cleaning steps to turn raw text into useful tokens: tokenization, lowercasing, regex-based noise removal, stop word filtering, stemming and lemmatization. You combined all of these into a pipeline applied end-to-end on the example "This movie was truly amazing." You also learned which steps to use for which task.</div>'

};
