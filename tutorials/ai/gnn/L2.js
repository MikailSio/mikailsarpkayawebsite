window.GNN_L2 = {
en: `<p class="l-text"><strong>Before you train any neural network on a graph, run the classical algorithms.</strong> They are old (BFS dates to the 1950s, PageRank to 1998, Louvain to 2008), they are fast, they are deterministic, and they often beat shiny GNNs by an embarrassing margin on small graphs. More importantly, they are the conceptual scaffolding the entire field is built on: PageRank is the prototype for graph diffusion, Node2Vec is the bridge between random walks and word2vec-style embeddings, and Louvain is what every community-detection paper compares against. Skipping this lesson and jumping straight to GCN is like skipping linear regression and jumping to transformers — possible, but you will not understand what your model is actually doing.</p>

<p class="l-text">In this lesson we walk the classical toolkit end-to-end on graphs we build in the browser. BFS and DFS for traversal, Dijkstra and BFS for shortest paths, PageRank for centrality, the Louvain algorithm for community detection, and Node2Vec for learned node embeddings via biased random walks. Every algorithm runs in Pyodide on a real graph, with code you can edit and re-run. By the end you will have a strong non-neural baseline you can hand to anyone who asks "but does the GNN actually beat anything?"</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Implement and reason about BFS and DFS traversal — the foundation of all graph algorithms</li>
<li>Compute shortest paths with BFS (unweighted) and Dijkstra (weighted)</li>
<li>Derive PageRank from random surfer + power iteration; compute it in 6 lines</li>
<li>Run Louvain community detection and interpret modularity scores</li>
<li>Generate Node2Vec embeddings via biased random walks + a word2vec-style objective</li>
<li>Use these classical methods as strong baselines before any GNN training</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. BFS and DFS — Two Ways to Walk a Graph</h2>
<p class="l-text">Every graph algorithm starts with a traversal. <strong>Breadth-first search (BFS)</strong> visits nodes layer by layer from a source, using a FIFO queue. <strong>Depth-first search (DFS)</strong> goes as deep as possible before backtracking, using a stack (or recursion). BFS finds shortest paths in unweighted graphs; DFS finds connected components, cycles, and topological orderings.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">BFS — O(V+E)</div><div class="card-body">Queue-based, visits each node once. Outputs: distance from source, BFS tree, shortest unweighted paths. The "spread one step at a time" algorithm.</div></div>
<div class="calc-card"><div class="card-title">DFS — O(V+E)</div><div class="card-body">Stack-based (or recursion). Outputs: discovery / finish times, connected components, topological sort, cycle detection. The "go deep then backtrack" algorithm.</div></div>
<div class="calc-card"><div class="card-title">Why both matter for GNNs</div><div class="card-body">A GNN with $L$ layers sees each node's $L$-hop BFS neighborhood. Sampling-based methods (GraphSAGE, NeighborLoader) use BFS-style neighbor expansion. DFS underlies random walks (Node2Vec).</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">BFS and DFS on a small synthetic graph. Watch the visit order differ.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">karate_club_graph</span>()  <span class="cm"># famous Zachary's karate club: 34 people, 78 edges</span>

<span class="fn">print</span>(<span class="str">"BFS order from node 0:"</span>, <span class="fn">list</span>(nx.<span class="fn">bfs_tree</span>(G, <span class="num">0</span>).<span class="fn">nodes</span>())[:<span class="num">10</span>])
<span class="fn">print</span>(<span class="str">"DFS order from node 0:"</span>, <span class="fn">list</span>(nx.<span class="fn">dfs_tree</span>(G, <span class="num">0</span>).<span class="fn">nodes</span>())[:<span class="num">10</span>])
<span class="fn">print</span>(<span class="str">"BFS distances from 0:"</span>, <span class="fn">dict</span>(<span class="fn">list</span>(nx.<span class="fn">single_source_shortest_path_length</span>(G, <span class="num">0</span>).<span class="fn">items</span>())[:<span class="num">8</span>]))

<span class="cm"># Connected components via DFS</span>
<span class="fn">print</span>("<span class="cm"># connected components:", nx.number_connected_components(G))</span>
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Shortest Paths — Dijkstra in 10 Lines</h2>
<p class="l-text">For weighted graphs (edge has a cost), Dijkstra's algorithm finds the shortest path in $O((V+E)\\log V)$ with a min-heap. The recurrence is the famous Bellman update:</p>

<div class="katex-block">$$d(v) = \\min_{u \\in N(v)}\\,\\big(d(u) + w(u,v)\\big)$$</div>

<p class="l-text">Variants: <strong>BFS</strong> for unit weights, <strong>Bellman-Ford</strong> for graphs with negative edges, <strong>A*</strong> when you have a heuristic (used in road navigation), <strong>Floyd-Warshall</strong> for all-pairs shortest paths in $O(V^3)$.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build a weighted graph (e.g. cities + distances), find shortest paths.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">Graph</span>()
edges = [(<span class="str">"Istanbul"</span>,<span class="str">"Ankara"</span>,<span class="num">450</span>),(<span class="str">"Ankara"</span>,<span class="str">"Konya"</span>,<span class="num">260</span>),(<span class="str">"Istanbul"</span>,<span class="str">"Bursa"</span>,<span class="num">155</span>),
         (<span class="str">"Bursa"</span>,<span class="str">"Izmir"</span>,<span class="num">330</span>),(<span class="str">"Konya"</span>,<span class="str">"Antalya"</span>,<span class="num">290</span>),(<span class="str">"Izmir"</span>,<span class="str">"Antalya"</span>,<span class="num">450</span>),
         (<span class="str">"Ankara"</span>,<span class="str">"Kayseri"</span>,<span class="num">330</span>),(<span class="str">"Kayseri"</span>,<span class="str">"Antalya"</span>,<span class="num">490</span>)]
G.<span class="fn">add_weighted_edges_from</span>(edges)

src, dst = <span class="str">"Istanbul"</span>, <span class="str">"Antalya"</span>
path = nx.<span class="fn">shortest_path</span>(G, src, dst, weight=<span class="str">"weight"</span>)
dist = nx.<span class="fn">shortest_path_length</span>(G, src, dst, weight=<span class="str">"weight"</span>)
<span class="fn">print</span>(f<span class="str">"Best route {src} -> {dst}: {' -> '.join(path)}  ({dist} km)"</span>)

<span class="cm"># All shortest paths from Istanbul</span>
all_d = nx.<span class="fn">single_source_dijkstra_path_length</span>(G, <span class="str">"Istanbul"</span>)
<span class="kw">for</span> city, d <span class="kw">in</span> <span class="fn">sorted</span>(all_d.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x:x[<span class="num">1</span>]):
    <span class="fn">print</span>(f<span class="str">"  Istanbul -> {city}: {d} km"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. PageRank — The Random Surfer</h2>
<p class="l-text"><strong>PageRank</strong> (Brin &amp; Page, 1998) is the algorithm that built Google. It models a random surfer who at each step either follows a random outgoing link with probability $\\alpha$ (typically 0.85) or teleports to a uniformly random node with probability $1-\\alpha$. The PageRank of a node is the stationary probability that the surfer is at that node.</p>

<div class="katex-block">$$\\mathbf{r} = \\alpha \\, M \\mathbf{r} + (1-\\alpha) \\, \\frac{1}{N}\\mathbf{1}, \\qquad M_{ij} = \\frac{A_{ji}}{\\text{outdeg}(j)}$$</div>

<p class="l-text">This is a linear system; solve it by <strong>power iteration</strong> — multiply $\\mathbf{r}$ by the transition matrix until convergence (usually 30–50 iterations). PageRank generalizes: <strong>Personalized PageRank</strong> uses a non-uniform teleport vector (used in Pinterest's PinSage, GNN+PPR papers), <strong>TextRank / LexRank</strong> applies it to sentence graphs for summarization.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">PageRank from scratch with NumPy power iteration, then via networkx for sanity check.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">karate_club_graph</span>()
N = G.<span class="fn">number_of_nodes</span>()
A = nx.<span class="fn">to_numpy_array</span>(G)
out_deg = A.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
out_deg[out_deg == <span class="num">0</span>] = <span class="num">1</span>
M = (A / out_deg).T  <span class="cm"># column-stochastic transition matrix</span>

alpha = <span class="num">0.85</span>
r = np.<span class="fn">ones</span>(N) / N
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    r = alpha * M @ r + (<span class="num">1</span> - alpha) / N
r = r / r.<span class="fn">sum</span>()

<span class="cm"># Top-5 by our hand-rolled PageRank</span>
top = np.<span class="fn">argsort</span>(-r)[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"Top-5 by hand-rolled PageRank:"</span>)
<span class="kw">for</span> i <span class="kw">in</span> top:
    <span class="fn">print</span>(f<span class="str">"  node {i}: r = {r[i]:.4f}"</span>)

<span class="cm"># Sanity check vs networkx</span>
pr_nx = nx.<span class="fn">pagerank</span>(G, alpha=<span class="num">0.85</span>)
top_nx = <span class="fn">sorted</span>(pr_nx.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"Top-5 from networkx.pagerank:"</span>, [(n, <span class="fn">round</span>(v, <span class="num">4</span>)) <span class="kw">for</span> n, v <span class="kw">in</span> top_nx])
</code></pre></div>
</div>

<div class="calc-highlight"><strong>Connection to GNNs:</strong> a single GCN layer is essentially one step of personalized PageRank with the node features as the teleport vector. APPNP (Klicpera et al. 2019) makes this connection explicit and uses many PPR steps with a single MLP — competitive with much deeper GCNs at lower cost.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Community Detection — Louvain in 90 Seconds</h2>
<p class="l-text">A <strong>community</strong> is a group of nodes more densely connected to each other than to the rest of the graph. The standard quality measure is <strong>modularity</strong>:</p>

<div class="katex-block">$$Q = \\frac{1}{2m}\\sum_{i,j}\\Big[A_{ij} - \\frac{k_i k_j}{2m}\\Big]\\,\\delta(c_i, c_j)$$</div>

<p class="l-text">where $m$ is the number of edges, $k_i$ is the degree of node $i$, and $\\delta(c_i,c_j)=1$ if $i$ and $j$ are in the same community. The <strong>Louvain algorithm</strong> (Blondel et al. 2008) greedily moves nodes between communities to maximize $Q$, then collapses each community into a super-node and repeats. It is fast — millions of nodes in seconds — and is the default community detector in 2026.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Greedy modularity (a Louvain-style algorithm shipped in networkx) on the karate club. The algorithm should rediscover the famous 2-faction split.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx
<span class="kw">from</span> networkx.algorithms.community <span class="kw">import</span> greedy_modularity_communities, modularity

G = nx.<span class="fn">karate_club_graph</span>()
comms = <span class="fn">list</span>(<span class="fn">greedy_modularity_communities</span>(G))
<span class="fn">print</span>(f"<span class="cm"># communities found: {len(comms)}")</span>
<span class="kw">for</span> i, c <span class="kw">in</span> <span class="fn">enumerate</span>(comms):
    <span class="fn">print</span>(f<span class="str">"  community {i} ({len(c)} nodes):"</span>, <span class="fn">sorted</span>(c))

Q = <span class="fn">modularity</span>(G, comms)
<span class="fn">print</span>(f<span class="str">"Modularity Q = {Q:.4f}  (>0.3 is meaningful, >0.7 is excellent)"</span>)

<span class="cm"># Compare to the ground-truth split (Mr. Hi vs Officer)</span>
truth = {n: G.nodes[n][<span class="str">"club"</span>] <span class="kw">for</span> n <span class="kw">in</span> G.<span class="fn">nodes</span>()}
<span class="fn">print</span>(<span class="str">"Ground truth clubs:"</span>, <span class="fn">set</span>(truth.<span class="fn">values</span>()))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Node2Vec — Random Walks &rarr; Embeddings</h2>
<p class="l-text"><strong>Node2Vec</strong> (Grover &amp; Leskovec, KDD 2016) takes the word2vec idea ("a word is defined by its neighbors in a sentence") and applies it to graphs ("a node is defined by its neighbors in a random walk"). Two parameters $p$ and $q$ control the walk: low $q$ encourages BFS-like walks (community structure), low $p$ encourages DFS-like walks (structural roles). The walks are fed to skip-gram, which produces $d$-dimensional node embeddings.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — Generate walks</div><div class="card-body">For each node, do $r$ random walks of length $\\ell$. The transition probabilities are biased by $p$ (return) and $q$ (in-out).</div></div>
<div class="calc-card"><div class="card-title">Step 2 — Skip-gram</div><div class="card-body">Treat each walk as a sentence. Learn embeddings so that nearby-in-walk nodes have similar embeddings (negative sampling, just like word2vec).</div></div>
<div class="calc-card"><div class="card-title">Step 3 — Use embeddings</div><div class="card-body">For node classification: train logistic regression on embeddings + labels. For link prediction: score = embedding similarity. Often beats GNNs on transductive tasks at a fraction of the cost.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A simplified Node2Vec: simple random walks (p=q=1, equivalent to DeepWalk) + TruncatedSVD on the co-occurrence matrix as a stand-in for skip-gram. Good enough to recover the karate-club factions.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx
<span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> TruncatedSVD
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
G = nx.<span class="fn">karate_club_graph</span>()
nodes = <span class="fn">list</span>(G.<span class="fn">nodes</span>())
idx = {n:i <span class="kw">for</span> i,n <span class="kw">in</span> <span class="fn">enumerate</span>(nodes)}
N = <span class="fn">len</span>(nodes)

<span class="cm"># 1. Generate uniform random walks (DeepWalk = Node2Vec with p=q=1)</span>
<span class="kw">def</span> <span class="fn">walk</span>(start, length=<span class="num">10</span>):
    cur = start
    seq = [cur]
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(length-<span class="num">1</span>):
        nbrs = <span class="fn">list</span>(G.<span class="fn">neighbors</span>(cur))
        <span class="kw">if</span> <span class="kw">not</span> nbrs: <span class="kw">break</span>
        cur = rng.<span class="fn">choice</span>(nbrs)
        seq.<span class="fn">append</span>(cur)
    <span class="kw">return</span> seq

walks = [<span class="fn">walk</span>(n, length=<span class="num">20</span>) <span class="kw">for</span> n <span class="kw">in</span> nodes <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>)]
<span class="fn">print</span>(<span class="str">"Generated"</span>, <span class="fn">len</span>(walks), <span class="str">"walks of length 20"</span>)

<span class="cm"># 2. Co-occurrence matrix within window=4</span>
window = <span class="num">4</span>
C = np.<span class="fn">zeros</span>((N, N))
<span class="kw">for</span> w <span class="kw">in</span> walks:
    <span class="kw">for</span> i, u <span class="kw">in</span> <span class="fn">enumerate</span>(w):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">max</span>(<span class="num">0</span>,i-window), <span class="fn">min</span>(<span class="fn">len</span>(w), i+window+<span class="num">1</span>)):
            <span class="kw">if</span> i != j:
                C[idx[u], idx[w[j]]] += <span class="num">1</span>

<span class="cm"># 3. SVD as a cheap skip-gram approximation</span>
svd = <span class="fn">TruncatedSVD</span>(n_components=<span class="num">8</span>, random_state=<span class="num">0</span>)
emb = svd.<span class="fn">fit_transform</span>(C)
<span class="fn">print</span>(<span class="str">"Embedding shape:"</span>, emb.shape)

<span class="cm"># 4. Cluster embeddings — should recover the 2 factions</span>
km = <span class="fn">KMeans</span>(n_clusters=<span class="num">2</span>, random_state=<span class="num">0</span>, n_init=<span class="num">10</span>).<span class="fn">fit</span>(emb)
truth = [G.nodes[n][<span class="str">"club"</span>] <span class="kw">for</span> n <span class="kw">in</span> nodes]
correct = <span class="fn">sum</span>(<span class="num">1</span> <span class="kw">for</span> t, p <span class="kw">in</span> <span class="fn">zip</span>(truth, km.labels_) <span class="kw">if</span> (t==<span class="str">"Mr. Hi"</span>) == (p==km.labels_[<span class="num">0</span>]))
<span class="fn">print</span>(f<span class="str">"Cluster purity vs ground-truth factions: {max(correct, N-correct)}/{N}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Centrality Measures Beyond Degree</h2>
<p class="l-text">"Who is important?" has many answers depending on the notion of importance.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Degree</div><div class="card-body">Just the number of neighbors. Cheapest, often surprisingly competitive. Good baseline.</div></div>
<div class="calc-card"><div class="card-title">Betweenness</div><div class="card-body">Fraction of shortest paths that pass through node $v$. High = "broker" / "bridge". Computed in $O(VE)$.</div></div>
<div class="calc-card"><div class="card-title">Closeness</div><div class="card-body">$1 / \\text{avg shortest-path distance to all others}$. High = "central" in geographic sense.</div></div>
<div class="calc-card"><div class="card-title">Eigenvector / Katz / PageRank</div><div class="card-body">Recursive: "you are important if your neighbors are important". PageRank is the damped, teleporting version.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Compute four centralities side-by-side and see how they rank the karate club differently.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">karate_club_graph</span>()
deg  = nx.<span class="fn">degree_centrality</span>(G)
btw  = nx.<span class="fn">betweenness_centrality</span>(G)
clo  = nx.<span class="fn">closeness_centrality</span>(G)
pr   = nx.<span class="fn">pagerank</span>(G, alpha=<span class="num">0.85</span>)

<span class="kw">def</span> <span class="fn">top3</span>(d): <span class="kw">return</span> [n <span class="kw">for</span> n,_ <span class="kw">in</span> <span class="fn">sorted</span>(d.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x:-x[<span class="num">1</span>])[:<span class="num">3</span>]]
<span class="fn">print</span>(<span class="str">"Top-3 by degree     :"</span>, <span class="fn">top3</span>(deg))
<span class="fn">print</span>(<span class="str">"Top-3 by betweenness:"</span>, <span class="fn">top3</span>(btw))
<span class="fn">print</span>(<span class="str">"Top-3 by closeness  :"</span>, <span class="fn">top3</span>(clo))
<span class="fn">print</span>(<span class="str">"Top-3 by PageRank   :"</span>, <span class="fn">top3</span>(pr))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Strong Baselines Before You Train a GNN</h2>
<p class="l-text">A 2020 paper that shook the GNN world ("A Critical Look at the Evaluation of GNNs", Errica et al.) showed that on many benchmarks, classical methods + a simple MLP beat published GNN results. The lesson: <em>always run these baselines first</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Label propagation</div><div class="card-body">Initialize with known labels, propagate by averaging over neighbors. No training. Beats most papers on Cora/Citeseer when properly tuned.</div></div>
<div class="calc-card"><div class="card-title">Node2Vec / DeepWalk + LR</div><div class="card-body">Random-walk embeddings + logistic regression. Strong, fast, no neural network in sight.</div></div>
<div class="calc-card"><div class="card-title">MLP on (X, neighbor-mean(X))</div><div class="card-body">One hand-crafted message-passing step + MLP. The "GNN cheat" baseline. Often within 1% of fancy GNNs.</div></div>
<div class="calc-card"><div class="card-title">Common-neighbors / Adamic-Adar</div><div class="card-body">For link prediction: score = number (or weighted count) of shared neighbors. Embarrassingly hard to beat.</div></div>
</div>

<div class="calc-highlight"><strong>Production rule:</strong> if your GNN does not beat (PageRank features + XGBoost) by at least 2%, your GNN is not actually learning anything graph-specific — it's just a fancy MLP. Investigate before shipping.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">Classical graph algorithms are not legacy. They are baselines, intuition pumps, and components of every serious GNN system. PageRank is half of APPNP, random walks are half of Node2Vec / GraphSAGE, modularity is the loss many community-aware GNNs optimize against, and BFS is exactly what neighbor-sampling implements.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>BFS and DFS are the foundation; everything else builds on them.</li>
<li>Dijkstra for weighted shortest paths; BFS for unweighted.</li>
<li>PageRank = stationary distribution of a random surfer; power iteration solves it.</li>
<li>Louvain optimizes modularity greedily and is the community-detection default.</li>
<li>Node2Vec = biased random walks + skip-gram; produces embeddings without any GNN.</li>
<li>Always run classical baselines before claiming a GNN result.</li>
</ul>
</div>

<p class="l-text">In <strong>gnn-L3</strong> we shift to the spectral view: the graph Laplacian, its eigenvectors as "graph Fourier basis", and how diffusion-on-graphs is the missing link between PageRank and the GCN architecture we will derive in <strong>L4</strong>.</p>
</div>`,
tr: `<p class="l-text"><strong>Bir grafta herhangi bir sinir ağı eğitmeden önce, klasik algoritmaları çalıştırın.</strong> Onlar eskidir (BFS 1950'lere, PageRank 1998'e, Louvain 2008'e dayanır), hızlıdırlar, deterministiktirler ve küçük graflarda parlak GNN'leri utanç verici bir farkla genellikle yenerler. Daha da önemlisi, tüm alanın üzerine inşa edildiği kavramsal iskelelerdir: PageRank, graf difüzyonunun prototipidir, Node2Vec rastgele yürüyüşler ile word2vec-tarzı gömme vektörleri arasındaki köprüdür ve Louvain her topluluk-tespit makalesinin kendisini karşılaştırdığı şeydir. Bu dersi atlayıp doğrudan GCN'ye geçmek, doğrusal regresyonu atlayıp transformer'lara geçmek gibidir — mümkündür, ama modelinizin gerçekte ne yaptığını anlamayacaksınız.</p>

<p class="l-text">Bu derste klasik araç setini, tarayıcıda inşa ettiğimiz graflar üzerinde uçtan uca yürüyoruz. Gezinme için BFS ve DFS, en kısa yollar için Dijkstra ve BFS, merkezilik için PageRank, topluluk tespiti için Louvain algoritması ve yanlı rastgele yürüyüşler aracılığıyla öğrenilmiş düğüm gömme vektörleri için Node2Vec. Her algoritma Pyodide'de gerçek bir grafta çalışır, kodu düzenleyip yeniden çalıştırabilirsiniz. Sonunda, "ama GNN gerçekten bir şeyi yeniyor mu?" diye soran herkese verebileceğiniz güçlü, sinirsel olmayan bir temele sahip olacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>BFS ve DFS gezinmesini uygulamak ve mantığını anlamak — tüm graf algoritmalarının temeli</li>
<li>BFS ile en kısa yolları (ağırlıksız) ve Dijkstra ile (ağırlıklı) hesaplamak</li>
<li>PageRank'ı rastgele sörfçü + güç yinelemesinden türetmek; 6 satırda hesaplamak</li>
<li>Louvain topluluk tespitini çalıştırmak ve modülerlik skorlarını yorumlamak</li>
<li>Önyargılı rastgele yürüyüşler + word2vec-tarzı bir hedef ile Node2Vec gömme vektörleri üretmek</li>
<li>Bu klasik yöntemleri herhangi bir GNN eğitiminden önce güçlü temeller olarak kullanmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. BFS ve DFS — Bir Grafta Yürümenin İki Yolu</h2>
<p class="l-text">Her graf algoritması bir gezinme ile başlar. <strong>Genişlik öncelikli arama (BFS)</strong>, bir kaynaktan katman katman düğümleri ziyaret eder, bir FIFO kuyruğu kullanarak. <strong>Derinlik öncelikli arama (DFS)</strong>, bir yığın (veya rekürsiyon) kullanarak geri dönmeden önce mümkün olduğunca derine iner. BFS, ağırlıksız graflarda en kısa yolları bulur; DFS, bağlı bileşenleri, döngüleri ve topolojik sıralamaları bulur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">BFS — O(V+E)</div><div class="card-body">Kuyruk tabanlıdır, her düğümü bir kez ziyaret eder. Çıktılar: kaynaktan uzaklık, BFS ağacı, ağırlıksız en kısa yollar. "Bir adımda bir tane yay" algoritması.</div></div>
<div class="calc-card"><div class="card-title">DFS — O(V+E)</div><div class="card-body">Yığın tabanlıdır (veya rekürsiyon). Çıktılar: keşif / bitirme zamanları, bağlı bileşenler, topolojik sıralama, döngü tespiti. "Önce derine in sonra geri dön" algoritması.</div></div>
<div class="calc-card"><div class="card-title">Her ikisi de neden GNN'ler için önemli</div><div class="card-body">$L$ katmanlı bir GNN, her düğümün $L$-adımlı BFS komşuluğunu görür. Örnekleme tabanlı yöntemler (GraphSAGE, NeighborLoader) BFS-tarzı komşu genişletme kullanır. DFS, rastgele yürüyüşlerin (Node2Vec) altında yatar.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Küçük bir sentetik grafta BFS ve DFS. Ziyaret sırasının nasıl farklılaştığını izleyin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">karate_club_graph</span>()  <span class="cm"># ünlü Zachary'nin karate kulübü: 34 kişi, 78 kenar</span>

<span class="fn">print</span>(<span class="str">"0'dan BFS sırası:"</span>, <span class="fn">list</span>(nx.<span class="fn">bfs_tree</span>(G, <span class="num">0</span>).<span class="fn">nodes</span>())[:<span class="num">10</span>])
<span class="fn">print</span>(<span class="str">"0'dan DFS sırası:"</span>, <span class="fn">list</span>(nx.<span class="fn">dfs_tree</span>(G, <span class="num">0</span>).<span class="fn">nodes</span>())[:<span class="num">10</span>])
<span class="fn">print</span>(<span class="str">"0'dan BFS uzaklıkları:"</span>, <span class="fn">dict</span>(<span class="fn">list</span>(nx.<span class="fn">single_source_shortest_path_length</span>(G, <span class="num">0</span>).<span class="fn">items</span>())[:<span class="num">8</span>]))

<span class="cm"># DFS ile bağlı bileşenler</span>
<span class="fn">print</span>("<span class="cm"># bağlı bileşen:", nx.number_connected_components(G))</span>
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. En Kısa Yollar — 10 Satırda Dijkstra</h2>
<p class="l-text">Ağırlıklı graflar için (kenarın bir maliyeti vardır), Dijkstra algoritması en kısa yolu min-yığın ile $O((V+E)\\log V)$ zamanda bulur. Yineleme bağıntısı ünlü Bellman güncellemesidir:</p>

<div class="katex-block">$$d(v) = \\min_{u \\in N(v)}\\,\\big(d(u) + w(u,v)\\big)$$</div>

<p class="l-text">Çeşitleri: birim ağırlıklar için <strong>BFS</strong>, negatif kenarlı graflar için <strong>Bellman-Ford</strong>, sezgisel bilginiz olduğunda <strong>A*</strong> (yol navigasyonunda kullanılır), $O(V^3)$'te tüm-çiftler en kısa yollar için <strong>Floyd-Warshall</strong>.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Ağırlıklı bir graf oluşturun (örn. şehirler + mesafeler), en kısa yolları bulun.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">Graph</span>()
edges = [(<span class="str">"Istanbul"</span>,<span class="str">"Ankara"</span>,<span class="num">450</span>),(<span class="str">"Ankara"</span>,<span class="str">"Konya"</span>,<span class="num">260</span>),(<span class="str">"Istanbul"</span>,<span class="str">"Bursa"</span>,<span class="num">155</span>),
         (<span class="str">"Bursa"</span>,<span class="str">"Izmir"</span>,<span class="num">330</span>),(<span class="str">"Konya"</span>,<span class="str">"Antalya"</span>,<span class="num">290</span>),(<span class="str">"Izmir"</span>,<span class="str">"Antalya"</span>,<span class="num">450</span>),
         (<span class="str">"Ankara"</span>,<span class="str">"Kayseri"</span>,<span class="num">330</span>),(<span class="str">"Kayseri"</span>,<span class="str">"Antalya"</span>,<span class="num">490</span>)]
G.<span class="fn">add_weighted_edges_from</span>(edges)

src, dst = <span class="str">"Istanbul"</span>, <span class="str">"Antalya"</span>
path = nx.<span class="fn">shortest_path</span>(G, src, dst, weight=<span class="str">"weight"</span>)
dist = nx.<span class="fn">shortest_path_length</span>(G, src, dst, weight=<span class="str">"weight"</span>)
<span class="fn">print</span>(f<span class="str">"En iyi rota {src} -> {dst}: {' -> '.join(path)}  ({dist} km)"</span>)

<span class="cm"># Istanbul'dan tüm en kısa yollar</span>
all_d = nx.<span class="fn">single_source_dijkstra_path_length</span>(G, <span class="str">"Istanbul"</span>)
<span class="kw">for</span> city, d <span class="kw">in</span> <span class="fn">sorted</span>(all_d.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x:x[<span class="num">1</span>]):
    <span class="fn">print</span>(f<span class="str">"  Istanbul -> {city}: {d} km"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. PageRank — Rastgele Sörfçü</h2>
<p class="l-text"><strong>PageRank</strong> (Brin &amp; Page, 1998), Google'ı inşa eden algoritmadır. Her adımda $\\alpha$ olasılıkla (genellikle 0.85) rastgele bir giden bağlantıyı takip eden veya $1-\\alpha$ olasılıkla tekdüze rastgele bir düğüme ışınlanan rastgele bir sörfçüyü modeller. Bir düğümün PageRank'ı, sörfçünün o düğümde olma durağan olasılığıdır.</p>

<div class="katex-block">$$\\mathbf{r} = \\alpha \\, M \\mathbf{r} + (1-\\alpha) \\, \\frac{1}{N}\\mathbf{1}, \\qquad M_{ij} = \\frac{A_{ji}}{\\text{outdeg}(j)}$$</div>

<p class="l-text">Bu doğrusal bir sistemdir; <strong>güç yinelemesi</strong> ile çözün — yakınsamaya kadar (genellikle 30-50 yineleme) $\\mathbf{r}$'yi geçiş matrisiyle çarpın. PageRank genelleşir: <strong>Personalized PageRank</strong> tekdüze olmayan bir ışınlanma vektörü kullanır (Pinterest'in PinSage'inde, GNN+PPR makalelerinde kullanılır), <strong>TextRank / LexRank</strong> bunu özetleme için cümle graflarına uygular.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy güç yinelemesi ile sıfırdan PageRank, sonra akıl sağlığı kontrolü için networkx ile.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">karate_club_graph</span>()
N = G.<span class="fn">number_of_nodes</span>()
A = nx.<span class="fn">to_numpy_array</span>(G)
out_deg = A.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
out_deg[out_deg == <span class="num">0</span>] = <span class="num">1</span>
M = (A / out_deg).T  <span class="cm"># sütun-stokastik geçiş matrisi</span>

alpha = <span class="num">0.85</span>
r = np.<span class="fn">ones</span>(N) / N
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    r = alpha * M @ r + (<span class="num">1</span> - alpha) / N
r = r / r.<span class="fn">sum</span>()

<span class="cm"># El yapımı PageRank ile ilk 5</span>
top = np.<span class="fn">argsort</span>(-r)[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"El yapımı PageRank ile ilk 5:"</span>)
<span class="kw">for</span> i <span class="kw">in</span> top:
    <span class="fn">print</span>(f<span class="str">"  düğüm {i}: r = {r[i]:.4f}"</span>)

<span class="cm"># networkx ile akıl sağlığı kontrolü</span>
pr_nx = nx.<span class="fn">pagerank</span>(G, alpha=<span class="num">0.85</span>)
top_nx = <span class="fn">sorted</span>(pr_nx.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"networkx.pagerank ile ilk 5:"</span>, [(n, <span class="fn">round</span>(v, <span class="num">4</span>)) <span class="kw">for</span> n, v <span class="kw">in</span> top_nx])
</code></pre></div>
</div>

<div class="calc-highlight"><strong>GNN'lerle bağlantı:</strong> tek bir GCN katmanı, esasen düğüm özelliklerini ışınlanma vektörü olarak kullanan kişiselleştirilmiş PageRank'ın bir adımıdır. APPNP (Klicpera vd. 2019) bu bağlantıyı açık hale getirir ve tek bir MLP ile birçok PPR adımı kullanır — daha düşük maliyetle çok daha derin GCN'lerle rekabet eder.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Topluluk Tespiti — 90 Saniyede Louvain</h2>
<p class="l-text">Bir <strong>topluluk</strong>, grafın geri kalanına göre birbirine daha yoğun bağlı düğümlerin grubudur. Standart kalite ölçüsü <strong>modülerlik</strong>'tir:</p>

<div class="katex-block">$$Q = \\frac{1}{2m}\\sum_{i,j}\\Big[A_{ij} - \\frac{k_i k_j}{2m}\\Big]\\,\\delta(c_i, c_j)$$</div>

<p class="l-text">burada $m$ kenar sayısıdır, $k_i$ düğüm $i$'nin derecesidir ve $\\delta(c_i,c_j)=1$ eğer $i$ ve $j$ aynı topluluktaysa. <strong>Louvain algoritması</strong> (Blondel vd. 2008), $Q$'yu maksimize etmek için açgözlü bir şekilde düğümleri topluluklar arasında taşır, sonra her topluluğu bir süper-düğüme daraltır ve tekrarlar. Hızlıdır — saniyeler içinde milyonlarca düğüm — ve 2026'da varsayılan topluluk dedektörüdür.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Karate kulübünde açgözlü modülerlik (networkx'te gelen Louvain-tarzı bir algoritma). Algoritmanın ünlü 2-grup ayrımını yeniden keşfetmesi gerekir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx
<span class="kw">from</span> networkx.algorithms.community <span class="kw">import</span> greedy_modularity_communities, modularity

G = nx.<span class="fn">karate_club_graph</span>()
comms = <span class="fn">list</span>(<span class="fn">greedy_modularity_communities</span>(G))
<span class="fn">print</span>(f"<span class="cm"># bulunan topluluk: {len(comms)}")</span>
<span class="kw">for</span> i, c <span class="kw">in</span> <span class="fn">enumerate</span>(comms):
    <span class="fn">print</span>(f<span class="str">"  topluluk {i} ({len(c)} düğüm):"</span>, <span class="fn">sorted</span>(c))

Q = <span class="fn">modularity</span>(G, comms)
<span class="fn">print</span>(f<span class="str">"Modülerlik Q = {Q:.4f}  (>0.3 anlamlı, >0.7 mükemmel)"</span>)

<span class="cm"># Gerçek değer ayrımı ile karşılaştırma (Mr. Hi vs Officer)</span>
truth = {n: G.nodes[n][<span class="str">"club"</span>] <span class="kw">for</span> n <span class="kw">in</span> G.<span class="fn">nodes</span>()}
<span class="fn">print</span>(<span class="str">"Gerçek kulüpler:"</span>, <span class="fn">set</span>(truth.<span class="fn">values</span>()))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Node2Vec — Rastgele Yürüyüşler &rarr; Gömme Vektörleri</h2>
<p class="l-text"><strong>Node2Vec</strong> (Grover &amp; Leskovec, KDD 2016), word2vec fikrini ("bir kelime, cümledeki komşuları ile tanımlanır") alıp graflara uygular ("bir düğüm, rastgele bir yürüyüşteki komşuları ile tanımlanır"). İki parametre $p$ ve $q$ yürüyüşü kontrol eder: düşük $q$ BFS-tarzı yürüyüşleri (topluluk yapısı), düşük $p$ DFS-tarzı yürüyüşleri (yapısal roller) teşvik eder. Yürüyüşler skip-gram'a beslenir, bu da $d$-boyutlu düğüm gömme vektörleri üretir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — Yürüyüşler oluştur</div><div class="card-body">Her düğüm için, $\\ell$ uzunluğunda $r$ rastgele yürüyüş yap. Geçiş olasılıkları $p$ (geri dönüş) ve $q$ (içeri-dışarı) ile yanlıdır.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — Skip-gram</div><div class="card-body">Her yürüyüşü bir cümle olarak ele al. Yürüyüşte yakın olan düğümlerin benzer gömme vektörlerine sahip olmasını öğren (negatif örnekleme, tıpkı word2vec gibi).</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — Gömme vektörlerini kullan</div><div class="card-body">Düğüm sınıflandırma için: gömme vektörleri + etiketler üzerinde lojistik regresyon eğit. Bağlantı tahmini için: skor = gömme benzerliği. Transdüktif görevlerde GNN'leri maliyetin küçük bir kısmında genellikle yener.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Basitleştirilmiş bir Node2Vec: basit rastgele yürüyüşler (p=q=1, DeepWalk'a eşdeğer) + skip-gram yerine ortak-ortaya çıkma matrisi üzerinde TruncatedSVD. Karate-kulübü gruplarını kurtarmak için yeterince iyi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx
<span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> TruncatedSVD
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
G = nx.<span class="fn">karate_club_graph</span>()
nodes = <span class="fn">list</span>(G.<span class="fn">nodes</span>())
idx = {n:i <span class="kw">for</span> i,n <span class="kw">in</span> <span class="fn">enumerate</span>(nodes)}
N = <span class="fn">len</span>(nodes)

<span class="cm"># 1. Tekdüze rastgele yürüyüşler oluştur (DeepWalk = p=q=1 ile Node2Vec)</span>
<span class="kw">def</span> <span class="fn">walk</span>(start, length=<span class="num">10</span>):
    cur = start
    seq = [cur]
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(length-<span class="num">1</span>):
        nbrs = <span class="fn">list</span>(G.<span class="fn">neighbors</span>(cur))
        <span class="kw">if</span> <span class="kw">not</span> nbrs: <span class="kw">break</span>
        cur = rng.<span class="fn">choice</span>(nbrs)
        seq.<span class="fn">append</span>(cur)
    <span class="kw">return</span> seq

walks = [<span class="fn">walk</span>(n, length=<span class="num">20</span>) <span class="kw">for</span> n <span class="kw">in</span> nodes <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>)]
<span class="fn">print</span>(<span class="fn">len</span>(walks), <span class="str">"adet uzunluk-20 yürüyüş oluşturuldu"</span>)

<span class="cm"># 2. window=4 içinde ortak-ortaya çıkma matrisi</span>
window = <span class="num">4</span>
C = np.<span class="fn">zeros</span>((N, N))
<span class="kw">for</span> w <span class="kw">in</span> walks:
    <span class="kw">for</span> i, u <span class="kw">in</span> <span class="fn">enumerate</span>(w):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">max</span>(<span class="num">0</span>,i-window), <span class="fn">min</span>(<span class="fn">len</span>(w), i+window+<span class="num">1</span>)):
            <span class="kw">if</span> i != j:
                C[idx[u], idx[w[j]]] += <span class="num">1</span>

<span class="cm"># 3. Ucuz bir skip-gram yaklaşımı olarak SVD</span>
svd = <span class="fn">TruncatedSVD</span>(n_components=<span class="num">8</span>, random_state=<span class="num">0</span>)
emb = svd.<span class="fn">fit_transform</span>(C)
<span class="fn">print</span>(<span class="str">"Gömme vektör şekli:"</span>, emb.shape)

<span class="cm"># 4. Gömme vektörlerini kümele — 2 grubu kurtarmalı</span>
km = <span class="fn">KMeans</span>(n_clusters=<span class="num">2</span>, random_state=<span class="num">0</span>, n_init=<span class="num">10</span>).<span class="fn">fit</span>(emb)
truth = [G.nodes[n][<span class="str">"club"</span>] <span class="kw">for</span> n <span class="kw">in</span> nodes]
correct = <span class="fn">sum</span>(<span class="num">1</span> <span class="kw">for</span> t, p <span class="kw">in</span> <span class="fn">zip</span>(truth, km.labels_) <span class="kw">if</span> (t==<span class="str">"Mr. Hi"</span>) == (p==km.labels_[<span class="num">0</span>]))
<span class="fn">print</span>(f<span class="str">"Gerçek değer gruplarına göre küme saflığı: {max(correct, N-correct)}/{N}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Derecenin Ötesinde Merkezilik Ölçüleri</h2>
<p class="l-text">"Kim önemli?" sorusunun, önem nosyonuna bağlı olarak birçok cevabı vardır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Derece</div><div class="card-body">Sadece komşu sayısı. En ucuz, genellikle şaşırtıcı derecede rekabetçi. İyi temel.</div></div>
<div class="calc-card"><div class="card-title">Aradalık</div><div class="card-body">Düğüm $v$'den geçen en kısa yolların oranı. Yüksek = "aracı" / "köprü". $O(VE)$'de hesaplanır.</div></div>
<div class="calc-card"><div class="card-title">Yakınlık</div><div class="card-body">$1 / \\text{others'a ortalama en kisa yol uzakligi}$. Yüksek = coğrafi anlamda "merkezi".</div></div>
<div class="calc-card"><div class="card-title">Özvektör / Katz / PageRank</div><div class="card-body">Özyinelemeli: "komşularınız önemliyse siz önemlisiniz". PageRank, sönümlenmiş, ışınlanan versiyondur.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Dört merkeziliği yan yana hesaplayın ve karate kulübünü nasıl farklı şekilde sıraladıklarını görün.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">karate_club_graph</span>()
deg  = nx.<span class="fn">degree_centrality</span>(G)
btw  = nx.<span class="fn">betweenness_centrality</span>(G)
clo  = nx.<span class="fn">closeness_centrality</span>(G)
pr   = nx.<span class="fn">pagerank</span>(G, alpha=<span class="num">0.85</span>)

<span class="kw">def</span> <span class="fn">top3</span>(d): <span class="kw">return</span> [n <span class="kw">for</span> n,_ <span class="kw">in</span> <span class="fn">sorted</span>(d.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x:-x[<span class="num">1</span>])[:<span class="num">3</span>]]
<span class="fn">print</span>(<span class="str">"Dereceye göre ilk 3     :"</span>, <span class="fn">top3</span>(deg))
<span class="fn">print</span>(<span class="str">"Aradalığa göre ilk 3:"</span>, <span class="fn">top3</span>(btw))
<span class="fn">print</span>(<span class="str">"Yakınlığa göre ilk 3  :"</span>, <span class="fn">top3</span>(clo))
<span class="fn">print</span>(<span class="str">"PageRank'a göre ilk 3   :"</span>, <span class="fn">top3</span>(pr))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Bir GNN Eğitmeden Önce Güçlü Temeller</h2>
<p class="l-text">GNN dünyasını sarsan 2020 makalesi ("A Critical Look at the Evaluation of GNNs", Errica vd.), birçok kıyaslamada klasik yöntemler + basit bir MLP'nin yayınlanmış GNN sonuçlarını yendiğini gösterdi. Ders: <em>her zaman önce bu temelleri çalıştırın</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Etiket yayılımı</div><div class="card-body">Bilinen etiketlerle başlat, komşular üzerinden ortalama alarak yay. Eğitim yok. Düzgün ayarlandığında Cora/Citeseer'de çoğu makaleyi yener.</div></div>
<div class="calc-card"><div class="card-title">Node2Vec / DeepWalk + LR</div><div class="card-body">Rastgele-yürüyüş gömme vektörleri + lojistik regresyon. Güçlü, hızlı, görünürde sinir ağı yok.</div></div>
<div class="calc-card"><div class="card-title">(X, neighbor-mean(X)) üzerinde MLP</div><div class="card-body">Bir el yapımı mesaj-geçiş adımı + MLP. "GNN hilesi" temeli. Süslü GNN'lerin %1'i içinde sıklıkla kalır.</div></div>
<div class="calc-card"><div class="card-title">Ortak komşular / Adamic-Adar</div><div class="card-body">Bağlantı tahmini için: skor = paylaşılan komşuların sayısı (veya ağırlıklı sayımı). Yenmesi utanç verici derecede zor.</div></div>
</div>

<div class="calc-highlight"><strong>Üretim kuralı:</strong> GNN'iniz (PageRank özellikleri + XGBoost)'u en az %2 yenemiyorsa, GNN'iniz aslında graf-spesifik hiçbir şey öğrenmiyor — sadece süslü bir MLP. Göndermeden önce araştırın.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sıradakiler</h2>
<p class="l-text">Klasik graf algoritmaları eski değildir. Onlar temellerdir, sezgi pompalarıdır ve her ciddi GNN sisteminin bileşenleridir. PageRank APPNP'nin yarısıdır, rastgele yürüyüşler Node2Vec / GraphSAGE'in yarısıdır, modülerlik birçok topluluk-farkındalı GNN'in optimize ettiği kayıptır ve BFS, komşu örnekleyicilerin uyguladığı şeydir.</p>

<div class="calc-highlight"><strong>Anahtar noktalar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>BFS ve DFS temeldir; her şey onların üzerine inşa edilir.</li>
<li>Ağırlıklı en kısa yollar için Dijkstra; ağırlıksızlar için BFS.</li>
<li>PageRank = rastgele bir sörfçünün durağan dağılımı; güç yinelemesi onu çözer.</li>
<li>Louvain açgözlü bir şekilde modülerliği optimize eder ve topluluk-tespit varsayılanıdır.</li>
<li>Node2Vec = yanlı rastgele yürüyüşler + skip-gram; herhangi bir GNN olmadan gömme vektörleri üretir.</li>
<li>Bir GNN sonucu iddia etmeden önce her zaman klasik temelleri çalıştırın.</li>
</ul>
</div>

<p class="l-text"><strong>gnn-L3</strong>'te spektral görüşe geçiyoruz: graf Laplacian'ı, "graf Fourier tabanı" olarak özvektörleri ve graf üzerinde difüzyonun PageRank ile <strong>L4</strong>'te türeteceğimiz GCN mimarisi arasındaki kayıp halka olduğunu.</p>
</div>`
};
