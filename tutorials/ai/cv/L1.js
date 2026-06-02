window.CV_L1 = {

en: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrices</a> <span style="opacity:0.55;font-size:0.82em">(Math L72)</span></li>
<li><a href="/tutorials/matematik/91" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Geometric Vectors</a> <span style="opacity:0.55;font-size:0.82em">(Math L91)</span></li>
<li><a href="/tutorials/matematik/17" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Derivative Definition</a> <span style="opacity:0.55;font-size:0.82em">(Math L17)</span></li>
</ul>
</div>
<p class="l-text"><strong>Computer vision teaches machines to see.</strong> Medical scans → diagnosis. Self-driving cars → environment perception. Phone cameras → portrait mode. All of it starts with the same fundamental question: how does a computer represent an image?</p>

<p class="l-text">In this lesson you will learn how images become numpy arrays, why color spaces matter, how to load and save images with PIL/OpenCV/matplotlib, and how to do basic pixel arithmetic. By the end you will run your first end-to-end CV pipeline.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Represent images as (H, W, C) numpy arrays with uint8 or float32 dtype</li>
<li>Convert between RGB, BGR, HSV, and grayscale color spaces with OpenCV</li>
<li>Load and save images using PIL, OpenCV, and matplotlib without channel-order bugs</li>
<li>Index pixels and ROIs with numpy slicing and apply per-pixel arithmetic</li>
<li>Build a complete load-process-save mini pipeline end-to-end</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Image as Array</h2>
<p class="l-text">An image is just a 3D numpy array. Shape <code>(H, W, C)</code> where H is height in pixels, W is width, C is the number of channels.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">H — Height</div><div class="card-body">Number of rows. A 1080p image has H=1080.</div></div>
<div class="calc-card"><div class="card-title">W — Width</div><div class="card-body">Number of columns. A 1080p image has W=1920.</div></div>
<div class="calc-card"><div class="card-title">C — Channels</div><div class="card-body">1 for grayscale, 3 for RGB, 4 for RGBA. Each channel is a 2D matrix of pixel intensities.</div></div>
<div class="calc-card"><div class="card-title">dtype</div><div class="card-body"><code>uint8</code> stores 0-255 (display). <code>float32</code> stores 0.0-1.0 (model input).</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> PIL <span class="kw">import</span> Image

img = Image.<span class="fn">open</span>(<span class="str">'cat.jpg'</span>)
arr = np.<span class="fn">array</span>(img)
<span class="fn">print</span>(arr.shape)   <span class="cm"># (H, W, 3) for RGB</span>
<span class="fn">print</span>(arr.dtype)   <span class="cm"># uint8</span>
<span class="fn">print</span>(arr.<span class="fn">min</span>(), arr.<span class="fn">max</span>())  <span class="cm"># 0, 255</span>
<span class="fn">print</span>(arr[<span class="num">0</span>, <span class="num">0</span>])   <span class="cm"># first pixel: [R, G, B]</span></code></pre></div>
<p class="l-text"><strong>What this code does step by step:</strong> 1) Opens the JPEG file with PIL. 2) Converts it to a numpy array via <code>np.array()</code>. 3) Prints the shape — for RGB it's (height, width, 3). 4) The dtype is always uint8 (0-255 range). 5) Shows the RGB values of the first pixel.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Color Spaces — RGB, BGR, HSV, Grayscale</h2>
<p class="l-text">The same image can be represented in different color spaces. Each is useful for different tasks.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">RGB</div><div class="card-body">Red, Green, Blue. Standard for display. PIL and matplotlib default.</div></div>
<div class="calc-card"><div class="card-title">BGR</div><div class="card-body">Blue, Green, Red — same channels, different order. <strong>OpenCV's default</strong>. A common bug: cv2 reads BGR but matplotlib expects RGB.</div></div>
<div class="calc-card"><div class="card-title">HSV</div><div class="card-body">Hue (color), Saturation (purity), Value (brightness). Better for color-based segmentation (e.g. "find all red objects").</div></div>
<div class="calc-card"><div class="card-title">Grayscale</div><div class="card-body">Single channel, 0=black to 255=white. Removes color information. Faster processing.</div></div>
</div>
<div class="katex-block">$$Y = 0.299 R + 0.587 G + 0.114 B$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Y</div><div class="card-body">Grayscale luminance value (0-255).</div></div>
<div class="calc-card"><div class="card-title">R, G, B</div><div class="card-body">Red, green, blue channel values (0-255).</div></div>
<div class="calc-card"><div class="card-title">Coefficients</div><div class="card-body">Match human eye sensitivity — green contributes most, blue least.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2

bgr = cv2.<span class="fn">imread</span>(<span class="str">'cat.jpg'</span>)              <span class="cm"># BGR — careful!</span>
rgb = cv2.<span class="fn">cvtColor</span>(bgr, cv2.COLOR_BGR2RGB)
gray = cv2.<span class="fn">cvtColor</span>(rgb, cv2.COLOR_RGB2GRAY)
hsv = cv2.<span class="fn">cvtColor</span>(rgb, cv2.COLOR_RGB2HSV)

<span class="fn">print</span>(bgr.shape, gray.shape, hsv.shape)
<span class="cm"># (H,W,3) (H,W) (H,W,3)</span></code></pre></div>
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

<p class="l-text"><strong>What this code does step by step:</strong> 1) Reads the image with OpenCV in BGR format. 2) Converts BGR to RGB (for visualization). 3) Converts RGB to grayscale (single channel). 4) Converts RGB to HSV (for color analysis). Notice how the shape changes with each conversion.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Loading & Saving — PIL, OpenCV, matplotlib</h2>
<p class="l-text">Three popular libraries, each with strengths and quirks.</p>
<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">PIL / Pillow</div>
<div class="compare-item">RGB by default — sane.</div>
<div class="compare-item">Slower than OpenCV.</div>
<div class="compare-item">Pythonic API, lazy loading.</div>
<div class="compare-item">Best for offline processing.</div>
</div>
<div class="compare-col">
<div class="compare-title">OpenCV (cv2)</div>
<div class="compare-item">BGR by default — common bug source.</div>
<div class="compare-item">Fastest, C++ underneath.</div>
<div class="compare-item">Best for video and real-time.</div>
<div class="compare-item">Many built-in CV algorithms.</div>
</div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> PIL <span class="kw">import</span> Image
<span class="kw">import</span> cv2
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

<span class="cm"># Load</span>
img_pil = Image.<span class="fn">open</span>(<span class="str">'cat.jpg'</span>)          <span class="cm"># RGB</span>
img_cv2 = cv2.<span class="fn">imread</span>(<span class="str">'cat.jpg'</span>)          <span class="cm"># BGR!</span>
img_mpl = plt.<span class="fn">imread</span>(<span class="str">'cat.jpg'</span>)          <span class="cm"># RGB</span>

<span class="cm"># Save</span>
img_pil.<span class="fn">save</span>(<span class="str">'out.png'</span>)
cv2.<span class="fn">imwrite</span>(<span class="str">'out.png'</span>, img_cv2)
plt.<span class="fn">imsave</span>(<span class="str">'out.png'</span>, img_mpl)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Use PIL on the preloaded \`img\` numpy array — round-trip array → PIL Image → array, and read pixel statistics.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from PIL import Image
import numpy as np

pil = Image.fromarray(img)               # numpy -&gt; PIL
print('size:', pil.size, 'mode:', pil.mode)

arr = np.array(pil)                       # PIL -&gt; numpy
print('round-trip ok:', np.array_equal(arr, img))

# Per-channel mean
print('R/G/B mean:', img[...,0].mean().round(1), img[...,1].mean().round(1), img[...,2].mean().round(1))</code></pre></div></div>

<p class="l-text"><strong>What this code does step by step:</strong> 1) Loads the same file with three different libraries. 2) PIL and matplotlib return RGB, OpenCV returns BGR. 3) Each library has its own save method. <strong>Pitfall:</strong> If you read with OpenCV and display with matplotlib, the colors look inverted — call <code>cvtColor(BGR2RGB)</code> first.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Pixel Operations — Indexing, Slicing, Math</h2>
<p class="l-text">Once an image is a numpy array, you can index, slice, and do arithmetic just like any matrix.</p>
<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Single pixel</div><div class="step-detail"><code>img[100, 200]</code> returns the 3-element [R,G,B] vector at row 100, col 200.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Row slice</div><div class="step-detail"><code>img[100:200, :]</code> takes rows 100-199, all columns. Result shape: (100, W, 3).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Single channel</div><div class="step-detail"><code>img[..., 0]</code> takes only the red channel. Result shape: (H, W).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Brightness +50</div><div class="step-detail"><code>np.clip(img.astype(int) + 50, 0, 255).astype(np.uint8)</code> — must clip to avoid overflow.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Invert colors</div><div class="step-detail"><code>255 - img</code> — gives photo negative.</div></div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Brightness adjustment with clip (no overflow)</span>
brighter = np.<span class="fn">clip</span>(img.<span class="fn">astype</span>(np.int16) + <span class="num">50</span>, <span class="num">0</span>, <span class="num">255</span>).<span class="fn">astype</span>(np.uint8)

<span class="cm"># Contrast: multiply around 128</span>
contrast = np.<span class="fn">clip</span>((img.<span class="fn">astype</span>(np.float32) - <span class="num">128</span>) * <span class="num">1.5</span> + <span class="num">128</span>, <span class="num">0</span>, <span class="num">255</span>).<span class="fn">astype</span>(np.uint8)

<span class="cm"># Invert</span>
inverted = <span class="num">255</span> - img

<span class="cm"># Channel mask: keep only red</span>
red_only = img.<span class="fn">copy</span>()
red_only[..., <span class="num">1</span>] = <span class="num">0</span>  <span class="cm"># green = 0</span>
red_only[..., <span class="num">2</span>] = <span class="num">0</span>  <span class="cm"># blue = 0</span></code></pre></div>
<p class="l-text"><strong>What this code does step by step:</strong> 1) Cast from <code>uint8</code> to <code>int16</code> so addition doesn't overflow. 2) Add a constant and clamp with <code>np.clip(0, 255)</code>. 3) Cast back to <code>uint8</code>. 4) For contrast, multiply around 128. 5) Channel masking: only red survives, green/blue are zeroed.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Histograms & Pixel Statistics</h2>
<p class="l-text">A histogram counts how many pixels fall in each intensity bin. It reveals exposure, contrast, and color cast at a glance.</p>
<div class="plotly-graph" id="plot-cv-l1-hist-en"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The red-channel histogram of an image. The x-axis is the pixel value (0-255), the y-axis is how many pixels have that value. Dark images shift left, bright images shift right. Bimodal (two-peak) histograms usually signal a foreground/background split — a hint for segmentation.</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

red = img[..., <span class="num">0</span>]
hist, bins = np.<span class="fn">histogram</span>(red, bins=<span class="num">256</span>, <span class="ty">range</span>=(<span class="num">0</span>, <span class="num">256</span>))

plt.<span class="fn">bar</span>(bins[:-<span class="num">1</span>], hist, width=<span class="num">1</span>, color=<span class="str">'red'</span>, alpha=<span class="num">0.7</span>)
plt.<span class="fn">xlabel</span>(<span class="str">'Pixel value'</span>); plt.<span class="fn">ylabel</span>(<span class="str">'Count'</span>)
plt.<span class="fn">title</span>(<span class="str">'Red channel histogram'</span>)
plt.<span class="fn">show</span>()

<span class="cm"># Per-channel statistics</span>
<span class="kw">for</span> i, name <span class="kw">in</span> <span class="fn">enumerate</span>([<span class="str">'R'</span>, <span class="str">'G'</span>, <span class="str">'B'</span>]):
    <span class="fn">print</span>(f<span class="str">"{name}: mean={img[...,i].mean():.1f}, std={img[...,i].std():.1f}"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does step by step:</strong> 1) Picks only the red channel. 2) Uses <code>np.histogram</code> to compute the 256-bin distribution. 3) Draws it as a bar chart. 4) Prints mean and std for each channel — a dramatic difference between channels signals a color cast.</p>
<div class="think-box"><div class="think-label">🧠 WHY IT MATTERS</div><div class="think-body">The histogram is the foundation of <strong>histogram equalization</strong> — it automatically brightens low-contrast images. It's also used for <strong>automatic exposure detection</strong>: if the histogram is squeezed to the left the image is dark, squeezed right means it's bright.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. End-to-End Pipeline</h2>
<p class="l-text">Putting it all together — your first complete CV mini-pipeline.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> PIL <span class="kw">import</span> Image

<span class="cm"># 1. Load</span>
img = Image.<span class="fn">open</span>(<span class="str">'input.jpg'</span>)
arr = np.<span class="fn">array</span>(img)
<span class="fn">print</span>(f<span class="str">"Loaded: {arr.shape}, dtype={arr.dtype}"</span>)

<span class="cm"># 2. Inspect</span>
<span class="fn">print</span>(f<span class="str">"Mean RGB: {arr.mean(axis=(0,1)).round(1)}"</span>)

<span class="cm"># 3. Modify — boost brightness +30</span>
boosted = np.<span class="fn">clip</span>(arr.<span class="fn">astype</span>(np.int16) + <span class="num">30</span>, <span class="num">0</span>, <span class="num">255</span>).<span class="fn">astype</span>(np.uint8)

<span class="cm"># 4. Save</span>
Image.<span class="fn">fromarray</span>(boosted).<span class="fn">save</span>(<span class="str">'output.jpg'</span>)
<span class="fn">print</span>(<span class="str">"Saved to output.jpg"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does step by step:</strong> 1) Loads a JPEG with PIL. 2) Converts to a numpy array and prints shape and dtype. 3) Computes the mean RGB of each channel. 4) Brightness +30 — clip to avoid overflow. 5) Converts back to PIL and saves as JPEG. This shape — load → inspect → modify → save — is the skeleton of every CV pipeline.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 SUMMARY</div><div class="think-body"><strong>1.</strong> Image = numpy array of shape (H, W, C). dtype is uint8 (0-255).<br><strong>2.</strong> RGB and BGR are SAME data, different order. OpenCV uses BGR — common bug.<br><strong>3.</strong> Grayscale: <code>Y = 0.299R + 0.587G + 0.114B</code>. Single channel.<br><strong>4.</strong> PIL = pythonic, OpenCV = fast, matplotlib = visualization.<br><strong>5.</strong> Pixel arithmetic: cast to int16, clip to [0,255], cast back to uint8.<br><strong>6.</strong> Histogram reveals exposure, contrast, color cast.<br><strong>7.</strong> Next lesson: resize, crop, normalize, augmentation — preparing images for ML models.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  const T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff6b9d',
    grid: 'rgba(255,255,255,0.06)'
  };
  function makeHist(id, label){
    const el = document.getElementById(id);
    if (!el) return;
    // Synthetic histogram: bell curve around 130
    const x = [], y = [];
    for (let i=0; i<256; i++) {
      x.push(i);
      const g = Math.exp(-Math.pow((i-130)/45, 2)) * 12000;
      y.push(g + Math.random()*800);
    }
    Plotly.newPlot(id, [{x, y, type:'bar', marker:{color: T.accent, line:{width:0}}}], {
      paper_bgcolor: T.bg, plot_bgcolor: T.bg,
      font: {color: T.text}, margin: {t:40, r:20, b:50, l:60},
      xaxis: {title: label.x, gridcolor: T.grid},
      yaxis: {title: label.y, gridcolor: T.grid},
      title: {text: label.title, font: {color: T.text, size: 14}},
      showlegend: false
    }, {responsive: true, displayModeBar: false});
  }
  makeHist('plot-cv-l1-hist-en', {x: 'Pixel value', y: 'Count', title: 'Red channel histogram'});
}, 250);</script>`,

tr: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrisler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L72)</span></li>
<li><a href="/tutorials/matematik/91" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Vektörler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L91)</span></li>
<li><a href="/tutorials/matematik/17" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Türev Tanımı</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L17)</span></li>
</ul>
</div>
<p class="l-text"><strong>Bilgisayarla görme, makinelere görmeyi öğretir.</strong> Tıbbi taramalar → tanı. Otonom araçlar → çevre algısı. Telefon kamerası → portre modu. Hepsinin başlangıcı aynı temel soru: bilgisayar bir görüntüyü nasıl temsil eder?</p>

<p class="l-text">Bu derste görüntülerin nasıl numpy array'ine dönüştüğünü, renk uzaylarının neden önemli olduğunu, PIL/OpenCV/matplotlib ile nasıl yükleyip kaydedeceğini ve temel piksel aritmetiğini öğreneceksin. Sonunda ilk uçtan uca CV pipeline'ını çalıştıracaksın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Görüntüleri (H, W, C) numpy array olarak uint8 veya float32 dtype ile temsil etmeyi</li>
<li>RGB, BGR, HSV ve grayscale renk uzayları arasında OpenCV ile dönüşüm yapmayı</li>
<li>PIL, OpenCV ve matplotlib ile kanal sırası hatasına düşmeden görüntü okuyup kaydetmeyi</li>
<li>Numpy slicing ile piksel ve ROI indekslemeyi, piksel başına aritmetik uygulamayı</li>
<li>Yükle-işle-kaydet adımlarını birleştirip uçtan uca mini bir pipeline kurmayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Görüntü = Array</h2>
<p class="l-text">Görüntü aslında 3B numpy array'idir. Şekil <code>(H, W, C)</code> — H yükseklik (piksel), W genişlik, C kanal sayısı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">H — Yükseklik</div><div class="card-body">Satır sayısı. 1080p görüntüde H=1080.</div></div>
<div class="calc-card"><div class="card-title">W — Genişlik</div><div class="card-body">Sütun sayısı. 1080p görüntüde W=1920.</div></div>
<div class="calc-card"><div class="card-title">C — Kanal</div><div class="card-body">Grayscale için 1, RGB için 3, RGBA için 4. Her kanal piksel yoğunluklarının 2B matrisidir.</div></div>
<div class="calc-card"><div class="card-title">dtype</div><div class="card-body"><code>uint8</code> 0-255 değerlerini saklar (görüntüleme için). <code>float32</code> 0.0-1.0 saklar (model girişi için).</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> PIL <span class="kw">import</span> Image

img = Image.<span class="fn">open</span>(<span class="str">'kedi.jpg'</span>)
arr = np.<span class="fn">array</span>(img)
<span class="fn">print</span>(arr.shape)   <span class="cm"># RGB için (H, W, 3)</span>
<span class="fn">print</span>(arr.dtype)   <span class="cm"># uint8</span>
<span class="fn">print</span>(arr.<span class="fn">min</span>(), arr.<span class="fn">max</span>())  <span class="cm"># 0, 255</span>
<span class="fn">print</span>(arr[<span class="num">0</span>, <span class="num">0</span>])   <span class="cm"># ilk piksel: [R, G, B]</span></code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) PIL ile JPEG dosyasını açar. 2) <code>np.array()</code> ile numpy array'ine çevirir. 3) Şekli yazdırır — RGB ise (yükseklik, genişlik, 3). 4) dtype her zaman uint8 (0-255 aralığı). 5) İlk pikselin RGB değerlerini gösterir.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Renk Uzayları — RGB, BGR, HSV, Grayscale</h2>
<p class="l-text">Aynı görüntü farklı renk uzaylarında temsil edilebilir. Her biri farklı görevler için faydalıdır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">RGB</div><div class="card-body">Kırmızı, Yeşil, Mavi. Görüntüleme standardı. PIL ve matplotlib varsayılanı.</div></div>
<div class="calc-card"><div class="card-title">BGR</div><div class="card-body">Aynı kanallar, ters sıra. <strong>OpenCV varsayılanı</strong>. Yaygın bug: cv2 BGR okur, matplotlib RGB bekler.</div></div>
<div class="calc-card"><div class="card-title">HSV</div><div class="card-body">Hue (renk), Saturation (saflık), Value (parlaklık). Renk-tabanlı segmentasyon için (örn. "tüm kırmızı nesneleri bul").</div></div>
<div class="calc-card"><div class="card-title">Grayscale</div><div class="card-body">Tek kanal, 0=siyah ile 255=beyaz arası. Renk bilgisini siler. Daha hızlı işleme.</div></div>
</div>
<div class="katex-block">$$Y = 0.299 R + 0.587 G + 0.114 B$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Y</div><div class="card-body">Grayscale parlaklık değeri (0-255).</div></div>
<div class="calc-card"><div class="card-title">R, G, B</div><div class="card-body">Kırmızı, yeşil, mavi kanal değerleri (0-255).</div></div>
<div class="calc-card"><div class="card-title">Katsayılar</div><div class="card-body">İnsan gözü hassasiyetiyle eşleşir — yeşil en çok, mavi en az katkı sağlar.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2

bgr = cv2.<span class="fn">imread</span>(<span class="str">'kedi.jpg'</span>)              <span class="cm"># BGR — dikkat!</span>
rgb = cv2.<span class="fn">cvtColor</span>(bgr, cv2.COLOR_BGR2RGB)
gray = cv2.<span class="fn">cvtColor</span>(rgb, cv2.COLOR_RGB2GRAY)
hsv = cv2.<span class="fn">cvtColor</span>(rgb, cv2.COLOR_RGB2HSV)

<span class="fn">print</span>(bgr.shape, gray.shape, hsv.shape)
<span class="cm"># (H,W,3) (H,W) (H,W,3)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı fikri sadece numpy ile preloaded \`img\` (64x64x3 uint8) üzerinde uyguluyoruz. Gri tonlama ve basit HSV-benzeri kanal hesaplıyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
print('img shape:', img.shape, 'dtype:', img.dtype)

# Manual grayscale via luminance weights
gray = np.dot(img[..., :3], [0.299, 0.587, 0.114]).astype(np.uint8)

# Simple max-min channel = saturation proxy
mx = img.max(axis=-1).astype(np.float32)
mn = img.min(axis=-1).astype(np.float32)
sat = np.where(mx &gt; 0, (mx - mn) / (mx + 1e-9), 0)

print('gray shape:', gray.shape, 'gray range:', gray.min(), gray.max())
print('saturation mean:', round(float(sat.mean()), 3))</code></pre></div></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) OpenCV ile BGR formatında okur. 2) BGR'den RGB'ye çevirir (görselleştirme için). 3) RGB'den grayscale'e çevirir (tek kanal). 4) RGB'den HSV'ye çevirir (renk analizi için). Her dönüşümde shape'in nasıl değiştiğine dikkat.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Yükleme & Kaydetme — PIL, OpenCV, matplotlib</h2>
<p class="l-text">Üç popüler kütüphane, her biri kendi güçlü yanları ve tuhaflıklarıyla.</p>
<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">PIL / Pillow</div>
<div class="compare-item">Varsayılan RGB — mantıklı.</div>
<div class="compare-item">OpenCV'den yavaş.</div>
<div class="compare-item">Pythonic API, lazy loading.</div>
<div class="compare-item">Çevrimdışı işleme için ideal.</div>
</div>
<div class="compare-col">
<div class="compare-title">OpenCV (cv2)</div>
<div class="compare-item">Varsayılan BGR — yaygın bug kaynağı.</div>
<div class="compare-item">En hızlı, altta C++.</div>
<div class="compare-item">Video ve gerçek-zamanlı için ideal.</div>
<div class="compare-item">Yerleşik birçok CV algoritması.</div>
</div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> PIL <span class="kw">import</span> Image
<span class="kw">import</span> cv2
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

<span class="cm"># Yükle</span>
img_pil = Image.<span class="fn">open</span>(<span class="str">'kedi.jpg'</span>)          <span class="cm"># RGB</span>
img_cv2 = cv2.<span class="fn">imread</span>(<span class="str">'kedi.jpg'</span>)          <span class="cm"># BGR!</span>
img_mpl = plt.<span class="fn">imread</span>(<span class="str">'kedi.jpg'</span>)          <span class="cm"># RGB</span>

<span class="cm"># Kaydet</span>
img_pil.<span class="fn">save</span>(<span class="str">'cikti.png'</span>)
cv2.<span class="fn">imwrite</span>(<span class="str">'cikti.png'</span>, img_cv2)
plt.<span class="fn">imsave</span>(<span class="str">'cikti.png'</span>, img_mpl)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Preloaded \`img\` numpy dizisi üstünde PIL: array → PIL Image → array dönüşümü ve piksel istatistikleri.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from PIL import Image
import numpy as np

pil = Image.fromarray(img)               # numpy -&gt; PIL
print('size:', pil.size, 'mode:', pil.mode)

arr = np.array(pil)                       # PIL -&gt; numpy
print('round-trip ok:', np.array_equal(arr, img))

# Per-channel mean
print('R/G/B mean:', img[...,0].mean().round(1), img[...,1].mean().round(1), img[...,2].mean().round(1))</code></pre></div></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Üç farklı kütüphane ile aynı dosyayı yükler. 2) PIL ve matplotlib RGB döner, OpenCV BGR. 3) Kayıt için her birinin kendi save metodu var. <strong>Tuzak:</strong> OpenCV ile okuyup matplotlib ile gösterirsen renkler ters görünür — önce <code>cvtColor(BGR2RGB)</code> yap.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Piksel İşlemleri — İndeksleme, Dilimleme, Aritmetik</h2>
<p class="l-text">Görüntü numpy array olduğunda, herhangi bir matris gibi indekleyebilir, dilimleyebilir ve aritmetik yapabilirsin.</p>
<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Tek piksel</div><div class="step-detail"><code>img[100, 200]</code> satır 100 sütun 200'deki [R,G,B] vektörünü döner.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Satır dilimi</div><div class="step-detail"><code>img[100:200, :]</code> satır 100-199, tüm sütunlar. Şekil: (100, W, 3).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Tek kanal</div><div class="step-detail"><code>img[..., 0]</code> sadece kırmızı kanalı alır. Şekil: (H, W).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Parlaklık +50</div><div class="step-detail"><code>np.clip(img.astype(int) + 50, 0, 255).astype(np.uint8)</code> — overflow olmaması için clip zorunlu.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Renk ters çevirme</div><div class="step-detail"><code>255 - img</code> — fotoğraf negatifi.</div></div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Parlaklık ayarı (clip ile, overflow yok)</span>
parlak = np.<span class="fn">clip</span>(img.<span class="fn">astype</span>(np.int16) + <span class="num">50</span>, <span class="num">0</span>, <span class="num">255</span>).<span class="fn">astype</span>(np.uint8)

<span class="cm"># Kontrast: 128 etrafında çarpma</span>
kontrast = np.<span class="fn">clip</span>((img.<span class="fn">astype</span>(np.float32) - <span class="num">128</span>) * <span class="num">1.5</span> + <span class="num">128</span>, <span class="num">0</span>, <span class="num">255</span>).<span class="fn">astype</span>(np.uint8)

<span class="cm"># Negatif</span>
negatif = <span class="num">255</span> - img

<span class="cm"># Kanal maskeleme: sadece kırmızı kalsın</span>
sadece_k = img.<span class="fn">copy</span>()
sadece_k[..., <span class="num">1</span>] = <span class="num">0</span>  <span class="cm"># yeşil = 0</span>
sadece_k[..., <span class="num">2</span>] = <span class="num">0</span>  <span class="cm"># mavi = 0</span></code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>uint8</code>'ten <code>int16</code>'ya cast — toplama overflow olmasın. 2) Sabit değer ekleyip <code>np.clip(0, 255)</code> ile sınır. 3) Geri <code>uint8</code>'e dön. 4) Kontrast için 128'e göre çarpma. 5) Kanal maskeleme: sadece kırmızı kalır, yeşil/mavi sıfırlanır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Histogramlar & Piksel İstatistikleri</h2>
<p class="l-text">Histogram, kaç pikselin her yoğunluk binine düştüğünü sayar. Pozlamayı, kontrastı ve renk yanlılığını bir bakışta gösterir.</p>
<div class="plotly-graph" id="plot-cv-l1-hist-tr"></div>
<div class="graph-caption"><strong>Grafiğin özü:</strong> Bir görüntünün kırmızı kanal histogramı. X ekseni 0-255 piksel değerleri, Y ekseni o değerin kaç piksel olduğu. Karanlık görüntülerde sol tarafa, parlak görüntülerde sağa kayar. Bimodal (iki tepeli) histogramlar genelde foreground+background ayrımı işaretidir — segmentation için ipucu.</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

kirmizi = img[..., <span class="num">0</span>]
hist, bins = np.<span class="fn">histogram</span>(kirmizi, bins=<span class="num">256</span>, <span class="ty">range</span>=(<span class="num">0</span>, <span class="num">256</span>))

plt.<span class="fn">bar</span>(bins[:-<span class="num">1</span>], hist, width=<span class="num">1</span>, color=<span class="str">'red'</span>, alpha=<span class="num">0.7</span>)
plt.<span class="fn">xlabel</span>(<span class="str">'Piksel değeri'</span>); plt.<span class="fn">ylabel</span>(<span class="str">'Sayı'</span>)
plt.<span class="fn">title</span>(<span class="str">'Kırmızı kanal histogramı'</span>)
plt.<span class="fn">show</span>()

<span class="cm"># Kanal başına istatistikler</span>
<span class="kw">for</span> i, isim <span class="kw">in</span> <span class="fn">enumerate</span>([<span class="str">'R'</span>, <span class="str">'G'</span>, <span class="str">'B'</span>]):
    <span class="fn">print</span>(f<span class="str">"{isim}: mean={img[...,i].mean():.1f}, std={img[...,i].std():.1f}"</span>)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Sadece kırmızı kanalı alır. 2) <code>np.histogram</code> ile 256 binlik dağılım hesaplar. 3) Bar chart olarak çizer. 4) Her kanal için mean ve std yazdırır — kanallar arasında dramatik fark varsa renk yanlılığı var demektir.</p>
<div class="think-box"><div class="think-label">🧠 NEDEN ÖNEMLİ</div><div class="think-body">Histogram <strong>histogram equalization</strong>'ın temelidir — düşük kontrastlı görüntüleri otomatik olarak parlatır. Ayrıca <strong>otomatik exposure detection</strong>'da kullanılır: histogram solda sıkışmışsa görüntü karanlık, sağda ise parlak.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Uçtan Uca Pipeline</h2>
<p class="l-text">Hepsini birleştir — ilk tam CV mini-pipeline'ın.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> PIL <span class="kw">import</span> Image

<span class="cm"># 1. Yükle</span>
img = Image.<span class="fn">open</span>(<span class="str">'giris.jpg'</span>)
arr = np.<span class="fn">array</span>(img)
<span class="fn">print</span>(f<span class="str">"Yüklendi: {arr.shape}, dtype={arr.dtype}"</span>)

<span class="cm"># 2. İncele</span>
<span class="fn">print</span>(f<span class="str">"Ortalama RGB: {arr.mean(axis=(0,1)).round(1)}"</span>)

<span class="cm"># 3. Değiştir — parlaklık +30</span>
parlak = np.<span class="fn">clip</span>(arr.<span class="fn">astype</span>(np.int16) + <span class="num">30</span>, <span class="num">0</span>, <span class="num">255</span>).<span class="fn">astype</span>(np.uint8)

<span class="cm"># 4. Kaydet</span>
Image.<span class="fn">fromarray</span>(parlak).<span class="fn">save</span>(<span class="str">'cikti.jpg'</span>)
<span class="fn">print</span>(<span class="str">"cikti.jpg kaydedildi"</span>)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) PIL ile JPEG yükler. 2) numpy array'ine çevirir, shape ve dtype yazdırır. 3) Her kanalın ortalama RGB değerini hesaplar. 4) Brightness +30 — overflow için clip. 5) Geri PIL'e çevirip JPEG olarak kaydeder. Bu yapı — load → inspect → modify → save — her CV pipeline'ının iskeletidir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖZET</div><div class="think-body"><strong>1.</strong> Görüntü = (H, W, C) şeklinde numpy array. dtype uint8 (0-255).<br><strong>2.</strong> RGB ve BGR AYNI veridir, sadece sıra farklı. OpenCV BGR kullanır — yaygın bug.<br><strong>3.</strong> Grayscale: <code>Y = 0.299R + 0.587G + 0.114B</code>. Tek kanal.<br><strong>4.</strong> PIL = pythonic, OpenCV = hızlı, matplotlib = görselleştirme.<br><strong>5.</strong> Piksel aritmetiği: int16'ya cast, [0,255]'e clip, uint8'e geri dön.<br><strong>6.</strong> Histogram pozlama, kontrast, renk yanlılığını gösterir.<br><strong>7.</strong> Sonraki ders: resize, crop, normalize, augmentation — görüntüleri ML modellerine hazırlamak.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  const T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff6b9d',
    grid: 'rgba(255,255,255,0.06)'
  };
  function makeHist(id, label){
    const el = document.getElementById(id);
    if (!el) return;
    const x = [], y = [];
    for (let i=0; i<256; i++) {
      x.push(i);
      const g = Math.exp(-Math.pow((i-130)/45, 2)) * 12000;
      y.push(g + Math.random()*800);
    }
    Plotly.newPlot(id, [{x, y, type:'bar', marker:{color: T.accent, line:{width:0}}}], {
      paper_bgcolor: T.bg, plot_bgcolor: T.bg,
      font: {color: T.text}, margin: {t:40, r:20, b:50, l:60},
      xaxis: {title: label.x, gridcolor: T.grid},
      yaxis: {title: label.y, gridcolor: T.grid},
      title: {text: label.title, font: {color: T.text, size: 14}},
      showlegend: false
    }, {responsive: true, displayModeBar: false});
  }
  makeHist('plot-cv-l1-hist-tr', {x: 'Piksel değeri', y: 'Sayı', title: 'Kırmızı kanal histogramı'});
}, 250);</script>`
};
