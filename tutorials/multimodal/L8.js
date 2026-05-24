window.MULTIMODAL_L8 = {
en: `<p class="l-text"><strong>Capstone time.</strong> Across L1–L7 we built up the multimodal stack one piece at a time: CLIP-style alignment, LLaVA-style visual chat, Whisper-based audio, Gemini-style video, Donut-style documents, Sora-style generation. None of those individually is a product. A product is what happens when you stitch them into a single application that takes whatever a user throws at it — a screenshot, a voice memo, a PDF, a typed question — figures out which subsystem each input belongs to, runs each through the right model, fuses the outputs, and replies in a way that respects all of the modalities.</p>

<p class="l-text">In this capstone we design and partially build a <strong>Multimodal NLP Assistant</strong>: a unified agent that accepts image + audio + document + text inputs, performs retrieval over a multimodal corpus, generates a grounded structured response, runs a self-evaluation pass, and ships behind a small FastAPI front. We will work through the system architecture, the model selection per modality, the eval harness (covering DocVQA-style accuracy, ASR WER, retrieval R@k, and end-to-end task success), the deployment topology (single-GPU vs API-cascaded), and the cost arithmetic. The Pyodide hands-on assembles a runnable mini version with sklearn, scipy.signal, and numpy that captures the whole pipeline in one file.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Architect a multi-input multimodal assistant with explicit modality routing</li>
<li>Choose the right model per modality given latency, cost, and accuracy targets</li>
<li>Implement retrieval over a multimodal corpus (CLIP for images, BM25/embeddings for text)</li>
<li>Design an evaluation harness that covers all involved modalities and end-to-end task success</li>
<li>Identify failure modes and design guardrails (hallucination, OCR misreads, ASR drift)</li>
<li>Estimate total inference cost and plan a deployment topology (self-hosted vs API)</li>
<li>Build a runnable Pyodide mini-version that captures the architecture pattern</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Product Spec</h2>
<p class="l-text">Before architecture, the spec. Our assistant is a customer-support knowledge agent for a hypothetical SaaS company. Users contact it through a chat widget that accepts: typed questions, screenshot uploads, voice memos, and PDF attachments (e.g., they uploaded their invoice). The corpus is the company's docs (Markdown), past support tickets (text), and a screenshot library of UI states.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Inputs</div><div class="card-body">Text (free-form question), Image (screenshot, photo of receipt, error dialog), Audio (voice memo up to 60s), Document (PDF up to 20 pages). Any combination per turn.</div></div>
<div class="calc-card"><div class="card-title">Outputs</div><div class="card-body">Structured JSON: {"answer": str, "citations": [{"source", "type", "page"/"timestamp"}], "actions": [{"type", "params"}], "confidence": float}. Plus optional voice reply via TTS.</div></div>
<div class="calc-card"><div class="card-title">Latency target</div><div class="card-body">P50 &lt; 3 s for text-only; P50 &lt; 6 s for any modality. Voice replies streamed token-by-token through TTS.</div></div>
<div class="calc-card"><div class="card-title">Quality target</div><div class="card-body">≥80% top-1 task success on a held-out 500-example eval set spanning all modalities. Hallucination rate &lt;3% on doc-grounded queries.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. System Architecture — Routing, Encoders, Retrieval, Synthesis</h2>
<p class="l-text">Five stages, executed left to right per turn:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Modality router</div><div class="card-body">Cheap classifier (or just MIME inspection) labels each attachment. Branches to the right encoder. Text always goes through the LLM as-is.</div></div>
<div class="calc-card"><div class="card-title">2. Per-modality encoders</div><div class="card-body">Image → SigLIP-So400m or LLaVA-Next visual encoder. Audio → Whisper-large-v3-turbo (transcription) + emotion classifier (paralinguistic). Document → Donut or LayoutLMv3 (layout-aware) or fall through to general VLM if heterogeneous.</div></div>
<div class="calc-card"><div class="card-title">3. Multimodal retrieval</div><div class="card-body">Embed the question + each attachment with the right encoder. Run kNN against the corpus index (FAISS/Qdrant/Weaviate). Top-k chunks for grounding.</div></div>
<div class="calc-card"><div class="card-title">4. Synthesis (frontier VLM)</div><div class="card-body">Pass everything — original text, image as visual tokens, ASR transcript, document pages as images, retrieved chunks — to a frontier VLM (Claude 3.5 Sonnet or GPT-4o or Gemini 2.0). Prompt enforces structured-JSON output with citations.</div></div>
<div class="calc-card"><div class="card-title">5. Self-evaluation</div><div class="card-body">Cheap LLM-as-judge pass: "does the answer follow from the cited sources?" If confidence &lt; 0.6 or citations missing, escalate (re-retrieve, ask user, or hand off to human).</div></div>
</div>

<div class="calc-highlight"><strong>Why this layered design?</strong> Each stage can be swapped. Specialist encoders (Whisper, Donut) are far cheaper and often more accurate per modality than passing raw audio/PDF to a frontier VLM. The frontier VLM only handles synthesis — where its reasoning power earns its price. The pattern generalizes far beyond customer support.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Model Selection per Modality</h2>
<p class="l-text">Concrete choices justified by 2026 trade-offs.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Image encoder</div><div class="card-body"><strong>SigLIP-So400m-384</strong> for retrieval (cheap, strong). <strong>LLaVA-Next 13B</strong> or fall-through to <strong>Claude 3.5 Sonnet</strong> for visual reasoning. Resolution 1344px for screenshots.</div></div>
<div class="calc-card"><div class="card-title">ASR</div><div class="card-body"><strong>Whisper large-v3-turbo</strong> (Oct 2024) — 8× faster than v3 with similar quality. Fall back to <strong>Deepgram Nova-2</strong> for streaming. Emotion classifier: small wav2vec2 fine-tune.</div></div>
<div class="calc-card"><div class="card-title">Document</div><div class="card-body">Native PDFs (text layer present) → text extraction + reading-order. Scanned/photo PDFs → <strong>Nougat</strong> for academic, <strong>Donut</strong> or <strong>Claude 3.5 Sonnet</strong> page-by-page for receipts/forms. Tables → <strong>Table Transformer</strong>.</div></div>
<div class="calc-card"><div class="card-title">Synthesis LLM</div><div class="card-body"><strong>Claude 3.5 Sonnet</strong> as default (best instruction-following + vision). <strong>GPT-4o</strong> as alt (faster, slightly cheaper). <strong>Llama-3.3-70B / Qwen2.5-72B</strong> if self-hosting. Routing on confidence: simple text-only Q&amp;A → cheap small model first.</div></div>
<div class="calc-card"><div class="card-title">Retrieval index</div><div class="card-body">Text: BGE-M3 embeddings + BM25 hybrid. Image: SigLIP image embeddings. Cross-modal: SigLIP joint space. Vector DB: Qdrant for self-host, Pinecone or Voyage for managed.</div></div>
<div class="calc-card"><div class="card-title">TTS (optional reply)</div><div class="card-body"><strong>OpenAI TTS-1-HD</strong> or <strong>ElevenLabs Turbo v2.5</strong> for streaming voice reply. Self-host: <strong>XTTS v2</strong>.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Hands-On — A Pyodide Mini-Assistant</h2>
<p class="l-text">A toy version of the whole pipeline running in the browser. We use sklearn (TF-IDF for text, LogReg as the "synthesis head"), scipy.signal (FFT features for audio), numpy (image stats), and regex (document parsing). The corpus is synthetic; the routing logic is the real thing.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> re
<span class="kw">from</span> scipy.fft <span class="kw">import</span> rfft
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

<span class="cm"># ---------- 1. Synthetic corpus ----------</span>
docs = [
    <span class="str">"How do I reset my password? Go to Settings > Security > Reset Password."</span>,
    <span class="str">"Pricing tiers: Free, Pro $19/mo, Team $49/mo, Enterprise custom."</span>,
    <span class="str">"Refund policy: 30-day no-questions-asked refund on any paid plan."</span>,
    <span class="str">"API rate limits: Free 100 req/min, Pro 1000, Team 5000, Enterprise custom."</span>,
    <span class="str">"To export data, navigate to Profile > Data > Export CSV."</span>,
]
vec_text = <span class="fn">TfidfVectorizer</span>().<span class="fn">fit</span>(docs + [<span class="str">"password"</span>,<span class="str">"pricing"</span>,<span class="str">"refund"</span>,<span class="str">"API"</span>,<span class="str">"export"</span>,<span class="str">"total"</span>,<span class="str">"invoice"</span>])
doc_emb  = vec_text.<span class="fn">transform</span>(docs).<span class="fn">toarray</span>()
doc_emb /= np.linalg.<span class="fn">norm</span>(doc_emb, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) + <span class="num">1e-9</span>

<span class="cm"># ---------- 2. Modality encoders ----------</span>
<span class="kw">def</span> <span class="fn">encode_text</span>(q):
    e = vec_text.<span class="fn">transform</span>([q]).<span class="fn">toarray</span>()[<span class="num">0</span>]
    <span class="kw">return</span> e / (np.linalg.<span class="fn">norm</span>(e) + <span class="num">1e-9</span>)

<span class="kw">def</span> <span class="fn">encode_image</span>(im):
    <span class="str">"""Visual stats: mean R/G/B + std + brightness category."""</span>
    <span class="kw">return</span> np.<span class="fn">array</span>([im.<span class="fn">mean</span>(axis=(<span class="num">0</span>,<span class="num">1</span>))[<span class="num">0</span>], im.<span class="fn">mean</span>(axis=(<span class="num">0</span>,<span class="num">1</span>))[<span class="num">1</span>],
                     im.<span class="fn">mean</span>(axis=(<span class="num">0</span>,<span class="num">1</span>))[<span class="num">2</span>], im.<span class="fn">std</span>(),
                     <span class="num">1.0</span> <span class="kw">if</span> im.<span class="fn">mean</span>() > <span class="num">0.5</span> <span class="kw">else</span> <span class="num">0.0</span>])

<span class="kw">def</span> <span class="fn">encode_audio</span>(wav, sr=<span class="num">16000</span>):
    <span class="str">"""FFT-band features stand in for ASR + paralinguistic."""</span>
    spec = np.<span class="fn">abs</span>(<span class="fn">rfft</span>(wav))[:sr // <span class="num">2</span>]
    edges = np.<span class="fn">logspace</span>(<span class="num">0</span>, np.<span class="fn">log10</span>(sr // <span class="num">2</span>), <span class="num">9</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
    <span class="kw">return</span> np.<span class="fn">array</span>([spec[edges[i]:edges[i+<span class="num">1</span>]].<span class="fn">mean</span>() <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>)])

<span class="kw">def</span> <span class="fn">parse_document</span>(text):
    <span class="str">"""Donut-equivalent: regex extraction of typical fields."""</span>
    out = {}
    <span class="kw">for</span> key, pat <span class="kw">in</span> [(<span class="str">"invoice"</span>, r<span class="str">"Invoice\\s+(\\S+)"</span>),
                     (<span class="str">"date"</span>,    r<span class="str">"(\\d{4}-\\d{2}-\\d{2})"</span>),
                     (<span class="str">"total"</span>,   r<span class="str">"Total\\s+\\$?([\\d.]+)"</span>)]:
        m = re.<span class="fn">search</span>(pat, text)
        <span class="kw">if</span> m: out[key] = m.<span class="fn">group</span>(<span class="num">1</span>)
    <span class="kw">return</span> out

<span class="cm"># ---------- 3. Retrieval ----------</span>
<span class="kw">def</span> <span class="fn">retrieve</span>(q, top_k=<span class="num">2</span>):
    q_emb = <span class="fn">encode_text</span>(q)
    sims  = doc_emb @ q_emb
    idx   = np.<span class="fn">argsort</span>(-sims)[:top_k]
    <span class="kw">return</span> [(docs[i], <span class="fn">float</span>(sims[i])) <span class="kw">for</span> i <span class="kw">in</span> idx]

<span class="cm"># ---------- 4. Synthesis (mock LLM via LogReg over template features) ----------</span>
templates = [
    (<span class="str">"password reset"</span>, <span class="str">"To reset your password, go to Settings > Security > Reset Password."</span>),
    (<span class="str">"pricing"</span>,        <span class="str">"We have Free, Pro $19/mo, Team $49/mo, and Enterprise plans."</span>),
    (<span class="str">"refund"</span>,         <span class="str">"We offer a 30-day no-questions-asked refund on paid plans."</span>),
    (<span class="str">"rate limit"</span>,     <span class="str">"API limits: Free 100/min, Pro 1000, Team 5000, Enterprise custom."</span>),
    (<span class="str">"export data"</span>,    <span class="str">"Profile > Data > Export CSV downloads your data."</span>),
]
kw_emb = np.<span class="fn">stack</span>([<span class="fn">encode_text</span>(k) <span class="kw">for</span> k,_ <span class="kw">in</span> templates])
kw_replies = [r <span class="kw">for</span> _,r <span class="kw">in</span> templates]
<span class="kw">def</span> <span class="fn">synthesize</span>(q, retrieved, modality_extras):
    q_emb = <span class="fn">encode_text</span>(q)
    sims  = kw_emb @ q_emb
    best  = <span class="fn">int</span>(np.<span class="fn">argmax</span>(sims))
    answer = kw_replies[best]
    <span class="kw">return</span> {
        <span class="str">"answer"</span>: answer,
        <span class="str">"citations"</span>: [{<span class="str">"source"</span>: d, <span class="str">"score"</span>: s} <span class="kw">for</span> d, s <span class="kw">in</span> retrieved],
        <span class="str">"modality_extras"</span>: modality_extras,
        <span class="str">"confidence"</span>: <span class="fn">float</span>(sims[best]),
    }

<span class="cm"># ---------- 5. Pipeline ----------</span>
<span class="kw">def</span> <span class="fn">assistant</span>(text=<span class="kw">None</span>, image=<span class="kw">None</span>, audio=<span class="kw">None</span>, document=<span class="kw">None</span>):
    extras = {}
    <span class="kw">if</span> image <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:    extras[<span class="str">"image_feat"</span>]  = <span class="fn">encode_image</span>(image).<span class="fn">tolist</span>()
    <span class="kw">if</span> audio <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:    extras[<span class="str">"audio_feat"</span>]  = <span class="fn">encode_audio</span>(audio).<span class="fn">tolist</span>()
    <span class="kw">if</span> document <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>: extras[<span class="str">"doc_fields"</span>]  = <span class="fn">parse_document</span>(document)
    q = text <span class="kw">or</span> <span class="str">""</span>
    <span class="kw">if</span> document <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span> <span class="kw">and</span> <span class="str">"doc_fields"</span> <span class="kw">in</span> extras:
        <span class="cm"># Augment query with doc fields so retrieval can use them</span>
        q = q + <span class="str">" "</span> + <span class="str">" "</span>.<span class="fn">join</span>(<span class="fn">str</span>(v) <span class="kw">for</span> v <span class="kw">in</span> extras[<span class="str">"doc_fields"</span>].<span class="fn">values</span>())
    retrieved = <span class="fn">retrieve</span>(q) <span class="kw">if</span> q.<span class="fn">strip</span>() <span class="kw">else</span> []
    <span class="kw">return</span> <span class="fn">synthesize</span>(q, retrieved, extras)

<span class="cm"># ---------- 6. Demo turns ----------</span>
<span class="fn">print</span>(<span class="str">"--- Turn 1: text only ---"</span>)
r = <span class="fn">assistant</span>(text=<span class="str">"How do I reset my password?"</span>)
<span class="fn">print</span>(r[<span class="str">"answer"</span>], <span class="str">"| conf="</span>, <span class="fn">round</span>(r[<span class="str">"confidence"</span>], <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Citations:"</span>, [c[<span class="str">"source"</span>][:<span class="num">40</span>] + <span class="str">"..."</span> <span class="kw">for</span> c <span class="kw">in</span> r[<span class="str">"citations"</span>]])

<span class="fn">print</span>(<span class="str">"\\n--- Turn 2: text + audio + image ---"</span>)
r = <span class="fn">assistant</span>(text=<span class="str">"What is the pricing?"</span>, image=img, audio=audio)
<span class="fn">print</span>(r[<span class="str">"answer"</span>], <span class="str">"| conf="</span>, <span class="fn">round</span>(r[<span class="str">"confidence"</span>], <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Image feat:"</span>, [<span class="fn">round</span>(v, <span class="num">3</span>) <span class="kw">for</span> v <span class="kw">in</span> r[<span class="str">"modality_extras"</span>][<span class="str">"image_feat"</span>]])

<span class="fn">print</span>(<span class="str">"\\n--- Turn 3: document upload ---"</span>)
fake_doc = <span class="str">"Invoice INV-7421 Date 2026-05-04 ... Total $132.50"</span>
r = <span class="fn">assistant</span>(text=<span class="str">"Can I get a refund on this?"</span>, document=fake_doc)
<span class="fn">print</span>(r[<span class="str">"answer"</span>])
<span class="fn">print</span>(<span class="str">"Doc fields:"</span>, r[<span class="str">"modality_extras"</span>][<span class="str">"doc_fields"</span>])
</code></pre></div>

<p class="l-text">Three things this Pyodide demo gets right structurally: (1) every modality has its own encoder and they all return numeric features; (2) retrieval is one cosine-similarity step over a unified text vocab; (3) synthesis sees both the original query and the modality-extracted fields. Replace each toy encoder with the real one (SigLIP, Whisper, Donut) and the LogReg synthesis with Claude 3.5 Sonnet, and you have the production system.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Production Inference Sketch</h2>
<p class="l-text">What the same pipeline looks like with real APIs. Pyodide cannot run this; it is the deployment target for the demo above.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — production)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Real production assistant — Pyodide-blocked</span>
<span class="kw">import</span> anthropic, openai, base64, io
<span class="kw">from</span> PIL <span class="kw">import</span> Image
<span class="kw">import</span> whisper

client_anthropic = anthropic.<span class="fn">Anthropic</span>()
client_openai    = openai.<span class="fn">OpenAI</span>()
asr = whisper.<span class="fn">load_model</span>(<span class="str">"large-v3-turbo"</span>)

<span class="kw">def</span> <span class="fn">encode_image_b64</span>(im: Image.Image) -&gt; <span class="fn">str</span>:
    buf = io.<span class="fn">BytesIO</span>()
    im.<span class="fn">save</span>(buf, format=<span class="str">"PNG"</span>)
    <span class="kw">return</span> base64.<span class="fn">b64encode</span>(buf.<span class="fn">getvalue</span>()).<span class="fn">decode</span>()

<span class="kw">def</span> <span class="fn">transcribe</span>(audio_path):
    r = asr.<span class="fn">transcribe</span>(audio_path)
    <span class="kw">return</span> r[<span class="str">"text"</span>], r.<span class="fn">get</span>(<span class="str">"language"</span>, <span class="str">"en"</span>)

<span class="kw">def</span> <span class="fn">retrieve</span>(query, top_k=<span class="num">5</span>):
    <span class="str">"""BGE-M3 + Qdrant; pseudocode."""</span>
    q_emb = <span class="fn">embed_bge</span>(query)
    <span class="kw">return</span> qdrant.<span class="fn">search</span>(<span class="str">"docs"</span>, q_emb, top_k=top_k)

<span class="kw">def</span> <span class="fn">assistant</span>(text=<span class="kw">None</span>, image=<span class="kw">None</span>, audio_path=<span class="kw">None</span>, doc_pages=<span class="kw">None</span>):
    parts = []
    <span class="kw">if</span> text: parts.<span class="fn">append</span>({<span class="str">"type"</span>: <span class="str">"text"</span>, <span class="str">"text"</span>: text})

    <span class="kw">if</span> audio_path:
        transcript, lang = <span class="fn">transcribe</span>(audio_path)
        parts.<span class="fn">append</span>({<span class="str">"type"</span>: <span class="str">"text"</span>, <span class="str">"text"</span>: f<span class="str">"[Audio transcript ({lang})] {transcript}"</span>})

    <span class="kw">if</span> image <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
        parts.<span class="fn">append</span>({<span class="str">"type"</span>: <span class="str">"image"</span>, <span class="str">"source"</span>: {
            <span class="str">"type"</span>: <span class="str">"base64"</span>, <span class="str">"media_type"</span>: <span class="str">"image/png"</span>,
            <span class="str">"data"</span>: <span class="fn">encode_image_b64</span>(image)
        }})

    <span class="kw">if</span> doc_pages:
        <span class="kw">for</span> i, page_im <span class="kw">in</span> <span class="fn">enumerate</span>(doc_pages):
            parts.<span class="fn">append</span>({<span class="str">"type"</span>: <span class="str">"text"</span>, <span class="str">"text"</span>: f<span class="str">"[Page {i+1}]"</span>})
            parts.<span class="fn">append</span>({<span class="str">"type"</span>: <span class="str">"image"</span>, <span class="str">"source"</span>: {
                <span class="str">"type"</span>: <span class="str">"base64"</span>, <span class="str">"media_type"</span>: <span class="str">"image/png"</span>,
                <span class="str">"data"</span>: <span class="fn">encode_image_b64</span>(page_im)
            }})

    <span class="cm"># Retrieve grounding chunks</span>
    retrieved = <span class="fn">retrieve</span>(text <span class="kw">or</span> <span class="str">""</span> )
    parts.<span class="fn">append</span>({<span class="str">"type"</span>: <span class="str">"text"</span>, <span class="str">"text"</span>: <span class="str">"Relevant context:\\n"</span>
                  + <span class="str">"\\n"</span>.<span class="fn">join</span>(r[<span class="str">"text"</span>] <span class="kw">for</span> r <span class="kw">in</span> retrieved)})

    msg = client_anthropic.messages.<span class="fn">create</span>(
        model=<span class="str">"claude-3-5-sonnet-20241022"</span>,
        max_tokens=<span class="num">1024</span>,
        system=(<span class="str">"You are a customer-support assistant. Answer with strict JSON: "</span>
                <span class="str">"{answer, citations:[...], confidence:0..1}. Cite only from "</span>
                <span class="str">"retrieved context or visible image content."</span>),
        messages=[{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: parts}],
    )
    <span class="kw">return</span> msg.content[<span class="num">0</span>].text  <span class="cm"># JSON string</span>
</code></pre></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Evaluation Harness</h2>
<p class="l-text">A multimodal product cannot be evaluated by one metric. The harness must cover each subsystem and the end-to-end task. Build a 500-example eval set with examples in every modality combination.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Per-modality unit tests</div><div class="card-body"><strong>ASR:</strong> WER on a 50-sample voice memo set. Target ≤6%. <strong>OCR/document:</strong> field-level F1 on extracted (key, value) pairs. <strong>Image grounding:</strong> retrieval R@5 on 50 (screenshot, doc-page) pairs.</div></div>
<div class="calc-card"><div class="card-title">End-to-end task success</div><div class="card-body">Human-graded or LLM-as-judge on a 500-example test set. Pass = answer is correct AND citations are valid AND no hallucinations. Target ≥80%.</div></div>
<div class="calc-card"><div class="card-title">Hallucination probe</div><div class="card-body">Adversarial 50 examples: doc says X, question asks about Y. Pass = "I don't know / not in the document". Target ≥95% (3% miss rate spec).</div></div>
<div class="calc-card"><div class="card-title">Latency / cost</div><div class="card-body">P50 / P95 latency per modality combination. Cost in cents per turn. Trace per call: which encoder ran, how many input tokens to the LLM.</div></div>
<div class="calc-card"><div class="card-title">Continuous eval (production)</div><div class="card-body">Sample 1% of live traffic, log full traces, weekly review with on-call ML eng. Tools: Langfuse, Braintrust, Weights &amp; Biases Weave.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Deployment Topology and Cost Arithmetic</h2>
<p class="l-text">Two extreme topologies bracket reality. Most products land in the middle.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pure API cascade</div><div class="card-body">Whisper API + OpenAI/Anthropic VLM + ElevenLabs TTS. Zero infra. Cost per turn (text + 1 image, ~5K tokens output): ~$0.03–0.10. P50 ~3–5s. Easiest to ship.</div></div>
<div class="calc-card"><div class="card-title">Self-host everything</div><div class="card-body">A100 80GB × 1–2: Whisper-Turbo + Llama-3.3-70B / Qwen2.5-72B + XTTS. 1–2 machines, ~$3K/mo. Break-even vs API at ~50K turns/mo. Pro: data residency, predictable cost. Con: ops overhead.</div></div>
<div class="calc-card"><div class="card-title">Hybrid (the 2026 default)</div><div class="card-body">Self-host the cheap-and-frequent (ASR, image embedding, retrieval) on small GPUs. API for the synthesis LLM. Best cost/latency profile. ~$0.005–0.02 per turn. P50 ~2s.</div></div>
<div class="calc-card"><div class="card-title">Edge / on-device</div><div class="card-body">For privacy-critical (medical, government). Small Whisper + 7B-quantized LLM + tiny VLM (PaliGemma 3B) on a laptop or M-series Mac. Lower quality, zero-trust deployment.</div></div>
</div>

<div class="calc-highlight"><strong>Cost arithmetic for the hybrid:</strong> 1M turns/month × $0.01/turn = $10K/month at scale. Self-hosting Whisper saves ~$2K of that. Self-hosting retrieval (Qdrant on a small VM) saves another ~$500. The synthesis VLM API is the dominant line item; this is where prompt engineering, caching (Anthropic prompt caching), and routing simple turns to a cheap model pays off most.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Failure Modes and Guardrails</h2>
<p class="l-text">Every multimodal product fails in characteristic ways. Knowing them lets you build guardrails before they bite.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ASR misreads</div><div class="card-body">"Reset my password" heard as "Reset my passwords" — minor. "Cancel my subscription" heard as "Can I sell my subscription" — major. Guardrail: confidence threshold on Whisper; if &lt;0.7, ask user to confirm intent.</div></div>
<div class="calc-card"><div class="card-title">OCR fragility</div><div class="card-body">Poorly-lit phone photos of receipts → 30% missing fields. Guardrail: pre-screen image quality (blur detection), prompt user to retake if too low.</div></div>
<div class="calc-card"><div class="card-title">VLM hallucination on charts</div><div class="card-body">"What does the y-axis show?" — model invents plausible-sounding labels. Guardrail: structured-output schema requiring it to quote the exact text it sees, or say "axis label not visible".</div></div>
<div class="calc-card"><div class="card-title">Cross-modal contradiction</div><div class="card-body">User types "I want to upgrade" but voice memo says "actually never mind." Guardrail: explicit cross-modal-conflict resolution prompt step.</div></div>
<div class="calc-card"><div class="card-title">Privacy leakage</div><div class="card-body">Document contains other users' data. Guardrail: PII detection pass before sending to API; on detection, route to a self-hosted model only.</div></div>
<div class="calc-card"><div class="card-title">Cost runaway</div><div class="card-body">A single user uploads a 200-page PDF. Guardrail: per-turn token budget (e.g., 50K input cap), summarize-first pipeline for long docs, hard cost ceiling per user.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Extension — Adding Generation</h2>
<p class="l-text">Our assistant so far only consumes multimodal input. Adding generation flips the system into a creative tool: respond with a generated image (charts), a synthesized voice reply, or a video walkthrough.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Voice reply (TTS)</div><div class="card-body">Stream the answer through ElevenLabs Turbo or OpenAI TTS as it is generated. ~250 ms time-to-first-audio. The default for voice-first interfaces.</div></div>
<div class="calc-card"><div class="card-title">Generated charts</div><div class="card-body">If the answer involves data, the LLM emits a Plotly/Vega-Lite spec → server renders → returns PNG. Or call a code-execution tool to run matplotlib. Far better than a generated diffusion image for charts.</div></div>
<div class="calc-card"><div class="card-title">Generated diagrams</div><div class="card-body">Mermaid/Excalidraw text DSLs are LLM-friendly. Render server-side. Use diffusion (DALL-E 3, FLUX) only for genuinely creative outputs (illustrations).</div></div>
<div class="calc-card"><div class="card-title">Walkthrough video</div><div class="card-body">For tutorial answers: stitch a generated voiceover with a screen recording or generated short video (Veo / Sora). High cost; for premium tiers only.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Roadmap — Where to Take This Next</h2>
<p class="l-text">Six concrete extensions you can build on top of the capstone, in increasing ambition order.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Streaming voice mode</div><div class="card-body">Add WebRTC + Whisper streaming + sentence-level LLM streaming + ElevenLabs streaming TTS. Get full-duplex voice conversation. Tools: pipecat, livekit-agents, Vapi.</div></div>
<div class="calc-card"><div class="card-title">2. Per-user memory layer</div><div class="card-body">Store past turns in a vector DB keyed by user_id. Inject relevant prior context. Mem0, Letta (formerly MemGPT), or roll your own.</div></div>
<div class="calc-card"><div class="card-title">3. Tool use / agent extension</div><div class="card-body">Let the assistant call APIs (cancel subscription, generate refund, file ticket). Anthropic tool use or MCP servers. See agents-L3 for the recipe.</div></div>
<div class="calc-card"><div class="card-title">4. Fine-tune on your domain</div><div class="card-body">Once you have logs, fine-tune the synthesis LLM on (input, ideal-output) pairs. DPO works well for assistant tuning; QLoRA fits on a single A100.</div></div>
<div class="calc-card"><div class="card-title">5. Self-improving via feedback</div><div class="card-body">Thumbs-up/down on each reply → DPO dataset → weekly fine-tune. The classic RLHF feedback loop, scaled to one product.</div></div>
<div class="calc-card"><div class="card-title">6. Specialized vertical model</div><div class="card-body">If your domain is medical / legal / financial, distill all of this into a specialized 8B–13B model that runs on-prem. Frontier for the model, training data from logs of the API system.</div></div>
</div>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Frontier Models — Capstone Model Picks</h2>
<p class="l-text"><strong>The multimodal landscape exploded in 2024.</strong> When you wire a capstone like this one in 2026, you are no longer picking between GPT-4V and LLaVA-1.5 — you have six credible frontier choices and two of them are open-weight. The card grid below maps each model to the role it plays best in a production multimodal assistant: synthesis brain, screenshot-driver, native streamer, or fine-tunable workhorse.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">GPT-4o (OpenAI, May 2024)</div><div class="card-body">Native multimodal text + vision + audio, 50% cheaper than GPT-4 Turbo, end-to-end audio path. Default synthesis brain when latency and cost matter equally.</div></div>
<div class="calc-card"><div class="card-title">Claude 3.5 / 3.7 Sonnet (Anthropic, Jun 2024 / Feb 2025)</div><div class="card-body">Vision + extended thinking + <em>computer use</em>. Best pick when the capstone needs to drive a browser, debug a screenshot, or reason over long PDFs with a visible scratchpad.</div></div>
<div class="calc-card"><div class="card-title">Gemini 2.0 Flash (Google, Dec 2024)</div><div class="card-body">Native multimodal <em>output</em> (text + image + audio interleaved), 1M+ token context, streaming Live API. The pick for real-time voice/video assistants.</div></div>
<div class="calc-card"><div class="card-title">Llama 3.2 Vision 11B / 90B (Meta, Sep 2024)</div><div class="card-body">Open-weight VLM, fine-tunable. 11B runs on one A100; 90B rivals GPT-4V on charts. Use when data must stay on-prem or you want a custom domain adapter.</div></div>
<div class="calc-card"><div class="card-title">Qwen2-VL 72B (Alibaba, Aug 2024)</div><div class="card-body">Native dynamic resolution, 20-min video, SOTA open-source on MMMU/DocVQA. The open synthesis brain for document-heavy or video-heavy capstones.</div></div>
<div class="calc-card"><div class="card-title">InternVL 2.5 (OpenGVLab, Dec 2024)</div><div class="card-body">78B open VLM, ~70% MMMU. When you want frontier-class quality without OpenAI/Anthropic lock-in and you have the GPUs to host it.</div></div>
</div>
<div class="calc-highlight"><strong>Capstone routing rule:</strong> for synthesis use GPT-4o or Claude 3.5 Sonnet as the default closed brain; swap to Qwen2-VL 72B or Llama 3.2 90B when self-hosted. For UI-driving tasks (browser, desktop) Claude 3.7 + computer use is currently the only viable pick. For real-time streaming voice/video, Gemini 2.0 Flash Live is the lowest-latency option.</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Recap — The Multimodal Stack End-to-End</h2>
<p class="l-text">A multimodal NLP assistant is not one model — it is a system. The architecture pattern that wins in 2026: cheap specialist encoders (Whisper, SigLIP, Donut) for each modality, a unified retrieval index over multimodal embeddings, a frontier VLM (Claude 3.5 Sonnet, GPT-4o, Gemini 2.0) for synthesis, and a cheap self-evaluation pass to catch mistakes. Each layer can be swapped, scaled, or self-hosted independently.</p>

<div class="calc-highlight"><strong>What you built across the track:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li><strong>L1:</strong> Multimodal taxonomy and the three fusion strategies (early, late, cross-attention).</li>
<li><strong>L2:</strong> CLIP — dual-encoder, contrastive InfoNCE, zero-shot transfer; descendants OpenCLIP, EVA-CLIP, SigLIP.</li>
<li><strong>L3:</strong> Vision-Language Models — LLaVA's recipe, BLIP-2's Q-Former, AnyRes, Qwen2-VL.</li>
<li><strong>L4:</strong> Audio LLMs — Whisper, SeamlessM4T, Qwen-Audio, GPT-4o-Audio, codec tokens.</li>
<li><strong>L5:</strong> Video — spacetime patches, VideoMAE, Video-ChatGPT, Gemini 1.5 long context.</li>
<li><strong>L6:</strong> Document AI — LayoutLMv3, Donut, Pix2Struct, the 2024 generalist-VLM disruption.</li>
<li><strong>L7:</strong> Generation — diffusion / flow matching / codec-AR; DALL-E 3, Sora, MusicGen, VALL-E 2.</li>
<li><strong>L8:</strong> The capstone — routing, retrieval, synthesis, evaluation, deployment.</li>
</ul>
</div>

<p class="l-text">Multimodal is now the default modality for any frontier model; "text-only" is becoming the niche case. The next frontier is full sensorimotor — robotics, real-time agents controlling the physical world, embodied AI. The track of choice for that next leap is RL (RLHF, world models) combined with everything in this track. Good luck.</p>
</div>`,
tr: `<p class="l-text"><strong>Capstone zamanı.</strong> L1–L7 boyunca multimodal yığını parça parça inşa ettik: CLIP-tarzı hizalama, LLaVA-tarzı görsel sohbet, Whisper-tabanlı ses, Gemini-tarzı video, Donut-tarzı belgeler, Sora-tarzı üretim. Bunların hiçbiri tek başına bir ürün değil. Bir ürün, bunları kullanıcının attığı her şeyi alan tek bir uygulamaya dikiş attığınızda olan şeydir — bir ekran görüntüsü, bir sesli not, bir PDF, yazılı bir soru — her girdinin hangi alt sisteme ait olduğunu belirler, her birini doğru modelden çalıştırır, çıktıları kaynaştırır ve tüm modaliteleri saygı gösterecek şekilde yanıt verir.</p>

<p class="l-text">Bu capstone'da bir <strong>Multimodal NLP Asistanı</strong> tasarlıyor ve kısmen inşa ediyoruz: görüntü + ses + belge + metin girdilerini kabul eden, multimodal bir derlem üzerinde erişim yapan, yerleştirilmiş yapılandırılmış bir yanıt üreten, bir öz-değerlendirme geçişi çalıştıran ve küçük bir FastAPI önyüzü arkasında sevkiyat yapan birleşik bir ajan. Sistem mimarisini, modalite başına model seçimini, değerlendirme koşumunu (DocVQA-tarzı doğruluk, ASR WER, erişim R@k ve uçtan uca görev başarısını kapsayan), dağıtım topolojisini (tek-GPU vs API-cascade) ve maliyet aritmetiğini işliyoruz. Pyodide uygulaması, tüm hattı tek bir dosyada yakalayan sklearn, scipy.signal ve numpy ile çalıştırılabilir bir mini sürüm monte eder.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Açık modalite yönlendirmesi olan çoklu-girdi multimodal asistanı mimarileştirmek</li>
<li>Gecikme, maliyet ve doğruluk hedefleri verildiğinde modalite başına doğru modeli seçmek</li>
<li>Multimodal bir derlem üzerinde erişimi uygulamak (görüntüler için CLIP, metin için BM25/gömmeler)</li>
<li>Tüm ilgili modaliteleri ve uçtan uca görev başarısını kapsayan bir değerlendirme koşumu tasarlamak</li>
<li>Arıza modlarını tanımak ve koruyucular tasarlamak (halüsinasyon, OCR yanlış-okumaları, ASR sapması)</li>
<li>Toplam çıkarım maliyetini tahmin etmek ve bir dağıtım topolojisi planlamak (kendi-barındırma vs API)</li>
<li>Mimari deseni yakalayan çalıştırılabilir bir Pyodide mini sürümü inşa etmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Ürün Şartnamesi</h2>
<p class="l-text">Mimariden önce şartname. Asistanımız varsayımsal bir SaaS şirketi için bir müşteri-destek bilgi ajanıdır. Kullanıcılar onunla şu girdileri kabul eden bir sohbet widget'i aracılığıyla iletişim kurar: yazılı sorular, ekran görüntüsü yüklemeleri, sesli notlar ve PDF ekleri (örn. faturalarını yüklediler). Derlem şirketin belgeleri (Markdown), geçmiş destek biletleri (metin) ve UI durumlarının ekran görüntüsü kütüphanesidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Girdiler</div><div class="card-body">Metin (serbest-form soru), Görüntü (ekran görüntüsü, makbuz fotoğrafı, hata diyalog kutusu), Ses (60s'e kadar sesli not), Belge (20 sayfaya kadar PDF). Sıra başına herhangi bir kombinasyon.</div></div>
<div class="calc-card"><div class="card-title">Çıktılar</div><div class="card-body">Yapılandırılmış JSON: {"answer": str, "citations": [{"source", "type", "page"/"timestamp"}], "actions": [{"type", "params"}], "confidence": float}. Artı TTS aracılığıyla isteğe bağlı sesli yanıt.</div></div>
<div class="calc-card"><div class="card-title">Gecikme hedefi</div><div class="card-body">Yalnız metin için P50 &lt; 3 s; herhangi bir modalite için P50 &lt; 6 s. Sesli yanıtlar TTS aracılığıyla token-token akış.</div></div>
<div class="calc-card"><div class="card-title">Kalite hedefi</div><div class="card-body">Tüm modaliteleri kapsayan bekletilmiş 500 örneklik değerlendirme setinde ≥%80 top-1 görev başarısı. Belge-yerleştirilmiş sorgular üzerinde halüsinasyon oranı &lt;%3.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Sistem Mimarisi — Yönlendirme, Kodlayıcılar, Erişim, Sentez</h2>
<p class="l-text">Beş aşama, sıra başına soldan sağa yürütülür:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Modalite yönlendirici</div><div class="card-body">Ucuz sınıflandırıcı (veya yalnızca MIME denetimi) her eki etiketler. Doğru kodlayıcıya dallanır. Metin her zaman olduğu gibi LLM'den geçer.</div></div>
<div class="calc-card"><div class="card-title">2. Modalite başına kodlayıcılar</div><div class="card-body">Görüntü → SigLIP-So400m veya LLaVA-Next görsel kodlayıcısı. Ses → Whisper-large-v3-turbo (transkripsiyon) + duygu sınıflandırıcısı (paralinguistik). Belge → Donut veya LayoutLMv3 (düzen-farkındalıklı) veya heterojen ise genel VLM'ye düş.</div></div>
<div class="calc-card"><div class="card-title">3. Multimodal erişim</div><div class="card-body">Soruyu + her eki doğru kodlayıcıyla göm. Derlem indeksine karşı kNN çalıştır (FAISS/Qdrant/Weaviate). Yerleştirme için top-k parça.</div></div>
<div class="calc-card"><div class="card-title">4. Sentez (öncü VLM)</div><div class="card-body">Her şeyi — orijinal metin, görsel token olarak görüntü, ASR transkripti, görüntü olarak belge sayfaları, alınan parçalar — bir öncü VLM'ye geç (Claude 3.5 Sonnet veya GPT-4o veya Gemini 2.0). Prompt, alıntılarla yapılandırılmış-JSON çıktısını zorunlu kılar.</div></div>
<div class="calc-card"><div class="card-title">5. Öz-değerlendirme</div><div class="card-body">Ucuz LLM-yargıç-olarak geçişi: "cevap alıntılanan kaynaklardan çıkıyor mu?" Güven &lt; 0.6 veya alıntılar eksikse, eskale et (yeniden-eriş, kullanıcıya sor veya insana devret).</div></div>
</div>

<div class="calc-highlight"><strong>Bu katmanlı tasarım neden?</strong> Her aşama değiştirilebilir. Uzman kodlayıcılar (Whisper, Donut) bir öncü VLM'ye ham ses/PDF geçirmekten modalite başına çok daha ucuz ve genellikle daha doğrudur. Öncü VLM yalnızca sentezi ele alır — akıl yürütme gücünün fiyatını kazandığı yer. Desen müşteri desteğinin çok ötesine genelleşir.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Modalite Başına Model Seçimi</h2>
<p class="l-text">2026 dengeleriyle haklı çıkan somut seçimler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Görüntü kodlayıcı</div><div class="card-body">Erişim için <strong>SigLIP-So400m-384</strong> (ucuz, güçlü). Görsel akıl yürütme için <strong>LLaVA-Next 13B</strong> veya <strong>Claude 3.5 Sonnet</strong>'a düş. Ekran görüntüleri için 1344px çözünürlük.</div></div>
<div class="calc-card"><div class="card-title">ASR</div><div class="card-body"><strong>Whisper large-v3-turbo</strong> (Eki 2024) — benzer kaliteyle v3'ten 8× daha hızlı. Akış için <strong>Deepgram Nova-2</strong>'ye geri dön. Duygu sınıflandırıcısı: küçük wav2vec2 ince ayarı.</div></div>
<div class="calc-card"><div class="card-title">Belge</div><div class="card-body">Yerel PDF'ler (metin katmanı mevcut) → metin çıkarımı + okuma sırası. Taranmış/fotoğraflı PDF'ler → akademik için <strong>Nougat</strong>, makbuz/form için sayfa-sayfa <strong>Donut</strong> veya <strong>Claude 3.5 Sonnet</strong>. Tablolar → <strong>Table Transformer</strong>.</div></div>
<div class="calc-card"><div class="card-title">Sentez LLM</div><div class="card-body">Varsayılan olarak <strong>Claude 3.5 Sonnet</strong> (en iyi talimat-takibi + görü). Alternatif olarak <strong>GPT-4o</strong> (daha hızlı, biraz daha ucuz). Kendi-barındırma yapılırsa <strong>Llama-3.3-70B / Qwen2.5-72B</strong>. Güvene göre yönlendirme: basit yalnız-metin Q&amp;A → önce ucuz küçük model.</div></div>
<div class="calc-card"><div class="card-title">Erişim indeksi</div><div class="card-body">Metin: BGE-M3 gömmeleri + BM25 hibrit. Görüntü: SigLIP görüntü gömmeleri. Çapraz-modal: SigLIP ortak uzayı. Vektör DB: kendi-barındırma için Qdrant, yönetilen için Pinecone veya Voyage.</div></div>
<div class="calc-card"><div class="card-title">TTS (isteğe bağlı yanıt)</div><div class="card-body">Akış sesli yanıt için <strong>OpenAI TTS-1-HD</strong> veya <strong>ElevenLabs Turbo v2.5</strong>. Kendi-barındırma: <strong>XTTS v2</strong>.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Uygulama — Bir Pyodide Mini-Asistanı</h2>
<p class="l-text">Tüm hattın tarayıcıda çalışan oyuncak bir versiyonu. sklearn (metin için TF-IDF, "sentez başlığı" olarak LogReg), scipy.signal (ses için FFT öznitelikleri), numpy (görüntü istatistikleri) ve regex (belge ayrıştırma) kullanıyoruz. Derlem sentetik; yönlendirme mantığı gerçek.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> re
<span class="kw">from</span> scipy.fft <span class="kw">import</span> rfft
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

<span class="cm"># ---------- 1. Sentetik derlem ----------</span>
docs = [
    <span class="str">"How do I reset my password? Go to Settings > Security > Reset Password."</span>,
    <span class="str">"Pricing tiers: Free, Pro $19/mo, Team $49/mo, Enterprise custom."</span>,
    <span class="str">"Refund policy: 30-day no-questions-asked refund on any paid plan."</span>,
    <span class="str">"API rate limits: Free 100 req/min, Pro 1000, Team 5000, Enterprise custom."</span>,
    <span class="str">"To export data, navigate to Profile > Data > Export CSV."</span>,
]
vec_text = <span class="fn">TfidfVectorizer</span>().<span class="fn">fit</span>(docs + [<span class="str">"password"</span>,<span class="str">"pricing"</span>,<span class="str">"refund"</span>,<span class="str">"API"</span>,<span class="str">"export"</span>,<span class="str">"total"</span>,<span class="str">"invoice"</span>])
doc_emb  = vec_text.<span class="fn">transform</span>(docs).<span class="fn">toarray</span>()
doc_emb /= np.linalg.<span class="fn">norm</span>(doc_emb, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) + <span class="num">1e-9</span>

<span class="cm"># ---------- 2. Modalite kodlayıcıları ----------</span>
<span class="kw">def</span> <span class="fn">encode_text</span>(q):
    e = vec_text.<span class="fn">transform</span>([q]).<span class="fn">toarray</span>()[<span class="num">0</span>]
    <span class="kw">return</span> e / (np.linalg.<span class="fn">norm</span>(e) + <span class="num">1e-9</span>)

<span class="kw">def</span> <span class="fn">encode_image</span>(im):
    <span class="str">"""Görsel istatistikler: ortalama R/G/B + std + parlaklık kategorisi."""</span>
    <span class="kw">return</span> np.<span class="fn">array</span>([im.<span class="fn">mean</span>(axis=(<span class="num">0</span>,<span class="num">1</span>))[<span class="num">0</span>], im.<span class="fn">mean</span>(axis=(<span class="num">0</span>,<span class="num">1</span>))[<span class="num">1</span>],
                     im.<span class="fn">mean</span>(axis=(<span class="num">0</span>,<span class="num">1</span>))[<span class="num">2</span>], im.<span class="fn">std</span>(),
                     <span class="num">1.0</span> <span class="kw">if</span> im.<span class="fn">mean</span>() > <span class="num">0.5</span> <span class="kw">else</span> <span class="num">0.0</span>])

<span class="kw">def</span> <span class="fn">encode_audio</span>(wav, sr=<span class="num">16000</span>):
    <span class="str">"""ASR + paralinguistik yerine FFT-bant öznitelikleri."""</span>
    spec = np.<span class="fn">abs</span>(<span class="fn">rfft</span>(wav))[:sr // <span class="num">2</span>]
    edges = np.<span class="fn">logspace</span>(<span class="num">0</span>, np.<span class="fn">log10</span>(sr // <span class="num">2</span>), <span class="num">9</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
    <span class="kw">return</span> np.<span class="fn">array</span>([spec[edges[i]:edges[i+<span class="num">1</span>]].<span class="fn">mean</span>() <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>)])

<span class="kw">def</span> <span class="fn">parse_document</span>(text):
    <span class="str">"""Donut-eşdeğeri: tipik alanların regex çıkarımı."""</span>
    out = {}
    <span class="kw">for</span> key, pat <span class="kw">in</span> [(<span class="str">"invoice"</span>, r<span class="str">"Invoice\\s+(\\S+)"</span>),
                     (<span class="str">"date"</span>,    r<span class="str">"(\\d{4}-\\d{2}-\\d{2})"</span>),
                     (<span class="str">"total"</span>,   r<span class="str">"Total\\s+\\$?([\\d.]+)"</span>)]:
        m = re.<span class="fn">search</span>(pat, text)
        <span class="kw">if</span> m: out[key] = m.<span class="fn">group</span>(<span class="num">1</span>)
    <span class="kw">return</span> out

<span class="cm"># ---------- 3. Erişim ----------</span>
<span class="kw">def</span> <span class="fn">retrieve</span>(q, top_k=<span class="num">2</span>):
    q_emb = <span class="fn">encode_text</span>(q)
    sims  = doc_emb @ q_emb
    idx   = np.<span class="fn">argsort</span>(-sims)[:top_k]
    <span class="kw">return</span> [(docs[i], <span class="fn">float</span>(sims[i])) <span class="kw">for</span> i <span class="kw">in</span> idx]

<span class="cm"># ---------- 4. Sentez (şablon öznitelikleri üzerinde LogReg aracılığıyla mock LLM) ----------</span>
templates = [
    (<span class="str">"password reset"</span>, <span class="str">"To reset your password, go to Settings > Security > Reset Password."</span>),
    (<span class="str">"pricing"</span>,        <span class="str">"We have Free, Pro $19/mo, Team $49/mo, and Enterprise plans."</span>),
    (<span class="str">"refund"</span>,         <span class="str">"We offer a 30-day no-questions-asked refund on paid plans."</span>),
    (<span class="str">"rate limit"</span>,     <span class="str">"API limits: Free 100/min, Pro 1000, Team 5000, Enterprise custom."</span>),
    (<span class="str">"export data"</span>,    <span class="str">"Profile > Data > Export CSV downloads your data."</span>),
]
kw_emb = np.<span class="fn">stack</span>([<span class="fn">encode_text</span>(k) <span class="kw">for</span> k,_ <span class="kw">in</span> templates])
kw_replies = [r <span class="kw">for</span> _,r <span class="kw">in</span> templates]
<span class="kw">def</span> <span class="fn">synthesize</span>(q, retrieved, modality_extras):
    q_emb = <span class="fn">encode_text</span>(q)
    sims  = kw_emb @ q_emb
    best  = <span class="fn">int</span>(np.<span class="fn">argmax</span>(sims))
    answer = kw_replies[best]
    <span class="kw">return</span> {
        <span class="str">"answer"</span>: answer,
        <span class="str">"citations"</span>: [{<span class="str">"source"</span>: d, <span class="str">"score"</span>: s} <span class="kw">for</span> d, s <span class="kw">in</span> retrieved],
        <span class="str">"modality_extras"</span>: modality_extras,
        <span class="str">"confidence"</span>: <span class="fn">float</span>(sims[best]),
    }

<span class="cm"># ---------- 5. Hat ----------</span>
<span class="kw">def</span> <span class="fn">assistant</span>(text=<span class="kw">None</span>, image=<span class="kw">None</span>, audio=<span class="kw">None</span>, document=<span class="kw">None</span>):
    extras = {}
    <span class="kw">if</span> image <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:    extras[<span class="str">"image_feat"</span>]  = <span class="fn">encode_image</span>(image).<span class="fn">tolist</span>()
    <span class="kw">if</span> audio <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:    extras[<span class="str">"audio_feat"</span>]  = <span class="fn">encode_audio</span>(audio).<span class="fn">tolist</span>()
    <span class="kw">if</span> document <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>: extras[<span class="str">"doc_fields"</span>]  = <span class="fn">parse_document</span>(document)
    q = text <span class="kw">or</span> <span class="str">""</span>
    <span class="kw">if</span> document <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span> <span class="kw">and</span> <span class="str">"doc_fields"</span> <span class="kw">in</span> extras:
        <span class="cm"># Sorguyu belge alanlarıyla genişlet ki erişim onları kullanabilsin</span>
        q = q + <span class="str">" "</span> + <span class="str">" "</span>.<span class="fn">join</span>(<span class="fn">str</span>(v) <span class="kw">for</span> v <span class="kw">in</span> extras[<span class="str">"doc_fields"</span>].<span class="fn">values</span>())
    retrieved = <span class="fn">retrieve</span>(q) <span class="kw">if</span> q.<span class="fn">strip</span>() <span class="kw">else</span> []
    <span class="kw">return</span> <span class="fn">synthesize</span>(q, retrieved, extras)

<span class="cm"># ---------- 6. Demo sıraları ----------</span>
<span class="fn">print</span>(<span class="str">"--- Sıra 1: yalnız metin ---"</span>)
r = <span class="fn">assistant</span>(text=<span class="str">"How do I reset my password?"</span>)
<span class="fn">print</span>(r[<span class="str">"answer"</span>], <span class="str">"| güv="</span>, <span class="fn">round</span>(r[<span class="str">"confidence"</span>], <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Alıntılar:"</span>, [c[<span class="str">"source"</span>][:<span class="num">40</span>] + <span class="str">"..."</span> <span class="kw">for</span> c <span class="kw">in</span> r[<span class="str">"citations"</span>]])

<span class="fn">print</span>(<span class="str">"\\n--- Sıra 2: metin + ses + görüntü ---"</span>)
r = <span class="fn">assistant</span>(text=<span class="str">"What is the pricing?"</span>, image=img, audio=audio)
<span class="fn">print</span>(r[<span class="str">"answer"</span>], <span class="str">"| güv="</span>, <span class="fn">round</span>(r[<span class="str">"confidence"</span>], <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Görüntü özn:"</span>, [<span class="fn">round</span>(v, <span class="num">3</span>) <span class="kw">for</span> v <span class="kw">in</span> r[<span class="str">"modality_extras"</span>][<span class="str">"image_feat"</span>]])

<span class="fn">print</span>(<span class="str">"\\n--- Sıra 3: belge yükleme ---"</span>)
fake_doc = <span class="str">"Invoice INV-7421 Date 2026-05-04 ... Total $132.50"</span>
r = <span class="fn">assistant</span>(text=<span class="str">"Can I get a refund on this?"</span>, document=fake_doc)
<span class="fn">print</span>(r[<span class="str">"answer"</span>])
<span class="fn">print</span>(<span class="str">"Belge alanları:"</span>, r[<span class="str">"modality_extras"</span>][<span class="str">"doc_fields"</span>])
</code></pre></div>

<p class="l-text">Bu Pyodide demosunun yapısal olarak doğru yaptığı üç şey: (1) her modalitenin kendi kodlayıcısı vardır ve hepsi sayısal öznitelikler döndürür; (2) erişim, birleşik metin söz dağarcığı üzerinde tek bir kosinüs-benzerlik adımıdır; (3) sentez hem orijinal sorguyu hem de modalite-çıkarılmış alanları görür. Her oyuncak kodlayıcıyı gerçek olanla (SigLIP, Whisper, Donut) ve LogReg sentezini Claude 3.5 Sonnet ile değiştirin, üretim sistemine sahip olursunuz.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Üretim Çıkarım Taslağı</h2>
<p class="l-text">Aynı hattın gerçek API'lerle nasıl göründüğü. Pyodide bunu çalıştıramaz; yukarıdaki demo için dağıtım hedefidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — üretim)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Gerçek üretim asistanı — Pyodide tarafından engellendi</span>
<span class="kw">import</span> anthropic, openai, base64, io
<span class="kw">from</span> PIL <span class="kw">import</span> Image
<span class="kw">import</span> whisper

client_anthropic = anthropic.<span class="fn">Anthropic</span>()
client_openai    = openai.<span class="fn">OpenAI</span>()
asr = whisper.<span class="fn">load_model</span>(<span class="str">"large-v3-turbo"</span>)

<span class="kw">def</span> <span class="fn">encode_image_b64</span>(im: Image.Image) -&gt; <span class="fn">str</span>:
    buf = io.<span class="fn">BytesIO</span>()
    im.<span class="fn">save</span>(buf, format=<span class="str">"PNG"</span>)
    <span class="kw">return</span> base64.<span class="fn">b64encode</span>(buf.<span class="fn">getvalue</span>()).<span class="fn">decode</span>()

<span class="kw">def</span> <span class="fn">transcribe</span>(audio_path):
    r = asr.<span class="fn">transcribe</span>(audio_path)
    <span class="kw">return</span> r[<span class="str">"text"</span>], r.<span class="fn">get</span>(<span class="str">"language"</span>, <span class="str">"en"</span>)

<span class="kw">def</span> <span class="fn">retrieve</span>(query, top_k=<span class="num">5</span>):
    <span class="str">"""BGE-M3 + Qdrant; sözde kod."""</span>
    q_emb = <span class="fn">embed_bge</span>(query)
    <span class="kw">return</span> qdrant.<span class="fn">search</span>(<span class="str">"docs"</span>, q_emb, top_k=top_k)

<span class="kw">def</span> <span class="fn">assistant</span>(text=<span class="kw">None</span>, image=<span class="kw">None</span>, audio_path=<span class="kw">None</span>, doc_pages=<span class="kw">None</span>):
    parts = []
    <span class="kw">if</span> text: parts.<span class="fn">append</span>({<span class="str">"type"</span>: <span class="str">"text"</span>, <span class="str">"text"</span>: text})

    <span class="kw">if</span> audio_path:
        transcript, lang = <span class="fn">transcribe</span>(audio_path)
        parts.<span class="fn">append</span>({<span class="str">"type"</span>: <span class="str">"text"</span>, <span class="str">"text"</span>: f<span class="str">"[Audio transcript ({lang})] {transcript}"</span>})

    <span class="kw">if</span> image <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
        parts.<span class="fn">append</span>({<span class="str">"type"</span>: <span class="str">"image"</span>, <span class="str">"source"</span>: {
            <span class="str">"type"</span>: <span class="str">"base64"</span>, <span class="str">"media_type"</span>: <span class="str">"image/png"</span>,
            <span class="str">"data"</span>: <span class="fn">encode_image_b64</span>(image)
        }})

    <span class="kw">if</span> doc_pages:
        <span class="kw">for</span> i, page_im <span class="kw">in</span> <span class="fn">enumerate</span>(doc_pages):
            parts.<span class="fn">append</span>({<span class="str">"type"</span>: <span class="str">"text"</span>, <span class="str">"text"</span>: f<span class="str">"[Page {i+1}]"</span>})
            parts.<span class="fn">append</span>({<span class="str">"type"</span>: <span class="str">"image"</span>, <span class="str">"source"</span>: {
                <span class="str">"type"</span>: <span class="str">"base64"</span>, <span class="str">"media_type"</span>: <span class="str">"image/png"</span>,
                <span class="str">"data"</span>: <span class="fn">encode_image_b64</span>(page_im)
            }})

    <span class="cm"># Yerleştirme parçalarını eriş</span>
    retrieved = <span class="fn">retrieve</span>(text <span class="kw">or</span> <span class="str">""</span> )
    parts.<span class="fn">append</span>({<span class="str">"type"</span>: <span class="str">"text"</span>, <span class="str">"text"</span>: <span class="str">"Relevant context:\\n"</span>
                  + <span class="str">"\\n"</span>.<span class="fn">join</span>(r[<span class="str">"text"</span>] <span class="kw">for</span> r <span class="kw">in</span> retrieved)})

    msg = client_anthropic.messages.<span class="fn">create</span>(
        model=<span class="str">"claude-3-5-sonnet-20241022"</span>,
        max_tokens=<span class="num">1024</span>,
        system=(<span class="str">"You are a customer-support assistant. Answer with strict JSON: "</span>
                <span class="str">"{answer, citations:[...], confidence:0..1}. Cite only from "</span>
                <span class="str">"retrieved context or visible image content."</span>),
        messages=[{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: parts}],
    )
    <span class="kw">return</span> msg.content[<span class="num">0</span>].text  <span class="cm"># JSON dizesi</span>
</code></pre></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Değerlendirme Koşumu</h2>
<p class="l-text">Multimodal bir ürün tek bir metrikle değerlendirilemez. Koşum her alt sistemi ve uçtan uca görevi kapsamalıdır. Her modalite kombinasyonunda örneklerle 500 örneklik bir değerlendirme seti inşa edin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Modalite başına birim testleri</div><div class="card-body"><strong>ASR:</strong> 50 örneklik sesli not setinde WER. Hedef ≤%6. <strong>OCR/belge:</strong> çıkarılan (anahtar, değer) çiftlerinde alan-seviyesi F1. <strong>Görüntü yerleştirme:</strong> 50 (ekran görüntüsü, belge-sayfa) çiftinde erişim R@5.</div></div>
<div class="calc-card"><div class="card-title">Uçtan uca görev başarısı</div><div class="card-body">500 örneklik bir test setinde insan tarafından notlanan veya LLM-yargıç-olarak. Geçer = cevap doğrudur VE alıntılar geçerlidir VE halüsinasyon yok. Hedef ≥%80.</div></div>
<div class="calc-card"><div class="card-title">Halüsinasyon sondası</div><div class="card-body">Düşmanca 50 örnek: belge X der, soru Y hakkında sorar. Geçer = "Bilmiyorum / belgede değil". Hedef ≥%95 (%3 kayıp oranı şartnamesi).</div></div>
<div class="calc-card"><div class="card-title">Gecikme / maliyet</div><div class="card-body">Modalite kombinasyonu başına P50 / P95 gecikme. Sıra başına sent cinsinden maliyet. Çağrı başına izleme: hangi kodlayıcı çalıştı, LLM'ye kaç girdi token.</div></div>
<div class="calc-card"><div class="card-title">Sürekli değerlendirme (üretim)</div><div class="card-body">Canlı trafiğin %1'ini örnekle, tam izlemeleri kaydet, çağrılı ML mühendisi ile haftalık inceleme. Araçlar: Langfuse, Braintrust, Weights &amp; Biases Weave.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Dağıtım Topolojisi ve Maliyet Aritmetiği</h2>
<p class="l-text">İki uç topoloji gerçeği parantez içine alır. Çoğu ürün ortada yer alır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Saf API cascade</div><div class="card-body">Whisper API + OpenAI/Anthropic VLM + ElevenLabs TTS. Sıfır altyapı. Sıra başına maliyet (metin + 1 görüntü, ~5K token çıktı): ~$0.03–0.10. P50 ~3–5s. Sevkiyat etmesi en kolay.</div></div>
<div class="calc-card"><div class="card-title">Her şeyi kendi-barındır</div><div class="card-body">A100 80GB × 1–2: Whisper-Turbo + Llama-3.3-70B / Qwen2.5-72B + XTTS. 1–2 makine, ~$3K/ay. ~50K sıra/ay'da API'ye karşı başabaş. Avantaj: veri bulunduğu yer, öngörülebilir maliyet. Dezavantaj: ops yükü.</div></div>
<div class="calc-card"><div class="card-title">Hibrit (2026 varsayılanı)</div><div class="card-body">Ucuz-ve-sık olanları (ASR, görüntü gömme, erişim) küçük GPU'larda kendi-barındır. Sentez LLM için API. En iyi maliyet/gecikme profili. Sıra başına ~$0.005–0.02. P50 ~2s.</div></div>
<div class="calc-card"><div class="card-title">Edge / cihaz-üzeri</div><div class="card-body">Gizlilik-kritik için (tıbbi, devlet). Bir dizüstü veya M-serisi Mac'te küçük Whisper + 7B-nicelendirilmiş LLM + minik VLM (PaliGemma 3B). Daha düşük kalite, sıfır-güven dağıtım.</div></div>
</div>

<div class="calc-highlight"><strong>Hibrit için maliyet aritmetiği:</strong> 1M sıra/ay × $0.01/sıra = ölçekte ayda $10K. Whisper'i kendi-barındırmak bunun ~$2K'sını tasarruf eder. Erişimi kendi-barındırmak (küçük bir VM'de Qdrant) bir ~$500 daha tasarruf eder. Sentez VLM API'si baskın hat öğesidir; prompt mühendisliği, önbellekleme (Anthropic prompt önbellekleme) ve basit sıraları ucuz bir modele yönlendirme en çok burada karşılığını verir.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Arıza Modları ve Koruyucular</h2>
<p class="l-text">Her multimodal ürün karakteristik şekillerde başarısız olur. Onları bilmek, sizi ısırmadan önce koruyucular inşa etmenizi sağlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ASR yanlış-okumaları</div><div class="card-body">"Reset my password" "Reset my passwords" olarak duyuldu — küçük. "Cancel my subscription" "Can I sell my subscription" olarak duyuldu — büyük. Koruyucu: Whisper'da güven eşiği; &lt;0.7 ise kullanıcıya niyeti onaylamasını sor.</div></div>
<div class="calc-card"><div class="card-title">OCR kırılganlığı</div><div class="card-body">Kötü aydınlatılmış makbuz telefon fotoğrafları → %30 eksik alan. Koruyucu: görüntü kalitesini ön-tara (bulanıklık tespiti), çok düşükse kullanıcıdan yeniden çekmesini iste.</div></div>
<div class="calc-card"><div class="card-title">Grafiklerde VLM halüsinasyonu</div><div class="card-body">"Y-ekseni neyi gösterir?" — model akla yatkın etiketler uydurur. Koruyucu: gördüğü tam metni alıntılamasını veya "eksen etiketi görünmüyor" demesini gerektiren yapılandırılmış-çıktı şeması.</div></div>
<div class="calc-card"><div class="card-title">Çapraz-modal çelişki</div><div class="card-body">Kullanıcı "Yükseltmek istiyorum" yazar ama sesli not "aslında boş ver" der. Koruyucu: açık çapraz-modal-çelişki çözümleme prompt adımı.</div></div>
<div class="calc-card"><div class="card-title">Gizlilik sızıntısı</div><div class="card-body">Belge başka kullanıcıların verilerini içerir. Koruyucu: API'ye göndermeden önce PII tespit geçişi; tespit halinde yalnızca kendi-barındırılan bir modele yönlendir.</div></div>
<div class="calc-card"><div class="card-title">Maliyet kaçışı</div><div class="card-body">Tek bir kullanıcı 200 sayfalık bir PDF yükler. Koruyucu: sıra başına token bütçesi (örn. 50K girdi sınırı), uzun belgeler için önce-özetle hattı, kullanıcı başına sert maliyet tavanı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Uzantı — Üretim Eklemek</h2>
<p class="l-text">Asistanımız şimdiye kadar yalnızca multimodal girdi tüketir. Üretim eklemek sistemi yaratıcı bir araca çevirir: üretilmiş bir görüntüyle (grafikler), sentezlenmiş bir sesli yanıtla veya bir video gezintisiyle yanıt ver.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sesli yanıt (TTS)</div><div class="card-body">Cevabı oluştuğu gibi ElevenLabs Turbo veya OpenAI TTS aracılığıyla akış. ~250 ms ilk-sese-zaman. Sesli-öncelikli arayüzler için varsayılan.</div></div>
<div class="calc-card"><div class="card-title">Üretilen grafikler</div><div class="card-body">Cevap veri içeriyorsa, LLM bir Plotly/Vega-Lite şartnamesi yayar → sunucu işler → PNG döndürür. Veya matplotlib çalıştırmak için bir kod-yürütme aracı çağır. Grafikler için üretilen difüzyon görüntüsünden çok daha iyi.</div></div>
<div class="calc-card"><div class="card-title">Üretilen diyagramlar</div><div class="card-body">Mermaid/Excalidraw metin DSL'leri LLM-dostudur. Sunucu tarafında işle. Difüzyon (DALL-E 3, FLUX) yalnızca gerçekten yaratıcı çıktılar (illüstrasyonlar) için kullan.</div></div>
<div class="calc-card"><div class="card-title">Gezinti videosu</div><div class="card-body">Eğitim cevapları için: üretilen seslendirmeyi bir ekran kaydı veya üretilen kısa videoyla (Veo / Sora) dik. Yüksek maliyet; yalnızca premium kademeler için.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Yol Haritası — Bunu Sonra Nereye Götürmeli</h2>
<p class="l-text">Capstone'un üstüne inşa edebileceğiniz, artan hırs sırasıyla altı somut uzantı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Akış sesli mod</div><div class="card-body">WebRTC + Whisper akış + cümle-seviyesi LLM akış + ElevenLabs akış TTS ekle. Tam-dupleks sesli konuşma elde et. Araçlar: pipecat, livekit-agents, Vapi.</div></div>
<div class="calc-card"><div class="card-title">2. Kullanıcı başına bellek katmanı</div><div class="card-body">Geçmiş sıraları user_id ile anahtarlanan bir vektör DB'de sakla. İlgili önceki bağlamı enjekte et. Mem0, Letta (eski adıyla MemGPT) veya kendi başına yuvarla.</div></div>
<div class="calc-card"><div class="card-title">3. Araç kullanımı / ajan uzantısı</div><div class="card-body">Asistanın API'leri çağırmasına izin ver (aboneliği iptal et, geri ödeme oluştur, bilet aç). Anthropic araç kullanımı veya MCP sunucuları. Tarif için agents-L3'e bakın.</div></div>
<div class="calc-card"><div class="card-title">4. Alanına göre ince ayarla</div><div class="card-body">Loglara sahip olduğunda, sentez LLM'sini (girdi, ideal-çıktı) çiftleri üzerinde ince ayarla. DPO asistan ayarlama için iyi çalışır; QLoRA tek bir A100'e sığar.</div></div>
<div class="calc-card"><div class="card-title">5. Geri bildirimle kendini iyileştirme</div><div class="card-body">Her yanıtta beğen/beğenme → DPO veri kümesi → haftalık ince ayar. Klasik RLHF geri bildirim döngüsü, tek bir ürüne ölçeklendi.</div></div>
<div class="calc-card"><div class="card-title">6. Uzmanlaşmış dikey model</div><div class="card-body">Alanınız tıbbi / yasal / finansal ise, tüm bunları on-prem çalışan uzmanlaşmış 8B–13B modele damıt. Model için öncü, eğitim verisi için API sisteminin loglarından.</div></div>
</div>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Sınır Modelleri — Capstone Model Seçimleri</h2>
<p class="l-text"><strong>2024'te multimodal manzara patladı.</strong> 2026'da bunun gibi bir capstone'u kurarken artık GPT-4V ile LLaVA-1.5 arasında seçim yapmıyorsunuz — altı güvenilir sınır seçeneğiniz var ve ikisi açık-ağırlık. Aşağıdaki kart ızgarası her modeli bir üretim multimodal asistanında en iyi oynadığı role eşler: sentez beyni, ekran görüntüsü-sürücüsü, doğal akışçı veya ince ayar yapılabilir iş atı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">GPT-4o (OpenAI, May 2024)</div><div class="card-body">Doğal multimodal metin + görü + ses, GPT-4 Turbo'dan %50 daha ucuz, uçtan uca ses yolu. Gecikme ve maliyet eşit önem taşıdığında varsayılan sentez beyni.</div></div>
<div class="calc-card"><div class="card-title">Claude 3.5 / 3.7 Sonnet (Anthropic, Haz 2024 / Şub 2025)</div><div class="card-body">Görü + genişletilmiş düşünme + <em>bilgisayar kullanımı</em>. Capstone'un tarayıcı sürmesi, ekran görüntüsü hata ayıklaması veya görünür müsveddeli uzun PDF muhakemesi gerektiğinde en iyi seçim.</div></div>
<div class="calc-card"><div class="card-title">Gemini 2.0 Flash (Google, Ara 2024)</div><div class="card-body">Doğal multimodal <em>çıktı</em> (iç içe metin + görüntü + ses), 1M+ token bağlam, akışlı Live API. Gerçek zamanlı sesli/görüntülü asistanlar için seçim.</div></div>
<div class="calc-card"><div class="card-title">Llama 3.2 Vision 11B / 90B (Meta, Eyl 2024)</div><div class="card-body">Açık-ağırlık VLM, ince ayar yapılabilir. 11B tek A100'de çalışır; 90B grafiklerde GPT-4V ile yarışır. Veri şirket içinde kalmalıysa veya özel alan adaptörü istiyorsanız kullanın.</div></div>
<div class="calc-card"><div class="card-title">Qwen2-VL 72B (Alibaba, Ağu 2024)</div><div class="card-body">Doğal dinamik çözünürlük, 20 dk video, MMMU/DocVQA'da SOTA açık-kaynak. Belge-ağırlıklı veya video-ağırlıklı capstone'lar için açık sentez beyni.</div></div>
<div class="calc-card"><div class="card-title">InternVL 2.5 (OpenGVLab, Ara 2024)</div><div class="card-body">78B açık VLM, ~%70 MMMU. OpenAI/Anthropic kilidi olmadan sınır-sınıfı kalite istediğinizde ve barındırmak için GPU'larınız olduğunda.</div></div>
</div>
<div class="calc-highlight"><strong>Capstone yönlendirme kuralı:</strong> sentez için varsayılan kapalı beyin olarak GPT-4o veya Claude 3.5 Sonnet kullanın; kendi-barındırılırken Qwen2-VL 72B veya Llama 3.2 90B'ye geçin. UI-sürme görevleri için (tarayıcı, masaüstü) şu anda Claude 3.7 + bilgisayar kullanımı tek uygulanabilir seçim. Gerçek zamanlı akışlı sesli/görüntülü için Gemini 2.0 Flash Live en düşük gecikme seçeneğidir.</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Özet — Multimodal Yığını Uçtan Uca</h2>
<p class="l-text">Bir multimodal NLP asistanı tek bir model değil — bir sistemdir. 2026'da kazanan mimari deseni: her modalite için ucuz uzman kodlayıcılar (Whisper, SigLIP, Donut), multimodal gömmeler üzerinde birleşik bir erişim indeksi, sentez için bir öncü VLM (Claude 3.5 Sonnet, GPT-4o, Gemini 2.0) ve hataları yakalamak için ucuz bir öz-değerlendirme geçişi. Her katman bağımsız olarak değiştirilebilir, ölçeklendirilebilir veya kendi-barındırılabilir.</p>

<div class="calc-highlight"><strong>Track boyunca neler inşa ettin:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li><strong>L1:</strong> Multimodal taksonomi ve üç füzyon stratejisi (erken, geç, çapraz-dikkat).</li>
<li><strong>L2:</strong> CLIP — çift-kodlayıcı, karşıt InfoNCE, zero-shot transfer; torunlar OpenCLIP, EVA-CLIP, SigLIP.</li>
<li><strong>L3:</strong> Görü-Dil Modelleri — LLaVA'nın tarifi, BLIP-2'nin Q-Former'ı, AnyRes, Qwen2-VL.</li>
<li><strong>L4:</strong> Ses LLM'leri — Whisper, SeamlessM4T, Qwen-Audio, GPT-4o-Audio, kodek token'ları.</li>
<li><strong>L5:</strong> Video — uzay-zaman yamaları, VideoMAE, Video-ChatGPT, Gemini 1.5 uzun bağlam.</li>
<li><strong>L6:</strong> Belge AI — LayoutLMv3, Donut, Pix2Struct, 2024 genelci-VLM yıkımı.</li>
<li><strong>L7:</strong> Üretim — difüzyon / akış eşleştirme / kodek-AR; DALL-E 3, Sora, MusicGen, VALL-E 2.</li>
<li><strong>L8:</strong> Capstone — yönlendirme, erişim, sentez, değerlendirme, dağıtım.</li>
</ul>
</div>

<p class="l-text">Multimodal artık herhangi bir öncü model için varsayılan modalitedir; "yalnızca metin" niş duruma dönüşüyor. Sonraki öncü tam sensorimotor — robotik, fiziksel dünyayı kontrol eden gerçek-zamanlı ajanlar, vücutlanmış YZ. O sonraki sıçrama için tercih edilen track, bu track'taki her şeyle birleştirilmiş RL'dir (RLHF, dünya modelleri). İyi şanslar.</p>
</div>`
};
