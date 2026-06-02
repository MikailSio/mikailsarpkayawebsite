window.DISCRETE_L3 = {

en: `<p class="l-text"><strong>A graph is the mathematics of relationships.</strong> Two friends know each other, two web pages link, two cities share a road, two neurons fire together, two words appear in the same sentence — each is a binary relation, and the whole web of such relations is a graph. Strip the picture away and a graph is just a set of dots and a set of lines saying which dots are connected. Strip the dots away and what remains is one of the most universal data structures in computer science. From routing your packets to ranking web pages to retrieving documents in GraphRAG, the same algorithms you learn in this lesson are running.</p>

<p class="l-text">We start formally, list the special graphs you will see again and again (complete, cycle, bipartite, tree, DAG), and compare the three ways a computer stores a graph. Then we walk degree-counting, the handshake lemma, and the language of walks, trails, paths, and cycles. The second half is two classical traversal algorithms — <strong>BFS</strong> and <strong>DFS</strong> — that together drive shortest paths, topological sort, cycle detection, and connectivity. We close with a tour of where graphs actually show up in AI in 2026 (knowledge graphs, GraphRAG, dependency parsing, scene graphs, the bridge to GNNs in L5) and the 1736 Königsberg problem that started the whole field.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a graph formally, distinguish directed/undirected/weighted variants, and recognise the named families (K_n, C_n, bipartite, tree, DAG)</li>
<li>Choose between adjacency matrix, adjacency list, and edge list based on density and the operations you need</li>
<li>Apply the handshake lemma (sum of degrees = 2|E|) and use the parity consequence in proofs</li>
<li>Implement BFS and DFS from scratch in 20 lines each, trace them by hand, and recover shortest paths in unweighted graphs</li>
<li>Use DFS to topologically sort a DAG, detect cycles, and find strongly connected components</li>
<li>Identify graph structures in real AI systems: knowledge graphs, GraphRAG retrieval, dependency parses, scene graphs, social-network analysis</li>
</ul>
</div>

<h2 class="lesson-title">1. What is a Graph?</h2>

<div class="calc-highlight"><strong>One sentence:</strong> a graph is a pair G = (V, E) where V is a set of vertices and E is a set of edges that say which pairs of vertices are connected. Everything else is decoration.</div>

<p class="l-text">Vertices (or nodes) are just labels — they can be cities, users, web pages, atoms, words. Edges are pairs of vertices. The two big variants come from whether edges have a direction:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Undirected graph</div><div class="card-body">E is a set of unordered pairs: \\(E \\subseteq \\{ \\{u,v\\} : u,v \\in V \\}\\). The edge \\(\\{u,v\\}\\) says "u and v are connected" with no asymmetry. Friendship on Facebook is undirected.</div></div>
<div class="calc-card"><div class="card-title">Directed graph (digraph)</div><div class="card-body">E is a set of ordered pairs: \\(E \\subseteq V \\times V\\). The edge \\((u,v)\\) goes <em>from</em> u <em>to</em> v but not back. Twitter follows, web links, "depends on" relations are directed.</div></div>
<div class="calc-card"><div class="card-title">Weighted graph</div><div class="card-body">Each edge carries a number: \\(w: E \\to \\mathbb{R}\\). The number can mean distance (roads), cost (network links), strength (correlations), capacity (pipes). Most real graphs are weighted.</div></div>
<div class="calc-card"><div class="card-title">Multigraph / self-loops</div><div class="card-body">A multigraph allows multiple edges between the same pair (two flights from A to B). A self-loop is an edge from v to itself. Simple graphs forbid both. Most algorithms assume simple unless stated.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">FORMAL DEFINITION</div><div class="formula-main">$$G = (V, E), \\quad |V| = n, \\quad |E| = m$$</div><div class="formula-sub">n is the number of vertices, m the number of edges. Complexity of graph algorithms is almost always quoted in terms of n and m (often written V and E in code).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Road network</div><div class="card-body">Vertices = intersections, edges = road segments, weights = length or travel time. Undirected for two-way streets, directed for one-way.</div></div>
<div class="calc-card"><div class="card-title">Social network</div><div class="card-body">Vertices = users, edges = friendships (undirected) or follows (directed). Facebook had ~3 billion vertices in 2024; the largest connected component contains essentially everyone.</div></div>
<div class="calc-card"><div class="card-title">Web link graph</div><div class="card-body">Vertices = web pages, edges = hyperlinks (directed). Google's PageRank turned this graph into a search engine — eigenvector of a normalised adjacency matrix (we see this in L5).</div></div>
<div class="calc-card"><div class="card-title">Knowledge graph</div><div class="card-body">Vertices = entities (Einstein, Germany, physics), edges = labelled relations (born_in, field_of). Wikidata has ~110 million entities and ~1.5 billion edges.</div></div>
</div>

<div id="plot-l3-intro-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<div id="plot-l3-intro-tr" class="plotly-graph" style="width:100%;height:380px;display:none;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var nodes = [
    {id:'A', x:0, y:2},   {id:'B', x:1.5, y:2.6},
    {id:'C', x:3, y:2},   {id:'D', x:0.6, y:0.8},
    {id:'E', x:2.4, y:0.8}, {id:'F', x:1.5, y:-0.4}
  ];
  var edges = [['A','B'],['B','C'],['A','D'],['B','E'],['C','E'],['D','F'],['E','F'],['D','E']];
  function pos(id){ for (var i=0;i<nodes.length;i++) if (nodes[i].id===id) return nodes[i]; }
  var ex=[], ey=[];
  edges.forEach(function(e){ var a=pos(e[0]),b=pos(e[1]); ex.push(a.x,b.x,null); ey.push(a.y,b.y,null); });
  var t1 = {x:ex, y:ey, mode:'lines', line:{color:'rgba(150,150,170,0.55)', width:2}, hoverinfo:'skip', showlegend:false};
  var t2 = {x:nodes.map(function(n){return n.x;}), y:nodes.map(function(n){return n.y;}),
            mode:'markers+text', text:nodes.map(function(n){return n.id;}),
            textposition:'middle center', textfont:{color:'#fff', size:14, family:'Geist'},
            marker:{size:34, color:'#3b82f6', line:{color:'#1d4ed8', width:2}}, showlegend:false};
  var layout = {paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#ebe6dc'},
    xaxis:{visible:false, range:[-0.8,3.8]}, yaxis:{visible:false, range:[-1.2,3.2]},
    margin:{t:30,r:20,b:20,l:20}, height:380};
  Plotly.newPlot('plot-l3-intro-en', [t1,t2], layout, {responsive:true, displayModeBar:false});
  var tr = document.getElementById('plot-l3-intro-tr');
  if (tr) Plotly.newPlot('plot-l3-intro-tr', [t1,t2], layout, {responsive:true, displayModeBar:false});
}, 250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this picture shows:</strong> a small undirected graph on 6 vertices {A,B,C,D,E,F} with 8 edges. We will reuse this graph for BFS and DFS traces below so you can see how the same input produces different traversal orders.</div></div>

<h2 class="lesson-title">2. Special Graphs You Will See Over and Over</h2>

<p class="l-text">A handful of graph families appear so often that they have names. Knowing them saves you from re-deriving properties every time.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Complete graph K_n</div><div class="card-body">Every pair of vertices is connected. Has \\(\\binom{n}{2} = n(n-1)/2\\) edges. K_4 is a tetrahedron; K_5 is the smallest graph that cannot be drawn in the plane without crossings.</div></div>
<div class="calc-card"><div class="card-title">Cycle C_n</div><div class="card-body">n vertices arranged in a ring, n edges. C_3 is a triangle, C_4 a square. The simplest non-tree graph.</div></div>
<div class="calc-card"><div class="card-title">Path P_n</div><div class="card-body">n vertices in a line, n-1 edges. A cycle with one edge removed. Models a chain, a Markov chain on n states with neighbour transitions only.</div></div>
<div class="calc-card"><div class="card-title">Star K_{1,n}</div><div class="card-body">One central vertex connected to n leaves. Models a hub-and-spoke topology (one server, n clients).</div></div>
<div class="calc-card"><div class="card-title">Bipartite graph</div><div class="card-body">Vertices split into two sets U and W; every edge has one endpoint in U and one in W. Models matching (jobs ↔ workers), recommender systems (users ↔ items), and is detectable by 2-colouring with BFS.</div></div>
<div class="calc-card"><div class="card-title">Tree</div><div class="card-body">Connected, acyclic, n-1 edges. Unique path between any two vertices. Examples: file system, decision tree, parse tree, syntax tree. Whole next lesson (L4) is about trees.</div></div>
<div class="calc-card"><div class="card-title">DAG (Directed Acyclic Graph)</div><div class="card-body">Directed, no directed cycles. Models dependencies (makefiles, course prerequisites, neural-network computation graphs). Always admits a topological order.</div></div>
<div class="calc-card"><div class="card-title">Planar graph</div><div class="card-body">Can be drawn in the plane with no edge crossings. K_5 and K_{3,3} are the forbidden minors (Kuratowski 1930). Maps and circuit boards are planar.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">EDGE COUNTS</div><div class="formula-main">$$|E(K_n)| = \\binom{n}{2}, \\quad |E(C_n)| = n, \\quad |E(\\text{tree on } n)| = n - 1$$</div><div class="formula-sub">A tree is the sparsest connected graph; K_n is the densest simple graph. Real graphs sit between, usually closer to "sparse" — Facebook averages ~340 friends per user out of 3 billion, so density is essentially zero.</div></div>

<div class="l-note"><strong>Why this matters for AI:</strong> a bipartite graph is the structure of every recommender system. A DAG is the structure of every PyTorch computation graph and every Airflow workflow. A tree is the structure of every parse tree and every decision tree. Recognising the family lets you reach for the right algorithm.</div>

<h2 class="lesson-title">3. Adjacency Representations</h2>

<p class="l-text">A graph in your head is dots and lines; a graph in memory is numbers and pointers. Three standard encodings, each with its own trade-off.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adjacency matrix</div><div class="card-body">An \\(n \\times n\\) matrix A where \\(A[i][j] = 1\\) if edge (i,j) exists, else 0. Symmetric if undirected. For weighted graphs, store the weight. <strong>Space O(n²)</strong>; "is u adjacent to v?" is O(1).</div></div>
<div class="calc-card"><div class="card-title">Adjacency list</div><div class="card-body">For each vertex v, store a list of its neighbours. <strong>Space O(n + m)</strong>; "iterate neighbours of v" is O(deg(v)); "is u adjacent to v?" is O(deg(v)).</div></div>
<div class="calc-card"><div class="card-title">Edge list</div><div class="card-body">Just a list of (u, v) pairs (and weights). <strong>Space O(m)</strong>. Cheapest to read/write from disk; bad for "neighbours of v" queries (must scan all edges). Used by graph DBs and Kruskal's MST.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">RULE OF THUMB</div><div class="formula-main">$$\\text{matrix iff } m = \\Theta(n^2), \\quad \\text{list iff } m = O(n \\log n)$$</div><div class="formula-sub">Dense graphs (most pairs connected) favour the matrix; sparse graphs (m close to n) favour the list. Real-world graphs are almost always sparse, so adjacency list wins in practice.</div></div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">ADJACENCY MATRIX — PROS</div>
<div class="compare-item">• O(1) edge lookup</div>
<div class="compare-item">• Matrix algebra: A^k counts walks of length k</div>
<div class="compare-item">• Plays nicely with spectral methods (L5)</div>
<div class="compare-item">• Simple to implement in NumPy</div>
</div>
<div class="compare-col"><div class="compare-title">ADJACENCY MATRIX — CONS</div>
<div class="compare-item">• O(n²) space even for sparse graphs</div>
<div class="compare-item">• Iterating neighbours is O(n), not O(deg)</div>
<div class="compare-item">• 1M vertices = 1 TB matrix — infeasible</div>
</div>
</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">ADJACENCY LIST — PROS</div>
<div class="compare-item">• O(n + m) space — fits real graphs</div>
<div class="compare-item">• BFS/DFS are O(n + m), matching the structure</div>
<div class="compare-item">• Easy to add/remove edges</div>
</div>
<div class="compare-col"><div class="compare-title">ADJACENCY LIST — CONS</div>
<div class="compare-item">• O(deg(v)) edge-existence check</div>
<div class="compare-item">• Less cache-friendly than a matrix</div>
<div class="compare-item">• Awkward to use linear algebra on directly</div>
</div>
</div>

<div id="plot-l3-adjmat-en" class="plotly-graph" style="width:100%;height:420px;"></div>
<div id="plot-l3-adjmat-tr" class="plotly-graph" style="width:100%;height:420px;display:none;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var labels = ['A','B','C','D','E','F'];
  var idx = {A:0,B:1,C:2,D:3,E:4,F:5};
  var edges = [['A','B'],['B','C'],['A','D'],['B','E'],['C','E'],['D','F'],['E','F'],['D','E']];
  var n = 6;
  var M = [];
  for (var i=0;i<n;i++){ var row=[]; for (var j=0;j<n;j++) row.push(0); M.push(row); }
  edges.forEach(function(e){ var i=idx[e[0]], j=idx[e[1]]; M[i][j]=1; M[j][i]=1; });
  var data = [{ z: M, x: labels, y: labels, type:'heatmap',
    colorscale:[[0,'rgba(30,40,60,0.5)'],[1,'#3b82f6']], showscale:false,
    xgap:2, ygap:2, hovertemplate:'A[%{y}][%{x}] = %{z}<extra></extra>' }];
  var layout = { paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#ebe6dc'},
    xaxis:{side:'top', tickfont:{size:13}}, yaxis:{autorange:'reversed', tickfont:{size:13}},
    margin:{t:60,r:40,b:40,l:60}, height:420 };
  Plotly.newPlot('plot-l3-adjmat-en', data, layout, {responsive:true, displayModeBar:false});
  var tr = document.getElementById('plot-l3-adjmat-tr');
  if (tr) Plotly.newPlot('plot-l3-adjmat-tr', data, layout, {responsive:true, displayModeBar:false});
}, 250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this picture shows:</strong> the 6×6 adjacency matrix of our example graph. Blue cells mark edges. The matrix is symmetric because the graph is undirected; the diagonal is zero because there are no self-loops. For this tiny graph, 36 cells store what 8 entries in an adjacency list would.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SAME GRAPH, THREE FORMATS</div><div class="example-body">Vertices V = {A, B, C, D, E, F}. Edges E = {AB, AD, BC, BE, CE, DE, DF, EF}.<br><br>
<strong>Adjacency list</strong> (8 lines, very compact):<br>
A: [B, D]  &nbsp; B: [A, C, E]  &nbsp; C: [B, E]<br>
D: [A, E, F]  &nbsp; E: [B, C, D, F]  &nbsp; F: [D, E]<br><br>
<strong>Edge list</strong> (8 entries): [(A,B),(A,D),(B,C),(B,E),(C,E),(D,E),(D,F),(E,F)]<br><br>
<strong>Adjacency matrix</strong>: 6×6 grid drawn above. Sum of all entries = 16 = 2 × 8 (each edge appears twice — once as A[i][j] and once as A[j][i]). That "twice" is the handshake lemma in disguise.</div></div>

<h2 class="lesson-title">4. Degree and the Handshake Lemma</h2>

<div class="calc-highlight"><strong>One sentence:</strong> if you add up how many edges touch each vertex, you have counted every edge exactly twice.</div>

<p class="l-text">The <strong>degree</strong> of a vertex v, written \\(\\deg(v)\\), is the number of edges incident to v. In a directed graph we split this into <em>in-degree</em> (edges pointing in) and <em>out-degree</em> (edges pointing out).</p>

<div class="calc-formula"><div class="formula-label">HANDSHAKE LEMMA</div><div class="formula-main">$$\\sum_{v \\in V} \\deg(v) = 2|E|$$</div><div class="formula-sub">Every edge has exactly two endpoints, so it contributes 1 to the degree of each. Sum over all vertices and you get 2|E|. Trivially true, surprisingly useful.</div></div>

<p class="l-text">The lemma has a famous corollary that shows up in olympiad problems and proofs alike:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Corollary</div><div class="card-body">The number of vertices with odd degree is even. Why? Sum of degrees = 2|E| is even. If an odd number of terms were odd, the sum would be odd. Contradiction.</div></div>
<div class="calc-card"><div class="card-title">Why it matters</div><div class="card-body">Used to prove the seven Königsberg bridges have no Eulerian circuit (all four vertices were odd-degree — impossible). Used in error-correcting codes and in checking the validity of a degree sequence.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Our running graph. Degrees: <br>
deg(A)=2, deg(B)=3, deg(C)=2, deg(D)=3, deg(E)=4, deg(F)=2.<br>
Sum = 2+3+2+3+4+2 = <strong>16</strong> = 2 × 8 = 2|E|. ✓<br>
Number of odd-degree vertices: B and D — exactly 2, which is even. ✓</div></div>

<div id="plot-l3-degree-en" class="plotly-graph" style="width:100%;height:340px;"></div>
<div id="plot-l3-degree-tr" class="plotly-graph" style="width:100%;height:340px;display:none;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var verts = ['A','B','C','D','E','F'];
  var degs  = [2,3,2,3,4,2];
  var colors = degs.map(function(d){ return d % 2 === 1 ? '#f87171' : '#3b82f6'; });
  var data = [{ x: verts, y: degs, type:'bar', marker:{color: colors, line:{color:'#1d4ed8', width:1}},
    text: degs.map(function(d){return d + (d%2===1?' (odd)':' (even)');}),
    textposition:'outside', hovertemplate:'deg(%{x}) = %{y}<extra></extra>' }];
  var layout = { paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#ebe6dc'},
    xaxis:{title:'vertex', gridcolor:'rgba(255,255,255,0.06)'},
    yaxis:{title:'degree', gridcolor:'rgba(255,255,255,0.06)', range:[0,5.5]},
    margin:{t:40,r:30,b:50,l:50}, height:340, showlegend:false,
    annotations:[{x:5.4, y:5.2, text:'sum = 16 = 2 |E|', showarrow:false, font:{color:'#3b82f6', size:13}}] };
  Plotly.newPlot('plot-l3-degree-en', data, layout, {responsive:true, displayModeBar:false});
  var tr = document.getElementById('plot-l3-degree-tr');
  if (tr) Plotly.newPlot('plot-l3-degree-tr', data, layout, {responsive:true, displayModeBar:false});
}, 250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this picture shows:</strong> degree of each vertex in the running graph. Red bars are odd, blue bars are even; exactly two odd vertices, as the handshake lemma forces. The total height adds to 16, exactly twice the edge count.</div></div>

<h2 class="lesson-title">5. Walks, Paths, Cycles</h2>

<p class="l-text">These four words are often used interchangeably in casual talk but are different things formally. Pinning them down keeps proofs and complexity arguments honest.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Walk</div><div class="card-body">A sequence \\(v_0, v_1, \\dots, v_k\\) such that each consecutive pair is an edge. Vertices and edges may repeat. "Wander around" with no constraints.</div></div>
<div class="calc-card"><div class="card-title">Trail</div><div class="card-body">A walk in which no <em>edge</em> repeats (vertices may). Eulerian circuits are trails.</div></div>
<div class="calc-card"><div class="card-title">Path</div><div class="card-body">A walk in which no <em>vertex</em> repeats. Automatically no edge repeats either. "Shortest path" always means this.</div></div>
<div class="calc-card"><div class="card-title">Cycle</div><div class="card-body">A path of length ≥ 3 that returns to the start (first = last vertex; all others distinct). C_n is the prototypical cycle.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">LENGTH OF A WALK</div><div class="formula-main">$$\\text{length}(v_0, v_1, \\dots, v_k) = k \\quad (\\text{number of edges, not vertices})$$</div><div class="formula-sub">In a weighted graph, length is the sum of edge weights along the walk. Watch out: graph length k means k edges, k+1 vertices.</div></div>

<p class="l-text">Two famous problems live one step above this terminology — and they could not be more different in difficulty:</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">EULERIAN CIRCUIT — POLYNOMIAL</div>
<div class="compare-item">• Visit <strong>every edge</strong> exactly once and return to start</div>
<div class="compare-item">• Exists iff the graph is connected and every vertex has even degree</div>
<div class="compare-item">• Linear-time algorithm (Hierholzer 1873)</div>
<div class="compare-item">• Postman tours, DNA assembly</div>
</div>
<div class="compare-col"><div class="compare-title">HAMILTONIAN CYCLE — NP-HARD</div>
<div class="compare-item">• Visit <strong>every vertex</strong> exactly once and return to start</div>
<div class="compare-item">• No nice characterisation known (and probably none exists)</div>
<div class="compare-item">• NP-complete (Karp 1972)</div>
<div class="compare-item">• Travelling salesman (weighted Hamiltonian)</div>
</div>
</div>

<div class="calc-highlight"><strong>The lesson:</strong> swapping "vertex" for "edge" in a problem statement can change a 1873 textbook exercise into a million-dollar open question. Graph problems are sensitive to which combinatorial object you constrain.</div>

<h2 class="lesson-title">6. Connectivity, Components, Bridges</h2>

<p class="l-text">An undirected graph is <strong>connected</strong> if there is a path between every pair of vertices. If it is not connected, it falls into <strong>connected components</strong> — maximal connected subgraphs. Our running graph has one component; if you delete edges AB and AD, vertex A becomes a component on its own.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Connected component</div><div class="card-body">Maximal set of vertices mutually reachable by paths. BFS from any vertex floods its whole component in O(n+m); repeat from unvisited starts to find all components.</div></div>
<div class="calc-card"><div class="card-title">Strongly connected (directed)</div><div class="card-body">In a digraph, "strongly connected" means a directed path from u to v <em>and</em> from v to u, for every pair. Kosaraju's algorithm finds strongly connected components in O(n+m) with two DFS passes.</div></div>
<div class="calc-card"><div class="card-title">Bridge</div><div class="card-body">An edge whose removal increases the number of components. In a road network, a bridge in the graph sense is also a bridge in the engineering sense — single point of failure.</div></div>
<div class="calc-card"><div class="card-title">Articulation point</div><div class="card-body">A vertex whose removal increases the number of components. Critical infrastructure nodes; SPOFs in networks.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">TARJAN'S BRIDGE & CUT-VERTEX ALGORITHM</div><div class="formula-main">$$T(n, m) = O(n + m)$$</div><div class="formula-sub">A single DFS pass that tracks discovery time and "low link" (earliest ancestor reachable via a back edge) finds all bridges and articulation points at once. Beautiful one-pass algorithm.</div></div>

<div id="plot-l3-components-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<div id="plot-l3-components-tr" class="plotly-graph" style="width:100%;height:380px;display:none;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var nodes = [
    {id:'A', x:0.0, y:2.0, c:0}, {id:'B', x:1.0, y:2.5, c:0}, {id:'C', x:1.0, y:1.5, c:0},
    {id:'D', x:3.0, y:2.2, c:1}, {id:'E', x:4.0, y:2.5, c:1}, {id:'F', x:3.5, y:1.3, c:1}, {id:'G', x:4.5, y:1.5, c:1},
    {id:'H', x:6.0, y:2.0, c:2}, {id:'I', x:7.0, y:1.7, c:2}
  ];
  var edges = [['A','B'],['A','C'],['B','C'],['D','E'],['D','F'],['E','G'],['F','G'],['E','F'],['H','I']];
  function pos(id){ for (var i=0;i<nodes.length;i++) if (nodes[i].id===id) return nodes[i]; }
  var ex=[], ey=[];
  edges.forEach(function(e){ var a=pos(e[0]),b=pos(e[1]); ex.push(a.x,b.x,null); ey.push(a.y,b.y,null); });
  var palette = ['#3b82f6','#22c55e','#f59e0b'];
  var t1 = {x:ex, y:ey, mode:'lines', line:{color:'rgba(150,150,170,0.5)', width:2}, hoverinfo:'skip', showlegend:false};
  var t2 = {x:nodes.map(function(n){return n.x;}), y:nodes.map(function(n){return n.y;}),
            mode:'markers+text', text:nodes.map(function(n){return n.id;}),
            textposition:'middle center', textfont:{color:'#fff', size:13},
            marker:{size:32, color:nodes.map(function(n){return palette[n.c];}),
              line:{color:'#111', width:1.5}}, showlegend:false};
  var layout = {paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#ebe6dc'},
    xaxis:{visible:false, range:[-0.5,7.7]}, yaxis:{visible:false, range:[1.0,2.9]},
    margin:{t:30,r:20,b:20,l:20}, height:380,
    annotations:[
      {x:0.7,y:2.85,text:'Component 1',showarrow:false,font:{color:'#3b82f6',size:12}},
      {x:3.8,y:2.85,text:'Component 2',showarrow:false,font:{color:'#22c55e',size:12}},
      {x:6.5,y:2.3,text:'Component 3',showarrow:false,font:{color:'#f59e0b',size:12}}
    ]};
  Plotly.newPlot('plot-l3-components-en', [t1,t2], layout, {responsive:true, displayModeBar:false});
  var tr = document.getElementById('plot-l3-components-tr');
  if (tr) Plotly.newPlot('plot-l3-components-tr', [t1,t2], layout, {responsive:true, displayModeBar:false});
}, 250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this picture shows:</strong> a graph on 9 vertices with three connected components, colour-coded. No edge crosses a colour boundary. BFS or DFS from any vertex would only ever discover vertices of the same colour; you need a restart from an unvisited vertex to find the next component.</div></div>

<h2 class="lesson-title">7. Breadth-First Search (BFS)</h2>

<div class="calc-highlight"><strong>One sentence:</strong> BFS explores the graph in concentric layers — first all neighbours of the start, then their neighbours, then theirs, using a queue to remember what to visit next.</div>

<p class="l-text">BFS is the algorithm behind shortest-path-in-unweighted-graphs, web crawling level-by-level, finding the cheapest tree of links in social networks ("six degrees of Kevin Bacon"), and the bipartite test. The data structure that makes it work is a FIFO queue.</p>

<div class="calc-formula"><div class="formula-label">BFS PSEUDOCODE</div><div class="formula-main">$$\\begin{aligned} &\\text{BFS}(G, s):\\\\ &\\quad \\text{visited} \\leftarrow \\{s\\}; \\; Q \\leftarrow [s]; \\; d[s] \\leftarrow 0 \\\\ &\\quad \\textbf{while } Q \\text{ not empty}: \\\\ &\\quad\\quad u \\leftarrow Q.\\text{pop\\_front}() \\\\ &\\quad\\quad \\textbf{for } v \\in \\text{neighbours}(u): \\\\ &\\quad\\quad\\quad \\textbf{if } v \\notin \\text{visited}: \\\\ &\\quad\\quad\\quad\\quad \\text{visited.add}(v); \\; Q.\\text{push}(v); \\; d[v] \\leftarrow d[u] + 1 \\end{aligned}$$</div><div class="formula-sub">Each vertex enters the queue at most once → each edge is examined at most twice → total work is O(n + m). The array d[] is the shortest-path distance from s.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — BFS FROM A ON THE RUNNING GRAPH</div><div class="example-body">Adjacency: A:[B,D] · B:[A,C,E] · C:[B,E] · D:[A,E,F] · E:[B,C,D,F] · F:[D,E]<br><br>
<strong>Step 0:</strong> Q = [A], visited = {A}, d[A] = 0<br>
<strong>Step 1:</strong> pop A. Neighbours B, D unvisited → enqueue. Q = [B, D]. d[B] = d[D] = 1.<br>
<strong>Step 2:</strong> pop B. Neighbours: A (skip, visited), C, E. Enqueue C, E. Q = [D, C, E]. d[C] = d[E] = 2.<br>
<strong>Step 3:</strong> pop D. Neighbours: A (skip), E (skip), F. Enqueue F. Q = [C, E, F]. d[F] = 2.<br>
<strong>Step 4:</strong> pop C. Neighbours: B (skip), E (skip). Q = [E, F]. <br>
<strong>Step 5:</strong> pop E. Neighbours: B, C, D, F — all visited. Q = [F].<br>
<strong>Step 6:</strong> pop F. Neighbours: D, E — all visited. Q empty. <strong>Done.</strong><br><br>
Final distances from A: A→0, B→1, D→1, C→2, E→2, F→2. <br>Visit order: A, B, D, C, E, F.</div></div>

<div id="plot-l3-bfs-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<div id="plot-l3-bfs-tr" class="plotly-graph" style="width:100%;height:380px;display:none;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var nodes = [
    {id:'A', x:0, y:2, d:0},   {id:'B', x:1.5, y:2.6, d:1},
    {id:'C', x:3, y:2, d:2},   {id:'D', x:0.6, y:0.8, d:1},
    {id:'E', x:2.4, y:0.8, d:2}, {id:'F', x:1.5, y:-0.4, d:2}
  ];
  var edges = [['A','B'],['B','C'],['A','D'],['B','E'],['C','E'],['D','F'],['E','F'],['D','E']];
  function pos(id){ for (var i=0;i<nodes.length;i++) if (nodes[i].id===id) return nodes[i]; }
  var ex=[], ey=[];
  edges.forEach(function(e){ var a=pos(e[0]),b=pos(e[1]); ex.push(a.x,b.x,null); ey.push(a.y,b.y,null); });
  var palette = ['#ef4444','#3b82f6','#22c55e'];
  var t1 = {x:ex, y:ey, mode:'lines', line:{color:'rgba(150,150,170,0.45)', width:2}, hoverinfo:'skip', showlegend:false};
  var t2 = {x:nodes.map(function(n){return n.x;}), y:nodes.map(function(n){return n.y;}),
            mode:'markers+text',
            text:nodes.map(function(n){return n.id + ' (d=' + n.d + ')';}),
            textposition:'middle center', textfont:{color:'#fff', size:11},
            marker:{size:44, color:nodes.map(function(n){return palette[n.d];}),
              line:{color:'#111', width:1.5}}, showlegend:false};
  var layout = {paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#ebe6dc'},
    xaxis:{visible:false, range:[-0.8,3.8]}, yaxis:{visible:false, range:[-1.2,3.2]},
    margin:{t:50,r:20,b:20,l:20}, height:380,
    annotations:[
      {x:-0.4,y:3.0,text:'distance 0',showarrow:false,font:{color:'#ef4444',size:12}},
      {x:1.5,y:3.0,text:'distance 1',showarrow:false,font:{color:'#3b82f6',size:12}},
      {x:3.4,y:3.0,text:'distance 2',showarrow:false,font:{color:'#22c55e',size:12}}
    ]};
  Plotly.newPlot('plot-l3-bfs-en', [t1,t2], layout, {responsive:true, displayModeBar:false});
  var tr = document.getElementById('plot-l3-bfs-tr');
  if (tr) Plotly.newPlot('plot-l3-bfs-tr', [t1,t2], layout, {responsive:true, displayModeBar:false});
}, 250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this picture shows:</strong> the BFS layering from source A. Red is layer 0 (the source itself), blue is layer 1 (direct neighbours), green is layer 2 (two edges away). BFS guarantees this layering correctly equals the shortest-path distance — the cornerstone of any unweighted shortest-path use case.</div></div>

<h2 class="lesson-title">8. Depth-First Search (DFS)</h2>

<div class="calc-highlight"><strong>One sentence:</strong> DFS goes as deep as possible before backtracking, using a stack (or recursion) instead of a queue.</div>

<p class="l-text">DFS does not produce shortest paths but produces something arguably richer: a <strong>tree of discovery</strong> with structural information about back edges, forward edges, and cross edges. These let DFS solve topological sort, cycle detection, strongly-connected components, and bridges — none of which BFS does cleanly.</p>

<div class="calc-formula"><div class="formula-label">DFS PSEUDOCODE (RECURSIVE)</div><div class="formula-main">$$\\begin{aligned} &\\text{DFS}(G, u, \\text{visited}): \\\\ &\\quad \\text{visited.add}(u); \\; \\text{disc}[u] \\leftarrow \\text{time}++ \\\\ &\\quad \\textbf{for } v \\in \\text{neighbours}(u): \\\\ &\\quad\\quad \\textbf{if } v \\notin \\text{visited}: \\\\ &\\quad\\quad\\quad \\text{DFS}(G, v, \\text{visited}) \\\\ &\\quad \\text{fin}[u] \\leftarrow \\text{time}++ \\end{aligned}$$</div><div class="formula-sub">Discovery and finish times are the timestamps when DFS first sees / last leaves a vertex. These times tell you the type of each non-tree edge (back, forward, cross), which underpins many DFS-based algorithms.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tree edge</div><div class="card-body">An edge that DFS actually used to discover a new vertex. Forms the DFS tree.</div></div>
<div class="calc-card"><div class="card-title">Back edge</div><div class="card-body">An edge to an ancestor in the DFS tree. <strong>A back edge ⇔ a cycle.</strong> This is how DFS detects cycles in O(n+m).</div></div>
<div class="calc-card"><div class="card-title">Forward edge (digraphs)</div><div class="card-body">An edge from an ancestor to a descendant, but not a tree edge (already explored).</div></div>
<div class="calc-card"><div class="card-title">Cross edge (digraphs)</div><div class="card-body">An edge between vertices with no ancestor/descendant relation.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DFS FROM A ON THE RUNNING GRAPH</div><div class="example-body">Assume neighbours are visited in the order they appear in the adjacency list. Watch how different this is from BFS.<br><br>
<strong>Visit A</strong> (disc=1). Go to B (first neighbour).<br>
<strong>Visit B</strong> (disc=2). Go to A? Already visited. Go to C.<br>
<strong>Visit C</strong> (disc=3). B visited. Go to E.<br>
<strong>Visit E</strong> (disc=4). B, C visited. Go to D.<br>
<strong>Visit D</strong> (disc=5). A, E visited. Go to F.<br>
<strong>Visit F</strong> (disc=6). D, E visited. <strong>Backtrack.</strong> fin=7.<br>
Back at D, no more unvisited. fin=8. Back at E, no more. fin=9. Back at C, fin=10. Back at B, fin=11. Back at A, fin=12.<br><br>
DFS visit order: A, B, C, E, D, F. (BFS gave A, B, D, C, E, F — different!)<br>
DFS tree edges: A→B, B→C, C→E, E→D, D→F. Back edges: B-A (no, parent), D-A, D-E (parent), E-B, F-E — back edges show cycles A-B-C-E-D-A and others.</div></div>

<div id="plot-l3-dfs-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<div id="plot-l3-dfs-tr" class="plotly-graph" style="width:100%;height:380px;display:none;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var nodes = [
    {id:'A', x:0, y:2, o:1},   {id:'B', x:1.5, y:2.6, o:2},
    {id:'C', x:3, y:2, o:3},   {id:'D', x:0.6, y:0.8, o:5},
    {id:'E', x:2.4, y:0.8, o:4}, {id:'F', x:1.5, y:-0.4, o:6}
  ];
  var edges = [['A','B'],['B','C'],['A','D'],['B','E'],['C','E'],['D','F'],['E','F'],['D','E']];
  function pos(id){ for (var i=0;i<nodes.length;i++) if (nodes[i].id===id) return nodes[i]; }
  var treeEdges = [['A','B'],['B','C'],['C','E'],['E','D'],['D','F']];
  function isTree(u,v){ for (var i=0;i<treeEdges.length;i++){ var t=treeEdges[i]; if ((t[0]===u && t[1]===v) || (t[0]===v && t[1]===u)) return true;} return false; }
  var txT=[],tyT=[],txB=[],tyB=[];
  edges.forEach(function(e){ var a=pos(e[0]),b=pos(e[1]);
    if (isTree(e[0],e[1])) { txT.push(a.x,b.x,null); tyT.push(a.y,b.y,null); }
    else { txB.push(a.x,b.x,null); tyB.push(a.y,b.y,null); } });
  var t1 = {x:txB, y:tyB, mode:'lines', line:{color:'rgba(248,113,113,0.55)', width:1.5, dash:'dash'}, name:'non-tree (back) edge', hoverinfo:'skip'};
  var t2 = {x:txT, y:tyT, mode:'lines', line:{color:'#22c55e', width:3}, name:'DFS tree edge', hoverinfo:'skip'};
  var cmap = function(o){ var p=['#fee2e2','#fecaca','#fca5a5','#f87171','#ef4444','#b91c1c']; return p[o-1]; };
  var t3 = {x:nodes.map(function(n){return n.x;}), y:nodes.map(function(n){return n.y;}),
            mode:'markers+text',
            text:nodes.map(function(n){return n.id + ' (' + n.o + ')';}),
            textposition:'middle center', textfont:{color:'#111', size:11},
            marker:{size:44, color:nodes.map(function(n){return cmap(n.o);}),
              line:{color:'#111', width:1.5}}, showlegend:false};
  var layout = {paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#ebe6dc'},
    xaxis:{visible:false, range:[-0.8,3.8]}, yaxis:{visible:false, range:[-1.2,3.2]},
    margin:{t:60,r:20,b:20,l:20}, height:380,
    showlegend:true, legend:{orientation:'h', y:1.08, xanchor:'center', x:0.5, font:{color:'#ebe6dc'}}};
  Plotly.newPlot('plot-l3-dfs-en', [t1,t2,t3], layout, {responsive:true, displayModeBar:false});
  var tr = document.getElementById('plot-l3-dfs-tr');
  if (tr) Plotly.newPlot('plot-l3-dfs-tr', [t1,t2,t3], layout, {responsive:true, displayModeBar:false});
}, 250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this picture shows:</strong> the same graph with DFS visit order in parentheses (lighter red = earlier, darker red = later). Green solid edges form the DFS tree; red dashed edges are non-tree (back) edges that close cycles. Compare with the BFS layering above — same graph, same start vertex, totally different traversal.</div></div>

<h2 class="lesson-title">9. DFS Applications</h2>

<p class="l-text">BFS is mostly about distances. DFS is a Swiss-army knife.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Topological sort</div><div class="card-body">For a DAG, list vertices so every edge goes left to right. Algorithm: DFS the graph, output vertices in <em>reverse</em> finish-time order. O(n+m). Used for build systems (make, Bazel, npm), course scheduling (CS101 before CS201), and the order PyTorch evaluates a computation graph.</div></div>
<div class="calc-card"><div class="card-title">Cycle detection</div><div class="card-body">Undirected: any back edge during DFS = cycle. Directed: any back edge in the DFS forest = directed cycle. Used to detect dependency loops in package managers ("pip cannot resolve circular dep") and infinite loops in workflow DSLs.</div></div>
<div class="calc-card"><div class="card-title">Strongly connected components</div><div class="card-body">Kosaraju (1978): DFS the graph, DFS the transpose in reverse finish-time order. Each tree in the second DFS is one SCC. O(n+m). Used in compilers (SSA construction), social network "clusters", and PageRank's preprocessing.</div></div>
<div class="calc-card"><div class="card-title">Bridges and articulation points</div><div class="card-body">Tarjan's O(n+m) DFS with low-link values. Used in network reliability (where do I add redundancy?), pre-Internet AT&T routing analyses, and infrastructure graphs.</div></div>
<div class="calc-card"><div class="card-title">Bipartite check</div><div class="card-body">Actually easier with BFS but works with DFS too: 2-colour the graph layer-by-layer; if any edge connects two same-colour vertices, the graph is not bipartite.</div></div>
<div class="calc-card"><div class="card-title">Maze / puzzle solving</div><div class="card-body">DFS with backtracking is the classical maze-solver and constraint-satisfaction algorithm. Variant called "iterative deepening" combines DFS memory with BFS shortest-path guarantees.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">TOPOLOGICAL ORDER ⇔ NO CYCLES</div><div class="formula-main">$$\\text{A directed graph has a topological order } \\iff \\text{it is a DAG}$$</div><div class="formula-sub">If a cycle exists, no vertex in it can come before the others; if no cycle, DFS-finish-reverse gives a valid order. This biconditional is why "build system that hangs" almost always means "you introduced a circular dependency."</div></div>

<h2 class="lesson-title">10. AI Applications of Graphs (2026)</h2>

<p class="l-text">Most of this lesson is classical, but graphs do show up in real AI systems — and the trend in 2024–2026 has actually been toward <em>more</em> graphs, not fewer, because LLMs hallucinate less when grounded against an explicit knowledge structure.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Social network analysis</div><div class="card-body">BFS finds friends-of-friends recommendations (LinkedIn's "2nd degree"). DFS plus modularity finds communities (Louvain method). Centrality measures (PageRank, betweenness) rank influence — your TikTok feed is partly graph-ranked.</div></div>
<div class="calc-card"><div class="card-title">GraphRAG (Microsoft 2024)</div><div class="card-body">Retrieval-augmented generation that first builds a knowledge graph from your corpus (entities + relations extracted by an LLM), then traverses it to assemble context. Outperforms vanilla vector RAG on multi-hop questions because the graph encodes "X is related to Y is related to Z" explicitly. Open source as of 2024-07.</div></div>
<div class="calc-card"><div class="card-title">Knowledge graphs</div><div class="card-body">Wikidata (~110M entities), ConceptNet (commonsense), ATOMIC (causal/social commonsense). Each stores facts as (subject, relation, object) triples. Modern systems (Google Knowledge Panel, Bing answer boxes) blend KG lookup with LLM generation.</div></div>
<div class="calc-card"><div class="card-title">Dependency parsing in NLP</div><div class="card-body">Each sentence is a tree (special graph) where edges are labelled head-dependent relations (subject, object, modifier). Used in semantic role labelling, information extraction, and feeding GNN-based parsers.</div></div>
<div class="calc-card"><div class="card-title">Scene graphs in CV</div><div class="card-body">An image is parsed into objects (vertices) with spatial / semantic relations (edges): "person riding bicycle next-to tree". Used in visual question answering and text-to-image grounding (DALL-E 3, Stable Diffusion 3 control nets).</div></div>
<div class="calc-card"><div class="card-title">Molecules and drug design</div><div class="card-body">Atoms = vertices, bonds = edges. GNNs (graph neural networks) predict molecular properties. DeepMind's AlphaFold operates on residue-residue graphs; Insilico Medicine's INS018_055 (in Phase II trial) was discovered by GNNs on protein graphs.</div></div>
<div class="calc-card"><div class="card-title">Bridge to GNNs (L5 preview)</div><div class="card-body">Once you have an adjacency matrix and node features, you can stack message-passing layers. The Laplacian eigenvectors give a "graph Fourier transform"; spectral GNNs use this directly. Lesson 5 (Spectral Graph Theory) builds that bridge.</div></div>
<div class="calc-card"><div class="card-title">Agent dependency graphs</div><div class="card-body">Modern agent frameworks (LangGraph, CrewAI, AutoGen) compile a multi-agent system into a DAG of nodes; the runtime topologically schedules execution. The "control flow" we discussed in Agents L1 is, formally, a graph.</div></div>
</div>

<div class="l-note"><strong>Practical bottom line:</strong> if you ever build a non-toy LLM application in 2026, you will probably touch graphs three times — at retrieval (GraphRAG), at structure (knowledge graph augmentation), and at orchestration (agent DAG). The BFS/DFS you implement below will run inside production systems you might never see directly.</div>

<h2 class="lesson-title">11. The Königsberg Bridges — How Graph Theory Was Born</h2>

<p class="l-text">Königsberg (now Kaliningrad) had seven bridges connecting two islands in the Pregel river to the two riverbanks. The Sunday puzzle: <strong>can you walk through the city crossing each bridge exactly once and returning to your start?</strong> In 1736, Leonhard Euler proved you cannot — and in doing so, invented graph theory.</p>

<div class="calc-highlight"><strong>Euler's reasoning:</strong> abstract the city to a graph. Each landmass is a vertex; each bridge is an edge. The question becomes: does this graph have an Eulerian circuit? For one to exist, every time you enter a vertex by an edge, you must be able to leave by a different edge. So every vertex must have <em>even</em> degree. All four Königsberg vertices have odd degree (3, 3, 3, 5). Therefore: impossible.</div>

<div class="calc-formula"><div class="formula-label">EULER'S THEOREM (1736)</div><div class="formula-main">$$\\text{Eulerian circuit exists} \\iff \\text{graph is connected and every vertex has even degree}$$</div><div class="formula-sub">An Eulerian trail (not necessarily returning to start) exists iff exactly 0 or 2 vertices have odd degree. The 0-case gives a circuit; the 2-case starts and ends at the odd vertices.</div></div>

<div id="plot-l3-konigsberg-en" class="plotly-graph" style="width:100%;height:360px;"></div>
<div id="plot-l3-konigsberg-tr" class="plotly-graph" style="width:100%;height:360px;display:none;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var nodes = [
    {id:'N (north bank)', x:1.5, y:2.4, deg:3},
    {id:'S (south bank)', x:1.5, y:-0.4, deg:3},
    {id:'A (Kneiphof I.)', x:0.3, y:1.0, deg:5},
    {id:'B (Lomse I.)', x:2.7, y:1.0, deg:3}
  ];
  var edges = [
    ['N (north bank)','A (Kneiphof I.)'], ['N (north bank)','A (Kneiphof I.)'],
    ['N (north bank)','B (Lomse I.)'],
    ['S (south bank)','A (Kneiphof I.)'], ['S (south bank)','A (Kneiphof I.)'],
    ['S (south bank)','B (Lomse I.)'],
    ['A (Kneiphof I.)','B (Lomse I.)']
  ];
  function pos(id){ for (var i=0;i<nodes.length;i++) if (nodes[i].id===id) return nodes[i]; }
  function offset(a,b,k){
    var mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
    var dx=b.x-a.x, dy=b.y-a.y;
    var L=Math.sqrt(dx*dx+dy*dy);
    var nx=-dy/L, ny=dx/L;
    var px=mx+nx*k, py=my+ny*k;
    return [a.x,px,b.x,null,a.y,py,b.y,null];
  }
  var ex=[],ey=[];
  var pairCount = {};
  edges.forEach(function(e){
    var key = e[0]<e[1] ? e[0]+'|'+e[1] : e[1]+'|'+e[0];
    pairCount[key] = (pairCount[key]||0)+1;
    var idx = pairCount[key];
    var a=pos(e[0]),b=pos(e[1]);
    var k = (idx===2) ? 0.18 : (idx===1 ? -0.08 : 0);
    // For straight edges (no duplicates), use simple line; else use curved via midpoint offset
    var seg = offset(a,b,k);
    for (var i=0;i<4;i++) ex.push(seg[i]);
    for (var i=4;i<8;i++) ey.push(seg[i]);
  });
  var t1 = {x:ex, y:ey, mode:'lines', line:{color:'#f59e0b', width:2.5, shape:'spline'}, hoverinfo:'skip', showlegend:false};
  var t2 = {x:nodes.map(function(n){return n.x;}), y:nodes.map(function(n){return n.y;}),
            mode:'markers+text',
            text:nodes.map(function(n){return n.id + ' (deg ' + n.deg + ')';}),
            textposition:'middle center', textfont:{color:'#fff', size:10},
            marker:{size:60, color:'#3b82f6', line:{color:'#1d4ed8', width:2}}, showlegend:false};
  var layout = {paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#ebe6dc'},
    xaxis:{visible:false, range:[-0.5,3.5]}, yaxis:{visible:false, range:[-1,3]},
    margin:{t:50,r:20,b:20,l:20}, height:360,
    annotations:[{x:1.5,y:2.9,text:'All 4 vertices have ODD degree → no Eulerian circuit',
      showarrow:false, font:{color:'#f87171', size:13}}]};
  Plotly.newPlot('plot-l3-konigsberg-en', [t1,t2], layout, {responsive:true, displayModeBar:false});
  var tr = document.getElementById('plot-l3-konigsberg-tr');
  if (tr) Plotly.newPlot('plot-l3-konigsberg-tr', [t1,t2], layout, {responsive:true, displayModeBar:false});
}, 250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this picture shows:</strong> the seven Königsberg bridges as a multigraph on four landmasses (two islands and two banks). Vertex degrees are 5, 3, 3, 3 — every single one is odd, so by Euler's theorem no walk crossing each bridge exactly once and returning home can exist. Graph theory was literally born from this drawing.</div></div>

<div class="l-note"><strong>Historical aside:</strong> Euler did not draw the graph in 1736 — that abstraction came later. His original paper "Solutio problematis ad geometriam situs pertinentis" used long verbal arguments. The picture-with-vertices-and-edges is a 19th-century convenience. But the idea — to discard everything except the connectivity structure — is the foundational move of graph theory and of all topology that followed.</div>

<h2 class="lesson-title">12. Hands-On — Build a Graph, Run BFS and DFS</h2>

<p class="l-text">Time to write 50 lines of NumPy that demonstrate every concept above. The code below builds the running 6-vertex graph, constructs both adjacency representations, runs BFS and DFS, and reports the distances and visit orders. <strong>Paste it into the Pyodide editor on this page and hit Run</strong> — everything you see in the diagrams above will appear as console output.</p>

<div class="calc-example"><div class="example-label">PYTHON — GRAPH FROM SCRATCH (paste into editor below)</div><div class="example-body"><pre style="white-space:pre-wrap;font-family:'Geist Mono',monospace;font-size:0.9rem;background:rgba(20,25,35,0.6);padding:1rem;border-radius:6px;color:#cbd5e1;margin:0">import numpy as np
from collections import deque

# 1. Define the running graph as an edge list
edges = [('A','B'),('A','D'),('B','C'),('B','E'),
         ('C','E'),('D','E'),('D','F'),('E','F')]
verts = sorted(set([v for e in edges for v in e]))
idx   = {v:i for i,v in enumerate(verts)}
n     = len(verts)

# 2. Build adjacency MATRIX (n x n) and adjacency LIST
A = np.zeros((n,n), dtype=int)
adj = {v:[] for v in verts}
for u,v in edges:
    A[idx[u], idx[v]] = 1; A[idx[v], idx[u]] = 1
    adj[u].append(v);     adj[v].append(u)

print("Adjacency matrix (rows/cols =", verts, "):")
print(A)
print("\\nAdjacency list:")
for v in verts: print(f"  {v}: {sorted(adj[v])}")

# Handshake lemma check
deg = {v: len(adj[v]) for v in verts}
print(f"\\nDegrees: {deg}")
print(f"Sum of degrees = {sum(deg.values())}  ==  2|E| = {2*len(edges)}  ?",
      sum(deg.values()) == 2*len(edges))

# 3. BFS from 'A' — returns shortest-path distance dict
def bfs(start):
    dist = {start: 0}
    order = []
    q = deque([start])
    while q:
        u = q.popleft(); order.append(u)
        for v in sorted(adj[u]):
            if v not in dist:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist, order

dist, bfs_order = bfs('A')
print(f"\\nBFS from A — visit order: {bfs_order}")
print(f"BFS shortest-path distances: {dist}")

# 4. DFS from 'A' — also detects cycles via back edges
def dfs(start):
    visited, order, has_cycle = set(), [], [False]
    parent = {start: None}
    def rec(u):
        visited.add(u); order.append(u)
        for v in sorted(adj[u]):
            if v not in visited:
                parent[v] = u; rec(v)
            elif parent[u] != v:
                has_cycle[0] = True
    rec(start)
    return order, has_cycle[0]

dfs_order, cycle = dfs('A')
print(f"\\nDFS from A — visit order: {dfs_order}")
print(f"Graph contains a cycle? {cycle}")
print("\\n(BFS and DFS visit the same vertices but in very different orders.)")</pre></div></div>

<div class="l-note"><strong>What to try next:</strong> change the edge list to a tree (delete edges DE, CE, EF until you have only 5 edges and no cycles) — DFS should now say "no cycle". Try BFS from F and compare distances. Build an asymmetric digraph by replacing one-way edges and watch how the adjacency matrix becomes non-symmetric.</div>

<h2 class="lesson-title">Recap and What's Next</h2>

<p class="l-text">A graph is the structure of "X relates to Y". You now have:</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>G = (V, E). Directed vs undirected, weighted vs unweighted. Multigraph allows duplicates; simple graphs forbid them.</li>
<li>Three storage formats: adjacency matrix (O(n²), O(1) lookup), adjacency list (O(n+m), best for sparse), edge list (cheapest, worst for queries).</li>
<li>Handshake lemma: Σ deg(v) = 2|E|, so the number of odd-degree vertices is always even.</li>
<li>BFS uses a queue, explores by layers, gives shortest paths in unweighted graphs, runs in O(n+m).</li>
<li>DFS uses a stack/recursion, gives discovery/finish timestamps, and solves topological sort, cycle detection, SCCs, and bridges in O(n+m).</li>
<li>Eulerian (visit every edge) is polynomial; Hamiltonian (visit every vertex) is NP-hard — a one-word change in the problem statement changes everything.</li>
<li>Graphs are central in 2026 AI: GraphRAG, knowledge graphs, dependency parses, scene graphs, GNN bridge in L5.</li>
</ul></div>

<p class="l-text"><strong>Next lesson (L4 — Trees):</strong> we specialise to the most tractable graph family. Trees, binary trees, traversals (pre/in/post/level), Huffman coding, decision trees, parse trees, and spanning trees (Kruskal, Prim). Then <strong>L5</strong> introduces spectral graph theory (Laplacian eigenvalues, normalised cuts, the bridge to GNNs) and <strong>L6</strong> covers logic, set theory, and proof techniques you will rely on throughout the AI track.</p>`,

tr: `<p class="l-text"><strong>Çizge (graph), ilişkilerin matematiğidir.</strong> İki arkadaş birbirini tanır, iki web sayfası birbirine bağlanır, iki şehir arasında bir yol vardır, iki nöron birlikte ateşlenir, iki kelime aynı cümlede geçer — her biri ikili bir ilişkidir ve bu ilişkilerin bütün ağı bir çizgedir. Resmi soyutlarsanız geriye sadece bir nokta kümesi ve bu noktaların hangilerinin bağlı olduğunu söyleyen çizgiler kalır. Noktaları da soyutlarsanız bilgisayar biliminin en evrensel veri yapılarından birini elinizde tutarsınız. Paket yönlendirmeden web sayfası sıralamasına, GraphRAG ile belge erişimine kadar bu derste öğreneceğiniz aynı algoritmalar bugün her yerde çalışıyor.</p>

<p class="l-text">Önce formel tanım, sonra defalarca karşınıza çıkacak isimli aileler (tam çizge, döngü, iki parçalı, ağaç, DAG), ardından bilgisayarın bir çizgeyi sakladığı üç yöntemin karşılaştırılması. Sonrasında derece sayımı, el sıkışma önsavı, ve yürüyüş/iz/yol/döngü dilini netleştiriyoruz. Dersin ikinci yarısı iki klasik gezme algoritması — <strong>BFS</strong> ve <strong>DFS</strong> — ve bunların birlikte çözdüğü en kısa yollar, topolojik sıralama, döngü tespiti, bağlılık problemleri. Kapanışta 2026'da yapay zekâda çizgelerin gerçekten nerede göründüğüne (bilgi grafları, GraphRAG, bağımlılık ayrıştırması, sahne grafları, L5'teki GNN köprüsü) ve tüm alanın doğuşu olan 1736 Königsberg problemine bakıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Çizgeyi formel olarak tanımla, yönlü/yönsüz/ağırlıklı varyantları ayır, ve isimli aileleri (K_n, C_n, iki parçalı, ağaç, DAG) tanı</li>
<li>Yoğunluk ve hangi sorgulara ihtiyacın olduğuna göre komşuluk matrisi, komşuluk listesi ve kenar listesi arasında seçim yap</li>
<li>El sıkışma önsavını (derece toplamı = 2|E|) uygula ve eşlik sonucunu ispatlarda kullan</li>
<li>BFS ve DFS'yi 20 satırda sıfırdan kodla, elle iz çıkar, ve ağırlıksız çizgelerde en kısa yolları geri kurtar</li>
<li>DFS ile bir DAG'ı topolojik sırala, döngü tespit et, ve güçlü bağlantılı bileşenleri bul</li>
<li>Gerçek YZ sistemlerinde çizge yapılarını tanı: bilgi grafları, GraphRAG erişimi, bağımlılık ayrıştırması, sahne grafları, sosyal ağ analizi</li>
</ul>
</div>

<h2 class="lesson-title">1. Çizge Nedir?</h2>

<div class="calc-highlight"><strong>Tek cümlede:</strong> bir çizge, G = (V, E) çifti; V köşelerin kümesi, E ise hangi köşe çiftlerinin bağlı olduğunu söyleyen kenarların kümesi. Geri kalan her şey süs.</div>

<p class="l-text">Köşeler (vertex/node) sadece etiketlerdir — şehir, kullanıcı, web sayfası, atom, kelime olabilirler. Kenarlar ise köşe çiftleridir. İki büyük varyant kenarların bir yönü olup olmamasından gelir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yönsüz çizge</div><div class="card-body">E, sırasız çiftlerin kümesidir: \\(E \\subseteq \\{ \\{u,v\\} : u,v \\in V \\}\\). \\(\\{u,v\\}\\) kenarı "u ile v bağlıdır" der, asimetri yoktur. Facebook arkadaşlığı yönsüzdür.</div></div>
<div class="calc-card"><div class="card-title">Yönlü çizge (digraph)</div><div class="card-body">E, sıralı çiftlerin kümesidir: \\(E \\subseteq V \\times V\\). \\((u,v)\\) kenarı u'<em>dan</em> v'<em>ye</em> gider; ters yönde değildir. Twitter takipleri, web bağlantıları, "bağlı" ilişkileri yönlüdür.</div></div>
<div class="calc-card"><div class="card-title">Ağırlıklı çizge</div><div class="card-body">Her kenar bir sayı taşır: \\(w: E \\to \\mathbb{R}\\). Sayı mesafe (yollar), maliyet (ağ bağlantıları), güç (korelasyonlar), kapasite (borular) anlamına gelebilir. Gerçek çizgelerin çoğu ağırlıklıdır.</div></div>
<div class="calc-card"><div class="card-title">Çoklu çizge / öz-döngü</div><div class="card-body">Çoklu çizge aynı çift arasında birden fazla kenara izin verir (A'dan B'ye iki uçuş). Öz-döngü, v'den v'ye giden kenardır. Basit çizgelerde ikisi de yasaktır. Aksi söylenmedikçe çoğu algoritma "basit" varsayar.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">FORMEL TANIM</div><div class="formula-main">$$G = (V, E), \\quad |V| = n, \\quad |E| = m$$</div><div class="formula-sub">n köşe sayısı, m kenar sayısı. Çizge algoritmalarının karmaşıklığı neredeyse her zaman n ve m cinsinden verilir (kodda V ve E olarak da yazılır).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yol ağı</div><div class="card-body">Köşeler = kavşaklar, kenarlar = yol parçaları, ağırlıklar = uzunluk veya seyahat süresi. Çift yönlü sokaklar için yönsüz, tek yönlü için yönlü.</div></div>
<div class="calc-card"><div class="card-title">Sosyal ağ</div><div class="card-body">Köşeler = kullanıcılar, kenarlar = arkadaşlıklar (yönsüz) veya takip (yönlü). Facebook'un 2024'teki yaklaşık 3 milyar köşesi var; en büyük bağlı bileşen pratikte herkesi içerir.</div></div>
<div class="calc-card"><div class="card-title">Web bağlantı çizgesi</div><div class="card-body">Köşeler = web sayfaları, kenarlar = köprüler (yönlü). Google'ın PageRank'i bu çizgeyi bir arama motoruna dönüştürdü — normalize komşuluk matrisinin özvektörü (L5'te göreceğiz).</div></div>
<div class="calc-card"><div class="card-title">Bilgi grafı</div><div class="card-body">Köşeler = varlıklar (Einstein, Almanya, fizik), kenarlar = etiketli ilişkiler (doğduğu_yer, alanı). Wikidata'da yaklaşık 110 milyon varlık ve 1.5 milyar kenar var.</div></div>
</div>

<div id="plot-l3-intro-en" class="plotly-graph" style="width:100%;height:380px;display:none;"></div>
<div id="plot-l3-intro-tr" class="plotly-graph" style="width:100%;height:380px;"></div>

<div class="calc-graph"><div class="graph-caption"><strong>Bu resim ne gösteriyor:</strong> 6 köşeli {A,B,C,D,E,F} ve 8 kenarlı küçük yönsüz bir çizge. Aşağıda BFS ve DFS izlerinde aynı çizgeyi yeniden kullanacağız ki aynı girdinin nasıl farklı gezme sıraları ürettiğini görebilesin.</div></div>

<h2 class="lesson-title">2. Sıkça Karşılaşacağın Özel Çizgeler</h2>

<p class="l-text">Bir avuç çizge ailesi o kadar sık görünür ki isimleri vardır. Bunları bilmek her seferinde özelliklerini yeniden çıkarmaktan seni kurtarır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tam çizge K_n</div><div class="card-body">Her köşe çifti bağlıdır. \\(\\binom{n}{2} = n(n-1)/2\\) kenarı vardır. K_4 bir dörtyüzlüdür; K_5, düzlemde kesişmeden çizilemeyen en küçük çizgedir.</div></div>
<div class="calc-card"><div class="card-title">Döngü C_n</div><div class="card-body">n köşe bir halka oluşturur, n kenar. C_3 üçgen, C_4 kare. En basit ağaç-olmayan çizge.</div></div>
<div class="calc-card"><div class="card-title">Yol P_n</div><div class="card-body">n köşe sıra hâlinde, n-1 kenar. Bir kenarı silinmiş döngü. Bir zinciri, sadece komşu geçişleri olan n durumlu Markov zincirini modeller.</div></div>
<div class="calc-card"><div class="card-title">Yıldız K_{1,n}</div><div class="card-body">Bir merkez köşe n yaprağa bağlı. Hub-and-spoke topolojisini (bir sunucu, n istemci) modeller.</div></div>
<div class="calc-card"><div class="card-title">İki parçalı çizge</div><div class="card-body">Köşeler U ve W diye iki kümeye ayrılır; her kenarın bir ucu U'da bir ucu W'dedir. Eşleşmeyi (işler ↔ işçiler), öneri sistemlerini (kullanıcılar ↔ ürünler) modeller; BFS ile 2-renklendirme ile tespit edilir.</div></div>
<div class="calc-card"><div class="card-title">Ağaç</div><div class="card-body">Bağlı, döngüsüz, n-1 kenar. Herhangi iki köşe arasında tek yol vardır. Örnekler: dosya sistemi, karar ağacı, ayrıştırma ağacı, sözdizimi ağacı. Bütün bir sonraki ders (L4) ağaçlar üzerine.</div></div>
<div class="calc-card"><div class="card-title">DAG (Yönlü Asiklik Çizge)</div><div class="card-body">Yönlü, yönlü döngüsü yok. Bağımlılıkları modeller (makefile'lar, ders ön koşulları, sinir ağı hesap grafları). Daima bir topolojik sıralamayı kabul eder.</div></div>
<div class="calc-card"><div class="card-title">Düzlemsel çizge</div><div class="card-body">Düzlemde kenarlar kesişmeden çizilebilir. K_5 ve K_{3,3} yasak minor'lerdir (Kuratowski 1930). Haritalar ve devre kartları düzlemseldir.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">KENAR SAYILARI</div><div class="formula-main">$$|E(K_n)| = \\binom{n}{2}, \\quad |E(C_n)| = n, \\quad |E(\\text{n köşeli ağaç})| = n - 1$$</div><div class="formula-sub">Ağaç, en seyrek bağlı çizgedir; K_n ise en yoğun basit çizgedir. Gerçek çizgeler arada bir yerdedir ama genelde "seyrek"e yakın — Facebook'ta 3 milyar kullanıcı içinde ortalama 340 arkadaş, yani yoğunluk pratikte sıfırdır.</div></div>

<div class="l-note"><strong>YZ açısından neden önemli:</strong> iki parçalı çizge, her öneri sisteminin yapısıdır. DAG, her PyTorch hesap grafının ve her Airflow iş akışının yapısıdır. Ağaç, her ayrıştırma ağacının ve her karar ağacının yapısıdır. Aileyi tanımak doğru algoritmaya uzanmana izin verir.</div>

<h2 class="lesson-title">3. Komşuluk Temsilleri</h2>

<p class="l-text">Kafanızdaki çizge nokta ve çizgidir; bellekteki çizge sayı ve göstericidir. Üç standart kodlama, her birinin kendi takası var.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Komşuluk matrisi</div><div class="card-body">\\(n \\times n\\) bir A matrisi; (i,j) kenarı varsa \\(A[i][j] = 1\\), yoksa 0. Yönsüzse simetrik. Ağırlıklı için ağırlığı sakla. <strong>Alan O(n²)</strong>; "u ile v komşu mu?" O(1).</div></div>
<div class="calc-card"><div class="card-title">Komşuluk listesi</div><div class="card-body">Her v köşesi için komşularının listesi. <strong>Alan O(n + m)</strong>; "v'nin komşuları" O(deg(v)); "u ile v komşu mu?" O(deg(v)).</div></div>
<div class="calc-card"><div class="card-title">Kenar listesi</div><div class="card-body">Sadece (u, v) çiftlerinin (ve ağırlıkların) listesi. <strong>Alan O(m)</strong>. Diskten okumak/yazmak en ucuzu; "v'nin komşuları" sorgusu için kötü (tüm kenarları taramalı). Çizge veritabanları ve Kruskal MST tarafından kullanılır.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">PRATİK KURAL</div><div class="formula-main">$$\\text{matris ancak ve ancak } m = \\Theta(n^2), \\quad \\text{liste ancak ve ancak } m = O(n \\log n)$$</div><div class="formula-sub">Yoğun çizgeler (çoğu çift bağlı) matrisi tercih eder; seyrek çizgeler (m, n'e yakın) listeyi tercih eder. Gerçek dünya çizgeleri neredeyse her zaman seyrektir, dolayısıyla komşuluk listesi pratikte kazanır.</div></div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">KOMŞULUK MATRİSİ — ARTI</div>
<div class="compare-item">• O(1) kenar sorgusu</div>
<div class="compare-item">• Matris cebri: A^k, k uzunluklu yürüyüşleri sayar</div>
<div class="compare-item">• Spektral yöntemlerle iyi uyuşur (L5)</div>
<div class="compare-item">• NumPy'da kodlaması kolay</div>
</div>
<div class="compare-col"><div class="compare-title">KOMŞULUK MATRİSİ — EKSİ</div>
<div class="compare-item">• Seyrek çizge için bile O(n²) alan</div>
<div class="compare-item">• Komşuları dolaşmak O(n), O(deg) değil</div>
<div class="compare-item">• 1M köşe = 1 TB matris — uygulanamaz</div>
</div>
</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">KOMŞULUK LİSTESİ — ARTI</div>
<div class="compare-item">• O(n + m) alan — gerçek çizgelere sığar</div>
<div class="compare-item">• BFS/DFS O(n + m); yapıya uyuyor</div>
<div class="compare-item">• Kenar ekleme/silme kolay</div>
</div>
<div class="compare-col"><div class="compare-title">KOMŞULUK LİSTESİ — EKSİ</div>
<div class="compare-item">• O(deg(v)) kenar varlık sorgusu</div>
<div class="compare-item">• Matristen daha az önbellek-dostu</div>
<div class="compare-item">• Doğrudan lineer cebir uygulamak rahatsız</div>
</div>
</div>

<div id="plot-l3-adjmat-en" class="plotly-graph" style="width:100%;height:420px;display:none;"></div>
<div id="plot-l3-adjmat-tr" class="plotly-graph" style="width:100%;height:420px;"></div>

<div class="calc-graph"><div class="graph-caption"><strong>Bu resim ne gösteriyor:</strong> örnek çizgenin 6×6 komşuluk matrisi. Mavi hücreler kenarları gösterir. Çizge yönsüz olduğundan matris simetrik; öz-döngü olmadığı için köşegen sıfır. Bu küçücük çizgede 36 hücre, komşuluk listesindeki 8 girdinin yapacağı işi yapıyor.</div></div>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK — AYNI ÇİZGE, ÜÇ FORMAT</div><div class="example-body">Köşeler V = {A, B, C, D, E, F}. Kenarlar E = {AB, AD, BC, BE, CE, DE, DF, EF}.<br><br>
<strong>Komşuluk listesi</strong> (8 satır, çok kompakt):<br>
A: [B, D]  &nbsp; B: [A, C, E]  &nbsp; C: [B, E]<br>
D: [A, E, F]  &nbsp; E: [B, C, D, F]  &nbsp; F: [D, E]<br><br>
<strong>Kenar listesi</strong> (8 girdi): [(A,B),(A,D),(B,C),(B,E),(C,E),(D,E),(D,F),(E,F)]<br><br>
<strong>Komşuluk matrisi</strong>: yukarıda çizilen 6×6 ızgara. Tüm girdilerin toplamı = 16 = 2 × 8 (her kenar iki kez görünür — bir kez A[i][j] olarak bir kez A[j][i] olarak). Bu "iki kez" el sıkışma önsavının kılıkdeğiştirmiş hâli.</div></div>

<h2 class="lesson-title">4. Derece ve El Sıkışma Önsavı</h2>

<div class="calc-highlight"><strong>Tek cümlede:</strong> her köşeye değen kaç kenar olduğunu toplarsan, her kenarı tam iki kez saymış olursun.</div>

<p class="l-text">Bir v köşesinin <strong>derecesi</strong>, \\(\\deg(v)\\) ile yazılır, v'ye değen kenar sayısıdır. Yönlü çizgede bunu <em>iç derece</em> (içe doğru gelen) ve <em>dış derece</em> (dışa doğru giden) diye ayırırız.</p>

<div class="calc-formula"><div class="formula-label">EL SIKIŞMA ÖNSAVI</div><div class="formula-main">$$\\sum_{v \\in V} \\deg(v) = 2|E|$$</div><div class="formula-sub">Her kenarın tam iki ucu vardır; o yüzden her birinin derecesine 1 katkı yapar. Tüm köşeler üzerinde topla ve 2|E| elde et. Sıradanca doğru, şaşırtıcı derecede faydalı.</div></div>

<p class="l-text">Önsavın olimpiyat sorularında ve ispatlarda boy gösteren ünlü bir sonucu vardır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">Tek dereceli köşe sayısı her zaman çifttir. Neden? Derece toplamı = 2|E| çift. Eğer tek sayıda terim tek olsaydı, toplam tek olurdu. Çelişki.</div></div>
<div class="calc-card"><div class="card-title">Neden önemli</div><div class="card-body">Yedi Königsberg köprüsünde Eulerian devrenin imkânsızlığını ispatlamada kullanıldı (dört köşenin hepsi tek dereceydi — imkânsız). Hata düzeltme kodlarında ve derece dizisinin geçerliliğini kontrol etmede de kullanılır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK</div><div class="example-body">Çalışan çizgemiz. Dereceler: <br>
deg(A)=2, deg(B)=3, deg(C)=2, deg(D)=3, deg(E)=4, deg(F)=2.<br>
Toplam = 2+3+2+3+4+2 = <strong>16</strong> = 2 × 8 = 2|E|. ✓<br>
Tek dereceli köşe sayısı: B ve D — tam 2, yani çift. ✓</div></div>

<div id="plot-l3-degree-en" class="plotly-graph" style="width:100%;height:340px;display:none;"></div>
<div id="plot-l3-degree-tr" class="plotly-graph" style="width:100%;height:340px;"></div>

<div class="calc-graph"><div class="graph-caption"><strong>Bu resim ne gösteriyor:</strong> çalışan çizgedeki her köşenin derecesi. Kırmızı çubuklar tek, mavi çubuklar çift; el sıkışma önsavının zorladığı gibi tam iki tek dereceli köşe. Toplam yükseklik 16 — kenar sayısının tam iki katı.</div></div>

<h2 class="lesson-title">5. Yürüyüşler, Yollar, Döngüler</h2>

<p class="l-text">Bu dört kelime gündelik konuşmada sıkça birbirinin yerine kullanılır ama formel olarak farklı şeylerdir. Onları netleştirmek ispatları ve karmaşıklık argümanlarını dürüst tutar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yürüyüş (walk)</div><div class="card-body">\\(v_0, v_1, \\dots, v_k\\) dizisi; her ardışık çift bir kenar olmalı. Köşeler ve kenarlar tekrar edebilir. Kısıtlamasız "dolaş".</div></div>
<div class="calc-card"><div class="card-title">İz (trail)</div><div class="card-body">Hiç bir <em>kenar</em>'ın tekrarlanmadığı yürüyüş (köşeler tekrarlayabilir). Eulerian devreler izlerdir.</div></div>
<div class="calc-card"><div class="card-title">Yol (path)</div><div class="card-body">Hiç bir <em>köşe</em>'nin tekrarlanmadığı yürüyüş. Otomatik olarak kenarlar da tekrarlamaz. "En kısa yol" daima budur.</div></div>
<div class="calc-card"><div class="card-title">Döngü (cycle)</div><div class="card-body">Uzunluğu ≥ 3 olan ve başa dönen yol (ilk = son köşe; diğerleri farklı). C_n prototipik döngüdür.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">YÜRÜYÜŞÜN UZUNLUĞU</div><div class="formula-main">$$\\text{uzunluk}(v_0, v_1, \\dots, v_k) = k \\quad (\\text{kenar sayısı, köşe değil})$$</div><div class="formula-sub">Ağırlıklı çizgede uzunluk, yürüyüş boyunca kenar ağırlıklarının toplamıdır. Dikkat: çizge uzunluğu k, k kenar ve k+1 köşe demek.</div></div>

<p class="l-text">Bu terminolojinin bir basamak yukarısında iki ünlü problem var — ve zorluk açısından birbirlerinden çok farklılar:</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">EULERIAN DEVRE — POLİNOM</div>
<div class="compare-item">• <strong>Her kenarı</strong> tam bir kez ziyaret edip başa dön</div>
<div class="compare-item">• Var ancak ve ancak çizge bağlıysa ve her köşe çift dereceyse</div>
<div class="compare-item">• Lineer zamanlı algoritma (Hierholzer 1873)</div>
<div class="compare-item">• Postacı turları, DNA birleştirme</div>
</div>
<div class="compare-col"><div class="compare-title">HAMILTONIAN DÖNGÜ — NP-ZOR</div>
<div class="compare-item">• <strong>Her köşeyi</strong> tam bir kez ziyaret edip başa dön</div>
<div class="compare-item">• Güzel bir karakterizasyonu yok (muhtemelen yok da)</div>
<div class="compare-item">• NP-tam (Karp 1972)</div>
<div class="compare-item">• Gezgin satıcı (ağırlıklı Hamiltonian)</div>
</div>
</div>

<div class="calc-highlight"><strong>Ders:</strong> bir problem ifadesinde "köşe"yi "kenar" ile değiştirmek 1873 ders kitabı alıştırmasını milyon dolarlık açık bir soruya çevirebilir. Çizge problemleri hangi kombinatoryal nesneyi kısıtladığına duyarlıdır.</div>

<h2 class="lesson-title">6. Bağlılık, Bileşenler, Köprüler</h2>

<p class="l-text">Yönsüz bir çizge, her köşe çifti arasında bir yol varsa <strong>bağlı</strong>'dır. Bağlı değilse, <strong>bağlı bileşenlere</strong> bölünür — maksimum bağlı alt çizgeler. Çalışan çizgemizin tek bileşeni var; AB ve AD kenarlarını silersen A kendi başına bir bileşen olur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bağlı bileşen</div><div class="card-body">Yollarla karşılıklı ulaşılabilir maksimum köşe kümesi. Herhangi bir köşeden BFS, tüm bileşeni O(n+m)'de "doldurur"; sonra tüm bileşenleri bulmak için ziyaret edilmemiş başlangıçlardan tekrarla.</div></div>
<div class="calc-card"><div class="card-title">Güçlü bağlı (yönlü)</div><div class="card-body">Yönlü çizgede, her çift için u'dan v'ye <em>ve</em> v'den u'ya yönlü yol olması. Kosaraju'nun algoritması, iki DFS geçişiyle güçlü bağlı bileşenleri O(n+m)'de bulur.</div></div>
<div class="calc-card"><div class="card-title">Köprü</div><div class="card-body">Silinmesi bileşen sayısını artıran kenar. Yol ağında, çizge anlamında köprü, mühendislik anlamında da köprüdür — tek arıza noktası.</div></div>
<div class="calc-card"><div class="card-title">Eklem noktası</div><div class="card-body">Silinmesi bileşen sayısını artıran köşe. Kritik altyapı düğümleri; ağlardaki SPOF'lar.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">TARJAN'IN KÖPRÜ & KESİM-KÖŞE ALGORİTMASI</div><div class="formula-main">$$T(n, m) = O(n + m)$$</div><div class="formula-sub">Keşif zamanını ve "low link" değerini (geri kenarla ulaşılabilecek en erken ata) izleyen tek DFS geçişi tüm köprüleri ve eklem noktalarını aynı anda bulur. Güzel bir tek-geçişli algoritma.</div></div>

<div id="plot-l3-components-en" class="plotly-graph" style="width:100%;height:380px;display:none;"></div>
<div id="plot-l3-components-tr" class="plotly-graph" style="width:100%;height:380px;"></div>

<div class="calc-graph"><div class="graph-caption"><strong>Bu resim ne gösteriyor:</strong> üç bağlı bileşeni olan 9 köşeli bir çizge, renk kodlu. Hiç bir kenar renk sınırını aşmıyor. Herhangi bir köşeden BFS veya DFS sadece aynı rengin köşelerini keşfeder; bir sonraki bileşeni bulmak için ziyaret edilmemiş bir köşeden yeniden başlatma gerekir.</div></div>

<h2 class="lesson-title">7. Genişlik-Öncelikli Arama (BFS)</h2>

<div class="calc-highlight"><strong>Tek cümlede:</strong> BFS çizgeyi eş merkezli katmanlar hâlinde keşfeder — önce başlangıcın tüm komşuları, sonra onların komşuları, sonra onlarınki; sırada ne ziyaret edileceğini hatırlamak için bir kuyruk kullanır.</div>

<p class="l-text">BFS, ağırlıksız çizgelerde en kısa yolun, web sitelerini katman katman taramanın, sosyal ağlarda bağlantıların en ucuz ağacını bulmanın ("altı derece Kevin Bacon"), ve iki parçalılık testinin arkasındaki algoritmadır. Çalışmasını sağlayan veri yapısı bir FIFO kuyruğudur.</p>

<div class="calc-formula"><div class="formula-label">BFS SÖZDE KODU</div><div class="formula-main">$$\\begin{aligned} &\\text{BFS}(G, s):\\\\ &\\quad \\text{ziyaret} \\leftarrow \\{s\\}; \\; Q \\leftarrow [s]; \\; d[s] \\leftarrow 0 \\\\ &\\quad \\textbf{while } Q \\text{ boş değil}: \\\\ &\\quad\\quad u \\leftarrow Q.\\text{pop\\_front}() \\\\ &\\quad\\quad \\textbf{for } v \\in \\text{komşular}(u): \\\\ &\\quad\\quad\\quad \\textbf{if } v \\notin \\text{ziyaret}: \\\\ &\\quad\\quad\\quad\\quad \\text{ziyaret.add}(v); \\; Q.\\text{push}(v); \\; d[v] \\leftarrow d[u] + 1 \\end{aligned}$$</div><div class="formula-sub">Her köşe kuyruğa en fazla bir kez girer → her kenar en fazla iki kez incelenir → toplam iş O(n + m). d[] dizisi, s'den en kısa yol mesafesidir.</div></div>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK — ÇALIŞAN ÇİZGEDE A'DAN BFS</div><div class="example-body">Komşuluk: A:[B,D] · B:[A,C,E] · C:[B,E] · D:[A,E,F] · E:[B,C,D,F] · F:[D,E]<br><br>
<strong>Adım 0:</strong> Q = [A], ziyaret = {A}, d[A] = 0<br>
<strong>Adım 1:</strong> A'yı çıkar. Komşular B, D ziyaret edilmemiş → kuyruğa al. Q = [B, D]. d[B] = d[D] = 1.<br>
<strong>Adım 2:</strong> B'yi çıkar. Komşular: A (atla, ziyaret edilmiş), C, E. C, E'yi kuyruğa al. Q = [D, C, E]. d[C] = d[E] = 2.<br>
<strong>Adım 3:</strong> D'yi çıkar. Komşular: A (atla), E (atla), F. F'yi kuyruğa al. Q = [C, E, F]. d[F] = 2.<br>
<strong>Adım 4:</strong> C'yi çıkar. Komşular: B (atla), E (atla). Q = [E, F]. <br>
<strong>Adım 5:</strong> E'yi çıkar. Komşular: B, C, D, F — hepsi ziyaret edilmiş. Q = [F].<br>
<strong>Adım 6:</strong> F'yi çıkar. Komşular: D, E — hepsi ziyaret edilmiş. Q boş. <strong>Bitti.</strong><br><br>
A'dan son mesafeler: A→0, B→1, D→1, C→2, E→2, F→2. <br>Ziyaret sırası: A, B, D, C, E, F.</div></div>

<div id="plot-l3-bfs-en" class="plotly-graph" style="width:100%;height:380px;display:none;"></div>
<div id="plot-l3-bfs-tr" class="plotly-graph" style="width:100%;height:380px;"></div>

<div class="calc-graph"><div class="graph-caption"><strong>Bu resim ne gösteriyor:</strong> kaynak A'dan BFS katmanlandırması. Kırmızı katman 0 (kaynağın kendisi), mavi katman 1 (doğrudan komşular), yeşil katman 2 (iki kenar uzak). BFS bu katmanlamanın doğru biçimde en kısa yol mesafesine eşit olmasını garanti eder — herhangi bir ağırlıksız en kısa yol kullanımının temel taşı.</div></div>

<h2 class="lesson-title">8. Derinlik-Öncelikli Arama (DFS)</h2>

<div class="calc-highlight"><strong>Tek cümlede:</strong> DFS, kuyruk yerine yığın (veya özyineleme) kullanarak geri dönmeden önce mümkün olduğunca derine iner.</div>

<p class="l-text">DFS en kısa yolları üretmez ama belki daha zengin bir şey üretir: <strong>keşif ağacı</strong> — geri kenarlar, ileri kenarlar ve çapraz kenarlar hakkında yapısal bilgi ile. Bunlar DFS'nin topolojik sıralama, döngü tespiti, güçlü bağlı bileşenler ve köprüleri çözmesine olanak verir — BFS bunların hiçbirini temiz biçimde yapmaz.</p>

<div class="calc-formula"><div class="formula-label">DFS SÖZDE KODU (ÖZYİNELİ)</div><div class="formula-main">$$\\begin{aligned} &\\text{DFS}(G, u, \\text{ziyaret}): \\\\ &\\quad \\text{ziyaret.add}(u); \\; \\text{disc}[u] \\leftarrow \\text{zaman}++ \\\\ &\\quad \\textbf{for } v \\in \\text{komşular}(u): \\\\ &\\quad\\quad \\textbf{if } v \\notin \\text{ziyaret}: \\\\ &\\quad\\quad\\quad \\text{DFS}(G, v, \\text{ziyaret}) \\\\ &\\quad \\text{fin}[u] \\leftarrow \\text{zaman}++ \\end{aligned}$$</div><div class="formula-sub">Keşif ve bitiş zamanları, DFS'nin bir köşeyi ilk gördüğü / son ayrıldığı zaman damgalarıdır. Bu zamanlar her ağaç-dışı kenarın türünü (geri, ileri, çapraz) söyler; bu da DFS tabanlı birçok algoritmanın temelini oluşturur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ağaç kenarı</div><div class="card-body">DFS'nin yeni bir köşeyi keşfetmek için gerçekten kullandığı kenar. DFS ağacını oluşturur.</div></div>
<div class="calc-card"><div class="card-title">Geri kenar</div><div class="card-body">DFS ağacında bir ataya giden kenar. <strong>Geri kenar ⇔ döngü.</strong> DFS'nin döngüleri O(n+m)'de bu şekilde tespit etmesidir.</div></div>
<div class="calc-card"><div class="card-title">İleri kenar (yönlü çizgeler)</div><div class="card-body">Bir atadan bir torununa, ama ağaç kenarı olmayan kenar (zaten keşfedilmiş).</div></div>
<div class="calc-card"><div class="card-title">Çapraz kenar (yönlü çizgeler)</div><div class="card-body">Ata/torun ilişkisi olmayan köşeler arasında kenar.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK — ÇALIŞAN ÇİZGEDE A'DAN DFS</div><div class="example-body">Komşuların komşuluk listesindeki sırada ziyaret edildiğini varsay. BFS'den nasıl farklı olduğuna dikkat et.<br><br>
<strong>A'yı ziyaret et</strong> (disc=1). B'ye git (ilk komşu).<br>
<strong>B'yi ziyaret et</strong> (disc=2). A'ya git? Ziyaret edilmiş. C'ye git.<br>
<strong>C'yi ziyaret et</strong> (disc=3). B ziyaret edilmiş. E'ye git.<br>
<strong>E'yi ziyaret et</strong> (disc=4). B, C ziyaret edilmiş. D'ye git.<br>
<strong>D'yi ziyaret et</strong> (disc=5). A, E ziyaret edilmiş. F'ye git.<br>
<strong>F'yi ziyaret et</strong> (disc=6). D, E ziyaret edilmiş. <strong>Geri dön.</strong> fin=7.<br>
D'ye geri, ziyaret edilmemiş yok. fin=8. E'ye geri, yok. fin=9. C'ye geri, fin=10. B'ye geri, fin=11. A'ya geri, fin=12.<br><br>
DFS ziyaret sırası: A, B, C, E, D, F. (BFS A, B, D, C, E, F vermişti — farklı!)<br>
DFS ağaç kenarları: A→B, B→C, C→E, E→D, D→F. Geri kenarlar: D-A, E-B, F-E — geri kenarlar A-B-C-E-D-A ve başka döngüleri gösterir.</div></div>

<div id="plot-l3-dfs-en" class="plotly-graph" style="width:100%;height:380px;display:none;"></div>
<div id="plot-l3-dfs-tr" class="plotly-graph" style="width:100%;height:380px;"></div>

<div class="calc-graph"><div class="graph-caption"><strong>Bu resim ne gösteriyor:</strong> aynı çizge ile DFS ziyaret sırası parantez içinde (açık kırmızı = erken, koyu kırmızı = geç). Yeşil sürekli kenarlar DFS ağacını oluşturur; kırmızı kesik kenarlar döngüleri kapatan ağaç-dışı (geri) kenarlardır. Yukarıdaki BFS katmanlaması ile karşılaştır — aynı çizge, aynı başlangıç köşesi, tamamen farklı gezme.</div></div>

<h2 class="lesson-title">9. DFS Uygulamaları</h2>

<p class="l-text">BFS çoğunlukla mesafelerle ilgilidir. DFS bir İsviçre çakısıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Topolojik sıralama</div><div class="card-body">Bir DAG için, her kenar soldan sağa gidecek şekilde köşeleri listele. Algoritma: çizgeyi DFS ile dolaş, köşeleri <em>ters</em> bitiş-zamanı sırasında çıkar. O(n+m). İnşa sistemleri (make, Bazel, npm), ders programı (CS101'den önce CS201) ve PyTorch'un bir hesap grafını değerlendirme sırasında kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Döngü tespiti</div><div class="card-body">Yönsüz: DFS sırasında herhangi bir geri kenar = döngü. Yönlü: DFS ormanındaki herhangi bir geri kenar = yönlü döngü. Paket yöneticilerinde bağımlılık döngülerini ("pip dairesel bağımlılığı çözemiyor") ve iş akışı DSL'lerindeki sonsuz döngüleri tespit etmek için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Güçlü bağlı bileşenler</div><div class="card-body">Kosaraju (1978): çizgeyi DFS ile dolaş, transpozeyi ters bitiş-zamanı sırasında DFS ile dolaş. İkinci DFS'deki her ağaç bir SCC. O(n+m). Derleyicilerde (SSA inşası), sosyal ağ "kümeleri"nde ve PageRank ön işlemesinde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Köprüler ve eklem noktaları</div><div class="card-body">Tarjan'ın low-link değerleriyle O(n+m) DFS. Ağ güvenilirliğinde (yedekliği nereye eklerim?), İnternet öncesi AT&T yönlendirme analizinde ve altyapı çizgelerinde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">İki parçalılık kontrolü</div><div class="card-body">Aslında BFS ile daha kolay ama DFS ile de olur: çizgeyi katman katman 2-renklendir; herhangi bir kenar iki aynı renkli köşeyi bağlıyorsa çizge iki parçalı değildir.</div></div>
<div class="calc-card"><div class="card-title">Labirent / bulmaca çözme</div><div class="card-body">Geri izlemeli DFS klasik labirent çözücüsü ve kısıt-tatmin algoritmasıdır. "Iteratif derinleştirme" denen varyant DFS'nin belleğini BFS'nin en kısa yol garantisi ile birleştirir.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">TOPOLOJİK SIRA ⇔ DÖNGÜSÜZ</div><div class="formula-main">$$\\text{Yönlü bir çizgenin topolojik sırası vardır} \\iff \\text{DAG'dır}$$</div><div class="formula-sub">Döngü varsa, içindeki hiç bir köşe diğerlerinden önce gelemez; döngü yoksa, DFS-bitiş-tersini al, geçerli bir sıralama elde et. Bu çift yönlü ifade "asılı kalan inşa sistemi" demenin neredeyse her zaman "dairesel bağımlılık ekledin" demek olmasının nedenidir.</div></div>

<h2 class="lesson-title">10. Yapay Zekâda Çizgelerin Uygulamaları (2026)</h2>

<p class="l-text">Bu dersin büyük kısmı klasik ama çizgeler gerçek YZ sistemlerinde gerçekten görünür — ve 2024–2026'da trend aslında <em>daha fazla</em> çizge yönündeydi, daha az değil; çünkü LLM'ler açık bir bilgi yapısına dayandırıldıklarında daha az halüsinasyon görürler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sosyal ağ analizi</div><div class="card-body">BFS, arkadaşların-arkadaşı önerilerini bulur (LinkedIn'in "2. derece"si). DFS artı modülerlik toplulukları bulur (Louvain yöntemi). Merkezilik ölçüleri (PageRank, betweenness) etkiyi sıralar — TikTok akışın kısmen çizge ile sıralanır.</div></div>
<div class="calc-card"><div class="card-title">GraphRAG (Microsoft 2024)</div><div class="card-body">Önce külliyatından bir bilgi grafı oluşturan (varlıklar + ilişkiler bir LLM tarafından çıkarılır), sonra bağlamı toplamak için bunu dolaşan erişim-destekli üretim. Çok-atlamalı sorularda standart vektör RAG'tan daha iyi performans verir; çünkü çizge "X, Y ile ilgilidir, Y de Z ile ilgilidir" ilişkisini açıkça kodlar. 2024-07'den itibaren açık kaynak.</div></div>
<div class="calc-card"><div class="card-title">Bilgi grafları</div><div class="card-body">Wikidata (~110M varlık), ConceptNet (sağduyu), ATOMIC (nedensel/sosyal sağduyu). Her biri olguları (özne, ilişki, nesne) üçlüleri olarak saklar. Modern sistemler (Google Bilgi Paneli, Bing cevap kutuları) KG sorgusunu LLM üretimi ile harmanlar.</div></div>
<div class="calc-card"><div class="card-title">NLP'de bağımlılık ayrıştırması</div><div class="card-body">Her cümle, kenarları etiketli baş-bağımlı ilişkiler (özne, nesne, niteleyici) olan bir ağaçtır (özel çizge). Anlamsal rol etiketlemesinde, bilgi çıkarımında ve GNN tabanlı ayrıştırıcıları beslemekte kullanılır.</div></div>
<div class="calc-card"><div class="card-title">CV'de sahne grafları</div><div class="card-body">Bir görüntü, uzaysal / anlamsal ilişkiler (kenarlar) olan nesnelere (köşeler) ayrıştırılır: "ağaç-yanında bisiklet süren kişi". Görsel soru cevaplamada ve metinden görüntüye dayanaklandırmada (DALL-E 3, Stable Diffusion 3 kontrol ağları) kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Moleküller ve ilaç tasarımı</div><div class="card-body">Atomlar = köşeler, bağlar = kenarlar. GNN'ler (graph neural network) moleküler özellikleri tahmin eder. DeepMind'in AlphaFold'u kalıntı-kalıntı çizgelerinde çalışır; Insilico Medicine'in INS018_055'i (Faz II denemesinde) protein çizgelerinde GNN'lerle keşfedildi.</div></div>
<div class="calc-card"><div class="card-title">GNN'lere köprü (L5 önizleme)</div><div class="card-body">Komşuluk matrisini ve düğüm özelliklerini elinde tuttuğunda, mesaj geçiş katmanlarını üst üste yığabilirsin. Laplasiyen özvektörleri bir "çizge Fourier dönüşümü" verir; spektral GNN'ler bunu doğrudan kullanır. Ders 5 (Spektral Çizge Teorisi) bu köprüyü kurar.</div></div>
<div class="calc-card"><div class="card-title">Ajan bağımlılık grafları</div><div class="card-body">Modern ajan çerçeveleri (LangGraph, CrewAI, AutoGen) çok ajanlı bir sistemi düğümlerin bir DAG'ına derler; çalışma zamanı topolojik olarak yürütmeyi zamanlar. Ajanlar L1'de tartıştığımız "kontrol akışı", formel olarak bir çizgedir.</div></div>
</div>

<div class="l-note"><strong>Pratik özet:</strong> 2026'da oyuncak olmayan bir LLM uygulaması inşa edersen, muhtemelen çizgelere üç kez dokunursun — erişimde (GraphRAG), yapıda (bilgi grafı ekleme) ve orkestrasyonda (ajan DAG'ı). Aşağıda uygulayacağın BFS/DFS, doğrudan görmeyebileceğin üretim sistemlerinin içinde çalışacak.</div>

<h2 class="lesson-title">11. Königsberg Köprüleri — Çizge Teorisi Nasıl Doğdu</h2>

<p class="l-text">Königsberg'in (şimdi Kaliningrad) Pregel nehrindeki iki adayı iki nehir kıyısına bağlayan yedi köprüsü vardı. Pazar bulmacası: <strong>her köprüyü tam bir kez geçerek şehri dolaşıp başlangıcına dönebilir misin?</strong> 1736'da Leonhard Euler dönüş yapamayacağını ispatladı — ve bunu yaparken çizge teorisini icat etti.</p>

<div class="calc-highlight"><strong>Euler'in akıl yürütmesi:</strong> şehri bir çizgeye soyutla. Her karayolu bir köşe; her köprü bir kenar. Soru şuna dönüşür: bu çizgenin Eulerian devresi var mı? Bir devrenin var olması için, bir köşeye bir kenarla girdiğin her seferinde farklı bir kenarla çıkabilmen gerekir. O hâlde her köşenin <em>çift</em> derecesi olmalı. Königsberg'in dört köşesinin hepsi tek dereceli (3, 3, 3, 5). Dolayısıyla: imkânsız.</div>

<div class="calc-formula"><div class="formula-label">EULER'İN TEOREMİ (1736)</div><div class="formula-main">$$\\text{Eulerian devre vardır} \\iff \\text{çizge bağlıdır ve her köşe çift dereceye sahiptir}$$</div><div class="formula-sub">Eulerian iz (başa dönmek zorunda değil), tam 0 veya 2 köşe tek dereceyse vardır. 0-durumu devre verir; 2-durumu tek dereceli köşelerden başlar ve onlarla biter.</div></div>

<div id="plot-l3-konigsberg-en" class="plotly-graph" style="width:100%;height:360px;display:none;"></div>
<div id="plot-l3-konigsberg-tr" class="plotly-graph" style="width:100%;height:360px;"></div>

<div class="calc-graph"><div class="graph-caption"><strong>Bu resim ne gösteriyor:</strong> dört karayolu (iki ada ve iki kıyı) üzerindeki yedi Königsberg köprüsü çoklu-çizge olarak. Köşe dereceleri 5, 3, 3, 3 — her biri tek; o yüzden Euler'in teoremine göre her köprüyü tam bir kez geçip eve dönen yürüyüş yoktur. Çizge teorisi tam anlamıyla bu çizimden doğdu.</div></div>

<div class="l-note"><strong>Tarihsel not:</strong> Euler 1736'da çizgeyi çizmedi — o soyutlama sonra geldi. Orijinal makalesi "Solutio problematis ad geometriam situs pertinentis" uzun sözel argümanlar kullanıyordu. Köşeli-ve-kenarlı resim 19. yüzyıl rahatlığıdır. Ama fikir — bağlılık yapısı dışındaki her şeyi atmak — çizge teorisinin ve onu izleyen tüm topolojinin temel hamlesidir.</div>

<h2 class="lesson-title">12. Eller Çalışsın — Çizge Kur, BFS ve DFS Çalıştır</h2>

<p class="l-text">Yukarıdaki her kavramı gösteren 50 satır NumPy yazma zamanı. Aşağıdaki kod 6-köşeli çalışan çizgemizi kurar, her iki komşuluk temsilini oluşturur, BFS ve DFS çalıştırır ve mesafe ile ziyaret sırasını raporlar. <strong>Bu sayfadaki Pyodide editörüne yapıştır ve Run'a bas</strong> — yukarıdaki diyagramlarda gördüğün her şey konsol çıktısı olarak görünecek.</p>

<div class="calc-example"><div class="example-label">PYTHON — SIFIRDAN ÇİZGE (aşağıdaki editöre yapıştır)</div><div class="example-body"><pre style="white-space:pre-wrap;font-family:'Geist Mono',monospace;font-size:0.9rem;background:rgba(20,25,35,0.6);padding:1rem;border-radius:6px;color:#cbd5e1;margin:0">import numpy as np
from collections import deque

# 1. Çalışan çizgeyi kenar listesi olarak tanımla
edges = [('A','B'),('A','D'),('B','C'),('B','E'),
         ('C','E'),('D','E'),('D','F'),('E','F')]
verts = sorted(set([v for e in edges for v in e]))
idx   = {v:i for i,v in enumerate(verts)}
n     = len(verts)

# 2. Komşuluk MATRİSİ (n x n) ve komşuluk LİSTESİ kur
A = np.zeros((n,n), dtype=int)
adj = {v:[] for v in verts}
for u,v in edges:
    A[idx[u], idx[v]] = 1; A[idx[v], idx[u]] = 1
    adj[u].append(v);     adj[v].append(u)

print("Komşuluk matrisi (satır/sütun =", verts, "):")
print(A)
print("\\nKomşuluk listesi:")
for v in verts: print(f"  {v}: {sorted(adj[v])}")

# El sıkışma önsavı kontrolü
deg = {v: len(adj[v]) for v in verts}
print(f"\\nDereceler: {deg}")
print(f"Derece toplamı = {sum(deg.values())}  ==  2|E| = {2*len(edges)}  ?",
      sum(deg.values()) == 2*len(edges))

# 3. A'dan BFS — en kısa yol mesafe sözlüğünü döndürür
def bfs(start):
    dist = {start: 0}
    order = []
    q = deque([start])
    while q:
        u = q.popleft(); order.append(u)
        for v in sorted(adj[u]):
            if v not in dist:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist, order

dist, bfs_order = bfs('A')
print(f"\\nA'dan BFS — ziyaret sırası: {bfs_order}")
print(f"BFS en kısa yol mesafeleri: {dist}")

# 4. A'dan DFS — geri kenarlar üzerinden döngü de tespit eder
def dfs(start):
    visited, order, has_cycle = set(), [], [False]
    parent = {start: None}
    def rec(u):
        visited.add(u); order.append(u)
        for v in sorted(adj[u]):
            if v not in visited:
                parent[v] = u; rec(v)
            elif parent[u] != v:
                has_cycle[0] = True
    rec(start)
    return order, has_cycle[0]

dfs_order, cycle = dfs('A')
print(f"\\nA'dan DFS — ziyaret sırası: {dfs_order}")
print(f"Çizge döngü içeriyor mu? {cycle}")
print("\\n(BFS ve DFS aynı köşeleri ziyaret eder ama çok farklı sıralarla.)")</pre></div></div>

<div class="l-note"><strong>Sonra dene:</strong> kenar listesini bir ağaca dönüştür (DE, CE, EF kenarlarını sil; sadece 5 kenar kalsın ve döngü olmasın) — DFS artık "döngü yok" demeli. F'den BFS dene ve mesafeleri karşılaştır. Tek yönlü kenarları değiştirerek asimetrik bir digraph kur ve komşuluk matrisinin nasıl simetrik olmaktan çıktığını izle.</div>

<h2 class="lesson-title">Özet ve Sırada Ne Var</h2>

<p class="l-text">Bir çizge, "X, Y ile ilişkilidir"in yapısıdır. Artık elinde:</p>

<div class="calc-highlight"><strong>Temel çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>G = (V, E). Yönlü vs yönsüz, ağırlıklı vs ağırlıksız. Çoklu çizge tekrara izin verir; basit çizgeler yasaklar.</li>
<li>Üç depolama formatı: komşuluk matrisi (O(n²), O(1) sorgu), komşuluk listesi (O(n+m), seyrek için en iyi), kenar listesi (en ucuz, sorgu için en kötü).</li>
<li>El sıkışma önsavı: Σ deg(v) = 2|E|, dolayısıyla tek dereceli köşe sayısı daima çifttir.</li>
<li>BFS bir kuyruk kullanır, katmanlara göre keşfeder, ağırlıksız çizgelerde en kısa yolları verir, O(n+m) çalışır.</li>
<li>DFS bir yığın/özyineleme kullanır, keşif/bitiş zaman damgaları verir, ve topolojik sıralama, döngü tespiti, SCC'leri ve köprüleri O(n+m)'de çözer.</li>
<li>Eulerian (her kenarı ziyaret et) polinomdur; Hamiltonian (her köşeyi ziyaret et) NP-zordur — problem ifadesindeki tek kelime değişikliği her şeyi değiştirir.</li>
<li>Çizgeler 2026 YZ'sinde merkezdedir: GraphRAG, bilgi grafları, bağımlılık ayrıştırması, sahne grafları, L5'teki GNN köprüsü.</li>
</ul></div>

<p class="l-text"><strong>Sonraki ders (L4 — Ağaçlar):</strong> en izlenebilir çizge ailesine özelleşeceğiz. Ağaçlar, ikili ağaçlar, dolaşmalar (pre/in/post/level), Huffman kodlaması, karar ağaçları, ayrıştırma ağaçları ve yayılma ağaçları (Kruskal, Prim). Sonra <strong>L5</strong> spektral çizge teorisine (Laplasiyen özdeğerleri, normalize kesimler, GNN köprüsü) ve <strong>L6</strong> tüm YZ izinde dayanacağın mantığa, küme teorisine ve ispat tekniklerine geçer.</p>`
};
