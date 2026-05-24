window.PYTORCH_L8 = {

en: `<p class="l-text"><strong>Embeddings turn discrete tokens into dense vectors that neural networks can actually learn from.</strong> Without embeddings, a network sees only integer IDs that have no meaningful similarity to each other -- "cat" (id 4521) and "kitten" (id 9938) look as different from each other as "cat" and "Trump". With embeddings, similar words land in similar regions of a 300-dimensional space, and the entire downstream model benefits from this geometric structure.</p>

<p class="l-text">This lesson covers <code>nn.Embedding</code> as a learnable lookup table, subword tokenization (BPE, WordPiece), positional embeddings for transformers, and the practical patterns for loading pretrained embeddings and freezing them. By the end you will be fluent in the embedding plumbing that powers every modern NLP model.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Use <code>nn.Embedding</code> as a learnable lookup from token IDs to dense vectors</li>
<li>Compare one-hot vs dense embeddings on parameter count and geometry</li>
<li>Tokenize text with BPE and WordPiece and reason about subword vocab size</li>
<li>Implement sinusoidal and learned positional embeddings for transformer inputs</li>
<li>Load pretrained GloVe / fastText vectors into <code>nn.Embedding.from_pretrained</code></li>
<li>Freeze and unfreeze embedding weights with <code>requires_grad</code> for transfer learning</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Embeddings? The One-Hot Problem</h2>

<p class="l-text">A token ID like 4521 is meaningless to a neural network. The network needs a vector. The naive option is one-hot: a vector of length |vocab| with a 1 at position 4521 and 0 elsewhere. This is awful for two reasons: it is huge (vocab can be 30k-50k entries) and it is geometrically useless (every pair of words is at distance sqrt(2)).</p>

<div class="calc-highlight"><strong>An embedding is a learnable map from token IDs to dense low-dimensional vectors.</strong> Vocab size 50000, embedding dim 300, total parameters: 15M -- much smaller than 50000-dim one-hot vectors, and the geometry can encode meaning (cat ≈ kitten, king - man + woman ≈ queen).</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Token ID</div><div class="card-body">Integer in [0, V). E.g. id 4521 might mean "cat". Comes from your tokenizer.</div></div>
<div class="calc-card"><div class="card-title">Embedding vector</div><div class="card-body">Dense float vector of fixed dim D (e.g. 128, 300, 768).</div></div>
<div class="calc-card"><div class="card-title">Embedding matrix</div><div class="card-body">Shape (V, D). Each row is the embedding for the corresponding token ID.</div></div>
<div class="calc-card"><div class="card-title">Lookup</div><div class="card-body">Indexing the matrix with the token ID -- equivalent to one-hot @ matrix but much faster.</div></div>
<div class="calc-card"><div class="card-title">Trainable</div><div class="card-body">Embeddings are parameters; they update like any other weight via backprop.</div></div>
<div class="calc-card"><div class="card-title">Geometry</div><div class="card-body">Trained embeddings cluster semantically. Cosine similarity of cat and kitten is large; cat and Trump is small.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: word2vec analogies</div><div class="example-body">After training word embeddings on a large corpus, you observe striking analogies: <code>vec("king") - vec("man") + vec("woman") ≈ vec("queen")</code>. The embedding learned that "royalty" and "gender" exist as roughly orthogonal directions. Similar effects: capital cities, verb conjugations, country/currency pairs. This emergent structure is why embeddings revolutionized NLP in 2013.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. nn.Embedding: the Lookup Table</h2>

<p class="l-text"><code>nn.Embedding</code> is a Module that wraps a learnable matrix and gives you a clean lookup interface. Internally it is a simple <code>torch.gather</code> on the rows.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

V, D = <span class="num">10000</span>, <span class="num">64</span>           <span class="cm"># vocab=10000, embed_dim=64</span>
embed = nn.<span class="fn">Embedding</span>(num_embeddings=V, embedding_dim=D, padding_idx=<span class="num">0</span>)
<span class="fn">print</span>(embed.weight.shape)  <span class="cm"># torch.Size([10000, 64])</span>

<span class="cm"># Single token</span>
ids = torch.<span class="fn">tensor</span>([<span class="num">42</span>])
<span class="fn">print</span>(<span class="fn">embed</span>(ids).shape)    <span class="cm"># (1, 64)</span>

<span class="cm"># Batch of sequences</span>
ids = torch.<span class="fn">tensor</span>([[<span class="num">1</span>, <span class="num">5</span>, <span class="num">9</span>, <span class="num">0</span>, <span class="num">0</span>],
                    [<span class="num">3</span>, <span class="num">7</span>, <span class="num">2</span>, <span class="num">4</span>, <span class="num">6</span>]])
emb = <span class="fn">embed</span>(ids)
<span class="fn">print</span>(emb.shape)           <span class="cm"># (2, 5, 64)</span>

<span class="cm"># padding_idx=0 means row 0 is fixed at zero and not updated by gradients</span>
<span class="fn">print</span>(embed.weight[<span class="num">0</span>])     <span class="cm"># all zeros</span>

<span class="cm"># Equivalent to one-hot @ weight, but vastly cheaper</span>
oh = torch.<span class="fn">zeros</span>(<span class="num">2</span>, <span class="num">5</span>, V)
oh.<span class="fn">scatter_</span>(<span class="num">2</span>, ids.<span class="fn">unsqueeze</span>(-<span class="num">1</span>), <span class="num">1.0</span>)
emb_via_onehot = oh @ embed.weight
<span class="fn">print</span>(torch.<span class="fn">allclose</span>(emb, emb_via_onehot, atol=<span class="num">1e-6</span>))   <span class="cm"># True</span>

<span class="cm"># Free initialization with normal/uniform</span>
nn.init.<span class="fn">normal_</span>(embed.weight, mean=<span class="num">0.0</span>, std=<span class="num">0.02</span>)       <span class="cm"># transformer style</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">An embedding layer = lookup into a (vocab x dim) matrix. We build it from scratch with NumPy: it's just integer-indexed rows.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
vocab_size = 20
embed_dim  = 8

# Embedding table -- the only learnable parameter
emb_table = rng.standard_normal((vocab_size, embed_dim)) * 0.1

# Tokenized batch (2 sentences of length 5)
token_ids = np.array([
    [1, 5, 9, 0, 0],
    [4, 7, 2, 11, 6],
])

# Lookup is just fancy indexing
embeddings = emb_table[token_ids]
print('table shape    :', emb_table.shape)
print('token_ids shape:', token_ids.shape)
print('embeddings shape:', embeddings.shape, '  (batch, seq, dim)')
print('embedding of token 5 (sample):', emb_table[5].round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a 10000x64 embedding table; <code>padding_idx=0</code> tells PyTorch that row 0 is the padding token's embedding, fixed at zero and not updated during training. 2) Indexing the embedding with a single token ID returns a (1, D) tensor. 3) Indexing with a 2D tensor returns a 3D tensor: <code>(B, T) -> (B, T, D)</code>. This is THE forward pass of every NLP embedding layer. 4) Confirms that the result equals one-hot times the weight matrix; <code>nn.Embedding</code> is just a fast implementation of that math. 5) Custom initialization: transformers typically use normal(0, 0.02), word2vec uses uniform(-0.5/D, 0.5/D). The right choice depends on the architecture.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">num_embeddings</div><div class="card-body">Vocabulary size V. Must be at least max_token_id + 1.</div></div>
<div class="calc-card"><div class="card-title">embedding_dim</div><div class="card-body">Output vector dim D. Common: 100-300 for word2vec, 768 for BERT-base, 1024+ for big transformers.</div></div>
<div class="calc-card"><div class="card-title">padding_idx</div><div class="card-body">Index whose row is fixed at zeros and excluded from gradient updates. Standard pattern: 0.</div></div>
<div class="calc-card"><div class="card-title">max_norm</div><div class="card-body">Optional: rescales each row to L2 norm at most max_norm. Used to keep embeddings bounded.</div></div>
<div class="calc-card"><div class="card-title">sparse=True</div><div class="card-body">Sparse gradients for huge vocabularies. Requires sparse-compatible optimizer (SparseAdam).</div></div>
<div class="calc-card"><div class="card-title">freeze=False</div><div class="card-body">Default: trainable. Set <code>weight.requires_grad = False</code> to freeze (e.g. with pretrained GloVe).</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Loading Pretrained Embeddings</h2>

<p class="l-text">Pretrained word embeddings (GloVe, FastText, word2vec) are matrices of word -> vector trained on huge corpora. Loading them as the initial weights of <code>nn.Embedding</code> gives you the geometric structure for free, before you have trained on a single sample of your task.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) Build word -&gt; vector dict from a GloVe file (illustrative)</span>
<span class="kw">def</span> <span class="fn">load_glove</span>(path, dim=<span class="num">300</span>):
    word2vec = {}
    <span class="cm"># with open(path, "r", encoding="utf-8") as f:</span>
    <span class="cm">#     for line in f:</span>
    <span class="cm">#         parts = line.rstrip().split(" ")</span>
    <span class="cm">#         word = parts[0]</span>
    <span class="cm">#         vec = np.array(parts[1:], dtype=np.float32)</span>
    <span class="cm">#         word2vec[word] = vec</span>
    <span class="cm"># For demo, we generate random "pretrained" vectors</span>
    words = [<span class="str">"&lt;pad&gt;"</span>,<span class="str">"&lt;unk&gt;"</span>,<span class="str">"cat"</span>,<span class="str">"dog"</span>,<span class="str">"king"</span>,<span class="str">"queen"</span>,<span class="str">"run"</span>,<span class="str">"jump"</span>]
    word2vec = {w: np.random.<span class="fn">randn</span>(dim).<span class="fn">astype</span>(np.float32) <span class="kw">for</span> w <span class="kw">in</span> words}
    <span class="kw">return</span> word2vec

<span class="cm"># 2) Build vocab and embedding matrix aligned to your tokenizer</span>
glove = <span class="fn">load_glove</span>(path=<span class="kw">None</span>, dim=<span class="num">300</span>)
vocab = {w: i <span class="kw">for</span> i, w <span class="kw">in</span> <span class="fn">enumerate</span>(glove.<span class="fn">keys</span>())}
V, D = <span class="fn">len</span>(vocab), <span class="num">300</span>

<span class="cm"># Initialize an empty matrix</span>
weight = np.<span class="fn">zeros</span>((V, D), dtype=np.float32)
<span class="kw">for</span> w, idx <span class="kw">in</span> vocab.<span class="fn">items</span>():
    <span class="kw">if</span> w <span class="kw">in</span> glove:
        weight[idx] = glove[w]
    <span class="kw">else</span>:
        <span class="cm"># OOV: small random init</span>
        weight[idx] = np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, D).<span class="fn">astype</span>(np.float32)

<span class="cm"># 3) Load into nn.Embedding</span>
emb = nn.<span class="fn">Embedding</span>(V, D, padding_idx=vocab[<span class="str">"&lt;pad&gt;"</span>])
emb.weight.data.<span class="fn">copy_</span>(torch.<span class="fn">from_numpy</span>(weight))

<span class="cm"># 4) Optionally freeze the embedding (no gradient updates during training)</span>
emb.weight.requires_grad = <span class="kw">False</span>
<span class="cm"># To unfreeze later (fine-tuning the embeddings):</span>
<span class="cm"># emb.weight.requires_grad = True</span>

<span class="cm"># 5) Or use the convenience constructor</span>
emb2 = nn.Embedding.<span class="fn">from_pretrained</span>(torch.<span class="fn">from_numpy</span>(weight),
                                    freeze=<span class="kw">True</span>,
                                    padding_idx=vocab[<span class="str">"&lt;pad&gt;"</span>])
<span class="fn">print</span>(emb2.weight.requires_grad)   <span class="cm"># False because freeze=True</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pretrained embeddings are typically loaded as a NumPy matrix and then either frozen or fine-tuned. Same idea -- we load a small fake glove-like file.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Simulate a tiny pretrained glove with 6 known words
pretrained = {
    'good':    np.array([0.5, 0.2, -0.1, 0.3]),
    'bad':     np.array([-0.5, -0.2, 0.1, -0.3]),
    'great':   np.array([0.6, 0.3, -0.2, 0.4]),
    'awful':   np.array([-0.6, -0.3, 0.2, -0.4]),
    'movie':   np.array([0.0, 0.5, 0.5, 0.1]),
    'film':    np.array([0.0, 0.5, 0.4, 0.1]),
}
vocab = ['<unk>'] + sorted(pretrained.keys())
emb_dim = 4
mat = np.random.default_rng(0).standard_normal((len(vocab), emb_dim)) * 0.05
for i, w in enumerate(vocab):
    if w in pretrained:
        mat[i] = pretrained[w]

# Sanity: 'good' and 'great' should be near; 'good' and 'bad' should be far.
def cos(a, b): return float(a @ b / (np.linalg.norm(a)*np.linalg.norm(b) + 1e-9))
i = {w: vocab.index(w) for w in pretrained}
print(f'cos(good, great) = {cos(mat[i["good"]], mat[i["great"]]):.3f}')
print(f'cos(good, bad)   = {cos(mat[i["good"]], mat[i["bad"]]):.3f}')
print(f'cos(movie, film) = {cos(mat[i["movie"]], mat[i["film"]]):.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>load_glove</code> reads a GloVe text file format (word followed by D float values per line). For real use you would uncomment the file-reading lines; here we generate random vectors for demo. 2) Builds a vocab from the loaded words and creates a numpy matrix of shape (V, D). For each word in your vocab, copy the corresponding pretrained vector; for words not in the pretrained set (OOV) initialize with small random noise rather than zero. 3) Creates an <code>nn.Embedding</code> module and copies the numpy matrix into its weight tensor with <code>data.copy_</code>. 4) Setting <code>requires_grad = False</code> freezes the embeddings -- gradients flow through the embedding layer to update downstream parameters but the embedding matrix itself does not change. This is useful when your task data is small and the pretrained vectors already encode meaningful structure. 5) <code>from_pretrained</code> is the one-liner equivalent of the manual approach.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: typical fine-tuning recipe</div><div class="example-body">For a sentiment classifier on 10k labeled tweets: load GloVe-300 as embeddings, freeze them for the first 3 epochs while the LSTM and classifier learn, then unfreeze with a 10x smaller learning rate for the embeddings for the next 5 epochs to gently adapt them to your domain. This recipe consistently beats both training from scratch (overfit on small data) and freezing forever (cannot adapt to domain).</div></div>

<div class="l-warn"><strong>Pitfall:</strong> Vocab alignment. Your tokenizer's word -&gt; id mapping must match the order you copied vectors into the matrix. Off-by-one alignment is silent and catastrophic. Always test by checking that <code>emb.weight[vocab["cat"]]</code> is close to the GloVe vector for "cat".</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Subword Tokenization: BPE and WordPiece</h2>

<p class="l-text">Word-level vocabularies have two big problems: huge size (millions of unique words) and out-of-vocabulary failures on misspellings, neologisms, names. Modern NLP uses <em>subword</em> tokenization: build a fixed vocab of common character sequences, then split rare words into multiple subword tokens.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">BPE (Byte-Pair Encoding)</div><div class="card-body">Start from characters; iteratively merge the most frequent pair. Used in GPT-2/3, RoBERTa.</div></div>
<div class="calc-card"><div class="card-title">WordPiece</div><div class="card-body">Like BPE but merges by likelihood. Used in BERT. Subwords inside a word marked with ##.</div></div>
<div class="calc-card"><div class="card-title">SentencePiece</div><div class="card-body">Language-agnostic; treats input as raw bytes. Used in T5, ALBERT, mT5.</div></div>
<div class="calc-card"><div class="card-title">Unigram</div><div class="card-body">Probabilistic; keeps best-scoring subword segmentation. Used in some SentencePiece configs.</div></div>
<div class="calc-card"><div class="card-title">Vocab size</div><div class="card-body">Typical: 30k-50k tokens for monolingual, 100k-250k for multilingual.</div></div>
<div class="calc-card"><div class="card-title">No more OOV</div><div class="card-body">Any word can be split into known subwords (worst case, into characters).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Use HuggingFace tokenizers (production-grade)</span>
<span class="cm"># pip install transformers</span>
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer

tok = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>)

text = <span class="str">"Tokenization handles unsupercalifragilistic words gracefully."</span>
out = <span class="fn">tok</span>(text, return_tensors=<span class="str">"pt"</span>)
<span class="fn">print</span>(out[<span class="str">"input_ids"</span>].shape)        <span class="cm"># (1, T)</span>
<span class="fn">print</span>(tok.<span class="fn">convert_ids_to_tokens</span>(out[<span class="str">"input_ids"</span>][<span class="num">0</span>]))
<span class="cm"># ['[CLS]', 'token', '##ization', 'handles', 'unsup', '##er', '##cal', '##ifr', '##agi', '##list', '##ic', 'words', 'graceful', '##ly', '.', '[SEP]']</span>

<span class="cm"># Notice: "unsupercalifragilistic" -&gt; many subwords with ## prefix</span>
<span class="cm"># "tokenization" -&gt; "token" + "##ization"</span>
<span class="cm"># These are exactly the inputs your transformer's nn.Embedding consumes</span>

<span class="cm"># A BERT-base embedding lookup is just:</span>
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
embed = nn.<span class="fn">Embedding</span>(num_embeddings=tok.vocab_size, embedding_dim=<span class="num">768</span>, padding_idx=tok.pad_token_id)
emb_vecs = <span class="fn">embed</span>(out[<span class="str">"input_ids"</span>])    <span class="cm"># (1, T, 768)</span>
<span class="fn">print</span>(emb_vecs.shape)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Subword tokenization: we hand-build a tiny BPE-like merger. The principle: count adjacent-pair frequencies, merge the most common one, repeat.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re
from collections import Counter

corpus = ['low low low low low',
          'lower lower newest newest',
          'newest newest widest widest']

# Start: split into characters with end-of-word marker
def tokenize(text):
    return [list(w) + ['</w>'] for w in text.split()]

tokens = []
for line in corpus:
    tokens.extend(tokenize(line))

def get_pairs(tokens):
    pairs = Counter()
    for word in tokens:
        for i in range(len(word) - 1):
            pairs[(word[i], word[i+1])] += 1
    return pairs

def merge(tokens, pair):
    a, b = pair
    new_tokens = []
    for word in tokens:
        new_word = []
        i = 0
        while i < len(word):
            if i < len(word)-1 and word[i] == a and word[i+1] == b:
                new_word.append(a + b); i += 2
            else:
                new_word.append(word[i]); i += 1
        new_tokens.append(new_word)
    return new_tokens

for step in range(4):
    pairs = get_pairs(tokens)
    best, _ = pairs.most_common(1)[0]
    tokens = merge(tokens, best)
    print(f'merge {step+1}: joined {best!r}')
print('final vocabulary tokens (sample):', tokens[0])</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads a pretrained BERT tokenizer from HuggingFace -- the actual one used by every BERT-based model in production. 2) Tokenizes a sentence; the output dict contains input_ids and attention_mask tensors ready to feed to a model. 3) Converts back to readable tokens to inspect the segmentation: "tokenization" splits into "token" + "##ization" where the "##" prefix marks subword continuation. The made-up word "unsupercalifragilistic" splits into 7 subwords. 4) Even unseen words can always be encoded as a sequence of known subwords, eliminating the OOV problem entirely. 5) The transformer's <code>nn.Embedding</code> simply looks up the rows for these subword IDs -- no special handling needed for subwords vs whole words; the embedding matrix encodes both.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: why subwords help</div><div class="example-body">Consider "running" and "runner". Word-level: distinct, no shared parameters. BPE: split as "run" + "##ning" and "run" + "##ner". The shared "run" embedding now learns shared morphology -- gradients from both words update the same vector. The model learns that "run" is a common stem and the suffixes vary, achieving better generalization with smaller vocab.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Positional Embeddings</h2>

<p class="l-text">Word embeddings encode <em>what</em> a token is. They say nothing about <em>where</em> it appears. RNNs and CNNs see position implicitly through their architecture; transformers do not -- attention is order-invariant. So transformers add a positional embedding to each token's word embedding.</p>

<div class="katex-block">$$\\text{PE}_{(pos, 2i)} = \\sin\\!\\left(\\frac{pos}{10000^{2i/d}}\\right), \\quad \\text{PE}_{(pos, 2i+1)} = \\cos\\!\\left(\\frac{pos}{10000^{2i/d}}\\right)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">pos</div><div class="card-body">Position in the sequence (0, 1, 2, ...).</div></div>
<div class="calc-card"><div class="card-title">i</div><div class="card-body">Dimension index in the embedding (0 to d/2-1).</div></div>
<div class="calc-card"><div class="card-title">d</div><div class="card-body">Embedding dimension. The same dim as the token embedding.</div></div>
<div class="calc-card"><div class="card-title">10000</div><div class="card-body">A constant that controls wavelength; spans low to very high frequencies across dims.</div></div>
<div class="calc-card"><div class="card-title">sin/cos</div><div class="card-body">Even dims use sin, odd use cos. Together they form a smooth, position-distinguishing pattern.</div></div>
<div class="calc-card"><div class="card-title">Add, not concat</div><div class="card-body">Position embedding is ADDED elementwise to the token embedding. Same shape (B, T, D).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> math

<span class="cm"># 1) Sinusoidal (fixed, no parameters) -- original Transformer</span>
<span class="kw">class</span> <span class="fn">SinusoidalPE</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d_model, max_len=<span class="num">5000</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        pe = torch.<span class="fn">zeros</span>(max_len, d_model)
        pos = torch.<span class="fn">arange</span>(max_len).<span class="fn">unsqueeze</span>(<span class="num">1</span>).<span class="fn">float</span>()        <span class="cm"># (T, 1)</span>
        div = torch.<span class="fn">exp</span>(torch.<span class="fn">arange</span>(<span class="num">0</span>, d_model, <span class="num">2</span>).<span class="fn">float</span>() *
                        -(math.<span class="fn">log</span>(<span class="num">10000.0</span>) / d_model))         <span class="cm"># (D/2,)</span>
        pe[:, <span class="num">0</span>::<span class="num">2</span>] = torch.<span class="fn">sin</span>(pos * div)
        pe[:, <span class="num">1</span>::<span class="num">2</span>] = torch.<span class="fn">cos</span>(pos * div)
        self.<span class="fn">register_buffer</span>(<span class="str">"pe"</span>, pe.<span class="fn">unsqueeze</span>(<span class="num">0</span>))             <span class="cm"># (1, max_len, D)</span>

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="cm"># x: (B, T, D)</span>
        <span class="kw">return</span> x + self.pe[:, : x.<span class="fn">size</span>(<span class="num">1</span>), :]

<span class="cm"># 2) Learned positional embedding (BERT, GPT) -- a separate nn.Embedding</span>
<span class="kw">class</span> <span class="fn">LearnedPE</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, max_len, d_model):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.pos_embed = nn.<span class="fn">Embedding</span>(max_len, d_model)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        B, T, D = x.shape
        positions = torch.<span class="fn">arange</span>(T, device=x.device).<span class="fn">unsqueeze</span>(<span class="num">0</span>).<span class="fn">expand</span>(B, T)
        <span class="kw">return</span> x + self.<span class="fn">pos_embed</span>(positions)

<span class="cm"># Combine: real transformer embedding stack</span>
<span class="kw">class</span> <span class="fn">TransformerEmbed</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, d_model, max_len=<span class="num">512</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.token = nn.<span class="fn">Embedding</span>(vocab_size, d_model, padding_idx=<span class="num">0</span>)
        self.pos = <span class="fn">LearnedPE</span>(max_len, d_model)
        self.ln = nn.<span class="fn">LayerNorm</span>(d_model)
        self.drop = nn.<span class="fn">Dropout</span>(<span class="num">0.1</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        x = self.<span class="fn">token</span>(ids)         <span class="cm"># (B, T, D)</span>
        x = self.<span class="fn">pos</span>(x)             <span class="cm"># add learned position info</span>
        <span class="kw">return</span> self.<span class="fn">drop</span>(self.<span class="fn">ln</span>(x))

m = <span class="fn">TransformerEmbed</span>(vocab_size=<span class="num">30000</span>, d_model=<span class="num">128</span>)
ids = torch.<span class="fn">randint</span>(<span class="num">1</span>, <span class="num">30000</span>, (<span class="num">2</span>, <span class="num">64</span>))
out = <span class="fn">m</span>(ids)
<span class="fn">print</span>(out.shape)                    <span class="cm"># (2, 64, 128)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Positional embeddings = a separate (max_len x dim) matrix added to token embeddings. Sinusoidal version is a fixed (no-grad) lookup.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def sinusoidal_pos_enc(max_len, d_model):
    pos = np.arange(max_len)[:, None]
    i   = np.arange(d_model)[None, :]
    angle_rates = 1 / np.power(10000, (2 * (i // 2)) / d_model)
    angle_rads  = pos * angle_rates
    pe = np.zeros((max_len, d_model))
    pe[:, 0::2] = np.sin(angle_rads[:, 0::2])
    pe[:, 1::2] = np.cos(angle_rads[:, 1::2])
    return pe

pe = sinusoidal_pos_enc(max_len=12, d_model=8)
print('positional encoding shape:', pe.shape)
print('first 4 positions:\n', pe[:4].round(3))
# Adjacent positions should be similar; far positions less so.
def cos(a, b): return float(a @ b / (np.linalg.norm(a)*np.linalg.norm(b)))
print('cos(pos0, pos1) :', round(cos(pe[0], pe[1]), 3))
print('cos(pos0, pos11):', round(cos(pe[0], pe[11]), 3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Implements sinusoidal positional encoding from the original Transformer paper. The pattern is fixed: each dimension oscillates at a different frequency, so each position has a unique combination of sin/cos values. We register it as a buffer because it is not learnable but should move with the model to GPU. 2) Forward adds the position encoding to the token embedding -- same shape, elementwise add. 3) Implements learned positional embeddings used by BERT and GPT: just another <code>nn.Embedding</code> indexed by integer position. The model learns whatever positional pattern is most useful. 4) Combines token embedding + position + LayerNorm + Dropout, the canonical transformer input stack. This is roughly the first three lines of any HuggingFace transformer's <code>forward</code>. 5) The output is what flows into the first attention layer.</p>

<div id="plot-pl8-pe-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Sinusoidal positional encoding values for the first 64 dimensions across positions 0-99. Low-index dimensions oscillate slowly (long wavelengths), high-index dimensions oscillate fast (short wavelengths). This multi-scale structure makes every position uniquely identifiable while preserving similarity between nearby positions -- the core property attention needs to distinguish word order.</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Sinusoidal</div><div class="compare-item">Fixed, no parameters</div><div class="compare-item">Generalizes to longer sequences than seen</div><div class="compare-item">Original Transformer (Vaswani 2017)</div><div class="compare-item">No memory cost</div></div>
<div class="compare-col"><div class="compare-title">Learned</div><div class="compare-item">Learnable, max_len * d_model parameters</div><div class="compare-item">Cannot extrapolate beyond max_len</div><div class="compare-item">BERT, GPT-2, most modern transformers</div><div class="compare-item">Often slightly higher accuracy</div></div>
</div>

<div class="l-note"><strong>Modern alternatives:</strong> Rotary Position Embedding (RoPE) used in LLaMA and many recent models multiplies the query and key vectors by rotations whose angle depends on position. ALiBi adds a per-head distance-dependent bias. Both extrapolate to longer sequences than learned PE.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Visualizing Embedding Geometry</h2>

<p class="l-text">After training, you can project embeddings to 2D with PCA or t-SNE and see the semantic clustering. This is a quick visual sanity check that your embeddings are doing something useful.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Suppose we have a trained embedding matrix</span>
<span class="cm"># (in practice, after training a sentiment classifier or a language model)</span>
torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)
emb = nn.<span class="fn">Embedding</span>(<span class="num">30</span>, <span class="num">64</span>)
nn.init.<span class="fn">normal_</span>(emb.weight, std=<span class="num">0.5</span>)

<span class="cm"># Words in our vocab (illustrative)</span>
words = [<span class="str">"king"</span>, <span class="str">"queen"</span>, <span class="str">"prince"</span>, <span class="str">"princess"</span>,
         <span class="str">"cat"</span>, <span class="str">"dog"</span>, <span class="str">"fish"</span>, <span class="str">"bird"</span>,
         <span class="str">"happy"</span>, <span class="str">"joyful"</span>, <span class="str">"sad"</span>, <span class="str">"miserable"</span>,
         <span class="str">"run"</span>, <span class="str">"walk"</span>, <span class="str">"jump"</span>, <span class="str">"swim"</span>,
         <span class="str">"1"</span>, <span class="str">"2"</span>, <span class="str">"3"</span>, <span class="str">"4"</span>,
         <span class="str">"Paris"</span>, <span class="str">"Berlin"</span>, <span class="str">"London"</span>, <span class="str">"Tokyo"</span>,
         <span class="str">"apple"</span>, <span class="str">"banana"</span>, <span class="str">"orange"</span>, <span class="str">"grape"</span>,
         <span class="str">"&lt;pad&gt;"</span>, <span class="str">"&lt;unk&gt;"</span>]

<span class="cm"># Project to 2D with PCA</span>
W = emb.weight.<span class="fn">detach</span>().<span class="fn">numpy</span>()                    <span class="cm"># (30, 64)</span>
W_centered = W - W.<span class="fn">mean</span>(axis=<span class="num">0</span>, keepdims=<span class="kw">True</span>)
<span class="kw">import</span> numpy <span class="kw">as</span> np
U, S, Vt = np.linalg.<span class="fn">svd</span>(W_centered, full_matrices=<span class="kw">False</span>)
W_2d = U[:, :<span class="num">2</span>] * S[:<span class="num">2</span>]
<span class="fn">print</span>(W_2d.shape)                                  <span class="cm"># (30, 2)</span>

<span class="cm"># In a real notebook you would plot W_2d as a scatter with word labels</span>
<span class="cm"># After training on real data, semantically similar words cluster together</span>
<span class="cm"># Here the clustering is random because we have not trained anything</span>

<span class="cm"># Cosine similarity between two words</span>
<span class="kw">def</span> <span class="fn">cos_sim</span>(v1, v2):
    <span class="kw">return</span> <span class="fn">float</span>(v1 @ v2 / (v1.<span class="fn">norm</span>() * v2.<span class="fn">norm</span>()))

i_king, i_queen = words.<span class="fn">index</span>(<span class="str">"king"</span>), words.<span class="fn">index</span>(<span class="str">"queen"</span>)
v_king = emb.weight[i_king]; v_queen = emb.weight[i_queen]
<span class="fn">print</span>(f<span class="str">"sim(king, queen) = {cos_sim(v_king, v_queen):+.3f}"</span>)
<span class="cm"># Random init: ~0; trained on real text: large positive</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Visualize embedding geometry by reducing a learned matrix to 2D with PCA -- semantic similarity becomes visual proximity.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.decomposition import PCA
from sklearn.feature_extraction.text import TfidfVectorizer

# Learn TF-IDF "embeddings" for review words then PCA project
vec = TfidfVectorizer(max_features=80, stop_words='english')
mat = vec.fit_transform(df_reviews['review']).T.toarray()  # (vocab, docs)
words = vec.get_feature_names_out()

pca = PCA(n_components=2)
coords = pca.fit_transform(mat)
print('shape after PCA:', coords.shape)
print('sample positions:')
for w, (x, y) in list(zip(words, coords))[:8]:
    print(f'  {w:15s} -> ({x:+.3f}, {y:+.3f})')
print('explained variance:', pca.explained_variance_ratio_.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a small embedding matrix and initializes it; in real use this would be the embedding layer of a trained model. 2) Lists 30 illustrative words spanning royalty, animals, emotions, verbs, numbers, cities, fruits, and special tokens. 3) Computes 2D PCA via SVD. After training on real data, you would see royalty words clustering together, animal words elsewhere, numbers in a separate region. With random init, points scatter randomly. 4) Cosine similarity is the standard metric for embedding closeness; it is invariant to vector magnitude and ranges in [-1, 1]. After training, sim(king, queen) is typically large; sim(king, banana) is near zero.</p>

<div id="plot-pl8-pca-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A 2D PCA projection of trained word embeddings. Clusters emerge: royalty (king, queen, prince, princess) in one region, animals in another, cities together, numbers grouped. This kind of self-organized geometry is what makes embeddings powerful -- the network has learned a meaningful coordinate system from raw text alone. The pattern also reveals biases (e.g. gender / occupation associations) which can transfer downstream.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. EmbeddingBag and Other Tricks</h2>

<p class="l-text">A few specialized embedding patterns are worth knowing for performance.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># 1) EmbeddingBag: lookup + sum/mean in one fused op</span>
<span class="cm"># Useful for bag-of-words style classifiers (FastText)</span>
emb_bag = nn.<span class="fn">EmbeddingBag</span>(num_embeddings=<span class="num">10000</span>, embedding_dim=<span class="num">64</span>, mode=<span class="str">"mean"</span>)
<span class="cm"># Variable-length input via "offsets"</span>
input_ids = torch.<span class="fn">tensor</span>([<span class="num">3</span>, <span class="num">5</span>, <span class="num">7</span>, <span class="num">11</span>, <span class="num">13</span>, <span class="num">17</span>, <span class="num">19</span>])    <span class="cm"># flat</span>
offsets = torch.<span class="fn">tensor</span>([<span class="num">0</span>, <span class="num">3</span>, <span class="num">5</span>])                       <span class="cm"># bag boundaries</span>
out = <span class="fn">emb_bag</span>(input_ids, offsets)
<span class="fn">print</span>(out.shape)                                        <span class="cm"># (3, 64) -- 3 bags</span>
<span class="cm"># bag 0 averages embeddings of [3, 5, 7]</span>
<span class="cm"># bag 1 averages [11, 13]</span>
<span class="cm"># bag 2 averages [17, 19]</span>

<span class="cm"># 2) Tied embeddings: share weights between input and output projection</span>
<span class="cm"># Common in language models -- the same matrix that maps id -&gt; vec</span>
<span class="cm"># also maps hidden vec -&gt; logits over vocab.</span>
<span class="kw">class</span> <span class="fn">TiedLM</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, d_model):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(vocab_size, d_model)
        <span class="cm"># Body would go here (e.g. transformer layers)</span>
        <span class="cm"># Output projection shares weight with input embedding</span>
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        x = self.<span class="fn">embed</span>(ids)
        <span class="cm"># ... layers ...</span>
        <span class="cm"># For LM head, use embed.weight as the projection matrix:</span>
        <span class="cm"># logits = x @ self.embed.weight.T</span>
        <span class="kw">return</span> x

<span class="cm"># 3) Frozen pretrained + small trainable adapter</span>
<span class="kw">class</span> <span class="fn">AdaptedEmbedding</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, pretrained_weight, adapter_dim=<span class="num">64</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        V, D = pretrained_weight.shape
        self.frozen = nn.Embedding.<span class="fn">from_pretrained</span>(pretrained_weight, freeze=<span class="kw">True</span>)
        self.adapter = nn.<span class="fn">Linear</span>(D, adapter_dim, bias=<span class="kw">False</span>)
        nn.init.<span class="fn">zeros_</span>(self.adapter.weight)        <span class="cm"># start as identity, modify gently</span>
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        <span class="kw">return</span> self.<span class="fn">frozen</span>(ids) + self.<span class="fn">adapter</span>(self.<span class="fn">frozen</span>(ids))</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">EmbeddingBag = mean (or sum) of multiple embeddings -- like averaging word embeddings to get a sentence vector. That's all sklearn.average_word_embedding tricks do.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
vocab_size, embed_dim = 50, 16
emb_table = rng.standard_normal((vocab_size, embed_dim)) * 0.1

# 3 sentences with different lengths
sentences = [
    [4, 12, 7],
    [8, 22, 31, 19, 5],
    [3, 14],
]

# EmbeddingBag with 'mean' mode
bag_vectors = []
for sent in sentences:
    bag_vectors.append(emb_table[sent].mean(axis=0))
bag_vectors = np.stack(bag_vectors)

print('bag shape (n_sentences, embed_dim):', bag_vectors.shape)
print('per-sentence vector norms:', np.linalg.norm(bag_vectors, axis=1).round(3))</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>EmbeddingBag</code> fuses lookup with reduction (mean or sum) -- much faster than <code>embedding</code> followed by mean for FastText-style bag-of-words classifiers. The "offsets" syntax lets you batch variable-length bags efficiently. 2) Tied embeddings share weights between the input embedding and the output projection in a language model. This roughly halves the parameter count for the embedding/output and works as a regularizer. GPT-2 and most modern LMs tie embeddings. 3) Adapter pattern for fine-tuning: keep the pretrained embedding frozen and add a small trainable adapter on top. This trains very few parameters compared to fine-tuning the whole embedding matrix while still letting the model adapt to your domain.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">EmbeddingBag</div><div class="card-body">Lookup + reduce in one op. Faster than embedding + mean. Used in FastText, recommendation systems.</div></div>
<div class="calc-card"><div class="card-title">Tied embeddings</div><div class="card-body">Share input/output weights. Saves memory, regularizes. Standard in LMs.</div></div>
<div class="calc-card"><div class="card-title">Frozen + adapter</div><div class="card-body">Pretrained frozen, small extra trainable. Cheap fine-tuning.</div></div>
<div class="calc-card"><div class="card-title">Hash embedding</div><div class="card-body">Hash IDs into a smaller table. For very large vocabularies (recommender systems).</div></div>
<div class="calc-card"><div class="card-title">Quantized embedding</div><div class="card-body">int8 weights for inference. 4x smaller, minor accuracy loss.</div></div>
<div class="calc-card"><div class="card-title">Multi-vector embedding</div><div class="card-body">Each token gets multiple vectors (sense disambiguation). Rare in production.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Wrap-Up: the Embedding Pipeline</h2>

<p class="l-text">An end-to-end view: from text to a model-ready embedded sequence.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Pipeline: text -&gt; tokenizer -&gt; ids -&gt; embedding -&gt; model</span>

<span class="cm"># Stage 1: tokenize</span>
<span class="cm"># from transformers import AutoTokenizer</span>
<span class="cm"># tok = AutoTokenizer.from_pretrained("bert-base-uncased")</span>
<span class="cm"># enc = tok("This movie was great!", return_tensors="pt")</span>
<span class="cm"># input_ids = enc["input_ids"]            # (1, T)</span>

<span class="cm"># (mock for offline demo)</span>
input_ids = torch.<span class="fn">tensor</span>([[<span class="num">101</span>, <span class="num">2023</span>, <span class="num">3185</span>, <span class="num">2001</span>, <span class="num">2307</span>, <span class="num">999</span>, <span class="num">102</span>]])

<span class="cm"># Stage 2: token embedding</span>
embed = nn.<span class="fn">Embedding</span>(num_embeddings=<span class="num">30522</span>, embedding_dim=<span class="num">768</span>, padding_idx=<span class="num">0</span>)
token_emb = <span class="fn">embed</span>(input_ids)                <span class="cm"># (1, T, 768)</span>

<span class="cm"># Stage 3: position embedding</span>
pos_embed = nn.<span class="fn">Embedding</span>(<span class="num">512</span>, <span class="num">768</span>)
positions = torch.<span class="fn">arange</span>(input_ids.<span class="fn">size</span>(<span class="num">1</span>)).<span class="fn">unsqueeze</span>(<span class="num">0</span>)
pos_emb = <span class="fn">pos_embed</span>(positions)              <span class="cm"># (1, T, 768)</span>

<span class="cm"># Stage 4: combine + normalize + dropout</span>
x = token_emb + pos_emb
x = nn.<span class="fn">LayerNorm</span>(<span class="num">768</span>)(x)
x = nn.<span class="fn">Dropout</span>(<span class="num">0.1</span>)(x)

<span class="fn">print</span>(x.shape)                              <span class="cm"># (1, 7, 768)</span>
<span class="cm"># This is what enters BertEncoder. The rest of the model is attention layers.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Wrap-up -- the embedding pipeline as one sklearn statement: tokenize, lookup-by-index, average-pool, train a classifier.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# HashingVectorizer maps tokens -> fixed dim via hashing (a fast embedding-bag analog)
vec = HashingVectorizer(n_features=2 ** 11, ngram_range=(1, 2), alternate_sign=False)
X = vec.transform(df_reviews['review'])
y = df_reviews['label'].values

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=0)
clf = LogisticRegression(max_iter=500).fit(X_tr, y_tr)
print(f'hashing-embedding pipeline accuracy: {accuracy_score(y_te, clf.predict(X_te)):.3f}')
print('feature dim:', X.shape[1])</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Tokenize raw text to integer IDs using a pretrained tokenizer (BERT vocab is 30522). The output is a tensor of token IDs plus an attention mask. 2) Token embedding lookup turns each ID into a 768-dim vector -- the "what" component of the input representation. 3) Position embedding lookup adds the "where" component. Both are <code>nn.Embedding</code> modules, just with different vocab sizes. 4) Sum them, apply LayerNorm to stabilize the scale, apply dropout for regularization. This is the BERT input pipeline in 5 lines; everything afterwards is attention and feed-forward layers acting on this representation. Understanding this pipeline is half of understanding transformers.</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> An embedding is a learnable lookup table mapping discrete token IDs to dense vectors.<br><strong>2.</strong> <code>nn.Embedding(V, D)</code> is the layer; index it with a tensor of IDs to get a tensor of vectors.<br><strong>3.</strong> <code>padding_idx</code> fixes one row at zero and excludes it from gradient updates.<br><strong>4.</strong> Pretrained embeddings (GloVe, FastText) provide free geometric structure; load with <code>from_pretrained</code> and freeze when data is small.<br><strong>5.</strong> Subword tokenization (BPE, WordPiece, SentencePiece) eliminates OOV and shares parameters across morphology.<br><strong>6.</strong> Transformers add positional embeddings (sinusoidal or learned) to the token embedding -- attention is order-invariant otherwise.<br><strong>7.</strong> EmbeddingBag fuses lookup with reduction; tied embeddings share input/output weights in language models.<br><strong>8.</strong> Next lesson: attention and transformers -- the architecture that operates on top of these embedded sequences.</div></div>
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

  function pePlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var positions = []; for (var p=0;p<100;p++) positions.push(p);
    var dims = [0, 8, 16, 32, 48];
    var d_model = 64;
    var traces = dims.map(function(d, k) {
      var ys = positions.map(function(p){
        var div = Math.exp(-(d) * Math.log(10000) / d_model);
        return d % 2 === 0 ? Math.sin(p*div) : Math.cos(p*div);
      });
      var colors = [T.accent, '#4ecdc4', '#f87171', '#a78bfa', '#fbbf24'];
      return {x: positions, y: ys, mode:'lines', type:'scatter',
              name: 'dim '+d, line:{color: colors[k], width: 2}};
    });
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Sinüzoidal Pozisyon Kodlaması':'Sinusoidal Positional Encoding', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'pozisyon':'position', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'değer':'value', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, traces, layout, {responsive:true, displayModeBar:false});
  }

  function pcaPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    // Synthetic clusters
    function cluster(cx, cy, n, label, color, names) {
      var xs=[],ys=[],txt=[];
      for (var i=0;i<n;i++){
        xs.push(cx + (Math.random()-0.5)*1.0);
        ys.push(cy + (Math.random()-0.5)*1.0);
        txt.push(names[i]);
      }
      return {x:xs, y:ys, mode:'markers+text', type:'scatter', name:label,
              marker:{size:10, color:color, line:{color:'rgba(255,255,255,0.3)', width:1}},
              text:txt, textposition:'top center', textfont:{color:T.text,size:10}};
    }
    var royalty = cluster(2, 2, 4, lang==='tr'?'kraliyet':'royalty', T.accent, ['king','queen','prince','princess']);
    var animals = cluster(-2, 2, 4, lang==='tr'?'hayvanlar':'animals', '#4ecdc4', ['cat','dog','fish','bird']);
    var emotion = cluster(-2, -2, 4, lang==='tr'?'duygu':'emotion', '#f87171', ['happy','joyful','sad','angry']);
    var cities = cluster(2, -2, 4, lang==='tr'?'şehirler':'cities', '#a78bfa', ['Paris','Berlin','London','Tokyo']);
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Eğitilmiş Embedding\\'lerin 2B PCA Projeksiyonu':'2D PCA of Trained Embeddings', font:{color:T.text,size:14}},
      xaxis:{title:'PC1', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:'PC2', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [royalty, animals, emotion, cities], layout, {responsive:true, displayModeBar:false});
  }

  pePlot('plot-pl8-pe-en','en');
  pcaPlot('plot-pl8-pca-en','en');
  pePlot('plot-pl8-pe-tr','tr');
  pcaPlot('plot-pl8-pca-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Embedding'ler ayrık token'ları sinir ağlarının gerçekten öğrenebileceği yoğun vektörlere dönüştürür.</strong> Embedding'ler olmadan ağ yalnızca birbirine anlamlı benzerliği olmayan tamsayı ID'leri görür -- "cat" (id 4521) ve "kitten" (id 9938) birbirinden "cat" ve "Trump" kadar farklı görünür. Embedding'lerle benzer kelimeler 300 boyutlu uzayın benzer bölgelerine iner ve tüm aşağı akış modeli bu geometrik yapıdan yararlanır.</p>

<p class="l-text">Bu ders <code>nn.Embedding</code>'i öğrenilebilir bir lookup tablosu olarak, alt kelime tokenizasyonunu (BPE, WordPiece), transformer'lar için pozisyonel embedding'leri ve önceden eğitilmiş embedding'leri yükleme ve dondurma için pratik kalıpları kapsar. Sonunda her modern NLP modelini güçlendiren embedding tesisatında akıcı olacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><code>nn.Embedding</code>'i token ID'lerinden yoğun vektörlere öğrenilebilir bir lookup olarak kullanmayı</li>
<li>One-hot ile yoğun embedding'leri parametre sayısı ve geometri açısından karşılaştırmayı</li>
<li>BPE ve WordPiece ile metni tokenleştirmeyi ve subword vocab boyutu hakkında akıl yürütmeyi</li>
<li>Transformer girdileri için sinüzoidal ve öğrenilmiş pozisyonel embedding'leri uygulamayı</li>
<li>Önceden eğitilmiş GloVe / fastText vektörlerini <code>nn.Embedding.from_pretrained</code>'e yüklemeyi</li>
<li>Transfer learning için embedding ağırlıklarını <code>requires_grad</code> ile dondurmayı/açmayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Embedding? One-Hot Problemi</h2>

<p class="l-text">4521 gibi bir token ID sinir ağı için anlamsızdır. Ağa bir vektör gerekir. Naif seçenek one-hot'tür: pozisyon 4521'de 1 ve diğer her yerde 0 olan |vocab| uzunluğunda bir vektör. Bu iki nedenle berbat: çok büyüktür (vocab 30k-50k giriş olabilir) ve geometrik olarak kullanışsızdır (her kelime çifti sqrt(2) mesafededir).</p>

<div class="calc-highlight"><strong>Embedding, token ID'lerinden yoğun düşük boyutlu vektörlere öğrenilebilir bir haritadır.</strong> Vocab boyutu 50000, embedding boyutu 300, toplam parametreler: 15M -- 50000 boyutlu one-hot vektörlerden çok daha küçük ve geometri anlam kodlayabilir (cat ≈ kitten, king - man + woman ≈ queen).</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Token ID</div><div class="card-body">[0, V) aralığında tamsayı. Örn. id 4521 "cat" anlamına gelebilir. Tokenizer'ınızdan gelir.</div></div>
<div class="calc-card"><div class="card-title">Embedding vektörü</div><div class="card-body">Sabit boyut D olan yoğun float vektör (örn. 128, 300, 768).</div></div>
<div class="calc-card"><div class="card-title">Embedding matrisi</div><div class="card-body">Şekil (V, D). Her satır karşılık gelen token ID için embedding'dir.</div></div>
<div class="calc-card"><div class="card-title">Lookup</div><div class="card-body">Matrisi token ID ile indeksleme -- one-hot @ matris ile eşdeğer ama çok daha hızlı.</div></div>
<div class="calc-card"><div class="card-title">Eğitilebilir</div><div class="card-body">Embedding'ler parametrelerdir; backprop yoluyla diğer ağırlıklar gibi güncellenir.</div></div>
<div class="calc-card"><div class="card-title">Geometri</div><div class="card-body">Eğitilmiş embedding'ler anlamsal kümelenir. Cat ve kitten kosinüs benzerliği büyük; cat ve Trump küçük.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: word2vec analojileri</div><div class="example-body">Büyük bir corpus üzerinde kelime embedding'leri eğittikten sonra çarpıcı analojiler gözlersiniz: <code>vec("king") - vec("man") + vec("woman") ≈ vec("queen")</code>. Embedding "kraliyet" ve "cinsiyet"in kabaca dik yönler olarak var olduğunu öğrenmiştir. Benzer etkiler: başkentler, fiil çekimleri, ülke/para birimi çiftleri. Bu ortaya çıkan yapı, embedding'lerin 2013'te NLP'yi devrimleştirmesinin nedenidir.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. nn.Embedding: Lookup Tablosu</h2>

<p class="l-text"><code>nn.Embedding</code>, öğrenilebilir bir matrisi saran ve size temiz bir lookup arayüzü veren bir Module'dür. İçsel olarak satırlarda basit bir <code>torch.gather</code>'dır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

V, D = <span class="num">10000</span>, <span class="num">64</span>           <span class="cm"># vocab=10000, embed_dim=64</span>
embed = nn.<span class="fn">Embedding</span>(num_embeddings=V, embedding_dim=D, padding_idx=<span class="num">0</span>)
<span class="fn">print</span>(embed.weight.shape)  <span class="cm"># torch.Size([10000, 64])</span>

<span class="cm"># Tek token</span>
ids = torch.<span class="fn">tensor</span>([<span class="num">42</span>])
<span class="fn">print</span>(<span class="fn">embed</span>(ids).shape)    <span class="cm"># (1, 64)</span>

<span class="cm"># Diziler batch'i</span>
ids = torch.<span class="fn">tensor</span>([[<span class="num">1</span>, <span class="num">5</span>, <span class="num">9</span>, <span class="num">0</span>, <span class="num">0</span>],
                    [<span class="num">3</span>, <span class="num">7</span>, <span class="num">2</span>, <span class="num">4</span>, <span class="num">6</span>]])
emb = <span class="fn">embed</span>(ids)
<span class="fn">print</span>(emb.shape)           <span class="cm"># (2, 5, 64)</span>

<span class="cm"># padding_idx=0, satır 0'ın sıfırda sabit olduğu ve gradyanlarla güncellenmediği anlamına gelir</span>
<span class="fn">print</span>(embed.weight[<span class="num">0</span>])     <span class="cm"># hep sıfır</span>

<span class="cm"># One-hot @ weight ile eşdeğer ama çok daha ucuz</span>
oh = torch.<span class="fn">zeros</span>(<span class="num">2</span>, <span class="num">5</span>, V)
oh.<span class="fn">scatter_</span>(<span class="num">2</span>, ids.<span class="fn">unsqueeze</span>(-<span class="num">1</span>), <span class="num">1.0</span>)
emb_via_onehot = oh @ embed.weight
<span class="fn">print</span>(torch.<span class="fn">allclose</span>(emb, emb_via_onehot, atol=<span class="num">1e-6</span>))   <span class="cm"># True</span>

<span class="cm"># Normal/uniform ile özgür başlatma</span>
nn.init.<span class="fn">normal_</span>(embed.weight, mean=<span class="num">0.0</span>, std=<span class="num">0.02</span>)       <span class="cm"># transformer stili</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Embedding katmanı = (vocab x dim) matrisine arama. NumPy ile sıfırdan kuruyoruz: sadece tamsayı-indeksli satırlar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
vocab_size = 20
embed_dim  = 8

# Embedding table -- the only learnable parameter
emb_table = rng.standard_normal((vocab_size, embed_dim)) * 0.1

# Tokenized batch (2 sentences of length 5)
token_ids = np.array([
    [1, 5, 9, 0, 0],
    [4, 7, 2, 11, 6],
])

# Lookup is just fancy indexing
embeddings = emb_table[token_ids]
print('table shape    :', emb_table.shape)
print('token_ids shape:', token_ids.shape)
print('embeddings shape:', embeddings.shape, '  (batch, seq, dim)')
print('embedding of token 5 (sample):', emb_table[5].round(3))</code></pre></div>
</div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) 10000x64 bir embedding tablosu oluşturur; <code>padding_idx=0</code> PyTorch'a satır 0'ın padding token'ının embedding'i olduğunu, sıfırda sabit ve eğitim sırasında güncellenmemesi gerektiğini söyler. 2) Tek bir token ID ile embedding'i indekslemek (1, D) tensor döner. 3) 2 boyutlu tensor ile indeksleme 3 boyutlu tensor döner: <code>(B, T) -> (B, T, D)</code>. Bu HER NLP embedding katmanının ileri geçişidir. 4) Sonucun one-hot ile ağırlık matrisinin çarpımına eşit olduğunu doğrular; <code>nn.Embedding</code> sadece o matematiğin hızlı bir uygulamasıdır. 5) Özel başlatma: transformer'lar genellikle normal(0, 0.02), word2vec uniform(-0.5/D, 0.5/D) kullanır. Doğru seçim mimariye bağlıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">num_embeddings</div><div class="card-body">Sözlük boyutu V. En az max_token_id + 1 olmalı.</div></div>
<div class="calc-card"><div class="card-title">embedding_dim</div><div class="card-body">Çıktı vektör boyutu D. Yaygın: word2vec için 100-300, BERT-base için 768, büyük transformer'lar için 1024+.</div></div>
<div class="calc-card"><div class="card-title">padding_idx</div><div class="card-body">Satırı sıfırda sabit ve gradyan güncellemelerinden hariç tutulan indeks. Standart kalıp: 0.</div></div>
<div class="calc-card"><div class="card-title">max_norm</div><div class="card-body">İsteğe bağlı: her satırı en fazla max_norm olan L2 norma yeniden ölçeklendirir. Embedding'leri sınırlı tutmak için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">sparse=True</div><div class="card-body">Çok büyük sözlükler için seyrek gradyanlar. Seyrek uyumlu optimizer gerektirir (SparseAdam).</div></div>
<div class="calc-card"><div class="card-title">freeze=False</div><div class="card-body">Varsayılan: eğitilebilir. Dondurmak için <code>weight.requires_grad = False</code> ayarlayın (örn. önceden eğitilmiş GloVe ile).</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Önceden Eğitilmiş Embedding'leri Yükleme</h2>

<p class="l-text">Önceden eğitilmiş kelime embedding'leri (GloVe, FastText, word2vec) büyük corpus'lar üzerinde eğitilmiş kelime -> vektör matrisleridir. Onları <code>nn.Embedding</code>'in başlangıç ağırlıkları olarak yüklemek size geometrik yapıyı bedava verir, görevinizin tek bir örneğinde eğitim yapmadan önce.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) Bir GloVe dosyasından kelime -&gt; vektör sözlüğü oluştur (açıklayıcı)</span>
<span class="kw">def</span> <span class="fn">load_glove</span>(path, dim=<span class="num">300</span>):
    word2vec = {}
    <span class="cm"># with open(path, "r", encoding="utf-8") as f:</span>
    <span class="cm">#     for line in f:</span>
    <span class="cm">#         parts = line.rstrip().split(" ")</span>
    <span class="cm">#         word = parts[0]</span>
    <span class="cm">#         vec = np.array(parts[1:], dtype=np.float32)</span>
    <span class="cm">#         word2vec[word] = vec</span>
    <span class="cm"># Demo için rastgele "önceden eğitilmiş" vektörler üretiyoruz</span>
    words = [<span class="str">"&lt;pad&gt;"</span>,<span class="str">"&lt;unk&gt;"</span>,<span class="str">"cat"</span>,<span class="str">"dog"</span>,<span class="str">"king"</span>,<span class="str">"queen"</span>,<span class="str">"run"</span>,<span class="str">"jump"</span>]
    word2vec = {w: np.random.<span class="fn">randn</span>(dim).<span class="fn">astype</span>(np.float32) <span class="kw">for</span> w <span class="kw">in</span> words}
    <span class="kw">return</span> word2vec

<span class="cm"># 2) Tokenizer'ınızla hizalanmış vocab ve embedding matrisi inşa et</span>
glove = <span class="fn">load_glove</span>(path=<span class="kw">None</span>, dim=<span class="num">300</span>)
vocab = {w: i <span class="kw">for</span> i, w <span class="kw">in</span> <span class="fn">enumerate</span>(glove.<span class="fn">keys</span>())}
V, D = <span class="fn">len</span>(vocab), <span class="num">300</span>

<span class="cm"># Boş matris başlat</span>
weight = np.<span class="fn">zeros</span>((V, D), dtype=np.float32)
<span class="kw">for</span> w, idx <span class="kw">in</span> vocab.<span class="fn">items</span>():
    <span class="kw">if</span> w <span class="kw">in</span> glove:
        weight[idx] = glove[w]
    <span class="kw">else</span>:
        <span class="cm"># OOV: küçük rastgele başlatma</span>
        weight[idx] = np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, D).<span class="fn">astype</span>(np.float32)

<span class="cm"># 3) nn.Embedding'e yükle</span>
emb = nn.<span class="fn">Embedding</span>(V, D, padding_idx=vocab[<span class="str">"&lt;pad&gt;"</span>])
emb.weight.data.<span class="fn">copy_</span>(torch.<span class="fn">from_numpy</span>(weight))

<span class="cm"># 4) İsteğe bağlı olarak embedding'i dondur (eğitim sırasında gradyan güncellemesi yok)</span>
emb.weight.requires_grad = <span class="kw">False</span>
<span class="cm"># Sonra çözmek için (embedding'leri ince ayarlamak):</span>
<span class="cm"># emb.weight.requires_grad = True</span>

<span class="cm"># 5) Veya kolaylık kurucusunu kullan</span>
emb2 = nn.Embedding.<span class="fn">from_pretrained</span>(torch.<span class="fn">from_numpy</span>(weight),
                                    freeze=<span class="kw">True</span>,
                                    padding_idx=vocab[<span class="str">"&lt;pad&gt;"</span>])
<span class="fn">print</span>(emb2.weight.requires_grad)   <span class="cm"># False çünkü freeze=True</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Önceden eğitilmiş embedding'ler tipik olarak NumPy matrisi olarak yüklenir, sonra ya dondurulur ya da ince ayar yapılır. Aynı fikir -- küçük sahte glove benzeri dosya yüklüyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Simulate a tiny pretrained glove with 6 known words
pretrained = {
    'good':    np.array([0.5, 0.2, -0.1, 0.3]),
    'bad':     np.array([-0.5, -0.2, 0.1, -0.3]),
    'great':   np.array([0.6, 0.3, -0.2, 0.4]),
    'awful':   np.array([-0.6, -0.3, 0.2, -0.4]),
    'movie':   np.array([0.0, 0.5, 0.5, 0.1]),
    'film':    np.array([0.0, 0.5, 0.4, 0.1]),
}
vocab = ['<unk>'] + sorted(pretrained.keys())
emb_dim = 4
mat = np.random.default_rng(0).standard_normal((len(vocab), emb_dim)) * 0.05
for i, w in enumerate(vocab):
    if w in pretrained:
        mat[i] = pretrained[w]

# Sanity: 'good' and 'great' should be near; 'good' and 'bad' should be far.
def cos(a, b): return float(a @ b / (np.linalg.norm(a)*np.linalg.norm(b) + 1e-9))
i = {w: vocab.index(w) for w in pretrained}
print(f'cos(good, great) = {cos(mat[i["good"]], mat[i["great"]]):.3f}')
print(f'cos(good, bad)   = {cos(mat[i["good"]], mat[i["bad"]]):.3f}')
print(f'cos(movie, film) = {cos(mat[i["movie"]], mat[i["film"]]):.3f}')</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>load_glove</code> bir GloVe metin dosya formatını okur (kelimeyi takip eden satır başına D kayan nokta değer). Gerçek kullanım için dosya okuma satırlarının yorumunu kaldırırsınız; burada demo için rastgele vektörler üretiyoruz. 2) Yüklenen kelimelerden bir vocab oluşturur ve şekli (V, D) olan bir numpy matrisi oluşturur. Vocab'ınızdaki her kelime için karşılık gelen önceden eğitilmiş vektörü kopyalayın; önceden eğitilmiş kümede olmayan kelimeler için (OOV) sıfır yerine küçük rastgele gürültüyle başlatın. 3) Bir <code>nn.Embedding</code> modülü oluşturur ve numpy matrisini ağırlık tensor'una <code>data.copy_</code> ile kopyalar. 4) <code>requires_grad = False</code> ayarlamak embedding'leri dondurur -- gradyanlar embedding katmanı boyunca aşağı akış parametrelerini güncellemek için akar ama embedding matrisi kendisi değişmez. Bu, görev veriniz küçük olduğunda ve önceden eğitilmiş vektörler zaten anlamlı yapı kodladığında kullanışlıdır. 5) <code>from_pretrained</code> manuel yaklaşımın tek satırlık eşdeğeridir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: tipik ince ayar tarifi</div><div class="example-body">10k etiketli tweet'te duygu sınıflandırıcısı için: GloVe-300'ü embedding olarak yükle, LSTM ve sınıflandırıcı öğrenirken ilk 3 epoch için dondur, sonra sonraki 5 epoch için embedding'leri alanınıza nazikçe uyarlamak için 10x daha küçük öğrenme oranıyla çöz. Bu tarif tutarlı şekilde hem sıfırdan eğitimi (küçük veride overfit) hem de sonsuza kadar dondurmayı (alana uyum sağlayamama) yener.</div></div>

<div class="l-warn"><strong>Tuzak:</strong> Vocab hizalaması. Tokenizer'ınızın kelime -&gt; id eşlemesi vektörleri matrise kopyaladığınız sıraya uymalıdır. Bir-yanlışı hizalama sessiz ve felakettir. Her zaman <code>emb.weight[vocab["cat"]]</code>'in "cat" için GloVe vektörüne yakın olduğunu kontrol ederek test edin.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Alt Kelime Tokenizasyonu: BPE ve WordPiece</h2>

<p class="l-text">Kelime düzeyinde sözlüklerin iki büyük problemi vardır: büyük boyut (milyonlarca benzersiz kelime) ve yazım hataları, neologizmler, isimler için sözlük dışı başarısızlıklar. Modern NLP <em>alt kelime</em> tokenizasyonu kullanır: yaygın karakter dizilerinden sabit bir vocab oluşturun, sonra nadir kelimeleri birden fazla alt kelime token'ına bölün.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">BPE (Byte-Pair Encoding)</div><div class="card-body">Karakterlerden başlar; en sık çifti yinelemeli birleştirir. GPT-2/3, RoBERTa'da kullanılır.</div></div>
<div class="calc-card"><div class="card-title">WordPiece</div><div class="card-body">BPE gibi ama olabilirlikle birleştirir. BERT'te kullanılır. Bir kelime içindeki alt kelimeler ## ile işaretlenir.</div></div>
<div class="calc-card"><div class="card-title">SentencePiece</div><div class="card-body">Dilden bağımsız; girdiyi ham bayt olarak ele alır. T5, ALBERT, mT5'te kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Unigram</div><div class="card-body">Olasılıksal; en iyi puanlı alt kelime segmentasyonunu tutar. Bazı SentencePiece yapılandırmalarında kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Vocab boyutu</div><div class="card-body">Tipik: tek dilli için 30k-50k token, çok dilli için 100k-250k.</div></div>
<div class="calc-card"><div class="card-title">Daha fazla OOV yok</div><div class="card-body">Herhangi bir kelime bilinen alt kelimelere bölünebilir (en kötü durumda karakterlere).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># HuggingFace tokenizer'ları kullan (üretim sınıfı)</span>
<span class="cm"># pip install transformers</span>
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer

tok = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>)

text = <span class="str">"Tokenization handles unsupercalifragilistic words gracefully."</span>
out = <span class="fn">tok</span>(text, return_tensors=<span class="str">"pt"</span>)
<span class="fn">print</span>(out[<span class="str">"input_ids"</span>].shape)        <span class="cm"># (1, T)</span>
<span class="fn">print</span>(tok.<span class="fn">convert_ids_to_tokens</span>(out[<span class="str">"input_ids"</span>][<span class="num">0</span>]))
<span class="cm"># ['[CLS]', 'token', '##ization', 'handles', 'unsup', '##er', '##cal', '##ifr', '##agi', '##list', '##ic', 'words', 'graceful', '##ly', '.', '[SEP]']</span>

<span class="cm"># Dikkat: "unsupercalifragilistic" -&gt; ## önekli birçok alt kelime</span>
<span class="cm"># "tokenization" -&gt; "token" + "##ization"</span>
<span class="cm"># Bunlar tam olarak transformer'ınızın nn.Embedding'inin tükettiği girdilerdir</span>

<span class="cm"># BERT-base embedding lookup yalnızca:</span>
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
embed = nn.<span class="fn">Embedding</span>(num_embeddings=tok.vocab_size, embedding_dim=<span class="num">768</span>, padding_idx=tok.pad_token_id)
emb_vecs = <span class="fn">embed</span>(out[<span class="str">"input_ids"</span>])    <span class="cm"># (1, T, 768)</span>
<span class="fn">print</span>(emb_vecs.shape)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Alt kelime tokenizasyonu: küçük BPE benzeri birleştirici elle inşa ediyoruz. İlke: bitişik çift frekanslarını say, en sıkını birleştir, tekrarla.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re
from collections import Counter

corpus = ['low low low low low',
          'lower lower newest newest',
          'newest newest widest widest']

# Start: split into characters with end-of-word marker
def tokenize(text):
    return [list(w) + ['</w>'] for w in text.split()]

tokens = []
for line in corpus:
    tokens.extend(tokenize(line))

def get_pairs(tokens):
    pairs = Counter()
    for word in tokens:
        for i in range(len(word) - 1):
            pairs[(word[i], word[i+1])] += 1
    return pairs

def merge(tokens, pair):
    a, b = pair
    new_tokens = []
    for word in tokens:
        new_word = []
        i = 0
        while i < len(word):
            if i < len(word)-1 and word[i] == a and word[i+1] == b:
                new_word.append(a + b); i += 2
            else:
                new_word.append(word[i]); i += 1
        new_tokens.append(new_word)
    return new_tokens

for step in range(4):
    pairs = get_pairs(tokens)
    best, _ = pairs.most_common(1)[0]
    tokens = merge(tokens, best)
    print(f'merge {step+1}: joined {best!r}')
print('final vocabulary tokens (sample):', tokens[0])</code></pre></div>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) HuggingFace'ten önceden eğitilmiş bir BERT tokenizer yükler -- üretimdeki her BERT tabanlı modelin gerçekten kullandığı. 2) Bir cümleyi tokenize eder; çıktı sözlüğü modele beslemeye hazır input_ids ve attention_mask tensor'larını içerir. 3) Segmentasyonu incelemek için okunabilir token'lara geri dönüştürür: "tokenization", "##" önekinin alt kelime devamını işaretlediği "token" + "##ization"'a bölünür. Uydurulmuş kelime "unsupercalifragilistic" 7 alt kelimeye bölünür. 4) Görülmemiş kelimeler bile her zaman bilinen alt kelimeler dizisi olarak kodlanabilir, OOV problemini tamamen ortadan kaldırır. 5) Transformer'ın <code>nn.Embedding</code>'i bu alt kelime ID'leri için satırları arar -- alt kelimelere karşı tam kelimelere özel işleme gerekmez; embedding matrisi ikisini de kodlar.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: alt kelimeler neden yardımcı olur</div><div class="example-body">"running" ve "runner"ı düşünün. Kelime düzeyinde: ayrı, paylaşılan parametre yok. BPE: "run" + "##ning" ve "run" + "##ner" olarak bölünür. Paylaşılan "run" embedding'i artık paylaşılan morfolojiyi öğrenir -- her iki kelimeden gelen gradyanlar aynı vektörü günceller. Model "run"un yaygın bir kök olduğunu ve eklerin değiştiğini öğrenir, daha küçük vocab ile daha iyi genelleştirme elde eder.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Pozisyonel Embedding'ler</h2>

<p class="l-text">Kelime embedding'leri bir token'ın <em>ne</em> olduğunu kodlar. <em>Nerede</em> göründüğü hakkında hiçbir şey söylemezler. RNN'ler ve CNN'ler pozisyonu mimarileri aracılığıyla örtük görür; transformer'lar görmez -- attention sıra değişmezdir. Bu yüzden transformer'lar her token'ın kelime embedding'ine bir pozisyonel embedding ekler.</p>

<div class="katex-block">$$\\text{PE}_{(pos, 2i)} = \\sin\\!\\left(\\frac{pos}{10000^{2i/d}}\\right), \\quad \\text{PE}_{(pos, 2i+1)} = \\cos\\!\\left(\\frac{pos}{10000^{2i/d}}\\right)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">pos</div><div class="card-body">Dizideki pozisyon (0, 1, 2, ...).</div></div>
<div class="calc-card"><div class="card-title">i</div><div class="card-body">Embedding'deki boyut indeksi (0 ile d/2-1 arası).</div></div>
<div class="calc-card"><div class="card-title">d</div><div class="card-body">Embedding boyutu. Token embedding ile aynı boyut.</div></div>
<div class="calc-card"><div class="card-title">10000</div><div class="card-body">Dalgaboyunu kontrol eden bir sabit; boyutlar arasında düşükten çok yüksek frekansa kapsar.</div></div>
<div class="calc-card"><div class="card-title">sin/cos</div><div class="card-body">Çift boyutlar sin, tek boyutlar cos kullanır. Birlikte pürüzsüz, pozisyon ayırt eden bir örüntü oluştururlar.</div></div>
<div class="calc-card"><div class="card-title">Topla, birleştirme</div><div class="card-body">Pozisyon embedding token embedding'e eleman bazlı EKLENİR. Aynı şekil (B, T, D).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> math

<span class="cm"># 1) Sinüzoidal (sabit, parametre yok) -- orijinal Transformer</span>
<span class="kw">class</span> <span class="fn">SinusoidalPE</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d_model, max_len=<span class="num">5000</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        pe = torch.<span class="fn">zeros</span>(max_len, d_model)
        pos = torch.<span class="fn">arange</span>(max_len).<span class="fn">unsqueeze</span>(<span class="num">1</span>).<span class="fn">float</span>()        <span class="cm"># (T, 1)</span>
        div = torch.<span class="fn">exp</span>(torch.<span class="fn">arange</span>(<span class="num">0</span>, d_model, <span class="num">2</span>).<span class="fn">float</span>() *
                        -(math.<span class="fn">log</span>(<span class="num">10000.0</span>) / d_model))         <span class="cm"># (D/2,)</span>
        pe[:, <span class="num">0</span>::<span class="num">2</span>] = torch.<span class="fn">sin</span>(pos * div)
        pe[:, <span class="num">1</span>::<span class="num">2</span>] = torch.<span class="fn">cos</span>(pos * div)
        self.<span class="fn">register_buffer</span>(<span class="str">"pe"</span>, pe.<span class="fn">unsqueeze</span>(<span class="num">0</span>))             <span class="cm"># (1, max_len, D)</span>

    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="cm"># x: (B, T, D)</span>
        <span class="kw">return</span> x + self.pe[:, : x.<span class="fn">size</span>(<span class="num">1</span>), :]

<span class="cm"># 2) Öğrenilmiş pozisyonel embedding (BERT, GPT) -- ayrı bir nn.Embedding</span>
<span class="kw">class</span> <span class="fn">LearnedPE</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, max_len, d_model):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.pos_embed = nn.<span class="fn">Embedding</span>(max_len, d_model)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        B, T, D = x.shape
        positions = torch.<span class="fn">arange</span>(T, device=x.device).<span class="fn">unsqueeze</span>(<span class="num">0</span>).<span class="fn">expand</span>(B, T)
        <span class="kw">return</span> x + self.<span class="fn">pos_embed</span>(positions)

<span class="cm"># Birleştir: gerçek transformer embedding yığını</span>
<span class="kw">class</span> <span class="fn">TransformerEmbed</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, d_model, max_len=<span class="num">512</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.token = nn.<span class="fn">Embedding</span>(vocab_size, d_model, padding_idx=<span class="num">0</span>)
        self.pos = <span class="fn">LearnedPE</span>(max_len, d_model)
        self.ln = nn.<span class="fn">LayerNorm</span>(d_model)
        self.drop = nn.<span class="fn">Dropout</span>(<span class="num">0.1</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        x = self.<span class="fn">token</span>(ids)         <span class="cm"># (B, T, D)</span>
        x = self.<span class="fn">pos</span>(x)             <span class="cm"># öğrenilmiş pozisyon bilgisi ekle</span>
        <span class="kw">return</span> self.<span class="fn">drop</span>(self.<span class="fn">ln</span>(x))

m = <span class="fn">TransformerEmbed</span>(vocab_size=<span class="num">30000</span>, d_model=<span class="num">128</span>)
ids = torch.<span class="fn">randint</span>(<span class="num">1</span>, <span class="num">30000</span>, (<span class="num">2</span>, <span class="num">64</span>))
out = <span class="fn">m</span>(ids)
<span class="fn">print</span>(out.shape)                    <span class="cm"># (2, 64, 128)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pozisyonel embedding'ler = token embedding'lerine eklenen ayrı bir (max_len x dim) matris. Sinüzoidal versiyon sabit (gradient-yok) bir aramadır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def sinusoidal_pos_enc(max_len, d_model):
    pos = np.arange(max_len)[:, None]
    i   = np.arange(d_model)[None, :]
    angle_rates = 1 / np.power(10000, (2 * (i // 2)) / d_model)
    angle_rads  = pos * angle_rates
    pe = np.zeros((max_len, d_model))
    pe[:, 0::2] = np.sin(angle_rads[:, 0::2])
    pe[:, 1::2] = np.cos(angle_rads[:, 1::2])
    return pe

pe = sinusoidal_pos_enc(max_len=12, d_model=8)
print('positional encoding shape:', pe.shape)
print('first 4 positions:\n', pe[:4].round(3))
# Adjacent positions should be similar; far positions less so.
def cos(a, b): return float(a @ b / (np.linalg.norm(a)*np.linalg.norm(b)))
print('cos(pos0, pos1) :', round(cos(pe[0], pe[1]), 3))
print('cos(pos0, pos11):', round(cos(pe[0], pe[11]), 3))</code></pre></div>
</div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Orijinal Transformer makalesinden sinüzoidal pozisyonel kodlamayı uygular. Örüntü sabittir: her boyut farklı bir frekansta salınır, böylece her pozisyonun benzersiz bir sin/cos değer kombinasyonu olur. Onu bir tampon olarak kaydederiz çünkü öğrenilebilir değildir ama modelle GPU'ya hareket etmelidir. 2) Forward token embedding'e pozisyon kodlamasını ekler -- aynı şekil, eleman bazlı toplama. 3) BERT ve GPT tarafından kullanılan öğrenilmiş pozisyonel embedding'leri uygular: tamsayı pozisyonla indekslenmiş başka bir <code>nn.Embedding</code>. Model en kullanışlı pozisyonel örüntüyü öğrenir. 4) Token embedding + pozisyon + LayerNorm + Dropout'u birleştirir, kanonik transformer girdi yığını. Bu kabaca herhangi bir HuggingFace transformer'ının <code>forward</code>'ının ilk üç satırıdır. 5) Çıktı ilk attention katmanına akan şeydir.</p>

<div id="plot-pl8-pe-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> 0-99 pozisyonları boyunca ilk 64 boyut için sinüzoidal pozisyonel kodlama değerleri. Düşük indeksli boyutlar yavaş salınır (uzun dalgaboyları), yüksek indeksli boyutlar hızlı salınır (kısa dalgaboyları). Bu çok ölçekli yapı yakın pozisyonlar arasında benzerliği koruyarak her pozisyonu benzersiz tanımlanabilir kılar -- attention'ın kelime sırasını ayırt etmek için ihtiyaç duyduğu temel özellik.</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Sinüzoidal</div><div class="compare-item">Sabit, parametre yok</div><div class="compare-item">Görülenden daha uzun dizilere genelleşir</div><div class="compare-item">Orijinal Transformer (Vaswani 2017)</div><div class="compare-item">Bellek maliyeti yok</div></div>
<div class="compare-col"><div class="compare-title">Öğrenilmiş</div><div class="compare-item">Öğrenilebilir, max_len * d_model parametre</div><div class="compare-item">max_len ötesine ekstrapole edemez</div><div class="compare-item">BERT, GPT-2, çoğu modern transformer</div><div class="compare-item">Sıklıkla biraz daha yüksek doğruluk</div></div>
</div>

<div class="l-note"><strong>Modern alternatifler:</strong> LLaMA ve birçok son modelde kullanılan Rotary Position Embedding (RoPE), açısı pozisyona bağlı dönüşlerle query ve key vektörlerini çarpar. ALiBi başlık başına mesafeye bağlı bir bias ekler. Her ikisi de öğrenilmiş PE'den daha uzun dizilere ekstrapole eder.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Embedding Geometrisini Görselleştirme</h2>

<p class="l-text">Eğitimden sonra, embedding'leri PCA veya t-SNE ile 2 boyuta yansıtabilir ve anlamsal kümelemeyi görebilirsiniz. Bu, embedding'lerinizin kullanışlı bir şey yaptığına dair hızlı görsel bir sağlık kontrolüdür.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Eğitilmiş bir embedding matrisimiz olduğunu varsayın</span>
<span class="cm"># (pratikte bir duygu sınıflandırıcı veya dil modeli eğittikten sonra)</span>
torch.<span class="fn">manual_seed</span>(<span class="num">0</span>)
emb = nn.<span class="fn">Embedding</span>(<span class="num">30</span>, <span class="num">64</span>)
nn.init.<span class="fn">normal_</span>(emb.weight, std=<span class="num">0.5</span>)

<span class="cm"># Vocab'imizdeki kelimeler (açıklayıcı)</span>
words = [<span class="str">"king"</span>, <span class="str">"queen"</span>, <span class="str">"prince"</span>, <span class="str">"princess"</span>,
         <span class="str">"cat"</span>, <span class="str">"dog"</span>, <span class="str">"fish"</span>, <span class="str">"bird"</span>,
         <span class="str">"happy"</span>, <span class="str">"joyful"</span>, <span class="str">"sad"</span>, <span class="str">"miserable"</span>,
         <span class="str">"run"</span>, <span class="str">"walk"</span>, <span class="str">"jump"</span>, <span class="str">"swim"</span>,
         <span class="str">"1"</span>, <span class="str">"2"</span>, <span class="str">"3"</span>, <span class="str">"4"</span>,
         <span class="str">"Paris"</span>, <span class="str">"Berlin"</span>, <span class="str">"London"</span>, <span class="str">"Tokyo"</span>,
         <span class="str">"apple"</span>, <span class="str">"banana"</span>, <span class="str">"orange"</span>, <span class="str">"grape"</span>,
         <span class="str">"&lt;pad&gt;"</span>, <span class="str">"&lt;unk&gt;"</span>]

<span class="cm"># PCA ile 2B'ye yansıt</span>
W = emb.weight.<span class="fn">detach</span>().<span class="fn">numpy</span>()                    <span class="cm"># (30, 64)</span>
W_centered = W - W.<span class="fn">mean</span>(axis=<span class="num">0</span>, keepdims=<span class="kw">True</span>)
<span class="kw">import</span> numpy <span class="kw">as</span> np
U, S, Vt = np.linalg.<span class="fn">svd</span>(W_centered, full_matrices=<span class="kw">False</span>)
W_2d = U[:, :<span class="num">2</span>] * S[:<span class="num">2</span>]
<span class="fn">print</span>(W_2d.shape)                                  <span class="cm"># (30, 2)</span>

<span class="cm"># Gerçek bir notebook'ta W_2d'yi kelime etiketleriyle scatter olarak çizerdiniz</span>
<span class="cm"># Gerçek veride eğitimden sonra anlamsal benzer kelimeler bir araya kümelenir</span>
<span class="cm"># Burada hiçbir şey eğitmediğimiz için kümelenme rastgeledir</span>

<span class="cm"># İki kelime arası kosinüs benzerliği</span>
<span class="kw">def</span> <span class="fn">cos_sim</span>(v1, v2):
    <span class="kw">return</span> <span class="fn">float</span>(v1 @ v2 / (v1.<span class="fn">norm</span>() * v2.<span class="fn">norm</span>()))

i_king, i_queen = words.<span class="fn">index</span>(<span class="str">"king"</span>), words.<span class="fn">index</span>(<span class="str">"queen"</span>)
v_king = emb.weight[i_king]; v_queen = emb.weight[i_queen]
<span class="fn">print</span>(f<span class="str">"sim(king, queen) = {cos_sim(v_king, v_queen):+.3f}"</span>)
<span class="cm"># Rastgele init: ~0; gerçek metinde eğitilmiş: büyük pozitif</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Embedding geometrisini görselleştir: öğrenilen matrisi PCA ile 2B'ye indirgeyerek anlamsal benzerlik görsel yakınlığa dönüşür.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.decomposition import PCA
from sklearn.feature_extraction.text import TfidfVectorizer

# Learn TF-IDF "embeddings" for review words then PCA project
vec = TfidfVectorizer(max_features=80, stop_words='english')
mat = vec.fit_transform(df_reviews['review']).T.toarray()  # (vocab, docs)
words = vec.get_feature_names_out()

pca = PCA(n_components=2)
coords = pca.fit_transform(mat)
print('shape after PCA:', coords.shape)
print('sample positions:')
for w, (x, y) in list(zip(words, coords))[:8]:
    print(f'  {w:15s} -> ({x:+.3f}, {y:+.3f})')
print('explained variance:', pca.explained_variance_ratio_.round(3))</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Küçük bir embedding matrisi oluşturur ve başlatır; gerçek kullanımda bu eğitilmiş bir modelin embedding katmanı olurdu. 2) Kraliyet, hayvanlar, duygular, fiiller, sayılar, şehirler, meyveler ve özel token'ları kapsayan 30 açıklayıcı kelime listeler. 3) SVD aracılığıyla 2B PCA hesaplar. Gerçek veride eğitimden sonra kraliyet kelimelerinin bir araya kümelendiğini, hayvan kelimelerinin başka yerde, sayıların ayrı bir bölgede olduğunu görürsünüz. Rastgele başlangıçla noktalar rastgele dağılır. 4) Kosinüs benzerliği embedding yakınlığı için standart metriktir; vektör büyüklüğüne değişmezdir ve [-1, 1] aralığındadır. Eğitimden sonra sim(king, queen) tipik olarak büyüktür; sim(king, banana) sıfıra yakındır.</p>

<div id="plot-pl8-pca-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösterir:</strong> Eğitilmiş kelime embedding'lerinin 2B PCA projeksiyonu. Kümeler ortaya çıkar: kraliyet (king, queen, prince, princess) bir bölgede, hayvanlar başka bir bölgede, şehirler birlikte, sayılar gruplanmış. Bu tür kendi kendine organize geometri embedding'leri güçlü kılan şeydir -- ağ yalnızca ham metinden anlamlı bir koordinat sistemi öğrenmiştir. Örüntü ayrıca aşağı akışa aktarabilen önyargıları da (örn. cinsiyet / meslek ilişkilendirmeleri) ortaya çıkarır.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. EmbeddingBag ve Diğer Hileler</h2>

<p class="l-text">Performans için bilmeye değer birkaç özelleşmiş embedding kalıbı vardır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># 1) EmbeddingBag: lookup + sum/mean tek birleşik işlemde</span>
<span class="cm"># Bag-of-words stili sınıflandırıcılar (FastText) için kullanışlı</span>
emb_bag = nn.<span class="fn">EmbeddingBag</span>(num_embeddings=<span class="num">10000</span>, embedding_dim=<span class="num">64</span>, mode=<span class="str">"mean"</span>)
<span class="cm"># "offsets" aracılığıyla değişken uzunluklu girdi</span>
input_ids = torch.<span class="fn">tensor</span>([<span class="num">3</span>, <span class="num">5</span>, <span class="num">7</span>, <span class="num">11</span>, <span class="num">13</span>, <span class="num">17</span>, <span class="num">19</span>])    <span class="cm"># düz</span>
offsets = torch.<span class="fn">tensor</span>([<span class="num">0</span>, <span class="num">3</span>, <span class="num">5</span>])                       <span class="cm"># bag sınırları</span>
out = <span class="fn">emb_bag</span>(input_ids, offsets)
<span class="fn">print</span>(out.shape)                                        <span class="cm"># (3, 64) -- 3 bag</span>
<span class="cm"># bag 0 [3, 5, 7] embedding'lerini ortalar</span>
<span class="cm"># bag 1 [11, 13]'ü ortalar</span>
<span class="cm"># bag 2 [17, 19]'u ortalar</span>

<span class="cm"># 2) Bağlanmış embedding'ler: girdi ve çıktı projeksiyonu arasında ağırlık paylaşımı</span>
<span class="cm"># Dil modellerinde yaygın -- id -&gt; vec eşleyen aynı matris</span>
<span class="cm"># gizli vec -&gt; vocab üzerinde logit'leri de eşler.</span>
<span class="kw">class</span> <span class="fn">TiedLM</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, d_model):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embed = nn.<span class="fn">Embedding</span>(vocab_size, d_model)
        <span class="cm"># Gövde buraya gelirdi (örn. transformer katmanları)</span>
        <span class="cm"># Çıktı projeksiyonu girdi embedding'iyle ağırlık paylaşır</span>
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        x = self.<span class="fn">embed</span>(ids)
        <span class="cm"># ... katmanlar ...</span>
        <span class="cm"># LM başlığı için embed.weight'i projeksiyon matrisi olarak kullan:</span>
        <span class="cm"># logits = x @ self.embed.weight.T</span>
        <span class="kw">return</span> x

<span class="cm"># 3) Dondurulmuş önceden eğitilmiş + küçük eğitilebilir adapter</span>
<span class="kw">class</span> <span class="fn">AdaptedEmbedding</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, pretrained_weight, adapter_dim=<span class="num">64</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        V, D = pretrained_weight.shape
        self.frozen = nn.Embedding.<span class="fn">from_pretrained</span>(pretrained_weight, freeze=<span class="kw">True</span>)
        self.adapter = nn.<span class="fn">Linear</span>(D, adapter_dim, bias=<span class="kw">False</span>)
        nn.init.<span class="fn">zeros_</span>(self.adapter.weight)        <span class="cm"># özdeşlik olarak başla, nazikçe değiştir</span>
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        <span class="kw">return</span> self.<span class="fn">frozen</span>(ids) + self.<span class="fn">adapter</span>(self.<span class="fn">frozen</span>(ids))</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">EmbeddingBag = birden çok embedding'in ortalaması (ya da toplamı) -- sözcük embedding'lerini ortalayarak cümle vektörü almak gibi. sklearn average_word_embedding hilelerinin yaptığı bu.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

rng = np.random.default_rng(0)
vocab_size, embed_dim = 50, 16
emb_table = rng.standard_normal((vocab_size, embed_dim)) * 0.1

# 3 sentences with different lengths
sentences = [
    [4, 12, 7],
    [8, 22, 31, 19, 5],
    [3, 14],
]

# EmbeddingBag with 'mean' mode
bag_vectors = []
for sent in sentences:
    bag_vectors.append(emb_table[sent].mean(axis=0))
bag_vectors = np.stack(bag_vectors)

print('bag shape (n_sentences, embed_dim):', bag_vectors.shape)
print('per-sentence vector norms:', np.linalg.norm(bag_vectors, axis=1).round(3))</code></pre></div>
</div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>EmbeddingBag</code> lookup'ı azaltma (mean veya sum) ile birleştirir -- FastText stili bag-of-words sınıflandırıcılar için <code>embedding</code> ve sonrasında mean'dan çok daha hızlı. "offsets" sözdizimi değişken uzunluklu bag'leri verimli batch'lemenize izin verir. 2) Bağlanmış embedding'ler bir dil modelinde girdi embedding'i ile çıktı projeksiyonu arasında ağırlık paylaşır. Bu kabaca embedding/çıktının parametre sayısını yarıya indirir ve düzenleyici olarak çalışır. GPT-2 ve çoğu modern LM embedding'leri bağlar. 3) İnce ayar için adapter kalıbı: önceden eğitilmiş embedding'i dondurun ve üzerine küçük bir eğitilebilir adapter ekleyin. Bu, modelin alanınıza uyum sağlamasına izin verirken tüm embedding matrisini ince ayarlamaya kıyasla çok az parametre eğitir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">EmbeddingBag</div><div class="card-body">Lookup + reduce tek işlem. embedding + mean'dan daha hızlı. FastText, öneri sistemlerinde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Bağlanmış embedding'ler</div><div class="card-body">Girdi/çıktı ağırlıklarını paylaş. Bellek tasarrufu, düzenler. LM'lerde standart.</div></div>
<div class="calc-card"><div class="card-title">Dondurulmuş + adapter</div><div class="card-body">Önceden eğitilmiş dondurulmuş, küçük ekstra eğitilebilir. Ucuz ince ayar.</div></div>
<div class="calc-card"><div class="card-title">Hash embedding</div><div class="card-body">ID'leri daha küçük tabloya hash'le. Çok büyük sözlükler için (öneri sistemleri).</div></div>
<div class="calc-card"><div class="card-title">Quantize embedding</div><div class="card-body">Çıkarım için int8 ağırlıklar. 4x daha küçük, küçük doğruluk kaybı.</div></div>
<div class="calc-card"><div class="card-title">Çok-vektör embedding</div><div class="card-body">Her token birden fazla vektör alır (anlam ayrıştırma). Üretimde nadir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Toparlanma: Embedding Boru Hattı</h2>

<p class="l-text">Uçtan uca görünüm: metinden modele hazır embedlenmiş diziye.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="cm"># Boru hattı: metin -&gt; tokenizer -&gt; ids -&gt; embedding -&gt; model</span>

<span class="cm"># Aşama 1: tokenize et</span>
<span class="cm"># from transformers import AutoTokenizer</span>
<span class="cm"># tok = AutoTokenizer.from_pretrained("bert-base-uncased")</span>
<span class="cm"># enc = tok("This movie was great!", return_tensors="pt")</span>
<span class="cm"># input_ids = enc["input_ids"]            # (1, T)</span>

<span class="cm"># (offline demo için sahte)</span>
input_ids = torch.<span class="fn">tensor</span>([[<span class="num">101</span>, <span class="num">2023</span>, <span class="num">3185</span>, <span class="num">2001</span>, <span class="num">2307</span>, <span class="num">999</span>, <span class="num">102</span>]])

<span class="cm"># Aşama 2: token embedding</span>
embed = nn.<span class="fn">Embedding</span>(num_embeddings=<span class="num">30522</span>, embedding_dim=<span class="num">768</span>, padding_idx=<span class="num">0</span>)
token_emb = <span class="fn">embed</span>(input_ids)                <span class="cm"># (1, T, 768)</span>

<span class="cm"># Aşama 3: pozisyon embedding</span>
pos_embed = nn.<span class="fn">Embedding</span>(<span class="num">512</span>, <span class="num">768</span>)
positions = torch.<span class="fn">arange</span>(input_ids.<span class="fn">size</span>(<span class="num">1</span>)).<span class="fn">unsqueeze</span>(<span class="num">0</span>)
pos_emb = <span class="fn">pos_embed</span>(positions)              <span class="cm"># (1, T, 768)</span>

<span class="cm"># Aşama 4: birleştir + normalleştir + dropout</span>
x = token_emb + pos_emb
x = nn.<span class="fn">LayerNorm</span>(<span class="num">768</span>)(x)
x = nn.<span class="fn">Dropout</span>(<span class="num">0.1</span>)(x)

<span class="fn">print</span>(x.shape)                              <span class="cm"># (1, 7, 768)</span>
<span class="cm"># BertEncoder'a giren budur. Modelin geri kalanı attention katmanlarıdır.</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Toparlanma -- embedding boru hattı tek bir sklearn ifadesi olarak: tokenize, index ile arama, ortalama pool, sınıflandırıcı eğit.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# HashingVectorizer maps tokens -> fixed dim via hashing (a fast embedding-bag analog)
vec = HashingVectorizer(n_features=2 ** 11, ngram_range=(1, 2), alternate_sign=False)
X = vec.transform(df_reviews['review'])
y = df_reviews['label'].values

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=0)
clf = LogisticRegression(max_iter=500).fit(X_tr, y_tr)
print(f'hashing-embedding pipeline accuracy: {accuracy_score(y_te, clf.predict(X_te)):.3f}')
print('feature dim:', X.shape[1])</code></pre></div>
</div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Önceden eğitilmiş bir tokenizer kullanarak ham metni tamsayı ID'lere tokenize eder (BERT vocab'ı 30522'dir). Çıktı bir token ID tensor'ı artı bir attention maskesidir. 2) Token embedding lookup her ID'yi 768 boyutlu bir vektöre dönüştürür -- girdi gösteriminin "ne" bileşeni. 3) Pozisyon embedding lookup "nerede" bileşenini ekler. Her ikisi de <code>nn.Embedding</code> modüldür, sadece farklı vocab boyutlarıyla. 4) Topla, ölçeği stabilize etmek için LayerNorm uygula, düzenleme için dropout uygula. Bu BERT girdi boru hattı 5 satırda; sonrasındaki her şey bu gösterim üzerinde hareket eden attention ve ileri besleme katmanlarıdır. Bu boru hattını anlamak transformer'ları anlamanın yarısıdır.</p>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Embedding, ayrık token ID'lerini yoğun vektörlere eşleyen öğrenilebilir bir lookup tablosudur.<br><strong>2.</strong> <code>nn.Embedding(V, D)</code> katmandır; vektör tensor'u almak için onu ID tensor'uyla indeksleyin.<br><strong>3.</strong> <code>padding_idx</code> bir satırı sıfırda sabitler ve gradyan güncellemelerinden hariç tutar.<br><strong>4.</strong> Önceden eğitilmiş embedding'ler (GloVe, FastText) ücretsiz geometrik yapı sağlar; <code>from_pretrained</code> ile yükleyin ve veri küçükken dondurun.<br><strong>5.</strong> Alt kelime tokenizasyonu (BPE, WordPiece, SentencePiece) OOV'yi ortadan kaldırır ve morfoloji boyunca parametre paylaşır.<br><strong>6.</strong> Transformer'lar token embedding'e pozisyonel embedding (sinüzoidal veya öğrenilmiş) ekler -- attention aksi halde sıra değişmezdir.<br><strong>7.</strong> EmbeddingBag lookup'ı azaltma ile birleştirir; bağlanmış embedding'ler dil modellerinde girdi/çıktı ağırlıklarını paylaşır.<br><strong>8.</strong> Sonraki ders: attention ve transformer'lar -- bu embedlenmiş diziler üzerinde çalışan mimari.</div></div>
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

  function pePlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var positions = []; for (var p=0;p<100;p++) positions.push(p);
    var dims = [0, 8, 16, 32, 48];
    var d_model = 64;
    var traces = dims.map(function(d, k) {
      var ys = positions.map(function(p){
        var div = Math.exp(-(d) * Math.log(10000) / d_model);
        return d % 2 === 0 ? Math.sin(p*div) : Math.cos(p*div);
      });
      var colors = [T.accent, '#4ecdc4', '#f87171', '#a78bfa', '#fbbf24'];
      return {x: positions, y: ys, mode:'lines', type:'scatter',
              name: 'dim '+d, line:{color: colors[k], width: 2}};
    });
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Sinüzoidal Pozisyon Kodlaması':'Sinusoidal Positional Encoding', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'pozisyon':'position', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'değer':'value', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, traces, layout, {responsive:true, displayModeBar:false});
  }

  function pcaPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    // Synthetic clusters
    function cluster(cx, cy, n, label, color, names) {
      var xs=[],ys=[],txt=[];
      for (var i=0;i<n;i++){
        xs.push(cx + (Math.random()-0.5)*1.0);
        ys.push(cy + (Math.random()-0.5)*1.0);
        txt.push(names[i]);
      }
      return {x:xs, y:ys, mode:'markers+text', type:'scatter', name:label,
              marker:{size:10, color:color, line:{color:'rgba(255,255,255,0.3)', width:1}},
              text:txt, textposition:'top center', textfont:{color:T.text,size:10}};
    }
    var royalty = cluster(2, 2, 4, lang==='tr'?'kraliyet':'royalty', T.accent, ['king','queen','prince','princess']);
    var animals = cluster(-2, 2, 4, lang==='tr'?'hayvanlar':'animals', '#4ecdc4', ['cat','dog','fish','bird']);
    var emotion = cluster(-2, -2, 4, lang==='tr'?'duygu':'emotion', '#f87171', ['happy','joyful','sad','angry']);
    var cities = cluster(2, -2, 4, lang==='tr'?'şehirler':'cities', '#a78bfa', ['Paris','Berlin','London','Tokyo']);
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Eğitilmiş Embedding\\'lerin 2B PCA Projeksiyonu':'2D PCA of Trained Embeddings', font:{color:T.text,size:14}},
      xaxis:{title:'PC1', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:'PC2', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}}
    });
    Plotly.newPlot(id, [royalty, animals, emotion, cities], layout, {responsive:true, displayModeBar:false});
  }

  pePlot('plot-pl8-pe-en','en');
  pcaPlot('plot-pl8-pca-en','en');
  pePlot('plot-pl8-pe-tr','tr');
  pcaPlot('plot-pl8-pca-tr','tr');
}, 250);</script>
`
};
