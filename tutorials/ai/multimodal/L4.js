window.MULTIMODAL_L4 = {
en: `<p class="l-text"><strong>Speech is the original multimodal interface.</strong> Long before there were chatbots, humans were doing audio-language fusion in their heads — listening to a friend's tone, lip-reading in a noisy bar, shouting commands at a smart speaker. The 2022–2025 wave of audio-language models brought this fusion into AI: <strong>Whisper</strong> (OpenAI, Sep 2022) collapsed multilingual ASR into a single 1.55B model trained on 680K hours; <strong>SeamlessM4T</strong> (Meta, Aug 2023) added end-to-end speech-to-speech translation across 100+ languages; <strong>Qwen-Audio</strong> (Alibaba, Nov 2023) and <strong>Qwen2-Audio</strong> (Jul 2024) plugged audio into a chat LLM with the same adapter recipe LLaVA used for vision; and <strong>AudioGPT</strong>, <strong>SALMONN</strong>, and OpenAI's <strong>GPT-4o-Audio</strong> (May 2024) pushed end-to-end voice agents from sci-fi to product.</p>

<p class="l-text">In this lesson we cover the full pipeline. We start with audio representations — raw waveform vs spectrogram vs Mel filter bank vs learned codec tokens (EnCodec, SoundStream). We dig into Whisper's encoder-decoder architecture, its 30-second log-Mel input, and the multitask format that lets one model do ASR, language ID, translation, and voice activity detection from prompt tokens. We then walk the cascade approach (Whisper → text LLM → TTS) vs end-to-end audio LLMs (SeamlessM4T, Qwen2-Audio, AudioGPT) and finish with the production trade-offs: latency, cost, language coverage, robustness to noise.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compare audio representations: raw waveform, STFT, Mel spectrogram, neural codec tokens</li>
<li>Reconstruct Whisper's architecture and multitask prompt format (prev tokens, language, task, timestamps)</li>
<li>Build a cascade pipeline (ASR → LLM → TTS) and recognize its strengths and weaknesses</li>
<li>Understand end-to-end audio LLMs: SeamlessM4T, Qwen-Audio, SALMONN, GPT-4o-Audio</li>
<li>Pick between cascade vs end-to-end for a production use case (latency, cost, paralinguistic cues)</li>
<li>Evaluate audio models: WER, BLEU, MOS, and beyond — what each metric does and does not capture</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Audio Representations — Waveform to Token</h2>
<p class="l-text">A 1-second audio clip at 16 kHz is 16,000 floats. Feeding raw waveform to a transformer is wasteful — neighboring samples are highly correlated, and the receptive field would have to span tens of thousands of tokens for even a short utterance. Three layers of compression turn raw audio into something a model can process:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Waveform</div><div class="card-body">Raw 1D signal at 16/22.05/44.1 kHz. Used by HuBERT, wav2vec 2.0, EnCodec encoder. Highest fidelity, biggest cost.</div></div>
<div class="calc-card"><div class="card-title">STFT spectrogram</div><div class="card-body">Short-Time Fourier Transform → time-frequency complex matrix. Magnitude is "what frequencies at what time." Standard window: 25 ms, hop: 10 ms.</div></div>
<div class="calc-card"><div class="card-title">Log-Mel spectrogram</div><div class="card-body">STFT → Mel filterbank (warps to perceptual frequency) → log. 80-channel log-Mel × 100 frames/sec is Whisper's input. Compresses 16K samples/sec → 8K floats/sec.</div></div>
<div class="calc-card"><div class="card-title">Neural codec tokens</div><div class="card-body">EnCodec (Meta 2022), SoundStream (Google 2021). VQ-VAE tokenizers that quantize audio into discrete codes at ~75 tokens/sec for music quality. Used by AudioLM, MusicLM, MusicGen, AudioGen.</div></div>
</div>

<div class="katex-block">$$\\text{Mel}(f) = 2595 \\cdot \\log_{10}\\!\\left(1 + \\frac{f}{700}\\right)$$</div>

<p class="l-text">The Mel scale matches human pitch perception — equal Mel intervals sound equally separated. 80 Mel filterbank channels is the standard ASR resolution; finer counts are used in TTS where tone quality matters more.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Whisper — Multitask Speech in One Model</h2>
<p class="l-text">Whisper (Radford et al., OpenAI, Sep 2022) was the moment robust ASR became commodity. Single model, 99 languages, robust to accents and noise, ships open-source under MIT. The recipe: encoder-decoder transformer, 80-channel log-Mel input over 30-second windows, 680K hours of weakly-supervised audio scraped from the web with multilingual labels.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Architecture</div><div class="card-body">Encoder: 30s of 80-channel log-Mel → conv-stem → transformer (4–32 layers depending on size). Decoder: standard autoregressive transformer with cross-attention to encoder. Sizes: tiny 39M → large-v3 1.55B.</div></div>
<div class="calc-card"><div class="card-title">Multitask prompt format</div><div class="card-body"><code>&lt;|startoftranscript|&gt;&lt;|en|&gt;&lt;|transcribe|&gt;&lt;|notimestamps|&gt;</code> ... text ... <code>&lt;|endoftranscript|&gt;</code>. Switching <code>&lt;|en|&gt;</code> to <code>&lt;|fr|&gt;</code> + <code>&lt;|translate|&gt;</code> turns it into a French→English translator. Same model, different control tokens.</div></div>
<div class="calc-card"><div class="card-title">Training data</div><div class="card-body">680K hours from web audio with subtitles. ~117K of those are non-English. ~125K are X→English translation pairs. Heavy on noisy, accented, real-world audio — hence robustness.</div></div>
<div class="calc-card"><div class="card-title">Successors</div><div class="card-body">Whisper large-v2 (Dec 2022), large-v3 (Nov 2023, +10–20% over v2), Distil-Whisper (faster), Whisper-Turbo (Sep 2024, 8× faster). Faster-Whisper (CTranslate2) is the standard production runtime.</div></div>
</div>

<div class="calc-highlight"><strong>Key insight from Radford:</strong> weak supervision at scale beats clean data at small scale. Whisper's 680K hours include misaligned subtitles, automatic captions, and machine-translated transcripts — but the volume swamps the noise. This same lesson holds across modalities: more data with imperfect labels usually wins.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Cascade Pipelines — Whisper + LLM + TTS</h2>
<p class="l-text">The simplest production audio agent is three boxes connected by strings: speech-to-text, text LLM, text-to-speech. Cascades dominated 2023–2024 because each box is independently best-in-class and you can swap any of them.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ASR (speech in)</div><div class="card-body">Whisper, Deepgram, Google STT, Azure Speech, AssemblyAI. WER 4–8% on clean English; 10–15% on noisy or accented.</div></div>
<div class="calc-card"><div class="card-title">LLM (reasoning)</div><div class="card-body">GPT-4, Claude 3.5, Llama-3, Mistral. Operates on the transcribed text. Inherits all text-LLM strengths and weaknesses.</div></div>
<div class="calc-card"><div class="card-title">TTS (speech out)</div><div class="card-body">ElevenLabs, OpenAI TTS, Google WaveNet, Microsoft Neural TTS, open-source XTTS / StyleTTS 2 / Bark. MOS 4.0–4.5 (out of 5) for top systems.</div></div>
<div class="calc-card"><div class="card-title">Trade-offs</div><div class="card-body"><strong>Pros:</strong> modular, debuggable, swap components. <strong>Cons:</strong> 3 round-trips (1.5–3s latency), loses prosody (transcript drops anger, sarcasm, hesitation), needs voice activity detection on top.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — real Whisper)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Real cascade pipeline — Pyodide-blocked (whisper, openai, elevenlabs)</span>
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
<span class="kw">import</span> whisper

client = <span class="fn">OpenAI</span>()
asr = whisper.<span class="fn">load_model</span>(<span class="str">"large-v3"</span>)  <span class="cm"># or use OpenAI's whisper-1 API</span>

<span class="cm"># 1. Speech to text</span>
result = asr.<span class="fn">transcribe</span>(<span class="str">"user_query.wav"</span>)
user_text = result[<span class="str">"text"</span>]
<span class="fn">print</span>(<span class="str">"Heard:"</span>, user_text)

<span class="cm"># 2. Text to text (reasoning)</span>
chat = client.chat.completions.<span class="fn">create</span>(
    model=<span class="str">"gpt-4o"</span>,
    messages=[{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: user_text}]
)
reply_text = chat.choices[<span class="num">0</span>].message.content

<span class="cm"># 3. Text to speech</span>
speech = client.audio.speech.<span class="fn">create</span>(model=<span class="str">"tts-1"</span>, voice=<span class="str">"alloy"</span>, <span class="fn">input</span>=reply_text)
speech.<span class="fn">stream_to_file</span>(<span class="str">"reply.mp3"</span>)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy "ASR" that uses FFT features + LogReg to classify a 1-second audio clip into a small intent set. Mocks the cascade structure: audio → text-class → string answer.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.fft <span class="kw">import</span> rfft
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

SR = <span class="num">16000</span>  <span class="cm"># 16 kHz</span>

<span class="cm"># Synthesize "intents" as sinusoidal tones with noise — toy, but FFT features work</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
<span class="kw">def</span> <span class="fn">make_clip</span>(freq, dur=<span class="num">1.0</span>, noise=<span class="num">0.05</span>):
    t = np.<span class="fn">linspace</span>(<span class="num">0</span>, dur, <span class="fn">int</span>(dur * SR), endpoint=<span class="kw">False</span>)
    <span class="kw">return</span> np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * freq * t) + noise * np.random.<span class="fn">randn</span>(<span class="fn">len</span>(t))

<span class="kw">def</span> <span class="fn">fft_feat</span>(x, n_bins=<span class="num">64</span>):
    spec = np.<span class="fn">abs</span>(<span class="fn">rfft</span>(x))[:SR // <span class="num">2</span>]
    <span class="cm"># Bucket into n_bins log-spaced bands</span>
    edges = np.<span class="fn">logspace</span>(<span class="num">0</span>, np.<span class="fn">log10</span>(SR // <span class="num">2</span>), n_bins + <span class="num">1</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
    <span class="kw">return</span> np.<span class="fn">array</span>([spec[edges[i]:edges[i+<span class="num">1</span>]].<span class="fn">mean</span>() <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n_bins)])

<span class="cm"># 3 "intent classes" via 3 different frequencies</span>
classes = {<span class="str">"play_music"</span>: <span class="num">220</span>, <span class="str">"stop"</span>: <span class="num">660</span>, <span class="str">"volume_up"</span>: <span class="num">1100</span>}
X, y = [], []
<span class="kw">for</span> label, freq <span class="kw">in</span> classes.<span class="fn">items</span>():
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">40</span>):
        clip = <span class="fn">make_clip</span>(freq + np.random.<span class="fn">randn</span>() * <span class="num">5</span>)
        X.<span class="fn">append</span>(<span class="fn">fft_feat</span>(clip)); y.<span class="fn">append</span>(label)
X = np.<span class="fn">stack</span>(X)

clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(<span class="str">"Train accuracy:"</span>, clf.<span class="fn">score</span>(X, y))

<span class="cm"># Inference: simulate a "user said volume up" clip</span>
test = <span class="fn">make_clip</span>(<span class="num">1100</span>, noise=<span class="num">0.1</span>)
intent = clf.<span class="fn">predict</span>([<span class="fn">fft_feat</span>(test)])[<span class="num">0</span>]
<span class="fn">print</span>(<span class="str">"Predicted intent:"</span>, intent)
<span class="cm"># A real cascade would now hand the intent (or a transcript) to an LLM</span>
canned_replies = {
    <span class="str">"play_music"</span>: <span class="str">"Playing your favorites now."</span>,
    <span class="str">"stop"</span>: <span class="str">"Stopping playback."</span>,
    <span class="str">"volume_up"</span>: <span class="str">"Volume increased."</span>,
}
<span class="fn">print</span>(<span class="str">"Reply text:"</span>, canned_replies[intent])
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. End-to-End Audio LLMs</h2>
<p class="l-text">Cascades work, but they throw away everything that is not text. To preserve tone, hesitation, laughter, music, environmental sounds — and to cut latency — the field moved to end-to-end audio LLMs: a single model that reads audio and emits audio (or text). Same adapter recipe as LLaVA, swapping CLIP for an audio encoder.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SeamlessM4T (Meta, Aug 2023)</div><div class="card-body">Massively Multilingual &amp; Multimodal Machine Translation. One model: speech↔text, speech↔speech, 100 input / 35 output languages. Built on w2v-BERT 2.0 encoder + NLLB-style decoder + HiFi-GAN vocoder. v2 (Nov 2023) added expressive translation preserving prosody.</div></div>
<div class="calc-card"><div class="card-title">Qwen-Audio / Qwen2-Audio</div><div class="card-body">Alibaba, Nov 2023 / Jul 2024. Whisper-Large encoder + Qwen LLM + projector. Supports speech, sound, music; instruction-tuned for chat. Open-weights under Apache-2.0. Strong on AIR-Bench (audio instruction benchmark).</div></div>
<div class="calc-card"><div class="card-title">SALMONN (May 2024)</div><div class="card-body">Tsinghua. Whisper + BEATs (audio classification) → window-level Q-Former → Vicuna LLM. Handles speech + music + environmental sound jointly. Good for "describe this audio" tasks.</div></div>
<div class="calc-card"><div class="card-title">GPT-4o-Audio (May 2024)</div><div class="card-body">OpenAI's natively multimodal flagship. End-to-end audio in / audio out, ~320 ms latency (vs 5s for cascade). Captures laughter, breath, accent. Realtime API exposes it as a streaming endpoint. The product target every other lab is chasing.</div></div>
<div class="calc-card"><div class="card-title">AudioGPT</div><div class="card-body">Earlier (Apr 2023) more orchestration-style — a ChatGPT that tool-calls audio specialists (TTS, ASR, music gen). Less coherent than native systems but a useful design pattern.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Audio Tokenization with Neural Codecs</h2>
<p class="l-text">For audio <em>generation</em> you need an inverse: a way to predict audio autoregressively without producing 16K floats per second. Neural codecs solve this by quantizing audio into a small alphabet of discrete tokens (~1024 codes per codebook, multiple codebooks).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SoundStream (Google 2021)</div><div class="card-body">Convolutional encoder-decoder + residual vector quantizer (RVQ). Compresses 24 kHz audio to ~6 kbps with high fidelity. First end-to-end neural codec.</div></div>
<div class="calc-card"><div class="card-title">EnCodec (Meta 2022)</div><div class="card-body">Open-source successor. 24 kHz mono at 1.5/3/6/12/24 kbps. 4–8 RVQ codebooks. Used by AudioGen and MusicGen as the audio tokenizer.</div></div>
<div class="calc-card"><div class="card-title">DAC (Descript 2023)</div><div class="card-body">"Descript Audio Codec." Better fidelity than EnCodec at the same bitrate. State-of-the-art neural codec as of 2024.</div></div>
<div class="calc-card"><div class="card-title">Why this matters</div><div class="card-body">Once audio is tokens, you can use a text-LLM-style transformer to generate it. AudioLM, MusicLM, MusicGen, AudioGen, VALL-E are all "next-token-on-codec-tokens" models. We will see music generation in L7.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Production Trade-offs — When to Pick Cascade vs E2E</h2>
<p class="l-text">In 2026 most production voice products still ship cascades because they are easier to debug, monitor, and swap components in. End-to-end is winning latency-sensitive and prosody-sensitive use cases.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pick cascade when</div><div class="card-body">You need to log/audit every step (compliance), want to swap LLMs without retraining, are on a tight budget (Whisper + GPT-4 + ElevenLabs is cheap and great), or your users are fine with 1.5–3s replies.</div></div>
<div class="calc-card"><div class="card-title">Pick end-to-end when</div><div class="card-body">Latency must be &lt;500 ms (live conversation), prosody matters (therapy bot, language tutor), you want to handle interruptions, or you need cross-lingual speech-to-speech without text in the middle.</div></div>
<div class="calc-card"><div class="card-title">Hybrid (most 2026 products)</div><div class="card-body">Streaming ASR + LLM with sentence-level streaming + streaming TTS. Get cascade modularity with sub-second perceived latency. Tools: pipecat, livekit-agents, Vapi.</div></div>
</div>

<p class="l-text">Evaluation metrics by task family:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ASR — WER (Word Error Rate)</div><div class="card-body">Levenshtein distance / reference length. Lower is better. Whisper large-v3 ~5% on LibriSpeech test-clean, ~10% on Common Voice.</div></div>
<div class="calc-card"><div class="card-title">Translation — BLEU / chrF / COMET</div><div class="card-body">SeamlessM4T v2 reports BLEU ~30 on FLEURS X→En. COMET-22 is the modern preferred metric.</div></div>
<div class="calc-card"><div class="card-title">TTS — MOS (Mean Opinion Score)</div><div class="card-body">Human raters, 1–5. Production target ≥4.0. Newer auto-MOS networks (UTMOS, NISQA) for cheap eval.</div></div>
<div class="calc-card"><div class="card-title">Audio understanding — AIR-Bench</div><div class="card-body">Foundation benchmark for audio LLMs. Tests speech, sound, music understanding under instruction. Qwen2-Audio leads open-source.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Hands-On — Spectrogram Features for an Audio Classifier</h2>
<p class="l-text">A common production sub-task: classify a short audio snippet (intent, emotion, language). The recipe: short-time spectrogram → a few statistical features → small classifier. With sklearn it fits in 30 lines and runs in Pyodide.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — librosa)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Real Mel + MFCC pipeline with librosa — Pyodide-blocked</span>
<span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

<span class="kw">def</span> <span class="fn">mfcc_feat</span>(path, sr=<span class="num">16000</span>, n_mfcc=<span class="num">20</span>):
    y, _ = librosa.<span class="fn">load</span>(path, sr=sr)
    mfcc = librosa.feature.<span class="fn">mfcc</span>(y=y, sr=sr, n_mfcc=n_mfcc)
    <span class="kw">return</span> np.<span class="fn">concatenate</span>([mfcc.<span class="fn">mean</span>(axis=<span class="num">1</span>), mfcc.<span class="fn">std</span>(axis=<span class="num">1</span>)])  <span class="cm"># (40,)</span>

X = np.<span class="fn">stack</span>([<span class="fn">mfcc_feat</span>(p) <span class="kw">for</span> p <span class="kw">in</span> train_paths])
clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(X, train_labels)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same idea using scipy.signal: STFT → log-magnitude band averages. No librosa needed.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.signal <span class="kw">import</span> stft
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report

SR = <span class="num">16000</span>

<span class="kw">def</span> <span class="fn">synth</span>(freq, dur=<span class="num">1.0</span>, noise=<span class="num">0.1</span>):
    t = np.<span class="fn">linspace</span>(<span class="num">0</span>, dur, <span class="fn">int</span>(dur*SR), endpoint=<span class="kw">False</span>)
    <span class="kw">return</span> np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*freq*t) + noise*np.random.<span class="fn">randn</span>(<span class="fn">len</span>(t))

<span class="kw">def</span> <span class="fn">stft_feat</span>(x, n_bands=<span class="num">24</span>):
    f, t, Z = <span class="fn">stft</span>(x, fs=SR, nperseg=<span class="num">400</span>, noverlap=<span class="num">160</span>)
    mag = np.<span class="fn">log1p</span>(np.<span class="fn">abs</span>(Z))
    edges = np.<span class="fn">linspace</span>(<span class="num">0</span>, mag.shape[<span class="num">0</span>], n_bands + <span class="num">1</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
    bands = np.<span class="fn">array</span>([mag[edges[i]:edges[i+<span class="num">1</span>]].<span class="fn">mean</span>() <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n_bands)])
    <span class="kw">return</span> bands

np.random.<span class="fn">seed</span>(<span class="num">7</span>)
emos = {<span class="str">"calm"</span>: <span class="num">200</span>, <span class="str">"angry"</span>: <span class="num">800</span>, <span class="str">"excited"</span>: <span class="num">1500</span>}
X, y = [], []
<span class="kw">for</span> label, base <span class="kw">in</span> emos.<span class="fn">items</span>():
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
        clip = <span class="fn">synth</span>(base + np.random.<span class="fn">randn</span>()*<span class="num">30</span>)
        X.<span class="fn">append</span>(<span class="fn">stft_feat</span>(clip)); y.<span class="fn">append</span>(label)

X = np.<span class="fn">stack</span>(X)
split = <span class="num">120</span>
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X[:split], y[:split])
<span class="fn">print</span>(<span class="fn">classification_report</span>(y[split:], clf.<span class="fn">predict</span>(X[split:])))
</code></pre></div>
</div>

<div class="calc-highlight"><strong>What this captures vs misses:</strong> the FFT-band features get you tone/pitch separation cleanly — enough to distinguish toy "calm vs angry vs excited" tones. They miss formants, prosody contour, and word identity. For real intent classification you would use Whisper embeddings or wav2vec 2.0 features as the front-end and a similar shallow classifier on top.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">Audio-language models follow the same architectural template as vision-language models: encode the non-text modality with a strong frozen encoder, project into the LLM's space, train an adapter and (optionally) the LLM. Whisper made ASR a commodity in 2022; SeamlessM4T extended to speech-to-speech translation; Qwen-Audio and SALMONN brought audio chat to open-source; GPT-4o-Audio set the latency bar at ~320 ms.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Audio reps progress: waveform → STFT → log-Mel → neural codec tokens. Each layer compresses by ~10×.</li>
<li>Whisper: encoder-decoder, 80-channel log-Mel, 30s windows, multitask via control tokens, 99 languages.</li>
<li>Cascades (Whisper → LLM → TTS) dominate production for modularity; end-to-end wins on latency and prosody.</li>
<li>End-to-end audio LLMs: SeamlessM4T (Meta), Qwen-Audio, SALMONN, GPT-4o-Audio.</li>
<li>Neural codecs (EnCodec, DAC) enable autoregressive audio generation — used by MusicGen, AudioGen, VALL-E.</li>
<li>Pick metric by task: WER for ASR, BLEU/COMET for translation, MOS for TTS, AIR-Bench for instruction-following.</li>
</ul>
</div>

<p class="l-text">In <strong>multimodal-L5</strong> we add the temporal axis — video understanding. We will see how VideoMAE pretrains, how Sora's spacetime patches scale, and how Gemini 1.5 / Video-ChatGPT / VILA make hour-long video Q&amp;A tractable.</p>
</div>`,
tr: `<p class="l-text"><strong>Konuşma orijinal multimodal arayüzdür.</strong> Chatbotlar olmadan çok önce, insanlar kafalarında ses-dil füzyonu yapıyorlardı — bir arkadaşın tonunu dinlemek, gürültülü bir barda dudak okumak, akıllı bir hoparlöre komutlar bağırmak. 2022–2025 ses-dil model dalgası bu füzyonu YZ'ye getirdi: <strong>Whisper</strong> (OpenAI, Eyl 2022) çok dilli ASR'yi 680K saatte eğitilen tek bir 1.55B modele indirdi; <strong>SeamlessM4T</strong> (Meta, Ağu 2023) 100+ dilde uçtan uca konuşmadan konuşmaya çeviri ekledi; <strong>Qwen-Audio</strong> (Alibaba, Kas 2023) ve <strong>Qwen2-Audio</strong> (Tem 2024) sesi LLaVA'nın görü için kullandığı aynı adaptör tarifiyle bir sohbet LLM'sine taktı; ve <strong>AudioGPT</strong>, <strong>SALMONN</strong> ve OpenAI'nin <strong>GPT-4o-Audio</strong>'su (May 2024) uçtan uca ses ajanlarını bilim kurgudan ürüne itti.</p>

<p class="l-text">Bu derste tam hattı işliyoruz. Ses temsilleriyle başlıyoruz — ham dalga formu vs spektrogram vs Mel filtre bankası vs öğrenilmiş kodek token'ları (EnCodec, SoundStream). Whisper'ın kodlayıcı-kod çözücü mimarisini, 30 saniyelik log-Mel girdisini ve tek bir modelin prompt token'larından ASR, dil ID, çeviri ve ses etkinlik algılama yapmasına olanak veren çoklu görev formatını araştırıyoruz. Sonra cascade yaklaşımını (Whisper → metin LLM → TTS) vs uçtan uca ses LLM'lerini (SeamlessM4T, Qwen2-Audio, AudioGPT) yürüyoruz ve üretim dengeleriyle bitiriyoruz: gecikme, maliyet, dil kapsamı, gürültüye dayanıklılık.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Ses temsillerini karşılaştırmak: ham dalga formu, STFT, Mel spektrogramı, sinirsel kodek token'ları</li>
<li>Whisper'ın mimarisini ve çoklu görev prompt formatını yeniden inşa etmek (önceki token'lar, dil, görev, zaman damgaları)</li>
<li>Bir cascade hattı (ASR → LLM → TTS) inşa etmek ve güçlü/zayıf yönlerini tanımak</li>
<li>Uçtan uca ses LLM'lerini anlamak: SeamlessM4T, Qwen-Audio, SALMONN, GPT-4o-Audio</li>
<li>Bir üretim kullanım durumu için cascade vs uçtan uca arasında seçim yapmak (gecikme, maliyet, paralinguistik ipuçları)</li>
<li>Ses modellerini değerlendirmek: WER, BLEU, MOS ve ötesi — her metriğin neyi yakaladığı ve yakalayamadığı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Ses Temsilleri — Dalga Formundan Token'a</h2>
<p class="l-text">16 kHz'de 1 saniyelik bir ses klibi 16.000 float'tır. Ham dalga formunu bir transformer'a beslemek savurgandır — komşu örnekler son derece koreledir ve alıcı alanın kısa bir söyleyiş için bile on binlerce token kapsaması gerekir. Üç sıkıştırma katmanı ham sesi modelin işleyebileceği bir şeye dönüştürür:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dalga formu</div><div class="card-body">16/22.05/44.1 kHz'de ham 1D sinyal. HuBERT, wav2vec 2.0, EnCodec kodlayıcı tarafından kullanılır. En yüksek doğruluk, en büyük maliyet.</div></div>
<div class="calc-card"><div class="card-title">STFT spektrogramı</div><div class="card-body">Kısa Süreli Fourier Dönüşümü → zaman-frekans karmaşık matrisi. Büyüklük "hangi frekanslar hangi zamanda"dır. Standart pencere: 25 ms, atlama: 10 ms.</div></div>
<div class="calc-card"><div class="card-title">Log-Mel spektrogramı</div><div class="card-body">STFT → Mel filtre bankası (algısal frekansa eğer) → log. 80-kanallı log-Mel × 100 kare/saniye Whisper'ın girdisidir. 16K örnek/sn'yi → 8K float/sn'ye sıkıştırır.</div></div>
<div class="calc-card"><div class="card-title">Sinirsel kodek token'ları</div><div class="card-body">EnCodec (Meta 2022), SoundStream (Google 2021). Müzik kalitesi için sesi ~75 token/sn'de ayrık kodlara nicelendiren VQ-VAE tokenleyicileri. AudioLM, MusicLM, MusicGen, AudioGen tarafından kullanılır.</div></div>
</div>

<div class="katex-block">$$\\text{Mel}(f) = 2595 \\cdot \\log_{10}\\!\\left(1 + \\frac{f}{700}\\right)$$</div>

<p class="l-text">Mel ölçeği insan perde algısıyla eşleşir — eşit Mel aralıkları eşit ayrılmış duyulur. 80 Mel filtre bankası kanalı standart ASR çözünürlüğüdür; daha ince sayılar ton kalitesinin daha çok önemli olduğu TTS'de kullanılır.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Whisper — Tek Modelde Çoklu Görev Konuşma</h2>
<p class="l-text">Whisper (Radford vd., OpenAI, Eyl 2022) sağlam ASR'nin emtia haline geldiği andı. Tek model, 99 dil, aksanlara ve gürültüye dayanıklı, MIT altında açık kaynak gönderildi. Tarif: kodlayıcı-kod çözücü transformer, 30 saniyelik pencerelerde 80-kanallı log-Mel girdi, çok dilli etiketlerle webden kazınan 680K saat zayıf-denetimli ses.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mimari</div><div class="card-body">Kodlayıcı: 30s 80-kanallı log-Mel → conv-stem → transformer (boyuta bağlı 4–32 katman). Kod çözücü: kodlayıcıya çapraz-dikkatli standart özyineli transformer. Boyutlar: tiny 39M → large-v3 1.55B.</div></div>
<div class="calc-card"><div class="card-title">Çoklu görev prompt formatı</div><div class="card-body"><code>&lt;|startoftranscript|&gt;&lt;|en|&gt;&lt;|transcribe|&gt;&lt;|notimestamps|&gt;</code> ... metin ... <code>&lt;|endoftranscript|&gt;</code>. <code>&lt;|en|&gt;</code>'i <code>&lt;|fr|&gt;</code> + <code>&lt;|translate|&gt;</code>'a çevirmek onu Fransızca→İngilizce çevirmenine dönüştürür. Aynı model, farklı kontrol token'ları.</div></div>
<div class="calc-card"><div class="card-title">Eğitim verisi</div><div class="card-body">Altyazılı web sesinden 680K saat. Bunların ~117K'sı İngilizce dışı. ~125K'sı X→İngilizce çeviri çiftleri. Gürültülü, aksanlı, gerçek dünya sesinde yoğun — bu nedenle dayanıklılık.</div></div>
<div class="calc-card"><div class="card-title">Halefler</div><div class="card-body">Whisper large-v2 (Ara 2022), large-v3 (Kas 2023, v2'den +%10–20), Distil-Whisper (daha hızlı), Whisper-Turbo (Eyl 2024, 8× daha hızlı). Faster-Whisper (CTranslate2) standart üretim çalışma zamanıdır.</div></div>
</div>

<div class="calc-highlight"><strong>Radford'dan kilit içgörü:</strong> ölçekte zayıf denetim küçük ölçekte temiz veriyi yener. Whisper'ın 680K saati hizasız altyazıları, otomatik açıklamaları ve makine-çevrilmiş transkriptleri içerir — ama hacim gürültüyü bastırır. Aynı ders modaliteler arası geçerlidir: kusurlu etiketlerle daha çok veri genellikle kazanır.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Cascade Hatları — Whisper + LLM + TTS</h2>
<p class="l-text">En basit üretim ses ajanı, dizelerle bağlanan üç kutudur: konuşmadan metne, metin LLM, metinden konuşmaya. Cascade'ler 2023–2024'te baskındı çünkü her kutu bağımsız olarak en iyi sınıftadır ve herhangi birini değiştirebilirsiniz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ASR (konuşma girişi)</div><div class="card-body">Whisper, Deepgram, Google STT, Azure Speech, AssemblyAI. Temiz İngilizce'de WER %4–8; gürültülü veya aksanlı'da %10–15.</div></div>
<div class="calc-card"><div class="card-title">LLM (akıl yürütme)</div><div class="card-body">GPT-4, Claude 3.5, Llama-3, Mistral. Transkribe edilmiş metin üzerinde çalışır. Tüm metin-LLM güçlü ve zayıf yönlerini miras alır.</div></div>
<div class="calc-card"><div class="card-title">TTS (konuşma çıkışı)</div><div class="card-body">ElevenLabs, OpenAI TTS, Google WaveNet, Microsoft Neural TTS, açık kaynak XTTS / StyleTTS 2 / Bark. En iyi sistemler için MOS 4.0–4.5 (5 üzerinden).</div></div>
<div class="calc-card"><div class="card-title">Dengeler</div><div class="card-body"><strong>Avantajlar:</strong> modüler, hata ayıklanabilir, bileşenleri değiştir. <strong>Dezavantajlar:</strong> 3 gidiş dönüş (1.5–3s gecikme), prozodiyi kaybeder (transkript öfkeyi, alaycılığı, tereddüdü düşürür), üzerine ses etkinlik algılama gerektirir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — gerçek Whisper)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Gerçek cascade hattı — Pyodide tarafından engellendi (whisper, openai, elevenlabs)</span>
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
<span class="kw">import</span> whisper

client = <span class="fn">OpenAI</span>()
asr = whisper.<span class="fn">load_model</span>(<span class="str">"large-v3"</span>)  <span class="cm"># veya OpenAI'nin whisper-1 API'sini kullan</span>

<span class="cm"># 1. Konuşmadan metne</span>
result = asr.<span class="fn">transcribe</span>(<span class="str">"user_query.wav"</span>)
user_text = result[<span class="str">"text"</span>]
<span class="fn">print</span>(<span class="str">"Duyuldu:"</span>, user_text)

<span class="cm"># 2. Metinden metne (akıl yürütme)</span>
chat = client.chat.completions.<span class="fn">create</span>(
    model=<span class="str">"gpt-4o"</span>,
    messages=[{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: user_text}]
)
reply_text = chat.choices[<span class="num">0</span>].message.content

<span class="cm"># 3. Metinden konuşmaya</span>
speech = client.audio.speech.<span class="fn">create</span>(model=<span class="str">"tts-1"</span>, voice=<span class="str">"alloy"</span>, <span class="fn">input</span>=reply_text)
speech.<span class="fn">stream_to_file</span>(<span class="str">"reply.mp3"</span>)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">FFT öznitelikleri + LogReg kullanan ve 1 saniyelik bir ses klibini küçük bir niyet kümesine sınıflandıran oyuncak bir "ASR". Cascade yapısını taklit eder: ses → metin-sınıfı → dize cevabı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.fft <span class="kw">import</span> rfft
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

SR = <span class="num">16000</span>  <span class="cm"># 16 kHz</span>

<span class="cm"># "Niyetleri" gürültülü sinüsoidal tonlar olarak sentezle — oyuncak ama FFT öznitelikleri çalışır</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
<span class="kw">def</span> <span class="fn">make_clip</span>(freq, dur=<span class="num">1.0</span>, noise=<span class="num">0.05</span>):
    t = np.<span class="fn">linspace</span>(<span class="num">0</span>, dur, <span class="fn">int</span>(dur * SR), endpoint=<span class="kw">False</span>)
    <span class="kw">return</span> np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * freq * t) + noise * np.random.<span class="fn">randn</span>(<span class="fn">len</span>(t))

<span class="kw">def</span> <span class="fn">fft_feat</span>(x, n_bins=<span class="num">64</span>):
    spec = np.<span class="fn">abs</span>(<span class="fn">rfft</span>(x))[:SR // <span class="num">2</span>]
    <span class="cm"># n_bins log-uzaylı banda topla</span>
    edges = np.<span class="fn">logspace</span>(<span class="num">0</span>, np.<span class="fn">log10</span>(SR // <span class="num">2</span>), n_bins + <span class="num">1</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
    <span class="kw">return</span> np.<span class="fn">array</span>([spec[edges[i]:edges[i+<span class="num">1</span>]].<span class="fn">mean</span>() <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n_bins)])

<span class="cm"># 3 farklı frekans aracılığıyla 3 "niyet sınıfı"</span>
classes = {<span class="str">"play_music"</span>: <span class="num">220</span>, <span class="str">"stop"</span>: <span class="num">660</span>, <span class="str">"volume_up"</span>: <span class="num">1100</span>}
X, y = [], []
<span class="kw">for</span> label, freq <span class="kw">in</span> classes.<span class="fn">items</span>():
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">40</span>):
        clip = <span class="fn">make_clip</span>(freq + np.random.<span class="fn">randn</span>() * <span class="num">5</span>)
        X.<span class="fn">append</span>(<span class="fn">fft_feat</span>(clip)); y.<span class="fn">append</span>(label)
X = np.<span class="fn">stack</span>(X)

clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(<span class="str">"Eğitim doğruluğu:"</span>, clf.<span class="fn">score</span>(X, y))

<span class="cm"># Çıkarım: "kullanıcı sesi yükselt dedi" klibini simüle et</span>
test = <span class="fn">make_clip</span>(<span class="num">1100</span>, noise=<span class="num">0.1</span>)
intent = clf.<span class="fn">predict</span>([<span class="fn">fft_feat</span>(test)])[<span class="num">0</span>]
<span class="fn">print</span>(<span class="str">"Tahmin edilen niyet:"</span>, intent)
<span class="cm"># Gerçek bir cascade şimdi niyeti (veya bir transkripti) bir LLM'ye verirdi</span>
canned_replies = {
    <span class="str">"play_music"</span>: <span class="str">"Playing your favorites now."</span>,
    <span class="str">"stop"</span>: <span class="str">"Stopping playback."</span>,
    <span class="str">"volume_up"</span>: <span class="str">"Volume increased."</span>,
}
<span class="fn">print</span>(<span class="str">"Cevap metni:"</span>, canned_replies[intent])
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Uçtan Uca Ses LLM'leri</h2>
<p class="l-text">Cascade'ler çalışır ama metin olmayan her şeyi atarlar. Tonu, tereddüdü, kahkahayı, müziği, çevresel sesleri korumak — ve gecikmeyi azaltmak — için alan uçtan uca ses LLM'lerine geçti: ses okuyup ses (veya metin) yayan tek bir model. CLIP yerine ses kodlayıcı koyularak LLaVA ile aynı adaptör tarifi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SeamlessM4T (Meta, Ağu 2023)</div><div class="card-body">Massively Multilingual &amp; Multimodal Machine Translation. Tek model: konuşma↔metin, konuşma↔konuşma, 100 girdi / 35 çıktı dili. w2v-BERT 2.0 kodlayıcı + NLLB-tarzı kod çözücü + HiFi-GAN vokoder üzerine inşa. v2 (Kas 2023) prozodiyi koruyan ifadeli çeviri ekledi.</div></div>
<div class="calc-card"><div class="card-title">Qwen-Audio / Qwen2-Audio</div><div class="card-body">Alibaba, Kas 2023 / Tem 2024. Whisper-Large kodlayıcı + Qwen LLM + projektör. Konuşma, ses, müzik destekler; sohbet için talimat-ayarlı. Apache-2.0 altında açık ağırlıklar. AIR-Bench'te güçlü (ses talimat benchmarkı).</div></div>
<div class="calc-card"><div class="card-title">SALMONN (May 2024)</div><div class="card-body">Tsinghua. Whisper + BEATs (ses sınıflandırması) → pencere-seviyesi Q-Former → Vicuna LLM. Konuşma + müzik + çevresel sesi ortak işler. "Bu sesi tanımla" görevleri için iyi.</div></div>
<div class="calc-card"><div class="card-title">GPT-4o-Audio (May 2024)</div><div class="card-body">OpenAI'nin yerel multimodal amiral gemisi. Uçtan uca ses girişi / ses çıkışı, ~320 ms gecikme (cascade için 5s'ye karşı). Kahkaha, nefes, aksan yakalar. Realtime API onu akış uç noktası olarak açar. Diğer her laboratuvarın kovaladığı ürün hedefi.</div></div>
<div class="calc-card"><div class="card-title">AudioGPT</div><div class="card-body">Daha eski (Nis 2023) daha orkestrasyon-tarzı — ses uzmanlarına araç çağıran (TTS, ASR, müzik üretimi) bir ChatGPT. Yerel sistemlerden daha az tutarlı ama yararlı bir tasarım deseni.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Sinirsel Kodeklerle Ses Tokenleştirme</h2>
<p class="l-text">Ses <em>üretimi</em> için tersine ihtiyacınız var: saniyede 16K float üretmeden sesi özyineli olarak tahmin etmenin bir yolu. Sinirsel kodekler bunu, sesi küçük bir ayrık token alfabesine (~1024 kod kod kitabı başına, birden fazla kod kitabı) nicelendirerek çözer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SoundStream (Google 2021)</div><div class="card-body">Evrişimsel kodlayıcı-kod çözücü + artıksal vektör nicelendirici (RVQ). 24 kHz sesi yüksek doğrulukla ~6 kbps'ye sıkıştırır. İlk uçtan uca sinirsel kodek.</div></div>
<div class="calc-card"><div class="card-title">EnCodec (Meta 2022)</div><div class="card-body">Açık kaynak halef. 24 kHz mono 1.5/3/6/12/24 kbps'de. 4–8 RVQ kod kitabı. AudioGen ve MusicGen tarafından ses tokenleyicisi olarak kullanılır.</div></div>
<div class="calc-card"><div class="card-title">DAC (Descript 2023)</div><div class="card-body">"Descript Audio Codec." Aynı bit hızında EnCodec'ten daha iyi doğruluk. 2024 itibariyle son teknoloji sinirsel kodek.</div></div>
<div class="calc-card"><div class="card-title">Bu neden önemli</div><div class="card-body">Ses token olduğunda, onu üretmek için metin-LLM-tarzı bir transformer kullanabilirsiniz. AudioLM, MusicLM, MusicGen, AudioGen, VALL-E hepsi "kodek-token üzerinde sonraki-token" modelleridir. Müzik üretimini L7'de göreceğiz.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Üretim Dengeleri — Cascade vs E2E Ne Zaman Seçilmeli</h2>
<p class="l-text">2026'da çoğu üretim ses ürünü hala cascade gönderir çünkü hata ayıklamak, izlemek ve bileşenleri değiştirmek daha kolaydır. Uçtan uca, gecikmeye duyarlı ve prozodi-duyarlı kullanım durumlarını kazanıyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cascade ne zaman seçilmeli</div><div class="card-body">Her adımı kaydetme/denetleme gerektiğinde (uyumluluk), yeniden eğitmeden LLM değiştirmek istediğinizde, sıkı bir bütçedeyseniz (Whisper + GPT-4 + ElevenLabs ucuz ve harika), veya kullanıcılarınız 1.5–3s yanıtlarla iyi.</div></div>
<div class="calc-card"><div class="card-title">Uçtan uca ne zaman seçilmeli</div><div class="card-body">Gecikme &lt;500 ms olmalıysa (canlı konuşma), prozodi önemliyse (terapi botu, dil öğretmeni), kesintileri ele almak istiyorsanız veya ortada metin olmadan diller arası konuşmadan-konuşmaya gerekiyorsa.</div></div>
<div class="calc-card"><div class="card-title">Hibrit (çoğu 2026 ürünü)</div><div class="card-body">Cümle-seviyesi akışlı LLM ile akışlı ASR + akışlı TTS. Saniye-altı algılanan gecikmeyle cascade modülerliği elde et. Araçlar: pipecat, livekit-agents, Vapi.</div></div>
</div>

<p class="l-text">Görev ailesine göre değerlendirme metrikleri:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ASR — WER (Word Error Rate)</div><div class="card-body">Levenshtein mesafesi / referans uzunluğu. Düşük olan daha iyidir. LibriSpeech test-clean'de Whisper large-v3 ~%5, Common Voice'ta ~%10.</div></div>
<div class="calc-card"><div class="card-title">Çeviri — BLEU / chrF / COMET</div><div class="card-body">SeamlessM4T v2 FLEURS X→İngilizce'de BLEU ~30 raporlar. COMET-22 modern tercih edilen metriktir.</div></div>
<div class="calc-card"><div class="card-title">TTS — MOS (Mean Opinion Score)</div><div class="card-body">İnsan değerlendiricileri, 1–5. Üretim hedefi ≥4.0. Ucuz değerlendirme için yeni otomatik-MOS ağları (UTMOS, NISQA).</div></div>
<div class="calc-card"><div class="card-title">Ses anlama — AIR-Bench</div><div class="card-body">Ses LLM'leri için temel benchmark. Talimat altında konuşma, ses, müzik anlamayı test eder. Qwen2-Audio açık kaynakta lider.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Uygulama — Bir Ses Sınıflandırıcı için Spektrogram Öznitelikleri</h2>
<p class="l-text">Yaygın bir üretim alt görevi: kısa bir ses parçasını sınıflandırmak (niyet, duygu, dil). Tarif: kısa-zamanlı spektrogram → birkaç istatistiksel öznitelik → küçük sınıflandırıcı. sklearn ile 30 satıra sığar ve Pyodide'de çalışır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — librosa)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># librosa ile gerçek Mel + MFCC hattı — Pyodide tarafından engellendi</span>
<span class="kw">import</span> librosa
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

<span class="kw">def</span> <span class="fn">mfcc_feat</span>(path, sr=<span class="num">16000</span>, n_mfcc=<span class="num">20</span>):
    y, _ = librosa.<span class="fn">load</span>(path, sr=sr)
    mfcc = librosa.feature.<span class="fn">mfcc</span>(y=y, sr=sr, n_mfcc=n_mfcc)
    <span class="kw">return</span> np.<span class="fn">concatenate</span>([mfcc.<span class="fn">mean</span>(axis=<span class="num">1</span>), mfcc.<span class="fn">std</span>(axis=<span class="num">1</span>)])  <span class="cm"># (40,)</span>

X = np.<span class="fn">stack</span>([<span class="fn">mfcc_feat</span>(p) <span class="kw">for</span> p <span class="kw">in</span> train_paths])
clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(X, train_labels)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">scipy.signal kullanan aynı fikir: STFT → log-büyüklük bant ortalamaları. librosa gerekmez.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.signal <span class="kw">import</span> stft
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report

SR = <span class="num">16000</span>

<span class="kw">def</span> <span class="fn">synth</span>(freq, dur=<span class="num">1.0</span>, noise=<span class="num">0.1</span>):
    t = np.<span class="fn">linspace</span>(<span class="num">0</span>, dur, <span class="fn">int</span>(dur*SR), endpoint=<span class="kw">False</span>)
    <span class="kw">return</span> np.<span class="fn">sin</span>(<span class="num">2</span>*np.pi*freq*t) + noise*np.random.<span class="fn">randn</span>(<span class="fn">len</span>(t))

<span class="kw">def</span> <span class="fn">stft_feat</span>(x, n_bands=<span class="num">24</span>):
    f, t, Z = <span class="fn">stft</span>(x, fs=SR, nperseg=<span class="num">400</span>, noverlap=<span class="num">160</span>)
    mag = np.<span class="fn">log1p</span>(np.<span class="fn">abs</span>(Z))
    edges = np.<span class="fn">linspace</span>(<span class="num">0</span>, mag.shape[<span class="num">0</span>], n_bands + <span class="num">1</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
    bands = np.<span class="fn">array</span>([mag[edges[i]:edges[i+<span class="num">1</span>]].<span class="fn">mean</span>() <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n_bands)])
    <span class="kw">return</span> bands

np.random.<span class="fn">seed</span>(<span class="num">7</span>)
emos = {<span class="str">"calm"</span>: <span class="num">200</span>, <span class="str">"angry"</span>: <span class="num">800</span>, <span class="str">"excited"</span>: <span class="num">1500</span>}
X, y = [], []
<span class="kw">for</span> label, base <span class="kw">in</span> emos.<span class="fn">items</span>():
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
        clip = <span class="fn">synth</span>(base + np.random.<span class="fn">randn</span>()*<span class="num">30</span>)
        X.<span class="fn">append</span>(<span class="fn">stft_feat</span>(clip)); y.<span class="fn">append</span>(label)

X = np.<span class="fn">stack</span>(X)
split = <span class="num">120</span>
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X[:split], y[:split])
<span class="fn">print</span>(<span class="fn">classification_report</span>(y[split:], clf.<span class="fn">predict</span>(X[split:])))
</code></pre></div>
</div>

<div class="calc-highlight"><strong>Bunun yakaladığı vs kaçırdığı:</strong> FFT-bant öznitelikleri size temiz ton/perde ayrımı verir — oyuncak "sakin vs öfkeli vs heyecanlı" tonları ayırt etmek için yeterli. Formantları, prozodi konturunu ve kelime kimliğini kaçırırlar. Gerçek niyet sınıflandırması için ön-uç olarak Whisper gömmelerini veya wav2vec 2.0 özniteliklerini ve üstte benzer sığ bir sınıflandırıcı kullanırdınız.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sonraki</h2>
<p class="l-text">Ses-dil modelleri görü-dil modelleriyle aynı mimari şablonu izler: metin-olmayan modaliteyi güçlü donmuş bir kodlayıcıyla kodla, LLM'nin uzayına projekte et, bir adaptörü ve (isteğe bağlı) LLM'yi eğit. Whisper 2022'de ASR'yi emtia haline getirdi; SeamlessM4T konuşmadan-konuşmaya çeviriye genişletti; Qwen-Audio ve SALMONN ses sohbetini açık kaynağa getirdi; GPT-4o-Audio gecikme çıtasını ~320 ms'ye koydu.</p>

<div class="calc-highlight"><strong>Önemli çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Ses temsilleri ilerlemesi: dalga formu → STFT → log-Mel → sinirsel kodek token'ları. Her katman ~10× sıkıştırır.</li>
<li>Whisper: kodlayıcı-kod çözücü, 80-kanallı log-Mel, 30s pencereler, kontrol token'ları aracılığıyla çoklu görev, 99 dil.</li>
<li>Cascade'ler (Whisper → LLM → TTS) modülerlik için üretimde baskındır; uçtan uca gecikme ve prozodide kazanır.</li>
<li>Uçtan uca ses LLM'leri: SeamlessM4T (Meta), Qwen-Audio, SALMONN, GPT-4o-Audio.</li>
<li>Sinirsel kodekler (EnCodec, DAC) özyineli ses üretimini etkinleştirir — MusicGen, AudioGen, VALL-E tarafından kullanılır.</li>
<li>Görevlere göre metrik seç: ASR için WER, çeviri için BLEU/COMET, TTS için MOS, talimat-takibi için AIR-Bench.</li>
</ul>
</div>

<p class="l-text"><strong>multimodal-L5</strong>'te zamansal ekseni ekliyoruz — video anlama. VideoMAE'nin nasıl ön-eğitildiğini, Sora'nın uzay-zaman yamalarının nasıl ölçeklendiğini ve Gemini 1.5 / Video-ChatGPT / VILA'nın saatlerce video Q&amp;A'yı nasıl çözülebilir hale getirdiğini göreceğiz.</p>
</div>`
};
