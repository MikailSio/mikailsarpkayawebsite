window.CV_L2 = {

en: `<p class="l-text"><strong>Models expect specific input.</strong> A pretrained ResNet wants 224×224 RGB normalized to ImageNet stats. Your phone takes 4032×3024. The bridge between raw images and trained models is preprocessing.</p>

<p class="l-text">Augmentation is the multiplier: from 1,000 photos you get 100,000 effective training examples by random flip, crop, rotation, color jitter. This lesson covers all of it: resize, crop, normalize, and modern pipelines (torchvision, Albumentations).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Resize images using nearest, bilinear, and bicubic interpolation in OpenCV and PIL</li>
<li>Apply center crop, random crop, and aspect-preserving padding for CNN inputs</li>
<li>Normalize pixels with ImageNet mean/std so pretrained models work correctly</li>
<li>Build augmentation pipelines with torchvision Compose and Albumentations</li>
<li>Combine RandomFlip, ColorJitter, RandomResizedCrop into a training transform</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Resizing — Methods and Trade-offs</h2>
<p class="l-text">Every CNN expects a fixed input size. <code>cv2.resize()</code> and <code>PIL.Image.resize()</code> let you choose how pixels are interpolated.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">NEAREST</div><div class="card-body">Pick the closest source pixel. Fastest, but blocky on upscale. Use for masks/labels (where blending pixel values is wrong).</div></div>
<div class="calc-card"><div class="card-title">BILINEAR</div><div class="card-body">Average of 4 nearest pixels. Default for most cases. Smooth, no aliasing.</div></div>
<div class="calc-card"><div class="card-title">BICUBIC</div><div class="card-body">Considers 16 neighbors. Sharper edges, slower than bilinear. Default for PIL.</div></div>
<div class="calc-card"><div class="card-title">AREA</div><div class="card-body">Pixel area relation. Best for downscaling — averages multiple source pixels into one target pixel.</div></div>
</div>
<div class="katex-block">$$f(x,y) \\approx \\sum_{i,j} f(x_i, y_j) \\cdot w_i(x) w_j(y)$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">f(x,y)</div><div class="card-body">Target pixel value at coordinate (x,y).</div></div>
<div class="calc-card"><div class="card-title">w_i, w_j</div><div class="card-body">Interpolation weights. Bilinear: linear in both axes. Bicubic: cubic spline.</div></div>
<div class="calc-card"><div class="card-title">Σ over i,j</div><div class="card-body">Sum over neighboring source pixels. Bilinear uses 2×2, bicubic 4×4.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2
<span class="kw">from</span> PIL <span class="kw">import</span> Image

img = cv2.<span class="fn">imread</span>(<span class="str">'photo.jpg'</span>)                 <span class="cm"># BGR (H, W, 3)</span>

<span class="cm"># Downscale → use AREA (better quality)</span>
small = cv2.<span class="fn">resize</span>(img, (<span class="num">224</span>, <span class="num">224</span>), interpolation=cv2.INTER_AREA)

<span class="cm"># Upscale → use CUBIC or LANCZOS (sharper)</span>
big = cv2.<span class="fn">resize</span>(small, (<span class="num">1024</span>, <span class="num">1024</span>), interpolation=cv2.INTER_CUBIC)

<span class="cm"># PIL alternative</span>
pil_img = Image.<span class="fn">fromarray</span>(cv2.<span class="fn">cvtColor</span>(img, cv2.COLOR_BGR2RGB))
small_pil = pil_img.<span class="fn">resize</span>((<span class="num">224</span>, <span class="num">224</span>), Image.BICUBIC)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same idea using only numpy on the preloaded \`img\` (64x64x3 uint8). We compute grayscale and an HSV-like channel manually.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
print('img shape:', img.shape, 'dtype:', img.dtype)

# Manual grayscale via luminance weights
gray = np.dot(img[..., :3], [0.299, 0.587, 0.114]).astype(np.uint8)

# Simple max-min channel = saturation proxy
mx = img.max(axis=-1).astype(np.float32)
mn = img.min(axis=-1).astype(np.float32)
sat = np.where(mx &gt; 0, (mx - mn) / (mx + 1e-9), 0)

print('gray shape:', gray.shape, 'gray range:', gray.min(), gray.max())
print('saturation mean:', round(float(sat.mean()), 3))</code></pre></div></div>

<p class="l-text"><strong>What this code does step by step:</strong> 1) Loads the image with OpenCV (BGR). 2) For downscaling, <code>INTER_AREA</code> — soft, not sharp/aliased. 3) For upscaling, <code>INTER_CUBIC</code> — crisper edges. 4) The PIL alternative is shown (BGR→RGB pre-conversion is required).</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Cropping & Padding</h2>
<p class="l-text">Crop reduces field-of-view; pad fits the image to a target shape without distortion.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Center crop</div><div class="card-body">Take the middle. Standard for evaluation pipelines (ImageNet eval = resize 256, center crop 224).</div></div>
<div class="calc-card"><div class="card-title">Random crop</div><div class="card-body">Pick a random patch each epoch. Augmentation classic — model sees different parts of the image.</div></div>
<div class="calc-card"><div class="card-title">Letterbox pad</div><div class="card-body">Fit aspect ratio without distortion. Pad with zeros or replicate borders. Used in YOLO.</div></div>
<div class="calc-card"><div class="card-title">Reflect pad</div><div class="card-body">Mirror the border pixels. No discontinuity at edge — better than zero-pad for filtering.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

H, W = img.shape[:<span class="num">2</span>]
cy, cx = H // <span class="num">2</span>, W // <span class="num">2</span>

<span class="cm"># Center crop 224x224</span>
top = cy - <span class="num">112</span>; left = cx - <span class="num">112</span>
center_crop = img[top:top+<span class="num">224</span>, left:left+<span class="num">224</span>]

<span class="cm"># Random crop</span>
<span class="kw">import</span> random
ty = random.<span class="fn">randint</span>(<span class="num">0</span>, H - <span class="num">224</span>)
tx = random.<span class="fn">randint</span>(<span class="num">0</span>, W - <span class="num">224</span>)
random_crop = img[ty:ty+<span class="num">224</span>, tx:tx+<span class="num">224</span>]

<span class="cm"># Letterbox (pad to square, then resize)</span>
side = <span class="fn">max</span>(H, W)
padded = np.<span class="fn">zeros</span>((side, side, <span class="num">3</span>), dtype=img.dtype)
y_off = (side - H) // <span class="num">2</span>
x_off = (side - W) // <span class="num">2</span>
padded[y_off:y_off+H, x_off:x_off+W] = img
square = cv2.<span class="fn">resize</span>(padded, (<span class="num">224</span>, <span class="num">224</span>))</code></pre></div>
<p class="l-text"><strong>What this code does step by step:</strong> 1) The center coordinates of the image are computed. 2) For center crop, a 224×224 region around the center is cut. 3) For random crop, a random starting point is chosen — a different cut each epoch. 4) Letterbox: first pad to a square against the longer side, then resize to 224 — aspect ratio is preserved.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Normalization — Why and How</h2>
<p class="l-text">Pretrained CNNs expect specific input distribution. ImageNet models normalize with channel-wise mean and std computed over the entire ImageNet dataset.</p>
<div class="katex-block">$$\\hat{x}_c = \\frac{x_c - \\mu_c}{\\sigma_c}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">x_c</div><div class="card-body">Original pixel value in channel c (after dividing by 255 to be in [0, 1]).</div></div>
<div class="calc-card"><div class="card-title">μ_c</div><div class="card-body">Mean of channel c over ImageNet: [0.485, 0.456, 0.406] for R, G, B.</div></div>
<div class="calc-card"><div class="card-title">σ_c</div><div class="card-body">Std of channel c over ImageNet: [0.229, 0.224, 0.225].</div></div>
<div class="calc-card"><div class="card-title">x̂_c</div><div class="card-body">Normalized output. Now ~zero-mean, unit-variance per channel — what BatchNorm layers expect.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> torch
<span class="kw">from</span> torchvision <span class="kw">import</span> transforms

<span class="cm"># Manual normalization</span>
img_float = img.<span class="fn">astype</span>(np.float32) / <span class="num">255.0</span>       <span class="cm"># [0, 1]</span>
mean = np.<span class="fn">array</span>([<span class="num">0.485</span>, <span class="num">0.456</span>, <span class="num">0.406</span>])
std = np.<span class="fn">array</span>([<span class="num">0.229</span>, <span class="num">0.224</span>, <span class="num">0.225</span>])
normalized = (img_float - mean) / std            <span class="cm"># ~ N(0, 1) per channel</span>

<span class="cm"># torchvision way (preferred)</span>
transform = transforms.<span class="fn">Compose</span>([
    transforms.<span class="fn">ToTensor</span>(),                        <span class="cm"># H,W,C uint8 → C,H,W float [0,1]</span>
    transforms.<span class="fn">Normalize</span>(mean=[<span class="num">0.485</span>, <span class="num">0.456</span>, <span class="num">0.406</span>],
                         std=[<span class="num">0.229</span>, <span class="num">0.224</span>, <span class="num">0.225</span>])
])
tensor = <span class="fn">transform</span>(pil_img)                       <span class="cm"># ready for model</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Manual ImageNet-style normalization with numpy: float conversion, per-channel mean/std subtraction.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

img_f = img.astype(np.float32) / 255.0          # [0,1]

mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
std  = np.array([0.229, 0.224, 0.225], dtype=np.float32)

norm = (img_f - mean) / std                      # broadcast over H,W,C
print('range before:', img_f.min().round(3), img_f.max().round(3))
print('range after :', norm.min().round(3), norm.max().round(3))
print('mean per ch :', norm.reshape(-1, 3).mean(axis=0).round(3))</code></pre></div></div>

<p class="l-text"><strong>What this code does step by step:</strong> 1) Pixels are divided by 255 to land in the [0,1] range. 2) Each channel's own mean is subtracted and the result is divided by its std. 3) The torchvision route is cleaner: <code>ToTensor</code> casts uint8 to float and reorders axes (H,W,C)→(C,H,W); <code>Normalize</code> applies the formula above. 4) The output can be fed straight into a PyTorch model.</p>
<div class="l-warn"><strong>Pitfall:</strong> If you use pretrained weights and skip ImageNet-stats normalization, model accuracy drops by ~30%. It's only optional for models trained from scratch.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Color Augmentations</h2>
<p class="l-text">Color jitter teaches the model that "cat" is still a cat under different lighting, white balance, or camera color science.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Brightness</div><div class="card-body">Add random offset to all pixels. Simulates exposure variations.</div></div>
<div class="calc-card"><div class="card-title">Contrast</div><div class="card-body">Multiply (x − 128) by random factor. Simulates flat vs punchy images.</div></div>
<div class="calc-card"><div class="card-title">Saturation</div><div class="card-body">Scale colorfulness. 0 = grayscale, 2 = oversaturated.</div></div>
<div class="calc-card"><div class="card-title">Hue</div><div class="card-body">Rotate colors on the color wheel. Use carefully — can make sky purple.</div></div>
<div class="calc-card"><div class="card-title">Gaussian blur</div><div class="card-body">Simulates out-of-focus or low-quality cameras.</div></div>
<div class="calc-card"><div class="card-title">Random erasing</div><div class="card-body">Black out a random rectangle. Forces model to use multiple regions, not just one feature.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torchvision <span class="kw">import</span> transforms
<span class="kw">import</span> torchvision.transforms.v2 <span class="kw">as</span> v2

color_jitter = transforms.<span class="fn">Compose</span>([
    transforms.<span class="fn">ColorJitter</span>(brightness=<span class="num">0.2</span>, contrast=<span class="num">0.2</span>,
                           saturation=<span class="num">0.2</span>, hue=<span class="num">0.05</span>),
    transforms.<span class="fn">GaussianBlur</span>(kernel_size=<span class="num">5</span>, sigma=(<span class="num">0.1</span>, <span class="num">2.0</span>)),
    transforms.<span class="fn">RandomErasing</span>(p=<span class="num">0.25</span>, scale=(<span class="num">0.02</span>, <span class="num">0.2</span>)),
])

<span class="cm"># Apply 8 times to see different versions</span>
samples = [<span class="fn">color_jitter</span>(pil_img) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>)]</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Numpy implementation of brightness, contrast and saturation jitter on \`img\`.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

x = img.astype(np.float32)

# Brightness: scalar shift
x = x + rng.uniform(-25, 25)

# Contrast: scale around mean
m = x.mean()
x = (x - m) * rng.uniform(0.8, 1.2) + m

# Saturation proxy: blend with grayscale
gray = np.dot(x[..., :3], [0.299, 0.587, 0.114])[..., None]
x = gray + (x - gray) * rng.uniform(0.7, 1.3)

x = np.clip(x, 0, 255).astype(np.uint8)
print('jittered shape:', x.shape, 'range:', x.min(), x.max())</code></pre></div></div>

<p class="l-text"><strong>What this code does step by step:</strong> 1) <code>ColorJitter</code> randomly varies brightness/contrast/saturation/hue on each call — the numbers are the maximum deviation. 2) <code>GaussianBlur</code> is sometimes added (robustness against blurry photos). 3) <code>RandomErasing</code> wipes a random rectangle with 25% probability. 4) Eight different augmented samples are produced from the same input — a different image every epoch.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Geometric Augmentations</h2>
<p class="l-text">Geometric augmentation changes spatial layout: position, orientation, perspective.</p>
<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Horizontal flip</div><div class="step-detail">Mirror left-right. Safe for most natural images, but <strong>NOT</strong> for text, traffic signs, or chirality-dependent classes.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Vertical flip</div><div class="step-detail">Mirror top-bottom. Rarely safe in natural images (sky should stay up). OK for satellite/microscopy.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Random rotation</div><div class="step-detail">Typical range [-30°, +30°]. Larger angles introduce empty corners.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Random affine</div><div class="step-detail">Combination of translate, scale, shear, rotate. Single matrix multiplication.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">RandomResizedCrop</div><div class="step-detail">The default in modern CNN training. Pick random scale (0.08-1.0) and aspect ratio, crop, then resize to target. Simulates objects at any distance.</div></div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torchvision <span class="kw">import</span> transforms

<span class="cm"># Modern CNN training pipeline</span>
train_transform = transforms.<span class="fn">Compose</span>([
    transforms.<span class="fn">RandomResizedCrop</span>(<span class="num">224</span>, scale=(<span class="num">0.08</span>, <span class="num">1.0</span>)),
    transforms.<span class="fn">RandomHorizontalFlip</span>(p=<span class="num">0.5</span>),
    transforms.<span class="fn">RandomRotation</span>(degrees=<span class="num">15</span>),
    transforms.<span class="fn">ColorJitter</span>(brightness=<span class="num">0.2</span>, contrast=<span class="num">0.2</span>, saturation=<span class="num">0.2</span>),
    transforms.<span class="fn">ToTensor</span>(),
    transforms.<span class="fn">Normalize</span>(mean=[<span class="num">0.485</span>, <span class="num">0.456</span>, <span class="num">0.406</span>],
                         std=[<span class="num">0.229</span>, <span class="num">0.224</span>, <span class="num">0.225</span>]),
])

<span class="cm"># Test/eval pipeline — NO augmentation, only deterministic transforms</span>
test_transform = transforms.<span class="fn">Compose</span>([
    transforms.<span class="fn">Resize</span>(<span class="num">256</span>),
    transforms.<span class="fn">CenterCrop</span>(<span class="num">224</span>),
    transforms.<span class="fn">ToTensor</span>(),
    transforms.<span class="fn">Normalize</span>(mean=[<span class="num">0.485</span>, <span class="num">0.456</span>, <span class="num">0.406</span>],
                         std=[<span class="num">0.229</span>, <span class="num">0.224</span>, <span class="num">0.225</span>]),
])</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Numpy implementation of brightness, contrast and saturation jitter on \`img\`.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

x = img.astype(np.float32)

# Brightness: scalar shift
x = x + rng.uniform(-25, 25)

# Contrast: scale around mean
m = x.mean()
x = (x - m) * rng.uniform(0.8, 1.2) + m

# Saturation proxy: blend with grayscale
gray = np.dot(x[..., :3], [0.299, 0.587, 0.114])[..., None]
x = gray + (x - gray) * rng.uniform(0.7, 1.3)

x = np.clip(x, 0, 255).astype(np.uint8)
print('jittered shape:', x.shape, 'range:', x.min(), x.max())</code></pre></div></div>

<p class="l-text"><strong>What this code does step by step:</strong> 1) The training pipeline applies <code>RandomResizedCrop</code>, flip, rotation, color jitter — random variation on every image. 2) Then ToTensor+Normalize at the end. 3) The test pipeline has NO randomness — only resize + center crop + normalize. <strong>Training and test transforms are different!</strong> The same image must come out the same at test time, but differ each epoch during training.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. torchvision vs Albumentations</h2>
<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">torchvision.transforms</div>
<div class="compare-item">PyTorch native, no extra install.</div>
<div class="compare-item">v2 API supports masks, bboxes, keypoints.</div>
<div class="compare-item">Slower for complex pipelines (Python loop).</div>
<div class="compare-item">Best for classification.</div>
</div>
<div class="compare-col">
<div class="compare-title">Albumentations</div>
<div class="compare-item">2-4× faster (vectorized OpenCV).</div>
<div class="compare-item">Native bbox/mask/keypoint support.</div>
<div class="compare-item">Huge augmentation library (50+ ops).</div>
<div class="compare-item">Best for detection / segmentation.</div>
</div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> albumentations <span class="kw">as</span> A
<span class="kw">from</span> albumentations.pytorch <span class="kw">import</span> ToTensorV2

train = A.<span class="fn">Compose</span>([
    A.<span class="fn">RandomResizedCrop</span>(height=<span class="num">224</span>, width=<span class="num">224</span>, scale=(<span class="num">0.08</span>, <span class="num">1.0</span>)),
    A.<span class="fn">HorizontalFlip</span>(p=<span class="num">0.5</span>),
    A.<span class="fn">Rotate</span>(limit=<span class="num">15</span>, p=<span class="num">0.5</span>),
    A.<span class="fn">RandomBrightnessContrast</span>(brightness_limit=<span class="num">0.2</span>, contrast_limit=<span class="num">0.2</span>),
    A.<span class="fn">Normalize</span>(mean=(<span class="num">0.485</span>, <span class="num">0.456</span>, <span class="num">0.406</span>),
                std=(<span class="num">0.229</span>, <span class="num">0.224</span>, <span class="num">0.225</span>)),
    <span class="fn">ToTensorV2</span>(),
])

<span class="cm"># Use: dict input, dict output (handles bboxes/masks too)</span>
out = <span class="fn">train</span>(image=img)
tensor = out[<span class="str">'image'</span>]  <span class="cm"># (C, H, W) torch.Tensor</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Random crop + resize via numpy slicing and PIL — equivalent to a basic train pipeline.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from PIL import Image
rng = np.random.default_rng(1)

H, W = img.shape[:2]
crop = int(rng.integers(32, min(H, W) + 1))
y0 = int(rng.integers(0, H - crop + 1))
x0 = int(rng.integers(0, W - crop + 1))
patch = img[y0:y0+crop, x0:x0+crop]

# Resize to 32x32
resized = np.array(Image.fromarray(patch).resize((32, 32)))

# Random horizontal flip
if rng.random() &lt; 0.5:
    resized = resized[:, ::-1]

print('crop box:', (y0, x0, crop), 'output shape:', resized.shape)</code></pre></div></div>

<p class="l-text"><strong>What this code does step by step:</strong> 1) Albumentations <code>Compose</code> mirrors torchvision. 2) Speed advantage: all operations run as C++ inside OpenCV. 3) The output is a dict — image/bbox/mask all stay in sync. <strong>The standard for detection / segmentation projects.</strong></p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pitfalls & Mini Project</h2>
<div class="plotly-graph" id="plot-cv-l2-aug-en"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> How using augmentation changes training accuracy. WITHOUT augmentation, train accuracy quickly hits 100% (overfitting) while val accuracy drops. WITH augmentation, train accuracy rises a bit slower but val accuracy peaks higher — the model learns to generalize.</div>
<div class="think-box"><div class="think-label">⚠️ KEY PITFALLS</div><div class="think-body"><strong>1.</strong> Augmentation order matters: geometric BEFORE color (otherwise rotation jitters the black padding). <br><strong>2.</strong> No randomness in the eval pipeline — test must be deterministic. <br><strong>3.</strong> If you use a pretrained model: ImageNet mean/std normalization is MANDATORY. <br><strong>4.</strong> If you have class imbalance, apply augmentation per-class (more aggressive on the minority class).</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 SUMMARY</div><div class="think-body"><strong>1.</strong> Resize: AREA for downscaling, CUBIC for upscaling.<br><strong>2.</strong> Letterbox padding preserves the aspect ratio.<br><strong>3.</strong> ImageNet-pretrained model = ImageNet mean/std normalization.<br><strong>4.</strong> RandomResizedCrop + HorizontalFlip + ColorJitter = modern training default.<br><strong>5.</strong> Train and test transforms must be DIFFERENT — no randomness at eval time.<br><strong>6.</strong> torchvision: enough for classification. Albumentations: detection/segmentation.<br><strong>7.</strong> Augmentation order: geometric → color → tensor → normalize.<br><strong>8.</strong> Next lesson: classical CV — filters, edges, morphology.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  const T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#06b6d4',
    grid: 'rgba(255,255,255,0.06)'
  };
  function makeAug(id, labels){
    const el = document.getElementById(id);
    if (!el) return;
    const epochs = Array.from({length: 50}, (_, i) => i + 1);
    const train_no_aug = epochs.map(e => Math.min(0.99, 0.4 + 0.65 * (1 - Math.exp(-e/8))));
    const val_no_aug = epochs.map(e => 0.45 + 0.4 * (1 - Math.exp(-e/12)) - Math.max(0, (e-15)*0.005));
    const train_aug = epochs.map(e => Math.min(0.95, 0.35 + 0.62 * (1 - Math.exp(-e/14))));
    const val_aug = epochs.map(e => 0.42 + 0.5 * (1 - Math.exp(-e/15)));
    Plotly.newPlot(id, [
      {x:epochs, y:train_no_aug, name:labels.tn, mode:'lines', line:{color:'#ff7676', width:2, dash:'dot'}},
      {x:epochs, y:val_no_aug,   name:labels.vn, mode:'lines', line:{color:'#ff7676', width:2.5}},
      {x:epochs, y:train_aug,    name:labels.ta, mode:'lines', line:{color:T.accent, width:2, dash:'dot'}},
      {x:epochs, y:val_aug,      name:labels.va, mode:'lines', line:{color:T.accent, width:2.5}}
    ], {
      paper_bgcolor:T.bg, plot_bgcolor:T.bg,
      font:{color:T.text}, margin:{t:40, r:20, b:50, l:60},
      xaxis:{title:labels.x, gridcolor:T.grid},
      yaxis:{title:labels.y, gridcolor:T.grid, range:[0.3, 1]},
      title:{text:labels.title, font:{color:T.text, size:14}},
      legend:{font:{color:T.text}, orientation:'h', y:-0.18}
    }, {responsive:true, displayModeBar:false});
  }
  makeAug('plot-cv-l2-aug-en', {tn:'Train (no aug)', vn:'Val (no aug)', ta:'Train (aug)', va:'Val (aug)', x:'Epoch', y:'Accuracy', title:'Augmentation effect on overfitting'});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Modeller spesifik girdi bekler.</strong> Pretrained ResNet 224×224 RGB ister, ImageNet stats ile normalize edilmiş. Telefonun 4032×3024 çekiyor. Ham görüntülerle eğitilmiş modeller arasındaki köprü ön işlemedir.</p>

<p class="l-text">Augmentation çarpan: 1.000 fotoğraftan 100.000 efektif eğitim örneği — random flip, crop, rotation, color jitter ile. Bu derste hepsi var: resize, crop, normalize ve modern pipeline'lar (torchvision, Albumentations).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>OpenCV ve PIL'de nearest, bilinear, bicubic interpolasyonla görüntü yeniden boyutlandırmayı</li>
<li>CNN girişleri için center crop, random crop ve oran koruyan padding uygulamayı</li>
<li>Pretrained modellerin doğru çalışması için ImageNet mean/std ile normalize etmeyi</li>
<li>torchvision Compose ve Albumentations ile augmentasyon pipeline'ı kurmayı</li>
<li>RandomFlip, ColorJitter ve RandomResizedCrop'u tek bir eğitim transformunda birleştirmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Yeniden Boyutlandırma — Yöntemler ve Dengeler</h2>
<p class="l-text">Her CNN sabit girdi boyutu bekler. <code>cv2.resize()</code> ve <code>PIL.Image.resize()</code> piksellerin nasıl interpolasyonla hesaplanacağını seçer.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">NEAREST</div><div class="card-body">En yakın kaynak pikseli al. En hızlı ama büyütmede bloklu. Mask/etiketlerde kullan (piksel değerini karıştırmak yanlış).</div></div>
<div class="calc-card"><div class="card-title">BILINEAR</div><div class="card-body">En yakın 4 pikselin ortalaması. Çoğu durum için varsayılan. Yumuşak, aliasing yok.</div></div>
<div class="calc-card"><div class="card-title">BICUBIC</div><div class="card-body">16 komşuyu hesaba katar. Daha keskin kenarlar, bilinear'dan yavaş. PIL varsayılanı.</div></div>
<div class="calc-card"><div class="card-title">AREA</div><div class="card-body">Piksel alan ilişkisi. Küçültmede en iyi — birden çok kaynak pikseli tek hedef pikselde ortalar.</div></div>
</div>
<div class="katex-block">$$f(x,y) \\approx \\sum_{i,j} f(x_i, y_j) \\cdot w_i(x) w_j(y)$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">f(x,y)</div><div class="card-body">Hedef koordinattaki piksel değeri.</div></div>
<div class="calc-card"><div class="card-title">w_i, w_j</div><div class="card-body">İnterpolasyon ağırlıkları. Bilinear: iki eksende lineer. Bicubic: kübik spline.</div></div>
<div class="calc-card"><div class="card-title">Σ over i,j</div><div class="card-body">Komşu kaynak pikselleri toplama. Bilinear 2×2, bicubic 4×4 kullanır.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2
<span class="kw">from</span> PIL <span class="kw">import</span> Image

img = cv2.<span class="fn">imread</span>(<span class="str">'foto.jpg'</span>)                  <span class="cm"># BGR (H, W, 3)</span>

<span class="cm"># Küçültme - AREA (daha iyi kalite)</span>
kucuk = cv2.<span class="fn">resize</span>(img, (<span class="num">224</span>, <span class="num">224</span>), interpolation=cv2.INTER_AREA)

<span class="cm"># Büyütme - CUBIC veya LANCZOS (daha keskin)</span>
buyuk = cv2.<span class="fn">resize</span>(kucuk, (<span class="num">1024</span>, <span class="num">1024</span>), interpolation=cv2.INTER_CUBIC)

<span class="cm"># PIL alternatifi</span>
pil_img = Image.<span class="fn">fromarray</span>(cv2.<span class="fn">cvtColor</span>(img, cv2.COLOR_BGR2RGB))
kucuk_pil = pil_img.<span class="fn">resize</span>((<span class="num">224</span>, <span class="num">224</span>), Image.BICUBIC)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı fikri sadece numpy ile preloaded \`img\` (64x64x3 uint8) üzerinde uyguluyoruz. Gri tonlama ve basit HSV-benzeri kanal hesaplıyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
print('görüntü şekli:', img.shape, 'dtype:', img.dtype)

# Parlaklık ağırlıklarıyla elle gri tonlama
gray = np.dot(img[..., :3], [0.299, 0.587, 0.114]).astype(np.uint8)

# Basit max-min kanalı = doygunluk yaklaşımı
mx = img.max(axis=-1).astype(np.float32)
mn = img.min(axis=-1).astype(np.float32)
sat = np.where(mx &gt; 0, (mx - mn) / (mx + 1e-9), 0)

print('gri şekli:', gray.shape, 'gri aralığı:', gray.min(), gray.max())
print('doygunluk ortalaması:', round(float(sat.mean()), 3))</code></pre></div></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) OpenCV ile görüntü yüklenir (BGR). 2) Küçültme için <code>INTER_AREA</code> — keskin/aliased değil, yumuşak. 3) Büyütme için <code>INTER_CUBIC</code> — kenarlar daha keskin. 4) PIL alternatifi gösterilir (BGR→RGB ön çevirim gerekli).</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Kırpma & Padding</h2>
<p class="l-text">Crop görüş alanını daraltır; pad görüntüyü hedef şekle distortion olmadan oturtur.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Center crop</div><div class="card-body">Ortayı al. Değerlendirme pipeline'larında standart (ImageNet eval = 256 resize, 224 center crop).</div></div>
<div class="calc-card"><div class="card-title">Random crop</div><div class="card-body">Her epoch farklı bir parça seç. Klasik augmentation — model görüntünün farklı bölümlerini görür.</div></div>
<div class="calc-card"><div class="card-title">Letterbox pad</div><div class="card-body">Aspect ratio'yu distortion olmadan oturt. Sıfırla veya kenar pikselini tekrar ederek doldur. YOLO'da kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Reflect pad</div><div class="card-body">Kenar piksellerini yansıt. Kenar süreksizliği yok — filtreleme için zero-pad'den iyi.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

H, W = img.shape[:<span class="num">2</span>]
cy, cx = H // <span class="num">2</span>, W // <span class="num">2</span>

<span class="cm"># Center crop 224x224</span>
top = cy - <span class="num">112</span>; left = cx - <span class="num">112</span>
center_crop = img[top:top+<span class="num">224</span>, left:left+<span class="num">224</span>]

<span class="cm"># Random crop</span>
<span class="kw">import</span> random
ty = random.<span class="fn">randint</span>(<span class="num">0</span>, H - <span class="num">224</span>)
tx = random.<span class="fn">randint</span>(<span class="num">0</span>, W - <span class="num">224</span>)
random_crop = img[ty:ty+<span class="num">224</span>, tx:tx+<span class="num">224</span>]

<span class="cm"># Letterbox (kareye pad, sonra resize)</span>
side = <span class="fn">max</span>(H, W)
padded = np.<span class="fn">zeros</span>((side, side, <span class="num">3</span>), dtype=img.dtype)
y_off = (side - H) // <span class="num">2</span>
x_off = (side - W) // <span class="num">2</span>
padded[y_off:y_off+H, x_off:x_off+W] = img
square = cv2.<span class="fn">resize</span>(padded, (<span class="num">224</span>, <span class="num">224</span>))</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Görüntünün merkez koordinatları hesaplanır. 2) Center crop için merkez etrafında 224×224 alan kesilir. 3) Random crop için rastgele başlangıç noktası seçilir — her epoch'ta farklı kesim. 4) Letterbox: önce büyük kenara göre kare pad uygulanır, sonra 224'e resize — aspect ratio bozulmaz.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Normalizasyon — Neden ve Nasıl</h2>
<p class="l-text">Pretrained CNN'ler belirli girdi dağılımı bekler. ImageNet modelleri tüm ImageNet veri seti üzerinden hesaplanan kanal-başına mean ve std ile normalize eder.</p>
<div class="katex-block">$$\\hat{x}_c = \\frac{x_c - \\mu_c}{\\sigma_c}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">x_c</div><div class="card-body">c kanalındaki orijinal piksel değeri (255'e bölündükten sonra [0, 1] aralığında).</div></div>
<div class="calc-card"><div class="card-title">μ_c</div><div class="card-body">c kanalının ImageNet üzerindeki ortalaması: R, G, B için [0.485, 0.456, 0.406].</div></div>
<div class="calc-card"><div class="card-title">σ_c</div><div class="card-body">c kanalının ImageNet üzerindeki std'si: [0.229, 0.224, 0.225].</div></div>
<div class="calc-card"><div class="card-title">x̂_c</div><div class="card-body">Normalize çıkış. Artık kanal-başına ~sıfır-ortalama, birim-varyans — BatchNorm katmanlarının beklediği şekil.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> torch
<span class="kw">from</span> torchvision <span class="kw">import</span> transforms

<span class="cm"># Manuel normalizasyon</span>
img_float = img.<span class="fn">astype</span>(np.float32) / <span class="num">255.0</span>       <span class="cm"># [0, 1]</span>
mean = np.<span class="fn">array</span>([<span class="num">0.485</span>, <span class="num">0.456</span>, <span class="num">0.406</span>])
std = np.<span class="fn">array</span>([<span class="num">0.229</span>, <span class="num">0.224</span>, <span class="num">0.225</span>])
normalized = (img_float - mean) / std            <span class="cm"># her kanal ~ N(0, 1)</span>

<span class="cm"># torchvision yolu (tercih edilen)</span>
transform = transforms.<span class="fn">Compose</span>([
    transforms.<span class="fn">ToTensor</span>(),                        <span class="cm"># H,W,C uint8 -> C,H,W float [0,1]</span>
    transforms.<span class="fn">Normalize</span>(mean=[<span class="num">0.485</span>, <span class="num">0.456</span>, <span class="num">0.406</span>],
                         std=[<span class="num">0.229</span>, <span class="num">0.224</span>, <span class="num">0.225</span>])
])
tensor = <span class="fn">transform</span>(pil_img)                       <span class="cm"># modele hazır</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Numpy ile manuel ImageNet tarzı normalizasyon: float'a çevirme, kanal başına mean/std çıkarma.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

img_f = img.astype(np.float32) / 255.0          # [0,1]

mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
std  = np.array([0.229, 0.224, 0.225], dtype=np.float32)

norm = (img_f - mean) / std                      # H,W,C üstünde yayım
print('önce aralık:', img_f.min().round(3), img_f.max().round(3))
print('sonra aralık:', norm.min().round(3), norm.max().round(3))
print('kanal başına ortalama:', norm.reshape(-1, 3).mean(axis=0).round(3))</code></pre></div></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Pikseller 255'e bölünüp [0,1] aralığına çekilir. 2) Her kanaldan kendi mean'i çıkarılır, std'sine bölünür. 3) torchvision yolu daha temiz: <code>ToTensor</code> uint8'i float'a çevirip ekseni (H,W,C)→(C,H,W) yapar; <code>Normalize</code> yukarıdaki formülü uygular. 4) Sonuç PyTorch modeline doğrudan beslenebilir.</p>
<div class="l-warn"><strong>Tuzak:</strong> Eğer pretrained ağırlık kullanıyorsan ve ImageNet stats ile normalize etmezsen, model accuracy %30 düşer. Sadece "scratch" eğittiğin modellerde bu zorunlu değil.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Renk Augmentation'ları</h2>
<p class="l-text">Color jitter modele "kedi" hâlâ kedidir farklı ışıklandırma, beyaz dengesi veya kamera renk bilimi altında diye öğretir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Brightness</div><div class="card-body">Tüm piksellere rastgele offset ekle. Pozlama varyasyonlarını simüle eder.</div></div>
<div class="calc-card"><div class="card-title">Contrast</div><div class="card-body">(x − 128)'i rastgele faktörle çarp. Düz vs canlı görüntüleri simüle eder.</div></div>
<div class="calc-card"><div class="card-title">Saturation</div><div class="card-body">Renkliliği ölçekle. 0 = grayscale, 2 = aşırı doygun.</div></div>
<div class="calc-card"><div class="card-title">Hue</div><div class="card-body">Renkleri tekerlek üzerinde döndür. Dikkatli kullan — gökyüzünü mor yapabilir.</div></div>
<div class="calc-card"><div class="card-title">Gaussian blur</div><div class="card-body">Out-of-focus veya düşük kaliteli kameraları simüle eder.</div></div>
<div class="calc-card"><div class="card-title">Random erasing</div><div class="card-body">Rastgele dikdörtgeni siyaha çevir. Modeli birden çok bölge kullanmaya zorlar.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torchvision <span class="kw">import</span> transforms

color_jitter = transforms.<span class="fn">Compose</span>([
    transforms.<span class="fn">ColorJitter</span>(brightness=<span class="num">0.2</span>, contrast=<span class="num">0.2</span>,
                           saturation=<span class="num">0.2</span>, hue=<span class="num">0.05</span>),
    transforms.<span class="fn">GaussianBlur</span>(kernel_size=<span class="num">5</span>, sigma=(<span class="num">0.1</span>, <span class="num">2.0</span>)),
    transforms.<span class="fn">RandomErasing</span>(p=<span class="num">0.25</span>, scale=(<span class="num">0.02</span>, <span class="num">0.2</span>)),
])

<span class="cm"># 8 farklı versiyon için tekrar uygula</span>
samples = [<span class="fn">color_jitter</span>(pil_img) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>)]</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Brightness, contrast ve saturation jitter'ı numpy ile \`img\` üzerinde uyguluyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

x = img.astype(np.float32)

# Parlaklık: skaler kaydırma
x = x + rng.uniform(-25, 25)

# Kontrast: ortalama etrafında ölçekleme
m = x.mean()
x = (x - m) * rng.uniform(0.8, 1.2) + m

# Doygunluk yaklaşımı: gri tonlama ile karıştır
gray = np.dot(x[..., :3], [0.299, 0.587, 0.114])[..., None]
x = gray + (x - gray) * rng.uniform(0.7, 1.3)

x = np.clip(x, 0, 255).astype(np.uint8)
print('titreşimli şekil:', x.shape, 'aralık:', x.min(), x.max())</code></pre></div></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>ColorJitter</code> brightness/contrast/saturation/hue'yi her uygulamada rastgele varyasyonla değiştirir. 2) <code>GaussianBlur</code> bazen ekleniyor (bulanık fotoğraflara karşı dayanıklılık). 3) <code>RandomErasing</code> %25 olasılıkla rastgele dikdörtgeni siler. 4) Aynı girdiden 8 farklı augmented örnek üretilir — her epoch'ta farklı görüntü.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Geometrik Augmentation'lar</h2>
<p class="l-text">Geometrik augmentation uzamsal yerleşimi değiştirir: pozisyon, oryantasyon, perspektif.</p>
<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Yatay flip</div><div class="step-detail">Sol-sağ aynalama. Çoğu doğal görüntüde güvenli, ama metinler, trafik işaretleri veya el-bağımlı sınıflar için <strong>UYGUN DEĞİL</strong>.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Dikey flip</div><div class="step-detail">Üst-alt aynalama. Doğal görüntülerde nadiren güvenli (gökyüzü yukarıda kalmalı). Uydu/mikroskopi için OK.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Random rotation</div><div class="step-detail">Tipik aralık [-30°, +30°]. Daha büyük açılar boş köşeler oluşturur.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Random affine</div><div class="step-detail">Translate, scale, shear, rotate kombinasyonu. Tek matris çarpımı.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">RandomResizedCrop</div><div class="step-detail">Modern CNN eğitimde varsayılan. Rastgele scale (0.08-1.0) ve aspect ratio seç, kırp, hedef boyuta resize. Nesneleri herhangi bir mesafede simüle eder.</div></div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torchvision <span class="kw">import</span> transforms

<span class="cm"># Modern CNN eğitim pipeline'ı</span>
train_transform = transforms.<span class="fn">Compose</span>([
    transforms.<span class="fn">RandomResizedCrop</span>(<span class="num">224</span>, scale=(<span class="num">0.08</span>, <span class="num">1.0</span>)),
    transforms.<span class="fn">RandomHorizontalFlip</span>(p=<span class="num">0.5</span>),
    transforms.<span class="fn">RandomRotation</span>(degrees=<span class="num">15</span>),
    transforms.<span class="fn">ColorJitter</span>(brightness=<span class="num">0.2</span>, contrast=<span class="num">0.2</span>, saturation=<span class="num">0.2</span>),
    transforms.<span class="fn">ToTensor</span>(),
    transforms.<span class="fn">Normalize</span>(mean=[<span class="num">0.485</span>, <span class="num">0.456</span>, <span class="num">0.406</span>],
                         std=[<span class="num">0.229</span>, <span class="num">0.224</span>, <span class="num">0.225</span>]),
])

<span class="cm"># Test/eval pipeline - rastgelelik YOK, sadece deterministik</span>
test_transform = transforms.<span class="fn">Compose</span>([
    transforms.<span class="fn">Resize</span>(<span class="num">256</span>),
    transforms.<span class="fn">CenterCrop</span>(<span class="num">224</span>),
    transforms.<span class="fn">ToTensor</span>(),
    transforms.<span class="fn">Normalize</span>(mean=[<span class="num">0.485</span>, <span class="num">0.456</span>, <span class="num">0.406</span>],
                         std=[<span class="num">0.229</span>, <span class="num">0.224</span>, <span class="num">0.225</span>]),
])</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bölüm 5 kodu görüntü üzerinde geometrik augmentation (flip, crop, scale) uyguluyor.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

x = img.astype(np.float32)

# Parlaklık: skaler kaydırma
x = x + rng.uniform(-25, 25)

# Kontrast: ortalama etrafında ölçekleme
m = x.mean()
x = (x - m) * rng.uniform(0.8, 1.2) + m

# Doygunluk yaklaşımı: gri tonlama ile karıştır
gray = np.dot(x[..., :3], [0.299, 0.587, 0.114])[..., None]
x = gray + (x - gray) * rng.uniform(0.7, 1.3)

x = np.clip(x, 0, 255).astype(np.uint8)
print('titreşimli şekil:', x.shape, 'aralık:', x.min(), x.max())</code></pre></div></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Eğitim pipeline'ında <code>RandomResizedCrop</code>, flip, rotation, color jitter — her görüntüye rastgele varyasyon. 2) Sonunda ToTensor+Normalize. 3) Test pipeline'ında AYNI rastgelelik YOK — sadece resize+center crop+normalize. <strong>Eğitim ve test farklı transform!</strong> Aynı görüntü test'te aynı çıkmalı, eğitimde her epoch farklı.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. torchvision vs Albumentations</h2>
<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">torchvision.transforms</div>
<div class="compare-item">PyTorch native, ekstra install yok.</div>
<div class="compare-item">v2 API mask, bbox, keypoint destekler.</div>
<div class="compare-item">Karmaşık pipeline'larda yavaş (Python loop).</div>
<div class="compare-item">Sınıflandırma için ideal.</div>
</div>
<div class="compare-col">
<div class="compare-title">Albumentations</div>
<div class="compare-item">2-4× hızlı (vektörize OpenCV).</div>
<div class="compare-item">Native bbox/mask/keypoint desteği.</div>
<div class="compare-item">Devasa augmentation kütüphanesi (50+ op).</div>
<div class="compare-item">Detection / segmentation için ideal.</div>
</div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> albumentations <span class="kw">as</span> A
<span class="kw">from</span> albumentations.pytorch <span class="kw">import</span> ToTensorV2

train = A.<span class="fn">Compose</span>([
    A.<span class="fn">RandomResizedCrop</span>(height=<span class="num">224</span>, width=<span class="num">224</span>, scale=(<span class="num">0.08</span>, <span class="num">1.0</span>)),
    A.<span class="fn">HorizontalFlip</span>(p=<span class="num">0.5</span>),
    A.<span class="fn">Rotate</span>(limit=<span class="num">15</span>, p=<span class="num">0.5</span>),
    A.<span class="fn">RandomBrightnessContrast</span>(brightness_limit=<span class="num">0.2</span>, contrast_limit=<span class="num">0.2</span>),
    A.<span class="fn">Normalize</span>(mean=(<span class="num">0.485</span>, <span class="num">0.456</span>, <span class="num">0.406</span>),
                std=(<span class="num">0.229</span>, <span class="num">0.224</span>, <span class="num">0.225</span>)),
    <span class="fn">ToTensorV2</span>(),
])

<span class="cm"># Kullanım: dict girdi, dict çıktı (bbox/mask senkronize)</span>
out = <span class="fn">train</span>(image=img)
tensor = out[<span class="str">'image'</span>]  <span class="cm"># (C, H, W) torch.Tensor</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Numpy dilimleme + PIL ile rastgele crop ve resize — temel bir eğitim pipeline'ı eşdeğeri.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from PIL import Image
rng = np.random.default_rng(1)

H, W = img.shape[:2]
crop = int(rng.integers(32, min(H, W) + 1))
y0 = int(rng.integers(0, H - crop + 1))
x0 = int(rng.integers(0, W - crop + 1))
patch = img[y0:y0+crop, x0:x0+crop]

# 32x32'ye yeniden boyutlandır
resized = np.array(Image.fromarray(patch).resize((32, 32)))

# Rastgele yatay çevirme
if rng.random() &lt; 0.5:
    resized = resized[:, ::-1]

print('kırpma kutusu:', (y0, x0, crop), 'çıkış şekli:', resized.shape)</code></pre></div></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Albumentations <code>Compose</code> torchvision ile benzer. 2) Hız avantajı: tüm operasyonlar OpenCV'de C++ olarak çalışır. 3) Çıktı dict — image/bbox/mask hepsi senkronize. <strong>Detection / segmentation projelerinde standart.</strong></p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Tuzaklar & Mini Proje</h2>
<div class="plotly-graph" id="plot-cv-l2-aug-tr"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> Augmentation kullanımı eğitim doğruluğunu nasıl değiştirir. Augmentation YOK iken model train accuracy hızla %100'e çıkar (overfitting), val accuracy düşer. Augmentation VAR ise train accuracy biraz daha yavaş artar ama val accuracy daha yüksek tepe yapar — model genelleşmeyi öğrenir.</div>
<div class="think-box"><div class="think-label">⚠️ ÖNEMLI TUZAKLAR</div><div class="think-body"><strong>1.</strong> Augmentation sırası önemli: geometric ÖNCE color (yoksa rotation siyah dolguyu jitter'lar). <br><strong>2.</strong> Eval pipeline'da rastgelelik OLMAZ — test'in deterministik olması gerekli. <br><strong>3.</strong> Pretrained model kullanıyorsan: ImageNet mean/std ile normalize ZORUNLU. <br><strong>4.</strong> Class imbalance varsa augmentation'ı per-class kullan (azınlık sınıfı daha agresif).</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖZET</div><div class="think-body"><strong>1.</strong> Resize: küçültmek için AREA, büyütmek için CUBIC.<br><strong>2.</strong> Letterbox pad aspect ratio'yu korur.<br><strong>3.</strong> ImageNet-pretrained model = ImageNet mean/std normalize.<br><strong>4.</strong> RandomResizedCrop + HorizontalFlip + ColorJitter = modern training default.<br><strong>5.</strong> Eğitim ve test transform FARKLI olmalı — eval'da rastgelelik yok.<br><strong>6.</strong> torchvision: classification için yeter. Albumentations: detection/segmentation.<br><strong>7.</strong> Augmentation sırası: geometric → color → tensor → normalize.<br><strong>8.</strong> Sonraki ders: klasik CV — filters, edges, morphology.</div></div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  const T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#06b6d4',
    grid: 'rgba(255,255,255,0.06)'
  };
  function makeAug(id, labels){
    const el = document.getElementById(id);
    if (!el) return;
    const epochs = Array.from({length: 50}, (_, i) => i + 1);
    const train_no_aug = epochs.map(e => Math.min(0.99, 0.4 + 0.65 * (1 - Math.exp(-e/8))));
    const val_no_aug = epochs.map(e => 0.45 + 0.4 * (1 - Math.exp(-e/12)) - Math.max(0, (e-15)*0.005));
    const train_aug = epochs.map(e => Math.min(0.95, 0.35 + 0.62 * (1 - Math.exp(-e/14))));
    const val_aug = epochs.map(e => 0.42 + 0.5 * (1 - Math.exp(-e/15)));
    Plotly.newPlot(id, [
      {x:epochs, y:train_no_aug, name:labels.tn, mode:'lines', line:{color:'#ff7676', width:2, dash:'dot'}},
      {x:epochs, y:val_no_aug,   name:labels.vn, mode:'lines', line:{color:'#ff7676', width:2.5}},
      {x:epochs, y:train_aug,    name:labels.ta, mode:'lines', line:{color:T.accent, width:2, dash:'dot'}},
      {x:epochs, y:val_aug,      name:labels.va, mode:'lines', line:{color:T.accent, width:2.5}}
    ], {
      paper_bgcolor:T.bg, plot_bgcolor:T.bg,
      font:{color:T.text}, margin:{t:40, r:20, b:50, l:60},
      xaxis:{title:labels.x, gridcolor:T.grid},
      yaxis:{title:labels.y, gridcolor:T.grid, range:[0.3, 1]},
      title:{text:labels.title, font:{color:T.text, size:14}},
      legend:{font:{color:T.text}, orientation:'h', y:-0.18}
    }, {responsive:true, displayModeBar:false});
  }
  makeAug('plot-cv-l2-aug-tr', {tn:'Eğitim (aug yok)', vn:'Doğrulama (aug yok)', ta:'Eğitim (aug)', va:'Doğrulama (aug)', x:'Epoch', y:'Doğruluk', title:'Artırmanın aşırı uyum üzerindeki etkisi'});
}, 250);</script>
`
};
