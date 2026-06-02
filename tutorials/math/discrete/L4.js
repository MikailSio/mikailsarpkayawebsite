window.DISCRETE_L4 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Graph algorithms turn drawings into decisions.</strong> Once we know how to encode roads, networks and dependencies as graphs (Lesson 3), the next step is asking <em>weighted</em> questions: what is the cheapest route from A to B? What is the cheapest set of roads that still connects every town? What is the maximum amount of traffic the road network can deliver before it chokes? Three families of algorithms — shortest paths, minimum spanning trees, and maximum flow — answer these three questions, and together they form the workhorse toolkit of network optimisation.</p>

<p class="l-text">This lesson is hands-on. Every algorithm comes with a concrete six-vertex example you can trace on paper, the pseudocode you would actually implement, the complexity in big-O, and a short note on when to prefer one over the other. We will also see why these classical algorithms are very much alive in 2026: Google Maps still runs a variant of Dijkstra under the hood, OSPF (the routing protocol that keeps your packets moving across the public internet) uses Dijkstra, RIP uses Bellman–Ford, Photoshop's "smart selection" uses min-cut, and the matching engine behind every ad auction or school-placement system uses max-flow on a bipartite graph.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Run Dijkstra's algorithm by hand on a small weighted graph and explain why it needs non-negative weights</li>
<li>Use Bellman–Ford when weights can be negative, and detect negative cycles by looking for a final relaxation that still improves a distance</li>
<li>State the Floyd–Warshall recurrence and recognise when an O(V³) all-pairs solution beats running Dijkstra V times</li>
<li>Build a minimum spanning tree two ways — Kruskal with Union–Find and Prim with a priority queue — and justify both with the cut property</li>
<li>Compute a maximum s-t flow with Ford–Fulkerson and its BFS-disciplined cousin Edmonds–Karp, and read off the min-cut from the residual graph</li>
<li>Map each algorithm to a real-world system: Google Maps, OSPF/RIP, GrabCut image segmentation, bipartite matching, sports elimination</li>
</ul>
</div>

<h2 class="lesson-title">1. Shortest Path: Dijkstra's Algorithm</h2>

<div class="calc-highlight"><strong>The motivating picture.</strong> You are standing at vertex s and want to know the cheapest way to reach every other vertex in a weighted graph (edge weights are travel costs, distances, latencies). Dijkstra's algorithm answers this in a single sweep, greedily expanding the closest unsettled vertex at every step. As long as every edge weight is non-negative, the answer is provably optimal.</div>

<p class="l-text">Dijkstra's algorithm maintains, for every vertex v, a tentative distance d[v] which is "the cheapest cost from s to v we have found so far." We also keep a set S of <em>settled</em> vertices whose distance is final. Initially d[s] = 0, d[v] = ∞ for all other vertices, and S is empty. At each step we pick the unsettled vertex u with the smallest d[u], settle it (add it to S), and <em>relax</em> every outgoing edge (u, v) — meaning, check whether routing through u gives a cheaper path to v.</p>

<div class="calc-formula"><div class="formula-label">RELAXATION STEP</div><div class="formula-main">$$d[v] \\leftarrow \\min\\bigl(d[v],\\; d[u] + w(u,v)\\bigr)$$</div><div class="formula-sub">Read: "if going through u is shorter than the route we already know to v, update."</div></div>

<p class="l-text">Concretely:</p>

<div class="code-wrap"><div class="code-label"><span>DIJKSTRA — PSEUDOCODE</span></div><pre class="code-block"><code><span class="kw">function</span> <span class="fn">dijkstra</span>(G, s):
    <span class="kw">for</span> v <span class="kw">in</span> G.V: d[v] = <span class="num">infty</span>
    d[s] = <span class="num">0</span>
    PQ = priority_queue of (d[v], v); insert (0, s)
    settled = empty set
    <span class="kw">while</span> PQ not empty:
        (du, u) = PQ.<span class="fn">extract_min</span>()
        <span class="kw">if</span> u <span class="kw">in</span> settled: <span class="kw">continue</span>     <span class="cm"># lazy deletion</span>
        settled.<span class="fn">add</span>(u)
        <span class="kw">for</span> (v, w) <span class="kw">in</span> G.<span class="fn">neighbors</span>(u):
            <span class="kw">if</span> du + w &lt; d[v]:
                d[v] = du + w
                parent[v] = u
                PQ.<span class="fn">insert</span>((d[v], v))
    <span class="kw">return</span> d, parent</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Binary heap</div><div class="card-body">Each extract-min costs O(log V), each relaxation may insert into PQ, total O((V + E) log V). The default for almost all real implementations.</div></div>
<div class="calc-card"><div class="card-title">Fibonacci heap</div><div class="card-body">Decrease-key in amortised O(1), giving O(E + V log V). Lovely on paper, rarely worth the constant factor in practice — only matters for very dense graphs.</div></div>
<div class="calc-card"><div class="card-title">Array (no heap)</div><div class="card-body">Scan all unsettled vertices each round: O(V²). Best when E is already close to V² (dense graphs), or when V is small.</div></div>
<div class="calc-card"><div class="card-title">Correctness invariant</div><div class="card-body">When u is extracted with smallest d[u], d[u] is already optimal. Why? Any other path to u must first leave the settled set through some unsettled w with d[w] &gt;= d[u], plus non-negative remaining edges &gt;= 0.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — 6-VERTEX GRAPH</div><div class="example-body">Edges (undirected, weighted): A-B (4), A-C (2), B-C (1), B-D (5), C-D (8), C-E (10), D-E (2), D-F (6), E-F (3). Run Dijkstra from A.<br><br><strong>Init.</strong> d[A]=0, others ∞. PQ: (0, A).<br><br><strong>Extract A.</strong> Relax: d[B]=4, d[C]=2.<br><strong>Extract C (d=2).</strong> Relax: d[B]=min(4, 2+1)=3, d[D]=2+8=10, d[E]=2+10=12.<br><strong>Extract B (d=3).</strong> Relax: d[D]=min(10, 3+5)=8.<br><strong>Extract D (d=8).</strong> Relax: d[E]=min(12, 8+2)=10, d[F]=8+6=14.<br><strong>Extract E (d=10).</strong> Relax: d[F]=min(14, 10+3)=13.<br><strong>Extract F (d=13).</strong> Nothing improves.<br><br><strong>Final distances:</strong> A→A: 0, A→B: 3, A→C: 2, A→D: 8, A→E: 10, A→F: 13. The shortest A→F path is A → C → B → D → E → F.</div></div>

<div class="calc-graph"><div id="plot-l4-dijkstra-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the 6-vertex example after Dijkstra terminates. Edge labels are weights. Vertex labels show the final shortest distance d[v] from A. Edges on the shortest-path tree (A → C → B → D → E → F) are highlighted in orange; the rest are dimmed.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pos={A:[0,2],B:[1.6,3.2],C:[1.6,0.8],D:[3.4,2.6],E:[3.6,0.4],F:[5.2,1.6]};
var edges=[['A','B',4,false],['A','C',2,true],['B','C',1,true],['B','D',5,true],['C','D',8,false],['C','E',10,false],['D','E',2,true],['D','F',6,false],['E','F',3,true]];
var traces=[];var ann=[];
for(var i=0;i<edges.length;i++){var e=edges[i];var p1=pos[e[0]];var p2=pos[e[1]];var hi=e[3];
traces.push({x:[p1[0],p2[0]],y:[p1[1],p2[1]],mode:'lines',line:{color:hi?'#f59e0b':'rgba(150,150,150,0.4)',width:hi?3.4:1.6},showlegend:false,hoverinfo:'skip'});
ann.push({x:(p1[0]+p2[0])/2,y:(p1[1]+p2[1])/2+0.12,text:String(e[2]),showarrow:false,font:{size:12,color:hi?'#fbbf24':'#aaa'}});}
var d={A:0,B:3,C:2,D:8,E:10,F:13};
var nx=[],ny=[],lab=[];for(var k in pos){nx.push(pos[k][0]);ny.push(pos[k][1]);lab.push(k+' (d='+d[k]+')');}
traces.push({x:nx,y:ny,mode:'markers+text',text:lab,textposition:'top center',textfont:{color:'#ebe6dc',size:13},marker:{size:22,color:'#3b82f6',line:{color:'#fff',width:1.4}},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[-0.6,5.9]},yaxis:{visible:false,range:[-0.2,4]},margin:{t:30,r:20,b:20,l:20},annotations:ann,showlegend:false};
Plotly.newPlot('plot-l4-dijkstra-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Implementation tip.</strong> The pseudocode above uses "lazy deletion" — when we extract a vertex that is already settled, we simply skip it instead of trying to remove the stale entry from the heap. This is the cleanest pattern in Python (heapq has no decrease-key) and adds at most a log factor to the run time.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Trace the algorithm one more time on the same graph, but this time start from F. You should get d[A] = 13, d[E] = 3, d[D] = 5, d[B] = 10, d[C] = 9. (Undirected graph, so the shortest-path tree is just rooted differently.)</div></div>

<h2 class="lesson-title">2. Why Dijkstra Needs Non-Negative Weights</h2>

<div class="calc-highlight"><strong>The greedy choice can fail.</strong> Dijkstra settles a vertex u as soon as it has the smallest tentative distance, betting that no future path through some other unsettled vertex can do better. With a negative edge in play, that bet can lose.</div>

<p class="l-text">Consider the tiny graph: A → B with weight 2, A → C with weight 5, B → C with weight −4. Run Dijkstra from A:</p>

<div class="calc-example"><div class="example-label">COUNTEREXAMPLE</div><div class="example-body">d[A]=0, d[B]=∞, d[C]=∞.<br><br><strong>Extract A.</strong> Relax → d[B]=2, d[C]=5.<br><strong>Extract B (d=2).</strong> Relax B → C: d[C] = min(5, 2 + (−4)) = −2. Settle B.<br><strong>Extract C.</strong> Now d[C] = −2. <em>But</em> Dijkstra had already promised that B was final when it settled — and the only reason it later improved was the negative edge. If the graph had also had an edge C → B with a very negative weight, Dijkstra would have already settled B at d[B] = 2 and missed the better answer.<br><br><strong>Moral:</strong> with non-negative weights, "the closest unsettled vertex is final" is true because any other path must add non-negative weight to a distance that is already at least as big. Negative edges break this monotonicity.</div></div>

<div class="calc-graph"><div id="plot-l4-negative-en" class="plotly-graph" style="height:300px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the 3-vertex counterexample. Dijkstra would extract B first and call its distance final at 2, but the negative edge B → C creates a situation in which an alternative path could later beat a Dijkstra-fixed distance — exactly the invariant the algorithm depends on.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pos={A:[0,1],B:[2,2],C:[2,0]};
var edges=[['A','B',2,'#f59e0b'],['A','C',5,'#f59e0b'],['B','C',-4,'#ef4444']];
var traces=[];var ann=[];
for(var i=0;i<edges.length;i++){var e=edges[i];var p1=pos[e[0]];var p2=pos[e[1]];
traces.push({x:[p1[0],p2[0]],y:[p1[1],p2[1]],mode:'lines',line:{color:e[3],width:2.8},showlegend:false,hoverinfo:'skip'});
ann.push({x:(p1[0]+p2[0])/2,y:(p1[1]+p2[1])/2+0.1,text:'w = '+e[2],showarrow:false,font:{size:13,color:e[3]}});}
var nx=[],ny=[],lab=[];for(var k in pos){nx.push(pos[k][0]);ny.push(pos[k][1]);lab.push(k);}
traces.push({x:nx,y:ny,mode:'markers+text',text:lab,textposition:'middle center',textfont:{color:'#fff',size:15},marker:{size:34,color:'#3b82f6',line:{color:'#fff',width:1.4}},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[-0.5,2.7]},yaxis:{visible:false,range:[-0.6,2.6]},margin:{t:20,r:10,b:10,l:10},annotations:ann,showlegend:false};
Plotly.newPlot('plot-l4-negative-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Where negative weights show up.</strong> They are common in <em>derived</em> graphs: arbitrage cycles in foreign exchange (where −log(rate) gives the weight), reward shaping in reinforcement learning, and cost differences in scheduling. When you see negatives, switch to Bellman–Ford.</div>

<h2 class="lesson-title">3. Bellman–Ford Algorithm</h2>

<div class="calc-highlight"><strong>Brute force, but it works.</strong> Bellman–Ford gives up Dijkstra's greedy ordering and instead simply relaxes <em>every edge</em>, V − 1 times in a row. If the graph has no negative cycle reachable from s, that is enough to find every shortest path. As a bonus, one extra pass detects whether a negative cycle exists.</div>

<div class="code-wrap"><div class="code-label"><span>BELLMAN–FORD — PSEUDOCODE</span></div><pre class="code-block"><code><span class="kw">function</span> <span class="fn">bellman_ford</span>(G, s):
    <span class="kw">for</span> v <span class="kw">in</span> G.V: d[v] = <span class="num">infty</span>
    d[s] = <span class="num">0</span>
    <span class="kw">for</span> i <span class="kw">in</span> 1..|V|-1:
        <span class="kw">for</span> (u, v, w) <span class="kw">in</span> G.E:
            <span class="kw">if</span> d[u] + w &lt; d[v]:
                d[v] = d[u] + w
                parent[v] = u
    <span class="cm"># one extra pass to detect a negative cycle</span>
    <span class="kw">for</span> (u, v, w) <span class="kw">in</span> G.E:
        <span class="kw">if</span> d[u] + w &lt; d[v]:
            <span class="kw">raise</span> <span class="str">"negative cycle reachable from s"</span>
    <span class="kw">return</span> d, parent</code></pre></div>

<p class="l-text">Why V − 1 passes? Any shortest path has at most V − 1 edges (otherwise it revisits a vertex, and revisiting cannot reduce length unless we are inside a negative cycle, which is exactly what the final pass detects). After i passes, every shortest path of length at most i edges has been correctly computed. After V − 1 passes, every shortest path has been correctly computed. Total work: O(V · E).</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SAME 6 VERTICES, ONE NEGATIVE EDGE</div><div class="example-body">Use the L1 graph but change edge B → D from +5 to −1 (and treat the graph as directed for this example).<br><br><strong>Pass 1</strong> (over all edges in fixed order A-B, A-C, B-C, B-D, ...):<br>d[B] = 4, d[C] = 2, then via B-C: d[C] = min(2, 4+1) = 2; via B-D: d[D] = 4 + (−1) = 3; via C-D: d[D] = min(3, 2+8) = 3; via C-E: d[E] = 12; via D-E: d[E] = min(12, 3+2) = 5; via D-F: d[F] = 3+6 = 9; via E-F: d[F] = min(9, 5+3) = 8.<br><br><strong>Pass 2.</strong> Re-relaxing: via A-C → B-D the chain A-C(2)-B(via C-B, w=1, so d[B] = 3) lowers d[B] to 3, which then propagates d[D] = 3 + (−1) = 2, d[E] = 2 + 2 = 4, d[F] = 4 + 3 = 7. Continue until no edge improves anything.<br><br><strong>Final distances:</strong> d = {A:0, B:3, C:2, D:2, E:4, F:7}. Dijkstra would have given the wrong answer because the negative B→D edge let us reach D more cheaply by paying for a longer "approach."</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">When to prefer</div><div class="card-body">Use Bellman–Ford whenever any edge weight can be negative, or you specifically need negative-cycle detection.</div></div>
<div class="calc-card"><div class="card-title">When not to</div><div class="card-body">With all non-negative weights, Dijkstra is faster: O((V + E) log V) versus O(V·E). On a sparse road network with millions of edges, the gap is huge.</div></div>
<div class="calc-card"><div class="card-title">Distance-vector routing</div><div class="card-body">RIP, the classic interior gateway protocol, is essentially distributed Bellman–Ford — each router stores tentative distances to every destination and exchanges them with neighbours.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If after V − 1 passes you try one more pass and at least one d[v] still drops, the graph contains a negative cycle reachable from s. Make sure you can articulate why this single extra pass is enough — it is a one-line proof that uses the "at most V − 1 edges in a simple path" idea.</div></div>

<h2 class="lesson-title">4. All-Pairs Shortest Paths: Floyd–Warshall</h2>

<div class="calc-highlight"><strong>Solving every-to-every in a single triple loop.</strong> When you need shortest paths between <em>every pair</em> of vertices and the graph is small-to-medium and dense, Floyd–Warshall is the cleanest answer. It is built on a single tiny dynamic-programming idea.</div>

<p class="l-text">Let <em>d<sub>k</sub>[i][j]</em> be the length of the shortest path from i to j that uses only vertices from {1, ..., k} as intermediates. Then:</p>

<div class="calc-formula"><div class="formula-label">FLOYD–WARSHALL RECURRENCE</div><div class="formula-main">$$d_k[i][j] = \\min\\bigl(d_{k-1}[i][j],\\; d_{k-1}[i][k] + d_{k-1}[k][j]\\bigr)$$</div><div class="formula-sub">Either we do not use vertex k as an intermediate, or we do — passing through k once.</div></div>

<div class="code-wrap"><div class="code-label"><span>FLOYD–WARSHALL — PSEUDOCODE</span></div><pre class="code-block"><code><span class="kw">function</span> <span class="fn">floyd_warshall</span>(W):     <span class="cm"># W = V x V weight matrix, inf if no edge</span>
    d = <span class="fn">copy</span>(W)
    <span class="kw">for</span> k <span class="kw">in</span> 1..V:
        <span class="kw">for</span> i <span class="kw">in</span> 1..V:
            <span class="kw">for</span> j <span class="kw">in</span> 1..V:
                <span class="kw">if</span> d[i][k] + d[k][j] &lt; d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    <span class="kw">return</span> d</code></pre></div>

<p class="l-text">Three nested loops give O(V³) time and O(V²) space (the array can be updated in place; the textbook proof shows the in-place update is still correct). Compare with running Dijkstra from every vertex: O(V · (V + E) log V) = O(V·E log V) for sparse graphs. Floyd–Warshall wins when V³ &lt; V·E log V, i.e. when the graph is roughly as dense as V² edges or denser.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Handles negatives</div><div class="card-body">Yes, as long as no negative cycles. (Negative cycle ⇔ some d[i][i] becomes negative.)</div></div>
<div class="calc-card"><div class="card-title">Transitive closure</div><div class="card-body">If you replace + by OR and min by AND, the same loops compute the reachability relation (Warshall's algorithm).</div></div>
<div class="calc-card"><div class="card-title">Centrality</div><div class="card-body">A full distance matrix lets you compute closeness centrality, eccentricity, diameter, and other graph metrics in one shot.</div></div>
</div>

<h2 class="lesson-title">5. Minimum Spanning Tree — The Problem</h2>

<div class="calc-highlight"><strong>Connect everything as cheaply as possible.</strong> You have a connected weighted graph G — think of cities you want to wire up with fibre cable, or sensors you want to connect with serial links, or houses to which the local utility must run a single backbone. The minimum spanning tree (MST) is the cheapest subset of edges that still connects every vertex. By definition the MST has exactly |V| − 1 edges and contains no cycles.</div>

<p class="l-text"><strong>Why a tree?</strong> If we had |V| edges or more, the subgraph would contain a cycle — and we could delete the heaviest edge of the cycle without losing connectivity, reducing total cost. Iterating, the optimum is acyclic, i.e. a tree.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Network design</div><div class="card-body">Laying telephone cable, water pipes, or fibre to connect cities at minimum total length is the original 1926 motivation (Otakar Borůvka in Moravia).</div></div>
<div class="calc-card"><div class="card-title">Clustering</div><div class="card-body">Cut the k − 1 heaviest edges of an MST and you get a k-cluster partition (the basis of single-link hierarchical clustering).</div></div>
<div class="calc-card"><div class="card-title">Approximations</div><div class="card-body">MST gives a 2-approximation to the metric Travelling Salesman Problem — solve TSP "well enough" in polynomial time by walking the MST.</div></div>
</div>

<h2 class="lesson-title">6. Kruskal's Algorithm</h2>

<div class="calc-highlight"><strong>Sort edges, add the cheapest one that does not close a cycle.</strong> This is the most "obvious" greedy strategy for MST, and it works. The bookkeeping question — "does adding this edge create a cycle?" — is exactly what the Union–Find data structure was invented to answer.</div>

<div class="code-wrap"><div class="code-label"><span>KRUSKAL — PSEUDOCODE</span></div><pre class="code-block"><code><span class="kw">function</span> <span class="fn">kruskal</span>(G):
    MST = empty set of edges
    UF  = <span class="fn">UnionFind</span>(G.V)
    <span class="kw">for</span> (u, v, w) <span class="kw">in</span> <span class="fn">sort</span>(G.E by w ascending):
        <span class="kw">if</span> UF.<span class="fn">find</span>(u) != UF.<span class="fn">find</span>(v):
            MST.<span class="fn">add</span>((u, v, w))
            UF.<span class="fn">union</span>(u, v)
            <span class="kw">if</span> |MST| == |V| - 1: <span class="kw">break</span>
    <span class="kw">return</span> MST</code></pre></div>

<p class="l-text"><strong>Complexity.</strong> Sorting the E edges costs O(E log E). With path-compression Union–Find, each find/union runs in amortised O(α(V)) — the inverse Ackermann function, effectively constant. Total: O(E log E) = O(E log V).</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SAME 6-VERTEX GRAPH</div><div class="example-body">Edges sorted by weight: BC(1), AC(2), DE(2), EF(3), AB(4), BD(5), DF(6), CD(8), CE(10).<br><br><strong>BC(1).</strong> B and C in different sets → add. Sets: {A}, {B,C}, {D}, {E}, {F}.<br><strong>AC(2).</strong> A and C different → add. Sets: {A,B,C}, {D}, {E}, {F}.<br><strong>DE(2).</strong> Different → add. Sets: {A,B,C}, {D,E}, {F}.<br><strong>EF(3).</strong> Different → add. Sets: {A,B,C}, {D,E,F}.<br><strong>AB(4).</strong> Same set → <em>skip</em> (would close cycle ABC).<br><strong>BD(5).</strong> Different → add. Sets: {A,B,C,D,E,F}. 5 edges, |V|−1, done.<br><br><strong>MST edges:</strong> {BC, AC, DE, EF, BD}. Total weight = 1 + 2 + 2 + 3 + 5 = <strong>13</strong>.</div></div>

<div class="calc-graph"><div id="plot-l4-mst-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the 6-vertex graph with MST edges (weight 13) highlighted in orange. Both Kruskal and Prim (next section) end up with this exact tree because the optimal MST is unique whenever all edge weights are distinct.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pos={A:[0,2],B:[1.6,3.2],C:[1.6,0.8],D:[3.4,2.6],E:[3.6,0.4],F:[5.2,1.6]};
var mst={'A-C':1,'B-C':1,'B-D':1,'D-E':1,'E-F':1};
var edges=[['A','B',4],['A','C',2],['B','C',1],['B','D',5],['C','D',8],['C','E',10],['D','E',2],['D','F',6],['E','F',3]];
var traces=[];var ann=[];
for(var i=0;i<edges.length;i++){var e=edges[i];var p1=pos[e[0]];var p2=pos[e[1]];var key=e[0]+'-'+e[1];var hi=mst[key]?true:false;
traces.push({x:[p1[0],p2[0]],y:[p1[1],p2[1]],mode:'lines',line:{color:hi?'#f59e0b':'rgba(150,150,150,0.35)',width:hi?3.6:1.4},showlegend:false,hoverinfo:'skip'});
ann.push({x:(p1[0]+p2[0])/2,y:(p1[1]+p2[1])/2+0.12,text:String(e[2]),showarrow:false,font:{size:12,color:hi?'#fbbf24':'#999'}});}
var nx=[],ny=[],lab=[];for(var k in pos){nx.push(pos[k][0]);ny.push(pos[k][1]);lab.push(k);}
traces.push({x:nx,y:ny,mode:'markers+text',text:lab,textposition:'middle center',textfont:{color:'#fff',size:14},marker:{size:30,color:'#3b82f6',line:{color:'#fff',width:1.4}},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[-0.6,5.9]},yaxis:{visible:false,range:[-0.2,4]},margin:{t:30,r:20,b:20,l:20},annotations:ann,showlegend:false};
Plotly.newPlot('plot-l4-mst-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Union–Find detail.</strong> The simple "parent pointer" implementation already gives near-linear amortised cost. The two optimisations are <em>union by rank</em> (always attach the smaller tree under the bigger one) and <em>path compression</em> (every time we walk up to find the root, re-point every node on the path directly at the root). Together they give amortised O(α(V)) per operation.</div>

<h2 class="lesson-title">7. Prim's Algorithm</h2>

<div class="calc-highlight"><strong>Grow the tree one vertex at a time.</strong> Prim starts with an arbitrary vertex and repeatedly adds the cheapest edge that connects the current tree to a vertex outside it. Structurally Prim looks exactly like Dijkstra — both use a priority queue keyed on "best known cost to add this vertex" — but the cost being minimised is different: Dijkstra minimises distance from s, Prim minimises edge weight crossing the tree.</div>

<div class="code-wrap"><div class="code-label"><span>PRIM — PSEUDOCODE</span></div><pre class="code-block"><code><span class="kw">function</span> <span class="fn">prim</span>(G, s):
    <span class="kw">for</span> v <span class="kw">in</span> G.V: key[v] = <span class="num">infty</span>
    key[s] = <span class="num">0</span>
    PQ = priority_queue; insert (0, s)
    in_tree = empty set
    MST = []
    <span class="kw">while</span> PQ not empty:
        (k, u) = PQ.<span class="fn">extract_min</span>()
        <span class="kw">if</span> u <span class="kw">in</span> in_tree: <span class="kw">continue</span>
        in_tree.<span class="fn">add</span>(u)
        <span class="kw">if</span> parent[u] is defined: MST.<span class="fn">add</span>((parent[u], u, k))
        <span class="kw">for</span> (v, w) <span class="kw">in</span> G.<span class="fn">neighbors</span>(u):
            <span class="kw">if</span> v <span class="kw">not in</span> in_tree <span class="kw">and</span> w &lt; key[v]:
                key[v] = w
                parent[v] = u
                PQ.<span class="fn">insert</span>((w, v))
    <span class="kw">return</span> MST</code></pre></div>

<p class="l-text">Complexity with a binary heap: O((V + E) log V) — same as Dijkstra.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — RUN PRIM FROM A ON THE SAME GRAPH</div><div class="example-body"><strong>Start.</strong> in_tree = {A}. PQ has (0, A) → extract, then look at neighbours: key[B] = 4 (via AB), key[C] = 2 (via AC).<br><strong>Extract C (k=2).</strong> Add edge AC. Update: BC has weight 1 &lt; key[B]=4 → key[B] = 1 (parent B = C). CD has weight 8, key[D] becomes 8 (parent D = C). CE: key[E] = 10.<br><strong>Extract B (k=1).</strong> Add edge CB. BD = 5 &lt; key[D]=8 → key[D] = 5 (parent D = B).<br><strong>Extract D (k=5).</strong> Add edge BD. DE = 2 &lt; key[E]=10 → key[E] = 2 (parent E = D). DF = 6 → key[F] = 6.<br><strong>Extract E (k=2).</strong> Add edge DE. EF = 3 &lt; key[F]=6 → key[F] = 3 (parent F = E).<br><strong>Extract F (k=3).</strong> Add edge EF.<br><br><strong>MST edges:</strong> AC(2), CB(1), BD(5), DE(2), EF(3). Total = <strong>13</strong>. Same tree as Kruskal — both are correct.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kruskal preferred when</div><div class="card-body">Graph is sparse, edges are already (or easily) sorted, or you have a fast Union–Find implementation lying around.</div></div>
<div class="calc-card"><div class="card-title">Prim preferred when</div><div class="card-body">Graph is dense (you do not want to sort O(V²) edges), or you only need the MST incrementally as the tree grows.</div></div>
<div class="calc-card"><div class="card-title">Borůvka</div><div class="card-body">A third classical algorithm, parallel-friendly: each round, each component picks its cheapest outgoing edge. Useful on GPUs and distributed systems.</div></div>
</div>

<h2 class="lesson-title">8. The Cut Property</h2>

<div class="calc-highlight"><strong>The single theorem that makes Kruskal and Prim work.</strong> A <em>cut</em> of a graph is a partition of the vertex set into two non-empty pieces S and V \\ S. An edge <em>crosses</em> the cut if exactly one endpoint is in S. The cut property says: in any cut, the lightest crossing edge belongs to some MST.</div>

<div class="calc-formula"><div class="formula-label">CUT PROPERTY</div><div class="formula-main">$$\\text{For any cut } (S, V \\setminus S),\\;\\; \\arg\\min\\{w(e):\\, e \\text{ crosses the cut}\\} \\in \\text{MST}$$</div><div class="formula-sub">Choose any partition of the vertices; the cheapest edge with one endpoint on each side is always safe to include.</div></div>

<p class="l-text"><strong>Proof sketch (exchange argument).</strong> Suppose T is an MST and the lightest crossing edge e = (u, v) is not in T. Then T plus e contains a unique cycle (because T is a tree), and that cycle must cross the cut at least twice. Replace any other crossing edge e' on the cycle with e — the result T' is still a spanning tree (we removed and added one edge from one cycle) and has total weight w(T') = w(T) + w(e) − w(e') &lt;= w(T), since e is the lightest crosser. So T' is also an MST and contains e.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kruskal application</div><div class="card-body">When Kruskal considers edge (u, v), the cut is "u's current component vs everything else." If (u, v) is the lightest crosser of this cut (it must be, since all lighter edges have been processed and either added or skipped), it is safe.</div></div>
<div class="calc-card"><div class="card-title">Prim application</div><div class="card-body">The cut is "in_tree vs V \\ in_tree." Prim explicitly extracts the lightest edge crossing this cut every iteration.</div></div>
<div class="calc-card"><div class="card-title">Why uniqueness</div><div class="card-body">If all edge weights are <em>distinct</em>, "lightest" is unambiguous and the MST is unique. With ties, multiple equally-good MSTs may exist.</div></div>
</div>

<h2 class="lesson-title">9. Maximum Flow — The Problem</h2>

<div class="calc-highlight"><strong>How much can the network deliver?</strong> You have a directed graph in which every edge (u, v) has a non-negative <em>capacity</em> c(u, v). Pick a source s and a sink t. A <em>flow</em> assigns a non-negative number f(u, v) ≤ c(u, v) to every edge, with the conservation law that at every internal vertex, total flow in equals total flow out. The maximum-flow problem asks for the largest possible total flow leaving s (equivalently, entering t).</div>

<p class="l-text">Concrete instance: imagine a pipeline network from a refinery (s) to a port (t). Each pipe has a maximum throughput. What is the highest rate at which oil can leave the refinery?</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bipartite matching</div><div class="card-body">Match students to schools: add a super-source s into every student, super-sink t out of every school, all capacities 1. Max-flow equals max matching size.</div></div>
<div class="calc-card"><div class="card-title">Network reliability</div><div class="card-body">"How many edge failures can the network tolerate before s and t are disconnected?" is the min-cut number.</div></div>
<div class="calc-card"><div class="card-title">Sports elimination</div><div class="card-body">Given current standings and remaining games, "can team X still win the division?" reduces to a clever max-flow construction.</div></div>
<div class="calc-card"><div class="card-title">Image segmentation</div><div class="card-body">Pixels become vertices, neighbour similarity becomes capacity, foreground/background priors become s/t edges, and min-cut separates the object — the basis of GrabCut.</div></div>
</div>

<h2 class="lesson-title">10. Ford–Fulkerson Method</h2>

<div class="calc-highlight"><strong>Push flow along any augmenting path, repeat.</strong> An <em>augmenting path</em> in the <em>residual graph</em> is any s-to-t path along which we can still push more flow. The Ford–Fulkerson method: while such a path exists, find one (by any means), push as much flow as the bottleneck allows, and update the residual graph. When no augmenting path remains, the current flow is maximum.</div>

<p class="l-text">The <strong>residual graph</strong> G<sub>f</sub> for a flow f has, for every original edge (u, v) with capacity c and flow f, a forward edge (u, v) with residual capacity c − f, and a backward edge (v, u) with residual capacity f (representing flow we could "undo"). Pushing along a path in G<sub>f</sub> decreases forward residuals and increases backward residuals.</p>

<div class="code-wrap"><div class="code-label"><span>FORD–FULKERSON — PSEUDOCODE</span></div><pre class="code-block"><code><span class="kw">function</span> <span class="fn">ford_fulkerson</span>(G, s, t):
    f[e] = <span class="num">0</span> <span class="kw">for all</span> e
    <span class="kw">while</span> path = <span class="fn">find_augmenting_path</span>(G_f, s, t):
        bottleneck = <span class="fn">min</span>(residual(e) <span class="kw">for</span> e <span class="kw">in</span> path)
        <span class="kw">for</span> e <span class="kw">in</span> path:
            f[e] += bottleneck       <span class="cm"># forward edges</span>
            f[<span class="fn">reverse</span>(e)] -= bottleneck  <span class="cm"># symmetry</span>
    <span class="kw">return</span> f</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Termination (integer capacities)</div><div class="card-body">Every augmenting path increases total flow by at least 1, so the loop runs at most max-flow times. Each iteration is O(E). Total: O(maxflow · E).</div></div>
<div class="calc-card"><div class="card-title">Termination warning</div><div class="card-body">With irrational capacities, badly chosen paths can make Ford–Fulkerson loop forever without converging to the true maximum. With integer capacities, the integer increments save us.</div></div>
<div class="calc-card"><div class="card-title">Why the backward edges</div><div class="card-body">They let later iterations "redirect" earlier flow decisions. Without them, a greedy first augmentation could block the true optimum forever.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">The catastrophic example: a 4-vertex graph s, a, b, t with capacities s→a=100, s→b=100, a→b=1, a→t=100, b→t=100. If Ford–Fulkerson keeps choosing the path s → a → b → t, then s → b → a → t (via backward a→b edge), then s → a → b → t, it can take 200 iterations to terminate. With max-flow 200 that is fine, but inflate the capacities to 10⁹ and you have an algorithm that runs for 2 · 10⁹ iterations on a 4-node graph. Edmonds–Karp fixes this.</div></div>

<h2 class="lesson-title">11. Edmonds–Karp</h2>

<div class="calc-highlight"><strong>Always pick the shortest augmenting path (BFS).</strong> Edmonds–Karp is Ford–Fulkerson with one specific choice for finding paths: breadth-first search, so the augmenting path always has the fewest edges. With this discipline, the algorithm provably terminates in O(V·E) augmentations, giving total O(V·E²) — polynomial regardless of capacity values.</div>

<p class="l-text"><strong>Why BFS makes it polynomial.</strong> Each round, the length of the shortest augmenting path is non-decreasing, and each edge can become "saturated" (used to capacity) on a shortest path at most O(V) times. There are E edges, giving O(V·E) total augmentations.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — 4-NODE FLOW NETWORK</div><div class="example-body">Vertices s, a, b, t with directed edges s→a (cap 3), s→b (cap 2), a→b (cap 2), a→t (cap 2), b→t (cap 3).<br><br><strong>BFS 1.</strong> Shortest s-t path: s → a → t. Bottleneck = min(3, 2) = 2. Push 2. Residuals: s→a 1, a→t 0; backward a→s 2, t→a 2.<br><strong>BFS 2.</strong> Shortest path: s → b → t. Bottleneck = min(2, 3) = 2. Push 2. Residuals: s→b 0, b→t 1; backward b→s 2, t→b 2.<br><strong>BFS 3.</strong> s → a → b → t. Bottleneck = min(1, 2, 1) = 1. Push 1. Residuals: s→a 0, a→b 1, b→t 0.<br><strong>BFS 4.</strong> No s-t path in residual graph. <strong>Max flow = 2 + 2 + 1 = 5.</strong></div></div>

<div class="calc-graph"><div id="plot-l4-flow-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the 4-vertex max-flow network. Edge labels are "flow / capacity." Total flow out of s = 5 = total flow into t (conservation). The min-cut separating {s} from {a, b, t} has capacity 3 + 2 = 5 — equal to the max flow, as the next section's theorem demands. The cut is highlighted with a dashed line.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pos={s:[0,1],a:[2,2],b:[2,0],t:[4,1]};
var edges=[['s','a','3/3'],['s','b','2/2'],['a','b','1/2'],['a','t','2/2'],['b','t','3/3']];
var traces=[];var ann=[];
for(var i=0;i<edges.length;i++){var e=edges[i];var p1=pos[e[0]];var p2=pos[e[1]];
traces.push({x:[p1[0],p2[0]],y:[p1[1],p2[1]],mode:'lines',line:{color:'#10b981',width:2.8},showlegend:false,hoverinfo:'skip'});
ann.push({x:(p1[0]+p2[0])/2,y:(p1[1]+p2[1])/2+0.13,text:e[2],showarrow:false,font:{size:13,color:'#34d399'}});
ann.push({x:(p1[0]+p2[0])/2+(p2[0]-p1[0])*0.18,y:(p1[1]+p2[1])/2+(p2[1]-p1[1])*0.18,text:'>',showarrow:false,font:{size:14,color:'#10b981'}});}
traces.push({x:[1,1],y:[-0.7,2.7],mode:'lines',line:{color:'#ef4444',width:2.2,dash:'dash'},showlegend:false,hoverinfo:'skip'});
ann.push({x:1.05,y:2.55,text:'min-cut (cap 5)',showarrow:false,font:{size:12,color:'#fca5a5'},xanchor:'left'});
var nx=[],ny=[],lab=[];for(var k in pos){nx.push(pos[k][0]);ny.push(pos[k][1]);lab.push(k);}
traces.push({x:nx,y:ny,mode:'markers+text',text:lab,textposition:'middle center',textfont:{color:'#fff',size:15},marker:{size:34,color:'#3b82f6',line:{color:'#fff',width:1.4}},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[-0.6,4.6]},yaxis:{visible:false,range:[-0.9,2.9]},margin:{t:20,r:10,b:10,l:10},annotations:ann,showlegend:false};
Plotly.newPlot('plot-l4-flow-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Faster successors.</strong> Dinic's algorithm runs in O(V²·E), and the modern push-relabel family of algorithms runs in O(V³) or better. Edmonds–Karp is still the cleanest one to teach, and it is more than fast enough for graphs with up to ~10<sup>4</sup> vertices.</div>

<h2 class="lesson-title">12. Max-Flow Min-Cut Theorem</h2>

<div class="calc-highlight"><strong>The most beautiful duality in combinatorial optimisation.</strong> An s-t cut is a partition (S, T) of the vertex set with s ∈ S and t ∈ T. The <em>capacity</em> of the cut is the total capacity of edges going from S to T (forward only — backward edges are free). The theorem: the value of the maximum flow equals the capacity of the minimum cut.</div>

<div class="calc-formula"><div class="formula-label">MAX-FLOW MIN-CUT THEOREM</div><div class="formula-main">$$\\max_f \\, |f| \\;=\\; \\min_{(S,T)} \\, c(S, T)$$</div><div class="formula-sub">Maximum over all valid s-t flows = minimum over all s-t cuts.</div></div>

<p class="l-text"><strong>Proof sketch.</strong> (≤) Any flow value is at most any cut capacity, because every unit of flow from s to t must cross every s-t cut at least once. (≥) When Ford–Fulkerson terminates, let S be the set of vertices reachable from s in the residual graph. Then s ∈ S, t ∉ S (otherwise an augmenting path exists), every forward edge from S to V \\ S is saturated (zero residual), every backward edge from V \\ S to S carries zero flow. So the value of the flow exactly equals the capacity of the cut (S, V \\ S). Both bounds meet — equality.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Algorithmic gift</div><div class="card-body">You get the min-cut as a byproduct of computing the max-flow: the saturated cut at termination is the certificate of optimality.</div></div>
<div class="calc-card"><div class="card-title">LP duality</div><div class="card-body">Max-flow can be written as a linear program; min-cut is exactly its dual. The theorem is a combinatorial instance of strong LP duality.</div></div>
<div class="calc-card"><div class="card-title">König's theorem</div><div class="card-body">In a bipartite graph, max matching size = min vertex cover size — a special case of max-flow min-cut.</div></div>
</div>

<h2 class="lesson-title">13. AI / CS Applications</h2>

<p class="l-text">Graph algorithms are everywhere — not as a fashionable new technique, but as the load-bearing foundation under systems you use every day.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Google Maps routing</div><div class="card-body">Road networks become graphs (intersections = vertices, segments = weighted edges); a Dijkstra variant called <strong>A*</strong> uses a geographic heuristic to expand fewer vertices. Contraction Hierarchies and Customisable Route Planning add precomputed shortcuts and let Google answer queries in milliseconds across continents.</div></div>
<div class="calc-card"><div class="card-title">Internet routing — OSPF</div><div class="card-body">OSPF (Open Shortest Path First) is a link-state protocol: every router floods its local link costs, every router runs <em>Dijkstra</em> on the full graph, and the best next-hop tables update. Most enterprise networks run OSPF or its IS-IS cousin.</div></div>
<div class="calc-card"><div class="card-title">Internet routing — RIP / BGP</div><div class="card-body">RIP uses distance-vector updates (essentially distributed <em>Bellman–Ford</em>). BGP, which glues the public internet together, adds policy on top of a path-vector cousin of Bellman–Ford.</div></div>
<div class="calc-card"><div class="card-title">Image segmentation</div><div class="card-body"><strong>GrabCut</strong>, <strong>GraphCut</strong> and related tools (used in Photoshop's smart selection, Microsoft's Lens, many medical imaging tools) treat pixels as vertices, neighbour similarity as edge weight, foreground/background priors as s/t links — and solve <em>min-cut</em> to separate the object.</div></div>
<div class="calc-card"><div class="card-title">Bipartite matching</div><div class="card-body">Matching students to schools (National Resident Matching Program), drivers to riders, ad bidders to ad slots — all reduce to maximum bipartite matching via <em>max-flow</em> on a graph with a super-source and super-sink.</div></div>
<div class="calc-card"><div class="card-title">Spectral clustering</div><div class="card-body">Lesson 5 will look at clustering as a graph cut problem. The normalised-cut formulation by Shi and Malik (2000) became the standard image segmentation method before deep learning, and the same idea powers many modern community-detection algorithms in social networks.</div></div>
</div>

<div class="l-note"><strong>None of this is "AI" in the marketing sense.</strong> But every modern AI system runs on top of infrastructure (maps, routing, scheduling, matching) that is built on these algorithms. The deep-learning model that recommends your next video would not get there without Dijkstra under the hood of the CDN routing it.</div>

<h2 class="lesson-title">14. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What to play with:</strong> add the edge ("NYC", "STL", 950) to the network and re-run Dijkstra — the direct edge is more expensive than going via Cleveland/Chicago, so the shortest path should not use it. Then make that edge cost 600 and watch the answer change. To see Bellman–Ford handle a negative edge, set ("PIT", "CHI", −50) and observe that Dijkstra would give the wrong d[CHI], while Bellman–Ford gets it right.</p>

<h2 class="lesson-title">15. Complexity Recap — Which Algorithm When?</h2>

<div class="calc-graph"><div id="plot-l4-complex-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> empirical running cost as a function of |V|, on a log–log scale, for a sparse graph with E = 4|V|. Dijkstra (heap) scales nearly linearly, Bellman–Ford has a steeper slope (V·E ≈ V²), and Floyd–Warshall (V³) becomes prohibitive past V = 1000. Use this chart to choose the right tool for the right size.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var V=[];for(var i=1;i<=24;i++)V.push(Math.round(Math.pow(2,i/3)));
var dij=[],bf=[],fw=[];
for(var i=0;i<V.length;i++){var v=V[i];var e=4*v;dij.push((v+e)*Math.log2(v));bf.push(v*e);fw.push(v*v*v);}
var t1={x:V,y:dij,mode:'lines+markers',name:'Dijkstra (heap)',line:{color:'#3b82f6',width:2.4},marker:{size:6}};
var t2={x:V,y:bf,mode:'lines+markers',name:'Bellman–Ford',line:{color:'#f59e0b',width:2.4},marker:{size:6}};
var t3={x:V,y:fw,mode:'lines+markers',name:'Floyd–Warshall',line:{color:'#ef4444',width:2.4},marker:{size:6}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'|V|',type:'log',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'Approximate operations',type:'log',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:70},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l4-complex-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Single-source, no negatives</div><div class="card-body"><strong>Dijkstra.</strong> O((V+E) log V).</div></div>
<div class="calc-card"><div class="card-title">Single-source, with negatives</div><div class="card-body"><strong>Bellman–Ford.</strong> O(V·E). Also detects negative cycles.</div></div>
<div class="calc-card"><div class="card-title">All-pairs, small dense</div><div class="card-body"><strong>Floyd–Warshall.</strong> O(V³). Trivial to code.</div></div>
<div class="calc-card"><div class="card-title">All-pairs, large sparse</div><div class="card-body"><strong>Johnson's algorithm</strong> (Bellman–Ford + Dijkstra V times). O(V·E·log V).</div></div>
<div class="calc-card"><div class="card-title">MST, sparse</div><div class="card-body"><strong>Kruskal</strong> with Union–Find. O(E log V).</div></div>
<div class="calc-card"><div class="card-title">MST, dense</div><div class="card-body"><strong>Prim</strong> with binary heap. O((V+E) log V); with adjacency matrix O(V²).</div></div>
<div class="calc-card"><div class="card-title">Max-flow, general</div><div class="card-body"><strong>Edmonds–Karp.</strong> O(V·E²). Use <strong>Dinic</strong> or push-relabel for very large inputs.</div></div>
</div>

<h2 class="lesson-title">16. Summary &amp; Where Lesson 5 Takes Us</h2>

<p class="l-text">In one lesson we have covered the three pillars of network optimisation:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Shortest paths</div><div class="card-body">Dijkstra (greedy, non-negative), Bellman–Ford (relaxation, handles negatives, detects negative cycles), Floyd–Warshall (all-pairs dynamic programming).</div></div>
<div class="calc-card"><div class="card-title">Minimum spanning trees</div><div class="card-body">Kruskal (sort edges, Union–Find), Prim (grow tree with PQ). Both proven correct by the cut property.</div></div>
<div class="calc-card"><div class="card-title">Maximum flow / minimum cut</div><div class="card-body">Ford–Fulkerson finds augmenting paths in the residual graph; Edmonds–Karp picks them by BFS for a polynomial guarantee. The max-flow min-cut theorem makes the answer self-certifying.</div></div>
</div>

<div class="l-warn"><strong>Coming next (Lesson 5):</strong> spectral graph theory. We will look at the same graphs through the lens of the Laplacian matrix L = D − A, see how its eigenvalues control connectivity and clustering (Cheeger's inequality), and meet spectral clustering — the algorithm that turned graph cuts into a workhorse of unsupervised learning. The path from Lesson 4's combinatorial min-cut to Lesson 5's continuous relaxation is one of the most beautiful bridges in applied mathematics.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Çizge algoritmaları, çizimleri kararlara dönüştürür.</strong> Yolları, ağları ve bağımlılıkları nasıl çizge olarak kodlayacağımızı öğrendikten sonra (Ders 3), sıradaki adım <em>ağırlıklı</em> sorular sormaktır: A'dan B'ye en ucuz rota nedir? Her şehri hâlâ birbirine bağlayan en ucuz yol kümesi hangisidir? Yol ağı tıkanmadan ne kadar trafik taşıyabilir? Üç algoritma ailesi — en kısa yollar, minimum kapsayan ağaçlar ve maksimum akış — bu üç sorunun cevabını verir ve birlikte ağ optimizasyonunun ana iş aracını oluşturur.</p>

<p class="l-text">Bu ders tamamen elimizi kirleteceğimiz türden. Her algoritmanın somut bir 6-tepe örneği var, kağıt üzerinde takip edebileceğin; gerçekten yazacağın türden bir sözde-kod; big-O karmaşıklığı; ve hangisini ne zaman tercih edeceğin üzerine kısa bir not. Bu klasik algoritmaların 2026'da hâlâ çok canlı olduğunu da göreceğiz: Google Haritalar arka planda hâlâ bir Dijkstra varyantı çalıştırır, OSPF (paketlerinin halka açık internette dolaşmasını sağlayan yönlendirme protokolü) Dijkstra kullanır, RIP Bellman–Ford'u kullanır, Photoshop'un "akıllı seçim"i min-cut kullanır ve her reklam müzayedesinin ya da okul yerleştirme sisteminin arkasındaki eşleştirme motoru iki-bölmeli bir çizge üzerinde maks-akış çalıştırır.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Küçük bir ağırlıklı çizge üzerinde Dijkstra algoritmasını elle çalıştırmayı ve neden negatif olmayan ağırlıklara ihtiyacı olduğunu açıklamayı</li>
<li>Ağırlıklar negatif olabildiğinde Bellman–Ford kullanmayı ve son rahatlatma adımının hâlâ bir uzaklığı iyileştirdiğini görerek negatif döngüleri yakalamayı</li>
<li>Floyd–Warshall özyinelemesini ifade etmeyi ve O(V³) tüm-çiftler çözümünün ne zaman V kez Dijkstra'yı geçtiğini fark etmeyi</li>
<li>Minimum kapsayan ağacı iki yolla kurmayı — Birleştir-Bul (Union–Find) ile Kruskal ve öncelik kuyruğu ile Prim — ve ikisini de kesim özelliğiyle gerekçelendirmeyi</li>
<li>Ford–Fulkerson ve onun BFS-disiplinli kuzeni Edmonds–Karp ile maksimum s-t akışını hesaplamayı, sonra artık çizgeden min-cut'ı okumayı</li>
<li>Her algoritmayı gerçek bir sistemle eşleştirmeyi: Google Haritalar, OSPF/RIP, GrabCut görüntü segmentasyonu, iki-bölmeli eşleştirme, spor elemesi</li>
</ul>
</div>

<h2 class="lesson-title">1. En Kısa Yol: Dijkstra Algoritması</h2>

<div class="calc-highlight"><strong>Motive eden resim.</strong> s tepesinde duruyorsun ve ağırlıklı bir çizgede diğer her tepeye gitmenin en ucuz yolunu öğrenmek istiyorsun (kenar ağırlıkları yolculuk maliyetleri, mesafeler, gecikmeler). Dijkstra algoritması bunu tek bir geçişte yanıtlar; her adımda hâlâ yerleşmemiş en yakın tepeyi açgözlü biçimde genişletir. Her kenar ağırlığı negatif olmadığı sürece sonuç kanıtlanabilir biçimde optimaldir.</div>

<p class="l-text">Dijkstra algoritması her tepe v için "şu ana kadar bulduğumuz en ucuz s-v maliyeti" anlamına gelen geçici bir d[v] uzaklığı tutar. Bir de uzaklığı kesinleşmiş <em>yerleşmiş</em> tepelerin oluşturduğu bir S kümesi tutulur. Başlangıçta d[s] = 0, diğer her v için d[v] = ∞ ve S boştur. Her adımda en küçük d[u] değerine sahip yerleşmemiş tepe u seçilir, yerleştirilir (S'ye eklenir) ve giden her (u, v) kenarı <em>rahatlatılır</em> — yani u üzerinden gitmek v'ye daha ucuz mu kontrol edilir.</p>

<div class="calc-formula"><div class="formula-label">RAHATLATMA ADIMI</div><div class="formula-main">$$d[v] \\leftarrow \\min\\bigl(d[v],\\; d[u] + w(u,v)\\bigr)$$</div><div class="formula-sub">Oku: "Eğer u üzerinden gitmek v için bildiğimizden daha ucuzsa güncelle."</div></div>

<p class="l-text">Somut olarak:</p>

<div class="code-wrap"><div class="code-label"><span>DIJKSTRA — SÖZDE KOD</span></div><pre class="code-block"><code><span class="kw">function</span> <span class="fn">dijkstra</span>(G, s):
    <span class="kw">for</span> v <span class="kw">in</span> G.V: d[v] = <span class="num">sonsuz</span>
    d[s] = <span class="num">0</span>
    PQ = oncelik_kuyrugu of (d[v], v); ekle (0, s)
    yerlesmis = bos kume
    <span class="kw">while</span> PQ bos degil:
        (du, u) = PQ.<span class="fn">extract_min</span>()
        <span class="kw">if</span> u <span class="kw">in</span> yerlesmis: <span class="kw">continue</span>     <span class="cm"># tembel silme</span>
        yerlesmis.<span class="fn">add</span>(u)
        <span class="kw">for</span> (v, w) <span class="kw">in</span> G.<span class="fn">neighbors</span>(u):
            <span class="kw">if</span> du + w &lt; d[v]:
                d[v] = du + w
                ata[v] = u
                PQ.<span class="fn">insert</span>((d[v], v))
    <span class="kw">return</span> d, ata</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İkili yığın (binary heap)</div><div class="card-body">Her extract-min O(log V), her rahatlatma PQ'ya bir ekleme yapabilir; toplam O((V + E) log V). Hemen hemen tüm gerçek uygulamalar için varsayılan tercih.</div></div>
<div class="calc-card"><div class="card-title">Fibonacci yığını</div><div class="card-body">Decrease-key amortize edilmiş O(1), toplamda O(E + V log V). Kağıtta güzel, pratikte sabit çarpanı hak ettirmek nadir — yalnızca çok yoğun çizgelerde fark eder.</div></div>
<div class="calc-card"><div class="card-title">Dizi (yığın yok)</div><div class="card-body">Her tur tüm yerleşmemiş tepeleri tara: O(V²). E zaten V²'ye yakın (yoğun çizge) ya da V küçük olduğunda en iyi seçim.</div></div>
<div class="calc-card"><div class="card-title">Doğruluk değişmezi</div><div class="card-body">En küçük d[u] ile u çıkarıldığında d[u] zaten optimaldir. Neden? u'ya başka herhangi bir yol, yerleşmiş kümeden d[w] &gt;= d[u] olan bir yerleşmemiş w üzerinden çıkmak, sonra negatif olmayan kalan kenarlar &gt;= 0 eklemek zorundadır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — 6 TEPELİ ÇİZGE</div><div class="example-body">Kenarlar (yönsüz, ağırlıklı): A-B (4), A-C (2), B-C (1), B-D (5), C-D (8), C-E (10), D-E (2), D-F (6), E-F (3). A'dan Dijkstra çalıştır.<br><br><strong>İlk durum.</strong> d[A]=0, diğerleri ∞. PQ: (0, A).<br><br><strong>A çıkar.</strong> Rahatlat: d[B]=4, d[C]=2.<br><strong>C çıkar (d=2).</strong> Rahatlat: d[B]=min(4, 2+1)=3, d[D]=2+8=10, d[E]=2+10=12.<br><strong>B çıkar (d=3).</strong> Rahatlat: d[D]=min(10, 3+5)=8.<br><strong>D çıkar (d=8).</strong> Rahatlat: d[E]=min(12, 8+2)=10, d[F]=8+6=14.<br><strong>E çıkar (d=10).</strong> Rahatlat: d[F]=min(14, 10+3)=13.<br><strong>F çıkar (d=13).</strong> Hiçbir şey iyileşmez.<br><br><strong>Son uzaklıklar:</strong> A→A: 0, A→B: 3, A→C: 2, A→D: 8, A→E: 10, A→F: 13. En kısa A→F yolu: A → C → B → D → E → F.</div></div>

<div class="calc-graph"><div id="plot-l4-dijkstra-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> Dijkstra sonlandığında 6-tepeli örnek. Kenar etiketleri ağırlıkları, tepe etiketleri A'dan son en kısa uzaklığı d[v] gösterir. En kısa yol ağacındaki kenarlar (A → C → B → D → E → F) turuncu vurgulanmıştır; geri kalanlar soluktur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pos={A:[0,2],B:[1.6,3.2],C:[1.6,0.8],D:[3.4,2.6],E:[3.6,0.4],F:[5.2,1.6]};
var edges=[['A','B',4,false],['A','C',2,true],['B','C',1,true],['B','D',5,true],['C','D',8,false],['C','E',10,false],['D','E',2,true],['D','F',6,false],['E','F',3,true]];
var traces=[];var ann=[];
for(var i=0;i<edges.length;i++){var e=edges[i];var p1=pos[e[0]];var p2=pos[e[1]];var hi=e[3];
traces.push({x:[p1[0],p2[0]],y:[p1[1],p2[1]],mode:'lines',line:{color:hi?'#f59e0b':'rgba(150,150,150,0.4)',width:hi?3.4:1.6},showlegend:false,hoverinfo:'skip'});
ann.push({x:(p1[0]+p2[0])/2,y:(p1[1]+p2[1])/2+0.12,text:String(e[2]),showarrow:false,font:{size:12,color:hi?'#fbbf24':'#aaa'}});}
var d={A:0,B:3,C:2,D:8,E:10,F:13};
var nx=[],ny=[],lab=[];for(var k in pos){nx.push(pos[k][0]);ny.push(pos[k][1]);lab.push(k+' (d='+d[k]+')');}
traces.push({x:nx,y:ny,mode:'markers+text',text:lab,textposition:'top center',textfont:{color:'#ebe6dc',size:13},marker:{size:22,color:'#3b82f6',line:{color:'#fff',width:1.4}},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[-0.6,5.9]},yaxis:{visible:false,range:[-0.2,4]},margin:{t:30,r:20,b:20,l:20},annotations:ann,showlegend:false};
Plotly.newPlot('plot-l4-dijkstra-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Uygulama ipucu.</strong> Yukarıdaki sözde kod "tembel silme" kullanır — zaten yerleşmiş bir tepeyi çıkardığımızda, yığından bayat girişi çıkarmaya çalışmak yerine atlarız. Bu Python'da en temiz örüntüdür (heapq'da decrease-key yoktur) ve çalışma zamanına en fazla bir log çarpanı ekler.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Algoritmayı aynı çizge üzerinde bir kez daha izle, ama bu kez F'den başla. Sonuç: d[A] = 13, d[E] = 3, d[D] = 5, d[B] = 10, d[C] = 9. (Yönsüz çizge olduğu için en kısa yol ağacı yalnızca farklı bir kökten çiziliyor.)</div></div>

<h2 class="lesson-title">2. Dijkstra Neden Negatif Olmayan Ağırlıklara İhtiyaç Duyar</h2>

<div class="calc-highlight"><strong>Açgözlü seçim hata yapabilir.</strong> Dijkstra, bir tepeyi en küçük geçici uzaklığa sahip olduğu anda yerleştirir; bu hareket başka hiçbir yerleşmemiş tepeden geçen gelecekteki bir yolun daha iyisini yapamayacağı iddiasıdır. Sahadaki bir negatif kenar bu iddiayı kaybettirebilir.</div>

<p class="l-text">Şu küçük çizgeyi düşün: A → B ağırlık 2, A → C ağırlık 5, B → C ağırlık −4. A'dan Dijkstra çalıştır:</p>

<div class="calc-example"><div class="example-label">KARŞIT ÖRNEK</div><div class="example-body">d[A]=0, d[B]=∞, d[C]=∞.<br><br><strong>A çıkar.</strong> Rahatlat → d[B]=2, d[C]=5.<br><strong>B çıkar (d=2).</strong> B → C rahatlat: d[C] = min(5, 2 + (−4)) = −2. B'yi yerleştir.<br><strong>C çıkar.</strong> d[C] = −2. <em>Ama</em> Dijkstra B'yi yerleştirdiğinde onun değerinin kesin olduğunu söz vermişti — ve sonradan iyileşmesinin tek nedeni negatif kenar. Eğer çizgede çok negatif bir C → B kenarı da olsaydı, Dijkstra B'yi d[B] = 2'de zaten yerleştirmiş ve daha iyi cevabı kaçırmış olurdu.<br><br><strong>Ders:</strong> negatif olmayan ağırlıklarla, "en yakın yerleşmemiş tepe kesindir" doğrudur çünkü herhangi başka bir yol zaten en az o kadar büyük olan bir uzaklığa negatif olmayan ağırlık eklemek zorundadır. Negatif kenarlar bu tekdüzeliği kırar.</div></div>

<div class="calc-graph"><div id="plot-l4-negative-tr" class="plotly-graph" style="height:300px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> 3-tepeli karşıt örnek. Dijkstra önce B'yi çıkarır ve uzaklığını 2'de kesin ilan eder, ancak negatif B → C kenarı, alternatif bir yolun Dijkstra'nın sabitlediği bir uzaklığı sonradan geçebileceği bir durum yaratır — algoritmanın bağlı olduğu değişmez.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pos={A:[0,1],B:[2,2],C:[2,0]};
var edges=[['A','B',2,'#f59e0b'],['A','C',5,'#f59e0b'],['B','C',-4,'#ef4444']];
var traces=[];var ann=[];
for(var i=0;i<edges.length;i++){var e=edges[i];var p1=pos[e[0]];var p2=pos[e[1]];
traces.push({x:[p1[0],p2[0]],y:[p1[1],p2[1]],mode:'lines',line:{color:e[3],width:2.8},showlegend:false,hoverinfo:'skip'});
ann.push({x:(p1[0]+p2[0])/2,y:(p1[1]+p2[1])/2+0.1,text:'w = '+e[2],showarrow:false,font:{size:13,color:e[3]}});}
var nx=[],ny=[],lab=[];for(var k in pos){nx.push(pos[k][0]);ny.push(pos[k][1]);lab.push(k);}
traces.push({x:nx,y:ny,mode:'markers+text',text:lab,textposition:'middle center',textfont:{color:'#fff',size:15},marker:{size:34,color:'#3b82f6',line:{color:'#fff',width:1.4}},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[-0.5,2.7]},yaxis:{visible:false,range:[-0.6,2.6]},margin:{t:20,r:10,b:10,l:10},annotations:ann,showlegend:false};
Plotly.newPlot('plot-l4-negative-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Negatif ağırlıklar nerede ortaya çıkar.</strong> <em>Türetilmiş</em> çizgelerde sıklıkla görülür: döviz arbitraj döngüleri (ağırlık −log(kur) olarak alınır), pekiştirmeli öğrenmede ödül şekillendirme, çizelgelemede maliyet farkları. Negatif gördüğünde Bellman–Ford'a geç.</div>

<h2 class="lesson-title">3. Bellman–Ford Algoritması</h2>

<div class="calc-highlight"><strong>Kaba kuvvet, ama işe yarar.</strong> Bellman–Ford, Dijkstra'nın açgözlü sıralamasından vazgeçer ve onun yerine <em>her kenarı</em>, üst üste V − 1 kez rahatlatır. Çizgede s'den ulaşılabilen bir negatif döngü yoksa bu, her en kısa yolu bulmaya yeter. Bonus olarak, fazladan bir geçişle negatif döngünün varlığı tespit edilir.</div>

<div class="code-wrap"><div class="code-label"><span>BELLMAN–FORD — SÖZDE KOD</span></div><pre class="code-block"><code><span class="kw">function</span> <span class="fn">bellman_ford</span>(G, s):
    <span class="kw">for</span> v <span class="kw">in</span> G.V: d[v] = <span class="num">sonsuz</span>
    d[s] = <span class="num">0</span>
    <span class="kw">for</span> i <span class="kw">in</span> 1..|V|-1:
        <span class="kw">for</span> (u, v, w) <span class="kw">in</span> G.E:
            <span class="kw">if</span> d[u] + w &lt; d[v]:
                d[v] = d[u] + w
                ata[v] = u
    <span class="cm"># negatif dongu tespiti icin ek bir gecis</span>
    <span class="kw">for</span> (u, v, w) <span class="kw">in</span> G.E:
        <span class="kw">if</span> d[u] + w &lt; d[v]:
            <span class="kw">raise</span> <span class="str">"s'den ulasilabilir negatif dongu"</span>
    <span class="kw">return</span> d, ata</code></pre></div>

<p class="l-text">Neden V − 1 geçiş? Herhangi bir en kısa yol en fazla V − 1 kenar içerir (aksi takdirde bir tepeyi tekrar ziyaret eder ve tekrar ziyaret etmek, negatif bir döngünün içinde olmadıkça uzunluğu azaltamaz; son geçişin tespit ettiği tam olarak bu durumdur). i geçişten sonra en fazla i kenarı olan her en kısa yol doğru hesaplanmıştır. V − 1 geçişten sonra her en kısa yol doğru hesaplanmıştır. Toplam iş: O(V · E).</p>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — AYNI 6 TEPE, BİR NEGATİF KENAR</div><div class="example-body">L1 çizgesini kullan ama B → D kenarını +5 yerine −1 yap (ve bu örnekte çizgeyi yönlü olarak ele al).<br><br><strong>1. Geçiş</strong> (sabit sırada tüm kenarlarda A-B, A-C, B-C, B-D, ...):<br>d[B] = 4, d[C] = 2, sonra B-C üzerinden: d[C] = min(2, 4+1) = 2; B-D üzerinden: d[D] = 4 + (−1) = 3; C-D üzerinden: d[D] = min(3, 2+8) = 3; C-E üzerinden: d[E] = 12; D-E üzerinden: d[E] = min(12, 3+2) = 5; D-F üzerinden: d[F] = 3+6 = 9; E-F üzerinden: d[F] = min(9, 5+3) = 8.<br><br><strong>2. Geçiş.</strong> Yeniden rahatlatma: A-C → B-D zinciri A-C(2)-B(C-B üzerinden, w=1, yani d[B] = 3) d[B]'yi 3'e indirir; bu yayılır: d[D] = 3 + (−1) = 2, d[E] = 2 + 2 = 4, d[F] = 4 + 3 = 7. Hiçbir kenar bir şeyi iyileştirmeyene kadar devam et.<br><br><strong>Son uzaklıklar:</strong> d = {A:0, B:3, C:2, D:2, E:4, F:7}. Dijkstra yanlış cevap verirdi çünkü negatif B→D kenarı, daha uzun bir "yaklaşım" için ödeyerek D'ye daha ucuz ulaşmamıza izin verdi.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ne zaman tercih edilir</div><div class="card-body">Herhangi bir kenar ağırlığı negatif olabilir olduğunda ya da özellikle negatif döngü tespiti gerektiğinde Bellman–Ford kullan.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman değil</div><div class="card-body">Tüm negatif olmayan ağırlıklarla Dijkstra daha hızlıdır: O((V + E) log V) vs O(V·E). Milyonlarca kenarlı seyrek bir yol ağında fark büyüktür.</div></div>
<div class="calc-card"><div class="card-title">Mesafe-vektör yönlendirme</div><div class="card-body">Klasik iç ağ geçidi protokolü RIP, esasen dağıtık Bellman–Ford'dur — her yönlendirici her hedefe geçici uzaklıkları saklar ve komşularıyla değiştirir.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">V − 1 geçiş sonrasında bir geçiş daha denersen ve en az bir d[v] hâlâ düşerse, çizge s'den ulaşılabilir bir negatif döngü içerir. Bu tek ek geçişin neden yeterli olduğunu ifade edebildiğinden emin ol — "basit bir yolda en fazla V − 1 kenar" fikrini kullanan tek satırlık bir kanıttır.</div></div>

<h2 class="lesson-title">4. Tüm Çiftlerin En Kısa Yolu: Floyd–Warshall</h2>

<div class="calc-highlight"><strong>Herkesten herkese tek bir üçlü döngüde çözmek.</strong> <em>Her çift</em> tepe arasında en kısa yollara ihtiyacın olduğunda ve çizge küçükten ortaya yoğunsa, Floyd–Warshall en temiz cevaptır. Tek bir küçük dinamik programlama fikri üzerine kuruludur.</div>

<p class="l-text"><em>d<sub>k</sub>[i][j]</em>, i'den j'ye yalnızca {1, ..., k} kümesinden ara tepeler kullanan en kısa yolun uzunluğu olsun. Şu durumda:</p>

<div class="calc-formula"><div class="formula-label">FLOYD–WARSHALL ÖZYİNELEMESİ</div><div class="formula-main">$$d_k[i][j] = \\min\\bigl(d_{k-1}[i][j],\\; d_{k-1}[i][k] + d_{k-1}[k][j]\\bigr)$$</div><div class="formula-sub">Ya k tepesini ara nokta olarak kullanmıyoruz ya da kullanıyoruz — bir kez k'den geçerek.</div></div>

<div class="code-wrap"><div class="code-label"><span>FLOYD–WARSHALL — SÖZDE KOD</span></div><pre class="code-block"><code><span class="kw">function</span> <span class="fn">floyd_warshall</span>(W):     <span class="cm"># W = V x V agirlik matrisi, kenar yoksa sonsuz</span>
    d = <span class="fn">copy</span>(W)
    <span class="kw">for</span> k <span class="kw">in</span> 1..V:
        <span class="kw">for</span> i <span class="kw">in</span> 1..V:
            <span class="kw">for</span> j <span class="kw">in</span> 1..V:
                <span class="kw">if</span> d[i][k] + d[k][j] &lt; d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    <span class="kw">return</span> d</code></pre></div>

<p class="l-text">İç içe üç döngü O(V³) zaman ve O(V²) bellek verir (dizi yerinde güncellenebilir; ders kitabı kanıtı yerinde güncellemenin hâlâ doğru olduğunu gösterir). Her tepeden Dijkstra çalıştırmakla karşılaştır: O(V · (V + E) log V) = seyrek çizgeler için O(V·E log V). Floyd–Warshall, V³ &lt; V·E log V olduğunda kazanır; yani çizge V² kenara yakın yoğunluğa sahipken.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Negatifleri kaldırır</div><div class="card-body">Evet, negatif döngü olmadığı sürece. (Negatif döngü ⇔ bazı d[i][i] negatif olur.)</div></div>
<div class="calc-card"><div class="card-title">Geçişli kapanış</div><div class="card-body">+ yerine OR, min yerine AND koyarsan aynı döngüler ulaşılabilirlik ilişkisini hesaplar (Warshall algoritması).</div></div>
<div class="calc-card"><div class="card-title">Merkezilik</div><div class="card-body">Tam bir uzaklık matrisi sana yakınlık merkeziliği, eksantriklik, çap ve diğer çizge metriklerini tek seferde hesaplama imkânı verir.</div></div>
</div>

<h2 class="lesson-title">5. Minimum Kapsayan Ağaç — Problem</h2>

<div class="calc-highlight"><strong>Her şeyi mümkün olduğunca ucuza bağla.</strong> Bağlı ağırlıklı bir çizge G var — fiber kabloyla bağlamak istediğin şehirler, seri bağlantılarla bağlamak istediğin sensörler, tek bir omurganın geçmesi gereken evler. Minimum kapsayan ağaç (MST), her tepeyi hâlâ bağlayan en ucuz kenar alt kümesidir. Tanım gereği MST'nin tam olarak |V| − 1 kenarı vardır ve hiç döngüsü yoktur.</div>

<p class="l-text"><strong>Neden bir ağaç?</strong> Eğer |V| veya daha fazla kenarımız olsaydı alt çizge bir döngü içerirdi — ve döngünün en ağır kenarını bağlantıyı kaybetmeden silebilir, toplam maliyeti düşürebilirdik. Bunu yineledikçe optimum döngüsüz, yani bir ağaç olur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ağ tasarımı</div><div class="card-body">Şehirleri en az toplam uzunlukla bağlamak için telefon kablosu, su borusu ya da fiber döşemek 1926'daki orijinal motivasyondur (Moravya'da Otakar Borůvka).</div></div>
<div class="calc-card"><div class="card-title">Kümeleme</div><div class="card-body">MST'nin en ağır k − 1 kenarını kes; bir k-küme bölüntüsü elde edersin (tek-bağlantı hiyerarşik kümelemenin temeli).</div></div>
<div class="calc-card"><div class="card-title">Yaklaşımlar</div><div class="card-body">MST, metrik Gezgin Satıcı Problemi'ne 2-yaklaşımı verir — TSP'yi polinom zamanda MST'yi dolaşarak "yeterince iyi" çöz.</div></div>
</div>

<h2 class="lesson-title">6. Kruskal Algoritması</h2>

<div class="calc-highlight"><strong>Kenarları sırala, döngü kapatmayan en ucuzu ekle.</strong> Bu, MST için en "bariz" açgözlü stratejidir ve işe yarar. "Bu kenarı eklemek döngü oluşturur mu?" muhasebe sorusu tam olarak Birleştir-Bul veri yapısının yanıtlamak için icat edildiği sorudur.</div>

<div class="code-wrap"><div class="code-label"><span>KRUSKAL — SÖZDE KOD</span></div><pre class="code-block"><code><span class="kw">function</span> <span class="fn">kruskal</span>(G):
    MST = bos kenar kumesi
    UF  = <span class="fn">UnionFind</span>(G.V)
    <span class="kw">for</span> (u, v, w) <span class="kw">in</span> <span class="fn">sort</span>(G.E by w artan):
        <span class="kw">if</span> UF.<span class="fn">find</span>(u) != UF.<span class="fn">find</span>(v):
            MST.<span class="fn">add</span>((u, v, w))
            UF.<span class="fn">union</span>(u, v)
            <span class="kw">if</span> |MST| == |V| - 1: <span class="kw">break</span>
    <span class="kw">return</span> MST</code></pre></div>

<p class="l-text"><strong>Karmaşıklık.</strong> E kenarı sıralamak O(E log E). Yol sıkıştırmalı Birleştir-Bul ile her find/union amortize edilmiş O(α(V)) — ters Ackermann fonksiyonu, etkin olarak sabit. Toplam: O(E log E) = O(E log V).</p>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — AYNI 6 TEPELİ ÇİZGE</div><div class="example-body">Ağırlığa göre sıralanmış kenarlar: BC(1), AC(2), DE(2), EF(3), AB(4), BD(5), DF(6), CD(8), CE(10).<br><br><strong>BC(1).</strong> B ve C farklı kümelerde → ekle. Kümeler: {A}, {B,C}, {D}, {E}, {F}.<br><strong>AC(2).</strong> A ve C farklı → ekle. Kümeler: {A,B,C}, {D}, {E}, {F}.<br><strong>DE(2).</strong> Farklı → ekle. Kümeler: {A,B,C}, {D,E}, {F}.<br><strong>EF(3).</strong> Farklı → ekle. Kümeler: {A,B,C}, {D,E,F}.<br><strong>AB(4).</strong> Aynı küme → <em>atla</em> (ABC döngüsünü kapatırdı).<br><strong>BD(5).</strong> Farklı → ekle. Kümeler: {A,B,C,D,E,F}. 5 kenar, |V|−1, bitti.<br><br><strong>MST kenarları:</strong> {BC, AC, DE, EF, BD}. Toplam ağırlık = 1 + 2 + 2 + 3 + 5 = <strong>13</strong>.</div></div>

<div class="calc-graph"><div id="plot-l4-mst-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> 6-tepeli çizge, MST kenarları (ağırlık 13) turuncu vurgulanmış. Hem Kruskal hem Prim (sonraki bölüm) tam olarak bu ağacı bulur çünkü tüm kenar ağırlıkları farklıyken optimal MST tektir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pos={A:[0,2],B:[1.6,3.2],C:[1.6,0.8],D:[3.4,2.6],E:[3.6,0.4],F:[5.2,1.6]};
var mst={'A-C':1,'B-C':1,'B-D':1,'D-E':1,'E-F':1};
var edges=[['A','B',4],['A','C',2],['B','C',1],['B','D',5],['C','D',8],['C','E',10],['D','E',2],['D','F',6],['E','F',3]];
var traces=[];var ann=[];
for(var i=0;i<edges.length;i++){var e=edges[i];var p1=pos[e[0]];var p2=pos[e[1]];var key=e[0]+'-'+e[1];var hi=mst[key]?true:false;
traces.push({x:[p1[0],p2[0]],y:[p1[1],p2[1]],mode:'lines',line:{color:hi?'#f59e0b':'rgba(150,150,150,0.35)',width:hi?3.6:1.4},showlegend:false,hoverinfo:'skip'});
ann.push({x:(p1[0]+p2[0])/2,y:(p1[1]+p2[1])/2+0.12,text:String(e[2]),showarrow:false,font:{size:12,color:hi?'#fbbf24':'#999'}});}
var nx=[],ny=[],lab=[];for(var k in pos){nx.push(pos[k][0]);ny.push(pos[k][1]);lab.push(k);}
traces.push({x:nx,y:ny,mode:'markers+text',text:lab,textposition:'middle center',textfont:{color:'#fff',size:14},marker:{size:30,color:'#3b82f6',line:{color:'#fff',width:1.4}},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[-0.6,5.9]},yaxis:{visible:false,range:[-0.2,4]},margin:{t:30,r:20,b:20,l:20},annotations:ann,showlegend:false};
Plotly.newPlot('plot-l4-mst-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Birleştir-Bul ayrıntısı.</strong> Basit "ata işaretçisi" uygulaması zaten lineerine yakın amortize maliyet verir. İki optimizasyon: <em>ranka göre birleştirme</em> (daima küçük ağacı büyüğün altına bağla) ve <em>yol sıkıştırma</em> (kökü bulmak için yukarı her çıktığımızda yoldaki her düğümü doğrudan köke yeniden işaret ettir). Birlikte amortize edilmiş O(α(V)) verir.</div>

<h2 class="lesson-title">7. Prim Algoritması</h2>

<div class="calc-highlight"><strong>Ağacı bir tepe ekleyerek büyüt.</strong> Prim, rastgele bir tepeyle başlar ve mevcut ağacı dışındaki bir tepeyle bağlayan en ucuz kenarı tekrar tekrar ekler. Yapısal olarak Prim, Dijkstra'ya çok benzer — ikisi de "bu tepeyi eklemek için bildiğimiz en iyi maliyet" üzerinde anahtarlanmış bir öncelik kuyruğu kullanır — ama minimize edilen maliyet farklıdır: Dijkstra s'den uzaklığı, Prim ağacı kesen kenar ağırlığını minimize eder.</div>

<div class="code-wrap"><div class="code-label"><span>PRIM — SÖZDE KOD</span></div><pre class="code-block"><code><span class="kw">function</span> <span class="fn">prim</span>(G, s):
    <span class="kw">for</span> v <span class="kw">in</span> G.V: anahtar[v] = <span class="num">sonsuz</span>
    anahtar[s] = <span class="num">0</span>
    PQ = oncelik_kuyrugu; ekle (0, s)
    agacta = bos kume
    MST = []
    <span class="kw">while</span> PQ bos degil:
        (k, u) = PQ.<span class="fn">extract_min</span>()
        <span class="kw">if</span> u <span class="kw">in</span> agacta: <span class="kw">continue</span>
        agacta.<span class="fn">add</span>(u)
        <span class="kw">if</span> ata[u] tanimliysa: MST.<span class="fn">add</span>((ata[u], u, k))
        <span class="kw">for</span> (v, w) <span class="kw">in</span> G.<span class="fn">neighbors</span>(u):
            <span class="kw">if</span> v <span class="kw">not in</span> agacta <span class="kw">and</span> w &lt; anahtar[v]:
                anahtar[v] = w
                ata[v] = u
                PQ.<span class="fn">insert</span>((w, v))
    <span class="kw">return</span> MST</code></pre></div>

<p class="l-text">İkili yığınla karmaşıklık: O((V + E) log V) — Dijkstra ile aynı.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — AYNI ÇİZGEDE A'DAN PRIM</div><div class="example-body"><strong>Başla.</strong> agacta = {A}. PQ'da (0, A) → çıkar, sonra komşulara bak: anahtar[B] = 4 (AB üzerinden), anahtar[C] = 2 (AC üzerinden).<br><strong>C çıkar (k=2).</strong> AC kenarını ekle. Güncelle: BC ağırlık 1 &lt; anahtar[B]=4 → anahtar[B] = 1 (ata B = C). CD ağırlık 8, anahtar[D] 8 olur (ata D = C). CE: anahtar[E] = 10.<br><strong>B çıkar (k=1).</strong> CB kenarını ekle. BD = 5 &lt; anahtar[D]=8 → anahtar[D] = 5 (ata D = B).<br><strong>D çıkar (k=5).</strong> BD kenarını ekle. DE = 2 &lt; anahtar[E]=10 → anahtar[E] = 2 (ata E = D). DF = 6 → anahtar[F] = 6.<br><strong>E çıkar (k=2).</strong> DE kenarını ekle. EF = 3 &lt; anahtar[F]=6 → anahtar[F] = 3 (ata F = E).<br><strong>F çıkar (k=3).</strong> EF kenarını ekle.<br><br><strong>MST kenarları:</strong> AC(2), CB(1), BD(5), DE(2), EF(3). Toplam = <strong>13</strong>. Kruskal ile aynı ağaç — ikisi de doğru.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kruskal tercih edilir</div><div class="card-body">Çizge seyrek olduğunda, kenarlar zaten (ya da kolayca) sıralı olduğunda ya da elinde hızlı bir Birleştir-Bul uygulaması varken.</div></div>
<div class="calc-card"><div class="card-title">Prim tercih edilir</div><div class="card-body">Çizge yoğun olduğunda (O(V²) kenar sıralamak istemezsin) ya da ağaç büyürken yalnızca MST'ye artımlı olarak ihtiyacın olduğunda.</div></div>
<div class="calc-card"><div class="card-title">Borůvka</div><div class="card-body">Üçüncü klasik algoritma, paralel için dost: her turda her bileşen en ucuz dışa giden kenarını seçer. GPU ve dağıtık sistemlerde yararlı.</div></div>
</div>

<h2 class="lesson-title">8. Kesim Özelliği</h2>

<div class="calc-highlight"><strong>Kruskal ve Prim'i çalıştıran tek teorem.</strong> Bir çizgenin <em>kesimi</em>, tepe kümesinin boş olmayan iki parçaya S ve V \\ S bölünmesidir. Bir kenar, tam olarak bir ucu S'de ise kesimi <em>keser</em>. Kesim özelliği: herhangi bir kesimde, kesimi geçen en hafif kenar bir MST'ye aittir.</div>

<div class="calc-formula"><div class="formula-label">KESİM ÖZELLİĞİ</div><div class="formula-main">$$\\text{Herhangi bir kesim } (S, V \\setminus S),\\;\\; \\arg\\min\\{w(e):\\, e \\text{ kesimi geciyor}\\} \\in \\text{MST}$$</div><div class="formula-sub">Tepelerin herhangi bir bölüntüsünü seç; her iki tarafta birer ucu olan en ucuz kenar her zaman güvenle eklenebilir.</div></div>

<p class="l-text"><strong>Kanıt taslağı (değiş-tokuş argümanı).</strong> T'nin bir MST olduğunu ve en hafif kesen kenar e = (u, v)'nin T'de olmadığını varsay. T ile e birlikte tek bir döngü içerir (çünkü T bir ağaç) ve bu döngü kesimi en az iki kez geçmek zorundadır. Döngü üzerindeki başka herhangi bir kesen kenar e'yi e ile değiştir — sonuç T' hâlâ bir kapsayan ağaçtır (bir döngüden bir kenar çıkarıp bir kenar ekledik) ve toplam ağırlığı w(T') = w(T) + w(e) − w(e') &lt;= w(T) olur, çünkü e en hafif kesendir. Yani T' de bir MST'dir ve e'yi içerir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kruskal uygulaması</div><div class="card-body">Kruskal (u, v) kenarını değerlendirdiğinde kesim "u'nun mevcut bileşeni ve geri kalan her şey"dir. Eğer (u, v) bu kesimin en hafif keseni ise (öyle olmak zorunda, çünkü tüm daha hafif kenarlar zaten işlenmiş ve ya eklenmiş ya atlanmış), güvenlidir.</div></div>
<div class="calc-card"><div class="card-title">Prim uygulaması</div><div class="card-body">Kesim "agacta ile V \\ agacta"dır. Prim her yinelemede bu kesimi geçen en hafif kenarı açıkça çıkarır.</div></div>
<div class="calc-card"><div class="card-title">Neden teklik</div><div class="card-body">Tüm kenar ağırlıkları <em>farklı</em> ise "en hafif" tek anlamlıdır ve MST tektir. Beraberlik durumunda birden fazla eşit derecede iyi MST var olabilir.</div></div>
</div>

<h2 class="lesson-title">9. Maksimum Akış — Problem</h2>

<div class="calc-highlight"><strong>Ağ ne kadar teslim edebilir?</strong> Her (u, v) kenarının negatif olmayan bir <em>kapasite</em>si c(u, v) olan yönlü bir çizgen var. Bir kaynak s ve bir lavabo t seç. Bir <em>akış</em>, her kenara 0 ≤ f(u, v) ≤ c(u, v) olacak şekilde negatif olmayan bir f(u, v) sayısı atar ve her iç tepede toplam giren akış toplam çıkan akışa eşittir (korunum yasası). Maksimum-akış problemi, s'den çıkan toplam akışın (eşdeğer olarak, t'ye giren) mümkün olan en büyük değerini sorar.</div>

<p class="l-text">Somut örnek: rafineriden (s) limana (t) bir boru hattı ağı hayal et. Her borunun maksimum bir akışı vardır. Rafineriden petrolün çıkabileceği en yüksek hız nedir?</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İki bölmeli eşleştirme</div><div class="card-body">Öğrencileri okullara eşleştir: her öğrenciye giren bir süper-kaynak s, her okuldan çıkan bir süper-lavabo t, tüm kapasiteler 1. Maks-akış maks eşleştirme boyutuna eşittir.</div></div>
<div class="calc-card"><div class="card-title">Ağ güvenilirliği</div><div class="card-body">"s ve t kopmadan ağ kaç kenar arızasına dayanabilir?" sorusu min-cut sayısıdır.</div></div>
<div class="calc-card"><div class="card-title">Spor elemesi</div><div class="card-body">Mevcut puan durumu ve kalan maçlar verildiğinde "X takımı hâlâ ligi kazanabilir mi?" sorusu zekice bir maks-akış kurulumuna indirgenir.</div></div>
<div class="calc-card"><div class="card-title">Görüntü segmentasyonu</div><div class="card-body">Pikseller tepe olur, komşu benzerliği kapasite olur, ön/arka plan öncelikleri s/t kenarları olur ve min-cut nesneyi ayırır — GrabCut'ın temeli.</div></div>
</div>

<h2 class="lesson-title">10. Ford–Fulkerson Yöntemi</h2>

<div class="calc-highlight"><strong>Herhangi bir artırıcı yol boyunca akış it, tekrarla.</strong> <em>Artık çizgedeki</em> bir <em>artırıcı yol</em>, hâlâ daha fazla akış itebileceğimiz bir s-t yoludur. Ford–Fulkerson yöntemi: böyle bir yol var olduğu sürece, bir tane bul (herhangi bir yolla), darboğazın izin verdiği kadar akış it ve artık çizgeyi güncelle. Artık artırıcı yol kalmadığında mevcut akış maksimumdur.</div>

<p class="l-text">Bir f akışı için <strong>artık çizge</strong> G<sub>f</sub>, kapasitesi c ve akışı f olan her orijinal (u, v) kenarı için artık kapasitesi c − f olan ileri (u, v) kenarı ve artık kapasitesi f olan geri (v, u) kenarı (geri alabileceğimiz akışı temsil eder) içerir. G<sub>f</sub>'de bir yol boyunca itmek ileri artıkları azaltır ve geri artıkları artırır.</p>

<div class="code-wrap"><div class="code-label"><span>FORD–FULKERSON — SÖZDE KOD</span></div><pre class="code-block"><code><span class="kw">function</span> <span class="fn">ford_fulkerson</span>(G, s, t):
    f[e] = <span class="num">0</span> <span class="kw">for all</span> e
    <span class="kw">while</span> yol = <span class="fn">find_augmenting_path</span>(G_f, s, t):
        darbogaz = <span class="fn">min</span>(artik(e) <span class="kw">for</span> e <span class="kw">in</span> yol)
        <span class="kw">for</span> e <span class="kw">in</span> yol:
            f[e] += darbogaz                <span class="cm"># ileri kenarlar</span>
            f[<span class="fn">reverse</span>(e)] -= darbogaz   <span class="cm"># simetri</span>
    <span class="kw">return</span> f</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sonlandırma (tamsayı kapasiteler)</div><div class="card-body">Her artırıcı yol toplam akışı en az 1 artırır, yani döngü en fazla maks-akış kez çalışır. Her yineleme O(E). Toplam: O(maxflow · E).</div></div>
<div class="calc-card"><div class="card-title">Sonlandırma uyarısı</div><div class="card-body">İrrasyonel kapasitelerle, kötü seçilmiş yollar Ford–Fulkerson'u gerçek maksimuma yakınsamadan sonsuza dek döngüye sokabilir. Tamsayı kapasitelerle tamsayı artırmaları bizi kurtarır.</div></div>
<div class="calc-card"><div class="card-title">Neden geri kenarlar</div><div class="card-body">Sonraki yinelemelerin önceki akış kararlarını "yeniden yönlendirmesine" izin verirler. Onlarsız, açgözlü bir ilk artırma gerçek optimumu sonsuza dek kapatabilir.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Felaket örnek: s, a, b, t 4-tepeli çizge, kapasiteler s→a=100, s→b=100, a→b=1, a→t=100, b→t=100. Ford–Fulkerson sürekli s → a → b → t yolunu, sonra s → b → a → t (geri a→b kenarı üzerinden), sonra s → a → b → t yolunu seçerse, sonlanması 200 yineleme alabilir. Maks-akış 200 ile sorun değil, ama kapasiteleri 10⁹'a çıkar — 4 düğümlü bir çizge üzerinde 2 · 10⁹ yineleme çalışan bir algoritman olur. Edmonds–Karp bunu düzeltir.</div></div>

<h2 class="lesson-title">11. Edmonds–Karp</h2>

<div class="calc-highlight"><strong>Her zaman en kısa artırıcı yolu seç (BFS).</strong> Edmonds–Karp, yol bulmak için tek bir spesifik seçim yapan Ford–Fulkerson'dur: genişlik öncelikli arama, böylece artırıcı yol her zaman en az kenara sahip olur. Bu disiplinle algoritmanın O(V·E) artırmada sonlandığı kanıtlanır; toplam O(V·E²) — kapasite değerlerinden bağımsız olarak polinom.</div>

<p class="l-text"><strong>BFS bunu neden polinom yapar.</strong> Her turda, en kısa artırıcı yolun uzunluğu azalmayandır ve her kenar bir en kısa yol üzerinde en fazla O(V) kez "doyurulmuş" hâle gelebilir. E kenar var, toplam O(V·E) artırma verir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — 4-DÜĞÜMLÜ AKIŞ AĞI</div><div class="example-body">Tepeler s, a, b, t ve yönlü kenarlar s→a (kap 3), s→b (kap 2), a→b (kap 2), a→t (kap 2), b→t (kap 3).<br><br><strong>BFS 1.</strong> En kısa s-t yolu: s → a → t. Darboğaz = min(3, 2) = 2. 2 it. Artıklar: s→a 1, a→t 0; geri a→s 2, t→a 2.<br><strong>BFS 2.</strong> En kısa yol: s → b → t. Darboğaz = min(2, 3) = 2. 2 it. Artıklar: s→b 0, b→t 1; geri b→s 2, t→b 2.<br><strong>BFS 3.</strong> s → a → b → t. Darboğaz = min(1, 2, 1) = 1. 1 it. Artıklar: s→a 0, a→b 1, b→t 0.<br><strong>BFS 4.</strong> Artık çizgede s-t yolu yok. <strong>Maks akış = 2 + 2 + 1 = 5.</strong></div></div>

<div class="calc-graph"><div id="plot-l4-flow-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> 4-tepeli maks-akış ağı. Kenar etiketleri "akış / kapasite". s'den çıkan toplam akış = 5 = t'ye giren toplam akış (korunum). {s}'yi {a, b, t}'den ayıran min-cut'ın kapasitesi 3 + 2 = 5 — maks akışa eşit, sonraki bölümün teoreminin gerektirdiği gibi. Kesim kesik çizgi ile vurgulanmıştır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pos={s:[0,1],a:[2,2],b:[2,0],t:[4,1]};
var edges=[['s','a','3/3'],['s','b','2/2'],['a','b','1/2'],['a','t','2/2'],['b','t','3/3']];
var traces=[];var ann=[];
for(var i=0;i<edges.length;i++){var e=edges[i];var p1=pos[e[0]];var p2=pos[e[1]];
traces.push({x:[p1[0],p2[0]],y:[p1[1],p2[1]],mode:'lines',line:{color:'#10b981',width:2.8},showlegend:false,hoverinfo:'skip'});
ann.push({x:(p1[0]+p2[0])/2,y:(p1[1]+p2[1])/2+0.13,text:e[2],showarrow:false,font:{size:13,color:'#34d399'}});
ann.push({x:(p1[0]+p2[0])/2+(p2[0]-p1[0])*0.18,y:(p1[1]+p2[1])/2+(p2[1]-p1[1])*0.18,text:'>',showarrow:false,font:{size:14,color:'#10b981'}});}
traces.push({x:[1,1],y:[-0.7,2.7],mode:'lines',line:{color:'#ef4444',width:2.2,dash:'dash'},showlegend:false,hoverinfo:'skip'});
ann.push({x:1.05,y:2.55,text:'min-cut (kap 5)',showarrow:false,font:{size:12,color:'#fca5a5'},xanchor:'left'});
var nx=[],ny=[],lab=[];for(var k in pos){nx.push(pos[k][0]);ny.push(pos[k][1]);lab.push(k);}
traces.push({x:nx,y:ny,mode:'markers+text',text:lab,textposition:'middle center',textfont:{color:'#fff',size:15},marker:{size:34,color:'#3b82f6',line:{color:'#fff',width:1.4}},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[-0.6,4.6]},yaxis:{visible:false,range:[-0.9,2.9]},margin:{t:20,r:10,b:10,l:10},annotations:ann,showlegend:false};
Plotly.newPlot('plot-l4-flow-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Daha hızlı varisler.</strong> Dinic algoritması O(V²·E)'de, modern push-relabel ailesi O(V³) ya da daha iyide çalışır. Edmonds–Karp hâlâ öğretmek için en temiz olanıdır ve ~10<sup>4</sup> tepeye kadar çizgeler için fazlasıyla hızlıdır.</div>

<h2 class="lesson-title">12. Maks-Akış Min-Kesim Teoremi</h2>

<div class="calc-highlight"><strong>Kombinatoryal optimizasyondaki en güzel dualite.</strong> Bir s-t kesimi, s ∈ S ve t ∈ T olan tepe kümesinin bir (S, T) bölüntüsüdür. Kesimin <em>kapasitesi</em>, S'den T'ye giden kenarların toplam kapasitesidir (yalnızca ileri — geri kenarlar bedavadır). Teorem: maksimum akışın değeri minimum kesimin kapasitesine eşittir.</div>

<div class="calc-formula"><div class="formula-label">MAKS-AKIŞ MİN-KESİM TEOREMİ</div><div class="formula-main">$$\\max_f \\, |f| \\;=\\; \\min_{(S,T)} \\, c(S, T)$$</div><div class="formula-sub">Tüm geçerli s-t akışları üzerinde maksimum = tüm s-t kesimleri üzerinde minimum.</div></div>

<p class="l-text"><strong>Kanıt taslağı.</strong> (≤) Herhangi bir akış değeri herhangi bir kesim kapasitesinden büyük olamaz, çünkü s'den t'ye giden her akış birimi her s-t kesimini en az bir kez geçmek zorundadır. (≥) Ford–Fulkerson sonlandığında, S artık çizgede s'den ulaşılabilen tepeler kümesi olsun. O zaman s ∈ S, t ∉ S (aksi halde bir artırıcı yol var olurdu), S'den V \\ S'ye giden her ileri kenar doyurulmuştur (sıfır artık), V \\ S'den S'ye giden her geri kenar sıfır akış taşır. Yani akışın değeri tam olarak (S, V \\ S) kesiminin kapasitesine eşittir. Her iki sınır buluşur — eşitlik.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Algoritmik armağan</div><div class="card-body">Maks-akışı hesaplamanın yan ürünü olarak min-kesim ücretsiz gelir: sonlanmadaki doyurulmuş kesim optimalliğin sertifikasıdır.</div></div>
<div class="calc-card"><div class="card-title">LP duali</div><div class="card-body">Maks-akış bir lineer program olarak yazılabilir; min-kesim tam olarak onun dualidir. Teorem güçlü LP dualitenin kombinatoryal bir örneğidir.</div></div>
<div class="calc-card"><div class="card-title">König teoremi</div><div class="card-body">İki bölmeli bir çizgede, maks eşleştirme boyutu = min köşe örtüsü boyutu — maks-akış min-kesimin özel bir durumu.</div></div>
</div>

<h2 class="lesson-title">13. AI / CS Uygulamaları</h2>

<p class="l-text">Çizge algoritmaları her yerdedir — moda olmuş yeni bir teknik olarak değil, her gün kullandığın sistemlerin altındaki yük taşıyıcı temel olarak.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Google Haritalar yönlendirme</div><div class="card-body">Yol ağları çizgeye dönüşür (kavşaklar = tepeler, segmentler = ağırlıklı kenarlar); <strong>A*</strong> adında bir Dijkstra varyantı daha az tepe açmak için coğrafi bir sezgisel kullanır. Contraction Hierarchies ve Customisable Route Planning önceden hesaplanmış kısayollar ekler ve Google'a kıtalar arasında milisaniyelerde sorgu yanıtlama imkânı verir.</div></div>
<div class="calc-card"><div class="card-title">İnternet yönlendirme — OSPF</div><div class="card-body">OSPF (Open Shortest Path First) bağlantı-durumu protokolüdür: her yönlendirici yerel bağlantı maliyetlerini yayar, her yönlendirici tüm çizgede <em>Dijkstra</em> çalıştırır ve en iyi sonraki sıçrama tabloları güncellenir. Çoğu kurumsal ağ OSPF ya da kuzeni IS-IS çalıştırır.</div></div>
<div class="calc-card"><div class="card-title">İnternet yönlendirme — RIP / BGP</div><div class="card-body">RIP mesafe-vektör güncellemeleri kullanır (esasen dağıtık <em>Bellman–Ford</em>). Halka açık interneti bir arada tutan BGP, Bellman–Ford'un yol-vektör kuzeninin üstüne politika ekler.</div></div>
<div class="calc-card"><div class="card-title">Görüntü segmentasyonu</div><div class="card-body"><strong>GrabCut</strong>, <strong>GraphCut</strong> ve ilgili araçlar (Photoshop'un akıllı seçimi, Microsoft Lens, birçok tıbbi görüntüleme aracı) pikselleri tepe, komşu benzerliğini kenar ağırlığı, ön/arka plan önceliklerini s/t bağlantıları olarak ele alır — ve nesneyi ayırmak için <em>min-cut</em> çözer.</div></div>
<div class="calc-card"><div class="card-title">İki bölmeli eşleştirme</div><div class="card-body">Öğrencileri okullara eşleştirmek (Ulusal Tıp Stajyer Eşleştirme Programı), sürücüleri yolculara, reklam müzayedecilerini reklam yuvalarına — hepsi süper-kaynak ve süper-lavabolu bir çizge üzerinde <em>maks-akış</em> ile maksimum iki bölmeli eşleştirmeye indirgenir.</div></div>
<div class="calc-card"><div class="card-title">Spektral kümeleme</div><div class="card-body">Ders 5 kümelemeyi bir çizge kesim problemi olarak ele alacak. Shi ve Malik'in (2000) normalize-kesim formülasyonu derin öğrenmeden önce standart görüntü segmentasyon yöntemi oldu ve aynı fikir sosyal ağlardaki birçok modern topluluk tespit algoritmasının arkasındadır.</div></div>
</div>

<div class="l-note"><strong>Bunların hiçbiri pazarlama anlamında "yapay zekâ" değil.</strong> Ama her modern yapay zekâ sistemi, bu algoritmalar üzerine inşa edilmiş altyapı (haritalar, yönlendirme, çizelgeleme, eşleştirme) üzerinde çalışır. Sıradaki videonu öneren derin öğrenme modeli, Dijkstra'sız CDN yönlendirmesi olmadan oraya ulaşamazdı.</div>

<h2 class="lesson-title">14. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Oynamak için:</strong> ağa ("NYC", "STL", 950) kenarını ekle ve Dijkstra'yı tekrar çalıştır — doğrudan kenar Cleveland/Chicago üzerinden gitmekten daha pahalıdır, yani en kısa yol onu kullanmamalı. Sonra o kenarın maliyetini 600 yap ve cevabın değiştiğini izle. Bellman–Ford'un negatif bir kenarı nasıl ele aldığını görmek için ("PIT", "CHI", −50) ayarla ve Dijkstra'nın yanlış d[CHI] vereceğini, Bellman–Ford'un doğru sonucu vereceğini gözle.</p>

<h2 class="lesson-title">15. Karmaşıklık Özeti — Hangi Algoritma Ne Zaman?</h2>

<div class="calc-graph"><div id="plot-l4-complex-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> seyrek bir çizgede E = 4|V| için |V|'nin fonksiyonu olarak log–log ölçekte deneysel çalışma maliyeti. Dijkstra (yığın) neredeyse lineer ölçeklenir, Bellman–Ford daha dik bir eğime sahiptir (V·E ≈ V²) ve Floyd–Warshall (V³) V = 1000'i geçince yasaklayıcı olur. Doğru boyut için doğru aracı seçmek üzere bu grafiği kullan.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var V=[];for(var i=1;i<=24;i++)V.push(Math.round(Math.pow(2,i/3)));
var dij=[],bf=[],fw=[];
for(var i=0;i<V.length;i++){var v=V[i];var e=4*v;dij.push((v+e)*Math.log2(v));bf.push(v*e);fw.push(v*v*v);}
var t1={x:V,y:dij,mode:'lines+markers',name:'Dijkstra (yığın)',line:{color:'#3b82f6',width:2.4},marker:{size:6}};
var t2={x:V,y:bf,mode:'lines+markers',name:'Bellman–Ford',line:{color:'#f59e0b',width:2.4},marker:{size:6}};
var t3={x:V,y:fw,mode:'lines+markers',name:'Floyd–Warshall',line:{color:'#ef4444',width:2.4},marker:{size:6}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'|V|',type:'log',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'Yaklaşık işlem',type:'log',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:70},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l4-complex-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tek kaynak, negatif yok</div><div class="card-body"><strong>Dijkstra.</strong> O((V+E) log V).</div></div>
<div class="calc-card"><div class="card-title">Tek kaynak, negatifli</div><div class="card-body"><strong>Bellman–Ford.</strong> O(V·E). Negatif döngüleri de yakalar.</div></div>
<div class="calc-card"><div class="card-title">Tüm çiftler, küçük yoğun</div><div class="card-body"><strong>Floyd–Warshall.</strong> O(V³). Kodlaması basit.</div></div>
<div class="calc-card"><div class="card-title">Tüm çiftler, büyük seyrek</div><div class="card-body"><strong>Johnson algoritması</strong> (Bellman–Ford + V kez Dijkstra). O(V·E·log V).</div></div>
<div class="calc-card"><div class="card-title">MST, seyrek</div><div class="card-body"><strong>Birleştir-Bul ile Kruskal.</strong> O(E log V).</div></div>
<div class="calc-card"><div class="card-title">MST, yoğun</div><div class="card-body"><strong>İkili yığınla Prim.</strong> O((V+E) log V); komşuluk matrisiyle O(V²).</div></div>
<div class="calc-card"><div class="card-title">Maks-akış, genel</div><div class="card-body"><strong>Edmonds–Karp.</strong> O(V·E²). Çok büyük girdiler için <strong>Dinic</strong> ya da push-relabel kullan.</div></div>
</div>

<h2 class="lesson-title">16. Özet &amp; Ders 5 Bizi Nereye Götürüyor</h2>

<p class="l-text">Bir derste ağ optimizasyonunun üç sütununu ele aldık:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">En kısa yollar</div><div class="card-body">Dijkstra (açgözlü, negatif olmayan), Bellman–Ford (rahatlatma, negatifleri ele alır, negatif döngüleri yakalar), Floyd–Warshall (tüm çiftler dinamik programlama).</div></div>
<div class="calc-card"><div class="card-title">Minimum kapsayan ağaçlar</div><div class="card-body">Kruskal (kenarları sırala, Birleştir-Bul), Prim (PQ ile ağacı büyüt). İkisi de kesim özelliğiyle doğrulanır.</div></div>
<div class="calc-card"><div class="card-title">Maksimum akış / minimum kesim</div><div class="card-body">Ford–Fulkerson artık çizgede artırıcı yolları bulur; Edmonds–Karp polinom garantisi için onları BFS ile seçer. Maks-akış min-kesim teoremi cevabı kendinden sertifikalı yapar.</div></div>
</div>

<div class="l-warn"><strong>Sıradaki (Ders 5):</strong> spektral çizge teorisi. Aynı çizgelere Laplacian matrisi L = D − A merceğinden bakacağız, özdeğerlerinin bağlantı ve kümelemeyi nasıl kontrol ettiğini göreceğiz (Cheeger eşitsizliği) ve spektral kümeleme ile tanışacağız — çizge kesimlerini denetimsiz öğrenmenin iş aracına dönüştüren algoritma. Ders 4'ün kombinatoryal min-cut'undan Ders 5'in sürekli gevşemesine giden yol, uygulamalı matematiğin en güzel köprülerinden biridir.</div>`
};
