window.CV_L12 = {

en: `<p class="l-text"><strong>This is the capstone — vision and language working together as one application.</strong> We will build a Visual Question Answering (VQA) app that takes an image and a natural-language question and returns a grounded answer. It will reuse everything we have learned: CNNs as backbones, transformers for text, CLIP-style alignment, and a multimodal LLM head.</p>

<p class="l-text">In this lesson you will architect a multimodal pipeline, run BLIP-2 / LLaVA from HuggingFace, ship a Gradio UI, evaluate captioning with BLEU and CIDEr, and connect each piece to the earlier 11 lessons.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Architect a Visual Question Answering pipeline from image input to text answer</li>
<li>Run BLIP-2 and LLaVA from HuggingFace for grounded image-question reasoning</li>
<li>Ship an interactive Gradio web UI with image upload and prompt box</li>
<li>Evaluate generated captions with BLEU, CIDEr, and CLIPScore metrics</li>
<li>Tie every component back to backbones, transformers, CLIP, and prompting from L1-L11</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Project: Visual Question Answering</h2>
<p class="l-text">Goal: a tiny web app where a user uploads an image, types a question like "What color is the car?" and gets a fluent answer. Under the hood, this is a multimodal LLM.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Inputs</div><div class="card-body">Image (PIL) + question (string).</div></div>
<div class="calc-card"><div class="card-title">Output</div><div class="card-body">Free-form answer string.</div></div>
<div class="calc-card"><div class="card-title">Variants</div><div class="card-body">Image captioning (no question), grounded VQA, scene description.</div></div>
<div class="calc-card"><div class="card-title">Datasets</div><div class="card-body">VQAv2, GQA, COCO Captions for benchmarking.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Architecture: Vision Encoder + LLM</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vision encoder</div><div class="card-body">CLIP-ViT or EVA-ViT produces patch features.</div></div>
<div class="calc-card"><div class="card-title">Adapter</div><div class="card-body">Q-Former (BLIP-2) or projection MLP (LLaVA) maps vision → language tokens.</div></div>
<div class="calc-card"><div class="card-title">LLM</div><div class="card-body">Frozen or fine-tuned causal LM (Llama, OPT, Vicuna) generates the answer.</div></div>
<div class="calc-card"><div class="card-title">Cross-attention</div><div class="card-body">Image tokens injected into LLM either as prefix tokens or via cross-attention.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Preprocessing and Embedding</h2>
<p class="l-text">For both BLIP-2 and LLaVA, the recipe is similar: resize to 224 or 336, normalize, run the vision encoder, project to LLM embedding space, and concatenate with text tokens.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> Blip2Processor, Blip2ForConditionalGeneration
<span class="kw">from</span> PIL <span class="kw">import</span> Image
<span class="kw">import</span> torch

proc = Blip2Processor.<span class="fn">from_pretrained</span>(<span class="str">'Salesforce/blip2-opt-2.7b'</span>)
model = Blip2ForConditionalGeneration.<span class="fn">from_pretrained</span>(
    <span class="str">'Salesforce/blip2-opt-2.7b'</span>, torch_dtype=torch.float16).<span class="fn">to</span>(<span class="str">'cuda'</span>)

image = Image.<span class="fn">open</span>(<span class="str">'street.jpg'</span>)
question = <span class="str">'What is the person doing?'</span>
prompt = f<span class="str">'Question: {question} Answer:'</span>

inputs = <span class="fn">proc</span>(images=image, text=prompt, return_tensors=<span class="str">'pt'</span>).<span class="fn">to</span>(<span class="str">'cuda'</span>, torch.float16)
out = model.<span class="fn">generate</span>(**inputs, max_new_tokens=<span class="num">30</span>)
answer = proc.tokenizer.<span class="fn">decode</span>(out[<span class="num">0</span>], skip_special_tokens=<span class="kw">True</span>)
<span class="fn">print</span>(answer)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Toy VQA: TF-IDF over a small caption set and a question; pick the caption with highest cosine similarity as the answer.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

captions = [
    'A red car parked outside.',
    'A black cat on a sofa.',
    'Two children playing football.',
    'A laptop on a desk.'
]
question = 'What color is the cat?'

v = TfidfVectorizer().fit(captions + [question])
sims = cosine_similarity(v.transform([question]), v.transform(captions)).flatten()
best = int(np.argmax(sims))

print('Q:', question)
print('A:', captions[best])
print('similarity:', round(float(sims[best]), 3))</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Load BLIP-2 with the OPT-2.7B language model in fp16 to fit a single GPU. 2) The processor handles both image and text. 3) Build a "Question: ... Answer:" prompt — a common conditioning format. 4) <code>generate</code> autoregressively predicts the answer; we then decode tokens back to a string.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Streaming Inference and Prompt Engineering</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Streaming</div><div class="card-body">Use TextIteratorStreamer to yield tokens as they are produced. UX feels much faster.</div></div>
<div class="calc-card"><div class="card-title">System prompt</div><div class="card-body">"You are a careful visual assistant. Answer briefly." — bounds verbosity.</div></div>
<div class="calc-card"><div class="card-title">Few-shot</div><div class="card-body">Include 2-3 example (image, question, answer) triples in context to set style.</div></div>
<div class="calc-card"><div class="card-title">Temperature</div><div class="card-body">Use 0.0 for factual VQA, 0.7+ for creative captions.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Gradio UI in 30 Lines</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gradio <span class="kw">as</span> gr

<span class="kw">def</span> <span class="fn">vqa</span>(image, question):
    <span class="kw">if</span> image <span class="kw">is</span> <span class="kw">None</span> <span class="kw">or</span> <span class="kw">not</span> question:
        <span class="kw">return</span> <span class="str">'Please provide both an image and a question.'</span>
    prompt = f<span class="str">'Question: {question} Answer:'</span>
    inputs = <span class="fn">proc</span>(images=image, text=prompt, return_tensors=<span class="str">'pt'</span>).<span class="fn">to</span>(<span class="str">'cuda'</span>, torch.float16)
    out = model.<span class="fn">generate</span>(**inputs, max_new_tokens=<span class="num">30</span>)
    <span class="kw">return</span> proc.tokenizer.<span class="fn">decode</span>(out[<span class="num">0</span>], skip_special_tokens=<span class="kw">True</span>)

demo = gr.<span class="fn">Interface</span>(
    fn=vqa,
    inputs=[gr.<span class="fn">Image</span>(<span class="ty">type</span>=<span class="str">'pil'</span>), gr.<span class="fn">Textbox</span>(label=<span class="str">'Question'</span>)],
    outputs=gr.<span class="fn">Textbox</span>(label=<span class="str">'Answer'</span>),
    title=<span class="str">'Visual Question Answering'</span>,
    description=<span class="str">'Upload an image and ask a question about it.'</span>,
    examples=[[<span class="str">'cat.jpg'</span>, <span class="str">'What is the cat doing?'</span>]],
)
demo.<span class="fn">launch</span>()
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mimic a Gradio handler with plain Python: the same \`vqa(image, question)\` function but invoked directly with our preloaded \`img\` and a sample question.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def vqa(image, question):
    if image is None or not question:
        return 'Please provide both an image and a question.'
    brightness = float(image.mean())
    if 'color' in question.lower():
        rgb = image.reshape(-1, 3).mean(axis=0)
        return 'Dominant channel: ' + ['Red','Green','Blue'][int(np.argmax(rgb))]
    if 'bright' in question.lower():
        return 'bright' if brightness &gt; 127 else 'dark'
    return f'Unknown question. Image brightness = {brightness:.1f}'

print(vqa(img, 'What color dominates this image?'))
print(vqa(img, 'Is the image bright or dark?'))</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The <code>vqa</code> function wraps our generate call with a defensive check. 2) Gradio Interface declares two inputs (image + textbox) and one output. 3) An example pair appears under the form for users to try. 4) <code>launch()</code> starts a local server and gives a sharable URL. Add <code>share=True</code> to expose temporarily through Gradio's tunnel.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Evaluation: BLEU, CIDEr, Human</h2>
<p class="l-text">Generated text is hard to score automatically. Use multiple metrics — and never skip human review.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BLEU</div><div class="card-body">N-gram overlap with reference captions. Standard but fragile.</div></div>
<div class="calc-card"><div class="card-title">CIDEr</div><div class="card-body">Tf-idf weighted n-gram similarity. Designed for image captioning.</div></div>
<div class="calc-card"><div class="card-title">METEOR / ROUGE</div><div class="card-body">Synonyms, word order. Useful complement to BLEU.</div></div>
<div class="calc-card"><div class="card-title">Human eval</div><div class="card-body">Pairwise preference and Likert scoring on a small sample. The truth metric.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Connecting Back to Lessons 1–11</h2>
<p class="l-text">This capstone uses every layer of the course:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">L1–L2</div><div class="card-body">Image fundamentals, OpenCV preprocessing.</div></div>
<div class="calc-card"><div class="card-title">L3–L4</div><div class="card-body">Filters and features for sanity-checking image quality.</div></div>
<div class="calc-card"><div class="card-title">L5–L7</div><div class="card-body">CNN, detection, segmentation provide alternative grounding signals.</div></div>
<div class="calc-card"><div class="card-title">L8–L10</div><div class="card-body">ViT, generation, CLIP — the multimodal backbone.</div></div>
</div>
<div id="cv-l12-plot-en" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Multimodal apps fuse a vision encoder, an adapter, and an LLM.<br><strong>2.</strong> BLIP-2 and LLaVA are open, capable starting points.<br><strong>3.</strong> Prompt engineering — system prompt, few-shot, temperature — shapes answer quality.<br><strong>4.</strong> Gradio gets you to a working demo in 30 lines.<br><strong>5.</strong> BLEU/CIDEr automate scoring but always pair with human review.<br><strong>6.</strong> The 12-lesson arc maps cleanly onto a real product: pixels → features → models → multimodal → production.<br><strong>7.</strong> You are now ready to build vision applications end-to-end.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var stages = ['Preprocess','Vision encoder','Adapter','LLM','Postprocess'];
  var ms     = [3, 18, 1, 35, 2];
  var trace = { x: stages, y: ms, type:'bar', marker:{color:'#c8a96e'} };
  var layout = { margin:{t:20,r:20,b:60,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, yaxis:{title:'ms'} };
  var en = document.getElementById('cv-l12-plot-en'); if (en) Plotly.newPlot(en, [trace], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l12-plot-tr'); if (tr) Plotly.newPlot(tr, [{x:['Ön işleme','Görme enkoderi','Adaptör','LLM','Son işleme'],y:ms,type:'bar',marker:{color:'#c8a96e'}}], layout, {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Bitirme bu — görme ve dil tek bir uygulama olarak çalışıyor.</strong> Bir görüntü ve doğal dil sorusu alıp temellendirilmiş yanıt veren bir Görsel Soru Yanıtlama (VQA) uygulaması kuracağız. Öğrendiğimiz her şeyi kullanır: CNN omurgalar, metin için Transformer, CLIP tarzı hizalama ve çok modlu LLM başlığı.</p>

<p class="l-text">Bu derste çok modlu boru hattı tasarlayacak, HuggingFace'ten BLIP-2 / LLaVA çalıştıracak, Gradio arayüzü yayımlayacak, BLEU ve CIDEr ile altyazı değerlendirecek ve her parçayı önceki 11 derse bağlayacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Görüntü girdisinden metin cevaba uzanan bir Görsel Soru Yanıtlama (VQA) pipeline'ı tasarlamayı</li>
<li>HuggingFace'ten BLIP-2 ve LLaVA'yı temellendirilmiş görüntü-soru çıkarımı için çalıştırmayı</li>
<li>Görüntü yükleme ve prompt kutusuyla etkileşimli Gradio web arayüzü yayımlamayı</li>
<li>Üretilen altyazıları BLEU, CIDEr ve CLIPScore metrikleriyle değerlendirmeyi</li>
<li>Her bileşeni L1-L11'deki backbone, transformer, CLIP ve prompting derslerine bağlamayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Proje: Görsel Soru Yanıtlama</h2>
<p class="l-text">Hedef: kullanıcı görüntü yükler, "Arabanın rengi ne?" gibi bir soru yazar ve akıcı bir yanıt alır. Kapağın altında bu çok modlu bir LLM'dir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Girdiler</div><div class="card-body">Görüntü (PIL) + soru (dize).</div></div>
<div class="calc-card"><div class="card-title">Çıktı</div><div class="card-body">Serbest biçimli yanıt dizesi.</div></div>
<div class="calc-card"><div class="card-title">Varyantlar</div><div class="card-body">Görüntü altyazılama (sorusuz), temellendirilmiş VQA, sahne tarifi.</div></div>
<div class="calc-card"><div class="card-title">Veri kümeleri</div><div class="card-body">Kıyas için VQAv2, GQA, COCO Captions.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Mimari: Görme Enkoderi + LLM</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Görme enkoderi</div><div class="card-body">CLIP-ViT ya da EVA-ViT yama özellikleri üretir.</div></div>
<div class="calc-card"><div class="card-title">Adaptör</div><div class="card-body">Q-Former (BLIP-2) ya da yansıtım MLP (LLaVA) görme → dil jetonlarına eşler.</div></div>
<div class="calc-card"><div class="card-title">LLM</div><div class="card-body">Donmuş ya da ince ayarlı nedensel LM (Llama, OPT, Vicuna) yanıtı üretir.</div></div>
<div class="calc-card"><div class="card-title">Çapraz dikkat</div><div class="card-body">Görüntü jetonları LLM'e ön ek jeton olarak ya da çapraz dikkat üzerinden enjekte edilir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Ön İşleme ve Gömme</h2>
<p class="l-text">Hem BLIP-2 hem LLaVA için tarif benzer: 224 ya da 336'ya yeniden boyutlandır, normalleştir, görme enkoderini koştur, LLM gömme uzayına yansıt ve metin jetonlarıyla birleştir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> Blip2Processor, Blip2ForConditionalGeneration
<span class="kw">from</span> PIL <span class="kw">import</span> Image
<span class="kw">import</span> torch

proc = Blip2Processor.<span class="fn">from_pretrained</span>(<span class="str">'Salesforce/blip2-opt-2.7b'</span>)
model = Blip2ForConditionalGeneration.<span class="fn">from_pretrained</span>(
    <span class="str">'Salesforce/blip2-opt-2.7b'</span>, torch_dtype=torch.float16).<span class="fn">to</span>(<span class="str">'cuda'</span>)

gor = Image.<span class="fn">open</span>(<span class="str">'cadde.jpg'</span>)
soru = <span class="str">'Kişi ne yapıyor?'</span>
prompt = f<span class="str">'Question: {soru} Answer:'</span>

inputs = <span class="fn">proc</span>(images=gor, text=prompt, return_tensors=<span class="str">'pt'</span>).<span class="fn">to</span>(<span class="str">'cuda'</span>, torch.float16)
out = model.<span class="fn">generate</span>(**inputs, max_new_tokens=<span class="num">30</span>)
yanit = proc.tokenizer.<span class="fn">decode</span>(out[<span class="num">0</span>], skip_special_tokens=<span class="kw">True</span>)
<span class="fn">print</span>(yanit)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak VQA: küçük caption seti ve soru üzerinde TF-IDF; en yüksek cosine similarity'li caption cevap olarak seçilir.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

captions = [
    'A red car parked outside.',
    'A black cat on a sofa.',
    'Two children playing football.',
    'A laptop on a desk.'
]
question = 'What color is the cat?'

v = TfidfVectorizer().fit(captions + [question])
sims = cosine_similarity(v.transform([question]), v.transform(captions)).flatten()
best = int(np.argmax(sims))

print('Q:', question)
print('A:', captions[best])
print('similarity:', round(float(sims[best]), 3))</code></pre></div></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) BLIP-2'yi OPT-2.7B dil modeliyle fp16'da yükle. 2) Processor hem görüntü hem metni işler. 3) Yaygın bir koşullama formatı olan "Question: ... Answer:" prompt'u kur. 4) <code>generate</code> yanıtı otoregresif tahmin eder; ardından jetonları metne çözeriz.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Akış Çıkarımı ve Prompt Mühendisliği</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Akış</div><div class="card-body">Jetonlar üretildikçe vermek için TextIteratorStreamer kullanın. UX çok daha hızlı hisseder.</div></div>
<div class="calc-card"><div class="card-title">Sistem prompt'u</div><div class="card-body">"Dikkatli bir görsel asistanısın. Kısa cevap ver." — söz uzunluğunu sınırlar.</div></div>
<div class="calc-card"><div class="card-title">Az atış</div><div class="card-body">Bağlama 2-3 örnek (görüntü, soru, cevap) üçlüsü ekleyerek stili belirleyin.</div></div>
<div class="calc-card"><div class="card-title">Sıcaklık</div><div class="card-body">Olgusal VQA için 0.0, yaratıcı altyazı için 0.7+.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. 30 Satırda Gradio Arayüzü</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gradio <span class="kw">as</span> gr

<span class="kw">def</span> <span class="fn">vqa</span>(gor, soru):
    <span class="kw">if</span> gor <span class="kw">is</span> <span class="kw">None</span> <span class="kw">or</span> <span class="kw">not</span> soru:
        <span class="kw">return</span> <span class="str">'Lütfen hem görüntü hem soru girin.'</span>
    prompt = f<span class="str">'Question: {soru} Answer:'</span>
    inputs = <span class="fn">proc</span>(images=gor, text=prompt, return_tensors=<span class="str">'pt'</span>).<span class="fn">to</span>(<span class="str">'cuda'</span>, torch.float16)
    out = model.<span class="fn">generate</span>(**inputs, max_new_tokens=<span class="num">30</span>)
    <span class="kw">return</span> proc.tokenizer.<span class="fn">decode</span>(out[<span class="num">0</span>], skip_special_tokens=<span class="kw">True</span>)

demo = gr.<span class="fn">Interface</span>(
    fn=vqa,
    inputs=[gr.<span class="fn">Image</span>(<span class="ty">type</span>=<span class="str">'pil'</span>), gr.<span class="fn">Textbox</span>(label=<span class="str">'Soru'</span>)],
    outputs=gr.<span class="fn">Textbox</span>(label=<span class="str">'Yanıt'</span>),
    title=<span class="str">'Görsel Soru Yanıtlama'</span>,
    description=<span class="str">'Bir görüntü yükleyin ve hakkında soru sorun.'</span>,
    examples=[[<span class="str">'kedi.jpg'</span>, <span class="str">'Kedi ne yapıyor?'</span>]],
)
demo.<span class="fn">launch</span>()
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Düz Python ile Gradio handler taklidi: aynı \`vqa(image, question)\` fonksiyonu ama önceden yüklenmiş \`img\` ve örnek soruyla doğrudan çağrılır.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def vqa(image, question):
    if image is None or not question:
        return 'Please provide both an image and a question.'
    brightness = float(image.mean())
    if 'color' in question.lower():
        rgb = image.reshape(-1, 3).mean(axis=0)
        return 'Dominant channel: ' + ['Red','Green','Blue'][int(np.argmax(rgb))]
    if 'bright' in question.lower():
        return 'bright' if brightness &gt; 127 else 'dark'
    return f'Unknown question. Image brightness = {brightness:.1f}'

print(vqa(img, 'What color dominates this image?'))
print(vqa(img, 'Is the image bright or dark?'))</code></pre></div></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>vqa</code> fonksiyonu generate çağrımızı savunma kontrolüyle sarar. 2) Gradio Interface iki girdi (görüntü + metin kutusu) ve bir çıktı tanımlar. 3) Form altında kullanıcının deneyebileceği bir örnek çift görünür. 4) <code>launch()</code> yerel sunucu başlatır ve paylaşılabilir URL verir. Geçici olarak Gradio tüneli üzerinden açmak için <code>share=True</code> ekleyin.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Değerlendirme: BLEU, CIDEr, İnsan</h2>
<p class="l-text">Üretilen metni otomatik puanlamak zordur. Birden fazla metrik kullanın — ve insan incelemesini asla atlamayın.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BLEU</div><div class="card-body">Referans altyazılarla n-gram örtüşmesi. Standart ama kırılgan.</div></div>
<div class="calc-card"><div class="card-title">CIDEr</div><div class="card-body">Tf-idf ağırlıklı n-gram benzerliği. Görüntü altyazılaması için tasarlanmış.</div></div>
<div class="calc-card"><div class="card-title">METEOR / ROUGE</div><div class="card-body">Eş anlamlılar, kelime sırası. BLEU'ya yararlı tamamlayıcı.</div></div>
<div class="calc-card"><div class="card-title">İnsan değerlendirmesi</div><div class="card-body">Küçük örnekte ikili tercih ve Likert puanlama. Gerçek metrik.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Ders 1–11'e Geri Bağlanma</h2>
<p class="l-text">Bu bitirme kursun her katmanını kullanır:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">L1–L2</div><div class="card-body">Görüntü temelleri, OpenCV ön işleme.</div></div>
<div class="calc-card"><div class="card-title">L3–L4</div><div class="card-body">Görüntü kalitesini doğrulamak için filtreler ve özellikler.</div></div>
<div class="calc-card"><div class="card-title">L5–L7</div><div class="card-body">CNN, tespit, bölütleme alternatif temellendirme sinyali sağlar.</div></div>
<div class="calc-card"><div class="card-title">L8–L10</div><div class="card-body">ViT, üretim, CLIP — çok modlu omurga.</div></div>
</div>
<div id="cv-l12-plot-tr" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Çok modlu uygulamalar görme enkoderi, adaptör ve LLM'i birleştirir.<br><strong>2.</strong> BLIP-2 ve LLaVA açık ve yetkin başlangıç noktalarıdır.<br><strong>3.</strong> Prompt mühendisliği — sistem prompt'u, az atış, sıcaklık — yanıt kalitesini şekillendirir.<br><strong>4.</strong> Gradio 30 satırda çalışan demoya götürür.<br><strong>5.</strong> BLEU/CIDEr puanlamayı otomatikleştirir ama her zaman insan incelemesiyle birleştirin.<br><strong>6.</strong> 12 derslik yay gerçek bir ürüne temiz şekilde haritalanır: piksel → özellik → model → çok modlu → üretim.<br><strong>7.</strong> Artık baştan sona görüntü uygulamaları kurmaya hazırsınız.</div></div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var stages = ['Preprocess','Vision encoder','Adapter','LLM','Postprocess'];
  var ms     = [3, 18, 1, 35, 2];
  var trace = { x: stages, y: ms, type:'bar', marker:{color:'#c8a96e'} };
  var layout = { margin:{t:20,r:20,b:60,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, yaxis:{title:'ms'} };
  var en = document.getElementById('cv-l12-plot-en'); if (en) Plotly.newPlot(en, [trace], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l12-plot-tr'); if (tr) Plotly.newPlot(tr, [{x:['Ön işleme','Görme enkoderi','Adaptör','LLM','Son işleme'],y:ms,type:'bar',marker:{color:'#c8a96e'}}], layout, {displayModeBar:false});
}, 250);</script>
`
};
