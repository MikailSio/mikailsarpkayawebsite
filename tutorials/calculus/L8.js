window.CALCULUS_L8 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Vector calculus is the grammar of physics and the dialect that modern deep learning silently borrows from.</strong> Single-variable calculus tells you how a scalar changes; vector calculus tells you how an entire field — a fluid velocity, an electromagnetic wave, a loss landscape over a million parameters — changes everywhere at once. Three differential operators (gradient, divergence, curl), three integral theorems (Green, Stokes, divergence), and two matrices (Jacobian, Hessian) carry almost the entire load.</p>

<p class="l-text">This lesson splits its time evenly between the classical and the modern. We will draw curl in a bathtub and let it spin a paddle wheel; we will read Maxwell's equations in their integral form and recognize Stokes' theorem at the heart of every one of them. Then we turn to machine learning, where the Jacobian quietly powers reverse-mode autodiff (the engine of backpropagation), the Hessian decides whether a critical point is a real minimum or a treacherous saddle, and approximations like K-FAC and Shampoo build practical second-order optimizers on top of these ideas.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compute gradient, divergence, and curl in two and three dimensions and read their geometric meaning</li>
<li>Prove a clean sketch of Green's theorem and use it for line integrals and planimeter-style area formulas</li>
<li>State Stokes' and the divergence theorem; identify them inside Maxwell's equations and Gauss's law</li>
<li>Build the Jacobian of a nonlinear map and explain forward-mode versus reverse-mode automatic differentiation</li>
<li>Read the eigenvalues of a Hessian to classify a critical point as minimum, maximum, or saddle</li>
<li>Connect modern ideas (K-FAC, Shampoo, Gauss-Newton, neural tangent kernel) back to Jacobian and Hessian structure</li>
</ul>
</div>

<h2 class="lesson-title">1. Recall: The Gradient</h2>

<p class="l-text">The <strong>gradient</strong> of a scalar field $f: \\mathbb{R}^n \\to \\mathbb{R}$ is the vector of its partial derivatives:</p>

<div class="calc-formula"><div class="formula-label">GRADIENT</div><div class="formula-main">$$\\nabla f(\\mathbf{x}) = \\left( \\frac{\\partial f}{\\partial x_1},\\, \\frac{\\partial f}{\\partial x_2},\\, \\dots,\\, \\frac{\\partial f}{\\partial x_n} \\right)$$</div><div class="formula-sub">A vector field built from a scalar field. Lives in the same space as the input.</div></div>

<p class="l-text">Three facts you should be able to recite without thinking. (1) $\\nabla f$ points in the direction of <strong>steepest ascent</strong> of $f$. (2) Its magnitude $\\|\\nabla f\\|$ equals the maximum directional derivative of $f$ at that point. (3) $\\nabla f$ is always <strong>perpendicular to the level sets</strong> $\\{f = c\\}$. The first fact is why gradient descent works; the third is why constrained optimization with Lagrange multipliers works.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Scalar in, vector out</div><div class="card-body">Take a scalar field; differentiate componentwise. The output is a vector with $n$ components, one per input dimension.</div></div>
<div class="calc-card"><div class="card-title">Steepest ascent</div><div class="card-body">No other unit direction produces a larger first-order increase in $f$ than $\\nabla f / \\|\\nabla f\\|$.</div></div>
<div class="calc-card"><div class="card-title">Orthogonal to level sets</div><div class="card-body">If $f(\\mathbf{x}(t)) = c$ is constant, differentiating gives $\\nabla f \\cdot \\mathbf{x}'(t) = 0$ — the gradient is normal to the tangent of any curve on a level set.</div></div>
<div class="calc-card"><div class="card-title">ML appearance</div><div class="card-body">Loss $L(\\mathbf{w})$ is a scalar field on parameter space. SGD computes $-\\nabla L$ at the current batch and steps along it. The gradient is the entire training signal.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-grad-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the scalar field $f(x,y) = x^2 + 2y^2$ as filled contours, with its gradient field $\\nabla f = (2x, 4y)$ as arrows. Every arrow is perpendicular to the contour line it pierces — exactly the orthogonality property. Arrows grow longer away from the origin because the field becomes steeper there.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=40,L=2.2;var x=[],y=[];for(var i=0;i<=N;i++){x.push(-L+i*2*L/N);y.push(-L+i*2*L/N);}
var z=[];for(var i=0;i<=N;i++){var row=[];for(var j=0;j<=N;j++){row.push(x[j]*x[j]+2*y[i]*y[i]);}z.push(row);}
var contour={x:x,y:y,z:z,type:'contour',colorscale:[[0,'rgba(59,130,246,0.05)'],[0.5,'rgba(59,130,246,0.3)'],[1,'rgba(59,130,246,0.55)']],contours:{coloring:'fill'},showscale:false,line:{color:'rgba(255,255,255,0.18)'}};
var ax=[],ay=[],au=[],av=[];
for(var i=-2;i<=2;i++){for(var j=-2;j<=2;j++){var xx=i*0.9,yy=j*0.9;var u=2*xx,v=4*yy;var n=Math.sqrt(u*u+v*v);if(n<0.01)continue;var s=0.13;ax.push(xx);ay.push(yy);au.push(xx+s*u/Math.max(n,0.5));av.push(yy+s*v/Math.max(n,0.5));}}
var arrows=[];for(var k=0;k<ax.length;k++){arrows.push({type:'line',x0:ax[k],y0:ay[k],x1:au[k],y1:av[k],line:{color:'#f59e0b',width:2}});arrows.push({type:'line',x0:au[k],y0:av[k],x1:au[k]-0.06*(au[k]-ax[k])-0.04*(av[k]-ay[k]),y1:av[k]-0.06*(av[k]-ay[k])+0.04*(au[k]-ax[k]),line:{color:'#f59e0b',width:2}});arrows.push({type:'line',x0:au[k],y0:av[k],x1:au[k]-0.06*(au[k]-ax[k])+0.04*(av[k]-ay[k]),y1:av[k]-0.06*(av[k]-ay[k])-0.04*(au[k]-ax[k]),line:{color:'#f59e0b',width:2}});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-L,L],scaleanchor:'y',scaleratio:1},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-L,L]},margin:{t:30,r:30,b:50,l:55},shapes:arrows,legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-grad-en',[contour],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">2. Divergence — How Much a Field Spreads Out</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> stand at any point in a river, draw a tiny imaginary balloon around yourself, and ask "is more water flowing out of this balloon than into it?" That excess outflow per unit volume <em>is</em> the divergence. Positive means a source (water appearing from a faucet); negative means a sink (water disappearing down a drain); zero means whatever flows in flows out (incompressible flow).</div>

<p class="l-text">For a vector field $\\mathbf{F} = (F_1, F_2, F_3)$ in three dimensions, the divergence is the scalar field</p>

<div class="calc-formula"><div class="formula-label">DIVERGENCE</div><div class="formula-main">$$\\nabla \\cdot \\mathbf{F} = \\frac{\\partial F_1}{\\partial x} + \\frac{\\partial F_2}{\\partial y} + \\frac{\\partial F_3}{\\partial z}$$</div><div class="formula-sub">A scalar field built from a vector field. Local rate of outflow per unit volume.</div></div>

<p class="l-text"><strong>Why this formula?</strong> Imagine a tiny axis-aligned box of side $\\varepsilon$ centred at $(x,y,z)$. The flux out of the right face minus the flux out of the left face is approximately $[F_1(x+\\varepsilon/2,y,z) - F_1(x-\\varepsilon/2,y,z)] \\cdot \\varepsilon^2 \\approx (\\partial F_1/\\partial x) \\varepsilon^3$ — a Taylor expansion in one variable times the face area. Doing the same on the $y$ and $z$ pairs of faces and adding everything up gives total flux out of the box $\\approx (\\nabla \\cdot \\mathbf{F}) \\varepsilon^3$. Dividing by the volume $\\varepsilon^3$ and taking $\\varepsilon \\to 0$ produces the divergence at that point. The divergence theorem in section 7 simply integrates this local statement over a whole region.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Positive divergence</div><div class="card-body">Source. Field is being created. Example: electrostatic field around a positive point charge has $\\nabla \\cdot \\mathbf{E} &gt; 0$ exactly where charge density is positive.</div></div>
<div class="calc-card"><div class="card-title">Negative divergence</div><div class="card-body">Sink. Field is being absorbed. Same example with a negative charge.</div></div>
<div class="calc-card"><div class="card-title">Zero divergence</div><div class="card-body">Incompressible / solenoidal. Magnetic fields always satisfy $\\nabla \\cdot \\mathbf{B} = 0$ — no magnetic monopoles exist. Steady incompressible fluid flow obeys the same equation.</div></div>
<div class="calc-card"><div class="card-title">Units check</div><div class="card-body">If $\\mathbf{F}$ has units of velocity (m/s), then $\\nabla \\cdot \\mathbf{F}$ has units of $\\text{s}^{-1}$ — a rate. Always do this unit check before trusting a derivation.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute the divergence of $\\mathbf{F}(x,y,z) = (x, y, z)$ (radial outward field).</strong><br><br>$\\nabla \\cdot \\mathbf{F} = \\partial x/\\partial x + \\partial y/\\partial y + \\partial z/\\partial z = 1 + 1 + 1 = 3$.<br><br>Interpretation: every point of space is a uniform source of strength 3. The field is expanding outward everywhere — like fluid flowing radially from the origin in all directions.</div></div>

<h2 class="lesson-title">3. Curl — How Much a Field Rotates</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> drop a tiny paddle wheel into a flowing river. The curl is the axis of rotation of that wheel and its magnitude is twice the angular velocity. If the wheel spins fast, the curl is large; if the flow is purely a translation (or expansion with no twist), the curl is zero.</div>

<p class="l-text">For $\\mathbf{F} = (F_1, F_2, F_3)$ in 3D, the curl is the vector field</p>

<div class="calc-formula"><div class="formula-label">CURL</div><div class="formula-main">$$\\nabla \\times \\mathbf{F} = \\left( \\frac{\\partial F_3}{\\partial y} - \\frac{\\partial F_2}{\\partial z},\\; \\frac{\\partial F_1}{\\partial z} - \\frac{\\partial F_3}{\\partial x},\\; \\frac{\\partial F_2}{\\partial x} - \\frac{\\partial F_1}{\\partial y} \\right)$$</div><div class="formula-sub">Three components, one for each axis of possible rotation. Mnemonic: write nabla and F as vectors, take their formal cross product.</div></div>

<p class="l-text">In two dimensions $\\mathbf{F} = (F_1, F_2)$ only the $z$-component survives:</p>

<div class="calc-formula"><div class="formula-label">2D SCALAR CURL</div><div class="formula-main">$$(\\nabla \\times \\mathbf{F})_z = \\frac{\\partial F_2}{\\partial x} - \\frac{\\partial F_1}{\\partial y}$$</div><div class="formula-sub">A single number per point: positive = counterclockwise spin, negative = clockwise, zero = irrotational.</div></div>

<p class="l-text"><strong>A field with non-zero curl is not the gradient of anything.</strong> Because if $\\mathbf{F} = \\nabla \\phi$ for some scalar potential $\\phi$, then $\\nabla \\times \\mathbf{F} = \\nabla \\times (\\nabla \\phi) = \\mathbf{0}$ (this is the first identity in section 4). So in conservative force fields (gravity, electrostatics in the absence of changing magnetic flux) there is no local rotation — and a closed path integral gives zero work. Curl is the obstruction to a field being a gradient.</p>

<div class="calc-graph"><div id="plot-l8-divcurl-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two model 2D fields and their classifiers. Left: radial $\\mathbf{F} = (x,y)$ with $\\nabla \\cdot \\mathbf{F} = 2$ (pure divergence, no curl) — arrows fan out from the origin. Right: rotational $\\mathbf{F} = (-y,x)$ with $\\nabla \\times \\mathbf{F} = 2$ (pure curl, no divergence) — arrows trace counterclockwise circles. Background colour encodes the scalar diagnostic.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=18,L=2;
function makeShapes(type,xoff){var sh=[];for(var i=0;i<=N;i++){for(var j=0;j<=N;j++){var xx=-L+i*2*L/N,yy=-L+j*2*L/N;var u,v;if(type==='div'){u=xx;v=yy;}else{u=-yy;v=xx;}var n=Math.sqrt(u*u+v*v);if(n<0.05)continue;var s=0.18;var x1=xx+xoff,y1=yy,x2=xx+s*u/Math.max(n,0.3)+xoff,y2=yy+s*v/Math.max(n,0.3);sh.push({type:'line',x0:x1,y0:y1,x1:x2,y1:y2,line:{color:'#3b82f6',width:1.2}});var dx=x2-x1,dy=y2-y1;sh.push({type:'line',x0:x2,y0:y2,x1:x2-0.18*dx-0.12*dy,y1:y2-0.18*dy+0.12*dx,line:{color:'#3b82f6',width:1.2}});sh.push({type:'line',x0:x2,y0:y2,x1:x2-0.18*dx+0.12*dy,y1:y2-0.18*dy-0.12*dx,line:{color:'#3b82f6',width:1.2}});}}return sh;}
var sh1=makeShapes('div',0);var sh2=makeShapes('curl',5);
var labels={x:[0,5],y:[2.4,2.4],mode:'text',text:['F = (x,y)  div = 2, curl = 0','F = (-y,x)  div = 0, curl = 2'],textfont:{color:'#f59e0b',size:13},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-L-0.5,5+L+0.5],scaleanchor:'y',scaleratio:1,showticklabels:false},yaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-L-0.5,L+0.7],showticklabels:false},margin:{t:30,r:30,b:30,l:30},shapes:sh1.concat(sh2),legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-divcurl-en',[labels],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Curl of a 2D vortex: $\\mathbf{F}(x,y) = (-y, x)$.</strong><br><br>$\\partial F_2 / \\partial x = 1$. $\\partial F_1 / \\partial y = -1$. So $(\\nabla \\times \\mathbf{F})_z = 1 - (-1) = 2$.<br><br>Interpretation: every point has the same upward curl of 2. A paddle wheel placed anywhere spins counterclockwise at angular velocity 1 (the factor of 2 in curl is the standard convention). Despite the global rotation, the divergence $\\nabla \\cdot \\mathbf{F} = 0$ — fluid is not being created or destroyed, only stirred.</div></div>

<h2 class="lesson-title">4. Vector Calculus Identities</h2>

<p class="l-text">A handful of identities recur everywhere. Memorize the first two; the rest follow.</p>

<div class="calc-formula"><div class="formula-label">FOUR ESSENTIAL IDENTITIES</div><div class="formula-main">$$\\nabla \\times (\\nabla f) = \\mathbf{0} \\qquad \\nabla \\cdot (\\nabla \\times \\mathbf{F}) = 0$$ $$\\nabla^2 f = \\nabla \\cdot (\\nabla f) \\qquad \\nabla \\times (\\nabla \\times \\mathbf{F}) = \\nabla(\\nabla \\cdot \\mathbf{F}) - \\nabla^2 \\mathbf{F}$$</div><div class="formula-sub">Curl-of-grad is zero. Div-of-curl is zero. Laplacian = div of grad. Curl-curl identity drives wave equations from Maxwell.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Curl of gradient = 0</div><div class="card-body">If $\\mathbf{F} = \\nabla \\phi$ then $\\mathbf{F}$ is irrotational. The converse holds locally on simply-connected domains: every irrotational field is locally a gradient.</div></div>
<div class="calc-card"><div class="card-title">Div of curl = 0</div><div class="card-body">If $\\mathbf{F} = \\nabla \\times \\mathbf{A}$ for some vector potential $\\mathbf{A}$, then $\\nabla \\cdot \\mathbf{F} = 0$. Used in magnetostatics to define vector potentials.</div></div>
<div class="calc-card"><div class="card-title">Laplacian</div><div class="card-body">$\\nabla^2 f = \\partial^2 f/\\partial x^2 + \\partial^2 f/\\partial y^2 + \\partial^2 f/\\partial z^2$. Heat equation, wave equation, Poisson equation, Laplace's equation — they are all built around this operator.</div></div>
<div class="calc-card"><div class="card-title">Curl-curl identity</div><div class="card-body">Plug it into Maxwell in vacuum and you get the wave equation $\\nabla^2 \\mathbf{E} = (1/c^2)\\,\\partial^2 \\mathbf{E}/\\partial t^2$ — the reason light exists.</div></div>
</div>

<p class="l-text"><strong>Proof sketch of curl(grad) = 0.</strong> The $z$-component of $\\nabla \\times \\nabla f$ is $\\partial^2 f / \\partial x \\partial y - \\partial^2 f / \\partial y \\partial x$. By Clairaut's (Schwarz's) theorem, mixed partials of a $C^2$ function are equal, so this is zero. The other two components vanish identically by the same argument. The same idea kills div-of-curl: every term cancels in pairs under Clairaut.</p>

<h2 class="lesson-title">5. Green's Theorem — Line Integral as Area Integral</h2>

<div class="calc-highlight"><strong>Picture:</strong> Green's theorem says that the total "circulation" of a vector field around the boundary of a 2D region equals the integral of curl over the interior. Walk around the edge counting your spin; you get the same answer as adding up tiny spins everywhere inside.</div>

<p class="l-text">Let $D \\subset \\mathbb{R}^2$ be a bounded region with a piecewise smooth boundary $\\partial D$ traversed counterclockwise. For functions $P(x,y)$ and $Q(x,y)$ with continuous partials on $D$:</p>

<div class="calc-formula"><div class="formula-label">GREEN'S THEOREM</div><div class="formula-main">$$\\oint_{\\partial D} \\left( P\\, dx + Q\\, dy \\right) = \\iint_D \\left( \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right) dA$$</div><div class="formula-sub">Left: a 1D line integral around the boundary. Right: a 2D area integral of the 2D scalar curl. Equal for every nice region.</div></div>

<p class="l-text"><strong>Proof sketch.</strong> Pave $D$ with a fine rectangular grid. On each grid cell $R_{ij}$ the theorem reduces to the fundamental theorem of calculus applied twice — the boundary integral around the small cell equals the local curl times its area. Now add up over all cells. Internal edges are traversed twice in opposite directions and cancel; only the outer boundary survives on the left side. The right side is just the Riemann sum for the area integral. Take the grid spacing to zero and the identity becomes exact.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Local rectangle identity</div><div class="step-detail">On a small cell, $\\oint P\\,dx + Q\\,dy = (\\partial Q/\\partial x - \\partial P/\\partial y) \\Delta x \\Delta y$ by Taylor expansion. This is single-variable FTC applied along each side.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Tile the region</div><div class="step-detail">Cover $D$ with small cells. Inside the region, every cell edge is shared with exactly one neighbour, in the opposite direction.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Internal edges cancel</div><div class="step-detail">Adding line integrals over all cells: shared edges appear with opposite sign and cancel pairwise. Only edges on the outer boundary $\\partial D$ remain.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Pass to the limit</div><div class="step-detail">The sum of local curl times area is a Riemann sum for $\\iint_D (\\partial Q/\\partial x - \\partial P/\\partial y)\\,dA$. The cancellation argument gives Green's theorem in the limit.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — AREA BY LINE INTEGRAL</div><div class="example-body"><strong>Find the area enclosed by a curve using a line integral only.</strong><br><br>Choose $P = -y/2$, $Q = x/2$. Then $\\partial Q/\\partial x - \\partial P/\\partial y = 1/2 - (-1/2) = 1$.<br>Green gives $\\text{Area}(D) = \\oint_{\\partial D} \\tfrac{1}{2}(x\\,dy - y\\,dx)$.<br><br>This is the <em>planimeter formula</em>. Mechanical planimeters in the 19th century rolled a pointer around the boundary of a map region and read off its area directly. Modern GIS systems use the same identity in software.</div></div>

<div class="l-note"><strong>Consequence:</strong> a vector field $(P,Q)$ with $\\partial Q/\\partial x = \\partial P/\\partial y$ on a simply-connected region is conservative — every line integral around a closed loop is zero, and the field is the gradient of a potential. This is the 2D test for conservativeness used throughout physics.</div>

<h2 class="lesson-title">6. Stokes' Theorem — Green Climbs into 3D</h2>

<div class="calc-highlight"><strong>Picture:</strong> Stokes' theorem promotes Green to a surface that sits anywhere in 3D space. The circulation of a vector field around the boundary loop of a surface equals the flux of its curl through the surface. The shape of the surface is irrelevant — only the boundary matters. Stretch a soap film across a wire loop in any way you like and the integral is the same.</div>

<div class="calc-formula"><div class="formula-label">STOKES' THEOREM</div><div class="formula-main">$$\\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$$</div><div class="formula-sub">Line integral around the boundary = surface integral of curl through the surface. Orientation: right-hand rule.</div></div>

<p class="l-text">When $S$ is a flat region in the $xy$-plane, Stokes reduces to Green. So Green is a special case. Stokes is genuinely 3D because the surface can curve up off the plane and the curl can have all three components.</p>

<h3 style="color:#3b82f6;margin-top:1.4rem">6.1 Maxwell's Equations — Stokes' Theorem in Disguise</h3>

<p class="l-text">Two of the four Maxwell equations exist in two equivalent forms: differential (local) and integral (global). The two forms are related by Stokes' theorem.</p>

<div class="calc-formula"><div class="formula-label">FARADAY'S LAW</div><div class="formula-main">$$\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t} \\quad \\Longleftrightarrow \\quad \\oint_{\\partial S} \\mathbf{E} \\cdot d\\mathbf{r} = -\\frac{d}{dt} \\iint_S \\mathbf{B} \\cdot d\\mathbf{S}$$</div><div class="formula-sub">The induced EMF around a loop equals minus the rate of change of magnetic flux through it. Stokes is the bridge between the two forms.</div></div>

<div class="calc-formula"><div class="formula-label">AMPERE-MAXWELL LAW</div><div class="formula-main">$$\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t} \\quad \\Longleftrightarrow \\quad \\oint_{\\partial S} \\mathbf{B} \\cdot d\\mathbf{r} = \\mu_0 I_{enc} + \\mu_0 \\varepsilon_0 \\frac{d}{dt} \\iint_S \\mathbf{E} \\cdot d\\mathbf{S}$$</div><div class="formula-sub">A current or a changing electric flux induces a circulating magnetic field. Same Stokes' bridge.</div></div>

<div class="calc-graph"><div id="plot-l8-stokes-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a hemispherical surface $S$ over the unit disk in the $xy$-plane, with its boundary $\\partial S$ — the unit circle — drawn in orange. Stokes says: integrating $\\mathbf{F} \\cdot d\\mathbf{r}$ around the orange circle equals integrating $(\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$ over the blue hemisphere. We could replace the hemisphere with any other surface having the same boundary and get the same number.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=30;var u=[],v=[],x=[],y=[],z=[];
for(var i=0;i<=N;i++){var row_x=[],row_y=[],row_z=[];for(var j=0;j<=N;j++){var ui=Math.PI/2*i/N,vj=2*Math.PI*j/N;row_x.push(Math.sin(ui)*Math.cos(vj));row_y.push(Math.sin(ui)*Math.sin(vj));row_z.push(Math.cos(ui));}x.push(row_x);y.push(row_y);z.push(row_z);}
var surf={type:'surface',x:x,y:y,z:z,colorscale:[[0,'rgba(59,130,246,0.18)'],[1,'rgba(59,130,246,0.45)']],showscale:false,opacity:0.65,name:'hemisphere S'};
var cx=[],cy=[],cz=[];for(var k=0;k<=100;k++){var t=2*Math.PI*k/100;cx.push(Math.cos(t));cy.push(Math.sin(t));cz.push(0);}
var bnd={type:'scatter3d',mode:'lines',x:cx,y:cy,z:cz,line:{color:'#f59e0b',width:6},name:'boundary partial S'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',color:'#e8e8e8'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',color:'#e8e8e8'},zaxis:{title:'z',gridcolor:'rgba(255,255,255,0.07)',color:'#e8e8e8'},camera:{eye:{x:1.3,y:1.3,z:0.9}}},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-stokes-en',[surf,bnd],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why this is a big deal.</strong> Maxwell wrote his original 20 equations as global integral statements about loops and surfaces. Heaviside rewrote them in differential form using Stokes and the divergence theorem. The 4-equation vector form everyone learns today is Heaviside's gift, and Stokes' theorem is what makes it equivalent to Maxwell's original.</div>

<h2 class="lesson-title">7. The Divergence Theorem — Gauss's Big Idea</h2>

<div class="calc-highlight"><strong>Picture:</strong> the total outward flux of a vector field through the boundary of a 3D region equals the total amount of "source" inside. If you imagine $\\mathbf{F}$ as water velocity and the region as a balloon, the divergence theorem says: water flowing out through the balloon skin equals the net source strength inside the balloon. Conservation in one line.</div>

<div class="calc-formula"><div class="formula-label">DIVERGENCE THEOREM (GAUSS)</div><div class="formula-main">$$\\iiint_V (\\nabla \\cdot \\mathbf{F})\\, dV = \\oiint_{\\partial V} \\mathbf{F} \\cdot d\\mathbf{S}$$</div><div class="formula-sub">Volume integral of divergence equals surface flux through the enclosing surface. Outward normal convention.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">7.1 Gauss's Law for Electrostatics</h3>

<p class="l-text">Apply the divergence theorem to the electric field $\\mathbf{E}$. The differential form of Gauss's law is $\\nabla \\cdot \\mathbf{E} = \\rho/\\varepsilon_0$ where $\\rho$ is the charge density. Integrating both sides over a volume $V$ and using the divergence theorem on the left:</p>

<div class="calc-formula"><div class="formula-label">GAUSS'S LAW</div><div class="formula-main">$$\\oiint_{\\partial V} \\mathbf{E} \\cdot d\\mathbf{S} = \\frac{Q_{enc}}{\\varepsilon_0}$$</div><div class="formula-sub">Total electric flux through any closed surface equals the enclosed charge divided by epsilon-zero. The result depends only on charge inside — not on its position.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — POINT CHARGE</div><div class="example-body"><strong>Use Gauss's law to recover Coulomb's law.</strong><br><br>Place a charge $Q$ at the origin. By symmetry the field is radial: $\\mathbf{E} = E(r)\\,\\hat{r}$. Choose a sphere of radius $r$ as your Gaussian surface.<br><br>Flux through the sphere: $\\oiint \\mathbf{E} \\cdot d\\mathbf{S} = E(r) \\cdot 4\\pi r^2$ (constant on the sphere, area $4\\pi r^2$).<br>Set equal to $Q/\\varepsilon_0$: $E(r) \\cdot 4\\pi r^2 = Q/\\varepsilon_0$.<br>Solve: $E(r) = Q / (4\\pi \\varepsilon_0 r^2)$ — exactly Coulomb's law.<br><br>The divergence theorem reduces three-dimensional electrostatics to one-dimensional algebra whenever symmetry is on your side.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">7.2 Continuity Equation — Conservation in Differential Form</h3>

<p class="l-text">Take any quantity with density $\\rho(\\mathbf{x},t)$ and flux $\\mathbf{J}(\\mathbf{x},t)$. If no sources or sinks exist, the amount inside any volume can only change because of flow across the boundary:</p>

<div class="calc-formula"><div class="formula-label">CONTINUITY EQUATION</div><div class="formula-main">$$\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot \\mathbf{J} = 0$$</div><div class="formula-sub">Local conservation. Applies to mass, charge, probability density, particle number — anything that can flow.</div></div>

<p class="l-text">This equation underlies fluid dynamics (mass conservation), electromagnetism (charge conservation), quantum mechanics (probability conservation through the Schrödinger equation), and even diffusion-model training in generative AI (the probability flow ODE that powers DDPM-type samplers is a continuity equation).</p>

<h2 class="lesson-title">8. The Jacobian Matrix</h2>

<p class="l-text">Move from $\\mathbf{f}: \\mathbb{R}^n \\to \\mathbb{R}^m$ — vector-in, vector-out maps. The natural derivative is the <strong>Jacobian matrix</strong>:</p>

<div class="calc-formula"><div class="formula-label">JACOBIAN MATRIX</div><div class="formula-main">$$J_{\\mathbf{f}}(\\mathbf{x}) \\in \\mathbb{R}^{m \\times n}, \\qquad (J_{\\mathbf{f}})_{ij} = \\frac{\\partial f_i}{\\partial x_j}$$</div><div class="formula-sub">Row i is the gradient of the i-th output as a function of inputs. m rows for m outputs, n columns for n inputs.</div></div>

<p class="l-text">The Jacobian is the matrix of the <em>best linear approximation</em> to $\\mathbf{f}$ at $\\mathbf{x}$:</p>

<div class="calc-formula"><div class="formula-label">FIRST-ORDER TAYLOR</div><div class="formula-main">$$\\mathbf{f}(\\mathbf{x} + \\Delta \\mathbf{x}) \\approx \\mathbf{f}(\\mathbf{x}) + J_{\\mathbf{f}}(\\mathbf{x})\\, \\Delta \\mathbf{x}$$</div><div class="formula-sub">Just like the single-variable Taylor expansion, but the slope is now a matrix.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">8.1 The Geometric Meaning — Local Area Scaling</h3>

<p class="l-text">For a map $\\mathbf{f}: \\mathbb{R}^n \\to \\mathbb{R}^n$ (square Jacobian) the absolute value of the determinant $|\\det J_{\\mathbf{f}}|$ measures the local <em>volume scaling factor</em>. A tiny cube of volume $\\varepsilon^n$ around $\\mathbf{x}$ is mapped to a parallelepiped of volume $|\\det J_{\\mathbf{f}}(\\mathbf{x})|\\, \\varepsilon^n$. This is the change-of-variables formula in multivariable integration.</p>

<div class="calc-graph"><div id="plot-l8-jac-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a uniform grid of squares in the input plane (left, blue) is pushed through the nonlinear map $\\mathbf{f}(x,y) = (x + 0.4\\,y^2,\\; y + 0.3\\,x\\,y)$ to produce a warped grid in the output plane (right, orange). Cells far from the origin shrink or stretch according to the local $|\\det J_{\\mathbf{f}}|$. Where the Jacobian is small, an entire region collapses; where it is large, areas blow up.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Lg=1.5,Ng=8;
function mkGrid(F){var lines=[];for(var i=0;i<=Ng;i++){var xs=[],ys=[];for(var j=0;j<=Ng*4;j++){var u=-Lg+i*2*Lg/Ng,v=-Lg+j*2*Lg/(Ng*4);var p=F(u,v);xs.push(p[0]);ys.push(p[1]);}lines.push({x:xs,y:ys,mode:'lines',line:{color:'rgba(255,255,255,0.32)',width:1},showlegend:false});}for(var i=0;i<=Ng;i++){var xs=[],ys=[];for(var j=0;j<=Ng*4;j++){var v=-Lg+i*2*Lg/Ng,u=-Lg+j*2*Lg/(Ng*4);var p=F(u,v);xs.push(p[0]);ys.push(p[1]);}lines.push({x:xs,y:ys,mode:'lines',line:{color:'rgba(255,255,255,0.32)',width:1},showlegend:false});}return lines;}
var grid_in=mkGrid(function(u,v){return [u-4,v];});
var grid_out=mkGrid(function(u,v){return [u+0.4*v*v+4,v+0.3*u*v];});
var labels={x:[-4,4],y:[Lg+0.5,Lg+0.5],mode:'text',text:['input grid (square cells)','output grid (deformed)'],textfont:{color:'#3b82f6',size:13},showlegend:false};
var data=grid_in.concat(grid_out).concat([labels]);
data[0].line.color='#3b82f6';data[Ng+1].line.color='#3b82f6';
for(var k=0;k<grid_in.length;k++){data[k].line.color='rgba(59,130,246,0.55)';}
for(var k=grid_in.length;k<grid_in.length+grid_out.length;k++){data[k].line.color='rgba(245,158,11,0.6)';}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-Lg-4.5,Lg+4.5],scaleanchor:'y',scaleratio:1,showticklabels:false},yaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-Lg-0.5,Lg+1],showticklabels:false},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-jac-en',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h3 style="color:#3b82f6;margin-top:1.4rem">8.2 Forward-Mode vs Reverse-Mode Autodiff</h3>

<p class="l-text">Modern deep learning frameworks (PyTorch, JAX, TensorFlow) never build the full Jacobian explicitly. For a network with millions of inputs and millions of outputs, that matrix would have trillions of entries. Instead they evaluate <em>Jacobian-vector products</em> on demand. Two flavours exist:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forward-mode (JVP)</div><div class="card-body">Compute $J_{\\mathbf{f}}(\\mathbf{x})\\, \\mathbf{v}$: how does a small input perturbation $\\mathbf{v}$ change the outputs? Costs roughly one forward pass per JVP. Best when $n \\ll m$ — few inputs, many outputs.</div></div>
<div class="calc-card"><div class="card-title">Reverse-mode (VJP)</div><div class="card-body">Compute $\\mathbf{v}^T J_{\\mathbf{f}}(\\mathbf{x})$: how does each input contribute to a weighted sum $\\mathbf{v}^T \\mathbf{f}$ of the outputs? Costs roughly one forward pass plus one backward pass. Best when $n \\gg m$ — many inputs, few outputs.</div></div>
<div class="calc-card"><div class="card-title">Backprop = reverse-mode</div><div class="card-body">In ML the loss is a single scalar ($m = 1$) and the parameters number in the millions ($n$ huge). Pick $\\mathbf{v} = 1$ in reverse-mode and you get $\\nabla_{\\mathbf{w}} L$ in one backward pass. This is exactly backpropagation.</div></div>
<div class="calc-card"><div class="card-title">Compute cost</div><div class="card-body">The full $m \\times n$ Jacobian needs $\\min(m,n)$ JVPs or VJPs. For a scalar loss, one VJP gives the gradient — fundamentally cheaper than $n$ forward-mode passes.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Jacobian of polar coordinates: $\\mathbf{f}(r, \\theta) = (r\\cos\\theta,\\, r\\sin\\theta)$.</strong><br><br>$J_{\\mathbf{f}}(r,\\theta) = \\begin{pmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{pmatrix}$.<br><br>$\\det J_{\\mathbf{f}} = r\\cos^2\\theta + r\\sin^2\\theta = r$.<br><br>This is the $r$ that appears in $dA = r\\,dr\\,d\\theta$ for polar coordinate integrals. Every change-of-variables Jacobian determinant you have ever seen is an instance of this geometric area-scaling fact.</div></div>

<h2 class="lesson-title">9. The Hessian Matrix</h2>

<p class="l-text">For a scalar field $f: \\mathbb{R}^n \\to \\mathbb{R}$ the <strong>Hessian</strong> is the matrix of second partial derivatives:</p>

<div class="calc-formula"><div class="formula-label">HESSIAN MATRIX</div><div class="formula-main">$$H_f(\\mathbf{x}) \\in \\mathbb{R}^{n \\times n}, \\qquad (H_f)_{ij} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}$$</div><div class="formula-sub">Symmetric (for C^2 functions) because mixed partials commute. Encodes local curvature in every direction.</div></div>

<div class="calc-formula"><div class="formula-label">SECOND-ORDER TAYLOR</div><div class="formula-main">$$f(\\mathbf{x} + \\Delta\\mathbf{x}) \\approx f(\\mathbf{x}) + \\nabla f(\\mathbf{x})^T \\Delta\\mathbf{x} + \\tfrac{1}{2}\\, \\Delta\\mathbf{x}^T H_f(\\mathbf{x})\\, \\Delta\\mathbf{x}$$</div><div class="formula-sub">The Hessian is the quadratic-order term. At a critical point the gradient vanishes and only the Hessian decides curvature.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">9.1 Critical Point Classification via Eigenvalues</h3>

<p class="l-text">At a critical point ($\\nabla f = \\mathbf{0}$) the local shape of $f$ is decided entirely by the eigenvalues of the Hessian:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">All eigenvalues &gt; 0</div><div class="card-body">Positive definite Hessian. Local <strong>minimum</strong>. Function curves up in every direction.</div></div>
<div class="calc-card"><div class="card-title">All eigenvalues &lt; 0</div><div class="card-body">Negative definite. Local <strong>maximum</strong>. Function curves down in every direction.</div></div>
<div class="calc-card"><div class="card-title">Mixed signs</div><div class="card-body"><strong>Saddle point</strong>. Minimum in directions of positive eigenvectors, maximum in directions of negative ones.</div></div>
<div class="calc-card"><div class="card-title">Some zero</div><div class="card-body">Test is inconclusive. Need higher derivatives or other arguments. Common in degenerate flat minima.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-hess-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two scalar surfaces near critical points. Left: $f(x,y) = x^2 + 2y^2$ has Hessian $\\text{diag}(2, 4)$ — both eigenvalues positive, so a genuine minimum (bowl shape). Right: $g(x,y) = x^2 - y^2$ has Hessian $\\text{diag}(2, -2)$ — mixed signs, so a saddle (shape of a Pringles chip). The eigenvectors of $H$ point along the principal axes of curvature.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=40,Lh=1.5;var xs=[],ys=[];for(var i=0;i<=N;i++){xs.push(-Lh+i*2*Lh/N);ys.push(-Lh+i*2*Lh/N);}
var z1=[],z2=[];for(var i=0;i<=N;i++){var r1=[],r2=[];for(var j=0;j<=N;j++){r1.push(xs[j]*xs[j]+2*ys[i]*ys[i]);r2.push(xs[j]*xs[j]-ys[i]*ys[i]);}z1.push(r1);z2.push(r2);}
var s1={type:'surface',x:xs,y:ys,z:z1,colorscale:[[0,'rgba(59,130,246,0.25)'],[1,'rgba(59,130,246,0.85)']],showscale:false,scene:'scene'};
var s2={type:'surface',x:xs.map(function(v){return v+4;}),y:ys,z:z2,colorscale:[[0,'rgba(245,158,11,0.25)'],[1,'rgba(245,158,11,0.85)']],showscale:false,scene:'scene'};
var labels={type:'scatter3d',x:[0,4],y:[Lh+0.4,Lh+0.4],z:[5.5,1.6],mode:'text',text:['minimum: x^2 + 2y^2','saddle: x^2 - y^2'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},scene:{xaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',color:'#e8e8e8'},yaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',color:'#e8e8e8'},zaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',color:'#e8e8e8'},camera:{eye:{x:1.6,y:1.6,z:1.2}}},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-hess-en',[s1,s2,labels],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h3 style="color:#3b82f6;margin-top:1.4rem">9.2 Newton's Method and Beyond</h3>

<p class="l-text">Newton's method for optimization replaces the constant-step direction $-\\nabla f$ with the curvature-aware direction $-H_f^{-1} \\nabla f$:</p>

<div class="calc-formula"><div class="formula-label">NEWTON STEP</div><div class="formula-main">$$\\mathbf{x}_{t+1} = \\mathbf{x}_t - \\eta\\, H_f(\\mathbf{x}_t)^{-1}\\, \\nabla f(\\mathbf{x}_t)$$</div><div class="formula-sub">For a quadratic function with positive-definite Hessian, one step lands at the exact minimum. For non-quadratic problems, quadratic local convergence near a minimum.</div></div>

<p class="l-text"><strong>The problem in deep learning:</strong> a model with $n = 10^9$ parameters has a Hessian with $n^2 = 10^{18}$ entries. We cannot store it, let alone invert it. Three families of practical approximations have emerged.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Diagonal Hessian (Adam, RMSProp)</div><div class="card-body">Track only the diagonal of $H$ — one number per parameter. Approximate by the running average of squared gradients. Cheap and works astonishingly well.</div></div>
<div class="calc-card"><div class="card-title">K-FAC</div><div class="card-body">Approximate each layer's Hessian block as a Kronecker product of two smaller matrices (input covariance $\\otimes$ output gradient covariance). Used in some large-scale image and language model training.</div></div>
<div class="calc-card"><div class="card-title">Shampoo / SOAP</div><div class="card-body">Per-layer preconditioners built from running statistics of left- and right-singular-value structure. Recent results (Shampoo at large scale, SOAP variants) show meaningful wall-clock improvements over Adam on transformer pretraining.</div></div>
<div class="calc-card"><div class="card-title">Gauss-Newton & NTK</div><div class="card-body">For least-squares objectives, approximate $H \\approx J^T J$ — a positive-definite, often well-conditioned matrix. This connects to the neural tangent kernel: in the wide-network limit, training dynamics are governed by a fixed $J^T J$ matrix called the NTK.</div></div>
</div>

<div class="l-note"><strong>Hessian at a saddle point.</strong> Empirical work (Dauphin et al. 2014) showed that high-dimensional non-convex losses are crowded with saddle points, not local minima. The gradient is small near a saddle, so first-order SGD slows down — but a step in the direction of the most-negative Hessian eigenvector escapes immediately. Second-order methods know about that direction; first-order methods rely on noise.</div>

<h2 class="lesson-title">10. The AI Connection in One Page</h2>

<p class="l-text">Every quantity in this lesson appears somewhere in modern deep learning, often anonymously.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gradient</div><div class="card-body">The training signal. Reverse-mode autodiff returns $\\nabla_{\\mathbf{w}} L$. Every optimizer (SGD, Adam, Adafactor, Lion) is a function from gradients to weight updates.</div></div>
<div class="calc-card"><div class="card-title">Divergence</div><div class="card-body">Continuity equations of probability flow drive diffusion models (DDPM, score-based, flow matching). The score $\\nabla_{\\mathbf{x}} \\log p$ has divergence appearing in Fokker-Planck equations.</div></div>
<div class="calc-card"><div class="card-title">Jacobian</div><div class="card-body">Normalizing flows train by maximizing $\\log p(\\mathbf{x}) = \\log p_z(f(\\mathbf{x})) + \\log |\\det J_f|$ — the change-of-variables formula evaluated layer by layer. Coupling layers were designed to make $\\det J_f$ trivial to compute.</div></div>
<div class="calc-card"><div class="card-title">Hessian</div><div class="card-body">Sharpness-Aware Minimization (SAM) penalizes large maximum Hessian eigenvalues. Loss landscapes literature (Li et al. 2018) draws Hessian eigenspectra to characterize trained networks. K-FAC, Shampoo, SOAP build on Hessian structure.</div></div>
<div class="calc-card"><div class="card-title">Curl, Stokes</div><div class="card-body">Less direct, but: Hamiltonian Monte Carlo uses divergence-free flows in phase space; symplectic integrators preserve geometric structure that Stokes formalizes. EM-style classical physics inspired some recent architecture work (Lagrangian / Hamiltonian neural networks).</div></div>
<div class="calc-card"><div class="card-title">Gauss / divergence theorem</div><div class="card-body">Energy-based models and partition functions rely on integral identities that descend from the divergence theorem. Whenever you see $\\int p(\\mathbf{x})\\,d\\mathbf{x} = 1$ as a constraint, a divergence-theorem flavoured argument is lurking.</div></div>
</div>

<div class="l-warn"><strong>Honest framing:</strong> none of these appear in a typical PyTorch training script. But the moment you ask <em>why</em> Adam works, <em>why</em> a normalizing flow's Jacobian determinant is tractable, <em>why</em> diffusion models are stable — you are reaching for vector calculus. The notation is everywhere underneath the abstractions.</div>

<h2 class="lesson-title">11. Practical Pyodide Exercise</h2>

<p class="l-text">Time to compute everything ourselves. The code block below uses NumPy and SciPy to (1) sample a 2D vector field on a grid and compute its divergence and curl numerically, (2) verify Green's theorem by comparing a line integral around a square boundary with an area integral over its interior, (3) build the Jacobian of a nonlinear map and check it against a reverse-mode autodiff estimate from finite differences, and (4) compute the Hessian of a 2D loss and classify a critical point by reading its eigenvalues. Click <strong>RUN</strong> to execute. Each block prints expected versus actual numbers so you see whether the theorem holds.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># ============================================================</span>
<span class="cm"># 1. Numerical divergence and curl of a 2D field</span>
<span class="cm"># Field: F(x,y) = (x^2 - y, x + y^2)</span>
<span class="cm"># Analytic divergence  = 2x + 2y</span>
<span class="cm"># Analytic curl (z)    = 1 - (-1) = 2</span>
<span class="cm"># ============================================================</span>
N = <span class="num">200</span>
xs = np.<span class="fn">linspace</span>(-<span class="num">2</span>, <span class="num">2</span>, N)
ys = np.<span class="fn">linspace</span>(-<span class="num">2</span>, <span class="num">2</span>, N)
X, Y = np.<span class="fn">meshgrid</span>(xs, ys, indexing=<span class="str">"ij"</span>)
F1 = X**<span class="num">2</span> - Y
F2 = X + Y**<span class="num">2</span>

dx = xs[<span class="num">1</span>] - xs[<span class="num">0</span>]
dy = ys[<span class="num">1</span>] - ys[<span class="num">0</span>]
dF1_dx = np.<span class="fn">gradient</span>(F1, dx, axis=<span class="num">0</span>)
dF2_dy = np.<span class="fn">gradient</span>(F2, dy, axis=<span class="num">1</span>)
dF2_dx = np.<span class="fn">gradient</span>(F2, dx, axis=<span class="num">0</span>)
dF1_dy = np.<span class="fn">gradient</span>(F1, dy, axis=<span class="num">1</span>)

div_F  = dF1_dx + dF2_dy
curl_F = dF2_dx - dF1_dy

i = N // <span class="num">2</span> + <span class="num">20</span>; j = N // <span class="num">2</span> + <span class="num">10</span>
<span class="fn">print</span>(<span class="str">f"At (x,y) = ({X[i,j]:.2f}, {Y[i,j]:.2f}):"</span>)
<span class="fn">print</span>(<span class="str">f"  div  (numeric) = {div_F[i,j]:.4f}    analytic 2x+2y = {2*X[i,j]+2*Y[i,j]:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"  curl (numeric) = {curl_F[i,j]:.4f}    analytic = 2.0000"</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 2. Verify Green's theorem on the unit square D = [0,1] x [0,1]</span>
<span class="cm"># P(x,y) = -y/2,  Q(x,y) = x/2   ==&gt;  curl = 1, area integral = area(D) = 1</span>
<span class="cm"># Line integral going counterclockwise should also equal 1.</span>
<span class="cm"># ============================================================</span>
<span class="kw">def</span> <span class="fn">line_int_square</span>():
    M = <span class="num">5000</span>
    t = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, M)
    <span class="cm"># bottom edge: y = 0,  x: 0 -&gt; 1</span>
    I1 = np.<span class="fn">trapz</span>(-<span class="num">0</span>*t/<span class="num">2</span>, t)        <span class="cm"># P dx</span>
    <span class="cm"># right edge:  x = 1,  y: 0 -&gt; 1</span>
    I2 = np.<span class="fn">trapz</span>(<span class="num">1</span>/<span class="num">2</span> * np.<span class="fn">ones_like</span>(t), t)   <span class="cm"># Q dy</span>
    <span class="cm"># top edge:    y = 1,  x: 1 -&gt; 0</span>
    I3 = np.<span class="fn">trapz</span>(-(-<span class="num">1</span>/<span class="num">2</span>) * np.<span class="fn">ones_like</span>(t), t)
    <span class="cm"># left edge:   x = 0,  y: 1 -&gt; 0</span>
    I4 = np.<span class="fn">trapz</span>(-(<span class="num">0</span>/<span class="num">2</span>) * np.<span class="fn">ones_like</span>(t), t)
    <span class="kw">return</span> I1 + I2 + I3 + I4

line_val = <span class="fn">line_int_square</span>()
area_val = <span class="num">1.0</span>   <span class="cm"># integral of curl 1 over unit square</span>
<span class="fn">print</span>(<span class="str">f"\\nGreen's theorem on unit square:"</span>)
<span class="fn">print</span>(<span class="str">f"  Line integral around boundary = {line_val:.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"  Area integral of curl         = {area_val:.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"  Difference (should be ~0)     = {abs(line_val-area_val):.2e}"</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 3. Jacobian of a nonlinear map. Compare analytic and finite-difference.</span>
<span class="cm"># f(x,y) = (sin(x)*cos(y), exp(x*y))</span>
<span class="cm"># ============================================================</span>
<span class="kw">def</span> <span class="fn">f_vec</span>(p):
    x, y = p
    <span class="kw">return</span> np.<span class="fn">array</span>([np.<span class="fn">sin</span>(x)*np.<span class="fn">cos</span>(y), np.<span class="fn">exp</span>(x*y)])

<span class="kw">def</span> <span class="fn">jac_analytic</span>(p):
    x, y = p
    <span class="kw">return</span> np.<span class="fn">array</span>([
        [np.<span class="fn">cos</span>(x)*np.<span class="fn">cos</span>(y), -np.<span class="fn">sin</span>(x)*np.<span class="fn">sin</span>(y)],
        [y*np.<span class="fn">exp</span>(x*y),       x*np.<span class="fn">exp</span>(x*y)]
    ])

<span class="kw">def</span> <span class="fn">jac_fd</span>(f, p, h=<span class="num">1e-6</span>):
    p = np.<span class="fn">asarray</span>(p, dtype=<span class="fn">float</span>)
    out_dim = <span class="fn">len</span>(<span class="fn">f</span>(p))
    J = np.<span class="fn">zeros</span>((out_dim, <span class="fn">len</span>(p)))
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(p)):
        ei = np.<span class="fn">zeros_like</span>(p); ei[i] = h
        J[:, i] = (<span class="fn">f</span>(p + ei) - <span class="fn">f</span>(p - ei)) / (<span class="num">2</span>*h)
    <span class="kw">return</span> J

p0 = np.<span class="fn">array</span>([<span class="num">0.5</span>, <span class="num">0.7</span>])
Ja = <span class="fn">jac_analytic</span>(p0)
Jf = <span class="fn">jac_fd</span>(f_vec, p0)
<span class="fn">print</span>(<span class="str">f"\\nJacobian at (0.5, 0.7):"</span>)
<span class="fn">print</span>(<span class="str">f"  analytic =\\n{Ja}"</span>)
<span class="fn">print</span>(<span class="str">f"  finite diff =\\n{Jf}"</span>)
<span class="fn">print</span>(<span class="str">f"  max |error| = {np.<span class="fn">abs</span>(Ja - Jf).<span class="fn">max</span>():.2e}"</span>)
<span class="fn">print</span>(<span class="str">f"  det(J) = {np.linalg.<span class="fn">det</span>(Ja):.4f}    (local area scale)"</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 4. Hessian and critical point classification.</span>
<span class="cm"># L(w1, w2) = w1^2 + 2*w1*w2 + 3*w2^2 - 4*w1 - 6*w2</span>
<span class="cm"># grad = (2 w1 + 2 w2 - 4, 2 w1 + 6 w2 - 6) = 0  ==&gt; w1=1.5, w2=0.5? let's check.</span>
<span class="cm"># Hessian = [[2, 2],[2, 6]]  eigenvalues both positive ==&gt; minimum.</span>
<span class="cm"># ============================================================</span>
<span class="kw">def</span> <span class="fn">L</span>(w):
    w1, w2 = w
    <span class="kw">return</span> w1**<span class="num">2</span> + <span class="num">2</span>*w1*w2 + <span class="num">3</span>*w2**<span class="num">2</span> - <span class="num">4</span>*w1 - <span class="num">6</span>*w2

<span class="kw">def</span> <span class="fn">grad_L</span>(w):
    w1, w2 = w
    <span class="kw">return</span> np.<span class="fn">array</span>([<span class="num">2</span>*w1 + <span class="num">2</span>*w2 - <span class="num">4</span>, <span class="num">2</span>*w1 + <span class="num">6</span>*w2 - <span class="num">6</span>])

<span class="cm"># Solve grad = 0  =&gt;  2 w1 + 2 w2 = 4,  2 w1 + 6 w2 = 6  =&gt;  w1 = 1.5,  w2 = 0.5</span>
w_star = np.linalg.<span class="fn">solve</span>([[<span class="num">2</span>, <span class="num">2</span>], [<span class="num">2</span>, <span class="num">6</span>]], [<span class="num">4</span>, <span class="num">6</span>])
<span class="fn">print</span>(<span class="str">f"\\nCritical point w* = {w_star}"</span>)
<span class="fn">print</span>(<span class="str">f"  grad at w*       = {grad_L(w_star)}  (should be ~ 0)"</span>)

H = np.<span class="fn">array</span>([[<span class="num">2</span>, <span class="num">2</span>], [<span class="num">2</span>, <span class="num">6</span>]])
eigvals = np.linalg.<span class="fn">eigvalsh</span>(H)
<span class="fn">print</span>(<span class="str">f"  Hessian = {H.<span class="fn">tolist</span>()}"</span>)
<span class="fn">print</span>(<span class="str">f"  eigenvalues = {eigvals}"</span>)
<span class="kw">if</span> np.<span class="fn">all</span>(eigvals &gt; <span class="num">0</span>):
    <span class="fn">print</span>(<span class="str">"  classification: LOCAL MINIMUM (positive definite)"</span>)
<span class="kw">elif</span> np.<span class="fn">all</span>(eigvals &lt; <span class="num">0</span>):
    <span class="fn">print</span>(<span class="str">"  classification: LOCAL MAXIMUM (negative definite)"</span>)
<span class="kw">else</span>:
    <span class="fn">print</span>(<span class="str">"  classification: SADDLE POINT (indefinite)"</span>)

<span class="cm"># Compare with a saddle-shape loss</span>
H_saddle = np.<span class="fn">array</span>([[<span class="num">2</span>, <span class="num">0</span>], [<span class="num">0</span>, -<span class="num">3</span>]])
ev_saddle = np.linalg.<span class="fn">eigvalsh</span>(H_saddle)
<span class="fn">print</span>(<span class="str">f"\\nSaddle Hessian eigenvalues = {ev_saddle}  ==&gt; SADDLE"</span>)</code></pre></div>

<p class="l-text"><strong>Things to try.</strong> Replace the field in block 1 with the rotational field $(-y, x)$ and confirm $\\nabla \\cdot \\mathbf{F} = 0$ and $\\nabla \\times \\mathbf{F} = 2$. In block 2, change $P$ and $Q$ to non-conservative choices like $P = x y$, $Q = x^2$ and watch the line and area integrals come out to non-zero — but still equal. In block 3 try $\\mathbf{f}(x,y) = (e^x + y, x \\sin y)$ and watch the Jacobian determinant change sign across $y = \\pi$. In block 4 modify the Hessian to $\\begin{pmatrix} 2 & 5 \\\\ 5 & 1 \\end{pmatrix}$ — eigenvalues become $\\approx \\{6.1, -3.1\\}$ and the classifier reports a saddle.</p>

<h2 class="lesson-title">Summary</h2>

<p class="l-text">Vector calculus extends single-variable derivatives and integrals to scalar and vector fields on $\\mathbb{R}^n$. The gradient turns scalar fields into vector fields and points in the direction of steepest ascent. The divergence converts vector fields back into scalars and measures local sources or sinks. The curl is a vector measuring local rotation. Three integral theorems — Green in 2D, Stokes on surfaces, divergence in 3D volumes — relate boundary integrals to interior integrals and are the backbone of the differential form of Maxwell's equations, of Gauss's law, and of conservation in fluid dynamics. The Jacobian is the matrix derivative of a vector-valued map and its determinant is the local volume scaling factor; reverse-mode evaluation of Jacobian-vector products is what backpropagation does. The Hessian is the matrix of second partial derivatives; its eigenvalues classify critical points as minima, maxima, or saddles, and approximate Hessians power second-order optimizers (K-FAC, Shampoo, Gauss-Newton, neural tangent kernel analyses) in modern deep learning. With this lesson the calculus track ends; you now own the entire language a continuous-mathematics-aware ML researcher uses to reason about training, generalization, and architectures.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Vektör analizi fiziğin grameri ve modern derin öğrenmenin sessizce ödünç aldığı lehçedir.</strong> Tek değişkenli kalkülüs bir skalerin nasıl değiştiğini söyler; vektör analizi ise tüm bir alanın — bir akışkanın hız alanının, bir elektromanyetik dalganın, milyon parametreli bir kayıp manzarasının — her yerde aynı anda nasıl değiştiğini söyler. Üç türev operatörü (gradyan, diverjans, rotasyonel), üç integral teoremi (Green, Stokes, diverjans) ve iki matris (Jacobian, Hessian) hemen hemen tüm yükü taşır.</p>

<p class="l-text">Bu ders zamanını eşit olarak klasik ile modern arasında bölüyor. Bir küvette rotasyoneli çizecek ve bir kürek çarkını döndürmesini izleyeceğiz; Maxwell denklemlerini integral formunda okuyacak ve her birinin kalbinde Stokes teoremini fark edeceğiz. Sonra makine öğrenmesine döneceğiz: Jacobian, ters mod otomatik türevin (backprop'un motoru) sessizce çalıştırır; Hessian, kritik noktanın gerçek minimum mu yoksa aldatıcı bir eyer mi olduğuna karar verir; K-FAC ve Shampoo gibi yaklaşımlar bu fikirler üzerine pratik ikinci dereceden optimizatörler kurar.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE OGRENECEKSIN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Iki ve uc boyutta gradyan, diverjans ve rotasyoneli hesaplamak ve geometrik anlamlarini okumak</li>
<li>Green teoreminin temiz bir ispat taslagini cikarmak ve cizgi integralleri ile planimetre tarzi alan formullerinde kullanmak</li>
<li>Stokes ve diverjans teoremlerini ifade etmek; Maxwell denklemleri ile Gauss yasasi icinde tanimak</li>
<li>Bir dogrusal-olmayan donusumun Jacobian'ini insa etmek ve ileri-mod ile ters-mod otomatik turevi aciklamak</li>
<li>Bir Hessian'in ozdegerlerini okuyarak kritik noktayi minimum, maksimum ya da eyer olarak siniflamak</li>
<li>Modern fikirleri (K-FAC, Shampoo, Gauss-Newton, neural tangent kernel) Jacobian ve Hessian yapisina baglamak</li>
</ul>
</div>

<h2 class="lesson-title">1. Hatirlatma: Gradyan</h2>

<p class="l-text">Skaler alanin $f: \\mathbb{R}^n \\to \\mathbb{R}$ <strong>gradyani</strong> kismi turevlerin vektorudur:</p>

<div class="calc-formula"><div class="formula-label">GRADYAN</div><div class="formula-main">$$\\nabla f(\\mathbf{x}) = \\left( \\frac{\\partial f}{\\partial x_1},\\, \\frac{\\partial f}{\\partial x_2},\\, \\dots,\\, \\frac{\\partial f}{\\partial x_n} \\right)$$</div><div class="formula-sub">Bir skaler alandan kurulmus bir vektor alani. Girisle ayni uzayda yasar.</div></div>

<p class="l-text">Hic dusunmeden ezberleyebileceginiz uc gercek. (1) $\\nabla f$ $f$ icin <strong>en dik artis</strong> yonune isaret eder. (2) Buyuklugu $\\|\\nabla f\\|$ o noktadaki maksimum yonlu turev degerine esittir. (3) $\\nabla f$ her zaman <strong>seviye kumelerine</strong> $\\{f = c\\}$ <strong>diktir</strong>. Ilk gercek gradyan inisinin neden calistigi, ucuncusu Lagrange carpanlariyla kisitli optimizasyonun neden calistigi sorularinin yanitidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Skaler giris, vektor cikis</div><div class="card-body">Bir skaler alan al; bilesen bilesen turev al. Cikti, her giris boyutuna bir tane olmak uzere $n$ bilesenli bir vektor.</div></div>
<div class="calc-card"><div class="card-title">En dik artis</div><div class="card-body">Hicbir birim yon $\\nabla f / \\|\\nabla f\\|$'den daha buyuk bir birinci-mertebe artis vermez.</div></div>
<div class="calc-card"><div class="card-title">Seviye kumelerine dik</div><div class="card-body">Eger $f(\\mathbf{x}(t)) = c$ sabitse, turev alinca $\\nabla f \\cdot \\mathbf{x}'(t) = 0$ — gradyan, seviye kumesindeki herhangi bir egrinin tegetine diktir.</div></div>
<div class="calc-card"><div class="card-title">ML'de gorunum</div><div class="card-body">Kayip $L(\\mathbf{w})$, parametre uzayindaki bir skaler alandir. SGD mevcut batch'te $-\\nabla L$'yi hesaplar ve o yonde adim atar. Gradyan, tum egitim sinyalidir.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-grad-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafikte gorunenler:</strong> Skaler alan $f(x,y) = x^2 + 2y^2$ doldurulmus kontur olarak, gradyan alani $\\nabla f = (2x, 4y)$ ise oklarla cizilmis. Her ok, dokundugu kontur cizgisine diktir — tam o diklik ozelligi. Oklar merkeze yaklastikca kisalir cunku alan orada daha az diktir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=40,L=2.2;var x=[],y=[];for(var i=0;i<=N;i++){x.push(-L+i*2*L/N);y.push(-L+i*2*L/N);}
var z=[];for(var i=0;i<=N;i++){var row=[];for(var j=0;j<=N;j++){row.push(x[j]*x[j]+2*y[i]*y[i]);}z.push(row);}
var contour={x:x,y:y,z:z,type:'contour',colorscale:[[0,'rgba(59,130,246,0.05)'],[0.5,'rgba(59,130,246,0.3)'],[1,'rgba(59,130,246,0.55)']],contours:{coloring:'fill'},showscale:false,line:{color:'rgba(255,255,255,0.18)'}};
var ax=[],ay=[],au=[],av=[];
for(var i=-2;i<=2;i++){for(var j=-2;j<=2;j++){var xx=i*0.9,yy=j*0.9;var u=2*xx,v=4*yy;var n=Math.sqrt(u*u+v*v);if(n<0.01)continue;var s=0.13;ax.push(xx);ay.push(yy);au.push(xx+s*u/Math.max(n,0.5));av.push(yy+s*v/Math.max(n,0.5));}}
var arrows=[];for(var k=0;k<ax.length;k++){arrows.push({type:'line',x0:ax[k],y0:ay[k],x1:au[k],y1:av[k],line:{color:'#f59e0b',width:2}});arrows.push({type:'line',x0:au[k],y0:av[k],x1:au[k]-0.06*(au[k]-ax[k])-0.04*(av[k]-ay[k]),y1:av[k]-0.06*(av[k]-ay[k])+0.04*(au[k]-ax[k]),line:{color:'#f59e0b',width:2}});arrows.push({type:'line',x0:au[k],y0:av[k],x1:au[k]-0.06*(au[k]-ax[k])+0.04*(av[k]-ay[k]),y1:av[k]-0.06*(av[k]-ay[k])-0.04*(au[k]-ax[k]),line:{color:'#f59e0b',width:2}});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-L,L],scaleanchor:'y',scaleratio:1},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-L,L]},margin:{t:30,r:30,b:50,l:55},shapes:arrows,legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-grad-tr',[contour],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">2. Diverjans — Bir Alan Ne Kadar Yayilir</h2>

<div class="calc-highlight"><strong>Gunluk benzetme:</strong> Akan bir nehirde herhangi bir noktada durun, kendi etrafiniza minik hayali bir balon cizin ve sorun: "bu balondan ice giren sudan daha fazla su mu disari cikiyor?" Iste o birim hacme dusen fazla disari akis <em>diverjanstir</em>. Pozitif olmasi kaynak demek (musluktan akan su); negatif olmasi batak demek (gidere kacan su); sifir olmasi ise giren her seyin ciktigi anlamina gelir (sikistirilamaz akis).</div>

<p class="l-text">Uc boyutta $\\mathbf{F} = (F_1, F_2, F_3)$ vektor alani icin diverjans bir skaler alandir:</p>

<div class="calc-formula"><div class="formula-label">DIVERJANS</div><div class="formula-main">$$\\nabla \\cdot \\mathbf{F} = \\frac{\\partial F_1}{\\partial x} + \\frac{\\partial F_2}{\\partial y} + \\frac{\\partial F_3}{\\partial z}$$</div><div class="formula-sub">Bir vektor alanindan kurulmus skaler alan. Birim hacim basina yerel disari akis hizi.</div></div>

<p class="l-text"><strong>Neden bu formul?</strong> $(x,y,z)$ merkezli, kenari $\\varepsilon$ olan minik bir eksen-hizali kutu hayal edin. Sag yuzden cikan akis eksi sol yuzden cikan akis, yaklasik olarak $[F_1(x+\\varepsilon/2,y,z) - F_1(x-\\varepsilon/2,y,z)] \\cdot \\varepsilon^2 \\approx (\\partial F_1/\\partial x) \\varepsilon^3$ — tek degiskenli Taylor acilimi carpi yuz alani. Ayni seyi $y$ ve $z$ yuz ciftleri icin yapip topladiginizda kutudan cikan toplam akis $\\approx (\\nabla \\cdot \\mathbf{F}) \\varepsilon^3$ olur. $\\varepsilon^3$ hacmine bolup $\\varepsilon \\to 0$ aldiginizda o noktadaki diverjans elinizdedir. Bolum 7'deki diverjans teoremi bu yerel ifadenin tum bolge uzerinde integralini almaktan ibarettir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pozitif diverjans</div><div class="card-body">Kaynak. Alan yaratiliyor. Ornek: pozitif bir nokta yukunun etrafindaki elektrostatik alan, yuk yogunlugunun pozitif oldugu yerde $\\nabla \\cdot \\mathbf{E} &gt; 0$ saglar.</div></div>
<div class="calc-card"><div class="card-title">Negatif diverjans</div><div class="card-body">Batak. Alan emiliyor. Ayni ornek negatif yukle.</div></div>
<div class="calc-card"><div class="card-title">Sifir diverjans</div><div class="card-body">Sikistirilamaz / solenoidal. Manyetik alanlar daima $\\nabla \\cdot \\mathbf{B} = 0$ saglar — manyetik tek kutuplar yoktur. Karali sikistirilamaz akiskan akisi da ayni denklemi takip eder.</div></div>
<div class="calc-card"><div class="card-title">Birim kontrolu</div><div class="card-body">$\\mathbf{F}$ hiz birimindeyse (m/s), $\\nabla \\cdot \\mathbf{F}$ birimi $\\text{s}^{-1}$ olur — bir hiz. Bir turev guvenmeden once bu birim kontrolunu yapin.</div></div>
</div>

<div class="calc-example"><div class="example-label">ORNEK CALISMA</div><div class="example-body"><strong>$\\mathbf{F}(x,y,z) = (x, y, z)$ (radyal disari alan) icin diverjansi hesaplayin.</strong><br><br>$\\nabla \\cdot \\mathbf{F} = \\partial x/\\partial x + \\partial y/\\partial y + \\partial z/\\partial z = 1 + 1 + 1 = 3$.<br><br>Yorum: uzayin her noktasi 3 siddetinde duzgun bir kaynaktir. Alan her yerde disa dogru genisliyor — sanki bir kaynaktan tum yonlere radyal akan akiskan gibi.</div></div>

<h2 class="lesson-title">3. Rotasyonel — Bir Alan Ne Kadar Doner</h2>

<div class="calc-highlight"><strong>Gunluk benzetme:</strong> Akan bir nehre kucucuk bir kurek carki birakin. Rotasyonel, o carkin donme eksenidir ve buyuklugu acisal hizin iki katidir. Cark hizli donuyorsa rotasyonel buyuktur; akis sirf otelemeyse (ya da bukulmesiz genislemeyse) rotasyonel sifirdir.</div>

<p class="l-text">3D'de $\\mathbf{F} = (F_1, F_2, F_3)$ icin rotasyonel bir vektor alanidir:</p>

<div class="calc-formula"><div class="formula-label">ROTASYONEL</div><div class="formula-main">$$\\nabla \\times \\mathbf{F} = \\left( \\frac{\\partial F_3}{\\partial y} - \\frac{\\partial F_2}{\\partial z},\\; \\frac{\\partial F_1}{\\partial z} - \\frac{\\partial F_3}{\\partial x},\\; \\frac{\\partial F_2}{\\partial x} - \\frac{\\partial F_1}{\\partial y} \\right)$$</div><div class="formula-sub">Olasi her donme ekseni icin bir bilesen olmak uzere uc bilesen. Hatirlama yontemi: nabla'yi ve F'yi vektor olarak yazip vektorel carpimlarini alin.</div></div>

<p class="l-text">Iki boyutta $\\mathbf{F} = (F_1, F_2)$ icin sadece $z$ bileseni sag kalir:</p>

<div class="calc-formula"><div class="formula-label">2D SKALER ROTASYONEL</div><div class="formula-main">$$(\\nabla \\times \\mathbf{F})_z = \\frac{\\partial F_2}{\\partial x} - \\frac{\\partial F_1}{\\partial y}$$</div><div class="formula-sub">Nokta basi tek bir sayi: pozitif = saat yonunun tersi, negatif = saat yonu, sifir = rotasyonsuz.</div></div>

<p class="l-text"><strong>Sifirdan farkli rotasyonelli bir alan hicbir seyin gradyani degildir.</strong> Cunku $\\mathbf{F} = \\nabla \\phi$ olacak sekilde bir skaler potansiyel $\\phi$ varsa, $\\nabla \\times \\mathbf{F} = \\nabla \\times (\\nabla \\phi) = \\mathbf{0}$ olur (bu, bolum 4'teki ilk ozdesliktir). Yani korunumlu kuvvet alanlarinda (kutle cekim, manyetik akinin degismedigi durumda elektrostatik) yerel donme yoktur — ve kapali yol integrali sifir is verir. Rotasyonel, bir alanin gradyan olmasinin onundeki engeldir.</p>

<div class="calc-graph"><div id="plot-l8-divcurl-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafikte gorunenler:</strong> Iki model 2D alan ve siniflandiricilari. Sol: radyal $\\mathbf{F} = (x,y)$ ile $\\nabla \\cdot \\mathbf{F} = 2$ (saf diverjans, rotasyonel yok) — oklar merkezden disa yayiliyor. Sag: rotasyonel $\\mathbf{F} = (-y,x)$ ile $\\nabla \\times \\mathbf{F} = 2$ (saf rotasyonel, diverjans yok) — oklar saat yonunun tersine cember ciziyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=18,L=2;
function makeShapes(type,xoff){var sh=[];for(var i=0;i<=N;i++){for(var j=0;j<=N;j++){var xx=-L+i*2*L/N,yy=-L+j*2*L/N;var u,v;if(type==='div'){u=xx;v=yy;}else{u=-yy;v=xx;}var n=Math.sqrt(u*u+v*v);if(n<0.05)continue;var s=0.18;var x1=xx+xoff,y1=yy,x2=xx+s*u/Math.max(n,0.3)+xoff,y2=yy+s*v/Math.max(n,0.3);sh.push({type:'line',x0:x1,y0:y1,x1:x2,y1:y2,line:{color:'#3b82f6',width:1.2}});var dx=x2-x1,dy=y2-y1;sh.push({type:'line',x0:x2,y0:y2,x1:x2-0.18*dx-0.12*dy,y1:y2-0.18*dy+0.12*dx,line:{color:'#3b82f6',width:1.2}});sh.push({type:'line',x0:x2,y0:y2,x1:x2-0.18*dx+0.12*dy,y1:y2-0.18*dy-0.12*dx,line:{color:'#3b82f6',width:1.2}});}}return sh;}
var sh1=makeShapes('div',0);var sh2=makeShapes('curl',5);
var labels={x:[0,5],y:[2.4,2.4],mode:'text',text:['F = (x,y)  div = 2, curl = 0','F = (-y,x)  div = 0, curl = 2'],textfont:{color:'#f59e0b',size:13},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-L-0.5,5+L+0.5],scaleanchor:'y',scaleratio:1,showticklabels:false},yaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-L-0.5,L+0.7],showticklabels:false},margin:{t:30,r:30,b:30,l:30},shapes:sh1.concat(sh2),legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-divcurl-tr',[labels],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ORNEK CALISMA</div><div class="example-body"><strong>2D girdap rotasyoneli: $\\mathbf{F}(x,y) = (-y, x)$.</strong><br><br>$\\partial F_2 / \\partial x = 1$. $\\partial F_1 / \\partial y = -1$. Yani $(\\nabla \\times \\mathbf{F})_z = 1 - (-1) = 2$.<br><br>Yorum: her noktada ayni yukari yonlu 2 rotasyoneli var. Yerlestirilen herhangi bir kurek carki saat yonunun tersine 1 acisal hizla doner (rotasyoneldeki 2 faktoru standart bir kuraldir). Genel donmeye ragmen diverjans $\\nabla \\cdot \\mathbf{F} = 0$ — akiskan yaratilmiyor ya da yok edilmiyor, sadece karistiriliyor.</div></div>

<h2 class="lesson-title">4. Vektor Analizi Ozdeslikleri</h2>

<p class="l-text">Birkac ozdeslik her yerde tekrar tekrar karsiniza cikar. Ilk ikisini ezberleyin; gerisi onlardan turer.</p>

<div class="calc-formula"><div class="formula-label">DORT TEMEL OZDESLIK</div><div class="formula-main">$$\\nabla \\times (\\nabla f) = \\mathbf{0} \\qquad \\nabla \\cdot (\\nabla \\times \\mathbf{F}) = 0$$ $$\\nabla^2 f = \\nabla \\cdot (\\nabla f) \\qquad \\nabla \\times (\\nabla \\times \\mathbf{F}) = \\nabla(\\nabla \\cdot \\mathbf{F}) - \\nabla^2 \\mathbf{F}$$</div><div class="formula-sub">Gradyanin rotasyoneli sifir. Rotasyonelin diverjansi sifir. Laplasiyen = gradyanin diverjansi. Rotasyonel-rotasyonel ozdesligi Maxwell'den dalga denklemini cikarir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gradyanin rotasyoneli = 0</div><div class="card-body">Eger $\\mathbf{F} = \\nabla \\phi$ ise $\\mathbf{F}$ rotasyonsuzdur. Tersi yerel olarak baglantili bolgelerde dogrudur: her rotasyonsuz alan yerel olarak bir gradyandir.</div></div>
<div class="calc-card"><div class="card-title">Rotasyonelin diverjansi = 0</div><div class="card-body">Eger bir vektor potansiyeli $\\mathbf{A}$ icin $\\mathbf{F} = \\nabla \\times \\mathbf{A}$ ise, $\\nabla \\cdot \\mathbf{F} = 0$. Manyetostatikte vektor potansiyellerini tanimlamak icin kullanilir.</div></div>
<div class="calc-card"><div class="card-title">Laplasiyen</div><div class="card-body">$\\nabla^2 f = \\partial^2 f/\\partial x^2 + \\partial^2 f/\\partial y^2 + \\partial^2 f/\\partial z^2$. Isi denklemi, dalga denklemi, Poisson, Laplace — hepsi bu operator etrafinda kurulur.</div></div>
<div class="calc-card"><div class="card-title">Rotasyonel-rotasyonel ozdesligi</div><div class="card-body">Vakumdaki Maxwell'e koyun ve dalga denklemini elde edin: $\\nabla^2 \\mathbf{E} = (1/c^2)\\,\\partial^2 \\mathbf{E}/\\partial t^2$ — isigin var olma nedeni.</div></div>
</div>

<p class="l-text"><strong>curl(grad) = 0'in ispat taslagi.</strong> $\\nabla \\times \\nabla f$'nin $z$ bileseni $\\partial^2 f / \\partial x \\partial y - \\partial^2 f / \\partial y \\partial x$'dir. Clairaut (Schwarz) teoremine gore $C^2$ fonksiyonlarda karisik kismi turevler esittir, yani bu sifirdir. Diger iki bilesen ayni argumanla zaten ozdes olarak sifirdir. Ayni fikir div(curl)'u oldurur: her terim Clairaut altinda ciftler halinde birbirini goturur.</p>

<h2 class="lesson-title">5. Green Teoremi — Cizgi Integrali Alan Integrali Olarak</h2>

<div class="calc-highlight"><strong>Resim:</strong> Green teoremi, bir 2D bolgenin sinirindaki bir vektor alaninin toplam "dolasiminin" ic kismindaki rotasyonel integraline esit oldugunu soyler. Kenari boyunca yuruyun, donmenizi sayin; icindeki kucuk donmeleri toplamakla ayni cevabi alirsiniz.</div>

<p class="l-text">$D \\subset \\mathbb{R}^2$ sinirinin $\\partial D$ saat yonunun tersine kat edildigi parcali duzgun bir bolge olsun. $D$'de surekli kismi turevleri olan $P(x,y)$ ve $Q(x,y)$ icin:</p>

<div class="calc-formula"><div class="formula-label">GREEN TEOREMI</div><div class="formula-main">$$\\oint_{\\partial D} \\left( P\\, dx + Q\\, dy \\right) = \\iint_D \\left( \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right) dA$$</div><div class="formula-sub">Sol: 1D cizgi integrali. Sag: 2D rotasyonel skaler alan integrali. Her duzgun bolge icin esittir.</div></div>

<p class="l-text"><strong>Ispat taslagi.</strong> $D$'yi ince bir dikdortgen izgara ile dose. Her izgara hucresi $R_{ij}$'de teorem, kalkulusun temel teoreminin iki kez uygulanmasina indirgenir — kucuk hucrenin etrafindaki sinir integrali yerel rotasyonel carpi alanina esittir. Simdi tum hucreler uzerinde topla. Ic kenarlar ters yonde iki kez kat edilir ve sifirlanir; sol tarafta sadece dis sinir kalir. Sag taraf, alan integrali icin Riemann toplamidir. Izgara aralarini sifira goturdugunde esitlik tam olur.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Yerel dikdortgen ozdesligi</div><div class="step-detail">Kucuk bir hucrede $\\oint P\\,dx + Q\\,dy = (\\partial Q/\\partial x - \\partial P/\\partial y) \\Delta x \\Delta y$ — her kenar boyunca uygulanan tek degiskenli kalkulus teoremi.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Bolgeyi dose</div><div class="step-detail">$D$'yi kucuk hucrelerle ort. Bolge icinde her hucre kenari bir komsusuyla — ters yonde — paylasilir.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Ic kenarlar sifirlanir</div><div class="step-detail">Tum hucreler uzerinde cizgi integrallerini toplarken: paylasilan kenarlar zit isaretle gelir ve birbirini cifter cifter goturur. Sadece dis sinir $\\partial D$ uzerindekiler kalir.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Limit al</div><div class="step-detail">Yerel rotasyonel carpi alanin toplami, $\\iint_D (\\partial Q/\\partial x - \\partial P/\\partial y)\\,dA$ icin bir Riemann toplamidir. Iptal argumani limitte Green teoremini verir.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">ORNEK CALISMA — CIZGI INTEGRALIYLE ALAN</div><div class="example-body"><strong>Sadece bir cizgi integraliyle bir egrinin cevrelendigi alani bulun.</strong><br><br>$P = -y/2$, $Q = x/2$ secin. O zaman $\\partial Q/\\partial x - \\partial P/\\partial y = 1/2 - (-1/2) = 1$.<br>Green verir: $\\text{Alan}(D) = \\oint_{\\partial D} \\tfrac{1}{2}(x\\,dy - y\\,dx)$.<br><br>Bu, <em>planimetre formuludur</em>. 19. yuzyilda mekanik planimetreler bir haritadaki bir bolgenin etrafinda gosterici dondurur ve alanini dogrudan okurdu. Modern CBS sistemleri yazilimda ayni ozdesligi kullanir.</div></div>

<div class="l-note"><strong>Sonuc:</strong> Basit baglantili bir bolgede $(P,Q)$ icin $\\partial Q/\\partial x = \\partial P/\\partial y$ saglaniyorsa alan korunumludur — her kapali halka uzerindeki cizgi integrali sifirdir ve alan bir potansiyelin gradyanidir. Bu, fizigin her yerinde kullanilan 2D korunumluluk testidir.</div>

<h2 class="lesson-title">6. Stokes Teoremi — Green 3D'ye Cikiyor</h2>

<div class="calc-highlight"><strong>Resim:</strong> Stokes teoremi Green'i 3D uzayda her yere yerlesebilen bir yuzeye terfi ettirir. Bir yuzeyin sinir halkasi etrafindaki vektor alaninin dolasimi, rotasyonelinin yuzey boyunca akisina esittir. Yuzeyin sekli onemsizdir — sadece sinir onemlidir. Bir tel halka uzerine bir sabun filmi istediginiz gibi gerin ve integral hep ayni cikar.</div>

<div class="calc-formula"><div class="formula-label">STOKES TEOREMI</div><div class="formula-main">$$\\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$$</div><div class="formula-sub">Sinirdaki cizgi integrali = rotasyonelin yuzey integrali. Yonelim: sag-el kurali.</div></div>

<p class="l-text">$S$ $xy$ duzleminde duz bir bolge oldugunda Stokes Green'e indirgenir. Yani Green ozel bir durumdur. Stokes gercekten 3D'dir cunku yuzey duzlemden yukari kivrilabilir ve rotasyonelin uc bileseni de olabilir.</p>

<h3 style="color:#3b82f6;margin-top:1.4rem">6.1 Maxwell Denklemleri — Stokes Teoremi Maskeli</h3>

<p class="l-text">Dort Maxwell denkleminden ikisi iki esdeger formda bulunur: diferansiyel (yerel) ve integral (global). Iki form Stokes teoremiyle birbirine baglanir.</p>

<div class="calc-formula"><div class="formula-label">FARADAY YASASI</div><div class="formula-main">$$\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t} \\quad \\Longleftrightarrow \\quad \\oint_{\\partial S} \\mathbf{E} \\cdot d\\mathbf{r} = -\\frac{d}{dt} \\iint_S \\mathbf{B} \\cdot d\\mathbf{S}$$</div><div class="formula-sub">Bir halkada indukledigi emk, icinden gecen manyetik akinin degisim hizinin negatifine esittir. Stokes iki form arasindaki koprudur.</div></div>

<div class="calc-formula"><div class="formula-label">AMPERE-MAXWELL YASASI</div><div class="formula-main">$$\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t} \\quad \\Longleftrightarrow \\quad \\oint_{\\partial S} \\mathbf{B} \\cdot d\\mathbf{r} = \\mu_0 I_{ic} + \\mu_0 \\varepsilon_0 \\frac{d}{dt} \\iint_S \\mathbf{E} \\cdot d\\mathbf{S}$$</div><div class="formula-sub">Bir akim ya da degisen elektrik akisi, donen bir manyetik alan ureti. Ayni Stokes koprusu.</div></div>

<div class="calc-graph"><div id="plot-l8-stokes-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafikte gorunenler:</strong> $xy$ duzlemindeki birim disk uzerine bir yarikure yuzeyi $S$, siniri $\\partial S$ — birim cember — turuncu cizilmis. Stokes der ki: turuncu cember etrafinda $\\mathbf{F} \\cdot d\\mathbf{r}$ integrali, mavi yarikure uzerindeki $(\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$ integraline esittir. Yarikureyi ayni siniri olan baska bir yuzeyle degistirebilir ve ayni sayiyi elde edebiliriz.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=30;var x=[],y=[],z=[];
for(var i=0;i<=N;i++){var row_x=[],row_y=[],row_z=[];for(var j=0;j<=N;j++){var ui=Math.PI/2*i/N,vj=2*Math.PI*j/N;row_x.push(Math.sin(ui)*Math.cos(vj));row_y.push(Math.sin(ui)*Math.sin(vj));row_z.push(Math.cos(ui));}x.push(row_x);y.push(row_y);z.push(row_z);}
var surf={type:'surface',x:x,y:y,z:z,colorscale:[[0,'rgba(59,130,246,0.18)'],[1,'rgba(59,130,246,0.45)']],showscale:false,opacity:0.65,name:'yarikure S'};
var cx=[],cy=[],cz=[];for(var k=0;k<=100;k++){var t=2*Math.PI*k/100;cx.push(Math.cos(t));cy.push(Math.sin(t));cz.push(0);}
var bnd={type:'scatter3d',mode:'lines',x:cx,y:cy,z:cz,line:{color:'#f59e0b',width:6},name:'sinir partial S'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',color:'#e8e8e8'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',color:'#e8e8e8'},zaxis:{title:'z',gridcolor:'rgba(255,255,255,0.07)',color:'#e8e8e8'},camera:{eye:{x:1.3,y:1.3,z:0.9}}},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-stokes-tr',[surf,bnd],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Neden onemli.</strong> Maxwell ozgun 20 denklemini halkalar ve yuzeyler hakkinda global integral ifadeleri olarak yazdi. Heaviside bunlari Stokes ve diverjans teoremi kullanarak diferansiyel forma yeniden yazdi. Bugun herkesin ogrendigi 4-denklem vektor formu Heaviside'in armaganidir; Stokes teoremi de Maxwell'in ozgun formuyla esdeger olmasini saglar.</div>

<h2 class="lesson-title">7. Diverjans Teoremi — Gauss'un Buyuk Fikri</h2>

<div class="calc-highlight"><strong>Resim:</strong> Bir 3D bolgenin sinirindan akan toplam disari akis, icindeki toplam "kaynak" miktarina esittir. $\\mathbf{F}$'yi su hizi, bolgeyi balon olarak hayal edin; diverjans teoremi der ki: balon zarindan disari akan su, balon icindeki net kaynak siddetine esittir. Tek satirda korunum.</div>

<div class="calc-formula"><div class="formula-label">DIVERJANS TEOREMI (GAUSS)</div><div class="formula-main">$$\\iiint_V (\\nabla \\cdot \\mathbf{F})\\, dV = \\oiint_{\\partial V} \\mathbf{F} \\cdot d\\mathbf{S}$$</div><div class="formula-sub">Diverjansin hacim integrali, cevreleyen yuzeydeki akiya esittir. Disari normal konvansiyonu.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">7.1 Elektrostatik icin Gauss Yasasi</h3>

<p class="l-text">Diverjans teoremini elektrik alani $\\mathbf{E}$'ye uygula. Gauss yasasinin diferansiyel formu $\\nabla \\cdot \\mathbf{E} = \\rho/\\varepsilon_0$'dir; burada $\\rho$ yuk yogunlugudur. Her iki tarafi $V$ hacmi uzerinde integralle ve sol tarafta diverjans teoremini kullan:</p>

<div class="calc-formula"><div class="formula-label">GAUSS YASASI</div><div class="formula-main">$$\\oiint_{\\partial V} \\mathbf{E} \\cdot d\\mathbf{S} = \\frac{Q_{ic}}{\\varepsilon_0}$$</div><div class="formula-sub">Herhangi bir kapali yuzeyden gecen toplam elektrik akisi, icindeki yuke bolu epsilon-sifira esittir. Sonuc yalnizca icteki yuke baglidir — konumuna degil.</div></div>

<div class="calc-example"><div class="example-label">ORNEK CALISMA — NOKTA YUKU</div><div class="example-body"><strong>Coulomb yasasini Gauss yasasindan turetin.</strong><br><br>Merkeze $Q$ yuku koy. Simetri geregi alan radyaldir: $\\mathbf{E} = E(r)\\,\\hat{r}$. Gauss yuzeyi olarak $r$ yaricapli bir kure sec.<br><br>Kureden gecen akis: $\\oiint \\mathbf{E} \\cdot d\\mathbf{S} = E(r) \\cdot 4\\pi r^2$ (kurede sabit, alan $4\\pi r^2$).<br>$Q/\\varepsilon_0$'a esitle: $E(r) \\cdot 4\\pi r^2 = Q/\\varepsilon_0$.<br>Coz: $E(r) = Q / (4\\pi \\varepsilon_0 r^2)$ — tam olarak Coulomb yasasi.<br><br>Diverjans teoremi, simetri elinizdeyse uc boyutlu elektrostatigi bir boyutlu cebire indirir.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">7.2 Sureklilik Denklemi — Diferansiyel Formda Korunum</h3>

<p class="l-text">Yogunlugu $\\rho(\\mathbf{x},t)$ ve akisi $\\mathbf{J}(\\mathbf{x},t)$ olan herhangi bir nicelik dusunun. Eger kaynak ya da batak yoksa, herhangi bir hacim icindeki miktar yalnizca sinir uzerinden geciste degisebilir:</p>

<div class="calc-formula"><div class="formula-label">SUREKLILIK DENKLEMI</div><div class="formula-main">$$\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot \\mathbf{J} = 0$$</div><div class="formula-sub">Yerel korunum. Kutle, yuk, olasilik yogunlugu, parcacik sayisi — akabilen her seye uygulanir.</div></div>

<p class="l-text">Bu denklem akiskan dinamiginin (kutle korunumu), elektromanyetigin (yuk korunumu), kuantum mekaniginin (Schrodinger denklemiyle olasilik korunumu) ve hatta uretici AI'da difuzyon modeli egitiminin (DDPM tarzi orneklemeleri besleyen olasilik akis ODE'si bir sureklilik denklemidir) altinda yatar.</p>

<h2 class="lesson-title">8. Jacobian Matrisi</h2>

<p class="l-text">$\\mathbf{f}: \\mathbb{R}^n \\to \\mathbb{R}^m$ — vektor giris, vektor cikis haritalarina gec. Dogal turev <strong>Jacobian matrisi</strong>dir:</p>

<div class="calc-formula"><div class="formula-label">JACOBIAN MATRISI</div><div class="formula-main">$$J_{\\mathbf{f}}(\\mathbf{x}) \\in \\mathbb{R}^{m \\times n}, \\qquad (J_{\\mathbf{f}})_{ij} = \\frac{\\partial f_i}{\\partial x_j}$$</div><div class="formula-sub">i-inci satir, i-inci ciktinin girislere gore gradyanidir. m cikti icin m satir, n giris icin n sutun.</div></div>

<p class="l-text">Jacobian, $\\mathbf{f}$'nin $\\mathbf{x}$ noktasindaki <em>en iyi dogrusal yaklasiminin</em> matrisidir:</p>

<div class="calc-formula"><div class="formula-label">BIRINCI MERTEBE TAYLOR</div><div class="formula-main">$$\\mathbf{f}(\\mathbf{x} + \\Delta \\mathbf{x}) \\approx \\mathbf{f}(\\mathbf{x}) + J_{\\mathbf{f}}(\\mathbf{x})\\, \\Delta \\mathbf{x}$$</div><div class="formula-sub">Tek degiskenli Taylor genisletmesine benzer, ama egim artik bir matris.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">8.1 Geometrik Anlam — Yerel Alan Olcekleme</h3>

<p class="l-text">$\\mathbf{f}: \\mathbb{R}^n \\to \\mathbb{R}^n$ (kare Jacobian) icin determinantin mutlak degeri $|\\det J_{\\mathbf{f}}|$ yerel <em>hacim olcekleme faktorunu</em> verir. $\\mathbf{x}$ etrafinda $\\varepsilon^n$ hacimli kucucuk bir kup, $|\\det J_{\\mathbf{f}}(\\mathbf{x})|\\, \\varepsilon^n$ hacimli bir paralelyuze gonderilir. Bu, cok degiskenli integralde degisken degisikligi formuludur.</p>

<div class="calc-graph"><div id="plot-l8-jac-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafikte gorunenler:</strong> Giris duzlemindeki (sol, mavi) duzgun kare izgaralar, dogrusal-olmayan harita $\\mathbf{f}(x,y) = (x + 0.4\\,y^2,\\; y + 0.3\\,x\\,y)$ ile cikis duzleminde (sag, turuncu) bukulmus bir izgaraya itilir. Merkezden uzaktaki hucreler, yerel $|\\det J_{\\mathbf{f}}|$'ye gore kucuk ya da gerilir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Lg=1.5,Ng=8;
function mkGrid(F){var lines=[];for(var i=0;i<=Ng;i++){var xs=[],ys=[];for(var j=0;j<=Ng*4;j++){var u=-Lg+i*2*Lg/Ng,v=-Lg+j*2*Lg/(Ng*4);var p=F(u,v);xs.push(p[0]);ys.push(p[1]);}lines.push({x:xs,y:ys,mode:'lines',line:{color:'rgba(255,255,255,0.32)',width:1},showlegend:false});}for(var i=0;i<=Ng;i++){var xs=[],ys=[];for(var j=0;j<=Ng*4;j++){var v=-Lg+i*2*Lg/Ng,u=-Lg+j*2*Lg/(Ng*4);var p=F(u,v);xs.push(p[0]);ys.push(p[1]);}lines.push({x:xs,y:ys,mode:'lines',line:{color:'rgba(255,255,255,0.32)',width:1},showlegend:false});}return lines;}
var grid_in=mkGrid(function(u,v){return [u-4,v];});
var grid_out=mkGrid(function(u,v){return [u+0.4*v*v+4,v+0.3*u*v];});
var labels={x:[-4,4],y:[Lg+0.5,Lg+0.5],mode:'text',text:['giris izgarasi (kare hucreler)','cikis izgarasi (bozulmus)'],textfont:{color:'#3b82f6',size:13},showlegend:false};
var data=grid_in.concat(grid_out).concat([labels]);
for(var k=0;k<grid_in.length;k++){data[k].line.color='rgba(59,130,246,0.55)';}
for(var k=grid_in.length;k<grid_in.length+grid_out.length;k++){data[k].line.color='rgba(245,158,11,0.6)';}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-Lg-4.5,Lg+4.5],scaleanchor:'y',scaleratio:1,showticklabels:false},yaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-Lg-0.5,Lg+1],showticklabels:false},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-jac-tr',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h3 style="color:#3b82f6;margin-top:1.4rem">8.2 Ileri-Mod ve Ters-Mod Otomatik Turev</h3>

<p class="l-text">Modern derin ogrenme cerceveleri (PyTorch, JAX, TensorFlow) hicbir zaman tam Jacobian'i acikca insa etmez. Milyonlarca giris ve milyonlarca cikisi olan bir ag icin o matris trilyonlarca girise sahiptir. Bunun yerine talep uzerine <em>Jacobian-vektor carpimlarini</em> hesaplarlar. Iki tat var:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ileri-mod (JVP)</div><div class="card-body">$J_{\\mathbf{f}}(\\mathbf{x})\\, \\mathbf{v}$ hesapla: bir kucuk giris bozukluk $\\mathbf{v}$ ciktilari nasil degistirir? JVP basina yaklasik bir ileri pas maliyetlidir. $n \\ll m$ — az giris, cok cikti — durumunda en iyidir.</div></div>
<div class="calc-card"><div class="card-title">Ters-mod (VJP)</div><div class="card-body">$\\mathbf{v}^T J_{\\mathbf{f}}(\\mathbf{x})$ hesapla: her giris ciktilarin agirlikli toplamina $\\mathbf{v}^T \\mathbf{f}$ ne kadar katki yapar? Yaklasik bir ileri pas + bir geri pas maliyetlidir. $n \\gg m$ — cok giris, az cikti — durumunda en iyidir.</div></div>
<div class="calc-card"><div class="card-title">Backprop = ters-mod</div><div class="card-body">ML'de kayip tek skalerdir ($m = 1$) ve parametre milyonlarca ($n$ buyuk). Ters-modda $\\mathbf{v} = 1$ sec ve bir geri pasta $\\nabla_{\\mathbf{w}} L$'yi elde et. Iste tam olarak backpropagation budur.</div></div>
<div class="calc-card"><div class="card-title">Hesaplama maliyeti</div><div class="card-body">Tam $m \\times n$ Jacobian, $\\min(m,n)$ JVP ya da VJP gerektirir. Skaler kayip icin bir VJP gradyan verir — $n$ ileri-mod pasdan koklu sekilde ucuzdur.</div></div>
</div>

<div class="calc-example"><div class="example-label">ORNEK CALISMA</div><div class="example-body"><strong>Kutupsal koordinatlarin Jacobian'i: $\\mathbf{f}(r, \\theta) = (r\\cos\\theta,\\, r\\sin\\theta)$.</strong><br><br>$J_{\\mathbf{f}}(r,\\theta) = \\begin{pmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{pmatrix}$.<br><br>$\\det J_{\\mathbf{f}} = r\\cos^2\\theta + r\\sin^2\\theta = r$.<br><br>Bu, kutupsal integral icin $dA = r\\,dr\\,d\\theta$'de gorunen $r$'dir. Gordugunuz her degisken degisikligi Jacobian determinanti, bu geometrik alan-olcekleme gerceginin bir ornegidir.</div></div>

<h2 class="lesson-title">9. Hessian Matrisi</h2>

<p class="l-text">Skaler alan $f: \\mathbb{R}^n \\to \\mathbb{R}$ icin <strong>Hessian</strong> ikinci kismi turevlerin matrisidir:</p>

<div class="calc-formula"><div class="formula-label">HESSIAN MATRISI</div><div class="formula-main">$$H_f(\\mathbf{x}) \\in \\mathbb{R}^{n \\times n}, \\qquad (H_f)_{ij} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}$$</div><div class="formula-sub">($C^2$ fonksiyonlar icin) simetriktir cunku karisik kismi turevler degisme ozelligi gosterir. Yerel egriligi her yonde kodlar.</div></div>

<div class="calc-formula"><div class="formula-label">IKINCI MERTEBE TAYLOR</div><div class="formula-main">$$f(\\mathbf{x} + \\Delta\\mathbf{x}) \\approx f(\\mathbf{x}) + \\nabla f(\\mathbf{x})^T \\Delta\\mathbf{x} + \\tfrac{1}{2}\\, \\Delta\\mathbf{x}^T H_f(\\mathbf{x})\\, \\Delta\\mathbf{x}$$</div><div class="formula-sub">Hessian ikinci-mertebe terimdir. Kritik noktada gradyan kaybolur ve sadece Hessian egriligi belirler.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">9.1 Ozdegerlerle Kritik Nokta Siniflamasi</h3>

<p class="l-text">Kritik noktada ($\\nabla f = \\mathbf{0}$) $f$'nin yerel sekli tamamen Hessian'in ozdegerlerine baglidir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tum ozdegerler &gt; 0</div><div class="card-body">Pozitif tanimli Hessian. Yerel <strong>minimum</strong>. Fonksiyon her yonde yukari kivrilir.</div></div>
<div class="calc-card"><div class="card-title">Tum ozdegerler &lt; 0</div><div class="card-body">Negatif tanimli. Yerel <strong>maksimum</strong>. Fonksiyon her yonde asagi kivrilir.</div></div>
<div class="calc-card"><div class="card-title">Karisik isaretler</div><div class="card-body"><strong>Eyer noktasi</strong>. Pozitif ozvektorler yonunde minimum, negatiflerin yonunde maksimum.</div></div>
<div class="calc-card"><div class="card-title">Bazi sifir</div><div class="card-body">Test kesin degildir. Yuksek turevler ya da baska argumanlar gerekir. Yatissiz minimumlarda yaygindir.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-hess-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafikte gorunenler:</strong> Kritik nokta civarinda iki skaler yuzey. Sol: $f(x,y) = x^2 + 2y^2$ Hessian'i $\\text{diag}(2, 4)$ — iki ozdeger pozitif, yani gercek minimum (kase sekli). Sag: $g(x,y) = x^2 - y^2$ Hessian'i $\\text{diag}(2, -2)$ — karisik isaretler, yani eyer (Pringles cipsi sekli). Hessian'in ozvektorleri egrilik ana eksenleri boyunca yonelir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=40,Lh=1.5;var xs=[],ys=[];for(var i=0;i<=N;i++){xs.push(-Lh+i*2*Lh/N);ys.push(-Lh+i*2*Lh/N);}
var z1=[],z2=[];for(var i=0;i<=N;i++){var r1=[],r2=[];for(var j=0;j<=N;j++){r1.push(xs[j]*xs[j]+2*ys[i]*ys[i]);r2.push(xs[j]*xs[j]-ys[i]*ys[i]);}z1.push(r1);z2.push(r2);}
var s1={type:'surface',x:xs,y:ys,z:z1,colorscale:[[0,'rgba(59,130,246,0.25)'],[1,'rgba(59,130,246,0.85)']],showscale:false,scene:'scene'};
var s2={type:'surface',x:xs.map(function(v){return v+4;}),y:ys,z:z2,colorscale:[[0,'rgba(245,158,11,0.25)'],[1,'rgba(245,158,11,0.85)']],showscale:false,scene:'scene'};
var labels={type:'scatter3d',x:[0,4],y:[Lh+0.4,Lh+0.4],z:[5.5,1.6],mode:'text',text:['minimum: x^2 + 2y^2','eyer: x^2 - y^2'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},scene:{xaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',color:'#e8e8e8'},yaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',color:'#e8e8e8'},zaxis:{title:'',gridcolor:'rgba(255,255,255,0.07)',color:'#e8e8e8'},camera:{eye:{x:1.6,y:1.6,z:1.2}}},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-hess-tr',[s1,s2,labels],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h3 style="color:#3b82f6;margin-top:1.4rem">9.2 Newton Yontemi ve Otesi</h3>

<p class="l-text">Optimizasyon icin Newton yontemi, sabit adim yonu $-\\nabla f$ yerine egrilik farkindali bir yon $-H_f^{-1} \\nabla f$ kullanir:</p>

<div class="calc-formula"><div class="formula-label">NEWTON ADIMI</div><div class="formula-main">$$\\mathbf{x}_{t+1} = \\mathbf{x}_t - \\eta\\, H_f(\\mathbf{x}_t)^{-1}\\, \\nabla f(\\mathbf{x}_t)$$</div><div class="formula-sub">Pozitif tanimli Hessian'a sahip ikinci-derece fonksiyon icin bir adim tam minimuma indirir. Ikinci-derece olmayan problemlerde minimum yakininda ikinci-derece yakinsama.</div></div>

<p class="l-text"><strong>Derin ogrenmedeki sorun:</strong> $n = 10^9$ parametreli bir modelin Hessian'i $n^2 = 10^{18}$ girise sahiptir. Depolayamiyoruz, tersini almak ise iyice mumkun degil. Uc pratik yaklasik aile ortaya cikti.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kosegen Hessian (Adam, RMSProp)</div><div class="card-body">$H$'nin yalnizca kosegenini izle — parametre basina bir sayi. Kare gradyanlarin yuruyen ortalamasi ile yaklas. Ucuzdur ve sasirtici sekilde iyi calisir.</div></div>
<div class="calc-card"><div class="card-title">K-FAC</div><div class="card-body">Her katman Hessian blogunu iki kucuk matrisin Kronecker carpimi olarak yaklasik tut (girdi kovaryansi $\\otimes$ cikti gradyan kovaryansi). Bazi buyuk olcekli goruntu ve dil model egitimlerinde kullanildi.</div></div>
<div class="calc-card"><div class="card-title">Shampoo / SOAP</div><div class="card-body">Sol ve sag tekil-deger yapisinin yuruyen istatistiklerinden insa edilen katman basi on kosullandiricilar. Yakin sonuclar (Shampoo buyuk olcekte, SOAP varyantlari) transformer on egitimi uzerinde Adam'a gore anlamli duvar saati iyilesmeleri gosteriyor.</div></div>
<div class="calc-card"><div class="card-title">Gauss-Newton ve NTK</div><div class="card-body">En kucuk kareler amaclari icin $H \\approx J^T J$ — pozitif tanimli, genellikle iyi kosullanmis matris. Bu, neural tangent kernel ile baglantilidir: genis-ag limitinde egitim dinamigi sabit bir $J^T J$ matrisi tarafindan yonetilir.</div></div>
</div>

<div class="l-note"><strong>Eyer noktasinda Hessian.</strong> Ampirik calismalar (Dauphin vd. 2014) yuksek-boyutlu kavansak olmayan kayiplarin yerel minimumlardan cok eyer noktalariyla dolu oldugunu gosterdi. Gradyan eyer civarinda kucuktur, bu yuzden birinci derece SGD yavaslar — ancak en negatif Hessian ozvektoru yonunde bir adim hemen kacis saglar. Ikinci derece yontemler o yonu bilir; birinci derece yontemler gurultuye guvenir.</div>

<h2 class="lesson-title">10. AI Baglantisi Tek Sayfada</h2>

<p class="l-text">Bu derste her nicelik modern derin ogrenmede bir yerlerde, cogu zaman anonim olarak gorunur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gradyan</div><div class="card-body">Egitim sinyali. Ters mod otomatik turev $\\nabla_{\\mathbf{w}} L$'yi dondurur. Her optimizator (SGD, Adam, Adafactor, Lion) gradyanlardan agirlik guncellemelerine bir fonksiyondur.</div></div>
<div class="calc-card"><div class="card-title">Diverjans</div><div class="card-body">Olasilik akisinin sureklilik denklemleri difuzyon modellerini calistirir (DDPM, skor tabanli, akis eslesmesi). Skor $\\nabla_{\\mathbf{x}} \\log p$, Fokker-Planck denklemlerinde diverjans olarak belirir.</div></div>
<div class="calc-card"><div class="card-title">Jacobian</div><div class="card-body">Normallestirici akislar $\\log p(\\mathbf{x}) = \\log p_z(f(\\mathbf{x})) + \\log |\\det J_f|$'yi maksimize ederek egitir — katman katman degerlendirilen degisken degisikligi formulu. Coupling katmanlari $\\det J_f$'yi hesaplamasi onemsiz hale getirmek icin tasarlandi.</div></div>
<div class="calc-card"><div class="card-title">Hessian</div><div class="card-body">Sharpness-Aware Minimization (SAM) buyuk maksimum Hessian ozdegerlerini cezalandirir. Kayip manzarasi literaturu (Li vd. 2018) egitilmis aglari karakterize etmek icin Hessian ozspektrumlari cizer. K-FAC, Shampoo, SOAP Hessian yapisi uzerine kurulur.</div></div>
<div class="calc-card"><div class="card-title">Rotasyonel, Stokes</div><div class="card-body">Daha az dolaysiz, ama: Hamiltonian Monte Carlo faz uzayinda diverjanssiz akislar kullanir; simplektik integratorler Stokes'un formellestirdigi geometrik yapiyi korur. EM tarzi klasik fizik bazi yeni mimari calismalarini esinledi (Lagrangian / Hamiltonian sinir aglari).</div></div>
<div class="calc-card"><div class="card-title">Gauss / diverjans teoremi</div><div class="card-body">Enerji tabanli modeller ve bolme fonksiyonlari diverjans teoreminden inen integral ozdesliklerine dayanir. $\\int p(\\mathbf{x})\\,d\\mathbf{x} = 1$ kisitini gordugunuzde, diverjans-teoremi tatli bir argumant kosede pusudadir.</div></div>
</div>

<div class="l-warn"><strong>Durust cerceve:</strong> Bunlarin hicbiri tipik bir PyTorch egitim scriptinde gorunmez. Ama <em>neden</em> Adam'in calistigini, <em>neden</em> bir normallestirici akisin Jacobian determinantinin hesaplanabilir oldugunu, <em>neden</em> difuzyon modellerinin kararli oldugunu sorduguniz an vektor analizine uzanirsiniz. Soyutlamalarin altinda her yerde gosterim vardir.</div>

<h2 class="lesson-title">11. Pratik Pyodide Egzersizi</h2>

<p class="l-text">Her seyi kendimiz hesaplama zamani. Asagidaki kod NumPy ve SciPy kullanarak (1) bir izgarada 2D vektor alani orneklemekte ve diverjans ile rotasyoneli sayisal olarak hesaplamakta, (2) Green teoremini bir kare sinir uzerinde cizgi integrali ile icinin alan integralini karsilastirarak dogrulamakta, (3) bir dogrusal-olmayan haritanin Jacobian'ini insa etmekte ve sonlu farkla karsilastirarak ters-mod otomatik turev sezgisinden kontrol etmekte, (4) 2D bir kaybin Hessian'ini hesaplamakta ve kritik noktayi ozdegerlerini okuyarak siniflamaktadir. <strong>CALISTIR</strong>'a tikla. Her blok beklenen ile gercek sayilari yan yana yazdirir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># ============================================================</span>
<span class="cm"># 1. 2D bir alanin sayisal diverjans ve rotasyoneli</span>
<span class="cm"># Alan: F(x,y) = (x^2 - y, x + y^2)</span>
<span class="cm"># Analitik diverjans = 2x + 2y</span>
<span class="cm"># Analitik rotasyonel (z) = 1 - (-1) = 2</span>
<span class="cm"># ============================================================</span>
N = <span class="num">200</span>
xs = np.<span class="fn">linspace</span>(-<span class="num">2</span>, <span class="num">2</span>, N)
ys = np.<span class="fn">linspace</span>(-<span class="num">2</span>, <span class="num">2</span>, N)
X, Y = np.<span class="fn">meshgrid</span>(xs, ys, indexing=<span class="str">"ij"</span>)
F1 = X**<span class="num">2</span> - Y
F2 = X + Y**<span class="num">2</span>

dx = xs[<span class="num">1</span>] - xs[<span class="num">0</span>]
dy = ys[<span class="num">1</span>] - ys[<span class="num">0</span>]
dF1_dx = np.<span class="fn">gradient</span>(F1, dx, axis=<span class="num">0</span>)
dF2_dy = np.<span class="fn">gradient</span>(F2, dy, axis=<span class="num">1</span>)
dF2_dx = np.<span class="fn">gradient</span>(F2, dx, axis=<span class="num">0</span>)
dF1_dy = np.<span class="fn">gradient</span>(F1, dy, axis=<span class="num">1</span>)

div_F  = dF1_dx + dF2_dy
curl_F = dF2_dx - dF1_dy

i = N // <span class="num">2</span> + <span class="num">20</span>; j = N // <span class="num">2</span> + <span class="num">10</span>
<span class="fn">print</span>(<span class="str">f"({X[i,j]:.2f}, {Y[i,j]:.2f}) noktasinda:"</span>)
<span class="fn">print</span>(<span class="str">f"  diverjans  (sayisal) = {div_F[i,j]:.4f}    analitik 2x+2y = {2*X[i,j]+2*Y[i,j]:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"  rotasyonel (sayisal) = {curl_F[i,j]:.4f}    analitik = 2.0000"</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 2. Green teoremini birim kare D = [0,1] x [0,1] uzerinde dogrula</span>
<span class="cm"># P(x,y) = -y/2,  Q(x,y) = x/2   ==&gt;  curl = 1, alan integrali = alan(D) = 1</span>
<span class="cm"># Saat yonunun tersine cizgi integrali de 1 cikmali.</span>
<span class="cm"># ============================================================</span>
<span class="kw">def</span> <span class="fn">line_int_square</span>():
    M = <span class="num">5000</span>
    t = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, M)
    I1 = np.<span class="fn">trapz</span>(-<span class="num">0</span>*t/<span class="num">2</span>, t)
    I2 = np.<span class="fn">trapz</span>(<span class="num">1</span>/<span class="num">2</span> * np.<span class="fn">ones_like</span>(t), t)
    I3 = np.<span class="fn">trapz</span>(-(-<span class="num">1</span>/<span class="num">2</span>) * np.<span class="fn">ones_like</span>(t), t)
    I4 = np.<span class="fn">trapz</span>(-(<span class="num">0</span>/<span class="num">2</span>) * np.<span class="fn">ones_like</span>(t), t)
    <span class="kw">return</span> I1 + I2 + I3 + I4

line_val = <span class="fn">line_int_square</span>()
area_val = <span class="num">1.0</span>
<span class="fn">print</span>(<span class="str">f"\\nBirim karede Green teoremi:"</span>)
<span class="fn">print</span>(<span class="str">f"  Sinir cizgi integrali     = {line_val:.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"  Rotasyonel alan integrali = {area_val:.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"  Fark (~0 olmali)          = {abs(line_val-area_val):.2e}"</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 3. Dogrusal-olmayan bir haritanin Jacobian'i. Analitik ve sonlu fark karsilastir.</span>
<span class="cm"># f(x,y) = (sin(x)*cos(y), exp(x*y))</span>
<span class="cm"># ============================================================</span>
<span class="kw">def</span> <span class="fn">f_vec</span>(p):
    x, y = p
    <span class="kw">return</span> np.<span class="fn">array</span>([np.<span class="fn">sin</span>(x)*np.<span class="fn">cos</span>(y), np.<span class="fn">exp</span>(x*y)])

<span class="kw">def</span> <span class="fn">jac_analytic</span>(p):
    x, y = p
    <span class="kw">return</span> np.<span class="fn">array</span>([
        [np.<span class="fn">cos</span>(x)*np.<span class="fn">cos</span>(y), -np.<span class="fn">sin</span>(x)*np.<span class="fn">sin</span>(y)],
        [y*np.<span class="fn">exp</span>(x*y),       x*np.<span class="fn">exp</span>(x*y)]
    ])

<span class="kw">def</span> <span class="fn">jac_fd</span>(f, p, h=<span class="num">1e-6</span>):
    p = np.<span class="fn">asarray</span>(p, dtype=<span class="fn">float</span>)
    out_dim = <span class="fn">len</span>(<span class="fn">f</span>(p))
    J = np.<span class="fn">zeros</span>((out_dim, <span class="fn">len</span>(p)))
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(p)):
        ei = np.<span class="fn">zeros_like</span>(p); ei[i] = h
        J[:, i] = (<span class="fn">f</span>(p + ei) - <span class="fn">f</span>(p - ei)) / (<span class="num">2</span>*h)
    <span class="kw">return</span> J

p0 = np.<span class="fn">array</span>([<span class="num">0.5</span>, <span class="num">0.7</span>])
Ja = <span class="fn">jac_analytic</span>(p0)
Jf = <span class="fn">jac_fd</span>(f_vec, p0)
<span class="fn">print</span>(<span class="str">f"\\n(0.5, 0.7) noktasinda Jacobian:"</span>)
<span class="fn">print</span>(<span class="str">f"  analitik =\\n{Ja}"</span>)
<span class="fn">print</span>(<span class="str">f"  sonlu fark =\\n{Jf}"</span>)
<span class="fn">print</span>(<span class="str">f"  maks |hata| = {np.<span class="fn">abs</span>(Ja - Jf).<span class="fn">max</span>():.2e}"</span>)
<span class="fn">print</span>(<span class="str">f"  det(J) = {np.linalg.<span class="fn">det</span>(Ja):.4f}    (yerel alan olcegi)"</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 4. Hessian ve kritik nokta siniflamasi.</span>
<span class="cm"># L(w1, w2) = w1^2 + 2*w1*w2 + 3*w2^2 - 4*w1 - 6*w2</span>
<span class="cm"># Hessian = [[2, 2],[2, 6]]  iki ozdeger de pozitif ==&gt; minimum.</span>
<span class="cm"># ============================================================</span>
<span class="kw">def</span> <span class="fn">L</span>(w):
    w1, w2 = w
    <span class="kw">return</span> w1**<span class="num">2</span> + <span class="num">2</span>*w1*w2 + <span class="num">3</span>*w2**<span class="num">2</span> - <span class="num">4</span>*w1 - <span class="num">6</span>*w2

<span class="kw">def</span> <span class="fn">grad_L</span>(w):
    w1, w2 = w
    <span class="kw">return</span> np.<span class="fn">array</span>([<span class="num">2</span>*w1 + <span class="num">2</span>*w2 - <span class="num">4</span>, <span class="num">2</span>*w1 + <span class="num">6</span>*w2 - <span class="num">6</span>])

w_star = np.linalg.<span class="fn">solve</span>([[<span class="num">2</span>, <span class="num">2</span>], [<span class="num">2</span>, <span class="num">6</span>]], [<span class="num">4</span>, <span class="num">6</span>])
<span class="fn">print</span>(<span class="str">f"\\nKritik nokta w* = {w_star}"</span>)
<span class="fn">print</span>(<span class="str">f"  w*'da gradyan   = {grad_L(w_star)}  (~ 0 olmali)"</span>)

H = np.<span class="fn">array</span>([[<span class="num">2</span>, <span class="num">2</span>], [<span class="num">2</span>, <span class="num">6</span>]])
eigvals = np.linalg.<span class="fn">eigvalsh</span>(H)
<span class="fn">print</span>(<span class="str">f"  Hessian = {H.<span class="fn">tolist</span>()}"</span>)
<span class="fn">print</span>(<span class="str">f"  ozdegerler = {eigvals}"</span>)
<span class="kw">if</span> np.<span class="fn">all</span>(eigvals &gt; <span class="num">0</span>):
    <span class="fn">print</span>(<span class="str">"  siniflandirma: YEREL MINIMUM (pozitif tanimli)"</span>)
<span class="kw">elif</span> np.<span class="fn">all</span>(eigvals &lt; <span class="num">0</span>):
    <span class="fn">print</span>(<span class="str">"  siniflandirma: YEREL MAKSIMUM (negatif tanimli)"</span>)
<span class="kw">else</span>:
    <span class="fn">print</span>(<span class="str">"  siniflandirma: EYER NOKTASI (belirsiz)"</span>)

H_saddle = np.<span class="fn">array</span>([[<span class="num">2</span>, <span class="num">0</span>], [<span class="num">0</span>, -<span class="num">3</span>]])
ev_saddle = np.linalg.<span class="fn">eigvalsh</span>(H_saddle)
<span class="fn">print</span>(<span class="str">f"\\nEyer Hessian ozdegerleri = {ev_saddle}  ==&gt; EYER"</span>)</code></pre></div>

<p class="l-text"><strong>Denenecekler.</strong> Blok 1'deki alani $(-y, x)$ donme alaniyla degistirin ve $\\nabla \\cdot \\mathbf{F} = 0$, $\\nabla \\times \\mathbf{F} = 2$ oldugunu dogrulayin. Blok 2'de $P$ ve $Q$'yu $P = x y$, $Q = x^2$ gibi korunumlu olmayan seciler yapip cizgi ve alan integrallerinin sifir disi degerlerde ama esit ciktigini izleyin. Blok 3'te $\\mathbf{f}(x,y) = (e^x + y, x \\sin y)$ deneyin ve Jacobian determinantinin $y = \\pi$ noktasinda isaret degistirdigini gorun. Blok 4'te Hessian'i $\\begin{pmatrix} 2 & 5 \\\\ 5 & 1 \\end{pmatrix}$ ile degistirin — ozdegerler $\\approx \\{6.1, -3.1\\}$ olur ve siniflandirici eyer raporu verir.</p>

<h2 class="lesson-title">Ozet</h2>

<p class="l-text">Vektor analizi tek degiskenli turev ve integrali $\\mathbb{R}^n$ uzerindeki skaler ve vektor alanlarina genisletir. Gradyan, skaler alanlari vektor alanlarina cevirir ve en dik artisin yonune isaret eder. Diverjans, vektor alanlarini skalere geri donusturur ve yerel kaynak ya da bataklari olcer. Rotasyonel yerel donmenin vektor olculusudur. Uc integral teoremi — 2D'de Green, yuzeylerde Stokes, 3D hacimlerde diverjans — sinir integrallerini ic integrallere baglar ve Maxwell denklemlerinin diferansiyel formunun, Gauss yasasinin ve akiskan dinamigindeki korunumun bel kemigini olusturur. Jacobian, vektor degerli bir haritanin matris turevidir ve determinanti yerel hacim olcekleme faktorudur; Jacobian-vektor carpimlarinin ters-mod degerlendirilmesi backpropagation'in yaptigi seydir. Hessian ikinci kismi turev matrisidir; ozdegerleri kritik noktalari minimum, maksimum ya da eyer olarak siniflar ve yaklasik Hessian'lar modern derin ogrenmedeki ikinci derece optimizatorleri (K-FAC, Shampoo, Gauss-Newton, neural tangent kernel analizleri) calistirir. Bu dersle kalkulus brans ders dizisi sona eriyor; artik egitim, genellestirme ve mimariler hakkinda akil yurutmek icin surekli-matematik farkindali bir ML arastirmacisinin kullandigi tum dile sahipsiniz.</p>
`
};
