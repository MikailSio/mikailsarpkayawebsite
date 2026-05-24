window.LINALG_L1 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/40" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Functions &amp; Notation</a> <span style="opacity:0.55;font-size:0.82em">(Math L40)</span></li>
<li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrices &amp; Operations</a> <span style="opacity:0.55;font-size:0.82em">(Math L72)</span></li>
<li><a href="/tutorials/matematik/73" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Determinants</a> <span style="opacity:0.55;font-size:0.82em">(Math L73)</span></li>
<li><a href="/tutorials/matematik/91" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Geometric Vectors</a> <span style="opacity:0.55;font-size:0.82em">(Math L91)</span></li>
</ul>
</div>
<p class="l-text"><strong>A vector is the simplest object in linear algebra and, in many ways, the most consequential.</strong> Geometrically it is an arrow with a length and a direction; algebraically it is an ordered list of numbers. The miracle of the subject is that these two pictures agree, so anything we prove about one is automatically true of the other. From this single object grows the whole grammar of vector spaces — combinations, spans, independence, bases, dimensions — and once that grammar is in place, every linear question (geometry, mechanics, the solution set of a system of equations) becomes a quiet exercise in bookkeeping.</p>

<p class="l-text">This lesson is unapologetically classical. We begin with arrows in the plane, give them coordinates, define the four operations that make them a vector space, and then climb one floor at a time: scalar product, length, projection, span, independence, basis, dimension. There is no programming here, only pictures and theorems, in the spirit of an honest first course.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the geometric and algebraic definitions of a vector and reconcile them by the parallelogram and tail-to-head rules</li>
<li>Compute vector sums, scalar multiples, dot products and Euclidean norms by hand on small examples</li>
<li>Use the dot product to read the angle between two vectors and to project one onto another</li>
<li>List the eight axioms of a vector space and verify them in <em>R^n</em>, in spaces of polynomials, and in spaces of functions</li>
<li>Decide whether a finite set of vectors is linearly independent, find the dimension of its span, and extract a basis</li>
<li>Solve standard textbook exercises on angles, projections, norms, and independence with complete reasoning</li>
</ul>
</div>

<h2 class="l-title">1. What Is a Vector?</h2>

<div class="calc-highlight"><strong>Two pictures, one object.</strong> A physicist sees a vector as a directed segment in space: an arrow with a tail and a head, defined up to translation. A bookkeeper writes it as a column of numbers. Linear algebra is the long argument that these two pictures are interchangeable.</div>

<p class="l-text"><strong>Geometric definition.</strong> A <em>vector</em> in the plane is an arrow with a definite length and direction. Two arrows are considered the <em>same vector</em> whenever one can be slid (translated, without rotating or stretching) onto the other. The arrow that starts at the origin and ends at a point P is the canonical representative; we call P the <strong>tip</strong> of the vector.</p>

<p class="l-text"><strong>Algebraic definition.</strong> Once a coordinate system is chosen, every arrow with tail at the origin is recorded by the coordinates of its tip. The vector pointing to <em>P = (3, 4)</em> is written</p>

<div class="calc-formula"><div class="formula-label">COLUMN NOTATION</div><div class="formula-main">$$\\mathbf{v} \\;=\\; \\begin{bmatrix} 3 \\\\ 4 \\end{bmatrix}, \\qquad \\text{or in line: } \\mathbf{v} = (3,\\,4).$$</div><div class="formula-sub">The bold letter is the vector; the entries are its <em>components</em>. The number of components is the <em>dimension</em>.</div></div>

<p class="l-text">In <em>n</em> dimensions a vector is an ordered <em>n</em>-tuple of real numbers:</p>

<div class="calc-formula"><div class="formula-label">VECTORS IN R^n</div><div class="formula-main">$$\\mathbf{v} = \\begin{bmatrix} v_1 \\\\ v_2 \\\\ \\vdots \\\\ v_n \\end{bmatrix} \\in \\mathbb{R}^n, \\qquad v_i \\in \\mathbb{R}.$$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Arrow</div><div class="card-body">The geometric object: a directed segment with length and direction.</div></div>
<div class="calc-card"><div class="card-title">Component</div><div class="card-body">One coordinate of the tip in a chosen basis. The <em>i</em>-th entry is called <em>v_i</em>.</div></div>
<div class="calc-card"><div class="card-title">Dimension</div><div class="card-body">The number of independent directions needed to describe the arrow. R^2 = plane, R^3 = space.</div></div>
<div class="calc-card"><div class="card-title">Origin</div><div class="card-body">The distinguished point from which we draw all representative arrows. Its column is the zero vector <em>0</em>.</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-vec2d-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the vector <em>v = (3, 4)</em> drawn as an arrow from the origin to the point P = (3, 4). The dashed segments are the horizontal and vertical components; together they reconstruct the arrow.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var arrow={x:[0,3],y:[0,4],mode:'lines+markers',name:'v = (3, 4)',line:{color:'#3b82f6',width:3},marker:{size:[6,11],color:'#3b82f6'}};
var xc={x:[0,3],y:[0,0],mode:'lines',name:'horizontal component',line:{color:'#4ecdc4',width:2,dash:'dash'}};
var yc={x:[3,3],y:[0,4],mode:'lines',name:'vertical component',line:{color:'#a78bfa',width:2,dash:'dash'}};
var ann=[{x:3,y:4,text:'P = (3, 4)',showarrow:true,arrowhead:2,ax:35,ay:-25,font:{color:'#3b82f6',size:13}},{x:1.5,y:-0.35,text:'3',showarrow:false,font:{color:'#4ecdc4',size:12}},{x:3.35,y:2,text:'4',showarrow:false,font:{color:'#a78bfa',size:12}}];
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1,5],title:'x'},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1,5.5],title:'y',scaleanchor:'x'},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{orientation:'h',y:-0.18,x:0.5,xanchor:'center',font:{color:'#ebe6dc'}},annotations:ann};
Plotly.newPlot('plot-l1-vec2d-en',[arrow,xc,yc],layout,{responsive:true,displayModeBar:false});
},120);</script>

<p class="l-text"><strong>The zero vector.</strong> The vector with every component zero is denoted <em>0</em>. Geometrically it is the degenerate arrow whose head and tail coincide. It is the unique vector of zero length, and as such it has no direction.</p>

<div class="l-note"><strong>Sign convention.</strong> The <em>negative</em> of a vector reverses its arrow. If <em>v = (3, 4)</em> then <em>−v = (−3, −4)</em>; the arrow has the same length but points the opposite way.</div>

<h2 class="l-title">2. Vector Operations</h2>

<p class="l-text">Two operations are fundamental: adding two vectors, and multiplying a vector by a scalar (a real number). Every other piece of linear algebra is built on these two.</p>

<h3 class="l-section">2.1 Addition</h3>

<div class="calc-formula"><div class="formula-label">VECTOR ADDITION (COMPONENTWISE)</div><div class="formula-main">$$\\mathbf{u} + \\mathbf{v} \\;=\\; \\begin{bmatrix} u_1 + v_1 \\\\ u_2 + v_2 \\\\ \\vdots \\\\ u_n + v_n \\end{bmatrix}.$$</div></div>

<p class="l-text"><strong>Tail-to-head rule.</strong> To add <em>u</em> and <em>v</em>, draw <em>u</em>, then place the tail of <em>v</em> at the head of <em>u</em>. The vector from the original tail to the new head is <em>u + v</em>.</p>

<p class="l-text"><strong>Parallelogram rule.</strong> Equivalently, draw both arrows from the same starting point. Complete the parallelogram they span; its diagonal from the common tail is <em>u + v</em>. The two rules give the same answer because translation does not change a vector.</p>

<div class="calc-graph"><div id="plot-l1-add-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the addition <em>u + v</em> with <em>u = (3, 1)</em> and <em>v = (1, 3)</em>. The blue parallelogram is built from the two arrows; its diagonal is the sum <em>u + v = (4, 4)</em>.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var u={x:[0,3],y:[0,1],mode:'lines+markers',name:'u = (3, 1)',line:{color:'#3b82f6',width:3},marker:{size:[6,11],color:'#3b82f6'}};
var v={x:[0,1],y:[0,3],mode:'lines+markers',name:'v = (1, 3)',line:{color:'#a78bfa',width:3},marker:{size:[6,11],color:'#a78bfa'}};
var uv={x:[0,4],y:[0,4],mode:'lines+markers',name:'u + v = (4, 4)',line:{color:'#fbbf24',width:3},marker:{size:[6,11],color:'#fbbf24'}};
var par1={x:[3,4],y:[1,4],mode:'lines',line:{color:'#a78bfa',width:1.5,dash:'dot'},showlegend:false};
var par2={x:[1,4],y:[3,4],mode:'lines',line:{color:'#3b82f6',width:1.5,dash:'dot'},showlegend:false};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.6,5],title:'x'},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.6,5],title:'y',scaleanchor:'x'},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{orientation:'h',y:-0.18,x:0.5,xanchor:'center',font:{color:'#ebe6dc'}}};
Plotly.newPlot('plot-l1-add-en',[u,v,uv,par1,par2],layout,{responsive:true,displayModeBar:false});
},140);</script>

<p class="l-text"><strong>Properties of addition.</strong> For all vectors <em>u, v, w</em>:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Commutative</div><div class="card-body">$\\mathbf{u}+\\mathbf{v}=\\mathbf{v}+\\mathbf{u}$. Both orderings give the same diagonal.</div></div>
<div class="calc-card"><div class="card-title">Associative</div><div class="card-body">$(\\mathbf{u}+\\mathbf{v})+\\mathbf{w} = \\mathbf{u}+(\\mathbf{v}+\\mathbf{w})$. Brackets don't matter.</div></div>
<div class="calc-card"><div class="card-title">Identity</div><div class="card-body">$\\mathbf{u}+\\mathbf{0}=\\mathbf{u}$. Adding the zero arrow changes nothing.</div></div>
<div class="calc-card"><div class="card-title">Inverse</div><div class="card-body">$\\mathbf{u}+(-\\mathbf{u})=\\mathbf{0}$. Every arrow has a partner that cancels it.</div></div>
</div>

<h3 class="l-section">2.2 Scalar Multiplication</h3>

<div class="calc-formula"><div class="formula-label">SCALAR MULTIPLE</div><div class="formula-main">$$c\\,\\mathbf{v} \\;=\\; \\begin{bmatrix} c\\,v_1 \\\\ c\\,v_2 \\\\ \\vdots \\\\ c\\,v_n \\end{bmatrix}, \\qquad c \\in \\mathbb{R}.$$</div></div>

<p class="l-text"><strong>Geometric meaning.</strong> Multiplying by a scalar <em>c</em> stretches (or shrinks) the arrow by the factor |<em>c</em>|. If <em>c</em> is negative, the arrow also flips to the opposite direction. If <em>c = 0</em>, the result is the zero vector.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">c &gt; 1</div><div class="card-body">Lengthens the arrow, same direction.</div></div>
<div class="calc-card"><div class="card-title">0 &lt; c &lt; 1</div><div class="card-body">Shortens the arrow, same direction.</div></div>
<div class="calc-card"><div class="card-title">c = 0</div><div class="card-body">Collapses to the zero vector.</div></div>
<div class="calc-card"><div class="card-title">c &lt; 0</div><div class="card-body">Reverses the direction; |c| controls length.</div></div>
</div>

<p class="l-text"><strong>Properties of scalar multiplication.</strong> For scalars <em>a, b</em> and vectors <em>u, v</em>:</p>

<div class="calc-formula"><div class="formula-label">DISTRIBUTIVITY AND COMPATIBILITY</div><div class="formula-main">$$a(\\mathbf{u}+\\mathbf{v}) = a\\mathbf{u}+a\\mathbf{v}, \\qquad (a+b)\\mathbf{v} = a\\mathbf{v}+b\\mathbf{v}, \\qquad a(b\\mathbf{v}) = (ab)\\mathbf{v}, \\qquad 1\\,\\mathbf{v}=\\mathbf{v}.$$</div></div>

<p class="l-text"><strong>Worked example.</strong> Let <em>u = (2, −1, 3)</em> and <em>v = (0, 4, −2)</em> in <em>R^3</em>. Then</p>

<div class="calc-formula"><div class="formula-main">$$2\\mathbf{u} - 3\\mathbf{v} \\;=\\; 2\\begin{bmatrix} 2 \\\\ -1 \\\\ 3 \\end{bmatrix} - 3\\begin{bmatrix} 0 \\\\ 4 \\\\ -2 \\end{bmatrix} \\;=\\; \\begin{bmatrix} 4 \\\\ -2 \\\\ 6 \\end{bmatrix} - \\begin{bmatrix} 0 \\\\ 12 \\\\ -6 \\end{bmatrix} \\;=\\; \\begin{bmatrix} 4 \\\\ -14 \\\\ 12 \\end{bmatrix}.$$</div></div>

<h2 class="l-title">3. The Dot Product</h2>

<p class="l-text">Vector addition and scalar multiplication build the linear part of the theory. To talk about <em>angles</em>, <em>length</em>, and <em>perpendicularity</em>, we need a second operation: the <strong>dot product</strong> (also called the <em>scalar product</em> or <em>inner product</em>). Unlike addition, the dot product takes two vectors and returns a single number.</p>

<div class="calc-formula"><div class="formula-label">DOT PRODUCT (ALGEBRAIC DEFINITION)</div><div class="formula-main">$$\\mathbf{u} \\cdot \\mathbf{v} \\;=\\; u_1 v_1 + u_2 v_2 + \\cdots + u_n v_n \\;=\\; \\sum_{i=1}^{n} u_i v_i.$$</div></div>

<p class="l-text"><strong>Worked example.</strong> If <em>u = (1, 3, −2)</em> and <em>v = (4, −1, 2)</em>, then <em>u · v = 1·4 + 3·(−1) + (−2)·2 = 4 − 3 − 4 = −3.</em></p>

<p class="l-text"><strong>Algebraic properties.</strong> For all vectors <em>u, v, w</em> and scalar <em>c</em>:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Symmetric</div><div class="card-body">$\\mathbf{u}\\cdot\\mathbf{v}=\\mathbf{v}\\cdot\\mathbf{u}$.</div></div>
<div class="calc-card"><div class="card-title">Bilinear</div><div class="card-body">$(\\mathbf{u}+\\mathbf{w})\\cdot\\mathbf{v}=\\mathbf{u}\\cdot\\mathbf{v}+\\mathbf{w}\\cdot\\mathbf{v}$ and $(c\\mathbf{u})\\cdot\\mathbf{v}=c(\\mathbf{u}\\cdot\\mathbf{v})$.</div></div>
<div class="calc-card"><div class="card-title">Positive</div><div class="card-body">$\\mathbf{u}\\cdot\\mathbf{u}\\ge 0$, with equality only when $\\mathbf{u}=\\mathbf{0}$.</div></div>
<div class="calc-card"><div class="card-title">Self-product</div><div class="card-body">$\\mathbf{u}\\cdot\\mathbf{u}=u_1^2+\\cdots+u_n^2=\\|\\mathbf{u}\\|^2$.</div></div>
</div>

<h3 class="l-section">3.1 The Geometric Meaning</h3>

<p class="l-text">The remarkable fact is that the algebraic sum <em>u·v</em> also has a clean geometric interpretation:</p>

<div class="calc-formula"><div class="formula-label">DOT PRODUCT (GEOMETRIC FORM)</div><div class="formula-main">$$\\mathbf{u}\\cdot\\mathbf{v} \\;=\\; \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|\\cos\\theta,$$</div><div class="formula-sub">where <em>θ</em> is the angle between the two arrows, measured in [0, π].</div></div>

<p class="l-text">The proof is a one-line application of the law of cosines to the triangle with sides <em>u</em>, <em>v</em>, and <em>u − v</em>: expand <em>‖u − v‖² = (u − v)·(u − v)</em> using bilinearity, then equate with <em>‖u‖² + ‖v‖² − 2‖u‖‖v‖cos θ</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">u·v &gt; 0</div><div class="card-body">Angle is acute. The arrows point in broadly the same direction.</div></div>
<div class="calc-card"><div class="card-title">u·v = 0</div><div class="card-body">The arrows are <em>perpendicular</em> (orthogonal). This is the most important case.</div></div>
<div class="calc-card"><div class="card-title">u·v &lt; 0</div><div class="card-body">Angle is obtuse. The arrows broadly disagree in direction.</div></div>
<div class="calc-card"><div class="card-title">|u·v| = ‖u‖‖v‖</div><div class="card-body">The arrows are parallel (θ = 0 or π). One is a scalar multiple of the other.</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-dot-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three vector pairs illustrating positive, zero, and negative dot product. Acute angle (left) ↔ <em>u·v &gt; 0</em>; right angle (middle) ↔ <em>u·v = 0</em>; obtuse angle (right) ↔ <em>u·v &lt; 0</em>.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a1={x:[0,2],y:[0,0.4],mode:'lines',line:{color:'#3b82f6',width:3},name:'acute, u·v > 0',showlegend:true};
var a2={x:[0,1.5],y:[0,1.5],mode:'lines',line:{color:'#3b82f6',width:3},showlegend:false};
var b1={x:[4,6],y:[0,0],mode:'lines',line:{color:'#10b981',width:3},name:'right angle, u·v = 0',showlegend:true};
var b2={x:[4,4],y:[0,2],mode:'lines',line:{color:'#10b981',width:3},showlegend:false};
var c1={x:[8,10],y:[0,0],mode:'lines',line:{color:'#ef4444',width:3},name:'obtuse, u·v < 0',showlegend:true};
var c2={x:[8,7.2],y:[0,1.6],mode:'lines',line:{color:'#ef4444',width:3},showlegend:false};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.5,11],title:''},yaxis:{gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.5,2.5],title:'',scaleanchor:'x'},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{orientation:'h',y:-0.2,x:0.5,xanchor:'center',font:{color:'#ebe6dc'}}};
Plotly.newPlot('plot-l1-dot-en',[a1,a2,b1,b2,c1,c2],layout,{responsive:true,displayModeBar:false});
},160);</script>

<h3 class="l-section">3.2 The Cauchy–Schwarz Inequality</h3>

<p class="l-text">Because <em>|cos θ| ≤ 1</em>, the geometric form immediately gives one of the most-used inequalities in mathematics:</p>

<div class="calc-formula"><div class="formula-label">CAUCHY–SCHWARZ</div><div class="formula-main">$$|\\mathbf{u}\\cdot\\mathbf{v}| \\;\\le\\; \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|,$$</div><div class="formula-sub">with equality if and only if <em>u</em> and <em>v</em> are linearly dependent (one is a scalar multiple of the other).</div></div>

<h3 class="l-section">3.3 Projection</h3>

<p class="l-text">If we want to decompose <em>u</em> into a piece parallel to <em>v</em> and a piece perpendicular to <em>v</em>, the parallel piece is the <strong>orthogonal projection</strong> of <em>u</em> onto <em>v</em>:</p>

<div class="calc-formula"><div class="formula-label">ORTHOGONAL PROJECTION</div><div class="formula-main">$$\\mathrm{proj}_{\\mathbf{v}}\\,\\mathbf{u} \\;=\\; \\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\mathbf{v}\\cdot\\mathbf{v}}\\,\\mathbf{v} \\;=\\; \\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\|\\mathbf{v}\\|^2}\\,\\mathbf{v}.$$</div></div>

<p class="l-text">A direct check shows that the residual <em>u − proj<sub>v</sub> u</em> is orthogonal to <em>v</em>: simply compute the dot product and notice that the bilinear terms cancel.</p>

<div class="l-note"><strong>Scalar projection.</strong> The signed length of the projection — sometimes called the <em>component</em> of <em>u</em> along <em>v</em> — is <em>(u·v) / ‖v‖</em>. It is positive when the projection points the same way as <em>v</em>, negative otherwise.</div>

<h2 class="l-title">4. The Norm of a Vector</h2>

<p class="l-text">The dot product of a vector with itself gives the square of its length:</p>

<div class="calc-formula"><div class="formula-label">EUCLIDEAN NORM</div><div class="formula-main">$$\\|\\mathbf{v}\\| \\;=\\; \\sqrt{\\mathbf{v}\\cdot\\mathbf{v}} \\;=\\; \\sqrt{v_1^2 + v_2^2 + \\cdots + v_n^2}.$$</div></div>

<p class="l-text">In <em>R^2</em> this is the Pythagorean theorem applied to the right triangle whose legs are the components. In <em>R^3</em> it follows from applying Pythagoras twice.</p>

<p class="l-text"><strong>Worked example.</strong> For <em>v = (3, 4)</em>, we get <em>‖v‖ = √(9 + 16) = √25 = 5</em>. For <em>v = (1, 2, 2)</em>, <em>‖v‖ = √(1 + 4 + 4) = 3</em>.</p>

<p class="l-text"><strong>Properties of the Euclidean norm.</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Non-negative</div><div class="card-body">$\\|\\mathbf{v}\\| \\ge 0$, with equality only for the zero vector.</div></div>
<div class="calc-card"><div class="card-title">Homogeneous</div><div class="card-body">$\\|c\\mathbf{v}\\| = |c|\\,\\|\\mathbf{v}\\|$. Scaling stretches length by |c|.</div></div>
<div class="calc-card"><div class="card-title">Triangle inequality</div><div class="card-body">$\\|\\mathbf{u}+\\mathbf{v}\\| \\le \\|\\mathbf{u}\\| + \\|\\mathbf{v}\\|$, a direct corollary of Cauchy–Schwarz.</div></div>
<div class="calc-card"><div class="card-title">Unit vectors</div><div class="card-body">If <em>v ≠ 0</em>, the vector <em>v / ‖v‖</em> has length 1 and the same direction as <em>v</em>.</div></div>
</div>

<h3 class="l-section">4.1 Other Norms (Optional)</h3>

<p class="l-text">The Euclidean norm is the geometric default, but other notions of length appear in classical analysis. For <em>1 ≤ p &lt; ∞</em> the <em>p-norm</em> is</p>

<div class="calc-formula"><div class="formula-label">p-NORM</div><div class="formula-main">$$\\|\\mathbf{v}\\|_p \\;=\\; \\Big( |v_1|^p + |v_2|^p + \\cdots + |v_n|^p \\Big)^{1/p},$$</div><div class="formula-sub">with the limiting case $\\|\\mathbf{v}\\|_\\infty = \\max_i |v_i|$ as <em>p → ∞</em>.</div></div>

<p class="l-text">When <em>p = 2</em> this is the Euclidean norm. When <em>p = 1</em> it is the <em>taxicab</em> or Manhattan norm; in <em>R^2</em> the unit ball is a square rotated 45°. When <em>p = ∞</em> the unit ball is an axis-aligned square. All these norms induce the same notion of convergence in <em>R^n</em>, but their unit balls have different shapes.</p>

<h2 class="l-title">5. Vector Spaces</h2>

<p class="l-text">Up to now we have worked exclusively in <em>R^n</em>. The deeper structural insight is that everything we have done — addition, scalar multiplication, and their axioms — can be detached from <em>R^n</em> and used as a definition. Anything obeying the same axioms is called a <strong>vector space</strong>.</p>

<div class="calc-formula"><div class="formula-label">DEFINITION: VECTOR SPACE OVER R</div><div class="formula-main">$$V \\text{ is a vector space if } (V, +, \\cdot) \\text{ satisfies the eight axioms below.}$$</div></div>

<p class="l-text">A non-empty set <em>V</em>, together with an operation <em>+ : V × V → V</em> (addition) and an operation <em>· : R × V → V</em> (scalar multiplication), is a <em>real vector space</em> if for all <em>u, v, w ∈ V</em> and all <em>a, b ∈ R</em>:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">(A1) Commutativity</div><div class="card-body">$\\mathbf{u}+\\mathbf{v} = \\mathbf{v}+\\mathbf{u}$.</div></div>
<div class="calc-card"><div class="card-title">(A2) Associativity</div><div class="card-body">$(\\mathbf{u}+\\mathbf{v})+\\mathbf{w} = \\mathbf{u}+(\\mathbf{v}+\\mathbf{w})$.</div></div>
<div class="calc-card"><div class="card-title">(A3) Zero element</div><div class="card-body">There exists <em>0 ∈ V</em> with <em>v + 0 = v</em> for all <em>v</em>.</div></div>
<div class="calc-card"><div class="card-title">(A4) Additive inverse</div><div class="card-body">For each <em>v</em> there is <em>−v</em> with <em>v + (−v) = 0</em>.</div></div>
<div class="calc-card"><div class="card-title">(M1) Distribute over +V</div><div class="card-body">$a(\\mathbf{u}+\\mathbf{v}) = a\\mathbf{u}+a\\mathbf{v}$.</div></div>
<div class="calc-card"><div class="card-title">(M2) Distribute over +R</div><div class="card-body">$(a+b)\\mathbf{v} = a\\mathbf{v}+b\\mathbf{v}$.</div></div>
<div class="calc-card"><div class="card-title">(M3) Associativity (scalar)</div><div class="card-body">$a(b\\mathbf{v}) = (ab)\\mathbf{v}$.</div></div>
<div class="calc-card"><div class="card-title">(M4) Identity scalar</div><div class="card-body">$1\\cdot\\mathbf{v} = \\mathbf{v}$.</div></div>
</div>

<h3 class="l-section">5.1 Examples</h3>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">R^n</div><div class="card-body">The standard example: column vectors with componentwise addition and scalar multiplication. The eight axioms hold because they hold in <em>R</em>.</div></div>
<div class="calc-card"><div class="card-title">P_n</div><div class="card-body">Real polynomials of degree at most <em>n</em>, with the usual sum and scalar product. A polynomial <em>p(x) = a_0 + a_1 x + ⋯ + a_n x^n</em> is recorded by its <em>(n+1)</em> coefficients.</div></div>
<div class="calc-card"><div class="card-title">C[a, b]</div><div class="card-body">Continuous real-valued functions on the interval <em>[a, b]</em>, with pointwise sum <em>(f+g)(x)=f(x)+g(x)</em> and pointwise scalar product <em>(cf)(x)=c·f(x)</em>.</div></div>
<div class="calc-card"><div class="card-title">M_{m,n}</div><div class="card-body">All <em>m×n</em> real matrices. Addition and scalar multiplication act entry by entry. Looks geometric in low dimensions but is purely abstract.</div></div>
</div>

<p class="l-text"><strong>Non-example.</strong> The set <em>{(x, y) ∈ R^2 : x ≥ 0}</em> — vectors with non-negative first coordinate — is not a vector space: the vector <em>(1, 0)</em> belongs to it, but its negative <em>(−1, 0)</em> does not. Axiom (A4) fails.</p>

<h3 class="l-section">5.2 Subspaces</h3>

<p class="l-text">A <strong>subspace</strong> <em>W ⊆ V</em> is a subset that is itself a vector space under the inherited operations. The shortcut for checking subspace-ness:</p>

<div class="calc-formula"><div class="formula-label">SUBSPACE TEST</div><div class="formula-main">$$W \\subseteq V \\text{ is a subspace iff } \\mathbf{0}\\in W \\text{ and } \\forall \\mathbf{u},\\mathbf{v}\\in W,\\;\\forall c\\in\\mathbb{R}:\\; c\\mathbf{u}+\\mathbf{v}\\in W.$$</div></div>

<p class="l-text">In <em>R^3</em> the proper subspaces are exactly: the single point <em>{0}</em>; every line through the origin; every plane through the origin; and the whole space <em>R^3</em>.</p>

<h2 class="l-title">6. Linear Combinations and Span</h2>

<p class="l-text">Given vectors <em>v<sub>1</sub>, …, v<sub>k</sub> ∈ V</em>, a <strong>linear combination</strong> is any vector of the form</p>

<div class="calc-formula"><div class="formula-label">LINEAR COMBINATION</div><div class="formula-main">$$c_1 \\mathbf{v}_1 + c_2 \\mathbf{v}_2 + \\cdots + c_k \\mathbf{v}_k, \\qquad c_i \\in \\mathbb{R}.$$</div></div>

<p class="l-text">The set of <em>all</em> linear combinations is called the <strong>span</strong> of <em>{v<sub>1</sub>, …, v<sub>k</sub>}</em>:</p>

<div class="calc-formula"><div class="formula-label">SPAN</div><div class="formula-main">$$\\mathrm{span}\\{\\mathbf{v}_1,\\dots,\\mathbf{v}_k\\} \\;=\\; \\Big\\{ c_1 \\mathbf{v}_1 + \\cdots + c_k \\mathbf{v}_k : c_i \\in \\mathbb{R} \\Big\\}.$$</div></div>

<p class="l-text"><strong>Geometric pictures in R^3:</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">One non-zero vector</div><div class="card-body">Span is a <em>line</em> through the origin in the direction of <em>v</em>.</div></div>
<div class="calc-card"><div class="card-title">Two non-parallel vectors</div><div class="card-body">Span is the <em>plane</em> through the origin containing both arrows.</div></div>
<div class="calc-card"><div class="card-title">Three independent vectors</div><div class="card-body">Span is all of <em>R^3</em>.</div></div>
<div class="calc-card"><div class="card-title">Any redundant set</div><div class="card-body">Throwing away a vector that is already a combination of the others does not shrink the span.</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-span-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the plane <em>span{(1, 0, 0), (0, 1, 0)}</em> in <em>R^3</em> — the xy-plane (orange grid). The two spanning vectors are drawn in blue and purple; every point on the plane is a linear combination of them.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[],zs=[];
for(var i=-3;i<=3;i+=0.6){var rowx=[],rowy=[],rowz=[];for(var j=-3;j<=3;j+=0.6){rowx.push(i);rowy.push(j);rowz.push(0);}xs.push(rowx);ys.push(rowy);zs.push(rowz);}
var plane={x:xs,y:ys,z:zs,type:'surface',showscale:false,colorscale:[[0,'rgba(251,191,36,0.35)'],[1,'rgba(251,191,36,0.55)']],opacity:0.55,name:'xy-plane'};
var e1={type:'scatter3d',mode:'lines',x:[0,1],y:[0,0],z:[0,0],line:{color:'#3b82f6',width:8},name:'v1 = (1,0,0)'};
var e2={type:'scatter3d',mode:'lines',x:[0,0],y:[0,1],z:[0,0],line:{color:'#a78bfa',width:8},name:'v2 = (0,1,0)'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},margin:{t:30,r:0,b:0,l:0},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'rgba(0,0,0,0)'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'rgba(0,0,0,0)'},zaxis:{title:'z',range:[-2,2],gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'rgba(0,0,0,0)'}},showlegend:true,legend:{orientation:'h',y:-0.05,x:0.5,xanchor:'center',font:{color:'#ebe6dc'}}};
Plotly.newPlot('plot-l1-span-en',[plane,e1,e2],layout,{responsive:true,displayModeBar:false});
},180);</script>

<p class="l-text"><strong>Theorem.</strong> <em>The span of any finite set in V is a subspace of V.</em> The proof is a one-line check of the subspace test: the zero vector is the trivial combination, and any linear combination of two combinations is itself a combination.</p>

<h2 class="l-title">7. Linear Independence</h2>

<p class="l-text">Some sets of vectors carry redundancy: one vector can be written as a combination of the others. We want to detect this.</p>

<div class="calc-formula"><div class="formula-label">DEFINITION: LINEAR INDEPENDENCE</div><div class="formula-main">$$\\{\\mathbf{v}_1,\\dots,\\mathbf{v}_k\\} \\text{ is linearly independent} \\;\\iff\\; \\Big( c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k = \\mathbf{0} \\;\\Longrightarrow\\; c_1=\\cdots=c_k=0 \\Big).$$</div><div class="formula-sub">Only the trivial combination produces the zero vector.</div></div>

<p class="l-text">If a non-trivial combination produces zero, the set is <strong>linearly dependent</strong>; in that case at least one vector is expressible as a combination of the rest, so it brings no new direction.</p>

<h3 class="l-section">7.1 How to Test in R^n</h3>

<p class="l-text">Form the matrix <em>A</em> whose columns are the vectors <em>v<sub>1</sub>, …, v<sub>k</sub></em>. The vectors are linearly independent if and only if the only solution of <em>Ac = 0</em> is <em>c = 0</em>. Row-reduce <em>A</em>: if every column has a pivot, the set is independent; if any column lacks a pivot, that column is dependent on the earlier ones.</p>

<p class="l-text"><strong>Worked example.</strong> In <em>R^3</em>, are the three vectors</p>

<div class="calc-formula"><div class="formula-main">$$\\mathbf{v}_1 = \\begin{bmatrix} 1\\\\ 0\\\\ 1 \\end{bmatrix},\\quad \\mathbf{v}_2 = \\begin{bmatrix} 2\\\\ 1\\\\ 0 \\end{bmatrix},\\quad \\mathbf{v}_3 = \\begin{bmatrix} 0\\\\ 1\\\\ -2 \\end{bmatrix}$$</div></div>

<p class="l-text">linearly independent? Set <em>c<sub>1</sub>v<sub>1</sub> + c<sub>2</sub>v<sub>2</sub> + c<sub>3</sub>v<sub>3</sub> = 0</em>:</p>

<div class="calc-formula"><div class="formula-main">$$\\begin{cases} c_1 + 2c_2 \\;= 0 \\\\ c_2 + c_3 = 0 \\\\ c_1 - 2c_3 = 0 \\end{cases}$$</div></div>

<p class="l-text">From the second equation <em>c<sub>3</sub> = −c<sub>2</sub></em>; substituting into the third, <em>c<sub>1</sub> = −2c<sub>2</sub></em>; substituting into the first, <em>−2c<sub>2</sub> + 2c<sub>2</sub> = 0</em>, which is automatic. So <em>c<sub>2</sub></em> is a free parameter: take <em>c<sub>2</sub> = 1, c<sub>1</sub> = −2, c<sub>3</sub> = −1</em> and check that <em>−2v<sub>1</sub> + v<sub>2</sub> − v<sub>3</sub> = 0</em>. The set is <strong>linearly dependent</strong>.</p>

<div class="l-note"><strong>Shortcut in R^n.</strong> Any set of more than <em>n</em> vectors in <em>R^n</em> is automatically dependent. Two vectors are independent iff neither is a scalar multiple of the other. Three vectors in <em>R^3</em> are independent iff their determinant (as columns of a 3×3 matrix) is non-zero.</div>

<h2 class="l-title">8. Basis and Dimension</h2>

<div class="calc-formula"><div class="formula-label">DEFINITION: BASIS</div><div class="formula-main">$$\\mathcal{B} = \\{\\mathbf{b}_1,\\dots,\\mathbf{b}_n\\} \\text{ is a basis of } V \\;\\iff\\; \\mathcal{B} \\text{ is linearly independent and spans } V.$$</div></div>

<p class="l-text">A basis is a <em>minimal spanning set</em> (or, equivalently, a <em>maximal independent set</em>). Every vector in <em>V</em> can be written as a linear combination of basis vectors in <em>exactly one way</em>; the coefficients are called the <strong>coordinates</strong> of the vector in this basis.</p>

<h3 class="l-section">8.1 The Standard Basis</h3>

<p class="l-text">In <em>R^n</em> the <strong>standard basis</strong> is</p>

<div class="calc-formula"><div class="formula-main">$$\\mathbf{e}_1 = \\begin{bmatrix} 1\\\\ 0\\\\ \\vdots\\\\ 0 \\end{bmatrix},\\quad \\mathbf{e}_2 = \\begin{bmatrix} 0\\\\ 1\\\\ \\vdots\\\\ 0 \\end{bmatrix},\\;\\dots,\\; \\mathbf{e}_n = \\begin{bmatrix} 0\\\\ 0\\\\ \\vdots\\\\ 1 \\end{bmatrix}.$$</div></div>

<p class="l-text">Any <em>v = (v<sub>1</sub>, …, v<sub>n</sub>)</em> has the unique expansion <em>v = v<sub>1</sub>e<sub>1</sub> + ⋯ + v<sub>n</sub>e<sub>n</sub></em>. Other bases exist too: in <em>R^2</em>, the pair <em>{(1, 1), (1, −1)}</em> is also a basis (the columns are independent and span the plane).</p>

<h3 class="l-section">8.2 Dimension</h3>

<div class="calc-formula"><div class="formula-label">THEOREM</div><div class="formula-main">$$\\text{Every basis of a vector space } V \\text{ has the same number of elements.}$$</div><div class="formula-sub">That number is called the <em>dimension</em> of <em>V</em>, written <em>dim V</em>.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">dim R^n</div><div class="card-body">= n. The standard basis has <em>n</em> vectors.</div></div>
<div class="calc-card"><div class="card-title">dim P_n</div><div class="card-body">= n+1. Basis: <em>{1, x, x², …, x^n}</em>.</div></div>
<div class="calc-card"><div class="card-title">dim M_{m,n}</div><div class="card-body">= mn. Basis: matrices with a 1 in one entry and 0 elsewhere.</div></div>
<div class="calc-card"><div class="card-title">dim C[a, b]</div><div class="card-body">= ∞. The continuous functions form an infinite-dimensional space.</div></div>
</div>

<h2 class="l-title">9. Classical Exercises</h2>

<p class="l-text">Here are six standard problems. Read the statement, attempt the calculation, and only then read the solution.</p>

<h3 class="l-section">Exercise 1 — Sum, dot product, and norm</h3>

<p class="l-text"><strong>Statement.</strong> Let <em>u = (2, −1, 3)</em> and <em>v = (1, 4, −2)</em> in <em>R^3</em>. Compute <em>u + v</em>, <em>u·v</em>, and <em>‖u‖</em>.</p>

<div class="calc-formula"><div class="formula-label">SOLUTION</div><div class="formula-main">$$\\mathbf{u}+\\mathbf{v} = (3,\\,3,\\,1), \\qquad \\mathbf{u}\\cdot\\mathbf{v} = 2 - 4 - 6 = -8, \\qquad \\|\\mathbf{u}\\| = \\sqrt{4+1+9} = \\sqrt{14}.$$</div></div>

<h3 class="l-section">Exercise 2 — Unit vector in the direction of v</h3>

<p class="l-text"><strong>Statement.</strong> Find the unit vector parallel to <em>v = (1, 2, 2)</em>.</p>

<p class="l-text"><strong>Solution.</strong> Compute <em>‖v‖ = √(1 + 4 + 4) = 3</em>. The unit vector is</p>

<div class="calc-formula"><div class="formula-main">$$\\hat{\\mathbf{v}} \\;=\\; \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|} \\;=\\; \\Big(\\tfrac{1}{3},\\,\\tfrac{2}{3},\\,\\tfrac{2}{3}\\Big).$$</div></div>

<p class="l-text">Verify: <em>‖v̂‖² = 1/9 + 4/9 + 4/9 = 1</em>.</p>

<h3 class="l-section">Exercise 3 — Angle between two vectors</h3>

<p class="l-text"><strong>Statement.</strong> Find the angle between <em>u = (1, 1, 0)</em> and <em>v = (0, 1, 1)</em>.</p>

<p class="l-text"><strong>Solution.</strong> <em>u·v = 0 + 1 + 0 = 1</em>, <em>‖u‖ = √2</em>, <em>‖v‖ = √2</em>. So</p>

<div class="calc-formula"><div class="formula-main">$$\\cos\\theta \\;=\\; \\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|} \\;=\\; \\frac{1}{2}, \\qquad \\theta \\;=\\; \\tfrac{\\pi}{3} \\;=\\; 60^\\circ.$$</div></div>

<h3 class="l-section">Exercise 4 — Linear independence of three vectors</h3>

<p class="l-text"><strong>Statement.</strong> Determine whether <em>{(1, 2, 3), (4, 5, 6), (7, 8, 9)}</em> is linearly independent in <em>R^3</em>.</p>

<p class="l-text"><strong>Solution.</strong> Set up <em>c<sub>1</sub>(1,2,3) + c<sub>2</sub>(4,5,6) + c<sub>3</sub>(7,8,9) = (0,0,0)</em>:</p>

<div class="calc-formula"><div class="formula-main">$$\\begin{cases} c_1 + 4c_2 + 7c_3 = 0 \\\\ 2c_1 + 5c_2 + 8c_3 = 0 \\\\ 3c_1 + 6c_2 + 9c_3 = 0 \\end{cases}$$</div></div>

<p class="l-text">Row reduce. Subtract <em>2×</em>(row 1) from row 2 and <em>3×</em>(row 1) from row 3:</p>

<div class="calc-formula"><div class="formula-main">$$\\begin{cases} c_1 + 4c_2 + 7c_3 = 0 \\\\ -3c_2 - 6c_3 = 0 \\\\ -6c_2 - 12c_3 = 0 \\end{cases}$$</div></div>

<p class="l-text">The third equation is twice the second, so it is redundant; <em>c<sub>2</sub> = −2c<sub>3</sub></em> and <em>c<sub>1</sub> = −4(−2c<sub>3</sub>) − 7c<sub>3</sub> = c<sub>3</sub></em>. Taking <em>c<sub>3</sub> = 1</em> gives the non-trivial relation <em>v<sub>1</sub> − 2v<sub>2</sub> + v<sub>3</sub> = 0</em>. The set is <strong>linearly dependent</strong>. Equivalently, the determinant of the matrix with these columns is zero.</p>

<h3 class="l-section">Exercise 5 — Projection of u onto v</h3>

<p class="l-text"><strong>Statement.</strong> Project <em>u = (3, 4)</em> onto <em>v = (1, 0)</em> and verify that the residual is orthogonal to <em>v</em>.</p>

<p class="l-text"><strong>Solution.</strong> <em>u·v = 3</em>, <em>v·v = 1</em>, so</p>

<div class="calc-formula"><div class="formula-main">$$\\mathrm{proj}_{\\mathbf{v}}\\,\\mathbf{u} \\;=\\; \\frac{3}{1}(1,\\,0) \\;=\\; (3,\\,0).$$</div></div>

<p class="l-text">The residual is <em>u − proj<sub>v</sub> u = (3, 4) − (3, 0) = (0, 4)</em>, whose dot product with <em>v</em> is <em>0·1 + 4·0 = 0</em>. The residual is orthogonal to <em>v</em>, as expected.</p>

<h3 class="l-section">Exercise 6 — Verifying the parallelogram identity</h3>

<p class="l-text"><strong>Statement.</strong> Show that for any <em>u, v ∈ R^n</em>, <em>‖u + v‖² + ‖u − v‖² = 2‖u‖² + 2‖v‖²</em>.</p>

<p class="l-text"><strong>Solution.</strong> Expand each side using <em>‖w‖² = w·w</em> and the bilinearity of the dot product:</p>

<div class="calc-formula"><div class="formula-main">$$\\|\\mathbf{u}+\\mathbf{v}\\|^2 = \\mathbf{u}\\cdot\\mathbf{u} + 2\\,\\mathbf{u}\\cdot\\mathbf{v} + \\mathbf{v}\\cdot\\mathbf{v},$$</div></div>

<div class="calc-formula"><div class="formula-main">$$\\|\\mathbf{u}-\\mathbf{v}\\|^2 = \\mathbf{u}\\cdot\\mathbf{u} - 2\\,\\mathbf{u}\\cdot\\mathbf{v} + \\mathbf{v}\\cdot\\mathbf{v}.$$</div></div>

<p class="l-text">Adding the two, the cross terms cancel and we get <em>2‖u‖² + 2‖v‖²</em>. Geometrically: in any parallelogram, the sum of the squared diagonals equals twice the sum of the squared sides.</p>

<div class="l-note"><strong>What's next.</strong> Lesson 2 turns from vectors to <em>matrices</em>: the rectangular arrays that act on vectors as linear maps. With matrices in hand we can rotate, reflect, project, and solve systems of linear equations algorithmically.</div>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/40" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Fonksiyon Tanımı</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L40)</span></li>
<li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matris &amp; İşlemler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L72)</span></li>
<li><a href="/tutorials/matematik/73" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Determinantlar</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L73)</span></li>
<li><a href="/tutorials/matematik/91" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Vektörler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L91)</span></li>
</ul>
</div>
<p class="l-text"><strong>Vektör, doğrusal cebrin en yalın nesnesi ve bir anlamda en belirleyicisidir.</strong> Geometrik olarak uzunluğu ve yönü olan bir oktur; cebirsel olarak ise sıralı bir sayı listesi. Konunun mucizesi, bu iki resmin birbirine tıpatıp uymasıdır; biri için ispatlanan her şey, otomatik olarak ötekisi için de geçerli olur. Bu tek nesneden vektör uzaylarının tüm dilbilgisi doğar — bileşimler, gerenler, bağımsızlık, bazlar, boyutlar — ve bu dilbilgisi yerine oturduğunda her doğrusal soru (geometri, mekanik, lineer denklem sistemlerinin çözüm kümesi) sessiz bir defter tutma alıştırmasına dönüşür.</p>

<p class="l-text">Bu ders açıkça klasiktir. Düzlemde oklarla başlıyor, onlara koordinat veriyor, vektör uzayı yapısı kuran dört işlemi tanımlıyor, sonra teker teker yükseliyoruz: iç çarpım, uzunluk, izdüşüm, geren, bağımsızlık, baz, boyut. Programlama yok; yalnızca dürüst bir giriş dersinin ruhunda resimler ve teoremler.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Vektörün geometrik ve cebirsel tanımlarını ifade etmek; paralelkenar ve kuyruktan-başa kuralı ile bunları uzlaştırmak</li>
<li>Küçük örnekler üzerinde vektör toplamı, skalar çarpımı, iç çarpım ve Öklid normunu elle hesaplamak</li>
<li>İki vektör arasındaki açıyı iç çarpımdan okumak ve birinin diğeri üzerine izdüşümünü almak</li>
<li>Vektör uzayının sekiz aksiyomunu listelemek; <em>R^n</em>'de, polinom uzaylarında ve fonksiyon uzaylarında bunları doğrulamak</li>
<li>Sonlu bir vektör kümesinin doğrusal bağımsız olup olmadığına karar vermek, gereninin boyutunu bulmak, bir baz çıkarmak</li>
<li>Açı, izdüşüm, norm ve bağımsızlık üzerine klasik ders kitabı sorularını tam gerekçeyle çözmek</li>
</ul>
</div>

<h2 class="l-title">1. Vektör Nedir?</h2>

<div class="calc-highlight"><strong>İki resim, tek nesne.</strong> Fizikçi vektörü uzayda yönlü bir doğru parçası olarak görür: ucu ve kuyruğu olan, ötelemeye göre eşdeğer alınmış bir ok. Defter tutan ise onu bir sayı sütunu olarak yazar. Doğrusal cebir, bu iki resmin birbirinin yerine geçtiğinin uzun ispatıdır.</div>

<p class="l-text"><strong>Geometrik tanım.</strong> Düzlemde bir <em>vektör</em>, belirli uzunluğa ve yöne sahip bir oktur. İki ok, biri ötekine kaydırılarak (döndürmeden, germeden) örtüştürülebiliyorsa <em>aynı vektör</em> sayılır. Kuyruğu orijinde, ucu <em>P</em> noktasında olan ok kanonik temsilcidir; <em>P</em>'ye vektörün <strong>ucu</strong> denir.</p>

<p class="l-text"><strong>Cebirsel tanım.</strong> Bir koordinat sistemi seçildiğinde, kuyruğu orijinde olan her ok, ucunun koordinatlarıyla kaydedilir. <em>P = (3, 4)</em> ucuna işaret eden vektör şöyle yazılır:</p>

<div class="calc-formula"><div class="formula-label">SÜTUN GÖSTERİMİ</div><div class="formula-main">$$\\mathbf{v} \\;=\\; \\begin{bmatrix} 3 \\\\ 4 \\end{bmatrix}, \\qquad \\text{veya satır biçimi: } \\mathbf{v} = (3,\\,4).$$</div><div class="formula-sub">Kalın harf vektörün kendisi; girdiler onun <em>bileşenleridir</em>. Bileşen sayısı <em>boyuttur</em>.</div></div>

<p class="l-text"><em>n</em> boyutta vektör, gerçel sayılardan oluşan sıralı bir <em>n</em>-tipliktir:</p>

<div class="calc-formula"><div class="formula-label">R^n'DE VEKTÖRLER</div><div class="formula-main">$$\\mathbf{v} = \\begin{bmatrix} v_1 \\\\ v_2 \\\\ \\vdots \\\\ v_n \\end{bmatrix} \\in \\mathbb{R}^n, \\qquad v_i \\in \\mathbb{R}.$$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ok</div><div class="card-body">Geometrik nesne: uzunluğu ve yönü olan yönlü bir doğru parçası.</div></div>
<div class="calc-card"><div class="card-title">Bileşen</div><div class="card-body">Seçilen bazda ucun bir koordinatı. <em>i</em>-inci girdiye <em>v_i</em> denir.</div></div>
<div class="calc-card"><div class="card-title">Boyut</div><div class="card-body">Oku tarif etmek için gereken bağımsız yön sayısı. R^2 = düzlem, R^3 = uzay.</div></div>
<div class="calc-card"><div class="card-title">Orijin</div><div class="card-body">Tüm temsilci okları çizdiğimiz ayırt edilmiş nokta. Sütunu sıfır vektör <em>0</em>'dır.</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-vec2d-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> <em>v = (3, 4)</em> vektörü, orijinden P = (3, 4) noktasına çizilmiş bir ok. Kesik çizgiler yatay ve dikey bileşenler; birlikte oku yeniden inşa ederler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var arrow={x:[0,3],y:[0,4],mode:'lines+markers',name:'v = (3, 4)',line:{color:'#3b82f6',width:3},marker:{size:[6,11],color:'#3b82f6'}};
var xc={x:[0,3],y:[0,0],mode:'lines',name:'yatay bileşen',line:{color:'#4ecdc4',width:2,dash:'dash'}};
var yc={x:[3,3],y:[0,4],mode:'lines',name:'dikey bileşen',line:{color:'#a78bfa',width:2,dash:'dash'}};
var ann=[{x:3,y:4,text:'P = (3, 4)',showarrow:true,arrowhead:2,ax:35,ay:-25,font:{color:'#3b82f6',size:13}},{x:1.5,y:-0.35,text:'3',showarrow:false,font:{color:'#4ecdc4',size:12}},{x:3.35,y:2,text:'4',showarrow:false,font:{color:'#a78bfa',size:12}}];
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1,5],title:'x'},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1,5.5],title:'y',scaleanchor:'x'},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{orientation:'h',y:-0.18,x:0.5,xanchor:'center',font:{color:'#ebe6dc'}},annotations:ann};
Plotly.newPlot('plot-l1-vec2d-tr',[arrow,xc,yc],layout,{responsive:true,displayModeBar:false});
},120);</script>

<p class="l-text"><strong>Sıfır vektör.</strong> Her bileşeni sıfır olan vektöre <em>0</em> denir. Geometrik olarak başı ve kuyruğu çakışan dejenere oktur. Uzunluğu sıfır olan tek vektördür; bu nedenle bir yönü yoktur.</p>

<div class="l-note"><strong>İşaret anlaşması.</strong> Bir vektörün <em>negatifi</em>, okun yönünü ters çevirir. Eğer <em>v = (3, 4)</em> ise <em>−v = (−3, −4)</em>; ok aynı uzunluktadır, fakat aksi yöne döner.</div>

<h2 class="l-title">2. Vektör İşlemleri</h2>

<p class="l-text">İki temel işlem vardır: iki vektörü toplamak ve bir vektörü bir skalar (gerçel sayı) ile çarpmak. Doğrusal cebrin geri kalan her parçası bu ikisinin üstüne kurulur.</p>

<h3 class="l-section">2.1 Toplama</h3>

<div class="calc-formula"><div class="formula-label">VEKTÖR TOPLAMASI (BİLEŞEN BAZINDA)</div><div class="formula-main">$$\\mathbf{u} + \\mathbf{v} \\;=\\; \\begin{bmatrix} u_1 + v_1 \\\\ u_2 + v_2 \\\\ \\vdots \\\\ u_n + v_n \\end{bmatrix}.$$</div></div>

<p class="l-text"><strong>Kuyruktan-başa kuralı.</strong> <em>u + v</em>'yi bulmak için önce <em>u</em>'yu çiz, sonra <em>v</em>'nin kuyruğunu <em>u</em>'nun başına yerleştir. Orijinal kuyruktan yeni başa giden vektör <em>u + v</em>'dir.</p>

<p class="l-text"><strong>Paralelkenar kuralı.</strong> Eşdeğer biçimde: her iki oku aynı başlangıç noktasından çiz. Oluşturdukları paralelkenarı tamamla; ortak kuyruktan çıkan köşegen <em>u + v</em>'dir. İki kural aynı sonucu verir; çünkü öteleme bir vektörü değiştirmez.</p>

<div class="calc-graph"><div id="plot-l1-add-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> <em>u = (3, 1)</em> ve <em>v = (1, 3)</em> ile <em>u + v</em> toplamı. Kesik çizgili paralelkenar iki oktan kurulur; köşegen toplam <em>u + v = (4, 4)</em>.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var u={x:[0,3],y:[0,1],mode:'lines+markers',name:'u = (3, 1)',line:{color:'#3b82f6',width:3},marker:{size:[6,11],color:'#3b82f6'}};
var v={x:[0,1],y:[0,3],mode:'lines+markers',name:'v = (1, 3)',line:{color:'#a78bfa',width:3},marker:{size:[6,11],color:'#a78bfa'}};
var uv={x:[0,4],y:[0,4],mode:'lines+markers',name:'u + v = (4, 4)',line:{color:'#fbbf24',width:3},marker:{size:[6,11],color:'#fbbf24'}};
var par1={x:[3,4],y:[1,4],mode:'lines',line:{color:'#a78bfa',width:1.5,dash:'dot'},showlegend:false};
var par2={x:[1,4],y:[3,4],mode:'lines',line:{color:'#3b82f6',width:1.5,dash:'dot'},showlegend:false};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.6,5],title:'x'},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.6,5],title:'y',scaleanchor:'x'},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{orientation:'h',y:-0.18,x:0.5,xanchor:'center',font:{color:'#ebe6dc'}}};
Plotly.newPlot('plot-l1-add-tr',[u,v,uv,par1,par2],layout,{responsive:true,displayModeBar:false});
},140);</script>

<p class="l-text"><strong>Toplamanın özellikleri.</strong> Tüm <em>u, v, w</em> vektörleri için:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Değişme</div><div class="card-body">$\\mathbf{u}+\\mathbf{v}=\\mathbf{v}+\\mathbf{u}$. İki sıralama da aynı köşegeni verir.</div></div>
<div class="calc-card"><div class="card-title">Birleşme</div><div class="card-body">$(\\mathbf{u}+\\mathbf{v})+\\mathbf{w} = \\mathbf{u}+(\\mathbf{v}+\\mathbf{w})$. Parantezler önemsizdir.</div></div>
<div class="calc-card"><div class="card-title">Etkisiz eleman</div><div class="card-body">$\\mathbf{u}+\\mathbf{0}=\\mathbf{u}$. Sıfır oku eklemek hiçbir şeyi değiştirmez.</div></div>
<div class="calc-card"><div class="card-title">Ters</div><div class="card-body">$\\mathbf{u}+(-\\mathbf{u})=\\mathbf{0}$. Her okun, onu götüren bir eşi vardır.</div></div>
</div>

<h3 class="l-section">2.2 Skalar Çarpım</h3>

<div class="calc-formula"><div class="formula-label">SKALAR ÇARPIM</div><div class="formula-main">$$c\\,\\mathbf{v} \\;=\\; \\begin{bmatrix} c\\,v_1 \\\\ c\\,v_2 \\\\ \\vdots \\\\ c\\,v_n \\end{bmatrix}, \\qquad c \\in \\mathbb{R}.$$</div></div>

<p class="l-text"><strong>Geometrik anlamı.</strong> Bir <em>c</em> skalarıyla çarpmak, oku |<em>c</em>| katı uzatır (veya kısaltır). <em>c</em> negatifse ok aksi yöne döner. <em>c = 0</em> ise sonuç sıfır vektördür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">c &gt; 1</div><div class="card-body">Oku uzatır, yönü aynı kalır.</div></div>
<div class="calc-card"><div class="card-title">0 &lt; c &lt; 1</div><div class="card-body">Oku kısaltır, yönü aynı kalır.</div></div>
<div class="calc-card"><div class="card-title">c = 0</div><div class="card-body">Sıfır vektöre çöker.</div></div>
<div class="calc-card"><div class="card-title">c &lt; 0</div><div class="card-body">Yönü tersine çevirir; |c| uzunluğu belirler.</div></div>
</div>

<p class="l-text"><strong>Skalar çarpımın özellikleri.</strong> <em>a, b</em> skalarları ve <em>u, v</em> vektörleri için:</p>

<div class="calc-formula"><div class="formula-label">DAĞILMA VE UYUMLULUK</div><div class="formula-main">$$a(\\mathbf{u}+\\mathbf{v}) = a\\mathbf{u}+a\\mathbf{v}, \\qquad (a+b)\\mathbf{v} = a\\mathbf{v}+b\\mathbf{v}, \\qquad a(b\\mathbf{v}) = (ab)\\mathbf{v}, \\qquad 1\\,\\mathbf{v}=\\mathbf{v}.$$</div></div>

<p class="l-text"><strong>Çözümlü örnek.</strong> <em>R^3</em>'te <em>u = (2, −1, 3)</em> ve <em>v = (0, 4, −2)</em> olsun. Bu durumda</p>

<div class="calc-formula"><div class="formula-main">$$2\\mathbf{u} - 3\\mathbf{v} \\;=\\; 2\\begin{bmatrix} 2 \\\\ -1 \\\\ 3 \\end{bmatrix} - 3\\begin{bmatrix} 0 \\\\ 4 \\\\ -2 \\end{bmatrix} \\;=\\; \\begin{bmatrix} 4 \\\\ -2 \\\\ 6 \\end{bmatrix} - \\begin{bmatrix} 0 \\\\ 12 \\\\ -6 \\end{bmatrix} \\;=\\; \\begin{bmatrix} 4 \\\\ -14 \\\\ 12 \\end{bmatrix}.$$</div></div>

<h2 class="l-title">3. İç Çarpım</h2>

<p class="l-text">Vektör toplaması ve skalar çarpım teorinin doğrusal kısmını kurar. <em>Açı</em>, <em>uzunluk</em> ve <em>diklik</em>ten söz edebilmek için ikinci bir işleme ihtiyacımız var: <strong>iç çarpım</strong>. Toplamadan farklı olarak, iç çarpım iki vektörden tek bir sayı üretir.</p>

<div class="calc-formula"><div class="formula-label">İÇ ÇARPIM (CEBİRSEL TANIM)</div><div class="formula-main">$$\\mathbf{u} \\cdot \\mathbf{v} \\;=\\; u_1 v_1 + u_2 v_2 + \\cdots + u_n v_n \\;=\\; \\sum_{i=1}^{n} u_i v_i.$$</div></div>

<p class="l-text"><strong>Çözümlü örnek.</strong> <em>u = (1, 3, −2)</em> ve <em>v = (4, −1, 2)</em> ise <em>u · v = 1·4 + 3·(−1) + (−2)·2 = 4 − 3 − 4 = −3.</em></p>

<p class="l-text"><strong>Cebirsel özellikler.</strong> Tüm <em>u, v, w</em> vektörleri ve <em>c</em> skaları için:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Simetrik</div><div class="card-body">$\\mathbf{u}\\cdot\\mathbf{v}=\\mathbf{v}\\cdot\\mathbf{u}$.</div></div>
<div class="calc-card"><div class="card-title">İki-doğrusal</div><div class="card-body">$(\\mathbf{u}+\\mathbf{w})\\cdot\\mathbf{v}=\\mathbf{u}\\cdot\\mathbf{v}+\\mathbf{w}\\cdot\\mathbf{v}$ ve $(c\\mathbf{u})\\cdot\\mathbf{v}=c(\\mathbf{u}\\cdot\\mathbf{v})$.</div></div>
<div class="calc-card"><div class="card-title">Pozitif</div><div class="card-body">$\\mathbf{u}\\cdot\\mathbf{u}\\ge 0$; eşitlik yalnızca $\\mathbf{u}=\\mathbf{0}$ iken.</div></div>
<div class="calc-card"><div class="card-title">Kendi-çarpım</div><div class="card-body">$\\mathbf{u}\\cdot\\mathbf{u}=u_1^2+\\cdots+u_n^2=\\|\\mathbf{u}\\|^2$.</div></div>
</div>

<h3 class="l-section">3.1 Geometrik Anlam</h3>

<p class="l-text">Olağanüstü olan şudur: cebirsel toplam <em>u·v</em>'nin temiz bir geometrik yorumu da vardır:</p>

<div class="calc-formula"><div class="formula-label">İÇ ÇARPIM (GEOMETRİK BİÇİM)</div><div class="formula-main">$$\\mathbf{u}\\cdot\\mathbf{v} \\;=\\; \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|\\cos\\theta,$$</div><div class="formula-sub"><em>θ</em> iki ok arasındaki açıdır ve [0, π] aralığında ölçülür.</div></div>

<p class="l-text">İspat, kenarları <em>u</em>, <em>v</em> ve <em>u − v</em> olan üçgene kosinüs teoreminin bir satırlık uygulamasıdır: iki-doğrusallık kullanılarak <em>‖u − v‖² = (u − v)·(u − v)</em> genişletilir, sonra <em>‖u‖² + ‖v‖² − 2‖u‖‖v‖cos θ</em> ile eşitlenir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">u·v &gt; 0</div><div class="card-body">Açı dar. Oklar genel olarak aynı yöne işaret eder.</div></div>
<div class="calc-card"><div class="card-title">u·v = 0</div><div class="card-body">Oklar <em>dik</em> (ortogonal). En önemli durum budur.</div></div>
<div class="calc-card"><div class="card-title">u·v &lt; 0</div><div class="card-body">Açı geniş. Oklar yön bakımından uyuşmaz.</div></div>
<div class="calc-card"><div class="card-title">|u·v| = ‖u‖‖v‖</div><div class="card-body">Oklar paralel (θ = 0 veya π). Biri diğerinin skalar katıdır.</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-dot-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> üç vektör çifti — pozitif, sıfır ve negatif iç çarpıma karşılık gelir. Dar açı (sol) ↔ <em>u·v &gt; 0</em>; dik açı (orta) ↔ <em>u·v = 0</em>; geniş açı (sağ) ↔ <em>u·v &lt; 0</em>.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a1={x:[0,2],y:[0,0.4],mode:'lines',line:{color:'#3b82f6',width:3},name:'dar açı, u·v > 0',showlegend:true};
var a2={x:[0,1.5],y:[0,1.5],mode:'lines',line:{color:'#3b82f6',width:3},showlegend:false};
var b1={x:[4,6],y:[0,0],mode:'lines',line:{color:'#10b981',width:3},name:'dik açı, u·v = 0',showlegend:true};
var b2={x:[4,4],y:[0,2],mode:'lines',line:{color:'#10b981',width:3},showlegend:false};
var c1={x:[8,10],y:[0,0],mode:'lines',line:{color:'#ef4444',width:3},name:'geniş açı, u·v < 0',showlegend:true};
var c2={x:[8,7.2],y:[0,1.6],mode:'lines',line:{color:'#ef4444',width:3},showlegend:false};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.5,11],title:''},yaxis:{gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.5,2.5],title:'',scaleanchor:'x'},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{orientation:'h',y:-0.2,x:0.5,xanchor:'center',font:{color:'#ebe6dc'}}};
Plotly.newPlot('plot-l1-dot-tr',[a1,a2,b1,b2,c1,c2],layout,{responsive:true,displayModeBar:false});
},160);</script>

<h3 class="l-section">3.2 Cauchy–Schwarz Eşitsizliği</h3>

<p class="l-text"><em>|cos θ| ≤ 1</em> olduğundan, geometrik form matematiğin en çok kullanılan eşitsizliklerinden birini hemen verir:</p>

<div class="calc-formula"><div class="formula-label">CAUCHY–SCHWARZ</div><div class="formula-main">$$|\\mathbf{u}\\cdot\\mathbf{v}| \\;\\le\\; \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|,$$</div><div class="formula-sub">eşitlik ancak ve ancak <em>u</em> ve <em>v</em> doğrusal bağımlıysa (biri diğerinin skalar katıysa) sağlanır.</div></div>

<h3 class="l-section">3.3 İzdüşüm</h3>

<p class="l-text"><em>u</em>'yu <em>v</em>'ye paralel bir parça ile <em>v</em>'ye dik bir parçaya ayırmak istersek, paralel parça <em>u</em>'nun <em>v</em> üzerine <strong>ortogonal izdüşümüdür</strong>:</p>

<div class="calc-formula"><div class="formula-label">ORTOGONAL İZDÜŞÜM</div><div class="formula-main">$$\\mathrm{proj}_{\\mathbf{v}}\\,\\mathbf{u} \\;=\\; \\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\mathbf{v}\\cdot\\mathbf{v}}\\,\\mathbf{v} \\;=\\; \\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\|\\mathbf{v}\\|^2}\\,\\mathbf{v}.$$</div></div>

<p class="l-text">Doğrudan bir hesap, kalanın <em>u − proj<sub>v</sub> u</em>'nun <em>v</em>'ye dik olduğunu gösterir: iç çarpımı hesaplayın, iki-doğrusal terimlerin birbirini götürdüğünü göreceksiniz.</p>

<div class="l-note"><strong>Skalar izdüşüm.</strong> İzdüşümün işaretli uzunluğu — bazen <em>u</em>'nun <em>v</em> yönündeki <em>bileşeni</em> olarak adlandırılır — <em>(u·v) / ‖v‖</em>'dir. İzdüşüm <em>v</em> ile aynı yöne bakıyorsa pozitif, aksi halde negatiftir.</div>

<h2 class="l-title">4. Vektörün Normu</h2>

<p class="l-text">Bir vektörün kendisiyle iç çarpımı, uzunluğunun karesini verir:</p>

<div class="calc-formula"><div class="formula-label">ÖKLİD NORMU</div><div class="formula-main">$$\\|\\mathbf{v}\\| \\;=\\; \\sqrt{\\mathbf{v}\\cdot\\mathbf{v}} \\;=\\; \\sqrt{v_1^2 + v_2^2 + \\cdots + v_n^2}.$$</div></div>

<p class="l-text"><em>R^2</em>'de bu, bileşenleri dik kenarlar olan dik üçgene Pisagor teoreminin uygulanmasıdır. <em>R^3</em>'te ise Pisagor iki kez uygulanır.</p>

<p class="l-text"><strong>Çözümlü örnek.</strong> <em>v = (3, 4)</em> için <em>‖v‖ = √(9 + 16) = √25 = 5</em>. <em>v = (1, 2, 2)</em> için <em>‖v‖ = √(1 + 4 + 4) = 3</em>.</p>

<p class="l-text"><strong>Öklid normunun özellikleri.</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Negatif değil</div><div class="card-body">$\\|\\mathbf{v}\\| \\ge 0$; eşitlik yalnızca sıfır vektörde.</div></div>
<div class="calc-card"><div class="card-title">Homojen</div><div class="card-body">$\\|c\\mathbf{v}\\| = |c|\\,\\|\\mathbf{v}\\|$. Ölçekleme uzunluğu |c| katı yapar.</div></div>
<div class="calc-card"><div class="card-title">Üçgen eşitsizliği</div><div class="card-body">$\\|\\mathbf{u}+\\mathbf{v}\\| \\le \\|\\mathbf{u}\\| + \\|\\mathbf{v}\\|$; Cauchy–Schwarz'ın doğrudan sonucu.</div></div>
<div class="calc-card"><div class="card-title">Birim vektörler</div><div class="card-body">Eğer <em>v ≠ 0</em> ise <em>v / ‖v‖</em> vektörünün uzunluğu 1 ve yönü <em>v</em> ile aynıdır.</div></div>
</div>

<h3 class="l-section">4.1 Diğer Normlar (Seçimlik)</h3>

<p class="l-text">Öklid normu geometrik varsayılan olsa da klasik analizde başka uzunluk kavramları da geçer. <em>1 ≤ p &lt; ∞</em> için <em>p-norm</em> şudur:</p>

<div class="calc-formula"><div class="formula-label">p-NORM</div><div class="formula-main">$$\\|\\mathbf{v}\\|_p \\;=\\; \\Big( |v_1|^p + |v_2|^p + \\cdots + |v_n|^p \\Big)^{1/p},$$</div><div class="formula-sub">sınır durumu olarak <em>p → ∞</em> iken $\\|\\mathbf{v}\\|_\\infty = \\max_i |v_i|$.</div></div>

<p class="l-text"><em>p = 2</em> alındığında bu Öklid normudur. <em>p = 1</em> ise <em>taksicilik</em> veya Manhattan normudur; <em>R^2</em>'de birim yuvar, 45° döndürülmüş bir karedir. <em>p = ∞</em> için birim yuvar eksenlere paralel bir karedir. Bütün bu normlar <em>R^n</em>'de aynı yakınsama kavramını üretir; ancak birim yuvarlarının biçimi farklıdır.</p>

<h2 class="l-title">5. Vektör Uzayları</h2>

<p class="l-text">Şimdiye kadar yalnızca <em>R^n</em>'de çalıştık. Daha derin yapısal görüş şudur: yaptığımız her şey — toplama, skalar çarpım, aksiyomları — <em>R^n</em>'den koparılıp tanımın kendisi olarak kullanılabilir. Aynı aksiyomları sağlayan her nesneye <strong>vektör uzayı</strong> denir.</p>

<div class="calc-formula"><div class="formula-label">TANIM: R ÜZERİNDE VEKTÖR UZAYI</div><div class="formula-main">$$V \\text{ vektör uzayıdır, eğer } (V, +, \\cdot) \\text{ aşağıdaki sekiz aksiyomu sağlıyorsa.}$$</div></div>

<p class="l-text">Boş olmayan bir <em>V</em> kümesi, bir <em>+ : V × V → V</em> işlemi (toplama) ve bir <em>· : R × V → V</em> işlemiyle (skalar çarpım) birlikte, tüm <em>u, v, w ∈ V</em> ve tüm <em>a, b ∈ R</em> için aşağıdakileri sağlıyorsa bir <em>gerçel vektör uzayıdır</em>:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">(A1) Değişme</div><div class="card-body">$\\mathbf{u}+\\mathbf{v} = \\mathbf{v}+\\mathbf{u}$.</div></div>
<div class="calc-card"><div class="card-title">(A2) Birleşme</div><div class="card-body">$(\\mathbf{u}+\\mathbf{v})+\\mathbf{w} = \\mathbf{u}+(\\mathbf{v}+\\mathbf{w})$.</div></div>
<div class="calc-card"><div class="card-title">(A3) Sıfır eleman</div><div class="card-body">Her <em>v</em> için <em>v + 0 = v</em> olan bir <em>0 ∈ V</em> vardır.</div></div>
<div class="calc-card"><div class="card-title">(A4) Toplamsal ters</div><div class="card-body">Her <em>v</em> için <em>v + (−v) = 0</em> olan bir <em>−v</em> vardır.</div></div>
<div class="calc-card"><div class="card-title">(M1) +V üzerine dağılma</div><div class="card-body">$a(\\mathbf{u}+\\mathbf{v}) = a\\mathbf{u}+a\\mathbf{v}$.</div></div>
<div class="calc-card"><div class="card-title">(M2) +R üzerine dağılma</div><div class="card-body">$(a+b)\\mathbf{v} = a\\mathbf{v}+b\\mathbf{v}$.</div></div>
<div class="calc-card"><div class="card-title">(M3) Skalarda birleşme</div><div class="card-body">$a(b\\mathbf{v}) = (ab)\\mathbf{v}$.</div></div>
<div class="calc-card"><div class="card-title">(M4) Birim skalar</div><div class="card-body">$1\\cdot\\mathbf{v} = \\mathbf{v}$.</div></div>
</div>

<h3 class="l-section">5.1 Örnekler</h3>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">R^n</div><div class="card-body">Standart örnek: bileşen-bazında toplama ve skalar çarpımıyla sütun vektörleri. Sekiz aksiyom <em>R</em>'de geçerli olduğu için burada da geçerlidir.</div></div>
<div class="calc-card"><div class="card-title">P_n</div><div class="card-body">Derecesi en fazla <em>n</em> olan gerçel polinomlar, alışılmış toplam ve skalar çarpımla. <em>p(x) = a_0 + a_1 x + ⋯ + a_n x^n</em> polinomu, <em>(n+1)</em> katsayısıyla kaydedilir.</div></div>
<div class="calc-card"><div class="card-title">C[a, b]</div><div class="card-body"><em>[a, b]</em> aralığında sürekli gerçel-değerli fonksiyonlar; noktasal toplam <em>(f+g)(x)=f(x)+g(x)</em> ve noktasal skalar çarpım <em>(cf)(x)=c·f(x)</em> ile.</div></div>
<div class="calc-card"><div class="card-title">M_{m,n}</div><div class="card-body">Tüm <em>m×n</em> gerçel matrisler. Toplama ve skalar çarpım girdi-bazında etkir. Düşük boyutlarda geometrik görünür; ancak temelde soyuttur.</div></div>
</div>

<p class="l-text"><strong>Örneğin değil.</strong> <em>{(x, y) ∈ R^2 : x ≥ 0}</em> kümesi — birinci koordinatı negatif olmayan vektörler — vektör uzayı değildir: <em>(1, 0)</em> ona aittir; fakat negatifi <em>(−1, 0)</em> ona ait değildir. (A4) aksiyomu sağlanmaz.</p>

<h3 class="l-section">5.2 Altuzaylar</h3>

<p class="l-text">Bir <strong>altuzay</strong> <em>W ⊆ V</em>, devraldığı işlemler altında kendi başına bir vektör uzayı olan altkümedir. Altuzay olmanın pratik kontrolü:</p>

<div class="calc-formula"><div class="formula-label">ALTUZAY TESTİ</div><div class="formula-main">$$W \\subseteq V \\text{ altuzaydır ancak ve ancak } \\mathbf{0}\\in W \\text{ ve } \\forall \\mathbf{u},\\mathbf{v}\\in W,\\;\\forall c\\in\\mathbb{R}:\\; c\\mathbf{u}+\\mathbf{v}\\in W.$$</div></div>

<p class="l-text"><em>R^3</em>'te tüm öz altuzaylar tam olarak şunlardır: tek nokta <em>{0}</em>; orijinden geçen her doğru; orijinden geçen her düzlem; ve bütün uzay <em>R^3</em>.</p>

<h2 class="l-title">6. Doğrusal Birleşim ve Geren</h2>

<p class="l-text"><em>v<sub>1</sub>, …, v<sub>k</sub> ∈ V</em> vektörleri verilsin. <strong>Doğrusal birleşim</strong>, şu biçimdeki herhangi bir vektördür:</p>

<div class="calc-formula"><div class="formula-label">DOĞRUSAL BİRLEŞİM</div><div class="formula-main">$$c_1 \\mathbf{v}_1 + c_2 \\mathbf{v}_2 + \\cdots + c_k \\mathbf{v}_k, \\qquad c_i \\in \\mathbb{R}.$$</div></div>

<p class="l-text"><em>Tüm</em> doğrusal birleşimlerin kümesine <em>{v<sub>1</sub>, …, v<sub>k</sub>}</em>'nin <strong>gereni</strong> denir:</p>

<div class="calc-formula"><div class="formula-label">GEREN</div><div class="formula-main">$$\\mathrm{span}\\{\\mathbf{v}_1,\\dots,\\mathbf{v}_k\\} \\;=\\; \\Big\\{ c_1 \\mathbf{v}_1 + \\cdots + c_k \\mathbf{v}_k : c_i \\in \\mathbb{R} \\Big\\}.$$</div></div>

<p class="l-text"><strong>R^3'teki geometrik resimler:</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tek sıfırdan farklı vektör</div><div class="card-body">Geren, <em>v</em> yönündeki, orijinden geçen bir <em>doğrudur</em>.</div></div>
<div class="calc-card"><div class="card-title">Paralel olmayan iki vektör</div><div class="card-body">Geren, orijinden geçen ve iki oku içeren <em>düzlemdir</em>.</div></div>
<div class="calc-card"><div class="card-title">Üç bağımsız vektör</div><div class="card-body">Geren bütün <em>R^3</em>'tür.</div></div>
<div class="calc-card"><div class="card-title">Fazlalıklı küme</div><div class="card-body">Diğerlerinin doğrusal birleşimi olan bir vektör atıldığında geren küçülmez.</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-span-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> <em>R^3</em>'te <em>span{(1, 0, 0), (0, 1, 0)}</em> düzlemi — xy-düzlemi (turuncu ızgara). Geren iki vektör mavi ve mor; düzlem üzerindeki her nokta bunların doğrusal birleşimidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[],zs=[];
for(var i=-3;i<=3;i+=0.6){var rowx=[],rowy=[],rowz=[];for(var j=-3;j<=3;j+=0.6){rowx.push(i);rowy.push(j);rowz.push(0);}xs.push(rowx);ys.push(rowy);zs.push(rowz);}
var plane={x:xs,y:ys,z:zs,type:'surface',showscale:false,colorscale:[[0,'rgba(251,191,36,0.35)'],[1,'rgba(251,191,36,0.55)']],opacity:0.55,name:'xy-düzlemi'};
var e1={type:'scatter3d',mode:'lines',x:[0,1],y:[0,0],z:[0,0],line:{color:'#3b82f6',width:8},name:'v1 = (1,0,0)'};
var e2={type:'scatter3d',mode:'lines',x:[0,0],y:[0,1],z:[0,0],line:{color:'#a78bfa',width:8},name:'v2 = (0,1,0)'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},margin:{t:30,r:0,b:0,l:0},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'rgba(0,0,0,0)'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'rgba(0,0,0,0)'},zaxis:{title:'z',range:[-2,2],gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'rgba(0,0,0,0)'}},showlegend:true,legend:{orientation:'h',y:-0.05,x:0.5,xanchor:'center',font:{color:'#ebe6dc'}}};
Plotly.newPlot('plot-l1-span-tr',[plane,e1,e2],layout,{responsive:true,displayModeBar:false});
},180);</script>

<p class="l-text"><strong>Teorem.</strong> <em>V</em>'deki herhangi bir sonlu kümenin gereni <em>V</em>'nin bir altuzayıdır. İspat, altuzay testinin bir satırlık denetimidir: sıfır vektör, sıfır katsayılı trivial birleşimdir ve iki birleşimin doğrusal birleşimi yine bir birleşimdir.</p>

<h2 class="l-title">7. Doğrusal Bağımsızlık</h2>

<p class="l-text">Bazı vektör kümeleri fazlalık taşır: bir vektör, diğerlerinin birleşimi olarak yazılabilir. Biz bunu tespit etmek isteriz.</p>

<div class="calc-formula"><div class="formula-label">TANIM: DOĞRUSAL BAĞIMSIZLIK</div><div class="formula-main">$$\\{\\mathbf{v}_1,\\dots,\\mathbf{v}_k\\} \\text{ doğrusal bağımsızdır} \\;\\iff\\; \\Big( c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k = \\mathbf{0} \\;\\Longrightarrow\\; c_1=\\cdots=c_k=0 \\Big).$$</div><div class="formula-sub">Yalnızca trivial birleşim sıfır vektörü üretir.</div></div>

<p class="l-text">Eğer trivial olmayan bir birleşim sıfır üretiyorsa kümeye <strong>doğrusal bağımlı</strong> denir; bu durumda en az bir vektör, geri kalanların birleşimi olarak yazılabilir; dolayısıyla yeni bir yön getirmez.</p>

<h3 class="l-section">7.1 R^n'de Test Nasıl Yapılır</h3>

<p class="l-text">Sütunları <em>v<sub>1</sub>, …, v<sub>k</sub></em> olan <em>A</em> matrisini oluştur. Vektörler doğrusal bağımsızdır ancak ve ancak <em>Ac = 0</em>'ın tek çözümü <em>c = 0</em> olduğunda. <em>A</em>'yı satır indirgeyin: her sütunda pivot varsa küme bağımsızdır; pivotsuz bir sütun varsa, o sütun önceki sütunlara bağımlıdır.</p>

<p class="l-text"><strong>Çözümlü örnek.</strong> <em>R^3</em>'te aşağıdaki üç vektör doğrusal bağımsız mıdır?</p>

<div class="calc-formula"><div class="formula-main">$$\\mathbf{v}_1 = \\begin{bmatrix} 1\\\\ 0\\\\ 1 \\end{bmatrix},\\quad \\mathbf{v}_2 = \\begin{bmatrix} 2\\\\ 1\\\\ 0 \\end{bmatrix},\\quad \\mathbf{v}_3 = \\begin{bmatrix} 0\\\\ 1\\\\ -2 \\end{bmatrix}.$$</div></div>

<p class="l-text"><em>c<sub>1</sub>v<sub>1</sub> + c<sub>2</sub>v<sub>2</sub> + c<sub>3</sub>v<sub>3</sub> = 0</em> denkleminden:</p>

<div class="calc-formula"><div class="formula-main">$$\\begin{cases} c_1 + 2c_2 \\;= 0 \\\\ c_2 + c_3 = 0 \\\\ c_1 - 2c_3 = 0 \\end{cases}$$</div></div>

<p class="l-text">İkinci denklemden <em>c<sub>3</sub> = −c<sub>2</sub></em>; bunu üçüncüye yerleştirince <em>c<sub>1</sub> = −2c<sub>2</sub></em>; bunu da birinciye yerleştirince <em>−2c<sub>2</sub> + 2c<sub>2</sub> = 0</em> kendiliğinden sağlanır. Demek ki <em>c<sub>2</sub></em> serbest bir parametre: <em>c<sub>2</sub> = 1, c<sub>1</sub> = −2, c<sub>3</sub> = −1</em> alındığında <em>−2v<sub>1</sub> + v<sub>2</sub> − v<sub>3</sub> = 0</em> elde edilir. Küme <strong>doğrusal bağımlıdır</strong>.</p>

<div class="l-note"><strong>R^n'de kestirme.</strong> <em>R^n</em>'de <em>n</em>'den fazla herhangi bir vektör kümesi otomatik olarak bağımlıdır. İki vektör bağımsızdır ancak ve ancak biri diğerinin skalar katı değilse. <em>R^3</em>'te üç vektör bağımsızdır ancak ve ancak 3×3 matrisin (sütun olarak) determinantı sıfır değilse.</div>

<h2 class="l-title">8. Baz ve Boyut</h2>

<div class="calc-formula"><div class="formula-label">TANIM: BAZ</div><div class="formula-main">$$\\mathcal{B} = \\{\\mathbf{b}_1,\\dots,\\mathbf{b}_n\\} \\text{ } V \\text{'nin bazıdır} \\;\\iff\\; \\mathcal{B} \\text{ doğrusal bağımsızdır ve } V \\text{'yi gerer.}$$</div></div>

<p class="l-text">Bir baz, <em>en küçük geren küme</em>'dir (veya eşdeğer biçimde <em>en büyük bağımsız küme</em>). <em>V</em>'deki her vektör, baz vektörlerinin doğrusal birleşimi olarak <em>tek bir biçimde</em> yazılabilir; katsayılara vektörün bu bazdaki <strong>koordinatları</strong> denir.</p>

<h3 class="l-section">8.1 Standart Baz</h3>

<p class="l-text"><em>R^n</em>'de <strong>standart baz</strong>:</p>

<div class="calc-formula"><div class="formula-main">$$\\mathbf{e}_1 = \\begin{bmatrix} 1\\\\ 0\\\\ \\vdots\\\\ 0 \\end{bmatrix},\\quad \\mathbf{e}_2 = \\begin{bmatrix} 0\\\\ 1\\\\ \\vdots\\\\ 0 \\end{bmatrix},\\;\\dots,\\; \\mathbf{e}_n = \\begin{bmatrix} 0\\\\ 0\\\\ \\vdots\\\\ 1 \\end{bmatrix}.$$</div></div>

<p class="l-text">Herhangi <em>v = (v<sub>1</sub>, …, v<sub>n</sub>)</em> için tek açılım: <em>v = v<sub>1</sub>e<sub>1</sub> + ⋯ + v<sub>n</sub>e<sub>n</sub></em>. Başka bazlar da vardır: <em>R^2</em>'de <em>{(1, 1), (1, −1)}</em> ikilisi de bir bazdır (sütunlar bağımsızdır ve düzlemi gerer).</p>

<h3 class="l-section">8.2 Boyut</h3>

<div class="calc-formula"><div class="formula-label">TEOREM</div><div class="formula-main">$$V \\text{ vektör uzayının her bazının eleman sayısı aynıdır.}$$</div><div class="formula-sub">Bu sayıya <em>V</em>'nin <em>boyutu</em> denir ve <em>dim V</em> ile gösterilir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">dim R^n</div><div class="card-body">= n. Standart bazın <em>n</em> elemanı vardır.</div></div>
<div class="calc-card"><div class="card-title">dim P_n</div><div class="card-body">= n+1. Baz: <em>{1, x, x², …, x^n}</em>.</div></div>
<div class="calc-card"><div class="card-title">dim M_{m,n}</div><div class="card-body">= mn. Baz: bir girdisi 1, diğerleri 0 olan matrisler.</div></div>
<div class="calc-card"><div class="card-title">dim C[a, b]</div><div class="card-body">= ∞. Sürekli fonksiyonlar sonsuz boyutlu bir uzay oluşturur.</div></div>
</div>

<h2 class="l-title">9. Klasik Alıştırmalar</h2>

<p class="l-text">İşte altı klasik soru. İfadeyi okuyun, hesaplamayı kendiniz deneyin, ancak ondan sonra çözüme bakın.</p>

<h3 class="l-section">Alıştırma 1 — Toplam, iç çarpım ve norm</h3>

<p class="l-text"><strong>İfade.</strong> <em>R^3</em>'te <em>u = (2, −1, 3)</em> ve <em>v = (1, 4, −2)</em> olsun. <em>u + v</em>, <em>u·v</em> ve <em>‖u‖</em>'yu hesaplayın.</p>

<div class="calc-formula"><div class="formula-label">ÇÖZÜM</div><div class="formula-main">$$\\mathbf{u}+\\mathbf{v} = (3,\\,3,\\,1), \\qquad \\mathbf{u}\\cdot\\mathbf{v} = 2 - 4 - 6 = -8, \\qquad \\|\\mathbf{u}\\| = \\sqrt{4+1+9} = \\sqrt{14}.$$</div></div>

<h3 class="l-section">Alıştırma 2 — v yönünde birim vektör</h3>

<p class="l-text"><strong>İfade.</strong> <em>v = (1, 2, 2)</em>'ye paralel birim vektörü bulun.</p>

<p class="l-text"><strong>Çözüm.</strong> <em>‖v‖ = √(1 + 4 + 4) = 3</em>. Birim vektör:</p>

<div class="calc-formula"><div class="formula-main">$$\\hat{\\mathbf{v}} \\;=\\; \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|} \\;=\\; \\Big(\\tfrac{1}{3},\\,\\tfrac{2}{3},\\,\\tfrac{2}{3}\\Big).$$</div></div>

<p class="l-text">Doğrulama: <em>‖v̂‖² = 1/9 + 4/9 + 4/9 = 1</em>.</p>

<h3 class="l-section">Alıştırma 3 — İki vektör arasındaki açı</h3>

<p class="l-text"><strong>İfade.</strong> <em>u = (1, 1, 0)</em> ile <em>v = (0, 1, 1)</em> arasındaki açıyı bulun.</p>

<p class="l-text"><strong>Çözüm.</strong> <em>u·v = 0 + 1 + 0 = 1</em>, <em>‖u‖ = √2</em>, <em>‖v‖ = √2</em>. O hâlde</p>

<div class="calc-formula"><div class="formula-main">$$\\cos\\theta \\;=\\; \\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|} \\;=\\; \\frac{1}{2}, \\qquad \\theta \\;=\\; \\tfrac{\\pi}{3} \\;=\\; 60^\\circ.$$</div></div>

<h3 class="l-section">Alıştırma 4 — Üç vektörün bağımsızlığı</h3>

<p class="l-text"><strong>İfade.</strong> <em>R^3</em>'te <em>{(1, 2, 3), (4, 5, 6), (7, 8, 9)}</em> kümesinin doğrusal bağımsız olup olmadığını belirleyin.</p>

<p class="l-text"><strong>Çözüm.</strong> <em>c<sub>1</sub>(1,2,3) + c<sub>2</sub>(4,5,6) + c<sub>3</sub>(7,8,9) = (0,0,0)</em>:</p>

<div class="calc-formula"><div class="formula-main">$$\\begin{cases} c_1 + 4c_2 + 7c_3 = 0 \\\\ 2c_1 + 5c_2 + 8c_3 = 0 \\\\ 3c_1 + 6c_2 + 9c_3 = 0 \\end{cases}$$</div></div>

<p class="l-text">Satır indirge. (Satır 1)'in <em>2×</em>'ini (satır 2)'den, <em>3×</em>'ini (satır 3)'ten çıkar:</p>

<div class="calc-formula"><div class="formula-main">$$\\begin{cases} c_1 + 4c_2 + 7c_3 = 0 \\\\ -3c_2 - 6c_3 = 0 \\\\ -6c_2 - 12c_3 = 0 \\end{cases}$$</div></div>

<p class="l-text">Üçüncü denklem ikincinin iki katıdır, fazlalıktır; <em>c<sub>2</sub> = −2c<sub>3</sub></em> ve <em>c<sub>1</sub> = −4(−2c<sub>3</sub>) − 7c<sub>3</sub> = c<sub>3</sub></em>. <em>c<sub>3</sub> = 1</em> alındığında trivial olmayan bağıntı <em>v<sub>1</sub> − 2v<sub>2</sub> + v<sub>3</sub> = 0</em>'dır. Küme <strong>doğrusal bağımlıdır</strong>. Eşdeğer olarak, bu sütunlarla oluşturulan matrisin determinantı sıfırdır.</p>

<h3 class="l-section">Alıştırma 5 — u'nun v üzerine izdüşümü</h3>

<p class="l-text"><strong>İfade.</strong> <em>u = (3, 4)</em>'ü <em>v = (1, 0)</em> üzerine izdüşürün; kalanın <em>v</em>'ye dik olduğunu doğrulayın.</p>

<p class="l-text"><strong>Çözüm.</strong> <em>u·v = 3</em>, <em>v·v = 1</em>; bu nedenle</p>

<div class="calc-formula"><div class="formula-main">$$\\mathrm{proj}_{\\mathbf{v}}\\,\\mathbf{u} \\;=\\; \\frac{3}{1}(1,\\,0) \\;=\\; (3,\\,0).$$</div></div>

<p class="l-text">Kalan <em>u − proj<sub>v</sub> u = (3, 4) − (3, 0) = (0, 4)</em>; <em>v</em> ile iç çarpımı <em>0·1 + 4·0 = 0</em>. Beklendiği gibi, kalan <em>v</em>'ye diktir.</p>

<h3 class="l-section">Alıştırma 6 — Paralelkenar özdeşliğinin doğrulanması</h3>

<p class="l-text"><strong>İfade.</strong> Herhangi <em>u, v ∈ R^n</em> için <em>‖u + v‖² + ‖u − v‖² = 2‖u‖² + 2‖v‖²</em> olduğunu gösterin.</p>

<p class="l-text"><strong>Çözüm.</strong> <em>‖w‖² = w·w</em> ve iç çarpımın iki-doğrusallığı kullanılarak her iki taraf açılır:</p>

<div class="calc-formula"><div class="formula-main">$$\\|\\mathbf{u}+\\mathbf{v}\\|^2 = \\mathbf{u}\\cdot\\mathbf{u} + 2\\,\\mathbf{u}\\cdot\\mathbf{v} + \\mathbf{v}\\cdot\\mathbf{v},$$</div></div>

<div class="calc-formula"><div class="formula-main">$$\\|\\mathbf{u}-\\mathbf{v}\\|^2 = \\mathbf{u}\\cdot\\mathbf{u} - 2\\,\\mathbf{u}\\cdot\\mathbf{v} + \\mathbf{v}\\cdot\\mathbf{v}.$$</div></div>

<p class="l-text">İki ifadeyi toplayınca çapraz terimler birbirini götürür ve <em>2‖u‖² + 2‖v‖²</em> elde edilir. Geometrik olarak: her paralelkenarda köşegenlerin karelerinin toplamı, kenarların karelerinin toplamının iki katıdır.</p>

<div class="l-note"><strong>Sırada ne var.</strong> 2. Ders vektörlerden <em>matrislere</em> geçer: vektörler üzerinde doğrusal dönüşüm olarak etkiyen dikdörtgen tablolar. Matrisler elde edildiğinde, döndürebilir, yansıtabilir, izdüşürebilir ve doğrusal denklem sistemlerini algoritmik olarak çözebiliriz.</div>
`

};
