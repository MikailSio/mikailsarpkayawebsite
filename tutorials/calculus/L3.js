window.CALCULUS_L3 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>So far we have differentiated functions of a single variable.</strong> But the most useful functions in geometry, physics and economics depend on several variables at once: the temperature inside a room is a function of three spatial coordinates, the height of a hill above sea level is a function of latitude and longitude, the output of a factory depends on labour and capital. To understand how such a function changes, one number is not enough — we need a rate of change for each variable.</p>

<p class="l-text">This lesson develops the calculus of functions of several variables: the <strong>partial derivative</strong>, the <strong>gradient vector</strong>, the <strong>directional derivative</strong>, the <strong>tangent plane</strong>, and the <strong>total differential</strong>. We close with a careful look at the equality of mixed partials (Clairaut's theorem) and a set of worked classical exercises.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define the partial derivative $\\partial f/\\partial x$ as a limit and read it as a slope of a slice through a surface</li>
<li>Compute partials of polynomial, rational, trigonometric and exponential functions of several variables</li>
<li>State and apply Clairaut's theorem on the equality of mixed second partials</li>
<li>Assemble the gradient vector $\\nabla f$ and interpret it as the direction of steepest ascent</li>
<li>Use the formula $D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u}$ to compute the rate of change of $f$ along any unit vector</li>
<li>Write the equation of the tangent plane to a graph $z = f(x,y)$ and to a level surface $F(x,y,z) = c$</li>
<li>Understand the total differential $df$ and use it for first-order linear approximation</li>
</ul>
</div>

<h2 class="lesson-title">1. From One Variable to Many</h2>

<div class="calc-highlight"><strong>A function of one variable produces a curve; a function of two variables produces a surface.</strong> Differential calculus in higher dimensions begins with the realisation that on a surface there is no single notion of slope — at each point the slope depends on the direction you choose to walk.</div>

<p class="l-text">Recall the one-variable picture. A function $f : \\mathbb{R} \\to \\mathbb{R}$ assigns to each real number $x$ a real number $f(x)$. Its graph is a curve in the plane, and the derivative</p>

<div class="calc-formula"><div class="formula-label">ONE-VARIABLE DERIVATIVE</div><div class="formula-main">$$f'(x) \\;=\\; \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$</div><div class="formula-sub">A single number at each point: the slope of the unique tangent line.</div></div>

<p class="l-text">A <strong>function of two variables</strong> is a map $f : \\mathbb{R}^2 \\to \\mathbb{R}$ that sends each point $(x,y)$ to a number $f(x,y)$. Its graph is the surface $\\{(x, y, z) : z = f(x,y)\\}$ in three-dimensional space. Three concrete examples make the geometry concrete.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Paraboloid</div><div class="card-body">$f(x,y) = x^2 + y^2$. A bowl opening upward, symmetric about the $z$-axis. The level curves $x^2 + y^2 = c$ are concentric circles.</div><div class="card-formula">$z = x^2 + y^2$</div></div>
<div class="calc-card"><div class="card-title">Saddle</div><div class="card-body">$f(x,y) = x^2 - y^2$. A horse saddle: curves up in the $x$-direction, down in the $y$-direction. Level curves are hyperbolae.</div><div class="card-formula">$z = x^2 - y^2$</div></div>
<div class="calc-card"><div class="card-title">Plane</div><div class="card-body">$f(x,y) = 2x + 3y + 1$. A tilted flat plane. Its slope in any direction is constant — the simplest non-trivial multivariable function.</div><div class="card-formula">$z = 2x + 3y + 1$</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-surface-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the paraboloid $z = x^2 + y^2$ over the square $[-2, 2] \\times [-2, 2]$. Slicing the surface with the vertical plane $y = y_0$ produces a parabola in the $xz$-plane; the slope of that parabola at a point is the partial derivative $\\partial f/\\partial x$ at that point.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[],zs=[];
for(var i=0;i<=40;i++){var rowz=[];for(var j=0;j<=40;j++){var x=-2+4*j/40,y=-2+4*i/40;rowz.push(x*x+y*y);}zs.push(rowz);}
for(var k=0;k<=40;k++){xs.push(-2+4*k/40);ys.push(-2+4*k/40);}
var data=[{type:'surface',x:xs,y:ys,z:zs,colorscale:[[0,'rgba(59,130,246,0.85)'],[0.5,'rgba(168,85,247,0.65)'],[1,'rgba(245,158,11,0.85)']],opacity:0.9,showscale:false,contours:{z:{show:true,usecolormap:true,project:{z:true}}}}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)'},zaxis:{title:'z = f(x,y)',gridcolor:'rgba(255,255,255,0.07)'},bgcolor:'#0a0a0a'},margin:{t:10,r:10,b:10,l:10}};
Plotly.newPlot('plot-l3-surface-en',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">On a curve there is one tangent line at each point. On a surface there is an entire plane of tangent directions at each point. To capture the full information we cannot use a single number; we need a separate slope for each independent direction. The simplest choices are the two coordinate directions, and the resulting slopes are the partial derivatives.</p>

<h2 class="lesson-title">2. The Partial Derivative</h2>

<div class="calc-highlight"><strong>A partial derivative is an ordinary derivative — taken with respect to one variable, while all other variables are held fixed.</strong> The Greek letter $\\partial$ (sometimes called "del" or "rounded d") signals that the function depends on several variables, but only one of them is being varied.</div>

<p class="l-text">Formally, fix a point $(x_0, y_0)$ and freeze the second coordinate at $y_0$. The function $g(x) = f(x, y_0)$ of one variable has its own ordinary derivative at $x_0$. We call this number the <strong>partial derivative of $f$ with respect to $x$</strong> at $(x_0, y_0)$:</p>

<div class="calc-formula"><div class="formula-label">DEFINITION — PARTIAL DERIVATIVES AS LIMITS</div><div class="formula-main">$$\\frac{\\partial f}{\\partial x}(x_0, y_0) \\;=\\; \\lim_{h \\to 0} \\frac{f(x_0 + h, y_0) - f(x_0, y_0)}{h}$$<br>$$\\frac{\\partial f}{\\partial y}(x_0, y_0) \\;=\\; \\lim_{h \\to 0} \\frac{f(x_0, y_0 + h) - f(x_0, y_0)}{h}$$</div><div class="formula-sub">Each partial is an ordinary one-variable limit: the only thing that changes is which coordinate is allowed to move.</div></div>

<p class="l-text">Alternative notations all denote the same object. The expressions $f_x(x_0, y_0)$, $\\partial_x f(x_0, y_0)$, $D_1 f(x_0, y_0)$, and $\\tfrac{\\partial f}{\\partial x}\\big|_{(x_0, y_0)}$ are interchangeable. We will use whichever is most readable in a given context.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ORDINARY DERIVATIVE</div><div class="compare-item">$\\bullet$ One independent variable: $f(x)$</div><div class="compare-item">$\\bullet$ Notation: $\\tfrac{df}{dx}$, $f'(x)$</div><div class="compare-item">$\\bullet$ Result: one number per point</div><div class="compare-item">$\\bullet$ Slope of the unique tangent line</div></div><div class="compare-col"><div class="compare-title">PARTIAL DERIVATIVE</div><div class="compare-item">$\\bullet$ Several independent variables: $f(x, y, \\ldots)$</div><div class="compare-item">$\\bullet$ Notation: $\\tfrac{\\partial f}{\\partial x}$, $f_x$</div><div class="compare-item">$\\bullet$ Result: one number per variable, per point</div><div class="compare-item">$\\bullet$ Slope of a slice through the surface</div></div></div>

<p class="l-text"><strong>Geometric picture.</strong> The vertical plane $y = y_0$ cuts the surface $z = f(x,y)$ in a curve. This curve lives in a 2D plane (its coordinates are $x$ and $z$) and has a well-defined slope at every point. That slope, evaluated at $x = x_0$, is precisely $f_x(x_0, y_0)$. Similarly, slicing with $x = x_0$ produces a curve whose slope at $y_0$ is $f_y(x_0, y_0)$.</p>

<div class="calc-example"><div class="example-label">PHYSICAL INTERPRETATION — Temperature in a Plate</div><div class="example-body">Let $T(x, y)$ be the steady-state temperature at the point $(x, y)$ of a thin metal plate. Then $T_x(x_0, y_0)$ is the rate at which the temperature rises if you move from $(x_0, y_0)$ purely in the $+x$-direction (south-to-north on a map). $T_y$ is the rate moving purely in the $+y$-direction (west-to-east). Knowing both partials at a point tells you the temperature gradient: in which direction is the metal hottest, and how steeply does it heat up.</div></div>

<h2 class="lesson-title">3. Computing Partials in Practice</h2>

<div class="calc-highlight"><strong>The mechanical rule.</strong> To compute $\\partial f/\\partial x$, regard every variable other than $x$ as a constant and apply the ordinary one-variable differentiation rules. The same algebra you learned for $\\tfrac{d}{dx}$ — power rule, product rule, quotient rule, chain rule — applies without modification.</div>

<p class="l-text">Five worked examples illustrate the procedure on common families of functions.</p>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — Polynomial</div><div class="example-body"><strong>Function:</strong> $f(x, y) = x^3 y^2 + 4xy - 7y^4 + 5$.<br><br><strong>Compute $f_x$</strong> (treat $y$ as a constant):<br>$\\bullet$ $x^3 y^2 \\;\\to\\; 3x^2 y^2$ &nbsp;(power rule on $x$, the factor $y^2$ stays put).<br>$\\bullet$ $4xy \\;\\to\\; 4y$ &nbsp;(the factor $4y$ is constant in $x$).<br>$\\bullet$ $-7y^4 \\;\\to\\; 0$ &nbsp;(no $x$ present).<br>$\\bullet$ $5 \\;\\to\\; 0$.<br>$\\Rightarrow f_x(x,y) = 3x^2 y^2 + 4y$.<br><br><strong>Compute $f_y$</strong> (treat $x$ as a constant):<br>$\\bullet$ $x^3 y^2 \\;\\to\\; 2 x^3 y$.<br>$\\bullet$ $4xy \\;\\to\\; 4x$.<br>$\\bullet$ $-7y^4 \\;\\to\\; -28 y^3$.<br>$\\bullet$ $5 \\;\\to\\; 0$.<br>$\\Rightarrow f_y(x,y) = 2x^3 y + 4x - 28 y^3$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — Trigonometric</div><div class="example-body"><strong>Function:</strong> $f(x, y) = \\sin(x y)$.<br><br>By the chain rule, the derivative of $\\sin(u)$ is $\\cos(u) \\cdot u'$. For $f_x$ the inner function is $u = xy$ with $\\tfrac{\\partial u}{\\partial x} = y$:<br>$\\Rightarrow f_x = y \\cos(xy).$<br><br>Symmetrically, $\\tfrac{\\partial u}{\\partial y} = x$, so $f_y = x \\cos(xy).$</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — Exponential</div><div class="example-body"><strong>Function:</strong> $f(x, y) = e^{x^2 + y^2}$.<br><br>Differentiating $e^{u}$ in any variable gives $e^{u} \\cdot u'$. The exponent $u = x^2 + y^2$ has $u_x = 2x$ and $u_y = 2y$:<br>$f_x = 2x \\, e^{x^2 + y^2}, \\qquad f_y = 2y \\, e^{x^2 + y^2}.$</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 — Rational</div><div class="example-body"><strong>Function:</strong> $f(x, y) = \\dfrac{x}{x + y}$.<br><br>Quotient rule with $u = x$ and $v = x + y$. For $f_x$: $u_x = 1$, $v_x = 1$, so<br>$f_x = \\dfrac{1 \\cdot (x+y) - x \\cdot 1}{(x+y)^2} = \\dfrac{y}{(x+y)^2}.$<br><br>For $f_y$: $u_y = 0$, $v_y = 1$, so<br>$f_y = \\dfrac{0 \\cdot (x+y) - x \\cdot 1}{(x+y)^2} = \\dfrac{-x}{(x+y)^2}.$</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 5 — Three Variables (Economics)</div><div class="example-body"><strong>Cobb-Douglas production function:</strong> $Q(K, L, M) = K^{0.3}\\, L^{0.5}\\, M^{0.2}$, where $K$, $L$, $M$ denote capital, labour and materials.<br><br>The <em>marginal product of capital</em> is $\\partial Q / \\partial K$. Treating $L$ and $M$ as constants:<br>$\\dfrac{\\partial Q}{\\partial K} = 0.3 \\, K^{-0.7} L^{0.5} M^{0.2} = 0.3 \\, \\dfrac{Q}{K}.$<br><br>Similarly $\\partial Q/\\partial L = 0.5\\, Q/L$ and $\\partial Q/\\partial M = 0.2 \\, Q/M$. The exponents are exactly the marginal output elasticities — a striking algebraic consequence of partial differentiation.</div></div>

<h2 class="lesson-title">4. Higher-Order Partials and Clairaut's Theorem</h2>

<div class="calc-highlight"><strong>Just as a single function has a second derivative, a multivariable function has second-order partials.</strong> But now there are several possibilities — $f_{xx}$, $f_{xy}$, $f_{yx}$, $f_{yy}$ — and a striking theorem says that for well-behaved functions the cross-partials are equal.</div>

<p class="l-text">The four second-order partials of $f(x, y)$ are obtained by differentiating each first partial again, with respect to either variable:</p>

<div class="calc-formula"><div class="formula-label">SECOND-ORDER PARTIALS</div><div class="formula-main">$$f_{xx} = \\frac{\\partial^2 f}{\\partial x^2} = \\frac{\\partial}{\\partial x}\\!\\left(\\frac{\\partial f}{\\partial x}\\right), \\qquad f_{yy} = \\frac{\\partial^2 f}{\\partial y^2} = \\frac{\\partial}{\\partial y}\\!\\left(\\frac{\\partial f}{\\partial y}\\right)$$<br>$$f_{xy} = \\frac{\\partial^2 f}{\\partial y \\, \\partial x} = \\frac{\\partial}{\\partial y}\\!\\left(\\frac{\\partial f}{\\partial x}\\right), \\qquad f_{yx} = \\frac{\\partial^2 f}{\\partial x \\, \\partial y} = \\frac{\\partial}{\\partial x}\\!\\left(\\frac{\\partial f}{\\partial y}\\right)$$</div><div class="formula-sub">$f_{xx}$ and $f_{yy}$ are pure second partials. $f_{xy}$ and $f_{yx}$ are <em>mixed</em> second partials — and they agree, for any function smooth enough to make the question well-posed.</div></div>

<div class="calc-example"><div class="example-label">THEOREM — Clairaut (Schwarz)</div><div class="example-body">Let $f$ be defined on an open disk around $(x_0, y_0)$ and suppose $f_{xy}$ and $f_{yx}$ both exist and are continuous on that disk. Then<br>$$f_{xy}(x_0, y_0) = f_{yx}(x_0, y_0).$$<br>Geometrically: the order in which you take the two partials does not matter.</div></div>

<p class="l-text"><strong>Verification on a polynomial.</strong> Take $f(x,y) = x^3 y^2 + 4xy$. We computed $f_x = 3x^2 y^2 + 4y$ and $f_y = 2x^3 y + 4x$. Then</p>

<div class="calc-formula"><div class="formula-label">CHECKING CLAIRAUT</div><div class="formula-main">$$f_{xy} = \\frac{\\partial}{\\partial y}(3x^2 y^2 + 4y) = 6 x^2 y + 4$$<br>$$f_{yx} = \\frac{\\partial}{\\partial x}(2 x^3 y + 4x) = 6 x^2 y + 4$$</div><div class="formula-sub">The two mixed partials are identical, as Clairaut's theorem guarantees.</div></div>

<p class="l-text"><strong>The collection $\\{f_{xx}, f_{xy}, f_{yy}\\}$</strong> of independent second partials is sometimes assembled into a symmetric matrix called the <em>Hessian</em> $H$ — but that is a story for a later lesson on optimisation. For now the message is clean: cross-derivatives commute for smooth functions, so you may differentiate $f$ first in $x$ and then in $y$, or first in $y$ and then in $x$; the answer is the same.</p>

<div class="l-note"><strong>When Clairaut fails.</strong> Continuity of the mixed partials is essential. A textbook counter-example is $f(x,y) = xy(x^2 - y^2)/(x^2 + y^2)$ with $f(0,0) = 0$: one can show $f_{xy}(0,0) = 1$ but $f_{yx}(0,0) = -1$. For every function we encounter in practice this pathology does not arise.</div>

<h2 class="lesson-title">5. The Gradient Vector $\\nabla f$</h2>

<div class="calc-highlight"><strong>Bundling the partials into a single vector turns scalar calculus into vector calculus.</strong> The vector whose components are the partials of $f$ is called the gradient. It encodes <em>everything</em> there is to know about the first-order behaviour of $f$ at a point.</div>

<p class="l-text">For a function of two variables,</p>

<div class="calc-formula"><div class="formula-label">GRADIENT IN TWO VARIABLES</div><div class="formula-main">$$\\nabla f(x, y) \\;=\\; \\Big(\\, f_x(x,y), \\; f_y(x, y) \\,\\Big) \\;=\\; \\begin{pmatrix} \\partial f / \\partial x \\\\[4pt] \\partial f / \\partial y \\end{pmatrix}.$$</div><div class="formula-sub">A vector field on the plane: at every point $(x,y)$ it returns an arrow whose components are the two partials.</div></div>

<p class="l-text">For three or more variables the definition is analogous: $\\nabla f = (f_{x_1}, f_{x_2}, \\ldots, f_{x_n})$. The symbol $\\nabla$ (a nabla, also called "del") is a vector differential operator</p>

<p class="l-text">$$\\nabla \\;=\\; \\left(\\frac{\\partial}{\\partial x_1}, \\frac{\\partial}{\\partial x_2}, \\ldots, \\frac{\\partial}{\\partial x_n}\\right).$$</p>

<p class="l-text">Applying $\\nabla$ to a scalar function $f$ produces the vector $\\nabla f$ whose components are the partials.</p>

<div class="calc-example"><div class="example-label">EXAMPLE — Gradient at a Point</div><div class="example-body">For $f(x, y) = x^2 + 3xy + y^2$:<br>$f_x = 2x + 3y, \\qquad f_y = 3x + 2y.$<br><br>The gradient field is $\\nabla f(x,y) = (2x + 3y, \\; 3x + 2y)$. Evaluated at the point $(1, 2)$:<br>$\\nabla f(1, 2) = (2 \\cdot 1 + 3 \\cdot 2, \\; 3 \\cdot 1 + 2 \\cdot 2) = (8, \\; 7).$<br><br>This vector lives in the $xy$-plane (not in 3D space!) and has magnitude $|\\nabla f(1,2)| = \\sqrt{64 + 49} = \\sqrt{113} \\approx 10.63$.</div></div>

<div class="calc-graph"><div id="plot-l3-gradfield-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the gradient field of $f(x,y) = x^2 + y^2$ on the square $[-2,2]\\times[-2,2]$. At each grid point, the arrow points away from the origin — the direction in which $f$ increases fastest — and its length is proportional to $|\\nabla f| = 2\\sqrt{x^2+y^2}$. Near the origin the gradient is small (the surface is nearly flat); far from the origin it is large (the surface is steep).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
for(var i=-2;i<=2;i+=0.5){for(var j=-2;j<=2;j+=0.5){if(i===0&&j===0)continue;var gx=2*i,gy=2*j;var nrm=Math.sqrt(gx*gx+gy*gy);var s=0.15;var ex=i+s*gx/nrm,ey=j+s*gy/nrm;traces.push({x:[i,ex],y:[j,ey],mode:'lines',line:{color:'#3b82f6',width:1.6},showlegend:false,hoverinfo:'skip'});traces.push({x:[ex],y:[ey],mode:'markers',marker:{color:'#3b82f6',size:5,symbol:'triangle-up',angle:Math.atan2(gy,gx)*180/Math.PI-90},showlegend:false,hoverinfo:'skip'});}}
var cx=[],cy=[];for(var k=0;k<=200;k++){var t=2*Math.PI*k/200;cx.push(Math.cos(t));cy.push(Math.sin(t));}traces.push({x:cx,y:cy,mode:'lines',line:{color:'#f59e0b',width:2,dash:'dot'},name:'level curve f=1'});
var cx2=[],cy2=[];for(var k=0;k<=200;k++){var t=2*Math.PI*k/200;cx2.push(Math.sqrt(2)*Math.cos(t));cy2.push(Math.sqrt(2)*Math.sin(t));}traces.push({x:cx2,y:cy2,mode:'lines',line:{color:'#f59e0b',width:2,dash:'dot'},name:'level curve f=2'});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-2.3,2.3],scaleanchor:'y'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-2.3,2.3]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-gradfield-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>The crucial geometric fact</strong> — proved in the next two sections — is that $\\nabla f$ at a point points in the direction of <em>steepest increase</em> of $f$, and its magnitude $|\\nabla f|$ equals the rate of that maximum increase. The opposite direction $-\\nabla f$ is the direction of steepest descent.</p>

<h2 class="lesson-title">6. The Directional Derivative</h2>

<div class="calc-highlight"><strong>The partials measure rates of change along the coordinate axes only.</strong> But on a surface you can walk in any direction. The <em>directional derivative</em> $D_{\\mathbf{u}} f$ generalises the partials to an arbitrary unit vector $\\mathbf{u}$.</div>

<p class="l-text">Fix a point $\\mathbf{p} = (x_0, y_0)$ and a unit vector $\\mathbf{u} = (u_1, u_2)$ with $u_1^2 + u_2^2 = 1$. Walk away from $\\mathbf{p}$ in the direction $\\mathbf{u}$ at unit speed: your position at time $h$ is $\\mathbf{p} + h \\mathbf{u}$. The rate of change of $f$ along this path is the directional derivative.</p>

<div class="calc-formula"><div class="formula-label">DEFINITION — DIRECTIONAL DERIVATIVE</div><div class="formula-main">$$D_{\\mathbf{u}} f(\\mathbf{p}) \\;=\\; \\lim_{h \\to 0} \\frac{f(\\mathbf{p} + h \\mathbf{u}) - f(\\mathbf{p})}{h}.$$</div><div class="formula-sub">A one-variable limit along the line $\\{\\mathbf{p} + h\\mathbf{u}\\}$.</div></div>

<p class="l-text">When $\\mathbf{u}$ is one of the standard basis vectors, the directional derivative reduces to a partial. With $\\mathbf{u} = (1, 0)$ we recover $D_{\\mathbf{u}} f = f_x$; with $\\mathbf{u} = (0, 1)$ we recover $f_y$. The directional derivative is genuinely more general.</p>

<div class="calc-example"><div class="example-label">THEOREM — Gradient Formula for the Directional Derivative</div><div class="example-body">If $f$ is differentiable at $\\mathbf{p}$ and $\\mathbf{u}$ is a unit vector, then<br>$$D_{\\mathbf{u}} f(\\mathbf{p}) \\;=\\; \\nabla f(\\mathbf{p}) \\cdot \\mathbf{u}.$$<br>The directional derivative is the dot product of the gradient with the direction.</div></div>

<p class="l-text"><strong>Proof sketch.</strong> Let $\\phi(h) = f(\\mathbf{p} + h\\mathbf{u}) = f(x_0 + h u_1, y_0 + h u_2)$. By the chain rule (developed carefully in Lesson 4),</p>

<p class="l-text">$$\\phi'(0) \\;=\\; f_x(\\mathbf{p}) \\cdot u_1 \\;+\\; f_y(\\mathbf{p}) \\cdot u_2 \\;=\\; \\nabla f(\\mathbf{p}) \\cdot \\mathbf{u}.$$</p>

<p class="l-text">Since $D_{\\mathbf{u}} f(\\mathbf{p}) = \\phi'(0)$, the formula follows. $\\square$</p>

<div class="calc-example"><div class="example-label">EXAMPLE — Directional Derivative in a Specific Direction</div><div class="example-body"><strong>Function:</strong> $f(x,y) = x^2 + 3xy + y^2$, point $(1, 2)$, direction along the vector $\\mathbf{v} = (3, 4)$.<br><br><strong>Step 1.</strong> Normalise $\\mathbf{v}$: $|\\mathbf{v}| = \\sqrt{9 + 16} = 5$, so $\\mathbf{u} = (3/5, 4/5)$.<br><br><strong>Step 2.</strong> Recall $\\nabla f(1, 2) = (8, 7)$ from §5.<br><br><strong>Step 3.</strong> Dot product:<br>$D_{\\mathbf{u}} f(1, 2) = (8, 7) \\cdot (3/5, 4/5) = \\dfrac{24 + 28}{5} = \\dfrac{52}{5} = 10.4.$<br><br>So along the unit vector pointing roughly toward the upper-right, $f$ increases at rate $10.4$ per unit distance.</div></div>

<p class="l-text"><strong>Maximising the directional derivative.</strong> The dot product $\\nabla f \\cdot \\mathbf{u}$ may be rewritten using the angle $\\theta$ between $\\nabla f$ and $\\mathbf{u}$:</p>

<p class="l-text">$$D_{\\mathbf{u}} f \\;=\\; |\\nabla f| \\, |\\mathbf{u}| \\, \\cos \\theta \\;=\\; |\\nabla f| \\cos \\theta.$$</p>

<p class="l-text">Since $\\cos \\theta$ is maximal $(= 1)$ when $\\theta = 0$, the directional derivative is largest in the direction $\\mathbf{u} = \\nabla f / |\\nabla f|$ — that is, in the direction of the gradient. Its maximum value is $|\\nabla f|$. Similarly the minimum, $-|\\nabla f|$, is attained in the direction $-\\nabla f$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Steepest Ascent</div><div class="card-body">$\\mathbf{u} = \\nabla f / |\\nabla f|.$ The function climbs fastest in this direction; the rate is $|\\nabla f|$.</div><div class="card-formula">$\\theta = 0$</div></div>
<div class="calc-card"><div class="card-title">Steepest Descent</div><div class="card-body">$\\mathbf{u} = -\\nabla f / |\\nabla f|.$ The function falls fastest; the rate is $-|\\nabla f|$.</div><div class="card-formula">$\\theta = \\pi$</div></div>
<div class="calc-card"><div class="card-title">Level Direction</div><div class="card-body">$\\mathbf{u} \\perp \\nabla f.$ The directional derivative is zero — moving in this direction keeps $f$ constant.</div><div class="card-formula">$\\theta = \\pi/2$</div></div>
</div>

<h2 class="lesson-title">7. Geometric Meaning: $\\nabla f$ is Perpendicular to Level Curves</h2>

<div class="calc-highlight"><strong>One of the most elegant facts in multivariable calculus.</strong> The gradient at a point is perpendicular to the level curve of $f$ passing through that point. The same statement holds in any dimension: $\\nabla F$ is normal to the level surface $\\{F = c\\}$.</div>

<p class="l-text">Recall a <strong>level curve</strong> of $f : \\mathbb{R}^2 \\to \\mathbb{R}$ is the set $\\{(x,y) : f(x,y) = c\\}$ for a given constant $c$. Suppose $\\mathbf{r}(t) = (x(t), y(t))$ is a smooth parameterisation of the level curve through a point $\\mathbf{p} = \\mathbf{r}(0)$. Then $f(\\mathbf{r}(t)) = c$ for all $t$; differentiating with respect to $t$,</p>

<div class="calc-formula"><div class="formula-label">PROOF OF PERPENDICULARITY</div><div class="formula-main">$$0 \\;=\\; \\frac{d}{dt} f(\\mathbf{r}(t)) \\;=\\; f_x \\, x'(t) \\;+\\; f_y \\, y'(t) \\;=\\; \\nabla f(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t).$$</div><div class="formula-sub">At every point on the level curve, $\\nabla f$ is orthogonal to the tangent vector $\\mathbf{r}'(t)$.</div></div>

<p class="l-text">Since $\\mathbf{r}'(t)$ at $t = 0$ is the tangent to the level curve at $\\mathbf{p}$ and the equation above says $\\nabla f(\\mathbf{p})$ is perpendicular to this tangent, the gradient is normal to the level curve.</p>

<div class="calc-example"><div class="example-label">EXAMPLE — Level Curves of a Paraboloid</div><div class="example-body">For $f(x,y) = x^2 + y^2$ the level curves $x^2 + y^2 = c$ are concentric circles around the origin. At any point $(x_0, y_0)$ on such a circle the gradient is $\\nabla f = (2x_0, 2 y_0)$ — twice the position vector, pointing radially outward. The radial direction is exactly perpendicular to the tangent line of the circle. Confirmed.</div></div>

<p class="l-text"><strong>Three-dimensional version.</strong> For a function $F : \\mathbb{R}^3 \\to \\mathbb{R}$, the level surface $\\{F(x,y,z) = c\\}$ has a tangent plane at each non-singular point. The vector $\\nabla F(\\mathbf{p}) = (F_x, F_y, F_z)$ is <em>normal</em> to this tangent plane. We use this directly in the next section to write the tangent-plane equation.</p>

<h2 class="lesson-title">8. The Tangent Plane to a Surface</h2>

<div class="calc-highlight"><strong>In one variable, the tangent line at a point is the best linear approximation of a curve.</strong> In two variables the analogous object is the tangent plane to the surface $z = f(x,y)$ — the best flat approximation to the graph near a point.</div>

<p class="l-text">Suppose $f$ is differentiable at $(x_0, y_0)$ and let $z_0 = f(x_0, y_0)$. The tangent plane to the graph of $f$ at the point $(x_0, y_0, z_0)$ has the equation</p>

<div class="calc-formula"><div class="formula-label">TANGENT PLANE TO A GRAPH</div><div class="formula-main">$$z \\;=\\; f(x_0, y_0) \\;+\\; f_x(x_0, y_0)(x - x_0) \\;+\\; f_y(x_0, y_0)(y - y_0).$$</div><div class="formula-sub">A linear function of $(x, y)$ that matches $f$ and its two partials at $(x_0, y_0)$.</div></div>

<p class="l-text">Equivalently, in normal form: rewrite as $f_x \\Delta x + f_y \\Delta y - \\Delta z = 0$, where $\\Delta x = x - x_0$, $\\Delta y = y - y_0$, $\\Delta z = z - z_0$. The vector $(f_x, f_y, -1)$ is normal to the tangent plane.</p>

<div class="calc-example"><div class="example-label">EXAMPLE — Tangent Plane to a Paraboloid</div><div class="example-body"><strong>Surface:</strong> $z = x^2 + y^2$.<br><strong>Base point:</strong> $(x_0, y_0) = (1, 2)$, so $z_0 = 1 + 4 = 5$.<br><br><strong>Partials:</strong> $f_x = 2x$, $f_y = 2y$. At $(1, 2)$: $f_x = 2$, $f_y = 4$.<br><br><strong>Tangent plane:</strong><br>$z = 5 + 2(x - 1) + 4(y - 2) = 2x + 4y - 5.$<br><br>Sanity check at the base point: $2(1) + 4(2) - 5 = 5 = z_0$. $\\checkmark$ A short distance away, e.g. at $(1.1, 2.1)$, the surface gives $z = 1.21 + 4.41 = 5.62$ while the tangent plane gives $z = 2.2 + 8.4 - 5 = 5.60$. The error is $0.02$ — small, as expected from a first-order approximation.</div></div>

<p class="l-text"><strong>Level-surface version.</strong> If a surface is described implicitly by $F(x, y, z) = c$ (e.g. the sphere $x^2 + y^2 + z^2 = R^2$), the tangent plane at $\\mathbf{p} = (x_0, y_0, z_0)$ has normal vector $\\nabla F(\\mathbf{p}) = (F_x, F_y, F_z)$. Its equation is</p>

<div class="calc-formula"><div class="formula-label">TANGENT PLANE TO A LEVEL SURFACE</div><div class="formula-main">$$F_x(\\mathbf{p})(x - x_0) \\;+\\; F_y(\\mathbf{p})(y - y_0) \\;+\\; F_z(\\mathbf{p})(z - z_0) \\;=\\; 0.$$</div><div class="formula-sub">The standard "point + normal" form for a plane in 3D.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — Tangent Plane to a Sphere</div><div class="example-body"><strong>Surface:</strong> $F(x,y,z) = x^2 + y^2 + z^2 = 9$ (sphere of radius 3).<br><strong>Point:</strong> $\\mathbf{p} = (1, 2, 2)$ (check: $1 + 4 + 4 = 9$. $\\checkmark$).<br><br>$\\nabla F = (2x, 2y, 2z)$, so $\\nabla F(\\mathbf{p}) = (2, 4, 4).$ Tangent plane:<br>$2(x - 1) + 4(y - 2) + 4(z - 2) = 0 \\;\\Longleftrightarrow\\; x + 2y + 2z = 9.$</div></div>

<h2 class="lesson-title">9. The Total Differential</h2>

<div class="calc-highlight"><strong>The total differential $df$ captures the first-order change of $f$ when all its variables vary simultaneously.</strong> It is the multivariable analogue of "$df = f'(x)\\, dx$" from single-variable calculus.</div>

<p class="l-text">For $f(x, y)$, the <strong>total differential</strong> is defined as</p>

<div class="calc-formula"><div class="formula-label">TOTAL DIFFERENTIAL — TWO VARIABLES</div><div class="formula-main">$$df \\;=\\; \\frac{\\partial f}{\\partial x}\\, dx \\;+\\; \\frac{\\partial f}{\\partial y}\\, dy.$$</div><div class="formula-sub">A linear combination of the increments $dx$ and $dy$, weighted by the partials.</div></div>

<p class="l-text">For small changes $\\Delta x$, $\\Delta y$ the resulting change $\\Delta f = f(x_0 + \\Delta x, y_0 + \\Delta y) - f(x_0, y_0)$ is approximately</p>

<p class="l-text">$$\\Delta f \\;\\approx\\; f_x(x_0, y_0)\\, \\Delta x \\;+\\; f_y(x_0, y_0)\\, \\Delta y,$$</p>

<p class="l-text">with error vanishing faster than $\\sqrt{\\Delta x^2 + \\Delta y^2}$ as the increments shrink. This is the precise statement of differentiability for multivariable functions.</p>

<div class="calc-example"><div class="example-label">EXAMPLE — Error Estimation Using $df$</div><div class="example-body">The volume of a right circular cylinder is $V(r, h) = \\pi r^2 h$. A cylinder is measured to be $r = 10$ cm and $h = 25$ cm, with uncertainties $|\\Delta r| \\le 0.1$ cm and $|\\Delta h| \\le 0.2$ cm. Estimate the uncertainty in $V$.<br><br><strong>Compute the partials:</strong><br>$V_r = 2\\pi r h, \\qquad V_h = \\pi r^2.$<br>At $(r, h) = (10, 25)$: $V_r = 500\\pi$, $V_h = 100\\pi$.<br><br><strong>Total differential:</strong><br>$dV = 500\\pi \\, dr + 100\\pi \\, dh.$<br>With $|dr| \\le 0.1$ and $|dh| \\le 0.2$:<br>$|\\Delta V| \\le 500\\pi(0.1) + 100\\pi(0.2) = 50\\pi + 20\\pi = 70\\pi \\approx 219.9 \\text{ cm}^3.$<br><br>The reported volume should therefore be $V = 2500\\pi \\pm 70\\pi \\;\\approx\\; 7854 \\pm 220$ cm$^3$.</div></div>

<p class="l-text"><strong>General formula.</strong> For a function of $n$ variables $f(x_1, \\ldots, x_n)$,</p>

<div class="calc-formula"><div class="formula-label">TOTAL DIFFERENTIAL — n VARIABLES</div><div class="formula-main">$$df \\;=\\; \\sum_{i=1}^{n} \\frac{\\partial f}{\\partial x_i}\\, dx_i \\;=\\; \\nabla f \\cdot d\\mathbf{x}.$$</div><div class="formula-sub">A neat way to package the first-order behaviour of any multivariable function.</div></div>

<h2 class="lesson-title">10. Klasik Alıştırmalar — Classical Exercises</h2>

<p class="l-text">The following five worked exercises consolidate every concept developed above. Read each one with a pencil ready: try the problem first, then compare your solution to the worked answer.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1 — Partials of $f(x,y) = x^2 y^3$</div><div class="example-body"><strong>Problem.</strong> Compute $\\partial f/\\partial x$ and $\\partial f/\\partial y$ for $f(x, y) = x^2 y^3$, and evaluate both at $(x, y) = (2, -1)$.<br><br><strong>Solution.</strong> Treating $y$ as constant in $f_x$:<br>$f_x = (\\partial/\\partial x)(x^2 y^3) = 2x \\cdot y^3 = 2x y^3.$<br>Treating $x$ as constant in $f_y$:<br>$f_y = x^2 \\cdot 3 y^2 = 3 x^2 y^2.$<br><br>At $(2, -1)$: $f_x = 2(2)(-1)^3 = -4$; &nbsp;$f_y = 3(4)(1) = 12.$</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — Gradient at a Point</div><div class="example-body"><strong>Problem.</strong> Find $\\nabla f$ for $f(x, y, z) = x^2 + y^2 - z^2 + xyz$. Evaluate at $(1, 2, 3)$ and give its magnitude.<br><br><strong>Solution.</strong> Partial by partial:<br>$f_x = 2x + yz, \\quad f_y = 2y + xz, \\quad f_z = -2z + xy.$<br><br>So $\\nabla f(x,y,z) = (2x + yz, \\; 2y + xz, \\; -2z + xy).$<br><br>At $(1, 2, 3)$:<br>$\\nabla f = (2 + 6, \\; 4 + 3, \\; -6 + 2) = (8, \\; 7, \\; -4).$<br>Magnitude: $|\\nabla f| = \\sqrt{64 + 49 + 16} = \\sqrt{129} \\approx 11.36.$</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — Tangent Plane Equation</div><div class="example-body"><strong>Problem.</strong> Find the equation of the tangent plane to the surface $z = \\sqrt{x^2 + y^2}$ (a cone) at the point $(3, 4, 5)$.<br><br><strong>Solution.</strong> Verify the base point: $\\sqrt{9 + 16} = 5.$ $\\checkmark$<br><br>Partials of $f(x,y) = \\sqrt{x^2 + y^2}$:<br>$f_x = \\dfrac{x}{\\sqrt{x^2 + y^2}}, \\qquad f_y = \\dfrac{y}{\\sqrt{x^2 + y^2}}.$<br>At $(3, 4)$: $f_x = 3/5$, $f_y = 4/5$.<br><br>Tangent-plane equation:<br>$z = 5 + \\tfrac{3}{5}(x - 3) + \\tfrac{4}{5}(y - 4),$<br>or equivalently $3x + 4y - 5z = 0.$<br><br>Note: this plane passes through the origin — a characteristic feature of the tangent planes to a cone with apex at $0$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — Directional Derivative</div><div class="example-body"><strong>Problem.</strong> For $f(x, y) = e^x \\cos y$, compute the directional derivative at $(0, \\pi/4)$ in the direction from $(0, \\pi/4)$ toward $(2, \\pi/4 + 1)$.<br><br><strong>Solution.</strong> Direction vector: $\\mathbf{v} = (2 - 0, \\; 1) = (2, 1).$ Normalise: $|\\mathbf{v}| = \\sqrt{5}$, so $\\mathbf{u} = (2/\\sqrt 5, \\; 1/\\sqrt 5).$<br><br>Partials of $f$:<br>$f_x = e^x \\cos y, \\quad f_y = -e^x \\sin y.$<br>At $(0, \\pi/4)$, $e^0 = 1$ and $\\cos(\\pi/4) = \\sin(\\pi/4) = \\sqrt 2 / 2$, so<br>$\\nabla f(0, \\pi/4) = (\\sqrt 2/2, \\; -\\sqrt 2 / 2).$<br><br>Directional derivative:<br>$D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u} = \\dfrac{\\sqrt 2}{2} \\cdot \\dfrac{2}{\\sqrt 5} \\;+\\; \\Big(-\\dfrac{\\sqrt 2}{2}\\Big) \\cdot \\dfrac{1}{\\sqrt 5} = \\dfrac{\\sqrt 2}{2\\sqrt 5} = \\dfrac{\\sqrt{10}}{10}.$<br><br>Numerically $\\sqrt{10}/10 \\approx 0.316$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — Verify Clairaut's Theorem</div><div class="example-body"><strong>Problem.</strong> For $f(x, y) = x^4 y^3 + 5 x^2 y + \\sin(xy)$, verify that $f_{xy} = f_{yx}$.<br><br><strong>Solution.</strong> First partials:<br>$f_x = 4 x^3 y^3 + 10 x y + y \\cos(xy),$<br>$f_y = 3 x^4 y^2 + 5 x^2 + x \\cos(xy).$<br><br>Mixed partial $f_{xy} = (\\partial/\\partial y) f_x$:<br>$f_{xy} = 12 x^3 y^2 + 10 x + \\cos(xy) + y \\cdot (-\\sin(xy)) \\cdot x$<br>$\\phantom{f_{xy}} = 12 x^3 y^2 + 10 x + \\cos(xy) - x y \\sin(xy).$<br><br>Other mixed partial $f_{yx} = (\\partial/\\partial x) f_y$:<br>$f_{yx} = 12 x^3 y^2 + 10 x + \\cos(xy) + x \\cdot (-\\sin(xy)) \\cdot y$<br>$\\phantom{f_{yx}} = 12 x^3 y^2 + 10 x + \\cos(xy) - x y \\sin(xy).$<br><br>The two expressions are identical — Clairaut's theorem is confirmed for this smooth example. $\\checkmark$</div></div>

<div class="l-note"><strong>Looking ahead.</strong> In the next lesson we develop the multivariable <em>chain rule</em>, which gives a clean formula for differentiating compositions like $h(t) = f(x(t), y(t))$ and $h(u, v) = f(x(u,v), y(u,v))$. After that, with all the first-order machinery in hand, we turn to second-order analysis: the Hessian, classification of critical points, and the saddle/min/max trichotomy of multivariable optimisation.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Şu ana kadar tek değişkenli fonksiyonların türevini aldık.</strong> Fakat geometri, fizik ve iktisattaki en kullanışlı fonksiyonlar aynı anda birkaç değişkene bağlıdır: bir odadaki sıcaklık üç uzaysal koordinatın fonksiyonudur, bir tepenin deniz seviyesinden yüksekliği enlem ve boylamın fonksiyonudur, bir fabrikanın üretimi sermayeye ve emeğe bağlıdır. Böyle bir fonksiyonun nasıl değiştiğini anlamak için tek bir sayı yetmez — her değişken için ayrı bir değişim oranına ihtiyacımız var.</p>

<p class="l-text">Bu derste çok değişkenli fonksiyonların kalkülüsünü inşa edeceğiz: <strong>kısmi türev</strong>, <strong>gradyan vektörü</strong>, <strong>yönlü türev</strong>, <strong>teğet düzlem</strong> ve <strong>tam diferansiyel</strong>. Karışık ikinci kısmi türevlerin eşitliğine dair Clairaut teoremini titizlikle inceleyip klasik çözümlü alıştırmalarla kapatacağız.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NELERİ ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\partial f/\\partial x$ kısmi türevini bir limit olarak tanımlamak ve bir yüzeyin dilim eğimi olarak okumak</li>
<li>Polinom, rasyonel, trigonometrik ve üstel çok değişkenli fonksiyonların kısmi türevlerini hesaplamak</li>
<li>Karışık ikinci kısmi türevlerin eşitliğine dair Clairaut teoremini ifade etmek ve uygulamak</li>
<li>Gradyan vektörünü $\\nabla f$ olarak inşa etmek ve onu en dik çıkış yönü olarak yorumlamak</li>
<li>$D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u}$ formülüyle $f$'nin herhangi bir birim vektör yönündeki değişim oranını hesaplamak</li>
<li>$z = f(x,y)$ grafiğine ve $F(x,y,z) = c$ seviye yüzeyine teğet düzlem denklemini yazmak</li>
<li>Tam diferansiyel $df$'i anlamak ve onu birinci derece lineer yaklaşıklama için kullanmak</li>
</ul>
</div>

<h2 class="lesson-title">1. Tek Değişkenden Çoğa</h2>

<div class="calc-highlight"><strong>Tek değişkenli bir fonksiyon bir eğri üretir; iki değişkenli bir fonksiyon bir yüzey üretir.</strong> Yüksek boyutlarda diferansiyel kalkülüs, bir yüzey üzerinde tek bir eğim kavramının bulunmadığının fark edilmesiyle başlar — her noktada eğim, hangi yönde yürüdüğünüze bağlıdır.</div>

<p class="l-text">Tek değişkenli resmi hatırlayalım. Bir $f : \\mathbb{R} \\to \\mathbb{R}$ fonksiyonu her $x$ gerçek sayısına bir $f(x)$ gerçek sayısı eşler. Grafiği düzlemde bir eğridir ve türev</p>

<div class="calc-formula"><div class="formula-label">TEK DEĞİŞKENLİ TÜREV</div><div class="formula-main">$$f'(x) \\;=\\; \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$</div><div class="formula-sub">Her noktada tek bir sayı: tek olan teğet doğrunun eğimi.</div></div>

<p class="l-text"><strong>İki değişkenli bir fonksiyon</strong> her $(x, y)$ noktasına bir $f(x, y)$ sayısı eşleyen bir $f : \\mathbb{R}^2 \\to \\mathbb{R}$ dönüşümüdür. Grafiği, üç boyutlu uzayda $\\{(x, y, z) : z = f(x, y)\\}$ yüzeyidir. Üç somut örnek bu geometriyi netleştirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Paraboloit</div><div class="card-body">$f(x,y) = x^2 + y^2$. Yukarı doğru açılan, $z$-eksenine göre simetrik bir kase. Seviye eğrileri $x^2 + y^2 = c$, eş merkezli çemberlerdir.</div><div class="card-formula">$z = x^2 + y^2$</div></div>
<div class="calc-card"><div class="card-title">Eyer</div><div class="card-body">$f(x,y) = x^2 - y^2$. Bir at eyeri: $x$ yönünde yukarı, $y$ yönünde aşağı eğrilik. Seviye eğrileri hiperboldür.</div><div class="card-formula">$z = x^2 - y^2$</div></div>
<div class="calc-card"><div class="card-title">Düzlem</div><div class="card-body">$f(x,y) = 2x + 3y + 1$. Eğik bir düz düzlem. Her yöndeki eğimi sabittir — en basit aşikar olmayan çok değişkenli fonksiyon.</div><div class="card-formula">$z = 2x + 3y + 1$</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-surface-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $[-2, 2] \\times [-2, 2]$ karesi üzerinde $z = x^2 + y^2$ paraboloitini. Yüzeyi $y = y_0$ dikey düzlemiyle kesmek $xz$-düzleminde bir parabol verir; bu parabolün bir noktadaki eğimi o noktadaki $\\partial f/\\partial x$ kısmi türevidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[],zs=[];
for(var i=0;i<=40;i++){var rowz=[];for(var j=0;j<=40;j++){var x=-2+4*j/40,y=-2+4*i/40;rowz.push(x*x+y*y);}zs.push(rowz);}
for(var k=0;k<=40;k++){xs.push(-2+4*k/40);ys.push(-2+4*k/40);}
var data=[{type:'surface',x:xs,y:ys,z:zs,colorscale:[[0,'rgba(59,130,246,0.85)'],[0.5,'rgba(168,85,247,0.65)'],[1,'rgba(245,158,11,0.85)']],opacity:0.9,showscale:false,contours:{z:{show:true,usecolormap:true,project:{z:true}}}}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)'},zaxis:{title:'z = f(x,y)',gridcolor:'rgba(255,255,255,0.07)'},bgcolor:'#0a0a0a'},margin:{t:10,r:10,b:10,l:10}};
Plotly.newPlot('plot-l3-surface-tr',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">Bir eğri üzerinde her noktada tek bir teğet doğru vardır. Bir yüzey üzerinde ise her noktada bütün bir teğet yön düzlemi vardır. Tam bilgiyi yakalamak için tek bir sayı yetmez; her bağımsız yön için ayrı bir eğim gerekir. En basit seçim iki koordinat yönüdür ve elde edilen eğimler kısmi türevlerdir.</p>

<h2 class="lesson-title">2. Kısmi Türev</h2>

<div class="calc-highlight"><strong>Kısmi türev sıradan bir türevdir — diğer tüm değişkenler sabit tutulurken bir değişkene göre alınır.</strong> Yunan harfi $\\partial$ (bazen "del" veya "yuvarlak d"), fonksiyonun birçok değişkene bağlı olduğunu ama yalnızca birinin değiştirildiğini belirtir.</div>

<p class="l-text">Biçimsel olarak: bir $(x_0, y_0)$ noktasını sabitleyip ikinci koordinatı $y_0$ değerinde donduralım. Tek değişkenli $g(x) = f(x, y_0)$ fonksiyonunun $x_0$ noktasında sıradan bir türevi vardır. Bu sayıyı $f$'nin $(x_0, y_0)$ noktasındaki <strong>$x$'e göre kısmi türevi</strong> olarak adlandırırız:</p>

<div class="calc-formula"><div class="formula-label">TANIM — LİMİT OLARAK KISMİ TÜREVLER</div><div class="formula-main">$$\\frac{\\partial f}{\\partial x}(x_0, y_0) \\;=\\; \\lim_{h \\to 0} \\frac{f(x_0 + h, y_0) - f(x_0, y_0)}{h}$$<br>$$\\frac{\\partial f}{\\partial y}(x_0, y_0) \\;=\\; \\lim_{h \\to 0} \\frac{f(x_0, y_0 + h) - f(x_0, y_0)}{h}$$</div><div class="formula-sub">Her kısmi türev sıradan bir tek değişkenli limittir: değişen tek şey hangi koordinatın hareket edebileceğidir.</div></div>

<p class="l-text">Alternatif gösterimler aynı nesneyi ifade eder. $f_x(x_0, y_0)$, $\\partial_x f(x_0, y_0)$, $D_1 f(x_0, y_0)$ ve $\\tfrac{\\partial f}{\\partial x}\\big|_{(x_0, y_0)}$ ifadeleri eşdeğerdir. Hangisi bağlama daha uygunsa onu kullanacağız.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SIRADAN TÜREV</div><div class="compare-item">$\\bullet$ Tek bağımsız değişken: $f(x)$</div><div class="compare-item">$\\bullet$ Gösterim: $\\tfrac{df}{dx}$, $f'(x)$</div><div class="compare-item">$\\bullet$ Sonuç: nokta başına bir sayı</div><div class="compare-item">$\\bullet$ Tek olan teğet doğrunun eğimi</div></div><div class="compare-col"><div class="compare-title">KISMİ TÜREV</div><div class="compare-item">$\\bullet$ Birkaç bağımsız değişken: $f(x, y, \\ldots)$</div><div class="compare-item">$\\bullet$ Gösterim: $\\tfrac{\\partial f}{\\partial x}$, $f_x$</div><div class="compare-item">$\\bullet$ Sonuç: değişken başına, nokta başına bir sayı</div><div class="compare-item">$\\bullet$ Yüzeyden alınan bir dilimin eğimi</div></div></div>

<p class="l-text"><strong>Geometrik resim.</strong> $y = y_0$ dikey düzlemi $z = f(x, y)$ yüzeyini bir eğride keser. Bu eğri 2 boyutlu bir düzlemde (koordinatları $x$ ve $z$) yaşar ve her noktada iyi tanımlı bir eğime sahiptir. $x = x_0$'da hesaplanan bu eğim tam olarak $f_x(x_0, y_0)$'dır. Benzer şekilde $x = x_0$ ile dilimleme, $y_0$'daki eğimi $f_y(x_0, y_0)$ olan bir eğri verir.</p>

<div class="calc-example"><div class="example-label">FİZİKSEL YORUM — Bir Levhada Sıcaklık</div><div class="example-body">$T(x, y)$, ince bir metal levhanın $(x, y)$ noktasındaki kararlı durum sıcaklığı olsun. O zaman $T_x(x_0, y_0)$, $(x_0, y_0)$'dan saf olarak $+x$-yönüne (haritada güneyden kuzeye) hareket ederseniz sıcaklığın artma hızıdır. $T_y$ ise saf olarak $+y$-yönüne (batıdan doğuya) hareket etmenin verdiği hızdır. Her iki kısmi türevi de bir noktada bilmek size sıcaklık gradyanını verir: metalin en sıcak olduğu yön ve sıcaklığın ne kadar dik arttığı.</div></div>

<h2 class="lesson-title">3. Pratikte Kısmi Türev Hesabı</h2>

<div class="calc-highlight"><strong>Mekanik kural.</strong> $\\partial f/\\partial x$'i hesaplamak için $x$ dışındaki her değişkeni sabit olarak kabul edin ve sıradan tek değişkenli türev kurallarını uygulayın. $\\tfrac{d}{dx}$ için öğrendiğiniz aynı cebir — kuvvet kuralı, çarpım kuralı, bölüm kuralı, zincir kuralı — değişiklik gerektirmez.</div>

<p class="l-text">Beş çözümlü örnek, prosedürü yaygın fonksiyon sınıflarında somutlaştırır.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — Polinom</div><div class="example-body"><strong>Fonksiyon:</strong> $f(x, y) = x^3 y^2 + 4xy - 7y^4 + 5$.<br><br><strong>$f_x$'i hesapla</strong> ($y$ sabit alınır):<br>$\\bullet$ $x^3 y^2 \\;\\to\\; 3x^2 y^2$ &nbsp;($x$ üzerinde kuvvet kuralı, $y^2$ çarpanı kalır).<br>$\\bullet$ $4xy \\;\\to\\; 4y$ &nbsp;($4y$ çarpanı $x$'e göre sabittir).<br>$\\bullet$ $-7y^4 \\;\\to\\; 0$ &nbsp;(içinde $x$ yok).<br>$\\bullet$ $5 \\;\\to\\; 0$.<br>$\\Rightarrow f_x(x,y) = 3x^2 y^2 + 4y$.<br><br><strong>$f_y$'yi hesapla</strong> ($x$ sabit alınır):<br>$\\bullet$ $x^3 y^2 \\;\\to\\; 2 x^3 y$.<br>$\\bullet$ $4xy \\;\\to\\; 4x$.<br>$\\bullet$ $-7y^4 \\;\\to\\; -28 y^3$.<br>$\\bullet$ $5 \\;\\to\\; 0$.<br>$\\Rightarrow f_y(x,y) = 2x^3 y + 4x - 28 y^3$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — Trigonometrik</div><div class="example-body"><strong>Fonksiyon:</strong> $f(x, y) = \\sin(x y)$.<br><br>Zincir kuralı ile $\\sin(u)$'nun türevi $\\cos(u) \\cdot u'$. $f_x$ için iç fonksiyon $u = xy$, $\\tfrac{\\partial u}{\\partial x} = y$:<br>$\\Rightarrow f_x = y \\cos(xy).$<br><br>Simetrik olarak $\\tfrac{\\partial u}{\\partial y} = x$, dolayısıyla $f_y = x \\cos(xy).$</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — Üstel</div><div class="example-body"><strong>Fonksiyon:</strong> $f(x, y) = e^{x^2 + y^2}$.<br><br>$e^u$'nun herhangi bir değişkene göre türevi $e^u \\cdot u'$'dur. $u = x^2 + y^2$ için $u_x = 2x$ ve $u_y = 2y$:<br>$f_x = 2x \\, e^{x^2 + y^2}, \\qquad f_y = 2y \\, e^{x^2 + y^2}.$</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — Rasyonel</div><div class="example-body"><strong>Fonksiyon:</strong> $f(x, y) = \\dfrac{x}{x + y}$.<br><br>$u = x$ ve $v = x + y$ ile bölüm kuralı. $f_x$ için: $u_x = 1$, $v_x = 1$, yani<br>$f_x = \\dfrac{1 \\cdot (x+y) - x \\cdot 1}{(x+y)^2} = \\dfrac{y}{(x+y)^2}.$<br><br>$f_y$ için: $u_y = 0$, $v_y = 1$, yani<br>$f_y = \\dfrac{0 \\cdot (x+y) - x \\cdot 1}{(x+y)^2} = \\dfrac{-x}{(x+y)^2}.$</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 5 — Üç Değişken (İktisat)</div><div class="example-body"><strong>Cobb-Douglas üretim fonksiyonu:</strong> $Q(K, L, M) = K^{0.3}\\, L^{0.5}\\, M^{0.2}$. Burada $K$, $L$, $M$ sermayeyi, emeği ve malzemeyi gösterir.<br><br><em>Sermayenin marjinal verimi</em> $\\partial Q/\\partial K$'dır. $L$ ve $M$ sabit alınırsa:<br>$\\dfrac{\\partial Q}{\\partial K} = 0.3 \\, K^{-0.7} L^{0.5} M^{0.2} = 0.3 \\, \\dfrac{Q}{K}.$<br><br>Benzer şekilde $\\partial Q/\\partial L = 0.5\\, Q/L$ ve $\\partial Q/\\partial M = 0.2 \\, Q/M$. Üsler aynen marjinal üretim esnekliklerine eşittir — kısmi türevin çarpıcı bir cebirsel sonucu.</div></div>

<h2 class="lesson-title">4. Yüksek Mertebeden Kısmiler ve Clairaut Teoremi</h2>

<div class="calc-highlight"><strong>Tek değişkenli bir fonksiyonun ikinci türevi olduğu gibi, çok değişkenli bir fonksiyonun da ikinci mertebeden kısmileri vardır.</strong> Şimdi birkaç olasılık var — $f_{xx}$, $f_{xy}$, $f_{yx}$, $f_{yy}$ — ve çarpıcı bir teorem, iyi davranışlı fonksiyonlar için karışık kısmilerin eşit olduğunu söyler.</div>

<p class="l-text">$f(x, y)$'nin dört ikinci mertebeden kısmı, her birinci kısmi her iki değişkene göre yeniden türetilerek elde edilir:</p>

<div class="calc-formula"><div class="formula-label">İKİNCİ MERTEBEDEN KISMİLER</div><div class="formula-main">$$f_{xx} = \\frac{\\partial^2 f}{\\partial x^2} = \\frac{\\partial}{\\partial x}\\!\\left(\\frac{\\partial f}{\\partial x}\\right), \\qquad f_{yy} = \\frac{\\partial^2 f}{\\partial y^2} = \\frac{\\partial}{\\partial y}\\!\\left(\\frac{\\partial f}{\\partial y}\\right)$$<br>$$f_{xy} = \\frac{\\partial^2 f}{\\partial y \\, \\partial x} = \\frac{\\partial}{\\partial y}\\!\\left(\\frac{\\partial f}{\\partial x}\\right), \\qquad f_{yx} = \\frac{\\partial^2 f}{\\partial x \\, \\partial y} = \\frac{\\partial}{\\partial x}\\!\\left(\\frac{\\partial f}{\\partial y}\\right)$$</div><div class="formula-sub">$f_{xx}$ ve $f_{yy}$ saf ikinci kısmilerdir. $f_{xy}$ ve $f_{yx}$ <em>karışık</em> ikinci kısmilerdir — ve sorunun anlamlı olabilmesi için yeterince düzgün her fonksiyon için bunlar eşittir.</div></div>

<div class="calc-example"><div class="example-label">TEOREM — Clairaut (Schwarz)</div><div class="example-body">$f$, $(x_0, y_0)$ etrafında açık bir disk üzerinde tanımlı olsun ve $f_{xy}$ ile $f_{yx}$ her ikisi de bu disk üzerinde mevcut ve sürekli olsun. O zaman<br>$$f_{xy}(x_0, y_0) = f_{yx}(x_0, y_0).$$<br>Geometrik olarak: iki kısmi türevi hangi sırada alacağınız fark etmez.</div></div>

<p class="l-text"><strong>Polinomda doğrulama.</strong> $f(x,y) = x^3 y^2 + 4xy$ alalım. $f_x = 3x^2 y^2 + 4y$ ve $f_y = 2x^3 y + 4x$ olduğunu hesapladık. O zaman</p>

<div class="calc-formula"><div class="formula-label">CLAIRAUT'U KONTROL ETME</div><div class="formula-main">$$f_{xy} = \\frac{\\partial}{\\partial y}(3x^2 y^2 + 4y) = 6 x^2 y + 4$$<br>$$f_{yx} = \\frac{\\partial}{\\partial x}(2 x^3 y + 4x) = 6 x^2 y + 4$$</div><div class="formula-sub">İki karışık kısmi aynıdır, tıpkı Clairaut teoreminin garanti ettiği gibi.</div></div>

<p class="l-text"><strong>Bağımsız ikinci kısmilerden oluşan $\\{f_{xx}, f_{xy}, f_{yy}\\}$ topluluğu</strong> bazen simetrik bir matris olan <em>Hessian</em> $H$'da toplanır — ama bu, optimizasyon konulu sonraki bir ders için bir hikâyedir. Şimdilik mesaj nettir: düzgün fonksiyonlar için çapraz türevler değişmelidir, yani $f$'i önce $x$'e sonra $y$'ye veya önce $y$'ye sonra $x$'e göre türetebilirsiniz; cevap aynıdır.</p>

<div class="l-note"><strong>Clairaut ne zaman başarısız olur?</strong> Karışık kısmilerin sürekliliği şarttır. Ders kitabı karşı örneği $f(x,y) = xy(x^2 - y^2)/(x^2 + y^2)$, $f(0,0) = 0$ ile: gösterilebilir ki $f_{xy}(0,0) = 1$ ama $f_{yx}(0,0) = -1$. Pratikte karşılaşacağımız her fonksiyon için bu patoloji ortaya çıkmaz.</div>

<h2 class="lesson-title">5. Gradyan Vektörü $\\nabla f$</h2>

<div class="calc-highlight"><strong>Kısmileri tek bir vektörde toplamak skaler kalkülüsü vektör kalkülüsüne dönüştürür.</strong> Bileşenleri $f$'nin kısmileri olan vektöre gradyan denir. Bir noktada $f$'nin birinci dereceden davranışı hakkında bilinmesi gereken <em>her şeyi</em> kodlar.</div>

<p class="l-text">İki değişkenli fonksiyon için,</p>

<div class="calc-formula"><div class="formula-label">İKİ DEĞİŞKENDE GRADYAN</div><div class="formula-main">$$\\nabla f(x, y) \\;=\\; \\Big(\\, f_x(x,y), \\; f_y(x, y) \\,\\Big) \\;=\\; \\begin{pmatrix} \\partial f / \\partial x \\\\[4pt] \\partial f / \\partial y \\end{pmatrix}.$$</div><div class="formula-sub">Düzlem üzerinde bir vektör alanı: her $(x, y)$ noktasında, bileşenleri iki kısmi türev olan bir ok döndürür.</div></div>

<p class="l-text">Üç veya daha fazla değişken için tanım analogtur: $\\nabla f = (f_{x_1}, f_{x_2}, \\ldots, f_{x_n})$. $\\nabla$ sembolü (nabla, "del" olarak da bilinir) bir vektör diferansiyel operatörüdür</p>

<p class="l-text">$$\\nabla \\;=\\; \\left(\\frac{\\partial}{\\partial x_1}, \\frac{\\partial}{\\partial x_2}, \\ldots, \\frac{\\partial}{\\partial x_n}\\right).$$</p>

<p class="l-text">$\\nabla$'yı bir $f$ skaler fonksiyonuna uygulamak bileşenleri kısmiler olan $\\nabla f$ vektörünü üretir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — Bir Noktada Gradyan</div><div class="example-body">$f(x, y) = x^2 + 3xy + y^2$ için:<br>$f_x = 2x + 3y, \\qquad f_y = 3x + 2y.$<br><br>Gradyan alanı $\\nabla f(x,y) = (2x + 3y, \\; 3x + 2y)$. $(1, 2)$ noktasında değerlendirilirse:<br>$\\nabla f(1, 2) = (2 \\cdot 1 + 3 \\cdot 2, \\; 3 \\cdot 1 + 2 \\cdot 2) = (8, \\; 7).$<br><br>Bu vektör $xy$-düzleminde yaşar (3 boyutlu uzayda değil!) ve büyüklüğü $|\\nabla f(1,2)| = \\sqrt{64 + 49} = \\sqrt{113} \\approx 10.63$'tür.</div></div>

<div class="calc-graph"><div id="plot-l3-gradfield-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $[-2,2]\\times[-2,2]$ karesi üzerinde $f(x,y) = x^2 + y^2$'nin gradyan alanı. Her ızgara noktasında ok orijinden uzağa doğru gösterir — $f$'nin en hızlı arttığı yön — ve uzunluğu $|\\nabla f| = 2\\sqrt{x^2+y^2}$ ile orantılıdır. Orijine yakın gradyan küçüktür (yüzey neredeyse düzdür); orijinden uzakta büyüktür (yüzey diktir).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
for(var i=-2;i<=2;i+=0.5){for(var j=-2;j<=2;j+=0.5){if(i===0&&j===0)continue;var gx=2*i,gy=2*j;var nrm=Math.sqrt(gx*gx+gy*gy);var s=0.15;var ex=i+s*gx/nrm,ey=j+s*gy/nrm;traces.push({x:[i,ex],y:[j,ey],mode:'lines',line:{color:'#3b82f6',width:1.6},showlegend:false,hoverinfo:'skip'});traces.push({x:[ex],y:[ey],mode:'markers',marker:{color:'#3b82f6',size:5,symbol:'triangle-up',angle:Math.atan2(gy,gx)*180/Math.PI-90},showlegend:false,hoverinfo:'skip'});}}
var cx=[],cy=[];for(var k=0;k<=200;k++){var t=2*Math.PI*k/200;cx.push(Math.cos(t));cy.push(Math.sin(t));}traces.push({x:cx,y:cy,mode:'lines',line:{color:'#f59e0b',width:2,dash:'dot'},name:'seviye eğrisi f=1'});
var cx2=[],cy2=[];for(var k=0;k<=200;k++){var t=2*Math.PI*k/200;cx2.push(Math.sqrt(2)*Math.cos(t));cy2.push(Math.sqrt(2)*Math.sin(t));}traces.push({x:cx2,y:cy2,mode:'lines',line:{color:'#f59e0b',width:2,dash:'dot'},name:'seviye eğrisi f=2'});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-2.3,2.3],scaleanchor:'y'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-2.3,2.3]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-gradfield-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Çok önemli geometrik gerçek</strong> — sonraki iki bölümde kanıtlanır — bir noktadaki $\\nabla f$'nin $f$'nin <em>en dik artış</em> yönünde gösterdiği ve büyüklüğünün $|\\nabla f|$'nin bu maksimum artışın hızına eşit olduğudur. Karşı yön $-\\nabla f$ ise en dik düşüş yönüdür.</p>

<h2 class="lesson-title">6. Yönlü Türev</h2>

<div class="calc-highlight"><strong>Kısmi türevler yalnızca koordinat eksenleri boyunca değişim oranlarını ölçer.</strong> Ama bir yüzey üzerinde her yöne yürünebilir. <em>Yönlü türev</em> $D_{\\mathbf{u}} f$ kısmileri keyfi bir birim vektör $\\mathbf{u}$'ya genelleştirir.</div>

<p class="l-text">$\\mathbf{p} = (x_0, y_0)$ noktasını ve $u_1^2 + u_2^2 = 1$ olan birim vektör $\\mathbf{u} = (u_1, u_2)$'yu sabitleyelim. $\\mathbf{p}$'den $\\mathbf{u}$ yönünde birim hızla yürüyün: $h$ zamanda konumunuz $\\mathbf{p} + h \\mathbf{u}$'dur. $f$'nin bu yol boyunca değişim hızı yönlü türevdir.</p>

<div class="calc-formula"><div class="formula-label">TANIM — YÖNLÜ TÜREV</div><div class="formula-main">$$D_{\\mathbf{u}} f(\\mathbf{p}) \\;=\\; \\lim_{h \\to 0} \\frac{f(\\mathbf{p} + h \\mathbf{u}) - f(\\mathbf{p})}{h}.$$</div><div class="formula-sub">$\\{\\mathbf{p} + h\\mathbf{u}\\}$ doğrusu boyunca alınan tek değişkenli bir limit.</div></div>

<p class="l-text">$\\mathbf{u}$ standart taban vektörlerinden biri olduğunda yönlü türev bir kısmiye indirgenir. $\\mathbf{u} = (1, 0)$ ile $D_{\\mathbf{u}} f = f_x$'i kurtarırız; $\\mathbf{u} = (0, 1)$ ile $f_y$'yi. Yönlü türev gerçekten daha geneldir.</p>

<div class="calc-example"><div class="example-label">TEOREM — Yönlü Türev için Gradyan Formülü</div><div class="example-body">$f$, $\\mathbf{p}$'de türetilebilir ve $\\mathbf{u}$ bir birim vektör ise,<br>$$D_{\\mathbf{u}} f(\\mathbf{p}) \\;=\\; \\nabla f(\\mathbf{p}) \\cdot \\mathbf{u}.$$<br>Yönlü türev, gradyanın yönle nokta çarpımıdır.</div></div>

<p class="l-text"><strong>Kanıt taslağı.</strong> $\\phi(h) = f(\\mathbf{p} + h\\mathbf{u}) = f(x_0 + h u_1, y_0 + h u_2)$ olsun. Zincir kuralıyla (Ders 4'te titizlikle ele alınır),</p>

<p class="l-text">$$\\phi'(0) \\;=\\; f_x(\\mathbf{p}) \\cdot u_1 \\;+\\; f_y(\\mathbf{p}) \\cdot u_2 \\;=\\; \\nabla f(\\mathbf{p}) \\cdot \\mathbf{u}.$$</p>

<p class="l-text">$D_{\\mathbf{u}} f(\\mathbf{p}) = \\phi'(0)$ olduğundan formül elde edilir. $\\square$</p>

<div class="calc-example"><div class="example-label">ÖRNEK — Belirli Bir Yöndeki Yönlü Türev</div><div class="example-body"><strong>Fonksiyon:</strong> $f(x,y) = x^2 + 3xy + y^2$, nokta $(1, 2)$, $\\mathbf{v} = (3, 4)$ vektörü yönünde.<br><br><strong>Adım 1.</strong> $\\mathbf{v}$'yi normleştir: $|\\mathbf{v}| = \\sqrt{9 + 16} = 5$, yani $\\mathbf{u} = (3/5, 4/5)$.<br><br><strong>Adım 2.</strong> §5'ten $\\nabla f(1, 2) = (8, 7)$.<br><br><strong>Adım 3.</strong> Nokta çarpımı:<br>$D_{\\mathbf{u}} f(1, 2) = (8, 7) \\cdot (3/5, 4/5) = \\dfrac{24 + 28}{5} = \\dfrac{52}{5} = 10.4.$<br><br>Yani yaklaşık olarak sağ-üste doğru olan birim vektör boyunca, $f$ birim uzaklık başına $10.4$ oranında artar.</div></div>

<p class="l-text"><strong>Yönlü türevi maksimize etme.</strong> $\\nabla f \\cdot \\mathbf{u}$ nokta çarpımını $\\nabla f$ ile $\\mathbf{u}$ arasındaki $\\theta$ açısı cinsinden yazabiliriz:</p>

<p class="l-text">$$D_{\\mathbf{u}} f \\;=\\; |\\nabla f| \\, |\\mathbf{u}| \\, \\cos \\theta \\;=\\; |\\nabla f| \\cos \\theta.$$</p>

<p class="l-text">$\\cos \\theta$ maksimum $(= 1)$ değeri $\\theta = 0$ olduğunda alır; o yüzden yönlü türev $\\mathbf{u} = \\nabla f / |\\nabla f|$ yönünde — yani gradyan yönünde — en büyüktür. Maksimum değeri $|\\nabla f|$'dir. Benzer şekilde minimum, $-|\\nabla f|$, $-\\nabla f$ yönünde elde edilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">En Dik Yükseliş</div><div class="card-body">$\\mathbf{u} = \\nabla f / |\\nabla f|.$ Fonksiyon bu yönde en hızlı yükselir; hız $|\\nabla f|$.</div><div class="card-formula">$\\theta = 0$</div></div>
<div class="calc-card"><div class="card-title">En Dik İniş</div><div class="card-body">$\\mathbf{u} = -\\nabla f / |\\nabla f|.$ Fonksiyon en hızlı düşer; hız $-|\\nabla f|$.</div><div class="card-formula">$\\theta = \\pi$</div></div>
<div class="calc-card"><div class="card-title">Seviye Yönü</div><div class="card-body">$\\mathbf{u} \\perp \\nabla f.$ Yönlü türev sıfırdır — bu yönde hareket $f$'yi sabit tutar.</div><div class="card-formula">$\\theta = \\pi/2$</div></div>
</div>

<h2 class="lesson-title">7. Geometrik Anlam: $\\nabla f$ Seviye Eğrilerine Diktir</h2>

<div class="calc-highlight"><strong>Çok değişkenli kalkülüsün en zarif gerçeklerinden biri.</strong> Bir noktadaki gradyan, o noktadan geçen $f$ seviye eğrisine diktir. Aynı ifade herhangi bir boyutta geçerlidir: $\\nabla F$, $\\{F = c\\}$ seviye yüzeyine normaldir.</div>

<p class="l-text">$f : \\mathbb{R}^2 \\to \\mathbb{R}$'nin <strong>seviye eğrisi</strong>, verilen bir $c$ sabiti için $\\{(x,y) : f(x,y) = c\\}$ kümesidir. $\\mathbf{r}(t) = (x(t), y(t))$, $\\mathbf{p} = \\mathbf{r}(0)$ noktasından geçen seviye eğrisinin düzgün bir parametrizasyonu olsun. O zaman tüm $t$ için $f(\\mathbf{r}(t)) = c$; $t$'ye göre türev alarak,</p>

<div class="calc-formula"><div class="formula-label">DİKLİĞİN KANITI</div><div class="formula-main">$$0 \\;=\\; \\frac{d}{dt} f(\\mathbf{r}(t)) \\;=\\; f_x \\, x'(t) \\;+\\; f_y \\, y'(t) \\;=\\; \\nabla f(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t).$$</div><div class="formula-sub">Seviye eğrisi üzerindeki her noktada $\\nabla f$, $\\mathbf{r}'(t)$ teğet vektörüne ortogonaldir.</div></div>

<p class="l-text">$t = 0$'da $\\mathbf{r}'(t)$ $\\mathbf{p}$'deki seviye eğrisine teğet olduğundan ve yukarıdaki denklem $\\nabla f(\\mathbf{p})$'nin bu teğete dik olduğunu söylediğinden, gradyan seviye eğrisine normaldir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — Bir Paraboloidin Seviye Eğrileri</div><div class="example-body">$f(x,y) = x^2 + y^2$ için seviye eğrileri $x^2 + y^2 = c$, orijin merkezli eş merkezli çemberlerdir. Böyle bir çember üzerindeki herhangi bir $(x_0, y_0)$ noktasında gradyan $\\nabla f = (2x_0, 2 y_0)$ — konum vektörünün iki katı, radyal olarak dışa doğru gösterir. Radyal yön, çemberin teğet doğrusuna tam olarak diktir. Doğrulandı.</div></div>

<p class="l-text"><strong>Üç boyutlu sürüm.</strong> Bir $F : \\mathbb{R}^3 \\to \\mathbb{R}$ fonksiyonu için $\\{F(x,y,z) = c\\}$ seviye yüzeyinin her tekil olmayan noktada bir teğet düzlemi vardır. $\\nabla F(\\mathbf{p}) = (F_x, F_y, F_z)$ vektörü bu teğet düzleme <em>normaldir</em>. Sonraki bölümde bunu doğrudan teğet düzlem denklemini yazmak için kullanırız.</p>

<h2 class="lesson-title">8. Bir Yüzeye Teğet Düzlem</h2>

<div class="calc-highlight"><strong>Tek değişkende bir noktadaki teğet doğru, bir eğrinin en iyi lineer yaklaşımıdır.</strong> İki değişkende analog nesne $z = f(x,y)$ yüzeyine teğet düzlemdir — bir nokta yakınında grafiğin en iyi düz yaklaşımı.</div>

<p class="l-text">$f$, $(x_0, y_0)$'da türetilebilir olsun ve $z_0 = f(x_0, y_0)$ olsun. $f$'nin grafiğine $(x_0, y_0, z_0)$ noktasında teğet düzlemin denklemi</p>

<div class="calc-formula"><div class="formula-label">GRAFİĞE TEĞET DÜZLEM</div><div class="formula-main">$$z \\;=\\; f(x_0, y_0) \\;+\\; f_x(x_0, y_0)(x - x_0) \\;+\\; f_y(x_0, y_0)(y - y_0).$$</div><div class="formula-sub">$(x_0, y_0)$'da $f$ ile iki kısmisine de uyan, $(x, y)$'nin lineer fonksiyonu.</div></div>

<p class="l-text">Eşdeğer olarak normal formda: $f_x \\Delta x + f_y \\Delta y - \\Delta z = 0$ olarak yeniden yazılır, burada $\\Delta x = x - x_0$, $\\Delta y = y - y_0$, $\\Delta z = z - z_0$. $(f_x, f_y, -1)$ vektörü teğet düzleme normaldir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — Bir Paraboloide Teğet Düzlem</div><div class="example-body"><strong>Yüzey:</strong> $z = x^2 + y^2$.<br><strong>Taban nokta:</strong> $(x_0, y_0) = (1, 2)$, yani $z_0 = 1 + 4 = 5$.<br><br><strong>Kısmiler:</strong> $f_x = 2x$, $f_y = 2y$. $(1, 2)$'de: $f_x = 2$, $f_y = 4$.<br><br><strong>Teğet düzlem:</strong><br>$z = 5 + 2(x - 1) + 4(y - 2) = 2x + 4y - 5.$<br><br>Taban noktada kontrol: $2(1) + 4(2) - 5 = 5 = z_0$. $\\checkmark$ Yakın bir mesafede, örneğin $(1.1, 2.1)$'de, yüzey $z = 1.21 + 4.41 = 5.62$ verirken teğet düzlem $z = 2.2 + 8.4 - 5 = 5.60$ verir. Hata $0.02$ — birinci dereceden bir yaklaşımdan beklendiği gibi küçük.</div></div>

<p class="l-text"><strong>Seviye-yüzey sürümü.</strong> Bir yüzey $F(x, y, z) = c$ ile örtük olarak tarif edilirse (örn. $x^2 + y^2 + z^2 = R^2$ küresi), $\\mathbf{p} = (x_0, y_0, z_0)$'daki teğet düzlemin normal vektörü $\\nabla F(\\mathbf{p}) = (F_x, F_y, F_z)$'dir. Denklemi</p>

<div class="calc-formula"><div class="formula-label">SEVİYE YÜZEYİNE TEĞET DÜZLEM</div><div class="formula-main">$$F_x(\\mathbf{p})(x - x_0) \\;+\\; F_y(\\mathbf{p})(y - y_0) \\;+\\; F_z(\\mathbf{p})(z - z_0) \\;=\\; 0.$$</div><div class="formula-sub">3 boyutlu uzayda bir düzlem için standart "nokta + normal" formu.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — Küreye Teğet Düzlem</div><div class="example-body"><strong>Yüzey:</strong> $F(x,y,z) = x^2 + y^2 + z^2 = 9$ (yarıçap 3 olan küre).<br><strong>Nokta:</strong> $\\mathbf{p} = (1, 2, 2)$ (kontrol: $1 + 4 + 4 = 9$. $\\checkmark$).<br><br>$\\nabla F = (2x, 2y, 2z)$, yani $\\nabla F(\\mathbf{p}) = (2, 4, 4).$ Teğet düzlem:<br>$2(x - 1) + 4(y - 2) + 4(z - 2) = 0 \\;\\Longleftrightarrow\\; x + 2y + 2z = 9.$</div></div>

<h2 class="lesson-title">9. Tam Diferansiyel</h2>

<div class="calc-highlight"><strong>Tam diferansiyel $df$, $f$'nin tüm değişkenleri aynı anda değiştiğinde birinci dereceden değişimini yakalar.</strong> Bu, tek değişkenli kalkülüsten gelen "$df = f'(x)\\, dx$"in çok değişkenli analogudur.</div>

<p class="l-text">$f(x, y)$ için <strong>tam diferansiyel</strong></p>

<div class="calc-formula"><div class="formula-label">TAM DİFERANSİYEL — İKİ DEĞİŞKEN</div><div class="formula-main">$$df \\;=\\; \\frac{\\partial f}{\\partial x}\\, dx \\;+\\; \\frac{\\partial f}{\\partial y}\\, dy.$$</div><div class="formula-sub">Kısmilerle ağırlıklandırılmış $dx$ ve $dy$ artımlarının lineer kombinasyonu.</div></div>

<p class="l-text">Küçük değişimler $\\Delta x$, $\\Delta y$ için ortaya çıkan değişim $\\Delta f = f(x_0 + \\Delta x, y_0 + \\Delta y) - f(x_0, y_0)$ yaklaşık olarak</p>

<p class="l-text">$$\\Delta f \\;\\approx\\; f_x(x_0, y_0)\\, \\Delta x \\;+\\; f_y(x_0, y_0)\\, \\Delta y,$$</p>

<p class="l-text">olur, artımlar küçüldükçe hata $\\sqrt{\\Delta x^2 + \\Delta y^2}$'den daha hızlı söner. Bu, çok değişkenli fonksiyonlar için türetilebilirliğin kesin ifadesidir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — $df$ ile Hata Tahmini</div><div class="example-body">Dik dairesel silindirin hacmi $V(r, h) = \\pi r^2 h$. Bir silindir $r = 10$ cm ve $h = 25$ cm olarak ölçülmüş, belirsizlikler $|\\Delta r| \\le 0.1$ cm ve $|\\Delta h| \\le 0.2$ cm. $V$'deki belirsizliği tahmin edin.<br><br><strong>Kısmileri hesapla:</strong><br>$V_r = 2\\pi r h, \\qquad V_h = \\pi r^2.$<br>$(r, h) = (10, 25)$'te: $V_r = 500\\pi$, $V_h = 100\\pi$.<br><br><strong>Tam diferansiyel:</strong><br>$dV = 500\\pi \\, dr + 100\\pi \\, dh.$<br>$|dr| \\le 0.1$ ve $|dh| \\le 0.2$ ile:<br>$|\\Delta V| \\le 500\\pi(0.1) + 100\\pi(0.2) = 50\\pi + 20\\pi = 70\\pi \\approx 219.9 \\text{ cm}^3.$<br><br>Bildirilen hacim dolayısıyla $V = 2500\\pi \\pm 70\\pi \\;\\approx\\; 7854 \\pm 220$ cm$^3$ olmalıdır.</div></div>

<p class="l-text"><strong>Genel formül.</strong> $n$ değişkenli bir $f(x_1, \\ldots, x_n)$ fonksiyonu için,</p>

<div class="calc-formula"><div class="formula-label">TAM DİFERANSİYEL — n DEĞİŞKEN</div><div class="formula-main">$$df \\;=\\; \\sum_{i=1}^{n} \\frac{\\partial f}{\\partial x_i}\\, dx_i \\;=\\; \\nabla f \\cdot d\\mathbf{x}.$$</div><div class="formula-sub">Herhangi bir çok değişkenli fonksiyonun birinci dereceden davranışını paketlemenin temiz bir yolu.</div></div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Aşağıdaki beş çözümlü alıştırma yukarıda geliştirilen her kavramı pekiştirir. Her birini elinizde kalemle okuyun: önce problemi kendiniz deneyin, sonra çözümünüzü çözümlü cevapla karşılaştırın.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — $f(x,y) = x^2 y^3$'ün Kısmileri</div><div class="example-body"><strong>Problem.</strong> $f(x, y) = x^2 y^3$ için $\\partial f/\\partial x$ ve $\\partial f/\\partial y$'yi hesaplayın ve her ikisini de $(x, y) = (2, -1)$'de değerlendirin.<br><br><strong>Çözüm.</strong> $f_x$'te $y$ sabit alınır:<br>$f_x = (\\partial/\\partial x)(x^2 y^3) = 2x \\cdot y^3 = 2x y^3.$<br>$f_y$'de $x$ sabit alınır:<br>$f_y = x^2 \\cdot 3 y^2 = 3 x^2 y^2.$<br><br>$(2, -1)$'de: $f_x = 2(2)(-1)^3 = -4$; &nbsp;$f_y = 3(4)(1) = 12.$</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — Bir Noktada Gradyan</div><div class="example-body"><strong>Problem.</strong> $f(x, y, z) = x^2 + y^2 - z^2 + xyz$ için $\\nabla f$'yi bulun. $(1, 2, 3)$'te değerlendirin ve büyüklüğünü verin.<br><br><strong>Çözüm.</strong> Kısmi kısmı:<br>$f_x = 2x + yz, \\quad f_y = 2y + xz, \\quad f_z = -2z + xy.$<br><br>Yani $\\nabla f(x,y,z) = (2x + yz, \\; 2y + xz, \\; -2z + xy).$<br><br>$(1, 2, 3)$'te:<br>$\\nabla f = (2 + 6, \\; 4 + 3, \\; -6 + 2) = (8, \\; 7, \\; -4).$<br>Büyüklük: $|\\nabla f| = \\sqrt{64 + 49 + 16} = \\sqrt{129} \\approx 11.36.$</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — Teğet Düzlem Denklemi</div><div class="example-body"><strong>Problem.</strong> $z = \\sqrt{x^2 + y^2}$ yüzeyinin (bir koni) $(3, 4, 5)$ noktasındaki teğet düzleminin denklemini bulun.<br><br><strong>Çözüm.</strong> Taban noktayı doğrula: $\\sqrt{9 + 16} = 5.$ $\\checkmark$<br><br>$f(x,y) = \\sqrt{x^2 + y^2}$'nin kısmileri:<br>$f_x = \\dfrac{x}{\\sqrt{x^2 + y^2}}, \\qquad f_y = \\dfrac{y}{\\sqrt{x^2 + y^2}}.$<br>$(3, 4)$'te: $f_x = 3/5$, $f_y = 4/5$.<br><br>Teğet-düzlem denklemi:<br>$z = 5 + \\tfrac{3}{5}(x - 3) + \\tfrac{4}{5}(y - 4),$<br>veya eşdeğer olarak $3x + 4y - 5z = 0.$<br><br>Not: bu düzlem orijinden geçer — tepesi $0$'da olan bir koninin teğet düzlemlerinin karakteristik bir özelliği.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — Yönlü Türev</div><div class="example-body"><strong>Problem.</strong> $f(x, y) = e^x \\cos y$ için $(0, \\pi/4)$'teki yönlü türevi $(0, \\pi/4)$'tan $(2, \\pi/4 + 1)$'a doğru olan yönde hesaplayın.<br><br><strong>Çözüm.</strong> Yön vektörü: $\\mathbf{v} = (2 - 0, \\; 1) = (2, 1).$ Normleştir: $|\\mathbf{v}| = \\sqrt{5}$, yani $\\mathbf{u} = (2/\\sqrt 5, \\; 1/\\sqrt 5).$<br><br>$f$'nin kısmileri:<br>$f_x = e^x \\cos y, \\quad f_y = -e^x \\sin y.$<br>$(0, \\pi/4)$'te $e^0 = 1$ ve $\\cos(\\pi/4) = \\sin(\\pi/4) = \\sqrt 2 / 2$ olduğundan,<br>$\\nabla f(0, \\pi/4) = (\\sqrt 2/2, \\; -\\sqrt 2 / 2).$<br><br>Yönlü türev:<br>$D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u} = \\dfrac{\\sqrt 2}{2} \\cdot \\dfrac{2}{\\sqrt 5} \\;+\\; \\Big(-\\dfrac{\\sqrt 2}{2}\\Big) \\cdot \\dfrac{1}{\\sqrt 5} = \\dfrac{\\sqrt 2}{2\\sqrt 5} = \\dfrac{\\sqrt{10}}{10}.$<br><br>Sayısal olarak $\\sqrt{10}/10 \\approx 0.316$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — Clairaut Teoremini Doğrulama</div><div class="example-body"><strong>Problem.</strong> $f(x, y) = x^4 y^3 + 5 x^2 y + \\sin(xy)$ için $f_{xy} = f_{yx}$ olduğunu doğrulayın.<br><br><strong>Çözüm.</strong> Birinci kısmiler:<br>$f_x = 4 x^3 y^3 + 10 x y + y \\cos(xy),$<br>$f_y = 3 x^4 y^2 + 5 x^2 + x \\cos(xy).$<br><br>Karışık kısmi $f_{xy} = (\\partial/\\partial y) f_x$:<br>$f_{xy} = 12 x^3 y^2 + 10 x + \\cos(xy) + y \\cdot (-\\sin(xy)) \\cdot x$<br>$\\phantom{f_{xy}} = 12 x^3 y^2 + 10 x + \\cos(xy) - x y \\sin(xy).$<br><br>Diğer karışık kısmi $f_{yx} = (\\partial/\\partial x) f_y$:<br>$f_{yx} = 12 x^3 y^2 + 10 x + \\cos(xy) + x \\cdot (-\\sin(xy)) \\cdot y$<br>$\\phantom{f_{yx}} = 12 x^3 y^2 + 10 x + \\cos(xy) - x y \\sin(xy).$<br><br>İki ifade aynıdır — Clairaut teoremi bu düzgün örnek için doğrulanmıştır. $\\checkmark$</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Sonraki derste, $h(t) = f(x(t), y(t))$ ve $h(u, v) = f(x(u,v), y(u,v))$ gibi bileşkelerin türevini almak için temiz bir formül veren çok değişkenli <em>zincir kuralını</em> geliştireceğiz. Ardından, tüm birinci dereceden makineri elimizde olduğunda, ikinci dereceden analize yöneleceğiz: Hessian, kritik noktaların sınıflandırılması ve çok değişkenli optimizasyonun eyer/minimum/maksimum üçlüsü.</div>`

};
