window.MULTIMODAL_L6 = {
en: `<p class="l-text"><strong>Documents are the killer app for multimodal AI.</strong> A receipt, an invoice, a tax form, a scientific PDF, a medical record — none of these are pure text and none are pure images. They are <em>structured layouts</em>: tokens whose meaning depends on where they sit on the page, what fonts and font-weights surround them, which table column they belong to, which checkbox they live next to. A vanilla LLM that reads the OCR string for a receipt loses every spatial cue and routinely misreads totals. A vanilla vision model sees pixels but does not know "INVOICE NUMBER" is a key whose value is two centimeters to the right. The Document AI subfield emerged precisely to fix this: models that fuse text, layout, and pixels in one architecture.</p>

<p class="l-text">In this lesson we walk the document stack. We start with the classical pipeline — OCR (Tesseract, PaddleOCR, AWS Textract) followed by a parser — and its failure modes. We then cover the layout-aware family: <strong>LayoutLM</strong> (Microsoft, Dec 2019), <strong>LayoutLMv2/v3</strong> (2021/2022), <strong>LiLT</strong>, and <strong>StructuralLM</strong>. Next, the OCR-free wave: <strong>Donut</strong> (Kim et al., NAVER, Nov 2021) which skips OCR entirely; <strong>Pix2Struct</strong> (Lee et al., Google, Oct 2022) which reads screenshots and outputs HTML; <strong>Nougat</strong> (Meta, Aug 2023) for academic PDFs; and <strong>UDOP</strong> (Microsoft, 2023). We finish with frontier general-purpose VLMs (GPT-4o, Claude 3.5, Gemini 2.0, Qwen2-VL, InternVL 2.5) which are now competitive with specialized document models.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Identify when classical OCR + parser is enough, and when you need layout-aware or OCR-free models</li>
<li>Reconstruct LayoutLMv3's tri-modal pretraining (text + layout + pixels)</li>
<li>Understand Donut's OCR-free encoder-decoder approach and when it wins over OCR pipelines</li>
<li>Walk Pix2Struct's screenshot-parsing pretraining and its applications to UI / chart understanding</li>
<li>Build a toy document classifier using bounding boxes + text features</li>
<li>Evaluate document AI: DocVQA, FUNSD, CORD, ChartQA, InfographicVQA</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Classical OCR + Parser Pipeline</h2>
<p class="l-text">Before deep learning ate everything, the production document AI pipeline was four stages: image preprocessing, OCR, layout heuristics, and field extraction. It still ships in many enterprise products because it is debuggable, deterministic, and cheap.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Preprocessing</div><div class="card-body">Deskew, denoise, binarize, dewarp (for phone-photo receipts). OpenCV + classical morphology. Often the difference between 70% and 95% downstream accuracy.</div></div>
<div class="calc-card"><div class="card-title">OCR</div><div class="card-body">Tesseract (open-source, 100+ languages), PaddleOCR (Baidu, fast and competitive), AWS Textract, Google Document AI, Azure Form Recognizer. Outputs (text, bbox, confidence) per word or line.</div></div>
<div class="calc-card"><div class="card-title">Layout heuristics</div><div class="card-body">Group words into lines and blocks (geometric clustering). Detect tables (line detection or learned models like Table Transformer). Reading order (top-down for receipts, column-aware for newspapers).</div></div>
<div class="calc-card"><div class="card-title">Field extraction</div><div class="card-body">Regex for invoice numbers and dates. Key-value matching ("Total" → number to the right). Sometimes a small NER model. Hand-tuned per template; brittle outside the trained domain.</div></div>
</div>

<div class="calc-highlight"><strong>When the classical pipeline still wins:</strong> high-volume, narrow templates (one company's invoice format, processed millions of times) where 99% accuracy and per-document cost matter and you cannot afford GPU inference. When it loses: heterogeneous documents, low-resource languages, handwritten content, charts.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. LayoutLM Family — Text + Layout Pretraining</h2>
<p class="l-text">LayoutLM (Xu et al., Microsoft, KDD 2020) was the first large-scale pretrained model for documents. The insight: take a BERT-style masked language model, but condition every token embedding on its (x_min, y_min, x_max, y_max) bounding box on the page. Suddenly the model knows that "Total" near the bottom-right is more likely a key than the same word at the top of a paragraph.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">LayoutLM v1 (2019)</div><div class="card-body">BERT + 2D positional embeddings (x, y, w, h each get a learned embedding, summed with token+1D-position). Pretraining: masked visual-language modeling on IIT-CDIP (11M docs).</div></div>
<div class="calc-card"><div class="card-title">LayoutLMv2 (2021)</div><div class="card-body">Adds visual features: ResNeXt-FPN encodes the page image, image patch tokens are concatenated with text tokens. Spatial-aware self-attention biases. Pretraining adds image-text alignment and matching.</div></div>
<div class="calc-card"><div class="card-title">LayoutLMv3 (Apr 2022)</div><div class="card-body">Pure transformer (drops the ResNeXt). ViT-style image patches + word tokens. Three pretraining tasks: masked language modeling (MLM), masked image modeling (MIM), word-patch alignment (WPA). SOTA on FUNSD, CORD, RVL-CDIP, DocVQA at release.</div></div>
<div class="calc-card"><div class="card-title">LiLT (2022)</div><div class="card-body">"Language-independent Layout Transformer." Decouples language and layout pretraining so the layout side transfers across languages. Useful for non-English docs.</div></div>
</div>

<div class="katex-block">$$\\text{Embed}(t_i) = \\text{TokenEmb}(w_i) + \\text{PosEmb}(i) + \\text{XEmb}(x_i) + \\text{YEmb}(y_i) + \\text{WEmb}(w^{\\text{box}}_i) + \\text{HEmb}(h^{\\text{box}}_i)$$</div>

<p class="l-text">LayoutLM's token embedding is a sum of six pieces: token identity, sequence position, and four bounding-box coordinates. Each coordinate goes through its own learned embedding table (typically discretized to 1000 bins per page edge).</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Donut — Skip OCR Entirely</h2>
<p class="l-text">Donut (Kim et al., NAVER, ECCV 2022) made a radical bet: <em>delete the OCR step</em>. The argument: OCR is itself an error source, accumulates per-document, fragments downstream training, and adds engineering complexity. Why not train a single image-to-text encoder-decoder that reads the page and emits structured output directly?</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Architecture</div><div class="card-body">Swin Transformer encoder over the page image → BART decoder that emits a JSON-like structured string. Token-level autoregressive generation. End-to-end trainable.</div></div>
<div class="calc-card"><div class="card-title">Pretraining</div><div class="card-body">Synthetic + scraped docs, task: read the page and reproduce its text in reading order. Learns OCR-equivalent representations implicitly.</div></div>
<div class="calc-card"><div class="card-title">Fine-tuning tasks</div><div class="card-body">Document classification (RVL-CDIP), key-value extraction (CORD receipts), DocVQA. Outputs structured JSON directly: <code>{"menu":[{"nm":"Coke","price":"3"}],"total":"3"}</code>.</div></div>
<div class="calc-card"><div class="card-title">Trade-offs</div><div class="card-body"><strong>Pros:</strong> end-to-end, no OCR errors propagated, single model. <strong>Cons:</strong> harder to debug (what did it "read"?), needs more compute than text-only post-OCR, fine-tuning data must be in the target output format.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Pix2Struct, Nougat, UDOP — The 2022–2023 Frontier</h2>
<p class="l-text">Donut opened the door; several follow-ups specialized the OCR-free recipe.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pix2Struct (Lee et al., Google, Oct 2022)</div><div class="card-body">Pretrained on 80M screenshots paired with simplified HTML. Learns to "screenshot-to-DOM" — outputs structured HTML for arbitrary visual inputs. Strong on UI understanding, charts, infographics. Variable-resolution input via ViT with aspect-preserving resize.</div></div>
<div class="calc-card"><div class="card-title">Nougat (Meta, Aug 2023)</div><div class="card-body">"Neural Optical Understanding for Academic Documents." Donut-style architecture trained on arXiv PDFs paired with their LaTeX source. Outputs Markdown + LaTeX for math. The de-facto choice for parsing scientific PDFs.</div></div>
<div class="calc-card"><div class="card-title">UDOP (Microsoft, 2023)</div><div class="card-body">"Unifying Vision, Text, and Layout for Universal Document Processing." Single encoder over interleaved text/layout/pixel tokens, decoder that handles classification, extraction, generation, editing. Very general; swiss-army knife for documents.</div></div>
<div class="calc-card"><div class="card-title">DocOwl 1.5 / 2 (Alibaba 2024)</div><div class="card-body">Open-source MLLM specialized for documents. Multi-modal Q-Former + LLM. Strong on DocVQA and ChartQA. Apache-2.0.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The 2024 Disruption — General VLMs Beat Specialists</h2>
<p class="l-text">By 2024 something quietly stunning happened: frontier general-purpose VLMs caught up with and often surpassed document-specialized models on document benchmarks. Three factors: higher-resolution visual encoders (LLaVA-Next AnyRes, Qwen2-VL native dynamic resolution), inclusion of document/chart instruction data in pretraining, and stronger LLM backbones doing the reasoning.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DocVQA leaderboard (late 2024)</div><div class="card-body">GPT-4o ~92% ANLS. Claude 3.5 Sonnet ~92%. Qwen2-VL-72B ~96%. InternVL 2.5 ~94%. LayoutLMv3 (specialized) ~85%. Donut ~67%. Generalists won.</div></div>
<div class="calc-card"><div class="card-title">When specialists still win</div><div class="card-body">Latency-sensitive enterprise (LayoutLMv3 is 184M params, runs on CPU). Air-gapped deployments where you cannot use GPT-4o. Highly templated workflows where fine-tuning a small model is cheaper than prompt-engineering a 72B model.</div></div>
<div class="calc-card"><div class="card-title">When generalists win</div><div class="card-body">Heterogeneous docs (mix of receipts, contracts, charts). Tasks requiring reasoning beyond extraction. Low-resource languages (general VLMs trained on multilingual text are robust). When you do not have labeled data — zero-shot prompting works.</div></div>
<div class="calc-card"><div class="card-title">Hybrid (production 2026)</div><div class="card-body">Cheap, fast specialist (Donut or layout model) for the 80% common case; route hard cases to a frontier VLM. Logged for fine-tuning the specialist later.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hands-On — Layout-Aware Field Extraction</h2>
<p class="l-text">A toy version of LayoutLM-style classification: given OCR-extracted (text, bbox) tuples from a synthetic document, classify each token as one of {key, value, other}. The bounding-box features are what carry the layout signal.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — real LayoutLMv3)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Real LayoutLMv3 fine-tune for token classification — Pyodide-blocked</span>
<span class="kw">from</span> transformers <span class="kw">import</span> LayoutLMv3Processor, LayoutLMv3ForTokenClassification
<span class="kw">from</span> PIL <span class="kw">import</span> Image
<span class="kw">import</span> torch

proc  = LayoutLMv3Processor.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/layoutlmv3-base"</span>, apply_ocr=<span class="kw">True</span>)
model = LayoutLMv3ForTokenClassification.<span class="fn">from_pretrained</span>(
    <span class="str">"nielsr/layoutlmv3-finetuned-funsd"</span>
)
img = Image.<span class="fn">open</span>(<span class="str">"invoice.png"</span>).<span class="fn">convert</span>(<span class="str">"RGB"</span>)
inp = <span class="fn">proc</span>(img, return_tensors=<span class="str">"pt"</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    logits = <span class="fn">model</span>(**inp).logits
labels = logits.<span class="fn">argmax</span>(-<span class="num">1</span>)[<span class="num">0</span>]
<span class="kw">for</span> token, label_id <span class="kw">in</span> <span class="fn">zip</span>(inp.<span class="fn">tokens</span>(), labels):
    <span class="fn">print</span>(f<span class="str">"{token:20s} -> {model.config.id2label[label_id.item()]}"</span>)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A LogisticRegression on (TF-IDF text) + (bbox features) over a synthetic invoice. The model learns that "Total" + bbox.right is a key; numeric tokens to the right are values; everything else is "other".</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> re
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> hstack, csr_matrix

<span class="cm"># Synthetic OCR output: list of (text, x_min, y_min, x_max, y_max) per "page"</span>
<span class="kw">def</span> <span class="fn">synth_doc</span>(seed):
    rng = np.random.<span class="fn">RandomState</span>(seed)
    rows = []
    fields = [(<span class="str">"Invoice"</span>, <span class="str">"INV-"</span> + <span class="fn">str</span>(rng.<span class="fn">randint</span>(<span class="num">1000</span>,<span class="num">9999</span>))),
              (<span class="str">"Date"</span>,    <span class="str">"2026-05-04"</span>),
              (<span class="str">"Total"</span>,   <span class="str">"$"</span> + <span class="fn">str</span>(rng.<span class="fn">randint</span>(<span class="num">50</span>, <span class="num">500</span>)) + <span class="str">".00"</span>)]
    <span class="kw">for</span> i, (k, v) <span class="kw">in</span> <span class="fn">enumerate</span>(fields):
        y = <span class="num">100</span> + i * <span class="num">80</span>
        rows.<span class="fn">append</span>((k,    <span class="num">100</span>, y, <span class="num">200</span>, y+<span class="num">30</span>, <span class="str">"key"</span>))
        rows.<span class="fn">append</span>((v,    <span class="num">400</span>, y, <span class="num">600</span>, y+<span class="num">30</span>, <span class="str">"value"</span>))
    <span class="cm"># add some noise tokens</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>):
        rows.<span class="fn">append</span>((rng.<span class="fn">choice</span>([<span class="str">"Hello"</span>,<span class="str">"Note"</span>,<span class="str">"Page"</span>,<span class="str">"From"</span>,<span class="str">"To"</span>]),
                     rng.<span class="fn">randint</span>(<span class="num">50</span>, <span class="num">700</span>), rng.<span class="fn">randint</span>(<span class="num">50</span>, <span class="num">700</span>),
                     rng.<span class="fn">randint</span>(<span class="num">700</span>, <span class="num">800</span>), rng.<span class="fn">randint</span>(<span class="num">800</span>, <span class="num">850</span>), <span class="str">"other"</span>))
    <span class="kw">return</span> rows

train = <span class="fn">sum</span>([<span class="fn">synth_doc</span>(s) <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>)], [])
test  = <span class="fn">sum</span>([<span class="fn">synth_doc</span>(s) <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>, <span class="num">25</span>)], [])

texts = [r[<span class="num">0</span>] <span class="kw">for</span> r <span class="kw">in</span> train]
boxes = np.<span class="fn">array</span>([[r[<span class="num">1</span>], r[<span class="num">2</span>], r[<span class="num">3</span>]-r[<span class="num">1</span>], r[<span class="num">4</span>]-r[<span class="num">2</span>]] <span class="kw">for</span> r <span class="kw">in</span> train], dtype=<span class="fn">float</span>)
boxes /= <span class="num">1000.0</span>   <span class="cm"># normalize to [0,1]</span>
labels = [r[<span class="num">5</span>] <span class="kw">for</span> r <span class="kw">in</span> train]

vec = <span class="fn">TfidfVectorizer</span>(token_pattern=r<span class="str">"\\S+"</span>).<span class="fn">fit</span>(texts)
T = vec.<span class="fn">transform</span>(texts)
X = <span class="fn">hstack</span>([T, <span class="fn">csr_matrix</span>(boxes)])

clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X, labels)
<span class="fn">print</span>(<span class="str">"Train acc:"</span>, clf.<span class="fn">score</span>(X, labels))

<span class="cm"># Evaluate</span>
t_texts = [r[<span class="num">0</span>] <span class="kw">for</span> r <span class="kw">in</span> test]
t_boxes = np.<span class="fn">array</span>([[r[<span class="num">1</span>], r[<span class="num">2</span>], r[<span class="num">3</span>]-r[<span class="num">1</span>], r[<span class="num">4</span>]-r[<span class="num">2</span>]] <span class="kw">for</span> r <span class="kw">in</span> test], dtype=<span class="fn">float</span>) / <span class="num">1000.0</span>
t_labels = [r[<span class="num">5</span>] <span class="kw">for</span> r <span class="kw">in</span> test]
Xt = <span class="fn">hstack</span>([vec.<span class="fn">transform</span>(t_texts), <span class="fn">csr_matrix</span>(t_boxes)])
<span class="fn">print</span>(<span class="str">"Test acc :"</span>, clf.<span class="fn">score</span>(Xt, t_labels))

<span class="cm"># Show a few predictions</span>
preds = clf.<span class="fn">predict</span>(Xt)
<span class="kw">for</span> tok, lbl, pr <span class="kw">in</span> <span class="fn">list</span>(<span class="fn">zip</span>(t_texts, t_labels, preds))[:<span class="num">6</span>]:
    <span class="fn">print</span>(f<span class="str">"  {tok:20s} true={lbl:6s} pred={pr}"</span>)
</code></pre></div>
</div>

<p class="l-text">A second pass — pure regex extraction of tables — shows the classical-pipeline angle on the same data. In production you would use both: layout-classify each token, then regex-validate the values.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re

<span class="cm"># Synthetic invoice as a multi-line string (post-OCR)</span>
doc = <span class="str">"""ACME Corp
Invoice INV-7421     Date 2026-05-04
Item            Qty   Price    Subtotal
Widget Pro      2     45.00    90.00
Gadget Lite     1     30.00    30.00
Service Fee     1     12.50    12.50
                              -------
                       Total   132.50
"""</span>

<span class="cm"># 1. Extract header fields</span>
inv = re.<span class="fn">search</span>(r<span class="str">"Invoice\\s+(\\S+)"</span>, doc).<span class="fn">group</span>(<span class="num">1</span>)
date = re.<span class="fn">search</span>(r<span class="str">"Date\\s+(\\d{4}-\\d{2}-\\d{2})"</span>, doc).<span class="fn">group</span>(<span class="num">1</span>)
total = re.<span class="fn">search</span>(r<span class="str">"Total\\s+([\\d.]+)"</span>, doc).<span class="fn">group</span>(<span class="num">1</span>)

<span class="cm"># 2. Extract line-items table — fixed-position parse using whitespace</span>
rows = []
<span class="kw">for</span> line <span class="kw">in</span> doc.<span class="fn">splitlines</span>():
    m = re.<span class="kw">match</span>(r<span class="str">"^([A-Za-z][A-Za-z ]+?)\\s{2,}(\\d+)\\s+([\\d.]+)\\s+([\\d.]+)$"</span>, line)
    <span class="kw">if</span> m: rows.<span class="fn">append</span>({<span class="str">"item"</span>: m.<span class="fn">group</span>(<span class="num">1</span>).<span class="fn">strip</span>(), <span class="str">"qty"</span>: <span class="fn">int</span>(m.<span class="fn">group</span>(<span class="num">2</span>)),
                       <span class="str">"price"</span>: <span class="fn">float</span>(m.<span class="fn">group</span>(<span class="num">3</span>)), <span class="str">"sub"</span>: <span class="fn">float</span>(m.<span class="fn">group</span>(<span class="num">4</span>))})

<span class="fn">print</span>(f<span class="str">"Invoice: {inv}, Date: {date}, Total: {total}"</span>)
<span class="fn">print</span>(f<span class="str">"Sum of subtotals: {sum(r['sub'] for r in rows)}"</span>)
<span class="fn">print</span>(f<span class="str">"Match check: {abs(sum(r['sub'] for r in rows) - float(total)) < 0.01}"</span>)
</code></pre></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Document AI Benchmarks</h2>
<p class="l-text">Knowing which benchmark to optimize tells you which architecture to pick.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DocVQA</div><div class="card-body">Mathew et al. 2020. Q&amp;A over scanned documents. ANLS metric (edit distance). The headline document benchmark. SOTA: ~96% (Qwen2-VL-72B), human ~98%.</div></div>
<div class="calc-card"><div class="card-title">FUNSD</div><div class="card-body">Form Understanding in Noisy Scanned Documents. 199 forms, token-level (header/question/answer/other) labels. Smaller and noisier; LayoutLMv3 ~92% F1.</div></div>
<div class="calc-card"><div class="card-title">CORD</div><div class="card-body">Consolidated Receipt Dataset. ~1K Indonesian receipts with structured key-value annotations. Donut SOTA ~91% Tree Edit Distance.</div></div>
<div class="calc-card"><div class="card-title">ChartQA / InfographicVQA / DocLayNet</div><div class="card-body">Charts (visual reasoning + math), infographics (long-form mixed visuals), layout segmentation respectively. ChartQA is brutal — humans 87%, frontier VLMs ~80%.</div></div>
<div class="calc-card"><div class="card-title">RVL-CDIP</div><div class="card-body">Document image classification — 16 classes (letter, form, email, scientific paper, ...). 400K images. LayoutLMv3 ~95% accuracy.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">Document AI is the multimodal subfield where layout and pixels matter as much as text. The classical OCR + parser pipeline is still alive in narrow templated workflows. Layout-aware pretraining (LayoutLMv3, LiLT, UDOP) and OCR-free encoder-decoders (Donut, Pix2Struct, Nougat) dominated 2020–2023. By 2024 frontier general-purpose VLMs caught up; specialists keep their edge in latency, cost, and air-gapped deployment.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Documents = text + layout + pixels. Vanilla LLMs and vanilla VLMs each lose one or two of these.</li>
<li>LayoutLM family: BERT + 2D positional embeddings + image patches + tri-modal pretraining.</li>
<li>Donut (OCR-free): Swin → BART, end-to-end image-to-structured-text. Eliminates OCR error propagation.</li>
<li>Pix2Struct (screenshots → HTML), Nougat (PDF → Markdown+LaTeX), UDOP (universal document model).</li>
<li>2024 generalist VLMs (GPT-4o, Claude 3.5, Qwen2-VL, InternVL 2.5) match or beat specialists on most benchmarks.</li>
<li>Pick by deployment constraints: specialist for cheap+fast+narrow, generalist for flexible+zero-shot+heterogeneous.</li>
</ul>
</div>

<p class="l-text">In <strong>multimodal-L7</strong> we flip from understanding to generation: DALL-E 3, Imagen 3, Sora, Veo 2, Suno, MusicGen, AudioCraft. The same patch / token / cross-attention machinery that lets models <em>read</em> multimodal data lets them <em>produce</em> it.</p>
</div>`,
tr: `<p class="l-text"><strong>Belgeler, multimodal yapay zeka için ana uygulamadır.</strong> Bir makbuz, bir fatura, bir vergi formu, bir bilimsel PDF, bir tıbbi kayıt — bunların hiçbiri saf metin değildir ve hiçbiri saf görüntü değildir. Bunlar <em>yapılandırılmış düzenler</em>dir: anlamı sayfada nerede oturduğuna, hangi yazı tipi ve yazı tipi ağırlıklarının onları çevrelediğine, hangi tablo sütununa ait olduklarına, hangi onay kutusunun yanında yaşadıklarına bağlı olan token'lar. Bir makbuzun OCR dizesini okuyan sıradan bir LLM her uzamsal ipucunu kaybeder ve rutin olarak toplamları yanlış okur. Sıradan bir görü modeli pikselleri görür ama "FATURA NUMARASI"nın değeri iki santimetre sağda olan bir anahtar olduğunu bilmez. Belge AI alt alanı tam olarak bunu düzeltmek için ortaya çıktı: tek bir mimaride metni, düzeni ve pikselleri kaynaştıran modeller.</p>

<p class="l-text">Bu derste belge yığınını yürüyoruz. Klasik hat ile başlıyoruz — OCR (Tesseract, PaddleOCR, AWS Textract) ardından bir ayrıştırıcı — ve arıza modları. Ardından düzen-farkındalıklı aileyi işliyoruz: <strong>LayoutLM</strong> (Microsoft, Ara 2019), <strong>LayoutLMv2/v3</strong> (2021/2022), <strong>LiLT</strong> ve <strong>StructuralLM</strong>. Sonra OCR-bağımsız dalga: <strong>Donut</strong> (Kim vd., NAVER, Kas 2021) tamamen OCR'yi atlar; <strong>Pix2Struct</strong> (Lee vd., Google, Eki 2022) ekran görüntüleri okur ve HTML çıkarır; akademik PDF'ler için <strong>Nougat</strong> (Meta, Ağu 2023); ve <strong>UDOP</strong> (Microsoft, 2023). Belge benchmarklarında uzmanlaşmış modellere artık rakip olan öncü genel amaçlı VLM'lerle (GPT-4o, Claude 3.5, Gemini 2.0, Qwen2-VL, InternVL 2.5) bitiriyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Klasik OCR + ayrıştırıcının yeterli olduğu ve düzen-farkındalıklı veya OCR-bağımsız modellere ihtiyaç duyduğunuz zamanı tanımak</li>
<li>LayoutLMv3'ün üç-modlu ön-eğitimini yeniden inşa etmek (metin + düzen + pikseller)</li>
<li>Donut'un OCR-bağımsız kodlayıcı-kod çözücü yaklaşımını ve OCR hatları üzerine ne zaman kazandığını anlamak</li>
<li>Pix2Struct'ın ekran-görüntüsü-ayrıştırma ön-eğitimini ve UI / grafik anlamaya uygulamalarını yürümek</li>
<li>Sınırlayıcı kutular + metin öznitelikleri kullanarak oyuncak bir belge sınıflandırıcı inşa etmek</li>
<li>Belge AI'yi değerlendirmek: DocVQA, FUNSD, CORD, ChartQA, InfographicVQA</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Klasik OCR + Ayrıştırıcı Hattı</h2>
<p class="l-text">Derin öğrenme her şeyi yemeden önce, üretim belge AI hattı dört aşamalıydı: görüntü ön-işleme, OCR, düzen sezgileri ve alan çıkarımı. Hata ayıklanabilir, deterministik ve ucuz olduğu için hala birçok kurumsal üründe sevkiyat ediyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ön-işleme</div><div class="card-body">Eğri düzeltme, gürültü temizleme, ikilileştirme, deformasyon düzeltme (telefon-fotoğraf makbuzları için). OpenCV + klasik morfoloji. Genellikle aşağı akış %70 ve %95 doğruluğu arasındaki fark.</div></div>
<div class="calc-card"><div class="card-title">OCR</div><div class="card-body">Tesseract (açık kaynak, 100+ dil), PaddleOCR (Baidu, hızlı ve rekabetçi), AWS Textract, Google Document AI, Azure Form Recognizer. Kelime veya satır başına (metin, sınırlayıcı kutu, güven) çıkarır.</div></div>
<div class="calc-card"><div class="card-title">Düzen sezgileri</div><div class="card-body">Kelimeleri satırlara ve bloklara grupla (geometrik kümeleme). Tabloları tespit et (çizgi tespiti veya Table Transformer gibi öğrenilmiş modeller). Okuma sırası (makbuzlar için yukarıdan aşağı, gazeteler için sütun-farkındalıklı).</div></div>
<div class="calc-card"><div class="card-title">Alan çıkarımı</div><div class="card-body">Fatura numaraları ve tarihler için regex. Anahtar-değer eşleştirme ("Toplam" → sağdaki sayı). Bazen küçük bir NER modeli. Şablon başına elle ayarlı; eğitilen alan dışında kırılgan.</div></div>
</div>

<div class="calc-highlight"><strong>Klasik hat hala ne zaman kazanır:</strong> %99 doğruluk ve belge başına maliyetin önemli olduğu ve GPU çıkarımını karşılayamadığınız yüksek hacimli, dar şablonlar (bir şirketin fatura formatı, milyonlarca kez işlenir). Ne zaman kaybeder: heterojen belgeler, düşük-kaynaklı diller, el yazısı içerik, grafikler.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. LayoutLM Ailesi — Metin + Düzen Ön-Eğitimi</h2>
<p class="l-text">LayoutLM (Xu vd., Microsoft, KDD 2020) belgeler için ilk büyük ölçekli ön-eğitilmiş modeldi. İçgörü: BERT-tarzı maskelenmiş dil modelini al, ama her token gömmesini sayfadaki (x_min, y_min, x_max, y_max) sınırlayıcı kutusuna koşullandır. Birden, model alttaki sağdaki "Toplam"ın bir paragrafın üst kısmındaki aynı kelimeden anahtar olma olasılığının daha yüksek olduğunu bilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">LayoutLM v1 (2019)</div><div class="card-body">BERT + 2D pozisyonel gömmeler (x, y, w, h her biri öğrenilmiş bir gömme alır, token+1D-pozisyonla toplanır). Ön-eğitim: IIT-CDIP'te (11M belge) maskelenmiş görsel-dil modelleme.</div></div>
<div class="calc-card"><div class="card-title">LayoutLMv2 (2021)</div><div class="card-body">Görsel öznitelikleri ekler: ResNeXt-FPN sayfa görüntüsünü kodlar, görüntü yama token'ları metin token'larıyla birleştirilir. Uzamsal-farkındalıklı öz-dikkat önyargıları. Ön-eğitim görüntü-metin hizalaması ve eşleştirmesini ekler.</div></div>
<div class="calc-card"><div class="card-title">LayoutLMv3 (Nis 2022)</div><div class="card-body">Saf transformer (ResNeXt'i atar). ViT-tarzı görüntü yamaları + kelime token'ları. Üç ön-eğitim görevi: maskelenmiş dil modelleme (MLM), maskelenmiş görüntü modelleme (MIM), kelime-yama hizalaması (WPA). Yayında FUNSD, CORD, RVL-CDIP, DocVQA'da SOTA.</div></div>
<div class="calc-card"><div class="card-title">LiLT (2022)</div><div class="card-body">"Language-independent Layout Transformer." Düzen tarafının diller arası transferi için dil ve düzen ön-eğitimini ayrıştırır. İngilizce olmayan belgeler için yararlıdır.</div></div>
</div>

<div class="katex-block">$$\\text{Embed}(t_i) = \\text{TokenEmb}(w_i) + \\text{PosEmb}(i) + \\text{XEmb}(x_i) + \\text{YEmb}(y_i) + \\text{WEmb}(w^{\\text{box}}_i) + \\text{HEmb}(h^{\\text{box}}_i)$$</div>

<p class="l-text">LayoutLM'in token gömmesi altı parçanın toplamıdır: token kimliği, dizi pozisyonu ve dört sınırlayıcı kutu koordinatı. Her koordinat kendi öğrenilmiş gömme tablosundan geçer (tipik olarak sayfa kenarı başına 1000 kutucuğa ayrıklaştırılır).</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Donut — OCR'yi Tamamen Atla</h2>
<p class="l-text">Donut (Kim vd., NAVER, ECCV 2022) radikal bir bahis yaptı: <em>OCR adımını sil</em>. Argüman: OCR'nin kendisi bir hata kaynağıdır, belge başına biriktirir, aşağı akış eğitimini parçalar ve mühendislik karmaşıklığı ekler. Neden sayfayı okuyup yapılandırılmış çıktıyı doğrudan yayan tek bir görüntüden-metne kodlayıcı-kod çözücü eğitmiyorsunuz?</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mimari</div><div class="card-body">Sayfa görüntüsü üzerinde Swin Transformer kodlayıcısı → JSON-benzeri yapılandırılmış bir dize yayan BART kod çözücüsü. Token-seviyesi özyineli üretim. Uçtan uca eğitilebilir.</div></div>
<div class="calc-card"><div class="card-title">Ön-eğitim</div><div class="card-body">Sentetik + kazınmış belgeler, görev: sayfayı oku ve metnini okuma sırasında yeniden üret. OCR-eşdeğeri temsilleri örtük olarak öğrenir.</div></div>
<div class="calc-card"><div class="card-title">İnce ayar görevleri</div><div class="card-body">Belge sınıflandırması (RVL-CDIP), anahtar-değer çıkarımı (CORD makbuzları), DocVQA. Yapılandırılmış JSON'ı doğrudan çıkarır: <code>{"menu":[{"nm":"Coke","price":"3"}],"total":"3"}</code>.</div></div>
<div class="calc-card"><div class="card-title">Dengeler</div><div class="card-body"><strong>Avantajlar:</strong> uçtan uca, OCR hataları yayılmaz, tek model. <strong>Dezavantajlar:</strong> hata ayıklamak daha zor (ne "okudu"?), metin-yalnız OCR-sonrasından daha çok hesaplama gerekir, ince ayar verisi hedef çıktı formatında olmalıdır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Pix2Struct, Nougat, UDOP — 2022–2023 Öncüsü</h2>
<p class="l-text">Donut kapıyı açtı; birkaç takipçi OCR-bağımsız tarifi uzmanlaştırdı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pix2Struct (Lee vd., Google, Eki 2022)</div><div class="card-body">Basitleştirilmiş HTML ile eşleştirilmiş 80M ekran görüntüsünde ön-eğitildi. "Ekran görüntüsünden DOM'a" öğrenir — keyfi görsel girdiler için yapılandırılmış HTML çıkarır. UI anlama, grafikler, infografiklerde güçlü. ViT ile en-boy-koruyan yeniden boyutlandırma aracılığıyla değişken çözünürlüklü girdi.</div></div>
<div class="calc-card"><div class="card-title">Nougat (Meta, Ağu 2023)</div><div class="card-body">"Neural Optical Understanding for Academic Documents." LaTeX kaynaklarıyla eşleştirilmiş arXiv PDF'leri üzerinde eğitilen Donut-tarzı mimari. Matematik için Markdown + LaTeX çıkarır. Bilimsel PDF'leri ayrıştırmak için fiili seçim.</div></div>
<div class="calc-card"><div class="card-title">UDOP (Microsoft, 2023)</div><div class="card-body">"Unifying Vision, Text, and Layout for Universal Document Processing." Serpiştirilmiş metin/düzen/piksel token'ları üzerinde tek kodlayıcı, sınıflandırma, çıkarım, üretim, düzenlemeyi ele alan kod çözücü. Çok genel; belgeler için İsviçre çakısı.</div></div>
<div class="calc-card"><div class="card-title">DocOwl 1.5 / 2 (Alibaba 2024)</div><div class="card-body">Belgeler için uzmanlaşmış açık kaynak MLLM. Çok-modlu Q-Former + LLM. DocVQA ve ChartQA'da güçlü. Apache-2.0.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. 2024 Yıkımı — Genel VLM'ler Uzmanları Yener</h2>
<p class="l-text">2024'e kadar sessizce çarpıcı bir şey oldu: öncü genel amaçlı VLM'ler belge benchmarklarında belge-uzmanlaşmış modelleri yakaladı ve sıklıkla geçti. Üç faktör: daha yüksek çözünürlüklü görsel kodlayıcılar (LLaVA-Next AnyRes, Qwen2-VL yerel dinamik çözünürlük), ön-eğitimde belge/grafik talimat verisinin dahil edilmesi ve akıl yürütmeyi yapan daha güçlü LLM omurgaları.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DocVQA lider tablosu (2024 sonu)</div><div class="card-body">GPT-4o ~%92 ANLS. Claude 3.5 Sonnet ~%92. Qwen2-VL-72B ~%96. InternVL 2.5 ~%94. LayoutLMv3 (uzmanlaşmış) ~%85. Donut ~%67. Genelciler kazandı.</div></div>
<div class="calc-card"><div class="card-title">Uzmanlar hala ne zaman kazanır</div><div class="card-body">Gecikmeye duyarlı kurumsal (LayoutLMv3 184M parametredir, CPU'da çalışır). GPT-4o kullanamadığınız hava-boşluklu dağıtımlar. Küçük bir modeli ince ayarlamanın 72B modelinin prompt-mühendisliğinden daha ucuz olduğu yüksek şablonlu iş akışları.</div></div>
<div class="calc-card"><div class="card-title">Genelciler ne zaman kazanır</div><div class="card-body">Heterojen belgeler (makbuzlar, sözleşmeler, grafikler karışımı). Çıkarımın ötesinde akıl yürütme gerektiren görevler. Düşük-kaynaklı diller (çok dilli metinde eğitilen genel VLM'ler dayanıklıdır). Etiketli verisi olmadığında — zero-shot prompting çalışır.</div></div>
<div class="calc-card"><div class="card-title">Hibrit (üretim 2026)</div><div class="card-body">Yaygın %80 durumu için ucuz, hızlı uzman (Donut veya düzen modeli); zor durumları öncü VLM'ye yönlendir. Daha sonra uzmanı ince ayarlamak için kaydedildi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Uygulama — Düzen-Farkındalıklı Alan Çıkarımı</h2>
<p class="l-text">LayoutLM-tarzı sınıflandırmanın oyuncak versiyonu: sentetik bir belgeden OCR-çıkarılmış (metin, sınırlayıcı kutu) demetleri verildiğinde, her token'ı {anahtar, değer, diğer} olarak sınıflandır. Sınırlayıcı kutu öznitelikleri düzen sinyalini taşıyandır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — gerçek LayoutLMv3)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Token siniflandirmasi icin gercek LayoutLMv3 ince ayar — Pyodide tarafindan engellendi</span>
<span class="kw">from</span> transformers <span class="kw">import</span> LayoutLMv3Processor, LayoutLMv3ForTokenClassification
<span class="kw">from</span> PIL <span class="kw">import</span> Image
<span class="kw">import</span> torch

proc  = LayoutLMv3Processor.<span class="fn">from_pretrained</span>(<span class="str">"microsoft/layoutlmv3-base"</span>, apply_ocr=<span class="kw">True</span>)
model = LayoutLMv3ForTokenClassification.<span class="fn">from_pretrained</span>(
    <span class="str">"nielsr/layoutlmv3-finetuned-funsd"</span>
)
img = Image.<span class="fn">open</span>(<span class="str">"invoice.png"</span>).<span class="fn">convert</span>(<span class="str">"RGB"</span>)
inp = <span class="fn">proc</span>(img, return_tensors=<span class="str">"pt"</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    logits = <span class="fn">model</span>(**inp).logits
labels = logits.<span class="fn">argmax</span>(-<span class="num">1</span>)[<span class="num">0</span>]
<span class="kw">for</span> token, label_id <span class="kw">in</span> <span class="fn">zip</span>(inp.<span class="fn">tokens</span>(), labels):
    <span class="fn">print</span>(f<span class="str">"{token:20s} -> {model.config.id2label[label_id.item()]}"</span>)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sentetik bir fatura üzerinde (TF-IDF metin) + (sınırlayıcı kutu öznitelikleri) üzerinde bir LogisticRegression. Model, "Total" + bbox.right'in bir anahtar olduğunu öğrenir; sağdaki sayısal token'lar değerdir; geri kalan her şey "diğer"dir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> re
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> hstack, csr_matrix

<span class="cm"># Sentetik OCR ciktisi: "sayfa" basina (metin, x_min, y_min, x_max, y_max) listesi</span>
<span class="kw">def</span> <span class="fn">synth_doc</span>(seed):
    rng = np.random.<span class="fn">RandomState</span>(seed)
    rows = []
    fields = [(<span class="str">"Invoice"</span>, <span class="str">"INV-"</span> + <span class="fn">str</span>(rng.<span class="fn">randint</span>(<span class="num">1000</span>,<span class="num">9999</span>))),
              (<span class="str">"Date"</span>,    <span class="str">"2026-05-04"</span>),
              (<span class="str">"Total"</span>,   <span class="str">"$"</span> + <span class="fn">str</span>(rng.<span class="fn">randint</span>(<span class="num">50</span>, <span class="num">500</span>)) + <span class="str">".00"</span>)]
    <span class="kw">for</span> i, (k, v) <span class="kw">in</span> <span class="fn">enumerate</span>(fields):
        y = <span class="num">100</span> + i * <span class="num">80</span>
        rows.<span class="fn">append</span>((k,    <span class="num">100</span>, y, <span class="num">200</span>, y+<span class="num">30</span>, <span class="str">"key"</span>))
        rows.<span class="fn">append</span>((v,    <span class="num">400</span>, y, <span class="num">600</span>, y+<span class="num">30</span>, <span class="str">"value"</span>))
    <span class="cm"># birkac gurultu tokeni ekle</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>):
        rows.<span class="fn">append</span>((rng.<span class="fn">choice</span>([<span class="str">"Hello"</span>,<span class="str">"Note"</span>,<span class="str">"Page"</span>,<span class="str">"From"</span>,<span class="str">"To"</span>]),
                     rng.<span class="fn">randint</span>(<span class="num">50</span>, <span class="num">700</span>), rng.<span class="fn">randint</span>(<span class="num">50</span>, <span class="num">700</span>),
                     rng.<span class="fn">randint</span>(<span class="num">700</span>, <span class="num">800</span>), rng.<span class="fn">randint</span>(<span class="num">800</span>, <span class="num">850</span>), <span class="str">"other"</span>))
    <span class="kw">return</span> rows

train = <span class="fn">sum</span>([<span class="fn">synth_doc</span>(s) <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>)], [])
test  = <span class="fn">sum</span>([<span class="fn">synth_doc</span>(s) <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>, <span class="num">25</span>)], [])

texts = [r[<span class="num">0</span>] <span class="kw">for</span> r <span class="kw">in</span> train]
boxes = np.<span class="fn">array</span>([[r[<span class="num">1</span>], r[<span class="num">2</span>], r[<span class="num">3</span>]-r[<span class="num">1</span>], r[<span class="num">4</span>]-r[<span class="num">2</span>]] <span class="kw">for</span> r <span class="kw">in</span> train], dtype=<span class="fn">float</span>)
boxes /= <span class="num">1000.0</span>   <span class="cm"># [0,1] araligina normalize et</span>
labels = [r[<span class="num">5</span>] <span class="kw">for</span> r <span class="kw">in</span> train]

vec = <span class="fn">TfidfVectorizer</span>(token_pattern=r<span class="str">"\\S+"</span>).<span class="fn">fit</span>(texts)
T = vec.<span class="fn">transform</span>(texts)
X = <span class="fn">hstack</span>([T, <span class="fn">csr_matrix</span>(boxes)])

clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X, labels)
<span class="fn">print</span>(<span class="str">"Egitim dogr:"</span>, clf.<span class="fn">score</span>(X, labels))

<span class="cm"># Degerlendir</span>
t_texts = [r[<span class="num">0</span>] <span class="kw">for</span> r <span class="kw">in</span> test]
t_boxes = np.<span class="fn">array</span>([[r[<span class="num">1</span>], r[<span class="num">2</span>], r[<span class="num">3</span>]-r[<span class="num">1</span>], r[<span class="num">4</span>]-r[<span class="num">2</span>]] <span class="kw">for</span> r <span class="kw">in</span> test], dtype=<span class="fn">float</span>) / <span class="num">1000.0</span>
t_labels = [r[<span class="num">5</span>] <span class="kw">for</span> r <span class="kw">in</span> test]
Xt = <span class="fn">hstack</span>([vec.<span class="fn">transform</span>(t_texts), <span class="fn">csr_matrix</span>(t_boxes)])
<span class="fn">print</span>(<span class="str">"Test dogr :"</span>, clf.<span class="fn">score</span>(Xt, t_labels))

<span class="cm"># Birkac tahmini goster</span>
preds = clf.<span class="fn">predict</span>(Xt)
<span class="kw">for</span> tok, lbl, pr <span class="kw">in</span> <span class="fn">list</span>(<span class="fn">zip</span>(t_texts, t_labels, preds))[:<span class="num">6</span>]:
    <span class="fn">print</span>(f<span class="str">"  {tok:20s} gercek={lbl:6s} tahm={pr}"</span>)
</code></pre></div>
</div>

<p class="l-text">İkinci geçiş — tabloların saf regex çıkarımı — aynı verideki klasik-hat açısını gösterir. Üretimde her ikisini de kullanırsınız: her token'ı düzen-sınıflandır, sonra değerleri regex-doğrula.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re

<span class="cm"># Cok satirli bir dize olarak sentetik fatura (OCR-sonrasi)</span>
doc = <span class="str">"""ACME Corp
Invoice INV-7421     Date 2026-05-04
Item            Qty   Price    Subtotal
Widget Pro      2     45.00    90.00
Gadget Lite     1     30.00    30.00
Service Fee     1     12.50    12.50
                              -------
                       Total   132.50
"""</span>

<span class="cm"># 1. Baslik alanlarini cikar</span>
inv = re.<span class="fn">search</span>(r<span class="str">"Invoice\\s+(\\S+)"</span>, doc).<span class="fn">group</span>(<span class="num">1</span>)
date = re.<span class="fn">search</span>(r<span class="str">"Date\\s+(\\d{4}-\\d{2}-\\d{2})"</span>, doc).<span class="fn">group</span>(<span class="num">1</span>)
total = re.<span class="fn">search</span>(r<span class="str">"Total\\s+([\\d.]+)"</span>, doc).<span class="fn">group</span>(<span class="num">1</span>)

<span class="cm"># 2. Satir-ogeleri tablosunu cikar — bosluk kullanan sabit-konum ayrastirma</span>
rows = []
<span class="kw">for</span> line <span class="kw">in</span> doc.<span class="fn">splitlines</span>():
    m = re.<span class="kw">match</span>(r<span class="str">"^([A-Za-z][A-Za-z ]+?)\\s{2,}(\\d+)\\s+([\\d.]+)\\s+([\\d.]+)$"</span>, line)
    <span class="kw">if</span> m: rows.<span class="fn">append</span>({<span class="str">"item"</span>: m.<span class="fn">group</span>(<span class="num">1</span>).<span class="fn">strip</span>(), <span class="str">"qty"</span>: <span class="fn">int</span>(m.<span class="fn">group</span>(<span class="num">2</span>)),
                       <span class="str">"price"</span>: <span class="fn">float</span>(m.<span class="fn">group</span>(<span class="num">3</span>)), <span class="str">"sub"</span>: <span class="fn">float</span>(m.<span class="fn">group</span>(<span class="num">4</span>))})

<span class="fn">print</span>(f<span class="str">"Fatura: {inv}, Tarih: {date}, Toplam: {total}"</span>)
<span class="fn">print</span>(f<span class="str">"Alt toplamlarin toplami: {sum(r['sub'] for r in rows)}"</span>)
<span class="fn">print</span>(f<span class="str">"Eslestirme kontrolu: {abs(sum(r['sub'] for r in rows) - float(total)) < 0.01}"</span>)
</code></pre></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Belge AI Benchmarkları</h2>
<p class="l-text">Hangi benchmark'i optimize edeceğinizi bilmek hangi mimariyi seçeceğinizi söyler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DocVQA</div><div class="card-body">Mathew vd. 2020. Taranmış belgeler üzerinde Q&amp;A. ANLS metriği (düzenleme mesafesi). Manşet belge benchmark'ı. SOTA: ~%96 (Qwen2-VL-72B), insan ~%98.</div></div>
<div class="calc-card"><div class="card-title">FUNSD</div><div class="card-body">Form Understanding in Noisy Scanned Documents. 199 form, token seviyesi (başlık/soru/cevap/diğer) etiketleri. Daha küçük ve gürültülü; LayoutLMv3 ~%92 F1.</div></div>
<div class="calc-card"><div class="card-title">CORD</div><div class="card-body">Consolidated Receipt Dataset. Yapılandırılmış anahtar-değer açıklamalı ~1K Endonezya makbuzu. Donut SOTA ~%91 Tree Edit Distance.</div></div>
<div class="calc-card"><div class="card-title">ChartQA / InfographicVQA / DocLayNet</div><div class="card-body">Sırasıyla grafikler (görsel akıl yürütme + matematik), infografikler (uzun-form karışık görseller), düzen segmentasyonu. ChartQA acımasızdır — insanlar %87, öncü VLM'ler ~%80.</div></div>
<div class="calc-card"><div class="card-title">RVL-CDIP</div><div class="card-body">Belge görüntüsü sınıflandırması — 16 sınıf (mektup, form, e-posta, bilimsel makale, ...). 400K görüntü. LayoutLMv3 ~%95 doğruluk.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sonraki</h2>
<p class="l-text">Belge AI, düzen ve piksellerin metin kadar önemli olduğu multimodal alt alandır. Klasik OCR + ayrıştırıcı hattı dar şablonlu iş akışlarında hala canlıdır. Düzen-farkındalıklı ön-eğitim (LayoutLMv3, LiLT, UDOP) ve OCR-bağımsız kodlayıcı-kod çözücüler (Donut, Pix2Struct, Nougat) 2020–2023'te baskın oldu. 2024'e kadar öncü genel amaçlı VLM'ler yetişti; uzmanlar gecikme, maliyet ve hava-boşluklu dağıtımda kenarlarını koruyor.</p>

<div class="calc-highlight"><strong>Önemli çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Belgeler = metin + düzen + pikseller. Sıradan LLM'ler ve sıradan VLM'ler bunlardan birini veya ikisini kaybeder.</li>
<li>LayoutLM ailesi: BERT + 2D pozisyonel gömmeler + görüntü yamaları + üç-modlu ön-eğitim.</li>
<li>Donut (OCR-bağımsız): Swin → BART, uçtan uca görüntüden-yapılandırılmış-metne. OCR hata yayılımını ortadan kaldırır.</li>
<li>Pix2Struct (ekran görüntüleri → HTML), Nougat (PDF → Markdown+LaTeX), UDOP (evrensel belge modeli).</li>
<li>2024 genelci VLM'ler (GPT-4o, Claude 3.5, Qwen2-VL, InternVL 2.5) çoğu benchmark'ta uzmanlarla eşleşir veya onları yener.</li>
<li>Dağıtım kısıtlamalarına göre seç: ucuz+hızlı+dar için uzman, esnek+zero-shot+heterojen için genelci.</li>
</ul>
</div>

<p class="l-text"><strong>multimodal-L7</strong>'de anlamadan üretime dönüyoruz: DALL-E 3, Imagen 3, Sora, Veo 2, Suno, MusicGen, AudioCraft. Modellere multimodal veriyi <em>okumaya</em> izin veren aynı yama / token / çapraz-dikkat mekanizması, onlara <em>üretmeye</em> de izin verir.</p>
</div>`
};
