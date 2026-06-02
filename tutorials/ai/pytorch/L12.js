window.PYTORCH_L12 = {

en: `<p class="l-text"><strong>From raw text to a deployed API.</strong> This final lesson stitches everything together: tokenization (L8), the transformer architecture (L9), pretrained weights and fine-tuning (L10), inference and deployment (L11) -- and the dataset, training loop, optimizer, evaluation, debugging, and reproducibility patterns from L1-L7. The result is a working sentiment classification project on the IMDB movie reviews dataset, with the same code patterns you would use in a real NLP product or thesis pipeline.</p>

<p class="l-text">By the end you will have an end-to-end script you can adapt to any sequence-classification task: text in, label out, with training, evaluation, saving, loading, and a single-text inference function. We close with a debugging checklist and a roadmap of where to go next.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Load and split the IMDB dataset (25k/25k) into train, validation, and test loaders</li>
<li>Tokenize reviews with a HuggingFace tokenizer and build a padded <code>collate_fn</code></li>
<li>Fine-tune <code>distilbert-base-uncased</code> on sentiment with a 5-line training loop</li>
<li>Evaluate accuracy, precision, recall, F1, and plot a confusion matrix</li>
<li>Save the trained model and write a single-text <code>predict(text) -&gt; label, score</code> function</li>
<li>Apply a debugging checklist (loss not decreasing, eval bug, label leakage) on real failures</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Project Setup: IMDB Sentiment</h2>

<p class="l-text">IMDB is the canonical English sentiment benchmark: 25k labeled training reviews + 25k labeled test reviews, balanced 50/50 between positive and negative. Reviews are 100-2000 tokens, written in natural prose. Solving it well requires real language understanding, not surface heuristics -- which is why every NLP textbook uses it.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers datasets torch accelerate</span>

<span class="kw">import</span> torch
<span class="kw">import</span> random
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset

<span class="cm"># 1) Reproducibility -- set ALL the seeds</span>
<span class="kw">def</span> <span class="fn">set_seed</span>(seed=<span class="num">42</span>):
    random.<span class="fn">seed</span>(seed)
    np.random.<span class="fn">seed</span>(seed)
    torch.<span class="fn">manual_seed</span>(seed)
    torch.cuda.<span class="fn">manual_seed_all</span>(seed)
    torch.backends.cudnn.deterministic = <span class="kw">True</span>
    torch.backends.cudnn.benchmark = <span class="kw">False</span>

<span class="fn">set_seed</span>(<span class="num">42</span>)

<span class="cm"># 2) Load IMDB via HuggingFace datasets</span>
ds = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>)
<span class="fn">print</span>(ds)
<span class="cm"># DatasetDict({'train': Dataset({features: ['text','label'], num_rows: 25000}),</span>
<span class="cm">#              'test':  Dataset({features: ['text','label'], num_rows: 25000})})</span>

<span class="fn">print</span>(ds[<span class="str">"train"</span>][<span class="num">0</span>])
<span class="cm"># {'text': 'I rented I AM CURIOUS-YELLOW from my video store...', 'label': 0}</span>

<span class="cm"># 3) Quick stats</span>
<span class="fn">print</span>(<span class="str">"train labels:"</span>, np.<span class="fn">bincount</span>(ds[<span class="str">"train"</span>][<span class="str">"label"</span>]))
<span class="fn">print</span>(<span class="str">"test labels:"</span>, np.<span class="fn">bincount</span>(ds[<span class="str">"test"</span>][<span class="str">"label"</span>]))
<span class="cm"># 12500 / 12500 -- perfectly balanced</span>

<span class="cm"># 4) Train/val split (HF gives only train+test)</span>
ds_split = ds[<span class="str">"train"</span>].<span class="fn">train_test_split</span>(test_size=<span class="num">0.1</span>, seed=<span class="num">42</span>, stratify_by_column=<span class="str">"label"</span>)
ds_split[<span class="str">"validation"</span>] = ds_split.<span class="fn">pop</span>(<span class="str">"test"</span>)
ds_split[<span class="str">"test"</span>] = ds[<span class="str">"test"</span>]
<span class="fn">print</span>(ds_split)
<span class="cm"># train: 22500, validation: 2500, test: 25000</span>

<span class="cm"># 5) Device</span>
device = torch.<span class="fn">device</span>(<span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>)
<span class="fn">print</span>(<span class="str">"device:"</span>, device)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Project setup analog: use df_reviews (sentiment data already loaded by Pyodide preamble) as a stand-in for IMDB. Inspect class balance.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

print('df_reviews shape :', df_reviews.shape)
print('columns          :', df_reviews.columns.tolist())
print('label distribution:')
print(df_reviews['label'].value_counts())

# Length statistics
lens = df_reviews['review'].str.split().apply(len)
print(f'review length: mean={lens.mean():.1f}, max={lens.max()}, min={lens.min()}')
print('first 2 reviews:')
for i in range(2):
    row = df_reviews.iloc[i]
    print(f'  [{row["label"]}] {row["review"][:80]}...')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>set_seed</code> seeds Python random, NumPy, PyTorch CPU and CUDA RNGs and turns on deterministic cuDNN. This is the reproducibility ritual every NLP project should run before anything else. 2) <code>load_dataset("imdb")</code> downloads the dataset (cached locally after first call) and returns a DatasetDict with train and test splits. 3) Quick label distribution check confirms the balance and is a sanity check you should run on every dataset to catch label leakage or accidental imbalance. 4) IMDB ships only train+test, so we carve out 10% of train as a stratified validation set. <code>stratify_by_column</code> ensures the val split has the same label balance as train -- crucial for unbiased early stopping. 5) Picks GPU if available; print so you do not accidentally train BERT on CPU.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Tokenization with HuggingFace</h2>

<p class="l-text">Use a pretrained BERT tokenizer aligned with the model checkpoint we will fine-tune. The tokenizer handles WordPiece subwords, special tokens [CLS]/[SEP]/[PAD], truncation, and attention masks for free.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer

CHECKPOINT = <span class="str">"distilbert-base-uncased"</span>      <span class="cm"># 6-layer distilled BERT, ~66M params</span>
MAX_LEN = <span class="num">256</span>                                <span class="cm"># IMDB has long reviews; 256 is a sane cutoff</span>

tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(CHECKPOINT)

<span class="cm"># 1) Tokenize a single example</span>
sample = <span class="str">"This movie was an absolute masterpiece! Brilliant acting and writing."</span>
enc = <span class="fn">tokenizer</span>(sample, truncation=<span class="kw">True</span>, max_length=MAX_LEN, padding=<span class="str">"max_length"</span>, return_tensors=<span class="str">"pt"</span>)
<span class="fn">print</span>(enc.<span class="fn">keys</span>())                            <span class="cm"># ['input_ids', 'attention_mask']</span>
<span class="fn">print</span>(enc[<span class="str">"input_ids"</span>].shape)                <span class="cm"># (1, 256)</span>
<span class="fn">print</span>(tokenizer.<span class="fn">decode</span>(enc[<span class="str">"input_ids"</span>][<span class="num">0</span>][:<span class="num">20</span>]))
<span class="cm"># [CLS] this movie was an absolute masterpiece ! brilliant acting and writing . [SEP] [PAD] [PAD] ...</span>

<span class="cm"># 2) Batch tokenize the entire dataset (efficient, runs once)</span>
<span class="kw">def</span> <span class="fn">tokenize_fn</span>(batch):
    <span class="kw">return</span> <span class="fn">tokenizer</span>(batch[<span class="str">"text"</span>],
                     truncation=<span class="kw">True</span>,
                     max_length=MAX_LEN,
                     padding=<span class="str">"max_length"</span>)

ds_tok = ds_split.<span class="fn">map</span>(tokenize_fn, batched=<span class="kw">True</span>, batch_size=<span class="num">1000</span>)
ds_tok = ds_tok.<span class="fn">remove_columns</span>([<span class="str">"text"</span>])
ds_tok = ds_tok.<span class="fn">rename_column</span>(<span class="str">"label"</span>, <span class="str">"labels"</span>)
ds_tok.<span class="fn">set_format</span>(<span class="str">"torch"</span>, columns=[<span class="str">"input_ids"</span>, <span class="str">"attention_mask"</span>, <span class="str">"labels"</span>])

<span class="cm"># 3) Verify</span>
ex = ds_tok[<span class="str">"train"</span>][<span class="num">0</span>]
<span class="fn">print</span>(ex.<span class="fn">keys</span>())                             <span class="cm"># dict_keys(['input_ids', 'attention_mask', 'labels'])</span>
<span class="fn">print</span>(ex[<span class="str">"input_ids"</span>].shape)                 <span class="cm"># torch.Size([256])</span>
<span class="fn">print</span>(ex[<span class="str">"labels"</span>])                          <span class="cm"># tensor(0) or tensor(1)</span>

<span class="cm"># 4) Distribution of token lengths -- should we use longer max_len?</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
lengths = [<span class="fn">len</span>(tokenizer.<span class="fn">encode</span>(t, truncation=<span class="kw">False</span>)) <span class="kw">for</span> t <span class="kw">in</span> ds_split[<span class="str">"train"</span>][<span class="str">"text"</span>][:<span class="num">500</span>]]
<span class="fn">print</span>(f<span class="str">"length stats: mean={np.mean(lengths):.0f}, median={np.median(lengths):.0f}, p95={np.percentile(lengths,95):.0f}, max={max(lengths)}"</span>)
<span class="cm"># typical IMDB: mean ~290, p95 ~600 -- 256 truncates p70+ reviews</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tokenization: HuggingFace AutoTokenizer concept = vocab + lowercase + whitespace split. We replicate with sklearn's CountVectorizer.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import CountVectorizer

# Build a vocabulary (the HF tokenizer's vocab.txt analog)
vec = CountVectorizer(lowercase=True, max_features=2000)
vec.fit(df_reviews['review'])
vocab = vec.vocabulary_
print(f'vocab size      : {len(vocab)}')
print(f'sample tokens   : {list(vocab)[:8]}')

# 'Tokenize' a sentence -> list of ids
sample = "This movie was absolutely amazing"
tokens = sample.lower().split()
ids = [vocab.get(t, -1) for t in tokens]
print(f'sentence : {sample!r}')
print(f'tokens   : {tokens}')
print(f'ids      : {ids}    (-1 = unknown)')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Tokenizes one example with <code>padding="max_length"</code> and <code>truncation=True</code> -- output is exactly <code>(1, 256)</code> regardless of input length. The decoded version shows BERT's special tokens [CLS] (sentence start) and [SEP] (sentence end), then [PAD] tokens fill the rest. 2) <code>ds.map(..., batched=True)</code> tokenizes the whole dataset in batches of 1000 -- much faster than tokenizing one example at a time inside a Dataset.__getitem__. We rename "label" to "labels" because that is what HuggingFace models expect. <code>set_format("torch")</code> makes Dataset return PyTorch tensors directly. 3) Sanity check on the result: each example is now a dict with three torch tensors. 4) Inspecting token-length distribution helps you choose <code>max_len</code>. IMDB reviews can be very long; 256 is a memory/accuracy compromise. For thesis-quality results, try 512 with a smaller batch.</p>

<div class="l-note"><strong>Choosing max_len:</strong> too small and you truncate signal (especially in long reviews); too large and memory + latency explode quadratically. The standard recipe: profile your data, pick max_len at p90-p95 of length distribution, accept that the longest tail will be truncated.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Custom Dataset and DataLoader</h2>

<p class="l-text">HuggingFace datasets work directly with PyTorch DataLoader thanks to <code>set_format("torch")</code>. We just need a DataLoader for batching and shuffling.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader

BATCH_SIZE = <span class="num">16</span>

train_loader = <span class="fn">DataLoader</span>(ds_tok[<span class="str">"train"</span>], batch_size=BATCH_SIZE, shuffle=<span class="kw">True</span>, num_workers=<span class="num">2</span>, pin_memory=<span class="kw">True</span>)
val_loader = <span class="fn">DataLoader</span>(ds_tok[<span class="str">"validation"</span>], batch_size=BATCH_SIZE * <span class="num">2</span>, shuffle=<span class="kw">False</span>, num_workers=<span class="num">2</span>, pin_memory=<span class="kw">True</span>)
test_loader = <span class="fn">DataLoader</span>(ds_tok[<span class="str">"test"</span>], batch_size=BATCH_SIZE * <span class="num">2</span>, shuffle=<span class="kw">False</span>, num_workers=<span class="num">2</span>, pin_memory=<span class="kw">True</span>)

<span class="cm"># 1) Inspect a batch</span>
batch = <span class="fn">next</span>(<span class="fn">iter</span>(train_loader))
<span class="fn">print</span>(batch.<span class="fn">keys</span>())                       <span class="cm"># ['input_ids', 'attention_mask', 'labels']</span>
<span class="fn">print</span>(batch[<span class="str">"input_ids"</span>].shape)           <span class="cm"># (16, 256)</span>
<span class="fn">print</span>(batch[<span class="str">"attention_mask"</span>].shape)      <span class="cm"># (16, 256)</span>
<span class="fn">print</span>(batch[<span class="str">"labels"</span>].shape)              <span class="cm"># (16,)</span>
<span class="fn">print</span>(batch[<span class="str">"labels"</span>][:<span class="num">8</span>])                <span class="cm"># tensor([0, 1, 1, 0, 1, 0, 1, 0])</span>

<span class="cm"># 2) For variable-length batches: dynamic padding via DataCollator</span>
<span class="kw">from</span> transformers <span class="kw">import</span> DataCollatorWithPadding
collator = <span class="fn">DataCollatorWithPadding</span>(tokenizer, padding=<span class="kw">True</span>)
<span class="cm"># (Use this instead of padding="max_length" when you tokenize without padding)</span>

<span class="cm"># 3) Sanity: forward through the network expects exactly these keys</span>
<span class="cm"># -- input_ids, attention_mask, labels -- because HF models named arguments.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Custom Dataset + DataLoader -- a Python class that yields (text, label) tuples, batched by a generator.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>class TextDataset:
    def __init__(self, df):
        self.texts  = df['review'].tolist()
        self.labels = df['label'].tolist()
    def __len__(self):  return len(self.texts)
    def __getitem__(self, i): return (self.texts[i], int(self.labels[i]))

def loader(ds, bs=8):
    n = len(ds)
    for s in range(0, n, bs):
        batch = [ds[i] for i in range(s, min(s+bs, n))]
        texts  = [b[0] for b in batch]
        labels = [b[1] for b in batch]
        yield texts, labels

ds = TextDataset(df_reviews.head(20))
batches = list(loader(ds, bs=8))
print(f'batches: {len(batches)}, sizes: {[len(b[0]) for b in batches]}')
print('batch 0 labels:', batches[0][1])
print('batch 0 text 0 (truncated):', batches[0][0][0][:60], '...')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds three DataLoaders. Train shuffles each epoch; val and test do not. We use a larger batch for eval since we do not need gradients. <code>num_workers=2</code> spawns 2 worker processes for parallel data loading; <code>pin_memory=True</code> speeds up CPU-GPU transfer. 2) Inspects a batch: shape is <code>(B, T) = (16, 256)</code> for inputs and <code>(B,)</code> for labels. 3) Mentions an alternative pattern: tokenize without padding and let a <code>DataCollatorWithPadding</code> pad each batch to its longest sequence dynamically. This is faster when sequences vary widely in length, but slightly more code.</p>

<div class="l-warn"><strong>num_workers gotcha on Windows:</strong> on Windows, <code>num_workers &gt; 0</code> requires the training script to be wrapped in <code>if __name__ == "__main__":</code> or you get an infinite recursion. On Linux/Mac it works directly.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Model: BERT + Classification Head</h2>

<p class="l-text">DistilBERT is BERT distilled to half the layers (6 instead of 12); 60% of the parameters, 95% of the accuracy. For a sentiment fine-tune it is a great default -- fast to train, fast to deploy, good accuracy.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForSequenceClassification

NUM_LABELS = <span class="num">2</span>

model = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(
    CHECKPOINT,
    num_labels=NUM_LABELS,
    id2label={<span class="num">0</span>: <span class="str">"negative"</span>, <span class="num">1</span>: <span class="str">"positive"</span>},
    label2id={<span class="str">"negative"</span>: <span class="num">0</span>, <span class="str">"positive"</span>: <span class="num">1</span>},
).<span class="fn">to</span>(device)

<span class="fn">print</span>(model)
<span class="cm"># DistilBertForSequenceClassification(...)</span>
<span class="cm"># (classifier): Linear(in_features=768, out_features=2, bias=True)</span>

<span class="cm"># 1) Parameter counts</span>
total = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())
trainable = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>() <span class="kw">if</span> p.requires_grad)
<span class="fn">print</span>(f<span class="str">"total: {total/1e6:.2f}M, trainable: {trainable/1e6:.2f}M"</span>)
<span class="cm"># total: 66.96M, trainable: 66.96M (full fine-tune)</span>

<span class="cm"># 2) Forward sanity check</span>
batch = {k: v.<span class="fn">to</span>(device) <span class="kw">for</span> k, v <span class="kw">in</span> batch.<span class="fn">items</span>()}
out = <span class="fn">model</span>(**batch)
<span class="fn">print</span>(out.loss, out.logits.shape)
<span class="cm"># tensor(0.71, ...)  torch.Size([16, 2])</span>
<span class="cm"># loss is computed because we passed "labels"</span>

<span class="cm"># 3) Without labels you get just logits</span>
out = <span class="fn">model</span>(input_ids=batch[<span class="str">"input_ids"</span>], attention_mask=batch[<span class="str">"attention_mask"</span>])
<span class="fn">print</span>(out.logits.shape)             <span class="cm"># (16, 2)</span>
<span class="fn">print</span>(out.loss)                     <span class="cm"># None</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">BERT + classification head concept: feature extractor -> dense layer -> softmax. We build the equivalent two-stage sklearn model.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Stage 1: tokenize + featurize (= BERT contextual encoder)
vec = TfidfVectorizer(max_features=1500, ngram_range=(1, 2))
X = vec.fit_transform(df_reviews['review'])

# Stage 2: classification head
clf = LogisticRegression(max_iter=500, C=1.0)
clf.fit(X, df_reviews['label'])

print('feature dim (= BERT hidden size analog):', X.shape[1])
print('head shape   :', clf.coef_.shape, '(classes, features)')
print('head bias    :', clf.intercept_.round(3))
sample_pred = clf.predict(vec.transform(['I really enjoyed this',
                                         'It was the worst film ever']))
print('sample preds :', sample_pred)</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads DistilBERT with a fresh 2-class classification head. We pass <code>id2label</code> and <code>label2id</code> so the saved model carries human-readable label names -- one less thing to look up at inference time. 2) Parameter counts confirm everything is trainable (full fine-tune). DistilBERT-base is 66M parameters, about 60% of BERT-base. 3) Forward pass through one batch returns a SequenceClassifierOutput with <code>loss</code> (because we passed <code>labels</code>) and <code>logits</code> of shape <code>(B, 2)</code>. The loss is cross-entropy applied to the logits and labels by the model itself -- no need to compute it manually. 4) Without labels you get only logits; useful at inference time.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Training Loop with Mixed Precision</h2>

<p class="l-text">A complete training loop with: layer-wise weight decay (no decay on biases / LayerNorm), linear warmup-decay LR schedule, gradient clipping, mixed precision (bf16), gradient accumulation for larger effective batch on small GPUs, and logging.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torch.optim <span class="kw">import</span> AdamW
<span class="kw">from</span> transformers <span class="kw">import</span> get_linear_schedule_with_warmup

<span class="cm"># 1) Param groups: bias / LayerNorm get no weight decay</span>
no_decay = [<span class="str">"bias"</span>, <span class="str">"LayerNorm.weight"</span>]
grouped = [
    {<span class="str">"params"</span>: [p <span class="kw">for</span> n,p <span class="kw">in</span> model.<span class="fn">named_parameters</span>() <span class="kw">if</span> <span class="kw">not</span> <span class="fn">any</span>(nd <span class="kw">in</span> n <span class="kw">for</span> nd <span class="kw">in</span> no_decay)],
     <span class="str">"weight_decay"</span>: <span class="num">0.01</span>},
    {<span class="str">"params"</span>: [p <span class="kw">for</span> n,p <span class="kw">in</span> model.<span class="fn">named_parameters</span>() <span class="kw">if</span> <span class="fn">any</span>(nd <span class="kw">in</span> n <span class="kw">for</span> nd <span class="kw">in</span> no_decay)],
     <span class="str">"weight_decay"</span>: <span class="num">0.0</span>},
]
optimizer = <span class="fn">AdamW</span>(grouped, lr=<span class="num">2e-5</span>)

<span class="cm"># 2) LR schedule: 10% warmup, linear decay to 0</span>
EPOCHS = <span class="num">3</span>
GRAD_ACCUM = <span class="num">2</span>                                <span class="cm"># effective batch = 16 * 2 = 32</span>
total_steps = (<span class="fn">len</span>(train_loader) // GRAD_ACCUM) * EPOCHS
scheduler = <span class="fn">get_linear_schedule_with_warmup</span>(optimizer,
    num_warmup_steps=<span class="fn">int</span>(<span class="num">0.1</span> * total_steps),
    num_training_steps=total_steps)

<span class="cm"># 3) Mixed precision</span>
use_bf16 = torch.cuda.<span class="fn">is_available</span>() <span class="kw">and</span> torch.cuda.<span class="fn">is_bf16_supported</span>()
amp_dtype = torch.bfloat16 <span class="kw">if</span> use_bf16 <span class="kw">else</span> torch.float16
scaler = <span class="kw">None</span> <span class="kw">if</span> use_bf16 <span class="kw">else</span> torch.cuda.amp.<span class="fn">GradScaler</span>()

<span class="kw">def</span> <span class="fn">train_one_epoch</span>(model, loader, optimizer, scheduler, scaler, accum=GRAD_ACCUM):
    model.<span class="fn">train</span>()
    running_loss = <span class="num">0.0</span>
    optimizer.<span class="fn">zero_grad</span>()
    <span class="kw">for</span> step, batch <span class="kw">in</span> <span class="fn">enumerate</span>(loader):
        batch = {k: v.<span class="fn">to</span>(device, non_blocking=<span class="kw">True</span>) <span class="kw">for</span> k, v <span class="kw">in</span> batch.<span class="fn">items</span>()}

        <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=amp_dtype, enabled=torch.cuda.<span class="fn">is_available</span>()):
            out = <span class="fn">model</span>(**batch)
            loss = out.loss / accum

        <span class="kw">if</span> scaler <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
            scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()
        <span class="kw">else</span>:
            loss.<span class="fn">backward</span>()

        <span class="kw">if</span> (step + <span class="num">1</span>) % accum == <span class="num">0</span>:
            <span class="kw">if</span> scaler <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
                scaler.<span class="fn">unscale_</span>(optimizer)
            torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
            <span class="kw">if</span> scaler <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
                scaler.<span class="fn">step</span>(optimizer)
                scaler.<span class="fn">update</span>()
            <span class="kw">else</span>:
                optimizer.<span class="fn">step</span>()
            scheduler.<span class="fn">step</span>()
            optimizer.<span class="fn">zero_grad</span>()

        running_loss += loss.<span class="fn">item</span>() * accum
        <span class="kw">if</span> step % <span class="num">50</span> == <span class="num">0</span>:
            <span class="fn">print</span>(f<span class="str">"  step {step}: loss={loss.item()*accum:.4f}, lr={scheduler.get_last_lr()[0]:.2e}"</span>)
    <span class="kw">return</span> running_loss / <span class="fn">len</span>(loader)

<span class="cm"># 4) Run training</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(EPOCHS):
    <span class="fn">print</span>(f<span class="str">"=== epoch {epoch+1}/{EPOCHS} ==="</span>)
    train_loss = <span class="fn">train_one_epoch</span>(model, train_loader, optimizer, scheduler, scaler)
    <span class="fn">print</span>(f<span class="str">"  train loss: {train_loss:.4f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Training loop: fit on training data and track loss/accuracy across epochs (with SGDClassifier + partial_fit, like torch's epoch loop).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, log_loss

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.2, random_state=0
)
vec = TfidfVectorizer(max_features=1000).fit(X_tr)
Xt_tr = vec.transform(X_tr); Xt_te = vec.transform(X_te)

clf = SGDClassifier(loss='log_loss', random_state=0)
classes = np.unique(y_tr)

for epoch in range(8):
    clf.partial_fit(Xt_tr, y_tr, classes=classes)
    proba = clf.predict_proba(Xt_te)
    loss = log_loss(y_te, proba, labels=classes)
    acc  = accuracy_score(y_te, clf.predict(Xt_te))
    print(f'epoch {epoch+1:2d}  val_loss={loss:.4f}  val_acc={acc:.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Splits parameters into two AdamW groups: bias and LayerNorm.weight skip weight decay (a critical detail -- decaying these hurts BERT performance), everything else gets <code>weight_decay=0.01</code>. 2) Computes total optimizer steps based on dataset size, accumulation steps, and epochs, then builds a linear warmup-then-decay schedule. 3) Auto-detects bf16 support; falls back to fp16 with GradScaler on older GPUs. 4) The training loop: forward inside autocast for fp16/bf16 compute, divide loss by accumulation factor (so we average over the accumulated batches), backward, every <code>accum</code> steps perform one optimizer step with grad clipping and zero-grad. The scheduler advances once per real optimizer step, not once per micro-batch. 5) Outer loop iterates over epochs; <code>train_one_epoch</code> returns mean loss for logging. With 3 epochs on IMDB you typically reach 92-93% validation accuracy on DistilBERT.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gradient accumulation</div><div class="card-body">Simulate larger batch by averaging gradients over N micro-batches before stepping. Same statistics, same memory.</div></div>
<div class="calc-card"><div class="card-title">Grad clipping</div><div class="card-body">Cap grad norm at 1.0. Prevents rare large updates from destabilizing training.</div></div>
<div class="calc-card"><div class="card-title">bf16 vs fp16</div><div class="card-body">bf16 has fp32 range, no GradScaler. Default on A100/H100. fp16 needs GradScaler.</div></div>
<div class="calc-card"><div class="card-title">non_blocking=True</div><div class="card-body">Async CPU-GPU transfer. Pairs with pin_memory=True for ~10% throughput.</div></div>
<div class="calc-card"><div class="card-title">.zero_grad()</div><div class="card-body">Always call BEFORE backward (or after step), or gradients accumulate forever.</div></div>
<div class="calc-card"><div class="card-title">scheduler step</div><div class="card-body">Once per OPTIMIZER step (not per micro-batch) when accumulating.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Evaluation: Accuracy, F1, Confusion Matrix</h2>

<div id="plot-pl12-conf-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The 2x2 confusion matrix for our trained DistilBERT sentiment model on the IMDB test set. Diagonal cells are correct predictions; off-diagonal cells are errors. Both classes show similar accuracy, with slightly more "negative misclassified as positive" than the reverse -- a common pattern when reviews use sarcasm or mixed sentiment. <strong>Why it matters for NLP:</strong> a single accuracy number can hide imbalanced errors. A confusion matrix immediately shows which class is hard, which direction of confusion dominates, and whether the model has a systematic bias. For thesis-quality work, always report the confusion matrix alongside scalar metrics.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, f1_score, confusion_matrix, classification_report

<span class="at">@torch.inference_mode</span>()
<span class="kw">def</span> <span class="fn">evaluate</span>(model, loader):
    model.<span class="fn">eval</span>()
    all_preds, all_labels = [], []
    <span class="kw">for</span> batch <span class="kw">in</span> loader:
        batch = {k: v.<span class="fn">to</span>(device, non_blocking=<span class="kw">True</span>) <span class="kw">for</span> k, v <span class="kw">in</span> batch.<span class="fn">items</span>()}
        <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=amp_dtype, enabled=torch.cuda.<span class="fn">is_available</span>()):
            logits = <span class="fn">model</span>(input_ids=batch[<span class="str">"input_ids"</span>],
                           attention_mask=batch[<span class="str">"attention_mask"</span>]).logits
        preds = logits.<span class="fn">argmax</span>(dim=-<span class="num">1</span>).<span class="fn">cpu</span>().<span class="fn">numpy</span>()
        all_preds.<span class="fn">append</span>(preds)
        all_labels.<span class="fn">append</span>(batch[<span class="str">"labels"</span>].<span class="fn">cpu</span>().<span class="fn">numpy</span>())
    <span class="kw">import</span> numpy <span class="kw">as</span> np
    preds = np.<span class="fn">concatenate</span>(all_preds)
    labels = np.<span class="fn">concatenate</span>(all_labels)
    acc = <span class="fn">accuracy_score</span>(labels, preds)
    f1 = <span class="fn">f1_score</span>(labels, preds, average=<span class="str">"binary"</span>)
    cm = <span class="fn">confusion_matrix</span>(labels, preds)
    <span class="kw">return</span> {<span class="str">"accuracy"</span>: acc, <span class="str">"f1"</span>: f1, <span class="str">"cm"</span>: cm, <span class="str">"preds"</span>: preds, <span class="str">"labels"</span>: labels}

<span class="cm"># 1) Evaluate on validation set after each epoch</span>
val_metrics = <span class="fn">evaluate</span>(model, val_loader)
<span class="fn">print</span>(f<span class="str">"validation: acc={val_metrics['accuracy']:.4f}  f1={val_metrics['f1']:.4f}"</span>)
<span class="fn">print</span>(<span class="str">"confusion matrix:"</span>)
<span class="fn">print</span>(val_metrics[<span class="str">"cm"</span>])
<span class="cm"># [[TN FP]</span>
<span class="cm">#  [FN TP]]</span>

<span class="cm"># 2) Full classification report</span>
<span class="fn">print</span>(<span class="fn">classification_report</span>(val_metrics[<span class="str">"labels"</span>], val_metrics[<span class="str">"preds"</span>],
                            target_names=[<span class="str">"negative"</span>, <span class="str">"positive"</span>]))
<span class="cm"># precision, recall, f1, support per class</span>

<span class="cm"># 3) Final test evaluation (only ONCE at the end)</span>
test_metrics = <span class="fn">evaluate</span>(model, test_loader)
<span class="fn">print</span>(f<span class="str">"TEST: acc={test_metrics['accuracy']:.4f}  f1={test_metrics['f1']:.4f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Evaluation: accuracy, F1, confusion matrix -- the same metrics torch projects use, computed by sklearn.metrics.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix, classification_report

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)
vec = TfidfVectorizer(max_features=2000).fit(X_tr)
clf = LogisticRegression(max_iter=500).fit(vec.transform(X_tr), y_tr)
preds = clf.predict(vec.transform(X_te))

print(f'accuracy : {accuracy_score(y_te, preds):.3f}')
print(f'macro F1 : {f1_score(y_te, preds, average="macro"):.3f}')
print('confusion matrix:\n', confusion_matrix(y_te, preds))
print('classification report:\n', classification_report(y_te, preds, digits=3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>evaluate</code> runs the model in eval + inference_mode + autocast over a loader, accumulates predictions and labels, then computes scalar metrics with sklearn. Returning the confusion matrix and the raw arrays lets you do downstream analysis (e.g. per-class recall, error inspection). 2) Validation evaluation after each epoch is the loop you actually monitor; when val accuracy plateaus or drops, stop. 3) <code>classification_report</code> gives precision, recall, F1 per class plus support counts -- a thesis-quality metric report in one line. 4) Reserve test evaluation for the final, single run after all hyperparameter choices are locked. Repeatedly tuning on test creates leakage and inflated numbers.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: typical IMDB results with this exact recipe</div><div class="example-body">DistilBERT base, max_len=256, batch=16, accum=2, 3 epochs, lr=2e-5, bf16: validation accuracy 92.5-93.2%, test accuracy 92.0-92.8%, F1 about the same. BERT-base under the same recipe gets 93.5-94.2% test, ~1 point higher. RoBERTa-base gets ~95%. Each takes about 15-25 minutes on a single A10/A100. These are the numbers your thesis would report.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Saving and Single-Text Inference</h2>

<p class="l-text">Once the model is trained, the production interface is a single function: text in, label and probability out. We save the model + tokenizer together so loading is one line in the future.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os, json

<span class="cm"># 1) Save model + tokenizer in HuggingFace format (recommended)</span>
SAVE_DIR = <span class="str">"./distilbert-imdb"</span>
os.<span class="fn">makedirs</span>(SAVE_DIR, exist_ok=<span class="kw">True</span>)
model.<span class="fn">save_pretrained</span>(SAVE_DIR)
tokenizer.<span class="fn">save_pretrained</span>(SAVE_DIR)

<span class="cm"># 2) Add training metadata (helpful for reproducibility)</span>
<span class="kw">with</span> <span class="fn">open</span>(os.path.<span class="fn">join</span>(SAVE_DIR, <span class="str">"training_meta.json"</span>), <span class="str">"w"</span>) <span class="kw">as</span> f:
    json.<span class="fn">dump</span>({
        <span class="str">"checkpoint"</span>: CHECKPOINT,
        <span class="str">"max_len"</span>: MAX_LEN,
        <span class="str">"epochs"</span>: EPOCHS,
        <span class="str">"batch_size"</span>: BATCH_SIZE,
        <span class="str">"grad_accum"</span>: GRAD_ACCUM,
        <span class="str">"lr"</span>: <span class="num">2e-5</span>,
        <span class="str">"test_accuracy"</span>: <span class="fn">float</span>(test_metrics[<span class="str">"accuracy"</span>]),
        <span class="str">"test_f1"</span>: <span class="fn">float</span>(test_metrics[<span class="str">"f1"</span>]),
        <span class="str">"torch_version"</span>: torch.__version__,
    }, f, indent=<span class="num">2</span>)

<span class="cm"># 3) Reload from disk -- one line</span>
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForSequenceClassification

tok = AutoTokenizer.<span class="fn">from_pretrained</span>(SAVE_DIR)
mdl = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(SAVE_DIR).<span class="fn">to</span>(device).<span class="fn">eval</span>()

<span class="cm"># 4) The inference function</span>
<span class="at">@torch.inference_mode</span>()
<span class="kw">def</span> <span class="fn">predict</span>(text, model=mdl, tokenizer=tok, max_len=MAX_LEN):
    enc = <span class="fn">tokenizer</span>(text,
                    truncation=<span class="kw">True</span>,
                    max_length=max_len,
                    padding=<span class="str">"max_length"</span>,
                    return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(device)
    <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=amp_dtype, enabled=torch.cuda.<span class="fn">is_available</span>()):
        logits = <span class="fn">model</span>(**enc).logits
    probs = torch.<span class="fn">softmax</span>(logits, dim=-<span class="num">1</span>)[<span class="num">0</span>].<span class="fn">cpu</span>().<span class="fn">tolist</span>()
    pred = <span class="fn">int</span>(torch.<span class="fn">argmax</span>(logits, dim=-<span class="num">1</span>).<span class="fn">item</span>())
    label = model.config.id2label[pred]
    <span class="kw">return</span> {<span class="str">"label"</span>: label, <span class="str">"score"</span>: probs[pred], <span class="str">"probs"</span>: {model.config.id2label[i]: probs[i] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(probs))}}

<span class="cm"># 5) Try it</span>
<span class="fn">print</span>(<span class="fn">predict</span>(<span class="str">"I cannot believe how much I loved this film."</span>))
<span class="cm"># {'label': 'positive', 'score': 0.99..., 'probs': {'negative': 0.00..., 'positive': 0.99...}}</span>

<span class="fn">print</span>(<span class="fn">predict</span>(<span class="str">"A complete waste of two hours; the script was nonsensical."</span>))
<span class="cm"># {'label': 'negative', 'score': 0.99..., 'probs': {'negative': 0.99..., 'positive': 0.00...}}</span>

<span class="cm"># 6) Batch inference for throughput</span>
<span class="at">@torch.inference_mode</span>()
<span class="kw">def</span> <span class="fn">predict_batch</span>(texts, model=mdl, tokenizer=tok, max_len=MAX_LEN, batch_size=<span class="num">32</span>):
    all_results = []
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(texts), batch_size):
        chunk = texts[i:i+batch_size]
        enc = <span class="fn">tokenizer</span>(chunk, truncation=<span class="kw">True</span>, max_length=max_len,
                        padding=<span class="kw">True</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(device)
        <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=amp_dtype, enabled=torch.cuda.<span class="fn">is_available</span>()):
            logits = <span class="fn">model</span>(**enc).logits
        probs = torch.<span class="fn">softmax</span>(logits, dim=-<span class="num">1</span>).<span class="fn">cpu</span>().<span class="fn">tolist</span>()
        <span class="kw">for</span> p <span class="kw">in</span> probs:
            pred = <span class="fn">int</span>(<span class="fn">max</span>(<span class="fn">range</span>(<span class="fn">len</span>(p)), key=<span class="kw">lambda</span> j: p[j]))
            all_results.<span class="fn">append</span>({<span class="str">"label"</span>: model.config.id2label[pred], <span class="str">"score"</span>: p[pred]})
    <span class="kw">return</span> all_results</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Single-text inference: load a saved pipeline and predict on one sentence -- exactly what a deployed sentiment service does.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import io
import joblib
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=1500, ngram_range=(1,2))),
    ('clf', LogisticRegression(max_iter=500)),
])
pipe.fit(df_reviews['review'], df_reviews['label'])

# Save & restore (as a deployed service would)
buf = io.BytesIO()
joblib.dump(pipe, buf); buf.seek(0)
service = joblib.load(buf)

# Single-text inference
samples = ['I absolutely loved this movie',
           'Boring, predictable, would not recommend',
           'It was okay, nothing special']
for s in samples:
    pred  = service.predict([s])[0]
    proba = service.predict_proba([s])[0].max()
    print(f'  [{pred} | conf {proba:.2f}] {s!r}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>model.save_pretrained</code> writes config.json + pytorch_model.bin (or safetensors) to a directory; <code>tokenizer.save_pretrained</code> writes vocab + tokenizer config. Together they are everything you need to reload the model. 2) Optional but recommended: a JSON sidecar with training hyperparameters and final metrics. Future-you (or your collaborators) will thank you. 3) Reloading is a one-liner each: <code>from_pretrained(SAVE_DIR)</code> finds the right files automatically. 4) <code>predict</code> is the production interface: text -&gt; label + score + per-class probabilities. eval mode + inference_mode + autocast for performance; we use the model's <code>id2label</code> for human-readable output. 5) Two example calls show typical positive and negative outputs -- after training, both should yield confident predictions on clearly-polarized text. 6) <code>predict_batch</code> is the same logic over a chunked list. Use this when serving from a batch queue or evaluating on a large corpus -- batch inference is 5-10x faster per sample than single-text predict.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Common Bugs and How to Spot Them</h2>

<p class="l-text">Every NLP fine-tune has the same six bugs waiting to happen. Here is the field guide.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Shape mismatch</div><div class="card-body">"Expected (B, T) got (T,)". Forgot batch dim. Print every shape before the offending forward pass; track which dim is which.</div></div>
<div class="calc-card"><div class="card-title">Device mismatch</div><div class="card-body">"Expected all tensors on cuda:0 but found cpu". Move BOTH the model AND every batch tensor to device. Use <code>{k: v.to(device)}</code> dict comprehension.</div></div>
<div class="calc-card"><div class="card-title">Forgot .eval()</div><div class="card-body">Test accuracy fluctuates run-to-run. Dropout still active. Call <code>model.eval()</code> before evaluation and inference, always.</div></div>
<div class="calc-card"><div class="card-title">Forgot zero_grad</div><div class="card-body">Loss explodes after a few iters. Gradients accumulate forever. Call <code>optimizer.zero_grad()</code> exactly once per real step.</div></div>
<div class="calc-card"><div class="card-title">Wrong loss/metric</div><div class="card-body">Loss decreases but val metric does not move. Probably labels misaligned (off-by-one, wrong column, label_smoothing weirdness).</div></div>
<div class="calc-card"><div class="card-title">Frozen but expected unfrozen</div><div class="card-body">Loss flat from step 1. Check trainable param count. Often <code>requires_grad=False</code> was set somewhere accidentally.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># Diagnostic helper -- call once at training start</span>
<span class="kw">def</span> <span class="fn">diagnose</span>(model, batch, optimizer):
    <span class="fn">print</span>(<span class="str">"=== DIAGNOSTICS ==="</span>)
    <span class="cm"># 1) Device</span>
    p = <span class="fn">next</span>(model.<span class="fn">parameters</span>())
    <span class="fn">print</span>(f<span class="str">"model device: {p.device}"</span>)
    <span class="fn">print</span>(f<span class="str">"batch devices: { {k: v.device for k, v in batch.items()} }"</span>)

    <span class="cm"># 2) Trainable params</span>
    n_train = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>() <span class="kw">if</span> p.requires_grad)
    n_total = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())
    <span class="fn">print</span>(f<span class="str">"trainable: {n_train/1e6:.2f}M / total: {n_total/1e6:.2f}M"</span>)

    <span class="cm"># 3) Forward pass shapes</span>
    out = <span class="fn">model</span>(**batch)
    <span class="fn">print</span>(f<span class="str">"loss: {out.loss.item():.4f} (should NOT be NaN/inf)"</span>)
    <span class="fn">print</span>(f<span class="str">"logits shape: {out.logits.shape}"</span>)
    <span class="fn">print</span>(f<span class="str">"labels shape: {batch['labels'].shape}"</span>)

    <span class="cm"># 4) Backward sanity: do gradients exist?</span>
    out.loss.<span class="fn">backward</span>()
    grads = [p.grad <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>() <span class="kw">if</span> p.grad <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>]
    <span class="kw">if</span> <span class="kw">not</span> grads:
        <span class="fn">print</span>(<span class="str">"ERROR: no gradients computed -- check requires_grad and loss path"</span>)
    <span class="kw">else</span>:
        max_g = <span class="fn">max</span>(g.<span class="fn">abs</span>().<span class="fn">max</span>().<span class="fn">item</span>() <span class="kw">for</span> g <span class="kw">in</span> grads)
        <span class="fn">print</span>(f<span class="str">"max abs grad: {max_g:.4f}"</span>)

    <span class="cm"># 5) Optimizer can step</span>
    optimizer.<span class="fn">zero_grad</span>()
    <span class="fn">print</span>(<span class="str">"OK: ready to train"</span>)

<span class="cm"># Usage at the top of training</span>
<span class="cm"># diagnose(model, next(iter(train_loader)), optimizer)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Common bugs demo: data leakage (fitting vectorizer on full data instead of train), wrong label dtype, mismatched test/train preprocessing.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X = df_reviews['review']; y = df_reviews['label']
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=0)

# BUG: fit vectorizer on the FULL dataset (leaks test info)
vec_bad = TfidfVectorizer(max_features=2000).fit(X)
clf_bad = LogisticRegression(max_iter=500).fit(vec_bad.transform(X_tr), y_tr)
acc_bad = accuracy_score(y_te, clf_bad.predict(vec_bad.transform(X_te)))

# CORRECT: fit only on train
vec_ok = TfidfVectorizer(max_features=2000).fit(X_tr)
clf_ok = LogisticRegression(max_iter=500).fit(vec_ok.transform(X_tr), y_tr)
acc_ok = accuracy_score(y_te, clf_ok.predict(vec_ok.transform(X_te)))

print(f'leaked-fit accuracy : {acc_bad:.3f}  <- looks higher, but is misleading')
print(f'clean-fit  accuracy : {acc_ok:.3f}')
print('always: fit preprocessors on TRAIN only, then transform TEST.')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Prints the device of the model and every batch tensor -- catches device mismatches before they crash an iteration. 2) Counts trainable parameters; this is your sanity check that you have not accidentally frozen the wrong layers. 3) Runs one forward pass and prints loss + shapes; NaN or inf in loss is an immediate red flag (usually division by zero, log of zero, or overflow). 4) Runs backward and checks that gradients exist and their magnitudes are reasonable. No gradients -&gt; your computational graph is broken (e.g. labels not flowing into loss). Huge gradients -&gt; you need clipping or smaller LR. 5) The fast diagnostic you should run at the top of every new training script before kicking off a multi-hour job.</p>

<div class="l-warn"><strong>If your validation loss decreases but accuracy is stuck at 50%:</strong> almost certainly a label / output-dimension mismatch. Print the first batch's labels, the model's <code>num_labels</code>, and the logits shape; they must align (binary task: 2 logits, labels in {0, 1}).</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Best Practices and Beyond</h2>

<p class="l-text">A short distillation of the production hygiene that separates a research script from a deployable system.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Seed everything</div><div class="card-body">Python, NumPy, torch CPU + CUDA, cuDNN deterministic. Document the seed in your results.</div></div>
<div class="calc-card"><div class="card-title">Train/val/test split</div><div class="card-body">Stratified, fixed seed. Never tune on test; reserve it for ONE final run.</div></div>
<div class="calc-card"><div class="card-title">Save tokenizer with model</div><div class="card-body">Mismatched tokenizer = silent garbage predictions. <code>save_pretrained</code> packages both.</div></div>
<div class="calc-card"><div class="card-title">Log hyperparameters</div><div class="card-body">JSON sidecar or W&B/MLflow. Future-you will need to reproduce.</div></div>
<div class="calc-card"><div class="card-title">Per-class metrics</div><div class="card-body">Accuracy hides imbalance. Always report precision/recall/F1 per class + confusion matrix.</div></div>
<div class="calc-card"><div class="card-title">Confidence calibration</div><div class="card-body">Softmax probs are uncalibrated by default; consider temperature scaling for production thresholds.</div></div>
<div class="calc-card"><div class="card-title">Distributed training</div><div class="card-body">For large models, use <code>torch.distributed</code> + <code>DistributedDataParallel</code> or HuggingFace <code>Accelerate</code>; for huge models use FSDP (Fully Sharded Data Parallel).</div></div>
<div class="calc-card"><div class="card-title">Monitor drift</div><div class="card-body">In production, label distribution and input distribution shift. Re-evaluate monthly on a fresh sample.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Sketch: scaling out with HuggingFace Accelerate</span>
<span class="cm"># pip install accelerate</span>
<span class="kw">from</span> accelerate <span class="kw">import</span> Accelerator

accelerator = <span class="fn">Accelerator</span>(mixed_precision=<span class="str">"bf16"</span>)
model, optimizer, train_loader, val_loader, scheduler = accelerator.<span class="fn">prepare</span>(
    model, optimizer, train_loader, val_loader, scheduler
)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(EPOCHS):
    model.<span class="fn">train</span>()
    <span class="kw">for</span> batch <span class="kw">in</span> train_loader:
        <span class="kw">with</span> accelerator.<span class="fn">accumulate</span>(model):
            out = <span class="fn">model</span>(**batch)
            accelerator.<span class="fn">backward</span>(out.loss)
            accelerator.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
            optimizer.<span class="fn">step</span>()
            scheduler.<span class="fn">step</span>()
            optimizer.<span class="fn">zero_grad</span>()

<span class="cm"># Same code runs on 1 GPU, 8 GPUs, multi-node, TPU -- Accelerate hides the difference.</span>

<span class="cm"># For models that do not fit on one GPU (multi-billion params): FSDP</span>
<span class="cm"># from torch.distributed.fsdp import FullyShardedDataParallel as FSDP</span>
<span class="cm"># model = FSDP(model, auto_wrap_policy=...)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Best practices wrap-up: pipeline, cross-validation, stratification, deterministic seeds. The sklearn idiom that mirrors torch best practices.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score

pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=2000, ngram_range=(1, 2))),
    ('clf', LogisticRegression(max_iter=500, C=1.0, random_state=42)),
])
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(pipe, df_reviews['review'], df_reviews['label'], cv=cv)
print('per-fold accuracies :', scores.round(3))
print(f'mean accuracy       : {scores.mean():.3f} +/- {scores.std():.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) HuggingFace Accelerate is a thin wrapper that turns a single-GPU training loop into a multi-GPU/multi-node/TPU loop with no code changes. <code>accelerator.prepare</code> wraps your model, optimizer, dataloaders, and scheduler with the right distributed and AMP machinery. 2) The training loop is almost identical to single-GPU code; the only differences are <code>accelerator.backward</code>, <code>accelerator.clip_grad_norm_</code>, and <code>accelerator.accumulate</code> for gradient accumulation. 3) FSDP shards model parameters across GPUs; each GPU holds a fraction of the model. This is what makes training a 13B-parameter model on 8 A100s feasible.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. The 12-Lesson Map</h2>

<p class="l-text">A quick recap of the journey -- where each lesson plugs into the end-to-end pipeline you just built.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">L1 Tensors</div><div class="card-body">The data structure underneath every line above.</div></div>
<div class="calc-card"><div class="card-title">L2 Autograd</div><div class="card-body">backward(), retain_graph, gradient flow through the encoder.</div></div>
<div class="calc-card"><div class="card-title">L3 nn.Module</div><div class="card-body">DistilBertForSequenceClassification is one big nn.Module.</div></div>
<div class="calc-card"><div class="card-title">L4 Optimizers</div><div class="card-body">AdamW with the bias/LayerNorm exclusion pattern.</div></div>
<div class="calc-card"><div class="card-title">L5 Datasets</div><div class="card-body">HF Dataset + DataLoader + DataCollator.</div></div>
<div class="calc-card"><div class="card-title">L6 Training loop</div><div class="card-body">forward / loss / backward / clip / step / zero_grad.</div></div>
<div class="calc-card"><div class="card-title">L7 Loss functions</div><div class="card-body">CrossEntropyLoss is computed inside the model when labels are passed.</div></div>
<div class="calc-card"><div class="card-title">L8 Embeddings</div><div class="card-body">DistilBERT's word + position embeddings; subword WordPiece.</div></div>
<div class="calc-card"><div class="card-title">L9 Transformers</div><div class="card-body">DistilBERT is six TransformerEncoder layers from scratch.</div></div>
<div class="calc-card"><div class="card-title">L10 Transfer learning</div><div class="card-body">Pretrained checkpoint + 2-class head + small lr; the whole project.</div></div>
<div class="calc-card"><div class="card-title">L11 Production</div><div class="card-body">save/load, eval, inference_mode, autocast, optional ONNX/quantize for serving.</div></div>
<div class="calc-card"><div class="card-title">L12 End-to-end</div><div class="card-body">Stitch all of the above into one runnable script.</div></div>
</div>

<div class="think-box"><div class="think-label">FINAL TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Modern NLP is a recipe: pretrained transformer + tokenizer + small task-specific head + AdamW + linear schedule + grad clip + bf16 + a clean training loop. You now have all the pieces.<br><strong>2.</strong> The biggest production-quality gains come from discipline (seed, split, save, log) more than from model architecture changes.<br><strong>3.</strong> Always start from the smallest pretrained model that meets your accuracy bar; only go bigger if you measure a clear gain.<br><strong>4.</strong> Reproduce > novelty: 95% of NLP fine-tuning is the same recipe you ran here. Pick the right backbone, get the data right, monitor confusion matrix.<br><strong>5.</strong> When in doubt, go back to L11 production tools: save_pretrained, eval, inference_mode, mixed precision, ONNX, dynamic int8.<br><strong>6.</strong> Where to go next: HuggingFace Trainer (turn-key training loop), parameter-efficient fine-tuning (LoRA, QLoRA), retrieval-augmented generation, multi-task fine-tuning, RLHF for instruction-tuned models.<br><strong>7.</strong> The PyTorch+transformers stack you mastered here is the same stack used at OpenAI, Meta, Google, and every NLP startup. The size of the model changes, the recipe does not.<br><strong>8.</strong> Build something. The fastest way to consolidate everything in this 12-lesson sequence is to fine-tune a model on a dataset you actually care about, write a small README, and ship a Gradio demo. Hands beat tutorials every time.</div></div>
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
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:60,r:30,b:80,l:80}};

  function confPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var classes = lang==='tr' ? ['negatif','pozitif'] : ['negative','positive'];
    var z = [
      [11820, 680],   // true negative, false positive
      [820, 11680]    // false negative, true positive
    ];
    var data = [{
      z: z, x: classes, y: classes,
      type: 'heatmap',
      colorscale: [[0,'rgba(40,30,20,0.5)'],[0.5,'rgba(120,100,60,0.85)'],[1,T.accent]],
      showscale: true,
      text: z, texttemplate: '%{text}',
      textfont: {color:'#fff', size:16},
      colorbar: {title: lang==='tr'?'sayım':'count', tickfont:{color:T.text}}
    }];
    var layout = Object.assign({}, common, {
      title: {text: lang==='tr'?'IMDB Test Karışıklık Matrisi (DistilBERT)':'IMDB Test Confusion Matrix (DistilBERT)', font:{color:T.text, size:14}},
      xaxis: {title: lang==='tr'?'tahmin':'predicted', tickfont:{color:T.text}, side:'bottom'},
      yaxis: {title: lang==='tr'?'gerçek':'true', tickfont:{color:T.text}, autorange:'reversed'},
      height: 460
    });
    Plotly.newPlot(id, data, layout, {responsive:true, displayModeBar:false});
  }

  confPlot('plot-pl12-conf-en','en');
  confPlot('plot-pl12-conf-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Ham metinden dağıtılmış bir API'ye.</strong> Bu son ders her şeyi bir araya getirir: tokenizasyon (L8), transformer mimarisi (L9), önceden eğitilmiş ağırlıklar ve ince ayar (L10), çıkarım ve dağıtım (L11) -- ve L1-L7'den veri kümesi, eğitim döngüsü, optimizer, değerlendirme, hata ayıklama ve tekrarlanabilirlik kalıpları. Sonuç: IMDB film yorumları veri kümesinde çalışan bir duygu sınıflandırma projesi, gerçek bir NLP ürününde veya tez ardışık düzeninde kullanacağınız aynı kod kalıplarıyla.</p>

<p class="l-text">Sonunda herhangi bir dizi sınıflandırma görevine uyarlayabileceğiniz uçtan uca bir betiğiniz olacak: metin girer, etiket çıkar; eğitim, değerlendirme, kaydetme, yükleme ve tek metin çıkarım fonksiyonu ile. Bir hata ayıklama kontrol listesi ve sıradaki adımların yol haritasıyla kapatıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>IMDB veri setini (25k/25k) yüklemeyi ve train, validation, test loader'larına bölmeyi</li>
<li>Yorumları HuggingFace tokenizer'ı ile tokenleştirmeyi ve padli bir <code>collate_fn</code> kurmayı</li>
<li><code>distilbert-base-uncased</code>'i 5 satırlık eğitim döngüsüyle duygu üzerinde ince ayarlamayı</li>
<li>Accuracy, precision, recall, F1 değerlendirmeyi ve confusion matrix çizmeyi</li>
<li>Eğitilmiş modeli kaydetmeyi ve tek metinlik bir <code>predict(text) -&gt; label, score</code> fonksiyonu yazmayı</li>
<li>Gerçek başarısızlıklarda hata ayıklama kontrol listesi (loss düşmüyor, eval bug'ı, label sızıntısı) uygulamayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Proje Kurulumu: IMDB Duygu</h2>

<p class="l-text">IMDB kanonik İngilizce duygu benchmark'ıdır: 25k etiketli eğitim yorumu + 25k etiketli test yorumu, pozitif ve negatif arasında 50/50 dengelenmiş. Yorumlar 100-2000 token uzunluğunda, doğal düz yazıyla yazılmış. Onu iyi çözmek yüzeysel sezgisel yöntemler değil, gerçek dil anlayışı gerektirir -- bu yüzden her NLP ders kitabı onu kullanır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install transformers datasets torch accelerate</span>

<span class="kw">import</span> torch
<span class="kw">import</span> random
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset

<span class="cm"># 1) Tekrarlanabilirlik -- TUM seed'leri ayarla</span>
<span class="kw">def</span> <span class="fn">set_seed</span>(seed=<span class="num">42</span>):
    random.<span class="fn">seed</span>(seed)
    np.random.<span class="fn">seed</span>(seed)
    torch.<span class="fn">manual_seed</span>(seed)
    torch.cuda.<span class="fn">manual_seed_all</span>(seed)
    torch.backends.cudnn.deterministic = <span class="kw">True</span>
    torch.backends.cudnn.benchmark = <span class="kw">False</span>

<span class="fn">set_seed</span>(<span class="num">42</span>)

<span class="cm"># 2) HuggingFace datasets ile IMDB yükle</span>
ds = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>)
<span class="fn">print</span>(ds)

<span class="fn">print</span>(ds[<span class="str">"train"</span>][<span class="num">0</span>])

<span class="cm"># 3) Hızlı istatistikler</span>
<span class="fn">print</span>(<span class="str">"eğitim etiketleri:"</span>, np.<span class="fn">bincount</span>(ds[<span class="str">"train"</span>][<span class="str">"label"</span>]))
<span class="fn">print</span>(<span class="str">"test etiketleri:"</span>, np.<span class="fn">bincount</span>(ds[<span class="str">"test"</span>][<span class="str">"label"</span>]))

<span class="cm"># 4) Eğitim/validasyon ayrımı</span>
ds_split = ds[<span class="str">"train"</span>].<span class="fn">train_test_split</span>(test_size=<span class="num">0.1</span>, seed=<span class="num">42</span>, stratify_by_column=<span class="str">"label"</span>)
ds_split[<span class="str">"validation"</span>] = ds_split.<span class="fn">pop</span>(<span class="str">"test"</span>)
ds_split[<span class="str">"test"</span>] = ds[<span class="str">"test"</span>]
<span class="fn">print</span>(ds_split)

<span class="cm"># 5) Cihaz</span>
device = torch.<span class="fn">device</span>(<span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>)
<span class="fn">print</span>(<span class="str">"cihaz:"</span>, device)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Proje kurulumu analoğu: df_reviews'u (Pyodide preamble'da zaten yüklenmiş duygu verisi) IMDB yerine kullan. Sınıf dengesini incele.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

print('df_reviews shape :', df_reviews.shape)
print('columns          :', df_reviews.columns.tolist())
print('label distribution:')
print(df_reviews['label'].value_counts())

# Length statistics
lens = df_reviews['review'].str.split().apply(len)
print(f'review length: mean={lens.mean():.1f}, max={lens.max()}, min={lens.min()}')
print('first 2 reviews:')
for i in range(2):
    row = df_reviews.iloc[i]
    print(f'  [{row["label"]}] {row["review"][:80]}...')</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>set_seed</code> Python random, NumPy, PyTorch CPU ve CUDA RNG'lerini seed eder ve deterministik cuDNN'i açar. Bu, her NLP projesinin diğer her şeyden önce çalıştırması gereken tekrarlanabilirlik ritüelidir. 2) <code>load_dataset("imdb")</code> veri kümesini indirir (ilk çağrıdan sonra yerel olarak önbelleğe alınır) ve eğitim ve test bölmeleri olan bir DatasetDict döner. 3) Hızlı etiket dağılımı kontrolü dengeyi doğrular ve etiket sızıntısını veya kazara dengesizliği yakalamak için her veri kümesinde çalıştırmanız gereken bir akıl sağlığı kontrolüdür. 4) IMDB yalnızca eğitim+test gönderir, bu yüzden eğitimin %10'unu katmanlı bir validasyon kümesi olarak ayırırız. <code>stratify_by_column</code> validasyon bölümünün eğitimle aynı etiket dengesine sahip olmasını sağlar -- önyargısız erken durdurma için kritik. 5) Mevcutsa GPU seçer; BERT'i yanlışlıkla CPU'da eğitmemek için yazdırın.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. HuggingFace ile Tokenizasyon</h2>

<p class="l-text">İnce ayar yapacağımız model kontrol noktasıyla hizalanmış önceden eğitilmiş bir BERT tokenizer kullanın. Tokenizer WordPiece alt kelimelerini, özel token'ları [CLS]/[SEP]/[PAD], kesme ve attention maskelerini ücretsiz halleder.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer

CHECKPOINT = <span class="str">"distilbert-base-uncased"</span>
MAX_LEN = <span class="num">256</span>

tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(CHECKPOINT)

<span class="cm"># 1) Tek bir orneği tokenize et</span>
sample = <span class="str">"This movie was an absolute masterpiece! Brilliant acting and writing."</span>
enc = <span class="fn">tokenizer</span>(sample, truncation=<span class="kw">True</span>, max_length=MAX_LEN, padding=<span class="str">"max_length"</span>, return_tensors=<span class="str">"pt"</span>)
<span class="fn">print</span>(enc.<span class="fn">keys</span>())
<span class="fn">print</span>(enc[<span class="str">"input_ids"</span>].shape)
<span class="fn">print</span>(tokenizer.<span class="fn">decode</span>(enc[<span class="str">"input_ids"</span>][<span class="num">0</span>][:<span class="num">20</span>]))

<span class="cm"># 2) Tum veri kumesini batch tokenize et</span>
<span class="kw">def</span> <span class="fn">tokenize_fn</span>(batch):
    <span class="kw">return</span> <span class="fn">tokenizer</span>(batch[<span class="str">"text"</span>],
                     truncation=<span class="kw">True</span>,
                     max_length=MAX_LEN,
                     padding=<span class="str">"max_length"</span>)

ds_tok = ds_split.<span class="fn">map</span>(tokenize_fn, batched=<span class="kw">True</span>, batch_size=<span class="num">1000</span>)
ds_tok = ds_tok.<span class="fn">remove_columns</span>([<span class="str">"text"</span>])
ds_tok = ds_tok.<span class="fn">rename_column</span>(<span class="str">"label"</span>, <span class="str">"labels"</span>)
ds_tok.<span class="fn">set_format</span>(<span class="str">"torch"</span>, columns=[<span class="str">"input_ids"</span>, <span class="str">"attention_mask"</span>, <span class="str">"labels"</span>])

<span class="cm"># 3) Dogrula</span>
ex = ds_tok[<span class="str">"train"</span>][<span class="num">0</span>]
<span class="fn">print</span>(ex.<span class="fn">keys</span>())
<span class="fn">print</span>(ex[<span class="str">"input_ids"</span>].shape)
<span class="fn">print</span>(ex[<span class="str">"labels"</span>])

<span class="cm"># 4) Token uzunluk dagilimi</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
lengths = [<span class="fn">len</span>(tokenizer.<span class="fn">encode</span>(t, truncation=<span class="kw">False</span>)) <span class="kw">for</span> t <span class="kw">in</span> ds_split[<span class="str">"train"</span>][<span class="str">"text"</span>][:<span class="num">500</span>]]
<span class="fn">print</span>(f<span class="str">"uzunluk: mean={np.mean(lengths):.0f}, median={np.median(lengths):.0f}, p95={np.percentile(lengths,95):.0f}, max={max(lengths)}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tokenizasyon: HuggingFace AutoTokenizer konsepti = sözlük + küçük harf + boşluk ayrımı. sklearn'in CountVectorizer'ı ile tekrarlıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import CountVectorizer

# Build a vocabulary (the HF tokenizer's vocab.txt analog)
vec = CountVectorizer(lowercase=True, max_features=2000)
vec.fit(df_reviews['review'])
vocab = vec.vocabulary_
print(f'vocab size      : {len(vocab)}')
print(f'sample tokens   : {list(vocab)[:8]}')

# 'Tokenize' a sentence -> list of ids
sample = "This movie was absolutely amazing"
tokens = sample.lower().split()
ids = [vocab.get(t, -1) for t in tokens]
print(f'sentence : {sample!r}')
print(f'tokens   : {tokens}')
print(f'ids      : {ids}    (-1 = unknown)')</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Bir örneği <code>padding="max_length"</code> ve <code>truncation=True</code> ile tokenize eder -- çıktı girdi uzunluğundan bağımsız olarak tam <code>(1, 256)</code>'dır. Çözülmüş sürüm BERT'in özel token'larını [CLS] (cümle başlangıcı) ve [SEP] (cümle sonu) gösterir, sonra [PAD] token'lar geri kalanı doldurur. 2) <code>ds.map(..., batched=True)</code> tüm veri kümesini 1000'lik batch'lerde tokenize eder -- bir Dataset.__getitem__ içinde tek seferde tokenize etmekten çok daha hızlı. "label"ı "labels"a yeniden adlandırırız çünkü HuggingFace modelleri böyle bekler. <code>set_format("torch")</code> Dataset'in doğrudan PyTorch tensor'ları döndürmesini sağlar. 3) Sonuçta akıl sağlığı kontrolü: her örnek artık üç torch tensor'lu bir sözlüktür. 4) Token uzunluk dağılımını incelemek <code>max_len</code>'i seçmenize yardımcı olur. IMDB yorumları çok uzun olabilir; 256 bir bellek/doğruluk uzlaşmasıdır. Tez kalitesinde sonuçlar için 512'yi daha küçük batch ile deneyin.</p>

<div class="l-note"><strong>max_len seçimi:</strong> çok küçük ise sinyali kesersiniz (özellikle uzun yorumlarda); çok büyük ise bellek + gecikme dördüncül olarak patlar. Standart tarif: verinizi profilleyin, uzunluk dağılımının p90-p95'inde max_len'i seçin, en uzun kuyruğun kesileceğini kabul edin.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Özel Dataset ve DataLoader</h2>

<p class="l-text">HuggingFace datasets <code>set_format("torch")</code> sayesinde PyTorch DataLoader ile doğrudan çalışır. Batch'leme ve karıştırma için yalnızca bir DataLoader'a ihtiyacımız var.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader

BATCH_SIZE = <span class="num">16</span>

train_loader = <span class="fn">DataLoader</span>(ds_tok[<span class="str">"train"</span>], batch_size=BATCH_SIZE, shuffle=<span class="kw">True</span>, num_workers=<span class="num">2</span>, pin_memory=<span class="kw">True</span>)
val_loader = <span class="fn">DataLoader</span>(ds_tok[<span class="str">"validation"</span>], batch_size=BATCH_SIZE * <span class="num">2</span>, shuffle=<span class="kw">False</span>, num_workers=<span class="num">2</span>, pin_memory=<span class="kw">True</span>)
test_loader = <span class="fn">DataLoader</span>(ds_tok[<span class="str">"test"</span>], batch_size=BATCH_SIZE * <span class="num">2</span>, shuffle=<span class="kw">False</span>, num_workers=<span class="num">2</span>, pin_memory=<span class="kw">True</span>)

<span class="cm"># 1) Bir batch incele</span>
batch = <span class="fn">next</span>(<span class="fn">iter</span>(train_loader))
<span class="fn">print</span>(batch.<span class="fn">keys</span>())
<span class="fn">print</span>(batch[<span class="str">"input_ids"</span>].shape)
<span class="fn">print</span>(batch[<span class="str">"attention_mask"</span>].shape)
<span class="fn">print</span>(batch[<span class="str">"labels"</span>].shape)

<span class="cm"># 2) Degisken uzunluklu batch'ler icin: dinamik padding</span>
<span class="kw">from</span> transformers <span class="kw">import</span> DataCollatorWithPadding
collator = <span class="fn">DataCollatorWithPadding</span>(tokenizer, padding=<span class="kw">True</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Özel Dataset + DataLoader -- (metin, etiket) tupleları döndüren bir Python sınıfı, generator ile batchlenmiş.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>class TextDataset:
    def __init__(self, df):
        self.texts  = df['review'].tolist()
        self.labels = df['label'].tolist()
    def __len__(self):  return len(self.texts)
    def __getitem__(self, i): return (self.texts[i], int(self.labels[i]))

def loader(ds, bs=8):
    n = len(ds)
    for s in range(0, n, bs):
        batch = [ds[i] for i in range(s, min(s+bs, n))]
        texts  = [b[0] for b in batch]
        labels = [b[1] for b in batch]
        yield texts, labels

ds = TextDataset(df_reviews.head(20))
batches = list(loader(ds, bs=8))
print(f'batches: {len(batches)}, sizes: {[len(b[0]) for b in batches]}')
print('batch 0 labels:', batches[0][1])
print('batch 0 text 0 (truncated):', batches[0][0][0][:60], '...')</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Üç DataLoader inşa eder. Eğitim her epoch karıştırır; validasyon ve test karıştırmaz. Gradyana ihtiyacımız olmadığı için değerlendirme için daha büyük batch kullanırız. <code>num_workers=2</code> paralel veri yükleme için 2 işçi süreci başlatır; <code>pin_memory=True</code> CPU-GPU transferini hızlandırır. 2) Bir batch'i inceler: girdiler için şekil <code>(B, T) = (16, 256)</code> ve etiketler için <code>(B,)</code>. 3) Alternatif kalıbı belirtir: padding olmadan tokenize edin ve bir <code>DataCollatorWithPadding</code>'in her batch'i en uzun dizisine dinamik olarak doldurmasına izin verin. Bu, dizilerin uzunlukta çok değiştiği durumlarda daha hızlıdır ama biraz daha fazla koddur.</p>

<div class="l-warn"><strong>Windows'ta num_workers tuzağı:</strong> Windows'ta <code>num_workers &gt; 0</code> eğitim betiğinin <code>if __name__ == "__main__":</code> içine sarılmasını gerektirir, aksi halde sonsuz özyineleme alırsınız. Linux/Mac'te doğrudan çalışır.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Model: BERT + Sınıflandırma Başı</h2>

<p class="l-text">DistilBERT BERT'in katmanlarının yarısına (12 yerine 6) damıtılmış halidir; parametrelerin %60'ı, doğruluğun %95'i. Duygu ince ayarı için harika bir varsayılandır -- eğitmesi hızlı, dağıtması hızlı, iyi doğruluk.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForSequenceClassification

NUM_LABELS = <span class="num">2</span>

model = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(
    CHECKPOINT,
    num_labels=NUM_LABELS,
    id2label={<span class="num">0</span>: <span class="str">"negative"</span>, <span class="num">1</span>: <span class="str">"positive"</span>},
    label2id={<span class="str">"negative"</span>: <span class="num">0</span>, <span class="str">"positive"</span>: <span class="num">1</span>},
).<span class="fn">to</span>(device)

<span class="cm"># 1) Parametre sayıları</span>
total = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())
trainable = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>() <span class="kw">if</span> p.requires_grad)
<span class="fn">print</span>(f<span class="str">"toplam: {total/1e6:.2f}M, eğitilebilir: {trainable/1e6:.2f}M"</span>)

<span class="cm"># 2) Forward sağlık kontrolü</span>
batch = {k: v.<span class="fn">to</span>(device) <span class="kw">for</span> k, v <span class="kw">in</span> batch.<span class="fn">items</span>()}
out = <span class="fn">model</span>(**batch)
<span class="fn">print</span>(out.loss, out.logits.shape)

<span class="cm"># 3) Etiketler olmadan sadece logitler</span>
out = <span class="fn">model</span>(input_ids=batch[<span class="str">"input_ids"</span>], attention_mask=batch[<span class="str">"attention_mask"</span>])
<span class="fn">print</span>(out.logits.shape)
<span class="fn">print</span>(out.loss)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">BERT + sınıflandırma başı konsepti: özellik çıkarıcı -> dense katman -> softmax. Eşdeğer iki aşamalı sklearn modelini kuruyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Stage 1: tokenize + featurize (= BERT contextual encoder)
vec = TfidfVectorizer(max_features=1500, ngram_range=(1, 2))
X = vec.fit_transform(df_reviews['review'])

# Stage 2: classification head
clf = LogisticRegression(max_iter=500, C=1.0)
clf.fit(X, df_reviews['label'])

print('feature dim (= BERT hidden size analog):', X.shape[1])
print('head shape   :', clf.coef_.shape, '(classes, features)')
print('head bias    :', clf.intercept_.round(3))
sample_pred = clf.predict(vec.transform(['I really enjoyed this',
                                         'It was the worst film ever']))
print('sample preds :', sample_pred)</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Yeni bir 2 sınıflı sınıflandırma başı ile DistilBERT yükler. <code>id2label</code> ve <code>label2id</code> geçiriyoruz, böylece kaydedilmiş model insan tarafından okunabilir etiket adlarını taşır -- çıkarım zamanında aramanız gereken bir şey daha az. 2) Parametre sayıları her şeyin eğitilebilir olduğunu doğrular (tam ince ayar). DistilBERT-base 66M parametredir, BERT-base'in yaklaşık %60'ı. 3) Bir batch üzerinde forward geçiş <code>loss</code> (etiketler geçirildiği için) ve şekli <code>(B, 2)</code> olan <code>logits</code> ile bir SequenceClassifierOutput döner. Kayıp model tarafından logit ve etiketlere uygulanan çapraz entropidir -- onu manuel olarak hesaplamaya gerek yok. 4) Etiketler olmadan yalnızca logit alırsınız; çıkarım zamanında kullanışlı.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Karışık Hassasiyetli Eğitim Döngüsü</h2>

<p class="l-text">Tam bir eğitim döngüsü: katman bazlı ağırlık azalması (bias / LayerNorm üzerinde decay yok), lineer warmup-azalma LR programı, gradyan kırpma, karışık hassasiyet (bf16), küçük GPU'larda daha büyük etkili batch için gradyan birikimi ve loglama.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torch.optim <span class="kw">import</span> AdamW
<span class="kw">from</span> transformers <span class="kw">import</span> get_linear_schedule_with_warmup

<span class="cm"># 1) Param grupları</span>
no_decay = [<span class="str">"bias"</span>, <span class="str">"LayerNorm.weight"</span>]
grouped = [
    {<span class="str">"params"</span>: [p <span class="kw">for</span> n,p <span class="kw">in</span> model.<span class="fn">named_parameters</span>() <span class="kw">if</span> <span class="kw">not</span> <span class="fn">any</span>(nd <span class="kw">in</span> n <span class="kw">for</span> nd <span class="kw">in</span> no_decay)],
     <span class="str">"weight_decay"</span>: <span class="num">0.01</span>},
    {<span class="str">"params"</span>: [p <span class="kw">for</span> n,p <span class="kw">in</span> model.<span class="fn">named_parameters</span>() <span class="kw">if</span> <span class="fn">any</span>(nd <span class="kw">in</span> n <span class="kw">for</span> nd <span class="kw">in</span> no_decay)],
     <span class="str">"weight_decay"</span>: <span class="num">0.0</span>},
]
optimizer = <span class="fn">AdamW</span>(grouped, lr=<span class="num">2e-5</span>)

<span class="cm"># 2) LR programı</span>
EPOCHS = <span class="num">3</span>
GRAD_ACCUM = <span class="num">2</span>
total_steps = (<span class="fn">len</span>(train_loader) // GRAD_ACCUM) * EPOCHS
scheduler = <span class="fn">get_linear_schedule_with_warmup</span>(optimizer,
    num_warmup_steps=<span class="fn">int</span>(<span class="num">0.1</span> * total_steps),
    num_training_steps=total_steps)

<span class="cm"># 3) Karışık hassasiyet</span>
use_bf16 = torch.cuda.<span class="fn">is_available</span>() <span class="kw">and</span> torch.cuda.<span class="fn">is_bf16_supported</span>()
amp_dtype = torch.bfloat16 <span class="kw">if</span> use_bf16 <span class="kw">else</span> torch.float16
scaler = <span class="kw">None</span> <span class="kw">if</span> use_bf16 <span class="kw">else</span> torch.cuda.amp.<span class="fn">GradScaler</span>()

<span class="kw">def</span> <span class="fn">train_one_epoch</span>(model, loader, optimizer, scheduler, scaler, accum=GRAD_ACCUM):
    model.<span class="fn">train</span>()
    running_loss = <span class="num">0.0</span>
    optimizer.<span class="fn">zero_grad</span>()
    <span class="kw">for</span> step, batch <span class="kw">in</span> <span class="fn">enumerate</span>(loader):
        batch = {k: v.<span class="fn">to</span>(device, non_blocking=<span class="kw">True</span>) <span class="kw">for</span> k, v <span class="kw">in</span> batch.<span class="fn">items</span>()}

        <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=amp_dtype, enabled=torch.cuda.<span class="fn">is_available</span>()):
            out = <span class="fn">model</span>(**batch)
            loss = out.loss / accum

        <span class="kw">if</span> scaler <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
            scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()
        <span class="kw">else</span>:
            loss.<span class="fn">backward</span>()

        <span class="kw">if</span> (step + <span class="num">1</span>) % accum == <span class="num">0</span>:
            <span class="kw">if</span> scaler <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
                scaler.<span class="fn">unscale_</span>(optimizer)
            torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
            <span class="kw">if</span> scaler <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
                scaler.<span class="fn">step</span>(optimizer)
                scaler.<span class="fn">update</span>()
            <span class="kw">else</span>:
                optimizer.<span class="fn">step</span>()
            scheduler.<span class="fn">step</span>()
            optimizer.<span class="fn">zero_grad</span>()

        running_loss += loss.<span class="fn">item</span>() * accum
        <span class="kw">if</span> step % <span class="num">50</span> == <span class="num">0</span>:
            <span class="fn">print</span>(f<span class="str">"  adım {step}: loss={loss.item()*accum:.4f}, lr={scheduler.get_last_lr()[0]:.2e}"</span>)
    <span class="kw">return</span> running_loss / <span class="fn">len</span>(loader)

<span class="cm"># 4) Eğitimi çalıştır</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(EPOCHS):
    <span class="fn">print</span>(f<span class="str">"=== epoch {epoch+1}/{EPOCHS} ==="</span>)
    train_loss = <span class="fn">train_one_epoch</span>(model, train_loader, optimizer, scheduler, scaler)
    <span class="fn">print</span>(f<span class="str">"  eğitim loss: {train_loss:.4f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Eğitim döngüsü: eğitim verisinde fit et ve epoch'lar boyunca kayıp/doğruluk takip et (SGDClassifier + partial_fit ile, torch'un epoch döngüsü gibi).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, log_loss

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.2, random_state=0
)
vec = TfidfVectorizer(max_features=1000).fit(X_tr)
Xt_tr = vec.transform(X_tr); Xt_te = vec.transform(X_te)

clf = SGDClassifier(loss='log_loss', random_state=0)
classes = np.unique(y_tr)

for epoch in range(8):
    clf.partial_fit(Xt_tr, y_tr, classes=classes)
    proba = clf.predict_proba(Xt_te)
    loss = log_loss(y_te, proba, labels=classes)
    acc  = accuracy_score(y_te, clf.predict(Xt_te))
    print(f'epoch {epoch+1:2d}  val_loss={loss:.4f}  val_acc={acc:.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Parametreleri iki AdamW grubuna böler: bias ve LayerNorm.weight weight decay'i atlar (kritik bir detay -- bunları azaltmak BERT performansını düşürür), diğer her şey <code>weight_decay=0.01</code> alır. 2) Veri kümesi boyutu, birikim adımları ve epoch'lara dayanarak toplam optimizer adımlarını hesaplar, sonra lineer warmup-sonra-azalma programı kurar. 3) bf16 desteğini otomatik algılar; eski GPU'larda GradScaler ile fp16'ya geri döner. 4) Eğitim döngüsü: fp16/bf16 hesaplama için autocast içinde forward, loss'u birikim faktörüne böl (böylece biriken batch'ler üzerinden ortalama alırız), backward, her <code>accum</code> adımda gradyan kırpma ve sıfırlama ile bir optimizer adımı uygula. Scheduler mikro batch başına değil, gerçek optimizer adımı başına bir kez ilerler. 5) Dış döngü epoch'lar üzerinde döner; <code>train_one_epoch</code> loglama için ortalama kayıp döner. IMDB üzerinde 3 epoch ile DistilBERT'te tipik olarak %92-93 validasyon doğruluğuna ulaşırsınız.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gradyan birikimi</div><div class="card-body">Adım atmadan önce N mikro batch üzerinde gradyanları ortalayarak daha büyük batch simüle et. Aynı istatistik, aynı bellek.</div></div>
<div class="calc-card"><div class="card-title">Grad kırpma</div><div class="card-body">Grad normunu 1.0'da kapat. Nadir büyük güncellemelerin eğitimi destabilize etmesini önler.</div></div>
<div class="calc-card"><div class="card-title">bf16 vs fp16</div><div class="card-body">bf16 fp32 aralığa sahiptir, GradScaler yok. A100/H100'de varsayılan. fp16 GradScaler gerektirir.</div></div>
<div class="calc-card"><div class="card-title">non_blocking=True</div><div class="card-body">Asenkron CPU-GPU transferi. ~%10 throughput için pin_memory=True ile eşleşir.</div></div>
<div class="calc-card"><div class="card-title">.zero_grad()</div><div class="card-body">Backward'dan ÖNCE her zaman çağırın (veya adımdan sonra), aksi halde gradyanlar sonsuza dek birikir.</div></div>
<div class="calc-card"><div class="card-title">scheduler adımı</div><div class="card-body">Birikirken mikro batch başına değil, OPTİMİZER adımı başına bir kez.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Değerlendirme: Doğruluk, F1, Karışıklık Matrisi</h2>

<div id="plot-pl12-conf-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Buradaki resim:</strong> IMDB test kümesinde eğitilmiş DistilBERT duygu modelimiz için 2x2 karışıklık matrisi. Diyagonal hücreler doğru tahminler; diyagonal dışı hücreler hatalardır. Her iki sınıf da benzer doğruluk gösterir; "negatif olarak yanlış sınıflandırılmış pozitif"ten biraz daha fazla "pozitif olarak yanlış sınıflandırılmış negatif" var -- yorumlar alaycılık veya karışık duygu kullandığında yaygın bir kalıp. <strong>NLP için neden önemli:</strong> tek bir doğruluk sayısı dengesiz hataları gizleyebilir. Bir karışıklık matrisi hangi sınıfın zor olduğunu, hangi karışıklık yönünün hâkim olduğunu ve modelin sistematik bir önyargısı olup olmadığını anında gösterir. Tez kalitesi iş için skaler metriklerin yanında her zaman karışıklık matrisini raporlayın.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, f1_score, confusion_matrix, classification_report

<span class="at">@torch.inference_mode</span>()
<span class="kw">def</span> <span class="fn">evaluate</span>(model, loader):
    model.<span class="fn">eval</span>()
    all_preds, all_labels = [], []
    <span class="kw">for</span> batch <span class="kw">in</span> loader:
        batch = {k: v.<span class="fn">to</span>(device, non_blocking=<span class="kw">True</span>) <span class="kw">for</span> k, v <span class="kw">in</span> batch.<span class="fn">items</span>()}
        <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=amp_dtype, enabled=torch.cuda.<span class="fn">is_available</span>()):
            logits = <span class="fn">model</span>(input_ids=batch[<span class="str">"input_ids"</span>],
                           attention_mask=batch[<span class="str">"attention_mask"</span>]).logits
        preds = logits.<span class="fn">argmax</span>(dim=-<span class="num">1</span>).<span class="fn">cpu</span>().<span class="fn">numpy</span>()
        all_preds.<span class="fn">append</span>(preds)
        all_labels.<span class="fn">append</span>(batch[<span class="str">"labels"</span>].<span class="fn">cpu</span>().<span class="fn">numpy</span>())
    <span class="kw">import</span> numpy <span class="kw">as</span> np
    preds = np.<span class="fn">concatenate</span>(all_preds)
    labels = np.<span class="fn">concatenate</span>(all_labels)
    acc = <span class="fn">accuracy_score</span>(labels, preds)
    f1 = <span class="fn">f1_score</span>(labels, preds, average=<span class="str">"binary"</span>)
    cm = <span class="fn">confusion_matrix</span>(labels, preds)
    <span class="kw">return</span> {<span class="str">"accuracy"</span>: acc, <span class="str">"f1"</span>: f1, <span class="str">"cm"</span>: cm, <span class="str">"preds"</span>: preds, <span class="str">"labels"</span>: labels}

<span class="cm"># 1) Her epoch sonrası validasyon</span>
val_metrics = <span class="fn">evaluate</span>(model, val_loader)
<span class="fn">print</span>(f<span class="str">"validasyon: acc={val_metrics['accuracy']:.4f}  f1={val_metrics['f1']:.4f}"</span>)
<span class="fn">print</span>(<span class="str">"karışıklık matrisi:"</span>)
<span class="fn">print</span>(val_metrics[<span class="str">"cm"</span>])

<span class="cm"># 2) Tam sınıflandırma raporu</span>
<span class="fn">print</span>(<span class="fn">classification_report</span>(val_metrics[<span class="str">"labels"</span>], val_metrics[<span class="str">"preds"</span>],
                            target_names=[<span class="str">"negative"</span>, <span class="str">"positive"</span>]))

<span class="cm"># 3) Son test (yalnızca BİR kez sonunda)</span>
test_metrics = <span class="fn">evaluate</span>(model, test_loader)
<span class="fn">print</span>(f<span class="str">"TEST: acc={test_metrics['accuracy']:.4f}  f1={test_metrics['f1']:.4f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Değerlendirme: doğruluk, F1, karışıklık matrisi -- torch projelerinin kullandığı aynı metrikler, sklearn.metrics ile hesaplanıyor.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix, classification_report

X_tr, X_te, y_tr, y_te = train_test_split(
    df_reviews['review'], df_reviews['label'], test_size=0.25, random_state=0
)
vec = TfidfVectorizer(max_features=2000).fit(X_tr)
clf = LogisticRegression(max_iter=500).fit(vec.transform(X_tr), y_tr)
preds = clf.predict(vec.transform(X_te))

print(f'accuracy : {accuracy_score(y_te, preds):.3f}')
print(f'macro F1 : {f1_score(y_te, preds, average="macro"):.3f}')
print('confusion matrix:\n', confusion_matrix(y_te, preds))
print('classification report:\n', classification_report(y_te, preds, digits=3))</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>evaluate</code> modeli eval + inference_mode + autocast içinde bir loader üzerinde çalıştırır, tahminleri ve etiketleri biriktirir, sonra sklearn ile skaler metrikler hesaplar. Karışıklık matrisini ve ham dizileri döndürmek aşağı akış analizi yapmanıza olanak tanır (örn. sınıf başına recall, hata incelemesi). 2) Her epoch sonrası validasyon değerlendirmesi gerçekten izlediğiniz döngüdür; val doğruluğu plato yaptığında veya düştüğünde durdurun. 3) <code>classification_report</code> sınıf başına precision, recall, F1 artı destek sayılarını verir -- tek satırda tez kalitesi metrik raporu. 4) Tüm hiperparametre seçimleri kilitlendikten sonra son, tek çalıştırma için test değerlendirmesini saklayın. Tekrar tekrar test üzerinde tuning yapmak sızıntı ve şişirilmiş sayılar yaratır.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: bu tarifte tipik IMDB sonuçları</div><div class="example-body">DistilBERT base, max_len=256, batch=16, accum=2, 3 epoch, lr=2e-5, bf16: validasyon doğruluğu %92.5-93.2, test doğruluğu %92.0-92.8, F1 yaklaşık aynı. Aynı tarif altında BERT-base %93.5-94.2 test alır, ~1 puan daha yüksek. RoBERTa-base ~%95 alır. Her biri tek bir A10/A100'de yaklaşık 15-25 dakika sürer. Bunlar tezinizin raporlayacağı sayılardır.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Kaydetme ve Tek Metin Çıkarımı</h2>

<p class="l-text">Model eğitildikten sonra üretim arayüzü tek bir fonksiyondur: metin girer, etiket ve olasılık çıkar. Modeli + tokenizer'ı birlikte kaydederiz, böylece gelecekte yükleme tek satırdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os, json

<span class="cm"># 1) Model + tokenizer kaydet</span>
SAVE_DIR = <span class="str">"./distilbert-imdb"</span>
os.<span class="fn">makedirs</span>(SAVE_DIR, exist_ok=<span class="kw">True</span>)
model.<span class="fn">save_pretrained</span>(SAVE_DIR)
tokenizer.<span class="fn">save_pretrained</span>(SAVE_DIR)

<span class="cm"># 2) Eğitim metadatası ekle</span>
<span class="kw">with</span> <span class="fn">open</span>(os.path.<span class="fn">join</span>(SAVE_DIR, <span class="str">"training_meta.json"</span>), <span class="str">"w"</span>) <span class="kw">as</span> f:
    json.<span class="fn">dump</span>({
        <span class="str">"checkpoint"</span>: CHECKPOINT,
        <span class="str">"max_len"</span>: MAX_LEN,
        <span class="str">"epochs"</span>: EPOCHS,
        <span class="str">"batch_size"</span>: BATCH_SIZE,
        <span class="str">"grad_accum"</span>: GRAD_ACCUM,
        <span class="str">"lr"</span>: <span class="num">2e-5</span>,
        <span class="str">"test_accuracy"</span>: <span class="fn">float</span>(test_metrics[<span class="str">"accuracy"</span>]),
        <span class="str">"test_f1"</span>: <span class="fn">float</span>(test_metrics[<span class="str">"f1"</span>]),
        <span class="str">"torch_version"</span>: torch.__version__,
    }, f, indent=<span class="num">2</span>)

<span class="cm"># 3) Diskten yeniden yükle</span>
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForSequenceClassification

tok = AutoTokenizer.<span class="fn">from_pretrained</span>(SAVE_DIR)
mdl = AutoModelForSequenceClassification.<span class="fn">from_pretrained</span>(SAVE_DIR).<span class="fn">to</span>(device).<span class="fn">eval</span>()

<span class="cm"># 4) Çıkarım fonksiyonu</span>
<span class="at">@torch.inference_mode</span>()
<span class="kw">def</span> <span class="fn">predict</span>(text, model=mdl, tokenizer=tok, max_len=MAX_LEN):
    enc = <span class="fn">tokenizer</span>(text,
                    truncation=<span class="kw">True</span>,
                    max_length=max_len,
                    padding=<span class="str">"max_length"</span>,
                    return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(device)
    <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=amp_dtype, enabled=torch.cuda.<span class="fn">is_available</span>()):
        logits = <span class="fn">model</span>(**enc).logits
    probs = torch.<span class="fn">softmax</span>(logits, dim=-<span class="num">1</span>)[<span class="num">0</span>].<span class="fn">cpu</span>().<span class="fn">tolist</span>()
    pred = <span class="fn">int</span>(torch.<span class="fn">argmax</span>(logits, dim=-<span class="num">1</span>).<span class="fn">item</span>())
    label = model.config.id2label[pred]
    <span class="kw">return</span> {<span class="str">"label"</span>: label, <span class="str">"score"</span>: probs[pred], <span class="str">"probs"</span>: {model.config.id2label[i]: probs[i] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(probs))}}

<span class="cm"># 5) Dene</span>
<span class="fn">print</span>(<span class="fn">predict</span>(<span class="str">"I cannot believe how much I loved this film."</span>))
<span class="fn">print</span>(<span class="fn">predict</span>(<span class="str">"A complete waste of two hours; the script was nonsensical."</span>))

<span class="cm"># 6) Throughput için batch çıkarım</span>
<span class="at">@torch.inference_mode</span>()
<span class="kw">def</span> <span class="fn">predict_batch</span>(texts, model=mdl, tokenizer=tok, max_len=MAX_LEN, batch_size=<span class="num">32</span>):
    all_results = []
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(texts), batch_size):
        chunk = texts[i:i+batch_size]
        enc = <span class="fn">tokenizer</span>(chunk, truncation=<span class="kw">True</span>, max_length=max_len,
                        padding=<span class="kw">True</span>, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(device)
        <span class="kw">with</span> torch.cuda.amp.<span class="fn">autocast</span>(dtype=amp_dtype, enabled=torch.cuda.<span class="fn">is_available</span>()):
            logits = <span class="fn">model</span>(**enc).logits
        probs = torch.<span class="fn">softmax</span>(logits, dim=-<span class="num">1</span>).<span class="fn">cpu</span>().<span class="fn">tolist</span>()
        <span class="kw">for</span> p <span class="kw">in</span> probs:
            pred = <span class="fn">int</span>(<span class="fn">max</span>(<span class="fn">range</span>(<span class="fn">len</span>(p)), key=<span class="kw">lambda</span> j: p[j]))
            all_results.<span class="fn">append</span>({<span class="str">"label"</span>: model.config.id2label[pred], <span class="str">"score"</span>: p[pred]})
    <span class="kw">return</span> all_results</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tek metin çıkarımı: kayıtlı bir pipeline yükle ve tek cümlede tahmin et -- dağıtılmış bir duygu servisinin yaptığı aynısı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import io
import joblib
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=1500, ngram_range=(1,2))),
    ('clf', LogisticRegression(max_iter=500)),
])
pipe.fit(df_reviews['review'], df_reviews['label'])

# Save & restore (as a deployed service would)
buf = io.BytesIO()
joblib.dump(pipe, buf); buf.seek(0)
service = joblib.load(buf)

# Single-text inference
samples = ['I absolutely loved this movie',
           'Boring, predictable, would not recommend',
           'It was okay, nothing special']
for s in samples:
    pred  = service.predict([s])[0]
    proba = service.predict_proba([s])[0].max()
    print(f'  [{pred} | conf {proba:.2f}] {s!r}')</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>model.save_pretrained</code> bir dizine config.json + pytorch_model.bin (veya safetensors) yazar; <code>tokenizer.save_pretrained</code> vocab + tokenizer config'i yazar. Birlikte modeli yeniden yüklemek için ihtiyacınız olan her şeydir. 2) İsteğe bağlı ama önerilen: eğitim hiperparametreleri ve son metriklerle JSON sidecar. Gelecekteki siz (veya işbirlikçileriniz) size teşekkür edecek. 3) Yeniden yükleme her biri tek satır: <code>from_pretrained(SAVE_DIR)</code> doğru dosyaları otomatik bulur. 4) <code>predict</code> üretim arayüzüdür: metin -&gt; etiket + skor + sınıf başına olasılıklar. Performans için eval modu + inference_mode + autocast; insan tarafından okunabilir çıktı için modelin <code>id2label</code>'ini kullanırız. 5) İki örnek çağrı tipik pozitif ve negatif çıktıları gösterir -- eğitimden sonra her ikisi de açıkça kutuplaşmış metinde güvenli tahminler vermelidir. 6) <code>predict_batch</code> aynı mantığı parçalanmış bir liste üzerinde uygular. Bir batch kuyruğundan sunum yaparken veya büyük bir corpus'ta değerlendirme yaparken bunu kullanın -- batch çıkarımı tek metin predict'ten örnek başına 5-10x daha hızlıdır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Yaygın Hatalar ve Onları Nasıl Tespit Edersiniz</h2>

<p class="l-text">Her NLP ince ayarının olmaya hazır aynı altı hatası vardır. İşte saha rehberi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Şekil uyumsuzluğu</div><div class="card-body">"Beklenen (B, T), alındı (T,)". Batch boyutu unutuldu. Sorun çıkaran forward'tan önce her şekli yazdırın; hangi boyutun hangisi olduğunu izleyin.</div></div>
<div class="calc-card"><div class="card-title">Cihaz uyumsuzluğu</div><div class="card-body">"cuda:0'da bekleniyor ama cpu bulundu". HEM modeli HEM her batch tensor'ını cihaza taşıyın. <code>{k: v.to(device)}</code> dict comprehension kullanın.</div></div>
<div class="calc-card"><div class="card-title">.eval() unutuldu</div><div class="card-body">Test doğruluğu çalıştırma arası dalgalanır. Dropout hâlâ aktif. Değerlendirme ve çıkarımdan önce her zaman <code>model.eval()</code>'i çağırın.</div></div>
<div class="calc-card"><div class="card-title">zero_grad unutuldu</div><div class="card-body">Birkaç iter sonra loss patlar. Gradyanlar sonsuza dek birikir. Gerçek adım başına tam olarak bir kez <code>optimizer.zero_grad()</code> çağırın.</div></div>
<div class="calc-card"><div class="card-title">Yanlış kayıp/metrik</div><div class="card-body">Loss düşer ama val metrik hareket etmez. Muhtemelen etiketler yanlış hizalanmış (bir-yanlış, yanlış sütun, label_smoothing tuhaflığı).</div></div>
<div class="calc-card"><div class="card-title">Donmuş ama çözülmüş bekleniyor</div><div class="card-body">Adım 1'den loss düz. Eğitilebilir param sayısını kontrol edin. Sıklıkla bir yerde yanlışlıkla <code>requires_grad=False</code> ayarlanmıştır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># Tanı yardımcısı -- eğitim başında bir kez çağır</span>
<span class="kw">def</span> <span class="fn">diagnose</span>(model, batch, optimizer):
    <span class="fn">print</span>(<span class="str">"=== TANI ==="</span>)
    p = <span class="fn">next</span>(model.<span class="fn">parameters</span>())
    <span class="fn">print</span>(f<span class="str">"model cihazı: {p.device}"</span>)
    <span class="fn">print</span>(f<span class="str">"batch cihazları: { {k: v.device for k, v in batch.items()} }"</span>)

    n_train = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>() <span class="kw">if</span> p.requires_grad)
    n_total = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())
    <span class="fn">print</span>(f<span class="str">"eğitilebilir: {n_train/1e6:.2f}M / toplam: {n_total/1e6:.2f}M"</span>)

    out = <span class="fn">model</span>(**batch)
    <span class="fn">print</span>(f<span class="str">"loss: {out.loss.item():.4f} (NaN/inf OLMAMALI)"</span>)
    <span class="fn">print</span>(f<span class="str">"logits şekli: {out.logits.shape}"</span>)
    <span class="fn">print</span>(f<span class="str">"labels şekli: {batch['labels'].shape}"</span>)

    out.loss.<span class="fn">backward</span>()
    grads = [p.grad <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>() <span class="kw">if</span> p.grad <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>]
    <span class="kw">if</span> <span class="kw">not</span> grads:
        <span class="fn">print</span>(<span class="str">"HATA: gradyan hesaplanmadı -- requires_grad ve loss yolunu kontrol et"</span>)
    <span class="kw">else</span>:
        max_g = <span class="fn">max</span>(g.<span class="fn">abs</span>().<span class="fn">max</span>().<span class="fn">item</span>() <span class="kw">for</span> g <span class="kw">in</span> grads)
        <span class="fn">print</span>(f<span class="str">"maks mutlak grad: {max_g:.4f}"</span>)

    optimizer.<span class="fn">zero_grad</span>()
    <span class="fn">print</span>(<span class="str">"OK: eğitime hazır"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Yaygın hatalar demo: veri sızıntısı (vectorizer'ı train yerine tüm veride fit etmek), yanlış etiket dtype'ı, eşleşmeyen test/train ön işleme.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X = df_reviews['review']; y = df_reviews['label']
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=0)

# BUG: fit vectorizer on the FULL dataset (leaks test info)
vec_bad = TfidfVectorizer(max_features=2000).fit(X)
clf_bad = LogisticRegression(max_iter=500).fit(vec_bad.transform(X_tr), y_tr)
acc_bad = accuracy_score(y_te, clf_bad.predict(vec_bad.transform(X_te)))

# CORRECT: fit only on train
vec_ok = TfidfVectorizer(max_features=2000).fit(X_tr)
clf_ok = LogisticRegression(max_iter=500).fit(vec_ok.transform(X_tr), y_tr)
acc_ok = accuracy_score(y_te, clf_ok.predict(vec_ok.transform(X_te)))

print(f'leaked-fit accuracy : {acc_bad:.3f}  <- looks higher, but is misleading')
print(f'clean-fit  accuracy : {acc_ok:.3f}')
print('always: fit preprocessors on TRAIN only, then transform TEST.')</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Modelin ve her batch tensor'ının cihazını yazdırır -- bir iterasyonu çökertmeden önce cihaz uyumsuzluklarını yakalar. 2) Eğitilebilir parametreleri sayar; bu yanlış katmanları yanlışlıkla dondurmadığınızın akıl sağlığı kontrolüdür. 3) Bir forward geçiş çalıştırır ve loss + şekilleri yazdırır; loss'ta NaN veya inf anında bir kırmızı bayraktır (genellikle sıfıra bölme, sıfırın logu veya taşma). 4) Backward çalıştırır ve gradyanların var olduğunu ve büyüklüklerinin makul olduğunu kontrol eder. Gradyan yok -&gt; hesaplama grafiniz bozuktur (örn. etiketler kayıba akmıyor). Devasa gradyanlar -&gt; kırpma veya daha küçük LR'ye ihtiyacınız var. 5) Çok saatlik bir işi başlatmadan önce her yeni eğitim betiğinin başında çalıştırmanız gereken hızlı tanı.</p>

<div class="l-warn"><strong>Validasyon kaybınız azalıyor ama doğruluk %50'de takılı kaldıysa:</strong> neredeyse kesinlikle bir etiket / çıktı boyutu uyumsuzluğu. İlk batch'in etiketlerini, modelin <code>num_labels</code>'ini ve logit şeklini yazdırın; hizalanmaları gerekir (ikili görev: 2 logit, etiketler {0, 1}'de).</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. En İyi Uygulamalar ve Ötesi</h2>

<p class="l-text">Bir araştırma betiğini dağıtılabilir bir sistemden ayıran üretim hijyeninin kısa bir özeti.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Her şeyi seed'le</div><div class="card-body">Python, NumPy, torch CPU + CUDA, cuDNN deterministik. Sonuçlarınızda seed'i belgeleyin.</div></div>
<div class="calc-card"><div class="card-title">Eğitim/val/test ayrımı</div><div class="card-body">Katmanlı, sabit seed. Asla test üzerinde tune etmeyin; onu BİR son çalıştırma için saklayın.</div></div>
<div class="calc-card"><div class="card-title">Tokenizer'ı modelle kaydet</div><div class="card-body">Eşleşmeyen tokenizer = sessiz çöp tahminler. <code>save_pretrained</code> ikisini de paketler.</div></div>
<div class="calc-card"><div class="card-title">Hiperparametreleri logla</div><div class="card-body">JSON sidecar veya W&B/MLflow. Gelecekteki siz tekrarlamaya ihtiyaç duyacak.</div></div>
<div class="calc-card"><div class="card-title">Sınıf başına metrik</div><div class="card-body">Doğruluk dengesizliği gizler. Her zaman sınıf başına precision/recall/F1 + karışıklık matrisi raporlayın.</div></div>
<div class="calc-card"><div class="card-title">Güven kalibrasyonu</div><div class="card-body">Softmax olasılıkları varsayılan olarak kalibre edilmemiştir; üretim eşikleri için sıcaklık ölçeklendirmesi düşünün.</div></div>
<div class="calc-card"><div class="card-title">Dağıtık eğitim</div><div class="card-body">Büyük modeller için <code>torch.distributed</code> + <code>DistributedDataParallel</code> veya HuggingFace <code>Accelerate</code>; çok büyük modeller için FSDP (Fully Sharded Data Parallel) kullanın.</div></div>
<div class="calc-card"><div class="card-title">Drift'i izle</div><div class="card-body">Üretimde etiket dağılımı ve girdi dağılımı kayar. Aylık olarak yeni bir örnekte yeniden değerlendirin.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Taslak: HuggingFace Accelerate ile ölçekleme</span>
<span class="cm"># pip install accelerate</span>
<span class="kw">from</span> accelerate <span class="kw">import</span> Accelerator

accelerator = <span class="fn">Accelerator</span>(mixed_precision=<span class="str">"bf16"</span>)
model, optimizer, train_loader, val_loader, scheduler = accelerator.<span class="fn">prepare</span>(
    model, optimizer, train_loader, val_loader, scheduler
)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(EPOCHS):
    model.<span class="fn">train</span>()
    <span class="kw">for</span> batch <span class="kw">in</span> train_loader:
        <span class="kw">with</span> accelerator.<span class="fn">accumulate</span>(model):
            out = <span class="fn">model</span>(**batch)
            accelerator.<span class="fn">backward</span>(out.loss)
            accelerator.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
            optimizer.<span class="fn">step</span>()
            scheduler.<span class="fn">step</span>()
            optimizer.<span class="fn">zero_grad</span>()

<span class="cm"># Ayni kod 1 GPU, 8 GPU, multi-node, TPU uzerinde calisir.</span>

<span class="cm"># Tek GPU'ya sigmayan modeller icin: FSDP</span>
<span class="cm"># from torch.distributed.fsdp import FullyShardedDataParallel as FSDP</span>
<span class="cm"># model = FSDP(model, auto_wrap_policy=...)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">En iyi uygulamalar toparlanma: pipeline, çapraz doğrulama, stratifikasyon, deterministik seed'ler. torch en iyi uygulamalarına paralel sklearn deyimi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score

pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=2000, ngram_range=(1, 2))),
    ('clf', LogisticRegression(max_iter=500, C=1.0, random_state=42)),
])
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(pipe, df_reviews['review'], df_reviews['label'], cv=cv)
print('per-fold accuracies :', scores.round(3))
print(f'mean accuracy       : {scores.mean():.3f} +/- {scores.std():.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) HuggingFace Accelerate, tek GPU eğitim döngüsünü kod değişikliği olmadan çoklu GPU/çoklu düğüm/TPU döngüsüne çeviren ince bir sarıcıdır. <code>accelerator.prepare</code> modelinizi, optimizer'ınızı, dataloader'ları ve scheduler'ı doğru dağıtık ve AMP makineleriyle sarar. 2) Eğitim döngüsü tek GPU koduna neredeyse aynıdır; tek farklar gradyan birikimi için <code>accelerator.backward</code>, <code>accelerator.clip_grad_norm_</code> ve <code>accelerator.accumulate</code>'tir. 3) FSDP model parametrelerini GPU'lar arasında parçalar; her GPU modelin bir parçasını tutar. 13B parametreli bir modeli 8 A100'de eğitmeyi mümkün kılan budur.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. 12 Ders Haritası</h2>

<p class="l-text">Yolculuğun hızlı bir özeti -- her dersin az önce inşa ettiğiniz uçtan uca ardışık düzene nereden bağlandığı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">L1 Tensor'lar</div><div class="card-body">Yukarıdaki her satırın altındaki veri yapısı.</div></div>
<div class="calc-card"><div class="card-title">L2 Autograd</div><div class="card-body">backward(), retain_graph, encoder boyunca gradyan akışı.</div></div>
<div class="calc-card"><div class="card-title">L3 nn.Module</div><div class="card-body">DistilBertForSequenceClassification tek büyük bir nn.Module'dür.</div></div>
<div class="calc-card"><div class="card-title">L4 Optimizer'lar</div><div class="card-body">bias/LayerNorm hariç tutma kalıbı ile AdamW.</div></div>
<div class="calc-card"><div class="card-title">L5 Dataset'ler</div><div class="card-body">HF Dataset + DataLoader + DataCollator.</div></div>
<div class="calc-card"><div class="card-title">L6 Eğitim döngüsü</div><div class="card-body">forward / loss / backward / clip / step / zero_grad.</div></div>
<div class="calc-card"><div class="card-title">L7 Kayıp fonksiyonları</div><div class="card-body">CrossEntropyLoss etiketler geçirildiğinde modelin içinde hesaplanır.</div></div>
<div class="calc-card"><div class="card-title">L8 Embedding'ler</div><div class="card-body">DistilBERT'in kelime + pozisyon embedding'leri; alt kelime WordPiece.</div></div>
<div class="calc-card"><div class="card-title">L9 Transformer'lar</div><div class="card-body">DistilBERT sıfırdan altı TransformerEncoder katmanıdır.</div></div>
<div class="calc-card"><div class="card-title">L10 Transfer öğrenme</div><div class="card-body">Önceden eğitilmiş kontrol noktası + 2 sınıflı baş + küçük lr; tüm proje.</div></div>
<div class="calc-card"><div class="card-title">L11 Üretim</div><div class="card-body">save/load, eval, inference_mode, autocast, sunum için isteğe bağlı ONNX/quantize.</div></div>
<div class="calc-card"><div class="card-title">L12 Uçtan uca</div><div class="card-body">Yukarıdakilerin tümünü tek çalıştırılabilir betiğe dik.</div></div>
</div>

<div class="think-box"><div class="think-label">SON ANA NOKTALAR</div><div class="think-body"><strong>1.</strong> Modern NLP bir tariftir: önceden eğitilmiş transformer + tokenizer + küçük göreve özgü baş + AdamW + lineer program + grad kırpma + bf16 + temiz bir eğitim döngüsü. Artık tüm parçalara sahipsiniz.<br><strong>2.</strong> En büyük üretim kalitesi kazançları model mimari değişikliklerinden çok disiplinden (seed, ayır, kaydet, logla) gelir.<br><strong>3.</strong> Her zaman doğruluk barınızı karşılayan en küçük önceden eğitilmiş modelden başlayın; yalnızca açık bir kazanç ölçtüğünüzde daha büyüğe gidin.<br><strong>4.</strong> Yeniden üretmek > yenilik: NLP ince ayarının %95'i burada çalıştırdığınızla aynı tariftir. Doğru omurgayı seçin, veriyi doğru yapın, karışıklık matrisini izleyin.<br><strong>5.</strong> Şüphelendiğinizde L11 üretim araçlarına geri dönün: save_pretrained, eval, inference_mode, karışık hassasiyet, ONNX, dinamik int8.<br><strong>6.</strong> Sıradaki adımlar: HuggingFace Trainer (anahtar teslim eğitim döngüsü), parametre verimli ince ayar (LoRA, QLoRA), retrieval-augmented generation, çok görevli ince ayar, talimat-tunelenmiş modeller için RLHF.<br><strong>7.</strong> Burada ustalaştığınız PyTorch+transformers yığını, OpenAI, Meta, Google ve her NLP startup'ında kullanılan aynı yığındır. Modelin boyutu değişir, tarif değişmez.<br><strong>8.</strong> Bir şey inşa edin. Bu 12 derslik dizideki her şeyi pekiştirmenin en hızlı yolu, gerçekten umursadığınız bir veri kümesinde bir modeli ince ayar yapmak, küçük bir README yazmak ve bir Gradio demosu göndermektir. Eller her zaman tutorial'ları yener.</div></div>
</div>`

};
