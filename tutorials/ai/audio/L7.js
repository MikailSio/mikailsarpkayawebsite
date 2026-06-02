window.AUDIO_L7 = {

en: `<p class="l-text"><strong>The interesting future of audio is multimodal.</strong> Pure ASR transcribes speech, but the next generation of products combines audio with text NLP: a customer service voicebot that understands intent, a meeting recorder that summarizes and extracts action items, a podcast platform that searches inside episodes by topic. Each one is a chain: audio -> text -> NLP -> response -> audio.</p>

<p class="l-text">This lesson assembles the audio toolbox you have built so far into a working pipeline. We will train an audio classifier on UrbanSound/ESC-50, build a speaker identification mini-project, then chain Whisper + sentiment + TTS into a 50-line voicebot. We end with a quick LangChain + Whisper + OpenAI TTS production pattern. By the end you can build complete audio applications, not just demo single models.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Train an audio classifier head on ESC-50 and UrbanSound8k pretrained features</li>
<li>Build a speaker identification mini-project from speaker embeddings + cosine</li>
<li>Chain Whisper, an LLM intent step, and TTS into a 50-line voicebot</li>
<li>Wire LangChain with Whisper input and OpenAI TTS output for production calls</li>
<li>Plan a real-time audio loop respecting end-to-end latency budgets</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Audio Classification with Pretrained Models</h2>

<p class="l-text">Most audio classification tasks (sound event detection, speaker ID, emotion, accent) follow the same recipe: pretrained encoder + small classification head + cross-entropy loss. The popular benchmarks are UrbanSound8k (10 urban sound classes) and ESC-50 (50 environmental sound classes).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">UrbanSound8k</div><div class="card-body">8732 clips, 10 classes (siren, dog bark, car horn, ...). 5 seconds each. Standard splits.</div></div>
<div class="calc-card"><div class="card-title">ESC-50</div><div class="card-body">2000 clips, 50 classes (broader: animals, weather, human, urban, interior).</div></div>
<div class="calc-card"><div class="card-title">VGGish</div><div class="card-body">Google's pre-deep-learning model trained on AudioSet. Strong baseline embedder.</div></div>
<div class="calc-card"><div class="card-title">YAMNet</div><div class="card-body">MobileNet-style on AudioSet. 521 classes from the box; reuse for transfer.</div></div>
<div class="calc-card"><div class="card-title">PANNs</div><div class="card-body">Pretrained Audio Neural Networks. CNN/CNN14 trained on AudioSet. Industry favorite.</div></div>
<div class="calc-card"><div class="card-title">AST / BEATs</div><div class="card-body">Audio Spectrogram Transformer / BEATs (2022). Transformer on log-mel. SOTA.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers torch librosa</span>
<span class="kw">from</span> transformers <span class="kw">import</span> ASTFeatureExtractor, ASTForAudioClassification
<span class="kw">import</span> librosa
<span class="kw">import</span> torch

<span class="cm"># 1) Audio Spectrogram Transformer pretrained on AudioSet (521 classes)</span>
model_id = <span class="str">"MIT/ast-finetuned-audioset-10-10-0.4593"</span>
extractor = ASTFeatureExtractor.<span class="fn">from_pretrained</span>(model_id)
model = ASTForAudioClassification.<span class="fn">from_pretrained</span>(model_id).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 2) Inference on a real audio file</span>
y, sr = librosa.<span class="fn">load</span>(<span class="str">"dog_bark.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    logits = <span class="fn">model</span>(**inputs).logits

probs = torch.<span class="fn">softmax</span>(logits[<span class="num">0</span>], dim=-<span class="num">1</span>).<span class="fn">cpu</span>()
top5 = probs.<span class="fn">topk</span>(<span class="num">5</span>)
<span class="kw">for</span> score, idx <span class="kw">in</span> <span class="fn">zip</span>(top5.values, top5.indices):
    label = model.config.id2label[idx.<span class="fn">item</span>()]
    <span class="fn">print</span>(f<span class="str">"  {score.item():.3f}  {label}"</span>)
<span class="cm"># 0.812  Dog
# 0.073  Bark
# 0.029  Domestic animals, pets
# ...</span>

<span class="cm"># 3) Fine-tune the classifier head for ESC-50 (50 classes, your custom split)</span>
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Replace the classification head</span>
hidden_dim = model.config.hidden_size
model.classifier = nn.<span class="fn">Linear</span>(hidden_dim, num_classes:=<span class="num">50</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># Freeze the backbone, train only the head (cheap and effective on small data)</span>
<span class="kw">for</span> p <span class="kw">in</span> model.audio_spectrogram_transformer.<span class="fn">parameters</span>():
    p.requires_grad = <span class="kw">False</span>

opt = torch.optim.<span class="fn">Adam</span>(model.classifier.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="cm"># Training loop (your dataset assumed)</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    <span class="kw">for</span> batch_inputs, batch_labels <span class="kw">in</span> train_loader:
        logits = <span class="fn">model</span>(**batch_inputs).logits
        loss = <span class="fn">loss_fn</span>(logits, batch_labels)
        opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Audio classification: FFT band features → sklearn LogisticRegression on a synthetic two-class problem.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from scipy.fft import rfft
rng = np.random.default_rng(0)
def make_clip(freq):
    t = np.arange(sr) / sr
    return np.sin(2*np.pi*freq*t) + 0.1*rng.standard_normal(sr)
X, y = [], []
for _ in range(40):
    X.append(make_clip(440)); y.append(0)
    X.append(make_clip(880)); y.append(1)
X = np.array([np.abs(rfft(x))[:128] for x in X])
y = np.array(y)
print('CV accuracy:', round(float(cross_val_score(LogisticRegression(max_iter=300), X, y, cv=4).mean()), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads AST (Audio Spectrogram Transformer) finetuned on Google's AudioSet, which has 521 sound event classes. AST takes log-mel spectrograms and processes them as a sequence of patches (like ViT for images). 2) Inference: pass audio to the extractor (computes Whisper-style log-mel) and the model. The output logits cover all 521 AudioSet classes; <code>softmax + topk</code> gives the most likely sounds. 3) For your own classes (10 urban sounds, 5 emotion categories, etc), replace the classification head with one matching your number of classes, freeze the backbone, train only the head. With 50-100 samples per class this typically reaches 90%+ accuracy in a few minutes on a GPU.</p>

<div id="plot-al7-conf-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Confusion matrix for a 6-class urban sound classifier (sirens, dogs, horns, drilling, music, jackhammer) trained with frozen AST + linear head on ~80 samples per class. Diagonal cells are correct predictions, dominated by green; off-diagonal are confusions, with the strongest confusion between drilling and jackhammer (acoustically similar, both percussive). This kind of structured confusion is normal and informative -- it tells you which classes need more data.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Mini-Project: Speaker Identification</h2>

<p class="l-text">A close cousin of generic audio classification: given a clip, identify which speaker (out of N enrolled) is talking. Same recipe, same tools -- but the model exploits the speaker information that pretrained encoders already encode.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> librosa
<span class="kw">from</span> transformers <span class="kw">import</span> HubertModel, AutoFeatureExtractor
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, classification_report

<span class="cm"># 1) Encoder (HuBERT layer 9, classic speaker-friendly choice)</span>
extractor = AutoFeatureExtractor.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>)
encoder = HubertModel.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">def</span> <span class="fn">speaker_embed</span>(path):
    y, _ = librosa.<span class="fn">load</span>(path, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>, duration=<span class="num">3.0</span>)
    inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        h = <span class="fn">encoder</span>(**inputs, output_hidden_states=<span class="kw">True</span>).hidden_states[<span class="num">9</span>]
    <span class="kw">return</span> h.<span class="fn">mean</span>(dim=<span class="num">1</span>).<span class="fn">squeeze</span>().<span class="fn">cpu</span>().<span class="fn">numpy</span>()

<span class="cm"># 2) Enrollment dataset: 5 speakers, 10 clips each</span>
speakers = [<span class="str">"alice"</span>, <span class="str">"bob"</span>, <span class="str">"carol"</span>, <span class="str">"dave"</span>, <span class="str">"eve"</span>]
X_train, y_train = [], []
<span class="kw">for</span> i, spk <span class="kw">in</span> <span class="fn">enumerate</span>(speakers):
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
        X_train.<span class="fn">append</span>(<span class="fn">speaker_embed</span>(f<span class="str">"data/train/{spk}_{j}.wav"</span>))
        y_train.<span class="fn">append</span>(i)
X_train = np.<span class="fn">stack</span>(X_train)
y_train = np.<span class="fn">array</span>(y_train)
<span class="fn">print</span>(<span class="str">"train:"</span>, X_train.shape, y_train.shape)   <span class="cm"># (50, 768) (50,)

# 3) Logistic regression on top of frozen embeddings</span>
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>, C=<span class="num">10</span>).<span class="fn">fit</span>(X_train, y_train)

<span class="cm"># 4) Evaluate on held-out clips</span>
X_test, y_test = [], []
<span class="kw">for</span> i, spk <span class="kw">in</span> <span class="fn">enumerate</span>(speakers):
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
        X_test.<span class="fn">append</span>(<span class="fn">speaker_embed</span>(f<span class="str">"data/test/{spk}_{j}.wav"</span>))
        y_test.<span class="fn">append</span>(i)
X_test = np.<span class="fn">stack</span>(X_test); y_test = np.<span class="fn">array</span>(y_test)

preds = clf.<span class="fn">predict</span>(X_test)
<span class="fn">print</span>(<span class="str">"accuracy:"</span>, <span class="fn">accuracy_score</span>(y_test, preds))
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, preds, target_names=speakers))
<span class="cm"># Typically: 95%+ accuracy with just 10 enrollment clips per speaker

# 5) Identify a new speaker clip</span>
new_emb = <span class="fn">speaker_embed</span>(<span class="str">"unknown.wav"</span>)
probs = clf.<span class="fn">predict_proba</span>(new_emb.<span class="fn">reshape</span>(<span class="num">1</span>, -<span class="num">1</span>))[<span class="num">0</span>]
<span class="kw">for</span> spk, p <span class="kw">in</span> <span class="fn">zip</span>(speakers, probs):
    <span class="fn">print</span>(f<span class="str">"  {spk}: {p:.3f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Speaker ID: same recipe, more classes. Each toy 'speaker' = a fundamental frequency range.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.ensemble import RandomForestClassifier
rng = np.random.default_rng(0)
X, y = [], []
for spk, base in enumerate([200, 350, 500, 700]):
    for _ in range(30):
        f = base + rng.standard_normal()*15
        t = np.arange(2000) / 16000
        clip = np.sin(2*np.pi*f*t) + 0.05*rng.standard_normal(2000)
        X.append([clip.mean(), clip.std(), np.abs(np.fft.rfft(clip))[:50].mean()])
        y.append(spk)
rf = RandomForestClassifier(n_estimators=80, random_state=0).fit(X, y)
print('Speaker-ID accuracy:', round(rf.score(X, y), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The same HuBERT-layer-9 + mean-pool embedder from L6. Speaker information lives strongly in HuBERT layer 9, so this is the natural choice. 2) Enrollment: 5 speakers, 10 clips each = 50 training embeddings. In a real product the user enrolls by recording themselves saying a few sentences. 3) Logistic regression is enough -- the embeddings are already linearly separable by speaker. C=10 (mild regularization) generally beats higher or lower values for small data. 4) Test on 5 held-out clips per speaker; accuracy should be 95%+ for clean audio. 5) For a new clip, predict_proba returns one probability per enrolled speaker; you can threshold to detect "unknown speaker" (max prob &lt; 0.5).</p>

<div class="calc-example"><div class="example-label">EXAMPLE: a meeting transcript with speaker labels</div><div class="example-body">Combine ASR (Whisper) with speaker ID (HuBERT + classifier): for each Whisper-detected segment, embed the audio of that segment, classify which enrolled speaker it belongs to, prepend the speaker name. Result: <code>[Alice]: Welcome everyone. [Bob]: Quick question on the timeline. [Alice]: Sure...</code> -- a fully labeled meeting transcript from raw audio in 50 lines of code.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The NLP-Audio Pipeline</h2>

<p class="l-text">Now combine: ASR -> text NLP (sentiment, NER, intent) -> any downstream logic -> TTS response. This is the architecture behind every modern voice agent.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Audio in</div><div class="card-body">Microphone, file, stream. Resample to 16 kHz mono.</div></div>
<div class="calc-card"><div class="card-title">2. ASR</div><div class="card-body">Whisper (this lesson's L4). Output: text + optional timestamps.</div></div>
<div class="calc-card"><div class="card-title">3. NLU</div><div class="card-body">Sentiment, NER, intent, RAG, LLM call -- standard text NLP. Output: response text.</div></div>
<div class="calc-card"><div class="card-title">4. TTS</div><div class="card-body">SpeechT5, Bark, ElevenLabs, OpenAI TTS (L5). Output: response audio.</div></div>
<div class="calc-card"><div class="card-title">5. Audio out</div><div class="card-body">Speaker, file, stream back to caller.</div></div>
<div class="calc-card"><div class="card-title">Latency budget</div><div class="card-body">Total &lt; 1 s feels real-time. Whisper-small ~150 ms, NLP ~500 ms, TTS ~200 ms.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers librosa soundfile</span>
<span class="kw">from</span> transformers <span class="kw">import</span> pipeline, SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset
<span class="kw">import</span> librosa, soundfile <span class="kw">as</span> sf, torch, numpy <span class="kw">as</span> np

<span class="cm"># 1) ASR (Whisper-small, English)</span>
asr = <span class="fn">pipeline</span>(<span class="str">"automatic-speech-recognition"</span>,
               model=<span class="str">"openai/whisper-small"</span>,
               device=<span class="num">0</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> -<span class="num">1</span>)

<span class="cm"># 2) Sentiment classifier</span>
sentiment = <span class="fn">pipeline</span>(<span class="str">"sentiment-analysis"</span>,
                     model=<span class="str">"distilbert-base-uncased-finetuned-sst-2-english"</span>,
                     device=<span class="num">0</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> -<span class="num">1</span>)

<span class="cm"># 3) TTS (SpeechT5)</span>
tts_proc = SpeechT5Processor.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/speecht5_tts"</span>)
tts_model = SpeechT5ForTextToSpeech.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/speecht5_tts"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>).<span class="fn">eval</span>()
vocoder = SpeechT5HifiGan.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/speecht5_hifigan"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>).<span class="fn">eval</span>()
embeds = <span class="fn">load_dataset</span>(<span class="str">"Matthijs/cmu-arctic-xvectors"</span>, split=<span class="str">"validation"</span>)
speaker_emb = torch.<span class="fn">tensor</span>(embeds[<span class="num">7306</span>][<span class="str">"xvector"</span>]).<span class="fn">unsqueeze</span>(<span class="num">0</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">def</span> <span class="fn">speak</span>(text, out_path=<span class="str">"reply.wav"</span>):
    inputs = <span class="fn">tts_proc</span>(text=text, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        spec = tts_model.<span class="fn">generate_speech</span>(inputs[<span class="str">"input_ids"</span>], speaker_emb)
        wav = <span class="fn">vocoder</span>(spec).<span class="fn">cpu</span>().<span class="fn">numpy</span>()
    sf.<span class="fn">write</span>(out_path, wav, samplerate=<span class="num">16000</span>)
    <span class="kw">return</span> out_path

<span class="cm"># 4) Voicebot: hear -&gt; understand -&gt; reply</span>
<span class="kw">def</span> <span class="fn">voicebot_turn</span>(audio_in_path):
    <span class="cm"># Step 1: ASR</span>
    transcript = <span class="fn">asr</span>(audio_in_path)[<span class="str">"text"</span>].<span class="fn">strip</span>()
    <span class="fn">print</span>(<span class="str">"USER:"</span>, transcript)

    <span class="cm"># Step 2: NLP - what does the user feel?</span>
    sent = <span class="fn">sentiment</span>(transcript)[<span class="num">0</span>]
    label, score = sent[<span class="str">"label"</span>], sent[<span class="str">"score"</span>]

    <span class="cm"># Step 3: response logic</span>
    <span class="kw">if</span> label == <span class="str">"NEGATIVE"</span> <span class="kw">and</span> score &gt; <span class="num">0.85</span>:
        reply = <span class="str">"I am sorry to hear that. Let me try to help."</span>
    <span class="kw">elif</span> label == <span class="str">"POSITIVE"</span> <span class="kw">and</span> score &gt; <span class="num">0.85</span>:
        reply = <span class="str">"That's great to hear! How can I help further?"</span>
    <span class="kw">else</span>:
        reply = f<span class="str">"You said: {transcript}. Got it."</span>
    <span class="fn">print</span>(<span class="str">"BOT:"</span>, reply)

    <span class="cm"># Step 4: TTS</span>
    <span class="kw">return</span> <span class="fn">speak</span>(reply)

<span class="cm"># 5) Run a turn</span>
out = <span class="fn">voicebot_turn</span>(<span class="str">"user_input.wav"</span>)
<span class="fn">print</span>(<span class="str">"reply audio:"</span>, out)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Agent chain Whisper→LLM→TTS replaced by sklearn pipeline → rule-based response → synth-stub.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re
transcript = 'what is two plus two'
if 'plus' in transcript:
    nums = [int(w) for w in re.findall(r'(zero|one|two|three|four|five|six|seven|eight|nine)', transcript) for _ in [0]]
    word2num = dict(zip('zero one two three four five six seven eight nine'.split(), range(10)))
    nums = [word2num[w] for w in re.findall(r'\\b\\w+\\b', transcript) if w in word2num]
    answer = sum(nums)
else:
    answer = 'I did not understand'
print('User said    :', transcript)
print('Agent answer :', answer)</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads three pretrained models with the HuggingFace pipeline API: Whisper for ASR, DistilBERT for sentiment, SpeechT5 + HiFi-GAN for TTS. Three models, three lines of imports. 2) <code>speak</code> wraps the TTS pipeline so we have a reusable function: text in, WAV out. 3) <code>voicebot_turn</code> is the hear-understand-reply loop: ASR transcribes user audio, sentiment classifier judges tone, simple logic chooses a reply text, TTS speaks it. 4) The whole thing is 50 lines, runs end-to-end on a single GPU, and demonstrates the full pipeline. 5) For a real product, replace the simple if/else with an LLM call (GPT-4, Claude) for actually helpful responses; replace the file-based I/O with WebRTC/sockets for live audio.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. LangChain + Whisper + OpenAI TTS</h2>

<p class="l-text">For production agents you usually want a frontier LLM in the middle. LangChain (or LlamaIndex, or just openai client) lets you compose Whisper -> LLM -> TTS into a maintainable chain.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install openai langchain langchain-openai</span>
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_core.messages <span class="kw">import</span> SystemMessage, HumanMessage
<span class="kw">import</span> os

client = <span class="fn">OpenAI</span>()                      <span class="cm"># reads OPENAI_API_KEY</span>
llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0.3</span>)

<span class="cm"># 1) ASR via OpenAI's Whisper API (no local GPU needed)</span>
<span class="kw">def</span> <span class="fn">openai_asr</span>(path):
    <span class="kw">with</span> <span class="fn">open</span>(path, <span class="str">"rb"</span>) <span class="kw">as</span> f:
        out = client.audio.transcriptions.<span class="fn">create</span>(
            model=<span class="str">"whisper-1"</span>,
            file=f,
            language=<span class="str">"en"</span>
        )
    <span class="kw">return</span> out.text.<span class="fn">strip</span>()

<span class="cm"># 2) LLM reply with a system prompt that defines the agent</span>
SYSTEM = <span class="str">"You are a helpful audiobook recommendation assistant. Reply in 1-2 short sentences."</span>

<span class="kw">def</span> <span class="fn">llm_reply</span>(history, user_text):
    history.<span class="fn">append</span>(<span class="fn">HumanMessage</span>(content=user_text))
    msg = <span class="fn">llm</span>([<span class="fn">SystemMessage</span>(content=SYSTEM)] + history)
    history.<span class="fn">append</span>(msg)
    <span class="kw">return</span> msg.content

<span class="cm"># 3) TTS via OpenAI</span>
<span class="kw">def</span> <span class="fn">openai_tts</span>(text, out=<span class="str">"reply.mp3"</span>):
    response = client.audio.speech.<span class="fn">create</span>(
        model=<span class="str">"tts-1"</span>,
        voice=<span class="str">"nova"</span>,
        input=text
    )
    response.<span class="fn">stream_to_file</span>(out)
    <span class="kw">return</span> out

<span class="cm"># 4) The full conversational loop with memory</span>
history = []

<span class="kw">def</span> <span class="fn">turn</span>(audio_in_path):
    user_text = <span class="fn">openai_asr</span>(audio_in_path)
    reply_text = <span class="fn">llm_reply</span>(history, user_text)
    reply_audio = <span class="fn">openai_tts</span>(reply_text)
    <span class="kw">return</span> {<span class="str">"user"</span>: user_text, <span class="str">"reply"</span>: reply_text, <span class="str">"audio"</span>: reply_audio}

<span class="cm"># 5) Run a multi-turn conversation</span>
<span class="fn">print</span>(<span class="fn">turn</span>(<span class="str">"hi.wav"</span>))           <span class="cm"># "Hi, can you recommend a thriller?"</span>
<span class="fn">print</span>(<span class="fn">turn</span>(<span class="str">"followup.wav"</span>))     <span class="cm"># "I want something narrated by a woman."</span>
<span class="fn">print</span>(<span class="fn">turn</span>(<span class="str">"thanks.wav"</span>))       <span class="cm"># "Thanks, I'll check that one out."</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">CLAP / multimodal stand-in: shared-space audio↔text via dummy embeddings + cosine search.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
audio_embs = rng.standard_normal((6, 32))
text_embs  = rng.standard_normal((6, 32))
audio_embs /= np.linalg.norm(audio_embs, axis=1, keepdims=True)
text_embs  /= np.linalg.norm(text_embs,  axis=1, keepdims=True)
labels = ['dog bark','car horn','piano','rain','clapping','speech']
q = text_embs[2]                                # 'piano'
sims = audio_embs @ q
for i in np.argsort(-sims)[:3]:
    print(f'{labels[i]:&gt;10}  sim={sims[i]:0.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Three OpenAI API clients: Whisper (ASR), GPT-4o-mini (chat), and TTS-1 (speech). All called over HTTP; no local GPU. 2) <code>openai_asr</code> uploads the audio file and returns transcribed text. Whisper-1 endpoint is the same model as <code>openai/whisper-large-v3</code> with extra server-side optimizations. 3) <code>llm_reply</code> maintains conversation history (system + user + assistant + ...) and calls the LLM. The system prompt defines the agent's persona and constraints. 4) <code>openai_tts</code> turns the LLM's text reply into an MP3. 5) <code>turn</code> chains all three: hear, understand, speak. With history persisted across calls, the bot has multi-turn memory ("I want something narrated by a woman" relies on remembering the previous "thriller" request). 6) For a deployable product, wrap this in FastAPI/WebSocket; for high concurrency use connection pooling on the OpenAI client.</p>

<div class="l-note"><strong>Latency reality:</strong> in an OpenAI-only stack, each turn is ~2-5 seconds end-to-end (mostly TTS audio download). For lower latency, run Whisper-small locally and use a streaming TTS like ElevenLabs streaming endpoints; total then drops to ~1.5 seconds.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Multimodal Audio + Text Models</h2>

<p class="l-text">An emerging frontier: models that take audio and text inputs jointly. CLAP (Contrastive Language-Audio Pretraining) embeds audio and text into a shared space, enabling text-to-audio retrieval and zero-shot audio classification.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers torch librosa</span>
<span class="kw">from</span> transformers <span class="kw">import</span> ClapModel, ClapProcessor
<span class="kw">import</span> librosa
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

<span class="cm"># CLAP: like CLIP but for audio</span>
processor = ClapProcessor.<span class="fn">from_pretrained</span>(<span class="str">"laion/clap-htsat-unfused"</span>)
model = ClapModel.<span class="fn">from_pretrained</span>(<span class="str">"laion/clap-htsat-unfused"</span>).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 1) Zero-shot audio classification</span>
y, sr = librosa.<span class="fn">load</span>(<span class="str">"unknown_sound.wav"</span>, sr=<span class="num">48000</span>, mono=<span class="kw">True</span>)
candidate_labels = [<span class="str">"a dog barking"</span>, <span class="str">"a cat meowing"</span>, <span class="str">"a car engine"</span>,
                    <span class="str">"a bird chirping"</span>, <span class="str">"a baby crying"</span>, <span class="str">"a piano playing"</span>]

inputs = <span class="fn">processor</span>(text=candidate_labels, audios=y, return_tensors=<span class="str">"pt"</span>,
                   padding=<span class="kw">True</span>, sampling_rate=<span class="num">48000</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**inputs)

logits = out.logits_per_audio        <span class="cm"># (1, num_labels)</span>
probs = logits.<span class="fn">softmax</span>(dim=-<span class="num">1</span>)[<span class="num">0</span>]
<span class="kw">for</span> label, p <span class="kw">in</span> <span class="fn">zip</span>(candidate_labels, probs):
    <span class="fn">print</span>(f<span class="str">"  {p.item():.3f}  {label}"</span>)
<span class="cm"># 0.812  a dog barking
# 0.072  a cat meowing
# 0.054  a baby crying  ...

# 2) Text-to-audio retrieval: find clips matching a description</span>
<span class="kw">def</span> <span class="fn">embed_audio</span>(path):
    y, _ = librosa.<span class="fn">load</span>(path, sr=<span class="num">48000</span>, mono=<span class="kw">True</span>)
    inputs = <span class="fn">processor</span>(audios=y, return_tensors=<span class="str">"pt"</span>, sampling_rate=<span class="num">48000</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        <span class="kw">return</span> model.<span class="fn">get_audio_features</span>(**inputs).<span class="fn">squeeze</span>()

<span class="kw">def</span> <span class="fn">embed_text</span>(text):
    inputs = <span class="fn">processor</span>(text=[text], return_tensors=<span class="str">"pt"</span>, padding=<span class="kw">True</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        <span class="kw">return</span> model.<span class="fn">get_text_features</span>(**inputs).<span class="fn">squeeze</span>()

<span class="cm"># Index 1000 audio clips</span>
<span class="cm"># audio_embeds = torch.stack([embed_audio(p) for p in clip_paths])</span>
<span class="cm"># Search by text description</span>
query_emb = <span class="fn">embed_text</span>(<span class="str">"upbeat jazz with a saxophone solo"</span>)
<span class="cm"># sims = F.cosine_similarity(query_emb.unsqueeze(0), audio_embeds, dim=1)
# top_k = sims.topk(5)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Voice Activity Detection (VAD): silero is blocked. Equivalent = energy threshold per window.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
win = 320  # 20 ms at 16 kHz
rms = np.sqrt(np.mean(audio.reshape(-1, win)**2, axis=1))
thr = 0.1 * rms.max()
voiced = rms &gt; thr
print('Frames     :', voiced.shape[0])
print('Voiced %   :', round(float(voiced.mean()) * 100, 1), '%')
print('First 20 mask:', voiced[:20].astype(int))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads CLAP, the audio analog of CLIP. The model maps audio clips and text descriptions to the same 512-D embedding space; matched pairs have high cosine similarity. 2) Zero-shot classification: provide N candidate text labels alongside an audio clip; CLAP scores each label by similarity to the audio embedding. No labeled training data needed -- if your label can be expressed in natural language, CLAP can score it. 3) Text-to-audio retrieval: pre-compute audio embeddings for a corpus, then at query time embed a text description and find the nearest audio clips. This powers "describe what you want to hear" search interfaces. 4) Same machinery enables audio-to-text retrieval (caption generation by retrieval) and audio similarity (clip-to-clip).</p>

<div class="calc-example"><div class="example-label">EXAMPLE: a sound effect library search</div><div class="example-body">A sound designer's library has 50000 unlabeled clips. Embed each with CLAP audio encoder (one-time cost). User types "rain on a metal roof at night" -- embed the query with CLAP text encoder, find top-10 cosine matches. Even though no clip was ever labeled with that exact phrase, CLAP retrieves visually appropriate matches. Replaces hand-curated metadata; scales to any size library.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Real-Time Considerations</h2>

<p class="l-text">A demo voicebot that runs on file inputs is one thing; a real-time agent that streams audio in and out is another. Three concerns dominate: streaming, voice activity detection, and turn-taking.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Streaming ASR</div><div class="card-body">Process audio in 1-2 second chunks instead of full utterances. Whisper-small + chunked inference, or wav2vec 2.0 streaming.</div></div>
<div class="calc-card"><div class="card-title">VAD</div><div class="card-body">Voice activity detection: when does the user start/stop talking? Use silero-vad (real-time, 100ms latency).</div></div>
<div class="calc-card"><div class="card-title">Turn-taking</div><div class="card-body">When the user pauses for 500-700 ms, treat as end of turn. Pause detection + prosodic cues.</div></div>
<div class="calc-card"><div class="card-title">Streaming TTS</div><div class="card-body">ElevenLabs streaming endpoints emit audio chunks as the model generates. Latency drops from 2 s to 300 ms.</div></div>
<div class="calc-card"><div class="card-title">Echo cancellation</div><div class="card-body">If the bot's TTS goes through speakers, the mic captures it. Use AEC libraries (speexdsp, WebRTC AEC).</div></div>
<div class="calc-card"><div class="card-title">Interruption</div><div class="card-body">Detect when the user starts talking while the bot is speaking; cancel TTS playback. Hard but essential.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install silero-vad torch torchaudio</span>
<span class="kw">import</span> torch
<span class="kw">import</span> torchaudio

<span class="cm"># 1) Voice activity detection with silero-vad (open source, ONNX-fast)</span>
model, utils = torch.hub.<span class="fn">load</span>(repo_or_dir=<span class="str">"snakers4/silero-vad"</span>, model=<span class="str">"silero_vad"</span>)
get_speech_timestamps, _, read_audio, _, _ = utils

<span class="cm"># Load and detect</span>
y = <span class="fn">read_audio</span>(<span class="str">"long_recording.wav"</span>, sampling_rate=<span class="num">16000</span>)
speech_chunks = <span class="fn">get_speech_timestamps</span>(y, model, sampling_rate=<span class="num">16000</span>,
                                       min_speech_duration_ms=<span class="num">250</span>,
                                       min_silence_duration_ms=<span class="num">200</span>)
<span class="kw">for</span> ch <span class="kw">in</span> speech_chunks:
    <span class="fn">print</span>(f<span class="str">"speech: {ch['start']/16000:.2f}-{ch['end']/16000:.2f} s"</span>)
<span class="cm"># Output:
# speech: 0.32-1.91 s
# speech: 2.45-4.10 s
# speech: 5.20-7.00 s</span>

<span class="cm"># 2) Real-time pseudocode for a streaming voicebot</span>
<span class="kw">def</span> <span class="fn">streaming_loop</span>():
    audio_buffer = []
    <span class="kw">while</span> <span class="kw">True</span>:
        chunk = <span class="fn">microphone_read</span>(<span class="num">160</span>)         <span class="cm"># 10 ms at 16 kHz</span>
        is_speech = vad.<span class="fn">predict</span>(chunk)

        <span class="kw">if</span> is_speech:
            audio_buffer.<span class="fn">append</span>(chunk)
        <span class="kw">elif</span> <span class="fn">len</span>(audio_buffer) &gt; <span class="num">0</span>:
            <span class="cm"># 500ms silence after speech -&gt; end of turn</span>
            silence_ms = <span class="fn">count_silence</span>(audio_buffer)
            <span class="kw">if</span> silence_ms &gt; <span class="num">500</span>:
                full_audio = np.<span class="fn">concatenate</span>(audio_buffer)
                text = asr.<span class="fn">transcribe</span>(full_audio)
                reply = llm.<span class="fn">generate</span>(text)
                <span class="kw">for</span> tts_chunk <span class="kw">in</span> tts.<span class="fn">stream</span>(reply):
                    <span class="fn">speaker_write</span>(tts_chunk)
                audio_buffer = []</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Wakeword detector mocked with 1-D template matching (cross-correlation).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
rng = np.random.default_rng(0)
template = audio[:1600]                        # first 100 ms = 'wakeword'
stream = np.concatenate([rng.standard_normal(8000)*0.05, audio, rng.standard_normal(8000)*0.05])
corr = signal.correlate(stream, template, mode='valid')
peak = int(np.argmax(np.abs(corr)))
print('Stream length:', len(stream))
print('Wakeword detected at sample', peak, '≈', round(peak/16000, 2), 's')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads silero-vad, the de facto open-source voice activity detector. It is small (~1 MB), fast (real-time on CPU), and accurate. 2) Given a long recording, <code>get_speech_timestamps</code> returns the spans where speech is happening, filtering out long silences. Useful both for real-time turn detection and offline preprocessing of long files. 3) The streaming loop pseudocode shows the architecture of a real-time voicebot: continuously read 10 ms audio chunks, run VAD, accumulate speech, and on detected silence-after-speech, fire off the ASR -> LLM -> TTS chain. 4) For production, all three components must be streaming: chunked Whisper inference, streaming LLM (token-by-token), streaming TTS (audio chunks). LiveKit, Pipecat, and similar frameworks bundle this together.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Wrap-Up: A Voice Application Checklist</h2>

<p class="l-text">A practical checklist for building real audio-NLP applications.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Audio I/O</div><div class="card-body">16 kHz mono normalized to [-1, 1]. WebRTC for browser, sounddevice for desktop.</div></div>
<div class="calc-card"><div class="card-title">VAD</div><div class="card-body">silero-vad. Filter silence before ASR; detect end-of-turn for streaming.</div></div>
<div class="calc-card"><div class="card-title">ASR</div><div class="card-body">Whisper-small for prototyping; faster-whisper or insanely-fast-whisper in prod.</div></div>
<div class="calc-card"><div class="card-title">NLP</div><div class="card-body">GPT-4o-mini or Claude Haiku for general chat; finetuned BERT for narrow intents.</div></div>
<div class="calc-card"><div class="card-title">TTS</div><div class="card-body">SpeechT5 or OpenAI TTS for English; XTTS-v2 for cloning; ElevenLabs streaming for low latency.</div></div>
<div class="calc-card"><div class="card-title">Memory</div><div class="card-body">Conversation history in Redis, vector DB for long-term knowledge.</div></div>
<div class="calc-card"><div class="card-title">Logging</div><div class="card-body">Save audio + transcript + reply for debugging and iteration. Anonymize PII.</div></div>
<div class="calc-card"><div class="card-title">Latency target</div><div class="card-body">&lt; 1.5 s end-to-end. Streaming everywhere.</div></div>
</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Audio classification reuses the L6 recipe: pretrained encoder + classification head + cross-entropy.<br><strong>2.</strong> AST (Audio Spectrogram Transformer) and PANNs are SOTA for general audio classification; HuBERT for speaker-related tasks.<br><strong>3.</strong> Speaker identification with HuBERT layer 9 + logistic regression reaches 95%+ with 10 enrollment clips per speaker.<br><strong>4.</strong> The NLP-audio pipeline is a chain: ASR -&gt; NLP -&gt; TTS. Each step is a single function with HuggingFace.<br><strong>5.</strong> A 50-line voicebot uses Whisper + sentiment/LLM + SpeechT5 for end-to-end conversation.<br><strong>6.</strong> CLAP enables zero-shot audio classification and text-to-audio retrieval through joint embedding.<br><strong>7.</strong> Real-time agents need streaming everything: VAD for turn detection, chunked ASR, streaming TTS.<br><strong>8.</strong> Next lesson: production audio. Optimization, ONNX, quantization, and the engineering of low-latency, reliable audio applications.</div></div>
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
    var labels = lang==='tr' ? ['siren','kopek','korna','matkap','muzik','varyoz']
                              : ['siren','dog','horn','drilling','music','jackhammer'];
    var matrix = [
      [82,  2,  4,  4,  3,  5],
      [ 1, 88,  3,  2,  4,  2],
      [ 5,  4, 80,  4,  3,  4],
      [ 3,  2,  3, 75,  2, 15],
      [ 2,  3,  4,  3, 86,  2],
      [ 4,  2,  3, 14,  2, 75]
    ];
    var trace = {z:matrix, x:labels, y:labels, type:'heatmap', colorscale:[[0,'#0d1c14'],[0.3,'#1a3a25'],[0.6,'#3aa86a'],[0.85,'#7adea4'],[1,'#d8f4e0']], showscale:true, colorbar:{title:'%', titlefont:{color:T.text}, tickfont:{color:T.text}}, text:matrix, texttemplate:'%{text}', textfont:{color:'#fff', size:11}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'6 Sınıflı Şehir Sesi Karışıklık Matrisi':'6-Class Urban Sound Confusion Matrix', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'tahmin':'predicted', side:'bottom', gridcolor:T.grid},
      yaxis:{title:lang==='tr'?'gerçek':'true', autorange:'reversed', gridcolor:T.grid}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  confPlot('plot-al7-conf-en','en');
  confPlot('plot-al7-conf-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Sesin ilginç geleceği çok modlu.</strong> Saf ASR konuşmayı yazıya döker, ama yeni nesil ürünler sesi metin NLP ile birleştirir: niyeti anlayan bir müşteri hizmetleri ses botu, özetleyen ve eylem öğeleri çıkaran bir toplantı kayıt cihazı, bölümlerin içinde konuya göre arama yapan bir podcast platformu. Her biri bir zincirdir: ses -> metin -> NLP -> yanıt -> ses.</p>

<p class="l-text">Bu ders şimdiye kadar oluşturduğunuz ses araç setini çalışan bir hatta birleştirir. UrbanSound/ESC-50 üzerinde bir ses sınıflandırıcı eğitecek, bir konuşmacı tanımlama mini projesi oluşturacak, sonra Whisper + duygu analizi + TTS'i 50 satırlık bir ses bot'una zincirleyeceğiz. Hızlı bir LangChain + Whisper + OpenAI TTS üretim kalıbıyla bitiriyoruz. Sonunda yalnızca demo tek modeller değil, tam ses uygulamaları oluşturabilirsiniz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>ESC-50 ve UrbanSound8k önceden eğitilmiş öznitelikleri üstünde sınıflandırıcı eğiteceksin</li>
<li>Speaker embedding + cosine ile konuşmacı tanımlama mini projesi kuracaksın</li>
<li>Whisper, niyet için LLM adımı ve TTS'i 50 satırlık ses bot'una zincirleyeceksin</li>
<li>Üretim çağrıları için LangChain'i Whisper input + OpenAI TTS output ile bağlayacaksın</li>
<li>Uçtan uca gecikme bütçelerine uyan gerçek zamanlı bir ses döngüsü tasarlayacaksın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Önceden Eğitilmiş Modellerle Ses Sınıflandırma</h2>

<p class="l-text">Çoğu ses sınıflandırma görevi (ses olayı algılama, konuşmacı ID'si, duygu, aksan) aynı tarifi izler: önceden eğitilmiş kodlayıcı + küçük sınıflandırma başlığı + çapraz entropi kaybı. Popüler kıyaslamalar UrbanSound8k (10 şehir sesi sınıfı) ve ESC-50 (50 çevre sesi sınıfı)'dır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">UrbanSound8k</div><div class="card-body">8732 klip, 10 sınıf (siren, köpek havlaması, araba kornası, ...). Her biri 5 saniye. Standart ayrımlar.</div></div>
<div class="calc-card"><div class="card-title">ESC-50</div><div class="card-body">2000 klip, 50 sınıf (daha geniş: hayvanlar, hava durumu, insan, şehir, iç mekan).</div></div>
<div class="calc-card"><div class="card-title">VGGish</div><div class="card-body">Google'ın AudioSet üzerinde eğitilmiş derin öğrenme öncesi modeli. Güçlü temel embedder.</div></div>
<div class="calc-card"><div class="card-title">YAMNet</div><div class="card-body">AudioSet'te MobileNet tarzı. Kutudan 521 sınıf; transfer için tekrar kullan.</div></div>
<div class="calc-card"><div class="card-title">PANNs</div><div class="card-body">Önceden Eğitilmiş Ses Sinir Ağları. AudioSet'te eğitilmiş CNN/CNN14. Endüstri favorisi.</div></div>
<div class="calc-card"><div class="card-title">AST / BEATs</div><div class="card-body">Audio Spectrogram Transformer / BEATs (2022). Log-mel'de transformer. SOTA.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers torch librosa</span>
<span class="kw">from</span> transformers <span class="kw">import</span> ASTFeatureExtractor, ASTForAudioClassification
<span class="kw">import</span> librosa
<span class="kw">import</span> torch

<span class="cm"># 1) AudioSet üzerinde önceden eğitilmiş Audio Spectrogram Transformer (521 sınıf)</span>
model_id = <span class="str">"MIT/ast-finetuned-audioset-10-10-0.4593"</span>
extractor = ASTFeatureExtractor.<span class="fn">from_pretrained</span>(model_id)
model = ASTForAudioClassification.<span class="fn">from_pretrained</span>(model_id).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 2) Gerçek bir ses dosyasında çıkarım</span>
y, sr = librosa.<span class="fn">load</span>(<span class="str">"dog_bark.wav"</span>, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>)
inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    logits = <span class="fn">model</span>(**inputs).logits

probs = torch.<span class="fn">softmax</span>(logits[<span class="num">0</span>], dim=-<span class="num">1</span>).<span class="fn">cpu</span>()
top5 = probs.<span class="fn">topk</span>(<span class="num">5</span>)
<span class="kw">for</span> score, idx <span class="kw">in</span> <span class="fn">zip</span>(top5.values, top5.indices):
    label = model.config.id2label[idx.<span class="fn">item</span>()]
    <span class="fn">print</span>(f<span class="str">"  {score.item():.3f}  {label}"</span>)
<span class="cm"># 0.812  Dog
# 0.073  Bark
# 0.029  Domestic animals, pets
# ...</span>

<span class="cm"># 3) ESC-50 için sınıflandırıcı başlığını ince ayarla (50 sınıf, kendi özel ayrımınız)</span>
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Sınıflandırma başlığını değiştir</span>
hidden_dim = model.config.hidden_size
model.classifier = nn.<span class="fn">Linear</span>(hidden_dim, num_classes:=<span class="num">50</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># Omurgayı dondur, yalnızca başlığı eğit (küçük veride ucuz ve etkili)</span>
<span class="kw">for</span> p <span class="kw">in</span> model.audio_spectrogram_transformer.<span class="fn">parameters</span>():
    p.requires_grad = <span class="kw">False</span>

opt = torch.optim.<span class="fn">Adam</span>(model.classifier.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="cm"># Eğitim döngüsü (veri kümeniz varsayılır)</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    <span class="kw">for</span> batch_inputs, batch_labels <span class="kw">in</span> train_loader:
        logits = <span class="fn">model</span>(**batch_inputs).logits
        loss = <span class="fn">loss_fn</span>(logits, batch_labels)
        opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Ses sınıflandırma: FFT bant özellikleri → sentetik iki sınıflı bir problem üzerinde sklearn LogisticRegression.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from scipy.fft import rfft
rng = np.random.default_rng(0)
def make_clip(freq):
    t = np.arange(sr) / sr
    return np.sin(2*np.pi*freq*t) + 0.1*rng.standard_normal(sr)
X, y = [], []
for _ in range(40):
    X.append(make_clip(440)); y.append(0)
    X.append(make_clip(880)); y.append(1)
X = np.array([np.abs(rfft(x))[:128] for x in X])
y = np.array(y)
print('CV accuracy:', round(float(cross_val_score(LogisticRegression(max_iter=300), X, y, cv=4).mean()), 3))</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) 521 ses olayı sınıfı olan Google'ın AudioSet'inde ince ayarlanmış AST'i (Audio Spectrogram Transformer) yükler. AST log-mel spektrogramları alır ve onları yama dizisi olarak işler (görüntüler için ViT gibi). 2) Çıkarım: sesi çıkarıcıya (Whisper tarzı log-mel hesaplar) ve modele geçirin. Çıkış logit'leri tüm 521 AudioSet sınıfını kapsar; <code>softmax + topk</code> en olası sesleri verir. 3) Kendi sınıflarınız için (10 şehir sesi, 5 duygu kategorisi, vb.), sınıflandırma başlığını sınıf sayınızla eşleşen biriyle değiştirin, omurgayı dondurun, yalnızca başlığı eğitin. Sınıf başına 50-100 örnekle bu tipik olarak GPU'da birkaç dakika içinde %90+ doğruluğa ulaşır.</p>

<div id="plot-al7-conf-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Sınıf başına ~80 örnek üzerinde donmuş AST + doğrusal başlıkla eğitilmiş 6 sınıflı bir şehir sesi sınıflandırıcısı (sirenler, köpekler, kornalar, matkap, müzik, varyoz) için karışıklık matrisi. Köşegen hücreler doğru tahminlerdir, yeşil baskındır; köşegen dışı karışıklıklardır, en güçlü karışıklık matkap ile varyoz arasındadır (akustik olarak benzer, her ikisi de vurmalı). Bu tür yapılandırılmış karışıklık normaldir ve bilgilendiricidir -- size hangi sınıfların daha çok veriye ihtiyacı olduğunu söyler.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Mini Proje: Konuşmacı Tanımlama</h2>

<p class="l-text">Genel ses sınıflandırmasının yakın bir kuzeni: bir klip verildiğinde, hangi konuşmacının (kayıtlı N içinden) konuştuğunu tanımla. Aynı tarif, aynı araçlar -- ama model önceden eğitilmiş kodlayıcıların zaten kodladığı konuşmacı bilgisinden yararlanır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> librosa
<span class="kw">from</span> transformers <span class="kw">import</span> HubertModel, AutoFeatureExtractor
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, classification_report

<span class="cm"># 1) Kodlayıcı (HuBERT katman 9, klasik konuşmacı dostu seçim)</span>
extractor = AutoFeatureExtractor.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>)
encoder = HubertModel.<span class="fn">from_pretrained</span>(<span class="str">"facebook/hubert-base-ls960"</span>).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">def</span> <span class="fn">speaker_embed</span>(path):
    y, _ = librosa.<span class="fn">load</span>(path, sr=<span class="num">16000</span>, mono=<span class="kw">True</span>, duration=<span class="num">3.0</span>)
    inputs = <span class="fn">extractor</span>(y, sampling_rate=<span class="num">16000</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        h = <span class="fn">encoder</span>(**inputs, output_hidden_states=<span class="kw">True</span>).hidden_states[<span class="num">9</span>]
    <span class="kw">return</span> h.<span class="fn">mean</span>(dim=<span class="num">1</span>).<span class="fn">squeeze</span>().<span class="fn">cpu</span>().<span class="fn">numpy</span>()

<span class="cm"># 2) Kayıt veri kümesi: 5 konuşmacı, her biri 10 klip</span>
speakers = [<span class="str">"alice"</span>, <span class="str">"bob"</span>, <span class="str">"carol"</span>, <span class="str">"dave"</span>, <span class="str">"eve"</span>]
X_train, y_train = [], []
<span class="kw">for</span> i, spk <span class="kw">in</span> <span class="fn">enumerate</span>(speakers):
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
        X_train.<span class="fn">append</span>(<span class="fn">speaker_embed</span>(f<span class="str">"data/train/{spk}_{j}.wav"</span>))
        y_train.<span class="fn">append</span>(i)
X_train = np.<span class="fn">stack</span>(X_train)
y_train = np.<span class="fn">array</span>(y_train)
<span class="fn">print</span>(<span class="str">"egitim:"</span>, X_train.shape, y_train.shape)   <span class="cm"># (50, 768) (50,)

# 3) Donmuş embedding'lerin üzerinde lojistik regresyon</span>
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>, C=<span class="num">10</span>).<span class="fn">fit</span>(X_train, y_train)

<span class="cm"># 4) Saklanan klipler üzerinde değerlendir</span>
X_test, y_test = [], []
<span class="kw">for</span> i, spk <span class="kw">in</span> <span class="fn">enumerate</span>(speakers):
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
        X_test.<span class="fn">append</span>(<span class="fn">speaker_embed</span>(f<span class="str">"data/test/{spk}_{j}.wav"</span>))
        y_test.<span class="fn">append</span>(i)
X_test = np.<span class="fn">stack</span>(X_test); y_test = np.<span class="fn">array</span>(y_test)

preds = clf.<span class="fn">predict</span>(X_test)
<span class="fn">print</span>(<span class="str">"dogruluk:"</span>, <span class="fn">accuracy_score</span>(y_test, preds))
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, preds, target_names=speakers))
<span class="cm"># Tipik: konusmaci basina sadece 10 kayit klibi ile %95+ dogruluk

# 5) Yeni bir konuşmacı klibini tanımla</span>
new_emb = <span class="fn">speaker_embed</span>(<span class="str">"unknown.wav"</span>)
probs = clf.<span class="fn">predict_proba</span>(new_emb.<span class="fn">reshape</span>(<span class="num">1</span>, -<span class="num">1</span>))[<span class="num">0</span>]
<span class="kw">for</span> spk, p <span class="kw">in</span> <span class="fn">zip</span>(speakers, probs):
    <span class="fn">print</span>(f<span class="str">"  {spk}: {p:.3f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Konuşmacı kimliği: aynı tarif, daha fazla sınıf. Her oyuncak "konuşmacı" = bir temel frekans aralığı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.ensemble import RandomForestClassifier
rng = np.random.default_rng(0)
X, y = [], []
for spk, base in enumerate([200, 350, 500, 700]):
    for _ in range(30):
        f = base + rng.standard_normal()*15
        t = np.arange(2000) / 16000
        clip = np.sin(2*np.pi*f*t) + 0.05*rng.standard_normal(2000)
        X.append([clip.mean(), clip.std(), np.abs(np.fft.rfft(clip))[:50].mean()])
        y.append(spk)
rf = RandomForestClassifier(n_estimators=80, random_state=0).fit(X, y)
print('Speaker-ID accuracy:', round(rf.score(X, y), 3))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) L6'dan aynı HuBERT-katman-9 + ortalama-havuz embedder. Konuşmacı bilgisi HuBERT katman 9'da güçlü yaşar, bu yüzden bu doğal seçimdir. 2) Kayıt: 5 konuşmacı, her biri 10 klip = 50 eğitim embedding'i. Gerçek bir üründe kullanıcı kendisini birkaç cümle söyleyerek kaydeder. 3) Lojistik regresyon yeterlidir -- embedding'ler zaten konuşmacıya göre doğrusal olarak ayrılabilirdir. C=10 (hafif düzenleme) küçük veri için genellikle daha yüksek veya daha düşük değerleri yener. 4) Konuşmacı başına 5 saklı klipte test et; doğruluk temiz ses için %95+ olmalıdır. 5) Yeni bir klip için, predict_proba kayıtlı her konuşmacı için bir olasılık döner; "bilinmeyen konuşmacıyı" algılamak için eşikleyebilirsiniz (maks olasılık &lt; 0.5).</p>

<div class="calc-example"><div class="example-label">ÖRNEK: konuşmacı etiketli toplantı transkripti</div><div class="example-body">ASR'yi (Whisper) konuşmacı ID'si (HuBERT + sınıflandırıcı) ile birleştir: Whisper tarafından algılanan her segment için, o segmentin sesini embed et, hangi kayıtlı konuşmacıya ait olduğunu sınıflandır, konuşmacının adını başına ekle. Sonuç: <code>[Alice]: Welcome everyone. [Bob]: Quick question on the timeline. [Alice]: Sure...</code> -- 50 satırlık koddan ham sesten tam etiketlenmiş toplantı transkripti.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. NLP-Ses Hattı</h2>

<p class="l-text">Şimdi birleştir: ASR -> metin NLP (duygu analizi, NER, niyet) -> herhangi bir aşağı akış mantığı -> TTS yanıt. Bu, her modern ses ajanının arkasındaki mimaridir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Ses girişi</div><div class="card-body">Mikrofon, dosya, akış. 16 kHz mono'ya yeniden örnekle.</div></div>
<div class="calc-card"><div class="card-title">2. ASR</div><div class="card-body">Whisper (bu dersin L4'ü). Çıkış: metin + isteğe bağlı zaman damgaları.</div></div>
<div class="calc-card"><div class="card-title">3. NLU</div><div class="card-body">Duygu analizi, NER, niyet, RAG, LLM çağrısı -- standart metin NLP. Çıkış: yanıt metni.</div></div>
<div class="calc-card"><div class="card-title">4. TTS</div><div class="card-body">SpeechT5, Bark, ElevenLabs, OpenAI TTS (L5). Çıkış: yanıt sesi.</div></div>
<div class="calc-card"><div class="card-title">5. Ses çıkışı</div><div class="card-body">Hoparlör, dosya, arayana geri akış.</div></div>
<div class="calc-card"><div class="card-title">Gecikme bütçesi</div><div class="card-body">Toplam &lt; 1 s gerçek zamanlı hissettirir. Whisper-small ~150 ms, NLP ~500 ms, TTS ~200 ms.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers librosa soundfile</span>
<span class="kw">from</span> transformers <span class="kw">import</span> pipeline, SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset
<span class="kw">import</span> librosa, soundfile <span class="kw">as</span> sf, torch, numpy <span class="kw">as</span> np

<span class="cm"># 1) ASR (Whisper-small, İngilizce)</span>
asr = <span class="fn">pipeline</span>(<span class="str">"automatic-speech-recognition"</span>,
               model=<span class="str">"openai/whisper-small"</span>,
               device=<span class="num">0</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> -<span class="num">1</span>)

<span class="cm"># 2) Duygu sınıflandırıcı</span>
sentiment = <span class="fn">pipeline</span>(<span class="str">"sentiment-analysis"</span>,
                     model=<span class="str">"distilbert-base-uncased-finetuned-sst-2-english"</span>,
                     device=<span class="num">0</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> -<span class="num">1</span>)

<span class="cm"># 3) TTS (SpeechT5)</span>
tts_proc = SpeechT5Processor.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/speecht5_tts"</span>)
tts_model = SpeechT5ForTextToSpeech.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/speecht5_tts"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>).<span class="fn">eval</span>()
vocoder = SpeechT5HifiGan.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/speecht5_hifigan"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>).<span class="fn">eval</span>()
embeds = <span class="fn">load_dataset</span>(<span class="str">"Matthijs/cmu-arctic-xvectors"</span>, split=<span class="str">"validation"</span>)
speaker_emb = torch.<span class="fn">tensor</span>(embeds[<span class="num">7306</span>][<span class="str">"xvector"</span>]).<span class="fn">unsqueeze</span>(<span class="num">0</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">def</span> <span class="fn">speak</span>(text, out_path=<span class="str">"reply.wav"</span>):
    inputs = <span class="fn">tts_proc</span>(text=text, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        spec = tts_model.<span class="fn">generate_speech</span>(inputs[<span class="str">"input_ids"</span>], speaker_emb)
        wav = <span class="fn">vocoder</span>(spec).<span class="fn">cpu</span>().<span class="fn">numpy</span>()
    sf.<span class="fn">write</span>(out_path, wav, samplerate=<span class="num">16000</span>)
    <span class="kw">return</span> out_path

<span class="cm"># 4) Ses bot: duy -&gt; anla -&gt; cevapla</span>
<span class="kw">def</span> <span class="fn">voicebot_turn</span>(audio_in_path):
    <span class="cm"># Adım 1: ASR</span>
    transcript = <span class="fn">asr</span>(audio_in_path)[<span class="str">"text"</span>].<span class="fn">strip</span>()
    <span class="fn">print</span>(<span class="str">"KULLANICI:"</span>, transcript)

    <span class="cm"># Adım 2: NLP - kullanıcı ne hissediyor?</span>
    sent = <span class="fn">sentiment</span>(transcript)[<span class="num">0</span>]
    label, score = sent[<span class="str">"label"</span>], sent[<span class="str">"score"</span>]

    <span class="cm"># Adım 3: yanıt mantığı</span>
    <span class="kw">if</span> label == <span class="str">"NEGATIVE"</span> <span class="kw">and</span> score &gt; <span class="num">0.85</span>:
        reply = <span class="str">"I am sorry to hear that. Let me try to help."</span>
    <span class="kw">elif</span> label == <span class="str">"POSITIVE"</span> <span class="kw">and</span> score &gt; <span class="num">0.85</span>:
        reply = <span class="str">"That's great to hear! How can I help further?"</span>
    <span class="kw">else</span>:
        reply = f<span class="str">"You said: {transcript}. Got it."</span>
    <span class="fn">print</span>(<span class="str">"BOT:"</span>, reply)

    <span class="cm"># Adım 4: TTS</span>
    <span class="kw">return</span> <span class="fn">speak</span>(reply)

<span class="cm"># 5) Bir tur çalıştır</span>
out = <span class="fn">voicebot_turn</span>(<span class="str">"user_input.wav"</span>)
<span class="fn">print</span>(<span class="str">"yanit ses:"</span>, out)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Whisper→LLM→TTS aracı zinciri yerine sklearn hattı → kural-tabanlı yanıt → sentez taklidi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re
transcript = 'what is two plus two'
if 'plus' in transcript:
    nums = [int(w) for w in re.findall(r'(zero|one|two|three|four|five|six|seven|eight|nine)', transcript) for _ in [0]]
    word2num = dict(zip('zero one two three four five six seven eight nine'.split(), range(10)))
    nums = [word2num[w] for w in re.findall(r'\\b\\w+\\b', transcript) if w in word2num]
    answer = sum(nums)
else:
    answer = 'I did not understand'
print('User said    :', transcript)
print('Agent answer :', answer)</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) HuggingFace pipeline API'siyle üç önceden eğitilmiş model yükler: ASR için Whisper, duygu analizi için DistilBERT, TTS için SpeechT5 + HiFi-GAN. Üç model, üç satır import. 2) <code>speak</code> TTS hattını sarar, böylece yeniden kullanılabilir bir fonksiyonumuz olur: metin girer, WAV çıkar. 3) <code>voicebot_turn</code> duy-anla-cevapla döngüsüdür: ASR kullanıcı sesini yazıya döker, duygu sınıflandırıcı tonu yargılar, basit mantık bir yanıt metni seçer, TTS onu söyler. 4) Tüm bu 50 satırdır, tek bir GPU'da uçtan uca çalışır ve tüm hattı gösterir. 5) Gerçek bir ürün için, basit if/else'i gerçekten yararlı yanıtlar için bir LLM çağrısıyla (GPT-4, Claude) değiştirin; canlı ses için dosya tabanlı I/O'yu WebRTC/soketlerle değiştirin.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. LangChain + Whisper + OpenAI TTS</h2>

<p class="l-text">Üretim ajanları için genellikle ortada bir frontier LLM istersiniz. LangChain (veya LlamaIndex veya yalnızca openai client'ı) Whisper -> LLM -> TTS'i sürdürülebilir bir zincir halinde oluşturmanıza olanak tanır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install openai langchain langchain-openai</span>
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_core.messages <span class="kw">import</span> SystemMessage, HumanMessage
<span class="kw">import</span> os

client = <span class="fn">OpenAI</span>()                      <span class="cm"># OPENAI_API_KEY'i okur</span>
llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0.3</span>)

<span class="cm"># 1) OpenAI'nin Whisper API'si üzerinden ASR (yerel GPU gerekmez)</span>
<span class="kw">def</span> <span class="fn">openai_asr</span>(path):
    <span class="kw">with</span> <span class="fn">open</span>(path, <span class="str">"rb"</span>) <span class="kw">as</span> f:
        out = client.audio.transcriptions.<span class="fn">create</span>(
            model=<span class="str">"whisper-1"</span>,
            file=f,
            language=<span class="str">"en"</span>
        )
    <span class="kw">return</span> out.text.<span class="fn">strip</span>()

<span class="cm"># 2) Ajanı tanımlayan sistem istemiyle LLM yanıtı</span>
SYSTEM = <span class="str">"You are a helpful audiobook recommendation assistant. Reply in 1-2 short sentences."</span>

<span class="kw">def</span> <span class="fn">llm_reply</span>(history, user_text):
    history.<span class="fn">append</span>(<span class="fn">HumanMessage</span>(content=user_text))
    msg = <span class="fn">llm</span>([<span class="fn">SystemMessage</span>(content=SYSTEM)] + history)
    history.<span class="fn">append</span>(msg)
    <span class="kw">return</span> msg.content

<span class="cm"># 3) OpenAI üzerinden TTS</span>
<span class="kw">def</span> <span class="fn">openai_tts</span>(text, out=<span class="str">"reply.mp3"</span>):
    response = client.audio.speech.<span class="fn">create</span>(
        model=<span class="str">"tts-1"</span>,
        voice=<span class="str">"nova"</span>,
        input=text
    )
    response.<span class="fn">stream_to_file</span>(out)
    <span class="kw">return</span> out

<span class="cm"># 4) Bellekli tam konuşma döngüsü</span>
history = []

<span class="kw">def</span> <span class="fn">turn</span>(audio_in_path):
    user_text = <span class="fn">openai_asr</span>(audio_in_path)
    reply_text = <span class="fn">llm_reply</span>(history, user_text)
    reply_audio = <span class="fn">openai_tts</span>(reply_text)
    <span class="kw">return</span> {<span class="str">"user"</span>: user_text, <span class="str">"reply"</span>: reply_text, <span class="str">"audio"</span>: reply_audio}

<span class="cm"># 5) Çoklu turlu bir konuşma çalıştır</span>
<span class="fn">print</span>(<span class="fn">turn</span>(<span class="str">"hi.wav"</span>))           <span class="cm"># "Hi, can you recommend a thriller?"</span>
<span class="fn">print</span>(<span class="fn">turn</span>(<span class="str">"followup.wav"</span>))     <span class="cm"># "I want something narrated by a woman."</span>
<span class="fn">print</span>(<span class="fn">turn</span>(<span class="str">"thanks.wav"</span>))       <span class="cm"># "Thanks, I'll check that one out."</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">CLAP / çok modlu yerine geçen: kukla gömmeler + kosinüs arama ile paylaşımlı-uzay ses↔metin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
audio_embs = rng.standard_normal((6, 32))
text_embs  = rng.standard_normal((6, 32))
audio_embs /= np.linalg.norm(audio_embs, axis=1, keepdims=True)
text_embs  /= np.linalg.norm(text_embs,  axis=1, keepdims=True)
labels = ['dog bark','car horn','piano','rain','clapping','speech']
q = text_embs[2]                                # 'piano'
sims = audio_embs @ q
for i in np.argsort(-sims)[:3]:
    print(f'{labels[i]:&gt;10}  sim={sims[i]:0.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Üç OpenAI API client: Whisper (ASR), GPT-4o-mini (sohbet) ve TTS-1 (konuşma). Hepsi HTTP üzerinden çağrılır; yerel GPU yok. 2) <code>openai_asr</code> ses dosyasını yükler ve yazıya dökülmüş metni döner. Whisper-1 endpoint'i ekstra sunucu tarafı optimizasyonlarıyla <code>openai/whisper-large-v3</code> ile aynı modeldir. 3) <code>llm_reply</code> konuşma geçmişini (sistem + kullanıcı + asistan + ...) tutar ve LLM'i çağırır. Sistem istemi ajanın kişiliğini ve kısıtlamalarını tanımlar. 4) <code>openai_tts</code> LLM'in metin yanıtını MP3'e dönüştürür. 5) <code>turn</code> üçünü zincirler: duy, anla, konuş. Çağrılar arasında geçmiş kalıcı olduğunda, bot çoklu tür belleğine sahiptir ("Bir kadın tarafından anlatılan bir şey istiyorum" önceki "gerilim" isteğini hatırlamaya bağlıdır). 6) Dağıtılabilir bir ürün için bunu FastAPI/WebSocket ile sarın; yüksek eş zamanlılık için OpenAI client'ında bağlantı havuzu kullanın.</p>

<div class="l-note"><strong>Gecikme gerçeği:</strong> yalnızca OpenAI yığınında, her tür uçtan uca ~2-5 saniyedir (çoğunlukla TTS ses indirme). Daha düşük gecikme için Whisper-small'ı yerel olarak çalıştırın ve ElevenLabs akış endpoint'leri gibi bir akış TTS kullanın; toplam o zaman ~1.5 saniyeye düşer.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Çok Modlu Ses + Metin Modelleri</h2>

<p class="l-text">Yükselen bir sınır: ses ve metin girişlerini birlikte alan modeller. CLAP (Contrastive Language-Audio Pretraining) sesi ve metni paylaşılan bir uzaya embedler, metinden sese geri alma ve sıfır vuruşlu ses sınıflandırmayı olanaklı kılar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers torch librosa</span>
<span class="kw">from</span> transformers <span class="kw">import</span> ClapModel, ClapProcessor
<span class="kw">import</span> librosa
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F

<span class="cm"># CLAP: CLIP gibi ama ses için</span>
processor = ClapProcessor.<span class="fn">from_pretrained</span>(<span class="str">"laion/clap-htsat-unfused"</span>)
model = ClapModel.<span class="fn">from_pretrained</span>(<span class="str">"laion/clap-htsat-unfused"</span>).<span class="fn">eval</span>().<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="cm"># 1) Sıfır vuruşlu ses sınıflandırma</span>
y, sr = librosa.<span class="fn">load</span>(<span class="str">"unknown_sound.wav"</span>, sr=<span class="num">48000</span>, mono=<span class="kw">True</span>)
candidate_labels = [<span class="str">"a dog barking"</span>, <span class="str">"a cat meowing"</span>, <span class="str">"a car engine"</span>,
                    <span class="str">"a bird chirping"</span>, <span class="str">"a baby crying"</span>, <span class="str">"a piano playing"</span>]

inputs = <span class="fn">processor</span>(text=candidate_labels, audios=y, return_tensors=<span class="str">"pt"</span>,
                   padding=<span class="kw">True</span>, sampling_rate=<span class="num">48000</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)

<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**inputs)

logits = out.logits_per_audio        <span class="cm"># (1, num_labels)</span>
probs = logits.<span class="fn">softmax</span>(dim=-<span class="num">1</span>)[<span class="num">0</span>]
<span class="kw">for</span> label, p <span class="kw">in</span> <span class="fn">zip</span>(candidate_labels, probs):
    <span class="fn">print</span>(f<span class="str">"  {p.item():.3f}  {label}"</span>)
<span class="cm"># 0.812  a dog barking
# 0.072  a cat meowing
# 0.054  a baby crying  ...

# 2) Metinden sese geri alma: bir açıklamaya uyan klipleri bul</span>
<span class="kw">def</span> <span class="fn">embed_audio</span>(path):
    y, _ = librosa.<span class="fn">load</span>(path, sr=<span class="num">48000</span>, mono=<span class="kw">True</span>)
    inputs = <span class="fn">processor</span>(audios=y, return_tensors=<span class="str">"pt"</span>, sampling_rate=<span class="num">48000</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        <span class="kw">return</span> model.<span class="fn">get_audio_features</span>(**inputs).<span class="fn">squeeze</span>()

<span class="kw">def</span> <span class="fn">embed_text</span>(text):
    inputs = <span class="fn">processor</span>(text=[text], return_tensors=<span class="str">"pt"</span>, padding=<span class="kw">True</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        <span class="kw">return</span> model.<span class="fn">get_text_features</span>(**inputs).<span class="fn">squeeze</span>()

<span class="cm"># 1000 ses klibi indeksle</span>
<span class="cm"># audio_embeds = torch.stack([embed_audio(p) for p in clip_paths])</span>
<span class="cm"># Metin açıklamasıyla ara</span>
query_emb = <span class="fn">embed_text</span>(<span class="str">"upbeat jazz with a saxophone solo"</span>)
<span class="cm"># sims = F.cosine_similarity(query_emb.unsqueeze(0), audio_embeds, dim=1)
# top_k = sims.topk(5)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Ses Etkinlik Algılama (VAD): silero engellendi. Eşdeğer = pencere başına enerji eşiği.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
win = 320  # 20 ms at 16 kHz
rms = np.sqrt(np.mean(audio.reshape(-1, win)**2, axis=1))
thr = 0.1 * rms.max()
voiced = rms &gt; thr
print('Frames     :', voiced.shape[0])
print('Voiced %   :', round(float(voiced.mean()) * 100, 1), '%')
print('First 20 mask:', voiced[:20].astype(int))</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) CLAP'ı yükler, ses analoğu CLIP. Model ses kliplerini ve metin açıklamalarını aynı 512B embedding uzayına eşler; eşleşen çiftler yüksek kosinüs benzerliğine sahiptir. 2) Sıfır vuruşlu sınıflandırma: bir ses klibinin yanında N aday metin etiketi sağlayın; CLAP her etiketi ses embedding'ine benzerliğine göre puanlar. Etiketli eğitim verisi gerekmez -- etiketiniz doğal dilde ifade edilebiliyorsa, CLAP onu puanlayabilir. 3) Metinden sese geri alma: bir corpus için ses embedding'lerini önceden hesapla, sonra sorgu zamanında bir metin açıklamasını embed et ve en yakın ses kliplerini bul. Bu "duymak istediğinizi tanımlayın" arama arayüzlerini güçlendirir. 4) Aynı mekanizma sesten metne geri almayı (geri alma ile başlık üretimi) ve ses benzerliğini (klipten klibe) olanaklı kılar.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: ses efekti kütüphanesi araması</div><div class="example-body">Bir ses tasarımcısının kütüphanesi 50000 etiketsiz klibe sahip. Her birini CLAP ses kodlayıcısıyla embed et (tek seferlik maliyet). Kullanıcı "geceleyin metal bir çatıda yağmur" yazar -- sorguyu CLAP metin kodlayıcısıyla embed et, top-10 kosinüs eşleşmelerini bul. Hiçbir klip o tam ifade ile etiketlenmemiş olsa bile, CLAP görsel olarak uygun eşleşmeleri geri alır. Elle düzenlenmiş meta veriyi değiştirir; herhangi bir boyutta kütüphaneye ölçeklenir.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Gerçek Zaman Hususları</h2>

<p class="l-text">Dosya girişlerinde çalışan demo bir ses bot bir şeydir; sesi içeri ve dışarı akıtan gerçek zamanlı bir ajan başka bir şey. Üç endişe baskındır: akış, ses etkinliği algılama ve sıra alma.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Akış ASR</div><div class="card-body">Tam söylemeler yerine 1-2 saniyelik parçalarda sesi işle. Whisper-small + parçalı çıkarım veya wav2vec 2.0 akış.</div></div>
<div class="calc-card"><div class="card-title">VAD</div><div class="card-body">Ses etkinliği algılama: kullanıcı ne zaman konuşmaya başlar/durur? silero-vad kullan (gerçek zamanlı, 100ms gecikme).</div></div>
<div class="calc-card"><div class="card-title">Sıra alma</div><div class="card-body">Kullanıcı 500-700 ms duraklar, sıranın sonu olarak değerlendir. Duraklama algılama + prozodik ipuçları.</div></div>
<div class="calc-card"><div class="card-title">Akış TTS</div><div class="card-body">ElevenLabs akış endpoint'leri model üretirken ses parçaları yayar. Gecikme 2 s'den 300 ms'ye düşer.</div></div>
<div class="calc-card"><div class="card-title">Yankı iptali</div><div class="card-body">Bot'un TTS'i hoparlörlerden geçerse, mikrofon onu yakalar. AEC kütüphanelerini (speexdsp, WebRTC AEC) kullan.</div></div>
<div class="calc-card"><div class="card-title">Kesme</div><div class="card-body">Bot konuşurken kullanıcı konuşmaya başlarsa algıla; TTS oynatmayı iptal et. Zor ama zorunlu.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install silero-vad torch torchaudio</span>
<span class="kw">import</span> torch
<span class="kw">import</span> torchaudio

<span class="cm"># 1) silero-vad ile ses etkinliği algılama (açık kaynak, ONNX-hızlı)</span>
model, utils = torch.hub.<span class="fn">load</span>(repo_or_dir=<span class="str">"snakers4/silero-vad"</span>, model=<span class="str">"silero_vad"</span>)
get_speech_timestamps, _, read_audio, _, _ = utils

<span class="cm"># Yükle ve algıla</span>
y = <span class="fn">read_audio</span>(<span class="str">"long_recording.wav"</span>, sampling_rate=<span class="num">16000</span>)
speech_chunks = <span class="fn">get_speech_timestamps</span>(y, model, sampling_rate=<span class="num">16000</span>,
                                       min_speech_duration_ms=<span class="num">250</span>,
                                       min_silence_duration_ms=<span class="num">200</span>)
<span class="kw">for</span> ch <span class="kw">in</span> speech_chunks:
    <span class="fn">print</span>(f<span class="str">"konusma: {ch['start']/16000:.2f}-{ch['end']/16000:.2f} s"</span>)
<span class="cm"># Çıktı:
# konusma: 0.32-1.91 s
# konusma: 2.45-4.10 s
# konusma: 5.20-7.00 s</span>

<span class="cm"># 2) Akış ses bot için gerçek zaman sözde kod</span>
<span class="kw">def</span> <span class="fn">streaming_loop</span>():
    audio_buffer = []
    <span class="kw">while</span> <span class="kw">True</span>:
        chunk = <span class="fn">microphone_read</span>(<span class="num">160</span>)         <span class="cm"># 16 kHz'de 10 ms</span>
        is_speech = vad.<span class="fn">predict</span>(chunk)

        <span class="kw">if</span> is_speech:
            audio_buffer.<span class="fn">append</span>(chunk)
        <span class="kw">elif</span> <span class="fn">len</span>(audio_buffer) &gt; <span class="num">0</span>:
            <span class="cm"># Konuşmadan sonra 500ms sessizlik -&gt; sıranın sonu</span>
            silence_ms = <span class="fn">count_silence</span>(audio_buffer)
            <span class="kw">if</span> silence_ms &gt; <span class="num">500</span>:
                full_audio = np.<span class="fn">concatenate</span>(audio_buffer)
                text = asr.<span class="fn">transcribe</span>(full_audio)
                reply = llm.<span class="fn">generate</span>(text)
                <span class="kw">for</span> tts_chunk <span class="kw">in</span> tts.<span class="fn">stream</span>(reply):
                    <span class="fn">speaker_write</span>(tts_chunk)
                audio_buffer = []</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Uyandırma kelimesi algılayıcısı 1B şablon eşleme (çapraz-korelasyon) ile taklit edildi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from scipy import signal
rng = np.random.default_rng(0)
template = audio[:1600]                        # first 100 ms = 'wakeword'
stream = np.concatenate([rng.standard_normal(8000)*0.05, audio, rng.standard_normal(8000)*0.05])
corr = signal.correlate(stream, template, mode='valid')
peak = int(np.argmax(np.abs(corr)))
print('Stream length:', len(stream))
print('Wakeword detected at sample', peak, '≈', round(peak/16000, 2), 's')</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) silero-vad'ı yükler, fiili açık kaynak ses etkinliği algılayıcısı. Küçüktür (~1 MB), hızlıdır (CPU'da gerçek zamanlı) ve doğrudur. 2) Uzun bir kayıt verildiğinde, <code>get_speech_timestamps</code> konuşmanın gerçekleştiği aralıkları döner, uzun sessizlikleri filtreler. Hem gerçek zamanlı sıra algılama hem de uzun dosyaların çevrimdışı ön işlemi için yararlıdır. 3) Akış döngüsü sözde kodu gerçek zamanlı bir ses bot'unun mimarisini gösterir: sürekli olarak 10 ms ses parçaları oku, VAD'ı çalıştır, konuşmayı biriktir ve algılanan konuşma sonrası sessizlik durumunda ASR -> LLM -> TTS zincirini ateşle. 4) Üretim için, üç bileşen de akış olmalı: parçalı Whisper çıkarımı, akış LLM (token-token), akış TTS (ses parçaları). LiveKit, Pipecat ve benzer çerçeveler bunu birlikte paketler.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Özet: Bir Ses Uygulaması Kontrol Listesi</h2>

<p class="l-text">Gerçek ses-NLP uygulamaları oluşturmak için pratik bir kontrol listesi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ses I/O</div><div class="card-body">[-1, 1]'e normalize edilmiş 16 kHz mono. Tarayıcı için WebRTC, masaüstü için sounddevice.</div></div>
<div class="calc-card"><div class="card-title">VAD</div><div class="card-body">silero-vad. ASR'den önce sessizliği filtrele; akış için sıra sonunu algıla.</div></div>
<div class="calc-card"><div class="card-title">ASR</div><div class="card-body">Prototipleme için Whisper-small; üretimde faster-whisper veya insanely-fast-whisper.</div></div>
<div class="calc-card"><div class="card-title">NLP</div><div class="card-body">Genel sohbet için GPT-4o-mini veya Claude Haiku; dar niyetler için ince ayarlanmış BERT.</div></div>
<div class="calc-card"><div class="card-title">TTS</div><div class="card-body">İngilizce için SpeechT5 veya OpenAI TTS; klonlama için XTTS-v2; düşük gecikme için ElevenLabs akış.</div></div>
<div class="calc-card"><div class="card-title">Bellek</div><div class="card-body">Redis'te konuşma geçmişi, uzun vadeli bilgi için vektör DB.</div></div>
<div class="calc-card"><div class="card-title">Loglama</div><div class="card-body">Hata ayıklama ve yineleme için sesi + transkripti + yanıtı kaydet. PII'yi anonimleştir.</div></div>
<div class="calc-card"><div class="card-title">Gecikme hedefi</div><div class="card-body">&lt; 1.5 s uçtan uca. Her yerde akış.</div></div>
</div>

<div class="think-box"><div class="think-label">TEMEL ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Ses sınıflandırma L6 tarifini yeniden kullanır: önceden eğitilmiş kodlayıcı + sınıflandırma başlığı + çapraz entropi.<br><strong>2.</strong> AST (Audio Spectrogram Transformer) ve PANNs genel ses sınıflandırması için SOTA'dır; konuşmacı ile ilgili görevler için HuBERT.<br><strong>3.</strong> HuBERT katman 9 + lojistik regresyon ile konuşmacı tanımlama, konuşmacı başına 10 kayıt klibi ile %95+'a ulaşır.<br><strong>4.</strong> NLP-ses hattı bir zincirdir: ASR -&gt; NLP -&gt; TTS. Her adım HuggingFace ile tek bir fonksiyondur.<br><strong>5.</strong> 50 satırlık bir ses bot uçtan uca konuşma için Whisper + duygu analizi/LLM + SpeechT5 kullanır.<br><strong>6.</strong> CLAP ortak embedding üzerinden sıfır vuruşlu ses sınıflandırma ve metinden sese geri almayı olanaklı kılar.<br><strong>7.</strong> Gerçek zamanlı ajanlar her şeyi akıtmaya ihtiyaç duyar: sıra algılama için VAD, parçalı ASR, akış TTS.<br><strong>8.</strong> Sonraki ders: üretim sesi. Optimizasyon, ONNX, nicemleme ve düşük gecikmeli, güvenilir ses uygulamalarının mühendisliği.</div></div>
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
    var labels = lang==='tr' ? ['siren','kopek','korna','matkap','muzik','varyoz']
                              : ['siren','dog','horn','drilling','music','jackhammer'];
    var matrix = [
      [82,  2,  4,  4,  3,  5],
      [ 1, 88,  3,  2,  4,  2],
      [ 5,  4, 80,  4,  3,  4],
      [ 3,  2,  3, 75,  2, 15],
      [ 2,  3,  4,  3, 86,  2],
      [ 4,  2,  3, 14,  2, 75]
    ];
    var trace = {z:matrix, x:labels, y:labels, type:'heatmap', colorscale:[[0,'#0d1c14'],[0.3,'#1a3a25'],[0.6,'#3aa86a'],[0.85,'#7adea4'],[1,'#d8f4e0']], showscale:true, colorbar:{title:'%', titlefont:{color:T.text}, tickfont:{color:T.text}}, text:matrix, texttemplate:'%{text}', textfont:{color:'#fff', size:11}};
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'6 Sınıflı Şehir Sesi Karışıklık Matrisi':'6-Class Urban Sound Confusion Matrix', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'tahmin':'predicted', side:'bottom', gridcolor:T.grid},
      yaxis:{title:lang==='tr'?'gerçek':'true', autorange:'reversed', gridcolor:T.grid}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  confPlot('plot-al7-conf-en','en');
  confPlot('plot-al7-conf-tr','tr');
}, 250);</script>`
};
