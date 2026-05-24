window.COMPLEX_L6 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>This is the lesson where complex analysis stops being algebra and turns into geometry.</strong> So far we have used the Cauchy-Riemann equations to test functions for holomorphy, computed line integrals via the residue theorem, and classified singularities. None of that demanded any picture. Conformal maps invert the emphasis: the central question is now visual. <em>What does a holomorphic function do to the shape of a region?</em> The answer — they rotate and stretch infinitesimally without distorting angles — turns complex analysis into the engine behind classical aerodynamics, electrostatics, fluid flow, brain-surface flattening, and mesh parameterisation in computer graphics.</p>

<p class="l-text">The plan is to start with the geometric definition of conformality, prove that holomorphic = conformal, classify the simplest non-trivial family (Möbius transformations), then specialise to two engineering classics: the Cayley transform that warps the upper half-plane onto a disk and the Joukowski transform that produces a working airfoil cross-section. Along the way we will solve 2D potential flow analytically and state the Riemann Mapping Theorem — the structural ceiling of the whole subject.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the geometric definition of a conformal map and prove holomorphic + non-zero derivative ⇒ conformal</li>
<li>Classify Mobius transformations as compositions of translation, rotation, scaling, and inversion</li>
<li>Use the Cayley transform to convert problems on the upper half-plane to problems on the unit disk</li>
<li>Construct a Joukowski airfoil by shifting and shrinking the source circle, and read its geometry</li>
<li>Write the complex potential of 2D incompressible irrotational flow and transport it through conformal maps</li>
<li>Compute lift on a thin airfoil via the Kutta-Joukowski theorem from a single contour integral</li>
<li>State the Riemann Mapping Theorem and recognise where its existence guarantee is used in practice</li>
</ul>
</div>

<h2 class="lesson-title">1. Conformal Maps — Geometric Definition</h2>

<div class="calc-highlight"><strong>A map is conformal at a point when it preserves angles there.</strong> Two smooth curves crossing at that point at some angle α must, after the map is applied, still cross at the same angle α. The orientation of the angle is preserved too — a left turn stays a left turn — which is what distinguishes "conformal" from the broader idea of an angle-preserving map that might also flip orientation (those are anti-conformal). Magnitudes of distances are not required to be preserved; only angles are.</div>

<p class="l-text">Formally, let $f: U \\to V$ be a smooth map between open subsets of $\\mathbb{R}^2 \\cong \\mathbb{C}$, and let $z_0 \\in U$. Take any two smooth curves $\\gamma_1, \\gamma_2$ passing through $z_0$ with non-zero tangent vectors $\\dot\\gamma_1(0), \\dot\\gamma_2(0)$. The map $f$ is <strong>conformal at $z_0$</strong> if</p>

<div class="calc-formula"><div class="formula-label">CONFORMAL — DEFINITION</div><div class="formula-main">$$\\angle\\bigl(\\dot{f \\circ \\gamma_1}(0), \\dot{f \\circ \\gamma_2}(0)\\bigr) \\;=\\; \\angle\\bigl(\\dot\\gamma_1(0), \\dot\\gamma_2(0)\\bigr) \\qquad \\text{(with sign).}$$</div><div class="formula-sub">The signed angle between any two curves at $z_0$ equals the signed angle between their images at $f(z_0)$.</div></div>

<p class="l-text">Two important things to notice. <strong>One.</strong> The definition is local — it concerns angles at a single point, and a map can be conformal at some points and fail at others. <strong>Two.</strong> Conformality says nothing about lengths. Holomorphic maps, the conformal maps of complex analysis, scale every direction by the <em>same</em> local factor $|f'(z_0)|$, which is what makes them angle-preserving; but the scale factor can vary wildly from point to point, so the shape of a large region can be enormously distorted while still being conformal everywhere.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Angle preservation</div><div class="card-body">Two intersecting curves stay intersecting at the same angle. The fundamental geometric demand.</div></div>
<div class="calc-card"><div class="card-title">Orientation preservation</div><div class="card-body">A counter-clockwise pair of tangent vectors stays counter-clockwise. Rules out reflections.</div></div>
<div class="calc-card"><div class="card-title">Lengths free to change</div><div class="card-body">Conformality is silent on distances. Every direction must scale equally, but the scale itself is allowed to differ from point to point.</div></div>
</div>

<h2 class="lesson-title">2. Why Holomorphic = Angle-Preserving</h2>

<p class="l-text">The link between the algebraic property "holomorphic with non-zero derivative" and the geometric property "conformal" is the cleanest single derivation in this lesson. The argument has two ingredients: a first-order Taylor expansion of $f$ near $z_0$ and the fact that multiplication by any non-zero complex number is a rotation composed with a uniform scaling.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Linearise near $z_0$</div><div class="step-detail">Since $f$ is holomorphic at $z_0$, the Taylor expansion gives $f(z) = f(z_0) + f'(z_0)(z - z_0) + O(|z - z_0|^2)$. To first order, $f$ acts on the small displacement $\\Delta z = z - z_0$ by multiplying it by the constant $a = f'(z_0)$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Multiplication by $a$ is rotate-and-scale</div><div class="step-detail">Write $a = |a| \\, e^{i\\arg a}$. For any displacement $\\Delta z$, the image $a \\cdot \\Delta z$ has modulus $|a| \\cdot |\\Delta z|$ and argument $\\arg \\Delta z + \\arg a$. In words: rotate every direction by $\\arg a$ and scale every length by $|a|$ — the same rotation and the same scaling for every direction.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Angles between displacements survive</div><div class="step-detail">If $\\Delta z_1, \\Delta z_2$ make an angle $\\alpha = \\arg \\Delta z_2 - \\arg \\Delta z_1$, then their images make angle $(\\arg \\Delta z_2 + \\arg a) - (\\arg \\Delta z_1 + \\arg a) = \\alpha$. The added $\\arg a$ cancels. The angle is preserved.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Where the non-zero matters</div><div class="step-detail">If $f'(z_0) = 0$, the linear term vanishes and the local picture is dominated by the next non-zero derivative, generically $f''(z_0)$. Then the map looks like $w \\mapsto c w^2$ locally, which doubles every angle at $z_0$. The map remains smooth but fails to be conformal precisely at the critical points where $f' = 0$.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">FUNDAMENTAL EQUIVALENCE</div><div class="formula-main">$$f \\text{ holomorphic at } z_0 \\;\\text{ and }\\; f'(z_0) \\ne 0 \\;\\Longleftrightarrow\\; f \\text{ is conformal at } z_0.$$</div><div class="formula-sub">The Cauchy-Riemann equations, originally a piece of algebra, turn out to be exactly the condition for angle preservation. The two viewpoints — analytic and geometric — are equivalent.</div></div>

<p class="l-text">Looking back at L3, we now see why the Cauchy-Riemann equations forced the Jacobian of $f$, viewed as a real map $(x,y) \\mapsto (u,v)$, to have the special form $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$. That is precisely the matrix that represents multiplication by the complex number $a + ib$. Real-linear maps with this special structure are exactly the rotations-composed-with-scalings, and rotations-composed-with-scalings are the angle-preserving linear maps. The whole chain — CR equations, complex multiplication, similarity matrix, rotation+scaling, angle preservation — is one idea seen from five sides.</p>

<div class="calc-graph"><div id="plot-l6-conformal-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the left panel is a regular grid in the $z$-plane with two perpendicular families of lines (vertical lines $x = \\text{const}$ in blue, horizontal lines $y = \\text{const}$ in gold). The right panel is the image of the same grid under $f(z) = z^2$. Every line bends into a parabola and the overall sheet stretches and folds. But at every grid intersection point off the origin the blue and gold curves still cross at $90^\\circ$ — the right angle survives the bending. The single critical point at $z = 0$, where $f'(0) = 0$, is where conformality fails: angles there are doubled rather than preserved.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];var traces2=[];
var lines=[-1.5,-1,-0.5,0,0.5,1,1.5];
for(var k=0;k<lines.length;k++){var xv=lines[k];var x=[],y=[],ux=[],uy=[];for(var i=0;i<=80;i++){var yy=-1.6+3.2*i/80;x.push(xv);y.push(yy);ux.push(xv*xv-yy*yy);uy.push(2*xv*yy);}traces.push({x:x,y:y,mode:'lines',name:'x='+xv,line:{color:'#3b82f6',width:1.6},showlegend:(k===0)});traces2.push({x:ux,y:uy,mode:'lines',line:{color:'#3b82f6',width:1.6},showlegend:false,xaxis:'x2',yaxis:'y2'});}
for(var k=0;k<lines.length;k++){var yv=lines[k];var x=[],y=[],ux=[],uy=[];for(var i=0;i<=80;i++){var xx=-1.6+3.2*i/80;x.push(xx);y.push(yv);ux.push(xx*xx-yv*yv);uy.push(2*xx*yv);}traces.push({x:x,y:y,mode:'lines',name:'y='+yv,line:{color:'#f59e0b',width:1.6},showlegend:(k===0)});traces2.push({x:ux,y:uy,mode:'lines',line:{color:'#f59e0b',width:1.6},showlegend:false,xaxis:'x2',yaxis:'y2'});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'Re(z) — input grid',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0,0.45],range:[-2,2],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-2,2]},xaxis2:{title:'Re(z²) — image grid',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0.55,1],range:[-4.5,4.5],scaleanchor:'y2',scaleratio:1},yaxis2:{title:'Im(z²)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-4.5,4.5],anchor:'x2'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-conformal-en',traces.concat(traces2),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>What about reflections?</strong> The map $z \\mapsto \\bar z$ also preserves the magnitude of every angle, but flips its sign — it is angle-reversing. Such maps are called anti-conformal. They are not holomorphic (we proved $\\bar z$ is nowhere complex-differentiable in L3) — they are anti-holomorphic. Conformal in the strict sense always means orientation-preserving in addition to angle-preserving. The flip side of the same coin: $f$ is anti-conformal iff $\\bar f$ is conformal.</div>

<h2 class="lesson-title">3. Möbius Transformations — Classification</h2>

<div class="calc-highlight"><strong>Möbius transformations are the simplest non-trivial conformal maps.</strong> They are the conformal automorphisms of the Riemann sphere $\\hat{\\mathbb{C}} = \\mathbb{C} \\cup \\{\\infty\\}$ — every angle-preserving bijection of the sphere to itself is one of them. They include the obvious building blocks (translation, rotation, scaling) plus one fundamentally new gadget — inversion $z \\mapsto 1/z$ — and any conformal automorphism of the sphere decomposes as a chain of these four.</div>

<p class="l-text">A <strong>Möbius transformation</strong> is any map of the form</p>

<div class="calc-formula"><div class="formula-label">MOBIUS TRANSFORMATION</div><div class="formula-main">$$f(z) \\;=\\; \\frac{az + b}{cz + d}, \\qquad a, b, c, d \\in \\mathbb{C}, \\quad ad - bc \\ne 0.$$</div><div class="formula-sub">The non-degeneracy condition $ad - bc \\ne 0$ excludes the constant map and is the determinant of the matrix $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$. Two such matrices that differ by a scalar produce the same Möbius map.</div></div>

<p class="l-text">Where defined, $f'(z) = (ad - bc)/(cz + d)^2 \\ne 0$, so every Möbius transformation is conformal everywhere it is finite. By convention $f(-d/c) = \\infty$ and $f(\\infty) = a/c$, which extends $f$ to a bijection of the Riemann sphere. The composition of two Möbius maps is again Möbius — the group operation matches matrix multiplication of the coefficient matrices, so the group of Möbius transformations is $\\text{PGL}(2, \\mathbb{C}) = \\text{GL}(2, \\mathbb{C}) / \\{\\lambda I\\}$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Translation</div><div class="card-body">$z \\mapsto z + b$. Coefficients $a = d = 1$, $c = 0$. Shifts the plane by $b$, leaves $\\infty$ fixed.</div><div class="card-formula">$f(z) = z + b$</div></div>
<div class="calc-card"><div class="card-title">Rotation + scaling</div><div class="card-body">$z \\mapsto a z$. Multiplies by $a = |a| e^{i\\arg a}$: rotate by $\\arg a$ and scale by $|a|$. Fixes 0 and $\\infty$.</div><div class="card-formula">$f(z) = a z$</div></div>
<div class="calc-card"><div class="card-title">Inversion</div><div class="card-body">$z \\mapsto 1/z$. Swaps interior and exterior of the unit circle; sends 0 to $\\infty$ and $\\infty$ to 0. The only piece that turns circles into lines.</div><div class="card-formula">$f(z) = 1/z$</div></div>
<div class="calc-card"><div class="card-title">General</div><div class="card-body">Every Möbius map is a finite composition of the three building blocks above. Decomposition: $f(z) = a/c + (bc-ad)/[c(cz+d)]$.</div><div class="card-formula">$f = T \\circ I \\circ S$</div></div>
</div>

<div class="calc-formula"><div class="formula-label">CIRCLE-LINE PROPERTY</div><div class="formula-main">$$\\text{Every Mobius transformation maps generalised circles to generalised circles.}$$</div><div class="formula-sub">A "generalised circle" is either a circle or a straight line (a circle of infinite radius through $\\infty$). Translations, rotations and scalings preserve circles and lines separately; inversion can convert one into the other.</div></div>

<p class="l-text"><strong>Why the circle-line theorem holds.</strong> A general circle or line has equation $A(x^2 + y^2) + B x + C y + D = 0$ for real $A, B, C, D$ — circles when $A \\ne 0$, lines when $A = 0$. Under $z \\mapsto 1/z$, set $z = 1/w$, expand, and clear denominators: the equation becomes $D(|w|^2) + B \\operatorname{Re}(w) - C \\operatorname{Im}(w) + A = 0$, which is of the same form with $A$ and $D$ swapped. So inversion turns "circle through origin" ($D = 0$) into "line" ($A = 0$) and vice versa; it turns any other circle into another circle. Composing with translations, rotations, and scalings — which obviously preserve generalised circles — gives the same conclusion for any Möbius map.</p>

<div class="calc-graph"><div id="plot-l6-mobius-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the left panel is a unit-spaced rectangular grid in the $z$-plane. The right panel is the same grid under the Möbius map $f(z) = (z - 1)/(z + 1)$, the Cayley-like transform that sends the right half-plane onto the unit disk. The horizontal lines on the left become circles through the boundary point $z = 1 \\mapsto 0$ on the right, and the vertical lines become circular arcs orthogonal to the unit circle. Every right angle of the original grid is preserved in the image — that is conformality in action — and every line is mapped to a generalised circle, exactly as Möbius theory predicts.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function mob(re,im){var dr=re+1,di=im;var nr=re-1,ni=im;var den=dr*dr+di*di;return [(nr*dr+ni*di)/den,(ni*dr-nr*di)/den];}
var traces1=[],traces2=[];
var xs=[0.2,0.5,1,1.5,2,3];
for(var k=0;k<xs.length;k++){var xv=xs[k];var lx=[],ly=[],ix=[],iy=[];for(var i=0;i<=120;i++){var yy=-3+6*i/120;lx.push(xv);ly.push(yy);var m=mob(xv,yy);ix.push(m[0]);iy.push(m[1]);}traces1.push({x:lx,y:ly,mode:'lines',name:'x='+xv,line:{color:'#3b82f6',width:1.5},showlegend:(k===0)});traces2.push({x:ix,y:iy,mode:'lines',line:{color:'#3b82f6',width:1.5},showlegend:false,xaxis:'x2',yaxis:'y2'});}
var ys=[-2.5,-1.5,-0.7,0,0.7,1.5,2.5];
for(var k=0;k<ys.length;k++){var yv=ys[k];var lx=[],ly=[],ix=[],iy=[];for(var i=0;i<=120;i++){var xx=0.05+3.5*i/120;lx.push(xx);ly.push(yv);var m=mob(xx,yv);ix.push(m[0]);iy.push(m[1]);}traces1.push({x:lx,y:ly,mode:'lines',name:'y='+yv,line:{color:'#f59e0b',width:1.5},showlegend:(k===0)});traces2.push({x:ix,y:iy,mode:'lines',line:{color:'#f59e0b',width:1.5},showlegend:false,xaxis:'x2',yaxis:'y2'});}
var circ=[],circ_x=[],circ_y=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;circ_x.push(Math.cos(th));circ_y.push(Math.sin(th));}
traces2.push({x:circ_x,y:circ_y,mode:'lines',line:{color:'rgba(255,255,255,0.45)',width:1.5,dash:'dot'},showlegend:false,xaxis:'x2',yaxis:'y2'});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'Re(z) — input grid',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0,0.45],range:[0,3.2],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-3,3]},xaxis2:{title:'Re(f) — image in unit disk',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0.55,1],range:[-1.15,1.15],scaleanchor:'y2',scaleratio:1},yaxis2:{title:'Im(f)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.15,1.15],anchor:'x2'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-mobius-en',traces1.concat(traces2),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Three points determine a Möbius map.</strong> Given any two ordered triples of distinct points $(z_1, z_2, z_3)$ and $(w_1, w_2, w_3)$ on the Riemann sphere, there exists a unique Möbius map sending $z_i \\mapsto w_i$. The explicit formula is the cross-ratio identity $(w - w_1)(w_2 - w_3) / [(w - w_3)(w_2 - w_1)] = (z - z_1)(z_2 - z_3) / [(z - z_3)(z_2 - z_1)]$, which can be solved for $w$ as a Möbius map of $z$. This is the engineer's recipe whenever the problem is "find the Möbius transformation sending these three boundary points to those three boundary points".</div>

<h2 class="lesson-title">4. The Cayley Transform</h2>

<p class="l-text">A specific Möbius transformation deserves its own name because it shows up everywhere from signal processing to numerical analysis: the <strong>Cayley transform</strong></p>

<div class="calc-formula"><div class="formula-label">CAYLEY TRANSFORM</div><div class="formula-main">$$C(z) \\;=\\; \\frac{z - i}{z + i}, \\qquad C^{-1}(w) \\;=\\; i \\, \\frac{1 + w}{1 - w}.$$</div><div class="formula-sub">Sends the upper half-plane $\\{\\operatorname{Im} z > 0\\}$ bijectively onto the open unit disk $\\{|w| < 1\\}$, with the real axis going to the unit circle (minus the point $w = 1$).</div></div>

<p class="l-text"><strong>Verifying the half-plane to disk property.</strong> For $z = x + iy$ with $y > 0$,</p>

<div class="calc-formula"><div class="formula-label">MODULUS COMPUTATION</div><div class="formula-main">$$|C(z)|^2 \\;=\\; \\frac{|z - i|^2}{|z + i|^2} \\;=\\; \\frac{x^2 + (y - 1)^2}{x^2 + (y + 1)^2}.$$</div><div class="formula-sub">The numerator and denominator differ only in the sign of the cross term $\\mp 2 y$ in the expansion. For $y > 0$ the numerator is strictly smaller, hence $|C(z)| < 1$.</div></div>

<p class="l-text">Direct calculation: numerator minus denominator equals $-4y$, which is negative for $y > 0$. So $|C(z)|^2 < 1$ on the upper half-plane, $= 1$ on the real axis ($y = 0$), and $> 1$ below — exactly the desired behaviour.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Where the real axis goes</div><div class="step-detail">Real $x \\in \\mathbb{R}$: $C(x) = (x - i)/(x + i)$. The numerator and denominator have the same modulus $\\sqrt{x^2 + 1}$, so $|C(x)| = 1$. The real axis goes to the unit circle.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Where three sample points go</div><div class="step-detail">$C(0) = -1$, $C(\\infty) = 1$ (the limit of $(z - i)/(z + i)$ as $z \\to \\infty$), and $C(i) = 0$. The reference centre of the half-plane maps to the centre of the disk; the two endpoints of the real axis map to opposite poles of the unit circle.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Inverse</div><div class="step-detail">$C^{-1}(w) = i(1 + w)/(1 - w)$. Sends $0 \\mapsto i$, $-1 \\mapsto 0$, $1 \\mapsto \\infty$. Verify $C(C^{-1}(w)) = w$ by substitution.</div></div></div>
</div>

<div class="calc-graph"><div id="plot-l6-cayley-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the left panel is a lattice of horizontal lines $y = \\text{const} > 0$ (blue) and vertical lines $x = \\text{const}$ (gold) in the upper half-plane. The right panel is the image of the same lattice under the Cayley transform $C(z) = (z - i)/(z + i)$. The unbounded strip on the left collapses to the open unit disk on the right. Horizontal lines become circles through $w = 1$ tangent to the unit circle from inside, vertical lines become circular arcs joining $-1$ to $1$. The reference point $z = i$ in the centre of the half-plane sits at the centre of the disk $w = 0$ after the map.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function cay(re,im){var nr=re,ni=im-1;var dr=re,di=im+1;var den=dr*dr+di*di;return [(nr*dr+ni*di)/den,(ni*dr-nr*di)/den];}
var traces1=[],traces2=[];
var ys=[0.2,0.5,1,1.5,2,3,5];
for(var k=0;k<ys.length;k++){var yv=ys[k];var lx=[],ly=[],ix=[],iy=[];for(var i=0;i<=160;i++){var xx=-4+8*i/160;lx.push(xx);ly.push(yv);var m=cay(xx,yv);ix.push(m[0]);iy.push(m[1]);}traces1.push({x:lx,y:ly,mode:'lines',name:'y='+yv,line:{color:'#3b82f6',width:1.5},showlegend:(k===0)});traces2.push({x:ix,y:iy,mode:'lines',line:{color:'#3b82f6',width:1.5},showlegend:false,xaxis:'x2',yaxis:'y2'});}
var xs=[-3,-2,-1,-0.5,0,0.5,1,2,3];
for(var k=0;k<xs.length;k++){var xv=xs[k];var lx=[],ly=[],ix=[],iy=[];for(var i=0;i<=160;i++){var yy=0.02+5.5*i/160;lx.push(xv);ly.push(yy);var m=cay(xv,yy);ix.push(m[0]);iy.push(m[1]);}traces1.push({x:lx,y:ly,mode:'lines',name:'x='+xv,line:{color:'#f59e0b',width:1.5},showlegend:(k===0)});traces2.push({x:ix,y:iy,mode:'lines',line:{color:'#f59e0b',width:1.5},showlegend:false,xaxis:'x2',yaxis:'y2'});}
var cx=[],cy=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;cx.push(Math.cos(th));cy.push(Math.sin(th));}
traces2.push({x:cx,y:cy,mode:'lines',line:{color:'rgba(255,255,255,0.45)',width:1.5,dash:'dot'},showlegend:false,xaxis:'x2',yaxis:'y2'});
traces1.push({x:[-4,4],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.45)',width:1.5,dash:'dot'},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'Re(z) — upper half-plane',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0,0.45],range:[-4,4],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[0,5.5]},xaxis2:{title:'Re(w) — unit disk',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0.55,1],range:[-1.15,1.15],scaleanchor:'y2',scaleratio:1},yaxis2:{title:'Im(w)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.15,1.15],anchor:'x2'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-cayley-en',traces1.concat(traces2),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WHERE THE CAYLEY TRANSFORM SHOWS UP IN ENGINEERING</div><div class="example-body"><strong>1. Bilinear (Tustin) transform in digital signal processing.</strong> A linear continuous-time filter $H(s)$ is converted to a discrete-time filter $H_d(z)$ by replacing $s$ with $(2/T)(z - 1)/(z + 1)$ — exactly the inverse Cayley transform up to scaling. The map carries the open left half-plane (continuous-time stable region) into the open unit disk (discrete-time stable region), so the bilinear transform automatically preserves stability.<br><br><strong>2. Stability regions of ODE solvers.</strong> The "A-stability" of a one-step ODE integrator is determined by where its stability function maps the open left half-plane. Cayley translates the question into "where does $S(z)$ map the open unit disk", which is geometrically easier to draw and easier to verify.<br><br><strong>3. Cayley transform of self-adjoint operators.</strong> In functional analysis a self-adjoint $A$ corresponds via $U = (A - iI)(A + iI)^{-1}$ to a unitary $U$, and the inverse map carries the unit circle minus one point back to the real line — the operator-theoretic version of the half-plane to disk picture, exploited heavily in quantum mechanics.</div></div>

<h2 class="lesson-title">5. The Joukowski Transform</h2>

<div class="calc-highlight"><strong>The Joukowski transform is the workhorse of classical aerodynamics.</strong> Take the simple formula $J(z) = z + 1/z$ and apply it to a circle in the $z$-plane. If the circle is the unit circle centred at the origin, the image is a slit. If the circle is shifted slightly off-centre but still passes through the point $z = 1$, the image is an asymmetric closed curve that looks like a real airfoil — pointed at the trailing edge, rounded at the leading edge, with a clean upper and lower surface. This is the geometry the Wright brothers' contemporaries used to design the first powered aircraft wings.</div>

<div class="calc-formula"><div class="formula-label">JOUKOWSKI TRANSFORM</div><div class="formula-main">$$J(z) \\;=\\; z + \\frac{1}{z}, \\qquad J'(z) \\;=\\; 1 - \\frac{1}{z^2}.$$</div><div class="formula-sub">Holomorphic on $\\mathbb{C} \\setminus \\{0\\}$, conformal everywhere except at the two critical points $z = \\pm 1$ where $J'(z) = 0$. At those points angles get doubled — they become the trailing-edge and leading-edge cusps of the airfoil.</div></div>

<p class="l-text"><strong>Step 1 — image of the unit circle.</strong> For $z = e^{i\\theta}$, $J(e^{i\\theta}) = e^{i\\theta} + e^{-i\\theta} = 2 \\cos\\theta$. The unit circle goes to the closed segment $[-2, 2]$ on the real axis, traversed twice as $\\theta$ goes once around. The map collapses the circle to a flat plate — useful as the simplest "infinitely thin" airfoil model.</p>

<p class="l-text"><strong>Step 2 — image of a circle of radius $r > 1$ centred at origin.</strong> For $z = r e^{i\\theta}$, $J(z) = (r + 1/r) \\cos\\theta + i (r - 1/r) \\sin\\theta$. This is an ellipse with semi-axes $(r + 1/r)$ (horizontal) and $(r - 1/r)$ (vertical). As $r \\to 1^+$ the vertical semi-axis shrinks to zero and the ellipse degenerates into the segment from step 1. As $r$ grows the ellipse becomes more circular.</p>

<p class="l-text"><strong>Step 3 — the airfoil construction.</strong> Take a circle that is shifted off the origin so that it still passes through the critical point $z = 1$ but encloses the other critical point $z = -1$. The standard recipe is</p>

<div class="calc-formula"><div class="formula-label">JOUKOWSKI AIRFOIL CIRCLE</div><div class="formula-main">$$\\text{Centre: } z_c = -\\mu + i \\nu, \\qquad \\text{Radius: } R = \\sqrt{(1 + \\mu)^2 + \\nu^2}.$$</div><div class="formula-sub">Small positive $\\mu$ controls the thickness of the resulting airfoil; small positive $\\nu$ controls the camber (curvature of the mean line). The circle is required to pass exactly through $z = 1$, which becomes the sharp trailing edge after the map.</div></div>

<p class="l-text">Concretely: with $\\mu = 0.1, \\nu = 0$ the source circle is centred at $-0.1$ with radius $1.1$, passes through $z = 1$ (where $1 + 0.1 = 1.1 = R$), and encloses $z = -1$ (because distance from $-1$ to $-0.1$ is $0.9 < 1.1$). The image is a symmetric airfoil — thicker than the flat-plate $\\mu = 0$ case, with the trailing-edge cusp at $J(1) = 2$ and the leading-edge tip near $J(-0.2 \\cdot \\text{something})$. Adding camber $\\nu > 0$ tilts the upper surface relative to the lower, giving an asymmetric "cambered" airfoil generating lift at zero angle of attack.</p>

<div class="calc-graph"><div id="plot-l6-joukowski-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the left panel is the source circle in the $z$-plane — centred slightly off the origin at $z_c = -0.1 + 0.08i$, radius chosen so the circle passes through the critical point $z = 1$. The right panel is the Joukowski image $J(z) = z + 1/z$ of the same circle, traced as $\\theta$ runs through $[0, 2\\pi)$. The image curve is a closed asymmetric airfoil with a sharp cusp at the trailing edge $J(1) = 2$, a rounded leading edge near $J(-1.2) \\approx -2.03$, and a small positive camber inherited from the imaginary offset $\\nu = 0.08$. The dashed reference unit circle and the segment $[-2, 2]$ are drawn for context.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function jouk(re,im){var den=re*re+im*im;var invR=re/den,invI=-im/den;return [re+invR,im+invI];}
var mu=0.1,nu=0.08;var cx=-mu,cy=nu;var R=Math.sqrt((1+mu)*(1+mu)+nu*nu);
var circ_x=[],circ_y=[],air_x=[],air_y=[];
for(var i=0;i<=400;i++){var th=2*Math.PI*i/400;var zr=cx+R*Math.cos(th),zi=cy+R*Math.sin(th);circ_x.push(zr);circ_y.push(zi);var j=jouk(zr,zi);air_x.push(j[0]);air_y.push(j[1]);}
var refc_x=[],refc_y=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;refc_x.push(Math.cos(th));refc_y.push(Math.sin(th));}
var trace_circ={x:circ_x,y:circ_y,mode:'lines',name:'source circle',line:{color:'#3b82f6',width:2.4}};
var trace_ref={x:refc_x,y:refc_y,mode:'lines',name:'unit circle',line:{color:'rgba(255,255,255,0.40)',width:1.2,dash:'dot'},showlegend:false};
var trace_crit={x:[1,-1],y:[0,0],mode:'markers',name:'z = ±1',marker:{size:9,color:'#f59e0b',symbol:'x'},showlegend:false};
var trace_air={x:air_x,y:air_y,mode:'lines',line:{color:'#3b82f6',width:2.4},showlegend:false,xaxis:'x2',yaxis:'y2',fill:'toself',fillcolor:'rgba(59,130,246,0.10)'};
var trace_slit={x:[-2,2],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.40)',width:1.2,dash:'dot'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var trace_te={x:[2,-2],y:[0,0],mode:'markers',name:'edges',marker:{size:9,color:'#f59e0b',symbol:'x'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'Re(z) — source plane',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0,0.45],range:[-1.6,1.6],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.6,1.6]},xaxis2:{title:'Re(J) — airfoil plane',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0.55,1],range:[-2.4,2.4],scaleanchor:'y2',scaleratio:1},yaxis2:{title:'Im(J)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-2.4,2.4],anchor:'x2'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-joukowski-en',[trace_circ,trace_ref,trace_crit,trace_air,trace_slit,trace_te],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why the trailing-edge cusp?</strong> Recall $J'(z) = 1 - 1/z^2$, which vanishes at $z = 1$ and $z = -1$. Near $z = 1$, the Taylor expansion gives $J(z) \\approx 2 + (z - 1)^2$, so the local behaviour is quadratic — angles get doubled. A smooth curve crossing $z = 1$ at angle $\\beta$ becomes a curve with a $2\\beta$ corner at $J(z) = 2$. If the source circle passes through $z = 1$ tangent to itself (interior angle $\\pi$), the image has corner $2\\pi$, which is geometrically the cusp of a real airfoil. This is the analytic origin of the sharp trailing edge.</div>

<h2 class="lesson-title">6. 2D Potential Flow — Complex Potential</h2>

<p class="l-text">Conformal maps become a calculation engine, not just a curiosity, the moment we connect them to a physical PDE. The cleanest setting is two-dimensional flow of an incompressible, irrotational fluid — the model used in classical aerodynamics before viscosity is added back.</p>

<div class="calc-formula"><div class="formula-label">2D INCOMPRESSIBLE IRROTATIONAL FLOW</div><div class="formula-main">$$\\nabla \\cdot \\mathbf{v} \\;=\\; 0, \\qquad \\nabla \\times \\mathbf{v} \\;=\\; 0.$$</div><div class="formula-sub">No sources or sinks (mass is conserved) and no vorticity (no spin). In 2D, these two conditions are enough to write $\\mathbf{v}$ as a gradient of a scalar potential AND as a curl of a stream function.</div></div>

<p class="l-text"><strong>Velocity potential $\\phi$.</strong> Irrotational means $\\mathbf{v} = \\nabla \\phi$ for some scalar $\\phi(x,y)$. Combined with incompressibility, $\\nabla \\cdot \\nabla \\phi = \\Delta \\phi = 0$ — so $\\phi$ is harmonic. <strong>Stream function $\\psi$.</strong> Incompressibility means $\\mathbf{v}$ can also be written as $(\\partial_y \\psi, -\\partial_x \\psi)$. Combined with irrotationality, $\\Delta \\psi = 0$ — so $\\psi$ is also harmonic, and the level sets $\\psi = \\text{const}$ are exactly the streamlines along which fluid particles travel.</p>

<div class="calc-formula"><div class="formula-label">COMPLEX POTENTIAL</div><div class="formula-main">$$\\Omega(z) \\;=\\; \\phi(x,y) + i \\, \\psi(x,y), \\qquad \\frac{d\\Omega}{dz} \\;=\\; u - i v.$$</div><div class="formula-sub">$\\phi$ and $\\psi$ are harmonic conjugates by the Cauchy-Riemann equations (because $u = \\phi_x = \\psi_y$ and $v = \\phi_y = -\\psi_x$ both encode the same velocity field). So $\\Omega(z)$ is automatically holomorphic, and the complex derivative $d\\Omega/dz$ is the conjugate velocity $u - iv$.</div></div>

<p class="l-text">The payoff is staggering: any holomorphic function whatsoever is, automatically, a valid 2D inviscid flow. Pick your favourite $\\Omega$ and you have a flow. Better still — and this is the punchline of the lesson — if $\\Omega_0(z)$ is a flow on a simple geometry (like a disk) and $w = f(z)$ is a conformal map from that simple geometry to a complicated one (like the exterior of an airfoil), then $\\Omega_0(f^{-1}(w))$ is automatically a flow on the complicated geometry. Conformal maps <em>transport</em> flow solutions.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Uniform flow</div><div class="card-body">$\\Omega(z) = U z$, $U > 0$ real. Then $\\phi = U x$, $\\psi = U y$. Velocity $(U, 0)$ — constant horizontal flow.</div><div class="card-formula">$\\Omega = U z$</div></div>
<div class="calc-card"><div class="card-title">Point source</div><div class="card-body">$\\Omega(z) = (Q / 2\\pi) \\log z$. Radially outward flow with total flux $Q$. Streamlines are rays through origin.</div><div class="card-formula">$\\Omega = (Q/2\\pi)\\log z$</div></div>
<div class="calc-card"><div class="card-title">Point vortex</div><div class="card-body">$\\Omega(z) = -(i\\Gamma / 2\\pi) \\log z$. Circulating flow with total circulation $\\Gamma$. Streamlines are circles.</div><div class="card-formula">$\\Omega = -(i\\Gamma/2\\pi)\\log z$</div></div>
<div class="calc-card"><div class="card-title">Flow past cylinder</div><div class="card-body">$\\Omega(z) = U(z + R^2/z)$. Uniform $U$ at infinity, zero normal flow on the circle $|z| = R$. The streamline $\\psi = 0$ traces both the real axis and the cylinder boundary.</div><div class="card-formula">$\\Omega = U(z + R^2/z)$</div></div>
</div>

<div class="calc-formula"><div class="formula-label">FLOW TRANSPORT THEOREM</div><div class="formula-main">$$\\text{If } \\Omega_0 \\text{ is a flow on } D_0 \\text{ and } f: D \\to D_0 \\text{ is conformal, then } \\Omega(z) = \\Omega_0(f(z)) \\text{ is a flow on } D.$$</div><div class="formula-sub">The composition of holomorphic maps is holomorphic, so $\\Omega = \\Omega_0 \\circ f$ is again a complex potential. The streamlines on $D$ are pulled back from those on $D_0$ through the conformal map — and they cross the right angle to the velocity field automatically because conformal maps preserve angles.</div></div>

<p class="l-text"><strong>Reading the lift directly.</strong> The aerodynamic force per unit span on a body of cross-section $C$ in a 2D flow is given by the Blasius theorem $F_x - i F_y = (i \\rho / 2) \\oint_C (d\\Omega/dz)^2 \\, dz$. The Kutta-Joukowski theorem extracts the headline:</p>

<div class="calc-formula"><div class="formula-label">KUTTA-JOUKOWSKI LIFT</div><div class="formula-main">$$L \\;=\\; \\rho_\\infty \\, U_\\infty \\, \\Gamma \\qquad (\\text{lift per unit span}).$$</div><div class="formula-sub">$\\rho_\\infty$ — freestream density, $U_\\infty$ — freestream speed, $\\Gamma$ — total circulation around the airfoil. Lift is proportional to circulation. The whole reason airfoils are designed with a cusped trailing edge (the Kutta condition) is to fix a unique $\\Gamma$, which then determines the lift.</div></div>

<div class="calc-graph"><div id="plot-l6-flow-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> streamlines $\\psi = \\text{const}$ of the 2D inviscid flow past the Joukowski airfoil from section 5. The complex potential is $\\Omega(\\zeta) = U(\\zeta + R^2/\\zeta - (i\\Gamma/2\\pi)\\log\\zeta)$ in the source-circle plane with circulation chosen to satisfy the Kutta condition (smooth flow leaving the trailing edge). The streamlines are transported through $J(z) = z + 1/z$ to the airfoil plane. Notice how the upper streamlines crowd above the airfoil (high speed, low pressure) and the lower streamlines spread out (low speed, high pressure) — the textbook picture of how an airfoil lifts.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function jouk(re,im){var den=re*re+im*im;var invR=re/den,invI=-im/den;return [re+invR,im+invI];}
var mu=0.1,nu=0.08;var cx=-mu,cy=nu;var R=Math.sqrt((1+mu)*(1+mu)+nu*nu);
var U=1.0;var alpha=0.0;var beta=Math.atan2(nu,1+mu);var Gamma=4*Math.PI*U*R*Math.sin(alpha+beta);
function psi(zr,zi){var dr=zr-cx,di=zi-cy;var rsq=dr*dr+di*di;var r=Math.sqrt(rsq);var th=Math.atan2(di,dr);return U*(r-R*R/r)*Math.sin(th-alpha)-(Gamma/(2*Math.PI))*Math.log(r/R);}
var N=130;var xs=[],ys=[],Z=[];
for(var i=0;i<N;i++){var row=[];var yv=-2.4+4.8*i/(N-1);for(var j=0;j<N;j++){var xv=-2.4+4.8*j/(N-1);var dr=xv-cx,di=yv-cy;if(dr*dr+di*di<R*R+1e-6){row.push(null);continue;}var j_=jouk(xv,yv);xs.push(j_[0]);ys.push(j_[1]);row.push(psi(xv,yv));}Z.push(row);}
var airx=[],airy=[];for(var i=0;i<=400;i++){var th=2*Math.PI*i/400;var zr=cx+R*Math.cos(th),zi=cy+R*Math.sin(th);var j=jouk(zr,zi);airx.push(j[0]);airy.push(j[1]);}
var gridx=[],gridy=[];for(var i=0;i<N;i++){var row=[];var yv=-2.4+4.8*i/(N-1);gridx.push([]);gridy.push([]);for(var j=0;j<N;j++){var xv=-2.4+4.8*j/(N-1);var dr=xv-cx,di=yv-cy;if(dr*dr+di*di<R*R){gridx[i].push(null);gridy[i].push(null);}else{var jp=jouk(xv,yv);gridx[i].push(jp[0]);gridy[i].push(jp[1]);}}}
var contour={type:'contour',x:gridx[0],y:gridy.map(function(r){return r[0];}),z:Z,contours:{coloring:'lines',start:-3,end:3,size:0.18},line:{width:1.3,color:'#3b82f6'},colorscale:[[0,'#1e40af'],[0.5,'#3b82f6'],[1,'#93c5fd']],showscale:false,connectgaps:false,name:'ψ = const'};
var trace_air={x:airx,y:airy,mode:'lines',line:{color:'#f59e0b',width:2.2},fill:'toself',fillcolor:'rgba(245,158,11,0.15)',name:'airfoil'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(J) — chord direction',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-3.5,3.5],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(J) — span-normal',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-2,2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-flow-en',[contour,trace_air],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">EXAMPLE — LIFT ON A CAMBERED JOUKOWSKI AIRFOIL</div><div class="example-body">Take the airfoil from section 5 ($\\mu = 0.1$, $\\nu = 0.08$) in a freestream of speed $U = 30$ m/s and air density $\\rho = 1.225$ kg/m³. The Kutta condition forces $\\Gamma = 4 \\pi U R \\sin(\\alpha + \\beta)$ where $\\beta = \\arctan(\\nu / (1 + \\mu)) \\approx 0.073$ rad (the camber angle) and $\\alpha$ is the angle of attack. At $\\alpha = 0$ — flying flat — the camber alone produces $\\Gamma = 4 \\pi (30) (1.103) (0.073) \\approx 30.4$ m²/s, hence lift per unit span $L = (1.225)(30)(30.4) \\approx 1117$ N/m. Raise $\\alpha$ by 5° and the lift roughly triples. The whole calculation is one contour integral applied to one carefully chosen conformal map.</div></div>

<h2 class="lesson-title">7. Riemann Mapping Theorem</h2>

<div class="calc-highlight"><strong>The structural climax of conformal mapping.</strong> Up to this point we have built specific conformal maps by hand — the Cayley transform, the Joukowski transform, the bilinear maps that move three boundary points around. The Riemann Mapping Theorem promises something far stronger: <em>any</em> nice 2D region (simply connected, open, and not all of $\\mathbb{C}$) can be mapped conformally onto the unit disk. There is no exception, no list of "bad" shapes — the theorem is universal.</div>

<div class="calc-formula"><div class="formula-label">RIEMANN MAPPING THEOREM</div><div class="formula-main">$$\\text{Every simply-connected open } U \\subsetneq \\mathbb{C} \\text{ is conformally equivalent to the open unit disk } \\mathbb{D}.$$</div><div class="formula-sub">"Conformally equivalent" means there exists a holomorphic bijection $f: U \\to \\mathbb{D}$ with holomorphic inverse. The map is unique up to a Möbius automorphism of the disk once a base point and direction are fixed.</div></div>

<p class="l-text"><strong>What "simply connected" means here.</strong> $U$ is open, connected, and has no holes — any closed loop inside $U$ can be continuously shrunk to a point without leaving $U$. The unit disk, the upper half-plane, the slit plane $\\mathbb{C} \\setminus (-\\infty, 0]$, the inside of any Jordan curve, the exterior of a Joukowski airfoil — all simply connected. An annulus $\\{1 < |z| < 2\\}$ is <em>not</em> simply connected: a loop around the inner boundary cannot shrink. Hence the theorem does not promise a conformal map from an annulus to a disk — and indeed no such map exists.</p>

<p class="l-text"><strong>Why $\\mathbb{C}$ itself is excluded.</strong> A conformal map $\\mathbb{C} \\to \\mathbb{D}$ would be a bounded entire function. Liouville (L3) says every bounded entire function is constant. A constant is not a bijection. So the whole plane is the one exception — every <em>proper</em> simply-connected open subset is conformally equivalent to the disk.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Existence guarantee</div><div class="card-body">The map $f$ exists for every eligible $U$. The theorem is an existence statement; it does not write the map down.</div></div>
<div class="calc-card"><div class="card-title">Uniqueness up to disk automorphism</div><div class="card-body">Pick a base point $z_0 \\in U$ and demand $f(z_0) = 0, f'(z_0) > 0$. Then $f$ is uniquely determined. Without these normalisations, you have a three-parameter family.</div></div>
<div class="calc-card"><div class="card-title">Boundary behaviour</div><div class="card-body">Carathéodory's theorem (1913): if the boundary of $U$ is a Jordan curve, $f$ extends continuously to a homeomorphism of closures. Boundary points go to boundary points cleanly.</div></div>
<div class="calc-card"><div class="card-title">No proof here</div><div class="card-body">The original existence proof uses normal families and the Schwarz lemma — standard graduate material. We import the conclusion and use it.</div></div>
</div>

<div class="calc-example"><div class="example-label">SCHWARZ-CHRISTOFFEL — A CONSTRUCTIVE EXAMPLE</div><div class="example-body">For the special case of a polygon with vertices $w_1, \\dots, w_n$ and interior angles $\\alpha_1 \\pi, \\dots, \\alpha_n \\pi$, the conformal map from the upper half-plane to the polygon interior has the explicit form $f(z) = A + C \\int_{z_0}^z \\prod_{k=1}^n (\\zeta - x_k)^{\\alpha_k - 1} d\\zeta$ where $x_k = f^{-1}(w_k)$ are the (unknown) preimages of the vertices on the real axis. The unknown $x_k$'s are determined by solving a small nonlinear system tied to the side-length ratios. Numerical Schwarz-Christoffel toolkits (Driscoll's MATLAB SC toolbox is the most widely used) handle the system reliably for polygons of up to ~100 sides — the practical workhorse whenever a real engineering problem on a polygonal domain needs to be mapped to a disk.</div></div>

<h2 class="lesson-title">8. Modern Applications</h2>

<p class="l-text">Conformal maps form a quiet backbone in several engineering and scientific fields. None of them appear in machine learning slogans, but every one of them is a real, in-production use case.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aerodynamics</div><div class="card-body">Joukowski airfoils are the first analytical model of lift in every fluids textbook. Real airfoils — NACA, supercritical, transonic — are now numerical, but the qualitative pressure distribution and the Kutta-Joukowski lift formula stay correct.</div></div>
<div class="calc-card"><div class="card-title">Electrostatics & heat</div><div class="card-body">2D Laplace's equation governs the electric potential in a charge-free region and the steady-state temperature with no heat sources. Conformal maps move a hard geometry (capacitor with weird electrodes) to a simple one (parallel plates) where the solution is one line of algebra.</div></div>
<div class="calc-card"><div class="card-title">Brain imaging</div><div class="card-body">The cerebral cortex is a buckled 2D surface embedded in 3D. Conformal flattening (Gu, Vemuri, Sapiro, Yau) maps the cortex to a disk while preserving local angle relationships, so cortical thickness, curvature, and activation patterns can be compared across patients on a flat coordinate system.</div></div>
<div class="calc-card"><div class="card-title">Computer graphics</div><div class="card-body">Mesh parameterisation — laying a 3D triangle mesh flat for texture mapping — relies heavily on conformal or quasi-conformal methods (least-squares conformal maps, angle-based flattening, conformal energies). The same machinery is behind UV unwrapping in Blender, Maya, ZBrush.</div></div>
<div class="calc-card"><div class="card-title">Antenna and waveguide design</div><div class="card-body">2D cross-sections of strip-line and microstrip transmission lines have characteristic impedance computed by conformal mapping — Schwarz-Christoffel applied to the metal/dielectric geometry. Standard formulas in microwave engineering handbooks (Wheeler's, Hammerstad's) descend from these conformal-map calculations.</div></div>
<div class="calc-card"><div class="card-title">Conformal field theory</div><div class="card-body">In 2D statistical mechanics at criticality and in 2D quantum field theory, conformal symmetry constrains correlation functions almost completely. The Virasoro algebra and the Belavin-Polyakov-Zamolodchikov classification of minimal models all live on this same foundation.</div></div>
</div>

<div class="l-note"><strong>One AI-flavoured remark, deliberately measured.</strong> Conformal flattening of 3D meshes is what allows you to apply 2D convolutional networks to surface data — cortical-thickness analysis, mesh-based shape classification — without giving up the surface geometry. The pipeline is "3D mesh → conformal flatten → 2D CNN", with the conformal step playing exactly the same role it always did in physics: bring a hard geometry to a flat one where the standard machinery applies. No hype is needed; the math is just there, doing its job.</div>

<h2 class="lesson-title">9. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What to play with.</strong> Set $\\mu = 0$ and $\\nu = 0$ — you should get the flat-plate (degenerate) airfoil and a streamline picture that is simply the textbook flow past a thin plate. Push $\\mu$ up to $0.25$ and the airfoil becomes uncomfortably thick — the inviscid model breaks down before viscosity is reintroduced. Vary $\\alpha$ from $-10°$ to $+15°$ and watch the lift change linearly through zero — this is the lift curve $C_L(\\alpha) = 2\\pi \\sin(\\alpha + \\beta)$ predicted by the Kutta-Joukowski theorem. Replace the Joukowski map with $J_n(z) = z + 1/z^n$ for $n = 2$ — you produce <em>Karman-Trefftz</em> airfoils, with a finite trailing-edge angle instead of a cusp.</p>

<h2 class="lesson-title">10. Summary — What You Can Now Do</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Conformal definition</div><div class="card-body">A smooth map is conformal at $z_0$ when it preserves signed angles between intersecting curves through $z_0$.</div></div>
<div class="calc-card"><div class="card-title">Holomorphic = conformal</div><div class="card-body">Equivalent at every point where $f'(z_0) \\ne 0$. Critical points $f' = 0$ are angle-doublers.</div><div class="card-formula">$f$ hol, $f' \\ne 0 \\Leftrightarrow$ conformal</div></div>
<div class="calc-card"><div class="card-title">Möbius family</div><div class="card-body">$(az+b)/(cz+d)$ with $ad - bc \\ne 0$. The conformal automorphisms of the Riemann sphere. Maps generalised circles to generalised circles.</div></div>
<div class="calc-card"><div class="card-title">Cayley transform</div><div class="card-body">$(z - i)/(z + i)$: upper half-plane to disk. Foundation of the bilinear (Tustin) DSP transform and stability theory.</div></div>
<div class="calc-card"><div class="card-title">Joukowski transform</div><div class="card-body">$z + 1/z$: shifted circles to airfoils. Critical points $z = \\pm 1$ are the leading and trailing edges; angle-doubling creates the cusp.</div></div>
<div class="calc-card"><div class="card-title">Complex potential</div><div class="card-body">$\\Omega = \\phi + i\\psi$ holomorphic ⇔ valid 2D inviscid flow. Conformal maps transport flows from simple to complicated domains.</div></div>
<div class="calc-card"><div class="card-title">Kutta-Joukowski lift</div><div class="card-body">$L = \\rho_\\infty U_\\infty \\Gamma$ per unit span. Lift is set by circulation; circulation is set by the Kutta cusp condition.</div></div>
<div class="calc-card"><div class="card-title">Riemann mapping</div><div class="card-body">Every simply-connected open $U \\subsetneq \\mathbb{C}$ is conformally equivalent to the unit disk. Existence is universal; the explicit map is supplied by Schwarz-Christoffel for polygons and by numerical methods for general domains.</div></div>
</div>

<div class="l-note"><strong>Where this travels next.</strong> Conformal maps and 2D potential flow are the gateway into harmonic functions on Riemann surfaces, the theory of Teichmüller spaces, and the conformal field theories of 2D critical phenomena. On the applied side, every modern computational tool for surface parameterisation — discrete conformal maps, optimal transport on surfaces, conformal mesh editing — is built on the foundations of this lesson. The classical map "shifted circle → airfoil" remains the cleanest analytical example of how a single holomorphic function can solve an entire engineering problem.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bu, karmaşık analizin cebirden geometriye geçtiği derstir.</strong> Şimdiye kadar Cauchy-Riemann denklemlerini fonksiyonların holomorf olup olmadığını test etmek, rezidü teoremiyle eğri integralleri hesaplamak ve tekillikleri sınıflandırmak için kullandık. Bunların hiçbiri görsel bir tablo gerektirmedi. Konform haritalar vurguyu tersine çevirir: temel soru artık görseldir. <em>Holomorf bir fonksiyon bir bölgenin şekline ne yapar?</em> Cevap — sonsuz küçük ölçekte döndürür ve gerer ama açıları bozmaz — karmaşık analizi klasik aerodinamik, elektrostatik, akışkan dinamiği, beyin yüzeyi düzleştirme ve bilgisayar grafiklerinde mesh parametrizasyonunun arkasındaki motora dönüştürür.</p>

<p class="l-text">Plan, konformluğun geometrik tanımıyla başlamak, holomorf = konform olduğunu kanıtlamak, en basit önemsiz aileyi (Möbius dönüşümleri) sınıflandırmak ve sonra iki mühendislik klasiğine özelleşmektir: üst yarı düzlemi diske büken Cayley dönüşümü ve gerçek bir kanat profili kesiti üreten Joukowski dönüşümü. Yol boyunca 2D potansiyel akışı analitik olarak çözeceğiz ve tüm konunun yapısal tavanı olan Riemann Dönüşüm Teoremini ifade edeceğiz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Konform haritanın geometrik tanımını ifade etmeyi ve holomorf + sıfırdan farklı türev ⇒ konform önermesini kanıtlamayı</li>
<li>Mobius dönüşümlerini öteleme, döndürme, ölçekleme ve tersleme bileşimleri olarak sınıflandırmayı</li>
<li>Üst yarı düzlemdeki problemleri birim diskteki problemlere çevirmek için Cayley dönüşümünü kullanmayı</li>
<li>Kaynak çemberi kaydırarak ve ölçekleyerek bir Joukowski kanat profili kurmayı ve geometrisini okumayı</li>
<li>2D sıkışmaz dolanımsız akışın karmaşık potansiyelini yazmayı ve konform haritalarla taşımayı</li>
<li>Tek bir kontur integralinden Kutta-Joukowski teoremiyle ince bir kanat üzerindeki kaldırma kuvvetini hesaplamayı</li>
<li>Riemann Dönüşüm Teoremini ifade etmeyi ve varlık güvencesinin pratikte nerede kullanıldığını fark etmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Konform Haritalar — Geometrik Tanım</h2>

<div class="calc-highlight"><strong>Bir harita, bir noktada açıları koruyorsa o noktada konformdur.</strong> O noktada bir α açısıyla kesişen iki düzgün eğri, harita uygulandıktan sonra hala aynı α açısıyla kesişmelidir. Açının yönelimi de korunur — sola dönüş, sola dönüş olarak kalır — bu da "konformu", yönelimi ters çevirebilecek daha geniş açı koruyan harita fikrinden (anti-konform) ayırır. Uzunlukların korunması gerekmez; yalnızca açıların.</div>

<p class="l-text">Resmi olarak, $f: U \\to V$, $\\mathbb{R}^2 \\cong \\mathbb{C}$'nin açık alt kümeleri arasında düzgün bir harita, $z_0 \\in U$ olsun. $z_0$'dan geçen, sıfırdan farklı tanjant vektörleri $\\dot\\gamma_1(0), \\dot\\gamma_2(0)$ olan herhangi iki düzgün eğri $\\gamma_1, \\gamma_2$ alın. $f$ şu koşulu sağlıyorsa <strong>$z_0$'da konformdur</strong>:</p>

<div class="calc-formula"><div class="formula-label">KONFORM — TANIM</div><div class="formula-main">$$\\angle\\bigl(\\dot{f \\circ \\gamma_1}(0), \\dot{f \\circ \\gamma_2}(0)\\bigr) \\;=\\; \\angle\\bigl(\\dot\\gamma_1(0), \\dot\\gamma_2(0)\\bigr) \\qquad \\text{(isaretli).}$$</div><div class="formula-sub">$z_0$'da herhangi iki eğri arasındaki işaretli açı, $f(z_0)$'da görüntüleri arasındaki işaretli açıya eşittir.</div></div>

<p class="l-text">Dikkat edilmesi gereken iki önemli nokta. <strong>Bir.</strong> Tanım yereldir — tek bir noktada açıları ilgilendirir ve bir harita bazı noktalarda konform olup diğerlerinde başarısız olabilir. <strong>İki.</strong> Konformluk uzunluklar hakkında hiçbir şey söylemez. Karmaşık analizin konform haritaları olan holomorf haritalar her yönü <em>aynı</em> yerel faktör $|f'(z_0)|$ ile ölçekler — bu da onları açı koruyucu yapan şeydir; ama ölçek faktörü noktadan noktaya çılgınca değişebilir, dolayısıyla büyük bir bölgenin şekli her noktada konform olmasına rağmen muazzam ölçüde bozulabilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aci koruma</div><div class="card-body">İki kesişen eğri aynı açıyla kesişmeye devam eder. Temel geometrik talep.</div></div>
<div class="calc-card"><div class="card-title">Yonelim koruma</div><div class="card-body">Saat yönünün tersine bir tanjant vektör çifti, yine saat yönünün tersine kalır. Yansımaları dışarıda bırakır.</div></div>
<div class="calc-card"><div class="card-title">Uzunluklar serbest</div><div class="card-body">Konformluk uzunluklar hakkında sessizdir. Her yön eşit ölçeklenmeli ama ölçeğin kendisi noktadan noktaya farklı olabilir.</div></div>
</div>

<h2 class="lesson-title">2. Holomorfik = Aci-Koruyan</h2>

<p class="l-text">"$z_0$'da holomorf ve türevi sıfır değil" cebirsel özelliği ile "konform" geometrik özelliği arasındaki bağlantı bu dersteki en temiz tek türetmedir. Argümanın iki bileşeni vardır: $z_0$ civarında $f$'nin birinci-derece Taylor açılımı ve sıfırdan farklı herhangi bir karmaşık sayıyla çarpmanın bir döndürme ile bileşke bir tekdüze ölçekleme olduğu gerçeği.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$z_0$ civarinda linearize et</div><div class="step-detail">$f$ $z_0$'da holomorf olduğundan Taylor açılımı $f(z) = f(z_0) + f'(z_0)(z - z_0) + O(|z - z_0|^2)$ verir. Birinci dereceye kadar, $f$ küçük yer değiştirme $\\Delta z = z - z_0$'a $a = f'(z_0)$ sabitiyle çarparak etki eder.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$a$ ile carpma = donme + olcekleme</div><div class="step-detail">$a = |a| \\, e^{i\\arg a}$ yazın. Herhangi bir yer değiştirme $\\Delta z$ için, görüntü $a \\cdot \\Delta z$'nin modülü $|a| \\cdot |\\Delta z|$ ve argümanı $\\arg \\Delta z + \\arg a$'dir. Kelimelerle: her yönü $\\arg a$ kadar döndür ve her uzunluğu $|a|$ kadar ölçekle — her yön için aynı döndürme ve aynı ölçekleme.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Aciler hayatta kalir</div><div class="step-detail">$\\Delta z_1, \\Delta z_2$ aralarında $\\alpha = \\arg \\Delta z_2 - \\arg \\Delta z_1$ açısı yapıyorsa, görüntüleri $(\\arg \\Delta z_2 + \\arg a) - (\\arg \\Delta z_1 + \\arg a) = \\alpha$ açısı yapar. Eklenen $\\arg a$ iptal olur. Açı korunur.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Sifirdan farkli olmak neden onemli</div><div class="step-detail">$f'(z_0) = 0$ ise lineer terim kaybolur ve yerel resim sonraki sıfırdan farklı türev tarafından domine edilir, tipik olarak $f''(z_0)$. O zaman harita yerel olarak $w \\mapsto c w^2$ gibi görünür ki bu $z_0$'daki her açıyı ikiye katlar. Harita düzgün kalır ama tam olarak kritik noktalarda $f' = 0$'da konform olmaktan çıkar.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">TEMEL ESDEGERLIK</div><div class="formula-main">$$f \\text{ } z_0 \\text{'da holomorf} \\;\\text{ ve }\\; f'(z_0) \\ne 0 \\;\\Longleftrightarrow\\; f \\text{ } z_0 \\text{'da konform.}$$</div><div class="formula-sub">Aslında bir cebir parçası olan Cauchy-Riemann denklemleri, tam olarak açı korumanın koşulu çıkmıştır. İki bakış açısı — analitik ve geometrik — eşdeğerdir.</div></div>

<p class="l-text">L3'e geri bakarak şimdi Cauchy-Riemann denklemlerinin gerçel bir harita $(x,y) \\mapsto (u,v)$ olarak görülen $f$'nin Jacobian'ını $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ özel formuna neden zorladığını görüyoruz. Bu tam olarak karmaşık sayı $a + ib$ ile çarpmayı temsil eden matristir. Bu özel yapıya sahip gerçel-lineer haritalar tam olarak ölçeklemelerle bileşke döndürmelerdir ve ölçeklemelerle bileşke döndürmeler açı-koruyan lineer haritalardır. Tüm zincir — CR denklemleri, karmaşık çarpma, benzerlik matrisi, döndürme+ölçekleme, açı koruması — beş farklı yönden görülen tek bir fikirdir.</p>

<div class="calc-graph"><div id="plot-l6-conformal-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik neyi gosteriyor:</strong> sol panel $z$-düzleminde iki dik aile çizgili düzenli bir ızgara (dikey çizgiler $x = \\text{sabit}$ mavi, yatay çizgiler $y = \\text{sabit}$ altın). Sağ panel aynı ızgaranın $f(z) = z^2$ altındaki görüntüsü. Her çizgi bir parabole bükülür ve toplam tabaka gerilir ve katlanır. Ancak orijinden uzak her ızgara kesişim noktasında mavi ve altın eğriler hala $90^\\circ$'de kesişir — dik açı bükülmeye rağmen hayatta kalır. $f'(0) = 0$ olan tek kritik nokta $z = 0$, konformluğun başarısız olduğu yerdir: oradaki açılar korunmak yerine ikiye katlanır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];var traces2=[];
var lines=[-1.5,-1,-0.5,0,0.5,1,1.5];
for(var k=0;k<lines.length;k++){var xv=lines[k];var x=[],y=[],ux=[],uy=[];for(var i=0;i<=80;i++){var yy=-1.6+3.2*i/80;x.push(xv);y.push(yy);ux.push(xv*xv-yy*yy);uy.push(2*xv*yy);}traces.push({x:x,y:y,mode:'lines',name:'x='+xv,line:{color:'#3b82f6',width:1.6},showlegend:(k===0)});traces2.push({x:ux,y:uy,mode:'lines',line:{color:'#3b82f6',width:1.6},showlegend:false,xaxis:'x2',yaxis:'y2'});}
for(var k=0;k<lines.length;k++){var yv=lines[k];var x=[],y=[],ux=[],uy=[];for(var i=0;i<=80;i++){var xx=-1.6+3.2*i/80;x.push(xx);y.push(yv);ux.push(xx*xx-yv*yv);uy.push(2*xx*yv);}traces.push({x:x,y:y,mode:'lines',name:'y='+yv,line:{color:'#f59e0b',width:1.6},showlegend:(k===0)});traces2.push({x:ux,y:uy,mode:'lines',line:{color:'#f59e0b',width:1.6},showlegend:false,xaxis:'x2',yaxis:'y2'});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'Re(z) — giris izgara',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0,0.45],range:[-2,2],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-2,2]},xaxis2:{title:'Re(z²) — goruntu izgara',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0.55,1],range:[-4.5,4.5],scaleanchor:'y2',scaleratio:1},yaxis2:{title:'Im(z²)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-4.5,4.5],anchor:'x2'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-conformal-tr',traces.concat(traces2),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Yansimalar ne olacak?</strong> $z \\mapsto \\bar z$ haritası da her açının büyüklüğünü korur ama işaretini ters çevirir — açı-tersine çevirendir. Bu tür haritalara anti-konform denir. Holomorf değildirler (L3'te $\\bar z$'nin hiçbir noktada karmaşık türevlenebilir olmadığını kanıtladık) — anti-holomorfturlar. Sıkı anlamda konform her zaman açı korumaya ek olarak yönelim korumayı da içerir. Aynı paranın diğer yüzü: $f$ anti-konformdur ancak ve ancak $\\bar f$ konformsa.</div>

<h2 class="lesson-title">3. Mobius Donusumleri — Siniflandirma</h2>

<div class="calc-highlight"><strong>Mobius dönüşümleri en basit önemsiz konform haritalardır.</strong> Riemann küresi $\\hat{\\mathbb{C}} = \\mathbb{C} \\cup \\{\\infty\\}$'nin konform otomorfizmleridir — kürenin kendisine giden her açı koruyan bijeksiyon bunlardan biridir. Bariz yapı taşlarını (öteleme, döndürme, ölçekleme) artı temelden yeni bir oyuncağı — tersleme $z \\mapsto 1/z$ — içerirler ve kürenin herhangi bir konform otomorfizmi bu dört maddeden oluşan bir zincire ayrışır.</div>

<p class="l-text">Bir <strong>Mobius dönüşümü</strong> şu formdaki herhangi bir haritadır:</p>

<div class="calc-formula"><div class="formula-label">MOBIUS DONUSUMU</div><div class="formula-main">$$f(z) \\;=\\; \\frac{az + b}{cz + d}, \\qquad a, b, c, d \\in \\mathbb{C}, \\quad ad - bc \\ne 0.$$</div><div class="formula-sub">Yozlaşmama koşulu $ad - bc \\ne 0$ sabit haritayı dışlar ve $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ matrisinin determinantıdır. Bir skalerle farklı olan iki böyle matris aynı Möbius haritasını üretir.</div></div>

<p class="l-text">Tanımlı olduğu yerde, $f'(z) = (ad - bc)/(cz + d)^2 \\ne 0$, dolayısıyla her Möbius dönüşümü sonlu olduğu her yerde konformdur. Geleneksel olarak $f(-d/c) = \\infty$ ve $f(\\infty) = a/c$, bu da $f$'yi Riemann küresinin bir bijeksiyonuna genişletir. İki Möbius haritasının bileşkesi yine Möbius'tur — grup işlemi katsayı matrislerinin matris çarpımına karşılık gelir, dolayısıyla Möbius dönüşümleri grubu $\\text{PGL}(2, \\mathbb{C}) = \\text{GL}(2, \\mathbb{C}) / \\{\\lambda I\\}$'dir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Oteleme</div><div class="card-body">$z \\mapsto z + b$. Katsayılar $a = d = 1$, $c = 0$. Düzlemi $b$ kadar kaydırır, $\\infty$'i sabit bırakır.</div><div class="card-formula">$f(z) = z + b$</div></div>
<div class="calc-card"><div class="card-title">Donme + olcekleme</div><div class="card-body">$z \\mapsto a z$. $a = |a| e^{i\\arg a}$ ile çarpar: $\\arg a$ kadar döndürür ve $|a|$ kadar ölçekler. 0 ve $\\infty$'i sabit bırakır.</div><div class="card-formula">$f(z) = a z$</div></div>
<div class="calc-card"><div class="card-title">Tersleme</div><div class="card-body">$z \\mapsto 1/z$. Birim çemberin iç ve dışını takas eder; 0'ı $\\infty$'e ve $\\infty$'i 0'a gönderir. Çemberleri doğrulara çeviren tek parça.</div><div class="card-formula">$f(z) = 1/z$</div></div>
<div class="calc-card"><div class="card-title">Genel</div><div class="card-body">Her Möbius haritası yukarıdaki üç yapı taşının sonlu bir bileşkesidir. Ayrıştırma: $f(z) = a/c + (bc-ad)/[c(cz+d)]$.</div><div class="card-formula">$f = T \\circ I \\circ S$</div></div>
</div>

<div class="calc-formula"><div class="formula-label">CEMBER-DOGRU OZELLIGI</div><div class="formula-main">$$\\text{Her Mobius donusumu genellestirilmis cemberleri genellestirilmis cemberlere haritalar.}$$</div><div class="formula-sub">"Genelleştirilmiş çember" bir çember ya da bir doğrudur ($\\infty$'den geçen sonsuz yarıçaplı bir çember). Ötelemeler, döndürmeler ve ölçeklemeler çember ve doğruları ayrı ayrı korur; tersleme birini diğerine çevirebilir.</div></div>

<p class="l-text"><strong>Cember-dogru teoreminin nedeni.</strong> Genel bir çember veya doğrunun denklemi gerçel $A, B, C, D$ için $A(x^2 + y^2) + B x + C y + D = 0$'dır — $A \\ne 0$ ise çember, $A = 0$ ise doğru. $z \\mapsto 1/z$ altında, $z = 1/w$ koyup açın ve paydaları temizleyin: denklem aynı formda $A$ ve $D$ takas edilerek $D(|w|^2) + B \\operatorname{Re}(w) - C \\operatorname{Im}(w) + A = 0$ olur. Yani tersleme "orijinden geçen çemberi" ($D = 0$) "doğruya" ($A = 0$) çevirir ve tersi; başka herhangi bir çemberi başka bir çembere çevirir. Genelleştirilmiş çemberleri açıkça koruyan ötelemeler, döndürmeler ve ölçeklemelerle bileşke alarak aynı sonuç herhangi bir Möbius haritası için elde edilir.</p>

<div class="calc-graph"><div id="plot-l6-mobius-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik neyi gosteriyor:</strong> sol panel $z$-düzleminde birim aralıklı dikdörtgen ızgara. Sağ panel sağ yarı düzlemi birim diske gönderen Cayley-benzeri dönüşüm $f(z) = (z - 1)/(z + 1)$ altında aynı ızgara. Soldaki yatay çizgiler sağda sınır noktası $z = 1 \\mapsto 0$'dan geçen çemberlere dönüşür, dikey çizgiler birim çembere dik dairesel yaylara dönüşür. Orijinal ızgaranın her dik açısı görüntüde korunur — konformluğun iş başında olması — ve her doğru bir genelleştirilmiş çembere haritalanır, tıpkı Möbius teorisinin öngördüğü gibi.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function mob(re,im){var dr=re+1,di=im;var nr=re-1,ni=im;var den=dr*dr+di*di;return [(nr*dr+ni*di)/den,(ni*dr-nr*di)/den];}
var traces1=[],traces2=[];
var xs=[0.2,0.5,1,1.5,2,3];
for(var k=0;k<xs.length;k++){var xv=xs[k];var lx=[],ly=[],ix=[],iy=[];for(var i=0;i<=120;i++){var yy=-3+6*i/120;lx.push(xv);ly.push(yy);var m=mob(xv,yy);ix.push(m[0]);iy.push(m[1]);}traces1.push({x:lx,y:ly,mode:'lines',name:'x='+xv,line:{color:'#3b82f6',width:1.5},showlegend:(k===0)});traces2.push({x:ix,y:iy,mode:'lines',line:{color:'#3b82f6',width:1.5},showlegend:false,xaxis:'x2',yaxis:'y2'});}
var ys=[-2.5,-1.5,-0.7,0,0.7,1.5,2.5];
for(var k=0;k<ys.length;k++){var yv=ys[k];var lx=[],ly=[],ix=[],iy=[];for(var i=0;i<=120;i++){var xx=0.05+3.5*i/120;lx.push(xx);ly.push(yv);var m=mob(xx,yv);ix.push(m[0]);iy.push(m[1]);}traces1.push({x:lx,y:ly,mode:'lines',name:'y='+yv,line:{color:'#f59e0b',width:1.5},showlegend:(k===0)});traces2.push({x:ix,y:iy,mode:'lines',line:{color:'#f59e0b',width:1.5},showlegend:false,xaxis:'x2',yaxis:'y2'});}
var circ_x=[],circ_y=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;circ_x.push(Math.cos(th));circ_y.push(Math.sin(th));}
traces2.push({x:circ_x,y:circ_y,mode:'lines',line:{color:'rgba(255,255,255,0.45)',width:1.5,dash:'dot'},showlegend:false,xaxis:'x2',yaxis:'y2'});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'Re(z) — giris izgara',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0,0.45],range:[0,3.2],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-3,3]},xaxis2:{title:'Re(f) — birim disk goruntusu',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0.55,1],range:[-1.15,1.15],scaleanchor:'y2',scaleratio:1},yaxis2:{title:'Im(f)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.15,1.15],anchor:'x2'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-mobius-tr',traces1.concat(traces2),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Uc nokta bir Mobius haritasini belirler.</strong> Riemann küresi üzerinde herhangi iki sıralı farklı nokta üçlüsü $(z_1, z_2, z_3)$ ve $(w_1, w_2, w_3)$ verildiğinde, $z_i \\mapsto w_i$ gönderen tek bir Möbius haritası vardır. Açık formül çapraz oran özdeşliğidir: $(w - w_1)(w_2 - w_3) / [(w - w_3)(w_2 - w_1)] = (z - z_1)(z_2 - z_3) / [(z - z_3)(z_2 - z_1)]$, bu da $w$ için $z$'nin bir Möbius haritası olarak çözülebilir. Bu, "şu üç sınır noktasını bu üç sınır noktasına gönderen Möbius dönüşümünü bulun" probleminde mühendisin reçetesidir.</div>

<h2 class="lesson-title">4. Cayley Donusumu</h2>

<p class="l-text">Sinyal işlemeden sayısal analize her yerde görüldüğü için kendi adını hak eden özel bir Möbius dönüşümü: <strong>Cayley dönüşümü</strong></p>

<div class="calc-formula"><div class="formula-label">CAYLEY DONUSUMU</div><div class="formula-main">$$C(z) \\;=\\; \\frac{z - i}{z + i}, \\qquad C^{-1}(w) \\;=\\; i \\, \\frac{1 + w}{1 - w}.$$</div><div class="formula-sub">Üst yarı düzlemi $\\{\\operatorname{Im} z > 0\\}$ birim disk $\\{|w| < 1\\}$'e bijektif olarak gönderir, gerçel eksen birim çembere gider (eksi $w = 1$ noktası).</div></div>

<p class="l-text"><strong>Yari-duzlem-disk ozelliginin dogrulanmasi.</strong> $z = x + iy$ ve $y > 0$ için,</p>

<div class="calc-formula"><div class="formula-label">MODUL HESABI</div><div class="formula-main">$$|C(z)|^2 \\;=\\; \\frac{|z - i|^2}{|z + i|^2} \\;=\\; \\frac{x^2 + (y - 1)^2}{x^2 + (y + 1)^2}.$$</div><div class="formula-sub">Pay ve payda yalnızca açılımdaki çapraz terim $\\mp 2 y$'nin işaretiyle farklıdır. $y > 0$ için pay kesinlikle daha küçüktür, dolayısıyla $|C(z)| < 1$.</div></div>

<p class="l-text">Doğrudan hesaplama: pay eksi payda $-4y$'ye eşittir ki bu $y > 0$ için negatiftir. Yani üst yarı düzlemde $|C(z)|^2 < 1$, gerçel eksende ($y = 0$) $= 1$, ve aşağıda $> 1$ — tam istenen davranış.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Gercel eksen nereye gider</div><div class="step-detail">Gerçel $x \\in \\mathbb{R}$: $C(x) = (x - i)/(x + i)$. Pay ve paydanın modülü aynı $\\sqrt{x^2 + 1}$'dir, dolayısıyla $|C(x)| = 1$. Gerçel eksen birim çembere gider.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Uc ornek nokta</div><div class="step-detail">$C(0) = -1$, $C(\\infty) = 1$ ($z \\to \\infty$ iken $(z - i)/(z + i)$'nin limiti), ve $C(i) = 0$. Yarı düzlemin referans merkezi diskin merkezine gider; gerçel eksenin iki uç noktası birim çemberin karşılıklı kutuplarına gider.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Tersi</div><div class="step-detail">$C^{-1}(w) = i(1 + w)/(1 - w)$. $0 \\mapsto i$, $-1 \\mapsto 0$, $1 \\mapsto \\infty$. Yerine koyarak $C(C^{-1}(w)) = w$ doğrulayın.</div></div></div>
</div>

<div class="calc-graph"><div id="plot-l6-cayley-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik neyi gosteriyor:</strong> sol panel üst yarı düzlemde yatay çizgiler $y = \\text{sabit} > 0$ (mavi) ve dikey çizgiler $x = \\text{sabit}$ (altın) örgüsüdür. Sağ panel Cayley dönüşümü $C(z) = (z - i)/(z + i)$ altında aynı örgünün görüntüsüdür. Soldaki sınırsız şerit sağda açık birim diske çöker. Yatay çizgiler içeriden birim çembere teğet $w = 1$'den geçen çemberlere dönüşür, dikey çizgiler $-1$'i $1$'e bağlayan dairesel yaylara dönüşür. Yarı düzlemin merkezindeki referans noktası $z = i$, harita uygulandıktan sonra diskin merkezinde $w = 0$'da yer alır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function cay(re,im){var nr=re,ni=im-1;var dr=re,di=im+1;var den=dr*dr+di*di;return [(nr*dr+ni*di)/den,(ni*dr-nr*di)/den];}
var traces1=[],traces2=[];
var ys=[0.2,0.5,1,1.5,2,3,5];
for(var k=0;k<ys.length;k++){var yv=ys[k];var lx=[],ly=[],ix=[],iy=[];for(var i=0;i<=160;i++){var xx=-4+8*i/160;lx.push(xx);ly.push(yv);var m=cay(xx,yv);ix.push(m[0]);iy.push(m[1]);}traces1.push({x:lx,y:ly,mode:'lines',name:'y='+yv,line:{color:'#3b82f6',width:1.5},showlegend:(k===0)});traces2.push({x:ix,y:iy,mode:'lines',line:{color:'#3b82f6',width:1.5},showlegend:false,xaxis:'x2',yaxis:'y2'});}
var xs=[-3,-2,-1,-0.5,0,0.5,1,2,3];
for(var k=0;k<xs.length;k++){var xv=xs[k];var lx=[],ly=[],ix=[],iy=[];for(var i=0;i<=160;i++){var yy=0.02+5.5*i/160;lx.push(xv);ly.push(yy);var m=cay(xv,yy);ix.push(m[0]);iy.push(m[1]);}traces1.push({x:lx,y:ly,mode:'lines',name:'x='+xv,line:{color:'#f59e0b',width:1.5},showlegend:(k===0)});traces2.push({x:ix,y:iy,mode:'lines',line:{color:'#f59e0b',width:1.5},showlegend:false,xaxis:'x2',yaxis:'y2'});}
var cx=[],cy=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;cx.push(Math.cos(th));cy.push(Math.sin(th));}
traces2.push({x:cx,y:cy,mode:'lines',line:{color:'rgba(255,255,255,0.45)',width:1.5,dash:'dot'},showlegend:false,xaxis:'x2',yaxis:'y2'});
traces1.push({x:[-4,4],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.45)',width:1.5,dash:'dot'},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'Re(z) — ust yari duzlem',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0,0.45],range:[-4,4],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[0,5.5]},xaxis2:{title:'Re(w) — birim disk',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0.55,1],range:[-1.15,1.15],scaleanchor:'y2',scaleratio:1},yaxis2:{title:'Im(w)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.15,1.15],anchor:'x2'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-cayley-tr',traces1.concat(traces2),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">CAYLEY DONUSUMU MUHENDISLIKTE NEREDE GORUNUR</div><div class="example-body"><strong>1. Sayisal sinyal islemede bilineer (Tustin) donusum.</strong> Sürekli zamanlı bir lineer filtre $H(s)$, $s$'in yerine $(2/T)(z - 1)/(z + 1)$ — tam olarak ters Cayley dönüşümünün ölçeklenmiş hali — konularak ayrık zamanlı bir filtre $H_d(z)$'ye dönüştürülür. Harita açık sol yarı düzlemi (sürekli zaman kararlı bölge) açık birim diske (ayrık zaman kararlı bölge) taşır, böylece bilineer dönüşüm kararlılığı otomatik olarak korur.<br><br><strong>2. ODE cozucu kararlilik bolgeleri.</strong> Tek adımlı bir ODE integratörünün "A-kararlılığı", kararlılık fonksiyonunun açık sol yarı düzlemi nereye gönderdiğine göre belirlenir. Cayley soruyu "$S(z)$ açık birim diski nereye gönderir" şekline çevirir ki bu geometrik olarak çizmesi ve doğrulaması daha kolaydır.<br><br><strong>3. Oz-eslenik operatorlerin Cayley donusumu.</strong> Fonksiyonel analizde öz-eşlenik bir $A$, $U = (A - iI)(A + iI)^{-1}$ aracılığıyla üniter bir $U$'ya karşılık gelir ve ters harita birim çemberden bir nokta hariç gerçel eksene geri taşır — yarı düzlem-disk resminin operatör-teorik versiyonu, kuantum mekaniğinde yoğun şekilde kullanılır.</div></div>

<h2 class="lesson-title">5. Joukowski Donusumu</h2>

<div class="calc-highlight"><strong>Joukowski dönüşümü klasik aerodinamiğin iş atıdır.</strong> Basit formül $J(z) = z + 1/z$'yi al ve $z$-düzleminde bir çembere uygula. Çember orijinde merkezli birim çemberse, görüntü bir yarıktır. Çember biraz merkezden kaydırılmış ama $z = 1$ noktasından hala geçiyorsa, görüntü gerçek bir kanat profili gibi görünen asimetrik kapalı bir eğridir — firar kenarında sivri, hücum kenarında yuvarlak, temiz üst ve alt yüzeyler. Bu, Wright kardeşlerin çağdaşlarının ilk motorlu uçak kanatlarını tasarlamak için kullandığı geometridir.</div>

<div class="calc-formula"><div class="formula-label">JOUKOWSKI DONUSUMU</div><div class="formula-main">$$J(z) \\;=\\; z + \\frac{1}{z}, \\qquad J'(z) \\;=\\; 1 - \\frac{1}{z^2}.$$</div><div class="formula-sub">$\\mathbb{C} \\setminus \\{0\\}$ üzerinde holomorf, $J'(z) = 0$ olan iki kritik nokta $z = \\pm 1$ dışında her yerde konform. Bu noktalarda açılar ikiye katlanır — kanat profilinin firar ve hücum kenarı sivriliklerine dönüşürler.</div></div>

<p class="l-text"><strong>1. Adim — birim cemberin goruntusu.</strong> $z = e^{i\\theta}$ için, $J(e^{i\\theta}) = e^{i\\theta} + e^{-i\\theta} = 2 \\cos\\theta$. Birim çember gerçel eksende kapalı parça $[-2, 2]$'ye gider, $\\theta$ tek tur attığında iki kez geçilir. Harita çemberi bir düz plakaya çöker — en basit "sonsuz ince" kanat modeli olarak kullanışlıdır.</p>

<p class="l-text"><strong>2. Adim — orijinde merkezli $r > 1$ yaricapli cember.</strong> $z = r e^{i\\theta}$ için, $J(z) = (r + 1/r) \\cos\\theta + i (r - 1/r) \\sin\\theta$. Bu yarı eksenleri $(r + 1/r)$ (yatay) ve $(r - 1/r)$ (dikey) olan bir elipstir. $r \\to 1^+$ iken dikey yarı eksen sıfıra düşer ve elips 1. adımdaki parçaya yozlaşır. $r$ büyüdükçe elips daha çembersel olur.</p>

<p class="l-text"><strong>3. Adim — kanat profili kurulumu.</strong> Orijinden kaydırılmış öyle bir çember alın ki kritik nokta $z = 1$'den hala geçsin ama diğer kritik nokta $z = -1$'i içine alsın. Standart reçete:</p>

<div class="calc-formula"><div class="formula-label">JOUKOWSKI KANAT PROFILI CEMBERI</div><div class="formula-main">$$\\text{Merkez: } z_c = -\\mu + i \\nu, \\qquad \\text{Yaricap: } R = \\sqrt{(1 + \\mu)^2 + \\nu^2}.$$</div><div class="formula-sub">Küçük pozitif $\\mu$ sonuç kanat profilinin kalınlığını kontrol eder; küçük pozitif $\\nu$ kambur (ortalama çizginin eğriliği) kontrol eder. Çemberin tam olarak $z = 1$'den geçmesi gerekir ki harita uygulandıktan sonra burası keskin firar kenarı olsun.</div></div>

<p class="l-text">Somut olarak: $\\mu = 0.1, \\nu = 0$ ile kaynak çember $-0.1$'de merkezli ve $1.1$ yarıçaplıdır, $z = 1$'den geçer ($1 + 0.1 = 1.1 = R$ olduğundan) ve $z = -1$'i içine alır ($-1$'den $-0.1$'e uzaklık $0.9 < 1.1$ olduğundan). Görüntü simetrik bir kanat profilidir — düz plaka $\\mu = 0$ durumundan daha kalın, $J(1) = 2$'de firar kenarı sivriliği ve hücum kenarı ucu $J(-1.2)$ civarındadır. Kambur $\\nu > 0$ eklemek üst yüzeyi alt yüzeye göre eğer ve sıfır hücum açısında kaldırma üreten asimetrik "kamburlu" bir kanat profili verir.</p>

<div class="calc-graph"><div id="plot-l6-joukowski-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik neyi gosteriyor:</strong> sol panel $z$-düzlemindeki kaynak çember — $z_c = -0.1 + 0.08i$'de hafif merkezden kaydırılmış, yarıçap çember kritik nokta $z = 1$'den geçecek şekilde seçilmiş. Sağ panel aynı çemberin Joukowski görüntüsü $J(z) = z + 1/z$, $\\theta$ $[0, 2\\pi)$ boyunca koştukça izlenmiş. Görüntü eğrisi $J(1) = 2$'de keskin sivri firar kenarı, $J(-1.2) \\approx -2.03$ civarında yuvarlak hücum kenarı ve sanal kayma $\\nu = 0.08$'den miras alınan küçük pozitif kambur ile kapalı asimetrik bir kanat profilidir. Bağlam için kesik birim çember ve $[-2, 2]$ parçası çizilmiştir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function jouk(re,im){var den=re*re+im*im;var invR=re/den,invI=-im/den;return [re+invR,im+invI];}
var mu=0.1,nu=0.08;var cx=-mu,cy=nu;var R=Math.sqrt((1+mu)*(1+mu)+nu*nu);
var circ_x=[],circ_y=[],air_x=[],air_y=[];
for(var i=0;i<=400;i++){var th=2*Math.PI*i/400;var zr=cx+R*Math.cos(th),zi=cy+R*Math.sin(th);circ_x.push(zr);circ_y.push(zi);var j=jouk(zr,zi);air_x.push(j[0]);air_y.push(j[1]);}
var refc_x=[],refc_y=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;refc_x.push(Math.cos(th));refc_y.push(Math.sin(th));}
var trace_circ={x:circ_x,y:circ_y,mode:'lines',name:'kaynak cember',line:{color:'#3b82f6',width:2.4}};
var trace_ref={x:refc_x,y:refc_y,mode:'lines',line:{color:'rgba(255,255,255,0.40)',width:1.2,dash:'dot'},showlegend:false};
var trace_crit={x:[1,-1],y:[0,0],mode:'markers',name:'z = ±1',marker:{size:9,color:'#f59e0b',symbol:'x'},showlegend:false};
var trace_air={x:air_x,y:air_y,mode:'lines',line:{color:'#3b82f6',width:2.4},showlegend:false,xaxis:'x2',yaxis:'y2',fill:'toself',fillcolor:'rgba(59,130,246,0.10)'};
var trace_slit={x:[-2,2],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.40)',width:1.2,dash:'dot'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var trace_te={x:[2,-2],y:[0,0],mode:'markers',name:'kenarlar',marker:{size:9,color:'#f59e0b',symbol:'x'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'Re(z) — kaynak duzlem',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0,0.45],range:[-1.6,1.6],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.6,1.6]},xaxis2:{title:'Re(J) — kanat duzlemi',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0.55,1],range:[-2.4,2.4],scaleanchor:'y2',scaleratio:1},yaxis2:{title:'Im(J)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-2.4,2.4],anchor:'x2'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-joukowski-tr',[trace_circ,trace_ref,trace_crit,trace_air,trace_slit,trace_te],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Firar kenari sivriligi neden olur?</strong> $J'(z) = 1 - 1/z^2$, $z = 1$ ve $z = -1$'de sıfırlanır. $z = 1$ civarında, Taylor açılımı $J(z) \\approx 2 + (z - 1)^2$ verir, yani yerel davranış karesel — açılar ikiye katlanır. $z = 1$'i $\\beta$ açısıyla kesen düzgün bir eğri, $J(z) = 2$'de $2\\beta$ köşeli bir eğriye dönüşür. Kaynak çember kendine teğet (iç açı $\\pi$) olarak $z = 1$'den geçerse, görüntünün köşesi $2\\pi$'dir ki bu geometrik olarak gerçek bir kanat profilinin sivriliğidir. Keskin firar kenarının analitik kökeni budur.</div>

<h2 class="lesson-title">6. 2D Potansiyel Akis — Karmasik Potansiyel</h2>

<p class="l-text">Konform haritalar, onları fiziksel bir PDE'ye bağladığımız anda yalnızca bir merak değil, bir hesaplama motoru haline gelir. En temiz ortam iki boyutlu sıkışmaz dolanımsız akışkan akışıdır — viskozite geri eklenmeden önce klasik aerodinamiğin kullandığı model.</p>

<div class="calc-formula"><div class="formula-label">2D SIKISMAZ DOLANIMSIZ AKIS</div><div class="formula-main">$$\\nabla \\cdot \\mathbf{v} \\;=\\; 0, \\qquad \\nabla \\times \\mathbf{v} \\;=\\; 0.$$</div><div class="formula-sub">Kaynak veya yutak yok (kütle korunur) ve girdap yok (dönüş yok). 2D'de bu iki koşul $\\mathbf{v}$'yi bir skaler potansiyelin gradyanı VE bir akım fonksiyonunun rotasyoneli olarak yazmaya yeter.</div></div>

<p class="l-text"><strong>Hiz potansiyeli $\\phi$.</strong> Dolanımsız demek $\\mathbf{v} = \\nabla \\phi$ skaler $\\phi(x,y)$ için. Sıkışmazlıkla birleştirildiğinde, $\\nabla \\cdot \\nabla \\phi = \\Delta \\phi = 0$ — yani $\\phi$ harmoniktir. <strong>Akim fonksiyonu $\\psi$.</strong> Sıkışmazlık $\\mathbf{v}$'nin $(\\partial_y \\psi, -\\partial_x \\psi)$ olarak da yazılabileceği anlamına gelir. Dolanımsızlıkla birleştirildiğinde, $\\Delta \\psi = 0$ — yani $\\psi$ da harmoniktir ve seviye kümeleri $\\psi = \\text{sabit}$ akışkan parçacıklarının seyahat ettiği akım çizgileridir.</p>

<div class="calc-formula"><div class="formula-label">KARMASIK POTANSIYEL</div><div class="formula-main">$$\\Omega(z) \\;=\\; \\phi(x,y) + i \\, \\psi(x,y), \\qquad \\frac{d\\Omega}{dz} \\;=\\; u - i v.$$</div><div class="formula-sub">$\\phi$ ve $\\psi$ Cauchy-Riemann denklemleriyle harmonik eşleniklerdir (çünkü $u = \\phi_x = \\psi_y$ ve $v = \\phi_y = -\\psi_x$ aynı hız alanını kodlar). Yani $\\Omega(z)$ otomatik olarak holomorftur ve karmaşık türev $d\\Omega/dz$ eşlenik hız $u - iv$'dir.</div></div>

<p class="l-text">Getiri şaşırtıcıdır: herhangi bir holomorf fonksiyon otomatik olarak geçerli bir 2D viskozitesiz akıştır. Sevdiğiniz $\\Omega$'yu seçin, bir akışınız olur. Daha da iyisi — ve dersin can alıcı noktası budur — eğer $\\Omega_0(z)$ basit bir geometride (disk gibi) bir akışsa ve $w = f(z)$ o basit geometriden karmaşık bir geometriye (kanat profilinin dışı gibi) konform bir haritaysa, o zaman $\\Omega_0(f^{-1}(w))$ otomatik olarak karmaşık geometride bir akıştır. Konform haritalar akış çözümlerini <em>taşır</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tekduze akis</div><div class="card-body">$\\Omega(z) = U z$, $U > 0$ gerçel. O zaman $\\phi = U x$, $\\psi = U y$. Hız $(U, 0)$ — sabit yatay akış.</div><div class="card-formula">$\\Omega = U z$</div></div>
<div class="calc-card"><div class="card-title">Nokta kaynagi</div><div class="card-body">$\\Omega(z) = (Q / 2\\pi) \\log z$. Toplam akı $Q$ ile radyal dışa doğru akış. Akım çizgileri orijinden geçen ışınlar.</div><div class="card-formula">$\\Omega = (Q/2\\pi)\\log z$</div></div>
<div class="calc-card"><div class="card-title">Nokta girdabi</div><div class="card-body">$\\Omega(z) = -(i\\Gamma / 2\\pi) \\log z$. Toplam dolanım $\\Gamma$ ile dolanan akış. Akım çizgileri çemberler.</div><div class="card-formula">$\\Omega = -(i\\Gamma/2\\pi)\\log z$</div></div>
<div class="calc-card"><div class="card-title">Silindir etrafinda akis</div><div class="card-body">$\\Omega(z) = U(z + R^2/z)$. Sonsuzda tekdüze $U$, $|z| = R$ çemberinde sıfır normal akış. $\\psi = 0$ akım çizgisi hem gerçel ekseni hem de silindir sınırını izler.</div><div class="card-formula">$\\Omega = U(z + R^2/z)$</div></div>
</div>

<div class="calc-formula"><div class="formula-label">AKIS TASIMA TEOREMI</div><div class="formula-main">$$\\Omega_0 \\text{ } D_0 \\text{'da bir akis ve } f: D \\to D_0 \\text{ konform ise } \\Omega(z) = \\Omega_0(f(z)) \\text{ } D \\text{'de bir akistir.}$$</div><div class="formula-sub">Holomorf haritaların bileşkesi holomorftur, dolayısıyla $\\Omega = \\Omega_0 \\circ f$ yine bir karmaşık potansiyeldir. $D$'deki akım çizgileri konform harita aracılığıyla $D_0$'dakilerden geri çekilir — ve hız alanına dik açıyla otomatik olarak geçerler çünkü konform haritalar açıları korur.</div></div>

<p class="l-text"><strong>Kaldirmayi dogrudan okumak.</strong> 2D akışta kesiti $C$ olan bir gövdenin birim uzunluk başına aerodinamik kuvveti Blasius teoremi ile verilir: $F_x - i F_y = (i \\rho / 2) \\oint_C (d\\Omega/dz)^2 \\, dz$. Kutta-Joukowski teoremi başlık sonucunu çıkarır:</p>

<div class="calc-formula"><div class="formula-label">KUTTA-JOUKOWSKI KALDIRMA</div><div class="formula-main">$$L \\;=\\; \\rho_\\infty \\, U_\\infty \\, \\Gamma \\qquad (\\text{birim uzunluk basina kaldirma}).$$</div><div class="formula-sub">$\\rho_\\infty$ — serbest akış yoğunluğu, $U_\\infty$ — serbest akış hızı, $\\Gamma$ — kanat profili etrafındaki toplam dolanım. Kaldırma dolanımla orantılıdır. Kanat profillerinin sivri firar kenarıyla tasarlanmasının tüm nedeni (Kutta koşulu) tek bir $\\Gamma$'yı sabitlemektir, bu da kaldırmayı belirler.</div></div>

<div class="calc-graph"><div id="plot-l6-flow-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Bu grafik neyi gosteriyor:</strong> 5. bölümdeki Joukowski kanat profilinin etrafındaki 2D viskozitesiz akışın akım çizgileri $\\psi = \\text{sabit}$. Karmaşık potansiyel kaynak çember düzleminde $\\Omega(\\zeta) = U(\\zeta + R^2/\\zeta - (i\\Gamma/2\\pi)\\log\\zeta)$, dolanım Kutta koşulunu (firar kenarından akışın düzgün ayrılmasını) sağlayacak şekilde seçilmiştir. Akım çizgileri $J(z) = z + 1/z$ aracılığıyla kanat düzlemine taşınır. Üst akım çizgilerinin kanat üstünde sıkıştığına (yüksek hız, düşük basınç) ve alt akım çizgilerinin yayıldığına (düşük hız, yüksek basınç) dikkat edin — bir kanat profilinin nasıl kaldırma ürettiğinin ders kitabı resmi.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function jouk(re,im){var den=re*re+im*im;var invR=re/den,invI=-im/den;return [re+invR,im+invI];}
var mu=0.1,nu=0.08;var cx=-mu,cy=nu;var R=Math.sqrt((1+mu)*(1+mu)+nu*nu);
var U=1.0;var alpha=0.0;var beta=Math.atan2(nu,1+mu);var Gamma=4*Math.PI*U*R*Math.sin(alpha+beta);
function psi(zr,zi){var dr=zr-cx,di=zi-cy;var rsq=dr*dr+di*di;var r=Math.sqrt(rsq);var th=Math.atan2(di,dr);return U*(r-R*R/r)*Math.sin(th-alpha)-(Gamma/(2*Math.PI))*Math.log(r/R);}
var N=130;var Z=[];
for(var i=0;i<N;i++){var row=[];var yv=-2.4+4.8*i/(N-1);for(var j=0;j<N;j++){var xv=-2.4+4.8*j/(N-1);var dr=xv-cx,di=yv-cy;if(dr*dr+di*di<R*R+1e-6){row.push(null);continue;}row.push(psi(xv,yv));}Z.push(row);}
var airx=[],airy=[];for(var i=0;i<=400;i++){var th=2*Math.PI*i/400;var zr=cx+R*Math.cos(th),zi=cy+R*Math.sin(th);var j=jouk(zr,zi);airx.push(j[0]);airy.push(j[1]);}
var gridx=[],gridy=[];for(var i=0;i<N;i++){var yv=-2.4+4.8*i/(N-1);gridx.push([]);gridy.push([]);for(var j=0;j<N;j++){var xv=-2.4+4.8*j/(N-1);var dr=xv-cx,di=yv-cy;if(dr*dr+di*di<R*R){gridx[i].push(null);gridy[i].push(null);}else{var jp=jouk(xv,yv);gridx[i].push(jp[0]);gridy[i].push(jp[1]);}}}
var contour={type:'contour',x:gridx[0],y:gridy.map(function(r){return r[0];}),z:Z,contours:{coloring:'lines',start:-3,end:3,size:0.18},line:{width:1.3,color:'#3b82f6'},colorscale:[[0,'#1e40af'],[0.5,'#3b82f6'],[1,'#93c5fd']],showscale:false,connectgaps:false,name:'ψ = sabit'};
var trace_air={x:airx,y:airy,mode:'lines',line:{color:'#f59e0b',width:2.2},fill:'toself',fillcolor:'rgba(245,158,11,0.15)',name:'kanat'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(J) — kiris yonu',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-3.5,3.5],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(J) — kanat acikligi',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-2,2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-flow-tr',[contour,trace_air],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ORNEK — KAMBURLU JOUKOWSKI KANAT PROFILI UZERINDE KALDIRMA</div><div class="example-body">5. bölümdeki kanat profilini ($\\mu = 0.1$, $\\nu = 0.08$) $U = 30$ m/s serbest akış hızında ve hava yoğunluğu $\\rho = 1.225$ kg/m³'te alın. Kutta koşulu $\\Gamma = 4 \\pi U R \\sin(\\alpha + \\beta)$'yi zorlar, burada $\\beta = \\arctan(\\nu / (1 + \\mu)) \\approx 0.073$ rad (kambur açısı) ve $\\alpha$ hücum açısıdır. $\\alpha = 0$'da — düz uçma — kambur tek başına $\\Gamma = 4 \\pi (30) (1.103) (0.073) \\approx 30.4$ m²/s üretir, dolayısıyla birim uzunluk başına kaldırma $L = (1.225)(30)(30.4) \\approx 1117$ N/m. $\\alpha$'yı $5°$ artırın, kaldırma kabaca üçe katlanır. Tüm hesaplama, dikkatle seçilmiş bir konform haritaya uygulanan tek bir kontur integralidir.</div></div>

<h2 class="lesson-title">7. Riemann Donusum Teoremi</h2>

<div class="calc-highlight"><strong>Konform haritalama yapisinin doruk noktasi.</strong> Şimdiye kadar belirli konform haritaları elle inşa ettik — Cayley dönüşümü, Joukowski dönüşümü, üç sınır noktasını taşıyan bilineer haritalar. Riemann Dönüşüm Teoremi çok daha güçlü bir şey vaat eder: <em>herhangi</em> güzel bir 2D bölge (basit bağlı, açık ve $\\mathbb{C}$'nin tamamı değil) birim diske konform olarak haritalanabilir. İstisna yok, "kötü" şekillerin listesi yok — teorem evrenseldir.</div>

<div class="calc-formula"><div class="formula-label">RIEMANN DONUSUM TEOREMI</div><div class="formula-main">$$\\text{Her basit bagli acik } U \\subsetneq \\mathbb{C}, \\text{ acik birim disk } \\mathbb{D} \\text{ ile konform esdegerdir.}$$</div><div class="formula-sub">"Konform eşdeğer" demek holomorf tersli holomorf bijeksiyon $f: U \\to \\mathbb{D}$ var demek. Bir taban noktası ve yön sabitlendikten sonra harita diskin bir Möbius otomorfizmasına kadar tektir.</div></div>

<p class="l-text"><strong>"Basit bagli" burada ne demek.</strong> $U$ açık, bağlantılı ve delik yok — $U$ içindeki herhangi kapalı bir döngü $U$'yu terk etmeden sürekli olarak bir noktaya küçültülebilir. Birim disk, üst yarı düzlem, yarık düzlem $\\mathbb{C} \\setminus (-\\infty, 0]$, herhangi bir Jordan eğrisinin içi, bir Joukowski kanat profilinin dışı — hepsi basit bağlı. Bir halka $\\{1 < |z| < 2\\}$ basit bağlı <em>değil</em>: iç sınır etrafındaki bir döngü küçültülemez. Dolayısıyla teorem bir halkadan diske konform harita söz vermez — ve gerçekten böyle bir harita yoktur.</p>

<p class="l-text"><strong>$\\mathbb{C}$'nin neden disarida kaldigi.</strong> Konform bir harita $\\mathbb{C} \\to \\mathbb{D}$, sınırlı bir tam fonksiyon olurdu. Liouville (L3) her sınırlı tam fonksiyonun sabit olduğunu söyler. Bir sabit bijeksiyon değildir. Yani tüm düzlem tek istisnadır — her <em>uygun</em> basit bağlı açık alt küme diske konform eşdeğerdir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Varlik guvencesi</div><div class="card-body">Her uygun $U$ için $f$ haritası vardır. Teorem bir varlık ifadesidir; haritayı yazmaz.</div></div>
<div class="calc-card"><div class="card-title">Disk otomorfizmasina kadar teklik</div><div class="card-body">Bir taban noktası $z_0 \\in U$ seçin ve $f(z_0) = 0, f'(z_0) > 0$ talep edin. O zaman $f$ tek olarak belirlenir. Bu normalizasyonlar olmadan üç parametreli bir aileniz olur.</div></div>
<div class="calc-card"><div class="card-title">Sinir davranisi</div><div class="card-body">Carathéodory teoremi (1913): $U$'nun sınırı bir Jordan eğrisi ise, $f$ kapanışların bir homeomorfizmasına sürekli olarak genişler. Sınır noktaları temiz şekilde sınır noktalarına gider.</div></div>
<div class="calc-card"><div class="card-title">Burada kanit yok</div><div class="card-body">Orijinal varlık kanıtı normal aileler ve Schwarz lemmasını kullanır — standart yüksek lisans malzemesi. Sonucu içe aktarır ve kullanırız.</div></div>
</div>

<div class="calc-example"><div class="example-label">SCHWARZ-CHRISTOFFEL — YAPICI BIR ORNEK</div><div class="example-body">Köşeleri $w_1, \\dots, w_n$ ve iç açıları $\\alpha_1 \\pi, \\dots, \\alpha_n \\pi$ olan bir çokgenin özel durumu için, üst yarı düzlemden çokgenin içine olan konform harita açık biçimde $f(z) = A + C \\int_{z_0}^z \\prod_{k=1}^n (\\zeta - x_k)^{\\alpha_k - 1} d\\zeta$ olarak yazılır, burada $x_k = f^{-1}(w_k)$ köşelerin gerçel eksendeki (bilinmeyen) ön-görüntüleridir. Bilinmeyen $x_k$'ler kenar uzunluğu oranlarına bağlı küçük bir lineer olmayan sistemi çözerek belirlenir. Sayısal Schwarz-Christoffel araç takımları (Driscoll'un MATLAB SC araç takımı en yaygın kullanılan) sistemi ~100 kenara kadar çokgenler için güvenilir şekilde çözer — gerçek bir mühendislik probleminin çokgensel bir bölgede diske haritalanması gerektiğinde pratik iş atı.</div></div>

<h2 class="lesson-title">8. Modern Uygulamalar</h2>

<p class="l-text">Konform haritalar birkaç mühendislik ve bilim alanında sessiz bir omurga oluşturur. Hiçbiri makine öğrenmesi sloganlarında görünmez ama her biri gerçek, üretimdeki bir kullanım durumudur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aerodinamik</div><div class="card-body">Joukowski kanat profilleri her akışkanlar ders kitabında kaldırmanın ilk analitik modelidir. Gerçek kanat profilleri — NACA, süperkritik, transonik — artık sayısaldır, ama nitel basınç dağılımı ve Kutta-Joukowski kaldırma formülü doğru kalır.</div></div>
<div class="calc-card"><div class="card-title">Elektrostatik & isi</div><div class="card-body">2D Laplace denklemi yüksüz bir bölgede elektrik potansiyelini ve ısı kaynağı olmayan kararlı durum sıcaklığını yönetir. Konform haritalar zor bir geometriyi (garip elektrotlu kapasitör) basit bir geometriye (paralel plakalar) taşır ki çözüm tek bir cebir satırıdır.</div></div>
<div class="calc-card"><div class="card-title">Beyin goruntuleme</div><div class="card-body">Beyin korteksi 3D'ye gömülü kıvrımlı bir 2D yüzeydir. Konform düzleştirme (Gu, Vemuri, Sapiro, Yau) korteksi yerel açı ilişkilerini koruyarak bir diske haritalar, böylece korteks kalınlığı, eğriliği ve aktivasyon desenleri düz bir koordinat sisteminde hastalar arasında karşılaştırılabilir.</div></div>
<div class="calc-card"><div class="card-title">Bilgisayar grafikleri</div><div class="card-body">Mesh parametrizasyonu — bir 3D üçgen mesh'i doku eşleme için düzleştirme — yoğun şekilde konform veya yarı-konform yöntemlere (en küçük kareler konform haritalar, açı tabanlı düzleştirme, konform enerjiler) dayanır. Aynı makine Blender, Maya, ZBrush'ta UV açılımının arkasındadır.</div></div>
<div class="calc-card"><div class="card-title">Anten ve dalga kilavuzu tasarimi</div><div class="card-body">Strip-line ve mikroşerit iletim hatlarının 2D kesitleri, karakteristik empedansları konform haritalama ile hesaplanır — metal/dielektrik geometrisine uygulanmış Schwarz-Christoffel. Mikrodalga mühendisliği el kitaplarındaki standart formüller (Wheeler, Hammerstad) bu konform-harita hesaplarından gelir.</div></div>
<div class="calc-card"><div class="card-title">Konform alan teorisi</div><div class="card-body">2D istatistiksel mekanikte kritiklikte ve 2D kuantum alan teorisinde, konform simetri korelasyon fonksiyonlarını neredeyse tamamen kısıtlar. Virasoro cebiri ve Belavin-Polyakov-Zamolodchikov minimal modeller sınıflandırması hepsi aynı temele oturur.</div></div>
</div>

<div class="l-note"><strong>Bir AI tatli sozu, kasitli olculu.</strong> 3D mesh'lerin konform düzleştirilmesi, yüzey verisine — kortikal kalınlık analizi, mesh tabanlı şekil sınıflandırması — 2D evrişimsel ağları yüzey geometrisinden vazgeçmeden uygulamanıza izin verendir. İşlem hattı "3D mesh → konform düzleştir → 2D CNN", konform adımının fizikte her zaman oynadığı aynı rolü oynadığı: zor bir geometriyi standart makinenin uygulandığı düz bir geometriye getirme. Hype gerekmez; matematik orada, işini yapıyor.</div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Oynamak icin.</strong> $\\mu = 0$ ve $\\nu = 0$ koyun — düz plaka (yozlaşmış) kanat profili ve ince plakanın etrafındaki ders kitabı akış resmi olan akım çizgisi grafiği almalısınız. $\\mu$'yu $0.25$'e kadar yukarı itin ve kanat profili rahatsız edici şekilde kalın olur — viskozite tekrar eklenmeden viskozitesiz model bozulur. $\\alpha$'yı $-10°$'dan $+15°$'ye kadar değiştirin ve kaldırmanın sıfırdan geçerek lineer olarak değiştiğini izleyin — bu Kutta-Joukowski teoreminin öngördüğü kaldırma eğrisi $C_L(\\alpha) = 2\\pi \\sin(\\alpha + \\beta)$'dır. Joukowski haritasını $J_n(z) = z + 1/z^n$, $n = 2$ ile değiştirin — sivri firar yerine sonlu firar açılı <em>Karman-Trefftz</em> kanat profilleri üretirsiniz.</p>

<h2 class="lesson-title">10. Ozet — Artik Yapabilecekleriniz</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Konform tanim</div><div class="card-body">Düzgün bir harita $z_0$'da konformdur eğer $z_0$'dan geçen kesişen eğriler arasındaki işaretli açıları korursa.</div></div>
<div class="calc-card"><div class="card-title">Holomorf = konform</div><div class="card-body">$f'(z_0) \\ne 0$ olan her noktada eşdeğer. Kritik noktalar $f' = 0$ açı-ikiye katlayanlardır.</div><div class="card-formula">$f$ hol, $f' \\ne 0 \\Leftrightarrow$ konform</div></div>
<div class="calc-card"><div class="card-title">Mobius ailesi</div><div class="card-body">$(az+b)/(cz+d)$, $ad - bc \\ne 0$. Riemann küresinin konform otomorfizmleri. Genelleştirilmiş çemberleri genelleştirilmiş çemberlere haritalar.</div></div>
<div class="calc-card"><div class="card-title">Cayley donusumu</div><div class="card-body">$(z - i)/(z + i)$: üst yarı düzlem-disk. Bilineer (Tustin) DSP dönüşümünün ve kararlılık teorisinin temeli.</div></div>
<div class="calc-card"><div class="card-title">Joukowski donusumu</div><div class="card-body">$z + 1/z$: kaydırılmış çemberlerden kanat profiline. Kritik noktalar $z = \\pm 1$ hücum ve firar kenarlarıdır; açı ikiye katlama sivriliği yaratır.</div></div>
<div class="calc-card"><div class="card-title">Karmasik potansiyel</div><div class="card-body">$\\Omega = \\phi + i\\psi$ holomorf ⇔ geçerli 2D viskozitesiz akış. Konform haritalar akışları basit alanlardan karmaşık alanlara taşır.</div></div>
<div class="calc-card"><div class="card-title">Kutta-Joukowski kaldirma</div><div class="card-body">Birim uzunluk başına $L = \\rho_\\infty U_\\infty \\Gamma$. Kaldırma dolanım ile belirlenir; dolanım Kutta sivrilik koşulu ile belirlenir.</div></div>
<div class="calc-card"><div class="card-title">Riemann donusum</div><div class="card-body">Her basit bağlı açık $U \\subsetneq \\mathbb{C}$ birim diske konform eşdeğerdir. Varlık evrenseldir; açık harita çokgenler için Schwarz-Christoffel ile, genel alanlar için sayısal yöntemlerle sağlanır.</div></div>
</div>

<div class="l-note"><strong>Bu nereye gidiyor.</strong> Konform haritalar ve 2D potansiyel akış, Riemann yüzeyleri üzerindeki harmonik fonksiyonlara, Teichmüller uzayları teorisine ve 2D kritik olgularının konform alan teorilerine açılan kapıdır. Uygulamalı tarafta, yüzey parametrizasyonu için her modern hesaplama aracı — ayrık konform haritalar, yüzeylerde optimal taşıma, konform mesh düzenleme — bu dersin temelleri üzerine kuruludur. Klasik harita "kaydırılmış çember → kanat profili", tek bir holomorf fonksiyonun tüm bir mühendislik problemini nasıl çözebileceğinin en temiz analitik örneği olmaya devam ediyor.</div>`
};
