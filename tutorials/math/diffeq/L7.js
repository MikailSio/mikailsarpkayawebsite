window.DIFFEQ_L7 = {

/* ============================================================
   ENGLISH
   ============================================================ */
en: `
<p class="l-text">In every prior lesson of this track the question was the same: given a differential equation, find the function that satisfies it. Lesson 7 turns the world upside down. We will start with a <em>functional</em> &mdash; an object that eats a function and spits out a number &mdash; and we will look for the function that makes that number as small (or as large) as possible. The answer turns out to be governed by a differential equation, but a differential equation that drops out of an extremisation rather than being handed to us by physics. This subject is called the <strong>calculus of variations</strong>, and it is the silent engine behind a remarkable amount of mathematics, physics, optimal control, and modern machine learning.</p>

<p class="l-text">The historical scope is dizzying. The brachistochrone curve, Lagrangian mechanics, geodesics on curved surfaces, the catenary cable, the soap film of minimal area, optimal control of rockets, the finite element method that simulates aircraft wings, the variational autoencoder that generates faces &mdash; all of them are calculus of variations wearing different costumes. By the end of this lesson you will recognise the costume and read the Euler-Lagrange equation underneath without flinching.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish a function from a <strong>functional</strong> and read the notation $J[y] = \\int_a^b L(x, y, y')\\, dx$ confidently</li>
<li>Derive the <strong>Euler-Lagrange equation</strong> from first principles using a smooth variation $y \\to y + \\varepsilon \\eta$</li>
<li>Solve three classical variational problems: geodesics, the brachistochrone (cycloid), and the catenary (cosh)</li>
<li>Restate Newton's mechanics as <strong>Hamilton's principle of stationary action</strong> $S = \\int (T - V)\\, dt$</li>
<li>Convert a linear PDE into its <strong>weak form</strong> and explain why this enlarges the solution space</li>
<li>Connect the variational viewpoint to two modern ML methods: the <strong>VAE ELBO</strong> and <strong>physics-informed neural networks</strong></li>
</ul>
</div>

<h2 class="lesson-title">1. From Calculus to Calculus of Variations</h2>

<p class="l-text">Ordinary calculus answers the question: given a function $f : \\mathbb{R} \\to \\mathbb{R}$, find the points $x$ at which $f(x)$ is largest or smallest. The technique is by now reflex. Set $f'(x) = 0$, solve, classify the critical points with the second derivative. The unknown you are solving for is a <em>number</em>: the location $x_*$ of the extremum.</p>

<p class="l-text">The calculus of variations asks a structurally similar but conceptually larger question. The input is no longer a number; it is an entire function $y(x)$ defined on some interval $[a, b]$. The output is still a number, produced by some integral involving $y$ and possibly its derivatives. An object that maps a function to a number is called a <strong>functional</strong>, and we write its argument in square brackets to keep ourselves honest about the type.</p>

<div class="calc-formula"><div class="formula-label">THE PROTOTYPE FUNCTIONAL</div><div class="formula-main">$$J[y] \\;=\\; \\int_a^b L\\!\\bigl(x, \\, y(x), \\, y'(x)\\bigr)\\, dx$$</div><div class="formula-sub">The integrand $L$ is called the <strong>Lagrangian</strong>. The functional $J[y]$ takes a candidate function $y$ defined on $[a,b]$, plugs it into the integrand at every point, and reports the area under the resulting curve.</div></div>

<p class="l-text">Examples should make the type clear. The length of the curve $y(x)$ between $x = a$ and $x = b$ is a functional:</p>

<div class="calc-formula"><div class="formula-label">ARC-LENGTH AS A FUNCTIONAL</div><div class="formula-main">$$J[y] \\;=\\; \\int_a^b \\sqrt{1 + (y'(x))^2}\\; dx$$</div><div class="formula-sub">Plug in $y(x) = x$ and you get $\\sqrt{2}\\,(b - a)$. Plug in $y(x) = \\sin x$ on $[0, \\pi]$ and you get a different number. Two functions, two numbers. The functional rates every candidate.</div></div>

<p class="l-text">The natural question is now: among <em>all</em> smooth functions $y(x)$ that pass through two fixed endpoints $y(a) = y_a$ and $y(b) = y_b$, which one makes $J[y]$ smallest? This is no longer a problem about finding a single point on a graph. It is a problem about searching an infinite-dimensional space of admissible curves for the one with the smallest "cost".</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Calculus &rarr; numbers</div><div class="card-body">Argument: a number $x$. Tool: derivative $f'(x)$. Critical-point condition: $f'(x) = 0$. Search space: $\\mathbb{R}$ (one-dimensional).</div></div>
<div class="calc-card"><div class="card-title">Variations &rarr; functions</div><div class="card-body">Argument: a function $y(x)$. Tool: functional derivative $\\delta J / \\delta y$. Critical-function condition: Euler-Lagrange ODE. Search space: a function space (infinite-dimensional).</div></div>
<div class="calc-card"><div class="card-title">Extremum &rarr; extremal</div><div class="card-body">In calculus a critical point is called an extremum. In variational problems a critical function is called an <strong>extremal</strong>. The Euler-Lagrange equation is exactly the equation an extremal must satisfy.</div></div>
<div class="calc-card"><div class="card-title">Boundary conditions matter</div><div class="card-body">A variational problem is incomplete without saying what is fixed at the endpoints. Fixed-endpoint problems give a clean ODE. "Free" endpoints add extra <em>natural</em> boundary conditions that drop out of the same derivation.</div></div>
</div>

<div class="l-note"><strong>Why we need a new derivative.</strong> If you wanted to find the minimum of $f(x, y, z, \\ldots)$ over many variables you would solve $\\partial f / \\partial x_i = 0$ for each $i$. A function $y(x)$ has uncountably many "components" &mdash; one for each $x$ in $[a, b]$. The functional derivative $\\delta J / \\delta y(x)$ is what the partial derivative becomes when the index $i$ ranges over a continuum.</div>

<h2 class="lesson-title">2. The Brachistochrone &mdash; Historical Motivation</h2>

<p class="l-text">In June 1696 the Swiss mathematician <strong>Johann Bernoulli</strong> published an open challenge in the journal <em>Acta Eruditorum</em>. Given two points $A$ and $B$ in a vertical plane with $A$ above $B$, find the curve along which a bead, released from rest at $A$ and sliding without friction under gravity, will reach $B$ in the shortest possible time. He called the unknown curve the <em>brachistochrone</em>, from the Greek for "shortest time".</p>

<p class="l-text">The naive guess is "a straight line". The straight line is shortest in distance but, as Bernoulli already knew, it is <em>not</em> shortest in time. A curve that initially drops more steeply gives the bead a faster speed sooner, and the longer arc length is overcompensated by the higher average velocity. The question is by how much, and what the optimal trade-off looks like.</p>

<p class="l-text">Take the starting point at the origin and let the bead descend to a point $(x_B, y_B)$ where the $y$-axis points <em>downward</em>. Conservation of energy gives the speed at height drop $y$ as $v = \\sqrt{2 g y}$. The arc-length element is $ds = \\sqrt{1 + (y'(x))^2}\\, dx$, and the time to traverse it is $dt = ds / v$. Integrating from $0$ to $x_B$,</p>

<div class="calc-formula"><div class="formula-label">BRACHISTOCHRONE FUNCTIONAL</div><div class="formula-main">$$T[y] \\;=\\; \\int_0^{x_B} \\frac{\\sqrt{1 + (y'(x))^2}}{\\sqrt{2 g\\, y(x)}}\\; dx$$</div><div class="formula-sub">A functional whose argument is the curve $y(x)$, whose output is the descent time, and whose minimiser was, in 1696, the most famous open problem in Europe.</div></div>

<p class="l-text">Within months of publication Newton, Leibniz, Jakob Bernoulli, l'Hôpital, and Johann Bernoulli himself had each produced a solution by ingenious ad hoc methods. The first systematic technique &mdash; one that turned each such problem into a routine application of a single ODE &mdash; was assembled by <strong>Leonhard Euler</strong> in 1744 and put in its final form by <strong>Joseph-Louis Lagrange</strong> in 1755. That ODE is the subject of the next section.</p>

<h2 class="lesson-title">3. Deriving the Euler-Lagrange Equation</h2>

<p class="l-text">Fix the endpoints $y(a) = y_a$, $y(b) = y_b$. Consider any smooth function $\\eta(x)$ that vanishes at the endpoints, $\\eta(a) = \\eta(b) = 0$. For a small real parameter $\\varepsilon$, the perturbed curve $y(x) + \\varepsilon \\eta(x)$ still passes through both endpoints. Define</p>

<div class="calc-formula"><div class="formula-label">VARIATION OF THE FUNCTIONAL</div><div class="formula-main">$$\\Phi(\\varepsilon) \\;=\\; J\\bigl[y + \\varepsilon \\eta\\bigr] \\;=\\; \\int_a^b L\\!\\bigl(x, \\, y + \\varepsilon\\eta, \\, y' + \\varepsilon\\eta'\\bigr)\\, dx$$</div><div class="formula-sub">For each fixed perturbation $\\eta$, the perturbed functional value is now an ordinary function of one real number $\\varepsilon$. We are back in ordinary calculus.</div></div>

<p class="l-text">If $y$ is an extremal then $\\Phi$ must attain a critical point at $\\varepsilon = 0$, so $\\Phi'(0) = 0$ for <em>every</em> admissible $\\eta$. Differentiating under the integral,</p>

<div class="calc-formula"><div class="formula-label">FIRST VARIATION</div><div class="formula-main">$$\\Phi'(0) \\;=\\; \\int_a^b \\!\\left[\\, \\frac{\\partial L}{\\partial y}\\, \\eta(x) + \\frac{\\partial L}{\\partial y'}\\, \\eta'(x) \\,\\right] dx \\;=\\; 0$$</div><div class="formula-sub">Read this as a directional derivative of $J$ in the "direction" $\\eta$. The condition $\\Phi'(0) = 0$ for every $\\eta$ is the variational analogue of $\\nabla f = 0$ in finite dimensions.</div></div>

<p class="l-text"><strong>Integrate by parts</strong> on the second term, using $\\eta(a) = \\eta(b) = 0$ to kill the boundary contribution:</p>

<div class="calc-formula"><div class="formula-label">AFTER INTEGRATION BY PARTS</div><div class="formula-main">$$\\int_a^b \\!\\left[\\, \\frac{\\partial L}{\\partial y} - \\frac{d}{dx}\\!\\left(\\frac{\\partial L}{\\partial y'}\\right) \\right] \\eta(x)\\, dx \\;=\\; 0 \\qquad \\text{for every smooth } \\eta \\text{ with } \\eta(a) = \\eta(b) = 0$$</div><div class="formula-sub">All the action has been pushed inside one bracket multiplying $\\eta(x)$.</div></div>

<p class="l-text">If the bracket were positive on some sub-interval we could choose $\\eta$ as a bump function localised there and get a positive integral, contradicting the equality. The <strong>fundamental lemma of the calculus of variations</strong> packages this argument: if $\\int_a^b h(x)\\, \\eta(x)\\, dx = 0$ for every smooth bump $\\eta$, then $h(x) \\equiv 0$ on $[a, b]$. Applying it gives the central ODE of the subject.</p>

<div class="calc-formula"><div class="formula-label">EULER-LAGRANGE EQUATION</div><div class="formula-main">$$\\boxed{\\; \\frac{\\partial L}{\\partial y} \\;-\\; \\frac{d}{dx}\\!\\left(\\frac{\\partial L}{\\partial y'}\\right) \\;=\\; 0 \\;}$$</div><div class="formula-sub">A second-order ODE in $y(x)$. Every extremal of $\\int L(x, y, y')\\, dx$ with fixed endpoints satisfies it. The total derivative $d/dx$ on the second term respects the chain rule: $L_{y'}$ depends on $x$ both directly and through $y, y'$.</div></div>

<div class="calc-highlight"><strong>One equation, infinitely many problems.</strong> Every variational problem in mechanics, geometry, optimal control, and (with extensions) field theory reduces to writing down the correct Lagrangian $L$ and turning the crank on the Euler-Lagrange equation. The art is mostly in setting up $L$; the rest is calculus.</div>

<div class="l-note"><strong>A useful identity: the Beltrami first integral.</strong> When $L$ does not depend explicitly on $x$, i.e. $\\partial L / \\partial x = 0$, multiplying the E-L equation by $y'$ and rearranging gives a conserved quantity $L - y'\\, \\partial L / \\partial y' = C$, constant along extremals. This first integral cuts the order of the ODE from 2 to 1 and is the workhorse for the brachistochrone and the catenary.</div>

<h2 class="lesson-title">4. Worked Example 1: Shortest Path (Geodesic)</h2>

<p class="l-text">As a warm-up apply the Euler-Lagrange machinery to the arc-length functional</p>

<div class="calc-formula"><div class="formula-label">ARC LENGTH</div><div class="formula-main">$$J[y] \\;=\\; \\int_a^b \\sqrt{1 + (y')^2}\\; dx, \\qquad L(x, y, y') = \\sqrt{1 + (y')^2}$$</div><div class="formula-sub">The straight-line answer is so familiar we are entitled to feel cheated if our framework returns anything else.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Compute the partial derivatives of $L$</div><div class="step-detail">$\\partial L / \\partial y = 0$ because the integrand has no explicit $y$ dependence. $\\partial L / \\partial y' = y' / \\sqrt{1 + (y')^2}$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Write the E-L equation</div><div class="step-detail">$0 - (d/dx)\\bigl[\\, y' / \\sqrt{1 + (y')^2}\\, \\bigr] = 0$, so the bracket is constant: $y' / \\sqrt{1 + (y')^2} = c$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Solve for $y'$</div><div class="step-detail">Squaring and rearranging gives $(y')^2 = c^2 / (1 - c^2)$, a constant. So $y'(x) = m$ for some constant slope $m$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Integrate</div><div class="step-detail">$y(x) = m x + b$. A straight line. The two integration constants $m$ and $b$ are determined by the endpoint conditions $y(a) = y_a$, $y(b) = y_b$.</div></div></div>
</div>

<p class="l-text">The shortest path between two points in the Euclidean plane is a straight line. The Euler-Lagrange equation has confirmed the obvious &mdash; which is exactly what you should demand of any new framework before trusting it on harder problems. The same machinery on the surface of a sphere produces the great circles, on a saddle the hyperbolic geodesics, and in spacetime the timelike geodesics of general relativity. The framework is geometry-agnostic; only the form of $L$ changes.</p>

<h2 class="lesson-title">5. Worked Example 2: Brachistochrone Solution</h2>

<p class="l-text">Return to Bernoulli's challenge. The Lagrangian is $L = \\sqrt{1 + (y')^2}/\\sqrt{2 g y}$. It has no explicit $x$ dependence, so the Beltrami first integral applies. After a short calculation,</p>

<div class="calc-formula"><div class="formula-label">BELTRAMI FIRST INTEGRAL FOR THE BRACHISTOCHRONE</div><div class="formula-main">$$L - y'\\, \\frac{\\partial L}{\\partial y'} \\;=\\; \\frac{1}{\\sqrt{2 g\\, y\\,(1 + (y')^2)}} \\;=\\; C$$</div><div class="formula-sub">Where $C$ is a constant set by the boundary conditions. Rearranging, $y\\,(1 + (y')^2) = 1/(2 g C^2) \\equiv k$, a constant.</div></div>

<p class="l-text">This first-order ODE looks unfamiliar, but a clever parametrisation tames it. Let $y'(x) = \\cot(\\theta / 2)$ for a parameter $\\theta$. Substituting and using the half-angle identity $1 + \\cot^2(\\theta / 2) = 1 / \\sin^2(\\theta / 2) = 2 / (1 - \\cos \\theta)$ gives $y = (k/2)(1 - \\cos \\theta)$. Differentiating and integrating $x$ with respect to $\\theta$ yields the matching equation for $x$:</p>

<div class="calc-formula"><div class="formula-label">CYCLOID PARAMETRISATION</div><div class="formula-main">$$x(\\theta) \\;=\\; \\frac{k}{2}\\,(\\theta - \\sin \\theta), \\qquad y(\\theta) \\;=\\; \\frac{k}{2}\\,(1 - \\cos \\theta)$$</div><div class="formula-sub">The curve traced by a point on the rim of a circle of radius $k/2$ rolling along the $x$-axis. The brachistochrone is a cycloid &mdash; not a straight line, not a parabola, but the curve produced by the rolling of a wheel.</div></div>

<div id="plot-l7-brachi-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var Np=200;var k=1.0;var theta_end=2.41;var th=[];var xs=[];var ys=[];
for(var i=0;i<Np;i++){var t=theta_end*i/(Np-1);th.push(t);xs.push((k/2)*(t-Math.sin(t)));ys.push((k/2)*(1-Math.cos(t)));}
var xB=xs[Np-1];var yB=ys[Np-1];
var xLine=[];var yLine=[];
for(var i=0;i<Np;i++){xLine.push(xB*i/(Np-1));yLine.push(yB*i/(Np-1));}
var xPar=[];var yPar=[];
for(var i=0;i<Np;i++){var u=i/(Np-1);xPar.push(xB*u);yPar.push(yB*u*u);}
function descentTime(xa,ya){var T=0;var g=9.81;var n=xa.length;for(var i=1;i<n;i++){var dx=xa[i]-xa[i-1];var dy=ya[i]-ya[i-1];var ds=Math.sqrt(dx*dx+dy*dy);var y_mid=0.5*(ya[i]+ya[i-1]);if(y_mid<=1e-6)continue;var v=Math.sqrt(2*g*y_mid);T+=ds/v;}return T;}
var tCyc=descentTime(xs,ys);var tLine=descentTime(xLine,yLine);var tPar=descentTime(xPar,yPar);
var d1={x:xs,y:ys,mode:'lines',name:'cycloid t='+tCyc.toFixed(3)+'s',line:{color:'#3b82f6',width:3}};
var d2={x:xLine,y:yLine,mode:'lines',name:'straight line t='+tLine.toFixed(3)+'s',line:{color:'#f59e0b',width:2,dash:'dash'}};
var d3={x:xPar,y:yPar,mode:'lines',name:'parabola t='+tPar.toFixed(3)+'s',line:{color:'#10b981',width:2,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'y (downward)',gridcolor:'#1f2937',zerolinecolor:'#374151',autorange:'reversed'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l7-brachi-en',[d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> three candidate descent curves between the same two endpoints, with $y$ plotted downward to match the geometry of the falling bead. The straight line (orange) is shortest in distance. The parabola (green) drops more steeply at first. The cycloid (blue) drops steepest of all near the top, picking up speed early, then flattens out for the second half of the trip. The numerical descent times confirm Bernoulli's claim: the cycloid wins, the parabola comes second, the straight line is the slowest. Steepness at the start matters more than total length.</div></div>

<div class="l-note"><strong>A second surprise: tautochrony.</strong> Christiaan Huygens noticed in 1659 that the same cycloid has an even more remarkable property. If you release a bead from <em>any</em> starting height on a cycloidal ramp, the time to reach the bottom is the same. Huygens built a pendulum whose bob followed a cycloid, the <em>tautochrone</em>, to compensate for the small-angle approximation that ordinary pendulum clocks suffer from. One curve, two superlatives.</div>

<h2 class="lesson-title">6. Worked Example 3: Catenary</h2>

<p class="l-text">Hang a uniform flexible chain of fixed total length $\\ell$ between two posts. Gravity acts downward. What shape does the chain take? Galileo guessed a parabola; he was wrong. Jakob Bernoulli posed the problem in 1690 and Johann Bernoulli, Huygens, and Leibniz solved it the next year. The correct answer is the <strong>catenary</strong>, the shape that minimises the gravitational potential energy of the chain subject to the constraint that the total arc length is fixed.</p>

<p class="l-text">For a chain with linear mass density $\\rho$, the potential energy stored in an arc element $ds$ at height $y$ is $\\rho g\\, y\\, ds$. The total potential energy is</p>

<div class="calc-formula"><div class="formula-label">POTENTIAL ENERGY OF A HANGING CHAIN</div><div class="formula-main">$$U[y] \\;=\\; \\rho g \\int_a^b y(x)\\, \\sqrt{1 + (y')^2}\\; dx$$</div><div class="formula-sub">The shape that minimises this functional subject to the fixed-length constraint is the equilibrium configuration of the chain.</div></div>

<p class="l-text">Set the multiplicative constants aside and apply the Beltrami first integral to $L = y\\,\\sqrt{1 + (y')^2}$:</p>

<div class="calc-formula"><div class="formula-label">FIRST INTEGRAL FOR THE CATENARY</div><div class="formula-main">$$L - y'\\,\\frac{\\partial L}{\\partial y'} \\;=\\; \\frac{y}{\\sqrt{1 + (y')^2}} \\;=\\; a$$</div><div class="formula-sub">A first-order separable ODE: $y^2 = a^2\\,(1 + (y')^2)$.</div></div>

<p class="l-text">Solving for $y'$ and separating variables, the integral $\\int dy / \\sqrt{(y/a)^2 - 1}$ is the standard one for $\\cosh^{-1}$. The result is the catenary curve:</p>

<div class="calc-formula"><div class="formula-label">THE CATENARY</div><div class="formula-main">$$y(x) \\;=\\; a\\, \\cosh\\!\\left(\\frac{x - x_0}{a}\\right)$$</div><div class="formula-sub">The parameter $a$ controls how slack or taut the chain is; small $a$ gives a deep, slack curve, large $a$ gives a nearly flat one. The constant $x_0$ shifts the lowest point.</div></div>

<div id="plot-l7-catenary-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var Np=300;var xs=[];for(var i=0;i<Np;i++){xs.push(-2+4*i/(Np-1));}
var as=[0.5,1.0,2.0,4.0];var colors=['#3b82f6','#10b981','#f59e0b','#ef4444'];var traces=[];
for(var k=0;k<as.length;k++){var a=as[k];var ys=[];for(var i=0;i<Np;i++){ys.push(a*Math.cosh(xs[i]/a));}
  traces.push({x:xs,y:ys,mode:'lines',name:'a = '+a.toFixed(1),line:{color:colors[k],width:2.5}});}
var xpar=[];var ypar=[];for(var i=0;i<Np;i++){var x=xs[i];xpar.push(x);ypar.push(1.0+x*x/2);}
traces.push({x:xpar,y:ypar,mode:'lines',name:'parabola (Galileo)',line:{color:'#9ca3af',width:1.5,dash:'dash'}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'y = a cosh(x/a)',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[0,8]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l7-catenary-en',traces,layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the catenary $y = a\\,\\cosh(x/a)$ for four values of $a$. Small $a$ produces a deep narrow valley (taut wire with little slack); larger $a$ flattens the curve and pushes the minimum higher. The dashed grey curve is the parabola $1 + x^2/2$ tangent to the $a = 1$ catenary at the bottom &mdash; close near the minimum, but diverging quickly on the wings. That divergence is exactly the gap between Galileo's incorrect guess and the true equilibrium shape.</div></div>

<div class="l-note"><strong>Everywhere in the wild.</strong> Telephone wires, suspension-bridge main cables (almost &mdash; the cable supports the weight of the deck rather than its own weight, producing a true parabola), the arches of cathedrals turned upside down (Antoni Gaudí built his Sagrada Família models with hanging chains and inverted the resulting catenaries), and the iconic Gateway Arch in St. Louis (a weighted catenary). The same equation, four-hundred years of architecture.</div>

<h2 class="lesson-title">7. Lagrangian Mechanics &mdash; Hamilton's Principle</h2>

<p class="l-text">In 1834 William Rowan Hamilton reformulated all of classical mechanics in one sentence. Define the <strong>action</strong> of a candidate trajectory $q(t)$ between two fixed instants $t_1$ and $t_2$ as the integral over time of the Lagrangian $L = T - V$, where $T$ is the kinetic energy and $V$ the potential energy:</p>

<div class="calc-formula"><div class="formula-label">HAMILTON'S ACTION</div><div class="formula-main">$$S[q] \\;=\\; \\int_{t_1}^{t_2} L\\!\\bigl(q(t), \\dot q(t), t\\bigr)\\, dt \\;=\\; \\int_{t_1}^{t_2} \\bigl[\\, T - V \\,\\bigr]\\, dt$$</div><div class="formula-sub">A functional that assigns a real number (the action) to every candidate path between the given start and end configurations.</div></div>

<p class="l-text"><strong>Hamilton's principle</strong> says: the physically realised trajectory is an extremal of $S$. Plug this Lagrangian into Euler-Lagrange and you recover Newton's equations $F = m a$ as the resulting ODE &mdash; with one massive bonus: the procedure is independent of the coordinate system. You can derive the equations of motion in spherical, cylindrical, or any other coordinates by writing $T$ and $V$ in those coordinates and turning the same crank. No vector decompositions, no fictitious forces.</p>

<div class="calc-formula"><div class="formula-label">EULER-LAGRANGE FOR MECHANICS</div><div class="formula-main">$$\\frac{d}{dt}\\!\\left(\\frac{\\partial L}{\\partial \\dot q}\\right) \\;-\\; \\frac{\\partial L}{\\partial q} \\;=\\; 0$$</div><div class="formula-sub">The independent variable is now $t$ instead of $x$, and the generalised velocity $\\dot q$ plays the role of $y'$. Otherwise this is exactly the equation from Section 3.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: A PARTICLE IN FREE FALL</div><div class="example-body"><strong>Set-up.</strong> A particle of mass $m$ moves vertically under gravity. Take $y$ as the height. Kinetic energy $T = \\tfrac{1}{2} m \\dot y^2$. Potential energy $V = m g y$. Lagrangian $L = T - V = \\tfrac{1}{2} m \\dot y^2 - m g y$.<br><br><strong>Compute the partials.</strong> $\\partial L / \\partial \\dot y = m \\dot y$, so $(d/dt)(\\partial L / \\partial \\dot y) = m \\ddot y$. $\\partial L / \\partial y = -m g$.<br><br><strong>Euler-Lagrange equation.</strong> $m \\ddot y - (-m g) = 0$, i.e. $m \\ddot y = -m g$, equivalently $\\ddot y = -g$.<br><br>That is Newton's second law for free fall, derived from a variational principle without ever writing $F = ma$. Magic, but it is the same magic as a Bernoulli first integral &mdash; the structure of the calculus does the bookkeeping for you.</div></div>

<div id="plot-l7-action-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var T=1.0;var g=9.81;var v0=g*T/2;
var Np=200;var ts=[];for(var i=0;i<Np;i++){ts.push(T*i/(Np-1));}
function actionOf(yfun){var S=0;var n=ts.length;for(var i=1;i<n;i++){var dt=ts[i]-ts[i-1];var t_mid=0.5*(ts[i]+ts[i-1]);var y_a=yfun(ts[i]);var y_b=yfun(ts[i-1]);var v=(y_a-y_b)/dt;var y_mid=0.5*(y_a+y_b);S+=(0.5*v*v-g*y_mid)*dt;}return S;}
function yTrue(t){return v0*t-0.5*g*t*t;}
var alphas=[-0.4,-0.2,-0.05,0,0.05,0.2,0.4];var as=[];var Ss=[];
for(var k=0;k<alphas.length;k++){var a=alphas[k];var fn=(function(aa){return function(t){return yTrue(t)+aa*Math.sin(Math.PI*t/T);};})(a);as.push(a);Ss.push(actionOf(fn));}
var trueY=ts.map(yTrue);var pertY=ts.map(function(t){return yTrue(t)+0.3*Math.sin(Math.PI*t/T);});var pert2=ts.map(function(t){return yTrue(t)-0.3*Math.sin(Math.PI*t/T);});
var d1={x:ts,y:trueY,mode:'lines',name:'physical y(t) (extremal)',line:{color:'#3b82f6',width:3},xaxis:'x',yaxis:'y'};
var d2={x:ts,y:pertY,mode:'lines',name:'perturbed (+)',line:{color:'#f59e0b',width:1.5,dash:'dash'},xaxis:'x',yaxis:'y'};
var d3={x:ts,y:pert2,mode:'lines',name:'perturbed (-)',line:{color:'#10b981',width:1.5,dash:'dot'},xaxis:'x',yaxis:'y'};
var d4={x:as,y:Ss,mode:'lines+markers',name:'action S(ε)',line:{color:'#ef4444',width:2.5},marker:{size:7,color:'#ef4444'},xaxis:'x2',yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'t',gridcolor:'#1f2937',domain:[0,0.46]},yaxis:{title:'y(t)',gridcolor:'#1f2937'},xaxis2:{title:'perturbation ε',gridcolor:'#1f2937',domain:[0.54,1]},yaxis2:{title:'action S[y+ε·η]',gridcolor:'#1f2937'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l7-action-en',[d1,d2,d3,d4],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> on the left, the physical free-fall trajectory in blue and two sinusoidal perturbations of it in orange and green &mdash; same start and end, different middle. On the right, the value of the action $S$ computed numerically for a family of such perturbations parametrised by $\\varepsilon$. The action is stationary (locally extremal) at $\\varepsilon = 0$: the curve flattens out near zero perturbation. Hamilton's principle in one picture &mdash; physical trajectories are the ones that put the action at a critical point of the path space.</div></div>

<div class="l-note"><strong>Why this matters beyond mechanics.</strong> Maxwell's equations, general relativity, the Standard Model of particle physics &mdash; every fundamental theory in physics is encoded by a Lagrangian and obtained from a stationary-action principle. Knowing how to read $\\delta S = 0$ is closer to a universal language than to a special technique.</div>

<h2 class="lesson-title">8. Constraints and Lagrange Multipliers</h2>

<p class="l-text">Many variational problems come with side conditions. The catenary minimises potential energy <em>subject to</em> fixed length. <strong>Dido's problem</strong> (named after the Phoenician queen who, according to Virgil, was offered as much land as she could enclose with an ox hide) asks for the closed curve in the plane that encloses maximum area with fixed perimeter. The answer is a circle, but proving it requires upgrading the Euler-Lagrange machinery to handle constraints.</p>

<p class="l-text">The technique is a direct generalisation of Lagrange multipliers from ordinary calculus. Instead of extremising $J[y]$ subject to $K[y] = c$, extremise the modified functional</p>

<div class="calc-formula"><div class="formula-label">CONSTRAINED VARIATIONAL PROBLEM</div><div class="formula-main">$$J[y] - \\lambda\\, \\bigl(K[y] - c\\bigr) \\;=\\; \\int_a^b \\bigl[\\, L_J - \\lambda\\, L_K \\,\\bigr]\\, dx$$</div><div class="formula-sub">A scalar multiplier $\\lambda$ replaces the side condition; the new Euler-Lagrange equation now involves the modified Lagrangian $L_J - \\lambda\\, L_K$. Solve the E-L equation, then choose $\\lambda$ so that the original constraint $K[y] = c$ is satisfied.</div></div>

<div class="calc-example"><div class="example-label">DIDO'S ISOPERIMETRIC PROBLEM</div><div class="example-body"><strong>Set-up.</strong> Maximise the enclosed area $A = \\tfrac{1}{2}\\oint (x\\, dy - y\\, dx)$ subject to fixed perimeter $\\oint ds = P$.<br><br><strong>Modified Lagrangian.</strong> Add a multiplier on the perimeter constraint and apply the E-L equation in parametric form. After a careful but routine calculation, both Cartesian coordinates satisfy the equation of a circle of radius $r = P / (2 \\pi)$.<br><br><strong>Conclusion.</strong> Among all simple closed curves of a given perimeter, the circle encloses the largest area. The result has been known since antiquity but was not proved with full rigour until the nineteenth century.</div></div>

<div class="l-note"><strong>Why ML readers should care.</strong> The KKT conditions of constrained optimisation that underpin SVMs and many other ML algorithms are the discrete analogue of this story. The Lagrangian becomes the Lagrangian dual, the multipliers become dual variables, and the duality gap measures how close the primal and dual problems agree.</div>

<h2 class="lesson-title">9. Variational Form of PDEs &mdash; Weak Formulation</h2>

<p class="l-text">Many PDEs admit an equivalent variational reformulation that is sometimes easier to work with, both theoretically and numerically. Consider the deceptively simple boundary-value problem</p>

<div class="calc-formula"><div class="formula-label">POISSON ON AN INTERVAL</div><div class="formula-main">$$-u''(x) \\;=\\; f(x) \\quad \\text{on } (0, 1), \\qquad u(0) = u(1) = 0$$</div><div class="formula-sub">A one-dimensional Poisson equation: think of $u$ as the displacement of an elastic string under a load $f$. Classical solutions are functions $u \\in C^2[0,1]$ satisfying the ODE pointwise.</div></div>

<p class="l-text">The variational reformulation begins with a <em>test function</em> $v$ that vanishes at the boundary, $v(0) = v(1) = 0$. Multiply the PDE by $v$, integrate over $[0, 1]$, and integrate by parts:</p>

<div class="calc-formula"><div class="formula-label">WEAK FORM</div><div class="formula-main">$$\\int_0^1 u'(x)\\, v'(x)\\, dx \\;=\\; \\int_0^1 f(x)\\, v(x)\\, dx \\qquad \\text{for every admissible } v$$</div><div class="formula-sub">The boundary terms from integration by parts vanish because $v(0) = v(1) = 0$. The result is an integral identity rather than a pointwise differential equation.</div></div>

<p class="l-text">Why is this useful? Two reasons. First, only one derivative of $u$ appears on the left, where the original PDE demanded two. The weak form therefore makes sense for functions $u$ that have only one (square-integrable) derivative &mdash; a much larger and more forgiving space than $C^2$. Solutions can have kinks at points where the data $f$ has a jump, and yet still satisfy the weak form. Second, the weak form is the Euler-Lagrange equation of an energy functional:</p>

<div class="calc-formula"><div class="formula-label">DIRICHLET ENERGY</div><div class="formula-main">$$E[u] \\;=\\; \\int_0^1 \\!\\left[\\, \\tfrac{1}{2} (u'(x))^2 - f(x)\\, u(x) \\,\\right] dx$$</div><div class="formula-sub">Take the first variation: $\\delta E = \\int (u' v' - f v)\\, dx$, equal to zero for every test function $v$ exactly when the weak form holds. Minimising the energy <em>is</em> solving the weak Poisson problem.</div></div>

<div id="plot-l7-test-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var Np=200;var xs=[];for(var i=0;i<Np;i++){xs.push(i/(Np-1));}
var u=xs.map(function(x){return 0.5*x*(1-x);});
var v1=xs.map(function(x){return Math.sin(Math.PI*x);});
var v2=xs.map(function(x){return Math.sin(2*Math.PI*x);});
var v3=xs.map(function(x){return Math.sin(3*Math.PI*x);});
var v4=xs.map(function(x){var p=0.3;if(x<p)return x/p;if(x<p+0.1)return 1;if(x<p+0.4)return (p+0.4-x)/0.3;return 0;});
var d1={x:xs,y:u,mode:'lines',name:'true u(x) = x(1−x)/2',line:{color:'#3b82f6',width:3}};
var d2={x:xs,y:v1,mode:'lines',name:'test v₁ = sin(πx)',line:{color:'#f59e0b',width:1.5,dash:'dash'}};
var d3={x:xs,y:v2,mode:'lines',name:'test v₂ = sin(2πx)',line:{color:'#10b981',width:1.5,dash:'dash'}};
var d4={x:xs,y:v3,mode:'lines',name:'test v₃ = sin(3πx)',line:{color:'#ef4444',width:1.5,dash:'dash'}};
var d5={x:xs,y:v4,mode:'lines',name:'piecewise hat (FEM)',line:{color:'#a78bfa',width:1.5,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[0,1]},yaxis:{title:'function value',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1.1,1.2]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l7-test-en',[d1,d2,d3,d4,d5],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the solution $u(x) = x(1-x)/2$ of $-u'' = 1$ with zero Dirichlet boundary conditions (blue, solid) shown alongside four test functions $v$ that all vanish at $x = 0$ and $x = 1$. The weak form requires the integral identity $\\int u' v' \\, dx = \\int f v \\, dx$ to hold for <em>every</em> such $v$. The first three test functions are Fourier sines; the fourth is a piecewise-linear hat function of the kind used by the finite element method in the next section. Different choices of $v$ probe different regions of the solution.</div></div>

<div class="l-note"><strong>The "Dirichlet principle".</strong> Riemann famously asserted that every Dirichlet problem has a solution because the energy functional must attain its minimum. Weierstrass pointed out the gap in the argument &mdash; the infimum is not automatically attained &mdash; and Hilbert filled it rigorously in 1900 using techniques that grew into modern functional analysis. The Dirichlet principle is now a theorem and the launching pad for Sobolev spaces.</div>

<h2 class="lesson-title">10. Finite Element Method (FEM) &mdash; Briefest Introduction</h2>

<p class="l-text">The finite element method, conceived independently by aerospace engineers and mathematicians in the 1950s, is the leading way to solve variational PDEs on complex geometries. The recipe is short:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Discretise the domain</div><div class="step-detail">Partition $[0, 1]$ into $N$ small intervals $[x_{i-1}, x_i]$ of width $h = 1/N$. In two dimensions, partition the domain into triangles or quadrilaterals.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Choose basis functions</div><div class="step-detail">For each interior node $x_i$ define the piecewise-linear "hat" $\\phi_i(x)$ that equals $1$ at $x_i$, $0$ at its neighbouring nodes, and linear in between. Together the $\\phi_i$ span a finite-dimensional subspace of the admissible function space.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Galerkin projection</div><div class="step-detail">Write the trial solution as $u_h(x) = \\sum_j c_j \\phi_j(x)$ and require the weak form to hold for every basis test function $v = \\phi_i$. This reduces the PDE to a linear system $K \\boldsymbol c = \\boldsymbol f$ with stiffness matrix $K_{ij} = \\int \\phi_i' \\phi_j'\\, dx$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Solve and reconstruct</div><div class="step-detail">Solve the (sparse, banded) linear system for the coefficients $c_j$, then sum $u_h = \\sum c_j \\phi_j$ to recover an approximation to $u$.</div></div></div>
</div>

<p class="l-text">For the problem $-u'' = 1$ on $(0,1)$ with $u(0) = u(1) = 0$, the stiffness matrix is tridiagonal with $2/h$ on the diagonal and $-1/h$ on the off-diagonals, and the load vector is $f_i = h$. The exact analytical solution is $u(x) = x(1 - x)/2$, which the FEM nails exactly at the nodes for any $N$. We will verify this in the Pyodide exercise below.</p>

<div id="plot-l7-fem-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nfine=400;var xf=[];for(var i=0;i<Nfine;i++){xf.push(i/(Nfine-1));}
var ufine=xf.map(function(x){return 0.5*x*(1-x);});
function femSolve(N){var h=1/N;var n=N-1;var a=[];var b=[];var c=[];var f=[];
for(var i=0;i<n;i++){a.push(-1/h);b.push(2/h);c.push(-1/h);f.push(h);}
var cp=[];var fp=[];cp.push(c[0]/b[0]);fp.push(f[0]/b[0]);
for(var i=1;i<n;i++){var m=b[i]-a[i]*cp[i-1];cp.push(i<n-1?c[i]/m:0);fp.push((f[i]-a[i]*fp[i-1])/m);}
var x=new Array(n);x[n-1]=fp[n-1];for(var i=n-2;i>=0;i--){x[i]=fp[i]-cp[i]*x[i+1];}
var xs=[0];var us=[0];for(var i=0;i<n;i++){xs.push((i+1)*h);us.push(x[i]);}xs.push(1);us.push(0);
return {x:xs,u:us};}
var s4=femSolve(4);var s8=femSolve(8);var s16=femSolve(16);
var d0={x:xf,y:ufine,mode:'lines',name:'exact x(1−x)/2',line:{color:'#9ca3af',width:2,dash:'dot'}};
var d1={x:s4.x,y:s4.u,mode:'lines+markers',name:'FEM N=4',line:{color:'#f59e0b',width:2},marker:{size:7,color:'#f59e0b'}};
var d2={x:s8.x,y:s8.u,mode:'lines+markers',name:'FEM N=8',line:{color:'#10b981',width:2},marker:{size:5,color:'#10b981'}};
var d3={x:s16.x,y:s16.u,mode:'lines+markers',name:'FEM N=16',line:{color:'#3b82f6',width:2},marker:{size:4,color:'#3b82f6'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'u(x)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l7-fem-en',[d0,d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the FEM solution of $-u'' = 1$ on $(0, 1)$ with $u(0) = u(1) = 0$, for three mesh sizes $N = 4, 8, 16$, plotted against the exact answer $u(x) = x(1 - x)/2$. The markers are the nodal values; on this particular problem with linear basis functions and constant load, the FEM is <em>exact at every node</em>, regardless of $N$. The straight segments between nodes are the only approximation. Choosing higher-order basis functions or solving a problem with a non-polynomial exact solution introduces a per-element approximation error that decreases as $h^{p+1}$, with $p$ the polynomial degree of the basis.</div></div>

<div class="l-note"><strong>FEM vs finite differences (lesson 5).</strong> Finite differences impose a regular grid and replace derivatives by difference quotients. FEM accepts an unstructured mesh and replaces the differential equation by a variational identity over piecewise polynomial subspaces. The two coincide on uniform meshes for the simplest problems, but FEM handles complex geometries (aircraft wings, blood vessels, fractured rock), discontinuous coefficients, and high-order accuracy with much less pain.</div>

<h2 class="lesson-title">11. Bridge to ML 1 &mdash; Variational Autoencoder (VAE)</h2>

<p class="l-text">The word <em>variational</em> in "variational autoencoder" is not decorative. Kingma and Welling introduced the VAE in their 2014 paper "Auto-Encoding Variational Bayes" as a way to combine deep neural networks with the centuries-old machinery of variational inference. The connection to calculus of variations is direct.</p>

<p class="l-text">Setup: observed data $x$, latent variables $z$, a prior $p(z)$ (usually a standard Gaussian), and a decoder likelihood $p_\\theta(x \\mid z)$ produced by a neural network. The training objective would naturally be the marginal log-likelihood $\\log p_\\theta(x) = \\log \\int p_\\theta(x, z)\\, dz$, but the integral is intractable in any non-trivial generative model.</p>

<p class="l-text">The variational trick introduces an <em>auxiliary</em> distribution $q_\\phi(z \\mid x)$ &mdash; the encoder &mdash; parametrised by another neural network, and uses Jensen's inequality to push the log inside the integral:</p>

<div class="calc-formula"><div class="formula-label">EVIDENCE LOWER BOUND (ELBO)</div><div class="formula-main">$$\\log p_\\theta(x) \\;\\geq\\; \\mathbb{E}_{q_\\phi(z \\mid x)}\\!\\bigl[\\, \\log p_\\theta(x \\mid z)\\, \\bigr] \\;-\\; \\mathrm{KL}\\!\\bigl(\\, q_\\phi(z \\mid x)\\, \\big\\| \\, p(z)\\,\\bigr)$$</div><div class="formula-sub">The right-hand side, called the <strong>Evidence Lower BOund</strong> (ELBO), is a lower bound on the intractable marginal log-likelihood. Maximising the ELBO over $\\theta$ and $\\phi$ is the VAE training objective.</div></div>

<p class="l-text">The connection to our subject runs deep. The optimal encoder is the function $q$ that minimises the gap between the bound and the truth. That gap is exactly the KL divergence $\\mathrm{KL}(q_\\phi \\| p_\\theta(\\cdot \\mid x))$ between the proposal and the (intractable) true posterior. Searching the space of admissible distributions $q$ for the one that minimises a functional is a variational problem in the original sense of Euler and Lagrange &mdash; just with probability distributions on the parameter space instead of curves $y(x)$ on the plane.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Functional argument</div><div class="card-body">A distribution $q_\\phi(z \\mid x)$ &mdash; parametrised here by an encoder network, but in classical variational inference an unconstrained function.</div></div>
<div class="calc-card"><div class="card-title">Functional to extremise</div><div class="card-body">The negative ELBO. Maximising the ELBO is minimising a functional, exactly as in any other variational problem.</div></div>
<div class="calc-card"><div class="card-title">First-variation condition</div><div class="card-body">$\\delta\\, \\mathrm{ELBO} / \\delta q = 0$ gives the standard mean-field equations of variational inference. With a neural encoder, gradient descent in $\\phi$ replaces the variational ODE.</div></div>
<div class="calc-card"><div class="card-title">Reparametrisation trick</div><div class="card-body">Sample $z = \\mu_\\phi(x) + \\sigma_\\phi(x) \\odot \\epsilon$ with $\\epsilon \\sim \\mathcal{N}(0, I)$, so that gradients can flow through the sampling step. A purely computational trick, but indispensable.</div></div>
</div>

<div class="l-note"><strong>Beyond VAE.</strong> Variational inference is one of the two pillars of modern Bayesian deep learning, the other being Markov Chain Monte Carlo. Normalising flows, diffusion models (which, despite the name, are not solving the heat equation per se), and amortised inference networks all sit inside this variational tradition. Every time you read "ELBO" in a paper, the lineage runs back through Hinton and Neal in the 1990s to Lagrange and Euler in the 1700s.</div>

<h2 class="lesson-title">12. Bridge to ML 2 &mdash; Physics-Informed Neural Networks (PINN)</h2>

<p class="l-text">A second, more direct collision between variational calculus and deep learning is the <strong>physics-informed neural network</strong>, introduced by Maziar Raissi, Paris Perdikaris, and George Em Karniadakis in 2019. The idea is disarmingly simple: take a neural network $u_\\theta(x, t)$ as an ansatz for the solution of a PDE, and train it by minimising a loss that <em>is</em> the residual of the PDE.</p>

<div class="calc-formula"><div class="formula-label">PINN LOSS FUNCTIONAL</div><div class="formula-main">$$\\mathcal{L}(\\theta) \\;=\\; \\frac{1}{N_r}\\sum_{i=1}^{N_r} \\bigl|\\, \\mathcal{N}\\!\\bigl[u_\\theta\\bigr](x_i, t_i) \\,\\bigr|^2 \\;+\\; \\frac{\\lambda_b}{N_b}\\sum_{j=1}^{N_b} \\bigl|\\, u_\\theta(x_j^b) - g(x_j^b) \\,\\bigr|^2$$</div><div class="formula-sub">Here $\\mathcal{N}[u]$ is the PDE operator (for the heat equation, $\\mathcal{N}[u] = u_t - \\alpha^2 u_{xx}$). The first term enforces the PDE at $N_r$ random collocation points in the interior; the second pins the boundary or initial values. Both partials of $u_\\theta$ are computed by autodifferentiation through the network.</div></div>

<p class="l-text">The variational flavour is unmistakable. The continuum loss is $\\int |\\mathcal{N}[u]|^2\\, dx\\, dt$, an integral over the domain of a quantity that vanishes when $u$ solves the PDE. Minimising it is a variational problem, and the Euler-Lagrange equation of that variational problem is &mdash; up to factors &mdash; the original PDE squared. In practice the integral is replaced by a Monte Carlo sum over collocation points; stochastic gradient descent in $\\theta$ does the rest.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">No mesh required</div><div class="card-body">PINNs evaluate the PDE residual at scattered collocation points. The complex meshing that dominates traditional FEM workflows for irregular geometries simply disappears.</div></div>
<div class="calc-card"><div class="card-title">Inverse problems</div><div class="card-body">If physical parameters in $\\mathcal{N}$ are unknown, they can be learned jointly with the network weights from sparse measurement data. This makes PINNs unusually well suited to data assimilation and parameter estimation.</div></div>
<div class="calc-card"><div class="card-title">Stiff PDEs are hard</div><div class="card-body">PINNs struggle with multi-scale and stiff problems; their loss landscapes are notoriously ill conditioned. A whole industry of weighted variants (NTK-based, causal, self-adaptive) has grown to address these issues.</div></div>
<div class="calc-card"><div class="card-title">Real successes</div><div class="card-body">Forward and inverse problems for Navier-Stokes, the Schrödinger equation, two-phase flow in porous media, fracture propagation, and biomedical fluid dynamics have all been published in the PINN style since 2019.</div></div>
</div>

<div class="l-note"><strong>Where variational reasoning enters explicitly.</strong> A close cousin, the <em>Deep Ritz Method</em> (E and Yu, 2018), minimises the Dirichlet energy $E[u_\\theta]$ rather than the PDE residual. This is even closer in spirit to the Ritz-Galerkin method that begat FEM, with a neural ansatz replacing the polynomial subspace. Whether you minimise the energy (Deep Ritz) or the residual (PINN), you are doing nineteenth-century variational calculus with a twenty-first-century function class.</div>

<h2 class="lesson-title">13. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What to observe.</strong> Part A should print descent times in the order straight-line &gt; optimised &gt; cycloid, with the optimised polyline and the analytical cycloid differing by less than a percent. The ratio of discrete to analytical times will approach $1$ as $N$ grows. Part B should report that the nodal FEM error is essentially zero at every resolution &mdash; the linear-element FEM is exact at the nodes for this particular problem, an unusual but instructive special case.</p>

<div class="think-box"><div class="think-label">EXPERIMENTS TO TRY</div><div class="think-body">Push $N$ to $200$ in the brachistochrone solver: how close to the analytical cycloid does the optimised polyline get? Change the endpoint to $(2.0, 0.5)$ &mdash; the cycloid will now have to extend past its first cusp; can your solver still find it? In Part B, replace the constant load $f = 1$ by $f(x) = \\sin(\\pi x)$ and compare with the analytical answer $u(x) = \\sin(\\pi x) / \\pi^2$; the FEM is no longer exact at the nodes but it converges at rate $h^2$. Plot the maximum nodal error against $1/N$ on a log-log scale and read off the slope.</div></div>

<div class="calc-highlight"><strong>What you can now do.</strong> You can recognise a variational problem in the wild, write down its Lagrangian, derive the Euler-Lagrange equation, and solve the classics (geodesic, brachistochrone, catenary, free fall via Hamilton's principle). You can convert a linear PDE into its weak form, explain why this enlarges the solution space, and connect the weak form to a Dirichlet energy. You can stand up a one-dimensional FEM solver from scratch. And, equally important, you can read modern ML papers that talk about the ELBO or about physics-informed neural networks and recognise the same variational machinery underneath. Three centuries of mathematics, one consistent storyline &mdash; from Bernoulli's bead to Kingma's encoder.</div>
`,

/* ============================================================
   TURKISH
   ============================================================ */
tr: `
<p class="l-text">Bu izleğin önceki tüm derslerinde soru aynıydı: verilen bir diferansiyel denklem için onu sağlayan fonksiyonu bul. Ders 7 bu dünyayı baş aşağı çeviriyor. Bir <em>fonksiyonel</em> ile başlayacağız &mdash; bir fonksiyonu yiyip bir sayı çıkaran nesne &mdash; ve bu sayıyı olabildiğince küçük (ya da büyük) yapan fonksiyonu arayacağız. Cevap yine bir diferansiyel denklem tarafından yönetilecek, ama bu kez denklem bize fizik tarafından dayatılmıyor; bir ekstremleştirmeden düşüyor. Bu konunun adı <strong>varyasyon hesabı</strong>; matematiğin, fiziğin, optimal kontrolün ve modern makine öğrenmesinin şaşırtıcı bir bölümünün arkasındaki sessiz motor.</p>

<p class="l-text">Tarihsel kapsam baş döndürücü. Brakistokron eğrisi, Lagrange mekaniği, eğri yüzeyler üzerindeki jeodezikler, asılı zincirin katener şekli, minimum yüzeyli sabun zarı, roketlerin optimal kontrolü, uçak kanatlarını simüle eden sonlu elemanlar yöntemi, yüz üreten varyasyonel otokodlayıcı &mdash; hepsi farklı kostümler giymiş varyasyon hesabı. Bu dersin sonunda kostümü tanıyacak ve altındaki Euler-Lagrange denklemini gözünü kırpmadan okuyacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKLERİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir fonksiyonu <strong>fonksiyonelden</strong> ayırt et ve $J[y] = \\int_a^b L(x, y, y')\\, dx$ notasyonunu güvenle oku</li>
<li><strong>Euler-Lagrange denklemini</strong> $y \\to y + \\varepsilon \\eta$ varyasyonu kullanarak ilk ilkelerden türet</li>
<li>Üç klasik problemi çöz: jeodezik, brakistokron (sikloid) ve katener (cosh eğrisi)</li>
<li>Newton mekaniğini <strong>Hamilton'un durağan eylem ilkesi</strong> $S = \\int (T - V)\\, dt$ ile yeniden formüle et</li>
<li>Lineer bir PDE'yi <strong>zayıf forma</strong> dönüştür ve bu dönüşümün çözüm uzayını neden genişlettiğini açıkla</li>
<li>Varyasyonel bakış açısını iki modern ML yöntemine bağla: <strong>VAE ELBO</strong> ve <strong>fizik bilgili sinir ağları</strong></li>
</ul>
</div>

<h2 class="lesson-title">1. Hesaptan Varyasyon Hesabına</h2>

<p class="l-text">Sıradan hesap şu soruyu yanıtlar: verilen bir $f : \\mathbb{R} \\to \\mathbb{R}$ fonksiyonu için, $f(x)$'in en büyük ya da en küçük olduğu $x$ noktalarını bul. Teknik artık refleks: $f'(x) = 0$ yaz, çöz, ikinci türevle kritik noktaları sınıflandır. Çözdüğün bilinmeyen bir <em>sayıdır</em>: ekstremumun konumu $x_*$.</p>

<p class="l-text">Varyasyon hesabı yapısal olarak benzer ama kavramsal olarak daha büyük bir soru sorar. Girdi artık bir sayı değil; $[a, b]$ aralığında tanımlı bir $y(x)$ fonksiyonunun tamamı. Çıktı hâlâ bir sayı &mdash; $y$ ve muhtemelen türevlerini içeren bir integralden üretiliyor. Bir fonksiyonu bir sayıya gönderen nesneye <strong>fonksiyonel</strong> denir ve tür konusunda dürüst kalmak için argümanını köşeli parantezle yazarız.</p>

<div class="calc-formula"><div class="formula-label">PROTOTİP FONKSİYONEL</div><div class="formula-main">$$J[y] \\;=\\; \\int_a^b L\\!\\bigl(x, \\, y(x), \\, y'(x)\\bigr)\\, dx$$</div><div class="formula-sub">İntegrand $L$'ye <strong>Lagrangian</strong> denir. $J[y]$ fonksiyoneli, $[a,b]$'de tanımlı bir aday fonksiyon $y$ alır, onu her noktada integranda yerleştirir ve elde edilen eğrinin altındaki alanı bildirir.</div></div>

<p class="l-text">Örnekler türü netleştirir. $y(x)$ eğrisinin $x = a$ ile $x = b$ arasındaki uzunluğu bir fonksiyoneldir:</p>

<div class="calc-formula"><div class="formula-label">YAY UZUNLUĞU FONKSİYONELİ</div><div class="formula-main">$$J[y] \\;=\\; \\int_a^b \\sqrt{1 + (y'(x))^2}\\; dx$$</div><div class="formula-sub">$y(x) = x$ koyarsan $\\sqrt{2}\\,(b - a)$ elde edersin. $y(x) = \\sin x$'i $[0, \\pi]$'de koyarsan farklı bir sayı. İki fonksiyon, iki sayı. Fonksiyonel her adayı puanlar.</div></div>

<p class="l-text">Doğal soru şu: $y(a) = y_a$ ve $y(b) = y_b$ uç noktalarından geçen <em>tüm</em> düzgün $y(x)$ fonksiyonları arasında, $J[y]$'yi en küçük yapan hangisidir? Bu artık bir grafik üzerindeki tek bir noktayı bulma problemi değil. Bu, kabul edilebilir eğrilerin sonsuz boyutlu bir uzayında en küçük "maliyetli" olanı arama problemidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hesap &rarr; sayılar</div><div class="card-body">Argüman: bir $x$ sayısı. Araç: türev $f'(x)$. Kritik nokta koşulu: $f'(x) = 0$. Arama uzayı: $\\mathbb{R}$ (tek boyutlu).</div></div>
<div class="calc-card"><div class="card-title">Varyasyon &rarr; fonksiyonlar</div><div class="card-body">Argüman: bir $y(x)$ fonksiyonu. Araç: fonksiyonel türev $\\delta J / \\delta y$. Kritik fonksiyon koşulu: Euler-Lagrange ODE. Arama uzayı: bir fonksiyon uzayı (sonsuz boyutlu).</div></div>
<div class="calc-card"><div class="card-title">Ekstremum &rarr; ekstremal</div><div class="card-body">Hesapta kritik noktaya ekstremum denir. Varyasyonel problemlerde kritik fonksiyona <strong>ekstremal</strong> denir. Euler-Lagrange denklemi tam olarak bir ekstremalin sağlaması gereken denklemdir.</div></div>
<div class="calc-card"><div class="card-title">Sınır koşulları önemli</div><div class="card-body">Bir varyasyonel problem uç noktalarda neyin sabit olduğu söylenmeden tamamlanamaz. Sabit uç nokta problemleri temiz bir ODE verir. "Serbest" uç noktalar aynı türevlemeden düşen ek <em>doğal</em> sınır koşulları ekler.</div></div>
</div>

<div class="l-note"><strong>Neden yeni bir türev gerek.</strong> Çok değişkenli $f(x, y, z, \\ldots)$ fonksiyonunun minimumunu arıyor olsaydın, her $i$ için $\\partial f / \\partial x_i = 0$ çözerdin. Bir $y(x)$ fonksiyonunun sayılamaz çoklukta "bileşeni" vardır &mdash; $[a, b]$'deki her $x$ için bir tane. Fonksiyonel türev $\\delta J / \\delta y(x)$, $i$ indisi bir kontinuum üzerinde değiştiğinde kısmi türevin dönüştüğü şeydir.</div>

<h2 class="lesson-title">2. Brakistokron &mdash; Tarihsel Motivasyon</h2>

<p class="l-text">Haziran 1696'da İsviçreli matematikçi <strong>Johann Bernoulli</strong>, <em>Acta Eruditorum</em> dergisinde açık bir meydan okuma yayımladı. Düşey bir düzlemde $A$ ve $B$ noktaları verildiğinde ($A$ daha yukarıda), $A$'dan durarak bırakılan ve sürtünmesiz olarak yerçekimi altında kayan bir boncuğun en kısa sürede $B$'ye ulaşacağı eğriyi bul. Bilinmeyen eğriye Yunancada "en kısa zaman" anlamına gelen <em>brakistokron</em> adını verdi.</p>

<p class="l-text">Naif tahmin "düz bir çizgi"dir. Düz çizgi mesafe olarak en kısadır ama Bernoulli'nin zaten bildiği gibi <em>zaman</em> olarak en kısa değildir. Başlangıçta daha dik düşen bir eğri boncuğa daha erken büyük bir hız kazandırır ve uzun yay uzunluğunu yüksek ortalama hız fazlasıyla telafi eder. Soru bunun ne kadar olduğu ve optimal dengelemenin nasıl göründüğüdür.</p>

<p class="l-text">Başlangıç noktasını orijine al, boncuğun $(x_B, y_B)$ noktasına indiğini ve $y$ ekseninin <em>aşağı</em> baktığını varsay. Enerji korunumu, $y$ kadar yükseklik düşüşünde hızı $v = \\sqrt{2 g y}$ verir. Yay uzunluğu elemanı $ds = \\sqrt{1 + (y'(x))^2}\\, dx$ ve onu geçme süresi $dt = ds / v$. $0$'dan $x_B$'ye integral alarak:</p>

<div class="calc-formula"><div class="formula-label">BRAKİSTOKRON FONKSİYONELİ</div><div class="formula-main">$$T[y] \\;=\\; \\int_0^{x_B} \\frac{\\sqrt{1 + (y'(x))^2}}{\\sqrt{2 g\\, y(x)}}\\; dx$$</div><div class="formula-sub">Argümanı $y(x)$ eğrisi, çıktısı iniş süresi olan ve 1696'da Avrupa'nın en ünlü açık problemi olan bir fonksiyonel.</div></div>

<p class="l-text">Yayınlanmasından birkaç ay içinde Newton, Leibniz, Jakob Bernoulli, l'Hôpital ve Johann Bernoulli'nin kendisi her biri zekice ad hoc yöntemlerle bir çözüm üretti. Her böyle problemi tek bir ODE'nin rutin bir uygulamasına dönüştüren ilk sistematik teknik &mdash; 1744'te <strong>Leonhard Euler</strong> tarafından bir araya getirildi ve 1755'te <strong>Joseph-Louis Lagrange</strong> tarafından son haline kavuşturuldu. O ODE bir sonraki bölümün konusu.</p>

<h2 class="lesson-title">3. Euler-Lagrange Denkleminin Türetilmesi</h2>

<p class="l-text">Uç noktaları sabitle: $y(a) = y_a$, $y(b) = y_b$. Uç noktalarda yok olan herhangi bir düzgün $\\eta(x)$ fonksiyonunu düşün ($\\eta(a) = \\eta(b) = 0$). Küçük bir reel $\\varepsilon$ parametresi için, perturbe edilmiş eğri $y(x) + \\varepsilon \\eta(x)$ hâlâ her iki uç noktadan geçer. Tanımla</p>

<div class="calc-formula"><div class="formula-label">FONKSİYONELİN VARYASYONU</div><div class="formula-main">$$\\Phi(\\varepsilon) \\;=\\; J\\bigl[y + \\varepsilon \\eta\\bigr] \\;=\\; \\int_a^b L\\!\\bigl(x, \\, y + \\varepsilon\\eta, \\, y' + \\varepsilon\\eta'\\bigr)\\, dx$$</div><div class="formula-sub">Her sabit $\\eta$ perturbasyonu için, perturbe edilmiş fonksiyonel değer artık tek bir reel sayının sıradan bir fonksiyonu. Sıradan hesaba geri döndük.</div></div>

<p class="l-text">Eğer $y$ bir ekstremal ise, $\\Phi$ $\\varepsilon = 0$'da bir kritik noktaya ulaşmalıdır, yani her kabul edilebilir $\\eta$ için $\\Phi'(0) = 0$. İntegrali türeterek:</p>

<div class="calc-formula"><div class="formula-label">BİRİNCİ VARYASYON</div><div class="formula-main">$$\\Phi'(0) \\;=\\; \\int_a^b \\!\\left[\\, \\frac{\\partial L}{\\partial y}\\, \\eta(x) + \\frac{\\partial L}{\\partial y'}\\, \\eta'(x) \\,\\right] dx \\;=\\; 0$$</div><div class="formula-sub">Bunu $J$'nin $\\eta$ "yönündeki" yönlü türevi olarak oku. Her $\\eta$ için $\\Phi'(0) = 0$ koşulu, sonlu boyutta $\\nabla f = 0$'ın varyasyonel karşılığıdır.</div></div>

<p class="l-text">İkinci terimde <strong>kısmi integrasyon</strong> uygula; $\\eta(a) = \\eta(b) = 0$ kullanarak sınır katkısını öldür:</p>

<div class="calc-formula"><div class="formula-label">KISMİ İNTEGRASYONDAN SONRA</div><div class="formula-main">$$\\int_a^b \\!\\left[\\, \\frac{\\partial L}{\\partial y} - \\frac{d}{dx}\\!\\left(\\frac{\\partial L}{\\partial y'}\\right) \\right] \\eta(x)\\, dx \\;=\\; 0 \\qquad \\text{her düzgün } \\eta \\text{ için } \\eta(a) = \\eta(b) = 0$$</div><div class="formula-sub">Tüm aksiyon $\\eta(x)$'i çarpan tek bir parantezin içine itildi.</div></div>

<p class="l-text">Parantez bir alt aralıkta pozitif olsaydı, $\\eta$'yı orada lokalize bir bump fonksiyonu olarak seçip pozitif bir integral elde ederdik &mdash; bu eşitlikle çelişir. <strong>Varyasyon hesabının temel lemma'sı</strong> bu argümanı paketler: eğer her düzgün bump $\\eta$ için $\\int_a^b h(x)\\, \\eta(x)\\, dx = 0$ ise, $[a, b]$ üzerinde $h(x) \\equiv 0$'dır. Uygulayınca konunun merkezi ODE'si düşer.</p>

<div class="calc-formula"><div class="formula-label">EULER-LAGRANGE DENKLEMİ</div><div class="formula-main">$$\\boxed{\\; \\frac{\\partial L}{\\partial y} \\;-\\; \\frac{d}{dx}\\!\\left(\\frac{\\partial L}{\\partial y'}\\right) \\;=\\; 0 \\;}$$</div><div class="formula-sub">$y(x)$'te ikinci dereceden bir ODE. Sabit uç noktalarla $\\int L(x, y, y')\\, dx$'nin her ekstremalı bunu sağlar. İkinci terimdeki $d/dx$ toplam türevi zincir kuralına uyar: $L_{y'}$, $x$'e hem doğrudan hem de $y, y'$ üzerinden bağlıdır.</div></div>

<div class="calc-highlight"><strong>Tek denklem, sonsuz problem.</strong> Mekanik, geometri, optimal kontrol ve (uzantılarla) alan teorisindeki her varyasyonel problem, doğru Lagrangian $L$'yi yazıp Euler-Lagrange denkleminin kolunu çevirmeye indirgenir. Sanat çoğunlukla $L$'yi kurmaktadır; geri kalanı hesaplamadır.</div>

<div class="l-note"><strong>Yararlı bir özdeşlik: Beltrami birinci integrali.</strong> $L$ açıkça $x$'e bağlı değilse, yani $\\partial L / \\partial x = 0$, E-L denklemini $y'$ ile çarpıp yeniden düzenlemek $L - y'\\, \\partial L / \\partial y' = C$ olan korunan bir niceliği verir &mdash; bir ekstremal boyunca sabittir. Bu birinci integral ODE'nin mertebesini 2'den 1'e düşürür ve brakistokron ile katener için iş gücüdür.</div>

<h2 class="lesson-title">4. Çözümlü Örnek 1: En Kısa Yol (Jeodezik)</h2>

<p class="l-text">Isınma olarak Euler-Lagrange makinasını yay uzunluğu fonksiyoneline uygula:</p>

<div class="calc-formula"><div class="formula-label">YAY UZUNLUĞU</div><div class="formula-main">$$J[y] \\;=\\; \\int_a^b \\sqrt{1 + (y')^2}\\; dx, \\qquad L(x, y, y') = \\sqrt{1 + (y')^2}$$</div><div class="formula-sub">Düz çizgi cevabı o kadar tanıdık ki, çerçevemiz başka bir şey döndürürse aldatılmış hissetmeye hakkımız var.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$L$'nin kısmi türevlerini hesapla</div><div class="step-detail">İntegrandda açık $y$ bağımlılığı olmadığı için $\\partial L / \\partial y = 0$. $\\partial L / \\partial y' = y' / \\sqrt{1 + (y')^2}$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">E-L denklemini yaz</div><div class="step-detail">$0 - (d/dx)\\bigl[\\, y' / \\sqrt{1 + (y')^2}\\, \\bigr] = 0$, dolayısıyla parantez sabittir: $y' / \\sqrt{1 + (y')^2} = c$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$y'$ için çöz</div><div class="step-detail">Kareleyip düzenleyerek $(y')^2 = c^2 / (1 - c^2)$, bir sabit. Demek ki bir $m$ sabit eğimi için $y'(x) = m$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">İntegre et</div><div class="step-detail">$y(x) = m x + b$. Düz bir çizgi. İki integrasyon sabiti $m$ ve $b$, $y(a) = y_a$, $y(b) = y_b$ uç nokta koşullarıyla belirlenir.</div></div></div>
</div>

<p class="l-text">Öklid düzleminde iki nokta arasındaki en kısa yol bir düz çizgidir. Euler-Lagrange denklemi açık olanı doğruladı &mdash; bu, herhangi bir yeni çerçeveden daha zor problemlerde ona güvenmeden önce talep etmen gereken şey. Aynı makina küre yüzeyinde büyük çemberleri, eyer üzerinde hiperbolik jeodezikleri ve uzayzamanda genel görelilikteki zamansı jeodezikleri üretir. Çerçeve geometriden bağımsızdır; sadece $L$'nin formu değişir.</p>

<h2 class="lesson-title">5. Çözümlü Örnek 2: Brakistokron Çözümü</h2>

<p class="l-text">Bernoulli'nin meydan okumasına geri dön. Lagrangian $L = \\sqrt{1 + (y')^2}/\\sqrt{2 g y}$. Açık $x$ bağımlılığı yok, dolayısıyla Beltrami birinci integrali uygulanır. Kısa bir hesaplamadan sonra,</p>

<div class="calc-formula"><div class="formula-label">BRAKİSTOKRON İÇİN BELTRAMI BİRİNCİ İNTEGRALİ</div><div class="formula-main">$$L - y'\\, \\frac{\\partial L}{\\partial y'} \\;=\\; \\frac{1}{\\sqrt{2 g\\, y\\,(1 + (y')^2)}} \\;=\\; C$$</div><div class="formula-sub">$C$ sınır koşullarıyla belirlenen bir sabittir. Düzenleyerek $y\\,(1 + (y')^2) = 1/(2 g C^2) \\equiv k$, bir sabit.</div></div>

<p class="l-text">Bu birinci dereceden ODE tanıdık görünmüyor, ama akıllıca bir parametreleme onu evcilleştirir. Bir $\\theta$ parametresi için $y'(x) = \\cot(\\theta / 2)$ koy. Yarım açı özdeşliği $1 + \\cot^2(\\theta / 2) = 1 / \\sin^2(\\theta / 2) = 2 / (1 - \\cos \\theta)$ kullanarak yerine koymak $y = (k/2)(1 - \\cos \\theta)$ verir. $x$'i $\\theta$'ya göre türeyip integre etmek $x$ için eşleştirici denklemi verir:</p>

<div class="calc-formula"><div class="formula-label">SİKLOİD PARAMETRELEMESİ</div><div class="formula-main">$$x(\\theta) \\;=\\; \\frac{k}{2}\\,(\\theta - \\sin \\theta), \\qquad y(\\theta) \\;=\\; \\frac{k}{2}\\,(1 - \\cos \\theta)$$</div><div class="formula-sub">$x$-ekseni boyunca yuvarlanan $k/2$ yarıçaplı bir çemberin kenarındaki bir noktanın çizdiği eğri. Brakistokron bir sikloiddir &mdash; düz çizgi değil, parabol değil, bir tekerin yuvarlanmasıyla üretilen eğri.</div></div>

<div id="plot-l7-brachi-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var Np=200;var k=1.0;var theta_end=2.41;var th=[];var xs=[];var ys=[];
for(var i=0;i<Np;i++){var t=theta_end*i/(Np-1);th.push(t);xs.push((k/2)*(t-Math.sin(t)));ys.push((k/2)*(1-Math.cos(t)));}
var xB=xs[Np-1];var yB=ys[Np-1];
var xLine=[];var yLine=[];
for(var i=0;i<Np;i++){xLine.push(xB*i/(Np-1));yLine.push(yB*i/(Np-1));}
var xPar=[];var yPar=[];
for(var i=0;i<Np;i++){var u=i/(Np-1);xPar.push(xB*u);yPar.push(yB*u*u);}
function descentTime(xa,ya){var T=0;var g=9.81;var n=xa.length;for(var i=1;i<n;i++){var dx=xa[i]-xa[i-1];var dy=ya[i]-ya[i-1];var ds=Math.sqrt(dx*dx+dy*dy);var y_mid=0.5*(ya[i]+ya[i-1]);if(y_mid<=1e-6)continue;var v=Math.sqrt(2*g*y_mid);T+=ds/v;}return T;}
var tCyc=descentTime(xs,ys);var tLine=descentTime(xLine,yLine);var tPar=descentTime(xPar,yPar);
var d1={x:xs,y:ys,mode:'lines',name:'sikloid t='+tCyc.toFixed(3)+'s',line:{color:'#3b82f6',width:3}};
var d2={x:xLine,y:yLine,mode:'lines',name:'düz çizgi t='+tLine.toFixed(3)+'s',line:{color:'#f59e0b',width:2,dash:'dash'}};
var d3={x:xPar,y:yPar,mode:'lines',name:'parabol t='+tPar.toFixed(3)+'s',line:{color:'#10b981',width:2,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'y (aşağı)',gridcolor:'#1f2937',zerolinecolor:'#374151',autorange:'reversed'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l7-brachi-tr',[d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne anlatıyor:</strong> aynı iki uç nokta arasında üç aday iniş eğrisi; düşen boncuğun geometrisine uymak için $y$ aşağı doğru çizildi. Düz çizgi (turuncu) mesafe olarak en kısa. Parabol (yeşil) başlangıçta daha dik düşer. Sikloid (mavi) tepe yakınında en dik düşer, erken hız kazanır, sonra yolun ikinci yarısı için düzleşir. Sayısal iniş süreleri Bernoulli'nin iddiasını doğruluyor: sikloid kazanır, parabol ikinci olur, düz çizgi en yavaşıdır. Başlangıçtaki diklik toplam uzunluktan daha önemli.</div></div>

<div class="l-note"><strong>İkinci bir sürpriz: tautokronluk.</strong> Christiaan Huygens 1659'da aynı sikloidin daha da dikkat çekici bir özelliği olduğunu fark etti. Bir boncuğu sikloid bir rampada <em>herhangi</em> bir yükseklikten bıraksan, dibe ulaşma süresi aynıdır. Huygens, sıradan sarkaçlı saatlerin yaşadığı küçük açı yaklaşımını telafi etmek için bobun bir sikloid &mdash; <em>tautokron</em> &mdash; izlediği bir sarkaç inşa etti. Tek eğri, iki üstünlük.</div>

<h2 class="lesson-title">6. Çözümlü Örnek 3: Katener</h2>

<p class="l-text">Belirli toplam uzunluğu $\\ell$ olan tekdüze esnek bir zinciri iki direk arasına as. Yerçekimi aşağı doğru etki ediyor. Zincir hangi şekli alır? Galileo bir parabol tahmin etti; yanılıyordu. Jakob Bernoulli problemi 1690'da öne sürdü ve Johann Bernoulli, Huygens ile Leibniz ertesi yıl çözdüler. Doğru cevap <strong>katener</strong>'dir &mdash; toplam yay uzunluğu sabit kalmak koşuluyla zincirin yerçekimsel potansiyel enerjisini minimize eden şekil.</p>

<p class="l-text">Doğrusal kütle yoğunluğu $\\rho$ olan bir zincir için, $y$ yüksekliğindeki $ds$ yay elemanında depolanan potansiyel enerji $\\rho g\\, y\\, ds$'dir. Toplam potansiyel enerji:</p>

<div class="calc-formula"><div class="formula-label">ASILI ZİNCİRİN POTANSİYEL ENERJİSİ</div><div class="formula-main">$$U[y] \\;=\\; \\rho g \\int_a^b y(x)\\, \\sqrt{1 + (y')^2}\\; dx$$</div><div class="formula-sub">Sabit uzunluk kısıtı altında bu fonksiyoneli minimize eden şekil zincirin denge konfigürasyonudur.</div></div>

<p class="l-text">Çarpımsal sabitleri bir kenara koy ve Beltrami birinci integralini $L = y\\,\\sqrt{1 + (y')^2}$'ye uygula:</p>

<div class="calc-formula"><div class="formula-label">KATENER İÇİN BİRİNCİ İNTEGRAL</div><div class="formula-main">$$L - y'\\,\\frac{\\partial L}{\\partial y'} \\;=\\; \\frac{y}{\\sqrt{1 + (y')^2}} \\;=\\; a$$</div><div class="formula-sub">Birinci dereceden ayrılabilir bir ODE: $y^2 = a^2\\,(1 + (y')^2)$.</div></div>

<p class="l-text">$y'$ için çözüp değişkenleri ayır; $\\int dy / \\sqrt{(y/a)^2 - 1}$ integrali $\\cosh^{-1}$ için standart olandır. Sonuç katener eğrisidir:</p>

<div class="calc-formula"><div class="formula-label">KATENER EĞRİSİ</div><div class="formula-main">$$y(x) \\;=\\; a\\, \\cosh\\!\\left(\\frac{x - x_0}{a}\\right)$$</div><div class="formula-sub">$a$ parametresi zincirin ne kadar gevşek ya da gergin olduğunu kontrol eder; küçük $a$ derin gevşek bir eğri, büyük $a$ neredeyse düz bir eğri verir. $x_0$ sabiti en alçak noktayı kaydırır.</div></div>

<div id="plot-l7-catenary-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var Np=300;var xs=[];for(var i=0;i<Np;i++){xs.push(-2+4*i/(Np-1));}
var as=[0.5,1.0,2.0,4.0];var colors=['#3b82f6','#10b981','#f59e0b','#ef4444'];var traces=[];
for(var k=0;k<as.length;k++){var a=as[k];var ys=[];for(var i=0;i<Np;i++){ys.push(a*Math.cosh(xs[i]/a));}
  traces.push({x:xs,y:ys,mode:'lines',name:'a = '+a.toFixed(1),line:{color:colors[k],width:2.5}});}
var xpar=[];var ypar=[];for(var i=0;i<Np;i++){var x=xs[i];xpar.push(x);ypar.push(1.0+x*x/2);}
traces.push({x:xpar,y:ypar,mode:'lines',name:'parabol (Galileo)',line:{color:'#9ca3af',width:1.5,dash:'dash'}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'y = a cosh(x/a)',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[0,8]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l7-catenary-tr',traces,layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne anlatıyor:</strong> dört farklı $a$ değeri için $y = a\\,\\cosh(x/a)$ kateneri. Küçük $a$ derin dar bir vadi üretir (az gevşekli gergin tel); büyük $a$ eğriyi düzleştirir ve minimumu yukarı iter. Kesikli gri eğri, $a = 1$ katenerine en altta teğet olan $1 + x^2/2$ parabolüdür &mdash; minimum yakınında benzer, ama kanatlarda hızla ayrışır. Bu ayrılma tam olarak Galileo'nun yanlış tahmini ile gerçek denge şekli arasındaki farktır.</div></div>

<div class="l-note"><strong>Doğada her yerde.</strong> Telefon telleri, asma köprü ana kabloları (neredeyse &mdash; kablo, kendi ağırlığı yerine güverte ağırlığını taşır ve gerçek bir parabol üretir), ters çevrilmiş katedral kemerleri (Antoni Gaudí, Sagrada Família modellerini asılı zincirlerle yapıp ortaya çıkan katenerleri ters çevirdi) ve St. Louis'deki ikonik Geçit Kemeri (ağırlıklı bir katener). Aynı denklem, dört yüzyıllık mimari.</div>

<h2 class="lesson-title">7. Lagrange Mekaniği &mdash; Hamilton İlkesi</h2>

<p class="l-text">1834'te William Rowan Hamilton tüm klasik mekaniği bir cümlede yeniden formüle etti. İki sabit an $t_1$ ve $t_2$ arasında aday yörünge $q(t)$'nin <strong>eylemini</strong>, $L = T - V$ Lagrangianın zaman integrali olarak tanımla &mdash; burada $T$ kinetik enerji, $V$ potansiyel enerji:</p>

<div class="calc-formula"><div class="formula-label">HAMILTON EYLEMİ</div><div class="formula-main">$$S[q] \\;=\\; \\int_{t_1}^{t_2} L\\!\\bigl(q(t), \\dot q(t), t\\bigr)\\, dt \\;=\\; \\int_{t_1}^{t_2} \\bigl[\\, T - V \\,\\bigr]\\, dt$$</div><div class="formula-sub">Verilen başlangıç ve bitiş konfigürasyonları arasındaki her aday yola bir reel sayı (eylem) atayan bir fonksiyonel.</div></div>

<p class="l-text"><strong>Hamilton ilkesi</strong> der ki: fiziksel olarak gerçekleşen yörünge $S$'nin bir ekstremalidir. Bu Lagrangianı Euler-Lagrange'a koyarsan Newton'un $F = m a$ denklemini sonuçta çıkan ODE olarak elde edersin &mdash; üstelik büyük bir bonusla: prosedür koordinat sisteminden bağımsızdır. $T$ ve $V$'yi küresel, silindirik ya da herhangi başka bir koordinatta yazıp aynı kolu çevirerek o koordinatlardaki hareket denklemlerini türetebilirsin. Vektör ayrıştırması yok, sahte kuvvet yok.</p>

<div class="calc-formula"><div class="formula-label">MEKANİK İÇİN EULER-LAGRANGE</div><div class="formula-main">$$\\frac{d}{dt}\\!\\left(\\frac{\\partial L}{\\partial \\dot q}\\right) \\;-\\; \\frac{\\partial L}{\\partial q} \\;=\\; 0$$</div><div class="formula-sub">Bağımsız değişken artık $x$ yerine $t$ ve genelleştirilmiş hız $\\dot q$, $y'$'nin rolünü oynuyor. Bunun dışında bu tam olarak Bölüm 3'teki denklemdir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK: SERBEST DÜŞEN PARÇACIK</div><div class="example-body"><strong>Kuruluş.</strong> $m$ kütleli bir parçacık yerçekimi altında dikey hareket ediyor. $y$'yi yükseklik al. Kinetik enerji $T = \\tfrac{1}{2} m \\dot y^2$. Potansiyel enerji $V = m g y$. Lagrangian $L = T - V = \\tfrac{1}{2} m \\dot y^2 - m g y$.<br><br><strong>Kısmileri hesapla.</strong> $\\partial L / \\partial \\dot y = m \\dot y$, dolayısıyla $(d/dt)(\\partial L / \\partial \\dot y) = m \\ddot y$. $\\partial L / \\partial y = -m g$.<br><br><strong>Euler-Lagrange denklemi.</strong> $m \\ddot y - (-m g) = 0$, yani $m \\ddot y = -m g$, eşdeğer olarak $\\ddot y = -g$.<br><br>Bu, $F = ma$'yı asla yazmadan, varyasyonel bir ilkeden türetilmiş serbest düşüş için Newton'un ikinci yasasıdır. Sihir, ama bu Bernoulli birinci integralindekiyle aynı sihir &mdash; hesabın yapısı muhasebeyi senin için yapıyor.</div></div>

<div id="plot-l7-action-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var T=1.0;var g=9.81;var v0=g*T/2;
var Np=200;var ts=[];for(var i=0;i<Np;i++){ts.push(T*i/(Np-1));}
function actionOf(yfun){var S=0;var n=ts.length;for(var i=1;i<n;i++){var dt=ts[i]-ts[i-1];var t_mid=0.5*(ts[i]+ts[i-1]);var y_a=yfun(ts[i]);var y_b=yfun(ts[i-1]);var v=(y_a-y_b)/dt;var y_mid=0.5*(y_a+y_b);S+=(0.5*v*v-g*y_mid)*dt;}return S;}
function yTrue(t){return v0*t-0.5*g*t*t;}
var alphas=[-0.4,-0.2,-0.05,0,0.05,0.2,0.4];var as=[];var Ss=[];
for(var k=0;k<alphas.length;k++){var a=alphas[k];var fn=(function(aa){return function(t){return yTrue(t)+aa*Math.sin(Math.PI*t/T);};})(a);as.push(a);Ss.push(actionOf(fn));}
var trueY=ts.map(yTrue);var pertY=ts.map(function(t){return yTrue(t)+0.3*Math.sin(Math.PI*t/T);});var pert2=ts.map(function(t){return yTrue(t)-0.3*Math.sin(Math.PI*t/T);});
var d1={x:ts,y:trueY,mode:'lines',name:'fiziksel y(t) (ekstremal)',line:{color:'#3b82f6',width:3},xaxis:'x',yaxis:'y'};
var d2={x:ts,y:pertY,mode:'lines',name:'perturbe (+)',line:{color:'#f59e0b',width:1.5,dash:'dash'},xaxis:'x',yaxis:'y'};
var d3={x:ts,y:pert2,mode:'lines',name:'perturbe (-)',line:{color:'#10b981',width:1.5,dash:'dot'},xaxis:'x',yaxis:'y'};
var d4={x:as,y:Ss,mode:'lines+markers',name:'eylem S(ε)',line:{color:'#ef4444',width:2.5},marker:{size:7,color:'#ef4444'},xaxis:'x2',yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'t',gridcolor:'#1f2937',domain:[0,0.46]},yaxis:{title:'y(t)',gridcolor:'#1f2937'},xaxis2:{title:'perturbasyon ε',gridcolor:'#1f2937',domain:[0.54,1]},yaxis2:{title:'eylem S[y+ε·η]',gridcolor:'#1f2937'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l7-action-tr',[d1,d2,d3,d4],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne anlatıyor:</strong> solda mavi renkte fiziksel serbest düşüş yörüngesi ve onun turuncu ile yeşilde iki sinüsoidal perturbasyonu &mdash; aynı başlangıç ve bitiş, farklı orta. Sağda $\\varepsilon$ ile parametrelenmiş böyle perturbasyon ailesi için sayısal olarak hesaplanmış eylem $S$. Eylem $\\varepsilon = 0$'da duraksıyor (lokal ekstremal): eğri sıfır perturbasyon yakınında düzleşiyor. Hamilton ilkesi tek bir resimde &mdash; fiziksel yörüngeler yol uzayının eyleminin kritik bir noktasında olanlardır.</div></div>

<div class="l-note"><strong>Bu neden mekaniğin ötesinde önemli.</strong> Maxwell denklemleri, genel görelilik, parçacık fiziğinin Standart Modeli &mdash; fizikteki her temel teori bir Lagrangian ile kodlanır ve durağan eylem ilkesinden elde edilir. $\\delta S = 0$'ı okumayı bilmek, özel bir teknikten çok evrensel bir dile yakındır.</div>

<h2 class="lesson-title">8. Kısıtlar ve Lagrange Çarpanları</h2>

<p class="l-text">Birçok varyasyonel problem yan koşullarla gelir. Katener, sabit uzunluk <em>altında</em> potansiyel enerjiyi minimize eder. <strong>Dido problemi</strong> (Vergilius'a göre bir öküz derisi ile çevirebildiği kadar arazi teklif edilen Fenikeli kraliçeden alır adını), düzlemdeki kapalı eğriler arasında verilen çevreyle maksimum alanı çevreleyenini sorar. Cevap bir çemberdir ama kanıtlamak Euler-Lagrange makinasını kısıtlarla çalışacak şekilde geliştirmeyi gerektirir.</p>

<p class="l-text">Teknik, sıradan hesaptan Lagrange çarpanlarının doğrudan bir genelleştirmesidir. $K[y] = c$ kısıtı altında $J[y]$'yi ekstremlemek yerine, değiştirilmiş fonksiyoneli ekstremle:</p>

<div class="calc-formula"><div class="formula-label">KISITLI VARYASYONEL PROBLEM</div><div class="formula-main">$$J[y] - \\lambda\\, \\bigl(K[y] - c\\bigr) \\;=\\; \\int_a^b \\bigl[\\, L_J - \\lambda\\, L_K \\,\\bigr]\\, dx$$</div><div class="formula-sub">Bir skaler çarpan $\\lambda$ yan koşulu değiştirir; yeni Euler-Lagrange denklemi artık değiştirilmiş Lagrangian $L_J - \\lambda\\, L_K$'yi içerir. E-L denklemini çöz, sonra $\\lambda$'yı orijinal kısıt $K[y] = c$ sağlanacak şekilde seç.</div></div>

<div class="calc-example"><div class="example-label">DIDO'NUN İZOPERİMETRİK PROBLEMİ</div><div class="example-body"><strong>Kuruluş.</strong> Sabit çevre $\\oint ds = P$ altında çevrelenen alan $A = \\tfrac{1}{2}\\oint (x\\, dy - y\\, dx)$'yi maksimize et.<br><br><strong>Değiştirilmiş Lagrangian.</strong> Çevre kısıtına bir çarpan ekle ve E-L denklemini parametrik formda uygula. Dikkatli ama rutin bir hesaplamadan sonra her iki Kartezyen koordinat $r = P / (2 \\pi)$ yarıçaplı bir çember denklemini sağlar.<br><br><strong>Sonuç.</strong> Verilen çevreli tüm basit kapalı eğriler arasında, çember en büyük alanı çevreler. Sonuç antik çağdan beri biliniyordu ama on dokuzuncu yüzyıla kadar tam titizlikle kanıtlanmadı.</div></div>

<div class="l-note"><strong>ML okuyucusu neden umursamalı.</strong> SVM'ler ve diğer pek çok ML algoritmasının temelindeki KKT koşulları, bu hikayenin ayrık karşılığıdır. Lagrangian ikili Lagrangian olur, çarpanlar dual değişkenler olur ve ikilik açığı birincil ve dual problemlerin ne kadar uyuştuğunu ölçer.</div>

<h2 class="lesson-title">9. PDE'lerin Varyasyonel Formu &mdash; Zayıf Formülasyon</h2>

<p class="l-text">Birçok PDE, hem teorik hem de sayısal olarak çalışması bazen daha kolay olan eşdeğer bir varyasyonel yeniden formülasyona izin verir. Aldatıcı şekilde basit sınır-değer problemini düşün:</p>

<div class="calc-formula"><div class="formula-label">BİR ARALIKTA POISSON</div><div class="formula-main">$$-u''(x) \\;=\\; f(x) \\quad \\text{üzerinde } (0, 1), \\qquad u(0) = u(1) = 0$$</div><div class="formula-sub">Tek boyutlu Poisson denklemi: $u$'yu $f$ yükü altında esnek bir telin yer değiştirmesi olarak düşün. Klasik çözümler, ODE'yi noktasal olarak sağlayan $u \\in C^2[0,1]$ fonksiyonlarıdır.</div></div>

<p class="l-text">Varyasyonel yeniden formülasyon, sınırda yok olan bir <em>test fonksiyonu</em> $v$ ile başlar: $v(0) = v(1) = 0$. PDE'yi $v$ ile çarp, $[0, 1]$ üzerinde integre et ve kısmi integrasyon uygula:</p>

<div class="calc-formula"><div class="formula-label">ZAYIF FORM</div><div class="formula-main">$$\\int_0^1 u'(x)\\, v'(x)\\, dx \\;=\\; \\int_0^1 f(x)\\, v(x)\\, dx \\qquad \\text{her kabul edilebilir } v \\text{ için}$$</div><div class="formula-sub">Kısmi integrasyondan gelen sınır terimleri, $v(0) = v(1) = 0$ olduğu için yok olur. Sonuç, noktasal bir diferansiyel denklem yerine bir integral özdeşliğidir.</div></div>

<p class="l-text">Bu neden yararlı? İki neden. Birincisi, sol tarafta $u$'nun sadece bir türevi görünüyor; orijinal PDE iki türev talep ediyordu. Zayıf form bu nedenle yalnızca bir (kareye-integre edilebilir) türevi olan $u$ fonksiyonları için anlamlı &mdash; $C^2$'den çok daha büyük ve daha bağışlayıcı bir uzay. Çözümler, verinin $f$ atladığı noktalarda kıvrımlar olabilir ve yine de zayıf formu sağlayabilir. İkincisi, zayıf form bir enerji fonksiyonelinin Euler-Lagrange denklemidir:</p>

<div class="calc-formula"><div class="formula-label">DIRICHLET ENERJİSİ</div><div class="formula-main">$$E[u] \\;=\\; \\int_0^1 \\!\\left[\\, \\tfrac{1}{2} (u'(x))^2 - f(x)\\, u(x) \\,\\right] dx$$</div><div class="formula-sub">Birinci varyasyonu al: $\\delta E = \\int (u' v' - f v)\\, dx$, tam olarak zayıf form geçerli olduğunda her test fonksiyonu $v$ için sıfıra eşit. Enerjiyi minimize etmek, zayıf Poisson problemini çözmektir.</div></div>

<div id="plot-l7-test-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var Np=200;var xs=[];for(var i=0;i<Np;i++){xs.push(i/(Np-1));}
var u=xs.map(function(x){return 0.5*x*(1-x);});
var v1=xs.map(function(x){return Math.sin(Math.PI*x);});
var v2=xs.map(function(x){return Math.sin(2*Math.PI*x);});
var v3=xs.map(function(x){return Math.sin(3*Math.PI*x);});
var v4=xs.map(function(x){var p=0.3;if(x<p)return x/p;if(x<p+0.1)return 1;if(x<p+0.4)return (p+0.4-x)/0.3;return 0;});
var d1={x:xs,y:u,mode:'lines',name:'gerçek u(x) = x(1−x)/2',line:{color:'#3b82f6',width:3}};
var d2={x:xs,y:v1,mode:'lines',name:'test v₁ = sin(πx)',line:{color:'#f59e0b',width:1.5,dash:'dash'}};
var d3={x:xs,y:v2,mode:'lines',name:'test v₂ = sin(2πx)',line:{color:'#10b981',width:1.5,dash:'dash'}};
var d4={x:xs,y:v3,mode:'lines',name:'test v₃ = sin(3πx)',line:{color:'#ef4444',width:1.5,dash:'dash'}};
var d5={x:xs,y:v4,mode:'lines',name:'parçalı şapka (FEM)',line:{color:'#a78bfa',width:1.5,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[0,1]},yaxis:{title:'fonksiyon değeri',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1.1,1.2]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l7-test-tr',[d1,d2,d3,d4,d5],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne anlatıyor:</strong> sıfır Dirichlet sınır koşullarıyla $-u'' = 1$ denkleminin çözümü olan $u(x) = x(1-x)/2$ (mavi, sürekli), $x = 0$ ve $x = 1$'de yok olan dört test fonksiyonu $v$ ile birlikte gösteriliyor. Zayıf form, $\\int u' v' \\, dx = \\int f v \\, dx$ integral özdeşliğinin <em>her</em> böyle $v$ için tutulmasını gerektirir. İlk üç test fonksiyonu Fourier sinüsleri; dördüncü ise bir sonraki bölümde sonlu elemanlar yönteminin kullandığı türden parçalı doğrusal şapka fonksiyonudur. Farklı $v$ seçimleri çözümün farklı bölgelerini yoklar.</div></div>

<div class="l-note"><strong>"Dirichlet ilkesi".</strong> Riemann meşhur bir şekilde, enerji fonksiyoneli minimumuna ulaşmak zorunda olduğu için her Dirichlet probleminin bir çözümü olduğunu öne sürdü. Weierstrass argümandaki boşluğa &mdash; infimum otomatik olarak ulaşılmaz &mdash; dikkat çekti ve Hilbert 1900'de modern fonksiyonel analize dönüşen tekniklerle bunu titizlikle doldurdu. Dirichlet ilkesi artık bir teoremdir ve Sobolev uzaylarının fırlatma rampasıdır.</div>

<h2 class="lesson-title">10. Sonlu Elemanlar Yöntemi (FEM) &mdash; En Kısa Giriş</h2>

<p class="l-text">Sonlu elemanlar yöntemi, 1950'lerde havacılık mühendisleri ve matematikçiler tarafından bağımsız olarak tasarlandı; karmaşık geometrilerde varyasyonel PDE'leri çözmenin lider yoludur. Tarif kısa:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Tanım kümesini ayrıştır</div><div class="step-detail">$[0, 1]$'i $h = 1/N$ genişlikli $N$ küçük aralık $[x_{i-1}, x_i]$'ye böl. İki boyutta tanım kümesini üçgenlere ya da dörtgenlere ayır.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Baz fonksiyonlarını seç</div><div class="step-detail">Her iç düğüm $x_i$ için, $x_i$'de $1$'e, komşu düğümlerinde $0$'a eşit olan ve aralarda doğrusal olan parçalı doğrusal "şapka" $\\phi_i(x)$'i tanımla. $\\phi_i$'ler birlikte kabul edilebilir fonksiyon uzayının sonlu boyutlu bir altuzayını gerer.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Galerkin projeksiyonu</div><div class="step-detail">Deneme çözümünü $u_h(x) = \\sum_j c_j \\phi_j(x)$ olarak yaz ve zayıf formun her baz test fonksiyonu $v = \\phi_i$ için sağlanmasını iste. Bu, PDE'yi sertlik matrisi $K_{ij} = \\int \\phi_i' \\phi_j'\\, dx$ olan bir doğrusal sistem $K \\boldsymbol c = \\boldsymbol f$'ye indirger.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Çöz ve yeniden inşa et</div><div class="step-detail">(Seyrek, bantlı) doğrusal sistemi $c_j$ katsayıları için çöz, sonra $u_h = \\sum c_j \\phi_j$ topla ve $u$ için bir yaklaşım elde et.</div></div></div>
</div>

<p class="l-text">$u(0) = u(1) = 0$ ile $-u'' = 1$ problemi için, sertlik matrisi köşegende $2/h$ ve köşegen-dışında $-1/h$ olan tridiagonaldir, yük vektörü $f_i = h$'dir. Tam analitik çözüm $u(x) = x(1 - x)/2$, FEM'in herhangi bir $N$ için düğümlerde tam olarak yakaladığı çözümdür. Bunu aşağıdaki Pyodide alıştırmasında doğrulayacağız.</p>

<div id="plot-l7-fem-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nfine=400;var xf=[];for(var i=0;i<Nfine;i++){xf.push(i/(Nfine-1));}
var ufine=xf.map(function(x){return 0.5*x*(1-x);});
function femSolve(N){var h=1/N;var n=N-1;var a=[];var b=[];var c=[];var f=[];
for(var i=0;i<n;i++){a.push(-1/h);b.push(2/h);c.push(-1/h);f.push(h);}
var cp=[];var fp=[];cp.push(c[0]/b[0]);fp.push(f[0]/b[0]);
for(var i=1;i<n;i++){var m=b[i]-a[i]*cp[i-1];cp.push(i<n-1?c[i]/m:0);fp.push((f[i]-a[i]*fp[i-1])/m);}
var x=new Array(n);x[n-1]=fp[n-1];for(var i=n-2;i>=0;i--){x[i]=fp[i]-cp[i]*x[i+1];}
var xs=[0];var us=[0];for(var i=0;i<n;i++){xs.push((i+1)*h);us.push(x[i]);}xs.push(1);us.push(0);
return {x:xs,u:us};}
var s4=femSolve(4);var s8=femSolve(8);var s16=femSolve(16);
var d0={x:xf,y:ufine,mode:'lines',name:'tam x(1−x)/2',line:{color:'#9ca3af',width:2,dash:'dot'}};
var d1={x:s4.x,y:s4.u,mode:'lines+markers',name:'FEM N=4',line:{color:'#f59e0b',width:2},marker:{size:7,color:'#f59e0b'}};
var d2={x:s8.x,y:s8.u,mode:'lines+markers',name:'FEM N=8',line:{color:'#10b981',width:2},marker:{size:5,color:'#10b981'}};
var d3={x:s16.x,y:s16.u,mode:'lines+markers',name:'FEM N=16',line:{color:'#3b82f6',width:2},marker:{size:4,color:'#3b82f6'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'u(x)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l7-fem-tr',[d0,d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne anlatıyor:</strong> üç ağ boyutu $N = 4, 8, 16$ için $u(0) = u(1) = 0$ ile $-u'' = 1$'in FEM çözümü, tam cevap $u(x) = x(1 - x)/2$ ile karşılaştırılıyor. Belirteçler düğüm değerleri; doğrusal baz fonksiyonları ve sabit yük olan bu özel problemde FEM <em>her düğümde tam</em>, $N$'den bağımsız olarak. Düğümler arasındaki düz parçalar tek yaklaşımdır. Daha yüksek mertebeden baz fonksiyonları seçmek ya da polinom olmayan tam çözüme sahip bir problem çözmek, polinom derecesi $p$ olan bazlarla $h^{p+1}$ olarak azalan element başına bir yaklaşım hatası getirir.</div></div>

<div class="l-note"><strong>FEM vs sonlu farklar (ders 5).</strong> Sonlu farklar düzgün bir ızgara dayatır ve türevleri fark bölümleriyle değiştirir. FEM yapılandırılmamış bir ağı kabul eder ve diferansiyel denklemi parçalı polinom altuzayları üzerinde bir varyasyonel özdeşlikle değiştirir. İkisi en basit problemler için tek tip ağlarda çakışır, ama FEM karmaşık geometrileri (uçak kanatları, kan damarları, çatlamış kayalar), süreksiz katsayıları ve yüksek-mertebeden doğruluğu çok daha az acıyla idare eder.</div>

<h2 class="lesson-title">11. ML'e Köprü 1 &mdash; Varyasyonel Otokodlayıcı (VAE)</h2>

<p class="l-text">"Varyasyonel otokodlayıcı"daki <em>varyasyonel</em> kelimesi süs değildir. Kingma ve Welling, 2014 tarihli "Auto-Encoding Variational Bayes" makalelerinde VAE'yi, derin sinir ağlarını yüzyıllar eski varyasyonel çıkarımın makinasıyla birleştirmenin bir yolu olarak tanıttı. Varyasyon hesabıyla bağlantı doğrudandır.</p>

<p class="l-text">Kuruluş: gözlenen veri $x$, gizli değişkenler $z$, bir önsel $p(z)$ (genellikle standart bir Gauss) ve bir sinir ağı tarafından üretilen bir kod çözücü olabilirliği $p_\\theta(x \\mid z)$. Eğitim hedefi doğal olarak marjinal log-olabilirlik $\\log p_\\theta(x) = \\log \\int p_\\theta(x, z)\\, dz$ olurdu, ama integral herhangi bir önemsiz olmayan üretici modelde hesaplanabilir değildir.</p>

<p class="l-text">Varyasyonel hile, başka bir sinir ağıyla parametrelenen bir <em>yardımcı</em> dağılım $q_\\phi(z \\mid x)$ &mdash; kodlayıcı &mdash; tanıtır ve logu integralin içine itmek için Jensen eşitsizliğini kullanır:</p>

<div class="calc-formula"><div class="formula-label">KANIT ALT SINIRI (ELBO)</div><div class="formula-main">$$\\log p_\\theta(x) \\;\\geq\\; \\mathbb{E}_{q_\\phi(z \\mid x)}\\!\\bigl[\\, \\log p_\\theta(x \\mid z)\\, \\bigr] \\;-\\; \\mathrm{KL}\\!\\bigl(\\, q_\\phi(z \\mid x)\\, \\big\\| \\, p(z)\\,\\bigr)$$</div><div class="formula-sub">Sağ taraf, <strong>Kanıt Alt Sınırı</strong> (ELBO &mdash; Evidence Lower BOund) olarak adlandırılır; hesaplanabilir olmayan marjinal log-olabilirlik için bir alt sınırdır. ELBO'yu $\\theta$ ve $\\phi$ üzerinde maksimize etmek VAE eğitim hedefidir.</div></div>

<p class="l-text">Bağlantı konumuza derinden uzanır. Optimal kodlayıcı, sınır ile gerçek arasındaki boşluğu minimize eden $q$ fonksiyonudur. O boşluk tam olarak öneri ile (hesaplanamayan) gerçek sonsal arasındaki KL ıraksaklığı $\\mathrm{KL}(q_\\phi \\| p_\\theta(\\cdot \\mid x))$'dır. Kabul edilebilir dağılımların $q$ uzayında bir fonksiyoneli minimize edenin aranması, Euler ve Lagrange'ın orijinal anlamında bir varyasyonel problemdir &mdash; düzlemdeki $y(x)$ eğrileri yerine parametre uzayındaki olasılık dağılımlarıyla.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fonksiyonel argümanı</div><div class="card-body">Bir dağılım $q_\\phi(z \\mid x)$ &mdash; burada bir kodlayıcı ağ ile parametrelenmiş, ama klasik varyasyonel çıkarımda kısıtlanmamış bir fonksiyon.</div></div>
<div class="calc-card"><div class="card-title">Ekstremlenecek fonksiyonel</div><div class="card-body">Negatif ELBO. ELBO'yu maksimize etmek, başka herhangi bir varyasyonel problemdeki gibi, bir fonksiyoneli minimize etmektir.</div></div>
<div class="calc-card"><div class="card-title">Birinci-varyasyon koşulu</div><div class="card-body">$\\delta\\, \\mathrm{ELBO} / \\delta q = 0$, varyasyonel çıkarımın standart ortalama-alan denklemlerini verir. Sinirsel bir kodlayıcı ile $\\phi$'de gradyan inişi varyasyonel ODE'nin yerini alır.</div></div>
<div class="calc-card"><div class="card-title">Yeniden parametreleme hilesi</div><div class="card-body">$\\epsilon \\sim \\mathcal{N}(0, I)$ ile $z = \\mu_\\phi(x) + \\sigma_\\phi(x) \\odot \\epsilon$ örnekle, böylece gradyanlar örnekleme adımından akabilir. Sırf hesaplamalı bir hile, ama vazgeçilmez.</div></div>
</div>

<div class="l-note"><strong>VAE'nin ötesinde.</strong> Varyasyonel çıkarım modern Bayes derin öğrenmesinin iki sütunundan biri; diğeri Markov Zinciri Monte Carlo. Normalleştirici akışlar, difüzyon modelleri (adına rağmen, kesin olarak ısı denklemini çözmüyorlar) ve amortize çıkarım ağları hep bu varyasyonel geleneğin içinde oturur. Bir makalede "ELBO" okuduğun her seferinde, soyağacı 1990'larda Hinton ve Neal üzerinden 1700'lerde Lagrange ve Euler'e uzanır.</div>

<h2 class="lesson-title">12. ML'e Köprü 2 &mdash; Fizik Bilgili Sinir Ağları (PINN)</h2>

<p class="l-text">Varyasyonel hesap ile derin öğrenme arasındaki ikinci, daha doğrudan çarpışma, Maziar Raissi, Paris Perdikaris ve George Em Karniadakis tarafından 2019'da tanıtılan <strong>fizik bilgili sinir ağıdır</strong>. Fikir küçümseyici derecede basit: bir sinir ağı $u_\\theta(x, t)$'yi bir PDE'nin çözümü için ansatz olarak al ve onu PDE'nin artığı <em>olan</em> bir kaybı minimize ederek eğit.</p>

<div class="calc-formula"><div class="formula-label">PINN KAYIP FONKSİYONELİ</div><div class="formula-main">$$\\mathcal{L}(\\theta) \\;=\\; \\frac{1}{N_r}\\sum_{i=1}^{N_r} \\bigl|\\, \\mathcal{N}\\!\\bigl[u_\\theta\\bigr](x_i, t_i) \\,\\bigr|^2 \\;+\\; \\frac{\\lambda_b}{N_b}\\sum_{j=1}^{N_b} \\bigl|\\, u_\\theta(x_j^b) - g(x_j^b) \\,\\bigr|^2$$</div><div class="formula-sub">Burada $\\mathcal{N}[u]$ PDE operatörüdür (ısı denklemi için $\\mathcal{N}[u] = u_t - \\alpha^2 u_{xx}$). Birinci terim iç bölgedeki $N_r$ rastgele kolokasyon noktasında PDE'yi zorlar; ikincisi sınır veya başlangıç değerlerini sabitler. $u_\\theta$'nın her iki kısmisi de ağ üzerinde otomatik türevleme ile hesaplanır.</div></div>

<p class="l-text">Varyasyonel tat yanlış anlaşılmazdır. Sürekli kayıp, $u$ PDE'yi çözdüğünde yok olan bir niceliğin alan üzerinden integrali $\\int |\\mathcal{N}[u]|^2\\, dx\\, dt$'dir. Onu minimize etmek bir varyasyonel problemdir ve bu varyasyonel problemin Euler-Lagrange denklemi &mdash; çarpanlar dışında &mdash; orijinal PDE'nin karesidir. Pratikte integral, kolokasyon noktaları üzerinde bir Monte Carlo toplamıyla değiştirilir; $\\theta$'da stokastik gradyan inişi gerisini halleder.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ağ gerekmiyor</div><div class="card-body">PINN'ler PDE artığını dağıtılmış kolokasyon noktalarında değerlendirir. Düzensiz geometriler için geleneksel FEM iş akışlarını hâkim kılan karmaşık ağ oluşturma basitçe kaybolur.</div></div>
<div class="calc-card"><div class="card-title">Ters problemler</div><div class="card-body">Eğer $\\mathcal{N}$'deki fiziksel parametreler bilinmiyorsa, seyrek ölçüm verisinden ağ ağırlıkları ile birlikte öğrenilebilirler. Bu, PINN'leri veri asimilasyonu ve parametre tahminine alışılmadık ölçüde uygun kılar.</div></div>
<div class="calc-card"><div class="card-title">Sert PDE'ler zor</div><div class="card-body">PINN'ler çok-ölçekli ve sert problemlerle zorlanırlar; kayıp manzaraları meşhur kötü koşulludur. Bu sorunları ele almak için tüm bir ağırlıklı varyantlar endüstrisi (NTK-tabanlı, nedensel, kendi-uyarlamalı) doğdu.</div></div>
<div class="calc-card"><div class="card-title">Gerçek başarılar</div><div class="card-body">Navier-Stokes, Schrödinger denklemi, gözenekli ortamda iki-fazlı akış, kırık yayılımı ve biyomedikal akışkan dinamiği için ileri ve ters problemler 2019'dan beri PINN tarzında yayımlandı.</div></div>
</div>

<div class="l-note"><strong>Varyasyonel akıl yürütmenin açıkça girdiği yer.</strong> Yakın bir akraba, <em>Derin Ritz Yöntemi</em> (E ve Yu, 2018), PDE artığı yerine Dirichlet enerjisi $E[u_\\theta]$'yı minimize eder. Bu, FEM'i doğuran Ritz-Galerkin yönteminin ruhuna daha da yakındır, polinom altuzayı yerine bir sinirsel ansatzla. Enerjiyi (Derin Ritz) ya da artığı (PINN) minimize ediyor olsan da, on dokuzuncu yüzyıl varyasyonel hesabını yirmi birinci yüzyıl fonksiyon sınıfıyla yapıyorsun.</div>

<h2 class="lesson-title">13. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Ne gözlemlemelisin.</strong> Bölüm A süreleri sıralamada düz çizgi &gt; optimize edilmiş &gt; sikloid olarak yazdırmalı, optimize edilmiş polilin ve analitik sikloid yüzdenin altında farklı olmalı. $N$ büyüdükçe ayrık sürenin analitik süreye oranı $1$'e yaklaşacak. Bölüm B her çözünürlükte düğüm FEM hatasının esasen sıfır olduğunu raporlamalı &mdash; doğrusal-eleman FEM bu özel problem için düğümlerde tam, alışılmadık ama öğretici bir özel durum.</p>

<div class="think-box"><div class="think-label">DENENECEK DENEYLER</div><div class="think-body">Brakistokron çözücüsünde $N$'i $200$'e itele: optimize edilmiş polilin analitik sikloide ne kadar yaklaşıyor? Uç noktayı $(2.0, 0.5)$'e değiştir &mdash; sikloid şimdi ilk sapağının ötesine uzanmak zorunda; çözücü onu hâlâ bulabilir mi? Bölüm B'de sabit yük $f = 1$'i $f(x) = \\sin(\\pi x)$ ile değiştir ve analitik cevap $u(x) = \\sin(\\pi x) / \\pi^2$ ile karşılaştır; FEM artık düğümlerde tam değil ama $h^2$ hızında yakınsar. Maksimum düğüm hatasını $1/N$'e karşı log-log ölçeğinde çiz ve eğimi oku.</div></div>

<div class="calc-highlight"><strong>Şimdi yapabileceklerin.</strong> Doğada bir varyasyonel problem tanıyabilir, Lagrangianını yazabilir, Euler-Lagrange denklemini türetebilir ve klasikleri çözebilirsin (jeodezik, brakistokron, katener, Hamilton ilkesi yoluyla serbest düşüş). Lineer bir PDE'yi zayıf formuna çevirebilir, bunun çözüm uzayını neden genişlettiğini açıklayabilir ve zayıf formu bir Dirichlet enerjisine bağlayabilirsin. Tek boyutlu bir FEM çözücüsünü sıfırdan ayağa kaldırabilirsin. Ve eşit derecede önemli olarak, ELBO'dan ya da fizik bilgili sinir ağlarından bahseden modern ML makalelerini okuyup altındaki aynı varyasyonel makinasını tanıyabilirsin. Üç yüzyıllık matematik, tutarlı tek bir hikaye &mdash; Bernoulli'nin boncuğundan Kingma'nın kodlayıcısına.</div>
`
};
