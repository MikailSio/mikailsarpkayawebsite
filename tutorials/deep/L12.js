/* dl-new-L12.js — Deep Learning Lesson 12: State Space Models, Mamba & Uzun Bağlam (TR + EN) */
var DL_L12 = {

tr:
'<script>(function(){var g=window;g.__dlChartDrawers=g.__dlChartDrawers||[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Attention\'a alternatif olarak ortaya çıkan <strong>State Space Models</strong> ailesini — S4, Mamba, Mamba-2 ve RWKV. Niye 1 milyon token\'a uzanan bağlamda Transformer\'lar çatlıyor, niye recurrence + convolution ikiliği SSM\'in sırrı, ve <em>selective</em> mekanizmanın Mamba\'yı language modeling\'de Transformer\'a yetiştiren detayı. Saf attention dünyasından, hibrit modellerin (Jamba, Samba) yükselişine.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Attention\'ın O(L²) ve KV-cache maliyetini bir milyon token bağlamında somut sayılarla göreceksin</li><li>Sürekli zamanlı LTI sisteminden ayrık SSM\'e geçişi ve recurrence ↔ convolution ikiliğini kuracaksın</li><li>S4\'ün HIPPO başlatması ve diagonal+low-rank parametrizasyonunu anlayacaksın</li><li>Mamba\'nın <em>selective</em> mekanizmasının (girdiye bağlı A, B, C) niye dönüm noktası olduğunu göreceksin</li><li>Mamba-2, RWKV, Jamba/Zamba2/Samba hibritlerini ve 2026 üretim hatlarındaki yerlerini öğreneceksin</li></ul></div>'

+ '<h2 class="l-title">1. Attention\'ın Kuadratik Faturası</h2>'

+ '<p class="l-text">Transformer\'ın self-attention\'ı, uzunluk <em>L</em>\'lik bir diziyi işlerken <em>L × L</em> büyüklüğünde bir benzerlik matrisi kurar. Sonuç: bellek ve hesap maliyeti <em>L</em>\'nin karesi gibi büyür. 4K bağlamda büyük bir mesele değil; 1M token bağlamda — yeni nesil belge, video, kod tabanı senaryolarında — duvara çarpılır.</p>'

+ '<div class="katex-block">$$\\text{Self-Attention maliyeti} \\;=\\; \\mathcal{O}(L^2 \\cdot d) \\quad\\text{hesap},\\quad \\mathcal{O}(L^2) \\quad\\text{bellek (attention matrisi)}$$</div>'

+ '<p class="l-text">Sayılarla düşünelim: L = 1.000.000, d = 4096. Bir tek attention matrisi <em>L²</em> = 10¹² ≈ 1 trilyon eleman demek. FP16\'da 2 TB. Bunu tek GPU\'da tutmak imkânsız; hatta KV-cache (key, value tampon depoları) bile her token başı O(L · d) ile şişer ve uzun konuşmalarda HBM\'i (GPU\'nun yüksek bant genişlikli belleği) yer.</p>'

+ '<div class="calc-graph" style="height:340px"><div id="plot-dl12-cost-tr"></div></div>'

+ '<script>setTimeout(function(){(function(){function draw(){if(!window.Plotly||!document.getElementById("plot-dl12-cost-tr"))return;var th=window.__dlChartTheme();var L=[];for(var i=10;i<=20;i++){L.push(Math.pow(2,i));}var att=L.map(function(x){return x*x/1e6;});var mam=L.map(function(x){return x/1e3;});Plotly.newPlot("plot-dl12-cost-tr",[{x:L,y:att,name:"Attention O(L²)",mode:"lines+markers",line:{color:"#ff6b6b",width:3}},{x:L,y:mam,name:"Mamba O(L)",mode:"lines+markers",line:{color:th.accent,width:3}}],{title:{text:"Hesap maliyeti — token sayısına göre (göreli birim, log-log)",font:{color:th.text,size:13}},xaxis:{title:"Bağlam uzunluğu L (token)",type:"log",color:th.text,gridcolor:th.grid},yaxis:{title:"Maliyet (göreli birim)",type:"log",color:th.text,gridcolor:th.grid},paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},legend:{font:{color:th.text}},margin:{t:60,r:20,b:60,l:60},height:320},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();},250);</script>'

+ '<p class="l-text">Eğri okuması basit: attention\'ın faturası logaritmik eksende bile yukarı kaçar. Mamba\'da maliyet düz bir doğrudur. 16K token civarına kadar fark görünmez; 256K\'da fark 1000×\'e ulaşır. Uzun bağlam dünyasında bu fark gerçek paradır.</p>'

+ '<h2 class="l-title">2. RNN\'ler Niye Yeterli Değildi?</h2>'

+ '<p class="l-text">"O zaman eski RNN\'lere dönelim" diyebilirsin — onlar zaten O(L) maliyetle çalışıyordu. Ama RNN\'in iki kanayan yarası vardı:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Sıralı eğitim:</strong> Adım <em>t</em>\'nin durumu adım <em>t-1</em>\'e bağlı. Tüm zaman ekseni boyunca paralelleştiremezsin; GPU\'nun gücünü kullanamazsın.</li>'
+ '<li><strong>Vanishing/exploding gradient:</strong> Gradyan <em>L</em> adım geriye yayılırken matris çarpımları sıfıra ya da sonsuza patlar. LSTM ve GRU kısmen kurtardı ama 1000+ token bağlamlarda hâlâ zayıftı.</li>'
+ '<li><strong>Sabit boyut darboğazı:</strong> Tüm geçmiş tek bir gizli vektöre sıkışır; uzun, çeşitli içerikte bilgi kaybı kaçınılmaz.</li>'
+ '</ul>'

+ '<p class="l-text">Transformer 2017\'de tam da bu üç sorunu kırdı: paralel eğitim, doğrudan token-token bağlantı, sabit derinlik. Bedel: kuadratik maliyet. SSM\'in vaadi: RNN\'in lineer maliyetini geri getir, ama paralel eğitilebilir ve uzun bağlamda stabil kalsın.</p>'

+ '<h2 class="l-title">3. State Space Model\'in Çıplak Hâli</h2>'

+ '<p class="l-text">Kontrol teorisinden gelen klasik formülasyon. Sürekli zamanda bir Lineer Zaman-Değişmez (LTI) sistem:</p>'

+ '<div class="katex-block">$$x\'(t) = A\\,x(t) + B\\,u(t)$$</div>'
+ '<div class="katex-block">$$y(t) = C\\,x(t) + D\\,u(t)$$</div>'

+ '<p class="l-text">Sezgi: <em>x(t)</em> sistemin "gizli durumu" (hidden state), <em>u(t)</em> girdi, <em>y(t)</em> çıktı. Matris <em>A</em> belleğin nasıl bozunduğunu/aktığını söyler; <em>B</em> yeni girdiyi durumla nasıl karıştırır; <em>C</em> durumdan çıktıya nasıl projeksiyon yapar.</p>'

+ '<p class="l-text">Diziyle çalışmak için zamanı ayrıklaştırırız. Adım büyüklüğü <em>Δ</em> ile zero-order hold (ZOH) ayrıklaştırması:</p>'

+ '<div class="katex-block">$$\\bar{A} = \\exp(\\Delta A), \\qquad \\bar{B} = (\\Delta A)^{-1}(\\exp(\\Delta A) - I)\\cdot \\Delta B$$</div>'

+ '<p class="l-text">Bu ayrık formdaki sistemi iki şekilde okuyabilirsin — ve bu ikilik SSM\'in sırrıdır:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Recurrence görünümü (inference için)</div><div class="card-body"><code>x_k = Ā·x_{k-1} + B̄·u_k</code>, <code>y_k = C·x_k</code>. RNN gibi adım adım, token başı O(1) bellek, O(1) hesap. Streaming inference için ideal.</div></div>'
+ '<div class="calc-card"><div class="card-title">Convolution görünümü (training için)</div><div class="card-body"><code>y = K * u</code>; çekirdek <code>K = (CB̄, CĀB̄, CĀ²B̄, ...)</code>. Tüm dizi tek seferde, FFT ile O(L log L), GPU\'da paralel.</div></div>'
+ '</div>'

+ '<p class="l-text">Aynı sistem, eğitimde konvolüsyon (paralel, hızlı), çıkarımda recurrence (sabit bellek, akış dostu). Transformer ne bir uçta ne öbüründe tam buna sahiptir.</p>'

+ '<h2 class="l-title">4. S4 — Yapısal SSM\'in Doğuşu</h2>'

+ '<p class="l-text">2022\'de Albert Gu, Karan Goel ve Christopher Ré\'nin S4\'ü (Structured State Space for Sequences) saf SSM\'i kullanışlı kıldı. İki kritik fikir:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">HIPPO başlatması</div><div class="card-body">A matrisini rastgele değil, sürekli sinyali Legendre/Laguerre polinomlarına izdüşürecek şekilde başlat (HIPPO-LegS). Sonuç: durum, geçmişin sıkıştırılmış optimal hatıralanması olur. Uzun bağlam yapısal olarak teşvik edilir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Diagonal Plus Low-Rank (DPLR)</div><div class="card-body">A\'yı tam matris yerine "diagonal + düşük ranklı düzeltme" olarak parametrize et. Üs alma <code>exp(ΔA)</code> ucuz, FFT konvolüsyonu pratikleşir, kararlılık korunur.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Sonuç:</strong> Long Range Arena (LRA) benchmark\'ı — 1K-16K uzunlukta görev seti — Transformer\'ları açık ara geride bıraktı. Path-X gibi 16K uzunluktaki görsel görevde Transformer\'ın rastgele tahmine düştüğü yerde S4 %88 doğruluk yakaladı. Akademi şoke oldu.</p>'

+ '<p class="l-text">Ama bir eksik vardı: S4 sabit dinamiklere sahip — her token aynı <em>A, B, C</em>\'yle ezilir. Dil modelinde "the" ile "<u>kâhin</u>" aynı işlemden geçemez. İçeriğe bağlı seçicilik gerekiyor.</p>'

+ '<h2 class="l-title">5. Mamba — Selective SSM</h2>'

+ '<p class="l-text">Aralık 2023, Albert Gu & Tri Dao. Tek satırlık değişiklik, jenerasyon değiştirdi: <strong><em>B, C</em> ve adım <em>Δ</em>\'yı girdiye bağlı yap</strong>. Yani her token kendi süzgeçini seçer. Sistem artık LTI değil, "selective".</p>'

+ '<div class="katex-block">$$B_k = \\text{Linear}_B(u_k),\\quad C_k = \\text{Linear}_C(u_k),\\quad \\Delta_k = \\text{softplus}(\\text{Linear}_\\Delta(u_k))$$</div>'

+ '<p class="l-text">Bu masum görünen değişikliğin bedeli: <em>Δ, B, C</em> artık zamana göre değişiyor, yani konvolüsyon görünümü kaybolur. Eğitim için tek umut recurrence — ama recurrence sıralıdır, GPU\'yu yarımsöndürür. Mamba\'nın gerçek mucizesi <strong>donanım-bilinçli paralel scan</strong>:</p>'

+ '<ul class="l-list">'
+ '<li>İlişkili (associative) bir operatör tanımla — recurrence\'ı prefix-sum gibi tree-reduce ile O(log L) derinlikte hesapla.</li>'
+ '<li>Tüm hesabı SRAM\'de tut (GPU\'nun en hızlı, en küçük belleği). Ara durumları HBM\'e yazma — sadece gerektiğinde recomputation\'la geri al.</li>'
+ '<li>CUDA kernel\'i token-token paralel; uzunluk-blok-paralel hesap. A100\'de FlashAttention\'la kıyaslanabilir verim.</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (mamba-ssm)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># pip install mamba-ssm causal-conv1d</span>\n<span class="kw">import</span> torch\n<span class="kw">from</span> mamba_ssm <span class="kw">import</span> Mamba\n\nbatch, length, dim = <span class="num">2</span>, <span class="num">8192</span>, <span class="num">512</span>\nx = torch.<span class="fn">randn</span>(batch, length, dim).<span class="fn">cuda</span>()\n\nblock = <span class="fn">Mamba</span>(\n    d_model=dim,\n    d_state=<span class="num">16</span>,        <span class="cm"># gizli durum boyutu N</span>\n    d_conv=<span class="num">4</span>,          <span class="cm"># yerel konvolüsyon penceresi</span>\n    expand=<span class="num">2</span>,          <span class="cm"># iç genişleme oranı</span>\n).<span class="fn">cuda</span>()\n\ny = <span class="fn">block</span>(x)        <span class="cm"># (2, 8192, 512) — aynı şekil</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Pratik mesele:</strong> Mamba bir <em>blok</em>; Transformer\'daki self-attention bloğunun yerine geçer. Tipik bir Mamba modeli onlarca böyle bloğu üst üste yığar, araya RMSNorm + residual koyar. 130M-2.8B parametre aralığında, Mamba aynı boyut Transformer\'a karşı eşit-veya-üstün perplexity verdi — ve 5× daha hızlı çıkarım yaptı.</p>'

+ '<div class="calc-graph" style="height:340px"><div id="plot-dl12-perplexity-tr"></div></div>'

+ '<script>setTimeout(function(){(function(){function draw(){if(!window.Plotly||!document.getElementById("plot-dl12-perplexity-tr"))return;var th=window.__dlChartTheme();var L=[1024,2048,4096,8192,16384,32768,65536,131072];var trf=[12.4,11.9,11.6,11.5,11.6,12.1,13.4,16.2];var mam=[12.6,11.8,11.3,11.0,10.8,10.7,10.7,10.8];Plotly.newPlot("plot-dl12-perplexity-tr",[{x:L,y:trf,name:"Transformer (4K eğitildi)",mode:"lines+markers",line:{color:"#ff6b6b",width:3}},{x:L,y:mam,name:"Mamba (4K eğitildi)",mode:"lines+markers",line:{color:th.accent,width:3}}],{title:{text:"Perplexity — değerlendirme bağlam uzunluğuna göre (temsili)",font:{color:th.text,size:13}},xaxis:{title:"Değerlendirme bağlamı (token)",type:"log",color:th.text,gridcolor:th.grid},yaxis:{title:"Perplexity (düşük iyi)",color:th.text,gridcolor:th.grid},paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},legend:{font:{color:th.text}},margin:{t:60,r:20,b:60,l:60},height:320},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();},250);</script>'

+ '<p class="l-text">Şu desen kritik: Transformer kendi eğitim bağlamının (burada 4K) ötesine geçince perplexity tırmanır — eğitim dağılımının dışına çıkar. Mamba ise uzadıkça <em>daha iyi</em>, çünkü selective state daha çok kanıt biriktirir. Length extrapolation, SSM\'in armağanlarından biridir.</p>'

+ '<h2 class="l-title">6. Mamba-2 ve SSD — Yapısal Köprü</h2>'

+ '<p class="l-text">Mayıs 2024, Tri Dao & Albert Gu, Mamba-2\'yi açıkladı. Asıl katkı teorik: <strong>State Space Duality (SSD)</strong>. Mamba\'nın selective recurrence\'ı, "yarı-ayrık" (semiseparable) matris yapısına sahip bir tür yapısal-attention\'a denk; özel bir biçimde bakınca SSM ve linear attention aynı ailenin iki yüzü.</p>'

+ '<p class="l-text">Pratik kazanımlar:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Daha basit kernel:</strong> Selective scan\'in yerini blok matris çarpımları aldı. Modern GPU\'daki tensor core\'ları (FP16/BF16 matmul) tam kapasite çalışır.</li>'
+ '<li><strong>Daha geniş <em>d_state</em>:</strong> Mamba\'da 16 ile sınırlıydı; Mamba-2\'de 128-256 mümkün. Daha zengin gizli durum = daha iyi hatırlama.</li>'
+ '<li><strong>2-8× hız:</strong> Aynı parametre sayısıyla Mamba\'dan tutarlı şekilde hızlı, daha düşük perplexity.</li>'
+ '<li><strong>Çoklu kafa:</strong> Multi-head SSM kavramı yerleşti; attention\'daki head başına paralelliğin SSM karşılığı.</li>'
+ '</ul>'

+ '<p class="l-text">Felsefi mesaj: attention bir uçta, SSM diğer uçta dururken, SSD ortadaki sürekli geçit. "Attention vs SSM" tartışması yerine "hangi yapısal matrisi seçtin?" sorusuna geçildi.</p>'

+ '<h2 class="l-title">7. RWKV — Receptance Weighted Key Value</h2>'

+ '<p class="l-text">Bo Peng\'in (ve giderek büyüyen topluluğun) açık kaynaklı paralel hattı: 2023\'te RWKV. SSM\'ler kontrol teorisinden gelirken, RWKV linear attention\'ı bir RNN\'e büker. Sonuç: <strong>eğitimde Transformer benzeri paralel, çıkarımda saf RNN — token başı O(1) bellek</strong>.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Time-mixing</div><div class="card-body">Klasik attention\'ın yerini alır: <em>r, k, v</em> projeksiyonları üzerine üssel ağırlıklı geçmiş toplamı. Çıkarımda iki vektör (numerator + denominator) durum olarak taşınır; geri kalan unutulur.</div></div>'
+ '<div class="calc-card"><div class="card-title">Channel-mixing</div><div class="card-body">FFN\'in yerini alan kanal-yönlü etkileşim. Kanal başına bir "receptance" kapısıyla geçmişten ne kadar sızdırılacağı kontrol edilir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Token shift</div><div class="card-body">Her katman girişinde önceki ve şimdiki token\'ı karıştır — yerel bağlamı bedavaya alır.</div></div>'
+ '<div class="calc-card"><div class="card-title">RWKV-5, 6, 7</div><div class="card-body">Matrix-valued state, channel-mixing iyileştirmeleri. RWKV-7 "Goose" (2025), bazı dil görevlerinde benzer boyutlu Mamba ile yarışır; 14B versiyonu üretimde.</div></div>'
+ '</div>'

+ '<p class="l-text">Pratikte cazibesi: laptopta bile akıcı çıkarım. KV-cache yok. Sohbet uzadıkça VRAM artmıyor — sadece sabit boyutlu state taşınıyor. Edge ve embedded senaryolarda Mamba\'nın esas rakibi.</p>'

+ '<h2 class="l-title">8. Hibrit Modeller — En İyisini Birleştir</h2>'

+ '<p class="l-text">2024 sonu — 2026 ortası dönemin galip stratejisi: <strong>katmanları karıştır</strong>. SSM blokları lineer maliyetle uzun bağlamı taşır; az sayıda attention bloğu ihtiyaç anında "kesin geri çağırma" (associative recall) yapar.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Jamba (AI21, 2024)</div><div class="card-body">Mamba + Transformer + Mixture-of-Experts. 52B toplam parametre, 12B aktif. 256K bağlam üretimde, RTX A100\'de.</div></div>'
+ '<div class="calc-card"><div class="card-title">Zamba2 (Zyphra, 2024-2025)</div><div class="card-body">Mamba2 omurga + paylaşımlı bir attention bloğu birden çok kez çağrılıyor. 7B/2.7B/1.2B sürümler; küçük model dünyasında Llama-3.1-8B\'yi 2× hızla geride bıraktı.</div></div>'
+ '<div class="calc-card"><div class="card-title">Samba (Microsoft, 2024)</div><div class="card-body">Mamba + Sliding Window Attention + MLP. Sınırsız uzunluğa ekstrapole edebilen, mütevazı boyutlu (1.7B) ama uzun bağlamda güçlü.</div></div>'
+ '<div class="calc-card"><div class="card-title">Hymba, Griffin, RecurrentGemma</div><div class="card-body">Google ve NVIDIA\'nın deneyleri. Gated linear recurrence + lokal attention. 2025\'te "saf attention" üretim modelleri azınlık olmaya başladı.</div></div>'
+ '</div>'

+ '<p class="l-text">Boş bir alan değil bu: araştırma sorusu artık "kaç attention katmanı yeter?" — 1/8 mi, 1/16 mı? Cevap görev bağımlı. Kod ve matematik gibi tam-erişim isteyen alanlarda daha çok attention; çok-uzun belge özetlemede hemen hemen saf SSM.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (hibrit blok şeması)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n<span class="kw">from</span> mamba_ssm <span class="kw">import</span> Mamba2\n\n<span class="kw">class</span> <span class="fn">HybridBlock</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(self, d, n_layers=<span class="num">24</span>, attn_every=<span class="num">8</span>):\n        <span class="kw">super</span>().<span class="fn">__init__</span>()\n        layers = []\n        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n_layers):\n            <span class="kw">if</span> (i + <span class="num">1</span>) % attn_every == <span class="num">0</span>:\n                layers.<span class="fn">append</span>(nn.<span class="fn">MultiheadAttention</span>(d, num_heads=<span class="num">8</span>))\n            <span class="kw">else</span>:\n                layers.<span class="fn">append</span>(<span class="fn">Mamba2</span>(d_model=d, d_state=<span class="num">128</span>, headdim=<span class="num">64</span>))\n        self.layers = nn.<span class="fn">ModuleList</span>(layers)\n\n    <span class="kw">def</span> <span class="fn">forward</span>(self, x):\n        <span class="kw">for</span> blk <span class="kw">in</span> self.layers:\n            x = x + <span class="fn">blk</span>(x) <span class="kw">if not</span> <span class="fn">isinstance</span>(blk, nn.MultiheadAttention) <span class="kw">else</span> x + blk(x, x, x)[<span class="num">0</span>]\n        <span class="kw">return</span> x</code></pre></div></div>'

+ '<p class="l-text">Şema basit ama mesaj net: 8 katmanda 1 tane attention, geri kalanlar Mamba2. Tipik bir Jamba/Zamba reçetesinin minyatürü. Çoğu hibrit literatürde 1:7 veya 1:15 oranı tercih ediliyor.</p>'

+ '<h2 class="l-title">9. Uzun-Bağlam Cephesinde Diğer Yollar</h2>'

+ '<p class="l-text">SSM\'ler tek alternatif değil. Transformer\'ı koruyup uzun bağlama uzatan paralel yatakları da analım:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">FlashAttention v1/v2/v3</div><div class="card-body">Dao 2022-2024. Algoritma hâlâ O(L²) ama IO-aware — SRAM/HBM trafiğini minimize edip 4-8× hız. Bellek O(L)\'ye iner. Hâlâ ölçek değil, sabit çarpan kazanımı.</div></div>'
+ '<div class="calc-card"><div class="card-title">Ring Attention (Liu &amp; Abbeel 2023)</div><div class="card-body">Diziyi GPU\'lar arasında "halka" gibi dolaştır. Her cihaz dizinin bir parçasını taşır; ağa yaydığın kadar uzun bağlam mümkün. Gemini 1.5\'in 10M token bağlamının arkasındaki fikir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Infini-Attention (Google 2024)</div><div class="card-body">Klasik attention + sıkıştırılmış uzun-dönem hafıza (linear attention tarzı). Sonsuz bağlama eğilim — pratikte 1M+.</div></div>'
+ '<div class="calc-card"><div class="card-title">LongRoPE / YaRN / NTK-aware</div><div class="card-body">Rotary position embedding\'i ölçekleyerek eğitim bağlamının ötesine ekstrapolasyon. Mevcut Llama/Qwen ailesinde 128K-1M bağlam ucuz fine-tune ile açılır.</div></div>'
+ '</div>'

+ '<p class="l-text">Modern üretim mimarileri genellikle iki cepheyi birden açar: <strong>hibrit SSM</strong> (asıl maliyeti aşağı çekmek için) + <strong>FlashAttention v3</strong> (kalan attention katmanlarını hızlandırmak için) + <strong>Ring/Context Parallelism</strong> (donanımı yatay ölçeklemek için). Tek bir madde değil, paket.</p>'

+ '<h2 class="l-title">10. 2026 Manzarası — Bahis ve Pratik</h2>'

+ '<p class="l-text">SSM hipotezi bir mühendislik iddiasından bir endüstri pozisyonuna dönüştü:</p>'

+ '<ul class="l-list">'
+ '<li><strong>CartesiaAI (Sonic, 2024-2026):</strong> Mamba-temelli düşük gecikmeli ses modeli. Gerçek zamanlı TTS\'de Transformer baz alınanları açık ara geride bıraktı.</li>'
+ '<li><strong>AI21 Jamba ailesi:</strong> Kurumsal RAG ve uzun-belge analizi pazarında, 256K-1M bağlamı GPU başına ucuz tutuyor.</li>'
+ '<li><strong>Llama 4 (söylentiler):</strong> Meta\'nın bir sonraki açık kaynak dalgasında hibrit mimari beklentisi yüksek. Kesin haber yok ama trendi izlemek pratik.</li>'
+ '<li><strong>Bio &amp; protein modelleri:</strong> Caduceus, MambaByte — DNA dizileri (milyonlarca baz çifti) doğal SSM zemini. Bu alanda 2026\'da SSM neredeyse varsayılan.</li>'
+ '<li><strong>Edge / mobil:</strong> RWKV-7, Mamba-1.4B/2.8B nicelendirilmiş hâlleri telefonda akıcı. KV-cache derdi olmadan uzun sohbet.</li>'
+ '</ul>'

+ '<p class="l-text">Açık sorular:</p>'
+ '<ul class="l-list">'
+ '<li>Saf SSM, <strong>multi-hop reasoning</strong>\'da (5+ kez ileri-geri zıplayan akıl yürütme) Transformer\'ı yakalayabilecek mi? 2025 boyunca süren bulgu: yakaladıkça yaklaşıyor ama hâlâ hibridler önde.</li>'
+ '<li><strong>In-context learning</strong>: Mamba few-shot örneklerinden Transformer kadar verimli öğreniyor mu? Bazı sentetik testlerde geride; gerçek görevlerde çoğunlukla eşit.</li>'
+ '<li>SSM\'in <strong>yorumlanabilirliği</strong>: Attention map\'in görsel rahatlığı yok. Mechanistic interpretability ekipleri (Anthropic, EleutherAI) henüz SSM\'e nasıl bakacağını öğreniyor.</li>'
+ '</ul>'

+ '<div class="think-box"><strong>📌 Özetle:</strong> 2017\'den beri "attention is all you need" mottosu derin öğrenmenin omurgasıydı. 2024-2026 manzarası net: <em>all you need değil — ama bir parçası</em>. State Space Models, RNN\'in lineer maliyetini geri getirdi; selective mekanizma onu dil modelinde de iddialı yaptı; hibrit modeller bu iddiayı üretime taşıdı. Yeni nesil mühendis için soru "Transformer mı SSM mi?" değil, "<strong>hangi blokları hangi oranda harmanlayacaksın?</strong>". Bu derste kuş bakışı verdik; sonraki adımın <code>mamba-ssm</code> repo\'sunu çalıştırmak, küçük bir dil modelini hibrit kurmak ve eğitim çıkarım eğrilerini kendi gözünle görmek.</div>'

+ '<div class="lesson-formula-ref" style="margin-top:2em"><a href="/tutorials/deep/">📚 Tüm DL Dersleri</a> &nbsp;|&nbsp; <a href="/tutorials/nlp/">📘 NLP Kursu</a> &nbsp;|&nbsp; <a href="/tutorials/gpu/">⚡ GPU &amp; CUDA</a></div>'

,

en:
'<script>(function(){var g=window;g.__dlChartDrawers=g.__dlChartDrawers||[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn in this lesson:</strong> The <strong>State Space Models</strong> family that emerged as an alternative to attention — S4, Mamba, Mamba-2 and RWKV. Why Transformers crack under context lengths reaching a million tokens, why the recurrence ↔ convolution duality is the secret sauce of SSMs, and the <em>selective</em> mechanism detail that lets Mamba catch Transformers on language modeling. From the pure-attention world to the rise of hybrid models (Jamba, Samba).</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 IN THIS LESSON YOU WILL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>See concrete numbers for attention\'s O(L²) and KV-cache cost at million-token context</li><li>Move from a continuous-time LTI system to a discrete SSM and grasp the recurrence ↔ convolution duality</li><li>Understand S4\'s HIPPO initialization and diagonal+low-rank parameterization</li><li>See why Mamba\'s <em>selective</em> mechanism (input-dependent A, B, C) is a turning point</li><li>Learn Mamba-2, RWKV and the Jamba/Zamba2/Samba hybrids and their place in 2026 production stacks</li></ul></div>'

+ '<h2 class="l-title">1. Attention\'s Quadratic Bill</h2>'

+ '<p class="l-text">The Transformer\'s self-attention, when processing a sequence of length <em>L</em>, builds an <em>L × L</em> similarity matrix. Result: memory and compute grow as the square of <em>L</em>. Not a problem at 4K context; at 1M tokens — the new world of long documents, video, codebases — you hit the wall.</p>'

+ '<div class="katex-block">$$\\text{Self-Attention cost} \\;=\\; \\mathcal{O}(L^2 \\cdot d) \\quad\\text{compute},\\quad \\mathcal{O}(L^2) \\quad\\text{memory (attention matrix)}$$</div>'

+ '<p class="l-text">Concretely: L = 1,000,000, d = 4096. A single attention matrix means <em>L²</em> = 10¹² ≈ 1 trillion entries. In FP16 that is 2 TB. Impossible to hold on a single GPU; even the KV-cache (the key/value buffers) balloons as O(L · d) per token and eats HBM (the GPU\'s high-bandwidth memory) during long conversations.</p>'

+ '<div class="calc-graph" style="height:340px"><div id="plot-dl12-cost-en"></div></div>'

+ '<script>setTimeout(function(){(function(){function draw(){if(!window.Plotly||!document.getElementById("plot-dl12-cost-en"))return;var th=window.__dlChartTheme();var L=[];for(var i=10;i<=20;i++){L.push(Math.pow(2,i));}var att=L.map(function(x){return x*x/1e6;});var mam=L.map(function(x){return x/1e3;});Plotly.newPlot("plot-dl12-cost-en",[{x:L,y:att,name:"Attention O(L²)",mode:"lines+markers",line:{color:"#ff6b6b",width:3}},{x:L,y:mam,name:"Mamba O(L)",mode:"lines+markers",line:{color:th.accent,width:3}}],{title:{text:"Compute cost vs token count (relative units, log-log)",font:{color:th.text,size:13}},xaxis:{title:"Context length L (tokens)",type:"log",color:th.text,gridcolor:th.grid},yaxis:{title:"Cost (relative units)",type:"log",color:th.text,gridcolor:th.grid},paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},legend:{font:{color:th.text}},margin:{t:60,r:20,b:60,l:60},height:320},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();},250);</script>'

+ '<p class="l-text">Reading the curve is simple: attention\'s bill keeps climbing even on a log scale. Mamba is a straight line. The gap is invisible up to ~16K tokens; at 256K the gap is 1000×. In a long-context world that gap is real money.</p>'

+ '<h2 class="l-title">2. Why Plain RNNs Were Not Enough</h2>'

+ '<p class="l-text">"Then let\'s go back to the old RNNs" — they were already O(L). But RNNs had two bleeding wounds:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Sequential training:</strong> The state at step <em>t</em> depends on step <em>t-1</em>. You cannot parallelize across the time axis; you cannot exploit the GPU.</li>'
+ '<li><strong>Vanishing/exploding gradients:</strong> Gradients exploded or shrank as they propagated <em>L</em> steps back. LSTM and GRU partially fixed it, but at 1000+ token contexts they were still weak.</li>'
+ '<li><strong>Fixed-size bottleneck:</strong> The entire past is squeezed into a single hidden vector; information loss is inevitable for long, diverse content.</li>'
+ '</ul>'

+ '<p class="l-text">Transformer in 2017 cracked all three: parallel training, direct token-to-token links, fixed depth. Cost: quadratic compute. The SSM promise: bring back the RNN\'s linear cost, but let it train in parallel and stay stable at long range.</p>'

+ '<h2 class="l-title">3. The Bare State Space Model</h2>'

+ '<p class="l-text">The classical formulation from control theory. A continuous-time Linear Time-Invariant (LTI) system:</p>'

+ '<div class="katex-block">$$x\'(t) = A\\,x(t) + B\\,u(t)$$</div>'
+ '<div class="katex-block">$$y(t) = C\\,x(t) + D\\,u(t)$$</div>'

+ '<p class="l-text">Intuition: <em>x(t)</em> is the system\'s "hidden state", <em>u(t)</em> the input, <em>y(t)</em> the output. Matrix <em>A</em> says how memory decays/flows; <em>B</em> how new input mixes with state; <em>C</em> how state projects out into output.</p>'

+ '<p class="l-text">To work with sequences we discretize time. With a step size <em>Δ</em> using zero-order hold (ZOH):</p>'

+ '<div class="katex-block">$$\\bar{A} = \\exp(\\Delta A), \\qquad \\bar{B} = (\\Delta A)^{-1}(\\exp(\\Delta A) - I)\\cdot \\Delta B$$</div>'

+ '<p class="l-text">You can read this discrete system in two ways — and this duality is the SSM secret:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Recurrence view (for inference)</div><div class="card-body"><code>x_k = Ā·x_{k-1} + B̄·u_k</code>, <code>y_k = C·x_k</code>. RNN-like step by step, O(1) memory per token, O(1) compute. Ideal for streaming inference.</div></div>'
+ '<div class="calc-card"><div class="card-title">Convolution view (for training)</div><div class="card-body"><code>y = K * u</code>; kernel <code>K = (CB̄, CĀB̄, CĀ²B̄, ...)</code>. Whole sequence at once, FFT for O(L log L), parallel on GPU.</div></div>'
+ '</div>'

+ '<p class="l-text">Same system, convolutional during training (parallel, fast), recurrent during inference (constant memory, stream friendly). The Transformer sits neither at one end nor the other.</p>'

+ '<h2 class="l-title">4. S4 — The Birth of Structured SSM</h2>'

+ '<p class="l-text">In 2022 Albert Gu, Karan Goel and Christopher Ré\'s S4 (Structured State Space for Sequences) made the raw SSM usable. Two critical ideas:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">HIPPO initialization</div><div class="card-body">Don\'t initialize A randomly; init it so that the state projects the continuous signal onto Legendre/Laguerre polynomials (HIPPO-LegS). The state becomes a compressed optimal memory of the past. Long-range capacity is structurally encouraged.</div></div>'
+ '<div class="calc-card"><div class="card-title">Diagonal Plus Low-Rank (DPLR)</div><div class="card-body">Parameterize A as "diagonal + low-rank correction" instead of a dense matrix. The exponential <code>exp(ΔA)</code> becomes cheap, FFT convolution becomes practical, stability is preserved.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Result:</strong> S4 dominated the Long Range Arena (LRA) benchmark — a 1K-16K sequence-task suite. On Path-X, a 16K-long visual task where Transformers fell to random guessing, S4 hit 88% accuracy. The community was shocked.</p>'

+ '<p class="l-text">But something was missing: S4 has time-invariant dynamics — every token is filtered by the same <em>A, B, C</em>. In a language model, "the" and "<u>oracle</u>" cannot go through the same operator. Content-aware selectivity was needed.</p>'

+ '<h2 class="l-title">5. Mamba — Selective SSM</h2>'

+ '<p class="l-text">December 2023, Albert Gu & Tri Dao. A single-line change shifted the generation: <strong>make <em>B, C</em> and step <em>Δ</em> input-dependent</strong>. Each token picks its own filter. The system is no longer LTI; it is "selective".</p>'

+ '<div class="katex-block">$$B_k = \\text{Linear}_B(u_k),\\quad C_k = \\text{Linear}_C(u_k),\\quad \\Delta_k = \\text{softplus}(\\text{Linear}_\\Delta(u_k))$$</div>'

+ '<p class="l-text">The price of this innocent-looking change: <em>Δ, B, C</em> now vary with time, so the convolution view dies. The only hope for training is recurrence — but recurrence is sequential and underutilizes the GPU. Mamba\'s real miracle is the <strong>hardware-aware parallel scan</strong>:</p>'

+ '<ul class="l-list">'
+ '<li>Define an associative operator — compute the recurrence in O(log L) depth via a tree reduction like a prefix sum.</li>'
+ '<li>Keep the whole computation in SRAM (the GPU\'s fastest, smallest memory). Do not write intermediate states to HBM — recompute on demand.</li>'
+ '<li>A custom CUDA kernel parallelizes across tokens; block-parallel compute by length. On A100, throughput comparable to FlashAttention.</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (mamba-ssm)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># pip install mamba-ssm causal-conv1d</span>\n<span class="kw">import</span> torch\n<span class="kw">from</span> mamba_ssm <span class="kw">import</span> Mamba\n\nbatch, length, dim = <span class="num">2</span>, <span class="num">8192</span>, <span class="num">512</span>\nx = torch.<span class="fn">randn</span>(batch, length, dim).<span class="fn">cuda</span>()\n\nblock = <span class="fn">Mamba</span>(\n    d_model=dim,\n    d_state=<span class="num">16</span>,        <span class="cm"># hidden state size N</span>\n    d_conv=<span class="num">4</span>,          <span class="cm"># local convolution window</span>\n    expand=<span class="num">2</span>,          <span class="cm"># inner expansion ratio</span>\n).<span class="fn">cuda</span>()\n\ny = <span class="fn">block</span>(x)        <span class="cm"># (2, 8192, 512) — same shape</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Practical point:</strong> Mamba is a <em>block</em>; it replaces the self-attention block in a Transformer. A typical Mamba model stacks dozens of these blocks with RMSNorm + residual in between. In the 130M-2.8B parameter range, Mamba matched or beat same-size Transformers in perplexity — and ran 5× faster at inference.</p>'

+ '<div class="calc-graph" style="height:340px"><div id="plot-dl12-perplexity-en"></div></div>'

+ '<script>setTimeout(function(){(function(){function draw(){if(!window.Plotly||!document.getElementById("plot-dl12-perplexity-en"))return;var th=window.__dlChartTheme();var L=[1024,2048,4096,8192,16384,32768,65536,131072];var trf=[12.4,11.9,11.6,11.5,11.6,12.1,13.4,16.2];var mam=[12.6,11.8,11.3,11.0,10.8,10.7,10.7,10.8];Plotly.newPlot("plot-dl12-perplexity-en",[{x:L,y:trf,name:"Transformer (trained 4K)",mode:"lines+markers",line:{color:"#ff6b6b",width:3}},{x:L,y:mam,name:"Mamba (trained 4K)",mode:"lines+markers",line:{color:th.accent,width:3}}],{title:{text:"Perplexity vs evaluation context length (illustrative)",font:{color:th.text,size:13}},xaxis:{title:"Evaluation context (tokens)",type:"log",color:th.text,gridcolor:th.grid},yaxis:{title:"Perplexity (lower is better)",color:th.text,gridcolor:th.grid},paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},legend:{font:{color:th.text}},margin:{t:60,r:20,b:60,l:60},height:320},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();},250);</script>'

+ '<p class="l-text">Note the pattern: as the Transformer goes beyond its training context (4K here) perplexity climbs — it exits its training distribution. Mamba gets <em>better</em> with more length, because the selective state accumulates more evidence. Length extrapolation is one of the gifts of SSMs.</p>'

+ '<h2 class="l-title">6. Mamba-2 and SSD — The Structural Bridge</h2>'

+ '<p class="l-text">May 2024, Tri Dao & Albert Gu announced Mamba-2. The main contribution is theoretical: <strong>State Space Duality (SSD)</strong>. Mamba\'s selective recurrence is equivalent to a kind of structured attention with a "semiseparable" matrix structure; viewed properly, SSM and linear attention are two faces of the same family.</p>'

+ '<p class="l-text">Practical gains:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Simpler kernel:</strong> The selective scan is replaced by block matrix multiplications. Modern GPU tensor cores (FP16/BF16 matmul) run at full capacity.</li>'
+ '<li><strong>Larger <em>d_state</em>:</strong> Mamba was limited to 16; Mamba-2 allows 128-256. Richer hidden state = better recall.</li>'
+ '<li><strong>2-8× speed:</strong> At equal parameter count, consistently faster than Mamba with lower perplexity.</li>'
+ '<li><strong>Multi-head:</strong> Multi-head SSM became a fixture; an SSM analog of attention\'s per-head parallelism.</li>'
+ '</ul>'

+ '<p class="l-text">Philosophical message: with attention at one end and SSM at the other, SSD is the continuous bridge in the middle. The debate "attention vs SSM" turned into "which structured matrix did you pick?".</p>'

+ '<h2 class="l-title">7. RWKV — Receptance Weighted Key Value</h2>'

+ '<p class="l-text">Bo Peng\'s (and a growing community\'s) open-source parallel line: RWKV in 2023. SSMs come from control theory; RWKV bends linear attention into an RNN. Result: <strong>Transformer-like parallelism in training, pure RNN at inference — O(1) memory per token</strong>.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Time-mixing</div><div class="card-body">Replaces classical attention: an exponentially weighted history sum over <em>r, k, v</em> projections. At inference, two vectors (numerator + denominator) are carried as state; everything else is forgotten.</div></div>'
+ '<div class="calc-card"><div class="card-title">Channel-mixing</div><div class="card-body">A channel-wise interaction that replaces the FFN. A per-channel "receptance" gate controls how much of the past leaks through.</div></div>'
+ '<div class="calc-card"><div class="card-title">Token shift</div><div class="card-body">At each layer input, mix the previous and current token — local context for free.</div></div>'
+ '<div class="calc-card"><div class="card-title">RWKV-5, 6, 7</div><div class="card-body">Matrix-valued state, improvements in channel-mixing. RWKV-7 "Goose" (2025) competes with similar-size Mamba on some language tasks; the 14B version is in production.</div></div>'
+ '</div>'

+ '<p class="l-text">Practical appeal: fluid inference even on a laptop. No KV-cache. As the chat grows, VRAM does not — only a fixed-size state is carried. In edge and embedded scenarios, the main rival to Mamba.</p>'

+ '<h2 class="l-title">8. Hybrid Models — Combine the Best</h2>'

+ '<p class="l-text">The winning strategy of late 2024 through mid 2026: <strong>mix the layers</strong>. SSM blocks carry long context at linear cost; a small number of attention blocks do "precise recall" (associative recall) when needed.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Jamba (AI21, 2024)</div><div class="card-body">Mamba + Transformer + Mixture-of-Experts. 52B total parameters, 12B active. 256K context in production on a single A100.</div></div>'
+ '<div class="calc-card"><div class="card-title">Zamba2 (Zyphra, 2024-2025)</div><div class="card-body">Mamba2 backbone + a single shared attention block called multiple times. 7B/2.7B/1.2B variants; in the small-model world it beat Llama-3.1-8B at 2× the speed.</div></div>'
+ '<div class="calc-card"><div class="card-title">Samba (Microsoft, 2024)</div><div class="card-body">Mamba + Sliding Window Attention + MLP. Extrapolates to unlimited length, modest size (1.7B) but strong at long context.</div></div>'
+ '<div class="calc-card"><div class="card-title">Hymba, Griffin, RecurrentGemma</div><div class="card-body">Experiments from Google and NVIDIA. Gated linear recurrence + local attention. By 2025, pure-attention production models started becoming a minority.</div></div>'
+ '</div>'

+ '<p class="l-text">This is not an empty space: the research question is now "how many attention layers are enough?" — 1/8, 1/16? The answer is task-dependent. More attention in domains that demand total recall (code, math); near-pure SSM in very-long-document summarization.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (hybrid block sketch)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n<span class="kw">from</span> mamba_ssm <span class="kw">import</span> Mamba2\n\n<span class="kw">class</span> <span class="fn">HybridBlock</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(self, d, n_layers=<span class="num">24</span>, attn_every=<span class="num">8</span>):\n        <span class="kw">super</span>().<span class="fn">__init__</span>()\n        layers = []\n        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n_layers):\n            <span class="kw">if</span> (i + <span class="num">1</span>) % attn_every == <span class="num">0</span>:\n                layers.<span class="fn">append</span>(nn.<span class="fn">MultiheadAttention</span>(d, num_heads=<span class="num">8</span>))\n            <span class="kw">else</span>:\n                layers.<span class="fn">append</span>(<span class="fn">Mamba2</span>(d_model=d, d_state=<span class="num">128</span>, headdim=<span class="num">64</span>))\n        self.layers = nn.<span class="fn">ModuleList</span>(layers)\n\n    <span class="kw">def</span> <span class="fn">forward</span>(self, x):\n        <span class="kw">for</span> blk <span class="kw">in</span> self.layers:\n            x = x + <span class="fn">blk</span>(x) <span class="kw">if not</span> <span class="fn">isinstance</span>(blk, nn.MultiheadAttention) <span class="kw">else</span> x + blk(x, x, x)[<span class="num">0</span>]\n        <span class="kw">return</span> x</code></pre></div></div>'

+ '<p class="l-text">Simple sketch, clear message: one attention per 8 layers, the rest Mamba2. A miniature of a typical Jamba/Zamba recipe. Most hybrids in the literature use a 1:7 or 1:15 ratio.</p>'

+ '<h2 class="l-title">9. The Long-Context Front — Other Routes</h2>'

+ '<p class="l-text">SSMs are not the only alternative. The parallel beds that keep the Transformer and stretch it to long context:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">FlashAttention v1/v2/v3</div><div class="card-body">Dao 2022-2024. Still O(L²) algorithmically but IO-aware — minimizing SRAM/HBM traffic gives 4-8× speed. Memory drops to O(L). Constant-factor gain, not a scaling one.</div></div>'
+ '<div class="calc-card"><div class="card-title">Ring Attention (Liu &amp; Abbeel 2023)</div><div class="card-body">Pass the sequence around a "ring" of GPUs. Each device holds a chunk; the more devices, the longer the supported context. The idea behind Gemini 1.5\'s 10M-token context.</div></div>'
+ '<div class="calc-card"><div class="card-title">Infini-Attention (Google 2024)</div><div class="card-body">Classical attention + a compressed long-term memory (linear-attention style). Tends toward infinite context — in practice 1M+.</div></div>'
+ '<div class="calc-card"><div class="card-title">LongRoPE / YaRN / NTK-aware</div><div class="card-body">Scale rotary position embeddings to extrapolate beyond training context. In the current Llama/Qwen family, 128K-1M contexts open up with cheap fine-tuning.</div></div>'
+ '</div>'

+ '<p class="l-text">Modern production architectures usually open both fronts: <strong>hybrid SSM</strong> (to drag the main cost down) + <strong>FlashAttention v3</strong> (to speed up remaining attention layers) + <strong>Ring/Context Parallelism</strong> (to scale hardware horizontally). Not one item — a stack.</p>'

+ '<h2 class="l-title">10. The 2026 Landscape — Bets and Practice</h2>'

+ '<p class="l-text">The SSM hypothesis turned from an engineering claim into an industry position:</p>'

+ '<ul class="l-list">'
+ '<li><strong>CartesiaAI (Sonic, 2024-2026):</strong> A Mamba-based low-latency voice model. In real-time TTS it pulled ahead of Transformer baselines.</li>'
+ '<li><strong>AI21 Jamba family:</strong> In enterprise RAG and long-document analysis, keeps 256K-1M context cheap per GPU.</li>'
+ '<li><strong>Llama 4 (rumors):</strong> Meta\'s next open-source wave is expected to feature a hybrid architecture. No firm news, but the trend is informative.</li>'
+ '<li><strong>Bio &amp; protein models:</strong> Caduceus, MambaByte — DNA sequences (millions of base pairs) are natural SSM territory. In 2026 SSMs are nearly the default here.</li>'
+ '<li><strong>Edge / mobile:</strong> Quantized RWKV-7, Mamba-1.4B/2.8B run smoothly on phones. Long chat without the KV-cache pain.</li>'
+ '</ul>'

+ '<p class="l-text">Open questions:</p>'
+ '<ul class="l-list">'
+ '<li>Can pure SSMs catch Transformers in <strong>multi-hop reasoning</strong> (back-and-forth, 5+ hops)? The 2025 evidence: closing the gap but hybrids still lead.</li>'
+ '<li><strong>In-context learning</strong>: Does Mamba learn from few-shot examples as efficiently as Transformer? Behind on some synthetic tests; mostly tied on real tasks.</li>'
+ '<li>SSM <strong>interpretability</strong>: There is no visual comfort of an attention map. Mechanistic interpretability teams (Anthropic, EleutherAI) are still learning how to look at SSMs.</li>'
+ '</ul>'

+ '<div class="think-box"><strong>📌 In summary:</strong> Since 2017 the motto "attention is all you need" was the backbone of deep learning. The 2024-2026 picture is clear: <em>not all you need — but part of it</em>. State Space Models brought back the linear cost of RNNs; the selective mechanism made them competitive in language modeling; hybrid models carried that into production. For the next-generation engineer the question is no longer "Transformer or SSM?" but "<strong>which blocks do you blend, in what ratio?</strong>". This lesson gave a bird\'s-eye view; your next step is to run the <code>mamba-ssm</code> repo, build a small hybrid LM and watch the training/inference curves with your own eyes.</div>'

+ '<div class="lesson-formula-ref" style="margin-top:2em"><a href="/tutorials/deep/">📚 All DL Lessons</a> &nbsp;|&nbsp; <a href="/tutorials/nlp/">📘 NLP Course</a> &nbsp;|&nbsp; <a href="/tutorials/gpu/">⚡ GPU &amp; CUDA</a></div>'

};
