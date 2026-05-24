window.MATH_L8 = {
en: `<p class="l-text"><strong>A manifold is a curved space that looks flat if you zoom in.</strong> The surface of the Earth is a 2-manifold: locally a plane (your map), globally a sphere. The set of all rotation matrices in $\\mathbb{R}^3$ is a 3-manifold. The set of unit-norm word embeddings is a sphere. The set of orthogonal $d \\times k$ matrices used in PCA, attention heads, and orthogonal weight initialization is the Stiefel manifold. Whenever your variables have a constraint that is itself smooth — unit norm, orthogonality, positive-definiteness, fixed rank — the natural place to optimize is on the manifold itself, not in the ambient Euclidean space with a penalty.</p>

<p class="l-text">Manifold optimization gives you three things that Euclidean optimization with constraints cannot: it never leaves the constraint set (so projection error never accumulates), the geometry it uses is intrinsic (so steps respect the curvature, e.g. moving along a great circle on the sphere instead of through the inside), and it gives access to second-order methods that respect the manifold structure. In this lesson we build the geometry — tangent spaces, exponential and logarithmic maps, geodesics — on the simplest non-trivial example, the unit sphere $S^{n-1}$, then preview Riemannian gradient descent and the Stiefel manifold used in deep learning. Reference throughout: Absil, Mahony &amp; Sepulchre, <em>Optimization Algorithms on Matrix Manifolds</em> (2008).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a smooth manifold and its tangent space at a point</li>
<li>Compute the exponential map and logarithmic map on the sphere by hand</li>
<li>Trace a geodesic on $S^2$ — the shortest path between two unit vectors</li>
<li>Project an ambient gradient onto the tangent space and run Riemannian gradient descent</li>
<li>Recognize the Stiefel manifold and why it shows up in PCA and attention</li>
<li>See where manifold methods help (low-dimensional constraint surfaces) and where they do not (high-dimensional unconstrained deep learning)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. What Is a Manifold?</h2>
<p class="l-text">A <strong>smooth $d$-manifold</strong> $\\mathcal{M}$ is a set together with an atlas of charts: maps from open patches of $\\mathcal{M}$ to open subsets of $\\mathbb{R}^d$, smooth where they overlap. The dimension $d$ is the number of independent local coordinates. We almost always meet manifolds embedded in some $\\mathbb{R}^N$ with $N &gt; d$ — the sphere $S^2$ lives in $\\mathbb{R}^3$ but is intrinsically 2-dimensional.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sphere $S^{n-1}$</div><div class="card-body">$\\{x \\in \\mathbb{R}^n : \\|x\\| = 1\\}$. Dimension $n-1$. Where unit-norm embeddings live (word2vec, normalized contrastive features, directions).</div></div>
<div class="calc-card"><div class="card-title">Stiefel $\\text{St}(d,k)$</div><div class="card-body">$\\{X \\in \\mathbb{R}^{d\\times k} : X^\\top X = I_k\\}$. Orthonormal $k$-frames in $\\mathbb{R}^d$. Used in PCA, ICA, orthogonal weight init, multi-head attention orthogonality.</div></div>
<div class="calc-card"><div class="card-title">Grassmann $\\text{Gr}(d,k)$</div><div class="card-body">$k$-dimensional subspaces of $\\mathbb{R}^d$. Used in subspace tracking and dimensionality reduction.</div></div>
<div class="calc-card"><div class="card-title">SPD cone</div><div class="card-body">Symmetric positive-definite matrices. Used for covariance estimation and metric learning. Riemannian (affine-invariant) metric beats Euclidean badly here.</div></div>
</div>

<div class="calc-highlight"><strong>Why care:</strong> if you optimize a quantity that <em>must</em> stay on the manifold (orthogonal weights, unit-norm embeddings, valid covariance), Riemannian methods preserve the constraint exactly at every step. No projection error, no penalty hyperparameters.</div>

<div id="plot-ml8-geodesic-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  // Unit circle (great circle slice of S^2 in plane)
  var cx=[],cy=[];
  for(var i=0;i<=200;i++){var t=i*Math.PI*2/200; cx.push(Math.cos(t)); cy.push(Math.sin(t));}
  var circle={x:cx,y:cy,mode:"lines",name:"manifold (S¹ slice of S²)",line:{color:"rgba(235,230,220,0.45)",width:2}};
  var p=[Math.cos(0.2),Math.sin(0.2)];
  var q=[Math.cos(2.4),Math.sin(2.4)];
  var gx=[],gy=[];
  for(var i=0;i<=80;i++){var s=i/80; var a=0.2+s*(2.4-0.2); gx.push(Math.cos(a)); gy.push(Math.sin(a));}
  var geo={x:gx,y:gy,mode:"lines",name:"geodesic (great circle, on manifold)",line:{color:"#c8a96e",width:4}};
  var euc={x:[p[0],q[0]],y:[p[1],q[1]],mode:"lines",name:"Euclidean chord (cuts through)",line:{color:"#f87171",width:3,dash:"dash"}};
  var pts={x:[p[0],q[0]],y:[p[1],q[1]],mode:"markers+text",text:["p","q"],textposition:"top right",marker:{size:11,color:"#4ecdc4"},name:"endpoints",textfont:{color:"#ebe6dc",size:14}};
  var layout={title:{text:"Geodesic vs Euclidean chord on the sphere",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.10)",range:[-1.4,1.4],showticklabels:false},yaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.10)",range:[-1.3,1.4],showticklabels:false,scaleanchor:"x"},margin:{t:40,r:20,b:20,l:20},showlegend:true,legend:{font:{color:"#ebe6dc"}}};
  Plotly.newPlot("plot-ml8-geodesic-en",[circle,euc,geo,pts],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The grey ring is a great circle on the unit sphere — a 1D slice of S². The gold geodesic stays on the manifold the entire way from p to q. The red Euclidean chord cuts through the interior, leaving the sphere. Riemannian optimization travels along the gold path; vanilla Euclidean GD followed by projection takes the red shortcut and renormalizes — accumulating error.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Tangent Space</h2>
<p class="l-text">At each point $p \\in \\mathcal{M}$, the <strong>tangent space</strong> $T_p\\mathcal{M}$ is the linear approximation to the manifold — the "best flat $d$-dimensional plane through $p$". A tangent vector $v \\in T_p\\mathcal{M}$ is a velocity: the derivative of a curve on the manifold passing through $p$.</p>

<p class="l-text">For the sphere $S^{n-1}$ embedded in $\\mathbb{R}^n$, the tangent space at $p$ is exactly the set of vectors orthogonal to $p$:</p>

<div class="katex-block">$$T_p S^{n-1} = \\{v \\in \\mathbb{R}^n : p^\\top v = 0\\}.$$</div>

<p class="l-text">This is intuitive: to stay on the sphere instantaneously, you cannot move radially. The tangent space at every point is a linear $(n-1)$-dimensional subspace of $\\mathbb{R}^n$.</p>

<p class="l-text">For the Stiefel manifold the analogous condition is $X^\\top V + V^\\top X = 0$ — the antisymmetric part of $X^\\top V$ vanishes — which encodes "to stay orthonormal, your velocity must be orthogonal to the columns".</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Project an ambient vector onto the tangent space of S^{n-1} at p</span>
<span class="kw">def</span> <span class="fn">proj_tangent_sphere</span>(p, u):
    <span class="kw">return</span> u - (p @ u) * p

p = np.<span class="fn">array</span>([<span class="num">0.0</span>, <span class="num">0.0</span>, <span class="num">1.0</span>])     <span class="cm"># north pole of S^2</span>
u = np.<span class="fn">array</span>([<span class="num">1.5</span>, <span class="num">0.7</span>, <span class="num">2.3</span>])     <span class="cm"># arbitrary ambient vector</span>
v = <span class="fn">proj_tangent_sphere</span>(p, u)

<span class="fn">print</span>(f<span class="str">"p          = {p}"</span>)
<span class="fn">print</span>(f<span class="str">"u (ambient)= {u}"</span>)
<span class="fn">print</span>(f<span class="str">"v (tangent)= {v}"</span>)
<span class="fn">print</span>(f<span class="str">"p . v      = {p @ v:.2e}    (should be 0)"</span>)
<span class="fn">print</span>(f<span class="str">"||v||      = {np.linalg.norm(v):.4f}"</span>)

<span class="cm"># Verify on a non-trivial point</span>
p2 = np.<span class="fn">array</span>([<span class="num">0.6</span>, <span class="num">0.8</span>, <span class="num">0.0</span>]); p2 /= np.linalg.<span class="fn">norm</span>(p2)
u2 = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>).<span class="fn">standard_normal</span>(<span class="num">3</span>)
v2 = <span class="fn">proj_tangent_sphere</span>(p2, u2)
<span class="fn">print</span>(f<span class="str">"\\nGeneral point p2 = {p2}"</span>)
<span class="fn">print</span>(f<span class="str">"p2 . v2 = {p2 @ v2:.2e}    (should be 0)"</span>)
</code></pre></div>

<p class="l-text">The projection $v = u - (p^\\top u) p$ removes the radial component. This is the single line that converts an Euclidean gradient into a Riemannian gradient on the sphere, and it is what makes optimization on $S^{n-1}$ stay on the sphere.</p>

<div id="plot-ml8-tangent-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var cx=[],cy=[];
  for(var i=0;i<=200;i++){var t=i*Math.PI*2/200; cx.push(Math.cos(t)); cy.push(Math.sin(t));}
  var circle={x:cx,y:cy,mode:"lines",name:"S¹ (sphere slice)",line:{color:"rgba(235,230,220,0.45)",width:2}};
  var ang=0.9;
  var p=[Math.cos(ang),Math.sin(ang)];
  // tangent direction at p is perpendicular to p
  var t=[-Math.sin(ang),Math.cos(ang)];
  var tline={x:[p[0]-1.6*t[0],p[0]+1.6*t[0]],y:[p[1]-1.6*t[1],p[1]+1.6*t[1]],mode:"lines",name:"tangent line T_p M",line:{color:"#4ade80",width:3}};
  // Ambient vector u and its projection
  var u=[1.2,0.4];
  var pdotu=p[0]*u[0]+p[1]*u[1];
  var vproj=[u[0]-pdotu*p[0], u[1]-pdotu*p[1]];
  var uvec={x:[p[0],p[0]+u[0]],y:[p[1],p[1]+u[1]],mode:"lines+markers",name:"u (ambient gradient)",line:{color:"#f87171",width:3},marker:{size:[0,9],color:"#f87171",symbol:"arrow-up"}};
  var vvec={x:[p[0],p[0]+vproj[0]],y:[p[1],p[1]+vproj[1]],mode:"lines+markers",name:"v = Π_T(u) (Riemannian grad)",line:{color:"#4ecdc4",width:3.5},marker:{size:[0,11],color:"#4ecdc4",symbol:"arrow-up"}};
  var pmark={x:[p[0]],y:[p[1]],mode:"markers+text",text:["p"],textposition:"top right",marker:{size:12,color:"#c8a96e"},name:"p",textfont:{color:"#ebe6dc",size:15},showlegend:false};
  var layout={title:{text:"Tangent space at p: Riemannian gradient = ambient minus radial",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.10)",range:[-1.6,2.4],showticklabels:false},yaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.10)",range:[-1.6,1.9],showticklabels:false,scaleanchor:"x"},margin:{t:40,r:20,b:20,l:20},showlegend:true,legend:{font:{color:"#ebe6dc"},x:0.55,y:0.05}};
  Plotly.newPlot("plot-ml8-tangent-en",[circle,tline,uvec,vvec,pmark],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> At point p on the sphere, the green tangent line is T_p M — the linear approximation to the manifold. The red arrow u is an arbitrary ambient gradient (e.g. from autograd). The cyan arrow is its projection v = u − (pᵀu)p onto the tangent space — the Riemannian gradient. Stepping along v keeps you tangent to the sphere; stepping along u sends you off the manifold and requires renormalization.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Exponential Map and Geodesics</h2>
<p class="l-text">A <strong>geodesic</strong> is the manifold's analogue of a straight line: the shortest path between two points, locally. The <strong>exponential map</strong> $\\exp_p : T_p\\mathcal{M} \\to \\mathcal{M}$ takes a tangent vector $v$ and returns the point you reach by walking along the geodesic from $p$ in direction $v$ for unit time:</p>

<div class="katex-block">$$\\gamma(t) = \\exp_p(t\\, v).$$</div>

<p class="l-text">On the sphere, geodesics are great circles. With $\\|v\\| = \\theta$ (so the geodesic walks $\\theta$ radians), the closed-form exp map is:</p>

<div class="katex-block">$$\\exp_p(v) = \\cos(\\|v\\|)\\, p + \\sin(\\|v\\|)\\, \\frac{v}{\\|v\\|}.$$</div>

<p class="l-text">The inverse is the <strong>logarithmic map</strong> $\\log_p(q) \\in T_p\\mathcal{M}$, which gives "the tangent vector at $p$ that points toward $q$ along the geodesic":</p>

<div class="katex-block">$$\\log_p(q) = \\theta \\cdot \\frac{q - (p^\\top q)\\,p}{\\|q - (p^\\top q)\\,p\\|}, \\quad \\theta = \\arccos(p^\\top q).$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">exp_sphere</span>(p, v):
    nv = np.linalg.<span class="fn">norm</span>(v)
    <span class="kw">if</span> nv &lt; <span class="num">1e-12</span>:
        <span class="kw">return</span> p
    <span class="kw">return</span> np.<span class="fn">cos</span>(nv) * p + np.<span class="fn">sin</span>(nv) * v / nv

<span class="kw">def</span> <span class="fn">log_sphere</span>(p, q):
    cos_t = np.<span class="fn">clip</span>(p @ q, -<span class="num">1.0</span>, <span class="num">1.0</span>)
    theta = np.<span class="fn">arccos</span>(cos_t)
    <span class="kw">if</span> theta &lt; <span class="num">1e-12</span>:
        <span class="kw">return</span> np.<span class="fn">zeros_like</span>(p)
    u = q - cos_t * p
    <span class="kw">return</span> theta * u / np.linalg.<span class="fn">norm</span>(u)

<span class="cm"># Two unit vectors on S^2 — north pole and a point on the equator</span>
p = np.<span class="fn">array</span>([<span class="num">0.0</span>, <span class="num">0.0</span>, <span class="num">1.0</span>])
q = np.<span class="fn">array</span>([<span class="num">1.0</span>, <span class="num">0.0</span>, <span class="num">0.0</span>])

v = <span class="fn">log_sphere</span>(p, q)                    <span class="cm"># tangent vector at p pointing at q</span>
q_back = <span class="fn">exp_sphere</span>(p, v)               <span class="cm"># walk along the geodesic</span>

<span class="fn">print</span>(f<span class="str">"p           = {p}"</span>)
<span class="fn">print</span>(f<span class="str">"q           = {q}"</span>)
<span class="fn">print</span>(f<span class="str">"log_p(q) = v= {v}"</span>)
<span class="fn">print</span>(f<span class="str">"||v|| = theta= {np.linalg.norm(v):.4f}   (should be pi/2 = {np.pi/2:.4f})"</span>)
<span class="fn">print</span>(f<span class="str">"exp_p(v)    = {q_back}    (should equal q)"</span>)
<span class="fn">print</span>(f<span class="str">"recovery err= {np.linalg.norm(q_back - q):.2e}"</span>)

<span class="cm"># Trace the geodesic and verify every point lies on the sphere</span>
<span class="fn">print</span>(<span class="str">"\\nGeodesic samples gamma(t) = exp_p(t*v):"</span>)
<span class="kw">for</span> t <span class="kw">in</span> np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, <span class="num">6</span>):
    pt = <span class="fn">exp_sphere</span>(p, t * v)
    <span class="fn">print</span>(f<span class="str">"  t={t:.2f}  point={pt.round(3)}  ||point||={np.linalg.norm(pt):.6f}"</span>)
</code></pre></div>

<p class="l-text">Every sampled point on the geodesic has norm 1 to machine precision — the exp map is exact, not approximate. Compare this with the Euclidean shortcut "linearly interpolate then renormalize" (slerp's lazy cousin), which leaves the manifold and has to be projected back, accumulating error step by step.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Geodesic Distance vs Euclidean Distance</h2>
<p class="l-text">On the sphere of radius 1, the geodesic distance between unit vectors $p, q$ is $d(p,q) = \\arccos(p^\\top q) = \\theta$. The Euclidean (chord) distance is $\\|p - q\\| = 2 \\sin(\\theta / 2)$. They agree to first order for small $\\theta$ but diverge as the points get farther apart.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

p = np.<span class="fn">array</span>([<span class="num">1.0</span>, <span class="num">0.0</span>, <span class="num">0.0</span>])

<span class="fn">print</span>(f<span class="str">"{'theta (rad)':&gt;12} | {'chord':&gt;8} | {'geodesic':&gt;9} | {'cosine sim':&gt;10}"</span>)
<span class="fn">print</span>(<span class="str">"-"</span> * <span class="num">50</span>)
<span class="kw">for</span> theta <span class="kw">in</span> [<span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">0.5</span>, <span class="num">1.0</span>, np.pi/<span class="num">2</span>, <span class="num">2.0</span>, np.pi - <span class="num">0.01</span>]:
    q = np.<span class="fn">array</span>([np.<span class="fn">cos</span>(theta), np.<span class="fn">sin</span>(theta), <span class="num">0.0</span>])
    chord = np.linalg.<span class="fn">norm</span>(p - q)
    geo   = np.<span class="fn">arccos</span>(np.<span class="fn">clip</span>(p @ q, -<span class="num">1</span>, <span class="num">1</span>))
    cos_s = p @ q
    <span class="fn">print</span>(f<span class="str">"{theta:&gt;12.4f} | {chord:&gt;8.4f} | {geo:&gt;9.4f} | {cos_s:&gt;10.4f}"</span>)

<span class="fn">print</span>(<span class="str">"\\nFor small theta both converge: chord ~ geodesic ~ theta."</span>)
<span class="fn">print</span>(<span class="str">"For antipodal points (theta = pi): chord = 2, geodesic = pi."</span>)
</code></pre></div>

<p class="l-text">In NLP, the cosine similarity is just $\\cos(\\theta) = p^\\top q$ for unit-normalized embeddings. The "angular distance" is the geodesic distance on the sphere. Treating the embedding space as a sphere is more honest than treating it as flat Euclidean — and is exactly what hyperbolic embeddings (Nickel &amp; Kiela 2017) generalized further by replacing the sphere with a hyperboloid.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Riemannian Gradient Descent</h2>
<p class="l-text">Gradient descent on a manifold has the same shape as Euclidean GD with two replacements: ambient gradient → projected (Riemannian) gradient, and additive update → exp map.</p>

<div class="katex-block">$$x_{k+1} = \\exp_{x_k}\\bigl(-\\eta\\, \\mathrm{grad}\\, f(x_k)\\bigr), \\qquad \\mathrm{grad}\\, f(x) = \\Pi_{T_x \\mathcal{M}}\\bigl(\\nabla f(x)\\bigr).$$</div>

<p class="l-text">The Riemannian gradient is the projection of the ambient (Euclidean) gradient onto the tangent space. The exp map keeps you on the manifold. That is the whole algorithm.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Problem: find the unit vector x in R^3 that maximizes x^T A x for symmetric A.</span>
<span class="cm"># Equivalently min f(x) = -x^T A x  on  S^2.</span>
<span class="cm"># The optimum is the top eigenvector of A.</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">7</span>)
A = rng.<span class="fn">standard_normal</span>((<span class="num">3</span>,<span class="num">3</span>)); A = (A + A.T) / <span class="num">2</span>
<span class="fn">print</span>(<span class="str">"A =\\n"</span>, A)

eigvals, eigvecs = np.linalg.<span class="fn">eigh</span>(A)
top_eig = eigvecs[:, -<span class="num">1</span>] * np.<span class="fn">sign</span>(eigvecs[<span class="num">0</span>, -<span class="num">1</span>])
<span class="fn">print</span>(f<span class="str">"Top eigenvalue (target max) = {eigvals[-1]:.4f}"</span>)

<span class="kw">def</span> <span class="fn">f</span>(x):       <span class="kw">return</span> -x @ A @ x
<span class="kw">def</span> <span class="fn">grad_amb</span>(x):<span class="kw">return</span> -<span class="num">2</span> * A @ x

<span class="kw">def</span> <span class="fn">proj_tan</span>(p, u): <span class="kw">return</span> u - (p @ u) * p
<span class="kw">def</span> <span class="fn">exp_sphere</span>(p, v):
    nv = np.linalg.<span class="fn">norm</span>(v)
    <span class="kw">return</span> p <span class="kw">if</span> nv &lt; <span class="num">1e-12</span> <span class="kw">else</span> np.<span class="fn">cos</span>(nv)*p + np.<span class="fn">sin</span>(nv)*v/nv

<span class="cm"># Start somewhere on S^2</span>
x = rng.<span class="fn">standard_normal</span>(<span class="num">3</span>); x /= np.linalg.<span class="fn">norm</span>(x)
eta = <span class="num">0.05</span>
<span class="fn">print</span>(f<span class="str">"\\nStart: x={x.round(3)}, f={f(x):.4f}, ||x||={np.linalg.norm(x):.6f}"</span>)

<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    g_riem = <span class="fn">proj_tan</span>(x, <span class="fn">grad_amb</span>(x))
    x = <span class="fn">exp_sphere</span>(x, -eta * g_riem)

<span class="fn">print</span>(f<span class="str">"After 200 steps: x={x.round(4)}, f={f(x):.4f}, ||x||={np.linalg.norm(x):.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"Compare top eigenvector: {top_eig.round(4)}"</span>)
<span class="fn">print</span>(f<span class="str">"|x - top_eig| = {np.linalg.norm(x - x[0]/abs(x[0]) * np.abs(top_eig)):.4f}  (sign-aligned)"</span>)
<span class="fn">print</span>(f<span class="str">"\\nObservation: ||x|| stays = 1 to machine precision throughout."</span>)
</code></pre></div>

<p class="l-text">After 200 Riemannian GD steps the iterate has converged to the top eigenvector. Critically, $\\|x\\| = 1$ at every single iteration — there is no projection step, no renormalization, no constraint violation to clean up. This is what manifold optimization buys you. For comparison, doing the same with Euclidean GD plus penalty $\\lambda(\\|x\\|^2 - 1)^2$ requires tuning $\\lambda$ and still drifts off the sphere by an amount proportional to the step size.</p>

<div id="plot-ml8-rgd-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  // Sphere slice
  var cx=[],cy=[];
  for(var i=0;i<=200;i++){var t=i*Math.PI*2/200; cx.push(Math.cos(t)); cy.push(Math.sin(t));}
  var circle={x:cx,y:cy,mode:"lines",name:"S¹ (constraint manifold)",line:{color:"rgba(235,230,220,0.45)",width:2}};
  // Riemannian GD trajectory: stays on sphere
  var rx=[],ry=[]; var ang=2.6;
  for(var k=0;k<14;k++){rx.push(Math.cos(ang)); ry.push(Math.sin(ang)); ang = ang - 0.22;}
  var rgd={x:rx,y:ry,mode:"lines+markers",name:"Riemannian GD (stays on S¹)",line:{color:"#4ade80",width:2.5},marker:{size:8,color:"#4ade80",symbol:"circle"}};
  // Euclidean GD off-manifold path: goes off then projection
  var ex=[],ey=[]; var x=Math.cos(2.6), y=Math.sin(2.6);
  for(var k=0;k<14;k++){
    ex.push(x); ey.push(y);
    // pretend gradient is ambient pointing toward (1,0); take step
    var gx=-(x-1.0)*0.18, gy=-y*0.18;
    x = x + gx; y = y + gy;
  }
  var egd={x:ex,y:ey,mode:"lines+markers",name:"Euclidean GD (drifts off, projects)",line:{color:"#f87171",width:2,dash:"dot"},marker:{size:7,color:"#f87171",symbol:"x"}};
  var target={x:[1.0],y:[0.0],mode:"markers+text",text:["target (top eig)"],textposition:"middle right",marker:{size:13,color:"#c8a96e",symbol:"star"},textfont:{color:"#c8a96e",size:12},name:"optimum"};
  var layout={title:{text:"Riemannian GD on the sphere: constraint preserved exactly",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.10)",range:[-1.4,1.7],showticklabels:false},yaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.10)",range:[-1.3,1.4],showticklabels:false,scaleanchor:"x"},margin:{t:40,r:20,b:20,l:20},showlegend:true,legend:{font:{color:"#ebe6dc"},x:0.02,y:0.05}};
  Plotly.newPlot("plot-ml8-rgd-en",[circle,egd,rgd,target],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Same problem (find top eigenvector ≈ (1,0)), two methods. The green Riemannian GD trajectory rides the unit circle to the optimum — every iterate satisfies ‖x‖=1 to machine precision. The red Euclidean GD trajectory drifts off the manifold each step (the small interior dots) and would need a separate projection per step. For Stiefel, SPD, and orthogonal-weight problems this difference becomes night and day.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Stiefel Manifold and Why It Matters</h2>
<p class="l-text">The Stiefel manifold $\\text{St}(d,k) = \\{X \\in \\mathbb{R}^{d \\times k} : X^\\top X = I_k\\}$ is the set of orthonormal $k$-frames in $\\mathbb{R}^d$. Three places it appears in modern ML:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PCA / sparse PCA</div><div class="card-body">PCA finds $X \\in \\text{St}(d,k)$ maximizing $\\mathrm{tr}(X^\\top \\Sigma X)$. The closed-form solution is the top-$k$ eigenvectors; sparse / robust variants need Riemannian GD on Stiefel.</div></div>
<div class="calc-card"><div class="card-title">Orthogonal weight init &amp; regularization</div><div class="card-body">Orthogonal RNN weights (Arjovsky 2016) and orthogonal CNN filters (Bansal 2018) keep activations from exploding / vanishing. Maintained by Stiefel-projected updates.</div></div>
<div class="calc-card"><div class="card-title">Attention orthogonality</div><div class="card-body">Some recent work imposes orthogonality on multi-head projections (e.g. orthogonal LoRA, OFT) to reduce head redundancy. Implemented as Stiefel constraints.</div></div>
<div class="calc-card"><div class="card-title">Procrustes / alignment</div><div class="card-body">Aligning two embedding spaces by a rotation is $\\min_{R \\in O(d)} \\|XR - Y\\|_F^2$ — the orthogonal Procrustes problem, naturally on the orthogonal manifold $O(d) \\subset \\text{St}(d,d)$.</div></div>
</div>

<p class="l-text">Production toolkits: <code>geoopt</code> for PyTorch and <code>pymanopt</code> for NumPy / TensorFlow / JAX implement Riemannian SGD, Adam, and conjugate gradient on sphere, Stiefel, Grassmann, and SPD manifolds. They are well-tested and worth using when your problem has the right structure — do not roll your own beyond the sphere example above.</p>

<div class="calc-highlight"><strong>Honest take:</strong> for unconstrained deep nets, manifold optimization is not the right framing — overparameterization makes the loss landscape forgiving enough that Adam wins. For constrained problems (orthogonal weights, low-rank approximation, distance metric learning) it is decisively better than penalty methods.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The SPD Manifold and Why Euclidean Fails</h2>
<p class="l-text">Symmetric positive-definite matrices (covariances, kernels, metric tensors) live on a manifold, and the Euclidean structure does <em>not</em> respect it. Two examples make this concrete.</p>

<p class="l-text"><strong>Mean of two covariances.</strong> Naively averaging $\\Sigma_1$ and $\\Sigma_2$ component-wise gives $(\\Sigma_1 + \\Sigma_2)/2$ — Euclidean mean. The Riemannian mean (under the affine-invariant metric) is $\\Sigma_1^{1/2}\\bigl(\\Sigma_1^{-1/2} \\Sigma_2 \\Sigma_1^{-1/2}\\bigr)^{1/2} \\Sigma_1^{1/2}$ — the geometric mean. The Riemannian version is invariant under congruence transforms $\\Sigma \\mapsto P^\\top \\Sigma P$, the Euclidean version is not. For brain imaging (Pennec 2006) and DTI tensor processing this distinction is the difference between sensible and nonsense averages.</p>

<p class="l-text"><strong>Determinant blow-up.</strong> Euclidean interpolation between two covariances with very different scales can produce a covariance whose determinant exceeds either endpoint by orders of magnitude — physically wrong (mixing two narrow distributions cannot give one wider than both). The Riemannian geodesic preserves determinants in the right way.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.linalg <span class="kw">import</span> sqrtm

<span class="kw">def</span> <span class="fn">riemann_mean_spd</span>(A, B):
    <span class="str">"""Affine-invariant geometric mean of SPD matrices."""</span>
    sA = <span class="fn">sqrtm</span>(A); sAi = np.linalg.<span class="fn">inv</span>(sA)
    M = <span class="fn">sqrtm</span>(sAi @ B @ sAi)
    <span class="kw">return</span> np.<span class="fn">real</span>(sA @ M @ sA)

A = np.<span class="fn">array</span>([[<span class="num">4.0</span>, <span class="num">0.5</span>],
              [<span class="num">0.5</span>, <span class="num">1.0</span>]])
B = np.<span class="fn">array</span>([[<span class="num">1.0</span>, -<span class="num">0.2</span>],
              [-<span class="num">0.2</span>, <span class="num">9.0</span>]])
M_eucl  = (A + B) / <span class="num">2</span>
M_riem  = <span class="fn">riemann_mean_spd</span>(A, B)

<span class="fn">print</span>(<span class="str">"A =\\n"</span>, A)
<span class="fn">print</span>(<span class="str">"B =\\n"</span>, B)
<span class="fn">print</span>(f<span class="str">"\\nEuclidean mean det = {np.linalg.det(M_eucl):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Riemannian mean det = {np.linalg.det(M_riem):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"\\ndet(A) = {np.linalg.det(A):.3f}, det(B) = {np.linalg.det(B):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Geometric mean of dets = {np.sqrt(np.linalg.det(A)*np.linalg.det(B)):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"\\nRiemannian mean det matches geometric mean of dets to numerical precision."</span>)
</code></pre></div>

<p class="l-text">The Riemannian (affine-invariant) mean has determinant equal to the geometric mean of $\\det(A)$ and $\\det(B)$ — a property the Euclidean mean does not have. For any application where covariances are quantitative (signal power, uncertainty volume, Fisher information), the Riemannian version is the right one.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">A manifold is a constraint surface that is locally Euclidean. The tangent space at a point is the linearization; the exp map turns a tangent vector into a point you reach by walking a geodesic; the log map inverts it. Riemannian gradient descent is "project the ambient gradient onto the tangent space, then exp" — and it stays exactly on the manifold at every step. The sphere $S^{n-1}$, the Stiefel manifold $\\text{St}(d,k)$, the Grassmann, and the SPD cone are the four manifolds you actually meet in ML.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Manifold = curved space, locally flat. Charts give local Euclidean coordinates of dimension $d$.</li>
<li>Tangent space $T_p\\mathcal{M}$: the linear approximation. On $S^{n-1}$, vectors orthogonal to $p$.</li>
<li>Exp map $\\exp_p(v)$: walk a geodesic from $p$ in direction $v$. On the sphere: $\\cos\\|v\\|\\,p + \\sin\\|v\\|\\,v/\\|v\\|$.</li>
<li>Log map $\\log_p(q)$: inverse — the tangent vector pointing at $q$.</li>
<li>Riemannian GD = project gradient + exp step. Constraint preserved exactly, no penalties.</li>
<li>Stiefel for orthogonal weights / PCA, SPD for covariances, sphere for unit-norm embeddings.</li>
<li>For unconstrained deep nets, Euclidean Adam still wins; for constrained problems, manifold methods beat penalties decisively.</li>
</ul>
</div>

<p class="l-text">In <strong>math-L9</strong> we make the manifold itself a space of probability distributions, with Fisher information as its metric. That gives us <em>information geometry</em> — the Cramer-Rao bound as a curvature statement, KL divergence as a natural distance, and the natural gradient $\\theta \\leftarrow \\theta - \\eta\\, I^{-1} \\nabla L$ as Riemannian GD on this distribution manifold. K-FAC, Shampoo, and large-batch second-order methods all live downstream of that one idea.</p>
</div>`,
tr: `<p class="l-text"><strong>Manifold, yakınlaştırırsan düz görünen kıvrımlı bir uzaydır.</strong> Dünya'nın yüzeyi bir 2-manifolddur: yerel olarak bir düzlem (haritan), küresel olarak bir küre. $\\mathbb{R}^3$'teki tüm rotasyon matrislerinin kümesi bir 3-manifolddur. Birim-norm sözcük gömme kümesi bir küredir. PCA, dikkat başlıkları ve ortogonal ağırlık ilklendirmesinde kullanılan ortogonal $d \\times k$ matrislerinin kümesi Stiefel manifoldudur. Değişkenlerinin kendisi pürüzsüz olan bir kısıtı varsa — birim norm, ortogonallik, pozitif-tanımlılık, sabit rank — optimize etmek için doğal yer manifoldun kendisidir, ortam Öklid uzayında bir cezayla değil.</p>

<p class="l-text">Manifold optimizasyonu, kısıtlarla Öklid optimizasyonunun veremediği üç şeyi verir: kısıt kümesini asla terk etmez (bu yüzden projeksiyon hatası asla birikmez), kullandığı geometri içsel niteliktir (bu yüzden adımlar eğriliği saygılayır, örn. küre üzerinde içeriden değil büyük bir daire boyunca hareket eder) ve manifold yapısını saygılayan ikinci-mertebe yöntemlere erişim sağlar. Bu derste geometriyi en basit önemsiz olmayan örnek üzerinde, birim küre $S^{n-1}$, kuruyoruz — tanjant uzayları, exp ve log haritaları, jeodezikler — sonra Riemann gradient inişini ve derin öğrenmede kullanılan Stiefel manifoldunu önizliyoruz. Boyunca referans: Absil, Mahony &amp; Sepulchre, <em>Optimization Algorithms on Matrix Manifolds</em> (2008).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Pürüzsüz bir manifoldu ve bir noktadaki tanjant uzayını tanımlamak</li>
<li>Küre üzerinde exp haritasını ve log haritasını elle hesaplamak</li>
<li>$S^2$ üzerinde bir jeodezik izlemek — iki birim vektör arasındaki en kısa yol</li>
<li>Bir ortam gradientini tanjant uzayına projekte etmek ve Riemann gradient inişi çalıştırmak</li>
<li>Stiefel manifoldunu tanımak ve neden PCA ve dikkatte göründüğünü anlamak</li>
<li>Manifold yöntemlerinin nerede yardımcı olduğunu (düşük boyutlu kısıt yüzeyleri) ve nerede olmadığını (yüksek boyutlu kısıtsız derin öğrenme) görmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Manifold Nedir?</h2>
<p class="l-text"><strong>Pürüzsüz bir $d$-manifold</strong> $\\mathcal{M}$, bir harita atlasıyla birlikte gelen bir kümedir: $\\mathcal{M}$'nin açık parçalarından $\\mathbb{R}^d$'nin açık alt kümelerine, örtüştükleri yerde pürüzsüz olan haritalar. Boyut $d$, bağımsız yerel koordinatların sayısıdır. Manifoldlarla neredeyse her zaman $N &gt; d$ olan bir $\\mathbb{R}^N$'ye gömülmüş şekilde karşılaşırız — küre $S^2$ $\\mathbb{R}^3$'te yaşar ama içsel olarak 2-boyutludur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Küre $S^{n-1}$</div><div class="card-body">$\\{x \\in \\mathbb{R}^n : \\|x\\| = 1\\}$. Boyut $n-1$. Birim-norm gömlerin yaşadığı yer (word2vec, normalize edilmiş kontrastif özellikler, yönler).</div></div>
<div class="calc-card"><div class="card-title">Stiefel $\\text{St}(d,k)$</div><div class="card-body">$\\{X \\in \\mathbb{R}^{d\\times k} : X^\\top X = I_k\\}$. $\\mathbb{R}^d$'de ortonormal $k$-çerçeveler. PCA, ICA, ortogonal ağırlık init, çok-başlı dikkat ortogonalliğinde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Grassmann $\\text{Gr}(d,k)$</div><div class="card-body">$\\mathbb{R}^d$'nin $k$-boyutlu alt uzayları. Alt uzay izleme ve boyut indirgemede kullanılır.</div></div>
<div class="calc-card"><div class="card-title">SPD koni</div><div class="card-body">Simetrik pozitif-tanımlı matrisler. Kovaryans tahmini ve metrik öğrenmede kullanılır. Riemann (afin-değişmez) metriği burada Öklid'i kötü bir şekilde yener.</div></div>
</div>

<div class="calc-highlight"><strong>Neden umursamalı:</strong> manifoldda <em>kalmak zorunda</em> olan bir miktarı optimize ediyorsan (ortogonal ağırlıklar, birim-norm gömler, geçerli kovaryans), Riemann yöntemleri her adımda kısıtı tam olarak korur. Projeksiyon hatası yok, ceza hiperparametreleri yok.</div>

<div id="plot-ml8-geodesic-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var cx=[],cy=[];
  for(var i=0;i<=200;i++){var t=i*Math.PI*2/200; cx.push(Math.cos(t)); cy.push(Math.sin(t));}
  var circle={x:cx,y:cy,mode:"lines",name:"manifold (S² dilimi)",line:{color:"rgba(235,230,220,0.45)",width:2}};
  var p=[Math.cos(0.2),Math.sin(0.2)];
  var q=[Math.cos(2.4),Math.sin(2.4)];
  var gx=[],gy=[];
  for(var i=0;i<=80;i++){var s=i/80; var a=0.2+s*(2.4-0.2); gx.push(Math.cos(a)); gy.push(Math.sin(a));}
  var geo={x:gx,y:gy,mode:"lines",name:"jeodezik (büyük daire, manifoldda)",line:{color:"#c8a96e",width:4}};
  var euc={x:[p[0],q[0]],y:[p[1],q[1]],mode:"lines",name:"Öklid kirişi (içinden geçer)",line:{color:"#f87171",width:3,dash:"dash"}};
  var pts={x:[p[0],q[0]],y:[p[1],q[1]],mode:"markers+text",text:["p","q"],textposition:"top right",marker:{size:11,color:"#4ecdc4"},name:"uçlar",textfont:{color:"#ebe6dc",size:14}};
  var layout={title:{text:"Küre üzerinde jeodezik vs Öklid kirişi",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.10)",range:[-1.4,1.4],showticklabels:false},yaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.10)",range:[-1.3,1.4],showticklabels:false,scaleanchor:"x"},margin:{t:40,r:20,b:20,l:20},showlegend:true,legend:{font:{color:"#ebe6dc"}}};
  Plotly.newPlot("plot-ml8-geodesic-tr",[circle,euc,geo,pts],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Gri halka birim küre üzerindeki büyük bir dairedir — S²'nin 1B dilimi. Altın jeodezik tüm yol boyunca p'den q'ya manifoldda kalır. Kırmızı Öklid kirişi içeriden geçer ve küreyi terk eder. Riemann optimizasyonu altın yol boyunca yürür; vanilya Öklid GD + projeksiyon kırmızı kısayolu alıp yeniden normalize eder — hata biriktirir.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Tanjant Uzayı</h2>
<p class="l-text">Her $p \\in \\mathcal{M}$ noktasında, <strong>tanjant uzayı</strong> $T_p\\mathcal{M}$ manifolda doğrusal yaklaşımdır — "$p$'den geçen en iyi düz $d$-boyutlu düzlem". Bir tanjant vektör $v \\in T_p\\mathcal{M}$ bir hızdır: $p$'den geçen manifold üzerindeki bir eğrinin türevi.</p>

<p class="l-text">$\\mathbb{R}^n$'ye gömülü küre $S^{n-1}$ için, $p$'deki tanjant uzayı tam olarak $p$'ye dik vektörlerin kümesidir:</p>

<div class="katex-block">$$T_p S^{n-1} = \\{v \\in \\mathbb{R}^n : p^\\top v = 0\\}.$$</div>

<p class="l-text">Bu sezgiseldir: kürede anlık olarak kalmak için radyal hareket edemezsin. Her noktadaki tanjant uzayı $\\mathbb{R}^n$'in doğrusal $(n-1)$-boyutlu bir alt uzayıdır.</p>

<p class="l-text">Stiefel manifoldu için benzer koşul $X^\\top V + V^\\top X = 0$'dır — $X^\\top V$'nin antisimetrik kısmı kaybolur — bu da "ortonormal kalmak için hızının sütunlara dik olması gerek" demektir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># $p$'deki $S^{n-1}$'in tanjant uzayına bir ortam vektörünü projekte et</span>
<span class="kw">def</span> <span class="fn">proj_tangent_sphere</span>(p, u):
    <span class="kw">return</span> u - (p @ u) * p

p = np.<span class="fn">array</span>([<span class="num">0.0</span>, <span class="num">0.0</span>, <span class="num">1.0</span>])     <span class="cm"># S^2'nin kuzey kutbu</span>
u = np.<span class="fn">array</span>([<span class="num">1.5</span>, <span class="num">0.7</span>, <span class="num">2.3</span>])     <span class="cm"># rastgele ortam vektörü</span>
v = <span class="fn">proj_tangent_sphere</span>(p, u)

<span class="fn">print</span>(f<span class="str">"p          = {p}"</span>)
<span class="fn">print</span>(f<span class="str">"u (ortam)  = {u}"</span>)
<span class="fn">print</span>(f<span class="str">"v (tanjant)= {v}"</span>)
<span class="fn">print</span>(f<span class="str">"p . v      = {p @ v:.2e}    (0 olmalı)"</span>)
<span class="fn">print</span>(f<span class="str">"||v||      = {np.linalg.norm(v):.4f}"</span>)

<span class="cm"># Önemsiz olmayan bir noktada doğrula</span>
p2 = np.<span class="fn">array</span>([<span class="num">0.6</span>, <span class="num">0.8</span>, <span class="num">0.0</span>]); p2 /= np.linalg.<span class="fn">norm</span>(p2)
u2 = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>).<span class="fn">standard_normal</span>(<span class="num">3</span>)
v2 = <span class="fn">proj_tangent_sphere</span>(p2, u2)
<span class="fn">print</span>(f<span class="str">"\\nGenel nokta p2 = {p2}"</span>)
<span class="fn">print</span>(f<span class="str">"p2 . v2 = {p2 @ v2:.2e}    (0 olmalı)"</span>)
</code></pre></div>

<p class="l-text">Projeksiyon $v = u - (p^\\top u) p$ radyal bileşeni kaldırır. Bu, küre üzerinde Öklid gradientini Riemann gradientine dönüştüren tek satırdır ve $S^{n-1}$ üzerinde optimizasyonun kürede kalmasını sağlayan şeydir.</p>

<div id="plot-ml8-tangent-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var cx=[],cy=[];
  for(var i=0;i<=200;i++){var t=i*Math.PI*2/200; cx.push(Math.cos(t)); cy.push(Math.sin(t));}
  var circle={x:cx,y:cy,mode:"lines",name:"S¹ (küre dilimi)",line:{color:"rgba(235,230,220,0.45)",width:2}};
  var ang=0.9;
  var p=[Math.cos(ang),Math.sin(ang)];
  var t=[-Math.sin(ang),Math.cos(ang)];
  var tline={x:[p[0]-1.6*t[0],p[0]+1.6*t[0]],y:[p[1]-1.6*t[1],p[1]+1.6*t[1]],mode:"lines",name:"tanjant doğrusu T_p M",line:{color:"#4ade80",width:3}};
  var u=[1.2,0.4];
  var pdotu=p[0]*u[0]+p[1]*u[1];
  var vproj=[u[0]-pdotu*p[0], u[1]-pdotu*p[1]];
  var uvec={x:[p[0],p[0]+u[0]],y:[p[1],p[1]+u[1]],mode:"lines+markers",name:"u (ortam gradienti)",line:{color:"#f87171",width:3},marker:{size:[0,9],color:"#f87171",symbol:"arrow-up"}};
  var vvec={x:[p[0],p[0]+vproj[0]],y:[p[1],p[1]+vproj[1]],mode:"lines+markers",name:"v = Π_T(u) (Riemann grad)",line:{color:"#4ecdc4",width:3.5},marker:{size:[0,11],color:"#4ecdc4",symbol:"arrow-up"}};
  var pmark={x:[p[0]],y:[p[1]],mode:"markers+text",text:["p"],textposition:"top right",marker:{size:12,color:"#c8a96e"},name:"p",textfont:{color:"#ebe6dc",size:15},showlegend:false};
  var layout={title:{text:"p'deki tanjant uzayı: Riemann grad = ortam − radyal",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.10)",range:[-1.6,2.4],showticklabels:false},yaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.10)",range:[-1.6,1.9],showticklabels:false,scaleanchor:"x"},margin:{t:40,r:20,b:20,l:20},showlegend:true,legend:{font:{color:"#ebe6dc"},x:0.55,y:0.05}};
  Plotly.newPlot("plot-ml8-tangent-tr",[circle,tline,uvec,vvec,pmark],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Küre üzerindeki p noktasında, yeşil tanjant doğrusu T_p M'dir — manifolda doğrusal yaklaşım. Kırmızı ok u rastgele bir ortam gradientidir (örn. autograd'dan). Camgöbeği ok onun tanjant uzayına projeksiyonudur v = u − (pᵀu)p — yani Riemann gradienti. v boyunca adım atmak seni küreye teğet tutar; u boyunca adım atmak seni manifolddan dışarı atar ve yeniden normalleştirme gerektirir.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Exp Haritası ve Jeodezikler</h2>
<p class="l-text">Bir <strong>jeodezik</strong> manifoldun düz çizginin analoğudur: iki nokta arasındaki en kısa yol, yerel olarak. <strong>Exp haritası</strong> $\\exp_p : T_p\\mathcal{M} \\to \\mathcal{M}$ bir tanjant vektörü $v$ alır ve $p$'den $v$ yönünde birim zaman boyunca jeodezik üzerinde yürüyerek ulaştığın noktayı döndürür:</p>

<div class="katex-block">$$\\gamma(t) = \\exp_p(t\\, v).$$</div>

<p class="l-text">Küre üzerinde jeodezikler büyük dairelerdir. $\\|v\\| = \\theta$ ile (jeodezik $\\theta$ radyan yürür), kapalı-form exp haritası:</p>

<div class="katex-block">$$\\exp_p(v) = \\cos(\\|v\\|)\\, p + \\sin(\\|v\\|)\\, \\frac{v}{\\|v\\|}.$$</div>

<p class="l-text">Tersi <strong>log haritası</strong> $\\log_p(q) \\in T_p\\mathcal{M}$'dir, "jeodezik boyunca $q$'ya işaret eden $p$'deki tanjant vektör"ü verir:</p>

<div class="katex-block">$$\\log_p(q) = \\theta \\cdot \\frac{q - (p^\\top q)\\,p}{\\|q - (p^\\top q)\\,p\\|}, \\quad \\theta = \\arccos(p^\\top q).$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">exp_sphere</span>(p, v):
    nv = np.linalg.<span class="fn">norm</span>(v)
    <span class="kw">if</span> nv &lt; <span class="num">1e-12</span>:
        <span class="kw">return</span> p
    <span class="kw">return</span> np.<span class="fn">cos</span>(nv) * p + np.<span class="fn">sin</span>(nv) * v / nv

<span class="kw">def</span> <span class="fn">log_sphere</span>(p, q):
    cos_t = np.<span class="fn">clip</span>(p @ q, -<span class="num">1.0</span>, <span class="num">1.0</span>)
    theta = np.<span class="fn">arccos</span>(cos_t)
    <span class="kw">if</span> theta &lt; <span class="num">1e-12</span>:
        <span class="kw">return</span> np.<span class="fn">zeros_like</span>(p)
    u = q - cos_t * p
    <span class="kw">return</span> theta * u / np.linalg.<span class="fn">norm</span>(u)

<span class="cm"># S^2 üzerinde iki birim vektör — kuzey kutbu ve ekvatordaki bir nokta</span>
p = np.<span class="fn">array</span>([<span class="num">0.0</span>, <span class="num">0.0</span>, <span class="num">1.0</span>])
q = np.<span class="fn">array</span>([<span class="num">1.0</span>, <span class="num">0.0</span>, <span class="num">0.0</span>])

v = <span class="fn">log_sphere</span>(p, q)                    <span class="cm"># q'ya işaret eden p'deki tanjant vektör</span>
q_back = <span class="fn">exp_sphere</span>(p, v)               <span class="cm"># jeodezik boyunca yürü</span>

<span class="fn">print</span>(f<span class="str">"p           = {p}"</span>)
<span class="fn">print</span>(f<span class="str">"q           = {q}"</span>)
<span class="fn">print</span>(f<span class="str">"log_p(q) = v= {v}"</span>)
<span class="fn">print</span>(f<span class="str">"||v|| = theta= {np.linalg.norm(v):.4f}   (pi/2 = {np.pi/2:.4f} olmalı)"</span>)
<span class="fn">print</span>(f<span class="str">"exp_p(v)    = {q_back}    (q'ya eşit olmalı)"</span>)
<span class="fn">print</span>(f<span class="str">"kurtarma hatası= {np.linalg.norm(q_back - q):.2e}"</span>)

<span class="cm"># Jeodeziği izle ve her noktanın küre üzerinde olduğunu doğrula</span>
<span class="fn">print</span>(<span class="str">"\\nJeodezik örnekleri gamma(t) = exp_p(t*v):"</span>)
<span class="kw">for</span> t <span class="kw">in</span> np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, <span class="num">6</span>):
    pt = <span class="fn">exp_sphere</span>(p, t * v)
    <span class="fn">print</span>(f<span class="str">"  t={t:.2f}  nokta={pt.round(3)}  ||nokta||={np.linalg.norm(pt):.6f}"</span>)
</code></pre></div>

<p class="l-text">Jeodezik üzerinde her örneklenmiş noktanın normu makine hassasiyetinde 1'dir — exp haritası kesin, yaklaşık değildir. Bunu Öklid kısayoluyla "doğrusal interpolasyon yap sonra renormalize et" (slerp'in tembel kuzeni) ile karşılaştır, manifoldu terk eder ve geri projekte edilmesi gerekir, hatayı adım adım biriktirir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Jeodezik Mesafe vs Öklid Mesafe</h2>
<p class="l-text">Yarıçap 1 olan kürede, $p, q$ birim vektörler arasındaki jeodezik mesafe $d(p,q) = \\arccos(p^\\top q) = \\theta$'dır. Öklid (kiriş) mesafesi $\\|p - q\\| = 2 \\sin(\\theta / 2)$'dır. Küçük $\\theta$ için birinci mertebeden uyuşurlar ama noktalar uzaklaştıkça ayrışırlar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

p = np.<span class="fn">array</span>([<span class="num">1.0</span>, <span class="num">0.0</span>, <span class="num">0.0</span>])

<span class="fn">print</span>(f<span class="str">"{'theta (rad)':&gt;12} | {'kiriş':&gt;8} | {'jeodezik':&gt;9} | {'kosinüs':&gt;10}"</span>)
<span class="fn">print</span>(<span class="str">"-"</span> * <span class="num">50</span>)
<span class="kw">for</span> theta <span class="kw">in</span> [<span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">0.5</span>, <span class="num">1.0</span>, np.pi/<span class="num">2</span>, <span class="num">2.0</span>, np.pi - <span class="num">0.01</span>]:
    q = np.<span class="fn">array</span>([np.<span class="fn">cos</span>(theta), np.<span class="fn">sin</span>(theta), <span class="num">0.0</span>])
    chord = np.linalg.<span class="fn">norm</span>(p - q)
    geo   = np.<span class="fn">arccos</span>(np.<span class="fn">clip</span>(p @ q, -<span class="num">1</span>, <span class="num">1</span>))
    cos_s = p @ q
    <span class="fn">print</span>(f<span class="str">"{theta:&gt;12.4f} | {chord:&gt;8.4f} | {geo:&gt;9.4f} | {cos_s:&gt;10.4f}"</span>)

<span class="fn">print</span>(<span class="str">"\\nKüçük theta için ikisi de yakınsar: kiriş ~ jeodezik ~ theta."</span>)
<span class="fn">print</span>(<span class="str">"Antipod noktalar için (theta = pi): kiriş = 2, jeodezik = pi."</span>)
</code></pre></div>

<p class="l-text">NLP'de, kosinüs benzerliği birim-normalize edilmiş gömler için sadece $\\cos(\\theta) = p^\\top q$'dur. "Açısal mesafe" küre üzerinde jeodezik mesafedir. Gömme uzayını bir küre olarak ele almak, onu düz Öklid olarak ele almaktan daha dürüsttür — ve hiperbolik gömlerin (Nickel &amp; Kiela 2017) küreyi bir hiperboloitle değiştirerek daha da genelleştirdiği şey budur.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Riemann Gradient İnişi</h2>
<p class="l-text">Bir manifoldda gradient inişi, iki değişimle Öklid GD'sinin aynı şekline sahiptir: ortam gradient → projekte edilmiş (Riemann) gradient ve toplamsal güncelleme → exp haritası.</p>

<div class="katex-block">$$x_{k+1} = \\exp_{x_k}\\bigl(-\\eta\\, \\mathrm{grad}\\, f(x_k)\\bigr), \\qquad \\mathrm{grad}\\, f(x) = \\Pi_{T_x \\mathcal{M}}\\bigl(\\nabla f(x)\\bigr).$$</div>

<p class="l-text">Riemann gradienti, ortam (Öklid) gradientinin tanjant uzayına projeksiyonudur. Exp haritası seni manifoldda tutar. Algoritmanın tamamı budur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Problem: simetrik A için x^T A x'i maksimize eden R^3'teki birim vektör x'i bul.</span>
<span class="cm"># Eşdeğer min f(x) = -x^T A x  on  S^2.</span>
<span class="cm"># Optimum, A'nın en üstteki özvektörüdür.</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">7</span>)
A = rng.<span class="fn">standard_normal</span>((<span class="num">3</span>,<span class="num">3</span>)); A = (A + A.T) / <span class="num">2</span>
<span class="fn">print</span>(<span class="str">"A =\\n"</span>, A)

eigvals, eigvecs = np.linalg.<span class="fn">eigh</span>(A)
top_eig = eigvecs[:, -<span class="num">1</span>] * np.<span class="fn">sign</span>(eigvecs[<span class="num">0</span>, -<span class="num">1</span>])
<span class="fn">print</span>(f<span class="str">"En üstteki özdeğer (hedef max) = {eigvals[-1]:.4f}"</span>)

<span class="kw">def</span> <span class="fn">f</span>(x):       <span class="kw">return</span> -x @ A @ x
<span class="kw">def</span> <span class="fn">grad_amb</span>(x):<span class="kw">return</span> -<span class="num">2</span> * A @ x

<span class="kw">def</span> <span class="fn">proj_tan</span>(p, u): <span class="kw">return</span> u - (p @ u) * p
<span class="kw">def</span> <span class="fn">exp_sphere</span>(p, v):
    nv = np.linalg.<span class="fn">norm</span>(v)
    <span class="kw">return</span> p <span class="kw">if</span> nv &lt; <span class="num">1e-12</span> <span class="kw">else</span> np.<span class="fn">cos</span>(nv)*p + np.<span class="fn">sin</span>(nv)*v/nv

<span class="cm"># S^2'de bir yerden başla</span>
x = rng.<span class="fn">standard_normal</span>(<span class="num">3</span>); x /= np.linalg.<span class="fn">norm</span>(x)
eta = <span class="num">0.05</span>
<span class="fn">print</span>(f<span class="str">"\\nBaşlangıç: x={x.round(3)}, f={f(x):.4f}, ||x||={np.linalg.norm(x):.6f}"</span>)

<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    g_riem = <span class="fn">proj_tan</span>(x, <span class="fn">grad_amb</span>(x))
    x = <span class="fn">exp_sphere</span>(x, -eta * g_riem)

<span class="fn">print</span>(f<span class="str">"200 adımdan sonra: x={x.round(4)}, f={f(x):.4f}, ||x||={np.linalg.norm(x):.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"En üstteki özvektörle karşılaştır: {top_eig.round(4)}"</span>)
<span class="fn">print</span>(f<span class="str">"|x - top_eig| = {np.linalg.norm(x - x[0]/abs(x[0]) * np.abs(top_eig)):.4f}  (işaret-hizalı)"</span>)
<span class="fn">print</span>(f<span class="str">"\\nGözlem: ||x|| boyunca = 1 makine hassasiyetinde kalır."</span>)
</code></pre></div>

<p class="l-text">200 Riemann GD adımından sonra iterasyon en üstteki özvektöre yakınsamıştır. Kritik olarak, $\\|x\\| = 1$ her iterasyonda — projeksiyon adımı yok, renormalizasyon yok, temizlenecek kısıt ihlali yok. Manifold optimizasyonunun sana satın aldığı şey budur. Karşılaştırma için, aynısını ceza $\\lambda(\\|x\\|^2 - 1)^2$ ile Öklid GD ile yapmak $\\lambda$'yı ayarlamak gerektirir ve adım boyutuyla orantılı bir miktar kürede sapar.</p>

<div id="plot-ml8-rgd-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var cx=[],cy=[];
  for(var i=0;i<=200;i++){var t=i*Math.PI*2/200; cx.push(Math.cos(t)); cy.push(Math.sin(t));}
  var circle={x:cx,y:cy,mode:"lines",name:"S¹ (kısıt manifoldu)",line:{color:"rgba(235,230,220,0.45)",width:2}};
  var rx=[],ry=[]; var ang=2.6;
  for(var k=0;k<14;k++){rx.push(Math.cos(ang)); ry.push(Math.sin(ang)); ang = ang - 0.22;}
  var rgd={x:rx,y:ry,mode:"lines+markers",name:"Riemann GD (S¹'de kalır)",line:{color:"#4ade80",width:2.5},marker:{size:8,color:"#4ade80",symbol:"circle"}};
  var ex=[],ey=[]; var x=Math.cos(2.6), y=Math.sin(2.6);
  for(var k=0;k<14;k++){
    ex.push(x); ey.push(y);
    var gx=-(x-1.0)*0.18, gy=-y*0.18;
    x = x + gx; y = y + gy;
  }
  var egd={x:ex,y:ey,mode:"lines+markers",name:"Öklid GD (sapar, projekte eder)",line:{color:"#f87171",width:2,dash:"dot"},marker:{size:7,color:"#f87171",symbol:"x"}};
  var target={x:[1.0],y:[0.0],mode:"markers+text",text:["hedef (üst özvektör)"],textposition:"middle right",marker:{size:13,color:"#c8a96e",symbol:"star"},textfont:{color:"#c8a96e",size:12},name:"optimum"};
  var layout={title:{text:"Küre üzerinde Riemann GD: kısıt tam olarak korunur",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.10)",range:[-1.4,1.7],showticklabels:false},yaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.10)",range:[-1.3,1.4],showticklabels:false,scaleanchor:"x"},margin:{t:40,r:20,b:20,l:20},showlegend:true,legend:{font:{color:"#ebe6dc"},x:0.02,y:0.05}};
  Plotly.newPlot("plot-ml8-rgd-tr",[circle,egd,rgd,target],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Aynı problem (üst özvektör ≈ (1,0)'ı bul), iki yöntem. Yeşil Riemann GD trajektörisi birim çember üzerinde optimuma kadar gider — her iterasyon ‖x‖=1'i makine hassasiyetinde sağlar. Kırmızı Öklid GD trajektörisi her adımda manifolddan sapar (içerideki küçük noktalar) ve adım başına ayrı bir projeksiyona ihtiyaç duyar. Stiefel, SPD ve ortogonal-ağırlık problemleri için bu fark gece ile gündüz olur.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Stiefel Manifoldu ve Neden Önemli</h2>
<p class="l-text">Stiefel manifoldu $\\text{St}(d,k) = \\{X \\in \\mathbb{R}^{d \\times k} : X^\\top X = I_k\\}$, $\\mathbb{R}^d$'de ortonormal $k$-çerçevelerin kümesidir. Modern ML'de göründüğü üç yer:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PCA / sparse PCA</div><div class="card-body">PCA $\\mathrm{tr}(X^\\top \\Sigma X)$'ı maksimize eden $X \\in \\text{St}(d,k)$'yi bulur. Kapalı-form çözüm en üstteki $k$ özvektördür; seyrek / sağlam varyantlar Stiefel üzerinde Riemann GD gerektirir.</div></div>
<div class="calc-card"><div class="card-title">Ortogonal ağırlık init &amp; düzenlileştirme</div><div class="card-body">Ortogonal RNN ağırlıkları (Arjovsky 2016) ve ortogonal CNN filtreleri (Bansal 2018) aktivasyonların patlamasını / kaybolmasını engeller. Stiefel-projekte güncellemelerle korunur.</div></div>
<div class="calc-card"><div class="card-title">Dikkat ortogonalliği</div><div class="card-body">Bazı yeni çalışmalar başlık fazlalığını azaltmak için çok-başlı projeksiyonlara ortogonallik dayatır (örn. ortogonal LoRA, OFT). Stiefel kısıtları olarak uygulanır.</div></div>
<div class="calc-card"><div class="card-title">Procrustes / hizalama</div><div class="card-body">İki gömme uzayını bir rotasyonla hizalamak $\\min_{R \\in O(d)} \\|XR - Y\\|_F^2$'dir — ortogonal Procrustes problemi, doğal olarak ortogonal manifold $O(d) \\subset \\text{St}(d,d)$ üzerinde.</div></div>
</div>

<p class="l-text">Üretim araç setleri: PyTorch için <code>geoopt</code> ve NumPy / TensorFlow / JAX için <code>pymanopt</code>, küre, Stiefel, Grassmann ve SPD manifoldları üzerinde Riemann SGD, Adam ve eşlenik gradient uygular. İyi test edilmişlerdir ve probleminin doğru yapısı varsa kullanmaya değerdir — yukarıdaki küre örneğinin ötesinde kendi versiyonunu yapma.</p>

<div class="calc-highlight"><strong>Dürüst değerlendirme:</strong> kısıtsız derin ağlar için, manifold optimizasyonu doğru çerçeveleme değildir — aşırı parametreleştirme kayıp manzarasını Adam'ın kazanmasına yetecek kadar bağışlayıcı kılar. Kısıtlı problemler için (ortogonal ağırlıklar, düşük-rank yaklaşım, mesafe metriği öğrenme) ceza yöntemlerinden kesin olarak daha iyidir.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. SPD Manifoldu ve Öklid'in Neden Başarısız Olduğu</h2>
<p class="l-text">Simetrik pozitif-tanımlı matrisler (kovaryanslar, çekirdekler, metrik tensörleri) bir manifoldda yaşar ve Öklid yapısı buna saygı <em>göstermez</em>. İki örnek bunu somutlaştırır.</p>

<p class="l-text"><strong>İki kovaryansın ortalaması.</strong> $\\Sigma_1$ ve $\\Sigma_2$'yi bileşen-bazında saf bir şekilde ortalama almak $(\\Sigma_1 + \\Sigma_2)/2$'yi verir — Öklid ortalaması. Riemann ortalaması (afin-değişmez metrik altında) $\\Sigma_1^{1/2}\\bigl(\\Sigma_1^{-1/2} \\Sigma_2 \\Sigma_1^{-1/2}\\bigr)^{1/2} \\Sigma_1^{1/2}$'dır — geometrik ortalama. Riemann sürümü $\\Sigma \\mapsto P^\\top \\Sigma P$ kongruans dönüşümleri altında değişmezdir, Öklid sürümü değildir. Beyin görüntülemesi (Pennec 2006) ve DTI tensör işlemesi için bu ayrım mantıklı ve saçma ortalamalar arasındaki farktır.</p>

<p class="l-text"><strong>Determinant patlaması.</strong> Çok farklı ölçeklere sahip iki kovaryans arasında Öklid interpolasyonu, determinantı her iki uç noktayı bir kaç mertebe büyüklükte aşan bir kovaryans üretebilir — fiziksel olarak yanlış (iki dar dağılımı karıştırmak ikisinden de daha geniş bir tane veremez). Riemann jeodeziği determinantları doğru şekilde korur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.linalg <span class="kw">import</span> sqrtm

<span class="kw">def</span> <span class="fn">riemann_mean_spd</span>(A, B):
    <span class="str">"""SPD matrislerin afin-değişmez geometrik ortalaması."""</span>
    sA = <span class="fn">sqrtm</span>(A); sAi = np.linalg.<span class="fn">inv</span>(sA)
    M = <span class="fn">sqrtm</span>(sAi @ B @ sAi)
    <span class="kw">return</span> np.<span class="fn">real</span>(sA @ M @ sA)

A = np.<span class="fn">array</span>([[<span class="num">4.0</span>, <span class="num">0.5</span>],
              [<span class="num">0.5</span>, <span class="num">1.0</span>]])
B = np.<span class="fn">array</span>([[<span class="num">1.0</span>, -<span class="num">0.2</span>],
              [-<span class="num">0.2</span>, <span class="num">9.0</span>]])
M_eucl  = (A + B) / <span class="num">2</span>
M_riem  = <span class="fn">riemann_mean_spd</span>(A, B)

<span class="fn">print</span>(<span class="str">"A =\\n"</span>, A)
<span class="fn">print</span>(<span class="str">"B =\\n"</span>, B)
<span class="fn">print</span>(f<span class="str">"\\nÖklid ortalaması det = {np.linalg.det(M_eucl):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Riemann ortalaması det = {np.linalg.det(M_riem):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"\\ndet(A) = {np.linalg.det(A):.3f}, det(B) = {np.linalg.det(B):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"det'lerin geometrik ortalaması = {np.sqrt(np.linalg.det(A)*np.linalg.det(B)):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"\\nRiemann ortalaması det'i, det'lerin geometrik ortalamasıyla sayısal hassasiyette eşleşir."</span>)
</code></pre></div>

<p class="l-text">Riemann (afin-değişmez) ortalamasının determinantı $\\det(A)$ ve $\\det(B)$'nin geometrik ortalamasına eşittir — Öklid ortalamasının sahip olmadığı bir özellik. Kovaryansların nicel olduğu (sinyal gücü, belirsizlik hacmi, Fisher bilgisi) herhangi bir uygulama için, Riemann sürümü doğru olandır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sıradaki</h2>
<p class="l-text">Bir manifold yerel olarak Öklid olan bir kısıt yüzeyidir. Bir noktadaki tanjant uzayı doğrusallaştırmadır; exp haritası bir tanjant vektörü bir jeodezik yürüyerek ulaştığın bir noktaya çevirir; log haritası onu tersine çevirir. Riemann gradient inişi "ortam gradientini tanjant uzayına projekte et, sonra exp"tir — ve her adımda manifoldda tam olarak kalır. Küre $S^{n-1}$, Stiefel manifoldu $\\text{St}(d,k)$, Grassmann ve SPD konisi ML'de gerçekten karşılaştığın dört manifolddur.</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Manifold = kıvrımlı uzay, yerel olarak düz. Haritalar $d$ boyutunda yerel Öklid koordinatları verir.</li>
<li>Tanjant uzayı $T_p\\mathcal{M}$: doğrusal yaklaşım. $S^{n-1}$'de, $p$'ye dik vektörler.</li>
<li>Exp haritası $\\exp_p(v)$: $p$'den $v$ yönünde bir jeodezik yürü. Küre üzerinde: $\\cos\\|v\\|\\,p + \\sin\\|v\\|\\,v/\\|v\\|$.</li>
<li>Log haritası $\\log_p(q)$: ters — $q$'ya işaret eden tanjant vektör.</li>
<li>Riemann GD = gradient projekte et + exp adımı. Kısıt tam olarak korunur, ceza yok.</li>
<li>Ortogonal ağırlıklar / PCA için Stiefel, kovaryanslar için SPD, birim-norm gömler için küre.</li>
<li>Kısıtsız derin ağlar için Öklid Adam hâlâ kazanır; kısıtlı problemler için manifold yöntemleri cezaları kesin olarak yener.</li>
</ul>
</div>

<p class="l-text"><strong>math-L9</strong>'da manifoldun kendisini bir olasılık dağılımları uzayı yapıyoruz, metriği olarak Fisher bilgisiyle. Bu bize <em>bilgi geometrisi</em>ni verir — eğrilik ifadesi olarak Cramer-Rao sınırı, doğal mesafe olarak KL ıraksaklığı ve bu dağılım manifoldu üzerinde Riemann GD olarak doğal gradient $\\theta \\leftarrow \\theta - \\eta\\, I^{-1} \\nabla L$. K-FAC, Shampoo ve büyük-batch ikinci-mertebe yöntemlerinin hepsi bu tek fikrin alt akışında yaşar.</p>
</div>`
};
