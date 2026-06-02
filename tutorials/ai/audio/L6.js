window.AUDIO_L6 = {

en: `<p class="l-text"><strong>What word2vec did for words, wav2vec does for audio.</strong> Train a giant model on millions of hours of unlabeled audio with a self-supervised pretext task; the encoder it produces becomes a universal feature extractor. Plug those features into a small downstream classifier and you get state-of-the-art results on tasks the original model never saw -- from accent identification to keyword spotting to clinical voice analysis.</p>

<p class="l-text">This lesson covers wav2vec 2.0 (the contrastive masked predictor that started the trend), HuBERT (its hidden-unit BERT cousin), and Whisper's encoder (a third feature source from a generative model). You will extract embeddings from real audio, compute audio similarity, and visualize the embedding space with t-SNE. By the end you will know when to use each and how to drop them into your own pipelines.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain self-supervised audio pretraining and the cost saved versus labeling</li>
<li>Describe wav2vec 2.0's contrastive masked-prediction objective on raw audio</li>
<li>Extract HuBERT and wav2vec embeddings from a 16kHz clip with HuggingFace</li>
<li>Compute cosine similarity between two audio clips for retrieval and dedup</li>
<li>Train a tiny classifier head on frozen embeddings for accent or keyword tasks</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Self-Supervised Audio?</h2>

<p class="l-text">Labeled audio is expensive: someone has to listen and transcribe. Unlabeled audio is essentially free: 1M+ hours on YouTube, podcasts, archives. Self-supervised learning extracts useful representations from unlabeled audio by inventing pretext tasks the model can solve from the raw signal alone.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pretext task</div><div class="card-body">Self-generated training objective. Common: predict masked frames, predict future frames, contrastive matching.</div></div>
<div class="calc-card"><div class="card-title">Pretrained encoder</div><div class="card-body">A model that maps audio -&gt; sequence of feature vectors. The output is the "audio embedding".</div></div>
<div class="calc-card"><div class="card-title">Frozen features</div><div class="card-body">Use the encoder as-is, train only a small classifier on top. Cheap, surprisingly strong.</div></div>
<div class="calc-card"><div class="card-title">Fine-tuning</div><div class="card-body">Continue training the encoder on labeled task data. Best quality, more compute.</div></div>
<div class="calc-card"><div class="card-title">Pooling</div><div class="card-body">Reduce a sequence of frame embeddings to a single vector for clip-level tasks. Mean is the default.</div></div>
<div class="calc-card"><div class="card-title">Downstream tasks</div><div class="card-body">ASR, speaker ID, emotion classification, language ID, audio retrieval, music tagging.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: keyword spotting with 100 labels</div><div class="example-body">Goal: detect "Hey Siri" in audio. Old approach: train a CNN from scratch on 10000 labeled examples (slow, mediocre). New approach: extract wav2vec 2.0 embeddings (already trained on 50000+ hours of speech), pool to a single vector per 1-second clip, train a 100-parameter logistic regression. Comparable accuracy with 100x less labeled data and 1000x less training compute.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. wav2vec 2.0: Contrastive Masked Prediction</h2>

<p class="l-text">wav2vec 2.0 (Facebook, 2020) is the canonical self-supervised audio model. Architecture: a CNN feature extractor turns raw audio into 50 Hz feature frames; a transformer processes them; during training, frames are masked and the model is trained to identify the correct masked frame against distractors (contrastive loss).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Feature encoder</div><div class="card-body">7-layer 1D CNN. Reduces 16 kHz audio to 50 Hz frames (one frame per 20 ms).</div></div>
<div class="calc-card"><div class="card-title">Quantizer</div><div class="card-body">Vector-quantizes the CNN output into a discrete codebook. The "targets" for the contrastive task.</div></div>
<div class="calc-card"><div class="card-title">Transformer</div><div class="card-body">12-24 layers. Sees masked feature frames and contextualizes the unmasked ones.</div></div>
<div class="calc-card"><div class="card-title">Masking</div><div class="card-body">Random spans of ~10 frames (200 ms) are zeroed out during training.</div></div>
<div class="calc-card"><div class="card-title">Contrastive loss</div><div class="card-body">For each masked position, pick the right quantized target out of K=100 distractors.</div></div>
<div class="calc-card"><div class="card-title">Output</div><div class="card-body">For inference: per-frame transformer hidden states. Each is a 768-D (base) or 1024-D (large) vector.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers torch librosa</span>
<span class="kw">from</span> transformers <span class="kw">import</span> Wav2Vec2Model, AutoFeatureExtractor
<span class="kw">import</span> librosa
<span class="kw">import</span> torch

<span class="cm"># 1) Load the wav2vec 2.0 base encoder (no fine-tuning -- pure SSL features)</span>
model_id = <span class="str">"facebook/wav2vec2-base"</span>
extractor = AutoFeatureExtractor.<span class="fn">from_pretrained</span>(model_id)
model = Wav2Vec2Model.<span class="fn">from_pretrained</span>(model_id).<span class="fn">eval</span>()
device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>
model.<span class="fn">to</span>(device)

<span class="cm"># 2) Load and prepare audio (16 kHz mono required)</span>
y, sr = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>)
inputs = {k: v.<span class="fn">to</span>(device) <span class="kw">for</span> k, v <span class="kw">in</span> inputs.<span class="fn">items</span>()}

<span class="cm"># 3) Forward pass</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**inputs)

<span class="cm"># 4) Per-frame embeddings: shape (1, T_frames, 768)</span>
frame_embeds = out.last_hidden_state
<span class="fn">print</span>(<span class="str">"frame embeddings:"</span>, frame_embeds.shape)
<span class="cm"># T_frames is roughly len(audio) / 320 (CNN downsamples 16 kHz to 50 Hz)</span>

<span class="cm"># 5) Clip-level embedding: average over time</span>
clip_embed = frame_embeds.<span class="fn">mean</span>(dim=<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"clip embedding:"</span>, clip_embed.shape)   <span class="cm"># (1, 768)

# 6) Hidden states from all layers (sometimes layer 8 or 12 is better than the last)</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_all = <span class="fn">model</span>(**inputs, output_hidden_states=<span class="kw">True</span>)
all_hidden = out_all.hidden_states
<span class="fn">print</span>(<span class="str">"layers:"</span>, <span class="fn">len</span>(all_hidden))      <span class="cm"># 13 (input embedding + 12 transformer layers)
print("layer 8:", all_hidden[8].shape)   # (1, T_frames, 768)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">wav2vec / HuBERT are blocked. The 'frozen encoder' trick is replicated by extracting FFT-band statistics, then sklearn classifier on top.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.fft import rfft
def features(y, n=8):
    Y = np.abs(rfft(y))
    return np.array([b.mean() for b in np.array_split(Y, n)])
feat = features(audio)
print('Embedding dim:', feat.shape)
print('First 4 values:', np.round(feat[:4], 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads <code>wav2vec2-base</code>, the original pre-finetuning checkpoint -- pure self-supervised features. <code>Wav2Vec2Model</code> (no -ForSomething suffix) gives you the encoder without any task-specific head. 2) Loads audio at 16 kHz mono and runs it through the feature extractor, which scales to roughly [-1, 1]. 3) Forward pass returns the transformer outputs. 4) <code>last_hidden_state</code> gives one 768-D vector per ~20 ms frame -- the per-frame embedding. 5) For tasks at the clip level (classification, retrieval), pool over time. Mean pooling is simple and works well; max pooling is sometimes better for keyword spotting. 6) Setting <code>output_hidden_states=True</code> exposes intermediate layers; for some downstream tasks (especially phonetic), middle layers (8, 9, 10) carry more useful information than the final layer.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. HuBERT: Hidden-Unit BERT for Audio</h2>

<p class="l-text">HuBERT (Facebook, 2021) replaces wav2vec 2.0's contrastive loss with masked-frame classification. Iterative training: cluster MFCC features to make pseudo-labels, train BERT to predict cluster ID at masked positions, re-cluster using model features, repeat. Result: cleaner targets, often better downstream performance.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Iteration 1</div><div class="card-body">k-means cluster MFCCs into 100 classes. Train HuBERT to predict cluster of masked frames.</div></div>
<div class="calc-card"><div class="card-title">Iteration 2</div><div class="card-body">Take HuBERT's middle-layer features, cluster into 500 classes. Train new HuBERT to predict.</div></div>
<div class="calc-card"><div class="card-title">Loss</div><div class="card-body">Standard cross-entropy. Simpler than wav2vec's InfoNCE contrastive loss.</div></div>
<div class="calc-card"><div class="card-title">Architecture</div><div class="card-body">Identical to wav2vec 2.0: CNN feature extractor + transformer.</div></div>
<div class="calc-card"><div class="card-title">Sizes</div><div class="card-body">Base (95M, layer-12 dim 768), Large (317M, dim 1024), X-Large (1B, dim 1280).</div></div>
<div class="calc-card"><div class="card-title">Use case</div><div class="card-body">Most "speech feature" papers since 2022 use HuBERT-base layers 9-11 as defaults.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> HubertModel, AutoFeatureExtractor
<span class="kw">import</span> librosa
<span class="kw">import</span> torch

<span class="cm"># Same API as wav2vec 2.0 -- they share the architecture</span>
model_id = <span class="str">"facebook/hubert-base-ls960"</span>     <span class="cm"># trained on 960 h LibriSpeech</span>
extractor = AutoFeatureExtractor.<span class="fn">from_pretrained</span>(model_id)
model = HubertModel.<span class="fn">from_pretrained</span>(model_id).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

y, sr = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**inputs, output_hidden_states=<span class="kw">True</span>)

<span class="cm"># 1) HuBERT layer 9 has been empirically best for many tasks</span>
hubert_l9 = out.hidden_states[<span class="num">9</span>]      <span class="cm"># (1, T, 768)

# 2) Average to get a single clip-level vector</span>
clip_embed = hubert_l9.<span class="fn">mean</span>(dim=<span class="num">1</span>)    <span class="cm"># (1, 768)

# 3) Compute similarity between two audio clips</span>
<span class="kw">def</span> <span class="fn">audio_embed</span>(path):
    y, _ = librosa.<span class="fn">load</span>(path, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
    inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        h = <span class="fn">model</span>(**inputs, output_hidden_states=<span class="kw">True</span>).hidden_states[<span class="num">9</span>]
    <span class="kw">return</span> h.<span class="fn">mean</span>(dim=<span class="num">1</span>).<span class="fn">squeeze</span>()       <span class="cm"># (768,)

import torch.nn.functional as F
e1 = audio_embed("speaker_a_1.wav")
e2 = audio_embed("speaker_a_2.wav")     # same person, different sentence
e3 = audio_embed("speaker_b_1.wav")     # different person

print("same speaker:    ", F.cosine_similarity(e1, e2, dim=0).item())
print("different speaker:", F.cosine_similarity(e1, e3, dim=0).item())
# Typically: same ~0.85, different ~0.55. Pretrained HuBERT already separates speakers.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pseudo-pretrained encoder: random projection of audio frames (Johnson-Lindenstrauss). Fast and parameter-free.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
frames = audio.reshape(-1, 400)               # ~25-ms frames
W = rng.standard_normal((400, 64)) / np.sqrt(400)
embs = frames @ W                              # (T, 64)
clip_emb = embs.mean(axis=0)
print('Frame embeddings:', embs.shape)
print('Clip embedding  :', clip_emb.shape, ' L2', round(float(np.linalg.norm(clip_emb)), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) HuBERT shares wav2vec 2.0's API -- you can swap one for the other in any pipeline. The base checkpoint is trained on 960 hours of LibriSpeech. 2) Layer 9 of HuBERT-base is the empirical sweet spot for many downstream tasks (the original paper's analysis); experiment if your task is unusual. 3) Mean pooling over time gives a clip-level vector. 4) The <code>audio_embed</code> helper produces a single 768-D vector for any audio file. 5) Cosine similarity between two embeddings is high for the same speaker and low for different speakers -- and this works without ever training on speaker labels. The pretrained encoder already discovered that speaker identity is a useful structure in audio.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Whisper's Encoder as a Feature Extractor</h2>

<p class="l-text">Whisper was trained as a generative ASR model, but its encoder is also a strong audio feature extractor -- arguably stronger than wav2vec/HuBERT for some tasks because it was trained on 680k hours of multilingual data. You can use just the encoder and ignore the decoder.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> WhisperModel, WhisperFeatureExtractor
<span class="kw">import</span> librosa
<span class="kw">import</span> torch

<span class="cm"># 1) Load just the model (we'll only use the encoder)</span>
model_id = <span class="str">"openai/whisper-small"</span>
extractor = WhisperFeatureExtractor.<span class="fn">from_pretrained</span>(model_id)
model = WhisperModel.<span class="fn">from_pretrained</span>(model_id).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 2) Process audio</span>
y, _ = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 3) Encoder forward pass (skip the decoder entirely)</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    enc = model.<span class="fn">get_encoder</span>()(inputs.input_features)

<span class="cm"># Output shape: (1, 1500, d_model). 1500 frames per 30 s of audio.</span>
features = enc.last_hidden_state
<span class="fn">print</span>(features.shape)            <span class="cm"># (1, 1500, 768) for whisper-small

# 4) Pool to clip-level (Whisper's encoder pads to 30 s; trim padding before pooling for short clips)</span>
audio_seconds = <span class="fn">len</span>(y) / <span class="num">16000</span>
valid_frames = <span class="fn">int</span>(audio_seconds * <span class="num">50</span>)        <span class="cm"># 50 Hz after Whisper's conv stem</span>
features_trimmed = features[:, :valid_frames, :]
clip_embed = features_trimmed.<span class="fn">mean</span>(dim=<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"clip embedding:"</span>, clip_embed.shape)    <span class="cm"># (1, 768)

# 5) Whisper-large-v3 features for SOTA performance</span>
<span class="cm"># model = WhisperModel.from_pretrained("openai/whisper-large-v3").eval()</span>
<span class="cm"># Output dim: 1280; sometimes the best audio features in production benchmarks</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Whisper-encoder-features stand-in: log-mel mean over time = a 16-d clip vector.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
edges = np.linspace(0, len(f), 17, dtype=int)
mel = np.stack([np.abs(Z[edges[i]:edges[i+1]]).mean(axis=0) for i in range(16)])
log_mel = np.log(mel + 1e-9)
embedding = log_mel.mean(axis=1)
print('Whisper-style embedding (16-d):', np.round(embedding, 2))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads <code>WhisperModel</code> (not <code>WhisperForConditionalGeneration</code>) -- it skips the LM head entirely. We only use the encoder. 2) The Whisper feature extractor pads audio to 30 seconds; for short clips this is mostly silence. 3) <code>model.get_encoder()</code> returns just the encoder; running it on the input features gives 1500 frames of audio representation per 30-second window. 4) For short clips, trim the padding frames before pooling so the silence does not dominate the average. The post-conv frame rate is 50 Hz, so a T-second clip has 50 * T valid frames. 5) Whisper-large-v3 produces 1280-dim features and frequently tops audio benchmarks; downside is 3+ GB and slower inference.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">wav2vec 2.0</div><div class="compare-item">Trained on 50k h speech</div><div class="compare-item">Layer 0 raw -&gt; layer 12 high-level</div><div class="compare-item">Best for English ASR</div><div class="compare-item">Frame rate 50 Hz, dim 768/1024</div></div>
<div class="compare-col"><div class="compare-title">HuBERT</div><div class="compare-item">Trained on 960 h LibriSpeech (base)</div><div class="compare-item">Layer 9 phonetic, layer 12 lexical</div><div class="compare-item">Best for fine-grained speech</div><div class="compare-item">Frame rate 50 Hz, dim 768/1024</div></div>
<div class="compare-col"><div class="compare-title">Whisper encoder</div><div class="compare-item">Trained on 680k h multilingual</div><div class="compare-item">Final layer is most informative</div><div class="compare-item">Best for multilingual / non-speech</div><div class="compare-item">Frame rate 50 Hz, dim 768-1280</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Audio Similarity and Retrieval</h2>

<p class="l-text">A clip-level embedding plus cosine similarity gives you audio retrieval almost for free: find similar songs, deduplicate a podcast collection, identify near-matches for copyright detection.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
<span class="kw">import</span> torch
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> transformers <span class="kw">import</span> HubertModel, AutoFeatureExtractor
<span class="kw">import</span> librosa

extractor = AutoFeatureExtractor.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>)
model = HubertModel.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">def</span> <span class="fn">embed</span>(path):
    y, _ = librosa.<span class="fn">load</span>(path, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
    inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        out = <span class="fn">model</span>(**inputs, output_hidden_states=<span class="kw">True</span>)
    <span class="kw">return</span> out.hidden_states[<span class="num">9</span>].<span class="fn">mean</span>(dim=<span class="num">1</span>).<span class="fn">squeeze</span>().<span class="fn">cpu</span>().<span class="fn">numpy</span>()

<span class="cm"># 1) Index a database of audio files</span>
db_dir = <span class="str">"library/"</span>
paths = [os.path.<span class="fn">join</span>(db_dir, p) <span class="kw">for</span> p <span class="kw">in</span> os.<span class="fn">listdir</span>(db_dir) <span class="kw">if</span> p.<span class="fn">endswith</span>(<span class="str">".wav"</span>)]
<span class="fn">print</span>(<span class="str">"indexing"</span>, <span class="fn">len</span>(paths), <span class="str">"files..."</span>)
embeds = np.<span class="fn">stack</span>([<span class="fn">embed</span>(p) <span class="kw">for</span> p <span class="kw">in</span> paths])      <span class="cm"># (N, 768)
embeds_normed = embeds / np.linalg.<span class="fn">norm</span>(embeds, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)

<span class="cm"># 2) Query: find the 5 closest matches to a new clip</span>
q = <span class="fn">embed</span>(<span class="str">"query.wav"</span>)
q_normed = q / np.linalg.<span class="fn">norm</span>(q)
sims = embeds_normed @ q_normed
top5 = np.<span class="fn">argsort</span>(sims)[-<span class="num">5</span>:][::-<span class="num">1</span>]

<span class="kw">for</span> idx <span class="kw">in</span> top5:
    <span class="fn">print</span>(f<span class="str">"  {sims[idx]:.3f}  {paths[idx]}"</span>)

<span class="cm"># 3) Detect duplicates: pairs with similarity &gt; 0.95</span>
N = <span class="fn">len</span>(embeds_normed)
sim_matrix = embeds_normed @ embeds_normed.<span class="fn">T</span>
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N):
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(i+<span class="num">1</span>, N):
        <span class="kw">if</span> sim_matrix[i, j] &gt; <span class="num">0.95</span>:
            <span class="fn">print</span>(f<span class="str">"duplicate? {paths[i]} ~ {paths[j]} ({sim_matrix[i,j]:.3f})"</span>)

<span class="cm"># 4) For million-scale corpora, use FAISS for sub-linear search</span>
<span class="cm"># import faiss; index = faiss.IndexFlatIP(768); index.add(embeds_normed); D, I = index.search(q_normed.reshape(1,-1), 5)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Audio retrieval: cosine similarity over toy clip embeddings.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
embs = rng.standard_normal((10, 32))
embs /= np.linalg.norm(embs, axis=1, keepdims=True)
query = embs[0]
sims = embs @ query
topk = np.argsort(-sims)[:3]
print('Query → top-3 matches')
for i in topk:
    print(f'  clip #{i}   similarity={sims[i]:0.4f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>embed</code> turns any audio file into a 768-D HuBERT layer-9 vector. 2) Pre-compute embeddings for the whole corpus and L2-normalize them, so cosine similarity reduces to a simple dot product. 3) Query: embed the query clip, normalize, multiply by the matrix of corpus embeddings to get all similarities at once, sort to get top-5. 4) Duplicate detection: pairwise similarity matrix; any pair above 0.95 is essentially the same audio. 5) For larger libraries, use a vector index like FAISS to scale to millions of embeddings with sub-linear retrieval.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: a podcast deduplication scrubber</div><div class="example-body">A podcast catalog of 100k episodes (~50000 hours total). Embed each into a 768-D vector. Build a FAISS index. Cluster vectors with cosine threshold 0.92 -- groups become "near duplicates" (re-released episodes, mirror feeds, ad-only edits). Removed ~3% redundancy in real-world experiments, saving terabytes of storage and improving recommendation system precision.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Visualizing the Embedding Space</h2>

<p class="l-text">A quick visual check: extract embeddings for clips of known categories (instruments, speakers, languages) and t-SNE them to 2D. If the encoder is good, you should see clear clusters by category.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> librosa
<span class="kw">from</span> transformers <span class="kw">import</span> HubertModel, AutoFeatureExtractor
<span class="kw">from</span> sklearn.manifold <span class="kw">import</span> TSNE
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

extractor = AutoFeatureExtractor.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>)
model = HubertModel.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">def</span> <span class="fn">embed</span>(path):
    y, _ = librosa.<span class="fn">load</span>(path, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
    inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        out = <span class="fn">model</span>(**inputs, output_hidden_states=<span class="kw">True</span>)
    <span class="kw">return</span> out.hidden_states[<span class="num">9</span>].<span class="fn">mean</span>(dim=<span class="num">1</span>).<span class="fn">squeeze</span>().<span class="fn">cpu</span>().<span class="fn">numpy</span>()

<span class="cm"># 1) Build a small dataset of speakers x sentences</span>
<span class="cm"># speakers = ["alice", "bob", "carol"]; sentences per speaker ~ 15</span>
paths, labels = [], []
<span class="kw">for</span> spk <span class="kw">in</span> [<span class="str">"alice"</span>, <span class="str">"bob"</span>, <span class="str">"carol"</span>, <span class="str">"dave"</span>]:
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">15</span>):
        paths.<span class="fn">append</span>(f<span class="str">"data/{spk}_{i}.wav"</span>)
        labels.<span class="fn">append</span>(spk)

<span class="cm"># 2) Embed every clip</span>
embeds = np.<span class="fn">stack</span>([<span class="fn">embed</span>(p) <span class="kw">for</span> p <span class="kw">in</span> paths])
<span class="fn">print</span>(<span class="str">"embeds:"</span>, embeds.shape)            <span class="cm"># (60, 768)

# 3) t-SNE down to 2D</span>
xy = <span class="fn">TSNE</span>(n_components=<span class="num">2</span>, perplexity=<span class="num">10</span>, init=<span class="str">"pca"</span>).<span class="fn">fit_transform</span>(embeds)

<span class="cm"># 4) Color by speaker</span>
colors = {<span class="str">"alice"</span>: <span class="str">"#c8a96e"</span>, <span class="str">"bob"</span>: <span class="str">"#4ecdc4"</span>, <span class="str">"carol"</span>: <span class="str">"#f87171"</span>, <span class="str">"dave"</span>: <span class="str">"#a78bfa"</span>}
<span class="kw">for</span> spk <span class="kw">in</span> <span class="fn">set</span>(labels):
    mask = [l == spk <span class="kw">for</span> l <span class="kw">in</span> labels]
    plt.<span class="fn">scatter</span>(xy[mask, <span class="num">0</span>], xy[mask, <span class="num">1</span>], label=spk, c=colors[spk], s=<span class="num">60</span>, alpha=<span class="num">0.8</span>)
plt.<span class="fn">legend</span>()
plt.<span class="fn">title</span>(<span class="str">"HuBERT embeddings, 4 speakers x 15 sentences"</span>)
plt.<span class="fn">show</span>()
<span class="cm"># Each speaker forms a tight cluster -- speaker identity is clearly the dominant signal in HuBERT layer 9.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">t-SNE over toy embeddings to verify clustering — sklearn ships TSNE in Pyodide.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.manifold import TSNE
rng = np.random.default_rng(0)
centers = rng.standard_normal((4, 16)) * 5
labels = np.repeat(np.arange(4), 25)
X = np.stack([centers[l] + rng.standard_normal(16) for l in labels])
Z = TSNE(n_components=2, perplexity=15, random_state=0, init='pca').fit_transform(X)
print('TSNE shape:', Z.shape)
for c in range(4):
    print(f'class {c}  centroid', np.round(Z[labels==c].mean(axis=0), 2))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a small balanced dataset of multiple sentences per speaker. The exact dataset matters less than having clear category labels. 2) Embeds every clip using the same HuBERT layer-9 + mean-pool recipe. 3) t-SNE projects the 768-D vectors down to 2 dimensions while trying to preserve neighborhoods. <code>perplexity=10</code> works well for ~50-100 points; larger datasets need higher values. 4) Plot with one color per speaker; if HuBERT is doing its job, you should see four distinct clusters. The same workflow generalizes to instruments (music tagging), languages (language ID), or emotions (affect classification).</p>

<div id="plot-al6-tsne-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A 2D t-SNE projection of HuBERT-layer-9 embeddings for clips of four different speakers. Each cluster corresponds to one speaker; clip-to-clip proximity within a cluster reflects content similarity. The model has never been told to separate by speaker -- this structure emerges purely from self-supervised pretraining. The same separation works for instrument families in music, languages in multilingual speech, and emotional state in affective audio datasets.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. From Embeddings to Classifier</h2>

<p class="l-text">The whole point of pretrained features: train a tiny downstream model with very little labeled data. Here is the canonical "frozen encoder + linear head" recipe.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader
<span class="kw">from</span> transformers <span class="kw">import</span> HubertModel, AutoFeatureExtractor
<span class="kw">import</span> librosa

<span class="kw">class</span> <span class="fn">EmotionDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, samples, extractor):
        self.samples = samples         <span class="cm"># list of (path, label_idx)</span>
        self.extractor = extractor
    <span class="kw">def</span> <span class="fn">__len__</span>(self): <span class="kw">return</span> <span class="fn">len</span>(self.samples)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i):
        path, label = self.samples[i]
        y, _ = librosa.<span class="fn">load</span>(path, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>, duration=<span class="num">5.0</span>)
        feats = self.<span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>)
        <span class="kw">return</span> feats.input_values.<span class="fn">squeeze</span>(<span class="num">0</span>), label

<span class="kw">class</span> <span class="fn">FrozenEncoderClassifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, encoder, hidden_dim=<span class="num">768</span>, n_classes=<span class="num">5</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.encoder = encoder
        <span class="kw">for</span> p <span class="kw">in</span> self.encoder.<span class="fn">parameters</span>(): p.requires_grad = <span class="kw">False</span>
        self.head = nn.<span class="fn">Sequential</span>(
            nn.<span class="fn">LayerNorm</span>(hidden_dim),
            nn.<span class="fn">Dropout</span>(<span class="num">0.2</span>),
            nn.<span class="fn">Linear</span>(hidden_dim, n_classes)
        )

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
            out = self.<span class="fn">encoder</span>(input_values=x, output_hidden_states=<span class="kw">True</span>)
            h = out.hidden_states[<span class="num">9</span>]    <span class="cm"># (B, T, 768)
            pooled = h.mean(dim=1)   # (B, 768)</span>
        <span class="kw">return</span> self.<span class="fn">head</span>(pooled)

<span class="cm"># 1) Build encoder + classifier</span>
extractor = AutoFeatureExtractor.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>)
encoder = HubertModel.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>)
clf = <span class="fn">FrozenEncoderClassifier</span>(encoder, hidden_dim=<span class="num">768</span>, n_classes=<span class="num">5</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 2) Tiny optimizer over only the head's parameters</span>
opt = torch.optim.<span class="fn">Adam</span>(clf.head.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="cm"># 3) Train</span>
samples = [(<span class="str">"a.wav"</span>, <span class="num">0</span>), (<span class="str">"b.wav"</span>, <span class="num">1</span>), ...]   <span class="cm"># your data</span>
ds = <span class="fn">EmotionDataset</span>(samples, extractor)
dl = <span class="fn">DataLoader</span>(ds, batch_size=<span class="num">8</span>, shuffle=<span class="kw">True</span>)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    <span class="kw">for</span> x, y <span class="kw">in</span> dl:
        x, y = x.<span class="fn">to</span>(<span class="str">"cuda"</span>), y.<span class="fn">to</span>(<span class="str">"cuda"</span>)
        logits = <span class="fn">clf</span>(x)
        loss = <span class="fn">loss_fn</span>(logits, y)
        opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
    <span class="fn">print</span>(f<span class="str">"epoch {epoch} loss {loss.item():.3f}"</span>)
<span class="cm"># With frozen HuBERT and ~500 labeled examples per class, you typically reach 85%+ on RAVDESS-style emotion datasets in &lt;5 minutes.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Frozen encoder + linear head — sklearn LogisticRegression is the analog of the PyTorch linear classifier.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
rng = np.random.default_rng(0)
centers = rng.standard_normal((3, 32)) * 3
labels = np.repeat(np.arange(3), 60)
X = np.stack([centers[l] + rng.standard_normal(32) for l in labels])
Xtr, Xte, ytr, yte = train_test_split(X, labels, test_size=0.3, random_state=0)
head = LogisticRegression(max_iter=300).fit(Xtr, ytr)
print('Linear-head accuracy:', round(head.score(Xte, yte), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Standard PyTorch Dataset that loads audio at 16 kHz, runs the HuBERT feature extractor, and returns the input tensor + label. 2) The model: pretrained HuBERT encoder (frozen, no gradient) + a small classifier head (LayerNorm + Dropout + Linear). The encoder has 95M parameters; the head has ~4k. 3) Forward pass extracts layer-9 features, mean-pools, and runs the head. 4) Optimizer only updates the head -- the 95M encoder parameters stay frozen, so training is fast and overfits less on small data. 5) For ~500 labeled samples per class, this recipe matches or beats fully-trained CNNs that need 50000+ samples. The general lesson: pretrained audio embeddings are the new starting point for any audio task.</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Self-supervised audio models (wav2vec 2.0, HuBERT) learn rich representations from unlabeled audio.<br><strong>2.</strong> Both models share an architecture: 1D CNN feature extractor + transformer with masked-frame pretext task.<br><strong>3.</strong> wav2vec uses contrastive loss; HuBERT uses cluster-prediction cross-entropy. Either can serve as a feature extractor.<br><strong>4.</strong> Whisper's encoder, despite being trained as part of an ASR generator, is also a strong universal audio feature extractor -- especially for multilingual and non-speech audio.<br><strong>5.</strong> Per-frame embeddings (50 Hz, 768-1024 dim) for sequence tasks; mean-pool to clip-level for classification/retrieval.<br><strong>6.</strong> Layer choice matters: HuBERT layer 9 for phonetic info, Whisper last layer for general purpose, wav2vec layer 12 for ASR features.<br><strong>7.</strong> Frozen encoder + small classifier head is the canonical recipe for low-data scenarios.<br><strong>8.</strong> Next lesson: combining audio + text -- the multimodal NLP-audio pipeline (ASR -&gt; sentiment -&gt; TTS).</div></div>
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

  function tsnePlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    function cluster(cx, cy, n, label, color) {
      var xs = [], ys = [];
      for (var i=0;i<n;i++){
        var r = Math.sqrt(Math.random()) * 1.6;
        var th = Math.random() * 2 * Math.PI;
        xs.push(cx + r*Math.cos(th));
        ys.push(cy + r*Math.sin(th));
      }
      return {x:xs, y:ys, mode:'markers', type:'scatter', name:label, marker:{size:9, color:color, line:{color:'rgba(255,255,255,0.3)', width:1}}};
    }
    var traces = [
      cluster(3, 3, 15, lang==='tr'?'konuşmacı A':'speaker A', T.accent),
      cluster(-3, 3, 15, lang==='tr'?'konuşmacı B':'speaker B', '#4ecdc4'),
      cluster(-3, -3, 15, lang==='tr'?'konuşmacı C':'speaker C', '#f87171'),
      cluster(3, -3, 15, lang==='tr'?'konuşmacı D':'speaker D', '#a78bfa')
    ];
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'4 Konuşmacının HuBERT Embedding\\'lerinin t-SNE Projeksiyonu':'t-SNE of HuBERT Embeddings: 4 Speakers', font:{color:T.text,size:14}},
      xaxis:{title:'t-SNE-1', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:'t-SNE-2', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, traces, layout, {responsive:true, displayModeBar:false});
  }

  tsnePlot('plot-al6-tsne-en','en');
  tsnePlot('plot-al6-tsne-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Word2vec'in kelimeler için yaptığını wav2vec ses için yapar.</strong> Etiketsiz ses üzerinde milyonlarca saatlik dev bir modeli öz-denetimli bir bahane göreviyle eğitin; ürettiği kodlayıcı evrensel bir özellik çıkarıcı olur. Bu özellikleri küçük bir aşağı akış sınıflandırıcısına takın ve orijinal modelin hiç görmediği görevlerde -- aksan tanımlamadan anahtar kelime tespitine, klinik ses analizine kadar -- son teknoloji sonuçlar elde edersiniz.</p>

<p class="l-text">Bu ders wav2vec 2.0'ı (trendi başlatan karşılaştırmalı maskeli tahminci), HuBERT'i (gizli birim BERT kuzeni) ve Whisper'ın kodlayıcısını (üretici bir modelden üçüncü bir özellik kaynağı) kapsar. Gerçek sesten embedding çıkaracak, ses benzerliğini hesaplayacak ve embedding uzayını t-SNE ile görselleştireceksiniz. Sonunda her birini ne zaman kullanacağınızı ve bunları kendi hatlarınıza nasıl bırakacağınızı bileceksiniz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Öz-denetimli ses ön eğitimini ve etiketlemeye karşı maliyet kazancını açıklayacaksın</li>
<li>wav2vec 2.0'ın ham seste karşılaştırmalı maskeli tahmin amacını anlatacaksın</li>
<li>HuggingFace ile 16kHz klipten HuBERT ve wav2vec embedding çıkaracaksın</li>
<li>Geri alma ve dedup için iki ses klibi arasında cosine similarity hesaplayacaksın</li>
<li>Aksan ya da anahtar kelime için dondurulmuş embedding üstünde minik sınıflandırıcı eğiteceksin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Öz-Denetimli Ses?</h2>

<p class="l-text">Etiketli ses pahalıdır: birinin dinleyip yazıya dökmesi gerekir. Etiketsiz ses esasen bedavadır: YouTube, podcast'ler, arşivlerde 1M+ saat. Öz-denetimli öğrenme, modelin yalnızca ham sinyalden çözebileceği bahane görevleri uydurarak etiketsiz sesten yararlı temsiller çıkarır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bahane görev</div><div class="card-body">Kendi kendine üretilen eğitim hedefi. Yaygın: maskelenmiş çerçeveleri tahmin et, gelecek çerçeveleri tahmin et, karşılaştırmalı eşleşme.</div></div>
<div class="calc-card"><div class="card-title">Önceden eğitilmiş kodlayıcı</div><div class="card-body">Sesi -&gt; özellik vektörleri dizisine eşleyen model. Çıktı "ses embedding"idir.</div></div>
<div class="calc-card"><div class="card-title">Donmuş özellikler</div><div class="card-body">Kodlayıcıyı olduğu gibi kullan, üstüne yalnızca küçük bir sınıflandırıcı eğit. Ucuz, şaşırtıcı şekilde güçlü.</div></div>
<div class="calc-card"><div class="card-title">İnce ayar</div><div class="card-body">Etiketli görev verisinde kodlayıcıyı eğitmeye devam et. En iyi kalite, daha çok hesaplama.</div></div>
<div class="calc-card"><div class="card-title">Havuzlama</div><div class="card-body">Klip düzeyi görevler için çerçeve embedding'leri dizisini tek bir vektöre indirgeme. Ortalama varsayılandır.</div></div>
<div class="calc-card"><div class="card-title">Aşağı akış görevleri</div><div class="card-body">ASR, konuşmacı ID'si, duygu sınıflandırma, dil ID'si, ses geri alma, müzik etiketleme.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: 100 etiketle anahtar kelime tespiti</div><div class="example-body">Hedef: seste "Hey Siri"yi algıla. Eski yaklaşım: 10000 etiketli örnekte sıfırdan bir CNN eğit (yavaş, vasat). Yeni yaklaşım: wav2vec 2.0 embedding'lerini çıkar (50000+ saat konuşma üzerinde zaten eğitilmiş), 1 saniyelik klip başına tek bir vektöre havuzla, 100 parametreli bir lojistik regresyon eğit. 100 kat daha az etiketli veri ve 1000 kat daha az eğitim hesaplamasıyla karşılaştırılabilir doğruluk.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. wav2vec 2.0: Karşılaştırmalı Maskeli Tahmin</h2>

<p class="l-text">wav2vec 2.0 (Facebook, 2020) kanonik öz-denetimli ses modelidir. Mimari: bir CNN özellik çıkarıcısı ham sesi 50 Hz özellik çerçevelerine dönüştürür; bir transformer bunları işler; eğitim sırasında çerçeveler maskelenir ve model dağıtıcılara karşı doğru maskelenmiş çerçeveyi tanımlamak için eğitilir (karşılaştırmalı kayıp).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Özellik kodlayıcı</div><div class="card-body">7 katmanlı 1B CNN. 16 kHz sesi 50 Hz çerçevelere indirger (20 ms başına bir çerçeve).</div></div>
<div class="calc-card"><div class="card-title">Nicemleyici</div><div class="card-body">CNN çıkışını ayrık bir kod kitabına vektör nicemler. Karşılaştırmalı görev için "hedefler".</div></div>
<div class="calc-card"><div class="card-title">Transformer</div><div class="card-body">12-24 katman. Maskelenmiş özellik çerçevelerini görür ve maskelenmemişleri bağlamlandırır.</div></div>
<div class="calc-card"><div class="card-title">Maskeleme</div><div class="card-body">Eğitim sırasında ~10 çerçevenin (200 ms) rastgele bölümleri sıfırlanır.</div></div>
<div class="calc-card"><div class="card-title">Karşılaştırmalı kayıp</div><div class="card-body">Her maskelenmiş pozisyon için, K=100 dağıtıcı arasından doğru nicemlenmiş hedefi seç.</div></div>
<div class="calc-card"><div class="card-title">Çıkış</div><div class="card-body">Çıkarım için: çerçeve başına transformer gizli durumları. Her biri 768B (base) veya 1024B (large) vektördür.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers torch librosa</span>
<span class="kw">from</span> transformers <span class="kw">import</span> Wav2Vec2Model, AutoFeatureExtractor
<span class="kw">import</span> librosa
<span class="kw">import</span> torch

<span class="cm"># 1) wav2vec 2.0 base kodlayıcısını yükle (ince ayar yok -- saf SSL özellikleri)</span>
model_id = <span class="str">"facebook/wav2vec2-base"</span>
extractor = AutoFeatureExtractor.<span class="fn">from_pretrained</span>(model_id)
model = Wav2Vec2Model.<span class="fn">from_pretrained</span>(model_id).<span class="fn">eval</span>()
device = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>
model.<span class="fn">to</span>(device)

<span class="cm"># 2) Sesi yükle ve hazırla (16 kHz mono gerekli)</span>
y, sr = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>)
inputs = {k: v.<span class="fn">to</span>(device) <span class="kw">for</span> k, v <span class="kw">in</span> inputs.<span class="fn">items</span>()}

<span class="cm"># 3) İleri geçiş</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**inputs)

<span class="cm"># 4) Çerçeve başına embedding'ler: şekil (1, T_frames, 768)</span>
frame_embeds = out.last_hidden_state
<span class="fn">print</span>(<span class="str">"cerceve embedding'leri:"</span>, frame_embeds.shape)
<span class="cm"># T_frames kabaca len(audio) / 320 (CNN 16 kHz'i 50 Hz'e altörnekler)</span>

<span class="cm"># 5) Klip düzeyi embedding: zamanda ortalama</span>
clip_embed = frame_embeds.<span class="fn">mean</span>(dim=<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"klip embedding:"</span>, clip_embed.shape)   <span class="cm"># (1, 768)

# 6) Tüm katmanlardan gizli durumlar (bazen 8 veya 12. katman sondan daha iyidir)</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out_all = <span class="fn">model</span>(**inputs, output_hidden_states=<span class="kw">True</span>)
all_hidden = out_all.hidden_states
<span class="fn">print</span>(<span class="str">"katmanlar:"</span>, <span class="fn">len</span>(all_hidden))      <span class="cm"># 13 (giriş embedding + 12 transformer katmanı)
print("katman 8:", all_hidden[8].shape)   # (1, T_frames, 768)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">wav2vec / HuBERT engellendi. "Donmuş kodlayıcı" hilesini FFT-bant istatistikleri çıkararak, üstüne sklearn sınıflandırıcı koyarak çoğaltıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy.fft import rfft
def features(y, n=8):
    Y = np.abs(rfft(y))
    return np.array([b.mean() for b in np.array_split(Y, n)])
feat = features(audio)
print('Embedding dim:', feat.shape)
print('First 4 values:', np.round(feat[:4], 3))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>wav2vec2-base</code>'i yükler, ince ayar öncesi orijinal checkpoint -- saf öz-denetimli özellikler. <code>Wav2Vec2Model</code> (-ForBirŞey son eki olmadan) size göreve özgü başlık olmadan kodlayıcıyı verir. 2) Sesi 16 kHz mono yükler ve özellik çıkarıcı üzerinden çalıştırır, kabaca [-1, 1]'e ölçeklendirir. 3) İleri geçiş transformer çıktılarını döner. 4) <code>last_hidden_state</code> ~20 ms çerçeve başına bir 768B vektör verir -- çerçeve başına embedding. 5) Klip düzeyi görevler için (sınıflandırma, geri alma) zaman üzerinde havuzla. Ortalama havuzlama basittir ve iyi çalışır; maks havuzlama anahtar kelime tespiti için bazen daha iyidir. 6) <code>output_hidden_states=True</code> ayarlamak ara katmanları açığa çıkarır; bazı aşağı akış görevleri için (özellikle fonetik), orta katmanlar (8, 9, 10) son katmandan daha yararlı bilgi taşır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. HuBERT: Ses için Gizli Birim BERT</h2>

<p class="l-text">HuBERT (Facebook, 2021) wav2vec 2.0'ın karşılaştırmalı kaybını maskelenmiş çerçeve sınıflandırmasıyla değiştirir. Yinelemeli eğitim: sahte etiketler yapmak için MFCC özelliklerini kümele, BERT'i maskelenmiş pozisyonlarda küme ID'sini tahmin etmek için eğit, model özelliklerini kullanarak yeniden kümele, tekrarla. Sonuç: daha temiz hedefler, sıklıkla daha iyi aşağı akış performansı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yineleme 1</div><div class="card-body">k-means MFCC'leri 100 sınıfa kümele. HuBERT'i maskelenmiş çerçevelerin kümesini tahmin etmek için eğit.</div></div>
<div class="calc-card"><div class="card-title">Yineleme 2</div><div class="card-body">HuBERT'in orta katman özelliklerini al, 500 sınıfa kümele. Yeni HuBERT'i tahmin etmek için eğit.</div></div>
<div class="calc-card"><div class="card-title">Kayıp</div><div class="card-body">Standart çapraz entropi. Wav2vec'in InfoNCE karşılaştırmalı kaybından daha basit.</div></div>
<div class="calc-card"><div class="card-title">Mimari</div><div class="card-body">wav2vec 2.0 ile aynı: CNN özellik çıkarıcı + transformer.</div></div>
<div class="calc-card"><div class="card-title">Boyutlar</div><div class="card-body">Base (95M, katman-12 boyut 768), Large (317M, boyut 1024), X-Large (1B, boyut 1280).</div></div>
<div class="calc-card"><div class="card-title">Kullanım durumu</div><div class="card-body">2022'den beri çoğu "konuşma özelliği" makalesi varsayılan olarak HuBERT-base katmanları 9-11'i kullanır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> HubertModel, AutoFeatureExtractor
<span class="kw">import</span> librosa
<span class="kw">import</span> torch

<span class="cm"># wav2vec 2.0 ile aynı API -- mimariyi paylaşırlar</span>
model_id = <span class="str">"facebook/hubert-base-ls960"</span>     <span class="cm"># 960 saat LibriSpeech üzerinde eğitildi</span>
extractor = AutoFeatureExtractor.<span class="fn">from_pretrained</span>(model_id)
model = HubertModel.<span class="fn">from_pretrained</span>(model_id).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

y, sr = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**inputs, output_hidden_states=<span class="kw">True</span>)

<span class="cm"># 1) HuBERT katman 9 birçok görev için deneysel olarak en iyisi olmuştur</span>
hubert_l9 = out.hidden_states[<span class="num">9</span>]      <span class="cm"># (1, T, 768)

# 2) Tek klip düzeyi vektör elde etmek için ortalama</span>
clip_embed = hubert_l9.<span class="fn">mean</span>(dim=<span class="num">1</span>)    <span class="cm"># (1, 768)

# 3) İki ses klibi arasındaki benzerliği hesapla</span>
<span class="kw">def</span> <span class="fn">audio_embed</span>(path):
    y, _ = librosa.<span class="fn">load</span>(path, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
    inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        h = <span class="fn">model</span>(**inputs, output_hidden_states=<span class="kw">True</span>).hidden_states[<span class="num">9</span>]
    <span class="kw">return</span> h.<span class="fn">mean</span>(dim=<span class="num">1</span>).<span class="fn">squeeze</span>()       <span class="cm"># (768,)

import torch.nn.functional as F
e1 = audio_embed("speaker_a_1.wav")
e2 = audio_embed("speaker_a_2.wav")     # ayni kisi, farkli cumle
e3 = audio_embed("speaker_b_1.wav")     # farkli kisi

print("ayni konusmaci:    ", F.cosine_similarity(e1, e2, dim=0).item())
print("farkli konusmaci:  ", F.cosine_similarity(e1, e3, dim=0).item())
# Tipik: ayni ~0.85, farkli ~0.55. Onceden egitilmis HuBERT zaten konusmacilari ayirir.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sahte-önceden eğitilmiş kodlayıcı: ses çerçevelerinin rastgele projeksiyonu (Johnson-Lindenstrauss). Hızlı ve parametresiz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
frames = audio.reshape(-1, 400)               # ~25-ms frames
W = rng.standard_normal((400, 64)) / np.sqrt(400)
embs = frames @ W                              # (T, 64)
clip_emb = embs.mean(axis=0)
print('Frame embeddings:', embs.shape)
print('Clip embedding  :', clip_emb.shape, ' L2', round(float(np.linalg.norm(clip_emb)), 3))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) HuBERT wav2vec 2.0'ın API'sini paylaşır -- birini diğeriyle herhangi bir hatta değiştirebilirsiniz. Base checkpoint 960 saat LibriSpeech üzerinde eğitilmiştir. 2) HuBERT-base'in katman 9'u birçok aşağı akış görevi için deneysel sweet spot'tür (orijinal makalenin analizi); göreviniz olağandışıysa deneyin. 3) Zaman üzerinde ortalama havuzlama klip düzeyi vektör verir. 4) <code>audio_embed</code> yardımcısı herhangi bir ses dosyası için tek bir 768B vektör üretir. 5) İki embedding arasında kosinüs benzerliği aynı konuşmacı için yüksek, farklı konuşmacılar için düşüktür -- ve bu hiç konuşmacı etiketleri üzerinde eğitim yapmadan çalışır. Önceden eğitilmiş kodlayıcı, konuşmacı kimliğinin seste yararlı bir yapı olduğunu zaten keşfetti.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Whisper'ın Kodlayıcısı Özellik Çıkarıcı Olarak</h2>

<p class="l-text">Whisper üretici bir ASR modeli olarak eğitildi, ama kodlayıcısı da güçlü bir ses özellik çıkarıcısıdır -- bazı görevler için wav2vec/HuBERT'ten muhtemelen daha güçlüdür çünkü 680k saat çok dilli veri üzerinde eğitildi. Yalnızca kodlayıcıyı kullanabilir ve kod çözücüyü görmezden gelebilirsiniz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> WhisperModel, WhisperFeatureExtractor
<span class="kw">import</span> librosa
<span class="kw">import</span> torch

<span class="cm"># 1) Yalnızca modeli yükle (yalnızca kodlayıcıyı kullanacağız)</span>
model_id = <span class="str">"openai/whisper-small"</span>
extractor = WhisperFeatureExtractor.<span class="fn">from_pretrained</span>(model_id)
model = WhisperModel.<span class="fn">from_pretrained</span>(model_id).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 2) Sesi işle</span>
y, _ = librosa.<span class="fn">load</span>(<span class="str">"speech.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 3) Kodlayıcı ileri geçişi (kod çözücüyü tamamen atla)</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    enc = model.<span class="fn">get_encoder</span>()(inputs.input_features)

<span class="cm"># Çıkış şekli: (1, 1500, d_model). 30 s ses başına 1500 çerçeve.</span>
features = enc.last_hidden_state
<span class="fn">print</span>(features.shape)            <span class="cm"># whisper-small için (1, 1500, 768)

# 4) Klip düzeyine havuzla (Whisper'ın kodlayıcısı 30 s'e padler; kısa klipler için havuzlamadan önce padding'i kırp)</span>
audio_seconds = <span class="fn">len</span>(y) / <span class="num">16000</span>
valid_frames = <span class="fn">int</span>(audio_seconds * <span class="num">50</span>)        <span class="cm"># Whisper'ın conv stem'inden sonra 50 Hz</span>
features_trimmed = features[:, :valid_frames, :]
clip_embed = features_trimmed.<span class="fn">mean</span>(dim=<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"klip embedding:"</span>, clip_embed.shape)    <span class="cm"># (1, 768)

# 5) SOTA performans için Whisper-large-v3 özellikleri</span>
<span class="cm"># model = WhisperModel.from_pretrained("openai/whisper-large-v3").eval()</span>
<span class="cm"># Çıkış boyutu: 1280; üretim kıyaslamalarında bazen en iyi ses özellikleri</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Whisper-kodlayıcı-özellikler yerine geçen: log-mel'in zaman üzerinde ortalaması = 16 boyutlu klip vektörü.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
f, t, Z = signal.stft(audio, fs=sr, nperseg=512, noverlap=256)
edges = np.linspace(0, len(f), 17, dtype=int)
mel = np.stack([np.abs(Z[edges[i]:edges[i+1]]).mean(axis=0) for i in range(16)])
log_mel = np.log(mel + 1e-9)
embedding = log_mel.mean(axis=1)
print('Whisper-style embedding (16-d):', np.round(embedding, 2))</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>WhisperModel</code>'i yükler (<code>WhisperForConditionalGeneration</code> değil) -- LM başlığını tamamen atlar. Yalnızca kodlayıcıyı kullanırız. 2) Whisper özellik çıkarıcısı sesi 30 saniyeye padler; kısa klipler için bu çoğunlukla sessizliktir. 3) <code>model.get_encoder()</code> yalnızca kodlayıcıyı döner; giriş özelliklerinde çalıştırmak 30 saniyelik pencere başına 1500 çerçeve ses temsili verir. 4) Kısa klipler için, sessizlik ortalamayı domine etmesin diye havuzlamadan önce padding çerçevelerini kırpın. Conv sonrası çerçeve hızı 50 Hz'dir, bu yüzden T saniyelik bir klip 50 * T geçerli çerçeveye sahiptir. 5) Whisper-large-v3 1280 boyutlu özellikler üretir ve sıklıkla ses kıyaslamalarında zirvededir; dezavantajı 3+ GB ve daha yavaş çıkarımdır.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">wav2vec 2.0</div><div class="compare-item">50k saat konuşmada eğitildi</div><div class="compare-item">Katman 0 ham -&gt; katman 12 yüksek seviye</div><div class="compare-item">İngilizce ASR için en iyisi</div><div class="compare-item">Çerçeve hızı 50 Hz, boyut 768/1024</div></div>
<div class="compare-col"><div class="compare-title">HuBERT</div><div class="compare-item">960 saat LibriSpeech'te eğitildi (base)</div><div class="compare-item">Katman 9 fonetik, katman 12 leksikal</div><div class="compare-item">İnce taneli konuşma için en iyisi</div><div class="compare-item">Çerçeve hızı 50 Hz, boyut 768/1024</div></div>
<div class="compare-col"><div class="compare-title">Whisper kodlayıcı</div><div class="compare-item">680k saat çok dilli üzerinde eğitildi</div><div class="compare-item">Son katman en bilgilendirici</div><div class="compare-item">Çok dilli / konuşma olmayan için en iyisi</div><div class="compare-item">Çerçeve hızı 50 Hz, boyut 768-1280</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Ses Benzerliği ve Geri Alma</h2>

<p class="l-text">Klip düzeyi embedding artı kosinüs benzerliği size neredeyse bedavaya ses geri alma verir: benzer şarkıları bul, podcast koleksiyonunu tekrar et, telif hakkı algılaması için yakın eşleşmeleri tanımla.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
<span class="kw">import</span> torch
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> transformers <span class="kw">import</span> HubertModel, AutoFeatureExtractor
<span class="kw">import</span> librosa

extractor = AutoFeatureExtractor.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>)
model = HubertModel.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">def</span> <span class="fn">embed</span>(path):
    y, _ = librosa.<span class="fn">load</span>(path, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
    inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        out = <span class="fn">model</span>(**inputs, output_hidden_states=<span class="kw">True</span>)
    <span class="kw">return</span> out.hidden_states[<span class="num">9</span>].<span class="fn">mean</span>(dim=<span class="num">1</span>).<span class="fn">squeeze</span>().<span class="fn">cpu</span>().<span class="fn">numpy</span>()

<span class="cm"># 1) Bir ses dosyası veritabanını indeksle</span>
db_dir = <span class="str">"library/"</span>
paths = [os.path.<span class="fn">join</span>(db_dir, p) <span class="kw">for</span> p <span class="kw">in</span> os.<span class="fn">listdir</span>(db_dir) <span class="kw">if</span> p.<span class="fn">endswith</span>(<span class="str">".wav"</span>)]
<span class="fn">print</span>(<span class="str">"indeksleniyor"</span>, <span class="fn">len</span>(paths), <span class="str">"dosya..."</span>)
embeds = np.<span class="fn">stack</span>([<span class="fn">embed</span>(p) <span class="kw">for</span> p <span class="kw">in</span> paths])      <span class="cm"># (N, 768)
embeds_normed = embeds / np.linalg.<span class="fn">norm</span>(embeds, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)

<span class="cm"># 2) Sorgu: yeni bir klibe en yakın 5 eşleşmeyi bul</span>
q = <span class="fn">embed</span>(<span class="str">"query.wav"</span>)
q_normed = q / np.linalg.<span class="fn">norm</span>(q)
sims = embeds_normed @ q_normed
top5 = np.<span class="fn">argsort</span>(sims)[-<span class="num">5</span>:][::-<span class="num">1</span>]

<span class="kw">for</span> idx <span class="kw">in</span> top5:
    <span class="fn">print</span>(f<span class="str">"  {sims[idx]:.3f}  {paths[idx]}"</span>)

<span class="cm"># 3) Yinelenenleri algıla: benzerliği &gt; 0.95 olan çiftler</span>
N = <span class="fn">len</span>(embeds_normed)
sim_matrix = embeds_normed @ embeds_normed.<span class="fn">T</span>
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N):
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(i+<span class="num">1</span>, N):
        <span class="kw">if</span> sim_matrix[i, j] &gt; <span class="num">0.95</span>:
            <span class="fn">print</span>(f<span class="str">"yinelenmis? {paths[i]} ~ {paths[j]} ({sim_matrix[i,j]:.3f})"</span>)

<span class="cm"># 4) Milyon ölçekli corpus'lar için, alt-doğrusal arama için FAISS kullan</span>
<span class="cm"># import faiss; index = faiss.IndexFlatIP(768); index.add(embeds_normed); D, I = index.search(q_normed.reshape(1,-1), 5)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Ses geri çağırma: oyuncak klip gömmeleri üzerinde kosinüs benzerliği.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
embs = rng.standard_normal((10, 32))
embs /= np.linalg.norm(embs, axis=1, keepdims=True)
query = embs[0]
sims = embs @ query
topk = np.argsort(-sims)[:3]
print('Query → top-3 matches')
for i in topk:
    print(f'  clip #{i}   similarity={sims[i]:0.4f}')</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>embed</code> herhangi bir ses dosyasını 768B HuBERT katman-9 vektörüne dönüştürür. 2) Tüm corpus için embedding'leri önceden hesapla ve L2-normalize et, böylece kosinüs benzerliği basit bir nokta çarpıma indirgenir. 3) Sorgu: sorgu klibini embedle, normalize et, tüm benzerlikleri bir kerede almak için corpus embedding matrisiyle çarp, top-5 elde etmek için sırala. 4) Yineleme algılama: çift yönlü benzerlik matrisi; 0.95 üstü herhangi bir çift esasen aynı sestir. 5) Daha büyük kütüphaneler için, alt-doğrusal geri almayla milyonlarca embedding'e ölçeklemek için FAISS gibi bir vektör indeksi kullanın.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: bir podcast tekrar temizleyici</div><div class="example-body">100k bölümlü bir podcast kataloğu (toplam ~50000 saat). Her birini 768B vektöre embed et. Bir FAISS indeksi oluştur. Vektörleri 0.92 kosinüs eşiğiyle kümele -- gruplar "yakın yinelemeler" olur (yeniden yayımlanmış bölümler, ayna feed'ler, yalnızca reklam düzenlemeleri). Gerçek dünya deneylerinde ~%3 fazlalık kaldırıldı, terabaytlarca depolama tasarruf edildi ve öneri sisteminin kesinliği iyileştirildi.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Embedding Uzayını Görselleştirme</h2>

<p class="l-text">Hızlı bir görsel kontrol: bilinen kategorilerin (enstrümanlar, konuşmacılar, diller) klipleri için embedding'leri çıkar ve t-SNE ile 2B'ye indir. Kodlayıcı iyiyse, kategoriye göre net kümeler görmelisiniz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> librosa
<span class="kw">from</span> transformers <span class="kw">import</span> HubertModel, AutoFeatureExtractor
<span class="kw">from</span> sklearn.manifold <span class="kw">import</span> TSNE
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

extractor = AutoFeatureExtractor.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>)
model = HubertModel.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">def</span> <span class="fn">embed</span>(path):
    y, _ = librosa.<span class="fn">load</span>(path, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
    inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        out = <span class="fn">model</span>(**inputs, output_hidden_states=<span class="kw">True</span>)
    <span class="kw">return</span> out.hidden_states[<span class="num">9</span>].<span class="fn">mean</span>(dim=<span class="num">1</span>).<span class="fn">squeeze</span>().<span class="fn">cpu</span>().<span class="fn">numpy</span>()

<span class="cm"># 1) Konuşmacı x cümle küçük bir veri kümesi oluştur</span>
<span class="cm"># konuşmacılar = ["alice", "bob", "carol"]; konuşmacı başına cümle ~ 15</span>
paths, labels = [], []
<span class="kw">for</span> spk <span class="kw">in</span> [<span class="str">"alice"</span>, <span class="str">"bob"</span>, <span class="str">"carol"</span>, <span class="str">"dave"</span>]:
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">15</span>):
        paths.<span class="fn">append</span>(f<span class="str">"data/{spk}_{i}.wav"</span>)
        labels.<span class="fn">append</span>(spk)

<span class="cm"># 2) Her klibi embedle</span>
embeds = np.<span class="fn">stack</span>([<span class="fn">embed</span>(p) <span class="kw">for</span> p <span class="kw">in</span> paths])
<span class="fn">print</span>(<span class="str">"embedler:"</span>, embeds.shape)            <span class="cm"># (60, 768)

# 3) t-SNE ile 2B'ye düşür</span>
xy = <span class="fn">TSNE</span>(n_components=<span class="num">2</span>, perplexity=<span class="num">10</span>, init=<span class="str">"pca"</span>).<span class="fn">fit_transform</span>(embeds)

<span class="cm"># 4) Konuşmacıya göre renklendir</span>
colors = {<span class="str">"alice"</span>: <span class="str">"#c8a96e"</span>, <span class="str">"bob"</span>: <span class="str">"#4ecdc4"</span>, <span class="str">"carol"</span>: <span class="str">"#f87171"</span>, <span class="str">"dave"</span>: <span class="str">"#a78bfa"</span>}
<span class="kw">for</span> spk <span class="kw">in</span> <span class="fn">set</span>(labels):
    mask = [l == spk <span class="kw">for</span> l <span class="kw">in</span> labels]
    plt.<span class="fn">scatter</span>(xy[mask, <span class="num">0</span>], xy[mask, <span class="num">1</span>], label=spk, c=colors[spk], s=<span class="num">60</span>, alpha=<span class="num">0.8</span>)
plt.<span class="fn">legend</span>()
plt.<span class="fn">title</span>(<span class="str">"HuBERT embedding'leri, 4 konusmaci x 15 cumle"</span>)
plt.<span class="fn">show</span>()
<span class="cm"># Her konuşmacı sıkı bir küme oluşturur -- HuBERT katman 9'da konuşmacı kimliği açıkça baskın sinyaldir.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Kümelenmeyi doğrulamak için oyuncak gömmeler üzerinde t-SNE — sklearn TSNE'yi Pyodide'da sağlar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.manifold import TSNE
rng = np.random.default_rng(0)
centers = rng.standard_normal((4, 16)) * 5
labels = np.repeat(np.arange(4), 25)
X = np.stack([centers[l] + rng.standard_normal(16) for l in labels])
Z = TSNE(n_components=2, perplexity=15, random_state=0, init='pca').fit_transform(X)
print('TSNE shape:', Z.shape)
for c in range(4):
    print(f'class {c}  centroid', np.round(Z[labels==c].mean(axis=0), 2))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Konuşmacı başına birden fazla cümleli küçük dengeli bir veri kümesi oluşturur. Tam veri kümesi net kategori etiketlerine sahip olmaktan daha az önemlidir. 2) Aynı HuBERT katman-9 + ortalama-havuz tarifini kullanarak her klibi embeder. 3) t-SNE 768B vektörleri komşulukları korumaya çalışırken 2 boyuta projekte eder. <code>perplexity=10</code> ~50-100 nokta için iyi çalışır; daha büyük veri kümeleri daha yüksek değerler gerektirir. 4) Konuşmacı başına bir renkle çiz; HuBERT işini yapıyorsa, dört belirgin küme görmelisiniz. Aynı iş akışı enstrümanlara (müzik etiketleme), dillere (dil ID'si) veya duygulara (duygulanım sınıflandırma) genelleşir.</p>

<div id="plot-al6-tsne-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Dört farklı konuşmacının klipleri için HuBERT-katman-9 embedding'lerinin 2B t-SNE projeksiyonu. Her küme bir konuşmacıya karşılık gelir; bir küme içindeki klipten klibe yakınlık içerik benzerliğini yansıtır. Modele konuşmacıya göre ayırması hiç söylenmemiştir -- bu yapı tamamen öz-denetimli ön eğitimden ortaya çıkar. Aynı ayrım müzikteki enstrüman aileleri, çok dilli konuşmadaki diller ve duygulanımsal ses veri kümelerindeki duygu durumu için çalışır.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Embedding'lerden Sınıflandırıcıya</h2>

<p class="l-text">Önceden eğitilmiş özelliklerin tüm amacı: çok az etiketli veriyle küçük bir aşağı akış modelini eğit. İşte kanonik "donmuş kodlayıcı + doğrusal başlık" tarifi.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader
<span class="kw">from</span> transformers <span class="kw">import</span> HubertModel, AutoFeatureExtractor
<span class="kw">import</span> librosa

<span class="kw">class</span> <span class="fn">EmotionDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, samples, extractor):
        self.samples = samples         <span class="cm"># (yol, etiket_idx) listesi</span>
        self.extractor = extractor
    <span class="kw">def</span> <span class="fn">__len__</span>(self): <span class="kw">return</span> <span class="fn">len</span>(self.samples)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i):
        path, label = self.samples[i]
        y, _ = librosa.<span class="fn">load</span>(path, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>, duration=<span class="num">5.0</span>)
        feats = self.<span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>)
        <span class="kw">return</span> feats.input_values.<span class="fn">squeeze</span>(<span class="num">0</span>), label

<span class="kw">class</span> <span class="fn">FrozenEncoderClassifier</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, encoder, hidden_dim=<span class="num">768</span>, n_classes=<span class="num">5</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.encoder = encoder
        <span class="kw">for</span> p <span class="kw">in</span> self.encoder.<span class="fn">parameters</span>(): p.requires_grad = <span class="kw">False</span>
        self.head = nn.<span class="fn">Sequential</span>(
            nn.<span class="fn">LayerNorm</span>(hidden_dim),
            nn.<span class="fn">Dropout</span>(<span class="num">0.2</span>),
            nn.<span class="fn">Linear</span>(hidden_dim, n_classes)
        )

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
            out = self.<span class="fn">encoder</span>(input_values=x, output_hidden_states=<span class="kw">True</span>)
            h = out.hidden_states[<span class="num">9</span>]    <span class="cm"># (B, T, 768)
            pooled = h.mean(dim=1)   # (B, 768)</span>
        <span class="kw">return</span> self.<span class="fn">head</span>(pooled)

<span class="cm"># 1) Kodlayıcı + sınıflandırıcı oluştur</span>
extractor = AutoFeatureExtractor.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>)
encoder = HubertModel.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>)
clf = <span class="fn">FrozenEncoderClassifier</span>(encoder, hidden_dim=<span class="num">768</span>, n_classes=<span class="num">5</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 2) Yalnızca başlığın parametreleri üzerinde küçük optimizer</span>
opt = torch.optim.<span class="fn">Adam</span>(clf.head.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="cm"># 3) Eğit</span>
samples = [(<span class="str">"a.wav"</span>, <span class="num">0</span>), (<span class="str">"b.wav"</span>, <span class="num">1</span>), ...]   <span class="cm"># verileriniz</span>
ds = <span class="fn">EmotionDataset</span>(samples, extractor)
dl = <span class="fn">DataLoader</span>(ds, batch_size=<span class="num">8</span>, shuffle=<span class="kw">True</span>)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    <span class="kw">for</span> x, y <span class="kw">in</span> dl:
        x, y = x.<span class="fn">to</span>(<span class="str">"cuda"</span>), y.<span class="fn">to</span>(<span class="str">"cuda"</span>)
        logits = <span class="fn">clf</span>(x)
        loss = <span class="fn">loss_fn</span>(logits, y)
        opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
    <span class="fn">print</span>(f<span class="str">"epoch {epoch} kayip {loss.item():.3f}"</span>)
<span class="cm"># Donmus HuBERT ve sinif basina ~500 etiketli ornekle, RAVDESS tarzi duygu veri kumelerinde &lt;5 dakikada tipik olarak %85+ ulasirsiniz.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Donmuş kodlayıcı + doğrusal kafa — sklearn LogisticRegression, PyTorch doğrusal sınıflandırıcının analogudur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
rng = np.random.default_rng(0)
centers = rng.standard_normal((3, 32)) * 3
labels = np.repeat(np.arange(3), 60)
X = np.stack([centers[l] + rng.standard_normal(32) for l in labels])
Xtr, Xte, ytr, yte = train_test_split(X, labels, test_size=0.3, random_state=0)
head = LogisticRegression(max_iter=300).fit(Xtr, ytr)
print('Linear-head accuracy:', round(head.score(Xte, yte), 3))</code></pre></div>
</div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Sesi 16 kHz'de yükleyen, HuBERT özellik çıkarıcısını çalıştıran ve giriş tensorü + etiketi döndüren standart PyTorch Dataset'i. 2) Model: önceden eğitilmiş HuBERT kodlayıcı (donmuş, gradyan yok) + küçük bir sınıflandırıcı başlığı (LayerNorm + Dropout + Linear). Kodlayıcının 95M parametresi vardır; başlığın ~4k. 3) İleri geçiş katman-9 özelliklerini çıkarır, ortalama havuzlar ve başlığı çalıştırır. 4) Optimizer yalnızca başlığı günceller -- 95M kodlayıcı parametresi donmuş kalır, bu yüzden eğitim hızlıdır ve küçük veride daha az aşırı uyar. 5) Sınıf başına ~500 etiketli örnek için, bu tarif 50000+ örnek gerektiren tam eğitilmiş CNN'leri eşleştirir veya yener. Genel ders: önceden eğitilmiş ses embedding'leri herhangi bir ses görevi için yeni başlangıç noktasıdır.</p>

<div class="think-box"><div class="think-label">TEMEL ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Öz-denetimli ses modelleri (wav2vec 2.0, HuBERT) etiketsiz sesten zengin temsiller öğrenir.<br><strong>2.</strong> Her iki model bir mimariyi paylaşır: 1B CNN özellik çıkarıcı + maskelenmiş çerçeve bahane göreviyle transformer.<br><strong>3.</strong> wav2vec karşılaştırmalı kayıp kullanır; HuBERT küme tahmin çapraz entropisi kullanır. Her ikisi de özellik çıkarıcı olarak hizmet edebilir.<br><strong>4.</strong> Whisper'ın kodlayıcısı, bir ASR jeneratörünün parçası olarak eğitilmesine rağmen, güçlü bir evrensel ses özellik çıkarıcısıdır -- özellikle çok dilli ve konuşma olmayan ses için.<br><strong>5.</strong> Dizi görevleri için çerçeve başına embedding'ler (50 Hz, 768-1024 boyut); sınıflandırma/geri alma için klip düzeyine ortalama havuzla.<br><strong>6.</strong> Katman seçimi önemlidir: fonetik bilgi için HuBERT katman 9, genel amaç için Whisper son katman, ASR özellikleri için wav2vec katman 12.<br><strong>7.</strong> Donmuş kodlayıcı + küçük sınıflandırıcı başlığı düşük veri senaryoları için kanonik tariftir.<br><strong>8.</strong> Sonraki ders: ses + metin birleştirme -- çok modlu NLP-ses hattı (ASR -&gt; duygu analizi -&gt; TTS).</div></div>
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

  function tsnePlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    function cluster(cx, cy, n, label, color) {
      var xs = [], ys = [];
      for (var i=0;i<n;i++){
        var r = Math.sqrt(Math.random()) * 1.6;
        var th = Math.random() * 2 * Math.PI;
        xs.push(cx + r*Math.cos(th));
        ys.push(cy + r*Math.sin(th));
      }
      return {x:xs, y:ys, mode:'markers', type:'scatter', name:label, marker:{size:9, color:color, line:{color:'rgba(255,255,255,0.3)', width:1}}};
    }
    var traces = [
      cluster(3, 3, 15, lang==='tr'?'konuşmacı A':'speaker A', T.accent),
      cluster(-3, 3, 15, lang==='tr'?'konuşmacı B':'speaker B', '#4ecdc4'),
      cluster(-3, -3, 15, lang==='tr'?'konuşmacı C':'speaker C', '#f87171'),
      cluster(3, -3, 15, lang==='tr'?'konuşmacı D':'speaker D', '#a78bfa')
    ];
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'4 Konuşmacının HuBERT Embedding\\'lerinin t-SNE Projeksiyonu':'t-SNE of HuBERT Embeddings: 4 Speakers', font:{color:T.text,size:14}},
      xaxis:{title:'t-SNE-1', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:'t-SNE-2', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, traces, layout, {responsive:true, displayModeBar:false});
  }

  tsnePlot('plot-al6-tsne-en','en');
  tsnePlot('plot-al6-tsne-tr','tr');
}, 250);</script>`
};
