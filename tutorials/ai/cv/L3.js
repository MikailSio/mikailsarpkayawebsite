window.CV_L3 = {

en: `<p class="l-text"><strong>Before deep learning, classical CV ruled the field — and it still powers production pipelines today.</strong> Document scanners, license plate readers, medical preprocessing, and industrial defect inspection often use the techniques in this lesson rather than neural networks. They are fast, deterministic, and explainable.</p>

<p class="l-text">In this lesson you will learn convolution from first principles, smoothing and edge detection, thresholding and morphology, and then build a small document edge detector that ties everything together.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Implement 2D convolution with a kernel from scratch in numpy</li>
<li>Apply Gaussian and median blur, then Sobel and Canny edge detectors</li>
<li>Use Otsu and adaptive thresholding to binarize uneven-lit images</li>
<li>Clean masks with morphological erode, dilate, opening, and closing</li>
<li>Combine the pieces into a working document edge-detection pipeline</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Convolution: The Heart of Image Processing</h2>
<p class="l-text">A convolution slides a small kernel (typically 3x3 or 5x5) across the image, multiplies element-wise, and sums the result into the output pixel. Almost every classical filter — blur, sharpen, edge — is a particular kernel choice.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kernel</div><div class="card-body">Small matrix of weights (3x3, 5x5, 7x7) that defines the filter behavior.</div></div>
<div class="calc-card"><div class="card-title">Padding</div><div class="card-body">Adding border pixels (zeros or replicate) so output keeps the same size.</div></div>
<div class="calc-card"><div class="card-title">Stride</div><div class="card-body">Step size when sliding the kernel. Stride=1 keeps full resolution; stride=2 downsamples.</div></div>
<div class="calc-card"><div class="card-title">Receptive field</div><div class="card-body">Region of input that influences a single output pixel.</div></div>
</div>
<div class="katex-block">$$(I * K)(x,y) = \sum_{i}\sum_{j} I(x-i, y-j)\\, K(i,j)$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2
<span class="kw">import</span> numpy <span class="kw">as</span> np

img = cv2.<span class="fn">imread</span>(<span class="str">'photo.jpg'</span>, cv2.IMREAD_GRAYSCALE)

<span class="cm"># Sharpening kernel</span>
kernel = np.<span class="fn">array</span>([[ <span class="num">0</span>, -<span class="num">1</span>,  <span class="num">0</span>],
                   [-<span class="num">1</span>,  <span class="num">5</span>, -<span class="num">1</span>],
                   [ <span class="num">0</span>, -<span class="num">1</span>,  <span class="num">0</span>]], dtype=np.float32)

sharp = cv2.<span class="fn">filter2D</span>(img, -<span class="num">1</span>, kernel)
cv2.<span class="fn">imwrite</span>(<span class="str">'sharp.jpg'</span>, sharp)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Apply the same 3x3 sharpening kernel using \`scipy.signal.convolve2d\` on the grayscale of \`img\`.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.signal import convolve2d

gray = np.dot(img[..., :3], [0.299, 0.587, 0.114])

kernel = np.array([[ 0, -1,  0],
                   [-1,  5, -1],
                   [ 0, -1,  0]], dtype=np.float32)

sharp = convolve2d(gray, kernel, mode='same', boundary='symm')
sharp = np.clip(sharp, 0, 255).astype(np.uint8)

print('kernel sum (sharpen):', kernel.sum())
print('sharp shape:', sharp.shape, 'range:', sharp.min(), sharp.max())
print('center pixel before/after:', int(gray[32, 32]), int(sharp[32, 32]))</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Reads grayscale image. 2) Defines a sharpening kernel that boosts the center pixel and subtracts neighbors. 3) Applies <code>filter2D</code> which performs the convolution. 4) Saves result. The same template works for any 3x3 filter — only the kernel weights change.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Smoothing: Gaussian, Median, Bilateral</h2>
<p class="l-text">Smoothing reduces noise but each method preserves different structure. Pick wisely.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gaussian</div><div class="card-body">Weighted average using a 2D Gaussian. Smooth and fast, but blurs edges.</div></div>
<div class="calc-card"><div class="card-title">Median</div><div class="card-body">Replace pixel with median of neighborhood. Removes salt-and-pepper noise without softening edges.</div></div>
<div class="calc-card"><div class="card-title">Bilateral</div><div class="card-body">Edge-preserving — averages only pixels with similar intensity. Slower but keeps sharp boundaries.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>g  = cv2.<span class="fn">GaussianBlur</span>(img, (<span class="num">5</span>,<span class="num">5</span>), sigmaX=<span class="num">1.0</span>)
m  = cv2.<span class="fn">medianBlur</span>(img, <span class="num">5</span>)
b  = cv2.<span class="fn">bilateralFilter</span>(img, d=<span class="num">9</span>, sigmaColor=<span class="num">75</span>, sigmaSpace=<span class="num">75</span>)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Gaussian blur with 5x5 window and sigma=1. 2) Median blur with 5-pixel window — great for impulse noise. 3) Bilateral filter, where d is neighborhood diameter and sigmas control color/space falloff. Use bilateral when you want to denoise a face photo without losing eye and lip edges.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Edge Detection: Sobel, Scharr, Canny</h2>
<p class="l-text">Edges are sudden intensity changes. Most edge detectors compute image gradients first, then threshold.</p>
<div class="katex-block">$$|\\nabla I| = \sqrt{G_x^2 + G_y^2}, \\\quad \\theta = \\arctan\\!\\left(\frac{G_y}{G_x}\\right)$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sobel</div><div class="card-body">Approximates derivative with a 3x3 kernel. Fast, noisy on small kernels.</div></div>
<div class="calc-card"><div class="card-title">Scharr</div><div class="card-body">Optimized 3x3 derivative — better rotational symmetry than Sobel.</div></div>
<div class="calc-card"><div class="card-title">Canny</div><div class="card-body">4-stage pipeline: Gaussian smoothing, gradient, non-max suppression, double threshold + hysteresis.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>gx = cv2.<span class="fn">Sobel</span>(img, cv2.CV_64F, <span class="num">1</span>, <span class="num">0</span>, ksize=<span class="num">3</span>)
gy = cv2.<span class="fn">Sobel</span>(img, cv2.CV_64F, <span class="num">0</span>, <span class="num">1</span>, ksize=<span class="num">3</span>)
mag = cv2.<span class="fn">magnitude</span>(gx, gy)

edges = cv2.<span class="fn">Canny</span>(img, threshold1=<span class="num">80</span>, threshold2=<span class="num">160</span>)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sobel x-derivative emphasizes vertical edges; y-derivative emphasizes horizontal edges. 2) <code>magnitude</code> combines them via Pythagoras. 3) Canny runs the full 4-stage pipeline — its two thresholds drive hysteresis: pixels above the high threshold are strong edges, those between are kept only if connected to a strong edge.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Thresholding: Binary, Otsu, Adaptive</h2>
<p class="l-text">Thresholding turns grayscale into binary — foreground vs background. The trick is picking the threshold.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fixed</div><div class="card-body">Hardcoded value (e.g. 127). Fragile under lighting changes.</div></div>
<div class="calc-card"><div class="card-title">Otsu</div><div class="card-body">Picks the threshold that maximizes between-class variance. Works for bimodal histograms.</div></div>
<div class="calc-card"><div class="card-title">Adaptive</div><div class="card-body">Different threshold per region — essential for non-uniform lighting (scanned documents).</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>_, b1 = cv2.<span class="fn">threshold</span>(img, <span class="num">127</span>, <span class="num">255</span>, cv2.THRESH_BINARY)
_, b2 = cv2.<span class="fn">threshold</span>(img, <span class="num">0</span>, <span class="num">255</span>, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
b3 = cv2.<span class="fn">adaptiveThreshold</span>(img, <span class="num">255</span>, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                           cv2.THRESH_BINARY, blockSize=<span class="num">11</span>, C=<span class="num">2</span>)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Fixed threshold at 127. 2) Otsu searches the histogram for the optimal threshold automatically. 3) Adaptive threshold computes a local mean (here Gaussian-weighted) over an 11x11 block and subtracts C=2 — useful when the document has shadows.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Morphology: Erosion, Dilation, Open, Close</h2>
<p class="l-text">After thresholding you usually have noise, holes, or broken strokes. Morphology cleans these up using a structuring element (kernel).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Erosion</div><div class="card-body">Shrinks foreground; removes thin noise.</div></div>
<div class="calc-card"><div class="card-title">Dilation</div><div class="card-body">Grows foreground; fills small holes and joins fragments.</div></div>
<div class="calc-card"><div class="card-title">Opening</div><div class="card-body">Erosion then dilation — removes small specks while keeping shape.</div></div>
<div class="calc-card"><div class="card-title">Closing</div><div class="card-body">Dilation then erosion — fills small holes inside objects.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>k = cv2.<span class="fn">getStructuringElement</span>(cv2.MORPH_RECT, (<span class="num">3</span>,<span class="num">3</span>))
op = cv2.<span class="fn">morphologyEx</span>(b2, cv2.MORPH_OPEN, k, iterations=<span class="num">1</span>)
cl = cv2.<span class="fn">morphologyEx</span>(b2, cv2.MORPH_CLOSE, k, iterations=<span class="num">2</span>)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Build a 3x3 rectangular structuring element. 2) Opening removes small white specks from the binary image. 3) Closing seals tiny black holes inside characters — typical OCR preprocessing trick.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Contours and Document Edge Detection</h2>
<p class="l-text">Once you have a clean binary edge image, contour finding gives you object outlines as polygon point lists. We can use this to find the four corners of a document for a perspective warp.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>img = cv2.<span class="fn">imread</span>(<span class="str">'doc.jpg'</span>)
gray = cv2.<span class="fn">cvtColor</span>(img, cv2.COLOR_BGR2GRAY)
blur = cv2.<span class="fn">GaussianBlur</span>(gray, (<span class="num">5</span>,<span class="num">5</span>), <span class="num">0</span>)
edges = cv2.<span class="fn">Canny</span>(blur, <span class="num">75</span>, <span class="num">200</span>)

cnts, _ = cv2.<span class="fn">findContours</span>(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cnts = <span class="fn">sorted</span>(cnts, key=cv2.contourArea, reverse=<span class="kw">True</span>)[:<span class="num">5</span>]

doc = <span class="kw">None</span>
<span class="kw">for</span> c <span class="kw">in</span> cnts:
    peri = cv2.<span class="fn">arcLength</span>(c, <span class="kw">True</span>)
    approx = cv2.<span class="fn">approxPolyDP</span>(c, <span class="num">0.02</span> * peri, <span class="kw">True</span>)
    <span class="kw">if</span> <span class="fn">len</span>(approx) == <span class="num">4</span>:
        doc = approx
        <span class="kw">break</span>

cv2.<span class="fn">drawContours</span>(img, [doc], -<span class="num">1</span>, (<span class="num">0</span>,<span class="num">255</span>,<span class="num">0</span>), <span class="num">3</span>)
cv2.<span class="fn">imwrite</span>(<span class="str">'doc_outlined.jpg'</span>, img)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Read, grayscale, blur, Canny — the classical preprocessing chain. 2) <code>findContours</code> returns all closed shapes; we keep the 5 largest by area. 3) For each, approximate with a polygon; if it has exactly 4 vertices it is likely the document outline. 4) Draw the result. A small extension would feed these 4 corners into <code>cv2.warpPerspective</code> to obtain a flat top-down scan.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pipeline Comparison</h2>
<p class="l-text">Below: typical relative cost (lower is faster) of each step in a classical preprocessing chain.</p>
<div id="cv-l3-plot-en" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Convolution is the universal building block — change the kernel, change the filter.<br><strong>2.</strong> Match smoothing to noise: Gaussian for general, median for impulse, bilateral for edge-preserving.<br><strong>3.</strong> Canny is the workhorse edge detector — tune its two thresholds carefully.<br><strong>4.</strong> Otsu picks thresholds automatically; adaptive thresholding handles uneven lighting.<br><strong>5.</strong> Morphology (open/close) cleans binary masks before contour analysis.<br><strong>6.</strong> Contours + polygon approximation is enough to build a document scanner.<br><strong>7.</strong> Next lesson: feature detection with SIFT and ORB — finding stable keypoints across views.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var stages = ['Read','Gaussian','Canny','Threshold','Morphology','Contours'];
  var costs  = [1, 3, 6, 2, 4, 5];
  var trace = { x: stages, y: costs, type:'bar', marker:{color:'#c8a96e'} };
  var layout = { margin:{t:20,r:20,b:60,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, yaxis:{title:'Relative cost'} };
  var en = document.getElementById('cv-l3-plot-en'); if (en) Plotly.newPlot(en, [trace], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l3-plot-tr'); if (tr) Plotly.newPlot(tr, [{x:['Okuma','Gauss','Canny','Eşikleme','Morfoloji','Konturlar'], y:costs, type:'bar', marker:{color:'#c8a96e'}}], Object.assign({}, layout, {yaxis:{title:'Göreceli maliyet'}}), {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Derin öğrenmeden önce klasik bilgisayarla görme alana hâkimdi — ve bugün hâlâ üretim hatlarını besliyor.</strong> Belge tarayıcılar, plaka okuyucular, tıbbi ön işleme ve endüstriyel kusur denetimi çoğu zaman sinir ağı yerine bu derste gördüğümüz teknikleri kullanır. Hızlıdır, deterministiktir ve açıklanabilir.</p>

<p class="l-text">Bu derste konvolüsyonu sıfırdan, yumuşatma ve kenar bulmayı, eşikleme ile morfolojiyi öğreneceksiniz. Sonunda bunları birleştirerek küçük bir belge kenarı tespit aracı kuracağız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir kernel ile 2B konvolüsyonu numpy'da sıfırdan yazmayı</li>
<li>Gaussian ve median blur uygulamayı, sonra Sobel ve Canny ile kenar bulmayı</li>
<li>Eşit aydınlanmayan görüntülerde Otsu ve adaptif eşikleme ile binary maske üretmeyi</li>
<li>Maskeleri morfolojik erode, dilate, opening, closing ile temizlemeyi</li>
<li>Tüm parçaları çalışan bir belge kenarı tespit pipeline'ında birleştirmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Konvolüsyon: Görüntü İşlemenin Kalbi</h2>
<p class="l-text">Konvolüsyon, küçük bir çekirdeği (genelde 3x3 ya da 5x5) görüntü üzerinde kaydırır, eleman bazında çarpar ve toplamı çıkış pikseline yazar. Bulanıklaştırma, keskinleştirme, kenar — neredeyse tüm klasik filtreler özel bir çekirdek seçimidir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çekirdek</div><div class="card-body">Filtre davranışını belirleyen küçük ağırlık matrisi (3x3, 5x5, 7x7).</div></div>
<div class="calc-card"><div class="card-title">Padding</div><div class="card-body">Çıkış aynı boyutta kalsın diye eklenen kenar pikselleri (sıfır ya da replicate).</div></div>
<div class="calc-card"><div class="card-title">Stride</div><div class="card-body">Çekirdek kaydırılırken atlanan adım. Stride=1 tam çözünürlüğü korur, stride=2 yarıya indirir.</div></div>
<div class="calc-card"><div class="card-title">Alıcı alan</div><div class="card-body">Tek bir çıkış pikselini etkileyen giriş bölgesi.</div></div>
</div>
<div class="katex-block">$$(I * K)(x,y) = \sum_{i}\sum_{j} I(x-i, y-j)\\, K(i,j)$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2
<span class="kw">import</span> numpy <span class="kw">as</span> np

img = cv2.<span class="fn">imread</span>(<span class="str">'foto.jpg'</span>, cv2.IMREAD_GRAYSCALE)

<span class="cm"># Keskinleştirme çekirdeği</span>
kernel = np.<span class="fn">array</span>([[ <span class="num">0</span>, -<span class="num">1</span>,  <span class="num">0</span>],
                   [-<span class="num">1</span>,  <span class="num">5</span>, -<span class="num">1</span>],
                   [ <span class="num">0</span>, -<span class="num">1</span>,  <span class="num">0</span>]], dtype=np.float32)

keskin = cv2.<span class="fn">filter2D</span>(img, -<span class="num">1</span>, kernel)
cv2.<span class="fn">imwrite</span>(<span class="str">'keskin.jpg'</span>, keskin)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı 3x3 keskinleştirme çekirdeğini scipy.signal.convolve2d ile \`img\` gri tonlamasında uyguluyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.signal import convolve2d

gray = np.dot(img[..., :3], [0.299, 0.587, 0.114])

kernel = np.array([[ 0, -1,  0],
                   [-1,  5, -1],
                   [ 0, -1,  0]], dtype=np.float32)

sharp = convolve2d(gray, kernel, mode='same', boundary='symm')
sharp = np.clip(sharp, 0, 255).astype(np.uint8)

print('kernel sum (sharpen):', kernel.sum())
print('sharp shape:', sharp.shape, 'range:', sharp.min(), sharp.max())
print('center pixel before/after:', int(gray[32, 32]), int(sharp[32, 32]))</code></pre></div></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Gri tonlu görüntüyü okur. 2) Merkez pikseli güçlendirip komşuları çıkaran bir keskinleştirme çekirdeği tanımlar. 3) <code>filter2D</code> ile konvolüsyonu uygular. 4) Sonucu kaydeder. Aynı şablon her 3x3 filtre için geçerli — sadece çekirdek değişir.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Yumuşatma: Gauss, Medyan, Bilateral</h2>
<p class="l-text">Yumuşatma gürültüyü azaltır ama her yöntem farklı yapıyı korur. Doğru olanı seçmek önemli.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gauss</div><div class="card-body">2B Gauss çekirdeğiyle ağırlıklı ortalama. Hızlı ve düzgün ama kenarları bulanıklaştırır.</div></div>
<div class="calc-card"><div class="card-title">Medyan</div><div class="card-body">Pikseli komşuluk medyanı ile değiştirir. Tuz-biber gürültüsünü kenarları yumuşatmadan temizler.</div></div>
<div class="calc-card"><div class="card-title">Bilateral</div><div class="card-body">Kenar koruyan — sadece yoğunluğu benzer pikselleri ortalar. Yavaş ama keskin sınırları korur.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>g  = cv2.<span class="fn">GaussianBlur</span>(img, (<span class="num">5</span>,<span class="num">5</span>), sigmaX=<span class="num">1.0</span>)
m  = cv2.<span class="fn">medianBlur</span>(img, <span class="num">5</span>)
b  = cv2.<span class="fn">bilateralFilter</span>(img, d=<span class="num">9</span>, sigmaColor=<span class="num">75</span>, sigmaSpace=<span class="num">75</span>)
</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) 5x5 pencere ve sigma=1 ile Gauss yumuşatma. 2) 5 piksel medyan — anlık gürültü için ideal. 3) Bilateral filtre; d komşuluk çapı, sigma'lar ise renk/uzay etkisini kontrol eder. Bir yüz fotoğrafını göz ve dudak kenarlarını kaybetmeden temizlemek istiyorsanız bilateral kullanın.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Kenar Bulma: Sobel, Scharr, Canny</h2>
<p class="l-text">Kenar, yoğunluğun aniden değiştiği yerdir. Çoğu kenar bulucu önce gradyanı hesaplar, sonra eşikleme uygular.</p>
<div class="katex-block">$$|\\nabla I| = \sqrt{G_x^2 + G_y^2}, \\\quad \\theta = \\arctan\\!\\left(\frac{G_y}{G_x}\\right)$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sobel</div><div class="card-body">Türevi 3x3 çekirdekle yaklaşır. Hızlı, küçük çekirdekte gürültülü.</div></div>
<div class="calc-card"><div class="card-title">Scharr</div><div class="card-body">Optimize 3x3 türev — Sobel'den daha iyi dönme simetrisi sağlar.</div></div>
<div class="calc-card"><div class="card-title">Canny</div><div class="card-body">4 aşamalı boru hattı: Gauss yumuşatma, gradyan, non-max bastırma, çift eşik + histerezis.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>gx = cv2.<span class="fn">Sobel</span>(img, cv2.CV_64F, <span class="num">1</span>, <span class="num">0</span>, ksize=<span class="num">3</span>)
gy = cv2.<span class="fn">Sobel</span>(img, cv2.CV_64F, <span class="num">0</span>, <span class="num">1</span>, ksize=<span class="num">3</span>)
mag = cv2.<span class="fn">magnitude</span>(gx, gy)

kenarlar = cv2.<span class="fn">Canny</span>(img, threshold1=<span class="num">80</span>, threshold2=<span class="num">160</span>)
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Sobel x-türevi dikey kenarları, y-türevi yatay kenarları öne çıkarır. 2) <code>magnitude</code> Pisagor ile ikisini birleştirir. 3) Canny tüm 4 aşamalı boru hattını koşar — iki eşik histerezisi sürer: yüksek eşiğin üstündekiler güçlü kenar, aralarındakiler ancak güçlü bir kenara bağlıysa korunur.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Eşikleme: İkili, Otsu, Adaptif</h2>
<p class="l-text">Eşikleme gri tonu ikiliye çevirir — ön plan ve arka plan. Önemli olan eşik değerini seçmektir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sabit</div><div class="card-body">Sabit değer (örn. 127). Aydınlatma değişince çabuk bozulur.</div></div>
<div class="calc-card"><div class="card-title">Otsu</div><div class="card-body">Sınıflar arası varyansı maksimize eden eşiği seçer. İki tepeli histogramda işe yarar.</div></div>
<div class="calc-card"><div class="card-title">Adaptif</div><div class="card-body">Bölgeye göre eşik — düzensiz aydınlatma (taranmış belge) için şart.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>_, b1 = cv2.<span class="fn">threshold</span>(img, <span class="num">127</span>, <span class="num">255</span>, cv2.THRESH_BINARY)
_, b2 = cv2.<span class="fn">threshold</span>(img, <span class="num">0</span>, <span class="num">255</span>, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
b3 = cv2.<span class="fn">adaptiveThreshold</span>(img, <span class="num">255</span>, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                           cv2.THRESH_BINARY, blockSize=<span class="num">11</span>, C=<span class="num">2</span>)
</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) 127'de sabit eşik. 2) Otsu en iyi eşiği histogramda otomatik arar. 3) Adaptif eşik 11x11 bloklarda yerel ortalama (burada Gauss ağırlıklı) hesaplar ve C=2 çıkarır — belgede gölge varsa idealdir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Morfoloji: Aşınma, Genişleme, Açma, Kapatma</h2>
<p class="l-text">Eşikleme sonrası genelde gürültü, delik ya da kırık çizgiler kalır. Morfoloji bunları yapı elemanı (kernel) kullanarak temizler.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aşınma</div><div class="card-body">Ön planı küçültür; ince gürültüyü kaldırır.</div></div>
<div class="calc-card"><div class="card-title">Genişleme</div><div class="card-body">Ön planı büyütür; küçük delikleri doldurur ve parçaları birleştirir.</div></div>
<div class="calc-card"><div class="card-title">Açma</div><div class="card-body">Önce aşınma, sonra genişleme — şekli koruyarak küçük noktaları siler.</div></div>
<div class="calc-card"><div class="card-title">Kapatma</div><div class="card-body">Önce genişleme, sonra aşınma — nesne içindeki küçük delikleri doldurur.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>k = cv2.<span class="fn">getStructuringElement</span>(cv2.MORPH_RECT, (<span class="num">3</span>,<span class="num">3</span>))
ac = cv2.<span class="fn">morphologyEx</span>(b2, cv2.MORPH_OPEN, k, iterations=<span class="num">1</span>)
kp = cv2.<span class="fn">morphologyEx</span>(b2, cv2.MORPH_CLOSE, k, iterations=<span class="num">2</span>)
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) 3x3 dikdörtgen yapı elemanı. 2) Açma ikili görüntüden küçük beyaz noktaları siler. 3) Kapatma karakter içindeki küçük siyah delikleri kapar — klasik OCR ön işleme hilesi.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Konturlar ve Belge Kenarı Tespiti</h2>
<p class="l-text">Temiz bir ikili kenar görüntün varsa, kontur bulma sana nesne çevrelerini çokgen nokta listeleri olarak verir. Bunu kullanarak bir belgenin dört köşesini bulup perspektif düzeltebiliriz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>img = cv2.<span class="fn">imread</span>(<span class="str">'belge.jpg'</span>)
gri = cv2.<span class="fn">cvtColor</span>(img, cv2.COLOR_BGR2GRAY)
yum = cv2.<span class="fn">GaussianBlur</span>(gri, (<span class="num">5</span>,<span class="num">5</span>), <span class="num">0</span>)
kenar = cv2.<span class="fn">Canny</span>(yum, <span class="num">75</span>, <span class="num">200</span>)

cnts, _ = cv2.<span class="fn">findContours</span>(kenar, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cnts = <span class="fn">sorted</span>(cnts, key=cv2.contourArea, reverse=<span class="kw">True</span>)[:<span class="num">5</span>]

belge = <span class="kw">None</span>
<span class="kw">for</span> c <span class="kw">in</span> cnts:
    cevre = cv2.<span class="fn">arcLength</span>(c, <span class="kw">True</span>)
    yak = cv2.<span class="fn">approxPolyDP</span>(c, <span class="num">0.02</span> * cevre, <span class="kw">True</span>)
    <span class="kw">if</span> <span class="fn">len</span>(yak) == <span class="num">4</span>:
        belge = yak
        <span class="kw">break</span>

cv2.<span class="fn">drawContours</span>(img, [belge], -<span class="num">1</span>, (<span class="num">0</span>,<span class="num">255</span>,<span class="num">0</span>), <span class="num">3</span>)
cv2.<span class="fn">imwrite</span>(<span class="str">'belge_cizili.jpg'</span>, img)
</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Oku, gri yap, yumuşat, Canny — klasik ön işleme zinciri. 2) <code>findContours</code> tüm kapalı şekilleri verir; alana göre en büyük 5'ini tutuyoruz. 3) Her birini çokgenle yaklaştırırız; tam 4 köşeli ise muhtemelen belge kenarıdır. 4) Sonucu çiziyoruz. Küçük bir uzantıyla bu 4 köşeyi <code>cv2.warpPerspective</code> fonksiyonuna verip düz bir tarama elde edebiliriz.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Boru Hattı Karşılaştırması</h2>
<p class="l-text">Aşağıda klasik bir ön işleme zincirinin her aşamasının tipik göreceli maliyeti (düşük = hızlı).</p>
<div id="cv-l3-plot-tr" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Konvolüsyon evrensel yapı taşıdır — çekirdeği değiştirin, filtre değişir.<br><strong>2.</strong> Gürültüye göre yumuşatma seçin: genel için Gauss, dürtüsel için medyan, kenar koruyan için bilateral.<br><strong>3.</strong> Canny en güvenilir kenar bulucudur — iki eşiği dikkatli ayarlayın.<br><strong>4.</strong> Otsu eşiği otomatik seçer; adaptif eşik dengesiz aydınlatmayı çözer.<br><strong>5.</strong> Morfoloji (açma/kapatma) kontur analizinden önce ikili maskeyi temizler.<br><strong>6.</strong> Kontur + çokgen yaklaşımı bir belge tarayıcısı için yeterlidir.<br><strong>7.</strong> Sonraki ders: SIFT ve ORB ile özellik tespiti — farklı görüntüler arasında kararlı anahtar noktalar bulma.</div></div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var stages = ['Read','Gaussian','Canny','Threshold','Morphology','Contours'];
  var costs  = [1, 3, 6, 2, 4, 5];
  var trace = { x: stages, y: costs, type:'bar', marker:{color:'#c8a96e'} };
  var layout = { margin:{t:20,r:20,b:60,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, yaxis:{title:'Göreceli maliyet'} };
  var en = document.getElementById('cv-l3-plot-en'); if (en) Plotly.newPlot(en, [trace], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l3-plot-tr'); if (tr) Plotly.newPlot(tr, [{x:['Okuma','Gauss','Canny','Eşikleme','Morfoloji','Konturlar'], y:costs, type:'bar', marker:{color:'#c8a96e'}}], Object.assign({}, layout, {yaxis:{title:'Göreceli maliyet'}}), {displayModeBar:false});
}, 250);</script>
`
};
