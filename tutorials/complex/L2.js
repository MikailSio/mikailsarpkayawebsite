window.COMPLEX_L2 = {

en: `<p class="l-text"><strong>In Lesson 1</strong> we built complex numbers from scratch: every <em>z = a + bi</em> is a single point in the 2D plane, with a length <em>|z|</em>, an angle <em>arg(z)</em>, and an algebra in which multiplication adds angles. Numbers, not functions. In this lesson we promote the complex number from <em>input</em> to <em>transformation</em>: we study <strong>complex functions</strong> — rules that send each complex number <em>z</em> to another complex number <em>f(z)</em>.</p>

<p class="l-text">The single most important shift in mindset is this: a complex function is no longer a graph you can draw on paper. It is a <em>map of the plane to itself</em>. Where a real function <em>f: ℝ → ℝ</em> bends a line into a curve, a complex function <em>f: ℂ → ℂ</em> bends the entire <em>plane</em> — it stretches, rotates, folds, wraps. To understand a complex function you have to learn to watch the plane move.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>See a complex function f: ℂ → ℂ as a geometric transformation of the plane</li>
<li>Read the action of z<sup>n</sup>, 1/z, e<sup>z</sup>, sin z, log z directly from a grid picture</li>
<li>Recognise Möbius maps and their role as the natural symmetries of the Riemann sphere</li>
<li>Compute and reason about i<sup>i</sup>, sin(i), log(−1) without flinching</li>
<li>State limits and continuity in ℂ and feel why "all directions at once" is restrictive</li>
<li>Build a domain-coloring visualiser in Python (NumPy + Plotly) and read zeros/poles from colours</li>
</ul>
</div>

<h2 class="l-title">1. From Numbers to Functions</h2>

<div class="l-highlight"><strong>Recap from L1.</strong> A complex number <em>z = a + bi</em> is a point with coordinates (<em>a, b</em>). It also has a length <em>|z| = √(a² + b²)</em> and an angle <em>arg(z) = atan2(b, a)</em>. Multiplication has the geometric meaning: lengths multiply, angles add.</div>

<p class="l-text">A <strong>complex function</strong> takes a complex number and returns a complex number:</p>

<div class="calc-formula"><div class="formula-label">A COMPLEX FUNCTION</div><div class="formula-main">$$f : \\mathbb{C} \\to \\mathbb{C}, \\qquad z \\mapsto w = f(z)$$</div><div class="formula-sub">Both input <em>z</em> and output <em>w</em> are complex numbers. So we are mapping the 2D plane to itself.</div></div>

<p class="l-text">Three small but crucial examples to fix vocabulary before any pictures:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">f(z) = z + (1 + i)</div><div class="card-body">A <em>translation</em>. Every point in the plane is pushed by the vector (1, 1). Shape, area, and angles are preserved.</div></div>
<div class="calc-card"><div class="card-title">f(z) = 2z</div><div class="card-body">A <em>scaling</em> by factor 2. Every length doubles; angles unchanged. A small disc becomes a larger disc.</div></div>
<div class="calc-card"><div class="card-title">f(z) = i·z</div><div class="card-body">A <em>rotation</em> by 90° counter-clockwise (because |i| = 1, arg(i) = π/2). Lengths preserved; orientation changed.</div></div>
</div>

<p class="l-text">We can always split a complex function into two real-valued functions of two real variables — the real and imaginary parts:</p>

<div class="calc-formula"><div class="formula-label">REAL & IMAGINARY PARTS</div><div class="formula-main">$$f(z) = u(x, y) + i\\,v(x, y), \\qquad z = x + iy$$</div><div class="formula-sub">u and v are ordinary real-valued functions on ℝ². The two real worlds and the one complex world are equivalent in raw data — but the complex viewpoint sees structure the real viewpoint cannot.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Take f(z) = z²:</strong><br><br>Write z = x + iy. Then<br>f(z) = (x + iy)² = x² − y² + 2xyi<br><br>So u(x, y) = x² − y² and v(x, y) = 2xy. Two perfectly innocent real functions. But together — as we shall see — they describe a rotation that doubles every angle.</div></div>

<div class="l-note"><strong>Reading guide.</strong> Throughout this lesson, "look at the plane" really means: pick a grid of points in the <em>z</em>-plane, apply f, and plot the resulting points in the <em>w</em>-plane. If you can mentally picture this transformation, you understand the function.</div>

<h2 class="l-title">2. Real-Variable Functions vs Complex Functions</h2>

<div class="calc-highlight"><strong>The visualisation problem.</strong> A real function <em>y = f(x)</em> needs only 2 axes: one for input, one for output. We draw the familiar graph. A complex function <em>w = f(z)</em> needs 2 axes for the input <em>z = (x, y)</em> and 2 more for the output <em>w = (u, v)</em>. That is <strong>four</strong> dimensions. We cannot draw 4D directly — so we invent tricks.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">REAL: f: ℝ → ℝ</div><div class="compare-item">• Input: 1 real number on the x-axis</div><div class="compare-item">• Output: 1 real number on the y-axis</div><div class="compare-item">• Picture: a 1D curve in the 2D plane</div><div class="compare-item">• Everything fits on the page</div></div><div class="compare-col"><div class="compare-title">COMPLEX: f: ℂ → ℂ</div><div class="compare-item">• Input: 2 real numbers (a point in the plane)</div><div class="compare-item">• Output: 2 real numbers (another point)</div><div class="compare-item">• Picture: would need 4D</div><div class="compare-item">• Must use indirect visualisation</div></div></div>

<p class="l-text">There are three standard ways to visualise a complex function. Each captures a different piece of the truth.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Grid transformation</div><div class="card-body">Draw a grid of horizontal and vertical lines in the z-plane. Plot the <em>images</em> of these lines under f in the w-plane. You see how the plane is bent, stretched, twisted.</div></div>
<div class="calc-card"><div class="card-title">Domain coloring</div><div class="card-body">At every input point z, paint a colour determined by f(z). Hue encodes the angle arg(f(z)); brightness encodes the magnitude |f(z)|. One picture, the whole function.</div></div>
<div class="calc-card"><div class="card-title">Contour plots</div><div class="card-body">Plot level sets of |f(z)| (modulus contours) and arg(f(z)) (phase contours). Useful for spotting zeros (where |f| = 0) and poles (where |f| → ∞).</div></div>
</div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Each visualisation throws away some information. The grid view shows shapes but obscures the bulk of the plane. Domain coloring shows everything but the colours take getting used to. Contour plots show level sets but hide direction. Working complex analysts switch between all three depending on the question.</div></div>

<h2 class="l-title">3. Polynomial Functions: f(z) = z<sup>n</sup></h2>

<p class="l-text">The simplest non-trivial complex functions are powers. They are the building blocks of every polynomial, and they show the most striking geometric behaviour. Write <em>z</em> in polar form:</p>

<div class="calc-formula"><div class="formula-label">POWER IN POLAR FORM</div><div class="formula-main">$$z = r\\,e^{i\\theta} \\;\\;\\Longrightarrow\\;\\; z^n = r^{n}\\,e^{i n \\theta}$$</div><div class="formula-sub">Length raised to the n-th power. Angle multiplied by n. Two completely independent geometric effects.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">|z<sup>n</sup>| = |z|<sup>n</sup></div><div class="card-body">The modulus is raised to the n-th power. If |z| = 1 the output stays on the unit circle. If |z| &gt; 1 it grows; if |z| &lt; 1 it shrinks toward 0.</div></div>
<div class="calc-card"><div class="card-title">arg(z<sup>n</sup>) = n·arg(z)</div><div class="card-body">Angles are multiplied by n. Squaring doubles every angle; cubing triples it. The function "wraps the plane around itself."</div></div>
<div class="calc-card"><div class="card-title">Image of a circle</div><div class="card-body">A circle |z| = r maps to a circle |w| = r<sup>n</sup>, but the new circle is traced n times as z goes once around. The map is n-to-1 (except at z = 0).</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — squaring</div><div class="example-body"><strong>z → z² on the upper half-plane:</strong><br><br>If z lies in the upper half-plane, arg(z) ∈ (0, π). Doubling: arg(z²) ∈ (0, 2π). The entire <em>upper half-plane</em> maps onto the <em>full plane minus the positive real axis</em>. A 180° wedge has been opened into a 360° wedge — the plane has been "unfolded."</div></div>

<p class="l-text">The geometric action becomes very vivid on a grid. Horizontal lines y = constant in the z-plane become parabolas in the w-plane. Vertical lines x = constant also become parabolas. The two families are perpendicular to each other in both the z- and w-planes — a hint of the "angle preservation" we will study fully in L6.</p>

<div id="plot-l2-zsq-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var traces=[];
var hcolors=["#3b82f6","#60a5fa","#93c5fd","#bfdbfe"];
var vcolors=["#f97316","#fb923c","#fdba74","#fed7aa"];
var hYs=[-1.5,-0.5,0.5,1.5];
for(var k=0;k<hYs.length;k++){
  var y0=hYs[k];var xs=[];var us=[];var vs=[];
  for(var i=-60;i<=60;i++){var x=i/20;xs.push(x);us.push(x*x-y0*y0);vs.push(2*x*y0);}
  traces.push({x:us,y:vs,mode:"lines",name:"image of y="+y0,line:{color:hcolors[k],width:2}});
}
var vXs=[-1.5,-0.5,0.5,1.5];
for(var k=0;k<vXs.length;k++){
  var x0=vXs[k];var ys=[];var us=[];var vs=[];
  for(var i=-60;i<=60;i++){var y=i/20;ys.push(y);us.push(x0*x0-y*y);vs.push(2*x0*y);}
  traces.push({x:us,y:vs,mode:"lines",name:"image of x="+x0,line:{color:vcolors[k],width:2,dash:"dash"}});
}
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Re(w)",range:[-4,4],scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Im(w)",range:[-4,4]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:10}}};
Plotly.newPlot("plot-l2-zsq-en",traces,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The image of a square grid under w = z². Solid lines are images of horizontal lines y = constant; dashed lines are images of vertical lines x = constant. Each family becomes a family of parabolas opening in opposite directions, and the two families cross at right angles — a foretaste of conformality. The origin z = 0 is the only "stuck" point (z² = z forces z = 0 or 1) and the only place where angle-doubling collapses an entire neighbourhood onto a single point.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">A circle of radius 2 centred at the origin maps onto a circle of radius 4 — but covered <em>twice</em>. If you walk once around the small circle, the image walks twice around the big one. This "wrapping number" is the key concept behind branch cuts and the Riemann surfaces we hint at in section 7.</div></div>

<h2 class="l-title">4. Möbius Transformations: f(z) = (az + b)/(cz + d)</h2>

<p class="l-text">Polynomials grow; <strong>Möbius transformations</strong> (also called linear fractional or homographic transformations) preserve structure. They are the most studied of all complex functions because they form a group, they act on the Riemann sphere, and they map "generalised circles" to "generalised circles."</p>

<div class="calc-formula"><div class="formula-label">MÖBIUS TRANSFORMATION</div><div class="formula-main">$$f(z) = \\frac{a z + b}{c z + d}, \\qquad ad - bc \\neq 0$$</div><div class="formula-sub">The non-degeneracy condition ad − bc ≠ 0 prevents the formula from collapsing to a constant. There are four complex parameters — three independent after rescaling — so a Möbius map is determined by where it sends three points.</div></div>

<p class="l-text">Every Möbius transformation can be decomposed into four elementary operations:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Translation z ↦ z + b</div><div class="card-body">Pushes the whole plane by the vector b. Shapes preserved.</div></div>
<div class="calc-card"><div class="card-title">Rotation/scaling z ↦ a·z</div><div class="card-body">Rotates by arg(a) and scales by |a|. Shapes scaled and rotated rigidly.</div></div>
<div class="calc-card"><div class="card-title">Inversion z ↦ 1/z</div><div class="card-body">Sends interior of unit circle to exterior and vice versa. The single most interesting move — it swaps "inside" with "outside."</div></div>
<div class="calc-card"><div class="card-title">Composition</div><div class="card-body">Any Möbius transformation is a sequence of translation, scaling/rotation, inversion, scaling/rotation, translation. Four building blocks suffice.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">THE CIRCLE-LINE THEOREM</div><div class="formula-main">$$\\text{Möbius maps send generalised circles to generalised circles.}$$</div><div class="formula-sub">A "generalised circle" is either a true circle or a straight line (a line is "a circle of infinite radius"). Möbius transformations permute this single family — they never produce parabolas or ellipses or anything more exotic.</div></div>

<p class="l-text">The most surprising Möbius map is the inversion <em>w = 1/z</em>. In polar form, z = re<sup>iθ</sup> ⇒ 1/z = (1/r)e<sup>−iθ</sup>. So inversion turns the modulus inside-out (r ↦ 1/r) and reflects the angle (θ ↦ −θ). Try a few specific shapes:</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — inversion of grid lines</div><div class="example-body"><strong>What does 1/z do to the vertical line Re(z) = 1?</strong><br><br>Write z = 1 + it. Then<br>1/z = 1/(1 + it) = (1 − it)/(1 + t²)<br>= 1/(1 + t²) − i·t/(1 + t²)<br><br>Set u = 1/(1+t²), v = −t/(1+t²). A quick check: u² + v² = 1/(1+t²) = u, so u² − u + v² = 0, that is (u − 1/2)² + v² = 1/4. The image is a <strong>circle</strong> of radius 1/2 centred at (1/2, 0) — passing through the origin and through (1, 0). A vertical line has become a circle.</div></div>

<div id="plot-l2-mob-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var traces=[];
var th=[];for(var i=0;i<=200;i++){th.push(i*2*Math.PI/200);}
var c1x=th.map(function(t){return Math.cos(t);});var c1y=th.map(function(t){return Math.sin(t);});
traces.push({x:c1x,y:c1y,mode:"lines",name:"unit circle |z|=1",line:{color:"#3b82f6",width:2.5}});
var imx=c1x.map(function(x,i){var z2=x*x+c1y[i]*c1y[i];return x/z2;});
var imy=c1y.map(function(y,i){var z2=c1x[i]*c1x[i]+y*y;return -y/z2;});
traces.push({x:imx,y:imy,mode:"lines",name:"image of |z|=1 (= itself)",line:{color:"#10b981",width:2.5,dash:"dash"}});
var lt=[];for(var i=-100;i<=100;i++){if(i!==0){lt.push(i/10);}}
var lx=lt.map(function(){return 1;});var ly=lt;
traces.push({x:lx,y:ly,mode:"lines",name:"line Re(z) = 1",line:{color:"#f97316",width:2}});
var ilx=lt.map(function(t){return 1/(1+t*t);});
var ily=lt.map(function(t){return -t/(1+t*t);});
traces.push({x:ilx,y:ily,mode:"lines",name:"image: circle radius 1/2",line:{color:"#a855f7",width:2,dash:"dash"}});
var inner=th.map(function(t){return 0.4*Math.cos(t);});var innery=th.map(function(t){return 0.4*Math.sin(t);});
traces.push({x:inner,y:innery,mode:"lines",name:"small circle |z|=0.4",line:{color:"#f59e0b",width:2}});
var bigx=inner.map(function(x,i){var r2=x*x+innery[i]*innery[i];return x/r2;});
var bigy=inner.map(function(y,i){var r2=inner[i]*inner[i]+y*y;return -y/r2;});
traces.push({x:bigx,y:bigy,mode:"lines",name:"image: big circle radius 2.5",line:{color:"#ef4444",width:2,dash:"dash"}});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Re",range:[-3,3],scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Im",range:[-3,3]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:10}}};
Plotly.newPlot("plot-l2-mob-en",traces,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The inversion w = 1/z in action. The blue unit circle is mapped to itself (every point z with |z|=1 satisfies |1/z|=1). The orange vertical line Re(z) = 1 becomes the purple circle of radius 1/2 — straight lines become circles when they do not pass through the origin. The small yellow circle of radius 0.4 (inside the unit circle) blows up into the large red circle of radius 2.5 — inversion pushes interior out and pulls exterior in.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Inversion exchanges 0 and ∞. The origin disappears into infinity; infinity is pulled back to 0. This is the cleanest reason to add a single "point at infinity" to ℂ and to work on the <strong>Riemann sphere</strong>. On the sphere, inversion is just a rigid rotation that flips top and bottom — no singularity anywhere.</div></div>

<h2 class="l-title">5. The Exponential Function e<sup>z</sup></h2>

<p class="l-text">The complex exponential is defined by separating the real and imaginary parts of the exponent:</p>

<div class="calc-formula"><div class="formula-label">COMPLEX EXPONENTIAL</div><div class="formula-main">$$e^{z} = e^{x + i y} = e^{x}\\bigl(\\cos y + i\\sin y\\bigr)$$</div><div class="formula-sub">Modulus |e<sup>z</sup>| = e<sup>x</sup> depends only on the real part. Argument arg(e<sup>z</sup>) = y depends only on the imaginary part. The two coordinates of z play completely separate roles.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Modulus depends on x</div><div class="card-body">|e<sup>z</sup>| = e<sup>Re(z)</sup>. Vertical lines x = constant map to circles of radius e<sup>x</sup>. As x → −∞ the circle shrinks to 0; as x → +∞ it explodes.</div></div>
<div class="calc-card"><div class="card-title">Argument depends on y</div><div class="card-body">arg(e<sup>z</sup>) = Im(z). Horizontal lines y = constant map to rays through the origin at angle y.</div></div>
<div class="calc-card"><div class="card-title">Period 2πi</div><div class="card-body">e<sup>z + 2πi</sup> = e<sup>z</sup>. The exponential is periodic in the imaginary direction with period 2π. Two complex numbers differing by 2πi have the same exponential — a fact that will hand us multi-valuedness when we invert.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — horizontal strip to wedge</div><div class="example-body"><strong>The strip 0 ≤ y &lt; 2π maps onto the punctured plane:</strong><br><br>As (x, y) sweeps over the strip, e<sup>z</sup> sweeps over every nonzero complex number exactly once. The strip is a <em>fundamental domain</em> of e<sup>z</sup>: knowing the function on one strip tells you everything by 2πi-periodicity.<br><br>Narrower strip 0 ≤ y ≤ π/2 → image is the first quadrant Re(w) &gt; 0, Im(w) &gt; 0. The exponential opens a thin strip into a 90° wedge.</div></div>

<div id="plot-l2-exp-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var traces=[];
var hYs=[0,Math.PI/6,Math.PI/3,Math.PI/2,2*Math.PI/3,5*Math.PI/6,Math.PI];
var cols=["#3b82f6","#60a5fa","#34d399","#10b981","#f59e0b","#f97316","#ef4444"];
for(var k=0;k<hYs.length;k++){
  var y0=hYs[k];var us=[];var vs=[];
  for(var i=-30;i<=15;i++){var x=i/10;var r=Math.exp(x);us.push(r*Math.cos(y0));vs.push(r*Math.sin(y0));}
  traces.push({x:us,y:vs,mode:"lines",name:"y="+(Math.round(y0*100)/100),line:{color:cols[k],width:2}});
}
var vXs=[-2,-1,0,1];
var vcols=["#bfdbfe","#93c5fd","#60a5fa","#3b82f6"];
for(var k=0;k<vXs.length;k++){
  var x0=vXs[k];var r=Math.exp(x0);var us=[];var vs=[];
  for(var i=0;i<=120;i++){var th=i*Math.PI/120;us.push(r*Math.cos(th));vs.push(r*Math.sin(th));}
  traces.push({x:us,y:vs,mode:"lines",name:"x="+x0+" (r="+(Math.round(r*100)/100)+")",line:{color:vcols[k],width:2,dash:"dot"}});
}
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Re(w)",range:[-3.5,3.5],scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Im(w)",range:[-0.5,3.5]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:10}}};
Plotly.newPlot("plot-l2-exp-en",traces,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The image under w = e<sup>z</sup> of the strip 0 ≤ y ≤ π. Solid coloured lines are images of horizontal lines y = constant — each becomes a ray through the origin at angle y. Dashed lines are images of vertical lines x = constant — each becomes a semicircle of radius e<sup>x</sup>. Together the rays and circles form polar coordinates: e<sup>z</sup> turns rectangular coordinates into polar coordinates.</div></div>

<h2 class="l-title">6. Trigonometric Functions of a Complex Variable</h2>

<p class="l-text">Once we have the complex exponential, sine and cosine extend to ℂ via Euler-style formulas. Recall e<sup>iθ</sup> = cos θ + i sin θ. Solving for cos and sin:</p>

<div class="calc-formula"><div class="formula-label">COMPLEX SIN AND COS</div><div class="formula-main">$$\\cos z = \\frac{e^{i z} + e^{-i z}}{2}, \\qquad \\sin z = \\frac{e^{i z} - e^{-i z}}{2 i}$$</div><div class="formula-sub">For real z these reduce to the ordinary trig functions. For complex z they extend cleanly — and break a property you thought was sacred: boundedness.</div></div>

<p class="l-text">Why are these definitions natural? Because (a) they agree with the real sine and cosine when z is real, and (b) they preserve every algebraic identity — sin² + cos² = 1, double-angle formulas, addition formulas — they all continue to hold. The complex trig functions are the unique extensions consistent with the algebra.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — cosine grows on the imaginary axis</div><div class="example-body"><strong>Compute cos(i):</strong><br><br>cos(i) = (e<sup>i·i</sup> + e<sup>−i·i</sup>) / 2 = (e<sup>−1</sup> + e<sup>1</sup>) / 2 = cosh(1) ≈ <strong>1.5431</strong><br><br>So cos(i) is real and greater than 1! The familiar bound |cos x| ≤ 1 is false for complex inputs.<br><br><strong>And sin(i):</strong><br>sin(i) = (e<sup>i·i</sup> − e<sup>−i·i</sup>) / (2i) = (e<sup>−1</sup> − e<sup>1</sup>) / (2i) = i·sinh(1) ≈ <strong>1.1752 i</strong><br><br>Pure imaginary. The complex sine grows exponentially along the imaginary axis.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Real axis behaviour</div><div class="card-body">For real z, cos z and sin z are bounded by 1. The familiar real-analysis intuition holds inside this 1D slice.</div></div>
<div class="calc-card"><div class="card-title">Imaginary axis behaviour</div><div class="card-body">cos(iy) = cosh(y), sin(iy) = i·sinh(y). Both grow exponentially. The complex trig functions are <em>not</em> bounded.</div></div>
<div class="calc-card"><div class="card-title">Real part formula</div><div class="card-body">cos(x + iy) = cos(x)cosh(y) − i·sin(x)sinh(y). The familiar oscillation in x is multiplied by an exponential envelope in y.</div></div>
</div>

<div class="l-highlight"><strong>A subtle lesson.</strong> Many "facts" about real-variable functions are accidents of being restricted to the real line. Boundedness of sin and cos, the law that real polynomials need not have real roots, the failure of e<sup>x</sup> to be periodic — all of these dissolve when we step into ℂ. The complex viewpoint is more honest: it shows the function in its natural habitat.</div>

<h2 class="l-title">7. The Complex Logarithm</h2>

<p class="l-text">If e<sup>z</sup> is the most well-behaved complex function, log z is the most mischievous. Recall that e<sup>z</sup> is <em>periodic</em> with period 2πi:</p>

<div class="calc-formula"><div class="formula-label">EXPONENTIAL IS PERIODIC</div><div class="formula-main">$$e^{z + 2\\pi i k} = e^{z} \\qquad \\text{for every integer } k$$</div><div class="formula-sub">Many different z values share a single e<sup>z</sup>. So when we try to invert the exponential and define a logarithm, the inverse is multi-valued.</div></div>

<p class="l-text">For any nonzero w = re<sup>iθ</sup>, the equation e<sup>z</sup> = w has infinitely many solutions:</p>

<div class="calc-formula"><div class="formula-label">COMPLEX LOGARITHM (MULTI-VALUED)</div><div class="formula-main">$$\\log w = \\ln r + i(\\theta + 2\\pi k), \\qquad k \\in \\mathbb{Z}$$</div><div class="formula-sub">Infinitely many values, all differing by integer multiples of 2πi. The natural log of the modulus is the real part; the (multi-valued) argument is the imaginary part.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Principal branch Log w</div><div class="card-body">To recover a single-valued function we agree on a convention: take θ in the half-open interval (−π, π]. The result is written with a capital L: Log w = ln|w| + i·Arg(w). It is the "default" logarithm.</div></div>
<div class="calc-card"><div class="card-title">Branch cut</div><div class="card-body">With θ ∈ (−π, π], the function Log is discontinuous across the negative real axis — values just above the cut have argument ≈ +π, values just below ≈ −π. The cut is a man-made wound where we sliced the function to make it single-valued.</div></div>
<div class="calc-card"><div class="card-title">Other branches</div><div class="card-body">Other choices of interval, e.g. (0, 2π), give different "branches" of the logarithm. None is intrinsically better — only conventional.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute Log(−1):</strong><br><br>−1 = 1·e<sup>iπ</sup>, so |−1| = 1, Arg(−1) = π. Therefore<br>Log(−1) = ln 1 + iπ = <strong>iπ</strong><br><br>Plug back in: e<sup>iπ</sup> = cos π + i sin π = −1 ✓<br><br><strong>Log(i):</strong> i = 1·e<sup>iπ/2</sup>, so Log(i) = <strong>iπ/2</strong>.<br><br><strong>Log(1 + i):</strong> 1 + i = √2 · e<sup>iπ/4</sup>, so Log(1 + i) = (1/2)ln 2 + iπ/4.</div></div>

<div id="plot-l2-log-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var traces=[];
var th=[];for(var i=0;i<=400;i++){th.push(-Math.PI+i*2*Math.PI/400);}
var arg=th;var pcols=["#3b82f6","#10b981","#f97316","#ef4444","#a855f7"];
var ks=[-2,-1,0,1,2];
for(var j=0;j<ks.length;j++){
  var k=ks[j];var ys=th.map(function(t){return t+2*Math.PI*k;});
  traces.push({x:th,y:ys,mode:"lines",name:"branch k="+k,line:{color:pcols[j],width:2.5}});
}
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"arg(z)  (principal value, in (-π, π])",tickvals:[-Math.PI,-Math.PI/2,0,Math.PI/2,Math.PI],ticktext:["-π","-π/2","0","π/2","π"]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Im(log z) = arg(z) + 2πk"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l2-log-en",traces,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The imaginary part of log(z) plotted against arg(z), one curve per branch. Branch k = 0 (blue) is the principal value Log; it lives in (−π, π]. Other branches are vertical translations by 2πk. All branches give a perfectly valid log — only convention picks k = 0 as "the" logarithm. The vertical jumps at the endpoints reveal the branch cut on the negative real axis.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">The "multi-valued log" is not a defect — it is the honest answer to "what z satisfies e<sup>z</sup> = w?" Pretending there is only one is a useful lie. The honest cure (rather than a branch cut) is to glue infinitely many copies of the plane together along the cut — the result is the <em>Riemann surface</em> of the logarithm, a spiral staircase on which log becomes single-valued.</div></div>

<h2 class="l-title">8. Complex Powers: z<sup>w</sup> for Complex w</h2>

<p class="l-text">Combining the exponential and the logarithm gives us a recipe for raising any complex number to any complex power:</p>

<div class="calc-formula"><div class="formula-label">DEFINITION OF z<sup>w</sup></div><div class="formula-main">$$z^{w} = e^{w \\cdot \\log z}, \\qquad z \\neq 0$$</div><div class="formula-sub">Because log is multi-valued, so in general is z<sup>w</sup>. If w is an integer the multi-valuedness cancels; if w is rational p/q there are q distinct values; if w is irrational or complex there are infinitely many.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — i to the i</div><div class="example-body"><strong>Compute i<sup>i</sup>:</strong><br><br>Step 1: log(i). We have i = e<sup>iπ/2</sup>, so log(i) = iπ/2 + 2πki (k integer). Take principal value: Log(i) = iπ/2.<br><br>Step 2: i<sup>i</sup> = e<sup>i · log(i)</sup> = e<sup>i · iπ/2</sup> = e<sup>−π/2</sup><br><br>Numerically: e<sup>−π/2</sup> ≈ <strong>0.2079</strong>.<br><br>A wholly imaginary number raised to a wholly imaginary power gives a real number, smaller than 1. This is one of the most surprising identities in mathematics.<br><br><strong>The other values</strong> (using other branches) are e<sup>−π/2 − 2πk</sup> for any integer k — all real, each a factor of e<sup>−2π</sup> ≈ 0.00187 apart.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Integer powers</div><div class="card-body">z<sup>n</sup> for n ∈ ℤ is single-valued because the multi-valuedness of log multiplied by an integer is again a multiple of 2πi, and e<sup>2πi</sup> = 1.</div></div>
<div class="calc-card"><div class="card-title">Rational powers</div><div class="card-body">z<sup>p/q</sup> has exactly q distinct values — the classical q-th roots. For instance, z<sup>1/2</sup> has two values, ±√z.</div></div>
<div class="calc-card"><div class="card-title">General complex powers</div><div class="card-body">Infinitely many values in general. We almost always use the principal branch unless context forces a different choice.</div></div>
</div>

<div class="l-note"><strong>Why this matters.</strong> In signal processing and quantum mechanics, complex exponentials are everywhere — they describe oscillation, rotation, and probability amplitudes. The identity e<sup>iπ</sup> = −1 and the formula e<sup>iθ</sup> = cos θ + i sin θ are exactly the tools L1 promised: deep, clean, and impossible to develop without complex numbers.</div>

<h2 class="l-title">9. Limits and Continuity in ℂ</h2>

<p class="l-text">Definitions of limits and continuity in ℂ look almost identical to the real-variable case — but the geometry behind them is radically different.</p>

<div class="calc-formula"><div class="formula-label">LIMIT IN ℂ (ε-δ DEFINITION)</div><div class="formula-main">$$\\lim_{z \\to z_0} f(z) = L \\iff \\forall \\varepsilon > 0\\ \\exists \\delta > 0:\\ 0 < |z - z_0| < \\delta \\implies |f(z) - L| < \\varepsilon$$</div><div class="formula-sub">Word-for-word the same as the real case — only the absolute value now denotes the modulus of a complex number (the Euclidean distance in the plane).</div></div>

<div class="calc-formula"><div class="formula-label">CONTINUITY AT z<sub>0</sub></div><div class="formula-main">$$f \\text{ continuous at } z_0 \\iff \\lim_{z \\to z_0} f(z) = f(z_0)$$</div><div class="formula-sub">Same definition. If the limit exists and equals the function value at z<sub>0</sub>, f is continuous there.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">2D approach</div><div class="card-body">In ℝ, "z approaches z<sub>0</sub>" allows only two directions: from the left or from the right. In ℂ, z can approach z<sub>0</sub> from <em>any direction</em> in the plane — and along any curved path.</div></div>
<div class="calc-card"><div class="card-title">All-paths agreement</div><div class="card-body">For the limit to exist, f(z) must approach the same value L no matter which path z takes. This is a much stronger requirement.</div></div>
<div class="calc-card"><div class="card-title">Continuous, but useful?</div><div class="card-body">Polynomials, rational functions (away from poles), e<sup>z</sup>, sin z, cos z, Log z (off its branch cut) — all continuous everywhere they are defined. Continuity itself is generous; the next step (differentiability) is where the real surprises start.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — direction matters</div><div class="example-body"><strong>Consider g(z) = Re(z)/|z| for z ≠ 0:</strong><br><br>If z = x + 0i approaches 0 along the positive real axis (x → 0⁺): g(z) = x/x = 1.<br>If z = 0 + yi approaches 0 along the positive imaginary axis (y → 0⁺): g(z) = 0/y = 0.<br>If z = te<sup>iπ/4</sup> approaches 0 along the diagonal: g(z) = (t·cos(π/4))/t = cos(π/4) ≈ 0.707.<br><br>Different paths give different limit values. <strong>The limit does not exist.</strong> g is not continuous at 0 — and there is no way to define g(0) that fixes it.</div></div>

<h2 class="l-title">10. Why "Direction-Independent" Limits Matter</h2>

<div class="calc-highlight"><strong>Looking ahead.</strong> Lesson 3 will define the <em>complex derivative</em> with exactly the same limit formula you have seen in real calculus. But because the limit in ℂ must agree along every path, the existence of a complex derivative is far more restrictive than the existence of a real derivative. The few functions that survive — called <strong>holomorphic</strong> or <strong>analytic</strong> — turn out to be the protagonists of every following lesson.</div>

<p class="l-text">A real function only needs the two one-sided limits at each point to agree. A complex function needs the limit along <em>every</em> ray, every spiral, every approach path to agree. This is a vastly stronger constraint. Most functions that are "continuous in two real variables" fail it.</p>

<div class="calc-formula"><div class="formula-label">COMPLEX DERIVATIVE (PREVIEW)</div><div class="formula-main">$$f'(z_0) = \\lim_{h \\to 0} \\frac{f(z_0 + h) - f(z_0)}{h}, \\qquad h \\in \\mathbb{C}$$</div><div class="formula-sub">h is a complex increment — it can approach 0 from any direction in the plane. For f'(z<sub>0</sub>) to exist, the same value L must emerge no matter which direction h takes.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Real case</div><div class="card-body">In ℝ we need agreement from 2 sides (left and right). Almost any reasonable formula has a derivative almost everywhere.</div></div>
<div class="calc-card"><div class="card-title">Complex case</div><div class="card-body">In ℂ we need agreement from infinitely many directions. The functions that survive are exactly the holomorphic ones — and they have astonishing structural properties (infinitely differentiable, equal to their own Taylor series, etc.).</div></div>
<div class="calc-card"><div class="card-title">Cauchy-Riemann</div><div class="card-body">The agreement constraint can be written as two PDEs linking u and v — the Cauchy-Riemann equations. They are the topic of L3.</div></div>
</div>

<div class="l-warn"><strong>Counter-example that motivates everything.</strong> Take f(z) = z̄ (complex conjugation: x + iy ↦ x − iy). It is continuous, smooth as a function of (x, y), and yet has no complex derivative at any point. The reason: approaching z<sub>0</sub> along the real direction gives [f(z<sub>0</sub>+h)−f(z<sub>0</sub>)]/h = 1; approaching along the imaginary direction gives −1. Different limit per direction ⇒ no complex derivative. This single example separates "real-smooth" from "complex-differentiable." L3 will make the distinction precise.</div>

<h2 class="l-title">11. Domain Coloring Visualisation</h2>

<p class="l-text">For complex functions whose images cannot fit on a flat page, the most informative single picture is the <strong>domain coloring</strong>. The recipe:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Cover the input plane with a dense grid of points</div><div class="step-detail">Each point z = x + iy receives a colour determined by the value f(z) at that input.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Hue (colour wheel) encodes arg(f(z))</div><div class="step-detail">Red for arg = 0, yellow for π/3, green for 2π/3, cyan for π, blue for −2π/3, magenta for −π/3, and back to red. The full colour wheel ↔ one full turn of the argument.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Brightness encodes |f(z)|</div><div class="step-detail">Dark for small magnitudes; bright for large. Often the brightness is rescaled with log|f(z)| so that both zeros (|f| → 0) and poles (|f| → ∞) are visible.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Read the colour patterns</div><div class="step-detail">A point where all colours meet (the colour wheel spinning around it) is a <em>zero</em> or a <em>pole</em>. The number of "spokes" tells you the multiplicity.</div></div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Zeros</div><div class="card-body">Points where f(z) = 0 appear as dark points around which the colour wheel rotates in the positive direction.</div></div>
<div class="calc-card"><div class="card-title">Poles</div><div class="card-body">Points where |f(z)| → ∞ appear as bright points around which the colour wheel rotates in the <em>opposite</em> direction.</div></div>
<div class="calc-card"><div class="card-title">Multiplicity</div><div class="card-body">A zero of order n is a point around which the colour wheel cycles n times as you walk around once. Visible at a glance.</div></div>
</div>

<div id="plot-l2-dc-sin-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=120;var R=5;var xs=[];var ys=[];var hues=[];
for(var i=0;i<N;i++){xs.push(-R+2*R*i/(N-1));}
for(var j=0;j<N;j++){ys.push(-R+2*R*j/(N-1));}
for(var j=0;j<N;j++){
  var row=[];
  for(var i=0;i<N;i++){
    var x=xs[i];var y=ys[j];
    var sr=Math.sin(x)*Math.cosh(y);
    var si=Math.cos(x)*Math.sinh(y);
    var arg=Math.atan2(si,sr);
    var deg=(arg*180/Math.PI+360)%360;
    row.push(deg);
  }
  hues.push(row);
}
var colorscale=[];for(var k=0;k<=12;k++){var t=k/12;var deg=t*360;colorscale.push([t,"hsl("+deg+",70%,50%)"]);}
var trace={z:hues,x:xs,y:ys,type:"heatmap",colorscale:colorscale,zmin:0,zmax:360,showscale:false,hoverinfo:"skip"};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Re(z)",scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Im(z)"},margin:{t:50,r:30,b:50,l:50},showlegend:false};
Plotly.newPlot("plot-l2-dc-sin-en",[trace],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Domain coloring of f(z) = sin z over the square −5 ≤ Re(z), Im(z) ≤ 5. Colour = arg(sin z). On the real axis you can see zeros at z = 0, ±π — points where all colours meet. Away from the real axis the colour stripes go nearly horizontal because sin z is dominated by ±i·sinh(y), which has argument close to ±π/2.</div></div>

<div id="plot-l2-dc-pole-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=140;var R=2.5;var xs=[];var ys=[];var hues=[];
for(var i=0;i<N;i++){xs.push(-R+2*R*i/(N-1));}
for(var j=0;j<N;j++){ys.push(-R+2*R*j/(N-1));}
for(var j=0;j<N;j++){
  var row=[];
  for(var i=0;i<N;i++){
    var x=xs[i];var y=ys[j];
    var ar=x*x-y*y+1;var ai=2*x*y;
    var den=ar*ar+ai*ai;
    if(den<1e-12){row.push(0);continue;}
    var fr=ar/den;var fi=-ai/den;
    var arg=Math.atan2(fi,fr);
    var deg=(arg*180/Math.PI+360)%360;
    row.push(deg);
  }
  hues.push(row);
}
var colorscale=[];for(var k=0;k<=12;k++){var t=k/12;var deg=t*360;colorscale.push([t,"hsl("+deg+",70%,50%)"]);}
var trace={z:hues,x:xs,y:ys,type:"heatmap",colorscale:colorscale,zmin:0,zmax:360,showscale:false,hoverinfo:"skip"};
var markers={x:[0,0],y:[1,-1],mode:"markers+text",marker:{size:12,color:"#ffffff",line:{color:"#000",width:2}},text:["+i","-i"],textposition:"top right",textfont:{color:"#ffffff",size:13},showlegend:false};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Re(z)",scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Im(z)"},margin:{t:50,r:30,b:50,l:50},showlegend:false};
Plotly.newPlot("plot-l2-dc-pole-en",[trace,markers],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Domain coloring of f(z) = 1/(z² + 1) over −2.5 ≤ Re(z), Im(z) ≤ 2.5. The function has two poles at z = ±i (marked with white dots): the colour wheel cycles around each in the <em>reverse</em> direction (red → magenta → blue → cyan → green → yellow → red), the visual signature of a pole. There are no zeros in this picture — the function does not vanish anywhere.</div></div>

<h2 class="l-title">12. Practical Exercise: Build Your Own Visualiser</h2>

<p class="l-text">Time to put everything together in code. We will write a small Python script that (a) takes a complex function f, (b) plots the image of a grid under f, and (c) generates a domain colouring. Use Python's built-in <code>complex</code> type — NumPy supports it directly, so almost no extra plumbing is required.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON · GRID TRANSFORMATION UNDER f(z)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

<span class="cm"># 1. Define your complex function. Try z**2, 1/z, np.sin, np.exp, ...</span>
<span class="kw">def</span> <span class="fn">f</span>(z):
    <span class="kw">return</span> z**<span class="num">2</span>

<span class="cm"># 2. Build a rectangular grid in the z-plane.</span>
N = <span class="num">21</span>
xs = np.linspace(-<span class="num">2</span>, <span class="num">2</span>, N)
ys = np.linspace(-<span class="num">2</span>, <span class="num">2</span>, N)

fig, ax = plt.subplots(<span class="num">1</span>, <span class="num">2</span>, figsize=(<span class="num">10</span>, <span class="num">5</span>))

<span class="cm"># Left panel: the source grid in the z-plane</span>
<span class="kw">for</span> y0 <span class="kw">in</span> ys:
    line = np.linspace(-<span class="num">2</span>, <span class="num">2</span>, <span class="num">200</span>) + <span class="num">1j</span>*y0
    ax[<span class="num">0</span>].plot(line.real, line.imag, color=<span class="str">"#3b82f6"</span>, lw=<span class="num">0.6</span>)
<span class="kw">for</span> x0 <span class="kw">in</span> xs:
    line = x0 + <span class="num">1j</span>*np.linspace(-<span class="num">2</span>, <span class="num">2</span>, <span class="num">200</span>)
    ax[<span class="num">0</span>].plot(line.real, line.imag, color=<span class="str">"#f97316"</span>, lw=<span class="num">0.6</span>)
ax[<span class="num">0</span>].set_title(<span class="str">"z-plane (source grid)"</span>); ax[<span class="num">0</span>].set_aspect(<span class="str">"equal"</span>)

<span class="cm"># Right panel: the image grid in the w-plane</span>
<span class="kw">for</span> y0 <span class="kw">in</span> ys:
    line = np.linspace(-<span class="num">2</span>, <span class="num">2</span>, <span class="num">200</span>) + <span class="num">1j</span>*y0
    w = <span class="fn">f</span>(line)
    ax[<span class="num">1</span>].plot(w.real, w.imag, color=<span class="str">"#3b82f6"</span>, lw=<span class="num">0.6</span>)
<span class="kw">for</span> x0 <span class="kw">in</span> xs:
    line = x0 + <span class="num">1j</span>*np.linspace(-<span class="num">2</span>, <span class="num">2</span>, <span class="num">200</span>)
    w = <span class="fn">f</span>(line)
    ax[<span class="num">1</span>].plot(w.real, w.imag, color=<span class="str">"#f97316"</span>, lw=<span class="num">0.6</span>)
ax[<span class="num">1</span>].set_title(<span class="str">"w-plane (image)"</span>); ax[<span class="num">1</span>].set_aspect(<span class="str">"equal"</span>)
plt.tight_layout(); plt.show()
</code></pre></div>

<p class="l-text">Try replacing <code>f</code> by <code>lambda z: 1/z</code>, <code>np.sin</code>, <code>np.exp</code>, or <code>lambda z: (z - 1)/(z + 1)</code> (a Möbius map). Each one paints a completely different transformation onto the right-hand panel — and watching the grid morph is the fastest way to develop complex-function intuition.</p>

<p class="l-text">For domain colouring we use a 2D colour image where hue encodes the argument and lightness encodes the (log) magnitude. NumPy's vectorised arithmetic over complex grids makes this almost trivial:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON · DOMAIN COLORING</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">from</span> matplotlib.colors <span class="kw">import</span> hsv_to_rgb

<span class="kw">def</span> <span class="fn">domain_coloring</span>(f, R=<span class="num">2.5</span>, N=<span class="num">600</span>):
    <span class="cm">"""Plot a domain-coloured image of f over [-R, R] x [-R, R]."""</span>
    x = np.linspace(-R, R, N)
    y = np.linspace(-R, R, N)
    X, Y = np.meshgrid(x, y)
    Z = X + <span class="num">1j</span>*Y
    W = <span class="fn">f</span>(Z)

    H = (np.angle(W) + np.pi) / (<span class="num">2</span>*np.pi)        <span class="cm"># hue in [0,1]</span>
    M = np.<span class="fn">abs</span>(W)
    L = <span class="num">0.5</span> + <span class="num">0.5</span>*np.tanh(np.log(M + <span class="num">1e-12</span>) / <span class="num">3</span>)  <span class="cm"># lightness via log|f|</span>
    S = np.ones_like(H) * <span class="num">0.85</span>                       <span class="cm"># saturation</span>

    <span class="cm"># Convert HSV -> RGB. Lightness encodes brightness via V.</span>
    HSV = np.stack([H, S, L], axis=-<span class="num">1</span>)
    RGB = <span class="fn">hsv_to_rgb</span>(HSV)

    plt.figure(figsize=(<span class="num">6</span>, <span class="num">6</span>))
    plt.imshow(RGB, extent=[-R, R, -R, R], origin=<span class="str">"lower"</span>)
    plt.xlabel(<span class="str">"Re(z)"</span>); plt.ylabel(<span class="str">"Im(z)"</span>)
    plt.title(<span class="str">f"domain colouring of f"</span>)
    plt.tight_layout(); plt.show()

<span class="cm"># Examples — try them one at a time</span>
<span class="fn">domain_coloring</span>(<span class="kw">lambda</span> z: z**<span class="num">2</span>)              <span class="cm"># zero of order 2 at origin</span>
<span class="fn">domain_coloring</span>(<span class="kw">lambda</span> z: <span class="num">1</span>/z)              <span class="cm"># pole of order 1 at origin</span>
<span class="fn">domain_coloring</span>(np.sin)                       <span class="cm"># zeros at z = k·π on real axis</span>
<span class="fn">domain_coloring</span>(<span class="kw">lambda</span> z: (z - <span class="num">1</span>)*(z + <span class="num">1</span>)/(z**<span class="num">2</span> + <span class="num">1</span>))  <span class="cm"># 2 zeros, 2 poles</span>
</code></pre></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">After running the last example, count the "colour spokes" around each zero and each pole. Each zero shows a single full colour cycle (order 1). The two poles at ±i each show a reverse single cycle. The integer "winding number" of the colour wheel around a point <em>is</em> the order of the zero or pole. We will turn this visual fact into a theorem (the argument principle) in L4.</div></div>

<div class="l-note"><strong>What's next.</strong> In Lesson 3 we promote continuity to differentiability and meet the <strong>Cauchy-Riemann equations</strong>. We will then discover that a complex-differentiable function is automatically infinitely differentiable, equal to its Taylor series, and uniquely determined by its values on any small open set — astonishing rigidity properties that have no real-variable analogue.</div>

<h2 class="l-title">13. Summary</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Complex function</div><div class="card-body">A rule f: ℂ → ℂ. Equivalently, two real-valued functions u(x, y) and v(x, y) packaged into one.</div><div class="card-formula">f(z) = u + i·v</div></div>
<div class="calc-card"><div class="card-title">z<sup>n</sup></div><div class="card-body">Modulus to the n-th power; angle multiplied by n. Wraps the plane around itself n times.</div><div class="card-formula">z<sup>n</sup> = r<sup>n</sup>·e<sup>inθ</sup></div></div>
<div class="calc-card"><div class="card-title">Möbius transformation</div><div class="card-body">Sends generalised circles to generalised circles. Built from translation, rotation/scaling, and inversion 1/z.</div><div class="card-formula">f(z) = (az+b)/(cz+d)</div></div>
<div class="calc-card"><div class="card-title">e<sup>z</sup></div><div class="card-body">Periodic with period 2πi. Maps horizontal strips to wedges. Modulus controlled by Re(z), argument by Im(z).</div><div class="card-formula">e<sup>x+iy</sup> = e<sup>x</sup>(cos y + i·sin y)</div></div>
<div class="calc-card"><div class="card-title">sin z, cos z</div><div class="card-body">Defined via exponentials. Bounded only on the real axis; grow exponentially along the imaginary axis.</div><div class="card-formula">cos(i) = cosh(1) ≈ 1.54</div></div>
<div class="calc-card"><div class="card-title">log z</div><div class="card-body">Multi-valued. Principal branch Log z = ln|z| + i·Arg(z) with Arg ∈ (−π, π]. Branch cut on negative real axis.</div><div class="card-formula">log z = ln|z| + i(arg z + 2πk)</div></div>
<div class="calc-card"><div class="card-title">z<sup>w</sup></div><div class="card-body">Defined as e<sup>w·log z</sup>. Generally multi-valued. i<sup>i</sup> = e<sup>−π/2</sup> ≈ 0.208 (real!).</div><div class="card-formula">z<sup>w</sup> = e<sup>w·log z</sup></div></div>
<div class="calc-card"><div class="card-title">Limit & continuity</div><div class="card-body">Definitions identical to real case — but z can approach z<sub>0</sub> from any direction in 2D. Much stronger.</div><div class="card-formula">lim<sub>z→z₀</sub> f(z) = L</div></div>
<div class="calc-card"><div class="card-title">Direction-independence</div><div class="card-body">Sets the stage for the complex derivative. Whatever survives this constraint is called <em>holomorphic</em>.</div><div class="card-formula">f'(z₀) exists ⇒ same h-direction</div></div>
<div class="calc-card"><div class="card-title">Domain colouring</div><div class="card-body">Visualise a complex function with hue = arg(f), brightness = |f|. Zeros and poles appear as colour-wheel vortices.</div><div class="card-formula">hue ↔ arg, brightness ↔ |f|</div></div>
</div>

<div class="l-highlight"><strong>One sentence to keep.</strong> A complex function is not a graph; it is a <em>transformation of the plane</em>. To understand it, learn to watch the plane move.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Ders 1'de</strong> karmaşık sayıları sıfırdan kurduk: her <em>z = a + bi</em>, 2 boyutlu düzlemde tek bir noktadır; <em>|z|</em> uzunluğu, <em>arg(z)</em> açısı ve çarpmanın açıları topladığı bir cebire sahiptir. Sayılardı, fonksiyon değil. Bu derste karmaşık sayıyı <em>girdiden dönüşüme</em> yükseltiyoruz: <strong>karmaşık fonksiyonları</strong> inceliyoruz — her karmaşık <em>z</em>'yi başka bir karmaşık <em>f(z)</em>'ye gönderen kuralları.</p>

<p class="l-text">Zihinsel olarak en önemli kayma şudur: karmaşık fonksiyon artık kağıda çizilebilen bir grafik değildir. <em>Düzlemin kendisine bir haritalanışıdır</em>. Reel bir fonksiyon <em>f: ℝ → ℝ</em> bir doğruyu eğriye büker; karmaşık bir fonksiyon <em>f: ℂ → ℂ</em> ise tüm <em>düzlemi</em> büker — gerer, döndürür, katlar, sarar. Karmaşık fonksiyonu anlamak için düzlemin nasıl hareket ettiğini izlemeyi öğrenmek gerekir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir f: ℂ → ℂ karmaşık fonksiyonunu düzlemin geometrik dönüşümü olarak görmeyi</li>
<li>z<sup>n</sup>, 1/z, e<sup>z</sup>, sin z, log z fonksiyonlarının etkisini ızgara resminden okumayı</li>
<li>Möbius dönüşümlerini ve bunların Riemann küresinin doğal simetrileri olarak rolünü tanımayı</li>
<li>i<sup>i</sup>, sin(i), log(−1) gibi ifadeleri tereddüt etmeden hesaplamayı</li>
<li>ℂ'de limit ve süreklilik tanımlarını ifade etmeyi ve "her yönden yaklaşma"nın neden kısıtlayıcı olduğunu hissetmeyi</li>
<li>Python (NumPy + Plotly) ile bir domain coloring görselleştiricisi yazıp sıfır/kutupları renklerden okumayı</li>
</ul>
</div>

<h2 class="l-title">1. Sayılardan Fonksiyonlara</h2>

<div class="l-highlight"><strong>L1 tekrarı.</strong> Karmaşık sayı <em>z = a + bi</em>, (<em>a, b</em>) koordinatlı bir noktadır. Aynı zamanda <em>|z| = √(a² + b²)</em> uzunluğuna ve <em>arg(z) = atan2(b, a)</em> açısına sahiptir. Çarpmanın geometrik anlamı: uzunluklar çarpılır, açılar toplanır.</div>

<p class="l-text">Bir <strong>karmaşık fonksiyon</strong>, karmaşık bir sayı alır ve karmaşık bir sayı döndürür:</p>

<div class="calc-formula"><div class="formula-label">KARMAŞIK FONKSİYON</div><div class="formula-main">$$f : \\mathbb{C} \\to \\mathbb{C}, \\qquad z \\mapsto w = f(z)$$</div><div class="formula-sub">Hem girdi <em>z</em> hem de çıktı <em>w</em> karmaşık sayı. Yani 2B düzlemi kendine eşliyoruz.</div></div>

<p class="l-text">Resimlere geçmeden önce kelime hazinesini sabitlemek için üç küçük ama önemli örnek:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">f(z) = z + (1 + i)</div><div class="card-body">Bir <em>öteleme</em>. Düzlemdeki her nokta (1, 1) vektörü kadar itilir. Şekil, alan ve açılar korunur.</div></div>
<div class="calc-card"><div class="card-title">f(z) = 2z</div><div class="card-body">2 katı <em>ölçekleme</em>. Her uzunluk ikiye katlanır; açılar değişmez. Küçük bir disk daha büyük bir diske dönüşür.</div></div>
<div class="calc-card"><div class="card-title">f(z) = i·z</div><div class="card-body">Saat yönünün tersine 90° <em>dönme</em> (çünkü |i| = 1, arg(i) = π/2). Uzunluklar korunur; yön değişir.</div></div>
</div>

<p class="l-text">Bir karmaşık fonksiyonu daima iki gerçel değerli iki değişkenli fonksiyon olarak — reel ve sanal kısımlar olarak — ayrıştırabiliriz:</p>

<div class="calc-formula"><div class="formula-label">REEL VE SANAL KISIMLAR</div><div class="formula-main">$$f(z) = u(x, y) + i\\,v(x, y), \\qquad z = x + iy$$</div><div class="formula-sub">u ve v, ℝ² üzerinde sıradan reel-değerli fonksiyonlardır. İki reel dünya ile bir karmaşık dünya ham veri olarak eşdeğerdir — ancak karmaşık bakış açısı reel bakışın göremediği yapıyı görür.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>f(z) = z² için:</strong><br><br>z = x + iy yazalım. O zaman<br>f(z) = (x + iy)² = x² − y² + 2xyi<br><br>Yani u(x, y) = x² − y² ve v(x, y) = 2xy. Tamamen masum iki reel fonksiyon. Ama birlikte — birazdan göreceğimiz gibi — her açıyı iki katına çıkaran bir dönüşümü tarif ederler.</div></div>

<div class="l-note"><strong>Okuma rehberi.</strong> Bu ders boyunca "düzleme bak" demek aslında şudur: <em>z</em>-düzleminde bir nokta ızgarası seç, f uygula, çıkan noktaları <em>w</em>-düzleminde çiz. Bu dönüşümü zihninde canlandırabiliyorsan fonksiyonu anlamışsındır.</div>

<h2 class="l-title">2. Reel Değişkenli Fonksiyonlar ile Karmaşık Fonksiyonlar</h2>

<div class="calc-highlight"><strong>Görselleştirme sorunu.</strong> Reel bir fonksiyon <em>y = f(x)</em> sadece 2 eksene ihtiyaç duyar: biri girdi, biri çıktı. Tanıdık grafiği çizeriz. Karmaşık bir fonksiyon <em>w = f(z)</em> ise <em>z = (x, y)</em> girdisi için 2 eksen ve <em>w = (u, v)</em> çıktısı için 2 eksen daha — toplam <strong>dört</strong> boyut. 4B'yi doğrudan çizemeyiz, bu yüzden hilelere başvururuz.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">REEL: f: ℝ → ℝ</div><div class="compare-item">• Girdi: x-ekseninde 1 reel sayı</div><div class="compare-item">• Çıktı: y-ekseninde 1 reel sayı</div><div class="compare-item">• Resim: 2B düzlemde 1B eğri</div><div class="compare-item">• Her şey sayfaya sığar</div></div><div class="compare-col"><div class="compare-title">KARMAŞIK: f: ℂ → ℂ</div><div class="compare-item">• Girdi: 2 reel sayı (düzlemdeki bir nokta)</div><div class="compare-item">• Çıktı: 2 reel sayı (başka bir nokta)</div><div class="compare-item">• Resim: 4B gerekir</div><div class="compare-item">• Dolaylı görselleştirme şart</div></div></div>

<p class="l-text">Karmaşık fonksiyonu görselleştirmenin üç standart yolu vardır. Her biri gerçeğin farklı bir parçasını yakalar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Izgara dönüşümü</div><div class="card-body">z-düzleminde yatay ve düşey doğrulardan oluşan bir ızgara çiz. Bu doğruların f altındaki <em>görüntülerini</em> w-düzleminde çiz. Düzlemin nasıl büküldüğünü, gerildiğini, döndüğünü görürsün.</div></div>
<div class="calc-card"><div class="card-title">Domain coloring</div><div class="card-body">Her girdi noktası z'ye f(z) tarafından belirlenen bir renk boya. Renk tonu (hue) arg(f(z)) açısını, parlaklık |f(z)| büyüklüğünü kodlar. Tek resim, tüm fonksiyon.</div></div>
<div class="calc-card"><div class="card-title">Düzey eğrileri</div><div class="card-body">|f(z)| (modül) ve arg(f(z)) (faz) düzey kümelerini çiz. Sıfırları (|f| = 0) ve kutupları (|f| → ∞) tespit etmek için kullanışlı.</div></div>
</div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">Her görselleştirme bir bilgiyi feda eder. Izgara görünümü şekilleri gösterir ama düzlemin geri kalanını saklar. Domain coloring her şeyi gösterir ama renklere alışmak zaman alır. Düzey eğrileri düzey kümelerini gösterir ama yönü gizler. Çalışan karmaşık analistler soruya göre üçü arasında geçiş yapar.</div></div>

<h2 class="l-title">3. Polinom Fonksiyonları: f(z) = z<sup>n</sup></h2>

<p class="l-text">Aşikar olmayan en basit karmaşık fonksiyonlar kuvvetlerdir. Her polinomun yapı taşları olmaları bir yana, en çarpıcı geometrik davranışı sergilerler. <em>z</em>'yi kutupsal formda yaz:</p>

<div class="calc-formula"><div class="formula-label">KUTUPSAL FORMDA KUVVET</div><div class="formula-main">$$z = r\\,e^{i\\theta} \\;\\;\\Longrightarrow\\;\\; z^n = r^{n}\\,e^{i n \\theta}$$</div><div class="formula-sub">Uzunluk n. kuvvete yükselir. Açı n ile çarpılır. Birbirinden tamamen bağımsız iki geometrik etki.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">|z<sup>n</sup>| = |z|<sup>n</sup></div><div class="card-body">Modül n. kuvvete yükselir. |z| = 1 ise çıktı birim çember üzerinde kalır. |z| &gt; 1 ise büyür; |z| &lt; 1 ise 0'a doğru küçülür.</div></div>
<div class="calc-card"><div class="card-title">arg(z<sup>n</sup>) = n·arg(z)</div><div class="card-body">Açılar n ile çarpılır. Karesi alma açıyı iki katına çıkarır; küpü alma üç katına. Fonksiyon "düzlemi kendi üzerine sarar."</div></div>
<div class="calc-card"><div class="card-title">Çemberin görüntüsü</div><div class="card-body">|z| = r çemberi |w| = r<sup>n</sup> çemberine eşlenir, fakat yeni çember z bir kez dönerken n kez taranır. Eşleme n-e-1'dir (z = 0 hariç).</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK — kare alma</div><div class="example-body"><strong>z → z² ile üst yarı düzlem:</strong><br><br>z üst yarı düzlemde ise arg(z) ∈ (0, π). İkiye katlayalım: arg(z²) ∈ (0, 2π). Tüm <em>üst yarı düzlem</em>, <em>pozitif reel ekseni dışlanmış tüm düzleme</em> eşlenir. 180°'lik bir dilim 360°'lik dilime açılmıştır — düzlem "katlamadan açılmıştır."</div></div>

<p class="l-text">Geometrik etki bir ızgara üzerinde çok canlı olur. z-düzlemindeki yatay y = sabit doğruları w-düzleminde paraboller olur. Düşey x = sabit doğruları da paraboller olur. İki aile hem z- hem w-düzleminde birbirine diktir — L6'da tam olarak inceleyeceğimiz "açı korunumu"nun bir habercisi.</p>

<div id="plot-l2-zsq-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var traces=[];
var hcolors=["#3b82f6","#60a5fa","#93c5fd","#bfdbfe"];
var vcolors=["#f97316","#fb923c","#fdba74","#fed7aa"];
var hYs=[-1.5,-0.5,0.5,1.5];
for(var k=0;k<hYs.length;k++){
  var y0=hYs[k];var xs=[];var us=[];var vs=[];
  for(var i=-60;i<=60;i++){var x=i/20;xs.push(x);us.push(x*x-y0*y0);vs.push(2*x*y0);}
  traces.push({x:us,y:vs,mode:"lines",name:"y="+y0+" görüntüsü",line:{color:hcolors[k],width:2}});
}
var vXs=[-1.5,-0.5,0.5,1.5];
for(var k=0;k<vXs.length;k++){
  var x0=vXs[k];var ys=[];var us=[];var vs=[];
  for(var i=-60;i<=60;i++){var y=i/20;ys.push(y);us.push(x0*x0-y*y);vs.push(2*x0*y);}
  traces.push({x:us,y:vs,mode:"lines",name:"x="+x0+" görüntüsü",line:{color:vcolors[k],width:2,dash:"dash"}});
}
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Re(w)",range:[-4,4],scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Im(w)",range:[-4,4]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:10}}};
Plotly.newPlot("plot-l2-zsq-tr",traces,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı:</strong> w = z² altında bir kare ızgaranın görüntüsü. Sürekli renkli çizgiler yatay y = sabit doğrularının görüntüleri; kesik çizgiler düşey x = sabit doğrularının görüntüleri. Her aile zıt yönlere açılan parabollere dönüşür ve iki aile birbirini dik açıyla keser — konformallığın bir ön habercisi. Tek "kalıcı" nokta z = 0'dır (z² = z ⇒ z = 0 veya 1) ve açıyı katlama oradaki tüm komşuluğu tek noktaya çöktürür.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">Orijinde merkezli 2 yarıçaplı bir çember, 4 yarıçaplı bir çembere eşlenir — ama <em>iki kez</em> kaplanır. Küçük çemberde bir tur atarsan görüntü büyükte iki tur atar. Bu "sarım sayısı", 7. bölümde ima edilen dal kesikleri ve Riemann yüzeyleri için anahtar kavramdır.</div></div>

<h2 class="l-title">4. Möbius Dönüşümleri: f(z) = (az + b)/(cz + d)</h2>

<p class="l-text">Polinomlar büyür; <strong>Möbius dönüşümleri</strong> (lineer kesirli ya da homografik dönüşümler) yapıyı korur. Bir grup oluşturmaları, Riemann küresi üzerinde etki etmeleri ve "genelleştirilmiş çemberleri" "genelleştirilmiş çemberlere" eşlemeleri nedeniyle tüm karmaşık fonksiyonlar arasında en çok çalışılanlardır.</p>

<div class="calc-formula"><div class="formula-label">MÖBIUS DÖNÜŞÜMÜ</div><div class="formula-main">$$f(z) = \\frac{a z + b}{c z + d}, \\qquad ad - bc \\neq 0$$</div><div class="formula-sub">ad − bc ≠ 0 koşulu formülün sabite çökmesini engeller. Dört karmaşık parametre vardır — yeniden ölçekleme sonrası üçü bağımsız — yani bir Möbius dönüşümü üç noktanın nereye gönderileceği ile belirlenir.</div></div>

<p class="l-text">Her Möbius dönüşümü dört temel işleme ayrıştırılabilir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Öteleme z ↦ z + b</div><div class="card-body">Tüm düzlemi b vektörüyle iter. Şekiller korunur.</div></div>
<div class="calc-card"><div class="card-title">Dönme/ölçekleme z ↦ a·z</div><div class="card-body">arg(a) kadar döner, |a| kadar ölçekler. Şekiller rijit olarak ölçeklenir ve döner.</div></div>
<div class="calc-card"><div class="card-title">Tersleme z ↦ 1/z</div><div class="card-body">Birim çemberin içini dışına, dışını içine gönderir. En ilginç hareket — "içi" "dışıyla" değiştirir.</div></div>
<div class="calc-card"><div class="card-title">Kompozisyon</div><div class="card-body">Her Möbius dönüşümü öteleme, ölçekleme/dönme, tersleme, ölçekleme/dönme, öteleme dizisidir. Dört yapı taşı yeterli.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">ÇEMBER-DOĞRU TEOREMİ</div><div class="formula-main">$$\\text{Möbius dönüşümleri genelleştirilmiş çemberleri genelleştirilmiş çemberlere gönderir.}$$</div><div class="formula-sub">"Genelleştirilmiş çember" ya gerçek bir çemberdir ya da doğrudur (doğru, "sonsuz yarıçaplı bir çember"dir). Möbius dönüşümleri bu tek aileyi permüte eder — asla parabol, elips veya başka egzotik bir şey üretmez.</div></div>

<p class="l-text">En şaşırtıcı Möbius haritası <em>w = 1/z</em> terslemesidir. Kutupsal formda z = re<sup>iθ</sup> ⇒ 1/z = (1/r)e<sup>−iθ</sup>. Yani tersleme modülü içe çevirir (r ↦ 1/r) ve açıyı yansıtır (θ ↦ −θ). Birkaç şekille deneyelim:</p>

<div class="calc-example"><div class="example-label">ÖRNEK — ızgara doğrularının terslenmesi</div><div class="example-body"><strong>1/z, Re(z) = 1 düşey doğrusuna ne yapar?</strong><br><br>z = 1 + it yaz. O zaman<br>1/z = 1/(1 + it) = (1 − it)/(1 + t²)<br>= 1/(1 + t²) − i·t/(1 + t²)<br><br>u = 1/(1+t²), v = −t/(1+t²) koy. Hızlı kontrol: u² + v² = 1/(1+t²) = u, yani u² − u + v² = 0, yani (u − 1/2)² + v² = 1/4. Görüntü, (1/2, 0)'da merkezli 1/2 yarıçaplı <strong>çemberdir</strong> — orijinden ve (1, 0)'dan geçer. Düşey doğru çembere dönüşmüştür.</div></div>

<div id="plot-l2-mob-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var traces=[];
var th=[];for(var i=0;i<=200;i++){th.push(i*2*Math.PI/200);}
var c1x=th.map(function(t){return Math.cos(t);});var c1y=th.map(function(t){return Math.sin(t);});
traces.push({x:c1x,y:c1y,mode:"lines",name:"birim çember |z|=1",line:{color:"#3b82f6",width:2.5}});
var imx=c1x.map(function(x,i){var z2=x*x+c1y[i]*c1y[i];return x/z2;});
var imy=c1y.map(function(y,i){var z2=c1x[i]*c1x[i]+y*y;return -y/z2;});
traces.push({x:imx,y:imy,mode:"lines",name:"|z|=1 görüntüsü (kendisi)",line:{color:"#10b981",width:2.5,dash:"dash"}});
var lt=[];for(var i=-100;i<=100;i++){if(i!==0){lt.push(i/10);}}
var lx=lt.map(function(){return 1;});var ly=lt;
traces.push({x:lx,y:ly,mode:"lines",name:"doğru Re(z) = 1",line:{color:"#f97316",width:2}});
var ilx=lt.map(function(t){return 1/(1+t*t);});
var ily=lt.map(function(t){return -t/(1+t*t);});
traces.push({x:ilx,y:ily,mode:"lines",name:"görüntü: 1/2 yarıçaplı çember",line:{color:"#a855f7",width:2,dash:"dash"}});
var inner=th.map(function(t){return 0.4*Math.cos(t);});var innery=th.map(function(t){return 0.4*Math.sin(t);});
traces.push({x:inner,y:innery,mode:"lines",name:"küçük çember |z|=0.4",line:{color:"#f59e0b",width:2}});
var bigx=inner.map(function(x,i){var r2=x*x+innery[i]*innery[i];return x/r2;});
var bigy=inner.map(function(y,i){var r2=inner[i]*inner[i]+y*y;return -y/r2;});
traces.push({x:bigx,y:bigy,mode:"lines",name:"görüntü: 2.5 yarıçaplı büyük çember",line:{color:"#ef4444",width:2,dash:"dash"}});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Re",range:[-3,3],scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Im",range:[-3,3]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:10}}};
Plotly.newPlot("plot-l2-mob-tr",traces,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı:</strong> w = 1/z terslemesinin etkisi. Mavi birim çember kendine eşlenir (|z|=1 olan her z için |1/z|=1). Turuncu düşey doğru Re(z) = 1, mor 1/2 yarıçaplı çembere dönüşür — orijinden geçmeyen düz doğrular çembere dönüşür. İçteki küçük sarı 0.4 yarıçaplı çember, büyük kırmızı 2.5 yarıçaplı çembere açılır — tersleme içi dışarı iter, dışı içeri çeker.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">Tersleme 0 ile ∞'u değiştirir. Orijin sonsuza kaybolur; sonsuz 0'a çekilir. Bu, ℂ'ye tek bir "sonsuzdaki nokta" eklemenin ve <strong>Riemann küresi</strong> üzerinde çalışmanın en temiz nedenidir. Kürede tersleme, üst ve altı değiştiren rijit bir dönmedir — hiçbir noktada tekillik yoktur.</div></div>

<h2 class="l-title">5. Üstel Fonksiyon e<sup>z</sup></h2>

<p class="l-text">Karmaşık üstel, üssün reel ve sanal kısımları ayrıştırılarak tanımlanır:</p>

<div class="calc-formula"><div class="formula-label">KARMAŞIK ÜSTEL</div><div class="formula-main">$$e^{z} = e^{x + i y} = e^{x}\\bigl(\\cos y + i\\sin y\\bigr)$$</div><div class="formula-sub">Modül |e<sup>z</sup>| = e<sup>x</sup> yalnızca reel kısma bağlı. Argüman arg(e<sup>z</sup>) = y yalnızca sanal kısma bağlı. z'nin iki koordinatı tamamen ayrı rollerde.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Modül x'e bağlı</div><div class="card-body">|e<sup>z</sup>| = e<sup>Re(z)</sup>. Düşey x = sabit doğruları e<sup>x</sup> yarıçaplı çemberlere eşlenir. x → −∞'da çember 0'a küçülür; x → +∞'da patlar.</div></div>
<div class="calc-card"><div class="card-title">Argüman y'ye bağlı</div><div class="card-body">arg(e<sup>z</sup>) = Im(z). Yatay y = sabit doğruları orijinden y açılı ışınlara eşlenir.</div></div>
<div class="calc-card"><div class="card-title">2πi periyot</div><div class="card-body">e<sup>z + 2πi</sup> = e<sup>z</sup>. Üstel, sanal yönde 2π periyotludur. 2πi farkıyla iki karmaşık sayı aynı üstele sahiptir — bu olgu tersini aldığımızda çok değerliliği armağan edecek.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK — yatay şerit dilime dönüşür</div><div class="example-body"><strong>0 ≤ y &lt; 2π şeridi delinmiş düzleme eşlenir:</strong><br><br>(x, y) bu şerit boyunca dolanırken, e<sup>z</sup> sıfırdan farklı her karmaşık sayıyı tam bir kez tarar. Şerit, e<sup>z</sup>'nin bir <em>temel alanıdır</em>: fonksiyonu bir şeritte bilmek, 2πi-periyotluluk sayesinde her şeyi bilmek demektir.<br><br>Daha dar şerit 0 ≤ y ≤ π/2 → görüntü, Re(w) &gt; 0, Im(w) &gt; 0 birinci bölgedir. Üstel, ince bir şeridi 90° dilime açar.</div></div>

<div id="plot-l2-exp-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var traces=[];
var hYs=[0,Math.PI/6,Math.PI/3,Math.PI/2,2*Math.PI/3,5*Math.PI/6,Math.PI];
var cols=["#3b82f6","#60a5fa","#34d399","#10b981","#f59e0b","#f97316","#ef4444"];
for(var k=0;k<hYs.length;k++){
  var y0=hYs[k];var us=[];var vs=[];
  for(var i=-30;i<=15;i++){var x=i/10;var r=Math.exp(x);us.push(r*Math.cos(y0));vs.push(r*Math.sin(y0));}
  traces.push({x:us,y:vs,mode:"lines",name:"y="+(Math.round(y0*100)/100),line:{color:cols[k],width:2}});
}
var vXs=[-2,-1,0,1];
var vcols=["#bfdbfe","#93c5fd","#60a5fa","#3b82f6"];
for(var k=0;k<vXs.length;k++){
  var x0=vXs[k];var r=Math.exp(x0);var us=[];var vs=[];
  for(var i=0;i<=120;i++){var th=i*Math.PI/120;us.push(r*Math.cos(th));vs.push(r*Math.sin(th));}
  traces.push({x:us,y:vs,mode:"lines",name:"x="+x0+" (r="+(Math.round(r*100)/100)+")",line:{color:vcols[k],width:2,dash:"dot"}});
}
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Re(w)",range:[-3.5,3.5],scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Im(w)",range:[-0.5,3.5]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:10}}};
Plotly.newPlot("plot-l2-exp-tr",traces,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı:</strong> w = e<sup>z</sup> altında 0 ≤ y ≤ π şeridinin görüntüsü. Sürekli renkli çizgiler yatay y = sabit doğrularının görüntüleri — her biri orijinden y açılı bir ışına dönüşür. Kesik çizgiler düşey x = sabit doğrularının görüntüleri — her biri e<sup>x</sup> yarıçaplı bir yarım çembere dönüşür. Birlikte ışınlar ve çemberler kutupsal koordinatları oluşturur: e<sup>z</sup>, dikdörtgen koordinatları kutupsal koordinatlara çevirir.</div></div>

<h2 class="l-title">6. Karmaşık Değişkenli Trigonometrik Fonksiyonlar</h2>

<p class="l-text">Karmaşık üstel elimizde olduğunda sin ve cos, Euler-tarzı formüller ile ℂ'ye uzanır. e<sup>iθ</sup> = cos θ + i sin θ olduğunu hatırla. cos ve sin için çöz:</p>

<div class="calc-formula"><div class="formula-label">KARMAŞIK SİN VE COS</div><div class="formula-main">$$\\cos z = \\frac{e^{i z} + e^{-i z}}{2}, \\qquad \\sin z = \\frac{e^{i z} - e^{-i z}}{2 i}$$</div><div class="formula-sub">Reel z için bunlar sıradan trigonometrik fonksiyonlara indirgenir. Karmaşık z için temiz şekilde uzanırlar — ve kutsal saydığın bir özelliği kırarlar: sınırlılık.</div></div>

<p class="l-text">Bu tanımlar neden doğal? Çünkü (a) z reel iken sıradan sin ve cos ile çakışırlar, (b) her cebirsel özdeşliği korurlar — sin² + cos² = 1, iki kat açı formülleri, toplama formülleri — hepsi geçerliliğini sürdürür. Karmaşık trig fonksiyonları, cebirle uyumlu tek genişletmelerdir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — kosinüs sanal eksende büyür</div><div class="example-body"><strong>cos(i) hesapla:</strong><br><br>cos(i) = (e<sup>i·i</sup> + e<sup>−i·i</sup>) / 2 = (e<sup>−1</sup> + e<sup>1</sup>) / 2 = cosh(1) ≈ <strong>1.5431</strong><br><br>Yani cos(i) reeldir ve 1'den büyüktür! Tanıdık |cos x| ≤ 1 sınırı karmaşık girdiler için yanlıştır.<br><br><strong>Ve sin(i):</strong><br>sin(i) = (e<sup>i·i</sup> − e<sup>−i·i</sup>) / (2i) = (e<sup>−1</sup> − e<sup>1</sup>) / (2i) = i·sinh(1) ≈ <strong>1.1752 i</strong><br><br>Saf sanal. Karmaşık sinüs sanal eksen boyunca üstel hızla büyür.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reel eksen davranışı</div><div class="card-body">Reel z için cos z ve sin z, 1 ile sınırlıdır. Tanıdık reel-analiz sezgisi bu 1B dilim içinde geçerlidir.</div></div>
<div class="calc-card"><div class="card-title">Sanal eksen davranışı</div><div class="card-body">cos(iy) = cosh(y), sin(iy) = i·sinh(y). İkisi de üstel hızla büyür. Karmaşık trig fonksiyonları <em>sınırlı değildir</em>.</div></div>
<div class="calc-card"><div class="card-title">Reel kısım formülü</div><div class="card-body">cos(x + iy) = cos(x)cosh(y) − i·sin(x)sinh(y). x'teki tanıdık salınım, y'deki üstel zarfla çarpılır.</div></div>
</div>

<div class="l-highlight"><strong>İnce bir ders.</strong> Reel değişkenli fonksiyonlar hakkındaki pek çok "olgu", aslında reel doğruya hapsedilmiş olmanın kazasıdır. sin ve cos'un sınırlılığı, reel polinomların reel kökleri olması gerekmediği kuralı, e<sup>x</sup>'in periyodik olmaması — hepsi ℂ'ye adım atınca çözülür. Karmaşık bakış daha dürüsttür: fonksiyonu doğal yaşam alanında gösterir.</div>

<h2 class="l-title">7. Karmaşık Logaritma</h2>

<p class="l-text">e<sup>z</sup> en uslu karmaşık fonksiyonsa, log z en yaramazıdır. e<sup>z</sup>'nin 2πi periyotlu <em>periyodik</em> olduğunu hatırla:</p>

<div class="calc-formula"><div class="formula-label">ÜSTEL PERİYODİKTİR</div><div class="formula-main">$$e^{z + 2\\pi i k} = e^{z} \\qquad \\text{her tam sayı } k \\text{ için}$$</div><div class="formula-sub">Birçok farklı z değeri aynı e<sup>z</sup>'yi paylaşır. Üstelin tersini almaya ve logaritmayı tanımlamaya çalıştığımızda, ters çok değerli olur.</div></div>

<p class="l-text">Sıfırdan farklı her w = re<sup>iθ</sup> için, e<sup>z</sup> = w denkleminin sonsuz çözümü vardır:</p>

<div class="calc-formula"><div class="formula-label">KARMAŞIK LOGARİTMA (ÇOK DEĞERLİ)</div><div class="formula-main">$$\\log w = \\ln r + i(\\theta + 2\\pi k), \\qquad k \\in \\mathbb{Z}$$</div><div class="formula-sub">Sonsuz değer, hepsi 2πi'nin tam sayı katları kadar farklı. Modülün doğal logu reel kısım; (çok değerli) argüman sanal kısım.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Asal dal Log w</div><div class="card-body">Tek değerli bir fonksiyon elde etmek için bir gelenek belirleriz: θ'yı (−π, π] yarı açık aralığında al. Sonuç büyük L ile yazılır: Log w = ln|w| + i·Arg(w). "Varsayılan" logaritmadır.</div></div>
<div class="calc-card"><div class="card-title">Dal kesiği</div><div class="card-body">θ ∈ (−π, π] ile Log, negatif reel eksen üzerinde süreksizdir — kesiğin biraz üstündeki değerlerin argümanı ≈ +π, biraz altındakilerin ≈ −π'dir. Kesik, fonksiyonu tek değerli yapmak için açtığımız yapay bir yaradır.</div></div>
<div class="calc-card"><div class="card-title">Diğer dallar</div><div class="card-body">Aralığın başka seçimleri, örneğin (0, 2π), farklı "dallar" verir. Hiçbiri özünde diğerinden iyi değil — sadece gelenek.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>Log(−1) hesapla:</strong><br><br>−1 = 1·e<sup>iπ</sup>, yani |−1| = 1, Arg(−1) = π. Dolayısıyla<br>Log(−1) = ln 1 + iπ = <strong>iπ</strong><br><br>Geri yerleştir: e<sup>iπ</sup> = cos π + i sin π = −1 ✓<br><br><strong>Log(i):</strong> i = 1·e<sup>iπ/2</sup>, yani Log(i) = <strong>iπ/2</strong>.<br><br><strong>Log(1 + i):</strong> 1 + i = √2 · e<sup>iπ/4</sup>, yani Log(1 + i) = (1/2)ln 2 + iπ/4.</div></div>

<div id="plot-l2-log-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var traces=[];
var th=[];for(var i=0;i<=400;i++){th.push(-Math.PI+i*2*Math.PI/400);}
var pcols=["#3b82f6","#10b981","#f97316","#ef4444","#a855f7"];
var ks=[-2,-1,0,1,2];
for(var j=0;j<ks.length;j++){
  var k=ks[j];var ys=th.map(function(t){return t+2*Math.PI*k;});
  traces.push({x:th,y:ys,mode:"lines",name:"dal k="+k,line:{color:pcols[j],width:2.5}});
}
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"arg(z)  (asal değer, (-π, π])",tickvals:[-Math.PI,-Math.PI/2,0,Math.PI/2,Math.PI],ticktext:["-π","-π/2","0","π/2","π"]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Im(log z) = arg(z) + 2πk"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l2-log-tr",traces,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı:</strong> log(z)'nin sanal kısmı arg(z)'ye karşı çizilmiş, her dal için bir eğri. k = 0 dalı (mavi) asal değer Log'dur; (−π, π] içinde yaşar. Diğer dallar 2πk kadar düşey ötelemelerdir. Tüm dallar geçerli bir log verir — yalnızca gelenek k = 0'ı "asıl" logaritma seçer. Uç noktalardaki düşey sıçramalar negatif reel eksenin dal kesiğini açığa çıkarır.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">"Çok değerli log" bir kusur değil — "e<sup>z</sup> = w'yi hangi z sağlar?" sorusunun dürüst cevabıdır. Tek bir cevap olduğunu varsaymak yararlı bir yalandır. Dürüst çözüm (dal kesiği yerine) sonsuz sayıda düzlem kopyasını kesik boyunca birleştirmektir — sonuç logaritmanın <em>Riemann yüzeyidir</em>; üzerinde log tek değerli hale gelen sarmal bir merdiven.</div></div>

<h2 class="l-title">8. Karmaşık Kuvvetler: Karmaşık w İçin z<sup>w</sup></h2>

<p class="l-text">Üstel ve logaritmayı birleştirmek bize herhangi bir karmaşık sayıyı herhangi bir karmaşık kuvvete yükseltme tarifi verir:</p>

<div class="calc-formula"><div class="formula-label">z<sup>w</sup> TANIMI</div><div class="formula-main">$$z^{w} = e^{w \\cdot \\log z}, \\qquad z \\neq 0$$</div><div class="formula-sub">log çok değerli olduğundan, genelde z<sup>w</sup> de çok değerlidir. w bir tam sayıysa çok değerlilik iptal olur; w bir p/q rasyoneliyse tam q farklı değer vardır; w irrasyonel veya karmaşıksa sonsuz değer vardır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — i üzeri i</div><div class="example-body"><strong>i<sup>i</sup> hesapla:</strong><br><br>1. Adım: log(i). i = e<sup>iπ/2</sup>, yani log(i) = iπ/2 + 2πki (k tam sayı). Asal değer al: Log(i) = iπ/2.<br><br>2. Adım: i<sup>i</sup> = e<sup>i · log(i)</sup> = e<sup>i · iπ/2</sup> = e<sup>−π/2</sup><br><br>Sayısal olarak: e<sup>−π/2</sup> ≈ <strong>0.2079</strong>.<br><br>Tamamen sanal bir sayının tamamen sanal kuvveti, 1'den küçük gerçel bir sayı verir. Matematikteki en şaşırtıcı özdeşliklerden biri.<br><br><strong>Diğer değerler</strong> (başka dallar kullanılarak) e<sup>−π/2 − 2πk</sup>'dır (k tam sayı) — hepsi reel, her biri diğerinden e<sup>−2π</sup> ≈ 0.00187 faktörü uzaklıkta.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tam sayı kuvvetleri</div><div class="card-body">n ∈ ℤ için z<sup>n</sup> tek değerlidir, çünkü log'un çok değerliliği tam sayıyla çarpıldığında yine 2πi'nin katı olur ve e<sup>2πi</sup> = 1.</div></div>
<div class="calc-card"><div class="card-title">Rasyonel kuvvetler</div><div class="card-body">z<sup>p/q</sup>'nun tam q farklı değeri vardır — klasik q'uncu kökler. Örneğin z<sup>1/2</sup>'nin iki değeri vardır, ±√z.</div></div>
<div class="calc-card"><div class="card-title">Genel karmaşık kuvvetler</div><div class="card-body">Genelde sonsuz değer. Bağlam aksini zorlamadıkça neredeyse hep asal dalı kullanırız.</div></div>
</div>

<div class="l-note"><strong>Neden önemli.</strong> Sinyal işleme ve kuantum mekaniğinde karmaşık üsteller her yerdedir — salınım, dönme ve olasılık genliklerini tarif ederler. e<sup>iπ</sup> = −1 özdeşliği ve e<sup>iθ</sup> = cos θ + i sin θ formülü tam olarak L1'in vaat ettiği araçlardır: derin, temiz ve karmaşık sayılar olmadan geliştirilemez.</div>

<h2 class="l-title">9. ℂ'de Limit ve Süreklilik</h2>

<p class="l-text">ℂ'de limit ve süreklilik tanımları reel değişkenli haline neredeyse aynıdır — ama ardındaki geometri radikal biçimde farklıdır.</p>

<div class="calc-formula"><div class="formula-label">ℂ'DE LİMİT (ε-δ TANIMI)</div><div class="formula-main">$$\\lim_{z \\to z_0} f(z) = L \\iff \\forall \\varepsilon > 0\\ \\exists \\delta > 0:\\ 0 < |z - z_0| < \\delta \\implies |f(z) - L| < \\varepsilon$$</div><div class="formula-sub">Reel duruma kelimesi kelimesine aynı — yalnız mutlak değer artık karmaşık sayının modülünü (düzlemdeki Öklit uzaklığını) gösteriyor.</div></div>

<div class="calc-formula"><div class="formula-label">z<sub>0</sub>'DA SÜREKLİLİK</div><div class="formula-main">$$f \\text{ z<sub>0</sub>'da sürekli} \\iff \\lim_{z \\to z_0} f(z) = f(z_0)$$</div><div class="formula-sub">Aynı tanım. Limit varsa ve f'nin z<sub>0</sub>'daki değerine eşitse, f orada süreklidir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">2B yaklaşım</div><div class="card-body">ℝ'de "z, z<sub>0</sub>'a yaklaşır" sadece iki yön içerir: soldan veya sağdan. ℂ'de z, z<sub>0</sub>'a <em>düzlemdeki herhangi bir yönden</em> ve herhangi bir eğri boyunca yaklaşabilir.</div></div>
<div class="calc-card"><div class="card-title">Tüm yolların uyumu</div><div class="card-body">Limitin var olması için, f(z) hangi yolu izlerse izlesin aynı L değerine yaklaşmalı. Bu çok daha güçlü bir koşul.</div></div>
<div class="calc-card"><div class="card-title">Sürekli ama yararlı mı?</div><div class="card-body">Polinomlar, rasyonel fonksiyonlar (kutuplardan uzak), e<sup>z</sup>, sin z, cos z, Log z (dal kesiğinin dışında) — hepsi tanımlı oldukları her yerde süreklidir. Sürekliliğin kendisi cömerttir; sıradaki adım (türevlenebilirlik) gerçek sürprizlerin başladığı yerdir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK — yön önemlidir</div><div class="example-body"><strong>z ≠ 0 için g(z) = Re(z)/|z| düşün:</strong><br><br>z = x + 0i, pozitif reel eksen boyunca 0'a yaklaşırsa (x → 0⁺): g(z) = x/x = 1.<br>z = 0 + yi, pozitif sanal eksen boyunca 0'a yaklaşırsa (y → 0⁺): g(z) = 0/y = 0.<br>z = te<sup>iπ/4</sup>, çapraz boyunca 0'a yaklaşırsa: g(z) = (t·cos(π/4))/t = cos(π/4) ≈ 0.707.<br><br>Farklı yollar farklı limit değerleri verir. <strong>Limit yoktur.</strong> g, 0'da sürekli değildir — ve g(0)'ı nasıl tanımlasak da bu sorunu çözemeyiz.</div></div>

<h2 class="l-title">10. "Yönden Bağımsız" Limit Neden Önemli?</h2>

<div class="calc-highlight"><strong>İleriye bakış.</strong> Ders 3, <em>karmaşık türevi</em> reel kalkülüsteki ile aynı limit formülüyle tanımlayacak. Ama ℂ'de limitin her yol boyunca uyuşması gerektiğinden, karmaşık türevin varlığı reel türevin varlığından çok daha kısıtlayıcıdır. Bu sınavı geçen birkaç fonksiyon — <strong>holomorf</strong> ya da <strong>analitik</strong> denir — sonraki her dersin başrol oyuncuları haline gelir.</div>

<p class="l-text">Reel bir fonksiyon her noktada yalnızca iki tek yanlı limitin uyuşmasına ihtiyaç duyar. Karmaşık bir fonksiyon ise <em>her</em> ışın, her sarmal, her yaklaşma yolu boyunca limitin uyuşmasını gerektirir. Bu çok daha güçlü bir kısıttır. "İki reel değişkende sürekli" olan fonksiyonların çoğu bu sınavda başarısız olur.</p>

<div class="calc-formula"><div class="formula-label">KARMAŞIK TÜREV (ÖN GÖSTERİM)</div><div class="formula-main">$$f'(z_0) = \\lim_{h \\to 0} \\frac{f(z_0 + h) - f(z_0)}{h}, \\qquad h \\in \\mathbb{C}$$</div><div class="formula-sub">h karmaşık bir artıştır — düzlemde herhangi bir yönden 0'a yaklaşabilir. f'(z<sub>0</sub>)'ın var olması için, h hangi yönden alınırsa alınsın aynı L değerinin çıkması gerekir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reel durum</div><div class="card-body">ℝ'de 2 yandan (sol ve sağ) uyum gerek. Hemen her makul formülün hemen her yerde türevi vardır.</div></div>
<div class="calc-card"><div class="card-title">Karmaşık durum</div><div class="card-body">ℂ'de sonsuz yönden uyum gerek. Bu sınavı geçen fonksiyonlar tam olarak holomorf olanlardır — ve şaşırtıcı yapısal özelliklere sahiptirler (sonsuz türevlenebilir, Taylor serisine eşit, vb.).</div></div>
<div class="calc-card"><div class="card-title">Cauchy-Riemann</div><div class="card-body">Uyum kısıtı, u ve v'yi birbirine bağlayan iki KDD olarak yazılabilir — Cauchy-Riemann denklemleri. L3'ün konusu.</div></div>
</div>

<div class="l-warn"><strong>Her şeyi motive eden karşı örnek.</strong> f(z) = z̄'yi al (karmaşık eşlenik: x + iy ↦ x − iy). Süreklidir, (x, y) fonksiyonu olarak düzgündür, ama hiçbir noktada karmaşık türevi yoktur. Sebep: z<sub>0</sub>'a reel yönden yaklaşmak [f(z<sub>0</sub>+h)−f(z<sub>0</sub>)]/h = 1 verir; sanal yönden yaklaşmak −1 verir. Yön başına farklı limit ⇒ karmaşık türev yok. Bu tek örnek "reel-düzgün" ile "karmaşık-türevlenebilir" arasını ayırır. L3 bu ayrımı kesinleştirecek.</div>

<h2 class="l-title">11. Domain Coloring Görselleştirmesi</h2>

<p class="l-text">Görüntüleri düz bir sayfaya sığmayan karmaşık fonksiyonlar için tek resimde en bilgi verici tablo <strong>domain coloring</strong>'dir. Tarif:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Girdi düzlemini sık bir nokta ızgarasıyla kapla</div><div class="step-detail">Her z = x + iy noktası, o girdideki f(z) değerine göre bir renk alır.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Hue (renk çarkı) arg(f(z))'yi kodlar</div><div class="step-detail">arg = 0 için kırmızı, π/3 için sarı, 2π/3 için yeşil, π için camgöbeği, −2π/3 için mavi, −π/3 için magenta ve tekrar kırmızı. Tam renk çarkı ↔ argümanın tam bir turu.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Parlaklık |f(z)|'yi kodlar</div><div class="step-detail">Küçük modüller için koyu; büyükler için parlak. Parlaklık çoğunlukla log|f(z)| ile yeniden ölçeklenir, böylece hem sıfırlar (|f| → 0) hem kutuplar (|f| → ∞) görünür.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Renk desenlerini oku</div><div class="step-detail">Tüm renklerin buluştuğu nokta (renk çarkı etrafında dönüyor) bir <em>sıfır</em> veya bir <em>kutuptur</em>. "Bıçak" sayısı çokluluğu söyler.</div></div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sıfırlar</div><div class="card-body">f(z) = 0 noktaları, renk çarkının pozitif yönde döndüğü koyu noktalar olarak görünür.</div></div>
<div class="calc-card"><div class="card-title">Kutuplar</div><div class="card-body">|f(z)| → ∞ noktaları, renk çarkının <em>ters</em> yönde döndüğü parlak noktalar olarak görünür.</div></div>
<div class="calc-card"><div class="card-title">Çokluluk</div><div class="card-body">n. mertebeden sıfır, etrafında bir tur atarken renk çarkının n kez döndüğü noktadır. Bir bakışta görünür.</div></div>
</div>

<div id="plot-l2-dc-sin-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=120;var R=5;var xs=[];var ys=[];var hues=[];
for(var i=0;i<N;i++){xs.push(-R+2*R*i/(N-1));}
for(var j=0;j<N;j++){ys.push(-R+2*R*j/(N-1));}
for(var j=0;j<N;j++){
  var row=[];
  for(var i=0;i<N;i++){
    var x=xs[i];var y=ys[j];
    var sr=Math.sin(x)*Math.cosh(y);
    var si=Math.cos(x)*Math.sinh(y);
    var arg=Math.atan2(si,sr);
    var deg=(arg*180/Math.PI+360)%360;
    row.push(deg);
  }
  hues.push(row);
}
var colorscale=[];for(var k=0;k<=12;k++){var t=k/12;var deg=t*360;colorscale.push([t,"hsl("+deg+",70%,50%)"]);}
var trace={z:hues,x:xs,y:ys,type:"heatmap",colorscale:colorscale,zmin:0,zmax:360,showscale:false,hoverinfo:"skip"};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Re(z)",scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Im(z)"},margin:{t:50,r:30,b:50,l:50},showlegend:false};
Plotly.newPlot("plot-l2-dc-sin-tr",[trace],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı:</strong> −5 ≤ Re(z), Im(z) ≤ 5 karesi üzerinde f(z) = sin z'nin domain coloring'i. Renk = arg(sin z). Reel eksende z = 0, ±π'deki sıfırlar — tüm renklerin buluştuğu noktalar olarak görünür. Reel eksenden uzaklaştıkça renk çizgileri neredeyse yataya döner çünkü sin z ±i·sinh(y) tarafından domine edilir, ki onun argümanı ±π/2'ye yakındır.</div></div>

<div id="plot-l2-dc-pole-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=140;var R=2.5;var xs=[];var ys=[];var hues=[];
for(var i=0;i<N;i++){xs.push(-R+2*R*i/(N-1));}
for(var j=0;j<N;j++){ys.push(-R+2*R*j/(N-1));}
for(var j=0;j<N;j++){
  var row=[];
  for(var i=0;i<N;i++){
    var x=xs[i];var y=ys[j];
    var ar=x*x-y*y+1;var ai=2*x*y;
    var den=ar*ar+ai*ai;
    if(den<1e-12){row.push(0);continue;}
    var fr=ar/den;var fi=-ai/den;
    var arg=Math.atan2(fi,fr);
    var deg=(arg*180/Math.PI+360)%360;
    row.push(deg);
  }
  hues.push(row);
}
var colorscale=[];for(var k=0;k<=12;k++){var t=k/12;var deg=t*360;colorscale.push([t,"hsl("+deg+",70%,50%)"]);}
var trace={z:hues,x:xs,y:ys,type:"heatmap",colorscale:colorscale,zmin:0,zmax:360,showscale:false,hoverinfo:"skip"};
var markers={x:[0,0],y:[1,-1],mode:"markers+text",marker:{size:12,color:"#ffffff",line:{color:"#000",width:2}},text:["+i","-i"],textposition:"top right",textfont:{color:"#ffffff",size:13},showlegend:false};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Re(z)",scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"Im(z)"},margin:{t:50,r:30,b:50,l:50},showlegend:false};
Plotly.newPlot("plot-l2-dc-pole-tr",[trace,markers],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı:</strong> −2.5 ≤ Re(z), Im(z) ≤ 2.5 üzerinde f(z) = 1/(z² + 1)'in domain coloring'i. Fonksiyonun z = ±i'de iki kutbu vardır (beyaz noktalarla işaretli): renk çarkı her birinin etrafında <em>ters</em> yönde döner (kırmızı → magenta → mavi → camgöbeği → yeşil → sarı → kırmızı) — bu bir kutbun görsel imzasıdır. Bu resimde sıfır yoktur — fonksiyon hiçbir yerde sıfırlanmaz.</div></div>

<h2 class="l-title">12. Pratik Egzersiz: Kendi Görselleştiricini Yap</h2>

<p class="l-text">Her şeyi kodda bir araya getirme zamanı. Küçük bir Python betiği yazacağız: (a) bir karmaşık fonksiyon f alır, (b) bir ızgaranın f altındaki görüntüsünü çizer, (c) bir domain coloring üretir. Python'un yerleşik <code>complex</code> türünü kullan — NumPy bunu doğrudan destekler, neredeyse hiç ekstra ek tesisat gerekmez.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON · f(z) ALTINDA IZGARA DÖNÜŞÜMÜ</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">KOPYALA</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

<span class="cm"># 1. Karmaşık fonksiyonunu tanımla. z**2, 1/z, np.sin, np.exp dene ...</span>
<span class="kw">def</span> <span class="fn">f</span>(z):
    <span class="kw">return</span> z**<span class="num">2</span>

<span class="cm"># 2. z-düzleminde dikdörtgen bir ızgara kur.</span>
N = <span class="num">21</span>
xs = np.linspace(-<span class="num">2</span>, <span class="num">2</span>, N)
ys = np.linspace(-<span class="num">2</span>, <span class="num">2</span>, N)

fig, ax = plt.subplots(<span class="num">1</span>, <span class="num">2</span>, figsize=(<span class="num">10</span>, <span class="num">5</span>))

<span class="cm"># Sol panel: z-düzleminde kaynak ızgara</span>
<span class="kw">for</span> y0 <span class="kw">in</span> ys:
    line = np.linspace(-<span class="num">2</span>, <span class="num">2</span>, <span class="num">200</span>) + <span class="num">1j</span>*y0
    ax[<span class="num">0</span>].plot(line.real, line.imag, color=<span class="str">"#3b82f6"</span>, lw=<span class="num">0.6</span>)
<span class="kw">for</span> x0 <span class="kw">in</span> xs:
    line = x0 + <span class="num">1j</span>*np.linspace(-<span class="num">2</span>, <span class="num">2</span>, <span class="num">200</span>)
    ax[<span class="num">0</span>].plot(line.real, line.imag, color=<span class="str">"#f97316"</span>, lw=<span class="num">0.6</span>)
ax[<span class="num">0</span>].set_title(<span class="str">"z-duzlemi (kaynak izgara)"</span>); ax[<span class="num">0</span>].set_aspect(<span class="str">"equal"</span>)

<span class="cm"># Sağ panel: w-düzleminde görüntü ızgarası</span>
<span class="kw">for</span> y0 <span class="kw">in</span> ys:
    line = np.linspace(-<span class="num">2</span>, <span class="num">2</span>, <span class="num">200</span>) + <span class="num">1j</span>*y0
    w = <span class="fn">f</span>(line)
    ax[<span class="num">1</span>].plot(w.real, w.imag, color=<span class="str">"#3b82f6"</span>, lw=<span class="num">0.6</span>)
<span class="kw">for</span> x0 <span class="kw">in</span> xs:
    line = x0 + <span class="num">1j</span>*np.linspace(-<span class="num">2</span>, <span class="num">2</span>, <span class="num">200</span>)
    w = <span class="fn">f</span>(line)
    ax[<span class="num">1</span>].plot(w.real, w.imag, color=<span class="str">"#f97316"</span>, lw=<span class="num">0.6</span>)
ax[<span class="num">1</span>].set_title(<span class="str">"w-duzlemi (goruntu)"</span>); ax[<span class="num">1</span>].set_aspect(<span class="str">"equal"</span>)
plt.tight_layout(); plt.show()
</code></pre></div>

<p class="l-text"><code>f</code>'yi <code>lambda z: 1/z</code>, <code>np.sin</code>, <code>np.exp</code> veya <code>lambda z: (z - 1)/(z + 1)</code> (bir Möbius haritası) ile değiştirmeyi dene. Her biri sağ paneli bambaşka bir dönüşümle boyar — ve ızgaranın morfunu izlemek karmaşık fonksiyon sezgisi geliştirmenin en hızlı yoludur.</p>

<p class="l-text">Domain coloring için 2B renk görüntüsü kullanırız; hue argümanı, parlaklık (log) modülü kodlar. NumPy'nin karmaşık ızgaralar üzerindeki vektörel aritmetiği bunu neredeyse önemsiz kılar:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON · DOMAIN COLORING</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">KOPYALA</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">from</span> matplotlib.colors <span class="kw">import</span> hsv_to_rgb

<span class="kw">def</span> <span class="fn">domain_coloring</span>(f, R=<span class="num">2.5</span>, N=<span class="num">600</span>):
    <span class="cm">"""f'nin [-R, R] x [-R, R] üzerinde domain-coloring resmini çiz."""</span>
    x = np.linspace(-R, R, N)
    y = np.linspace(-R, R, N)
    X, Y = np.meshgrid(x, y)
    Z = X + <span class="num">1j</span>*Y
    W = <span class="fn">f</span>(Z)

    H = (np.angle(W) + np.pi) / (<span class="num">2</span>*np.pi)        <span class="cm"># [0,1] arasında hue</span>
    M = np.<span class="fn">abs</span>(W)
    L = <span class="num">0.5</span> + <span class="num">0.5</span>*np.tanh(np.log(M + <span class="num">1e-12</span>) / <span class="num">3</span>)  <span class="cm"># log|f| üzerinden parlaklık</span>
    S = np.ones_like(H) * <span class="num">0.85</span>                       <span class="cm"># doygunluk</span>

    <span class="cm"># HSV -> RGB. Parlaklığı V üzerinden kodlar.</span>
    HSV = np.stack([H, S, L], axis=-<span class="num">1</span>)
    RGB = <span class="fn">hsv_to_rgb</span>(HSV)

    plt.figure(figsize=(<span class="num">6</span>, <span class="num">6</span>))
    plt.imshow(RGB, extent=[-R, R, -R, R], origin=<span class="str">"lower"</span>)
    plt.xlabel(<span class="str">"Re(z)"</span>); plt.ylabel(<span class="str">"Im(z)"</span>)
    plt.title(<span class="str">f"f'nin domain coloring'i"</span>)
    plt.tight_layout(); plt.show()

<span class="cm"># Örnekler — birer birer dene</span>
<span class="fn">domain_coloring</span>(<span class="kw">lambda</span> z: z**<span class="num">2</span>)              <span class="cm"># orijinde 2. mertebe sıfır</span>
<span class="fn">domain_coloring</span>(<span class="kw">lambda</span> z: <span class="num">1</span>/z)              <span class="cm"># orijinde 1. mertebe kutup</span>
<span class="fn">domain_coloring</span>(np.sin)                       <span class="cm"># reel eksende z = k·π sıfırları</span>
<span class="fn">domain_coloring</span>(<span class="kw">lambda</span> z: (z - <span class="num">1</span>)*(z + <span class="num">1</span>)/(z**<span class="num">2</span> + <span class="num">1</span>))  <span class="cm"># 2 sıfır, 2 kutup</span>
</code></pre></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">Son örneği çalıştırdıktan sonra her sıfırın ve her kutbun etrafındaki "renk bıçaklarını" say. Her sıfır tek bir tam renk turu gösterir (1. mertebe). ±i'deki iki kutup ters tek tur gösterir. Bir nokta etrafındaki renk çarkının tam sayı "sarım sayısı", sıfır veya kutbun mertebesidir. Bu görsel olguyu L4'te bir teoreme (argüman ilkesi) dönüştüreceğiz.</div></div>

<div class="l-note"><strong>Sıradaki konu.</strong> Ders 3'te sürekliliği türevlenebilirliğe yükseltiyor ve <strong>Cauchy-Riemann denklemleriyle</strong> tanışıyoruz. Sonra karmaşık türevlenebilir bir fonksiyonun otomatik olarak sonsuz türevlenebilir, Taylor serisine eşit ve değerleri herhangi bir küçük açık küme üzerinde benzersizce belirlendiği — reel-değişken karşılığı olmayan şaşırtıcı rijitlik özelliklerine sahip olduğunu keşfedeceğiz.</div>

<h2 class="l-title">13. Özet</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Karmaşık fonksiyon</div><div class="card-body">f: ℂ → ℂ kuralı. Eşdeğer olarak, tek bir karmaşıkta paketlenmiş iki reel değerli u(x, y) ve v(x, y) fonksiyonu.</div><div class="card-formula">f(z) = u + i·v</div></div>
<div class="calc-card"><div class="card-title">z<sup>n</sup></div><div class="card-body">Modül n. kuvvete; açı n ile çarpılır. Düzlemi n kez kendi üzerine sarar.</div><div class="card-formula">z<sup>n</sup> = r<sup>n</sup>·e<sup>inθ</sup></div></div>
<div class="calc-card"><div class="card-title">Möbius dönüşümü</div><div class="card-body">Genelleştirilmiş çemberleri genelleştirilmiş çemberlere gönderir. Öteleme, dönme/ölçekleme ve tersleme 1/z'den kurulmuş.</div><div class="card-formula">f(z) = (az+b)/(cz+d)</div></div>
<div class="calc-card"><div class="card-title">e<sup>z</sup></div><div class="card-body">2πi periyotlu periyodik. Yatay şeritleri dilime eşler. Modül Re(z) ile, argüman Im(z) ile kontrollü.</div><div class="card-formula">e<sup>x+iy</sup> = e<sup>x</sup>(cos y + i·sin y)</div></div>
<div class="calc-card"><div class="card-title">sin z, cos z</div><div class="card-body">Üstel üzerinden tanımlı. Sadece reel eksende sınırlı; sanal eksen boyunca üstel hızla büyür.</div><div class="card-formula">cos(i) = cosh(1) ≈ 1.54</div></div>
<div class="calc-card"><div class="card-title">log z</div><div class="card-body">Çok değerli. Asal dal Log z = ln|z| + i·Arg(z); Arg ∈ (−π, π]. Dal kesiği negatif reel eksende.</div><div class="card-formula">log z = ln|z| + i(arg z + 2πk)</div></div>
<div class="calc-card"><div class="card-title">z<sup>w</sup></div><div class="card-body">e<sup>w·log z</sup> olarak tanımlı. Genelde çok değerli. i<sup>i</sup> = e<sup>−π/2</sup> ≈ 0.208 (reel!).</div><div class="card-formula">z<sup>w</sup> = e<sup>w·log z</sup></div></div>
<div class="calc-card"><div class="card-title">Limit ve süreklilik</div><div class="card-body">Tanımlar reel duruma aynı — fakat z, z<sub>0</sub>'a 2B'de her yönden yaklaşabilir. Çok daha güçlü.</div><div class="card-formula">lim<sub>z→z₀</sub> f(z) = L</div></div>
<div class="calc-card"><div class="card-title">Yön bağımsızlığı</div><div class="card-body">Karmaşık türev için sahneyi hazırlar. Bu kısıtı geçen her şeye <em>holomorf</em> denir.</div><div class="card-formula">f'(z₀) var ⇒ aynı h-yön</div></div>
<div class="calc-card"><div class="card-title">Domain coloring</div><div class="card-body">Karmaşık fonksiyonu hue = arg(f), parlaklık = |f| ile görselleştir. Sıfırlar ve kutuplar renk çarkı girdapları olarak görünür.</div><div class="card-formula">hue ↔ arg, parlaklık ↔ |f|</div></div>
</div>

<div class="l-highlight"><strong>Akılda kalsın.</strong> Karmaşık fonksiyon bir grafik değil; <em>düzlemin bir dönüşümüdür</em>. Anlamak için düzlemin nasıl hareket ettiğini izlemeyi öğren.</div>`

};
