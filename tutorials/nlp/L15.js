/* nlp-L15.js — NLP Course Lesson 15: LLM Değerlendirme — BLEU, ROUGE, BERTScore, LLM-as-Judge, Modern Benchmarks (TR + EN) */
var NLP_L15 = {

tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Bir LLM\'i nasıl <em>doğru</em> değerlendirirsin? Üretken modellerde tek bir doğru cevap yok — aynı soruya elli farklı geçerli yanıt olabilir. Bu ders <strong>klasik n-gram metriklerini</strong> (BLEU, ROUGE, METEOR, chrF, TER), <strong>semantik metrikleri</strong> (BERTScore), <strong>LLM-as-judge</strong> yaklaşımını, ve 2024-2026 dönemine damga vuran <strong>holistik benchmark\'ları</strong> (MMLU, HumanEval, IFEval, MT-Bench, Chatbot Arena, SWE-bench, GPQA) tek bir tutarlı çerçevede gezer. Sonunda kendi pipeline\'ını kurabilirsin.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Görev tipine göre doğru metriği seçmeyi (çeviri, özet, kod, akıl yürütme)</li>'
+ '<li>BLEU, ROUGE, METEOR, chrF, TER ve BERTScore\'u Python\'da hesaplamayı</li>'
+ '<li>LLM-as-judge ile ölçeklenebilir kalite değerlendirmesi tasarlamayı</li>'
+ '<li>MMLU, HumanEval, IFEval, MT-Bench, SWE-bench gibi benchmark\'ları okumayı</li>'
+ '<li>Chatbot Arena Elo sıralamalarını yorumlamayı ve sınırlarını bilmeyi</li>'
+ '<li>Kendi golden-set\'inle bir üretim eval pipeline\'ı kurmayı</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Değerlendirme Niye Zor?</h2>'

+ '<p class="l-text">Klasik makine öğrenmesinde değerlendirme görece basittir: sınıflandırmada doğruluk, regresyonda MSE. Üretken modellerde bu rahatlık biter. <strong>Aynı soruya birden fazla geçerli cevap</strong> olabilir:</p>'

+ '<div class="calc-example"><div class="example-label">ÖRNEK — TEK SORU, ÇOK GEÇERLİ CEVAP</div><div class="example-body">'
+ '<p class="l-text"><strong>Soru:</strong> "Fransa\'nın başkenti nedir, kısaca anlat."</p>'
+ '<ul class="l-list" style="margin:.4rem 0">'
+ '<li>A: "Paris, Fransa\'nın başkentidir ve Seine nehrinin üzerinde kuruludur."</li>'
+ '<li>B: "Başkent Paris\'tir; ülkenin siyasi ve kültürel merkezidir."</li>'
+ '<li>C: "Paris. Aynı zamanda Avrupa\'nın en kalabalık şehirlerinden biri."</li>'
+ '</ul>'
+ '<p class="l-text">Üçü de doğru. Hangisi "en iyi"? "Referansla karşılaştır" yaklaşımı burada kırılır: tek bir referans seçersen ötekileri yanlış olarak cezalandırırsın.</p>'
+ '</div></div>'

+ '<p class="l-text">Bu yüzden modern LLM değerlendirmesi <strong>üç kola</strong> ayrılır:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Yüzey metrikleri (n-gram):</strong> BLEU, ROUGE, METEOR — hızlı, ucuz, ama yüzeysel.</li>'
+ '<li><strong>Semantik metrikler:</strong> BERTScore, COMET — anlam yakalar, model bağımlı.</li>'
+ '<li><strong>Yargı tabanlı:</strong> İnsan değerlendirici veya LLM-as-judge — pahalı ama esnek.</li>'
+ '</ul>'

+ '<p class="l-text">Görev tipi metrik seçimini belirler: <em>çeviri</em> için BLEU + COMET, <em>özet</em> için ROUGE + BERTScore, <em>kod</em> için pass@k, <em>akıl yürütme</em> için kesin eşleşme veya LLM judge, <em>sohbet</em> için MT-Bench veya Arena.</p>'

+ '<h2 class="l-title">2. Sınıflandırma Metriklerine Hızlı Bakış</h2>'

+ '<p class="l-text">Üretken modellerin de bazı bileşenleri kapalı-küme cevap verir: duygu sınıflandırma, niyet tespiti, ad-varlık tanıma, soru-cevap (multiple choice). Bu durumlarda klasik metrikler yeterlidir.</p>'

+ '<div class="katex-block">$$\\text{Accuracy} = \\frac{\\text{Correct}}{\\text{Total}}, \\quad F_1 = \\frac{2 \\cdot P \\cdot R}{P + R}$$</div>'

+ '<ul class="l-list">'
+ '<li><strong>Accuracy:</strong> dengeli veri için yeterli, dengesiz veride yanıltıcı.</li>'
+ '<li><strong>F1 (precision/recall harmonik ortalaması):</strong> azınlık sınıf önemliyse zorunlu.</li>'
+ '<li><strong>ROC-AUC:</strong> eşik bağımsız sıralama kalitesi — özellikle ikili sınıflandırmada.</li>'
+ '<li><strong>Confusion matrix:</strong> her metriği özetlemeden önce hangi sınıfların karıştığını gör.</li>'
+ '</ul>'

+ '<p class="l-text">LLM bir sınıflandırma için kullanıldığında çıktıyı parse edip etiket çıkarmak gerekir (örn. "olumlu" → 1). Parse hataları metriği bozar, sağlam regex veya constrained-decoding kullan.</p>'

+ '<h2 class="l-title">3. BLEU — Çevirinin Klasiği</h2>'

+ '<p class="l-text"><strong>BLEU (Bilingual Evaluation Understudy, Papineni ve ark. 2002)</strong> makine çevirisi için tasarlandı ve hâlâ makale standardı. Modelin üretimi <em>aday</em>, insan çevirisi <em>referans</em>. BLEU n-gram örtüşmesine bakar.</p>'

+ '<div class="katex-block">$$\\text{BLEU} = \\text{BP} \\cdot \\exp\\Bigl( \\sum_{n=1}^{4} w_n \\log p_n \\Bigr)$$</div>'

+ '<p class="l-text">Burada <em>p_n</em> = aday cümlede referansla eşleşen n-gram oranı (precision, "clipped" — aynı kelimenin tekrar sayılmaması için referans frekansıyla sınırlı), <em>w_n = 1/4</em> tipik. <strong>BP (Brevity Penalty)</strong> kısa cümleleri cezalandırır:</p>'

+ '<div class="katex-block">$$\\text{BP} = \\begin{cases} 1 & \\text{if } c > r \\\\ \\exp(1 - r/c) & \\text{if } c \\le r \\end{cases}$$</div>'

+ '<p class="l-text"><em>c</em> = aday uzunluğu, <em>r</em> = referans uzunluğu. Cezasız bırakılsa model "the" gibi sık kelimelerden tek-kelimelik cevap yazarak yüksek precision alır.</p>'

+ '<h3 class="l-subtitle">BLEU\'nun sınırları</h3>'

+ '<ul class="l-list">'
+ '<li>Eş anlam, eş sözdizimi tanımıyor: "araba" ↔ "otomobil" sıfır puan alır.</li>'
+ '<li>Tek referans yetersiz — birden çok referansla daha gerçekçi.</li>'
+ '<li>Cümle seviyesinde gürültülü, en az korpus seviyesinde anlamlı.</li>'
+ '<li>Yine de WMT (Workshop on Machine Translation) gibi yerlerde varsayılan metrik.</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> sacrebleu ile BLEU</div><div class="code-block"><pre><code><span class="kw">import</span> sacrebleu'
+ '\n'
+ '\nreferences = [['
+ '\n    <span class="str">"Kedi mindere oturdu."</span>,'
+ '\n    <span class="str">"Hava bugün güzel."</span>,'
+ '\n]]'
+ '\nhypotheses = ['
+ '\n    <span class="str">"Kedi mindere kuruldu."</span>,'
+ '\n    <span class="str">"Bugün hava harika."</span>,'
+ '\n]'
+ '\n'
+ '\nbleu = sacrebleu.<span class="fn">corpus_bleu</span>(hypotheses, references)'
+ '\n<span class="fn">print</span>(bleu.score)        <span class="cm"># 25-50 arası tipik, 60+ çok iyi</span>'
+ '\n<span class="fn">print</span>(bleu.precisions)   <span class="cm"># [1-gram, 2-gram, 3-gram, 4-gram] yüzdeleri</span></code></pre></div></div>'

+ '<p class="l-text"><code>sacrebleu</code> tokenize farklılıklarını yok eder; bu yüzden makaleler arasında karşılaştırma için <strong>fiili standart</strong>. Eski "tokenize edilmiş BLEU" değerleri tutarsızdı.</p>'

+ '<h2 class="l-title">4. ROUGE — Özetlemenin Dili</h2>'

+ '<p class="l-text"><strong>ROUGE (Recall-Oriented Understudy for Gisting Evaluation, Lin 2004)</strong> özetleme için tasarlandı. BLEU precision-ağırlıklı, ROUGE recall-ağırlıklı: aday referansta geçen önemli kısımları kapsıyor mu?</p>'

+ '<ul class="l-list">'
+ '<li><strong>ROUGE-N:</strong> n-gram recall. ROUGE-1 (unigram), ROUGE-2 (bigram) en sık.</li>'
+ '<li><strong>ROUGE-L:</strong> En uzun ortak alt-dizi (Longest Common Subsequence). Sıralamayı korur, atlamaya izin verir.</li>'
+ '<li><strong>ROUGE-Lsum:</strong> Çok cümleli özetler için cümle bazlı LCS — özet leaderboard\'larının (CNN/DailyMail, XSum) ana metriği.</li>'
+ '<li><strong>ROUGE-W:</strong> ardışık eşleşmeyi ödüllendiren ağırlıklı LCS.</li>'
+ '</ul>'

+ '<div class="katex-block">$$\\text{ROUGE-N}_{\\text{recall}} = \\frac{\\sum_{s \\in \\text{ref}} \\text{Count}_{\\text{match}}(s)}{\\sum_{s \\in \\text{ref}} \\text{Count}(s)}$$</div>'

+ '<p class="l-text">Pratikte F1 raporlanır: precision (aday ne kadar fazla bilgi içermiyor) ve recall birlikte. ROUGE-2 F1\'i 0.30+ özet için iyi, 0.40+ üstü çok iyi.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> evaluate kütüphanesi ile ROUGE</div><div class="code-block"><pre><code><span class="kw">import</span> evaluate'
+ '\n'
+ '\nrouge = evaluate.<span class="fn">load</span>(<span class="str">"rouge"</span>)'
+ '\n'
+ '\npredictions = ['
+ '\n    <span class="str">"Kedi mindere oturdu ve uyudu."</span>,'
+ '\n    <span class="str">"Bugün hava çok güzeldi, parka gittik."</span>,'
+ '\n]'
+ '\nreferences = ['
+ '\n    <span class="str">"Kedi minderde uyuyakaldı."</span>,'
+ '\n    <span class="str">"Hava güzel olduğu için parka gittik."</span>,'
+ '\n]'
+ '\n'
+ '\nresult = rouge.<span class="fn">compute</span>(predictions=predictions, references=references)'
+ '\n<span class="fn">print</span>(result)'
+ '\n<span class="cm"># {\'rouge1\': 0.55, \'rouge2\': 0.28, \'rougeL\': 0.50, \'rougeLsum\': 0.52}</span></code></pre></div></div>'

+ '<p class="l-text">Türkçe gibi morfolojik olarak zengin dillerde ROUGE sert davranır — "gittik" ve "gitti" farklı sayılır. Bu nedenle stemmer önişlemi sıkça eklenir.</p>'

+ '<h2 class="l-title">5. METEOR, chrF, TER</h2>'

+ '<p class="l-text">BLEU\'nun zayıflıklarını gidermek için üç popüler alternatif geliştirildi:</p>'

+ '<h3 class="l-subtitle">METEOR</h3>'

+ '<p class="l-text"><strong>METEOR (Banerjee & Lavie 2005)</strong> kelime eşlemeyi katmanlı yapar: önce tam eşleşme, sonra stem eşleşmesi, ardından eş anlamlı (WordNet üzerinden). Sıralama farklarını da hesaba katar. İnsan değerlendirmesiyle korelasyonu BLEU\'dan yüksek, özellikle düşük puanlı çevirilerde.</p>'

+ '<h3 class="l-subtitle">chrF — karakter F-score</h3>'

+ '<p class="l-text"><strong>chrF (Popović 2015)</strong> kelime yerine <em>karakter n-gram</em> eşleşmesine bakar. Morfolojik dillerde ve düşük-kaynaklı dillerde mükemmel: "kitabımdaki" ve "kitabımdan" arasında chrF yüksek puan verir, BLEU sıfır. Türkçe, Macarca, Fince için fiili standart.</p>'

+ '<div class="katex-block">$$\\text{chrF}_\\beta = (1 + \\beta^2) \\cdot \\frac{P \\cdot R}{\\beta^2 \\cdot P + R}$$</div>'

+ '<p class="l-text">Tipik <em>n=6</em> karakter n-gram\'ı, <em>β=2</em> recall\'a iki kat ağırlık.</p>'

+ '<h3 class="l-subtitle">TER — Translation Edit Rate</h3>'

+ '<p class="l-text"><strong>TER (Snover ve ark. 2006)</strong> tersi düşünür: aday referansa dönüşmek için kaç düzenleme (insert/delete/substitute/shift) gerekir? Düşük TER = iyi.</p>'

+ '<div class="katex-block">$$\\text{TER} = \\frac{\\text{Edits}}{\\text{Reference length}}$$</div>'

+ '<p class="l-text">Post-editing iş yükü ölçmek için endüstride yaygın: çevirmen ne kadar düzeltmek zorunda kaldı?</p>'

+ '<h2 class="l-title">6. BERTScore — Semantik Eşleşme</h2>'

+ '<p class="l-text"><strong>BERTScore (Zhang ve ark. 2019)</strong> yüzey değil <em>anlam</em> eşler. Her token için BERT\'in bağlamsal embedding\'ini al, aday ile referans arasında çiftli cosine benzerliği hesapla, en iyi eşleşmeleri seç.</p>'

+ '<p class="l-text">Aday tokenları <em>x_i</em>, referans tokenları <em>y_j</em>. Recall ve precision token bazında:</p>'

+ '<div class="katex-block">$$R_{\\text{BERT}} = \\frac{1}{|y|} \\sum_{y_j \\in y} \\max_{x_i \\in x} \\mathbf{x}_i^\\top \\mathbf{y}_j, \\quad P_{\\text{BERT}} = \\frac{1}{|x|} \\sum_{x_i \\in x} \\max_{y_j \\in y} \\mathbf{x}_i^\\top \\mathbf{y}_j$$</div>'

+ '<p class="l-text">F1 = harmonik ortalama. Sonuç olarak: <em>"kedi mindere oturdu"</em> ile <em>"kedi yastığa kuruldu"</em> BERTScore\'da yüksek, BLEU\'da neredeyse sıfır.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Artı:</strong> Eş anlam, parafraz, sözdizim varyasyonunu yakalar. İnsan değerlendirmesiyle yüksek korelasyon.</li>'
+ '<li><strong>Eksi:</strong> Hangi BERT modelini kullandığına çok bağlı. <code>roberta-large</code> İngilizce için varsayılan; Türkçe için <code>dbmdz/bert-base-turkish-cased</code>.</li>'
+ '<li><strong>Baseline normalization:</strong> Ham skor 0.7-0.9 aralığına sıkışır; <code>--rescale-with-baseline</code> ile [0,1] aralığına genişletilir.</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> bert-score ile Türkçe karşılaştırma</div><div class="code-block"><pre><code><span class="kw">from</span> bert_score <span class="kw">import</span> score'
+ '\n'
+ '\ncands = [<span class="str">"Kedi yastığa kuruldu."</span>, <span class="str">"Toplantı yarına ertelendi."</span>]'
+ '\nrefs  = [<span class="str">"Kedi mindere oturdu."</span>,  <span class="str">"Toplantı yarına alındı."</span>]'
+ '\n'
+ '\nP, R, F1 = <span class="fn">score</span>('
+ '\n    cands, refs,'
+ '\n    model_type=<span class="str">"dbmdz/bert-base-turkish-cased"</span>,'
+ '\n    num_layers=<span class="num">9</span>,'
+ '\n    rescale_with_baseline=<span class="kw">False</span>,'
+ '\n)'
+ '\n<span class="fn">print</span>(<span class="str">"F1 per örnek:"</span>, F1.<span class="fn">tolist</span>())'
+ '\n<span class="cm"># [0.91, 0.93] — yüzeyde farklı, semantik olarak yakın</span></code></pre></div></div>'

+ '<p class="l-text">BLEU\'da bu iki cümle çifti için skor 5-10 civarı kalırdı — n-gram örtüşmesi minimal. BERTScore anlamı yakalayarak adil bir değerlendirme verir.</p>'

+ '<h2 class="l-title">7. LLM-as-Judge — Yargıç Olarak Model</h2>'

+ '<p class="l-text">N-gram ve semantik metrikler hâlâ "referansa benzerlik" üzerine kurulu. Ama bir sohbet asistanının yanıtını nasıl değerlendiriyorsun — referans yok ki. <strong>Zheng ve ark. (2023, MT-Bench)</strong> çözümü adlandırdı: <strong>LLM-as-judge</strong>. Güçlü bir modele (GPT-4, Claude Opus) "iki cevaptan hangisi daha iyi" veya "bu cevabı 1-10 arası puanla" sorularını yöneltir, gerekçesini ister, sonra puanı parse edersin.</p>'

+ '<h3 class="l-subtitle">İki temel mod</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Pairwise (ikili karşılaştırma):</strong> İki yanıt göster, "hangisi daha iyi?" sor. Düşük gürültü, ölçeklenebilir Elo derecelendirmesi mümkün.</li>'
+ '<li><strong>Absolute (mutlak skorlama):</strong> Tek yanıta 1-10 arası puan ver. Rubrik vermek şart (doğruluk, akıcılık, ilgililik, vs.).</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Yargıç biasları — bilinmeli</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Position bias:</strong> İlk gösterilen cevap %15-25 fazla seçilir. Çare: çiftleri her iki sırayla çalıştırmak ve ortalamak.</li>'
+ '<li><strong>Verbosity bias:</strong> Uzun cevap daha çok beğenilir. Çare: rubrikte uzunluğu yasakla veya kısa/uzun eşit dağılım kontrol et.</li>'
+ '<li><strong>Self-preference:</strong> GPT-4 GPT-4 üretimini tercih eder. Çare: judge\'ı test edilen modelden farklı seç.</li>'
+ '<li><strong>Easy-question bias:</strong> Kolay sorularda hepsi 9-10 alır; ayrımsızlaşır. Çare: zorluk dağıtımını çeşitlendir.</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Pairwise LLM-judge — Claude ile</div><div class="code-block"><pre><code><span class="kw">import</span> anthropic, json'
+ '\n'
+ '\nclient = anthropic.<span class="fn">Anthropic</span>()'
+ '\n'
+ '\nJUDGE_PROMPT = <span class="str">"""İki yanıt arasında hangisi sorunun ihtiyacını daha iyi karşılıyor, gerekçeli karar ver.'
+ '\nKriterler: doğruluk, ilgililik, açıklık, gereksiz uzatma cezası.'
+ '\nÇıktı SADECE JSON: {{"winner": "A" | "B" | "tie", "reason": "..."}}'
+ '\n'
+ '\nSORU: {q}'
+ '\nCevap A: {a}'
+ '\nCevap B: {b}'
+ '\n"""</span>'
+ '\n'
+ '\n<span class="kw">def</span> <span class="fn">judge</span>(q, a, b):'
+ '\n    msg = client.messages.<span class="fn">create</span>('
+ '\n        model=<span class="str">"claude-opus-4-7"</span>,'
+ '\n        max_tokens=<span class="num">400</span>,'
+ '\n        messages=[{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: JUDGE_PROMPT.<span class="fn">format</span>(q=q, a=a, b=b)}],'
+ '\n    )'
+ '\n    <span class="kw">return</span> json.<span class="fn">loads</span>(msg.content[<span class="num">0</span>].text)'
+ '\n'
+ '\n<span class="cm"># Position bias\'a karşı her çifti iki kez çalıştır, sonuçları birleştir</span>'
+ '\nr1 = <span class="fn">judge</span>(q, ans1, ans2)'
+ '\nr2 = <span class="fn">judge</span>(q, ans2, ans1)  <span class="cm"># sıralar ters</span>'
+ '\n<span class="fn">print</span>(r1[<span class="str">"winner"</span>], r2[<span class="str">"winner"</span>])</code></pre></div></div>'

+ '<p class="l-text">İnsan-LLM judge anlaşması iyi tasarlanmış prompt\'larda %80-85 civarında — uzman olmayan insan değerlendirici çiftleri arasındaki anlaşmayla aynı seviye. Yani LLM-judge "insan kadar iyi" olabilir, ama insan kadar pahalı değildir.</p>'

+ '<h2 class="l-title">8. Holistik Benchmark\'lar — Modern Sınavlar</h2>'

+ '<p class="l-text">Tek bir görev modeli kapsamlı ölçemez. 2020 sonrası dönemde <strong>holistik benchmark suite\'leri</strong> doğdu: çok-görev, çok-yetenek, tek bir liderlik tablosu.</p>'

+ '<div class="calc-example"><div class="example-label">YAYGINLIK SIRASIYLA — 2026 BENCHMARK MANZARASI</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.9rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Benchmark</th><th style="text-align:left;padding:.5rem">Ne ölçer</th><th style="padding:.5rem">Format</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>MMLU</strong></td><td style="padding:.5rem">57 konuda bilgi (tarih, matematik, hukuk, tıp...)</td><td style="text-align:center">Çoktan seçmeli</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>MMLU-Pro</strong></td><td style="padding:.5rem">MMLU\'nun zorlaştırılmış sürümü (10 seçenek, daha sert)</td><td style="text-align:center">Çoktan seçmeli</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>HumanEval</strong></td><td style="padding:.5rem">Python kod üretimi (164 fonksiyon, pass@k)</td><td style="text-align:center">Kod testi</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>MBPP</strong></td><td style="padding:.5rem">Daha basit Python görevleri (974 problem)</td><td style="text-align:center">Kod testi</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>HumanEval+ / BigCodeBench</strong></td><td style="padding:.5rem">Daha zor, gerçek-dünya benzeri kod görevleri</td><td style="text-align:center">Kod testi</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>GSM8K</strong></td><td style="padding:.5rem">İlkokul seviyesi kelime problemleri (8500 soru)</td><td style="text-align:center">Sayısal cevap</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>MATH</strong></td><td style="padding:.5rem">Lise olimpiyatı seviyesi matematik</td><td style="text-align:center">Sayısal/LaTeX</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>IFEval</strong></td><td style="padding:.5rem">Talimat takip etme (kelime sayısı, format kuralları)</td><td style="text-align:center">Program ile kontrol</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>MT-Bench</strong></td><td style="padding:.5rem">80 açık-uçlu sohbet sorusu, 2-turlu</td><td style="text-align:center">LLM-judge</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Chatbot Arena</strong></td><td style="padding:.5rem">Crowd-sourced ikili oylama, Elo</td><td style="text-align:center">İnsan oyu</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>SWE-bench</strong></td><td style="padding:.5rem">Gerçek GitHub issue\'larını çözmek (2294 problem)</td><td style="text-align:center">Test geçme</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>GPQA</strong></td><td style="padding:.5rem">Uzman seviyesi bilim (fizik, kimya, biyoloji)</td><td style="text-align:center">Çoktan seçmeli</td></tr>'
+ '<tr><td style="padding:.5rem"><strong>HellaSwag</strong></td><td style="padding:.5rem">Sağduyu akıl yürütme (cümle tamamlama)</td><td style="text-align:center">Çoktan seçmeli</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<h3 class="l-subtitle">pass@k — kodun değerlendirme metriği</h3>'

+ '<p class="l-text">Kod görevlerinde tek üretim yetmez — model bazen şanslı çıkar. <strong>pass@k</strong> şu soruyu sorar: "Modelden k farklı çözüm üretmesini istesem, en az birinin testleri geçme olasılığı kaç?" Tarafsız tahminci:</p>'

+ '<div class="katex-block">$$\\text{pass@}k = \\mathbb{E}\\Bigl[ 1 - \\binom{n-c}{k} / \\binom{n}{k} \\Bigr]$$</div>'

+ '<p class="l-text">Burada <em>n</em> = üretilen örnek sayısı, <em>c</em> = bunlardan testleri geçen sayısı. pass@1 sertliği, pass@10 esnekliği ölçer.</p>'

+ '<h3 class="l-subtitle">IFEval — talimat takip etme</h3>'

+ '<p class="l-text">IFEval (Zhou ve ark. 2023) zekâ değil <em>disiplin</em> ölçer: "Cevabın 100 kelime altında olsun", "tam üç paragraf yaz", "her cümle \'Bu\' ile başlasın". Programatik olarak doğrulanabilir kurallar; LLM-judge bile gerek değil. Modern modellerde %85-90 civarı, küçük modellerde %50 altı.</p>'

+ '<div class="plotly-graph"><div id="plot-nlp15-corr-tr" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var samples=["Çeviri 1","Çeviri 2","Çeviri 3","Çeviri 4","Çeviri 5","Çeviri 6","Çeviri 7","Çeviri 8"];'
+ 'var bleu=[0.18,0.52,0.31,0.08,0.71,0.44,0.62,0.27];'
+ 'var rouge=[0.34,0.61,0.42,0.21,0.78,0.55,0.69,0.38];'
+ 'var bertsc=[0.78,0.89,0.82,0.71,0.95,0.86,0.92,0.80];'
+ 'var t1={x:samples,y:bleu,name:"BLEU",type:"bar",marker:{color:"#c8a96e"}};'
+ 'var t2={x:samples,y:rouge,name:"ROUGE-L",type:"bar",marker:{color:"#4ecdc4"}};'
+ 'var t3={x:samples,y:bertsc,name:"BERTScore F1",type:"bar",marker:{color:"#9d80c8"}};'
+ 'var layout={xaxis:{color:T.text,gridcolor:T.grid},yaxis:{color:T.text,gridcolor:T.grid,title:"Skor",range:[0,1]},barmode:"group",paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:60,l:60},legend:{font:{color:T.text}}};'
+ 'if(document.getElementById("plot-nlp15-corr-tr"))Plotly.newPlot("plot-nlp15-corr-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Sekiz farklı çeviri örneği için BLEU, ROUGE-L ve BERTScore yan yana. BERTScore neredeyse her zaman daha yüksek — semantik benzerlik n-gram örtüşmesinden geniştir. BLEU en sert: Örnek 4 gibi paraprasing\'in baskın olduğu durumlarda 0.08\'e iner, ama BERTScore 0.71 verir. Pratik sonuç: <em>tek metrikle karar verme</em>, en az ikisini birden raporla. BLEU + BERTScore çoğu çeviri için iyi bir kombinasyon.</div>'

+ '<h2 class="l-title">9. Chatbot Arena — Halkın Yargısı</h2>'

+ '<p class="l-text"><strong>LMSYS Chatbot Arena</strong> (chat.lmsys.org, 2023\'ten beri) sohbet kalitesi için altın standart hâline geldi. Kullanıcı bir soru yazar, iki anonim model yan yana yanıt verir, kullanıcı oyunu verir. Sonuç: <strong>Elo derecelendirmesi</strong> — satrançtaki gibi.</p>'

+ '<div class="katex-block">$$E_A = \\frac{1}{1 + 10^{(R_B - R_A)/400}}, \\quad R_A \\leftarrow R_A + K \\cdot (S_A - E_A)$$</div>'

+ '<p class="l-text"><em>R_A, R_B</em> oyuncuların Elo\'su, <em>E_A</em> A\'nın kazanma olasılığı, <em>S_A</em> gerçek sonuç (1, 0.5, 0), <em>K</em> öğrenme oranı (Arena için ~4). 400 Elo farkı %91 kazanma oranına denk gelir.</p>'

+ '<h3 class="l-subtitle">Arena\'nın güçlü yönleri</h3>'

+ '<ul class="l-list">'
+ '<li>Gerçek kullanıcı görevleri — sentetik benchmark\'lardan kaçınır.</li>'
+ '<li>Yüz binlerce oy ile istatistiksel güç yüksek.</li>'
+ '<li>"Hangi LLM daha iyi" sorusunun en yakın objektif cevabı.</li>'
+ '<li>Yeni modelleri haftalar içinde sıralamaya katar.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Sınırları</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Soru dağılımı sapmalı:</strong> Kullanıcılar genelde kolay/yaratıcı soru sorar, uzman-seviyesi az.</li>'
+ '<li><strong>Style-over-substance:</strong> Format güzel olan (markdown, emoji) cevap daha çok kazanır — içerik aynıysa.</li>'
+ '<li><strong>Length bias:</strong> Uzun yanıt %5-10 daha çok kazanır.</li>'
+ '<li><strong>Popülerlik kaymalı:</strong> Tanınmış marka isimleri (GPT, Claude) çapraz-doğrulamada hafif avantaj.</li>'
+ '<li>"Style-controlled Elo" gibi düzeltilmiş sürümler bu biasları azaltır.</li>'
+ '</ul>'

+ '<div class="plotly-graph"><div id="plot-nlp15-arena-tr" style="width:100%;height:430px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var models=["GPT-5","Claude Opus 4.7","Gemini 2.5 Pro","Llama 4 405B","GPT-4o","DeepSeek V3","Claude Sonnet 4.6","Qwen2.5-Max","Mistral Large 3","Grok 3"];'
+ 'var elos=[1411,1397,1382,1352,1340,1331,1318,1305,1289,1271];'
+ 'var t1={x:elos,y:models,type:"bar",orientation:"h",marker:{color:T.accent},text:elos.map(String),textposition:"outside"};'
+ 'var layout={xaxis:{color:T.text,gridcolor:T.grid,title:"Elo",range:[1200,1450]},yaxis:{color:T.text,gridcolor:T.grid,autorange:"reversed"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:60,b:50,l:170}};'
+ 'if(document.getElementById("plot-nlp15-arena-tr"))Plotly.newPlot("plot-nlp15-arena-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> İllüstratif Arena Top-10 (2026 Q2 dönemine yakın sıralama). Top 3 model arasındaki fark sadece ~30 Elo — istatistiksel olarak çoğu zaman karışık çıkar. Top 1\'le 10. sıra arasında ~140 Elo, bu da %70-30 kazanma oranına denk gelir. <em>Sayılara tek başına bakma:</em> aynı modeller görev-bazlı leaderboard\'larda (kod için BigCodeBench, akıl için GPQA) farklı sıralanır. Arena sohbet kalitesini ölçer, başka şeyleri ölçmez.</div>'

+ '<h2 class="l-title">10. Pratik Eval Pipeline\'ı</h2>'

+ '<p class="l-text">Üretim sistemi değerlendirmek için altı aşamalı bir çerçeve:</p>'

+ '<ol class="l-list">'
+ '<li><strong>Görevi netleştir:</strong> Çeviri mi, özet mi, soru-cevap mı, sohbet mi? Tek bir tipte değilse alt-görevlere böl.</li>'
+ '<li><strong>2-3 metrik seç:</strong> Tek metrik tehlikeli. Çeviri için BLEU + chrF + BERTScore; özet için ROUGE-L + BERTScore + LLM-judge.</li>'
+ '<li><strong>Golden set hazırla:</strong> 100-500 örnek yeterli. <em>Kalite > nicelik.</em> Domain çeşidi, zorluk dağılımı, edge case\'ler dengeli olmalı.</li>'
+ '<li><strong>Model çıktılarını üret:</strong> Aynı prompt versiyonuyla, sıcaklık sabit. Reproducibility için seed.</li>'
+ '<li><strong>Skorla ve logla:</strong> Sonuçları MLflow/W&B/Langfuse\'a kaydet — model versiyonu, prompt versiyonu, tarih.</li>'
+ '<li><strong>Regresyon testi:</strong> Yeni prompt veya model versiyonu eskinden düşükse blokla. CI/CD\'de değerlendirme zorunlu olsun.</li>'
+ '</ol>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Mini pipeline — evaluate + pandas</div><div class="code-block"><pre><code><span class="kw">import</span> evaluate, pandas <span class="kw">as</span> pd'
+ '\n'
+ '\nbleu  = evaluate.<span class="fn">load</span>(<span class="str">"sacrebleu"</span>)'
+ '\nrouge = evaluate.<span class="fn">load</span>(<span class="str">"rouge"</span>)'
+ '\nchrf  = evaluate.<span class="fn">load</span>(<span class="str">"chrf"</span>)'
+ '\n'
+ '\ndf = pd.<span class="fn">read_csv</span>(<span class="str">"golden_set.csv"</span>)  <span class="cm"># cols: id, source, reference, prediction</span>'
+ '\n'
+ '\nrows = []'
+ '\n<span class="kw">for</span> _, r <span class="kw">in</span> df.<span class="fn">iterrows</span>():'
+ '\n    bl = bleu.<span class="fn">compute</span>(predictions=[r.prediction], references=[[r.reference]])'
+ '\n    ro = rouge.<span class="fn">compute</span>(predictions=[r.prediction], references=[r.reference])'
+ '\n    cf = chrf.<span class="fn">compute</span>(predictions=[r.prediction], references=[[r.reference]])'
+ '\n    rows.<span class="fn">append</span>({<span class="str">"id"</span>: r.id, <span class="str">"bleu"</span>: bl[<span class="str">"score"</span>], <span class="str">"rougeL"</span>: ro[<span class="str">"rougeL"</span>], <span class="str">"chrf"</span>: cf[<span class="str">"score"</span>]})'
+ '\n'
+ '\nresults = pd.<span class="fn">DataFrame</span>(rows)'
+ '\n<span class="fn">print</span>(results.<span class="fn">describe</span>())'
+ '\n<span class="fn">print</span>(<span class="str">"En zayıf 5 örnek:"</span>)'
+ '\n<span class="fn">print</span>(results.<span class="fn">nsmallest</span>(<span class="num">5</span>, <span class="str">"chrf"</span>))   <span class="cm"># hata analizi için</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Önemli refleks:</strong> Skoru raporlamadan önce <em>en kötü 10 örneğe</em> manuel olarak bak. Çoğu kez ya golden set hatalı, ya prompt bozuk, ya da gerçek bir model zayıflığı görünür. Toplam skor tek başına yanıltıcı olabilir.</p>'

+ '<h2 class="l-title">11. 2026 Cephesi — Sınırın Ötesi</h2>'

+ '<p class="l-text">Modeller hızla geleneksel benchmark\'ları doyuruyor (MMLU üst sınıra dayandı). Yeni nesil değerlendirme alanları:</p>'

+ '<h3 class="l-subtitle">Ajansal değerlendirme</h3>'

+ '<ul class="l-list">'
+ '<li><strong>GAIA (Mialon ve ark. 2023):</strong> Çok adımlı, araç kullanımı gerektiren gerçek sorular. Web arama, hesap makinesi, dosya okuma birlikte. İnsan ~%92, en iyi modeller 2026 sonu için ~%75.</li>'
+ '<li><strong>AgentBench:</strong> 8 farklı ajansal ortam (OS shell, DB sorgu, web tarama, kart oyunları).</li>'
+ '<li><strong>SWE-bench Verified:</strong> SWE-bench\'in insan-doğrulanmış 500 sorusu; gerçek bug fix.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Akıl yürütme cephesi</h3>'

+ '<ul class="l-list">'
+ '<li><strong>AIME:</strong> American Invitational Mathematics Examination — 30 soru, ileri lise.</li>'
+ '<li><strong>USAMO:</strong> Olimpiyat seviyesi — ispatları yargılamak için LLM-judge.</li>'
+ '<li><strong>FrontierMath:</strong> Profesyonel matematikçilerin hazırladığı, çözmesi saatler/günler süren problemler.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Çok modallı</h3>'

+ '<ul class="l-list">'
+ '<li><strong>MMMU:</strong> 11500 soru, görsel akıl yürütme — diyagram, grafik, mühendislik şeması.</li>'
+ '<li><strong>MMVet:</strong> Görsel-metin entegrasyon görevleri.</li>'
+ '<li><strong>VideoMME:</strong> Video anlama, uzun-bağlam.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Halüsinasyon ve doğruluk</h3>'

+ '<ul class="l-list">'
+ '<li><strong>TruthfulQA:</strong> İnsanların yanlış inandığı 817 soru. Model "popüler yanlış cevabı" verir mi?</li>'
+ '<li><strong>FActScore:</strong> Üretilen biyografide her atomik iddianın doğrulanması. Halüsinasyon oranı için.</li>'
+ '<li><strong>HaluEval:</strong> Sentetik halüsinasyon tespiti — soru-cevap, özet, sohbet.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Türkçe değerlendirme</h3>'

+ '<ul class="l-list">'
+ '<li><strong>TR-MMLU:</strong> MMLU\'nun Türkçe çevrilmiş ve adapte edilmiş sürümü; Türkiye eğitim sistemine özel soru setleri eklendi.</li>'
+ '<li><strong>Belebele Türkçe alt-küme:</strong> Çok dilli okuma anlama, 122 dil arasında karşılaştırılabilir.</li>'
+ '<li><strong>Turkish IFEval, ARC-TR:</strong> Talimat takip ve sağduyu akıl yürütmesi Türkçe için.</li>'
+ '</ul>'

+ '<h2 class="l-title">12. Özet ve İlke Listesi</h2>'

+ '<ul class="l-list">'
+ '<li>Tek bir metriğe inanma; en az 2-3\'ünü birlikte raporla.</li>'
+ '<li>Görev tipi metriği belirler — çeviri ≠ özet ≠ kod ≠ sohbet.</li>'
+ '<li>BERTScore semantiği yakalar; n-gram metrikleri yüzeysel ama hızlı/şeffaf.</li>'
+ '<li>LLM-as-judge ölçeklenir, ama bias\'larını bil ve azaltıcı protokoller uygula.</li>'
+ '<li>Arena ile leaderboard\'lar farklı şeyler ölçer — ikisini birden oku.</li>'
+ '<li>Golden set kaliteli ve çeşitli olsun; nicelikten önce.</li>'
+ '<li>Skoru her zaman örnek-seviyesi hatalarla destekle.</li>'
+ '<li>Sonuçları logla, regresyon testi olarak CI/CD\'ye sok.</li>'
+ '</ul>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> LLM değerlendirmesinin niye zor olduğunu — birden çok geçerli çıktı sorunu. Sınıflandırma metriklerinin (accuracy, F1, ROC-AUC) ne zaman yeterli olduğunu. BLEU\'nun n-gram precision + brevity penalty yapısını ve sacrebleu standardını. ROUGE\'un (N, L, Lsum) özetleme için tasarımını. METEOR, chrF (Türkçe için ideal) ve TER alternatiflerini. BERTScore\'un bağlamsal embedding\'lerle semantik eşleşmeyi nasıl yaptığını. LLM-as-judge\'ın pairwise ve absolute modlarını ve bias\'larını (position, verbosity, self-preference). MMLU, HumanEval, MBPP, IFEval, MT-Bench, SWE-bench, GPQA gibi modern benchmark\'ları. Chatbot Arena Elo sistemini ve sınırlarını. 6 aşamalı pratik eval pipeline\'ını. 2026 cephesinde ajansal (GAIA, AgentBench), akıl (AIME, FrontierMath), multimodal (MMMU) ve doğruluk (TruthfulQA, FActScore) eval\'larını. Türkçe için TR-MMLU ve Belebele\'yi.</div>'

,

en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> How do you <em>actually</em> evaluate an LLM? In generative models there is no single right answer — fifty valid responses can exist for the same question. This lesson walks through <strong>classical n-gram metrics</strong> (BLEU, ROUGE, METEOR, chrF, TER), <strong>semantic metrics</strong> (BERTScore), the <strong>LLM-as-judge</strong> approach, and the <strong>holistic benchmarks</strong> that defined 2024-2026 (MMLU, HumanEval, IFEval, MT-Bench, Chatbot Arena, SWE-bench, GPQA) inside one coherent framework. By the end you can build your own evaluation pipeline.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Pick the right metric per task type (translation, summary, code, reasoning)</li>'
+ '<li>Compute BLEU, ROUGE, METEOR, chrF, TER, and BERTScore in Python</li>'
+ '<li>Design scalable quality evaluation with LLM-as-judge</li>'
+ '<li>Read MMLU, HumanEval, IFEval, MT-Bench, SWE-bench benchmark cards</li>'
+ '<li>Interpret Chatbot Arena Elo rankings and know their limits</li>'
+ '<li>Build a production eval pipeline against your own golden set</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Why is Evaluation Hard?</h2>'

+ '<p class="l-text">In classical ML, evaluation is comparatively easy: accuracy for classification, MSE for regression. With generative models that comfort ends. <strong>Multiple valid answers</strong> can satisfy the same question:</p>'

+ '<div class="calc-example"><div class="example-label">EXAMPLE — ONE QUESTION, MANY VALID ANSWERS</div><div class="example-body">'
+ '<p class="l-text"><strong>Question:</strong> "What is the capital of France, briefly?"</p>'
+ '<ul class="l-list" style="margin:.4rem 0">'
+ '<li>A: "Paris is the capital of France, sitting on the Seine river."</li>'
+ '<li>B: "The capital is Paris; the political and cultural centre of the country."</li>'
+ '<li>C: "Paris. Also one of Europe\'s most populous cities."</li>'
+ '</ul>'
+ '<p class="l-text">All three are correct. Which is "best"? The "compare to reference" approach breaks here: pick a single reference and you penalise the others as wrong.</p>'
+ '</div></div>'

+ '<p class="l-text">For this reason modern LLM evaluation splits into <strong>three branches</strong>:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Surface metrics (n-gram):</strong> BLEU, ROUGE, METEOR — fast, cheap, but shallow.</li>'
+ '<li><strong>Semantic metrics:</strong> BERTScore, COMET — capture meaning, model-dependent.</li>'
+ '<li><strong>Judgement-based:</strong> Human evaluator or LLM-as-judge — expensive but flexible.</li>'
+ '</ul>'

+ '<p class="l-text">Task type drives metric choice: <em>translation</em> → BLEU + COMET, <em>summarisation</em> → ROUGE + BERTScore, <em>code</em> → pass@k, <em>reasoning</em> → exact match or LLM judge, <em>chat</em> → MT-Bench or Arena.</p>'

+ '<h2 class="l-title">2. Classification Metrics Recap</h2>'

+ '<p class="l-text">Generative pipelines often contain closed-set sub-tasks: sentiment classification, intent detection, named entity recognition, multiple-choice QA. Classical metrics are sufficient there.</p>'

+ '<div class="katex-block">$$\\text{Accuracy} = \\frac{\\text{Correct}}{\\text{Total}}, \\quad F_1 = \\frac{2 \\cdot P \\cdot R}{P + R}$$</div>'

+ '<ul class="l-list">'
+ '<li><strong>Accuracy:</strong> fine for balanced data, misleading when classes are imbalanced.</li>'
+ '<li><strong>F1 (harmonic mean of precision/recall):</strong> mandatory when the minority class matters.</li>'
+ '<li><strong>ROC-AUC:</strong> threshold-independent ranking quality — especially for binary.</li>'
+ '<li><strong>Confusion matrix:</strong> see which classes are getting confused before summarising.</li>'
+ '</ul>'

+ '<p class="l-text">When an LLM is used for classification you must parse the output into a label (e.g. "positive" → 1). Parse failures break the metric — use robust regex or constrained decoding.</p>'

+ '<h2 class="l-title">3. BLEU — The Translation Classic</h2>'

+ '<p class="l-text"><strong>BLEU (Bilingual Evaluation Understudy, Papineni et al. 2002)</strong> was built for machine translation and remains the paper-default. Model output = <em>candidate</em>, human translation = <em>reference</em>. BLEU measures n-gram overlap.</p>'

+ '<div class="katex-block">$$\\text{BLEU} = \\text{BP} \\cdot \\exp\\Bigl( \\sum_{n=1}^{4} w_n \\log p_n \\Bigr)$$</div>'

+ '<p class="l-text">Here <em>p_n</em> = clipped n-gram precision in the candidate (clipped so the same word cannot be counted beyond its reference frequency), <em>w_n = 1/4</em> typically. The <strong>Brevity Penalty (BP)</strong> punishes short outputs:</p>'

+ '<div class="katex-block">$$\\text{BP} = \\begin{cases} 1 & \\text{if } c > r \\\\ \\exp(1 - r/c) & \\text{if } c \\le r \\end{cases}$$</div>'

+ '<p class="l-text"><em>c</em> = candidate length, <em>r</em> = reference length. Without it, a model could write one frequent word and get very high precision.</p>'

+ '<h3 class="l-subtitle">BLEU\'s limits</h3>'

+ '<ul class="l-list">'
+ '<li>Ignores synonyms and syntax: "car" vs "automobile" scores zero.</li>'
+ '<li>One reference is not enough — multiple references give a fairer picture.</li>'
+ '<li>Noisy at sentence level, meaningful at corpus level.</li>'
+ '<li>Still the default at venues like WMT (Workshop on Machine Translation).</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> BLEU with sacrebleu</div><div class="code-block"><pre><code><span class="kw">import</span> sacrebleu'
+ '\n'
+ '\nreferences = [['
+ '\n    <span class="str">"The cat sat on the mat."</span>,'
+ '\n    <span class="str">"It is a beautiful day."</span>,'
+ '\n]]'
+ '\nhypotheses = ['
+ '\n    <span class="str">"The cat rested on the mat."</span>,'
+ '\n    <span class="str">"Today the weather is great."</span>,'
+ '\n]'
+ '\n'
+ '\nbleu = sacrebleu.<span class="fn">corpus_bleu</span>(hypotheses, references)'
+ '\n<span class="fn">print</span>(bleu.score)        <span class="cm"># 25-50 is typical, 60+ is very good</span>'
+ '\n<span class="fn">print</span>(bleu.precisions)   <span class="cm"># [1-gram, 2-gram, 3-gram, 4-gram] percentages</span></code></pre></div></div>'

+ '<p class="l-text"><code>sacrebleu</code> removes tokenisation discrepancies; it is the <strong>de facto standard</strong> for cross-paper comparisons. Old "tokenised BLEU" numbers were inconsistent.</p>'

+ '<h2 class="l-title">4. ROUGE — The Language of Summarisation</h2>'

+ '<p class="l-text"><strong>ROUGE (Recall-Oriented Understudy for Gisting Evaluation, Lin 2004)</strong> was built for summarisation. BLEU is precision-leaning; ROUGE is recall-leaning: does the candidate cover the important parts of the reference?</p>'

+ '<ul class="l-list">'
+ '<li><strong>ROUGE-N:</strong> n-gram recall. ROUGE-1 (unigram) and ROUGE-2 (bigram) most common.</li>'
+ '<li><strong>ROUGE-L:</strong> Longest Common Subsequence. Preserves order, allows skips.</li>'
+ '<li><strong>ROUGE-Lsum:</strong> sentence-level LCS for multi-sentence summaries — the headline metric for CNN/DailyMail, XSum leaderboards.</li>'
+ '<li><strong>ROUGE-W:</strong> weighted LCS that rewards consecutive matches.</li>'
+ '</ul>'

+ '<div class="katex-block">$$\\text{ROUGE-N}_{\\text{recall}} = \\frac{\\sum_{s \\in \\text{ref}} \\text{Count}_{\\text{match}}(s)}{\\sum_{s \\in \\text{ref}} \\text{Count}(s)}$$</div>'

+ '<p class="l-text">In practice F1 is reported: precision (how much the candidate avoids extra fluff) and recall together. ROUGE-2 F1 of 0.30+ is decent, 0.40+ is excellent for summaries.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> ROUGE via the evaluate library</div><div class="code-block"><pre><code><span class="kw">import</span> evaluate'
+ '\n'
+ '\nrouge = evaluate.<span class="fn">load</span>(<span class="str">"rouge"</span>)'
+ '\n'
+ '\npredictions = ['
+ '\n    <span class="str">"The cat sat on the mat and slept."</span>,'
+ '\n    <span class="str">"The weather was nice so we went to the park."</span>,'
+ '\n]'
+ '\nreferences = ['
+ '\n    <span class="str">"The cat fell asleep on the mat."</span>,'
+ '\n    <span class="str">"We went to the park because the weather was nice."</span>,'
+ '\n]'
+ '\n'
+ '\nresult = rouge.<span class="fn">compute</span>(predictions=predictions, references=references)'
+ '\n<span class="fn">print</span>(result)'
+ '\n<span class="cm"># {\'rouge1\': 0.55, \'rouge2\': 0.28, \'rougeL\': 0.50, \'rougeLsum\': 0.52}</span></code></pre></div></div>'

+ '<p class="l-text">For morphologically rich languages (Turkish, Finnish) ROUGE is harsh — "went" and "going" count as different. A stemmer preprocessing step often helps.</p>'

+ '<h2 class="l-title">5. METEOR, chrF, TER</h2>'

+ '<p class="l-text">Three popular alternatives address BLEU\'s weaknesses:</p>'

+ '<h3 class="l-subtitle">METEOR</h3>'

+ '<p class="l-text"><strong>METEOR (Banerjee & Lavie 2005)</strong> matches words in layers: exact first, then stems, then synonyms (via WordNet). Word-order differences are also penalised. Correlation with human judgement is better than BLEU, especially on lower-quality translations.</p>'

+ '<h3 class="l-subtitle">chrF — character F-score</h3>'

+ '<p class="l-text"><strong>chrF (Popović 2015)</strong> matches <em>character</em> n-grams instead of word n-grams. Excellent for morphologically rich and low-resource languages: "kitabımdaki" and "kitabımdan" get high chrF, zero BLEU. De facto standard for Turkish, Hungarian, Finnish.</p>'

+ '<div class="katex-block">$$\\text{chrF}_\\beta = (1 + \\beta^2) \\cdot \\frac{P \\cdot R}{\\beta^2 \\cdot P + R}$$</div>'

+ '<p class="l-text">Typical settings: <em>n=6</em> character n-grams, <em>β=2</em> weighting recall twice as much as precision.</p>'

+ '<h3 class="l-subtitle">TER — Translation Edit Rate</h3>'

+ '<p class="l-text"><strong>TER (Snover et al. 2006)</strong> inverts the question: how many edits (insert/delete/substitute/shift) does it take to turn the candidate into the reference? Lower TER = better.</p>'

+ '<div class="katex-block">$$\\text{TER} = \\frac{\\text{Edits}}{\\text{Reference length}}$$</div>'

+ '<p class="l-text">Widely used in industry to estimate post-editing workload: how much does the translator have to fix?</p>'

+ '<h2 class="l-title">6. BERTScore — Semantic Matching</h2>'

+ '<p class="l-text"><strong>BERTScore (Zhang et al. 2019)</strong> matches <em>meaning</em>, not surface form. For each token, take BERT\'s contextual embedding, compute pairwise cosine similarity between candidate and reference tokens, and pick the best matches.</p>'

+ '<p class="l-text">Candidate tokens <em>x_i</em>, reference tokens <em>y_j</em>. Token-level recall and precision:</p>'

+ '<div class="katex-block">$$R_{\\text{BERT}} = \\frac{1}{|y|} \\sum_{y_j \\in y} \\max_{x_i \\in x} \\mathbf{x}_i^\\top \\mathbf{y}_j, \\quad P_{\\text{BERT}} = \\frac{1}{|x|} \\sum_{x_i \\in x} \\max_{y_j \\in y} \\mathbf{x}_i^\\top \\mathbf{y}_j$$</div>'

+ '<p class="l-text">F1 = harmonic mean. So <em>"the cat sat on the mat"</em> vs <em>"the feline rested on the rug"</em> scores high on BERTScore and near zero on BLEU.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Plus:</strong> Captures synonymy, paraphrase, syntactic variation. High correlation with human judgement.</li>'
+ '<li><strong>Minus:</strong> Very dependent on which BERT model you pick. <code>roberta-large</code> is the English default; for Turkish use <code>dbmdz/bert-base-turkish-cased</code>.</li>'
+ '<li><strong>Baseline normalisation:</strong> Raw scores cluster in 0.7-0.9; <code>--rescale-with-baseline</code> stretches to [0,1].</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> BERTScore with Turkish model</div><div class="code-block"><pre><code><span class="kw">from</span> bert_score <span class="kw">import</span> score'
+ '\n'
+ '\ncands = [<span class="str">"The cat rested on the cushion."</span>, <span class="str">"The meeting was rescheduled to tomorrow."</span>]'
+ '\nrefs  = [<span class="str">"The cat sat on the mat."</span>,         <span class="str">"The meeting moved to tomorrow."</span>]'
+ '\n'
+ '\nP, R, F1 = <span class="fn">score</span>('
+ '\n    cands, refs,'
+ '\n    model_type=<span class="str">"roberta-large"</span>,'
+ '\n    num_layers=<span class="num">17</span>,'
+ '\n    rescale_with_baseline=<span class="kw">False</span>,'
+ '\n)'
+ '\n<span class="fn">print</span>(<span class="str">"F1 per sample:"</span>, F1.<span class="fn">tolist</span>())'
+ '\n<span class="cm"># [0.91, 0.93] — surface-different, semantically close</span></code></pre></div></div>'

+ '<p class="l-text">BLEU for the same pairs would score around 5-10 — minimal n-gram overlap. BERTScore captures the meaning and gives a fair number.</p>'

+ '<h2 class="l-title">7. LLM-as-Judge — the Model as Judge</h2>'

+ '<p class="l-text">N-gram and semantic metrics still assume "compare to a reference". But how do you score a chat assistant\'s reply — there is no reference. <strong>Zheng et al. (2023, MT-Bench)</strong> named the solution: <strong>LLM-as-judge</strong>. Ask a strong model (GPT-4, Claude Opus) "which of these two answers is better" or "rate this answer 1-10", request a justification, then parse the score.</p>'

+ '<h3 class="l-subtitle">Two basic modes</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Pairwise:</strong> Show two responses, ask "which is better?". Low noise, allows scalable Elo aggregation.</li>'
+ '<li><strong>Absolute scoring:</strong> Rate a single response 1-10. A rubric is mandatory (accuracy, fluency, relevance, ...).</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Judge biases — must be known</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Position bias:</strong> The first answer is picked 15-25% more often. Remedy: run each pair in both orders and average.</li>'
+ '<li><strong>Verbosity bias:</strong> Longer answers are favoured. Remedy: forbid verbosity in the rubric, or balance length distribution.</li>'
+ '<li><strong>Self-preference:</strong> GPT-4 prefers GPT-4 output. Remedy: pick a judge from a different model family than the candidates.</li>'
+ '<li><strong>Easy-question bias:</strong> Easy items get 9-10 across the board; signal collapses. Remedy: diversify difficulty.</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Pairwise LLM-judge with Claude</div><div class="code-block"><pre><code><span class="kw">import</span> anthropic, json'
+ '\n'
+ '\nclient = anthropic.<span class="fn">Anthropic</span>()'
+ '\n'
+ '\nJUDGE_PROMPT = <span class="str">"""Decide which of two answers best fits the question. Justify your choice.'
+ '\nCriteria: correctness, relevance, clarity, penalty for unnecessary length.'
+ '\nOutput JSON ONLY: {{"winner": "A" | "B" | "tie", "reason": "..."}}'
+ '\n'
+ '\nQUESTION: {q}'
+ '\nAnswer A: {a}'
+ '\nAnswer B: {b}'
+ '\n"""</span>'
+ '\n'
+ '\n<span class="kw">def</span> <span class="fn">judge</span>(q, a, b):'
+ '\n    msg = client.messages.<span class="fn">create</span>('
+ '\n        model=<span class="str">"claude-opus-4-7"</span>,'
+ '\n        max_tokens=<span class="num">400</span>,'
+ '\n        messages=[{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: JUDGE_PROMPT.<span class="fn">format</span>(q=q, a=a, b=b)}],'
+ '\n    )'
+ '\n    <span class="kw">return</span> json.<span class="fn">loads</span>(msg.content[<span class="num">0</span>].text)'
+ '\n'
+ '\n<span class="cm"># Against position bias, run each pair twice and combine</span>'
+ '\nr1 = <span class="fn">judge</span>(q, ans1, ans2)'
+ '\nr2 = <span class="fn">judge</span>(q, ans2, ans1)  <span class="cm"># order swapped</span>'
+ '\n<span class="fn">print</span>(r1[<span class="str">"winner"</span>], r2[<span class="str">"winner"</span>])</code></pre></div></div>'

+ '<p class="l-text">Human-LLM judge agreement on well-designed prompts hits 80-85% — the same range as agreement between non-expert human evaluators. So LLM-judge can be "as good as humans" at a fraction of the cost.</p>'

+ '<h2 class="l-title">8. Holistic Benchmarks — the Modern Exams</h2>'

+ '<p class="l-text">A single task cannot capture an LLM. Post-2020, <strong>holistic benchmark suites</strong> emerged: multi-task, multi-capability, single leaderboard.</p>'

+ '<div class="calc-example"><div class="example-label">2026 BENCHMARK LANDSCAPE</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.9rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Benchmark</th><th style="text-align:left;padding:.5rem">Measures</th><th style="padding:.5rem">Format</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>MMLU</strong></td><td style="padding:.5rem">Knowledge across 57 subjects (history, math, law, medicine...)</td><td style="text-align:center">Multiple choice</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>MMLU-Pro</strong></td><td style="padding:.5rem">Harder MMLU (10 options, more discriminating)</td><td style="text-align:center">Multiple choice</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>HumanEval</strong></td><td style="padding:.5rem">Python code generation (164 functions, pass@k)</td><td style="text-align:center">Code tests</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>MBPP</strong></td><td style="padding:.5rem">Easier Python tasks (974 problems)</td><td style="text-align:center">Code tests</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>HumanEval+ / BigCodeBench</strong></td><td style="padding:.5rem">Harder, real-world-like coding tasks</td><td style="text-align:center">Code tests</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>GSM8K</strong></td><td style="padding:.5rem">Grade-school word problems (8500 items)</td><td style="text-align:center">Numeric answer</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>MATH</strong></td><td style="padding:.5rem">Olympiad-level math problems</td><td style="text-align:center">Numeric/LaTeX</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>IFEval</strong></td><td style="padding:.5rem">Instruction following (word count, format rules)</td><td style="text-align:center">Programmatic check</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>MT-Bench</strong></td><td style="padding:.5rem">80 open-ended chat questions, 2-turn</td><td style="text-align:center">LLM-judge</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Chatbot Arena</strong></td><td style="padding:.5rem">Crowdsourced pairwise voting, Elo</td><td style="text-align:center">Human vote</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>SWE-bench</strong></td><td style="padding:.5rem">Resolve real GitHub issues (2294 problems)</td><td style="text-align:center">Test passing</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>GPQA</strong></td><td style="padding:.5rem">Expert-level science (physics, chemistry, biology)</td><td style="text-align:center">Multiple choice</td></tr>'
+ '<tr><td style="padding:.5rem"><strong>HellaSwag</strong></td><td style="padding:.5rem">Commonsense reasoning (sentence completion)</td><td style="text-align:center">Multiple choice</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<h3 class="l-subtitle">pass@k — the evaluation metric for code</h3>'

+ '<p class="l-text">For code tasks a single generation is insufficient — sometimes the model gets lucky. <strong>pass@k</strong> asks: "If I asked the model for k samples, what is the probability that at least one passes the tests?" Unbiased estimator:</p>'

+ '<div class="katex-block">$$\\text{pass@}k = \\mathbb{E}\\Bigl[ 1 - \\binom{n-c}{k} / \\binom{n}{k} \\Bigr]$$</div>'

+ '<p class="l-text">Where <em>n</em> = samples generated, <em>c</em> = number that pass. pass@1 measures strictness, pass@10 measures flexibility.</p>'

+ '<h3 class="l-subtitle">IFEval — instruction following</h3>'

+ '<p class="l-text">IFEval (Zhou et al. 2023) measures <em>discipline</em>, not intelligence: "answer must be under 100 words", "write exactly three paragraphs", "every sentence starts with \'This\'". The rules are programmatically verifiable; no LLM-judge needed. Modern models score 85-90%, small models below 50%.</p>'

+ '<div class="plotly-graph"><div id="plot-nlp15-corr-en" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var samples=["Trans 1","Trans 2","Trans 3","Trans 4","Trans 5","Trans 6","Trans 7","Trans 8"];'
+ 'var bleu=[0.18,0.52,0.31,0.08,0.71,0.44,0.62,0.27];'
+ 'var rouge=[0.34,0.61,0.42,0.21,0.78,0.55,0.69,0.38];'
+ 'var bertsc=[0.78,0.89,0.82,0.71,0.95,0.86,0.92,0.80];'
+ 'var t1={x:samples,y:bleu,name:"BLEU",type:"bar",marker:{color:"#c8a96e"}};'
+ 'var t2={x:samples,y:rouge,name:"ROUGE-L",type:"bar",marker:{color:"#4ecdc4"}};'
+ 'var t3={x:samples,y:bertsc,name:"BERTScore F1",type:"bar",marker:{color:"#9d80c8"}};'
+ 'var layout={xaxis:{color:T.text,gridcolor:T.grid},yaxis:{color:T.text,gridcolor:T.grid,title:"Score",range:[0,1]},barmode:"group",paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:60,l:60},legend:{font:{color:T.text}}};'
+ 'if(document.getElementById("plot-nlp15-corr-en"))Plotly.newPlot("plot-nlp15-corr-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Eight translations scored side by side with BLEU, ROUGE-L, and BERTScore. BERTScore is consistently higher — semantic similarity is wider than n-gram overlap. BLEU is harshest: sample 4 with heavy paraphrasing drops to 0.08 while BERTScore still rates it 0.71. Practical takeaway: <em>never decide on a single metric</em>, always report at least two. BLEU + BERTScore is a solid combination for most translation work.</div>'

+ '<h2 class="l-title">9. Chatbot Arena — Crowd Judgement</h2>'

+ '<p class="l-text"><strong>LMSYS Chatbot Arena</strong> (chat.lmsys.org, since 2023) has become the gold standard for chat quality. A user types a question, two anonymous models answer side by side, the user votes. The result is an <strong>Elo rating</strong> — just like chess.</p>'

+ '<div class="katex-block">$$E_A = \\frac{1}{1 + 10^{(R_B - R_A)/400}}, \\quad R_A \\leftarrow R_A + K \\cdot (S_A - E_A)$$</div>'

+ '<p class="l-text"><em>R_A, R_B</em> are the player ratings, <em>E_A</em> is A\'s expected win probability, <em>S_A</em> the actual outcome (1, 0.5, 0), <em>K</em> a learning rate (~4 for Arena). A 400 Elo gap corresponds to about a 91% win rate.</p>'

+ '<h3 class="l-subtitle">Arena strengths</h3>'

+ '<ul class="l-list">'
+ '<li>Real user prompts — avoids the trap of synthetic benchmarks.</li>'
+ '<li>Hundreds of thousands of votes give high statistical power.</li>'
+ '<li>The closest objective answer to "which LLM is better".</li>'
+ '<li>New models enter the ranking within weeks.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Limits</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Skewed prompt distribution:</strong> users tend to ask easy/creative questions; experts are rare.</li>'
+ '<li><strong>Style over substance:</strong> nicely formatted (markdown, emoji) responses win more — for equal content.</li>'
+ '<li><strong>Length bias:</strong> longer answers win 5-10% more often.</li>'
+ '<li><strong>Popularity bias:</strong> recognised brand names (GPT, Claude) get a slight cross-check advantage.</li>'
+ '<li>"Style-controlled Elo" releases attempt to remove these biases.</li>'
+ '</ul>'

+ '<div class="plotly-graph"><div id="plot-nlp15-arena-en" style="width:100%;height:430px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var models=["GPT-5","Claude Opus 4.7","Gemini 2.5 Pro","Llama 4 405B","GPT-4o","DeepSeek V3","Claude Sonnet 4.6","Qwen2.5-Max","Mistral Large 3","Grok 3"];'
+ 'var elos=[1411,1397,1382,1352,1340,1331,1318,1305,1289,1271];'
+ 'var t1={x:elos,y:models,type:"bar",orientation:"h",marker:{color:T.accent},text:elos.map(String),textposition:"outside"};'
+ 'var layout={xaxis:{color:T.text,gridcolor:T.grid,title:"Elo",range:[1200,1450]},yaxis:{color:T.text,gridcolor:T.grid,autorange:"reversed"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:60,b:50,l:170}};'
+ 'if(document.getElementById("plot-nlp15-arena-en"))Plotly.newPlot("plot-nlp15-arena-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> An illustrative Arena Top-10 (approximate 2026 Q2 ranking). The gap between top 3 models is only ~30 Elo — statistically they often swap places. From #1 to #10 is ~140 Elo, roughly a 70-30 win rate. <em>Never read these numbers in isolation:</em> the same models rank differently on task-specific leaderboards (BigCodeBench for code, GPQA for reasoning). Arena measures chat quality, nothing else.</div>'

+ '<h2 class="l-title">10. Practical Eval Pipeline</h2>'

+ '<p class="l-text">A six-stage framework for evaluating a production system:</p>'

+ '<ol class="l-list">'
+ '<li><strong>Clarify the task:</strong> Translation, summary, QA, chat? If mixed, split into sub-tasks.</li>'
+ '<li><strong>Pick 2-3 metrics:</strong> A single metric is dangerous. For translation use BLEU + chrF + BERTScore; for summaries ROUGE-L + BERTScore + LLM-judge.</li>'
+ '<li><strong>Build a golden set:</strong> 100-500 examples is enough. <em>Quality &gt; quantity.</em> Cover domains, difficulty, edge cases.</li>'
+ '<li><strong>Generate outputs:</strong> Same prompt version, fixed temperature, seed for reproducibility.</li>'
+ '<li><strong>Score and log:</strong> Save results to MLflow/W&B/Langfuse — model version, prompt version, date.</li>'
+ '<li><strong>Regression test:</strong> Block any new prompt or model version that scores below the previous one. Eval gates in CI/CD.</li>'
+ '</ol>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Mini pipeline — evaluate + pandas</div><div class="code-block"><pre><code><span class="kw">import</span> evaluate, pandas <span class="kw">as</span> pd'
+ '\n'
+ '\nbleu  = evaluate.<span class="fn">load</span>(<span class="str">"sacrebleu"</span>)'
+ '\nrouge = evaluate.<span class="fn">load</span>(<span class="str">"rouge"</span>)'
+ '\nchrf  = evaluate.<span class="fn">load</span>(<span class="str">"chrf"</span>)'
+ '\n'
+ '\ndf = pd.<span class="fn">read_csv</span>(<span class="str">"golden_set.csv"</span>)  <span class="cm"># cols: id, source, reference, prediction</span>'
+ '\n'
+ '\nrows = []'
+ '\n<span class="kw">for</span> _, r <span class="kw">in</span> df.<span class="fn">iterrows</span>():'
+ '\n    bl = bleu.<span class="fn">compute</span>(predictions=[r.prediction], references=[[r.reference]])'
+ '\n    ro = rouge.<span class="fn">compute</span>(predictions=[r.prediction], references=[r.reference])'
+ '\n    cf = chrf.<span class="fn">compute</span>(predictions=[r.prediction], references=[[r.reference]])'
+ '\n    rows.<span class="fn">append</span>({<span class="str">"id"</span>: r.id, <span class="str">"bleu"</span>: bl[<span class="str">"score"</span>], <span class="str">"rougeL"</span>: ro[<span class="str">"rougeL"</span>], <span class="str">"chrf"</span>: cf[<span class="str">"score"</span>]})'
+ '\n'
+ '\nresults = pd.<span class="fn">DataFrame</span>(rows)'
+ '\n<span class="fn">print</span>(results.<span class="fn">describe</span>())'
+ '\n<span class="fn">print</span>(<span class="str">"Weakest 5 examples:"</span>)'
+ '\n<span class="fn">print</span>(results.<span class="fn">nsmallest</span>(<span class="num">5</span>, <span class="str">"chrf"</span>))   <span class="cm"># for error analysis</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Key reflex:</strong> Before reporting any score, manually inspect the <em>worst 10 examples</em>. Most of the time you discover either a bad golden set, a broken prompt, or a real model weakness. A headline number alone misleads.</p>'

+ '<h2 class="l-title">11. The 2026 Frontier — Beyond the Edge</h2>'

+ '<p class="l-text">Traditional benchmarks are saturating (MMLU is near ceiling). New evaluation frontiers:</p>'

+ '<h3 class="l-subtitle">Agentic evaluation</h3>'

+ '<ul class="l-list">'
+ '<li><strong>GAIA (Mialon et al. 2023):</strong> multi-step real-world questions requiring tools — web search, calculator, file reading. Humans ~92%; best models late-2026 ~75%.</li>'
+ '<li><strong>AgentBench:</strong> 8 different agentic environments (OS shell, DB query, web browsing, card games).</li>'
+ '<li><strong>SWE-bench Verified:</strong> 500 human-verified SWE-bench items; real bug fixes.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Reasoning frontier</h3>'

+ '<ul class="l-list">'
+ '<li><strong>AIME:</strong> American Invitational Mathematics Examination — 30 advanced high-school problems.</li>'
+ '<li><strong>USAMO:</strong> Olympiad level — LLM-judge needed to score proofs.</li>'
+ '<li><strong>FrontierMath:</strong> research-level problems crafted by professional mathematicians; solvable in hours/days, not minutes.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Multimodal</h3>'

+ '<ul class="l-list">'
+ '<li><strong>MMMU:</strong> 11500 visual-reasoning questions — diagrams, charts, engineering schematics.</li>'
+ '<li><strong>MMVet:</strong> image-text integration tasks.</li>'
+ '<li><strong>VideoMME:</strong> video understanding, long-context.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Hallucination and factuality</h3>'

+ '<ul class="l-list">'
+ '<li><strong>TruthfulQA:</strong> 817 questions humans tend to get wrong. Does the model regurgitate the popular falsehood?</li>'
+ '<li><strong>FActScore:</strong> for generated biographies, check each atomic claim — hallucination rate.</li>'
+ '<li><strong>HaluEval:</strong> synthetic hallucination detection across QA, summary, dialogue.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Turkish evaluation</h3>'

+ '<ul class="l-list">'
+ '<li><strong>TR-MMLU:</strong> translated and adapted MMLU with extra items from the Turkish education system.</li>'
+ '<li><strong>Belebele Turkish subset:</strong> multilingual reading comprehension, comparable across 122 languages.</li>'
+ '<li><strong>Turkish IFEval, ARC-TR:</strong> instruction following and commonsense reasoning for Turkish.</li>'
+ '</ul>'

+ '<h2 class="l-title">12. Summary and Principle List</h2>'

+ '<ul class="l-list">'
+ '<li>Never trust a single metric; report at least 2-3 together.</li>'
+ '<li>The task type determines the metric — translation ≠ summary ≠ code ≠ chat.</li>'
+ '<li>BERTScore captures semantics; n-gram metrics are shallow but fast and transparent.</li>'
+ '<li>LLM-as-judge scales, but know its biases and apply mitigations.</li>'
+ '<li>Arena and leaderboards measure different things — read both.</li>'
+ '<li>Quality of the golden set beats its size.</li>'
+ '<li>Always back headline scores with example-level error analysis.</li>'
+ '<li>Log results and gate model/prompt changes in CI/CD via regression eval.</li>'
+ '</ul>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> Why LLM evaluation is hard — the many-valid-outputs problem. When classification metrics (accuracy, F1, ROC-AUC) suffice. BLEU\'s clipped n-gram precision + brevity penalty and the sacrebleu standard. ROUGE (N, L, Lsum) for summarisation. METEOR, chrF (ideal for Turkish) and TER alternatives. How BERTScore matches semantically via contextual embeddings. LLM-as-judge pairwise and absolute modes and their biases (position, verbosity, self-preference). Modern benchmarks: MMLU, HumanEval, MBPP, IFEval, MT-Bench, SWE-bench, GPQA. The Chatbot Arena Elo system and its limits. A six-stage practical eval pipeline. The 2026 frontier: agentic (GAIA, AgentBench), reasoning (AIME, FrontierMath), multimodal (MMMU), and factuality (TruthfulQA, FActScore). Turkish-specific TR-MMLU and Belebele.</div>'

};
