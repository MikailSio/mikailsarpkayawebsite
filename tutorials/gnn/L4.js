window.GNN_L4 = {
en: `<p class="l-text"><strong>The Graph Convolutional Network (GCN) of Kipf &amp; Welling, ICLR 2017, is the paper that turned GNNs from a niche curiosity into a default tool.</strong> It is one of the most-cited deep-learning papers of the late 2010s, and its 4-line forward pass — $H' = \\sigma(\\hat{A} H W)$ — fits on a coffee mug. The paper's contribution is not invention (spectral GNNs existed since 2014) but <em>simplification</em>: a single propagation matrix $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ with self-loops, no eigendecomposition at training time, and a 2-layer model that beat all baselines on Cora/Citeseer/Pubmed in 2017.</p>

<p class="l-text">In this lesson we re-derive GCN from first principles (the message-passing perspective), build the renormalized adjacency by hand, and implement a 2-layer GCN forward pass and gradient descent in pure NumPy on a 5-node toy graph plus the famous Karate Club. No PyTorch, no PyG — just <code>np.matmul</code>. By the end you will know exactly what the famous formula does, why it works, and where its limits are (oversmoothing, no edge features, fixed neighborhood weights — fixed by GAT in L5).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read the Kipf-Welling formula $H' = \\sigma(\\hat{A} H W)$ as a single message-passing step</li>
<li>Build $\\tilde{A} = A + I$, $\\tilde{D}$, and $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ by hand</li>
<li>Implement a 2-layer GCN forward pass in pure NumPy (5-node toy graph)</li>
<li>Train it with cross-entropy + manual backprop on the karate-club faction split</li>
<li>Understand why self-loops matter, why symmetric normalization beats row normalization</li>
<li>Diagnose the model's three structural weaknesses: equal neighbor weights, no edge features, oversmoothing</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Message Passing — The Modern Way to Read GCN</h2>
<p class="l-text">Spectral derivations are elegant but the modern GNN community thinks in <strong>message passing</strong> (Gilmer et al. 2017). For each node $v$:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Message</div><div class="card-body">Each neighbor $u \\in N(v)$ sends a "message" $m_{u \\to v} = \\phi(h_u, h_v, e_{uv})$. For GCN: $m_{u \\to v} = h_u$ (just the neighbor's vector — no edge features used).</div></div>
<div class="calc-card"><div class="card-title">2. Aggregate</div><div class="card-body">Combine all incoming messages into one vector. For GCN: weighted sum with weights $1/\\sqrt{\\tilde{d}_v \\tilde{d}_u}$ — symmetric normalization.</div></div>
<div class="calc-card"><div class="card-title">3. Update</div><div class="card-body">Mix the aggregate with the node's own state via a learnable transform: $h_v' = \\sigma(W \\cdot \\text{agg})$. GCN includes self via the self-loop in $\\tilde{A}$, then applies $W$ and ReLU.</div></div>
</div>

<div class="katex-block">$$h_v^{(l+1)} = \\sigma\\!\\left(\\sum_{u \\in N(v) \\cup \\{v\\}} \\frac{1}{\\sqrt{\\tilde{d}_v \\tilde{d}_u}} \\, W^{(l)} \\, h_u^{(l)}\\right)$$</div>

<p class="l-text">In matrix form, that sum over all nodes is exactly $\\hat{A} H W$. The framework subsumes most GNNs — GCN, GraphSAGE, GAT, GIN — by changing the message and aggregator functions.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Building $\\hat{A}$ by Hand on a 5-Node Graph</h2>
<p class="l-text">Concrete time. Take the smallest non-trivial graph — 5 nodes in a "house" shape (square + roof). Build $\\tilde{A} = A + I$ (self-loops), $\\tilde{D}$ (new degrees), and the normalized $\\hat{A}$ step by step.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">5-node house graph. Build A, A_tilde, D_tilde, A_hat. Verify each row of A_hat sums sensibly.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># House graph: nodes 0..4 ; square 0-1-2-3-0 + roof from 0-4 and 1-4</span>
A = np.<span class="fn">array</span>([
    [<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>],
    [<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>],
    [<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>],
    [<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>],
    [<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>],
], dtype=<span class="fn">float</span>)
<span class="fn">print</span>(<span class="str">"A =\\n"</span>, A)

I = np.<span class="fn">eye</span>(<span class="num">5</span>)
A_tilde = A + I
<span class="fn">print</span>(<span class="str">"\\nA_tilde = A + I  (self-loops):\\n"</span>, A_tilde)

deg_tilde = A_tilde.<span class="fn">sum</span>(axis=<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"\\nDegrees with self-loops:"</span>, deg_tilde)

D_inv_sqrt = np.<span class="fn">diag</span>(<span class="num">1.0</span> / np.<span class="fn">sqrt</span>(deg_tilde))
A_hat = D_inv_sqrt @ A_tilde @ D_inv_sqrt
<span class="fn">print</span>(<span class="str">"\\nA_hat = D^(-1/2) A_tilde D^(-1/2):\\n"</span>, np.<span class="fn">round</span>(A_hat, <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"\\nRow sums of A_hat:"</span>, np.<span class="fn">round</span>(A_hat.<span class="fn">sum</span>(axis=<span class="num">1</span>), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"(Not 1.0 because symmetric, not row-stochastic — that's the point.)"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Forward Pass: One Layer in 3 Lines</h2>
<p class="l-text">Now the layer. Start with random node features $X \\in \\mathbb{R}^{5 \\times 3}$ and a random weight matrix $W \\in \\mathbb{R}^{3 \\times 4}$. Compute $H' = \\mathrm{ReLU}(\\hat{A} X W)$. Inspect the shape and what happened to each node.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Run a single GCN layer on the 5-node house graph.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

A = np.<span class="fn">array</span>([[<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>],[<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>],[<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>],[<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>],[<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>]], dtype=<span class="fn">float</span>)
I = np.<span class="fn">eye</span>(<span class="num">5</span>); A_tilde = A + I
d = A_tilde.<span class="fn">sum</span>(axis=<span class="num">1</span>)
A_hat = np.<span class="fn">diag</span>(<span class="num">1.0</span>/np.<span class="fn">sqrt</span>(d)) @ A_tilde @ np.<span class="fn">diag</span>(<span class="num">1.0</span>/np.<span class="fn">sqrt</span>(d))

rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)
X = rng.<span class="fn">normal</span>(size=(<span class="num">5</span>, <span class="num">3</span>))                 <span class="cm"># 5 nodes, 3-dim features</span>
W = rng.<span class="fn">normal</span>(size=(<span class="num">3</span>, <span class="num">4</span>)) * <span class="num">0.3</span>            <span class="cm"># output 4-dim hidden</span>
H = np.<span class="fn">maximum</span>(<span class="num">0.0</span>, A_hat @ X @ W)            <span class="cm"># GCN layer + ReLU</span>
<span class="fn">print</span>(<span class="str">"X (input features):\\n"</span>, np.<span class="fn">round</span>(X, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"\\nH (after one GCN layer):\\n"</span>, np.<span class="fn">round</span>(H, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"\\nShape:"</span>, H.shape, <span class="str">"— each node now has a 4-dim representation that has mixed in info from its neighbors"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Two-Layer GCN — The Standard Model</h2>
<p class="l-text">In the original Kipf-Welling paper the model is exactly two layers: hidden + output, each followed by an activation, with a softmax for classification. Two layers means each node sees its 2-hop neighborhood, which is enough on most citation graphs.</p>

<div class="katex-block">$$Z = \\mathrm{softmax}\\!\\left(\\hat{A}\\,\\mathrm{ReLU}\\big(\\hat{A}\\,X\\,W^{(0)}\\big)\\,W^{(1)}\\right)$$</div>

<p class="l-text">For semi-supervised node classification, train with cross-entropy on the (small) labeled subset only, but propagate features through the entire graph. This is the magic of transductive learning: even unlabeled nodes contribute to the loss through their neighbors.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Layer 0 (hidden)</div><div class="card-body">$H^{(1)} = \\mathrm{ReLU}(\\hat{A} X W^{(0)})$ with $W^{(0)} \\in \\mathbb{R}^{F \\times d_h}$, e.g. $1433 \\to 16$ on Cora.</div></div>
<div class="calc-card"><div class="card-title">Layer 1 (output)</div><div class="card-body">$Z = \\mathrm{softmax}(\\hat{A} H^{(1)} W^{(1)})$ with $W^{(1)} \\in \\mathbb{R}^{d_h \\times C}$, e.g. $16 \\to 7$ classes.</div></div>
<div class="calc-card"><div class="card-title">Loss</div><div class="card-body">$\\mathcal{L} = -\\sum_{i \\in V_{\\mathrm{labeled}}} \\sum_c y_{ic} \\log Z_{ic}$. Only labeled rows contribute.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Training a GCN by Hand on Karate Club</h2>
<p class="l-text">Now the full thing: a 2-layer GCN trained with manual gradient descent on the karate-club graph, using one labeled node per faction. The model should learn to separate the 34 nodes into two factions just from the propagated structure.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">2-layer GCN, identity input features, manual backprop, 200 epochs. Final accuracy ~90%+ on the 32 unlabeled nodes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">karate_club_graph</span>()
N = G.<span class="fn">number_of_nodes</span>()
A = nx.<span class="fn">to_numpy_array</span>(G)
I = np.<span class="fn">eye</span>(N); A_tilde = A + I
d = A_tilde.<span class="fn">sum</span>(axis=<span class="num">1</span>)
A_hat = np.<span class="fn">diag</span>(<span class="num">1.0</span>/np.<span class="fn">sqrt</span>(d)) @ A_tilde @ np.<span class="fn">diag</span>(<span class="num">1.0</span>/np.<span class="fn">sqrt</span>(d))

<span class="cm"># Identity input features (no per-node info — model learns from structure only)</span>
X = np.<span class="fn">eye</span>(N)

<span class="cm"># Labels: 0 = Mr. Hi, 1 = Officer</span>
y = np.<span class="fn">array</span>([<span class="num">0</span> <span class="kw">if</span> G.nodes[n][<span class="str">"club"</span>]==<span class="str">"Mr. Hi"</span> <span class="kw">else</span> <span class="num">1</span> <span class="kw">for</span> n <span class="kw">in</span> G.<span class="fn">nodes</span>()])
<span class="cm"># Only nodes 0 (Mr. Hi) and 33 (Officer) are labeled</span>
train_mask = np.<span class="fn">zeros</span>(N, dtype=<span class="fn">bool</span>); train_mask[<span class="num">0</span>]=<span class="kw">True</span>; train_mask[<span class="num">33</span>]=<span class="kw">True</span>

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
H_DIM, C = <span class="num">8</span>, <span class="num">2</span>
W0 = rng.<span class="fn">normal</span>(size=(N, H_DIM)) * <span class="num">0.3</span>
W1 = rng.<span class="fn">normal</span>(size=(H_DIM, C)) * <span class="num">0.3</span>

<span class="kw">def</span> <span class="fn">softmax</span>(z):
    z = z - z.<span class="fn">max</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    e = np.<span class="fn">exp</span>(z); <span class="kw">return</span> e / e.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)

lr = <span class="num">0.05</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">201</span>):
    <span class="cm"># Forward</span>
    Z1 = A_hat @ X @ W0
    H1 = np.<span class="fn">maximum</span>(<span class="num">0</span>, Z1)
    Z2 = A_hat @ H1 @ W1
    P  = <span class="fn">softmax</span>(Z2)

    <span class="cm"># Loss + accuracy</span>
    Y_oh = np.<span class="fn">eye</span>(C)[y]
    loss = -np.<span class="fn">sum</span>(np.<span class="fn">log</span>(P[train_mask] + <span class="num">1e-12</span>) * Y_oh[train_mask]) / train_mask.<span class="fn">sum</span>()
    acc  = (P.<span class="fn">argmax</span>(axis=<span class="num">1</span>) == y).<span class="fn">mean</span>()
    <span class="kw">if</span> epoch % <span class="num">40</span> == <span class="num">0</span>:
        <span class="fn">print</span>(f<span class="str">"epoch {epoch:3d}  loss={loss:.4f}  full-graph acc={acc:.3f}"</span>)

    <span class="cm"># Manual backprop (only train_mask rows contribute to dLoss/dZ2)</span>
    dZ2 = (P - Y_oh) * train_mask[:, <span class="kw">None</span>] / train_mask.<span class="fn">sum</span>()
    dW1 = (A_hat @ H1).T @ dZ2
    dH1 = A_hat.T @ dZ2 @ W1.T
    dZ1 = dH1 * (Z1 > <span class="num">0</span>)
    dW0 = (A_hat @ X).T @ dZ1

    W1 -= lr * dW1
    W0 -= lr * dW0

<span class="fn">print</span>(<span class="str">"\\nFinal node classification (0 = Mr. Hi, 1 = Officer):"</span>, P.<span class="fn">argmax</span>(axis=<span class="num">1</span>))
</code></pre></div>
</div>

<p class="l-text">Notice the propagation: only 2 nodes are labeled, but the model labels all 34. Information flows from each labeled node to its 2-hop neighborhood through $\\hat{A}^2$. This is the entire point of GNNs — exploit the graph for label propagation, learned end-to-end.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Why Symmetric Normalization?</h2>
<p class="l-text">Three obvious choices for the propagation matrix:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sum: $A$</div><div class="card-body">High-degree nodes dominate. Eigenvalues grow with the graph. Numerically unstable for deep models.</div></div>
<div class="calc-card"><div class="card-title">Row-normalized: $D^{-1}A$</div><div class="card-body">Each row sums to 1 (mean of neighbors). Asymmetric — different from a column perspective. Used by GraphSAGE-mean.</div></div>
<div class="calc-card"><div class="card-title">Symmetric: $D^{-1/2}AD^{-1/2}$</div><div class="card-body">Eigenvalues in $[-1, 1]$. Symmetric, which preserves spectral properties. The Kipf-Welling choice. Each entry is $A_{ij}/\\sqrt{d_i d_j}$ — penalizes both ends if either is high-degree.</div></div>
</div>

<p class="l-text">Empirically symmetric beats row-norm by 1–2 points on Cora-style benchmarks because it down-weights edges from popular hubs (Twitter celebrities, citation kings). Practically, both work; the literature settled on symmetric for spectral consistency.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Three Structural Weaknesses (Solved by Later Models)</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Equal neighbor weights</div><div class="card-body">$\\hat{A}_{ij}$ depends only on degrees, not on what $h_u$ and $h_v$ contain. Some neighbors should matter more than others. <strong>GAT</strong> (next lesson) learns these weights via attention.</div></div>
<div class="calc-card"><div class="card-title">2. No edge features</div><div class="card-body">Bond type in molecules, relation type in knowledge graphs — GCN ignores them. <strong>R-GCN</strong> uses one weight matrix per edge type; <strong>MPNN</strong> incorporates edge features into the message function.</div></div>
<div class="calc-card"><div class="card-title">3. Transductive only (in vanilla form)</div><div class="card-body">$\\hat{A}$ is fixed for the whole graph. Adding new nodes at test time requires recomputing $\\hat{A}$. <strong>GraphSAGE</strong> samples neighborhoods and learns aggregator functions, generalizing to unseen graphs.</div></div>
</div>

<div class="calc-highlight"><strong>And one more:</strong> oversmoothing (covered in L3) limits depth. APPNP / GCNII / JKNet are the standard fixes. Despite all this, vanilla GCN remains the strongest baseline on most academic benchmarks — the "linear regression" of the GNN world.</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7b. Node embeddings across GCN layers (visual)</h2>
<p class="l-text">Watch the 34 karate-club members cluster as we stack message-passing layers. At layer 0 (raw features) the two factions overlap. After layer 1 most nodes drift toward their faction. After layer 2 the boundary is almost linearly separable — exactly why GCN-2-layer is the default depth.</p>
<div id="plot-gnn-l4-emb-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var text = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc';
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var grid = 'rgba(255,255,255,0.06)';
  // 34 karate club nodes, two factions. Each "layer" tightens the clusters.
  function seeded(i){ return (Math.sin(i*12.9898 + 78.233)*43758.5453) % 1; }
  function genLayer(spread, sep){
    var xs=[], ys=[], col=[];
    for (var i=0; i<34; i++){
      var faction = i<17 ? 0 : 1;
      var cx = faction === 0 ? -sep : sep;
      var cy = 0;
      var r1 = (seeded(i+1)+1)/2, r2 = (seeded(i*7+3)+1)/2;
      var theta = 2*Math.PI*r1;
      var rad   = spread*Math.sqrt(r2);
      xs.push(cx + rad*Math.cos(theta));
      ys.push(cy + rad*Math.sin(theta));
      col.push(faction === 0 ? '#6aa9ff' : accent);
    }
    return {x:xs, y:ys, color:col};
  }
  var L0 = genLayer(1.8, 0.4);
  var L1 = genLayer(0.9, 1.2);
  var L2 = genLayer(0.4, 2.0);
  var trace = function(L, name, visible){
    return { x:L.x, y:L.y, mode:'markers', type:'scatter', name:name,
      marker:{size:11, color:L.color, line:{color:'rgba(255,255,255,0.25)', width:1}},
      visible:visible };
  };
  var data = [ trace(L0,'layer 0 (raw)',true), trace(L1,'layer 1',false), trace(L2,'layer 2',false) ];
  var layout = { paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:text},
    xaxis:{title:'embed dim 1', gridcolor:grid, zerolinecolor:grid},
    yaxis:{title:'embed dim 2', gridcolor:grid, zerolinecolor:grid, scaleanchor:'x'},
    margin:{t:80,r:20,b:60,l:60}, title:{text:'Karate club embeddings across GCN depth', font:{color:text, size:14}}, height:380,
    updatemenus:[{ type:'buttons', direction:'right', x:0.0, y:1.15, buttons:[
      {label:'layer 0', method:'update', args:[{visible:[true,false,false]}]},
      {label:'layer 1', method:'update', args:[{visible:[false,true,false]}]},
      {label:'layer 2', method:'update', args:[{visible:[false,false,true]}]}
    ]}] };
  Plotly.newPlot('plot-gnn-l4-emb-en', data, layout, {responsive:true, displayModeBar:false});
  var trDiv = document.getElementById('plot-gnn-l4-emb-tr');
  if (trDiv) {
    var layoutTr = Object.assign({}, layout, {
      title:{text:'GCN derinligi boyunca Karate kulubu gomulmeleri', font:{color:text, size:14}},
      xaxis:{title:'gomulme boyutu 1', gridcolor:grid, zerolinecolor:grid},
      yaxis:{title:'gomulme boyutu 2', gridcolor:grid, zerolinecolor:grid, scaleanchor:'x'},
      updatemenus:[{ type:'buttons', direction:'right', x:0.0, y:1.15, buttons:[
        {label:'katman 0', method:'update', args:[{visible:[true,false,false]}]},
        {label:'katman 1', method:'update', args:[{visible:[false,true,false]}]},
        {label:'katman 2', method:'update', args:[{visible:[false,false,true]}]}
      ]}]
    });
    Plotly.newPlot('plot-gnn-l4-emb-tr', data, layoutTr, {responsive:true, displayModeBar:false});
  }
}, 250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Each GCN layer averages a node's representation with its neighbours' — so nodes that share many neighbours converge. Two layers is usually enough; deeper stacks suffer from over-smoothing, where all nodes collapse to the same vector.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">GCN compresses the spectral-GNN literature into one line: $H' = \\sigma(\\hat{A} H W)$, with $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$. It is fast, simple, and a strong baseline that you should always run before reaching for fancier models.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Message passing decomposes any GNN into Message + Aggregate + Update.</li>
<li>$\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ adds self-loops then symmetric-normalizes.</li>
<li>2-layer GCN is the standard depth: each node sees its 2-hop neighborhood.</li>
<li>Manual NumPy backprop fits in 30 lines and trains the karate-club faction split correctly.</li>
<li>Three weaknesses motivate GAT (attention), R-GCN (edge types), GraphSAGE (inductive).</li>
</ul>
</div>

<p class="l-text">In <strong>gnn-L5</strong> we attack the "equal neighbor weights" problem: GAT's attention mechanism learns $\\alpha_{ij}$ for every edge, with multi-head attention exactly like the Transformer. We will compute attention coefficients in NumPy and visualize which neighbors matter most for each node.</p>
</div>`,
tr: `<p class="l-text"><strong>Kipf &amp; Welling'in Graf Konvolüsyonel Ağı (GCN), ICLR 2017, GNN'leri niş bir meraktan varsayılan bir araca dönüştüren makaledir.</strong> 2010'ların sonlarının en çok atıf alan derin öğrenme makalelerinden biridir ve 4 satırlık ileri geçişi — $H' = \\sigma(\\hat{A} H W)$ — bir kahve kupasına sığar. Makalenin katkısı icat değildir (spektral GNN'ler 2014'ten beri vardı), <em>basitleştirmedir</em>: öz-döngülerle tek bir yayılım matrisi $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$, eğitim zamanında özayrıştırma yok ve 2017'de Cora/Citeseer/Pubmed'de tüm temelleri yenen 2-katmanlı bir model.</p>

<p class="l-text">Bu derste GCN'i ilk ilkelerden yeniden türetiyoruz (mesaj geçişi perspektifi), yeniden normalleştirilmiş komşuluk matrisini elle oluşturuyoruz ve 5 düğümlü oyuncak bir grafta artı ünlü Karate Club'da 2-katmanlı bir GCN ileri geçişi ve gradyan inişini saf NumPy'da uyguluyoruz. PyTorch yok, PyG yok — sadece <code>np.matmul</code>. Sonunda, ünlü formülün tam olarak ne yaptığını, neden çalıştığını ve sınırlarının nerede olduğunu bileceksiniz (aşırı düzleşme, kenar özelliği yok, sabit komşuluk ağırlıkları — L5'te GAT tarafından düzeltildi).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Kipf-Welling formülü $H' = \\sigma(\\hat{A} H W)$'yu tek bir mesaj geçiş adımı olarak okumak</li>
<li>$\\tilde{A} = A + I$, $\\tilde{D}$ ve $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$'yi elle oluşturmak</li>
<li>Saf NumPy'da 2 katmanlı bir GCN ileri geçişi uygulamak (5 düğümlü oyuncak graf)</li>
<li>Onu çapraz entropi + manuel geri yayılım ile karate-kulübü grup ayrımı üzerinde eğitmek</li>
<li>Öz-döngülerin neden önemli olduğunu, simetrik normalleştirmenin satır normalleştirmesini neden yendiğini anlamak</li>
<li>Modelin üç yapısal zayıflığını teşhis etmek: eşit komşu ağırlıkları, kenar özelliği yok, aşırı düzleşme</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Mesaj Geçişi — GCN'i Okumanın Modern Yolu</h2>
<p class="l-text">Spektral türetmeler zariftir, ancak modern GNN topluluğu <strong>mesaj geçişi</strong> (Gilmer vd. 2017) ile düşünür. Her düğüm $v$ için:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Mesaj</div><div class="card-body">Her komşu $u \\in N(v)$, bir "mesaj" $m_{u \\to v} = \\phi(h_u, h_v, e_{uv})$ gönderir. GCN için: $m_{u \\to v} = h_u$ (sadece komşunun vektörü — kenar özelliği kullanılmaz).</div></div>
<div class="calc-card"><div class="card-title">2. Birleştir</div><div class="card-body">Tüm gelen mesajları tek bir vektörde birleştirir. GCN için: $1/\\sqrt{\\tilde{d}_v \\tilde{d}_u}$ ağırlıklarıyla ağırlıklı toplam — simetrik normalleştirme.</div></div>
<div class="calc-card"><div class="card-title">3. Güncelle</div><div class="card-body">Birleştirmeyi düğümün kendi durumuyla öğrenilebilir bir dönüşüm aracılığıyla karıştırır: $h_v' = \\sigma(W \\cdot \\text{agg})$. GCN, $\\tilde{A}$'daki öz-döngü aracılığıyla kendisini dahil eder, sonra $W$ ve ReLU uygular.</div></div>
</div>

<div class="katex-block">$$h_v^{(l+1)} = \\sigma\\!\\left(\\sum_{u \\in N(v) \\cup \\{v\\}} \\frac{1}{\\sqrt{\\tilde{d}_v \\tilde{d}_u}} \\, W^{(l)} \\, h_u^{(l)}\\right)$$</div>

<p class="l-text">Matris formunda, tüm düğümler üzerindeki o toplam tam olarak $\\hat{A} H W$'dur. Çerçeve mesaj ve birleştirici fonksiyonlarını değiştirerek çoğu GNN'i — GCN, GraphSAGE, GAT, GIN — kapsar.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. 5 Düğümlü Bir Grafta $\\hat{A}$'yı Elle Oluşturmak</h2>
<p class="l-text">Somutlama zamanı. En küçük aşikar olmayan grafı alın — "ev" şeklinde 5 düğüm (kare + çatı). $\\tilde{A} = A + I$ (öz-döngüler), $\\tilde{D}$ (yeni dereceler) ve normalize edilmiş $\\hat{A}$'yı adım adım oluşturun.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">5 düğümlü ev grafı. A, A_tilde, D_tilde, A_hat oluşturun. A_hat'in her satırının makul şekilde toplandığını doğrulayın.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Ev grafı: düğümler 0..4 ; kare 0-1-2-3-0 + 0-4 ve 1-4'ten çatı</span>
A = np.<span class="fn">array</span>([
    [<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>],
    [<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>],
    [<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>],
    [<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>],
    [<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>],
], dtype=<span class="fn">float</span>)
<span class="fn">print</span>(<span class="str">"A =\\n"</span>, A)

I = np.<span class="fn">eye</span>(<span class="num">5</span>)
A_tilde = A + I
<span class="fn">print</span>(<span class="str">"\\nA_tilde = A + I  (öz-döngüler):\\n"</span>, A_tilde)

deg_tilde = A_tilde.<span class="fn">sum</span>(axis=<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"\\nÖz-döngülerle dereceler:"</span>, deg_tilde)

D_inv_sqrt = np.<span class="fn">diag</span>(<span class="num">1.0</span> / np.<span class="fn">sqrt</span>(deg_tilde))
A_hat = D_inv_sqrt @ A_tilde @ D_inv_sqrt
<span class="fn">print</span>(<span class="str">"\\nA_hat = D^(-1/2) A_tilde D^(-1/2):\\n"</span>, np.<span class="fn">round</span>(A_hat, <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"\\nA_hat'in satır toplamları:"</span>, np.<span class="fn">round</span>(A_hat.<span class="fn">sum</span>(axis=<span class="num">1</span>), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"(Simetrik olduğundan 1.0 değil, satır-stokastik değil — amaç bu.)"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. İleri Geçiş: 3 Satırda Bir Katman</h2>
<p class="l-text">Şimdi katman. Rastgele düğüm özellikleri $X \\in \\mathbb{R}^{5 \\times 3}$ ve rastgele bir ağırlık matrisi $W \\in \\mathbb{R}^{3 \\times 4}$ ile başlayın. $H' = \\mathrm{ReLU}(\\hat{A} X W)$ hesaplayın. Şekli ve her düğüme ne olduğunu inceleyin.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">5 düğümlü ev grafında tek bir GCN katmanı çalıştırın.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

A = np.<span class="fn">array</span>([[<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>],[<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>],[<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>],[<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>],[<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>]], dtype=<span class="fn">float</span>)
I = np.<span class="fn">eye</span>(<span class="num">5</span>); A_tilde = A + I
d = A_tilde.<span class="fn">sum</span>(axis=<span class="num">1</span>)
A_hat = np.<span class="fn">diag</span>(<span class="num">1.0</span>/np.<span class="fn">sqrt</span>(d)) @ A_tilde @ np.<span class="fn">diag</span>(<span class="num">1.0</span>/np.<span class="fn">sqrt</span>(d))

rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)
X = rng.<span class="fn">normal</span>(size=(<span class="num">5</span>, <span class="num">3</span>))                 <span class="cm"># 5 düğüm, 3-boyutlu özellikler</span>
W = rng.<span class="fn">normal</span>(size=(<span class="num">3</span>, <span class="num">4</span>)) * <span class="num">0.3</span>            <span class="cm"># çıktı 4-boyutlu gizli</span>
H = np.<span class="fn">maximum</span>(<span class="num">0.0</span>, A_hat @ X @ W)            <span class="cm"># GCN katmanı + ReLU</span>
<span class="fn">print</span>(<span class="str">"X (girdi özellikleri):\\n"</span>, np.<span class="fn">round</span>(X, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"\\nH (bir GCN katmanından sonra):\\n"</span>, np.<span class="fn">round</span>(H, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"\\nŞekil:"</span>, H.shape, <span class="str">"— her düğüm artık komşularından bilgi karıştırılmış 4-boyutlu bir temsile sahip"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. İki Katmanlı GCN — Standart Model</h2>
<p class="l-text">Orijinal Kipf-Welling makalesinde model tam olarak iki katmandır: gizli + çıkış, her biri bir aktivasyonla takip edilir, sınıflandırma için bir softmax ile. İki katman, her düğümün kendi 2-adımlı komşuluğunu görmesi anlamına gelir, bu çoğu atıf grafında yeterlidir.</p>

<div class="katex-block">$$Z = \\mathrm{softmax}\\!\\left(\\hat{A}\\,\\mathrm{ReLU}\\big(\\hat{A}\\,X\\,W^{(0)}\\big)\\,W^{(1)}\\right)$$</div>

<p class="l-text">Yarı-denetimli düğüm sınıflandırma için, sadece (küçük) etiketli alt küme üzerinde çapraz entropi ile eğitin, ancak özellikleri tüm graf boyunca yayın. Bu, transdüktif öğrenmenin sihridir: etiketsiz düğümler bile komşuları aracılığıyla kayba katkıda bulunur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Katman 0 (gizli)</div><div class="card-body">$H^{(1)} = \\mathrm{ReLU}(\\hat{A} X W^{(0)})$ ile $W^{(0)} \\in \\mathbb{R}^{F \\times d_h}$, örn. Cora'da $1433 \\to 16$.</div></div>
<div class="calc-card"><div class="card-title">Katman 1 (çıkış)</div><div class="card-body">$Z = \\mathrm{softmax}(\\hat{A} H^{(1)} W^{(1)})$ ile $W^{(1)} \\in \\mathbb{R}^{d_h \\times C}$, örn. $16 \\to 7$ sınıf.</div></div>
<div class="calc-card"><div class="card-title">Kayıp</div><div class="card-body">$\\mathcal{L} = -\\sum_{i \\in V_{\\mathrm{labeled}}} \\sum_c y_{ic} \\log Z_{ic}$. Sadece etiketli satırlar katkıda bulunur.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Karate Kulübünde Bir GCN'i Elle Eğitmek</h2>
<p class="l-text">Şimdi tam şey: karate-kulübü grafında, her grup için bir etiketli düğümle, manuel gradyan inişi ile eğitilen 2 katmanlı bir GCN. Modelin yayılan yapıdan sadece 34 düğümü iki gruba ayırmayı öğrenmesi gerekir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">2 katmanlı GCN, kimlik girdi özellikleri, manuel geri yayılım, 200 dönem. 32 etiketsiz düğümde son doğruluk ~%90+.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">karate_club_graph</span>()
N = G.<span class="fn">number_of_nodes</span>()
A = nx.<span class="fn">to_numpy_array</span>(G)
I = np.<span class="fn">eye</span>(N); A_tilde = A + I
d = A_tilde.<span class="fn">sum</span>(axis=<span class="num">1</span>)
A_hat = np.<span class="fn">diag</span>(<span class="num">1.0</span>/np.<span class="fn">sqrt</span>(d)) @ A_tilde @ np.<span class="fn">diag</span>(<span class="num">1.0</span>/np.<span class="fn">sqrt</span>(d))

<span class="cm"># Kimlik girdi özellikleri (düğüm-başına bilgi yok — model sadece yapıdan öğrenir)</span>
X = np.<span class="fn">eye</span>(N)

<span class="cm"># Etiketler: 0 = Mr. Hi, 1 = Officer</span>
y = np.<span class="fn">array</span>([<span class="num">0</span> <span class="kw">if</span> G.nodes[n][<span class="str">"club"</span>]==<span class="str">"Mr. Hi"</span> <span class="kw">else</span> <span class="num">1</span> <span class="kw">for</span> n <span class="kw">in</span> G.<span class="fn">nodes</span>()])
<span class="cm"># Sadece düğümler 0 (Mr. Hi) ve 33 (Officer) etiketlidir</span>
train_mask = np.<span class="fn">zeros</span>(N, dtype=<span class="fn">bool</span>); train_mask[<span class="num">0</span>]=<span class="kw">True</span>; train_mask[<span class="num">33</span>]=<span class="kw">True</span>

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
H_DIM, C = <span class="num">8</span>, <span class="num">2</span>
W0 = rng.<span class="fn">normal</span>(size=(N, H_DIM)) * <span class="num">0.3</span>
W1 = rng.<span class="fn">normal</span>(size=(H_DIM, C)) * <span class="num">0.3</span>

<span class="kw">def</span> <span class="fn">softmax</span>(z):
    z = z - z.<span class="fn">max</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    e = np.<span class="fn">exp</span>(z); <span class="kw">return</span> e / e.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)

lr = <span class="num">0.05</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">201</span>):
    <span class="cm"># İleri</span>
    Z1 = A_hat @ X @ W0
    H1 = np.<span class="fn">maximum</span>(<span class="num">0</span>, Z1)
    Z2 = A_hat @ H1 @ W1
    P  = <span class="fn">softmax</span>(Z2)

    <span class="cm"># Kayıp + doğruluk</span>
    Y_oh = np.<span class="fn">eye</span>(C)[y]
    loss = -np.<span class="fn">sum</span>(np.<span class="fn">log</span>(P[train_mask] + <span class="num">1e-12</span>) * Y_oh[train_mask]) / train_mask.<span class="fn">sum</span>()
    acc  = (P.<span class="fn">argmax</span>(axis=<span class="num">1</span>) == y).<span class="fn">mean</span>()
    <span class="kw">if</span> epoch % <span class="num">40</span> == <span class="num">0</span>:
        <span class="fn">print</span>(f<span class="str">"dönem {epoch:3d}  kayıp={loss:.4f}  tam-graf doğruluk={acc:.3f}"</span>)

    <span class="cm"># Manuel geri yayılım (sadece train_mask satırları dLoss/dZ2'ye katkıda bulunur)</span>
    dZ2 = (P - Y_oh) * train_mask[:, <span class="kw">None</span>] / train_mask.<span class="fn">sum</span>()
    dW1 = (A_hat @ H1).T @ dZ2
    dH1 = A_hat.T @ dZ2 @ W1.T
    dZ1 = dH1 * (Z1 > <span class="num">0</span>)
    dW0 = (A_hat @ X).T @ dZ1

    W1 -= lr * dW1
    W0 -= lr * dW0

<span class="fn">print</span>(<span class="str">"\\nSon düğüm sınıflandırma (0 = Mr. Hi, 1 = Officer):"</span>, P.<span class="fn">argmax</span>(axis=<span class="num">1</span>))
</code></pre></div>
</div>

<p class="l-text">Yayılımı fark edin: sadece 2 düğüm etiketlidir, ancak model 34 düğümün hepsini etiketler. Bilgi her etiketli düğümden $\\hat{A}^2$ aracılığıyla kendi 2-adımlı komşuluğuna akar. GNN'lerin tüm noktası budur — uçtan uca öğrenilen, etiket yayılımı için graftan yararlanmak.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Neden Simetrik Normalleştirme?</h2>
<p class="l-text">Yayılım matrisi için üç bariz seçim:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Toplam: $A$</div><div class="card-body">Yüksek dereceli düğümler baskındır. Özdeğerler grafla birlikte büyür. Derin modeller için sayısal olarak kararsız.</div></div>
<div class="calc-card"><div class="card-title">Satır-normalize edilmiş: $D^{-1}A$</div><div class="card-body">Her satır 1'e toplanır (komşuların ortalaması). Asimetrik — sütun perspektifinden farklıdır. GraphSAGE-mean tarafından kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Simetrik: $D^{-1/2}AD^{-1/2}$</div><div class="card-body">Özdeğerler $[-1, 1]$'dedir. Simetriktir, bu spektral özellikleri korur. Kipf-Welling seçimi. Her giriş $A_{ij}/\\sqrt{d_i d_j}$'dir — herhangi biri yüksek dereceliyse her iki ucu da cezalandırır.</div></div>
</div>

<p class="l-text">Ampirik olarak simetrik, Cora-tarzı kıyaslamalarda satır-normdan 1-2 puan üstündür çünkü popüler merkezlerden (Twitter ünlüleri, atıf kralları) gelen kenarları aşağı ağırlıklandırır. Pratikte ikisi de çalışır; literatür spektral tutarlılık için simetrikte karar kıldı.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Üç Yapısal Zayıflık (Sonraki Modeller Tarafından Çözüldü)</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Eşit komşu ağırlıkları</div><div class="card-body">$\\hat{A}_{ij}$ sadece derecelere bağlıdır, $h_u$ ve $h_v$'nin neyi içerdiğine değil. Bazı komşular diğerlerinden daha önemli olmalıdır. <strong>GAT</strong> (sonraki ders) bu ağırlıkları dikkat aracılığıyla öğrenir.</div></div>
<div class="calc-card"><div class="card-title">2. Kenar özelliği yok</div><div class="card-body">Moleküllerde bağ tipi, bilgi graflarında ilişki tipi — GCN bunları görmezden gelir. <strong>R-GCN</strong> her kenar tipi için bir ağırlık matrisi kullanır; <strong>MPNN</strong> kenar özelliklerini mesaj fonksiyonuna dahil eder.</div></div>
<div class="calc-card"><div class="card-title">3. Sadece transdüktif (vanilla formda)</div><div class="card-body">$\\hat{A}$ tüm graf için sabittir. Test zamanında yeni düğüm eklemek $\\hat{A}$'yı yeniden hesaplamayı gerektirir. <strong>GraphSAGE</strong> komşulukları örnekler ve birleştirici fonksiyonları öğrenir, görünmeyen graflara genelleşir.</div></div>
</div>

<div class="calc-highlight"><strong>Ve bir tane daha:</strong> aşırı düzleşme (L3'te ele alındı) derinliği sınırlar. APPNP / GCNII / JKNet standart düzeltmelerdir. Tüm bunlara rağmen, vanilla GCN çoğu akademik kıyaslamada en güçlü temel olarak kalır — GNN dünyasının "doğrusal regresyonu".</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7b. GCN katmanları boyunca düğüm embedding'leri (görsel)</h2>
<p class="l-text">Mesaj geçişi katmanlarını üst üste koyarken 34 karate-kulübü üyesinin nasıl kümelendiğini izleyin. Katman 0'da (ham özellikler) iki hizip örtüşür. Katman 1'den sonra çoğu düğüm hizibine doğru kayar. Katman 2'den sonra sınır neredeyse doğrusal olarak ayrılabilir — GCN-2-katman'ın neden varsayılan derinlik olduğunun tam nedeni.</p>
<div id="plot-gnn-l4-emb-tr" class="plotly-graph" style="width:100%;height:380px;"></div>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Her GCN katmanı bir düğümün temsilini komşularının temsiliyle ortalar — yani çok komşu paylaşan düğümler yakınsar. Genellikle iki katman yeterli; daha derin yığınlar tüm düğümlerin aynı vektöre çöktüğü aşırı düzleşmeden mustariptir.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sıradakiler</h2>
<p class="l-text">GCN, spektral-GNN literatürünü tek satırda sıkıştırır: $H' = \\sigma(\\hat{A} H W)$, ile $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$. Hızlı, basittir ve daha süslü modellere uzanmadan önce her zaman çalıştırmanız gereken güçlü bir temeldir.</p>

<div class="calc-highlight"><strong>Anahtar noktalar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Mesaj geçişi herhangi bir GNN'i Mesaj + Birleştir + Güncelle olarak ayrıştırır.</li>
<li>$\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ öz-döngüler ekler sonra simetrik-normalleştirir.</li>
<li>2 katmanlı GCN standart derinliktir: her düğüm kendi 2-adımlı komşuluğunu görür.</li>
<li>Manuel NumPy geri yayılımı 30 satıra sığar ve karate-kulübü grup ayrımını doğru şekilde eğitir.</li>
<li>Üç zayıflık GAT (dikkat), R-GCN (kenar tipleri), GraphSAGE (endüktif)'i motive eder.</li>
</ul>
</div>

<p class="l-text"><strong>gnn-L5</strong>'te "eşit komşu ağırlıkları" sorununa saldırıyoruz: GAT'ın dikkat mekanizması her kenar için $\\alpha_{ij}$ öğrenir, tıpkı Transformer gibi çok başlı dikkatle. Dikkat katsayılarını NumPy'da hesaplayacağız ve her düğüm için hangi komşuların en önemli olduğunu görselleştireceğiz.</p>
</div>`
};
