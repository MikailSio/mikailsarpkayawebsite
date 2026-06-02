window.CV_L6 = {

en: `<p class="l-text"><strong>Classification answers "what"; detection answers "what AND where".</strong> A self-driving car needs to know not just that there is a pedestrian in the frame, but exactly where their bounding box is — measured in pixels, in real time.</p>

<p class="l-text">In this lesson you will learn the IoU metric, non-max suppression, the difference between two-stage (R-CNN) and one-stage (YOLO) detectors, the mAP evaluation metric, and how to run YOLOv8 on your own image in a few lines.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compute Intersection over Union between predicted and ground-truth boxes</li>
<li>Apply non-maximum suppression to filter overlapping object detections</li>
<li>Compare two-stage (Faster R-CNN) vs one-stage (YOLO, SSD) detectors and trade-offs</li>
<li>Evaluate detectors with precision, recall, and the mAP metric per class</li>
<li>Run YOLOv8 on a custom image with Ultralytics in fewer than 10 lines</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Detection vs Classification</h2>
<p class="l-text">Classification outputs a single label. Detection outputs a list of (bounding box, class, score) triplets. The number of outputs varies per image, which makes the loss and architecture more involved.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Output</div><div class="card-body">N detections per image, each = [x, y, w, h, class, score].</div></div>
<div class="calc-card"><div class="card-title">Bounding box</div><div class="card-body">Axis-aligned rectangle. Often (cx, cy, w, h) normalized by image size.</div></div>
<div class="calc-card"><div class="card-title">Confidence</div><div class="card-body">Score in [0,1] reflecting both objectness and class probability.</div></div>
<div class="calc-card"><div class="card-title">Use cases</div><div class="card-body">Driving, retail counting, surveillance, defect inspection, AR.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Intersection over Union (IoU)</h2>
<p class="l-text">IoU is the standard way to measure how well a predicted box matches a ground truth box.</p>
<div class="katex-block">$$\\text{IoU} = \\frac{|A \\cap B|}{|A \\cup B|}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">IoU = 1</div><div class="card-body">Perfect overlap.</div></div>
<div class="calc-card"><div class="card-title">IoU &gt; 0.5</div><div class="card-body">Generally counted as a true positive in detection benchmarks.</div></div>
<div class="calc-card"><div class="card-title">IoU = 0</div><div class="card-body">No overlap — completely wrong location.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">iou</span>(a, b):
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b
    ix1, iy1 = <span class="fn">max</span>(ax1,bx1), <span class="fn">max</span>(ay1,by1)
    ix2, iy2 = <span class="fn">min</span>(ax2,bx2), <span class="fn">min</span>(ay2,by2)
    inter = <span class="fn">max</span>(<span class="num">0</span>, ix2-ix1) * <span class="fn">max</span>(<span class="num">0</span>, iy2-iy1)
    union = (ax2-ax1)*(ay2-ay1) + (bx2-bx1)*(by2-by1) - inter
    <span class="kw">return</span> inter / union <span class="kw">if</span> union &gt; <span class="num">0</span> <span class="kw">else</span> <span class="num">0</span>
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Compute the intersection rectangle's corners with max for the top-left and min for the bottom-right. 2) Intersection area is non-negative. 3) Union = sum of areas minus intersection. 4) Ratio is IoU. This 8-line function is at the core of every detection metric.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Non-Max Suppression (NMS)</h2>
<p class="l-text">A detector typically fires many overlapping boxes around a single object. NMS keeps the highest-confidence box and suppresses any others that overlap it more than a threshold.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1</div><div class="card-body">Sort all boxes by score, descending.</div></div>
<div class="calc-card"><div class="card-title">Step 2</div><div class="card-body">Pick the top box, add it to keep list.</div></div>
<div class="calc-card"><div class="card-title">Step 3</div><div class="card-body">Drop any remaining box with IoU &gt; 0.5 against the top box.</div></div>
<div class="calc-card"><div class="card-title">Step 4</div><div class="card-body">Repeat until the list is empty. Variants: soft-NMS, class-aware NMS.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Two-Stage: Faster R-CNN</h2>
<p class="l-text">R-CNN family runs in two stages: a region proposal network suggests candidate boxes, then a classifier head scores and refines each one.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Backbone</div><div class="card-body">CNN (ResNet, VGG) extracts shared feature map.</div></div>
<div class="calc-card"><div class="card-title">RPN</div><div class="card-body">Region Proposal Network outputs ~2K candidate boxes from anchors.</div></div>
<div class="calc-card"><div class="card-title">RoI head</div><div class="card-body">For each proposal: classify + regress refined box coords.</div></div>
<div class="calc-card"><div class="card-title">Tradeoff</div><div class="card-body">Higher accuracy, slower inference (~5–10 fps).</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. One-Stage: YOLO and SSD</h2>
<p class="l-text">YOLO ("You Only Look Once") treats detection as a single regression problem. The image is divided into a grid; each cell predicts boxes, classes, and confidences in one forward pass.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Grid</div><div class="card-body">e.g. 13x13 cells; each predicts B anchor boxes.</div></div>
<div class="calc-card"><div class="card-title">Anchors</div><div class="card-body">Predefined box shapes from k-means on training set; predictions are offsets.</div></div>
<div class="calc-card"><div class="card-title">Speed</div><div class="card-body">YOLOv8n hits 100+ fps on a modest GPU.</div></div>
<div class="calc-card"><div class="card-title">Modern variants</div><div class="card-body">YOLOv5, YOLOv8, YOLOv10 — anchor-free in newest versions.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. mAP: Mean Average Precision</h2>
<p class="l-text">For each class, compute precision-recall curve over confidence thresholds; average precision (AP) is the area under it. mAP averages AP across classes (sometimes also IoU thresholds, e.g. mAP@[.5:.95] in COCO).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PR curve</div><div class="card-body">Sweep score threshold; record precision and recall at each step.</div></div>
<div class="calc-card"><div class="card-title">AP</div><div class="card-body">Area under PR curve for one class.</div></div>
<div class="calc-card"><div class="card-title">mAP@0.5</div><div class="card-body">Mean AP using IoU=0.5 threshold (PASCAL VOC convention).</div></div>
<div class="calc-card"><div class="card-title">COCO mAP</div><div class="card-body">Average over IoU 0.5 to 0.95 in 0.05 steps — much stricter.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. YOLOv8 in 10 Lines</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install ultralytics</span>
<span class="kw">from</span> ultralytics <span class="kw">import</span> YOLO

model = <span class="fn">YOLO</span>(<span class="str">'yolov8n.pt'</span>)           <span class="cm"># 6 MB nano model</span>
results = <span class="fn">model</span>(<span class="str">'street.jpg'</span>, conf=<span class="num">0.25</span>)

<span class="kw">for</span> r <span class="kw">in</span> results:
    <span class="fn">print</span>(r.boxes.xyxy)              <span class="cm"># Nx4 tensor</span>
    <span class="fn">print</span>(r.boxes.cls)                <span class="cm"># class ids</span>
    <span class="fn">print</span>(r.boxes.conf)               <span class="cm"># confidence</span>
    r.<span class="fn">save</span>(<span class="str">'out.jpg'</span>)                 <span class="cm"># annotated image</span>
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Load the smallest pretrained YOLOv8 (nano, ~6 MB). 2) Run inference at confidence threshold 0.25 — it returns boxes, classes, confidences as tensors. 3) Iterate over results and save the annotated image. The same API supports webcam, video, and batched directory input.</p>
<div id="cv-l6-plot-en" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Detection = classification + bounding box regression.<br><strong>2.</strong> IoU measures box overlap; the universal currency in detection.<br><strong>3.</strong> NMS deduplicates overlapping detections.<br><strong>4.</strong> Two-stage detectors (Faster R-CNN) trade speed for accuracy.<br><strong>5.</strong> One-stage detectors (YOLO, SSD) are real-time-friendly.<br><strong>6.</strong> mAP@0.5 and COCO mAP are the benchmark metrics.<br><strong>7.</strong> Next lesson: semantic segmentation — labeling every pixel, not just boxes.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var models = ['YOLOv5n','YOLOv8n','YOLOv8m','Faster R-CNN','DETR'];
  var map50  = [45.7, 52.6, 65.2, 60.5, 62.4];
  var fps    = [165, 180, 75, 12, 28];
  var t1 = { x: models, y: map50, name:'mAP@0.5', type:'bar', marker:{color:'#c8a96e'} };
  var t2 = { x: models, y: fps,   name:'FPS',     type:'bar', marker:{color:'#4de87a'}, yaxis:'y2' };
  var layout = { margin:{t:20,r:60,b:80,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, yaxis:{title:'mAP@0.5'}, yaxis2:{title:'FPS', overlaying:'y', side:'right'}, legend:{orientation:'h', y:-0.3} };
  var en = document.getElementById('cv-l6-plot-en'); if (en) Plotly.newPlot(en, [t1,t2], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l6-plot-tr'); if (tr) Plotly.newPlot(tr, [t1,t2], layout, {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Sınıflandırma "ne" sorusunu yanıtlar; tespit "ne VE nerede" sorusunu yanıtlar.</strong> Sürücüsüz bir aracın yalnızca karede yaya olduğunu değil, sınırlayıcı kutusunun tam piksel konumunu gerçek zamanlı bilmesi gerekir.</p>

<p class="l-text">Bu derste IoU metriğini, non-max bastırmayı, iki aşamalı (R-CNN) ile tek aşamalı (YOLO) dedektörler arasındaki farkı, mAP değerlendirme metriğini ve YOLOv8'i kendi görüntünüzde birkaç satırda nasıl çalıştıracağınızı öğreneceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tahmin edilen kutu ile gerçek kutu arasında IoU (Intersection over Union) hesaplamayı</li>
<li>Üst üste binen tespitleri filtrelemek için non-maximum suppression uygulamayı</li>
<li>İki aşamalı (Faster R-CNN) ile tek aşamalı (YOLO, SSD) dedektörlerin ödünleşimlerini karşılaştırmayı</li>
<li>Sınıf başına precision, recall ve mAP metriği ile dedektör değerlendirmeyi</li>
<li>Ultralytics ile özel bir görüntüde YOLOv8'i 10 satırdan az kodla çalıştırmayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Tespit ve Sınıflandırma</h2>
<p class="l-text">Sınıflandırma tek etiket çıkarır. Tespit, (sınırlayıcı kutu, sınıf, skor) üçlülerinden bir liste verir. Çıkış sayısı görüntüden görüntüye değişir; bu da kayıp ve mimariyi karmaşıklaştırır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çıkış</div><div class="card-body">Görüntü başına N tespit, her biri = [x, y, w, h, sınıf, skor].</div></div>
<div class="calc-card"><div class="card-title">Sınırlayıcı kutu</div><div class="card-body">Eksene hizalı dikdörtgen. Genelde (cx, cy, w, h) görüntü boyutuna göre normalize.</div></div>
<div class="calc-card"><div class="card-title">Güven</div><div class="card-body">[0,1] arası skor; nesnesellik ve sınıf olasılığını birlikte yansıtır.</div></div>
<div class="calc-card"><div class="card-title">Kullanım</div><div class="card-body">Sürüş, perakende sayım, gözetim, kusur denetimi, AR.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Kesişim/Birleşim Oranı (IoU)</h2>
<p class="l-text">IoU, tahmin edilen kutunun gerçek kutuya ne kadar uyduğunu ölçen standart yöntemdir.</p>
<div class="katex-block">$$\\text{IoU} = \\frac{|A \\cap B|}{|A \\cup B|}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">IoU = 1</div><div class="card-body">Mükemmel örtüşme.</div></div>
<div class="calc-card"><div class="card-title">IoU &gt; 0.5</div><div class="card-body">Çoğu tespit kıyaslamasında doğru pozitif sayılır.</div></div>
<div class="calc-card"><div class="card-title">IoU = 0</div><div class="card-body">Hiç örtüşme yok — tamamen yanlış konum.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">iou</span>(a, b):
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b
    ix1, iy1 = <span class="fn">max</span>(ax1,bx1), <span class="fn">max</span>(ay1,by1)
    ix2, iy2 = <span class="fn">min</span>(ax2,bx2), <span class="fn">min</span>(ay2,by2)
    kesisim = <span class="fn">max</span>(<span class="num">0</span>, ix2-ix1) * <span class="fn">max</span>(<span class="num">0</span>, iy2-iy1)
    birlesim = (ax2-ax1)*(ay2-ay1) + (bx2-bx1)*(by2-by1) - kesisim
    <span class="kw">return</span> kesisim / birlesim <span class="kw">if</span> birlesim &gt; <span class="num">0</span> <span class="kw">else</span> <span class="num">0</span>
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Sol üst için max, sağ alt için min ile kesişim dikdörtgeninin köşelerini hesaplar. 2) Kesişim alanı negatif olamaz. 3) Birleşim = alanlar toplamı eksi kesişim. 4) Oran IoU'dur. Bu 8 satırlık fonksiyon her tespit metriğinin kalbidir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Non-Max Bastırma (NMS)</h2>
<p class="l-text">Bir dedektör genellikle aynı nesne etrafında birçok örtüşen kutu üretir. NMS en yüksek skorlu kutuyu tutar; eşikten fazla örtüşen diğerlerini bastırır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1</div><div class="card-body">Tüm kutuları skora göre azalan sırala.</div></div>
<div class="calc-card"><div class="card-title">Adım 2</div><div class="card-body">En yüksek skorlu kutuyu seç ve tutulanlar listesine ekle.</div></div>
<div class="calc-card"><div class="card-title">Adım 3</div><div class="card-body">Üst kutu ile IoU &gt; 0.5 olan diğer kutuları at.</div></div>
<div class="calc-card"><div class="card-title">Adım 4</div><div class="card-body">Liste boşalana kadar tekrarla. Varyantlar: soft-NMS, sınıfa duyarlı NMS.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. İki Aşamalı: Faster R-CNN</h2>
<p class="l-text">R-CNN ailesi iki aşamada çalışır: bölge öneri ağı aday kutular önerir, ardından sınıflandırıcı başlık her birini puanlar ve düzeltir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Omurga</div><div class="card-body">CNN (ResNet, VGG) ortak özellik haritası çıkarır.</div></div>
<div class="calc-card"><div class="card-title">RPN</div><div class="card-body">Bölge Öneri Ağı, ankordan ~2 bin aday kutu üretir.</div></div>
<div class="calc-card"><div class="card-title">RoI başlık</div><div class="card-body">Her öneri için: sınıflandır + kutu koordinatlarını düzelt.</div></div>
<div class="calc-card"><div class="card-title">Bedel</div><div class="card-body">Daha yüksek doğruluk, daha yavaş çıkarım (~5–10 fps).</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tek Aşamalı: YOLO ve SSD</h2>
<p class="l-text">YOLO ("You Only Look Once") tespiti tek bir regresyon problemi olarak ele alır. Görüntü ızgaraya bölünür; her hücre tek ileri geçişte kutuları, sınıfları ve güvenleri tahmin eder.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Izgara</div><div class="card-body">Örn. 13x13 hücre; her biri B ankor kutu öngörür.</div></div>
<div class="calc-card"><div class="card-title">Ankorlar</div><div class="card-body">Eğitim setinde k-means ile bulunan önceden tanımlı kutu şekilleri; tahminler offset olarak yapılır.</div></div>
<div class="calc-card"><div class="card-title">Hız</div><div class="card-body">YOLOv8n orta seviye GPU'da 100+ fps yapar.</div></div>
<div class="calc-card"><div class="card-title">Yeni varyantlar</div><div class="card-body">YOLOv5, YOLOv8, YOLOv10 — en yeniler ankor-bağımsız.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. mAP: Ortalama Hassasiyet Ortalaması</h2>
<p class="l-text">Her sınıf için güven eşiği üzerinden hassasiyet-anma eğrisi hesaplanır; eğri altındaki alan AP'dir. mAP, AP'leri sınıflar üzerinde (bazen IoU eşikleri üzerinde de, örn. COCO mAP@[.5:.95]) ortalar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PR eğrisi</div><div class="card-body">Skor eşiğini tara; her adımda hassasiyet ve anma kaydet.</div></div>
<div class="calc-card"><div class="card-title">AP</div><div class="card-body">Tek sınıf için PR eğrisi altındaki alan.</div></div>
<div class="calc-card"><div class="card-title">mAP@0.5</div><div class="card-body">IoU=0.5 eşiği ile ortalama AP (PASCAL VOC geleneği).</div></div>
<div class="calc-card"><div class="card-title">COCO mAP</div><div class="card-body">IoU 0.5–0.95 arası 0.05 adımla ortalama — çok daha sıkı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. 10 Satırda YOLOv8</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install ultralytics</span>
<span class="kw">from</span> ultralytics <span class="kw">import</span> YOLO

model = <span class="fn">YOLO</span>(<span class="str">'yolov8n.pt'</span>)           <span class="cm"># 6 MB nano model</span>
sonuc = <span class="fn">model</span>(<span class="str">'cadde.jpg'</span>, conf=<span class="num">0.25</span>)

<span class="kw">for</span> r <span class="kw">in</span> sonuc:
    <span class="fn">print</span>(r.boxes.xyxy)              <span class="cm"># Nx4 tensör</span>
    <span class="fn">print</span>(r.boxes.cls)                <span class="cm"># sınıf id'leri</span>
    <span class="fn">print</span>(r.boxes.conf)               <span class="cm"># güven</span>
    r.<span class="fn">save</span>(<span class="str">'cikis.jpg'</span>)               <span class="cm"># işaretlenmiş görüntü</span>
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) En küçük önceden eğitilmiş YOLOv8'i (nano, ~6 MB) yükler. 2) 0.25 güven eşiğinde çıkarım yapar — kutular, sınıflar ve güvenleri tensör olarak döner. 3) Sonuçlar üzerinde dolaşıp işaretli görüntüyü kaydeder. Aynı API webcam, video ve dizin girişlerini de destekler.</p>
<div id="cv-l6-plot-tr" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Tespit = sınıflandırma + sınırlayıcı kutu regresyonu.<br><strong>2.</strong> IoU kutu örtüşmesini ölçer; tespit dünyasının ortak para birimi.<br><strong>3.</strong> NMS örtüşen tespitleri tekilleştirir.<br><strong>4.</strong> İki aşamalı (Faster R-CNN) hızı doğruluğa feda eder.<br><strong>5.</strong> Tek aşamalı (YOLO, SSD) gerçek zaman dostudur.<br><strong>6.</strong> mAP@0.5 ve COCO mAP standart kıyas metrikleridir.<br><strong>7.</strong> Sonraki ders: semantik bölütleme — kutu yerine her pikseli etiketlemek.</div></div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var models = ['YOLOv5n','YOLOv8n','YOLOv8m','Faster R-CNN','DETR'];
  var map50  = [45.7, 52.6, 65.2, 60.5, 62.4];
  var fps    = [165, 180, 75, 12, 28];
  var t1 = { x: models, y: map50, name:'mAP@0.5', type:'bar', marker:{color:'#c8a96e'} };
  var t2 = { x: models, y: fps,   name:'FPS',     type:'bar', marker:{color:'#4de87a'}, yaxis:'y2' };
  var layout = { margin:{t:20,r:60,b:80,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, yaxis:{title:'mAP@0.5'}, yaxis2:{title:'FPS', overlaying:'y', side:'right'}, legend:{orientation:'h', y:-0.3} };
  var en = document.getElementById('cv-l6-plot-en'); if (en) Plotly.newPlot(en, [t1,t2], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l6-plot-tr'); if (tr) Plotly.newPlot(tr, [t1,t2], layout, {displayModeBar:false});
}, 250);</script>
`
};
