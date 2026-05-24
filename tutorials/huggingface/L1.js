var HF_L1 = {
en: '<div class="calc-highlight">' +
'<h2 class="lesson-title">What is HuggingFace?</h2>' +
'<p class="l-text">HuggingFace is often called the <strong>GitHub of Machine Learning</strong> — a platform and open-source ecosystem that has fundamentally changed how the ML community shares, discovers, and uses pretrained models. Founded in 2016 and originally focused on chatbots, HuggingFace pivoted to become the central hub for transformer-based models, and today it hosts over 500,000 models, 100,000 datasets, and 150,000 ML demo applications.</p>' +
'<p class="l-text">The mission is simple but profound: <strong>democratize good machine learning</strong>. Before HuggingFace, using a state-of-the-art NLP model meant reading a research paper, hunting down author-released code (if it even existed), wrestling with different frameworks, and spending days just getting something to run. HuggingFace collapsed that entire process into a few lines of Python.</p>' +
'<p class="l-text">Today, HuggingFace is the de facto standard for NLP work in both industry and research. Companies like Google, Meta, Microsoft, and Amazon actively contribute to and use the ecosystem. For anyone doing NLP, understanding HuggingFace is not optional — it is the foundation everything else is built on.</p>' +
'</div>' +

'<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">' +
'<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>' +
'<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">' +
'<li>Identify the six core HuggingFace libraries: Transformers, Tokenizers, Datasets, Hub, Evaluate, Accelerate</li>' +
'<li>Install the stack with <code>pip install transformers[torch] datasets tokenizers</code> and verify the GPU</li>' +
'<li>Run sentiment, NER, summarization, and QA in 3 lines via the <code>pipeline()</code> API</li>' +
'<li>Load and explore models from the Hub with <code>AutoModel.from_pretrained</code></li>' +
'<li>Locate cached weights and manage disk usage at <code>~/.cache/huggingface/hub/</code></li>' +
'</ul>' +
'</div>' +

'<h2 class="lesson-title">The HuggingFace Ecosystem</h2>' +
'<p class="l-text">HuggingFace is not a single library — it is a tightly integrated ecosystem of libraries, each solving a specific part of the ML workflow. Understanding how they fit together is key to using them effectively.</p>' +
'<div class="calc-cards">' +
'<div class="calc-card">' +
'<div class="calc-card-title">🤗 Transformers</div>' +
'<div class="calc-card-body">The flagship library. Provides thousands of pretrained models for NLP, vision, audio, and multimodal tasks. Supports PyTorch, TensorFlow, and JAX. The core abstraction is the <code>PreTrainedModel</code> and its task-specific variants.</div>' +
'</div>' +
'<div class="calc-card">' +
'<div class="calc-card-title">⚡ Tokenizers</div>' +
'<div class="calc-card-body">A Rust-based tokenization library exposing a Python API. Handles BPE, WordPiece, SentencePiece, and Unigram tokenization with blazing speed. A single tokenizer can process gigabytes of text in seconds via multi-threading.</div>' +
'</div>' +
'<div class="calc-card">' +
'<div class="calc-card-title">📦 Datasets</div>' +
'<div class="calc-card-body">A memory-efficient library for loading, processing, and sharing datasets. Uses Apache Arrow for zero-copy reads. Supports streaming for datasets too large to fit in RAM. Access thousands of public datasets with a single function call.</div>' +
'</div>' +
'<div class="calc-card">' +
'<div class="calc-card-title">🌐 Hub</div>' +
'<div class="calc-card-body">The model and dataset hosting platform at huggingface.co. Provides version control (Git + Git LFS), model cards, inference widgets, and an API. Models are downloaded automatically on first use and cached locally.</div>' +
'</div>' +
'<div class="calc-card">' +
'<div class="calc-card-title">📊 Evaluate</div>' +
'<div class="calc-card-body">A unified library for evaluation metrics. Supports accuracy, F1, BLEU, ROUGE, BERTScore, and hundreds more. Integrates seamlessly with the Trainer API so you can define metrics once and have them computed automatically during training.</div>' +
'</div>' +
'<div class="calc-card">' +
'<div class="calc-card-title">🚀 Accelerate</div>' +
'<div class="calc-card-body">Abstracts the complexity of distributed training. Write your training loop once and run it on a single GPU, multiple GPUs, TPUs, or across multiple machines — with minimal code changes. Also handles mixed precision (fp16/bf16) transparently.</div>' +
'</div>' +
'</div>' +

'<h2 class="lesson-title">Installation</h2>' +
'<p class="l-text">Install the core libraries with pip. It is strongly recommended to use a virtual environment (conda or venv) to avoid dependency conflicts, especially between PyTorch and other packages.</p>' +
'<div class="code-wrap"><div class="code-label"><span>BASH</span> Install HuggingFace Libraries <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="cm"># Install core HuggingFace libraries</span>\n' +
'pip install transformers datasets tokenizers\n\n' +
'<span class="cm"># Install with PyTorch backend (recommended for most NLP tasks)</span>\n' +
'pip install transformers[torch] datasets tokenizers\n\n' +
'<span class="cm"># Install evaluate for metrics</span>\n' +
'pip install evaluate\n\n' +
'<span class="cm"># Install accelerate for distributed training</span>\n' +
'pip install accelerate\n\n' +
'<span class="cm"># Full install for fine-tuning (everything you need)</span>\n' +
'pip install transformers[torch] datasets tokenizers evaluate accelerate\n\n' +
'<span class="cm"># Verify installation</span>\n' +
'python -c <span class="str">"import transformers; print(transformers.__version__)"</span>' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Walking through the commands:</strong> 1) <code>pip install transformers datasets tokenizers</code> grabs the three pillars of the ecosystem. 2) The <code>transformers[torch]</code> extra pulls a matching PyTorch wheel so the model runtime is ready out of the box. 3) <code>evaluate</code> and <code>accelerate</code> add the metrics library and the distributed-training abstraction. 4) The final <code>python -c "import transformers; print(transformers.__version__)"</code> sanity-checks the install and prints the resolved version string.</p>' +
'<div class="l-note"><strong>GPU Setup:</strong> For GPU acceleration, install PyTorch with CUDA support first: <code>pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118</code> (adjust CUDA version to match your driver). Run <code>torch.cuda.is_available()</code> to confirm GPU is detected.</div>' +

'<h2 class="lesson-title">The Pipeline API — Your First HuggingFace Model</h2>' +
'<p class="l-text">The <code>pipeline()</code> function is the highest-level API in the Transformers library. It wraps the entire model inference workflow — downloading the model, loading weights, tokenizing input, running inference, and post-processing output — into a single callable object. For rapid prototyping, exploration, and production inference on standard tasks, pipelines are often all you need.</p>' +

'<h4>Sentiment Analysis</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Pipeline — Sentiment Analysis <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> pipeline\n\n' +
'<span class="cm"># Downloads distilbert-base-uncased-finetuned-sst-2-english on first run</span>\n' +
'<span class="cm"># (~268MB, cached at ~/.cache/huggingface/hub/)</span>\n' +
'classifier = <span class="fn">pipeline</span>(<span class="str">"sentiment-analysis"</span>)\n\n' +
'<span class="cm"># Single string input</span>\n' +
'result = <span class="fn">classifier</span>(<span class="str">"HuggingFace makes NLP incredibly accessible!"</span>)\n' +
'<span class="fn">print</span>(result)\n' +
'<span class="cm"># [{"label": "POSITIVE", "score": 0.9998}]</span>\n\n' +
'<span class="cm"># Batch input — much faster than calling one-by-one</span>\n' +
'results = <span class="fn">classifier</span>([\n' +
'    <span class="str">"I love this library!"</span>,\n' +
'    <span class="str">"This documentation is confusing."</span>,\n' +
'    <span class="str">"The model performance is acceptable."</span>\n' +
'])\n' +
'<span class="kw">for</span> result <span class="kw">in</span> results:\n' +
'    <span class="fn">print</span>(<span class="str">f"Label: {result[\'label\']}, Score: {result[\'score\']:.4f}"</span>)\n' +
'<span class="cm"># Label: POSITIVE, Score: 0.9998</span>\n' +
'<span class="cm"># Label: NEGATIVE, Score: 0.9987</span>\n' +
'<span class="cm"># Label: POSITIVE, Score: 0.8342</span>\n\n' +
'<span class="cm"># Specify a different model explicitly</span>\n' +
'classifier_multilingual = <span class="fn">pipeline</span>(\n' +
'    <span class="str">"sentiment-analysis"</span>,\n' +
'    model=<span class="str">"nlptown/bert-base-multilingual-uncased-sentiment"</span>\n' +
')' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>How this snippet runs:</strong> 1) <code>pipeline("sentiment-analysis")</code> resolves to the default DistilBERT SST-2 checkpoint and downloads ~268 MB to the local cache on first call. 2) Passing a single string returns a list with one dict containing <code>label</code> and <code>score</code>. 3) Passing a Python list triggers batched inference — the tokenizer pads to the longest sample and one forward pass handles all three reviews. 4) The explicit <code>model="nlptown/bert-base-multilingual-uncased-sentiment"</code> swap shows how a different checkpoint can be selected without touching any other line.</p>' +

'<h4>Named Entity Recognition (NER)</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Pipeline — Named Entity Recognition <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> pipeline\n\n' +
'ner = <span class="fn">pipeline</span>(<span class="str">"ner"</span>, aggregation_strategy=<span class="str">"simple"</span>)\n\n' +
'text = <span class="str">"Elon Musk founded SpaceX in 2002 and Tesla is headquartered in Austin, Texas."</span>\n' +
'entities = <span class="fn">ner</span>(text)\n\n' +
'<span class="kw">for</span> entity <span class="kw">in</span> entities:\n' +
'    <span class="fn">print</span>(<span class="str">f"{entity[\'word\']:20} → {entity[\'entity_group\']:5} ({entity[\'score\']:.3f})"</span>)\n' +
'<span class="cm"># Elon Musk            → PER   (0.999)</span>\n' +
'<span class="cm"># SpaceX               → ORG   (0.998)</span>\n' +
'<span class="cm"># 2002                 → DATE  (0.821)</span>\n' +
'<span class="cm"># Tesla                → ORG   (0.997)</span>\n' +
'<span class="cm"># Austin               → LOC   (0.995)</span>\n' +
'<span class="cm"># Texas                → LOC   (0.993)</span>\n\n' +
'<span class="cm"># aggregation_strategy options:</span>\n' +
'<span class="cm"># "none"   — return individual token scores</span>\n' +
'<span class="cm"># "simple" — merge tokens of same type</span>\n' +
'<span class="cm"># "first"  — use score of first token in group</span>\n' +
'<span class="cm"># "average"— average scores across group (most accurate)</span>\n' +
'<span class="cm"># "max"    — use maximum score in group</span>' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>How the NER call works:</strong> 1) <code>pipeline("ner", aggregation_strategy="simple")</code> loads the default <code>dbmdz/bert-large-cased-finetuned-conll03-english</code> model and merges subword tokens belonging to the same entity. 2) The model assigns a label to every token; the aggregation strategy then collapses contiguous tokens with the same tag into a single span — without it, "Elon" and "Musk" would come back as two separate <code>PER</code> entries. 3) The loop pretty-prints each span\'s <code>word</code>, <code>entity_group</code> and confidence <code>score</code>. 4) The strategy options at the bottom (<code>none</code>, <code>simple</code>, <code>first</code>, <code>average</code>, <code>max</code>) control how the per-token scores are reduced when tokens are merged.</p>' +

'<h4>Text Generation</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Pipeline — Text Generation <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> pipeline\n\n' +
'generator = <span class="fn">pipeline</span>(<span class="str">"text-generation"</span>, model=<span class="str">"gpt2"</span>)\n\n' +
'output = <span class="fn">generator</span>(\n' +
'    <span class="str">"The future of artificial intelligence is"</span>,\n' +
'    max_new_tokens=<span class="num">80</span>,\n' +
'    num_return_sequences=<span class="num">2</span>,    <span class="cm"># generate 2 different completions</span>\n' +
'    temperature=<span class="num">0.8</span>,           <span class="cm"># higher = more creative, lower = more deterministic</span>\n' +
'    do_sample=<span class="kw">True</span>,            <span class="cm"># enable sampling (required for temperature)</span>\n' +
'    top_p=<span class="num">0.92</span>,               <span class="cm"># nucleus sampling threshold</span>\n' +
'    repetition_penalty=<span class="num">1.2</span>    <span class="cm"># penalize repeated tokens</span>\n' +
')\n\n' +
'<span class="kw">for</span> i, seq <span class="kw">in</span> <span class="fn">enumerate</span>(output):\n' +
'    <span class="fn">print</span>(<span class="str">f"--- Sequence {i+1} ---"</span>)\n' +
'    <span class="fn">print</span>(seq[<span class="str">"generated_text"</span>])\n' +
'    <span class="fn">print</span>()' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>What the generation call does:</strong> 1) <code>pipeline("text-generation", model="gpt2")</code> pulls the classic 124 M-parameter GPT-2 checkpoint and prepares an autoregressive sampling loop. 2) <code>max_new_tokens=80</code> caps the continuation length, while <code>num_return_sequences=2</code> asks for two independent completions in one batched call. 3) The sampling knobs (<code>do_sample=True</code>, <code>temperature=0.8</code>, <code>top_p=0.92</code>, <code>repetition_penalty=1.2</code>) shape the distribution at every step — nucleus sampling keeps the top tokens whose cumulative probability sums to 0.92 and the penalty discourages parroting. 4) The <code>enumerate</code> loop prints the two distinct continuations side by side so you can compare creativity.</p>' +

'<h4>Summarization</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Pipeline — Summarization <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> pipeline\n\n' +
'summarizer = <span class="fn">pipeline</span>(<span class="str">"summarization"</span>, model=<span class="str">"facebook/bart-large-cnn"</span>)\n\n' +
'article = <span class="str">"""</span>\n' +
'<span class="str">HuggingFace was founded in 2016 by Clement Delangue, Julien Chaumond, and</span>\n' +
'<span class="str">Thomas Wolf. The company started as a chatbot app for teenagers before</span>\n' +
'<span class="str">pivoting to focus on NLP infrastructure. In 2018, they released the</span>\n' +
'<span class="str">Transformers library, which quickly became the standard for working with</span>\n' +
'<span class="str">pretrained language models. The library initially supported BERT and GPT-2,</span>\n' +
'<span class="str">but has since expanded to support hundreds of architectures across NLP,</span>\n' +
'<span class="str">computer vision, audio, and multimodal tasks. HuggingFace has raised over</span>\n' +
'<span class="str">$235 million in funding and is valued at approximately $4.5 billion.</span>\n' +
'<span class="str">"""</span>\n\n' +
'summary = <span class="fn">summarizer</span>(article, max_length=<span class="num">60</span>, min_length=<span class="num">20</span>, do_sample=<span class="kw">False</span>)\n' +
'<span class="fn">print</span>(summary[<span class="num">0</span>][<span class="str">"summary_text"</span>])\n' +
'<span class="cm"># HuggingFace was founded in 2016 and pivoted from chatbots to NLP</span>\n' +
'<span class="cm"># infrastructure. They released the Transformers library in 2018, which</span>\n' +
'<span class="cm"># became the standard for pretrained language models.</span>' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>How the summarization pipeline works:</strong> 1) <code>pipeline("summarization", model="facebook/bart-large-cnn")</code> loads BART fine-tuned on CNN/DailyMail — an encoder-decoder optimized for news-style abstractive summaries. 2) The triple-quoted <code>article</code> is encoded by the BART encoder into a sequence of contextual vectors. 3) <code>summarizer(article, max_length=60, min_length=20, do_sample=False)</code> calls the decoder with beam search (sampling off) and constrains the output length to the 20-60 token band. 4) The returned list contains a dict with the <code>summary_text</code> key holding the generated abstract.</p>' +

'<h4>Zero-Shot Classification</h4>' +
'<p class="l-text">Zero-shot classification is one of the most powerful pipeline types — it classifies text into categories <em>that the model was never explicitly trained on</em>. The model uses natural language inference (NLI) to determine if the text "entails" each candidate label.</p>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Pipeline — Zero-Shot Classification <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> pipeline\n\n' +
'classifier = <span class="fn">pipeline</span>(<span class="str">"zero-shot-classification"</span>)\n\n' +
'text = <span class="str">"The central bank raised interest rates by 50 basis points to combat inflation."</span>\n\n' +
'<span class="cm"># These labels were NEVER seen during training — the model reasons about them</span>\n' +
'result = <span class="fn">classifier</span>(\n' +
'    text,\n' +
'    candidate_labels=[<span class="str">"economics"</span>, <span class="str">"sports"</span>, <span class="str">"technology"</span>, <span class="str">"politics"</span>, <span class="str">"entertainment"</span>]\n' +
')\n\n' +
'<span class="fn">print</span>(result[<span class="str">"labels"</span>])   <span class="cm"># ["economics", "politics", "technology", ...]</span>\n' +
'<span class="fn">print</span>(result[<span class="str">"scores"</span>])   <span class="cm"># [0.912, 0.063, 0.014, ...]</span>\n\n' +
'<span class="cm"># Multi-label: allow multiple categories to be true</span>\n' +
'result_multi = <span class="fn">classifier</span>(\n' +
'    <span class="str">"New AI model sets record on language benchmarks and generates images"</span>,\n' +
'    candidate_labels=[<span class="str">"NLP"</span>, <span class="str">"computer vision"</span>, <span class="str">"reinforcement learning"</span>, <span class="str">"AI research"</span>],\n' +
'    multi_label=<span class="kw">True</span>  <span class="cm"># scores are now independent probabilities</span>\n' +
')' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>What the zero-shot call is doing:</strong> 1) <code>pipeline("zero-shot-classification")</code> loads the default <code>facebook/bart-large-mnli</code> NLI model, trained to score entailment between a premise and a hypothesis. 2) The pipeline internally pairs the input <code>text</code> with each <code>candidate_labels</code> entry — turning each label into a hypothesis like "This text is about economics" — and runs an entailment forward pass per pair. 3) Scores are softmaxed across labels and returned in descending order in <code>result["labels"]</code> and <code>result["scores"]</code>. 4) Setting <code>multi_label=True</code> on the second call switches from softmax to a per-label sigmoid, so the AI-research example can independently mark both "NLP" and "computer vision" as true.</p>' +

'<h4>All Available Pipeline Tasks</h4>' +
'<div class="calc-cards">' +
'<div class="calc-card"><div class="calc-card-title">NLP Tasks</div><div class="calc-card-body">' +
'<code>sentiment-analysis</code> · <code>text-classification</code> · <code>token-classification</code> (NER) · <code>ner</code> · <code>question-answering</code> · <code>fill-mask</code> · <code>summarization</code> · <code>translation</code> · <code>text-generation</code> · <code>text2text-generation</code> · <code>zero-shot-classification</code> · <code>conversational</code>' +
'</div></div>' +
'<div class="calc-card"><div class="calc-card-title">Vision Tasks</div><div class="calc-card-body">' +
'<code>image-classification</code> · <code>object-detection</code> · <code>image-segmentation</code> · <code>zero-shot-image-classification</code> · <code>depth-estimation</code> · <code>image-to-text</code> · <code>visual-question-answering</code>' +
'</div></div>' +
'<div class="calc-card"><div class="calc-card-title">Audio Tasks</div><div class="calc-card-body">' +
'<code>automatic-speech-recognition</code> · <code>audio-classification</code> · <code>text-to-audio</code> · <code>audio-to-audio</code>' +
'</div></div>' +
'<div class="calc-card"><div class="calc-card-title">Multimodal Tasks</div><div class="calc-card-body">' +
'<code>document-question-answering</code> · <code>feature-extraction</code> (embeddings) · <code>image-feature-extraction</code> · <code>mask-generation</code>' +
'</div></div>' +
'</div>' +

'<h2 class="lesson-title">Auto Classes — Architecture-Agnostic Loading</h2>' +
'<div class="calc-highlight">' +
'<h4>Why "Auto"?</h4>' +
'<p class="l-text">The HuggingFace ecosystem supports hundreds of model architectures — BERT, RoBERTa, DistilBERT, ALBERT, XLNet, GPT-2, T5, BART, and many more. Each architecture has its own class (<code>BertModel</code>, <code>RobertaModel</code>, etc.), but hard-coding architecture names makes code brittle. If you switch from BERT to RoBERTa, you\'d need to update every class reference.</p>' +
'<p class="l-text">The <strong>Auto classes</strong> solve this elegantly: they read the model\'s <code>config.json</code> from the Hub, determine the architecture automatically, and instantiate the correct class. Your code becomes architecture-agnostic — swap the model name string, and everything else adapts automatically.</p>' +
'</div>' +

'<h4>AutoModelForSequenceClassification</h4>' +
'<p class="l-text">Used for text classification tasks: sentiment analysis, topic classification, spam detection, intent detection. The model adds a classification head (a linear layer) on top of the base transformer encoder.</p>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> AutoModel — Sequence Classification <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForSequenceClassification\n' +
'<span class="kw">import</span> torch\n\n' +
'model_name = <span class="str">"distilbert-base-uncased-finetuned-sst-2-english"</span>\n\n' +
'<span class="cm"># AutoTokenizer reads config and loads the right tokenizer (DistilBertTokenizerFast)</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(model_name)\n\n' +
'<span class="cm"># AutoModelForSequenceClassification loads DistilBertForSequenceClassification</span>\n' +
'model = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(model_name)\n\n' +
'<span class="cm"># Tokenize — returns a dict of tensors</span>\n' +
'inputs = <span class="fn">tokenizer</span>(\n' +
'    <span class="str">"HuggingFace is amazing!"</span>,\n' +
'    return_tensors=<span class="str">"pt"</span>,    <span class="cm"># "pt"=PyTorch, "tf"=TensorFlow, "np"=NumPy</span>\n' +
'    truncation=<span class="kw">True</span>,\n' +
'    max_length=<span class="num">512</span>\n' +
')\n' +
'<span class="cm"># inputs = {"input_ids": tensor, "attention_mask": tensor}</span>\n\n' +
'<span class="cm"># Forward pass — no gradient computation needed for inference</span>\n' +
'<span class="kw">with</span> torch.<span class="fn">no_grad</span>():\n' +
'    outputs = <span class="fn">model</span>(**inputs)\n\n' +
'<span class="cm"># outputs.logits shape: [batch_size, num_labels] = [1, 2]</span>\n' +
'logits = outputs.logits\n' +
'probabilities = torch.nn.functional.<span class="fn">softmax</span>(logits, dim=-<span class="num">1</span>)\n\n' +
'label_id = logits.<span class="fn">argmax</span>().item()\n' +
'label = model.config.id2label[label_id]\n' +
'score = probabilities[<span class="num">0</span>][label_id].item()\n\n' +
'<span class="fn">print</span>(<span class="str">f"Label: {label}, Score: {score:.4f}"</span>)\n' +
'<span class="cm"># Label: POSITIVE, Score: 0.9998</span>' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>What this snippet does end-to-end:</strong> 1) <code>AutoTokenizer.from_pretrained(model_name)</code> and <code>AutoModelForSequenceClassification.from_pretrained(model_name)</code> read the checkpoint\'s <code>config.json</code> and instantiate the right DistilBERT tokenizer and classification head. 2) <code>tokenizer(..., return_tensors="pt", truncation=True, max_length=512)</code> returns a dict with PyTorch <code>input_ids</code> and <code>attention_mask</code> tensors. 3) Wrapping the forward pass in <code>torch.no_grad()</code> disables autograd for inference, then <code>model(**inputs)</code> produces logits of shape <code>[1, 2]</code>. 4) <code>softmax</code> converts logits to probabilities, <code>argmax</code> picks the winning class, and <code>model.config.id2label</code> maps the index back to "POSITIVE" or "NEGATIVE".</p>' +

'<h4>AutoModelForTokenClassification</h4>' +
'<p class="l-text">Used for tasks that assign a label to each token: NER, part-of-speech tagging, chunking. A linear classification head is applied at every token position rather than just at the <code>[CLS]</code> token.</p>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> AutoModel — Token Classification (NER) <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForTokenClassification\n' +
'<span class="kw">import</span> torch\n\n' +
'model_name = <span class="str">"dslim/bert-base-NER"</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(model_name)\n' +
'model = AutoModelForTokenClassification.<span class="fn">from_pretrained</span>(model_name)\n\n' +
'text = <span class="str">"Barack Obama was born in Honolulu, Hawaii."</span>\n' +
'inputs = <span class="fn">tokenizer</span>(text, return_tensors=<span class="str">"pt"</span>)\n\n' +
'<span class="kw">with</span> torch.<span class="fn">no_grad</span>():\n' +
'    outputs = <span class="fn">model</span>(**inputs)\n\n' +
'<span class="cm"># outputs.logits shape: [1, sequence_length, num_labels]</span>\n' +
'predictions = outputs.logits.<span class="fn">argmax</span>(dim=-<span class="num">1</span>)[<span class="num">0</span>]\n' +
'tokens = tokenizer.<span class="fn">convert_ids_to_tokens</span>(inputs[<span class="str">"input_ids"</span>][<span class="num">0</span>])\n\n' +
'<span class="kw">for</span> token, pred_id <span class="kw">in</span> <span class="fn">zip</span>(tokens, predictions):\n' +
'    label = model.config.id2label[pred_id.item()]\n' +
'    <span class="kw">if</span> label != <span class="str">"O"</span>:  <span class="cm"># O = "Outside" any entity</span>\n' +
'        <span class="fn">print</span>(<span class="str">f"{token:15} → {label}"</span>)\n' +
'<span class="cm"># Barack         → B-PER</span>\n' +
'<span class="cm"># Obama          → I-PER</span>\n' +
'<span class="cm"># Honolulu       → B-LOC</span>\n' +
'<span class="cm"># Hawaii         → B-LOC</span>' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>How token classification plays out:</strong> 1) <code>AutoTokenizer.from_pretrained("dslim/bert-base-NER")</code> and <code>AutoModelForTokenClassification.from_pretrained(...)</code> load a BERT-base fine-tuned on the CoNLL-03 NER dataset. 2) <code>tokenizer(text, return_tensors="pt")</code> packs the sentence into a single PyTorch batch. 3) <code>model(**inputs)</code> returns logits of shape <code>[1, sequence_length, num_labels]</code> and <code>argmax(dim=-1)</code> collapses the last axis to a predicted label id per token. 4) Looping with <code>zip(tokens, predictions)</code> and filtering out the <code>"O"</code> (outside) label prints only the tokens that belong to a named entity, with their BIO tag.</p>' +

'<h4>AutoModelForCausalLM</h4>' +
'<p class="l-text">Used for autoregressive text generation (GPT-style models). The model predicts the next token given all previous tokens. Used for open-ended generation, completion, and as the backbone of instruction-tuned chat models.</p>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> AutoModel — Causal Language Model <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM\n' +
'<span class="kw">import</span> torch\n\n' +
'model_name = <span class="str">"gpt2"</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(model_name)\n' +
'model = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(model_name)\n\n' +
'<span class="cm"># Set pad token (GPT-2 has no pad token by default)</span>\n' +
'tokenizer.pad_token = tokenizer.eos_token\n\n' +
'prompt = <span class="str">"Machine learning is transforming the way we"</span>\n' +
'inputs = <span class="fn">tokenizer</span>(prompt, return_tensors=<span class="str">"pt"</span>)\n\n' +
'<span class="cm"># generate() handles the autoregressive loop internally</span>\n' +
'output_ids = model.<span class="fn">generate</span>(\n' +
'    inputs[<span class="str">"input_ids"</span>],\n' +
'    max_new_tokens=<span class="num">50</span>,\n' +
'    do_sample=<span class="kw">True</span>,\n' +
'    temperature=<span class="num">0.7</span>,\n' +
'    top_k=<span class="num">50</span>,\n' +
'    pad_token_id=tokenizer.eos_token_id\n' +
')\n\n' +
'<span class="cm"># Decode only the newly generated tokens (skip the prompt)</span>\n' +
'new_tokens = output_ids[<span class="num">0</span>][inputs[<span class="str">"input_ids"</span>].shape[-<span class="num">1</span>]:]\n' +
'generated_text = tokenizer.<span class="fn">decode</span>(new_tokens, skip_special_tokens=<span class="kw">True</span>)\n' +
'<span class="fn">print</span>(generated_text)' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>What the causal LM call does:</strong> 1) <code>AutoTokenizer.from_pretrained("gpt2")</code> and <code>AutoModelForCausalLM.from_pretrained("gpt2")</code> load the GPT-2 vocabulary and weights, then <code>tokenizer.pad_token = tokenizer.eos_token</code> works around GPT-2 not having a real pad token. 2) <code>tokenizer(prompt, return_tensors="pt")</code> tokenizes the seed prompt into PyTorch tensors. 3) <code>model.generate(...)</code> hides the autoregressive loop — at each step it feeds the previous output back in, here using <code>do_sample=True</code> with <code>temperature=0.7</code> and <code>top_k=50</code> for diverse output. 4) Slicing <code>output_ids[0][inputs["input_ids"].shape[-1]:]</code> strips the original prompt so <code>tokenizer.decode</code> prints only the newly generated continuation.</p>' +

'<h4>The Auto Class Resolution Chain</h4>' +
'<div class="calc-steps">' +
'<div class="calc-step"><div class="calc-step-num">1</div><div class="calc-step-body"><strong>Call <code>from_pretrained("model-name")</code></strong> — The Auto class receives a model identifier (Hub name, local path, or URL).</div></div>' +
'<div class="calc-step"><div class="calc-step-num">2</div><div class="calc-step-body"><strong>Fetch <code>config.json</code></strong> — HuggingFace downloads or reads the model configuration file, which contains the <code>"model_type"</code> field (e.g., <code>"bert"</code>, <code>"roberta"</code>, <code>"distilbert"</code>).</div></div>' +
'<div class="calc-step"><div class="calc-step-num">3</div><div class="calc-step-body"><strong>Look up the model type in the Auto mapping</strong> — Internally, <code>AutoModelForSequenceClassification</code> maintains a dictionary mapping model type strings to concrete classes: <code>{"bert": BertForSequenceClassification, "roberta": RobertaForSequenceClassification, ...}</code>.</div></div>' +
'<div class="calc-step"><div class="calc-step-num">4</div><div class="calc-step-body"><strong>Instantiate the concrete class</strong> — The correct architecture class is instantiated with the config. Model weights are then loaded from <code>pytorch_model.bin</code> or sharded weight files.</div></div>' +
'<div class="calc-step"><div class="calc-step-num">5</div><div class="calc-step-body"><strong>Cache locally</strong> — Downloaded files are cached at <code>~/.cache/huggingface/hub/</code>. Subsequent calls load from cache, skipping the download entirely.</div></div>' +
'</div>' +

'<h2 class="lesson-title">HuggingFace Hub</h2>' +
'<p class="l-text">The Hub at <strong>huggingface.co</strong> is where the ecosystem comes alive. It is a Git-based hosting platform for models, datasets, and Spaces (demo applications). Understanding how to navigate and use the Hub effectively is a core skill.</p>' +

'<h4>Browsing and Filtering Models</h4>' +
'<div class="l-note"><strong>Hub Navigation Tips:</strong> At huggingface.co/models, use the left sidebar to filter by: <strong>Task</strong> (text-classification, token-classification, text-generation, etc.), <strong>Library</strong> (transformers, diffusers, timm), <strong>Language</strong> (en, zh, ar, etc.), <strong>Dataset</strong> (what training data was used), and <strong>License</strong> (apache-2.0, mit, cc-by-4.0). Sort by Downloads or Likes to find the most popular models. The search bar supports full-text search across model names and model card content.</div>' +

'<h4>Reading Model Cards</h4>' +
'<p class="l-text">A good model card is the difference between a model you can actually use and one that will surprise you in production. When evaluating a model card, look for these critical elements:</p>' +
'<div class="calc-compare">' +
'<div class="calc-compare-col">' +
'<div class="calc-compare-title">Look For (Green Flags)</div>' +
'<ul>' +
'<li>Training data description with size and sources</li>' +
'<li>Benchmark results on standard datasets (GLUE, SuperGLUE, etc.)</li>' +
'<li>Intended use cases and out-of-scope uses</li>' +
'<li>Known limitations and bias analysis</li>' +
'<li>Carbon footprint / compute used for training</li>' +
'<li>Clear license statement</li>' +
'<li>Inference examples with expected outputs</li>' +
'</ul>' +
'</div>' +
'<div class="calc-compare-col">' +
'<div class="calc-compare-title">Watch Out For (Red Flags)</div>' +
'<ul>' +
'<li>No training data documentation</li>' +
'<li>No evaluation results</li>' +
'<li>No bias or fairness analysis</li>' +
'<li>Vague or missing license</li>' +
'<li>Very few downloads with no explanation</li>' +
'<li>No community discussion or issues</li>' +
'<li>Last updated years ago with no maintenance</li>' +
'</ul>' +
'</div>' +
'</div>' +

'<h4>Downloading Models Programmatically</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Downloading Models from Hub <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModel\n' +
'<span class="kw">from</span> huggingface_hub <span class="kw">import</span> snapshot_download, hf_hub_download\n\n' +
'<span class="cm"># Method 1: Auto classes — downloads automatically on first use</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>)\n' +
'model = AutoModel.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>)\n\n' +
'<span class="cm"># Method 2: Download to a specific local directory</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(\n' +
'    <span class="str">"bert-base-uncased"</span>,\n' +
'    cache_dir=<span class="str">"./my_models/"</span>  <span class="cm"># custom cache location</span>\n' +
')\n\n' +
'<span class="cm"># Method 3: Download entire model repo as a folder</span>\n' +
'local_path = <span class="fn">snapshot_download</span>(\n' +
'    repo_id=<span class="str">"sentence-transformers/all-MiniLM-L6-v2"</span>,\n' +
'    local_dir=<span class="str">"./models/minilm"</span>\n' +
')\n' +
'<span class="fn">print</span>(<span class="str">f"Downloaded to: {local_path}"</span>)\n\n' +
'<span class="cm"># Method 4: Download a single file from a repo</span>\n' +
'config_path = <span class="fn">hf_hub_download</span>(\n' +
'    repo_id=<span class="str">"bert-base-uncased"</span>,\n' +
'    filename=<span class="str">"config.json"</span>\n' +
')\n\n' +
'<span class="cm"># Load from local path (offline, no internet required)</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"./models/minilm"</span>)\n' +
'model = AutoModel.<span class="fn">from_pretrained</span>(<span class="str">"./models/minilm"</span>)' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Four ways the snippet pulls files from the Hub:</strong> 1) The default <code>AutoTokenizer.from_pretrained("bert-base-uncased")</code> and <code>AutoModel.from_pretrained(...)</code> calls download into the standard cache the first time they\'re used. 2) Adding <code>cache_dir="./my_models/"</code> redirects the cache to a project-local directory — handy for Docker images or air-gapped servers. 3) <code>snapshot_download(repo_id="sentence-transformers/all-MiniLM-L6-v2", local_dir="./models/minilm")</code> grabs the entire repo as plain files, ideal for offline deployment. 4) <code>hf_hub_download(repo_id="bert-base-uncased", filename="config.json")</code> downloads exactly one file; the final two lines reload the model from the local <code>./models/minilm</code> folder with no network access.</p>' +

'<h4>Pushing Models to the Hub</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Pushing Models to Hub <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForSequenceClassification\n' +
'<span class="kw">from</span> huggingface_hub <span class="kw">import</span> login\n\n' +
'<span class="cm"># Authenticate — get your token at huggingface.co/settings/tokens</span>\n' +
'<span class="fn">login</span>(token=<span class="str">"hf_your_token_here"</span>)  <span class="cm"># or set HF_TOKEN env variable</span>\n\n' +
'<span class="cm"># After fine-tuning or training, push to Hub</span>\n' +
'model_name = <span class="str">"my-username/my-sentiment-model"</span>\n\n' +
'<span class="cm"># Push model weights and config</span>\n' +
'model.<span class="fn">push_to_hub</span>(model_name)\n\n' +
'<span class="cm"># Push tokenizer</span>\n' +
'tokenizer.<span class="fn">push_to_hub</span>(model_name)\n\n' +
'<span class="cm"># Alternative: save locally first, then push</span>\n' +
'model.<span class="fn">save_pretrained</span>(<span class="str">"./my-model-local"</span>)\n' +
'tokenizer.<span class="fn">save_pretrained</span>(<span class="str">"./my-model-local"</span>)\n\n' +
'<span class="cm"># Push entire local folder to Hub</span>\n' +
'<span class="kw">from</span> huggingface_hub <span class="kw">import</span> HfApi\n' +
'api = <span class="fn">HfApi</span>()\n' +
'api.<span class="fn">upload_folder</span>(\n' +
'    folder_path=<span class="str">"./my-model-local"</span>,\n' +
'    repo_id=model_name,\n' +
'    repo_type=<span class="str">"model"</span>\n' +
')' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>How publishing to the Hub works:</strong> 1) <code>login(token="hf_your_token_here")</code> authenticates the current process — alternatively set the <code>HF_TOKEN</code> environment variable so the secret never appears in code. 2) <code>model.push_to_hub(model_name)</code> and <code>tokenizer.push_to_hub(model_name)</code> create (or update) the repo, then upload the weights, <code>config.json</code> and tokenizer files via Git LFS. 3) The alternative <code>model.save_pretrained("./my-model-local")</code> + <code>tokenizer.save_pretrained(...)</code> path mirrors the same files locally first. 4) <code>HfApi().upload_folder(folder_path=..., repo_id=..., repo_type="model")</code> then pushes the entire directory in one shot — useful when extra files (model card, eval results) live alongside the weights.</p>' +

'<h2 class="lesson-title">Datasets Library</h2>' +
'<p class="l-text">The <code>datasets</code> library is the standard way to load, process, and share ML datasets in the HuggingFace ecosystem. It uses Apache Arrow under the hood, enabling zero-copy reads and memory mapping so you can work with datasets much larger than your available RAM.</p>' +

'<h4>Loading Datasets with <code>load_dataset</code></h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Loading Datasets <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset\n\n' +
'<span class="cm"># Load the IMDB sentiment analysis dataset</span>\n' +
'dataset = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>)\n' +
'<span class="fn">print</span>(dataset)\n' +
'<span class="cm"># DatasetDict({</span>\n' +
'<span class="cm">#     train: Dataset({features: ["text", "label"], num_rows: 25000}),</span>\n' +
'<span class="cm">#     test:  Dataset({features: ["text", "label"], num_rows: 25000})</span>\n' +
'<span class="cm"># })</span>\n\n' +
'<span class="cm"># Access splits</span>\n' +
'train_data = dataset[<span class="str">"train"</span>]\n' +
'test_data  = dataset[<span class="str">"test"</span>]\n\n' +
'<span class="cm"># Access individual samples (dict-like)</span>\n' +
'sample = train_data[<span class="num">0</span>]\n' +
'<span class="fn">print</span>(sample[<span class="str">"text"</span>][:100])  <span class="cm"># first 100 chars of the review</span>\n' +
'<span class="fn">print</span>(sample[<span class="str">"label"</span>])      <span class="cm"># 0 = negative, 1 = positive</span>\n\n' +
'<span class="cm"># Load only the train split</span>\n' +
'train_only = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>, split=<span class="str">"train"</span>)\n\n' +
'<span class="cm"># Load a specific percentage (useful for quick experiments)</span>\n' +
'small_train = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>, split=<span class="str">"train[:10%]"</span>)\n\n' +
'<span class="cm"># Load from a local CSV file</span>\n' +
'local_dataset = <span class="fn">load_dataset</span>(<span class="str">"csv"</span>, data_files=<span class="str">"./my_data.csv"</span>)\n\n' +
'<span class="cm"># Load from a JSON file</span>\n' +
'json_dataset = <span class="fn">load_dataset</span>(<span class="str">"json"</span>, data_files=<span class="str">"./my_data.jsonl"</span>)' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>How <code>load_dataset</code> hands you data:</strong> 1) <code>load_dataset("imdb")</code> downloads the IMDb sentiment corpus and returns a <code>DatasetDict</code> with <code>train</code> and <code>test</code> splits, each backed by a memory-mapped Apache Arrow table. 2) Indexing into <code>train_data[0]</code> returns a Python dict with the review <code>text</code> and an integer <code>label</code> (0 = negative, 1 = positive). 3) The <code>split="train"</code> argument bypasses the dict wrapper and returns a single <code>Dataset</code>; the <code>split="train[:10%]"</code> slice loads only the first tenth — perfect for fast iteration. 4) The last two calls show local-file loading: <code>load_dataset("csv", data_files=...)</code> and <code>load_dataset("json", data_files=...)</code> wrap your own files in the same Arrow-backed API.</p>' +

'<h4>Dataset Operations</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Dataset Operations — map, filter, shuffle <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset\n' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer\n\n' +
'dataset = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>)\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>)\n\n' +
'<span class="cm"># .map() — apply a function to every example (or batch)</span>\n' +
'<span class="kw">def</span> <span class="fn">tokenize_function</span>(examples):\n' +
'    <span class="kw">return</span> <span class="fn">tokenizer</span>(\n' +
'        examples[<span class="str">"text"</span>],\n' +
'        truncation=<span class="kw">True</span>,\n' +
'        max_length=<span class="num">512</span>,\n' +
'        padding=<span class="str">"max_length"</span>\n' +
'    )\n\n' +
'tokenized = dataset.<span class="fn">map</span>(\n' +
'    tokenize_function,\n' +
'    batched=<span class="kw">True</span>,          <span class="cm"># process in batches for speed</span>\n' +
'    num_proc=<span class="num">4</span>,            <span class="cm"># use 4 CPU cores</span>\n' +
'    remove_columns=[<span class="str">"text"</span>] <span class="cm"># drop the raw text column after tokenizing</span>\n' +
')\n\n' +
'<span class="cm"># .filter() — keep only examples that match a condition</span>\n' +
'long_reviews = dataset[<span class="str">"train"</span>].<span class="fn">filter</span>(\n' +
'    <span class="kw">lambda</span> example: <span class="fn">len</span>(example[<span class="str">"text"</span>]) > <span class="num">500</span>\n' +
')\n\n' +
'<span class="cm"># .shuffle() — randomly reorder the dataset</span>\n' +
'shuffled = dataset[<span class="str">"train"</span>].<span class="fn">shuffle</span>(seed=<span class="num">42</span>)\n\n' +
'<span class="cm"># .select() — pick specific indices</span>\n' +
'subset = dataset[<span class="str">"train"</span>].<span class="fn">select</span>(<span class="fn">range</span>(<span class="num">1000</span>))  <span class="cm"># first 1000 examples</span>\n\n' +
'<span class="cm"># .sort() — sort by a column</span>\n' +
'sorted_data = dataset[<span class="str">"train"</span>].<span class="fn">sort</span>(<span class="str">"label"</span>)\n\n' +
'<span class="cm"># .rename_column() — rename a column</span>\n' +
'renamed = dataset.<span class="fn">rename_column</span>(<span class="str">"label"</span>, <span class="str">"sentiment"</span>)\n\n' +
'<span class="cm"># Chain operations (each returns a new Dataset)</span>\n' +
'processed = (\n' +
'    dataset[<span class="str">"train"</span>]\n' +
'    .<span class="fn">shuffle</span>(seed=<span class="num">42</span>)\n' +
'    .<span class="fn">select</span>(<span class="fn">range</span>(<span class="num">5000</span>))\n' +
'    .<span class="fn">filter</span>(<span class="kw">lambda</span> x: <span class="fn">len</span>(x[<span class="str">"text"</span>]) > <span class="num">100</span>)\n' +
')' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>The dataset transformations in this snippet:</strong> 1) The <code>tokenize_function</code> wraps the BERT tokenizer with <code>truncation=True</code>, <code>max_length=512</code> and fixed-length padding so every example becomes a uniform tensor. 2) <code>dataset.map(tokenize_function, batched=True, num_proc=4, remove_columns=["text"])</code> applies that function across all splits in parallel on 4 CPU cores and drops the raw text once tokenization is done — the result is cached to disk so subsequent runs reload instantly. 3) <code>filter</code>, <code>shuffle</code>, <code>select</code>, <code>sort</code> and <code>rename_column</code> each return a brand-new lazy <code>Dataset</code> without mutating the original. 4) The final chained pipeline (<code>.shuffle().select().filter()</code>) shows how these operations compose into a single declarative preprocessing recipe.</p>' +

'<h4>DatasetDict: Working with Train/Validation/Test Splits</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> DatasetDict — Train/Val/Test Splits <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset, DatasetDict, Dataset\n\n' +
'<span class="cm"># Many datasets already have splits</span>\n' +
'glue = <span class="fn">load_dataset</span>(<span class="str">"glue"</span>, <span class="str">"sst2"</span>)  <span class="cm"># train, validation, test</span>\n' +
'<span class="fn">print</span>(glue.keys())  <span class="cm"># dict_keys(["train", "validation", "test"])</span>\n\n' +
'<span class="cm"># Create a validation split from a dataset that only has train/test</span>\n' +
'dataset = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>)\n\n' +
'<span class="cm"># Split train into train (90%) and validation (10%)</span>\n' +
'train_val = dataset[<span class="str">"train"</span>].<span class="fn">train_test_split</span>(test_size=<span class="num">0.1</span>, seed=<span class="num">42</span>)\n\n' +
'<span class="cm"># Reassemble into a DatasetDict with all three splits</span>\n' +
'split_dataset = DatasetDict({\n' +
'    <span class="str">"train"</span>: train_val[<span class="str">"train"</span>],\n' +
'    <span class="str">"validation"</span>: train_val[<span class="str">"test"</span>],\n' +
'    <span class="str">"test"</span>: dataset[<span class="str">"test"</span>]\n' +
'})\n\n' +
'<span class="fn">print</span>(split_dataset)\n' +
'<span class="cm"># DatasetDict({</span>\n' +
'<span class="cm">#     train:      Dataset({num_rows: 22500}),</span>\n' +
'<span class="cm">#     validation: Dataset({num_rows: 2500}),</span>\n' +
'<span class="cm">#     test:       Dataset({num_rows: 25000})</span>\n' +
'<span class="cm"># })</span>\n\n' +
'<span class="cm"># Apply map to all splits at once</span>\n' +
'tokenized = split_dataset.<span class="fn">map</span>(tokenize_function, batched=<span class="kw">True</span>)\n\n' +
'<span class="cm"># Save preprocessed dataset to disk (Arrow format — very fast to reload)</span>\n' +
'tokenized.<span class="fn">save_to_disk</span>(<span class="str">"./tokenized_imdb"</span>)\n\n' +
'<span class="cm"># Reload later — no need to re-tokenize</span>\n' +
'<span class="kw">from</span> datasets <span class="kw">import</span> load_from_disk\n' +
'tokenized = <span class="fn">load_from_disk</span>(<span class="str">"./tokenized_imdb"</span>)' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>How the splits are assembled and saved:</strong> 1) <code>load_dataset("glue", "sst2")</code> shows a corpus that already ships with <code>train</code>, <code>validation</code> and <code>test</code> — <code>glue.keys()</code> confirms the layout. 2) For IMDb which only has train/test, <code>dataset["train"].train_test_split(test_size=0.1, seed=42)</code> carves a 10% validation slice with reproducible randomness. 3) Wrapping the three pieces in a <code>DatasetDict</code> keeps train/val/test side-by-side, so <code>split_dataset.map(tokenize_function, batched=True)</code> tokenizes every split in a single call. 4) <code>tokenized.save_to_disk("./tokenized_imdb")</code> persists the preprocessed Arrow files, and a later <code>load_from_disk(...)</code> reloads them instantly without re-tokenizing.</p>' +

'<div class="l-note"><strong>Streaming Large Datasets:</strong> Some datasets are too large to download entirely (e.g., The Pile, LAION-5B, Common Crawl). Use <code>streaming=True</code> to iterate without downloading: <code>dataset = load_dataset("c4", "en", streaming=True)</code>. With streaming, operations like <code>.map()</code> and <code>.filter()</code> still work but are applied lazily as you iterate. You cannot randomly access examples or shuffle the full dataset, but you can use <code>.shuffle(buffer_size=10000)</code> to shuffle a rolling buffer. Streaming is essential when working with multi-terabyte datasets on machines with limited disk space.</div>' +

'<h2 class="lesson-title">HuggingFace Ecosystem Architecture</h2>' +
'<p class="l-text">The following diagram illustrates how the major components of the HuggingFace ecosystem connect and interact, from the central Hub through to your training and inference code.</p>' +
'<div class="calc-graph">' +
'<svg viewBox="0 0 820 560" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:820px;display:block;margin:0 auto;">' +

'<defs>' +
'<marker id="arrow-hf" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">' +
'<polygon points="0 0, 10 3.5, 0 7" fill="#888"/>' +
'</marker>' +
'<filter id="glow-hf" x="-20%" y="-20%" width="140%" height="140%">' +
'<feGaussianBlur stdDeviation="3" result="blur"/>' +
'<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
'</filter>' +
'</defs>' +

'<!-- Background -->' +
'<rect width="820" height="560" fill="#1a1a2e" rx="12"/>' +

'<!-- Title -->' +
'<text x="410" y="36" text-anchor="middle" font-family="monospace" font-size="15" font-weight="bold" fill="#c8a96e">HuggingFace Ecosystem Architecture</text>' +

'<!-- HUB (center) -->' +
'<rect x="310" y="195" width="200" height="90" rx="12" fill="#2a2a4a" stroke="#c8a96e" stroke-width="2.5" filter="url(#glow-hf)"/>' +
'<text x="410" y="232" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#c8a96e">🌐 HuggingFace Hub</text>' +
'<text x="410" y="252" text-anchor="middle" font-family="monospace" font-size="10" fill="#aaa">huggingface.co</text>' +
'<text x="410" y="270" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">Models · Datasets · Spaces</text>' +

'<!-- Transformers -->' +
'<rect x="60" y="80" width="170" height="80" rx="10" fill="#1e2d1e" stroke="#4ecdc4" stroke-width="2"/>' +
'<text x="145" y="112" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#4ecdc4">🤗 Transformers</text>' +
'<text x="145" y="130" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">AutoModel / Pipeline</text>' +
'<text x="145" y="146" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">PyTorch · TF · JAX</text>' +

'<!-- Tokenizers -->' +
'<rect x="60" y="210" width="170" height="80" rx="10" fill="#1e2d1e" stroke="#4ecdc4" stroke-width="2"/>' +
'<text x="145" y="242" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#4ecdc4">⚡ Tokenizers</text>' +
'<text x="145" y="260" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">BPE · WordPiece</text>' +
'<text x="145" y="276" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">Rust backend · Fast</text>' +

'<!-- Datasets -->' +
'<rect x="60" y="340" width="170" height="80" rx="10" fill="#1e2d1e" stroke="#4ecdc4" stroke-width="2"/>' +
'<text x="145" y="372" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#4ecdc4">📦 Datasets</text>' +
'<text x="145" y="390" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">load_dataset · map</text>' +
'<text x="145" y="406" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">Arrow · Streaming</text>' +

'<!-- Evaluate -->' +
'<rect x="590" y="80" width="170" height="80" rx="10" fill="#2d1e1e" stroke="#ff4b4b" stroke-width="2"/>' +
'<text x="675" y="112" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#ff4b4b">📊 Evaluate</text>' +
'<text x="675" y="130" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">Accuracy · F1 · BLEU</text>' +
'<text x="675" y="146" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">ROUGE · BERTScore</text>' +

'<!-- Accelerate -->' +
'<rect x="590" y="210" width="170" height="80" rx="10" fill="#2d1e1e" stroke="#ff4b4b" stroke-width="2"/>' +
'<text x="675" y="242" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#ff4b4b">🚀 Accelerate</text>' +
'<text x="675" y="260" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">Multi-GPU · TPU</text>' +
'<text x="675" y="276" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">fp16/bf16 · FSDP</text>' +

'<!-- PEFT -->' +
'<rect x="590" y="340" width="170" height="80" rx="10" fill="#2d1e1e" stroke="#ff4b4b" stroke-width="2"/>' +
'<text x="675" y="372" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#ff4b4b">🎯 PEFT</text>' +
'<text x="675" y="390" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">LoRA · QLoRA · Prefix</text>' +
'<text x="675" y="406" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">Parameter-Efficient FT</text>' +

'<!-- Your Code -->' +
'<rect x="300" y="400" width="220" height="80" rx="10" fill="#1a2a1a" stroke="#c8a96e" stroke-width="1.5" stroke-dasharray="6,3"/>' +
'<text x="410" y="432" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#c8a96e">💻 Your Code</text>' +
'<text x="410" y="452" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">Training · Fine-Tuning</text>' +
'<text x="410" y="468" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">Inference · Deployment</text>' +

'<!-- Arrows: Hub ↔ Transformers -->' +
'<line x1="310" y1="225" x2="232" y2="133" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +
'<line x1="228" y1="136" x2="308" y2="228" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +

'<!-- Arrows: Hub ↔ Tokenizers -->' +
'<line x1="310" y1="240" x2="232" y2="248" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +
'<line x1="232" y1="252" x2="312" y2="244" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +

'<!-- Arrows: Hub ↔ Datasets -->' +
'<line x1="310" y1="270" x2="232" y2="360" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +
'<line x1="230" y1="362" x2="308" y2="272" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +

'<!-- Arrows: Hub ↔ Evaluate -->' +
'<line x1="510" y1="225" x2="588" y2="133" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +

'<!-- Arrows: Hub ↔ Accelerate -->' +
'<line x1="510" y1="240" x2="588" y2="248" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +

'<!-- Arrows: Hub ↔ PEFT -->' +
'<line x1="510" y1="270" x2="588" y2="360" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +

'<!-- Arrow: Hub → Your Code -->' +
'<line x1="410" y1="285" x2="410" y2="398" stroke="#c8a96e" stroke-width="2" marker-end="url(#arrow-hf)" stroke-dasharray="5,3"/>' +

'<!-- Download label -->' +
'<text x="425" y="346" font-family="monospace" font-size="9" fill="#c8a96e">from_pretrained()</text>' +

'<!-- Legend -->' +
'<rect x="30" y="510" width="12" height="12" fill="none" stroke="#4ecdc4" stroke-width="2"/>' +
'<text x="48" y="521" font-family="monospace" font-size="9" fill="#aaa">Core libraries</text>' +
'<rect x="150" y="510" width="12" height="12" fill="none" stroke="#ff4b4b" stroke-width="2"/>' +
'<text x="168" y="521" font-family="monospace" font-size="9" fill="#aaa">Training utilities</text>' +
'<rect x="290" y="510" width="12" height="12" fill="none" stroke="#c8a96e" stroke-width="2"/>' +
'<text x="308" y="521" font-family="monospace" font-size="9" fill="#aaa">Hub (central platform)</text>' +

'</svg>' +
'</div>' +

'<div class="calc-example">' +
'<strong>Next Steps:</strong> Now that you understand the HuggingFace ecosystem, the next lesson dives into the <strong>Tokenizer</strong> in depth — the critical preprocessing step that converts raw text into the numerical tensors that transformer models consume. You\'ll learn about subword tokenization algorithms (BPE, WordPiece), special tokens, padding and truncation strategies, and how tokenization choices can significantly impact model performance.' +
'</div>',

tr: '<div class="calc-highlight">' +
'<h2 class="lesson-title">HuggingFace Nedir?</h2>' +
'<p class="l-text">HuggingFace, çoğu zaman <strong>Makine Öğrenmesinin GitHub\'ı</strong> olarak anılır — ML topluluğunun önceden eğitilmiş modelleri paylaşma, keşfetme ve kullanma biçimini kökten değiştiren bir platform ve açık kaynak ekosistemidir. 2016\'da kurulan ve başlangıçta sohbet botlarına odaklanan HuggingFace, transformer tabanlı modeller için merkezi bir Hub haline dönüştü; bugün 500.000\'den fazla model, 100.000 veri seti ve 150.000 ML demo uygulamasına ev sahipliği yapıyor.</p>' +
'<p class="l-text">Misyon basit ama derin: <strong>iyi makine öğrenmesini demokratikleştirmek</strong>. HuggingFace\'den önce, son teknoloji bir NLP modeli kullanmak, bir araştırma makalesi okumayı, yazar tarafından yayımlanan kodu (varsa) bulmayı, farklı çerçevelerle boğuşmayı ve sadece bir şeyleri çalıştırmak için günler harcamayı gerektiriyordu. HuggingFace bu sürecin tamamını birkaç satır Python\'a indirdi.</p>' +
'<p class="l-text">Bugün HuggingFace, hem endüstride hem de araştırma dünyasında NLP çalışmalarının fiili standardıdır. Google, Meta, Microsoft ve Amazon gibi şirketler ekosisteme aktif olarak katkıda bulunmakta ve onu kullanmaktadır. NLP yapan herkes için HuggingFace\'i anlamak isteğe bağlı değil — diğer her şeyin üzerine inşa edildiği temeldir.</p>' +
'</div>' +

'<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">' +
'<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>' +
'<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">' +
'<li>Altı temel HuggingFace kütüphanesini tanımlamayı: Transformers, Tokenizers, Datasets, Hub, Evaluate, Accelerate</li>' +
'<li>Yığını <code>pip install transformers[torch] datasets tokenizers</code> ile kurmayı ve GPU\'yu doğrulamayı</li>' +
'<li><code>pipeline()</code> API\'si ile sentiment, NER, summarization ve QA\'yı 3 satırda çalıştırmayı</li>' +
'<li>Hub\'dan modelleri <code>AutoModel.from_pretrained</code> ile yükleyip incelemeyi</li>' +
'<li><code>~/.cache/huggingface/hub/</code> konumunda önbelleklenen ağırlıkları bulmayı ve disk kullanımını yönetmeyi</li>' +
'</ul>' +
'</div>' +

'<h2 class="lesson-title">HuggingFace Ekosistemi</h2>' +
'<p class="l-text">HuggingFace tek bir kütüphane değil — ML iş akışının belirli bir bölümünü çözen, sıkıca entegre edilmiş bir kütüphaneler ekosistemidir. Bunların birbirine nasıl uyduğunu anlamak, onları etkili biçimde kullanmanın anahtarıdır.</p>' +
'<div class="calc-cards">' +
'<div class="calc-card">' +
'<div class="calc-card-title">🤗 Transformers</div>' +
'<div class="calc-card-body">Amiral gemisi kütüphane. NLP, görü, ses ve çok modlu görevler için binlerce önceden eğitilmiş model sunar. PyTorch, TensorFlow ve JAX\'ı destekler. Temel soyutlama <code>PreTrainedModel</code> ve göreve özgü varyantlarıdır.</div>' +
'</div>' +
'<div class="calc-card">' +
'<div class="calc-card-title">⚡ Tokenizers</div>' +
'<div class="calc-card-body">Python API sunan Rust tabanlı bir tokenizasyon kütüphanesi. BPE, WordPiece, SentencePiece ve Unigram tokenizasyonunu inanılmaz hızda gerçekleştirir. Tek bir tokenizer, çok iş parçacıklı işlem sayesinde gigabaytlarca metni saniyeler içinde işleyebilir.</div>' +
'</div>' +
'<div class="calc-card">' +
'<div class="calc-card-title">📦 Datasets</div>' +
'<div class="calc-card-body">Veri setlerini yüklemek, işlemek ve paylaşmak için bellek açısından verimli bir kütüphane. Sıfır kopyalı okumalar için Apache Arrow kullanır. RAM\'e sığmayacak kadar büyük veri setleri için akış desteği sunar. Binlerce genel veri setine tek bir fonksiyon çağrısıyla erişilebilir.</div>' +
'</div>' +
'<div class="calc-card">' +
'<div class="calc-card-title">🌐 Hub</div>' +
'<div class="calc-card-body">huggingface.co adresindeki model ve veri seti barındırma platformu. Sürüm kontrolü (Git + Git LFS), model kartları, inference widget\'ları ve bir API sunar. Modeller ilk kullanımda otomatik olarak indirilir ve yerel olarak önbelleğe alınır.</div>' +
'</div>' +
'<div class="calc-card">' +
'<div class="calc-card-title">📊 Evaluate</div>' +
'<div class="calc-card-body">Değerlendirme metrikleri için birleşik bir kütüphane. Doğruluk, F1, BLEU, ROUGE, BERTScore ve yüzlerce metriği destekler. Trainer API ile sorunsuz entegre olarak metrikleri eğitim sırasında otomatik olarak hesaplar.</div>' +
'</div>' +
'<div class="calc-card">' +
'<div class="calc-card-title">🚀 Accelerate</div>' +
'<div class="calc-card-body">Dağıtık eğitimin karmaşıklığını soyutlar. Eğitim döngünüzü bir kez yazın ve minimum kod değişikliğiyle tek GPU, çok GPU, TPU veya birden fazla makine üzerinde çalıştırın. Karışık hassasiyeti (fp16/bf16) şeffaf biçimde yönetir.</div>' +
'</div>' +
'</div>' +

'<h2 class="lesson-title">Kurulum</h2>' +
'<p class="l-text">Temel kütüphaneleri pip ile kurun. Bağımlılık çakışmalarından (özellikle PyTorch ve diğer paketler arasındaki) kaçınmak için sanal bir ortam (conda veya venv) kullanılması şiddetle tavsiye edilir.</p>' +
'<div class="code-wrap"><div class="code-label"><span>BASH</span> HuggingFace Kütüphanelerini Kurma <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="cm"># Temel HuggingFace kütüphanelerini kur</span>\n' +
'pip install transformers datasets tokenizers\n\n' +
'<span class="cm"># PyTorch arka uçlu kurulum (çoğu NLP görevi için önerilir)</span>\n' +
'pip install transformers[torch] datasets tokenizers\n\n' +
'<span class="cm"># Metrikler için evaluate kütüphanesini kur</span>\n' +
'pip install evaluate\n\n' +
'<span class="cm"># Dağıtık eğitim için accelerate kütüphanesini kur</span>\n' +
'pip install accelerate\n\n' +
'<span class="cm"># İnce ayar için tam kurulum (ihtiyacın olan her şey)</span>\n' +
'pip install transformers[torch] datasets tokenizers evaluate accelerate\n\n' +
'<span class="cm"># Kurulumu doğrula</span>\n' +
'python -c <span class="str">"import transformers; print(transformers.__version__)"</span>' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Komutları satır satır okuyalım:</strong> 1) <code>pip install transformers datasets tokenizers</code> ekosistemin üç temel taşını yükler. 2) <code>transformers[torch]</code> eki uyumlu bir PyTorch wheel\'ini de çeker, böylece model çalışma zamanı kutudan çıkar çıkmaz hazırdır. 3) <code>evaluate</code> ve <code>accelerate</code> metrik kütüphanesini ve dağıtık eğitim soyutlamasını ekler. 4) Son satırdaki <code>python -c "import transformers; print(transformers.__version__)"</code> kurulumu test eder ve çözümlenen sürüm dizesini ekrana yazdırır.</p>' +
'<div class="l-note"><strong>GPU Kurulumu:</strong> GPU hızlandırma için önce PyTorch\'u CUDA desteğiyle kurun: <code>pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118</code> (CUDA sürümünü sürücünüze göre ayarlayın). GPU\'nun algılandığını doğrulamak için <code>torch.cuda.is_available()</code> komutunu çalıştırın.</div>' +

'<h2 class="lesson-title">Pipeline API — İlk HuggingFace Modeliniz</h2>' +
'<p class="l-text"><code>pipeline()</code> fonksiyonu, Transformers kütüphanesindeki en üst düzey API\'dir. Modeli indirme, ağırlıkları yükleme, girdiyi tokenize etme, inference çalıştırma ve çıktıyı son işlemeden geçirme dahil tüm model inference iş akışını tek bir çağrılabilir nesneye sarar. Hızlı prototipleme, keşif ve standart görevlerde üretim inference için pipeline\'lar çoğu zaman yeterlidir.</p>' +

'<h4>Duygu Analizi</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Pipeline — Duygu Analizi <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> pipeline\n\n' +
'<span class="cm"># İlk çalıştırmada distilbert-base-uncased-finetuned-sst-2-english indirilir</span>\n' +
'<span class="cm"># (~268MB, ~/.cache/huggingface/hub/ içinde önbelleğe alınır)</span>\n' +
'classifier = <span class="fn">pipeline</span>(<span class="str">"sentiment-analysis"</span>)\n\n' +
'<span class="cm"># Tek dize girişi</span>\n' +
'result = <span class="fn">classifier</span>(<span class="str">"HuggingFace makes NLP incredibly accessible!"</span>)\n' +
'<span class="fn">print</span>(result)\n' +
'<span class="cm"># [{"label": "POSITIVE", "score": 0.9998}]</span>\n\n' +
'<span class="cm"># Batch girişi — tek tek çağırmaktan çok daha hızlı</span>\n' +
'results = <span class="fn">classifier</span>([\n' +
'    <span class="str">"I love this library!"</span>,\n' +
'    <span class="str">"This documentation is confusing."</span>,\n' +
'    <span class="str">"The model performance is acceptable."</span>\n' +
'])\n' +
'<span class="kw">for</span> result <span class="kw">in</span> results:\n' +
'    <span class="fn">print</span>(<span class="str">f"Label: {result[\'label\']}, Score: {result[\'score\']:.4f}"</span>)\n' +
'<span class="cm"># Label: POSITIVE, Score: 0.9998</span>\n' +
'<span class="cm"># Label: NEGATIVE, Score: 0.9987</span>\n' +
'<span class="cm"># Label: POSITIVE, Score: 0.8342</span>\n\n' +
'<span class="cm"># Farklı bir modeli açıkça belirt</span>\n' +
'classifier_multilingual = <span class="fn">pipeline</span>(\n' +
'    <span class="str">"sentiment-analysis"</span>,\n' +
'    model=<span class="str">"nlptown/bert-base-multilingual-uncased-sentiment"</span>\n' +
')' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Bu örnek nasıl çalışıyor:</strong> 1) <code>pipeline("sentiment-analysis")</code> çağrısı varsayılan DistilBERT SST-2 checkpoint\'ine dönüşür ve ilk çağrıda yerel önbelleğe ~268 MB indirir. 2) Tek bir dize verildiğinde, <code>label</code> ve <code>score</code> içeren tek elemanlı bir sözlük listesi döner. 3) Python listesi verildiğinde toplu çıkarım tetiklenir — tokenizer en uzun örneğe göre padding uygular ve tek bir ileri geçişte üç yorum birden işlenir. 4) Açıkça belirtilen <code>model="nlptown/bert-base-multilingual-uncased-sentiment"</code> parametresi, başka hiçbir satıra dokunmadan farklı bir checkpoint\'in nasıl seçilebileceğini gösterir.</p>' +

'<h4>Adlandırılmış Varlık Tanıma (NER)</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Pipeline — Adlandırılmış Varlık Tanıma <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> pipeline\n\n' +
'ner = <span class="fn">pipeline</span>(<span class="str">"ner"</span>, aggregation_strategy=<span class="str">"simple"</span>)\n\n' +
'text = <span class="str">"Elon Musk founded SpaceX in 2002 and Tesla is headquartered in Austin, Texas."</span>\n' +
'entities = <span class="fn">ner</span>(text)\n\n' +
'<span class="kw">for</span> entity <span class="kw">in</span> entities:\n' +
'    <span class="fn">print</span>(<span class="str">f"{entity[\'word\']:20} → {entity[\'entity_group\']:5} ({entity[\'score\']:.3f})"</span>)\n' +
'<span class="cm"># Elon Musk            → PER   (0.999)</span>\n' +
'<span class="cm"># SpaceX               → ORG   (0.998)</span>\n' +
'<span class="cm"># 2002                 → DATE  (0.821)</span>\n' +
'<span class="cm"># Tesla                → ORG   (0.997)</span>\n' +
'<span class="cm"># Austin               → LOC   (0.995)</span>\n' +
'<span class="cm"># Texas                → LOC   (0.993)</span>\n\n' +
'<span class="cm"># aggregation_strategy seçenekleri:</span>\n' +
'<span class="cm"># "none"   — token bazlı skorları olduğu gibi döndürür</span>\n' +
'<span class="cm"># "simple" — aynı türdeki token\'ları birleştirir</span>\n' +
'<span class="cm"># "first"  — gruptaki ilk token\'ın skorunu kullanır</span>\n' +
'<span class="cm"># "average"— grup içindeki skorların ortalamasını alır (en doğrusu)</span>\n' +
'<span class="cm"># "max"    — grup içindeki maksimum skoru kullanır</span>' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>NER çağrısı nasıl işliyor:</strong> 1) <code>pipeline("ner", aggregation_strategy="simple")</code> varsayılan <code>dbmdz/bert-large-cased-finetuned-conll03-english</code> modelini yükler ve aynı varlığa ait alt sözcük token\'larını birleştirir. 2) Model her token\'a bir etiket atar; aggregation stratejisi ardından aynı etikete sahip ardışık token\'ları tek bir aralığa toplar — bu olmadan "Elon" ve "Musk" iki ayrı <code>PER</code> kaydı olarak dönerdi. 3) Döngü, her aralığın <code>word</code>, <code>entity_group</code> ve güven <code>score</code> değerini düzgün biçimde yazdırır. 4) En altta listelenen strateji seçenekleri (<code>none</code>, <code>simple</code>, <code>first</code>, <code>average</code>, <code>max</code>), token\'lar birleştirilirken token başına skorların nasıl indirgeneceğini kontrol eder.</p>' +

'<h4>Metin Üretimi</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Pipeline — Metin Üretimi <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> pipeline\n\n' +
'generator = <span class="fn">pipeline</span>(<span class="str">"text-generation"</span>, model=<span class="str">"gpt2"</span>)\n\n' +
'output = <span class="fn">generator</span>(\n' +
'    <span class="str">"The future of artificial intelligence is"</span>,\n' +
'    max_new_tokens=<span class="num">80</span>,\n' +
'    num_return_sequences=<span class="num">2</span>,    <span class="cm"># 2 farklı tamamlama üret</span>\n' +
'    temperature=<span class="num">0.8</span>,           <span class="cm"># yüksek = daha yaratıcı, düşük = daha deterministik</span>\n' +
'    do_sample=<span class="kw">True</span>,            <span class="cm"># örneklemeyi aç (temperature için gerekli)</span>\n' +
'    top_p=<span class="num">0.92</span>,               <span class="cm"># nucleus sampling eşiği</span>\n' +
'    repetition_penalty=<span class="num">1.2</span>    <span class="cm"># tekrar eden token\'ları cezalandır</span>\n' +
')\n\n' +
'<span class="kw">for</span> i, seq <span class="kw">in</span> <span class="fn">enumerate</span>(output):\n' +
'    <span class="fn">print</span>(<span class="str">f"--- Sequence {i+1} ---"</span>)\n' +
'    <span class="fn">print</span>(seq[<span class="str">"generated_text"</span>])\n' +
'    <span class="fn">print</span>()' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Üretim çağrısı ne yapıyor:</strong> 1) <code>pipeline("text-generation", model="gpt2")</code> klasik 124 M parametreli GPT-2 checkpoint\'ini çeker ve otoregresif örnekleme döngüsünü hazırlar. 2) <code>max_new_tokens=80</code> devamın uzunluğunu sınırlar, <code>num_return_sequences=2</code> ise tek bir toplu çağrıda iki bağımsız tamamlama ister. 3) Örnekleme düğmeleri (<code>do_sample=True</code>, <code>temperature=0.8</code>, <code>top_p=0.92</code>, <code>repetition_penalty=1.2</code>) her adımdaki dağılımı şekillendirir — nucleus sampling kümülatif olasılıkları 0.92\'ye toplanan üst token\'ları tutar, repetition penalty ise papağan gibi tekrarlamayı caydırır. 4) <code>enumerate</code> döngüsü iki farklı tamamlamayı yan yana yazdırır, böylece yaratıcılığı karşılaştırabilirsiniz.</p>' +

'<h4>Özetleme</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Pipeline — Özetleme <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> pipeline\n\n' +
'summarizer = <span class="fn">pipeline</span>(<span class="str">"summarization"</span>, model=<span class="str">"facebook/bart-large-cnn"</span>)\n\n' +
'article = <span class="str">"""</span>\n' +
'<span class="str">HuggingFace was founded in 2016 by Clement Delangue, Julien Chaumond, and</span>\n' +
'<span class="str">Thomas Wolf. The company started as a chatbot app for teenagers before</span>\n' +
'<span class="str">pivoting to focus on NLP infrastructure. In 2018, they released the</span>\n' +
'<span class="str">Transformers library, which quickly became the standard for working with</span>\n' +
'<span class="str">pretrained language models. The library initially supported BERT and GPT-2,</span>\n' +
'<span class="str">but has since expanded to support hundreds of architectures across NLP,</span>\n' +
'<span class="str">computer vision, audio, and multimodal tasks. HuggingFace has raised over</span>\n' +
'<span class="str">$235 million in funding and is valued at approximately $4.5 billion.</span>\n' +
'<span class="str">"""</span>\n\n' +
'summary = <span class="fn">summarizer</span>(article, max_length=<span class="num">60</span>, min_length=<span class="num">20</span>, do_sample=<span class="kw">False</span>)\n' +
'<span class="fn">print</span>(summary[<span class="num">0</span>][<span class="str">"summary_text"</span>])\n' +
'<span class="cm"># HuggingFace was founded in 2016 and pivoted from chatbots to NLP</span>\n' +
'<span class="cm"># infrastructure. They released the Transformers library in 2018, which</span>\n' +
'<span class="cm"># became the standard for pretrained language models.</span>' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Özetleme pipeline\'ı nasıl işliyor:</strong> 1) <code>pipeline("summarization", model="facebook/bart-large-cnn")</code> CNN/DailyMail üzerinde ince ayar yapılmış BART\'ı yükler — haber tarzı soyut özetler için optimize edilmiş bir encoder-decoder. 2) Üç tırnaklı <code>article</code> dizesi BART encoder tarafından bağlamsal vektör dizisine kodlanır. 3) <code>summarizer(article, max_length=60, min_length=20, do_sample=False)</code> decoder\'ı beam search ile (sampling kapalı) çağırır ve çıktı uzunluğunu 20-60 token bandına sınırlar. 4) Dönen liste, üretilen özeti tutan <code>summary_text</code> anahtarlı bir sözlük içerir.</p>' +

'<h4>Sıfır Atımlı Sınıflandırma</h4>' +
'<p class="l-text">Sıfır atımlı sınıflandırma, en güçlü pipeline türlerinden biridir — metni <em>modelin hiç açıkça eğitilmediği</em> kategorilere sınıflandırır. Model, metnin her aday etiketi "ima edip etmediğini" belirlemek için doğal dil çıkarımını (NLI) kullanır.</p>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Pipeline — Sıfır Atımlı Sınıflandırma <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> pipeline\n\n' +
'classifier = <span class="fn">pipeline</span>(<span class="str">"zero-shot-classification"</span>)\n\n' +
'text = <span class="str">"The central bank raised interest rates by 50 basis points to combat inflation."</span>\n\n' +
'<span class="cm"># Bu etiketler eğitim sırasında ASLA görülmedi — model bunlar üzerinde akıl yürütür</span>\n' +
'result = <span class="fn">classifier</span>(\n' +
'    text,\n' +
'    candidate_labels=[<span class="str">"economics"</span>, <span class="str">"sports"</span>, <span class="str">"technology"</span>, <span class="str">"politics"</span>, <span class="str">"entertainment"</span>]\n' +
')\n\n' +
'<span class="fn">print</span>(result[<span class="str">"labels"</span>])   <span class="cm"># ["economics", "politics", "technology", ...]</span>\n' +
'<span class="fn">print</span>(result[<span class="str">"scores"</span>])   <span class="cm"># [0.912, 0.063, 0.014, ...]</span>\n\n' +
'<span class="cm"># Çoklu etiket: birden fazla kategorinin doğru olmasına izin ver</span>\n' +
'result_multi = <span class="fn">classifier</span>(\n' +
'    <span class="str">"New AI model sets record on language benchmarks and generates images"</span>,\n' +
'    candidate_labels=[<span class="str">"NLP"</span>, <span class="str">"computer vision"</span>, <span class="str">"reinforcement learning"</span>, <span class="str">"AI research"</span>],\n' +
'    multi_label=<span class="kw">True</span>  <span class="cm"># skorlar artık bağımsız olasılıklardır</span>\n' +
')' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Sıfır atımlı çağrı ne yapıyor:</strong> 1) <code>pipeline("zero-shot-classification")</code> varsayılan <code>facebook/bart-large-mnli</code> NLI modelini yükler — bir önerme ile hipotez arasındaki çıkarımı (entailment) skorlamak için eğitilmiş. 2) Pipeline içeride girdi <code>text</code>\'ini her <code>candidate_labels</code> öğesiyle eşleştirir — her etiketi "Bu metin ekonomi hakkındadır" gibi bir hipoteze çevirir — ve çift başına bir entailment ileri geçişi çalıştırır. 3) Skorlar etiketler arasında softmax\'lanır ve <code>result["labels"]</code> ile <code>result["scores"]</code> içinde azalan sırada döner. 4) İkinci çağrıda <code>multi_label=True</code> ayarı softmax\'tan etiket başına sigmoid\'e geçirir, böylece AI araştırma örneği hem "NLP" hem de "computer vision" etiketlerini bağımsız biçimde doğru olarak işaretleyebilir.</p>' +

'<h4>Mevcut Pipeline Görevleri</h4>' +
'<div class="calc-cards">' +
'<div class="calc-card"><div class="calc-card-title">NLP Görevleri</div><div class="calc-card-body">' +
'<code>sentiment-analysis</code> · <code>text-classification</code> · <code>token-classification</code> (NER) · <code>ner</code> · <code>question-answering</code> · <code>fill-mask</code> · <code>summarization</code> · <code>translation</code> · <code>text-generation</code> · <code>text2text-generation</code> · <code>zero-shot-classification</code> · <code>conversational</code>' +
'</div></div>' +
'<div class="calc-card"><div class="calc-card-title">Görü Görevleri</div><div class="calc-card-body">' +
'<code>image-classification</code> · <code>object-detection</code> · <code>image-segmentation</code> · <code>zero-shot-image-classification</code> · <code>depth-estimation</code> · <code>image-to-text</code> · <code>visual-question-answering</code>' +
'</div></div>' +
'<div class="calc-card"><div class="calc-card-title">Ses Görevleri</div><div class="calc-card-body">' +
'<code>automatic-speech-recognition</code> · <code>audio-classification</code> · <code>text-to-audio</code> · <code>audio-to-audio</code>' +
'</div></div>' +
'<div class="calc-card"><div class="calc-card-title">Çok Modlu Görevler</div><div class="calc-card-body">' +
'<code>document-question-answering</code> · <code>feature-extraction</code> (gömüler) · <code>image-feature-extraction</code> · <code>mask-generation</code>' +
'</div></div>' +
'</div>' +

'<h2 class="lesson-title">Auto Sınıfları — Mimari Bağımsız Yükleme</h2>' +
'<div class="calc-highlight">' +
'<h4>Neden "Auto"?</h4>' +
'<p class="l-text">HuggingFace ekosistemi yüzlerce model mimarisini destekler — BERT, RoBERTa, DistilBERT, ALBERT, XLNet, GPT-2, T5, BART ve daha pek çoğu. Her mimarinin kendi sınıfı vardır (<code>BertModel</code>, <code>RobertaModel</code> vb.), ancak mimari adlarını sabit kodlamak kodu kırılgan yapar. BERT\'ten RoBERTa\'ya geçerseniz her sınıf referansını güncellemeniz gerekirdi.</p>' +
'<p class="l-text"><strong>Auto sınıfları</strong> bunu şık biçimde çözer: Hub\'daki modelin <code>config.json</code> dosyasını okur, mimariyi otomatik olarak belirler ve doğru sınıfı başlatır. Kodunuz mimari bağımsız hale gelir — model adı dizisini değiştirin, geri kalan her şey otomatik uyum sağlar.</p>' +
'</div>' +

'<h4>AutoModelForSequenceClassification</h4>' +
'<p class="l-text">Metin sınıflandırma görevleri için kullanılır: duygu analizi, konu sınıflandırması, spam tespiti, niyet tespiti. Model, temel transformer encoder\'ın üzerine bir sınıflandırma başlığı (doğrusal katman) ekler.</p>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> AutoModel — Dizi Sınıflandırması <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForSequenceClassification\n' +
'<span class="kw">import</span> torch\n\n' +
'model_name = <span class="str">"distilbert-base-uncased-finetuned-sst-2-english"</span>\n\n' +
'<span class="cm"># AutoTokenizer config\'i okur ve doğru tokenizer\'ı yükler (DistilBertTokenizerFast)</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(model_name)\n\n' +
'<span class="cm"># AutoModelForSequenceClassification DistilBertForSequenceClassification\'ı yükler</span>\n' +
'model = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(model_name)\n\n' +
'<span class="cm"># Tokenize et — tensör sözlüğü döner</span>\n' +
'inputs = <span class="fn">tokenizer</span>(\n' +
'    <span class="str">"HuggingFace is amazing!"</span>,\n' +
'    return_tensors=<span class="str">"pt"</span>,    <span class="cm"># "pt"=PyTorch, "tf"=TensorFlow, "np"=NumPy</span>\n' +
'    truncation=<span class="kw">True</span>,\n' +
'    max_length=<span class="num">512</span>\n' +
')\n' +
'<span class="cm"># inputs = {"input_ids": tensor, "attention_mask": tensor}</span>\n\n' +
'<span class="cm"># İleri geçiş — çıkarım için gradyan hesaplamaya gerek yok</span>\n' +
'<span class="kw">with</span> torch.<span class="fn">no_grad</span>():\n' +
'    outputs = <span class="fn">model</span>(**inputs)\n\n' +
'<span class="cm"># outputs.logits şekli: [batch_size, num_labels] = [1, 2]</span>\n' +
'logits = outputs.logits\n' +
'probabilities = torch.nn.functional.<span class="fn">softmax</span>(logits, dim=-<span class="num">1</span>)\n\n' +
'label_id = logits.<span class="fn">argmax</span>().item()\n' +
'label = model.config.id2label[label_id]\n' +
'score = probabilities[<span class="num">0</span>][label_id].item()\n\n' +
'<span class="fn">print</span>(<span class="str">f"Label: {label}, Score: {score:.4f}"</span>)\n' +
'<span class="cm"># Label: POSITIVE, Score: 0.9998</span>' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Bu parça baştan sona ne yapıyor:</strong> 1) <code>AutoTokenizer.from_pretrained(model_name)</code> ve <code>AutoModelForSequenceClassification.from_pretrained(model_name)</code> checkpoint\'in <code>config.json</code> dosyasını okur ve uygun DistilBERT tokenizer ile sınıflandırma başlığını başlatır. 2) <code>tokenizer(..., return_tensors="pt", truncation=True, max_length=512)</code> çağrısı, PyTorch <code>input_ids</code> ve <code>attention_mask</code> tensörlerini içeren bir sözlük döndürür. 3) İleri geçişi <code>torch.no_grad()</code> ile sarmak çıkarım için autograd\'ı kapatır, ardından <code>model(**inputs)</code> <code>[1, 2]</code> şeklinde logits üretir. 4) <code>softmax</code> logits\'i olasılıklara çevirir, <code>argmax</code> kazanan sınıfı seçer ve <code>model.config.id2label</code> indeksi tekrar "POSITIVE" veya "NEGATIVE" etiketine eşler.</p>' +

'<h4>AutoModelForTokenClassification</h4>' +
'<p class="l-text">Her token\'a etiket atayan görevler için kullanılır: NER, sözcük türü etiketleme, parçalama. Yalnızca <code>[CLS]</code> token\'ında değil, her token konumunda doğrusal sınıflandırma başlığı uygulanır.</p>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> AutoModel — Token Sınıflandırması (NER) <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForTokenClassification\n' +
'<span class="kw">import</span> torch\n\n' +
'model_name = <span class="str">"dslim/bert-base-NER"</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(model_name)\n' +
'model = AutoModelForTokenClassification.<span class="fn">from_pretrained</span>(model_name)\n\n' +
'text = <span class="str">"Barack Obama was born in Honolulu, Hawaii."</span>\n' +
'inputs = <span class="fn">tokenizer</span>(text, return_tensors=<span class="str">"pt"</span>)\n\n' +
'<span class="kw">with</span> torch.<span class="fn">no_grad</span>():\n' +
'    outputs = <span class="fn">model</span>(**inputs)\n\n' +
'<span class="cm"># outputs.logits şekli: [1, sequence_length, num_labels]</span>\n' +
'predictions = outputs.logits.<span class="fn">argmax</span>(dim=-<span class="num">1</span>)[<span class="num">0</span>]\n' +
'tokens = tokenizer.<span class="fn">convert_ids_to_tokens</span>(inputs[<span class="str">"input_ids"</span>][<span class="num">0</span>])\n\n' +
'<span class="kw">for</span> token, pred_id <span class="kw">in</span> <span class="fn">zip</span>(tokens, predictions):\n' +
'    label = model.config.id2label[pred_id.item()]\n' +
'    <span class="kw">if</span> label != <span class="str">"O"</span>:  <span class="cm"># O = herhangi bir varlığın "dışında"</span>\n' +
'        <span class="fn">print</span>(<span class="str">f"{token:15} → {label}"</span>)\n' +
'<span class="cm"># Barack         → B-PER</span>\n' +
'<span class="cm"># Obama          → I-PER</span>\n' +
'<span class="cm"># Honolulu       → B-LOC</span>\n' +
'<span class="cm"># Hawaii         → B-LOC</span>' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Token sınıflandırması nasıl ilerliyor:</strong> 1) <code>AutoTokenizer.from_pretrained("dslim/bert-base-NER")</code> ve <code>AutoModelForTokenClassification.from_pretrained(...)</code> CoNLL-03 NER veri setinde ince ayar yapılmış bir BERT-base yükler. 2) <code>tokenizer(text, return_tensors="pt")</code> cümleyi tek bir PyTorch batch\'i hâline getirir. 3) <code>model(**inputs)</code> <code>[1, sequence_length, num_labels]</code> şeklinde logits döndürür ve <code>argmax(dim=-1)</code> son ekseni token başına tahmin edilen etiket id\'sine indirger. 4) <code>zip(tokens, predictions)</code> ile döngü kurarak <code>"O"</code> (dışında) etiketini filtrelemek, yalnızca bir adlandırılmış varlığa ait token\'ları BIO etiketleriyle birlikte yazdırır.</p>' +

'<h4>AutoModelForCausalLM</h4>' +
'<p class="l-text">Otoregresif metin üretimi (GPT tarzı modeller) için kullanılır. Model, önceki tüm token\'lar verildiğinde bir sonraki token\'ı tahmin eder. Açık uçlu üretim, tamamlama ve talimat ayarlı sohbet modellerinin omurgası olarak kullanılır.</p>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> AutoModel — Nedensel Dil Modeli <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM\n' +
'<span class="kw">import</span> torch\n\n' +
'model_name = <span class="str">"gpt2"</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(model_name)\n' +
'model = AutoModelForCausalLM.<span class="fn">from_pretrained</span>(model_name)\n\n' +
'<span class="cm"># Pad token ayarla (GPT-2\'nin varsayılan pad token\'ı yok)</span>\n' +
'tokenizer.pad_token = tokenizer.eos_token\n\n' +
'prompt = <span class="str">"Machine learning is transforming the way we"</span>\n' +
'inputs = <span class="fn">tokenizer</span>(prompt, return_tensors=<span class="str">"pt"</span>)\n\n' +
'<span class="cm"># generate() otoregresif döngüyü içeride yönetir</span>\n' +
'output_ids = model.<span class="fn">generate</span>(\n' +
'    inputs[<span class="str">"input_ids"</span>],\n' +
'    max_new_tokens=<span class="num">50</span>,\n' +
'    do_sample=<span class="kw">True</span>,\n' +
'    temperature=<span class="num">0.7</span>,\n' +
'    top_k=<span class="num">50</span>,\n' +
'    pad_token_id=tokenizer.eos_token_id\n' +
')\n\n' +
'<span class="cm"># Yalnızca yeni üretilen token\'ları çöz (prompt\'u atla)</span>\n' +
'new_tokens = output_ids[<span class="num">0</span>][inputs[<span class="str">"input_ids"</span>].shape[-<span class="num">1</span>]:]\n' +
'generated_text = tokenizer.<span class="fn">decode</span>(new_tokens, skip_special_tokens=<span class="kw">True</span>)\n' +
'<span class="fn">print</span>(generated_text)' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Causal LM çağrısı ne yapıyor:</strong> 1) <code>AutoTokenizer.from_pretrained("gpt2")</code> ve <code>AutoModelForCausalLM.from_pretrained("gpt2")</code> GPT-2 sözlüğünü ve ağırlıklarını yükler; ardından <code>tokenizer.pad_token = tokenizer.eos_token</code> satırı, GPT-2\'nin gerçek bir pad token\'ı olmaması sorununu aşar. 2) <code>tokenizer(prompt, return_tensors="pt")</code> başlangıç prompt\'unu PyTorch tensörlerine dönüştürür. 3) <code>model.generate(...)</code> otoregresif döngüyü gizler — her adımda önceki çıktıyı geri besler; burada çeşitli çıktı için <code>do_sample=True</code> ile birlikte <code>temperature=0.7</code> ve <code>top_k=50</code> kullanılır. 4) <code>output_ids[0][inputs["input_ids"].shape[-1]:]</code> dilimlemesi orijinal prompt\'u keser, böylece <code>tokenizer.decode</code> yalnızca yeni üretilen devamı yazdırır.</p>' +

'<h4>Auto Sınıfı Çözümleme Zinciri</h4>' +
'<div class="calc-steps">' +
'<div class="calc-step"><div class="calc-step-num">1</div><div class="calc-step-body"><strong><code>from_pretrained("model-adı")</code> çağrısı</strong> — Auto sınıfı bir model tanımlayıcısı alır (Hub adı, yerel yol veya URL).</div></div>' +
'<div class="calc-step"><div class="calc-step-num">2</div><div class="calc-step-body"><strong><code>config.json</code> alınır</strong> — HuggingFace, <code>"model_type"</code> alanını içeren model yapılandırma dosyasını indirir veya okur (örn. <code>"bert"</code>, <code>"roberta"</code>, <code>"distilbert"</code>).</div></div>' +
'<div class="calc-step"><div class="calc-step-num">3</div><div class="calc-step-body"><strong>Model türü Auto eşlemesinde aranır</strong> — <code>AutoModelForSequenceClassification</code>, model türü dizelerini somut sınıflara eşleyen bir sözlük tutar: <code>{"bert": BertForSequenceClassification, "roberta": RobertaForSequenceClassification, ...}</code>.</div></div>' +
'<div class="calc-step"><div class="calc-step-num">4</div><div class="calc-step-body"><strong>Somut sınıf başlatılır</strong> — Doğru mimari sınıfı yapılandırmayla başlatılır. Model ağırlıkları ardından <code>pytorch_model.bin</code> veya parçalı ağırlık dosyalarından yüklenir.</div></div>' +
'<div class="calc-step"><div class="calc-step-num">5</div><div class="calc-step-body"><strong>Yerel olarak önbelleğe alınır</strong> — İndirilen dosyalar <code>~/.cache/huggingface/hub/</code> dizininde saklanır. Sonraki çağrılar önbellekten yüklenir, indirme tamamen atlanır.</div></div>' +
'</div>' +

'<h2 class="lesson-title">HuggingFace Hub</h2>' +
'<p class="l-text"><strong>huggingface.co</strong> adresindeki Hub, ekosistemin hayat bulduğu yerdir. Modeller, veri setleri ve Spaces (demo uygulamaları) için Git tabanlı bir barındırma platformudur. Hub\'ı etkili biçimde nasıl gezineceğinizi ve kullanacağınızı anlamak temel bir beceridir.</p>' +

'<h4>Modellere Göz Atma ve Filtreleme</h4>' +
'<div class="l-note"><strong>Hub Gezinme İpuçları:</strong> huggingface.co/models adresinde sol kenar çubuğunu kullanarak şunlara göre filtreleyin: <strong>Görev</strong> (text-classification, token-classification, text-generation vb.), <strong>Kütüphane</strong> (transformers, diffusers, timm), <strong>Dil</strong> (en, zh, ar vb.), <strong>Veri Seti</strong> (hangi eğitim verisi kullanıldı) ve <strong>Lisans</strong> (apache-2.0, mit, cc-by-4.0). En popüler modelleri bulmak için İndirme veya Beğeni sayısına göre sıralayın. Arama çubuğu, model adları ve model kartı içeriği üzerinde tam metin arama destekler.</div>' +

'<h4>Model Kartlarını Okuma</h4>' +
'<p class="l-text">İyi bir model kartı, gerçekten kullanabileceğiniz bir model ile üretimde sizi şaşırtacak bir model arasındaki farktır. Bir model kartını değerlendirirken şu kritik unsurlara bakın:</p>' +
'<div class="calc-compare">' +
'<div class="calc-compare-col">' +
'<div class="calc-compare-title">Olumlu İşaretler</div>' +
'<ul>' +
'<li>Boyut ve kaynaklarıyla birlikte eğitim verisi açıklaması</li>' +
'<li>Standart veri setlerinde kıyaslama sonuçları (GLUE, SuperGLUE vb.)</li>' +
'<li>Hedeflenen kullanım alanları ve kapsam dışı kullanımlar</li>' +
'<li>Bilinen kısıtlamalar ve önyargı analizi</li>' +
'<li>Karbon ayak izi / eğitim için kullanılan hesaplama</li>' +
'<li>Net lisans beyanı</li>' +
'<li>Beklenen çıktılarla birlikte inference örnekleri</li>' +
'</ul>' +
'</div>' +
'<div class="calc-compare-col">' +
'<div class="calc-compare-title">Dikkat Edilmesi Gereken İşaretler</div>' +
'<ul>' +
'<li>Eğitim verisi belgelenmemiş</li>' +
'<li>Değerlendirme sonucu yok</li>' +
'<li>Önyargı veya adalet analizi yok</li>' +
'<li>Belirsiz veya eksik lisans</li>' +
'<li>Açıklamasız çok az indirme</li>' +
'<li>Topluluk tartışması veya sorun kaydı yok</li>' +
'<li>Bakımsız, yıllardır güncellenmemiş</li>' +
'</ul>' +
'</div>' +
'</div>' +

'<h4>Modelleri Programlı Olarak İndirme</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Hub\'dan Model İndirme <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModel\n' +
'<span class="kw">from</span> huggingface_hub <span class="kw">import</span> snapshot_download, hf_hub_download\n\n' +
'<span class="cm"># Yöntem 1: Auto sınıfları — ilk kullanımda otomatik indirir</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>)\n' +
'model = AutoModel.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>)\n\n' +
'<span class="cm"># Yöntem 2: Belirli bir yerel dizine indir</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(\n' +
'    <span class="str">"bert-base-uncased"</span>,\n' +
'    cache_dir=<span class="str">"./my_models/"</span>  <span class="cm"># özel önbellek konumu</span>\n' +
')\n\n' +
'<span class="cm"># Yöntem 3: Tüm model reposunu klasör olarak indir</span>\n' +
'local_path = <span class="fn">snapshot_download</span>(\n' +
'    repo_id=<span class="str">"sentence-transformers/all-MiniLM-L6-v2"</span>,\n' +
'    local_dir=<span class="str">"./models/minilm"</span>\n' +
')\n' +
'<span class="fn">print</span>(<span class="str">f"Downloaded to: {local_path}"</span>)\n\n' +
'<span class="cm"># Yöntem 4: Repodan tek bir dosya indir</span>\n' +
'config_path = <span class="fn">hf_hub_download</span>(\n' +
'    repo_id=<span class="str">"bert-base-uncased"</span>,\n' +
'    filename=<span class="str">"config.json"</span>\n' +
')\n\n' +
'<span class="cm"># Yerel yoldan yükle (çevrimdışı, internet gerekmez)</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"./models/minilm"</span>)\n' +
'model = AutoModel.<span class="fn">from_pretrained</span>(<span class="str">"./models/minilm"</span>)' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Hub\'dan dosya çekmenin dört yolu:</strong> 1) Varsayılan <code>AutoTokenizer.from_pretrained("bert-base-uncased")</code> ve <code>AutoModel.from_pretrained(...)</code> çağrıları ilk kullanımda standart önbelleğe indirir. 2) <code>cache_dir="./my_models/"</code> eklenmesi önbelleği proje içi bir dizine yönlendirir — Docker imajları veya internetsiz sunucular için kullanışlıdır. 3) <code>snapshot_download(repo_id="sentence-transformers/all-MiniLM-L6-v2", local_dir="./models/minilm")</code> tüm repoyu düz dosyalar olarak çeker; çevrimdışı dağıtım için idealdir. 4) <code>hf_hub_download(repo_id="bert-base-uncased", filename="config.json")</code> tek bir dosya indirir; son iki satır ise modeli yerel <code>./models/minilm</code> klasöründen ağ erişimi olmadan tekrar yükler.</p>' +

'<h4>Modelleri Hub\'a Gönderme</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Modelleri Hub\'a Gönderme <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForSequenceClassification\n' +
'<span class="kw">from</span> huggingface_hub <span class="kw">import</span> login\n\n' +
'<span class="cm"># Kimlik doğrula — token\'ını huggingface.co/settings/tokens adresinden al</span>\n' +
'<span class="fn">login</span>(token=<span class="str">"hf_your_token_here"</span>)  <span class="cm"># veya HF_TOKEN ortam değişkenini ayarla</span>\n\n' +
'<span class="cm"># İnce ayar veya eğitimden sonra Hub\'a gönder</span>\n' +
'model_name = <span class="str">"my-username/my-sentiment-model"</span>\n\n' +
'<span class="cm"># Model ağırlıklarını ve config\'i gönder</span>\n' +
'model.<span class="fn">push_to_hub</span>(model_name)\n\n' +
'<span class="cm"># Tokenizer\'ı gönder</span>\n' +
'tokenizer.<span class="fn">push_to_hub</span>(model_name)\n\n' +
'<span class="cm"># Alternatif: önce yerel olarak kaydet, sonra gönder</span>\n' +
'model.<span class="fn">save_pretrained</span>(<span class="str">"./my-model-local"</span>)\n' +
'tokenizer.<span class="fn">save_pretrained</span>(<span class="str">"./my-model-local"</span>)\n\n' +
'<span class="cm"># Tüm yerel klasörü Hub\'a gönder</span>\n' +
'<span class="kw">from</span> huggingface_hub <span class="kw">import</span> HfApi\n' +
'api = <span class="fn">HfApi</span>()\n' +
'api.<span class="fn">upload_folder</span>(\n' +
'    folder_path=<span class="str">"./my-model-local"</span>,\n' +
'    repo_id=model_name,\n' +
'    repo_type=<span class="str">"model"</span>\n' +
')' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Hub\'a yayımlama nasıl çalışıyor:</strong> 1) <code>login(token="hf_your_token_here")</code> mevcut süreci kimliklendirir — alternatif olarak <code>HF_TOKEN</code> ortam değişkenini ayarlayarak gizli anahtarın kodda hiç görünmemesini sağlayabilirsiniz. 2) <code>model.push_to_hub(model_name)</code> ve <code>tokenizer.push_to_hub(model_name)</code> repo\'yu oluşturur (ya da günceller), ardından ağırlıkları, <code>config.json</code>\'u ve tokenizer dosyalarını Git LFS üzerinden yükler. 3) Alternatif <code>model.save_pretrained("./my-model-local")</code> + <code>tokenizer.save_pretrained(...)</code> yolu aynı dosyaları önce yerel olarak aynalar. 4) <code>HfApi().upload_folder(folder_path=..., repo_id=..., repo_type="model")</code> ardından tüm dizini tek seferde gönderir — ek dosyalar (model kartı, değerlendirme sonuçları) ağırlıkların yanında durduğunda kullanışlıdır.</p>' +

'<h2 class="lesson-title">Datasets Kütüphanesi</h2>' +
'<p class="l-text"><code>datasets</code> kütüphanesi, HuggingFace ekosisteminde ML veri setlerini yüklemenin, işlemenin ve paylaşmanın standart yoludur. Kullanılabilir RAM\'inizi aşan veri setleriyle çalışabilmek için sıfır kopyalı okumalar ve bellek eşlemesi sağlayan Apache Arrow altyapısını kullanır.</p>' +

'<h4><code>load_dataset</code> ile Veri Seti Yükleme</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Veri Seti Yükleme <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset\n\n' +
'<span class="cm"># IMDB duygu analizi veri setini yükle</span>\n' +
'dataset = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>)\n' +
'<span class="fn">print</span>(dataset)\n' +
'<span class="cm"># DatasetDict({</span>\n' +
'<span class="cm">#     train: Dataset({features: ["text", "label"], num_rows: 25000}),</span>\n' +
'<span class="cm">#     test:  Dataset({features: ["text", "label"], num_rows: 25000})</span>\n' +
'<span class="cm"># })</span>\n\n' +
'<span class="cm"># Bölümlere eriş</span>\n' +
'train_data = dataset[<span class="str">"train"</span>]\n' +
'test_data  = dataset[<span class="str">"test"</span>]\n\n' +
'<span class="cm"># Tek tek örneklere eriş (sözlük benzeri)</span>\n' +
'sample = train_data[<span class="num">0</span>]\n' +
'<span class="fn">print</span>(sample[<span class="str">"text"</span>][:100])  <span class="cm"># yorumun ilk 100 karakteri</span>\n' +
'<span class="fn">print</span>(sample[<span class="str">"label"</span>])      <span class="cm"># 0 = negatif, 1 = pozitif</span>\n\n' +
'<span class="cm"># Yalnızca train bölümünü yükle</span>\n' +
'train_only = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>, split=<span class="str">"train"</span>)\n\n' +
'<span class="cm"># Belirli bir yüzdeyi yükle (hızlı deneyler için kullanışlı)</span>\n' +
'small_train = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>, split=<span class="str">"train[:10%]"</span>)\n\n' +
'<span class="cm"># Yerel CSV dosyasından yükle</span>\n' +
'local_dataset = <span class="fn">load_dataset</span>(<span class="str">"csv"</span>, data_files=<span class="str">"./my_data.csv"</span>)\n\n' +
'<span class="cm"># JSON dosyasından yükle</span>\n' +
'json_dataset = <span class="fn">load_dataset</span>(<span class="str">"json"</span>, data_files=<span class="str">"./my_data.jsonl"</span>)' +
'</code></pre></div></div>' +
'<p class="l-text"><strong><code>load_dataset</code> veriyi nasıl sunuyor:</strong> 1) <code>load_dataset("imdb")</code> IMDb duygu derlemini indirir ve her biri bellek eşlemeli bir Apache Arrow tablosuyla desteklenen <code>train</code> ile <code>test</code> bölümlerini içeren bir <code>DatasetDict</code> döndürür. 2) <code>train_data[0]</code> ile indeksleme, yorumun <code>text</code> ve etiketinin <code>label</code> (0 = negatif, 1 = pozitif) tamsayısını içeren bir Python sözlüğü döndürür. 3) <code>split="train"</code> argümanı dict sarmalayıcıyı atlar ve tek bir <code>Dataset</code> döndürür; <code>split="train[:10%]"</code> dilimi yalnızca ilk yüzde onunu yükler — hızlı denemeler için mükemmel. 4) Son iki çağrı yerel dosya yüklemeyi gösterir: <code>load_dataset("csv", data_files=...)</code> ve <code>load_dataset("json", data_files=...)</code> kendi dosyalarınızı aynı Arrow tabanlı API\'ye sarar.</p>' +

'<h4>Veri Seti İşlemleri</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Veri Seti İşlemleri — map, filter, shuffle <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset\n' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer\n\n' +
'dataset = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>)\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>)\n\n' +
'<span class="cm"># .map() — her örneğe (veya batch\'e) bir fonksiyon uygular</span>\n' +
'<span class="kw">def</span> <span class="fn">tokenize_function</span>(examples):\n' +
'    <span class="kw">return</span> <span class="fn">tokenizer</span>(\n' +
'        examples[<span class="str">"text"</span>],\n' +
'        truncation=<span class="kw">True</span>,\n' +
'        max_length=<span class="num">512</span>,\n' +
'        padding=<span class="str">"max_length"</span>\n' +
'    )\n\n' +
'tokenized = dataset.<span class="fn">map</span>(\n' +
'    tokenize_function,\n' +
'    batched=<span class="kw">True</span>,          <span class="cm"># hız için batch hâlinde işle</span>\n' +
'    num_proc=<span class="num">4</span>,            <span class="cm"># 4 CPU çekirdeği kullan</span>\n' +
'    remove_columns=[<span class="str">"text"</span>] <span class="cm"># tokenize ettikten sonra ham metin sütununu at</span>\n' +
')\n\n' +
'<span class="cm"># .filter() — yalnızca bir koşulu sağlayan örnekleri tut</span>\n' +
'long_reviews = dataset[<span class="str">"train"</span>].<span class="fn">filter</span>(\n' +
'    <span class="kw">lambda</span> example: <span class="fn">len</span>(example[<span class="str">"text"</span>]) > <span class="num">500</span>\n' +
')\n\n' +
'<span class="cm"># .shuffle() — veri setini rastgele sırala</span>\n' +
'shuffled = dataset[<span class="str">"train"</span>].<span class="fn">shuffle</span>(seed=<span class="num">42</span>)\n\n' +
'<span class="cm"># .select() — belirli indeksleri seç</span>\n' +
'subset = dataset[<span class="str">"train"</span>].<span class="fn">select</span>(<span class="fn">range</span>(<span class="num">1000</span>))  <span class="cm"># ilk 1000 örnek</span>\n\n' +
'<span class="cm"># .sort() — bir sütuna göre sırala</span>\n' +
'sorted_data = dataset[<span class="str">"train"</span>].<span class="fn">sort</span>(<span class="str">"label"</span>)\n\n' +
'<span class="cm"># .rename_column() — bir sütunu yeniden adlandır</span>\n' +
'renamed = dataset.<span class="fn">rename_column</span>(<span class="str">"label"</span>, <span class="str">"sentiment"</span>)\n\n' +
'<span class="cm"># İşlemleri zincirle (her biri yeni bir Dataset döndürür)</span>\n' +
'processed = (\n' +
'    dataset[<span class="str">"train"</span>]\n' +
'    .<span class="fn">shuffle</span>(seed=<span class="num">42</span>)\n' +
'    .<span class="fn">select</span>(<span class="fn">range</span>(<span class="num">5000</span>))\n' +
'    .<span class="fn">filter</span>(<span class="kw">lambda</span> x: <span class="fn">len</span>(x[<span class="str">"text"</span>]) > <span class="num">100</span>)\n' +
')' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Bu parçadaki veri seti dönüşümleri:</strong> 1) <code>tokenize_function</code>, BERT tokenizer\'ını <code>truncation=True</code>, <code>max_length=512</code> ve sabit uzunluklu padding ile sarar; böylece her örnek tek tip bir tensöre dönüşür. 2) <code>dataset.map(tokenize_function, batched=True, num_proc=4, remove_columns=["text"])</code> bu fonksiyonu tüm bölümlere 4 CPU çekirdeği üzerinde paralel uygular ve tokenizasyon bittiğinde ham metni atar — sonuç diske önbelleğe alınır, sonraki çalıştırmalarda anında yüklenir. 3) <code>filter</code>, <code>shuffle</code>, <code>select</code>, <code>sort</code> ve <code>rename_column</code> her biri orijinali değiştirmeden yepyeni bir tembel <code>Dataset</code> döndürür. 4) Sondaki zincirlenmiş pipeline (<code>.shuffle().select().filter()</code>) bu operasyonların tek bir bildirimsel ön işleme tarifine nasıl bestelendiğini gösterir.</p>' +

'<h4>DatasetDict: Eğitim/Doğrulama/Test Bölümleriyle Çalışma</h4>' +
'<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> DatasetDict — Train/Val/Test Bölümleri <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset, DatasetDict, Dataset\n\n' +
'<span class="cm"># Birçok veri seti zaten bölümlere sahiptir</span>\n' +
'glue = <span class="fn">load_dataset</span>(<span class="str">"glue"</span>, <span class="str">"sst2"</span>)  <span class="cm"># train, validation, test</span>\n' +
'<span class="fn">print</span>(glue.keys())  <span class="cm"># dict_keys(["train", "validation", "test"])</span>\n\n' +
'<span class="cm"># Yalnızca train/test\'i olan bir veri setinden validation oluştur</span>\n' +
'dataset = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>)\n\n' +
'<span class="cm"># Train\'i train (%90) ve validation (%10) olarak böl</span>\n' +
'train_val = dataset[<span class="str">"train"</span>].<span class="fn">train_test_split</span>(test_size=<span class="num">0.1</span>, seed=<span class="num">42</span>)\n\n' +
'<span class="cm"># Üç bölümün tamamını içeren bir DatasetDict olarak yeniden derle</span>\n' +
'split_dataset = DatasetDict({\n' +
'    <span class="str">"train"</span>: train_val[<span class="str">"train"</span>],\n' +
'    <span class="str">"validation"</span>: train_val[<span class="str">"test"</span>],\n' +
'    <span class="str">"test"</span>: dataset[<span class="str">"test"</span>]\n' +
'})\n\n' +
'<span class="fn">print</span>(split_dataset)\n' +
'<span class="cm"># DatasetDict({</span>\n' +
'<span class="cm">#     train:      Dataset({num_rows: 22500}),</span>\n' +
'<span class="cm">#     validation: Dataset({num_rows: 2500}),</span>\n' +
'<span class="cm">#     test:       Dataset({num_rows: 25000})</span>\n' +
'<span class="cm"># })</span>\n\n' +
'<span class="cm"># Tüm bölümlere aynı anda map uygula</span>\n' +
'tokenized = split_dataset.<span class="fn">map</span>(tokenize_function, batched=<span class="kw">True</span>)\n\n' +
'<span class="cm"># Ön işlenmiş veri setini diske kaydet (Arrow formatı — yeniden yükleme çok hızlı)</span>\n' +
'tokenized.<span class="fn">save_to_disk</span>(<span class="str">"./tokenized_imdb"</span>)\n\n' +
'<span class="cm"># Sonradan yeniden yükle — tekrar tokenize etmeye gerek yok</span>\n' +
'<span class="kw">from</span> datasets <span class="kw">import</span> load_from_disk\n' +
'tokenized = <span class="fn">load_from_disk</span>(<span class="str">"./tokenized_imdb"</span>)' +
'</code></pre></div></div>' +
'<p class="l-text"><strong>Bölümler nasıl bir araya getirilip kaydediliyor:</strong> 1) <code>load_dataset("glue", "sst2")</code>, zaten <code>train</code>, <code>validation</code> ve <code>test</code> ile gelen bir derlemi gösterir — <code>glue.keys()</code> bu düzeni doğrular. 2) Yalnızca train/test bulunan IMDb için <code>dataset["train"].train_test_split(test_size=0.1, seed=42)</code> tekrarlanabilir rastgelelikle %10\'luk bir validation dilimi oluşturur. 3) Üç parçayı bir <code>DatasetDict</code> içine sarmak train/val/test\'i yan yana tutar, böylece <code>split_dataset.map(tokenize_function, batched=True)</code> her bölümü tek bir çağrıda tokenize eder. 4) <code>tokenized.save_to_disk("./tokenized_imdb")</code> ön işlenmiş Arrow dosyalarını kalıcılaştırır, sonradan yapılan <code>load_from_disk(...)</code> ise yeniden tokenize etmeden anında geri yükler.</p>' +

'<div class="l-note"><strong>Büyük Veri Setlerini Akıtma:</strong> Bazı veri setleri tamamen indirilemeyecek kadar büyüktür (örn. The Pile, LAION-5B, Common Crawl). İndirmeden yinelemek için <code>streaming=True</code> kullanın: <code>dataset = load_dataset("c4", "en", streaming=True)</code>. Akış modunda <code>.map()</code> ve <code>.filter()</code> gibi işlemler hâlâ çalışır ancak yineledikçe tembelce uygulanır. Örneklere rastgele erişemez veya tüm veri setini karıştıramazsınız, ancak <code>.shuffle(buffer_size=10000)</code> ile kayan bir arabelleği karıştırabilirsiniz. Akış, disk alanı sınırlı makinelerde çok terabaytlık veri setleriyle çalışırken vazgeçilmezdir.</div>' +

'<h2 class="lesson-title">HuggingFace Ekosistemi Mimarisi</h2>' +
'<p class="l-text">Aşağıdaki diyagram, HuggingFace ekosisteminin başlıca bileşenlerinin merkezi Hub\'dan eğitim ve inference kodunuza kadar nasıl bağlandığını ve etkileşime girdiğini göstermektedir.</p>' +
'<div class="calc-graph">' +
'<svg viewBox="0 0 820 560" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:820px;display:block;margin:0 auto;">' +

'<defs>' +
'<marker id="arrow-hf" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">' +
'<polygon points="0 0, 10 3.5, 0 7" fill="#888"/>' +
'</marker>' +
'<filter id="glow-hf" x="-20%" y="-20%" width="140%" height="140%">' +
'<feGaussianBlur stdDeviation="3" result="blur"/>' +
'<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
'</filter>' +
'</defs>' +

'<!-- Background -->' +
'<rect width="820" height="560" fill="#1a1a2e" rx="12"/>' +

'<!-- Title -->' +
'<text x="410" y="36" text-anchor="middle" font-family="monospace" font-size="15" font-weight="bold" fill="#c8a96e">HuggingFace Ecosystem Architecture</text>' +

'<!-- HUB (center) -->' +
'<rect x="310" y="195" width="200" height="90" rx="12" fill="#2a2a4a" stroke="#c8a96e" stroke-width="2.5" filter="url(#glow-hf)"/>' +
'<text x="410" y="232" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#c8a96e">🌐 HuggingFace Hub</text>' +
'<text x="410" y="252" text-anchor="middle" font-family="monospace" font-size="10" fill="#aaa">huggingface.co</text>' +
'<text x="410" y="270" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">Models · Datasets · Spaces</text>' +

'<!-- Transformers -->' +
'<rect x="60" y="80" width="170" height="80" rx="10" fill="#1e2d1e" stroke="#4ecdc4" stroke-width="2"/>' +
'<text x="145" y="112" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#4ecdc4">🤗 Transformers</text>' +
'<text x="145" y="130" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">AutoModel / Pipeline</text>' +
'<text x="145" y="146" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">PyTorch · TF · JAX</text>' +

'<!-- Tokenizers -->' +
'<rect x="60" y="210" width="170" height="80" rx="10" fill="#1e2d1e" stroke="#4ecdc4" stroke-width="2"/>' +
'<text x="145" y="242" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#4ecdc4">⚡ Tokenizers</text>' +
'<text x="145" y="260" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">BPE · WordPiece</text>' +
'<text x="145" y="276" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">Rust backend · Fast</text>' +

'<!-- Datasets -->' +
'<rect x="60" y="340" width="170" height="80" rx="10" fill="#1e2d1e" stroke="#4ecdc4" stroke-width="2"/>' +
'<text x="145" y="372" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#4ecdc4">📦 Datasets</text>' +
'<text x="145" y="390" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">load_dataset · map</text>' +
'<text x="145" y="406" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">Arrow · Streaming</text>' +

'<!-- Evaluate -->' +
'<rect x="590" y="80" width="170" height="80" rx="10" fill="#2d1e1e" stroke="#ff4b4b" stroke-width="2"/>' +
'<text x="675" y="112" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#ff4b4b">📊 Evaluate</text>' +
'<text x="675" y="130" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">Accuracy · F1 · BLEU</text>' +
'<text x="675" y="146" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">ROUGE · BERTScore</text>' +

'<!-- Accelerate -->' +
'<rect x="590" y="210" width="170" height="80" rx="10" fill="#2d1e1e" stroke="#ff4b4b" stroke-width="2"/>' +
'<text x="675" y="242" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#ff4b4b">🚀 Accelerate</text>' +
'<text x="675" y="260" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">Multi-GPU · TPU</text>' +
'<text x="675" y="276" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">fp16/bf16 · FSDP</text>' +

'<!-- PEFT -->' +
'<rect x="590" y="340" width="170" height="80" rx="10" fill="#2d1e1e" stroke="#ff4b4b" stroke-width="2"/>' +
'<text x="675" y="372" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#ff4b4b">🎯 PEFT</text>' +
'<text x="675" y="390" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">LoRA · QLoRA · Prefix</text>' +
'<text x="675" y="406" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">Parameter-Efficient FT</text>' +

'<!-- Your Code -->' +
'<rect x="300" y="400" width="220" height="80" rx="10" fill="#1a2a1a" stroke="#c8a96e" stroke-width="1.5" stroke-dasharray="6,3"/>' +
'<text x="410" y="432" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#c8a96e">💻 Your Code</text>' +
'<text x="410" y="452" text-anchor="middle" font-family="monospace" font-size="9" fill="#aaa">Training · Fine-Tuning</text>' +
'<text x="410" y="468" text-anchor="middle" font-family="monospace" font-size="9" fill="#888">Inference · Deployment</text>' +

'<!-- Arrows: Hub ↔ Transformers -->' +
'<line x1="310" y1="225" x2="232" y2="133" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +
'<line x1="228" y1="136" x2="308" y2="228" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +

'<!-- Arrows: Hub ↔ Tokenizers -->' +
'<line x1="310" y1="240" x2="232" y2="248" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +
'<line x1="232" y1="252" x2="312" y2="244" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +

'<!-- Arrows: Hub ↔ Datasets -->' +
'<line x1="310" y1="270" x2="232" y2="360" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +
'<line x1="230" y1="362" x2="308" y2="272" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +

'<!-- Arrows: Hub ↔ Evaluate -->' +
'<line x1="510" y1="225" x2="588" y2="133" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +

'<!-- Arrows: Hub ↔ Accelerate -->' +
'<line x1="510" y1="240" x2="588" y2="248" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +

'<!-- Arrows: Hub ↔ PEFT -->' +
'<line x1="510" y1="270" x2="588" y2="360" stroke="#888" stroke-width="1.5" marker-end="url(#arrow-hf)"/>' +

'<!-- Arrow: Hub → Your Code -->' +
'<line x1="410" y1="285" x2="410" y2="398" stroke="#c8a96e" stroke-width="2" marker-end="url(#arrow-hf)" stroke-dasharray="5,3"/>' +

'<!-- Download label -->' +
'<text x="425" y="346" font-family="monospace" font-size="9" fill="#c8a96e">from_pretrained()</text>' +

'<!-- Legend -->' +
'<rect x="30" y="510" width="12" height="12" fill="none" stroke="#4ecdc4" stroke-width="2"/>' +
'<text x="48" y="521" font-family="monospace" font-size="9" fill="#aaa">Core libraries</text>' +
'<rect x="150" y="510" width="12" height="12" fill="none" stroke="#ff4b4b" stroke-width="2"/>' +
'<text x="168" y="521" font-family="monospace" font-size="9" fill="#aaa">Training utilities</text>' +
'<rect x="290" y="510" width="12" height="12" fill="none" stroke="#c8a96e" stroke-width="2"/>' +
'<text x="308" y="521" font-family="monospace" font-size="9" fill="#aaa">Hub (central platform)</text>' +

'</svg>' +
'</div>' +

'<div class="calc-example">' +
'<strong>Sonraki Adımlar:</strong> HuggingFace ekosistemini anladığınıza göre, bir sonraki ders derinlemesine <strong>Tokenizer</strong>\'ı ele alıyor — transformer modellerinin tükettiği ham metni sayısal tensörlere dönüştüren kritik ön işleme adımı. Alt sözcük tokenizasyon algoritmalarını (BPE, WordPiece), özel token\'ları, dolgu ve kırpma stratejilerini ve tokenizasyon seçimlerinin model performansını nasıl önemli ölçüde etkileyebileceğini öğreneceksiniz.' +
'</div>'
};

