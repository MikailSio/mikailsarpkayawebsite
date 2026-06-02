window.PYTORCH_L4 = {

en: `<p class="l-text"><strong>Models do not train themselves -- you have to feed them data, batch by batch, fast enough to keep the GPU busy.</strong> PyTorch's data pipeline is built around two abstractions: <code>Dataset</code>, which knows how to retrieve a single sample, and <code>DataLoader</code>, which wraps a Dataset to produce batches in parallel with shuffling, padding, and prefetching. Master these and your training script becomes clean, fast, and easy to debug.</p>

<p class="l-text">This lesson teaches you to build a custom Dataset for NLP text data, wrap it in a DataLoader, write a smart <code>collate_fn</code> that pads variable-length sequences, and avoid the common bugs that silently slow your training loop. We will end with a complete data pipeline you can drop into any classifier.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Build a custom <code>Dataset</code> for NLP text by implementing <code>__len__</code> and <code>__getitem__</code></li>
<li>Wrap it in a <code>DataLoader</code> with batching, shuffling, and parallel <code>num_workers</code></li>
<li>Write a <code>collate_fn</code> that pads variable-length token sequences to the batch max</li>
<li>Use <code>pin_memory=True</code> and <code>prefetch_factor</code> to keep the GPU saturated</li>
<li>Build a reproducible split with <code>random_split</code> and a fixed <code>torch.Generator</code> seed</li>
<li>Diagnose silent slowdowns: workers spawning, IO bottlenecks, oversized batches</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why a Data Pipeline?</h2>

<p class="l-text">In a toy script you might write <code>for x in data:</code>. In a real one you need: shuffling per epoch, batching with consistent shapes, padding for variable-length sequences, parallel CPU workers reading data while the GPU trains, and reproducibility through random seeds. The PyTorch data API gives all of this in a small, composable interface.</p>

<div class="calc-highlight"><strong>The key idea:</strong> separate "what is one sample?" from "how do we batch them?". <code>Dataset</code> answers the first; <code>DataLoader</code> answers the second. Decoupling lets you reuse loaders across datasets and swap datasets without rewriting your loop.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dataset</div><div class="card-body">Defines <code>__len__</code> and <code>__getitem__</code>. Knows how to fetch sample i. Does NOT know about batches.</div></div>
<div class="calc-card"><div class="card-title">DataLoader</div><div class="card-body">Wraps a Dataset. Yields batches. Handles shuffling, batching, parallelism, prefetching.</div></div>
<div class="calc-card"><div class="card-title">collate_fn</div><div class="card-body">Function that turns a list of samples into a batched tensor. Default works for fixed shapes; you write a custom one for variable-length data.</div></div>
<div class="calc-card"><div class="card-title">Sampler</div><div class="card-body">Determines the order indices are drawn in. Default: SequentialSampler in order, RandomSampler when shuffle=True.</div></div>
<div class="calc-card"><div class="card-title">num_workers</div><div class="card-body">How many CPU subprocesses prefetch data. 0 = main thread only (slow but easy to debug); 4-8 typical.</div></div>
<div class="calc-card"><div class="card-title">pin_memory</div><div class="card-body">Pre-allocates page-locked CPU memory for faster GPU transfer. Set <code>True</code> when training on GPU.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: a HuggingFace data pipeline</div><div class="example-body">When you fine-tune BERT, the steps are: (1) load IMDb / SST-2 / your CSV with HF datasets, (2) tokenize each sample to token IDs, (3) wrap in a torch <code>Dataset</code>, (4) wrap in a <code>DataLoader</code> with <code>collate_fn</code> that pads to the max length per batch. The <code>Trainer</code> class hides this, but understanding what it does under the hood is essential when training breaks.</div></div>

<div class="think-box"><div class="think-label">WHY NOT JUST A LOOP OVER A NUMPY ARRAY?</div><div class="think-body">Two reasons: (1) Real datasets do not fit in memory -- a Dataset can stream from disk, fetching each sample on demand, while a NumPy array forces full preload. (2) The GPU is idle while the CPU loads data; <code>DataLoader</code> with multiple workers overlaps these so the GPU never waits. On large datasets the difference is 2-5x in total training time.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Writing a Custom Dataset</h2>

<p class="l-text">A <code>Dataset</code> is just a Python class that defines two methods: <code>__len__</code> (how many samples) and <code>__getitem__</code> (return the i-th sample as a tuple of tensors). The framework calls these for you.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset

<span class="kw">class</span> <span class="fn">TextSentimentDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, texts, labels, vocab, max_len=<span class="num">64</span>):
        <span class="kw">assert</span> <span class="fn">len</span>(texts) == <span class="fn">len</span>(labels)
        self.texts = texts
        self.labels = labels
        self.vocab = vocab            <span class="cm"># dict: word -&gt; int id</span>
        self.unk = vocab[<span class="str">"&lt;unk&gt;"</span>]
        self.pad = vocab[<span class="str">"&lt;pad&gt;"</span>]
        self.max_len = max_len

    <span class="kw">def</span> <span class="fn">__len__</span>(self):
        <span class="kw">return</span> <span class="fn">len</span>(self.texts)

    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, idx):
        text = self.texts[idx].<span class="fn">lower</span>().<span class="fn">split</span>()
        ids = [self.vocab.<span class="fn">get</span>(w, self.unk) <span class="kw">for</span> w <span class="kw">in</span> text][: self.max_len]
        <span class="cm"># NOT padded here -- collate_fn handles padding per batch</span>
        <span class="kw">return</span> {
            <span class="str">"input_ids"</span>: torch.<span class="fn">tensor</span>(ids, dtype=torch.long),
            <span class="str">"label"</span>:     torch.<span class="fn">tensor</span>(self.labels[idx], dtype=torch.long),
            <span class="str">"length"</span>:    <span class="fn">len</span>(ids),
        }

<span class="cm"># Toy data</span>
texts = [
    <span class="str">"this movie was amazing"</span>,
    <span class="str">"absolutely terrible film, hated it"</span>,
    <span class="str">"great cast and a wonderful story"</span>,
    <span class="str">"boring and predictable"</span>,
    <span class="str">"loved every minute of it"</span>,
]
labels = [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>]
vocab = {<span class="str">"&lt;pad&gt;"</span>:<span class="num">0</span>, <span class="str">"&lt;unk&gt;"</span>:<span class="num">1</span>, <span class="str">"this"</span>:<span class="num">2</span>, <span class="str">"movie"</span>:<span class="num">3</span>, <span class="str">"was"</span>:<span class="num">4</span>, <span class="str">"amazing"</span>:<span class="num">5</span>,
         <span class="str">"absolutely"</span>:<span class="num">6</span>, <span class="str">"terrible"</span>:<span class="num">7</span>, <span class="str">"film"</span>:<span class="num">8</span>, <span class="str">"hated"</span>:<span class="num">9</span>, <span class="str">"it"</span>:<span class="num">10</span>,
         <span class="str">"great"</span>:<span class="num">11</span>, <span class="str">"cast"</span>:<span class="num">12</span>, <span class="str">"and"</span>:<span class="num">13</span>, <span class="str">"a"</span>:<span class="num">14</span>, <span class="str">"wonderful"</span>:<span class="num">15</span>, <span class="str">"story"</span>:<span class="num">16</span>,
         <span class="str">"boring"</span>:<span class="num">17</span>, <span class="str">"predictable"</span>:<span class="num">18</span>, <span class="str">"loved"</span>:<span class="num">19</span>, <span class="str">"every"</span>:<span class="num">20</span>, <span class="str">"minute"</span>:<span class="num">21</span>, <span class="str">"of"</span>:<span class="num">22</span>}

ds = <span class="fn">TextSentimentDataset</span>(texts, labels, vocab, max_len=<span class="num">12</span>)
<span class="fn">print</span>(<span class="fn">len</span>(ds))            <span class="cm"># 5</span>
<span class="fn">print</span>(ds[<span class="num">0</span>])              <span class="cm"># {'input_ids': tensor([2,3,4,5]), 'label': tensor(1), 'length': 4}</span>
<span class="fn">print</span>(ds[<span class="num">1</span>])              <span class="cm"># different length!</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A custom Dataset is essentially a Python class with __len__ and __getitem__. We replicate it on top of a pandas DataFrame -- exactly the abstraction torch wraps.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

class ReviewDataset:
    def __init__(self, df):
        self.texts  = df['review'].tolist()
        self.labels = df['label'].values
    def __len__(self):
        return len(self.texts)
    def __getitem__(self, idx):
        return {'text': self.texts[idx], 'label': int(self.labels[idx])}

ds = ReviewDataset(df_reviews)
print('dataset size:', len(ds))
print('item 0:', ds[0])
print('item 5:', {k: (v[:60] + '...' if isinstance(v, str) and len(v) > 60 else v) for k, v in ds[5].items()})</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Subclasses <code>Dataset</code> and accepts texts, labels, and a vocabulary mapping in <code>__init__</code>. We store everything as plain lists; <code>__getitem__</code> will tokenize on demand. 2) <code>__len__</code> returns the dataset size; <code>DataLoader</code> uses this to know when an epoch ends. 3) <code>__getitem__</code> takes an integer index and returns one sample. We tokenize by splitting on whitespace, looking up each word in the vocab (falling back to <code>&lt;unk&gt;</code>), and clipping at <code>max_len</code>. 4) Crucially, we do NOT pad here -- different samples have different lengths and we want the DataLoader's collate function to pad each batch to the longest sample in that batch (saves compute vs padding all to global max). 5) Returns a dict, which is the modern PyTorch convention (matches HuggingFace) -- you can also return a tuple, but dicts are more readable for many fields. 6) The toy run prints two samples of different lengths to demonstrate the variable-length nature of NLP data.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">__init__</div><div class="card-body">Store data and metadata. Avoid heavy work here unless dataset is small enough to fit in RAM.</div></div>
<div class="calc-card"><div class="card-title">__len__</div><div class="card-body">Return total sample count. Required by DataLoader for epoch boundaries.</div></div>
<div class="calc-card"><div class="card-title">__getitem__(idx)</div><div class="card-body">Return ONE sample. Convert raw data to tensors here. Avoid Python-level work in the hot path.</div></div>
<div class="calc-card"><div class="card-title">Returns dict or tuple</div><div class="card-body">Dict for self-documenting batches; tuple for tightest integration with simple training loops.</div></div>
</div>

<div class="l-note"><strong>Stream vs in-memory:</strong> If your dataset is small (&lt; few GB) and frequently accessed, store it in memory in <code>__init__</code>. If it is huge (TB-scale), open files lazily in <code>__getitem__</code>. The <code>IterableDataset</code> subclass exists for streaming data where <code>__len__</code> is unknown -- use it for log streams and Kafka topics.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. DataLoader Basics</h2>

<p class="l-text"><code>DataLoader</code> wraps a Dataset and yields batches. Most arguments are knobs you turn for performance and reproducibility. The default <code>collate_fn</code> works only when every sample has the same shape -- which is almost never true for NLP.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader, Dataset

<span class="cm"># A trivial fixed-shape dataset works with default collate</span>
<span class="kw">class</span> <span class="fn">FixedDS</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, n=<span class="num">20</span>):
        self.n = n
    <span class="kw">def</span> <span class="fn">__len__</span>(self):
        <span class="kw">return</span> self.n
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i):
        x = torch.<span class="fn">full</span>((<span class="num">4</span>,), <span class="fn">float</span>(i))     <span class="cm"># shape (4,)</span>
        y = torch.<span class="fn">tensor</span>(i % <span class="num">2</span>)
        <span class="kw">return</span> x, y

ds = <span class="fn">FixedDS</span>(<span class="num">20</span>)

<span class="cm"># DataLoader: shuffle each epoch, batch_size=4</span>
loader = <span class="fn">DataLoader</span>(ds, batch_size=<span class="num">4</span>, shuffle=<span class="kw">True</span>)

<span class="kw">for</span> batch_idx, (x, y) <span class="kw">in</span> <span class="fn">enumerate</span>(loader):
    <span class="fn">print</span>(batch_idx, x.shape, y.shape)
    <span class="kw">if</span> batch_idx == <span class="num">1</span>: <span class="kw">break</span>
<span class="cm"># 0 torch.Size([4, 4]) torch.Size([4])</span>
<span class="cm"># 1 torch.Size([4, 4]) torch.Size([4])</span>

<span class="cm"># Common arguments</span>
loader = <span class="fn">DataLoader</span>(
    ds,
    batch_size=<span class="num">8</span>,
    shuffle=<span class="kw">True</span>,
    num_workers=<span class="num">2</span>,            <span class="cm"># CPU subprocesses for prefetching</span>
    pin_memory=<span class="kw">True</span>,          <span class="cm"># faster CPU -&gt; GPU transfer</span>
    drop_last=<span class="kw">False</span>,          <span class="cm"># keep last partial batch</span>
    persistent_workers=<span class="kw">True</span>,  <span class="cm"># keep workers alive between epochs</span>
)

<span class="cm"># Iterating multiple epochs</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2</span>):
    <span class="kw">for</span> x, y <span class="kw">in</span> loader:
        <span class="cm"># train_step(x, y)</span>
        <span class="kw">pass</span>
    <span class="fn">print</span>(f<span class="str">"epoch {epoch} done"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">DataLoader = batch iterator. We can iterate a dataset 32 rows at a time with a generator -- the pure-Python core of what torch.utils.data.DataLoader does.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def batch_iter(df, batch_size=32, shuffle=True, seed=0):
    n = len(df)
    idx = np.arange(n)
    if shuffle:
        np.random.default_rng(seed).shuffle(idx)
    for start in range(0, n, batch_size):
        sel = idx[start:start + batch_size]
        yield df.iloc[sel].reset_index(drop=True)

n_batches = 0
total = 0
for batch in batch_iter(df_reviews, batch_size=64):
    n_batches += 1
    total += len(batch)
    if n_batches <= 2:
        print(f'batch {n_batches}: rows {len(batch)}, label balance {batch["label"].mean():.2f}')
print(f'total batches: {n_batches}, total rows: {total}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a trivial fixed-shape dataset where every sample is a 4-vector and a scalar label. The default collate stacks tensors along a new batch dim, working perfectly here because shapes match. 2) Wraps it in a <code>DataLoader</code> with <code>batch_size=4</code> and <code>shuffle=True</code>; iterating yields tuples of stacked tensors. 3) The full argument list shows the production knobs: <code>num_workers</code> launches subprocesses that prefetch data while the GPU trains; <code>pin_memory</code> uses page-locked memory for faster <code>.cuda()</code> transfers; <code>drop_last</code> skips the final partial batch (use it if your model needs constant batch size); <code>persistent_workers</code> keeps the worker subprocesses alive between epochs to avoid the 1-2 second startup overhead. 4) The standard nested loop -- outer over epochs, inner over batches -- is the skeleton of every PyTorch training script.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">batch_size</div><div class="card-body">How many samples per batch. Bigger = smoother gradients, more memory. 32-256 typical for transformers.</div></div>
<div class="calc-card"><div class="card-title">shuffle=True</div><div class="card-body">Randomizes order each epoch. Always True for training, False for validation.</div></div>
<div class="calc-card"><div class="card-title">num_workers</div><div class="card-body">CPU prefetching parallelism. Start with 4; benchmark to find your sweet spot. 0 for debugging.</div></div>
<div class="calc-card"><div class="card-title">pin_memory=True</div><div class="card-body">Speeds up CPU -&gt; GPU transfer. Set True if you train on GPU. No effect on CPU-only.</div></div>
<div class="calc-card"><div class="card-title">drop_last</div><div class="card-body">Drop the final partial batch. Use True if BatchNorm or your code requires constant batch size.</div></div>
<div class="calc-card"><div class="card-title">collate_fn</div><div class="card-body">How to stack samples into a batch. Default works for fixed shapes; pass custom for variable lengths.</div></div>
</div>

<div class="l-warn"><strong>Pitfall (workers and Windows):</strong> On Windows, <code>num_workers &gt; 0</code> requires your training script to be guarded by <code>if __name__ == "__main__":</code>. Otherwise the spawn method re-imports your module and recursively launches subprocesses. On Linux/Mac with fork, this is not required but still good practice.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. collate_fn for Variable-Length Sequences</h2>

<p class="l-text">NLP samples have different lengths. The default collate cannot stack tensors of different shapes -- it raises an error. You write a <code>collate_fn</code> that takes a list of samples and returns a batched dict, padding to the longest sequence in the current batch.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.nn.utils.rnn <span class="kw">import</span> pad_sequence
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader

<span class="kw">def</span> <span class="fn">collate_nlp</span>(batch, pad_id=<span class="num">0</span>):
    <span class="cm"># batch is a list of dicts from __getitem__</span>
    input_ids = [b[<span class="str">"input_ids"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch]
    labels    = torch.<span class="fn">stack</span>([b[<span class="str">"label"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch])
    lengths   = torch.<span class="fn">tensor</span>([b[<span class="str">"length"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch])

    <span class="cm"># Pad to the longest sequence in THIS batch</span>
    padded = <span class="fn">pad_sequence</span>(input_ids, batch_first=<span class="kw">True</span>, padding_value=pad_id)
    <span class="cm"># padded shape: (B, T_max_in_batch)</span>

    attention_mask = (padded != pad_id).<span class="fn">long</span>()

    <span class="kw">return</span> {
        <span class="str">"input_ids"</span>: padded,
        <span class="str">"attention_mask"</span>: attention_mask,
        <span class="str">"labels"</span>: labels,
        <span class="str">"lengths"</span>: lengths,
    }

<span class="cm"># Reuse the TextSentimentDataset from section 2</span>
<span class="cm"># loader = DataLoader(ds, batch_size=2, shuffle=True, collate_fn=collate_nlp)</span>
<span class="cm"># for batch in loader:</span>
<span class="cm">#     print(batch["input_ids"].shape)        # e.g. (2, 6)</span>
<span class="cm">#     print(batch["attention_mask"].shape)   # (2, 6)</span>
<span class="cm">#     print(batch["labels"])                 # tensor([0, 1])</span>

<span class="cm"># Manual demo of pad_sequence</span>
seqs = [torch.<span class="fn">tensor</span>([<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>]),
        torch.<span class="fn">tensor</span>([<span class="num">6</span>, <span class="num">7</span>, <span class="num">8</span>]),
        torch.<span class="fn">tensor</span>([<span class="num">9</span>, <span class="num">10</span>])]
padded = <span class="fn">pad_sequence</span>(seqs, batch_first=<span class="kw">True</span>, padding_value=<span class="num">0</span>)
<span class="fn">print</span>(padded)
<span class="cm"># tensor([[2, 3, 4, 5],</span>
<span class="cm">#         [6, 7, 8, 0],</span>
<span class="cm">#         [9, 10, 0, 0]])</span>
mask = (padded != <span class="num">0</span>).<span class="fn">long</span>()
<span class="fn">print</span>(mask)
<span class="cm"># tensor([[1, 1, 1, 1],</span>
<span class="cm">#         [1, 1, 1, 0],</span>
<span class="cm">#         [1, 1, 0, 0]])</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">collate_fn handles variable-length sequences by padding. We tokenize and pad sentences with NumPy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

texts = ['I loved the movie',
         'meh, it was okay',
         'absolutely terrible and boring',
         'great']

# Build vocab
vocab = {'<pad>': 0}
for t in texts:
    for w in t.lower().split():
        vocab.setdefault(w, len(vocab))

# Tokenize
ids = [[vocab[w] for w in t.lower().split()] for t in texts]
lens = [len(i) for i in ids]
max_len = max(lens)

# Pad with 0 (the <pad> id)
padded = np.zeros((len(ids), max_len), dtype=np.int64)
for r, seq in enumerate(ids):
    padded[r, :len(seq)] = seq

print('vocab size :', len(vocab))
print('lengths    :', lens)
print('padded ids :\n', padded)
print('attention mask:\n', (padded != 0).astype(int))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines <code>collate_nlp</code>, a function that receives a list of sample dicts (each from <code>__getitem__</code>) and returns one batched dict. 2) Extracts the variable-length token ID lists into a Python list, the labels and lengths into stacked tensors. 3) Calls <code>pad_sequence</code> from PyTorch, which pads every sequence in the list to the longest one with the specified padding value, returning a 2D tensor of shape <code>(B, T_max)</code>. <code>batch_first=True</code> gives the more readable <code>(B, T)</code> layout instead of <code>(T, B)</code>. 4) Builds an <code>attention_mask</code> of 1s for real tokens and 0s for padding -- this is exactly what every transformer uses to ignore padding during attention. 5) Returns a dict with everything the model needs. 6) The manual demo shows three sequences of length 4, 3, 2 padded to length 4 with a corresponding mask -- the canonical NLP batch construction.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: dynamic batching for efficiency</div><div class="example-body">If your dataset has wildly varying lengths (1 word to 500 words), batching at the sample level wastes compute on padding. The trick: bucket samples by length so each batch has similar lengths, drastically reducing padding. PyTorch has <code>BatchSampler</code> for this; HuggingFace's <code>DataCollatorWithPadding</code> implements bucketed batching. For long sequences this can speed up training by 2-3x.</div></div>

<div class="l-note"><strong>HuggingFace integration:</strong> When you use HF's <code>DataCollatorWithPadding</code>, it does exactly what our <code>collate_nlp</code> does, but with extra goodies: handles attention masks, optional dynamic padding to max length, special handling for token type IDs. The pattern is identical.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Train/Validation Splits and Reproducibility</h2>

<p class="l-text">For honest evaluation you need a held-out validation set. PyTorch ships utilities for splitting datasets and seeding randomness so your experiments are reproducible.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader, random_split, Subset

<span class="cm"># Reproducibility: seed every source of randomness</span>
torch.<span class="fn">manual_seed</span>(<span class="num">42</span>)
<span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">42</span>)
<span class="kw">import</span> random
random.<span class="fn">seed</span>(<span class="num">42</span>)

<span class="kw">class</span> <span class="fn">FakeDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, n=<span class="num">1000</span>):
        self.x = torch.<span class="fn">randn</span>(n, <span class="num">10</span>)
        self.y = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, (n,))
    <span class="kw">def</span> <span class="fn">__len__</span>(self):
        <span class="kw">return</span> <span class="fn">len</span>(self.x)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i):
        <span class="kw">return</span> self.x[i], self.y[i]

ds = <span class="fn">FakeDataset</span>(<span class="num">1000</span>)

<span class="cm"># Random split with fixed generator -&gt; reproducible</span>
gen = torch.<span class="fn">Generator</span>().<span class="fn">manual_seed</span>(<span class="num">42</span>)
train_ds, val_ds = <span class="fn">random_split</span>(ds, lengths=[<span class="num">800</span>, <span class="num">200</span>], generator=gen)
<span class="fn">print</span>(<span class="fn">len</span>(train_ds), <span class="fn">len</span>(val_ds))   <span class="cm"># 800 200</span>

<span class="cm"># Or by indices for fold-based CV</span>
indices = torch.<span class="fn">randperm</span>(<span class="fn">len</span>(ds), generator=gen).<span class="fn">tolist</span>()
train_idx, val_idx = indices[:<span class="num">800</span>], indices[<span class="num">800</span>:]
train_ds2 = <span class="fn">Subset</span>(ds, train_idx)
val_ds2   = <span class="fn">Subset</span>(ds, val_idx)

train_loader = <span class="fn">DataLoader</span>(train_ds, batch_size=<span class="num">32</span>, shuffle=<span class="kw">True</span>,
                          worker_init_fn=<span class="kw">lambda</span> wid: np.random.<span class="fn">seed</span>(<span class="num">42</span> + wid))
val_loader   = <span class="fn">DataLoader</span>(val_ds, batch_size=<span class="num">64</span>, shuffle=<span class="kw">False</span>)

<span class="cm"># DataLoader determinism: also set the loader's generator</span>
g = torch.<span class="fn">Generator</span>().<span class="fn">manual_seed</span>(<span class="num">42</span>)
loader_seeded = <span class="fn">DataLoader</span>(train_ds, batch_size=<span class="num">32</span>, shuffle=<span class="kw">True</span>, generator=g)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Train/val splits with reproducibility -- sklearn.train_test_split with a fixed seed is the cleanest way to achieve what torch.utils.data.random_split does.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.model_selection import train_test_split

X = df_iris.iloc[:, :4].values
y = df_iris.iloc[:, 4].astype('category').cat.codes.values

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print('train shape:', X_tr.shape, '  test shape:', X_te.shape)
print('train class balance:', np.bincount(y_tr))
print('test  class balance:', np.bincount(y_te))

# Reproducibility -- second call returns the same split
X_tr2, X_te2, y_tr2, y_te2 = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print('reproducible:', np.array_equal(X_tr, X_tr2) and np.array_equal(y_tr, y_tr2))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets seeds for PyTorch, NumPy, and Python's <code>random</code> -- the three independent RNGs that affect a typical pipeline. Setting all three is the difference between "kind of reproducible" and "actually reproducible". 2) Defines a fake dataset for demonstration. 3) Uses <code>random_split</code> with a manually seeded generator to make the train/val split itself deterministic. Without the generator, two runs would produce different splits. 4) Shows <code>Subset</code> as the lower-level alternative -- useful for k-fold CV where you want explicit control over which indices go into which fold. 5) Builds train and validation DataLoaders. <code>shuffle=False</code> on validation guarantees the same order every epoch, which makes debugging easier. <code>worker_init_fn</code> seeds NumPy inside each worker process -- critical for reproducibility when workers do random augmentations. 6) Passes a generator directly to the loader to seed the shuffler, fully decoupled from the global state.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">torch.manual_seed</div><div class="card-body">Seeds PyTorch's CPU RNG. <code>torch.cuda.manual_seed_all</code> for GPU.</div></div>
<div class="calc-card"><div class="card-title">np.random.seed</div><div class="card-body">Seeds NumPy. Workers need it via <code>worker_init_fn</code>.</div></div>
<div class="calc-card"><div class="card-title">random.seed</div><div class="card-body">Python's built-in RNG. Used by libraries like <code>random.shuffle</code>.</div></div>
<div class="calc-card"><div class="card-title">Generator</div><div class="card-body">Per-call seeded RNG you can pass to <code>random_split</code>, <code>DataLoader</code>, etc.</div></div>
<div class="calc-card"><div class="card-title">deterministic ops</div><div class="card-body"><code>torch.use_deterministic_algorithms(True)</code> forces deterministic kernels. Slower but exact reproducibility.</div></div>
<div class="calc-card"><div class="card-title">CUDA determinism</div><div class="card-body"><code>torch.backends.cudnn.deterministic = True</code> and <code>benchmark = False</code> for fully deterministic CUDA.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Inspecting and Debugging Loaders</h2>

<p class="l-text">When training behaves weirdly, 80% of the time the bug is in the data pipeline. Inspect a single batch as soon as your loader is built; this catches most issues immediately.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader

<span class="cm"># Always inspect one batch before training</span>
<span class="kw">def</span> <span class="fn">inspect_batch</span>(loader):
    batch = <span class="fn">next</span>(<span class="fn">iter</span>(loader))
    <span class="kw">if</span> <span class="fn">isinstance</span>(batch, <span class="ty">dict</span>):
        <span class="kw">for</span> k, v <span class="kw">in</span> batch.<span class="fn">items</span>():
            <span class="kw">if</span> torch.<span class="fn">is_tensor</span>(v):
                <span class="fn">print</span>(f<span class="str">"{k:20s} shape={tuple(v.shape)} dtype={v.dtype} device={v.device}"</span>)
                <span class="kw">if</span> v.<span class="fn">numel</span>() &lt; <span class="num">50</span>:
                    <span class="fn">print</span>(<span class="str">"    "</span>, v.<span class="fn">tolist</span>())
            <span class="kw">else</span>:
                <span class="fn">print</span>(f<span class="str">"{k:20s} type={type(v).__name__}"</span>)
    <span class="kw">else</span>:
        <span class="kw">for</span> i, t <span class="kw">in</span> <span class="fn">enumerate</span>(batch):
            <span class="fn">print</span>(f<span class="str">"[{i}] shape={tuple(t.shape)} dtype={t.dtype}"</span>)

<span class="cm"># Common sanity checks</span>
<span class="kw">def</span> <span class="fn">sanity_checks</span>(loader):
    batch = <span class="fn">next</span>(<span class="fn">iter</span>(loader))
    <span class="kw">if</span> <span class="fn">isinstance</span>(batch, <span class="ty">dict</span>):
        ids = batch[<span class="str">"input_ids"</span>]
    <span class="kw">else</span>:
        ids = batch[<span class="num">0</span>]
    <span class="cm"># 1) Are there NaNs?</span>
    <span class="kw">assert</span> <span class="kw">not</span> torch.<span class="fn">isnan</span>(ids.<span class="fn">float</span>()).<span class="fn">any</span>(), <span class="str">"NaN in input_ids"</span>
    <span class="cm"># 2) Are labels in expected range?</span>
    <span class="kw">if</span> <span class="str">"labels"</span> <span class="kw">in</span> (batch <span class="kw">if</span> <span class="fn">isinstance</span>(batch, <span class="ty">dict</span>) <span class="kw">else</span> {}):
        <span class="kw">assert</span> batch[<span class="str">"labels"</span>].<span class="fn">min</span>() &gt;= <span class="num">0</span>
    <span class="cm"># 3) Is shape consistent across batches?</span>
    sizes = [<span class="fn">next</span>(<span class="fn">iter</span>(loader))[<span class="num">0</span>].shape <span class="kw">if</span> <span class="kw">not</span> <span class="fn">isinstance</span>(<span class="fn">next</span>(<span class="fn">iter</span>(loader)), <span class="ty">dict</span>) <span class="kw">else</span> <span class="fn">next</span>(<span class="fn">iter</span>(loader))[<span class="str">"input_ids"</span>].shape <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>)]
    <span class="fn">print</span>(<span class="str">"first three batch shapes:"</span>, sizes)

<span class="cm"># Speed test the loader (CPU-bound vs GPU-bound diagnosis)</span>
<span class="kw">import</span> time
<span class="kw">def</span> <span class="fn">benchmark</span>(loader, n=<span class="num">50</span>):
    it = <span class="fn">iter</span>(loader)
    t0 = time.<span class="fn">time</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n):
        batch = <span class="fn">next</span>(it)
    dt = time.<span class="fn">time</span>() - t0
    <span class="fn">print</span>(f<span class="str">"{n} batches in {dt:.2f}s -&gt; {n/dt:.1f} batches/sec"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Inspecting and debugging loaders means: print one batch, check shapes, check label distribution, look for leakage.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def loader(df, bs=16, seed=0):
    rng = np.random.default_rng(seed)
    idx = rng.permutation(len(df))
    for s in range(0, len(df), bs):
        yield df.iloc[idx[s:s+bs]]

print('--- first 2 batches inspection ---')
for i, batch in enumerate(loader(df_churn, bs=32)):
    if i >= 2: break
    print(f'batch {i}: rows={len(batch)}',
          'churn rate:', round(batch['churned'].mean(), 3),
          'avg tenure:', round(batch['tenure'].mean(), 1))

# Common bug check: NaN / Inf
features = df_churn.select_dtypes('number')
print('any NaN?', features.isna().any().any())
print('any inf?', np.isinf(features.values).any())</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>inspect_batch</code> grabs one batch and prints the shape, dtype, and device of every tensor. For small tensors it also prints the values. This three-line tool catches dtype mismatches, wrong shapes, and on-wrong-device issues immediately. 2) <code>sanity_checks</code> asserts on common invariants: no NaNs in input, labels in valid range, consistent shapes across batches. Add custom checks specific to your task. 3) <code>benchmark</code> measures how fast the loader produces batches; if you see fewer batches per second than your GPU can consume, the bottleneck is data loading and you should increase <code>num_workers</code> or simplify <code>__getitem__</code>. 4) These three utilities together diagnose 90% of pipeline issues; run them once after building each loader.</p>

<div id="plot-pl4-throughput-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Loader throughput (batches per second) as a function of <code>num_workers</code> for a hypothetical NLP pipeline. With 0 workers (main thread only) you get ~5 batches/sec. Each worker added doubles throughput up to about 4-8 workers, after which you saturate disk or CPU. Past 16 workers, contention starts to slow things down. The sweet spot for most setups is 4-8 -- benchmark on your machine to find yours.</div>

<div class="l-warn"><strong>Pitfall (silent slowdowns):</strong> If your training loop runs much slower than expected, the culprit is often a slow <code>__getitem__</code>. Common offenders: tokenizing in __getitem__ instead of preprocessing once, image decoding in <code>__getitem__</code>, slow disk I/O. Profile with <code>torch.profiler</code> or just print timings around each section.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Useful Patterns: Subset, ConcatDataset, IterableDataset</h2>

<p class="l-text">Beyond <code>Dataset</code>, PyTorch ships a small zoo of utilities for combining and slicing data. These come up constantly in real projects.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader, Subset, ConcatDataset, IterableDataset

<span class="kw">class</span> <span class="fn">Tiny</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, label):
        self.x = torch.<span class="fn">randn</span>(<span class="num">50</span>, <span class="num">4</span>)
        self.y = torch.<span class="fn">full</span>((<span class="num">50</span>,), label, dtype=torch.long)
    <span class="kw">def</span> <span class="fn">__len__</span>(self): <span class="kw">return</span> <span class="num">50</span>
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i): <span class="kw">return</span> self.x[i], self.y[i]

<span class="cm"># 1) Subset by indices -- useful for stratified splits and k-fold CV</span>
ds = <span class="fn">Tiny</span>(label=<span class="num">0</span>)
small = <span class="fn">Subset</span>(ds, indices=[<span class="num">0</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">15</span>, <span class="num">20</span>])
<span class="fn">print</span>(<span class="fn">len</span>(small))     <span class="cm"># 5</span>

<span class="cm"># 2) ConcatDataset -- merge multiple datasets (e.g. multi-source training)</span>
ds_pos = <span class="fn">Tiny</span>(label=<span class="num">1</span>)
ds_neg = <span class="fn">Tiny</span>(label=<span class="num">0</span>)
all_ds = <span class="fn">ConcatDataset</span>([ds_pos, ds_neg])
<span class="fn">print</span>(<span class="fn">len</span>(all_ds))    <span class="cm"># 100</span>
loader = <span class="fn">DataLoader</span>(all_ds, batch_size=<span class="num">8</span>, shuffle=<span class="kw">True</span>)

<span class="cm"># 3) IterableDataset -- for streaming data without a known length</span>
<span class="kw">class</span> <span class="fn">StreamingDS</span>(IterableDataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, n_per_worker=<span class="num">100</span>):
        self.n = n_per_worker
    <span class="kw">def</span> <span class="fn">__iter__</span>(self):
        <span class="cm"># Each worker calls this once</span>
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(self.n):
            <span class="kw">yield</span> torch.<span class="fn">randn</span>(<span class="num">4</span>), torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, ()).<span class="fn">item</span>()

stream = <span class="fn">StreamingDS</span>(n_per_worker=<span class="num">50</span>)
sloader = <span class="fn">DataLoader</span>(stream, batch_size=<span class="num">10</span>)
<span class="kw">for</span> x, y <span class="kw">in</span> sloader:
    <span class="fn">print</span>(x.shape, <span class="fn">len</span>(y))
    <span class="kw">break</span>

<span class="cm"># 4) WeightedRandomSampler -- oversample minority classes for imbalance</span>
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> WeightedRandomSampler

<span class="cm"># Suppose ds has class imbalance: 90% class 0, 10% class 1</span>
ds_imb = <span class="fn">ConcatDataset</span>([<span class="fn">Tiny</span>(label=<span class="num">0</span>)] * <span class="num">9</span> + [<span class="fn">Tiny</span>(label=<span class="num">1</span>)])
labels = torch.<span class="fn">cat</span>([torch.<span class="fn">zeros</span>(<span class="num">50</span>*<span class="num">9</span>, dtype=torch.long), torch.<span class="fn">ones</span>(<span class="num">50</span>)])
class_counts = torch.<span class="fn">bincount</span>(labels)
class_weights = <span class="num">1.0</span> / class_counts.<span class="fn">float</span>()
sample_weights = class_weights[labels]
sampler = <span class="fn">WeightedRandomSampler</span>(sample_weights, num_samples=<span class="fn">len</span>(labels), replacement=<span class="kw">True</span>)
balanced_loader = <span class="fn">DataLoader</span>(ds_imb, batch_size=<span class="num">32</span>, sampler=sampler)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Subset / ConcatDataset / IterableDataset patterns map straight to pandas .iloc[mask], pd.concat and itertools.chain.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import pandas as pd
from itertools import chain

# Subset via boolean mask -- equivalent of torch.utils.data.Subset
high_value = df_customers[df_customers['lifetime_value'] > df_customers['lifetime_value'].median()]
print('Subset rows:', len(high_value), '/', len(df_customers))

# ConcatDataset -- pd.concat
combined = pd.concat([df_reviews.head(50), df_tweets.head(50)], ignore_index=True)
print('ConcatDataset rows:', len(combined))

# IterableDataset = a generator
def stream_records(*dfs):
    for df in dfs:
        for _, row in df.iterrows():
            yield row.to_dict()

stream = stream_records(df_reviews.head(3), df_tweets.head(3))
for i, rec in enumerate(stream):
    print(f'  rec {i}: keys={list(rec.keys())[:3]}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>Subset</code> creates a Dataset that exposes only specified indices of the parent -- ideal for k-fold CV and stratified splits where you compute indices yourself. 2) <code>ConcatDataset</code> joins multiple datasets end-to-end; perfect for combining your own data with public corpora, or training on multiple tasks. 3) <code>IterableDataset</code> is for data streams where you cannot predict length: log files being written live, Kafka topics, infinite augmented samples. Each worker calls <code>__iter__</code> independently, so design your dataset to shard work across workers (use <code>get_worker_info()</code> in advanced cases). 4) <code>WeightedRandomSampler</code> handles class imbalance: each sample gets a weight inversely proportional to its class frequency, so the loader oversamples rare classes. This is the single most useful trick for imbalanced classification in NLP -- much simpler than rebalancing the dataset by hand.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Map-style Dataset</div><div class="compare-item">Implements <code>__len__</code> and <code>__getitem__</code></div><div class="compare-item">Random access by index</div><div class="compare-item">DataLoader can shuffle, sample weighted</div><div class="compare-item">Use 95% of the time</div></div>
<div class="compare-col"><div class="compare-title">IterableDataset</div><div class="compare-item">Implements <code>__iter__</code></div><div class="compare-item">Sequential / streaming access</div><div class="compare-item">No built-in shuffling</div><div class="compare-item">Use for log streams, infinite data</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. End-to-End: NLP Data Pipeline</h2>

<p class="l-text">Time to assemble everything into a complete pipeline you can drop into any classifier. This includes a tokenizer, a dataset, a smart collate, and a debugging step.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader, random_split
<span class="kw">from</span> torch.nn.utils.rnn <span class="kw">import</span> pad_sequence

<span class="cm"># Step 1: build a vocabulary from training data</span>
<span class="kw">def</span> <span class="fn">build_vocab</span>(texts, min_freq=<span class="num">2</span>):
    <span class="kw">from</span> collections <span class="kw">import</span> Counter
    counts = <span class="fn">Counter</span>()
    <span class="kw">for</span> t <span class="kw">in</span> texts:
        counts.<span class="fn">update</span>(t.<span class="fn">lower</span>().<span class="fn">split</span>())
    vocab = {<span class="str">"&lt;pad&gt;"</span>:<span class="num">0</span>, <span class="str">"&lt;unk&gt;"</span>:<span class="num">1</span>}
    <span class="kw">for</span> w, c <span class="kw">in</span> counts.<span class="fn">items</span>():
        <span class="kw">if</span> c &gt;= min_freq:
            vocab[w] = <span class="fn">len</span>(vocab)
    <span class="kw">return</span> vocab

<span class="cm"># Step 2: Dataset with on-the-fly tokenization</span>
<span class="kw">class</span> <span class="fn">IMDBDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, texts, labels, vocab, max_len=<span class="num">200</span>):
        self.texts = texts
        self.labels = labels
        self.vocab = vocab
        self.max_len = max_len
    <span class="kw">def</span> <span class="fn">__len__</span>(self):
        <span class="kw">return</span> <span class="fn">len</span>(self.texts)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i):
        tokens = self.texts[i].<span class="fn">lower</span>().<span class="fn">split</span>()[: self.max_len]
        ids = [self.vocab.<span class="fn">get</span>(t, <span class="num">1</span>) <span class="kw">for</span> t <span class="kw">in</span> tokens]
        <span class="kw">return</span> {
            <span class="str">"input_ids"</span>: torch.<span class="fn">tensor</span>(ids, dtype=torch.long),
            <span class="str">"label"</span>:     torch.<span class="fn">tensor</span>(self.labels[i], dtype=torch.long),
        }

<span class="cm"># Step 3: collate that pads per batch</span>
<span class="kw">def</span> <span class="fn">collate</span>(batch, pad_id=<span class="num">0</span>):
    ids = [b[<span class="str">"input_ids"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch]
    labels = torch.<span class="fn">stack</span>([b[<span class="str">"label"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch])
    padded = <span class="fn">pad_sequence</span>(ids, batch_first=<span class="kw">True</span>, padding_value=pad_id)
    mask = (padded != pad_id).<span class="fn">long</span>()
    <span class="kw">return</span> {<span class="str">"input_ids"</span>: padded, <span class="str">"attention_mask"</span>: mask, <span class="str">"labels"</span>: labels}

<span class="cm"># Toy data</span>
texts = [
    <span class="str">"this movie was incredible and made me laugh"</span>,
    <span class="str">"absolutely awful waste of two hours"</span>,
    <span class="str">"great cinematography but a thin story"</span>,
    <span class="str">"boring beyond belief"</span>,
    <span class="str">"loved every minute of this gem"</span>,
    <span class="str">"predictable garbage"</span>,
    <span class="str">"moving and powerful performance"</span>,
    <span class="str">"skip this one"</span>,
] * <span class="num">5</span>
labels = [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>] * <span class="num">5</span>

vocab = <span class="fn">build_vocab</span>(texts, min_freq=<span class="num">1</span>)
<span class="fn">print</span>(f<span class="str">"vocab size: {len(vocab)}"</span>)

ds = <span class="fn">IMDBDataset</span>(texts, labels, vocab, max_len=<span class="num">20</span>)
gen = torch.<span class="fn">Generator</span>().<span class="fn">manual_seed</span>(<span class="num">0</span>)
train_ds, val_ds = <span class="fn">random_split</span>(ds, [<span class="num">0.8</span>, <span class="num">0.2</span>], generator=gen)

train_loader = <span class="fn">DataLoader</span>(train_ds, batch_size=<span class="num">4</span>, shuffle=<span class="kw">True</span>, collate_fn=collate)
val_loader   = <span class="fn">DataLoader</span>(val_ds,   batch_size=<span class="num">4</span>, shuffle=<span class="kw">False</span>, collate_fn=collate)

<span class="cm"># Step 4: inspect one batch</span>
batch = <span class="fn">next</span>(<span class="fn">iter</span>(train_loader))
<span class="kw">for</span> k, v <span class="kw">in</span> batch.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">"{k:18s} shape={tuple(v.shape)} dtype={v.dtype}"</span>)
<span class="fn">print</span>(<span class="str">"attention_mask sample:"</span>, batch[<span class="str">"attention_mask"</span>][<span class="num">0</span>].<span class="fn">tolist</span>())
<span class="fn">print</span>(<span class="str">"labels:"</span>, batch[<span class="str">"labels"</span>].<span class="fn">tolist</span>())</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">End-to-end NLP data pipeline: tokenize -> vectorize -> split -> train -- sklearn does all of this with batteries included.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score

texts  = df_reviews['review'].tolist()
labels = df_reviews['label'].values

pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=1500, ngram_range=(1, 2))),
    ('clf', LogisticRegression(max_iter=500)),
])
scores = cross_val_score(pipe, texts, labels, cv=3)
print('CV accuracies   :', scores.round(3))
print('mean CV accuracy:', scores.mean().round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a vocabulary by counting words in training texts, keeping only those above <code>min_freq</code>; assigns IDs 0 and 1 to <code>&lt;pad&gt;</code> and <code>&lt;unk&gt;</code> respectively. 2) Defines an IMDB-style dataset with on-the-fly tokenization in <code>__getitem__</code> -- this is fine for small datasets; for large ones you would precompute IDs once. 3) Writes a <code>collate</code> that pads variable-length token lists to the max-in-batch length, builds the attention mask from non-pad positions, and stacks labels. 4) Creates toy data, splits 80/20 into train/val, wraps each in a DataLoader with the custom collate. 5) Inspects one batch to verify shapes -- exactly the debugging routine from section 6. With this scaffolding, plugging in a real model from Lesson 3 is trivial: forward pass takes <code>input_ids</code> and <code>attention_mask</code>, returns logits, and loss is computed against <code>labels</code>.</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> A <code>Dataset</code> defines <code>__len__</code> and <code>__getitem__</code>; a <code>DataLoader</code> wraps it with batching, shuffling, parallelism.<br><strong>2.</strong> For NLP, do NOT pad in <code>__getitem__</code>. Pad per batch with a custom <code>collate_fn</code> using <code>pad_sequence</code>.<br><strong>3.</strong> Always build an <code>attention_mask</code> alongside padded IDs so downstream layers can ignore padding.<br><strong>4.</strong> Set seeds for PyTorch, NumPy, Python's <code>random</code>, and use <code>worker_init_fn</code> to seed workers; pass a <code>Generator</code> to <code>random_split</code> for reproducible splits.<br><strong>5.</strong> Use <code>num_workers=4-8</code> and <code>pin_memory=True</code> for GPU training. Benchmark before tuning.<br><strong>6.</strong> Inspect one batch right after building the loader: shapes, dtypes, devices, and a few values catch most bugs immediately.<br><strong>7.</strong> <code>Subset</code>, <code>ConcatDataset</code>, <code>WeightedRandomSampler</code>, <code>IterableDataset</code> are the small zoo you reach for in real projects.<br><strong>8.</strong> Next lesson: drop a real loss and optimizer in front of this pipeline and run the full training loop.</div></div>
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

  function thrPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var workers = [0, 1, 2, 4, 8, 16, 32];
    var bps = [5, 9, 17, 32, 50, 48, 38];
    var trace = {x: workers, y: bps, mode:'lines+markers', type:'scatter',
                 line:{color:T.accent, width:3}, marker:{size:10, color:T.accent}};
    var layout = Object.assign({}, common, {
      title:{text: lang === 'tr' ? 'DataLoader Verim: num_workers' : 'DataLoader Throughput vs num_workers', font:{color:T.text,size:14}},
      xaxis:{title:'num_workers', gridcolor:T.grid, zerolinecolor:T.zero, dtick:4},
      yaxis:{title: lang==='tr'?'batch / saniye':'batches / sec', gridcolor:T.grid, zerolinecolor:T.zero}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  thrPlot('plot-pl4-throughput-en', 'en');
  thrPlot('plot-pl4-throughput-tr', 'tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Modeller kendi kendine eğitilmez -- onları batch batch, GPU'yu meşgul tutacak kadar hızlı beslemeniz gerekir.</strong> PyTorch'un veri boru hattı iki soyutlama etrafında inşa edilmiştir: <code>Dataset</code>, tek bir örneği nasıl alacağını bilir ve <code>DataLoader</code>, bir Dataset'i sararak karıştırma, padding ve önbelleğe alma ile paralel batch'ler üretir. Bunlarda ustalaşın ve eğitim betiğiniz temiz, hızlı ve ayıklaması kolay olur.</p>

<p class="l-text">Bu ders size NLP metin verisi için özel bir Dataset inşa etmeyi, onu DataLoader'a sarmayı, değişken uzunluklu dizileri padle eden akıllı bir <code>collate_fn</code> yazmayı ve eğitim döngünüzü sessizce yavaşlatan yaygın hatalardan kaçınmayı öğretir. Herhangi bir sınıflandırıcıya ekleyebileceğiniz tam bir veri boru hattıyla bitireceğiz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>NLP metni için <code>__len__</code> ve <code>__getitem__</code> uygulayan özel bir <code>Dataset</code> kurmayı</li>
<li>Onu batch'leme, karıştırma ve paralel <code>num_workers</code> ile <code>DataLoader</code>'a sarmayı</li>
<li>Değişken uzunluklu token dizilerini batch maksimumuna padleyen bir <code>collate_fn</code> yazmayı</li>
<li>GPU'yu doygun tutmak için <code>pin_memory=True</code> ve <code>prefetch_factor</code> kullanmayı</li>
<li><code>random_split</code> ve sabit <code>torch.Generator</code> tohumu ile yeniden üretilebilir bir bölünme oluşturmayı</li>
<li>Sessiz yavaşlamaları teşhis etmeyi: worker spawning, IO darboğazı, aşırı büyük batch'ler</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Veri Boru Hattı?</h2>

<p class="l-text">Bir oyuncak betikte <code>for x in data:</code> yazabilirsiniz. Gerçeğinde şuna ihtiyacınız var: epoch başına karıştırma, tutarlı şekillerle batch'leme, değişken uzunluklu diziler için padding, GPU eğitirken veri okuyan paralel CPU işçileri ve rastgele tohumlar yoluyla yeniden üretilebilirlik. PyTorch veri API'si tüm bunları küçük, kompozisyonlanabilir bir arayüzde verir.</p>

<div class="calc-highlight"><strong>Anahtar fikir:</strong> "tek örnek nedir?" sorusunu "onları nasıl batch'leriz?" sorusundan ayırın. <code>Dataset</code> ilkine cevap verir; <code>DataLoader</code> ikincisine. Ayrılma, loader'ları veri setleri arasında yeniden kullanmanıza ve döngünüzü yeniden yazmadan veri setlerini değiştirmenize izin verir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dataset</div><div class="card-body"><code>__len__</code> ve <code>__getitem__</code> tanımlar. i. örneği nasıl alacağını bilir. Batch'ler hakkında BİLMEZ.</div></div>
<div class="calc-card"><div class="card-title">DataLoader</div><div class="card-body">Bir Dataset'i sarar. Batch'ler verir. Karıştırma, batch'leme, paralelizm, önbelleğe almayı yönetir.</div></div>
<div class="calc-card"><div class="card-title">collate_fn</div><div class="card-body">Bir örnek listesini batch'lenmiş tensor'a dönüştüren fonksiyon. Varsayılan sabit şekiller için çalışır; değişken uzunluklu veri için özel bir tane yazarsınız.</div></div>
<div class="calc-card"><div class="card-title">Sampler</div><div class="card-body">İndekslerin hangi sırada çekildiğini belirler. Varsayılan: SequentialSampler sırada, shuffle=True iken RandomSampler.</div></div>
<div class="calc-card"><div class="card-title">num_workers</div><div class="card-body">Kaç CPU alt işlemin veriyi önbelleğe aldığı. 0 = yalnızca ana iş parçacığı (yavaş ama ayıklaması kolay); 4-8 tipik.</div></div>
<div class="calc-card"><div class="card-title">pin_memory</div><div class="card-body">Daha hızlı GPU transferi için sayfa kilitli CPU belleği önceden tahsis eder. GPU'da eğitirken <code>True</code> ayarlayın.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: bir HuggingFace veri boru hattı</div><div class="example-body">BERT'i ince ayarladığınızda adımlar şunlardır: (1) IMDb / SST-2 / CSV'nizi HF datasets ile yükleyin, (2) her örneği token ID'lerine tokenize edin, (3) torch <code>Dataset</code>'e sarın, (4) batch başına maksimum uzunluğa padle eden <code>collate_fn</code> ile <code>DataLoader</code>'a sarın. <code>Trainer</code> sınıfı bunu gizler ama eğitim bozulduğunda kaputun altında ne yaptığını anlamak zorunludur.</div></div>

<div class="think-box"><div class="think-label">NEDEN SADECE NUMPY DİZİSİ ÜZERİNDE DÖNGÜ DEĞİL?</div><div class="think-body">İki sebep: (1) Gerçek veri setleri belleğe sığmaz -- bir Dataset diskten akıtabilir, her örneği talep üzerine getirebilir, NumPy dizisi tam ön yükleme gerektirir. (2) CPU veri yüklerken GPU boştadır; çoklu işçilerle <code>DataLoader</code> bunları çakıştırır, böylece GPU asla beklemez. Büyük veri setlerinde fark toplam eğitim süresinde 2-5x'tir.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Özel Bir Dataset Yazma</h2>

<p class="l-text">Bir <code>Dataset</code> sadece iki metot tanımlayan bir Python sınıfıdır: <code>__len__</code> (kaç örnek) ve <code>__getitem__</code> (i. örneği tensor tuple olarak döndür). Çerçeve bunları sizin için çağırır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset

<span class="kw">class</span> <span class="fn">TextSentimentDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, texts, labels, vocab, max_len=<span class="num">64</span>):
        <span class="kw">assert</span> <span class="fn">len</span>(texts) == <span class="fn">len</span>(labels)
        self.texts = texts
        self.labels = labels
        self.vocab = vocab            <span class="cm"># sözlük: kelime -&gt; int id</span>
        self.unk = vocab[<span class="str">"&lt;unk&gt;"</span>]
        self.pad = vocab[<span class="str">"&lt;pad&gt;"</span>]
        self.max_len = max_len

    <span class="kw">def</span> <span class="fn">__len__</span>(self):
        <span class="kw">return</span> <span class="fn">len</span>(self.texts)

    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, idx):
        text = self.texts[idx].<span class="fn">lower</span>().<span class="fn">split</span>()
        ids = [self.vocab.<span class="fn">get</span>(w, self.unk) <span class="kw">for</span> w <span class="kw">in</span> text][: self.max_len]
        <span class="cm"># BURADA padlenmedi -- collate_fn batch başına padding yönetir</span>
        <span class="kw">return</span> {
            <span class="str">"input_ids"</span>: torch.<span class="fn">tensor</span>(ids, dtype=torch.long),
            <span class="str">"label"</span>:     torch.<span class="fn">tensor</span>(self.labels[idx], dtype=torch.long),
            <span class="str">"length"</span>:    <span class="fn">len</span>(ids),
        }

<span class="cm"># Oyuncak veri</span>
texts = [
    <span class="str">"this movie was amazing"</span>,
    <span class="str">"absolutely terrible film, hated it"</span>,
    <span class="str">"great cast and a wonderful story"</span>,
    <span class="str">"boring and predictable"</span>,
    <span class="str">"loved every minute of it"</span>,
]
labels = [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>]
vocab = {<span class="str">"&lt;pad&gt;"</span>:<span class="num">0</span>, <span class="str">"&lt;unk&gt;"</span>:<span class="num">1</span>, <span class="str">"this"</span>:<span class="num">2</span>, <span class="str">"movie"</span>:<span class="num">3</span>, <span class="str">"was"</span>:<span class="num">4</span>, <span class="str">"amazing"</span>:<span class="num">5</span>,
         <span class="str">"absolutely"</span>:<span class="num">6</span>, <span class="str">"terrible"</span>:<span class="num">7</span>, <span class="str">"film"</span>:<span class="num">8</span>, <span class="str">"hated"</span>:<span class="num">9</span>, <span class="str">"it"</span>:<span class="num">10</span>,
         <span class="str">"great"</span>:<span class="num">11</span>, <span class="str">"cast"</span>:<span class="num">12</span>, <span class="str">"and"</span>:<span class="num">13</span>, <span class="str">"a"</span>:<span class="num">14</span>, <span class="str">"wonderful"</span>:<span class="num">15</span>, <span class="str">"story"</span>:<span class="num">16</span>,
         <span class="str">"boring"</span>:<span class="num">17</span>, <span class="str">"predictable"</span>:<span class="num">18</span>, <span class="str">"loved"</span>:<span class="num">19</span>, <span class="str">"every"</span>:<span class="num">20</span>, <span class="str">"minute"</span>:<span class="num">21</span>, <span class="str">"of"</span>:<span class="num">22</span>}

ds = <span class="fn">TextSentimentDataset</span>(texts, labels, vocab, max_len=<span class="num">12</span>)
<span class="fn">print</span>(<span class="fn">len</span>(ds))            <span class="cm"># 5</span>
<span class="fn">print</span>(ds[<span class="num">0</span>])              <span class="cm"># {'input_ids': tensor([2,3,4,5]), 'label': tensor(1), 'length': 4}</span>
<span class="fn">print</span>(ds[<span class="num">1</span>])              <span class="cm"># farklı uzunluk!</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Özel bir Dataset esasen __len__ ve __getitem__ olan bir Python sınıfıdır. Pandas DataFrame üstünde aynısını yapıyoruz -- torch'un sardığı soyutlamanın aynısı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

class ReviewDataset:
    def __init__(self, df):
        self.texts  = df['review'].tolist()
        self.labels = df['label'].values
    def __len__(self):
        return len(self.texts)
    def __getitem__(self, idx):
        return {'text': self.texts[idx], 'label': int(self.labels[idx])}

ds = ReviewDataset(df_reviews)
print('dataset size:', len(ds))
print('item 0:', ds[0])
print('item 5:', {k: (v[:60] + '...' if isinstance(v, str) and len(v) > 60 else v) for k, v in ds[5].items()})</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>Dataset</code>'i alt sınıflandırır ve <code>__init__</code>'te metinleri, etiketleri ve bir sözlük eşlemesini kabul eder. Her şeyi düz listeler olarak saklarız; <code>__getitem__</code> talep üzerine tokenize eder. 2) <code>__len__</code> veri seti boyutunu döndürür; <code>DataLoader</code> bir epoch'un ne zaman bittiğini bilmek için bunu kullanır. 3) <code>__getitem__</code> bir tamsayı indeks alır ve bir örnek döndürür. Boşlukla bölerek tokenize ederiz, her kelimeyi sözlükte ararız (<code>&lt;unk&gt;</code>'ye geri düşerek) ve <code>max_len</code>'de keseriz. 4) Kritik olarak, BURADA padlemeyiz -- farklı örneklerin farklı uzunlukları vardır ve DataLoader'ın collate fonksiyonunun her batch'i o batch'teki en uzun örneğe padlemesini isteriz (her şeyi global maksimuma padlemeye karşı hesaplama tasarrufu). 5) Modern PyTorch konvansiyonu olan bir sözlük döndürür (HuggingFace ile uyumlu) -- bir tuple da döndürebilirsiniz ama sözlükler birçok alan için daha okunabilir. 6) Oyuncak çalıştırma NLP verisinin değişken uzunluk doğasını göstermek için farklı uzunlukta iki örnek yazdırır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">__init__</div><div class="card-body">Veriyi ve meta veriyi sakla. Veri seti RAM'e sığacak kadar küçük değilse burada ağır iş yapmaktan kaçının.</div></div>
<div class="calc-card"><div class="card-title">__len__</div><div class="card-body">Toplam örnek sayısını döndür. Epoch sınırları için DataLoader tarafından gerekli.</div></div>
<div class="calc-card"><div class="card-title">__getitem__(idx)</div><div class="card-body">BİR örnek döndür. Ham veriyi burada tensor'lara dönüştür. Sıcak yolda Python seviyesinde işten kaçının.</div></div>
<div class="calc-card"><div class="card-title">Sözlük veya tuple döner</div><div class="card-body">Kendi kendini belgeleyen batch'ler için sözlük; basit eğitim döngüleriyle en sıkı entegrasyon için tuple.</div></div>
</div>

<div class="l-note"><strong>Akış vs bellek içi:</strong> Veri setiniz küçükse (&lt; birkaç GB) ve sıkça erişiliyorsa <code>__init__</code>'te bellekte saklayın. Çok büyükse (TB ölçeği) <code>__getitem__</code>'de dosyaları tembel açın. <code>IterableDataset</code> alt sınıfı, <code>__len__</code>'in bilinmediği akış verisi için vardır -- log akışları ve Kafka konuları için kullanın.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. DataLoader Temelleri</h2>

<p class="l-text"><code>DataLoader</code> bir Dataset'i sarar ve batch'ler verir. Argümanların çoğu performans ve yeniden üretilebilirlik için çevirdiğiniz düğmelerdir. Varsayılan <code>collate_fn</code> yalnızca her örneğin aynı şekle sahip olduğunda çalışır -- bu NLP için neredeyse hiçbir zaman doğru değildir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader, Dataset

<span class="cm"># Önemsiz sabit şekilli veri seti varsayılan collate ile çalışır</span>
<span class="kw">class</span> <span class="fn">FixedDS</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, n=<span class="num">20</span>):
        self.n = n
    <span class="kw">def</span> <span class="fn">__len__</span>(self):
        <span class="kw">return</span> self.n
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i):
        x = torch.<span class="fn">full</span>((<span class="num">4</span>,), <span class="fn">float</span>(i))     <span class="cm"># şekil (4,)</span>
        y = torch.<span class="fn">tensor</span>(i % <span class="num">2</span>)
        <span class="kw">return</span> x, y

ds = <span class="fn">FixedDS</span>(<span class="num">20</span>)

<span class="cm"># DataLoader: her epoch karıştır, batch_size=4</span>
loader = <span class="fn">DataLoader</span>(ds, batch_size=<span class="num">4</span>, shuffle=<span class="kw">True</span>)

<span class="kw">for</span> batch_idx, (x, y) <span class="kw">in</span> <span class="fn">enumerate</span>(loader):
    <span class="fn">print</span>(batch_idx, x.shape, y.shape)
    <span class="kw">if</span> batch_idx == <span class="num">1</span>: <span class="kw">break</span>
<span class="cm"># 0 torch.Size([4, 4]) torch.Size([4])</span>
<span class="cm"># 1 torch.Size([4, 4]) torch.Size([4])</span>

<span class="cm"># Yaygın argümanlar</span>
loader = <span class="fn">DataLoader</span>(
    ds,
    batch_size=<span class="num">8</span>,
    shuffle=<span class="kw">True</span>,
    num_workers=<span class="num">2</span>,            <span class="cm"># önbelleğe alma için CPU alt işlemleri</span>
    pin_memory=<span class="kw">True</span>,          <span class="cm"># daha hızlı CPU -&gt; GPU transferi</span>
    drop_last=<span class="kw">False</span>,          <span class="cm"># son kısmi batch'i tut</span>
    persistent_workers=<span class="kw">True</span>,  <span class="cm"># epoch'lar arası işçileri canlı tut</span>
)

<span class="cm"># Çoklu epoch yineleme</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2</span>):
    <span class="kw">for</span> x, y <span class="kw">in</span> loader:
        <span class="cm"># train_step(x, y)</span>
        <span class="kw">pass</span>
    <span class="fn">print</span>(f<span class="str">"epoch {epoch} bitti"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">DataLoader = batch iteratörü. Bir dataset'i 32 satırda bir bir generator ile iterleyebiliriz -- torch.utils.data.DataLoader'ın saf-Python özü.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def batch_iter(df, batch_size=32, shuffle=True, seed=0):
    n = len(df)
    idx = np.arange(n)
    if shuffle:
        np.random.default_rng(seed).shuffle(idx)
    for start in range(0, n, batch_size):
        sel = idx[start:start + batch_size]
        yield df.iloc[sel].reset_index(drop=True)

n_batches = 0
total = 0
for batch in batch_iter(df_reviews, batch_size=64):
    n_batches += 1
    total += len(batch)
    if n_batches <= 2:
        print(f'batch {n_batches}: rows {len(batch)}, label balance {batch["label"].mean():.2f}')
print(f'total batches: {n_batches}, total rows: {total}')</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Her örneğin 4 vektör ve skaler etiket olduğu önemsiz sabit şekilli bir veri seti tanımlar. Varsayılan collate yeni bir batch boyutu boyunca tensor'ları yığar, burada şekiller eşleştiği için mükemmel çalışır. 2) <code>batch_size=4</code> ve <code>shuffle=True</code> ile <code>DataLoader</code>'a sarar; yineleme yığılmış tensor tuple'ları verir. 3) Tam argüman listesi üretim düğmelerini gösterir: <code>num_workers</code>, GPU eğitirken veriyi önbelleğe alan alt işlemleri başlatır; <code>pin_memory</code> daha hızlı <code>.cuda()</code> transferleri için sayfa kilitli bellek kullanır; <code>drop_last</code> son kısmi batch'i atlar (modeliniz sabit batch boyutu gerektiriyorsa kullanın); <code>persistent_workers</code> 1-2 saniyelik başlatma ek yükünü önlemek için epoch'lar arası işçi alt işlemlerini canlı tutar. 4) Standart iç içe döngü -- dış epoch'lar üzerinde, iç batch'ler üzerinde -- her PyTorch eğitim betiğinin iskeletidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">batch_size</div><div class="card-body">Batch başına kaç örnek. Daha büyük = daha pürüzsüz gradyanlar, daha fazla bellek. Transformer'lar için 32-256 tipik.</div></div>
<div class="calc-card"><div class="card-title">shuffle=True</div><div class="card-body">Her epoch sırayı rastgele yapar. Eğitim için her zaman True, doğrulama için False.</div></div>
<div class="calc-card"><div class="card-title">num_workers</div><div class="card-body">CPU önbelleğe alma paralelliği. 4 ile başlayın; sweet spot'unuzu bulmak için benchmark yapın. Ayıklama için 0.</div></div>
<div class="calc-card"><div class="card-title">pin_memory=True</div><div class="card-body">CPU -&gt; GPU transferini hızlandırır. GPU'da eğitirseniz True ayarlayın. Yalnızca CPU'da etkisi yok.</div></div>
<div class="calc-card"><div class="card-title">drop_last</div><div class="card-body">Son kısmi batch'i bırakır. BatchNorm veya kodunuz sabit batch boyutu gerektiriyorsa True kullanın.</div></div>
<div class="calc-card"><div class="card-title">collate_fn</div><div class="card-body">Örnekleri batch'e nasıl yığacağı. Varsayılan sabit şekiller için çalışır; değişken uzunluklar için özel geçirin.</div></div>
</div>

<div class="l-warn"><strong>Tuzak (işçiler ve Windows):</strong> Windows'ta <code>num_workers &gt; 0</code>, eğitim betiğinizin <code>if __name__ == "__main__":</code> ile korunmasını gerektirir. Aksi halde spawn yöntemi modülünüzü yeniden içe aktarır ve özyinelemeli olarak alt işlemleri başlatır. Linux/Mac'te fork ile bu gerekli değildir ama yine de iyi pratiktir.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Değişken Uzunluklu Diziler için collate_fn</h2>

<p class="l-text">NLP örneklerinin farklı uzunlukları vardır. Varsayılan collate farklı şekilli tensor'ları yığamaz -- hata fırlatır. Bir örnek listesi alıp batch'lenmiş bir sözlük döndüren, mevcut batch'teki en uzun diziye padleyen bir <code>collate_fn</code> yazarsınız.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.nn.utils.rnn <span class="kw">import</span> pad_sequence
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader

<span class="kw">def</span> <span class="fn">collate_nlp</span>(batch, pad_id=<span class="num">0</span>):
    <span class="cm"># batch, __getitem__'den gelen sözlüklerin listesidir</span>
    input_ids = [b[<span class="str">"input_ids"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch]
    labels    = torch.<span class="fn">stack</span>([b[<span class="str">"label"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch])
    lengths   = torch.<span class="fn">tensor</span>([b[<span class="str">"length"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch])

    <span class="cm"># BU batch'teki en uzun diziye padle</span>
    padded = <span class="fn">pad_sequence</span>(input_ids, batch_first=<span class="kw">True</span>, padding_value=pad_id)
    <span class="cm"># padded şekli: (B, T_max_in_batch)</span>

    attention_mask = (padded != pad_id).<span class="fn">long</span>()

    <span class="kw">return</span> {
        <span class="str">"input_ids"</span>: padded,
        <span class="str">"attention_mask"</span>: attention_mask,
        <span class="str">"labels"</span>: labels,
        <span class="str">"lengths"</span>: lengths,
    }

<span class="cm"># Bölüm 2'deki TextSentimentDataset'i yeniden kullan</span>
<span class="cm"># loader = DataLoader(ds, batch_size=2, shuffle=True, collate_fn=collate_nlp)</span>
<span class="cm"># for batch in loader:</span>
<span class="cm">#     print(batch["input_ids"].shape)        # örn. (2, 6)</span>
<span class="cm">#     print(batch["attention_mask"].shape)   # (2, 6)</span>
<span class="cm">#     print(batch["labels"])                 # tensor([0, 1])</span>

<span class="cm"># pad_sequence manuel demosu</span>
seqs = [torch.<span class="fn">tensor</span>([<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>]),
        torch.<span class="fn">tensor</span>([<span class="num">6</span>, <span class="num">7</span>, <span class="num">8</span>]),
        torch.<span class="fn">tensor</span>([<span class="num">9</span>, <span class="num">10</span>])]
padded = <span class="fn">pad_sequence</span>(seqs, batch_first=<span class="kw">True</span>, padding_value=<span class="num">0</span>)
<span class="fn">print</span>(padded)
<span class="cm"># tensor([[2, 3, 4, 5],</span>
<span class="cm">#         [6, 7, 8, 0],</span>
<span class="cm">#         [9, 10, 0, 0]])</span>
mask = (padded != <span class="num">0</span>).<span class="fn">long</span>()
<span class="fn">print</span>(mask)
<span class="cm"># tensor([[1, 1, 1, 1],</span>
<span class="cm">#         [1, 1, 1, 0],</span>
<span class="cm">#         [1, 1, 0, 0]])</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">collate_fn değişken uzunluklu dizileri padding ile yönetir. Cümleleri NumPy ile tokenize edip padliyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

texts = ['I loved the movie',
         'meh, it was okay',
         'absolutely terrible and boring',
         'great']

# Build vocab
vocab = {'<pad>': 0}
for t in texts:
    for w in t.lower().split():
        vocab.setdefault(w, len(vocab))

# Tokenize
ids = [[vocab[w] for w in t.lower().split()] for t in texts]
lens = [len(i) for i in ids]
max_len = max(lens)

# Pad with 0 (the <pad> id)
padded = np.zeros((len(ids), max_len), dtype=np.int64)
for r, seq in enumerate(ids):
    padded[r, :len(seq)] = seq

print('vocab size :', len(vocab))
print('lengths    :', lens)
print('padded ids :\n', padded)
print('attention mask:\n', (padded != 0).astype(int))</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>collate_nlp</code> tanımlar, örnek sözlüklerinin (her biri <code>__getitem__</code>'den) bir listesini alan ve bir batch'lenmiş sözlük döndüren fonksiyon. 2) Değişken uzunluklu token ID listelerini bir Python listesine, etiketleri ve uzunlukları yığılmış tensor'lara çıkarır. 3) PyTorch'tan <code>pad_sequence</code>'ı çağırır, listedeki her diziyi belirtilen padding değeriyle en uzununa padler ve <code>(B, T_max)</code> şekilli 2 boyutlu bir tensor döndürür. <code>batch_first=True</code> daha okunabilir <code>(B, T)</code> düzenini <code>(T, B)</code> yerine verir. 4) Gerçek token'lar için 1'lerden ve padding için 0'lardan oluşan bir <code>attention_mask</code> oluşturur -- bu, dikkat sırasında padding'i yok saymak için her transformer'ın kullandığı şeydir. 5) Modelin ihtiyaç duyduğu her şeyle bir sözlük döndürür. 6) Manuel demo, padding ile uzunluk 4'e padlenmiş 4, 3, 2 uzunluklarında üç dizi gösterir -- kanonik NLP batch yapımı.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: verim için dinamik batch'leme</div><div class="example-body">Veri setinizin çılgınca değişen uzunlukları varsa (1 kelimeden 500 kelimeye), örnek seviyesinde batch'leme padding'de hesaplama israf eder. Hile: örnekleri uzunluğa göre kovaya koyun, böylece her batch'in benzer uzunlukları olur, padding'i büyük ölçüde azaltır. PyTorch'un bunun için <code>BatchSampler</code>'ı vardır; HuggingFace'in <code>DataCollatorWithPadding</code>'i kovalanmış batch'lemeyi uygular. Uzun diziler için bu eğitimi 2-3x hızlandırabilir.</div></div>

<div class="l-note"><strong>HuggingFace entegrasyonu:</strong> HF'nin <code>DataCollatorWithPadding</code>'ini kullandığınızda, bizim <code>collate_nlp</code>'mizin yaptığını yapar ama ekstra güzelliklerle: dikkat maskelerini yönetir, isteğe bağlı dinamik padding maks uzunluğa, token tipi ID'leri için özel işleme. Kalıp aynıdır.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Eğitim/Doğrulama Bölmeleri ve Yeniden Üretilebilirlik</h2>

<p class="l-text">Dürüst değerlendirme için ayrılmış bir doğrulama setine ihtiyacınız var. PyTorch veri setlerini bölmek ve rastgeleliği tohumlamak için yardımcı programlar sağlar, böylece deneyleriniz yeniden üretilebilirdir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader, random_split, Subset

<span class="cm"># Yeniden üretilebilirlik: her rastgelelik kaynağını tohumla</span>
torch.<span class="fn">manual_seed</span>(<span class="num">42</span>)
<span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">42</span>)
<span class="kw">import</span> random
random.<span class="fn">seed</span>(<span class="num">42</span>)

<span class="kw">class</span> <span class="fn">FakeDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, n=<span class="num">1000</span>):
        self.x = torch.<span class="fn">randn</span>(n, <span class="num">10</span>)
        self.y = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, (n,))
    <span class="kw">def</span> <span class="fn">__len__</span>(self):
        <span class="kw">return</span> <span class="fn">len</span>(self.x)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i):
        <span class="kw">return</span> self.x[i], self.y[i]

ds = <span class="fn">FakeDataset</span>(<span class="num">1000</span>)

<span class="cm"># Sabit generator ile rastgele bölme -&gt; yeniden üretilebilir</span>
gen = torch.<span class="fn">Generator</span>().<span class="fn">manual_seed</span>(<span class="num">42</span>)
train_ds, val_ds = <span class="fn">random_split</span>(ds, lengths=[<span class="num">800</span>, <span class="num">200</span>], generator=gen)
<span class="fn">print</span>(<span class="fn">len</span>(train_ds), <span class="fn">len</span>(val_ds))   <span class="cm"># 800 200</span>

<span class="cm"># Veya k-fold CV için indekslerle</span>
indices = torch.<span class="fn">randperm</span>(<span class="fn">len</span>(ds), generator=gen).<span class="fn">tolist</span>()
train_idx, val_idx = indices[:<span class="num">800</span>], indices[<span class="num">800</span>:]
train_ds2 = <span class="fn">Subset</span>(ds, train_idx)
val_ds2   = <span class="fn">Subset</span>(ds, val_idx)

train_loader = <span class="fn">DataLoader</span>(train_ds, batch_size=<span class="num">32</span>, shuffle=<span class="kw">True</span>,
                          worker_init_fn=<span class="kw">lambda</span> wid: np.random.<span class="fn">seed</span>(<span class="num">42</span> + wid))
val_loader   = <span class="fn">DataLoader</span>(val_ds, batch_size=<span class="num">64</span>, shuffle=<span class="kw">False</span>)

<span class="cm"># DataLoader determinizmi: ayrıca loader'ın generator'ını ayarla</span>
g = torch.<span class="fn">Generator</span>().<span class="fn">manual_seed</span>(<span class="num">42</span>)
loader_seeded = <span class="fn">DataLoader</span>(train_ds, batch_size=<span class="num">32</span>, shuffle=<span class="kw">True</span>, generator=g)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Yeniden üretilebilir train/val ayrımı -- sabit seed'li sklearn.train_test_split, torch.utils.data.random_split'in yaptığını yapmanın en temiz yoludur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.model_selection import train_test_split

X = df_iris.iloc[:, :4].values
y = df_iris.iloc[:, 4].astype('category').cat.codes.values

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print('train shape:', X_tr.shape, '  test shape:', X_te.shape)
print('train class balance:', np.bincount(y_tr))
print('test  class balance:', np.bincount(y_te))

# Reproducibility -- second call returns the same split
X_tr2, X_te2, y_tr2, y_te2 = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print('reproducible:', np.array_equal(X_tr, X_tr2) and np.array_equal(y_tr, y_tr2))</code></pre></div>
</div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) PyTorch, NumPy ve Python'un <code>random</code>'ının tohumlarını ayarlar -- tipik bir boru hattını etkileyen üç bağımsız RNG. Üçünü de ayarlamak "biraz yeniden üretilebilir" ile "gerçekten yeniden üretilebilir" arasındaki farktır. 2) Gösterim için sahte bir veri seti tanımlar. 3) Eğitim/doğrulama bölmesini deterministik yapmak için manuel olarak tohumlanmış generator ile <code>random_split</code> kullanır. Generator olmadan iki çalıştırma farklı bölmeler üretirdi. 4) <code>Subset</code>'i daha düşük seviyeli alternatif olarak gösterir -- hangi indekslerin hangi fold'a gideceği üzerinde açık kontrol istediğiniz k-fold CV için kullanışlı. 5) Eğitim ve doğrulama DataLoader'ları kurar. Doğrulamada <code>shuffle=False</code> her epoch aynı sırayı garantiler ki ayıklama daha kolay olur. <code>worker_init_fn</code> her işçi işleminin içinde NumPy'ı tohumlar -- işçiler rastgele augmentasyonlar yaptığında yeniden üretilebilirlik için kritik. 6) Karıştırıcıyı tohumlamak için doğrudan loader'a generator geçirir, global durumdan tamamen ayrılmıştır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">torch.manual_seed</div><div class="card-body">PyTorch'un CPU RNG'sini tohumlar. GPU için <code>torch.cuda.manual_seed_all</code>.</div></div>
<div class="calc-card"><div class="card-title">np.random.seed</div><div class="card-body">NumPy'ı tohumlar. İşçilerin <code>worker_init_fn</code> aracılığıyla buna ihtiyacı vardır.</div></div>
<div class="calc-card"><div class="card-title">random.seed</div><div class="card-body">Python'un yerleşik RNG'si. <code>random.shuffle</code> gibi kütüphaneler tarafından kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Generator</div><div class="card-body"><code>random_split</code>, <code>DataLoader</code> vb.'ye geçirebileceğiniz çağrı başına tohumlanmış RNG.</div></div>
<div class="calc-card"><div class="card-title">deterministik işlemler</div><div class="card-body"><code>torch.use_deterministic_algorithms(True)</code> deterministik kernel'leri zorlar. Daha yavaş ama tam yeniden üretilebilirlik.</div></div>
<div class="calc-card"><div class="card-title">CUDA determinizmi</div><div class="card-body">Tamamen deterministik CUDA için <code>torch.backends.cudnn.deterministic = True</code> ve <code>benchmark = False</code>.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Loader'ları İnceleme ve Ayıklama</h2>

<p class="l-text">Eğitim garip davrandığında, %80 oranında hata veri boru hattındadır. Loader'ınız oluşur oluşmaz tek bir batch'i inceleyin; bu çoğu sorunu hemen yakalar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader

<span class="cm"># Eğitimden önce her zaman bir batch'i incele</span>
<span class="kw">def</span> <span class="fn">inspect_batch</span>(loader):
    batch = <span class="fn">next</span>(<span class="fn">iter</span>(loader))
    <span class="kw">if</span> <span class="fn">isinstance</span>(batch, <span class="ty">dict</span>):
        <span class="kw">for</span> k, v <span class="kw">in</span> batch.<span class="fn">items</span>():
            <span class="kw">if</span> torch.<span class="fn">is_tensor</span>(v):
                <span class="fn">print</span>(f<span class="str">"{k:20s} shape={tuple(v.shape)} dtype={v.dtype} device={v.device}"</span>)
                <span class="kw">if</span> v.<span class="fn">numel</span>() &lt; <span class="num">50</span>:
                    <span class="fn">print</span>(<span class="str">"    "</span>, v.<span class="fn">tolist</span>())
            <span class="kw">else</span>:
                <span class="fn">print</span>(f<span class="str">"{k:20s} type={type(v).__name__}"</span>)
    <span class="kw">else</span>:
        <span class="kw">for</span> i, t <span class="kw">in</span> <span class="fn">enumerate</span>(batch):
            <span class="fn">print</span>(f<span class="str">"[{i}] shape={tuple(t.shape)} dtype={t.dtype}"</span>)

<span class="cm"># Yaygın sağlık kontrolleri</span>
<span class="kw">def</span> <span class="fn">sanity_checks</span>(loader):
    batch = <span class="fn">next</span>(<span class="fn">iter</span>(loader))
    <span class="kw">if</span> <span class="fn">isinstance</span>(batch, <span class="ty">dict</span>):
        ids = batch[<span class="str">"input_ids"</span>]
    <span class="kw">else</span>:
        ids = batch[<span class="num">0</span>]
    <span class="cm"># 1) NaN var mı?</span>
    <span class="kw">assert</span> <span class="kw">not</span> torch.<span class="fn">isnan</span>(ids.<span class="fn">float</span>()).<span class="fn">any</span>(), <span class="str">"input_ids'de NaN"</span>
    <span class="cm"># 2) Etiketler beklenen aralıkta mı?</span>
    <span class="kw">if</span> <span class="str">"labels"</span> <span class="kw">in</span> (batch <span class="kw">if</span> <span class="fn">isinstance</span>(batch, <span class="ty">dict</span>) <span class="kw">else</span> {}):
        <span class="kw">assert</span> batch[<span class="str">"labels"</span>].<span class="fn">min</span>() &gt;= <span class="num">0</span>
    <span class="cm"># 3) Şekil batch'ler arası tutarlı mı?</span>
    sizes = [<span class="fn">next</span>(<span class="fn">iter</span>(loader))[<span class="num">0</span>].shape <span class="kw">if</span> <span class="kw">not</span> <span class="fn">isinstance</span>(<span class="fn">next</span>(<span class="fn">iter</span>(loader)), <span class="ty">dict</span>) <span class="kw">else</span> <span class="fn">next</span>(<span class="fn">iter</span>(loader))[<span class="str">"input_ids"</span>].shape <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>)]
    <span class="fn">print</span>(<span class="str">"ilk üç batch şekli:"</span>, sizes)

<span class="cm"># Loader'ı hız testi yap (CPU sınırlı vs GPU sınırlı tanılama)</span>
<span class="kw">import</span> time
<span class="kw">def</span> <span class="fn">benchmark</span>(loader, n=<span class="num">50</span>):
    it = <span class="fn">iter</span>(loader)
    t0 = time.<span class="fn">time</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n):
        batch = <span class="fn">next</span>(it)
    dt = time.<span class="fn">time</span>() - t0
    <span class="fn">print</span>(f<span class="str">"{n} batch {dt:.2f}s'de -&gt; {n/dt:.1f} batch/sn"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Loader'ları ayıklama: bir batch yazdır, şekilleri kontrol et, etiket dağılımını kontrol et, leak var mı bak.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def loader(df, bs=16, seed=0):
    rng = np.random.default_rng(seed)
    idx = rng.permutation(len(df))
    for s in range(0, len(df), bs):
        yield df.iloc[idx[s:s+bs]]

print('--- first 2 batches inspection ---')
for i, batch in enumerate(loader(df_churn, bs=32)):
    if i >= 2: break
    print(f'batch {i}: rows={len(batch)}',
          'churn rate:', round(batch['churned'].mean(), 3),
          'avg tenure:', round(batch['tenure'].mean(), 1))

# Common bug check: NaN / Inf
features = df_churn.select_dtypes('number')
print('any NaN?', features.isna().any().any())
print('any inf?', np.isinf(features.values).any())</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>inspect_batch</code> bir batch alır ve her tensor'un şeklini, dtype'ını ve cihazını yazdırır. Küçük tensor'lar için ayrıca değerleri yazdırır. Bu üç satırlık araç dtype uyuşmazlıklarını, yanlış şekilleri ve yanlış cihaz sorunlarını anında yakalar. 2) <code>sanity_checks</code> yaygın değişmezler üzerinde assertion yapar: girdide NaN yok, etiketler geçerli aralıkta, batch'ler arası tutarlı şekiller. Görevinize özel özel kontroller ekleyin. 3) <code>benchmark</code> loader'ın saniyede ne kadar hızlı batch ürettiğini ölçer; GPU'nuzun tüketebileceğinden daha az batch görürseniz darboğaz veri yüklemededir ve <code>num_workers</code>'ı artırmalı veya <code>__getitem__</code>'i basitleştirmelisiniz. 4) Bu üç yardımcı program birlikte boru hattı sorunlarının %90'ını teşhis eder; her loader'ı inşa ettikten sonra bir kez çalıştırın.</p>

<div id="plot-pl4-throughput-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Hipotetik bir NLP boru hattı için <code>num_workers</code>'ın bir fonksiyonu olarak loader verimi (saniyede batch). 0 işçiyle (yalnızca ana iş parçacığı) ~5 batch/sn alırsınız. Eklenen her işçi yaklaşık 4-8 işçiye kadar verimi ikiye katlar, sonrasında disk veya CPU doyar. 16 işçinin ötesinde, çekişme işleri yavaşlatmaya başlar. Çoğu kurulum için sweet spot 4-8'dir -- kendinizinkini bulmak için makinenizde benchmark yapın.</div>

<div class="l-warn"><strong>Tuzak (sessiz yavaşlamalar):</strong> Eğitim döngünüz beklenenden çok daha yavaş çalışıyorsa suçlu genellikle yavaş bir <code>__getitem__</code>'dir. Yaygın suçlular: bir kez ön işleme yerine __getitem__'de tokenize etmek, <code>__getitem__</code>'de görüntü kod çözme, yavaş disk I/O. <code>torch.profiler</code> ile profil çıkarın veya her bölümün etrafına zamanlama yazdırın.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Faydalı Kalıplar: Subset, ConcatDataset, IterableDataset</h2>

<p class="l-text"><code>Dataset</code>'in ötesinde, PyTorch veriyi birleştirmek ve dilimlemek için küçük bir hayvanat bahçesi yardımcı program sağlar. Bunlar gerçek projelerde sürekli ortaya çıkar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader, Subset, ConcatDataset, IterableDataset

<span class="kw">class</span> <span class="fn">Tiny</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, label):
        self.x = torch.<span class="fn">randn</span>(<span class="num">50</span>, <span class="num">4</span>)
        self.y = torch.<span class="fn">full</span>((<span class="num">50</span>,), label, dtype=torch.long)
    <span class="kw">def</span> <span class="fn">__len__</span>(self): <span class="kw">return</span> <span class="num">50</span>
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i): <span class="kw">return</span> self.x[i], self.y[i]

<span class="cm"># 1) İndekslere göre Subset -- katmanlı bölmeler ve k-fold CV için kullanışlı</span>
ds = <span class="fn">Tiny</span>(label=<span class="num">0</span>)
small = <span class="fn">Subset</span>(ds, indices=[<span class="num">0</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">15</span>, <span class="num">20</span>])
<span class="fn">print</span>(<span class="fn">len</span>(small))     <span class="cm"># 5</span>

<span class="cm"># 2) ConcatDataset -- birden fazla veri setini birleştir (örn. çok kaynaklı eğitim)</span>
ds_pos = <span class="fn">Tiny</span>(label=<span class="num">1</span>)
ds_neg = <span class="fn">Tiny</span>(label=<span class="num">0</span>)
all_ds = <span class="fn">ConcatDataset</span>([ds_pos, ds_neg])
<span class="fn">print</span>(<span class="fn">len</span>(all_ds))    <span class="cm"># 100</span>
loader = <span class="fn">DataLoader</span>(all_ds, batch_size=<span class="num">8</span>, shuffle=<span class="kw">True</span>)

<span class="cm"># 3) IterableDataset -- bilinen uzunluğu olmayan akış verisi için</span>
<span class="kw">class</span> <span class="fn">StreamingDS</span>(IterableDataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, n_per_worker=<span class="num">100</span>):
        self.n = n_per_worker
    <span class="kw">def</span> <span class="fn">__iter__</span>(self):
        <span class="cm"># Her işçi bunu bir kez çağırır</span>
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(self.n):
            <span class="kw">yield</span> torch.<span class="fn">randn</span>(<span class="num">4</span>), torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, ()).<span class="fn">item</span>()

stream = <span class="fn">StreamingDS</span>(n_per_worker=<span class="num">50</span>)
sloader = <span class="fn">DataLoader</span>(stream, batch_size=<span class="num">10</span>)
<span class="kw">for</span> x, y <span class="kw">in</span> sloader:
    <span class="fn">print</span>(x.shape, <span class="fn">len</span>(y))
    <span class="kw">break</span>

<span class="cm"># 4) WeightedRandomSampler -- dengesizlik için azınlık sınıfları aşırı örnekle</span>
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> WeightedRandomSampler

<span class="cm"># ds'in sınıf dengesizliği olduğunu varsayın: %90 sınıf 0, %10 sınıf 1</span>
ds_imb = <span class="fn">ConcatDataset</span>([<span class="fn">Tiny</span>(label=<span class="num">0</span>)] * <span class="num">9</span> + [<span class="fn">Tiny</span>(label=<span class="num">1</span>)])
labels = torch.<span class="fn">cat</span>([torch.<span class="fn">zeros</span>(<span class="num">50</span>*<span class="num">9</span>, dtype=torch.long), torch.<span class="fn">ones</span>(<span class="num">50</span>)])
class_counts = torch.<span class="fn">bincount</span>(labels)
class_weights = <span class="num">1.0</span> / class_counts.<span class="fn">float</span>()
sample_weights = class_weights[labels]
sampler = <span class="fn">WeightedRandomSampler</span>(sample_weights, num_samples=<span class="fn">len</span>(labels), replacement=<span class="kw">True</span>)
balanced_loader = <span class="fn">DataLoader</span>(ds_imb, batch_size=<span class="num">32</span>, sampler=sampler)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Subset / ConcatDataset / IterableDataset kalıpları doğrudan pandas .iloc[mask], pd.concat ve itertools.chain'e karşılık gelir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import pandas as pd
from itertools import chain

# Subset via boolean mask -- equivalent of torch.utils.data.Subset
high_value = df_customers[df_customers['lifetime_value'] > df_customers['lifetime_value'].median()]
print('Subset rows:', len(high_value), '/', len(df_customers))

# ConcatDataset -- pd.concat
combined = pd.concat([df_reviews.head(50), df_tweets.head(50)], ignore_index=True)
print('ConcatDataset rows:', len(combined))

# IterableDataset = a generator
def stream_records(*dfs):
    for df in dfs:
        for _, row in df.iterrows():
            yield row.to_dict()

stream = stream_records(df_reviews.head(3), df_tweets.head(3))
for i, rec in enumerate(stream):
    print(f'  rec {i}: keys={list(rec.keys())[:3]}')</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>Subset</code>, ebeveynin yalnızca belirtilen indekslerini gösteren bir Dataset oluşturur -- indeksleri kendiniz hesapladığınız k-fold CV ve katmanlı bölmeler için ideal. 2) <code>ConcatDataset</code> birden fazla veri setini uçtan uca birleştirir; kendi verinizi kamu corpus'larıyla birleştirmek veya birden çok görevde eğitmek için mükemmel. 3) <code>IterableDataset</code> uzunluğu öngöremediğiniz veri akışları içindir: canlı yazılan log dosyaları, Kafka konuları, sonsuz augmente edilmiş örnekler. Her işçi <code>__iter__</code>'i bağımsız olarak çağırır, bu yüzden veri setinizi işçiler arasında işi parçalayacak şekilde tasarlayın (gelişmiş durumlarda <code>get_worker_info()</code> kullanın). 4) <code>WeightedRandomSampler</code> sınıf dengesizliğini yönetir: her örnek sınıf frekansıyla ters orantılı bir ağırlık alır, böylece loader nadir sınıfları aşırı örnekler. Bu, NLP'de dengesiz sınıflandırma için tek en kullanışlı hiledir -- veri setini elle dengelemekten çok daha basittir.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Map-stili Dataset</div><div class="compare-item"><code>__len__</code> ve <code>__getitem__</code> uygular</div><div class="compare-item">İndeksle rastgele erişim</div><div class="compare-item">DataLoader karıştırabilir, ağırlıklı örnekleyebilir</div><div class="compare-item">Zamanın %95'inde kullanın</div></div>
<div class="compare-col"><div class="compare-title">IterableDataset</div><div class="compare-item"><code>__iter__</code> uygular</div><div class="compare-item">Sıralı / akış erişim</div><div class="compare-item">Yerleşik karıştırma yok</div><div class="compare-item">Log akışları, sonsuz veri için kullanın</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Uçtan Uca: NLP Veri Boru Hattı</h2>

<p class="l-text">Her şeyi herhangi bir sınıflandırıcıya ekleyebileceğiniz tam bir boru hattına monte etme zamanı. Bu bir tokenizer, bir veri seti, akıllı bir collate ve bir ayıklama adımı içerir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> Dataset, DataLoader, random_split
<span class="kw">from</span> torch.nn.utils.rnn <span class="kw">import</span> pad_sequence

<span class="cm"># Adım 1: eğitim verisinden bir sözlük inşa et</span>
<span class="kw">def</span> <span class="fn">build_vocab</span>(texts, min_freq=<span class="num">2</span>):
    <span class="kw">from</span> collections <span class="kw">import</span> Counter
    counts = <span class="fn">Counter</span>()
    <span class="kw">for</span> t <span class="kw">in</span> texts:
        counts.<span class="fn">update</span>(t.<span class="fn">lower</span>().<span class="fn">split</span>())
    vocab = {<span class="str">"&lt;pad&gt;"</span>:<span class="num">0</span>, <span class="str">"&lt;unk&gt;"</span>:<span class="num">1</span>}
    <span class="kw">for</span> w, c <span class="kw">in</span> counts.<span class="fn">items</span>():
        <span class="kw">if</span> c &gt;= min_freq:
            vocab[w] = <span class="fn">len</span>(vocab)
    <span class="kw">return</span> vocab

<span class="cm"># Adım 2: anlık tokenizasyonlu Dataset</span>
<span class="kw">class</span> <span class="fn">IMDBDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, texts, labels, vocab, max_len=<span class="num">200</span>):
        self.texts = texts
        self.labels = labels
        self.vocab = vocab
        self.max_len = max_len
    <span class="kw">def</span> <span class="fn">__len__</span>(self):
        <span class="kw">return</span> <span class="fn">len</span>(self.texts)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, i):
        tokens = self.texts[i].<span class="fn">lower</span>().<span class="fn">split</span>()[: self.max_len]
        ids = [self.vocab.<span class="fn">get</span>(t, <span class="num">1</span>) <span class="kw">for</span> t <span class="kw">in</span> tokens]
        <span class="kw">return</span> {
            <span class="str">"input_ids"</span>: torch.<span class="fn">tensor</span>(ids, dtype=torch.long),
            <span class="str">"label"</span>:     torch.<span class="fn">tensor</span>(self.labels[i], dtype=torch.long),
        }

<span class="cm"># Adım 3: batch başına padleyen collate</span>
<span class="kw">def</span> <span class="fn">collate</span>(batch, pad_id=<span class="num">0</span>):
    ids = [b[<span class="str">"input_ids"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch]
    labels = torch.<span class="fn">stack</span>([b[<span class="str">"label"</span>] <span class="kw">for</span> b <span class="kw">in</span> batch])
    padded = <span class="fn">pad_sequence</span>(ids, batch_first=<span class="kw">True</span>, padding_value=pad_id)
    mask = (padded != pad_id).<span class="fn">long</span>()
    <span class="kw">return</span> {<span class="str">"input_ids"</span>: padded, <span class="str">"attention_mask"</span>: mask, <span class="str">"labels"</span>: labels}

<span class="cm"># Oyuncak veri</span>
texts = [
    <span class="str">"this movie was incredible and made me laugh"</span>,
    <span class="str">"absolutely awful waste of two hours"</span>,
    <span class="str">"great cinematography but a thin story"</span>,
    <span class="str">"boring beyond belief"</span>,
    <span class="str">"loved every minute of this gem"</span>,
    <span class="str">"predictable garbage"</span>,
    <span class="str">"moving and powerful performance"</span>,
    <span class="str">"skip this one"</span>,
] * <span class="num">5</span>
labels = [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>] * <span class="num">5</span>

vocab = <span class="fn">build_vocab</span>(texts, min_freq=<span class="num">1</span>)
<span class="fn">print</span>(f<span class="str">"sözlük boyutu: {len(vocab)}"</span>)

ds = <span class="fn">IMDBDataset</span>(texts, labels, vocab, max_len=<span class="num">20</span>)
gen = torch.<span class="fn">Generator</span>().<span class="fn">manual_seed</span>(<span class="num">0</span>)
train_ds, val_ds = <span class="fn">random_split</span>(ds, [<span class="num">0.8</span>, <span class="num">0.2</span>], generator=gen)

train_loader = <span class="fn">DataLoader</span>(train_ds, batch_size=<span class="num">4</span>, shuffle=<span class="kw">True</span>, collate_fn=collate)
val_loader   = <span class="fn">DataLoader</span>(val_ds,   batch_size=<span class="num">4</span>, shuffle=<span class="kw">False</span>, collate_fn=collate)

<span class="cm"># Adım 4: bir batch'i incele</span>
batch = <span class="fn">next</span>(<span class="fn">iter</span>(train_loader))
<span class="kw">for</span> k, v <span class="kw">in</span> batch.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">"{k:18s} shape={tuple(v.shape)} dtype={v.dtype}"</span>)
<span class="fn">print</span>(<span class="str">"attention_mask örnek:"</span>, batch[<span class="str">"attention_mask"</span>][<span class="num">0</span>].<span class="fn">tolist</span>())
<span class="fn">print</span>(<span class="str">"etiketler:"</span>, batch[<span class="str">"labels"</span>].<span class="fn">tolist</span>())</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Uçtan uca NLP veri boru hattı: tokenize -> vektörleştir -> böl -> eğit -- sklearn hepsini paketli şekilde yapar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score

texts  = df_reviews['review'].tolist()
labels = df_reviews['label'].values

pipe = Pipeline([
    ('vec', TfidfVectorizer(max_features=1500, ngram_range=(1, 2))),
    ('clf', LogisticRegression(max_iter=500)),
])
scores = cross_val_score(pipe, texts, labels, cv=3)
print('CV accuracies   :', scores.round(3))
print('mean CV accuracy:', scores.mean().round(3))</code></pre></div>
</div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Eğitim metinlerinde kelimeleri sayarak bir sözlük inşa eder, yalnızca <code>min_freq</code> üzerindekileri tutar; 0 ve 1 ID'lerini sırasıyla <code>&lt;pad&gt;</code> ve <code>&lt;unk&gt;</code>'ye atar. 2) <code>__getitem__</code>'de anlık tokenizasyonlu IMDB stili bir veri seti tanımlar -- bu küçük veri setleri için iyidir; büyükler için ID'leri bir kez önceden hesaplarsınız. 3) Değişken uzunluklu token listelerini batch içindeki maks uzunluğa padleyen, padding olmayan pozisyonlardan dikkat maskesi inşa eden ve etiketleri yığan bir <code>collate</code> yazar. 4) Oyuncak veri oluşturur, eğitim/doğrulama olarak %80/20'ye böler, her birini özel collate ile DataLoader'a sarar. 5) Şekilleri doğrulamak için bir batch'i inceler -- tam olarak bölüm 6'daki ayıklama rutini. Bu iskele ile Ders 3'ten gerçek bir model takmak önemsizdir: ileri geçiş <code>input_ids</code> ve <code>attention_mask</code> alır, logit döner ve kayıp <code>labels</code>'a göre hesaplanır.</p>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Bir <code>Dataset</code>, <code>__len__</code> ve <code>__getitem__</code> tanımlar; bir <code>DataLoader</code> onu batch'leme, karıştırma, paralelizmle sarar.<br><strong>2.</strong> NLP için <code>__getitem__</code>'de PADLEMEYIN. <code>pad_sequence</code> kullanan özel bir <code>collate_fn</code> ile batch başına padleyin.<br><strong>3.</strong> Aşağı akış katmanları padding'i yok sayabilsin diye padlenmiş ID'lerin yanında her zaman bir <code>attention_mask</code> inşa edin.<br><strong>4.</strong> PyTorch, NumPy, Python'un <code>random</code>'u için tohumları ayarlayın ve işçileri tohumlamak için <code>worker_init_fn</code> kullanın; yeniden üretilebilir bölmeler için <code>random_split</code>'e bir <code>Generator</code> geçirin.<br><strong>5.</strong> GPU eğitimi için <code>num_workers=4-8</code> ve <code>pin_memory=True</code> kullanın. Ayarlamadan önce benchmark yapın.<br><strong>6.</strong> Loader'ı kurar kurmaz bir batch'i inceleyin: şekiller, dtype'lar, cihazlar ve birkaç değer çoğu hatayı anında yakalar.<br><strong>7.</strong> <code>Subset</code>, <code>ConcatDataset</code>, <code>WeightedRandomSampler</code>, <code>IterableDataset</code> gerçek projelerde başvurduğunuz küçük hayvanat bahçesidir.<br><strong>8.</strong> Sonraki ders: bu boru hattının önüne gerçek bir kayıp ve optimizer takın ve tam eğitim döngüsünü çalıştırın.</div></div>
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

  function thrPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var workers = [0, 1, 2, 4, 8, 16, 32];
    var bps = [5, 9, 17, 32, 50, 48, 38];
    var trace = {x: workers, y: bps, mode:'lines+markers', type:'scatter',
                 line:{color:T.accent, width:3}, marker:{size:10, color:T.accent}};
    var layout = Object.assign({}, common, {
      title:{text: lang === 'tr' ? 'DataLoader Verim: num_workers' : 'DataLoader Throughput vs num_workers', font:{color:T.text,size:14}},
      xaxis:{title:'num_workers', gridcolor:T.grid, zerolinecolor:T.zero, dtick:4},
      yaxis:{title: lang==='tr'?'batch / saniye':'batches / sec', gridcolor:T.grid, zerolinecolor:T.zero}
    });
    Plotly.newPlot(id, [trace], layout, {responsive:true, displayModeBar:false});
  }

  thrPlot('plot-pl4-throughput-en', 'en');
  thrPlot('plot-pl4-throughput-tr', 'tr');
}, 250);</script>
`
};
