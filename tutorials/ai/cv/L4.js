window.CV_L4 = {

en: `<p class="l-text"><strong>Pixels alone are fragile — illumination, scale, and rotation all break naive comparison.</strong> Feature detection finds stable keypoints with descriptors that survive these transformations, enabling panorama stitching, image retrieval, and SLAM.</p>

<p class="l-text">In this lesson you will learn why we need features, the intuition behind Harris corners, the SIFT pipeline, the ORB alternative, and how to match keypoints between two images.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Detect Harris corners from the structure tensor and eigenvalue criterion</li>
<li>Walk through the full SIFT pipeline — DoG pyramid, orientation, descriptor</li>
<li>Use the binary ORB alternative for fast real-time matching</li>
<li>Match keypoints between two images with brute-force and FLANN matchers</li>
<li>Filter false matches with the Lowe ratio test and visualize correspondences</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Features?</h2>
<p class="l-text">If you compare two photos pixel-by-pixel, even a 1-pixel shift destroys the similarity. Features summarize an image as a list of "interesting points" plus a fingerprint per point.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Keypoint</div><div class="card-body">Location (x,y), scale, orientation. Where an interesting structure lives.</div></div>
<div class="calc-card"><div class="card-title">Descriptor</div><div class="card-body">A vector (e.g. 128-D for SIFT) that summarizes the patch around a keypoint.</div></div>
<div class="calc-card"><div class="card-title">Invariance</div><div class="card-body">Same descriptor under translation, rotation, scale changes — sometimes lighting too.</div></div>
<div class="calc-card"><div class="card-title">Use cases</div><div class="card-body">Panorama, object recognition, AR markers, SLAM, near-duplicate retrieval.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Harris Corner Detection</h2>
<p class="l-text">Corners — points where intensity changes in two directions — are stable across viewpoints. Harris quantifies this with a structure tensor M and a response score R.</p>
<div class="katex-block">$$R = \\det(M) - k\\,(\\text{trace}(M))^2$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Flat</div><div class="card-body">Both eigenvalues small → R ~ 0.</div></div>
<div class="calc-card"><div class="card-title">Edge</div><div class="card-body">One large, one small → R is negative.</div></div>
<div class="calc-card"><div class="card-title">Corner</div><div class="card-body">Both large → R is large positive. These are the keypoints.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2, numpy <span class="kw">as</span> np
img = cv2.<span class="fn">imread</span>(<span class="str">'chess.jpg'</span>)
gray = np.<span class="fn">float32</span>(cv2.<span class="fn">cvtColor</span>(img, cv2.COLOR_BGR2GRAY))
R = cv2.<span class="fn">cornerHarris</span>(gray, blockSize=<span class="num">2</span>, ksize=<span class="num">3</span>, k=<span class="num">0.04</span>)
img[R &gt; <span class="num">0.01</span> * R.<span class="fn">max</span>()] = [<span class="num">0</span>,<span class="num">0</span>,<span class="num">255</span>]
cv2.<span class="fn">imwrite</span>(<span class="str">'harris.jpg'</span>, img)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same idea using only numpy on the preloaded \`img\` (64x64x3 uint8). We compute grayscale and an HSV-like channel manually.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
print('img shape:', img.shape, 'dtype:', img.dtype)

# Manual grayscale via luminance weights
gray = np.dot(img[..., :3], [0.299, 0.587, 0.114]).astype(np.uint8)

# Simple max-min channel = saturation proxy
mx = img.max(axis=-1).astype(np.float32)
mn = img.min(axis=-1).astype(np.float32)
sat = np.where(mx &gt; 0, (mx - mn) / (mx + 1e-9), 0)

print('gray shape:', gray.shape, 'gray range:', gray.min(), gray.max())
print('saturation mean:', round(float(sat.mean()), 3))</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Convert to float gray. 2) <code>cornerHarris</code> computes R for every pixel using a 2x2 neighborhood and Sobel ksize=3 derivatives. 3) Mark pixels exceeding 1% of the max response as red — these are corners.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. SIFT: Scale-Invariant Feature Transform</h2>
<p class="l-text">SIFT (Lowe, 2004) was the first widely used feature that handles scale and rotation. Pipeline:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. DoG pyramid</div><div class="card-body">Difference of Gaussians at multiple scales — finds blobs of all sizes.</div></div>
<div class="calc-card"><div class="card-title">2. Keypoint localization</div><div class="card-body">Sub-pixel refinement; reject low-contrast and edge responses.</div></div>
<div class="calc-card"><div class="card-title">3. Orientation</div><div class="card-body">Dominant gradient direction → rotation invariance.</div></div>
<div class="calc-card"><div class="card-title">4. Descriptor</div><div class="card-body">128-D vector: 4x4 grid x 8 orientation bins around keypoint.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>sift = cv2.<span class="fn">SIFT_create</span>(nfeatures=<span class="num">500</span>)
kp, desc = sift.<span class="fn">detectAndCompute</span>(gray, <span class="kw">None</span>)
<span class="fn">print</span>(<span class="fn">len</span>(kp), desc.shape)   <span class="cm"># 500 keypoints, (500, 128)</span>

vis = cv2.<span class="fn">drawKeypoints</span>(img, kp, <span class="kw">None</span>, flags=cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
cv2.<span class="fn">imwrite</span>(<span class="str">'sift_kp.jpg'</span>, vis)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Create SIFT detector capped at 500 features. 2) <code>detectAndCompute</code> returns keypoints and a 128-D descriptor matrix. 3) <code>drawKeypoints</code> visualizes each keypoint with a circle whose radius reflects scale and a line for orientation.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ORB: Oriented FAST + Rotated BRIEF</h2>
<p class="l-text">SIFT was patented for years; ORB was OpenCV's open-source answer. ORB combines the FAST corner detector with a rotation-aware version of the BRIEF binary descriptor.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">FAST</div><div class="card-body">Tests intensity around a circle of 16 pixels — extremely fast corner detector.</div></div>
<div class="calc-card"><div class="card-title">BRIEF</div><div class="card-body">256-bit binary string from random pixel-pair comparisons.</div></div>
<div class="calc-card"><div class="card-title">Speed</div><div class="card-body">10–100x faster than SIFT; uses Hamming distance for matching.</div></div>
<div class="calc-card"><div class="card-title">Tradeoff</div><div class="card-body">Less robust to extreme scale or viewpoint changes than SIFT.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2
orb = cv2.<span class="fn">ORB_create</span>(nfeatures=<span class="num">1000</span>)
kp1, d1 = orb.<span class="fn">detectAndCompute</span>(g1, <span class="kw">None</span>)
kp2, d2 = orb.<span class="fn">detectAndCompute</span>(g2, <span class="kw">None</span>)
<span class="fn">print</span>(d1.dtype, d1.shape)   <span class="cm"># uint8, (1000, 32) -- 32 bytes = 256 bits</span>
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build a tiny binary descriptor manually: sample 16 random pixel pairs around the image center and threshold them — same idea as ORB's BRIEF descriptor.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(7)

gray = np.dot(img[..., :3], [0.299, 0.587, 0.114]).astype(np.float32)
H, W = gray.shape

cy, cx = H // 2, W // 2
N = 16
ys1 = rng.integers(cy-10, cy+10, N); xs1 = rng.integers(cx-10, cx+10, N)
ys2 = rng.integers(cy-10, cy+10, N); xs2 = rng.integers(cx-10, cx+10, N)

descriptor = (gray[ys1, xs1] &lt; gray[ys2, xs2]).astype(np.uint8)
print('descriptor (16 bits):', descriptor.tolist())
print('Hamming weight:', int(descriptor.sum()))</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Build ORB with up to 1000 keypoints. 2) Detect and describe in two images. 3) The descriptor matrix is a binary uint8 (32 bytes per keypoint = 256 bits). Hamming distance between two descriptors counts differing bits.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Matching: Brute-Force and FLANN</h2>
<p class="l-text">Once both images have descriptors, we pair each descriptor in image A with its closest match in image B.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Brute-force</div><div class="card-body">Check all pairs. Simple, exact, fine for thousands of features.</div></div>
<div class="calc-card"><div class="card-title">FLANN</div><div class="card-body">Approximate nearest neighbor (kd-tree, LSH). Much faster on large feature sets.</div></div>
<div class="calc-card"><div class="card-title">Lowe's ratio test</div><div class="card-body">Keep match m1 only if dist(m1) &lt; 0.75 · dist(m2) — filters ambiguous matches.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2
bf = cv2.<span class="fn">BFMatcher</span>(cv2.NORM_HAMMING)
matches = bf.<span class="fn">knnMatch</span>(d1, d2, k=<span class="num">2</span>)

good = []
<span class="kw">for</span> m, n <span class="kw">in</span> matches:
    <span class="kw">if</span> m.distance &lt; <span class="num">0.75</span> * n.distance:
        good.<span class="fn">append</span>(m)

<span class="fn">print</span>(<span class="str">'good matches:'</span>, <span class="fn">len</span>(good))
out = cv2.<span class="fn">drawMatches</span>(img1, kp1, img2, kp2, good[:<span class="num">50</span>], <span class="kw">None</span>, flags=<span class="num">2</span>)
cv2.<span class="fn">imwrite</span>(<span class="str">'matches.jpg'</span>, out)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Match two descriptor sets via Hamming distance and apply Lowe's ratio test using only numpy.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

d1 = rng.integers(0, 2, size=(20, 32), dtype=np.uint8)
d2 = rng.integers(0, 2, size=(25, 32), dtype=np.uint8)

# Hamming distance matrix
H = (d1[:, None, :] != d2[None, :, :]).sum(axis=-1)

# k=2 nearest neighbours
order = np.argsort(H, axis=1)
d_best = H[np.arange(20), order[:, 0]]
d_2nd  = H[np.arange(20), order[:, 1]]

ratio = d_best / np.maximum(d_2nd, 1)
good = np.where(ratio &lt; 0.75)[0]
print('# matches:', len(good), '/ 20')
print('best distances:', d_best[:5].tolist())</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Brute-force matcher with Hamming distance (correct for ORB binary descriptors; use NORM_L2 for SIFT). 2) <code>knnMatch</code> with k=2 returns the two nearest matches per descriptor. 3) Lowe ratio keeps only the matches that are clearly distinct from their runner-up. 4) Draw the top 50.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. From Matches to Geometry: Homography</h2>
<p class="l-text">Good matches give us a set of point correspondences. Fitting a homography with RANSAC tells us how to align the two images — the basis of panorama stitching.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2
src = np.<span class="fn">float32</span>([kp1[m.queryIdx].pt <span class="kw">for</span> m <span class="kw">in</span> good]).<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>,<span class="num">2</span>)
dst = np.<span class="fn">float32</span>([kp2[m.trainIdx].pt <span class="kw">for</span> m <span class="kw">in</span> good]).<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>,<span class="num">2</span>)

H, mask = cv2.<span class="fn">findHomography</span>(src, dst, cv2.RANSAC, <span class="num">5.0</span>)
<span class="fn">print</span>(<span class="str">'inliers:'</span>, <span class="fn">int</span>(mask.<span class="fn">sum</span>()))
warped = cv2.<span class="fn">warpPerspective</span>(img1, H, (img2.shape[<span class="num">1</span>], img2.shape[<span class="num">0</span>]))
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Solve for an affine transform between two 2-D point clouds using least squares — a simplified RANSAC-free homography.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(2)

src = rng.uniform(0, 100, size=(20, 2))
A_true = np.array([[1.05, 0.02], [-0.03, 0.97]])
t_true = np.array([3.0, -1.0])
dst = src @ A_true.T + t_true + rng.normal(0, 0.5, size=src.shape)

# Solve [src | 1] @ M = dst
X = np.hstack([src, np.ones((20, 1))])
M, *_ = np.linalg.lstsq(X, dst, rcond=None)
A_hat, t_hat = M[:2].T, M[2]

print('A_true:\\n', A_true.round(2))
print('A_hat :\\n', A_hat.round(2))
print('t_hat :', t_hat.round(2))</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Stack source and destination match coordinates. 2) <code>findHomography</code> with RANSAC tolerates wrong matches by sampling 4-point subsets and counting inliers within 5 pixels. 3) <code>warpPerspective</code> warps image 1 into image 2's frame — the foundation for stitching.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Keypoint Counts vs Image Complexity</h2>
<p class="l-text">More texture = more keypoints. The chart below shows typical SIFT/ORB counts for different scene types.</p>
<div id="cv-l4-plot-en" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Features beat raw pixels for matching — invariance to translation, rotation, scale.<br><strong>2.</strong> Harris finds corners via the structure tensor; the response R scores cornerness.<br><strong>3.</strong> SIFT: DoG pyramid + 128-D descriptor; gold standard for accuracy.<br><strong>4.</strong> ORB: FAST + rotated BRIEF — much faster, binary descriptor, free to use.<br><strong>5.</strong> Use Lowe's 0.75 ratio test to drop ambiguous matches.<br><strong>6.</strong> RANSAC + homography turns matches into geometric alignment.<br><strong>7.</strong> Next lesson: classical CV ends here — we move to CNNs and deep image classification.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var scenes = ['Sky','Wall','Indoor','City','Forest'];
  var sift = [40, 90, 350, 800, 1200];
  var orb  = [60, 130, 500, 1100, 1600];
  var t1 = { x: scenes, y: sift, name:'SIFT', type:'bar', marker:{color:'#c8a96e'} };
  var t2 = { x: scenes, y: orb,  name:'ORB',  type:'bar', marker:{color:'#4de87a'} };
  var layout = { barmode:'group', margin:{t:20,r:20,b:60,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, yaxis:{title:'Keypoints'} };
  var en = document.getElementById('cv-l4-plot-en'); if (en) Plotly.newPlot(en, [t1,t2], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l4-plot-tr'); if (tr) Plotly.newPlot(tr, [{x:['Gökyüzü','Duvar','İç mekân','Şehir','Orman'],y:sift,name:'SIFT',type:'bar',marker:{color:'#c8a96e'}},{x:['Gökyüzü','Duvar','İç mekân','Şehir','Orman'],y:orb,name:'ORB',type:'bar',marker:{color:'#4de87a'}}], Object.assign({}, layout, {yaxis:{title:'Anahtar noktalar'}}), {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Sadece pikseller kırılgandır — aydınlatma, ölçek ve döndürme naif karşılaştırmayı yıkar.</strong> Özellik tespiti, bu dönüşümlere dayanan kararlı anahtar noktalar ve betimleyiciler bulur; panorama dikme, görüntü erişimi ve SLAM bunlarla mümkündür.</p>

<p class="l-text">Bu derste neden özelliklere ihtiyacımız olduğunu, Harris köşelerinin sezgisini, SIFT boru hattını, ORB alternatifini ve iki görüntü arasında anahtar nokta eşleştirmeyi öğreneceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Yapı tensörü ve özdeğer ölçütü ile Harris köşelerini tespit etmeyi</li>
<li>SIFT pipeline'ının tamamını — DoG piramidi, yön, betimleyici — adım adım izlemeyi</li>
<li>Hızlı gerçek zamanlı eşleştirme için ikili ORB alternatifini kullanmayı</li>
<li>Brute-force ve FLANN eşleştiricilerle iki görüntü arasında keypoint eşleştirmeyi</li>
<li>Lowe ratio testi ile yanlış eşleşmeleri filtrelemeyi ve sonuçları görselleştirmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Özellikler?</h2>
<p class="l-text">İki fotoğrafı piksel piksel karşılaştırırsanız 1 piksellik kayma bile benzerliği yıkar. Özellikler görüntüyü "ilginç noktalar" listesi ve her noktaya ait bir parmak izi olarak özetler.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Anahtar nokta</div><div class="card-body">Konum (x,y), ölçek, yön. İlginç bir yapının yaşadığı yer.</div></div>
<div class="calc-card"><div class="card-title">Betimleyici</div><div class="card-body">Anahtar nokta etrafındaki yamayı özetleyen vektör (SIFT'te 128 boyut).</div></div>
<div class="calc-card"><div class="card-title">Değişmezlik</div><div class="card-body">Öteleme, dönme, ölçek değişiminde aynı betimleyici — bazen aydınlatmada da.</div></div>
<div class="calc-card"><div class="card-title">Kullanım</div><div class="card-body">Panorama, nesne tanıma, AR işaretleyiciler, SLAM, kopya tespiti.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Harris Köşe Tespiti</h2>
<p class="l-text">Köşeler — yoğunluğun iki yönde de değiştiği noktalar — bakış açısı değişimine dayanır. Harris bunu yapı tensörü M ve cevap skoru R ile ölçer.</p>
<div class="katex-block">$$R = \\det(M) - k\\,(\\text{trace}(M))^2$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Düz</div><div class="card-body">Her iki özdeğer küçük → R ~ 0.</div></div>
<div class="calc-card"><div class="card-title">Kenar</div><div class="card-body">Biri büyük, diğeri küçük → R negatif.</div></div>
<div class="calc-card"><div class="card-title">Köşe</div><div class="card-body">İkisi de büyük → R büyük pozitif. Anahtar noktalar bunlar.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2, numpy <span class="kw">as</span> np
img = cv2.<span class="fn">imread</span>(<span class="str">'satranc.jpg'</span>)
gri = np.<span class="fn">float32</span>(cv2.<span class="fn">cvtColor</span>(img, cv2.COLOR_BGR2GRAY))
R = cv2.<span class="fn">cornerHarris</span>(gri, blockSize=<span class="num">2</span>, ksize=<span class="num">3</span>, k=<span class="num">0.04</span>)
img[R &gt; <span class="num">0.01</span> * R.<span class="fn">max</span>()] = [<span class="num">0</span>,<span class="num">0</span>,<span class="num">255</span>]
cv2.<span class="fn">imwrite</span>(<span class="str">'harris.jpg'</span>, img)
</code></pre></div>
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

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Float gri görüntüye çevirir. 2) <code>cornerHarris</code> 2x2 komşuluk ve Sobel ksize=3 türevleri ile her piksel için R hesaplar. 3) Maksimum cevabın %1'ini aşan pikselleri kırmızıya boyar — bunlar köşeler.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. SIFT: Ölçek Değişmez Özellik Dönüşümü</h2>
<p class="l-text">SIFT (Lowe, 2004) ölçek ve dönmeye dayanan ilk yaygın özellik yöntemidir. Boru hattı:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. DoG piramidi</div><div class="card-body">Çoklu ölçekte Gauss farkı — her boyuttaki blob'ları bulur.</div></div>
<div class="calc-card"><div class="card-title">2. Yerelleştirme</div><div class="card-body">Alt piksel iyileştirme; düşük kontrast ve kenar cevaplarını ayıkla.</div></div>
<div class="calc-card"><div class="card-title">3. Yön</div><div class="card-body">Baskın gradyan yönü → dönme değişmezliği.</div></div>
<div class="calc-card"><div class="card-title">4. Betimleyici</div><div class="card-body">128 boyutlu vektör: anahtar nokta etrafında 4x4 ızgara x 8 yön kovası.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>sift = cv2.<span class="fn">SIFT_create</span>(nfeatures=<span class="num">500</span>)
kp, desc = sift.<span class="fn">detectAndCompute</span>(gri, <span class="kw">None</span>)
<span class="fn">print</span>(<span class="fn">len</span>(kp), desc.shape)   <span class="cm"># 500 anahtar nokta, (500, 128)</span>

vis = cv2.<span class="fn">drawKeypoints</span>(img, kp, <span class="kw">None</span>, flags=cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
cv2.<span class="fn">imwrite</span>(<span class="str">'sift_kp.jpg'</span>, vis)
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) En fazla 500 özellikli SIFT dedektörü kurar. 2) <code>detectAndCompute</code> anahtar noktaları ve 128 boyutlu betimleyici matrisi döndürür. 3) <code>drawKeypoints</code> her noktayı ölçeği gösteren bir daire ve yönü gösteren bir çizgi ile çizer.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ORB: Yönlü FAST + Döndürülmüş BRIEF</h2>
<p class="l-text">SIFT yıllarca patentliydi; ORB OpenCV'nin açık kaynak cevabıdır. ORB, FAST köşe dedektörünü dönmeye duyarlı bir BRIEF ikili betimleyicisiyle birleştirir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">FAST</div><div class="card-body">16 piksellik daire üzerinde yoğunluk testi — son derece hızlı köşe dedektörü.</div></div>
<div class="calc-card"><div class="card-title">BRIEF</div><div class="card-body">Rastgele piksel çifti karşılaştırmalarından 256 bitlik ikili dizi.</div></div>
<div class="calc-card"><div class="card-title">Hız</div><div class="card-body">SIFT'ten 10–100 kat hızlı; eşleşmede Hamming uzaklığı kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Bedel</div><div class="card-body">Aşırı ölçek ya da bakış açısı değişimine SIFT'ten daha az dayanıklı.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2
orb = cv2.<span class="fn">ORB_create</span>(nfeatures=<span class="num">1000</span>)
kp1, d1 = orb.<span class="fn">detectAndCompute</span>(g1, <span class="kw">None</span>)
kp2, d2 = orb.<span class="fn">detectAndCompute</span>(g2, <span class="kw">None</span>)
<span class="fn">print</span>(d1.dtype, d1.shape)   <span class="cm"># uint8, (1000, 32) -- 32 bayt = 256 bit</span>
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Manuel mini binary descriptor: görüntü merkezinin etrafında 16 rastgele piksel çifti örnekleyip eşikliyoruz — ORB'un BRIEF descriptor mantığı.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(7)

gray = np.dot(img[..., :3], [0.299, 0.587, 0.114]).astype(np.float32)
H, W = gray.shape

cy, cx = H // 2, W // 2
N = 16
ys1 = rng.integers(cy-10, cy+10, N); xs1 = rng.integers(cx-10, cx+10, N)
ys2 = rng.integers(cy-10, cy+10, N); xs2 = rng.integers(cx-10, cx+10, N)

descriptor = (gray[ys1, xs1] &lt; gray[ys2, xs2]).astype(np.uint8)
print('betimleyici (16 bit):', descriptor.tolist())
print('Hamming ağırlığı:', int(descriptor.sum()))</code></pre></div></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Maksimum 1000 anahtar nokta için ORB kurar. 2) İki görüntüde tespit ve betimleme yapar. 3) Betimleyici matrisi ikili uint8 (anahtar nokta başına 32 bayt = 256 bit). İki betimleyici arası Hamming uzaklığı farklı bit sayısını sayar.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Eşleştirme: Brute-Force ve FLANN</h2>
<p class="l-text">İki görüntünün betimleyicisi olduğunda, A'daki her betimleyiciyi B'deki en yakın eşiyle eşleştiririz.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Brute-force</div><div class="card-body">Tüm çiftleri kontrol eder. Basit, kesin; binlerce özellik için yeter.</div></div>
<div class="calc-card"><div class="card-title">FLANN</div><div class="card-body">Yaklaşık en yakın komşu (kd-ağaç, LSH). Büyük özellik kümelerinde çok daha hızlı.</div></div>
<div class="calc-card"><div class="card-title">Lowe oran testi</div><div class="card-body">m1 eşleşmesi yalnızca dist(m1) &lt; 0.75 · dist(m2) ise tutulur — belirsiz eşleşmeleri ayıklar.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2
bf = cv2.<span class="fn">BFMatcher</span>(cv2.NORM_HAMMING)
eslesmeler = bf.<span class="fn">knnMatch</span>(d1, d2, k=<span class="num">2</span>)

iyi = []
<span class="kw">for</span> m, n <span class="kw">in</span> eslesmeler:
    <span class="kw">if</span> m.distance &lt; <span class="num">0.75</span> * n.distance:
        iyi.<span class="fn">append</span>(m)

<span class="fn">print</span>(<span class="str">'iyi eşleşme:'</span>, <span class="fn">len</span>(iyi))
out = cv2.<span class="fn">drawMatches</span>(img1, kp1, img2, kp2, iyi[:<span class="num">50</span>], <span class="kw">None</span>, flags=<span class="num">2</span>)
cv2.<span class="fn">imwrite</span>(<span class="str">'eslesme.jpg'</span>, out)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">İki descriptor kümesini Hamming uzaklığıyla eşleştirip Lowe ratio testini sadece numpy ile uyguluyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

d1 = rng.integers(0, 2, size=(20, 32), dtype=np.uint8)
d2 = rng.integers(0, 2, size=(25, 32), dtype=np.uint8)

# Hamming uzaklık matrisi
H = (d1[:, None, :] != d2[None, :, :]).sum(axis=-1)

# k=2 en yakın komşu
order = np.argsort(H, axis=1)
d_best = H[np.arange(20), order[:, 0]]
d_2nd  = H[np.arange(20), order[:, 1]]

ratio = d_best / np.maximum(d_2nd, 1)
good = np.where(ratio &lt; 0.75)[0]
print('eşleşme sayısı:', len(good), '/ 20')
print('en iyi uzaklıklar:', d_best[:5].tolist())</code></pre></div></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) ORB ikili betimleyicisi için Hamming uzaklığıyla brute-force eşleştirici (SIFT için NORM_L2 kullanın). 2) <code>knnMatch</code> k=2 ile her betimleyici için en yakın iki eşleşmeyi döndürür. 3) Lowe oranı ikinciden net biçimde ayrışan eşleşmeleri saklar. 4) İlk 50'sini çiziyoruz.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Eşleşmelerden Geometriye: Homografi</h2>
<p class="l-text">İyi eşleşmeler bize nokta yazışmaları verir. RANSAC ile homografi uydurmak iki görüntüyü nasıl hizalayacağımızı söyler — panorama dikmenin temeli.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2
kaynak = np.<span class="fn">float32</span>([kp1[m.queryIdx].pt <span class="kw">for</span> m <span class="kw">in</span> iyi]).<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>,<span class="num">2</span>)
hedef  = np.<span class="fn">float32</span>([kp2[m.trainIdx].pt <span class="kw">for</span> m <span class="kw">in</span> iyi]).<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>,<span class="num">2</span>)

H, maske = cv2.<span class="fn">findHomography</span>(kaynak, hedef, cv2.RANSAC, <span class="num">5.0</span>)
<span class="fn">print</span>(<span class="str">'inlier:'</span>, <span class="fn">int</span>(maske.<span class="fn">sum</span>()))
warp = cv2.<span class="fn">warpPerspective</span>(img1, H, (img2.shape[<span class="num">1</span>], img2.shape[<span class="num">0</span>]))
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">İki 2-D nokta bulutu arasındaki affine dönüşümü en küçük kareler ile çözüyoruz — RANSAC'sız sadeleştirilmiş homografi.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(2)

src = rng.uniform(0, 100, size=(20, 2))
A_true = np.array([[1.05, 0.02], [-0.03, 0.97]])
t_true = np.array([3.0, -1.0])
dst = src @ A_true.T + t_true + rng.normal(0, 0.5, size=src.shape)

# [src | 1] @ M = dst denklemini çöz
X = np.hstack([src, np.ones((20, 1))])
M, *_ = np.linalg.lstsq(X, dst, rcond=None)
A_hat, t_hat = M[:2].T, M[2]

print('A_gerçek:\\n', A_true.round(2))
print('A_tahmin:\\n', A_hat.round(2))
print('t_tahmin:', t_hat.round(2))</code></pre></div></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Kaynak ve hedef koordinatlarını yığar. 2) <code>findHomography</code> RANSAC ile 4 noktalı alt kümeleri örnekleyip 5 piksel içindeki inlier'ları sayarak yanlış eşleşmelere karşı dayanıklı kalır. 3) <code>warpPerspective</code> görüntü 1'i görüntü 2'nin çerçevesine büker — dikme için temel.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Anahtar Nokta Sayısı ve Görüntü Karmaşıklığı</h2>
<p class="l-text">Daha çok doku = daha çok anahtar nokta. Aşağıdaki grafik farklı sahne tiplerinde tipik SIFT/ORB sayılarını gösterir.</p>
<div id="cv-l4-plot-tr" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Eşleştirmede özellikler ham pikseli yener — öteleme, dönme, ölçek değişmezliği.<br><strong>2.</strong> Harris yapı tensörü ile köşeleri bulur; R skoru köşeselliği ölçer.<br><strong>3.</strong> SIFT: DoG piramidi + 128 boyutlu betimleyici; doğrulukta altın standart.<br><strong>4.</strong> ORB: FAST + döndürülmüş BRIEF — çok daha hızlı, ikili betimleyici, ücretsiz.<br><strong>5.</strong> Belirsiz eşleşmeleri elemek için Lowe 0.75 oran testini kullanın.<br><strong>6.</strong> RANSAC + homografi eşleşmeleri geometrik hizaya çevirir.<br><strong>7.</strong> Sonraki ders: klasik bilgisayarla görme burada bitiyor — CNN'lere ve derin görüntü sınıflandırmaya geçiyoruz.</div></div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var scenes = ['Sky','Wall','Indoor','City','Forest'];
  var sift = [40, 90, 350, 800, 1200];
  var orb  = [60, 130, 500, 1100, 1600];
  var t1 = { x: scenes, y: sift, name:'SIFT', type:'bar', marker:{color:'#c8a96e'} };
  var t2 = { x: scenes, y: orb,  name:'ORB',  type:'bar', marker:{color:'#4de87a'} };
  var layout = { barmode:'group', margin:{t:20,r:20,b:60,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, yaxis:{title:'Anahtar noktalar'} };
  var en = document.getElementById('cv-l4-plot-en'); if (en) Plotly.newPlot(en, [t1,t2], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l4-plot-tr'); if (tr) Plotly.newPlot(tr, [{x:['Gökyüzü','Duvar','İç mekân','Şehir','Orman'],y:sift,name:'SIFT',type:'bar',marker:{color:'#c8a96e'}},{x:['Gökyüzü','Duvar','İç mekân','Şehir','Orman'],y:orb,name:'ORB',type:'bar',marker:{color:'#4de87a'}}], Object.assign({}, layout, {yaxis:{title:'Anahtar noktalar'}}), {displayModeBar:false});
}, 250);</script>
`
};
