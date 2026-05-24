window.AUDIO_L5 = {

en: `<p class="l-text"><strong>Reverse the arrow: from text to audio.</strong> If ASR transcribes speech to text, text-to-speech (TTS) synthesizes audio from text. Modern TTS models can clone any voice from 10 seconds of audio, generate natural-sounding speech in dozens of languages, and run in real-time on consumer GPUs. The voice in your phone's GPS, the audiobook narrator that wasn't a real human, the chatbot voice in your podcast app -- all of these are TTS.</p>

<p class="l-text">This lesson walks the historical arc of TTS from concatenative synthesis to Tacotron 2 to FastSpeech 2 to VITS, then puts modern TTS to work with HuggingFace's SpeechT5 and Bark, mentions API-based options (ElevenLabs, OpenAI), and ends with a voice cloning teaser (XTTS, RVC). By the end you can synthesize speech in 5 lines of Python and you understand the architectural choices that produce different quality/speed/control trade-offs.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Split a TTS system into text-to-spectrogram acoustic model plus vocoder</li>
<li>Compare Tacotron 2, FastSpeech 2, and VITS by autoregression and quality</li>
<li>Synthesize speech in 5 lines using HuggingFace SpeechT5 and a speaker embedding</li>
<li>Generate multilingual speech with Bark and inline music or SFX prompts</li>
<li>Call ElevenLabs and OpenAI TTS APIs for production-grade voice synthesis</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The TTS Pipeline</h2>

<p class="l-text">Modern neural TTS factorizes synthesis into two stages: text -> spectrogram (the "acoustic model"), then spectrogram -> waveform (the "vocoder"). This split is computationally efficient and lets each component specialize.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Text frontend</div><div class="card-body">Tokenize text, normalize numbers/abbreviations, optionally convert to phonemes. Output: token IDs.</div></div>
<div class="calc-card"><div class="card-title">Acoustic model</div><div class="card-body">Tokens -&gt; mel-spectrogram. Decides pitch, duration, prosody, speaker identity. Tacotron, FastSpeech.</div></div>
<div class="calc-card"><div class="card-title">Vocoder</div><div class="card-body">Mel-spectrogram -&gt; raw audio waveform. Decides timbre, naturalness. HiFi-GAN, WaveGlow, BigVGAN.</div></div>
<div class="calc-card"><div class="card-title">End-to-end</div><div class="card-body">Some models (VITS, Bark) skip the explicit spectrogram and go text -&gt; audio directly.</div></div>
<div class="calc-card"><div class="card-title">Speaker conditioning</div><div class="card-body">Optional embedding for "whose voice". Fixed voice (Tacotron speaker), reference audio (XTTS, VALL-E).</div></div>
<div class="calc-card"><div class="card-title">Inference cost</div><div class="card-body">Acoustic model is ~10% of total compute; vocoder is ~90%. Optimization focuses on the vocoder.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: a real TTS request flow</div><div class="example-body">Input text: "Hello, world. The temperature today is 22 degrees." Frontend: normalize "22" to "twenty two" or "twenty-two" depending on locale, split into phonemes [HH, AH, L, OW...]. Acoustic model: produces (80, 350) mel-spectrogram (3.5 seconds at 10 ms hop). Vocoder: turns (80, 350) into (1, 56000) audio (3.5 s at 16 kHz). Total wall time on a modern GPU: ~120 ms.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Tacotron 2: Attention-Based Spectrogram Prediction</h2>

<p class="l-text">Tacotron 2 (Google, 2017) was the first end-to-end neural TTS that sounded human. Architecture: a CNN+LSTM encoder for text, a content-based attention mechanism that reads the encoder output, and an LSTM decoder that emits one mel frame per step until it predicts an end-of-sequence token.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Encoder</div><div class="card-body">Character embedding -&gt; 3 conv layers -&gt; bi-LSTM. Output is one vector per input character.</div></div>
<div class="calc-card"><div class="card-title">Attention</div><div class="card-body">Location-sensitive attention: at each decoder step, soft-align over encoder positions.</div></div>
<div class="calc-card"><div class="card-title">Decoder</div><div class="card-body">2-layer LSTM with prenet. Predicts one mel frame per step, plus a "stop" probability.</div></div>
<div class="calc-card"><div class="card-title">Postnet</div><div class="card-body">5 conv layers that refine the predicted spectrogram (residual connection).</div></div>
<div class="calc-card"><div class="card-title">Vocoder</div><div class="card-body">Originally WaveNet (slow). Modern Tacotron 2 deployments pair with HiFi-GAN.</div></div>
<div class="calc-card"><div class="card-title">Quality</div><div class="card-body">MOS ~4.5/5 (close to recorded human). Fluency was the breakthrough; speed was not great.</div></div>
</div>

<div class="l-warn"><strong>Tacotron's weakness:</strong> autoregressive decoding -- each frame depends on the previous one -- so synthesis is sequential and slow. On long sentences attention occasionally fails (skips a word, repeats a syllable). FastSpeech fixed both problems by decoupling duration from generation.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. FastSpeech 2: Non-Autoregressive Synthesis</h2>

<p class="l-text">FastSpeech (Microsoft, 2019) and FastSpeech 2 (2020) replaced Tacotron's attention with explicit duration prediction. The model predicts how many frames each phoneme should take, expands the input by that many copies, then produces the spectrogram in parallel. Result: 200x faster synthesis with comparable quality.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Phoneme encoder</div><div class="card-body">Transformer that encodes input phonemes to hidden vectors.</div></div>
<div class="calc-card"><div class="card-title">Duration predictor</div><div class="card-body">Per-phoneme regression head: how many mel frames does this phoneme take?</div></div>
<div class="calc-card"><div class="card-title">Length regulator</div><div class="card-body">Repeat each phoneme hidden vector by its predicted duration. Output: per-frame hidden states.</div></div>
<div class="calc-card"><div class="card-title">Pitch / energy predictors</div><div class="card-body">FastSpeech 2 adds explicit prosody control: pitch contour and energy per frame.</div></div>
<div class="calc-card"><div class="card-title">Mel decoder</div><div class="card-body">Transformer that produces final mel-spectrogram from per-frame conditioning.</div></div>
<div class="calc-card"><div class="card-title">Speed</div><div class="card-body">Real-time factor &gt;100 on a single GPU. ~50ms latency for a 5 s utterance.</div></div>
</div>

<div class="l-note"><strong>Why durations help:</strong> the duration of each phoneme is the main thing attention "should" learn but often does not robustly. Predicting it explicitly gives a controllable, interpretable handle (slow down for emphasis, speed up for casual speech) and removes the catastrophic failure mode of attention misalignment.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. VITS: End-to-End Synthesis</h2>

<p class="l-text">VITS (2021) is a single-stage TTS model that goes text -> audio directly with no intermediate spectrogram. Architecture: text encoder, posterior encoder for the audio (during training only), normalizing flow connecting them, and a HiFi-GAN-style vocoder all jointly trained.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">No spectrogram bottleneck</div><div class="card-body">Removes information loss at the mel-spectrogram boundary.</div></div>
<div class="calc-card"><div class="card-title">Flow-based latent</div><div class="card-body">Learns a flexible latent distribution. Better naturalness and prosody diversity.</div></div>
<div class="calc-card"><div class="card-title">Adversarial training</div><div class="card-body">Discriminator pushes output to be indistinguishable from real audio.</div></div>
<div class="calc-card"><div class="card-title">One-stage</div><div class="card-body">No vocoder mismatch. Acoustic and waveform model trained jointly.</div></div>
<div class="calc-card"><div class="card-title">Stochastic duration</div><div class="card-body">Different runs produce slightly different durations -- more natural variability.</div></div>
<div class="calc-card"><div class="card-title">SOTA quality</div><div class="card-body">MOS often above LJSpeech recordings. Used by Coqui-XTTS, Bark indirectly.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. HuggingFace TTS: SpeechT5 and Bark</h2>

<p class="l-text">For practical use, HuggingFace ships several pretrained TTS models behind a uniform API. SpeechT5 is a clean, fast, multi-speaker English model. Bark is a creative, multilingual, GPT-style TTS that can produce music, sound effects, and emotional speech.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers torch sentencepiece datasets soundfile</span>
<span class="kw">from</span> transformers <span class="kw">import</span> SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset
<span class="kw">import</span> torch
<span class="kw">import</span> soundfile <span class="kw">as</span> sf

<span class="cm"># 1) Load processor (text -&gt; tokens), TTS model (text -&gt; mel), vocoder (mel -&gt; audio)</span>
processor = SpeechT5Processor.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/speecht5_tts"</span>)
model = SpeechT5ForTextToSpeech.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/speecht5_tts"</span>)
vocoder = SpeechT5HifiGan.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/speecht5_hifigan"</span>)
device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>
model.<span class="fn">to</span>(device); vocoder.<span class="fn">to</span>(device)

<span class="cm"># 2) Speaker embedding -- SpeechT5 needs a 512-D vector to define the voice</span>
<span class="cm"># Use any of CMU-ARCTIC's pretrained speaker embeddings</span>
embeddings_dataset = <span class="fn">load_dataset</span>(<span class="str">"Matthijs/cmu-arctic-xvectors"</span>, split=<span class="str">"validation"</span>)
speaker_emb = torch.<span class="fn">tensor</span>(embeddings_dataset[<span class="num">7306</span>][<span class="str">"xvector"</span>]).<span class="fn">unsqueeze</span>(<span class="num">0</span>).<span class="fn">to</span>(device)
<span class="fn">print</span>(<span class="str">"speaker embedding shape:"</span>, speaker_emb.shape)   <span class="cm"># (1, 512)

# 3) Synthesize</span>
text = <span class="str">"Welcome to the audio processing course. This sentence was generated by a neural network."</span>
inputs = <span class="fn">processor</span>(text=text, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(device)

<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    <span class="cm"># text -&gt; mel-spectrogram, conditioned on speaker</span>
    spectrogram = model.<span class="fn">generate_speech</span>(
        input_ids=inputs[<span class="str">"input_ids"</span>],
        speaker_embeddings=speaker_emb
    )
    <span class="cm"># mel -&gt; waveform via HiFi-GAN</span>
    waveform = <span class="fn">vocoder</span>(spectrogram)

audio = waveform.<span class="fn">cpu</span>().<span class="fn">numpy</span>()
<span class="fn">print</span>(<span class="str">"audio:"</span>, audio.shape, <span class="str">"samples at 16 kHz"</span>)
sf.<span class="fn">write</span>(<span class="str">"out.wav"</span>, audio, samplerate=<span class="num">16000</span>)

<span class="cm"># 4) For a different voice, pick a different index from the dataset</span>
<span class="kw">for</span> idx <span class="kw">in</span> [<span class="num">100</span>, <span class="num">2000</span>, <span class="num">7306</span>]:
    emb = torch.<span class="fn">tensor</span>(embeddings_dataset[idx][<span class="str">"xvector"</span>]).<span class="fn">unsqueeze</span>(<span class="num">0</span>).<span class="fn">to</span>(device)
    spec = model.<span class="fn">generate_speech</span>(inputs[<span class="str">"input_ids"</span>], emb)
    wav = <span class="fn">vocoder</span>(spec).<span class="fn">cpu</span>().<span class="fn">numpy</span>()
    sf.<span class="fn">write</span>(f<span class="str">"voice_{idx}.wav"</span>, wav, samplerate=<span class="num">16000</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">TTS via additive synthesis. We synthesize a short 'beep word' from a list of frequencies — the same idea pretrained TTS performs at scale.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
def synth(text, sr=16000):
    base = {'a': 440, 'e': 660, 'i': 880, 'o': 330, 'u': 220}
    samples = []
    for ch in text.lower():
        f = base.get(ch, 0)
        if f == 0:
            samples.append(np.zeros(int(sr*0.05)))
        else:
            t = np.arange(int(sr*0.1)) / sr
            samples.append(0.3 * np.sin(2*np.pi*f*t))
    return np.concatenate(samples).astype(np.float32)
y = synth('audio')
print('Synthesized', len(y), 'samples →', round(len(y)/16000, 2), 's')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads three components: a processor that tokenizes text, the SpeechT5 model that converts tokens to a mel-spectrogram, and a HiFi-GAN vocoder that converts the spectrogram to audio. They all live on HuggingFace and download automatically the first time. 2) SpeechT5 is multi-speaker -- it needs a 512-D speaker embedding to know whose voice to produce. We grab a precomputed x-vector from CMU-ARCTIC; index selects the speaker. 3) Tokenize the text and run inference: <code>model.generate_speech</code> emits a mel-spectrogram conditioned on the speaker, then the vocoder converts the spectrogram to a numpy waveform at 16 kHz. 4) Loop over different speaker indices to produce the same sentence in multiple voices -- a nice illustration that voice and content are decoupled in the model.</p>

<div id="plot-al5-wave-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A synthesized waveform produced by a TTS pipeline (text -> spectrogram -> HiFi-GAN). The shape resembles real speech: amplitude bursts where words land, valleys for inter-word silences, smooth envelope across each syllable. A vocoder's job is to fill in the high-frequency detail and noise structure that mel-spectrograms throw away -- and good vocoders do this well enough that the synthesized output is hard to distinguish from a recording.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Bark: Multilingual GPT-Style TTS</h2>

<p class="l-text">Bark (Suno, 2023) is a GPT-style autoregressive TTS that generates audio tokens directly. It supports 100+ languages, can produce music and sound effects, and accepts speaker presets or short reference audio. The trade-off: slower than SpeechT5 (autoregressive) but more expressive.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers torch scipy</span>
<span class="kw">from</span> transformers <span class="kw">import</span> AutoProcessor, BarkModel
<span class="kw">import</span> torch
<span class="kw">import</span> scipy

processor = AutoProcessor.<span class="fn">from_pretrained</span>(<span class="str">"suno/bark-small"</span>)
model = BarkModel.<span class="fn">from_pretrained</span>(<span class="str">"suno/bark-small"</span>)
model.<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 1) English with a built-in voice preset</span>
voice_preset = <span class="str">"v2/en_speaker_6"</span>
inputs = <span class="fn">processor</span>(<span class="str">"Hello! This is the Bark text-to-speech model speaking in a calm voice."</span>,
                  voice_preset=voice_preset)

<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    audio = model.<span class="fn">generate</span>(**inputs.<span class="fn">to</span>(<span class="str">"cuda"</span>))
audio = audio.<span class="fn">cpu</span>().<span class="fn">numpy</span>().<span class="fn">squeeze</span>()
sample_rate = model.generation_config.sample_rate
scipy.io.wavfile.<span class="fn">write</span>(<span class="str">"bark_en.wav"</span>, sample_rate, audio)

<span class="cm"># 2) Turkish - same model, different language</span>
inputs_tr = <span class="fn">processor</span>(<span class="str">"Merhaba! Bu Türkçe konuşan bir yapay zeka."</span>,
                     voice_preset=<span class="str">"v2/tr_speaker_2"</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    audio_tr = model.<span class="fn">generate</span>(**inputs_tr.<span class="fn">to</span>(<span class="str">"cuda"</span>)).<span class="fn">cpu</span>().<span class="fn">numpy</span>().<span class="fn">squeeze</span>()
scipy.io.wavfile.<span class="fn">write</span>(<span class="str">"bark_tr.wav"</span>, sample_rate, audio_tr)

<span class="cm"># 3) Bark accepts non-verbal cues like [laughter], [sighs], music notation</span>
text_with_emotion = <span class="str">"Wow, this is incredible! [laughs] I can't believe it actually works!"</span>
inputs_emo = <span class="fn">processor</span>(text_with_emotion, voice_preset=<span class="str">"v2/en_speaker_3"</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    audio_emo = model.<span class="fn">generate</span>(**inputs_emo.<span class="fn">to</span>(<span class="str">"cuda"</span>)).<span class="fn">cpu</span>().<span class="fn">numpy</span>().<span class="fn">squeeze</span>()
scipy.io.wavfile.<span class="fn">write</span>(<span class="str">"bark_emo.wav"</span>, sample_rate, audio_emo)

<span class="cm"># 4) Music generation (Bark special tokens)</span>
inputs_music = <span class="fn">processor</span>(<span class="str">"♪ In the jungle, the mighty jungle, the lion sleeps tonight ♪"</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    audio_music = model.<span class="fn">generate</span>(**inputs_music.<span class="fn">to</span>(<span class="str">"cuda"</span>)).<span class="fn">cpu</span>().<span class="fn">numpy</span>().<span class="fn">squeeze</span>()
scipy.io.wavfile.<span class="fn">write</span>(<span class="str">"bark_music.wav"</span>, sample_rate, audio_music)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bark-like model is blocked. Equivalent: vary pitch envelope (prosody) for an expressive synth.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
sr = 16000
t = np.arange(sr) / sr
# Pitch starts at 220 Hz, ramps to 440 Hz (rising intonation = question)
f = np.linspace(220, 440, len(t))
phase = np.cumsum(2*np.pi*f/sr)
voice = 0.4 * np.sin(phase) * np.hanning(len(t))
print('Generated 1 s of expressive voice  shape', voice.shape)
print('Pitch range : 220 → 440 Hz')
print('Peak amplitude:', round(float(np.max(np.abs(voice))), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads Bark and its processor. The "small" variant (300M params) gives ~3x speed-up over the full Bark with mostly comparable quality. 2) <code>voice_preset</code> selects from Bark's library of pretrained voice prompts -- for English, presets <code>v2/en_speaker_0</code> through <code>v2/en_speaker_9</code> give 10 distinct voices. The processor encodes both the text and the speaker preset into model inputs. 3) Same model, different language: pass Turkish text and a Turkish speaker preset; output is natural-sounding Turkish speech. Bark trained on many languages simultaneously, so multilingual output is built-in. 4) Bark accepts non-verbal cues like <code>[laughter]</code>, <code>[sighs]</code>, <code>[clears throat]</code> -- the model generates the corresponding sound. This is what makes Bark fun for podcast/audiobook synthesis. 5) Music notation: Bark can produce singing and simple music. Quality varies; this feature is more demo than production.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">SpeechT5</div><div class="compare-item">Fast (~0.1x real-time)</div><div class="compare-item">Clean professional voices</div><div class="compare-item">English only</div><div class="compare-item">Multi-speaker via x-vectors</div></div>
<div class="compare-col"><div class="compare-title">Bark</div><div class="compare-item">Slower (~3x real-time)</div><div class="compare-item">Expressive, can do laughter, music</div><div class="compare-item">100+ languages</div><div class="compare-item">10 presets per language</div></div>
<div class="compare-col"><div class="compare-title">XTTS-v2</div><div class="compare-item">Medium speed</div><div class="compare-item">SOTA voice cloning quality</div><div class="compare-item">17 languages</div><div class="compare-item">10 s reference audio for any voice</div></div>
<div class="compare-col"><div class="compare-title">ElevenLabs / OpenAI API</div><div class="compare-item">Cloud only, paid</div><div class="compare-item">Production-grade quality</div><div class="compare-item">29+ languages</div><div class="compare-item">Voice cloning, emotion control</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. API-Based TTS: ElevenLabs and OpenAI</h2>

<p class="l-text">For production-grade quality without GPU infrastructure, the leading APIs are ElevenLabs (best naturalness, voice cloning) and OpenAI's TTS (clean, fast, simple billing). Both are HTTP APIs returning audio bytes.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
<span class="kw">import</span> requests

<span class="cm"># 1) ElevenLabs API</span>
<span class="kw">def</span> <span class="fn">elevenlabs_tts</span>(text, voice_id=<span class="str">"21m00Tcm4TlvDq8ikWAM"</span>, out=<span class="str">"out.mp3"</span>):
    api_key = os.environ[<span class="str">"ELEVEN_API_KEY"</span>]
    url = f<span class="str">"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"</span>
    headers = {<span class="str">"xi-api-key"</span>: api_key, <span class="str">"Content-Type"</span>: <span class="str">"application/json"</span>}
    payload = {
        <span class="str">"text"</span>: text,
        <span class="str">"model_id"</span>: <span class="str">"eleven_multilingual_v2"</span>,
        <span class="str">"voice_settings"</span>: {<span class="str">"stability"</span>: <span class="num">0.5</span>, <span class="str">"similarity_boost"</span>: <span class="num">0.75</span>}
    }
    r = requests.<span class="fn">post</span>(url, json=payload, headers=headers)
    r.<span class="fn">raise_for_status</span>()
    <span class="kw">with</span> <span class="fn">open</span>(out, <span class="str">"wb"</span>) <span class="kw">as</span> f:
        f.<span class="fn">write</span>(r.content)
    <span class="kw">return</span> out

<span class="fn">elevenlabs_tts</span>(<span class="str">"Production-grade voice synthesis with one API call."</span>)

<span class="cm"># 2) OpenAI TTS API (simpler, similarly high quality)</span>
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
client = <span class="fn">OpenAI</span>()    <span class="cm"># reads OPENAI_API_KEY env var</span>

response = client.audio.speech.<span class="fn">create</span>(
    model=<span class="str">"tts-1-hd"</span>,                <span class="cm"># or "tts-1" for cheaper/faster</span>
    voice=<span class="str">"alloy"</span>,                   <span class="cm"># alloy, echo, fable, onyx, nova, shimmer</span>
    input=<span class="str">"OpenAI's text to speech is a simple REST API."</span>,
    response_format=<span class="str">"mp3"</span>,            <span class="cm"># mp3, opus, aac, flac, wav, pcm</span>
)
response.<span class="fn">stream_to_file</span>(<span class="str">"openai_tts.mp3"</span>)

<span class="cm"># 3) Voice cloning with ElevenLabs (small fee, but works on 1 minute of audio)</span>
<span class="kw">def</span> <span class="fn">elevenlabs_clone</span>(name, audio_paths):
    api_key = os.environ[<span class="str">"ELEVEN_API_KEY"</span>]
    url = <span class="str">"https://api.elevenlabs.io/v1/voices/add"</span>
    files = [(<span class="str">"files"</span>, <span class="fn">open</span>(p, <span class="str">"rb"</span>)) <span class="kw">for</span> p <span class="kw">in</span> audio_paths]
    data = {<span class="str">"name"</span>: name}
    headers = {<span class="str">"xi-api-key"</span>: api_key}
    r = requests.<span class="fn">post</span>(url, headers=headers, data=data, files=files)
    <span class="kw">return</span> r.<span class="fn">json</span>()[<span class="str">"voice_id"</span>]

<span class="cm"># voice_id = elevenlabs_clone("MyVoice", ["sample1.mp3", "sample2.mp3"])</span>
<span class="cm"># elevenlabs_tts("Now I sound like the cloned voice.", voice_id=voice_id)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Cloud-API call replaced with an offline noise-budget check (similar 'cost vs quality' logic without network).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
options = {
    'cheap':  {'snr_db': 10, '$/1k_chars': 0.05},
    'standard': {'snr_db': 25, '$/1k_chars': 0.30},
    'premium': {'snr_db': 40, '$/1k_chars': 1.50},
}
n_chars = 1200
for name, cfg in options.items():
    cost = n_chars/1000 * cfg['$/1k_chars']
    print(f'{name:&gt;8}  SNR={cfg["snr_db"]}dB   cost=\${cost:0.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) ElevenLabs API: POST to <code>/v1/text-to-speech/{voice_id}</code>. The <code>stability</code> parameter controls expressiveness (0 = max variation, 1 = monotone); <code>similarity_boost</code> controls how strictly to match the cloned voice. Returns MP3 bytes. 2) OpenAI's TTS: even simpler. Pick a voice (6 presets), pick a model (tts-1 = fast, tts-1-hd = high quality), pick a format. Cost: $15/M chars for HD. 3) Voice cloning: upload 30-60 seconds of clean audio of any speaker; ElevenLabs returns a voice_id you can then use in regular TTS calls. Quality is shockingly good -- enough that the technology has serious ethical concerns. 4) These APIs cost a few cents per thousand characters and remove all GPU infrastructure work, but you cannot run them offline or on private data.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: a podcast narration pipeline</div><div class="example-body">For an audiobook of a 100k-word novel: split into 200-word chunks (~5000 chunks), call OpenAI TTS HD on each ($0.075 each, $375 total), concatenate the MP3s. Total time on a single thread: 4 hours. Quality: indistinguishable from human narration in casual listening. Compare to traditional audiobook recording: $5000-15000 for studio + narrator + editing.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Voice Cloning Teaser: XTTS and RVC</h2>

<p class="l-text">The cutting edge of TTS is voice cloning -- producing speech in any speaker's voice from a short reference clip (sometimes &lt; 10 seconds). Two open-source approaches dominate.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">XTTS-v2 (Coqui)</div><div class="card-body">Zero-shot voice cloning from 10 s of reference audio. 17 languages. Free, runs on a 8 GB GPU.</div></div>
<div class="calc-card"><div class="card-title">VALL-E (Microsoft)</div><div class="card-body">First high-profile zero-shot cloner. 3 s reference. Closed-source but inspired the wave.</div></div>
<div class="calc-card"><div class="card-title">RVC (Retrieval-Voice Conversion)</div><div class="card-body">Sing/speak with another voice. Different paradigm: input audio, output audio. Used for vocal cover.</div></div>
<div class="calc-card"><div class="card-title">OpenVoice (MyShell)</div><div class="card-body">Voice cloning + style transfer (whisper, sad, fast). 3 s reference.</div></div>
<div class="calc-card"><div class="card-title">F5-TTS (2024)</div><div class="card-body">Diffusion-based; very high quality cloning, slower.</div></div>
<div class="calc-card"><div class="card-title">Ethical concern</div><div class="card-body">Same tech enables fraud, misinformation, deepfakes. All major models add watermarks; usage agreements forbid impersonation.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install TTS  (Coqui XTTS-v2)</span>
<span class="kw">from</span> TTS.api <span class="kw">import</span> TTS
<span class="kw">import</span> torch

device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>
tts = <span class="fn">TTS</span>(model_name=<span class="str">"tts_models/multilingual/multi-dataset/xtts_v2"</span>).<span class="fn">to</span>(device)

<span class="cm"># 1) Voice cloning: provide a 6-15 second reference clip of any speaker</span>
tts.<span class="fn">tts_to_file</span>(
    text=<span class="str">"This sentence is being spoken in a cloned voice."</span>,
    speaker_wav=<span class="str">"reference.wav"</span>,         <span class="cm"># 6-15 s of any clean audio</span>
    language=<span class="str">"en"</span>,
    file_path=<span class="str">"cloned_en.wav"</span>
)

<span class="cm"># 2) Same speaker, different language</span>
tts.<span class="fn">tts_to_file</span>(
    text=<span class="str">"Bu cumle aynı klonlanmış sesle Türkçe konuşuyor."</span>,
    speaker_wav=<span class="str">"reference.wav"</span>,         <span class="cm"># SAME reference clip</span>
    language=<span class="str">"tr"</span>,
    file_path=<span class="str">"cloned_tr.wav"</span>
)
<span class="cm"># Note: the reference can be in any language; output language is set by \`language\` arg</span>

<span class="cm"># 3) Languages supported</span>
<span class="fn">print</span>(tts.languages)
<span class="cm"># ['en', 'es', 'fr', 'de', 'it', 'pt', 'pl', 'tr', 'ru', 'nl', 'cs', 'ar', 'zh-cn', 'ja', 'hu', 'ko', 'hi']

# 4) Streaming inference for low-latency apps</span>
<span class="kw">for</span> chunk <span class="kw">in</span> tts.tts_model.<span class="fn">inference_stream</span>(text=<span class="str">"Streaming output."</span>, language=<span class="str">"en"</span>,
                                          gpt_cond_latent=<span class="kw">None</span>, speaker_embedding=<span class="kw">None</span>):
    <span class="cm"># Each chunk arrives as audio is generated; useful for real-time pipelines</span>
    <span class="kw">pass</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Voice cloning via Coqui XTTS is blocked — but we can demonstrate a 'reference embedding' as the spectral fingerprint of \`audio\`.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.fft import rfft
ref = np.abs(rfft(audio))
ref /= np.linalg.norm(ref) + 1e-9
# Make 3 'candidate voices' by warping the spectrum
candidates = [np.roll(ref, k) for k in (0, 50, 200)]
for k, c in zip([0, 50, 200], candidates):
    sim = float(ref @ c)
    print(f'shift={k:3d}  cosine similarity={sim:0.4f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads XTTS-v2, the leading open-source zero-shot voice cloner. The model is ~2 GB; first load is slow but subsequent calls are fast. 2) Voice cloning in one call: provide a 6-15 second reference clip and the text. The model produces audio that approximates the speaker's voice characteristics. Quality with a clean 10-second reference is impressively close to the original. 3) Cross-lingual cloning: the same English reference can speak Turkish, Spanish, Japanese -- the voice timbre transfers across languages because XTTS separates "what" (text) from "who" (speaker conditioning). 4) Streaming inference yields audio chunks as the model generates them. Useful for real-time voice agents where you cannot wait for the whole utterance to finish synthesis.</p>

<div class="l-warn"><strong>Ethics:</strong> Voice cloning enables real harms: scam phone calls, political deepfakes, harassment. Always obtain consent before cloning anyone's voice. Major model vendors include watermarks (audible or inaudible) for traceability; do not strip them. If you build TTS into a product, add a disclosure ("this voice is AI-generated") and an opt-out path for impersonated individuals.</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> TTS factorizes into text -&gt; spectrogram (acoustic model) and spectrogram -&gt; audio (vocoder). End-to-end models (VITS, Bark) merge both stages.<br><strong>2.</strong> Tacotron 2 was the first natural-sounding neural TTS but is autoregressive and slow; FastSpeech 2 is parallel and 100x faster.<br><strong>3.</strong> VITS is end-to-end with a flow-based latent and adversarial training. Modern open-source TTS (XTTS, Bark) builds on its ideas.<br><strong>4.</strong> HuggingFace's SpeechT5 is the simplest fast English TTS; Bark is multilingual + expressive (laughter, music).<br><strong>5.</strong> ElevenLabs and OpenAI's TTS APIs offer production-grade quality without GPU infrastructure; pay-per-character pricing.<br><strong>6.</strong> Voice cloning (XTTS-v2, OpenVoice, F5-TTS) works from 10 seconds of reference audio; cross-lingual cloning is a default feature.<br><strong>7.</strong> Latency budget: acoustic model ~10%, vocoder ~90%. Optimize the vocoder (HiFi-GAN, BigVGAN) for production speed.<br><strong>8.</strong> Next lesson: audio embeddings -- pretrained features for any audio task, the wav2vec/HuBERT/Whisper-encoder family.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024-2026 Landscape: Modern Generative Audio</h2>

<p class="l-text"><strong>Generative audio went mainstream in the last two years.</strong> Beyond the Tacotron / FastSpeech / VITS lineage covered above, the field now spans expressive TTS, music generation, and unified speech-to-speech translation. Below is the working set every audio engineer should recognize as of late 2026.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bark (Suno, 2023)</div><div class="card-body">Transformer-based TTS that generates audio tokens, not spectrograms. Emotional control via text cues like <code>[laughs]</code> or <code>[music]</code>; produces non-verbal sounds, multilingual, no phoneme front-end. Open weights on HF: <code>suno/bark</code>. Slower than VITS-style models but far more expressive.</div></div>
<div class="calc-card"><div class="card-title">SeamlessM4T v2 (Meta, 2023-11)</div><div class="card-body">Unified speech<->speech and speech<->text across 100+ languages. Single model replaces ASR + MT + TTS pipelines. Useful for low-resource languages where dedicated TTS doesn't exist. HF: <code>facebook/seamless-m4t-v2-large</code>.</div></div>
<div class="calc-card"><div class="card-title">MusicGen (Meta, 2023-06)</div><div class="card-body">Text-to-music with optional melody conditioning. Open weights, 1.5B-3.3B variants, generates up to 30 s coherent music with reasonable quality. Good baseline before paying for closed APIs.</div></div>
<div class="calc-card"><div class="card-title">Suno v4 (2024-11)</div><div class="card-body">Full-song generation with vocals, lyrics, and structure. Up to 4-minute tracks at top-of-class quality. Closed API; the gold standard for AI-generated music in 2025-26 alongside Udio.</div></div>
<div class="calc-card"><div class="card-title">ElevenLabs v3 (2024-11)</div><div class="card-body">Emotional voices, 32 languages, audiobook-grade. Voice design, dialogue mode (multi-speaker turn-taking). Closed API but tier with free monthly characters. The current production default for English audiobook / e-learning TTS.</div></div>
<div class="calc-card"><div class="card-title">OpenAI TTS (tts-1, tts-1-hd, 2023-11)</div><div class="card-body">Six fixed voices (alloy, echo, fable, onyx, nova, shimmer); real-time streaming. Cheaper than ElevenLabs, simpler API, slightly less emotional control. Often combined with Whisper for symmetric voice apps.</div></div>
</div>

<div class="l-note"><strong>Decision tree (2025-26):</strong> Audiobook / podcast voiceover -> ElevenLabs v3. Cheap real-time English TTS -> OpenAI tts-1. Low-resource language or speech translation -> SeamlessM4T v2. Expressive / non-verbal -> Bark. Music underscore -> MusicGen (open) or Suno v4 (premium). Open-source clone -> XTTS-v2 (covered in section 8).</div>
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

  function ttsWavePlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var sr = 4000, dur = 3.5;
    var N = Math.floor(sr * dur);
    var t = [], y = [];
    var words = [[0.1, 0.5, 0.9],[0.7, 1.0, 1.0],[1.2, 1.7, 0.85],[1.9, 2.2, 0.7],[2.4, 3.0, 0.95]];
    for (var i=0;i<N;i++) {
      var ti = i / sr;
      var env = 0;
      for (var w=0;w<words.length;w++){
        if (ti >= words[w][0] && ti <= words[w][1]) {
          var c = (words[w][0]+words[w][1])/2;
          var width = (words[w][1]-words[w][0])/2;
          env = Math.max(env, words[w][2] * Math.cos((ti-c)/width * Math.PI/2));
        }
      }
      var f = 200 + 120*Math.sin(ti*1.8) + 80*Math.sin(ti*9);
      var amp = env * Math.sin(2*Math.PI*f*ti) * (0.85 + 0.15*Math.sin(ti*40));
      t.push(ti); y.push(amp);
    }
    var trace = {x:t, y:y, mode:'lines', line:{color:T.accent, width:0.7}, name:'synthesized'};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Sentezlenmiş Konuşma Dalga Formu (TTS Çıktısı)':'Synthesized Speech Waveform (TTS Output)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman (s)':'time (s)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'genlik':'amplitude', gridcolor:T.grid, zerolinecolor:T.zero, range:[-1.1,1.1]}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  ttsWavePlot('plot-al5-wave-en','en');
  ttsWavePlot('plot-al5-wave-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Oku tersine çevir: metinden sese.</strong> ASR konuşmayı metne yazıya döküyorsa, metinden konuşmaya (TTS) metinden ses sentezler. Modern TTS modelleri 10 saniye sesten herhangi bir sesi klonlayabilir, onlarca dilde doğal sesli konuşma üretebilir ve tüketici GPU'larında gerçek zamanlı çalışabilir. Telefonunuzun GPS'indeki ses, gerçek bir insan olmayan sesli kitap anlatıcısı, podcast uygulamanızdaki sohbet botu sesi -- bunların hepsi TTS'tir.</p>

<p class="l-text">Bu ders TTS'in tarihsel yayını birleştirme sentezinden Tacotron 2'ye, FastSpeech 2'ye ve VITS'e yürür, sonra HuggingFace'in SpeechT5 ve Bark'ıyla modern TTS'i çalıştırır, API tabanlı seçeneklerden (ElevenLabs, OpenAI) bahseder ve bir ses klonlama tanıtımıyla (XTTS, RVC) biter. Sonunda 5 satır Python ile konuşma sentezleyebilirsiniz ve farklı kalite/hız/kontrol ödünleşimleri üreten mimari seçimleri anlarsınız.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>TTS sistemini text-to-spektrogram akustik model artı vokoder olarak böleceksin</li>
<li>Tacotron 2, FastSpeech 2 ve VITS'i otoregresyon ve kaliteye göre karşılaştıracaksın</li>
<li>HuggingFace SpeechT5 ve speaker embedding ile 5 satırda konuşma sentezleyeceksin</li>
<li>Bark ile çok dilli konuşma ve satıriçi müzik/SFX prompt'ları üreteceksin</li>
<li>Üretim kalitesinde ses sentezi için ElevenLabs ve OpenAI TTS API'lerini çağıracaksın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. TTS Hattı</h2>

<p class="l-text">Modern sinirsel TTS sentezi iki aşamaya çarpanlara ayırır: metin -> spektrogram ("akustik model"), sonra spektrogram -> dalga formu ("vokoder"). Bu bölünme hesaplama açısından verimlidir ve her bileşenin uzmanlaşmasına izin verir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Metin frontend'i</div><div class="card-body">Metni tokenize et, sayıları/kısaltmaları normalize et, isteğe bağlı olarak fonemlere dönüştür. Çıkış: token ID'leri.</div></div>
<div class="calc-card"><div class="card-title">Akustik model</div><div class="card-body">Token'lar -&gt; mel-spektrogram. Perde, süre, prozodi, konuşmacı kimliği belirler. Tacotron, FastSpeech.</div></div>
<div class="calc-card"><div class="card-title">Vokoder</div><div class="card-body">Mel-spektrogram -&gt; ham ses dalga formu. Ton, doğallık belirler. HiFi-GAN, WaveGlow, BigVGAN.</div></div>
<div class="calc-card"><div class="card-title">Uçtan uca</div><div class="card-body">Bazı modeller (VITS, Bark) açık spektrogramı atlar ve doğrudan metin -&gt; ses gider.</div></div>
<div class="calc-card"><div class="card-title">Konuşmacı koşullandırma</div><div class="card-body">"Kimin sesi" için isteğe bağlı embedding. Sabit ses (Tacotron konuşmacısı), referans ses (XTTS, VALL-E).</div></div>
<div class="calc-card"><div class="card-title">Çıkarım maliyeti</div><div class="card-body">Akustik model toplam hesaplamanın ~%10'u; vokoder ~%90. Optimizasyon vokodere odaklanır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: gerçek bir TTS istek akışı</div><div class="example-body">Giriş metni: "Merhaba dünya. Bugün sıcaklık 22 derece." Frontend: yerel ayara bağlı olarak "22"yi "yirmi iki" olarak normalize et, fonemlere böl. Akustik model: (80, 350) mel-spektrogramı üretir (10 ms sıçramada 3.5 saniye). Vokoder: (80, 350)'i (1, 56000) sese dönüştürür (16 kHz'de 3.5 s). Modern bir GPU'da toplam saat duvarı zamanı: ~120 ms.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Tacotron 2: Dikkat Tabanlı Spektrogram Tahmini</h2>

<p class="l-text">Tacotron 2 (Google, 2017) insan gibi ses çıkaran ilk uçtan uca sinirsel TTS'tu. Mimari: metin için bir CNN+LSTM kodlayıcı, kodlayıcı çıkışını okuyan içerik tabanlı bir dikkat mekanizması ve bir sıra sonu token'ı tahmin edene kadar adım başına bir mel çerçevesi yayan bir LSTM kod çözücü.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kodlayıcı</div><div class="card-body">Karakter embedding'i -&gt; 3 conv katmanı -&gt; bi-LSTM. Çıkış giriş karakteri başına bir vektördür.</div></div>
<div class="calc-card"><div class="card-title">Dikkat</div><div class="card-body">Konuma duyarlı dikkat: her kod çözücü adımında, kodlayıcı pozisyonları üzerinde yumuşak hizalama.</div></div>
<div class="calc-card"><div class="card-title">Kod çözücü</div><div class="card-body">Prenet'li 2 katmanlı LSTM. Adım başına bir mel çerçevesi artı bir "dur" olasılığı tahmin eder.</div></div>
<div class="calc-card"><div class="card-title">Postnet</div><div class="card-body">Tahmin edilen spektrogramı iyileştiren 5 conv katmanı (artık bağlantı).</div></div>
<div class="calc-card"><div class="card-title">Vokoder</div><div class="card-body">Başlangıçta WaveNet (yavaş). Modern Tacotron 2 dağıtımları HiFi-GAN ile eşleşir.</div></div>
<div class="calc-card"><div class="card-title">Kalite</div><div class="card-body">MOS ~4.5/5 (kayıtlı insana yakın). Akıcılık atılımıydı; hız harika değildi.</div></div>
</div>

<div class="l-warn"><strong>Tacotron'un zayıflığı:</strong> otoregresif kod çözme -- her çerçeve bir öncekine bağlı -- bu yüzden sentez sıralı ve yavaştır. Uzun cümlelerde dikkat ara sıra başarısız olur (bir kelimeyi atlar, bir heceyi tekrarlar). FastSpeech süreyi üretimden ayırarak her iki sorunu da düzeltti.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. FastSpeech 2: Otoregresif Olmayan Sentez</h2>

<p class="l-text">FastSpeech (Microsoft, 2019) ve FastSpeech 2 (2020) Tacotron'un dikkatini açık süre tahminiyle değiştirdi. Model her fonemin kaç çerçeve sürmesi gerektiğini tahmin eder, girişi o kadar kopya genişletir, sonra spektrogramı paralel üretir. Sonuç: karşılaştırılabilir kaliteyle 200x daha hızlı sentez.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fonem kodlayıcı</div><div class="card-body">Giriş fonemlerini gizli vektörlere kodlayan transformer.</div></div>
<div class="calc-card"><div class="card-title">Süre tahmin edici</div><div class="card-body">Fonem başına regresyon başlığı: bu fonem kaç mel çerçevesi sürer?</div></div>
<div class="calc-card"><div class="card-title">Uzunluk düzenleyici</div><div class="card-body">Her fonem gizli vektörünü tahmin edilen süresine göre tekrarla. Çıkış: çerçeve başına gizli durumlar.</div></div>
<div class="calc-card"><div class="card-title">Perde / enerji tahmincileri</div><div class="card-body">FastSpeech 2 açık prozodi kontrolü ekler: çerçeve başına perde konturu ve enerji.</div></div>
<div class="calc-card"><div class="card-title">Mel kod çözücü</div><div class="card-body">Çerçeve başına koşullandırmadan son mel-spektrogramı üreten transformer.</div></div>
<div class="calc-card"><div class="card-title">Hız</div><div class="card-body">Tek GPU'da gerçek zaman faktörü &gt;100. 5 s söyleme için ~50ms gecikme.</div></div>
</div>

<div class="l-note"><strong>Sürelerin neden yardımcı olduğu:</strong> her fonemin süresi dikkatin "öğrenmesi gereken" ana şeydir ama genellikle sağlam değildir. Açıkça tahmin etmek kontrol edilebilir, yorumlanabilir bir tutamak verir (vurgu için yavaşla, gündelik konuşma için hızlan) ve dikkat hizalama hatasının felaket başarısızlık modunu kaldırır.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. VITS: Uçtan Uca Sentez</h2>

<p class="l-text">VITS (2021) ara spektrogram olmadan doğrudan metin -> ses giden tek aşamalı bir TTS modelidir. Mimari: metin kodlayıcı, ses için sonsal kodlayıcı (yalnızca eğitim sırasında), bunları bağlayan normalleştirme akışı ve hepsi ortak eğitilmiş HiFi-GAN tarzı bir vokoder.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spektrogram darboğazı yok</div><div class="card-body">Mel-spektrogram sınırındaki bilgi kaybını kaldırır.</div></div>
<div class="calc-card"><div class="card-title">Akış tabanlı gizli</div><div class="card-body">Esnek bir gizli dağılım öğrenir. Daha iyi doğallık ve prozodi çeşitliliği.</div></div>
<div class="calc-card"><div class="card-title">Çekişmeli eğitim</div><div class="card-body">Ayırt edici çıktıyı gerçek sesten ayırt edilemez olmaya iter.</div></div>
<div class="calc-card"><div class="card-title">Tek aşamalı</div><div class="card-body">Vokoder uyumsuzluğu yok. Akustik ve dalga formu modeli ortak eğitilir.</div></div>
<div class="calc-card"><div class="card-title">Stokastik süre</div><div class="card-body">Farklı çalıştırmalar biraz farklı süreler üretir -- daha doğal değişkenlik.</div></div>
<div class="calc-card"><div class="card-title">SOTA kalite</div><div class="card-body">MOS sıklıkla LJSpeech kayıtlarının üstünde. Coqui-XTTS, Bark dolaylı olarak kullanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. HuggingFace TTS: SpeechT5 ve Bark</h2>

<p class="l-text">Pratik kullanım için HuggingFace düzgün bir API arkasında çeşitli önceden eğitilmiş TTS modelleri sunar. SpeechT5 temiz, hızlı, çok konuşmacılı bir İngilizce modeldir. Bark, müzik, ses efektleri ve duygusal konuşma üretebilen yaratıcı, çok dilli, GPT tarzı bir TTS'tir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers torch sentencepiece datasets soundfile</span>
<span class="kw">from</span> transformers <span class="kw">import</span> SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset
<span class="kw">import</span> torch
<span class="kw">import</span> soundfile <span class="kw">as</span> sf

<span class="cm"># 1) Processor (metin -&gt; token), TTS modelini (metin -&gt; mel), vokoder (mel -&gt; ses) yükle</span>
processor = SpeechT5Processor.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/speecht5_tts"</span>)
model = SpeechT5ForTextToSpeech.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/speecht5_tts"</span>)
vocoder = SpeechT5HifiGan.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/speecht5_hifigan"</span>)
device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>
model.<span class="fn">to</span>(device); vocoder.<span class="fn">to</span>(device)

<span class="cm"># 2) Konuşmacı embedding'i -- SpeechT5 sesi tanımlamak için 512 boyutlu bir vektöre ihtiyaç duyar</span>
<span class="cm"># CMU-ARCTIC'in önceden eğitilmiş konuşmacı embedding'lerinden birini kullan</span>
embeddings_dataset = <span class="fn">load_dataset</span>(<span class="str">"Matthijs/cmu-arctic-xvectors"</span>, split=<span class="str">"validation"</span>)
speaker_emb = torch.<span class="fn">tensor</span>(embeddings_dataset[<span class="num">7306</span>][<span class="str">"xvector"</span>]).<span class="fn">unsqueeze</span>(<span class="num">0</span>).<span class="fn">to</span>(device)
<span class="fn">print</span>(<span class="str">"konusmaci embedding sekli:"</span>, speaker_emb.shape)   <span class="cm"># (1, 512)

# 3) Sentezle</span>
text = <span class="str">"Welcome to the audio processing course. This sentence was generated by a neural network."</span>
inputs = <span class="fn">processor</span>(text=text, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(device)

<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    <span class="cm"># metin -&gt; mel-spektrogram, konuşmacıya koşullanmış</span>
    spectrogram = model.<span class="fn">generate_speech</span>(
        input_ids=inputs[<span class="str">"input_ids"</span>],
        speaker_embeddings=speaker_emb
    )
    <span class="cm"># mel -&gt; HiFi-GAN üzerinden dalga formu</span>
    waveform = <span class="fn">vocoder</span>(spectrogram)

audio = waveform.<span class="fn">cpu</span>().<span class="fn">numpy</span>()
<span class="fn">print</span>(<span class="str">"ses:"</span>, audio.shape, <span class="str">"16 kHz'de ornek"</span>)
sf.<span class="fn">write</span>(<span class="str">"out.wav"</span>, audio, samplerate=<span class="num">16000</span>)

<span class="cm"># 4) Farklı bir ses için, veri kümesinden farklı bir indeks seç</span>
<span class="kw">for</span> idx <span class="kw">in</span> [<span class="num">100</span>, <span class="num">2000</span>, <span class="num">7306</span>]:
    emb = torch.<span class="fn">tensor</span>(embeddings_dataset[idx][<span class="str">"xvector"</span>]).<span class="fn">unsqueeze</span>(<span class="num">0</span>).<span class="fn">to</span>(device)
    spec = model.<span class="fn">generate_speech</span>(inputs[<span class="str">"input_ids"</span>], emb)
    wav = <span class="fn">vocoder</span>(spec).<span class="fn">cpu</span>().<span class="fn">numpy</span>()
    sf.<span class="fn">write</span>(f<span class="str">"voice_{idx}.wav"</span>, wav, samplerate=<span class="num">16000</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Toplamsal sentez ile TTS. Frekans listesinden kısa bir "bip kelime" sentezliyoruz — önceden eğitilmiş TTS'in büyük ölçekte yaptığı fikrin aynısı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
def synth(text, sr=16000):
    base = {'a': 440, 'e': 660, 'i': 880, 'o': 330, 'u': 220}
    samples = []
    for ch in text.lower():
        f = base.get(ch, 0)
        if f == 0:
            samples.append(np.zeros(int(sr*0.05)))
        else:
            t = np.arange(int(sr*0.1)) / sr
            samples.append(0.3 * np.sin(2*np.pi*f*t))
    return np.concatenate(samples).astype(np.float32)
y = synth('audio')
print('Synthesized', len(y), 'samples →', round(len(y)/16000, 2), 's')</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Üç bileşen yükler: metni tokenize eden bir processor, token'ları mel-spektrograma dönüştüren SpeechT5 modeli ve spektrogramı sese dönüştüren bir HiFi-GAN vokoderi. Hepsi HuggingFace'te yaşar ve ilk seferinde otomatik indirilir. 2) SpeechT5 çok konuşmacılıdır -- kimin sesini üreteceğini bilmek için 512 boyutlu bir konuşmacı embedding'ine ihtiyaç duyar. CMU-ARCTIC'ten önceden hesaplanmış bir x-vector alıyoruz; indeks konuşmacıyı seçer. 3) Metni tokenize et ve çıkarımı çalıştır: <code>model.generate_speech</code> konuşmacıya koşullanmış bir mel-spektrogram yayar, sonra vokoder spektrogramı 16 kHz'de bir numpy dalga formuna dönüştürür. 4) Aynı cümleyi birden çok seste üretmek için farklı konuşmacı indeksleri üzerinde döngü yap -- modelde sesin ve içeriğin ayrıldığının güzel bir gösterimi.</p>

<div id="plot-al5-wave-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Bir TTS hattı (metin -> spektrogram -> HiFi-GAN) tarafından üretilen sentezlenmiş bir dalga formu. Şekil gerçek konuşmaya benzer: kelimelerin oturduğu yerde genlik patlamaları, kelimeler arası sessizlikler için vadiler, her hece boyunca pürüzsüz zarf. Bir vokoderin işi, mel-spektrogramların attığı yüksek frekans ayrıntısını ve gürültü yapısını doldurmaktır -- ve iyi vokoderler bunu yeterince iyi yapar ki sentezlenmiş çıktıyı bir kayıttan ayırt etmek zordur.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Bark: Çok Dilli GPT Tarzı TTS</h2>

<p class="l-text">Bark (Suno, 2023) doğrudan ses token'larını üreten GPT tarzı bir otoregresif TTS'tir. 100+ dili destekler, müzik ve ses efektleri üretebilir ve konuşmacı ön ayarlarını veya kısa referans sesi kabul eder. Ödünleşim: SpeechT5'ten yavaş (otoregresif) ama daha ifadeli.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers torch scipy</span>
<span class="kw">from</span> transformers <span class="kw">import</span> AutoProcessor, BarkModel
<span class="kw">import</span> torch
<span class="kw">import</span> scipy

processor = AutoProcessor.<span class="fn">from_pretrained</span>(<span class="str">"suno/bark-small"</span>)
model = BarkModel.<span class="fn">from_pretrained</span>(<span class="str">"suno/bark-small"</span>)
model.<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 1) Yerleşik bir ses ön ayarıyla İngilizce</span>
voice_preset = <span class="str">"v2/en_speaker_6"</span>
inputs = <span class="fn">processor</span>(<span class="str">"Hello! This is the Bark text-to-speech model speaking in a calm voice."</span>,
                  voice_preset=voice_preset)

<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    audio = model.<span class="fn">generate</span>(**inputs.<span class="fn">to</span>(<span class="str">"cuda"</span>))
audio = audio.<span class="fn">cpu</span>().<span class="fn">numpy</span>().<span class="fn">squeeze</span>()
sample_rate = model.generation_config.sample_rate
scipy.io.wavfile.<span class="fn">write</span>(<span class="str">"bark_en.wav"</span>, sample_rate, audio)

<span class="cm"># 2) Türkçe - aynı model, farklı dil</span>
inputs_tr = <span class="fn">processor</span>(<span class="str">"Merhaba! Bu Türkçe konuşan bir yapay zeka."</span>,
                     voice_preset=<span class="str">"v2/tr_speaker_2"</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    audio_tr = model.<span class="fn">generate</span>(**inputs_tr.<span class="fn">to</span>(<span class="str">"cuda"</span>)).<span class="fn">cpu</span>().<span class="fn">numpy</span>().<span class="fn">squeeze</span>()
scipy.io.wavfile.<span class="fn">write</span>(<span class="str">"bark_tr.wav"</span>, sample_rate, audio_tr)

<span class="cm"># 3) Bark [laughter], [sighs], müzik notasyonu gibi sözel olmayan ipuçlarını kabul eder</span>
text_with_emotion = <span class="str">"Wow, this is incredible! [laughs] I can't believe it actually works!"</span>
inputs_emo = <span class="fn">processor</span>(text_with_emotion, voice_preset=<span class="str">"v2/en_speaker_3"</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    audio_emo = model.<span class="fn">generate</span>(**inputs_emo.<span class="fn">to</span>(<span class="str">"cuda"</span>)).<span class="fn">cpu</span>().<span class="fn">numpy</span>().<span class="fn">squeeze</span>()
scipy.io.wavfile.<span class="fn">write</span>(<span class="str">"bark_emo.wav"</span>, sample_rate, audio_emo)

<span class="cm"># 4) Müzik üretimi (Bark özel token'lar)</span>
inputs_music = <span class="fn">processor</span>(<span class="str">"♪ In the jungle, the mighty jungle, the lion sleeps tonight ♪"</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    audio_music = model.<span class="fn">generate</span>(**inputs_music.<span class="fn">to</span>(<span class="str">"cuda"</span>)).<span class="fn">cpu</span>().<span class="fn">numpy</span>().<span class="fn">squeeze</span>()
scipy.io.wavfile.<span class="fn">write</span>(<span class="str">"bark_music.wav"</span>, sample_rate, audio_music)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bark benzeri model engellendi. Eşdeğeri: ifadeli bir sentez için perde zarfını (prozodi) değiştir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
sr = 16000
t = np.arange(sr) / sr
# Pitch starts at 220 Hz, ramps to 440 Hz (rising intonation = question)
f = np.linspace(220, 440, len(t))
phase = np.cumsum(2*np.pi*f/sr)
voice = 0.4 * np.sin(phase) * np.hanning(len(t))
print('Generated 1 s of expressive voice  shape', voice.shape)
print('Pitch range : 220 → 440 Hz')
print('Peak amplitude:', round(float(np.max(np.abs(voice))), 3))</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Bark'ı ve processor'ını yükler. "Small" varyantı (300M parametre) tam Bark üzerinde çoğunlukla karşılaştırılabilir kaliteyle ~3x hızlanma verir. 2) <code>voice_preset</code> Bark'ın önceden eğitilmiş ses istemleri kütüphanesinden seçer -- İngilizce için <code>v2/en_speaker_0</code>'dan <code>v2/en_speaker_9</code>'a kadar olan ön ayarlar 10 belirgin ses verir. Processor hem metni hem de konuşmacı ön ayarını model girdilerine kodlar. 3) Aynı model, farklı dil: Türkçe metin ve bir Türkçe konuşmacı ön ayarı geçirin; çıktı doğal sesli Türkçe konuşmadır. Bark birçok dilde aynı anda eğitildi, bu yüzden çok dilli çıktı yerleşiktir. 4) Bark <code>[laughter]</code>, <code>[sighs]</code>, <code>[clears throat]</code> gibi sözel olmayan ipuçlarını kabul eder -- model karşılık gelen sesi üretir. Bu, podcast/sesli kitap sentezi için Bark'ı eğlenceli yapan şeydir. 5) Müzik notasyonu: Bark şarkı söyleme ve basit müzik üretebilir. Kalite değişir; bu özellik üretimden çok demo niteliğindedir.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">SpeechT5</div><div class="compare-item">Hızlı (~0.1x gerçek zaman)</div><div class="compare-item">Temiz profesyonel sesler</div><div class="compare-item">Yalnızca İngilizce</div><div class="compare-item">x-vektörleri üzerinden çok konuşmacılı</div></div>
<div class="compare-col"><div class="compare-title">Bark</div><div class="compare-item">Daha yavaş (~3x gerçek zaman)</div><div class="compare-item">İfadeli, kahkaha, müzik yapabilir</div><div class="compare-item">100+ dil</div><div class="compare-item">Dil başına 10 ön ayar</div></div>
<div class="compare-col"><div class="compare-title">XTTS-v2</div><div class="compare-item">Orta hız</div><div class="compare-item">SOTA ses klonlama kalitesi</div><div class="compare-item">17 dil</div><div class="compare-item">Herhangi bir ses için 10 s referans ses</div></div>
<div class="compare-col"><div class="compare-title">ElevenLabs / OpenAI API</div><div class="compare-item">Yalnızca bulut, ücretli</div><div class="compare-item">Üretim seviyesi kalite</div><div class="compare-item">29+ dil</div><div class="compare-item">Ses klonlama, duygu kontrolü</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. API Tabanlı TTS: ElevenLabs ve OpenAI</h2>

<p class="l-text">GPU altyapısı olmadan üretim seviyesi kalite için önde gelen API'lar ElevenLabs (en iyi doğallık, ses klonlama) ve OpenAI'nin TTS'idir (temiz, hızlı, basit faturalama). İkisi de ses baytları döndüren HTTP API'lardır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
<span class="kw">import</span> requests

<span class="cm"># 1) ElevenLabs API</span>
<span class="kw">def</span> <span class="fn">elevenlabs_tts</span>(text, voice_id=<span class="str">"21m00Tcm4TlvDq8ikWAM"</span>, out=<span class="str">"out.mp3"</span>):
    api_key = os.environ[<span class="str">"ELEVEN_API_KEY"</span>]
    url = f<span class="str">"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"</span>
    headers = {<span class="str">"xi-api-key"</span>: api_key, <span class="str">"Content-Type"</span>: <span class="str">"application/json"</span>}
    payload = {
        <span class="str">"text"</span>: text,
        <span class="str">"model_id"</span>: <span class="str">"eleven_multilingual_v2"</span>,
        <span class="str">"voice_settings"</span>: {<span class="str">"stability"</span>: <span class="num">0.5</span>, <span class="str">"similarity_boost"</span>: <span class="num">0.75</span>}
    }
    r = requests.<span class="fn">post</span>(url, json=payload, headers=headers)
    r.<span class="fn">raise_for_status</span>()
    <span class="kw">with</span> <span class="fn">open</span>(out, <span class="str">"wb"</span>) <span class="kw">as</span> f:
        f.<span class="fn">write</span>(r.content)
    <span class="kw">return</span> out

<span class="fn">elevenlabs_tts</span>(<span class="str">"Production-grade voice synthesis with one API call."</span>)

<span class="cm"># 2) OpenAI TTS API (daha basit, benzer şekilde yüksek kalite)</span>
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
client = <span class="fn">OpenAI</span>()    <span class="cm"># OPENAI_API_KEY env var'ını okur</span>

response = client.audio.speech.<span class="fn">create</span>(
    model=<span class="str">"tts-1-hd"</span>,                <span class="cm"># veya daha ucuz/hızlı için "tts-1"</span>
    voice=<span class="str">"alloy"</span>,                   <span class="cm"># alloy, echo, fable, onyx, nova, shimmer</span>
    input=<span class="str">"OpenAI's text to speech is a simple REST API."</span>,
    response_format=<span class="str">"mp3"</span>,            <span class="cm"># mp3, opus, aac, flac, wav, pcm</span>
)
response.<span class="fn">stream_to_file</span>(<span class="str">"openai_tts.mp3"</span>)

<span class="cm"># 3) ElevenLabs ile ses klonlama (küçük ücret, ama 1 dakika sesle çalışır)</span>
<span class="kw">def</span> <span class="fn">elevenlabs_clone</span>(name, audio_paths):
    api_key = os.environ[<span class="str">"ELEVEN_API_KEY"</span>]
    url = <span class="str">"https://api.elevenlabs.io/v1/voices/add"</span>
    files = [(<span class="str">"files"</span>, <span class="fn">open</span>(p, <span class="str">"rb"</span>)) <span class="kw">for</span> p <span class="kw">in</span> audio_paths]
    data = {<span class="str">"name"</span>: name}
    headers = {<span class="str">"xi-api-key"</span>: api_key}
    r = requests.<span class="fn">post</span>(url, headers=headers, data=data, files=files)
    <span class="kw">return</span> r.<span class="fn">json</span>()[<span class="str">"voice_id"</span>]

<span class="cm"># voice_id = elevenlabs_clone("MyVoice", ["sample1.mp3", "sample2.mp3"])</span>
<span class="cm"># elevenlabs_tts("Now I sound like the cloned voice.", voice_id=voice_id)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bulut-API çağrısı yerine çevrimdışı bir gürültü-bütçesi kontrolü (ağ olmadan benzer "maliyet vs kalite" mantığı).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
options = {
    'cheap':  {'snr_db': 10, '$/1k_chars': 0.05},
    'standard': {'snr_db': 25, '$/1k_chars': 0.30},
    'premium': {'snr_db': 40, '$/1k_chars': 1.50},
}
n_chars = 1200
for name, cfg in options.items():
    cost = n_chars/1000 * cfg['$/1k_chars']
    print(f'{name:&gt;8}  SNR={cfg["snr_db"]}dB   cost=\${cost:0.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) ElevenLabs API: <code>/v1/text-to-speech/{voice_id}</code>'a POST. <code>stability</code> parametresi ifade gücünü kontrol eder (0 = maks değişim, 1 = monoton); <code>similarity_boost</code> klonlanmış sesle ne kadar sıkı eşleşileceğini kontrol eder. MP3 baytları döner. 2) OpenAI'nin TTS'i: daha da basit. Bir ses seç (6 ön ayar), bir model seç (tts-1 = hızlı, tts-1-hd = yüksek kalite), bir format seç. Maliyet: HD için $15/M karakter. 3) Ses klonlama: herhangi bir konuşmacının 30-60 saniyelik temiz sesini yükle; ElevenLabs sonra normal TTS çağrılarında kullanabileceğiniz bir voice_id döner. Kalite şaşırtıcı derecede iyi -- teknolojinin ciddi etik endişeleri olacak kadar. 4) Bu API'lar bin karakter başına birkaç sent maliyetlidir ve tüm GPU altyapı işini kaldırır, ama bunları çevrimdışı veya özel verilerde çalıştıramazsınız.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: bir podcast anlatım hattı</div><div class="example-body">100k kelimelik bir romanın sesli kitabı için: 200 kelimelik parçalara böl (~5000 parça), her birinde OpenAI TTS HD çağır (her biri $0.075, toplam $375), MP3'leri birleştir. Tek iş parçacığında toplam süre: 4 saat. Kalite: gündelik dinlemede insan anlatımından ayırt edilemez. Geleneksel sesli kitap kaydıyla karşılaştır: stüdyo + anlatıcı + düzenleme için $5000-15000.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Ses Klonlama Tanıtımı: XTTS ve RVC</h2>

<p class="l-text">TTS'in en uç noktası ses klonlamadır -- kısa bir referans klipten (bazen &lt; 10 saniye) herhangi bir konuşmacının sesinde konuşma üretmek. İki açık kaynak yaklaşımı baskındır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">XTTS-v2 (Coqui)</div><div class="card-body">10 s referans sesten sıfır vuruşlu ses klonlama. 17 dil. Ücretsiz, 8 GB GPU'da çalışır.</div></div>
<div class="calc-card"><div class="card-title">VALL-E (Microsoft)</div><div class="card-body">İlk yüksek profilli sıfır vuruşlu klonlayıcı. 3 s referans. Kapalı kaynak ama dalgayı esinlendirdi.</div></div>
<div class="calc-card"><div class="card-title">RVC (Retrieval-Voice Conversion)</div><div class="card-body">Başka bir sesle şarkı söyle/konuş. Farklı paradigma: giriş ses, çıkış ses. Vokal cover için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">OpenVoice (MyShell)</div><div class="card-body">Ses klonlama + stil aktarımı (fısıltı, üzgün, hızlı). 3 s referans.</div></div>
<div class="calc-card"><div class="card-title">F5-TTS (2024)</div><div class="card-body">Difüzyon tabanlı; çok yüksek kalite klonlama, daha yavaş.</div></div>
<div class="calc-card"><div class="card-title">Etik endişe</div><div class="card-body">Aynı teknoloji dolandırıcılık, dezenformasyon, deepfake'leri olanaklı kılar. Tüm büyük modeller filigran ekler; kullanım sözleşmeleri taklidi yasaklar.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install TTS  (Coqui XTTS-v2)</span>
<span class="kw">from</span> TTS.api <span class="kw">import</span> TTS
<span class="kw">import</span> torch

device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>
tts = <span class="fn">TTS</span>(model_name=<span class="str">"tts_models/multilingual/multi-dataset/xtts_v2"</span>).<span class="fn">to</span>(device)

<span class="cm"># 1) Ses klonlama: herhangi bir konuşmacının 6-15 saniyelik referans klibi sağla</span>
tts.<span class="fn">tts_to_file</span>(
    text=<span class="str">"This sentence is being spoken in a cloned voice."</span>,
    speaker_wav=<span class="str">"reference.wav"</span>,         <span class="cm"># 6-15 s herhangi bir temiz ses</span>
    language=<span class="str">"en"</span>,
    file_path=<span class="str">"cloned_en.wav"</span>
)

<span class="cm"># 2) Aynı konuşmacı, farklı dil</span>
tts.<span class="fn">tts_to_file</span>(
    text=<span class="str">"Bu cumle aynı klonlanmış sesle Türkçe konuşuyor."</span>,
    speaker_wav=<span class="str">"reference.wav"</span>,         <span class="cm"># AYNI referans klip</span>
    language=<span class="str">"tr"</span>,
    file_path=<span class="str">"cloned_tr.wav"</span>
)
<span class="cm"># Not: referans herhangi bir dilde olabilir; çıktı dili \`language\` argümanıyla belirlenir</span>

<span class="cm"># 3) Desteklenen diller</span>
<span class="fn">print</span>(tts.languages)
<span class="cm"># ['en', 'es', 'fr', 'de', 'it', 'pt', 'pl', 'tr', 'ru', 'nl', 'cs', 'ar', 'zh-cn', 'ja', 'hu', 'ko', 'hi']

# 4) Düşük gecikmeli uygulamalar için akış çıkarımı</span>
<span class="kw">for</span> chunk <span class="kw">in</span> tts.tts_model.<span class="fn">inference_stream</span>(text=<span class="str">"Streaming output."</span>, language=<span class="str">"en"</span>,
                                          gpt_cond_latent=<span class="kw">None</span>, speaker_embedding=<span class="kw">None</span>):
    <span class="cm"># Ses üretildikçe her parça gelir; gerçek zamanlı hatlar için yararlı</span>
    <span class="kw">pass</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Coqui XTTS ile ses klonlama engellendi — ama \`audio\`'nun spektral parmak izi olarak bir "referans gömme" gösterebiliriz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.fft import rfft
ref = np.abs(rfft(audio))
ref /= np.linalg.norm(ref) + 1e-9
# Make 3 'candidate voices' by warping the spectrum
candidates = [np.roll(ref, k) for k in (0, 50, 200)]
for k, c in zip([0, 50, 200], candidates):
    sim = float(ref @ c)
    print(f'shift={k:3d}  cosine similarity={sim:0.4f}')</code></pre></div>
</div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) XTTS-v2'yi yükler, önde gelen açık kaynak sıfır vuruşlu ses klonlayıcısı. Model ~2 GB; ilk yükleme yavaştır ama sonraki çağrılar hızlıdır. 2) Tek çağrıda ses klonlama: 6-15 saniyelik referans klipi ve metni sağlayın. Model konuşmacının ses özelliklerini yaklaşan ses üretir. Temiz 10 saniyelik bir referansla kalite orijinale etkileyici şekilde yakındır. 3) Çapraz dilli klonlama: aynı İngilizce referans Türkçe, İspanyolca, Japonca konuşabilir -- ses tonu diller arasında aktarır çünkü XTTS "ne"yi (metin) "kim"den (konuşmacı koşullandırma) ayırır. 4) Akış çıkarımı, model üretirken ses parçaları verir. Tüm söylemenin sentezi bitirmesini bekleyemediğiniz gerçek zamanlı ses ajanları için yararlı.</p>

<div class="l-warn"><strong>Etik:</strong> Ses klonlama gerçek zararları olanaklı kılar: dolandırıcılık telefon aramaları, siyasi deepfake'ler, taciz. Birinin sesini klonlamadan önce her zaman izin alın. Büyük model satıcıları izlenebilirlik için filigranlar (duyulabilir veya duyulmaz) ekler; bunları çıkarmayın. TTS'i bir ürüne entegre ediyorsanız, bir bildirim ekleyin ("bu ses yapay zeka tarafından üretilmiştir") ve taklit edilen bireyler için bir vazgeçme yolu ekleyin.</div>

<div class="think-box"><div class="think-label">TEMEL ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> TTS metin -&gt; spektrogram (akustik model) ve spektrogram -&gt; ses (vokoder) olarak çarpanlara ayrılır. Uçtan uca modeller (VITS, Bark) iki aşamayı birleştirir.<br><strong>2.</strong> Tacotron 2 doğal sesli ilk sinirsel TTS'tu ama otoregresif ve yavaştı; FastSpeech 2 paraleldir ve 100x daha hızlıdır.<br><strong>3.</strong> VITS akış tabanlı gizli ve çekişmeli eğitimle uçtan uçadır. Modern açık kaynak TTS (XTTS, Bark) onun fikirleri üzerine kuruludur.<br><strong>4.</strong> HuggingFace'in SpeechT5'i en basit hızlı İngilizce TTS'tir; Bark çok dilli + ifadelidir (kahkaha, müzik).<br><strong>5.</strong> ElevenLabs ve OpenAI'nin TTS API'ları GPU altyapısı olmadan üretim seviyesi kalite sunar; karakter başına ödeme fiyatlandırması.<br><strong>6.</strong> Ses klonlama (XTTS-v2, OpenVoice, F5-TTS) 10 saniye referans sesten çalışır; çapraz dilli klonlama varsayılan bir özelliktir.<br><strong>7.</strong> Gecikme bütçesi: akustik model ~%10, vokoder ~%90. Üretim hızı için vokoderi (HiFi-GAN, BigVGAN) optimize edin.<br><strong>8.</strong> Sonraki ders: ses embedding'leri -- herhangi bir ses görevi için önceden eğitilmiş özellikler, wav2vec/HuBERT/Whisper-encoder ailesi.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024-2026 Manzarası: Modern Üretken Ses</h2>

<p class="l-text"><strong>Üretken ses son iki yılda ana akıma yerleşti.</strong> Yukarıda anlatılan Tacotron / FastSpeech / VITS soyağacının ötesinde, alan artık ifadeli TTS, müzik üretimi ve birleşik konuşmadan konuşmaya çeviriyi kapsıyor. Aşağıda 2026 sonu itibarıyla her ses mühendisinin tanıması gereken çalışma seti var.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bark (Suno, 2023)</div><div class="card-body">Spektrogram değil ses token'ları üreten transformer tabanlı TTS. <code>[laughs]</code> veya <code>[music]</code> gibi metin ipuçlarıyla duygusal kontrol; sözel olmayan sesler üretir, çok dilli, fonem ön-uç yok. HF'de açık ağırlıklar: <code>suno/bark</code>. VITS tarzı modellerden yavaş ama çok daha ifadeli.</div></div>
<div class="calc-card"><div class="card-title">SeamlessM4T v2 (Meta, 2023-11)</div><div class="card-body">100+ dilde birleşik konuşma<->konuşma ve konuşma<->metin. Tek model ASR + MT + TTS hatlarının yerini alır. Özel TTS'in olmadığı düşük kaynaklı diller için yararlı. HF: <code>facebook/seamless-m4t-v2-large</code>.</div></div>
<div class="calc-card"><div class="card-title">MusicGen (Meta, 2023-06)</div><div class="card-body">İsteğe bağlı melodi koşullandırmasıyla metinden müziğe. Açık ağırlıklar, 1.5B-3.3B varyantlar, makul kalitede 30 saniyeye kadar tutarlı müzik üretir. Kapalı API'lere ödeme yapmadan önce iyi bir baseline.</div></div>
<div class="calc-card"><div class="card-title">Suno v4 (2024-11)</div><div class="card-body">Vokal, sözler ve yapıyla tam şarkı üretimi. Sınıfının en iyisi kalitede 4 dakikaya kadar parçalar. Kapalı API; Udio ile birlikte 2025-26'da yapay zeka üretimi müziğin altın standardı.</div></div>
<div class="calc-card"><div class="card-title">ElevenLabs v3 (2024-11)</div><div class="card-body">Duygusal sesler, 32 dil, sesli kitap seviyesinde. Ses tasarımı, diyalog modu (çok konuşmacılı sıra alma). Kapalı API ama ücretsiz aylık karakter katmanı var. İngilizce sesli kitap / e-öğrenme TTS için mevcut üretim varsayılanı.</div></div>
<div class="calc-card"><div class="card-title">OpenAI TTS (tts-1, tts-1-hd, 2023-11)</div><div class="card-body">Altı sabit ses (alloy, echo, fable, onyx, nova, shimmer); gerçek zamanlı akış. ElevenLabs'ten ucuz, daha basit API, biraz daha az duygusal kontrol. Simetrik sesli uygulamalar için sıklıkla Whisper ile birleştirilir.</div></div>
</div>

<div class="l-note"><strong>Karar ağacı (2025-26):</strong> Sesli kitap / podcast seslendirme -> ElevenLabs v3. Ucuz gerçek zamanlı İngilizce TTS -> OpenAI tts-1. Düşük kaynaklı dil veya konuşma çevirisi -> SeamlessM4T v2. İfadeli / sözel olmayan -> Bark. Müzik altı -> MusicGen (açık) veya Suno v4 (premium). Açık kaynak klon -> XTTS-v2 (bölüm 8'de işlendi).</div>
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

  function ttsWavePlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var sr = 4000, dur = 3.5;
    var N = Math.floor(sr * dur);
    var t = [], y = [];
    var words = [[0.1, 0.5, 0.9],[0.7, 1.0, 1.0],[1.2, 1.7, 0.85],[1.9, 2.2, 0.7],[2.4, 3.0, 0.95]];
    for (var i=0;i<N;i++) {
      var ti = i / sr;
      var env = 0;
      for (var w=0;w<words.length;w++){
        if (ti >= words[w][0] && ti <= words[w][1]) {
          var c = (words[w][0]+words[w][1])/2;
          var width = (words[w][1]-words[w][0])/2;
          env = Math.max(env, words[w][2] * Math.cos((ti-c)/width * Math.PI/2));
        }
      }
      var f = 200 + 120*Math.sin(ti*1.8) + 80*Math.sin(ti*9);
      var amp = env * Math.sin(2*Math.PI*f*ti) * (0.85 + 0.15*Math.sin(ti*40));
      t.push(ti); y.push(amp);
    }
    var trace = {x:t, y:y, mode:'lines', line:{color:T.accent, width:0.7}, name:'synthesized'};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Sentezlenmiş Konuşma Dalga Formu (TTS Çıktısı)':'Synthesized Speech Waveform (TTS Output)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'zaman (s)':'time (s)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'genlik':'amplitude', gridcolor:T.grid, zerolinecolor:T.zero, range:[-1.1,1.1]}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  ttsWavePlot('plot-al5-wave-en','en');
  ttsWavePlot('plot-al5-wave-tr','tr');
}, 250);</script>`
};
