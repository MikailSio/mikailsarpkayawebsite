window.GNN_L1 = {
en: `<p class="l-text"><strong>The world is not a table of independent rows.</strong> Your friends know each other's friends, proteins fold by interacting with neighbors, molecules are atoms bonded into rings, web pages cite web pages, and a customer who bought a product is structurally close to other customers who bought the same product. Once you start looking, almost every interesting dataset has a graph hiding inside it — and a model that ignores the graph is leaving the most predictive signal on the table. Graph Neural Networks (GNNs) are the family of architectures that consume this structure directly, learning representations of nodes and edges by repeatedly mixing information with their neighbors.</p>

<p class="l-text">In this first lesson we set the stage. We list the canonical real-world graphs (social, knowledge, molecular, recommendation, citation), define the three task families that organize the entire field — node classification, link prediction, graph classification — and meet <code>networkx</code>, the Swiss-army knife of graph manipulation in Python (which, helpfully, runs inside Pyodide). By the end you will have built a small social graph in your browser, computed degrees and clustering, and seen why simply <em>looking up a node's neighbors</em> already gives you a surprisingly strong baseline before any neural network is involved.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recognize when a problem is naturally a graph problem (and when forcing it onto a table loses information)</li>
<li>Distinguish the three GNN task families: node-level, edge-level, graph-level</li>
<li>Build, query, and visualize graphs with <code>networkx</code> directly in the browser</li>
<li>Compute basic structural features: degree, clustering coefficient, connected components</li>
<li>Convert a relational table (orders, friendships) into an adjacency matrix and a node-feature matrix</li>
<li>Map real datasets (Cora, Citeseer, MovieLens, OGB) to the right task family</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Graphs? Five Domains That Are Graphs by Nature</h2>
<p class="l-text">A graph is a set of <strong>nodes</strong> (entities) connected by <strong>edges</strong> (relationships). Edges may be directed (Twitter follows) or undirected (Facebook friendships), weighted (number of messages exchanged), or typed (a "bought" edge vs. a "viewed" edge). The five most-studied domains in 2026 GNN research:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Social networks</div><div class="card-body">Nodes = users, edges = friendships / follows. Tasks: friend recommendation, community detection, fake-account detection. Datasets: Reddit, Twitter, Pokec, OGB-Products.</div></div>
<div class="calc-card"><div class="card-title">Citation networks</div><div class="card-body">Nodes = papers, edges = citations, features = abstract embedding. Tasks: classify a paper into a research field. Cora (2708 papers, 7 classes) and Citeseer are the "MNIST of GNNs".</div></div>
<div class="calc-card"><div class="card-title">Molecules</div><div class="card-body">Nodes = atoms, edges = bonds. Tasks: predict toxicity, solubility, binding affinity. Datasets: ZINC, QM9, MoleculeNet, OGB-Mol*. AlphaFold and pharma drug-discovery pipelines live here.</div></div>
<div class="calc-card"><div class="card-title">Knowledge graphs</div><div class="card-body">Nodes = entities (Einstein, Princeton), edges = typed relations (worked-at, born-in). Tasks: complete missing facts (link prediction), question answering. Datasets: Freebase, Wikidata, FB15k.</div></div>
<div class="calc-card"><div class="card-title">Recommendation</div><div class="card-body">Bipartite graph: users on one side, items on the other, edges = interactions. Tasks: predict which item a user will click/buy next. Datasets: MovieLens, Amazon, Pinterest's PinSage (one of the first production GNNs, 2018).</div></div>
</div>

<div class="calc-highlight"><strong>The non-Euclidean test:</strong> if your data has no natural grid (unlike images) and no natural sequence (unlike text) but does have <em>relationships</em> between samples, you are in graph territory. CNNs and Transformers can be derived as special cases of GNNs on regular graphs (a grid, a chain) — see Bronstein et al.'s "Geometric Deep Learning" (2021).</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Three Task Families</h2>
<p class="l-text">Every GNN paper, benchmark, and product fits in one of three buckets. Knowing which bucket you are in determines the loss function, the data split, the evaluation metric, and the architecture.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Node classification</div><div class="card-body">Predict a label for each node. Example: "is this Reddit user a bot?" Train on a labeled subset, predict on the rest of the same graph (transductive) or on a new graph (inductive). Loss = cross-entropy. Metric = accuracy / F1.</div></div>
<div class="calc-card"><div class="card-title">Link prediction</div><div class="card-body">Predict whether an edge exists between two nodes. Example: "will user A buy product B?" Score = some function of the two node embeddings (dot product, MLP). Loss = BCE with negative sampling. Metric = AUC, Hits@K, MRR.</div></div>
<div class="calc-card"><div class="card-title">Graph classification</div><div class="card-body">Predict a label for an entire graph. Example: "is this molecule toxic?" Pool node embeddings into a graph-level vector (mean / sum / attention pool), then classify. Loss = cross-entropy. Metric = ROC-AUC, accuracy.</div></div>
</div>

<p class="l-text">A fourth, less-common task is <strong>graph regression</strong> (predict a continuous number for a graph — e.g. solubility, HOMO-LUMO gap in QM9) and a fifth is <strong>graph generation</strong> (sample new molecules with desired properties — covered briefly in L8 of this track for completeness, with a pointer to diffusion-based methods like GeoDiff and EDM).</p>

<div class="calc-highlight"><strong>Mental model:</strong> node tasks ask "<em>what is this node?</em>", edge tasks ask "<em>do these two nodes go together?</em>", graph tasks ask "<em>what is this whole thing?</em>". The architecture is mostly the same — only the readout layer changes.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Anatomy of a Graph: Adjacency, Features, Labels</h2>
<p class="l-text">Mathematically a graph $G = (V, E)$ becomes three matrices for a GNN to chew on:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adjacency $A \\in \\{0,1\\}^{N \\times N}$</div><div class="card-body">$A_{ij}=1$ iff edge $(i,j)$ exists. Symmetric for undirected graphs. For weighted graphs use real values; for typed graphs use one matrix per relation type (R-GCN).</div></div>
<div class="calc-card"><div class="card-title">Node features $X \\in \\mathbb{R}^{N \\times d}$</div><div class="card-body">Row $i$ = feature vector of node $i$. For Cora, $d{=}1433$ bag-of-words; for molecules, $d \\approx 9$ (atom type, charge, hybridization, etc.); for users, $d$ = profile embedding.</div></div>
<div class="calc-card"><div class="card-title">Labels $y$</div><div class="card-body">Per-node ($y \\in \\{0..C\\}^N$), per-edge ($y \\in \\{0,1\\}^{|E|}$ for link prediction), or per-graph ($y \\in \\{0..C\\}^{|G|}$ over a dataset of graphs).</div></div>
</div>

<div class="katex-block">$$\\text{GNN forward (one layer): } H^{(l+1)} = \\sigma\\!\\big(\\hat{A} \\, H^{(l)} \\, W^{(l)}\\big), \\qquad H^{(0)} = X$$</div>

<p class="l-text">where $\\hat{A}$ is some normalized adjacency (we will derive the famous $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ in L4). Stack $L$ such layers, and node $i$'s representation depends on its $L$-hop neighborhood — exactly like a CNN's receptive field, but on an irregular grid.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. NetworkX in 5 Minutes</h2>
<p class="l-text"><code>networkx</code> is the de facto Python library for graph manipulation: building graphs, querying neighbors, running classical algorithms (BFS, PageRank, shortest paths), and visualizing. It is pure Python, slow on huge graphs (use <code>graph-tool</code> or <code>igraph</code> for &gt;1M nodes), but perfect for prototyping and — the punchline — it runs unmodified inside Pyodide. We will use it for the first three lessons of this track before switching to PyTorch Geometric for real GPU training.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

<span class="cm"># Build a tiny social graph</span>
G = nx.<span class="fn">Graph</span>()
G.<span class="fn">add_edges_from</span>([(<span class="str">"A"</span>,<span class="str">"B"</span>),(<span class="str">"A"</span>,<span class="str">"C"</span>),(<span class="str">"B"</span>,<span class="str">"C"</span>),(<span class="str">"C"</span>,<span class="str">"D"</span>),(<span class="str">"D"</span>,<span class="str">"E"</span>),(<span class="str">"E"</span>,<span class="str">"F"</span>),(<span class="str">"D"</span>,<span class="str">"F"</span>)])

<span class="fn">print</span>(<span class="str">"Nodes:"</span>, G.<span class="fn">number_of_nodes</span>(), <span class="str">"Edges:"</span>, G.<span class="fn">number_of_edges</span>())
<span class="fn">print</span>(<span class="str">"Neighbors of C:"</span>, <span class="fn">list</span>(G.<span class="fn">neighbors</span>(<span class="str">"C"</span>)))
<span class="fn">print</span>(<span class="str">"Degree of each node:"</span>, <span class="fn">dict</span>(G.<span class="fn">degree</span>()))
<span class="fn">print</span>(<span class="str">"Clustering coeff:"</span>, nx.<span class="fn">clustering</span>(G))
<span class="fn">print</span>(<span class="str">"Shortest path A->F:"</span>, nx.<span class="fn">shortest_path</span>(G, <span class="str">"A"</span>, <span class="str">"F"</span>))
</code></pre></div>

<p class="l-text">That snippet shows the four operations you need 90% of the time: build, enumerate neighbors, get degrees, find paths. Let's run a slightly richer version on a synthetic friendship network to see <em>structural features</em> emerge.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build a small friendship graph, compute structural features, and see which nodes are central — all without leaving the browser.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Synthetic small-world friendship graph: 20 people, each connected to ~4 friends + rewires</span>
G = nx.<span class="fn">watts_strogatz_graph</span>(n=<span class="num">20</span>, k=<span class="num">4</span>, p=<span class="num">0.2</span>, seed=<span class="num">7</span>)
<span class="fn">print</span>(<span class="str">"Nodes:"</span>, G.<span class="fn">number_of_nodes</span>(), <span class="str">"Edges:"</span>, G.<span class="fn">number_of_edges</span>())
<span class="fn">print</span>(<span class="str">"Average degree:"</span>, np.<span class="fn">mean</span>([d <span class="kw">for</span> _, d <span class="kw">in</span> G.<span class="fn">degree</span>()]))
<span class="fn">print</span>(<span class="str">"Density:"</span>, nx.<span class="fn">density</span>(G))
<span class="fn">print</span>(<span class="str">"Average clustering:"</span>, nx.<span class="fn">average_clustering</span>(G))
<span class="fn">print</span>(<span class="str">"Diameter:"</span>, nx.<span class="fn">diameter</span>(G))

<span class="cm"># Top-3 most central people</span>
deg = <span class="fn">dict</span>(G.<span class="fn">degree</span>())
top = <span class="fn">sorted</span>(deg.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])[:<span class="num">3</span>]
<span class="fn">print</span>(<span class="str">"Top-3 by degree:"</span>, top)

<span class="cm"># Connected components</span>
<span class="fn">print</span>(<span class="str">"# components:"</span>, nx.<span class="fn">number_connected_components</span>(G))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. From Table to Graph: Orders &rarr; Bipartite</h2>
<p class="l-text">Most production datasets arrive as tables. Turning them into graphs is half the work. Here we take the <code>df_orders</code> table (already loaded in your Pyodide preamble) and build the customer–product bipartite graph that will reappear in the L8 capstone as a recommender.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">From the orders table to a bipartite customer-product graph. Real data, real graph, ~10 lines.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Use a slice for speed</span>
sub = df_orders.<span class="fn">head</span>(<span class="num">400</span>)
B = nx.<span class="fn">Graph</span>()
<span class="kw">for</span> _, row <span class="kw">in</span> sub.<span class="fn">iterrows</span>():
    cust = f<span class="str">"C{row['customer_id']}"</span>
    prod = f<span class="str">"P{row['product_id']}"</span>
    B.<span class="fn">add_node</span>(cust, kind=<span class="str">"customer"</span>)
    B.<span class="fn">add_node</span>(prod, kind=<span class="str">"product"</span>)
    B.<span class="fn">add_edge</span>(cust, prod)

<span class="fn">print</span>(<span class="str">"Total nodes:"</span>, B.<span class="fn">number_of_nodes</span>())
<span class="fn">print</span>(<span class="str">"Customers:"</span>, <span class="fn">sum</span>(<span class="num">1</span> <span class="kw">for</span> n,d <span class="kw">in</span> B.<span class="fn">nodes</span>(data=<span class="kw">True</span>) <span class="kw">if</span> d[<span class="str">"kind"</span>]==<span class="str">"customer"</span>))
<span class="fn">print</span>(<span class="str">"Products:"</span>, <span class="fn">sum</span>(<span class="num">1</span> <span class="kw">for</span> n,d <span class="kw">in</span> B.<span class="fn">nodes</span>(data=<span class="kw">True</span>) <span class="kw">if</span> d[<span class="str">"kind"</span>]==<span class="str">"product"</span>))
<span class="fn">print</span>(<span class="str">"Edges (purchases):"</span>, B.<span class="fn">number_of_edges</span>())

<span class="cm"># Top-3 most-bought products</span>
prod_deg = [(n, d) <span class="kw">for</span> n, d <span class="kw">in</span> B.<span class="fn">degree</span>() <span class="kw">if</span> B.nodes[n][<span class="str">"kind"</span>]==<span class="str">"product"</span>]
<span class="fn">print</span>(<span class="str">"Top-3 products:"</span>, <span class="fn">sorted</span>(prod_deg, key=<span class="kw">lambda</span> x:-x[<span class="num">1</span>])[:<span class="num">3</span>])
</code></pre></div>
</div>

<p class="l-text">That bipartite graph is the substrate for collaborative filtering. The classic non-GNN baseline is matrix factorization (SVD on the adjacency); the GNN baseline is LightGCN (He et al. 2020), which is essentially "average neighbors many times". Both lose to nothing — the graph itself already carries most of the signal.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Famous GNN Datasets You Should Know</h2>
<p class="l-text">If you read three GNN papers in a row you will see the same five datasets. Knowing them by name saves time.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cora</div><div class="card-body">2708 papers, 5429 citation edges, 7 subject classes, 1433-dim bag-of-words features. The "MNIST of GNNs" — every paper reports Cora accuracy. State of the art is ~85%.</div></div>
<div class="calc-card"><div class="card-title">Citeseer / Pubmed</div><div class="card-body">Citation networks like Cora but a bit larger (3327 / 19717 nodes). Same transductive node-classification setup.</div></div>
<div class="calc-card"><div class="card-title">OGB</div><div class="card-body">Open Graph Benchmark (Hu et al. 2020). Modern, larger, includes node / link / graph splits with proper out-of-distribution test sets. The "ImageNet of GNNs". OGB-Products has 2.4M nodes.</div></div>
<div class="calc-card"><div class="card-title">QM9 / ZINC / MoleculeNet</div><div class="card-body">Molecular graph regression. QM9 has 134k small molecules with 19 quantum-chemistry targets. ZINC is for property optimization.</div></div>
<div class="calc-card"><div class="card-title">TUDataset</div><div class="card-body">Collection of small graph-classification benchmarks (proteins, mutagenicity, social-network slices). Default sanity check for new graph-pooling ideas.</div></div>
</div>

<p class="l-text">All of these are one-line downloads in PyTorch Geometric (covered in L6). The ergonomics of "<code>dataset = Planetoid(root='/tmp', name='Cora')</code>" make experimenting trivial.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Why Not Just Use Tabular Features?</h2>
<p class="l-text">A fair question: if a node has features, why not throw it at XGBoost? The answer is that the <em>graph itself</em> carries information no per-node feature can express. Two examples make it concrete.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Homophily</div><div class="card-body">In citation networks, papers tend to cite papers of the same field. So a paper's class is correlated with its neighbors' classes. A model that averages neighbors' labels (label propagation, 2002) already beats most tabular baselines on Cora.</div></div>
<div class="calc-card"><div class="card-title">Structural roles</div><div class="card-body">In a fraud network, "money-laundering nodes" share a triangular pattern (A&rarr;B&rarr;C&rarr;A) regardless of their individual features. No tabular feature captures triangles; a 2-layer GNN does.</div></div>
</div>

<div class="calc-highlight"><strong>The simplest GNN baseline you should always try:</strong> for each node, append the mean of its neighbors' features to its own. This is one message-passing step. It often beats raw XGBoost by 5–10 points on graph data — for free.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">Graphs are everywhere — once you see them, you cannot unsee them. The three task families (node, edge, graph) cover essentially all GNN applications. The data structure is three matrices: adjacency, features, labels. NetworkX gives you classical primitives; PyG and DGL will give you neural ones.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Real graphs are everywhere: social, citation, molecule, knowledge, recommendation.</li>
<li>Three tasks: node classification, link prediction, graph classification — same backbone, different readout.</li>
<li>Inputs to a GNN: $A$ (adjacency), $X$ (node features), $y$ (labels). Output: per-node embeddings.</li>
<li>NetworkX runs in Pyodide and is great for the first 100k nodes of any project.</li>
<li>Even a one-step "mean of neighbors" feature beats tabular baselines on graph data.</li>
</ul>
</div>

<p class="l-text">In <strong>gnn-L2</strong> we look at the <em>classical</em> graph-algorithm toolkit — BFS/DFS, PageRank, Louvain communities, Node2Vec — that pre-dates GNNs by decades and that you should always run as a baseline. In <strong>gnn-L3</strong> we develop the spectral view (graph Laplacian, eigenvectors as low-frequency signals) that motivates the GCN architecture. By <strong>L4</strong> we will derive Kipf &amp; Welling's GCN (ICLR 2017) and implement its forward pass in pure NumPy on a 5-node toy graph.</p>
</div>`,
tr: `<p class="l-text"><strong>Dünya, birbirinden bağımsız satırlardan oluşan bir tablo değildir.</strong> Arkadaşlarınız birbirlerinin arkadaşlarını tanır, proteinler komşularıyla etkileşerek katlanır, moleküller halkalar halinde bağlanmış atomlardır, web sayfaları başka web sayfalarına atıf yapar ve bir ürünü satın alan müşteri, aynı ürünü satın alan diğer müşterilere yapısal olarak yakındır. Bakmaya başladığınız anda, neredeyse her ilginç veri kümesinin içinde gizli bir graf vardır — ve bu grafı görmezden gelen bir model, en öngörücü sinyali masada bırakıyor demektir. Graf Sinir Ağları (GNN'ler), bu yapıyı doğrudan tüketen mimari ailesidir; düğümlerin ve kenarların temsillerini, komşularıyla bilgi karıştırarak tekrar tekrar öğrenirler.</p>

<p class="l-text">Bu ilk derste sahneyi kuruyoruz. Klasik gerçek dünya graflarını listeliyoruz (sosyal, bilgi, moleküler, öneri, atıf), tüm alanı düzenleyen üç görev ailesini tanımlıyoruz — düğüm sınıflandırma, bağlantı tahmini, graf sınıflandırma — ve Python'da graf işleme için İsviçre çakısı olan <code>networkx</code> ile tanışıyoruz (memnuniyetle, Pyodide içinde de çalışır). Sonunda tarayıcınızda küçük bir sosyal graf inşa etmiş, derece ve kümelenme hesaplamış ve herhangi bir sinir ağı işin içine girmeden önce <em>bir düğümün komşularına bakmanın</em> bile şaşırtıcı derecede güçlü bir temel sağladığını görmüş olacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir problemin doğal olarak ne zaman bir graf problemi olduğunu tanımak (ve onu tabloya zorlamanın bilgi kaybettirdiğini)</li>
<li>Üç GNN görev ailesini ayırt etmek: düğüm-seviyesi, kenar-seviyesi, graf-seviyesi</li>
<li><code>networkx</code> ile doğrudan tarayıcıda graflar oluşturmak, sorgulamak ve görselleştirmek</li>
<li>Temel yapısal özellikleri hesaplamak: derece, kümelenme katsayısı, bağlı bileşenler</li>
<li>İlişkisel bir tabloyu (siparişler, arkadaşlıklar) komşuluk matrisine ve düğüm-özellik matrisine dönüştürmek</li>
<li>Gerçek veri kümelerini (Cora, Citeseer, MovieLens, OGB) doğru görev ailesine eşlemek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Graflar? Doğası Gereği Graf Olan Beş Alan</h2>
<p class="l-text">Bir graf, <strong>kenarlar</strong> (ilişkiler) ile birbirine bağlı <strong>düğümlerin</strong> (varlıkların) kümesidir. Kenarlar yönlü (Twitter takipleri) veya yönsüz (Facebook arkadaşlıkları), ağırlıklı (değiş tokuş edilen mesaj sayısı) veya tipli ("satın aldı" kenarı vs. "görüntüledi" kenarı) olabilir. 2026 GNN araştırmalarında en çok çalışılan beş alan:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sosyal ağlar</div><div class="card-body">Düğümler = kullanıcılar, kenarlar = arkadaşlıklar / takipler. Görevler: arkadaş önerme, topluluk tespiti, sahte hesap tespiti. Veri kümeleri: Reddit, Twitter, Pokec, OGB-Products.</div></div>
<div class="calc-card"><div class="card-title">Atıf ağları</div><div class="card-body">Düğümler = makaleler, kenarlar = atıflar, özellikler = özet gömme vektörü. Görevler: bir makaleyi araştırma alanına sınıflandırma. Cora (2708 makale, 7 sınıf) ve Citeseer "GNN'lerin MNIST'i"dir.</div></div>
<div class="calc-card"><div class="card-title">Moleküller</div><div class="card-body">Düğümler = atomlar, kenarlar = bağlar. Görevler: toksisite, çözünürlük, bağlanma afinitesi tahmini. Veri kümeleri: ZINC, QM9, MoleculeNet, OGB-Mol*. AlphaFold ve ilaç keşif boru hatları burada yaşar.</div></div>
<div class="calc-card"><div class="card-title">Bilgi grafları</div><div class="card-body">Düğümler = varlıklar (Einstein, Princeton), kenarlar = tipli ilişkiler (çalıştı, doğdu). Görevler: eksik gerçekleri tamamlama (bağlantı tahmini), soru cevaplama. Veri kümeleri: Freebase, Wikidata, FB15k.</div></div>
<div class="calc-card"><div class="card-title">Öneri</div><div class="card-body">İki parçalı graf: bir tarafta kullanıcılar, diğer tarafta ürünler, kenarlar = etkileşimler. Görevler: kullanıcının bir sonraki tıklayacağı/satın alacağı ürünü tahmin etmek. Veri kümeleri: MovieLens, Amazon, Pinterest'in PinSage'i (2018'deki ilk üretim GNN'lerinden biri).</div></div>
</div>

<div class="calc-highlight"><strong>Öklid-dışı testi:</strong> verileriniz doğal bir ızgaraya sahip değilse (görüntülerin aksine) ve doğal bir diziye sahip değilse (metinlerin aksine) ancak örnekler arasında <em>ilişkiler</em> varsa, graf bölgesindesiniz demektir. CNN'ler ve Transformer'lar, düzenli graflarda (bir ızgara, bir zincir) GNN'lerin özel durumları olarak türetilebilir — Bronstein vd.'nin "Geometric Deep Learning" (2021) çalışmasına bakın.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Üç Görev Ailesi</h2>
<p class="l-text">Her GNN makalesi, kıyaslama ve ürün üç kovadan birine sığar. Hangi kovada olduğunuzu bilmek; kayıp fonksiyonunu, veri ayrımını, değerlendirme metriğini ve mimariyi belirler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Düğüm sınıflandırma</div><div class="card-body">Her düğüm için bir etiket tahmin edin. Örnek: "bu Reddit kullanıcısı bir bot mu?" Etiketli bir alt küme üzerinde eğitin, aynı grafın geri kalanında (transdüktif) veya yeni bir grafta (endüktif) tahmin yapın. Kayıp = çapraz entropi. Metrik = doğruluk / F1.</div></div>
<div class="calc-card"><div class="card-title">Bağlantı tahmini</div><div class="card-body">İki düğüm arasında kenar olup olmadığını tahmin edin. Örnek: "kullanıcı A, ürün B'yi alacak mı?" Skor = iki düğüm gömme vektörünün bir fonksiyonu (iç çarpım, MLP). Kayıp = negatif örnekleme ile BCE. Metrik = AUC, Hits@K, MRR.</div></div>
<div class="calc-card"><div class="card-title">Graf sınıflandırma</div><div class="card-body">Tüm bir graf için bir etiket tahmin edin. Örnek: "bu molekül zehirli mi?" Düğüm gömme vektörlerini graf-seviyesi bir vektöre havuzlayın (ortalama / toplam / dikkat havuzu), sonra sınıflandırın. Kayıp = çapraz entropi. Metrik = ROC-AUC, doğruluk.</div></div>
</div>

<p class="l-text">Daha az yaygın bir dördüncü görev <strong>graf regresyonu</strong>'dur (bir graf için sürekli bir sayı tahmin etme — örneğin QM9'da çözünürlük, HOMO-LUMO farkı) ve beşinci ise <strong>graf üretimi</strong>'dir (istenen özelliklere sahip yeni moleküller örnekleme — bu yolun L8'inde, GeoDiff ve EDM gibi difüzyon tabanlı yöntemlere işaret edilerek kısaca ele alınır).</p>

<div class="calc-highlight"><strong>Zihinsel model:</strong> düğüm görevleri "<em>bu düğüm nedir?</em>" diye sorar, kenar görevleri "<em>bu iki düğüm uyumlu mu?</em>" diye sorar, graf görevleri "<em>bu bütün şey nedir?</em>" diye sorar. Mimari büyük ölçüde aynıdır — sadece okuma (readout) katmanı değişir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Bir Grafın Anatomisi: Komşuluk, Özellikler, Etiketler</h2>
<p class="l-text">Matematiksel olarak bir $G = (V, E)$ grafı, bir GNN'in çiğnemesi için üç matrise dönüşür:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Komşuluk $A \\in \\{0,1\\}^{N \\times N}$</div><div class="card-body">$A_{ij}=1$ ancak ve ancak $(i,j)$ kenarı varsa. Yönsüz graflar için simetriktir. Ağırlıklı graflar için gerçek değerler kullanın; tipli graflar için her ilişki tipi için bir matris kullanın (R-GCN).</div></div>
<div class="calc-card"><div class="card-title">Düğüm özellikleri $X \\in \\mathbb{R}^{N \\times d}$</div><div class="card-body">Satır $i$ = düğüm $i$'nin özellik vektörü. Cora için $d{=}1433$ kelime torbası; moleküller için $d \\approx 9$ (atom tipi, yük, hibridizasyon vb.); kullanıcılar için $d$ = profil gömme vektörü.</div></div>
<div class="calc-card"><div class="card-title">Etiketler $y$</div><div class="card-body">Düğüm başına ($y \\in \\{0..C\\}^N$), kenar başına (bağlantı tahmini için $y \\in \\{0,1\\}^{|E|}$) veya graf başına (graf veri kümesi için $y \\in \\{0..C\\}^{|G|}$).</div></div>
</div>

<div class="katex-block">$$\\text{GNN forward (one layer): } H^{(l+1)} = \\sigma\\!\\big(\\hat{A} \\, H^{(l)} \\, W^{(l)}\\big), \\qquad H^{(0)} = X$$</div>

<p class="l-text">burada $\\hat{A}$ normalize edilmiş bir komşuluk matrisidir (ünlü $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ formülünü L4'te türeteceğiz). Bu tür $L$ katman üst üste yığın, ve düğüm $i$'nin temsili $L$-adımlı komşuluğuna bağlıdır — tıpkı bir CNN'in alıcı alanı gibi, ama düzensiz bir ızgarada.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. NetworkX 5 Dakikada</h2>
<p class="l-text"><code>networkx</code>, Python'da graf manipülasyonu için fiili kütüphanedir: graflar oluşturmak, komşuları sorgulamak, klasik algoritmaları (BFS, PageRank, en kısa yollar) çalıştırmak ve görselleştirmek. Saf Python'dur, devasa graflarda yavaştır (1M+ düğüm için <code>graph-tool</code> veya <code>igraph</code> kullanın), ancak prototipleme için mükemmeldir ve — vurucu nokta — Pyodide içinde değiştirilmeden çalışır. Bu yolun ilk üç dersi için onu kullanacağız, sonra gerçek GPU eğitimi için PyTorch Geometric'e geçeceğiz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

<span class="cm"># Küçük bir sosyal graf oluştur</span>
G = nx.<span class="fn">Graph</span>()
G.<span class="fn">add_edges_from</span>([(<span class="str">"A"</span>,<span class="str">"B"</span>),(<span class="str">"A"</span>,<span class="str">"C"</span>),(<span class="str">"B"</span>,<span class="str">"C"</span>),(<span class="str">"C"</span>,<span class="str">"D"</span>),(<span class="str">"D"</span>,<span class="str">"E"</span>),(<span class="str">"E"</span>,<span class="str">"F"</span>),(<span class="str">"D"</span>,<span class="str">"F"</span>)])

<span class="fn">print</span>(<span class="str">"Düğümler:"</span>, G.<span class="fn">number_of_nodes</span>(), <span class="str">"Kenarlar:"</span>, G.<span class="fn">number_of_edges</span>())
<span class="fn">print</span>(<span class="str">"C'nin komşuları:"</span>, <span class="fn">list</span>(G.<span class="fn">neighbors</span>(<span class="str">"C"</span>)))
<span class="fn">print</span>(<span class="str">"Her düğümün derecesi:"</span>, <span class="fn">dict</span>(G.<span class="fn">degree</span>()))
<span class="fn">print</span>(<span class="str">"Kümelenme katsayısı:"</span>, nx.<span class="fn">clustering</span>(G))
<span class="fn">print</span>(<span class="str">"En kısa yol A->F:"</span>, nx.<span class="fn">shortest_path</span>(G, <span class="str">"A"</span>, <span class="str">"F"</span>))
</code></pre></div>

<p class="l-text">Bu kod parçacığı, %90 oranında ihtiyaç duyacağınız dört işlemi gösterir: oluştur, komşuları say, dereceleri al, yollar bul. Şimdi <em>yapısal özelliklerin</em> ortaya çıktığını görmek için sentetik bir arkadaşlık ağı üzerinde biraz daha zengin bir versiyon çalıştıralım.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Küçük bir arkadaşlık grafı oluştur, yapısal özellikleri hesapla ve hangi düğümlerin merkezi olduğunu gör — hepsi tarayıcıdan çıkmadan.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Sentetik küçük dünya arkadaşlık grafı: 20 kişi, her biri ~4 arkadaşa bağlı + yeniden bağlantılar</span>
G = nx.<span class="fn">watts_strogatz_graph</span>(n=<span class="num">20</span>, k=<span class="num">4</span>, p=<span class="num">0.2</span>, seed=<span class="num">7</span>)
<span class="fn">print</span>(<span class="str">"Düğümler:"</span>, G.<span class="fn">number_of_nodes</span>(), <span class="str">"Kenarlar:"</span>, G.<span class="fn">number_of_edges</span>())
<span class="fn">print</span>(<span class="str">"Ortalama derece:"</span>, np.<span class="fn">mean</span>([d <span class="kw">for</span> _, d <span class="kw">in</span> G.<span class="fn">degree</span>()]))
<span class="fn">print</span>(<span class="str">"Yoğunluk:"</span>, nx.<span class="fn">density</span>(G))
<span class="fn">print</span>(<span class="str">"Ortalama kümelenme:"</span>, nx.<span class="fn">average_clustering</span>(G))
<span class="fn">print</span>(<span class="str">"Çap:"</span>, nx.<span class="fn">diameter</span>(G))

<span class="cm"># En merkezi 3 kişi</span>
deg = <span class="fn">dict</span>(G.<span class="fn">degree</span>())
top = <span class="fn">sorted</span>(deg.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])[:<span class="num">3</span>]
<span class="fn">print</span>(<span class="str">"Dereceye göre ilk 3:"</span>, top)

<span class="cm"># Bağlı bileşenler</span>
<span class="fn">print</span>(<span class="str">"# bileşen:"</span>, nx.<span class="fn">number_connected_components</span>(G))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tablodan Grafa: Siparişler &rarr; İki Parçalı</h2>
<p class="l-text">Çoğu üretim veri kümesi tablo olarak gelir. Onları graflara dönüştürmek işin yarısıdır. Burada <code>df_orders</code> tablosunu (Pyodide ön kodunuzda zaten yüklü) alıp, L8 capstone'unda öneri sistemi olarak yeniden ortaya çıkacak müşteri-ürün iki parçalı grafını inşa ediyoruz.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Siparişler tablosundan iki parçalı müşteri-ürün grafına. Gerçek veri, gerçek graf, ~10 satır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Hız için bir dilim kullan</span>
sub = df_orders.<span class="fn">head</span>(<span class="num">400</span>)
B = nx.<span class="fn">Graph</span>()
<span class="kw">for</span> _, row <span class="kw">in</span> sub.<span class="fn">iterrows</span>():
    cust = f<span class="str">"C{row['customer_id']}"</span>
    prod = f<span class="str">"P{row['product_id']}"</span>
    B.<span class="fn">add_node</span>(cust, kind=<span class="str">"customer"</span>)
    B.<span class="fn">add_node</span>(prod, kind=<span class="str">"product"</span>)
    B.<span class="fn">add_edge</span>(cust, prod)

<span class="fn">print</span>(<span class="str">"Toplam düğüm:"</span>, B.<span class="fn">number_of_nodes</span>())
<span class="fn">print</span>(<span class="str">"Müşteriler:"</span>, <span class="fn">sum</span>(<span class="num">1</span> <span class="kw">for</span> n,d <span class="kw">in</span> B.<span class="fn">nodes</span>(data=<span class="kw">True</span>) <span class="kw">if</span> d[<span class="str">"kind"</span>]==<span class="str">"customer"</span>))
<span class="fn">print</span>(<span class="str">"Ürünler:"</span>, <span class="fn">sum</span>(<span class="num">1</span> <span class="kw">for</span> n,d <span class="kw">in</span> B.<span class="fn">nodes</span>(data=<span class="kw">True</span>) <span class="kw">if</span> d[<span class="str">"kind"</span>]==<span class="str">"product"</span>))
<span class="fn">print</span>(<span class="str">"Kenarlar (satın almalar):"</span>, B.<span class="fn">number_of_edges</span>())

<span class="cm"># En çok satın alınan 3 ürün</span>
prod_deg = [(n, d) <span class="kw">for</span> n, d <span class="kw">in</span> B.<span class="fn">degree</span>() <span class="kw">if</span> B.nodes[n][<span class="str">"kind"</span>]==<span class="str">"product"</span>]
<span class="fn">print</span>(<span class="str">"İlk 3 ürün:"</span>, <span class="fn">sorted</span>(prod_deg, key=<span class="kw">lambda</span> x:-x[<span class="num">1</span>])[:<span class="num">3</span>])
</code></pre></div>
</div>

<p class="l-text">Bu iki parçalı graf, işbirlikçi filtrelemenin substratıdır. Klasik GNN-olmayan temel matris faktörizasyonudur (komşuluk üzerinde SVD); GNN temel ise LightGCN'dir (He vd. 2020), ki bu temelde "komşuları birçok kez ortala" demektir. İkisi de hiçbir şey kaybetmez — grafın kendisi zaten sinyalin çoğunu taşır.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Bilmeniz Gereken Ünlü GNN Veri Kümeleri</h2>
<p class="l-text">Üst üste üç GNN makalesi okursanız, aynı beş veri kümesini görürsünüz. Adlarıyla bilmek zaman kazandırır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cora</div><div class="card-body">2708 makale, 5429 atıf kenarı, 7 konu sınıfı, 1433-boyutlu kelime torbası özellikleri. "GNN'lerin MNIST'i" — her makale Cora doğruluğunu rapor eder. Son teknoloji ~%85.</div></div>
<div class="calc-card"><div class="card-title">Citeseer / Pubmed</div><div class="card-body">Cora gibi atıf ağları ama biraz daha büyük (3327 / 19717 düğüm). Aynı transdüktif düğüm sınıflandırma kurulumu.</div></div>
<div class="calc-card"><div class="card-title">OGB</div><div class="card-body">Open Graph Benchmark (Hu vd. 2020). Modern, daha büyük, uygun dağılım dışı test kümeleri ile düğüm / bağlantı / graf ayrımları içerir. "GNN'lerin ImageNet'i". OGB-Products 2.4M düğüm içerir.</div></div>
<div class="calc-card"><div class="card-title">QM9 / ZINC / MoleculeNet</div><div class="card-body">Moleküler graf regresyonu. QM9, 19 kuantum kimyası hedefiyle 134k küçük molekül içerir. ZINC, özellik optimizasyonu içindir.</div></div>
<div class="calc-card"><div class="card-title">TUDataset</div><div class="card-body">Küçük graf-sınıflandırma kıyaslamalarının (proteinler, mutajenisite, sosyal ağ dilimleri) bir koleksiyonu. Yeni graf-havuzlama fikirleri için varsayılan akıl sağlığı kontrolü.</div></div>
</div>

<p class="l-text">Bunların hepsi PyTorch Geometric'te tek satır indirmedir (L6'da ele alınır). "<code>dataset = Planetoid(root='/tmp', name='Cora')</code>" ergonomisi, deney yapmayı önemsiz hale getirir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Neden Sadece Tablo Özellikleri Kullanmıyoruz?</h2>
<p class="l-text">Adil bir soru: bir düğümün özellikleri varsa, neden onu XGBoost'a atmıyoruz? Cevap, <em>grafın kendisinin</em> hiçbir düğüm-başına özelliğin ifade edemeyeceği bilgi taşımasıdır. İki örnek bunu somutlaştırır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Homofili</div><div class="card-body">Atıf ağlarında, makaleler aynı alandaki makalelere atıf yapma eğilimindedir. Yani bir makalenin sınıfı, komşularının sınıflarıyla ilişkilidir. Komşuların etiketlerini ortalayan bir model (etiket yayılımı, 2002), Cora üzerinde çoğu tablo temelini zaten yener.</div></div>
<div class="calc-card"><div class="card-title">Yapısal roller</div><div class="card-body">Bir dolandırıcılık ağında, "kara para aklama düğümleri" bireysel özelliklerinden bağımsız olarak üçgensel bir desen paylaşır (A&rarr;B&rarr;C&rarr;A). Hiçbir tablo özelliği üçgenleri yakalamaz; 2 katmanlı bir GNN yakalar.</div></div>
</div>

<div class="calc-highlight"><strong>Her zaman denemeniz gereken en basit GNN temeli:</strong> her düğüm için, komşularının özelliklerinin ortalamasını kendi özelliklerine ekleyin. Bu bir mesaj geçişi adımıdır. Graf verileri üzerinde ham XGBoost'u genellikle 5-10 puan yener — bedava.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sıradakiler</h2>
<p class="l-text">Graflar her yerdedir — onları gördüğünüzde artık görmemezlikten gelemezsiniz. Üç görev ailesi (düğüm, kenar, graf) tüm GNN uygulamalarını esasen kapsar. Veri yapısı üç matristir: komşuluk, özellikler, etiketler. NetworkX size klasik temel öğeleri verir; PyG ve DGL ise sinirsel olanları.</p>

<div class="calc-highlight"><strong>Anahtar noktalar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Gerçek graflar her yerde: sosyal, atıf, molekül, bilgi, öneri.</li>
<li>Üç görev: düğüm sınıflandırma, bağlantı tahmini, graf sınıflandırma — aynı omurga, farklı readout.</li>
<li>Bir GNN'in girdileri: $A$ (komşuluk), $X$ (düğüm özellikleri), $y$ (etiketler). Çıktı: düğüm-başına gömme vektörleri.</li>
<li>NetworkX Pyodide'de çalışır ve herhangi bir projenin ilk 100k düğümü için harikadır.</li>
<li>Tek adımlı "komşuların ortalaması" özelliği bile graf verilerinde tablo temellerini yener.</li>
</ul>
</div>

<p class="l-text"><strong>gnn-L2</strong>'de, GNN'lerden onlarca yıl önce gelen ve her zaman temel olarak çalıştırmanız gereken <em>klasik</em> graf-algoritma araç setine — BFS/DFS, PageRank, Louvain toplulukları, Node2Vec — bakıyoruz. <strong>gnn-L3</strong>'te GCN mimarisini motive eden spektral görüşü (graf Laplacian'ı, düşük frekans sinyalleri olarak özvektörler) geliştiriyoruz. <strong>L4</strong>'te Kipf &amp; Welling'in GCN'sini (ICLR 2017) türeteceğiz ve 5 düğümlü oyuncak bir grafta saf NumPy'da ileri geçişini uygulayacağız.</p>
</div>`
};
