window.AUDIO_L8 = {

en: `<p class="l-text"><strong>Real-time speech is the gap between a demo and a product.</strong> A model that takes 4 seconds per inference is fine for an offline transcription job, useless for a live conversation. Production audio is mostly about engineering: streaming inference, voice activity detection, ONNX export, quantization for edge deployment, audio codec choice, and the dozens of small decisions that turn a 50% prototype into something a user actually wants to use.</p>

<p class="l-text">This lesson covers streaming vs batch processing, latency budgets and chunking strategies, ONNX export and quantization for Whisper, voice activity detection with silero-vad, audio codec selection (Opus for streaming), privacy implications of on-device vs cloud inference, and ends with a production-grade real-time transcription mini-project. By the end you can ship audio products, not just notebooks.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compare streaming and batch ASR by latency, throughput, and complexity</li>
<li>Implement sliding-window chunking with overlap to keep partials accurate</li>
<li>Export Whisper to ONNX and run it with onnxruntime for portable inference</li>
<li>Quantize Whisper to INT8 for edge deployment and measure size and quality</li>
<li>Ship a real-time transcription pipeline with silero-vad gating Whisper calls</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Streaming vs Batch Processing</h2>

<p class="l-text">Two completely different inference modes with very different engineering needs.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Batch</div><div class="compare-item">Process complete files</div><div class="compare-item">Optimize for throughput (clips/sec)</div><div class="compare-item">Whole audio fits in GPU memory</div><div class="compare-item">Use cases: podcast transcription, archive indexing, dataset building</div></div>
<div class="compare-col"><div class="compare-title">Streaming</div><div class="compare-item">Process audio as it arrives</div><div class="compare-item">Optimize for latency (ms first byte)</div><div class="compare-item">Sliding window over chunks</div><div class="compare-item">Use cases: voice agents, live captioning, telephony, real-time translation</div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Latency</div><div class="card-body">Time from user finishing speaking to system responding. Target: &lt; 1 second for natural conversation.</div></div>
<div class="calc-card"><div class="card-title">Throughput</div><div class="card-body">How many concurrent users / hours of audio per second. Maximize for batch.</div></div>
<div class="calc-card"><div class="card-title">Real-time factor</div><div class="card-body">Inference time divided by audio duration. RTF &lt; 1 means faster than real-time.</div></div>
<div class="calc-card"><div class="card-title">Time-to-first-token</div><div class="card-body">Critical for streaming TTS / streaming LLM. User hears something quickly even if full reply takes longer.</div></div>
<div class="calc-card"><div class="card-title">Chunking</div><div class="card-body">Process audio in fixed windows (e.g. 1-3 s). Trade off latency vs context.</div></div>
<div class="calc-card"><div class="card-title">Server placement</div><div class="card-body">For low latency: edge GPU close to user. For high throughput: centralized cluster.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Chunking and Sliding Windows</h2>

<p class="l-text">For streaming Whisper, you cannot wait for the whole utterance. Process in overlapping windows: each chunk is transcribed separately, then results merged. Chunk size and overlap are the key knobs.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Chunk size</div><div class="card-body">Length of each window. Whisper expects 30 s; faster-whisper supports any. Common: 5-10 s for streaming.</div></div>
<div class="calc-card"><div class="card-title">Overlap</div><div class="card-body">How much consecutive chunks share. Typical: 1-2 seconds. Helps preserve context across boundaries.</div></div>
<div class="calc-card"><div class="card-title">Latency</div><div class="card-body">User waits at least one chunk_size before getting first transcript. 5 s chunk = 5 s minimum delay.</div></div>
<div class="calc-card"><div class="card-title">Word boundary</div><div class="card-body">Cuts mid-word are fine; the model handles them. The merge step deduplicates the overlap region.</div></div>
<div class="calc-card"><div class="card-title">VAD-driven</div><div class="card-body">Smarter: chunk on natural silence boundaries from VAD. Avoids cutting mid-sentence.</div></div>
<div class="calc-card"><div class="card-title">Whisper-streaming</div><div class="card-body">Open-source library that wraps faster-whisper with a streaming interface.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install faster-whisper numpy</span>
<span class="kw">from</span> faster_whisper <span class="kw">import</span> WhisperModel
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> librosa

<span class="cm"># 1) faster-whisper: 4x faster than HF transformers, same accuracy</span>
model = <span class="fn">WhisperModel</span>(<span class="str">"small"</span>, device=<span class="str">"cuda"</span>, compute_type=<span class="str">"float16"</span>)

<span class="cm"># 2) Streaming inference over a long file with overlapping chunks</span>
<span class="kw">def</span> <span class="fn">streaming_transcribe</span>(audio_path, chunk_s=<span class="num">10.0</span>, overlap_s=<span class="num">2.0</span>):
    y, sr = librosa.<span class="fn">load</span>(audio_path, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
    chunk_samples = <span class="fn">int</span>(chunk_s * sr)
    overlap_samples = <span class="fn">int</span>(overlap_s * sr)
    step = chunk_samples - overlap_samples

    transcripts = []
    pos = <span class="num">0</span>
    chunk_idx = <span class="num">0</span>
    <span class="kw">while</span> pos &lt; <span class="fn">len</span>(y):
        chunk = y[pos: pos + chunk_samples]
        <span class="kw">if</span> <span class="fn">len</span>(chunk) &lt; sr:                  <span class="cm"># &lt;1 s of audio left, skip</span>
            <span class="kw">break</span>

        segments, info = model.<span class="fn">transcribe</span>(
            chunk, language=<span class="str">"en"</span>, vad_filter=<span class="kw">True</span>,
            beam_size=<span class="num">5</span>, no_speech_threshold=<span class="num">0.6</span>
        )

        text = <span class="str">" "</span>.<span class="fn">join</span>(s.text.<span class="fn">strip</span>() <span class="kw">for</span> s <span class="kw">in</span> segments)
        absolute_start = pos / sr
        <span class="fn">print</span>(f<span class="str">"[chunk {chunk_idx} @ {absolute_start:.1f}s] {text}"</span>)
        transcripts.<span class="fn">append</span>((absolute_start, text))

        pos += step
        chunk_idx += <span class="num">1</span>

    <span class="kw">return</span> transcripts

<span class="cm"># 3) Run it</span>
<span class="fn">streaming_transcribe</span>(<span class="str">"podcast.mp3"</span>, chunk_s=<span class="num">10.0</span>, overlap_s=<span class="num">2.0</span>)
<span class="cm"># [chunk 0 @ 0.0s] Welcome to the show. Today we are talking about
# [chunk 1 @ 8.0s] talking about audio engineering. The latency
# [chunk 2 @ 16.0s] latency budget for real-time speech is</span>

<span class="cm"># 4) Merging overlapping outputs: simple suffix/prefix dedup</span>
<span class="kw">def</span> <span class="fn">merge_overlap</span>(prev_text, new_text, overlap_words=<span class="num">5</span>):
    <span class="cm"># If the last \`overlap_words\` of prev appear at the start of new, deduplicate</span>
    <span class="kw">if</span> <span class="kw">not</span> prev_text:
        <span class="kw">return</span> new_text
    prev_tail = <span class="str">" "</span>.<span class="fn">join</span>(prev_text.<span class="fn">split</span>()[-overlap_words:])
    <span class="kw">if</span> new_text.<span class="fn">startswith</span>(prev_tail):
        <span class="kw">return</span> new_text[<span class="fn">len</span>(prev_tail):].<span class="fn">strip</span>()
    <span class="kw">return</span> new_text

merged = <span class="str">""</span>
<span class="kw">for</span> _, text <span class="kw">in</span> transcripts:
    merged += <span class="str">" "</span> + <span class="fn">merge_overlap</span>(merged, text, overlap_words=<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">"FULL:"</span>, merged.<span class="fn">strip</span>())</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">faster-whisper / CT2 are blocked. Stand-in: time a numpy STFT to feel the throughput angle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
import time
t0 = time.time()
for _ in range(10):
    signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
elapsed = time.time() - t0
print('10× STFT in', round(elapsed, 4), 's   (~', round(elapsed*100, 1), 'ms each)')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads <code>faster-whisper</code>, a CTranslate2-based reimplementation of Whisper that is roughly 4x faster than HF transformers with identical output. The default device is CUDA with fp16; on CPU use compute_type="int8". 2) Streaming over a long file: 10-second chunks with 2-second overlap (so the step is 8 seconds). At each step transcribe the chunk independently. 3) <code>vad_filter=True</code> tells faster-whisper to use silero-vad to skip silent regions inside the chunk -- big speedup on lecture/podcast audio with long pauses. 4) Merge overlapping transcripts: when consecutive chunks both saw the same words at the boundary, the simple suffix/prefix dedup removes the duplicate. More sophisticated approaches use confidence-weighted alignment.</p>

<div id="plot-al8-latency-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> End-to-end latency breakdown for a streaming voice agent. The bars show the time spent in each pipeline stage: VAD (10 ms), audio capture (chunk_s = 1000 ms), Whisper-small inference (~150 ms), LLM round-trip (~500 ms), TTS streaming first chunk (~250 ms), playback start (~50 ms). Total: ~1.96 s -- on the edge of natural feel. Cutting any stage by half noticeably improves perceived responsiveness.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ONNX Export for Whisper</h2>

<p class="l-text">ONNX (Open Neural Network Exchange) is a portable model format that decouples models from frameworks. Exporting Whisper to ONNX lets you run it with ONNX Runtime (faster than PyTorch on CPU, easier to embed in non-Python environments).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install optimum[onnxruntime]</span>
<span class="kw">from</span> optimum.onnxruntime <span class="kw">import</span> ORTModelForSpeechSeq2Seq
<span class="kw">from</span> transformers <span class="kw">import</span> WhisperProcessor
<span class="kw">import</span> librosa

<span class="cm"># 1) Export Whisper to ONNX (one-time, ~5 minutes)</span>
<span class="cm"># Saves encoder.onnx, decoder.onnx, decoder_with_past.onnx + tokenizer files</span>
model_id = <span class="str">"openai/whisper-small"</span>
ORTModelForSpeechSeq2Seq.<span class="fn">from_pretrained</span>(
    model_id, export=<span class="kw">True</span>
).<span class="fn">save_pretrained</span>(<span class="str">"whisper-small-onnx"</span>)

<span class="cm"># 2) Load the ONNX version</span>
processor = WhisperProcessor.<span class="fn">from_pretrained</span>(<span class="str">"whisper-small-onnx"</span>)
model = ORTModelForSpeechSeq2Seq.<span class="fn">from_pretrained</span>(<span class="str">"whisper-small-onnx"</span>)

<span class="cm"># 3) Inference -- same API as the PyTorch version</span>
y, _ = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">processor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>)

<span class="kw">import</span> time
t0 = time.<span class="fn">time</span>()
ids = model.<span class="fn">generate</span>(inputs.input_features, max_new_tokens=<span class="num">100</span>)
<span class="fn">print</span>(<span class="str">"ONNX took:"</span>, time.<span class="fn">time</span>() - t0, <span class="str">"s"</span>)
text = processor.<span class="fn">batch_decode</span>(ids, skip_special_tokens=<span class="kw">True</span>)[<span class="num">0</span>]
<span class="fn">print</span>(text)

<span class="cm"># 4) For mobile/embedded: convert to ORT format with int8 quantization</span>
<span class="kw">from</span> optimum.onnxruntime <span class="kw">import</span> ORTQuantizer
<span class="kw">from</span> optimum.onnxruntime.configuration <span class="kw">import</span> AutoQuantizationConfig

quantizer = ORTQuantizer.<span class="fn">from_pretrained</span>(<span class="str">"whisper-small-onnx"</span>, file_name=<span class="str">"encoder_model.onnx"</span>)
qconfig = AutoQuantizationConfig.<span class="fn">avx512_vnni</span>(is_static=<span class="kw">False</span>, per_channel=<span class="kw">True</span>)
quantizer.<span class="fn">quantize</span>(save_dir=<span class="str">"whisper-small-onnx-int8"</span>, quantization_config=qconfig)

<span class="cm"># Result: ~3x smaller model, ~2-3x faster on CPU, &lt; 1% accuracy drop</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">ONNX export is blocked; the equivalent is sklearn → joblib (a portable predictor).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
import io, pickle
rng = np.random.default_rng(0)
X, y = rng.standard_normal((100, 16)), (rng.standard_normal(100) &gt; 0).astype(int)
clf = LogisticRegression().fit(X, y)
buf = pickle.dumps(clf)
print('Serialized model size:', len(buf), 'bytes')
loaded = pickle.loads(buf)
print('Round-trip accuracy preserved:', loaded.score(X, y) == clf.score(X, y))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>optimum</code> wraps the conversion to ONNX. Whisper has three subgraphs: encoder, decoder (first step), decoder_with_past (subsequent steps using KV cache). All exported automatically. 2) Loading the ONNX checkpoint mirrors the HF API exactly -- you can drop in <code>ORTModelForSpeechSeq2Seq</code> wherever you had <code>WhisperForConditionalGeneration</code>. 3) Inference is identical to PyTorch. ONNX wins on CPU (often 2x) and ties on GPU. The big advantage is portability -- ONNX Runtime runs on Linux, Windows, macOS, iOS, Android, browser (WASM). 4) Quantization to int8 cuts the model 4x in size and roughly 2-3x in CPU latency. Whisper-small int8 ONNX is ~70 MB and runs on a phone CPU at near real-time. The optimum library wraps the calibration/quantization pipeline.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: Whisper on iPhone</div><div class="example-body">whisper.cpp ports Whisper to C++ with ggml/llama.cpp-style quantization. The 4-bit version of whisper-base runs on an iPhone 14 in real-time, &lt; 100 MB of RAM, no internet. This is the actual implementation behind the Whisper-based features in many iOS apps and Apple's own dictation. Tradeoff: ~5% accuracy drop vs the fp16 reference, but everything is on-device.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Quantization for Edge Deployment</h2>

<p class="l-text">Modern audio models are large. Whisper-small is 244M params (~1 GB fp32). Running on phone or embedded hardware requires aggressive quantization.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">fp32</div><div class="card-body">Original. 4 bytes/param. Reference quality.</div></div>
<div class="calc-card"><div class="card-title">fp16</div><div class="card-body">2 bytes/param. Negligible accuracy loss. Default for GPU inference.</div></div>
<div class="calc-card"><div class="card-title">int8</div><div class="card-body">1 byte/param. ~1-2% WER increase. 2x speedup on CPUs with VNNI/AVX512.</div></div>
<div class="calc-card"><div class="card-title">int4</div><div class="card-body">0.5 bytes/param via packing. ~3-5% WER increase. Used by whisper.cpp Q4_K_M.</div></div>
<div class="calc-card"><div class="card-title">Dynamic quantization</div><div class="card-body">Quantize weights, leave activations fp32. Easy, modest gains.</div></div>
<div class="calc-card"><div class="card-title">Static quantization</div><div class="card-body">Quantize both weights and activations. Calibrate on representative data. Best speed.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Three quantization paths for Whisper</span>

<span class="cm"># Path 1: PyTorch dynamic quantization (simple, CPU only)</span>
<span class="kw">import</span> torch
<span class="kw">from</span> transformers <span class="kw">import</span> WhisperForConditionalGeneration

model = WhisperForConditionalGeneration.<span class="fn">from_pretrained</span>(<span class="str">"openai/whisper-small"</span>)
quantized = torch.quantization.<span class="fn">quantize_dynamic</span>(
    model, {torch.nn.Linear}, dtype=torch.qint8
)
<span class="fn">print</span>(<span class="str">"size MB:"</span>, <span class="fn">sum</span>(p.numel() * p.element_size() <span class="kw">for</span> p <span class="kw">in</span> quantized.<span class="fn">parameters</span>()) / <span class="num">1e6</span>)

<span class="cm"># Path 2: bitsandbytes 8-bit / 4-bit (GPU, easy with HF)</span>
<span class="kw">from</span> transformers <span class="kw">import</span> WhisperForConditionalGeneration, BitsAndBytesConfig

quant_config = <span class="fn">BitsAndBytesConfig</span>(
    load_in_4bit=<span class="kw">True</span>,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_quant_type=<span class="str">"nf4"</span>,
)
model_4bit = WhisperForConditionalGeneration.<span class="fn">from_pretrained</span>(
    <span class="str">"openai/whisper-large-v3"</span>,
    quantization_config=quant_config,
    device_map=<span class="str">"auto"</span>,
)
<span class="cm"># Whisper-large-v3 in 4-bit fits on an 8 GB GPU</span>

<span class="cm"># Path 3: whisper.cpp - C++ inference with ggml quantization</span>
<span class="cm"># Use the ggml-tiny.bin / ggml-small.bin / ggml-large-v3.bin checkpoints</span>
<span class="cm"># See https://github.com/ggerganov/whisper.cpp for build instructions</span>

<span class="cm"># From Python you can call whisper.cpp via subprocess or pywhispercpp</span>
<span class="cm"># pip install pywhispercpp</span>
<span class="kw">from</span> pywhispercpp.model <span class="kw">import</span> Model

m = <span class="fn">Model</span>(<span class="str">"small"</span>, n_threads=<span class="num">8</span>)         <span class="cm"># Loads ggml-small.bin, q5_K quantized

# Inference is faster than fp32 PyTorch on the same hardware</span>
segments = m.<span class="fn">transcribe</span>(<span class="str">"speech.wav"</span>)
<span class="kw">for</span> s <span class="kw">in</span> segments:
    <span class="fn">print</span>(s.t0, s.t1, s.text)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Quantization in numpy: float32 weights → int8 → reconstruct, measure error.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
w = rng.standard_normal(10000).astype(np.float32)
scale = np.max(np.abs(w)) / 127
q = np.round(w / scale).astype(np.int8)
wq = q.astype(np.float32) * scale
err = float(np.mean((w - wq) ** 2))
print('FP32 size:', w.nbytes, 'bytes')
print('INT8 size:', q.nbytes, 'bytes  (', round(w.nbytes/q.nbytes, 1), '× smaller)')
print('MSE      :', round(err, 8))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Path 1: PyTorch dynamic quantization is one line and works on CPU. Decent speedup but not the best. 2) Path 2: bitsandbytes provides high-quality 4-bit and 8-bit quantization for GPU inference, popular in the LLM world and applicable to Whisper too. NF4 (normal float 4) is the recommended quant_type for transformer weights. Whisper-large-v3 in 4-bit fits in 8 GB VRAM. 3) Path 3: whisper.cpp is the gold standard for edge deployment. It rewrites Whisper inference in pure C++ with ggml's custom quantization (Q4_K_M, Q5_K_M, etc), which is more accurate than naive int4 and tuned for ARM/x86 SIMD. <code>pywhispercpp</code> exposes it through Python; for production you embed the C++ directly. 4) The accuracy/size/speed Pareto frontier varies by hardware; benchmark your target device.</p>

<div class="l-warn"><strong>Quantization caveat:</strong> Whisper's encoder is more sensitive to quantization than the decoder. If you see WER jumping by 5%+, consider keeping the encoder fp16 and only quantizing the decoder. Many production setups use mixed precision: fp16 encoder + int8 decoder.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Voice Activity Detection in Production</h2>

<p class="l-text">VAD (covered briefly in L7) is the unsung hero of real-time audio. It distinguishes silence from speech, enables turn-taking, gates expensive ASR calls, and saves bandwidth in streaming.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">silero-vad</div><div class="card-body">SOTA neural VAD. ~1 MB ONNX model, real-time on CPU, 95%+ F1 across languages.</div></div>
<div class="calc-card"><div class="card-title">webrtcvad</div><div class="card-body">Classic GMM-based VAD from WebRTC. Lightweight, OK accuracy. Good for embedded.</div></div>
<div class="calc-card"><div class="card-title">Energy-based</div><div class="card-body">Threshold on RMS amplitude. Fast but fails in noise. Use only as fallback.</div></div>
<div class="calc-card"><div class="card-title">Window size</div><div class="card-body">silero processes 30 ms windows. Decisions are smoothed over multiple windows.</div></div>
<div class="calc-card"><div class="card-title">min_silence_duration_ms</div><div class="card-body">Don't trigger end-of-turn until N ms of silence. Tunable: 200ms aggressive, 700ms relaxed.</div></div>
<div class="calc-card"><div class="card-title">VAD-aware ASR</div><div class="card-body">Skip silent regions before sending to Whisper. 30-50% speedup on real-world audio.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install silero-vad numpy onnxruntime</span>
<span class="kw">import</span> torch
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> silero_vad <span class="kw">import</span> load_silero_vad, get_speech_timestamps, VADIterator

<span class="cm"># 1) Offline use: get speech segments from a recording</span>
model = <span class="fn">load_silero_vad</span>()
y, sr = <span class="fn">read_audio</span>(<span class="str">"long.wav"</span>, sampling_rate=<span class="num">16000</span>)
ts = <span class="fn">get_speech_timestamps</span>(y, model, threshold=<span class="num">0.5</span>,
                            min_speech_duration_ms=<span class="num">250</span>,
                            min_silence_duration_ms=<span class="num">200</span>,
                            sampling_rate=<span class="num">16000</span>)
<span class="kw">for</span> t <span class="kw">in</span> ts:
    <span class="fn">print</span>(f<span class="str">"speech: {t['start']/16000:.2f}-{t['end']/16000:.2f} s"</span>)

<span class="cm"># 2) Streaming use: real-time VAD iterator</span>
<span class="cm"># Feed it 30 ms (480 samples at 16 kHz) frames; get per-frame speech probability</span>
vad = <span class="fn">VADIterator</span>(model, threshold=<span class="num">0.5</span>, sampling_rate=<span class="num">16000</span>,
                   min_silence_duration_ms=<span class="num">500</span>)

<span class="kw">def</span> <span class="fn">process_stream</span>(microphone):
    speech_buffer = []
    <span class="kw">for</span> chunk <span class="kw">in</span> microphone:                  <span class="cm"># 30 ms each</span>
        speech_dict = <span class="fn">vad</span>(chunk, return_seconds=<span class="kw">True</span>)
        <span class="kw">if</span> speech_dict <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
            <span class="kw">if</span> <span class="str">"start"</span> <span class="kw">in</span> speech_dict:
                <span class="fn">print</span>(<span class="str">"speech started at"</span>, speech_dict[<span class="str">"start"</span>])
            <span class="kw">if</span> <span class="str">"end"</span> <span class="kw">in</span> speech_dict:
                <span class="fn">print</span>(<span class="str">"speech ended at"</span>, speech_dict[<span class="str">"end"</span>])
                <span class="cm"># Now ASR the buffered speech</span>
                <span class="fn">trigger_asr</span>(np.<span class="fn">concatenate</span>(speech_buffer))
                speech_buffer = []
        speech_buffer.<span class="fn">append</span>(chunk)

<span class="cm"># 3) VAD-aware ASR: filter silence before transcription</span>
<span class="kw">def</span> <span class="fn">asr_with_vad</span>(audio, asr_model):
    <span class="cm"># Find speech segments</span>
    ts = <span class="fn">get_speech_timestamps</span>(audio, model, sampling_rate=<span class="num">16000</span>)
    transcripts = []
    <span class="kw">for</span> t <span class="kw">in</span> ts:
        seg = audio[t[<span class="str">"start"</span>]: t[<span class="str">"end"</span>]]
        text = asr_model.<span class="fn">transcribe</span>(seg)
        transcripts.<span class="fn">append</span>((t[<span class="str">"start"</span>] / <span class="num">16000</span>, text))
    <span class="kw">return</span> transcripts</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Streaming VAD: accumulate audio in chunks, gate by RMS energy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
chunk = 1600                                  # 100 ms
active_count, total = 0, 0
for i in range(0, len(audio), chunk):
    seg = audio[i:i+chunk]
    rms = float(np.sqrt(np.mean(seg ** 2)))
    is_voice = rms &gt; 0.05
    if is_voice:
        active_count += 1
    total += 1
print(f'Voiced chunks: {active_count} / {total} ({100*active_count/total:.0f}%)')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Offline VAD: <code>get_speech_timestamps</code> takes a whole audio clip and returns speech spans. The thresholds let you tune sensitivity. 2) Streaming VAD: <code>VADIterator</code> processes 30 ms chunks and emits start/end events as speech transitions in/out. This is the right API for real-time agents. 3) VAD-aware ASR: instead of transcribing the whole recording, transcribe each speech segment separately. Big savings on long files with mostly silence (e.g. lectures, meetings, surveillance). 4) silero-vad runs at >100x real-time on a single CPU thread, so the cost of running it everywhere is negligible.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Audio Codecs for Streaming</h2>

<p class="l-text">When you send audio over a network, raw 16 kHz PCM is wasteful (256 kbps mono). Codec choice matters: it changes bandwidth, latency, robustness to packet loss, and ASR accuracy.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">PCM (raw)</div><div class="compare-item">256 kbps at 16 kHz int16</div><div class="compare-item">Lossless, simple</div><div class="compare-item">No latency</div><div class="compare-item">Use for local IPC, file storage</div></div>
<div class="compare-col"><div class="compare-title">MP3</div><div class="compare-item">128 kbps standard</div><div class="compare-item">Lossy, decent quality</div><div class="compare-item">~30 ms encoding latency</div><div class="compare-item">Use for download, broadcast</div></div>
<div class="compare-col"><div class="compare-title">Opus</div><div class="compare-item">16-32 kbps for speech</div><div class="compare-item">Excellent for voice, low latency</div><div class="compare-item">5-20 ms encoding latency</div><div class="compare-item">Use for VoIP, real-time streaming</div></div>
<div class="compare-col"><div class="compare-title">AAC</div><div class="compare-item">128-256 kbps</div><div class="compare-item">Better than MP3 at same bitrate</div><div class="compare-item">~20 ms latency</div><div class="compare-item">Use for video streaming, broadcast</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install pyogg opus-py soundfile</span>
<span class="kw">import</span> soundfile <span class="kw">as</span> sf
<span class="kw">import</span> librosa
<span class="kw">import</span> subprocess

<span class="cm"># 1) Encode to Opus (the right choice for voice streaming)</span>
y, sr = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
sf.<span class="fn">write</span>(<span class="str">"speech.opus"</span>, y, samplerate=<span class="num">16000</span>, format=<span class="str">"OGG"</span>, subtype=<span class="str">"OPUS"</span>)

<span class="cm"># Or use ffmpeg directly for full control</span>
subprocess.<span class="fn">run</span>([<span class="str">"ffmpeg"</span>, <span class="str">"-i"</span>, <span class="str">"speech.wav"</span>,
                <span class="str">"-c:a"</span>, <span class="str">"libopus"</span>,
                <span class="str">"-b:a"</span>, <span class="str">"24k"</span>,            <span class="cm"># 24 kbps for voice</span>
                <span class="str">"-application"</span>, <span class="str">"voip"</span>,    <span class="cm"># or "audio" for music</span>
                <span class="str">"speech_24k.opus"</span>], check=<span class="kw">True</span>)

<span class="cm"># 2) Compare file sizes for the same 1 minute of speech</span>
<span class="cm"># PCM 16 kHz int16: 1.92 MB</span>
<span class="cm"># MP3 128 kbps:     0.96 MB</span>
<span class="cm"># Opus 24 kbps:     0.18 MB  (10x smaller than PCM, voice-quality intact)</span>
<span class="cm"># Opus 8 kbps:      0.06 MB  (still intelligible, robust to packet loss)</span>

<span class="cm"># 3) ASR works fine on opus -- decode then run Whisper</span>
y_opus, sr_opus = librosa.<span class="fn">load</span>(<span class="str">"speech_24k.opus"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
<span class="cm"># transcribe(y_opus, sr_opus) -- &lt; 1% WER difference from original WAV</span>

<span class="cm"># 4) For browser streaming: WebRTC uses Opus by default; encode/decode is automatic</span>
<span class="cm"># For server-server: use SRTP-Opus or just Opus over TCP/QUIC for non-real-time</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Opus / codec compression is blocked. Equivalent: PCM int16 vs float32 sizing tradeoff.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
f32 = audio.astype(np.float32)
i16 = (np.clip(f32, -1, 1) * 32767).astype(np.int16)
print('float32 bytes:', f32.nbytes)
print('int16   bytes:', i16.nbytes, '  (', round(f32.nbytes/i16.nbytes, 1), '× compression)')
f32_back = i16.astype(np.float32) / 32767
print('Reconstruction MSE:', round(float(np.mean((f32 - f32_back) ** 2)), 9))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>soundfile</code> can write Opus directly via libopus. The OGG/Opus container is the standard wrapper for streaming and storage. 2) ffmpeg gives more control: <code>-application voip</code> tunes Opus for speech (lower latency, narrowband if needed); <code>-application audio</code> tunes for music. Bitrate <code>-b:a 24k</code> is the sweet spot for clear speech with very low bandwidth. 3) Size comparison: Opus 24 kbps is 10x smaller than raw PCM and indistinguishable for speech. 4) Compatibility: Whisper handles Opus-decoded audio with virtually no quality difference. WebRTC (used by Discord, WhatsApp, Zoom, browsers) uses Opus by default; in any browser-based voice agent you do not need to think about codec choice -- it is already Opus end to end.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: WhatsApp voice messages</div><div class="example-body">WhatsApp records voice messages at 16 kHz mono Opus around 12-16 kbps. A 30-second message is roughly 50 KB. Compare to PCM (1 MB) or MP3 at 64 kbps (240 KB). The codec choice is why WhatsApp can deliver voice messages instantly even on weak mobile networks. The encoder runs on the phone CPU at &lt;5% utilization in real-time.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Privacy: On-Device vs Cloud</h2>

<p class="l-text">Where you run audio inference matters enormously for privacy and product positioning.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Cloud</div><div class="compare-item">Send audio to server, get back text</div><div class="compare-item">Best model quality (Whisper-large)</div><div class="compare-item">Server pays GPU cost</div><div class="compare-item">Audio leaves device -- privacy concern</div></div>
<div class="compare-col"><div class="compare-title">On-device</div><div class="compare-item">Whisper.cpp / CoreML / TFLite locally</div><div class="compare-item">Smaller model, lower quality</div><div class="compare-item">Zero ongoing cost</div><div class="compare-item">No data leaves device -- private by design</div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hybrid</div><div class="card-body">Wake-word + intent on device, full transcription in cloud only when needed (Siri, Alexa pattern).</div></div>
<div class="calc-card"><div class="card-title">Encryption in transit</div><div class="card-body">Always TLS for cloud audio. Use end-to-end keys (Signal protocol) for sensitive applications.</div></div>
<div class="calc-card"><div class="card-title">Retention policy</div><div class="card-body">Delete audio immediately after transcription unless user opts in. Document retention clearly.</div></div>
<div class="calc-card"><div class="card-title">PII redaction</div><div class="card-body">Auto-detect names, emails, phone numbers, credit cards in transcripts; mask before storage.</div></div>
<div class="calc-card"><div class="card-title">GDPR / HIPAA</div><div class="card-body">If you process EU citizen data, GDPR applies. Healthcare audio: HIPAA in US. Plan compliance early.</div></div>
<div class="calc-card"><div class="card-title">Audit logs</div><div class="card-body">Log every access to audio for security incident review. Anonymize where possible.</div></div>
</div>

<div class="l-warn"><strong>The voice cloning ethics overlap:</strong> uploaded voice samples + cloud TTS = trivial deepfake potential. If you build voice cloning, require clear opt-in, watermark generated audio, and disclose AI-generation in user-facing flows.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Final Mini-Project: Real-Time Transcription</h2>

<p class="l-text">Putting it all together: a real-time microphone transcription app. Reads from microphone in chunks, runs VAD, transcribes detected speech segments with faster-whisper, prints transcripts as they arrive.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install faster-whisper sounddevice silero-vad numpy</span>
<span class="kw">import</span> sounddevice <span class="kw">as</span> sd
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> queue
<span class="kw">import</span> torch
<span class="kw">from</span> faster_whisper <span class="kw">import</span> WhisperModel
<span class="kw">from</span> silero_vad <span class="kw">import</span> load_silero_vad, VADIterator

<span class="cm"># 1) Load models</span>
asr = <span class="fn">WhisperModel</span>(<span class="str">"small"</span>, device=<span class="str">"cuda"</span>, compute_type=<span class="str">"float16"</span>)
vad_model = <span class="fn">load_silero_vad</span>()
vad = <span class="fn">VADIterator</span>(vad_model, threshold=<span class="num">0.5</span>, sampling_rate=<span class="num">16000</span>,
                   min_silence_duration_ms=<span class="num">500</span>)

<span class="cm"># 2) Audio queue between mic callback and processing thread</span>
audio_q = queue.<span class="fn">Queue</span>()
SAMPLE_RATE = <span class="num">16000</span>
FRAME_MS = <span class="num">30</span>
FRAME_SAMPLES = SAMPLE_RATE * FRAME_MS // <span class="num">1000</span>     <span class="cm"># 480

# 3) Microphone callback (runs in audio thread)</span>
<span class="kw">def</span> <span class="fn">audio_callback</span>(indata, frames, time_info, status):
    audio_q.<span class="fn">put</span>(indata[:, <span class="num">0</span>].<span class="fn">copy</span>())

<span class="cm"># 4) Processing loop (main thread)</span>
<span class="kw">def</span> <span class="fn">process_loop</span>():
    speech_buffer = []
    <span class="kw">while</span> <span class="kw">True</span>:
        chunk = audio_q.<span class="fn">get</span>()                       <span class="cm"># 30 ms

        # silero-vad expects fp32 [-1, 1]</span>
        chunk_t = torch.<span class="fn">from_numpy</span>(chunk).<span class="fn">float</span>()
        speech_dict = <span class="fn">vad</span>(chunk_t, return_seconds=<span class="kw">True</span>)

        speech_buffer.<span class="fn">append</span>(chunk)

        <span class="kw">if</span> speech_dict <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span> <span class="kw">and</span> <span class="str">"end"</span> <span class="kw">in</span> speech_dict:
            <span class="cm"># End of speech detected: transcribe what we have</span>
            audio_segment = np.<span class="fn">concatenate</span>(speech_buffer)
            speech_buffer = []

            segments, info = asr.<span class="fn">transcribe</span>(
                audio_segment, language=<span class="str">"en"</span>,
                vad_filter=<span class="kw">False</span>,        <span class="cm"># we already did VAD</span>
                beam_size=<span class="num">1</span>             <span class="cm"># greedy for low latency</span>
            )
            text = <span class="str">" "</span>.<span class="fn">join</span>(s.text.<span class="fn">strip</span>() <span class="kw">for</span> s <span class="kw">in</span> segments).<span class="fn">strip</span>()
            <span class="kw">if</span> text:
                <span class="fn">print</span>(<span class="str">"&gt;"</span>, text, flush=<span class="kw">True</span>)

<span class="cm"># 5) Run</span>
<span class="kw">with</span> sd.<span class="fn">InputStream</span>(samplerate=SAMPLE_RATE, channels=<span class="num">1</span>,
                    blocksize=FRAME_SAMPLES, callback=audio_callback):
    <span class="fn">print</span>(<span class="str">"Listening... Ctrl+C to stop."</span>)
    <span class="kw">try</span>:
        <span class="fn">process_loop</span>()
    <span class="kw">except</span> KeyboardInterrupt:
        <span class="fn">print</span>(<span class="str">"\\nStopped."</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">End-to-end pipeline: VAD → 'transcribe' → print transcripts as they arrive.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
transcripts = []
chunk = 1600
for i in range(0, len(audio), chunk):
    seg = audio[i:i+chunk]
    if np.sqrt(np.mean(seg**2)) &gt; 0.05:
        # mock 'whisper' = highest-FFT-bin → token
        bin_id = int(np.argmax(np.abs(np.fft.rfft(seg))))
        transcripts.append(f'[t={i/16000:.2f}s] token_{bin_id}')
for line in transcripts:
    print(line)
print('Total tokens:', len(transcripts))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads two models: faster-whisper for ASR and silero-vad for voice activity. Both stay resident in memory. 2) The audio callback runs in a separate thread (driven by the OS audio system) and puts each 30 ms chunk into a queue. The main thread reads from the queue. This separation prevents the audio system from stalling. 3) For each 30 ms chunk: append to a buffer, run VAD. When VAD detects end-of-speech (after the configured silence), drain the buffer and transcribe. 4) <code>beam_size=1</code> uses greedy decoding for lowest latency; with a 1-2 second utterance the difference vs beam search is small. 5) The total latency from end of speech to printed transcript is roughly <code>min_silence_duration_ms + asr_inference_time</code> ~ 500 + 200 = 700 ms. This is on the edge of feeling instant. 6) For a polished product wrap this in a curses or web UI, add an interrupt handler for the user pressing space, log everything for debugging.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: a meeting captioner in 80 lines</div><div class="example-body">Take the snippet above, add: (a) speaker diarization with pyannote.audio (3 lines), (b) per-speaker color in console output (5 lines), (c) write SRT subtitles to disk in real-time (10 lines), (d) keyboard hotkey to mark important moments (5 lines). Total under 80 lines, runs on a laptop GPU, transcribes meetings in real-time with speaker labels and time-stamped subtitle export. This is what entire startups sell.</div></div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Streaming is fundamentally different from batch: optimize for latency, chunk overlapping windows, merge results.<br><strong>2.</strong> faster-whisper (CTranslate2 backend) is 4x faster than HF transformers; insanely-fast-whisper (FA2) is 8x. Use these in production.<br><strong>3.</strong> ONNX export decouples Whisper from PyTorch; ONNX Runtime is the standard for cross-platform deployment.<br><strong>4.</strong> Quantization: fp16 negligible loss, int8 small WER bump (1-2%), int4 bigger but enables phone deployment. whisper.cpp Q5_K is the sweet spot for edge.<br><strong>5.</strong> silero-vad is the universal VAD: 1 MB, real-time, 95%+ F1. Use it for turn detection and ASR-skip-silence.<br><strong>6.</strong> Audio codec: Opus 16-24 kbps for voice streaming -- 10x smaller than raw, near-zero quality loss.<br><strong>7.</strong> Privacy: on-device when possible (whisper.cpp, CoreML), cloud only with TLS + clear retention policy.<br><strong>8.</strong> Real-time transcription: VAD + faster-whisper + sounddevice = a working app in 50 lines. The principles in this course generalize to every audio product.</div></div>
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

  function latencyPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var stages = lang==='tr'
      ? ['VAD', 'Ses yakalama', 'Whisper-small', 'LLM çağrısı', 'TTS ilk parça', 'Oynatma başlangıcı']
      : ['VAD', 'Audio capture', 'Whisper-small', 'LLM call', 'TTS first chunk', 'Playback start'];
    var values = [10, 1000, 150, 500, 250, 50];
    var colors = [T.accent, '#4ecdc4', '#f87171', '#a78bfa', '#fbbf24', '#86efac'];
    var trace = {
      x: values,
      y: stages,
      type: 'bar',
      orientation: 'h',
      marker: {color: colors, line:{color:'rgba(255,255,255,0.15)', width:1}},
      text: values.map(function(v){return v+' ms';}),
      textposition: 'outside',
      textfont: {color: T.text, size: 12}
    };
    var total = values.reduce(function(a,b){return a+b;}, 0);
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Akış Ses Ajanı için Gecikme Bütçesi (toplam ' + total + ' ms)':'Latency Budget for Streaming Voice Agent (total ' + total + ' ms)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'gecikme (ms)':'latency (ms)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{automargin:true, gridcolor:T.grid},
      showlegend:false,
      margin:{t:60,r:80,b:60,l:140}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  latencyPlot('plot-al8-latency-en','en');
  latencyPlot('plot-al8-latency-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Gerçek zamanlı konuşma bir demo ile ürün arasındaki boşluktur.</strong> Çıkarım başına 4 saniye süren bir model çevrimdışı bir transkripsiyon işi için iyidir, canlı bir konuşma için kullanışsızdır. Üretim sesi çoğunlukla mühendislikle ilgilidir: akış çıkarımı, ses etkinliği algılama, ONNX dışa aktarma, uç cihazda dağıtım için nicemleme, ses codec seçimi ve %50 prototipi kullanıcının gerçekten kullanmak istediği bir şeye dönüştüren onlarca küçük karar.</p>

<p class="l-text">Bu ders akış vs toplu işleme, gecikme bütçeleri ve parçalama stratejileri, Whisper için ONNX dışa aktarma ve nicemleme, silero-vad ile ses etkinliği algılama, ses codec seçimi (akış için Opus), cihaz üstü vs bulut çıkarımının gizlilik etkilerini kapsar ve üretim seviyesinde gerçek zamanlı transkripsiyon mini projesiyle biter. Sonunda yalnızca notebook'lar değil, ses ürünleri sevk edebilirsiniz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Akış ve toplu ASR'yi gecikme, verim ve karmaşıklığa göre karşılaştıracaksın</li>
<li>Kısmi çıktıları doğru tutmak için örtüşmeli kayan pencere parçalama uygulayacaksın</li>
<li>Whisper'ı ONNX'e aktarıp taşınabilir çıkarım için onnxruntime ile çalıştıracaksın</li>
<li>Whisper'ı INT8'e quantize edip boyut ve kaliteyi ölçeceksin</li>
<li>silero-vad'ın Whisper çağrılarını kapıladığı gerçek zamanlı transkripsiyon kuracaksın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Akış vs Toplu İşleme</h2>

<p class="l-text">Çok farklı mühendislik ihtiyaçları olan tamamen farklı iki çıkarım modu.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Toplu</div><div class="compare-item">Tam dosyaları işle</div><div class="compare-item">Verim için optimize et (klip/sn)</div><div class="compare-item">Tüm ses GPU belleğine sığar</div><div class="compare-item">Kullanım durumları: podcast transkripsiyonu, arşiv indeksleme, veri kümesi oluşturma</div></div>
<div class="compare-col"><div class="compare-title">Akış</div><div class="compare-item">Sesi geldikçe işle</div><div class="compare-item">Gecikme için optimize et (ms ilk bayt)</div><div class="compare-item">Parçalar üzerinde kayan pencere</div><div class="compare-item">Kullanım durumları: ses ajanları, canlı altyazı, telefon, gerçek zamanlı çeviri</div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gecikme</div><div class="card-body">Kullanıcının konuşmayı bitirmesinden sistemin yanıt vermesine kadar geçen süre. Hedef: doğal konuşma için &lt; 1 saniye.</div></div>
<div class="calc-card"><div class="card-title">Verim</div><div class="card-body">Saniyede kaç eş zamanlı kullanıcı / saatlik ses. Toplu için maksimize et.</div></div>
<div class="calc-card"><div class="card-title">Gerçek zaman faktörü</div><div class="card-body">Çıkarım süresi bölü ses süresi. RTF &lt; 1 gerçek zamandan hızlı demektir.</div></div>
<div class="calc-card"><div class="card-title">İlk-token-süresi</div><div class="card-body">Akış TTS / akış LLM için kritik. Kullanıcı tam yanıt daha uzun sürse bile bir şey hızlıca duyar.</div></div>
<div class="calc-card"><div class="card-title">Parçalama</div><div class="card-body">Sesi sabit pencerelerde işle (örn. 1-3 s). Gecikme vs bağlam ödünleşimi.</div></div>
<div class="calc-card"><div class="card-title">Sunucu yerleşimi</div><div class="card-body">Düşük gecikme için: kullanıcıya yakın uç GPU. Yüksek verim için: merkezi küme.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Parçalama ve Kayan Pencereler</h2>

<p class="l-text">Akış Whisper için tüm söylemeyi bekleyemezsiniz. Örtüşen pencerelerde işleyin: her parça ayrı ayrı yazıya dökülür, sonra sonuçlar birleştirilir. Parça boyutu ve örtüşme ana düğmelerdir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Parça boyutu</div><div class="card-body">Her pencerenin uzunluğu. Whisper 30 s bekler; faster-whisper herhangi birini destekler. Yaygın: akış için 5-10 s.</div></div>
<div class="calc-card"><div class="card-title">Örtüşme</div><div class="card-body">Ardışık parçaların ne kadar paylaştığı. Tipik: 1-2 saniye. Sınırlar arasında bağlamı korumaya yardımcı olur.</div></div>
<div class="calc-card"><div class="card-title">Gecikme</div><div class="card-body">Kullanıcı ilk transkripti almadan önce en az bir parça boyutu bekler. 5 s parça = 5 s minimum gecikme.</div></div>
<div class="calc-card"><div class="card-title">Kelime sınırı</div><div class="card-body">Kelime ortası kesintiler iyi; model bunları işler. Birleştirme adımı örtüşme bölgesini tekrar etmez.</div></div>
<div class="calc-card"><div class="card-title">VAD güdümlü</div><div class="card-body">Daha akıllı: VAD'dan doğal sessizlik sınırlarında parçalan. Cümle ortasında kesmekten kaçınır.</div></div>
<div class="calc-card"><div class="card-title">Whisper-streaming</div><div class="card-body">Akış arayüzüyle faster-whisper'ı saran açık kaynak kütüphane.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install faster-whisper numpy</span>
<span class="kw">from</span> faster_whisper <span class="kw">import</span> WhisperModel
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> librosa

<span class="cm"># 1) faster-whisper: HF transformers'tan 4x daha hızlı, aynı doğruluk</span>
model = <span class="fn">WhisperModel</span>(<span class="str">"small"</span>, device=<span class="str">"cuda"</span>, compute_type=<span class="str">"float16"</span>)

<span class="cm"># 2) Uzun bir dosya üzerinde örtüşen parçalarla akış çıkarımı</span>
<span class="kw">def</span> <span class="fn">streaming_transcribe</span>(audio_path, chunk_s=<span class="num">10.0</span>, overlap_s=<span class="num">2.0</span>):
    y, sr = librosa.<span class="fn">load</span>(audio_path, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
    chunk_samples = <span class="fn">int</span>(chunk_s * sr)
    overlap_samples = <span class="fn">int</span>(overlap_s * sr)
    step = chunk_samples - overlap_samples

    transcripts = []
    pos = <span class="num">0</span>
    chunk_idx = <span class="num">0</span>
    <span class="kw">while</span> pos &lt; <span class="fn">len</span>(y):
        chunk = y[pos: pos + chunk_samples]
        <span class="kw">if</span> <span class="fn">len</span>(chunk) &lt; sr:                  <span class="cm"># &lt;1 s ses kaldı, atla</span>
            <span class="kw">break</span>

        segments, info = model.<span class="fn">transcribe</span>(
            chunk, language=<span class="str">"en"</span>, vad_filter=<span class="kw">True</span>,
            beam_size=<span class="num">5</span>, no_speech_threshold=<span class="num">0.6</span>
        )

        text = <span class="str">" "</span>.<span class="fn">join</span>(s.text.<span class="fn">strip</span>() <span class="kw">for</span> s <span class="kw">in</span> segments)
        absolute_start = pos / sr
        <span class="fn">print</span>(f<span class="str">"[parca {chunk_idx} @ {absolute_start:.1f}s] {text}"</span>)
        transcripts.<span class="fn">append</span>((absolute_start, text))

        pos += step
        chunk_idx += <span class="num">1</span>

    <span class="kw">return</span> transcripts

<span class="cm"># 3) Çalıştır</span>
<span class="fn">streaming_transcribe</span>(<span class="str">"podcast.mp3"</span>, chunk_s=<span class="num">10.0</span>, overlap_s=<span class="num">2.0</span>)
<span class="cm"># [parca 0 @ 0.0s] Welcome to the show. Today we are talking about
# [parca 1 @ 8.0s] talking about audio engineering. The latency
# [parca 2 @ 16.0s] latency budget for real-time speech is</span>

<span class="cm"># 4) Örtüşen çıkışları birleştirme: basit son ek/önek tekrarsızlaştırma</span>
<span class="kw">def</span> <span class="fn">merge_overlap</span>(prev_text, new_text, overlap_words=<span class="num">5</span>):
    <span class="cm"># Önceki son \`overlap_words\` yeninin başında görünüyorsa, tekrarsızlaştır</span>
    <span class="kw">if</span> <span class="kw">not</span> prev_text:
        <span class="kw">return</span> new_text
    prev_tail = <span class="str">" "</span>.<span class="fn">join</span>(prev_text.<span class="fn">split</span>()[-overlap_words:])
    <span class="kw">if</span> new_text.<span class="fn">startswith</span>(prev_tail):
        <span class="kw">return</span> new_text[<span class="fn">len</span>(prev_tail):].<span class="fn">strip</span>()
    <span class="kw">return</span> new_text

merged = <span class="str">""</span>
<span class="kw">for</span> _, text <span class="kw">in</span> transcripts:
    merged += <span class="str">" "</span> + <span class="fn">merge_overlap</span>(merged, text, overlap_words=<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">"TAM:"</span>, merged.<span class="fn">strip</span>())</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">faster-whisper / CT2 engellendi. Yerine geçen: throughput açısını hissetmek için numpy STFT'sini zamanla.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
import time
t0 = time.time()
for _ in range(10):
    signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
elapsed = time.time() - t0
print('10× STFT in', round(elapsed, 4), 's   (~', round(elapsed*100, 1), 'ms each)')</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>faster-whisper</code>'ı yükler, kabaca HF transformers'tan 4 kat daha hızlı, aynı çıktıyla CTranslate2 tabanlı bir Whisper yeniden uygulaması. Varsayılan cihaz fp16 ile CUDA'dır; CPU'da compute_type="int8" kullanın. 2) Uzun bir dosya üzerinde akış: 2 saniyelik örtüşmeli 10 saniyelik parçalar (yani adım 8 saniyedir). Her adımda parçayı bağımsız olarak yazıya dök. 3) <code>vad_filter=True</code> faster-whisper'a parça içindeki sessiz bölgeleri atlamak için silero-vad'ı kullanmasını söyler -- uzun duraklamalı ders/podcast sesinde büyük hızlanma. 4) Örtüşen transkriptleri birleştir: ardışık parçalar her ikisi de sınırda aynı kelimeleri gördüğünde, basit son ek/önek tekrarsızlaştırma yinelemeyi kaldırır. Daha sofistike yaklaşımlar güven ağırlıklı hizalama kullanır.</p>

<div id="plot-al8-latency-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Akış ses ajanı için uçtan uca gecikme dökümü. Çubuklar her hat aşamasında geçen zamanı gösterir: VAD (10 ms), ses yakalama (chunk_s = 1000 ms), Whisper-small çıkarımı (~150 ms), LLM gidiş-dönüşü (~500 ms), TTS akış ilk parçası (~250 ms), oynatma başlangıcı (~50 ms). Toplam: ~1.96 s -- doğal hissin sınırında. Herhangi bir aşamayı yarıya kesmek algılanan yanıt verme hızını fark edilir şekilde iyileştirir.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Whisper için ONNX Dışa Aktarımı</h2>

<p class="l-text">ONNX (Open Neural Network Exchange) modelleri framework'lerden ayıran taşınabilir bir model formatıdır. Whisper'ı ONNX'e aktarmak ONNX Runtime ile çalıştırmanıza olanak tanır (CPU'da PyTorch'tan daha hızlı, Python olmayan ortamlara gömmesi daha kolay).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install optimum[onnxruntime]</span>
<span class="kw">from</span> optimum.onnxruntime <span class="kw">import</span> ORTModelForSpeechSeq2Seq
<span class="kw">from</span> transformers <span class="kw">import</span> WhisperProcessor
<span class="kw">import</span> librosa

<span class="cm"># 1) Whisper'ı ONNX'e aktar (tek seferlik, ~5 dakika)</span>
<span class="cm"># encoder.onnx, decoder.onnx, decoder_with_past.onnx + tokenizer dosyalarını kaydeder</span>
model_id = <span class="str">"openai/whisper-small"</span>
ORTModelForSpeechSeq2Seq.<span class="fn">from_pretrained</span>(
    model_id, export=<span class="kw">True</span>
).<span class="fn">save_pretrained</span>(<span class="str">"whisper-small-onnx"</span>)

<span class="cm"># 2) ONNX sürümünü yükle</span>
processor = WhisperProcessor.<span class="fn">from_pretrained</span>(<span class="str">"whisper-small-onnx"</span>)
model = ORTModelForSpeechSeq2Seq.<span class="fn">from_pretrained</span>(<span class="str">"whisper-small-onnx"</span>)

<span class="cm"># 3) Çıkarım -- PyTorch sürümüyle aynı API</span>
y, _ = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">processor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>)

<span class="kw">import</span> time
t0 = time.<span class="fn">time</span>()
ids = model.<span class="fn">generate</span>(inputs.input_features, max_new_tokens=<span class="num">100</span>)
<span class="fn">print</span>(<span class="str">"ONNX surdu:"</span>, time.<span class="fn">time</span>() - t0, <span class="str">"s"</span>)
text = processor.<span class="fn">batch_decode</span>(ids, skip_special_tokens=<span class="kw">True</span>)[<span class="num">0</span>]
<span class="fn">print</span>(text)

<span class="cm"># 4) Mobil/gömülü için: int8 nicemlemeyle ORT formatına dönüştür</span>
<span class="kw">from</span> optimum.onnxruntime <span class="kw">import</span> ORTQuantizer
<span class="kw">from</span> optimum.onnxruntime.configuration <span class="kw">import</span> AutoQuantizationConfig

quantizer = ORTQuantizer.<span class="fn">from_pretrained</span>(<span class="str">"whisper-small-onnx"</span>, file_name=<span class="str">"encoder_model.onnx"</span>)
qconfig = AutoQuantizationConfig.<span class="fn">avx512_vnni</span>(is_static=<span class="kw">False</span>, per_channel=<span class="kw">True</span>)
quantizer.<span class="fn">quantize</span>(save_dir=<span class="str">"whisper-small-onnx-int8"</span>, quantization_config=qconfig)

<span class="cm"># Sonuç: ~3x daha küçük model, CPU'da ~2-3x daha hızlı, &lt; %1 doğruluk düşüşü</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">ONNX dışa aktarımı engellendi; eşdeğeri sklearn → joblib (taşınabilir bir tahmin edici).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
import io, pickle
rng = np.random.default_rng(0)
X, y = rng.standard_normal((100, 16)), (rng.standard_normal(100) &gt; 0).astype(int)
clf = LogisticRegression().fit(X, y)
buf = pickle.dumps(clf)
print('Serialized model size:', len(buf), 'bytes')
loaded = pickle.loads(buf)
print('Round-trip accuracy preserved:', loaded.score(X, y) == clf.score(X, y))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>optimum</code> ONNX'e dönüşümü sarar. Whisper'ın üç alt grafiği vardır: kodlayıcı, kod çözücü (ilk adım), decoder_with_past (KV cache kullanan sonraki adımlar). Hepsi otomatik olarak dışa aktarılır. 2) ONNX checkpoint'ini yüklemek HF API'sini tam olarak yansıtır -- <code>WhisperForConditionalGeneration</code>'ın olduğu her yerde <code>ORTModelForSpeechSeq2Seq</code>'i bırakabilirsiniz. 3) Çıkarım PyTorch ile aynıdır. ONNX CPU'da kazanır (sıklıkla 2x) ve GPU'da eşittir. Büyük avantaj taşınabilirliktir -- ONNX Runtime Linux, Windows, macOS, iOS, Android, tarayıcıda (WASM) çalışır. 4) int8'e nicemleme modeli boyutta 4x ve CPU gecikmesinde kabaca 2-3x kesintiye uğratır. Whisper-small int8 ONNX ~70 MB'tır ve telefon CPU'sunda gerçek zamana yakın çalışır. optimum kütüphanesi kalibrasyon/nicemleme hattını sarar.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: iPhone'da Whisper</div><div class="example-body">whisper.cpp Whisper'ı ggml/llama.cpp tarzı nicemlemeyle C++'a aktarır. whisper-base'in 4-bit sürümü iPhone 14'te gerçek zamanlı çalışır, &lt; 100 MB RAM, internet yok. Bu, birçok iOS uygulamasındaki Whisper tabanlı özelliklerin ve Apple'ın kendi diktesinin arkasındaki gerçek uygulamadır. Ödünleşim: fp16 referansına göre ~%5 doğruluk düşüşü, ama her şey cihazda.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Uç Cihazda Dağıtım için Nicemleme</h2>

<p class="l-text">Modern ses modelleri büyüktür. Whisper-small 244M parametredir (~1 GB fp32). Telefon veya gömülü donanımda çalıştırmak agresif nicemleme gerektirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">fp32</div><div class="card-body">Orijinal. 4 bayt/parametre. Referans kalitesi.</div></div>
<div class="calc-card"><div class="card-title">fp16</div><div class="card-body">2 bayt/parametre. İhmal edilebilir doğruluk kaybı. GPU çıkarımı için varsayılan.</div></div>
<div class="calc-card"><div class="card-title">int8</div><div class="card-body">1 bayt/parametre. ~%1-2 WER artışı. VNNI/AVX512'li CPU'larda 2x hızlanma.</div></div>
<div class="calc-card"><div class="card-title">int4</div><div class="card-body">Paketleme yoluyla 0.5 bayt/parametre. ~%3-5 WER artışı. whisper.cpp Q4_K_M tarafından kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Dinamik nicemleme</div><div class="card-body">Ağırlıkları nicemle, aktivasyonları fp32 bırak. Kolay, mütevazı kazanımlar.</div></div>
<div class="calc-card"><div class="card-title">Statik nicemleme</div><div class="card-body">Hem ağırlıkları hem de aktivasyonları nicemle. Temsili veride kalibre et. En iyi hız.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Whisper için üç nicemleme yolu</span>

<span class="cm"># Yol 1: PyTorch dinamik nicemleme (basit, yalnızca CPU)</span>
<span class="kw">import</span> torch
<span class="kw">from</span> transformers <span class="kw">import</span> WhisperForConditionalGeneration

model = WhisperForConditionalGeneration.<span class="fn">from_pretrained</span>(<span class="str">"openai/whisper-small"</span>)
quantized = torch.quantization.<span class="fn">quantize_dynamic</span>(
    model, {torch.nn.Linear}, dtype=torch.qint8
)
<span class="fn">print</span>(<span class="str">"boyut MB:"</span>, <span class="fn">sum</span>(p.numel() * p.element_size() <span class="kw">for</span> p <span class="kw">in</span> quantized.<span class="fn">parameters</span>()) / <span class="num">1e6</span>)

<span class="cm"># Yol 2: bitsandbytes 8-bit / 4-bit (GPU, HF ile kolay)</span>
<span class="kw">from</span> transformers <span class="kw">import</span> WhisperForConditionalGeneration, BitsAndBytesConfig

quant_config = <span class="fn">BitsAndBytesConfig</span>(
    load_in_4bit=<span class="kw">True</span>,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_quant_type=<span class="str">"nf4"</span>,
)
model_4bit = WhisperForConditionalGeneration.<span class="fn">from_pretrained</span>(
    <span class="str">"openai/whisper-large-v3"</span>,
    quantization_config=quant_config,
    device_map=<span class="str">"auto"</span>,
)
<span class="cm"># 4-bit'te Whisper-large-v3 8 GB GPU'ya sığar</span>

<span class="cm"># Yol 3: whisper.cpp - ggml nicemleme ile C++ çıkarımı</span>
<span class="cm"># ggml-tiny.bin / ggml-small.bin / ggml-large-v3.bin checkpoint'lerini kullan</span>
<span class="cm"># Yapı talimatları için https://github.com/ggerganov/whisper.cpp'a bakın</span>

<span class="cm"># Python'dan whisper.cpp'i subprocess veya pywhispercpp ile çağırabilirsiniz</span>
<span class="cm"># pip install pywhispercpp</span>
<span class="kw">from</span> pywhispercpp.model <span class="kw">import</span> Model

m = <span class="fn">Model</span>(<span class="str">"small"</span>, n_threads=<span class="num">8</span>)         <span class="cm"># ggml-small.bin'i yükler, q5_K nicemli

# Çıkarım aynı donanımda fp32 PyTorch'tan daha hızlıdır</span>
segments = m.<span class="fn">transcribe</span>(<span class="str">"speech.wav"</span>)
<span class="kw">for</span> s <span class="kw">in</span> segments:
    <span class="fn">print</span>(s.t0, s.t1, s.text)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Numpy ile nicemleme: float32 ağırlıklar → int8 → yeniden oluştur, hata ölç.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
w = rng.standard_normal(10000).astype(np.float32)
scale = np.max(np.abs(w)) / 127
q = np.round(w / scale).astype(np.int8)
wq = q.astype(np.float32) * scale
err = float(np.mean((w - wq) ** 2))
print('FP32 size:', w.nbytes, 'bytes')
print('INT8 size:', q.nbytes, 'bytes  (', round(w.nbytes/q.nbytes, 1), '× smaller)')
print('MSE      :', round(err, 8))</code></pre></div>
</div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Yol 1: PyTorch dinamik nicemleme tek satırdır ve CPU'da çalışır. İyi bir hızlanma ama en iyisi değil. 2) Yol 2: bitsandbytes GPU çıkarımı için yüksek kaliteli 4-bit ve 8-bit nicemleme sağlar, LLM dünyasında popüler ve Whisper'a da uygulanabilir. NF4 (normal float 4) transformer ağırlıkları için önerilen quant_type'tır. 4-bit'te Whisper-large-v3 8 GB VRAM'a sığar. 3) Yol 3: whisper.cpp uç cihazda dağıtım için altın standarttır. Whisper çıkarımını saf C++'da ggml'in özel nicemlemesiyle (Q4_K_M, Q5_K_M, vb.) yeniden yazar, naif int4'ten daha doğru ve ARM/x86 SIMD için ayarlanmıştır. <code>pywhispercpp</code> bunu Python aracılığıyla açığa çıkarır; üretim için C++'ı doğrudan gömün. 4) Doğruluk/boyut/hız Pareto sınırı donanıma göre değişir; hedef cihazınızı kıyaslayın.</p>

<div class="l-warn"><strong>Nicemleme uyarısı:</strong> Whisper'ın kodlayıcısı kod çözücüsünden nicemlemeye daha duyarlıdır. WER %5+ atlama görüyorsanız, kodlayıcıyı fp16 tutmayı ve yalnızca kod çözücüyü nicemlemeyi düşünün. Birçok üretim kurulumu karışık hassasiyet kullanır: fp16 kodlayıcı + int8 kod çözücü.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Üretimde Ses Etkinliği Algılama</h2>

<p class="l-text">VAD (L7'de kısaca ele alındı) gerçek zamanlı sesin sesli kahramanıdır. Sessizliği konuşmadan ayırır, sıra almayı olanaklı kılar, pahalı ASR çağrılarını kapılar ve akışta bant genişliği tasarrufu sağlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">silero-vad</div><div class="card-body">SOTA sinirsel VAD. ~1 MB ONNX modeli, CPU'da gerçek zamanlı, diller arası %95+ F1.</div></div>
<div class="calc-card"><div class="card-title">webrtcvad</div><div class="card-body">WebRTC'den klasik GMM tabanlı VAD. Hafif, iyi doğruluk. Gömülü için iyi.</div></div>
<div class="calc-card"><div class="card-title">Enerji tabanlı</div><div class="card-body">RMS genliğinde eşik. Hızlı ama gürültüde başarısız. Yalnızca yedek olarak kullan.</div></div>
<div class="calc-card"><div class="card-title">Pencere boyutu</div><div class="card-body">silero 30 ms pencereleri işler. Kararlar birden çok pencere üzerinde düzeltilir.</div></div>
<div class="calc-card"><div class="card-title">min_silence_duration_ms</div><div class="card-body">N ms sessizlik olana kadar sıra sonunu tetikleme. Ayarlanabilir: 200ms agresif, 700ms rahat.</div></div>
<div class="calc-card"><div class="card-title">VAD farkındalıklı ASR</div><div class="card-body">Whisper'a göndermeden önce sessiz bölgeleri atla. Gerçek dünya sesinde %30-50 hızlanma.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install silero-vad numpy onnxruntime</span>
<span class="kw">import</span> torch
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> silero_vad <span class="kw">import</span> load_silero_vad, get_speech_timestamps, VADIterator

<span class="cm"># 1) Çevrimdışı kullanım: bir kayıttan konuşma segmentlerini al</span>
model = <span class="fn">load_silero_vad</span>()
y, sr = <span class="fn">read_audio</span>(<span class="str">"long.wav"</span>, sampling_rate=<span class="num">16000</span>)
ts = <span class="fn">get_speech_timestamps</span>(y, model, threshold=<span class="num">0.5</span>,
                            min_speech_duration_ms=<span class="num">250</span>,
                            min_silence_duration_ms=<span class="num">200</span>,
                            sampling_rate=<span class="num">16000</span>)
<span class="kw">for</span> t <span class="kw">in</span> ts:
    <span class="fn">print</span>(f<span class="str">"konusma: {t['start']/16000:.2f}-{t['end']/16000:.2f} s"</span>)

<span class="cm"># 2) Akış kullanımı: gerçek zamanlı VAD yineleyici</span>
<span class="cm"># Ona 30 ms (16 kHz'de 480 örnek) çerçeve besle; çerçeve başına konuşma olasılığı al</span>
vad = <span class="fn">VADIterator</span>(model, threshold=<span class="num">0.5</span>, sampling_rate=<span class="num">16000</span>,
                   min_silence_duration_ms=<span class="num">500</span>)

<span class="kw">def</span> <span class="fn">process_stream</span>(microphone):
    speech_buffer = []
    <span class="kw">for</span> chunk <span class="kw">in</span> microphone:                  <span class="cm"># her biri 30 ms</span>
        speech_dict = <span class="fn">vad</span>(chunk, return_seconds=<span class="kw">True</span>)
        <span class="kw">if</span> speech_dict <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
            <span class="kw">if</span> <span class="str">"start"</span> <span class="kw">in</span> speech_dict:
                <span class="fn">print</span>(<span class="str">"konusma basladi"</span>, speech_dict[<span class="str">"start"</span>])
            <span class="kw">if</span> <span class="str">"end"</span> <span class="kw">in</span> speech_dict:
                <span class="fn">print</span>(<span class="str">"konusma bitti"</span>, speech_dict[<span class="str">"end"</span>])
                <span class="cm"># Şimdi tamponlanan konuşmayı ASR'le</span>
                <span class="fn">trigger_asr</span>(np.<span class="fn">concatenate</span>(speech_buffer))
                speech_buffer = []
        speech_buffer.<span class="fn">append</span>(chunk)

<span class="cm"># 3) VAD farkındalıklı ASR: transkripsiyondan önce sessizliği filtrele</span>
<span class="kw">def</span> <span class="fn">asr_with_vad</span>(audio, asr_model):
    <span class="cm"># Konuşma segmentlerini bul</span>
    ts = <span class="fn">get_speech_timestamps</span>(audio, model, sampling_rate=<span class="num">16000</span>)
    transcripts = []
    <span class="kw">for</span> t <span class="kw">in</span> ts:
        seg = audio[t[<span class="str">"start"</span>]: t[<span class="str">"end"</span>]]
        text = asr_model.<span class="fn">transcribe</span>(seg)
        transcripts.<span class="fn">append</span>((t[<span class="str">"start"</span>] / <span class="num">16000</span>, text))
    <span class="kw">return</span> transcripts</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Akış VAD: sesi parçalara biriktir, RMS enerjiyle kapıla.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
chunk = 1600                                  # 100 ms
active_count, total = 0, 0
for i in range(0, len(audio), chunk):
    seg = audio[i:i+chunk]
    rms = float(np.sqrt(np.mean(seg ** 2)))
    is_voice = rms &gt; 0.05
    if is_voice:
        active_count += 1
    total += 1
print(f'Voiced chunks: {active_count} / {total} ({100*active_count/total:.0f}%)')</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Çevrimdışı VAD: <code>get_speech_timestamps</code> tüm bir ses klibini alır ve konuşma aralıklarını döner. Eşikler hassasiyeti ayarlamanıza olanak tanır. 2) Akış VAD: <code>VADIterator</code> 30 ms parçaları işler ve konuşma içeri/dışarı geçişlerinde başlangıç/bitiş olayları yayar. Bu gerçek zamanlı ajanlar için doğru API'dir. 3) VAD farkındalıklı ASR: tüm kaydı yazıya dökmek yerine, her konuşma segmentini ayrı ayrı yazıya dök. Çoğunlukla sessiz uzun dosyalarda büyük tasarruf (örn. dersler, toplantılar, gözetim). 4) silero-vad tek bir CPU iş parçacığında gerçek zamanın 100 katından fazlasında çalışır, bu yüzden her yerde çalıştırma maliyeti ihmal edilebilir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Akış için Ses Codec'leri</h2>

<p class="l-text">Sesi bir ağ üzerinden gönderdiğinizde, ham 16 kHz PCM israflıdır (256 kbps mono). Codec seçimi önemlidir: bant genişliğini, gecikmeyi, paket kaybına dayanıklılığı ve ASR doğruluğunu değiştirir.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">PCM (ham)</div><div class="compare-item">16 kHz int16'da 256 kbps</div><div class="compare-item">Kayıpsız, basit</div><div class="compare-item">Gecikme yok</div><div class="compare-item">Yerel IPC, dosya depolama için kullan</div></div>
<div class="compare-col"><div class="compare-title">MP3</div><div class="compare-item">128 kbps standart</div><div class="compare-item">Kayıplı, iyi kalite</div><div class="compare-item">~30 ms kodlama gecikmesi</div><div class="compare-item">İndirme, yayın için kullan</div></div>
<div class="compare-col"><div class="compare-title">Opus</div><div class="compare-item">Konuşma için 16-32 kbps</div><div class="compare-item">Ses için mükemmel, düşük gecikme</div><div class="compare-item">5-20 ms kodlama gecikmesi</div><div class="compare-item">VoIP, gerçek zamanlı akış için kullan</div></div>
<div class="compare-col"><div class="compare-title">AAC</div><div class="compare-item">128-256 kbps</div><div class="compare-item">Aynı bit hızında MP3'ten daha iyi</div><div class="compare-item">~20 ms gecikme</div><div class="compare-item">Video akışı, yayın için kullan</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install pyogg opus-py soundfile</span>
<span class="kw">import</span> soundfile <span class="kw">as</span> sf
<span class="kw">import</span> librosa
<span class="kw">import</span> subprocess

<span class="cm"># 1) Opus'a kodla (ses akışı için doğru seçim)</span>
y, sr = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
sf.<span class="fn">write</span>(<span class="str">"speech.opus"</span>, y, samplerate=<span class="num">16000</span>, format=<span class="str">"OGG"</span>, subtype=<span class="str">"OPUS"</span>)

<span class="cm"># Veya tam kontrol için doğrudan ffmpeg kullan</span>
subprocess.<span class="fn">run</span>([<span class="str">"ffmpeg"</span>, <span class="str">"-i"</span>, <span class="str">"speech.wav"</span>,
                <span class="str">"-c:a"</span>, <span class="str">"libopus"</span>,
                <span class="str">"-b:a"</span>, <span class="str">"24k"</span>,            <span class="cm"># ses için 24 kbps</span>
                <span class="str">"-application"</span>, <span class="str">"voip"</span>,    <span class="cm"># veya müzik için "audio"</span>
                <span class="str">"speech_24k.opus"</span>], check=<span class="kw">True</span>)

<span class="cm"># 2) Aynı 1 dakikalık konuşma için dosya boyutlarını karşılaştır</span>
<span class="cm"># PCM 16 kHz int16: 1.92 MB</span>
<span class="cm"># MP3 128 kbps:     0.96 MB</span>
<span class="cm"># Opus 24 kbps:     0.18 MB  (PCM'den 10x daha küçük, ses kalitesi sağlam)</span>
<span class="cm"># Opus 8 kbps:      0.06 MB  (hala anlaşılır, paket kaybına karşı sağlam)</span>

<span class="cm"># 3) ASR opus üzerinde iyi çalışır -- çöz sonra Whisper'ı çalıştır</span>
y_opus, sr_opus = librosa.<span class="fn">load</span>(<span class="str">"speech_24k.opus"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
<span class="cm"># transcribe(y_opus, sr_opus) -- orijinal WAV'dan &lt; %1 WER farkı</span>

<span class="cm"># 4) Tarayıcı akışı için: WebRTC varsayılan olarak Opus kullanır; kodlama/kod çözme otomatiktir</span>
<span class="cm"># Sunucu-sunucu için: SRTP-Opus kullanın veya gerçek zamanlı olmayan için yalnızca TCP/QUIC üzerinde Opus</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Opus / kodek sıkıştırma engellendi. Eşdeğeri: PCM int16 vs float32 boyutlandırma ödünleşimi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
f32 = audio.astype(np.float32)
i16 = (np.clip(f32, -1, 1) * 32767).astype(np.int16)
print('float32 bytes:', f32.nbytes)
print('int16   bytes:', i16.nbytes, '  (', round(f32.nbytes/i16.nbytes, 1), '× compression)')
f32_back = i16.astype(np.float32) / 32767
print('Reconstruction MSE:', round(float(np.mean((f32 - f32_back) ** 2)), 9))</code></pre></div>
</div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>soundfile</code> libopus aracılığıyla doğrudan Opus yazabilir. OGG/Opus konteyneri akış ve depolama için standart sarmalayıcıdır. 2) ffmpeg daha fazla kontrol verir: <code>-application voip</code> Opus'u konuşma için ayarlar (daha düşük gecikme, gerekirse dar bant); <code>-application audio</code> müzik için ayarlar. Bit hızı <code>-b:a 24k</code> çok düşük bant genişliğinde net konuşma için sweet spot'tür. 3) Boyut karşılaştırması: Opus 24 kbps ham PCM'den 10 kat daha küçüktür ve konuşma için ayırt edilemezdir. 4) Uyumluluk: Whisper Opus ile çözülmüş sesi neredeyse hiç kalite farkı olmadan işler. WebRTC (Discord, WhatsApp, Zoom, tarayıcılar tarafından kullanılır) varsayılan olarak Opus kullanır; herhangi bir tarayıcı tabanlı ses ajanında codec seçimini düşünmenize gerek yoktur -- zaten uçtan uca Opus'tür.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: WhatsApp sesli mesajları</div><div class="example-body">WhatsApp sesli mesajları 12-16 kbps civarında 16 kHz mono Opus'ta kaydeder. 30 saniyelik bir mesaj kabaca 50 KB'tır. PCM (1 MB) veya 64 kbps'de MP3 (240 KB) ile karşılaştır. Codec seçimi WhatsApp'ın zayıf mobil ağlarda bile sesli mesajları anında teslim edebilmesinin nedenidir. Kodlayıcı telefon CPU'sunda gerçek zamanlı &lt;%5 kullanımda çalışır.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Gizlilik: Cihaz Üstü vs Bulut</h2>

<p class="l-text">Ses çıkarımını nerede çalıştırdığınız gizlilik ve ürün konumlandırması için son derece önemlidir.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Bulut</div><div class="compare-item">Sesi sunucuya gönder, metni geri al</div><div class="compare-item">En iyi model kalitesi (Whisper-large)</div><div class="compare-item">Sunucu GPU maliyetini öder</div><div class="compare-item">Ses cihazdan çıkar -- gizlilik endişesi</div></div>
<div class="compare-col"><div class="compare-title">Cihaz üstü</div><div class="compare-item">Whisper.cpp / CoreML / TFLite yerel olarak</div><div class="compare-item">Daha küçük model, daha düşük kalite</div><div class="compare-item">Sıfır devam eden maliyet</div><div class="compare-item">Cihazdan veri çıkmaz -- tasarım gereği özel</div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hibrit</div><div class="card-body">Cihazda uyandırma kelimesi + niyet, yalnızca gerektiğinde bulutta tam transkripsiyon (Siri, Alexa kalıbı).</div></div>
<div class="calc-card"><div class="card-title">İletim sırasında şifreleme</div><div class="card-body">Bulut sesi için her zaman TLS. Hassas uygulamalar için uçtan uca anahtarlar (Signal protokolü) kullan.</div></div>
<div class="calc-card"><div class="card-title">Saklama politikası</div><div class="card-body">Kullanıcı izin vermedikçe transkripsiyondan hemen sonra sesi sil. Saklamayı net belgeleyin.</div></div>
<div class="calc-card"><div class="card-title">PII redaksiyonu</div><div class="card-body">Transkriptlerde isimleri, e-postaları, telefon numaralarını, kredi kartlarını otomatik algıla; depolamadan önce maskele.</div></div>
<div class="calc-card"><div class="card-title">GDPR / HIPAA</div><div class="card-body">AB vatandaş verisini işlerseniz, GDPR geçerlidir. Sağlık sesi: ABD'de HIPAA. Uyumluluğu erken planla.</div></div>
<div class="calc-card"><div class="card-title">Denetim logları</div><div class="card-body">Güvenlik olayı incelemesi için sese her erişimi logla. Mümkün olan yerde anonimleştir.</div></div>
</div>

<div class="l-warn"><strong>Ses klonlama etiği örtüşmesi:</strong> yüklenen ses örnekleri + bulut TTS = önemsiz deepfake potansiyeli. Ses klonlama oluşturuyorsanız, net opt-in iste, üretilen sesi filigranla ve kullanıcıya yönelik akışlarda AI üretimini açıkla.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Son Mini Proje: Gerçek Zamanlı Transkripsiyon</h2>

<p class="l-text">Hepsini bir araya getirme: gerçek zamanlı bir mikrofon transkripsiyon uygulaması. Mikrofondan parçalar halinde okur, VAD'ı çalıştırır, faster-whisper ile algılanan konuşma segmentlerini yazıya döker, transkriptleri geldikçe yazdırır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install faster-whisper sounddevice silero-vad numpy</span>
<span class="kw">import</span> sounddevice <span class="kw">as</span> sd
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> queue
<span class="kw">import</span> torch
<span class="kw">from</span> faster_whisper <span class="kw">import</span> WhisperModel
<span class="kw">from</span> silero_vad <span class="kw">import</span> load_silero_vad, VADIterator

<span class="cm"># 1) Modelleri yükle</span>
asr = <span class="fn">WhisperModel</span>(<span class="str">"small"</span>, device=<span class="str">"cuda"</span>, compute_type=<span class="str">"float16"</span>)
vad_model = <span class="fn">load_silero_vad</span>()
vad = <span class="fn">VADIterator</span>(vad_model, threshold=<span class="num">0.5</span>, sampling_rate=<span class="num">16000</span>,
                   min_silence_duration_ms=<span class="num">500</span>)

<span class="cm"># 2) Mikrofon callback ile işleme thread'i arasında ses kuyruğu</span>
audio_q = queue.<span class="fn">Queue</span>()
SAMPLE_RATE = <span class="num">16000</span>
FRAME_MS = <span class="num">30</span>
FRAME_SAMPLES = SAMPLE_RATE * FRAME_MS // <span class="num">1000</span>     <span class="cm"># 480

# 3) Mikrofon callback (ses thread'inde çalışır)</span>
<span class="kw">def</span> <span class="fn">audio_callback</span>(indata, frames, time_info, status):
    audio_q.<span class="fn">put</span>(indata[:, <span class="num">0</span>].<span class="fn">copy</span>())

<span class="cm"># 4) İşleme döngüsü (ana thread)</span>
<span class="kw">def</span> <span class="fn">process_loop</span>():
    speech_buffer = []
    <span class="kw">while</span> <span class="kw">True</span>:
        chunk = audio_q.<span class="fn">get</span>()                       <span class="cm"># 30 ms

        # silero-vad fp32 [-1, 1] bekler</span>
        chunk_t = torch.<span class="fn">from_numpy</span>(chunk).<span class="fn">float</span>()
        speech_dict = <span class="fn">vad</span>(chunk_t, return_seconds=<span class="kw">True</span>)

        speech_buffer.<span class="fn">append</span>(chunk)

        <span class="kw">if</span> speech_dict <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span> <span class="kw">and</span> <span class="str">"end"</span> <span class="kw">in</span> speech_dict:
            <span class="cm"># Konuşma sonu algılandı: elimizdekini yazıya dök</span>
            audio_segment = np.<span class="fn">concatenate</span>(speech_buffer)
            speech_buffer = []

            segments, info = asr.<span class="fn">transcribe</span>(
                audio_segment, language=<span class="str">"en"</span>,
                vad_filter=<span class="kw">False</span>,        <span class="cm"># VAD'ı zaten yaptık</span>
                beam_size=<span class="num">1</span>             <span class="cm"># düşük gecikme için greedy</span>
            )
            text = <span class="str">" "</span>.<span class="fn">join</span>(s.text.<span class="fn">strip</span>() <span class="kw">for</span> s <span class="kw">in</span> segments).<span class="fn">strip</span>()
            <span class="kw">if</span> text:
                <span class="fn">print</span>(<span class="str">"&gt;"</span>, text, flush=<span class="kw">True</span>)

<span class="cm"># 5) Çalıştır</span>
<span class="kw">with</span> sd.<span class="fn">InputStream</span>(samplerate=SAMPLE_RATE, channels=<span class="num">1</span>,
                    blocksize=FRAME_SAMPLES, callback=audio_callback):
    <span class="fn">print</span>(<span class="str">"Dinliyor... durdurmak icin Ctrl+C."</span>)
    <span class="kw">try</span>:
        <span class="fn">process_loop</span>()
    <span class="kw">except</span> KeyboardInterrupt:
        <span class="fn">print</span>(<span class="str">"\\nDurdu."</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Uçtan-uca hat: VAD → "yazıya dök" → transkriptleri geldikçe yazdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
transcripts = []
chunk = 1600
for i in range(0, len(audio), chunk):
    seg = audio[i:i+chunk]
    if np.sqrt(np.mean(seg**2)) &gt; 0.05:
        # mock 'whisper' = highest-FFT-bin → token
        bin_id = int(np.argmax(np.abs(np.fft.rfft(seg))))
        transcripts.append(f'[t={i/16000:.2f}s] token_{bin_id}')
for line in transcripts:
    print(line)
print('Total tokens:', len(transcripts))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) İki model yükler: ASR için faster-whisper ve ses etkinliği için silero-vad. Her ikisi de bellekte kalır. 2) Ses callback'i ayrı bir thread'de (OS ses sistemi tarafından sürülen) çalışır ve her 30 ms parçayı bir kuyruğa koyar. Ana thread kuyruktan okur. Bu ayrım ses sisteminin durmasını önler. 3) Her 30 ms parça için: bir tampona ekle, VAD'ı çalıştır. VAD konuşma sonunu algıladığında (yapılandırılan sessizlikten sonra), tamponu boşalt ve yazıya dök. 4) <code>beam_size=1</code> en düşük gecikme için greedy kod çözmeyi kullanır; 1-2 saniyelik bir söylemeyle beam search'e karşı fark küçüktür. 5) Konuşma sonundan basılan transkripte kadar toplam gecikme kabaca <code>min_silence_duration_ms + asr_inference_time</code> ~ 500 + 200 = 700 ms'dir. Bu anlık hissin sınırındadır. 6) Cilalı bir ürün için bunu bir curses veya web UI'ye sarın, kullanıcının boşluğa basmasını için bir kesinti işleyici ekleyin, hata ayıklama için her şeyi loglayın.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: 80 satırda toplantı altyazılayıcı</div><div class="example-body">Yukarıdaki snippet'i al, ekle: (a) pyannote.audio ile konuşmacı diarizasyonu (3 satır), (b) konsol çıktısında konuşmacı başına renk (5 satır), (c) gerçek zamanlı diske SRT altyazıları yaz (10 satır), (d) önemli anları işaretlemek için klavye kısayol tuşu (5 satır). Toplam 80 satır altında, dizüstü GPU'da çalışır, konuşmacı etiketleri ve zaman damgalı altyazı dışa aktarımıyla toplantıları gerçek zamanlı yazıya döker. Tüm startup'ların sattığı şey budur.</div></div>

<div class="think-box"><div class="think-label">TEMEL ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Akış toplu işlemden temelde farklıdır: gecikme için optimize et, örtüşen pencereleri parçala, sonuçları birleştir.<br><strong>2.</strong> faster-whisper (CTranslate2 backend) HF transformers'tan 4x daha hızlıdır; insanely-fast-whisper (FA2) 8x'tir. Bunları üretimde kullan.<br><strong>3.</strong> ONNX dışa aktarımı Whisper'ı PyTorch'tan ayırır; ONNX Runtime çapraz platform dağıtım için standarttır.<br><strong>4.</strong> Nicemleme: fp16 ihmal edilebilir kayıp, int8 küçük WER artışı (%1-2), int4 daha büyük ama telefon dağıtımını olanaklı kılar. whisper.cpp Q5_K uç için sweet spot'tür.<br><strong>5.</strong> silero-vad evrensel VAD'dır: 1 MB, gerçek zamanlı, %95+ F1. Sıra algılama ve ASR-sessizlik-atlama için kullan.<br><strong>6.</strong> Ses codec'i: ses akışı için Opus 16-24 kbps -- ham'dan 10x daha küçük, neredeyse sıfır kalite kaybı.<br><strong>7.</strong> Gizlilik: mümkün olduğunda cihaz üstü (whisper.cpp, CoreML), bulut yalnızca TLS + net saklama politikası ile.<br><strong>8.</strong> Gerçek zamanlı transkripsiyon: VAD + faster-whisper + sounddevice = 50 satırda çalışan bir uygulama. Bu kursdaki ilkeler her ses ürününe genelleşir.</div></div>
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

  function latencyPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var stages = lang==='tr'
      ? ['VAD', 'Ses yakalama', 'Whisper-small', 'LLM çağrısı', 'TTS ilk parça', 'Oynatma başlangıcı']
      : ['VAD', 'Audio capture', 'Whisper-small', 'LLM call', 'TTS first chunk', 'Playback start'];
    var values = [10, 1000, 150, 500, 250, 50];
    var colors = [T.accent, '#4ecdc4', '#f87171', '#a78bfa', '#fbbf24', '#86efac'];
    var trace = {
      x: values,
      y: stages,
      type: 'bar',
      orientation: 'h',
      marker: {color: colors, line:{color:'rgba(255,255,255,0.15)', width:1}},
      text: values.map(function(v){return v+' ms';}),
      textposition: 'outside',
      textfont: {color: T.text, size: 12}
    };
    var total = values.reduce(function(a,b){return a+b;}, 0);
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Akış Ses Ajanı için Gecikme Bütçesi (toplam ' + total + ' ms)':'Latency Budget for Streaming Voice Agent (total ' + total + ' ms)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'gecikme (ms)':'latency (ms)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{automargin:true, gridcolor:T.grid},
      showlegend:false,
      margin:{t:60,r:80,b:60,l:140}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  latencyPlot('plot-al8-latency-en','en');
  latencyPlot('plot-al8-latency-tr','tr');
}, 250);</script>`
};
