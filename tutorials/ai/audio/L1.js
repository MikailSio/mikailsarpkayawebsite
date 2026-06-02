window.AUDIO_L1 = {

en: `<p class="l-text"><strong>Sound is a continuous wave; computers only handle numbers.</strong> Every audio file you have ever played started as air pressure variations, was sampled thousands of times per second, quantized into integers, and stored on disk. Understanding how this conversion works is the foundation of every audio task -- speech recognition, music generation, voice cloning, podcast transcription, all of it.</p>

<p class="l-text">This lesson covers the digital sound 101 every audio engineer and ML practitioner needs: sample rate, bit depth, channels, file formats (WAV, MP3, FLAC, OGG), and the Python tools (librosa, scipy, soundfile) for loading and manipulating audio. By the end you can load any audio file, inspect its properties, plot its waveform, resample it, and save it back -- the prerequisites for every later lesson.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain sampling, quantization, and how a microphone becomes integer arrays</li>
<li>Apply the Nyquist theorem to pick a sample rate that avoids aliasing</li>
<li>Compare WAV, MP3, FLAC, and OGG by codec, bitrate, and lossy vs lossless</li>
<li>Load and inspect audio with librosa, scipy.io.wavfile, and soundfile</li>
<li>Plot a waveform, resample 44.1kHz to 16kHz, and save back to disk</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. How Does a Computer "Hear"?</h2>

<p class="l-text">When you speak, your vocal cords vibrate the air. Those vibrations are continuous pressure waves -- analog signals. A microphone converts the pressure into a continuous voltage. To get this into a computer, two discretizations happen: <em>sampling</em> in time (measure the voltage N times per second) and <em>quantization</em> in amplitude (round each measurement to a finite number of integer levels).</p>

<div class="calc-highlight"><strong>Digital audio is just a long array of numbers.</strong> A 1-second mono recording at 16 kHz with 16-bit depth is a 1D array of 16000 int16 values. That is it. Every algorithm in this course operates on arrays of this kind.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sample rate</div><div class="card-body">Samples per second, in Hz. Telephone: 8000. Speech-to-text: 16000. CD: 44100. Studio: 48000 or 96000.</div></div>
<div class="calc-card"><div class="card-title">Bit depth</div><div class="card-body">Bits per sample. 16-bit = 65536 levels (CD quality). 24-bit = pro recording. 32-bit float = internal processing.</div></div>
<div class="calc-card"><div class="card-title">Channels</div><div class="card-body">Mono = 1 stream. Stereo = 2 (left + right). 5.1 = 6 streams. ML almost always uses mono.</div></div>
<div class="calc-card"><div class="card-title">Duration</div><div class="card-body">Length in seconds = num_samples / sample_rate. A 16000-sample clip at 16 kHz is 1.0 second.</div></div>
<div class="calc-card"><div class="card-title">Amplitude</div><div class="card-body">Loudness. In float audio it is normalized to [-1.0, 1.0]. In int16 it is [-32768, 32767].</div></div>
<div class="calc-card"><div class="card-title">Frequency</div><div class="card-body">How fast the wave oscillates, in Hz. Bass guitar: 40-400 Hz. Speech fundamental: 80-300 Hz. Cymbals: up to 16000 Hz.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: a 16 kHz audio file</div><div class="example-body">You record yourself saying "hello" for 1.5 seconds at 16 kHz, mono, 16-bit. The resulting file holds <code>1.5 * 16000 = 24000</code> samples, each a 16-bit integer. Raw size: <code>24000 * 2 bytes = 48 KB</code>. The first sample might be 12, the next 47, then 130, then -200, oscillating thousands of times per second to encode the waveform of your voice.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Nyquist Theorem</h2>

<p class="l-text">How many samples per second do you actually need? The answer is one of the most important results in signal processing.</p>

<div class="katex-block">$$f_s \\geq 2 f_{\\max}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">f_s</div><div class="card-body">Sampling rate (samples per second, Hz). What you choose when recording.</div></div>
<div class="calc-card"><div class="card-title">f_max</div><div class="card-body">Highest frequency present in the signal you want to preserve.</div></div>
<div class="calc-card"><div class="card-title">Nyquist frequency</div><div class="card-body">f_s / 2. The maximum frequency that can be represented at sample rate f_s.</div></div>
<div class="calc-card"><div class="card-title">Aliasing</div><div class="card-body">If the signal contains frequencies above f_s/2, they fold back into the audible band as ghost tones.</div></div>
<div class="calc-card"><div class="card-title">Anti-alias filter</div><div class="card-body">Low-pass filter applied before sampling to remove energy above f_s/2.</div></div>
<div class="calc-card"><div class="card-title">Why 44.1 kHz?</div><div class="card-body">Human hearing tops out around 20 kHz. 44.1 kHz gives a 22.05 kHz Nyquist with margin for the anti-alias filter.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: why 16 kHz is enough for speech</div><div class="example-body">Almost all phonetic information in human speech sits below 8 kHz; sibilants like "s" and "f" reach the highest. A 16 kHz sample rate captures everything up to 8 kHz exactly (Nyquist). That is why every speech model -- Whisper, wav2vec, HuBERT -- uses 16 kHz mono input. It throws away nothing important and halves the data compared to 32 kHz.</div></div>

<div class="l-note"><strong>Practical rule:</strong> resample everything to 16 kHz mono for ML pipelines unless you specifically need higher fidelity (music generation, voice cloning).</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. File Formats: WAV, MP3, FLAC, OGG</h2>

<p class="l-text">A file format is a container that stores the sample array plus metadata (sample rate, channels, bit depth). Formats differ in how they compress -- or do not -- the samples.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">WAV (.wav)</div><div class="compare-item">Uncompressed PCM</div><div class="compare-item">Lossless, exact bit-for-bit</div><div class="compare-item">Big files (10 MB per minute at 44.1 kHz stereo)</div><div class="compare-item">Standard for ML training data</div></div>
<div class="compare-col"><div class="compare-title">MP3 (.mp3)</div><div class="compare-item">Lossy psychoacoustic compression</div><div class="compare-item">10x smaller than WAV at 128 kbps</div><div class="compare-item">Audible artifacts at low bitrates</div><div class="compare-item">Avoid for training, fine for streaming</div></div>
<div class="compare-col"><div class="compare-title">FLAC (.flac)</div><div class="compare-item">Lossless compression</div><div class="compare-item">~50% smaller than WAV, perfect reconstruction</div><div class="compare-item">Slower to decode than WAV</div><div class="compare-item">Best of both worlds for archives</div></div>
<div class="compare-col"><div class="compare-title">OGG (.ogg/.opus)</div><div class="compare-item">Open lossy (Vorbis or Opus)</div><div class="compare-item">Better quality than MP3 at same bitrate</div><div class="compare-item">Opus excels for speech (low-latency streaming)</div><div class="compare-item">Used by WhatsApp, Discord</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: format choice for a podcast pipeline</div><div class="example-body">You scrape 1000 hours of podcasts (MP3 at 128 kbps) for a speech model. First, decode each MP3 to a numpy array. Resample to 16 kHz mono. Save the cleaned dataset as FLAC -- lossless from this point on, ~5 GB instead of 10 GB if you stored WAV. During training, load FLAC -> int16 -> float32 in [-1, 1]. Model sees the same numbers regardless of original container.</div></div>

<div class="l-warn"><strong>Pitfall:</strong> Repeated MP3 re-encoding (decode -> save MP3 -> decode -> save MP3) accumulates artifacts on each round trip. Always keep a lossless master and only encode lossy as a final delivery step.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Loading Audio in Python</h2>

<p class="l-text">Three libraries cover almost all needs: <code>librosa</code> (the ML standard, auto-resamples and converts to mono float32), <code>soundfile</code> (fast, exact, supports many formats), and <code>scipy.io.wavfile</code> (zero-dependency for WAV).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install librosa soundfile scipy numpy</span>
<span class="kw">import</span> librosa
<span class="kw">import</span> soundfile <span class="kw">as</span> sf
<span class="kw">from</span> scipy.io <span class="kw">import</span> wavfile
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) librosa: the ML default. Returns float32 in [-1, 1], mono, target sr.</span>
y, sr = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
<span class="fn">print</span>(y.shape, y.dtype, sr)        <span class="cm"># (24000,) float32 16000</span>
<span class="fn">print</span>(<span class="str">"duration:"</span>, <span class="fn">len</span>(y) / sr, <span class="str">"s"</span>)
<span class="fn">print</span>(<span class="str">"min/max:"</span>, y.<span class="fn">min</span>(), y.<span class="fn">max</span>())  <span class="cm"># roughly within [-1, 1]</span>

<span class="cm"># sr=None preserves the original rate; recommended when you want exact data.</span>
y_orig, sr_orig = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="kw">None</span>)
<span class="fn">print</span>(<span class="str">"original sr:"</span>, sr_orig)

<span class="cm"># 2) soundfile: faster, exact, no automatic resampling</span>
y_sf, sr_sf = sf.<span class="fn">read</span>(<span class="str">"speech.wav"</span>, dtype=<span class="str">"float32"</span>)
<span class="fn">print</span>(y_sf.shape, sr_sf)
<span class="cm"># For stereo files: shape (N, 2). For mono: shape (N,)</span>

<span class="cm"># 3) scipy: lowest level, returns int16 directly</span>
sr_sp, y_sp = wavfile.<span class="fn">read</span>(<span class="str">"speech.wav"</span>)
<span class="fn">print</span>(y_sp.dtype, y_sp.shape, sr_sp)   <span class="cm"># int16 (24000,) 16000</span>

<span class="cm"># Convert int16 to float32 in [-1, 1]</span>
y_float = y_sp.<span class="fn">astype</span>(np.float32) / <span class="num">32768.0</span>
<span class="fn">print</span>(y_float.<span class="fn">min</span>(), y_float.<span class="fn">max</span>())</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pyodide preamble already exposes a 1-second 16 kHz sine \`audio\` (440 Hz) and \`sr=16000\`. We replicate the librosa.load API: shape, dtype, duration.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
# 'audio' (float32) and 'sr' (16000) are pre-loaded by the Pyodide preamble.
y = audio
duration = len(y) / sr
print('shape:', y.shape, '  dtype:', y.dtype)
print('sample rate:', sr, 'Hz   duration:', round(duration, 3), 's')
print('min/max amplitude:', round(float(y.min()), 4), round(float(y.max()), 4))
print('mean abs (RMS-ish):', round(float(np.abs(y).mean()), 4))
print('first 8 samples:', np.round(y[:8], 4))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>librosa.load</code> with <code>sr=16000</code> resamples the file to 16 kHz on the fly, mixes down to mono if stereo, and returns float32 normalized to roughly [-1, 1]. This is the standard ML loading idiom. 2) Passing <code>sr=None</code> preserves the file's native rate, useful when you want to inspect the raw data without librosa modifying it. 3) <code>soundfile.read</code> is faster than librosa and does not touch the data; it returns whatever the file contains. For stereo, the shape is (N, 2); for mono it is (N,). 4) <code>scipy.io.wavfile.read</code> is the lowest-overhead path for plain WAV files; it returns the int16 data directly. 5) Converting int16 to float by dividing by 32768 puts the data in the [-1, 1] range that ML models expect.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">librosa.load</div><div class="card-body">Auto-resample, auto-mono, float32. Best for ML training pipelines.</div></div>
<div class="calc-card"><div class="card-title">soundfile.read</div><div class="card-body">Fast, exact, supports WAV/FLAC/OGG. Best for inspection and lossless workflows.</div></div>
<div class="calc-card"><div class="card-title">scipy.wavfile</div><div class="card-body">Stdlib-friendly, returns int16. Use only for simple WAV.</div></div>
<div class="calc-card"><div class="card-title">torchaudio.load</div><div class="card-body">PyTorch-native, returns a tensor. Use when feeding directly into a torch model.</div></div>
<div class="calc-card"><div class="card-title">pydub</div><div class="card-body">Convenience wrapper over ffmpeg. Good for cutting/concatenating, slow for batch.</div></div>
<div class="calc-card"><div class="card-title">ffmpeg-python</div><div class="card-body">For exotic containers (mp4 with audio track, m4a, webm). Decodes anything.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Plotting a Waveform</h2>

<p class="l-text">A waveform is the most direct visualization of audio: x-axis is time, y-axis is amplitude. You can see silence, loudness, and rough shape (single voice vs music) at a glance.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"trumpet"</span>), sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
<span class="fn">print</span>(y.shape, sr, <span class="fn">len</span>(y) / sr, <span class="str">"s"</span>)

<span class="cm"># Time axis in seconds for plotting</span>
t = np.<span class="fn">arange</span>(<span class="fn">len</span>(y)) / sr

plt.<span class="fn">figure</span>(figsize=(<span class="num">10</span>, <span class="num">3</span>))
plt.<span class="fn">plot</span>(t, y, linewidth=<span class="num">0.6</span>)
plt.<span class="fn">xlabel</span>(<span class="str">"time (s)"</span>)
plt.<span class="fn">ylabel</span>(<span class="str">"amplitude"</span>)
plt.<span class="fn">title</span>(<span class="str">"Waveform"</span>)
plt.<span class="fn">tight_layout</span>()
plt.<span class="fn">show</span>()

<span class="cm"># Quick stats every audio engineer checks</span>
<span class="fn">print</span>(<span class="str">"peak amplitude:"</span>, np.<span class="fn">abs</span>(y).<span class="fn">max</span>())
<span class="fn">print</span>(<span class="str">"RMS:"</span>, np.<span class="fn">sqrt</span>(np.<span class="fn">mean</span>(y**<span class="num">2</span>)))
<span class="fn">print</span>(<span class="str">"dB peak:"</span>, <span class="num">20</span> * np.<span class="fn">log10</span>(np.<span class="fn">abs</span>(y).<span class="fn">max</span>() + <span class="num">1e-10</span>))</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Plot statistics that you would normally read from a librosa waveplot: peak, RMS, zero-crossing rate.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
y = audio
peak = float(np.max(np.abs(y)))
rms  = float(np.sqrt(np.mean(y**2)))
zcr  = float(np.mean(np.abs(np.diff(np.sign(y)))) / 2.0)
print('Peak amplitude :', round(peak, 4))
print('RMS energy     :', round(rms, 4))
print('Zero-crossing rate (per sample):', round(zcr, 5))
print('Estimated frequency from ZCR:', round(zcr * sr, 1), 'Hz  (true=440)')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads librosa's bundled trumpet example, resampling to 16 kHz mono so it matches the ML conventions of every later lesson. 2) Builds a time axis: sample i lands at second <code>i / sr</code>. This is what you plot on the x-axis. 3) Plots amplitude over time. The waveform looks dense because there are 16000 samples per second; matplotlib draws every one. 4) Computes peak amplitude (the loudest single sample) and RMS (root mean square, related to perceived loudness). 5) Converts peak to dB; 0 dB is full scale (amplitude 1.0), -20 dB is 0.1, -40 dB is 0.01. Voice activity typically lives between -30 and -10 dB peak.</p>

<div id="plot-al1-wave-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A synthetic waveform of three tones at 220 Hz, 440 Hz, and 880 Hz played in sequence. Each tone sustains for 0.3 seconds. You can see the amplitude envelope (silence between notes) and, if you zoom in mentally, the increasing oscillation density of higher pitches. This is the time-domain view -- when something happens. The next lesson moves to the frequency domain, which reveals what is happening.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Resampling and Saving</h2>

<p class="l-text">Almost every dataset you download is at the wrong sample rate, the wrong number of channels, or the wrong bit depth for your model. Resampling fixes the first; <code>np.mean(axis=1)</code> fixes the second; saving with the right dtype fixes the third.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> soundfile <span class="kw">as</span> sf
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) Load at original rate</span>
y, sr = librosa.<span class="fn">load</span>(<span class="str">"input.wav"</span>, sr=<span class="kw">None</span>, mono=<span class="kw">False</span>)
<span class="fn">print</span>(<span class="str">"original sr:"</span>, sr, <span class="str">"shape:"</span>, y.shape)
<span class="cm"># Stereo files come back as (2, N); mono as (N,)</span>

<span class="cm"># 2) Stereo to mono by averaging channels</span>
<span class="kw">if</span> y.ndim == <span class="num">2</span>:
    y = y.<span class="fn">mean</span>(axis=<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">"mono shape:"</span>, y.shape)

<span class="cm"># 3) Resample to 16 kHz</span>
y_16 = librosa.<span class="fn">resample</span>(y, orig_sr=sr, target_sr=<span class="num">16000</span>)
<span class="fn">print</span>(<span class="str">"resampled:"</span>, y_16.shape, <span class="num">16000</span>)

<span class="cm"># 4) Save as 16-bit WAV (the ML standard)</span>
sf.<span class="fn">write</span>(<span class="str">"out_16k.wav"</span>, y_16, samplerate=<span class="num">16000</span>, subtype=<span class="str">"PCM_16"</span>)

<span class="cm"># 5) Save as FLAC (lossless, ~50% smaller)</span>
sf.<span class="fn">write</span>(<span class="str">"out_16k.flac"</span>, y_16, samplerate=<span class="num">16000</span>)

<span class="cm"># 6) Optional: peak normalize so the loudest sample is exactly 0.99</span>
peak = np.<span class="fn">abs</span>(y_16).<span class="fn">max</span>()
<span class="kw">if</span> peak &gt; <span class="num">0</span>:
    y_norm = y_16 * (<span class="num">0.99</span> / peak)
sf.<span class="fn">write</span>(<span class="str">"out_norm.wav"</span>, y_norm, samplerate=<span class="num">16000</span>, subtype=<span class="str">"PCM_16"</span>)

<span class="cm"># 7) Convert to int16 manually if you need raw bytes</span>
y_i16 = (y_16 * <span class="num">32767</span>).<span class="fn">astype</span>(np.int16)
<span class="fn">print</span>(y_i16.dtype, y_i16.<span class="fn">min</span>(), y_i16.<span class="fn">max</span>())</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">scipy.signal.resample_poly is the in-browser equivalent of librosa resampling. We downsample 16 kHz → 8 kHz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
y = audio                       # 16 kHz mono
y_8k = signal.resample_poly(y, up=1, down=2)   # → 8 kHz
print('original :', y.shape, '@', sr, 'Hz')
print('resampled:', y_8k.shape, '@', sr // 2, 'Hz')
# Fake stereo, then collapse to mono
stereo = np.stack([y, y * 0.7], axis=1)
mono = stereo.mean(axis=1)
print('stereo →', stereo.shape, '   mono →', mono.shape)</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads the input file at its native rate so we can see what we are working with. <code>mono=False</code> preserves stereo channels separately. 2) If the file is stereo (2 rows), averages the two channels to make mono. Most ML models want mono. 3) <code>librosa.resample</code> applies a high-quality polyphase filter to change the sample rate -- this is much better than dropping or duplicating samples naively. The output has length <code>len(y) * target_sr / orig_sr</code>. 4) <code>soundfile.write</code> saves as 16-bit PCM WAV, the universal "boring" format every tool reads. 5) FLAC achieves the same quality at roughly half the size. 6) Peak normalization rescales so the loudest moment is at -0.09 dB (just under full scale), preventing clipping when downstream tools apply gain. 7) Manual int16 conversion is sometimes needed for low-level APIs; multiply by 32767 (not 32768!) to avoid overflow on the most negative sample.</p>

<div class="l-note"><strong>Quality tip:</strong> librosa's default resampler is "soxr_hq". For batch jobs you can use <code>res_type="kaiser_fast"</code> (3-4x faster, slightly lower quality) -- still better than naive resampling.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: a real preprocessing function</div><div class="example-body">A typical dataset preprocessing function: <code>def prep(path): y, sr = librosa.load(path, sr=16000, mono=True); peak = np.abs(y).max(); y = y * (0.99 / peak) if peak &gt; 0 else y; return y</code>. Three lines. Every audio file in your dataset gets the same shape (1D float32), same sample rate (16 kHz), and same loudness ceiling (-0.09 dB peak). After this, the model is the only variable.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Mini Project: Audio Inspector</h2>

<p class="l-text">Combine everything into a small utility that prints a summary of any audio file. This is the script you will run on every new dataset.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> soundfile <span class="kw">as</span> sf
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">inspect_audio</span>(path):
    info = sf.<span class="fn">info</span>(path)
    y, sr = librosa.<span class="fn">load</span>(path, sr=<span class="kw">None</span>, mono=<span class="kw">False</span>)
    is_stereo = (y.ndim == <span class="num">2</span>)
    y_mono = y.<span class="fn">mean</span>(axis=<span class="num">0</span>) <span class="kw">if</span> is_stereo <span class="kw">else</span> y
    peak = np.<span class="fn">abs</span>(y_mono).<span class="fn">max</span>()
    rms = np.<span class="fn">sqrt</span>(np.<span class="fn">mean</span>(y_mono**<span class="num">2</span>))
    db_peak = <span class="num">20</span> * np.<span class="fn">log10</span>(peak + <span class="num">1e-10</span>)
    db_rms = <span class="num">20</span> * np.<span class="fn">log10</span>(rms + <span class="num">1e-10</span>)
    silent_ratio = (np.<span class="fn">abs</span>(y_mono) &lt; <span class="num">0.005</span>).<span class="fn">mean</span>()

    <span class="fn">print</span>(f<span class="str">"File:        {path}"</span>)
    <span class="fn">print</span>(f<span class="str">"Format:      {info.format} / {info.subtype}"</span>)
    <span class="fn">print</span>(f<span class="str">"Sample rate: {sr} Hz"</span>)
    <span class="fn">print</span>(f<span class="str">"Channels:    {2 if is_stereo else 1}"</span>)
    <span class="fn">print</span>(f<span class="str">"Duration:    {len(y_mono)/sr:.2f} s"</span>)
    <span class="fn">print</span>(f<span class="str">"Peak:        {peak:.3f}  ({db_peak:+.1f} dB)"</span>)
    <span class="fn">print</span>(f<span class="str">"RMS:         {rms:.3f}  ({db_rms:+.1f} dB)"</span>)
    <span class="fn">print</span>(f<span class="str">"Silence:     {silent_ratio*100:.1f}% of samples"</span>)

<span class="cm"># Usage</span>
<span class="fn">inspect_audio</span>(<span class="str">"speech.wav"</span>)
<span class="cm"># File:        speech.wav</span>
<span class="cm"># Format:      WAV / PCM_16</span>
<span class="cm"># Sample rate: 16000 Hz</span>
<span class="cm"># Channels:    1</span>
<span class="cm"># Duration:    3.42 s</span>
<span class="cm"># Peak:        0.872  (-1.2 dB)</span>
<span class="cm"># RMS:         0.118  (-18.6 dB)</span>
<span class="cm"># Silence:     12.4% of samples</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A small summary utility — same idea as the librosa script, written with numpy only.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
def summarize(y, sr):
    return {
        'samples': len(y),
        'duration_s': round(len(y) / sr, 3),
        'sr_hz': sr,
        'peak': round(float(np.max(np.abs(y))), 4),
        'rms': round(float(np.sqrt(np.mean(y**2))), 4),
        'dynamic_range_dB': round(20 * np.log10(np.max(np.abs(y)) / (np.sqrt(np.mean(y**2)) + 1e-9)), 2),
    }
info = summarize(audio, sr)
for k, v in info.items():
    print(f'{k:&gt;18}: {v}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>sf.info</code> reads the file header without decoding -- format and bit depth come back instantly. 2) <code>librosa.load</code> with <code>sr=None</code> gives the actual samples at native rate; we will compute statistics in mono. 3) Peak is the loudest sample (worst case); RMS is the average energy (perceived loudness). The dB conversions are what audio engineers actually look at. 4) Silence ratio is the fraction of samples below 0.005 -- a sanity check for files that are mostly empty. A speech file with 80% silence usually means a bad recording or a long lead-in. 5) The printout matches what tools like sox or ffprobe show, but is one Python function you can call inside any pipeline.</p>

<div id="plot-al1-rms-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> RMS amplitude over time for a sample audio clip computed in 50 ms windows. The peaks correspond to spoken words; the valleys are silences between them. RMS is what loudness meters track and what voice activity detection thresholds against -- a simple and remarkably effective signal for finding speech in raw audio.</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Digital audio is a 1D array of numbers; sample rate sets the time grid, bit depth sets the amplitude grid.<br><strong>2.</strong> Nyquist: <code>f_s &gt;= 2 f_max</code>. 16 kHz captures everything human speech needs.<br><strong>3.</strong> WAV is uncompressed and universal; FLAC is lossless and smaller; MP3 and OGG are lossy.<br><strong>4.</strong> <code>librosa.load(path, sr=16000, mono=True)</code> is the standard ML loading idiom -- one line, always-correct shape.<br><strong>5.</strong> Convert int16 to float by dividing by 32768; the model wants float32 in roughly [-1, 1].<br><strong>6.</strong> Peak amplitude finds clipping; RMS approximates loudness; both expressed in dB.<br><strong>7.</strong> Resample with <code>librosa.resample</code> -- never by indexing.<br><strong>8.</strong> Next lesson: the frequency domain. We move from "when" to "what" with the Fourier transform.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid: 'rgba(255,255,255,0.06)',
    zero: 'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:60,r:30,b:60,l:60}};

  function wavePlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var sr = 4000, dur = 1.2;
    var N = Math.floor(sr * dur);
    var t = [], y = [];
    for (var i=0;i<N;i++) {
      var ti = i / sr;
      var amp = 0;
      if (ti < 0.3)       amp = Math.sin(2*Math.PI*220*ti) * 0.7 * Math.exp(-3*Math.abs(ti-0.15));
      else if (ti < 0.6)  amp = Math.sin(2*Math.PI*440*ti) * 0.7 * Math.exp(-3*Math.abs(ti-0.45));
      else if (ti < 0.9)  amp = Math.sin(2*Math.PI*880*ti) * 0.7 * Math.exp(-3*Math.abs(ti-0.75));
      t.push(ti); y.push(amp);
    }
    var trace = {x:t, y:y, mode:'lines', line:{color:T.accent, width:1}, name:'waveform'};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Üç Tonun Dalga Formu (220, 440, 880 Hz)':'Waveform of Three Tones (220, 440, 880 Hz)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman (s)':'time (s)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'genlik':'amplitude', gridcolor:T.grid, zerolinecolor:T.zero, range:[-1,1]}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  function rmsPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var t = [], y = [];
    for (var i=0;i<200;i++) {
      var ti = i * 0.05;
      var word_energy = 0;
      var words = [[0.3,0.7],[1.2,1.7],[2.4,2.9],[3.5,4.2],[4.8,5.4],[6.1,6.7],[7.5,8.0],[8.8,9.4]];
      for (var w=0;w<words.length;w++){
        var c = (words[w][0]+words[w][1])/2;
        var width = (words[w][1]-words[w][0])/2;
        if (Math.abs(ti-c) < width) word_energy = Math.max(word_energy, 0.4 + 0.3*Math.cos((ti-c)/width*Math.PI));
      }
      t.push(ti); y.push(word_energy + 0.02 + Math.random()*0.02);
    }
    var trace = {x:t, y:y, mode:'lines', line:{color:T.accent, width:2}, fill:'tozeroy', fillcolor:'rgba(200,169,110,0.18)', name:'RMS'};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'50 ms Pencerelerde RMS Genliği':'RMS Amplitude over 50 ms Windows', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman (s)':'time (s)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:'RMS', gridcolor:T.grid, zerolinecolor:T.zero, range:[0,1]}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  wavePlot('plot-al1-wave-en','en');
  rmsPlot('plot-al1-rms-en','en');
  wavePlot('plot-al1-wave-tr','tr');
  rmsPlot('plot-al1-rms-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Ses sürekli bir dalgadır; bilgisayarlar yalnızca sayıları işler.</strong> Şimdiye kadar dinlediğiniz her ses dosyası hava basıncı değişimleri olarak başladı, saniyede binlerce kez örneklendi, tamsayılara nicemlendi ve diske kaydedildi. Bu dönüşümün nasıl çalıştığını anlamak her ses görevinin temelidir -- konuşma tanıma, müzik üretimi, ses klonlama, podcast transkripsiyonu, hepsi.</p>

<p class="l-text">Bu ders her ses mühendisi ve ML pratisyeninin ihtiyaç duyduğu sayısal ses 101'ini kapsar: örnekleme oranı, bit derinliği, kanallar, dosya formatları (WAV, MP3, FLAC, OGG) ve sesi yüklemek ve manipüle etmek için Python araçları (librosa, scipy, soundfile). Sonunda herhangi bir ses dosyasını yükleyebilir, özelliklerini inceleyebilir, dalga formunu çizebilir, yeniden örnekleyebilir ve geri kaydedebilirsiniz -- sonraki her dersin ön koşulları.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Örnekleme, nicemleme ve mikrofonun nasıl tamsayı dizisi olduğunu açıklayacaksın</li>
<li>Aliasing'den kaçınmak için Nyquist teoremiyle örnekleme oranı seçeceksin</li>
<li>WAV, MP3, FLAC, OGG'yi codec, bitrate ve kayıplı/kayıpsız olarak karşılaştıracaksın</li>
<li>Sesi librosa, scipy.io.wavfile ve soundfile ile yükleyip inceleyeceksin</li>
<li>Dalga formu çizip 44.1kHz'i 16kHz'e resample edip diske geri yazacaksın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Bilgisayar Nasıl "Duyar"?</h2>

<p class="l-text">Konuştuğunuzda ses telleriniz havayı titretir. Bu titreşimler sürekli basınç dalgalarıdır -- analog sinyaller. Bir mikrofon basıncı sürekli bir voltaja dönüştürür. Bunu bilgisayara almak için iki ayrıklaştırma gerçekleşir: zamanda <em>örnekleme</em> (saniyede N kez voltajı ölç) ve genlikte <em>nicemleme</em> (her ölçümü sonlu sayıda tamsayı seviyesine yuvarla).</p>

<div class="calc-highlight"><strong>Sayısal ses sadece uzun bir sayı dizisidir.</strong> 16 kHz'de mono ve 16-bit derinlikte 1 saniyelik bir kayıt 16000 int16 değerden oluşan 1B bir dizidir. Hepsi bu. Bu kursdaki her algoritma bu tür diziler üzerinde çalışır.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Örnekleme oranı</div><div class="card-body">Saniyedeki örnek, Hz cinsinden. Telefon: 8000. Konuşma tanıma: 16000. CD: 44100. Stüdyo: 48000 veya 96000.</div></div>
<div class="calc-card"><div class="card-title">Bit derinliği</div><div class="card-body">Örnek başına bit. 16-bit = 65536 seviye (CD kalitesi). 24-bit = profesyonel kayıt. 32-bit float = iç işleme.</div></div>
<div class="calc-card"><div class="card-title">Kanallar</div><div class="card-body">Mono = 1 akış. Stereo = 2 (sol + sağ). 5.1 = 6 akış. ML neredeyse her zaman mono kullanır.</div></div>
<div class="calc-card"><div class="card-title">Süre</div><div class="card-body">Saniye cinsinden uzunluk = num_samples / sample_rate. 16 kHz'de 16000 örnekli klip 1.0 saniyedir.</div></div>
<div class="calc-card"><div class="card-title">Genlik</div><div class="card-body">Yükseklik. Float seste [-1.0, 1.0]'a normalize edilmiştir. int16'da [-32768, 32767]'dir.</div></div>
<div class="calc-card"><div class="card-title">Frekans</div><div class="card-body">Dalganın ne kadar hızlı salındığı, Hz cinsinden. Bas gitar: 40-400 Hz. Konuşma temel frekansı: 80-300 Hz. Ziller: 16000 Hz'e kadar.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: 16 kHz bir ses dosyası</div><div class="example-body">16 kHz, mono, 16-bit'te 1.5 saniye boyunca "merhaba" dediğinizi kaydediyorsunuz. Ortaya çıkan dosya <code>1.5 * 16000 = 24000</code> örnek tutar, her biri 16-bit tamsayıdır. Ham boyut: <code>24000 * 2 bayt = 48 KB</code>. İlk örnek 12 olabilir, sonraki 47, sonra 130, sonra -200, sesinizin dalga formunu kodlamak için saniyede binlerce kez salınır.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Nyquist Teoremi</h2>

<p class="l-text">Saniyede gerçekten kaç örneğe ihtiyacınız var? Cevap sinyal işlemenin en önemli sonuçlarından biridir.</p>

<div class="katex-block">$$f_s \\geq 2 f_{\\max}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">f_s</div><div class="card-body">Örnekleme oranı (saniye başına örnek, Hz). Kayıt yaparken seçtiğiniz.</div></div>
<div class="calc-card"><div class="card-title">f_max</div><div class="card-body">Korumak istediğiniz sinyalde mevcut en yüksek frekans.</div></div>
<div class="calc-card"><div class="card-title">Nyquist frekansı</div><div class="card-body">f_s / 2. Örnekleme oranı f_s'de temsil edilebilen maksimum frekans.</div></div>
<div class="calc-card"><div class="card-title">Aliasing</div><div class="card-body">Sinyal f_s/2 üzeri frekanslar içerirse, duyulabilir banda hayalet tonlar olarak katlanırlar.</div></div>
<div class="calc-card"><div class="card-title">Anti-alias filtresi</div><div class="card-body">Örneklemeden önce f_s/2 üzeri enerjiyi kaldırmak için uygulanan alçak geçirgen filtre.</div></div>
<div class="calc-card"><div class="card-title">Neden 44.1 kHz?</div><div class="card-body">İnsan duyumu 20 kHz civarında biter. 44.1 kHz, anti-alias filtresi için marj ile 22.05 kHz Nyquist verir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: konuşma için neden 16 kHz yeterli</div><div class="example-body">İnsan konuşmasındaki neredeyse tüm fonetik bilgi 8 kHz altında bulunur; "s" ve "f" gibi sürtünmeli sesler en yükseğe ulaşır. 16 kHz örnekleme oranı 8 kHz'e kadar her şeyi tam olarak yakalar (Nyquist). Bu yüzden her konuşma modeli -- Whisper, wav2vec, HuBERT -- 16 kHz mono giriş kullanır. Önemli hiçbir şeyi atmaz ve 32 kHz'e kıyasla veriyi yarıya indirir.</div></div>

<div class="l-note"><strong>Pratik kural:</strong> daha yüksek sadakate özellikle ihtiyacınız yoksa (müzik üretimi, ses klonlama) ML hatları için her şeyi 16 kHz mono'ya yeniden örnekleyin.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Dosya Formatları: WAV, MP3, FLAC, OGG</h2>

<p class="l-text">Bir dosya formatı örnek dizisini artı meta veriyi (örnekleme oranı, kanallar, bit derinliği) saklayan bir konteynerdir. Formatlar örnekleri nasıl sıkıştırdığında -- veya sıkıştırmadığında -- farklılaşır.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">WAV (.wav)</div><div class="compare-item">Sıkıştırılmamış PCM</div><div class="compare-item">Kayıpsız, bit-bit aynısı</div><div class="compare-item">Büyük dosyalar (44.1 kHz stereo'da dakika başına 10 MB)</div><div class="compare-item">ML eğitim verisi için standart</div></div>
<div class="compare-col"><div class="compare-title">MP3 (.mp3)</div><div class="compare-item">Kayıplı psikoakustik sıkıştırma</div><div class="compare-item">128 kbps'de WAV'dan 10 kat küçük</div><div class="compare-item">Düşük bit hızlarında duyulabilir bozukluklar</div><div class="compare-item">Eğitim için kaçının, akış için iyi</div></div>
<div class="compare-col"><div class="compare-title">FLAC (.flac)</div><div class="compare-item">Kayıpsız sıkıştırma</div><div class="compare-item">WAV'dan ~%50 daha küçük, kusursuz yeniden yapılandırma</div><div class="compare-item">WAV'dan daha yavaş çözülür</div><div class="compare-item">Arşivler için iki dünyanın en iyisi</div></div>
<div class="compare-col"><div class="compare-title">OGG (.ogg/.opus)</div><div class="compare-item">Açık kayıplı (Vorbis veya Opus)</div><div class="compare-item">Aynı bit hızında MP3'ten daha iyi kalite</div><div class="compare-item">Opus konuşma için mükemmel (düşük gecikmeli akış)</div><div class="compare-item">WhatsApp, Discord tarafından kullanılır</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: bir podcast hattı için format seçimi</div><div class="example-body">Bir konuşma modeli için 1000 saatlik podcast (128 kbps'de MP3) topluyorsunuz. Önce her MP3'ü bir numpy dizisine çözün. 16 kHz mono'ya yeniden örnekleyin. Temizlenen veri kümesini FLAC olarak kaydedin -- bu noktadan itibaren kayıpsız, WAV saklasaydınız 10 GB yerine ~5 GB. Eğitim sırasında FLAC -> int16 -> [-1, 1]'de float32 yükleyin. Model orijinal konteynerden bağımsız olarak aynı sayıları görür.</div></div>

<div class="l-warn"><strong>Tuzak:</strong> Tekrarlanan MP3 yeniden kodlama (çöz -> MP3 kaydet -> çöz -> MP3 kaydet) her gidiş-dönüşte bozuklukları biriktirir. Her zaman kayıpsız bir ana dosya tutun ve kayıplıyı yalnızca son teslim adımında kodlayın.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Python'da Ses Yükleme</h2>

<p class="l-text">Üç kütüphane neredeyse tüm ihtiyaçları karşılar: <code>librosa</code> (ML standardı, otomatik yeniden örnekler ve mono float32'ye dönüştürür), <code>soundfile</code> (hızlı, tam, birçok formatı destekler) ve <code>scipy.io.wavfile</code> (WAV için sıfır bağımlılık).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install librosa soundfile scipy numpy</span>
<span class="kw">import</span> librosa
<span class="kw">import</span> soundfile <span class="kw">as</span> sf
<span class="kw">from</span> scipy.io <span class="kw">import</span> wavfile
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) librosa: ML varsayılanı. [-1, 1]'de float32, mono, hedef sr döner.</span>
y, sr = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
<span class="fn">print</span>(y.shape, y.dtype, sr)        <span class="cm"># (24000,) float32 16000</span>
<span class="fn">print</span>(<span class="str">"sure:"</span>, <span class="fn">len</span>(y) / sr, <span class="str">"s"</span>)
<span class="fn">print</span>(<span class="str">"min/max:"</span>, y.<span class="fn">min</span>(), y.<span class="fn">max</span>())  <span class="cm"># kabaca [-1, 1] icinde</span>

<span class="cm"># sr=None orijinal oranı korur; tam veri istediğinizde önerilir.</span>
y_orig, sr_orig = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="kw">None</span>)
<span class="fn">print</span>(<span class="str">"orijinal sr:"</span>, sr_orig)

<span class="cm"># 2) soundfile: daha hızlı, tam, otomatik yeniden örnekleme yok</span>
y_sf, sr_sf = sf.<span class="fn">read</span>(<span class="str">"speech.wav"</span>, dtype=<span class="str">"float32"</span>)
<span class="fn">print</span>(y_sf.shape, sr_sf)
<span class="cm"># Stereo dosyalar için: şekil (N, 2). Mono için: şekil (N,)</span>

<span class="cm"># 3) scipy: en düşük seviye, doğrudan int16 döner</span>
sr_sp, y_sp = wavfile.<span class="fn">read</span>(<span class="str">"speech.wav"</span>)
<span class="fn">print</span>(y_sp.dtype, y_sp.shape, sr_sp)   <span class="cm"># int16 (24000,) 16000</span>

<span class="cm"># int16'yı [-1, 1]'de float32'ye dönüştür</span>
y_float = y_sp.<span class="fn">astype</span>(np.float32) / <span class="num">32768.0</span>
<span class="fn">print</span>(y_float.<span class="fn">min</span>(), y_float.<span class="fn">max</span>())</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pyodide preamble zaten 1 saniyelik 16 kHz sinüs \`audio\` (440 Hz) ve \`sr=16000\` sunuyor. librosa.load API'sini taklit ediyoruz: şekil, dtype, süre.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
# 'audio' (float32) and 'sr' (16000) are pre-loaded by the Pyodide preamble.
y = audio
duration = len(y) / sr
print('shape:', y.shape, '  dtype:', y.dtype)
print('sample rate:', sr, 'Hz   duration:', round(duration, 3), 's')
print('min/max amplitude:', round(float(y.min()), 4), round(float(y.max()), 4))
print('mean abs (RMS-ish):', round(float(np.abs(y).mean()), 4))
print('first 8 samples:', np.round(y[:8], 4))</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>librosa.load</code> <code>sr=16000</code> ile dosyayı anında 16 kHz'e yeniden örnekler, stereo ise mono'ya karıştırır ve kabaca [-1, 1]'e normalize edilmiş float32 döner. Bu standart ML yükleme deyimidir. 2) <code>sr=None</code> geçmek dosyanın yerel oranını korur, librosa veriyi değiştirmeden ham veriyi incelemek istediğinizde yararlıdır. 3) <code>soundfile.read</code> librosa'dan hızlıdır ve veriye dokunmaz; dosyada ne varsa onu döner. Stereo için şekil (N, 2)'dir; mono için (N,)'dir. 4) <code>scipy.io.wavfile.read</code> düz WAV dosyaları için en düşük yüklü yoldur; int16 verisini doğrudan döner. 5) int16'yı 32768'e bölerek float'a dönüştürmek veriyi ML modellerinin beklediği [-1, 1] aralığına koyar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">librosa.load</div><div class="card-body">Otomatik yeniden örnekleme, otomatik mono, float32. ML eğitim hatları için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">soundfile.read</div><div class="card-body">Hızlı, tam, WAV/FLAC/OGG destekler. İnceleme ve kayıpsız iş akışları için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">scipy.wavfile</div><div class="card-body">Stdlib dostu, int16 döner. Yalnızca basit WAV için kullanın.</div></div>
<div class="calc-card"><div class="card-title">torchaudio.load</div><div class="card-body">PyTorch yerel, tensor döner. Doğrudan torch modeline beslerken kullanın.</div></div>
<div class="calc-card"><div class="card-title">pydub</div><div class="card-body">ffmpeg üstüne kolaylık sarmalayıcısı. Kesme/birleştirme için iyi, batch için yavaş.</div></div>
<div class="calc-card"><div class="card-title">ffmpeg-python</div><div class="card-body">Egzotik konteynerler için (ses parçalı mp4, m4a, webm). Her şeyi çözer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Dalga Formu Çizimi</h2>

<p class="l-text">Dalga formu sesin en doğrudan görselleştirmesidir: x ekseni zaman, y ekseni genlik. Sessizliği, yüksekliği ve kabaca şekli (tek ses vs müzik) bir bakışta görebilirsiniz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"trumpet"</span>), sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
<span class="fn">print</span>(y.shape, sr, <span class="fn">len</span>(y) / sr, <span class="str">"s"</span>)

<span class="cm"># Çizim için saniye cinsinden zaman ekseni</span>
t = np.<span class="fn">arange</span>(<span class="fn">len</span>(y)) / sr

plt.<span class="fn">figure</span>(figsize=(<span class="num">10</span>, <span class="num">3</span>))
plt.<span class="fn">plot</span>(t, y, linewidth=<span class="num">0.6</span>)
plt.<span class="fn">xlabel</span>(<span class="str">"zaman (s)"</span>)
plt.<span class="fn">ylabel</span>(<span class="str">"genlik"</span>)
plt.<span class="fn">title</span>(<span class="str">"Dalga formu"</span>)
plt.<span class="fn">tight_layout</span>()
plt.<span class="fn">show</span>()

<span class="cm"># Her ses mühendisinin kontrol ettiği hızlı istatistikler</span>
<span class="fn">print</span>(<span class="str">"tepe genlik:"</span>, np.<span class="fn">abs</span>(y).<span class="fn">max</span>())
<span class="fn">print</span>(<span class="str">"RMS:"</span>, np.<span class="fn">sqrt</span>(np.<span class="fn">mean</span>(y**<span class="num">2</span>)))
<span class="fn">print</span>(<span class="str">"dB tepe:"</span>, <span class="num">20</span> * np.<span class="fn">log10</span>(np.<span class="fn">abs</span>(y).<span class="fn">max</span>() + <span class="num">1e-10</span>))</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Normalde librosa dalga grafiğinden okuyacağın istatistikleri çiz: tepe, RMS, sıfır-geçiş oranı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
y = audio
peak = float(np.max(np.abs(y)))
rms  = float(np.sqrt(np.mean(y**2)))
zcr  = float(np.mean(np.abs(np.diff(np.sign(y)))) / 2.0)
print('Peak amplitude :', round(peak, 4))
print('RMS energy     :', round(rms, 4))
print('Zero-crossing rate (per sample):', round(zcr, 5))
print('Estimated frequency from ZCR:', round(zcr * sr, 1), 'Hz  (true=440)')</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Sonraki her dersin ML kurallarıyla eşleşmesi için 16 kHz mono'ya yeniden örnekleyerek librosa'nın paketlenmiş trompet örneğini yükler. 2) Bir zaman ekseni oluşturur: i örneği <code>i / sr</code> saniyede iner. X ekseninde çizdiğiniz şey budur. 3) Genliği zamana karşı çizer. Saniyede 16000 örnek olduğu için dalga formu yoğun görünür; matplotlib her birini çizer. 4) Tepe genliği (en yüksek tek örnek) ve RMS'yi (kök ortalama kare, algılanan yükseklikle ilgili) hesaplar. 5) Tepeyi dB'ye dönüştürür; 0 dB tam ölçektir (genlik 1.0), -20 dB 0.1, -40 dB 0.01'dir. Ses etkinliği genellikle -30 ile -10 dB tepe arasında yaşar.</p>

<div id="plot-al1-wave-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> 220 Hz, 440 Hz ve 880 Hz'de sırayla çalan üç tonun sentetik bir dalga formu. Her ton 0.3 saniye sürer. Genlik zarfını (notalar arasındaki sessizlik) ve, zihnen yakınlaştırırsanız, daha yüksek perdelerin artan salınım yoğunluğunu görebilirsiniz. Bu zaman alanı görünümüdür -- bir şeyin ne zaman olduğu. Sonraki ders neyin olduğunu ortaya çıkaran frekans alanına geçer.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Yeniden Örnekleme ve Kaydetme</h2>

<p class="l-text">İndirdiğiniz neredeyse her veri kümesi modeliniz için yanlış örnekleme oranında, yanlış kanal sayısında veya yanlış bit derinliğindedir. Yeniden örnekleme ilkini düzeltir; <code>np.mean(axis=1)</code> ikincisini düzeltir; doğru dtype ile kaydetmek üçüncüyü düzeltir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> soundfile <span class="kw">as</span> sf
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) Orijinal oranda yükle</span>
y, sr = librosa.<span class="fn">load</span>(<span class="str">"input.wav"</span>, sr=<span class="kw">None</span>, mono=<span class="kw">False</span>)
<span class="fn">print</span>(<span class="str">"orijinal sr:"</span>, sr, <span class="str">"sekil:"</span>, y.shape)
<span class="cm"># Stereo dosyalar (2, N) olarak; mono (N,) olarak gelir</span>

<span class="cm"># 2) Kanalları ortalayarak stereo'dan mono'ya</span>
<span class="kw">if</span> y.ndim == <span class="num">2</span>:
    y = y.<span class="fn">mean</span>(axis=<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">"mono sekil:"</span>, y.shape)

<span class="cm"># 3) 16 kHz'e yeniden örnekle</span>
y_16 = librosa.<span class="fn">resample</span>(y, orig_sr=sr, target_sr=<span class="num">16000</span>)
<span class="fn">print</span>(<span class="str">"yeniden orneklenmis:"</span>, y_16.shape, <span class="num">16000</span>)

<span class="cm"># 4) 16-bit WAV olarak kaydet (ML standardı)</span>
sf.<span class="fn">write</span>(<span class="str">"out_16k.wav"</span>, y_16, samplerate=<span class="num">16000</span>, subtype=<span class="str">"PCM_16"</span>)

<span class="cm"># 5) FLAC olarak kaydet (kayıpsız, ~%50 küçük)</span>
sf.<span class="fn">write</span>(<span class="str">"out_16k.flac"</span>, y_16, samplerate=<span class="num">16000</span>)

<span class="cm"># 6) İsteğe bağlı: en yüksek örnek tam olarak 0.99 olacak şekilde tepe normalize</span>
peak = np.<span class="fn">abs</span>(y_16).<span class="fn">max</span>()
<span class="kw">if</span> peak &gt; <span class="num">0</span>:
    y_norm = y_16 * (<span class="num">0.99</span> / peak)
sf.<span class="fn">write</span>(<span class="str">"out_norm.wav"</span>, y_norm, samplerate=<span class="num">16000</span>, subtype=<span class="str">"PCM_16"</span>)

<span class="cm"># 7) Ham bayt gerekiyorsa elle int16'ya dönüştür</span>
y_i16 = (y_16 * <span class="num">32767</span>).<span class="fn">astype</span>(np.int16)
<span class="fn">print</span>(y_i16.dtype, y_i16.<span class="fn">min</span>(), y_i16.<span class="fn">max</span>())</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">scipy.signal.resample_poly, librosa yeniden örneklemenin tarayıcı içi eşdeğeridir. 16 kHz → 8 kHz'e düşürüyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
y = audio                       # 16 kHz mono
y_8k = signal.resample_poly(y, up=1, down=2)   # → 8 kHz
print('original :', y.shape, '@', sr, 'Hz')
print('resampled:', y_8k.shape, '@', sr // 2, 'Hz')
# Fake stereo, then collapse to mono
stereo = np.stack([y, y * 0.7], axis=1)
mono = stereo.mean(axis=1)
print('stereo →', stereo.shape, '   mono →', mono.shape)</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Üzerinde çalıştığımızı görebilmek için giriş dosyasını yerel oranında yükler. <code>mono=False</code> stereo kanallarını ayrı ayrı korur. 2) Dosya stereo ise (2 satır) mono yapmak için iki kanalı ortalar. Çoğu ML modeli mono ister. 3) <code>librosa.resample</code> örnekleme oranını değiştirmek için yüksek kaliteli bir polifaz filtresi uygular -- bu naif şekilde örnek atmak veya çoğaltmaktan çok daha iyidir. Çıktının uzunluğu <code>len(y) * target_sr / orig_sr</code>'dir. 4) <code>soundfile.write</code> her aracın okuduğu evrensel "sıkıcı" format olan 16-bit PCM WAV olarak kaydeder. 5) FLAC aynı kaliteyi kabaca yarı boyutta elde eder. 6) Tepe normalizasyonu en yüksek anı -0.09 dB'de (tam ölçeğin hemen altında) olacak şekilde yeniden ölçeklendirir, aşağı akış araçları kazanç uygulayınca kırpılmayı önler. 7) Düşük seviye API'lar için bazen elle int16 dönüşümü gerekir; en negatif örnekte taşmayı önlemek için 32767 ile çarpın (32768 değil!).</p>

<div class="l-note"><strong>Kalite ipucu:</strong> librosa'nın varsayılan yeniden örnekleyicisi "soxr_hq"dur. Toplu işler için <code>res_type="kaiser_fast"</code> kullanabilirsiniz (3-4 kat daha hızlı, biraz daha düşük kalite) -- yine de naif yeniden örneklemeden daha iyidir.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: gerçek bir ön işleme fonksiyonu</div><div class="example-body">Tipik bir veri kümesi ön işleme fonksiyonu: <code>def prep(path): y, sr = librosa.load(path, sr=16000, mono=True); peak = np.abs(y).max(); y = y * (0.99 / peak) if peak &gt; 0 else y; return y</code>. Üç satır. Veri kümenizdeki her ses dosyası aynı şekli (1B float32), aynı örnekleme oranını (16 kHz) ve aynı yükseklik tavanını (-0.09 dB tepe) alır. Bundan sonra model tek değişkendir.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Mini Proje: Ses Denetleyici</h2>

<p class="l-text">Her şeyi herhangi bir ses dosyasının özetini yazdıran küçük bir araca birleştirin. Bu, her yeni veri kümesinde çalıştıracağınız betiktir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> soundfile <span class="kw">as</span> sf
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">inspect_audio</span>(path):
    info = sf.<span class="fn">info</span>(path)
    y, sr = librosa.<span class="fn">load</span>(path, sr=<span class="kw">None</span>, mono=<span class="kw">False</span>)
    is_stereo = (y.ndim == <span class="num">2</span>)
    y_mono = y.<span class="fn">mean</span>(axis=<span class="num">0</span>) <span class="kw">if</span> is_stereo <span class="kw">else</span> y
    peak = np.<span class="fn">abs</span>(y_mono).<span class="fn">max</span>()
    rms = np.<span class="fn">sqrt</span>(np.<span class="fn">mean</span>(y_mono**<span class="num">2</span>))
    db_peak = <span class="num">20</span> * np.<span class="fn">log10</span>(peak + <span class="num">1e-10</span>)
    db_rms = <span class="num">20</span> * np.<span class="fn">log10</span>(rms + <span class="num">1e-10</span>)
    silent_ratio = (np.<span class="fn">abs</span>(y_mono) &lt; <span class="num">0.005</span>).<span class="fn">mean</span>()

    <span class="fn">print</span>(f<span class="str">"Dosya:        {path}"</span>)
    <span class="fn">print</span>(f<span class="str">"Format:       {info.format} / {info.subtype}"</span>)
    <span class="fn">print</span>(f<span class="str">"Ornekleme:    {sr} Hz"</span>)
    <span class="fn">print</span>(f<span class="str">"Kanallar:     {2 if is_stereo else 1}"</span>)
    <span class="fn">print</span>(f<span class="str">"Sure:         {len(y_mono)/sr:.2f} s"</span>)
    <span class="fn">print</span>(f<span class="str">"Tepe:         {peak:.3f}  ({db_peak:+.1f} dB)"</span>)
    <span class="fn">print</span>(f<span class="str">"RMS:          {rms:.3f}  ({db_rms:+.1f} dB)"</span>)
    <span class="fn">print</span>(f<span class="str">"Sessizlik:    %{silent_ratio*100:.1f} ornek"</span>)

<span class="cm"># Kullanım</span>
<span class="fn">inspect_audio</span>(<span class="str">"speech.wav"</span>)
<span class="cm"># Dosya:        speech.wav</span>
<span class="cm"># Format:       WAV / PCM_16</span>
<span class="cm"># Ornekleme:    16000 Hz</span>
<span class="cm"># Kanallar:     1</span>
<span class="cm"># Sure:         3.42 s</span>
<span class="cm"># Tepe:         0.872  (-1.2 dB)</span>
<span class="cm"># RMS:          0.118  (-18.6 dB)</span>
<span class="cm"># Sessizlik:    %12.4 ornek</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Küçük bir özet aracı — librosa script'iyle aynı fikir, yalnızca numpy ile yazıldı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
def summarize(y, sr):
    return {
        'samples': len(y),
        'duration_s': round(len(y) / sr, 3),
        'sr_hz': sr,
        'peak': round(float(np.max(np.abs(y))), 4),
        'rms': round(float(np.sqrt(np.mean(y**2))), 4),
        'dynamic_range_dB': round(20 * np.log10(np.max(np.abs(y)) / (np.sqrt(np.mean(y**2)) + 1e-9)), 2),
    }
info = summarize(audio, sr)
for k, v in info.items():
    print(f'{k:&gt;18}: {v}')</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>sf.info</code> dosya başlığını çözmeden okur -- format ve bit derinliği anında geri gelir. 2) <code>librosa.load</code> <code>sr=None</code> ile yerel oranda gerçek örnekleri verir; istatistikleri mono'da hesaplayacağız. 3) Tepe en yüksek örnektir (en kötü durum); RMS ortalama enerjidir (algılanan yükseklik). dB dönüşümleri ses mühendislerinin gerçekten baktığı şeylerdir. 4) Sessizlik oranı 0.005 altındaki örneklerin oranıdır -- çoğunlukla boş olan dosyalar için akıl sağlığı kontrolü. %80 sessizlikli bir konuşma dosyası genellikle kötü bir kayıt veya uzun bir başlangıç anlamına gelir. 5) Çıktı sox veya ffprobe gibi araçların gösterdiğiyle eşleşir, ama herhangi bir hat içinde çağırabileceğiniz tek bir Python fonksiyonudur.</p>

<div id="plot-al1-rms-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> 50 ms pencerelerinde hesaplanmış örnek bir ses klibi için zamana karşı RMS genliği. Tepeler konuşulan kelimelere karşılık gelir; vadiler aralarındaki sessizliklerdir. RMS yükseklik ölçerlerin izlediği ve ses etkinliği algılamasının eşik aldığı şeydir -- ham seste konuşmayı bulmak için basit ve dikkat çekici şekilde etkili bir sinyal.</div>

<div class="think-box"><div class="think-label">TEMEL ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Sayısal ses 1B bir sayı dizisidir; örnekleme oranı zaman ızgarasını, bit derinliği genlik ızgarasını belirler.<br><strong>2.</strong> Nyquist: <code>f_s &gt;= 2 f_max</code>. 16 kHz insan konuşmasının ihtiyacı olan her şeyi yakalar.<br><strong>3.</strong> WAV sıkıştırılmamış ve evrensel; FLAC kayıpsız ve daha küçük; MP3 ve OGG kayıplı.<br><strong>4.</strong> <code>librosa.load(path, sr=16000, mono=True)</code> standart ML yükleme deyimidir -- tek satır, her zaman doğru şekil.<br><strong>5.</strong> int16'yı 32768'e bölerek float'a dönüştürün; model kabaca [-1, 1]'de float32 ister.<br><strong>6.</strong> Tepe genlik kırpılmayı bulur; RMS yüksekliği yaklaşıklar; ikisi de dB ile ifade edilir.<br><strong>7.</strong> <code>librosa.resample</code> ile yeniden örnekleyin -- asla indeksleme ile değil.<br><strong>8.</strong> Sonraki ders: frekans alanı. Fourier dönüşümüyle "ne zaman"dan "ne"ye geçiyoruz.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid: 'rgba(255,255,255,0.06)',
    zero: 'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:60,r:30,b:60,l:60}};

  function wavePlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var sr = 4000, dur = 1.2;
    var N = Math.floor(sr * dur);
    var t = [], y = [];
    for (var i=0;i<N;i++) {
      var ti = i / sr;
      var amp = 0;
      if (ti < 0.3)       amp = Math.sin(2*Math.PI*220*ti) * 0.7 * Math.exp(-3*Math.abs(ti-0.15));
      else if (ti < 0.6)  amp = Math.sin(2*Math.PI*440*ti) * 0.7 * Math.exp(-3*Math.abs(ti-0.45));
      else if (ti < 0.9)  amp = Math.sin(2*Math.PI*880*ti) * 0.7 * Math.exp(-3*Math.abs(ti-0.75));
      t.push(ti); y.push(amp);
    }
    var trace = {x:t, y:y, mode:'lines', line:{color:T.accent, width:1}, name:'waveform'};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Üç Tonun Dalga Formu (220, 440, 880 Hz)':'Waveform of Three Tones (220, 440, 880 Hz)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman (s)':'time (s)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'genlik':'amplitude', gridcolor:T.grid, zerolinecolor:T.zero, range:[-1,1]}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  function rmsPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var t = [], y = [];
    for (var i=0;i<200;i++) {
      var ti = i * 0.05;
      var word_energy = 0;
      var words = [[0.3,0.7],[1.2,1.7],[2.4,2.9],[3.5,4.2],[4.8,5.4],[6.1,6.7],[7.5,8.0],[8.8,9.4]];
      for (var w=0;w<words.length;w++){
        var c = (words[w][0]+words[w][1])/2;
        var width = (words[w][1]-words[w][0])/2;
        if (Math.abs(ti-c) < width) word_energy = Math.max(word_energy, 0.4 + 0.3*Math.cos((ti-c)/width*Math.PI));
      }
      t.push(ti); y.push(word_energy + 0.02 + Math.random()*0.02);
    }
    var trace = {x:t, y:y, mode:'lines', line:{color:T.accent, width:2}, fill:'tozeroy', fillcolor:'rgba(200,169,110,0.18)', name:'RMS'};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'50 ms Pencerelerde RMS Genliği':'RMS Amplitude over 50 ms Windows', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman (s)':'time (s)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:'RMS', gridcolor:T.grid, zerolinecolor:T.zero, range:[0,1]}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  wavePlot('plot-al1-wave-en','en');
  rmsPlot('plot-al1-rms-en','en');
  wavePlot('plot-al1-wave-tr','tr');
  rmsPlot('plot-al1-rms-tr','tr');
}, 250);</script>`
};
