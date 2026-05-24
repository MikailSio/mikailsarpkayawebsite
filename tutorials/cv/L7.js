window.CV_L7 = {

en: `<p class="l-text"><strong>Detection puts a box around an object. Segmentation paints every pixel with a class label.</strong> This pixel-level precision is what powers self-driving lane detection, medical tumor outlining, and Photoshop's "select subject".</p>

<p class="l-text">In this lesson you will learn the encoder-decoder pattern, the U-Net skip-connection trick, dilated convolutions in DeepLab, the Dice loss, and how to train a small segmentation model in PyTorch.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish semantic, instance, and panoptic segmentation by output structure</li>
<li>Build the encoder-decoder pattern and the U-Net skip-connection architecture</li>
<li>Use dilated (atrous) convolutions in DeepLab to enlarge receptive field</li>
<li>Train with Dice loss to handle imbalanced foreground vs background pixels</li>
<li>Train a small U-Net in PyTorch and evaluate with the mIoU metric</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Pixel-Level Classification</h2>
<p class="l-text">Semantic segmentation outputs a label per pixel — a tensor of shape H x W where each cell is a class index. Instance segmentation goes further and distinguishes individual objects of the same class.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Semantic</div><div class="card-body">Class per pixel. All cars share one label.</div></div>
<div class="calc-card"><div class="card-title">Instance</div><div class="card-body">Each object instance has its own ID.</div></div>
<div class="calc-card"><div class="card-title">Panoptic</div><div class="card-body">Combines both — semantic for stuff (sky, road), instance for things (cars, people).</div></div>
<div class="calc-card"><div class="card-title">Output shape</div><div class="card-body">For C classes: logits tensor of shape (C, H, W) per image.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Encoder-Decoder Architecture</h2>
<p class="l-text">A classification CNN downsamples to a small feature map. To get back to per-pixel output, segmentation networks add a decoder that upsamples step by step.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Encoder</div><div class="card-body">Stacks of conv + pool. Spatial size shrinks; channel depth grows.</div></div>
<div class="calc-card"><div class="card-title">Bottleneck</div><div class="card-body">Smallest, most abstract feature map.</div></div>
<div class="calc-card"><div class="card-title">Decoder</div><div class="card-body">Transposed conv or upsample + conv. Recovers spatial size.</div></div>
<div class="calc-card"><div class="card-title">Final 1x1 conv</div><div class="card-body">Maps decoder features to C class logits per pixel.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. U-Net: Skip Connections to the Rescue</h2>
<p class="l-text">U-Net (2015) added the key insight: at each decoder level, concatenate features from the matching encoder level. Skip connections preserve spatial detail that pooling destroys.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Symmetric</div><div class="card-body">Mirror image: 4 down-blocks → bottleneck → 4 up-blocks.</div></div>
<div class="calc-card"><div class="card-title">Skip = concat</div><div class="card-body">Decoder receives both upsampled and matching encoder features.</div></div>
<div class="calc-card"><div class="card-title">Origin</div><div class="card-body">Designed for biomedical image segmentation with limited data.</div></div>
<div class="calc-card"><div class="card-title">Today</div><div class="card-body">U-Net variants are the default in medical, satellite, and microscopy segmentation.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

<span class="kw">def</span> <span class="fn">conv_block</span>(c_in, c_out):
    <span class="kw">return</span> nn.<span class="fn">Sequential</span>(
        nn.<span class="fn">Conv2d</span>(c_in, c_out, <span class="num">3</span>, padding=<span class="num">1</span>), nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),
        nn.<span class="fn">Conv2d</span>(c_out, c_out, <span class="num">3</span>, padding=<span class="num">1</span>), nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),
    )

<span class="kw">class</span> <span class="fn">UNet</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, c_in=<span class="num">3</span>, c_out=<span class="num">2</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.d1 = <span class="fn">conv_block</span>(c_in, <span class="num">64</span>)
        self.d2 = <span class="fn">conv_block</span>(<span class="num">64</span>, <span class="num">128</span>)
        self.d3 = <span class="fn">conv_block</span>(<span class="num">128</span>, <span class="num">256</span>)
        self.bn = <span class="fn">conv_block</span>(<span class="num">256</span>, <span class="num">512</span>)
        self.u3 = <span class="fn">conv_block</span>(<span class="num">512</span>+<span class="num">256</span>, <span class="num">256</span>)
        self.u2 = <span class="fn">conv_block</span>(<span class="num">256</span>+<span class="num">128</span>, <span class="num">128</span>)
        self.u1 = <span class="fn">conv_block</span>(<span class="num">128</span>+<span class="num">64</span>,  <span class="num">64</span>)
        self.head = nn.<span class="fn">Conv2d</span>(<span class="num">64</span>, c_out, <span class="num">1</span>)

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        d1 = self.<span class="fn">d1</span>(x)
        d2 = self.<span class="fn">d2</span>(F.<span class="fn">max_pool2d</span>(d1, <span class="num">2</span>))
        d3 = self.<span class="fn">d3</span>(F.<span class="fn">max_pool2d</span>(d2, <span class="num">2</span>))
        bn = self.<span class="fn">bn</span>(F.<span class="fn">max_pool2d</span>(d3, <span class="num">2</span>))
        u3 = self.<span class="fn">u3</span>(torch.<span class="fn">cat</span>([F.<span class="fn">interpolate</span>(bn, scale_factor=<span class="num">2</span>), d3], <span class="num">1</span>))
        u2 = self.<span class="fn">u2</span>(torch.<span class="fn">cat</span>([F.<span class="fn">interpolate</span>(u3, scale_factor=<span class="num">2</span>), d2], <span class="num">1</span>))
        u1 = self.<span class="fn">u1</span>(torch.<span class="fn">cat</span>([F.<span class="fn">interpolate</span>(u2, scale_factor=<span class="num">2</span>), d1], <span class="num">1</span>))
        <span class="kw">return</span> self.<span class="fn">head</span>(u1)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Toy semantic segmentation: KMeans on pixel colors of \`img\` produces a 3-cluster mask. Same intuition as a U-Net would learn.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.cluster import KMeans
import numpy as np

H, W, C = img.shape
pixels = img.reshape(-1, 3).astype(np.float32) / 255.0

km = KMeans(n_clusters=3, n_init=4, random_state=0).fit(pixels)
mask = km.labels_.reshape(H, W)

print('cluster sizes:', np.bincount(km.labels_))
print('cluster centers (RGB):')
for i, c in enumerate(km.cluster_centers_):
    print(' ', i, (c * 255).astype(int).tolist())
print('mask shape:', mask.shape)</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Each block is two 3x3 convs with ReLU. 2) Encoder doubles channels at each downsampling step. 3) Bottleneck reaches 512 channels. 4) Decoder upsamples by 2 then concatenates the matching encoder feature before convolving. 5) Final 1x1 conv outputs C class logits per pixel.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Dilated/Atrous Convolutions (DeepLab)</h2>
<p class="l-text">Pooling shrinks the feature map and loses detail. Dilated convolutions enlarge the receptive field without downsampling — they insert gaps between kernel taps.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dilation rate</div><div class="card-body">d=2 means kernel taps are spaced 2 pixels apart. d=1 is normal conv.</div></div>
<div class="calc-card"><div class="card-title">RF growth</div><div class="card-body">3x3 kernel with d=2 has a 5x5 receptive field but the same 9 weights.</div></div>
<div class="calc-card"><div class="card-title">ASPP</div><div class="card-body">Atrous Spatial Pyramid Pooling — parallel convs with multiple dilations capture multi-scale context.</div></div>
<div class="calc-card"><div class="card-title">DeepLabV3+</div><div class="card-body">ResNet/Xception backbone + ASPP + simple decoder. State-of-the-art for years.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Loss Functions: CE, Dice, Focal</h2>
<p class="l-text">Choice of loss is critical when classes are highly imbalanced (lots of background, few foreground).</p>
<div class="katex-block">$$\\text{Dice} = \\frac{2 |A \\cap B|}{|A| + |B|}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cross-entropy</div><div class="card-body">Per-pixel softmax loss. Default; biased toward majority class on imbalanced sets.</div></div>
<div class="calc-card"><div class="card-title">Dice loss</div><div class="card-body">1 - Dice. Directly optimizes overlap; great for thin masks.</div></div>
<div class="calc-card"><div class="card-title">Focal loss</div><div class="card-body">Down-weights easy examples so the model focuses on hard pixels.</div></div>
<div class="calc-card"><div class="card-title">Combined</div><div class="card-body">Common practice: 0.5 · CE + 0.5 · Dice for stability and overlap quality.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">dice_loss</span>(pred, target, eps=<span class="num">1.0</span>):
    p = pred.<span class="fn">softmax</span>(<span class="num">1</span>)
    t = F.<span class="fn">one_hot</span>(target, num_classes=p.<span class="fn">size</span>(<span class="num">1</span>)).<span class="fn">permute</span>(<span class="num">0</span>,<span class="num">3</span>,<span class="num">1</span>,<span class="num">2</span>).<span class="fn">float</span>()
    inter = (p * t).<span class="fn">sum</span>(dim=(<span class="num">2</span>,<span class="num">3</span>))
    denom = p.<span class="fn">sum</span>(dim=(<span class="num">2</span>,<span class="num">3</span>)) + t.<span class="fn">sum</span>(dim=(<span class="num">2</span>,<span class="num">3</span>))
    <span class="kw">return</span> <span class="num">1</span> - (<span class="num">2</span>*inter + eps) / (denom + eps)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Softmax probs from logits. 2) One-hot encode target labels to (B, C, H, W). 3) Per-class intersection and denominator summed over spatial dims. 4) Dice formula with eps for numerical stability — 1 minus Dice gives a loss to minimize.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Training and Inference</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
model = <span class="fn">UNet</span>(c_in=<span class="num">3</span>, c_out=<span class="num">2</span>).<span class="fn">to</span>(device)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)
ce  = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="kw">for</span> x, y <span class="kw">in</span> loader:
    x, y = x.<span class="fn">to</span>(device), y.<span class="fn">to</span>(device).<span class="fn">long</span>()
    logits = <span class="fn">model</span>(x)
    loss = <span class="num">0.5</span>*<span class="fn">ce</span>(logits, y) + <span class="num">0.5</span>*<span class="fn">dice_loss</span>(logits, y).<span class="fn">mean</span>()
    opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()

<span class="cm"># Inference</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    mask = <span class="fn">model</span>(image.<span class="fn">unsqueeze</span>(<span class="num">0</span>)).<span class="fn">argmax</span>(<span class="num">1</span>)[<span class="num">0</span>].<span class="fn">cpu</span>().<span class="fn">numpy</span>()
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mock training loop: KMeans is fit-once but we expose the equivalent epochs concept by re-clustering with different inits and tracking inertia (loss).</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.cluster import KMeans
import numpy as np

pixels = img.reshape(-1, 3).astype(np.float32) / 255.0

losses = []
for epoch in range(5):
    km = KMeans(n_clusters=3, n_init=1, random_state=epoch).fit(pixels)
    losses.append(km.inertia_)
    print(f'epoch {epoch+1}  loss(inertia) = {km.inertia_:.2f}')

print('final mask uniq labels:', np.unique(km.labels_))</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) AdamW + combined loss. 2) Standard forward/backward loop where loss is the average of CE and Dice. 3) At inference, take argmax over class dim to get a (H, W) integer mask. 4) Often we follow with light morphological cleanup or a fully-connected CRF for sharper boundaries.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Evaluating: Per-Class IoU</h2>
<p class="l-text">Mean IoU is the standard segmentation metric. Below: typical per-class IoU on a small road-scene model.</p>
<div id="cv-l7-plot-en" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Segmentation labels every pixel; instance segmentation also distinguishes objects.<br><strong>2.</strong> Encoder-decoder networks downsample to learn features and upsample to produce dense predictions.<br><strong>3.</strong> U-Net skip connections preserve fine spatial detail.<br><strong>4.</strong> Dilated convolutions and ASPP grow receptive fields without losing resolution.<br><strong>5.</strong> CE + Dice loss handles class imbalance well.<br><strong>6.</strong> Mean IoU is the standard quality metric.<br><strong>7.</strong> SAM 2 (2024) extends prompt-based segmentation to video with a memory module.<br><strong>8.</strong> Next lesson: Vision Transformers — replacing convolution with attention.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024-2026 Landscape: SAM 2</h2>
<p class="l-text"><strong>SAM 2 (Segment Anything Model 2, Meta, July 2024)</strong> brought video segmentation to the SAM family. The original SAM (2023) handled images; SAM 2 unifies images and video with a memory module that tracks objects across frames. It hits roughly 6x speedup on images and 8x accuracy on video versus prior SOTA, runs at about 44 FPS for live segmentation, and is the first prompt-based foundation model for video — click once on an object, segment it across the entire video.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Architecture</div><div class="card-body">ViT-H / ViT-L image encoder + memory attention + mask decoder. Promptable with clicks, boxes, masks.</div></div>
<div class="calc-card"><div class="card-title">SA-V Dataset</div><div class="card-body">50.9k videos and 35.5M masks — the largest video segmentation dataset ever, generated semi-automatically with SAM 2 in the loop.</div></div>
<div class="calc-card"><div class="card-title">Use cases</div><div class="card-body">Medical video annotation, AR/VR object isolation, robotics tracking, autonomous driving lane segmentation.</div></div>
<div class="calc-card"><div class="card-title">License</div><div class="card-body">Apache 2.0. Try via <code>sam2.build_sam2_video_predictor</code>. Live demo: sam2.metademolab.com</div></div>
</div>
<p class="l-text">For NLP practitioners with audio interests: SAM 2's memory-attention pattern (tokens carry across frames) is the same idea NLP uses with KV-cache and recurrent state — the segmentation world has finally caught up to the sequence world.</p>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var classes = ['Road','Car','Pedestrian','Sign','Sidewalk','Building'];
  var iou = [0.92, 0.81, 0.55, 0.62, 0.74, 0.86];
  var trace = { x: classes, y: iou, type:'bar', marker:{color:'#c8a96e'} };
  var layout = { margin:{t:20,r:20,b:60,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, yaxis:{title:'IoU', range:[0,1]} };
  var en = document.getElementById('cv-l7-plot-en'); if (en) Plotly.newPlot(en, [trace], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l7-plot-tr'); if (tr) Plotly.newPlot(tr, [{x:['Yol','Araba','Yaya','İşaret','Kaldırım','Bina'],y:iou,type:'bar',marker:{color:'#c8a96e'}}], layout, {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Tespit, nesneye kutu çizer. Bölütleme her pikseli sınıf etiketiyle boyar.</strong> Bu piksel düzeyindeki hassasiyet, sürücüsüz şerit tespitini, tıbbi tümör konturlamayı ve Photoshop'taki "Konuyu Seç"i besleyen şeydir.</p>

<p class="l-text">Bu derste enkoder-dekoder desenini, U-Net atlama bağlantısı hilesini, DeepLab'da dilatlı konvolüsyonları, Dice kaybını ve PyTorch'ta küçük bir bölütleme modelinin nasıl eğitileceğini öğreneceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Anlamsal, örnek ve panoptik bölütleme arasındaki çıktı yapısı farkını ayırt etmeyi</li>
<li>Enkoder-dekoder desenini ve U-Net skip-connection mimarisini kurmayı</li>
<li>DeepLab'da alıcı alanı genişletmek için dilatlı (atrous) konvolüsyon kullanmayı</li>
<li>Dengesiz ön plan/arka plan piksellerini yönetmek için Dice loss ile eğitmeyi</li>
<li>PyTorch'ta küçük bir U-Net eğitmeyi ve mIoU metriği ile değerlendirmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Piksel Düzeyinde Sınıflandırma</h2>
<p class="l-text">Semantik bölütleme her piksele etiket çıkarır — H x W tensörünün her hücresi bir sınıf indeksidir. Örnek (instance) bölütleme bir adım daha gider ve aynı sınıftan ayrı nesneleri ayırt eder.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Semantik</div><div class="card-body">Piksel başına sınıf. Tüm arabalar tek etiket.</div></div>
<div class="calc-card"><div class="card-title">Örnek</div><div class="card-body">Her nesne örneğinin kendi kimliği var.</div></div>
<div class="calc-card"><div class="card-title">Panoptik</div><div class="card-body">İkisini birleştirir — yığınlar (gökyüzü, yol) için semantik, şeyler (araba, kişi) için örnek.</div></div>
<div class="calc-card"><div class="card-title">Çıkış şekli</div><div class="card-body">C sınıf için: görüntü başına (C, H, W) logit tensörü.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Enkoder-Dekoder Mimarisi</h2>
<p class="l-text">Sınıflandırma CNN'i küçük bir özellik haritasına aşağı örnekler. Piksel başına çıktıya dönmek için bölütleme ağları adım adım yukarı örnekleyen bir dekoder ekler.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Enkoder</div><div class="card-body">Konv + havuz yığınları. Uzamsal boyut küçülür; kanal derinliği büyür.</div></div>
<div class="calc-card"><div class="card-title">Darboğaz</div><div class="card-body">En küçük, en soyut özellik haritası.</div></div>
<div class="calc-card"><div class="card-title">Dekoder</div><div class="card-body">Devrik konv ya da upsample + konv. Uzamsal boyutu geri kazanır.</div></div>
<div class="calc-card"><div class="card-title">Son 1x1 konv</div><div class="card-body">Dekoder özelliklerini piksel başına C sınıf logit'ine eşler.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. U-Net: Atlama Bağlantıları</h2>
<p class="l-text">U-Net (2015) anahtar fikri ekledi: her dekoder seviyesinde, eşleşen enkoder seviyesinden gelen özellikleri birleştir. Atlama bağlantıları, havuzlamanın yok ettiği uzamsal detayı korur.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Simetrik</div><div class="card-body">Ayna görüntüsü: 4 aşağı blok → darboğaz → 4 yukarı blok.</div></div>
<div class="calc-card"><div class="card-title">Atlama = concat</div><div class="card-body">Dekoder hem yukarı örneklenmiş hem de eşleşen enkoder özelliklerini alır.</div></div>
<div class="calc-card"><div class="card-title">Kökeni</div><div class="card-body">Sınırlı veriyle biyomedikal görüntü bölütlemesi için tasarlandı.</div></div>
<div class="calc-card"><div class="card-title">Bugün</div><div class="card-body">U-Net varyantları tıbbi, uydu ve mikroskopi bölütlemesinde varsayılandır.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

<span class="kw">def</span> <span class="fn">conv_block</span>(c_in, c_out):
    <span class="kw">return</span> nn.<span class="fn">Sequential</span>(
        nn.<span class="fn">Conv2d</span>(c_in, c_out, <span class="num">3</span>, padding=<span class="num">1</span>), nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),
        nn.<span class="fn">Conv2d</span>(c_out, c_out, <span class="num">3</span>, padding=<span class="num">1</span>), nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),
    )

<span class="kw">class</span> <span class="fn">UNet</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, c_in=<span class="num">3</span>, c_out=<span class="num">2</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.d1 = <span class="fn">conv_block</span>(c_in, <span class="num">64</span>)
        self.d2 = <span class="fn">conv_block</span>(<span class="num">64</span>, <span class="num">128</span>)
        self.d3 = <span class="fn">conv_block</span>(<span class="num">128</span>, <span class="num">256</span>)
        self.bn = <span class="fn">conv_block</span>(<span class="num">256</span>, <span class="num">512</span>)
        self.u3 = <span class="fn">conv_block</span>(<span class="num">512</span>+<span class="num">256</span>, <span class="num">256</span>)
        self.u2 = <span class="fn">conv_block</span>(<span class="num">256</span>+<span class="num">128</span>, <span class="num">128</span>)
        self.u1 = <span class="fn">conv_block</span>(<span class="num">128</span>+<span class="num">64</span>,  <span class="num">64</span>)
        self.bas = nn.<span class="fn">Conv2d</span>(<span class="num">64</span>, c_out, <span class="num">1</span>)

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        d1 = self.<span class="fn">d1</span>(x)
        d2 = self.<span class="fn">d2</span>(F.<span class="fn">max_pool2d</span>(d1, <span class="num">2</span>))
        d3 = self.<span class="fn">d3</span>(F.<span class="fn">max_pool2d</span>(d2, <span class="num">2</span>))
        bn = self.<span class="fn">bn</span>(F.<span class="fn">max_pool2d</span>(d3, <span class="num">2</span>))
        u3 = self.<span class="fn">u3</span>(torch.<span class="fn">cat</span>([F.<span class="fn">interpolate</span>(bn, scale_factor=<span class="num">2</span>), d3], <span class="num">1</span>))
        u2 = self.<span class="fn">u2</span>(torch.<span class="fn">cat</span>([F.<span class="fn">interpolate</span>(u3, scale_factor=<span class="num">2</span>), d2], <span class="num">1</span>))
        u1 = self.<span class="fn">u1</span>(torch.<span class="fn">cat</span>([F.<span class="fn">interpolate</span>(u2, scale_factor=<span class="num">2</span>), d1], <span class="num">1</span>))
        <span class="kw">return</span> self.<span class="fn">bas</span>(u1)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak semantik segmentasyon: \`img\` piksel renkleri üzerinde KMeans 3-küme maske üretir. U-Net'in öğreneceği sezginin aynısı.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.cluster import KMeans
import numpy as np

H, W, C = img.shape
pikseller = img.reshape(-1, 3).astype(np.float32) / 255.0

km = KMeans(n_clusters=3, n_init=4, random_state=0).fit(pikseller)
maske = km.labels_.reshape(H, W)

print('küme boyutları:', np.bincount(km.labels_))
print('küme merkezleri (RGB):')
for i, c in enumerate(km.cluster_centers_):
    print(' ', i, (c * 255).astype(int).tolist())
print('maske şekli:', maske.shape)</code></pre></div></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Her blok ReLU'lu iki 3x3 konv. 2) Enkoder her aşağı örnekleme adımında kanalları ikiye katlar. 3) Darboğaz 512 kanala ulaşır. 4) Dekoder 2 kat upsample yapıp eşleşen enkoder özelliğini birleştirip konvolüsyon uygular. 5) Son 1x1 konv piksel başına C sınıf logit'i çıkarır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Dilatlı/Atrous Konvolüsyonlar (DeepLab)</h2>
<p class="l-text">Havuzlama özellik haritasını küçültür ve detay kaybeder. Dilatlı konvolüsyonlar aşağı örneklemeden alıcı alanı büyütür — çekirdek noktaları arasına boşluk koyar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dilation oranı</div><div class="card-body">d=2, çekirdek noktaları 2 piksel arayla. d=1 normal konv.</div></div>
<div class="calc-card"><div class="card-title">Alıcı alan</div><div class="card-body">d=2 ile 3x3 çekirdek 5x5 alıcı alana sahip ama yine 9 ağırlık.</div></div>
<div class="calc-card"><div class="card-title">ASPP</div><div class="card-body">Atrous Spatial Pyramid Pooling — paralel çoklu dilation konvları çoklu ölçek bağlam yakalar.</div></div>
<div class="calc-card"><div class="card-title">DeepLabV3+</div><div class="card-body">ResNet/Xception omurga + ASPP + basit dekoder. Yıllarca SOTA kaldı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Kayıp Fonksiyonları: CE, Dice, Focal</h2>
<p class="l-text">Sınıflar çok dengesiz olduğunda (çok arka plan, az ön plan) kayıp seçimi kritiktir.</p>
<div class="katex-block">$$\\text{Dice} = \\frac{2 |A \\cap B|}{|A| + |B|}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çapraz entropi</div><div class="card-body">Piksel başına softmax kaybı. Varsayılan; dengesiz setlerde çoğunluk sınıfa eğilimli.</div></div>
<div class="calc-card"><div class="card-title">Dice kaybı</div><div class="card-body">1 - Dice. Doğrudan örtüşmeyi optimize eder; ince maskelerde harika.</div></div>
<div class="calc-card"><div class="card-title">Focal kaybı</div><div class="card-body">Kolay örnekleri aşağı ağırlıklar; model zor piksellere odaklanır.</div></div>
<div class="calc-card"><div class="card-title">Birleşik</div><div class="card-body">Yaygın pratik: 0.5 · CE + 0.5 · Dice — kararlılık ve örtüşme kalitesi.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">dice_kaybi</span>(pred, hedef, eps=<span class="num">1.0</span>):
    p = pred.<span class="fn">softmax</span>(<span class="num">1</span>)
    t = F.<span class="fn">one_hot</span>(hedef, num_classes=p.<span class="fn">size</span>(<span class="num">1</span>)).<span class="fn">permute</span>(<span class="num">0</span>,<span class="num">3</span>,<span class="num">1</span>,<span class="num">2</span>).<span class="fn">float</span>()
    kesisim = (p * t).<span class="fn">sum</span>(dim=(<span class="num">2</span>,<span class="num">3</span>))
    pay = p.<span class="fn">sum</span>(dim=(<span class="num">2</span>,<span class="num">3</span>)) + t.<span class="fn">sum</span>(dim=(<span class="num">2</span>,<span class="num">3</span>))
    <span class="kw">return</span> <span class="num">1</span> - (<span class="num">2</span>*kesisim + eps) / (pay + eps)
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Logit'lerden softmax olasılığı. 2) Hedef etiketleri (B, C, H, W) one-hot kodla. 3) Sınıf başına kesişim ve payda uzamsal eksenler boyunca toplanır. 4) Sayısal kararlılık için eps'li Dice formülü — 1'den çıkarılarak minimize edilen kayıp elde edilir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Eğitim ve Çıkarım</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
model = <span class="fn">UNet</span>(c_in=<span class="num">3</span>, c_out=<span class="num">2</span>).<span class="fn">to</span>(cihaz)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)
ce  = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="kw">for</span> x, y <span class="kw">in</span> loader:
    x, y = x.<span class="fn">to</span>(cihaz), y.<span class="fn">to</span>(cihaz).<span class="fn">long</span>()
    logits = <span class="fn">model</span>(x)
    kayip = <span class="num">0.5</span>*<span class="fn">ce</span>(logits, y) + <span class="num">0.5</span>*<span class="fn">dice_kaybi</span>(logits, y).<span class="fn">mean</span>()
    opt.<span class="fn">zero_grad</span>(); kayip.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()

<span class="cm"># Çıkarım</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    maske = <span class="fn">model</span>(gor.<span class="fn">unsqueeze</span>(<span class="num">0</span>)).<span class="fn">argmax</span>(<span class="num">1</span>)[<span class="num">0</span>].<span class="fn">cpu</span>().<span class="fn">numpy</span>()
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mock eğitim döngüsü: KMeans bir kerede fit'lenir, biz farklı init'lerle yeniden kümeleyip inertia'yı (loss) izleyerek epoch fikrini taklit ediyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.cluster import KMeans
import numpy as np

pikseller = img.reshape(-1, 3).astype(np.float32) / 255.0

kayiplar = []
for devir in range(5):
    km = KMeans(n_clusters=3, n_init=1, random_state=devir).fit(pikseller)
    kayiplar.append(km.inertia_)
    print(f'devir {devir+1}  kayıp(inertia) = {km.inertia_:.2f}')

print('son maske benzersiz etiketleri:', np.unique(km.labels_))</code></pre></div></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) AdamW + birleşik kayıp. 2) Kayıp CE ile Dice'in ortalamasıdır; standart ileri/geri döngü. 3) Çıkarımda sınıf eksenine göre argmax alıp (H, W) tam sayı maskesi elde edilir. 4) Ardından genelde hafif morfolojik temizlik ya da daha keskin sınırlar için tam bağlı CRF uygulanır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Değerlendirme: Sınıf Başına IoU</h2>
<p class="l-text">Ortalama IoU standart bölütleme metriğidir. Aşağıda küçük bir yol sahnesi modelinde tipik sınıf başına IoU.</p>
<div id="cv-l7-plot-tr" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Bölütleme her pikseli etiketler; örnek bölütlemesi nesneleri de ayırt eder.<br><strong>2.</strong> Enkoder-dekoder ağları aşağı örnekleyip yukarı örnekleyerek yoğun tahmin üretir.<br><strong>3.</strong> U-Net atlama bağlantıları ince uzamsal detayı korur.<br><strong>4.</strong> Dilatlı konvolüsyon ve ASPP çözünürlük kaybetmeden alıcı alanı büyütür.<br><strong>5.</strong> CE + Dice kaybı sınıf dengesizliğini iyi yönetir.<br><strong>6.</strong> Ortalama IoU standart kalite metriğidir.<br><strong>7.</strong> SAM 2 (2024) prompt tabanlı bölütlemeyi bellek modülüyle videoya taşır.<br><strong>8.</strong> Sonraki ders: Vision Transformer'lar — konvolüsyonu dikkat ile değiştirmek.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024-2026 Panorama: SAM 2</h2>
<p class="l-text"><strong>SAM 2 (Segment Anything Model 2, Meta, Temmuz 2024)</strong> SAM ailesine video bölütlemeyi getirdi. Orijinal SAM (2023) yalnızca görüntülerle çalışıyordu; SAM 2 ise kareler arasında nesneleri takip eden bir bellek modülü ile görüntü ve videoyu birleştiriyor. Görüntülerde yaklaşık 6 kat hız, videoda 8 kat doğruluk artışı sağlıyor, canlı bölütlemede ~44 FPS'de çalışıyor ve video için ilk prompt tabanlı temel modeli — bir nesneye bir kez tıklayın, tüm video boyunca bölütlensin.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mimari</div><div class="card-body">ViT-H / ViT-L görüntü enkoderi + bellek dikkati + maske dekoderi. Tıklama, kutu, maske ile prompt verilebilir.</div></div>
<div class="calc-card"><div class="card-title">SA-V Veri Kümesi</div><div class="card-body">50.9k video ve 35.5M maske — şimdiye kadarki en büyük video bölütleme veri kümesi, döngüde SAM 2 ile yarı otomatik üretildi.</div></div>
<div class="calc-card"><div class="card-title">Kullanım Alanları</div><div class="card-body">Tıbbi video etiketleme, AR/VR nesne ayrımı, robotikte takip, otonom sürüşte şerit bölütleme.</div></div>
<div class="calc-card"><div class="card-title">Lisans</div><div class="card-body">Apache 2.0. <code>sam2.build_sam2_video_predictor</code> ile deneyin. Canlı demo: sam2.metademolab.com</div></div>
</div>
<p class="l-text">NLP uzmanlığı + ses ilgisi için ipucu: SAM 2'nin bellek-dikkat deseni (jetonlar kareler arasında taşınır) NLP'nin KV-cache ve özyinelemeli durum fikriyle aynı; bölütleme dünyası nihayet dizi dünyasını yakaladı.</p>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var classes = ['Road','Car','Pedestrian','Sign','Sidewalk','Building'];
  var iou = [0.92, 0.81, 0.55, 0.62, 0.74, 0.86];
  var trace = { x: classes, y: iou, type:'bar', marker:{color:'#c8a96e'} };
  var layout = { margin:{t:20,r:20,b:60,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, yaxis:{title:'IoU', range:[0,1]} };
  var en = document.getElementById('cv-l7-plot-en'); if (en) Plotly.newPlot(en, [trace], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l7-plot-tr'); if (tr) Plotly.newPlot(tr, [{x:['Yol','Araba','Yaya','İşaret','Kaldırım','Bina'],y:iou,type:'bar',marker:{color:'#c8a96e'}}], layout, {displayModeBar:false});
}, 250);</script>
`
};
