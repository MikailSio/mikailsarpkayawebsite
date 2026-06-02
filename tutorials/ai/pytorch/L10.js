window.PYTORCH_L10 = {

en: `<p class="l-text"><strong>Why train a 110M-parameter BERT from scratch when someone already did it on Wikipedia + BookCorpus and uploaded the weights?</strong> Transfer learning is the practitioner's superpower: take a model pretrained on a huge generic corpus, swap in a small task-specific head, train for a few epochs on your tiny labeled dataset, and beat the from-scratch baseline by enormous margins. The math has not changed -- gradient descent, cross-entropy, the same transformer encoder -- only the starting point.</p>

<p class="l-text">In this lesson we cover the full transfer-learning toolbox in PyTorch: <code>torch.hub</code> for ImageNet CNNs, the HuggingFace ecosystem for NLP, freezing/unfreezing patterns, layer-wise learning rates, and a complete BERT sentiment fine-tuning example. By the end you will have a recipe you can paste into any new project and get a strong baseline in under an hour.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Load pretrained models with <code>torch.hub</code> and <code>AutoModel.from_pretrained</code></li>
<li>Replace the classification head and freeze backbone layers via <code>requires_grad=False</code></li>
<li>Apply layer-wise learning rates: lower LR for the encoder, higher for the new head</li>
<li>Fine-tune <code>bert-base-uncased</code> on IMDB sentiment with the HuggingFace <code>Trainer</code></li>
<li>Decide between feature extraction, partial unfreezing, and full fine-tuning per dataset size</li>
<li>Avoid catastrophic forgetting with discriminative learning rates and small epoch counts</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Transfer Learning Wins</h2>

<p class="l-text">Modern pretrained models are trained on data and compute most teams cannot afford. BERT-base saw ~3.3B words across BookCorpus and Wikipedia, GPT-3 saw ~500B tokens, RoBERTa saw 160GB of text. They learned general linguistic structure: syntax, morphology, common-sense facts, basic reasoning. When you fine-tune on a few thousand sentiment-labeled tweets, you reuse all of that for free. Your task only has to learn the last bit: "in this domain, these features map to those labels".</p>

<div class="calc-highlight"><strong>Rule of thumb:</strong> if your labeled dataset is under 100k examples, fine-tuning a pretrained transformer almost always beats training a custom architecture from scratch -- often by 10-30 F1 points on standard NLP benchmarks.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pretraining</div><div class="card-body">Self-supervised: masked LM, next-token prediction. No labels needed, billions of tokens cheap.</div></div>
<div class="calc-card"><div class="card-title">Fine-tuning</div><div class="card-body">Supervised: small labeled dataset, task-specific head, few epochs.</div></div>
<div class="calc-card"><div class="card-title">Feature extraction</div><div class="card-body">Freeze the backbone, train only the head. Cheapest but slightly weaker.</div></div>
<div class="calc-card"><div class="card-title">Full fine-tune</div><div class="card-body">Update everything with small learning rate. Strongest on most tasks.</div></div>
<div class="calc-card"><div class="card-title">Adapter / LoRA</div><div class="card-body">Small trainable modules inserted into the backbone. ~1% of params, near full performance.</div></div>
<div class="calc-card"><div class="card-title">Domain adaptation</div><div class="card-body">Continue MLM pretraining on your unlabeled domain text before fine-tuning.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: sentiment on 5k tweets</div><div class="example-body">Custom BiLSTM trained from scratch with random embeddings: ~78% accuracy. Same BiLSTM with GloVe embeddings: ~82%. BERT-base fine-tuned for 3 epochs: ~91%. Same BERT after MLM-continued-pretraining on 1M unlabeled tweets first: ~92.5%. Each step roughly halves the remaining error -- this is why transfer learning has displaced from-scratch training in production NLP.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. torch.hub: Pretrained Models from PyTorch</h2>

<p class="l-text"><code>torch.hub</code> is PyTorch's built-in model zoo. One line downloads weights and returns a ready-to-use model. It is mostly used for vision (ResNet, EfficientNet) but supports any GitHub repo that defines a <code>hubconf.py</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># 1) Load pretrained ResNet-50 trained on ImageNet (1000 classes)</span>
model = torch.hub.<span class="fn">load</span>(<span class="str">"pytorch/vision"</span>, <span class="str">"resnet50"</span>, weights=<span class="str">"DEFAULT"</span>)
model.<span class="fn">eval</span>()
<span class="fn">print</span>(<span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>()) / <span class="num">1e6</span>, <span class="str">"M params"</span>)  <span class="cm"># ~25.6 M</span>

<span class="cm"># 2) Inspect the architecture</span>
<span class="fn">print</span>(model.fc)        <span class="cm"># Linear(in_features=2048, out_features=1000, bias=True)</span>

<span class="cm"># 3) Replace the classification head for your own task (e.g. 5-class problem)</span>
num_classes = <span class="num">5</span>
model.fc = nn.<span class="fn">Linear</span>(model.fc.in_features, num_classes)
<span class="fn">print</span>(model.fc)        <span class="cm"># Linear(in_features=2048, out_features=5, bias=True)</span>

<span class="cm"># 4) Forward a dummy ImageNet-shaped input</span>
x = torch.<span class="fn">randn</span>(<span class="num">1</span>, <span class="num">3</span>, <span class="num">224</span>, <span class="num">224</span>)
out = <span class="fn">model</span>(x)
<span class="fn">print</span>(out.shape)       <span class="cm"># (1, 5)</span>

<span class="cm"># 5) See what hub repos are available</span>
<span class="cm"># print(torch.hub.list("pytorch/vision"))</span>
<span class="cm"># Returns ['alexnet', 'convnext_base', 'densenet121', 'efficientnet_b0', ...]</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Transfer learning concept demo: PCA on iris (a 'pretrained projector') + LogReg classifier head. The projection acts as a frozen feature extractor.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X = df_iris.iloc[:, :4].values
y = df_iris.iloc[:, 4].astype('category').cat.codes.values
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)

# 1. "Pretrained" feature extractor (PCA fit once, then frozen)
pca = PCA(n_components=2).fit(X_tr)

# 2. Use the frozen features to train a classifier head
F_tr = pca.transform(X_tr)
F_te = pca.transform(X_te)
clf = LogisticRegression(max_iter=500).fit(F_tr, y_tr)
acc = accuracy_score(y_te, clf.predict(F_te))
print(f'transfer-learning style accuracy: {acc:.3f}')
print('PCA explained variance:', pca.explained_variance_ratio_.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Downloads ResNet-50 weights pretrained on ImageNet via <code>torch.hub.load</code>. <code>weights="DEFAULT"</code> picks the latest recommended checkpoint. The model has 25.6M parameters and outputs 1000-class logits. 2) Inspects the final classification layer <code>model.fc</code>: a Linear from 2048 features to 1000 classes. 3) Replaces it with a new untrained Linear for our 5-class problem. The rest of the network -- all the convolutional feature extractors -- keeps its pretrained weights and the rich visual representations they encode. 4) Verifies the new model accepts standard ImageNet inputs and produces 5-class outputs. 5) <code>torch.hub.list</code> shows all available models in the repo; you can swap "resnet50" for any of them.</p>

<div class="l-note"><strong>For NLP:</strong> <code>torch.hub</code> works but the standard is HuggingFace transformers (next section). You almost never load a pretrained NLP model via <code>torch.hub</code> in production -- the <code>transformers</code> API is richer and the model coverage is much wider.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. HuggingFace transformers: the NLP Standard</h2>

<p class="l-text">The <code>transformers</code> library is the de facto NLP model hub. Tens of thousands of pretrained checkpoints, a unified API for tokenization and modeling, and tight PyTorch integration. If you do NLP, you live in this library.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers</span>
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModel
<span class="kw">import</span> torch

<span class="cm"># 1) Load tokenizer + model from the Hub</span>
checkpoint = <span class="str">"bert-base-uncased"</span>
tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(checkpoint)
model = AutoModel.<span class="fn">from_pretrained</span>(checkpoint)
model.<span class="fn">eval</span>()

<span class="cm"># 2) Tokenize a batch of sentences</span>
texts = [
    <span class="str">"I love this movie."</span>,
    <span class="str">"The plot was confusing and the acting wooden."</span>
]
enc = <span class="fn">tokenizer</span>(texts, padding=<span class="kw">True</span>, truncation=<span class="kw">True</span>, max_length=<span class="num">64</span>, return_tensors=<span class="str">"pt"</span>)
<span class="fn">print</span>(enc.<span class="fn">keys</span>())                    <span class="cm"># ['input_ids', 'attention_mask']</span>
<span class="fn">print</span>(enc[<span class="str">"input_ids"</span>].shape)         <span class="cm"># (2, T)</span>

<span class="cm"># 3) Forward pass: get contextual embeddings</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**enc)
<span class="fn">print</span>(out.last_hidden_state.shape)    <span class="cm"># (2, T, 768) -- per-token vectors</span>
<span class="fn">print</span>(out.pooler_output.shape)        <span class="cm"># (2, 768)    -- "[CLS]" sentence vector</span>

<span class="cm"># 4) Different model classes for different tasks</span>
<span class="kw">from</span> transformers <span class="kw">import</span> (
    AutoModelForSequenceClassification,    <span class="cm"># sentiment, topic, NLI</span>
    AutoModelForTokenClassification,        <span class="cm"># NER, POS</span>
    AutoModelForQuestionAnswering,          <span class="cm"># SQuAD-style</span>
    AutoModelForMaskedLM,                   <span class="cm"># MLM (continue pretraining)</span>
    AutoModelForCausalLM,                   <span class="cm"># GPT-style generation</span>
    AutoModelForSeq2SeqLM,                  <span class="cm"># T5, BART -- summarize, translate</span>
)

<span class="cm"># 5) Load a model with a fresh classification head</span>
seq_clf = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(
    <span class="str">"bert-base-uncased"</span>,
    num_labels=<span class="num">2</span>                       <span class="cm"># binary sentiment</span>
)
<span class="fn">print</span>(seq_clf.classifier)             <span class="cm"># Linear(768, 2) -- the new head</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Concept of HuggingFace fine-tuning: replace torch transformer + BERT tokenizer with sklearn TF-IDF + LogReg on df_reviews. Same I/O, runnable here.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)
# tokenize -> embed -> classify
vec = TfidfVectorizer(max_features=2000, ngram_range=(1, 2))
clf = LogisticRegression(max_iter=500, C=1.0)
clf.fit(vec.fit_transform(X_tr), y_tr)
acc = accuracy_score(y_te, clf.predict(vec.transform(X_te)))
print(f'mock fine-tune accuracy: {acc:.3f}')
print('vocab size (~ token embeddings):', len(vec.vocabulary_))
print('sample predictions:', list(zip(clf.predict(vec.transform(X_te[:5])), y_te[:5])))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>AutoTokenizer</code> and <code>AutoModel</code> auto-detect the model type from the checkpoint name. <code>bert-base-uncased</code> is the canonical lowercased English BERT, 110M params. 2) Tokenizes two sentences with padding to the longest in the batch and truncation at 64 tokens. The output dict has <code>input_ids</code> and <code>attention_mask</code> -- exactly what BERT expects. 3) The forward pass returns a <code>last_hidden_state</code> of shape <code>(B, T, 768)</code> -- one 768-dim contextual vector per token -- and a <code>pooler_output</code> of shape <code>(B, 768)</code> which is the [CLS] vector after a Linear+tanh, used as a sentence embedding. 4) The library has a family of <code>AutoModelFor...</code> classes that wrap the backbone with a task-specific head. Pick the right one for your task. 5) <code>AutoModelForSequenceClassification</code> with <code>num_labels=2</code> attaches a fresh untrained Linear(768, 2) on top of the pretrained BERT. The 110M backbone parameters keep their pretrained values; only the tiny new head starts random.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">AutoTokenizer</div><div class="card-body">Auto-detect tokenizer (BPE, WordPiece, SentencePiece) from checkpoint.</div></div>
<div class="calc-card"><div class="card-title">AutoModel</div><div class="card-body">Backbone only: returns hidden states. No task head.</div></div>
<div class="calc-card"><div class="card-title">AutoModelForSequenceClassification</div><div class="card-body">Backbone + Linear head over [CLS]. For sentiment, topic, NLI.</div></div>
<div class="calc-card"><div class="card-title">AutoModelForTokenClassification</div><div class="card-body">Backbone + Linear head per token. For NER, POS tagging.</div></div>
<div class="calc-card"><div class="card-title">AutoModelForCausalLM</div><div class="card-body">GPT-style next-token prediction. For generation.</div></div>
<div class="calc-card"><div class="card-title">from_pretrained</div><div class="card-body">Downloads + caches weights. Pass <code>num_labels</code> or <code>config</code> to customize the head.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Freeze, Unfreeze, Gradual Unfreezing</h2>

<p class="l-text">Three patterns for choosing which parameters to update during fine-tuning. Each is a tradeoff between speed, memory, and accuracy.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Freeze backbone</div><div class="compare-item">Train only the head</div><div class="compare-item">Cheapest, fastest</div><div class="compare-item">~80% of full fine-tune accuracy</div><div class="compare-item">Best for tiny datasets (&lt;1k)</div></div>
<div class="compare-col"><div class="compare-title">Full fine-tune</div><div class="compare-item">Train every parameter</div><div class="compare-item">Most expensive</div><div class="compare-item">Highest accuracy on most tasks</div><div class="compare-item">Use small lr (2e-5) to avoid forgetting</div></div>
<div class="compare-col"><div class="compare-title">Gradual unfreeze</div><div class="compare-item">Start frozen, unfreeze top-down</div><div class="compare-item">Stable + accurate</div><div class="compare-item">Fewer epochs of backbone training</div><div class="compare-item">ULMFiT-style recipe</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>, num_labels=<span class="num">2</span>)

<span class="cm"># 1) Freeze entire BERT backbone -- train only the classifier head</span>
<span class="kw">for</span> param <span class="kw">in</span> model.bert.<span class="fn">parameters</span>():
    param.requires_grad = <span class="kw">False</span>

<span class="cm"># Sanity check</span>
trainable = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>() <span class="kw">if</span> p.requires_grad)
total = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())
<span class="fn">print</span>(f<span class="str">"trainable: {trainable/1e6:.2f}M / total: {total/1e6:.2f}M"</span>)
<span class="cm"># trainable: ~0.0M (just the head); total: ~110M</span>

<span class="cm"># 2) Unfreeze the last 2 transformer layers (gradient unfreezing)</span>
<span class="kw">for</span> layer <span class="kw">in</span> model.bert.encoder.layer[-<span class="num">2</span>:]:
    <span class="kw">for</span> param <span class="kw">in</span> layer.<span class="fn">parameters</span>():
        param.requires_grad = <span class="kw">True</span>

<span class="cm"># 3) Helper to count</span>
<span class="kw">def</span> <span class="fn">count_trainable</span>(m):
    <span class="kw">return</span> <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> m.<span class="fn">parameters</span>() <span class="kw">if</span> p.requires_grad)

<span class="fn">print</span>(f<span class="str">"trainable now: {count_trainable(model)/1e6:.2f}M"</span>)
<span class="cm"># Now around 14M (head + 2 transformer layers)</span>

<span class="cm"># 4) Standard ULMFiT-style recipe: epoch-wise unfreezing</span>
<span class="kw">def</span> <span class="fn">freeze_all</span>(m):
    <span class="kw">for</span> p <span class="kw">in</span> m.<span class="fn">parameters</span>(): p.requires_grad = <span class="kw">False</span>

<span class="kw">def</span> <span class="fn">unfreeze_top_n_layers</span>(m, n):
    <span class="kw">for</span> layer <span class="kw">in</span> m.bert.encoder.layer[-n:]:
        <span class="kw">for</span> p <span class="kw">in</span> layer.<span class="fn">parameters</span>(): p.requires_grad = <span class="kw">True</span>

<span class="cm"># Pseudocode for the training loop</span>
<span class="cm"># epoch 1: head only</span>
<span class="cm"># epoch 2: head + last 2 layers</span>
<span class="cm"># epoch 3: head + last 6 layers</span>
<span class="cm"># epoch 4+: full</span>

<span class="cm"># 5) Freeze just the embeddings (a common trick that saves memory/time)</span>
<span class="kw">for</span> param <span class="kw">in</span> model.bert.embeddings.<span class="fn">parameters</span>():
    param.requires_grad = <span class="kw">False</span>
<span class="fn">print</span>(f<span class="str">"trainable: {count_trainable(model)/1e6:.2f}M"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Freeze / unfreeze: in sklearn we mimic 'freeze backbone' by reusing the same fitted vectorizer (no re-fit) and only re-training the classifier head.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)

# 1. Pretrain (fit) the vectorizer on a 'big corpus'
vec = TfidfVectorizer(max_features=2000).fit(df_reviews['review'])
# Now FREEZE: never call fit again, only transform.

# 2. Train head only
Xt_tr = vec.transform(X_tr)
Xt_te = vec.transform(X_te)
print('frozen feature dim:', Xt_tr.shape[1])

clf_frozen = LogisticRegression(max_iter=500).fit(Xt_tr, y_tr)
acc_frozen = accuracy_score(y_te, clf_frozen.predict(Xt_te))
print(f'frozen-backbone accuracy:    {acc_frozen:.3f}')

# 3. Unfreeze (re-fit) on training data instead
vec2 = TfidfVectorizer(max_features=2000).fit(X_tr)
clf_unfr = LogisticRegression(max_iter=500).fit(vec2.transform(X_tr), y_tr)
acc_unfr = accuracy_score(y_te, clf_unfr.predict(vec2.transform(X_te)))
print(f'unfrozen-backbone accuracy:  {acc_unfr:.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets <code>requires_grad = False</code> on every parameter inside the BERT backbone. The optimizer will skip these during update steps; only the classification head will train. This is the cheapest fine-tune. 2) Selectively unfreezes the last 2 transformer encoder layers. This adds expressivity at the top while keeping early layers (which encode generic syntax) fixed. 3) Helper to count trainable parameters -- a habit you should adopt to verify your freezing is doing what you think. 4) Sketches the ULMFiT recipe: train the head alone, then unfreeze layers progressively from top to bottom across epochs. This stabilizes early training and prevents catastrophic forgetting. 5) Freezing just the embedding layer is a popular middle ground -- the embedding matrix is huge (vocab * 768) and rarely needs domain adaptation. Freezing it saves memory and gives roughly identical accuracy on most tasks.</p>

<div class="l-warn"><strong>After freezing, double-check the optimizer.</strong> If you pass <code>model.parameters()</code> to the optimizer before freezing, the frozen tensors are still in the optimizer's state but will not get gradients -- that is fine. But if you freeze AFTER constructing the optimizer and then unfreeze later, those parameters will not actually get updated unless they were given to the optimizer originally. Pattern: <code>optim.AdamW([p for p in model.parameters() if p.requires_grad], lr=...)</code> -- or, more flexibly, give all parameters and let <code>requires_grad</code> control updates.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Layer-Wise Learning Rates</h2>

<p class="l-text">Different layers learn at different speeds. Lower layers (close to embeddings) encode generic features that need only tiny adjustments; higher layers (close to the head) encode task-specific abstractions and tolerate larger updates. Layer-wise learning rate decay (LLRD) gives each layer its own learning rate, scaled exponentially from top to bottom.</p>

<div class="katex-block">$$\\eta_{\\ell} = \\eta_{\\text{top}} \\cdot \\gamma^{(L - \\ell)}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">eta_l</div><div class="card-body">Learning rate for layer l.</div></div>
<div class="calc-card"><div class="card-title">eta_top</div><div class="card-body">Top (head) learning rate, e.g. 2e-5.</div></div>
<div class="calc-card"><div class="card-title">gamma</div><div class="card-body">Decay factor in (0, 1). Common: 0.9 or 0.95.</div></div>
<div class="calc-card"><div class="card-title">L</div><div class="card-body">Total number of layers (e.g. 12 for BERT-base).</div></div>
<div class="calc-card"><div class="card-title">l</div><div class="card-body">Layer index (0 = bottom near embeddings).</div></div>
<div class="calc-card"><div class="card-title">Effect</div><div class="card-body">Top layer trains fastest; bottom barely moves. Better stability and accuracy.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.optim <span class="kw">import</span> AdamW
<span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>, num_labels=<span class="num">2</span>)

<span class="kw">def</span> <span class="fn">make_param_groups</span>(model, head_lr=<span class="num">2e-5</span>, gamma=<span class="num">0.9</span>):
    groups = []

    <span class="cm"># 1) Classifier head: highest LR</span>
    head_params = <span class="fn">list</span>(model.classifier.<span class="fn">parameters</span>())
    groups.<span class="fn">append</span>({<span class="str">"params"</span>: head_params, <span class="str">"lr"</span>: head_lr})

    <span class="cm"># 2) Each BERT encoder layer: exponentially decayed LR</span>
    num_layers = <span class="fn">len</span>(model.bert.encoder.layer)        <span class="cm"># 12 for base</span>
    <span class="kw">for</span> i, layer <span class="kw">in</span> <span class="fn">enumerate</span>(model.bert.encoder.layer):
        layer_lr = head_lr * (gamma ** (num_layers - i))
        groups.<span class="fn">append</span>({<span class="str">"params"</span>: <span class="fn">list</span>(layer.<span class="fn">parameters</span>()), <span class="str">"lr"</span>: layer_lr})

    <span class="cm"># 3) Embeddings: lowest LR</span>
    emb_lr = head_lr * (gamma ** (num_layers + <span class="num">1</span>))
    groups.<span class="fn">append</span>({<span class="str">"params"</span>: <span class="fn">list</span>(model.bert.embeddings.<span class="fn">parameters</span>()), <span class="str">"lr"</span>: emb_lr})

    <span class="cm"># 4) Pooler (BERT only)</span>
    <span class="kw">if</span> <span class="fn">hasattr</span>(model.bert, <span class="str">"pooler"</span>) <span class="kw">and</span> model.bert.pooler <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
        groups.<span class="fn">append</span>({<span class="str">"params"</span>: <span class="fn">list</span>(model.bert.pooler.<span class="fn">parameters</span>()), <span class="str">"lr"</span>: head_lr})

    <span class="kw">return</span> groups

groups = <span class="fn">make_param_groups</span>(model, head_lr=<span class="num">2e-5</span>, gamma=<span class="num">0.9</span>)
optimizer = <span class="fn">AdamW</span>(groups, weight_decay=<span class="num">0.01</span>)

<span class="cm"># Inspect: print effective lrs</span>
<span class="kw">for</span> i, g <span class="kw">in</span> <span class="fn">enumerate</span>(optimizer.param_groups):
    n = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> g[<span class="str">"params"</span>])
    <span class="fn">print</span>(f<span class="str">"group {i}: {n/1e6:.2f}M params, lr={g['lr']:.2e}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Layer-wise learning rates: simulate by training two SGDClassifier models with different learning rates and ensembling their predictions.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)
vec = TfidfVectorizer(max_features=1500).fit(X_tr)
Xt_tr = vec.transform(X_tr); Xt_te = vec.transform(X_te)

# 'lower layer' (smaller eta) vs 'head' (larger eta) -- different update magnitudes
slow = SGDClassifier(loss='log_loss', eta0=1e-4, learning_rate='constant', random_state=0,
                     max_iter=10, tol=None).fit(Xt_tr, y_tr)
fast = SGDClassifier(loss='log_loss', eta0=1e-2, learning_rate='constant', random_state=0,
                     max_iter=10, tol=None).fit(Xt_tr, y_tr)
print(f'slow-lr accuracy : {accuracy_score(y_te, slow.predict(Xt_te)):.3f}')
print(f'fast-lr accuracy : {accuracy_score(y_te, fast.predict(Xt_te)):.3f}')
# Real layer-wise LR: lower layers move less, head moves more -> faster fine-tuning.</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The classifier head gets the full head learning rate (2e-5). It is brand new -- it needs to learn from scratch and tolerates the largest updates. 2) Each transformer encoder layer gets its own param group with an exponentially smaller LR. Layer 11 (the topmost) gets <code>head_lr * gamma^1</code>, layer 0 gets <code>head_lr * gamma^12</code>. With gamma=0.9, that means layer 11 trains at 1.8e-5 while layer 0 trains at ~5.7e-6 -- about 3x slower. 3) Embeddings get the smallest LR. They were trained on billions of tokens and rarely need much movement. 4) BERT also has a pooler module that maps [CLS] through Linear+tanh; treat it like the head. 5) <code>AdamW</code> accepts the list of param groups; each group can have its own learning rate, weight decay, etc. The print loop confirms the LR schedule looks reasonable.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: when LLRD helps the most</div><div class="example-body">On GLUE benchmarks (sentiment, NLI, paraphrase), LLRD with gamma=0.9-0.95 typically buys +0.3 to +1.0 accuracy points over uniform LR -- a small but reliable improvement that compounds across runs. The effect is largest on small datasets where preserving the pretrained features matters most. On large datasets (millions of examples), the difference shrinks because the model has enough signal to recover even from aggressive lower-layer updates.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Training Curves: Pretrained vs From-Scratch</h2>

<div id="plot-pl10-curves-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Validation accuracy over training epochs for three settings of a sentiment classification task with 5k labeled examples. The pretrained model starts at high accuracy (around 80%) after just one epoch and converges quickly to near 92%. The "frozen backbone" model also starts high but plateaus lower because it cannot adapt internal representations. The from-scratch model takes many epochs to climb and never catches up -- 5k examples is simply not enough to learn good representations from random initialization. <strong>Why it matters for NLP:</strong> this curve is the visual proof of why every modern NLP system starts from a pretrained checkpoint. The gap is not a small optimization win; it is the difference between a useful product and a non-starter.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Sketch of how to produce this plot from a real fine-tuning run</span>
<span class="kw">import</span> torch

<span class="kw">def</span> <span class="fn">evaluate</span>(model, val_loader):
    model.<span class="fn">eval</span>()
    correct, total = <span class="num">0</span>, <span class="num">0</span>
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        <span class="kw">for</span> batch <span class="kw">in</span> val_loader:
            ids = batch[<span class="str">"input_ids"</span>]
            mask = batch[<span class="str">"attention_mask"</span>]
            labels = batch[<span class="str">"labels"</span>]
            out = <span class="fn">model</span>(input_ids=ids, attention_mask=mask)
            preds = out.logits.<span class="fn">argmax</span>(dim=-<span class="num">1</span>)
            correct += (preds == labels).<span class="fn">sum</span>().<span class="fn">item</span>()
            total += labels.<span class="fn">size</span>(<span class="num">0</span>)
    <span class="kw">return</span> correct / total

<span class="cm"># Pseudo training loop -- log val accuracy each epoch</span>
val_acc_history = []
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(num_epochs):
    <span class="fn">train_one_epoch</span>(model, train_loader, optimizer)
    acc = <span class="fn">evaluate</span>(model, val_loader)
    val_acc_history.<span class="fn">append</span>(acc)
    <span class="fn">print</span>(f<span class="str">"epoch {epoch+1}: val_acc={acc:.4f}"</span>)

<span class="cm"># val_acc_history -- a list of floats, one per epoch</span>
<span class="cm"># Plotting this for pretrained vs frozen vs scratch produces the comparison above</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pretrained vs from-scratch: train two LogReg models -- one on the rich pretrained TF-IDF, one on a tiny token count vector -- and compare.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)

# 'From scratch' -- coarse, small features
v_scr = CountVectorizer(max_features=50)
Xs_tr = v_scr.fit_transform(X_tr); Xs_te = v_scr.transform(X_te)
acc_scr = accuracy_score(y_te, LogisticRegression(max_iter=500).fit(Xs_tr, y_tr).predict(Xs_te))

# 'Pretrained' -- rich TF-IDF features
v_pre = TfidfVectorizer(max_features=2000, ngram_range=(1,2))
Xp_tr = v_pre.fit_transform(X_tr); Xp_te = v_pre.transform(X_te)
acc_pre = accuracy_score(y_te, LogisticRegression(max_iter=500).fit(Xp_tr, y_tr).predict(Xp_te))

print(f'from-scratch  (50 features) : {acc_scr:.3f}')
print(f'pretrained-style TF-IDF      : {acc_pre:.3f}')
print('the gap = the value of pretraining.')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The <code>evaluate</code> function runs the model in eval mode over the validation set, takes the argmax over logits, and counts correct predictions. <code>torch.no_grad()</code> disables autograd to halve memory and double speed during evaluation. 2) The training loop calls some <code>train_one_epoch</code> function (the standard inner loop with forward, loss, backward, step) and then evaluates on the validation set. 3) Storing accuracy each epoch produces the time series you would plot. Repeat for three different model configurations (full pretrained, frozen backbone, from scratch) to get the comparison.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. When to Fine-Tune vs Freeze</h2>

<p class="l-text">There is no single right answer; the best choice depends on the size of your labeled dataset and how similar your domain is to the pretraining data.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tiny + similar domain</div><div class="card-body">&lt;1k examples, source domain matches. Freeze the backbone, train just the head. Risk of overfit if you fine-tune everything.</div></div>
<div class="calc-card"><div class="card-title">Tiny + different domain</div><div class="card-body">&lt;1k, very different (e.g. medical text vs general English). Continued MLM pretraining on unlabeled domain text first, then freeze + train head.</div></div>
<div class="calc-card"><div class="card-title">Medium + similar</div><div class="card-body">1k-50k similar. Full fine-tune with small lr (2e-5) for 3-5 epochs. The standard recipe.</div></div>
<div class="calc-card"><div class="card-title">Medium + different</div><div class="card-body">1k-50k different. Domain-adaptive pretraining + full fine-tune. LLRD helps.</div></div>
<div class="calc-card"><div class="card-title">Large + similar</div><div class="card-body">50k+ similar. Full fine-tune, gamma=0.95, more epochs OK.</div></div>
<div class="calc-card"><div class="card-title">Large + different</div><div class="card-body">50k+ different. Full fine-tune; consider longer pretraining if budget allows.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: choosing for a Turkish sentiment task</div><div class="example-body">You have 8000 labeled Turkish movie reviews. The original BERT was English; even multilingual BERT (mBERT) saw Turkish but in much smaller quantity than English. Best recipe: start from <code>dbmdz/bert-base-turkish-uncased</code> (a Turkish-specific BERT trained on Turkish corpora), do a brief MLM-continued-pretraining on a few hundred thousand unlabeled Turkish reviews (1-2 epochs), then fine-tune for sentiment with full unfreezing, lr=2e-5, 4 epochs. Expect 87-90% accuracy. Skipping the Turkish base model and using English BERT loses ~6-10 points; skipping the domain pretraining costs ~1-2 points.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Full BERT Fine-Tuning Walkthrough</h2>

<div class="calc-highlight">📘 <strong>Higher-level alternative:</strong> <a href="/tutorials/ai/huggingface/bert-sentiment-analysis">HuggingFace Lesson 3</a> walks through the same IMDB sentiment fine-tuning using the <code>Trainer</code> API — fewer lines, less control. Use that for production prototyping; the lower-level PyTorch loop below shows what <code>Trainer</code> hides under the hood.</div>

<p class="l-text">Putting it all together: a complete BERT fine-tuning script for binary sentiment classification.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader
<span class="kw">from</span> torch.optim <span class="kw">import</span> AdamW
<span class="kw">from</span> transformers <span class="kw">import</span> (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    get_linear_schedule_with_warmup,
)

<span class="cm"># 1) Tiny synthetic dataset for demo</span>
<span class="kw">class</span> <span class="fn">SentimentDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, texts, labels, tokenizer, max_len=<span class="num">128</span>):
        self.texts = texts
        self.labels = labels
        self.tok = tokenizer
        self.max_len = max_len
    <span class="kw">def</span> <span class="fn">__len__</span>(self):
        <span class="kw">return</span> <span class="fn">len</span>(self.texts)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, idx):
        enc = self.<span class="fn">tok</span>(self.texts[idx], padding=<span class="str">"max_length"</span>,
                       truncation=<span class="kw">True</span>, max_length=self.max_len,
                       return_tensors=<span class="str">"pt"</span>)
        <span class="kw">return</span> {
            <span class="str">"input_ids"</span>: enc[<span class="str">"input_ids"</span>].<span class="fn">squeeze</span>(<span class="num">0</span>),
            <span class="str">"attention_mask"</span>: enc[<span class="str">"attention_mask"</span>].<span class="fn">squeeze</span>(<span class="num">0</span>),
            <span class="str">"labels"</span>: torch.<span class="fn">tensor</span>(self.labels[idx], dtype=torch.long),
        }

texts = [<span class="str">"I love this"</span>, <span class="str">"this is terrible"</span>, <span class="str">"amazing!"</span>, <span class="str">"boring movie"</span>, <span class="str">"best ever"</span>, <span class="str">"waste of time"</span>]
labels = [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>]

<span class="cm"># 2) Setup</span>
device = torch.<span class="fn">device</span>(<span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>)
checkpoint = <span class="str">"bert-base-uncased"</span>
tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(checkpoint)
model = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(checkpoint, num_labels=<span class="num">2</span>).<span class="fn">to</span>(device)

train_ds = <span class="fn">SentimentDataset</span>(texts, labels, tokenizer)
train_loader = <span class="fn">DataLoader</span>(train_ds, batch_size=<span class="num">2</span>, shuffle=<span class="kw">True</span>)

<span class="cm"># 3) Optimizer with weight decay grouping (no decay on bias / LayerNorm)</span>
no_decay = [<span class="str">"bias"</span>, <span class="str">"LayerNorm.weight"</span>]
grouped = [
    {<span class="str">"params"</span>: [p <span class="kw">for</span> n, p <span class="kw">in</span> model.<span class="fn">named_parameters</span>() <span class="kw">if</span> <span class="kw">not</span> <span class="fn">any</span>(nd <span class="kw">in</span> n <span class="kw">for</span> nd <span class="kw">in</span> no_decay)],
     <span class="str">"weight_decay"</span>: <span class="num">0.01</span>},
    {<span class="str">"params"</span>: [p <span class="kw">for</span> n, p <span class="kw">in</span> model.<span class="fn">named_parameters</span>() <span class="kw">if</span> <span class="fn">any</span>(nd <span class="kw">in</span> n <span class="kw">for</span> nd <span class="kw">in</span> no_decay)],
     <span class="str">"weight_decay"</span>: <span class="num">0.0</span>},
]
optimizer = <span class="fn">AdamW</span>(grouped, lr=<span class="num">2e-5</span>)

<span class="cm"># 4) LR schedule: linear warmup then linear decay</span>
num_epochs = <span class="num">3</span>
total_steps = <span class="fn">len</span>(train_loader) * num_epochs
scheduler = <span class="fn">get_linear_schedule_with_warmup</span>(optimizer, num_warmup_steps=<span class="fn">int</span>(<span class="num">0.1</span>*total_steps),
                                            num_training_steps=total_steps)

<span class="cm"># 5) Training loop</span>
model.<span class="fn">train</span>()
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(num_epochs):
    <span class="kw">for</span> batch <span class="kw">in</span> train_loader:
        batch = {k: v.<span class="fn">to</span>(device) <span class="kw">for</span> k, v <span class="kw">in</span> batch.<span class="fn">items</span>()}
        out = <span class="fn">model</span>(**batch)               <span class="cm"># forward + cross-entropy loss inside</span>
        loss = out.loss
        loss.<span class="fn">backward</span>()
        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), max_norm=<span class="num">1.0</span>)
        optimizer.<span class="fn">step</span>()
        scheduler.<span class="fn">step</span>()
        optimizer.<span class="fn">zero_grad</span>()
    <span class="fn">print</span>(f<span class="str">"epoch {epoch+1}: loss={loss.item():.4f}"</span>)

<span class="cm"># 6) Inference</span>
model.<span class="fn">eval</span>()
test_text = <span class="str">"this movie blew me away"</span>
enc = <span class="fn">tokenizer</span>(test_text, return_tensors=<span class="str">"pt"</span>, truncation=<span class="kw">True</span>, max_length=<span class="num">128</span>).<span class="fn">to</span>(device)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    logits = <span class="fn">model</span>(**enc).logits
    probs = torch.<span class="fn">softmax</span>(logits, dim=-<span class="num">1</span>)
    pred = probs.<span class="fn">argmax</span>(dim=-<span class="num">1</span>).<span class="fn">item</span>()
<span class="fn">print</span>(f<span class="str">"text: {test_text}"</span>)
<span class="fn">print</span>(f<span class="str">"predicted: {pred}  probs: {probs.tolist()}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Full BERT fine-tuning concept: tokenize -> contextualize -> classify. With sklearn: TF-IDF + LR + report metrics for BERT-like workflow.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.2, random_state=0
)

pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=3000, ngram_range=(1,3))),
    ('clf', LogisticRegression(max_iter=500, C=2.0)),
])
pipe.fit(X_tr, y_tr)
pred = pipe.predict(X_te)
print(classification_report(y_te, pred, digits=3))
print('confusion matrix:\n', confusion_matrix(y_te, pred))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a Dataset that tokenizes each text on demand. We pad to <code>max_length</code> in the dataset rather than dynamically -- simpler, slightly less efficient. <code>squeeze(0)</code> removes the batch dim added by the tokenizer. 2) Loads BERT base + tokenizer and wraps the model in <code>AutoModelForSequenceClassification</code> with 2 labels. The library handles the [CLS] -> Linear -> 2 logits head. 3) Splits parameters into two AdamW groups: bias and LayerNorm weights skip weight decay (an important detail -- decaying these hurts performance), everything else gets weight_decay=0.01. 4) Linear warmup-then-decay schedule: lr ramps up from 0 to 2e-5 over the first 10% of steps, then linearly decays to 0 by the end. This is the standard BERT fine-tune schedule. 5) Standard training loop: forward returns loss because we passed <code>labels</code>, backward, gradient clipping at 1.0 (essential for transformer stability), optimizer step, scheduler step, zero grads. 6) Inference: eval mode, no grad, tokenize one example, take argmax over the 2 logits and print the prediction. With enough labeled data (10k+ examples) this exact recipe gets you 90%+ accuracy on most binary sentiment tasks.</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Transfer learning is the default for NLP: pretrained backbone + task-specific head + small labeled dataset.<br><strong>2.</strong> <code>torch.hub</code> is great for vision; <code>transformers</code> is the standard for NLP.<br><strong>3.</strong> <code>AutoModelFor...</code> classes attach the right head for your task automatically.<br><strong>4.</strong> Freeze the backbone for tiny datasets; full fine-tune for medium-sized; gradual unfreezing for the most stable accuracy.<br><strong>5.</strong> Layer-wise learning rate decay (gamma=0.9-0.95) often gives +0.3-1.0 accuracy point.<br><strong>6.</strong> AdamW with no weight decay on biases / LayerNorm + linear warmup-decay schedule + grad clipping at 1.0 is the canonical BERT recipe.<br><strong>7.</strong> Domain-adaptive pretraining (continue MLM on unlabeled in-domain text) helps when your domain is far from generic English.<br><strong>8.</strong> Next lesson: production -- saving, eval mode, TorchScript, ONNX, mixed precision, quantization, profiling.</div></div>
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

  function curvesPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var epochs = [1,2,3,4,5,6,7,8,9,10];
    var pretrained = [0.81, 0.86, 0.89, 0.905, 0.913, 0.918, 0.920, 0.921, 0.921, 0.921];
    var frozen     = [0.78, 0.81, 0.83, 0.84, 0.845, 0.85, 0.852, 0.853, 0.853, 0.854];
    var scratch    = [0.55, 0.62, 0.68, 0.72, 0.74, 0.76, 0.77, 0.78, 0.79, 0.80];
    var traces = [
      {x:epochs, y:pretrained, mode:'lines+markers', name:lang==='tr'?'tam ince ayar':'full fine-tune', line:{color:T.accent, width:3}},
      {x:epochs, y:frozen, mode:'lines+markers', name:lang==='tr'?'donmus omurga':'frozen backbone', line:{color:'#4ecdc4', width:3}},
      {x:epochs, y:scratch, mode:'lines+markers', name:lang==='tr'?'sifirdan':'from scratch', line:{color:'#f87171', width:3}}
    ];
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Validasyon Dogrulugu: Onceden Egitilmis vs Sifirdan':'Validation Accuracy: Pretrained vs From Scratch', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'epoch':'epoch', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'dogruluk':'accuracy', gridcolor:T.grid, zerolinecolor:T.zero, range:[0.5, 0.95]},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, traces, layout, {responsive:true, displayModeBar:false});
  }

  curvesPlot('plot-pl10-curves-en','en');
  curvesPlot('plot-pl10-curves-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Wikipedia + BookCorpus üzerinde biri zaten 110M parametreli BERT'i eğittiyse ve ağırlıkları yüklediyse, niçin sıfırdan eğitelim?</strong> Transfer öğrenme uygulayıcının süper gücüdür: devasa genel bir corpus üzerinde önceden eğitilmiş bir modeli alın, küçük göreve özgü bir baş takın, küçük etiketli veri kümesinde birkaç epoch eğitin ve sıfırdan baseline'ını büyük farklarla yenin. Matematik değişmedi -- gradyan inişi, çapraz entropi, aynı transformer encoder -- yalnızca başlangıç noktası.</p>

<p class="l-text">Bu derste PyTorch'ta tam transfer öğrenme alet kutusunu kapsıyoruz: ImageNet CNN'leri için <code>torch.hub</code>, NLP için HuggingFace ekosistemi, dondurma/çözme kalıpları, katman bazlı öğrenme oranları ve tam bir BERT duygu ince ayar örneği. Sonunda herhangi bir yeni projeye yapıştırabileceğiniz ve bir saatten kısa sürede güçlü bir baseline alacağınız bir tarifiniz olacak.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Önceden eğitilmiş modelleri <code>torch.hub</code> ve <code>AutoModel.from_pretrained</code> ile yüklemeyi</li>
<li>Sınıflandırma başını değiştirmeyi ve omurga katmanlarını <code>requires_grad=False</code> ile dondurmayı</li>
<li>Katman bazlı learning rate uygulamayı: encoder için düşük LR, yeni baş için yüksek LR</li>
<li><code>bert-base-uncased</code>'i IMDB duygu üzerinde HuggingFace <code>Trainer</code> ile ince ayarlamayı</li>
<li>Veri seti boyutuna göre feature extraction, kısmi unfreeze ve tam fine-tune arasında karar vermeyi</li>
<li>Discriminative learning rate ve düşük epoch sayısıyla catastrophic forgetting'i önlemeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Transfer Öğrenme Neden Kazanır</h2>

<p class="l-text">Modern önceden eğitilmiş modeller çoğu ekibin karşılayamayacağı veri ve hesaplama üzerinde eğitilir. BERT-base, BookCorpus ve Wikipedia'da ~3.3B kelime gördü, GPT-3 ~500B token gördü, RoBERTa 160GB metin gördü. Genel dilbilimsel yapı öğrendiler: sözdizimi, morfoloji, sağduyu gerçekleri, temel akıl yürütme. Birkaç bin duygu etiketli tweet üzerinde ince ayar yaptığınızda, bunların hepsini bedavaya yeniden kullanırsınız. Göreviniz yalnızca son parçayı öğrenmek zorundadır: "bu alanda bu özellikler şu etiketlere eşlenir".</p>

<div class="calc-highlight"><strong>Genel kural:</strong> Etiketli veri kümeniz 100k örneğin altındaysa, önceden eğitilmiş bir transformer'ı ince ayar yapmak neredeyse her zaman özel bir mimariyi sıfırdan eğitmeyi yener -- standart NLP benchmark'larda genellikle 10-30 F1 puanlık bir farkla.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Önceden eğitim</div><div class="card-body">Öz denetimli: maskelenmiş LM, sonraki token tahmini. Etiket gerekmez, milyarlarca token ucuz.</div></div>
<div class="calc-card"><div class="card-title">İnce ayar</div><div class="card-body">Denetimli: küçük etiketli veri kümesi, göreve özgü baş, birkaç epoch.</div></div>
<div class="calc-card"><div class="card-title">Özellik çıkarımı</div><div class="card-body">Omurgayı dondur, yalnızca başı eğit. En ucuz ama biraz daha zayıf.</div></div>
<div class="calc-card"><div class="card-title">Tam ince ayar</div><div class="card-body">Her şeyi küçük öğrenme oranıyla güncelle. Çoğu görevde en güçlü.</div></div>
<div class="calc-card"><div class="card-title">Adapter / LoRA</div><div class="card-body">Omurgaya yerleştirilen küçük eğitilebilir modüller. Parametrelerin ~%1'i, neredeyse tam performans.</div></div>
<div class="calc-card"><div class="card-title">Alan adaptasyonu</div><div class="card-body">İnce ayardan önce etiketsiz alan metniniz üzerinde MLM ön eğitimine devam edin.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: 5k tweet üzerinde duygu</div><div class="example-body">Rastgele embedding'lerle sıfırdan eğitilmiş özel BiLSTM: ~%78 doğruluk. GloVe embedding'lerle aynı BiLSTM: ~%82. 3 epoch için ince ayarlanmış BERT-base: ~%91. Önce 1M etiketsiz tweet üzerinde MLM-devam-eden-ön-eğitimden sonra aynı BERT: ~%92.5. Her adım kalan hatayı kabaca yarıya indirir -- bu yüzden transfer öğrenme üretim NLP'sinde sıfırdan eğitimin yerini almıştır.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. torch.hub: PyTorch'tan Önceden Eğitilmiş Modeller</h2>

<p class="l-text"><code>torch.hub</code> PyTorch'un yerleşik model hayvanat bahçesidir. Tek bir satır ağırlıkları indirir ve kullanıma hazır bir model döner. Çoğunlukla görü için kullanılır (ResNet, EfficientNet) ama <code>hubconf.py</code> tanımlayan her GitHub deposunu destekler.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># 1) ImageNet uzerinde onceden egitilmis ResNet-50 yukle</span>
model = torch.hub.<span class="fn">load</span>(<span class="str">"pytorch/vision"</span>, <span class="str">"resnet50"</span>, weights=<span class="str">"DEFAULT"</span>)
model.<span class="fn">eval</span>()
<span class="fn">print</span>(<span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>()) / <span class="num">1e6</span>, <span class="str">"M params"</span>)  <span class="cm"># ~25.6 M</span>

<span class="cm"># 2) Mimariyi incele</span>
<span class="fn">print</span>(model.fc)        <span class="cm"># Linear(in_features=2048, out_features=1000, bias=True)</span>

<span class="cm"># 3) Siniflandirma basligini kendi gorevinle degistir</span>
num_classes = <span class="num">5</span>
model.fc = nn.<span class="fn">Linear</span>(model.fc.in_features, num_classes)
<span class="fn">print</span>(model.fc)        <span class="cm"># Linear(in_features=2048, out_features=5, bias=True)</span>

<span class="cm"># 4) ImageNet şekilli sahte girdi geçir</span>
x = torch.<span class="fn">randn</span>(<span class="num">1</span>, <span class="num">3</span>, <span class="num">224</span>, <span class="num">224</span>)
out = <span class="fn">model</span>(x)
<span class="fn">print</span>(out.shape)       <span class="cm"># (1, 5)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Transfer öğrenme kavramı demo: iris üzerinde PCA ('önceden eğitilmiş projektör') + LogReg sınıflandırıcı başı. Projeksiyon dondurulmuş özellik çıkarıcı gibi davranır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X = df_iris.iloc[:, :4].values
y = df_iris.iloc[:, 4].astype('category').cat.codes.values
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)

# 1. "Pretrained" feature extractor (PCA fit once, then frozen)
pca = PCA(n_components=2).fit(X_tr)

# 2. Use the frozen features to train a classifier head
F_tr = pca.transform(X_tr)
F_te = pca.transform(X_te)
clf = LogisticRegression(max_iter=500).fit(F_tr, y_tr)
acc = accuracy_score(y_te, clf.predict(F_te))
print(f'transfer-learning style accuracy: {acc:.3f}')
print('PCA explained variance:', pca.explained_variance_ratio_.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>torch.hub.load</code> aracılığıyla ImageNet üzerinde önceden eğitilmiş ResNet-50 ağırlıklarını indirir. <code>weights="DEFAULT"</code> en son önerilen kontrol noktasını seçer. Modelin 25.6M parametresi vardır ve 1000 sınıflı logit döner. 2) Son sınıflandırma katmanı <code>model.fc</code>'yi inceler: 2048 özellikten 1000 sınıfa Linear. 3) Onu 5 sınıflı problemimiz için yeni eğitilmemiş bir Linear ile değiştirir. Ağın geri kalanı -- tüm konvolüsyonel özellik çıkarıcılar -- önceden eğitilmiş ağırlıklarını ve kodladıkları zengin görsel temsilleri korur. 4) Yeni modelin standart ImageNet girdilerini kabul ettiğini ve 5 sınıflı çıktı ürettiğini doğrular.</p>

<div class="l-note"><strong>NLP için:</strong> <code>torch.hub</code> çalışır ama standart HuggingFace transformers'tır (sonraki bölüm). Üretimde önceden eğitilmiş bir NLP modelini neredeyse hiç <code>torch.hub</code> ile yüklemezsiniz -- <code>transformers</code> API'si daha zengin ve model kapsamı çok daha geniştir.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. HuggingFace transformers: NLP Standardı</h2>

<p class="l-text"><code>transformers</code> kütüphanesi de facto NLP model hub'ıdır. On binlerce önceden eğitilmiş kontrol noktası, tokenizasyon ve modelleme için birleşik bir API ve sıkı PyTorch entegrasyonu. NLP yapıyorsanız bu kütüphanede yaşıyorsunuz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers</span>
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModel
<span class="kw">import</span> torch

<span class="cm"># 1) Hub'dan tokenizer + model yukle</span>
checkpoint = <span class="str">"bert-base-uncased"</span>
tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(checkpoint)
model = AutoModel.<span class="fn">from_pretrained</span>(checkpoint)
model.<span class="fn">eval</span>()

<span class="cm"># 2) Cumle batch'ini tokenize et</span>
texts = [
    <span class="str">"I love this movie."</span>,
    <span class="str">"The plot was confusing and the acting wooden."</span>
]
enc = <span class="fn">tokenizer</span>(texts, padding=<span class="kw">True</span>, truncation=<span class="kw">True</span>, max_length=<span class="num">64</span>, return_tensors=<span class="str">"pt"</span>)
<span class="fn">print</span>(enc.<span class="fn">keys</span>())
<span class="fn">print</span>(enc[<span class="str">"input_ids"</span>].shape)         <span class="cm"># (2, T)</span>

<span class="cm"># 3) Ileri gecis: baglamsal embedding'ler al</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**enc)
<span class="fn">print</span>(out.last_hidden_state.shape)    <span class="cm"># (2, T, 768)</span>
<span class="fn">print</span>(out.pooler_output.shape)        <span class="cm"># (2, 768)</span>

<span class="cm"># 4) Farkli gorevler için farkli model siniflari</span>
<span class="kw">from</span> transformers <span class="kw">import</span> (
    AutoModelForSequenceClassification,    <span class="cm"># duygu, konu, NLI</span>
    AutoModelForTokenClassification,        <span class="cm"># NER, POS</span>
    AutoModelForQuestionAnswering,
    AutoModelForMaskedLM,
    AutoModelForCausalLM,                   <span class="cm"># GPT tarzi uretim</span>
    AutoModelForSeq2SeqLM,                  <span class="cm"># T5, BART</span>
)

<span class="cm"># 5) Yeni siniflandirma basligi olan bir model yukle</span>
seq_clf = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(
    <span class="str">"bert-base-uncased"</span>,
    num_labels=<span class="num">2</span>
)
<span class="fn">print</span>(seq_clf.classifier)             <span class="cm"># Linear(768, 2)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">HuggingFace ince ayar konsepti: torch transformer + BERT tokenizer'ı df_reviews üzerinde sklearn TF-IDF + LogReg ile değiştir. Aynı I/O, burada çalışabilir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)
# tokenize -> embed -> classify
vec = TfidfVectorizer(max_features=2000, ngram_range=(1, 2))
clf = LogisticRegression(max_iter=500, C=1.0)
clf.fit(vec.fit_transform(X_tr), y_tr)
acc = accuracy_score(y_te, clf.predict(vec.transform(X_te)))
print(f'mock fine-tune accuracy: {acc:.3f}')
print('vocab size (~ token embeddings):', len(vec.vocabulary_))
print('sample predictions:', list(zip(clf.predict(vec.transform(X_te[:5])), y_te[:5])))</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>AutoTokenizer</code> ve <code>AutoModel</code> kontrol noktası adından model türünü otomatik algılar. <code>bert-base-uncased</code> kanonik küçük harfli İngilizce BERT'tir, 110M parametre. 2) İki cümleyi batch'teki en uzuna padding ve 64 token'da kesme ile tokenize eder. Çıktı sözlüğünde <code>input_ids</code> ve <code>attention_mask</code> vardır -- BERT'in beklediği tam olarak budur. 3) İleri geçiş şekli <code>(B, T, 768)</code> olan <code>last_hidden_state</code>'i -- token başına bir 768 boyutlu bağlamsal vektör -- ve şekli <code>(B, 768)</code> olan <code>pooler_output</code>'u döner; bu, cümle embedding'i olarak kullanılan Linear+tanh sonrası [CLS] vektörüdür. 4) Kütüphane omurgayı göreve özgü bir başlıkla saran bir <code>AutoModelFor...</code> sınıf ailesine sahiptir. Göreviniz için doğru olanı seçin. 5) <code>num_labels=2</code> olan <code>AutoModelForSequenceClassification</code> önceden eğitilmiş BERT'in üzerine yeni eğitilmemiş bir Linear(768, 2) takar. 110M omurga parametresi önceden eğitilmiş değerlerini korur; yalnızca minik yeni baş rastgele başlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">AutoTokenizer</div><div class="card-body">Kontrol noktasından tokenizer'ı otomatik algıla (BPE, WordPiece, SentencePiece).</div></div>
<div class="calc-card"><div class="card-title">AutoModel</div><div class="card-body">Yalnızca omurga: gizli durumlar döner. Görev başı yok.</div></div>
<div class="calc-card"><div class="card-title">AutoModelForSequenceClassification</div><div class="card-body">Omurga + [CLS] üzerinde Linear baş. Duygu, konu, NLI için.</div></div>
<div class="calc-card"><div class="card-title">AutoModelForTokenClassification</div><div class="card-body">Omurga + token başına Linear baş. NER, POS etiketleme için.</div></div>
<div class="calc-card"><div class="card-title">AutoModelForCausalLM</div><div class="card-body">GPT tarzı sonraki token tahmini. Üretim için.</div></div>
<div class="calc-card"><div class="card-title">from_pretrained</div><div class="card-body">Ağırlıkları indirir + önbelleğe alır. Başı özelleştirmek için <code>num_labels</code> veya <code>config</code> geçirin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Dondur, Çöz, Aşamalı Çözme</h2>

<p class="l-text">İnce ayar sırasında hangi parametrelerin güncelleneceğini seçmek için üç kalıp. Her biri hız, bellek ve doğruluk arasında bir denge.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Omurgayı dondur</div><div class="compare-item">Yalnızca başı eğit</div><div class="compare-item">En ucuz, en hızlı</div><div class="compare-item">Tam ince ayarın ~%80'i doğruluk</div><div class="compare-item">Çok küçük veri kümeleri için (&lt;1k) en iyi</div></div>
<div class="compare-col"><div class="compare-title">Tam ince ayar</div><div class="compare-item">Her parametreyi eğit</div><div class="compare-item">En pahalı</div><div class="compare-item">Çoğu görevde en yüksek doğruluk</div><div class="compare-item">Unutmayı önlemek için küçük lr (2e-5) kullanın</div></div>
<div class="compare-col"><div class="compare-title">Aşamalı çözme</div><div class="compare-item">Donmuş başla, yukarıdan aşağı çöz</div><div class="compare-item">Kararlı + doğru</div><div class="compare-item">Daha az omurga eğitimi epoch'u</div><div class="compare-item">ULMFiT tarzı tarif</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>, num_labels=<span class="num">2</span>)

<span class="cm"># 1) Tum BERT omurgasini dondur -- yalnizca siniflandirici basini egit</span>
<span class="kw">for</span> param <span class="kw">in</span> model.bert.<span class="fn">parameters</span>():
    param.requires_grad = <span class="kw">False</span>

trainable = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>() <span class="kw">if</span> p.requires_grad)
total = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())
<span class="fn">print</span>(f<span class="str">"egitilebilir: {trainable/1e6:.2f}M / toplam: {total/1e6:.2f}M"</span>)

<span class="cm"># 2) Son 2 transformer katmanini coz</span>
<span class="kw">for</span> layer <span class="kw">in</span> model.bert.encoder.layer[-<span class="num">2</span>:]:
    <span class="kw">for</span> param <span class="kw">in</span> layer.<span class="fn">parameters</span>():
        param.requires_grad = <span class="kw">True</span>

<span class="kw">def</span> <span class="fn">count_trainable</span>(m):
    <span class="kw">return</span> <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> m.<span class="fn">parameters</span>() <span class="kw">if</span> p.requires_grad)

<span class="fn">print</span>(f<span class="str">"simdi egitilebilir: {count_trainable(model)/1e6:.2f}M"</span>)

<span class="cm"># 3) ULMFiT tarzi epoch bazli cozme (sozde kod)</span>
<span class="cm"># epoch 1: yalnizca bas</span>
<span class="cm"># epoch 2: bas + son 2 katman</span>
<span class="cm"># epoch 3: bas + son 6 katman</span>
<span class="cm"># epoch 4+: tam</span>

<span class="cm"># 4) Yalnizca embedding'leri dondur</span>
<span class="kw">for</span> param <span class="kw">in</span> model.bert.embeddings.<span class="fn">parameters</span>():
    param.requires_grad = <span class="kw">False</span>
<span class="fn">print</span>(f<span class="str">"egitilebilir: {count_trainable(model)/1e6:.2f}M"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Dondur / çöz: sklearn'de 'backbone donduru' aynı fit edilmiş vectorizer'ı tekrar kullanarak (tekrar fit etmeden) ve sadece sınıflandırıcı başını yeniden eğiterek taklit ederiz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)

# 1. Pretrain (fit) the vectorizer on a 'big corpus'
vec = TfidfVectorizer(max_features=2000).fit(df_reviews['review'])
# Now FREEZE: never call fit again, only transform.

# 2. Train head only
Xt_tr = vec.transform(X_tr)
Xt_te = vec.transform(X_te)
print('frozen feature dim:', Xt_tr.shape[1])

clf_frozen = LogisticRegression(max_iter=500).fit(Xt_tr, y_tr)
acc_frozen = accuracy_score(y_te, clf_frozen.predict(Xt_te))
print(f'frozen-backbone accuracy:    {acc_frozen:.3f}')

# 3. Unfreeze (re-fit) on training data instead
vec2 = TfidfVectorizer(max_features=2000).fit(X_tr)
clf_unfr = LogisticRegression(max_iter=500).fit(vec2.transform(X_tr), y_tr)
acc_unfr = accuracy_score(y_te, clf_unfr.predict(vec2.transform(X_te)))
print(f'unfrozen-backbone accuracy:  {acc_unfr:.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) BERT omurgası içindeki her parametrede <code>requires_grad = False</code> ayarlar. Optimizer güncelleme adımları sırasında bunları atlayacak; yalnızca sınıflandırma başı eğitilecek. Bu en ucuz ince ayardır. 2) Seçici olarak son 2 transformer encoder katmanını çözer. Bu, üstte ifade gücü eklerken erken katmanları (genel sözdizimi kodlayan) sabit tutar. 3) Eğitilebilir parametreleri saymak için yardımcı -- dondurmanızın düşündüğünüz şeyi yaptığını doğrulamak için benimsemeniz gereken bir alışkanlık. 4) ULMFiT tarifini özetler: yalnızca başı eğit, sonra epoch'lar boyunca yukarıdan aşağıya katmanları aşamalı olarak çöz. Bu erken eğitimi stabilize eder ve felaketsel unutmayı önler. 5) Yalnızca embedding katmanını dondurmak popüler bir orta yoldur -- embedding matrisi büyüktür (vocab * 768) ve nadiren alan adaptasyonuna ihtiyaç duyar. Onu dondurmak bellek kazandırır ve çoğu görevde kabaca aynı doğruluğu verir.</p>

<div class="l-warn"><strong>Dondurmadan sonra optimizer'ı tekrar kontrol edin.</strong> <code>model.parameters()</code>'ı dondurmadan önce optimizer'a geçirirseniz, dondurulmuş tensor'lar hâlâ optimizer'ın durumundadır ama gradyan almazlar -- bu sorun değil. Ama optimizer'ı kurduktan SONRA dondurursanız ve daha sonra çözerseniz, o parametreler aslında güncellenmeyecek (orijinal olarak optimizer'a verilmedikçe). Kalıp: <code>optim.AdamW([p for p in model.parameters() if p.requires_grad], lr=...)</code> -- veya daha esnek olarak, tüm parametreleri verin ve <code>requires_grad</code>'ın güncellemeleri kontrol etmesine izin verin.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Katman Bazlı Öğrenme Oranları</h2>

<p class="l-text">Farklı katmanlar farklı hızlarda öğrenir. Alt katmanlar (embedding'lere yakın) yalnızca minik ayarlamalara ihtiyaç duyan genel özellikleri kodlar; üst katmanlar (başa yakın) göreve özgü soyutlamaları kodlar ve daha büyük güncellemelere tolerans gösterir. Katman bazlı öğrenme oranı azalması (LLRD) her katmana yukarıdan aşağıya üstel olarak ölçeklenmiş kendi öğrenme oranını verir.</p>

<div class="katex-block">$$\\eta_{\\ell} = \\eta_{\\text{top}} \\cdot \\gamma^{(L - \\ell)}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">eta_l</div><div class="card-body">Katman l için öğrenme oranı.</div></div>
<div class="calc-card"><div class="card-title">eta_top</div><div class="card-body">Üst (baş) öğrenme oranı, örn. 2e-5.</div></div>
<div class="calc-card"><div class="card-title">gamma</div><div class="card-body">(0, 1) içinde azalma faktörü. Yaygın: 0.9 veya 0.95.</div></div>
<div class="calc-card"><div class="card-title">L</div><div class="card-body">Toplam katman sayısı (örn. BERT-base için 12).</div></div>
<div class="calc-card"><div class="card-title">l</div><div class="card-body">Katman indeksi (0 = embedding'e yakın alt).</div></div>
<div class="calc-card"><div class="card-title">Etki</div><div class="card-body">Üst katman en hızlı eğitilir; alt zar zor hareket eder. Daha iyi kararlılık ve doğruluk.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.optim <span class="kw">import</span> AdamW
<span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>, num_labels=<span class="num">2</span>)

<span class="kw">def</span> <span class="fn">make_param_groups</span>(model, head_lr=<span class="num">2e-5</span>, gamma=<span class="num">0.9</span>):
    groups = []

    <span class="cm"># 1) Siniflandirici bas: en yüksek LR</span>
    head_params = <span class="fn">list</span>(model.classifier.<span class="fn">parameters</span>())
    groups.<span class="fn">append</span>({<span class="str">"params"</span>: head_params, <span class="str">"lr"</span>: head_lr})

    <span class="cm"># 2) Her BERT encoder katmani: ustel azalan LR</span>
    num_layers = <span class="fn">len</span>(model.bert.encoder.layer)
    <span class="kw">for</span> i, layer <span class="kw">in</span> <span class="fn">enumerate</span>(model.bert.encoder.layer):
        layer_lr = head_lr * (gamma ** (num_layers - i))
        groups.<span class="fn">append</span>({<span class="str">"params"</span>: <span class="fn">list</span>(layer.<span class="fn">parameters</span>()), <span class="str">"lr"</span>: layer_lr})

    <span class="cm"># 3) Embedding'ler: en düşük LR</span>
    emb_lr = head_lr * (gamma ** (num_layers + <span class="num">1</span>))
    groups.<span class="fn">append</span>({<span class="str">"params"</span>: <span class="fn">list</span>(model.bert.embeddings.<span class="fn">parameters</span>()), <span class="str">"lr"</span>: emb_lr})

    <span class="cm"># 4) Pooler</span>
    <span class="kw">if</span> <span class="fn">hasattr</span>(model.bert, <span class="str">"pooler"</span>) <span class="kw">and</span> model.bert.pooler <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
        groups.<span class="fn">append</span>({<span class="str">"params"</span>: <span class="fn">list</span>(model.bert.pooler.<span class="fn">parameters</span>()), <span class="str">"lr"</span>: head_lr})

    <span class="kw">return</span> groups

groups = <span class="fn">make_param_groups</span>(model, head_lr=<span class="num">2e-5</span>, gamma=<span class="num">0.9</span>)
optimizer = <span class="fn">AdamW</span>(groups, weight_decay=<span class="num">0.01</span>)

<span class="kw">for</span> i, g <span class="kw">in</span> <span class="fn">enumerate</span>(optimizer.param_groups):
    n = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> g[<span class="str">"params"</span>])
    <span class="fn">print</span>(f<span class="str">"grup {i}: {n/1e6:.2f}M params, lr={g['lr']:.2e}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Katman bazlı öğrenme oranları: farklı öğrenme oranlarıyla iki SGDClassifier eğitip tahminlerini birleştirerek simüle ediyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)
vec = TfidfVectorizer(max_features=1500).fit(X_tr)
Xt_tr = vec.transform(X_tr); Xt_te = vec.transform(X_te)

# 'lower layer' (smaller eta) vs 'head' (larger eta) -- different update magnitudes
slow = SGDClassifier(loss='log_loss', eta0=1e-4, learning_rate='constant', random_state=0,
                     max_iter=10, tol=None).fit(Xt_tr, y_tr)
fast = SGDClassifier(loss='log_loss', eta0=1e-2, learning_rate='constant', random_state=0,
                     max_iter=10, tol=None).fit(Xt_tr, y_tr)
print(f'slow-lr accuracy : {accuracy_score(y_te, slow.predict(Xt_te)):.3f}')
print(f'fast-lr accuracy : {accuracy_score(y_te, fast.predict(Xt_te)):.3f}')
# Real layer-wise LR: lower layers move less, head moves more -> faster fine-tuning.</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Sınıflandırıcı baş tam baş öğrenme oranını alır (2e-5). Yepyenidir -- sıfırdan öğrenmesi gerekir ve en büyük güncellemeleri tolere eder. 2) Her transformer encoder katmanı üstel olarak daha küçük bir LR ile kendi parametre grubunu alır. Katman 11 (en üst) <code>head_lr * gamma^1</code> alır, katman 0 <code>head_lr * gamma^12</code> alır. gamma=0.9 ile bu, katman 11'in 1.8e-5'te eğitildiği, katman 0'ın ~5.7e-6'da eğitildiği anlamına gelir -- yaklaşık 3 kat daha yavaş. 3) Embedding'ler en küçük LR'yi alır. Milyarlarca token üzerinde eğitildiler ve nadiren çok hareket etmeye ihtiyaç duyarlar. 4) BERT ayrıca [CLS]'i Linear+tanh aracılığıyla eşleyen bir pooler modülüne sahiptir; baş gibi davranın. 5) <code>AdamW</code> parametre grupları listesini kabul eder; her grup kendi öğrenme oranına, ağırlık azalmasına vb. sahip olabilir. Print döngüsü LR programının makul göründüğünü doğrular.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: LLRD en çok ne zaman yardımcı olur</div><div class="example-body">GLUE benchmark'larda (duygu, NLI, paraphrase) gamma=0.9-0.95 olan LLRD tipik olarak tek tip LR'ye göre +0.3 ile +1.0 doğruluk puanı kazandırır -- çalıştırmalar arasında birikene küçük ama güvenilir bir iyileştirme. Etki, önceden eğitilmiş özellikleri korumanın en önemli olduğu küçük veri kümelerinde en büyüktür. Büyük veri kümelerinde (milyonlarca örnek) fark daralır çünkü modelin agresif alt katman güncellemelerinden bile kurtulacak yeterli sinyali vardır.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Eğitim Eğrileri: Önceden Eğitilmiş vs Sıfırdan</h2>

<div id="plot-pl10-curves-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu görselin söylediği:</strong> 5k etiketli örnekle bir duygu sınıflandırma görevinin üç ayarı için eğitim epoch'ları üzerinde validasyon doğruluğu. Önceden eğitilmiş model yalnızca bir epoch sonra yüksek doğrulukta (yaklaşık %80) başlar ve hızla %92'ye yakın yakınsar. "Donmuş omurga" modeli de yüksek başlar ama dahili temsilleri uyarlayamadığı için daha düşük plato yapar. Sıfırdan model birçok epoch alır ve asla yetişemez -- 5k örnek rastgele başlatmadan iyi temsiller öğrenmek için yeterli değildir. <strong>NLP için neden önemli:</strong> bu eğri, her modern NLP sisteminin neden önceden eğitilmiş bir kontrol noktasından başladığının görsel kanıtıdır. Fark küçük bir optimizasyon kazancı değildir; yararlı bir ürün ile başarısızlık arasındaki farktır.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Bu cizimi gercek bir ince ayar calismasindan uretmek için taslak</span>
<span class="kw">import</span> torch

<span class="kw">def</span> <span class="fn">evaluate</span>(model, val_loader):
    model.<span class="fn">eval</span>()
    correct, total = <span class="num">0</span>, <span class="num">0</span>
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        <span class="kw">for</span> batch <span class="kw">in</span> val_loader:
            ids = batch[<span class="str">"input_ids"</span>]
            mask = batch[<span class="str">"attention_mask"</span>]
            labels = batch[<span class="str">"labels"</span>]
            out = <span class="fn">model</span>(input_ids=ids, attention_mask=mask)
            preds = out.logits.<span class="fn">argmax</span>(dim=-<span class="num">1</span>)
            correct += (preds == labels).<span class="fn">sum</span>().<span class="fn">item</span>()
            total += labels.<span class="fn">size</span>(<span class="num">0</span>)
    <span class="kw">return</span> correct / total

val_acc_history = []
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(num_epochs):
    <span class="fn">train_one_epoch</span>(model, train_loader, optimizer)
    acc = <span class="fn">evaluate</span>(model, val_loader)
    val_acc_history.<span class="fn">append</span>(acc)
    <span class="fn">print</span>(f<span class="str">"epoch {epoch+1}: val_acc={acc:.4f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Önceden eğitilmiş vs sıfırdan: iki LogReg eğit -- biri zengin önceden eğitilmiş TF-IDF üzerinde, diğeri ufak token sayım vektörü üzerinde -- karşılaştır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)

# 'From scratch' -- coarse, small features
v_scr = CountVectorizer(max_features=50)
Xs_tr = v_scr.fit_transform(X_tr); Xs_te = v_scr.transform(X_te)
acc_scr = accuracy_score(y_te, LogisticRegression(max_iter=500).fit(Xs_tr, y_tr).predict(Xs_te))

# 'Pretrained' -- rich TF-IDF features
v_pre = TfidfVectorizer(max_features=2000, ngram_range=(1,2))
Xp_tr = v_pre.fit_transform(X_tr); Xp_te = v_pre.transform(X_te)
acc_pre = accuracy_score(y_te, LogisticRegression(max_iter=500).fit(Xp_tr, y_tr).predict(Xp_te))

print(f'from-scratch  (50 features) : {acc_scr:.3f}')
print(f'pretrained-style TF-IDF      : {acc_pre:.3f}')
print('the gap = the value of pretraining.')</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>evaluate</code> fonksiyonu modeli eval modunda validasyon kümesi üzerinde çalıştırır, logit'ler üzerinde argmax alır ve doğru tahminleri sayar. <code>torch.no_grad()</code> autograd'ı devre dışı bırakarak değerlendirme sırasında belleği yarıya indirir ve hızı ikiye katlar. 2) Eğitim döngüsü bir <code>train_one_epoch</code> fonksiyonu çağırır (forward, loss, backward, step ile standart iç döngü) ve sonra validasyon kümesinde değerlendirir. 3) Her epoch doğruluğu saklamak çizeceğiniz zaman serisini üretir. Karşılaştırmayı almak için üç farklı model yapılandırması (tam önceden eğitilmiş, donmuş omurga, sıfırdan) için tekrarlayın.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. İnce Ayar mı Dondurma mı?</h2>

<p class="l-text">Tek bir doğru cevap yoktur; en iyi seçim etiketli veri kümenizin boyutuna ve alanınızın ön eğitim verilerine ne kadar benzediğine bağlıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çok küçük + benzer alan</div><div class="card-body">&lt;1k örnek, kaynak alan eşleşir. Omurgayı dondur, yalnızca başı eğit. Her şeyi ince ayar yaparsanız overfit riski.</div></div>
<div class="calc-card"><div class="card-title">Çok küçük + farklı alan</div><div class="card-body">&lt;1k, çok farklı (örn. tıbbi metin vs genel İngilizce). Önce etiketsiz alan metninde MLM ön eğitimi sürdür, sonra dondur + başı eğit.</div></div>
<div class="calc-card"><div class="card-title">Orta + benzer</div><div class="card-body">1k-50k benzer. 3-5 epoch için küçük lr (2e-5) ile tam ince ayar. Standart tarif.</div></div>
<div class="calc-card"><div class="card-title">Orta + farklı</div><div class="card-body">1k-50k farklı. Alana uyarlanmış ön eğitim + tam ince ayar. LLRD yardımcı olur.</div></div>
<div class="calc-card"><div class="card-title">Büyük + benzer</div><div class="card-body">50k+ benzer. Tam ince ayar, gamma=0.95, daha fazla epoch tamam.</div></div>
<div class="calc-card"><div class="card-title">Büyük + farklı</div><div class="card-body">50k+ farklı. Tam ince ayar; bütçe izin veriyorsa daha uzun ön eğitim düşünün.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: Türkçe duygu görevi için seçim</div><div class="example-body">8000 etiketli Türkçe film yorumunuz var. Orijinal BERT İngilizceydi; çok dilli BERT (mBERT) Türkçe gördü ama İngilizce'den çok daha az miktarda. En iyi tarif: <code>dbmdz/bert-base-turkish-uncased</code>'den başlayın (Türkçe corpus üzerinde eğitilmiş Türkçe'ye özgü BERT), birkaç yüz bin etiketsiz Türkçe yorum üzerinde kısa bir MLM-devam-eden-ön-eğitim yapın (1-2 epoch), sonra tam çözme, lr=2e-5, 4 epoch ile duygu için ince ayar yapın. %87-90 doğruluk bekleyin. Türkçe temel modeli atlamak ve İngilizce BERT kullanmak ~6-10 puan kaybeder; alan ön eğitimini atlamak ~1-2 puana mal olur.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Tam BERT İnce Ayar Adım Adım</h2>

<div class="calc-highlight">📘 <strong>Daha üst seviye alternatif:</strong> <a href="/tutorials/ai/huggingface/bert-sentiment-analysis">HuggingFace Dersi 3</a> aynı IMDB duygu ince ayarını <code>Trainer</code> API ile gösterir — daha az satır, daha az kontrol. Üretim prototiplemesi için onu kullanın; aşağıdaki düşük-seviye PyTorch döngüsü <code>Trainer</code>'ın altında neyi gizlediğini gösterir.</div>

<p class="l-text">Hepsini birleştirme: ikili duygu sınıflandırması için tam bir BERT ince ayar betiği.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader
<span class="kw">from</span> torch.optim <span class="kw">import</span> AdamW
<span class="kw">from</span> transformers <span class="kw">import</span> (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    get_linear_schedule_with_warmup,
)

<span class="cm"># 1) Demo için minik sentetik veri kumesi</span>
<span class="kw">class</span> <span class="fn">SentimentDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, texts, labels, tokenizer, max_len=<span class="num">128</span>):
        self.texts = texts
        self.labels = labels
        self.tok = tokenizer
        self.max_len = max_len
    <span class="kw">def</span> <span class="fn">__len__</span>(self):
        <span class="kw">return</span> <span class="fn">len</span>(self.texts)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, idx):
        enc = self.<span class="fn">tok</span>(self.texts[idx], padding=<span class="str">"max_length"</span>,
                       truncation=<span class="kw">True</span>, max_length=self.max_len,
                       return_tensors=<span class="str">"pt"</span>)
        <span class="kw">return</span> {
            <span class="str">"input_ids"</span>: enc[<span class="str">"input_ids"</span>].<span class="fn">squeeze</span>(<span class="num">0</span>),
            <span class="str">"attention_mask"</span>: enc[<span class="str">"attention_mask"</span>].<span class="fn">squeeze</span>(<span class="num">0</span>),
            <span class="str">"labels"</span>: torch.<span class="fn">tensor</span>(self.labels[idx], dtype=torch.long),
        }

texts = [<span class="str">"I love this"</span>, <span class="str">"this is terrible"</span>, <span class="str">"amazing!"</span>, <span class="str">"boring movie"</span>, <span class="str">"best ever"</span>, <span class="str">"waste of time"</span>]
labels = [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>]

<span class="cm"># 2) Kurulum</span>
device = torch.<span class="fn">device</span>(<span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>)
checkpoint = <span class="str">"bert-base-uncased"</span>
tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(checkpoint)
model = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(checkpoint, num_labels=<span class="num">2</span>).<span class="fn">to</span>(device)

train_ds = <span class="fn">SentimentDataset</span>(texts, labels, tokenizer)
train_loader = <span class="fn">DataLoader</span>(train_ds, batch_size=<span class="num">2</span>, shuffle=<span class="kw">True</span>)

<span class="cm"># 3) Bias / LayerNorm uzerinde decay yok grupli optimizer</span>
no_decay = [<span class="str">"bias"</span>, <span class="str">"LayerNorm.weight"</span>]
grouped = [
    {<span class="str">"params"</span>: [p <span class="kw">for</span> n, p <span class="kw">in</span> model.<span class="fn">named_parameters</span>() <span class="kw">if</span> <span class="kw">not</span> <span class="fn">any</span>(nd <span class="kw">in</span> n <span class="kw">for</span> nd <span class="kw">in</span> no_decay)],
     <span class="str">"weight_decay"</span>: <span class="num">0.01</span>},
    {<span class="str">"params"</span>: [p <span class="kw">for</span> n, p <span class="kw">in</span> model.<span class="fn">named_parameters</span>() <span class="kw">if</span> <span class="fn">any</span>(nd <span class="kw">in</span> n <span class="kw">for</span> nd <span class="kw">in</span> no_decay)],
     <span class="str">"weight_decay"</span>: <span class="num">0.0</span>},
]
optimizer = <span class="fn">AdamW</span>(grouped, lr=<span class="num">2e-5</span>)

<span class="cm"># 4) Lineer warmup sonra lineer azalma</span>
num_epochs = <span class="num">3</span>
total_steps = <span class="fn">len</span>(train_loader) * num_epochs
scheduler = <span class="fn">get_linear_schedule_with_warmup</span>(optimizer, num_warmup_steps=<span class="fn">int</span>(<span class="num">0.1</span>*total_steps),
                                            num_training_steps=total_steps)

<span class="cm"># 5) Egitim dongusu</span>
model.<span class="fn">train</span>()
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(num_epochs):
    <span class="kw">for</span> batch <span class="kw">in</span> train_loader:
        batch = {k: v.<span class="fn">to</span>(device) <span class="kw">for</span> k, v <span class="kw">in</span> batch.<span class="fn">items</span>()}
        out = <span class="fn">model</span>(**batch)
        loss = out.loss
        loss.<span class="fn">backward</span>()
        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), max_norm=<span class="num">1.0</span>)
        optimizer.<span class="fn">step</span>()
        scheduler.<span class="fn">step</span>()
        optimizer.<span class="fn">zero_grad</span>()
    <span class="fn">print</span>(f<span class="str">"epoch {epoch+1}: loss={loss.item():.4f}"</span>)

<span class="cm"># 6) Cikarim</span>
model.<span class="fn">eval</span>()
test_text = <span class="str">"this movie blew me away"</span>
enc = <span class="fn">tokenizer</span>(test_text, return_tensors=<span class="str">"pt"</span>, truncation=<span class="kw">True</span>, max_length=<span class="num">128</span>).<span class="fn">to</span>(device)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    logits = <span class="fn">model</span>(**enc).logits
    probs = torch.<span class="fn">softmax</span>(logits, dim=-<span class="num">1</span>)
    pred = probs.<span class="fn">argmax</span>(dim=-<span class="num">1</span>).<span class="fn">item</span>()
<span class="fn">print</span>(f<span class="str">"metin: {test_text}"</span>)
<span class="fn">print</span>(f<span class="str">"tahmin: {pred}  olasiliklar: {probs.tolist()}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tam BERT ince ayar konsepti: tokenize -> bağlamsallaştır -> sınıflandır. sklearn ile: BERT benzeri iş akışı için TF-IDF + LR + metrik raporu.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.2, random_state=0
)

pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=3000, ngram_range=(1,3))),
    ('clf', LogisticRegression(max_iter=500, C=2.0)),
])
pipe.fit(X_tr, y_tr)
pred = pipe.predict(X_te)
print(classification_report(y_te, pred, digits=3))
print('confusion matrix:\n', confusion_matrix(y_te, pred))</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Her metni talep üzerine tokenize eden bir Dataset tanımlar. Dinamik yerine veri kümesinde <code>max_length</code>'e padding yaparız -- daha basit, biraz daha az verimli. <code>squeeze(0)</code> tokenizer tarafından eklenen batch boyutunu kaldırır. 2) BERT base + tokenizer'ı yükler ve modeli 2 etiketli <code>AutoModelForSequenceClassification</code>'a sarar. Kütüphane [CLS] -> Linear -> 2 logit başını halleder. 3) Parametreleri iki AdamW grubuna böler: bias ve LayerNorm ağırlıkları weight decay'i atlar (önemli bir detay -- bunları azaltmak performansı düşürür), diğer her şey weight_decay=0.01 alır. 4) Lineer warmup-sonra-azalma programı: lr ilk %10 adımda 0'dan 2e-5'e yükselir, sonra sona kadar lineer olarak 0'a azalır. Bu standart BERT ince ayar programıdır. 5) Standart eğitim döngüsü: <code>labels</code> geçirdiğimiz için forward kayıp döner, backward, 1.0'da gradyan kırpma (transformer kararlılığı için elzem), optimizer adımı, scheduler adımı, gradyanları sıfırla. 6) Çıkarım: eval modu, no grad, bir örneği tokenize et, 2 logit üzerinde argmax al ve tahmini yazdır. Yeterli etiketli veriyle (10k+ örnek) bu kesin tarif çoğu ikili duygu görevinde %90+ doğruluk getirir.</p>

<div class="think-box"><div class="think-label">ANA NOKTALAR</div><div class="think-body"><strong>1.</strong> Transfer öğrenme NLP için varsayılandır: önceden eğitilmiş omurga + göreve özgü baş + küçük etiketli veri kümesi.<br><strong>2.</strong> <code>torch.hub</code> görü için harika; <code>transformers</code> NLP için standart.<br><strong>3.</strong> <code>AutoModelFor...</code> sınıfları görevinize doğru başı otomatik takar.<br><strong>4.</strong> Çok küçük veri kümeleri için omurgayı dondurun; orta boyutlular için tam ince ayar; en kararlı doğruluk için aşamalı çözme.<br><strong>5.</strong> Katman bazlı öğrenme oranı azalması (gamma=0.9-0.95) genellikle +0.3-1.0 doğruluk puanı verir.<br><strong>6.</strong> Bias / LayerNorm üzerinde weight decay yok + lineer warmup-azalma programı + 1.0'da gradyan kırpma olan AdamW kanonik BERT tarifidir.<br><strong>7.</strong> Alana uyarlanmış ön eğitim (etiketsiz alan içi metinde MLM'i sürdür) alanınız genel İngilizce'den uzak olduğunda yardımcı olur.<br><strong>8.</strong> Sonraki ders: üretim -- kaydetme, eval modu, TorchScript, ONNX, karışık hassasiyet, niceleme, profilleme.</div></div>
</div>`

};
