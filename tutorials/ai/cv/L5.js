window.CV_L5 = {

en: `<p class="l-text"><strong>In 2012, AlexNet beat all hand-engineered features on ImageNet by a huge margin — and classical CV never recovered.</strong> Convolutional neural networks learn the filters automatically from data, scaling effortlessly to millions of images and thousands of classes.</p>

<p class="l-text">In this lesson you will see why convolution is a great inductive bias for vision, walk through the canonical CNN architecture, calculate output sizes, tour the LeNet→ResNet timeline, and train a small CNN on CIFAR-10.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain why weight sharing and locality make CNNs the right inductive bias</li>
<li>Compute output spatial size from kernel, stride, and padding parameters</li>
<li>Stack Conv-BN-ReLU-Pool blocks into the canonical LeNet-style architecture</li>
<li>Trace the LeNet → AlexNet → VGG → ResNet evolution and skip-connection idea</li>
<li>Train a small CNN on CIFAR-10 in PyTorch and read the loss/accuracy curves</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. From Hand-Crafted to Learned Features</h2>
<p class="l-text">Classical pipelines: SIFT/HOG features → SVM. Each step is a human design choice. CNNs replace this with a stack of learned convolutions plus a classifier head — and the training signal flows all the way down.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Translation invariance</div><div class="card-body">A cat is a cat anywhere in the frame; the same kernel responds anywhere.</div></div>
<div class="calc-card"><div class="card-title">Parameter sharing</div><div class="card-body">A 3x3 kernel has 9 weights — used at every spatial location. Massively efficient.</div></div>
<div class="calc-card"><div class="card-title">Hierarchy</div><div class="card-body">Early layers learn edges; mid layers textures; deep layers parts and objects.</div></div>
<div class="calc-card"><div class="card-title">End-to-end</div><div class="card-body">No hand-engineered descriptors. Loss → features → optimizer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Canonical CNN Block</h2>
<div class="calc-highlight">📘 <strong>Math foundation:</strong> see <a href="/tutorials/ai/dl/cnn-computer-vision">Deep Learning Lesson 6 — CNN Fundamentals</a> for the full convolution mechanics (filter sliding, stride/padding derivations, channel arithmetic). Here we focus on how the canonical block applies to vision tasks.</div>
<p class="l-text">Most CNNs alternate two operations: convolution (extract local patterns) and pooling (downsample, build invariance). After several blocks, fully connected layers map to class logits.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Conv + ReLU</div><div class="card-body">Apply C_out kernels of size K x K x C_in, then a non-linearity.</div></div>
<div class="calc-card"><div class="card-title">Pool</div><div class="card-body">Max or average over 2x2 windows; halves spatial dimensions.</div></div>
<div class="calc-card"><div class="card-title">Flatten + FC</div><div class="card-body">Reshape feature map to vector and project to num_classes.</div></div>
<div class="calc-card"><div class="card-title">Softmax</div><div class="card-body">Turn logits into class probabilities.</div></div>
</div>
<div class="katex-block">$$H_{out} = \\left\\lfloor \\frac{H_{in} + 2P - K}{S} \\right\\rfloor + 1$$</div>
<p class="l-text">Use this formula every time you design a CNN — it tells you how spatial size shrinks layer by layer. P is padding, K is kernel size, S is stride.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Receptive Field Intuition</h2>
<div class="calc-highlight">📘 <strong>Deeper coverage:</strong> <a href="/tutorials/ai/dl/cnn-computer-vision">Deep Learning Lesson 6, section 10</a> derives receptive field math for general architectures. Here we focus on what it means for vision: object scale must fit inside the receptive field for the network to recognize it.</div>
<p class="l-text">A pixel deep in the network "sees" a much larger region of the input than a single 3x3 patch — its receptive field grows with depth. Stacking three 3x3 conv layers gives an effective 7x7 receptive field with fewer parameters than one 7x7 conv.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Layer 1</div><div class="card-body">3x3 receptive field — sees a tiny patch.</div></div>
<div class="calc-card"><div class="card-title">Layer 3</div><div class="card-body">~7x7 effective field after stacked 3x3 convs.</div></div>
<div class="calc-card"><div class="card-title">Pool / stride 2</div><div class="card-body">Doubles the receptive field per layer afterwards.</div></div>
<div class="calc-card"><div class="card-title">Why it matters</div><div class="card-body">Object scale must fit inside the receptive field for the network to recognize it.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Architecture Timeline: LeNet to ResNet</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">LeNet-5 (1998)</div><div class="card-body">2 conv + 2 pool + 2 FC. Hand-written digits, ~60K parameters.</div></div>
<div class="calc-card"><div class="card-title">AlexNet (2012)</div><div class="card-body">5 conv + 3 FC, ReLU, dropout, GPU training. Won ImageNet.</div></div>
<div class="calc-card"><div class="card-title">VGG (2014)</div><div class="card-body">All 3x3 convs, 16/19 layers. Simple, deep, parameter-heavy.</div></div>
<div class="calc-card"><div class="card-title">ResNet (2015)</div><div class="card-body">Residual connections allow 50–152 layers without vanishing gradients.</div></div>
</div>
<p class="l-text">The big idea of ResNet: instead of learning H(x), learn the residual F(x) = H(x) - x and add x back via a skip connection. This makes very deep networks trainable.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. PyTorch CNN for CIFAR-10</h2>
<p class="l-text">CIFAR-10: 60,000 32x32 color images across 10 classes. A great first dataset to verify your training loop.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

<span class="kw">class</span> <span class="fn">SmallCNN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, num_classes=<span class="num">10</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.c1 = nn.<span class="fn">Conv2d</span>(<span class="num">3</span>, <span class="num">32</span>, <span class="num">3</span>, padding=<span class="num">1</span>)
        self.c2 = nn.<span class="fn">Conv2d</span>(<span class="num">32</span>, <span class="num">64</span>, <span class="num">3</span>, padding=<span class="num">1</span>)
        self.c3 = nn.<span class="fn">Conv2d</span>(<span class="num">64</span>, <span class="num">128</span>, <span class="num">3</span>, padding=<span class="num">1</span>)
        self.fc1 = nn.<span class="fn">Linear</span>(<span class="num">128</span> * <span class="num">4</span> * <span class="num">4</span>, <span class="num">256</span>)
        self.fc2 = nn.<span class="fn">Linear</span>(<span class="num">256</span>, num_classes)
        self.drop = nn.<span class="fn">Dropout</span>(<span class="num">0.3</span>)

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        x = F.<span class="fn">max_pool2d</span>(F.<span class="fn">relu</span>(self.<span class="fn">c1</span>(x)), <span class="num">2</span>)   <span class="cm"># 32 -&gt; 16</span>
        x = F.<span class="fn">max_pool2d</span>(F.<span class="fn">relu</span>(self.<span class="fn">c2</span>(x)), <span class="num">2</span>)   <span class="cm"># 16 -&gt;  8</span>
        x = F.<span class="fn">max_pool2d</span>(F.<span class="fn">relu</span>(self.<span class="fn">c3</span>(x)), <span class="num">2</span>)   <span class="cm">#  8 -&gt;  4</span>
        x = x.<span class="fn">flatten</span>(<span class="num">1</span>)
        x = self.<span class="fn">drop</span>(F.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x)))
        <span class="kw">return</span> self.<span class="fn">fc2</span>(x)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Replace the conv-net with a plain \`LogisticRegression\` over flattened image patches — same interface (fit, predict, score) on the iris dataset as a runnable stand-in.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import numpy as np

X = df_iris[['sepal_length','sepal_width','petal_length','petal_width']].values
y = df_iris['species'].values

Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
sc = StandardScaler().fit(Xtr)

clf = LogisticRegression(max_iter=400)
clf.fit(sc.transform(Xtr), ytr)
print('train acc:', round(clf.score(sc.transform(Xtr), ytr), 3))
print('test  acc:', round(clf.score(sc.transform(Xte), yte), 3))</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Three conv layers with channels 32→64→128, all with padding=1 to preserve spatial size. 2) After each conv we ReLU and pool by 2, so 32→16→8→4. 3) Flatten the 128x4x4 feature map and project through a 256-unit dense layer with dropout, then to 10 class logits.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Training Loop</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torchvision <span class="kw">import</span> datasets, transforms
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader

tfm = transforms.<span class="fn">Compose</span>([
    transforms.<span class="fn">RandomCrop</span>(<span class="num">32</span>, padding=<span class="num">4</span>),
    transforms.<span class="fn">RandomHorizontalFlip</span>(),
    transforms.<span class="fn">ToTensor</span>(),
    transforms.<span class="fn">Normalize</span>((<span class="num">0.49</span>,<span class="num">0.48</span>,<span class="num">0.45</span>), (<span class="num">0.25</span>,<span class="num">0.24</span>,<span class="num">0.26</span>)),
])
train = datasets.<span class="fn">CIFAR10</span>(<span class="str">'./data'</span>, train=<span class="kw">True</span>, download=<span class="kw">True</span>, transform=tfm)
loader = <span class="fn">DataLoader</span>(train, batch_size=<span class="num">128</span>, shuffle=<span class="kw">True</span>, num_workers=<span class="num">2</span>)

device = <span class="str">'cuda'</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">'cpu'</span>
model = <span class="fn">SmallCNN</span>().<span class="fn">to</span>(device)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>, weight_decay=<span class="num">1e-4</span>)
crit = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
    model.<span class="fn">train</span>()
    <span class="kw">for</span> x, y <span class="kw">in</span> loader:
        x, y = x.<span class="fn">to</span>(device), y.<span class="fn">to</span>(device)
        opt.<span class="fn">zero_grad</span>()
        loss = <span class="fn">crit</span>(<span class="fn">model</span>(x), y)
        loss.<span class="fn">backward</span>()
        opt.<span class="fn">step</span>()
    <span class="fn">print</span>(f<span class="str">'epoch {epoch}: loss={loss.item():.4f}'</span>)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build mini-batches from \`df_iris\` with numpy slicing — same idea as a PyTorch DataLoader.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

X = df_iris[['sepal_length','sepal_width','petal_length','petal_width']].values
y = df_iris['species'].values

batch_size = 16
idx = np.arange(len(X))
rng.shuffle(idx)

for b, start in enumerate(range(0, len(X), batch_size)):
    sel = idx[start:start+batch_size]
    xb, yb = X[sel], y[sel]
    if b &lt; 3:
        print(f'batch {b}: x={xb.shape}, y unique={set(yb)}')
print('total batches:', (len(X) + batch_size - 1) // batch_size)</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Random crop and flip are cheap data augmentation that drastically improves generalization. 2) Normalize per channel so inputs have zero mean / unit variance. 3) AdamW + cross-entropy is a robust default. 4) 10 epochs of standard forward / backward / step — expect ~75% test accuracy after this.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Transfer Learning Preview</h2>
<p class="l-text">Training from scratch is expensive. In practice you start from a pretrained backbone (ResNet50 on ImageNet), replace the final FC layer, and fine-tune. We will revisit this in deeper lessons.</p>
<div id="cv-l5-plot-en" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> CNNs win because of translation invariance + parameter sharing.<br><strong>2.</strong> Conv → ReLU → Pool repeats; FC + softmax classifies.<br><strong>3.</strong> Output size: ⌊(H + 2P - K)/S⌋ + 1. Memorize this.<br><strong>4.</strong> Stack 3x3 convs to grow receptive field cheaply.<br><strong>5.</strong> ResNet's skip connections enable very deep training.<br><strong>6.</strong> Augmentation (crop, flip) and weight decay add a few accuracy points for free.<br><strong>7.</strong> Next lesson: object detection — going beyond a single label per image.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var ep = [1,2,3,4,5,6,7,8,9,10];
  var acc = [0.42,0.55,0.62,0.66,0.70,0.72,0.74,0.75,0.76,0.77];
  var trace = { x: ep, y: acc, mode:'lines+markers', line:{color:'#c8a96e'}, marker:{color:'#c8a96e'} };
  var layout = { margin:{t:20,r:20,b:50,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, xaxis:{title:'Epoch'}, yaxis:{title:'Test accuracy', range:[0.3,0.85]} };
  var en = document.getElementById('cv-l5-plot-en'); if (en) Plotly.newPlot(en, [trace], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l5-plot-tr'); if (tr) Plotly.newPlot(tr, [trace], Object.assign({}, layout, {xaxis:{title:'Epok'}, yaxis:{title:'Test doğruluğu', range:[0.3,0.85]}}), {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>2012'de AlexNet, ImageNet'te elle tasarlanmış tüm özellikleri büyük farkla geçti — ve klasik bilgisayarla görme bir daha toparlanamadı.</strong> Konvolüsyonel sinir ağları filtreleri verilerden otomatik öğrenir; milyonlarca görüntü ve binlerce sınıfa zahmetsizce ölçeklenir.</p>

<p class="l-text">Bu derste konvolüsyonun görme için neden iyi bir tümevarım yanlılığı olduğunu, kanonik CNN mimarisini, çıkış boyutu hesaplamasını, LeNet→ResNet zaman çizelgesini göreceğiz; ardından CIFAR-10 üzerinde küçük bir CNN eğiteceğiz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Ağırlık paylaşımı ve lokallik sayesinde CNN'in neden doğru tümevarım yanlılığı olduğunu</li>
<li>Kernel, stride ve padding parametrelerinden çıkış uzamsal boyutunu hesaplamayı</li>
<li>Conv-BN-ReLU-Pool bloklarını kanonik LeNet tarzı mimaride üst üste yığmayı</li>
<li>LeNet → AlexNet → VGG → ResNet evrimini ve skip-connection fikrini izlemeyi</li>
<li>PyTorch ile CIFAR-10 üzerinde küçük bir CNN eğitmeyi ve loss/accuracy eğrilerini okumayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Elle Yapılandan Öğrenilene</h2>
<p class="l-text">Klasik boru hattı: SIFT/HOG özellikleri → SVM. Her adım insan tasarımıdır. CNN'ler bunu öğrenilmiş konvolüsyonlardan oluşan bir yığın ve sınıflandırıcı başlık ile değiştirir — ve eğitim sinyali ta dibe iner.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Öteleme değişmezliği</div><div class="card-body">Kedi karenin neresinde olursa olsun kedidir; aynı çekirdek her yerde tepki verir.</div></div>
<div class="calc-card"><div class="card-title">Parametre paylaşımı</div><div class="card-body">3x3 çekirdek 9 ağırlığa sahip — her uzamsal konumda kullanılır. Çok verimli.</div></div>
<div class="calc-card"><div class="card-title">Hiyerarşi</div><div class="card-body">Erken katmanlar kenarları, orta katmanlar dokuları, derin katmanlar parça ve nesneleri öğrenir.</div></div>
<div class="calc-card"><div class="card-title">Uçtan uca</div><div class="card-body">Elle tasarım yok. Kayıp → özellik → optimizer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Kanonik CNN Bloğu</h2>
<div class="calc-highlight">📘 <strong>Matematiksel temel:</strong> Konvolüsyonun tüm mekaniği (filtre kayması, stride/padding türetimi, kanal aritmetiği) için <a href="/tutorials/ai/dl/cnn-computer-vision">Derin Öğrenme Dersi 6 — CNN Temelleri</a>'ne bakın. Burada bu temelin görüntü görevlerine nasıl uygulandığına odaklanıyoruz.</div>
<p class="l-text">Çoğu CNN iki işlemi sırayla uygular: konvolüsyon (yerel desenleri çıkar) ve havuzlama (boyut indir, değişmezlik kazandır). Birkaç bloktan sonra tam bağlı katmanlar sınıf logit'lerine eşler.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Conv + ReLU</div><div class="card-body">C_out tane K x K x C_in çekirdek, ardından doğrusal olmayanlık.</div></div>
<div class="calc-card"><div class="card-title">Pool</div><div class="card-body">2x2 pencerede maksimum ya da ortalama; uzamsal boyutu yarıya indirir.</div></div>
<div class="calc-card"><div class="card-title">Flatten + FC</div><div class="card-body">Özellik haritasını vektöre çevir, num_classes'a yansıt.</div></div>
<div class="calc-card"><div class="card-title">Softmax</div><div class="card-body">Logit'leri sınıf olasılıklarına dönüştür.</div></div>
</div>
<div class="katex-block">$$H_{out} = \\left\\lfloor \\frac{H_{in} + 2P - K}{S} \\right\\rfloor + 1$$</div>
<p class="l-text">Bir CNN tasarlarken bu formülü her zaman kullanın — uzamsal boyutun katmanlar boyunca nasıl daraldığını söyler. P padding, K çekirdek, S stride.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Alıcı Alan Sezgisi</h2>
<div class="calc-highlight">📘 <strong>Daha derin kapsam:</strong> <a href="/tutorials/ai/dl/cnn-computer-vision">Derin Öğrenme Dersi 6, bölüm 10</a> alıcı alan matematiğini genel mimariler için türetir. Burada görüntü için ne anlama geldiğine odaklanıyoruz: nesne ölçeği ağın tanıyabilmesi için alıcı alan içine sığmalı.</div>
<p class="l-text">Ağda derinde bir piksel girişin tek bir 3x3 yamasından çok daha büyük bir bölgesini "görür" — alıcı alanı derinlikle büyür. Üç adet 3x3 konv katmanını üst üste koymak, tek bir 7x7 konv'tan daha az parametreyle 7x7 etkili alıcı alan sağlar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Katman 1</div><div class="card-body">3x3 alıcı alan — küçük bir yama.</div></div>
<div class="calc-card"><div class="card-title">Katman 3</div><div class="card-body">Üç adet 3x3 konv sonrası ~7x7 etkili alan.</div></div>
<div class="calc-card"><div class="card-title">Pool / stride 2</div><div class="card-body">Sonraki her katmanda alıcı alanı iki katına çıkarır.</div></div>
<div class="calc-card"><div class="card-title">Neden önemli</div><div class="card-body">Nesne ölçeği alıcı alana sığmazsa ağ tanıyamaz.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Mimari Zaman Çizelgesi: LeNet'ten ResNet'e</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">LeNet-5 (1998)</div><div class="card-body">2 konv + 2 havuz + 2 FC. Elle yazılmış rakamlar, ~60 bin parametre.</div></div>
<div class="calc-card"><div class="card-title">AlexNet (2012)</div><div class="card-body">5 konv + 3 FC, ReLU, dropout, GPU eğitimi. ImageNet'i kazandı.</div></div>
<div class="calc-card"><div class="card-title">VGG (2014)</div><div class="card-body">Hepsi 3x3 konv, 16/19 katman. Sade, derin, parametre yoğun.</div></div>
<div class="calc-card"><div class="card-title">ResNet (2015)</div><div class="card-body">Artık bağlantılar kaybolan gradyan olmadan 50–152 katman eğitime izin verir.</div></div>
</div>
<p class="l-text">ResNet'in büyük fikri: H(x) öğrenmek yerine F(x) = H(x) - x artığını öğren ve x'i atlama bağlantısıyla geri ekle. Bu çok derin ağları eğitilebilir kılar.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. CIFAR-10 için PyTorch CNN</h2>
<p class="l-text">CIFAR-10: 10 sınıfta 60.000 adet 32x32 renkli görüntü. Eğitim döngünüzü doğrulamak için harika bir ilk veri kümesi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

<span class="kw">class</span> <span class="fn">KucukCNN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, num_classes=<span class="num">10</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.c1 = nn.<span class="fn">Conv2d</span>(<span class="num">3</span>, <span class="num">32</span>, <span class="num">3</span>, padding=<span class="num">1</span>)
        self.c2 = nn.<span class="fn">Conv2d</span>(<span class="num">32</span>, <span class="num">64</span>, <span class="num">3</span>, padding=<span class="num">1</span>)
        self.c3 = nn.<span class="fn">Conv2d</span>(<span class="num">64</span>, <span class="num">128</span>, <span class="num">3</span>, padding=<span class="num">1</span>)
        self.fc1 = nn.<span class="fn">Linear</span>(<span class="num">128</span> * <span class="num">4</span> * <span class="num">4</span>, <span class="num">256</span>)
        self.fc2 = nn.<span class="fn">Linear</span>(<span class="num">256</span>, num_classes)
        self.drop = nn.<span class="fn">Dropout</span>(<span class="num">0.3</span>)

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        x = F.<span class="fn">max_pool2d</span>(F.<span class="fn">relu</span>(self.<span class="fn">c1</span>(x)), <span class="num">2</span>)   <span class="cm"># 32 -&gt; 16</span>
        x = F.<span class="fn">max_pool2d</span>(F.<span class="fn">relu</span>(self.<span class="fn">c2</span>(x)), <span class="num">2</span>)   <span class="cm"># 16 -&gt;  8</span>
        x = F.<span class="fn">max_pool2d</span>(F.<span class="fn">relu</span>(self.<span class="fn">c3</span>(x)), <span class="num">2</span>)   <span class="cm">#  8 -&gt;  4</span>
        x = x.<span class="fn">flatten</span>(<span class="num">1</span>)
        x = self.<span class="fn">drop</span>(F.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x)))
        <span class="kw">return</span> self.<span class="fn">fc2</span>(x)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Konv-net yerine düzleştirilmiş görüntü yamalarına Logistic Regression: aynı arayüz (fit, predict, score) iris üzerinde çalıştırılabilir karşılık.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import numpy as np

X = df_iris[['sepal_length','sepal_width','petal_length','petal_width']].values
y = df_iris['species'].values

Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
sc = StandardScaler().fit(Xtr)

clf = LogisticRegression(max_iter=400)
clf.fit(sc.transform(Xtr), ytr)
print('train acc:', round(clf.score(sc.transform(Xtr), ytr), 3))
print('test  acc:', round(clf.score(sc.transform(Xte), yte), 3))</code></pre></div></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Üç konv katmanı, kanal 32→64→128 ve hepsi padding=1 ile uzamsal boyutu korur. 2) Her konvtan sonra ReLU ve 2 ile havuzlama → 32→16→8→4. 3) 128x4x4 özellik haritasını düzleştir, dropout'lu 256 birimlik yoğun katmandan geçir, 10 sınıf logit'ine yansıt.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Eğitim Döngüsü</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torchvision <span class="kw">import</span> datasets, transforms
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader

donusum = transforms.<span class="fn">Compose</span>([
    transforms.<span class="fn">RandomCrop</span>(<span class="num">32</span>, padding=<span class="num">4</span>),
    transforms.<span class="fn">RandomHorizontalFlip</span>(),
    transforms.<span class="fn">ToTensor</span>(),
    transforms.<span class="fn">Normalize</span>((<span class="num">0.49</span>,<span class="num">0.48</span>,<span class="num">0.45</span>), (<span class="num">0.25</span>,<span class="num">0.24</span>,<span class="num">0.26</span>)),
])
egitim = datasets.<span class="fn">CIFAR10</span>(<span class="str">'./data'</span>, train=<span class="kw">True</span>, download=<span class="kw">True</span>, transform=donusum)
yukleyici = <span class="fn">DataLoader</span>(egitim, batch_size=<span class="num">128</span>, shuffle=<span class="kw">True</span>, num_workers=<span class="num">2</span>)

cihaz = <span class="str">'cuda'</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">'cpu'</span>
model = <span class="fn">KucukCNN</span>().<span class="fn">to</span>(cihaz)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>, weight_decay=<span class="num">1e-4</span>)
crit = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="kw">for</span> epok <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
    model.<span class="fn">train</span>()
    <span class="kw">for</span> x, y <span class="kw">in</span> yukleyici:
        x, y = x.<span class="fn">to</span>(cihaz), y.<span class="fn">to</span>(cihaz)
        opt.<span class="fn">zero_grad</span>()
        kayip = <span class="fn">crit</span>(<span class="fn">model</span>(x), y)
        kayip.<span class="fn">backward</span>()
        opt.<span class="fn">step</span>()
    <span class="fn">print</span>(f<span class="str">'epok {epok}: kayip={kayip.item():.4f}'</span>)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Numpy dilimlemeyle \`df_iris\`'ten mini-batch'ler üretiyoruz — PyTorch DataLoader fikri.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

X = df_iris[['sepal_length','sepal_width','petal_length','petal_width']].values
y = df_iris['species'].values

batch_size = 16
idx = np.arange(len(X))
rng.shuffle(idx)

for b, start in enumerate(range(0, len(X), batch_size)):
    sel = idx[start:start+batch_size]
    xb, yb = X[sel], y[sel]
    if b &lt; 3:
        print(f'batch {b}: x={xb.shape}, y unique={set(yb)}')
print('total batches:', (len(X) + batch_size - 1) // batch_size)</code></pre></div></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Rastgele kırpma ve çevirme ucuz veri artırma teknikleridir; genelleme büyük ölçüde iyileşir. 2) Kanal başına normalizasyon — sıfır ortalama / birim varyans. 3) AdamW + çapraz entropi sağlam bir varsayılan. 4) Standart ileri / geri / adım ile 10 epok — sonunda ~%75 test doğruluğu beklenebilir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Transfer Öğrenme Önizleme</h2>
<p class="l-text">Sıfırdan eğitim pahalıdır. Pratikte ImageNet'te önceden eğitilmiş bir omurgadan (ResNet50) başlar, son FC katmanını değiştirir ve ince ayar yaparsınız. Bunu sonraki derslerde tekrar ele alacağız.</p>
<div id="cv-l5-plot-tr" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> CNN'ler öteleme değişmezliği + parametre paylaşımı sayesinde kazanır.<br><strong>2.</strong> Conv → ReLU → Pool tekrarlanır; FC + softmax sınıflandırır.<br><strong>3.</strong> Çıkış boyutu: ⌊(H + 2P - K)/S⌋ + 1. Ezberleyin.<br><strong>4.</strong> 3x3 konvları üst üste koyun — alıcı alanı ucuza büyütür.<br><strong>5.</strong> ResNet atlama bağlantıları çok derin eğitimi mümkün kılar.<br><strong>6.</strong> Artırma (kırpma, çevirme) ve ağırlık çürümesi bedava birkaç doğruluk puanı verir.<br><strong>7.</strong> Sonraki ders: nesne tespiti — görüntü başına tek etiketin ötesine geçiyoruz.</div></div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var ep = [1,2,3,4,5,6,7,8,9,10];
  var acc = [0.42,0.55,0.62,0.66,0.70,0.72,0.74,0.75,0.76,0.77];
  var trace = { x: ep, y: acc, mode:'lines+markers', line:{color:'#c8a96e'}, marker:{color:'#c8a96e'} };
  var layout = { margin:{t:20,r:20,b:50,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, xaxis:{title:'Epok'}, yaxis:{title:'Test doğruluğu', range:[0.3,0.85]} };
  var en = document.getElementById('cv-l5-plot-en'); if (en) Plotly.newPlot(en, [trace], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l5-plot-tr'); if (tr) Plotly.newPlot(tr, [trace], Object.assign({}, layout, {xaxis:{title:'Epok'}, yaxis:{title:'Test doğruluğu', range:[0.3,0.85]}}), {displayModeBar:false});
}, 250);</script>
`
};
