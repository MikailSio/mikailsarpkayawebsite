window.AUDIO_L10 = {

en: `<p class="l-text"><strong>Three people in a meeting. Whisper transcribes everything — but who said what?</strong> That's speaker diarization: segmenting audio by speaker identity, not just words.</p>
<p class="l-text">In this lesson you'll learn the diarization pipeline (VAD → embeddings → clustering), speaker embedding models (x-vector, ECAPA-TDNN), cosine similarity matching, and how to run pyannote.audio end-to-end.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish diarization (who-when) from speaker identification (is-this-Alice)</li>
<li>Build the VAD-to-embedding-to-clustering diarization pipeline by hand</li>
<li>Extract x-vector and ECAPA-TDNN speaker embeddings from short utterances</li>
<li>Match utterances to speakers with cosine similarity and threshold selection</li>
<li>Run pyannote.audio end-to-end on a meeting and emit a speaker timeline</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Diarization Problem</h2>
<p class="l-text">Diarization answers "who spoke when?" without knowing speakers in advance. Voice identification answers "is this Alice?" given a known voice. Both rely on speaker embeddings.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Diarization</div><div class="card-body">Unsupervised: cluster speech segments by speaker.</div></div>
<div class="calc-card"><div class="card-title">Identification</div><div class="card-body">Supervised: match against known enrolled voices.</div></div>
<div class="calc-card"><div class="card-title">Verification</div><div class="card-body">Binary: is this voice user X? (Yes/No.)</div></div>
<div class="calc-card"><div class="card-title">DER metric</div><div class="card-body">Diarization Error Rate — % of time labelled wrong speaker.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Pipeline</h2>
<p class="l-text">Standard 4-stage pipeline:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. VAD</div><div class="card-body">Voice Activity Detection — drop silence and noise.</div></div>
<div class="calc-card"><div class="card-title">2. Segmentation</div><div class="card-body">Cut speech into short chunks (1-2s) likely from one speaker.</div></div>
<div class="calc-card"><div class="card-title">3. Embedding</div><div class="card-body">Map each segment to a fixed-size vector (192 or 512 dims).</div></div>
<div class="calc-card"><div class="card-title">4. Clustering</div><div class="card-body">Group segments by similarity (agglomerative, spectral, online).</div></div>
</div>
<p class="l-text">Modern systems (pyannote 3.x) replace VAD+segmentation with an end-to-end neural segmenter that handles overlap.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Speaker Embeddings: x-vector and ECAPA-TDNN</h2>
<p class="l-text">A speaker embedding is a learned vector where same-speaker recordings are close and different-speaker recordings are far. Trained with a classification objective on thousands of speakers (VoxCeleb), then the bottleneck layer is used as the embedding.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">x-vector</div><div class="card-body">TDNN + statistics pooling (mean+std over time). Robust baseline.</div></div>
<div class="calc-card"><div class="card-title">ECAPA-TDNN</div><div class="card-body">Adds attention pooling, Squeeze-Excite, multi-scale res blocks. SOTA-level.</div></div>
<div class="calc-card"><div class="card-title">WavLM/Hubert</div><div class="card-body">Self-supervised; fine-tune for speaker tasks.</div></div>
<div class="calc-card"><div class="card-title">Loss</div><div class="card-body">AAM-softmax or angular margin — encourages tight clusters.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Cosine Similarity for Matching</h2>
<p class="l-text">Once you have embeddings, cosine similarity decides if two segments are the same speaker:</p>
<div class="katex-block">$$\\cos(\\mathbf{a},\\mathbf{b}) = \\frac{\\mathbf{a}\\cdot\\mathbf{b}}{\\|\\mathbf{a}\\|\\,\\|\\mathbf{b}\\|} = \\frac{\\sum_i a_i b_i}{\\sqrt{\\sum_i a_i^2}\\sqrt{\\sum_i b_i^2}}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">\\(\\mathbf{a},\\mathbf{b}\\)</div><div class="card-body">Two speaker embedding vectors.</div></div>
<div class="calc-card"><div class="card-title">cos = 1</div><div class="card-body">Identical direction — almost certainly same speaker.</div></div>
<div class="calc-card"><div class="card-title">cos &lt; 0.3</div><div class="card-body">Different speakers (typical threshold).</div></div>
<div class="calc-card"><div class="card-title">EER</div><div class="card-body">Equal Error Rate — operating point where FAR=FRR.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. pyannote.audio End-to-End</h2>
<p class="l-text">pyannote.audio wraps the full pipeline with pretrained models on Hugging Face.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> pyannote.audio <span class="kw">import</span> Pipeline

pipeline = Pipeline.<span class="fn">from_pretrained</span>(
    <span class="str">"pyannote/speaker-diarization-3.1"</span>,
    use_auth_token=<span class="str">"HF_TOKEN"</span>)

<span class="cm"># Run on a meeting recording</span>
diarization = <span class="fn">pipeline</span>(<span class="str">"meeting.wav"</span>, num_speakers=<span class="num">3</span>)

<span class="kw">for</span> turn, _, speaker <span class="kw">in</span> diarization.<span class="fn">itertracks</span>(yield_label=<span class="kw">True</span>):
    <span class="fn">print</span>(f<span class="str">"{turn.start:.1f}s - {turn.end:.1f}s : {speaker}"</span>)

<span class="cm"># Combine with Whisper for "who said what"</span>
<span class="kw">import</span> whisper
model = whisper.<span class="fn">load_model</span>(<span class="str">"base"</span>)
asr = model.<span class="fn">transcribe</span>(<span class="str">"meeting.wav"</span>, word_timestamps=<span class="kw">True</span>)

<span class="cm"># Align each word to the speaker active at its midpoint</span>
<span class="kw">for</span> w <span class="kw">in</span> asr[<span class="str">"segments"</span>]:
    mid = (w[<span class="str">"start"</span>] + w[<span class="str">"end"</span>]) / <span class="num">2</span>
    spk = diarization.<span class="fn">crop</span>({<span class="str">"start"</span>: mid, <span class="str">"end"</span>: mid+<span class="num">0.01</span>})
    <span class="fn">print</span>(f<span class="str">"[{spk}] {w['text']}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Diarization without pyannote: cluster frame embeddings with KMeans (one cluster per speaker).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.cluster import KMeans
rng = np.random.default_rng(0)
# 3 'speakers' × 50 frames each, 16-d embeddings
centers = rng.standard_normal((3, 16)) * 3
labels = np.repeat(np.arange(3), 50)
X = np.stack([centers[l] + rng.standard_normal(16) for l in labels])
rng.shuffle(X)
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
print('Cluster sizes:', np.bincount(km.labels_))
print('Inertia      :', round(float(km.inertia_), 2))
print('First 20 frame → speaker assignments:', km.labels_[:20])</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads the pyannote 3.1 pipeline (segmenter + embedding + clustering). 2) Runs diarization with a known speaker count. 3) Iterates speech turns and prints time ranges per speaker. 4) Pairs Whisper transcription with diarization by aligning each word to the speaker active at its midpoint.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Speaker Timeline</h2>
<p class="l-text">Visualizing speaker turns over time — typical output of a diarization system.</p>
<div id="audio-l10-graph-en" style="height:380px;width:100%"></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Hard Cases & Tips</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Overlap</div><div class="card-body">Two speakers at once — pyannote 3 handles this; older systems fail.</div></div>
<div class="calc-card"><div class="card-title">Short turns</div><div class="card-body">Backchannels (uh-huh) under 0.5s often mislabelled.</div></div>
<div class="calc-card"><div class="card-title">Noise/reverb</div><div class="card-body">Embeddings degrade — denoise + dereverb first.</div></div>
<div class="calc-card"><div class="card-title">Unknown count</div><div class="card-body">Use clustering with silhouette to estimate number of speakers.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Diarization = "who spoke when" via VAD → segmentation → embedding → clustering.<br><strong>2.</strong> Speaker embeddings (x-vector, ECAPA-TDNN) trained on VoxCeleb with angular-margin losses.<br><strong>3.</strong> Cosine similarity is the standard metric; threshold ~0.3 separates same vs different speakers.<br><strong>4.</strong> pyannote.audio gives you a production-ready pipeline in 5 lines of code.<br><strong>5.</strong> Combine with Whisper for "who said what" transcripts — gold for meeting summaries and podcasts.</div></div>
</div>

<script>setTimeout(function(){
  var T = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var bg = T ? '#0e1117' : '#ffffff';
  var fg = T ? '#e6e8ee' : '#1c1f26';
  var turns = [
    {s:0, e:5, spk:'A'},{s:5, e:8, spk:'B'},{s:8, e:14, spk:'A'},
    {s:14, e:19, spk:'C'},{s:19, e:24, spk:'B'},{s:24, e:30, spk:'A'},
    {s:30, e:35, spk:'C'},{s:35, e:40, spk:'B'}
  ];
  var colors = {A:'#c8a96e', B:'#4de87a', C:'#6a9bd8'};
  var data = ['A','B','C'].map(function(spk){
    var xs=[], ys=[];
    turns.filter(function(t){return t.spk===spk}).forEach(function(t){
      xs.push(t.s, t.e, null); ys.push(spk, spk, null);
    });
    return {x:xs, y:ys, type:'scatter', mode:'lines', line:{color:colors[spk], width:18}, name:'Speaker '+spk};
  });
  var layout = {paper_bgcolor:bg, plot_bgcolor:bg, font:{color:fg}, margin:{t:30,r:20,b:50,l:80}, xaxis:{title:'Time (s)'}, yaxis:{title:'Speaker', categoryorder:'array', categoryarray:['A','B','C']}, title:'Speaker Diarization Timeline'};
  if (document.getElementById('audio-l10-graph-en')) Plotly.newPlot('audio-l10-graph-en', data, layout, {displayModeBar:false});
  if (document.getElementById('audio-l10-graph-tr')) Plotly.newPlot('audio-l10-graph-tr', data, layout, {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Bir toplantıda üç kişi. Whisper her şeyi yazıya döker — ama kim ne dedi?</strong> İşte konuşmacı diyarizasyonu: sadece kelimeyi değil, konuşmacı kimliğine göre sesi parçalama.</p>
<p class="l-text">Bu derste diyarizasyon pipeline'ını (VAD → gömmeler → kümeleme), konuşmacı gömme modellerini (x-vector, ECAPA-TDNN), kosinüs benzerliği eşlemesini ve pyannote.audio'yu uçtan uca öğreneceksin.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Diyarizasyonu (kim-ne zaman) konuşmacı tanımadan (bu-Ayşe-mi) ayıracaksın</li>
<li>VAD → gömme → kümeleme diyarizasyon pipeline'ını elden kuracaksın</li>
<li>Kısa konuşmalardan x-vector ve ECAPA-TDNN konuşmacı gömmesi çıkaracaksın</li>
<li>Cosine similarity ve eşik seçimiyle konuşmaları konuşmacılara eşleyeceksin</li>
<li>Bir toplantıda pyannote.audio'yu uçtan uca koşturup konuşmacı zaman çizelgesi üreteceksin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Diyarizasyon Problemi</h2>
<p class="l-text">Diyarizasyon "kim ne zaman konuştu?" sorusunu konuşmacıları önceden bilmeden yanıtlar. Konuşmacı tanıma "bu Ayşe mi?" sorusunu bilinen sesle yanıtlar. İkisi de konuşmacı gömmelerine dayanır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Diyarizasyon</div><div class="card-body">Gözetimsiz: konuşma segmentlerini konuşmacıya göre kümele.</div></div>
<div class="calc-card"><div class="card-title">Tanıma</div><div class="card-body">Gözetimli: kayıtlı bilinen seslere karşı eşle.</div></div>
<div class="calc-card"><div class="card-title">Doğrulama</div><div class="card-body">İkili: bu ses kullanıcı X mi? (Evet/Hayır.)</div></div>
<div class="calc-card"><div class="card-title">DER metriği</div><div class="card-body">Diyarizasyon Hata Oranı — yanlış konuşmacı atanan zaman %'si.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Pipeline</h2>
<p class="l-text">Standart 4 aşamalı pipeline:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. VAD</div><div class="card-body">Ses Aktivitesi Tespiti — sessizlik ve gürültüyü at.</div></div>
<div class="calc-card"><div class="card-title">2. Segmentasyon</div><div class="card-body">Konuşmayı tek konuşmacıdan gelmesi olası kısa parçalara (1-2s) böl.</div></div>
<div class="calc-card"><div class="card-title">3. Gömme</div><div class="card-body">Her segmenti sabit boyutlu vektöre eşle (192 veya 512 boyut).</div></div>
<div class="calc-card"><div class="card-title">4. Kümeleme</div><div class="card-body">Segmentleri benzerliğe göre grupla (yığınsal, spektral, çevrimiçi).</div></div>
</div>
<p class="l-text">Modern sistemler (pyannote 3.x) VAD+segmentasyonu, çakışmayı da işleyen uçtan uca sinirsel segmenterla değiştirir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Konuşmacı Gömmeleri: x-vector ve ECAPA-TDNN</h2>
<p class="l-text">Konuşmacı gömmesi, aynı konuşmacının kayıtlarının yakın, farklı konuşmacıların kayıtlarının uzak olduğu öğrenilmiş bir vektördür. Binlerce konuşmacı (VoxCeleb) üzerinde sınıflandırma hedefi ile eğitilir, sonra darboğaz katmanı gömme olarak kullanılır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">x-vector</div><div class="card-body">TDNN + istatistik havuzlama (zamana ortalama+std). Sağlam başlangıç.</div></div>
<div class="calc-card"><div class="card-title">ECAPA-TDNN</div><div class="card-body">Dikkat havuzlama, Squeeze-Excite, çok ölçekli res blokları ekler. SOTA seviye.</div></div>
<div class="calc-card"><div class="card-title">WavLM/Hubert</div><div class="card-body">Öz-gözetimli; konuşmacı görevleri için ince ayar.</div></div>
<div class="calc-card"><div class="card-title">Kayıp</div><div class="card-body">AAM-softmax veya açısal marj — sıkı kümeler için.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Eşleştirme için Kosinüs Benzerliği</h2>
<p class="l-text">Gömmelerin olduğunda, kosinüs benzerliği iki segmentin aynı konuşmacı olup olmadığına karar verir:</p>
<div class="katex-block">$$\\cos(\\mathbf{a},\\mathbf{b}) = \\frac{\\mathbf{a}\\cdot\\mathbf{b}}{\\|\\mathbf{a}\\|\\,\\|\\mathbf{b}\\|} = \\frac{\\sum_i a_i b_i}{\\sqrt{\\sum_i a_i^2}\\sqrt{\\sum_i b_i^2}}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">\\(\\mathbf{a},\\mathbf{b}\\)</div><div class="card-body">İki konuşmacı gömme vektörü.</div></div>
<div class="calc-card"><div class="card-title">cos = 1</div><div class="card-body">Aynı yön — neredeyse kesin aynı konuşmacı.</div></div>
<div class="calc-card"><div class="card-title">cos &lt; 0.3</div><div class="card-body">Farklı konuşmacılar (tipik eşik).</div></div>
<div class="calc-card"><div class="card-title">EER</div><div class="card-body">Eşit Hata Oranı — FAR=FRR olduğu çalışma noktası.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. pyannote.audio Uçtan Uca</h2>
<p class="l-text">pyannote.audio, Hugging Face üzerinde ön eğitimli modellerle tüm pipeline'ı sarar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> pyannote.audio <span class="kw">import</span> Pipeline

pipeline = Pipeline.<span class="fn">from_pretrained</span>(
    <span class="str">"pyannote/speaker-diarization-3.1"</span>,
    use_auth_token=<span class="str">"HF_TOKEN"</span>)

<span class="cm"># Toplantı kaydı üzerinde çalıştır</span>
diarization = <span class="fn">pipeline</span>(<span class="str">"toplanti.wav"</span>, num_speakers=<span class="num">3</span>)

<span class="kw">for</span> turn, _, speaker <span class="kw">in</span> diarization.<span class="fn">itertracks</span>(yield_label=<span class="kw">True</span>):
    <span class="fn">print</span>(f<span class="str">"{turn.start:.1f}s - {turn.end:.1f}s : {speaker}"</span>)

<span class="cm"># "Kim ne dedi" için Whisper ile birleştir</span>
<span class="kw">import</span> whisper
model = whisper.<span class="fn">load_model</span>(<span class="str">"base"</span>)
asr = model.<span class="fn">transcribe</span>(<span class="str">"toplanti.wav"</span>, word_timestamps=<span class="kw">True</span>)

<span class="cm"># Her kelimeyi orta noktasındaki aktif konuşmacıya hizala</span>
<span class="kw">for</span> w <span class="kw">in</span> asr[<span class="str">"segments"</span>]:
    mid = (w[<span class="str">"start"</span>] + w[<span class="str">"end"</span>]) / <span class="num">2</span>
    spk = diarization.<span class="fn">crop</span>({<span class="str">"start"</span>: mid, <span class="str">"end"</span>: mid+<span class="num">0.01</span>})
    <span class="fn">print</span>(f<span class="str">"[{spk}] {w['text']}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Diarization without pyannote: cluster frame embeddings with KMeans (one cluster per speaker).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.cluster import KMeans
rng = np.random.default_rng(0)
# 3 'speakers' × 50 frames each, 16-d embeddings
centers = rng.standard_normal((3, 16)) * 3
labels = np.repeat(np.arange(3), 50)
X = np.stack([centers[l] + rng.standard_normal(16) for l in labels])
rng.shuffle(X)
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
print('Cluster sizes:', np.bincount(km.labels_))
print('Inertia      :', round(float(km.inertia_), 2))
print('First 20 frame → speaker assignments:', km.labels_[:20])</code></pre></div>
</div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) pyannote 3.1 pipeline'ını yükler (segmenter + gömme + kümeleme). 2) Bilinen konuşmacı sayısıyla diyarizasyon çalıştırır. 3) Konuşma sıralarını dolaşır ve konuşmacı başına zaman aralıkları yazdırır. 4) Whisper transkripsiyonunu, her kelimeyi orta noktasındaki aktif konuşmacıya hizalayarak diyarizasyonla eşler.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Konuşmacı Zaman Çizelgesi</h2>
<p class="l-text">Konuşmacı sıralarını zaman boyunca görselleştirme — diyarizasyon sisteminin tipik çıktısı.</p>
<div id="audio-l10-graph-tr" style="height:380px;width:100%"></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Zor Durumlar ve İpuçları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çakışma</div><div class="card-body">Aynı anda iki konuşmacı — pyannote 3 bunu işler; eski sistemler başarısız olur.</div></div>
<div class="calc-card"><div class="card-title">Kısa sıralar</div><div class="card-body">0.5s altı geri kanal sesleri (hı-hı) genelde yanlış etiketlenir.</div></div>
<div class="calc-card"><div class="card-title">Gürültü/yankı</div><div class="card-body">Gömmeler bozulur — önce gürültü/yankı temizle.</div></div>
<div class="calc-card"><div class="card-title">Bilinmeyen sayı</div><div class="card-body">Konuşmacı sayısını tahmin için silhouette skoru ile kümeleme kullan.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Diyarizasyon = "kim ne zaman konuştu", VAD → segmentasyon → gömme → kümeleme ile.<br><strong>2.</strong> Konuşmacı gömmeleri (x-vector, ECAPA-TDNN) VoxCeleb üzerinde açısal-marj kayıplarıyla eğitilir.<br><strong>3.</strong> Kosinüs benzerliği standart metriktir; ~0.3 eşiği aynı vs farklı konuşmacıyı ayırır.<br><strong>4.</strong> pyannote.audio sana 5 satır kodda üretime hazır pipeline verir.<br><strong>5.</strong> Whisper ile birleştir — "kim ne dedi" transkriptleri toplantı özetleri ve podcastler için altın değerinde.</div></div>
</div>

<script>setTimeout(function(){
  var T = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var bg = T ? '#0e1117' : '#ffffff';
  var fg = T ? '#e6e8ee' : '#1c1f26';
  var turns = [
    {s:0, e:5, spk:'A'},{s:5, e:8, spk:'B'},{s:8, e:14, spk:'A'},
    {s:14, e:19, spk:'C'},{s:19, e:24, spk:'B'},{s:24, e:30, spk:'A'},
    {s:30, e:35, spk:'C'},{s:35, e:40, spk:'B'}
  ];
  var colors = {A:'#c8a96e', B:'#4de87a', C:'#6a9bd8'};
  var data = ['A','B','C'].map(function(spk){
    var xs=[], ys=[];
    turns.filter(function(t){return t.spk===spk}).forEach(function(t){
      xs.push(t.s, t.e, null); ys.push(spk, spk, null);
    });
    return {x:xs, y:ys, type:'scatter', mode:'lines', line:{color:colors[spk], width:18}, name:'Konuşmacı '+spk};
  });
  var layout = {paper_bgcolor:bg, plot_bgcolor:bg, font:{color:fg}, margin:{t:30,r:20,b:50,l:80}, xaxis:{title:'Zaman (s)'}, yaxis:{title:'Konuşmacı', categoryorder:'array', categoryarray:['A','B','C']}, title:'Konuşmacı Diyarizasyon Zaman Çizelgesi'};
  if (document.getElementById('audio-l10-graph-en')) Plotly.newPlot('audio-l10-graph-en', data, layout, {displayModeBar:false});
  if (document.getElementById('audio-l10-graph-tr')) Plotly.newPlot('audio-l10-graph-tr', data, layout, {displayModeBar:false});
}, 250);</script>`
};
