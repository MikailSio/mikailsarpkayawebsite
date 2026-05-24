window.AUDIO_L2 = {

en: `<p class="l-text"><strong>Time domain shows when something happened; frequency domain shows what happened.</strong> A waveform tells you "loud at 0.5 s, quiet at 1.0 s, loud again at 1.2 s". A spectrum tells you "lots of energy at 220 Hz and 440 Hz, none at 5 kHz". For ML, the frequency domain is almost always the better representation -- it is what makes a "ee" sound look different from an "oo" sound, and what makes a violin look different from a flute.</p>

<p class="l-text">This lesson covers the Fourier Transform intuitively, the Discrete Fourier Transform formula, the Fast Fourier Transform algorithm (FFT), and the Short-Time Fourier Transform (STFT) that produces the spectrogram every audio model consumes. By the end you can convert any audio array to a spectrogram with three lines of librosa code -- and you will know exactly what those three lines do.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Build intuition for decomposing a signal into sine waves with the Fourier Transform</li>
<li>Derive the Discrete Fourier Transform sum and read the FFT bin formula</li>
<li>Compute an FFT in Python with numpy.fft and find peak frequencies</li>
<li>Apply STFT with hop and window to produce a time-frequency spectrogram</li>
<li>Trade time for frequency resolution by choosing window size 256 vs 2048</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Fourier Transform: Intuition</h2>

<p class="l-text">Joseph Fourier discovered that any signal -- no matter how complicated -- can be decomposed into a sum of pure sine waves of different frequencies, amplitudes, and phases. A piano chord is the sum of the sine waves of each note. A vowel is the sum of the sine waves of its formants. A drum hit is the sum of many sine waves spread broadly across the spectrum.</p>

<div class="calc-highlight"><strong>The Fourier transform turns a time signal into a list of frequencies.</strong> Input: an array of N samples. Output: an array of N complex numbers. Index k of the output tells you "how much of frequency k is in the input". The magnitude is the amount, the angle is the phase.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pure sine</div><div class="card-body">A signal of one frequency. Its FFT has energy at exactly one bin.</div></div>
<div class="calc-card"><div class="card-title">Sum of sines</div><div class="card-body">A signal of K frequencies. Its FFT has energy at exactly K bins.</div></div>
<div class="calc-card"><div class="card-title">Real signal</div><div class="card-body">Speech, music. FFT has energy across many bins -- the spectrum.</div></div>
<div class="calc-card"><div class="card-title">Magnitude</div><div class="card-body">|X[k]| = how strong frequency k is. This is what you usually plot.</div></div>
<div class="calc-card"><div class="card-title">Phase</div><div class="card-body">arg(X[k]) = where in its cycle frequency k is. Less perceptually important.</div></div>
<div class="calc-card"><div class="card-title">Inverse FFT</div><div class="card-body">Lossless: ifft(fft(x)) returns x exactly. Frequency and time domains are equivalent.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: vowels are formants</div><div class="example-body">When you say "ee" the vocal tract has resonances at roughly 270 Hz, 2300 Hz, and 3000 Hz. When you say "oo" the resonances shift to 300 Hz, 870 Hz, and 2240 Hz. Both signals are noisy and complex in the time domain. In the frequency domain they are easy to tell apart: distinct peaks at distinct frequencies. This is why every speech model works in frequency space.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Discrete Fourier Transform Formula</h2>

<p class="l-text">For a signal of N samples, the DFT is defined as:</p>

<div class="katex-block">$$X[k] = \\sum_{n=0}^{N-1} x[n] \\, e^{-2\\pi i kn/N}, \\qquad k = 0, 1, \\ldots, N-1$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x[n]</div><div class="card-body">Input sample at time index n. Real number from your audio array.</div></div>
<div class="calc-card"><div class="card-title">X[k]</div><div class="card-body">Output complex coefficient at frequency bin k. Magnitude = how much of that frequency is present.</div></div>
<div class="calc-card"><div class="card-title">N</div><div class="card-body">Number of samples in the input window. Also the number of output bins.</div></div>
<div class="calc-card"><div class="card-title">k</div><div class="card-body">Frequency index, 0 to N-1. Real frequency in Hz: f_k = k * sr / N.</div></div>
<div class="calc-card"><div class="card-title">e^(-2 pi i k n / N)</div><div class="card-body">A complex sinusoid that rotates k times across the window. The "basis function" for bin k.</div></div>
<div class="calc-card"><div class="card-title">Sum</div><div class="card-body">Inner product of x with the basis. Large when x oscillates at frequency k; near zero otherwise.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: the bin-to-Hz mapping</div><div class="example-body">N = 1024 samples, sample rate 16 kHz. Frequency resolution: <code>16000 / 1024 = 15.625 Hz</code> per bin. Bin 0 is DC (0 Hz). Bin 1 is 15.625 Hz. Bin 64 is 1000 Hz. Bin 512 is 8000 Hz (the Nyquist). The second half (bins 513-1023) is the complex conjugate of the first half for real input -- so we keep only the first <code>N/2 + 1 = 513</code> bins.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. FFT in Python</h2>

<p class="l-text">The DFT formula has O(N^2) cost; the Fast Fourier Transform (FFT) computes the same result in O(N log N). It is one of the most important algorithms in computing. NumPy and SciPy ship with high-quality implementations.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> librosa

<span class="cm"># 1) Synthetic signal: sum of three pure tones</span>
sr = <span class="num">16000</span>
dur = <span class="num">1.0</span>
t = np.<span class="fn">linspace</span>(<span class="num">0</span>, dur, <span class="fn">int</span>(sr * dur), endpoint=<span class="kw">False</span>)
x = (<span class="num">1.0</span> * np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*<span class="num">220</span>*t)
   + <span class="num">0.6</span> * np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*<span class="num">440</span>*t)
   + <span class="num">0.3</span> * np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*<span class="num">880</span>*t))
<span class="fn">print</span>(x.shape, x.dtype)

<span class="cm"># 2) Compute the FFT</span>
X = np.fft.<span class="fn">fft</span>(x)
<span class="fn">print</span>(X.shape, X.dtype)         <span class="cm"># (16000,) complex128</span>

<span class="cm"># 3) For real signals, only the first half is informative</span>
X_half = X[: <span class="fn">len</span>(X) // <span class="num">2</span> + <span class="num">1</span>]
freqs = np.fft.<span class="fn">rfftfreq</span>(<span class="fn">len</span>(x), d=<span class="num">1</span> / sr)
<span class="fn">print</span>(freqs.shape, freqs[<span class="num">0</span>], freqs[-<span class="num">1</span>])   <span class="cm"># 0 Hz to 8000 Hz</span>

<span class="cm"># 4) Magnitude spectrum (most common visualization)</span>
mag = np.<span class="fn">abs</span>(X_half) / <span class="fn">len</span>(x)
<span class="fn">print</span>(<span class="str">"top 3 frequencies:"</span>)
top_bins = np.<span class="fn">argsort</span>(mag)[-<span class="num">3</span>:]
<span class="kw">for</span> b <span class="kw">in</span> top_bins:
    <span class="fn">print</span>(f<span class="str">"  {freqs[b]:.1f} Hz: amplitude {mag[b]:.3f}"</span>)
<span class="cm"># Should print 220, 440, 880 Hz with amplitudes proportional to 0.5, 0.3, 0.15</span>

<span class="cm"># 5) Power spectrum in dB (the "loudness per frequency" view)</span>
power_db = <span class="num">20</span> * np.<span class="fn">log10</span>(mag + <span class="num">1e-10</span>)

<span class="cm"># 6) Use rfft directly for real input -- twice as fast</span>
X_real = np.fft.<span class="fn">rfft</span>(x)
<span class="fn">print</span>(np.<span class="fn">allclose</span>(X_real, X_half))    <span class="cm"># True</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">scipy.fft is browser-friendly. We compute the magnitude spectrum of the preamble's 440 Hz sine and locate the peak.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.fft import rfft, rfftfreq
y = audio
Y = np.abs(rfft(y))
f = rfftfreq(len(y), 1/sr)
peak_idx = int(np.argmax(Y))
print('FFT bins:', Y.shape[0])
print('Peak frequency:', round(f[peak_idx], 1), 'Hz   (expected ~440)')
print('Peak magnitude:', round(float(Y[peak_idx]), 1))
print('Top 3 bins:')
for i in np.argsort(Y)[-3:][::-1]:
    print(f'  {f[i]:8.1f} Hz   mag={Y[i]:.1f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a synthetic test signal: three sine waves of frequencies 220, 440, 880 Hz with amplitudes 1.0, 0.6, 0.3 -- a kind of synthetic chord. 2) <code>np.fft.fft</code> computes the full DFT in O(N log N); for 16000 samples this is millions of operations done in milliseconds. 3) For a real-valued input, the second half of the FFT is the complex conjugate of the first half, so we keep only N/2 + 1 bins. <code>rfftfreq</code> gives the corresponding Hz axis. 4) The magnitude spectrum, normalized by N, recovers the amplitudes of our input sines (with a factor of 1/2 because each real sine splits its energy between positive and negative frequency). The argmax check confirms FFT actually finds 220, 440, 880 Hz. 5) Converting magnitude to dB gives the perceptually meaningful "loudness" axis used in every audio plot. 6) <code>np.fft.rfft</code> skips the redundant negative frequencies -- twice as fast and the standard choice for real audio.</p>

<div id="plot-al2-fft-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Magnitude spectrum of three pure tones at 220 Hz, 440 Hz, and 880 Hz. Three sharp spikes at exactly those frequencies; everything else is noise floor. This is the "ideal" case -- a real audio signal would have hundreds of peaks across the spectrum. The y-axis (log scale) reveals that even a 0.3-amplitude tone is clearly visible above silence.</div>

<div class="l-warn"><strong>Pitfall:</strong> The FFT assumes the input is one period of a periodic signal. If your window of audio does not start and end at the same value, you get "spectral leakage" -- energy spreads from real peaks into nearby bins. Solution: multiply by a window function (Hann, Hamming) before FFT.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. From FFT to Spectrogram: STFT</h2>

<p class="l-text">A single FFT of a 5-second audio clip gives you the average frequency content over those 5 seconds. But speech changes second-by-second: vowel, consonant, silence, new word. We want frequency content as a function of time. The solution is the Short-Time Fourier Transform (STFT): chop the audio into short overlapping windows and FFT each one.</p>

<div class="katex-block">$$\\text{STFT}(x)[m,k] = \\sum_{n=0}^{N-1} x[n + mH] \\, w[n] \\, e^{-2\\pi i kn/N}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">m</div><div class="card-body">Frame index. Time of frame m: m * H / sr seconds.</div></div>
<div class="calc-card"><div class="card-title">k</div><div class="card-body">Frequency bin index. Frequency of bin k: k * sr / N Hz.</div></div>
<div class="calc-card"><div class="card-title">N</div><div class="card-body">FFT size (window length). Typical: 512, 1024, 2048 samples.</div></div>
<div class="calc-card"><div class="card-title">H</div><div class="card-body">Hop length (samples between consecutive frames). Typical: N/4, giving 75% overlap.</div></div>
<div class="calc-card"><div class="card-title">w[n]</div><div class="card-body">Window function. Hann is standard. Tapers the edges to reduce spectral leakage.</div></div>
<div class="calc-card"><div class="card-title">Output shape</div><div class="card-body">(N/2 + 1, M) complex matrix. Magnitude is the spectrogram.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Load 5 seconds of speech</span>
y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">5.0</span>)
<span class="fn">print</span>(y.shape, sr)        <span class="cm"># (80000,) 16000</span>

<span class="cm"># Standard ML STFT settings: 25 ms window, 10 ms hop</span>
n_fft = <span class="num">400</span>            <span class="cm"># 25 ms at 16 kHz</span>
hop = <span class="num">160</span>              <span class="cm"># 10 ms at 16 kHz</span>

<span class="cm"># 1) Compute STFT</span>
S = librosa.<span class="fn">stft</span>(y, n_fft=n_fft, hop_length=hop, window=<span class="str">"hann"</span>)
<span class="fn">print</span>(<span class="str">"STFT shape:"</span>, S.shape)   <span class="cm"># (n_fft/2+1, M) = (201, 501)</span>
<span class="fn">print</span>(<span class="str">"dtype:"</span>, S.dtype)         <span class="cm"># complex64</span>

<span class="cm"># 2) Magnitude spectrogram</span>
mag = np.<span class="fn">abs</span>(S)
<span class="fn">print</span>(<span class="str">"magnitude:"</span>, mag.shape, mag.<span class="fn">min</span>(), mag.<span class="fn">max</span>())

<span class="cm"># 3) Convert to dB (the standard visualization scale)</span>
db = librosa.<span class="fn">amplitude_to_db</span>(mag, ref=np.<span class="fn">max</span>)
<span class="fn">print</span>(<span class="str">"dB range:"</span>, db.<span class="fn">min</span>(), db.<span class="fn">max</span>())

<span class="cm"># 4) Time and frequency axes</span>
times = librosa.<span class="fn">frames_to_time</span>(np.<span class="fn">arange</span>(mag.shape[<span class="num">1</span>]), sr=sr, hop_length=hop)
freqs = librosa.<span class="fn">fft_frequencies</span>(sr=sr, n_fft=n_fft)
<span class="fn">print</span>(<span class="str">"time:"</span>, times[<span class="num">0</span>], <span class="str">"to"</span>, times[-<span class="num">1</span>], <span class="str">"s"</span>)
<span class="fn">print</span>(<span class="str">"freq:"</span>, freqs[<span class="num">0</span>], <span class="str">"to"</span>, freqs[-<span class="num">1</span>], <span class="str">"Hz"</span>)

<span class="cm"># 5) Inverse STFT recovers the original waveform</span>
y_rec = librosa.<span class="fn">istft</span>(S, hop_length=hop, window=<span class="str">"hann"</span>)
<span class="fn">print</span>(<span class="str">"reconstruction error:"</span>, np.<span class="fn">abs</span>(y[:<span class="fn">len</span>(y_rec)] - y_rec).<span class="fn">max</span>())
<span class="cm"># Tiny: STFT/iSTFT round-trip is essentially lossless when overlap is enough</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">STFT via scipy.signal.stft — same time-frequency representation librosa.stft returns.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
S = np.abs(Z)
print('STFT shape (freq, time):', S.shape)
print('Frequency bins span:', round(f[0], 1), '→', round(f[-1], 1), 'Hz')
print('Time frames span   :', round(t[0], 3), '→', round(t[-1], 3), 's')
peak_f = f[int(np.argmax(S.mean(axis=1)))]
print('Dominant frequency over clip:', round(float(peak_f), 1), 'Hz')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads a libri-light example as 5 seconds of clean speech. 2) Defines window length 400 samples (25 ms) and hop 160 samples (10 ms) -- the standard ML settings used by Whisper, wav2vec, and most speech models. 3) <code>librosa.stft</code> applies a Hann window, FFTs each frame, and stacks them. The output shape is (201 frequency bins, 501 time frames) -- a 2D image of speech in the frequency domain. 4) Magnitude is the most common spectrogram view; complex STFT is needed only when you want to invert it. 5) <code>amplitude_to_db</code> converts to dB scale relative to the loudest frame, putting silence near -80 dB and peaks at 0 dB. 6) Time and frequency axes for plotting; frame m is at time m * hop / sr. 7) Inverse STFT recovers the original audio almost exactly when the window overlap is sufficient (75% with Hann). This is what TTS vocoders use to convert predicted spectrograms back to audio.</p>

<div id="plot-al2-spec-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A spectrogram of a synthetic speech-like signal. Time on the x-axis (0 to 3 seconds), frequency on the y-axis (0 to 4 kHz), color intensity = log magnitude. Bright horizontal stripes are formants -- the vocal tract resonances that distinguish vowels. Vertical stripes are consonants. Silences appear as dark gaps. Every speech model takes something like this image as input and learns directly from it.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Window Size Trade-Off</h2>

<p class="l-text">The choice of window size is fundamental and has a clean trade-off: long windows give good frequency resolution but poor time resolution; short windows give the opposite. There is no free lunch (this is the Heisenberg uncertainty principle of signal processing).</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Short window (e.g. 10 ms)</div><div class="compare-item">Sees fast changes</div><div class="compare-item">Coarse frequency resolution (~100 Hz bins)</div><div class="compare-item">Good for transients (drums, plosives)</div><div class="compare-item">More frames to process</div></div>
<div class="compare-col"><div class="compare-title">Long window (e.g. 100 ms)</div><div class="compare-item">Smooth frequency resolution (~10 Hz bins)</div><div class="compare-item">Blurs fast time changes</div><div class="compare-item">Good for steady tones (sustained vowels, music)</div><div class="compare-item">Fewer frames</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"trumpet"</span>), sr=<span class="num">16000</span>)

<span class="cm"># Short window: 8 ms = 128 samples. Time res ~8 ms, freq res 125 Hz/bin</span>
S_short = librosa.<span class="fn">stft</span>(y, n_fft=<span class="num">128</span>, hop_length=<span class="num">32</span>)
<span class="fn">print</span>(<span class="str">"short:"</span>, S_short.shape)        <span class="cm"># (65, M_short)</span>

<span class="cm"># Standard window: 25 ms = 400 samples. Time res ~10 ms, freq res 40 Hz/bin</span>
S_std = librosa.<span class="fn">stft</span>(y, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>)
<span class="fn">print</span>(<span class="str">"std:  "</span>, S_std.shape)          <span class="cm"># (201, M_std)</span>

<span class="cm"># Long window: 100 ms = 1600 samples. Time res ~25 ms, freq res 10 Hz/bin</span>
S_long = librosa.<span class="fn">stft</span>(y, n_fft=<span class="num">1600</span>, hop_length=<span class="num">400</span>)
<span class="fn">print</span>(<span class="str">"long: "</span>, S_long.shape)         <span class="cm"># (801, M_long)</span>

<span class="cm"># Frequency resolution = sr / n_fft</span>
<span class="fn">print</span>(<span class="str">"short freq res:"</span>, sr / <span class="num">128</span>, <span class="str">"Hz/bin"</span>)
<span class="fn">print</span>(<span class="str">"std freq res:  "</span>, sr / <span class="num">400</span>, <span class="str">"Hz/bin"</span>)
<span class="fn">print</span>(<span class="str">"long freq res: "</span>, sr / <span class="num">1600</span>, <span class="str">"Hz/bin"</span>)

<span class="cm"># Time resolution = hop_length / sr</span>
<span class="fn">print</span>(<span class="str">"short time res:"</span>, <span class="num">32</span> / sr * <span class="num">1000</span>, <span class="str">"ms/frame"</span>)
<span class="fn">print</span>(<span class="str">"std time res:  "</span>, <span class="num">160</span> / sr * <span class="num">1000</span>, <span class="str">"ms/frame"</span>)
<span class="fn">print</span>(<span class="str">"long time res: "</span>, <span class="num">400</span> / sr * <span class="num">1000</span>, <span class="str">"ms/frame"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Spectrogram in dB — ready to be visualized or fed to a downstream classifier.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
S = np.abs(Z) ** 2
S_db = 10 * np.log10(S + 1e-10)
print('Power spectrogram :', S.shape, ' dtype', S.dtype)
print('dB range          :', round(float(S_db.min()), 1), '→', round(float(S_db.max()), 1), 'dB')
print('Mean dB per band (first 5):', np.round(S_db.mean(axis=1)[:5], 1))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads a trumpet sample as a benchmark. 2) Computes three STFTs with different window/hop sizes and prints their shapes. Short window: 65 frequency bins, many time frames. Long window: 801 frequency bins, few time frames. Same audio, different views. 3) Frequency resolution per bin is <code>sr / n_fft</code> -- a smaller window means coarser bins. 4) Time resolution per frame is <code>hop_length / sr</code>. 5) The product of frequency resolution and time resolution is constant -- this is the time-frequency uncertainty.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: why 25 ms is the speech standard</div><div class="example-body">Speech phonemes typically last 50-100 ms. A 25 ms window with 10 ms hop captures phoneme onset/offset clearly while the 40 Hz frequency resolution easily resolves formants (typically separated by hundreds of Hz). Shorter windows would miss formant structure; longer windows would smear consonant transitions. Empirically these settings have been the default since the 1970s.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Power, Phase, and Reconstruction</h2>

<p class="l-text">The STFT is a complex matrix. Its magnitude is the spectrogram you usually visualize and feed to models. The phase is harder to interpret but essential for reconstructing audio from a spectrogram.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">3.0</span>)

<span class="cm"># Complex STFT</span>
S = librosa.<span class="fn">stft</span>(y, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>)

<span class="cm"># 1) Magnitude and phase: the polar form of the complex matrix</span>
mag = np.<span class="fn">abs</span>(S)
phase = np.<span class="fn">angle</span>(S)
<span class="fn">print</span>(<span class="str">"mag:"</span>, mag.shape, mag.<span class="fn">min</span>(), mag.<span class="fn">max</span>())
<span class="fn">print</span>(<span class="str">"phase:"</span>, phase.shape, phase.<span class="fn">min</span>(), phase.<span class="fn">max</span>())  <span class="cm"># [-pi, pi]</span>

<span class="cm"># 2) Power spectrogram = magnitude squared</span>
power = mag ** <span class="num">2</span>
power_db = librosa.<span class="fn">power_to_db</span>(power, ref=np.<span class="fn">max</span>)

<span class="cm"># 3) Reconstruction with original phase: lossless</span>
y1 = librosa.<span class="fn">istft</span>(mag * np.<span class="fn">exp</span>(<span class="num">1j</span> * phase), hop_length=<span class="num">160</span>)
err1 = np.<span class="fn">abs</span>(y[:<span class="fn">len</span>(y1)] - y1).<span class="fn">max</span>()
<span class="fn">print</span>(<span class="str">"with original phase:"</span>, err1)            <span class="cm"># ~1e-7</span>

<span class="cm"># 4) Reconstruction with random phase: noisy</span>
random_phase = np.random.<span class="fn">uniform</span>(-np.pi, np.pi, mag.shape)
y2 = librosa.<span class="fn">istft</span>(mag * np.<span class="fn">exp</span>(<span class="num">1j</span> * random_phase), hop_length=<span class="num">160</span>)
err2 = np.<span class="fn">abs</span>(y[:<span class="fn">len</span>(y2)] - y2).<span class="fn">max</span>()
<span class="fn">print</span>(<span class="str">"with random phase:"</span>, err2)              <span class="cm"># ~0.5, badly distorted</span>

<span class="cm"># 5) Griffin-Lim: estimate phase from magnitude alone (used in classic vocoders)</span>
y3 = librosa.<span class="fn">griffinlim</span>(mag, n_iter=<span class="num">32</span>, hop_length=<span class="num">160</span>)
err3 = np.<span class="fn">abs</span>(y[:<span class="fn">len</span>(y3)] - y3).<span class="fn">max</span>()
<span class="fn">print</span>(<span class="str">"griffin-lim:"</span>, err3)                    <span class="cm"># ~0.05, mostly intelligible</span>
<span class="cm"># Modern TTS systems use a learned vocoder (HiFi-GAN) instead, far better quality</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Magnitude/phase decomposition — STFT is complex; magnitude is what you usually visualize.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
mag = np.abs(Z)
phase = np.angle(Z)
print('Z complex     :', Z.shape, Z.dtype)
print('|Z| magnitude :', mag.shape, '  range', round(float(mag.min()), 4), '→', round(float(mag.max()), 4))
print('∠Z phase rad  :', phase.shape, ' range', round(float(phase.min()), 3), '→', round(float(phase.max()), 3))
# Reconstruct via inverse STFT (lossless when both mag+phase kept)
_, y_rec = signal.istft(Z, fs=sr, nperseg=512, noverlap=256)
print('Reconstruction error:', round(float(np.mean((y_rec[:len(audio)] - audio)**2)), 8))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Splits the complex STFT into magnitude and phase -- the polar form of complex numbers. Magnitude is the "what frequencies are present" part; phase is the "where in their cycle they are at this moment" part. 2) Power is magnitude squared; perceptually meaningful loudness scale. 3) Reconstructing with the original phase recovers the signal almost exactly -- a sanity check that STFT is invertible. 4) Reconstructing with random phase produces a hissy, distorted version of the same audio: same energy distribution, wrong temporal structure. This is why phase matters. 5) Griffin-Lim iteratively estimates a consistent phase from magnitude alone; it sounds OK but not great. Modern TTS uses a neural vocoder (HiFi-GAN, WaveGlow) that learns to map magnitude spectrograms directly to audio with higher quality.</p>

<div class="l-note"><strong>Why ML models discard phase:</strong> human hearing is much more sensitive to magnitude than phase. A model that classifies music genre or transcribes speech can ignore phase entirely and lose almost no information. Generation tasks (TTS, music synthesis) need phase, so they use a learned vocoder.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Visualizing Spectrograms with librosa</h2>

<p class="l-text">librosa ships a high-level helper that produces publication-quality spectrograms in two lines.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> librosa.display
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">5.0</span>)

<span class="cm"># 1) Compute spectrogram in dB scale</span>
S = librosa.<span class="fn">stft</span>(y, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>)
S_db = librosa.<span class="fn">amplitude_to_db</span>(np.<span class="fn">abs</span>(S), ref=np.<span class="fn">max</span>)

<span class="cm"># 2) Plot with librosa's specshow</span>
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">10</span>, <span class="num">4</span>))
img = librosa.display.<span class="fn">specshow</span>(
    S_db, sr=sr, hop_length=<span class="num">160</span>,
    x_axis=<span class="str">"time"</span>, y_axis=<span class="str">"hz"</span>,
    cmap=<span class="str">"magma"</span>, ax=ax
)
ax.<span class="fn">set_title</span>(<span class="str">"Linear-frequency spectrogram"</span>)
fig.<span class="fn">colorbar</span>(img, ax=ax, format=<span class="str">"%+2.0f dB"</span>)
plt.<span class="fn">tight_layout</span>()
plt.<span class="fn">show</span>()

<span class="cm"># 3) Log-frequency view (closer to perception)</span>
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">10</span>, <span class="num">4</span>))
img = librosa.display.<span class="fn">specshow</span>(
    S_db, sr=sr, hop_length=<span class="num">160</span>,
    x_axis=<span class="str">"time"</span>, y_axis=<span class="str">"log"</span>,
    cmap=<span class="str">"magma"</span>, ax=ax
)
ax.<span class="fn">set_title</span>(<span class="str">"Log-frequency spectrogram"</span>)
fig.<span class="fn">colorbar</span>(img, ax=ax, format=<span class="str">"%+2.0f dB"</span>)
plt.<span class="fn">tight_layout</span>()
plt.<span class="fn">show</span>()

<span class="cm"># 4) Save as numpy for ML training</span>
np.<span class="fn">save</span>(<span class="str">"speech_spec.npy"</span>, S_db)
<span class="fn">print</span>(<span class="str">"saved spectrogram of shape"</span>, S_db.shape)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">specshow-style summary: build the dB spectrogram and print frame-level loudness.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=400, noverlap=200)
S_db = 20 * np.log10(np.abs(Z) + 1e-10)
frame_loudness = S_db.mean(axis=0)
print('Frames    :', len(t))
print('Loudest 5 frames:')
for i in np.argsort(frame_loudness)[-5:][::-1]:
    print(f'  t={t[i]:.3f}s  mean dB={frame_loudness[i]:.1f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Computes a standard STFT and converts magnitude to dB. <code>ref=np.max</code> means the loudest frame becomes 0 dB; everything else is negative. 2) <code>librosa.display.specshow</code> auto-generates the time and frequency axes from the array shape and the sample rate. The <code>magma</code> colormap is the audio community's default -- bright = loud, dark = silent. 3) The log-frequency view spaces frequency bins logarithmically so each octave gets equal pixels; this matches how humans perceive pitch. The next lesson generalizes this with the mel scale. 4) Saving the dB spectrogram as numpy gives you a ready-to-use feature matrix for ML training -- this is what NumPy/PyTorch dataloaders typically read.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: a one-line spectrogram pipeline</div><div class="example-body">For a deep model training loop you would write: <code>def to_spec(y, sr=16000): return librosa.amplitude_to_db(np.abs(librosa.stft(y, n_fft=400, hop_length=160)), ref=np.max)</code>. One line, returns a (201, M) float32 matrix per audio clip. Pad/truncate to a fixed length, stack into a batch, feed to a 2D CNN. This is the most common audio ML pipeline below transformer-era models.</div></div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> The Fourier transform decomposes any signal into a sum of pure sine waves of different frequencies.<br><strong>2.</strong> The DFT formula: <code>X[k] = sum x[n] * exp(-2 pi i k n / N)</code>. The FFT computes this in O(N log N).<br><strong>3.</strong> For real input use <code>np.fft.rfft</code> -- twice as fast as <code>fft</code>.<br><strong>4.</strong> A single FFT averages over time; the STFT chops audio into windows and FFTs each. Output is a 2D complex matrix.<br><strong>5.</strong> Standard ML STFT settings: 25 ms window, 10 ms hop, Hann window, 16 kHz mono input.<br><strong>6.</strong> Window size has a fundamental trade-off: longer = better frequency resolution but worse time resolution.<br><strong>7.</strong> Magnitude spectrograms are what most models consume; phase matters only for audio reconstruction.<br><strong>8.</strong> Next lesson: the mel scale and MFCCs -- adapting the spectrogram to human hearing.</div></div>
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

  function fftPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var freqs = [];
    var mags = [];
    for (var f=0;f<=2000;f+=10) {
      freqs.push(f);
      var m = 0.001;
      m += 0.5 * Math.exp(-Math.pow((f-220)/8, 2));
      m += 0.3 * Math.exp(-Math.pow((f-440)/8, 2));
      m += 0.15 * Math.exp(-Math.pow((f-880)/8, 2));
      mags.push(m);
    }
    var trace = {x:freqs, y:mags, mode:'lines', line:{color:T.accent, width:2}, fill:'tozeroy', fillcolor:'rgba(200,169,110,0.18)', name:lang==='tr'?'büyüklük':'magnitude'};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Üç Saf Tonun Genlik Spektrumu':'Magnitude Spectrum of Three Pure Tones', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'frekans (Hz)':'frequency (Hz)', gridcolor:T.grid, zerolinecolor:T.zero, range:[0,1500]},
      yaxis:{title:lang==='tr'?'genlik':'magnitude', gridcolor:T.grid, zerolinecolor:T.zero, type:'log', range:[-3.5, 0]}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  function specPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var T_frames = 80, F_bins = 64;
    var z = [];
    for (var fi=0;fi<F_bins;fi++) {
      var row = [];
      for (var ti=0;ti<T_frames;ti++) {
        var t_s = ti/T_frames * 3;
        var f_hz = fi/F_bins * 4000;
        var v = -50;
        // Three "vowels" with formant patterns
        var vowel_centers = [[0.4, [300, 2300, 3000]],[1.4, [500, 1500, 2500]],[2.4, [700, 1100, 2400]]];
        for (var k=0;k<vowel_centers.length;k++){
          var c = vowel_centers[k];
          if (Math.abs(t_s - c[0]) < 0.5) {
            for (var fk=0;fk<c[1].length;fk++) {
              v = Math.max(v, -10 - 0.3*Math.pow((f_hz - c[1][fk])/100, 2) - 30*Math.abs(t_s-c[0]));
            }
          }
        }
        // Background hiss
        v = Math.max(v, -55 + Math.random()*5);
        row.push(v);
      }
      z.push(row);
    }
    var times = []; for (var i=0;i<T_frames;i++) times.push(i/T_frames * 3);
    var freqs = []; for (var i=0;i<F_bins;i++) freqs.push(i/F_bins * 4000);
    var trace = {z:z, x:times, y:freqs, type:'heatmap', colorscale:[[0,'#1a0e2e'],[0.3,'#5a2068'],[0.6,'#c84068'],[0.85,'#f59f4a'],[1,'#fef0a4']], showscale:true, colorbar:{title:'dB', titlefont:{color:T.text}, tickfont:{color:T.text}}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Konuşma Spektrogramı (3 sesli harf)':'Speech Spectrogram (3 vowels)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman (s)':'time (s)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'frekans (Hz)':'frequency (Hz)', gridcolor:T.grid, zerolinecolor:T.zero}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  fftPlot('plot-al2-fft-en','en');
  specPlot('plot-al2-spec-en','en');
  fftPlot('plot-al2-fft-tr','tr');
  specPlot('plot-al2-spec-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Zaman alanı bir şeyin ne zaman olduğunu gösterir; frekans alanı ne olduğunu gösterir.</strong> Dalga formu size "0.5 s'de yüksek, 1.0 s'de sessiz, 1.2 s'de tekrar yüksek" der. Spektrum size "220 Hz ve 440 Hz'de çok enerji, 5 kHz'de yok" der. ML için frekans alanı neredeyse her zaman daha iyi temsildir -- "ee" sesinin "oo" sesinden farklı görünmesini sağlayan ve kemanın flütten farklı görünmesini sağlayan budur.</p>

<p class="l-text">Bu ders Fourier dönüşümünü sezgisel olarak, Ayrık Fourier Dönüşümü formülünü, Hızlı Fourier Dönüşümü algoritmasını (FFT) ve her ses modelinin tükettiği spektrogramı üreten Kısa Süreli Fourier Dönüşümü'nü (STFT) kapsar. Sonunda herhangi bir ses dizisini üç satır librosa kodu ile spektrograma dönüştürebilirsiniz -- ve bu üç satırın tam olarak ne yaptığını bileceksiniz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sinyali Fourier Dönüşümü ile sinüslere ayırma sezgisi geliştireceksin</li>
<li>Ayrık Fourier Dönüşümü toplamını çıkarıp FFT bin formülünü okuyacaksın</li>
<li>numpy.fft ile Python'da FFT hesaplayıp tepe frekansları bulacaksın</li>
<li>Hop ve window ile STFT uygulayıp zaman-frekans spektrogramı üreteceksin</li>
<li>Pencere boyutunu 256 vs 2048 seçerek zaman-frekans çözünürlüğü değiş tokuş edeceksin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Fourier Dönüşümü: Sezgi</h2>

<p class="l-text">Joseph Fourier, herhangi bir sinyalin -- ne kadar karmaşık olursa olsun -- farklı frekanslarda, genliklerde ve fazlarda saf sinüs dalgalarının toplamına ayrıştırılabileceğini keşfetti. Bir piyano akoru her notanın sinüs dalgalarının toplamıdır. Bir sesli harf formantlarının sinüs dalgalarının toplamıdır. Bir davul vuruşu spektrum boyunca geniş yayılmış birçok sinüs dalgasının toplamıdır.</p>

<div class="calc-highlight"><strong>Fourier dönüşümü zaman sinyalini frekans listesine dönüştürür.</strong> Giriş: N örneklik bir dizi. Çıkış: N karmaşık sayıdan oluşan bir dizi. Çıktının k indeksi size "girişte k frekansından ne kadar var" der. Büyüklük miktardır, açı fazdır.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Saf sinüs</div><div class="card-body">Tek frekanslı bir sinyal. FFT'si tam olarak tek bir bölmede enerjiye sahiptir.</div></div>
<div class="calc-card"><div class="card-title">Sinüs toplamı</div><div class="card-body">K frekanslı bir sinyal. FFT'si tam olarak K bölmede enerjiye sahiptir.</div></div>
<div class="calc-card"><div class="card-title">Gerçek sinyal</div><div class="card-body">Konuşma, müzik. FFT birçok bölmede enerjiye sahiptir -- spektrum.</div></div>
<div class="calc-card"><div class="card-title">Büyüklük</div><div class="card-body">|X[k]| = k frekansının ne kadar güçlü olduğu. Genellikle çizdiğiniz şey budur.</div></div>
<div class="calc-card"><div class="card-title">Faz</div><div class="card-body">arg(X[k]) = k frekansının döngüsünde nerede olduğu. Algısal olarak daha az önemli.</div></div>
<div class="calc-card"><div class="card-title">Ters FFT</div><div class="card-body">Kayıpsız: ifft(fft(x)) tam olarak x'i döner. Frekans ve zaman alanları eşdeğerdir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: sesli harfler formantlardır</div><div class="example-body">"ee" derken ses yolu kabaca 270 Hz, 2300 Hz ve 3000 Hz'de rezonansa sahiptir. "oo" derken rezonanslar 300 Hz, 870 Hz ve 2240 Hz'e kayar. Her iki sinyal de zaman alanında gürültülü ve karmaşıktır. Frekans alanında ayırt edilmesi kolaydır: belirgin frekanslarda belirgin tepeler. Bu yüzden her konuşma modeli frekans uzayında çalışır.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Ayrık Fourier Dönüşümü Formülü</h2>

<p class="l-text">N örneklik bir sinyal için DFT şöyle tanımlanır:</p>

<div class="katex-block">$$X[k] = \\sum_{n=0}^{N-1} x[n] \\, e^{-2\\pi i kn/N}, \\qquad k = 0, 1, \\ldots, N-1$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x[n]</div><div class="card-body">Zaman indeksi n'de giriş örneği. Ses dizinizden gerçek sayı.</div></div>
<div class="calc-card"><div class="card-title">X[k]</div><div class="card-body">Frekans bölmesi k'da çıkış karmaşık katsayı. Büyüklük = o frekansın ne kadar mevcut olduğu.</div></div>
<div class="calc-card"><div class="card-title">N</div><div class="card-body">Giriş penceresindeki örnek sayısı. Aynı zamanda çıkış bölmelerinin sayısı.</div></div>
<div class="calc-card"><div class="card-title">k</div><div class="card-body">Frekans indeksi, 0 ile N-1 arası. Hz cinsinden gerçek frekans: f_k = k * sr / N.</div></div>
<div class="calc-card"><div class="card-title">e^(-2 pi i k n / N)</div><div class="card-body">Pencere boyunca k kez dönen karmaşık sinüzoid. k bölmesi için "temel fonksiyon".</div></div>
<div class="calc-card"><div class="card-title">Toplam</div><div class="card-body">x'in temel ile iç çarpımı. x, k frekansında salındığında büyüktür; aksi halde sıfıra yakın.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: bölme-Hz eşlemesi</div><div class="example-body">N = 1024 örnek, örnekleme oranı 16 kHz. Frekans çözünürlüğü: bölme başına <code>16000 / 1024 = 15.625 Hz</code>. Bölme 0 DC'dir (0 Hz). Bölme 1, 15.625 Hz'dir. Bölme 64, 1000 Hz'dir. Bölme 512, 8000 Hz'dir (Nyquist). İkinci yarı (bölmeler 513-1023) gerçek giriş için ilk yarının karmaşık eşleniğidir -- bu yüzden yalnızca ilk <code>N/2 + 1 = 513</code> bölmeyi tutarız.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Python'da FFT</h2>

<p class="l-text">DFT formülünün maliyeti O(N^2)'dir; Hızlı Fourier Dönüşümü (FFT) aynı sonucu O(N log N)'de hesaplar. Bilgisayar biliminin en önemli algoritmalarından biridir. NumPy ve SciPy yüksek kaliteli uygulamalarla gelir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> librosa

<span class="cm"># 1) Sentetik sinyal: üç saf tonun toplamı</span>
sr = <span class="num">16000</span>
dur = <span class="num">1.0</span>
t = np.<span class="fn">linspace</span>(<span class="num">0</span>, dur, <span class="fn">int</span>(sr * dur), endpoint=<span class="kw">False</span>)
x = (<span class="num">1.0</span> * np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*<span class="num">220</span>*t)
   + <span class="num">0.6</span> * np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*<span class="num">440</span>*t)
   + <span class="num">0.3</span> * np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*<span class="num">880</span>*t))
<span class="fn">print</span>(x.shape, x.dtype)

<span class="cm"># 2) FFT'yi hesapla</span>
X = np.fft.<span class="fn">fft</span>(x)
<span class="fn">print</span>(X.shape, X.dtype)         <span class="cm"># (16000,) complex128</span>

<span class="cm"># 3) Gerçek sinyaller için yalnızca ilk yarı bilgilendiricidir</span>
X_half = X[: <span class="fn">len</span>(X) // <span class="num">2</span> + <span class="num">1</span>]
freqs = np.fft.<span class="fn">rfftfreq</span>(<span class="fn">len</span>(x), d=<span class="num">1</span> / sr)
<span class="fn">print</span>(freqs.shape, freqs[<span class="num">0</span>], freqs[-<span class="num">1</span>])   <span class="cm"># 0 Hz - 8000 Hz</span>

<span class="cm"># 4) Genlik spektrumu (en yaygın görselleştirme)</span>
mag = np.<span class="fn">abs</span>(X_half) / <span class="fn">len</span>(x)
<span class="fn">print</span>(<span class="str">"en yuksek 3 frekans:"</span>)
top_bins = np.<span class="fn">argsort</span>(mag)[-<span class="num">3</span>:]
<span class="kw">for</span> b <span class="kw">in</span> top_bins:
    <span class="fn">print</span>(f<span class="str">"  {freqs[b]:.1f} Hz: genlik {mag[b]:.3f}"</span>)
<span class="cm"># 220, 440, 880 Hz yazdırmalı, genlikler 0.5, 0.3, 0.15 ile orantılı</span>

<span class="cm"># 5) dB cinsinden güç spektrumu ("frekans başına yükseklik" görünümü)</span>
power_db = <span class="num">20</span> * np.<span class="fn">log10</span>(mag + <span class="num">1e-10</span>)

<span class="cm"># 6) Gerçek girdi için doğrudan rfft kullan -- iki kat hızlı</span>
X_real = np.fft.<span class="fn">rfft</span>(x)
<span class="fn">print</span>(np.<span class="fn">allclose</span>(X_real, X_half))    <span class="cm"># True</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">scipy.fft tarayıcı dostudur. Preamble'ın 440 Hz sinüsünün büyüklük spektrumunu hesaplıyor ve tepeyi buluyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.fft import rfft, rfftfreq
y = audio
Y = np.abs(rfft(y))
f = rfftfreq(len(y), 1/sr)
peak_idx = int(np.argmax(Y))
print('FFT bin sayısı:', Y.shape[0])
print('Tepe frekans:', round(f[peak_idx], 1), 'Hz   (beklenen ~440)')
print('Tepe büyüklük:', round(float(Y[peak_idx]), 1))
print('En yüksek 3 bin:')
for i in np.argsort(Y)[-3:][::-1]:
    print(f'  {f[i]:8.1f} Hz   büyüklük={Y[i]:.1f}')</code></pre></div>
</div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Sentetik bir test sinyali oluşturur: 220, 440, 880 Hz frekanslarında genlikleri 1.0, 0.6, 0.3 olan üç sinüs dalgası -- bir tür sentetik akor. 2) <code>np.fft.fft</code> tam DFT'yi O(N log N)'de hesaplar; 16000 örnek için bu milyonlarca işlem milisaniyeler içinde yapılır. 3) Gerçek değerli girdi için FFT'nin ikinci yarısı ilk yarının karmaşık eşleniğidir, bu yüzden yalnızca N/2 + 1 bölmeyi tutarız. <code>rfftfreq</code> karşılık gelen Hz eksenini verir. 4) N'ye normalize edilen genlik spektrumu giriş sinüslerimizin genliklerini geri kazandırır (her gerçek sinüs enerjisini pozitif ve negatif frekans arasında böldüğü için 1/2 faktörüyle). Argmax kontrolü FFT'nin gerçekten 220, 440, 880 Hz bulduğunu doğrular. 5) Genliği dB'ye dönüştürmek her ses çiziminde kullanılan algısal olarak anlamlı "yükseklik" eksenini verir. 6) <code>np.fft.rfft</code> gereksiz negatif frekansları atlar -- iki kat daha hızlı ve gerçek ses için standart seçim.</p>

<div id="plot-al2-fft-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> 220 Hz, 440 Hz ve 880 Hz'de üç saf tonun genlik spektrumu. Tam olarak o frekanslarda üç keskin sivri uç; geri kalan her şey gürültü tabanıdır. Bu "ideal" durumdur -- gerçek bir ses sinyali spektrum boyunca yüzlerce tepeye sahip olurdu. Y ekseni (log ölçek) 0.3 genlikli bir tonun bile sessizliğin üzerinde net görünür olduğunu gösterir.</div>

<div class="l-warn"><strong>Tuzak:</strong> FFT girişin periyodik bir sinyalin bir periyodu olduğunu varsayar. Ses pencereniz aynı değerle başlamaz ve bitmezse "spektral sızıntı" alırsınız -- enerji gerçek tepelerden yakındaki bölmelere yayılır. Çözüm: FFT'den önce bir pencere fonksiyonuyla (Hann, Hamming) çarpın.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. FFT'den Spektrograma: STFT</h2>

<p class="l-text">5 saniyelik bir ses klibinin tek bir FFT'si size o 5 saniye boyunca ortalama frekans içeriğini verir. Ama konuşma saniyeden saniyeye değişir: sesli harf, sessiz harf, sessizlik, yeni kelime. Frekans içeriğini zamanın bir fonksiyonu olarak istiyoruz. Çözüm Kısa Süreli Fourier Dönüşümü'dür (STFT): sesi kısa örtüşen pencerelere bölün ve her birini FFT'leyin.</p>

<div class="katex-block">$$\\text{STFT}(x)[m,k] = \\sum_{n=0}^{N-1} x[n + mH] \\, w[n] \\, e^{-2\\pi i kn/N}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">m</div><div class="card-body">Çerçeve indeksi. m çerçevesinin zamanı: m * H / sr saniye.</div></div>
<div class="calc-card"><div class="card-title">k</div><div class="card-body">Frekans bölmesi indeksi. k bölmesinin frekansı: k * sr / N Hz.</div></div>
<div class="calc-card"><div class="card-title">N</div><div class="card-body">FFT boyutu (pencere uzunluğu). Tipik: 512, 1024, 2048 örnek.</div></div>
<div class="calc-card"><div class="card-title">H</div><div class="card-body">Sıçrama uzunluğu (ardışık çerçeveler arası örnek). Tipik: N/4, %75 örtüşme verir.</div></div>
<div class="calc-card"><div class="card-title">w[n]</div><div class="card-body">Pencere fonksiyonu. Hann standarttır. Spektral sızıntıyı azaltmak için kenarları daraltır.</div></div>
<div class="calc-card"><div class="card-title">Çıkış şekli</div><div class="card-body">(N/2 + 1, M) karmaşık matris. Büyüklük spektrogramdır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 5 saniye konuşma yükle</span>
y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">5.0</span>)
<span class="fn">print</span>(y.shape, sr)        <span class="cm"># (80000,) 16000</span>

<span class="cm"># Standart ML STFT ayarları: 25 ms pencere, 10 ms sıçrama</span>
n_fft = <span class="num">400</span>            <span class="cm"># 16 kHz'de 25 ms</span>
hop = <span class="num">160</span>              <span class="cm"># 16 kHz'de 10 ms</span>

<span class="cm"># 1) STFT'yi hesapla</span>
S = librosa.<span class="fn">stft</span>(y, n_fft=n_fft, hop_length=hop, window=<span class="str">"hann"</span>)
<span class="fn">print</span>(<span class="str">"STFT sekli:"</span>, S.shape)   <span class="cm"># (n_fft/2+1, M) = (201, 501)</span>
<span class="fn">print</span>(<span class="str">"dtype:"</span>, S.dtype)          <span class="cm"># complex64</span>

<span class="cm"># 2) Genlik spektrogramı</span>
mag = np.<span class="fn">abs</span>(S)
<span class="fn">print</span>(<span class="str">"genlik:"</span>, mag.shape, mag.<span class="fn">min</span>(), mag.<span class="fn">max</span>())

<span class="cm"># 3) dB'ye dönüştür (standart görselleştirme ölçeği)</span>
db = librosa.<span class="fn">amplitude_to_db</span>(mag, ref=np.<span class="fn">max</span>)
<span class="fn">print</span>(<span class="str">"dB araligi:"</span>, db.<span class="fn">min</span>(), db.<span class="fn">max</span>())

<span class="cm"># 4) Zaman ve frekans eksenleri</span>
times = librosa.<span class="fn">frames_to_time</span>(np.<span class="fn">arange</span>(mag.shape[<span class="num">1</span>]), sr=sr, hop_length=hop)
freqs = librosa.<span class="fn">fft_frequencies</span>(sr=sr, n_fft=n_fft)
<span class="fn">print</span>(<span class="str">"zaman:"</span>, times[<span class="num">0</span>], <span class="str">"-"</span>, times[-<span class="num">1</span>], <span class="str">"s"</span>)
<span class="fn">print</span>(<span class="str">"frekans:"</span>, freqs[<span class="num">0</span>], <span class="str">"-"</span>, freqs[-<span class="num">1</span>], <span class="str">"Hz"</span>)

<span class="cm"># 5) Ters STFT orijinal dalga formunu geri kazandırır</span>
y_rec = librosa.<span class="fn">istft</span>(S, hop_length=hop, window=<span class="str">"hann"</span>)
<span class="fn">print</span>(<span class="str">"yeniden yapilanma hatasi:"</span>, np.<span class="fn">abs</span>(y[:<span class="fn">len</span>(y_rec)] - y_rec).<span class="fn">max</span>())
<span class="cm"># Çok küçük: yeterli örtüşme olduğunda STFT/iSTFT gidiş-dönüşü esasen kayıpsızdır</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">scipy.signal.stft ile STFT — librosa.stft'in döndürdüğü zaman-frekans temsilinin aynısı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
S = np.abs(Z)
print('STFT şekli (frekans, zaman):', S.shape)
print('Frekans bin aralığı:', round(f[0], 1), '→', round(f[-1], 1), 'Hz')
print('Zaman çerçeve aralığı:', round(t[0], 3), '→', round(t[-1], 3), 's')
peak_f = f[int(np.argmax(S.mean(axis=1)))]
print('Klip üzerinde baskın frekans:', round(float(peak_f), 1), 'Hz')</code></pre></div>
</div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) 5 saniye temiz konuşma olarak bir libri-light örneği yükler. 2) 400 örnek (25 ms) pencere uzunluğu ve 160 örnek (10 ms) sıçrama tanımlar -- Whisper, wav2vec ve çoğu konuşma modelinin kullandığı standart ML ayarları. 3) <code>librosa.stft</code> bir Hann penceresi uygular, her çerçeveyi FFT'ler ve yığar. Çıkış şekli (201 frekans bölmesi, 501 zaman çerçevesi)'dir -- frekans alanında konuşmanın 2B bir görüntüsü. 4) Büyüklük en yaygın spektrogram görünümüdür; karmaşık STFT yalnızca onu tersine çevirmek istediğinizde gerekir. 5) <code>amplitude_to_db</code> en yüksek çerçeveye göre dB ölçeğine dönüştürür, sessizliği -80 dB civarına ve tepeleri 0 dB'ye yerleştirir. 6) Çizim için zaman ve frekans eksenleri; m çerçevesi m * hop / sr zamanındadır. 7) Pencere örtüşmesi yeterli olduğunda (Hann ile %75) ters STFT orijinal sesi neredeyse tam olarak geri kazandırır. Bu, TTS vokoderlerinin tahmin edilen spektrogramları ses olarak geri dönüştürmek için kullandığı şeydir.</p>

<div id="plot-al2-spec-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Konuşma benzeri sentetik bir sinyalin spektrogramı. X ekseninde zaman (0 - 3 saniye), y ekseninde frekans (0 - 4 kHz), renk yoğunluğu = log büyüklük. Parlak yatay çizgiler formantlardır -- sesli harfleri ayıran ses yolu rezonansları. Dikey çizgiler sessiz harflerdir. Sessizlikler karanlık boşluklar olarak görünür. Her konuşma modeli buna benzer bir görüntüyü girdi olarak alır ve doğrudan ondan öğrenir.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Pencere Boyutu Ödünleşimi</h2>

<p class="l-text">Pencere boyutu seçimi temeldir ve net bir ödünleşim vardır: uzun pencereler iyi frekans çözünürlüğü ama kötü zaman çözünürlüğü verir; kısa pencereler tersini verir. Bedava öğle yemeği yoktur (bu sinyal işlemenin Heisenberg belirsizlik ilkesidir).</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Kısa pencere (örn. 10 ms)</div><div class="compare-item">Hızlı değişimleri görür</div><div class="compare-item">Kaba frekans çözünürlüğü (~100 Hz bölmeler)</div><div class="compare-item">Geçici olaylar için iyi (davullar, patlayıcılar)</div><div class="compare-item">İşlenecek daha çok çerçeve</div></div>
<div class="compare-col"><div class="compare-title">Uzun pencere (örn. 100 ms)</div><div class="compare-item">Pürüzsüz frekans çözünürlüğü (~10 Hz bölmeler)</div><div class="compare-item">Hızlı zaman değişimlerini bulanıklaştırır</div><div class="compare-item">Kararlı tonlar için iyi (uzayan sesli harfler, müzik)</div><div class="compare-item">Daha az çerçeve</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"trumpet"</span>), sr=<span class="num">16000</span>)

<span class="cm"># Kısa pencere: 8 ms = 128 örnek. Zaman çöz ~8 ms, frek çöz 125 Hz/bölme</span>
S_short = librosa.<span class="fn">stft</span>(y, n_fft=<span class="num">128</span>, hop_length=<span class="num">32</span>)
<span class="fn">print</span>(<span class="str">"kisa:"</span>, S_short.shape)        <span class="cm"># (65, M_short)</span>

<span class="cm"># Standart pencere: 25 ms = 400 örnek. Zaman çöz ~10 ms, frek çöz 40 Hz/bölme</span>
S_std = librosa.<span class="fn">stft</span>(y, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>)
<span class="fn">print</span>(<span class="str">"std:  "</span>, S_std.shape)          <span class="cm"># (201, M_std)</span>

<span class="cm"># Uzun pencere: 100 ms = 1600 örnek. Zaman çöz ~25 ms, frek çöz 10 Hz/bölme</span>
S_long = librosa.<span class="fn">stft</span>(y, n_fft=<span class="num">1600</span>, hop_length=<span class="num">400</span>)
<span class="fn">print</span>(<span class="str">"uzun:"</span>, S_long.shape)         <span class="cm"># (801, M_long)</span>

<span class="cm"># Frekans çözünürlüğü = sr / n_fft</span>
<span class="fn">print</span>(<span class="str">"kisa frek coz:"</span>, sr / <span class="num">128</span>, <span class="str">"Hz/bolme"</span>)
<span class="fn">print</span>(<span class="str">"std frek coz: "</span>, sr / <span class="num">400</span>, <span class="str">"Hz/bolme"</span>)
<span class="fn">print</span>(<span class="str">"uzun frek coz:"</span>, sr / <span class="num">1600</span>, <span class="str">"Hz/bolme"</span>)

<span class="cm"># Zaman çözünürlüğü = hop_length / sr</span>
<span class="fn">print</span>(<span class="str">"kisa zaman coz:"</span>, <span class="num">32</span> / sr * <span class="num">1000</span>, <span class="str">"ms/cerceve"</span>)
<span class="fn">print</span>(<span class="str">"std zaman coz: "</span>, <span class="num">160</span> / sr * <span class="num">1000</span>, <span class="str">"ms/cerceve"</span>)
<span class="fn">print</span>(<span class="str">"uzun zaman coz:"</span>, <span class="num">400</span> / sr * <span class="num">1000</span>, <span class="str">"ms/cerceve"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">dB cinsinden spektrogram — görselleştirilmeye veya sonraki bir sınıflandırıcıya beslenmeye hazır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
S = np.abs(Z) ** 2
S_db = 10 * np.log10(S + 1e-10)
print('Güç spektrogramı  :', S.shape, ' dtype', S.dtype)
print('dB aralığı        :', round(float(S_db.min()), 1), '→', round(float(S_db.max()), 1), 'dB')
print('Bant başına ortalama dB (ilk 5):', np.round(S_db.mean(axis=1)[:5], 1))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Kıyaslama olarak bir trompet örneği yükler. 2) Üç farklı pencere/sıçrama boyutuyla üç STFT hesaplar ve şekillerini yazdırır. Kısa pencere: 65 frekans bölmesi, çok zaman çerçevesi. Uzun pencere: 801 frekans bölmesi, az zaman çerçevesi. Aynı ses, farklı görünümler. 3) Bölme başına frekans çözünürlüğü <code>sr / n_fft</code>'dir -- daha küçük pencere daha kaba bölmeler demektir. 4) Çerçeve başına zaman çözünürlüğü <code>hop_length / sr</code>'dir. 5) Frekans çözünürlüğü ve zaman çözünürlüğünün çarpımı sabittir -- bu zaman-frekans belirsizliğidir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: neden 25 ms konuşma standardı</div><div class="example-body">Konuşma fonemleri tipik olarak 50-100 ms sürer. 10 ms sıçramalı 25 ms pencere fonem başlangıç/bitişini net yakalar, 40 Hz frekans çözünürlüğü ise formantları (genellikle yüzlerce Hz aralı) kolayca çözer. Daha kısa pencereler formant yapısını kaçırır; daha uzun pencereler sessiz harf geçişlerini bulanıklaştırır. Deneysel olarak bu ayarlar 1970'lerden beri varsayılandır.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Güç, Faz ve Yeniden Yapılandırma</h2>

<p class="l-text">STFT karmaşık bir matristir. Büyüklüğü genellikle görselleştirdiğiniz ve modellere beslediğiniz spektrogramdır. Faz yorumlanması daha zordur ama bir spektrogramdan ses yeniden yapılandırmak için gereklidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">3.0</span>)

<span class="cm"># Karmaşık STFT</span>
S = librosa.<span class="fn">stft</span>(y, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>)

<span class="cm"># 1) Büyüklük ve faz: karmaşık matrisin polar formu</span>
mag = np.<span class="fn">abs</span>(S)
phase = np.<span class="fn">angle</span>(S)
<span class="fn">print</span>(<span class="str">"buyukluk:"</span>, mag.shape, mag.<span class="fn">min</span>(), mag.<span class="fn">max</span>())
<span class="fn">print</span>(<span class="str">"faz:"</span>, phase.shape, phase.<span class="fn">min</span>(), phase.<span class="fn">max</span>())  <span class="cm"># [-pi, pi]</span>

<span class="cm"># 2) Güç spektrogramı = büyüklüğün karesi</span>
power = mag ** <span class="num">2</span>
power_db = librosa.<span class="fn">power_to_db</span>(power, ref=np.<span class="fn">max</span>)

<span class="cm"># 3) Orijinal fazla yeniden yapılandırma: kayıpsız</span>
y1 = librosa.<span class="fn">istft</span>(mag * np.<span class="fn">exp</span>(<span class="num">1j</span> * phase), hop_length=<span class="num">160</span>)
err1 = np.<span class="fn">abs</span>(y[:<span class="fn">len</span>(y1)] - y1).<span class="fn">max</span>()
<span class="fn">print</span>(<span class="str">"orijinal faz ile:"</span>, err1)               <span class="cm"># ~1e-7</span>

<span class="cm"># 4) Rastgele fazla yeniden yapılandırma: gürültülü</span>
random_phase = np.random.<span class="fn">uniform</span>(-np.pi, np.pi, mag.shape)
y2 = librosa.<span class="fn">istft</span>(mag * np.<span class="fn">exp</span>(<span class="num">1j</span> * random_phase), hop_length=<span class="num">160</span>)
err2 = np.<span class="fn">abs</span>(y[:<span class="fn">len</span>(y2)] - y2).<span class="fn">max</span>()
<span class="fn">print</span>(<span class="str">"rastgele faz ile:"</span>, err2)               <span class="cm"># ~0.5, kötü bozulmuş</span>

<span class="cm"># 5) Griffin-Lim: yalnızca büyüklükten faz tahmini (klasik vokoderlerde kullanılır)</span>
y3 = librosa.<span class="fn">griffinlim</span>(mag, n_iter=<span class="num">32</span>, hop_length=<span class="num">160</span>)
err3 = np.<span class="fn">abs</span>(y[:<span class="fn">len</span>(y3)] - y3).<span class="fn">max</span>()
<span class="fn">print</span>(<span class="str">"griffin-lim:"</span>, err3)                    <span class="cm"># ~0.05, çoğunlukla anlaşılır</span>
<span class="cm"># Modern TTS sistemleri yerine öğrenilmiş bir vokoder (HiFi-GAN) kullanır, çok daha iyi kalite</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Büyüklük/faz ayrıştırması — STFT karmaşıktır; genellikle görselleştirdiğin şey büyüklüktür.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
mag = np.abs(Z)
phase = np.angle(Z)
print('Z karmaşık    :', Z.shape, Z.dtype)
print('|Z| büyüklük  :', mag.shape, '  aralık', round(float(mag.min()), 4), '→', round(float(mag.max()), 4))
print('∠Z faz (rad)  :', phase.shape, ' aralık', round(float(phase.min()), 3), '→', round(float(phase.max()), 3))
# Ters STFT ile yeniden yapılandır (büyüklük+faz korunduğunda kayıpsız)
_, y_rec = signal.istft(Z, fs=sr, nperseg=512, noverlap=256)
print('Yeniden yapılanma hatası:', round(float(np.mean((y_rec[:len(audio)] - audio)**2)), 8))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Karmaşık STFT'yi büyüklük ve faza ayırır -- karmaşık sayıların polar formu. Büyüklük "hangi frekanslar mevcut" kısmıdır; faz "şu anda döngülerinde nerede oldukları" kısmıdır. 2) Güç büyüklüğün karesidir; algısal olarak anlamlı yükseklik ölçeği. 3) Orijinal fazla yeniden yapılandırma sinyali neredeyse tam olarak geri kazandırır -- STFT'nin tersinir olduğu akıl sağlığı kontrolü. 4) Rastgele fazla yeniden yapılandırma aynı sesin tıslayan, bozulmuş bir versiyonunu üretir: aynı enerji dağılımı, yanlış zamansal yapı. Bu yüzden faz önemlidir. 5) Griffin-Lim yalnızca büyüklükten tutarlı bir fazı yinelemeli olarak tahmin eder; iyi ses verir ama harika değil. Modern TTS, büyüklük spektrogramlarını doğrudan daha yüksek kalitede sese eşlemeyi öğrenen sinirsel bir vokoder (HiFi-GAN, WaveGlow) kullanır.</p>

<div class="l-note"><strong>ML modelleri neden fazı atar:</strong> insan duyumu büyüklüğe fazdan çok daha duyarlıdır. Müzik türünü sınıflandıran veya konuşmayı yazıya döken bir model fazı tamamen yok sayabilir ve neredeyse hiç bilgi kaybetmez. Üretim görevleri (TTS, müzik sentezi) faza ihtiyaç duyar, bu yüzden öğrenilmiş bir vokoder kullanırlar.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. librosa ile Spektrogramları Görselleştirme</h2>

<p class="l-text">librosa iki satırda yayın kalitesinde spektrogramlar üreten yüksek seviyeli bir yardımcı sunar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> librosa.display
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">5.0</span>)

<span class="cm"># 1) dB ölçeğinde spektrogram hesapla</span>
S = librosa.<span class="fn">stft</span>(y, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>)
S_db = librosa.<span class="fn">amplitude_to_db</span>(np.<span class="fn">abs</span>(S), ref=np.<span class="fn">max</span>)

<span class="cm"># 2) librosa'nın specshow'u ile çiz</span>
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">10</span>, <span class="num">4</span>))
img = librosa.display.<span class="fn">specshow</span>(
    S_db, sr=sr, hop_length=<span class="num">160</span>,
    x_axis=<span class="str">"time"</span>, y_axis=<span class="str">"hz"</span>,
    cmap=<span class="str">"magma"</span>, ax=ax
)
ax.<span class="fn">set_title</span>(<span class="str">"Dogrusal frekans spektrogrami"</span>)
fig.<span class="fn">colorbar</span>(img, ax=ax, format=<span class="str">"%+2.0f dB"</span>)
plt.<span class="fn">tight_layout</span>()
plt.<span class="fn">show</span>()

<span class="cm"># 3) Log-frekans görünümü (algıya daha yakın)</span>
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">10</span>, <span class="num">4</span>))
img = librosa.display.<span class="fn">specshow</span>(
    S_db, sr=sr, hop_length=<span class="num">160</span>,
    x_axis=<span class="str">"time"</span>, y_axis=<span class="str">"log"</span>,
    cmap=<span class="str">"magma"</span>, ax=ax
)
ax.<span class="fn">set_title</span>(<span class="str">"Log-frekans spektrogrami"</span>)
fig.<span class="fn">colorbar</span>(img, ax=ax, format=<span class="str">"%+2.0f dB"</span>)
plt.<span class="fn">tight_layout</span>()
plt.<span class="fn">show</span>()

<span class="cm"># 4) ML eğitimi için numpy olarak kaydet</span>
np.<span class="fn">save</span>(<span class="str">"speech_spec.npy"</span>, S_db)
<span class="fn">print</span>(<span class="str">"sekli kaydedilen spektrogram"</span>, S_db.shape)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">specshow-tarzı özet: dB spektrogramını kur ve çerçeve-düzey ses yüksekliğini yazdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=400, noverlap=200)
S_db = 20 * np.log10(np.abs(Z) + 1e-10)
frame_loudness = S_db.mean(axis=0)
print('Çerçeve sayısı:', len(t))
print('En yüksek 5 çerçeve:')
for i in np.argsort(frame_loudness)[-5:][::-1]:
    print(f'  t={t[i]:.3f}s  ortalama dB={frame_loudness[i]:.1f}')</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Standart bir STFT hesaplar ve büyüklüğü dB'ye dönüştürür. <code>ref=np.max</code>, en yüksek çerçevenin 0 dB olması demektir; geri kalan her şey negatiftir. 2) <code>librosa.display.specshow</code> dizi şeklinden ve örnekleme oranından zaman ve frekans eksenlerini otomatik üretir. <code>magma</code> renk haritası ses topluluğunun varsayılanıdır -- parlak = yüksek, karanlık = sessiz. 3) Log-frekans görünümü frekans bölmelerini logaritmik aralar, böylece her oktav eşit piksel alır; bu insanların perdeyi nasıl algıladığıyla eşleşir. Sonraki ders bunu mel ölçeğiyle genelleştirir. 4) dB spektrogramını numpy olarak kaydetmek size ML eğitimi için kullanıma hazır bir özellik matrisi verir -- NumPy/PyTorch dataloader'ların tipik olarak okuduğu şey budur.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: tek satırlık bir spektrogram hattı</div><div class="example-body">Bir derin model eğitim döngüsü için yazardınız: <code>def to_spec(y, sr=16000): return librosa.amplitude_to_db(np.abs(librosa.stft(y, n_fft=400, hop_length=160)), ref=np.max)</code>. Tek satır, ses klibi başına bir (201, M) float32 matris döner. Sabit uzunluğa pad/truncate, batch'e yığ, 2D CNN'e besle. Bu transformer öncesi modellerin altındaki en yaygın ses ML hattıdır.</div></div>

<div class="think-box"><div class="think-label">TEMEL ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Fourier dönüşümü herhangi bir sinyali farklı frekanslarda saf sinüs dalgalarının toplamına ayrıştırır.<br><strong>2.</strong> DFT formülü: <code>X[k] = sum x[n] * exp(-2 pi i k n / N)</code>. FFT bunu O(N log N)'de hesaplar.<br><strong>3.</strong> Gerçek girdi için <code>np.fft.rfft</code> kullanın -- <code>fft</code>'den iki kat hızlı.<br><strong>4.</strong> Tek FFT zaman üzerinde ortalama alır; STFT sesi pencerelere böler ve her birini FFT'ler. Çıkış 2B karmaşık matristir.<br><strong>5.</strong> Standart ML STFT ayarları: 25 ms pencere, 10 ms sıçrama, Hann penceresi, 16 kHz mono giriş.<br><strong>6.</strong> Pencere boyutu temel bir ödünleşime sahiptir: daha uzun = daha iyi frekans çözünürlüğü ama daha kötü zaman çözünürlüğü.<br><strong>7.</strong> Büyüklük spektrogramları çoğu modelin tükettiğidir; faz yalnızca ses yeniden yapılandırma için önemlidir.<br><strong>8.</strong> Sonraki ders: mel ölçeği ve MFCC'ler -- spektrogramı insan duyumuna uyarlamak.</div></div>
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

  function fftPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var freqs = [];
    var mags = [];
    for (var f=0;f<=2000;f+=10) {
      freqs.push(f);
      var m = 0.001;
      m += 0.5 * Math.exp(-Math.pow((f-220)/8, 2));
      m += 0.3 * Math.exp(-Math.pow((f-440)/8, 2));
      m += 0.15 * Math.exp(-Math.pow((f-880)/8, 2));
      mags.push(m);
    }
    var trace = {x:freqs, y:mags, mode:'lines', line:{color:T.accent, width:2}, fill:'tozeroy', fillcolor:'rgba(200,169,110,0.18)', name:lang==='tr'?'büyüklük':'magnitude'};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Üç Saf Tonun Genlik Spektrumu':'Magnitude Spectrum of Three Pure Tones', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'frekans (Hz)':'frequency (Hz)', gridcolor:T.grid, zerolinecolor:T.zero, range:[0,1500]},
      yaxis:{title:lang==='tr'?'genlik':'magnitude', gridcolor:T.grid, zerolinecolor:T.zero, type:'log', range:[-3.5, 0]}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  function specPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var T_frames = 80, F_bins = 64;
    var z = [];
    for (var fi=0;fi<F_bins;fi++) {
      var row = [];
      for (var ti=0;ti<T_frames;ti++) {
        var t_s = ti/T_frames * 3;
        var f_hz = fi/F_bins * 4000;
        var v = -50;
        var vowel_centers = [[0.4, [300, 2300, 3000]],[1.4, [500, 1500, 2500]],[2.4, [700, 1100, 2400]]];
        for (var k=0;k<vowel_centers.length;k++){
          var c = vowel_centers[k];
          if (Math.abs(t_s - c[0]) < 0.5) {
            for (var fk=0;fk<c[1].length;fk++) {
              v = Math.max(v, -10 - 0.3*Math.pow((f_hz - c[1][fk])/100, 2) - 30*Math.abs(t_s-c[0]));
            }
          }
        }
        v = Math.max(v, -55 + Math.random()*5);
        row.push(v);
      }
      z.push(row);
    }
    var times = []; for (var i=0;i<T_frames;i++) times.push(i/T_frames * 3);
    var freqs = []; for (var i=0;i<F_bins;i++) freqs.push(i/F_bins * 4000);
    var trace = {z:z, x:times, y:freqs, type:'heatmap', colorscale:[[0,'#1a0e2e'],[0.3,'#5a2068'],[0.6,'#c84068'],[0.85,'#f59f4a'],[1,'#fef0a4']], showscale:true, colorbar:{title:'dB', titlefont:{color:T.text}, tickfont:{color:T.text}}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Konuşma Spektrogramı (3 sesli harf)':'Speech Spectrogram (3 vowels)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman (s)':'time (s)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'frekans (Hz)':'frequency (Hz)', gridcolor:T.grid, zerolinecolor:T.zero}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  fftPlot('plot-al2-fft-en','en');
  specPlot('plot-al2-spec-en','en');
  fftPlot('plot-al2-fft-tr','tr');
  specPlot('plot-al2-spec-tr','tr');
}, 250);</script>`
};
