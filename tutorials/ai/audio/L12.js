window.AUDIO_L12 = {

en: `<p class="l-text"><strong>Glass breaking. A baby crying. A car horn. A dog barking — at 12.4 seconds.</strong> Sound Event Detection (SED) tells you what is happening and when, frame by frame.</p>
<p class="l-text">In this lesson you'll learn SED with AudioSet/ESC-50, the PANNs and AST architectures, multi-label BCE training, audio captioning, and real-world deployments — surveillance, accessibility, content moderation.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish clip-level tagging from frame-level Sound Event Detection</li>
<li>Compare AudioSet, ESC-50, and DCASE benchmarks by labels and length</li>
<li>Train a multi-label SED head with binary cross-entropy and per-class sigmoid</li>
<li>Apply PANNs and Audio Spectrogram Transformer (AST) on a sample clip</li>
<li>Generate natural-language audio captions and rank top-K detected events</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Sound Event Detection vs Classification</h2>
<p class="l-text">Audio classification: one label for the whole clip ("dog bark"). SED: time-localized labels — "dog bark from 1.2s to 3.5s, glass break from 4.0s to 4.3s". Multi-label and overlapping events allowed.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tagging</div><div class="card-body">Clip-level: which classes are present anywhere?</div></div>
<div class="calc-card"><div class="card-title">SED</div><div class="card-body">Frame-level: which classes are present each frame?</div></div>
<div class="calc-card"><div class="card-title">Captioning</div><div class="card-body">Free-text description: "A dog barks while a car drives by."</div></div>
<div class="calc-card"><div class="card-title">Localization</div><div class="card-body">Direction of arrival (DOA) — where in space?</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Datasets</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">AudioSet</div><div class="card-body">Google. 2M YouTube clips, 527 classes, weakly labelled.</div></div>
<div class="calc-card"><div class="card-title">ESC-50</div><div class="card-body">2000 clips, 50 classes, 5-fold split. Standard small benchmark.</div></div>
<div class="calc-card"><div class="card-title">UrbanSound8K</div><div class="card-body">8732 urban clips (sirens, jackhammers, dogs).</div></div>
<div class="calc-card"><div class="card-title">DCASE</div><div class="card-body">Annual challenge — SED, scene classification, anomaly detection.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Multi-Label BCE Loss</h2>
<p class="l-text">Multiple events can occur simultaneously, so we use independent sigmoids per class with binary cross-entropy:</p>
<div class="katex-block">$$L = -\\sum_{c=1}^{C}\\bigl[\\,y_c \\log p_c + (1-y_c)\\log(1-p_c)\\,\\bigr]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">\\(C\\)</div><div class="card-body">Number of classes (e.g. 527 for AudioSet).</div></div>
<div class="calc-card"><div class="card-title">\\(y_c \\in \\{0,1\\}\\)</div><div class="card-body">Ground-truth: 1 if class c is present, else 0.</div></div>
<div class="calc-card"><div class="card-title">\\(p_c \\in (0,1)\\)</div><div class="card-body">Sigmoid output for class c — independent probability.</div></div>
<div class="calc-card"><div class="card-title">vs softmax</div><div class="card-body">Softmax forces sum=1 (one class wins). Sigmoid lets several fire.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Architectures: PANNs and AST</h2>
<p class="l-text">Two dominant SED model families:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PANNs</div><div class="card-body">CNN14 on log-mel spectrograms, pretrained on AudioSet. Fast, strong baseline.</div></div>
<div class="calc-card"><div class="card-title">AST</div><div class="card-body">Audio Spectrogram Transformer — ViT applied to spectrogram patches. SOTA on AudioSet.</div></div>
<div class="calc-card"><div class="card-title">BEATs</div><div class="card-body">Microsoft. Self-supervised acoustic tokens + iterative bootstrap. Top of leaderboard.</div></div>
<div class="calc-card"><div class="card-title">CRNN</div><div class="card-body">CNN front + RNN tail for frame-level SED with temporal smoothing.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. HF Pipeline for Audio Classification</h2>
<p class="l-text">Run pretrained AST in 3 lines via Hugging Face transformers.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> pipeline
<span class="kw">import</span> librosa

<span class="cm"># AST trained on AudioSet (527 classes)</span>
classifier = <span class="fn">pipeline</span>(
    <span class="str">"audio-classification"</span>,
    model=<span class="str">"MIT/ast-finetuned-audioset-10-10-0.4593"</span>,
    top_k=<span class="num">5</span>)

y, sr = librosa.<span class="fn">load</span>(<span class="str">"street_recording.wav"</span>, sr=<span class="num">16000</span>)
results = <span class="fn">classifier</span>({<span class="str">"array"</span>: y, <span class="str">"sampling_rate"</span>: sr})

<span class="kw">for</span> r <span class="kw">in</span> results:
    <span class="fn">print</span>(f<span class="str">"{r['label']:30s} {r['score']:.3f}"</span>)

<span class="cm"># Typical output:</span>
<span class="cm"># Vehicle                        0.812</span>
<span class="cm"># Car                            0.741</span>
<span class="cm"># Speech                         0.520</span>
<span class="cm"># Engine                         0.487</span>
<span class="cm"># Outside, urban or manmade      0.402</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">AST is blocked. We train a tiny scikit-learn LogReg over toy 16-band mean-power features as a proxy 'AST classifier'.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from scipy.fft import rfft
rng = np.random.default_rng(0)
def feat(y):
    Y = np.abs(rfft(y))
    return np.array([b.mean() for b in np.array_split(Y, 16)])
X, y = [], []
for _ in range(60):
    sig = np.sin(2*np.pi*440*np.arange(8000)/16000) + 0.05*rng.standard_normal(8000)
    X.append(feat(sig)); y.append(0)
    sig = rng.standard_normal(8000) * 0.3
    X.append(feat(sig)); y.append(1)
clf = LogisticRegression(max_iter=300).fit(X, y)
print('AST-proxy accuracy:', round(clf.score(X, y), 3))</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads MIT's AST model fine-tuned on AudioSet. 2) Loads audio at 16kHz (model's training rate). 3) Runs the pipeline — which converts to log-mel, patches it, runs the transformer, applies sigmoid heads. 4) Returns the top 5 highest-probability tags. Note multiple labels firing simultaneously — that's multi-label SED in action.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Audio Captioning</h2>
<p class="l-text">Captioning generates a sentence describing the audio: "A man speaks while waves crash on a beach." Models like Pengi, AudioCaps, WavCaps use audio encoders (PANNs/AST) + a language decoder (GPT-2/T5) trained on captioned datasets.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> pipeline

captioner = <span class="fn">pipeline</span>(
    <span class="str">"automatic-speech-recognition"</span>,  <span class="cm"># generic seq generation</span>
    model=<span class="str">"MU-NLPC/whisper-large-v2-audio-captioning"</span>)

caption = <span class="fn">captioner</span>(<span class="str">"scene.wav"</span>)[<span class="str">"text"</span>]
<span class="fn">print</span>(caption)
<span class="cm"># "Children laugh and play in a park while birds chirp."</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Audio captioning is blocked. We mock it by mapping FFT-band winners to a fixed vocabulary.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.fft import rfft
Y = np.abs(rfft(audio))
bands = np.array_split(Y, 4)
names = ['bass', 'low-mid', 'high-mid', 'treble']
energies = [float(b.mean()) for b in bands]
winner = int(np.argmax(energies))
caption = f'A clip dominated by {names[winner]} energy.'
print('Caption:', caption)
for n, e in zip(names, energies):
    print(f'  {n:&gt;9}: {e:0.3f}')</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads a Whisper variant fine-tuned for audio captioning (not transcription). 2) Runs it on the clip. 3) Returns one sentence describing the soundscape. Useful for accessibility (audio descriptions for the deaf) and content indexing.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Top-K Detected Events</h2>
<p class="l-text">Visualizing model output for one urban recording.</p>
<div id="audio-l12-graph-en" style="height:400px;width:100%"></div>
<p class="l-text"><strong>Real-world deployments:</strong></p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Surveillance</div><div class="card-body">Glass break, gunshot, scream detection in smart cameras.</div></div>
<div class="calc-card"><div class="card-title">Accessibility</div><div class="card-body">Apple/Google "Sound Recognition" — alerts for doorbells, alarms, baby crying.</div></div>
<div class="calc-card"><div class="card-title">Content moderation</div><div class="card-body">Detect explicit/violent audio in user-uploaded videos.</div></div>
<div class="calc-card"><div class="card-title">Bioacoustics</div><div class="card-body">Bird-song ID (BirdNET), whale call detection in conservation.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways & Course Wrap</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> SED = multi-label classification of "what + when" — overlapping events allowed.<br><strong>2.</strong> Train with per-class BCE (sigmoid) not softmax — events co-occur.<br><strong>3.</strong> AudioSet (2M clips, 527 classes) is the de-facto pretraining set; ESC-50 the small benchmark.<br><strong>4.</strong> AST and BEATs lead the leaderboard; PANNs is the fast classical baseline.<br><strong>5.</strong> Audio captioning bridges SED and language — accessibility, indexing, moderation.<br><strong>6.</strong> You've now covered the full Audio AI stack: signals → features → speech → speakers → music → events. Build something that listens.</div></div>
</div>

<script>setTimeout(function(){
  var T = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var bg = T ? '#0e1117' : '#ffffff';
  var fg = T ? '#e6e8ee' : '#1c1f26';
  var labels = ['Vehicle', 'Car', 'Speech', 'Engine', 'Outside (urban)', 'Footsteps', 'Wind', 'Bird'];
  var probs = [0.81, 0.74, 0.52, 0.49, 0.40, 0.31, 0.24, 0.18];
  var data = [{x:probs, y:labels, type:'bar', orientation:'h', marker:{color:'#c8a96e'}, text:probs.map(function(p){return p.toFixed(2)}), textposition:'outside'}];
  var layout = {paper_bgcolor:bg, plot_bgcolor:bg, font:{color:fg}, margin:{t:40,r:60,b:50,l:140}, xaxis:{title:'Probability', range:[0,1]}, yaxis:{autorange:'reversed'}, title:'Top-K Detected Events (street recording)'};
  if (document.getElementById('audio-l12-graph-en')) Plotly.newPlot('audio-l12-graph-en', data, layout, {displayModeBar:false});
  if (document.getElementById('audio-l12-graph-tr')) Plotly.newPlot('audio-l12-graph-tr', data, layout, {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Cam kırılması. Ağlayan bebek. Korna. Havlayan köpek — 12,4. saniyede.</strong> Ses Olayı Tespiti (SED) sana ne olduğunu ve ne zaman olduğunu kare kare söyler.</p>
<p class="l-text">Bu derste AudioSet/ESC-50 ile SED'i, PANNs ve AST mimarilerini, çok-etiketli BCE eğitimini, ses başlıklamayı ve gerçek dünya konuşlandırmalarını — gözetim, erişilebilirlik, içerik moderasyonu — öğreneceksin.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Klip seviyesi etiketlemeyi kare seviyesi Ses Olayı Tespiti'nden ayıracaksın</li>
<li>AudioSet, ESC-50 ve DCASE benchmark'larını etiket ve uzunluğa göre karşılaştıracaksın</li>
<li>Binary cross-entropy ve sınıf-başı sigmoid ile çok-etiketli SED head eğiteceksin</li>
<li>Bir örnek klipte PANNs ve Audio Spectrogram Transformer (AST) uygulayacaksın</li>
<li>Doğal dilde ses başlıkları üretip tespit edilen Top-K olayı sıralayacaksın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Ses Olayı Tespiti vs Sınıflandırma</h2>
<p class="l-text">Ses sınıflandırma: tüm klip için tek etiket ("köpek havlaması"). SED: zamana yerelleşmiş etiketler — "1.2s'den 3.5s'ye köpek havlaması, 4.0s'den 4.3s'ye cam kırılması". Çok-etiketli ve çakışan olaylar serbest.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Etiketleme</div><div class="card-body">Klip seviyesi: hangi sınıflar herhangi bir yerde mevcut?</div></div>
<div class="calc-card"><div class="card-title">SED</div><div class="card-body">Kare seviyesi: her karede hangi sınıflar mevcut?</div></div>
<div class="calc-card"><div class="card-title">Başlıklama</div><div class="card-body">Serbest metin açıklaması: "Bir köpek havlarken arabanın geçtiği duyuluyor."</div></div>
<div class="calc-card"><div class="card-title">Yer tespiti</div><div class="card-body">Geliş yönü (DOA) — uzayda nerede?</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Veri Kümeleri</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">AudioSet</div><div class="card-body">Google. 2M YouTube klibi, 527 sınıf, zayıf etiketli.</div></div>
<div class="calc-card"><div class="card-title">ESC-50</div><div class="card-body">2000 klip, 50 sınıf, 5 katlı bölme. Standart küçük benchmark.</div></div>
<div class="calc-card"><div class="card-title">UrbanSound8K</div><div class="card-body">8732 kentsel klip (siren, kırıcı, köpek).</div></div>
<div class="calc-card"><div class="card-title">DCASE</div><div class="card-body">Yıllık yarışma — SED, sahne sınıflandırma, anomali tespiti.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Çok-Etiketli BCE Kaybı</h2>
<p class="l-text">Birden fazla olay aynı anda olabilir, bu yüzden sınıf başına bağımsız sigmoid ile ikili çapraz entropi kullanırız:</p>
<div class="katex-block">$$L = -\\sum_{c=1}^{C}\\bigl[\\,y_c \\log p_c + (1-y_c)\\log(1-p_c)\\,\\bigr]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">\\(C\\)</div><div class="card-body">Sınıf sayısı (örn. AudioSet için 527).</div></div>
<div class="calc-card"><div class="card-title">\\(y_c \\in \\{0,1\\}\\)</div><div class="card-body">Gerçek değer: c sınıfı varsa 1, yoksa 0.</div></div>
<div class="calc-card"><div class="card-title">\\(p_c \\in (0,1)\\)</div><div class="card-body">c sınıfı için sigmoid çıkışı — bağımsız olasılık.</div></div>
<div class="calc-card"><div class="card-title">softmax'a göre</div><div class="card-body">Softmax toplam=1 zorlar (tek sınıf kazanır). Sigmoid birkaçının ateşlemesine izin verir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Mimariler: PANNs ve AST</h2>
<p class="l-text">İki baskın SED model ailesi:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PANNs</div><div class="card-body">Log-mel spektrogramlar üzerinde CNN14, AudioSet'te ön eğitimli. Hızlı, sağlam başlangıç.</div></div>
<div class="calc-card"><div class="card-title">AST</div><div class="card-body">Ses Spektrogramı Transformer — spektrogram parçalarına uygulanan ViT. AudioSet'te SOTA.</div></div>
<div class="calc-card"><div class="card-title">BEATs</div><div class="card-body">Microsoft. Öz-gözetimli akustik tokenler + yinelemeli bootstrap. Liderlik tablosunun tepesi.</div></div>
<div class="calc-card"><div class="card-title">CRNN</div><div class="card-body">CNN ön + RNN arka, kare seviyesi SED için zamansal yumuşatma ile.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Ses Sınıflandırma için HF Pipeline</h2>
<p class="l-text">Hugging Face transformers ile ön eğitimli AST'i 3 satırda çalıştır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> pipeline
<span class="kw">import</span> librosa

<span class="cm"># AudioSet'te eğitilmiş AST (527 sınıf)</span>
classifier = <span class="fn">pipeline</span>(
    <span class="str">"audio-classification"</span>,
    model=<span class="str">"MIT/ast-finetuned-audioset-10-10-0.4593"</span>,
    top_k=<span class="num">5</span>)

y, sr = librosa.<span class="fn">load</span>(<span class="str">"sokak_kaydi.wav"</span>, sr=<span class="num">16000</span>)
results = <span class="fn">classifier</span>({<span class="str">"array"</span>: y, <span class="str">"sampling_rate"</span>: sr})

<span class="kw">for</span> r <span class="kw">in</span> results:
    <span class="fn">print</span>(f<span class="str">"{r['label']:30s} {r['score']:.3f}"</span>)

<span class="cm"># Tipik çıktı:</span>
<span class="cm"># Vehicle                        0.812</span>
<span class="cm"># Car                            0.741</span>
<span class="cm"># Speech                         0.520</span>
<span class="cm"># Engine                         0.487</span>
<span class="cm"># Outside, urban or manmade      0.402</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">AST is blocked. We train a tiny scikit-learn LogReg over toy 16-band mean-power features as a proxy 'AST classifier'.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from scipy.fft import rfft
rng = np.random.default_rng(0)
def feat(y):
    Y = np.abs(rfft(y))
    return np.array([b.mean() for b in np.array_split(Y, 16)])
X, y = [], []
for _ in range(60):
    sig = np.sin(2*np.pi*440*np.arange(8000)/16000) + 0.05*rng.standard_normal(8000)
    X.append(feat(sig)); y.append(0)
    sig = rng.standard_normal(8000) * 0.3
    X.append(feat(sig)); y.append(1)
clf = LogisticRegression(max_iter=300).fit(X, y)
print('AST-proxy accuracy:', round(clf.score(X, y), 3))</code></pre></div>
</div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) MIT'in AudioSet'te ince ayar yapılmış AST modelini yükler. 2) Sesi 16kHz'de yükler (modelin eğitim oranı). 3) Pipeline'ı çalıştırır — log-mel'e çevirir, parçalara böler, transformer çalıştırır, sigmoid başları uygular. 4) En yüksek olasılıklı 5 etiketi döndürür. Birden fazla etiketin aynı anda ateşlemesine dikkat — bu çok-etiketli SED'in ta kendisi.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Ses Başlıklama</h2>
<p class="l-text">Başlıklama, sesi tarif eden bir cümle üretir: "Bir adam konuşurken sahilde dalgalar kırılıyor." Pengi, AudioCaps, WavCaps gibi modeller ses kodlayıcıları (PANNs/AST) + dil çözücüsü (GPT-2/T5) ile başlıklı veri kümeleri üzerinde eğitilir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> pipeline

captioner = <span class="fn">pipeline</span>(
    <span class="str">"automatic-speech-recognition"</span>,  <span class="cm"># genel dizi üretimi</span>
    model=<span class="str">"MU-NLPC/whisper-large-v2-audio-captioning"</span>)

caption = <span class="fn">captioner</span>(<span class="str">"sahne.wav"</span>)[<span class="str">"text"</span>]
<span class="fn">print</span>(caption)
<span class="cm"># "Children laugh and play in a park while birds chirp."</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Audio captioning is blocked. We mock it by mapping FFT-band winners to a fixed vocabulary.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.fft import rfft
Y = np.abs(rfft(audio))
bands = np.array_split(Y, 4)
names = ['bass', 'low-mid', 'high-mid', 'treble']
energies = [float(b.mean()) for b in bands]
winner = int(np.argmax(energies))
caption = f'A clip dominated by {names[winner]} energy.'
print('Caption:', caption)
for n, e in zip(names, energies):
    print(f'  {n:&gt;9}: {e:0.3f}')</code></pre></div>
</div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Transkripsiyon değil, ses başlıklama için ince ayar yapılmış bir Whisper varyantını yükler. 2) Klip üzerinde çalıştırır. 3) Ses manzarasını tarif eden tek cümle döndürür. Erişilebilirlik (sağırlar için ses açıklamaları) ve içerik indeksleme için faydalı.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Tespit Edilen Top-K Olaylar</h2>
<p class="l-text">Bir kentsel kayıt için model çıktısının görselleştirilmesi.</p>
<div id="audio-l12-graph-tr" style="height:400px;width:100%"></div>
<p class="l-text"><strong>Gerçek dünya konuşlandırmaları:</strong></p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gözetim</div><div class="card-body">Akıllı kameralarda cam kırılması, silah sesi, çığlık tespiti.</div></div>
<div class="calc-card"><div class="card-title">Erişilebilirlik</div><div class="card-body">Apple/Google "Ses Tanıma" — kapı zili, alarm, ağlayan bebek için uyarılar.</div></div>
<div class="calc-card"><div class="card-title">İçerik moderasyonu</div><div class="card-body">Kullanıcı yüklemeli videolarda açık/şiddet içeren ses tespiti.</div></div>
<div class="calc-card"><div class="card-title">Biyoakustik</div><div class="card-body">Kuş sesi tanıma (BirdNET), korumada balina çağrısı tespiti.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar ve Kurs Kapanışı</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> SED = "ne + ne zaman"ın çok-etiketli sınıflandırması — çakışan olaylar serbest.<br><strong>2.</strong> Sınıf başına BCE (sigmoid) ile eğit, softmax değil — olaylar birlikte oluşur.<br><strong>3.</strong> AudioSet (2M klip, 527 sınıf) fiili ön eğitim seti; ESC-50 küçük benchmark.<br><strong>4.</strong> AST ve BEATs liderlik tablosunda önde; PANNs hızlı klasik başlangıç.<br><strong>5.</strong> Ses başlıklama SED ile dili köprüler — erişilebilirlik, indeksleme, moderasyon.<br><strong>6.</strong> Artık tüm Ses YZ yığınını gördün: sinyaller → öznitelikler → konuşma → konuşmacılar → müzik → olaylar. Dinleyen bir şey inşa et.</div></div>
</div>

<script>setTimeout(function(){
  var T = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var bg = T ? '#0e1117' : '#ffffff';
  var fg = T ? '#e6e8ee' : '#1c1f26';
  var labels = ['Araç', 'Araba', 'Konuşma', 'Motor', 'Dış mekan (kentsel)', 'Ayak sesi', 'Rüzgar', 'Kuş'];
  var probs = [0.81, 0.74, 0.52, 0.49, 0.40, 0.31, 0.24, 0.18];
  var data = [{x:probs, y:labels, type:'bar', orientation:'h', marker:{color:'#c8a96e'}, text:probs.map(function(p){return p.toFixed(2)}), textposition:'outside'}];
  var layout = {paper_bgcolor:bg, plot_bgcolor:bg, font:{color:fg}, margin:{t:40,r:60,b:50,l:160}, xaxis:{title:'Olasılık', range:[0,1]}, yaxis:{autorange:'reversed'}, title:'Tespit Edilen Top-K Olaylar (sokak kaydı)'};
  if (document.getElementById('audio-l12-graph-en')) Plotly.newPlot('audio-l12-graph-en', data, layout, {displayModeBar:false});
  if (document.getElementById('audio-l12-graph-tr')) Plotly.newPlot('audio-l12-graph-tr', data, layout, {displayModeBar:false});
}, 250);</script>`
};
