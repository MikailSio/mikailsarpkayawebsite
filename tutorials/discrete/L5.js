window.DISCRETE_L5 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Spectral graph theory is the bridge between linear algebra and graphs.</strong> Take any graph — a social network, a molecular skeleton, a road map — and you can build a single matrix from it whose eigenvalues encode almost every interesting property of the graph: how many connected components it has, how easy it is to cut in two, what its "natural" embedding in low dimensions looks like, and even how a Graph Neural Network should propagate information along its edges. That matrix is the <em>graph Laplacian</em>, and this lesson is the careful study of what its spectrum tells you.</p>

<p class="l-text">By the end of the lesson you will look at the eigenvalues of $L = D - A$ and read off the topology: the multiplicity of $\\lambda = 0$ is the number of connected components, the size of the second-smallest eigenvalue $\\lambda_2$ (the algebraic connectivity) measures how tightly the graph holds together, and the eigenvector belonging to $\\lambda_2$ — the Fiedler vector — bisects the graph into two natural clusters. From there it is a short hop to spectral clustering (Shi-Malik 2000, Ng-Jordan-Weiss 2002) and to the spectral derivation of the modern Graph Convolutional Network (Bruna 2014, Defferrard 2016 ChebNet, Kipf-Welling 2017). Spectral methods are the historical foundation of graph machine learning.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive the graph Laplacian $L = D - A$ from first principles and prove it is symmetric positive semidefinite</li>
<li>Read off the number of connected components of a graph directly from the multiplicity of $\\lambda = 0$ in its Laplacian spectrum</li>
<li>Compute the Fiedler vector and use its signs to bisect a graph along its weakest cut</li>
<li>Run the Shi-Malik / Ng-Jordan-Weiss spectral clustering algorithm end-to-end on a non-convex dataset (two moons) where plain k-means fails</li>
<li>State the Cheeger inequality and explain why a small $\\lambda_2$ means a small graph bottleneck</li>
<li>Derive the modern GCN propagation rule $H^{(l+1)} = \\sigma(\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2} H^{(l)} W^{(l)})$ from spectral graph convolutions, via ChebNet to Kipf-Welling 2017</li>
</ul>
</div>

<h2 class="lesson-title">1. From a Graph to a Matrix: Building the Laplacian</h2>

<div class="calc-highlight"><strong>The whole subject begins with one definition.</strong> Take a graph, write down its adjacency matrix $A$ and its degree matrix $D$, and form $L = D - A$. The resulting matrix is the <em>graph Laplacian</em>. It is the discrete analogue of the continuous Laplacian operator $-\\Delta$, and the rest of the lesson is the story of why its eigenvalues are a goldmine.</div>

<p class="l-text">Let $G = (V, E)$ be an undirected graph with $n = |V|$ vertices. Two matrices are immediate:</p>

<div class="calc-formula"><div class="formula-label">ADJACENCY MATRIX A</div><div class="formula-main">$$A_{ij} = \\begin{cases} 1 & \\text{if } (i, j) \\in E \\\\ 0 & \\text{otherwise} \\end{cases}$$</div><div class="formula-sub">For weighted graphs replace 1 by the edge weight $w_{ij} \\ge 0$. $A$ is symmetric for undirected graphs, has zero diagonal (no self-loops in the usual setup).</div></div>

<div class="calc-formula"><div class="formula-label">DEGREE MATRIX D</div><div class="formula-main">$$D = \\mathrm{diag}(d_1, d_2, \\ldots, d_n), \\qquad d_i = \\sum_{j=1}^{n} A_{ij}$$</div><div class="formula-sub">$D$ is diagonal; the $i$-th diagonal entry is the (weighted) degree of vertex $i$ — the row-sum of $A$.</div></div>

<div class="calc-formula"><div class="formula-label">UNNORMALIZED GRAPH LAPLACIAN</div><div class="formula-main">$$L = D - A$$</div><div class="formula-sub">A symmetric $n \\times n$ matrix. $L_{ii} = d_i$. $L_{ij} = -A_{ij}$ for $i \\ne j$. Row sums are zero by construction.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — A FOUR-VERTEX PATH</div><div class="example-body">Path graph $P_4$: vertices $\\{1, 2, 3, 4\\}$, edges $\\{(1,2), (2,3), (3,4)\\}$. Adjacency $A$:<br><br>$\\quad \\begin{pmatrix} 0 & 1 & 0 & 0 \\\\ 1 & 0 & 1 & 0 \\\\ 0 & 1 & 0 & 1 \\\\ 0 & 0 & 1 & 0 \\end{pmatrix}$<br><br>Degrees: $d_1 = 1, d_2 = 2, d_3 = 2, d_4 = 1$. So $D = \\mathrm{diag}(1, 2, 2, 1)$ and<br><br>$\\quad L = D - A = \\begin{pmatrix} 1 & -1 & 0 & 0 \\\\ -1 & 2 & -1 & 0 \\\\ 0 & -1 & 2 & -1 \\\\ 0 & 0 & -1 & 1 \\end{pmatrix}$<br><br>Every row sums to 0. This is the source of the eigenvalue $\\lambda_1 = 0$ with eigenvector $\\mathbf{1} = (1,1,1,1)^T$.</div></div>

<h2 class="lesson-title">2. Why $L$ Is Symmetric Positive Semidefinite</h2>

<div class="calc-highlight"><strong>The single most important algebraic fact about the Laplacian:</strong> for any vector $x \\in \\mathbb{R}^n$, the quadratic form $x^T L x$ equals one-half of a non-negative sum over edges. This makes $L$ positive semidefinite, and it gives the Laplacian its physical meaning as a measure of how much a function on the vertices "wiggles" along the edges.</div>

<div class="calc-formula"><div class="formula-label">DIRICHLET ENERGY IDENTITY</div><div class="formula-main">$$x^T L x = \\frac{1}{2}\\sum_{(i,j) \\in E} w_{ij} (x_i - x_j)^2$$</div><div class="formula-sub">The Laplacian quadratic form sums the squared differences across every edge, weighted by edge weight. Always non-negative. Zero exactly when $x$ is constant on each connected component.</div></div>

<p class="l-text"><strong>One-line derivation.</strong> Expand $x^T L x = x^T D x - x^T A x = \\sum_i d_i x_i^2 - \\sum_{ij} A_{ij} x_i x_j$. Since $d_i = \\sum_j A_{ij}$, the first sum is $\\sum_{ij} A_{ij} x_i^2$. So</p>

<p class="l-text">$x^T L x = \\sum_{ij} A_{ij} x_i^2 - \\sum_{ij} A_{ij} x_i x_j = \\frac{1}{2}\\sum_{ij} A_{ij} (x_i - x_j)^2$,</p>

<p class="l-text">where the symmetry $A_{ij} = A_{ji}$ produces the factor of $\\frac{1}{2}$. Each unordered edge $\\{i,j\\}$ contributes $A_{ij}(x_i - x_j)^2$ exactly once. The right-hand side is a sum of squares, hence $\\ge 0$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Symmetric</div><div class="card-body">$L^T = L$ because $A$ and $D$ are both symmetric. Hence $L$ has $n$ real eigenvalues and an orthonormal eigenvector basis.</div></div>
<div class="calc-card"><div class="card-title">Positive semidefinite</div><div class="card-body">$x^T L x \\ge 0$ for all $x$. All eigenvalues are non-negative: $0 \\le \\lambda_1 \\le \\lambda_2 \\le \\cdots \\le \\lambda_n$.</div></div>
<div class="calc-card"><div class="card-title">Null vector $\\mathbf{1}$</div><div class="card-body">$L \\mathbf{1} = 0$ because the all-ones vector kills all row sums. So $\\lambda_1 = 0$ always, with eigenvector $\\mathbf{1}$ (constant function on the vertices).</div></div>
<div class="calc-card"><div class="card-title">Smooth = small $x^T L x$</div><div class="card-body">A function $x$ on the vertices is "graph-smooth" when it changes little across edges. The Dirichlet energy quantifies exactly this. Spectral methods are the search for smooth coordinates.</div></div>
</div>

<h2 class="lesson-title">3. The Spectrum: What the Eigenvalues Tell You</h2>

<div class="calc-highlight"><strong>The eigenvalues of the Laplacian, written in order $0 = \\lambda_1 \\le \\lambda_2 \\le \\cdots \\le \\lambda_n$, are read like a fingerprint of the graph.</strong> The number of zero eigenvalues is the number of connected components. The smallest positive eigenvalue $\\lambda_2$ — called the <em>algebraic connectivity</em> or <em>Fiedler value</em> — quantifies how well the graph is connected. The associated eigenvector tells you <em>where</em> the weakest cut lies.</div>

<p class="l-text"><strong>Theorem (multiplicity-zero counts components).</strong> The multiplicity of the eigenvalue $0$ in the spectrum of $L$ equals the number of connected components of $G$.</p>

<p class="l-text"><strong>Proof sketch.</strong> If $G$ has $k$ components $C_1, \\ldots, C_k$, the indicator vectors $\\mathbf{1}_{C_1}, \\ldots, \\mathbf{1}_{C_k}$ (1 on the component, 0 elsewhere) all satisfy $L \\mathbf{1}_{C_j} = 0$ — there are no edges between components, so the Dirichlet energy of an indicator is zero. These $k$ vectors are linearly independent, so the kernel of $L$ has dimension at least $k$. The reverse inequality follows because $x^T L x = 0$ forces $x$ to be constant on every connected component.</p>

<div class="calc-graph"><div id="plot-l5-spec-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the Laplacian spectrum of three graphs. Top trace (one component, a path on 12 vertices): a single zero, then a gentle ramp. Middle trace (two components, two disjoint cycles): two zeros at the start, then the spectrum of each cycle. Bottom trace (three components): three zeros. Counting zero eigenvalues is counting components.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var path=[];for(var k=1;k<=12;k++){path.push(2-2*Math.cos((k-1)*Math.PI/11));}
var twocyc=[];for(var k=1;k<=12;k++){twocyc.push(k<=6?2-2*Math.cos(2*Math.PI*Math.floor((k-1)/2)/6):2-2*Math.cos(2*Math.PI*Math.floor((k-7)/2)/6));}
twocyc=twocyc.sort(function(a,b){return a-b;});
var threecyc=[];for(var k=1;k<=12;k++){threecyc.push(k<=4?2-2*Math.cos(2*Math.PI*Math.floor((k-1)/2)/4):(k<=8?2-2*Math.cos(2*Math.PI*Math.floor((k-5)/2)/4):2-2*Math.cos(2*Math.PI*Math.floor((k-9)/2)/4)));}
threecyc=threecyc.sort(function(a,b){return a-b;});
var idx=[];for(var i=1;i<=12;i++)idx.push(i);
var d1={x:idx,y:path,mode:'lines+markers',name:'one component (path P12)',line:{color:'#3b82f6',width:2.4},marker:{size:7}};
var d2={x:idx,y:twocyc,mode:'lines+markers',name:'two components',line:{color:'#f59e0b',width:2.4},marker:{size:7}};
var d3={x:idx,y:threecyc,mode:'lines+markers',name:'three components',line:{color:'#10b981',width:2.4},marker:{size:7}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'eigenvalue index k',gridcolor:'rgba(255,255,255,0.07)',dtick:1},yaxis:{title:'lambda_k',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l5-spec-en',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-formula"><div class="formula-label">ALGEBRAIC CONNECTIVITY (FIEDLER VALUE)</div><div class="formula-main">$$\\lambda_2(G) = \\min_{\\substack{x \\perp \\mathbf{1} \\\\ \\|x\\| = 1}} x^T L x$$</div><div class="formula-sub">By the Courant-Fischer min-max theorem. The smallest non-trivial Dirichlet energy among unit vectors orthogonal to the constants.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\lambda_2 = 0$</div><div class="card-body">Graph is disconnected. There exist two components, and an indicator-like function with zero Dirichlet energy spans the null space.</div></div>
<div class="calc-card"><div class="card-title">$\\lambda_2$ small</div><div class="card-body">Graph is barely connected. A near-zero-energy function exists — it is almost an indicator of a near-component. This is precisely the bottleneck.</div></div>
<div class="calc-card"><div class="card-title">$\\lambda_2$ large</div><div class="card-body">Graph is robustly connected (an "expander"). No low-energy non-constant function exists. Random walks mix quickly; cuts are expensive.</div></div>
<div class="calc-card"><div class="card-title">Complete graph $K_n$</div><div class="card-body">$\\lambda_2(K_n) = n$. Maximum possible. Every cut destroys $\\Theta(n)$ edges per side.</div></div>
</div>

<h2 class="lesson-title">4. Normalized Laplacians</h2>

<p class="l-text">Two normalized variants of the Laplacian appear constantly in practice — especially when nodes have very different degrees, so the unnormalized $L$ over-weights high-degree vertices.</p>

<div class="calc-formula"><div class="formula-label">SYMMETRIC NORMALIZED LAPLACIAN</div><div class="formula-main">$$L_{\\text{sym}} = D^{-1/2} L D^{-1/2} = I - D^{-1/2} A D^{-1/2}$$</div><div class="formula-sub">Symmetric, positive semidefinite, spectrum in $[0, 2]$. Used by Ng-Jordan-Weiss spectral clustering and by Kipf-Welling GCN.</div></div>

<div class="calc-formula"><div class="formula-label">RANDOM-WALK NORMALIZED LAPLACIAN</div><div class="formula-main">$$L_{\\text{rw}} = D^{-1} L = I - D^{-1} A = I - P$$</div><div class="formula-sub">Not symmetric, but related to the simple random walk transition matrix $P = D^{-1} A$. Eigenvalues lie in $[0, 2]$ and match those of $L_{\\text{sym}}$.</div></div>

<div class="l-note"><strong>Relationship.</strong> $L_{\\text{sym}}$ and $L_{\\text{rw}}$ have the <em>same</em> eigenvalues. If $L_{\\text{rw}} v = \\lambda v$, then $L_{\\text{sym}} (D^{1/2} v) = \\lambda (D^{1/2} v)$. So in practice we often compute eigenvectors of $L_{\\text{sym}}$ (cleanly symmetric, numerically stable) and remember they map to $L_{\\text{rw}}$ eigenvectors by a diagonal rescaling.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — STAR GRAPH</div><div class="example-body">Star $S_n$: one center vertex connected to $n - 1$ leaves. The unnormalized Laplacian has eigenvalues $\\{0, 1, 1, \\ldots, 1, n\\}$ — multiplicity-($n-2$) eigenvalue 1 plus a big eigenvalue $n$ that reflects the over-connected center. The symmetric normalized Laplacian has spectrum $\\{0, 1, 1, \\ldots, 1, 2\\}$. The normalization removes the degree-induced inflation; the maximum eigenvalue is now bounded by 2 regardless of $n$.</div></div>

<h2 class="lesson-title">5. The Fiedler Vector and Spectral Bisection</h2>

<div class="calc-highlight"><strong>The eigenvector $v_2$ belonging to the second eigenvalue $\\lambda_2$ is the celebrated <em>Fiedler vector</em>.</strong> Compute it, look at the sign of each entry, and split the vertices into a "positive" cluster $S^+ = \\{i : v_2(i) > 0\\}$ and a "negative" cluster $S^- = \\{i : v_2(i) < 0\\}$. This single eigenvector recovers a near-optimal bisection of the graph — the algorithmic discovery of Fiedler (1973) and the foundation of every spectral cut algorithm that followed.</div>

<p class="l-text"><strong>Why does the Fiedler vector reveal the cut?</strong> By the Courant-Fischer characterization (section 3), $v_2$ minimizes the Dirichlet energy $\\frac{1}{2}\\sum_{(i,j) \\in E}(x_i - x_j)^2$ over unit vectors orthogonal to $\\mathbf{1}$. A vector that takes one constant value on one half of the graph and another constant value on the other half has very low energy if the two halves are connected by few edges. The optimal continuous relaxation of "which half is each vertex in?" is exactly the Fiedler vector. Rounding by sign recovers a discrete partition that is provably close to the minimum cut (the famous Cheeger inequality of section 7 makes this rigorous).</p>

<div class="calc-formula"><div class="formula-label">SPECTRAL BISECTION ALGORITHM (FIEDLER 1973)</div><div class="formula-main">$$\\text{Step 1: } L v_2 = \\lambda_2 v_2 \\quad \\Longrightarrow \\quad \\text{Step 2: } V_+ = \\{i : v_2(i) > 0\\},\\; V_- = \\{i : v_2(i) \\le 0\\}$$</div><div class="formula-sub">Compute the second eigenvector. Threshold by sign. The two halves give a balanced cut close to optimal.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TWO TRIANGLES JOINED BY ONE EDGE</div><div class="example-body">Vertices $\\{1, 2, 3, 4, 5, 6\\}$, triangle $T_1 = \\{1,2,3\\}$, triangle $T_2 = \\{4,5,6\\}$, single bridge $(3, 4)$.<br><br>Compute the Laplacian, take its second-smallest eigenvector. Numerically you find $v_2 \\approx (-0.4, -0.4, -0.3, +0.3, +0.4, +0.4)^T$ (up to global sign). The signs perfectly separate the two triangles. The bisection cuts <em>exactly</em> the single bridge edge — the optimum cut.<br><br>This is the basic miracle. A pure linear-algebra computation (one eigenvector!) recovers a structural property of the graph (where to cut).</div></div>

<div class="calc-graph"><div id="plot-l5-fiedler-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the Fiedler vector entries for two triangles connected by a single bridge edge. Bars to the left of zero (vertices 1, 2, 3) form one cluster; bars to the right of zero (vertices 4, 5, 6) form the other. The sign of each entry, by itself, recovers the optimal 2-partition. Vertex 3 and vertex 4 sit closest to zero because they are the bridge endpoints — closer to the boundary, smaller magnitude.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[1,2,3,4,5,6];
var y=[-0.42,-0.42,-0.32,0.32,0.42,0.42];
var colors=y.map(function(v){return v<0?'#3b82f6':'#f59e0b';});
var d={x:x,y:y,type:'bar',marker:{color:colors},name:'v_2 entries'};
var line={x:[0.5,6.5],y:[0,0],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'vertex index',gridcolor:'rgba(255,255,255,0.07)',dtick:1},yaxis:{title:'Fiedler vector value v_2(i)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},annotations:[{x:2,y:-0.55,text:'cluster A (negative)',showarrow:false,font:{color:'#3b82f6',size:12}},{x:5,y:0.55,text:'cluster B (positive)',showarrow:false,font:{color:'#f59e0b',size:12}}]};
Plotly.newPlot('plot-l5-fiedler-en',[line,d],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Beyond two clusters.</strong> For $k$ clusters, take eigenvectors $v_2, v_3, \\ldots, v_{k+1}$ and stack them as columns of an $n \\times k$ matrix $U$. Each <em>row</em> of $U$ is a low-dimensional embedding of one vertex. Run k-means on the rows of $U$. This is the Ng-Jordan-Weiss algorithm (2002), the standard recipe for spectral clustering, which we walk through in detail in section 6.</div>

<h2 class="lesson-title">6. Spectral Clustering: The Full Algorithm</h2>

<div class="calc-highlight"><strong>Spectral clustering is the practical application of the Fiedler-vector idea to general data.</strong> Given a set of points (or any data with a notion of pairwise similarity), build a similarity graph, take the smallest eigenvectors of its Laplacian, and run k-means in that low-dimensional eigenspace. The result is a clustering that can discover non-convex clusters — exactly where vanilla k-means fails.</div>

<div class="calc-formula"><div class="formula-label">SPECTRAL CLUSTERING (NG-JORDAN-WEISS 2002)</div><div class="formula-main">$$\\text{data} \\xrightarrow{\\text{similarity}} W \\xrightarrow{\\text{normalize}} L_{\\text{sym}} \\xrightarrow{\\text{eigen}} U \\xrightarrow{\\text{normalize rows}} \\hat{U} \\xrightarrow{\\text{k-means}} \\text{labels}$$</div><div class="formula-sub">A pipeline of five steps. Each step is short. The combined effect: clusters by graph structure rather than Euclidean closeness.</div></div>

<p class="l-text"><strong>Step by step on the canonical "two moons" dataset.</strong></p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Build the similarity graph</div><div class="step-detail">For data points $x_1, \\ldots, x_n \\in \\mathbb{R}^d$, define the Gaussian similarity $W_{ij} = \\exp(-\\|x_i - x_j\\|^2 / (2\\sigma^2))$ for $i \\ne j$, and $W_{ii} = 0$. Alternative: a $k$-nearest-neighbor graph where $W_{ij}$ is 1 if $j$ is among $i$'s $k$ nearest neighbors. The bandwidth $\\sigma$ (or $k$) is a tuning knob — too small, the graph fragments; too large, distant points become artificially similar.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Form the symmetric normalized Laplacian</div><div class="step-detail">Compute the degree matrix $D = \\mathrm{diag}(W \\mathbf{1})$ and the symmetric normalized Laplacian $L_{\\text{sym}} = I - D^{-1/2} W D^{-1/2}$. This is the right matrix to use for clustering — it down-weights the influence of high-degree vertices.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Take the $k$ smallest eigenvectors</div><div class="step-detail">Compute eigenpairs $(\\lambda_1, u_1), \\ldots, (\\lambda_k, u_k)$ of $L_{\\text{sym}}$ with the $k$ smallest eigenvalues. Stack the eigenvectors as columns of $U \\in \\mathbb{R}^{n \\times k}$. (For $k$ clusters you take $k$ vectors. For two moons, $k = 2$.)</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Normalize the rows</div><div class="step-detail">For each row $u_i$ of $U$, divide by its norm to get $\\hat{u}_i = u_i / \\|u_i\\|$. The rows now lie on the unit sphere $S^{k-1}$. This step is what distinguishes Ng-Jordan-Weiss from Shi-Malik — it makes the subsequent k-means scale-invariant.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">k-means in the embedded space</div><div class="step-detail">Run k-means with $k$ clusters on the rows of $\\hat{U}$. The cluster label of row $\\hat{u}_i$ becomes the cluster label of original data point $x_i$. Done.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">WHY IT BEATS K-MEANS ON TWO MOONS</div><div class="example-body">The "two moons" dataset is two interlocking crescents in $\\mathbb{R}^2$. Plain k-means uses Euclidean distance to the cluster mean — but the means of the two interlocking moons sit close together, so k-means cuts the moons horizontally instead of along their natural curves.<br><br>Spectral clustering uses the <em>graph</em> distance. The Gaussian similarity graph has high weight between adjacent points along the same moon (small Euclidean distance) and near-zero weight across the gap between moons. The Fiedler vector therefore puts one moon on the positive side, the other on the negative side, and the two-dimensional embedding of step 3 separates them into two tight blobs. K-means in the embedded space handles those blobs trivially. The "purity" (fraction of points assigned to the correct cluster) jumps from $\\sim$70% with raw k-means to $\\sim$99% with spectral clustering.</div></div>

<div class="calc-graph"><div id="plot-l5-moons-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the two-moons dataset coloured by ground-truth cluster (left, blue and amber crescents). Plain k-means would cut these horizontally because the two cluster means almost coincide. Spectral clustering — which routes through the Laplacian — recovers the natural curve-following separation cleanly.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xA=[],yA=[],xB=[],yB=[];
for(var i=0;i<60;i++){var t=Math.PI*i/59;xA.push(Math.cos(t)+(Math.random()-0.5)*0.08);yA.push(Math.sin(t)+(Math.random()-0.5)*0.08);xB.push(1-Math.cos(t)+(Math.random()-0.5)*0.08);yB.push(-Math.sin(t)+0.5+(Math.random()-0.5)*0.08);}
var dA={x:xA,y:yA,mode:'markers',name:'moon A',marker:{size:8,color:'#3b82f6'}};
var dB={x:xB,y:yB,mode:'markers',name:'moon B',marker:{size:8,color:'#f59e0b'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'x_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l5-moons-en',[dA,dB],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Shi-Malik (2000)</div><div class="card-body">Image segmentation. Uses the random-walk Laplacian $L_{\\text{rw}}$; cluster by signs / by k-means on the eigenvectors. Brought spectral methods to vision.</div></div>
<div class="calc-card"><div class="card-title">Ng-Jordan-Weiss (2002)</div><div class="card-body">The form most widely taught. Uses $L_{\\text{sym}}$. The row-normalization step is the key tweak.</div></div>
<div class="calc-card"><div class="card-title">Laplacian Eigenmaps (Belkin-Niyogi 2003)</div><div class="card-body">Same machinery, used for dimensionality reduction rather than clustering. The smallest eigenvectors give a smooth low-dim embedding that preserves local neighborhoods.</div></div>
<div class="calc-card"><div class="card-title">Bandwidth $\\sigma$</div><div class="card-body">Hyperparameter of the Gaussian similarity. Rule of thumb: a few times the median nearest-neighbor distance. Modern alternative: build a $k$-NN graph and skip the choice.</div></div>
</div>

<h2 class="lesson-title">7. The Cheeger Inequality</h2>

<div class="calc-highlight"><strong>Why is the Fiedler vector a good cut?</strong> The Cheeger inequality, the deepest result in spectral graph theory, says it always is — to within a constant factor of the optimum. Small $\\lambda_2$ means there exists a small cut; conversely, $\\lambda_2$ is provably bounded above by the optimal Cheeger constant. Spectral bisection always returns a cut whose conductance is at most a constant times the best possible conductance.</div>

<div class="calc-formula"><div class="formula-label">CHEEGER CONSTANT (CONDUCTANCE)</div><div class="formula-main">$$h(G) = \\min_{\\emptyset \\ne S \\subsetneq V} \\frac{|\\partial S|}{\\min(|S|, |V \\setminus S|)}$$</div><div class="formula-sub">$\\partial S$ is the set of edges crossing the boundary of $S$. The minimum is over all non-trivial bipartitions. $h(G)$ small = there is a small cut that separates a roughly half-sized chunk from the rest.</div></div>

<div class="calc-formula"><div class="formula-label">CHEEGER'S INEQUALITY</div><div class="formula-main">$$\\frac{\\lambda_2}{2} \\;\\le\\; h(G) \\;\\le\\; \\sqrt{2\\,\\lambda_2 \\cdot d_{\\max}}$$</div><div class="formula-sub">Two-sided bound (for the unnormalized Laplacian; with $L_{\\text{sym}}$, the bound becomes $\\lambda_2 / 2 \\le h(G) \\le \\sqrt{2\\lambda_2}$). $\\lambda_2$ and $h(G)$ control each other up to a square-root factor.</div></div>

<p class="l-text"><strong>Proof sketch (the upper bound, by spectral bisection).</strong> Compute the Fiedler vector $v_2$. Sort its entries; sweep a threshold from the smallest to the largest. At each threshold, partition $V$ into "below" and "above", and compute the conductance of that partition. The Cheeger inequality guarantees that <em>at least one</em> threshold among the $n - 1$ sweep cuts yields a partition whose conductance satisfies $\\Phi \\le \\sqrt{2 \\lambda_2 d_{\\max}}$. This is the famous "sweep cut" rounding — the algorithmic content of Cheeger.</p>

<p class="l-text"><strong>Why the lower bound holds.</strong> Consider the indicator $x = \\mathbf{1}_S - (|S|/|V \\setminus S|)\\mathbf{1}_{V \\setminus S}$, properly normalized so $x \\perp \\mathbf{1}$. A short computation shows $x^T L x / x^T x \\approx 2 \\cdot |\\partial S| / \\min(|S|, |V \\setminus S|)$ (up to a constant depending on the normalization), so $\\lambda_2 \\le 2 h(G)$. Rearrange to $h(G) \\ge \\lambda_2 / 2$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\lambda_2 \\approx 0$</div><div class="card-body">Cheeger constant is small. The graph has a near-bridge — a small set of edges whose removal disconnects a substantial chunk.</div></div>
<div class="calc-card"><div class="card-title">$\\lambda_2 = \\Theta(1)$</div><div class="card-body">Graph is an "expander" — any cut destroys a constant fraction of edges. Random walks mix in $O(\\log n)$ steps. Critical in theoretical CS.</div></div>
<div class="calc-card"><div class="card-title">Algorithmic upshot</div><div class="card-body">Spectral bisection (Fiedler 1973) finds a cut within a $\\sqrt{2 \\lambda_2}$ factor of optimal — an iconic example of a continuous relaxation giving a provable discrete approximation.</div></div>
<div class="calc-card"><div class="card-title">Mixing time</div><div class="card-body">For a lazy random walk, mixing time scales like $1 / \\lambda_2$. Algebraic connectivity is therefore also a direct proxy for how fast a Markov chain on the graph reaches stationarity.</div></div>
</div>

<h2 class="lesson-title">8. Graph Fourier Transform and Spectral Convolution</h2>

<div class="calc-highlight"><strong>The eigenvectors of the Laplacian are the "Fourier basis" of the graph.</strong> Just as the classical Fourier transform writes a function on the line as a sum of sinusoids — the eigenfunctions of the continuous Laplacian — the graph Fourier transform writes a function on the vertices as a linear combination of Laplacian eigenvectors. This single analogy is the gateway to spectral graph neural networks.</div>

<div class="calc-formula"><div class="formula-label">GRAPH FOURIER TRANSFORM</div><div class="formula-main">$$\\hat{x} = U^T x, \\qquad x = U \\hat{x}$$</div><div class="formula-sub">where $L = U \\Lambda U^T$ is the eigendecomposition. $U$ is orthogonal: columns are the eigenvectors $u_1, \\ldots, u_n$ (the "graph Fourier basis"). $\\hat{x}_k = u_k^T x$ is the "$k$-th Fourier coefficient" of the signal $x$ on the graph.</div></div>

<div class="calc-formula"><div class="formula-label">SPECTRAL GRAPH CONVOLUTION (BRUNA-ZAREMBA-SZLAM-LECUN 2014)</div><div class="formula-main">$$g \\star x = U \\cdot \\mathrm{diag}(\\hat{g}) \\cdot U^T x = U \\, g(\\Lambda) \\, U^T x$$</div><div class="formula-sub">Filtering on a graph: transform the signal to the spectral domain, multiply by a frequency-response $g(\\Lambda)$ (diagonal in the eigenbasis), transform back. Exact analogue of $f \\star x$ becoming pointwise multiplication in classical Fourier.</div></div>

<p class="l-text"><strong>The big idea, in one line.</strong> Define convolution in the spectral domain. Learn the filter $g(\\Lambda)$ as a function of the Laplacian eigenvalues. The whole thing is automatically permutation-equivariant on the graph, just as classical convolution is translation-equivariant on a regular grid.</p>

<div class="l-note"><strong>The catch with Bruna 2014.</strong> Computing $U$ explicitly costs $O(n^3)$ (a full eigendecomposition), and a forward pass costs $O(n^2)$ per filter. Spectral GNNs in their original form do not scale beyond small graphs. The two breakthroughs that followed — ChebNet (Defferrard 2016) and GCN (Kipf-Welling 2017) — solve precisely this problem by replacing the explicit eigendecomposition with a localized polynomial approximation.</div>

<h2 class="lesson-title">9. From ChebNet (Defferrard 2016) to GCN (Kipf-Welling 2017)</h2>

<div class="calc-highlight"><strong>The simplification that powers modern graph machine learning.</strong> Defferrard, Bresson, Vandergheynst (2016) replaced Bruna's full spectral filter with a Chebyshev polynomial in the Laplacian, giving $O(K |E|)$ instead of $O(n^2)$ per layer and localizing each filter to a $K$-hop neighborhood. Kipf and Welling (2017) then specialized $K = 1$ and rescaled to obtain the famous GCN propagation rule. Almost every GNN architecture today inherits this skeleton.</div>

<p class="l-text"><strong>ChebNet (Defferrard et al., 2016).</strong> Approximate the filter $g_\\theta(\\Lambda)$ by a $K$-th order Chebyshev polynomial $T_k$:</p>

<div class="calc-formula"><div class="formula-label">CHEBNET FILTER</div><div class="formula-main">$$g_\\theta(L) \\;\\approx\\; \\sum_{k=0}^{K} \\theta_k \\, T_k(\\tilde{L}), \\qquad \\tilde{L} = \\frac{2}{\\lambda_{\\max}} L - I$$</div><div class="formula-sub">$\\tilde{L}$ is the eigenvalue-rescaled Laplacian, with spectrum in $[-1, 1]$ where Chebyshev polynomials are well-behaved. $T_0(x) = 1$, $T_1(x) = x$, $T_k(x) = 2x T_{k-1}(x) - T_{k-2}(x)$ — computed by sparse matrix-vector products, never touching $U$.</div></div>

<p class="l-text"><strong>Cost and locality.</strong> Each forward pass costs $O(K |E|)$ (a matrix-vector product against the sparse Laplacian, $K$ times). The filter is exactly $K$-localized: the output at vertex $i$ depends only on vertices within $K$ hops. No eigendecomposition required.</p>

<div class="calc-formula"><div class="formula-label">KIPF-WELLING GCN — THE SIMPLIFICATION</div><div class="formula-main">$$K = 1, \\quad \\lambda_{\\max} \\approx 2, \\quad \\theta_0 = -\\theta_1 = \\theta \\;\\Longrightarrow\\; g_\\theta \\star x \\approx \\theta\\,(I + D^{-1/2} A D^{-1/2})\\,x$$</div><div class="formula-sub">A radical simplification of ChebNet. One Chebyshev coefficient. One eigenvalue assumption ($\\lambda_{\\max} \\approx 2$, true for many real graphs). One tying-of-parameters trick.</div></div>

<p class="l-text"><strong>The renormalization trick.</strong> Substituting $A \\to \\tilde{A} = A + I$ (self-loops) and $D \\to \\tilde{D} = \\tilde{A} \\mathbf{1}$ stabilizes the operator. The final per-layer rule is the now-iconic:</p>

<div class="calc-formula"><div class="formula-label">GCN PROPAGATION RULE (KIPF-WELLING 2017)</div><div class="formula-main">$$H^{(l+1)} = \\sigma\\!\\left( \\tilde{D}^{-1/2} \\tilde{A} \\tilde{D}^{-1/2} H^{(l)} W^{(l)} \\right)$$</div><div class="formula-sub">$H^{(l)}$ is the matrix of node features at layer $l$; $W^{(l)}$ is the trainable weight matrix; $\\sigma$ is a non-linearity (ReLU). $\\tilde{A} = A + I$ adds self-loops; $\\tilde{D}$ is the corresponding degree matrix. Three ingredients: normalize, propagate, transform-and-activate.</div></div>

<p class="l-text"><strong>Reading the formula.</strong> The matrix $\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ is a row-and-column-normalized version of the adjacency-with-self-loops. Multiplying $H^{(l)}$ by it averages each node's features with the features of its neighbors (and itself, thanks to the self-loop). Multiplying by $W^{(l)}$ projects into the next feature dimension. Applying $\\sigma$ introduces non-linearity. Stack two or three such layers, attach a softmax classifier on top, and you have a working semi-supervised node-classification model.</p>

<div class="calc-graph"><div id="plot-l5-prop-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the effect of repeated GCN propagation on a path graph with a single "hot" node at position 6. After one layer the heat has spread to neighbors 5 and 7; after two layers, to 4 and 8; after three layers, the signal looks like a discrete Gaussian centered at 6. GCN layers literally diffuse features along graph edges. Too many layers and the diffusion smooths the signal to a constant — this is the "oversmoothing" problem of deep GCNs.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=11;var init=new Array(n).fill(0);init[5]=1;
function smooth(s){var out=new Array(n).fill(0);for(var i=0;i<n;i++){var sum=s[i]*0.5;var c=0.5;if(i>0){sum+=s[i-1]*0.25;c+=0.25;}if(i<n-1){sum+=s[i+1]*0.25;c+=0.25;}out[i]=sum/c;}return out;}
var s0=init.slice();
var s1=smooth(s0);
var s2=smooth(s1);
var s3=smooth(s2);
var xs=[];for(var i=0;i<n;i++)xs.push(i+1);
var d0={x:xs,y:s0,mode:'lines+markers',name:'layer 0 (initial)',line:{color:'#f87171',width:2.6},marker:{size:7}};
var d1={x:xs,y:s1,mode:'lines+markers',name:'layer 1',line:{color:'#f59e0b',width:2.4},marker:{size:7}};
var d2={x:xs,y:s2,mode:'lines+markers',name:'layer 2',line:{color:'#10b981',width:2.4},marker:{size:7}};
var d3={x:xs,y:s3,mode:'lines+markers',name:'layer 3',line:{color:'#3b82f6',width:2.4},marker:{size:7}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'vertex position',gridcolor:'rgba(255,255,255,0.07)',dtick:1},yaxis:{title:'feature value',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l5-prop-en',[d0,d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Per-layer cost</div><div class="card-body">$O(|E|)$ — sparse matrix-vector. Scales linearly with edge count, not with $n^2$ as Bruna 2014.</div></div>
<div class="calc-card"><div class="card-title">Permutation equivariance</div><div class="card-body">Reorder the nodes (and rows of $H$) and the output is reordered identically. Built into the spectral formulation; preserved by GCN.</div></div>
<div class="calc-card"><div class="card-title">Receptive field</div><div class="card-body">A $K$-layer GCN sees the $K$-hop neighborhood of each node. Two to three layers is typical — beyond that, oversmoothing kicks in.</div></div>
<div class="calc-card"><div class="card-title">Beyond GCN</div><div class="card-body">GraphSAGE, GAT (attention on edges), GIN (provably as expressive as Weisfeiler-Lehman), and message-passing neural networks all inherit the propagate-then-update skeleton.</div></div>
</div>

<h2 class="lesson-title">10. Applications and Where to Go Next</h2>

<p class="l-text">Spectral methods built or inspired large parts of modern graph machine learning. A non-exhaustive list of where the ideas of this lesson show up:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Image segmentation</div><div class="card-body">Shi-Malik (2000) normalized cuts: build a pixel similarity graph, take the Fiedler vector, threshold. The first practical use of spectral clustering at scale.</div></div>
<div class="calc-card"><div class="card-title">Community detection</div><div class="card-body">Find dense subgroups in social networks, citation graphs, biological networks. Spectral modularity (Newman 2006) uses $L$-like operators.</div></div>
<div class="calc-card"><div class="card-title">Dimensionality reduction</div><div class="card-body">Laplacian Eigenmaps (Belkin-Niyogi 2003), Diffusion Maps (Coifman-Lafon 2006). Non-linear manifold learning by smallest Laplacian eigenvectors.</div></div>
<div class="calc-card"><div class="card-title">Mesh and shape processing</div><div class="card-body">3D geometry — Laplacian eigenfunctions are the natural Fourier basis on a triangle mesh. Used in shape correspondence and remeshing.</div></div>
<div class="calc-card"><div class="card-title">Molecular property prediction</div><div class="card-body">Predict solubility, toxicity, binding energy from molecule-as-graph. GCN, MPNN, SchNet, and equivariant architectures are direct descendants.</div></div>
<div class="calc-card"><div class="card-title">Recommender systems</div><div class="card-body">User-item bipartite graphs. PinSage (Pinterest), LightGCN. Spectral structure underpins collaborative filtering at industrial scale.</div></div>
<div class="calc-card"><div class="card-title">Knowledge graphs</div><div class="card-body">Reasoning over relational facts. R-GCN, CompGCN — message-passing with relation-specific weights, but the geometry is still Laplacian.</div></div>
<div class="calc-card"><div class="card-title">PageRank</div><div class="card-body">The classic Google ranking algorithm is the dominant eigenvector of a normalized adjacency. Same eigen-machinery, different normalization.</div></div>
</div>

<div class="l-note"><strong>What to read next.</strong> For theory: Spielman's <em>Spectral and Algebraic Graph Theory</em> manuscript. For ML: Hamilton's <em>Graph Representation Learning</em> book. For the historical arc: Fiedler 1973 (the original Fiedler-vector paper), Shi-Malik 2000 (normalized cut), Ng-Jordan-Weiss 2002 (spectral clustering), Belkin-Niyogi 2003 (Laplacian Eigenmaps), Bruna et al. 2014 (spectral GNN), Defferrard et al. 2016 (ChebNet), Kipf-Welling 2017 (GCN). Reading the seven papers in order is the cleanest possible tour of spectral graph theory's transformation into a machine-learning backbone.</div>

<h2 class="lesson-title">11. Pyodide Lab — Compute, Cluster, Propagate</h2>

<p class="l-text">The code below does five things in sequence: (1) build the Laplacian of a small two-cluster graph and print its spectrum; (2) compute the Fiedler vector and verify it cleanly bisects the graph; (3) run spectral clustering on a 200-point two-moons dataset and compare with plain k-means; (4) implement a single-layer GCN forward pass and watch features propagate along a path; (5) measure the "oversmoothing" effect by running many GCN steps. Click <strong>RUN</strong> and then change the numbers — every result you see is predicted by the formulas of sections 1 through 9.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_moons

<span class="cm"># ---------- 1. Two-cluster graph: 6 nodes, two triangles + bridge ----------</span>
A = np.array([
    [<span class="num">0</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>],
    [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>],
    [<span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">0.2</span>, <span class="num">0</span>, <span class="num">0</span>],
    [<span class="num">0</span>, <span class="num">0</span>, <span class="num">0.2</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">1</span>],
    [<span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>],
    [<span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>]
], dtype=<span class="ty">float</span>)
D = np.diag(A.sum(axis=<span class="num">1</span>))
L = D - A

vals = np.linalg.eigvalsh(L)
<span class="fn">print</span>(<span class="str">"Laplacian eigenvalues:"</span>, np.round(vals, <span class="num">3</span>))
<span class="cm"># Expect: smallest is 0 (one component); second smallest is small (weak bridge).</span>

<span class="cm"># ---------- 2. Fiedler vector splits the graph ----------</span>
eigvals, eigvecs = np.linalg.eigh(L)
fiedler = eigvecs[:, <span class="num">1</span>]
<span class="fn">print</span>(<span class="str">"Fiedler vector:"</span>, fiedler.round(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Bisection by sign:"</span>, (fiedler &gt; <span class="num">0</span>).astype(<span class="ty">int</span>))
<span class="cm"># Expect cluster labels matching the two triangles {0,1,2} and {3,4,5}.</span>

<span class="cm"># ---------- 3. Spectral clustering on two moons ----------</span>
X, y_true = make_moons(n_samples=<span class="num">200</span>, noise=<span class="num">0.07</span>, random_state=<span class="num">0</span>)

<span class="cm"># Gaussian similarity matrix</span>
<span class="kw">from</span> scipy.spatial.distance <span class="kw">import</span> cdist
dist = cdist(X, X)
sigma = <span class="num">0.25</span>
W = np.exp(-dist**<span class="num">2</span> / (<span class="num">2</span>*sigma**<span class="num">2</span>))
np.fill_diagonal(W, <span class="num">0</span>)

<span class="cm"># Symmetric normalized Laplacian</span>
d = W.sum(axis=<span class="num">1</span>)
D_inv_sqrt = np.diag(<span class="num">1</span>/np.sqrt(d))
L_sym = np.eye(<span class="fn">len</span>(X)) - D_inv_sqrt @ W @ D_inv_sqrt

<span class="cm"># Smallest two eigenvectors, row-normalize</span>
eigvals, eigvecs = np.linalg.eigh(L_sym)
U = eigvecs[:, :<span class="num">2</span>]
U = U / (np.linalg.norm(U, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) + <span class="num">1e-12</span>)

spec_labels = KMeans(n_clusters=<span class="num">2</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).fit_predict(U)
raw_labels  = KMeans(n_clusters=<span class="num">2</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).fit_predict(X)

<span class="kw">def</span> <span class="fn">purity</span>(pred, true):
    a = np.mean(pred == true)
    b = np.mean(pred == (<span class="num">1</span> - true))
    <span class="kw">return</span> <span class="fn">max</span>(a, b)

<span class="fn">print</span>(<span class="str">f"raw k-means purity:     {<span class="fn">purity</span>(raw_labels, y_true):.3f}"</span>)
<span class="fn">print</span>(<span class="str">f"spectral cluster purity: {<span class="fn">purity</span>(spec_labels, y_true):.3f}"</span>)
<span class="cm"># Spectral typically ~0.99 vs raw k-means ~0.75 on moons.</span>

<span class="cm"># ---------- 4. Single-layer GCN forward pass on a path graph ----------</span>
n = <span class="num">11</span>
A_path = np.zeros((n, n))
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n - <span class="num">1</span>):
    A_path[i, i+<span class="num">1</span>] = A_path[i+<span class="num">1</span>, i] = <span class="num">1</span>
A_tilde = A_path + np.eye(n)                 <span class="cm"># self-loops</span>
d_tilde = A_tilde.sum(axis=<span class="num">1</span>)
D_inv_sqrt = np.diag(<span class="num">1</span>/np.sqrt(d_tilde))
A_hat = D_inv_sqrt @ A_tilde @ D_inv_sqrt    <span class="cm"># renormalized propagation operator</span>

H = np.zeros((n, <span class="num">1</span>)); H[<span class="num">5</span>, <span class="num">0</span>] = <span class="num">1.0</span>      <span class="cm"># single hot node at position 5</span>
W = np.array([[<span class="num">1.0</span>]])                       <span class="cm"># identity weight, no transform</span>

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>):
    <span class="fn">print</span>(<span class="str">f"after {step} GCN steps:"</span>, H.flatten().round(<span class="num">3</span>))
    H = A_hat @ H @ W                        <span class="cm"># GCN propagation, no nonlinearity</span>

<span class="cm"># ---------- 5. Oversmoothing: many steps converge to a constant ----------</span>
H = np.random.RandomState(<span class="num">0</span>).randn(n, <span class="num">1</span>)
energies = []
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">60</span>):
    H = A_hat @ H
    energies.append(<span class="fn">float</span>(H.std()))
<span class="fn">print</span>(<span class="str">f"std after 60 propagations: {energies[-1]:.6f}"</span>)
<span class="cm"># Std collapses toward 0: too many layers and signals merge into the graph mean.</span></code></pre></div>

<p class="l-text"><strong>Things to try.</strong> Change the bridge weight 0.2 to 0.01 in step 1 — the Fiedler value $\\lambda_2$ shrinks toward zero and the graph approaches two components. Change $\\sigma = 0.25$ to $\\sigma = 1.0$ in step 3 — the similarity graph becomes too dense, the moons blend, spectral purity drops. Change the path graph in step 4 to a small random graph (sample $A$ with edge probability 0.2) — the diffusion pattern changes shape but oversmoothing still wins eventually.</p>

<h2 class="lesson-title">Summary</h2>

<p class="l-text">The graph Laplacian $L = D - A$ is the single most useful matrix in graph theory. It is symmetric positive semidefinite, its smallest eigenvalue is 0 with multiplicity equal to the number of connected components, and the second-smallest eigenvalue $\\lambda_2$ — Fiedler's algebraic connectivity — measures how well the graph holds together. The corresponding Fiedler vector recovers the optimal bisection up to a constant factor of the Cheeger constant (Cheeger inequality: $\\lambda_2/2 \\le h(G) \\le \\sqrt{2 \\lambda_2}$). Spectral clustering (Shi-Malik 2000, Ng-Jordan-Weiss 2002) extends this idea to arbitrary data via a similarity graph and recovers non-convex clusters like two interlocking moons where plain k-means fails. Spectral graph neural networks (Bruna et al. 2014) define convolution as multiplication in the Laplacian eigenbasis. ChebNet (Defferrard et al. 2016) replaces the explicit eigendecomposition with a $K$-th-order Chebyshev polynomial, achieving $O(K|E|)$ cost and $K$-hop locality. Kipf and Welling (2017) further specialized to $K = 1$ with the renormalization $\\tilde{A} = A + I$, producing the GCN propagation rule $H^{(l+1)} = \\sigma(\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2} H^{(l)} W^{(l)})$ — three or four lines of math, but the spine of nearly every modern graph neural network. The next lesson generalizes to knowledge graphs and relational reasoning, where multiple edge types interact and the spectral framework is extended to relation-specific operators.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Spektral çizge teorisi, doğrusal cebir ile çizgeler arasındaki köprüdür.</strong> Herhangi bir çizge alın — bir sosyal ağ, bir moleküler iskelet, bir yol haritası — ve ondan tek bir matris inşa edebilirsiniz; bu matrisin özdeğerleri çizgenin neredeyse her ilginç özelliğini kodlar: kaç bağlı bileşeni olduğunu, ikiye bölmenin ne kadar kolay olduğunu, düşük boyutlardaki "doğal" gömülmesinin neye benzediğini, hatta bir Çizge Sinir Ağı'nın bilgiyi kenarları boyunca nasıl yayması gerektiğini. O matris <em>çizge Laplacian</em>'ıdır ve bu ders, spektrumunun size ne söylediğinin titiz bir incelemesidir.</p>

<p class="l-text">Dersin sonunda $L = D - A$'nın özdeğerlerine bakacak ve topolojiyi okuyacaksınız: $\\lambda = 0$'ın çokluğu bağlı bileşen sayısıdır, en küçük ikinci özdeğer $\\lambda_2$ (cebirsel bağlılık) çizgenin ne kadar sıkı tutunduğunu ölçer ve $\\lambda_2$'ye ait özvektör — Fiedler vektörü — çizgeyi iki doğal kümeye böler. Oradan spektral kümelemeye (Shi-Malik 2000, Ng-Jordan-Weiss 2002) ve modern Graph Convolutional Network'ün spektral türetilmesine (Bruna 2014, Defferrard 2016 ChebNet, Kipf-Welling 2017) kısa bir sıçrayış vardır. Spektral yöntemler, çizge makine öğrenmesinin tarihsel temelidir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Çizge Laplacian $L = D - A$'yı temel ilkelerden türetmek ve simetrik pozitif yarı-belirli olduğunu ispatlamak</li>
<li>Bir çizgenin bağlı bileşen sayısını doğrudan Laplacian spektrumundaki $\\lambda = 0$'ın çokluğundan okumak</li>
<li>Fiedler vektörünü hesaplamak ve işaretlerini kullanarak çizgeyi en zayıf kesimi boyunca ikiye bölmek</li>
<li>İki ay (two moons) gibi konveks olmayan bir veri seti üzerinde Shi-Malik / Ng-Jordan-Weiss spektral kümeleme algoritmasını baştan sona çalıştırmak — sade k-means'in başarısız olduğu yerde</li>
<li>Cheeger eşitsizliğini ifade etmek ve küçük $\\lambda_2$'nin neden küçük çizge darboğazı anlamına geldiğini açıklamak</li>
<li>Modern GCN yayılım kuralı $H^{(l+1)} = \\sigma(\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2} H^{(l)} W^{(l)})$'i spektral çizge konvolüsyonlarından, ChebNet üzerinden Kipf-Welling 2017'ye türetmek</li>
</ul>
</div>

<h2 class="lesson-title">1. Çizgeden Matrise: Laplacian İnşası</h2>

<div class="calc-highlight"><strong>Tüm konu tek bir tanımla başlar.</strong> Bir çizge alın, komşuluk matrisi $A$ ve derece matrisi $D$'yi yazın ve $L = D - A$ kurun. Ortaya çıkan matris <em>çizge Laplacian</em>'ıdır. Sürekli Laplacian operatörü $-\\Delta$'nın ayrık karşılığıdır ve dersin geri kalanı, özdeğerlerinin neden bir altın madeni olduğunun hikâyesidir.</div>

<p class="l-text">$G = (V, E)$, $n = |V|$ köşesi olan yönsüz bir çizge olsun. İki matris hemen ortaya çıkar:</p>

<div class="calc-formula"><div class="formula-label">KOMŞULUK MATRİSİ A</div><div class="formula-main">$$A_{ij} = \\begin{cases} 1 & \\text{eger } (i, j) \\in E \\\\ 0 & \\text{aksi takdirde} \\end{cases}$$</div><div class="formula-sub">Ağırlıklı çizgeler için 1'i kenar ağırlığı $w_{ij} \\ge 0$ ile değiştirin. $A$ yönsüz çizgeler için simetriktir, köşegeni sıfırdır (olağan kurulumda öz-döngü yok).</div></div>

<div class="calc-formula"><div class="formula-label">DERECE MATRİSİ D</div><div class="formula-main">$$D = \\mathrm{diag}(d_1, d_2, \\ldots, d_n), \\qquad d_i = \\sum_{j=1}^{n} A_{ij}$$</div><div class="formula-sub">$D$ köşegendir; $i$-inci köşegen girdisi $i$ köşesinin (ağırlıklı) derecesidir — $A$'nın satır toplamı.</div></div>

<div class="calc-formula"><div class="formula-label">NORMALİZE EDİLMEMİŞ ÇİZGE LAPLACIAN</div><div class="formula-main">$$L = D - A$$</div><div class="formula-sub">Simetrik bir $n \\times n$ matris. $L_{ii} = d_i$. $i \\ne j$ için $L_{ij} = -A_{ij}$. Satır toplamları yapısal olarak sıfırdır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DÖRT KÖŞELİ YOL</div><div class="example-body">Yol çizgesi $P_4$: köşeler $\\{1, 2, 3, 4\\}$, kenarlar $\\{(1,2), (2,3), (3,4)\\}$. Komşuluk $A$:<br><br>$\\quad \\begin{pmatrix} 0 & 1 & 0 & 0 \\\\ 1 & 0 & 1 & 0 \\\\ 0 & 1 & 0 & 1 \\\\ 0 & 0 & 1 & 0 \\end{pmatrix}$<br><br>Dereceler: $d_1 = 1, d_2 = 2, d_3 = 2, d_4 = 1$. Yani $D = \\mathrm{diag}(1, 2, 2, 1)$ ve<br><br>$\\quad L = D - A = \\begin{pmatrix} 1 & -1 & 0 & 0 \\\\ -1 & 2 & -1 & 0 \\\\ 0 & -1 & 2 & -1 \\\\ 0 & 0 & -1 & 1 \\end{pmatrix}$<br><br>Her satır 0'a toplanır. Bu, özvektörü $\\mathbf{1} = (1,1,1,1)^T$ olan özdeğer $\\lambda_1 = 0$'ın kaynağıdır.</div></div>

<h2 class="lesson-title">2. $L$ Neden Simetrik Pozitif Yarı-Belirli</h2>

<div class="calc-highlight"><strong>Laplacian hakkında en önemli tek cebirsel olgu:</strong> Herhangi bir vektör $x \\in \\mathbb{R}^n$ için kuadratik form $x^T L x$, kenarlar üzerinde negatif olmayan bir toplamın yarısına eşittir. Bu, $L$'yi pozitif yarı-belirli yapar ve Laplacian'a, köşeler üzerindeki bir fonksiyonun kenarlar boyunca ne kadar "salındığının" ölçüsü olarak fiziksel anlamını verir.</div>

<div class="calc-formula"><div class="formula-label">DIRICHLET ENERJİSİ ÖZDEŞLİĞİ</div><div class="formula-main">$$x^T L x = \\frac{1}{2}\\sum_{(i,j) \\in E} w_{ij} (x_i - x_j)^2$$</div><div class="formula-sub">Laplacian kuadratik formu, her kenar boyunca farkların karelerini kenar ağırlığıyla ağırlıklayarak toplar. Her zaman negatif değildir. Sıfır olması için $x$ her bağlı bileşen üzerinde sabit olmalıdır.</div></div>

<p class="l-text"><strong>Tek satırlık türetme.</strong> $x^T L x = x^T D x - x^T A x = \\sum_i d_i x_i^2 - \\sum_{ij} A_{ij} x_i x_j$. $d_i = \\sum_j A_{ij}$ olduğundan, ilk toplam $\\sum_{ij} A_{ij} x_i^2$ olur. Yani</p>

<p class="l-text">$x^T L x = \\sum_{ij} A_{ij} x_i^2 - \\sum_{ij} A_{ij} x_i x_j = \\frac{1}{2}\\sum_{ij} A_{ij} (x_i - x_j)^2$,</p>

<p class="l-text">burada $A_{ij} = A_{ji}$ simetrisi $\\frac{1}{2}$ çarpanını üretir. Her yönsüz kenar $\\{i,j\\}$ tam olarak bir kez $A_{ij}(x_i - x_j)^2$ katkısı sağlar. Sağ taraf bir kare toplamıdır, dolayısıyla $\\ge 0$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Simetrik</div><div class="card-body">$L^T = L$ çünkü $A$ ve $D$ ikisi de simetriktir. Bu yüzden $L$'nin $n$ reel özdeğeri ve dik bir özvektör tabanı vardır.</div></div>
<div class="calc-card"><div class="card-title">Pozitif yarı-belirli</div><div class="card-body">Her $x$ için $x^T L x \\ge 0$. Tüm özdeğerler negatif değildir: $0 \\le \\lambda_1 \\le \\lambda_2 \\le \\cdots \\le \\lambda_n$.</div></div>
<div class="calc-card"><div class="card-title">Sıfır vektörü $\\mathbf{1}$</div><div class="card-body">$L \\mathbf{1} = 0$ çünkü tüm-bir vektörü tüm satır toplamlarını öldürür. Yani her zaman $\\lambda_1 = 0$, özvektör $\\mathbf{1}$ (köşeler üzerinde sabit fonksiyon).</div></div>
<div class="calc-card"><div class="card-title">Pürüzsüz = küçük $x^T L x$</div><div class="card-body">Köşeler üzerindeki bir $x$ fonksiyonu, kenarlar boyunca az değiştiğinde "çizge-pürüzsüz"dür. Dirichlet enerjisi tam olarak bunu niceler. Spektral yöntemler, pürüzsüz koordinatların aranmasıdır.</div></div>
</div>

<h2 class="lesson-title">3. Spektrum: Özdeğerler Size Neyi Söyler</h2>

<div class="calc-highlight"><strong>Laplacian'ın özdeğerleri, $0 = \\lambda_1 \\le \\lambda_2 \\le \\cdots \\le \\lambda_n$ sırasıyla yazıldığında, çizgenin parmak izi gibi okunur.</strong> Sıfır özdeğerlerin sayısı bağlı bileşen sayısıdır. En küçük pozitif özdeğer $\\lambda_2$ — <em>cebirsel bağlılık</em> ya da <em>Fiedler değeri</em> denir — çizgenin ne kadar iyi bağlandığını ölçer. İlişkili özvektör, en zayıf kesimin <em>nerede</em> olduğunu söyler.</div>

<p class="l-text"><strong>Teorem (sıfır çokluğu bileşenleri sayar).</strong> $L$'nin spektrumunda $0$ özdeğerinin çokluğu, $G$'nin bağlı bileşen sayısına eşittir.</p>

<p class="l-text"><strong>İspat eskizi.</strong> $G$'nin $k$ bileşeni $C_1, \\ldots, C_k$ varsa, gösterge vektörleri $\\mathbf{1}_{C_1}, \\ldots, \\mathbf{1}_{C_k}$ (bileşende 1, başka yerde 0) hepsi $L \\mathbf{1}_{C_j} = 0$'ı sağlar — bileşenler arasında kenar yok, dolayısıyla bir göstergenin Dirichlet enerjisi sıfır. Bu $k$ vektör doğrusal bağımsızdır, yani $L$'nin çekirdeği en az $k$ boyutludur. Ters eşitsizlik, $x^T L x = 0$'ın $x$'i her bağlı bileşen üzerinde sabit olmaya zorlamasından gelir.</p>

<div class="calc-graph"><div id="plot-l5-spec-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> üç çizgenin Laplacian spektrumu. Üst eğri (bir bileşen, 12 köşede yol): tek sıfır, ardından nazik bir tırmanış. Orta eğri (iki bileşen, iki ayrık döngü): başlangıçta iki sıfır, ardından her döngünün spektrumu. Alt eğri (üç bileşen): üç sıfır. Sıfır özdeğerlerini saymak, bileşen saymaktır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var path=[];for(var k=1;k<=12;k++){path.push(2-2*Math.cos((k-1)*Math.PI/11));}
var twocyc=[];for(var k=1;k<=12;k++){twocyc.push(k<=6?2-2*Math.cos(2*Math.PI*Math.floor((k-1)/2)/6):2-2*Math.cos(2*Math.PI*Math.floor((k-7)/2)/6));}
twocyc=twocyc.sort(function(a,b){return a-b;});
var threecyc=[];for(var k=1;k<=12;k++){threecyc.push(k<=4?2-2*Math.cos(2*Math.PI*Math.floor((k-1)/2)/4):(k<=8?2-2*Math.cos(2*Math.PI*Math.floor((k-5)/2)/4):2-2*Math.cos(2*Math.PI*Math.floor((k-9)/2)/4)));}
threecyc=threecyc.sort(function(a,b){return a-b;});
var idx=[];for(var i=1;i<=12;i++)idx.push(i);
var d1={x:idx,y:path,mode:'lines+markers',name:'tek bileşen (P12 yolu)',line:{color:'#3b82f6',width:2.4},marker:{size:7}};
var d2={x:idx,y:twocyc,mode:'lines+markers',name:'iki bileşen',line:{color:'#f59e0b',width:2.4},marker:{size:7}};
var d3={x:idx,y:threecyc,mode:'lines+markers',name:'üç bileşen',line:{color:'#10b981',width:2.4},marker:{size:7}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'özdeğer indeksi k',gridcolor:'rgba(255,255,255,0.07)',dtick:1},yaxis:{title:'lambda_k',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l5-spec-tr',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-formula"><div class="formula-label">CEBİRSEL BAĞLILIK (FIEDLER DEĞERİ)</div><div class="formula-main">$$\\lambda_2(G) = \\min_{\\substack{x \\perp \\mathbf{1} \\\\ \\|x\\| = 1}} x^T L x$$</div><div class="formula-sub">Courant-Fischer min-max teoremine göre. Sabitlere dik birim vektörler arasındaki en küçük önemsiz olmayan Dirichlet enerjisi.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\lambda_2 = 0$</div><div class="card-body">Çizge kopuktur. İki bileşen vardır ve sıfır Dirichlet enerjili gösterge benzeri fonksiyon sıfır uzayını gerer.</div></div>
<div class="calc-card"><div class="card-title">$\\lambda_2$ küçük</div><div class="card-body">Çizge zar zor bağlıdır. Sıfıra yakın enerjili fonksiyon vardır — yakın-bileşenin neredeyse göstergesidir. Tam olarak darboğaz budur.</div></div>
<div class="calc-card"><div class="card-title">$\\lambda_2$ büyük</div><div class="card-body">Çizge sağlam bağlıdır (bir "genişletici"). Düşük enerjili sabit olmayan fonksiyon yoktur. Rastgele yürüyüşler hızla karışır; kesimler pahalıdır.</div></div>
<div class="calc-card"><div class="card-title">Tam çizge $K_n$</div><div class="card-body">$\\lambda_2(K_n) = n$. Mümkün olan maksimum. Her kesim taraf başına $\\Theta(n)$ kenar yok eder.</div></div>
</div>

<h2 class="lesson-title">4. Normalize Edilmiş Laplacian'lar</h2>

<p class="l-text">Laplacian'ın iki normalize varyantı pratikte sürekli ortaya çıkar — özellikle düğümlerin çok farklı dereceleri olduğunda, normalize edilmemiş $L$ yüksek dereceli köşeleri aşırı ağırlıklar.</p>

<div class="calc-formula"><div class="formula-label">SİMETRİK NORMALİZE LAPLACIAN</div><div class="formula-main">$$L_{\\text{sym}} = D^{-1/2} L D^{-1/2} = I - D^{-1/2} A D^{-1/2}$$</div><div class="formula-sub">Simetrik, pozitif yarı-belirli, spektrumu $[0, 2]$. Ng-Jordan-Weiss spektral kümeleme ve Kipf-Welling GCN tarafından kullanılır.</div></div>

<div class="calc-formula"><div class="formula-label">RASTGELE YÜRÜYÜŞ NORMALİZE LAPLACIAN</div><div class="formula-main">$$L_{\\text{rw}} = D^{-1} L = I - D^{-1} A = I - P$$</div><div class="formula-sub">Simetrik değil, ama basit rastgele yürüyüş geçiş matrisi $P = D^{-1} A$ ile ilişkilidir. Özdeğerler $[0, 2]$'de ve $L_{\\text{sym}}$'nin özdeğerleriyle eşleşir.</div></div>

<div class="l-note"><strong>İlişki.</strong> $L_{\\text{sym}}$ ve $L_{\\text{rw}}$ <em>aynı</em> özdeğerlere sahiptir. $L_{\\text{rw}} v = \\lambda v$ ise $L_{\\text{sym}} (D^{1/2} v) = \\lambda (D^{1/2} v)$. Yani pratikte genellikle $L_{\\text{sym}}$'nin özvektörlerini hesaplarız (temiz simetrik, sayısal kararlı) ve bunların köşegen yeniden ölçekleme ile $L_{\\text{rw}}$ özvektörlerine eşlendiğini hatırlarız.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — YILDIZ ÇİZGESİ</div><div class="example-body">Yıldız $S_n$: bir merkez köşesi $n - 1$ yaprağa bağlı. Normalize edilmemiş Laplacian'ın özdeğerleri $\\{0, 1, 1, \\ldots, 1, n\\}$'dir — çokluk-($n-2$) özdeğer 1 artı aşırı bağlı merkezi yansıtan büyük bir özdeğer $n$. Simetrik normalize Laplacian'ın spektrumu $\\{0, 1, 1, \\ldots, 1, 2\\}$. Normalleştirme, dereceyle uyandırılan şişmeyi kaldırır; maksimum özdeğer artık $n$'den bağımsız olarak 2 ile sınırlıdır.</div></div>

<h2 class="lesson-title">5. Fiedler Vektörü ve Spektral İkileme</h2>

<div class="calc-highlight"><strong>İkinci özdeğer $\\lambda_2$'ye ait özvektör $v_2$, ünlü <em>Fiedler vektörü</em>'dür.</strong> Hesaplayın, her girdinin işaretine bakın ve köşeleri "pozitif" küme $S^+ = \\{i : v_2(i) > 0\\}$ ve "negatif" küme $S^- = \\{i : v_2(i) < 0\\}$ olarak ayırın. Bu tek özvektör, çizgenin yakın-optimal bir ikilemesini geri kazanır — Fiedler'in (1973) algoritmik keşfi ve sonraki her spektral kesim algoritmasının temeli.</div>

<p class="l-text"><strong>Fiedler vektörü kesimi neden ortaya çıkarır?</strong> Courant-Fischer karakterizasyonuna göre (bölüm 3), $v_2$, $\\mathbf{1}$'e dik birim vektörler üzerinde Dirichlet enerjisi $\\frac{1}{2}\\sum_{(i,j) \\in E}(x_i - x_j)^2$'yi minimize eder. Çizgenin bir yarısında bir sabit değer, diğer yarısında başka bir sabit değer alan vektör, iki yarı birkaç kenarla bağlandığında çok düşük enerjiye sahiptir. "Hangi yarıda her köşe?" sorusunun en uygun sürekli gevşemesi tam olarak Fiedler vektörüdür. İşarete göre yuvarlama, minimum kesime kanıtlanabilir şekilde yakın bir ayrık bölüm geri kazanır (Bölüm 7'nin ünlü Cheeger eşitsizliği bunu titiz yapar).</p>

<div class="calc-formula"><div class="formula-label">SPEKTRAL İKİLEME ALGORİTMASI (FIEDLER 1973)</div><div class="formula-main">$$\\text{Adım 1: } L v_2 = \\lambda_2 v_2 \\quad \\Longrightarrow \\quad \\text{Adım 2: } V_+ = \\{i : v_2(i) > 0\\},\\; V_- = \\{i : v_2(i) \\le 0\\}$$</div><div class="formula-sub">İkinci özvektörü hesaplayın. İşarete göre eşikleyin. İki yarı, optimuma yakın dengeli bir kesim verir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TEK KENARLA BAĞLI İKİ ÜÇGEN</div><div class="example-body">Köşeler $\\{1, 2, 3, 4, 5, 6\\}$, üçgen $T_1 = \\{1,2,3\\}$, üçgen $T_2 = \\{4,5,6\\}$, tek köprü $(3, 4)$.<br><br>Laplacian'ı hesaplayın, en küçük ikinci özvektörünü alın. Sayısal olarak $v_2 \\approx (-0.4, -0.4, -0.3, +0.3, +0.4, +0.4)^T$ bulursunuz (genel işarete kadar). İşaretler iki üçgeni mükemmel şekilde ayırır. İkileme <em>tam olarak</em> tek köprü kenarını keser — optimum kesim.<br><br>Temel mucize budur. Saf bir doğrusal-cebir hesabı (bir özvektör!) çizgenin yapısal bir özelliğini (nereyi keseceğimizi) geri kazanır.</div></div>

<div class="calc-graph"><div id="plot-l5-fiedler-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> tek köprü kenarıyla bağlı iki üçgen için Fiedler vektörü girdileri. Sıfırın solundaki çubuklar (köşeler 1, 2, 3) bir kümeyi oluşturur; sıfırın sağındaki çubuklar (köşeler 4, 5, 6) diğerini. Her girdinin işareti, tek başına, optimum 2-bölünmeyi geri kazanır. Köşe 3 ve köşe 4 sıfıra en yakın oturur çünkü köprü uçlarıdır — sınıra daha yakın, büyüklük daha küçük.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[1,2,3,4,5,6];
var y=[-0.42,-0.42,-0.32,0.32,0.42,0.42];
var colors=y.map(function(v){return v<0?'#3b82f6':'#f59e0b';});
var d={x:x,y:y,type:'bar',marker:{color:colors},name:'v_2 girdileri'};
var line={x:[0.5,6.5],y:[0,0],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'köşe indeksi',gridcolor:'rgba(255,255,255,0.07)',dtick:1},yaxis:{title:'Fiedler vektör değeri v_2(i)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},annotations:[{x:2,y:-0.55,text:'küme A (negatif)',showarrow:false,font:{color:'#3b82f6',size:12}},{x:5,y:0.55,text:'küme B (pozitif)',showarrow:false,font:{color:'#f59e0b',size:12}}]};
Plotly.newPlot('plot-l5-fiedler-tr',[line,d],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>İki kümenin ötesinde.</strong> $k$ küme için, $v_2, v_3, \\ldots, v_{k+1}$ özvektörlerini alın ve bir $n \\times k$ matris $U$'nun sütunları olarak istifleyin. $U$'nun her <em>satırı</em>, bir köşenin düşük boyutlu bir gömülmesidir. $U$'nun satırları üzerinde k-means çalıştırın. Bu, Ng-Jordan-Weiss algoritmasıdır (2002), spektral kümeleme için standart tariftir; Bölüm 6'da ayrıntılı olarak gezineceğimiz şey.</div>

<h2 class="lesson-title">6. Spektral Kümeleme: Tam Algoritma</h2>

<div class="calc-highlight"><strong>Spektral kümeleme, Fiedler vektörü fikrinin genel verilere pratik uygulamasıdır.</strong> Bir nokta kümesi (veya ikili benzerlik kavramı olan herhangi bir veri) verildiğinde, bir benzerlik çizgesi inşa edin, Laplacian'ının en küçük özvektörlerini alın ve o düşük boyutlu özuzayda k-means çalıştırın. Sonuç, konveks olmayan kümeleri keşfedebilen bir kümelemedir — tam olarak vanilya k-means'in başarısız olduğu yerde.</div>

<div class="calc-formula"><div class="formula-label">SPEKTRAL KÜMELEME (NG-JORDAN-WEISS 2002)</div><div class="formula-main">$$\\text{veri} \\xrightarrow{\\text{benzerlik}} W \\xrightarrow{\\text{normalize}} L_{\\text{sym}} \\xrightarrow{\\text{özçözüm}} U \\xrightarrow{\\text{satır normalize}} \\hat{U} \\xrightarrow{\\text{k-means}} \\text{etiketler}$$</div><div class="formula-sub">Beş adımlı bir boru hattı. Her adım kısa. Birleşik etki: Öklid yakınlığı yerine çizge yapısına göre kümeleme.</div></div>

<p class="l-text"><strong>Klasik "iki ay" veri setinde adım adım.</strong></p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Benzerlik çizgesini inşa et</div><div class="step-detail">$x_1, \\ldots, x_n \\in \\mathbb{R}^d$ veri noktaları için, $i \\ne j$ için Gauss benzerliği $W_{ij} = \\exp(-\\|x_i - x_j\\|^2 / (2\\sigma^2))$ ve $W_{ii} = 0$ tanımlayın. Alternatif: $W_{ij}$ değerinin $j$, $i$'nin $k$ en yakın komşusu arasındaysa 1 olduğu bir $k$ en yakın komşu çizgesi. Bant genişliği $\\sigma$ (veya $k$) bir ayar düğmesidir — çok küçükse çizge parçalanır; çok büyükse uzak noktalar yapay olarak benzer olur.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Simetrik normalize Laplacian'ı oluştur</div><div class="step-detail">Derece matrisi $D = \\mathrm{diag}(W \\mathbf{1})$'i ve simetrik normalize Laplacian $L_{\\text{sym}} = I - D^{-1/2} W D^{-1/2}$'i hesaplayın. Bu kümeleme için kullanılacak doğru matristir — yüksek dereceli köşelerin etkisini azaltır.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$k$ en küçük özvektörü al</div><div class="step-detail">$L_{\\text{sym}}$'nin $k$ en küçük özdeğerli özçiftleri $(\\lambda_1, u_1), \\ldots, (\\lambda_k, u_k)$'yi hesaplayın. Özvektörleri $U \\in \\mathbb{R}^{n \\times k}$'nin sütunları olarak istifleyin. ($k$ küme için $k$ vektör alırsınız. İki ay için $k = 2$.)</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Satırları normalize et</div><div class="step-detail">$U$'nun her satırı $u_i$ için, normuna bölerek $\\hat{u}_i = u_i / \\|u_i\\|$ elde edin. Satırlar artık birim küre $S^{k-1}$ üzerinde yer alır. Bu adım, Ng-Jordan-Weiss'i Shi-Malik'ten ayıran şeydir — sonraki k-means'i ölçek-değişmez yapar.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Gömülü uzayda k-means</div><div class="step-detail">$\\hat{U}$'nun satırları üzerinde $k$ küme ile k-means çalıştırın. Satır $\\hat{u}_i$'nin küme etiketi, orijinal veri noktası $x_i$'nin küme etiketi olur. Bitti.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">İKİ AYDA K-MEANS'İ NEDEN YENER</div><div class="example-body">"İki ay" veri seti, $\\mathbb{R}^2$'de iki birbirine geçmiş hilaldir. Sade k-means, küme ortalamasına Öklid uzaklığını kullanır — ama iki birbirine geçmiş ayın ortalamaları birbirine yakın oturur, yani k-means ayları doğal eğrileri yerine yatay olarak keser.<br><br>Spektral kümeleme <em>çizge</em> uzaklığını kullanır. Gauss benzerlik çizgesi, aynı ay boyunca komşu noktalar arasında (küçük Öklid uzaklığı) yüksek ağırlığa ve aylar arası boşlukta sıfıra yakın ağırlığa sahiptir. Fiedler vektörü bu yüzden bir ayı pozitif tarafa, diğerini negatif tarafa koyar ve adım 3'ün iki boyutlu gömülmesi onları iki sıkı topağa ayırır. Gömülü uzaydaki k-means o topakları önemsiz şekilde işler. "Saflık" (doğru kümeye atanan nokta oranı) ham k-means ile $\\sim$%70'ten spektral kümelemeyle $\\sim$%99'a sıçrar.</div></div>

<div class="calc-graph"><div id="plot-l5-moons-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> gerçek küme ile renklendirilmiş iki-ay veri seti (solda, mavi ve sarı hilaller). Sade k-means bunları yatay olarak keserdi çünkü iki küme ortalaması neredeyse çakışıyor. Laplacian üzerinden geçen spektral kümeleme, doğal eğri-takip ayrımını temiz şekilde geri kazanır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xA=[],yA=[],xB=[],yB=[];
for(var i=0;i<60;i++){var t=Math.PI*i/59;xA.push(Math.cos(t)+(Math.random()-0.5)*0.08);yA.push(Math.sin(t)+(Math.random()-0.5)*0.08);xB.push(1-Math.cos(t)+(Math.random()-0.5)*0.08);yB.push(-Math.sin(t)+0.5+(Math.random()-0.5)*0.08);}
var dA={x:xA,y:yA,mode:'markers',name:'ay A',marker:{size:8,color:'#3b82f6'}};
var dB={x:xB,y:yB,mode:'markers',name:'ay B',marker:{size:8,color:'#f59e0b'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'x_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l5-moons-tr',[dA,dB],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Shi-Malik (2000)</div><div class="card-body">Görüntü bölümleme. Rastgele yürüyüş Laplacian'ı $L_{\\text{rw}}$'yi kullanır; özvektörlerin işaretine / üzerinde k-means'e göre kümelemek. Spektral yöntemleri görüye getirdi.</div></div>
<div class="calc-card"><div class="card-title">Ng-Jordan-Weiss (2002)</div><div class="card-body">En yaygın öğretilen biçim. $L_{\\text{sym}}$'yi kullanır. Satır-normalizasyon adımı kilit dokunuştur.</div></div>
<div class="calc-card"><div class="card-title">Laplacian Eigenmaps (Belkin-Niyogi 2003)</div><div class="card-body">Aynı makine, kümeleme yerine boyut indirgeme için kullanılır. En küçük özvektörler yerel komşulukları koruyan pürüzsüz düşük boyutlu gömme verir.</div></div>
<div class="calc-card"><div class="card-title">Bant genişliği $\\sigma$</div><div class="card-body">Gauss benzerliğinin hiperparametresi. Pratik kural: medyan en yakın komşu mesafesinin birkaç katı. Modern alternatif: bir $k$-NN çizgesi inşa edin ve seçimi atlayın.</div></div>
</div>

<h2 class="lesson-title">7. Cheeger Eşitsizliği</h2>

<div class="calc-highlight"><strong>Fiedler vektörü neden iyi bir kesimdir?</strong> Spektral çizge teorisinin en derin sonucu olan Cheeger eşitsizliği, her zaman öyle olduğunu söyler — optimum çarpanın sabit bir çarpanı dahilinde. Küçük $\\lambda_2$, küçük bir kesim olduğu anlamına gelir; tersine, $\\lambda_2$ kanıtlanabilir şekilde optimal Cheeger sabiti tarafından üstten sınırlanır. Spektral ikileme her zaman, iletkenliği mümkün olan en iyi iletkenliğin sabit bir katı olan bir kesim döndürür.</div>

<div class="calc-formula"><div class="formula-label">CHEEGER SABİTİ (İLETKENLİK)</div><div class="formula-main">$$h(G) = \\min_{\\emptyset \\ne S \\subsetneq V} \\frac{|\\partial S|}{\\min(|S|, |V \\setminus S|)}$$</div><div class="formula-sub">$\\partial S$, $S$'nin sınırını geçen kenarların kümesidir. Minimum tüm önemsiz olmayan iki-bölümler üzerindedir. $h(G)$ küçük = kabaca yarı boyutlu bir parçayı geri kalanından ayıran küçük bir kesim vardır.</div></div>

<div class="calc-formula"><div class="formula-label">CHEEGER EŞİTSİZLİĞİ</div><div class="formula-main">$$\\frac{\\lambda_2}{2} \\;\\le\\; h(G) \\;\\le\\; \\sqrt{2\\,\\lambda_2 \\cdot d_{\\max}}$$</div><div class="formula-sub">İki taraflı sınır (normalize edilmemiş Laplacian için; $L_{\\text{sym}}$ ile sınır $\\lambda_2 / 2 \\le h(G) \\le \\sqrt{2\\lambda_2}$ olur). $\\lambda_2$ ve $h(G)$ birbirini karekök bir çarpana kadar kontrol eder.</div></div>

<p class="l-text"><strong>İspat eskizi (spektral ikileme ile üst sınır).</strong> Fiedler vektörü $v_2$'yi hesaplayın. Girdilerini sıralayın; bir eşiği en küçükten en büyüğe süpürün. Her eşikte $V$'yi "altında" ve "üstünde" olarak bölün ve o bölümün iletkenliğini hesaplayın. Cheeger eşitsizliği, $n - 1$ süpürme kesiminden <em>en az birinin</em> iletkenliği $\\Phi \\le \\sqrt{2 \\lambda_2 d_{\\max}}$'yi sağlayan bir bölme verdiğini garanti eder. Bu, ünlü "süpürme kesim" yuvarlamasıdır — Cheeger'in algoritmik içeriği.</p>

<p class="l-text"><strong>Alt sınır neden tutar.</strong> Gösterge $x = \\mathbf{1}_S - (|S|/|V \\setminus S|)\\mathbf{1}_{V \\setminus S}$'yi düşünün, $x \\perp \\mathbf{1}$ olacak şekilde uygun normalize edilmiş. Kısa bir hesap $x^T L x / x^T x \\approx 2 \\cdot |\\partial S| / \\min(|S|, |V \\setminus S|)$'yi gösterir (normalleştirmeye bağlı bir sabite kadar), dolayısıyla $\\lambda_2 \\le 2 h(G)$. $h(G) \\ge \\lambda_2 / 2$'ye yeniden düzenleyin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\lambda_2 \\approx 0$</div><div class="card-body">Cheeger sabiti küçüktür. Çizgede neredeyse-köprü vardır — önemli bir parçayı koparan küçük bir kenar kümesi.</div></div>
<div class="calc-card"><div class="card-title">$\\lambda_2 = \\Theta(1)$</div><div class="card-body">Çizge bir "genişleticidir" — herhangi bir kesim sabit oranda kenarı yok eder. Rastgele yürüyüşler $O(\\log n)$ adımda karışır. Teorik CS'de kritiktir.</div></div>
<div class="calc-card"><div class="card-title">Algoritmik sonuç</div><div class="card-body">Spektral ikileme (Fiedler 1973), optimumun $\\sqrt{2 \\lambda_2}$ çarpanı dahilinde bir kesim bulur — sürekli gevşemenin kanıtlanabilir ayrık yaklaştırma verdiği ikonik bir örnek.</div></div>
<div class="calc-card"><div class="card-title">Karışma süresi</div><div class="card-body">Tembel rastgele yürüyüş için karışma süresi $1 / \\lambda_2$ gibi ölçeklenir. Cebirsel bağlılık bu yüzden bir Markov zincirinin çizgede sabit dağılıma ne kadar hızlı ulaştığının da doğrudan göstergesidir.</div></div>
</div>

<h2 class="lesson-title">8. Çizge Fourier Dönüşümü ve Spektral Konvolüsyon</h2>

<div class="calc-highlight"><strong>Laplacian'ın özvektörleri, çizgenin "Fourier tabanı"dır.</strong> Klasik Fourier dönüşümü çizgi üzerindeki bir fonksiyonu sinüsoidlerin toplamı olarak yazdığı gibi — sürekli Laplacian'ın özfonksiyonları — çizge Fourier dönüşümü köşeler üzerindeki bir fonksiyonu Laplacian özvektörlerinin doğrusal birleşimi olarak yazar. Bu tek analoji, spektral çizge sinir ağlarına açılan kapıdır.</div>

<div class="calc-formula"><div class="formula-label">ÇİZGE FOURIER DÖNÜŞÜMÜ</div><div class="formula-main">$$\\hat{x} = U^T x, \\qquad x = U \\hat{x}$$</div><div class="formula-sub">burada $L = U \\Lambda U^T$ özayrışımdır. $U$ diktir: sütunlar özvektörler $u_1, \\ldots, u_n$'dir ("çizge Fourier tabanı"). $\\hat{x}_k = u_k^T x$, çizge üzerindeki $x$ sinyalinin "$k$-inci Fourier katsayısıdır".</div></div>

<div class="calc-formula"><div class="formula-label">SPEKTRAL ÇİZGE KONVOLÜSYONU (BRUNA-ZAREMBA-SZLAM-LECUN 2014)</div><div class="formula-main">$$g \\star x = U \\cdot \\mathrm{diag}(\\hat{g}) \\cdot U^T x = U \\, g(\\Lambda) \\, U^T x$$</div><div class="formula-sub">Bir çizge üzerinde filtreleme: sinyali spektral alana dönüştürün, bir frekans-cevabı $g(\\Lambda)$ (özbazında köşegen) ile çarpın, geri dönüştürün. Klasik Fourier'de $f \\star x$'in noktasal çarpmaya dönüşmesinin tam analoğu.</div></div>

<p class="l-text"><strong>Büyük fikir, tek satırda.</strong> Konvolüsyonu spektral alanda tanımlayın. $g(\\Lambda)$ filtresini Laplacian özdeğerlerinin bir fonksiyonu olarak öğrenin. Tüm bu işlem, klasik konvolüsyonun düzenli bir ızgara üzerinde öteleme-eşdeğer olması gibi, çizge üzerinde otomatik olarak permütasyon-eşdeğerdir.</p>

<div class="l-note"><strong>Bruna 2014'teki sorun.</strong> $U$'yu açıkça hesaplamak $O(n^3)$'ye mal olur (tam bir özayrışım) ve filtre başına ileri yön geçişi $O(n^2)$. Spektral GNN'ler orijinal biçimleriyle küçük çizgelerin ötesine ölçeklenmez. Sonra gelen iki atılım — ChebNet (Defferrard 2016) ve GCN (Kipf-Welling 2017) — açık özayrışımı yerelleştirilmiş bir polinom yaklaştırmasıyla değiştirerek tam olarak bu sorunu çözer.</div>

<h2 class="lesson-title">9. ChebNet (Defferrard 2016)'ten GCN (Kipf-Welling 2017)'ye</h2>

<div class="calc-highlight"><strong>Modern çizge makine öğrenmesine güç veren basitleştirme.</strong> Defferrard, Bresson, Vandergheynst (2016), Bruna'nın tam spektral filtresini Laplacian'ın bir Chebyshev polinomu ile değiştirerek katman başına $O(n^2)$ yerine $O(K |E|)$ verdi ve her filtreyi $K$-atlamalı bir komşuluğa yerelleştirdi. Kipf ve Welling (2017) sonra $K = 1$'i özelleştirip yeniden ölçeklendirerek ünlü GCN yayılım kuralını elde etti. Bugün hemen her GNN mimarisi bu iskeleti devralır.</div>

<p class="l-text"><strong>ChebNet (Defferrard ve diğerleri, 2016).</strong> $g_\\theta(\\Lambda)$ filtresini $K$-inci dereceden bir Chebyshev polinomu $T_k$ ile yaklaştırın:</p>

<div class="calc-formula"><div class="formula-label">CHEBNET FİLTRESİ</div><div class="formula-main">$$g_\\theta(L) \\;\\approx\\; \\sum_{k=0}^{K} \\theta_k \\, T_k(\\tilde{L}), \\qquad \\tilde{L} = \\frac{2}{\\lambda_{\\max}} L - I$$</div><div class="formula-sub">$\\tilde{L}$, özdeğer-yeniden ölçeklenmiş Laplacian'dır; spektrumu Chebyshev polinomlarının iyi davrandığı $[-1, 1]$'dedir. $T_0(x) = 1$, $T_1(x) = x$, $T_k(x) = 2x T_{k-1}(x) - T_{k-2}(x)$ — seyrek matris-vektör çarpımlarıyla, $U$'ya hiç dokunmadan hesaplanır.</div></div>

<p class="l-text"><strong>Maliyet ve yerellik.</strong> Her ileri geçiş $O(K |E|)$'ye mal olur (seyrek Laplacian'a karşı bir matris-vektör çarpımı, $K$ kez). Filtre tam olarak $K$-yerelleştirilmiştir: köşe $i$'deki çıktı sadece $K$ atlama içindeki köşelere bağlıdır. Özayrışım gerekmez.</p>

<div class="calc-formula"><div class="formula-label">KIPF-WELLING GCN — BASİTLEŞTİRME</div><div class="formula-main">$$K = 1, \\quad \\lambda_{\\max} \\approx 2, \\quad \\theta_0 = -\\theta_1 = \\theta \\;\\Longrightarrow\\; g_\\theta \\star x \\approx \\theta\\,(I + D^{-1/2} A D^{-1/2})\\,x$$</div><div class="formula-sub">ChebNet'in radikal bir basitleştirmesi. Bir Chebyshev katsayısı. Bir özdeğer varsayımı ($\\lambda_{\\max} \\approx 2$, birçok gerçek çizge için doğru). Bir parametre-bağlama hilesi.</div></div>

<p class="l-text"><strong>Yeniden normalleştirme hilesi.</strong> $A \\to \\tilde{A} = A + I$ (öz-döngüler) ve $D \\to \\tilde{D} = \\tilde{A} \\mathbf{1}$ ikamesi operatörü kararlı kılar. Son katman başına kural şimdi ikonik olan:</p>

<div class="calc-formula"><div class="formula-label">GCN YAYILIM KURALI (KIPF-WELLING 2017)</div><div class="formula-main">$$H^{(l+1)} = \\sigma\\!\\left( \\tilde{D}^{-1/2} \\tilde{A} \\tilde{D}^{-1/2} H^{(l)} W^{(l)} \\right)$$</div><div class="formula-sub">$H^{(l)}$, $l$ katmanındaki düğüm özelliklerinin matrisidir; $W^{(l)}$ eğitilebilir ağırlık matrisidir; $\\sigma$ bir doğrusal olmayanlıktır (ReLU). $\\tilde{A} = A + I$ öz-döngüler ekler; $\\tilde{D}$ ilgili derece matrisidir. Üç bileşen: normalize et, yay, dönüştür-ve-aktive et.</div></div>

<p class="l-text"><strong>Formülü okuma.</strong> $\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ matrisi, öz-döngülü komşuluk matrisinin satır-ve-sütun-normalleştirilmiş bir versiyonudur. $H^{(l)}$'yi bununla çarpmak, her düğümün özelliklerini komşularının özellikleriyle (ve öz-döngü sayesinde kendisininkilerle) ortalar. $W^{(l)}$ ile çarpmak bir sonraki özellik boyutuna yansıtır. $\\sigma$ uygulamak doğrusal olmayanlığı tanıtır. İki veya üç böyle katmanı üst üste yığın, üzerine bir softmax sınıflandırıcı takın ve çalışan bir yarı-denetimli düğüm-sınıflandırma modeline sahip olursunuz.</p>

<div class="calc-graph"><div id="plot-l5-prop-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> 6. konumda tek "sıcak" düğümü olan bir yol çizgesinde tekrarlı GCN yayılımının etkisi. Bir katmandan sonra ısı 5 ve 7 komşularına yayılmış; iki katmandan sonra 4 ve 8'e; üç katmandan sonra sinyal 6'da merkezlenmiş ayrık bir Gauss gibi görünür. GCN katmanları özellikleri kelimenin tam anlamıyla çizge kenarları boyunca yayar. Çok fazla katman ve yayılma sinyali sabite düzleştirir — bu, derin GCN'lerin "aşırı yumuşatma" sorunudur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=11;var init=new Array(n).fill(0);init[5]=1;
function smooth(s){var out=new Array(n).fill(0);for(var i=0;i<n;i++){var sum=s[i]*0.5;var c=0.5;if(i>0){sum+=s[i-1]*0.25;c+=0.25;}if(i<n-1){sum+=s[i+1]*0.25;c+=0.25;}out[i]=sum/c;}return out;}
var s0=init.slice();
var s1=smooth(s0);
var s2=smooth(s1);
var s3=smooth(s2);
var xs=[];for(var i=0;i<n;i++)xs.push(i+1);
var d0={x:xs,y:s0,mode:'lines+markers',name:'katman 0 (başlangıç)',line:{color:'#f87171',width:2.6},marker:{size:7}};
var d1={x:xs,y:s1,mode:'lines+markers',name:'katman 1',line:{color:'#f59e0b',width:2.4},marker:{size:7}};
var d2={x:xs,y:s2,mode:'lines+markers',name:'katman 2',line:{color:'#10b981',width:2.4},marker:{size:7}};
var d3={x:xs,y:s3,mode:'lines+markers',name:'katman 3',line:{color:'#3b82f6',width:2.4},marker:{size:7}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'köşe konumu',gridcolor:'rgba(255,255,255,0.07)',dtick:1},yaxis:{title:'özellik değeri',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l5-prop-tr',[d0,d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Katman başına maliyet</div><div class="card-body">$O(|E|)$ — seyrek matris-vektör. Bruna 2014'teki $n^2$ ile değil, kenar sayısıyla doğrusal ölçeklenir.</div></div>
<div class="calc-card"><div class="card-title">Permütasyon eşdeğerliği</div><div class="card-body">Düğümleri (ve $H$'nin satırlarını) yeniden sıralayın ve çıktı aynı şekilde yeniden sıralanır. Spektral formülasyonda yerleşik; GCN tarafından korunur.</div></div>
<div class="calc-card"><div class="card-title">Alıcı alan</div><div class="card-body">$K$-katmanlı bir GCN, her düğümün $K$-atlamalı komşuluğunu görür. İki ila üç katman tipiktir — bunun ötesinde aşırı yumuşatma devreye girer.</div></div>
<div class="calc-card"><div class="card-title">GCN'in ötesinde</div><div class="card-body">GraphSAGE, GAT (kenarlarda dikkat), GIN (Weisfeiler-Lehman kadar ifade edici olduğu kanıtlanmış) ve mesaj-geçen sinir ağları hepsi yay-sonra-güncelle iskeletini devralır.</div></div>
</div>

<h2 class="lesson-title">10. Uygulamalar ve Bundan Sonra Nereye</h2>

<p class="l-text">Spektral yöntemler, modern çizge makine öğrenmesinin büyük kısımlarını inşa etti veya esinlendirdi. Bu dersin fikirlerinin ortaya çıktığı yerlerin kapsamlı olmayan bir listesi:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Görüntü bölümleme</div><div class="card-body">Shi-Malik (2000) normalleştirilmiş kesimler: bir piksel benzerlik çizgesi inşa edin, Fiedler vektörünü alın, eşikleyin. Spektral kümelemenin ölçekte ilk pratik kullanımı.</div></div>
<div class="calc-card"><div class="card-title">Topluluk tespiti</div><div class="card-body">Sosyal ağlarda, atıf çizgelerinde, biyolojik ağlarda yoğun alt-grupları bulun. Spektral modülerlik (Newman 2006) $L$-benzeri operatörler kullanır.</div></div>
<div class="calc-card"><div class="card-title">Boyut indirgeme</div><div class="card-body">Laplacian Eigenmaps (Belkin-Niyogi 2003), Diffusion Maps (Coifman-Lafon 2006). En küçük Laplacian özvektörleriyle doğrusal olmayan manifold öğrenme.</div></div>
<div class="calc-card"><div class="card-title">Mesh ve şekil işleme</div><div class="card-body">3B geometri — Laplacian özfonksiyonları üçgen mesh üzerinde doğal Fourier tabanıdır. Şekil yazışmasında ve yeniden mesh'lemede kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Moleküler özellik tahmini</div><div class="card-body">Çözünürlük, toksisite, bağlanma enerjisini molekülü-çizge-olarak tahmin edin. GCN, MPNN, SchNet ve eşdeğer mimariler doğrudan torunlardır.</div></div>
<div class="calc-card"><div class="card-title">Öneri sistemleri</div><div class="card-body">Kullanıcı-öğe iki parçalı çizgeleri. PinSage (Pinterest), LightGCN. Spektral yapı, endüstriyel ölçekte işbirlikçi filtrelemeyi destekler.</div></div>
<div class="calc-card"><div class="card-title">Bilgi çizgeleri</div><div class="card-body">İlişkisel olgular üzerinde akıl yürütme. R-GCN, CompGCN — ilişkiye özgü ağırlıklarla mesaj geçirme, ama geometri hâlâ Laplacian.</div></div>
<div class="calc-card"><div class="card-title">PageRank</div><div class="card-body">Klasik Google sıralama algoritması, normalleştirilmiş bir komşuluğun baskın özvektörüdür. Aynı öz-makine, farklı normalleştirme.</div></div>
</div>

<div class="l-note"><strong>Sıradaki okumalar.</strong> Teori için: Spielman'ın <em>Spectral and Algebraic Graph Theory</em> el yazması. ML için: Hamilton'ın <em>Graph Representation Learning</em> kitabı. Tarihsel yay için: Fiedler 1973 (orijinal Fiedler-vektör makalesi), Shi-Malik 2000 (normalleştirilmiş kesim), Ng-Jordan-Weiss 2002 (spektral kümeleme), Belkin-Niyogi 2003 (Laplacian Eigenmaps), Bruna ve diğerleri 2014 (spektral GNN), Defferrard ve diğerleri 2016 (ChebNet), Kipf-Welling 2017 (GCN). Yedi makaleyi sırayla okumak, spektral çizge teorisinin makine öğrenmesi bel kemiğine dönüşümünün mümkün olan en temiz turudur.</div>

<h2 class="lesson-title">11. Pyodide Lab — Hesapla, Kümele, Yay</h2>

<p class="l-text">Aşağıdaki kod sırayla beş şey yapar: (1) küçük bir iki kümeli çizgenin Laplacian'ını inşa edin ve spektrumunu yazdırın; (2) Fiedler vektörünü hesaplayın ve çizgeyi temiz şekilde iki parçaya ayırdığını doğrulayın; (3) 200 noktalı bir iki-ay veri setinde spektral kümeleme çalıştırın ve sade k-means ile karşılaştırın; (4) tek katmanlı bir GCN ileri geçişi uygulayın ve özelliklerin bir yol boyunca yayıldığını izleyin; (5) birçok GCN adımı çalıştırarak "aşırı yumuşatma" etkisini ölçün. <strong>RUN</strong>'a tıklayın ve ardından sayıları değiştirin — gördüğünüz her sonuç, 1'den 9'a kadar olan bölümlerin formülleriyle öngörülür.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_moons

<span class="cm"># ---------- 1. Iki kumeli cizge: 6 dugum, iki ucgen + kopru ----------</span>
A = np.array([
    [<span class="num">0</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>],
    [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>],
    [<span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">0.2</span>, <span class="num">0</span>, <span class="num">0</span>],
    [<span class="num">0</span>, <span class="num">0</span>, <span class="num">0.2</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">1</span>],
    [<span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>],
    [<span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>]
], dtype=<span class="ty">float</span>)
D = np.diag(A.sum(axis=<span class="num">1</span>))
L = D - A

vals = np.linalg.eigvalsh(L)
<span class="fn">print</span>(<span class="str">"Laplacian ozdegerleri:"</span>, np.round(vals, <span class="num">3</span>))
<span class="cm"># Beklenen: en kucuk 0 (tek bilesen); ikinci en kucuk kucuk (zayif kopru).</span>

<span class="cm"># ---------- 2. Fiedler vektoru cizgeyi ayirir ----------</span>
eigvals, eigvecs = np.linalg.eigh(L)
fiedler = eigvecs[:, <span class="num">1</span>]
<span class="fn">print</span>(<span class="str">"Fiedler vektoru:"</span>, fiedler.round(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Isarete gore ikileme:"</span>, (fiedler &gt; <span class="num">0</span>).astype(<span class="ty">int</span>))
<span class="cm"># Iki ucgenle eslesen kume etiketleri beklenir {0,1,2} ve {3,4,5}.</span>

<span class="cm"># ---------- 3. Iki ay uzerinde spektral kumeleme ----------</span>
X, y_true = make_moons(n_samples=<span class="num">200</span>, noise=<span class="num">0.07</span>, random_state=<span class="num">0</span>)

<span class="cm"># Gauss benzerlik matrisi</span>
<span class="kw">from</span> scipy.spatial.distance <span class="kw">import</span> cdist
dist = cdist(X, X)
sigma = <span class="num">0.25</span>
W = np.exp(-dist**<span class="num">2</span> / (<span class="num">2</span>*sigma**<span class="num">2</span>))
np.fill_diagonal(W, <span class="num">0</span>)

<span class="cm"># Simetrik normalize Laplacian</span>
d = W.sum(axis=<span class="num">1</span>)
D_inv_sqrt = np.diag(<span class="num">1</span>/np.sqrt(d))
L_sym = np.eye(<span class="fn">len</span>(X)) - D_inv_sqrt @ W @ D_inv_sqrt

<span class="cm"># En kucuk iki ozvektor, satir normalize</span>
eigvals, eigvecs = np.linalg.eigh(L_sym)
U = eigvecs[:, :<span class="num">2</span>]
U = U / (np.linalg.norm(U, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) + <span class="num">1e-12</span>)

spec_labels = KMeans(n_clusters=<span class="num">2</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).fit_predict(U)
raw_labels  = KMeans(n_clusters=<span class="num">2</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).fit_predict(X)

<span class="kw">def</span> <span class="fn">purity</span>(pred, true):
    a = np.mean(pred == true)
    b = np.mean(pred == (<span class="num">1</span> - true))
    <span class="kw">return</span> <span class="fn">max</span>(a, b)

<span class="fn">print</span>(<span class="str">f"ham k-means safligi:       {<span class="fn">purity</span>(raw_labels, y_true):.3f}"</span>)
<span class="fn">print</span>(<span class="str">f"spektral kumeleme safligi: {<span class="fn">purity</span>(spec_labels, y_true):.3f}"</span>)
<span class="cm"># Spektral genellikle ~0.99 vs ham k-means ~0.75 aylar uzerinde.</span>

<span class="cm"># ---------- 4. Yol cizgesi uzerinde tek katmanli GCN ileri gecis ----------</span>
n = <span class="num">11</span>
A_path = np.zeros((n, n))
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n - <span class="num">1</span>):
    A_path[i, i+<span class="num">1</span>] = A_path[i+<span class="num">1</span>, i] = <span class="num">1</span>
A_tilde = A_path + np.eye(n)                 <span class="cm"># oz-donguler</span>
d_tilde = A_tilde.sum(axis=<span class="num">1</span>)
D_inv_sqrt = np.diag(<span class="num">1</span>/np.sqrt(d_tilde))
A_hat = D_inv_sqrt @ A_tilde @ D_inv_sqrt    <span class="cm"># yeniden normalize edilmis yayilim operatoru</span>

H = np.zeros((n, <span class="num">1</span>)); H[<span class="num">5</span>, <span class="num">0</span>] = <span class="num">1.0</span>      <span class="cm"># 5. konumda tek sicak dugum</span>
W = np.array([[<span class="num">1.0</span>]])                       <span class="cm"># birim agirlik, donusum yok</span>

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>):
    <span class="fn">print</span>(<span class="str">f"{step} GCN adimindan sonra:"</span>, H.flatten().round(<span class="num">3</span>))
    H = A_hat @ H @ W                        <span class="cm"># GCN yayilimi, dogrusal olmayanlik yok</span>

<span class="cm"># ---------- 5. Asiri yumusatma: cok adim sabite yakinsar ----------</span>
H = np.random.RandomState(<span class="num">0</span>).randn(n, <span class="num">1</span>)
energies = []
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">60</span>):
    H = A_hat @ H
    energies.append(<span class="fn">float</span>(H.std()))
<span class="fn">print</span>(<span class="str">f"60 yayilimdan sonra std: {energies[-1]:.6f}"</span>)
<span class="cm"># Std 0'a coker: cok katman ve sinyaller cizge ortalamasinda birlesir.</span></code></pre></div>

<p class="l-text"><strong>Denenecek şeyler.</strong> Adım 1'deki köprü ağırlığını 0.2'den 0.01'e değiştirin — Fiedler değeri $\\lambda_2$ sıfıra doğru daralır ve çizge iki bileşene yaklaşır. Adım 3'te $\\sigma = 0.25$'i $\\sigma = 1.0$'a değiştirin — benzerlik çizgesi çok yoğun olur, aylar harmanlanır, spektral saflık düşer. Adım 4'teki yol çizgesini küçük bir rastgele çizgeyle değiştirin ($A$'yı 0.2 kenar olasılığı ile örnekleyin) — yayılma deseni şekil değiştirir ama aşırı yumuşatma yine de eninde sonunda kazanır.</p>

<h2 class="lesson-title">Özet</h2>

<p class="l-text">Çizge Laplacian $L = D - A$, çizge teorisindeki en kullanışlı tek matristir. Simetrik pozitif yarı-belirlidir, en küçük özdeğeri bağlı bileşen sayısına eşit çoklukla 0'dır ve en küçük ikinci özdeğer $\\lambda_2$ — Fiedler'in cebirsel bağlılığı — çizgenin ne kadar iyi tuttuğunu ölçer. İlgili Fiedler vektörü, Cheeger sabitinin sabit bir çarpanı dahilinde optimal ikilemeyi geri kazanır (Cheeger eşitsizliği: $\\lambda_2/2 \\le h(G) \\le \\sqrt{2 \\lambda_2}$). Spektral kümeleme (Shi-Malik 2000, Ng-Jordan-Weiss 2002), bu fikri bir benzerlik çizgesi aracılığıyla keyfi verilere genişletir ve sade k-means'in başarısız olduğu yerde iki birbirine geçmiş ay gibi konveks olmayan kümeleri geri kazanır. Spektral çizge sinir ağları (Bruna ve diğerleri 2014), konvolüsyonu Laplacian özbazında çarpma olarak tanımlar. ChebNet (Defferrard ve diğerleri 2016), açık özayrışımı $K$-inci dereceden bir Chebyshev polinomu ile değiştirerek $O(K|E|)$ maliyet ve $K$-atlamalı yerellik sağlar. Kipf ve Welling (2017), yeniden normalleştirme $\\tilde{A} = A + I$ ile $K = 1$'e daha da özelleştirerek GCN yayılım kuralı $H^{(l+1)} = \\sigma(\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2} H^{(l)} W^{(l)})$'i üretti — üç veya dört matematik satırı, ama neredeyse her modern çizge sinir ağının omurgası. Sonraki ders, çoklu kenar tiplerinin etkileşime girdiği ve spektral çerçevenin ilişkiye özgü operatörlere genişletildiği bilgi çizgelerine ve ilişkisel akıl yürütmeye genelleştirir.</p>
`

};
