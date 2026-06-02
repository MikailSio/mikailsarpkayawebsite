window.AUDIO_L3 = {

en: `<p class="l-text"><strong>Human hearing is not linear.</strong> Doubling a frequency from 100 Hz to 200 Hz feels like a big jump (one octave); doubling from 5000 Hz to 10000 Hz feels like roughly the same jump even though the absolute distance is 50x bigger. Linear-frequency spectrograms waste resolution on high frequencies humans cannot distinguish well, and starve resolution from the low frequencies that matter most for speech.</p>

<p class="l-text">This lesson introduces the mel scale (a perceptually-aligned frequency axis), the mel filterbank (how to remap a linear spectrogram to mel bins), the log-mel spectrogram that every modern speech model takes as input, and MFCCs (Mel-Frequency Cepstral Coefficients) -- the feature that ruled speech recognition for 30 years before deep learning. By the end you can extract any of these features in three lines of librosa.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Convert Hz to mels using the perceptual mel scale formula</li>
<li>Build a triangular mel filterbank that bins a linear spectrogram</li>
<li>Compute a log-mel spectrogram, the input every Whisper-class model expects</li>
<li>Compute MFCCs from a 16kHz signal using DCT and mel-filterbank</li>
<li>Compare linear, mel, and MFCC features side by side on the same clip</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Mel Scale</h2>

<p class="l-text">In the 1930s, Stevens, Volkmann, and Newman asked human subjects to bisect frequency intervals: "what frequency feels like the midpoint between 200 Hz and 1000 Hz?" Subjects consistently chose lower frequencies than the geometric mean -- our perception of pitch compresses at high frequencies. They fitted a function to the data and called it the mel scale.</p>

<div class="katex-block">$$m = 2595 \\, \\log_{10}\\!\\left(1 + \\frac{f}{700}\\right)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">f</div><div class="card-body">Frequency in Hz (input).</div></div>
<div class="calc-card"><div class="card-title">m</div><div class="card-body">Mel value (output). Approximately linear in perceived pitch.</div></div>
<div class="calc-card"><div class="card-title">700</div><div class="card-body">Hz constant. Below 700 Hz the scale is roughly linear; above it becomes logarithmic.</div></div>
<div class="calc-card"><div class="card-title">2595</div><div class="card-body">Scaling factor so that 1000 Hz maps to roughly 1000 mel.</div></div>
<div class="calc-card"><div class="card-title">log10</div><div class="card-body">Captures the perceptual compression at high frequencies.</div></div>
<div class="calc-card"><div class="card-title">Inverse</div><div class="card-body">f = 700 * (10^(m/2595) - 1). Used to convert mel back to Hz.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: mel mapping</div><div class="example-body">100 Hz -> 150 mel. 1000 Hz -> 1000 mel. 2000 Hz -> 1521 mel. 4000 Hz -> 2146 mel. 8000 Hz -> 2840 mel. The first 1000 mel cover only the bottom 1000 Hz of audible range; the second 1000 mel cover the next 6000 Hz. Hard to overstate how aligned this is with what your brain hears.</div></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> librosa

<span class="cm"># Hand-rolled mel formula (Stevens-Volkmann)</span>
<span class="kw">def</span> <span class="fn">hz_to_mel</span>(f):
    <span class="kw">return</span> <span class="num">2595</span> * np.<span class="fn">log10</span>(<span class="num">1</span> + f / <span class="num">700.0</span>)

<span class="kw">def</span> <span class="fn">mel_to_hz</span>(m):
    <span class="kw">return</span> <span class="num">700.0</span> * (<span class="num">10</span> ** (m / <span class="num">2595</span>) - <span class="num">1</span>)

<span class="cm"># Quick sanity check</span>
<span class="kw">for</span> hz <span class="kw">in</span> [<span class="num">100</span>, <span class="num">500</span>, <span class="num">1000</span>, <span class="num">2000</span>, <span class="num">4000</span>, <span class="num">8000</span>]:
    m = <span class="fn">hz_to_mel</span>(hz)
    back = <span class="fn">mel_to_hz</span>(m)
    <span class="fn">print</span>(f<span class="str">"{hz} Hz -&gt; {m:.0f} mel -&gt; {back:.1f} Hz"</span>)

<span class="cm"># librosa ships the same function -- always prefer this in production</span>
<span class="fn">print</span>(librosa.<span class="fn">hz_to_mel</span>(<span class="num">1000</span>))   <span class="cm"># 1000.05</span>
<span class="fn">print</span>(librosa.<span class="fn">mel_to_hz</span>(<span class="num">1000</span>))   <span class="cm"># 1000 Hz</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">The mel scale via the standard formula \`mel = 2595 * log10(1 + hz / 700)\`. Numpy only.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
def hz_to_mel(hz): return 2595.0 * np.log10(1.0 + hz / 700.0)
def mel_to_hz(mel): return 700.0 * (10 ** (mel / 2595.0) - 1.0)
test = np.array([100, 1000, 2000, 4000, 8000])
print('Hz   →   mel')
for h in test:
    print(f'  {h:5d}  →  {hz_to_mel(h):7.1f}')
print('Round-trip 1000 mel → Hz:', round(float(mel_to_hz(1000)), 1))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Implements the mel formula directly so you can see it is just a one-liner -- no magic. 2) The inverse formula lets you convert mel values back to Hz, needed when you want to label the y-axis of a mel-spectrogram. 3) The sanity loop prints round-trip values to confirm both functions are correct. 4) librosa ships <code>hz_to_mel</code> and <code>mel_to_hz</code>; always use these in production code (uses the same Stevens formula by default but supports the slightly different Slaney variant too).</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Mel Filterbank</h2>

<p class="l-text">A mel filterbank is a set of triangular filters whose centers are equally spaced on the mel scale. Each filter computes a weighted sum of FFT bins -- a coarse-grained energy in one mel band. Stack them and you get a mel-spectrogram: a smaller, perceptually meaningful version of the linear spectrogram.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">n_mels</div><div class="card-body">Number of mel bands. Typical: 40 (classic), 80 (Whisper), 128 (high-quality TTS).</div></div>
<div class="calc-card"><div class="card-title">f_min</div><div class="card-body">Lowest frequency to include. Speech: 0 Hz. Music: 20 Hz. Removing very-low rumble: 80 Hz.</div></div>
<div class="calc-card"><div class="card-title">f_max</div><div class="card-body">Highest frequency. Defaults to sr/2 (Nyquist). Speech: 8000 Hz at 16 kHz sr.</div></div>
<div class="calc-card"><div class="card-title">Triangular shape</div><div class="card-body">Each filter peaks at its center mel and tapers linearly to zero at the neighbors' centers.</div></div>
<div class="calc-card"><div class="card-title">Sum of filters</div><div class="card-body">Each FFT bin contributes to typically 2 adjacent mel filters; total weight integrates to a known constant.</div></div>
<div class="calc-card"><div class="card-title">Output dim</div><div class="card-body">(n_mels, T) -- much smaller than (n_fft/2+1, T). 80x fewer parameters than 1024-bin linear spec.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

sr = <span class="num">16000</span>
n_fft = <span class="num">400</span>
n_mels = <span class="num">80</span>

<span class="cm"># 1) Build the mel filterbank: shape (n_mels, n_fft/2 + 1)</span>
mel_basis = librosa.filters.<span class="fn">mel</span>(sr=sr, n_fft=n_fft, n_mels=n_mels, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>)
<span class="fn">print</span>(mel_basis.shape)        <span class="cm"># (80, 201)</span>

<span class="cm"># Each row is one triangular filter</span>
<span class="cm"># Center frequencies of the filters in Hz:</span>
mel_centers = librosa.<span class="fn">mel_frequencies</span>(n_mels=n_mels + <span class="num">2</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>)
<span class="fn">print</span>(mel_centers[:<span class="num">10</span>])     <span class="cm"># roughly [0, 100, 200, 300, 400, 500, 600, 700, 800, 900]</span>
<span class="fn">print</span>(mel_centers[-<span class="num">5</span>:])     <span class="cm"># roughly [6500, 7000, 7500, 7800, 8000]</span>

<span class="cm"># 2) Apply filterbank to a linear spectrogram</span>
y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">3.0</span>)
S = np.<span class="fn">abs</span>(librosa.<span class="fn">stft</span>(y, n_fft=n_fft, hop_length=<span class="num">160</span>)) ** <span class="num">2</span>   <span class="cm"># power spec (201, T)</span>
mel_spec = mel_basis @ S
<span class="fn">print</span>(<span class="str">"linear spec:"</span>, S.shape)         <span class="cm"># (201, T)</span>
<span class="fn">print</span>(<span class="str">"mel spec:   "</span>, mel_spec.shape)  <span class="cm"># (80, T) -- compressed</span>

<span class="cm"># 3) librosa ships a one-call helper</span>
mel_spec_v2 = librosa.feature.<span class="fn">melspectrogram</span>(
    y=y, sr=sr, n_fft=n_fft, hop_length=<span class="num">160</span>,
    n_mels=n_mels, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>
)
<span class="fn">print</span>(np.<span class="fn">allclose</span>(mel_spec, mel_spec_v2, rtol=<span class="num">1e-3</span>))   <span class="cm"># True</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mel filter bank with numpy: triangular filters between fmin and fmax, applied to a power spectrum.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
n_mel = 24
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
power = np.abs(Z) ** 2                                    # (freq, time)
def hz_to_mel(h): return 2595 * np.log10(1 + h / 700)
def mel_to_hz(m): return 700 * (10 ** (m / 2595) - 1)
mel_pts = np.linspace(hz_to_mel(0), hz_to_mel(sr/2), n_mel + 2)
hz_pts = mel_to_hz(mel_pts)
fb = np.zeros((n_mel, len(f)))
for m in range(n_mel):
    lo, ce, hi = hz_pts[m], hz_pts[m+1], hz_pts[m+2]
    fb[m] = np.maximum(0, np.minimum((f-lo)/(ce-lo+1e-9), (hi-f)/(hi-ce+1e-9)))
mel_spec = fb @ power
print('Mel filter bank :', fb.shape)
print('Mel spectrogram :', mel_spec.shape)
print('Mean per band (first 6):', np.round(mel_spec.mean(axis=1)[:6], 2))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>librosa.filters.mel</code> constructs the filterbank as a matrix of shape (80, 201). Each row is a triangle peaked at one mel center. The first few centers cluster near 0 Hz (linear region of mel scale); the last centers spread widely (logarithmic region). 2) Computes a regular power spectrogram from speech audio, then multiplies by the filterbank matrix. The matrix product collapses the 201 linear bins into 80 mel bins per frame. The shape (80, T) is the standard input to neural speech models. 3) <code>librosa.feature.melspectrogram</code> wraps all of this in a single function call -- always use this in real code; it is what every audio dataloader does internally.</p>

<div id="plot-al3-mel-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Three triangular mel filters from a small 8-band filterbank. The first filter peaks at low Hz with a narrow base; the last peaks at high Hz with a much wider base because the mel scale is logarithmic up there. When applied to a linear spectrogram, each filter sums the FFT bins under its triangle, weighted by the height. This is how 201 fine-grained linear bins become 80 perceptually meaningful mel bins.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Log-Mel Spectrogram</h2>

<p class="l-text">The mel-spectrogram has very large dynamic range: a quiet sample is millions of times smaller than a loud sample. Networks struggle with such ranges. The fix is to take the log -- this is the universal speech-ML feature. "Log-mel" or "log mel filterbank" is what Whisper, wav2vec, HuBERT, Tacotron, every speech model takes as input.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">5.0</span>)

<span class="cm"># 1) Power mel-spectrogram</span>
mel = librosa.feature.<span class="fn">melspectrogram</span>(
    y=y, sr=sr,
    n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>,
    n_mels=<span class="num">80</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>,
    power=<span class="num">2.0</span>          <span class="cm"># power=2 -&gt; energy. Use power=1 for amplitude.</span>
)
<span class="fn">print</span>(<span class="str">"mel:"</span>, mel.shape, mel.<span class="fn">min</span>(), mel.<span class="fn">max</span>())
<span class="cm"># mel: (80, T) very large range</span>

<span class="cm"># 2) Convert to log scale</span>
log_mel = librosa.<span class="fn">power_to_db</span>(mel, ref=np.<span class="fn">max</span>)
<span class="cm"># Equivalent: log_mel = 10 * np.log10(mel + 1e-10)</span>
<span class="fn">print</span>(<span class="str">"log_mel:"</span>, log_mel.shape, log_mel.<span class="fn">min</span>(), log_mel.<span class="fn">max</span>())
<span class="cm"># log_mel: (80, T) range roughly [-80, 0] dB</span>

<span class="cm"># 3) Whisper-style log-mel: normalize to [-1, 1]</span>
<span class="kw">def</span> <span class="fn">whisper_log_mel</span>(y, sr=<span class="num">16000</span>, n_mels=<span class="num">80</span>):
    mel = librosa.feature.<span class="fn">melspectrogram</span>(
        y=y, sr=sr, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>,
        n_mels=n_mels, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>, power=<span class="num">2.0</span>
    )
    log_mel = np.<span class="fn">log10</span>(np.<span class="fn">maximum</span>(mel, <span class="num">1e-10</span>))
    log_mel = np.<span class="fn">maximum</span>(log_mel, log_mel.<span class="fn">max</span>() - <span class="num">8.0</span>)   <span class="cm"># clip floor</span>
    log_mel = (log_mel + <span class="num">4.0</span>) / <span class="num">4.0</span>                    <span class="cm"># normalize</span>
    <span class="kw">return</span> log_mel

X = <span class="fn">whisper_log_mel</span>(y)
<span class="fn">print</span>(<span class="str">"whisper-style:"</span>, X.shape, X.<span class="fn">min</span>(), X.<span class="fn">max</span>())  <span class="cm"># roughly [-1, 1]</span>

<span class="cm"># 4) PyTorch idiom</span>
<span class="kw">import</span> torch
log_mel_t = torch.<span class="fn">from_numpy</span>(X).<span class="fn">float</span>().<span class="fn">unsqueeze</span>(<span class="num">0</span>)   <span class="cm"># (1, n_mels, T)</span>
<span class="fn">print</span>(<span class="str">"torch:"</span>, log_mel_t.shape, log_mel_t.dtype)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Log-mel: take log of the mel spectrogram. This is the universal speech-ML feature.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
power = np.abs(Z) ** 2
# very simple 16-band rectangular mel approximation
edges = np.linspace(0, len(f), 17, dtype=int)
mel = np.stack([power[edges[i]:edges[i+1]].mean(axis=0) for i in range(16)])
log_mel = np.log(mel + 1e-9)
print('mel       :', mel.shape, '   range', round(float(mel.min()), 4), '→', round(float(mel.max()), 2))
print('log-mel   :', log_mel.shape, ' range', round(float(log_mel.min()), 2), '→', round(float(log_mel.max()), 2))
print('Per-frame normalize: mean', round(float(log_mel.mean()), 3),
      ' std', round(float(log_mel.std()), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Computes the power mel-spectrogram. <code>power=2.0</code> means we work with energy (magnitude squared); some pipelines prefer <code>power=1</code> (amplitude) -- both are common. 2) <code>power_to_db</code> applies <code>10 * log10</code>, compressing the huge dynamic range into a roughly [-80, 0] dB scale. 3) The Whisper-specific normalization clips the floor to 8 dB below the max, then linearly rescales to [-1, 1]. This is exactly what <code>WhisperProcessor</code> does internally; reproducing it is useful when you want to bypass the HF processor and write your own pipeline. 4) The PyTorch idiom: from numpy, to float, add a batch dimension. The model expects shape (B, n_mels, T).</p>

<div class="calc-example"><div class="example-label">EXAMPLE: why log makes neural networks happy</div><div class="example-body">Without log: a -20 dB sample has power 0.01, a -60 dB sample has power 1e-6. Their ratio is 10000. A network's softmax/sigmoid will saturate trying to handle such ranges. With log: the same samples become -20 and -60 -- a difference of 40, which a network can learn easily. Log compresses multiplicative differences into additive ones, exactly what gradient descent prefers.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. MFCC: Mel-Frequency Cepstral Coefficients</h2>

<p class="l-text">Before deep learning, the dominant speech feature was the MFCC. The recipe: compute log-mel, then take the Discrete Cosine Transform (DCT) along the mel axis. The DCT decorrelates the mel coefficients (most energy lands in the first few coefficients) and acts as a smoother. The first 13 coefficients capture spectral envelope; higher ones capture fine detail.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">n_mfcc</div><div class="card-body">Number of MFCCs to keep. Classic ASR: 13 base + 13 deltas + 13 delta-deltas = 39.</div></div>
<div class="calc-card"><div class="card-title">DCT type 2</div><div class="card-body">The standard DCT used in MFCC. Real, orthonormal, separable.</div></div>
<div class="calc-card"><div class="card-title">Decorrelation</div><div class="card-body">Mel bins are highly correlated; DCT outputs are nearly independent. GMM/HMM models love this.</div></div>
<div class="calc-card"><div class="card-title">First MFCC</div><div class="card-body">Captures average loudness. Often dropped because it depends on recording level.</div></div>
<div class="calc-card"><div class="card-title">Deltas</div><div class="card-body">First difference along time. Captures rate of spectral change. Helps model coarticulation.</div></div>
<div class="calc-card"><div class="card-title">Delta-deltas</div><div class="card-body">Second difference. Captures acceleration of spectral change.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">3.0</span>)

<span class="cm"># 1) Direct MFCC extraction</span>
mfcc = librosa.feature.<span class="fn">mfcc</span>(
    y=y, sr=sr,
    n_mfcc=<span class="num">13</span>,
    n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>,
    n_mels=<span class="num">80</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>,
)
<span class="fn">print</span>(<span class="str">"mfcc:"</span>, mfcc.shape)      <span class="cm"># (13, T)</span>
<span class="fn">print</span>(<span class="str">"range:"</span>, mfcc.<span class="fn">min</span>(), mfcc.<span class="fn">max</span>())

<span class="cm"># 2) Manual: log-mel -&gt; DCT</span>
<span class="kw">from</span> scipy.fftpack <span class="kw">import</span> dct
mel = librosa.feature.<span class="fn">melspectrogram</span>(
    y=y, sr=sr, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>, n_mels=<span class="num">80</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>
)
log_mel = librosa.<span class="fn">power_to_db</span>(mel, ref=<span class="num">1.0</span>)
mfcc_manual = <span class="fn">dct</span>(log_mel, type=<span class="num">2</span>, axis=<span class="num">0</span>, norm=<span class="str">"ortho"</span>)[: <span class="num">13</span>]
<span class="fn">print</span>(<span class="str">"manual:"</span>, mfcc_manual.shape)   <span class="cm"># (13, T)</span>
<span class="cm"># Numerically very close to the librosa version (small ref factor diff)</span>

<span class="cm"># 3) Add deltas and delta-deltas: classic 39-D feature vector</span>
delta = librosa.feature.<span class="fn">delta</span>(mfcc, order=<span class="num">1</span>)
delta2 = librosa.feature.<span class="fn">delta</span>(mfcc, order=<span class="num">2</span>)
features = np.<span class="fn">vstack</span>([mfcc, delta, delta2])
<span class="fn">print</span>(<span class="str">"39-D ASR features:"</span>, features.shape)   <span class="cm"># (39, T)

# 4) Cepstral mean normalization (per-utterance)</span>
features_cmn = features - features.<span class="fn">mean</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
<span class="fn">print</span>(<span class="str">"after CMN mean:"</span>, features_cmn.<span class="fn">mean</span>(axis=<span class="num">1</span>))  <span class="cm"># roughly zero</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">MFCC — compute log-mel then DCT. scipy.fft.dct gives the cepstrum coefficients.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
from scipy.fft import dct
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
power = np.abs(Z) ** 2
edges = np.linspace(0, len(f), 17, dtype=int)
mel = np.stack([power[edges[i]:edges[i+1]].mean(axis=0) for i in range(16)])
log_mel = np.log(mel + 1e-9)
mfcc = dct(log_mel, axis=0, norm='ortho')[:13]
print('MFCC shape:', mfcc.shape, '  (13 coefficients × frames)')
print('Mean per coef:', np.round(mfcc.mean(axis=1), 2))
print('Std  per coef:', np.round(mfcc.std(axis=1), 2))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>librosa.feature.mfcc</code> does the whole pipeline in one call: STFT, power mel, log, DCT, take first n_mfcc coefficients. The output (13, T) is the canonical pre-deep-learning speech feature. 2) Manual implementation makes the recipe transparent: log-mel through scipy's DCT type 2 keeping the first 13 coefficients along the frequency axis. 3) Deltas (first difference along time) and delta-deltas (second difference) capture the dynamics; concatenating gives a 39-D vector, the classic Kaldi/HTK feature used by every HMM-based recognizer between 1990 and 2015. 4) Cepstral mean normalization subtracts the per-utterance mean to remove channel effects (microphone color, room acoustics) -- a tiny but consistent ASR win.</p>

<div id="plot-al3-mfcc-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The first 13 MFCC coefficients of a 3-second speech clip. Coefficient 0 (the brightest band) tracks loudness. Coefficients 1-3 carry the slow spectral shape (formant structure). Higher coefficients are increasingly fine-grained and noisy. A GMM-HMM speech model would consume this entire matrix as the observation sequence, with coefficients along one dimension and time along the other.</div>

<div class="l-note"><strong>Why MFCCs are mostly history now:</strong> deep models can learn directly from log-mel without the DCT step. The DCT was useful when models had limited capacity (GMM with diagonal covariance needs decorrelated features); a CNN/transformer learns whatever decorrelation it needs. So modern speech models use 80-channel log-mel; classic ASR used 13-39 MFCCs.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Side-by-Side: Linear vs Mel vs MFCC</h2>

<p class="l-text">All three are 2D images of the same audio with different y-axis interpretations. Visual comparison clarifies the trade-offs.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> librosa.display
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">5.0</span>)

<span class="cm"># 1) Linear spectrogram</span>
S_lin = librosa.<span class="fn">amplitude_to_db</span>(np.<span class="fn">abs</span>(librosa.<span class="fn">stft</span>(y, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>)), ref=np.<span class="fn">max</span>)

<span class="cm"># 2) Mel spectrogram (log)</span>
mel = librosa.feature.<span class="fn">melspectrogram</span>(y=y, sr=sr, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>, n_mels=<span class="num">80</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>)
S_mel = librosa.<span class="fn">power_to_db</span>(mel, ref=np.<span class="fn">max</span>)

<span class="cm"># 3) MFCC</span>
S_mfcc = librosa.feature.<span class="fn">mfcc</span>(y=y, sr=sr, n_mfcc=<span class="num">13</span>, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>, n_mels=<span class="num">80</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>)

fig, axes = plt.<span class="fn">subplots</span>(<span class="num">3</span>, <span class="num">1</span>, figsize=(<span class="num">10</span>, <span class="num">9</span>))
librosa.display.<span class="fn">specshow</span>(S_lin, sr=sr, hop_length=<span class="num">160</span>, x_axis=<span class="str">"time"</span>, y_axis=<span class="str">"hz"</span>, cmap=<span class="str">"magma"</span>, ax=axes[<span class="num">0</span>])
axes[<span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"Linear-frequency spectrogram (201 bins)"</span>)

librosa.display.<span class="fn">specshow</span>(S_mel, sr=sr, hop_length=<span class="num">160</span>, x_axis=<span class="str">"time"</span>, y_axis=<span class="str">"mel"</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>, cmap=<span class="str">"magma"</span>, ax=axes[<span class="num">1</span>])
axes[<span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"Log-mel spectrogram (80 bins)"</span>)

librosa.display.<span class="fn">specshow</span>(S_mfcc, sr=sr, hop_length=<span class="num">160</span>, x_axis=<span class="str">"time"</span>, cmap=<span class="str">"magma"</span>, ax=axes[<span class="num">2</span>])
axes[<span class="num">2</span>].<span class="fn">set_title</span>(<span class="str">"MFCC (13 coefficients)"</span>)
axes[<span class="num">2</span>].<span class="fn">set_ylabel</span>(<span class="str">"MFCC index"</span>)

plt.<span class="fn">tight_layout</span>()
plt.<span class="fn">show</span>()

<span class="cm"># Memory comparison</span>
<span class="fn">print</span>(<span class="str">"linear:"</span>, S_lin.nbytes, <span class="str">"bytes"</span>)
<span class="fn">print</span>(<span class="str">"mel:   "</span>, S_mel.nbytes, <span class="str">"bytes"</span>)
<span class="fn">print</span>(<span class="str">"mfcc:  "</span>, S_mfcc.nbytes, <span class="str">"bytes"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Compare three views — linear, log-frequency, mel — with print summaries.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
S = np.abs(Z) ** 2
linear_mean = S.mean(axis=1)
log_idx = np.unique(np.round(np.logspace(0, np.log10(len(f)-1), 16)).astype(int))
log_view = linear_mean[log_idx]
mel_view = np.array([S[i:i+len(f)//16].mean() for i in range(0, len(f), len(f)//16)])
print('linear bands :', linear_mean.shape, '  → first 5:', np.round(linear_mean[:5], 3))
print('log-freq bins:', log_view.shape, '  → values:', np.round(log_view, 3))
print('mel approx   :', mel_view.shape, '  → values:', np.round(mel_view[:6], 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Computes a linear-frequency dB spectrogram with 201 bins per frame -- the highest resolution view. 2) Computes a log-mel spectrogram with 80 bins -- the modern speech model input. The y-axis is on the mel scale, so low frequencies (where formants live) get more bins than high frequencies. 3) Computes 13 MFCCs -- the classic compressed representation. 4) Plots all three side by side. The linear spec looks fine but the mel version focuses resolution where it matters; the MFCC discards almost all the visual richness but is still enough for a GMM-HMM to recognize phonemes. 5) Memory shrinks by ~2.5x going linear -> mel and another 6x going mel -> MFCC. For a 1000-hour dataset this is the difference between hundreds of GB and tens of GB.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Linear spec</div><div class="compare-item">Most detail, biggest size</div><div class="compare-item">Use for music, vocoders, fine analysis</div><div class="compare-item">201-1025 bins</div><div class="compare-item">Phase available for reconstruction</div></div>
<div class="compare-col"><div class="compare-title">Log-mel spec</div><div class="compare-item">Modern speech-ML default</div><div class="compare-item">Use for ASR, wav2vec, Whisper, TTS spec prediction</div><div class="compare-item">40-128 bins</div><div class="compare-item">Inversion needs vocoder</div></div>
<div class="compare-col"><div class="compare-title">MFCC</div><div class="compare-item">Compact, decorrelated</div><div class="compare-item">Use for legacy ASR, audio retrieval, embeddings</div><div class="compare-item">13-39 coefficients</div><div class="compare-item">Not invertible to audio</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Practical Feature Pipeline</h2>

<p class="l-text">A real audio dataloader does roughly: load audio, resample, compute log-mel, normalize, return as a torch tensor. Here is the canonical 30-line implementation.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader

<span class="kw">class</span> <span class="fn">SpeechDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, paths, sr=<span class="num">16000</span>, n_mels=<span class="num">80</span>, max_len=<span class="num">300</span>):
        self.paths = paths
        self.sr = sr
        self.n_mels = n_mels
        self.max_len = max_len     <span class="cm"># max frames in time</span>

    <span class="kw">def</span> <span class="fn">__len__</span>(self):
        <span class="kw">return</span> <span class="fn">len</span>(self.paths)

    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, idx):
        y, _ = librosa.<span class="fn">load</span>(self.paths[idx], sr=self.sr, mono=<span class="kw">True</span>)
        <span class="cm"># Peak normalize</span>
        peak = np.<span class="fn">abs</span>(y).<span class="fn">max</span>()
        <span class="kw">if</span> peak &gt; <span class="num">0</span>: y = y * (<span class="num">0.99</span> / peak)

        <span class="cm"># Log-mel</span>
        mel = librosa.feature.<span class="fn">melspectrogram</span>(
            y=y, sr=self.sr,
            n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>,
            n_mels=self.n_mels, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>, power=<span class="num">2.0</span>
        )
        log_mel = librosa.<span class="fn">power_to_db</span>(mel, ref=<span class="num">1.0</span>)        <span class="cm"># (n_mels, T)

        # Normalize per utterance (CMVN: cepstral mean and variance norm)</span>
        log_mel = (log_mel - log_mel.<span class="fn">mean</span>()) / (log_mel.<span class="fn">std</span>() + <span class="num">1e-6</span>)

        <span class="cm"># Pad / truncate to max_len</span>
        <span class="kw">if</span> log_mel.shape[<span class="num">1</span>] &gt; self.max_len:
            log_mel = log_mel[:, : self.max_len]
        <span class="kw">else</span>:
            pad = self.max_len - log_mel.shape[<span class="num">1</span>]
            log_mel = np.<span class="fn">pad</span>(log_mel, ((<span class="num">0</span>, <span class="num">0</span>), (<span class="num">0</span>, pad)), constant_values=log_mel.<span class="fn">min</span>())

        <span class="kw">return</span> torch.<span class="fn">from_numpy</span>(log_mel).<span class="fn">float</span>()

<span class="cm"># Usage</span>
ds = <span class="fn">SpeechDataset</span>([<span class="str">"a.wav"</span>, <span class="str">"b.wav"</span>, <span class="str">"c.wav"</span>])
<span class="cm"># dl = DataLoader(ds, batch_size=8, shuffle=True, num_workers=4)</span>
<span class="cm"># for batch in dl: print(batch.shape)   # (8, 80, 300)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A 30-line in-memory dataloader equivalent: window the audio, compute log-mel per window.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
def log_mel(y, sr, n_mel=16, n_fft=512, hop=256):
    f, t, Z = signal.stft(y, fs=sr, nperseg=n_fft, noverlap=n_fft-hop)
    P = np.abs(Z)**2
    edges = np.linspace(0, len(f), n_mel+1, dtype=int)
    M = np.stack([P[edges[i]:edges[i+1]].mean(axis=0) for i in range(n_mel)])
    return np.log(M + 1e-9)
# fake 'dataset' = 4 windows of the same clip
windows = [audio[i*4000:(i+1)*4000] for i in range(4)]
feats = np.stack([log_mel(w, sr) for w in windows])
print('Batch shape (N, mel, T):', feats.shape)
print('Per-clip mean energy   :', np.round(feats.mean(axis=(1,2)), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Standard PyTorch Dataset boilerplate -- one example per call to <code>__getitem__</code>. 2) Loads the audio at 16 kHz mono with peak normalization. This guarantees consistent loudness across the dataset. 3) Computes log-mel exactly as in section 3 -- 80 mel bins, 25 ms window, 10 ms hop. 4) Per-utterance mean/variance normalization makes each example have approximately zero mean and unit variance, removing channel and recording-level effects. 5) Pads or truncates to a fixed time length so all examples in a batch have the same shape. Padding uses the minimum dB value (silence) instead of zero. 6) Returns a torch tensor of shape (n_mels, max_len) -- ready to stack into a batch and feed to a CNN/transformer.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: a real ASR data sizes</div><div class="example-body">For a 1000-hour ASR corpus with 10-second clips averaged: 360k clips. Each clip becomes a (80, 1000) log-mel matrix at fp16 -> 160 KB. Whole dataset: ~58 GB. Compare to raw 16 kHz mono int16: 1000 hours * 32 KB/s = 110 GB. Log-mel is roughly 2x smaller and the model can train directly on it without further preprocessing.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Wrap-Up and What's Next</h2>

<p class="l-text">You now have the audio feature toolkit every speech model uses. Time to start using it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mel scale</div><div class="card-body">Perceptual frequency scale: linear below 700 Hz, log above. Formula: <code>m = 2595 log10(1 + f/700)</code>.</div></div>
<div class="calc-card"><div class="card-title">Mel filterbank</div><div class="card-body">Triangular filters at mel-spaced centers. Multiplies linear spec to compress to ~80 bins.</div></div>
<div class="calc-card"><div class="card-title">Log-mel spectrogram</div><div class="card-body">Modern speech-ML feature. Used by Whisper, wav2vec, HuBERT, BERT-style audio models.</div></div>
<div class="calc-card"><div class="card-title">MFCC</div><div class="card-body">DCT of log-mel. Pre-deep-learning standard for ASR. Still useful for retrieval, classical models.</div></div>
<div class="calc-card"><div class="card-title">Deltas</div><div class="card-body">Time differences of features. Capture rate of change. 13 + 13 + 13 = 39-D classic ASR.</div></div>
<div class="calc-card"><div class="card-title">Per-utterance norm</div><div class="card-body">Subtract mean, divide by std along time. Removes channel effects. Critical for cross-corpus models.</div></div>
</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Human hearing is logarithmic at high frequencies; the mel scale captures this with one formula.<br><strong>2.</strong> A mel filterbank multiplies a linear spectrogram by a (n_mels, n_fft/2+1) matrix to produce a perceptually meaningful (n_mels, T) representation.<br><strong>3.</strong> 80 mel bins, 25 ms window, 10 ms hop is the universal modern setting for speech ML.<br><strong>4.</strong> Always take the log of the mel-spectrogram before feeding to a network. This is the "log-mel" feature.<br><strong>5.</strong> Whisper-style normalization clips floor to max-8 dB and rescales to [-1, 1].<br><strong>6.</strong> MFCC = DCT of log-mel, keeping the first 13 coefficients. Used to be standard ASR feature; still useful for compact embeddings.<br><strong>7.</strong> Per-utterance CMVN normalization removes channel effects -- always include it in production pipelines.<br><strong>8.</strong> Next lesson: Whisper -- a transformer that takes log-mel and outputs text. The full ASR pipeline.</div></div>
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

  function melPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    function hzToMel(f) { return 2595 * Math.log10(1 + f/700); }
    function melToHz(m) { return 700 * (Math.pow(10, m/2595) - 1); }
    var n_mels = 8;
    var fmax = 8000;
    var melMax = hzToMel(fmax);
    var centers = [];
    for (var i=0;i<=n_mels+1;i++) centers.push(melToHz(i * melMax / (n_mels+1)));
    var traces = [];
    var picks = [1, 4, 7];
    var colors = [T.accent, '#4ecdc4', '#f87171'];
    for (var pi=0;pi<picks.length;pi++) {
      var k = picks[pi];
      var lo = centers[k-1], mid = centers[k], hi = centers[k+1];
      var xs = [], ys = [];
      for (var f=0;f<=fmax;f+=20) {
        var v = 0;
        if (f >= lo && f <= mid) v = (f - lo) / (mid - lo);
        else if (f >= mid && f <= hi) v = (hi - f) / (hi - mid);
        xs.push(f); ys.push(v);
      }
      traces.push({x:xs, y:ys, mode:'lines', type:'scatter', name:'mel '+k+' ('+Math.round(mid)+' Hz)', line:{color:colors[pi], width:2}, fill:'tozeroy', fillcolor:colors[pi].replace(')',',0.18)').replace('rgb','rgba')});
    }
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Mel Filtre Bankası: 3 Üçgen Filtre':'Mel Filterbank: 3 Triangular Filters', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'frekans (Hz)':'frequency (Hz)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'filtre tepkisi':'filter response', gridcolor:T.grid, zerolinecolor:T.zero, range:[0,1.1]},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, traces, layout, {responsive:true, displayModeBar:false});
  }

  function mfccPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var T_frames = 60, n_mfcc = 13;
    var z = [];
    for (var ci=0;ci<n_mfcc;ci++) {
      var row = [];
      for (var ti=0;ti<T_frames;ti++) {
        var t_s = ti/T_frames * 3;
        var v = 0;
        if (ci === 0) v = 8 + 4*Math.sin(t_s*2.5);  // c0 ~ loudness
        else if (ci < 5) v = 2*Math.sin(ci*0.7 + t_s*3.0) + (ti % 12 < 6 ? 1.5 : -1.5);
        else v = (Math.random()-0.5) * 1.5;
        // silence in the middle
        if (t_s > 1.4 && t_s < 1.7) v = ci === 0 ? -10 : 0;
        row.push(v);
      }
      z.push(row);
    }
    var times = []; for (var i=0;i<T_frames;i++) times.push(i/T_frames * 3);
    var coeffs = []; for (var i=0;i<n_mfcc;i++) coeffs.push(i);
    var trace = {z:z, x:times, y:coeffs, type:'heatmap', colorscale:[[0,'#1a0e2e'],[0.3,'#5a2068'],[0.6,'#c84068'],[0.85,'#f59f4a'],[1,'#fef0a4']], showscale:true, colorbar:{title:'mag', titlefont:{color:T.text}, tickfont:{color:T.text}}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'MFCC (13 katsayı, 3 saniye konuşma)':'MFCC (13 coefficients, 3 s speech)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman (s)':'time (s)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'MFCC indeksi':'MFCC index', gridcolor:T.grid, zerolinecolor:T.zero}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  melPlot('plot-al3-mel-en','en');
  mfccPlot('plot-al3-mfcc-en','en');
  melPlot('plot-al3-mel-tr','tr');
  mfccPlot('plot-al3-mfcc-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>İnsan duyumu doğrusal değildir.</strong> 100 Hz'den 200 Hz'e bir frekansı iki katına çıkarmak büyük bir sıçrama gibi hissettirir (bir oktav); 5000 Hz'den 10000 Hz'e iki katına çıkarmak mutlak mesafe 50 kat daha büyük olmasına rağmen kabaca aynı sıçrama gibi hissettirir. Doğrusal frekans spektrogramları insanların iyi ayırt edemediği yüksek frekanslarda çözünürlüğü boşa harcar ve konuşma için en önemli olan düşük frekanslardan çözünürlüğü esirger.</p>

<p class="l-text">Bu ders mel ölçeğini (algısal olarak hizalanmış bir frekans ekseni), mel filtre bankasını (doğrusal bir spektrogramı mel bölmelere yeniden eşlemek), her modern konuşma modelinin girdi olarak aldığı log-mel spektrogramı ve MFCC'leri (Mel-Frekans Kepstral Katsayılar) -- derin öğrenmeden önce 30 yıl konuşma tanımaya hükmeden özellik -- tanıtır. Sonunda bu özelliklerden herhangi birini üç satır librosa ile çıkarabilirsiniz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Algısal mel ölçeği formülüyle Hz'i mel'e çevireceksin</li>
<li>Doğrusal bir spektrogramı binleyen üçgensel mel filtre bankası kuracaksın</li>
<li>Her Whisper sınıfı modelin beklediği log-mel spektrogramı hesaplayacaksın</li>
<li>16kHz sinyalden DCT ve mel filtre bankasıyla MFCC üreteceksin</li>
<li>Aynı klipte doğrusal, mel ve MFCC özniteliklerini yan yana karşılaştıracaksın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Mel Ölçeği</h2>

<p class="l-text">1930'larda Stevens, Volkmann ve Newman insan deneklerden frekans aralıklarını ikiye bölmelerini istedi: "200 Hz ile 1000 Hz arasındaki orta noktanın hangi frekans olduğunu hissediyorsunuz?" Denekler tutarlı bir şekilde geometrik ortalamadan daha düşük frekansları seçti -- perde algımız yüksek frekanslarda sıkışır. Verilere bir fonksiyon uydurdular ve buna mel ölçeği dediler.</p>

<div class="katex-block">$$m = 2595 \\, \\log_{10}\\!\\left(1 + \\frac{f}{700}\\right)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">f</div><div class="card-body">Hz cinsinden frekans (giriş).</div></div>
<div class="calc-card"><div class="card-title">m</div><div class="card-body">Mel değeri (çıkış). Algılanan perde olarak yaklaşık doğrusal.</div></div>
<div class="calc-card"><div class="card-title">700</div><div class="card-body">Hz sabiti. 700 Hz altında ölçek kabaca doğrusaldır; üzerinde logaritmik olur.</div></div>
<div class="calc-card"><div class="card-title">2595</div><div class="card-body">1000 Hz'in kabaca 1000 mel'e eşlenmesini sağlayan ölçeklendirme faktörü.</div></div>
<div class="calc-card"><div class="card-title">log10</div><div class="card-body">Yüksek frekanslarda algısal sıkıştırmayı yakalar.</div></div>
<div class="calc-card"><div class="card-title">Tersi</div><div class="card-body">f = 700 * (10^(m/2595) - 1). Mel'i Hz'e geri dönüştürmek için kullanılır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: mel eşlemesi</div><div class="example-body">100 Hz -> 150 mel. 1000 Hz -> 1000 mel. 2000 Hz -> 1521 mel. 4000 Hz -> 2146 mel. 8000 Hz -> 2840 mel. İlk 1000 mel duyulabilir aralığın yalnızca alt 1000 Hz'ini kapsar; ikinci 1000 mel sonraki 6000 Hz'i kapsar. Bunun beyninizin duyduğuyla ne kadar hizalı olduğunu abartmak zor.</div></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> librosa

<span class="cm"># Elle yazılmış mel formülü (Stevens-Volkmann)</span>
<span class="kw">def</span> <span class="fn">hz_to_mel</span>(f):
    <span class="kw">return</span> <span class="num">2595</span> * np.<span class="fn">log10</span>(<span class="num">1</span> + f / <span class="num">700.0</span>)

<span class="kw">def</span> <span class="fn">mel_to_hz</span>(m):
    <span class="kw">return</span> <span class="num">700.0</span> * (<span class="num">10</span> ** (m / <span class="num">2595</span>) - <span class="num">1</span>)

<span class="cm"># Hızlı akıl sağlığı kontrolü</span>
<span class="kw">for</span> hz <span class="kw">in</span> [<span class="num">100</span>, <span class="num">500</span>, <span class="num">1000</span>, <span class="num">2000</span>, <span class="num">4000</span>, <span class="num">8000</span>]:
    m = <span class="fn">hz_to_mel</span>(hz)
    back = <span class="fn">mel_to_hz</span>(m)
    <span class="fn">print</span>(f<span class="str">"{hz} Hz -&gt; {m:.0f} mel -&gt; {back:.1f} Hz"</span>)

<span class="cm"># librosa aynı fonksiyonu içerir -- üretimde her zaman bunu tercih edin</span>
<span class="fn">print</span>(librosa.<span class="fn">hz_to_mel</span>(<span class="num">1000</span>))   <span class="cm"># 1000.05</span>
<span class="fn">print</span>(librosa.<span class="fn">mel_to_hz</span>(<span class="num">1000</span>))   <span class="cm"># 1000 Hz</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Standart formül \`mel = 2595 * log10(1 + hz / 700)\` üzerinden mel ölçeği. Sadece numpy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
def hz_to_mel(hz): return 2595.0 * np.log10(1.0 + hz / 700.0)
def mel_to_hz(mel): return 700.0 * (10 ** (mel / 2595.0) - 1.0)
test = np.array([100, 1000, 2000, 4000, 8000])
print('Hz   →   mel')
for h in test:
    print(f'  {h:5d}  →  {hz_to_mel(h):7.1f}')
print('Round-trip 1000 mel → Hz:', round(float(mel_to_hz(1000)), 1))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Mel formülünü doğrudan uygular, böylece bunun sadece tek satır olduğunu görebilirsiniz -- sihir yok. 2) Ters formül mel değerlerini Hz'e geri dönüştürmenize olanak tanır, mel-spektrogramın y eksenini etiketlemek istediğinizde gerekir. 3) Akıl sağlığı döngüsü her iki fonksiyonun doğru olduğunu doğrulamak için gidiş-dönüş değerlerini yazdırır. 4) librosa <code>hz_to_mel</code> ve <code>mel_to_hz</code> sunar; üretim kodunda her zaman bunları kullanın (varsayılan olarak aynı Stevens formülünü kullanır ama biraz farklı Slaney varyantını da destekler).</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Mel Filtre Bankası</h2>

<p class="l-text">Mel filtre bankası, merkezleri mel ölçeğinde eşit aralıklı üçgen filtreler kümesidir. Her filtre FFT bölmelerinin ağırlıklı toplamını hesaplar -- bir mel bandındaki kaba taneli enerji. Bunları yığın ve mel-spektrogram elde edersiniz: doğrusal spektrogramın daha küçük, algısal olarak anlamlı bir versiyonu.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">n_mels</div><div class="card-body">Mel bantlarının sayısı. Tipik: 40 (klasik), 80 (Whisper), 128 (yüksek kaliteli TTS).</div></div>
<div class="calc-card"><div class="card-title">f_min</div><div class="card-body">Dahil edilecek en düşük frekans. Konuşma: 0 Hz. Müzik: 20 Hz. Çok düşük gümbürtüyü kaldırma: 80 Hz.</div></div>
<div class="calc-card"><div class="card-title">f_max</div><div class="card-body">En yüksek frekans. Varsayılan sr/2 (Nyquist). Konuşma: 16 kHz sr'de 8000 Hz.</div></div>
<div class="calc-card"><div class="card-title">Üçgen şekil</div><div class="card-body">Her filtre kendi merkez melinde tepe yapar ve komşuların merkezlerinde doğrusal olarak sıfıra düşer.</div></div>
<div class="calc-card"><div class="card-title">Filtre toplamı</div><div class="card-body">Her FFT bölmesi tipik olarak 2 bitişik mel filtresine katkı sağlar; toplam ağırlık bilinen bir sabite integre olur.</div></div>
<div class="calc-card"><div class="card-title">Çıkış boyutu</div><div class="card-body">(n_mels, T) -- (n_fft/2+1, T)'den çok daha küçük. 1024 bölmeli doğrusal spec'ten 80 kat az parametre.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

sr = <span class="num">16000</span>
n_fft = <span class="num">400</span>
n_mels = <span class="num">80</span>

<span class="cm"># 1) Mel filtre bankasını oluştur: şekil (n_mels, n_fft/2 + 1)</span>
mel_basis = librosa.filters.<span class="fn">mel</span>(sr=sr, n_fft=n_fft, n_mels=n_mels, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>)
<span class="fn">print</span>(mel_basis.shape)        <span class="cm"># (80, 201)</span>

<span class="cm"># Her satır bir üçgen filtredir</span>
<span class="cm"># Hz cinsinden filtrelerin merkez frekansları:</span>
mel_centers = librosa.<span class="fn">mel_frequencies</span>(n_mels=n_mels + <span class="num">2</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>)
<span class="fn">print</span>(mel_centers[:<span class="num">10</span>])     <span class="cm"># kabaca [0, 100, 200, 300, 400, 500, 600, 700, 800, 900]</span>
<span class="fn">print</span>(mel_centers[-<span class="num">5</span>:])     <span class="cm"># kabaca [6500, 7000, 7500, 7800, 8000]</span>

<span class="cm"># 2) Filtre bankasını doğrusal bir spektrograma uygula</span>
y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">3.0</span>)
S = np.<span class="fn">abs</span>(librosa.<span class="fn">stft</span>(y, n_fft=n_fft, hop_length=<span class="num">160</span>)) ** <span class="num">2</span>   <span class="cm"># güç spec (201, T)</span>
mel_spec = mel_basis @ S
<span class="fn">print</span>(<span class="str">"dogrusal spec:"</span>, S.shape)        <span class="cm"># (201, T)</span>
<span class="fn">print</span>(<span class="str">"mel spec:    "</span>, mel_spec.shape)  <span class="cm"># (80, T) -- sıkıştırılmış</span>

<span class="cm"># 3) librosa tek çağrılı yardımcı sunar</span>
mel_spec_v2 = librosa.feature.<span class="fn">melspectrogram</span>(
    y=y, sr=sr, n_fft=n_fft, hop_length=<span class="num">160</span>,
    n_mels=n_mels, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>
)
<span class="fn">print</span>(np.<span class="fn">allclose</span>(mel_spec, mel_spec_v2, rtol=<span class="num">1e-3</span>))   <span class="cm"># True</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Numpy ile mel filtre bankası: fmin ile fmax arasında üçgen filtreler, güç spektrumuna uygulanır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
n_mel = 24
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
power = np.abs(Z) ** 2                                    # (freq, time)
def hz_to_mel(h): return 2595 * np.log10(1 + h / 700)
def mel_to_hz(m): return 700 * (10 ** (m / 2595) - 1)
mel_pts = np.linspace(hz_to_mel(0), hz_to_mel(sr/2), n_mel + 2)
hz_pts = mel_to_hz(mel_pts)
fb = np.zeros((n_mel, len(f)))
for m in range(n_mel):
    lo, ce, hi = hz_pts[m], hz_pts[m+1], hz_pts[m+2]
    fb[m] = np.maximum(0, np.minimum((f-lo)/(ce-lo+1e-9), (hi-f)/(hi-ce+1e-9)))
mel_spec = fb @ power
print('Mel filter bank :', fb.shape)
print('Mel spectrogram :', mel_spec.shape)
print('Mean per band (first 6):', np.round(mel_spec.mean(axis=1)[:6], 2))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>librosa.filters.mel</code> filtre bankasını şekli (80, 201) olan bir matris olarak inşa eder. Her satır bir mel merkezinde tepe yapan bir üçgendir. İlk birkaç merkez 0 Hz yakınında kümelenir (mel ölçeğinin doğrusal bölgesi); son merkezler geniş yayılır (logaritmik bölge). 2) Konuşma sesinden düzenli bir güç spektrogramı hesaplar, sonra filtre bankası matrisiyle çarpar. Matris çarpımı 201 doğrusal bölmeyi her çerçeve başına 80 mel bölmeye sıkıştırır. (80, T) şekli sinirsel konuşma modellerinin standart girdisidir. 3) <code>librosa.feature.melspectrogram</code> tüm bunları tek bir fonksiyon çağrısında sarar -- gerçek kodda her zaman bunu kullanın; her ses dataloader'ının dahili olarak yaptığı şey budur.</p>

<div id="plot-al3-mel-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Küçük 8 bantlı bir filtre bankasından üç üçgen mel filtresi. İlk filtre düşük Hz'de dar tabanla tepe yapar; sonuncusu çok daha geniş tabanla yüksek Hz'de tepe yapar çünkü mel ölçeği orada logaritmiktir. Doğrusal bir spektrograma uygulandığında, her filtre üçgeninin altındaki FFT bölmelerini yüksekliğe göre ağırlıklı toplar. 201 ince taneli doğrusal bölme bu şekilde 80 algısal olarak anlamlı mel bölmesine dönüşür.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Log-Mel Spektrogramı</h2>

<p class="l-text">Mel-spektrogramın çok büyük dinamik aralığı vardır: sessiz bir örnek yüksek bir örnekten milyonlarca kat daha küçüktür. Ağlar bu tür aralıklarla zorlanır. Düzeltmesi log almaktır -- bu evrensel konuşma-ML özelliğidir. "Log-mel" veya "log mel filtre bankası" Whisper, wav2vec, HuBERT, Tacotron, her konuşma modelinin girdi olarak aldığı şeydir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">5.0</span>)

<span class="cm"># 1) Güç mel-spektrogramı</span>
mel = librosa.feature.<span class="fn">melspectrogram</span>(
    y=y, sr=sr,
    n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>,
    n_mels=<span class="num">80</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>,
    power=<span class="num">2.0</span>          <span class="cm"># power=2 -&gt; enerji. Genlik için power=1 kullanın.</span>
)
<span class="fn">print</span>(<span class="str">"mel:"</span>, mel.shape, mel.<span class="fn">min</span>(), mel.<span class="fn">max</span>())
<span class="cm"># mel: (80, T) çok büyük aralık</span>

<span class="cm"># 2) Log ölçeğine dönüştür</span>
log_mel = librosa.<span class="fn">power_to_db</span>(mel, ref=np.<span class="fn">max</span>)
<span class="cm"># Eşdeğer: log_mel = 10 * np.log10(mel + 1e-10)</span>
<span class="fn">print</span>(<span class="str">"log_mel:"</span>, log_mel.shape, log_mel.<span class="fn">min</span>(), log_mel.<span class="fn">max</span>())
<span class="cm"># log_mel: (80, T) aralık kabaca [-80, 0] dB</span>

<span class="cm"># 3) Whisper tarzı log-mel: [-1, 1]'e normalize et</span>
<span class="kw">def</span> <span class="fn">whisper_log_mel</span>(y, sr=<span class="num">16000</span>, n_mels=<span class="num">80</span>):
    mel = librosa.feature.<span class="fn">melspectrogram</span>(
        y=y, sr=sr, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>,
        n_mels=n_mels, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>, power=<span class="num">2.0</span>
    )
    log_mel = np.<span class="fn">log10</span>(np.<span class="fn">maximum</span>(mel, <span class="num">1e-10</span>))
    log_mel = np.<span class="fn">maximum</span>(log_mel, log_mel.<span class="fn">max</span>() - <span class="num">8.0</span>)   <span class="cm"># tabanı kırp</span>
    log_mel = (log_mel + <span class="num">4.0</span>) / <span class="num">4.0</span>                    <span class="cm"># normalize</span>
    <span class="kw">return</span> log_mel

X = <span class="fn">whisper_log_mel</span>(y)
<span class="fn">print</span>(<span class="str">"whisper tarzi:"</span>, X.shape, X.<span class="fn">min</span>(), X.<span class="fn">max</span>())  <span class="cm"># kabaca [-1, 1]</span>

<span class="cm"># 4) PyTorch deyimi</span>
<span class="kw">import</span> torch
log_mel_t = torch.<span class="fn">from_numpy</span>(X).<span class="fn">float</span>().<span class="fn">unsqueeze</span>(<span class="num">0</span>)   <span class="cm"># (1, n_mels, T)</span>
<span class="fn">print</span>(<span class="str">"torch:"</span>, log_mel_t.shape, log_mel_t.dtype)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Log-mel: mel spektrogramının logaritmasını al. Konuşma-ML için evrensel özelliktir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
power = np.abs(Z) ** 2
# very simple 16-band rectangular mel approximation
edges = np.linspace(0, len(f), 17, dtype=int)
mel = np.stack([power[edges[i]:edges[i+1]].mean(axis=0) for i in range(16)])
log_mel = np.log(mel + 1e-9)
print('mel       :', mel.shape, '   range', round(float(mel.min()), 4), '→', round(float(mel.max()), 2))
print('log-mel   :', log_mel.shape, ' range', round(float(log_mel.min()), 2), '→', round(float(log_mel.max()), 2))
print('Per-frame normalize: mean', round(float(log_mel.mean()), 3),
      ' std', round(float(log_mel.std()), 3))</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Güç mel-spektrogramını hesaplar. <code>power=2.0</code> enerji ile çalıştığımız anlamına gelir (büyüklük karesi); bazı hatlar <code>power=1</code>'i (genlik) tercih eder -- ikisi de yaygındır. 2) <code>power_to_db</code> <code>10 * log10</code> uygular, devasa dinamik aralığı kabaca [-80, 0] dB ölçeğine sıkıştırır. 3) Whisper'a özgü normalizasyon tabanı maksimumun 8 dB altına kırpar, sonra doğrusal olarak [-1, 1]'e yeniden ölçeklendirir. Bu tam olarak <code>WhisperProcessor</code>'ın dahili olarak yaptığı şeydir; HF işlemcisini atlamak ve kendi hattınızı yazmak istediğinizde bunu yeniden üretmek faydalıdır. 4) PyTorch deyimi: numpy'den, float'a, batch boyutu ekle. Model (B, n_mels, T) şekli bekler.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: log neden sinir ağlarını mutlu eder</div><div class="example-body">Log olmadan: -20 dB örneğin gücü 0.01, -60 dB örneğin gücü 1e-6. Oranları 10000. Bir ağın softmax/sigmoid'i bu tür aralıkları işlemeye çalışırken doyar. Log ile: aynı örnekler -20 ve -60 olur -- 40 fark, ağın kolayca öğrenebileceği bir şey. Log çarpımsal farkları tam olarak gradyan inişinin tercih ettiği şey olan toplamsal olanlara sıkıştırır.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. MFCC: Mel-Frekans Kepstral Katsayılar</h2>

<p class="l-text">Derin öğrenmeden önce baskın konuşma özelliği MFCC idi. Tarif: log-mel'i hesapla, sonra mel ekseni boyunca Ayrık Kosinüs Dönüşümü (DCT) al. DCT mel katsayılarının korelasyonunu bozar (enerjinin çoğu ilk birkaç katsayıya iner) ve bir düzleştirici görevi görür. İlk 13 katsayı spektral zarfı yakalar; daha yüksek olanlar ince ayrıntıyı yakalar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">n_mfcc</div><div class="card-body">Tutulacak MFCC sayısı. Klasik ASR: 13 temel + 13 delta + 13 delta-delta = 39.</div></div>
<div class="calc-card"><div class="card-title">DCT tip 2</div><div class="card-body">MFCC'de kullanılan standart DCT. Gerçek, ortonormal, ayrılabilir.</div></div>
<div class="calc-card"><div class="card-title">Korelasyon bozma</div><div class="card-body">Mel bölmeleri yüksek korelasyonludur; DCT çıktıları neredeyse bağımsızdır. GMM/HMM modelleri bunu sever.</div></div>
<div class="calc-card"><div class="card-title">İlk MFCC</div><div class="card-body">Ortalama yüksekliği yakalar. Kayıt seviyesine bağlı olduğu için sıklıkla atılır.</div></div>
<div class="calc-card"><div class="card-title">Deltalar</div><div class="card-body">Zaman boyunca ilk fark. Spektral değişim oranını yakalar. Koartikülasyonu modellemeye yardımcı olur.</div></div>
<div class="calc-card"><div class="card-title">Delta-deltalar</div><div class="card-body">İkinci fark. Spektral değişimin ivmesini yakalar.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">3.0</span>)

<span class="cm"># 1) Doğrudan MFCC çıkarımı</span>
mfcc = librosa.feature.<span class="fn">mfcc</span>(
    y=y, sr=sr,
    n_mfcc=<span class="num">13</span>,
    n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>,
    n_mels=<span class="num">80</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>,
)
<span class="fn">print</span>(<span class="str">"mfcc:"</span>, mfcc.shape)      <span class="cm"># (13, T)</span>
<span class="fn">print</span>(<span class="str">"aralik:"</span>, mfcc.<span class="fn">min</span>(), mfcc.<span class="fn">max</span>())

<span class="cm"># 2) Manuel: log-mel -&gt; DCT</span>
<span class="kw">from</span> scipy.fftpack <span class="kw">import</span> dct
mel = librosa.feature.<span class="fn">melspectrogram</span>(
    y=y, sr=sr, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>, n_mels=<span class="num">80</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>
)
log_mel = librosa.<span class="fn">power_to_db</span>(mel, ref=<span class="num">1.0</span>)
mfcc_manual = <span class="fn">dct</span>(log_mel, type=<span class="num">2</span>, axis=<span class="num">0</span>, norm=<span class="str">"ortho"</span>)[: <span class="num">13</span>]
<span class="fn">print</span>(<span class="str">"manuel:"</span>, mfcc_manual.shape)   <span class="cm"># (13, T)</span>
<span class="cm"># Sayısal olarak librosa sürümüne çok yakın (küçük ref faktör farkı)</span>

<span class="cm"># 3) Delta ve delta-delta ekle: klasik 39 boyutlu özellik vektörü</span>
delta = librosa.feature.<span class="fn">delta</span>(mfcc, order=<span class="num">1</span>)
delta2 = librosa.feature.<span class="fn">delta</span>(mfcc, order=<span class="num">2</span>)
features = np.<span class="fn">vstack</span>([mfcc, delta, delta2])
<span class="fn">print</span>(<span class="str">"39B ASR ozellikleri:"</span>, features.shape)   <span class="cm"># (39, T)

# 4) Kepstral ortalama normalizasyonu (söyleme başına)</span>
features_cmn = features - features.<span class="fn">mean</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
<span class="fn">print</span>(<span class="str">"CMN sonrasi ortalama:"</span>, features_cmn.<span class="fn">mean</span>(axis=<span class="num">1</span>))  <span class="cm"># kabaca sıfır</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">MFCC — log-mel hesapla, ardından DCT uygula. scipy.fft.dct kepstrum katsayılarını verir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
from scipy.fft import dct
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
power = np.abs(Z) ** 2
edges = np.linspace(0, len(f), 17, dtype=int)
mel = np.stack([power[edges[i]:edges[i+1]].mean(axis=0) for i in range(16)])
log_mel = np.log(mel + 1e-9)
mfcc = dct(log_mel, axis=0, norm='ortho')[:13]
print('MFCC shape:', mfcc.shape, '  (13 coefficients × frames)')
print('Mean per coef:', np.round(mfcc.mean(axis=1), 2))
print('Std  per coef:', np.round(mfcc.std(axis=1), 2))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>librosa.feature.mfcc</code> tüm hattı tek çağrıda yapar: STFT, güç mel, log, DCT, ilk n_mfcc katsayıyı al. Çıktı (13, T) derin öğrenme öncesi kanonik konuşma özelliğidir. 2) Manuel uygulama tarifi şeffaf yapar: log-mel scipy'nin DCT tip 2'si üzerinden frekans ekseni boyunca ilk 13 katsayıyı tutar. 3) Deltalar (zaman boyunca ilk fark) ve delta-deltalar (ikinci fark) dinamikleri yakalar; birleştirme 39 boyutlu bir vektör verir, 1990 ile 2015 arasında her HMM tabanlı tanıyıcının kullandığı klasik Kaldi/HTK özelliği. 4) Kepstral ortalama normalizasyonu kanal etkilerini (mikrofon rengi, oda akustiği) kaldırmak için söyleme başına ortalamayı çıkarır -- küçük ama tutarlı bir ASR kazancı.</p>

<div id="plot-al3-mfcc-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> 3 saniyelik bir konuşma klibinin ilk 13 MFCC katsayısı. Katsayı 0 (en parlak bant) yüksekliği izler. Katsayılar 1-3 yavaş spektral şekli (formant yapısı) taşır. Daha yüksek katsayılar giderek daha ince taneli ve gürültülüdür. GMM-HMM bir konuşma modeli bu matrisin tamamını gözlem dizisi olarak tüketir, bir boyut boyunca katsayılar ve diğer boyut boyunca zaman.</div>

<div class="l-note"><strong>MFCC'ler şimdi neden çoğunlukla tarih:</strong> derin modeller DCT adımı olmadan doğrudan log-mel'den öğrenebilir. DCT, modellerin sınırlı kapasitesi olduğunda yararlıydı (köşegen kovaryanslı GMM korelasyonsuz özelliklere ihtiyaç duyar); CNN/transformer ihtiyacı olan korelasyon bozmayı kendi öğrenir. Yani modern konuşma modelleri 80 kanallı log-mel kullanır; klasik ASR 13-39 MFCC kullandı.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Yan Yana: Doğrusal vs Mel vs MFCC</h2>

<p class="l-text">Üçü de aynı sesin farklı y ekseni yorumlarına sahip 2B görüntüleridir. Görsel karşılaştırma ödünleşimleri netleştirir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> librosa.display
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

y, sr = librosa.<span class="fn">load</span>(librosa.ex(<span class="str">"libri1"</span>), sr=<span class="num">16000</span>, duration=<span class="num">5.0</span>)

<span class="cm"># 1) Doğrusal spektrogram</span>
S_lin = librosa.<span class="fn">amplitude_to_db</span>(np.<span class="fn">abs</span>(librosa.<span class="fn">stft</span>(y, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>)), ref=np.<span class="fn">max</span>)

<span class="cm"># 2) Mel spektrogramı (log)</span>
mel = librosa.feature.<span class="fn">melspectrogram</span>(y=y, sr=sr, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>, n_mels=<span class="num">80</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>)
S_mel = librosa.<span class="fn">power_to_db</span>(mel, ref=np.<span class="fn">max</span>)

<span class="cm"># 3) MFCC</span>
S_mfcc = librosa.feature.<span class="fn">mfcc</span>(y=y, sr=sr, n_mfcc=<span class="num">13</span>, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>, n_mels=<span class="num">80</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>)

fig, axes = plt.<span class="fn">subplots</span>(<span class="num">3</span>, <span class="num">1</span>, figsize=(<span class="num">10</span>, <span class="num">9</span>))
librosa.display.<span class="fn">specshow</span>(S_lin, sr=sr, hop_length=<span class="num">160</span>, x_axis=<span class="str">"time"</span>, y_axis=<span class="str">"hz"</span>, cmap=<span class="str">"magma"</span>, ax=axes[<span class="num">0</span>])
axes[<span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"Dogrusal frekans spektrogrami (201 bolme)"</span>)

librosa.display.<span class="fn">specshow</span>(S_mel, sr=sr, hop_length=<span class="num">160</span>, x_axis=<span class="str">"time"</span>, y_axis=<span class="str">"mel"</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>, cmap=<span class="str">"magma"</span>, ax=axes[<span class="num">1</span>])
axes[<span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"Log-mel spektrogrami (80 bolme)"</span>)

librosa.display.<span class="fn">specshow</span>(S_mfcc, sr=sr, hop_length=<span class="num">160</span>, x_axis=<span class="str">"time"</span>, cmap=<span class="str">"magma"</span>, ax=axes[<span class="num">2</span>])
axes[<span class="num">2</span>].<span class="fn">set_title</span>(<span class="str">"MFCC (13 katsayi)"</span>)
axes[<span class="num">2</span>].<span class="fn">set_ylabel</span>(<span class="str">"MFCC indeksi"</span>)

plt.<span class="fn">tight_layout</span>()
plt.<span class="fn">show</span>()

<span class="cm"># Bellek karşılaştırması</span>
<span class="fn">print</span>(<span class="str">"dogrusal:"</span>, S_lin.nbytes, <span class="str">"bayt"</span>)
<span class="fn">print</span>(<span class="str">"mel:    "</span>, S_mel.nbytes, <span class="str">"bayt"</span>)
<span class="fn">print</span>(<span class="str">"mfcc:   "</span>, S_mfcc.nbytes, <span class="str">"bayt"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Üç görünümü karşılaştır — doğrusal, log-frekans, mel — yazdırılan özetlerle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
S = np.abs(Z) ** 2
linear_mean = S.mean(axis=1)
log_idx = np.unique(np.round(np.logspace(0, np.log10(len(f)-1), 16)).astype(int))
log_view = linear_mean[log_idx]
mel_view = np.array([S[i:i+len(f)//16].mean() for i in range(0, len(f), len(f)//16)])
print('linear bands :', linear_mean.shape, '  → first 5:', np.round(linear_mean[:5], 3))
print('log-freq bins:', log_view.shape, '  → values:', np.round(log_view, 3))
print('mel approx   :', mel_view.shape, '  → values:', np.round(mel_view[:6], 3))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Çerçeve başına 201 bölmeli doğrusal frekans dB spektrogramı hesaplar -- en yüksek çözünürlüklü görünüm. 2) 80 bölmeli log-mel spektrogramı hesaplar -- modern konuşma modeli girdisi. Y ekseni mel ölçeğindedir, böylece düşük frekanslar (formantların yaşadığı yer) yüksek frekanslardan daha fazla bölme alır. 3) 13 MFCC hesaplar -- klasik sıkıştırılmış temsil. 4) Üçünü yan yana çizer. Doğrusal spec iyi görünür ama mel sürümü çözünürlüğü önemli olan yere odaklar; MFCC neredeyse tüm görsel zenginliği atar ama yine de bir GMM-HMM'in fonemleri tanıması için yeterlidir. 5) Bellek doğrusal -> mel geçerken ~2.5 kat ve mel -> MFCC geçerken bir 6 kat daha küçülür. 1000 saatlik bir veri kümesi için bu yüzlerce GB ile onlarca GB arasındaki farktır.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Doğrusal spec</div><div class="compare-item">En çok ayrıntı, en büyük boyut</div><div class="compare-item">Müzik, vokoderler, ince analiz için kullanın</div><div class="compare-item">201-1025 bölme</div><div class="compare-item">Yeniden yapılandırma için faz mevcut</div></div>
<div class="compare-col"><div class="compare-title">Log-mel spec</div><div class="compare-item">Modern konuşma-ML varsayılanı</div><div class="compare-item">ASR, wav2vec, Whisper, TTS spec tahmini için kullanın</div><div class="compare-item">40-128 bölme</div><div class="compare-item">Tersine çevirme vokoder gerektirir</div></div>
<div class="compare-col"><div class="compare-title">MFCC</div><div class="compare-item">Kompakt, korelasyonsuz</div><div class="compare-item">Eski ASR, ses geri alma, embedding'ler için kullanın</div><div class="compare-item">13-39 katsayı</div><div class="compare-item">Sese tersine çevrilemez</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Pratik Özellik Hattı</h2>

<p class="l-text">Gerçek bir ses dataloader kabaca şunu yapar: ses yükle, yeniden örnekle, log-mel hesapla, normalize et, torch tensörü olarak döndür. İşte kanonik 30 satırlık uygulama.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader

<span class="kw">class</span> <span class="fn">SpeechDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, paths, sr=<span class="num">16000</span>, n_mels=<span class="num">80</span>, max_len=<span class="num">300</span>):
        self.paths = paths
        self.sr = sr
        self.n_mels = n_mels
        self.max_len = max_len     <span class="cm"># zamanda maksimum çerçeve</span>

    <span class="kw">def</span> <span class="fn">__len__</span>(self):
        <span class="kw">return</span> <span class="fn">len</span>(self.paths)

    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, idx):
        y, _ = librosa.<span class="fn">load</span>(self.paths[idx], sr=self.sr, mono=<span class="kw">True</span>)
        <span class="cm"># Tepe normalizasyonu</span>
        peak = np.<span class="fn">abs</span>(y).<span class="fn">max</span>()
        <span class="kw">if</span> peak &gt; <span class="num">0</span>: y = y * (<span class="num">0.99</span> / peak)

        <span class="cm"># Log-mel</span>
        mel = librosa.feature.<span class="fn">melspectrogram</span>(
            y=y, sr=self.sr,
            n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>,
            n_mels=self.n_mels, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>, power=<span class="num">2.0</span>
        )
        log_mel = librosa.<span class="fn">power_to_db</span>(mel, ref=<span class="num">1.0</span>)        <span class="cm"># (n_mels, T)

        # Söyleme başına normalizasyon (CMVN: kepstral ortalama ve varyans)</span>
        log_mel = (log_mel - log_mel.<span class="fn">mean</span>()) / (log_mel.<span class="fn">std</span>() + <span class="num">1e-6</span>)

        <span class="cm"># max_len'e pad / kes</span>
        <span class="kw">if</span> log_mel.shape[<span class="num">1</span>] &gt; self.max_len:
            log_mel = log_mel[:, : self.max_len]
        <span class="kw">else</span>:
            pad = self.max_len - log_mel.shape[<span class="num">1</span>]
            log_mel = np.<span class="fn">pad</span>(log_mel, ((<span class="num">0</span>, <span class="num">0</span>), (<span class="num">0</span>, pad)), constant_values=log_mel.<span class="fn">min</span>())

        <span class="kw">return</span> torch.<span class="fn">from_numpy</span>(log_mel).<span class="fn">float</span>()

<span class="cm"># Kullanım</span>
ds = <span class="fn">SpeechDataset</span>([<span class="str">"a.wav"</span>, <span class="str">"b.wav"</span>, <span class="str">"c.wav"</span>])
<span class="cm"># dl = DataLoader(ds, batch_size=8, shuffle=True, num_workers=4)</span>
<span class="cm"># for batch in dl: print(batch.shape)   # (8, 80, 300)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">30 satırlık bellek-içi dataloader eşdeğeri: sesi pencerele, pencere başına log-mel hesapla.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
def log_mel(y, sr, n_mel=16, n_fft=512, hop=256):
    f, t, Z = signal.stft(y, fs=sr, nperseg=n_fft, noverlap=n_fft-hop)
    P = np.abs(Z)**2
    edges = np.linspace(0, len(f), n_mel+1, dtype=int)
    M = np.stack([P[edges[i]:edges[i+1]].mean(axis=0) for i in range(n_mel)])
    return np.log(M + 1e-9)
# fake 'dataset' = 4 windows of the same clip
windows = [audio[i*4000:(i+1)*4000] for i in range(4)]
feats = np.stack([log_mel(w, sr) for w in windows])
print('Batch shape (N, mel, T):', feats.shape)
print('Per-clip mean energy   :', np.round(feats.mean(axis=(1,2)), 3))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Standart PyTorch Dataset şablonu -- <code>__getitem__</code> her çağrıda bir örnek. 2) Sesi tepe normalizasyonu ile 16 kHz mono yükler. Bu veri kümesi boyunca tutarlı yükseklik garantiler. 3) Log-mel'i bölüm 3'teki gibi tam olarak hesaplar -- 80 mel bölmesi, 25 ms pencere, 10 ms sıçrama. 4) Söyleme başına ortalama/varyans normalizasyonu her örneğin yaklaşık olarak sıfır ortalama ve birim varyansa sahip olmasını sağlar, kanal ve kayıt seviyesi etkilerini kaldırır. 5) Tüm örneklerin bir batch'te aynı şekle sahip olması için sabit bir zaman uzunluğuna pad veya kes. Padding sıfır yerine minimum dB değerini (sessizlik) kullanır. 6) Şekli (n_mels, max_len) olan bir torch tensörü döner -- batch'e yığılmaya ve CNN/transformer'a beslenmeye hazır.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: gerçek bir ASR veri boyutları</div><div class="example-body">Ortalama 10 saniye klipli 1000 saatlik bir ASR corpus için: 360k klip. Her klip fp16'da bir (80, 1000) log-mel matrisine -> 160 KB dönüşür. Tüm veri kümesi: ~58 GB. Ham 16 kHz mono int16'ya kıyasla: 1000 saat * 32 KB/s = 110 GB. Log-mel kabaca 2 kat daha küçüktür ve model üzerinde daha fazla ön işleme olmadan doğrudan eğitilebilir.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Özet ve Sıradaki</h2>

<p class="l-text">Şimdi her konuşma modelinin kullandığı ses özellik araç setine sahipsiniz. Kullanmaya başlama zamanı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mel ölçeği</div><div class="card-body">Algısal frekans ölçeği: 700 Hz altında doğrusal, üzerinde log. Formül: <code>m = 2595 log10(1 + f/700)</code>.</div></div>
<div class="calc-card"><div class="card-title">Mel filtre bankası</div><div class="card-body">Mel aralıklı merkezlerde üçgen filtreler. Doğrusal spec'i çarpar, ~80 bölmeye sıkıştırır.</div></div>
<div class="calc-card"><div class="card-title">Log-mel spektrogramı</div><div class="card-body">Modern konuşma-ML özelliği. Whisper, wav2vec, HuBERT, BERT tarzı ses modelleri tarafından kullanılır.</div></div>
<div class="calc-card"><div class="card-title">MFCC</div><div class="card-body">Log-mel'in DCT'si. ASR için derin öğrenme öncesi standart. Geri alma, klasik modeller için hala yararlı.</div></div>
<div class="calc-card"><div class="card-title">Deltalar</div><div class="card-body">Özelliklerin zaman farkları. Değişim oranını yakalar. 13 + 13 + 13 = 39 boyutlu klasik ASR.</div></div>
<div class="calc-card"><div class="card-title">Söyleme başına norm</div><div class="card-body">Zaman boyunca ortalamayı çıkar, std'ye böl. Kanal etkilerini kaldırır. Çapraz-corpus modelleri için kritik.</div></div>
</div>

<div class="think-box"><div class="think-label">TEMEL ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> İnsan duyumu yüksek frekanslarda logaritmiktir; mel ölçeği bunu tek bir formülle yakalar.<br><strong>2.</strong> Bir mel filtre bankası doğrusal bir spektrogramı bir (n_mels, n_fft/2+1) matrisiyle çarparak algısal olarak anlamlı bir (n_mels, T) temsili üretir.<br><strong>3.</strong> 80 mel bölmesi, 25 ms pencere, 10 ms sıçrama konuşma ML için evrensel modern ayardır.<br><strong>4.</strong> Bir ağa beslemeden önce her zaman mel-spektrogramın log'unu alın. Bu "log-mel" özelliğidir.<br><strong>5.</strong> Whisper tarzı normalizasyon tabanı maks-8 dB'ye kırpar ve [-1, 1]'e yeniden ölçeklendirir.<br><strong>6.</strong> MFCC = log-mel'in DCT'si, ilk 13 katsayıyı tutar. Standart ASR özelliği olurdu; kompakt embedding'ler için hala yararlı.<br><strong>7.</strong> Söyleme başına CMVN normalizasyonu kanal etkilerini kaldırır -- üretim hatlarına her zaman dahil edin.<br><strong>8.</strong> Sonraki ders: Whisper -- log-mel alıp metin çıkaran bir transformer. Tam ASR hattı.</div></div>
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

  function melPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    function hzToMel(f) { return 2595 * Math.log10(1 + f/700); }
    function melToHz(m) { return 700 * (Math.pow(10, m/2595) - 1); }
    var n_mels = 8;
    var fmax = 8000;
    var melMax = hzToMel(fmax);
    var centers = [];
    for (var i=0;i<=n_mels+1;i++) centers.push(melToHz(i * melMax / (n_mels+1)));
    var traces = [];
    var picks = [1, 4, 7];
    var colors = [T.accent, '#4ecdc4', '#f87171'];
    var fillColors = ['rgba(200,169,110,0.18)', 'rgba(78,205,196,0.18)', 'rgba(248,113,113,0.18)'];
    for (var pi=0;pi<picks.length;pi++) {
      var k = picks[pi];
      var lo = centers[k-1], mid = centers[k], hi = centers[k+1];
      var xs = [], ys = [];
      for (var f=0;f<=fmax;f+=20) {
        var v = 0;
        if (f >= lo && f <= mid) v = (f - lo) / (mid - lo);
        else if (f >= mid && f <= hi) v = (hi - f) / (hi - mid);
        xs.push(f); ys.push(v);
      }
      traces.push({x:xs, y:ys, mode:'lines', type:'scatter', name:'mel '+k+' ('+Math.round(mid)+' Hz)', line:{color:colors[pi], width:2}, fill:'tozeroy', fillcolor:fillColors[pi]});
    }
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Mel Filtre Bankası: 3 Üçgen Filtre':'Mel Filterbank: 3 Triangular Filters', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'frekans (Hz)':'frequency (Hz)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'filtre tepkisi':'filter response', gridcolor:T.grid, zerolinecolor:T.zero, range:[0,1.1]},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, traces, layout, {responsive:true, displayModeBar:false});
  }

  function mfccPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var T_frames = 60, n_mfcc = 13;
    var z = [];
    for (var ci=0;ci<n_mfcc;ci++) {
      var row = [];
      for (var ti=0;ti<T_frames;ti++) {
        var t_s = ti/T_frames * 3;
        var v = 0;
        if (ci === 0) v = 8 + 4*Math.sin(t_s*2.5);
        else if (ci < 5) v = 2*Math.sin(ci*0.7 + t_s*3.0) + (ti % 12 < 6 ? 1.5 : -1.5);
        else v = (Math.random()-0.5) * 1.5;
        if (t_s > 1.4 && t_s < 1.7) v = ci === 0 ? -10 : 0;
        row.push(v);
      }
      z.push(row);
    }
    var times = []; for (var i=0;i<T_frames;i++) times.push(i/T_frames * 3);
    var coeffs = []; for (var i=0;i<n_mfcc;i++) coeffs.push(i);
    var trace = {z:z, x:times, y:coeffs, type:'heatmap', colorscale:[[0,'#1a0e2e'],[0.3,'#5a2068'],[0.6,'#c84068'],[0.85,'#f59f4a'],[1,'#fef0a4']], showscale:true, colorbar:{title:'mag', titlefont:{color:T.text}, tickfont:{color:T.text}}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'MFCC (13 katsayı, 3 saniye konuşma)':'MFCC (13 coefficients, 3 s speech)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman (s)':'time (s)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'MFCC indeksi':'MFCC index', gridcolor:T.grid, zerolinecolor:T.zero}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  melPlot('plot-al3-mel-en','en');
  mfccPlot('plot-al3-mfcc-en','en');
  melPlot('plot-al3-mel-tr','tr');
  mfccPlot('plot-al3-mfcc-tr','tr');
}, 250);</script>`
};
