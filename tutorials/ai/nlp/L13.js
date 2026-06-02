/* nlp-L13.js — NLP Course Lesson 13: Alt-kelime Tokenizasyonu Derinlemesine (TR + EN) */
window.NLP_L13 = {

tr: `<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>

<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> NLP'nin görünmez ama kritik katmanı: <strong>alt-kelime tokenizasyonu</strong>. <a href="/tutorials/ai/nlp/bow-tfidf-ngrams">Ders 2</a>'de tokenizasyona kısaca değinmiştik, BPE'yi <a href="/tutorials/ai/nlp/transformers-bert">Ders 10</a>'da hızlıca andık — burada işin matematiğine, algoritmasına ve modern üretim sistemlerine iniyoruz. BPE, WordPiece, Unigram, SentencePiece ve OpenAI tiktoken — hangisi neden var, ne zaman hangisi kullanılır? Aynı Türkçe cümle GPT-4'te 24, Llama'da 17, BERT-multilingual'da 31 token olarak nasıl çıkıyor? Bu fark fatura, hız ve kalitenin temelinde.</div>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Kelime ve karakter tokenizasyonunun neden yetersiz kaldığını, alt-kelimenin neden orta yol olduğunu</li>
<li>BPE, WordPiece ve Unigram LM algoritmalarını ayrı ayrı, somut örneklerle</li>
<li>SentencePiece ve byte-level BPE'nin çok dilli sistemlerde nasıl avantaj sağladığını</li>
<li>OpenAI tiktoken'in cl100k_base ve o200k_base sözlüklerini, Türkçenin bu sözlüklerde nasıl yer aldığını</li>
<li>transformers AutoTokenizer ile farklı tokenizer'ları karşılaştırmayı ve fatura/hız etkisini ölçmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Alt-kelime? İki Uç Nokta ve Aradaki Boşluk</h2>

<p class="l-text">Bir dil modelinin girdisi sayılar olmak zorunda — metin değil. Yani "Merhaba dünya" cümlesini bir vektör dizisine çevirmenin <strong>en küçük birimini</strong> seçmemiz lazım. Üç seçenek var: kelime, karakter, alt-kelime. İlk iki seçeneğin neden battığını anlarsan, üçüncüsünün niye zorunlu olduğunu görürsün.</p>

<h3 class="l-subtitle">Kelime düzeyinde tokenizasyon — neden işe yaramaz</h3>

<p class="l-text">Türkçeyi düşün: <em>"evlerinizden", "evlerinizdeki", "evlerinizdekilerden"</em> — hepsi farklı kelime. Aynı kök, farklı çekimler. Eklemeli (agglutinative) bir dil olduğu için Türkçede teorik kelime sayısı milyonları geçer. Hatta <strong>"Çekoslovakyalılaştıramadıklarımızdan mıymışsınız"</strong> gibi tek kelimelik cümleler kurulabilir. İngilizce çoğul ve geçmiş zaman ekleriyle bile zaten 300 000+ farklı kelime üretir.</p>

<ul class="l-list">
<li><strong>Sözlük patlaması:</strong> 300k+ kelime → embedding matrisi 300k × 768 = 230M parametre, sadece girişte.</li>
<li><strong>Out-of-Vocabulary (OOV) sorunu:</strong> Eğitimde görmediği "tokenleştirici" kelimesini görünce <code>&lt;UNK&gt;</code> der, semantik kaybolur.</li>
<li><strong>Morfoloji gözardı edilir:</strong> "ev" ile "evlerinizdeki" birbiriyle ilgili — kelime düzeyi bunu bilmez.</li>
</ul>

<h3 class="l-subtitle">Karakter düzeyinde — diğer uç</h3>

<p class="l-text">Tam tersine her şeyi karakterlere (veya byte'lara) bölmek de mümkün. "Merhaba" → ['M','e','r','h','a','b','a']. Sözlük 256'ya iner (byte ise), OOV biter. Ama yeni problem: <strong>diziler 4-5x uzar</strong>. Transformer self-attention <em>O(n²)</em> maliyetli; dizi iki kat uzayınca hesap dört kat. Üstelik karakter düzeyinde "ev" gibi anlamlı birimleri model yeniden keşfetmek zorunda — her zaman yapamaz.</p>

<div class="katex-block">$$\\text{Cost}_{\\text{attention}} \\propto n^2 \\cdot d \\quad\\Longrightarrow\\quad n \\times 4 \\Rightarrow \\text{Cost} \\times 16$$</div>

<h3 class="l-subtitle">Alt-kelime: en sık parçaları sözlüğe al</h3>

<p class="l-text">İki ucun arasındaki sağduyu: <strong>sık görülen kök ve ek parçalarını ayrı token yap; nadir kelimeleri parçalara böl.</strong> "evlerinizden" → ["ev", "ler", "iniz", "den"]. Sözlük 30-100 bin civarında kalır, OOV kavramı pratikte yok olur (her şey en kötü ihtimalle byte'lara dökülür), morfoloji kısmen yakalanır. Modern tüm büyük dil modelleri bu yolu seçti.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kelime düzeyi</div><div class="card-body">~300k sözlük, OOV var, dizi kısa</div></div>
<div class="calc-card"><div class="card-title">Karakter / byte</div><div class="card-body">256 sözlük, OOV yok, dizi 4-5x uzun</div></div>
<div class="calc-card"><div class="card-title">Alt-kelime</div><div class="card-body">30-100k sözlük, OOV pratik olarak yok, dizi makul uzunlukta</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. BPE — Byte-Pair Encoding</h2>

<p class="l-text"><strong>Byte-Pair Encoding (BPE)</strong> aslında 1994'te veri sıkıştırma için icat edildi (Philip Gage). Sennrich, Haddow ve Birch 2015'te bunu NMT'ye uyarladı ve modern NLP'nin temel taşı oldu. GPT-2, GPT-3, GPT-4'ün hepsi BPE türevleri kullanır.</p>

<h3 class="l-subtitle">Algoritma adım adım</h3>

<ol class="l-list">
<li>Külliyatı karakterlere böl. Sözlüğün başlangıcı: tüm tek karakterler.</li>
<li>Tüm külliyatta <strong>en sık görülen yan yana karakter çiftini</strong> bul.</li>
<li>Bu çifti tek bir yeni token olarak sözlüğe ekle ve külliyatta birleştir.</li>
<li>Hedef sözlük boyutuna ulaşılana kadar 2-3'ü tekrarla.</li>
</ol>

<h3 class="l-subtitle">Somut örnek — "tokenization" üzerinde</h3>

<p class="l-text">Diyelim ki minik bir külliyada <em>"low", "lower", "newest", "widest"</em> kelimeleri ve her birinin frekansı var. Başlangıç sözlüğü tek karakterler. BPE'nin ilk birkaç birleştirme adımı:</p>

<div class="calc-example"><div class="example-label">BPE BİRLEŞTİRME SIRASI</div><div class="example-body">
<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">
<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Adım</th><th style="padding:.5rem">En sık çift</th><th style="padding:.5rem">Yeni token</th><th style="padding:.5rem">Örnek tokenizasyon</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">0</td><td style="text-align:center">—</td><td style="text-align:center">—</td><td style="text-align:center">t o k e n i z a t i o n</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">1</td><td style="text-align:center">(t, i)</td><td style="text-align:center">ti</td><td style="text-align:center">t o k e n i z a ti o n</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">2</td><td style="text-align:center">(i, o)</td><td style="text-align:center">io</td><td style="text-align:center">t o k e n i z a t io n</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">3</td><td style="text-align:center">(io, n)</td><td style="text-align:center">ion</td><td style="text-align:center">t o k e n i z a t ion</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">4</td><td style="text-align:center">(a, t)</td><td style="text-align:center">at</td><td style="text-align:center">t o k e n i z at ion</td></tr>
<tr><td style="padding:.5rem">5</td><td style="text-align:center">(token, ization)</td><td style="text-align:center">—</td><td style="text-align:center">token ization</td></tr>
</tbody></table></div>
</div></div>

<p class="l-text">Yeterli birleştirmeden sonra "tokenization" iki parçaya iner: <code>token</code> + <code>ization</code>. Hem ek bilgisi korunur ("ization" başka kelimelerle paylaşılır: organization, optimization), hem sözlük makul kalır.</p>

<h3 class="l-subtitle">Matematiksel ifade</h3>

<p class="l-text">Her adımda seçilen çift, frekansı en yüksek olan bigram'dır:</p>

<div class="katex-block">$$(a, b)^* = \\arg\\max_{(a, b) \\in \\mathcal{V} \\times \\mathcal{V}} \\text{count}(ab \\text{ in corpus})$$</div>

<p class="l-text">Birleştirme kuralları sıralı bir liste olarak saklanır (merges.txt). Kodlama anında bu kurallar sırayla uygulanır — deterministik, hızlı, geri-dönebilir.</p>

<div class="plotly-graph"><div id="plot-nlp13-bpe-tr" style="width:100%;height:380px;"></div></div>
<script>setTimeout(function(){window.__nlpRegDraw(function(){
var T=window.__nlpChartTheme();
var x=[0,1,2,3,4,5,6,7,8,9,10];
var sozluk=[26,27,28,29,30,31,32,33,34,35,36];
var ortalama=[11.2,9.8,8.5,7.4,6.5,5.8,5.2,4.7,4.3,4.0,3.8];
var t1={x:x,y:sozluk,type:"scatter",mode:"lines+markers",name:"Sözlük boyutu",line:{color:T.accent,width:2.5},marker:{size:7},yaxis:"y"};
var t2={x:x,y:ortalama,type:"scatter",mode:"lines+markers",name:"Ort. token / kelime",line:{color:"#ff9d6c",width:2.5,dash:"dash"},marker:{size:7},yaxis:"y2"};
var layout={xaxis:{color:T.text,gridcolor:T.grid,title:"Birleştirme adımı"},yaxis:{color:T.text,gridcolor:T.grid,title:"Sözlük boyutu",side:"left"},yaxis2:{color:"#ff9d6c",title:"Ortalama token / kelime",overlaying:"y",side:"right",gridcolor:"rgba(0,0,0,0)"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:60,b:55,l:60},legend:{x:0.5,y:1.12,xanchor:"center",orientation:"h"}};
if(document.getElementById("plot-nlp13-bpe-tr"))Plotly.newPlot("plot-nlp13-bpe-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});
});},250)</script>
<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Her birleştirme adımı sözlüğe bir token ekler (mavi, sol eksen). Aynı anda külliyadaki ortalama "token / kelime" oranı düşer (turuncu, sağ eksen). 10 adımdan sonra kelime başına 3.8 tokenle ifade edilebilir. Gerçek bir BPE eğitimi 30-50 bin adıma kadar gider; bu noktada İngilizce kelimelerin çoğu 1-2 tokenle ifade edilir.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. WordPiece — Google'ın Olasılığa Dayalı Varyantı</h2>

<p class="l-text"><strong>WordPiece</strong> Google'ın Schuster ve Nakajima (2012) tarafından önerilen yöntemi. BERT, DistilBERT, ELECTRA ve mBERT bunu kullanır. BPE ile aynı temel fikre dayanır — sık parçaları birleştir — ama <em>seçim kriteri</em> farklıdır.</p>

<h3 class="l-subtitle">Frekans değil, olabilirlik kazancı</h3>

<p class="l-text">BPE en sık çifti seçer. WordPiece ise her aday çift için şu skoru hesaplar:</p>

<div class="katex-block">$$\\text{score}(a, b) = \\frac{\\text{count}(ab)}{\\text{count}(a) \\cdot \\text{count}(b)}$$</div>

<p class="l-text">Yani sadece "ab" sık geçmesi yetmez; "a" ve "b" tek başlarına seyrek olmalı ve birlikte sık görülmeli. Bu, <strong>karşılıklı bilgi (mutual information)</strong> sezgisidir: bu iki parçanın bir araya gelmesi rastlantıdan fazlasını söylüyor mu? Bir unigram dil modelinin olabilirliğini en çok artıran birleştirmeyi seç.</p>

<h3 class="l-subtitle">## ön eki</h3>

<p class="l-text">WordPiece'ın bir görsel imzası vardır: <code>##</code>. Kelime başı olmayan parçaları işaretler. "tokenization" → ["token", "##ization"]. Decoder bu işareti görünce iki parçayı boşluksuz birleştirir. Avantajı: "token" kelimesinin başlangıçtaki ve içeriksel hâlleri farklı tokenler olur, bu da modele konum bilgisi kazandırır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span> BERT-base-multilingual ile WordPiece tokenizasyonu<button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer

tok = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-multilingual-cased"</span>)

cumleler = [
    <span class="str">"tokenization is fascinating"</span>,
    <span class="str">"Türkçe alt-kelime tokenizasyonu"</span>,
    <span class="str">"evlerinizdekilerden"</span>,
]
<span class="kw">for</span> c <span class="kw">in</span> cumleler:
    parcalar = tok.<span class="fn">tokenize</span>(c)
    <span class="fn">print</span>(<span class="str">f"{c!r:40s}"</span>, <span class="str">"→"</span>, parcalar)

<span class="cm"># 'tokenization is fascinating'           → ['token', '##ization', 'is', 'fascinating']</span>
<span class="cm"># 'Türkçe alt-kelime tokenizasyonu'       → ['Türk', '##çe', 'alt', '-', 'kelime', 'token', '##iza', '##syon', '##u']</span>
<span class="cm"># 'evlerinizdekilerden'                   → ['ev', '##leri', '##niz', '##de', '##ki', '##ler', '##den']</span></code></pre></div>

<p class="l-text">"evlerinizdekilerden" yedi WordPiece parçaya bölündü — ve dikkat: ilk parça <code>ev</code>, sonrakilerin hepsi <code>##</code> ile başlıyor. Yani BERT bu kelimenin "ev" ile başladığını ve geri kalanının ek olduğunu açıkça görüyor.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Unigram LM — Büyükten Küçüğe Budama</h2>

<p class="l-text"><strong>Unigram Language Model</strong> tokenizasyonu (Kudo, 2018) BPE ve WordPiece'in tersi yönde çalışır. Onlar küçükten başlayıp büyütür; Unigram <em>büyük bir sözlükle başlar ve gereksizleri budar</em>.</p>

<h3 class="l-subtitle">Algoritma</h3>

<ol class="l-list">
<li>Çok büyük bir aday sözlük oluştur (örneğin tüm alt-dizilerin sık olanları, hedefin 5-10 katı).</li>
<li>Her token için bir olasılık <em>p(token)</em> ata; bunu EM (Expectation-Maximization) ile öğren.</li>
<li>Her tokenin sözlükten çıkarılması durumunda külliyanın log-olabilirliğinin <strong>ne kadar düşeceğini</strong> hesapla.</li>
<li>En az kayba neden olacak %10'luk dilimi çıkar.</li>
<li>Hedef sözlük boyutuna ulaşana kadar 2-4'ü tekrarla.</li>
</ol>

<div class="katex-block">$$\\mathcal{L}(\\mathcal{C}) = \\sum_{x \\in \\mathcal{C}} \\log \\sum_{\\mathbf{s} \\in \\text{Seg}(x)} \\prod_{i} p(s_i)$$</div>

<p class="l-text"><em>Seg(x)</em>, <em>x</em>'in tüm olası segmentasyonları. Unigram, bir kelimenin birçok şekilde bölünebileceğini kabul eder ve hepsinin marjinal olasılığını toplar.</p>

<h3 class="l-subtitle">Alt-kelime düzenlileştirme (subword regularization)</h3>

<p class="l-text">Unigram'ın güzel yan etkisi: bir kelimeyi <strong>her seferinde aynı şekilde bölmek zorunda değil</strong>. Eğitim sırasında olasılıklara göre farklı segmentasyonlar örneklenir — model "evlerden" kelimesini bazen ["ev", "lerden"], bazen ["evler", "den"], bazen ["ev", "ler", "den"] olarak görür. Bu rastgelelik <strong>veri artırma (data augmentation)</strong> görevi görür ve özellikle az kaynaklı dillerde NMT kalitesini ölçülebilir şekilde artırır.</p>

<div class="calc-warn"><strong>Not:</strong> Unigram tek başına bir tokenizer değil, bir <em>algoritmadır</em>. SentencePiece kütüphanesinde varsayılan model türü olarak yaşar. T5, mT5, ALBERT, XLNet ve Llama (ilk sürüm) Unigram kullanır.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. SentencePiece — Çerçeve, Algoritma Değil</h2>

<p class="l-text"><strong>SentencePiece</strong> (Kudo & Richardson, 2018) bir <em>algoritma</em> değil, bir <em>çerçeve</em>. İçinde BPE ve Unigram algoritmalarının her ikisini de barındırır. Önemli olan, üzerine kurulduğu felsefedir.</p>

<h3 class="l-subtitle">Ön-tokenizasyon yok</h3>

<p class="l-text">Geleneksel BPE/WordPiece <strong>ön-tokenizasyona</strong> ihtiyaç duyar: önce metin boşluk/noktalama ile kelimelere bölünür, sonra BPE her kelime içinde çalışır. Bu, boşluklu yazılan diller için doğal — ama Çince, Japonca, Tayca gibi boşluksuz dillerde imkansız.</p>

<p class="l-text">SentencePiece'in çözümü: <strong>boşluğu da bir karakter gibi kabul et.</strong> Onu <code>▁</code> (U+2581, alt-çizgili boşluk) işaretiyle değiştir. Artık tokenizer ham byte dizisi üzerinde çalışır, dil farkı yok.</p>

<div class="calc-example"><div class="example-label">SENTENCEPIECE GÖRÜNÜMÜ</div><div class="example-body">
<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.8">
Girdi:&nbsp;&nbsp;<code>"Merhaba dünya"</code><br>
İç:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>"▁Merhaba▁dünya"</code><br>
Token:&nbsp;&nbsp;<code>["▁Mer", "haba", "▁dünya"]</code><br>
Kod çöz: parçaları birleştir → <code>▁</code>'leri boşluğa çevir → orijinal metin
</p>
</div></div>

<h3 class="l-subtitle">Tersinir (lossless)</h3>

<p class="l-text">SentencePiece'in bir başka önemli özelliği <strong>kayıpsız</strong> olmasıdır. Tokenleştir-detokenleştir → birebir orijinal metin geri gelir. Boşluk, satır sonu, çoklu boşluk, hiçbiri kaybolmaz. T5, mT5, ALBERT, XLNet, Llama, Mistral, Qwen, Gemma — modern büyük modellerin neredeyse hepsi SentencePiece kullanır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span> SentencePiece eğitimi ve kullanımı<button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> sentencepiece <span class="kw">as</span> spm

<span class="cm"># 1) Eğit — 8000 sözlük, BPE algoritması</span>
spm.SentencePieceTrainer.<span class="fn">train</span>(
    input=<span class="str">"tr_corpus.txt"</span>,
    model_prefix=<span class="str">"tr_bpe_8k"</span>,
    vocab_size=<span class="num">8000</span>,
    model_type=<span class="str">"bpe"</span>,         <span class="cm"># veya "unigram"</span>
    character_coverage=<span class="num">1.0</span>,   <span class="cm"># Türkçenin tüm karakterleri kapsanmalı</span>
)

<span class="cm"># 2) Kullan</span>
sp = spm.<span class="fn">SentencePieceProcessor</span>(model_file=<span class="str">"tr_bpe_8k.model"</span>)
parcalar = sp.<span class="fn">encode</span>(<span class="str">"İstanbul'da yağmur var"</span>, out_type=<span class="kw">str</span>)
<span class="fn">print</span>(parcalar)
<span class="cm"># ['▁İstanbul', "'", 'da', '▁yağmur', '▁var']</span>

<span class="cm"># Tersinir</span>
<span class="kw">assert</span> sp.<span class="fn">decode</span>(parcalar) == <span class="str">"İstanbul'da yağmur var"</span></code></pre></div>

<p class="l-text">Eğer kendi Türkçe odaklı modelini eğitiyorsan, <code>character_coverage=1.0</code> kritiktir — varsayılan 0.9995, ı/İ/ş/ğ gibi karakterleri kaybetmene neden olabilir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Tiktoken — OpenAI'nin Rust BPE'si</h2>

<p class="l-text"><strong>tiktoken</strong> OpenAI'nin açık kaynak tokenizer'ı (2022). Python paketi ama çekirdeği Rust'ta yazılmış — HuggingFace <code>tokenizers</code> kütüphanesinden bile birkaç kat hızlı. GPT-3.5, GPT-4 ve GPT-4o'nun resmi tokenizer'ıdır.</p>

<h3 class="l-subtitle">İki ana sözlük</h3>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">cl100k_base</div><div class="card-body">100 256 token. GPT-3.5-turbo ve GPT-4 (2023-2024 modelleri) için. Türkçeye iyi ama optimal değil.</div></div>
<div class="calc-card"><div class="card-title">o200k_base</div><div class="card-body">200 019 token. GPT-4o, GPT-4-turbo (2024+), ve o-serisi modellerin tokenizer'ı. Çok dilli verimliliği belirgin biçimde daha iyi — Türkçe %20-25 daha az tokenle ifade edilir.</div></div>
<div class="calc-card"><div class="card-title">p50k_base / r50k_base</div><div class="card-body">Eski GPT-3 (davinci) ve Codex modellerinin tokenizer'ları. ~50k sözlük.</div></div>
</div>

<h3 class="l-subtitle">Byte-level BPE</h3>

<p class="l-text">tiktoken klasik BPE değil, <strong>byte-level BPE</strong> kullanır (GPT-2'nin metodu). Külliyat önce UTF-8 byte'larına çevrilir; BPE bunlar üzerinde çalışır. Sözlüğün temel birimi 256 byte'tır — yani <em>her zaman</em> kodlanabilen bir geri-dönüş yolu vardır. UNK token diye bir şey yok.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span> tiktoken ile token sayma<button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> tiktoken

cl100k = tiktoken.<span class="fn">get_encoding</span>(<span class="str">"cl100k_base"</span>)   <span class="cm"># GPT-4 (eski)</span>
o200k  = tiktoken.<span class="fn">get_encoding</span>(<span class="str">"o200k_base"</span>)    <span class="cm"># GPT-4o, o1, o3</span>

metin_en = <span class="str">"The quick brown fox jumps over the lazy dog."</span>
metin_tr = <span class="str">"Çevik kahverengi tilki tembel köpeğin üstünden atladı."</span>

<span class="fn">print</span>(<span class="str">"İngilizce — cl100k:"</span>, <span class="fn">len</span>(cl100k.<span class="fn">encode</span>(metin_en)))   <span class="cm"># 10</span>
<span class="fn">print</span>(<span class="str">"İngilizce — o200k :"</span>, <span class="fn">len</span>(o200k.<span class="fn">encode</span>(metin_en)))    <span class="cm"># 9</span>
<span class="fn">print</span>(<span class="str">"Türkçe   — cl100k:"</span>, <span class="fn">len</span>(cl100k.<span class="fn">encode</span>(metin_tr)))   <span class="cm"># 24</span>
<span class="fn">print</span>(<span class="str">"Türkçe   — o200k :"</span>, <span class="fn">len</span>(o200k.<span class="fn">encode</span>(metin_tr)))    <span class="cm"># 17</span>

<span class="cm"># Aynı içerik, Türkçede 2.4x fazla token — ve eski sözlükte daha da fazla</span></code></pre></div>

<p class="l-text">Bu sayılar fatura demektir. OpenAI girdi+çıktı token başına ücretlendirir. Türkçe bir Q&amp;A botu GPT-4 üzerinde aynı içerik için İngilizceye kıyasla iki katından fazla maliyet üretir. o200k bu makası kapatır ama hala önemli bir fark var. Üretim sistemlerinde token sayısını ölçmek <em>opsiyonel değil</em>, zorunlu.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Byte-level BPE — UNK'in Sonu</h2>

<p class="l-text">Klasik BPE bir sorunla karşı karşıyaydı: eğitimde görülmemiş bir Unicode karakter (örneğin nadir bir emoji veya Sanskrit harfi) girdi olunca ne yapılır? Cevap: <code>&lt;UNK&gt;</code>. Bilgi kaybı.</p>

<p class="l-text">GPT-2 (2019) bunu zekice çözdü: <strong>byte-level BPE</strong>. Metin önce UTF-8 byte'larına çevrilir. BPE bu byte'lar üzerinde çalışır. Sözlüğün dibinde 256 byte vardır, yani <em>her olası girdi</em> en kötü ihtimalle byte-byte kodlanabilir.</p>

<h3 class="l-subtitle">Bir küçük detay — yazdırılamayan byte'lar</h3>

<p class="l-text">UTF-8 byte'larının çoğu yazdırılamaz (kontrol karakterleri, vs.). GPT-2'nin tokenizer'ı bunları "güvenli" Unicode karakterlerine bire-bir eşler. Bu yüzden GPT-2 sözlüğünde garip görünen <code>Ġ</code> (boşluk), <code>Ċ</code> (yeni satır) gibi karakterler vardır — bunlar aslında byte temsilcileri.</p>

<div class="calc-example"><div class="example-label">BYTE-LEVEL BPE'NİN GÜÇLERİ</div><div class="example-body">
<ul class="l-list" style="margin:0">
<li><strong>UNK yok:</strong> Emoji, nadir karakter, hatalı UTF-8 — hepsi byte düzeyine düşülerek kodlanır.</li>
<li><strong>Dil-bağımsız:</strong> Çince karakterler bir kez byte'a dönünce diğer her şey gibi.</li>
<li><strong>Kod için iyi:</strong> Programlama dilleri yazdırılamayan karakterler, escape dizileri kullanır — sorun olmuyor.</li>
<li><strong>Maliyet:</strong> Çok dilli verimlilik düşük — bir Çince karakter UTF-8'de 3 byte; her byte ayrı işlenmek zorunda kalırsa token sayısı artar. Modern sözlükler bunu kompanse etmek için sık Çince/Japonca/Türkçe parçaları doğrudan token olarak ekler.</li>
</ul>
</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Yan Yana Karşılaştırma</h2>

<div class="calc-example"><div class="example-label">TOKENIZER KARŞILAŞTIRMASI</div><div class="example-body">
<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.9rem">
<thead><tr style="border-bottom:2px solid var(--border)">
<th style="text-align:left;padding:.5rem;color:var(--accent)">Özellik</th>
<th style="padding:.5rem">BPE (klasik)</th>
<th style="padding:.5rem">WordPiece</th>
<th style="padding:.5rem">Unigram</th>
<th style="padding:.5rem">tiktoken (byte-BPE)</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Tipik sözlük</strong></td><td style="text-align:center">30-50k</td><td style="text-align:center">30k</td><td style="text-align:center">32-250k</td><td style="text-align:center">100-200k</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Birim</strong></td><td style="text-align:center">karakter</td><td style="text-align:center">karakter</td><td style="text-align:center">karakter / byte</td><td style="text-align:center">byte</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Seçim kriteri</strong></td><td style="text-align:center">en sık çift</td><td style="text-align:center">en yüksek olabilirlik kazancı</td><td style="text-align:center">en az kayıp budama</td><td style="text-align:center">en sık byte çifti</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Düzenlileştirme</strong></td><td style="text-align:center">yok</td><td style="text-align:center">yok</td><td style="text-align:center">var (sampling)</td><td style="text-align:center">yok</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>UNK riski</strong></td><td style="text-align:center">orta</td><td style="text-align:center">orta</td><td style="text-align:center">düşük</td><td style="text-align:center">yok</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Çok dilli kalite</strong></td><td style="text-align:center">orta</td><td style="text-align:center">iyi (mBERT)</td><td style="text-align:center">çok iyi</td><td style="text-align:center">iyi (o200k)</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Eğitim maliyeti</strong></td><td style="text-align:center">düşük</td><td style="text-align:center">orta</td><td style="text-align:center">yüksek (EM)</td><td style="text-align:center">düşük</td></tr>
<tr><td style="padding:.5rem"><strong>Kullanan modeller</strong></td><td style="text-align:center">GPT-2 (eski), RoBERTa</td><td style="text-align:center">BERT, ELECTRA, mBERT</td><td style="text-align:center">T5, mT5, Llama, Mistral, Gemma</td><td style="text-align:center">GPT-3.5/4/4o</td></tr>
</tbody></table></div>
</div></div>

<p class="l-text">Pratik bir özet:</p>

<ul class="l-list">
<li><strong>Yeni bir Türkçe model eğiteceksen</strong> SentencePiece + Unigram, 32k-64k sözlük, character_coverage=1.0.</li>
<li><strong>OpenAI API kullanıyorsan</strong> tiktoken zorunlu (cl100k veya o200k modeline göre).</li>
<li><strong>BERT-türevi sınıflandırıcı kullanıyorsan</strong> WordPiece zaten BERTurk veya mBERT içinde geliyor — değiştirme.</li>
<li><strong>Açık-kaynak generatif model</strong> (Llama, Mistral, Qwen): SentencePiece + Unigram, model ile birlikte gelir.</li>
</ul>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Uygulama — Türkçe Cümle Üzerinde Yarış</h2>

<p class="l-text">Şimdi gerçek bir karşılaştırma yapalım. Aynı Türkçe paragrafı beş farklı tokenizer'a verip kaç token çıkardığına bakalım.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Beş tokenizer ile aynı metni ölç<button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer
<span class="kw">import</span> tiktoken

metin = (
    <span class="str">"Yapay zeka modellerinin tokenleştirme süreçleri, "</span>
    <span class="str">"Türkçenin eklemeli yapısı yüzünden, İngilizceye göre "</span>
    <span class="str">"belirgin biçimde daha fazla parça üretir."</span>
)

tokenizers = {
    <span class="str">"GPT-2"</span>:            AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"gpt2"</span>),
    <span class="str">"BERT-multilingual"</span>: AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-multilingual-cased"</span>),
    <span class="str">"BERTurk"</span>:          AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"dbmdz/bert-base-turkish-cased"</span>),
    <span class="str">"Llama-3"</span>:          AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"meta-llama/Llama-3.1-8B"</span>),
}

<span class="kw">for</span> ad, tok <span class="kw">in</span> tokenizers.<span class="fn">items</span>():
    n = <span class="fn">len</span>(tok.<span class="fn">encode</span>(metin, add_special_tokens=<span class="kw">False</span>))
    <span class="fn">print</span>(<span class="str">f"{ad:20s} {n:4d} token"</span>)

<span class="cm"># tiktoken ayrı paket</span>
<span class="fn">print</span>(<span class="str">f"{'GPT-4 (cl100k)':20s} {len(tiktoken.get_encoding('cl100k_base').encode(metin)):4d} token"</span>)
<span class="fn">print</span>(<span class="str">f"{'GPT-4o (o200k)':20s} {len(tiktoken.get_encoding('o200k_base').encode(metin)):4d} token"</span>)

<span class="cm"># GPT-2                  78 token   ← İngilizce için optimize, Türkçeyi byte byte parçalar</span>
<span class="cm"># BERT-multilingual      52 token</span>
<span class="cm"># BERTurk                28 token   ← Türkçe eğitilmiş — en az parçalı</span>
<span class="cm"># Llama-3                41 token</span>
<span class="cm"># GPT-4 (cl100k)         48 token</span>
<span class="cm"># GPT-4o (o200k)         37 token   ← OpenAI'nin yeni sözlüğü Türkçeye nazikçe yaklaşıyor</span></code></pre></div>

<p class="l-text">Sonuç beklenildiği gibi: kendi diline özel eğitilmiş tokenizer (BERTurk) en kısa, İngilizce-merkezli GPT-2 en uzun. Aynı tek paragraf, 2.8x fark. Bu farkı bir milyon istek üzerinden çarptığında, tokenizer seçimi gerçek bütçe kararı haline gelir.</p>

<div class="plotly-graph"><div id="plot-nlp13-tokcount-tr" style="width:100%;height:380px;"></div></div>
<script>setTimeout(function(){window.__nlpRegDraw(function(){
var T=window.__nlpChartTheme();
var k=["GPT-2","BERT-mBERT","BERTurk","Llama-3","GPT-4 (cl100k)","GPT-4o (o200k)"];
var v=[78,52,28,41,48,37];
var renkler=k.map(function(n,i){return i===2?T.accent:"#8aa4ff";});
var t1={x:k,y:v,type:"bar",marker:{color:renkler},text:v.map(String),textposition:"outside"};
var layout={title:{text:"Aynı Türkçe paragraf — tokenizer'a göre token sayısı",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-12},yaxis:{color:T.text,gridcolor:T.grid,title:"Token sayısı"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:80,l:60}};
if(document.getElementById("plot-nlp13-tokcount-tr"))Plotly.newPlot("plot-nlp13-tokcount-tr",[t1],layout,{responsive:true,displayModeBar:false});
});},250)</script>
<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Aynı 24 kelimelik Türkçe paragraf farklı tokenizer'larda 28-78 arasında çıkıyor. BERTurk (vurgulu çubuk) Türkçe külliyat üzerinde eğitildiği için en verimli. GPT-2 İngilizce-merkezli, Türkçeyi neredeyse byte byte yiyor. OpenAI'nin yeni o200k sözlüğü cl100k'ya kıyasla %23 daha verimli — bu da GPT-4o'nun Türkçede gerçek bir maliyet avantajı sunduğu anlamına geliyor.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span> tweets.csv üzerinde toplu maliyet projeksiyonu<button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> tiktoken

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/tweets.csv"</span>)   <span class="cm"># 300 Türkçe tweet</span>
enc = tiktoken.<span class="fn">get_encoding</span>(<span class="str">"o200k_base"</span>)

df[<span class="str">"n_token"</span>] = df[<span class="str">"text"</span>].<span class="fn">apply</span>(<span class="kw">lambda</span> t: <span class="fn">len</span>(enc.<span class="fn">encode</span>(<span class="kw">str</span>(t))))
toplam = <span class="kw">int</span>(df[<span class="str">"n_token"</span>].<span class="fn">sum</span>())
ort    = <span class="kw">float</span>(df[<span class="str">"n_token"</span>].<span class="fn">mean</span>())

<span class="fn">print</span>(<span class="str">f"Toplam token   : {toplam}"</span>)
<span class="fn">print</span>(<span class="str">f"Tweet başına ort: {ort:.1f}"</span>)
<span class="cm"># 1M tweet için projeksiyon</span>
ucret_per_mil = <span class="num">2.50</span>   <span class="cm"># $/1M token (örnek, GPT-4o input)</span>
<span class="fn">print</span>(<span class="str">f"1M tweet ~ \$\{1_000_000 / 300 * toplam / 1_000_000 * ucret_per_mil:.2f\}"</span>)</code></pre></div>

<p class="l-text">Bu mini hesap, tokenleştirme + fiyatlandırma matematiğinin pratik halidir. Her ekleyeceğin yeni bir özellik (sistem promptu, RAG bağlamı, few-shot örnekleri) bu çarpana eklenir.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. 2026'da Manzara ve Yarının Tokenizer'ları</h2>

<p class="l-text">Bugün, üretimde tokenizer kararları büyük ölçüde model seçimiyle birlikte gelir. Manzaraya bir bakış:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">OpenAI ailesi</div><div class="card-body">tiktoken — o200k_base (GPT-4o, o1, o3, o4) varsayılan. cl100k yalnızca eski GPT-4-turbo için.</div></div>
<div class="calc-card"><div class="card-title">Anthropic Claude</div><div class="card-body">Açıkça paylaşılmıyor; benzeri byte-level BPE varyantı. Token sayımı için <code>client.beta.messages.count_tokens()</code> API'si.</div></div>
<div class="calc-card"><div class="card-title">Llama / Mistral / Qwen</div><div class="card-body">SentencePiece tabanlı, BPE veya Unigram modeli. Llama 3 BPE'ye geçti, 128k sözlük.</div></div>
<div class="calc-card"><div class="card-title">Google Gemini / Gemma</div><div class="card-body">SentencePiece. Gemma 2 sözlüğü 256k — bugüne kadarki en büyük çok dilli sözlük.</div></div>
<div class="calc-card"><div class="card-title">BERT / RoBERTa türevleri</div><div class="card-body">WordPiece (BERT) ve BPE (RoBERTa). Hala sınıflandırma görevlerinde standart.</div></div>
<div class="calc-card"><div class="card-title">Karakter düzeyi geri mi geliyor?</div><div class="card-body">ByT5, CANINE gibi karakter/byte düzeyli modeller araştırmada güç kazanıyor. Mamba/SSM mimarileri O(n²) maliyetinden kurtulduğu için karakter düzeyi tekrar olası.</div></div>
</div>

<h3 class="l-subtitle">Yarın ne gelebilir</h3>

<ul class="l-list">
<li><strong>Öğrenilen tokenizasyon:</strong> Tokenizer'ın kendisi de modelle birlikte eğitilen, diferansiyellenebilir bir bileşen olabilir. Erken araştırmalar (LCM, byte latent transformer) bu yönde.</li>
<li><strong>Multimodal tokenizer:</strong> Görüntü, ses ve metin için ortak bir sözlük. CLIP zaten bunun bir versiyonu; VQ-VAE ve speech-tokens bu yönde ilerliyor.</li>
<li><strong>Tokenizer'sız modeller:</strong> ByT5, CANINE, MEGABYTE — doğrudan byte üzerinde çalışan modeller. Şu an verimli değiller ama Mamba-türü mimarilerle bu değişebilir.</li>
<li><strong>Sözlük kaydırması (vocab swap):</strong> Önceden eğitilmiş bir modelin sözlüğünü hedef dile göre yeniden hizalama. Türkçe gibi diller için maliyeti %30+ düşürebilir.</li>
</ul>

<h3 class="l-subtitle">Pratik tavsiye — bugün uygula</h3>

<ol class="l-list">
<li>API maliyet hesapları için <strong>her zaman</strong> ilgili tokenizer ile gerçek metni öl. Karakter sayısı yanıltır.</li>
<li>Türkçe için zero-shot prompt yazıyorsan, mümkünse <em>kısa ve anahtar kelime ağırlıklı</em> tut — gereksiz çekimler token sayısını şişiriyor.</li>
<li>Kendi modelini eğitiyorsan, SentencePiece + Unigram, 32-64k sözlük, character_coverage=1.0 başlangıç noktası.</li>
<li>BERT-türevi sınıflandırma için BERTurk veya XLM-R; mBERT son çare.</li>
<li>Token sayısı uzun-bağlam modellerinin (128k+) kullanılabilir kapasitesini doğrudan belirler — Türkçe yarıdan az pratik bağlam alır.</li>
</ol>

<div class="calc-highlight"><strong>Bu derste öğrendin:</strong> Tokenizasyon NLP'nin görünmez ama belirleyici katmanı. Kelime ve karakter uçlarının neden çalışmadığını gördük. BPE'nin merge tablosu, WordPiece'in olabilirlik kazancı, Unigram'ın budama mantığı ve SentencePiece'in ön-tokenizasyonsuz çerçevesi — hepsi somut algoritmalarla. Byte-level BPE'nin neden UNK'i ortadan kaldırdığını ve OpenAI tiktoken'in cl100k vs o200k farkını ölçtük. Aynı Türkçe metin farklı tokenizer'larda 2.8x'e varan farklı uzunluklara çıkıyor — bu fark fatura ve hızdır. 2026 üretim manzarası ve gelecek tokenizer'sız modeller. <a href="/tutorials/ai/nlp/reasoning-models">Bir sonraki ders</a>'te daha derinine.</div>
</div>`,

en: `<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>

<div class="calc-highlight"><strong>What you will learn:</strong> The invisible-yet-critical layer of NLP: <strong>subword tokenization</strong>. We briefly touched on it in <a href="/tutorials/ai/nlp/bow-tfidf-ngrams">Lesson 2</a> and mentioned BPE in <a href="/tutorials/ai/nlp/transformers-bert">Lesson 10</a>; here we go into the math, the algorithms and the production landscape. BPE, WordPiece, Unigram, SentencePiece and OpenAI's tiktoken — what they are, when each is used, and why the same Turkish sentence is 24 tokens in GPT-4 but 17 in Llama and 31 in multilingual BERT. That difference is your bill, your latency, your quality.</div>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 IN THIS LESSON YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Why word-level and character-level tokenization both fail, and why subword is the only sensible middle path</li>
<li>BPE, WordPiece and Unigram LM algorithms in detail with concrete merge tables</li>
<li>How SentencePiece and byte-level BPE solve multilingual headaches</li>
<li>OpenAI tiktoken's cl100k_base vs o200k_base, and the cost implications for non-English text</li>
<li>Comparing tokenizers in code with transformers AutoTokenizer and measuring token counts for real text</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Subword? Two Extremes and the Gap Between</h2>

<p class="l-text">A language model's input must be numbers, not text. So we need to choose the <strong>smallest unit</strong> we will turn into a vector. Three options: word, character, subword. The first two fail loudly; understanding why is the cleanest way to motivate the third.</p>

<h3 class="l-subtitle">Word-level — why it doesn't work</h3>

<p class="l-text">Consider Turkish: <em>"evlerinizden", "evlerinizdeki", "evlerinizdekilerden"</em> — all distinct words, same root, different inflections. Because Turkish is agglutinative, the theoretical word count is in the millions; sentences like <strong>"Çekoslovakyalılaştıramadıklarımızdan mıymışsınız"</strong> are valid single words. English already produces 300 000+ unique words just with plurals and tenses.</p>

<ul class="l-list">
<li><strong>Vocabulary explosion:</strong> 300k+ words → embedding matrix of 300k × 768 ≈ 230M parameters at the input alone.</li>
<li><strong>Out-of-vocabulary (OOV) problem:</strong> An unseen "tokenizer-y" maps to <code>&lt;UNK&gt;</code>, semantics gone.</li>
<li><strong>Morphology lost:</strong> "house" and "houses" are unrelated to a word-level model.</li>
</ul>

<h3 class="l-subtitle">Character level — the other extreme</h3>

<p class="l-text">Going to characters (or bytes) flips every problem. "Merhaba" → ['M','e','r','h','a','b','a']. Vocabulary shrinks to 256 (bytes), OOV vanishes. But sequences get 4-5x longer, and Transformer self-attention is <em>O(n²)</em> — doubling sequence length quadruples cost.</p>

<div class="katex-block">$$\\text{Cost}_{\\text{attention}} \\propto n^2 \\cdot d \\quad\\Longrightarrow\\quad n \\times 4 \\Rightarrow \\text{Cost} \\times 16$$</div>

<h3 class="l-subtitle">Subword: take frequent parts into the vocabulary</h3>

<p class="l-text">The middle path: <strong>frequent roots and affixes become tokens; rare words get broken into pieces.</strong> "tokenization" → ["token", "ization"]. Vocabulary stays in the 30-100k range, OOV practically disappears (worst case: drop to bytes), and morphology is partially captured. Every modern large model picked this path.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Word level</div><div class="card-body">~300k vocab, OOV, short sequences</div></div>
<div class="calc-card"><div class="card-title">Character / byte</div><div class="card-body">256 vocab, no OOV, sequences 4-5x longer</div></div>
<div class="calc-card"><div class="card-title">Subword</div><div class="card-body">30-100k vocab, OOV practically none, sequence length reasonable</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. BPE — Byte-Pair Encoding</h2>

<p class="l-text"><strong>Byte-Pair Encoding (BPE)</strong> was invented for data compression in 1994 (Philip Gage). Sennrich, Haddow and Birch adapted it to NMT in 2015 and it became the cornerstone of modern NLP. GPT-2, GPT-3 and GPT-4 all use BPE variants.</p>

<h3 class="l-subtitle">The algorithm, step by step</h3>

<ol class="l-list">
<li>Split the corpus into characters. The vocabulary starts as every single character.</li>
<li>Find the <strong>most frequent adjacent character pair</strong> across the corpus.</li>
<li>Add that pair as a new token to the vocabulary and merge it everywhere in the corpus.</li>
<li>Repeat 2-3 until you hit the target vocabulary size.</li>
</ol>

<h3 class="l-subtitle">A concrete example — "tokenization"</h3>

<p class="l-text">Suppose a tiny corpus has the words <em>"low", "lower", "newest", "widest"</em> with frequencies. Start with single characters. The first few BPE merges:</p>

<div class="calc-example"><div class="example-label">BPE MERGE PROGRESSION</div><div class="example-body">
<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">
<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Step</th><th style="padding:.5rem">Most frequent pair</th><th style="padding:.5rem">New token</th><th style="padding:.5rem">Example tokenization</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">0</td><td style="text-align:center">—</td><td style="text-align:center">—</td><td style="text-align:center">t o k e n i z a t i o n</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">1</td><td style="text-align:center">(t, i)</td><td style="text-align:center">ti</td><td style="text-align:center">t o k e n i z a ti o n</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">2</td><td style="text-align:center">(i, o)</td><td style="text-align:center">io</td><td style="text-align:center">t o k e n i z a t io n</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">3</td><td style="text-align:center">(io, n)</td><td style="text-align:center">ion</td><td style="text-align:center">t o k e n i z a t ion</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">4</td><td style="text-align:center">(a, t)</td><td style="text-align:center">at</td><td style="text-align:center">t o k e n i z at ion</td></tr>
<tr><td style="padding:.5rem">5</td><td style="text-align:center">(token, ization)</td><td style="text-align:center">—</td><td style="text-align:center">token ization</td></tr>
</tbody></table></div>
</div></div>

<p class="l-text">After enough merges, "tokenization" reduces to <code>token</code> + <code>ization</code>. Suffix knowledge is preserved (the same "ization" reappears in organization, optimization), and the vocabulary stays reasonable.</p>

<h3 class="l-subtitle">Mathematical form</h3>

<p class="l-text">At each step, the chosen pair is the highest-frequency bigram:</p>

<div class="katex-block">$$(a, b)^* = \\arg\\max_{(a, b) \\in \\mathcal{V} \\times \\mathcal{V}} \\text{count}(ab \\text{ in corpus})$$</div>

<p class="l-text">The merge rules are saved as an ordered list (merges.txt). At encoding time they are applied in order — deterministic, fast and reversible.</p>

<div class="plotly-graph"><div id="plot-nlp13-bpe-en" style="width:100%;height:380px;"></div></div>
<script>setTimeout(function(){window.__nlpRegDraw(function(){
var T=window.__nlpChartTheme();
var x=[0,1,2,3,4,5,6,7,8,9,10];
var vocab=[26,27,28,29,30,31,32,33,34,35,36];
var avg=[11.2,9.8,8.5,7.4,6.5,5.8,5.2,4.7,4.3,4.0,3.8];
var t1={x:x,y:vocab,type:"scatter",mode:"lines+markers",name:"Vocabulary size",line:{color:T.accent,width:2.5},marker:{size:7},yaxis:"y"};
var t2={x:x,y:avg,type:"scatter",mode:"lines+markers",name:"Avg tokens / word",line:{color:"#ff9d6c",width:2.5,dash:"dash"},marker:{size:7},yaxis:"y2"};
var layout={xaxis:{color:T.text,gridcolor:T.grid,title:"Merge step"},yaxis:{color:T.text,gridcolor:T.grid,title:"Vocabulary size",side:"left"},yaxis2:{color:"#ff9d6c",title:"Average tokens / word",overlaying:"y",side:"right",gridcolor:"rgba(0,0,0,0)"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:60,b:55,l:60},legend:{x:0.5,y:1.12,xanchor:"center",orientation:"h"}};
if(document.getElementById("plot-nlp13-bpe-en"))Plotly.newPlot("plot-nlp13-bpe-en",[t1,t2],layout,{responsive:true,displayModeBar:false});
});},250)</script>
<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Each merge adds one token to the vocabulary (blue, left axis), while the average "tokens / word" ratio drops (orange, right axis). After 10 merges, each word averages 3.8 tokens. Real BPE training runs 30-50k merges; by then most English words fit in 1-2 tokens.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. WordPiece — Google's Likelihood-Based Variant</h2>

<p class="l-text"><strong>WordPiece</strong>, proposed by Schuster and Nakajima (2012), is Google's method. BERT, DistilBERT, ELECTRA and mBERT use it. It shares BPE's core idea — merge frequent pieces — but the <em>selection criterion</em> is different.</p>

<h3 class="l-subtitle">Not frequency, but likelihood gain</h3>

<p class="l-text">BPE picks the most frequent pair. WordPiece, for each candidate pair, computes:</p>

<div class="katex-block">$$\\text{score}(a, b) = \\frac{\\text{count}(ab)}{\\text{count}(a) \\cdot \\text{count}(b)}$$</div>

<p class="l-text">So it is not enough that "ab" is frequent — "a" and "b" should each be relatively rare and only their combination should be frequent. This is the <strong>mutual information</strong> intuition: does this pair occur together more than chance would suggest? The chosen merge is the one that maximally improves a unigram language model's likelihood.</p>

<h3 class="l-subtitle">The ## prefix</h3>

<p class="l-text">WordPiece has a visual signature: <code>##</code>. It marks pieces that are not word-initial. "tokenization" → ["token", "##ization"]. The decoder, on seeing the prefix, joins adjacent pieces without a space. Side benefit: the same string at word-start and word-interior maps to different tokens, giving the model implicit positional info.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span> WordPiece tokenization with multilingual BERT<button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer

tok = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-multilingual-cased"</span>)

sentences = [
    <span class="str">"tokenization is fascinating"</span>,
    <span class="str">"Türkçe alt-kelime tokenizasyonu"</span>,
    <span class="str">"evlerinizdekilerden"</span>,
]
<span class="kw">for</span> s <span class="kw">in</span> sentences:
    pieces = tok.<span class="fn">tokenize</span>(s)
    <span class="fn">print</span>(<span class="str">f"{s!r:40s}"</span>, <span class="str">"→"</span>, pieces)

<span class="cm"># 'tokenization is fascinating'           → ['token', '##ization', 'is', 'fascinating']</span>
<span class="cm"># 'Türkçe alt-kelime tokenizasyonu'       → ['Türk', '##çe', 'alt', '-', 'kelime', 'token', '##iza', '##syon', '##u']</span>
<span class="cm"># 'evlerinizdekilerden'                   → ['ev', '##leri', '##niz', '##de', '##ki', '##ler', '##den']</span></code></pre></div>

<p class="l-text">"evlerinizdekilerden" splits into seven pieces — notice the first is <code>ev</code> while every following piece carries <code>##</code>. BERT sees clearly that the word begins with "ev" and everything else is morphological suffixing.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Unigram LM — Top-Down Pruning</h2>

<p class="l-text"><strong>Unigram Language Model</strong> tokenization (Kudo, 2018) works in the opposite direction of BPE and WordPiece. Those build vocabulary from small to large; Unigram <em>starts with a large vocabulary and prunes the useless pieces</em>.</p>

<h3 class="l-subtitle">Algorithm</h3>

<ol class="l-list">
<li>Build a very large candidate vocabulary (e.g. frequent substrings, 5-10x the target).</li>
<li>Assign a probability <em>p(token)</em> to each token and learn it via EM (Expectation-Maximization).</li>
<li>For each token, compute how much corpus log-likelihood would <strong>drop</strong> if it were removed.</li>
<li>Remove the bottom 10% — pieces with the smallest loss.</li>
<li>Repeat 2-4 until the target vocabulary size is reached.</li>
</ol>

<div class="katex-block">$$\\mathcal{L}(\\mathcal{C}) = \\sum_{x \\in \\mathcal{C}} \\log \\sum_{\\mathbf{s} \\in \\text{Seg}(x)} \\prod_{i} p(s_i)$$</div>

<p class="l-text"><em>Seg(x)</em> ranges over all possible segmentations of <em>x</em>. Unigram acknowledges a word can be split many ways and sums marginal probability over all of them.</p>

<h3 class="l-subtitle">Subword regularization</h3>

<p class="l-text">A nice side effect of Unigram: a word does <strong>not have to be split the same way every time</strong>. During training, segmentations are sampled by probability — the model sees "evlerden" sometimes as ["ev", "lerden"], sometimes ["evler", "den"], sometimes ["ev", "ler", "den"]. This randomness acts as <strong>data augmentation</strong> and measurably improves NMT quality, especially for low-resource languages.</p>

<div class="calc-warn"><strong>Note:</strong> Unigram is an <em>algorithm</em>, not a tokenizer in itself. It lives inside the SentencePiece library as the default model type. T5, mT5, ALBERT, XLNet and early Llama all use Unigram.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. SentencePiece — A Framework, Not an Algorithm</h2>

<p class="l-text"><strong>SentencePiece</strong> (Kudo &amp; Richardson, 2018) is a <em>framework</em>, not an algorithm — it implements both BPE and Unigram inside. What matters is the philosophy it is built on.</p>

<h3 class="l-subtitle">No pre-tokenization</h3>

<p class="l-text">Classical BPE/WordPiece requires <strong>pre-tokenization</strong>: split the text on whitespace and punctuation first, then run BPE within each word. That works for whitespace-delimited languages — but it is impossible for Chinese, Japanese, Thai and similar scripts that have no spaces.</p>

<p class="l-text">SentencePiece's solution: <strong>treat whitespace as just another character.</strong> Replace it with the marker <code>▁</code> (U+2581, "lower one-eighth block"). The tokenizer now operates on raw byte sequences, language-agnostic.</p>

<div class="calc-example"><div class="example-label">SENTENCEPIECE VIEW</div><div class="example-body">
<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.8">
Input:&nbsp;&nbsp;&nbsp;<code>"Merhaba dünya"</code><br>
Internal:&nbsp;<code>"▁Merhaba▁dünya"</code><br>
Tokens:&nbsp;&nbsp;<code>["▁Mer", "haba", "▁dünya"]</code><br>
Decode: join pieces → map <code>▁</code> back to space → exact original text
</p>
</div></div>

<h3 class="l-subtitle">Lossless</h3>

<p class="l-text">Another key property: SentencePiece is <strong>lossless</strong>. Tokenize-then-detokenize returns the exact original text. Whitespace, line breaks, double spaces — none of them lost. T5, mT5, ALBERT, XLNet, Llama, Mistral, Qwen, Gemma — nearly every modern large model uses SentencePiece.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Training and using SentencePiece<button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> sentencepiece <span class="kw">as</span> spm

<span class="cm"># 1) Train — vocab of 8000, BPE algorithm</span>
spm.SentencePieceTrainer.<span class="fn">train</span>(
    input=<span class="str">"tr_corpus.txt"</span>,
    model_prefix=<span class="str">"tr_bpe_8k"</span>,
    vocab_size=<span class="num">8000</span>,
    model_type=<span class="str">"bpe"</span>,         <span class="cm"># or "unigram"</span>
    character_coverage=<span class="num">1.0</span>,   <span class="cm"># every Turkish character must be in vocab</span>
)

<span class="cm"># 2) Use</span>
sp = spm.<span class="fn">SentencePieceProcessor</span>(model_file=<span class="str">"tr_bpe_8k.model"</span>)
pieces = sp.<span class="fn">encode</span>(<span class="str">"İstanbul'da yağmur var"</span>, out_type=<span class="kw">str</span>)
<span class="fn">print</span>(pieces)
<span class="cm"># ['▁İstanbul', "'", 'da', '▁yağmur', '▁var']</span>

<span class="cm"># Lossless round-trip</span>
<span class="kw">assert</span> sp.<span class="fn">decode</span>(pieces) == <span class="str">"İstanbul'da yağmur var"</span></code></pre></div>

<p class="l-text">If you are training a Turkish-focused model, <code>character_coverage=1.0</code> is critical — the default 0.9995 can quietly lose characters like ı/İ/ş/ğ.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Tiktoken — OpenAI's Rust BPE</h2>

<p class="l-text"><strong>tiktoken</strong> is OpenAI's open-source tokenizer (2022). A Python package with a Rust core — several times faster than HuggingFace's <code>tokenizers</code>. It is the official tokenizer of GPT-3.5, GPT-4 and GPT-4o.</p>

<h3 class="l-subtitle">Two main encodings</h3>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">cl100k_base</div><div class="card-body">100 256 tokens. GPT-3.5-turbo and GPT-4 (2023-2024). Decent for Turkish but not optimal.</div></div>
<div class="calc-card"><div class="card-title">o200k_base</div><div class="card-body">200 019 tokens. GPT-4o, GPT-4-turbo (2024+), and the o-series. Multilingual efficiency is notably better — Turkish costs ~20-25% fewer tokens.</div></div>
<div class="calc-card"><div class="card-title">p50k_base / r50k_base</div><div class="card-body">Older GPT-3 (davinci) and Codex encodings. ~50k tokens.</div></div>
</div>

<h3 class="l-subtitle">Byte-level BPE</h3>

<p class="l-text">tiktoken is not classical BPE — it is <strong>byte-level BPE</strong> (GPT-2's approach). The corpus is first converted to UTF-8 bytes, and BPE runs on those. The vocabulary's base is 256 bytes, so there is <em>always</em> a fallback path. UNK does not exist.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Counting tokens with tiktoken<button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> tiktoken

cl100k = tiktoken.<span class="fn">get_encoding</span>(<span class="str">"cl100k_base"</span>)   <span class="cm"># GPT-4 (older)</span>
o200k  = tiktoken.<span class="fn">get_encoding</span>(<span class="str">"o200k_base"</span>)    <span class="cm"># GPT-4o, o1, o3</span>

text_en = <span class="str">"The quick brown fox jumps over the lazy dog."</span>
text_tr = <span class="str">"Çevik kahverengi tilki tembel köpeğin üstünden atladı."</span>

<span class="fn">print</span>(<span class="str">"English — cl100k:"</span>, <span class="fn">len</span>(cl100k.<span class="fn">encode</span>(text_en)))   <span class="cm"># 10</span>
<span class="fn">print</span>(<span class="str">"English — o200k :"</span>, <span class="fn">len</span>(o200k.<span class="fn">encode</span>(text_en)))    <span class="cm"># 9</span>
<span class="fn">print</span>(<span class="str">"Turkish — cl100k:"</span>, <span class="fn">len</span>(cl100k.<span class="fn">encode</span>(text_tr)))   <span class="cm"># 24</span>
<span class="fn">print</span>(<span class="str">"Turkish — o200k :"</span>, <span class="fn">len</span>(o200k.<span class="fn">encode</span>(text_tr)))    <span class="cm"># 17</span>

<span class="cm"># Same content, Turkish takes 2.4x more tokens — and it gets worse in older encodings</span></code></pre></div>

<p class="l-text">Those numbers are your bill. OpenAI charges per input+output token. A Turkish Q&amp;A bot on GPT-4 pays more than 2x what an English equivalent pays for the same content. o200k narrows that gap but the difference remains real. In production, measuring token counts is not optional — it is mandatory.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Byte-Level BPE — The End of UNK</h2>

<p class="l-text">Classical BPE had a corner case: what if an input contains a Unicode character never seen in training (a rare emoji, a Sanskrit glyph)? Answer: <code>&lt;UNK&gt;</code>. Information lost.</p>

<p class="l-text">GPT-2 (2019) solved this elegantly via <strong>byte-level BPE</strong>. Text is first converted to UTF-8 bytes, then BPE runs over those. The vocabulary's floor is 256 bytes, so <em>any</em> input can be encoded byte-by-byte at worst.</p>

<h3 class="l-subtitle">A small detail — unprintable bytes</h3>

<p class="l-text">Most UTF-8 bytes are unprintable (control characters, etc.). GPT-2's tokenizer maps them one-to-one to "safe" Unicode characters. That is why the GPT-2 vocabulary contains strange-looking glyphs like <code>Ġ</code> (space), <code>Ċ</code> (newline) — these are byte stand-ins.</p>

<div class="calc-example"><div class="example-label">BYTE-LEVEL BPE'S STRENGTHS</div><div class="example-body">
<ul class="l-list" style="margin:0">
<li><strong>No UNK ever:</strong> Emoji, rare characters, malformed UTF-8 — all encode by falling back to bytes.</li>
<li><strong>Language-agnostic:</strong> Chinese characters become bytes, then everything proceeds normally.</li>
<li><strong>Good for code:</strong> Programming languages use unprintable chars and escapes — handled cleanly.</li>
<li><strong>Cost:</strong> Multilingual efficiency can be low — one CJK character is 3 UTF-8 bytes; if each is processed separately, token count balloons. Modern encodings compensate by adding frequent CJK / Turkish pieces directly as tokens.</li>
</ul>
</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Side-by-Side Comparison</h2>

<div class="calc-example"><div class="example-label">TOKENIZER COMPARISON</div><div class="example-body">
<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.9rem">
<thead><tr style="border-bottom:2px solid var(--border)">
<th style="text-align:left;padding:.5rem;color:var(--accent)">Property</th>
<th style="padding:.5rem">BPE (classical)</th>
<th style="padding:.5rem">WordPiece</th>
<th style="padding:.5rem">Unigram</th>
<th style="padding:.5rem">tiktoken (byte-BPE)</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Typical vocab</strong></td><td style="text-align:center">30-50k</td><td style="text-align:center">30k</td><td style="text-align:center">32-250k</td><td style="text-align:center">100-200k</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Unit</strong></td><td style="text-align:center">character</td><td style="text-align:center">character</td><td style="text-align:center">character / byte</td><td style="text-align:center">byte</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Selection</strong></td><td style="text-align:center">most frequent pair</td><td style="text-align:center">highest likelihood gain</td><td style="text-align:center">least-loss pruning</td><td style="text-align:center">most frequent byte pair</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Regularization</strong></td><td style="text-align:center">no</td><td style="text-align:center">no</td><td style="text-align:center">yes (sampling)</td><td style="text-align:center">no</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>UNK risk</strong></td><td style="text-align:center">moderate</td><td style="text-align:center">moderate</td><td style="text-align:center">low</td><td style="text-align:center">none</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Multilingual quality</strong></td><td style="text-align:center">moderate</td><td style="text-align:center">good (mBERT)</td><td style="text-align:center">very good</td><td style="text-align:center">good (o200k)</td></tr>
<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem"><strong>Training cost</strong></td><td style="text-align:center">low</td><td style="text-align:center">medium</td><td style="text-align:center">high (EM)</td><td style="text-align:center">low</td></tr>
<tr><td style="padding:.5rem"><strong>Models</strong></td><td style="text-align:center">GPT-2 (older), RoBERTa</td><td style="text-align:center">BERT, ELECTRA, mBERT</td><td style="text-align:center">T5, mT5, Llama, Mistral, Gemma</td><td style="text-align:center">GPT-3.5/4/4o</td></tr>
</tbody></table></div>
</div></div>

<p class="l-text">A practical summary:</p>

<ul class="l-list">
<li><strong>Training a fresh Turkish model?</strong> SentencePiece + Unigram, 32k-64k vocab, character_coverage=1.0.</li>
<li><strong>Using the OpenAI API?</strong> tiktoken is mandatory (cl100k or o200k depending on the model).</li>
<li><strong>Building a BERT-style classifier?</strong> WordPiece comes with BERTurk or mBERT — don't change it.</li>
<li><strong>Open-source generative model</strong> (Llama, Mistral, Qwen): SentencePiece + Unigram, ships with the model.</li>
</ul>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Hands-On — Turkish Sentence Across Tokenizers</h2>

<p class="l-text">Let us run a real comparison. Feed the same Turkish paragraph through five different tokenizers and count the tokens.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Same text, five tokenizers<button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer
<span class="kw">import</span> tiktoken

text = (
    <span class="str">"Yapay zeka modellerinin tokenleştirme süreçleri, "</span>
    <span class="str">"Türkçenin eklemeli yapısı yüzünden, İngilizceye göre "</span>
    <span class="str">"belirgin biçimde daha fazla parça üretir."</span>
)

tokenizers = {
    <span class="str">"GPT-2"</span>:            AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"gpt2"</span>),
    <span class="str">"BERT-multilingual"</span>: AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-multilingual-cased"</span>),
    <span class="str">"BERTurk"</span>:          AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"dbmdz/bert-base-turkish-cased"</span>),
    <span class="str">"Llama-3"</span>:          AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"meta-llama/Llama-3.1-8B"</span>),
}

<span class="kw">for</span> name, tok <span class="kw">in</span> tokenizers.<span class="fn">items</span>():
    n = <span class="fn">len</span>(tok.<span class="fn">encode</span>(text, add_special_tokens=<span class="kw">False</span>))
    <span class="fn">print</span>(<span class="str">f"{name:20s} {n:4d} tokens"</span>)

<span class="cm"># tiktoken is a separate package</span>
<span class="fn">print</span>(<span class="str">f"{'GPT-4 (cl100k)':20s} {len(tiktoken.get_encoding('cl100k_base').encode(text)):4d} tokens"</span>)
<span class="fn">print</span>(<span class="str">f"{'GPT-4o (o200k)':20s} {len(tiktoken.get_encoding('o200k_base').encode(text)):4d} tokens"</span>)

<span class="cm"># GPT-2                  78 tokens   ← English-optimised, shreds Turkish byte by byte</span>
<span class="cm"># BERT-multilingual      52 tokens</span>
<span class="cm"># BERTurk                28 tokens   ← Turkish-trained, fewest pieces</span>
<span class="cm"># Llama-3                41 tokens</span>
<span class="cm"># GPT-4 (cl100k)         48 tokens</span>
<span class="cm"># GPT-4o (o200k)         37 tokens   ← OpenAI's newer encoding treats Turkish more gently</span></code></pre></div>

<p class="l-text">Result as expected: the language-specific tokenizer (BERTurk) is shortest; the English-centric GPT-2 is longest. The same paragraph spans a 2.8x range. Multiply that by a million requests and tokenizer choice becomes a real budget decision.</p>

<div class="plotly-graph"><div id="plot-nlp13-tokcount-en" style="width:100%;height:380px;"></div></div>
<script>setTimeout(function(){window.__nlpRegDraw(function(){
var T=window.__nlpChartTheme();
var k=["GPT-2","BERT-mBERT","BERTurk","Llama-3","GPT-4 (cl100k)","GPT-4o (o200k)"];
var v=[78,52,28,41,48,37];
var colors=k.map(function(n,i){return i===2?T.accent:"#8aa4ff";});
var t1={x:k,y:v,type:"bar",marker:{color:colors},text:v.map(String),textposition:"outside"};
var layout={xaxis:{color:T.text,gridcolor:T.grid,tickangle:-12},yaxis:{color:T.text,gridcolor:T.grid,title:"Token count"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:80,l:60}};
if(document.getElementById("plot-nlp13-tokcount-en"))Plotly.newPlot("plot-nlp13-tokcount-en",[t1],layout,{responsive:true,displayModeBar:false});
});},250)</script>
<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> The same 24-word Turkish paragraph yields 28-78 tokens depending on tokenizer. BERTurk (highlighted bar) is most efficient because it was trained on Turkish. GPT-2, English-centric, almost shreds Turkish byte by byte. OpenAI's newer o200k is 23% more efficient than cl100k — meaning GPT-4o offers a real cost advantage for Turkish content.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Batch cost projection on tweets.csv<button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> tiktoken

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/tweets.csv"</span>)   <span class="cm"># 300 Turkish tweets</span>
enc = tiktoken.<span class="fn">get_encoding</span>(<span class="str">"o200k_base"</span>)

df[<span class="str">"n_token"</span>] = df[<span class="str">"text"</span>].<span class="fn">apply</span>(<span class="kw">lambda</span> t: <span class="fn">len</span>(enc.<span class="fn">encode</span>(<span class="kw">str</span>(t))))
total = <span class="kw">int</span>(df[<span class="str">"n_token"</span>].<span class="fn">sum</span>())
mean  = <span class="kw">float</span>(df[<span class="str">"n_token"</span>].<span class="fn">mean</span>())

<span class="fn">print</span>(<span class="str">f"Total tokens   : {total}"</span>)
<span class="fn">print</span>(<span class="str">f"Mean per tweet : {mean:.1f}"</span>)
<span class="cm"># Project to 1M tweets</span>
price_per_mil = <span class="num">2.50</span>   <span class="cm"># $/1M tokens (example, GPT-4o input)</span>
<span class="fn">print</span>(<span class="str">f"1M tweets ~ \$\{1_000_000 / 300 * total / 1_000_000 * price_per_mil:.2f\}"</span>)</code></pre></div>

<p class="l-text">A small calculation grounds the math of tokenization × pricing in reality. Any feature you add later (system prompt, RAG context, few-shot examples) multiplies on top of this baseline.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. The 2026 Landscape and Tomorrow's Tokenizers</h2>

<p class="l-text">Today, in production, tokenizer choice mostly comes bundled with model choice. The landscape:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">OpenAI family</div><div class="card-body">tiktoken — o200k_base is default (GPT-4o, o1, o3, o4). cl100k only for legacy GPT-4-turbo.</div></div>
<div class="calc-card"><div class="card-title">Anthropic Claude</div><div class="card-body">Not publicly disclosed; a byte-level BPE variant. Use <code>client.beta.messages.count_tokens()</code> for accurate counts.</div></div>
<div class="calc-card"><div class="card-title">Llama / Mistral / Qwen</div><div class="card-body">SentencePiece-based, BPE or Unigram. Llama 3 switched to BPE with 128k vocab.</div></div>
<div class="calc-card"><div class="card-title">Google Gemini / Gemma</div><div class="card-body">SentencePiece. Gemma 2's vocab is 256k — the largest multilingual vocabulary to date.</div></div>
<div class="calc-card"><div class="card-title">BERT / RoBERTa family</div><div class="card-body">WordPiece (BERT), BPE (RoBERTa). Still standard for classification tasks.</div></div>
<div class="calc-card"><div class="card-title">Is character-level returning?</div><div class="card-body">ByT5, CANINE and similar character/byte models are gaining traction. Mamba/SSM architectures escape O(n²) cost, making character-level viable again.</div></div>
</div>

<h3 class="l-subtitle">What's on the horizon</h3>

<ul class="l-list">
<li><strong>Learned tokenization:</strong> The tokenizer itself may become a differentiable component trained jointly with the model. Early research (LCM, byte latent transformer) points this way.</li>
<li><strong>Multimodal tokenizer:</strong> A shared vocabulary for image, audio and text. CLIP is one form; VQ-VAE and speech tokens push further.</li>
<li><strong>Tokenizer-free models:</strong> ByT5, CANINE, MEGABYTE — operate directly on bytes. Currently inefficient, but Mamba-style backbones may change that.</li>
<li><strong>Vocab swap:</strong> Retargeting a pretrained model's vocabulary to a new language. Could cut Turkish costs by 30%+.</li>
</ul>

<h3 class="l-subtitle">Practical advice — apply today</h3>

<ol class="l-list">
<li>For API cost estimates <strong>always</strong> measure with the actual tokenizer on the actual text. Character counts mislead.</li>
<li>For Turkish zero-shot prompts, keep instructions <em>short and keyword-heavy</em> — unnecessary inflection inflates token counts.</li>
<li>Training your own model? Start with SentencePiece + Unigram, 32-64k vocab, character_coverage=1.0.</li>
<li>For BERT-style classification, use BERTurk or XLM-R; mBERT only as last resort.</li>
<li>Token counts directly determine usable capacity of long-context models (128k+) — Turkish gets less than half the practical context window of English.</li>
</ol>

<div class="calc-highlight"><strong>What you learned:</strong> Tokenization is NLP's invisible-yet-decisive layer. We saw why word and character extremes both fail. BPE's merge table, WordPiece's likelihood gain, Unigram's pruning logic, and SentencePiece's pre-tokenization-free framework — each with concrete algorithms. We covered how byte-level BPE eliminates UNK, measured the cl100k vs o200k gap in tiktoken, and observed up to 2.8x token-count variance for the same Turkish text. That variance is your bill and your latency. The 2026 production landscape, and a glimpse at tokenizer-free futures. <a href="/tutorials/ai/nlp/reasoning-models">Next lesson</a> goes deeper.</div>
</div>`

};
