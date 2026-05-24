window.GNN_L5 = {
en: `<p class="l-text"><strong>GCN treats all neighbors equally — but they aren't.</strong> When predicting a paper's research field, a citation from a foundational survey carries more signal than a citation from a tangential reference. When predicting a user's interest in a movie, a friend with very similar taste should weigh more than a casual acquaintance. <em>Attention</em> — the same mechanism that powers the Transformer — solves this on graphs: instead of fixed normalization weights $1/\\sqrt{\\tilde{d}_v\\tilde{d}_u}$, the model learns a coefficient $\\alpha_{ij}$ for every edge as a function of the two endpoints' features. The Graph Attention Network (Veličković et al., ICLR 2018) was the paper that did this and became the second-most-cited GNN architecture after GCN.</p>

<p class="l-text">In this lesson we derive GAT, compute attention coefficients with NumPy on a small graph, see how multi-head attention works, and discuss the modifications introduced by GATv2 (Brody et al. 2022) that fix a subtle expressiveness flaw in the original. We will visualize which neighbors get the highest weights and see attention specialize across heads. By the end you will know why GAT often beats GCN on heterophilous and noisy graphs and why it is the default choice when edges differ in importance.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compute the GAT attention coefficient $\\alpha_{ij}$ from a learnable $\\mathbf{a}$ and shared $W$</li>
<li>Implement masked softmax over neighbors so attention only flows along real edges</li>
<li>Stack multi-head attention exactly like in the Transformer</li>
<li>Distinguish GATv1 (additive attention) from GATv2 (dynamic attention) and know when each fails</li>
<li>Visualize per-edge attention to understand <em>why</em> the model made a prediction</li>
<li>Decide when to use GAT vs GCN vs GraphSAGE in production</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The GAT Attention Coefficient</h2>
<p class="l-text">For each edge $(i, j)$ in the graph, GAT computes an attention score:</p>

<div class="katex-block">$$e_{ij} = \\mathrm{LeakyReLU}\\!\\left(\\mathbf{a}^\\top \\big[W h_i \\,\\|\\, W h_j\\big]\\right)$$</div>

<p class="l-text">where $W \\in \\mathbb{R}^{F' \\times F}$ projects features into a new space, $\\|$ is concatenation, and $\\mathbf{a} \\in \\mathbb{R}^{2F'}$ is the learnable attention vector. The score is then normalized over $i$'s neighbors via softmax:</p>

<div class="katex-block">$$\\alpha_{ij} = \\mathrm{softmax}_{j \\in N(i)}(e_{ij}) = \\frac{\\exp(e_{ij})}{\\sum_{k \\in N(i)} \\exp(e_{ik})}$$</div>

<p class="l-text">The new representation aggregates neighbors weighted by $\\alpha$:</p>

<div class="katex-block">$$h_i' = \\sigma\\!\\left(\\sum_{j \\in N(i) \\cup \\{i\\}} \\alpha_{ij}\\,W h_j\\right)$$</div>

<p class="l-text">Three things to notice. First, the attention is computed only on existing edges — non-edges receive $\\alpha = 0$ via the masked softmax (this is a graph-mask, exactly like the causal mask in a decoder Transformer). Second, $\\mathbf{a}$ has just $2F'$ parameters — extremely cheap. Third, GAT does not require knowing the global graph structure for normalization (unlike GCN's $\\hat{A}$), so it works on inductive tasks out of the box.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Computing Attention by Hand</h2>
<p class="l-text">Let's compute $\\alpha_{ij}$ for a single node on the 5-node house graph from L4. We'll watch the masking, the softmax, and the final aggregation step by step.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Single-head GAT layer in NumPy on the 5-node house graph.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

A = np.<span class="fn">array</span>([[<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>],[<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>],[<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>],[<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>],[<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>]], dtype=<span class="fn">float</span>)
A_with_self = A + np.<span class="fn">eye</span>(<span class="num">5</span>)              <span class="cm"># add self-loops (every node attends to itself too)</span>

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
F, Fp = <span class="num">3</span>, <span class="num">4</span>
X = rng.<span class="fn">normal</span>(size=(<span class="num">5</span>, F))
W = rng.<span class="fn">normal</span>(size=(F, Fp)) * <span class="num">0.5</span>       <span class="cm"># shared linear projection</span>
a = rng.<span class="fn">normal</span>(size=(<span class="num">2</span>*Fp,)) * <span class="num">0.5</span>       <span class="cm"># attention vector</span>

H = X @ W                                 <span class="cm"># transformed features (N, Fp)</span>
<span class="fn">print</span>(<span class="str">"H (transformed features) shape:"</span>, H.shape)

<span class="cm"># Pairwise scores e_ij = LeakyReLU(a . [Wh_i || Wh_j])</span>
<span class="kw">def</span> <span class="fn">leaky_relu</span>(x, slope=<span class="num">0.2</span>): <span class="kw">return</span> np.<span class="fn">where</span>(x > <span class="num">0</span>, x, slope * x)
a_l, a_r = a[:Fp], a[Fp:]
left_scores  = H @ a_l                    <span class="cm"># contribution of "i" side, shape (N,)</span>
right_scores = H @ a_r                    <span class="cm"># contribution of "j" side, shape (N,)</span>
E = <span class="fn">leaky_relu</span>(left_scores[:, <span class="kw">None</span>] + right_scores[<span class="kw">None</span>, :])   <span class="cm"># (N, N)</span>

<span class="cm"># Mask: only keep edges; non-edges get -inf so softmax gives 0</span>
E_masked = np.<span class="fn">where</span>(A_with_self > <span class="num">0</span>, E, -<span class="num">1e9</span>)
<span class="cm"># Row-wise softmax — each node's neighbor weights sum to 1</span>
E_max = E_masked.<span class="fn">max</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
exp_E = np.<span class="fn">exp</span>(E_masked - E_max)
alpha = exp_E / exp_E.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
<span class="fn">print</span>(<span class="str">"\\nAttention matrix alpha (rows sum to 1, only along edges):"</span>)
<span class="fn">print</span>(np.<span class="fn">round</span>(alpha, <span class="num">3</span>))

<span class="cm"># Aggregate</span>
H_new = alpha @ H
<span class="fn">print</span>(<span class="str">"\\nNew node features H' shape:"</span>, H_new.shape)
<span class="fn">print</span>(<span class="str">"Node 0 attended most to:"</span>, <span class="fn">int</span>(np.<span class="fn">argmax</span>(alpha[<span class="num">0</span>])), <span class="str">"with weight"</span>, <span class="fn">round</span>(alpha[<span class="num">0</span>].<span class="fn">max</span>(), <span class="num">3</span>))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Multi-Head Attention</h2>
<p class="l-text">Single-head attention can collapse to one mode. Just like in the Transformer, GAT uses <strong>multi-head attention</strong>: $K$ independent attention computations with their own $W^k$ and $\\mathbf{a}^k$, then either <em>concatenated</em> (intermediate layers) or <em>averaged</em> (output layer).</p>

<div class="katex-block">$$h_i' = \\big\\|_{k=1}^{K}\\, \\sigma\\!\\left(\\sum_{j \\in N(i)\\cup\\{i\\}} \\alpha^k_{ij}\\,W^k h_j\\right)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">K = 8 heads</div><div class="card-body">The original GAT paper uses 8 heads on Cora. Different heads specialize: some capture local structure, some capture label-similar neighbors, etc.</div></div>
<div class="calc-card"><div class="card-title">Concat vs average</div><div class="card-body">Concat for hidden layers (preserves diversity, output dim = $K \\cdot F'$). Average for the final layer (single-output classification). Same convention as the Transformer.</div></div>
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">$K$ times the single-head cost. Modern implementations batch heads as one big matmul, so wall-clock is barely impacted.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. GAT Code (Concept &mdash; Real Training Needs PyTorch)</h2>
<p class="l-text">Here is what a real GAT layer looks like in PyTorch Geometric. We mark this DEMO because <code>torch_geometric</code> is blocked in Pyodide; we have a NumPy equivalent below.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Real GAT in PyTorch Geometric — torch and torch_geometric needed</span>
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> GATConv
<span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> Planetoid

dataset = <span class="fn">Planetoid</span>(root=<span class="str">"/tmp/cora"</span>, name=<span class="str">"Cora"</span>)
data = dataset[<span class="num">0</span>]

<span class="kw">class</span> <span class="fn">GAT</span>(torch.nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_dim, hid, out_dim, heads=<span class="num">8</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">self</span>.gat1 = <span class="fn">GATConv</span>(in_dim, hid, heads=heads, dropout=<span class="num">0.6</span>)
        <span class="kw">self</span>.gat2 = <span class="fn">GATConv</span>(hid * heads, out_dim, heads=<span class="num">1</span>, concat=<span class="kw">False</span>, dropout=<span class="num">0.6</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, edge_index):
        x = F.<span class="fn">elu</span>(<span class="kw">self</span>.<span class="fn">gat1</span>(x, edge_index))
        x = F.<span class="fn">dropout</span>(x, p=<span class="num">0.6</span>, training=<span class="kw">self</span>.training)
        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">gat2</span>(x, edge_index)

model = <span class="fn">GAT</span>(dataset.num_features, <span class="num">8</span>, dataset.num_classes)
opt = torch.optim.<span class="fn">Adam</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">5e-3</span>, weight_decay=<span class="num">5e-4</span>)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    model.<span class="fn">train</span>(); opt.<span class="fn">zero_grad</span>()
    out = <span class="fn">model</span>(data.x, data.edge_index)
    loss = F.<span class="fn">cross_entropy</span>(out[data.train_mask], data.y[data.train_mask])
    loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
</code></pre></div>

<p class="l-text">Now the runnable equivalent: an 8-head GAT forward pass implemented entirely in NumPy on the karate-club graph.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Multi-head GAT forward pass, NumPy-only, on the karate-club graph. We see how heads specialize.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">karate_club_graph</span>()
N = G.<span class="fn">number_of_nodes</span>()
A = nx.<span class="fn">to_numpy_array</span>(G) + np.<span class="fn">eye</span>(N)     <span class="cm"># add self-loops</span>

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
F_in, F_out, K = <span class="num">8</span>, <span class="num">4</span>, <span class="num">4</span>                  <span class="cm"># 4 heads, 4 output dim per head</span>
X = rng.<span class="fn">normal</span>(size=(N, F_in))
W = rng.<span class="fn">normal</span>(size=(K, F_in, F_out)) * <span class="num">0.3</span>
a = rng.<span class="fn">normal</span>(size=(K, <span class="num">2</span>*F_out)) * <span class="num">0.3</span>

<span class="kw">def</span> <span class="fn">leaky</span>(x, s=<span class="num">0.2</span>): <span class="kw">return</span> np.<span class="fn">where</span>(x > <span class="num">0</span>, x, s * x)

heads = []
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K):
    H = X @ W[k]                          <span class="cm"># (N, F_out)</span>
    al, ar = a[k][:F_out], a[k][F_out:]
    e = <span class="fn">leaky</span>(H @ al)[:, <span class="kw">None</span>] + <span class="fn">leaky</span>(H @ ar)[<span class="kw">None</span>, :]
    e = np.<span class="fn">where</span>(A > <span class="num">0</span>, e, -<span class="num">1e9</span>)
    e -= e.<span class="fn">max</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    alpha = np.<span class="fn">exp</span>(e); alpha /= alpha.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    heads.<span class="fn">append</span>(alpha @ H)

<span class="cm"># Concat across heads (typical for hidden layers)</span>
out = np.<span class="fn">concatenate</span>(heads, axis=<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"Multi-head GAT output shape:"</span>, out.shape, <span class="str">"= (nodes, K * F_out)"</span>)

<span class="cm"># Inspect head specialization for node 0 (Mr. Hi)</span>
<span class="fn">print</span>(<span class="str">"\\nFor node 0, top neighbor per head:"</span>)
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K):
    H = X @ W[k]
    al, ar = a[k][:F_out], a[k][F_out:]
    e = <span class="fn">leaky</span>(H @ al)[:, <span class="kw">None</span>] + <span class="fn">leaky</span>(H @ ar)[<span class="kw">None</span>, :]
    e = np.<span class="fn">where</span>(A > <span class="num">0</span>, e, -<span class="num">1e9</span>)
    e -= e.<span class="fn">max</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    alpha = np.<span class="fn">exp</span>(e); alpha /= alpha.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    j = <span class="fn">int</span>(np.<span class="fn">argmax</span>(alpha[<span class="num">0</span>]))
    <span class="fn">print</span>(f<span class="str">"  head {k}: most attended neighbor of node 0 = node {j}  (alpha={alpha[0,j]:.3f})"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. GATv2 — Fixing Static Attention</h2>
<p class="l-text">Brody, Alon &amp; Yahav (ICLR 2022) noticed a flaw: in GATv1 the attention rank order is the same for every query node — the attention is "static". The reason is that $e_{ij} = \\mathbf{a}^\\top[Wh_i \\| Wh_j]$ separates linearly into terms depending on $i$ alone and $j$ alone, so node $i$ cannot say "for me, I prefer neighbors with feature $X$" — only "I prefer neighbors with high $\\mathbf{a}_r^\\top W h_j$ regardless of who I am".</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">GATv1 (static)</div><div class="card-body">$e_{ij} = \\mathrm{LeakyReLU}(\\mathbf{a}^\\top[Wh_i\\|Wh_j])$. Same rank order of neighbors for every query.</div></div>
<div class="calc-card"><div class="card-title">GATv2 (dynamic)</div><div class="card-body">$e_{ij} = \\mathbf{a}^\\top \\mathrm{LeakyReLU}(W[h_i\\|h_j])$. Non-linearity comes <em>before</em> the attention vector — query-dependent ordering.</div></div>
<div class="calc-card"><div class="card-title">Empirically</div><div class="card-body">GATv2 wins on most heterophilous benchmarks. GATv1 still ties on Cora/Citeseer where homophily is high. Default to GATv2 in 2026.</div></div>
</div>

<div class="calc-highlight"><strong>Implementation cost</strong> of switching from GATv1 to GATv2 is ~3 lines. PyTorch Geometric exposes <code>GATConv</code> (v1) and <code>GATv2Conv</code> (v2). The fix is essentially free, take it.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Edge Features and Edge-aware Attention</h2>
<p class="l-text">Vanilla GAT ignores edge features — but molecules have bond types, knowledge graphs have relation types, and traffic networks have road capacities. Two extensions handle this:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">EGAT / GAT-edge</div><div class="card-body">Concatenate edge features into the attention input: $e_{ij} = \\mathbf{a}^\\top[Wh_i\\|Wh_j\\|We_{ij}]$. Cheap and effective.</div></div>
<div class="calc-card"><div class="card-title">R-GAT / R-GCN</div><div class="card-body">For typed edges: separate weight matrices per relation type. Combine with attention if needed. Standard choice for knowledge-graph completion.</div></div>
<div class="calc-card"><div class="card-title">GINE</div><div class="card-body">An extension of GIN (Xu et al. 2019) that injects edge features into the message. Strong on molecule property prediction.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. When Should You Use GAT vs GCN?</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Use GCN when</div><div class="card-body">Graph is homophilous, edges all carry similar weight, you want the simplest baseline. Cora, Citeseer, most citation networks.</div></div>
<div class="calc-card"><div class="card-title">Use GAT when</div><div class="card-body">Edges differ in importance, you have noisy / spurious edges (attention can down-weight them), or you need interpretability — attention weights tell you <em>why</em>.</div></div>
<div class="calc-card"><div class="card-title">Use GraphSAGE when</div><div class="card-body">Inductive setting (must generalize to new graphs), or your graph is too big to compute on at full size — sample neighborhoods.</div></div>
<div class="calc-card"><div class="card-title">Use GIN when</div><div class="card-body">Graph classification with strong structural signal. GIN is the most expressive in the Weisfeiler-Lehman sense (Xu et al. 2019).</div></div>
</div>

<div class="calc-highlight"><strong>Production data point:</strong> Pinterest's PinSage (2018) used GraphSAGE for billion-scale recommendation. Twitter's TwHIN used a heterogeneous variant. Uber's DeepETA used GCN-style spatial smoothing. GAT shows up most often in molecule and knowledge-graph work where edges genuinely differ.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">GAT replaces GCN's fixed degree-based normalization with a learned attention coefficient per edge. Multi-head attention works exactly as in the Transformer. GATv2 fixes a static-attention flaw and is the default in 2026. Attention adds interpretability — you can visualize which neighbors the model used.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>$\\alpha_{ij}$ from a learnable attention vector + masked softmax over neighbors.</li>
<li>Multi-head: K independent attentions, concat for hidden, average for output.</li>
<li>GATv2 fixes static attention and should be the default.</li>
<li>Edge features handled via concatenation (EGAT) or relation-typing (R-GAT).</li>
<li>GAT is interpretable: visualize $\\alpha$ to see which neighbors mattered for each prediction.</li>
</ul>
</div>

<p class="l-text">In <strong>gnn-L6</strong> we leave NumPy behind for <strong>PyTorch Geometric</strong> — the production library for GNNs. We will tour Data / Batch / DataLoader, the MessagePassing API, NeighborLoader for sampling, and the 50+ built-in datasets that make experimenting trivial.</p>
</div>`,
tr: `<p class="l-text"><strong>GCN tüm komşulara eşit davranır — ama eşit değildirler.</strong> Bir makalenin araştırma alanını tahmin ederken, temel bir incelemeden gelen bir atıf, teğet bir referanstan gelen atıftan daha fazla sinyal taşır. Bir kullanıcının bir filmle ilgilendiğini tahmin ederken, çok benzer zevkleri olan bir arkadaş, sıradan bir tanıdığa göre daha fazla ağırlık taşımalıdır. <em>Dikkat</em> — Transformer'a güç veren aynı mekanizma — bunu graflarda çözer: $1/\\sqrt{\\tilde{d}_v\\tilde{d}_u}$ sabit normalleştirme ağırlıkları yerine, model her kenar için iki uç noktanın özelliklerinin bir fonksiyonu olarak bir katsayı $\\alpha_{ij}$ öğrenir. Graf Dikkat Ağı (Veličković vd., ICLR 2018), bunu yapan ve GCN'den sonra en çok atıf alan ikinci GNN mimarisi haline gelen makaleydi.</p>

<p class="l-text">Bu derste GAT'ı türetiyoruz, küçük bir grafta NumPy ile dikkat katsayılarını hesaplıyoruz, çok başlı dikkatin nasıl çalıştığını görüyoruz ve GATv2 (Brody vd. 2022) tarafından getirilen ve orijinaldeki ince bir ifade gücü kusurunu düzelten değişiklikleri tartışıyoruz. Hangi komşuların en yüksek ağırlıkları aldığını görselleştireceğiz ve dikkatin başlar arasında uzmanlaştığını göreceğiz. Sonunda GAT'ın heterofili ve gürültülü graflarda neden GCN'i sıklıkla yendiğini ve kenarların önemde farklılaştığında neden varsayılan seçim olduğunu bileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Öğrenilebilir bir $\\mathbf{a}$ ve paylaşılan $W$'dan GAT dikkat katsayısı $\\alpha_{ij}$'yi hesaplamak</li>
<li>Dikkatin yalnızca gerçek kenarlar boyunca akması için komşular üzerinde maskelenmiş softmax uygulamak</li>
<li>Tıpkı Transformer'da olduğu gibi çok başlı dikkati üst üste yığmak</li>
<li>GATv1'i (toplamsal dikkat) GATv2'den (dinamik dikkat) ayırt etmek ve her birinin ne zaman başarısız olduğunu bilmek</li>
<li>Modelin <em>neden</em> bir tahmin yaptığını anlamak için kenar başına dikkati görselleştirmek</li>
<li>Üretimde GAT'ı GCN ve GraphSAGE'e karşı ne zaman kullanacağına karar vermek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. GAT Dikkat Katsayısı</h2>
<p class="l-text">Graftaki her kenar $(i, j)$ için, GAT bir dikkat skoru hesaplar:</p>

<div class="katex-block">$$e_{ij} = \\mathrm{LeakyReLU}\\!\\left(\\mathbf{a}^\\top \\big[W h_i \\,\\|\\, W h_j\\big]\\right)$$</div>

<p class="l-text">burada $W \\in \\mathbb{R}^{F' \\times F}$ özellikleri yeni bir uzaya yansıtır, $\\|$ birleştirmedir ve $\\mathbf{a} \\in \\mathbb{R}^{2F'}$ öğrenilebilir dikkat vektörüdür. Skor daha sonra softmax aracılığıyla $i$'nin komşuları üzerinde normalize edilir:</p>

<div class="katex-block">$$\\alpha_{ij} = \\mathrm{softmax}_{j \\in N(i)}(e_{ij}) = \\frac{\\exp(e_{ij})}{\\sum_{k \\in N(i)} \\exp(e_{ik})}$$</div>

<p class="l-text">Yeni temsil, $\\alpha$ ile ağırlıklandırılmış komşuları toplar:</p>

<div class="katex-block">$$h_i' = \\sigma\\!\\left(\\sum_{j \\in N(i) \\cup \\{i\\}} \\alpha_{ij}\\,W h_j\\right)$$</div>

<p class="l-text">Üç şeyi fark edin. Birincisi, dikkat sadece mevcut kenarlar üzerinde hesaplanır — kenar olmayanlar maskelenmiş softmax aracılığıyla $\\alpha = 0$ alır (bu bir graf-maskedir, tıpkı bir kod çözücü Transformer'daki nedensel maske gibi). İkincisi, $\\mathbf{a}$ sadece $2F'$ parametreye sahiptir — son derece ucuzdur. Üçüncüsü, GAT normalleştirme için global graf yapısını bilmeyi gerektirmez (GCN'in $\\hat{A}$'sının aksine), bu yüzden endüktif görevlerde kutu dışında çalışır.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Dikkati Elle Hesaplamak</h2>
<p class="l-text">L4'teki 5 düğümlü ev grafında tek bir düğüm için $\\alpha_{ij}$ hesaplayalım. Maskeleme, softmax ve son birleştirme adımını adım adım izleyeceğiz.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">5 düğümlü ev grafında NumPy'da tek başlı GAT katmanı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

A = np.<span class="fn">array</span>([[<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>],[<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>],[<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>],[<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>],[<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>]], dtype=<span class="fn">float</span>)
A_with_self = A + np.<span class="fn">eye</span>(<span class="num">5</span>)              <span class="cm"># öz-döngüler ekle (her düğüm kendine de dikkat eder)</span>

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
F, Fp = <span class="num">3</span>, <span class="num">4</span>
X = rng.<span class="fn">normal</span>(size=(<span class="num">5</span>, F))
W = rng.<span class="fn">normal</span>(size=(F, Fp)) * <span class="num">0.5</span>       <span class="cm"># paylaşılan doğrusal projeksiyon</span>
a = rng.<span class="fn">normal</span>(size=(<span class="num">2</span>*Fp,)) * <span class="num">0.5</span>       <span class="cm"># dikkat vektörü</span>

H = X @ W                                 <span class="cm"># dönüştürülmüş özellikler (N, Fp)</span>
<span class="fn">print</span>(<span class="str">"H (dönüştürülmüş özellikler) şekli:"</span>, H.shape)

<span class="cm"># İkili skorlar e_ij = LeakyReLU(a . [Wh_i || Wh_j])</span>
<span class="kw">def</span> <span class="fn">leaky_relu</span>(x, slope=<span class="num">0.2</span>): <span class="kw">return</span> np.<span class="fn">where</span>(x > <span class="num">0</span>, x, slope * x)
a_l, a_r = a[:Fp], a[Fp:]
left_scores  = H @ a_l                    <span class="cm"># "i" tarafının katkısı, şekil (N,)</span>
right_scores = H @ a_r                    <span class="cm"># "j" tarafının katkısı, şekil (N,)</span>
E = <span class="fn">leaky_relu</span>(left_scores[:, <span class="kw">None</span>] + right_scores[<span class="kw">None</span>, :])   <span class="cm"># (N, N)</span>

<span class="cm"># Maske: sadece kenarları tut; kenar olmayanlar -inf alır, böylece softmax 0 verir</span>
E_masked = np.<span class="fn">where</span>(A_with_self > <span class="num">0</span>, E, -<span class="num">1e9</span>)
<span class="cm"># Satır bazında softmax — her düğümün komşu ağırlıkları 1'e toplanır</span>
E_max = E_masked.<span class="fn">max</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
exp_E = np.<span class="fn">exp</span>(E_masked - E_max)
alpha = exp_E / exp_E.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
<span class="fn">print</span>(<span class="str">"\\nDikkat matrisi alpha (satırlar 1'e toplanır, sadece kenarlar boyunca):"</span>)
<span class="fn">print</span>(np.<span class="fn">round</span>(alpha, <span class="num">3</span>))

<span class="cm"># Birleştir</span>
H_new = alpha @ H
<span class="fn">print</span>(<span class="str">"\\nYeni düğüm özellikleri H' şekli:"</span>, H_new.shape)
<span class="fn">print</span>(<span class="str">"Düğüm 0 en çok şuna dikkat etti:"</span>, <span class="fn">int</span>(np.<span class="fn">argmax</span>(alpha[<span class="num">0</span>])), <span class="str">"ağırlık:"</span>, <span class="fn">round</span>(alpha[<span class="num">0</span>].<span class="fn">max</span>(), <span class="num">3</span>))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Çok Başlı Dikkat</h2>
<p class="l-text">Tek başlı dikkat tek bir moda çökebilir. Tıpkı Transformer'da olduğu gibi, GAT <strong>çok başlı dikkat</strong> kullanır: kendi $W^k$ ve $\\mathbf{a}^k$'larıyla $K$ bağımsız dikkat hesaplaması, sonra ya <em>birleştirme</em> (ara katmanlar) ya da <em>ortalama</em> (çıkış katmanı).</p>

<div class="katex-block">$$h_i' = \\big\\|_{k=1}^{K}\\, \\sigma\\!\\left(\\sum_{j \\in N(i)\\cup\\{i\\}} \\alpha^k_{ij}\\,W^k h_j\\right)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">K = 8 baş</div><div class="card-body">Orijinal GAT makalesi Cora'da 8 baş kullanır. Farklı başlar uzmanlaşır: bazıları yerel yapıyı, bazıları etiket-benzer komşuları yakalar vb.</div></div>
<div class="calc-card"><div class="card-title">Birleştir vs ortalama</div><div class="card-body">Gizli katmanlar için birleştir (çeşitliliği korur, çıktı boyutu = $K \\cdot F'$). Son katman için ortalama (tek-çıktı sınıflandırma). Transformer ile aynı kural.</div></div>
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">Tek başlı maliyetin $K$ katı. Modern uygulamalar başları tek bir büyük matmul olarak gruplar, böylece duvar saati neredeyse hiç etkilenmez.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. GAT Kodu (Kavram &mdash; Gerçek Eğitim PyTorch Gerektirir)</h2>
<p class="l-text">İşte gerçek bir GAT katmanının PyTorch Geometric'te nasıl göründüğü. Bunu DEMO olarak işaretliyoruz çünkü <code>torch_geometric</code> Pyodide'de engellidir; aşağıda NumPy eşdeğeri var.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># PyTorch Geometric'te gerçek GAT — torch ve torch_geometric gerekli</span>
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn.functional <span class="kw">as</span> F
<span class="kw">from</span> torch_geometric.nn <span class="kw">import</span> GATConv
<span class="kw">from</span> torch_geometric.datasets <span class="kw">import</span> Planetoid

dataset = <span class="fn">Planetoid</span>(root=<span class="str">"/tmp/cora"</span>, name=<span class="str">"Cora"</span>)
data = dataset[<span class="num">0</span>]

<span class="kw">class</span> <span class="fn">GAT</span>(torch.nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, in_dim, hid, out_dim, heads=<span class="num">8</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">self</span>.gat1 = <span class="fn">GATConv</span>(in_dim, hid, heads=heads, dropout=<span class="num">0.6</span>)
        <span class="kw">self</span>.gat2 = <span class="fn">GATConv</span>(hid * heads, out_dim, heads=<span class="num">1</span>, concat=<span class="kw">False</span>, dropout=<span class="num">0.6</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, edge_index):
        x = F.<span class="fn">elu</span>(<span class="kw">self</span>.<span class="fn">gat1</span>(x, edge_index))
        x = F.<span class="fn">dropout</span>(x, p=<span class="num">0.6</span>, training=<span class="kw">self</span>.training)
        <span class="kw">return</span> <span class="kw">self</span>.<span class="fn">gat2</span>(x, edge_index)

model = <span class="fn">GAT</span>(dataset.num_features, <span class="num">8</span>, dataset.num_classes)
opt = torch.optim.<span class="fn">Adam</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">5e-3</span>, weight_decay=<span class="num">5e-4</span>)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    model.<span class="fn">train</span>(); opt.<span class="fn">zero_grad</span>()
    out = <span class="fn">model</span>(data.x, data.edge_index)
    loss = F.<span class="fn">cross_entropy</span>(out[data.train_mask], data.y[data.train_mask])
    loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
</code></pre></div>

<p class="l-text">Şimdi çalıştırılabilir eşdeğer: karate-kulübü grafında tamamen NumPy'da uygulanan 8 başlı bir GAT ileri geçişi.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Karate-kulübü grafında çok başlı GAT ileri geçişi, sadece NumPy. Başların nasıl uzmanlaştığını görüyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">karate_club_graph</span>()
N = G.<span class="fn">number_of_nodes</span>()
A = nx.<span class="fn">to_numpy_array</span>(G) + np.<span class="fn">eye</span>(N)     <span class="cm"># öz-döngüler ekle</span>

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
F_in, F_out, K = <span class="num">8</span>, <span class="num">4</span>, <span class="num">4</span>                  <span class="cm"># 4 baş, baş başına 4 çıktı boyutu</span>
X = rng.<span class="fn">normal</span>(size=(N, F_in))
W = rng.<span class="fn">normal</span>(size=(K, F_in, F_out)) * <span class="num">0.3</span>
a = rng.<span class="fn">normal</span>(size=(K, <span class="num">2</span>*F_out)) * <span class="num">0.3</span>

<span class="kw">def</span> <span class="fn">leaky</span>(x, s=<span class="num">0.2</span>): <span class="kw">return</span> np.<span class="fn">where</span>(x > <span class="num">0</span>, x, s * x)

heads = []
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K):
    H = X @ W[k]                          <span class="cm"># (N, F_out)</span>
    al, ar = a[k][:F_out], a[k][F_out:]
    e = <span class="fn">leaky</span>(H @ al)[:, <span class="kw">None</span>] + <span class="fn">leaky</span>(H @ ar)[<span class="kw">None</span>, :]
    e = np.<span class="fn">where</span>(A > <span class="num">0</span>, e, -<span class="num">1e9</span>)
    e -= e.<span class="fn">max</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    alpha = np.<span class="fn">exp</span>(e); alpha /= alpha.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    heads.<span class="fn">append</span>(alpha @ H)

<span class="cm"># Başlar arasında birleştir (gizli katmanlar için tipik)</span>
out = np.<span class="fn">concatenate</span>(heads, axis=<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"Çok başlı GAT çıktı şekli:"</span>, out.shape, <span class="str">"= (düğümler, K * F_out)"</span>)

<span class="cm"># Düğüm 0 (Mr. Hi) için baş uzmanlaşmasını incele</span>
<span class="fn">print</span>(<span class="str">"\\nDüğüm 0 için baş başına en üst komşu:"</span>)
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K):
    H = X @ W[k]
    al, ar = a[k][:F_out], a[k][F_out:]
    e = <span class="fn">leaky</span>(H @ al)[:, <span class="kw">None</span>] + <span class="fn">leaky</span>(H @ ar)[<span class="kw">None</span>, :]
    e = np.<span class="fn">where</span>(A > <span class="num">0</span>, e, -<span class="num">1e9</span>)
    e -= e.<span class="fn">max</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    alpha = np.<span class="fn">exp</span>(e); alpha /= alpha.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    j = <span class="fn">int</span>(np.<span class="fn">argmax</span>(alpha[<span class="num">0</span>]))
    <span class="fn">print</span>(f<span class="str">"  baş {k}: düğüm 0'ın en çok dikkat ettiği komşu = düğüm {j}  (alpha={alpha[0,j]:.3f})"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. GATv2 — Statik Dikkati Düzeltmek</h2>
<p class="l-text">Brody, Alon &amp; Yahav (ICLR 2022) bir kusur fark etti: GATv1'de dikkat sıralaması her sorgu düğümü için aynıdır — dikkat "statiktir". Sebebi şudur: $e_{ij} = \\mathbf{a}^\\top[Wh_i \\| Wh_j]$ doğrusal olarak yalnızca $i$'ye bağlı ve yalnızca $j$'ye bağlı terimlere ayrılır, böylece düğüm $i$ "benim için $X$ özellikli komşuları tercih ederim" diyemez — sadece "kim olduğumdan bağımsız olarak yüksek $\\mathbf{a}_r^\\top W h_j$'li komşuları tercih ederim" diyebilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">GATv1 (statik)</div><div class="card-body">$e_{ij} = \\mathrm{LeakyReLU}(\\mathbf{a}^\\top[Wh_i\\|Wh_j])$. Her sorgu için aynı komşu sıralaması.</div></div>
<div class="calc-card"><div class="card-title">GATv2 (dinamik)</div><div class="card-body">$e_{ij} = \\mathbf{a}^\\top \\mathrm{LeakyReLU}(W[h_i\\|h_j])$. Doğrusal olmama dikkat vektöründen <em>önce</em> gelir — sorguya bağlı sıralama.</div></div>
<div class="calc-card"><div class="card-title">Ampirik olarak</div><div class="card-body">GATv2 çoğu heterofili kıyaslamasında kazanır. GATv1, homofilinin yüksek olduğu Cora/Citeseer'de hala beraberlikte kalır. 2026'da varsayılan olarak GATv2 kullanın.</div></div>
</div>

<div class="calc-highlight">GATv1'den GATv2'ye geçiş <strong>uygulama maliyeti</strong> ~3 satırdır. PyTorch Geometric, <code>GATConv</code> (v1) ve <code>GATv2Conv</code> (v2) sunar. Düzeltme neredeyse bedavadır, tercih edin.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Kenar Özellikleri ve Kenar-Farkındalı Dikkat</h2>
<p class="l-text">Vanilla GAT kenar özelliklerini görmezden gelir — ancak moleküllerin bağ tipleri vardır, bilgi graflarının ilişki tipleri vardır ve trafik ağlarının yol kapasiteleri vardır. İki uzantı bunu ele alır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">EGAT / GAT-edge</div><div class="card-body">Kenar özelliklerini dikkat girdisine birleştir: $e_{ij} = \\mathbf{a}^\\top[Wh_i\\|Wh_j\\|We_{ij}]$. Ucuz ve etkili.</div></div>
<div class="calc-card"><div class="card-title">R-GAT / R-GCN</div><div class="card-body">Tipli kenarlar için: ilişki tipi başına ayrı ağırlık matrisleri. Gerekirse dikkat ile birleştirin. Bilgi-grafı tamamlama için standart seçim.</div></div>
<div class="calc-card"><div class="card-title">GINE</div><div class="card-body">GIN'in (Xu vd. 2019) kenar özelliklerini mesaja enjekte eden bir uzantısı. Molekül özellik tahmininde güçlü.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. GAT'ı GCN'e Karşı Ne Zaman Kullanmalısınız?</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">GCN'i şu zaman kullan</div><div class="card-body">Graf homofiliktir, kenarlar benzer ağırlık taşır, en basit temeli istiyorsunuz. Cora, Citeseer, çoğu atıf ağı.</div></div>
<div class="calc-card"><div class="card-title">GAT'ı şu zaman kullan</div><div class="card-body">Kenarlar önemde farklılaşır, gürültülü / yanıltıcı kenarlarınız vardır (dikkat bunları aşağı ağırlıklandırabilir) veya yorumlanabilirliğe ihtiyacınız var — dikkat ağırlıkları size <em>nedenini</em> söyler.</div></div>
<div class="calc-card"><div class="card-title">GraphSAGE'i şu zaman kullan</div><div class="card-body">Endüktif kurulum (yeni graflara genelleşmek zorunda) veya grafınız tam boyutta hesaplanamayacak kadar büyük — komşulukları örnekleyin.</div></div>
<div class="calc-card"><div class="card-title">GIN'i şu zaman kullan</div><div class="card-body">Güçlü yapısal sinyalle graf sınıflandırma. GIN, Weisfeiler-Lehman anlamında en ifade edicidir (Xu vd. 2019).</div></div>
</div>

<div class="calc-highlight"><strong>Üretim verisi:</strong> Pinterest'in PinSage'i (2018) milyar ölçekli öneri için GraphSAGE kullandı. Twitter'ın TwHIN'i heterojen bir varyant kullandı. Uber'in DeepETA'sı GCN-tarzı uzamsal düzleştirme kullandı. GAT en çok kenarların gerçekten farklılaştığı molekül ve bilgi-grafı çalışmalarında ortaya çıkar.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sıradakiler</h2>
<p class="l-text">GAT, GCN'in derece-tabanlı sabit normalleştirmesini her kenar için öğrenilmiş bir dikkat katsayısıyla değiştirir. Çok başlı dikkat tıpkı Transformer'da olduğu gibi çalışır. GATv2 statik-dikkat kusurunu düzeltir ve 2026'da varsayılandır. Dikkat yorumlanabilirlik ekler — modelin hangi komşuları kullandığını görselleştirebilirsiniz.</p>

<div class="calc-highlight"><strong>Anahtar noktalar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>$\\alpha_{ij}$ öğrenilebilir bir dikkat vektörü + komşular üzerinde maskelenmiş softmax'tan.</li>
<li>Çok başlı: K bağımsız dikkat, gizli için birleştir, çıktı için ortalama.</li>
<li>GATv2 statik dikkati düzeltir ve varsayılan olmalıdır.</li>
<li>Kenar özellikleri birleştirme (EGAT) veya ilişki-tiplemesi (R-GAT) aracılığıyla ele alınır.</li>
<li>GAT yorumlanabilirdir: her tahmin için hangi komşuların önemli olduğunu görmek için $\\alpha$'yı görselleştirin.</li>
</ul>
</div>

<p class="l-text"><strong>gnn-L6</strong>'da NumPy'yı geride bırakıp <strong>PyTorch Geometric</strong>'e geçiyoruz — GNN'ler için üretim kütüphanesi. Data / Batch / DataLoader, MessagePassing API'si, örnekleme için NeighborLoader ve deney yapmayı önemsiz hale getiren 50+ yerleşik veri kümesini turlayacağız.</p>
</div>`
};
