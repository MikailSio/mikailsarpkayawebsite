window.CV_L9 = {

en: `<p class="l-text"><strong>For decades vision was about understanding pixels. Now we generate them.</strong> GANs, VAEs, and diffusion models can produce photorealistic faces, illustrate fantasy worlds from a sentence, and inpaint missing regions of an old photograph.</p>

<p class="l-text">In this lesson you will see the three generative paradigms side by side, the GAN min-max game, the VAE latent space, the forward and reverse diffusion processes, and how to call Stable Diffusion in 5 lines of HuggingFace.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compare GAN, VAE, and diffusion paradigms in objective and sample quality</li>
<li>Describe the GAN min-max game between generator and discriminator</li>
<li>Sample from a VAE latent space using the reparameterization trick</li>
<li>Walk the forward noising and reverse denoising steps of a diffusion model</li>
<li>Generate images from a text prompt with HuggingFace Stable Diffusion in 5 lines</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Three Generative Paradigms</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">GAN</div><div class="card-body">Two networks fight: generator vs discriminator. Sharp samples, hard training.</div></div>
<div class="calc-card"><div class="card-title">VAE</div><div class="card-body">Probabilistic encoder + decoder. Stable training, slightly blurry samples.</div></div>
<div class="calc-card"><div class="card-title">Diffusion</div><div class="card-body">Iteratively denoises pure noise back into an image. Slow but state-of-the-art quality.</div></div>
<div class="calc-card"><div class="card-title">Autoregressive</div><div class="card-body">Token-by-token generation (PixelCNN, image-GPT). Mostly historical now.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. GAN: The Min-Max Game</h2>
<p class="l-text">A generator G(z) maps random noise to images. A discriminator D(x) classifies real vs generated. They train alternately, each trying to defeat the other.</p>
<div class="katex-block">$$\\min_G \\max_D V(D, G) = \\mathbb{E}_{x}[\\log D(x)] + \\mathbb{E}_{z}[\\log(1 - D(G(z)))]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Discriminator</div><div class="card-body">Trained to maximize V — push D(real) → 1, D(fake) → 0.</div></div>
<div class="calc-card"><div class="card-title">Generator</div><div class="card-body">Trained to minimize V — push D(fake) → 1, fooling D.</div></div>
<div class="calc-card"><div class="card-title">Equilibrium</div><div class="card-body">In theory: D ≡ 0.5 everywhere; G samples from the data distribution.</div></div>
<div class="calc-card"><div class="card-title">Pitfalls</div><div class="card-body">Mode collapse, training instability, vanishing gradients.</div></div>
</div>
<p class="l-text">Notable variants: DCGAN (deep conv), StyleGAN (style-based), CycleGAN (unpaired translation), BigGAN (large-scale).</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. VAE: Encoder + Decoder + KL</h2>
<p class="l-text">A Variational Autoencoder learns a latent variable model. The encoder outputs mean and variance of a Gaussian; the decoder reconstructs from a sample.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Encoder</div><div class="card-body">q(z|x) = Normal(mu(x), sigma(x)).</div></div>
<div class="calc-card"><div class="card-title">Reparam trick</div><div class="card-body">z = mu + sigma · epsilon allows backprop through stochastic sampling.</div></div>
<div class="calc-card"><div class="card-title">Decoder</div><div class="card-body">p(x|z) reconstructs the image.</div></div>
<div class="calc-card"><div class="card-title">Loss</div><div class="card-body">Reconstruction error + KL(q || p) where prior p = N(0, I).</div></div>
</div>
<p class="l-text">VAE samples are smoother than GAN samples but tend to be blurry — averaging over the latent posterior makes the model conservative.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Diffusion: Forward and Reverse</h2>
<p class="l-text">A diffusion model defines a forward process that gradually adds Gaussian noise to an image over T steps, and learns the reverse process — a denoiser conditioned on the timestep.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forward q</div><div class="card-body">x_t = sqrt(alpha_t) · x_0 + sqrt(1 - alpha_t) · noise. Closed-form, no learning.</div></div>
<div class="calc-card"><div class="card-title">Reverse p</div><div class="card-body">A neural network predicts the noise that was added at step t.</div></div>
<div class="calc-card"><div class="card-title">Sampling</div><div class="card-body">Start from pure noise, iteratively subtract predicted noise across T steps.</div></div>
<div class="calc-card"><div class="card-title">Conditioning</div><div class="card-body">Inject text via cross-attention at every layer (Stable Diffusion).</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Stable Diffusion Architecture</h2>
<p class="l-text">Stable Diffusion runs the diffusion process in a compressed latent space (4x64x64 instead of 3x512x512), making it fast enough for consumer GPUs.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAE encoder</div><div class="card-body">Compresses 512x512x3 to 64x64x4 latent.</div></div>
<div class="calc-card"><div class="card-title">UNet</div><div class="card-body">Denoiser operating on the latent. Cross-attention to text embeddings.</div></div>
<div class="calc-card"><div class="card-title">Text encoder</div><div class="card-body">CLIP text transformer turns prompt into embedding.</div></div>
<div class="calc-card"><div class="card-title">VAE decoder</div><div class="card-body">Decodes final latent back to a 512x512 image.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Generate an Image with HuggingFace Diffusers</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install diffusers transformers accelerate</span>
<span class="kw">from</span> diffusers <span class="kw">import</span> StableDiffusionPipeline
<span class="kw">import</span> torch

pipe = StableDiffusionPipeline.<span class="fn">from_pretrained</span>(
    <span class="str">'runwayml/stable-diffusion-v1-5'</span>,
    torch_dtype=torch.float16
).<span class="fn">to</span>(<span class="str">'cuda'</span>)

prompt = <span class="str">'A cozy reading nook with warm light, oil painting style'</span>
image = <span class="fn">pipe</span>(prompt, num_inference_steps=<span class="num">30</span>, guidance_scale=<span class="num">7.5</span>).images[<span class="num">0</span>]
image.<span class="fn">save</span>(<span class="str">'out.png'</span>)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Toy generative density: fit a Gaussian KDE over the pixel histogram of \`img\`, then sample 200 new pixel intensities from the learned distribution.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.neighbors import KernelDensity

intensities = img.flatten().astype(np.float32).reshape(-1, 1)
kde = KernelDensity(kernel='gaussian', bandwidth=8.0).fit(intensities[:1000])

samples = kde.sample(200, random_state=0).flatten()
samples = np.clip(samples, 0, 255)

print('original mean/std:', round(float(intensities.mean()), 1), round(float(intensities.std()), 1))
print('sampled  mean/std:', round(float(samples.mean()), 1), round(float(samples.std()), 1))
print('first 8 samples:', samples[:8].astype(int).tolist())</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Load Stable Diffusion 1.5 in fp16 to fit a single 8GB GPU. 2) Provide a text prompt. 3) <code>num_inference_steps=30</code> controls quality vs speed; <code>guidance_scale</code> controls how strictly the image follows the prompt (higher = more literal). 4) Save the resulting PIL image.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Ethics and Quality Timeline</h2>
<p class="l-text">Generative image models raise serious concerns: deepfakes, copyright (training on scraped art), bias amplification, fake news. Use watermarking, attribution, and consent. The chart below tracks FID score (lower = more realistic) over time.</p>
<div id="cv-l9-plot-en" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Three paradigms: GAN, VAE, diffusion. Diffusion currently wins on quality.<br><strong>2.</strong> GANs are a min-max game between generator and discriminator.<br><strong>3.</strong> VAEs use a latent Gaussian + reparam trick; smoother but blurrier samples.<br><strong>4.</strong> Diffusion learns to invert a noising process step by step.<br><strong>5.</strong> Stable Diffusion compresses with a VAE and conditions a UNet via CLIP text embeddings.<br><strong>6.</strong> HuggingFace diffusers make text-to-image accessible in a few lines.<br><strong>7.</strong> DiT replaces the U-Net with a Transformer; SD3 and FLUX.1 use this for SOTA prompt adherence and quality.<br><strong>8.</strong> Next lesson: CLIP and multimodal models bridging vision and language.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024-2026 Landscape: DiT, Stable Diffusion 3, FLUX.1</h2>
<p class="l-text"><strong>DiT (Diffusion Transformer, Peebles and Xie, 2022)</strong> replaces the U-Net backbone of latent diffusion with a pure Transformer. Each diffusion timestep and class label is injected via adaLN (adaptive layer-norm) conditioning, and the patchified latent is processed by Transformer blocks. DiT scales cleanly with compute — bigger model, lower FID — and is the architectural backbone behind OpenAI's Sora and Stable Diffusion 3. The lesson here: when U-Net hits its scaling ceiling, swap in attention.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DiT Recipe</div><div class="card-body">VAE-encoded latent → patch tokens → N x Transformer blocks with adaLN(t, c) → predict noise. No skip connections, no convolutions.</div></div>
<div class="calc-card"><div class="card-title">Why It Wins</div><div class="card-body">Transformers scale; U-Nets plateau. DiT-XL/2 hits FID 2.27 on ImageNet 256, beating prior diffusion SOTA.</div></div>
</div>
<p class="l-text"><strong>Stable Diffusion 3 (Stability AI, February 2024)</strong> uses MM-DiT (Multi-Modal Diffusion Transformer) with separate weight streams for image and text tokens that mix via joint attention. Trained with rectified flow (straighter ODE trajectories than DDPM), the 8B model leads on prompt adherence and typography — finally rendering legible text inside images, a long-standing diffusion failure mode.</p>
<p class="l-text"><strong>FLUX.1 (Black Forest Labs, August 2024)</strong> is a 12B parameter transformer-based diffusion model from the original Stable Diffusion team. Four variants: <em>pro</em> (API-only, top quality), <em>dev</em> (open weights, non-commercial), <em>schnell</em> (Apache 2.0, distilled 4-step generation), and <em>Kontext</em> (image editing). FLUX currently leads most blind quality evaluations against MidJourney v6 and DALL-E 3.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SD3 vs FLUX</div><div class="card-body">SD3 = open weights and rectified-flow purity. FLUX = highest raw quality, schnell variant runs in 4 steps on consumer GPUs.</div></div>
<div class="calc-card"><div class="card-title">NLP Crossover</div><div class="card-body">MM-DiT's joint attention is the same recipe vision-language models use — diffusion image generation and LLM token prediction now share architecture.</div></div>
</div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var years = [2014, 2017, 2018, 2019, 2021, 2022, 2023];
  var fid   = [62, 28, 20, 12, 8, 4.5, 3.0];
  var trace = { x: years, y: fid, mode:'lines+markers', line:{color:'#c8a96e'}, marker:{color:'#c8a96e'} };
  var layout = { margin:{t:20,r:20,b:50,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, xaxis:{title:'Year'}, yaxis:{title:'FID (lower better)'} };
  var en = document.getElementById('cv-l9-plot-en'); if (en) Plotly.newPlot(en, [trace], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l9-plot-tr'); if (tr) Plotly.newPlot(tr, [trace], Object.assign({}, layout, {xaxis:{title:'Yıl'}, yaxis:{title:'FID (düşük iyidir)'}}), {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Onlarca yıl görme pikselleri anlamakla ilgiliydi. Şimdi onları üretiyoruz.</strong> GAN'lar, VAE'ler ve difüzyon modelleri fotoğraf gerçekçiliğinde yüzler üretebiliyor, bir cümleden fantastik dünyalar çiziyor ve eski bir fotoğrafın eksik bölümlerini tamamlıyor.</p>

<p class="l-text">Bu derste üç üretici paradigmayı yan yana göreceksiniz: GAN'ın min-max oyunu, VAE'nin gizli uzayı, difüzyonun ileri ve geri süreçleri ve 5 satırda Stable Diffusion çağrısı.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>GAN, VAE ve difüzyon paradigmalarını amaç ve örnek kalitesi açısından karşılaştırmayı</li>
<li>GAN'ın generator ile discriminator arasındaki min-max oyununu açıklamayı</li>
<li>Reparameterization trick ile VAE gizli uzayından örnekleme yapmayı</li>
<li>Bir difüzyon modelinin ileri gürültü ekleme ve geri gürültü giderme adımlarını izlemeyi</li>
<li>HuggingFace Stable Diffusion ile metin promptundan 5 satırda görüntü üretmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Üç Üretici Paradigma</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">GAN</div><div class="card-body">İki ağ kavga eder: jeneratör ve ayırt edici. Keskin örnekler, zor eğitim.</div></div>
<div class="calc-card"><div class="card-title">VAE</div><div class="card-body">Olasılıksal enkoder + dekoder. Kararlı eğitim, biraz bulanık örnekler.</div></div>
<div class="calc-card"><div class="card-title">Difüzyon</div><div class="card-body">Saf gürültüden iteratif olarak görüntüye geri gürültü siler. Yavaş ama SOTA kalitesinde.</div></div>
<div class="calc-card"><div class="card-title">Otoregresif</div><div class="card-body">Jeton jeton üretim (PixelCNN, image-GPT). Bugün çoğunlukla tarihte kaldı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. GAN: Min-Max Oyunu</h2>
<p class="l-text">G(z) jeneratörü rastgele gürültüyü görüntüye eşler. D(x) ayırt edici gerçek ile üretilmişi sınıflar. Sırayla eğitilirler, her biri diğerini yenmeye çalışır.</p>
<div class="katex-block">$$\\min_G \\max_D V(D, G) = \\mathbb{E}_{x}[\\log D(x)] + \\mathbb{E}_{z}[\\log(1 - D(G(z)))]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ayırt edici</div><div class="card-body">V'yi maksimize eder — D(gerçek) → 1, D(sahte) → 0.</div></div>
<div class="calc-card"><div class="card-title">Jeneratör</div><div class="card-body">V'yi minimize eder — D(sahte) → 1, D'yi kandırır.</div></div>
<div class="calc-card"><div class="card-title">Denge</div><div class="card-body">Teoride: D ≡ 0.5 her yerde; G veri dağılımından örnek üretir.</div></div>
<div class="calc-card"><div class="card-title">Tuzaklar</div><div class="card-body">Mod çöküşü, eğitim kararsızlığı, kaybolan gradyanlar.</div></div>
</div>
<p class="l-text">Önemli varyantlar: DCGAN (derin konv), StyleGAN (stil tabanlı), CycleGAN (eşleşmemiş çeviri), BigGAN (büyük ölçek).</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. VAE: Enkoder + Dekoder + KL</h2>
<p class="l-text">Varyasyonel Otoenkoder gizli değişken modeli öğrenir. Enkoder bir Gauss'un ortalama ve varyansını çıkarır; dekoder bir örnekten yeniden inşa eder.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Enkoder</div><div class="card-body">q(z|x) = Normal(mu(x), sigma(x)).</div></div>
<div class="calc-card"><div class="card-title">Reparam hilesi</div><div class="card-body">z = mu + sigma · epsilon — stokastik örneklemeden geri yayılım yapılabilir.</div></div>
<div class="calc-card"><div class="card-title">Dekoder</div><div class="card-body">p(x|z) görüntüyü yeniden inşa eder.</div></div>
<div class="calc-card"><div class="card-title">Kayıp</div><div class="card-body">Yeniden inşa hatası + KL(q || p), önsel p = N(0, I).</div></div>
</div>
<p class="l-text">VAE örnekleri GAN örneklerinden daha yumuşaktır ama bulanık olma eğilimindedir — gizli posterior üzerinden ortalama almak modeli muhafazakâr yapar.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Difüzyon: İleri ve Geri</h2>
<p class="l-text">Difüzyon modeli bir görüntüye T adımda kademeli Gauss gürültüsü ekleyen ileri süreç tanımlar ve geri süreci öğrenir — zaman adımına koşullu bir gürültü gidericidir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">İleri q</div><div class="card-body">x_t = sqrt(alpha_t) · x_0 + sqrt(1 - alpha_t) · gürültü. Kapalı form, öğrenme yok.</div></div>
<div class="calc-card"><div class="card-title">Geri p</div><div class="card-body">Bir sinir ağı t adımında eklenen gürültüyü tahmin eder.</div></div>
<div class="calc-card"><div class="card-title">Örnekleme</div><div class="card-body">Saf gürültüden başla, T adımda tahmin edilen gürültüyü iteratif çıkar.</div></div>
<div class="calc-card"><div class="card-title">Koşullama</div><div class="card-body">Her katmanda çapraz dikkat ile metin enjekte (Stable Diffusion).</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Stable Diffusion Mimarisi</h2>
<p class="l-text">Stable Diffusion difüzyon sürecini sıkıştırılmış gizli uzayda (3x512x512 yerine 4x64x64) çalıştırır; tüketici GPU'larında bile yeterince hızlıdır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAE enkoder</div><div class="card-body">512x512x3'ü 64x64x4 gizli alana sıkıştırır.</div></div>
<div class="calc-card"><div class="card-title">UNet</div><div class="card-body">Gizli alanda çalışan gürültü gidericisi. Metin gömmelerine çapraz dikkat.</div></div>
<div class="calc-card"><div class="card-title">Metin enkoderi</div><div class="card-body">CLIP metin Transformer'ı prompt'u gömme vektörüne çevirir.</div></div>
<div class="calc-card"><div class="card-title">VAE dekoderi</div><div class="card-body">Son gizliyi 512x512 görüntüye geri çözer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. HuggingFace Diffusers ile Görüntü Üret</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install diffusers transformers accelerate</span>
<span class="kw">from</span> diffusers <span class="kw">import</span> StableDiffusionPipeline
<span class="kw">import</span> torch

pipe = StableDiffusionPipeline.<span class="fn">from_pretrained</span>(
    <span class="str">'runwayml/stable-diffusion-v1-5'</span>,
    torch_dtype=torch.float16
).<span class="fn">to</span>(<span class="str">'cuda'</span>)

prompt = <span class="str">'Sıcak ışıkta rahat bir okuma köşesi, yağlı boya tarzı'</span>
gor = <span class="fn">pipe</span>(prompt, num_inference_steps=<span class="num">30</span>, guidance_scale=<span class="num">7.5</span>).images[<span class="num">0</span>]
gor.<span class="fn">save</span>(<span class="str">'cikis.png'</span>)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak üretici yoğunluk: \`img\` piksel histogramı üzerinde Gaussian KDE fit'le, sonra öğrenilmiş dağılımdan 200 yeni piksel yoğunluğu örnekle.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.neighbors import KernelDensity

intensities = img.flatten().astype(np.float32).reshape(-1, 1)
kde = KernelDensity(kernel='gaussian', bandwidth=8.0).fit(intensities[:1000])

samples = kde.sample(200, random_state=0).flatten()
samples = np.clip(samples, 0, 255)

print('original mean/std:', round(float(intensities.mean()), 1), round(float(intensities.std()), 1))
print('sampled  mean/std:', round(float(samples.mean()), 1), round(float(samples.std()), 1))
print('first 8 samples:', samples[:8].astype(int).tolist())</code></pre></div></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) 8GB tek GPU'ya sığması için Stable Diffusion 1.5'i fp16'da yükle. 2) Metin prompt'u ver. 3) <code>num_inference_steps=30</code> kalite-hız dengesini, <code>guidance_scale</code> görüntünün prompt'a sadakatini kontrol eder (yüksek = daha düz). 4) PIL görüntüsünü kaydet.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Etik ve Kalite Zaman Çizelgesi</h2>
<p class="l-text">Üretici görüntü modelleri ciddi kaygılar doğurur: deepfake, telif (kazınmış sanat üzerinde eğitim), önyargı yükseltme, sahte haber. Filigran, atıf ve onay kullanın. Aşağıdaki grafik FID skorunu (düşük = daha gerçekçi) zaman içinde izler.</p>
<div id="cv-l9-plot-tr" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Üç paradigma: GAN, VAE, difüzyon. Difüzyon kalitede şu an önde.<br><strong>2.</strong> GAN'lar jeneratör ve ayırt edici arasında min-max oyunudur.<br><strong>3.</strong> VAE'ler gizli Gauss + reparam hilesi kullanır; daha yumuşak ama bulanık örnekler.<br><strong>4.</strong> Difüzyon adım adım gürültüleme sürecini tersine çevirmeyi öğrenir.<br><strong>5.</strong> Stable Diffusion VAE ile sıkıştırır ve UNet'i CLIP metin gömmeleri ile koşullar.<br><strong>6.</strong> HuggingFace diffusers, metinden görüntüyü birkaç satıra indirir.<br><strong>7.</strong> DiT, U-Net'i Transformer ile değiştirir; SD3 ve FLUX.1 bu mimariyle prompt sadakatinde ve kalitede SOTA'ya ulaşır.<br><strong>8.</strong> Sonraki ders: CLIP ve görmeyle dili köprüleyen çok modlu modeller.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024-2026 Panorama: DiT, Stable Diffusion 3, FLUX.1</h2>
<p class="l-text"><strong>DiT (Diffusion Transformer, Peebles ve Xie, 2022)</strong>, gizli uzay difüzyonunun U-Net omurgasını saf bir Transformer ile değiştirir. Her difüzyon zaman adımı ve sınıf etiketi adaLN (uyarlanır katman normalleştirme) koşullandırması ile enjekte edilir; yamalanmış gizli temsil Transformer bloklarıyla işlenir. DiT hesap gücüyle düzgün ölçeklenir — daha büyük model, daha düşük FID — ve OpenAI'nin Sora'sı ile Stable Diffusion 3'ün arkasındaki mimari omurgadır. Ders şu: U-Net tavanına çarptığında dikkati devreye al.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DiT Tarifi</div><div class="card-body">VAE ile kodlanmış gizli → yama jetonları → adaLN(t, c) ile N x Transformer bloğu → gürültü tahmini. Atlama bağlantısı ve konvolüsyon yok.</div></div>
<div class="calc-card"><div class="card-title">Neden Kazanır</div><div class="card-body">Transformer'lar ölçeklenir; U-Net'ler platoya ulaşır. DiT-XL/2 ImageNet 256 üzerinde FID 2.27'ye düşerek önceki difüzyon SOTA'yı geçer.</div></div>
</div>
<p class="l-text"><strong>Stable Diffusion 3 (Stability AI, Şubat 2024)</strong>, görüntü ve metin jetonları için ayrı ağırlık akışları taşıyan ve ortak dikkat ile karışan MM-DiT (Çok Modlu Difüzyon Transformer'ı) kullanır. Doğrusallaştırılmış akış (rectified flow, DDPM'den daha düz ODE yörüngeleri) ile eğitilen 8B model prompt sadakatinde ve tipografide önde — uzun süredir difüzyonun başarısız olduğu görüntü içinde okunabilir metin nihayet çiziliyor.</p>
<p class="l-text"><strong>FLUX.1 (Black Forest Labs, Ağustos 2024)</strong>, orijinal Stable Diffusion ekibinden gelen 12B parametreli transformer tabanlı bir difüzyon modelidir. Dört varyant: <em>pro</em> (yalnızca API, en yüksek kalite), <em>dev</em> (açık ağırlıklar, ticari değil), <em>schnell</em> (Apache 2.0, 4 adımda damıtılmış üretim) ve <em>Kontext</em> (görüntü düzenleme). FLUX şu an MidJourney v6 ve DALL-E 3 karşısındaki çoğu kör kalite değerlendirmesinin önünde.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SD3 ve FLUX</div><div class="card-body">SD3 = açık ağırlıklar ve doğrusallaştırılmış akış saflığı. FLUX = en yüksek ham kalite; schnell varyantı tüketici GPU'sunda 4 adımda çalışır.</div></div>
<div class="calc-card"><div class="card-title">NLP Köprüsü</div><div class="card-body">MM-DiT'in ortak dikkati görme-dil modellerinin kullandığı tarifle aynı — difüzyon görüntü üretimi ve LLM jeton tahmini artık aynı mimariyi paylaşıyor.</div></div>
</div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var years = [2014, 2017, 2018, 2019, 2021, 2022, 2023];
  var fid   = [62, 28, 20, 12, 8, 4.5, 3.0];
  var trace = { x: years, y: fid, mode:'lines+markers', line:{color:'#c8a96e'}, marker:{color:'#c8a96e'} };
  var layout = { margin:{t:20,r:20,b:50,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, xaxis:{title:'Yıl'}, yaxis:{title:'FID (düşük daha iyi)'} };
  var en = document.getElementById('cv-l9-plot-en'); if (en) Plotly.newPlot(en, [trace], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l9-plot-tr'); if (tr) Plotly.newPlot(tr, [trace], Object.assign({}, layout, {xaxis:{title:'Yıl'}, yaxis:{title:'FID (düşük iyidir)'}}), {displayModeBar:false});
}, 250);</script>
`
};
