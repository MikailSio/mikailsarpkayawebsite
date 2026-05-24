/* dl-new-L9.js — Deep Learning Lesson 9: Attention & Transformers (TR + EN) */
var DL_L9 = {

tr:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> 2017 itibarıyla derin öğrenmenin merkezi: <strong>Attention</strong> mekanizması ve <strong>Transformer</strong> mimarisi. Query-Key-Value zihniyeti, scaled dot-product attention, multi-head attention, positional encoding, encoder-decoder yapısı. BERT ve GPT\'nin yapı taşları. PyTorch ile küçük bir Transformer encoder block.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>RNN\'in paralelleştirilemeyen ve uzun mesafe sorunlarını teşhis edeceksin</li><li>Q-K-V projeksiyonlarıyla scaled dot-product attention\'ı çıkaracaksın</li><li>Multi-head attention\'ın farklı temsil alt-uzaylarını niye yakaladığını açıklayacaksın</li><li>Sinüs/kosinüs positional encoding ekleyip sıra bilgisini geri kazandıracaksın</li><li>PyTorch ile bir Transformer encoder bloğunu sıfırdan kuracaksın</li></ul></div>'

+ '<h2 class="l-title">1. RNN\'in İki Sorunu</h2>'

+ '<p class="l-text"><a href="/tutorials/deep/8">Ders 8</a>\'de RNN/LSTM\'i gördük. İki temel kısıtı var:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Sıralı hesap:</strong> h<sub>t</sub>\'yi hesaplamak için h<sub>t-1</sub> gerekir. Paralelleştirilemez. GPU verimsiz.</li>'
+ '<li><strong>Uzun-mesafe bağımlılık:</strong> LSTM\'in cell state\'i bilgiyi taşıyabilse de, sırayı sırayla geçmek bilgiyi kaçınılmaz olarak bulanıklaştırır.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Bir başka fikir mümkün mü?</strong> Sırayı sırayla geçmek yerine, her token\'ın doğrudan diğer her token\'a bakmasını sağla. <em>"Bu cümlede her kelime için, hangi diğer kelimelere ne kadar dikkat edeyim?"</em> Bu sorunun cevabı attention mekanizmasıdır.</p>'

+ '<h2 class="l-title">2. Attention\'ın Sezgisi — Q, K, V</h2>'

+ '<p class="l-text">Düşün: bir veritabanı sorgusu yapıyorsun. Üç şey var:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Query (Q)</div><div class="card-body">"Ne arıyorum?" — sorgu vektörü.</div></div>'
+ '<div class="calc-card"><div class="card-title">Key (K)</div><div class="card-body">"Hangi kayıtlar var?" — her elemanın anahtarı.</div></div>'
+ '<div class="calc-card"><div class="card-title">Value (V)</div><div class="card-body">"Kayıt ne içeriyor?" — gerçek içerik.</div></div>'
+ '</div>'

+ '<p class="l-text">Q ile K\'leri karşılaştır → her K için bir <em>uyum skoru</em>. Skorları softmax ile olasılığa çevir → ağırlıklar. V\'leri bu ağırlıklarla topla → çıktı. Yumuşak (differentiable) bir veritabanı sorgusu.</p>'

+ '<p class="l-text">Self-attention\'da Q, K, V <em>aynı sıradan</em> türetilir — her token kendi Q\'sunu üretir, ama tüm token\'ların K ve V\'lerine bakar. "Cümledeki her kelime, diğer her kelimenin ne ifade ettiğine bakarak kendini güncellesin."</p>'

+ '<h2 class="l-title">3. Scaled Dot-Product Attention — Formül</h2>'

+ '<div class="calc-highlight">📘 <strong>Teori evi:</strong> <a href="/tutorials/nlp/10">NLP Dersi 10 — Transformer & BERT</a> attention mekanizmasını NLP bağlamında ilk prensiplerden türetir. Bu ders deep learning perspektifinden mimari görünümü verir.</div>'

+ '<div class="katex-block">$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right) V$$</div>'

+ '<p class="l-text">Adım adım:</p>'

+ '<ol class="l-list" style="padding-left:1.5em">'
+ '<li><em>QK<sup>⊤</sup></em>: Her query her key ile çarpılır → (n × n) skor matrisi. Yüksek değer = çok benziyor.</li>'
+ '<li>√d<sub>k</sub>\'ya böl: Boyut büyüdükçe dot-product\'lar büyür, softmax\'i çok keskin yapar; bu bölme ile dengelenir.</li>'
+ '<li>Softmax: Her satır toplamı 1 olan ağırlıklar.</li>'
+ '<li>V ile çarp: Ağırlıklı toplam → her token için yeni temsil.</li>'
+ '</ol>'

+ '<div class="calc-example"><div class="example-label">SAYISAL ÖRNEK</div><div class="example-body">'
+ '<p class="l-text">3 token, d<sub>k</sub> = 2 olsun:</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'Q = [[1, 0], [0, 1], [1, 1]], &nbsp; K = [[1, 0], [0, 1], [1, 1]], &nbsp; V = [[10, 0], [0, 10], [5, 5]]'
+ '<br>'
+ '<br>QK^T = [[1, 0, 1], [0, 1, 1], [1, 1, 2]]'
+ '<br>Bölü √2 ≈ [[0.71, 0, 0.71], [0, 0.71, 0.71], [0.71, 0.71, 1.41]]'
+ '<br>'
+ '<br>Softmax (satır bazında):'
+ '<br>&nbsp;&nbsp;Satır 1: [0.42, 0.21, 0.42]'
+ '<br>&nbsp;&nbsp;Satır 3: [0.24, 0.24, 0.49]'
+ '<br>'
+ '<br>Çıktı = ağırlıklar · V — her satır V\'lerin ağırlıklı ortalaması.'
+ '</p>'
+ '</div></div>'

+ '<h2 class="l-title">4. Self-Attention Adım Adım</h2>'

+ '<p class="l-text">Bir cümle: "Bu film harika". 3 token. Her birinin embedding\'i d=4 boyutlu olsun. Self-attention:</p>'

+ '<ol class="l-list" style="padding-left:1.5em">'
+ '<li><strong>Üç projeksiyon:</strong> Aynı embedding matris X\'ten üç farklı lineer dönüşümle Q, K, V çıkar — <em>Q = XW<sub>Q</sub>, K = XW<sub>K</sub>, V = XW<sub>V</sub></em>. <em>W</em> matrisleri öğrenilir.</li>'
+ '<li><strong>Skor hesabı:</strong> Yukarıdaki formül.</li>'
+ '<li><strong>Çıktı:</strong> Her token için yeni temsil — bu bağlam içinde "harika"nın anlamı, "film"in anlamı vs.</li>'
+ '</ol>'

+ '<p class="l-text"><strong>Niye işe yarar?</strong> "Bank" kelimesi "river bank"\'te bir şey, "investment bank"\'te başka bir şey. Self-attention bağlamı doğrudan içeri alır — token kendi temsiline diğer token\'ların bilgisini katar.</p>'

+ '<h2 class="l-title">5. Multi-Head Attention</h2>'

+ '<p class="l-text">Tek bir attention head bir tür ilişkiyi öğrenir. Birden çok head paralel çalışırsa, farklı türdeki ilişkileri (sözdizimsel, anlamsal, koreferans) ayrı ayrı yakalayabilirler.</p>'

+ '<div class="katex-block">$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W_O$$</div>'

+ '<p class="l-text">Her head: kendi <em>W<sub>Q</sub><sup>i</sup>, W<sub>K</sub><sup>i</sup>, W<sub>V</sub><sup>i</sup></em> ile küçük boyutlu (d<sub>k</sub> = d/h) attention. Sonra hepsini birleştir ve <em>W<sub>O</sub></em> ile karıştır. Tipik: d=512, h=8, d<sub>k</sub>=64.</p>'

+ '<h2 class="l-title">6. Positional Encoding — Sıra Bilgisi Nereden Geliyor?</h2>'

+ '<p class="l-text">Self-attention <em>permutation-invariant</em>: cümleyi karıştırırsan aynı çıktıyı alırsın (set işlemi). Ama dil sıralıdır. Çözüm: token embedding\'lerine konum bilgisi ekle.</p>'

+ '<p class="l-text"><strong>Sinüsoidal (orijinal Transformer):</strong></p>'

+ '<div class="katex-block">$$PE(\\text{pos}, 2i) = \\sin\\left(\\frac{\\text{pos}}{10000^{2i/d}}\\right), \\quad PE(\\text{pos}, 2i+1) = \\cos\\left(\\frac{\\text{pos}}{10000^{2i/d}}\\right)$$</div>'

+ '<p class="l-text">Her konuma deterministik bir vektör. Embedding\'e eklenir, model konum bilgisini öğrenir.</p>'

+ '<p class="l-text"><strong>Modern alternatifler:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>Learned positional embeddings:</strong> BERT\'te kullanılır. Her konuma öğrenilebilir vektör. Sabit max uzunlukta.</li>'
+ '<li><strong>Rotary Position Embedding (RoPE):</strong> LLaMA, GPT-NeoX. Q ve K\'ya dönme matrisi uygula. Daha uzun sıralarda iyi genelleyebilir.</li>'
+ '<li><strong>ALiBi:</strong> Skoru pozisyon farkıyla cezalandır. Eğitim uzunluğunun ötesine genişletilebilir.</li>'
+ '</ul>'

+ '<h2 class="l-title">7. Transformer Encoder Block</h2>'

+ '<p class="l-text">Bir Transformer bloğu iki alt-katmandan oluşur: multi-head self-attention + feed-forward network (FFN). Her ikisi de skip connection ve LayerNorm ile sarılır.</p>'

+ '<div class="katex-block">$$x\' = \\text{LayerNorm}(x + \\text{MultiHeadAttention}(x))$$</div>'
+ '<div class="katex-block">$$x\'\' = \\text{LayerNorm}(x\' + \\text{FFN}(x\'))$$</div>'

+ '<p class="l-text"><strong>FFN:</strong> İki lineer katman + GELU aktivasyon. Tipik genişleme: d → 4d → d. <em>"Her token için bağımsız MLP"</em> — pozisyon bilgisi attention\'dan, lokal hesap FFN\'den.</p>'

+ '<p class="l-text"><strong>Skip connection</strong> (Ders 6\'daki ResNet fikri) gradyan akışını sağlar. <strong>LayerNorm</strong> (Ders 5) aktivasyonları stabilize eder.</p>'

+ '<h2 class="l-title">8. PyTorch ile Encoder Block</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="kw">class</span> <span class="fn">TransformerBlock</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, d_model=<span class="num">512</span>, n_heads=<span class="num">8</span>, d_ff=<span class="num">2048</span>, dropout=<span class="num">0.1</span>):\n        <span class="fn">super</span>().<span class="fn">__init__</span>()\n        <span class="kw">self</span>.attn = nn.<span class="fn">MultiheadAttention</span>(d_model, n_heads, dropout=dropout, batch_first=<span class="kw">True</span>)\n        <span class="kw">self</span>.ffn = nn.<span class="fn">Sequential</span>(\n            nn.<span class="fn">Linear</span>(d_model, d_ff),\n            nn.<span class="fn">GELU</span>(),\n            nn.<span class="fn">Dropout</span>(dropout),\n            nn.<span class="fn">Linear</span>(d_ff, d_model),\n        )\n        <span class="kw">self</span>.ln1 = nn.<span class="fn">LayerNorm</span>(d_model)\n        <span class="kw">self</span>.ln2 = nn.<span class="fn">LayerNorm</span>(d_model)\n        <span class="kw">self</span>.drop = nn.<span class="fn">Dropout</span>(dropout)\n\n    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, mask=<span class="kw">None</span>):\n        <span class="cm"># Self-attention + residual + LN</span>\n        attn_out, _ = <span class="kw">self</span>.<span class="fn">attn</span>(x, x, x, attn_mask=mask)\n        x = <span class="kw">self</span>.<span class="fn">ln1</span>(x + <span class="kw">self</span>.<span class="fn">drop</span>(attn_out))\n        <span class="cm"># FFN + residual + LN</span>\n        ffn_out = <span class="kw">self</span>.<span class="fn">ffn</span>(x)\n        x = <span class="kw">self</span>.<span class="fn">ln2</span>(x + <span class="kw">self</span>.<span class="fn">drop</span>(ffn_out))\n        <span class="kw">return</span> x</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Tek Transformer bloğu. <code>nn.MultiheadAttention</code> Q=K=V=x ile self-attention yapar (PyTorch\'un yerleşik implementasyonu). Sonra residual + LayerNorm. Aynısı FFN için. Bunları üst üste yığ → Transformer encoder.</p>'

+ '<p class="l-text"><strong>Not — pre-LN vs post-LN:</strong> Yukarıdaki "post-LN" — orijinal makale. Modern modeller "pre-LN" kullanır: LN\'i alt-katman <em>öncesi</em> uygula. Daha stabil eğitim, warmup\'a daha az ihtiyaç.</p>'

+ '<h2 class="l-title">9. Encoder vs Decoder</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Encoder-only (BERT)</div><div class="card-body">Bidirectional self-attention — her token tüm token\'lara bakar. Sınıflandırma, NER, QA. Anlama görevleri.</div></div>'
+ '<div class="calc-card"><div class="card-title">Decoder-only (GPT)</div><div class="card-body">Causal mask — token sadece kendi ve önceki token\'lara bakar. Üretim, dil modelleme. Tüm modern LLM\'ler.</div></div>'
+ '<div class="calc-card"><div class="card-title">Encoder-Decoder (T5, BART)</div><div class="card-body">Encoder: kaynağı işle. Decoder: hedefi üret + encoder\'dan cross-attention. Çeviri, özetleme.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Causal mask:</strong> Decoder\'da pozisyon i, sadece j ≤ i pozisyonlarına bakabilsin. Attention skor matrisinde üst üçgeni -∞ yap → softmax sonrası 0 → "geleceği görme".</p>'

+ '<h2 class="l-title">10. Karmaşıklık Analizi</h2>'

+ '<div class="katex-block">$$\\text{Self-Attention: } O(n^2 \\cdot d), \\quad \\text{RNN: } O(n \\cdot d^2)$$</div>'

+ '<p class="l-text"><em>n</em> = sıra uzunluğu, <em>d</em> = model boyutu. Kısa sıralarda Transformer hızlı (paralelleştirilebilir, matris çarpımı). Ama <em>n</em> büyüdükçe (örn. uzun belge) <em>n²</em> baskın olur — quadratic bottleneck.</p>'

+ '<p class="l-text"><strong>Çözüm araştırmaları:</strong> Sparse attention (Longformer, BigBird), linearized attention (Performer), Flash Attention (memory-efficient). Modern LLM\'ler 100k+ token bağlamı bu sayede idare ediyor.</p>'

+ '<h2 class="l-title">11. BERT ve GPT — Özet</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">BERT (2018)</div><div class="card-body">12-24 katman encoder. <strong>Masked LM:</strong> Token\'ların %15\'ini maskele, modelden tahmin et. Sonra fine-tune. NER, sentiment, QA için altın standart oldu.</div></div>'
+ '<div class="calc-card"><div class="card-title">GPT serisi</div><div class="card-body">12-96+ katman decoder-only. <strong>Next-token prediction:</strong> Sıradaki kelimeyi tahmin et. Boyut artırıldıkça emergent yetenekler (zero-shot, few-shot, reasoning).</div></div>'
+ '<div class="calc-card"><div class="card-title">T5 (2020)</div><div class="card-body">Her görevi text-to-text formatına dönüştür. Tek bir encoder-decoder her görevi yapar.</div></div>'
+ '<div class="calc-card"><div class="card-title">ViT (2020)</div><div class="card-body">Vision Transformer. Görüntüyü 16×16 yamalara böl, sıra olarak Transformer\'a ver. CNN\'lere ciddi rakip.</div></div>'
+ '</div>'

+ '<h2 class="l-title">12. Pratik İpuçları</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Sıfırdan eğitme.</strong> Pretrained model yükle, fine-tune et (Ders 7). HuggingFace Transformers kütüphanesi bunu tek satır yapar.</li>'
+ '<li><strong>AdamW + warmup + cosine LR</strong> Transformer için standart (Ders 4).</li>'
+ '<li><strong>Mixed precision (fp16/bf16)</strong> ile 2× hız + yarı bellek.</li>'
+ '<li><strong>Flash Attention</strong> kullan — büyük modellerde bellek darboğazını çözer.</li>'
+ '<li><strong>Causal görevde</strong> dropout sadece attention sonrası, FFN içi 0.1 yeterli.</li>'
+ '</ul>'

+ '<div class="think-box"><strong>📌 Özetle:</strong> Attention = öğrenilebilir, paralelleştirilebilir, uzun-mesafeli ilişkiler. Transformer = self-attention + FFN + residual + LN bloklarından oluşan mimari. BERT (encoder), GPT (decoder), T5 (encoder-decoder) — modern AI\'nın çekirdeği. <strong>Bir sonraki ders: Generative Modeller.</strong> VAE, GAN, Diffusion — yeni veri üretmek için tasarlanmış mimariler.</div>'

,

en:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn in this lesson:</strong> The center of deep learning since 2017: the <strong>attention</strong> mechanism and the <strong>Transformer</strong> architecture. The Query-Key-Value mindset, scaled dot-product attention, multi-head attention, positional encoding, encoder-decoder structure. The building blocks of BERT and GPT. A small Transformer encoder block in PyTorch.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 IN THIS LESSON YOU WILL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Diagnose RNN\'s non-parallelizable and long-range issues</li><li>Derive scaled dot-product attention with Q-K-V projections</li><li>Explain why multi-head attention captures different representation subspaces</li><li>Add sine/cosine positional encoding to recover sequence information</li><li>Build a Transformer encoder block from scratch with PyTorch</li></ul></div>'

+ '<h2 class="l-title">1. Two Problems with the RNN</h2>'

+ '<p class="l-text">In <a href="/tutorials/deep/8">Lesson 8</a> we saw RNN/LSTM. They have two core limitations:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Sequential computation:</strong> To compute h<sub>t</sub> you need h<sub>t-1</sub>. Not parallelizable. Inefficient on GPUs.</li>'
+ '<li><strong>Long-range dependency:</strong> Even though the LSTM\'s cell state can carry information, walking the sequence step by step inevitably blurs information.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Is another idea possible?</strong> Instead of going through the sequence step by step, let every token look directly at every other token. <em>"For each word in this sentence, how much attention should I pay to which other words?"</em> The answer to this question is the attention mechanism.</p>'

+ '<h2 class="l-title">2. Intuition for Attention — Q, K, V</h2>'

+ '<p class="l-text">Think of it like a database query. There are three things:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Query (Q)</div><div class="card-body">"What am I looking for?" — query vector.</div></div>'
+ '<div class="calc-card"><div class="card-title">Key (K)</div><div class="card-body">"Which records exist?" — key for each element.</div></div>'
+ '<div class="calc-card"><div class="card-title">Value (V)</div><div class="card-body">"What does the record contain?" — actual content.</div></div>'
+ '</div>'

+ '<p class="l-text">Compare Q with each K → an <em>affinity score</em> for every K. Turn the scores into probabilities with softmax → weights. Combine the Vs with these weights → output. A soft (differentiable) database query.</p>'

+ '<p class="l-text">In self-attention Q, K, V are derived from the <em>same sequence</em> — each token produces its own Q, but looks at the K and V of all tokens. "Each word in the sentence updates itself by looking at what every other word means."</p>'

+ '<h2 class="l-title">3. Scaled Dot-Product Attention — Formula</h2>'

+ '<div class="calc-highlight">📘 <strong>The home of the theory:</strong> <a href="/tutorials/nlp/10">NLP Lesson 10 — Transformer & BERT</a> derives the attention mechanism from first principles in the NLP context. This lesson gives the architectural view from the deep learning perspective.</div>'

+ '<div class="katex-block">$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right) V$$</div>'

+ '<p class="l-text">Step by step:</p>'

+ '<ol class="l-list" style="padding-left:1.5em">'
+ '<li><em>QK<sup>⊤</sup></em>: every query is multiplied with every key → an (n × n) score matrix. High value = very similar.</li>'
+ '<li>Divide by √d<sub>k</sub>: as the dimension grows the dot-products grow, making softmax very peaky; this division balances it out.</li>'
+ '<li>Softmax: weights with each row summing to 1.</li>'
+ '<li>Multiply by V: weighted sum → a new representation for each token.</li>'
+ '</ol>'

+ '<div class="calc-example"><div class="example-label">NUMERICAL EXAMPLE</div><div class="example-body">'
+ '<p class="l-text">Let 3 tokens, d<sub>k</sub> = 2:</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ 'Q = [[1, 0], [0, 1], [1, 1]], &nbsp; K = [[1, 0], [0, 1], [1, 1]], &nbsp; V = [[10, 0], [0, 10], [5, 5]]'
+ '<br>'
+ '<br>QK^T = [[1, 0, 1], [0, 1, 1], [1, 1, 2]]'
+ '<br>Divided by √2 ≈ [[0.71, 0, 0.71], [0, 0.71, 0.71], [0.71, 0.71, 1.41]]'
+ '<br>'
+ '<br>Softmax (per row):'
+ '<br>&nbsp;&nbsp;Row 1: [0.42, 0.21, 0.42]'
+ '<br>&nbsp;&nbsp;Row 3: [0.24, 0.24, 0.49]'
+ '<br>'
+ '<br>Output = weights · V — each row is a weighted average of the Vs.'
+ '</p>'
+ '</div></div>'

+ '<h2 class="l-title">4. Self-Attention Step by Step</h2>'

+ '<p class="l-text">A sentence: "This movie is great". 4 tokens. Let each have a d=4 dim embedding. Self-attention:</p>'

+ '<ol class="l-list" style="padding-left:1.5em">'
+ '<li><strong>Three projections:</strong> From the same embedding matrix X derive Q, K, V via three separate linear transforms — <em>Q = XW<sub>Q</sub>, K = XW<sub>K</sub>, V = XW<sub>V</sub></em>. The <em>W</em> matrices are learned.</li>'
+ '<li><strong>Score computation:</strong> The formula above.</li>'
+ '<li><strong>Output:</strong> A new representation for each token — what "great" means in this context, what "movie" means, etc.</li>'
+ '</ol>'

+ '<p class="l-text"><strong>Why does it work?</strong> The word "bank" means one thing in "river bank" and another in "investment bank". Self-attention pulls the context directly inside — a token mixes the information from other tokens into its own representation.</p>'

+ '<h2 class="l-title">5. Multi-Head Attention</h2>'

+ '<p class="l-text">A single attention head learns one kind of relationship. If multiple heads run in parallel, they can capture different kinds of relationships (syntactic, semantic, coreference) separately.</p>'

+ '<div class="katex-block">$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W_O$$</div>'

+ '<p class="l-text">Each head: small-dim (d<sub>k</sub> = d/h) attention with its own <em>W<sub>Q</sub><sup>i</sup>, W<sub>K</sub><sup>i</sup>, W<sub>V</sub><sup>i</sup></em>. Then concatenate them all and mix with <em>W<sub>O</sub></em>. Typical: d=512, h=8, d<sub>k</sub>=64.</p>'

+ '<h2 class="l-title">6. Positional Encoding — Where Does Order Information Come From?</h2>'

+ '<p class="l-text">Self-attention is <em>permutation-invariant</em>: if you shuffle the sentence you get the same output (a set operation). But language is sequential. The fix: add positional information to the token embeddings.</p>'

+ '<p class="l-text"><strong>Sinusoidal (original Transformer):</strong></p>'

+ '<div class="katex-block">$$PE(\\text{pos}, 2i) = \\sin\\left(\\frac{\\text{pos}}{10000^{2i/d}}\\right), \\quad PE(\\text{pos}, 2i+1) = \\cos\\left(\\frac{\\text{pos}}{10000^{2i/d}}\\right)$$</div>'

+ '<p class="l-text">A deterministic vector for each position. Added to the embedding, the model learns the position information.</p>'

+ '<p class="l-text"><strong>Modern alternatives:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>Learned positional embeddings:</strong> Used in BERT. A learnable vector per position. Fixed max length.</li>'
+ '<li><strong>Rotary Position Embedding (RoPE):</strong> LLaMA, GPT-NeoX. Apply a rotation matrix to Q and K. Generalizes well to longer sequences.</li>'
+ '<li><strong>ALiBi:</strong> Penalize the score by the position difference. Can extend beyond the training length.</li>'
+ '</ul>'

+ '<h2 class="l-title">7. Transformer Encoder Block</h2>'

+ '<p class="l-text">A Transformer block consists of two sub-layers: multi-head self-attention + feed-forward network (FFN). Both are wrapped in a skip connection and LayerNorm.</p>'

+ '<div class="katex-block">$$x\' = \\text{LayerNorm}(x + \\text{MultiHeadAttention}(x))$$</div>'
+ '<div class="katex-block">$$x\'\' = \\text{LayerNorm}(x\' + \\text{FFN}(x\'))$$</div>'

+ '<p class="l-text"><strong>FFN:</strong> Two linear layers + GELU activation. Typical expansion: d → 4d → d. <em>"An independent MLP per token"</em> — position information from attention, local computation from FFN.</p>'

+ '<p class="l-text"><strong>Skip connection</strong> (the ResNet idea from Lesson 6) ensures gradient flow. <strong>LayerNorm</strong> (Lesson 5) stabilizes activations.</p>'

+ '<h2 class="l-title">8. Encoder Block with PyTorch</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="kw">class</span> <span class="fn">TransformerBlock</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, d_model=<span class="num">512</span>, n_heads=<span class="num">8</span>, d_ff=<span class="num">2048</span>, dropout=<span class="num">0.1</span>):\n        <span class="fn">super</span>().<span class="fn">__init__</span>()\n        <span class="kw">self</span>.attn = nn.<span class="fn">MultiheadAttention</span>(d_model, n_heads, dropout=dropout, batch_first=<span class="kw">True</span>)\n        <span class="kw">self</span>.ffn = nn.<span class="fn">Sequential</span>(\n            nn.<span class="fn">Linear</span>(d_model, d_ff),\n            nn.<span class="fn">GELU</span>(),\n            nn.<span class="fn">Dropout</span>(dropout),\n            nn.<span class="fn">Linear</span>(d_ff, d_model),\n        )\n        <span class="kw">self</span>.ln1 = nn.<span class="fn">LayerNorm</span>(d_model)\n        <span class="kw">self</span>.ln2 = nn.<span class="fn">LayerNorm</span>(d_model)\n        <span class="kw">self</span>.drop = nn.<span class="fn">Dropout</span>(dropout)\n\n    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, mask=<span class="kw">None</span>):\n        <span class="cm"># Self-attention + residual + LN</span>\n        attn_out, _ = <span class="kw">self</span>.<span class="fn">attn</span>(x, x, x, attn_mask=mask)\n        x = <span class="kw">self</span>.<span class="fn">ln1</span>(x + <span class="kw">self</span>.<span class="fn">drop</span>(attn_out))\n        <span class="cm"># FFN + residual + LN</span>\n        ffn_out = <span class="kw">self</span>.<span class="fn">ffn</span>(x)\n        x = <span class="kw">self</span>.<span class="fn">ln2</span>(x + <span class="kw">self</span>.<span class="fn">drop</span>(ffn_out))\n        <span class="kw">return</span> x</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> A single Transformer block. <code>nn.MultiheadAttention</code> performs self-attention with Q=K=V=x (PyTorch\'s built-in implementation). Then residual + LayerNorm. Same for FFN. Stack these → a Transformer encoder.</p>'

+ '<p class="l-text"><strong>Note — pre-LN vs post-LN:</strong> The above is "post-LN" — the original paper. Modern models use "pre-LN": apply LN <em>before</em> the sub-layer. More stable training, less need for warmup.</p>'

+ '<h2 class="l-title">9. Encoder vs Decoder</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Encoder-only (BERT)</div><div class="card-body">Bidirectional self-attention — every token sees every token. Classification, NER, QA. Understanding tasks.</div></div>'
+ '<div class="calc-card"><div class="card-title">Decoder-only (GPT)</div><div class="card-body">Causal mask — a token sees only itself and previous tokens. Generation, language modeling. All modern LLMs.</div></div>'
+ '<div class="calc-card"><div class="card-title">Encoder-Decoder (T5, BART)</div><div class="card-body">Encoder: process the source. Decoder: produce the target + cross-attention from the encoder. Translation, summarization.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Causal mask:</strong> In the decoder, position i should only see positions j ≤ i. Set the upper triangle of the attention score matrix to -∞ → after softmax 0 → "do not see the future".</p>'

+ '<h2 class="l-title">10. Complexity Analysis</h2>'

+ '<div class="katex-block">$$\\text{Self-Attention: } O(n^2 \\cdot d), \\quad \\text{RNN: } O(n \\cdot d^2)$$</div>'

+ '<p class="l-text"><em>n</em> = sequence length, <em>d</em> = model dimension. On short sequences the Transformer is fast (parallelizable, matrix multiplication). But as <em>n</em> grows (e.g. long documents) <em>n²</em> dominates — quadratic bottleneck.</p>'

+ '<p class="l-text"><strong>Research toward fixes:</strong> Sparse attention (Longformer, BigBird), linearized attention (Performer), Flash Attention (memory-efficient). Modern LLMs handle 100k+ token contexts thanks to these.</p>'

+ '<h2 class="l-title">11. BERT and GPT — Summary</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">BERT (2018)</div><div class="card-body">12-24 layer encoder. <strong>Masked LM:</strong> Mask 15% of tokens, ask the model to predict them. Then fine-tune. Became the gold standard for NER, sentiment, QA.</div></div>'
+ '<div class="calc-card"><div class="card-title">GPT series</div><div class="card-body">12-96+ layer decoder-only. <strong>Next-token prediction:</strong> Predict the next word. As size scales, emergent abilities (zero-shot, few-shot, reasoning).</div></div>'
+ '<div class="calc-card"><div class="card-title">T5 (2020)</div><div class="card-body">Transform every task into a text-to-text format. A single encoder-decoder does every task.</div></div>'
+ '<div class="calc-card"><div class="card-title">ViT (2020)</div><div class="card-body">Vision Transformer. Split the image into 16×16 patches and feed them as a sequence to a Transformer. A serious rival to CNNs.</div></div>'
+ '</div>'

+ '<h2 class="l-title">12. Practical Tips</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Do not train from scratch.</strong> Load a pretrained model and fine-tune (Lesson 7). The HuggingFace Transformers library does this in one line.</li>'
+ '<li><strong>AdamW + warmup + cosine LR</strong> is standard for Transformers (Lesson 4).</li>'
+ '<li><strong>Mixed precision (fp16/bf16)</strong> gives 2× speed + half the memory.</li>'
+ '<li><strong>Use Flash Attention</strong> — solves the memory bottleneck on large models.</li>'
+ '<li><strong>For causal tasks</strong> dropout only after attention, 0.1 inside FFN is sufficient.</li>'
+ '</ul>'

+ '<div class="think-box"><strong>📌 In summary:</strong> Attention = learnable, parallelizable, long-range relationships. Transformer = an architecture made of self-attention + FFN + residual + LN blocks. BERT (encoder), GPT (decoder), T5 (encoder-decoder) — the core of modern AI. <strong>Next lesson: Generative Models.</strong> VAE, GAN, Diffusion — architectures designed to generate new data.</div>'

};
