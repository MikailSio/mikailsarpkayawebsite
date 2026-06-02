window.AUDIO_L4 = {

en: `<p class="l-text"><strong>From sound waves to text -- automatic speech recognition is the most useful audio task in production.</strong> For 30 years it required hundreds of millions of dollars of hand-engineered features (MFCC), acoustic models (HMM), pronunciation dictionaries, and language models. In 2022, OpenAI released Whisper: a single transformer trained on 680,000 hours of multilingual web audio that beats every previous system in 99 languages with one model and one Python import.</p>

<p class="l-text">This lesson explains the Whisper architecture, walks through real transcription code with HuggingFace's <code>transformers</code>, covers timestamps and language detection, compares decoding strategies (greedy vs beam search), and ends with a "why this works" reflection on what changed between MFCC+HMM and Whisper. By the end you can transcribe audio in any of 99 languages with three lines of Python.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Map the Whisper encoder-decoder transformer onto its log-mel input pipeline</li>
<li>Chunk arbitrary-length audio into 30-second windows for Whisper inference</li>
<li>Transcribe a clip in three lines using HuggingFace transformers pipeline</li>
<li>Extract word-level timestamps and align them back to the waveform</li>
<li>Detect language and translate to English with one Whisper model</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Whisper Architecture</h2>

<p class="l-text">Whisper is a vanilla encoder-decoder transformer with no architectural surprises. The trick is the data: 680k hours of weakly supervised audio scraped from the internet, paired with auto-generated subtitles and aggressive data cleaning. The architecture itself is from "Attention Is All You Need" (2017) plus log-mel input.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Input</div><div class="card-body">80-channel log-mel spectrogram, 30 seconds (1500 frames at 10 ms hop). Anything shorter is padded.</div></div>
<div class="calc-card"><div class="card-title">Encoder</div><div class="card-body">2 conv layers (subsample 2x) + N transformer blocks. Output: (1500/2, d_model) audio features.</div></div>
<div class="calc-card"><div class="card-title">Decoder</div><div class="card-body">Standard causal transformer. Cross-attends to encoder output. Generates BPE tokens autoregressively.</div></div>
<div class="calc-card"><div class="card-title">Tokens</div><div class="card-body">50k-token BPE vocabulary including special tokens for language, task, timestamps, no-speech.</div></div>
<div class="calc-card"><div class="card-title">Sizes</div><div class="card-body">tiny (39M), base (74M), small (244M), medium (769M), large-v3 (1550M). Quality scales with size.</div></div>
<div class="calc-card"><div class="card-title">Multitask</div><div class="card-body">Same model does transcription, translation (to English), language ID, and voice activity detection.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: the special tokens</div><div class="example-body">A typical Whisper decoded sequence starts with <code>&lt;|startoftranscript|&gt;&lt;|en|&gt;&lt;|transcribe|&gt;&lt;|0.00|&gt;</code>. The first token says "begin"; the second says "language is English"; the third says "task is transcribe (not translate)"; the fourth is a timestamp. The model learned to emit these as part of the sequence -- no separate language detector or task router needed.</div></div>

<div class="l-note"><strong>Why an encoder-decoder?</strong> ASR is a sequence-to-sequence problem: input is a long audio sequence, output is a shorter token sequence. The encoder summarizes the audio into a fixed-length representation; the decoder generates text conditioned on that representation. CTC-only models (wav2vec) emit one token per audio frame and handle alignment differently -- both approaches work; Whisper picked encoder-decoder for its multitask flexibility.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The 30-Second Window</h2>

<p class="l-text">A key design choice: Whisper always processes audio in fixed 30-second chunks. Shorter audio is zero-padded; longer audio is split. This makes batching trivial and the encoder shape constant.</p>

<div class="katex-block">$$T_{\\text{frames}} = \\frac{30 \\, \\text{s} \\cdot 16000 \\, \\text{Hz}}{160 \\, \\text{samples/hop}} = 3000 \\text{ mel frames}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sample rate</div><div class="card-body">16000 Hz mono (always). Resample anything else.</div></div>
<div class="calc-card"><div class="card-title">Window</div><div class="card-body">25 ms = 400 samples. Hop = 10 ms = 160 samples. Same as section 4 of L3.</div></div>
<div class="calc-card"><div class="card-title">Mels</div><div class="card-body">80 channels. Whisper-style normalization: clip floor 8 dB below max, then rescale to [-1, 1].</div></div>
<div class="calc-card"><div class="card-title">Encoder input</div><div class="card-body">(80, 3000). After conv subsample: (1500, d_model). Decoder cross-attends here.</div></div>
<div class="calc-card"><div class="card-title">Padding</div><div class="card-body">Zero-pad on the right if audio is shorter than 30 s. Model is fine with silence.</div></div>
<div class="calc-card"><div class="card-title">Long audio</div><div class="card-body">Process in 30-s sliding windows; HF pipeline handles this with chunk_length_s.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

y, sr = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
<span class="fn">print</span>(<span class="str">"raw audio:"</span>, y.shape, <span class="fn">len</span>(y) / sr, <span class="str">"s"</span>)

<span class="cm"># 1) Pad or truncate to exactly 30 seconds = 480000 samples</span>
target_len = <span class="num">30</span> * <span class="num">16000</span>
<span class="kw">if</span> <span class="fn">len</span>(y) &gt; target_len:
    y = y[:target_len]
<span class="kw">else</span>:
    y = np.<span class="fn">pad</span>(y, (<span class="num">0</span>, target_len - <span class="fn">len</span>(y)))
<span class="fn">print</span>(<span class="str">"padded:"</span>, y.shape)        <span class="cm"># (480000,)

# 2) Compute Whisper log-mel</span>
mel = librosa.feature.<span class="fn">melspectrogram</span>(
    y=y, sr=sr, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>,
    n_mels=<span class="num">80</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>, power=<span class="num">2.0</span>
)
log_mel = np.<span class="fn">log10</span>(np.<span class="fn">maximum</span>(mel, <span class="num">1e-10</span>))
log_mel = np.<span class="fn">maximum</span>(log_mel, log_mel.<span class="fn">max</span>() - <span class="num">8.0</span>)
log_mel = (log_mel + <span class="num">4.0</span>) / <span class="num">4.0</span>
<span class="fn">print</span>(<span class="str">"log-mel:"</span>, log_mel.shape, log_mel.<span class="fn">min</span>(), log_mel.<span class="fn">max</span>())
<span class="cm"># (80, 3001) -- T = sample_count / hop + 1; Whisper trims the last frame</span>
log_mel = log_mel[:, :<span class="num">3000</span>]
<span class="fn">print</span>(<span class="str">"final:"</span>, log_mel.shape)   <span class="cm"># (80, 3000) -- exact Whisper input shape</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Whisper is blocked. We mock the ASR pipeline as a frame-feature → label classifier on the preamble's reviews dataset.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
# Pretend each review is a 'transcribed audio clip' with a known sentiment label
X = TfidfVectorizer(max_features=300).fit_transform(df_reviews['text'])
y = (df_reviews['rating'] &gt;= 4).astype(int)
clf = LogisticRegression(max_iter=200).fit(X, y)
print('Toy ASR-classifier accuracy:', round(clf.score(X, y), 3))
print('Sample transcript →', df_reviews['text'].iloc[0][:60], '...')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads the audio at 16 kHz mono. 2) Pads or truncates to 480000 samples (30 seconds). Whisper expects exactly this length; it is what every model checkpoint was trained for. 3) Computes the mel-spectrogram with the exact settings used in Whisper training. 4) Applies Whisper-specific log + clip + normalize so the values land in [-1, 1]. 5) Trims to 3000 frames. The model's encoder hardcodes this shape; if you give it 3001 it crashes. Once you have a (80, 3000) array, you can feed it to <code>WhisperForConditionalGeneration</code> directly. In practice, <code>WhisperProcessor</code> does this for you in one line -- but knowing the math demystifies what is happening.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Real Transcription with HuggingFace</h2>

<p class="l-text">For day-to-day use you do not implement the spectrogram pipeline yourself. HuggingFace's <code>transformers</code> wraps every Whisper checkpoint with a clean API.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers accelerate librosa</span>
<span class="kw">from</span> transformers <span class="kw">import</span> WhisperProcessor, WhisperForConditionalGeneration
<span class="kw">import</span> librosa
<span class="kw">import</span> torch

<span class="cm"># 1) Load model + processor (downloaded once, cached forever)</span>
model_id = <span class="str">"openai/whisper-small"</span>      <span class="cm"># 244M params, ~1 GB</span>
processor = WhisperProcessor.<span class="fn">from_pretrained</span>(model_id)
model = WhisperForConditionalGeneration.<span class="fn">from_pretrained</span>(model_id)
device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>
model = model.<span class="fn">to</span>(device).<span class="fn">eval</span>()

<span class="cm"># 2) Load audio at 16 kHz mono (Whisper requirement)</span>
audio, sr = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)

<span class="cm"># 3) Convert audio to model input features (the log-mel pipeline above, automated)</span>
inputs = <span class="fn">processor</span>(audio, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>)
input_features = inputs.input_features.<span class="fn">to</span>(device)
<span class="fn">print</span>(input_features.shape)    <span class="cm"># (1, 80, 3000)

# 4) Generate token IDs (decoding)</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    predicted_ids = model.<span class="fn">generate</span>(
        input_features,
        max_new_tokens=<span class="num">128</span>,
        language=<span class="str">"en"</span>,                 <span class="cm"># or None for auto-detect</span>
        task=<span class="str">"transcribe"</span>,             <span class="cm"># or "translate" -&gt; English</span>
        num_beams=<span class="num">5</span>,                   <span class="cm"># beam search width</span>
    )

<span class="cm"># 5) Decode token IDs back to text</span>
text = processor.<span class="fn">batch_decode</span>(predicted_ids, skip_special_tokens=<span class="kw">True</span>)[<span class="num">0</span>]
<span class="fn">print</span>(text)
<span class="cm"># Example output: "Welcome to the show. Today we are going to talk about ..."</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Whisper-like API mocked with our toy classifier — same input/output contract: audio → text guess.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
def transcribe(y, sr):
    # Browser stand-in: derive 4 dummy 'tokens' from FFT bands
    from scipy.fft import rfft
    Y = np.abs(rfft(y))
    bands = np.array_split(Y, 4)
    energies = [float(b.mean()) for b in bands]
    words = ['low','mid-low','mid-high','high']
    return ' '.join(w for w, e in zip(words, energies) if e &gt; np.mean(energies))
print('Mock transcript:', transcribe(audio, sr))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads the Whisper-small model (244M params -- a good balance between quality and speed) along with its processor (handles audio -> features and tokens -> text). The first call downloads ~1 GB; subsequent calls hit the local cache. 2) Loads the input audio at 16 kHz mono using librosa. 3) The processor converts the raw audio array into the (1, 80, 3000) tensor of log-mel features that the model expects -- this is exactly the pipeline from section 2 wrapped in one call. 4) <code>model.generate</code> runs the encoder once and the decoder autoregressively until it emits an end-of-sequence token. <code>language="en"</code> forces English (skip language detection); <code>task="transcribe"</code> means produce same-language text (vs. translate to English). <code>num_beams=5</code> uses beam search for better quality (slower than greedy). 5) <code>batch_decode</code> turns token IDs back into a string and skips the special tokens.</p>

<div id="plot-al4-conf-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Decoder confidence (highest log-probability among predicted tokens) over the duration of a transcription. Confidence stays high for clean speech, dips during noisy or ambiguous regions, and crashes on silence/end-of-audio (where the model emits <code>&lt;|endoftranscript|&gt;</code>). This is the kind of signal you would use to flag low-confidence segments for human review.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Timestamps and Word-Level Alignment</h2>

<p class="l-text">Whisper can emit timestamps interleaved with the text -- and recent versions can even produce word-level timestamps. This is essential for subtitling, podcast indexing, and aligning to existing video.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> pipeline
<span class="kw">import</span> torch

<span class="cm"># Easiest API: the pipeline wrapper</span>
pipe = <span class="fn">pipeline</span>(
    <span class="str">"automatic-speech-recognition"</span>,
    model=<span class="str">"openai/whisper-small"</span>,
    chunk_length_s=<span class="num">30</span>,             <span class="cm"># for &gt;30 s audio, slide windows</span>
    return_timestamps=<span class="str">"word"</span>,        <span class="cm"># word, sentence, or True (sentence)</span>
    device=<span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>,
    generate_kwargs={<span class="str">"language"</span>: <span class="str">"english"</span>, <span class="str">"task"</span>: <span class="str">"transcribe"</span>}
)

result = <span class="fn">pipe</span>(<span class="str">"podcast.wav"</span>)
<span class="fn">print</span>(result[<span class="str">"text"</span>])

<span class="cm"># Word-level alignment</span>
<span class="kw">for</span> chunk <span class="kw">in</span> result[<span class="str">"chunks"</span>][:<span class="num">10</span>]:
    start, end = chunk[<span class="str">"timestamp"</span>]
    word = chunk[<span class="str">"text"</span>]
    <span class="fn">print</span>(f<span class="str">"  [{start:5.2f} - {end:5.2f}]  {word}"</span>)
<span class="cm"># Example:
#   [ 0.00 -  0.42]   Welcome
#   [ 0.42 -  0.78]   to
#   [ 0.78 -  1.34]   the
#   [ 1.34 -  1.92]   show
#   [ 2.04 -  2.30]  .
#   [ 2.30 -  2.96]   Today</span>

<span class="cm"># Sentence-level only (cheaper, often sufficient)</span>
pipe.<span class="fn">return_timestamps</span> = <span class="kw">True</span>
result_s = <span class="fn">pipe</span>(<span class="str">"podcast.wav"</span>)
<span class="kw">for</span> chunk <span class="kw">in</span> result_s[<span class="str">"chunks"</span>][:<span class="num">5</span>]:
    <span class="fn">print</span>(chunk[<span class="str">"timestamp"</span>], chunk[<span class="str">"text"</span>])
<span class="cm"># [(0.0, 5.4), 'Welcome to the show. Today we are going to ...']</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Word-level timestamps mocked with a uniform split of the clip duration.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
duration = len(audio) / sr
tokens = ['hello', 'world', 'this', 'is', 'a', 'demo']
step = duration / len(tokens)
for i, w in enumerate(tokens):
    print(f'[{i*step:0.2f}s → {(i+1)*step:0.2f}s] {w}')
print('Total duration:', round(duration, 3), 's')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a high-level <code>pipeline</code> that handles model loading, chunking long audio, computing features, decoding, and timestamp extraction in one object. <code>chunk_length_s=30</code> splits audio longer than 30 seconds into overlapping windows automatically. 2) Word-level timestamps come from cross-attention alignment: Whisper's decoder attends to encoder positions, and those attention weights map approximately to time. The output <code>chunks</code> list has one entry per word with start and end times in seconds. 3) Sentence-level mode is cheaper because it only emits the timestamp tokens that Whisper natively produces (no extra alignment computation). 4) For real subtitling pipelines, word-level is preferred -- it makes karaoke-style highlighting trivial and survives bad alignment in any single sentence.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: building an SRT subtitle file</div><div class="example-body">After getting <code>result["chunks"]</code> with sentence-level timestamps, formatting an SRT file is 10 lines: for i, chunk in enumerate(chunks): print(i+1); print(format_time(chunk["timestamp"][0]) + " --&gt; " + format_time(chunk["timestamp"][1])); print(chunk["text"]); print(). Use <code>format_time</code> = "00:01:23,456" style. Whisper + 10 lines of Python = subtitle generation that beats most professional services on 10+ languages.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Multilingual: Detect, Transcribe, Translate</h2>

<p class="l-text">Whisper handles 99 languages out of the box. You can let it auto-detect the language, force a specific language, or translate any of the 99 source languages to English.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> WhisperProcessor, WhisperForConditionalGeneration
<span class="kw">import</span> librosa
<span class="kw">import</span> torch

processor = WhisperProcessor.<span class="fn">from_pretrained</span>(<span class="str">"openai/whisper-medium"</span>)
model = WhisperForConditionalGeneration.<span class="fn">from_pretrained</span>(<span class="str">"openai/whisper-medium"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>).<span class="fn">eval</span>()

audio, _ = librosa.<span class="fn">load</span>(<span class="str">"turkish_speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">processor</span>(audio, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 1) Auto-detect language and transcribe</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_auto = model.<span class="fn">generate</span>(inputs.input_features, max_new_tokens=<span class="num">200</span>)
text_auto = processor.<span class="fn">batch_decode</span>(out_auto, skip_special_tokens=<span class="kw">True</span>)[<span class="num">0</span>]
<span class="fn">print</span>(<span class="str">"auto:"</span>, text_auto)

<span class="cm"># 2) Force Turkish, transcribe</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_tr = model.<span class="fn">generate</span>(
        inputs.input_features,
        language=<span class="str">"tr"</span>, task=<span class="str">"transcribe"</span>, max_new_tokens=<span class="num">200</span>
    )
text_tr = processor.<span class="fn">batch_decode</span>(out_tr, skip_special_tokens=<span class="kw">True</span>)[<span class="num">0</span>]
<span class="fn">print</span>(<span class="str">"tr transcript:"</span>, text_tr)

<span class="cm"># 3) Translate Turkish speech to English text</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_en = model.<span class="fn">generate</span>(
        inputs.input_features,
        language=<span class="str">"tr"</span>, task=<span class="str">"translate"</span>, max_new_tokens=<span class="num">200</span>
    )
text_en = processor.<span class="fn">batch_decode</span>(out_en, skip_special_tokens=<span class="kw">True</span>)[<span class="num">0</span>]
<span class="fn">print</span>(<span class="str">"en translation:"</span>, text_en)

<span class="cm"># 4) Get raw language detection probabilities (peek at the first decoded token)</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    audio_features = model.<span class="fn">get_encoder</span>()(inputs.input_features).last_hidden_state
    <span class="cm"># Pretend-decode the first token to get language scores</span>
    init_tokens = torch.<span class="fn">tensor</span>([[model.config.decoder_start_token_id]]).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    logits = <span class="fn">model</span>(input_features=inputs.input_features, decoder_input_ids=init_tokens).logits
    <span class="cm"># Whisper has language tokens at known IDs; max-probability is the detected language</span>
<span class="fn">print</span>(<span class="str">"top-1 detected language token id:"</span>, logits[<span class="num">0</span>, -<span class="num">1</span>].<span class="fn">argmax</span>().<span class="fn">item</span>())</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Multilingual stand-in: simple language-id from character frequency on a tiny corpus.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from collections import Counter
samples = {'en': 'this is a test sentence', 'tr': 'bu bir test cumlesi',
           'de': 'das ist ein test satz',   'es': 'esta es una prueba'}
def lang_score(text):
    c = Counter(text.lower())
    return {l: sum(min(c[ch], Counter(s)[ch]) for ch in set(s)) for l, s in samples.items()}
test = 'is this a sentence'
scores = lang_score(test)
print('Detected:', max(scores, key=scores.get), 'from scores', scores)</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads Whisper-medium (769M params) -- a noticeable jump in quality over small for non-English languages. 2) Auto-detect mode: with no <code>language</code> argument, Whisper looks at the first decoder token and picks whichever language has highest probability, then continues. 3) Forcing Turkish: pass <code>language="tr"</code>; the model skips its own detection and starts in Turkish. Useful when you already know the language and want deterministic results. 4) Translation mode: <code>task="translate"</code> means "regardless of input language, produce English output". This is one model doing what would otherwise require ASR + a separate machine translation system. 5) Manual language detection: by examining the logits at the first decoder position you can read out per-language probabilities -- useful for confidence-aware downstream routing.</p>

<div class="l-warn"><strong>Pitfall:</strong> Translation in Whisper is always to English. If you need other target languages, run Whisper in transcribe mode then pass to a separate translation model (NLLB, M2M-100, GPT-4). For Turkish-to-Spanish: tr-speech -> Whisper-tr-transcribe -> Turkish text -> NLLB tr-es -> Spanish text.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Decoding Strategies: Greedy vs Beam Search</h2>

<p class="l-text">Once the encoder produces audio features, the decoder generates tokens one at a time. There are several strategies for choosing each token, with different speed/quality trade-offs.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Greedy</div><div class="compare-item">Always pick highest-prob token</div><div class="compare-item">Fastest (1x)</div><div class="compare-item">Can lock into bad early choices</div><div class="compare-item">Use for streaming, real-time</div></div>
<div class="compare-col"><div class="compare-title">Beam search (k=5)</div><div class="compare-item">Track 5 best partial sequences</div><div class="compare-item">Slower (~3-4x)</div><div class="compare-item">Often higher accuracy</div><div class="compare-item">Default for batch transcription</div></div>
<div class="compare-col"><div class="compare-title">Sampling (T=0.5)</div><div class="compare-item">Sample from probability distribution</div><div class="compare-item">Same speed as greedy</div><div class="compare-item">More diverse, possibly less accurate</div><div class="compare-item">Use for ensembling, augmentation</div></div>
<div class="compare-col"><div class="compare-title">Nucleus (top-p=0.9)</div><div class="compare-item">Sample from top 90% of probability mass</div><div class="compare-item">Same speed as sampling</div><div class="compare-item">Robust to long tail</div><div class="compare-item">Use when greedy gets stuck</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> librosa
<span class="kw">from</span> transformers <span class="kw">import</span> WhisperProcessor, WhisperForConditionalGeneration

processor = WhisperProcessor.<span class="fn">from_pretrained</span>(<span class="str">"openai/whisper-small"</span>)
model = WhisperForConditionalGeneration.<span class="fn">from_pretrained</span>(<span class="str">"openai/whisper-small"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>).<span class="fn">eval</span>()

audio, _ = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">processor</span>(audio, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
features = inputs.input_features

<span class="cm"># 1) Greedy decoding</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_greedy = model.<span class="fn">generate</span>(features, do_sample=<span class="kw">False</span>, num_beams=<span class="num">1</span>, max_new_tokens=<span class="num">200</span>)

<span class="cm"># 2) Beam search</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_beam = model.<span class="fn">generate</span>(features, num_beams=<span class="num">5</span>, max_new_tokens=<span class="num">200</span>)

<span class="cm"># 3) Sampling with temperature</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_sample = model.<span class="fn">generate</span>(
        features,
        do_sample=<span class="kw">True</span>, temperature=<span class="num">0.5</span>, top_p=<span class="num">0.9</span>,
        max_new_tokens=<span class="num">200</span>
    )

<span class="cm"># 4) Whisper-style fallback: try greedy first, if no_speech_prob high or compression_ratio bad, retry with sampling</span>
<span class="cm"># This is what whisper.cpp / OpenAI's reference implementation does for robustness</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_robust = model.<span class="fn">generate</span>(
        features,
        do_sample=<span class="kw">False</span>,
        num_beams=<span class="num">1</span>,
        compression_ratio_threshold=<span class="num">2.4</span>,    <span class="cm"># reject repetitive output</span>
        no_speech_threshold=<span class="num">0.6</span>,            <span class="cm"># reject silence</span>
        logprob_threshold=-<span class="num">1.0</span>,              <span class="cm"># reject low-confidence</span>
        max_new_tokens=<span class="num">200</span>
    )

<span class="kw">for</span> name, ids <span class="kw">in</span> [(<span class="str">"greedy"</span>, out_greedy), (<span class="str">"beam"</span>, out_beam),
                 (<span class="str">"sample"</span>, out_sample), (<span class="str">"robust"</span>, out_robust)]:
    text = processor.<span class="fn">batch_decode</span>(ids, skip_special_tokens=<span class="kw">True</span>)[<span class="num">0</span>]
    <span class="fn">print</span>(f<span class="str">"{name:8s}: {text[:80]}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Long-audio chunked decoding: split into 1-s windows, summarize each.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
win = sr  # 1 s
chunks = [audio[i:i+win] for i in range(0, len(audio), win)]
for i, c in enumerate(chunks):
    rms = float(np.sqrt(np.mean(c**2)))
    print(f'chunk {i}  ({len(c)/sr:.2f}s)  RMS={rms:.4f}')
print('Total chunks:', len(chunks))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Greedy is the simplest and fastest decoding: at each step pick the most likely token. Risk: if the highest-probability token leads to a bad path, greedy cannot recover. 2) Beam search keeps the top 5 partial sequences alive at each step and picks the one with highest cumulative probability at the end. 3-4x slower but consistently a few WER points better. Default for batch transcription. 3) Temperature sampling adds randomness; useful for ensembles where you transcribe multiple times and pick the consensus. 4) The "robust" pattern is what OpenAI's reference Whisper does: try cheap decoding first, and only retry with sampling if the result looks broken (repetitive output, low confidence, or detected as no-speech). This prevents the catastrophic failure modes of pure greedy.</p>

<div class="think-box"><div class="think-label">THINK</div><div class="think-body"><strong>Why does Whisper succeed where MFCC+HMM failed?</strong> Three reasons. (1) Scale of data: 680k hours vs ~1k hours for classic systems. The bigger the data, the less feature engineering matters. (2) End-to-end learning: HMM was forced to factorize speech into "acoustic model x pronunciation x language model"; Whisper jointly optimizes everything from audio to text. (3) Transformer self-attention: each output token can look at any audio frame, modeling long-range dependencies that HMMs (with first-order Markov assumption) physically cannot capture. The combined effect is roughly 5-10x lower WER on benchmarks and 30+ language coverage with one model.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Wrap-Up: A Production Whisper Function</h2>

<p class="l-text">A clean function you can drop into any project. Handles arbitrary length audio, robust decoding, and structured output.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> pipeline
<span class="kw">import</span> torch

<span class="kw">def</span> <span class="fn">build_transcriber</span>(model=<span class="str">"openai/whisper-small"</span>, device=<span class="kw">None</span>):
    <span class="kw">if</span> device <span class="kw">is</span> <span class="kw">None</span>:
        device = <span class="num">0</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> -<span class="num">1</span>
    <span class="kw">return</span> <span class="fn">pipeline</span>(
        <span class="str">"automatic-speech-recognition"</span>,
        model=model,
        chunk_length_s=<span class="num">30</span>,
        return_timestamps=<span class="str">"word"</span>,
        device=device,
        torch_dtype=torch.float16 <span class="kw">if</span> device != -<span class="num">1</span> <span class="kw">else</span> torch.float32,
    )

<span class="kw">def</span> <span class="fn">transcribe</span>(pipe, audio_path, language=<span class="kw">None</span>, translate=<span class="kw">False</span>):
    gen_kwargs = {}
    <span class="kw">if</span> language: gen_kwargs[<span class="str">"language"</span>] = language
    gen_kwargs[<span class="str">"task"</span>] = <span class="str">"translate"</span> <span class="kw">if</span> translate <span class="kw">else</span> <span class="str">"transcribe"</span>
    out = <span class="fn">pipe</span>(audio_path, generate_kwargs=gen_kwargs)
    <span class="kw">return</span> {
        <span class="str">"text"</span>: out[<span class="str">"text"</span>].<span class="fn">strip</span>(),
        <span class="str">"words"</span>: [
            {<span class="str">"word"</span>: c[<span class="str">"text"</span>].<span class="fn">strip</span>(),
             <span class="str">"start"</span>: c[<span class="str">"timestamp"</span>][<span class="num">0</span>],
             <span class="str">"end"</span>:   c[<span class="str">"timestamp"</span>][<span class="num">1</span>]}
            <span class="kw">for</span> c <span class="kw">in</span> out[<span class="str">"chunks"</span>]
        ],
    }

<span class="cm"># Usage</span>
pipe = <span class="fn">build_transcriber</span>(<span class="str">"openai/whisper-small"</span>)

result = <span class="fn">transcribe</span>(pipe, <span class="str">"english.wav"</span>, language=<span class="str">"english"</span>)
<span class="fn">print</span>(result[<span class="str">"text"</span>])
<span class="fn">print</span>(<span class="fn">len</span>(result[<span class="str">"words"</span>]), <span class="str">"words timestamped"</span>)

result_tr = <span class="fn">transcribe</span>(pipe, <span class="str">"turkish.wav"</span>, language=<span class="str">"turkish"</span>)
<span class="fn">print</span>(result_tr[<span class="str">"text"</span>])

<span class="cm"># Translate Spanish speech to English</span>
result_es = <span class="fn">transcribe</span>(pipe, <span class="str">"spanish.wav"</span>, language=<span class="str">"spanish"</span>, translate=<span class="kw">True</span>)
<span class="fn">print</span>(result_es[<span class="str">"text"</span>])</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">End-to-end helper: a Whisper-style function returning {text, segments, language}.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
def asr(y, sr):
    duration = len(y) / sr
    return {
        'language': 'en',
        'text': '(toy transcript)',
        'segments': [{'start': i*0.5, 'end': (i+1)*0.5, 'text': f'word{i}'}
                     for i in range(int(duration / 0.5))]
    }
out = asr(audio, sr)
for k, v in out.items():
    print(k, ':', v if not isinstance(v, list) else f'{len(v)} segments')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>build_transcriber</code> wraps the HF pipeline with sensible defaults: word-level timestamps, 30-second chunking for long audio, fp16 on GPU for ~2x speedup with no quality loss. The function returns a callable you reuse across requests. 2) <code>transcribe</code> takes the pipe and an audio path; you can optionally specify a language (faster + more reliable than auto-detect) and whether to translate. The result is a clean dict with the full text and per-word timestamps. 3) Usage example shows the same function handling English, Turkish, and translation -- a single object you carry across your codebase. 4) For production deployment, wrap this in a queue (Celery, Redis) so requests don't block a single GPU; for very high throughput look at <code>faster-whisper</code> (CTranslate2 backend, 4x faster) or <code>insanely-fast-whisper</code> (flash-attention 2, 8x faster).</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Whisper is an encoder-decoder transformer trained on 680k hours of weakly-supervised multilingual audio.<br><strong>2.</strong> Input: 80-channel log-mel of 30 seconds (zero-padded if shorter). Output: BPE token sequence including special tokens for language, task, timestamps.<br><strong>3.</strong> <code>WhisperProcessor</code> handles the audio -> log-mel conversion automatically; <code>WhisperForConditionalGeneration.generate()</code> runs the model.<br><strong>4.</strong> Model sizes: tiny / base / small / medium / large-v3. Pick small for prototyping, medium for production English, large for non-English or hardest cases.<br><strong>5.</strong> Word-level timestamps come from cross-attention; the HF pipeline produces them with <code>return_timestamps="word"</code>.<br><strong>6.</strong> Multilingual: 99 languages transcribe, all 99 -&gt; English translate. Other target languages need a separate MT model.<br><strong>7.</strong> Decoding: greedy is fast, beam search (k=5) is the production default, sampling helps escape repetition loops.<br><strong>8.</strong> Next lesson: the reverse -- text-to-speech. Generating audio from text with Tacotron, FastSpeech, VITS, and modern HF TTS models.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. 2024-2026 Landscape: Beyond Whisper-Large</h2>

<p class="l-text"><strong>The ASR frontier moved twice since this lesson's core material.</strong> First, OpenAI released <strong>Whisper v3-large-turbo</strong> in October 2024 -- a new Pareto point that keeps near-large-v3 quality at half the size and twice the throughput. Second, the HuggingFace ecosystem matured the "distil" family for budget deployments. Anyone shipping ASR today should at least benchmark these against vanilla large-v3.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Whisper v3-large-turbo (2024-10)</div><div class="card-body">809M parameters (~46% smaller than 1.5B large-v3). Same encoder; decoder slashed from 32 to 4 layers. ~2x faster inference, runs ~4x real-time on a single A100. WER regression: typically +0.5% vs large-v3, slightly worse for translation (decoder does cross-attention work). HF id: <code>openai/whisper-large-v3-turbo</code>.</div></div>
<div class="calc-card"><div class="card-title">Whisper v3 (2023-11)</div><div class="card-body">1.5B params, full multilingual model, 100+ languages including Turkish. New Cantonese support, +10% absolute robustness vs v2 on noisy / accented English. Still the accuracy ceiling for monolingual transcription.</div></div>
<div class="calc-card"><div class="card-title">Distil-Whisper (HF, 2023)</div><div class="card-body">49% smaller, 6x faster than vanilla, 99% accuracy preserved on long-form English. Trained via pseudo-label distillation. Currently English-only; use turbo for multilingual budget.</div></div>
<div class="calc-card"><div class="card-title">Why decoder pruning works</div><div class="card-body">On a single GPU, audio-encoder forward pass dominates latency for batch-1 ASR. The decoder runs once per output token but each pass is cheap; trimming layers there barely changes audio understanding because the encoder's cross-attention output already encodes the linguistic content.</div></div>
<div class="calc-card"><div class="card-title">When to pick which</div><div class="card-body">Real-time / voice-agent: turbo or distil. Highest accuracy / forensic transcription: large-v3. Edge / mobile: tiny/base + quantization. Translation to English: large-v3 (turbo regresses slightly).</div></div>
<div class="calc-card"><div class="card-title">Ecosystem</div><div class="card-body"><code>faster-whisper</code> (CTranslate2) and <code>insanely-fast-whisper</code> (flash-attn 2) wrap turbo too -- combine architectural and runtime gains for ~8x over baseline.</div></div>
</div>

<div class="l-note"><strong>Practical tip:</strong> If you previously deployed <code>whisper-large-v3</code> behind a queue, swapping to <code>whisper-large-v3-turbo</code> is a one-line change and usually pays for itself in GPU hours within a week. Re-run a held-out eval set first to confirm WER stays acceptable for your language and acoustic conditions.</div>
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

  function confPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var t = [], y = [];
    for (var i=0;i<60;i++) {
      var ti = i * 0.2;
      var v = -0.15 - 0.05*Math.random();
      // ambiguous bursts
      if ((ti > 3 && ti < 4) || (ti > 7 && ti < 8.2)) v = -0.6 + 0.1*Math.random();
      // silence at start and end
      if (ti < 0.5) v = -1.2;
      if (ti > 11) v = -1.5;
      t.push(ti); y.push(v);
    }
    var trace = {x:t, y:y, mode:'lines+markers', line:{color:T.accent, width:2}, marker:{size:4, color:T.accent}, name:'log P(token)'};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Whisper Token Güveni Zaman İçinde':'Whisper Token Confidence over Time', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman (s)':'time (s)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'log olasılık':'log probability', gridcolor:T.grid, zerolinecolor:T.zero, range:[-2, 0]}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  confPlot('plot-al4-conf-en','en');
  confPlot('plot-al4-conf-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Ses dalgalarından metne -- otomatik konuşma tanıma üretimdeki en yararlı ses görevidir.</strong> 30 yıl boyunca yüz milyonlarca dolarlık elle mühendislik edilmiş özellikler (MFCC), akustik modeller (HMM), telaffuz sözlükleri ve dil modelleri gerektirdi. 2022'de OpenAI Whisper'ı yayımladı: 680.000 saat çok dilli web sesi üzerinde eğitilmiş tek bir transformer, 99 dilde her önceki sistemi tek bir modelle ve tek bir Python import'uyla yener.</p>

<p class="l-text">Bu ders Whisper mimarisini açıklar, HuggingFace'in <code>transformers</code>'ı ile gerçek transkripsiyon kodunda yürür, zaman damgalarını ve dil algılamasını kapsar, kod çözme stratejilerini (greedy vs beam search) karşılaştırır ve MFCC+HMM ile Whisper arasında neyin değiştiğine dair "neden işe yarıyor" yansıması ile biter. Sonunda 99 dilden herhangi birinde sesi üç satır Python ile transkribe edebilirsiniz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Whisper kodlayıcı-kod çözücü transformerini log-mel input pipeline'ına haritalayacaksın</li>
<li>Whisper çıkarımı için keyfi uzunlukta sesi 30 saniyelik pencerelere böleceksin</li>
<li>HuggingFace transformers pipeline ile bir klipi üç satırda transkribe edeceksin</li>
<li>Kelime düzeyinde zaman damgaları çıkarıp dalga formuna geri hizalayacaksın</li>
<li>Tek bir Whisper modeliyle dil algılayıp İngilizceye çevireceksin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Whisper Mimarisi</h2>

<p class="l-text">Whisper mimari sürpriz olmayan sıradan bir kodlayıcı-kod çözücü transformerdır. Hile veridir: internetten kazınan zayıf denetimli ses + otomatik üretilmiş altyazılar ve agresif veri temizliği ile eşleştirilmiş 680k saat. Mimarinin kendisi "Attention Is All You Need" (2017) artı log-mel girişidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Giriş</div><div class="card-body">80 kanallı log-mel spektrogramı, 30 saniye (10 ms sıçramada 1500 çerçeve). Daha kısa olan padlenir.</div></div>
<div class="calc-card"><div class="card-title">Kodlayıcı</div><div class="card-body">2 conv katmanı (2x altörnekleme) + N transformer bloğu. Çıkış: (1500/2, d_model) ses özellikleri.</div></div>
<div class="calc-card"><div class="card-title">Kod çözücü</div><div class="card-body">Standart nedensel transformer. Kodlayıcı çıkışına çapraz dikkat eder. BPE token'larını otoregresif üretir.</div></div>
<div class="calc-card"><div class="card-title">Token'lar</div><div class="card-body">Dil, görev, zaman damgaları, konuşma yok için özel token'lar dahil 50k token BPE sözlüğü.</div></div>
<div class="calc-card"><div class="card-title">Boyutlar</div><div class="card-body">tiny (39M), base (74M), small (244M), medium (769M), large-v3 (1550M). Kalite boyutla ölçeklenir.</div></div>
<div class="calc-card"><div class="card-title">Çoklu görev</div><div class="card-body">Aynı model transkripsiyon, çeviri (İngilizce'ye), dil ID'si ve ses etkinliği algılaması yapar.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: özel token'lar</div><div class="example-body">Tipik bir Whisper kodu çözülmüş dizi şöyle başlar: <code>&lt;|startoftranscript|&gt;&lt;|en|&gt;&lt;|transcribe|&gt;&lt;|0.00|&gt;</code>. İlk token "başla" der; ikincisi "dil İngilizce" der; üçüncüsü "görev transkribe (çevirme değil)" der; dördüncü bir zaman damgasıdır. Model bunları dizinin parçası olarak yaymayı öğrendi -- ayrı dil dedektörü veya görev yönlendiricisi gerekmiyor.</div></div>

<div class="l-note"><strong>Neden kodlayıcı-kod çözücü?</strong> ASR diziden diziye bir problemdir: giriş uzun bir ses dizisi, çıkış daha kısa bir token dizisidir. Kodlayıcı sesi sabit uzunluklu bir temsile özetler; kod çözücü o temsile koşullanmış metin üretir. Yalnızca CTC modelleri (wav2vec) ses çerçevesi başına bir token yayar ve hizalamayı farklı işler -- her iki yaklaşım çalışır; Whisper çok görevli esnekliği için kodlayıcı-kod çözücüyü seçti.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. 30 Saniyelik Pencere</h2>

<p class="l-text">Önemli bir tasarım seçimi: Whisper sesi her zaman sabit 30 saniyelik parçalarda işler. Daha kısa ses sıfır padlenir; daha uzun ses bölünür. Bu batch'lemeyi ve kodlayıcı şeklini sabit yapar.</p>

<div class="katex-block">$$T_{\\text{frames}} = \\frac{30 \\, \\text{s} \\cdot 16000 \\, \\text{Hz}}{160 \\, \\text{samples/hop}} = 3000 \\text{ mel frames}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Örnekleme oranı</div><div class="card-body">16000 Hz mono (her zaman). Diğer her şeyi yeniden örnekleyin.</div></div>
<div class="calc-card"><div class="card-title">Pencere</div><div class="card-body">25 ms = 400 örnek. Sıçrama = 10 ms = 160 örnek. L3'ün bölüm 4'ü ile aynı.</div></div>
<div class="calc-card"><div class="card-title">Mel'ler</div><div class="card-body">80 kanal. Whisper tarzı normalizasyon: tabanı maksimumun 8 dB altına kırp, sonra [-1, 1]'e yeniden ölçeklendir.</div></div>
<div class="calc-card"><div class="card-title">Kodlayıcı girişi</div><div class="card-body">(80, 3000). Conv altörneklemesi sonrası: (1500, d_model). Kod çözücü buraya çapraz dikkat eder.</div></div>
<div class="calc-card"><div class="card-title">Padding</div><div class="card-body">Ses 30 s'den kısaysa sağa sıfır padle. Model sessizlikle iyi.</div></div>
<div class="calc-card"><div class="card-title">Uzun ses</div><div class="card-body">30 s kayan pencerelerde işle; HF pipeline'ı bunu chunk_length_s ile halleder.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np

y, sr = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
<span class="fn">print</span>(<span class="str">"ham ses:"</span>, y.shape, <span class="fn">len</span>(y) / sr, <span class="str">"s"</span>)

<span class="cm"># 1) Tam olarak 30 saniyeye = 480000 örneğe pad veya kes</span>
target_len = <span class="num">30</span> * <span class="num">16000</span>
<span class="kw">if</span> <span class="fn">len</span>(y) &gt; target_len:
    y = y[:target_len]
<span class="kw">else</span>:
    y = np.<span class="fn">pad</span>(y, (<span class="num">0</span>, target_len - <span class="fn">len</span>(y)))
<span class="fn">print</span>(<span class="str">"padlenmis:"</span>, y.shape)        <span class="cm"># (480000,)

# 2) Whisper log-mel'i hesapla</span>
mel = librosa.feature.<span class="fn">melspectrogram</span>(
    y=y, sr=sr, n_fft=<span class="num">400</span>, hop_length=<span class="num">160</span>,
    n_mels=<span class="num">80</span>, fmin=<span class="num">0</span>, fmax=<span class="num">8000</span>, power=<span class="num">2.0</span>
)
log_mel = np.<span class="fn">log10</span>(np.<span class="fn">maximum</span>(mel, <span class="num">1e-10</span>))
log_mel = np.<span class="fn">maximum</span>(log_mel, log_mel.<span class="fn">max</span>() - <span class="num">8.0</span>)
log_mel = (log_mel + <span class="num">4.0</span>) / <span class="num">4.0</span>
<span class="fn">print</span>(<span class="str">"log-mel:"</span>, log_mel.shape, log_mel.<span class="fn">min</span>(), log_mel.<span class="fn">max</span>())
<span class="cm"># (80, 3001) -- T = ornek_sayisi / sicrama + 1; Whisper son cerceveyi kirpar</span>
log_mel = log_mel[:, :<span class="num">3000</span>]
<span class="fn">print</span>(<span class="str">"son:"</span>, log_mel.shape)   <span class="cm"># (80, 3000) -- tam Whisper giriş şekli</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Whisper engellendi. ASR hattını çerçeve-özellik → etiket sınıflandırıcı olarak preamble'ın yorumlar veri kümesi üzerinde taklit ediyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
# Pretend each review is a 'transcribed audio clip' with a known sentiment label
X = TfidfVectorizer(max_features=300).fit_transform(df_reviews['text'])
y = (df_reviews['rating'] &gt;= 4).astype(int)
clf = LogisticRegression(max_iter=200).fit(X, y)
print('Toy ASR-classifier accuracy:', round(clf.score(X, y), 3))
print('Sample transcript →', df_reviews['text'].iloc[0][:60], '...')</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Sesi 16 kHz mono yükler. 2) 480000 örneğe (30 saniye) padler veya keser. Whisper tam olarak bu uzunluğu bekler; her model checkpoint'inin eğitildiği uzunluk budur. 3) Mel-spektrogramını Whisper eğitiminde kullanılan tam ayarlarla hesaplar. 4) Whisper'a özgü log + kırp + normalize uygular, böylece değerler [-1, 1] aralığına iner. 5) 3000 çerçeveye keser. Modelin kodlayıcısı bu şekli sabit kodlar; 3001 verirseniz çöker. Bir (80, 3000) diziye sahip olduğunuzda, doğrudan <code>WhisperForConditionalGeneration</code>'a besleyebilirsiniz. Pratikte <code>WhisperProcessor</code> bunu sizin için tek satırda yapar -- ama matematiği bilmek olanları gizemli olmaktan çıkarır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. HuggingFace ile Gerçek Transkripsiyon</h2>

<p class="l-text">Günlük kullanım için spektrogram hattını kendiniz uygulamazsınız. HuggingFace'in <code>transformers</code>'ı her Whisper checkpoint'ini temiz bir API ile sarar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers accelerate librosa</span>
<span class="kw">from</span> transformers <span class="kw">import</span> WhisperProcessor, WhisperForConditionalGeneration
<span class="kw">import</span> librosa
<span class="kw">import</span> torch

<span class="cm"># 1) Modeli + processor'u yükle (bir kez indirilir, sonsuza kadar önbelleklenir)</span>
model_id = <span class="str">"openai/whisper-small"</span>      <span class="cm"># 244M parametre, ~1 GB</span>
processor = WhisperProcessor.<span class="fn">from_pretrained</span>(model_id)
model = WhisperForConditionalGeneration.<span class="fn">from_pretrained</span>(model_id)
device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>
model = model.<span class="fn">to</span>(device).<span class="fn">eval</span>()

<span class="cm"># 2) Sesi 16 kHz mono yükle (Whisper gerekliliği)</span>
audio, sr = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)

<span class="cm"># 3) Sesi model giriş özelliklerine dönüştür (yukarıdaki log-mel hattı, otomatik)</span>
inputs = <span class="fn">processor</span>(audio, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>)
input_features = inputs.input_features.<span class="fn">to</span>(device)
<span class="fn">print</span>(input_features.shape)    <span class="cm"># (1, 80, 3000)

# 4) Token ID'lerini üret (kod çözme)</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    predicted_ids = model.<span class="fn">generate</span>(
        input_features,
        max_new_tokens=<span class="num">128</span>,
        language=<span class="str">"en"</span>,                 <span class="cm"># veya otomatik algılama için None</span>
        task=<span class="str">"transcribe"</span>,             <span class="cm"># veya "translate" -&gt; İngilizce</span>
        num_beams=<span class="num">5</span>,                   <span class="cm"># beam search genişliği</span>
    )

<span class="cm"># 5) Token ID'lerini metne geri çöz</span>
text = processor.<span class="fn">batch_decode</span>(predicted_ids, skip_special_tokens=<span class="kw">True</span>)[<span class="num">0</span>]
<span class="fn">print</span>(text)
<span class="cm"># Örnek çıktı: "Welcome to the show. Today we are going to talk about ..."</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Whisper benzeri API'yi oyuncak sınıflandırıcımızla taklit ettik — aynı giriş/çıkış sözleşmesi: ses → metin tahmini.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
def transcribe(y, sr):
    # Browser stand-in: derive 4 dummy 'tokens' from FFT bands
    from scipy.fft import rfft
    Y = np.abs(rfft(y))
    bands = np.array_split(Y, 4)
    energies = [float(b.mean()) for b in bands]
    words = ['low','mid-low','mid-high','high']
    return ' '.join(w for w, e in zip(words, energies) if e &gt; np.mean(energies))
print('Mock transcript:', transcribe(audio, sr))</code></pre></div>
</div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Whisper-small modelini (244M parametre -- kalite ve hız arasında iyi denge) processor'ı (ses -> özellikler ve token'lar -> metin yönetir) ile birlikte yükler. İlk çağrı ~1 GB indirir; sonraki çağrılar yerel önbelleğe ulaşır. 2) Giriş sesini librosa kullanarak 16 kHz mono yükler. 3) Processor ham ses dizisini modelin beklediği (1, 80, 3000) log-mel özellikleri tensorüne dönüştürür -- bu tam olarak bölüm 2'deki hattın tek çağrıda sarılmış halidir. 4) <code>model.generate</code> kodlayıcıyı bir kez çalıştırır ve kod çözücüyü dizi sonu token'ı yayana kadar otoregresif çalıştırır. <code>language="en"</code> İngilizce'yi zorlar (dil algılamayı atla); <code>task="transcribe"</code> aynı dilde metin üret demektir (vs İngilizce'ye çevir). <code>num_beams=5</code> daha iyi kalite için beam search kullanır (greedy'den yavaş). 5) <code>batch_decode</code> token ID'lerini bir dizgeye geri dönüştürür ve özel token'ları atlar.</p>

<div id="plot-al4-conf-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Bir transkripsiyonun süresi boyunca kod çözücü güveni (tahmin edilen token'lar arasında en yüksek log-olasılık). Güven temiz konuşma için yüksek kalır, gürültülü veya belirsiz bölgelerde düşer ve sessizlik/ses sonunda (modelin <code>&lt;|endoftranscript|&gt;</code> yaydığı yerde) çöker. Bu, insan incelemesi için düşük güvenlik segmentlerini işaretlemek için kullanacağınız türde bir sinyaldir.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Zaman Damgaları ve Kelime Düzeyinde Hizalama</h2>

<p class="l-text">Whisper metinle iç içe zaman damgaları yayabilir -- ve son sürümler kelime düzeyinde zaman damgaları bile üretebilir. Bu altyazılama, podcast indeksleme ve mevcut videoya hizalamak için gereklidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> pipeline
<span class="kw">import</span> torch

<span class="cm"># En kolay API: pipeline sarmalayıcısı</span>
pipe = <span class="fn">pipeline</span>(
    <span class="str">"automatic-speech-recognition"</span>,
    model=<span class="str">"openai/whisper-small"</span>,
    chunk_length_s=<span class="num">30</span>,             <span class="cm"># &gt;30 s ses için pencere kaydır</span>
    return_timestamps=<span class="str">"word"</span>,        <span class="cm"># word, sentence veya True (cümle)</span>
    device=<span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>,
    generate_kwargs={<span class="str">"language"</span>: <span class="str">"english"</span>, <span class="str">"task"</span>: <span class="str">"transcribe"</span>}
)

result = <span class="fn">pipe</span>(<span class="str">"podcast.wav"</span>)
<span class="fn">print</span>(result[<span class="str">"text"</span>])

<span class="cm"># Kelime düzeyinde hizalama</span>
<span class="kw">for</span> chunk <span class="kw">in</span> result[<span class="str">"chunks"</span>][:<span class="num">10</span>]:
    start, end = chunk[<span class="str">"timestamp"</span>]
    word = chunk[<span class="str">"text"</span>]
    <span class="fn">print</span>(f<span class="str">"  [{start:5.2f} - {end:5.2f}]  {word}"</span>)
<span class="cm"># Örnek:
#   [ 0.00 -  0.42]   Welcome
#   [ 0.42 -  0.78]   to
#   [ 0.78 -  1.34]   the
#   [ 1.34 -  1.92]   show
#   [ 2.04 -  2.30]  .
#   [ 2.30 -  2.96]   Today</span>

<span class="cm"># Yalnızca cümle düzeyi (daha ucuz, sıklıkla yeterli)</span>
pipe.<span class="fn">return_timestamps</span> = <span class="kw">True</span>
result_s = <span class="fn">pipe</span>(<span class="str">"podcast.wav"</span>)
<span class="kw">for</span> chunk <span class="kw">in</span> result_s[<span class="str">"chunks"</span>][:<span class="num">5</span>]:
    <span class="fn">print</span>(chunk[<span class="str">"timestamp"</span>], chunk[<span class="str">"text"</span>])
<span class="cm"># [(0.0, 5.4), 'Welcome to the show. Today we are going to ...']</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Klip süresinin eşit parçalara bölünmesiyle kelime-düzey zaman damgaları taklit edildi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
duration = len(audio) / sr
tokens = ['hello', 'world', 'this', 'is', 'a', 'demo']
step = duration / len(tokens)
for i, w in enumerate(tokens):
    print(f'[{i*step:0.2f}s → {(i+1)*step:0.2f}s] {w}')
print('Total duration:', round(duration, 3), 's')</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Tek nesnede model yüklemeyi, uzun ses parçalamayı, özellik hesaplamayı, kod çözmeyi ve zaman damgası çıkarmayı yöneten yüksek seviyeli bir <code>pipeline</code> oluşturur. <code>chunk_length_s=30</code> 30 saniyeden uzun sesi otomatik olarak örtüşen pencerelere böler. 2) Kelime düzeyinde zaman damgaları çapraz dikkat hizalamasından gelir: Whisper'ın kod çözücüsü kodlayıcı pozisyonlarına dikkat eder ve bu dikkat ağırlıkları yaklaşık olarak zamana eşlenir. <code>chunks</code> çıkış listesi her kelime için saniye cinsinden başlangıç ve bitiş zamanlarıyla bir giriş içerir. 3) Cümle düzeyi modu daha ucuzdur çünkü yalnızca Whisper'ın yerel olarak ürettiği zaman damgası token'larını yayar (ekstra hizalama hesaplaması yok). 4) Gerçek altyazı hatları için kelime düzeyi tercih edilir -- karaoke tarzı vurgulamayı önemsiz yapar ve herhangi bir tek cümledeki kötü hizalamadan kurtulur.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: bir SRT altyazı dosyası oluşturma</div><div class="example-body">Cümle düzeyi zaman damgalı <code>result["chunks"]</code>'i aldıktan sonra, bir SRT dosyası biçimlendirmek 10 satırdır: for i, chunk in enumerate(chunks): print(i+1); print(format_time(chunk["timestamp"][0]) + " --&gt; " + format_time(chunk["timestamp"][1])); print(chunk["text"]); print(). <code>format_time</code> = "00:01:23,456" tarzı kullanın. Whisper + 10 satır Python = 10+ dilde çoğu profesyonel hizmeti yenen altyazı üretimi.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Çok Dilli: Algıla, Transkribe Et, Çevir</h2>

<p class="l-text">Whisper kutudan çıkarken 99 dili işler. Dili otomatik algılatabilir, belirli bir dili zorlayabilir veya 99 kaynak dilden herhangi birini İngilizce'ye çevirebilirsiniz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> WhisperProcessor, WhisperForConditionalGeneration
<span class="kw">import</span> librosa
<span class="kw">import</span> torch

processor = WhisperProcessor.<span class="fn">from_pretrained</span>(<span class="str">"openai/whisper-medium"</span>)
model = WhisperForConditionalGeneration.<span class="fn">from_pretrained</span>(<span class="str">"openai/whisper-medium"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>).<span class="fn">eval</span>()

audio, _ = librosa.<span class="fn">load</span>(<span class="str">"turkish_speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">processor</span>(audio, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 1) Dili otomatik algıla ve transkribe et</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_auto = model.<span class="fn">generate</span>(inputs.input_features, max_new_tokens=<span class="num">200</span>)
text_auto = processor.<span class="fn">batch_decode</span>(out_auto, skip_special_tokens=<span class="kw">True</span>)[<span class="num">0</span>]
<span class="fn">print</span>(<span class="str">"oto:"</span>, text_auto)

<span class="cm"># 2) Türkçe'yi zorla, transkribe et</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_tr = model.<span class="fn">generate</span>(
        inputs.input_features,
        language=<span class="str">"tr"</span>, task=<span class="str">"transcribe"</span>, max_new_tokens=<span class="num">200</span>
    )
text_tr = processor.<span class="fn">batch_decode</span>(out_tr, skip_special_tokens=<span class="kw">True</span>)[<span class="num">0</span>]
<span class="fn">print</span>(<span class="str">"tr transkript:"</span>, text_tr)

<span class="cm"># 3) Türkçe konuşmayı İngilizce metne çevir</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_en = model.<span class="fn">generate</span>(
        inputs.input_features,
        language=<span class="str">"tr"</span>, task=<span class="str">"translate"</span>, max_new_tokens=<span class="num">200</span>
    )
text_en = processor.<span class="fn">batch_decode</span>(out_en, skip_special_tokens=<span class="kw">True</span>)[<span class="num">0</span>]
<span class="fn">print</span>(<span class="str">"en ceviri:"</span>, text_en)

<span class="cm"># 4) Ham dil algılama olasılıklarını al (kod çözülen ilk token'a bak)</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    audio_features = model.<span class="fn">get_encoder</span>()(inputs.input_features).last_hidden_state
    <span class="cm"># Dil skorlarını almak için ilk token'ı yalandan kod çöz</span>
    init_tokens = torch.<span class="fn">tensor</span>([[model.config.decoder_start_token_id]]).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    logits = <span class="fn">model</span>(input_features=inputs.input_features, decoder_input_ids=init_tokens).logits
    <span class="cm"># Whisper bilinen ID'lerde dil token'larına sahiptir; maks olasılık algılanan dildir</span>
<span class="fn">print</span>(<span class="str">"top-1 algilanan dil token id:"</span>, logits[<span class="num">0</span>, -<span class="num">1</span>].<span class="fn">argmax</span>().<span class="fn">item</span>())</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Çok-dilli yerine geçen: küçük bir korpus üzerinde karakter sıklığından basit dil-kimliği.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from collections import Counter
samples = {'en': 'this is a test sentence', 'tr': 'bu bir test cumlesi',
           'de': 'das ist ein test satz',   'es': 'esta es una prueba'}
def lang_score(text):
    c = Counter(text.lower())
    return {l: sum(min(c[ch], Counter(s)[ch]) for ch in set(s)) for l, s in samples.items()}
test = 'is this a sentence'
scores = lang_score(test)
print('Detected:', max(scores, key=scores.get), 'from scores', scores)</code></pre></div>
</div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Whisper-medium'u (769M parametre) yükler -- İngilizce olmayan diller için small'a göre kalitede dikkate değer bir sıçrama. 2) Otomatik algılama modu: <code>language</code> argümanı olmadan Whisper ilk kod çözücü token'ına bakar ve hangi dilin en yüksek olasılığa sahip olduğunu seçer, sonra devam eder. 3) Türkçe'yi zorlama: <code>language="tr"</code> geçirin; model kendi algılamasını atlar ve Türkçe başlar. Dili zaten bildiğinizde ve deterministik sonuçlar istediğinizde yararlı. 4) Çeviri modu: <code>task="translate"</code> "giriş dilinden bağımsız olarak İngilizce çıktı üret" demektir. Bu aksi takdirde ASR + ayrı bir makine çevirisi sistemi gerektirecek olanı yapan tek modeldir. 5) Manuel dil algılama: ilk kod çözücü pozisyonundaki logit'leri inceleyerek dil başına olasılıkları okuyabilirsiniz -- güven duyarlı aşağı akış yönlendirmesi için yararlı.</p>

<div class="l-warn"><strong>Tuzak:</strong> Whisper'da çeviri her zaman İngilizce'yedir. Diğer hedef dillere ihtiyacınız varsa, Whisper'ı transkribe modunda çalıştırın sonra ayrı bir çeviri modeline (NLLB, M2M-100, GPT-4) geçirin. Türkçe'den İspanyolca'ya: tr-konuşma -> Whisper-tr-transkribe -> Türkçe metin -> NLLB tr-es -> İspanyolca metin.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Kod Çözme Stratejileri: Greedy vs Beam Search</h2>

<p class="l-text">Kodlayıcı ses özellikleri ürettikten sonra, kod çözücü token'ları her seferinde bir tane üretir. Her token'ı seçmek için farklı hız/kalite ödünleşimleri olan birkaç strateji vardır.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Greedy</div><div class="compare-item">Her zaman en yüksek olasılıklı token'ı seç</div><div class="compare-item">En hızlı (1x)</div><div class="compare-item">Erken kötü seçimlere kilitlenebilir</div><div class="compare-item">Akış, gerçek zaman için kullan</div></div>
<div class="compare-col"><div class="compare-title">Beam search (k=5)</div><div class="compare-item">5 en iyi kısmi diziyi izle</div><div class="compare-item">Daha yavaş (~3-4x)</div><div class="compare-item">Genellikle daha yüksek doğruluk</div><div class="compare-item">Toplu transkripsiyon için varsayılan</div></div>
<div class="compare-col"><div class="compare-title">Örnekleme (T=0.5)</div><div class="compare-item">Olasılık dağılımından örnekle</div><div class="compare-item">Greedy ile aynı hız</div><div class="compare-item">Daha çeşitli, muhtemelen daha az doğru</div><div class="compare-item">Topluluk, artırma için kullan</div></div>
<div class="compare-col"><div class="compare-title">Nucleus (top-p=0.9)</div><div class="compare-item">Olasılık kütlesinin üst %90'ından örnekle</div><div class="compare-item">Örnekleme ile aynı hız</div><div class="compare-item">Uzun kuyruğa karşı sağlam</div><div class="compare-item">Greedy takıldığında kullan</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> librosa
<span class="kw">from</span> transformers <span class="kw">import</span> WhisperProcessor, WhisperForConditionalGeneration

processor = WhisperProcessor.<span class="fn">from_pretrained</span>(<span class="str">"openai/whisper-small"</span>)
model = WhisperForConditionalGeneration.<span class="fn">from_pretrained</span>(<span class="str">"openai/whisper-small"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>).<span class="fn">eval</span>()

audio, _ = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">processor</span>(audio, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
features = inputs.input_features

<span class="cm"># 1) Greedy kod çözme</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_greedy = model.<span class="fn">generate</span>(features, do_sample=<span class="kw">False</span>, num_beams=<span class="num">1</span>, max_new_tokens=<span class="num">200</span>)

<span class="cm"># 2) Beam search</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_beam = model.<span class="fn">generate</span>(features, num_beams=<span class="num">5</span>, max_new_tokens=<span class="num">200</span>)

<span class="cm"># 3) Sıcaklıkla örnekleme</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_sample = model.<span class="fn">generate</span>(
        features,
        do_sample=<span class="kw">True</span>, temperature=<span class="num">0.5</span>, top_p=<span class="num">0.9</span>,
        max_new_tokens=<span class="num">200</span>
    )

<span class="cm"># 4) Whisper tarzı geri dönüş: önce greedy dene, no_speech_prob yüksek veya compression_ratio kötüyse örneklemeyle yeniden dene</span>
<span class="cm"># whisper.cpp / OpenAI'nin referans uygulamasının sağlamlık için yaptığı şey budur</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_robust = model.<span class="fn">generate</span>(
        features,
        do_sample=<span class="kw">False</span>,
        num_beams=<span class="num">1</span>,
        compression_ratio_threshold=<span class="num">2.4</span>,    <span class="cm"># tekrarlayan çıktıyı reddet</span>
        no_speech_threshold=<span class="num">0.6</span>,            <span class="cm"># sessizliği reddet</span>
        logprob_threshold=-<span class="num">1.0</span>,              <span class="cm"># düşük güveni reddet</span>
        max_new_tokens=<span class="num">200</span>
    )

<span class="kw">for</span> name, ids <span class="kw">in</span> [(<span class="str">"greedy"</span>, out_greedy), (<span class="str">"beam"</span>, out_beam),
                 (<span class="str">"sample"</span>, out_sample), (<span class="str">"robust"</span>, out_robust)]:
    text = processor.<span class="fn">batch_decode</span>(ids, skip_special_tokens=<span class="kw">True</span>)[<span class="num">0</span>]
    <span class="fn">print</span>(f<span class="str">"{name:8s}: {text[:80]}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Uzun-ses parçalı çözme: 1 saniyelik pencerelere böl, her birini özetle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
win = sr  # 1 s
chunks = [audio[i:i+win] for i in range(0, len(audio), win)]
for i, c in enumerate(chunks):
    rms = float(np.sqrt(np.mean(c**2)))
    print(f'chunk {i}  ({len(c)/sr:.2f}s)  RMS={rms:.4f}')
print('Total chunks:', len(chunks))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Greedy en basit ve en hızlı kod çözmedir: her adımda en olası token'ı seç. Risk: en yüksek olasılıklı token kötü bir yola götürürse, greedy kurtulamaz. 2) Beam search her adımda 5 en iyi kısmi diziyi canlı tutar ve sonunda en yüksek kümülatif olasılığa sahip olanı seçer. 3-4x daha yavaş ama tutarlı şekilde birkaç WER puan daha iyi. Toplu transkripsiyon için varsayılan. 3) Sıcaklık örneklemesi rastgelelik ekler; birden çok kez transkribe ettiğiniz ve fikir birliğini seçtiğiniz topluluklar için yararlıdır. 4) "Robust" kalıbı OpenAI'nin referans Whisper'ının yaptığı şeydir: önce ucuz kod çözmeyi dene ve sonuç bozuk görünüyorsa (tekrarlayan çıktı, düşük güven veya konuşma yok olarak algılandı) yalnızca örneklemeyle yeniden dene. Bu, saf greedy'nin felaket başarısızlık modlarını önler.</p>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body"><strong>Whisper neden MFCC+HMM'in başarısız olduğu yerde başarılı oluyor?</strong> Üç neden. (1) Veri ölçeği: 680k saat vs klasik sistemler için ~1k saat. Veri ne kadar büyükse, özellik mühendisliği o kadar az önemlidir. (2) Uçtan uca öğrenme: HMM konuşmayı "akustik model x telaffuz x dil modeli" olarak çarpanlara ayırmaya zorlandı; Whisper sesten metne her şeyi ortak optimize eder. (3) Transformer öz-dikkati: her çıkış token'ı herhangi bir ses çerçevesine bakabilir, HMM'lerin (birinci dereceden Markov varsayımıyla) fiziksel olarak yakalayamadığı uzun menzilli bağımlılıkları modeller. Birleşik etki, kıyaslamalarda kabaca 5-10x daha düşük WER ve tek modelle 30+ dil kapsamasıdır.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Özet: Üretim Whisper Fonksiyonu</h2>

<p class="l-text">Herhangi bir projeye bırakabileceğiniz temiz bir fonksiyon. Keyfi uzunlukta sesi, sağlam kod çözmeyi ve yapılandırılmış çıktıyı yönetir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> pipeline
<span class="kw">import</span> torch

<span class="kw">def</span> <span class="fn">build_transcriber</span>(model=<span class="str">"openai/whisper-small"</span>, device=<span class="kw">None</span>):
    <span class="kw">if</span> device <span class="kw">is</span> <span class="kw">None</span>:
        device = <span class="num">0</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> -<span class="num">1</span>
    <span class="kw">return</span> <span class="fn">pipeline</span>(
        <span class="str">"automatic-speech-recognition"</span>,
        model=model,
        chunk_length_s=<span class="num">30</span>,
        return_timestamps=<span class="str">"word"</span>,
        device=device,
        torch_dtype=torch.float16 <span class="kw">if</span> device != -<span class="num">1</span> <span class="kw">else</span> torch.float32,
    )

<span class="kw">def</span> <span class="fn">transcribe</span>(pipe, audio_path, language=<span class="kw">None</span>, translate=<span class="kw">False</span>):
    gen_kwargs = {}
    <span class="kw">if</span> language: gen_kwargs[<span class="str">"language"</span>] = language
    gen_kwargs[<span class="str">"task"</span>] = <span class="str">"translate"</span> <span class="kw">if</span> translate <span class="kw">else</span> <span class="str">"transcribe"</span>
    out = <span class="fn">pipe</span>(audio_path, generate_kwargs=gen_kwargs)
    <span class="kw">return</span> {
        <span class="str">"text"</span>: out[<span class="str">"text"</span>].<span class="fn">strip</span>(),
        <span class="str">"words"</span>: [
            {<span class="str">"word"</span>: c[<span class="str">"text"</span>].<span class="fn">strip</span>(),
             <span class="str">"start"</span>: c[<span class="str">"timestamp"</span>][<span class="num">0</span>],
             <span class="str">"end"</span>:   c[<span class="str">"timestamp"</span>][<span class="num">1</span>]}
            <span class="kw">for</span> c <span class="kw">in</span> out[<span class="str">"chunks"</span>]
        ],
    }

<span class="cm"># Kullanım</span>
pipe = <span class="fn">build_transcriber</span>(<span class="str">"openai/whisper-small"</span>)

result = <span class="fn">transcribe</span>(pipe, <span class="str">"english.wav"</span>, language=<span class="str">"english"</span>)
<span class="fn">print</span>(result[<span class="str">"text"</span>])
<span class="fn">print</span>(<span class="fn">len</span>(result[<span class="str">"words"</span>]), <span class="str">"kelime zaman damgali"</span>)

result_tr = <span class="fn">transcribe</span>(pipe, <span class="str">"turkish.wav"</span>, language=<span class="str">"turkish"</span>)
<span class="fn">print</span>(result_tr[<span class="str">"text"</span>])

<span class="cm"># İspanyolca konuşmayı İngilizce'ye çevir</span>
result_es = <span class="fn">transcribe</span>(pipe, <span class="str">"spanish.wav"</span>, language=<span class="str">"spanish"</span>, translate=<span class="kw">True</span>)
<span class="fn">print</span>(result_es[<span class="str">"text"</span>])</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Uçtan-uca yardımcı: {text, segments, language} döndüren Whisper-tarzı bir fonksiyon.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
def asr(y, sr):
    duration = len(y) / sr
    return {
        'language': 'en',
        'text': '(toy transcript)',
        'segments': [{'start': i*0.5, 'end': (i+1)*0.5, 'text': f'word{i}'}
                     for i in range(int(duration / 0.5))]
    }
out = asr(audio, sr)
for k, v in out.items():
    print(k, ':', v if not isinstance(v, list) else f'{len(v)} segments')</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>build_transcriber</code> HF pipeline'ını mantıklı varsayılanlarla sarar: kelime düzeyinde zaman damgaları, uzun ses için 30 saniye parçalama, GPU'da kalite kaybı olmadan ~2x hızlanma için fp16. Fonksiyon istekler arasında yeniden kullandığınız çağrılabilir bir nesne döner. 2) <code>transcribe</code> pipe'ı ve bir ses yolunu alır; isteğe bağlı olarak bir dil belirleyebilirsiniz (otomatik algılamadan daha hızlı + güvenilir) ve çevirip çevirmeyeceğinizi. Sonuç tam metin ve kelime başına zaman damgaları içeren temiz bir dict'tir. 3) Kullanım örneği aynı fonksiyonun İngilizce, Türkçe ve çeviriyi nasıl yönettiğini gösterir -- kod tabanınız boyunca taşıdığınız tek bir nesne. 4) Üretim dağıtımı için bunu bir kuyrukla (Celery, Redis) sarın, böylece istekler tek bir GPU'yu engellemesin; çok yüksek throughput için <code>faster-whisper</code> (CTranslate2 backend'i, 4x daha hızlı) veya <code>insanely-fast-whisper</code> (flash-attention 2, 8x daha hızlı) bakın.</p>

<div class="think-box"><div class="think-label">TEMEL ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Whisper, 680k saatlik zayıf denetimli çok dilli ses üzerinde eğitilmiş kodlayıcı-kod çözücü transformerdır.<br><strong>2.</strong> Giriş: 30 saniyenin 80 kanallı log-mel'i (kısaysa sıfır padli). Çıkış: dil, görev, zaman damgaları için özel token'lar dahil BPE token dizisi.<br><strong>3.</strong> <code>WhisperProcessor</code> ses -> log-mel dönüşümünü otomatik yönetir; <code>WhisperForConditionalGeneration.generate()</code> modeli çalıştırır.<br><strong>4.</strong> Model boyutları: tiny / base / small / medium / large-v3. Prototip için small, üretim İngilizcesi için medium, İngilizce olmayan veya en zor durumlar için large seç.<br><strong>5.</strong> Kelime düzeyi zaman damgaları çapraz dikkatten gelir; HF pipeline bunları <code>return_timestamps="word"</code> ile üretir.<br><strong>6.</strong> Çok dilli: 99 dili transkribe et, hepsi 99 -&gt; İngilizce'ye çevir. Diğer hedef diller ayrı bir MT modeli gerektirir.<br><strong>7.</strong> Kod çözme: greedy hızlı, beam search (k=5) üretim varsayılanı, örnekleme tekrar döngülerinden kaçmaya yardımcı olur.<br><strong>8.</strong> Sonraki ders: tersi -- metinden konuşmaya. Tacotron, FastSpeech, VITS ve modern HF TTS modelleriyle metinden ses üretimi.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. 2024-2026 Manzarası: Whisper-Large'ın Ötesinde</h2>

<p class="l-text"><strong>ASR cephesi bu dersin ana materyalinden sonra iki kez ileri sıçradı.</strong> İlki, OpenAI Ekim 2024'te <strong>Whisper v3-large-turbo</strong>'yu yayımladı -- large-v3'ün kalitesine yakın kalan ama yarı boyutta ve iki kat işlem hızında yeni bir Pareto noktası. İkincisi, HuggingFace ekosistemi bütçeli dağıtımlar için "distil" ailesini olgunlaştırdı. Bugün ASR servisi açanlar, en azından bunları düz large-v3 ile kıyaslamalı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Whisper v3-large-turbo (2024-10)</div><div class="card-body">809M parametre (1.5B large-v3'ten ~%46 daha küçük). Aynı kodlayıcı; kod çözücü 32 katmandan 4 katmana indirildi. ~2x daha hızlı inference, tek A100'de ~4x gerçek zaman üstü. WER gerilemesi: large-v3'e karşı tipik olarak +%0.5, çeviri için biraz daha kötü (kod çözücü çapraz dikkat işini yapar). HF id: <code>openai/whisper-large-v3-turbo</code>.</div></div>
<div class="calc-card"><div class="card-title">Whisper v3 (2023-11)</div><div class="card-body">1.5B parametre, tam çok dilli model, Türkçe dahil 100+ dil. Yeni Kantonca desteği, gürültülü / aksanlı İngilizce'de v2'ye göre +%10 mutlak dayanıklılık. Hâlâ tek dilli transkripsiyon için doğruluk tavanı.</div></div>
<div class="calc-card"><div class="card-title">Distil-Whisper (HF, 2023)</div><div class="card-body">%49 daha küçük, vanilla'dan 6x daha hızlı, uzun-form İngilizce'de %99 doğruluk korunur. Pseudo-label damıtmayla eğitildi. Şu an sadece İngilizce; çok dilli bütçe için turbo kullan.</div></div>
<div class="calc-card"><div class="card-title">Kod çözücü budamak neden işe yarar</div><div class="card-body">Tek GPU'da, batch-1 ASR için ses-kodlayıcı ileri geçişi gecikmeye hakimdir. Kod çözücü çıkış token başına bir kez çalışır ama her geçiş ucuzdur; oradaki katmanları kırpmak ses anlayışını neredeyse hiç değiştirmez çünkü kodlayıcının çapraz dikkat çıktısı zaten dilsel içeriği kodlar.</div></div>
<div class="calc-card"><div class="card-title">Hangisini ne zaman seçmeli</div><div class="card-body">Gerçek zamanlı / sesli ajan: turbo veya distil. En yüksek doğruluk / adli transkripsiyon: large-v3. Edge / mobil: tiny/base + nicemleme. İngilizce'ye çeviri: large-v3 (turbo biraz geriler).</div></div>
<div class="calc-card"><div class="card-title">Ekosistem</div><div class="card-body"><code>faster-whisper</code> (CTranslate2) ve <code>insanely-fast-whisper</code> (flash-attn 2) turbo'yu da sarar -- mimari ve çalışma zamanı kazançlarını birleştirerek baseline üstüne ~8x ulaşır.</div></div>
</div>

<div class="l-note"><strong>Pratik ipucu:</strong> Eğer daha önce <code>whisper-large-v3</code>'ü bir kuyruğun arkasına dağıttıysanız, <code>whisper-large-v3-turbo</code>'ya geçmek tek satırlık bir değişikliktir ve genellikle bir hafta içinde GPU saatleriyle kendini öder. Önce ayrılmış bir eval setini yeniden çalıştırın, böylece WER'in diliniz ve akustik koşullarınız için kabul edilebilir kaldığını doğrularsınız.</div>
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

  function confPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var t = [], y = [];
    for (var i=0;i<60;i++) {
      var ti = i * 0.2;
      var v = -0.15 - 0.05*Math.random();
      if ((ti > 3 && ti < 4) || (ti > 7 && ti < 8.2)) v = -0.6 + 0.1*Math.random();
      if (ti < 0.5) v = -1.2;
      if (ti > 11) v = -1.5;
      t.push(ti); y.push(v);
    }
    var trace = {x:t, y:y, mode:'lines+markers', line:{color:T.accent, width:2}, marker:{size:4, color:T.accent}, name:'log P(token)'};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Whisper Token Güveni Zaman İçinde':'Whisper Token Confidence over Time', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman (s)':'time (s)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'log olasılık':'log probability', gridcolor:T.grid, zerolinecolor:T.zero, range:[-2, 0]}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  confPlot('plot-al4-conf-en','en');
  confPlot('plot-al4-conf-tr','tr');
}, 250);</script>`
};
