window.AUDIO_L9 = {

en: `<p class="l-text"><strong>Shazam recognizes a song in 3 seconds. Spotify auto-tags genre. DJs match BPMs in real time.</strong> All of these are Music Information Retrieval (MIR) tasks — extracting structure from audio.</p>
<p class="l-text">In this lesson you'll learn beat tracking, key/chord detection, audio fingerprinting, and genre classification using librosa and basic spectrogram tricks.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Estimate tempo and beat locations with librosa.beat.beat_track</li>
<li>Compute a chromagram and infer key with the Krumhansl-Schmuckler profile</li>
<li>Build Shazam-style audio fingerprints from constellation-map peak hashes</li>
<li>Train a tiny genre classifier on GTZAN log-mel features</li>
<li>Visualize a tempogram to spot tempo drift in a recording</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. What is MIR?</h2>
<p class="l-text">Music Information Retrieval is the field of pulling musical attributes out of raw waveforms: tempo, key, chords, beats, genre, mood, and similarity.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tempo</div><div class="card-body">Beats per minute (BPM). Stable for most pop, varying for classical/jazz.</div></div>
<div class="calc-card"><div class="card-title">Key</div><div class="card-body">Tonal center (e.g. C major, A minor). 24 possible keys.</div></div>
<div class="calc-card"><div class="card-title">Chord</div><div class="card-body">Triad/seventh harmony at a moment. Sequence forms progressions.</div></div>
<div class="calc-card"><div class="card-title">Genre</div><div class="card-body">High-level label (rock/jazz/classical). Predicted from spectral features.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Beat Tracking & Tempo</h2>
<p class="l-text">Tempo is the inverse of mean inter-beat interval. If beats arrive at times \\(t_1, t_2, \\dots\\), then:</p>
<div class="katex-block">$$\\text{BPM} = \\frac{60}{\\bar{T}_{\\text{beat}}}, \\qquad \\bar{T}_{\\text{beat}} = \\frac{1}{N-1}\\sum_{i=1}^{N-1}(t_{i+1}-t_i)$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">\\(t_i\\)</div><div class="card-body">Time of i-th detected beat (seconds).</div></div>
<div class="calc-card"><div class="card-title">\\(\\bar{T}_{\\text{beat}}\\)</div><div class="card-body">Mean spacing between consecutive beats.</div></div>
<div class="calc-card"><div class="card-title">BPM</div><div class="card-body">Tempo: 60s divided by mean beat spacing.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

y, sr = librosa.<span class="fn">load</span>(<span class="str">"song.wav"</span>, sr=<span class="num">22050</span>)

<span class="cm"># Onset envelope: where energy spikes (drum hits, attacks)</span>
onset_env = librosa.onset.<span class="fn">onset_strength</span>(y=y, sr=sr)

<span class="cm"># Beat tracker uses dynamic programming over onset envelope</span>
tempo, beat_frames = librosa.beat.<span class="fn">beat_track</span>(onset_envelope=onset_env, sr=sr)
beat_times = librosa.<span class="fn">frames_to_time</span>(beat_frames, sr=sr)

<span class="fn">print</span>(f<span class="str">"Estimated tempo: {tempo:.1f} BPM"</span>)
<span class="fn">print</span>(f<span class="str">"First 5 beat times: {beat_times[:5]}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">MIR: tempo + onset detection without librosa. Use spectral flux + autocorrelation.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=384)
S = np.abs(Z)
flux = np.maximum(0, np.diff(S, axis=1)).sum(axis=0)
ac = np.correlate(flux - flux.mean(), flux - flux.mean(), mode='full')[len(flux)-1:]
ac[:5] = 0
lag = int(np.argmax(ac[:60]))
frame_dt = (t[1] - t[0]) if len(t) &gt; 1 else 0.016
bpm = 60 / max(lag * frame_dt, 1e-6)
print('Onset frames :', flux.shape[0])
print('Estimated BPM:', round(float(bpm), 1))
print('Onset frames &gt; median:', int((flux &gt; np.median(flux)).sum()))</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads audio at 22050 Hz (standard for MIR). 2) Computes onset strength — a 1D signal that peaks at rhythmic events. 3) <code>beat_track</code> runs DP on the onset envelope, finding a beat sequence consistent with global tempo. 4) Converts frame indices to seconds.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Chromagram & Key Detection</h2>
<p class="l-text">A chromagram folds the spectrum into 12 pitch classes (C, C#, D, ..., B), regardless of octave. Summed over a song, it reveals which pitches dominate — a fingerprint for key.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>chroma = librosa.feature.<span class="fn">chroma_cqt</span>(y=y, sr=sr)  <span class="cm"># shape (12, T)</span>

<span class="cm"># Average chroma over the whole track</span>
chroma_mean = chroma.<span class="fn">mean</span>(axis=<span class="num">1</span>)

<span class="cm"># Krumhansl-Schmuckler key profiles (correlation-based)</span>
major_profile = np.<span class="fn">array</span>([<span class="num">6.35</span>,<span class="num">2.23</span>,<span class="num">3.48</span>,<span class="num">2.33</span>,<span class="num">4.38</span>,<span class="num">4.09</span>,<span class="num">2.52</span>,<span class="num">5.19</span>,<span class="num">2.39</span>,<span class="num">3.66</span>,<span class="num">2.29</span>,<span class="num">2.88</span>])
minor_profile = np.<span class="fn">array</span>([<span class="num">6.33</span>,<span class="num">2.68</span>,<span class="num">3.52</span>,<span class="num">5.38</span>,<span class="num">2.60</span>,<span class="num">3.53</span>,<span class="num">2.54</span>,<span class="num">4.75</span>,<span class="num">3.98</span>,<span class="num">2.69</span>,<span class="num">3.34</span>,<span class="num">3.17</span>])

scores = []
<span class="kw">for</span> shift <span class="kw">in</span> <span class="fn">range</span>(<span class="num">12</span>):
    scores.<span class="fn">append</span>((<span class="str">"maj"</span>, shift, np.<span class="fn">corrcoef</span>(np.<span class="fn">roll</span>(major_profile, shift), chroma_mean)[<span class="num">0</span>,<span class="num">1</span>]))
    scores.<span class="fn">append</span>((<span class="str">"min"</span>, shift, np.<span class="fn">corrcoef</span>(np.<span class="fn">roll</span>(minor_profile, shift), chroma_mean)[<span class="num">0</span>,<span class="num">1</span>]))

best = <span class="fn">max</span>(scores, key=<span class="kw">lambda</span> x: x[<span class="num">2</span>])
keys = [<span class="str">"C"</span>,<span class="str">"C#"</span>,<span class="str">"D"</span>,<span class="str">"D#"</span>,<span class="str">"E"</span>,<span class="str">"F"</span>,<span class="str">"F#"</span>,<span class="str">"G"</span>,<span class="str">"G#"</span>,<span class="str">"A"</span>,<span class="str">"A#"</span>,<span class="str">"B"</span>]
<span class="fn">print</span>(f<span class="str">"Estimated key: {keys[best[1]]} {best[0]}"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a chromagram via constant-Q transform (musically aligned). 2) Averages it over time. 3) Correlates the chroma profile against 24 shifted templates (12 major + 12 minor). 4) Picks the best-matching key.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Audio Fingerprinting (Shazam)</h2>
<p class="l-text">Shazam's trick: from a spectrogram, pick prominent peaks (anchors). Hash pairs of peaks (anchor + target within a time window) into compact fingerprints. To match, hash the query and look up hashes in a database — songs with many matching hashes at consistent time offsets win.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Anchor peak</div><div class="card-body">Local max in spectrogram — robust to noise.</div></div>
<div class="calc-card"><div class="card-title">Target peak</div><div class="card-body">Another peak within a small time/frequency box.</div></div>
<div class="calc-card"><div class="card-title">Hash</div><div class="card-body">(f_anchor, f_target, dt) packed into 32 bits.</div></div>
<div class="calc-card"><div class="card-title">Match</div><div class="card-body">Histogram of time offsets — peak in histogram = song.</div></div>
</div>
<p class="l-text">Robust to compression, background noise, and partial clips because peaks survive distortion better than full spectrograms.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Genre Classification</h2>
<p class="l-text">Classic pipeline: extract MFCCs + tempo + chroma stats → average over time → feed to a classifier. Modern pipeline: spectrogram → CNN (e.g. on GTZAN, FMA datasets).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">features</span>(y, sr):
    mfcc = librosa.feature.<span class="fn">mfcc</span>(y=y, sr=sr, n_mfcc=<span class="num">20</span>).<span class="fn">mean</span>(axis=<span class="num">1</span>)
    chroma = librosa.feature.<span class="fn">chroma_stft</span>(y=y, sr=sr).<span class="fn">mean</span>(axis=<span class="num">1</span>)
    contrast = librosa.feature.<span class="fn">spectral_contrast</span>(y=y, sr=sr).<span class="fn">mean</span>(axis=<span class="num">1</span>)
    tempo, _ = librosa.beat.<span class="fn">beat_track</span>(y=y, sr=sr)
    <span class="kw">return</span> np.<span class="fn">concatenate</span>([mfcc, chroma, contrast, [tempo]])

<span class="cm"># Then: train sklearn RandomForest / SVM on (features, label) pairs</span>
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
clf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">200</span>).<span class="fn">fit</span>(X_train, y_train)
<span class="fn">print</span>(<span class="str">"Test acc:"</span>, clf.<span class="fn">score</span>(X_test, y_test))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Extracts a 36-dim feature vector per song (MFCCs + chroma + contrast + tempo). 2) Trains a Random Forest on labelled examples. 3) Reports held-out accuracy. On GTZAN this hits ~70%; modern CNNs push 85%+.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Tempogram Visualization</h2>
<p class="l-text">A tempogram shows tempo strength over time — useful for songs with tempo changes.</p>
<div id="audio-l9-graph-en" style="height:380px;width:100%"></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Real-World Applications</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DJ software</div><div class="card-body">Auto-BPM, key matching for harmonic mixing (Camelot wheel).</div></div>
<div class="calc-card"><div class="card-title">Spotify recs</div><div class="card-body">Audio embeddings + collaborative filtering.</div></div>
<div class="calc-card"><div class="card-title">Music education</div><div class="card-body">Auto chord transcription for guitar tabs.</div></div>
<div class="calc-card"><div class="card-title">Copyright</div><div class="card-body">YouTube Content ID — fingerprint matching at scale.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Tempo = 60 / mean beat spacing. librosa.beat.beat_track does the heavy lifting.<br><strong>2.</strong> Chromagram folds spectrum into 12 pitch classes — perfect for key detection.<br><strong>3.</strong> Shazam = spectrogram peaks → hash pairs → time-offset histogram match.<br><strong>4.</strong> Genre classification: MFCC+chroma+tempo features → RF/SVM, or spectrogram → CNN.<br><strong>5.</strong> MIR powers DJ tools, recommendations, copyright detection, and music education.</div></div>
</div>

<script>setTimeout(function(){
  var T = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var bg = T ? '#0e1117' : '#ffffff';
  var fg = T ? '#e6e8ee' : '#1c1f26';
  var times = [];
  var bpms = [];
  for (var i=0;i<60;i++){ times.push(i); bpms.push(120 + 8*Math.sin(i/8) + (Math.random()-0.5)*3); }
  var data = [{x:times, y:bpms, type:'scatter', mode:'lines', line:{color:'#c8a96e', width:2}, name:'Tempo'}];
  var layout = {paper_bgcolor:bg, plot_bgcolor:bg, font:{color:fg}, margin:{t:30,r:20,b:50,l:60}, xaxis:{title:'Time (s)'}, yaxis:{title:'BPM'}, title:'Tempogram (estimated tempo over time)'};
  if (document.getElementById('audio-l9-graph-en')) Plotly.newPlot('audio-l9-graph-en', data, layout, {displayModeBar:false});
  if (document.getElementById('audio-l9-graph-tr')) Plotly.newPlot('audio-l9-graph-tr', data, layout, {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Shazam bir şarkıyı 3 saniyede tanır. Spotify türü otomatik etiketler. DJ'ler BPM'leri canlı eşler.</strong> Hepsi Müzik Bilgi Erişimi (MIR) görevidir — sesten yapı çıkarma.</p>
<p class="l-text">Bu derste librosa ve temel spektrogram numaralarıyla beat tespiti, ton/akor algılama, ses parmak izi ve tür sınıflandırma öğreneceksin.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>librosa.beat.beat_track ile tempo ve beat konumlarını kestireceksin</li>
<li>Kromagram hesaplayıp Krumhansl-Schmuckler profiliyle ton çıkaracaksın</li>
<li>Constellation map peak hash'leriyle Shazam tarzı ses parmak izi kuracaksın</li>
<li>GTZAN log-mel özniteliklerinde minik bir tür sınıflandırıcı eğiteceksin</li>
<li>Tempo kaymasını yakalamak için tempogram görselleştireceksin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. MIR Nedir?</h2>
<p class="l-text">Müzik Bilgi Erişimi, ham dalga formundan müziksel öznitelikleri çekip çıkarma alanıdır: tempo, ton, akorlar, beatler, tür, ruh hali ve benzerlik.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tempo</div><div class="card-body">Dakikadaki vuruş (BPM). Pop'ta sabit, klasik/caz'da değişken.</div></div>
<div class="calc-card"><div class="card-title">Ton</div><div class="card-body">Tonal merkez (örn. Do majör, La minör). 24 olası ton.</div></div>
<div class="calc-card"><div class="card-title">Akor</div><div class="card-body">Bir andaki üçlü/yedili armoni. Dizi şeklinde gidiş oluşturur.</div></div>
<div class="calc-card"><div class="card-title">Tür</div><div class="card-body">Yüksek seviye etiket (rock/caz/klasik). Spektral özniteliklerden tahmin edilir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Beat Takibi ve Tempo</h2>
<p class="l-text">Tempo, ortalama beat-arası süresinin tersidir. Beatler \\(t_1, t_2, \\dots\\) zamanlarında geliyorsa:</p>
<div class="katex-block">$$\\text{BPM} = \\frac{60}{\\bar{T}_{\\text{beat}}}, \\qquad \\bar{T}_{\\text{beat}} = \\frac{1}{N-1}\\sum_{i=1}^{N-1}(t_{i+1}-t_i)$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">\\(t_i\\)</div><div class="card-body">i. tespit edilen beat'in zamanı (saniye).</div></div>
<div class="calc-card"><div class="card-title">\\(\\bar{T}_{\\text{beat}}\\)</div><div class="card-body">Ardışık beatler arası ortalama mesafe.</div></div>
<div class="calc-card"><div class="card-title">BPM</div><div class="card-body">Tempo: 60 saniye bölü ortalama beat aralığı.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

y, sr = librosa.<span class="fn">load</span>(<span class="str">"sarki.wav"</span>, sr=<span class="num">22050</span>)

<span class="cm"># Onset zarfı: enerjinin yükseldiği yerler (vuruşlar, ataklar)</span>
onset_env = librosa.onset.<span class="fn">onset_strength</span>(y=y, sr=sr)

<span class="cm"># Beat takipçisi onset zarfı üzerinde dinamik programlama yapar</span>
tempo, beat_frames = librosa.beat.<span class="fn">beat_track</span>(onset_envelope=onset_env, sr=sr)
beat_times = librosa.<span class="fn">frames_to_time</span>(beat_frames, sr=sr)

<span class="fn">print</span>(f<span class="str">"Tahmini tempo: {tempo:.1f} BPM"</span>)
<span class="fn">print</span>(f<span class="str">"İlk 5 beat zamanı: {beat_times[:5]}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">MIR: tempo + onset detection without librosa. Use spectral flux + autocorrelation.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=384)
S = np.abs(Z)
flux = np.maximum(0, np.diff(S, axis=1)).sum(axis=0)
ac = np.correlate(flux - flux.mean(), flux - flux.mean(), mode='full')[len(flux)-1:]
ac[:5] = 0
lag = int(np.argmax(ac[:60]))
frame_dt = (t[1] - t[0]) if len(t) &gt; 1 else 0.016
bpm = 60 / max(lag * frame_dt, 1e-6)
print('Onset frames :', flux.shape[0])
print('Estimated BPM:', round(float(bpm), 1))
print('Onset frames &gt; median:', int((flux &gt; np.median(flux)).sum()))</code></pre></div>
</div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Sesi 22050 Hz'de yükler (MIR standardı). 2) Onset gücünü hesaplar — ritmik olaylarda zirve yapan 1B sinyal. 3) <code>beat_track</code> onset zarfında dinamik programlama çalıştırır, küresel tempoyla tutarlı bir beat dizisi bulur. 4) Kare indekslerini saniyeye çevirir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Kromagram ve Ton Tespiti</h2>
<p class="l-text">Kromagram, oktav fark etmeksizin spektrumu 12 perde sınıfına (Do, Do#, Re, ..., Si) katlar. Şarkı boyunca toplandığında hangi perdelerin baskın olduğunu gösterir — ton için bir parmak izidir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>chroma = librosa.feature.<span class="fn">chroma_cqt</span>(y=y, sr=sr)  <span class="cm"># şekil (12, T)</span>

<span class="cm"># Tüm parça boyunca chroma ortalaması</span>
chroma_mean = chroma.<span class="fn">mean</span>(axis=<span class="num">1</span>)

<span class="cm"># Krumhansl-Schmuckler ton profilleri (korelasyon tabanlı)</span>
major_profile = np.<span class="fn">array</span>([<span class="num">6.35</span>,<span class="num">2.23</span>,<span class="num">3.48</span>,<span class="num">2.33</span>,<span class="num">4.38</span>,<span class="num">4.09</span>,<span class="num">2.52</span>,<span class="num">5.19</span>,<span class="num">2.39</span>,<span class="num">3.66</span>,<span class="num">2.29</span>,<span class="num">2.88</span>])
minor_profile = np.<span class="fn">array</span>([<span class="num">6.33</span>,<span class="num">2.68</span>,<span class="num">3.52</span>,<span class="num">5.38</span>,<span class="num">2.60</span>,<span class="num">3.53</span>,<span class="num">2.54</span>,<span class="num">4.75</span>,<span class="num">3.98</span>,<span class="num">2.69</span>,<span class="num">3.34</span>,<span class="num">3.17</span>])

scores = []
<span class="kw">for</span> shift <span class="kw">in</span> <span class="fn">range</span>(<span class="num">12</span>):
    scores.<span class="fn">append</span>((<span class="str">"maj"</span>, shift, np.<span class="fn">corrcoef</span>(np.<span class="fn">roll</span>(major_profile, shift), chroma_mean)[<span class="num">0</span>,<span class="num">1</span>]))
    scores.<span class="fn">append</span>((<span class="str">"min"</span>, shift, np.<span class="fn">corrcoef</span>(np.<span class="fn">roll</span>(minor_profile, shift), chroma_mean)[<span class="num">0</span>,<span class="num">1</span>]))

best = <span class="fn">max</span>(scores, key=<span class="kw">lambda</span> x: x[<span class="num">2</span>])
keys = [<span class="str">"Do"</span>,<span class="str">"Do#"</span>,<span class="str">"Re"</span>,<span class="str">"Re#"</span>,<span class="str">"Mi"</span>,<span class="str">"Fa"</span>,<span class="str">"Fa#"</span>,<span class="str">"Sol"</span>,<span class="str">"Sol#"</span>,<span class="str">"La"</span>,<span class="str">"La#"</span>,<span class="str">"Si"</span>]
<span class="fn">print</span>(f<span class="str">"Tahmini ton: {keys[best[1]]} {best[0]}"</span>)</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Sabit-Q dönüşümü ile kromagram kurar (müziksel hizalı). 2) Zaman üzerinde ortalar. 3) Chroma profilini 24 kaydırılmış şablona (12 majör + 12 minör) karşı korelasyona sokar. 4) En iyi eşleşen tonu seçer.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Ses Parmak İzi (Shazam)</h2>
<p class="l-text">Shazam'ın hilesi: spektrogramdan belirgin zirveler (çapalar) seç. Zirve çiftlerini (çapa + küçük zaman penceresinde hedef) kompakt parmak izlerine hashle. Eşleştirmek için sorguyu hashle ve veritabanında ara — tutarlı zaman ofsetinde çok eşleşen şarkı kazanır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çapa zirvesi</div><div class="card-body">Spektrogramda yerel maksimum — gürültüye dayanıklı.</div></div>
<div class="calc-card"><div class="card-title">Hedef zirve</div><div class="card-body">Küçük bir zaman/frekans kutusu içindeki başka zirve.</div></div>
<div class="calc-card"><div class="card-title">Hash</div><div class="card-body">(f_çapa, f_hedef, dt) 32 bite paketlenir.</div></div>
<div class="calc-card"><div class="card-title">Eşleşme</div><div class="card-body">Zaman ofset histogramı — histogramdaki zirve = şarkı.</div></div>
</div>
<p class="l-text">Sıkıştırma, arka plan gürültüsü ve kısmi kliplere dayanıklı çünkü zirveler tam spektrogramlardan daha iyi ayakta kalır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tür Sınıflandırma</h2>
<p class="l-text">Klasik pipeline: MFCC + tempo + chroma istatistikleri çıkar → zaman üzerinde ortalı → sınıflandırıcıya ver. Modern pipeline: spektrogram → CNN (örn. GTZAN, FMA veri kümelerinde).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">features</span>(y, sr):
    mfcc = librosa.feature.<span class="fn">mfcc</span>(y=y, sr=sr, n_mfcc=<span class="num">20</span>).<span class="fn">mean</span>(axis=<span class="num">1</span>)
    chroma = librosa.feature.<span class="fn">chroma_stft</span>(y=y, sr=sr).<span class="fn">mean</span>(axis=<span class="num">1</span>)
    contrast = librosa.feature.<span class="fn">spectral_contrast</span>(y=y, sr=sr).<span class="fn">mean</span>(axis=<span class="num">1</span>)
    tempo, _ = librosa.beat.<span class="fn">beat_track</span>(y=y, sr=sr)
    <span class="kw">return</span> np.<span class="fn">concatenate</span>([mfcc, chroma, contrast, [tempo]])

<span class="cm"># Sonra: (öznitelik, etiket) çiftleriyle sklearn RandomForest / SVM eğit</span>
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
clf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">200</span>).<span class="fn">fit</span>(X_train, y_train)
<span class="fn">print</span>(<span class="str">"Test başarımı:"</span>, clf.<span class="fn">score</span>(X_test, y_test))</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Şarkı başına 36 boyutlu öznitelik vektörü çıkarır (MFCC + chroma + kontrast + tempo). 2) Etiketli örneklerle Random Forest eğitir. 3) Bekletilen test başarımını raporlar. GTZAN'da ~%70 elde eder; modern CNN'ler %85+ çıkar.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Tempogram Görselleştirmesi</h2>
<p class="l-text">Tempogram, tempo gücünü zaman boyunca gösterir — tempo değişen şarkılar için faydalı.</p>
<div id="audio-l9-graph-tr" style="height:380px;width:100%"></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Gerçek Dünya Uygulamaları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DJ yazılımı</div><div class="card-body">Otomatik BPM, harmonik miks için ton eşleme (Camelot çarkı).</div></div>
<div class="calc-card"><div class="card-title">Spotify önerileri</div><div class="card-body">Ses gömmeleri + işbirlikçi filtreleme.</div></div>
<div class="calc-card"><div class="card-title">Müzik eğitimi</div><div class="card-body">Gitar tabları için otomatik akor transkripsiyonu.</div></div>
<div class="calc-card"><div class="card-title">Telif</div><div class="card-body">YouTube Content ID — büyük ölçekte parmak izi eşleme.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Tempo = 60 / ortalama beat aralığı. librosa.beat.beat_track ağır işi yapar.<br><strong>2.</strong> Kromagram spektrumu 12 perde sınıfına katlar — ton tespiti için mükemmel.<br><strong>3.</strong> Shazam = spektrogram zirveleri → hash çiftleri → zaman-ofset histogram eşleşmesi.<br><strong>4.</strong> Tür sınıflandırma: MFCC+chroma+tempo öznitelikleri → RF/SVM, ya da spektrogram → CNN.<br><strong>5.</strong> MIR DJ araçlarına, önerilere, telif tespitine ve müzik eğitimine güç verir.</div></div>
</div>

<script>setTimeout(function(){
  var T = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var bg = T ? '#0e1117' : '#ffffff';
  var fg = T ? '#e6e8ee' : '#1c1f26';
  var times = [];
  var bpms = [];
  for (var i=0;i<60;i++){ times.push(i); bpms.push(120 + 8*Math.sin(i/8) + (Math.random()-0.5)*3); }
  var data = [{x:times, y:bpms, type:'scatter', mode:'lines', line:{color:'#c8a96e', width:2}, name:'Tempo'}];
  var layout = {paper_bgcolor:bg, plot_bgcolor:bg, font:{color:fg}, margin:{t:30,r:20,b:50,l:60}, xaxis:{title:'Zaman (s)'}, yaxis:{title:'BPM'}, title:'Tempogram (zaman boyunca tahmini tempo)'};
  if (document.getElementById('audio-l9-graph-en')) Plotly.newPlot('audio-l9-graph-en', data, layout, {displayModeBar:false});
  if (document.getElementById('audio-l9-graph-tr')) Plotly.newPlot('audio-l9-graph-tr', data, layout, {displayModeBar:false});
}, 250);</script>`
};
