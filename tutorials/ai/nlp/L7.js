/* nlp-new-L7.js — NLP Course Lesson 7: Dizi Etiketleme & Adlandırılmış Varlık Tanıma (NER) — TR + EN */
var NLP_L7 = {

tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=[];g.__nlpChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Şimdiye kadar bütün cümleyi tek etiket olarak sınıflandırıyorduk (olumlu/olumsuz). Bu derste her <em>kelimeye</em> ayrı etiket atamayı öğreniyoruz: <strong>dizi etiketleme (sequence labeling)</strong>. En yaygın kullanım — <strong>Adlandırılmış Varlık Tanıma (NER)</strong> — bir cümledeki kişi, yer, kurum, tarih gibi varlıkları otomatik bulur. <em>"Mikail Erasmus için İspanya\'ya gitti"</em> cümlesinde <em>Mikail</em> bir kişi, <em>İspanya</em> bir yerdir.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Cümle bazlı sınıflandırma ile token bazlı dizi etiketleme arasındaki farkı görmeyi</li>'
+ '<li>BIO ve BIOES etiketleme şemalarıyla NER veri formatını okumayı</li>'
+ '<li>HMM ve CRF\'in dizi etiketlemede neden BiLSTM\'den önce standart olduğunu anlamayı</li>'
+ '<li>BiLSTM-CRF mimarisini PyTorch\'ta NER için kurmayı</li>'
+ '<li>HuggingFace BERTurk-NER ile Türkçe cümlelerde kişi/yer/kurum çıkarmayı</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Dizi Etiketleme Nedir?</h2>'

+ '<p class="l-text"><strong>Dizi etiketleme</strong>, bir token dizisindeki her bir token\'a kategorik bir etiket atama görevidir. Cümle bazlı sınıflandırmadan farkı: çıktı bir tek etiket değil, girdi ile aynı uzunlukta bir etiket dizisi.</p>'

+ '<div class="calc-example"><div class="example-label">CÜMLE BAZLI vs DİZİ ETİKETLEME</div><div class="example-body">'
+ '<p class="l-text"><strong>Cümle bazlı:</strong> Cümle → tek etiket</p>'
+ '<p class="l-text" style="font-family:var(--mono);text-align:center"><code>"Bu film harikaydı"</code> &nbsp;→&nbsp; <strong>olumlu</strong></p>'
+ '<p class="l-text" style="margin-top:.8rem"><strong>Dizi etiketleme:</strong> Cümle → her kelime için bir etiket</p>'
+ '<p class="l-text" style="font-family:var(--mono);text-align:center;line-height:1.9">'
+ '<code>Mikail / Erasmus / için / İspanya / \'ya / gitti</code>'
+ '<br>↓'
+ '<br><code>B-PER / B-ORG / O / B-LOC / O / O</code>'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Yaygın dizi etiketleme görevleri:</p>'

+ '<ul class="l-list">'
+ '<li><strong>NER (Adlandırılmış Varlık Tanıma):</strong> kişi, yer, kurum, tarih, para vs. ayıklama.</li>'
+ '<li><strong>POS Tagging (Sözcük Türü Etiketleme):</strong> her kelimeye dilbilgisel kategorisi (isim, fiil, sıfat).</li>'
+ '<li><strong>Chunking:</strong> isim öbeklerini, fiil öbeklerini bulma.</li>'
+ '<li><strong>Aspect Extraction (yön çıkarımı):</strong> ürün yorumunda hangi özellik bahsedildiğini bulma — <a href="/tutorials/ai/nlp/sentiment-analysis">Ders 4</a>\'te değindik.</li>'
+ '</ul>'

+ '<h2 class="l-title">2. NER Nedir, Ne İşe Yarar?</h2>'

+ '<p class="l-text"><strong>Adlandırılmış Varlık Tanıma (NER, Named Entity Recognition)</strong> bir metindeki gerçek dünya varlıklarını ayıklar. Standart kategoriler:</p>'

+ '<ul class="l-list">'
+ '<li><strong>PER</strong> (Person) — kişi adları: Mikail, Atatürk</li>'
+ '<li><strong>LOC</strong> (Location) — yer adları: İstanbul, İspanya, Boğaziçi</li>'
+ '<li><strong>ORG</strong> (Organization) — kurum adları: Trendyol, Galatasaray, BTÜ</li>'
+ '<li><strong>DATE</strong> — tarih: 25 Nisan 2026, geçen hafta</li>'
+ '<li><strong>MONEY</strong> — para tutarları: 500 TL, 100 dolar</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Kullanım alanları:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>Haber arama:</strong> "Mikail" hakkındaki tüm haberleri otomatik gruplama.</li>'
+ '<li><strong>Tıbbi NER:</strong> hasta raporlarından hastalık, ilaç, doz çıkarımı.</li>'
+ '<li><strong>Finansal NER:</strong> haberlerden şirket, hisse, fiyat çıkarımı.</li>'
+ '<li><strong>Bilgi grafiği inşası:</strong> Wikipedia metinlerinden otomatik bilgi grafiği.</li>'
+ '<li><strong>Müşteri hizmetleri:</strong> mesajdan ürün, sipariş numarası, tarih çıkarımı.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. BIO Etiketleme Şeması</h2>'

+ '<p class="l-text">Bir varlık birden fazla kelimeden oluşabilir: <em>"Mustafa Kemal Atatürk"</em> üç kelimelik tek bir kişi adı. Bunu etiketlemek için <strong>BIO şeması</strong> kullanılır:</p>'

+ '<ul class="l-list">'
+ '<li><strong>B-X</strong> (Begin) — bir X varlığının ilk kelimesi</li>'
+ '<li><strong>I-X</strong> (Inside) — aynı X varlığının devamı</li>'
+ '<li><strong>O</strong> (Outside) — varlık değil</li>'
+ '</ul>'

+ '<div class="calc-example"><div class="example-label">BIO ŞEMASI ÖRNEĞİ</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Kelime</th><th style="padding:.5rem">Etiket</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Mustafa</td><td style="text-align:center"><strong>B-PER</strong></td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Kemal</td><td style="text-align:center"><strong>I-PER</strong></td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Atatürk</td><td style="text-align:center"><strong>I-PER</strong></td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">1923</td><td style="text-align:center"><strong>B-DATE</strong></td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">yılında</td><td style="text-align:center">O</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Türkiye</td><td style="text-align:center"><strong>B-LOC</strong></td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Cumhuriyeti</td><td style="text-align:center"><strong>I-LOC</strong></td></tr>'
+ '<tr><td style="padding:.5rem">\'ni kurdu</td><td style="text-align:center">O</td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text">"Mustafa Kemal Atatürk" üç kelimelik tek bir PER varlığı; "Türkiye Cumhuriyeti" iki kelimelik tek bir LOC. B/I etiketleri varlık sınırlarını netleştirir.</p>'
+ '</div></div>'

+ '<h2 class="l-title">4. Klasik Yaklaşım — CRF (Conditional Random Fields)</h2>'

+ '<p class="l-text">Naive Bayes ve lojistik regresyon her token\'ı bağımsız sınıflandırır — komşu etiketleri görmez. Ama dizi etiketlemede komşu etiketler kritik: B-PER\'den sonra muhtemelen I-PER veya O gelir; iki ardışık B-PER tuhaftır.</p>'

+ '<p class="l-text"><strong>CRF (Conditional Random Fields)</strong> tüm dizinin olasılığını birlikte modeller — etiketler arası geçişleri öğrenir.</p>'

+ '<div class="katex-block">$$P(\\mathbf{y} \\mid \\mathbf{x}) = \\frac{1}{Z(\\mathbf{x})} \\exp\\Bigl( \\sum_{t=1}^{T} \\sum_k \\lambda_k f_k(y_{t-1}, y_t, \\mathbf{x}, t) \\Bigr)$$</div>'

+ '<p class="l-text">Burada:</p>'

+ '<ul class="l-list">'
+ '<li><strong>x</strong> — kelime dizisi (girdi)</li>'
+ '<li><strong>y</strong> — etiket dizisi (çıktı)</li>'
+ '<li><strong>f<sub>k</sub></strong> — özellik fonksiyonları (büyük harf mi, sayı mı, sözlükte var mı vs.)</li>'
+ '<li><strong>λ<sub>k</sub></strong> — eğitilen ağırlıklar</li>'
+ '<li><strong>Z(x)</strong> — normalizasyon (tüm mümkün etiket dizilerinin toplamı)</li>'
+ '</ul>'

+ '<p class="l-text">CRF, Viterbi algoritması ile en olası etiket dizisini bulur. 2010\'larda en güçlü NER yöntemiydi; hâlâ küçük veri setlerinde rekabetçi.</p>'

+ '<h2 class="l-title">5. Modern Yaklaşım — BiLSTM + CRF</h2>'

+ '<p class="l-text">Klasik CRF özellik mühendisliği gerektirir — el ile "büyük harfle başlıyor mu", "kelime listede mi" gibi kurallar yazmalısın. Derin öğrenme bu işi otomatikleştirir.</p>'

+ '<p class="l-text"><strong>BiLSTM-CRF</strong> mimarisi (Lample ve ekibi, 2016) standart oldu:</p>'

+ '<ol class="l-list">'
+ '<li>Her kelime için <strong>kelime embedding</strong>\'i (Word2Vec/FastText) ve <strong>karakter embedding</strong>\'leri (yazım/morfoloji bilgisi için).</li>'
+ '<li>Bunları <strong>çift yönlü LSTM</strong>\'e ver — her kelime için sol bağlamdan ve sağ bağlamdan beslenmiş bir vektör.</li>'
+ '<li>Üzerine <strong>CRF katmanı</strong> — etiket geçiş kısıtlarını öğrenir.</li>'
+ '</ol>'

+ '<p class="l-text">Bu mimari Türkçe NER\'de %88-92 F1 verir, klasik CRF\'den belirgin ileri.</p>'

+ '<h2 class="l-title">6. En Gelişkin — BERT-tabanlı NER</h2>'

+ '<p class="l-text">2018\'den sonra <strong>BERT</strong> (<a href="/tutorials/ai/nlp/transformers-bert">Ders 10</a>) NER\'in altın standardı oldu. Mantık:</p>'

+ '<ol class="l-list">'
+ '<li>Önceden eğitilmiş bir BERT al (Türkçe için <strong>BERTurk</strong>).</li>'
+ '<li>Her token için BERT\'in son katman çıktısı bir vektör verir — bağlama duyarlı.</li>'
+ '<li>Üzerine basit bir lineer sınıflandırıcı (veya CRF) ekle.</li>'
+ '<li>Etiketli NER veri setinde ince ayar yap.</li>'
+ '</ol>'

+ '<p class="l-text">BERTurk fine-tune Türkçe NER\'de %93-95 F1 verir. WikiAnn-tr, MilliyetNER gibi veri setlerinde son teknoloji budur.</p>'

+ '<h2 class="l-title">7. Türkçe NER\'in Özel Zorlukları</h2>'

+ '<h3 class="l-subtitle">Eklemeli yapı</h3>'

+ '<p class="l-text"><em>"İstanbul\'da"</em>, <em>"İstanbul\'dan"</em>, <em>"İstanbul\'un"</em> hep aynı varlığı (İstanbul) gösterir, sadece hâl ekleri değişir. Modern tokenizer\'lar (BERTurk\'ün WordPiece\'i) kelimeyi alt-parçalarına ayırır: <code>İstanbul</code> + <code>##\'da</code>. NER etiketi sadece ilk parçaya verilir, diğer parçalar X (devam) etiketi alır.</p>'

+ '<h3 class="l-subtitle">Büyük harf duyarlılığı</h3>'

+ '<p class="l-text">Türkçede özel isimler büyük harfle başlar — değerli sinyal. Eğer ön işlemede her şeyi küçük harfe çevirirsen NER doğruluğu düşer. <strong>NER için lowercase yapma</strong> (<a href="/tutorials/ai/nlp/text-preprocessing">Ders 1</a>\'deki tablo).</p>'

+ '<h3 class="l-subtitle">Veri kıtlığı</h3>'

+ '<p class="l-text">İngilizce için CoNLL-2003, OntoNotes gibi büyük etiketli veri setleri var. Türkçe için MilliyetNER (gazete) ve WikiAnn-tr (Wikipedia\'dan otomatik etiketlenmiş) en büyükleri — yine de İngilizce kıyasla küçük. Çözüm: ön eğitilmiş BERTurk üzerinden ince ayar — az veriyle yüksek başarı.</p>'

+ '<h2 class="l-title">8. Python\'da Pratik — spaCy ve transformers</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Hazır spaCy modeli ile İngilizce NER</div><div class="code-block"><pre><code><span class="kw">import</span> spacy'
+ '\n'
+ '\n<span class="cm"># Önce model indir: python -m spacy download en_core_web_sm</span>'
+ '\nnlp = spacy.<span class="fn">load</span>(<span class="str">"en_core_web_sm"</span>)'
+ '\n'
+ '\nmetin = <span class="str">"Mikail went to Spain via Erasmus in 2026"</span>'
+ '\ndoc = <span class="fn">nlp</span>(metin)'
+ '\n'
+ '\n<span class="kw">for</span> ent <span class="kw">in</span> doc.ents:'
+ '\n    <span class="fn">print</span>(<span class="str">f"{ent.text:15} {ent.label_}"</span>)'
+ '\n<span class="cm"># Mikail          PERSON</span>'
+ '\n<span class="cm"># Spain           GPE</span>'
+ '\n<span class="cm"># Erasmus         ORG</span>'
+ '\n<span class="cm"># 2026            DATE</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Regex tabanlı NER: büyük harfli kelimeler = PERSON/ORG, rakamlar = DATE/MONEY — spaCy ile aynı span-çıktı yapısı.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>import re\n\ntext = "Apple Inc. paid 250 million dollars to John Smith on March 15, 2024."\n\nents = []\nfor m in re.finditer(r\'\\b[A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*(?:\\s+Inc\\.|\\s+Ltd\\.)?\', text):\n    ents.append((m.group(), \'ORG\' if \'Inc.\' in m.group() or \'Ltd.\' in m.group() else \'PERSON\'))\nfor m in re.finditer(r\'\\b\\d+(?:[.,]\\d+)?\\s*(?:million|billion|dollars?)\\b\', text, re.I):\n    ents.append((m.group(), \'MONEY\'))\nfor m in re.finditer(r\'\\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\w*\\s+\\d+,?\\s*\\d{4}\', text):\n    ents.append((m.group(), \'DATE\'))\n\nfor span, label in ents:\n    print(f\'{label:>7}: {span}\')</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> spaCy\'nin önceden eğitilmiş İngilizce modelini yükler. <code>nlp(metin)</code> tüm boru hattını çalıştırır (tokenize, POS, NER, vs.). <code>doc.ents</code> bulunan varlıkların listesi — her birinin metni ve kategorisi var. spaCy\'nin Türkçe modeli zayıftır; ciddi Türkçe NER için bir sonraki örneğe (BERTurk) bak.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Türkçe NER — BERTurk fine-tune (transformers)</div><div class="code-block"><pre><code><span class="kw">from</span> transformers <span class="kw">import</span> pipeline'
+ '\n'
+ '\n<span class="cm"># Hazır Türkçe NER modeli (HuggingFace Hub\'da)</span>'
+ '\nner = <span class="fn">pipeline</span>('
+ '\n    <span class="str">"ner"</span>,'
+ '\n    model=<span class="str">"savasy/bert-base-turkish-ner-cased"</span>,'
+ '\n    aggregation_strategy=<span class="str">"simple"</span>,'
+ '\n)'
+ '\n'
+ '\nmetin = <span class="str">"Mikail Erasmus için 2026\'da İspanya\'ya gitti"</span>'
+ '\nsonuclar = <span class="fn">ner</span>(metin)'
+ '\n'
+ '\n<span class="kw">for</span> r <span class="kw">in</span> sonuclar:'
+ '\n    <span class="fn">print</span>(<span class="str">f"{r[\'word\']:20} {r[\'entity_group\']:6} {r[\'score\']:.2f}"</span>)'
+ '\n<span class="cm"># Mikail              PER    0.99</span>'
+ '\n<span class="cm"># Erasmus             ORG    0.91</span>'
+ '\n<span class="cm"># 2026                DATE   0.98</span>'
+ '\n<span class="cm"># İspanya             LOC    0.99</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">BERT/transformers yerine `df_reviews` üzerinde TF-IDF + LogisticRegression — aynı son görev: metin → etiket.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX_text = df_reviews[\'text\'].astype(str).values\ny      = df_reviews[\'sentiment\'].values\n\nXtr, Xte, ytr, yte = train_test_split(X_text, y, test_size=0.3, random_state=0, stratify=y)\n\nvec = TfidfVectorizer(max_features=2000, ngram_range=(1,2)).fit(Xtr)\nclf = LogisticRegression(max_iter=400).fit(vec.transform(Xtr), ytr)\n\nprint(\'train acc:\', round(clf.score(vec.transform(Xtr), ytr), 3))\nprint(\'test  acc:\', round(clf.score(vec.transform(Xte), yte), 3))\nprint(\'sample :\', clf.predict(vec.transform([\'this movie was amazing\']))[0])</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> HuggingFace transformers kütüphanesinin <code>pipeline</code> arayüzü ile hazır Türkçe NER modelini bir satırda yükler. <code>aggregation_strategy="simple"</code> alt-token parçalarını otomatik birleştirir (<code>İstan</code> + <code>##bul</code> → <code>İstanbul</code>). Çıktı her varlığı, kategorisini ve modelin güven skorunu içerir.</p>'

+ '<h2 class="l-title">9. Değerlendirme — Span-Level F1</h2>'

+ '<p class="l-text">NER\'de değerlendirme dikkat ister. Token bazlı F1 yetmez — bir varlık 3 kelimelik ise ve modelin sadece 2\'sini doğru etiketlediyse, "yarı doğru" demek yanıltıcıdır. <strong>Span-level F1</strong> kullanılır: bir varlık ancak <em>tam olarak</em> doğru etiketlenirse "doğru" sayılır.</p>'

+ '<p class="l-text"><strong>seqeval</strong> kütüphanesi span-level metrikleri hesaplar:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> seqeval ile span-level F1</div><div class="code-block"><pre><code><span class="kw">from</span> seqeval.metrics <span class="kw">import</span> classification_report, f1_score'
+ '\n'
+ '\ngercek = [[<span class="str">"B-PER"</span>, <span class="str">"O"</span>, <span class="str">"O"</span>, <span class="str">"B-LOC"</span>, <span class="str">"O"</span>]]'
+ '\ntahmin = [[<span class="str">"B-PER"</span>, <span class="str">"O"</span>, <span class="str">"O"</span>, <span class="str">"B-LOC"</span>, <span class="str">"O"</span>]]'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="fn">f1_score</span>(gercek, tahmin))           <span class="cm"># 1.0 (tam eşleşme)</span>'
+ '\n<span class="fn">print</span>(<span class="fn">classification_report</span>(gercek, tahmin))</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Gerçek ve tahmin etiket dizilerini karşılaştırır. <code>seqeval</code> sadece B/I etiket eşleşmesine bakmaz — span sınırlarının doğru olmasını da kontrol eder. Çıktı her varlık tipi (PER, LOC, ORG) için ayrı F1 skorları verir.</p>'

+ '<div class="plotly-graph"><div id="plot-ner-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["Sözlük tabanlı","CRF + el özellikler","BiLSTM-CRF","BERTurk fine-tune","BERTurk + CRF"];'
+ 'var f1=[0.62,0.78,0.88,0.93,0.94];'
+ 'var t1={x:k,y:f1,type:"bar",marker:{color:T.accent},text:f1.map(function(v){return (v*100).toFixed(0)+"%";}),textposition:"outside"};'
+ 'var layout={title:{text:"Türkçe NER (MilliyetNER) — yöntem-F1 karşılaştırması",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{color:T.text,gridcolor:T.grid,title:"Span-level F1",range:[0.5,1.0],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:90,l:60}};'
+ 'if(document.getElementById("plot-ner-tr"))Plotly.newPlot("plot-ner-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Türkçe NER\'de yöntemden yönteme tipik atlama. Sözlük tabanlı yaklaşımlar (kelime listeleriyle eşleştirme) %60 civarında tavanlanır. El ile özellik mühendisli CRF %75\'e çıkar. BiLSTM-CRF büyük sıçrama sağlar (%88). BERTurk ince ayar son teknolojidir (%93-94). Üstüne CRF katmanı eklemek küçük ama tutarlı bir +1\'lik kazanım daha verir.</div>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Token bazlı sınıflandırmayı (denetimli) öğrendin. Şu ana kadar gördüğümüz tüm yöntemler "metni anla" odaklıydı. <a href="/tutorials/ai/nlp/language-models">Ders 8</a>\'de farklı bir görev türüne geçiyoruz: <strong>dil modelleme (language modeling)</strong>. Verili bir bağlamda bir sonraki kelimenin ne olacağını tahmin etme. Bu, GPT\'nin temel görevidir — modern büyük dil modellerinin (LLM) kalbi.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Cümle bazlı sınıflandırmadan dizi etiketlemeye geçişin ne anlama geldiğini öğrendin. NER\'in ne olduğunu, hangi gerçek-dünya problemlerinde kullanıldığını gördün. BIO etiketleme şemasının çoklu kelimeli varlıkları nasıl yakaladığını anladın. Klasik CRF ile başlayıp BiLSTM-CRF ve BERTurk ince ayara kadar yöntem evriminin yolunu izledin. Türkçenin eklemeli yapısı, büyük harf duyarlılığı, veri kıtlığı gibi özel zorlukları gördün. spaCy ve transformers ile gerçek kod yazdın. Span-level F1 ile NER\'e özel değerlendirme metriklerini öğrendin.</div>'

,

en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> Until now we classified an entire sentence with one label (positive/negative). This lesson moves to assigning a label to <em>each word</em>: <strong>sequence labelling</strong>. The most common application — <strong>Named Entity Recognition (NER)</strong> — automatically finds entities like persons, locations, organisations, and dates. In <em>"Mikail went to Spain via Erasmus"</em>, <em>Mikail</em> is a person and <em>Spain</em> is a location.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Distinguish sentence-level classification from token-level sequence labeling</li>'
+ '<li>Read NER training data with the BIO and BIOES tagging schemes</li>'
+ '<li>Understand why HMM and CRF were the standard before BiLSTM in NER</li>'
+ '<li>Build a BiLSTM-CRF NER architecture in PyTorch</li>'
+ '<li>Run BERTurk-NER from HuggingFace to extract Turkish persons, places, organizations</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. What is Sequence Labelling?</h2>'

+ '<p class="l-text"><strong>Sequence labelling</strong> assigns a categorical label to every token in a sequence. Unlike sentence-level classification, the output is not a single label but a sequence of labels of the same length as the input.</p>'

+ '<div class="calc-example"><div class="example-label">SENTENCE-LEVEL vs SEQUENCE LABELLING</div><div class="example-body">'
+ '<p class="l-text"><strong>Sentence-level:</strong> sentence → one label</p>'
+ '<p class="l-text" style="font-family:var(--mono);text-align:center"><code>"This movie was amazing"</code> &nbsp;→&nbsp; <strong>positive</strong></p>'
+ '<p class="l-text" style="margin-top:.8rem"><strong>Sequence labelling:</strong> sentence → label per word</p>'
+ '<p class="l-text" style="font-family:var(--mono);text-align:center;line-height:1.9">'
+ '<code>Mikail / went / to / Spain / via / Erasmus</code>'
+ '<br>↓'
+ '<br><code>B-PER / O / O / B-LOC / O / B-ORG</code>'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Common sequence-labelling tasks:</p>'

+ '<ul class="l-list">'
+ '<li><strong>NER (Named Entity Recognition):</strong> extract persons, locations, organisations, dates, money.</li>'
+ '<li><strong>POS Tagging:</strong> grammatical category per word (noun, verb, adjective).</li>'
+ '<li><strong>Chunking:</strong> finding noun phrases, verb phrases.</li>'
+ '<li><strong>Aspect Extraction:</strong> identifying which feature is mentioned in a product review — touched on in <a href="/tutorials/ai/nlp/sentiment-analysis">Lesson 4</a>.</li>'
+ '</ul>'

+ '<h2 class="l-title">2. What is NER, Why Does it Matter?</h2>'

+ '<p class="l-text"><strong>Named Entity Recognition</strong> extracts real-world entities from text. Standard categories:</p>'

+ '<ul class="l-list">'
+ '<li><strong>PER</strong> (Person): Mikail, Atatürk</li>'
+ '<li><strong>LOC</strong> (Location): Istanbul, Spain, Bosphorus</li>'
+ '<li><strong>ORG</strong> (Organization): Trendyol, Galatasaray, MIT</li>'
+ '<li><strong>DATE</strong>: 25 April 2026, last week</li>'
+ '<li><strong>MONEY</strong>: 500 TL, 100 dollars</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Use cases:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>News search:</strong> auto-cluster all news mentioning "Mikail".</li>'
+ '<li><strong>Medical NER:</strong> extract diseases, drugs, doses from clinical notes.</li>'
+ '<li><strong>Financial NER:</strong> companies, tickers, prices from news.</li>'
+ '<li><strong>Knowledge graph construction:</strong> auto-build a knowledge graph from Wikipedia.</li>'
+ '<li><strong>Customer service:</strong> extract product, order ID, date from messages.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. The BIO Tagging Scheme</h2>'

+ '<p class="l-text">An entity may span multiple words: <em>"Mustafa Kemal Atatürk"</em> is one person spanning three tokens. We use the <strong>BIO scheme</strong> to handle this:</p>'

+ '<ul class="l-list">'
+ '<li><strong>B-X</strong> (Begin) — first word of an X entity</li>'
+ '<li><strong>I-X</strong> (Inside) — continuation of the same X entity</li>'
+ '<li><strong>O</strong> (Outside) — not part of any entity</li>'
+ '</ul>'

+ '<div class="calc-example"><div class="example-label">BIO SCHEME EXAMPLE</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Word</th><th style="padding:.5rem">Tag</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Mustafa</td><td style="text-align:center"><strong>B-PER</strong></td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Kemal</td><td style="text-align:center"><strong>I-PER</strong></td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Atatürk</td><td style="text-align:center"><strong>I-PER</strong></td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">founded</td><td style="text-align:center">O</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">the</td><td style="text-align:center">O</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Republic</td><td style="text-align:center"><strong>B-LOC</strong></td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">of</td><td style="text-align:center"><strong>I-LOC</strong></td></tr>'
+ '<tr><td style="padding:.5rem">Türkiye</td><td style="text-align:center"><strong>I-LOC</strong></td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text">"Mustafa Kemal Atatürk" is one PER entity spanning three tokens; "Republic of Türkiye" is one LOC spanning three tokens. B/I tags make entity boundaries explicit.</p>'
+ '</div></div>'

+ '<h2 class="l-title">4. Classical Approach — CRF (Conditional Random Fields)</h2>'

+ '<p class="l-text">Naive Bayes and logistic regression classify each token independently — they cannot see neighbouring labels. But for sequence labelling, neighbours matter: B-PER is most likely followed by I-PER or O; two consecutive B-PER is suspicious.</p>'

+ '<p class="l-text"><strong>CRF (Conditional Random Fields)</strong> models the joint probability of the entire label sequence — it learns transitions between labels.</p>'

+ '<div class="katex-block">$$P(\\mathbf{y} \\mid \\mathbf{x}) = \\frac{1}{Z(\\mathbf{x})} \\exp\\Bigl( \\sum_{t=1}^{T} \\sum_k \\lambda_k f_k(y_{t-1}, y_t, \\mathbf{x}, t) \\Bigr)$$</div>'

+ '<p class="l-text">Where:</p>'

+ '<ul class="l-list">'
+ '<li><strong>x</strong> — word sequence (input)</li>'
+ '<li><strong>y</strong> — label sequence (output)</li>'
+ '<li><strong>f<sub>k</sub></strong> — feature functions (capitalisation, digits, in-gazetteer, etc.)</li>'
+ '<li><strong>λ<sub>k</sub></strong> — learnt weights</li>'
+ '<li><strong>Z(x)</strong> — normaliser (sum over all possible label sequences)</li>'
+ '</ul>'

+ '<p class="l-text">CRF uses the Viterbi algorithm to find the most likely label sequence. It was the strongest NER method in the 2010s; still competitive on small datasets.</p>'

+ '<h2 class="l-title">5. Modern Approach — BiLSTM + CRF</h2>'

+ '<p class="l-text">Classical CRF requires feature engineering — manual rules like "starts with capital", "in gazetteer". Deep learning automates that.</p>'

+ '<p class="l-text">The <strong>BiLSTM-CRF</strong> architecture (Lample et al., 2016) became standard:</p>'

+ '<ol class="l-list">'
+ '<li>For each word use a <strong>word embedding</strong> (Word2Vec/FastText) plus <strong>character embeddings</strong> (for spelling/morphology).</li>'
+ '<li>Feed them into a <strong>bidirectional LSTM</strong> — each word gets a vector informed by both left and right context.</li>'
+ '<li>Top with a <strong>CRF layer</strong> — learns label-transition constraints.</li>'
+ '</ol>'

+ '<p class="l-text">This architecture reaches 88-92% F1 on Turkish NER, clearly ahead of classical CRF.</p>'

+ '<h2 class="l-title">6. State of the Art — BERT-based NER</h2>'

+ '<p class="l-text">After 2018 <strong>BERT</strong> (<a href="/tutorials/ai/nlp/transformers-bert">Lesson 10</a>) became the gold standard for NER:</p>'

+ '<ol class="l-list">'
+ '<li>Take a pretrained BERT (for Turkish: <strong>BERTurk</strong>).</li>'
+ '<li>BERT\'s last-layer output gives a contextual vector per token.</li>'
+ '<li>Add a simple linear classifier (or CRF) on top.</li>'
+ '<li>Fine-tune on the labelled NER dataset.</li>'
+ '</ol>'

+ '<p class="l-text">BERTurk fine-tune reaches 93-95% F1 on Turkish NER (WikiAnn-tr, MilliyetNER). This is the current state of the art.</p>'

+ '<h2 class="l-title">7. Turkish-Specific Challenges for NER</h2>'

+ '<h3 class="l-subtitle">Agglutinative morphology</h3>'

+ '<p class="l-text"><em>"İstanbul\'da"</em>, <em>"İstanbul\'dan"</em>, <em>"İstanbul\'un"</em> all reference the same entity (Istanbul) but with different case suffixes. Modern tokenisers (BERTurk\'s WordPiece) split these into subpieces: <code>İstanbul</code> + <code>##\'da</code>. The NER label is given to the first piece; subsequent pieces get an X (continuation) tag.</p>'

+ '<h3 class="l-subtitle">Case sensitivity</h3>'

+ '<p class="l-text">Turkish proper nouns start with a capital — a valuable signal. Lowercasing during preprocessing kills NER accuracy. <strong>Do not lowercase for NER</strong> (see the table in <a href="/tutorials/ai/nlp/text-preprocessing">Lesson 1</a>).</p>'

+ '<h3 class="l-subtitle">Data scarcity</h3>'

+ '<p class="l-text">English has CoNLL-2003 and OntoNotes — large gold-labelled datasets. For Turkish, MilliyetNER (newspaper) and WikiAnn-tr (auto-tagged from Wikipedia) are the largest, still small compared to English. Fix: fine-tune pretrained BERTurk — high accuracy from little data.</p>'

+ '<h2 class="l-title">8. Python — spaCy and transformers</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> English NER with spaCy</div><div class="code-block"><pre><code><span class="kw">import</span> spacy'
+ '\n'
+ '\n<span class="cm"># First download: python -m spacy download en_core_web_sm</span>'
+ '\nnlp = spacy.<span class="fn">load</span>(<span class="str">"en_core_web_sm"</span>)'
+ '\n'
+ '\ntext = <span class="str">"Mikail went to Spain via Erasmus in 2026"</span>'
+ '\ndoc = <span class="fn">nlp</span>(text)'
+ '\n'
+ '\n<span class="kw">for</span> ent <span class="kw">in</span> doc.ents:'
+ '\n    <span class="fn">print</span>(<span class="str">f"{ent.text:15} {ent.label_}"</span>)'
+ '\n<span class="cm"># Mikail          PERSON</span>'
+ '\n<span class="cm"># Spain           GPE</span>'
+ '\n<span class="cm"># Erasmus         ORG</span>'
+ '\n<span class="cm"># 2026            DATE</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pattern-based NER with regex: capitalized words = PERSON/ORG, digits = DATE/MONEY — same span-output structure as spaCy.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>import re\n\ntext = "Apple Inc. paid 250 million dollars to John Smith on March 15, 2024."\n\nents = []\nfor m in re.finditer(r\'\\b[A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*(?:\\s+Inc\\.|\\s+Ltd\\.)?\', text):\n    ents.append((m.group(), \'ORG\' if \'Inc.\' in m.group() or \'Ltd.\' in m.group() else \'PERSON\'))\nfor m in re.finditer(r\'\\b\\d+(?:[.,]\\d+)?\\s*(?:million|billion|dollars?)\\b\', text, re.I):\n    ents.append((m.group(), \'MONEY\'))\nfor m in re.finditer(r\'\\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\w*\\s+\\d+,?\\s*\\d{4}\', text):\n    ents.append((m.group(), \'DATE\'))\n\nfor span, label in ents:\n    print(f\'{label:>7}: {span}\')</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Loads spaCy\'s pretrained English model. <code>nlp(text)</code> runs the full pipeline (tokenize, POS, NER, etc.). <code>doc.ents</code> is the list of detected entities — each with text and category. spaCy\'s Turkish model is weak; for serious Turkish NER use the next BERTurk example.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Turkish NER — BERTurk fine-tune via transformers</div><div class="code-block"><pre><code><span class="kw">from</span> transformers <span class="kw">import</span> pipeline'
+ '\n'
+ '\n<span class="cm"># Off-the-shelf Turkish NER model (HuggingFace Hub)</span>'
+ '\nner = <span class="fn">pipeline</span>('
+ '\n    <span class="str">"ner"</span>,'
+ '\n    model=<span class="str">"savasy/bert-base-turkish-ner-cased"</span>,'
+ '\n    aggregation_strategy=<span class="str">"simple"</span>,'
+ '\n)'
+ '\n'
+ '\ntext = <span class="str">"Mikail Erasmus için 2026\'da İspanya\'ya gitti"</span>'
+ '\nresults = <span class="fn">ner</span>(text)'
+ '\n'
+ '\n<span class="kw">for</span> r <span class="kw">in</span> results:'
+ '\n    <span class="fn">print</span>(<span class="str">f"{r[\'word\']:20} {r[\'entity_group\']:6} {r[\'score\']:.2f}"</span>)'
+ '\n<span class="cm"># Mikail              PER    0.99</span>'
+ '\n<span class="cm"># Erasmus             ORG    0.91</span>'
+ '\n<span class="cm"># 2026                DATE   0.98</span>'
+ '\n<span class="cm"># İspanya             LOC    0.99</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Replace BERT/transformers with TF-IDF + LogisticRegression on `df_reviews` — same end-task: text → label.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX_text = df_reviews[\'text\'].astype(str).values\ny      = df_reviews[\'sentiment\'].values\n\nXtr, Xte, ytr, yte = train_test_split(X_text, y, test_size=0.3, random_state=0, stratify=y)\n\nvec = TfidfVectorizer(max_features=2000, ngram_range=(1,2)).fit(Xtr)\nclf = LogisticRegression(max_iter=400).fit(vec.transform(Xtr), ytr)\n\nprint(\'train acc:\', round(clf.score(vec.transform(Xtr), ytr), 3))\nprint(\'test  acc:\', round(clf.score(vec.transform(Xte), yte), 3))\nprint(\'sample :\', clf.predict(vec.transform([\'this movie was amazing\']))[0])</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> The HuggingFace transformers <code>pipeline</code> API loads a ready Turkish NER model in one line. <code>aggregation_strategy="simple"</code> auto-merges subword pieces (<code>İstan</code> + <code>##bul</code> → <code>İstanbul</code>). Output: each entity with category and confidence score.</p>'

+ '<h2 class="l-title">9. Evaluation — Span-Level F1</h2>'

+ '<p class="l-text">NER evaluation needs care. Token-level F1 is not enough — if an entity spans 3 words and the model labels only 2 correctly, calling it "half right" is misleading. <strong>Span-level F1</strong> is the convention: an entity is "correct" only if the full span is labelled correctly.</p>'

+ '<p class="l-text">The <strong>seqeval</strong> library computes span-level metrics:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Span-level F1 with seqeval</div><div class="code-block"><pre><code><span class="kw">from</span> seqeval.metrics <span class="kw">import</span> classification_report, f1_score'
+ '\n'
+ '\ntrue = [[<span class="str">"B-PER"</span>, <span class="str">"O"</span>, <span class="str">"O"</span>, <span class="str">"B-LOC"</span>, <span class="str">"O"</span>]]'
+ '\npred = [[<span class="str">"B-PER"</span>, <span class="str">"O"</span>, <span class="str">"O"</span>, <span class="str">"B-LOC"</span>, <span class="str">"O"</span>]]'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="fn">f1_score</span>(true, pred))           <span class="cm"># 1.0</span>'
+ '\n<span class="fn">print</span>(<span class="fn">classification_report</span>(true, pred))</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Compares true and predicted label sequences. <code>seqeval</code> checks not only B/I tag matches but also span boundaries. Output gives per-entity-type F1 (PER, LOC, ORG separately).</p>'

+ '<div class="plotly-graph"><div id="plot-ner-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["Lexicon","CRF + hand features","BiLSTM-CRF","BERTurk fine-tune","BERTurk + CRF"];'
+ 'var f1=[0.62,0.78,0.88,0.93,0.94];'
+ 'var t1={x:k,y:f1,type:"bar",marker:{color:T.accent},text:f1.map(function(v){return (v*100).toFixed(0)+"%";}),textposition:"outside"};'
+ 'var layout={title:{text:"Turkish NER (MilliyetNER) — method-by-F1",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{color:T.text,gridcolor:T.grid,title:"Span-level F1",range:[0.5,1.0],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:90,l:60}};'
+ 'if(document.getElementById("plot-ner-en"))Plotly.newPlot("plot-ner-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Typical jumps across Turkish NER methods. Lexicon-based (gazetteer matching) caps near 60%. Hand-engineered CRF reaches 75%. BiLSTM-CRF gives a big leap (88%). BERTurk fine-tune is the state of the art (93-94%). Adding a CRF layer on top of BERTurk yields a small but consistent +1% gain.</div>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">You have learned token-level supervised classification. So far every method we have seen has been "understand the text". <a href="/tutorials/ai/nlp/language-models">Lesson 8</a> moves to a different kind of task: <strong>language modelling</strong>. Predicting the next word given context. This is GPT\'s core task — the heart of modern large language models.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> The shift from sentence-level classification to sequence labelling. What NER is and where it is used. How the BIO tagging scheme handles multi-word entities. The evolution from classical CRF through BiLSTM-CRF to BERTurk fine-tune. Turkish-specific challenges (agglutinative morphology, case sensitivity, data scarcity). Real code with spaCy and transformers. NER-specific evaluation via span-level F1 with seqeval.</div>'

};
