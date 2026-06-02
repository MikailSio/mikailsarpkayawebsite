/* dl-new-L10.js — Deep Learning Lesson 10: Generative Modeller (VAE, GAN, Diffusion) (TR + EN) */
var DL_L10 = {

tr:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Sınıflandırma değil, <em>üretim</em>. Yeni görüntü, yeni metin, yeni ses sentezleyen modeller. <strong>Autoencoder</strong> (sıkıştır + aç), <strong>VAE</strong> (olasılıksal autoencoder), <strong>GAN</strong> (üreten + ayırt eden ikilisi), <strong>Diffusion</strong> (gürültüden geri inşa). Modern AI sanatının (DALL-E, Stable Diffusion, Midjourney) altındaki matematik.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Discriminative ve generative modelleri ürettikleri çıktıya göre ayıracaksın</li><li>Autoencoder\'ı encoder-decoder ile kurup latent uzayı görselleştireceksin</li><li>VAE\'nin reparametrization trick\'i ve KL kaybını çıkaracaksın</li><li>GAN\'ın generator-discriminator min-max oyununu ve mode collapse\'ı açıklayacaksın</li><li>Diffusion forward ve reverse süreçlerini inceleyip Stable Diffusion ile bir görüntü üreteceksin</li></ul></div>'

+ '<h2 class="l-title">1. Discriminative vs Generative</h2>'

+ '<p class="l-text">Şimdiye kadar gördüğümüz tüm modeller <strong>discriminative</strong>: <em>p(y|x)</em>\'i modelliyor. "Bu görüntü kedi mi köpek mi?" Sadece sınır çiziyor.</p>'

+ '<p class="l-text"><strong>Generative model</strong> daha iddialı: <em>p(x)</em>\'i modeller. "Kedi nedir?" — kedi dağılımının kendisini öğrenir, ondan örnek üretebilir. Bu çok daha zor: 256×256×3 RGB görüntüde olası görüntü sayısı astronomik. Tüm bu uzaydan "anlamlı" olan ufak alt-manifoldu öğrenmek lazım.</p>'

+ '<p class="l-text">Niye değer? Veri augmentation, sanat, simülasyon, super-resolution, inpainting, drug discovery, robotics — modern AI\'nın yarısı bu yetenekle açıldı.</p>'

+ '<h2 class="l-title">2. Autoencoder — Temel</h2>'

+ '<p class="l-text">İki ağ: <strong>encoder</strong> <em>x → z</em> (sıkıştır), <strong>decoder</strong> <em>z → x</em> (aç). Hedef: <em>x ≈ x</em>. Yani modelin görevi kendini yeniden oluşturmak.</p>'

+ '<div class="katex-block">$$\\mathcal{L}(x) = \\|x - \\text{Decoder}(\\text{Encoder}(x))\\|^2$$</div>'

+ '<p class="l-text"><em>z</em> latent space — boyut <em>x</em>\'ten çok küçük. Bu darboğaz modeli verinin <strong>özünü</strong> öğrenmeye zorlar. 784 boyutlu MNIST görüntüsü 32 boyutlu z\'ye sıkışsın — z\'de muhtemelen şekil, eğim, kalınlık gibi özellikler kodlanır.</p>'

+ '<p class="l-text"><strong>Sorunu:</strong> Latent space yapılandırılmamış. Rastgele bir z\'den decoder ile örnek üretemezsin — z\'lerin dağılımı bilinmiyor.</p>'

+ '<h2 class="l-title">3. VAE — Variational Autoencoder</h2>'

+ '<p class="l-text"><strong>Kingma &amp; Welling 2013.</strong> Encoder bir nokta z döndürmek yerine bir <em>dağılım</em> döndürsün: <em>q(z|x) = N(μ(x), σ²(x))</em>. Bu dağılımdan örneklenir, decoder ona girer.</p>'

+ '<p class="l-text">İki kayıp:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Reconstruction:</strong> <em>x ≈ x</em> (autoencoder ile aynı).</li>'
+ '<li><strong>KL divergence:</strong> <em>q(z|x)</em>\'in standart normal <em>N(0, I)</em>\'a yakın olmasını zorla.</li>'
+ '</ul>'

+ '<div class="katex-block">$$\\mathcal{L}_{\\text{VAE}} = \\mathbb{E}_{q(z|x)}[\\log p(x|z)] - \\beta \\cdot D_{KL}(q(z|x) \\| \\mathcal{N}(0, I))$$</div>'

+ '<p class="l-text">İkinci terim sayesinde latent uzay düzenli olur. Üretim için: <em>z ~ N(0, I)</em> örnekle, decoder\'a ver — yeni örnek!</p>'

+ '<p class="l-text"><strong>Reparameterization trick:</strong> Stokastik örneklemden gradyan akıtmak için <em>z = μ + σ · ε</em>, <em>ε ~ N(0, I)</em>. Stokastiklik <em>ε</em>\'da, gradyan μ ve σ\'ya akar.</p>'

+ '<div class="calc-example"><div class="example-label">PYTORCH VAE — KISA</div><div class="example-body"><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">class</span> <span class="fn">VAE</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_dim=<span class="num">784</span>, hid=<span class="num">400</span>, z_dim=<span class="num">20</span>):\n        <span class="fn">super</span>().<span class="fn">__init__</span>()\n        <span class="kw">self</span>.enc = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(in_dim, hid), nn.<span class="fn">ReLU</span>())\n        <span class="kw">self</span>.fc_mu = nn.<span class="fn">Linear</span>(hid, z_dim)\n        <span class="kw">self</span>.fc_logvar = nn.<span class="fn">Linear</span>(hid, z_dim)\n        <span class="kw">self</span>.dec = nn.<span class="fn">Sequential</span>(\n            nn.<span class="fn">Linear</span>(z_dim, hid), nn.<span class="fn">ReLU</span>(),\n            nn.<span class="fn">Linear</span>(hid, in_dim), nn.<span class="fn">Sigmoid</span>(),\n        )\n\n    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x):\n        h = <span class="kw">self</span>.<span class="fn">enc</span>(x)\n        mu, logvar = <span class="kw">self</span>.<span class="fn">fc_mu</span>(h), <span class="kw">self</span>.<span class="fn">fc_logvar</span>(h)\n        std = torch.<span class="fn">exp</span>(<span class="num">0.5</span> * logvar)\n        z = mu + std * torch.<span class="fn">randn_like</span>(std)  <span class="cm"># reparameterization</span>\n        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">dec</span>(z), mu, logvar\n\n<span class="kw">def</span> <span class="fn">vae_loss</span>(x_hat, x, mu, logvar):\n    rec = F.<span class="fn">binary_cross_entropy</span>(x_hat, x, reduction=<span class="str">"sum"</span>)\n    kl = -<span class="num">0.5</span> * torch.<span class="fn">sum</span>(<span class="num">1</span> + logvar - mu.<span class="fn">pow</span>(<span class="num">2</span>) - logvar.<span class="fn">exp</span>())\n    <span class="kw">return</span> rec + kl</code></pre></div></div></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Encoder x\'ten μ ve log σ²\'yi çıkarır. Reparameterization ile z örneklenir. Decoder z\'den x üretir. Loss: reconstruction (BCE) + KL (analitik formül). MNIST üzerinde 20 epoch sonra okunabilir rakamlar üretir.</p>'

+ '<h2 class="l-title">4. GAN — Generative Adversarial Network</h2>'

+ '<p class="l-text"><strong>Goodfellow et al. 2014.</strong> İki ağ rekabet eder:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Generator G:</strong> Rastgele gürültüden (z ~ N(0,I)) sahte örnek üretir.</li>'
+ '<li><strong>Discriminator D:</strong> Verilen örnek gerçek mi sahte mi tahmin eder.</li>'
+ '</ul>'

+ '<p class="l-text">G, D\'yi kandırmaya çalışır; D, G\'yi yakalamaya. Minimax oyun:</p>'

+ '<div class="katex-block">$$\\min_G \\max_D \\mathbb{E}_{x \\sim p_{\\text{data}}}[\\log D(x)] + \\mathbb{E}_{z \\sim p_z}[\\log(1 - D(G(z)))]$$</div>'

+ '<p class="l-text"><strong>Sezgi:</strong> Hırsız ve polis. Hırsız (G) gittikçe daha iyi sahteler basar; polis (D) gittikçe daha sıkı denetler. Denge noktasında G\'nin ürettikleri gerçeklerden ayırt edilemez.</p>'

+ '<p class="l-text"><strong>Eğitim adımı:</strong></p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># D adımı</span>\nreal_loss = -<span class="fn">log</span>(<span class="fn">D</span>(real))\nfake_loss = -<span class="fn">log</span>(<span class="num">1</span> - <span class="fn">D</span>(<span class="fn">G</span>(z)))\nD_loss = real_loss + fake_loss\nD_loss.<span class="fn">backward</span>(); D_opt.<span class="fn">step</span>()\n\n<span class="cm"># G adımı</span>\nG_loss = -<span class="fn">log</span>(<span class="fn">D</span>(<span class="fn">G</span>(z)))  <span class="cm"># G, D\'yi kandırmak istiyor</span>\nG_loss.<span class="fn">backward</span>(); G_opt.<span class="fn">step</span>()</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> İki ayrı optimizer. Önce D\'yi gerçek + sahte ile eğit. Sonra G\'yi D\'nin "gerçek" demesi için eğit. Sıralı, dengeli yapılır — biri çok güçlenirse diğeri öğrenemez.</p>'

+ '<p class="l-text"><strong>GAN\'ın belaları:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>Mode collapse:</strong> G aynı tür örneği üretir, çeşitlilik kaybeder.</li>'
+ '<li><strong>Eğitim kararsızlığı:</strong> Hiperparametrelere aşırı duyarlı. Wasserstein GAN, spectral norm gibi düzeltmeler popüler.</li>'
+ '<li><strong>Değerlendirme zor:</strong> Loss eğrisi anlamlı değil. FID/IS gibi metrikler kullanılır.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Önemli varyantlar:</strong> DCGAN (CNN tabanlı, 2015), StyleGAN (yüz üretimi, 2018-2021 SOTA), CycleGAN (eşleşmemiş çeviri — at→zebra), BigGAN (yüksek çözünürlüklü ImageNet).</p>'

+ '<h2 class="l-title">5. Diffusion Models — Şu Anki Standart</h2>'

+ '<p class="l-text"><strong>Ho et al. 2020 (DDPM).</strong> 2022\'den itibaren GAN\'ı geçti, görüntü üretiminin standart yaklaşımı oldu. DALL-E 2, Stable Diffusion, Midjourney, Imagen — hepsi diffusion temelli.</p>'

+ '<p class="l-text"><strong>Forward process (gürültüleştir):</strong> Bir görüntüye T adımda yavaş yavaş Gauss gürültüsü ekle. Sonunda saf gürültü kalır.</p>'

+ '<div class="katex-block">$$x_t = \\sqrt{\\bar{\\alpha}_t} x_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, I)$$</div>'

+ '<p class="l-text"><strong>Reverse process (gürültüden geri dön):</strong> Bir sinir ağı (genellikle U-Net) verilen <em>x<sub>t</sub></em>\'den eklenmiş gürültüyü tahmin etmeyi öğrenir. Eğitim kaybı:</p>'

+ '<div class="katex-block">$$\\mathcal{L} = \\mathbb{E}_{t, x_0, \\epsilon} \\|\\epsilon - \\epsilon_\\theta(x_t, t)\\|^2$$</div>'

+ '<p class="l-text">Çıkarım zamanında: saf gürültüden başla, T adımda öğrenilen ağ ile her adım gürültüyü çıkar — sonunda anlamlı görüntü.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Latent Diffusion (Stable Diffusion)</div><div class="card-body">Ham pikselde diffusion pahalı. Önce VAE encoder ile görüntüyü latent uzaya sıkıştır, orada diffusion uygula. Hesap 10× hafifler.</div></div>'
+ '<div class="calc-card"><div class="card-title">Conditional Diffusion</div><div class="card-body">U-Net\'e metin embedding (CLIP) ver. Üretim metne göre yönlendirilebilir → text-to-image.</div></div>'
+ '<div class="calc-card"><div class="card-title">Classifier-Free Guidance</div><div class="card-body">Hem koşullu hem koşulsuz tahminin lineer kombinasyonu. Metne uyumu artırır.</div></div>'
+ '<div class="calc-card"><div class="card-title">DDIM Sampling</div><div class="card-body">1000 adım yerine 50 adımda kaliteli üretim. Hızlandırıcı.</div></div>'
+ '</div>'

+ '<h2 class="l-title">6. Üç Yaklaşımın Karşılaştırması</h2>'

+ '<div class="calc-graph" style="height:380px"><div id="dl-l10-cmp"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l10-cmp"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var cats=["Kalite","Çeşitlilik","Eğitim stabilitesi","Hızlı çıkarım","Likelihood"];var vae=[55,80,90,95,90];var gan=[80,55,40,90,30];var diff=[95,90,85,40,75];var traces=[{type:"scatterpolar",r:vae.concat([vae[0]]),theta:cats.concat([cats[0]]),fill:"toself",name:"VAE",line:{color:hex2rgba(th.accent,0.5)},fillcolor:hex2rgba(th.accent,0.15)},{type:"scatterpolar",r:gan.concat([gan[0]]),theta:cats.concat([cats[0]]),fill:"toself",name:"GAN",line:{color:hex2rgba(th.accent,0.75)},fillcolor:hex2rgba(th.accent,0.2)},{type:"scatterpolar",r:diff.concat([diff[0]]),theta:cats.concat([cats[0]]),fill:"toself",name:"Diffusion",line:{color:th.accent,width:3},fillcolor:hex2rgba(th.accent,0.25)}];Plotly.newPlot("dl-l10-cmp",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},polar:{radialaxis:{visible:true,range:[0,100],gridcolor:th.grid,linecolor:th.grid,tickfont:{color:th.text}},angularaxis:{tickfont:{color:th.text},gridcolor:th.grid,linecolor:th.grid},bgcolor:th.plot},margin:{t:60,r:80,b:60,l:80},height:360,legend:{font:{color:th.text}},title:{text:"Generative model karşılaştırması (temsili)",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<h2 class="l-title">7. Otoregressif Üretim — Dil Modelleri</h2>'

+ '<p class="l-text">Tüm yukarıdakiler görüntü içindi. Metin için baskın yaklaşım <strong>autoregressive (AR)</strong>: bir token tahmin et, ekle, tekrar et.</p>'

+ '<div class="katex-block">$$p(x_1, \\dots, x_n) = \\prod_{i=1}^n p(x_i | x_1, \\dots, x_{i-1})$$</div>'

+ '<p class="l-text">GPT, LLaMA, Claude — hepsi bu modeli izler. Decoder-only Transformer (<a href="/tutorials/ai/dl/attention-transformers">Ders 9</a>) causal mask ile eğitilir; çıkarımda bir token üretip prompt\'a ekler, tekrar çağırır.</p>'

+ '<p class="l-text"><strong>Sampling stratejileri:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>Greedy:</strong> Her adımda en olası token. Tekrar eğilimli.</li>'
+ '<li><strong>Beam search:</strong> Top-k kısmî üretim sakla. Çeviride yaygın.</li>'
+ '<li><strong>Temperature sampling:</strong> Logit\'leri T\'ye böl, softmax\'a ver. Yüksek T = daha rastgele.</li>'
+ '<li><strong>Top-k / nucleus (top-p):</strong> Sadece en olası k veya kümülatif olasılığı p olan token\'lardan örnekle. Modern LLM standardı.</li>'
+ '</ul>'

+ '<h2 class="l-title">8. Üretici Modellerin Değerlendirilmesi</h2>'

+ '<p class="l-text">"Bu görüntü iyi mi?" matematiksel olarak zor. Yaygın metrikler:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">FID (Fréchet Inception Distance)</div><div class="card-body">Üretilen ve gerçek görüntülerin Inception feature dağılımları arasındaki Wasserstein-2. Düşük = iyi. GAN/diffusion için standart.</div></div>'
+ '<div class="calc-card"><div class="card-title">IS (Inception Score)</div><div class="card-body">Üretilen örnekler hem net sınıflandırılabilir hem çeşitli olmalı. Yüksek = iyi. Eski metric, FID kadar güvenilir değil.</div></div>'
+ '<div class="calc-card"><div class="card-title">CLIP Score</div><div class="card-body">Text-to-image modeller için. Üretilen görüntü ile metnin CLIP embedding benzerliği.</div></div>'
+ '<div class="calc-card"><div class="card-title">Perplexity</div><div class="card-body">Dil modelleri için: <em>2^(-(1/n)Σlog p(x_i))</em>. Düşük = model gerçek dil dağılımına yakın.</div></div>'
+ '</div>'

+ '<p class="l-text">Pratikte insan değerlendirmesi (human eval, A/B test) en güvenilir kalır.</p>'

+ '<h2 class="l-title">9. Pratik Örnek — Stable Diffusion ile Üretim</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> diffusers <span class="kw">import</span> StableDiffusionPipeline\n<span class="kw">import</span> torch\n\npipe = StableDiffusionPipeline.<span class="fn">from_pretrained</span>(\n    <span class="str">"runwayml/stable-diffusion-v1-5"</span>,\n    torch_dtype=torch.float16,\n).<span class="fn">to</span>(<span class="str">"cuda"</span>)\n\nprompt = <span class="str">"Bir kütüphanede çalışan kedi, dijital sanat, yüksek detay"</span>\nimage = <span class="fn">pipe</span>(\n    prompt,\n    num_inference_steps=<span class="num">30</span>,\n    guidance_scale=<span class="num">7.5</span>,\n).images[<span class="num">0</span>]\n\nimage.<span class="fn">save</span>(<span class="str">"output.png"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Hugging Face <code>diffusers</code> kütüphanesi ile pretrained Stable Diffusion modelini yükler. Metin verir, 30 diffusion adımı sonra 512×512 görüntü üretir. <code>guidance_scale</code> metne ne kadar sıkı uyacağını ayarlar (yüksek = daha uyumlu, daha az çeşit).</p>'

+ '<h2 class="l-title">10. Hangi Mimariyi Ne Zaman?</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">VAE</div><div class="card-body">Düzenli latent uzay, anomaly detection, semi-supervised, hızlı sample. Görüntü kalitesi orta.</div></div>'
+ '<div class="calc-card"><div class="card-title">GAN</div><div class="card-body">Yüksek kaliteli görüntü, hızlı çıkarım. Ama eğitim zor, mode collapse riski. StyleGAN hâlâ yüz üretiminde rakipsiz.</div></div>'
+ '<div class="calc-card"><div class="card-title">Diffusion</div><div class="card-body">Modern SOTA — kalite + çeşitlilik. Eğitim stabil. Çıkarım yavaş (10-50 adım). Text-to-image, video, ses.</div></div>'
+ '<div class="calc-card"><div class="card-title">Autoregressive</div><div class="card-body">Metin için baskın. Görüntü için de var (PixelCNN, ImageGPT) ama yavaş. LLM\'lerin özü.</div></div>'
+ '</div>'

+ '<h2 class="l-title">11. Flow Matching — DDPM\'in Sade Halefi</h2>'

+ '<p class="l-text"><strong>Lipman ve arkadaşları, 2022 (ICLR 2023).</strong> DDPM\'in tüm o gürültü zamanlaması, SNR ağırlıkları, parametrize edilmiş varyans gibi inceliklerden bıkıldıysa cevabı budur. Fikir kökten farklı: ağa "şu adımda eklenmiş gürültü ne idi" diye sormak yerine, veri ile gürültü arasındaki optimal taşıma akışının <em>hız alanını</em> öğretelim.</p>'

+ '<p class="l-text">Veri örneği <em>x<sub>1</sub></em> ile gürültü örneği <em>x<sub>0</sub></em> arasında düz çizgi çizelim — bu rectified flow varyantıdır:</p>'

+ '<div class="katex-block">$$x_t = (1-t)\\, x_0 + t\\, x_1, \\qquad u_t(x_t) = x_1 - x_0$$</div>'

+ '<p class="l-text">Ağ <em>v<sub>θ</sub>(x<sub>t</sub>, t)</em> hız alanını tahmin etsin. Kayıp düz MSE — zamanlama trick\'i yok, ağırlık yok:</p>'

+ '<div class="katex-block">$$\\mathcal{L}_{FM} = \\mathbb{E}_{t,\\, x_0,\\, x_1}\\!\\left[\\, \\| v_\\theta(x_t, t) - u_t(x_t) \\|^2 \\,\\right]$$</div>'

+ '<p class="l-text">Çıkarımda <em>x<sub>0</sub> ~ N(0, I)</em> noktasından başlayıp ODE çözücüyle <em>dx/dt = v<sub>θ</sub>(x, t)</em>\'yi <em>t=0\'dan t=1</em>\'e entegre ediyoruz. Yani gürültüyü adım adım çıkarmıyoruz, akıntıda yüzüyoruz.</p>'

+ '<p class="l-text"><strong>Kanıtlanmış değer:</strong> Stable Diffusion 3 (2024) ve Flux (Black Forest Labs, 2024) bu sade hedefin üzerine bina edildi. Eğitim daha stabil, kayıp eğrisi okunabilir, kalite DDPM ile yarışıyor.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Kavramsal flow matching kaybı (eğitsel)</span>\n<span class="kw">def</span> <span class="fn">flow_matching_loss</span>(model, x_0, x_1, t):\n    x_t = (<span class="num">1</span> - t) * x_0 + t * x_1\n    v_target = x_1 - x_0\n    v_pred = <span class="fn">model</span>(x_t, t)\n    <span class="kw">return</span> ((v_pred - v_target) ** <span class="num">2</span>).<span class="fn">mean</span>()</code></pre></div>'

+ '<p class="l-text">Tek bir batch için: gerçek görüntülerden <em>x<sub>1</sub></em>, standart normalden <em>x<sub>0</sub></em>, uniform [0,1]\'den <em>t</em> çek; doğru hız sabit olarak <em>x<sub>1</sub> − x<sub>0</sub></em>\'dır. Model bu sabit hedefe regresyonla yaklaşır — DDPM\'in iç içe geçmiş zamanlama matematiğine ihtiyaç kalmaz.</p>'

+ '<h2 class="l-title">12. Rectified Flow ve Tek-Adımlı Üretim</h2>'

+ '<p class="l-text"><strong>Liu ve arkadaşları, 2022.</strong> Flow matching\'in özel hali — yörüngeler düz çizgi olsun. Doğa pek düz çizgi sevmez: eğitilmiş bir akış genellikle eğri yollar üretir, bu da çıkarımda çok ODE adımı gerektirir.</p>'

+ '<p class="l-text"><strong>Reflow prosedürü:</strong> Eğitilmiş modelden <em>(x<sub>0</sub>, x<sub>1</sub>)</em> çiftleri üret (gürültüden başla, ODE ile veriye git). Bu çiftleri yeniden eşleştir, ardından yeni bir modeli aynı çiftler arasında <em>düz</em> çizgi öğrenmeye zorla. Tekrarla — yörüngeler her turda biraz daha düzleşir.</p>'

+ '<p class="l-text">Yörünge gerçekten düzleştiğinde tek bir Euler adımı yeter: <em>x<sub>1</sub> ≈ x<sub>0</sub> + v<sub>θ</sub>(x<sub>0</sub>, 0)</em>. Bu fikrin uygulamaları:</p>'

+ '<ul class="l-list">'
+ '<li><strong>InstaFlow (2023):</strong> Stable Diffusion 1.5\'ten reflow ile tek-adımlı text-to-image.</li>'
+ '<li><strong>SD3-Turbo / FLUX schnell:</strong> 4 adımda profesyonel kalite — rectified flow distillation üstüne adversarial loss.</li>'
+ '<li><strong>Consistency models</strong> (Song ve ark., 2023) ile aynı amacı paylaşır: az adımda kaliteli üretim.</li>'
+ '</ul>'

+ '<p class="l-text">Sezgisel olarak rectified flow, DDPM\'in 50 adımlı U-Net çağrısını tek matrisle değiştirme vaadidir. Production maliyeti 50× düşüyor.</p>'

+ '<h2 class="l-title">13. DiT — Diffusion Transformer</h2>'

+ '<p class="l-text"><strong>Peebles &amp; Xie, 2023.</strong> "U-Net olmadan da olur mu?" sorusunun cevabı. Latent diffusion gövdesini Vision Transformer mimarisi ile değiştirdiler. Patch\'lere böl, position embedding ekle, transformer blokları geçir — gürültü tahminini tokenlar üzerinden yap.</p>'

+ '<p class="l-text">Anahtar yenilik <strong>adaLN-Zero</strong>: zaman ve sınıf koşullandırması her transformer bloğunda LayerNorm\'un γ ve β\'sını üreten küçük MLP\'lerle yapılır. β\'nın başlangıç değeri sıfır — yani modülasyon "kapalı" başlar, FiLM\'den daha kararlı bir başlangıç.</p>'

+ '<p class="l-text"><strong>Ölçekleme yasası:</strong> U-Net\'i 4× büyüttüğünde FID iyileşmesi belli bir noktada plato yapar. DiT\'te öyle değil — parametre arttıkça FID düzgün düşmeye devam ediyor. Bu, "büyük model = daha iyi" felsefesinin görüntü üretimine taşınmasıdır.</p>'

+ '<div class="calc-graph" style="height:340px"><div id="plot-dl10-flow-tr"></div></div>'

+ '<script>setTimeout(function(){(function(){function draw(){if(!window.Plotly||!document.getElementById("plot-dl10-flow-tr"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var xs=[],ys=[],us=[],vs=[];for(var i=-2;i<=2;i+=0.5){for(var j=-2;j<=2;j+=0.5){xs.push(i);ys.push(j);var tx=0.9*Math.cos(0.6*j);var ty=0.9*Math.sin(0.6*i);var dx=tx-i,dy=ty-j;var n=Math.sqrt(dx*dx+dy*dy)+1e-6;us.push(0.35*dx/n);vs.push(0.35*dy/n);}}var arrows=xs.map(function(x,k){return{x:x+us[k],y:ys[k]+vs[k],ax:x,ay:ys[k],xref:"x",yref:"y",axref:"x",ayref:"y",showarrow:true,arrowhead:2,arrowsize:0.9,arrowwidth:1.1,arrowcolor:hex2rgba(th.accent,0.75)};});var data=[{x:[-1.6,-1.2,1.4,1.0,-0.6],y:[-1.4,1.2,-1.0,1.5,0.2],mode:"markers",type:"scatter",marker:{size:12,color:th.accent,symbol:"circle",line:{color:th.text,width:1}},name:"Veri (x₁)"},{x:[1.7,-1.7,0.9,-0.4,1.4],y:[1.6,-1.7,-1.5,1.7,0.7],mode:"markers",type:"scatter",marker:{size:10,color:hex2rgba(th.accent,0.35),symbol:"x"},name:"Gürültü (x₀)"}];Plotly.newPlot("plot-dl10-flow-tr",data,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{range:[-2.4,2.4],gridcolor:th.grid,zerolinecolor:th.grid,color:th.text,title:"x"},yaxis:{range:[-2.4,2.4],gridcolor:th.grid,zerolinecolor:th.grid,color:th.text,title:"y",scaleanchor:"x"},annotations:arrows,margin:{t:60,r:30,b:50,l:60},height:320,legend:{font:{color:th.text}},title:{text:"Flow Matching: gürültüden veriye hız alanı",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();},250);</script>'

+ '<p class="l-text">Üstteki şemada her oku hız alanı <em>v<sub>θ</sub>(x, t)</em> olarak düşün. Gürültü noktası (×) bu alanın akıntısında sürüklenip veri noktasına (●) ulaşıyor — diffusion\'ın "binlerce küçük gürültü çıkarma" sezgisinin yerine "tek bir vektör alanı boyunca yüzme" geliyor.</p>'

+ '<p class="l-text"><strong>Üretimdeki uygulamalar:</strong> Sora\'nın video diffusion gövdesi, Stable Diffusion 3, Lumina-T2X, Hunyuan-DiT — hepsi DiT türevleridir. UNet, görüntü üretiminin transformer dönüşümünü yaşıyor; aynen NLP\'de LSTM → Transformer geçişi gibi.</p>'

+ '<h2 class="l-title">14. 2026 Manzarası</h2>'

+ '<p class="l-text">Yedi yılda yol şöyle: <strong>DDPM (2020)</strong> stokastik tersine difüzyon ile başladı; <strong>DDIM (2021)</strong> deterministik sampler getirip 50 adıma indirdi; <strong>Latent Diffusion (2022)</strong> hesabı VAE latent uzayına taşıdı; <strong>DiT (2023)</strong> U-Net\'i transformere çevirip ölçeklemeyi açtı; <strong>Flow Matching (2023)</strong> hedefi sadeleştirdi; <strong>Rectified Flow (2023-2024)</strong> tek-adımlı üretimi gerçekçi kıldı. Her dönüm noktası ya hızlandı, ya sadeleştirdi, ya kaliteyi yükseltti.</p>'

+ '<p class="l-text">Şu anki sınır: 1-adımlı kontrol edilebilir üretim (ControlNet ailesi + rectified flow distillation), uzun video diffusion\'ı (Sora, Veo 2, Movie Gen) ve 3D/dünya modelleri. Tek bir GPU\'da bir saniyede HD görüntü üretimi 2026\'da artık baseline.</p>'

+ '<div class="think-box"><strong>📌 Özetle:</strong> Generative modelleme = veri dağılımını öğrenme. VAE olasılıksal autoencoder; GAN iki ağ rekabeti; Diffusion gürültüden geri inşa; AR token-token üretim. Yeni kuşak Flow Matching kayıp matematiğini sadeleştirdi, Rectified Flow yörüngeleri düzleştirip tek-adımlı üretimi açtı, DiT U-Net\'in yerine transformer koyup ölçekleme yasasını yeniden yazdı. Her birinin trade-off\'ları var. 2024 itibarıyla görüntü = diffusion, metin = AR transformer kombinasyonu hakim; 2026\'da görüntü gövdesi büyük oranda DiT + flow matching\'e geçti. <strong>Bir sonraki ders: Üretim, Verimlilik &amp; MLOps.</strong> Modeli eğittik; şimdi nasıl ölçeklendireceğiz, dağıtacağız, izleyeceğiz?</div>'

,

en:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn in this lesson:</strong> Not classification, but <em>generation</em>. Models that synthesize new images, new text, new audio. <strong>Autoencoder</strong> (compress + expand), <strong>VAE</strong> (probabilistic autoencoder), <strong>GAN</strong> (a generator + discriminator pair), <strong>Diffusion</strong> (rebuild from noise). The math behind modern AI art (DALL-E, Stable Diffusion, Midjourney).</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 IN THIS LESSON YOU WILL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Distinguish discriminative and generative models by the output they produce</li><li>Build an autoencoder with encoder-decoder and visualize the latent space</li><li>Derive the VAE\'s reparameterization trick and KL loss</li><li>Explain the generator-discriminator min-max game of GANs and mode collapse</li><li>Inspect the diffusion forward and reverse processes and generate an image with Stable Diffusion</li></ul></div>'

+ '<h2 class="l-title">1. Discriminative vs Generative</h2>'

+ '<p class="l-text">All models we have seen so far are <strong>discriminative</strong>: they model <em>p(y|x)</em>. "Is this image a cat or a dog?" They only draw a boundary.</p>'

+ '<p class="l-text">A <strong>generative model</strong> is more ambitious: it models <em>p(x)</em>. "What is a cat?" — it learns the cat distribution itself and can sample from it. This is much harder: the number of possible images for a 256×256×3 RGB image is astronomical. We need to learn the small "meaningful" sub-manifold of this entire space.</p>'

+ '<p class="l-text">Why does it matter? Data augmentation, art, simulation, super-resolution, inpainting, drug discovery, robotics — half of modern AI was unlocked by this capability.</p>'

+ '<h2 class="l-title">2. Autoencoder — The Foundation</h2>'

+ '<p class="l-text">Two networks: <strong>encoder</strong> <em>x → z</em> (compress), <strong>decoder</strong> <em>z → x</em> (expand). Goal: <em>x ≈ x</em>. The model\'s task is to reconstruct itself.</p>'

+ '<div class="katex-block">$$\\mathcal{L}(x) = \\|x - \\text{Decoder}(\\text{Encoder}(x))\\|^2$$</div>'

+ '<p class="l-text"><em>z</em> is the latent space — much smaller in dimension than <em>x</em>. This bottleneck forces the model to learn the <strong>essence</strong> of the data. Compress a 784-dim MNIST image into a 32-dim z — z probably encodes features like shape, slant, thickness.</p>'

+ '<p class="l-text"><strong>Its problem:</strong> The latent space is not structured. You cannot generate a sample from a random z with the decoder — the distribution of zs is unknown.</p>'

+ '<h2 class="l-title">3. VAE — Variational Autoencoder</h2>'

+ '<p class="l-text"><strong>Kingma &amp; Welling 2013.</strong> Instead of returning a point z, let the encoder return a <em>distribution</em>: <em>q(z|x) = N(μ(x), σ²(x))</em>. Sample from this distribution and feed to the decoder.</p>'

+ '<p class="l-text">Two losses:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Reconstruction:</strong> <em>x ≈ x</em> (same as autoencoder).</li>'
+ '<li><strong>KL divergence:</strong> Force <em>q(z|x)</em> to be close to the standard normal <em>N(0, I)</em>.</li>'
+ '</ul>'

+ '<div class="katex-block">$$\\mathcal{L}_{\\text{VAE}} = \\mathbb{E}_{q(z|x)}[\\log p(x|z)] - \\beta \\cdot D_{KL}(q(z|x) \\| \\mathcal{N}(0, I))$$</div>'

+ '<p class="l-text">Thanks to the second term, the latent space becomes regular. To generate: sample <em>z ~ N(0, I)</em>, feed to the decoder — a new sample!</p>'

+ '<p class="l-text"><strong>Reparameterization trick:</strong> To flow gradients through stochastic sampling, write <em>z = μ + σ · ε</em>, <em>ε ~ N(0, I)</em>. Stochasticity is in <em>ε</em>; gradient flows through μ and σ.</p>'

+ '<div class="calc-example"><div class="example-label">PYTORCH VAE — SHORT</div><div class="example-body"><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">class</span> <span class="fn">VAE</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_dim=<span class="num">784</span>, hid=<span class="num">400</span>, z_dim=<span class="num">20</span>):\n        <span class="fn">super</span>().<span class="fn">__init__</span>()\n        <span class="kw">self</span>.enc = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(in_dim, hid), nn.<span class="fn">ReLU</span>())\n        <span class="kw">self</span>.fc_mu = nn.<span class="fn">Linear</span>(hid, z_dim)\n        <span class="kw">self</span>.fc_logvar = nn.<span class="fn">Linear</span>(hid, z_dim)\n        <span class="kw">self</span>.dec = nn.<span class="fn">Sequential</span>(\n            nn.<span class="fn">Linear</span>(z_dim, hid), nn.<span class="fn">ReLU</span>(),\n            nn.<span class="fn">Linear</span>(hid, in_dim), nn.<span class="fn">Sigmoid</span>(),\n        )\n\n    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x):\n        h = <span class="kw">self</span>.<span class="fn">enc</span>(x)\n        mu, logvar = <span class="kw">self</span>.<span class="fn">fc_mu</span>(h), <span class="kw">self</span>.<span class="fn">fc_logvar</span>(h)\n        std = torch.<span class="fn">exp</span>(<span class="num">0.5</span> * logvar)\n        z = mu + std * torch.<span class="fn">randn_like</span>(std)  <span class="cm"># reparameterization</span>\n        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">dec</span>(z), mu, logvar\n\n<span class="kw">def</span> <span class="fn">vae_loss</span>(x_hat, x, mu, logvar):\n    rec = F.<span class="fn">binary_cross_entropy</span>(x_hat, x, reduction=<span class="str">"sum"</span>)\n    kl = -<span class="num">0.5</span> * torch.<span class="fn">sum</span>(<span class="num">1</span> + logvar - mu.<span class="fn">pow</span>(<span class="num">2</span>) - logvar.<span class="fn">exp</span>())\n    <span class="kw">return</span> rec + kl</code></pre></div></div></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> The encoder extracts μ and log σ² from x. z is sampled via reparameterization. The decoder produces x from z. Loss: reconstruction (BCE) + KL (analytical formula). After 20 epochs on MNIST it generates legible digits.</p>'

+ '<h2 class="l-title">4. GAN — Generative Adversarial Network</h2>'

+ '<p class="l-text"><strong>Goodfellow et al. 2014.</strong> Two networks compete:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Generator G:</strong> Generates fake samples from random noise (z ~ N(0,I)).</li>'
+ '<li><strong>Discriminator D:</strong> Predicts whether a given sample is real or fake.</li>'
+ '</ul>'

+ '<p class="l-text">G tries to fool D; D tries to catch G. The minimax game:</p>'

+ '<div class="katex-block">$$\\min_G \\max_D \\mathbb{E}_{x \\sim p_{\\text{data}}}[\\log D(x)] + \\mathbb{E}_{z \\sim p_z}[\\log(1 - D(G(z)))]$$</div>'

+ '<p class="l-text"><strong>Intuition:</strong> Thief and police. The thief (G) prints better and better fakes; the police (D) inspect more and more strictly. At equilibrium G\'s outputs are indistinguishable from the real ones.</p>'

+ '<p class="l-text"><strong>Training step:</strong></p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># D step</span>\nreal_loss = -<span class="fn">log</span>(<span class="fn">D</span>(real))\nfake_loss = -<span class="fn">log</span>(<span class="num">1</span> - <span class="fn">D</span>(<span class="fn">G</span>(z)))\nD_loss = real_loss + fake_loss\nD_loss.<span class="fn">backward</span>(); D_opt.<span class="fn">step</span>()\n\n<span class="cm"># G step</span>\nG_loss = -<span class="fn">log</span>(<span class="fn">D</span>(<span class="fn">G</span>(z)))  <span class="cm"># G wants to fool D</span>\nG_loss.<span class="fn">backward</span>(); G_opt.<span class="fn">step</span>()</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Two separate optimizers. First train D with real + fake. Then train G so that D says "real". Done in alternation, balanced — if one becomes too strong, the other cannot learn.</p>'

+ '<p class="l-text"><strong>The troubles of GANs:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>Mode collapse:</strong> G generates the same kind of sample, loses diversity.</li>'
+ '<li><strong>Training instability:</strong> Extremely sensitive to hyperparameters. Fixes like Wasserstein GAN, spectral norm are popular.</li>'
+ '<li><strong>Hard to evaluate:</strong> The loss curve is not meaningful. Metrics like FID/IS are used.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Important variants:</strong> DCGAN (CNN-based, 2015), StyleGAN (face generation, SOTA 2018-2021), CycleGAN (unpaired translation — horse→zebra), BigGAN (high-resolution ImageNet).</p>'

+ '<h2 class="l-title">5. Diffusion Models — The Current Standard</h2>'

+ '<p class="l-text"><strong>Ho et al. 2020 (DDPM).</strong> Since 2022 it has surpassed GANs and become the standard approach to image generation. DALL-E 2, Stable Diffusion, Midjourney, Imagen — all diffusion-based.</p>'

+ '<p class="l-text"><strong>Forward process (noise it up):</strong> Slowly add Gaussian noise to an image over T steps. By the end, only pure noise remains.</p>'

+ '<div class="katex-block">$$x_t = \\sqrt{\\bar{\\alpha}_t} x_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, I)$$</div>'

+ '<p class="l-text"><strong>Reverse process (climb back from noise):</strong> A neural network (usually a U-Net) learns to predict the noise added to <em>x<sub>t</sub></em>. Training loss:</p>'

+ '<div class="katex-block">$$\\mathcal{L} = \\mathbb{E}_{t, x_0, \\epsilon} \\|\\epsilon - \\epsilon_\\theta(x_t, t)\\|^2$$</div>'

+ '<p class="l-text">At inference time: start from pure noise, remove noise step by step using the trained network over T steps — at the end a meaningful image.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Latent Diffusion (Stable Diffusion)</div><div class="card-body">Diffusion in raw pixels is expensive. First compress the image into a latent space with a VAE encoder, then apply diffusion there. Compute is 10× lighter.</div></div>'
+ '<div class="calc-card"><div class="card-title">Conditional Diffusion</div><div class="card-body">Feed a text embedding (CLIP) to the U-Net. Generation can be steered by text → text-to-image.</div></div>'
+ '<div class="calc-card"><div class="card-title">Classifier-Free Guidance</div><div class="card-body">A linear combination of conditional and unconditional predictions. Improves text adherence.</div></div>'
+ '<div class="calc-card"><div class="card-title">DDIM Sampling</div><div class="card-body">High-quality generation in 50 steps instead of 1000. An accelerator.</div></div>'
+ '</div>'

+ '<h2 class="l-title">6. Comparison of the Three Approaches</h2>'

+ '<div class="calc-graph" style="height:380px"><div id="dl-l10-cmp-en"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l10-cmp-en"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var cats=["Quality","Diversity","Training stability","Fast inference","Likelihood"];var vae=[55,80,90,95,90];var gan=[80,55,40,90,30];var diff=[95,90,85,40,75];var traces=[{type:"scatterpolar",r:vae.concat([vae[0]]),theta:cats.concat([cats[0]]),fill:"toself",name:"VAE",line:{color:hex2rgba(th.accent,0.5)},fillcolor:hex2rgba(th.accent,0.15)},{type:"scatterpolar",r:gan.concat([gan[0]]),theta:cats.concat([cats[0]]),fill:"toself",name:"GAN",line:{color:hex2rgba(th.accent,0.75)},fillcolor:hex2rgba(th.accent,0.2)},{type:"scatterpolar",r:diff.concat([diff[0]]),theta:cats.concat([cats[0]]),fill:"toself",name:"Diffusion",line:{color:th.accent,width:3},fillcolor:hex2rgba(th.accent,0.25)}];Plotly.newPlot("dl-l10-cmp-en",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},polar:{radialaxis:{visible:true,range:[0,100],gridcolor:th.grid,linecolor:th.grid,tickfont:{color:th.text}},angularaxis:{tickfont:{color:th.text},gridcolor:th.grid,linecolor:th.grid},bgcolor:th.plot},margin:{t:60,r:80,b:60,l:80},height:360,legend:{font:{color:th.text}},title:{text:"Generative model comparison (illustrative)",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<h2 class="l-title">7. Autoregressive Generation — Language Models</h2>'

+ '<p class="l-text">All of the above were for images. For text the dominant approach is <strong>autoregressive (AR)</strong>: predict a token, append it, repeat.</p>'

+ '<div class="katex-block">$$p(x_1, \\dots, x_n) = \\prod_{i=1}^n p(x_i | x_1, \\dots, x_{i-1})$$</div>'

+ '<p class="l-text">GPT, LLaMA, Claude — all follow this model. A decoder-only Transformer (<a href="/tutorials/ai/dl/attention-transformers">Lesson 9</a>) is trained with a causal mask; at inference it produces a token, appends it to the prompt, and is called again.</p>'

+ '<p class="l-text"><strong>Sampling strategies:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>Greedy:</strong> The most likely token at every step. Prone to repetition.</li>'
+ '<li><strong>Beam search:</strong> Maintain top-k partial generations. Common in translation.</li>'
+ '<li><strong>Temperature sampling:</strong> Divide logits by T, feed to softmax. High T = more random.</li>'
+ '<li><strong>Top-k / nucleus (top-p):</strong> Sample only from the top-k or the tokens whose cumulative probability is p. The modern LLM standard.</li>'
+ '</ul>'

+ '<h2 class="l-title">8. Evaluation of Generative Models</h2>'

+ '<p class="l-text">"Is this image good?" is hard to ask mathematically. Common metrics:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">FID (Fréchet Inception Distance)</div><div class="card-body">The Wasserstein-2 between the Inception feature distributions of generated and real images. Low = good. The standard for GAN/diffusion.</div></div>'
+ '<div class="calc-card"><div class="card-title">IS (Inception Score)</div><div class="card-body">Generated samples should be both crisply classifiable and diverse. High = good. Older metric, not as reliable as FID.</div></div>'
+ '<div class="calc-card"><div class="card-title">CLIP Score</div><div class="card-body">For text-to-image models. The CLIP embedding similarity between the generated image and the text.</div></div>'
+ '<div class="calc-card"><div class="card-title">Perplexity</div><div class="card-body">For language models: <em>2^(-(1/n)Σlog p(x_i))</em>. Low = the model is close to the true language distribution.</div></div>'
+ '</div>'

+ '<p class="l-text">In practice human evaluation (human eval, A/B test) remains the most reliable.</p>'

+ '<h2 class="l-title">9. Practical Example — Generation with Stable Diffusion</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> diffusers <span class="kw">import</span> StableDiffusionPipeline\n<span class="kw">import</span> torch\n\npipe = StableDiffusionPipeline.<span class="fn">from_pretrained</span>(\n    <span class="str">"runwayml/stable-diffusion-v1-5"</span>,\n    torch_dtype=torch.float16,\n).<span class="fn">to</span>(<span class="str">"cuda"</span>)\n\nprompt = <span class="str">"A cat working in a library, digital art, high detail"</span>\nimage = <span class="fn">pipe</span>(\n    prompt,\n    num_inference_steps=<span class="num">30</span>,\n    guidance_scale=<span class="num">7.5</span>,\n).images[<span class="num">0</span>]\n\nimage.<span class="fn">save</span>(<span class="str">"output.png"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Loads the pretrained Stable Diffusion model with the Hugging Face <code>diffusers</code> library. Given text, produces a 512×512 image after 30 diffusion steps. <code>guidance_scale</code> controls how strictly to follow the text (high = more aligned, less variety).</p>'

+ '<h2 class="l-title">10. Which Architecture When?</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">VAE</div><div class="card-body">Regular latent space, anomaly detection, semi-supervised, fast sampling. Image quality is medium.</div></div>'
+ '<div class="calc-card"><div class="card-title">GAN</div><div class="card-body">High-quality images, fast inference. But training is hard and there is mode collapse risk. StyleGAN is still unrivaled in face generation.</div></div>'
+ '<div class="calc-card"><div class="card-title">Diffusion</div><div class="card-body">Modern SOTA — quality + diversity. Stable training. Inference is slow (10-50 steps). Text-to-image, video, audio.</div></div>'
+ '<div class="calc-card"><div class="card-title">Autoregressive</div><div class="card-body">Dominant for text. Also exists for images (PixelCNN, ImageGPT) but slow. The core of LLMs.</div></div>'
+ '</div>'

+ '<h2 class="l-title">11. Flow Matching — The Clean Successor to DDPM</h2>'

+ '<p class="l-text"><strong>Lipman et al., 2022 (ICLR 2023).</strong> If you are tired of all the DDPM intricacies — noise schedules, SNR weighting, parameterized variances — this is the answer. The idea is fundamentally different: instead of asking the network "what noise was added at this step", we teach it the <em>velocity field</em> of an optimal-transport flow between data and noise.</p>'

+ '<p class="l-text">Draw a straight line between a data sample <em>x<sub>1</sub></em> and a noise sample <em>x<sub>0</sub></em> — this is the rectified-flow variant:</p>'

+ '<div class="katex-block">$$x_t = (1-t)\\, x_0 + t\\, x_1, \\qquad u_t(x_t) = x_1 - x_0$$</div>'

+ '<p class="l-text">Let the network <em>v<sub>θ</sub>(x<sub>t</sub>, t)</em> predict the velocity field. The loss is a plain MSE — no schedule trick, no weighting:</p>'

+ '<div class="katex-block">$$\\mathcal{L}_{FM} = \\mathbb{E}_{t,\\, x_0,\\, x_1}\\!\\left[\\, \\| v_\\theta(x_t, t) - u_t(x_t) \\|^2 \\,\\right]$$</div>'

+ '<p class="l-text">At inference we start from <em>x<sub>0</sub> ~ N(0, I)</em> and integrate <em>dx/dt = v<sub>θ</sub>(x, t)</em> from <em>t=0</em> to <em>t=1</em> with an ODE solver. We do not strip noise step by step — we ride the current.</p>'

+ '<p class="l-text"><strong>Proven in production:</strong> Stable Diffusion 3 (2024) and Flux (Black Forest Labs, 2024) are built on this clean objective. Training is more stable, the loss curve is readable, and quality is competitive with DDPM.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Conceptual flow matching loss (educational)</span>\n<span class="kw">def</span> <span class="fn">flow_matching_loss</span>(model, x_0, x_1, t):\n    x_t = (<span class="num">1</span> - t) * x_0 + t * x_1\n    v_target = x_1 - x_0\n    v_pred = <span class="fn">model</span>(x_t, t)\n    <span class="kw">return</span> ((v_pred - v_target) ** <span class="num">2</span>).<span class="fn">mean</span>()</code></pre></div>'

+ '<p class="l-text">For a single batch: draw <em>x<sub>1</sub></em> from real images, <em>x<sub>0</sub></em> from a standard normal, <em>t</em> from a uniform [0,1]; the true velocity is the constant <em>x<sub>1</sub> − x<sub>0</sub></em>. The model regresses to this constant target — none of the nested timing math of DDPM is needed.</p>'

+ '<h2 class="l-title">12. Rectified Flow and One-Step Generation</h2>'

+ '<p class="l-text"><strong>Liu et al., 2022.</strong> The special case of flow matching where trajectories are straight. Nature does not love straight lines: a trained flow usually produces curved paths, which forces many ODE steps at inference.</p>'

+ '<p class="l-text"><strong>The reflow procedure:</strong> Generate <em>(x<sub>0</sub>, x<sub>1</sub>)</em> pairs from the trained model (start from noise, integrate to data). Re-pair these, then force a new model to learn a <em>straight</em> line between the same pairs. Repeat — trajectories get straighter each round.</p>'

+ '<p class="l-text">When trajectories are truly straight, a single Euler step suffices: <em>x<sub>1</sub> ≈ x<sub>0</sub> + v<sub>θ</sub>(x<sub>0</sub>, 0)</em>. Applications of this idea:</p>'

+ '<ul class="l-list">'
+ '<li><strong>InstaFlow (2023):</strong> One-step text-to-image distilled from Stable Diffusion 1.5 via reflow.</li>'
+ '<li><strong>SD3-Turbo / FLUX schnell:</strong> Pro-grade quality in 4 steps — rectified flow distillation plus an adversarial loss.</li>'
+ '<li><strong>Consistency models</strong> (Song et al., 2023) share the same goal: high-quality generation in few steps.</li>'
+ '</ul>'

+ '<p class="l-text">Intuitively, rectified flow is the promise of replacing DDPM\'s 50 U-Net calls with a single matrix multiply. Production cost falls 50×.</p>'

+ '<h2 class="l-title">13. DiT — Diffusion Transformer</h2>'

+ '<p class="l-text"><strong>Peebles &amp; Xie, 2023.</strong> The answer to "can we do without the U-Net?". They replaced the latent-diffusion backbone with a Vision Transformer: split into patches, add position embeddings, run transformer blocks — predict the noise over tokens.</p>'

+ '<p class="l-text">The key innovation is <strong>adaLN-Zero</strong>: time and class conditioning is injected at every transformer block via small MLPs that produce the γ and β of LayerNorm. β is initialized to zero — modulation starts "off", a more stable initialization than FiLM.</p>'

+ '<p class="l-text"><strong>Scaling law:</strong> Scale a U-Net by 4× and FID improvement plateaus past a point. Not so for DiT — FID keeps falling smoothly as parameters grow. This brings the "bigger model = better" philosophy of NLP into image generation.</p>'

+ '<div class="calc-graph" style="height:340px"><div id="plot-dl10-flow-en"></div></div>'

+ '<script>setTimeout(function(){(function(){function draw(){if(!window.Plotly||!document.getElementById("plot-dl10-flow-en"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var xs=[],ys=[],us=[],vs=[];for(var i=-2;i<=2;i+=0.5){for(var j=-2;j<=2;j+=0.5){xs.push(i);ys.push(j);var tx=0.9*Math.cos(0.6*j);var ty=0.9*Math.sin(0.6*i);var dx=tx-i,dy=ty-j;var n=Math.sqrt(dx*dx+dy*dy)+1e-6;us.push(0.35*dx/n);vs.push(0.35*dy/n);}}var arrows=xs.map(function(x,k){return{x:x+us[k],y:ys[k]+vs[k],ax:x,ay:ys[k],xref:"x",yref:"y",axref:"x",ayref:"y",showarrow:true,arrowhead:2,arrowsize:0.9,arrowwidth:1.1,arrowcolor:hex2rgba(th.accent,0.75)};});var data=[{x:[-1.6,-1.2,1.4,1.0,-0.6],y:[-1.4,1.2,-1.0,1.5,0.2],mode:"markers",type:"scatter",marker:{size:12,color:th.accent,symbol:"circle",line:{color:th.text,width:1}},name:"Data (x₁)"},{x:[1.7,-1.7,0.9,-0.4,1.4],y:[1.6,-1.7,-1.5,1.7,0.7],mode:"markers",type:"scatter",marker:{size:10,color:hex2rgba(th.accent,0.35),symbol:"x"},name:"Noise (x₀)"}];Plotly.newPlot("plot-dl10-flow-en",data,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{range:[-2.4,2.4],gridcolor:th.grid,zerolinecolor:th.grid,color:th.text,title:"x"},yaxis:{range:[-2.4,2.4],gridcolor:th.grid,zerolinecolor:th.grid,color:th.text,title:"y",scaleanchor:"x"},annotations:arrows,margin:{t:60,r:30,b:50,l:60},height:320,legend:{font:{color:th.text}},title:{text:"Flow Matching: velocity field from noise to data",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();},250);</script>'

+ '<p class="l-text">Think of every arrow above as the velocity field <em>v<sub>θ</sub>(x, t)</em>. A noise point (×) drifts along this field until it lands at a data point (●) — diffusion\'s "thousand small denoisings" gets replaced by "swimming along one vector field".</p>'

+ '<p class="l-text"><strong>Production deployments:</strong> Sora\'s video diffusion backbone, Stable Diffusion 3, Lumina-T2X, Hunyuan-DiT — all are DiT derivatives. The U-Net is undergoing image generation\'s transformer transition, just like the LSTM → Transformer shift in NLP.</p>'

+ '<h2 class="l-title">14. The 2026 Landscape</h2>'

+ '<p class="l-text">The seven-year arc: <strong>DDPM (2020)</strong> kicked off with stochastic reverse diffusion; <strong>DDIM (2021)</strong> made the sampler deterministic and cut to 50 steps; <strong>Latent Diffusion (2022)</strong> moved compute into a VAE latent space; <strong>DiT (2023)</strong> swapped the U-Net for a transformer and unlocked scaling; <strong>Flow Matching (2023)</strong> simplified the objective; <strong>Rectified Flow (2023-2024)</strong> made one-step generation realistic. Every milestone either got faster, simpler, or higher quality.</p>'

+ '<p class="l-text">The current frontier: one-step controllable generation (the ControlNet family + rectified flow distillation), long-form video diffusion (Sora, Veo 2, Movie Gen) and 3D / world models. HD image generation in a second on a single GPU is the 2026 baseline.</p>'

+ '<div class="think-box"><strong>📌 In summary:</strong> Generative modeling = learning the data distribution. VAE is a probabilistic autoencoder; GAN a competition between two networks; diffusion rebuilds from noise; AR generates token by token. The new wave: Flow Matching simplified the loss math, Rectified Flow straightened trajectories and unlocked one-step generation, DiT swapped the U-Net for a transformer and rewrote the scaling law. Each has its own trade-offs. As of 2024 the dominant combo is image = diffusion, text = AR transformer; by 2026 the image backbone has largely migrated to DiT + flow matching. <strong>Next lesson: Production, Efficiency &amp; MLOps.</strong> We trained the model; now how do we scale, deploy, monitor it?</div>'

};
