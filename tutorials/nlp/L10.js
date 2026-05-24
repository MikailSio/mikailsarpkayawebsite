/* nlp-new-L10.js — NLP Course Lesson 10: Transformer & BERT (TR + EN) */
var NLP_L10 = {

tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=[];g.__nlpChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> 2017\'de Vaswani ve ekibi "Attention is All You Need" başlıklı bir makale yayınladı ve modern NLP\'nin yönünü tamamen değiştirdi: <strong>RNN\'leri tamamen at, sadece attention kullan</strong>. Bu derste Transformer mimarisini sıfırdan kuruyoruz — self-attention, multi-head attention, positional encoding, residual + layer normalization. Sonra Transformer üzerine inşa edilen iki büyük model ailesini göreceğiz: <strong>BERT</strong> (anlama için) ve <strong>GPT</strong> (üretim için). Modern NLP\'nin kalbi burada.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Scaled dot-product self-attention formülünü Q, K, V matrisleriyle uygulamayı</li>'
+ '<li>Multi-head attention ve positional encoding\'in neden gerekli olduğunu anlamayı</li>'
+ '<li>Bir Transformer encoder bloğunu (residual + LayerNorm + FFN) PyTorch\'ta kurmayı</li>'
+ '<li>BERT\'in masked LM ön-eğitimini ve GPT\'nin causal LM hedefini ayırt etmeyi</li>'
+ '<li>HuggingFace ile BERTurk\'ü Türkçe sınıflandırmaya fine-tune etmeyi</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. RNN\'in Sınırı, Transformer\'ın Doğuşu</h2>'

+ '<p class="l-text"><a href="/tutorials/nlp/9">Ders 9</a>\'da RNN tabanlı seq2seq + attention\'ı gördük. RNN\'lerin iki büyük problemi vardı:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Paralelleştirilemezler.</strong> Her zaman adımı bir öncekine bağlıdır; GPU\'da paralel eğitilemezler.</li>'
+ '<li><strong>Çok uzun bağlamı taşıyamazlar.</strong> LSTM iyileştirir ama 1000+ token\'da yine bilgi kaybeder.</li>'
+ '</ul>'

+ '<p class="l-text">Vaswani ve ekibi sordu: "Attention zaten her şeye bakıyor, RNN gerekli mi?" Cevap: <strong>hayır</strong>. Saf attention\'la (RNN olmadan) çalışan bir mimari kurdular — bu Transformer\'dır.</p>'

+ '<p class="l-text">Sonuçlar şaşırtıcıydı: hem daha kaliteli (BLEU\'da rekorlar) hem çok daha hızlı (paralel eğitim). 2018\'den itibaren RNN tabanlı modeller hızla terk edildi.</p>'

+ '<h2 class="l-title">2. Self-Attention — Anahtar Yenilik</h2>'

+ '<p class="l-text"><a href="/tutorials/nlp/9">Ders 9</a>\'da attention encoder ile decoder arasındaydı (cross-attention). <strong>Self-attention</strong> aynı mantığı tek bir cümlenin <em>kendi kelimeleri arasında</em> uygular: her kelime, aynı cümledeki diğer kelimelere bakar.</p>'

+ '<div class="calc-example"><div class="example-label">SELF-ATTENTION SEZGISI</div><div class="example-body">'
+ '<p class="l-text"><code>"Mikail Erasmus için İspanya\'ya gitti çünkü Avrupa kültürünü tanımak istiyordu"</code></p>'
+ '<p class="l-text">"o" kelimesi gerçek metinde yok ama bir RNN\'de <em>"istiyordu"</em>nun kim için söylendiği belirsizdir — RNN ileri doğru bilgiyi 10 adım taşıyamaz. Self-attention ise <em>"istiyordu"</em>nun <em>"Mikail"</em>e direkt bakmasını sağlar — mesafe ne olursa olsun.</p>'
+ '<p class="l-text">Cümledeki her kelime, diğer her kelimeye direkt erişir. Mesafe önemsiz.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Query, Key, Value</h3>'

+ '<p class="l-text">Self-attention\'da her kelimenin embedding\'i üç farklı projeksiyondan geçer: <strong>Query (Q)</strong>, <strong>Key (K)</strong>, <strong>Value (V)</strong>.</p>'

+ '<div class="katex-block">$$Q = X W^Q, \\quad K = X W^K, \\quad V = X W^V$$</div>'

+ '<p class="l-text">Sezgi:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Query:</strong> "Ben (bu kelime) hangi bilgiyi arıyorum?"</li>'
+ '<li><strong>Key:</strong> "Ben hangi bilgiyi sunuyorum?"</li>'
+ '<li><strong>Value:</strong> "Eğer bana ihtiyaç duyulursa ne vereceğim?"</li>'
+ '</ul>'

+ '<p class="l-text">Bir kelimenin Query\'si, başka kelimelerin Key\'leriyle çarpılarak ne kadar "uyumlu" oldukları ölçülür. Skorlar softmax\'lanır, sonuç ağırlıklarla Value\'lar üzerinden bir bağlam vektörü çıkarılır.</p>'

+ '<h2 class="l-title">3. Scaled Dot-Product Attention — Formül</h2>'

+ '<p class="l-text">Tüm self-attention tek bir formülde toplanır:</p>'

+ '<div class="katex-block">$$\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left( \\frac{Q K^\\top}{\\sqrt{d_k}} \\right) V$$</div>'

+ '<p class="l-text">Adım adım:</p>'

+ '<ol class="l-list">'
+ '<li><strong>Q K<sup>⊤</sup>:</strong> Query\'ler ile Key\'leri çarp — her kelime çiftinin "uyum skoru". Çıktı T×T boyutlu.</li>'
+ '<li><strong>√d<sub>k</sub>\'ya böl:</strong> Boyut büyüdükçe iç çarpımlar büyür ve softmax doyar; bölmek bunu önler.</li>'
+ '<li><strong>Softmax:</strong> Her satırı olasılık dağılımına çevir.</li>'
+ '<li><strong>×V:</strong> Bu ağırlıklarla Value\'ların ağırlıklı toplamını al — her kelime için yeni bir bağlam vektörü.</li>'
+ '</ol>'

+ '<h2 class="l-title">4. Multi-Head Attention — Paralel Yorumlar</h2>'

+ '<p class="l-text">Tek bir attention "kafası" tek bir tür ilişkiyi yakalar. Cümlede aynı anda çok farklı ilişkiler var: dilbilgisi (özne-yüklem), anlam (eş anlamlılar), bağlam (referans çözümü, "o" kim?). <strong>Multi-head attention</strong> bunu çözer: aynı işi <em>h</em> tane (genelde 8 veya 16) farklı kafayla paralel yapar.</p>'

+ '<div class="katex-block">$$\\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$</div>'

+ '<div class="katex-block">$$\\text{head}_i = \\text{Attention}(Q W^Q_i, K W^K_i, V W^V_i)$$</div>'

+ '<p class="l-text">Her kafanın kendi Q/K/V projeksiyonları var. Her kafa farklı ilişki türlerini öğrenir. Sonuçlar birleştirilir, son bir projeksiyon ile çıktıya dönüşür.</p>'

+ '<div class="calc-example"><div class="example-label">FARKLI KAFALARIN ÖĞRENDİĞİ TİPİK İLİŞKİLER</div><div class="example-body">'
+ '<ul class="l-list">'
+ '<li><strong>Kafa 1:</strong> sözdizimsel — fiilden öznesine</li>'
+ '<li><strong>Kafa 2:</strong> referans — "o", "bu"dan kime/neye işaret ediyor</li>'
+ '<li><strong>Kafa 3:</strong> uzun-mesafe ilişkiler</li>'
+ '<li><strong>Kafa 4:</strong> birleşik ifadeler ("hava limanı", "uçak bileti")</li>'
+ '</ul>'
+ '<p class="l-text">Vaswani makalesi ve sonraki BERTology çalışmaları bu kafaların gerçekten farklı şeyler öğrendiğini gösterir.</p>'
+ '</div></div>'

+ '<h2 class="l-title">5. Positional Encoding — "Sıra"yı Geri Vermek</h2>'

+ '<p class="l-text">Self-attention bir sorunla geliyor: <strong>kelime sırasını umursamaz</strong>. <em>"Bu film harikaydı"</em> ile <em>"Harikaydı film bu"</em> aynı self-attention çıktısını verir. Bu kabul edilemez.</p>'

+ '<p class="l-text">Çözüm: her kelimenin embedding\'ine <strong>pozisyon bilgisi</strong> ekle. Vaswani makalesi sinüs/kosinüs tabanlı bir formül önerir:</p>'

+ '<div class="katex-block">$$PE_{(pos, 2i)} = \\sin\\!\\left( \\frac{pos}{10000^{2i/d}} \\right), \\quad PE_{(pos, 2i+1)} = \\cos\\!\\left( \\frac{pos}{10000^{2i/d}} \\right)$$</div>'

+ '<p class="l-text">Her pozisyon için benzersiz bir vektör. Bu vektör kelime embedding\'iyle <em>toplanır</em>. Sonuç: kelime artık hem "ne olduğunu" hem "cümlenin neresinde olduğunu" taşır.</p>'

+ '<p class="l-text">Daha modern modeller (BERT, GPT) sinüs yerine <em>öğrenilebilir</em> pozisyon embedding\'leri kullanır. RoPE ve ALiBi gibi farklı yaklaşımlar da var (uzun bağlam için).</p>'

+ '<h2 class="l-title">6. Tam Transformer Bloku</h2>'

+ '<p class="l-text">Bir Transformer bloğu şu yapıdadır:</p>'

+ '<div class="calc-example"><div class="example-label">TRANSFORMER BLOK YAPISI</div><div class="example-body">'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Girdi (T × d)'
+ '<br>↓'
+ '<br><strong>Multi-Head Self-Attention</strong>'
+ '<br>↓'
+ '<br><em>+ residual connection</em>'
+ '<br>↓'
+ '<br>LayerNorm'
+ '<br>↓'
+ '<br><strong>Feed-Forward</strong> (Linear → ReLU → Linear)'
+ '<br>↓'
+ '<br><em>+ residual connection</em>'
+ '<br>↓'
+ '<br>LayerNorm'
+ '<br>↓'
+ '<br>Çıktı (T × d)'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text"><strong>Residual connection</strong> = blok girdisi blok çıktısına eklenir. Çok derin ağlarda gradyanın akmasına izin verir. <strong>LayerNorm</strong> = aktivasyonları normalize eder, eğitimi kararlı kılar.</p>'

+ '<p class="l-text">Bir Transformer modeli birden çok bu bloğun üst üste yığılmasıdır. BERT-base 12 blok, BERT-large 24 blok, GPT-3 96 blok kullanır.</p>'

+ '<h2 class="l-title">7. BERT — Encoder-Only Transformer</h2>'

+ '<p class="l-text"><strong>BERT (Bidirectional Encoder Representations from Transformers)</strong>, Devlin ve ekibinin 2018 yayını, sadece encoder kısmını kullanır — decoder yok. İki kritik fikre dayanır:</p>'

+ '<h3 class="l-subtitle">Fikir 1: Önceden eğitim (pre-training) + ince ayar (fine-tuning)</h3>'

+ '<p class="l-text">BERT iki aşamada eğitilir:</p>'

+ '<ol class="l-list">'
+ '<li><strong>Pre-training:</strong> Büyük metinler üzerinde (Wikipedia + kitaplar) genel dil bilgisi öğrenir. Etiket yok.</li>'
+ '<li><strong>Fine-tuning:</strong> Küçük etiketli görev verisi (sentiment, NER vs.) üzerinde özel görevle ince ayar.</li>'
+ '</ol>'

+ '<p class="l-text">Bu ayrım <strong>devrim niteliğinde</strong>. Eskiden her görev için sıfırdan model eğitirdik. BERT\'le, milyarlarca cümleden öğrenilmiş genel dil bilgisi her göreve transfer edilir.</p>'

+ '<h3 class="l-subtitle">Fikir 2: İki pre-training görevi</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Masked Language Modeling (MLM):</strong> Cümlede %15 kelimeyi maskele, modelin tahmin etmesini iste. <em>"Bu film [MASK] harikaydı"</em> → "gerçekten". İki yönlü öğrenme.</li>'
+ '<li><strong>Next Sentence Prediction (NSP):</strong> İki cümle ver, ikincisinin birincinin devamı olup olmadığını tahmin et. (Sonradan zayıf bulundu, RoBERTa\'da kaldırıldı.)</li>'
+ '</ul>'

+ '<p class="l-text">MLM\'in gücü: model cümlenin hem soluna hem sağına bakarak maskelenmiş kelimeyi tahmin eder. Bu nedenle BERT "iki yönlüdür" — GPT\'den farklı olarak.</p>'

+ '<h3 class="l-subtitle">BERT için Türkçe — BERTurk</h3>'

+ '<p class="l-text">Orijinal BERT İngilizce ağırlıklıydı. Türkçe için <strong>BERTurk</strong> (dbmdz tarafından, 2020) Türkçe Wikipedia + OPUS + büyük internet derlemesi üzerinde eğitildi. Türkçe NLP\'de hâlâ <em>fiili standart</em>.</p>'

+ '<h2 class="l-title">8. GPT — Decoder-Only Transformer</h2>'

+ '<p class="l-text"><strong>GPT (Generative Pre-trained Transformer)</strong>, OpenAI\'nın 2018 yayını, BERT\'in zıttı: sadece decoder kısmı, sadece sola bakar. Eğitim hedefi <strong>bir sonraki kelimeyi tahmin etmek</strong> — klasik dil modelleme görevi (<a href="/tutorials/nlp/8">Ders 8</a>).</p>'

+ '<p class="l-text">"Causal" ya da "autoregressive" denir: bir kelime sadece kendinden önceki kelimelere bakabilir. Bu sayede üretim doğal: önceki kelimelerden sonraki kelime, sonraki kelimeden bir sonraki kelime üretilir.</p>'

+ '<div class="calc-example"><div class="example-label">BERT vs GPT</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Özellik</th><th style="padding:.5rem">BERT</th><th style="padding:.5rem">GPT</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Mimari</td><td style="text-align:center">Encoder-only</td><td style="text-align:center">Decoder-only</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Yön</td><td style="text-align:center">İki yönlü</td><td style="text-align:center">Tek yönlü (causal)</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Pre-training hedefi</td><td style="text-align:center">MLM + NSP</td><td style="text-align:center">Next-token prediction</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Güçlü olduğu görev</td><td style="text-align:center">Anlama (sınıflandırma, NER, QA)</td><td style="text-align:center">Üretim (yazı, kod, sohbet)</td></tr>'
+ '<tr><td style="padding:.5rem">Modern örnek</td><td style="text-align:center">RoBERTa, DeBERTa, BERTurk</td><td style="text-align:center">GPT-4, Llama, Claude</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<h2 class="l-title">9. Python\'da Transformers Kütüphanesi</h2>'

+ '<p class="l-text">HuggingFace\'in <strong>transformers</strong> kütüphanesi tüm bu modellere tek tip bir API ile erişim verir.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> BERTurk ile cümle gömme çıkarımı</div><div class="code-block"><pre><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModel'
+ '\n<span class="kw">import</span> torch'
+ '\n'
+ '\nmodel_adi = <span class="str">"dbmdz/bert-base-turkish-cased"</span>'
+ '\ntokenizer = <span class="fn">AutoTokenizer</span>.<span class="fn">from_pretrained</span>(model_adi)'
+ '\nmodel = <span class="fn">AutoModel</span>.<span class="fn">from_pretrained</span>(model_adi)'
+ '\n'
+ '\nmetin = <span class="str">"Bu film gerçekten harikaydı"</span>'
+ '\ntokens = <span class="fn">tokenizer</span>(metin, return_tensors=<span class="str">"pt"</span>)'
+ '\n'
+ '\n<span class="kw">with</span> torch.<span class="fn">no_grad</span>():'
+ '\n    out = <span class="fn">model</span>(**tokens)'
+ '\n'
+ '\n<span class="cm"># last_hidden_state: (1, T, 768) — her token için 768 boyutlu vektör</span>'
+ '\n<span class="fn">print</span>(out.last_hidden_state.shape)'
+ '\n'
+ '\n<span class="cm"># Cümle vektörü olarak [CLS] token\'ının vektörü kullanılır</span>'
+ '\ncls_vec = out.last_hidden_state[<span class="num">0</span>, <span class="num">0</span>, :]'
+ '\n<span class="fn">print</span>(cls_vec.<span class="fn">shape</span>)  <span class="cm"># torch.Size([768])</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">BERT/transformers yerine `df_reviews` üzerinde TF-IDF + LogisticRegression — aynı son görev: metin → etiket.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX_text = df_reviews[\'text\'].astype(str).values\ny      = df_reviews[\'sentiment\'].values\n\nXtr, Xte, ytr, yte = train_test_split(X_text, y, test_size=0.3, random_state=0, stratify=y)\n\nvec = TfidfVectorizer(max_features=2000, ngram_range=(1,2)).fit(Xtr)\nclf = LogisticRegression(max_iter=400).fit(vec.transform(Xtr), ytr)\n\nprint(\'train acc:\', round(clf.score(vec.transform(Xtr), ytr), 3))\nprint(\'test  acc:\', round(clf.score(vec.transform(Xte), yte), 3))\nprint(\'sample :\', clf.predict(vec.transform([\'this movie was amazing\']))[0])</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> HuggingFace Hub\'dan BERTurk\'ün tokenizer ve modelini indirir. Türkçe bir cümleyi tokenize eder, modelden geçirir. Çıktı her token için 768 boyutlu bağlama duyarlı bir vektör. Cümlenin tek vektörlü temsili olarak <code>[CLS]</code> özel token\'ının vektörü kullanılır — bu vektör doğrudan sınıflandırıcıya verilebilir veya benzerlik karşılaştırmalarında kullanılabilir.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> BERTurk fine-tune (sentiment için iskelet)</div><div class="code-block"><pre><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments'
+ '\n'
+ '\nmodel = <span class="fn">AutoModelForSequenceClassification</span>.<span class="fn">from_pretrained</span>('
+ '\n    <span class="str">"dbmdz/bert-base-turkish-cased"</span>,'
+ '\n    num_labels=<span class="num">2</span>,   <span class="cm"># olumlu / olumsuz</span>'
+ '\n)'
+ '\n'
+ '\nargs = <span class="fn">TrainingArguments</span>('
+ '\n    output_dir=<span class="str">"./berturk-sentiment"</span>,'
+ '\n    num_train_epochs=<span class="num">3</span>,'
+ '\n    per_device_train_batch_size=<span class="num">16</span>,'
+ '\n    learning_rate=<span class="num">2e-5</span>,'
+ '\n)'
+ '\n'
+ '\ntrainer = <span class="fn">Trainer</span>('
+ '\n    model=model,'
+ '\n    args=args,'
+ '\n    train_dataset=train_ds,'
+ '\n    eval_dataset=val_ds,'
+ '\n)'
+ '\ntrainer.<span class="fn">train</span>()</code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">BERT/transformers yerine `df_reviews` üzerinde TF-IDF + LogisticRegression — aynı son görev: metin → etiket.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX_text = df_reviews[\'text\'].astype(str).values\ny      = df_reviews[\'sentiment\'].values\n\nXtr, Xte, ytr, yte = train_test_split(X_text, y, test_size=0.3, random_state=0, stratify=y)\n\nvec = TfidfVectorizer(max_features=2000, ngram_range=(1,2)).fit(Xtr)\nclf = LogisticRegression(max_iter=400).fit(vec.transform(Xtr), ytr)\n\nprint(\'train acc:\', round(clf.score(vec.transform(Xtr), ytr), 3))\nprint(\'test  acc:\', round(clf.score(vec.transform(Xte), yte), 3))\nprint(\'sample :\', clf.predict(vec.transform([\'this movie was amazing\']))[0])</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> <code>AutoModelForSequenceClassification</code> önceden eğitilmiş BERTurk\'ün üzerine küçük bir sınıflandırma kafası ekler. <code>Trainer</code> nesnesi eğitim döngüsünü, optimizasyonu, validasyonu, kayıt tutmayı tek satırda yönetir. <code>learning_rate=2e-5</code> BERT fine-tune için tipik değer; daha büyük öğrenme oranları önceden eğitilmiş ağırlıkları bozar. 3 epoch genelde yeterli — BERT zaten dili biliyor, sadece görevi öğrenecek.</p>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Transformer mimarisini ve iki büyük model ailesini (BERT, GPT) öğrendin. Modern NLP\'nin temelini attın. <a href="/tutorials/nlp/11">Ders 11</a>\'de bu temelin üzerine inşa edilen <strong>büyük dil modellerine (LLM)</strong> geçeceğiz: GPT-3/4, Llama, Claude. Ölçek nasıl kalite yarattı, RLHF nasıl çalışıyor, LoRA ile az kaynakla fine-tune nasıl yapılıyor — hepsini göreceksin.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Transformer\'ın 2017\'de neden ortaya çıktığını ve RNN\'lerin sınırlarını nasıl aştığını öğrendin. Self-attention\'ı (Q/K/V), scaled dot-product formülünü, multi-head attention\'ın paralel ilişki türlerini yakaladığını gördün. Positional encoding\'in self-attention\'ın "sırasızlık" sorununu nasıl çözdüğünü kavradın. Tam bir Transformer bloğunun (multi-head attention + residual + LayerNorm + feed-forward + residual + LayerNorm) yapısını anladın. BERT (encoder-only, iki yönlü, MLM ile önceden eğitim) ile GPT (decoder-only, causal, next-token tahmin) arasındaki temel farkı öğrendin. transformers kütüphanesiyle BERTurk gömme çıkarımı ve fine-tune iskeleti yazdın.</div>'

,

en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> In 2017 Vaswani et al. published "Attention is All You Need" and changed the direction of NLP forever: <strong>drop RNNs entirely, use only attention</strong>. This lesson builds the Transformer architecture from scratch — self-attention, multi-head attention, positional encoding, residual + layer normalization. Then we cover the two model families built on top of it: <strong>BERT</strong> (for understanding) and <strong>GPT</strong> (for generation). The heart of modern NLP.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Apply scaled dot-product self-attention with Q, K, V matrices</li>'
+ '<li>Understand why multi-head attention and positional encoding are needed</li>'
+ '<li>Build a Transformer encoder block (residual + LayerNorm + FFN) in PyTorch</li>'
+ '<li>Distinguish BERT masked-LM pretraining from GPT causal-LM objective</li>'
+ '<li>Fine-tune BERTurk for Turkish text classification with HuggingFace Trainer</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. The Limits of RNN, the Birth of the Transformer</h2>'

+ '<p class="l-text">In <a href="/tutorials/nlp/9">Lesson 9</a> we saw RNN-based seq2seq + attention. RNNs had two big problems:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Not parallelisable.</strong> Each time step depends on the previous one; cannot run in parallel on a GPU.</li>'
+ '<li><strong>Cannot carry very long context.</strong> LSTM helps but still loses information at 1000+ tokens.</li>'
+ '</ul>'

+ '<p class="l-text">Vaswani et al. asked: "Attention already attends to everything — do we need RNNs?" The answer: <strong>no</strong>. They built an architecture that uses pure attention without RNNs — the Transformer.</p>'

+ '<p class="l-text">The results were striking: higher quality (BLEU records) and much faster (parallel training). From 2018 onward RNN-based models were rapidly retired.</p>'

+ '<h2 class="l-title">2. Self-Attention — The Key Idea</h2>'

+ '<p class="l-text">In <a href="/tutorials/nlp/9">Lesson 9</a> attention was between encoder and decoder (cross-attention). <strong>Self-attention</strong> applies the same idea <em>within a single sentence</em>: each word attends to other words in the same sentence.</p>'

+ '<div class="calc-example"><div class="example-label">SELF-ATTENTION INTUITION</div><div class="example-body">'
+ '<p class="l-text"><code>"Mikail went to Spain via Erasmus because he wanted to experience European culture"</code></p>'
+ '<p class="l-text">"he" needs to refer to Mikail, but in an RNN that information has to travel through 7+ steps. Self-attention lets <em>"he"</em> attend directly to <em>"Mikail"</em> — distance does not matter.</p>'
+ '<p class="l-text">Every word has direct access to every other word. Distance is irrelevant.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Query, Key, Value</h3>'

+ '<p class="l-text">In self-attention each word\'s embedding is projected three ways: <strong>Query (Q)</strong>, <strong>Key (K)</strong>, <strong>Value (V)</strong>.</p>'

+ '<div class="katex-block">$$Q = X W^Q, \\quad K = X W^K, \\quad V = X W^V$$</div>'

+ '<p class="l-text">Intuition:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Query:</strong> "What information am I (this word) looking for?"</li>'
+ '<li><strong>Key:</strong> "What information do I offer?"</li>'
+ '<li><strong>Value:</strong> "If selected, what do I provide?"</li>'
+ '</ul>'

+ '<p class="l-text">A word\'s Query is multiplied with other words\' Keys to score "compatibility". Scores are softmaxed, the resulting weights mix the Values into a context vector.</p>'

+ '<h2 class="l-title">3. Scaled Dot-Product Attention — Formula</h2>'

+ '<p class="l-text">All of self-attention boils down to a single formula:</p>'

+ '<div class="katex-block">$$\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left( \\frac{Q K^\\top}{\\sqrt{d_k}} \\right) V$$</div>'

+ '<p class="l-text">Step by step:</p>'

+ '<ol class="l-list">'
+ '<li><strong>Q K<sup>⊤</sup>:</strong> multiply Queries with Keys — pairwise compatibility scores. Output is T×T.</li>'
+ '<li><strong>Divide by √d<sub>k</sub>:</strong> dot products grow with dimensionality, saturating softmax; the divisor keeps things stable.</li>'
+ '<li><strong>Softmax:</strong> turn each row into a probability distribution.</li>'
+ '<li><strong>×V:</strong> weighted sum of Values — a new context vector for each word.</li>'
+ '</ol>'

+ '<h2 class="l-title">4. Multi-Head Attention — Parallel Views</h2>'

+ '<p class="l-text">A single attention "head" captures only one kind of relation. A sentence has many simultaneously: grammar (subject-verb), semantic (synonyms), context (coreference, "he" referring to whom). <strong>Multi-head attention</strong> handles this by running <em>h</em> heads (typically 8 or 16) in parallel.</p>'

+ '<div class="katex-block">$$\\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$</div>'

+ '<div class="katex-block">$$\\text{head}_i = \\text{Attention}(Q W^Q_i, K W^K_i, V W^V_i)$$</div>'

+ '<p class="l-text">Each head has its own Q/K/V projections. Each head learns a different kind of relation. Outputs are concatenated and a final projection produces the layer output.</p>'

+ '<div class="calc-example"><div class="example-label">TYPICAL THINGS HEADS LEARN</div><div class="example-body">'
+ '<ul class="l-list">'
+ '<li><strong>Head 1:</strong> syntactic — verb to its subject</li>'
+ '<li><strong>Head 2:</strong> coreference — what "it"/"he"/"this" refers to</li>'
+ '<li><strong>Head 3:</strong> long-distance dependencies</li>'
+ '<li><strong>Head 4:</strong> compound expressions ("New York", "machine learning")</li>'
+ '</ul>'
+ '<p class="l-text">The Vaswani paper and subsequent BERTology shows different heads do indeed learn different things.</p>'
+ '</div></div>'

+ '<h2 class="l-title">5. Positional Encoding — Bringing Order Back</h2>'

+ '<p class="l-text">Self-attention has a problem: <strong>it ignores word order</strong>. <em>"This movie was amazing"</em> and <em>"Amazing was movie this"</em> give the same self-attention output. That is unacceptable.</p>'

+ '<p class="l-text">The fix: add <strong>positional information</strong> to each word\'s embedding. The Vaswani paper proposes a sine/cosine formula:</p>'

+ '<div class="katex-block">$$PE_{(pos, 2i)} = \\sin\\!\\left( \\frac{pos}{10000^{2i/d}} \\right), \\quad PE_{(pos, 2i+1)} = \\cos\\!\\left( \\frac{pos}{10000^{2i/d}} \\right)$$</div>'

+ '<p class="l-text">A unique vector per position. This vector is <em>added</em> to the word embedding. Result: each token now carries both "what it is" and "where it sits in the sentence".</p>'

+ '<p class="l-text">Modern models (BERT, GPT) use <em>learnable</em> positional embeddings instead of sinusoidal. RoPE and ALiBi are alternatives for very long context.</p>'

+ '<h2 class="l-title">6. The Full Transformer Block</h2>'

+ '<p class="l-text">A Transformer block has this structure:</p>'

+ '<div class="calc-example"><div class="example-label">TRANSFORMER BLOCK STRUCTURE</div><div class="example-body">'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Input (T × d)'
+ '<br>↓'
+ '<br><strong>Multi-Head Self-Attention</strong>'
+ '<br>↓'
+ '<br><em>+ residual connection</em>'
+ '<br>↓'
+ '<br>LayerNorm'
+ '<br>↓'
+ '<br><strong>Feed-Forward</strong> (Linear → ReLU → Linear)'
+ '<br>↓'
+ '<br><em>+ residual connection</em>'
+ '<br>↓'
+ '<br>LayerNorm'
+ '<br>↓'
+ '<br>Output (T × d)'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text"><strong>Residual connection</strong> = the input is added to the block output. Lets gradients flow through deep networks. <strong>LayerNorm</strong> = normalises activations, stabilising training.</p>'

+ '<p class="l-text">A full Transformer model stacks many such blocks. BERT-base has 12, BERT-large 24, GPT-3 has 96.</p>'

+ '<h2 class="l-title">7. BERT — Encoder-Only Transformer</h2>'

+ '<p class="l-text"><strong>BERT (Bidirectional Encoder Representations from Transformers)</strong>, Devlin et al. 2018, uses only the encoder — no decoder. Two key ideas:</p>'

+ '<h3 class="l-subtitle">Idea 1: pre-training + fine-tuning</h3>'

+ '<p class="l-text">BERT trains in two stages:</p>'

+ '<ol class="l-list">'
+ '<li><strong>Pre-training:</strong> on huge text (Wikipedia + books) — learns general language. No labels.</li>'
+ '<li><strong>Fine-tuning:</strong> on small labelled task data (sentiment, NER, etc.) — adapts to the specific task.</li>'
+ '</ol>'

+ '<p class="l-text">This separation is <strong>revolutionary</strong>. We used to train a model from scratch per task. With BERT, general language knowledge from billions of sentences transfers to every task.</p>'

+ '<h3 class="l-subtitle">Idea 2: two pre-training objectives</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Masked Language Modeling (MLM):</strong> mask 15% of words in a sentence and have the model predict them. <em>"This movie was [MASK] amazing"</em> → "truly". Bidirectional learning.</li>'
+ '<li><strong>Next Sentence Prediction (NSP):</strong> given two sentences, predict whether the second follows the first. (Later found weak; dropped in RoBERTa.)</li>'
+ '</ul>'

+ '<p class="l-text">MLM\'s power: the model uses both left and right context to predict the masked word. That is why BERT is "bidirectional" — unlike GPT.</p>'

+ '<h3 class="l-subtitle">BERT for Turkish — BERTurk</h3>'

+ '<p class="l-text">The original BERT was English-heavy. For Turkish, <strong>BERTurk</strong> (dbmdz, 2020) was trained on Turkish Wikipedia + OPUS + a large web crawl. Still the <em>de facto</em> standard for Turkish NLP.</p>'

+ '<h2 class="l-title">8. GPT — Decoder-Only Transformer</h2>'

+ '<p class="l-text"><strong>GPT (Generative Pre-trained Transformer)</strong>, OpenAI 2018, is the opposite of BERT: only the decoder, only looks left. The training objective is <strong>predict the next word</strong> — the classical language modelling task (<a href="/tutorials/nlp/8">Lesson 8</a>).</p>'

+ '<p class="l-text">It is called "causal" or "autoregressive": a word can only attend to earlier words. This makes generation natural: predict the next word from earlier ones, then the next, then the next.</p>'

+ '<div class="calc-example"><div class="example-label">BERT vs GPT</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Aspect</th><th style="padding:.5rem">BERT</th><th style="padding:.5rem">GPT</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Architecture</td><td style="text-align:center">Encoder-only</td><td style="text-align:center">Decoder-only</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Direction</td><td style="text-align:center">Bidirectional</td><td style="text-align:center">Unidirectional (causal)</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Pre-training</td><td style="text-align:center">MLM + NSP</td><td style="text-align:center">Next-token prediction</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Strong at</td><td style="text-align:center">Understanding (classification, NER, QA)</td><td style="text-align:center">Generation (writing, code, chat)</td></tr>'
+ '<tr><td style="padding:.5rem">Modern example</td><td style="text-align:center">RoBERTa, DeBERTa, BERTurk</td><td style="text-align:center">GPT-4, Llama, Claude</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<h2 class="l-title">9. The transformers Library in Python</h2>'

+ '<p class="l-text">HuggingFace\'s <strong>transformers</strong> library exposes all these models with a uniform API.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Sentence embeddings with BERTurk</div><div class="code-block"><pre><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModel'
+ '\n<span class="kw">import</span> torch'
+ '\n'
+ '\nmodel_name = <span class="str">"dbmdz/bert-base-turkish-cased"</span>'
+ '\ntokenizer = <span class="fn">AutoTokenizer</span>.<span class="fn">from_pretrained</span>(model_name)'
+ '\nmodel = <span class="fn">AutoModel</span>.<span class="fn">from_pretrained</span>(model_name)'
+ '\n'
+ '\ntext = <span class="str">"Bu film gerçekten harikaydı"</span>'
+ '\ntokens = <span class="fn">tokenizer</span>(text, return_tensors=<span class="str">"pt"</span>)'
+ '\n'
+ '\n<span class="kw">with</span> torch.<span class="fn">no_grad</span>():'
+ '\n    out = <span class="fn">model</span>(**tokens)'
+ '\n'
+ '\n<span class="cm"># last_hidden_state: (1, T, 768) — 768-dim vector per token</span>'
+ '\n<span class="fn">print</span>(out.last_hidden_state.shape)'
+ '\n'
+ '\n<span class="cm"># Sentence vector: the [CLS] token vector</span>'
+ '\ncls_vec = out.last_hidden_state[<span class="num">0</span>, <span class="num">0</span>, :]'
+ '\n<span class="fn">print</span>(cls_vec.<span class="fn">shape</span>)  <span class="cm"># torch.Size([768])</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Replace BERT/transformers with TF-IDF + LogisticRegression on `df_reviews` — same end-task: text → label.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX_text = df_reviews[\'text\'].astype(str).values\ny      = df_reviews[\'sentiment\'].values\n\nXtr, Xte, ytr, yte = train_test_split(X_text, y, test_size=0.3, random_state=0, stratify=y)\n\nvec = TfidfVectorizer(max_features=2000, ngram_range=(1,2)).fit(Xtr)\nclf = LogisticRegression(max_iter=400).fit(vec.transform(Xtr), ytr)\n\nprint(\'train acc:\', round(clf.score(vec.transform(Xtr), ytr), 3))\nprint(\'test  acc:\', round(clf.score(vec.transform(Xte), yte), 3))\nprint(\'sample :\', clf.predict(vec.transform([\'this movie was amazing\']))[0])</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Downloads BERTurk\'s tokenizer and model from the HuggingFace Hub. Tokenises a Turkish sentence and runs it through the model. The output gives one 768-dim contextual vector per token. The single-sentence representation is the vector of the special <code>[CLS]</code> token — feed it directly into a classifier or use for similarity comparisons.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> BERTurk fine-tune (sentiment skeleton)</div><div class="code-block"><pre><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments'
+ '\n'
+ '\nmodel = <span class="fn">AutoModelForSequenceClassification</span>.<span class="fn">from_pretrained</span>('
+ '\n    <span class="str">"dbmdz/bert-base-turkish-cased"</span>,'
+ '\n    num_labels=<span class="num">2</span>,   <span class="cm"># positive / negative</span>'
+ '\n)'
+ '\n'
+ '\nargs = <span class="fn">TrainingArguments</span>('
+ '\n    output_dir=<span class="str">"./berturk-sentiment"</span>,'
+ '\n    num_train_epochs=<span class="num">3</span>,'
+ '\n    per_device_train_batch_size=<span class="num">16</span>,'
+ '\n    learning_rate=<span class="num">2e-5</span>,'
+ '\n)'
+ '\n'
+ '\ntrainer = <span class="fn">Trainer</span>('
+ '\n    model=model,'
+ '\n    args=args,'
+ '\n    train_dataset=train_ds,'
+ '\n    eval_dataset=val_ds,'
+ '\n)'
+ '\ntrainer.<span class="fn">train</span>()</code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Replace BERT/transformers with TF-IDF + LogisticRegression on `df_reviews` — same end-task: text → label.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX_text = df_reviews[\'text\'].astype(str).values\ny      = df_reviews[\'sentiment\'].values\n\nXtr, Xte, ytr, yte = train_test_split(X_text, y, test_size=0.3, random_state=0, stratify=y)\n\nvec = TfidfVectorizer(max_features=2000, ngram_range=(1,2)).fit(Xtr)\nclf = LogisticRegression(max_iter=400).fit(vec.transform(Xtr), ytr)\n\nprint(\'train acc:\', round(clf.score(vec.transform(Xtr), ytr), 3))\nprint(\'test  acc:\', round(clf.score(vec.transform(Xte), yte), 3))\nprint(\'sample :\', clf.predict(vec.transform([\'this movie was amazing\']))[0])</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> <code>AutoModelForSequenceClassification</code> wraps BERTurk with a small classification head. <code>Trainer</code> handles the training loop, optimisation, validation, logging in one object. <code>learning_rate=2e-5</code> is the typical fine-tuning rate; larger learning rates wreck the pretrained weights. 3 epochs are usually enough — BERT already knows the language; it only needs to learn the task.</p>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">You learned the Transformer architecture and the two big model families (BERT, GPT). You laid the foundation of modern NLP. <a href="/tutorials/nlp/11">Lesson 11</a> moves up the stack to <strong>large language models (LLMs)</strong>: GPT-3/4, Llama, Claude. How scale created quality, how RLHF works, how LoRA enables low-resource fine-tuning — all coming up.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> Why the Transformer emerged in 2017 and how it overcame the limits of RNNs. Self-attention (Q/K/V), the scaled dot-product formula, and how multi-head attention captures different relations in parallel. How positional encoding fixes self-attention\'s order-blindness. The structure of a full Transformer block (multi-head attention + residual + LayerNorm + feed-forward + residual + LayerNorm). The fundamental difference between BERT (encoder-only, bidirectional, MLM pre-training) and GPT (decoder-only, causal, next-token). Real code with the transformers library — BERTurk embeddings and a fine-tuning skeleton.</div>'

};
