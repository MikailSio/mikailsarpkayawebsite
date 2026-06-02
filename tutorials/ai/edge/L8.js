window.EDGE_L8 = {
en: `<p class="l-text"><strong>This is the capstone — we build a working on-device voice assistant from scratch.</strong> Whisper-Tiny for speech recognition, Phi-3-mini (or Gemma 2 2B) for the brain, Piper TTS for the voice, all running locally on a Raspberry Pi 5 (8GB) and on an iPhone 15 Pro. No cloud calls. No API keys. Total round-trip latency under 500 ms. The product is something you could legitimately ship — "Hey Pi, what's on my schedule today?" answered offline, in a hospital with no Wi-Fi, in an airplane, in a tunnel.</p>

<p class="l-text">Everything we covered in L1–L7 comes together here. INT4 quantization (L2) makes Phi-3-mini fit in 2.4GB. Distillation (L3) is why Phi-3-mini exists at all. GGUF + llama.cpp (L4) is the LLM runtime. ONNX (L5) carries Whisper to whisper.cpp. TFLite/CoreML (L6) is the iPhone path. Transformers.js + WebGPU (L7) is the browser variant. And the latency budget arithmetic from L1 (500 ms total) is what we will hit, exactly. We finish with a NumPy capstone implementation: TF-IDF + LogReg as a tiny "LLM" surrogate, audio feature extraction as the ASR proxy, and an end-to-end pipeline you can run live.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Architect a 4-stage on-device voice pipeline (VAD → ASR → LLM → TTS) within a 500ms latency budget</li>
<li>Pick concrete model variants: Whisper-Tiny, Phi-3-mini Q4_K_M, Piper en_US-amy, Silero VAD</li>
<li>Wire the components on Raspberry Pi 5 with whisper.cpp + llama.cpp + Piper</li>
<li>Wire the same pipeline on iPhone with WhisperKit + Apple Foundation Model + AVSpeechSynthesizer</li>
<li>Profile each stage and identify the right knobs (KV cache, beam size, voice quality)</li>
<li>Apply the design to a browser variant using Transformers.js + WebLLM + Web Speech API</li>
<li>Choose between fully-local, hybrid local-cloud, and on-device-with-cloud-fallback architectures</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Architecture — Four Stages, One Budget</h2>
<p class="l-text">Every voice assistant — Siri, Alexa, Google Assistant, ChatGPT Voice Mode, the one we are about to build — is the same four-stage pipeline. The difference between flagship and toy is purely how well each stage is tuned and how well the stages stream into each other.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stage 1 — VAD (Voice Activity Detection)</div><div class="card-body">"Is the user speaking? Have they stopped?" Tiny model (Silero VAD: ~1MB, runs on CPU, &lt;5ms per 30ms audio frame). Triggers ASR start and signals end-of-utterance.</div></div>
<div class="calc-card"><div class="card-title">Stage 2 — ASR (Automatic Speech Recognition)</div><div class="card-body">Audio waveform → text. Whisper-Tiny (39M params, 16kHz only, multilingual). On iPhone 15 Pro Neural Engine: ~80ms for a 3s utterance. On Raspberry Pi 5: ~250ms via whisper.cpp.</div></div>
<div class="calc-card"><div class="card-title">Stage 3 — LLM (the brain)</div><div class="card-body">Text query → text response. Phi-3-mini Q4_K_M (3.8B INT4, 2.4GB). On iPhone: 30 tok/s decode, ~80ms first-token. On Raspberry Pi 5: ~7 tok/s decode, ~400ms first-token.</div></div>
<div class="calc-card"><div class="card-title">Stage 4 — TTS (Text to Speech)</div><div class="card-body">Text → audio. Piper TTS en_US-amy-medium (~63MB). On iPhone: ~80ms first chunk. On Raspberry Pi 5: ~150ms first chunk. Streams the rest as it generates.</div></div>
</div>

<div class="calc-highlight"><strong>Latency budget on iPhone 15 Pro:</strong> 50ms VAD + 80ms ASR + 200ms LLM (first chunk) + 80ms TTS = 410ms total round-trip. Below the 500ms "natural conversation" threshold. On Raspberry Pi 5 the same pipeline lands at ~900–1200ms — usable but not snappy.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Component Choice — Why These Specific Models</h2>
<p class="l-text">For each stage there are dozens of options; here are the 2026-default picks for an offline pipeline, with the reasoning.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAD: Silero VAD v5</div><div class="card-body">~1MB ONNX model, multilingual, well-trained on noisy data. Far better than WebRTC VAD's energy threshold. ~3ms per 30ms frame on any CPU. Used in Whisper-Streaming, faster-whisper, Voicebox.</div></div>
<div class="calc-card"><div class="card-title">ASR: Whisper-Tiny.en (39M)</div><div class="card-body">If English-only, Tiny.en gives the best quality-per-MB. For multilingual, use Whisper-Tiny (74 languages). Larger options (Base 74M, Small 244M) give better WER but blow latency.</div></div>
<div class="calc-card"><div class="card-title">LLM: Phi-3-mini-4k-instruct Q4_K_M</div><div class="card-body">3.8B params, 2.4GB GGUF. Trained on synthetic high-quality data (textbooks, reasoning traces). Surprisingly capable for its size — beats Llama 2 7B on MMLU. Apache 2.0 license.</div></div>
<div class="calc-card"><div class="card-title">LLM (alt): Gemma 2 2B</div><div class="card-body">Smaller (1.5GB Q4_K_M), faster, slightly less capable than Phi-3-mini on reasoning but better at conversational style. Pick this if RAM is tight (Pi 4, mid phones).</div></div>
<div class="calc-card"><div class="card-title">LLM (alt): Llama 3.2 1B / 3B</div><div class="card-body">Meta's specifically-edge-targeted models. 1B fits anywhere; 3B competes with Phi-3-mini. Llama license (free for commercial under 700M MAU).</div></div>
<div class="calc-card"><div class="card-title">TTS: Piper</div><div class="card-body">VITS-based neural TTS, runs on CPU at 5–10x real-time on Raspberry Pi 4. ~63MB per voice. 30+ languages. Open source (MIT). The default open-source TTS in 2026.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Raspberry Pi 5 Build — The Reproducible Reference</h2>
<p class="l-text">Pi 5 (8GB, 4-core ARM Cortex-A76 @ 2.4GHz, no GPU/NPU) is the canonical "$80 edge device" we target. Same Python on Pi 4, Jetson Nano, Orange Pi, generic Linux SBCs.</p>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO — Raspberry Pi setup)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># 1. Build whisper.cpp
git clone https://github.com/ggerganov/whisper.cpp &amp;&amp; cd whisper.cpp
make -j
./models/download-ggml-model.sh tiny.en
cd ..

# 2. Build llama.cpp
git clone https://github.com/ggerganov/llama.cpp &amp;&amp; cd llama.cpp
make -j
huggingface-cli download microsoft/Phi-3-mini-4k-instruct-gguf \\
    Phi-3-mini-4k-instruct-q4.gguf --local-dir models/
cd ..

# 3. Install Piper TTS
pip install piper-tts
python -m piper.download_voices en_US-amy-medium

# 4. Install python wiring
pip install sounddevice numpy silero-vad llama-cpp-python pywhispercpp
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds whisper.cpp from source on the Pi — Gerganov's C++ Whisper port with GGML kernels tuned for ARM NEON; produces the <code>whisper</code> binary and <code>libwhisper.so</code>. 2) Downloads the GGML-quantized Whisper-Tiny.en (Q5_1, ~31MB) — small enough for the Pi's 4-8GB RAM with room left for the LLM. 3) Builds llama.cpp with the same compile flags — ARM NEON, no CUDA — and pulls Phi-3-mini Q4_K_M (~2.4GB) which is the sweet spot of "smart enough to be useful" and "fits with whisper + TTS in RAM". 4) Installs the Python glue: <code>sounddevice</code> for ALSA audio I/O, <code>silero-vad</code> for the energy-based voice activity detector, <code>llama-cpp-python</code> as the LLM bridge, <code>pywhispercpp</code> as the ASR bridge. 5) End state: a Pi 5 (8GB) with ~3GB free after services — enough headroom to run the whole offline assistant at &lt;1 sec total round-trip on the silicon you can buy for $80.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Raspberry Pi pipeline)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># pi_voice_assistant.py — the full offline pipeline
import sounddevice as sd
import numpy as np
from silero_vad import load_silero_vad, get_speech_timestamps
from pywhispercpp.model import Model as Whisper
from llama_cpp import Llama
from piper.voice import PiperVoice

# Load all four stages once at startup
vad     = load_silero_vad()
whisper = Whisper("tiny.en")
llm     = Llama(model_path="models/Phi-3-mini-4k-instruct-q4.gguf",
                n_ctx=2048, n_threads=4, verbose=False)
voice   = PiperVoice.load("en_US-amy-medium.onnx")

SR = 16000

def capture_until_silence():
    """Stream from mic until VAD says user stopped speaking."""
    chunks = []
    silence_frames = 0
    with sd.InputStream(samplerate=SR, channels=1, dtype="float32") as stream:
        while True:
            block, _ = stream.read(int(0.5 * SR))
            chunks.append(block.flatten())
            audio = np.concatenate(chunks)
            ts = get_speech_timestamps(audio, vad, sampling_rate=SR)
            if ts and (len(audio) - ts[-1]["end"]) &gt; 1.0 * SR:
                return audio
            if len(chunks) &gt; 30:  # 15s safety cap
                return audio

def respond(user_text):
    """Phi-3 chat with system prompt for short voice replies."""
    prompt = (f"&lt;|system|&gt;You are a brief offline voice assistant. "
              f"Reply in &lt;= 25 words.&lt;|end|&gt;\\n"
              f"&lt;|user|&gt;{user_text}&lt;|end|&gt;\\n&lt;|assistant|&gt;")
    out = llm(prompt, max_tokens=80, stop=["&lt;|end|&gt;"], temperature=0.6)
    return out["choices"][0]["text"].strip()

def speak(text):
    """Stream TTS to speakers."""
    with sd.OutputStream(samplerate=voice.config.sample_rate, channels=1, dtype="int16") as out:
        for chunk in voice.synthesize_stream_raw(text):
            out.write(np.frombuffer(chunk, dtype=np.int16))

while True:
    print("Listening...")
    audio = capture_until_silence()
    text = whisper.transcribe(audio.astype(np.float32))[0].text.strip()
    print(f"USER: {text}")
    if not text or text.lower() in ("exit", "stop"): break
    reply = respond(text)
    print(f"ASSISTANT: {reply}")
    speak(reply)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Opens a 16kHz mono microphone stream via <code>sounddevice</code> with a small ring buffer — 16kHz is Whisper's native sample rate, and mono is enough for ASR. 2) Feeds rolling chunks to Silero VAD (a 1.8MB ONNX model running on CPU), which returns "speech start/end" timestamps; the <code>get_speech_timestamps</code> threshold (typ. 0.5) trades off cut-off mid-word vs. waiting too long after silence. 3) When the VAD declares end-of-speech, feeds the buffered audio (3-10s typical) to whisper.cpp via the pywhispercpp wrapper — Whisper-Tiny.en transcribes ~3s of audio in ~200ms on Pi 5 (NEON-accelerated INT8 GGML kernels). 4) Sends the resulting text to llama.cpp running Phi-3-mini Q4_K_M; with <code>n_predict=80</code> typical, first-token latency is ~250ms and 80-token reply finishes in ~400ms on Pi 5 ARM cores via llama-cpp-python's <code>generate</code>. 5) Streams the reply text through Piper-TTS (lightweight CPU neural TTS, ~30 voice models on the Piper Hub) and plays the resulting audio chunk-by-chunk via sounddevice — first audio is heard ~150ms after the LLM starts decoding, giving a ~0.9-1.3s total time from "stopped speaking" to "first word heard".</p>

<p class="l-text">Roughly 60 lines of Python. On a Pi 5, end-to-end latency from "user stops talking" to "first word of TTS heard" is 0.9–1.3s. Not phone-class snappy, but a usable offline voice assistant on $80 of hardware.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. iPhone Build — Apple Neural Engine Path</h2>
<p class="l-text">On iPhone the same four-stage pipeline maps to Apple-native components, hitting the Neural Engine for ASR and the system Foundation Model for the LLM. Total time: ~410ms.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAD: AVAudioEngine + Apple Speech</div><div class="card-body">Apple's <code>SFSpeechRecognizer</code> has built-in endpointing. For custom VAD, run Silero ONNX through CoreML.</div></div>
<div class="calc-card"><div class="card-title">ASR: WhisperKit</div><div class="card-body">argmax-inc/WhisperKit — Whisper compiled to CoreML, runs on Apple Neural Engine. Whisper-Tiny.en at ~80ms for 3s audio. WhisperKit's mlmodelc package ships through Swift Package Manager.</div></div>
<div class="calc-card"><div class="card-title">LLM: Apple Foundation Model (iOS 18+)</div><div class="card-body">~3B model exposed via Foundation Models framework. Lower-latency than third-party LLMs (no app-side weight loading; system service warmups). Or use Phi-3-mini.gguf via llama.cpp Swift wrapper for full control.</div></div>
<div class="calc-card"><div class="card-title">TTS: AVSpeechSynthesizer</div><div class="card-body">System TTS, free, multilingual, ~50ms first-chunk latency. For higher quality use Piper-Swift port (running on CPU) or a CoreML neural TTS.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>SWIFT (DEMO — iOS pipeline outline)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// VoiceAssistant.swift — high-level pipeline using WhisperKit + Foundation Models + AVSpeechSynthesizer
import WhisperKit
import FoundationModels   // iOS 18 Apple Intelligence
import AVFoundation

let whisper = try await WhisperKit(model: "openai_whisper-tiny.en")
let llm     = try await SystemLanguageModel.default
let tts     = AVSpeechSynthesizer()

func handle(audio: [Float]) async throws {
    // 1. ASR (Whisper on ANE — ~80 ms)
    let result = try await whisper.transcribe(audioArray: audio)
    let userText = result.text
    print("USER: \\(userText)")

    // 2. LLM (Apple Foundation Model — ~200 ms first token)
    let session = LanguageModelSession(model: llm,
        instructions: "You are a brief offline voice assistant. Reply in &lt;= 25 words.")
    let stream = session.streamResponse(to: userText)
    var reply = ""
    for try await token in stream {
        reply += token
    }
    print("ASSISTANT: \\(reply)")

    // 3. TTS (AVSpeechSynthesizer — ~80 ms first chunk)
    let utt = AVSpeechUtterance(string: reply)
    utt.voice = AVSpeechSynthesisVoice(language: "en-US")
    tts.speak(utt)
}
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>WhisperKit(model: "openai_whisper-tiny.en")</code> loads the CoreML-compiled Whisper-Tiny.en bundle — argmax-inc's port that compiles Whisper's encoder + decoder to .mlmodelc so they run on Apple Neural Engine, not CPU; the result is ~80ms inference for 3s audio versus ~350ms on CPU. 2) <code>SystemLanguageModel.default</code> (Foundation Models framework, iOS 18+) opens a session to the system-bundled ~3B foundation model — no app-side weight loading because the model is shared across all Apple Intelligence apps; warm calls return tokens in ~70ms first-token-latency. 3) The captured audio buffer is sent to WhisperKit's <code>.transcribe(audio:)</code> which returns text + timestamps + confidence — all running on ANE, so the CPU stays free for the audio session. 4) <code>llm.respond(to: text)</code> runs the system foundation model with the system-applied chat template (no manual prompt engineering needed); reply text comes back in ~150ms total on iPhone 15 Pro. 5) Wraps the reply in <code>AVSpeechUtterance</code> with en-US voice and <code>tts.speak()</code>; AVSpeechSynthesizer is system TTS — ~50ms to first audio chunk, runs on a dedicated audio thread. End-to-end ~410ms from "stopped speaking" to "first word heard", which is below the 500ms threshold users perceive as "instant conversation".</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Browser Variant — Transformers.js + WebLLM + Web Speech</h2>
<p class="l-text">Same architecture, all four stages in a Chrome tab. Slightly slower than native (~700ms instead of 410ms) but distributable as a URL with no install.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAD</div><div class="card-body">Silero VAD ONNX through onnxruntime-web (Transformers.js wraps it). ~5ms per 30ms frame.</div></div>
<div class="calc-card"><div class="card-title">ASR</div><div class="card-body">Transformers.js Whisper-Tiny via WebGPU. ~200ms for 3s audio on M2 MacBook. Streaming variants in 2026.</div></div>
<div class="calc-card"><div class="card-title">LLM</div><div class="card-body">WebLLM with Phi-3-mini-WebGPU build. ~25 tok/s decode on M2; ~10 tok/s on a 2024 Snapdragon laptop. First-token ~150ms.</div></div>
<div class="calc-card"><div class="card-title">TTS</div><div class="card-body">Web Speech API (browser-native, but cloud on Chrome desktop) OR Piper compiled to WASM (fully offline, ~80MB download). Trade-off: convenience vs offline integrity.</div></div>
</div>

<p class="l-text">A real demo: <code>chat.webllm.ai</code> shows WebLLM Phi-3-mini chat. Adding Transformers.js Whisper for input and Piper-WASM for output gives you the full offline browser voice assistant. Total weights: ~3GB, cached after first load.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Profiling — Where the Milliseconds Go</h2>
<p class="l-text">Once it works, profile every stage and identify the knob that buys the most. Typical 2026 numbers from real production tuning sessions:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAD overhead — usually invisible</div><div class="card-body">3–10ms. If VAD is &gt;20ms you have a bug — probably loading the model per call instead of once.</div></div>
<div class="calc-card"><div class="card-title">ASR — first-token vs full transcription</div><div class="card-body">Streaming Whisper (Whisper-Streaming, faster-whisper-streaming) gives a partial transcript every 200ms. Use it instead of waiting for end-of-utterance to start the LLM.</div></div>
<div class="calc-card"><div class="card-title">LLM — first-token-latency dominates</div><div class="card-body">Prefill of system prompt + user query takes ~50–200ms depending on length. KV cache reuse across turns saves ~80% on multi-turn dialogues. Always reuse the session.</div></div>
<div class="calc-card"><div class="card-title">TTS — speak the first sentence ASAP</div><div class="card-body">Don't wait for the LLM to finish its 25-word reply. Pipe each LLM token to a streaming TTS that starts speaking after the first sentence. This single trick cuts perceived latency by 200–400ms.</div></div>
<div class="calc-card"><div class="card-title">The big win — interleaving</div><div class="card-body">VAD → ASR → LLM → TTS in series is naive. Stream ASR partials into LLM, stream LLM tokens into TTS, start playback before LLM finishes. Reduces end-to-end perceived latency by 50%+.</div></div>
</div>

<div class="calc-highlight"><strong>Production rule:</strong> latency-to-first-audio is the metric users feel, not total round-trip. Optimize for that — and you can ship even on a Raspberry Pi.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Hands-On — A NumPy Capstone Surrogate</h2>
<p class="l-text">A runnable proxy of the whole pipeline using only sklearn and NumPy. Audio features → "ASR" (TF-IDF nearest neighbor on simulated transcripts) → "LLM" (LogReg classifier picking a canned reply) → "TTS" (returning the audio length budget). It is not a real LLM, but the pipeline shape is identical.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics.pairwise import cosine_similarity
import time

# --- Stage 1: VAD (proxy: energy threshold on a fake audio array)
def vad(audio, threshold=0.02):
    energy = np.sqrt(np.mean(audio**2))
    return energy &gt; threshold

# --- Stage 2: ASR (proxy: nearest-neighbor over a tiny "transcript bank")
transcript_bank = [
    "what is the weather today",
    "set a five minute timer",
    "play some music",
    "what time is it",
    "tell me a joke",
    "remind me to buy bread",
    "how far is the moon",
    "who won the world cup",
]
vec = TfidfVectorizer().fit(transcript_bank)
def asr(audio):
    # Pretend we extract a 16-dim feature from audio. Project to closest transcript.
    feat = np.abs(np.fft.rfft(audio)[:16])  # crude spectral feature
    feat = feat / (feat.sum() + 1e-9)
    # Map fake feature to a transcript by hashing — purely for the demo
    idx = int(feat.argmax()) % len(transcript_bank)
    return transcript_bank[idx]

# --- Stage 3: "LLM" (proxy: LogReg classifier picking a reply category)
training_pairs = [
    ("what is the weather today",       "It's sunny and 22 degrees Celsius."),
    ("set a five minute timer",         "Timer set for 5 minutes."),
    ("play some music",                 "Playing your jazz playlist."),
    ("what time is it",                 "It's 14 hundred 30."),
    ("tell me a joke",                  "Why don't scientists trust atoms? They make up everything."),
    ("remind me to buy bread",          "I'll remind you to buy bread."),
    ("how far is the moon",             "About 384 thousand kilometers."),
    ("who won the world cup",           "Argentina won the 2022 World Cup."),
]
queries = [p[0] for p in training_pairs]
replies = [p[1] for p in training_pairs]
Q = vec.transform(queries)
clf = LogisticRegression(max_iter=500).fit(Q, np.arange(len(replies)))
def llm(text):
    x = vec.transform([text])
    idx = clf.predict(x)[0]
    return replies[idx]

# --- Stage 4: "TTS" (proxy: simulated speak time)
def tts(text):
    n_words = len(text.split())
    return n_words / 3.0  # ~3 words per second

# --- Pipeline
def pipeline(audio):
    timings = {}
    t = time.perf_counter()
    if not vad(audio):
        return None, {"vad_ms": (time.perf_counter()-t)*1000, "skipped": True}
    timings["vad_ms"] = (time.perf_counter()-t)*1000

    t = time.perf_counter()
    text = asr(audio)
    timings["asr_ms"] = (time.perf_counter()-t)*1000

    t = time.perf_counter()
    reply = llm(text)
    timings["llm_ms"] = (time.perf_counter()-t)*1000

    t = time.perf_counter()
    tts_seconds = tts(reply)
    timings["tts_ms"] = (time.perf_counter()-t)*1000  # generation time, not playback
    timings["playback_s"] = tts_seconds

    return (text, reply), timings

# Run a "session"
np.random.seed(0)
fake_audio = 0.1 * np.random.randn(16000 * 3)  # 3 seconds
out, t = pipeline(fake_audio)
if out:
    print(f"USER said:      {out[0]}")
    print(f"ASSISTANT said: {out[1]}")
    print(f"Stage timings:  {t}")
    total_ms = t["vad_ms"]+t["asr_ms"]+t["llm_ms"]+t["tts_ms"]
    print(f"Pipeline total (excl playback): {total_ms:.2f} ms")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines four stages matching the production pipeline 1-to-1: VAD (energy threshold on the audio array — production uses Silero), ASR (TF-IDF + nearest-neighbor over canned transcripts — production uses Whisper-Tiny), LLM (LogReg picking a canned reply id — production uses Phi-3-mini), TTS (returning expected speak time — production uses Piper/AVSpeechSynthesizer). 2) The <code>asr</code> stage uses <code>TfidfVectorizer.transform</code> + cosine similarity to pick the closest canned transcript to the audio's "feature vector" — same retrieval pattern as nearest-neighbor lookups, just on fake features. 3) The <code>llm</code> stage trains a LogReg classifier on (transcript → reply-id) pairs and predicts the reply at runtime — the canned-reply pattern is exactly what early intent-based assistants (Siri 2011-2018) did before LLMs, and is still the production architecture for low-latency embedded use cases. 4) The <code>pipeline</code> function records <code>perf_counter</code> timestamps around each stage and returns both the (text, reply) result and a timings dict — this is the same instrumentation pattern needed in production to find which stage to optimize. 5) Runs the whole pipeline on a 3-second fake audio array and prints stage-by-stage timings — sub-ms because the surrogate stages are trivial, but the structure of the timing dict matches what you'd see profiling a real Pi-based assistant where VAD = ~5ms, ASR = ~200ms, LLM = ~400ms, TTS first-chunk = ~80ms.</p>

<p class="l-text">The numbers will be sub-millisecond because the surrogate is trivial. The point is the <em>structure</em>: four stages, profiled independently, can-be-streamed. Replace each with its real model and you have the pipeline that ran above.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The Three Architecture Choices in 2026</h2>
<p class="l-text">In production, "fully offline" is rarely the only option. There are three architectures and you pick by use case.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fully on-device</div><div class="card-body">Everything local. Total privacy, zero ongoing cost, works offline. Capability ceiling is whatever the 1–4B model can do (~80% of "easy" assistant queries). Used for: medical dictation, journalist tools, in-car assistants, kids' devices.</div></div>
<div class="calc-card"><div class="card-title">On-device-first with cloud fallback</div><div class="card-body">Try local Phi-3-mini; if confidence low or the query needs world knowledge, route to GPT-4 / Claude / Gemini Pro. Apple Intelligence + Private Cloud Compute is exactly this. Best UX overall.</div></div>
<div class="calc-card"><div class="card-title">Hybrid split inference</div><div class="card-body">Some layers on-device, some in cloud. Promising research direction (split-LLM, Petals for federated inference); not yet mainstream production.</div></div>
</div>

<div class="calc-highlight"><strong>Picking by use case:</strong> medical/legal/journalist → fully on-device. Consumer assistant → on-device-first with cloud fallback. Frontier model serving → cloud-only (the 7th and rarest case where edge ML is not the right tool).</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Where to Take This Next</h2>
<p class="l-text">You have shipped a working offline voice assistant. Three productization directions worth considering:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Wake-word + always-on</div><div class="card-body">Add openWakeWord or Porcupine for "Hey Pi" detection. ~200KB model running 24/7 at 3% CPU. Triggers the rest of the pipeline only on activation.</div></div>
<div class="calc-card"><div class="card-title">Tool-using agent (agents-L9)</div><div class="card-body">Wrap the LLM in a tool loop. Local tools: read calendar, set timers, control smart home, query a vector DB of personal documents. Now your offline assistant actually <em>does things</em>.</div></div>
<div class="calc-card"><div class="card-title">Federated personalization</div><div class="card-body">Collect anonymized "did the user reformulate after this answer?" signals; federated-train a local LoRA adapter every night. The assistant gets better at understanding <em>your</em> voice and <em>your</em> idioms without your audio ever leaving the device. The full circle of edge ML.</div></div>
</div>

<p class="l-text">That is the Edge ML &amp; On-Device track. Eight lessons, one working voice assistant. The hardware crossed the threshold; the software stack matured; the privacy and latency wins are real. The next 5 years of consumer ML happen mostly on the device — and you now have the toolkit to ship there.</p>
</div>`,
tr: `<p class="l-text"><strong>Bu capstone — sıfırdan çalışan bir cihaz-üstü ses asistanı inşa ediyoruz.</strong> Konuşma tanıma için Whisper-Tiny, beyin için Phi-3-mini (veya Gemma 2 2B), ses için Piper TTS, hepsi bir Raspberry Pi 5 (8GB) ve bir iPhone 15 Pro üzerinde yerel çalışıyor. Bulut çağrısı yok. API anahtarı yok. Toplam gidiş-dönüş gecikmesi 500 ms altında. Ürün, gerçekten gönderebileceğiniz bir şey — Wi-Fi olmayan bir hastanede, bir uçakta, bir tünelde, çevrimdışı cevaplanan "Hey Pi, bugün programımda ne var?".</p>

<p class="l-text">L1–L7'de ele aldığımız her şey burada bir araya geliyor. INT4 quantization (L2) Phi-3-mini'yi 2.4GB'a sığdırır. Damıtma (L3) Phi-3-mini'nin var olmasının nedeni. GGUF + llama.cpp (L4) LLM runtime'ı. ONNX (L5) Whisper'ı whisper.cpp'ye taşır. TFLite/CoreML (L6) iPhone yolu. Transformers.js + WebGPU (L7) tarayıcı varyantı. Ve L1'deki gecikme bütçesi aritmetiği (toplam 500 ms) tam olarak vuracağımız şey. Bir NumPy capstone uygulaması ile bitiriyoruz: küçük bir "LLM" surrogate olarak TF-IDF + LogReg, ASR proxy olarak ses özellik çıkarma ve canlı çalıştırabileceğiniz uçtan uca bir pipeline.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>500ms gecikme bütçesi içinde 4 aşamalı bir cihaz-üstü ses pipeline'ı (VAD → ASR → LLM → TTS) tasarlamak</li>
<li>Somut model varyantları seçmek: Whisper-Tiny, Phi-3-mini Q4_K_M, Piper en_US-amy, Silero VAD</li>
<li>Bileşenleri Raspberry Pi 5'te whisper.cpp + llama.cpp + Piper ile bağlamak</li>
<li>Aynı pipeline'ı iPhone'da WhisperKit + Apple Foundation Model + AVSpeechSynthesizer ile bağlamak</li>
<li>Her aşamayı profillemek ve doğru ayarları belirlemek (KV cache, beam size, ses kalitesi)</li>
<li>Tasarımı Transformers.js + WebLLM + Web Speech API kullanan bir tarayıcı varyantına uygulamak</li>
<li>Tamamen-yerel, hibrit yerel-bulut ve cihaz-üstü-bulut-fallback'li mimariler arasında seçim yapmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Mimari — Dört Aşama, Tek Bütçe</h2>
<p class="l-text">Her ses asistanı — Siri, Alexa, Google Assistant, ChatGPT Voice Mode, az önce inşa edeceğimiz — aynı dört aşamalı pipeline'dır. Amiral gemisi ile oyuncak arasındaki fark tamamen her aşamanın ne kadar iyi ayarlandığı ve aşamaların birbirine nasıl iyi stream olduğudur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aşama 1 — VAD (Voice Activity Detection)</div><div class="card-body">"Kullanıcı konuşuyor mu? Durdu mu?" Küçük model (Silero VAD: ~1MB, CPU'da çalışır, 30ms ses karesi başına &lt;5ms). ASR başlangıcını tetikler ve konuşma sonu sinyali verir.</div></div>
<div class="calc-card"><div class="card-title">Aşama 2 — ASR (Automatic Speech Recognition)</div><div class="card-body">Ses dalga formu → metin. Whisper-Tiny (39M param, sadece 16kHz, çok dilli). iPhone 15 Pro Neural Engine'de: 3s konuşma için ~80ms. Raspberry Pi 5'te: whisper.cpp aracılığıyla ~250ms.</div></div>
<div class="calc-card"><div class="card-title">Aşama 3 — LLM (beyin)</div><div class="card-body">Metin sorgusu → metin yanıtı. Phi-3-mini Q4_K_M (3.8B INT4, 2.4GB). iPhone'da: 30 tok/s decode, ~80ms ilk-token. Raspberry Pi 5'te: ~7 tok/s decode, ~400ms ilk-token.</div></div>
<div class="calc-card"><div class="card-title">Aşama 4 — TTS (Text to Speech)</div><div class="card-body">Metin → ses. Piper TTS en_US-amy-medium (~63MB). iPhone'da: ~80ms ilk parça. Raspberry Pi 5'te: ~150ms ilk parça. Ürettikçe geri kalanını stream eder.</div></div>
</div>

<div class="calc-highlight"><strong>iPhone 15 Pro'da gecikme bütçesi:</strong> 50ms VAD + 80ms ASR + 200ms LLM (ilk parça) + 80ms TTS = 410ms toplam gidiş-dönüş. 500ms "doğal sohbet" eşiğinin altında. Raspberry Pi 5'te aynı pipeline ~900–1200ms'ye iner — kullanılabilir ama hızlı değil.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bileşen Seçimi — Neden Bu Spesifik Modeller</h2>
<p class="l-text">Her aşama için onlarca seçenek vardır; işte bir çevrimdışı pipeline için 2026-varsayılan seçimleri, gerekçeleriyle.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAD: Silero VAD v5</div><div class="card-body">~1MB ONNX modeli, çok dilli, gürültülü veri üzerinde iyi eğitilmiş. WebRTC VAD'nin enerji eşiğinden çok daha iyi. Herhangi bir CPU'da 30ms karesi başına ~3ms. Whisper-Streaming, faster-whisper, Voicebox'ta kullanılır.</div></div>
<div class="calc-card"><div class="card-title">ASR: Whisper-Tiny.en (39M)</div><div class="card-body">Sadece İngilizce ise, Tiny.en MB başına en iyi kaliteyi verir. Çok dilli için, Whisper-Tiny (74 dil) kullanın. Daha büyük seçenekler (Base 74M, Small 244M) daha iyi WER verir ama gecikmeyi havaya uçurur.</div></div>
<div class="calc-card"><div class="card-title">LLM: Phi-3-mini-4k-instruct Q4_K_M</div><div class="card-body">3.8B param, 2.4GB GGUF. Sentetik yüksek kaliteli veri üzerinde eğitilmiş (ders kitapları, mantık izleri). Boyutu için şaşırtıcı şekilde yetenekli — MMLU'da Llama 2 7B'yi yener. Apache 2.0 lisansı.</div></div>
<div class="calc-card"><div class="card-title">LLM (alt): Gemma 2 2B</div><div class="card-body">Daha küçük (1.5GB Q4_K_M), daha hızlı, mantıkta Phi-3-mini'den biraz daha az yetenekli ama sohbet stilinde daha iyi. RAM sıkışıksa bunu seçin (Pi 4, orta telefonlar).</div></div>
<div class="calc-card"><div class="card-title">LLM (alt): Llama 3.2 1B / 3B</div><div class="card-body">Meta'nın özellikle-edge-hedeflenen modelleri. 1B her yere sığar; 3B Phi-3-mini ile rekabet eder. Llama lisansı (700M MAU altında ticari için ücretsiz).</div></div>
<div class="calc-card"><div class="card-title">TTS: Piper</div><div class="card-body">VITS-tabanlı nöral TTS, Raspberry Pi 4'te 5–10x gerçek-zamanlı CPU'da çalışır. Ses başına ~63MB. 30+ dil. Açık kaynak (MIT). 2026'da varsayılan açık kaynaklı TTS.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Raspberry Pi 5 Build — Yeniden Üretilebilir Referans</h2>
<p class="l-text">Pi 5 (8GB, 4 çekirdekli ARM Cortex-A76 @ 2.4GHz, GPU/NPU yok), hedeflediğimiz kanonik "$80 edge cihazı"dır. Pi 4, Jetson Nano, Orange Pi, genel Linux SBC'lerde aynı Python.</p>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO — Raspberry Pi kurulumu)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># 1. whisper.cpp inşa et
git clone https://github.com/ggerganov/whisper.cpp &amp;&amp; cd whisper.cpp
make -j
./models/download-ggml-model.sh tiny.en
cd ..

# 2. llama.cpp inşa et
git clone https://github.com/ggerganov/llama.cpp &amp;&amp; cd llama.cpp
make -j
huggingface-cli download microsoft/Phi-3-mini-4k-instruct-gguf \\
    Phi-3-mini-4k-instruct-q4.gguf --local-dir models/
cd ..

# 3. Piper TTS yükle
pip install piper-tts
python -m piper.download_voices en_US-amy-medium

# 4. Python bağlamasını yükle
pip install sounddevice numpy silero-vad llama-cpp-python pywhispercpp
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) whisper.cpp'yi Pi üzerinde kaynaktan inşa eder — Gerganov'un ARM NEON için ayarlanmış GGML kernel'leri olan C++ Whisper port'u; <code>whisper</code> binary'sini ve <code>libwhisper.so</code>'yu üretir. 2) GGML-quantize edilmiş Whisper-Tiny.en'i (Q5_1, ~31MB) indirir — Pi'nin 4-8GB RAM'inde LLM için yer bırakacak kadar küçük. 3) llama.cpp'yi aynı compile flag'leri ile inşa eder — ARM NEON, CUDA yok — ve "yararlı olacak kadar akıllı" ile "whisper + TTS ile RAM'e sığar" tatlı noktası olan Phi-3-mini Q4_K_M'yi (~2.4GB) çeker. 4) Python tutkalını yükler: ALSA ses I/O için <code>sounddevice</code>, enerji-tabanlı VAD için <code>silero-vad</code>, LLM köprüsü olarak <code>llama-cpp-python</code>, ASR köprüsü olarak <code>pywhispercpp</code>. 5) Son durum: Pi 5 (8GB) servisler sonrası ~3GB serbest — tüm offline asistanı 80 dolarlık silikonda toplam &lt;1 sn round-trip'te çalıştırmaya yeterli kafa boşluğu.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Raspberry Pi pipeline)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># pi_voice_assistant.py — tam çevrimdışı pipeline
import sounddevice as sd
import numpy as np
from silero_vad import load_silero_vad, get_speech_timestamps
from pywhispercpp.model import Model as Whisper
from llama_cpp import Llama
from piper.voice import PiperVoice

# Başlangıçta dört aşamayı bir kez yükle
vad     = load_silero_vad()
whisper = Whisper("tiny.en")
llm     = Llama(model_path="models/Phi-3-mini-4k-instruct-q4.gguf",
                n_ctx=2048, n_threads=4, verbose=False)
voice   = PiperVoice.load("en_US-amy-medium.onnx")

SR = 16000

def capture_until_silence():
    """VAD kullanıcının konuşmayı bıraktığını söyleyene kadar mikrofondan stream et."""
    chunks = []
    silence_frames = 0
    with sd.InputStream(samplerate=SR, channels=1, dtype="float32") as stream:
        while True:
            block, _ = stream.read(int(0.5 * SR))
            chunks.append(block.flatten())
            audio = np.concatenate(chunks)
            ts = get_speech_timestamps(audio, vad, sampling_rate=SR)
            if ts and (len(audio) - ts[-1]["end"]) &gt; 1.0 * SR:
                return audio
            if len(chunks) &gt; 30:  # 15s güvenlik üst sınırı
                return audio

def respond(user_text):
    """Kısa sesli yanıtlar için sistem prompt'lu Phi-3 chat."""
    prompt = (f"&lt;|system|&gt;You are a brief offline voice assistant. "
              f"Reply in &lt;= 25 words.&lt;|end|&gt;\\n"
              f"&lt;|user|&gt;{user_text}&lt;|end|&gt;\\n&lt;|assistant|&gt;")
    out = llm(prompt, max_tokens=80, stop=["&lt;|end|&gt;"], temperature=0.6)
    return out["choices"][0]["text"].strip()

def speak(text):
    """TTS'i hoparlöre stream et."""
    with sd.OutputStream(samplerate=voice.config.sample_rate, channels=1, dtype="int16") as out:
        for chunk in voice.synthesize_stream_raw(text):
            out.write(np.frombuffer(chunk, dtype=np.int16))

while True:
    print("Listening...")
    audio = capture_until_silence()
    text = whisper.transcribe(audio.astype(np.float32))[0].text.strip()
    print(f"USER: {text}")
    if not text or text.lower() in ("exit", "stop"): break
    reply = respond(text)
    print(f"ASSISTANT: {reply}")
    speak(reply)
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>sounddevice</code> aracılığıyla küçük bir ring buffer ile 16kHz mono mikrofon stream'i açar — 16kHz Whisper'ın yerel örnekleme oranıdır ve mono ASR için yeterlidir. 2) Sürekli chunk'ları CPU'da çalışan Silero VAD'a (1.8MB ONNX modeli) besler, bu "konuşma başlangıç/bitiş" zaman damgaları döndürür; <code>get_speech_timestamps</code> eşiği (tipik 0.5) kelime ortasında kesilme ile sessizlikten sonra çok beklemeyi takas eder. 3) VAD konuşma sonunu bildirdiğinde, buffer'daki sesi (tipik 3-10s) pywhispercpp wrapper'ı aracılığıyla whisper.cpp'ye besler — Whisper-Tiny.en, Pi 5'te ~3s sesi ~200ms'de transkribe eder (NEON-hızlandırılmış INT8 GGML kernel'leri). 4) Sonuç metnini Phi-3-mini Q4_K_M çalıştıran llama.cpp'ye gönderir; tipik <code>n_predict=80</code> ile ilk-token gecikmesi ~250ms ve 80-token cevap llama-cpp-python'ın <code>generate</code>'si aracılığıyla Pi 5 ARM çekirdeklerinde ~400ms'de biter. 5) Cevap metnini Piper-TTS (hafif CPU neural TTS, Piper Hub'da ~30 ses modeli) aracılığıyla stream eder ve elde edilen sesi sounddevice aracılığıyla parça parça çalar — ilk ses LLM decode başladıktan ~150ms sonra duyulur, "konuşma bıraktı"dan "ilk kelime duyuldu"ya ~0.9-1.3s toplam süre verir.</p>

<p class="l-text">Kabaca 60 satır Python. Bir Pi 5'te, "kullanıcı konuşmayı bırakır" ile "TTS'in ilk kelimesi duyulur" arasındaki uçtan-uca gecikme 0.9–1.3s'dir. Telefon-sınıfı hızlı değil, ama $80'lık donanımda kullanılabilir bir çevrimdışı ses asistanı.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. iPhone Build — Apple Neural Engine Yolu</h2>
<p class="l-text">iPhone'da aynı dört aşamalı pipeline, ASR için Neural Engine'e ve LLM için sistem Foundation Model'ine vurarak Apple-yerel bileşenlere eşlenir. Toplam süre: ~410ms.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAD: AVAudioEngine + Apple Speech</div><div class="card-body">Apple'ın <code>SFSpeechRecognizer</code>'ı yerleşik endpointing'e sahiptir. Custom VAD için, CoreML aracılığıyla Silero ONNX çalıştırın.</div></div>
<div class="calc-card"><div class="card-title">ASR: WhisperKit</div><div class="card-body">argmax-inc/WhisperKit — Apple Neural Engine'de çalışan CoreML'e derlenmiş Whisper. 3s ses için Whisper-Tiny.en ~80ms. WhisperKit'in mlmodelc paketi Swift Package Manager aracılığıyla gönderilir.</div></div>
<div class="calc-card"><div class="card-title">LLM: Apple Foundation Model (iOS 18+)</div><div class="card-body">Foundation Models framework aracılığıyla açığa çıkarılan ~3B model. Üçüncü taraf LLM'lerden daha düşük gecikme (uygulama tarafı ağırlık yüklemesi yok; sistem servisi warmup'ları). Veya tam kontrol için llama.cpp Swift wrapper aracılığıyla Phi-3-mini.gguf kullanın.</div></div>
<div class="calc-card"><div class="card-title">TTS: AVSpeechSynthesizer</div><div class="card-body">Sistem TTS, ücretsiz, çok dilli, ~50ms ilk-parça gecikmesi. Daha yüksek kalite için Piper-Swift port'u (CPU üzerinde çalışır) veya bir CoreML nöral TTS kullanın.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>SWIFT (DEMO — iOS pipeline taslağı)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// VoiceAssistant.swift — WhisperKit + Foundation Models + AVSpeechSynthesizer kullanan üst düzey pipeline
import WhisperKit
import FoundationModels   // iOS 18 Apple Intelligence
import AVFoundation

let whisper = try await WhisperKit(model: "openai_whisper-tiny.en")
let llm     = try await SystemLanguageModel.default
let tts     = AVSpeechSynthesizer()

func handle(audio: [Float]) async throws {
    // 1. ASR (ANE'de Whisper — ~80 ms)
    let result = try await whisper.transcribe(audioArray: audio)
    let userText = result.text
    print("USER: \\(userText)")

    // 2. LLM (Apple Foundation Model — ~200 ms ilk token)
    let session = LanguageModelSession(model: llm,
        instructions: "You are a brief offline voice assistant. Reply in &lt;= 25 words.")
    let stream = session.streamResponse(to: userText)
    var reply = ""
    for try await token in stream {
        reply += token
    }
    print("ASSISTANT: \\(reply)")

    // 3. TTS (AVSpeechSynthesizer — ~80 ms ilk parça)
    let utt = AVSpeechUtterance(string: reply)
    utt.voice = AVSpeechSynthesisVoice(language: "en-US")
    tts.speak(utt)
}
</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>WhisperKit(model: "openai_whisper-tiny.en")</code>, CoreML-derlenmiş Whisper-Tiny.en bundle'ını yükler — argmax-inc'in Whisper'ın encoder + decoder'ını .mlmodelc'ye derleyen port'u, böylece CPU'da değil Apple Neural Engine'de çalışırlar; sonuç 3s ses için ~80ms çıkarım, CPU'da ~350ms'ye karşı. 2) <code>SystemLanguageModel.default</code> (Foundation Models framework, iOS 18+), sistem-paketli ~3B foundation modeline bir oturum açar — uygulama tarafı ağırlık yüklemesi yok çünkü model tüm Apple Intelligence uygulamaları arasında paylaşılır; sıcak çağrılar ~70ms ilk-token gecikmesinde token döndürür. 3) Yakalanan ses buffer'ı WhisperKit'in <code>.transcribe(audio:)</code>'sına gönderilir, metin + zaman damgaları + güven döndürür — hepsi ANE'de çalışır, böylece CPU ses oturumu için serbest kalır. 4) <code>llm.respond(to: text)</code>, sistem foundation modelini sistemin uyguladığı chat template ile çalıştırır (manuel prompt mühendisliği gerekmez); iPhone 15 Pro'da cevap metni toplam ~150ms'de geri gelir. 5) Cevabı en-US ses ile <code>AVSpeechUtterance</code>'a sarar ve <code>tts.speak()</code>; AVSpeechSynthesizer sistem TTS'idir — ilk ses parçasına ~50ms, ayrılmış bir ses thread'inde çalışır. "Konuşma bıraktı"dan "ilk kelime duyuldu"ya uçtan-uca ~410ms, kullanıcıların "anlık konuşma" olarak algıladığı 500ms eşiğinin altında.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tarayıcı Varyantı — Transformers.js + WebLLM + Web Speech</h2>
<p class="l-text">Aynı mimari, Chrome tab'ında dört aşamanın hepsi. Yerelden biraz daha yavaş (410ms yerine ~700ms) ama kurulum olmadan URL olarak dağıtılabilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAD</div><div class="card-body">onnxruntime-web aracılığıyla Silero VAD ONNX (Transformers.js bunu sarar). 30ms karesi başına ~5ms.</div></div>
<div class="calc-card"><div class="card-title">ASR</div><div class="card-body">WebGPU aracılığıyla Transformers.js Whisper-Tiny. M2 MacBook'ta 3s ses için ~200ms. 2026'da streaming varyantları.</div></div>
<div class="calc-card"><div class="card-title">LLM</div><div class="card-body">Phi-3-mini-WebGPU build'i ile WebLLM. M2'de ~25 tok/s decode; 2024 Snapdragon dizüstüde ~10 tok/s. İlk-token ~150ms.</div></div>
<div class="calc-card"><div class="card-title">TTS</div><div class="card-body">Web Speech API (tarayıcı-yerel, ama Chrome desktop'ta bulut) VEYA WASM'a derlenmiş Piper (tamamen çevrimdışı, ~80MB indirme). Ödünleşim: kolaylık vs çevrimdışı bütünlük.</div></div>
</div>

<p class="l-text">Gerçek bir demo: <code>chat.webllm.ai</code> WebLLM Phi-3-mini sohbeti gösterir. Girdi için Transformers.js Whisper ve çıktı için Piper-WASM ekleyerek tam çevrimdışı tarayıcı ses asistanını elde edersiniz. Toplam ağırlık: ~3GB, ilk yüklemeden sonra cache'lenir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Profileme — Milisaniyeler Nereye Gidiyor</h2>
<p class="l-text">Çalıştığında, her aşamayı profilleyin ve en çok kazandıran ayarı belirleyin. Gerçek üretim ayarlama oturumlarından tipik 2026 rakamları:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAD ek yükü — genellikle görünmez</div><div class="card-body">3–10ms. VAD &gt;20ms ise bir hatanız var — muhtemelen modeli bir kez yerine çağrı başına yüklüyorsunuz.</div></div>
<div class="calc-card"><div class="card-title">ASR — ilk-token vs tam transkripsiyon</div><div class="card-body">Streaming Whisper (Whisper-Streaming, faster-whisper-streaming) her 200ms'de bir kısmi transkript verir. LLM'i başlatmak için konuşma sonunu beklemek yerine bunu kullanın.</div></div>
<div class="calc-card"><div class="card-title">LLM — ilk-token gecikmesi hakim</div><div class="card-body">Sistem prompt'u + kullanıcı sorgusunun prefill'i, uzunluğa bağlı olarak ~50–200ms alır. Tur'lar arası KV cache yeniden kullanımı, çok turlu diyaloglarda ~%80 tasarruf sağlar. Her zaman session'ı yeniden kullanın.</div></div>
<div class="calc-card"><div class="card-title">TTS — ilk cümleyi mümkün olduğunca erken konuş</div><div class="card-body">LLM'in 25 kelimelik yanıtını bitirmesini beklemeyin. Her LLM token'ını, ilk cümleden sonra konuşmaya başlayan bir streaming TTS'ye boruyla bağlayın. Bu tek hile algılanan gecikmeyi 200–400ms azaltır.</div></div>
<div class="calc-card"><div class="card-title">Büyük kazanım — interleaving</div><div class="card-body">Seri olarak VAD → ASR → LLM → TTS naiftir. ASR partial'larını LLM'e stream edin, LLM token'larını TTS'ye stream edin, LLM bitirmeden önce playback'i başlatın. Uçtan-uca algılanan gecikmeyi %50+ azaltır.</div></div>
</div>

<div class="calc-highlight"><strong>Üretim kuralı:</strong> kullanıcıların hissettiği metrik latency-to-first-audio'dur, toplam gidiş-dönüş değil. Bunun için optimize edin — ve Raspberry Pi'de bile gönderebilirsiniz.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pratik — Bir NumPy Capstone Surrogate</h2>
<p class="l-text">Sadece sklearn ve NumPy kullanarak tüm pipeline'ın çalıştırılabilir bir proxy'si. Ses özellikleri → "ASR" (simüle edilmiş transkriptler üzerinde TF-IDF nearest neighbor) → "LLM" (önceden hazırlanmış bir yanıt seçen LogReg classifier) → "TTS" (ses uzunluğu bütçesini döndürür). Gerçek bir LLM değil, ama pipeline şekli aynı.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics.pairwise import cosine_similarity
import time

# --- Aşama 1: VAD (proxy: sahte ses dizisinde enerji eşiği)
def vad(audio, threshold=0.02):
    energy = np.sqrt(np.mean(audio**2))
    return energy &gt; threshold

# --- Aşama 2: ASR (proxy: küçük bir "transcript bank" üzerinde nearest-neighbor)
transcript_bank = [
    "what is the weather today",
    "set a five minute timer",
    "play some music",
    "what time is it",
    "tell me a joke",
    "remind me to buy bread",
    "how far is the moon",
    "who won the world cup",
]
vec = TfidfVectorizer().fit(transcript_bank)
def asr(audio):
    # Sesten 16-dim özellik çıkardığımızı varsay. En yakın transcript'e projekte et.
    feat = np.abs(np.fft.rfft(audio)[:16])  # ham spektral özellik
    feat = feat / (feat.sum() + 1e-9)
    # Sahte özelliği hash ile bir transcript'e eşle — sadece demo için
    idx = int(feat.argmax()) % len(transcript_bank)
    return transcript_bank[idx]

# --- Aşama 3: "LLM" (proxy: bir yanıt kategorisi seçen LogReg classifier)
training_pairs = [
    ("what is the weather today",       "It's sunny and 22 degrees Celsius."),
    ("set a five minute timer",         "Timer set for 5 minutes."),
    ("play some music",                 "Playing your jazz playlist."),
    ("what time is it",                 "It's 14 hundred 30."),
    ("tell me a joke",                  "Why don't scientists trust atoms? They make up everything."),
    ("remind me to buy bread",          "I'll remind you to buy bread."),
    ("how far is the moon",             "About 384 thousand kilometers."),
    ("who won the world cup",           "Argentina won the 2022 World Cup."),
]
queries = [p[0] for p in training_pairs]
replies = [p[1] for p in training_pairs]
Q = vec.transform(queries)
clf = LogisticRegression(max_iter=500).fit(Q, np.arange(len(replies)))
def llm(text):
    x = vec.transform([text])
    idx = clf.predict(x)[0]
    return replies[idx]

# --- Aşama 4: "TTS" (proxy: simüle edilmiş konuşma süresi)
def tts(text):
    n_words = len(text.split())
    return n_words / 3.0  # saniyede ~3 kelime

# --- Pipeline
def pipeline(audio):
    timings = {}
    t = time.perf_counter()
    if not vad(audio):
        return None, {"vad_ms": (time.perf_counter()-t)*1000, "skipped": True}
    timings["vad_ms"] = (time.perf_counter()-t)*1000

    t = time.perf_counter()
    text = asr(audio)
    timings["asr_ms"] = (time.perf_counter()-t)*1000

    t = time.perf_counter()
    reply = llm(text)
    timings["llm_ms"] = (time.perf_counter()-t)*1000

    t = time.perf_counter()
    tts_seconds = tts(reply)
    timings["tts_ms"] = (time.perf_counter()-t)*1000  # üretim süresi, playback değil
    timings["playback_s"] = tts_seconds

    return (text, reply), timings

# Bir "session" çalıştır
np.random.seed(0)
fake_audio = 0.1 * np.random.randn(16000 * 3)  # 3 saniye
out, t = pipeline(fake_audio)
if out:
    print(f"USER said:      {out[0]}")
    print(f"ASSISTANT said: {out[1]}")
    print(f"Stage timings:  {t}")
    total_ms = t["vad_ms"]+t["asr_ms"]+t["llm_ms"]+t["tts_ms"]
    print(f"Pipeline total (excl playback): {total_ms:.2f} ms")
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Üretim pipeline'ı ile 1-e-1 eşleşen dört aşama tanımlar: VAD (ses dizisinde enerji eşiği — üretim Silero kullanır), ASR (canned transkriptler üzerinde TF-IDF + nearest-neighbor — üretim Whisper-Tiny kullanır), LLM (canned reply id seçen LogReg — üretim Phi-3-mini kullanır), TTS (beklenen konuşma süresi döndürür — üretim Piper/AVSpeechSynthesizer kullanır). 2) <code>asr</code> aşaması, ses "özellik vektörü"ne en yakın canned transkripti seçmek için <code>TfidfVectorizer.transform</code> + cosine similarity kullanır — nearest-neighbor lookup'ları ile aynı retrieval deseni, sadece sahte özelliklerde. 3) <code>llm</code> aşaması, (transkript → reply-id) çiftleri üzerinde bir LogReg sınıflandırıcı eğitir ve çalıştırma zamanında cevabı tahmin eder — canned-reply deseni, LLM'lerden önce erken intent-tabanlı asistanların (Siri 2011-2018) tam olarak yaptığı şeydir ve hala düşük gecikmeli gömülü kullanım durumları için üretim mimarisidir. 4) <code>pipeline</code> fonksiyonu her aşama etrafında <code>perf_counter</code> zaman damgaları kaydeder ve hem (metin, cevap) sonucunu hem zamanlama dict'ini döndürür — bu, üretimde hangi aşamayı optimize edeceğini bulmak için gereken aynı enstrümantasyon desenidir. 5) Tüm pipeline'ı 3 saniyelik sahte ses dizisinde çalıştırır ve aşama-bazlı zamanlamaları yazdırır — surrogate aşamaları önemsiz olduğu için ms-altı, ama zamanlama dict'inin yapısı gerçek bir Pi-tabanlı asistanı profillerken göreceğinizle eşleşir: VAD = ~5ms, ASR = ~200ms, LLM = ~400ms, TTS ilk-chunk = ~80ms.</p>

<p class="l-text">Surrogate önemsiz olduğu için rakamlar milisaniyenin altında olacak. Mesele <em>yapıdır</em>: bağımsız olarak profillenmiş, stream edilebilen dört aşama. Her birini gerçek modeliyle değiştirin ve yukarıda çalışan pipeline'ı elde edersiniz.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. 2026'da Üç Mimari Seçimi</h2>
<p class="l-text">Üretimde, "tamamen çevrimdışı" nadiren tek seçenektir. Üç mimari vardır ve kullanım durumuna göre seçersiniz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tamamen cihaz-üstü</div><div class="card-body">Her şey yerel. Tam gizlilik, sıfır devam eden maliyet, çevrimdışı çalışır. Yetenek tavanı 1–4B modelin yapabileceği şeydir (~%80 "kolay" asistan sorgusu). Şunlar için kullanılır: tıbbi dikte, gazeteci araçları, araç içi asistanlar, çocuk cihazları.</div></div>
<div class="calc-card"><div class="card-title">Cihaz-üstü-öncelikli bulut fallback ile</div><div class="card-body">Yerel Phi-3-mini'yi dene; güven düşükse veya sorgu dünya bilgisi gerektiriyorsa, GPT-4 / Claude / Gemini Pro'ya yönlendir. Apple Intelligence + Private Cloud Compute tam olarak budur. Genel olarak en iyi UX.</div></div>
<div class="calc-card"><div class="card-title">Hibrit split inference</div><div class="card-body">Bazı katmanlar cihaz-üstü, bazıları bulutta. Umut verici araştırma yönü (split-LLM, federe çıkarım için Petals); henüz mainstream üretim değil.</div></div>
</div>

<div class="calc-highlight"><strong>Kullanım durumuna göre seçim:</strong> tıbbi/hukuki/gazeteci → tamamen cihaz-üstü. Tüketici asistanı → cihaz-üstü-öncelikli bulut fallback ile. Frontier model serving → sadece-bulut (edge ML'in doğru araç olmadığı 7. ve en nadir durum).</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Bunu Sonra Nereye Götürmeli</h2>
<p class="l-text">Çalışan bir çevrimdışı ses asistanı gönderdiniz. Düşünmeye değer üç ürünleştirme yönü:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Wake-word + her zaman açık</div><div class="card-body">"Hey Pi" tespiti için openWakeWord veya Porcupine ekleyin. ~200KB model 7/24 %3 CPU'da çalışır. Sadece aktivasyonda pipeline'ın geri kalanını tetikler.</div></div>
<div class="calc-card"><div class="card-title">Tool-using agent (agents-L9)</div><div class="card-body">LLM'i bir tool döngüsünde sarın. Yerel araçlar: takvim oku, zamanlayıcılar ayarla, akıllı evi kontrol et, kişisel belgelerin vektör DB'sini sorgula. Şimdi çevrimdışı asistanınız gerçekten <em>bir şeyler yapıyor</em>.</div></div>
<div class="calc-card"><div class="card-title">Federe kişiselleştirme</div><div class="card-body">Anonimleştirilmiş "kullanıcı bu cevaptan sonra yeniden formüle etti mi?" sinyallerini topla; her gece yerel bir LoRA adapter'ını federe-eğit. Asistan, sesiniz cihazdan asla ayrılmadan <em>sizin</em> sesinizi ve <em>sizin</em> deyimlerinizi anlamada daha iyi olur. Edge ML'in tam çemberi.</div></div>
</div>

<p class="l-text">Bu, Edge ML &amp; On-Device track'idir. Sekiz ders, bir çalışan ses asistanı. Donanım eşiği geçti; yazılım yığını olgunlaştı; gizlilik ve gecikme kazançları gerçektir. Tüketici ML'inin sonraki 5 yılı çoğunlukla cihazda olur — ve şimdi oraya göndermek için araç setine sahipsiniz.</p>
</div>`
};
