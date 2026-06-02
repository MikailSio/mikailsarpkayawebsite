window.AUDIO_L11 = {

en: `<p class="l-text"><strong>You speak. The agent thinks. It speaks back. All under 500ms.</strong> That's the modern voice agent — Whisper for ears, an LLM for brains, TTS for a voice. Plus tool use.</p>
<p class="l-text">In this lesson you'll learn audio LLMs (AudioLM, MusicLM, Bark), latency budgets, streaming ASR, interruption handling, voice-driven function calling, and the privacy trade-off between on-device and cloud.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain audio LLMs that treat speech as discrete EnCodec tokens</li>
<li>Architect a Whisper to LLM to TTS voice agent with sub-500ms latency</li>
<li>Decompose the latency budget across STT, reasoning, and TTS</li>
<li>Build a minimal voice agent and stream partial outputs to cut perceived delay</li>
<li>Add tool use so the voice agent can call APIs in response to spoken intent</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Audio LLMs: Speech as Tokens</h2>
<p class="l-text">Audio LLMs treat audio as a sequence of discrete tokens, just like text. A neural codec (EnCodec, SoundStream) compresses 16kHz waveform into ~75 tokens/sec. Then a transformer learns to predict the next token — generating speech, music, or sound effects.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">AudioLM</div><div class="card-body">Google. Coarse semantic tokens + acoustic tokens, 2-stage generation.</div></div>
<div class="calc-card"><div class="card-title">MusicLM</div><div class="card-body">Text → music. Trained on captioned audio pairs.</div></div>
<div class="calc-card"><div class="card-title">Bark</div><div class="card-body">Suno. Open multilingual TTS that emits laughs, sighs, music.</div></div>
<div class="calc-card"><div class="card-title">VALL-E</div><div class="card-body">Microsoft. 3-second voice clone via in-context learning.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Voice Agent Architecture</h2>
<p class="l-text">The classic chained approach: ASR → LLM → TTS, each module separate. The new approach (GPT-4o, Gemini Live): one multimodal model takes audio in, emits audio out, no chaining.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Chained</div><div class="card-body">Whisper → GPT → ElevenLabs. Modular, debuggable, slower (~1-2s).</div></div>
<div class="calc-card"><div class="card-title">End-to-end</div><div class="card-body">GPT-4o Realtime, Gemini Live. Fast (~300ms), preserves prosody/emotion.</div></div>
<div class="calc-card"><div class="card-title">Hybrid</div><div class="card-body">Streaming ASR + LLM with audio output head + interruption logic.</div></div>
<div class="calc-card"><div class="card-title">Tool use</div><div class="card-body">Voice → function call → API → response read aloud.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Latency Budget</h2>
<p class="l-text">Humans perceive a turn-taking delay over 500ms as awkward. The total budget breaks down across components:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAD endpoint</div><div class="card-body">~100ms after user stops talking.</div></div>
<div class="calc-card"><div class="card-title">ASR</div><div class="card-body">Streaming Whisper-large: ~150ms tail latency.</div></div>
<div class="calc-card"><div class="card-title">LLM TTFT</div><div class="card-body">First token: ~150-300ms (GPT-4o Realtime, Groq).</div></div>
<div class="calc-card"><div class="card-title">TTS first chunk</div><div class="card-body">~100ms for streaming neural TTS.</div></div>
</div>
<p class="l-text">Tricks to hit budget: streaming everything, predictive endpointing, speculative TTS on partial LLM output.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. A Minimal Voice Agent</h2>
<p class="l-text">A toy chained agent. Production systems stream every component, but this shows the bones.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> sounddevice <span class="kw">as</span> sd
<span class="kw">import</span> whisper
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
<span class="kw">from</span> elevenlabs <span class="kw">import</span> generate, play

asr = whisper.<span class="fn">load_model</span>(<span class="str">"base"</span>)
client = <span class="fn">OpenAI</span>()

<span class="kw">def</span> <span class="fn">record</span>(seconds=<span class="num">5</span>, sr=<span class="num">16000</span>):
    <span class="fn">print</span>(<span class="str">"Listening..."</span>)
    audio = sd.<span class="fn">rec</span>(<span class="fn">int</span>(seconds*sr), samplerate=sr, channels=<span class="num">1</span>, dtype=<span class="str">'float32'</span>)
    sd.<span class="fn">wait</span>()
    <span class="kw">return</span> audio.<span class="fn">flatten</span>()

<span class="kw">def</span> <span class="fn">voice_turn</span>():
    <span class="cm"># 1) Record + transcribe</span>
    audio = <span class="fn">record</span>()
    text = asr.<span class="fn">transcribe</span>(audio)[<span class="str">"text"</span>]
    <span class="fn">print</span>(<span class="str">"User:"</span>, text)

    <span class="cm"># 2) Send to LLM</span>
    resp = client.chat.completions.<span class="fn">create</span>(
        model=<span class="str">"gpt-4o-mini"</span>,
        messages=[{<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>: text}])
    reply = resp.choices[<span class="num">0</span>].message.content
    <span class="fn">print</span>(<span class="str">"Agent:"</span>, reply)

    <span class="cm"># 3) Speak</span>
    audio_out = <span class="fn">generate</span>(text=reply, voice=<span class="str">"Rachel"</span>, model=<span class="str">"eleven_turbo_v2"</span>)
    <span class="fn">play</span>(audio_out)

<span class="kw">while</span> <span class="kw">True</span>:
    <span class="fn">voice_turn</span>()</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Voice-agent skeleton in numpy: VAD-gate audio → mock transcript → rule-based reply.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
def vad(y, thr=0.05): return float(np.sqrt(np.mean(y**2))) &gt; thr
def transcribe(y): return 'hello world' if vad(y) else ''
def reply(text):
    if 'hello' in text: return 'hi there'
    return '...'
txt = transcribe(audio)
out = reply(txt)
print('User    :', txt or '&lt;silence&gt;')
print('Agent   :', out)
# Cycle latency = sum of stage-times (placeholder)
print('Latency : ~150 ms (mock)')</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Records 5s of mic audio at 16kHz. 2) Whisper transcribes to text. 3) Sends text to GPT-4o-mini, gets a reply. 4) ElevenLabs synthesizes the reply and plays it. 5) Loops forever. Total latency ~2-3s — too slow for production but a complete demo.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Streaming & Interruption</h2>
<p class="l-text">Real users interrupt. The agent must detect speech onset while it's talking, stop TTS, and switch back to listening. Mechanisms:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Echo cancellation</div><div class="card-body">Subtract agent's own voice from mic so VAD only fires on user.</div></div>
<div class="calc-card"><div class="card-title">Barge-in VAD</div><div class="card-body">Always-on VAD; if user speaks &gt;200ms, cancel TTS.</div></div>
<div class="calc-card"><div class="card-title">Streaming TTS</div><div class="card-body">Generate audio chunks as LLM emits tokens — kill at any chunk boundary.</div></div>
<div class="calc-card"><div class="card-title">Endpointing</div><div class="card-body">Predict end-of-turn; don't wait for fixed silence (faster turn-taking).</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Voice + Tool Use</h2>
<p class="l-text">"What's the weather in Istanbul?" → ASR → LLM emits function call <code>get_weather(city="Istanbul")</code> → API runs → result fed back → LLM produces natural reply → TTS speaks. The user never sees JSON; the agent feels conversational while doing real work.</p>
<div id="audio-l11-graph-en" style="height:380px;width:100%"></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. On-Device vs Cloud</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">whisper.cpp</div><div class="card-body">Quantized Whisper on CPU/phone. Private, free, slower (large model = 2-5x realtime on M1).</div></div>
<div class="calc-card"><div class="card-title">Cloud (OpenAI Realtime)</div><div class="card-body">Fastest, multimodal, but every word leaves device. Cost per minute.</div></div>
<div class="calc-card"><div class="card-title">Hybrid</div><div class="card-body">Wake-word + intent on device, hard queries to cloud.</div></div>
<div class="calc-card"><div class="card-title">Privacy regs</div><div class="card-body">EU AI Act, biometric voice data — store transcripts not waveforms when possible.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Audio LLMs treat audio as discrete tokens via neural codecs (EnCodec, SoundStream).<br><strong>2.</strong> Voice agent = ASR → LLM → TTS chained, OR end-to-end multimodal (GPT-4o Realtime).<br><strong>3.</strong> Latency budget &lt;500ms — every stage must stream; speculative TTS helps.<br><strong>4.</strong> Interruption handling needs echo cancellation, barge-in VAD, and streaming TTS that can be cancelled.<br><strong>5.</strong> Voice + function calling unlocks real assistants; on-device gives privacy, cloud gives speed and capability.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024-2026 Landscape: Real-Time Voice Agents</h2>

<p class="l-text"><strong>The chained Whisper -> LLM -> TTS architecture is being replaced by full-duplex, end-to-end voice models that talk and listen simultaneously.</strong> If you ship a voice agent in 2026, you owe it to your users to at least evaluate the four stacks below before settling on the classic chain. Each crosses the perceptual threshold where the conversation finally feels human-paced.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Moshi (Kyutai, 2024-09)</div><div class="card-body">Real-time full-duplex voice LLM. The model speaks and listens at the same time, just like a person -- no turn-taking required. End-to-end latency under 200 ms. Open source (7B), runs on a single L4 GPU. The first credible answer to "what would a voice-native LLM look like?".</div></div>
<div class="calc-card"><div class="card-title">OpenAI Realtime API (2024-10)</div><div class="card-body">GPT-4o speech-to-speech endpoint with under 500 ms latency, native function calling, interruption handling. WebSocket protocol; you stream raw audio in and audio out. The production default for high-quality cloud voice agents.</div></div>
<div class="calc-card"><div class="card-title">Hume EVI 2 (Hume AI, 2024-10)</div><div class="card-body">Empathic Voice Interface. Models prosody (pitch, tempo, energy) explicitly, so it can detect frustration or excitement and adapt its tone. Custom personalities, multilingual. The right pick when emotional attunement matters (mental health, coaching, customer support).</div></div>
<div class="calc-card"><div class="card-title">Pipecat (Daily, 2024)</div><div class="card-body">Open-source voice agent framework. Vendor-neutral: swap Whisper/Deepgram for ASR, GPT-4o/Claude/Llama for the brain, ElevenLabs/Cartesia for TTS. Handles VAD, interruption, function dispatch. The right baseline for self-hosted production agents.</div></div>
<div class="calc-card"><div class="card-title">AudioLM 2 / Gemini Live</div><div class="card-body">Google's full-duplex stack. Gemini Live (consumer) and the underlying AudioLM 2 research line. Comparable to GPT-4o Realtime; tighter integration if you're already on Google Cloud.</div></div>
<div class="calc-card"><div class="card-title">When to chain anyway</div><div class="card-body">Specialized verticals (medical transcription with a tuned ASR, low-resource languages, strict on-prem) still favor explicit Whisper -> LLM -> TTS. You sacrifice 200-500 ms but get full control over each component.</div></div>
</div>

<div class="l-note"><strong>Voice-agent practitioner's stack (2025-26):</strong> Prototype on OpenAI Realtime for the fastest demo. Productionize on Pipecat for control. Add Hume EVI 2 if your domain rewards emotional intelligence. Watch Moshi closely -- the first open-weights duplex model that closes the latency gap.</div>
</div>

<script>setTimeout(function(){
  var T = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var bg = T ? '#0e1117' : '#ffffff';
  var fg = T ? '#e6e8ee' : '#1c1f26';
  var stages = ['VAD endpoint', 'ASR (streaming Whisper)', 'LLM TTFT', 'TTS first chunk', 'Network RTT'];
  var ms = [100, 150, 220, 100, 60];
  var data = [{x:ms, y:stages, type:'bar', orientation:'h', marker:{color:'#c8a96e'}, text:ms.map(function(m){return m+'ms'}), textposition:'outside'}];
  var layout = {paper_bgcolor:bg, plot_bgcolor:bg, font:{color:fg}, margin:{t:40,r:60,b:50,l:200}, xaxis:{title:'Latency (ms)'}, title:'Voice Agent Latency Budget (Total ~630ms)'};
  if (document.getElementById('audio-l11-graph-en')) Plotly.newPlot('audio-l11-graph-en', data, layout, {displayModeBar:false});
  if (document.getElementById('audio-l11-graph-tr')) Plotly.newPlot('audio-l11-graph-tr', data, layout, {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Sen konuşursun. Ajan düşünür. Geri konuşur. Hepsi 500ms'nin altında.</strong> Modern ses ajanı bu — kulak için Whisper, beyin için bir LLM, ses için TTS. Bir de araç kullanımı.</p>
<p class="l-text">Bu derste ses LLM'lerini (AudioLM, MusicLM, Bark), gecikme bütçelerini, akış halinde ASR'yi, kesme yönetimini, sesle fonksiyon çağırmayı ve cihaz-üstü vs bulut arasındaki gizlilik dengesini öğreneceksin.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Konuşmayı ayrık EnCodec tokenleri olarak işleyen ses LLM'lerini açıklayacaksın</li>
<li>Whisper - LLM - TTS ses ajanını 500ms altı gecikmeyle mimarileyeceksin</li>
<li>Gecikme bütçesini STT, akıl yürütme ve TTS arasında paylaştıracaksın</li>
<li>Minimal bir ses ajanı kurup algılanan gecikmeyi azaltmak için kısmi çıktı stream'leyeceksin</li>
<li>Ses ajanı API çağırabilsin diye sözlü niyete tool use ekleyeceksin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Ses LLM'leri: Token Olarak Konuşma</h2>
<p class="l-text">Ses LLM'leri sesi, tıpkı metin gibi ayrık tokenler dizisi olarak işler. Sinirsel bir kodek (EnCodec, SoundStream) 16kHz dalga formunu ~75 token/sn'ye sıkıştırır. Sonra bir transformer bir sonraki tokeni tahmin etmeyi öğrenir — konuşma, müzik veya ses efektleri üretir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">AudioLM</div><div class="card-body">Google. Kaba semantik token + akustik token, 2 aşamalı üretim.</div></div>
<div class="calc-card"><div class="card-title">MusicLM</div><div class="card-body">Metin → müzik. Açıklamalı ses çiftleri ile eğitilmiş.</div></div>
<div class="calc-card"><div class="card-title">Bark</div><div class="card-body">Suno. Kahkaha, iç çekme, müzik yayan açık çok dilli TTS.</div></div>
<div class="calc-card"><div class="card-title">VALL-E</div><div class="card-body">Microsoft. Bağlam-içi öğrenme ile 3 saniyelik ses klonlama.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Ses Ajanı Mimarisi</h2>
<p class="l-text">Klasik zincir yaklaşımı: ASR → LLM → TTS, her modül ayrı. Yeni yaklaşım (GPT-4o, Gemini Live): tek çok modlu model sesi alır, ses çıkarır, zincir yok.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Zincir</div><div class="card-body">Whisper → GPT → ElevenLabs. Modüler, hata ayıklanabilir, yavaş (~1-2s).</div></div>
<div class="calc-card"><div class="card-title">Uçtan uca</div><div class="card-body">GPT-4o Realtime, Gemini Live. Hızlı (~300ms), prozodi/duyguyu korur.</div></div>
<div class="calc-card"><div class="card-title">Hibrit</div><div class="card-body">Akış halinde ASR + ses çıkış başlı LLM + kesme mantığı.</div></div>
<div class="calc-card"><div class="card-title">Araç kullanımı</div><div class="card-body">Ses → fonksiyon çağrısı → API → yanıt sesli okunur.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Gecikme Bütçesi</h2>
<p class="l-text">İnsanlar 500ms üstü sıra-alma gecikmesini garip algılar. Toplam bütçe bileşenler arasında bölünür:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAD bitişi</div><div class="card-body">Kullanıcı durduktan ~100ms sonra.</div></div>
<div class="calc-card"><div class="card-title">ASR</div><div class="card-body">Akış halinde Whisper-large: ~150ms kuyruk gecikmesi.</div></div>
<div class="calc-card"><div class="card-title">LLM TTFT</div><div class="card-body">İlk token: ~150-300ms (GPT-4o Realtime, Groq).</div></div>
<div class="calc-card"><div class="card-title">TTS ilk parça</div><div class="card-body">Akış halinde sinirsel TTS için ~100ms.</div></div>
</div>
<p class="l-text">Bütçeyi tutturma hileleri: her şeyi akışa al, tahminci endpointing, kısmi LLM çıktısı üzerinde spekülatif TTS.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Minimal Bir Ses Ajanı</h2>
<p class="l-text">Oyuncak bir zincir ajan. Üretim sistemleri her bileşeni akışa alır, ama bu iskeleti gösterir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> sounddevice <span class="kw">as</span> sd
<span class="kw">import</span> whisper
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
<span class="kw">from</span> elevenlabs <span class="kw">import</span> generate, play

asr = whisper.<span class="fn">load_model</span>(<span class="str">"base"</span>)
client = <span class="fn">OpenAI</span>()

<span class="kw">def</span> <span class="fn">record</span>(seconds=<span class="num">5</span>, sr=<span class="num">16000</span>):
    <span class="fn">print</span>(<span class="str">"Dinliyor..."</span>)
    audio = sd.<span class="fn">rec</span>(<span class="fn">int</span>(seconds*sr), samplerate=sr, channels=<span class="num">1</span>, dtype=<span class="str">'float32'</span>)
    sd.<span class="fn">wait</span>()
    <span class="kw">return</span> audio.<span class="fn">flatten</span>()

<span class="kw">def</span> <span class="fn">voice_turn</span>():
    <span class="cm"># 1) Kayıt + transkripsiyon</span>
    audio = <span class="fn">record</span>()
    text = asr.<span class="fn">transcribe</span>(audio)[<span class="str">"text"</span>]
    <span class="fn">print</span>(<span class="str">"Kullanıcı:"</span>, text)

    <span class="cm"># 2) LLM'e gönder</span>
    resp = client.chat.completions.<span class="fn">create</span>(
        model=<span class="str">"gpt-4o-mini"</span>,
        messages=[{<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>: text}])
    reply = resp.choices[<span class="num">0</span>].message.content
    <span class="fn">print</span>(<span class="str">"Ajan:"</span>, reply)

    <span class="cm"># 3) Konuş</span>
    audio_out = <span class="fn">generate</span>(text=reply, voice=<span class="str">"Rachel"</span>, model=<span class="str">"eleven_turbo_v2"</span>)
    <span class="fn">play</span>(audio_out)

<span class="kw">while</span> <span class="kw">True</span>:
    <span class="fn">voice_turn</span>()</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Voice-agent skeleton in numpy: VAD-gate audio → mock transcript → rule-based reply.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
def vad(y, thr=0.05): return float(np.sqrt(np.mean(y**2))) &gt; thr
def transcribe(y): return 'hello world' if vad(y) else ''
def reply(text):
    if 'hello' in text: return 'hi there'
    return '...'
txt = transcribe(audio)
out = reply(txt)
print('User    :', txt or '&lt;silence&gt;')
print('Agent   :', out)
# Cycle latency = sum of stage-times (placeholder)
print('Latency : ~150 ms (mock)')</code></pre></div>
</div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) 16kHz'de 5 saniyelik mikrofon kaydı yapar. 2) Whisper metne çevirir. 3) Metni GPT-4o-mini'ye gönderir, yanıt alır. 4) ElevenLabs yanıtı sentezler ve oynatır. 5) Sonsuz döner. Toplam gecikme ~2-3s — üretim için yavaş ama eksiksiz bir demo.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Akış ve Kesme</h2>
<p class="l-text">Gerçek kullanıcılar sözünü keser. Ajan, konuşurken konuşma başlangıcını algılamalı, TTS'i durdurmalı ve dinlemeye geri dönmeli. Mekanizmalar:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yankı iptali</div><div class="card-body">Mikrofondan ajanın kendi sesini çıkar; VAD sadece kullanıcıda tetiklensin.</div></div>
<div class="calc-card"><div class="card-title">Barge-in VAD</div><div class="card-body">Sürekli açık VAD; kullanıcı 200ms'den fazla konuşursa TTS iptal.</div></div>
<div class="calc-card"><div class="card-title">Akış TTS</div><div class="card-body">LLM token ürettikçe ses parçaları üret — herhangi bir parça sınırında öldür.</div></div>
<div class="calc-card"><div class="card-title">Endpointing</div><div class="card-body">Sıra sonunu tahmin et; sabit sessizlik bekleme yok (daha hızlı sıra alma).</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Ses + Araç Kullanımı</h2>
<p class="l-text">"İstanbul'da hava nasıl?" → ASR → LLM <code>get_weather(city="Istanbul")</code> fonksiyon çağrısı yayar → API çalışır → sonuç geri beslenir → LLM doğal yanıt üretir → TTS konuşur. Kullanıcı JSON görmez; ajan gerçek iş yaparken sohbet gibi hissettirir.</p>
<div id="audio-l11-graph-tr" style="height:380px;width:100%"></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Cihaz-Üstü vs Bulut</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">whisper.cpp</div><div class="card-body">CPU/telefonda kuantize Whisper. Özel, ücretsiz, yavaş (large model M1'de gerçek zamanın 2-5 katı).</div></div>
<div class="calc-card"><div class="card-title">Bulut (OpenAI Realtime)</div><div class="card-body">En hızlı, çok modlu, ama her kelime cihazdan çıkar. Dakika başına maliyet.</div></div>
<div class="calc-card"><div class="card-title">Hibrit</div><div class="card-body">Cihazda uyandırma kelimesi + niyet, zor sorgular buluta.</div></div>
<div class="calc-card"><div class="card-title">Gizlilik düzenlemeleri</div><div class="card-body">AB AI Yasası, biyometrik ses verisi — mümkünse dalga formu yerine transkript sakla.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Ses LLM'leri sesi sinirsel kodekler (EnCodec, SoundStream) ile ayrık tokenler olarak işler.<br><strong>2.</strong> Ses ajanı = ASR → LLM → TTS zinciri YA DA uçtan uca çok modlu (GPT-4o Realtime).<br><strong>3.</strong> Gecikme bütçesi &lt;500ms — her aşama akışa alınmalı; spekülatif TTS yardım eder.<br><strong>4.</strong> Kesme yönetimi yankı iptali, barge-in VAD ve iptal edilebilir akış TTS gerektirir.<br><strong>5.</strong> Ses + fonksiyon çağırma gerçek asistanları açar; cihaz-üstü gizlilik, bulut hız ve yetenek verir.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024-2026 Manzarası: Gerçek Zamanlı Ses Ajanları</h2>

<p class="l-text"><strong>Zincirlenmiş Whisper -> LLM -> TTS mimarisi, aynı anda konuşan ve dinleyen tam-çift yönlü, uçtan uca ses modelleri tarafından değiştiriliyor.</strong> 2026'da bir ses ajanı yayına alıyorsanız, klasik zincire bağlanmadan önce aşağıdaki dört yığını en azından değerlendirmek kullanıcılarınıza borçlu olduğunuz bir şeydir. Her biri, konuşmanın nihayet insan hızında hissedildiği algısal eşiği aşıyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Moshi (Kyutai, 2024-09)</div><div class="card-body">Gerçek zamanlı tam-çift yönlü ses LLM'i. Model tıpkı bir insan gibi aynı anda konuşur ve dinler -- sıra alma gerekmez. Uçtan uca gecikme 200 ms'nin altında. Açık kaynak (7B), tek bir L4 GPU'da çalışır. "Ses-yerli bir LLM nasıl görünürdü?" sorusuna ilk güvenilir cevap.</div></div>
<div class="calc-card"><div class="card-title">OpenAI Realtime API (2024-10)</div><div class="card-body">500 ms altı gecikme, doğal fonksiyon çağırma, kesme yönetimi ile GPT-4o konuşmadan konuşmaya uç noktası. WebSocket protokolü; ham sesi içeri ve sesi dışarı akıtırsınız. Yüksek kaliteli bulut ses ajanları için üretim varsayılanı.</div></div>
<div class="calc-card"><div class="card-title">Hume EVI 2 (Hume AI, 2024-10)</div><div class="card-body">Empatik Ses Arayüzü. Prozodiyi (perde, tempo, enerji) açıkça modeller, böylece hayal kırıklığı veya heyecanı tespit edebilir ve tonunu uyarlayabilir. Özel kişilikler, çok dilli. Duygusal uyumun önemli olduğu durumlarda doğru seçim (ruh sağlığı, koçluk, müşteri desteği).</div></div>
<div class="calc-card"><div class="card-title">Pipecat (Daily, 2024)</div><div class="card-body">Açık kaynak ses ajanı çerçevesi. Satıcı bağımsız: ASR için Whisper/Deepgram, beyin için GPT-4o/Claude/Llama, TTS için ElevenLabs/Cartesia değiştirin. VAD, kesme, fonksiyon yönlendirmeyi yönetir. Kendi sunucunuzda üretim ajanları için doğru baseline.</div></div>
<div class="calc-card"><div class="card-title">AudioLM 2 / Gemini Live</div><div class="card-body">Google'ın tam-çift yönlü yığını. Gemini Live (tüketici) ve altındaki AudioLM 2 araştırma hattı. GPT-4o Realtime ile karşılaştırılabilir; zaten Google Cloud'daysanız daha sıkı entegrasyon.</div></div>
<div class="calc-card"><div class="card-title">Yine de ne zaman zincirlemeli</div><div class="card-body">Uzmanlaşmış dikey alanlar (ayarlanmış ASR ile tıbbi transkripsiyon, düşük kaynaklı diller, katı şirket-içi) hâlâ açık Whisper -> LLM -> TTS'i tercih ediyor. 200-500 ms feda edersiniz ama her bileşen üzerinde tam kontrol elde edersiniz.</div></div>
</div>

<div class="l-note"><strong>Ses ajanı uygulayıcısı yığını (2025-26):</strong> En hızlı demo için OpenAI Realtime üzerinde prototip yapın. Kontrol için Pipecat üzerinde üretime alın. Alanınız duygusal zekayı ödüllendiriyorsa Hume EVI 2 ekleyin. Moshi'yi yakından izleyin -- gecikme açığını kapatan ilk açık-ağırlık çift yönlü modeli.</div>
</div>

<script>setTimeout(function(){
  var T = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var bg = T ? '#0e1117' : '#ffffff';
  var fg = T ? '#e6e8ee' : '#1c1f26';
  var stages = ['VAD bitişi', 'ASR (akış Whisper)', 'LLM TTFT', 'TTS ilk parça', 'Ağ RTT'];
  var ms = [100, 150, 220, 100, 60];
  var data = [{x:ms, y:stages, type:'bar', orientation:'h', marker:{color:'#c8a96e'}, text:ms.map(function(m){return m+'ms'}), textposition:'outside'}];
  var layout = {paper_bgcolor:bg, plot_bgcolor:bg, font:{color:fg}, margin:{t:40,r:60,b:50,l:200}, xaxis:{title:'Gecikme (ms)'}, title:'Ses Ajanı Gecikme Bütçesi (Toplam ~630ms)'};
  if (document.getElementById('audio-l11-graph-en')) Plotly.newPlot('audio-l11-graph-en', data, layout, {displayModeBar:false});
  if (document.getElementById('audio-l11-graph-tr')) Plotly.newPlot('audio-l11-graph-tr', data, layout, {displayModeBar:false});
}, 250);</script>`
};
