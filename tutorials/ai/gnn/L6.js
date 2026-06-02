window.GNN_L6 = {
en: `<p class="l-text"><strong>PyTorch Geometric (PyG) is to GNNs what Hugging Face Transformers is to NLP.</strong> Released by Matthias Fey and Jan Lenssen (TU Dortmund) in 2019, PyG turned a research zoo of one-off implementations into a coherent ecosystem: 60+ datasets one line away, 50+ pre-built layers (GCN, GAT, GraphSAGE, GIN, R-GCN, EdgeConv, PNA…), an extensible <code>MessagePassing</code> base class so you can write your own layer in 20 lines, neighborhood samplers (<code>NeighborLoader</code>, <code>ClusterLoader</code>) for graphs that don't fit in memory, batching utilities that pack many small graphs into one big block-diagonal graph, and now first-class support for heterogeneous and temporal graphs.</p>

<p class="l-text">In this lesson we tour the parts of PyG you will use 95% of the time. We meet the <code>Data</code> object (a node-feature matrix + an <code>edge_index</code> in COO format), see how <code>DataLoader</code> batches many graphs into one, walk through the <code>MessagePassing</code> API by re-implementing GCN in 15 lines, and explain neighborhood sampling for billion-edge graphs. PyG itself is not Pyodide-compatible (it depends on compiled C++ extensions for sparse ops), so we mark training code DEMO and provide NumPy-equivalent constructions of the same data structures you can run in the browser.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Construct a <code>Data</code> object: <code>x</code>, <code>edge_index</code>, optional <code>edge_attr</code>, <code>y</code>, masks</li>
<li>Use built-in datasets: Planetoid (Cora/Citeseer/Pubmed), TUDataset, OGB, MoleculeNet</li>
<li>Batch many small graphs into one block-diagonal Data via <code>DataLoader</code></li>
<li>Write a custom layer with <code>MessagePassing</code> in 15 lines (re-implement GCN)</li>
<li>Sample neighborhoods with <code>NeighborLoader</code> for inductive / large-scale training</li>
<li>Switch between transductive and inductive splits with one parameter</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Data Object — Two Tensors That Define a Graph</h2>
<p class="l-text">PyG represents a single graph as a <code>Data</code> object with three core fields:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x: (N, F)</div><div class="card-body">Node feature matrix. $N$ nodes, $F$ features. Float tensor.</div></div>
<div class="calc-card"><div class="card-title">edge_index: (2, E)</div><div class="card-body">Edges in COO format. <code>edge_index[0]</code> = source nodes, <code>edge_index[1]</code> = target nodes. For undirected graphs include both $(i,j)$ and $(j,i)$. Long tensor.</div></div>
<div class="calc-card"><div class="card-title">y: (N,) or scalar</div><div class="card-body">Labels. Per-node for node classification, per-graph (a single int) for graph classification.</div></div>
</div>

<p class="l-text">Optional fields: <code>edge_attr</code> (E, D) for edge features, <code>train_mask</code> / <code>val_mask</code> / <code>test_mask</code> (boolean per node), <code>pos</code> for spatial positions, <code>batch</code> when many graphs are stacked.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torch_geometric.data <span class="kw">import</span> Data
<span class="kw">import</span> torch

<span class="cm"># A 4-node triangle + one extra node</span>
edge_index = torch.<span class="fn">tensor</span>([[<span class="num">0</span>,<span class="num">1</span>, <span class="num">1</span>,<span class="num">2</span>, <span class="num">2</span>,<span class="num">0</span>, <span class="num">2</span>,<span class="num">3</span>],
                           [<span class="num">1</span>,<span class="num">0</span>, <span class="num">2</span>,<span class="num">1</span>, <span class="num">0</span>,<span class="num">2</span>, <span class="num">3</span>,<span class="num">2</span>]], dtype=torch.long)
x = torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">8</span>)              <span class="cm"># 4 nodes, 8 features</span>
y = torch.<span class="fn">tensor</span>([<span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>])      <span class="cm"># node labels</span>

data = <span class="fn">Data</span>(x=x, edge_index=edge_index, y=y)
<span class="fn">print</span>(data)
<span class="cm"># Data(x=[4, 8], edge_index=[2, 8], y=[4])</span>
<span class="fn">print</span>(<span class="str">"Num nodes:"</span>, data.num_nodes, <span class="str">"  Num edges:"</span>, data.num_edges)
<span class="fn">print</span>(<span class="str">"Is undirected:"</span>, data.<span class="fn">is_undirected</span>())
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build the same COO edge_index format with NumPy. networkx has a built-in converter.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">karate_club_graph</span>()
N = G.<span class="fn">number_of_nodes</span>()

<span class="cm"># Build edge_index in COO format like PyG</span>
edges = <span class="fn">list</span>(G.<span class="fn">edges</span>())
src = np.<span class="fn">array</span>([u <span class="kw">for</span> u,v <span class="kw">in</span> edges] + [v <span class="kw">for</span> u,v <span class="kw">in</span> edges])  <span class="cm"># both directions</span>
dst = np.<span class="fn">array</span>([v <span class="kw">for</span> u,v <span class="kw">in</span> edges] + [u <span class="kw">for</span> u,v <span class="kw">in</span> edges])
edge_index = np.<span class="fn">stack</span>([src, dst])
<span class="fn">print</span>(<span class="str">"edge_index shape:"</span>, edge_index.shape, <span class="str">" (2, 2*|E|) for undirected"</span>)

<span class="cm"># Random features + labels</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
x = rng.<span class="fn">normal</span>(size=(N, <span class="num">8</span>))
y = np.<span class="fn">array</span>([<span class="num">0</span> <span class="kw">if</span> G.nodes[n][<span class="str">"club"</span>]==<span class="str">"Mr. Hi"</span> <span class="kw">else</span> <span class="num">1</span> <span class="kw">for</span> n <span class="kw">in</span> G.<span class="fn">nodes</span>()])

<span class="fn">print</span>(<span class="str">"x shape:"</span>, x.shape, <span class="str">"  y shape:"</span>, y.shape)
<span class="fn">print</span>(<span class="str">"First 5 edges (src, dst):"</span>, <span class="fn">list</span>(<span class="fn">zip</span>(edge_index[<span class="num">0</span>,:<span class="num">5</span>], edge_index[<span class="num">1</span>,:<span class="num">5</span>])))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Built-in Datasets — One Line, 60+ Choices</h2>
<p class="l-text">PyG ships ready loaders for the major academic benchmarks. The downloads are cached locally.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Planetoid</div><div class="card-body">Cora, Citeseer, Pubmed — citation networks for node classification. ~3k–20k nodes.</div></div>
<div class="calc-card"><div class="card-title">TUDataset</div><div class="card-body">100+ small graph-classification benchmarks (PROTEINS, MUTAG, ENZYMES, REDDIT-BINARY). Sizes from 100 to 5k graphs.</div></div>
<div class="calc-card"><div class="card-title">OGB</div><div class="card-body">Open Graph Benchmark. The "ImageNet of GNNs". Includes ogbn-arxiv (170k nodes), ogbn-products (2.4M), ogbl-collab (link pred), ogbg-molhiv (molecules).</div></div>
<div class="calc-card"><div class="card-title">MoleculeNet</div><div class="card-body">Molecular property prediction: ESOL, FreeSolv, QM9, BBBP. Used by every cheminformatics paper.</div></div>
<div class="calc-card"><div class="card-title">Reddit / Flickr</div><div class="card-body">Large social-network datasets used for inductive learning benchmarks (GraphSAGE original).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> Planetoid, TUDataset
<span class="kw">from</span> ogb.nodeproppred <span class="kw">import</span> PygNodePropPredDataset

<span class="cm"># Cora — node classification</span>
cora = <span class="fn">Planetoid</span>(root=<span class="str">"/tmp/cora"</span>, name=<span class="str">"Cora"</span>)
<span class="fn">print</span>(cora[<span class="num">0</span>])    <span class="cm"># Data(x=[2708,1433], edge_index=[2,10556], y=[2708], train_mask=[2708], ...)</span>

<span class="cm"># PROTEINS — graph classification (a Dataset of many small graphs)</span>
proteins = <span class="fn">TUDataset</span>(root=<span class="str">"/tmp/prot"</span>, name=<span class="str">"PROTEINS"</span>)
<span class="fn">print</span>(f<span class="str">"PROTEINS: {len(proteins)} graphs, {proteins.num_node_features} features, {proteins.num_classes} classes"</span>)

<span class="cm"># OGB-arxiv — large node classification</span>
arxiv = <span class="fn">PygNodePropPredDataset</span>(name=<span class="str">"ogbn-arxiv"</span>, root=<span class="str">"/tmp/ogb"</span>)
<span class="fn">print</span>(arxiv[<span class="num">0</span>])
</code></pre></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The MessagePassing Base Class</h2>
<p class="l-text">PyG's killer feature is the <code>MessagePassing</code> base class. Inherit from it, override three methods, and you have a custom GNN layer that supports batching, sparse ops, and GPU automatically.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">message(x_j, ...)</div><div class="card-body">What does each neighbor send? Receives <code>x_j</code> (source-side features for every edge) and any other tensors you pass.</div></div>
<div class="calc-card"><div class="card-title">aggregate(inputs, index)</div><div class="card-body">Default = sum / mean / max via <code>aggr=</code> constructor argument. Rarely overridden.</div></div>
<div class="calc-card"><div class="card-title">update(aggr_out, ...)</div><div class="card-body">Final per-node transformation after aggregation. Often a linear + activation.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> MessagePassing
<span class="kw">from</span> torch_geometric.utils <span class="kw">import</span> add_self_loops, degree

<span class="kw">class</span> <span class="fn">GCNScratch</span>(MessagePassing):
    <span class="str">"""A 15-line re-implementation of the Kipf-Welling GCN."""</span>
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_dim, out_dim):
        <span class="fn">super</span>().<span class="fn">__init__</span>(aggr=<span class="str">"add"</span>)
        <span class="kw">self</span>.lin = torch.nn.<span class="fn">Linear</span>(in_dim, out_dim, bias=<span class="kw">False</span>)

    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, edge_index):
        <span class="cm"># 1. Add self-loops</span>
        edge_index, _ = <span class="fn">add_self_loops</span>(edge_index, num_nodes=x.<span class="fn">size</span>(<span class="num">0</span>))
        <span class="cm"># 2. Linear transform</span>
        x = <span class="kw">self</span>.<span class="fn">lin</span>(x)
        <span class="cm"># 3. Compute symmetric normalization 1/sqrt(d_i d_j) per edge</span>
        row, col = edge_index
        deg = <span class="fn">degree</span>(col, x.<span class="fn">size</span>(<span class="num">0</span>), dtype=x.dtype)
        deg_inv_sqrt = deg.<span class="fn">pow</span>(-<span class="num">0.5</span>)
        norm = deg_inv_sqrt[row] * deg_inv_sqrt[col]
        <span class="cm"># 4. Propagate (handles message + aggregate + update internally)</span>
        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">propagate</span>(edge_index, x=x, norm=norm)

    <span class="kw">def</span> <span class="fn">message</span>(<span class="kw">self</span>, x_j, norm):
        <span class="kw">return</span> norm.<span class="fn">view</span>(-<span class="num">1</span>, <span class="num">1</span>) * x_j
</code></pre></div>

<p class="l-text">That is the entire Kipf-Welling layer in PyG. Real-world layers like <code>GINConv</code>, <code>EdgeConv</code>, and <code>PNAConv</code> are 30–50 lines following the same pattern.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Batching Many Graphs Into One</h2>
<p class="l-text">For graph classification on TUDataset (1000+ small graphs), training one graph at a time wastes GPU. PyG's <code>DataLoader</code> packs $K$ graphs into a single block-diagonal big graph plus a <code>batch</code> vector that says which graph each node belongs to. All operations run as one matmul; pooling is per-batch.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torch_geometric.loader <span class="kw">import</span> DataLoader
<span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> TUDataset
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> global_mean_pool

ds = <span class="fn">TUDataset</span>(root=<span class="str">"/tmp/p"</span>, name=<span class="str">"PROTEINS"</span>)
loader = <span class="fn">DataLoader</span>(ds, batch_size=<span class="num">32</span>, shuffle=<span class="kw">True</span>)

<span class="kw">for</span> batch <span class="kw">in</span> loader:
    <span class="fn">print</span>(batch)
    <span class="cm"># DataBatch(x=[~1100,3], edge_index=[2,~4400], y=[32], batch=[~1100])</span>
    <span class="cm"># batch[i] = which graph (0..31) node i belongs to</span>
    <span class="fn">print</span>(<span class="str">"Nodes per graph (from batch vector):"</span>, torch.<span class="fn">bincount</span>(batch.batch))
    <span class="kw">break</span>
</code></pre></div>

<p class="l-text">For graph classification you pool node embeddings per graph into a single vector via <code>global_mean_pool(x, batch)</code> (or sum / max / attention pooling), then classify with an MLP.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. NeighborLoader — Sampling for Massive Graphs</h2>
<p class="l-text">For graphs with 1M+ nodes, you cannot run full-graph propagation on a single GPU. <strong>NeighborLoader</strong> implements GraphSAGE-style mini-batching: pick a batch of target nodes, sample their $L$-hop neighborhoods (e.g. 25 neighbors at hop 1, 10 at hop 2), and run the GNN on this subgraph only. Memory grows with batch size, not graph size.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torch_geometric.loader <span class="kw">import</span> NeighborLoader
<span class="kw">from</span> ogb.nodeproppred <span class="kw">import</span> PygNodePropPredDataset

ds = <span class="fn">PygNodePropPredDataset</span>(name=<span class="str">"ogbn-arxiv"</span>, root=<span class="str">"/tmp/ogb"</span>)
data = ds[<span class="num">0</span>]

train_loader = <span class="fn">NeighborLoader</span>(
    data,
    num_neighbors=[<span class="num">15</span>, <span class="num">10</span>],         <span class="cm"># 15 at hop 1, 10 at hop 2</span>
    batch_size=<span class="num">1024</span>,
    input_nodes=data.train_mask,
    shuffle=<span class="kw">True</span>,
)

<span class="kw">for</span> sub <span class="kw">in</span> train_loader:
    <span class="fn">print</span>(sub)
    <span class="cm"># Data(x=[~10000,128], edge_index=[2,~70000], y=[~10000], batch_size=1024)</span>
    <span class="cm"># The first 1024 nodes are the seeds (the targets we predict)</span>
    <span class="kw">break</span>
</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">NeighborLoader</div><div class="card-body">Per-target-node neighborhood sampling. The default for inductive node classification on big graphs.</div></div>
<div class="calc-card"><div class="card-title">ClusterLoader</div><div class="card-body">Cluster-GCN (Chiang et al. 2019): partition the graph into clusters, train on one cluster at a time. Cheap if your graph clusters well.</div></div>
<div class="calc-card"><div class="card-title">GraphSAINT</div><div class="card-body">Sample subgraphs via random walks; correct for sampling bias. Fast convergence on social graphs.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Putting It Together: Full GCN Training Loop</h2>
<p class="l-text">A typical PyG training loop is ~30 lines: model definition, optimizer, train/val/test loop with masks. Same pattern works for GAT, GraphSAGE, GIN by swapping the layer class.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> GCNConv
<span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> Planetoid

ds = <span class="fn">Planetoid</span>(root=<span class="str">"/tmp/cora"</span>, name=<span class="str">"Cora"</span>)
data = ds[<span class="num">0</span>]

<span class="kw">class</span> <span class="fn">GCN</span>(torch.nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_dim, hid, out_dim):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">self</span>.c1 = <span class="fn">GCNConv</span>(in_dim, hid)
        <span class="kw">self</span>.c2 = <span class="fn">GCNConv</span>(hid, out_dim)
    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, ei):
        x = F.<span class="fn">relu</span>(<span class="kw">self</span>.<span class="fn">c1</span>(x, ei))
        x = F.<span class="fn">dropout</span>(x, p=<span class="num">0.5</span>, training=<span class="kw">self</span>.training)
        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">c2</span>(x, ei)

model = <span class="fn">GCN</span>(ds.num_features, <span class="num">16</span>, ds.num_classes)
opt = torch.optim.<span class="fn">Adam</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">0.01</span>, weight_decay=<span class="num">5e-4</span>)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    model.<span class="fn">train</span>(); opt.<span class="fn">zero_grad</span>()
    out = <span class="fn">model</span>(data.x, data.edge_index)
    loss = F.<span class="fn">cross_entropy</span>(out[data.train_mask], data.y[data.train_mask])
    loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()

    <span class="cm"># Eval</span>
    model.<span class="fn">eval</span>()
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        pred = <span class="fn">model</span>(data.x, data.edge_index).<span class="fn">argmax</span>(dim=<span class="num">1</span>)
        train_acc = (pred[data.train_mask] == data.y[data.train_mask]).<span class="fn">float</span>().<span class="fn">mean</span>()
        test_acc  = (pred[data.test_mask]  == data.y[data.test_mask]).<span class="fn">float</span>().<span class="fn">mean</span>()
    <span class="kw">if</span> epoch % <span class="num">20</span> == <span class="num">0</span>:
        <span class="fn">print</span>(f<span class="str">"epoch {epoch:3d}  loss={loss.item():.4f}  train_acc={train_acc:.3f}  test_acc={test_acc:.3f}"</span>)
</code></pre></div>

<p class="l-text">Expected final test accuracy on Cora: ~81% with GCN, ~83% with GAT, ~85% with GCNII. Reproducing these takes 5 minutes on a CPU.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. PyG vs DGL vs Spektral</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PyTorch Geometric</div><div class="card-body">Most popular in 2026. Tightest PyTorch integration. Best dataset zoo. Fastest sparse ops via <code>torch_sparse</code> / <code>pyg-lib</code>.</div></div>
<div class="calc-card"><div class="card-title">DGL (Deep Graph Library)</div><div class="card-body">AWS-backed. Multi-backend (PyTorch, TensorFlow). Strong on heterogeneous graphs. Used at Amazon for production.</div></div>
<div class="calc-card"><div class="card-title">Spektral</div><div class="card-body">Keras / TensorFlow. Smaller community. Useful if your stack is TF.</div></div>
<div class="calc-card"><div class="card-title">JraphX / Jraph</div><div class="card-body">JAX-native GNNs. DeepMind's choice. Fastest on TPU.</div></div>
</div>

<div class="calc-highlight"><strong>2026 default:</strong> PyTorch Geometric, with <code>pyg-lib</code> for the fastest sparse kernels. DGL if you have heterogeneous graphs at scale or already use TensorFlow.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">PyG turns GNN research into PyTorch ergonomics: <code>Data</code> objects, <code>DataLoader</code>, the <code>MessagePassing</code> API, <code>NeighborLoader</code> for big graphs, and 60+ datasets. A custom layer is 15 lines. A full training loop is 30. Production-scale GNNs are entirely feasible on a single GPU.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>A graph = (x, edge_index, y) plus optional masks/edge_attr.</li>
<li>edge_index is COO format: shape (2, E), source row + dest row.</li>
<li>MessagePassing base class: override <code>message</code>, optionally <code>aggregate</code> and <code>update</code>.</li>
<li>DataLoader batches many small graphs into one block-diagonal big graph.</li>
<li>NeighborLoader / ClusterLoader / GraphSAINT scale to millions of nodes.</li>
<li>PyG, DGL, Spektral, Jraph — each has a niche; PyG is the default.</li>
</ul>
</div>

<p class="l-text">In <strong>gnn-L7</strong> we put PyG to work on all three task families: node classification on Cora, link prediction with negative sampling on Citeseer, and graph classification on PROTEINS / molecules. By <strong>L8</strong> we will combine these into a knowledge-graph + recommender capstone using the customer/order datasets you already have loaded.</p>
</div>`,
tr: `<p class="l-text"><strong>PyTorch Geometric (PyG), GNN'ler için Hugging Face Transformers'ın NLP için olduğu şeydir.</strong> 2019'da Matthias Fey ve Jan Lenssen (TU Dortmund) tarafından yayınlanan PyG, tek seferlik uygulamaların araştırma hayvanat bahçesini tutarlı bir ekosisteme dönüştürdü: bir satır uzaklıkta 60+ veri kümesi, 50+ önceden inşa edilmiş katman (GCN, GAT, GraphSAGE, GIN, R-GCN, EdgeConv, PNA…), kendi katmanınızı 20 satırda yazabilmeniz için genişletilebilir bir <code>MessagePassing</code> taban sınıfı, belleğe sığmayan graflar için komşuluk örnekleyiciler (<code>NeighborLoader</code>, <code>ClusterLoader</code>), birçok küçük grafı tek bir büyük blok-köşegen grafa paketleyen gruplama yardımcıları ve şimdi heterojen ve zamansal graflar için birinci sınıf destek.</p>

<p class="l-text">Bu derste PyG'nin %95 oranında kullanacağınız kısımlarını turluyoruz. <code>Data</code> nesnesiyle (bir düğüm-özellik matrisi + COO formatında bir <code>edge_index</code>) tanışıyoruz, <code>DataLoader</code>'ın birçok grafı bir grafa nasıl gruplandırdığını görüyoruz, GCN'i 15 satırda yeniden uygulayarak <code>MessagePassing</code> API'sini geçiyoruz ve milyar kenarlı graflar için komşuluk örneklemesini açıklıyoruz. PyG'nin kendisi Pyodide ile uyumlu değildir (seyrek operasyonlar için derlenmiş C++ uzantılarına bağlıdır), bu yüzden eğitim kodunu DEMO olarak işaretliyoruz ve tarayıcıda çalıştırabileceğiniz aynı veri yapılarının NumPy-eşdeğer yapılarını sağlıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir <code>Data</code> nesnesi oluşturmak: <code>x</code>, <code>edge_index</code>, opsiyonel <code>edge_attr</code>, <code>y</code>, maskeler</li>
<li>Yerleşik veri kümelerini kullanmak: Planetoid (Cora/Citeseer/Pubmed), TUDataset, OGB, MoleculeNet</li>
<li><code>DataLoader</code> ile birçok küçük grafı tek bir blok-köşegen Data'ya gruplandırmak</li>
<li><code>MessagePassing</code> ile 15 satırda özel bir katman yazmak (GCN'i yeniden uygulamak)</li>
<li>Endüktif / büyük ölçekli eğitim için <code>NeighborLoader</code> ile komşulukları örneklemek</li>
<li>Tek bir parametre ile transdüktif ve endüktif ayrımları arasında geçiş yapmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Data Nesnesi — Bir Grafı Tanımlayan İki Tensör</h2>
<p class="l-text">PyG, tek bir grafı üç temel alanı olan bir <code>Data</code> nesnesi olarak temsil eder:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x: (N, F)</div><div class="card-body">Düğüm özellik matrisi. $N$ düğüm, $F$ özellik. Float tensör.</div></div>
<div class="calc-card"><div class="card-title">edge_index: (2, E)</div><div class="card-body">COO formatında kenarlar. <code>edge_index[0]</code> = kaynak düğümler, <code>edge_index[1]</code> = hedef düğümler. Yönsüz graflar için hem $(i,j)$ hem de $(j,i)$'yi dahil edin. Long tensör.</div></div>
<div class="calc-card"><div class="card-title">y: (N,) veya skaler</div><div class="card-body">Etiketler. Düğüm sınıflandırma için düğüm başına, graf sınıflandırma için graf başına (tek bir int).</div></div>
</div>

<p class="l-text">Opsiyonel alanlar: kenar özellikleri için <code>edge_attr</code> (E, D), <code>train_mask</code> / <code>val_mask</code> / <code>test_mask</code> (düğüm başına boolean), uzamsal pozisyonlar için <code>pos</code>, birçok graf üst üste yığıldığında <code>batch</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torch_geometric.data <span class="kw">import</span> Data
<span class="kw">import</span> torch

<span class="cm"># 4 düğümlü üçgen + bir ekstra düğüm</span>
edge_index = torch.<span class="fn">tensor</span>([[<span class="num">0</span>,<span class="num">1</span>, <span class="num">1</span>,<span class="num">2</span>, <span class="num">2</span>,<span class="num">0</span>, <span class="num">2</span>,<span class="num">3</span>],
                           [<span class="num">1</span>,<span class="num">0</span>, <span class="num">2</span>,<span class="num">1</span>, <span class="num">0</span>,<span class="num">2</span>, <span class="num">3</span>,<span class="num">2</span>]], dtype=torch.long)
x = torch.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">8</span>)              <span class="cm"># 4 düğüm, 8 özellik</span>
y = torch.<span class="fn">tensor</span>([<span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>])      <span class="cm"># düğüm etiketleri</span>

data = <span class="fn">Data</span>(x=x, edge_index=edge_index, y=y)
<span class="fn">print</span>(data)
<span class="cm"># Data(x=[4, 8], edge_index=[2, 8], y=[4])</span>
<span class="fn">print</span>(<span class="str">"Düğüm sayısı:"</span>, data.num_nodes, <span class="str">"  Kenar sayısı:"</span>, data.num_edges)
<span class="fn">print</span>(<span class="str">"Yönsüz mü:"</span>, data.<span class="fn">is_undirected</span>())
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">PyG gibi aynı COO edge_index formatını NumPy ile oluşturun. networkx'in yerleşik bir dönüştürücüsü vardır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">karate_club_graph</span>()
N = G.<span class="fn">number_of_nodes</span>()

<span class="cm"># PyG gibi COO formatında edge_index oluştur</span>
edges = <span class="fn">list</span>(G.<span class="fn">edges</span>())
src = np.<span class="fn">array</span>([u <span class="kw">for</span> u,v <span class="kw">in</span> edges] + [v <span class="kw">for</span> u,v <span class="kw">in</span> edges])  <span class="cm"># her iki yön</span>
dst = np.<span class="fn">array</span>([v <span class="kw">for</span> u,v <span class="kw">in</span> edges] + [u <span class="kw">for</span> u,v <span class="kw">in</span> edges])
edge_index = np.<span class="fn">stack</span>([src, dst])
<span class="fn">print</span>(<span class="str">"edge_index şekli:"</span>, edge_index.shape, <span class="str">" yönsüz için (2, 2*|E|)"</span>)

<span class="cm"># Rastgele özellikler + etiketler</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
x = rng.<span class="fn">normal</span>(size=(N, <span class="num">8</span>))
y = np.<span class="fn">array</span>([<span class="num">0</span> <span class="kw">if</span> G.nodes[n][<span class="str">"club"</span>]==<span class="str">"Mr. Hi"</span> <span class="kw">else</span> <span class="num">1</span> <span class="kw">for</span> n <span class="kw">in</span> G.<span class="fn">nodes</span>()])

<span class="fn">print</span>(<span class="str">"x şekli:"</span>, x.shape, <span class="str">"  y şekli:"</span>, y.shape)
<span class="fn">print</span>(<span class="str">"İlk 5 kenar (kaynak, hedef):"</span>, <span class="fn">list</span>(<span class="fn">zip</span>(edge_index[<span class="num">0</span>,:<span class="num">5</span>], edge_index[<span class="num">1</span>,:<span class="num">5</span>])))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Yerleşik Veri Kümeleri — Tek Satır, 60+ Seçenek</h2>
<p class="l-text">PyG, başlıca akademik kıyaslamalar için hazır yükleyiciler içerir. İndirmeler yerel olarak önbelleğe alınır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Planetoid</div><div class="card-body">Cora, Citeseer, Pubmed — düğüm sınıflandırma için atıf ağları. ~3k–20k düğüm.</div></div>
<div class="calc-card"><div class="card-title">TUDataset</div><div class="card-body">100+ küçük graf-sınıflandırma kıyaslaması (PROTEINS, MUTAG, ENZYMES, REDDIT-BINARY). 100'den 5k grafa kadar boyutlar.</div></div>
<div class="calc-card"><div class="card-title">OGB</div><div class="card-body">Open Graph Benchmark. "GNN'lerin ImageNet'i". ogbn-arxiv (170k düğüm), ogbn-products (2.4M), ogbl-collab (bağlantı tahmini), ogbg-molhiv (moleküller) içerir.</div></div>
<div class="calc-card"><div class="card-title">MoleculeNet</div><div class="card-body">Moleküler özellik tahmini: ESOL, FreeSolv, QM9, BBBP. Her keminformatik makalesi tarafından kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Reddit / Flickr</div><div class="card-body">Endüktif öğrenme kıyaslamaları için kullanılan büyük sosyal-ağ veri kümeleri (orijinal GraphSAGE).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> Planetoid, TUDataset
<span class="kw">from</span> ogb.nodeproppred <span class="kw">import</span> PygNodePropPredDataset

<span class="cm"># Cora — düğüm sınıflandırma</span>
cora = <span class="fn">Planetoid</span>(root=<span class="str">"/tmp/cora"</span>, name=<span class="str">"Cora"</span>)
<span class="fn">print</span>(cora[<span class="num">0</span>])    <span class="cm"># Data(x=[2708,1433], edge_index=[2,10556], y=[2708], train_mask=[2708], ...)</span>

<span class="cm"># PROTEINS — graf sınıflandırma (birçok küçük grafın bir veri kümesi)</span>
proteins = <span class="fn">TUDataset</span>(root=<span class="str">"/tmp/prot"</span>, name=<span class="str">"PROTEINS"</span>)
<span class="fn">print</span>(f<span class="str">"PROTEINS: {len(proteins)} graf, {proteins.num_node_features} özellik, {proteins.num_classes} sınıf"</span>)

<span class="cm"># OGB-arxiv — büyük düğüm sınıflandırma</span>
arxiv = <span class="fn">PygNodePropPredDataset</span>(name=<span class="str">"ogbn-arxiv"</span>, root=<span class="str">"/tmp/ogb"</span>)
<span class="fn">print</span>(arxiv[<span class="num">0</span>])
</code></pre></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. MessagePassing Taban Sınıfı</h2>
<p class="l-text">PyG'nin öne çıkan özelliği <code>MessagePassing</code> taban sınıfıdır. Ondan miras alın, üç metodu geçersiz kılın ve gruplandırmayı, seyrek op'ları ve GPU'yu otomatik olarak destekleyen özel bir GNN katmanına sahip olun.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">message(x_j, ...)</div><div class="card-body">Her komşu ne gönderir? <code>x_j</code>'yi (her kenar için kaynak-tarafı özellikler) ve geçirdiğiniz diğer tensörleri alır.</div></div>
<div class="calc-card"><div class="card-title">aggregate(inputs, index)</div><div class="card-body">Varsayılan = <code>aggr=</code> kurucu argümanı aracılığıyla toplam / ortalama / max. Nadiren geçersiz kılınır.</div></div>
<div class="calc-card"><div class="card-title">update(aggr_out, ...)</div><div class="card-body">Birleştirmeden sonra son düğüm-başına dönüşüm. Genellikle bir doğrusal + aktivasyon.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> MessagePassing
<span class="kw">from</span> torch_geometric.utils <span class="kw">import</span> add_self_loops, degree

<span class="kw">class</span> <span class="fn">GCNScratch</span>(MessagePassing):
    <span class="str">"""Kipf-Welling GCN'in 15 satırlık yeniden uygulanması."""</span>
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_dim, out_dim):
        <span class="fn">super</span>().<span class="fn">__init__</span>(aggr=<span class="str">"add"</span>)
        <span class="kw">self</span>.lin = torch.nn.<span class="fn">Linear</span>(in_dim, out_dim, bias=<span class="kw">False</span>)

    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, edge_index):
        <span class="cm"># 1. Öz-döngüler ekle</span>
        edge_index, _ = <span class="fn">add_self_loops</span>(edge_index, num_nodes=x.<span class="fn">size</span>(<span class="num">0</span>))
        <span class="cm"># 2. Doğrusal dönüşüm</span>
        x = <span class="kw">self</span>.<span class="fn">lin</span>(x)
        <span class="cm"># 3. Kenar başına simetrik normalleştirme 1/sqrt(d_i d_j) hesapla</span>
        row, col = edge_index
        deg = <span class="fn">degree</span>(col, x.<span class="fn">size</span>(<span class="num">0</span>), dtype=x.dtype)
        deg_inv_sqrt = deg.<span class="fn">pow</span>(-<span class="num">0.5</span>)
        norm = deg_inv_sqrt[row] * deg_inv_sqrt[col]
        <span class="cm"># 4. Yay (mesaj + birleştir + güncelle'yi içeride yönetir)</span>
        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">propagate</span>(edge_index, x=x, norm=norm)

    <span class="kw">def</span> <span class="fn">message</span>(<span class="kw">self</span>, x_j, norm):
        <span class="kw">return</span> norm.<span class="fn">view</span>(-<span class="num">1</span>, <span class="num">1</span>) * x_j
</code></pre></div>

<p class="l-text">PyG'de tüm Kipf-Welling katmanı budur. <code>GINConv</code>, <code>EdgeConv</code> ve <code>PNAConv</code> gibi gerçek dünya katmanları aynı deseni izleyen 30-50 satırdır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Birçok Grafı Bire Gruplandırmak</h2>
<p class="l-text">TUDataset (1000+ küçük graf) üzerinde graf sınıflandırma için, her seferinde bir grafı eğitmek GPU'yu boşa harcar. PyG'nin <code>DataLoader</code>'ı $K$ grafı tek bir blok-köşegen büyük graf artı her düğümün hangi grafa ait olduğunu söyleyen bir <code>batch</code> vektörüne paketler. Tüm operasyonlar tek matmul olarak çalışır; havuzlama grup başına yapılır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torch_geometric.loader <span class="kw">import</span> DataLoader
<span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> TUDataset
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> global_mean_pool

ds = <span class="fn">TUDataset</span>(root=<span class="str">"/tmp/p"</span>, name=<span class="str">"PROTEINS"</span>)
loader = <span class="fn">DataLoader</span>(ds, batch_size=<span class="num">32</span>, shuffle=<span class="kw">True</span>)

<span class="kw">for</span> batch <span class="kw">in</span> loader:
    <span class="fn">print</span>(batch)
    <span class="cm"># DataBatch(x=[~1100,3], edge_index=[2,~4400], y=[32], batch=[~1100])</span>
    <span class="cm"># batch[i] = düğüm i'nin ait olduğu graf (0..31)</span>
    <span class="fn">print</span>(<span class="str">"Graf başına düğümler (batch vektöründen):"</span>, torch.<span class="fn">bincount</span>(batch.batch))
    <span class="kw">break</span>
</code></pre></div>

<p class="l-text">Graf sınıflandırma için, düğüm gömme vektörlerini graf başına tek bir vektöre <code>global_mean_pool(x, batch)</code> (veya toplam / max / dikkat havuzlama) aracılığıyla havuzlarsınız, sonra bir MLP ile sınıflandırırsınız.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. NeighborLoader — Devasa Graflar İçin Örnekleme</h2>
<p class="l-text">1M+ düğümlü graflar için, tek bir GPU'da tam graf yayılımı çalıştıramazsınız. <strong>NeighborLoader</strong> GraphSAGE-tarzı mini-gruplamayı uygular: bir grup hedef düğüm seçer, $L$-adımlı komşuluklarını örnekler (örn. 1. adımda 25 komşu, 2. adımda 10) ve sadece bu alt graf üzerinde GNN'i çalıştırır. Bellek, graf boyutu ile değil, grup boyutu ile büyür.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> torch_geometric.loader <span class="kw">import</span> NeighborLoader
<span class="kw">from</span> ogb.nodeproppred <span class="kw">import</span> PygNodePropPredDataset

ds = <span class="fn">PygNodePropPredDataset</span>(name=<span class="str">"ogbn-arxiv"</span>, root=<span class="str">"/tmp/ogb"</span>)
data = ds[<span class="num">0</span>]

train_loader = <span class="fn">NeighborLoader</span>(
    data,
    num_neighbors=[<span class="num">15</span>, <span class="num">10</span>],         <span class="cm"># 1. adımda 15, 2. adımda 10</span>
    batch_size=<span class="num">1024</span>,
    input_nodes=data.train_mask,
    shuffle=<span class="kw">True</span>,
)

<span class="kw">for</span> sub <span class="kw">in</span> train_loader:
    <span class="fn">print</span>(sub)
    <span class="cm"># Data(x=[~10000,128], edge_index=[2,~70000], y=[~10000], batch_size=1024)</span>
    <span class="cm"># İlk 1024 düğüm tohumlardır (tahmin ettiğimiz hedefler)</span>
    <span class="kw">break</span>
</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">NeighborLoader</div><div class="card-body">Hedef düğüm başına komşuluk örneklemesi. Büyük graflarda endüktif düğüm sınıflandırma için varsayılan.</div></div>
<div class="calc-card"><div class="card-title">ClusterLoader</div><div class="card-body">Cluster-GCN (Chiang vd. 2019): grafı kümelere bölün, bir seferde bir küme üzerinde eğitin. Grafınız iyi kümeleniyorsa ucuz.</div></div>
<div class="calc-card"><div class="card-title">GraphSAINT</div><div class="card-body">Rastgele yürüyüşler aracılığıyla alt grafları örnekle; örnekleme önyargısını düzelt. Sosyal graflarda hızlı yakınsama.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hepsini Birleştirmek: Tam GCN Eğitim Döngüsü</h2>
<p class="l-text">Tipik bir PyG eğitim döngüsü ~30 satırdır: model tanımı, optimizör, maskelerle eğitim/doğrulama/test döngüsü. Aynı desen, katman sınıfını değiştirerek GAT, GraphSAGE, GIN için çalışır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> GCNConv
<span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> Planetoid

ds = <span class="fn">Planetoid</span>(root=<span class="str">"/tmp/cora"</span>, name=<span class="str">"Cora"</span>)
data = ds[<span class="num">0</span>]

<span class="kw">class</span> <span class="fn">GCN</span>(torch.nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_dim, hid, out_dim):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">self</span>.c1 = <span class="fn">GCNConv</span>(in_dim, hid)
        <span class="kw">self</span>.c2 = <span class="fn">GCNConv</span>(hid, out_dim)
    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, ei):
        x = F.<span class="fn">relu</span>(<span class="kw">self</span>.<span class="fn">c1</span>(x, ei))
        x = F.<span class="fn">dropout</span>(x, p=<span class="num">0.5</span>, training=<span class="kw">self</span>.training)
        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">c2</span>(x, ei)

model = <span class="fn">GCN</span>(ds.num_features, <span class="num">16</span>, ds.num_classes)
opt = torch.optim.<span class="fn">Adam</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">0.01</span>, weight_decay=<span class="num">5e-4</span>)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    model.<span class="fn">train</span>(); opt.<span class="fn">zero_grad</span>()
    out = <span class="fn">model</span>(data.x, data.edge_index)
    loss = F.<span class="fn">cross_entropy</span>(out[data.train_mask], data.y[data.train_mask])
    loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()

    <span class="cm"># Değerlendirme</span>
    model.<span class="fn">eval</span>()
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        pred = <span class="fn">model</span>(data.x, data.edge_index).<span class="fn">argmax</span>(dim=<span class="num">1</span>)
        train_acc = (pred[data.train_mask] == data.y[data.train_mask]).<span class="fn">float</span>().<span class="fn">mean</span>()
        test_acc  = (pred[data.test_mask]  == data.y[data.test_mask]).<span class="fn">float</span>().<span class="fn">mean</span>()
    <span class="kw">if</span> epoch % <span class="num">20</span> == <span class="num">0</span>:
        <span class="fn">print</span>(f<span class="str">"dönem {epoch:3d}  kayıp={loss.item():.4f}  eğitim_doğruluk={train_acc:.3f}  test_doğruluk={test_acc:.3f}"</span>)
</code></pre></div>

<p class="l-text">Cora'da beklenen son test doğruluğu: GCN ile ~%81, GAT ile ~%83, GCNII ile ~%85. Bunları yeniden üretmek bir CPU'da 5 dakika sürer.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. PyG vs DGL vs Spektral</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PyTorch Geometric</div><div class="card-body">2026'da en popüler. En sıkı PyTorch entegrasyonu. En iyi veri kümesi hayvanat bahçesi. <code>torch_sparse</code> / <code>pyg-lib</code> aracılığıyla en hızlı seyrek op'lar.</div></div>
<div class="calc-card"><div class="card-title">DGL (Deep Graph Library)</div><div class="card-body">AWS-destekli. Çoklu-arka uç (PyTorch, TensorFlow). Heterojen graflarda güçlü. Amazon'da üretim için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Spektral</div><div class="card-body">Keras / TensorFlow. Daha küçük topluluk. Yığınınız TF ise yararlı.</div></div>
<div class="calc-card"><div class="card-title">JraphX / Jraph</div><div class="card-body">JAX-yerel GNN'ler. DeepMind'ın seçimi. TPU'da en hızlı.</div></div>
</div>

<div class="calc-highlight"><strong>2026 varsayılanı:</strong> PyTorch Geometric, en hızlı seyrek çekirdekler için <code>pyg-lib</code> ile. Ölçekte heterojen graflarınız varsa veya zaten TensorFlow kullanıyorsanız DGL.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sıradakiler</h2>
<p class="l-text">PyG, GNN araştırmasını PyTorch ergonomisine dönüştürür: <code>Data</code> nesneleri, <code>DataLoader</code>, <code>MessagePassing</code> API'si, büyük graflar için <code>NeighborLoader</code> ve 60+ veri kümesi. Özel bir katman 15 satırdır. Tam bir eğitim döngüsü 30'dur. Üretim ölçeği GNN'ler tek bir GPU'da tamamen uygulanabilirdir.</p>

<div class="calc-highlight"><strong>Anahtar noktalar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Bir graf = (x, edge_index, y) artı opsiyonel maskeler/edge_attr.</li>
<li>edge_index COO formatıdır: şekil (2, E), kaynak satırı + hedef satırı.</li>
<li>MessagePassing taban sınıfı: <code>message</code>'ı, opsiyonel olarak <code>aggregate</code> ve <code>update</code>'i geçersiz kılın.</li>
<li>DataLoader birçok küçük grafı tek bir blok-köşegen büyük grafa gruplandırır.</li>
<li>NeighborLoader / ClusterLoader / GraphSAINT milyonlarca düğüme ölçeklenir.</li>
<li>PyG, DGL, Spektral, Jraph — her birinin bir nişi var; PyG varsayılandır.</li>
</ul>
</div>

<p class="l-text"><strong>gnn-L7</strong>'de PyG'yi üç görev ailesinin tümünde iş başına alıyoruz: Cora'da düğüm sınıflandırma, Citeseer'de negatif örneklemeli bağlantı tahmini ve PROTEINS / moleküllerde graf sınıflandırma. <strong>L8</strong>'e kadar bunları, zaten yüklü müşteri/sipariş veri kümelerini kullanan bir bilgi grafı + öneri capstone'unda birleştireceğiz.</p>
</div>`
};
