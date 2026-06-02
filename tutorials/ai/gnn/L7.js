window.GNN_L7 = {
en: `<p class="l-text"><strong>Now we put GNNs to work on the three canonical task families.</strong> Node classification asks "what is this node?" and is the easiest — Cora and Citeseer are solved with 2-layer GCN out of the box. Link prediction asks "do these two nodes go together?" and introduces negative sampling, which is the only tricky engineering bit (you need balanced positive/negative edge samples and the right metric — AUC, Hits@K, MRR — not accuracy). Graph classification asks "what is this whole graph?" and adds one new ingredient: a readout/pooling layer that turns per-node embeddings into a single graph vector. The architectures barely change between tasks; the loss, the data split, and the metric do.</p>

<p class="l-text">In this lesson we walk all three tasks end-to-end with PyG snippets (DEMO, since PyG needs compiled C++ extensions Pyodide does not have) and Pyodide-equivalent NumPy implementations that you can run in the browser. We use the customer/orders/products datasets you already have loaded for a real link-prediction example, and a synthetic stochastic block model for node classification with manual training. By the end you will know which loss, metric, and split protocol to use for each task — and how to avoid the most common evaluation pitfalls (data leakage in transductive splits, unbalanced negative sampling, message-passing through test edges).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Set up node classification on Cora with the standard transductive split (140 / 500 / 1000)</li>
<li>Implement link prediction with negative sampling and the dot-product decoder</li>
<li>Pick the right metric per task: F1 (node), AUC / Hits@K / MRR (link), ROC-AUC (graph)</li>
<li>Build a graph-classification model with mean / sum / attention pooling readout</li>
<li>Avoid the four common pitfalls: leak, neg-sampling bias, oversmoothing, depth confusion</li>
<li>Map a real dataset (orders) into a link-prediction task and evaluate it</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Node Classification — The Easy One</h2>
<p class="l-text">Setup: one big graph, a few labeled nodes, predict labels for the rest. Standard <strong>transductive</strong> setup — the model sees all node features and edges at training time, but only loss-trains on labeled nodes. Cora's standard split: 20 labeled nodes per class (140 total), 500 validation, 1000 test, the rest unlabeled but used for message passing.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Loss</div><div class="card-body">Cross-entropy on labeled nodes only: $\\mathcal{L} = -\\sum_{i \\in V_L}\\sum_c y_{ic}\\log\\hat{y}_{ic}$.</div></div>
<div class="calc-card"><div class="card-title">Metric</div><div class="card-body">Accuracy (balanced datasets) or macro-F1 (imbalanced). Always report on a held-out test mask.</div></div>
<div class="calc-card"><div class="card-title">Architecture</div><div class="card-body">2-layer GCN/GAT/SAGE with hidden dim 16–256 and dropout 0.5. More layers usually hurt (oversmoothing).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> GCNConv
<span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> Planetoid

ds = <span class="fn">Planetoid</span>(<span class="str">"/tmp/cora"</span>, <span class="str">"Cora"</span>)
data = ds[<span class="num">0</span>]

<span class="kw">class</span> <span class="fn">GCN</span>(torch.nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_d, h, out_d):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">self</span>.c1 = <span class="fn">GCNConv</span>(in_d, h); <span class="kw">self</span>.c2 = <span class="fn">GCNConv</span>(h, out_d)
    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, ei):
        x = F.<span class="fn">dropout</span>(F.<span class="fn">relu</span>(<span class="kw">self</span>.<span class="fn">c1</span>(x, ei)), p=<span class="num">0.5</span>, training=<span class="kw">self</span>.training)
        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">c2</span>(x, ei)

m = <span class="fn">GCN</span>(ds.num_features, <span class="num">16</span>, ds.num_classes)
opt = torch.optim.<span class="fn">Adam</span>(m.<span class="fn">parameters</span>(), lr=<span class="num">0.01</span>, weight_decay=<span class="num">5e-4</span>)
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    m.<span class="fn">train</span>(); opt.<span class="fn">zero_grad</span>()
    out = <span class="fn">m</span>(data.x, data.edge_index)
    loss = F.<span class="fn">cross_entropy</span>(out[data.train_mask], data.y[data.train_mask])
    loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
<span class="fn">print</span>(<span class="str">"Final test acc ~ 0.81"</span>)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Cora-style transductive node classification on a stochastic block model. Manual NumPy backprop, ~200 epochs.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

<span class="cm"># Synthetic 3-class graph: 3 communities of 30 nodes</span>
sizes = [<span class="num">30</span>,<span class="num">30</span>,<span class="num">30</span>]; p_in, p_out = <span class="num">0.30</span>, <span class="num">0.02</span>
G = nx.<span class="fn">stochastic_block_model</span>(sizes, [[p_in,p_out,p_out],[p_out,p_in,p_out],[p_out,p_out,p_in]], seed=<span class="num">3</span>)
N, C = <span class="num">90</span>, <span class="num">3</span>
y = np.<span class="fn">array</span>([G.nodes[n][<span class="str">"block"</span>] <span class="kw">for</span> n <span class="kw">in</span> G.<span class="fn">nodes</span>()])

A = nx.<span class="fn">to_numpy_array</span>(G) + np.<span class="fn">eye</span>(N)
d = A.<span class="fn">sum</span>(axis=<span class="num">1</span>); A_hat = np.<span class="fn">diag</span>(<span class="num">1.0</span>/np.<span class="fn">sqrt</span>(d)) @ A @ np.<span class="fn">diag</span>(<span class="num">1.0</span>/np.<span class="fn">sqrt</span>(d))

<span class="cm"># 5 labeled nodes per class</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
train_mask = np.<span class="fn">zeros</span>(N, dtype=<span class="fn">bool</span>)
<span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(C):
    idx = np.<span class="fn">where</span>(y==c)[<span class="num">0</span>]
    train_mask[rng.<span class="fn">choice</span>(idx, <span class="num">5</span>, replace=<span class="kw">False</span>)] = <span class="kw">True</span>
test_mask = ~train_mask

X = np.<span class="fn">eye</span>(N)
H_DIM = <span class="num">16</span>
W0 = rng.<span class="fn">normal</span>(size=(N, H_DIM))*<span class="num">0.3</span>; W1 = rng.<span class="fn">normal</span>(size=(H_DIM, C))*<span class="num">0.3</span>
<span class="kw">def</span> <span class="fn">softmax</span>(z): z=z-z.<span class="fn">max</span>(<span class="num">1</span>,keepdims=<span class="kw">True</span>); e=np.<span class="fn">exp</span>(z); <span class="kw">return</span> e/e.<span class="fn">sum</span>(<span class="num">1</span>,keepdims=<span class="kw">True</span>)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">201</span>):
    Z1 = A_hat @ X @ W0; H1 = np.<span class="fn">maximum</span>(<span class="num">0</span>, Z1)
    Z2 = A_hat @ H1 @ W1; P = <span class="fn">softmax</span>(Z2)
    Y = np.<span class="fn">eye</span>(C)[y]
    loss = -np.<span class="fn">sum</span>(np.<span class="fn">log</span>(P[train_mask]+<span class="num">1e-12</span>) * Y[train_mask]) / train_mask.<span class="fn">sum</span>()
    <span class="kw">if</span> epoch % <span class="num">50</span> == <span class="num">0</span>:
        test_acc = (P[test_mask].<span class="fn">argmax</span>(<span class="num">1</span>) == y[test_mask]).<span class="fn">mean</span>()
        <span class="fn">print</span>(f<span class="str">"epoch {epoch}  loss={loss:.4f}  test_acc={test_acc:.3f}"</span>)
    dZ2 = (P - Y) * train_mask[:,<span class="kw">None</span>] / train_mask.<span class="fn">sum</span>()
    dW1 = (A_hat @ H1).T @ dZ2
    dH1 = A_hat.T @ dZ2 @ W1.T
    dZ1 = dH1 * (Z1 > <span class="num">0</span>)
    dW0 = (A_hat @ X).T @ dZ1
    W1 -= <span class="num">0.05</span>*dW1; W0 -= <span class="num">0.05</span>*dW0
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Link Prediction — The Tricky One</h2>
<p class="l-text">Setup: predict whether an edge exists between two nodes. Train on a subset of edges (positives) and an equal number of randomly sampled non-edges (negatives), score each pair via the dot product (or MLP) of their embeddings, evaluate on held-out edges.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Encoder</div><div class="card-body">A GNN that produces per-node embeddings $z_i$. GraphSAGE, GAT, or GCN all work.</div></div>
<div class="calc-card"><div class="card-title">Decoder</div><div class="card-body">$\\hat{y}_{ij} = \\sigma(z_i^\\top z_j)$ for plain link prediction. For knowledge graphs (typed edges): $\\hat{y}_{ij,r} = z_i^\\top R_r z_j$ (DistMult, ComplEx).</div></div>
<div class="calc-card"><div class="card-title">Loss</div><div class="card-body">Binary cross-entropy with negative sampling. Or BPR (pairwise): $-\\log\\sigma(\\hat{y}_{\\text{pos}} - \\hat{y}_{\\text{neg}})$.</div></div>
<div class="calc-card"><div class="card-title">Metric</div><div class="card-body">AUC for plain LP. Hits@K and MRR for ranked retrieval (does the true edge appear in top-K candidates?).</div></div>
</div>

<div class="calc-highlight"><strong>Critical pitfall:</strong> when splitting edges into train/val/test, <em>remove the val and test edges from the training graph</em>. If you leave them in, the GNN sees the answer at training time. PyG's <code>RandomLinkSplit</code> handles this; doing it by hand is the #1 source of inflated link-prediction numbers.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Link Prediction Code (DEMO + Pyodide)</h2>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> SAGEConv
<span class="kw">from</span> torch_geometric.transforms <span class="kw">import</span> RandomLinkSplit
<span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> Planetoid
<span class="kw">from</span> torch_geometric.utils <span class="kw">import</span> negative_sampling

ds = <span class="fn">Planetoid</span>(<span class="str">"/tmp/cite"</span>, <span class="str">"Citeseer"</span>)
transform = <span class="fn">RandomLinkSplit</span>(num_val=<span class="num">0.05</span>, num_test=<span class="num">0.1</span>, is_undirected=<span class="kw">True</span>)
train_d, val_d, test_d = <span class="fn">transform</span>(ds[<span class="num">0</span>])

<span class="kw">class</span> <span class="fn">Encoder</span>(torch.nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_d, h):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">self</span>.c1 = <span class="fn">SAGEConv</span>(in_d, h); <span class="kw">self</span>.c2 = <span class="fn">SAGEConv</span>(h, h)
    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, ei):
        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">c2</span>(F.<span class="fn">relu</span>(<span class="kw">self</span>.<span class="fn">c1</span>(x, ei)), ei)

m = <span class="fn">Encoder</span>(ds.num_features, <span class="num">64</span>)
opt = torch.optim.<span class="fn">Adam</span>(m.<span class="fn">parameters</span>(), lr=<span class="num">0.005</span>)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">100</span>):
    m.<span class="fn">train</span>(); opt.<span class="fn">zero_grad</span>()
    z = <span class="fn">m</span>(train_d.x, train_d.edge_index)
    pos = train_d.edge_label_index[:, train_d.edge_label == <span class="num">1</span>]
    neg = <span class="fn">negative_sampling</span>(train_d.edge_index, num_nodes=z.<span class="fn">size</span>(<span class="num">0</span>), num_neg_samples=pos.<span class="fn">size</span>(<span class="num">1</span>))
    pos_score = (z[pos[<span class="num">0</span>]] * z[pos[<span class="num">1</span>]]).<span class="fn">sum</span>(-<span class="num">1</span>)
    neg_score = (z[neg[<span class="num">0</span>]] * z[neg[<span class="num">1</span>]]).<span class="fn">sum</span>(-<span class="num">1</span>)
    loss = F.<span class="fn">binary_cross_entropy_with_logits</span>(
        torch.<span class="fn">cat</span>([pos_score, neg_score]),
        torch.<span class="fn">cat</span>([torch.<span class="fn">ones_like</span>(pos_score), torch.<span class="fn">zeros_like</span>(neg_score)]))
    loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Real link prediction on the customer-product bipartite graph from df_orders. Use Adamic-Adar (closed-form) and a node2vec-style embedding decoder for comparison.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
sub = df_orders.<span class="fn">head</span>(<span class="num">500</span>)
B = nx.<span class="fn">Graph</span>()
<span class="kw">for</span> _, row <span class="kw">in</span> sub.<span class="fn">iterrows</span>():
    B.<span class="fn">add_edge</span>(f<span class="str">"C{row['customer_id']}"</span>, f<span class="str">"P{row['product_id']}"</span>)

edges = <span class="fn">list</span>(B.<span class="fn">edges</span>())
rng.<span class="fn">shuffle</span>(edges)
n_test = <span class="fn">max</span>(<span class="num">20</span>, <span class="fn">len</span>(edges) // <span class="num">10</span>)
test_edges = edges[:n_test]
train_edges = edges[n_test:]

<span class="cm"># Build training graph (test edges removed!)</span>
B_train = nx.<span class="fn">Graph</span>(); B_train.<span class="fn">add_edges_from</span>(train_edges)

<span class="cm"># Sample equal number of negatives (non-edges)</span>
nodes = <span class="fn">list</span>(B.<span class="fn">nodes</span>())
neg_test = []
<span class="kw">while</span> <span class="fn">len</span>(neg_test) < n_test:
    u, v = rng.<span class="fn">choice</span>(nodes, <span class="num">2</span>, replace=<span class="kw">False</span>)
    <span class="kw">if</span> <span class="kw">not</span> B.<span class="fn">has_edge</span>(u, v) <span class="kw">and</span> u.<span class="fn">startswith</span>(<span class="str">"C"</span>) != v.<span class="fn">startswith</span>(<span class="str">"C"</span>):
        neg_test.<span class="fn">append</span>((u, v))

<span class="cm"># Score with Adamic-Adar (closed-form classical baseline)</span>
<span class="kw">def</span> <span class="fn">aa_score</span>(G, u, v):
    cn = <span class="fn">set</span>(G.<span class="fn">neighbors</span>(u)) & <span class="fn">set</span>(G.<span class="fn">neighbors</span>(v))
    <span class="kw">return</span> <span class="fn">sum</span>(<span class="num">1.0</span> / np.<span class="fn">log</span>(G.<span class="fn">degree</span>(w) + <span class="num">1</span>) <span class="kw">for</span> w <span class="kw">in</span> cn <span class="kw">if</span> G.<span class="fn">degree</span>(w) > <span class="num">1</span>)

pos_scores = [<span class="fn">aa_score</span>(B_train, u, v) <span class="kw">for</span> u, v <span class="kw">in</span> test_edges]
neg_scores = [<span class="fn">aa_score</span>(B_train, u, v) <span class="kw">for</span> u, v <span class="kw">in</span> neg_test]
y_true = [<span class="num">1</span>]*<span class="fn">len</span>(pos_scores) + [<span class="num">0</span>]*<span class="fn">len</span>(neg_scores)
y_pred = pos_scores + neg_scores
<span class="fn">print</span>(f<span class="str">"Adamic-Adar AUC on customer-product LP: {roc_auc_score(y_true, y_pred):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"  (positive class score mean: {np.mean(pos_scores):.3f}, negative: {np.mean(neg_scores):.3f})"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Graph Classification — The Pooling Question</h2>
<p class="l-text">Setup: a dataset of $G$ small graphs, each with a single label (toxic / non-toxic, mutagenic / non-mutagenic). Run a GNN on each graph to get per-node embeddings, then <strong>pool</strong> them into a single graph vector for classification.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mean pool</div><div class="card-body">Average all node embeddings. Permutation-invariant, simple, strong baseline.</div></div>
<div class="calc-card"><div class="card-title">Sum pool</div><div class="card-body">Theoretically more expressive than mean (distinguishes graphs of different sizes). Used by GIN.</div></div>
<div class="calc-card"><div class="card-title">Attention pool</div><div class="card-body">Learned weights per node before averaging. <em>SAGPool</em>, <em>GMT</em>. Strong on molecule benchmarks.</div></div>
<div class="calc-card"><div class="card-title">Top-K / DiffPool</div><div class="card-body">Hierarchical: select / cluster nodes into super-nodes, repeat. <em>DiffPool</em> (Ying et al. 2018), <em>MinCutPool</em>.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> GINConv, global_add_pool
<span class="kw">from</span> torch_geometric.loader <span class="kw">import</span> DataLoader
<span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> TUDataset

ds = <span class="fn">TUDataset</span>(<span class="str">"/tmp/p"</span>, <span class="str">"PROTEINS"</span>)
loader = <span class="fn">DataLoader</span>(ds, batch_size=<span class="num">32</span>, shuffle=<span class="kw">True</span>)

<span class="kw">class</span> <span class="fn">GIN</span>(torch.nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_d, h, out_d):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">self</span>.c1 = <span class="fn">GINConv</span>(torch.nn.<span class="fn">Sequential</span>(torch.nn.<span class="fn">Linear</span>(in_d, h), torch.nn.<span class="fn">ReLU</span>(), torch.nn.<span class="fn">Linear</span>(h, h)))
        <span class="kw">self</span>.c2 = <span class="fn">GINConv</span>(torch.nn.<span class="fn">Sequential</span>(torch.nn.<span class="fn">Linear</span>(h, h),    torch.nn.<span class="fn">ReLU</span>(), torch.nn.<span class="fn">Linear</span>(h, h)))
        <span class="kw">self</span>.head = torch.nn.<span class="fn">Linear</span>(h, out_d)
    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, ei, batch):
        x = F.<span class="fn">relu</span>(<span class="kw">self</span>.<span class="fn">c1</span>(x, ei))
        x = F.<span class="fn">relu</span>(<span class="kw">self</span>.<span class="fn">c2</span>(x, ei))
        x = <span class="fn">global_add_pool</span>(x, batch)              <span class="cm"># per-graph readout</span>
        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">head</span>(x)
</code></pre></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The Right Metric for the Right Task</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Node classification</div><div class="card-body">Accuracy (balanced) or macro-F1. Cora reports test accuracy.</div></div>
<div class="calc-card"><div class="card-title">Link prediction (general)</div><div class="card-body">ROC-AUC on positive vs negative edges. Easy to compute, easy to game with too-easy negatives.</div></div>
<div class="calc-card"><div class="card-title">Link prediction (KG / recsys)</div><div class="card-body">Hits@K and MRR. For each true (head, relation) query, rank the true tail among all candidates. Hits@10 = fraction of queries where the true tail is in the top 10.</div></div>
<div class="calc-card"><div class="card-title">Graph classification</div><div class="card-body">Accuracy if balanced; ROC-AUC if not. PROTEINS uses accuracy; ogbg-molhiv uses ROC-AUC.</div></div>
<div class="calc-card"><div class="card-title">Graph regression</div><div class="card-body">MAE (QM9) or RMSE. ZINC uses MAE on logP.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Negative Sampling — The 80% of Link-Prediction Engineering</h2>
<p class="l-text">For link prediction, you sample $K$ negative pairs per positive at training (typically $K{=}1$). The choice of "negative" matters:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Uniform random</div><div class="card-body">Pick any non-edge uniformly. Cheapest. Many negatives end up too easy (clearly distant pairs), so signal is weak.</div></div>
<div class="calc-card"><div class="card-title">Type-aware</div><div class="card-body">For bipartite (user-item): only sample item negatives, not user-user. For KG: only sample type-compatible tails.</div></div>
<div class="calc-card"><div class="card-title">Hard negatives</div><div class="card-body">Pick negatives that the model currently scores high (mining). Used in PinSage. Risk: collapse if too hard.</div></div>
<div class="calc-card"><div class="card-title">In-batch</div><div class="card-body">Use other positives in the batch as negatives. Standard in contrastive learning. Free, simple, strong.</div></div>
</div>

<div class="calc-highlight"><strong>Production rule:</strong> always start with uniform random negatives. Add type-awareness once your task has it. Add hard negatives only if you have a baseline that converges and you want to squeeze more accuracy.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Common Pitfalls (Real Errors From Real Papers)</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Test-edge leakage</div><div class="card-body">Forgetting to remove val/test edges from the training graph. Inflates AUC by 5–20 points. Use <code>RandomLinkSplit</code>.</div></div>
<div class="calc-card"><div class="card-title">Easy negatives</div><div class="card-body">Sampling negatives from the entire (sparse) graph means most are trivially easy. AUC near 1.0 but worthless. Use type-aware or hard negs.</div></div>
<div class="calc-card"><div class="card-title">Wrong metric for KG</div><div class="card-body">Reporting AUC on KG completion is meaningless — use Hits@K and MRR. KG positives are <em>rare</em>; you want ranked retrieval.</div></div>
<div class="calc-card"><div class="card-title">Oversmoothing &gt; 4 layers</div><div class="card-body">Deeper GCN looks like better feature mixing but actually destroys node distinctions. Default to 2; use APPNP for "deeper" semantics.</div></div>
<div class="calc-card"><div class="card-title">No baseline</div><div class="card-body">Errica et al. (2020) showed many GNN papers were beaten by MLP on raw features. Always run XGBoost-on-PageRank-features and Adamic-Adar baselines before claiming a result.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">Three task families, one architectural backbone, three different splits and metrics. Node classification is easiest, graph classification adds pooling, link prediction adds negative sampling and is where most engineering pitfalls hide. The encoder (GCN / GAT / SAGE / GIN) you use matters less than the data split, the negative sampler, and the metric.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Node task: cross-entropy on labeled nodes, mask the rest, accuracy/F1.</li>
<li>Link task: encoder + dot-product decoder, BCE with negative sampling, AUC / Hits@K / MRR.</li>
<li>Graph task: encoder + readout (mean / sum / attention pool) + classifier, ROC-AUC.</li>
<li>Always remove test edges from the training graph for link prediction.</li>
<li>Choose negatives carefully — uniform is fine to start, type-aware is usually a free win.</li>
<li>Run classical baselines (Adamic-Adar, label propagation, PageRank+XGB) first.</li>
</ul>
</div>

<p class="l-text">In the <strong>L8 capstone</strong> we tie everything together: build a knowledge graph from the customers / products / orders tables, train a GNN-style aggregator, and produce real product recommendations via link prediction. We will compare the GNN approach against pure collaborative filtering and Adamic-Adar baselines and discuss the tradeoffs.</p>
</div>`,
tr: `<p class="l-text"><strong>Şimdi GNN'leri üç klasik görev ailesinde iş başına alıyoruz.</strong> Düğüm sınıflandırma "bu düğüm nedir?" diye sorar ve en kolayıdır — Cora ve Citeseer kutu dışında 2 katmanlı GCN ile çözülür. Bağlantı tahmini "bu iki düğüm uyumlu mu?" diye sorar ve negatif örneklemeyi getirir, ki bu tek zorlu mühendislik parçasıdır (dengeli pozitif/negatif kenar örneklerine ve doğru metriğe — AUC, Hits@K, MRR — ihtiyacınız var, doğruluğa değil). Graf sınıflandırma "bu bütün graf nedir?" diye sorar ve tek bir yeni bileşen ekler: düğüm-başına gömme vektörlerini tek bir graf vektörüne dönüştüren bir readout/havuzlama katmanı. Mimariler görevler arasında neredeyse hiç değişmez; kayıp, veri ayrımı ve metrik değişir.</p>

<p class="l-text">Bu derste tüm üç görevi PyG kod parçacıkları (DEMO, çünkü PyG Pyodide'de olmayan derlenmiş C++ uzantıları gerektirir) ve tarayıcıda çalıştırabileceğiniz Pyodide-eşdeğer NumPy uygulamaları ile uçtan uca yürüyoruz. Gerçek bir bağlantı tahmini örneği için zaten yüklü müşteri/sipariş/ürün veri kümelerini kullanıyoruz ve manuel eğitim ile düğüm sınıflandırma için sentetik bir stokastik blok modeli. Sonunda her görev için hangi kayıp, metrik ve ayrım protokolünün kullanılacağını bileceksiniz — ve en yaygın değerlendirme tuzaklarından nasıl kaçınacağınızı (transdüktif ayrımlarda veri sızıntısı, dengesiz negatif örnekleme, test kenarları üzerinden mesaj geçişi).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Cora'da standart transdüktif ayrım (140 / 500 / 1000) ile düğüm sınıflandırma kurmak</li>
<li>Negatif örnekleme ve iç çarpım kod çözücü ile bağlantı tahmini uygulamak</li>
<li>Görev başına doğru metriği seçmek: F1 (düğüm), AUC / Hits@K / MRR (bağlantı), ROC-AUC (graf)</li>
<li>Ortalama / toplam / dikkat havuzlama readout ile bir graf-sınıflandırma modeli inşa etmek</li>
<li>Dört yaygın tuzaktan kaçınmak: sızıntı, negatif örnekleme önyargısı, aşırı düzleşme, derinlik karışıklığı</li>
<li>Gerçek bir veri kümesini (siparişler) bağlantı tahmini görevine eşlemek ve değerlendirmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Düğüm Sınıflandırma — Kolay Olan</h2>
<p class="l-text">Kurulum: bir büyük graf, birkaç etiketli düğüm, geri kalanı için etiketleri tahmin et. Standart <strong>transdüktif</strong> kurulum — model eğitim zamanında tüm düğüm özelliklerini ve kenarları görür, ancak sadece etiketli düğümler üzerinde kayıp eğitir. Cora'nın standart ayrımı: sınıf başına 20 etiketli düğüm (toplam 140), 500 doğrulama, 1000 test, geri kalan etiketsiz ama mesaj geçişi için kullanılır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kayıp</div><div class="card-body">Sadece etiketli düğümlerde çapraz entropi: $\\mathcal{L} = -\\sum_{i \\in V_L}\\sum_c y_{ic}\\log\\hat{y}_{ic}$.</div></div>
<div class="calc-card"><div class="card-title">Metrik</div><div class="card-body">Doğruluk (dengeli veri kümeleri) veya makro-F1 (dengesiz). Her zaman tutulan bir test maskesi üzerinde rapor edin.</div></div>
<div class="calc-card"><div class="card-title">Mimari</div><div class="card-body">Gizli boyut 16-256 ve dropout 0.5 ile 2 katmanlı GCN/GAT/SAGE. Daha fazla katman genellikle zarar verir (aşırı düzleşme).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> GCNConv
<span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> Planetoid

ds = <span class="fn">Planetoid</span>(<span class="str">"/tmp/cora"</span>, <span class="str">"Cora"</span>)
data = ds[<span class="num">0</span>]

<span class="kw">class</span> <span class="fn">GCN</span>(torch.nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_d, h, out_d):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">self</span>.c1 = <span class="fn">GCNConv</span>(in_d, h); <span class="kw">self</span>.c2 = <span class="fn">GCNConv</span>(h, out_d)
    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, ei):
        x = F.<span class="fn">dropout</span>(F.<span class="fn">relu</span>(<span class="kw">self</span>.<span class="fn">c1</span>(x, ei)), p=<span class="num">0.5</span>, training=<span class="kw">self</span>.training)
        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">c2</span>(x, ei)

m = <span class="fn">GCN</span>(ds.num_features, <span class="num">16</span>, ds.num_classes)
opt = torch.optim.<span class="fn">Adam</span>(m.<span class="fn">parameters</span>(), lr=<span class="num">0.01</span>, weight_decay=<span class="num">5e-4</span>)
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    m.<span class="fn">train</span>(); opt.<span class="fn">zero_grad</span>()
    out = <span class="fn">m</span>(data.x, data.edge_index)
    loss = F.<span class="fn">cross_entropy</span>(out[data.train_mask], data.y[data.train_mask])
    loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
<span class="fn">print</span>(<span class="str">"Son test doğruluğu ~ 0.81"</span>)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Stokastik blok modelinde Cora-tarzı transdüktif düğüm sınıflandırma. Manuel NumPy geri yayılımı, ~200 dönem.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

<span class="cm"># Sentetik 3-sınıflı graf: 30 düğümlü 3 topluluk</span>
sizes = [<span class="num">30</span>,<span class="num">30</span>,<span class="num">30</span>]; p_in, p_out = <span class="num">0.30</span>, <span class="num">0.02</span>
G = nx.<span class="fn">stochastic_block_model</span>(sizes, [[p_in,p_out,p_out],[p_out,p_in,p_out],[p_out,p_out,p_in]], seed=<span class="num">3</span>)
N, C = <span class="num">90</span>, <span class="num">3</span>
y = np.<span class="fn">array</span>([G.nodes[n][<span class="str">"block"</span>] <span class="kw">for</span> n <span class="kw">in</span> G.<span class="fn">nodes</span>()])

A = nx.<span class="fn">to_numpy_array</span>(G) + np.<span class="fn">eye</span>(N)
d = A.<span class="fn">sum</span>(axis=<span class="num">1</span>); A_hat = np.<span class="fn">diag</span>(<span class="num">1.0</span>/np.<span class="fn">sqrt</span>(d)) @ A @ np.<span class="fn">diag</span>(<span class="num">1.0</span>/np.<span class="fn">sqrt</span>(d))

<span class="cm"># Sınıf başına 5 etiketli düğüm</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
train_mask = np.<span class="fn">zeros</span>(N, dtype=<span class="fn">bool</span>)
<span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(C):
    idx = np.<span class="fn">where</span>(y==c)[<span class="num">0</span>]
    train_mask[rng.<span class="fn">choice</span>(idx, <span class="num">5</span>, replace=<span class="kw">False</span>)] = <span class="kw">True</span>
test_mask = ~train_mask

X = np.<span class="fn">eye</span>(N)
H_DIM = <span class="num">16</span>
W0 = rng.<span class="fn">normal</span>(size=(N, H_DIM))*<span class="num">0.3</span>; W1 = rng.<span class="fn">normal</span>(size=(H_DIM, C))*<span class="num">0.3</span>
<span class="kw">def</span> <span class="fn">softmax</span>(z): z=z-z.<span class="fn">max</span>(<span class="num">1</span>,keepdims=<span class="kw">True</span>); e=np.<span class="fn">exp</span>(z); <span class="kw">return</span> e/e.<span class="fn">sum</span>(<span class="num">1</span>,keepdims=<span class="kw">True</span>)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">201</span>):
    Z1 = A_hat @ X @ W0; H1 = np.<span class="fn">maximum</span>(<span class="num">0</span>, Z1)
    Z2 = A_hat @ H1 @ W1; P = <span class="fn">softmax</span>(Z2)
    Y = np.<span class="fn">eye</span>(C)[y]
    loss = -np.<span class="fn">sum</span>(np.<span class="fn">log</span>(P[train_mask]+<span class="num">1e-12</span>) * Y[train_mask]) / train_mask.<span class="fn">sum</span>()
    <span class="kw">if</span> epoch % <span class="num">50</span> == <span class="num">0</span>:
        test_acc = (P[test_mask].<span class="fn">argmax</span>(<span class="num">1</span>) == y[test_mask]).<span class="fn">mean</span>()
        <span class="fn">print</span>(f<span class="str">"dönem {epoch}  kayıp={loss:.4f}  test_doğruluk={test_acc:.3f}"</span>)
    dZ2 = (P - Y) * train_mask[:,<span class="kw">None</span>] / train_mask.<span class="fn">sum</span>()
    dW1 = (A_hat @ H1).T @ dZ2
    dH1 = A_hat.T @ dZ2 @ W1.T
    dZ1 = dH1 * (Z1 > <span class="num">0</span>)
    dW0 = (A_hat @ X).T @ dZ1
    W1 -= <span class="num">0.05</span>*dW1; W0 -= <span class="num">0.05</span>*dW0
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bağlantı Tahmini — Zorlu Olan</h2>
<p class="l-text">Kurulum: iki düğüm arasında kenar olup olmadığını tahmin et. Bir alt küme kenar üzerinde (pozitifler) ve eşit sayıda rastgele örneklenmiş kenar olmayanlar (negatifler) üzerinde eğit, her çifti gömme vektörlerinin iç çarpımı (veya MLP) ile skorla, tutulan kenarlarda değerlendir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kodlayıcı</div><div class="card-body">Düğüm başına gömme vektörleri $z_i$ üreten bir GNN. GraphSAGE, GAT veya GCN hepsi çalışır.</div></div>
<div class="calc-card"><div class="card-title">Kod çözücü</div><div class="card-body">Düz bağlantı tahmini için $\\hat{y}_{ij} = \\sigma(z_i^\\top z_j)$. Bilgi grafları için (tipli kenarlar): $\\hat{y}_{ij,r} = z_i^\\top R_r z_j$ (DistMult, ComplEx).</div></div>
<div class="calc-card"><div class="card-title">Kayıp</div><div class="card-body">Negatif örneklemeli ikili çapraz entropi. Veya BPR (ikili): $-\\log\\sigma(\\hat{y}_{\\text{pos}} - \\hat{y}_{\\text{neg}})$.</div></div>
<div class="calc-card"><div class="card-title">Metrik</div><div class="card-body">Düz LP için AUC. Sıralı erişim için Hits@K ve MRR (gerçek kenar ilk K aday içinde mi?).</div></div>
</div>

<div class="calc-highlight"><strong>Kritik tuzak:</strong> kenarları eğitim/doğrulama/test'e ayırırken, <em>doğrulama ve test kenarlarını eğitim grafından kaldırın</em>. Bunları içeride bırakırsanız, GNN eğitim zamanında cevabı görür. PyG'nin <code>RandomLinkSplit</code>'i bunu yönetir; elle yapmak şişirilmiş bağlantı-tahmini sayılarının 1 numaralı kaynağıdır.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Bağlantı Tahmini Kodu (DEMO + Pyodide)</h2>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> SAGEConv
<span class="kw">from</span> torch_geometric.transforms <span class="kw">import</span> RandomLinkSplit
<span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> Planetoid
<span class="kw">from</span> torch_geometric.utils <span class="kw">import</span> negative_sampling

ds = <span class="fn">Planetoid</span>(<span class="str">"/tmp/cite"</span>, <span class="str">"Citeseer"</span>)
transform = <span class="fn">RandomLinkSplit</span>(num_val=<span class="num">0.05</span>, num_test=<span class="num">0.1</span>, is_undirected=<span class="kw">True</span>)
train_d, val_d, test_d = <span class="fn">transform</span>(ds[<span class="num">0</span>])

<span class="kw">class</span> <span class="fn">Encoder</span>(torch.nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_d, h):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">self</span>.c1 = <span class="fn">SAGEConv</span>(in_d, h); <span class="kw">self</span>.c2 = <span class="fn">SAGEConv</span>(h, h)
    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, ei):
        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">c2</span>(F.<span class="fn">relu</span>(<span class="kw">self</span>.<span class="fn">c1</span>(x, ei)), ei)

m = <span class="fn">Encoder</span>(ds.num_features, <span class="num">64</span>)
opt = torch.optim.<span class="fn">Adam</span>(m.<span class="fn">parameters</span>(), lr=<span class="num">0.005</span>)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">100</span>):
    m.<span class="fn">train</span>(); opt.<span class="fn">zero_grad</span>()
    z = <span class="fn">m</span>(train_d.x, train_d.edge_index)
    pos = train_d.edge_label_index[:, train_d.edge_label == <span class="num">1</span>]
    neg = <span class="fn">negative_sampling</span>(train_d.edge_index, num_nodes=z.<span class="fn">size</span>(<span class="num">0</span>), num_neg_samples=pos.<span class="fn">size</span>(<span class="num">1</span>))
    pos_score = (z[pos[<span class="num">0</span>]] * z[pos[<span class="num">1</span>]]).<span class="fn">sum</span>(-<span class="num">1</span>)
    neg_score = (z[neg[<span class="num">0</span>]] * z[neg[<span class="num">1</span>]]).<span class="fn">sum</span>(-<span class="num">1</span>)
    loss = F.<span class="fn">binary_cross_entropy_with_logits</span>(
        torch.<span class="fn">cat</span>([pos_score, neg_score]),
        torch.<span class="fn">cat</span>([torch.<span class="fn">ones_like</span>(pos_score), torch.<span class="fn">zeros_like</span>(neg_score)]))
    loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">df_orders'tan müşteri-ürün iki parçalı grafında gerçek bağlantı tahmini. Karşılaştırma için Adamic-Adar (kapalı form) ve node2vec-tarzı bir gömme vektörü kod çözücü kullanın.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
sub = df_orders.<span class="fn">head</span>(<span class="num">500</span>)
B = nx.<span class="fn">Graph</span>()
<span class="kw">for</span> _, row <span class="kw">in</span> sub.<span class="fn">iterrows</span>():
    B.<span class="fn">add_edge</span>(f<span class="str">"C{row['customer_id']}"</span>, f<span class="str">"P{row['product_id']}"</span>)

edges = <span class="fn">list</span>(B.<span class="fn">edges</span>())
rng.<span class="fn">shuffle</span>(edges)
n_test = <span class="fn">max</span>(<span class="num">20</span>, <span class="fn">len</span>(edges) // <span class="num">10</span>)
test_edges = edges[:n_test]
train_edges = edges[n_test:]

<span class="cm"># Eğitim grafını oluştur (test kenarları kaldırıldı!)</span>
B_train = nx.<span class="fn">Graph</span>(); B_train.<span class="fn">add_edges_from</span>(train_edges)

<span class="cm"># Eşit sayıda negatif (kenar olmayan) örnekle</span>
nodes = <span class="fn">list</span>(B.<span class="fn">nodes</span>())
neg_test = []
<span class="kw">while</span> <span class="fn">len</span>(neg_test) < n_test:
    u, v = rng.<span class="fn">choice</span>(nodes, <span class="num">2</span>, replace=<span class="kw">False</span>)
    <span class="kw">if</span> <span class="kw">not</span> B.<span class="fn">has_edge</span>(u, v) <span class="kw">and</span> u.<span class="fn">startswith</span>(<span class="str">"C"</span>) != v.<span class="fn">startswith</span>(<span class="str">"C"</span>):
        neg_test.<span class="fn">append</span>((u, v))

<span class="cm"># Adamic-Adar ile skor (kapalı form klasik temel)</span>
<span class="kw">def</span> <span class="fn">aa_score</span>(G, u, v):
    cn = <span class="fn">set</span>(G.<span class="fn">neighbors</span>(u)) & <span class="fn">set</span>(G.<span class="fn">neighbors</span>(v))
    <span class="kw">return</span> <span class="fn">sum</span>(<span class="num">1.0</span> / np.<span class="fn">log</span>(G.<span class="fn">degree</span>(w) + <span class="num">1</span>) <span class="kw">for</span> w <span class="kw">in</span> cn <span class="kw">if</span> G.<span class="fn">degree</span>(w) > <span class="num">1</span>)

pos_scores = [<span class="fn">aa_score</span>(B_train, u, v) <span class="kw">for</span> u, v <span class="kw">in</span> test_edges]
neg_scores = [<span class="fn">aa_score</span>(B_train, u, v) <span class="kw">for</span> u, v <span class="kw">in</span> neg_test]
y_true = [<span class="num">1</span>]*<span class="fn">len</span>(pos_scores) + [<span class="num">0</span>]*<span class="fn">len</span>(neg_scores)
y_pred = pos_scores + neg_scores
<span class="fn">print</span>(f<span class="str">"Müşteri-ürün LP'de Adamic-Adar AUC: {roc_auc_score(y_true, y_pred):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"  (pozitif sınıf skor ortalaması: {np.mean(pos_scores):.3f}, negatif: {np.mean(neg_scores):.3f})"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Graf Sınıflandırma — Havuzlama Sorusu</h2>
<p class="l-text">Kurulum: $G$ küçük graftan oluşan bir veri kümesi, her birinin tek bir etiketi var (zehirli / zehirli olmayan, mutajenik / mutajenik olmayan). Düğüm başına gömme vektörleri elde etmek için her grafta bir GNN çalıştırın, sonra sınıflandırma için onları tek bir graf vektörüne <strong>havuzlayın</strong>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ortalama havuzu</div><div class="card-body">Tüm düğüm gömme vektörlerini ortalama. Permütasyon-değişmez, basit, güçlü temel.</div></div>
<div class="calc-card"><div class="card-title">Toplam havuzu</div><div class="card-body">Teorik olarak ortalamadan daha ifade edici (farklı boyutlardaki grafları ayırt eder). GIN tarafından kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Dikkat havuzu</div><div class="card-body">Ortalamadan önce düğüm başına öğrenilmiş ağırlıklar. <em>SAGPool</em>, <em>GMT</em>. Molekül kıyaslamalarında güçlü.</div></div>
<div class="calc-card"><div class="card-title">Top-K / DiffPool</div><div class="card-body">Hiyerarşik: düğümleri süper-düğümlere seç / kümele, tekrarla. <em>DiffPool</em> (Ying vd. 2018), <em>MinCutPool</em>.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> GINConv, global_add_pool
<span class="kw">from</span> torch_geometric.loader <span class="kw">import</span> DataLoader
<span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> TUDataset

ds = <span class="fn">TUDataset</span>(<span class="str">"/tmp/p"</span>, <span class="str">"PROTEINS"</span>)
loader = <span class="fn">DataLoader</span>(ds, batch_size=<span class="num">32</span>, shuffle=<span class="kw">True</span>)

<span class="kw">class</span> <span class="fn">GIN</span>(torch.nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_d, h, out_d):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">self</span>.c1 = <span class="fn">GINConv</span>(torch.nn.<span class="fn">Sequential</span>(torch.nn.<span class="fn">Linear</span>(in_d, h), torch.nn.<span class="fn">ReLU</span>(), torch.nn.<span class="fn">Linear</span>(h, h)))
        <span class="kw">self</span>.c2 = <span class="fn">GINConv</span>(torch.nn.<span class="fn">Sequential</span>(torch.nn.<span class="fn">Linear</span>(h, h),    torch.nn.<span class="fn">ReLU</span>(), torch.nn.<span class="fn">Linear</span>(h, h)))
        <span class="kw">self</span>.head = torch.nn.<span class="fn">Linear</span>(h, out_d)
    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, ei, batch):
        x = F.<span class="fn">relu</span>(<span class="kw">self</span>.<span class="fn">c1</span>(x, ei))
        x = F.<span class="fn">relu</span>(<span class="kw">self</span>.<span class="fn">c2</span>(x, ei))
        x = <span class="fn">global_add_pool</span>(x, batch)              <span class="cm"># graf başına readout</span>
        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">head</span>(x)
</code></pre></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Doğru Görev İçin Doğru Metrik</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Düğüm sınıflandırma</div><div class="card-body">Doğruluk (dengeli) veya makro-F1. Cora test doğruluğunu rapor eder.</div></div>
<div class="calc-card"><div class="card-title">Bağlantı tahmini (genel)</div><div class="card-body">Pozitif vs negatif kenarlarda ROC-AUC. Hesaplaması kolay, çok kolay negatiflerle oynaması kolay.</div></div>
<div class="calc-card"><div class="card-title">Bağlantı tahmini (KG / öneri)</div><div class="card-body">Hits@K ve MRR. Her gerçek (baş, ilişki) sorgusu için, gerçek kuyruğu tüm adaylar arasında sırala. Hits@10 = gerçek kuyruğun ilk 10'da olduğu sorguların oranı.</div></div>
<div class="calc-card"><div class="card-title">Graf sınıflandırma</div><div class="card-body">Dengeliyse doğruluk; değilse ROC-AUC. PROTEINS doğruluk kullanır; ogbg-molhiv ROC-AUC kullanır.</div></div>
<div class="calc-card"><div class="card-title">Graf regresyonu</div><div class="card-body">MAE (QM9) veya RMSE. ZINC logP üzerinde MAE kullanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Negatif Örnekleme — Bağlantı-Tahmini Mühendisliğinin %80'i</h2>
<p class="l-text">Bağlantı tahmini için, eğitimde pozitif başına $K$ negatif çift örneklersiniz (genellikle $K{=}1$). "Negatif" seçimi önemlidir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tekdüze rastgele</div><div class="card-body">Herhangi bir kenar olmayanı tekdüze seçin. En ucuz. Birçok negatif çok kolay olur (açıkça uzak çiftler), bu yüzden sinyal zayıf.</div></div>
<div class="calc-card"><div class="card-title">Tip-farkındalı</div><div class="card-body">İki parçalı için (kullanıcı-ürün): sadece ürün negatiflerini örnekle, kullanıcı-kullanıcı değil. KG için: sadece tip-uyumlu kuyruklar örnekle.</div></div>
<div class="calc-card"><div class="card-title">Zor negatifler</div><div class="card-body">Modelin şu anda yüksek skorladığı negatifleri seç (madencilik). PinSage'de kullanılır. Risk: çok zorsa çöker.</div></div>
<div class="calc-card"><div class="card-title">Grup-içi</div><div class="card-body">Gruptaki diğer pozitifleri negatif olarak kullan. Karşıtsal öğrenmede standart. Ücretsiz, basit, güçlü.</div></div>
</div>

<div class="calc-highlight"><strong>Üretim kuralı:</strong> her zaman tekdüze rastgele negatiflerle başlayın. Göreviniz varsa tip-farkındalılığı ekleyin. Yakınsayan bir temeliniz varsa ve daha fazla doğruluk sıkmak istiyorsanız sadece zor negatifler ekleyin.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Yaygın Tuzaklar (Gerçek Makalelerden Gerçek Hatalar)</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Test-kenar sızıntısı</div><div class="card-body">Eğitim grafından doğrulama/test kenarlarını kaldırmayı unutmak. AUC'yi 5-20 puan şişirir. <code>RandomLinkSplit</code> kullanın.</div></div>
<div class="calc-card"><div class="card-title">Kolay negatifler</div><div class="card-body">Tüm (seyrek) graftan negatif örneklemek, çoğunun önemsiz derecede kolay olduğu anlamına gelir. AUC 1.0'a yakın ama değersiz. Tip-farkındalı veya zor negatifler kullanın.</div></div>
<div class="calc-card"><div class="card-title">KG için yanlış metrik</div><div class="card-body">KG tamamlamada AUC raporlamak anlamsızdır — Hits@K ve MRR kullanın. KG pozitifleri <em>nadirdir</em>; sıralı erişim istersiniz.</div></div>
<div class="calc-card"><div class="card-title">4 katmandan fazla aşırı düzleşme</div><div class="card-body">Daha derin GCN daha iyi özellik karıştırması gibi görünür ama aslında düğüm ayrımlarını yok eder. 2'yi varsayılan yapın; "daha derin" semantik için APPNP kullanın.</div></div>
<div class="calc-card"><div class="card-title">Temel yok</div><div class="card-body">Errica vd. (2020) birçok GNN makalesinin ham özellikler üzerinde MLP tarafından yenildiğini gösterdi. Bir sonuç iddia etmeden önce her zaman PageRank-özellikleri-üzerinde-XGBoost ve Adamic-Adar temellerini çalıştırın.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sıradakiler</h2>
<p class="l-text">Üç görev ailesi, bir mimari omurga, üç farklı ayrım ve metrik. Düğüm sınıflandırma en kolayı, graf sınıflandırma havuzlama ekler, bağlantı tahmini negatif örnekleme ekler ve mühendislik tuzaklarının çoğunun saklandığı yerdir. Kullandığınız kodlayıcı (GCN / GAT / SAGE / GIN), veri ayrımı, negatif örnekleyici ve metrikten daha az önemlidir.</p>

<div class="calc-highlight"><strong>Anahtar noktalar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Düğüm görevi: etiketli düğümlerde çapraz entropi, geri kalanı maskele, doğruluk/F1.</li>
<li>Bağlantı görevi: kodlayıcı + iç çarpım kod çözücü, negatif örneklemeli BCE, AUC / Hits@K / MRR.</li>
<li>Graf görevi: kodlayıcı + readout (ortalama / toplam / dikkat havuzu) + sınıflandırıcı, ROC-AUC.</li>
<li>Bağlantı tahmini için her zaman test kenarlarını eğitim grafından kaldır.</li>
<li>Negatifleri dikkatlice seç — başlamak için tekdüze iyidir, tip-farkındalılık genellikle ücretsiz bir kazançtır.</li>
<li>Önce klasik temelleri (Adamic-Adar, etiket yayılımı, PageRank+XGB) çalıştır.</li>
</ul>
</div>

<p class="l-text"><strong>L8 capstone</strong>'unda her şeyi birleştiriyoruz: müşteriler / ürünler / siparişler tablolarından bir bilgi grafı oluşturun, GNN-tarzı bir birleştirici eğitin ve bağlantı tahmini aracılığıyla gerçek ürün önerileri üretin. GNN yaklaşımını saf işbirlikçi filtreleme ve Adamic-Adar temelleriyle karşılaştıracağız ve değiş tokuşları tartışacağız.</p>
</div>`
};
