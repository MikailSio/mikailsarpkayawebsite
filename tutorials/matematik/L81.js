window.LISE_MAT_L81 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Two of the three conic sections still wait for us.</strong> In Lesson 80 we built the ellipse from a pair of foci and a constant sum of distances. We now turn to the other two members of the family: the <em>parabola</em>, which arises when one focus is sent to infinity, and the <em>hyperbola</em>, which arises when the constant <em>sum</em> of distances is replaced by a constant <em>difference</em>. Despite this single-line summary, the geometry, equations and applications of these two curves are strikingly different from those of the ellipse — and from each other.</p>

<p class="l-text">The parabola is the curve traced by a thrown ball, the cross-section of a satellite dish, and the shape behind every car headlight reflector. The hyperbola governs the long-distance navigation signal Loran, models the path of a comet flung past the Sun on an escape trajectory, and describes the shock-wave pattern of a supersonic jet. Both curves are written in deceptively simple algebraic forms — but the focus, directrix and asymptote structure beneath those equations is what makes them powerful.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a parabola as the locus of points equidistant from a focus and a directrix line</li>
<li>Write a parabola in standard form for horizontal axis ($y^2 = 4px$) and vertical axis ($x^2 = 4py$), reading off the focus and directrix from the coefficient</li>
<li>Shift a parabola to a new vertex using $(y-k)^2 = 4p(x-h)$ and identify the new focus and directrix</li>
<li>Define a hyperbola as the locus of points whose absolute difference of distances to two foci is constant ($= 2a$)</li>
<li>Write a hyperbola in standard form $x^2/a^2 - y^2/b^2 = 1$, locate foci with $c^2 = a^2 + b^2$, vertices with $\\pm a$, and asymptotes with slopes $\\pm b/a$</li>
<li>Distinguish the ellipse identity $c^2 = a^2 - b^2$ from the hyperbola identity $c^2 = a^2 + b^2$ without confusion</li>
<li>Apply parabolic reflectors to headlights and dishes, and hyperbolic navigation to Loran-style position fixing</li>
</ul>
</div>

<h2 class="lesson-title">PART A &mdash; THE PARABOLA</h2>

<h2 class="lesson-title">1. Definition: One Focus and a Directrix</h2>

<div class="calc-highlight"><strong>Take a single fixed point F (the focus) and a fixed line $\\ell$ (the directrix) that does not pass through F.</strong> The parabola is the set of all points P in the plane that are equidistant from F and from $\\ell$. One focus, one line, equal distances — that is the entire definition.</div>

<p class="l-text">The ellipse used two foci and a constant <em>sum</em> of distances. The parabola has only one focus, and instead of summing two distances we compare a distance (to F) with a perpendicular distance (to a line). Geometrically a parabola looks like an open U-shape: it has a single vertex, no centre, no second focus, and it opens forever in one direction. There is no axis of symmetry through a second focus — the axis of symmetry runs straight through F perpendicular to the directrix.</p>

<div class="calc-formula"><div class="formula-label">PARABOLA &mdash; DEFINITION</div><div class="formula-main">$$\\text{Parabola} \\;=\\; \\{\\, P \\;:\\; \\text{dist}(P, F) \\;=\\; \\text{dist}(P, \\ell) \\,\\}$$</div><div class="formula-sub">The locus of points equally distant from the focus F and the directrix line $\\ell$. The vertex sits halfway between F and $\\ell$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Focus F</div><div class="card-body">A single fixed point. Every reflected ray inside a parabolic mirror passes through F, which is why satellite dishes and headlights are parabolic.</div></div>
<div class="calc-card"><div class="card-title">Directrix $\\ell$</div><div class="card-body">A fixed straight line. The parabola is "as close to F as it is far from $\\ell$" — a constant tug-of-war between point and line.</div></div>
<div class="calc-card"><div class="card-title">Vertex V</div><div class="card-body">The midpoint of the perpendicular segment from F to $\\ell$. The point of the parabola closest to both F and $\\ell$.</div></div>
</div>

<h2 class="lesson-title">2. Standard Form &mdash; Horizontal Axis</h2>

<div class="calc-highlight"><strong>Place the vertex at the origin and the axis of symmetry along the x-axis.</strong> Let the focus be at $F = (p, 0)$ and the directrix be the vertical line $x = -p$. Apply the equidistance definition and a single line of algebra gives the standard form.</div>

<p class="l-text">Setting $\\text{dist}(P, F)$ equal to $\\text{dist}(P, \\ell)$ for a point $P = (x, y)$:</p>

<div class="calc-formula"><div class="formula-label">DERIVATION</div><div class="formula-main">$$\\sqrt{(x-p)^2 + y^2} \\;=\\; |x + p|$$</div><div class="formula-sub">Square both sides, expand, and the cross-terms cancel beautifully.</div></div>

<p class="l-text">Squaring: $(x-p)^2 + y^2 = (x+p)^2$. Expand both sides: $x^2 - 2px + p^2 + y^2 = x^2 + 2px + p^2$. Cancel $x^2$ and $p^2$, then rearrange:</p>

<div class="calc-formula"><div class="formula-label">PARABOLA &mdash; STANDARD FORM (HORIZONTAL AXIS)</div><div class="formula-main">$$y^2 \\;=\\; 4px$$</div><div class="formula-sub">Vertex at origin, focus at $(p, 0)$, directrix $x = -p$, opens to the right when $p > 0$ and to the left when $p < 0$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$p > 0$</div><div class="card-body">Opens to the <strong>right</strong>. Focus on the positive x-axis. The U-shape lies in the half-plane $x \\geq 0$.</div></div>
<div class="calc-card"><div class="card-title">$p < 0$</div><div class="card-body">Opens to the <strong>left</strong>. Focus on the negative x-axis. The U-shape lies in the half-plane $x \\leq 0$.</div></div>
<div class="calc-card"><div class="card-title">Coefficient = $4p$</div><div class="card-body">The number in front of $x$ equals $4p$. If you read off $y^2 = 12x$, then $4p = 12$, so $p = 3$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Find the focus and directrix of the parabola <strong>$y^2 = 8x$</strong>.<br><br>Match against $y^2 = 4px$: $4p = 8$, so $p = 2$.<br><br>Focus: $(p, 0) = \\mathbf{(2, 0)}$.<br>Directrix: $x = -p = \\mathbf{x = -2}$.<br>The parabola opens to the right (since $p > 0$); vertex at origin.</div></div>

<h2 class="lesson-title">3. Standard Form &mdash; Vertical Axis</h2>

<div class="calc-highlight"><strong>Swap the roles of x and y.</strong> Put the vertex at the origin, the axis of symmetry along the y-axis, the focus at $F = (0, p)$ and the directrix at $y = -p$. The same algebra runs with x and y exchanged.</div>

<div class="calc-formula"><div class="formula-label">PARABOLA &mdash; STANDARD FORM (VERTICAL AXIS)</div><div class="formula-main">$$x^2 \\;=\\; 4py$$</div><div class="formula-sub">Vertex at origin, focus at $(0, p)$, directrix $y = -p$. Opens up when $p > 0$, down when $p < 0$.</div></div>

<p class="l-text">This is the form you have already met informally — every quadratic $y = ax^2$ can be rewritten as $x^2 = (1/a) \\cdot y$ and is therefore a parabola opening up (if $a > 0$) or down (if $a < 0$). The coefficient $a$ controls "how narrow" the U is.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$y^2 = 4px$ (HORIZONTAL)</div><div class="compare-item">Opens left or right</div><div class="compare-item">Axis of symmetry: the x-axis</div><div class="compare-item">Focus $(p, 0)$, directrix $x = -p$</div><div class="compare-item">Example: $y^2 = 12x \\implies p=3$, focus $(3,0)$, directrix $x=-3$</div></div><div class="compare-col"><div class="compare-title">$x^2 = 4py$ (VERTICAL)</div><div class="compare-item">Opens up or down</div><div class="compare-item">Axis of symmetry: the y-axis</div><div class="compare-item">Focus $(0, p)$, directrix $y = -p$</div><div class="compare-item">Example: $x^2 = -8y \\implies p=-2$, focus $(0,-2)$, directrix $y=2$, opens down</div></div></div>

<div class="calc-graph"><div id="plot-l81-parab-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the parabola $y^2 = 8x$ (so $p = 2$) with the focus at $(2, 0)$ marked in orange and the directrix $x = -2$ drawn as a dashed vertical line. Notice that for any sample point P on the curve, the horizontal distance to the directrix and the slant distance to the focus are equal — that equality is the parabola's defining property.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var p=2;var yy=[];var xx=[];for(var i=-300;i<=300;i++){var y=i*0.04;yy.push(y);xx.push(y*y/(4*p));}
var curveEN={x:xx,y:yy,mode:'lines',name:'y² = 8x',line:{color:'#3b82f6',width:3}};
var axEN={x:[-3,8],y:[0,0],mode:'lines',name:'x-axis',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var ayEN={x:[0,0],y:[-6,6],mode:'lines',name:'y-axis',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var directrixEN={x:[-p,-p],y:[-6,6],mode:'lines',name:'directrix x = −2',line:{color:'#ef4444',width:2,dash:'dash'}};
var focusEN={x:[p],y:[0],mode:'markers+text',name:'focus (2, 0)',marker:{color:'#f59e0b',size:11,symbol:'circle'},text:['F'],textposition:'top right',textfont:{color:'#f59e0b',size:14}};
var vertexEN={x:[0],y:[0],mode:'markers+text',name:'vertex',marker:{color:'#10b981',size:9},text:['V'],textposition:'bottom right',textfont:{color:'#10b981',size:13}};
var samplePy=3.2;var samplePx=samplePy*samplePy/(4*p);
var sampleEN={x:[samplePx],y:[samplePy],mode:'markers+text',name:'sample P',marker:{color:'#ec4899',size:9},text:['P'],textposition:'top right',textfont:{color:'#ec4899',size:13}};
var distF={x:[samplePx,p],y:[samplePy,0],mode:'lines',name:'|PF|',line:{color:'#ec4899',width:1.5,dash:'dot'}};
var distD={x:[samplePx,-p],y:[samplePy,samplePy],mode:'lines',name:'|P→directrix|',line:{color:'#ec4899',width:1.5,dash:'dot'},showlegend:false};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-4,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},yaxis:{range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l81-parab-en',[curveEN,axEN,ayEN,directrixEN,distF,distD,vertexEN,focusEN,sampleEN],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Vertex Form &mdash; Shifting the Parabola</h2>

<div class="calc-highlight"><strong>What if the vertex is not at the origin?</strong> Slide the whole parabola so its vertex sits at $(h, k)$. The equation gains two shifts — $x \\to x - h$ on the right, $y \\to y - k$ on the left — and nothing else changes.</div>

<div class="calc-formula"><div class="formula-label">VERTEX FORM (HORIZONTAL AXIS)</div><div class="formula-main">$$(y - k)^2 \\;=\\; 4p(x - h)$$</div><div class="formula-sub">Vertex at $(h, k)$. Focus at $(h+p, k)$. Directrix $x = h - p$. Axis of symmetry: the line $y = k$.</div></div>

<div class="calc-formula"><div class="formula-label">VERTEX FORM (VERTICAL AXIS)</div><div class="formula-main">$$(x - h)^2 \\;=\\; 4p(y - k)$$</div><div class="formula-sub">Vertex at $(h, k)$. Focus at $(h, k+p)$. Directrix $y = k - p$. Axis of symmetry: the line $x = h$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Find the vertex, focus and directrix of <strong>$(y - 3)^2 = 12(x + 1)$</strong>.<br><br>Match against $(y-k)^2 = 4p(x-h)$: $h = -1$, $k = 3$, and $4p = 12$ so $p = 3$.<br><br>Vertex: $(h, k) = \\mathbf{(-1, 3)}$.<br>Focus: $(h+p, k) = \\mathbf{(2, 3)}$.<br>Directrix: $x = h - p = \\mathbf{x = -4}$.<br>Opens to the right.</div></div>

<div class="l-note"><strong>From "$y = ax^2 + bx + c$" to vertex form.</strong> Any quadratic $y = ax^2 + bx + c$ is a parabola opening up or down. Complete the square: $y = a(x - h)^2 + k$ where $h = -b/(2a)$ and $k = c - b^2/(4a)$. Then rewrite as $(x-h)^2 = (1/a)(y - k)$, identify $4p = 1/a$, and read off vertex $(h,k)$, focus $(h, k + 1/(4a))$, directrix $y = k - 1/(4a)$.</div>

<h2 class="lesson-title">5. The Reflection Property and Real-World Parabolas</h2>

<div class="calc-highlight"><strong>The parabola has a striking optical property:</strong> any ray of light arriving parallel to the axis of symmetry, after bouncing off the inside of a parabolic mirror, passes through the focus. Conversely, any ray emitted from the focus, after bouncing off the mirror, leaves parallel to the axis. This is what makes parabolas appear everywhere in optics and engineering.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Satellite dish</div><div class="card-body">Plane radio waves from a distant satellite arrive parallel. The parabolic dish focuses every ray onto the antenna at the focus &mdash; a tiny target collects all the energy from a vast aperture.</div></div>
<div class="calc-card"><div class="card-title">Car headlight</div><div class="card-body">A bulb at the focus of a parabolic reflector emits light in all directions. After one bounce, every ray leaves parallel to the axis — a tight forward-pointing beam, exactly what you want on a dark road.</div></div>
<div class="calc-card"><div class="card-title">Projectile motion</div><div class="card-body">A ball thrown sideways with constant gravity traces a parabola. The horizontal coordinate grows linearly with time; the vertical coordinate is $y_0 + v_y t - \\tfrac{1}{2}g t^2$ — quadratic in t, hence parabolic in x.</div></div>
<div class="calc-card"><div class="card-title">Bridge cables</div><div class="card-body">A suspension bridge whose deck weight is uniformly distributed along the horizontal axis hangs in a parabola. (A free-hanging chain alone, without a deck, hangs in the related but different catenary shape.)</div></div>
</div>

<div class="calc-example"><div class="example-label">DESIGN PROBLEM &mdash; SATELLITE DISH</div><div class="example-body">A satellite dish is shaped like the parabola $x^2 = 8y$ (with x and y measured in metres). At what height above the vertex should the receiving antenna be placed?<br><br>Match $x^2 = 8y$ against $x^2 = 4py$: $4p = 8$, so $p = 2$ m.<br><br>The focus of a vertically opening parabola with vertex at the origin sits at $(0, p) = \\mathbf{(0, 2)}$. <strong>Place the antenna 2 metres above the vertex</strong>, on the axis of symmetry. Every plane wave from the satellite, after reflecting off the inner surface, converges exactly there.</div></div>

<h2 class="lesson-title">PART B &mdash; THE HYPERBOLA</h2>

<h2 class="lesson-title">6. Definition: Constant Difference of Distances</h2>

<div class="calc-highlight"><strong>Take two fixed points $F_1$ and $F_2$ — the foci.</strong> The hyperbola is the set of points P such that the <em>absolute difference</em> $|\\,|PF_1| - |PF_2|\\,|$ equals a fixed positive constant $2a$. Compare this with the ellipse, which used a constant <em>sum</em>: switching sum for difference is the only definitional change, but it produces a curve that looks dramatically different.</div>

<div class="calc-formula"><div class="formula-label">HYPERBOLA &mdash; DEFINITION</div><div class="formula-main">$$\\text{Hyperbola} \\;=\\; \\{\\, P \\;:\\; \\bigl| \\, |PF_1| - |PF_2| \\, \\bigr| \\;=\\; 2a \\,\\}$$</div><div class="formula-sub">A constant absolute difference of distances. The constant must satisfy $2a < |F_1 F_2|$ for the curve to exist.</div></div>

<p class="l-text">Unlike the ellipse, which is bounded and closed, the hyperbola consists of <strong>two separate branches</strong>, one wrapping around each focus. Points near $F_1$ have $|PF_1|$ much smaller than $|PF_2|$, so the difference $|PF_2| - |PF_1|$ is large and positive — giving one branch. Points near $F_2$ give the difference the other way, producing the second branch.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Two foci</div><div class="card-body">Just like the ellipse — two distinguished points on the axis of symmetry, symmetric about the centre.</div></div>
<div class="calc-card"><div class="card-title">Two branches</div><div class="card-body">Unlike the ellipse: the curve does not close. Each branch opens out forever, hugging an asymptote at infinity.</div></div>
<div class="calc-card"><div class="card-title">Two asymptotes</div><div class="card-body">A pair of straight lines through the centre, making an X-shape, that the branches approach but never touch as $|x| \\to \\infty$.</div></div>
</div>

<h2 class="lesson-title">7. Standard Form &mdash; Transverse Axis on the x-axis</h2>

<div class="calc-highlight"><strong>Place the centre at the origin and the two foci on the x-axis at $(\\pm c, 0)$.</strong> Apply the constant-difference definition, simplify, and you reach the standard equation. The key constant $a$ is half the distance between the two vertices.</div>

<div class="calc-formula"><div class="formula-label">HYPERBOLA &mdash; STANDARD FORM</div><div class="formula-main">$$\\frac{x^2}{a^2} \\;-\\; \\frac{y^2}{b^2} \\;=\\; 1$$</div><div class="formula-sub">Centre at origin, transverse axis along the x-axis. Note the <strong>minus sign</strong> &mdash; this is what distinguishes the hyperbola from the ellipse in algebra.</div></div>

<p class="l-text">Reading off the geometry from the equation: setting $y = 0$ gives $x^2 = a^2$, so $x = \\pm a$. These are the two <strong>vertices</strong> $(\\pm a, 0)$ — the closest points on each branch to the centre. Setting $x = 0$ gives $-y^2/b^2 = 1$, which has no real solution. The hyperbola never crosses the y-axis: the transverse axis intersects the curve, the <em>conjugate</em> axis does not.</p>

<div class="calc-formula"><div class="formula-label">FOCI &mdash; THE HYPERBOLA IDENTITY</div><div class="formula-main">$$c^2 \\;=\\; a^2 \\;+\\; b^2$$</div><div class="formula-sub">For a hyperbola, $c$ is <strong>larger</strong> than $a$. Compare with the ellipse, where $c^2 = a^2 - b^2$ and $c < a$. Get this sign wrong and every subsequent answer is wrong.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vertices</div><div class="card-body">$(\\pm a, 0)$. Distance from centre to vertex along the transverse axis.</div></div>
<div class="calc-card"><div class="card-title">Foci</div><div class="card-body">$(\\pm c, 0)$ with $c^2 = a^2 + b^2$. Always farther from the centre than the vertices ($c > a$).</div></div>
<div class="calc-card"><div class="card-title">Conjugate semi-axis</div><div class="card-body">$b$. The y-coordinates $\\pm b$ do not lie on the curve, but they appear in the asymptote slopes and in the box construction below.</div></div>
</div>

<h2 class="lesson-title">8. Asymptotes</h2>

<div class="calc-highlight"><strong>As $|x|$ grows large, the term $-y^2/b^2$ in the equation is forced to balance $x^2/a^2$.</strong> Far from the centre the hyperbola looks more and more like the curve $x^2/a^2 - y^2/b^2 = 0$, which factors into two straight lines. These lines are the asymptotes — the diagonal arms of an invisible X through the centre.</div>

<div class="calc-formula"><div class="formula-label">ASYMPTOTES OF $x^2/a^2 - y^2/b^2 = 1$</div><div class="formula-main">$$y \\;=\\; \\pm \\, \\frac{b}{a} \\, x$$</div><div class="formula-sub">Two straight lines through the origin with slopes $+b/a$ and $-b/a$. The hyperbola approaches them as $|x| \\to \\infty$ but never crosses them.</div></div>

<div class="l-note"><strong>Box construction.</strong> Draw a rectangle centred at the origin with horizontal half-width $a$ and vertical half-height $b$ — vertices at $(\\pm a, \\pm b)$. The asymptotes are the two diagonals of this rectangle, extended. The hyperbola's vertices sit on the rectangle at $(\\pm a, 0)$. This 30-second sketch tells you everything about the shape and orientation.</div>

<h2 class="lesson-title">9. Eccentricity of a Hyperbola</h2>

<div class="calc-highlight"><strong>The eccentricity $e = c/a$ measures how "open" the branches are.</strong> For an ellipse $e < 1$. For a circle $e = 0$. For a parabola $e = 1$ exactly (a limiting case). For a hyperbola <strong>$e > 1$</strong>, and larger e means a wider opening — the asymptotes are more nearly perpendicular when e is small (just above 1) and more nearly horizontal when e is large.</div>

<div class="calc-formula"><div class="formula-label">ECCENTRICITY</div><div class="formula-main">$$e \\;=\\; \\frac{c}{a} \\;=\\; \\frac{\\sqrt{a^2 + b^2}}{a} \\;>\\; 1$$</div><div class="formula-sub">A pure number describing the shape. Two hyperbolas with the same $e$ are similar (same shape, possibly different size).</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$e$ JUST ABOVE 1</div><div class="compare-item">Branches very narrow, hugging the x-axis</div><div class="compare-item">Asymptote slopes $\\pm b/a$ small</div><div class="compare-item">Hyperbola "almost a parabola"</div><div class="compare-item">Example: $e = 1.05$ &rarr; $b/a \\approx 0.32$</div></div><div class="compare-col"><div class="compare-title">$e$ LARGE</div><div class="compare-item">Branches very wide, opening up almost vertically</div><div class="compare-item">Asymptote slopes $\\pm b/a$ large</div><div class="compare-item">Hyperbola "nearly an X"</div><div class="compare-item">Example: $e = 5$ &rarr; $b/a \\approx 4.9$</div></div></div>

<h2 class="lesson-title">10. Conjugate Hyperbola &mdash; Transverse Axis on the y-axis</h2>

<div class="calc-highlight"><strong>Rotate the picture by 90 degrees.</strong> Place the foci on the y-axis instead, at $(0, \\pm c)$. The standard form becomes</div>

<div class="calc-formula"><div class="formula-label">HYPERBOLA &mdash; VERTICAL TRANSVERSE AXIS</div><div class="formula-main">$$\\frac{y^2}{b^2} \\;-\\; \\frac{x^2}{a^2} \\;=\\; 1$$</div><div class="formula-sub">Same identity $c^2 = a^2 + b^2$ holds. Vertices at $(0, \\pm b)$. Foci at $(0, \\pm c)$. Asymptotes $y = \\pm (b/a) x$ — same lines as for the horizontal hyperbola!</div></div>

<p class="l-text">The two hyperbolas $x^2/a^2 - y^2/b^2 = 1$ and $y^2/b^2 - x^2/a^2 = 1$ share the same asymptotes but open in perpendicular directions. They are called <strong>conjugate hyperbolas</strong>, and together they fill out the four regions between the two asymptote lines.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 &mdash; READ OFF GEOMETRY</div><div class="example-body">For the hyperbola <strong>$\\dfrac{x^2}{16} - \\dfrac{y^2}{9} = 1$</strong>, find vertices, foci, asymptotes and eccentricity.<br><br>Match against $x^2/a^2 - y^2/b^2 = 1$: $a^2 = 16$ so $a = 4$, and $b^2 = 9$ so $b = 3$.<br><br>Vertices: $(\\pm a, 0) = \\mathbf{(\\pm 4, 0)}$.<br>Foci: $c^2 = a^2 + b^2 = 16 + 9 = 25$, so $c = 5$. Foci at $\\mathbf{(\\pm 5, 0)}$.<br>Asymptotes: $y = \\pm (b/a) x = \\mathbf{y = \\pm \\tfrac{3}{4} x}$.<br>Eccentricity: $e = c/a = 5/4 = \\mathbf{1.25}$.</div></div>

<div class="calc-graph"><div id="plot-l81-hyper-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the hyperbola $x^2/16 - y^2/9 = 1$ (blue, two branches) with foci at $(\\pm 5, 0)$ in orange, vertices at $(\\pm 4, 0)$ in green, and the two asymptotes $y = \\pm \\tfrac{3}{4} x$ as dashed grey lines. The rectangle of half-width 4 and half-height 3 is drawn faintly to show the box construction — the asymptotes are exactly its extended diagonals.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var aH=4,bH=3,cH=5;
var x1=[];var y1U=[];var y1L=[];for(var i=0;i<=200;i++){var x=aH+i*0.06;x1.push(x);var y=bH*Math.sqrt(x*x/(aH*aH)-1);y1U.push(y);y1L.push(-y);}
var x2=[];var y2U=[];var y2L=[];for(var i=0;i<=200;i++){var x=-aH-i*0.06;x2.push(x);var y=bH*Math.sqrt(x*x/(aH*aH)-1);y2U.push(y);y2L.push(-y);}
var rightU={x:x1,y:y1U,mode:'lines',name:'right branch',line:{color:'#3b82f6',width:3}};
var rightL={x:x1,y:y1L,mode:'lines',line:{color:'#3b82f6',width:3},showlegend:false};
var leftU={x:x2,y:y2U,mode:'lines',name:'left branch',line:{color:'#3b82f6',width:3},showlegend:false};
var leftL={x:x2,y:y2L,mode:'lines',line:{color:'#3b82f6',width:3},showlegend:false};
var asyXmax=18;
var asy1={x:[-asyXmax,asyXmax],y:[-bH/aH*asyXmax,bH/aH*asyXmax],mode:'lines',name:'asymptote y = +¾x',line:{color:'rgba(255,255,255,0.45)',width:1.4,dash:'dash'}};
var asy2={x:[-asyXmax,asyXmax],y:[bH/aH*asyXmax,-bH/aH*asyXmax],mode:'lines',name:'asymptote y = −¾x',line:{color:'rgba(255,255,255,0.45)',width:1.4,dash:'dash'}};
var box={x:[-aH,aH,aH,-aH,-aH],y:[-bH,-bH,bH,bH,-bH],mode:'lines',name:'box',line:{color:'rgba(245,158,11,0.35)',width:1.2,dash:'dot'}};
var foci={x:[-cH,cH],y:[0,0],mode:'markers+text',name:'foci',marker:{color:'#f59e0b',size:11},text:['F₁','F₂'],textposition:'bottom center',textfont:{color:'#f59e0b',size:13}};
var vert={x:[-aH,aH],y:[0,0],mode:'markers+text',name:'vertices',marker:{color:'#10b981',size:9},text:['(−4,0)','(4,0)'],textposition:'top center',textfont:{color:'#10b981',size:11}};
var axxH={x:[-asyXmax,asyXmax],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var ayyH={x:[0,0],y:[-asyXmax*0.75,asyXmax*0.75],mode:'lines',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var layH={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-14,14],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},yaxis:{range:[-10,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l81-hyper-en',[axxH,ayyH,asy1,asy2,box,rightU,rightL,leftU,leftL,vert,foci],layH,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. The Three Conics Side by Side</h2>

<div class="calc-highlight"><strong>Ellipse, parabola and hyperbola are all "conic sections" &mdash; the curves you get by slicing a double cone with a plane.</strong> A horizontal slice gives a circle; a tilted slice (still cutting one nappe) gives an ellipse; a slice parallel to the slant gives a parabola; a steeper slice (cutting both nappes) gives a hyperbola. Algebraically they are unified by a single eccentricity number.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Conic</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Locus rule</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Standard form</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$c$ in terms of $a, b$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Eccentricity $e$</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Circle</strong></td><td style="padding:0.5rem 0.8rem">$|PC| = r$</td><td style="padding:0.5rem 0.8rem">$x^2 + y^2 = r^2$</td><td style="padding:0.5rem 0.8rem">$c = 0$</td><td style="padding:0.5rem 0.8rem">0</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Ellipse</strong></td><td style="padding:0.5rem 0.8rem">$|PF_1| + |PF_2| = 2a$</td><td style="padding:0.5rem 0.8rem">$x^2/a^2 + y^2/b^2 = 1$</td><td style="padding:0.5rem 0.8rem">$c^2 = a^2 - b^2$</td><td style="padding:0.5rem 0.8rem">$0 \\leq e < 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Parabola</strong></td><td style="padding:0.5rem 0.8rem">$|PF| = \\text{dist}(P, \\ell)$</td><td style="padding:0.5rem 0.8rem">$y^2 = 4px$ or $x^2 = 4py$</td><td style="padding:0.5rem 0.8rem">&mdash; (only one focus)</td><td style="padding:0.5rem 0.8rem">$e = 1$</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>Hyperbola</strong></td><td style="padding:0.5rem 0.8rem">$|\\,|PF_1| - |PF_2|\\,| = 2a$</td><td style="padding:0.5rem 0.8rem">$x^2/a^2 - y^2/b^2 = 1$</td><td style="padding:0.5rem 0.8rem">$c^2 = a^2 + b^2$</td><td style="padding:0.5rem 0.8rem">$e > 1$</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l81-three-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the three conics in one frame, all sharing the same scale. The ellipse $x^2/16 + y^2/9 = 1$ in green is closed; the parabola $y^2 = 4x$ in orange opens forever to the right with a single branch; the hyperbola $x^2/4 - y^2/3 = 1$ in pink has two open branches. Putting all three together makes the family resemblance — and the family differences — visible at a glance.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];var ex=[];var ey=[];for(var i=0;i<=400;i++){var a=2*Math.PI*i/400;ex.push(4*Math.cos(a));ey.push(3*Math.sin(a));}
var ellipse={x:ex,y:ey,mode:'lines',name:'ellipse x²/16 + y²/9 = 1',line:{color:'#10b981',width:2.5}};
var pyArr=[];var pxArr=[];for(var i=-200;i<=200;i++){var y=i*0.04;pyArr.push(y);pxArr.push(y*y/4);}
var parab={x:pxArr,y:pyArr,mode:'lines',name:'parabola y² = 4x',line:{color:'#f59e0b',width:2.5}};
var aH2=2,bH2=Math.sqrt(3);
var hx1=[];var hy1U=[];var hy1L=[];for(var i=0;i<=160;i++){var x=aH2+i*0.04;hx1.push(x);var y=bH2*Math.sqrt(x*x/(aH2*aH2)-1);hy1U.push(y);hy1L.push(-y);}
var hx2=[];var hy2U=[];var hy2L=[];for(var i=0;i<=160;i++){var x=-aH2-i*0.04;hx2.push(x);var y=bH2*Math.sqrt(x*x/(aH2*aH2)-1);hy2U.push(y);hy2L.push(-y);}
var hyperR={x:hx1,y:hy1U,mode:'lines',name:'hyperbola x²/4 − y²/3 = 1',line:{color:'#ec4899',width:2.5}};
var hyperRL={x:hx1,y:hy1L,mode:'lines',line:{color:'#ec4899',width:2.5},showlegend:false};
var hyperL={x:hx2,y:hy2U,mode:'lines',line:{color:'#ec4899',width:2.5},showlegend:false};
var hyperLL={x:hx2,y:hy2L,mode:'lines',line:{color:'#ec4899',width:2.5},showlegend:false};
var ax3={x:[-9,9],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var ay3={x:[0,0],y:[-6,6],mode:'lines',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var lay3={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-9,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},yaxis:{range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l81-three-en',[ax3,ay3,ellipse,parab,hyperR,hyperRL,hyperL,hyperLL],lay3,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Common Errors</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sign of $c^2$ identity</div><div class="card-body">For the <strong>ellipse</strong> $c^2 = a^2 - b^2$ ($c < a$, both foci inside the curve). For the <strong>hyperbola</strong> $c^2 = a^2 + b^2$ ($c > a$, foci outside the vertices). Mixing these is the most common error. A memory aid: the sign in the standard form equation matches the sign in the $c^2$ identity (ellipse has $+y^2/b^2$ and $-b^2$ in the $c^2$ formula; hyperbola has $-y^2/b^2$ and $+b^2$).</div></div>
<div class="calc-card"><div class="card-title">Asymptote slope &mdash; the $\\pm$</div><div class="card-body">A hyperbola has <em>two</em> asymptotes, $y = +\\tfrac{b}{a}x$ <strong>and</strong> $y = -\\tfrac{b}{a}x$. Writing only one of them is a partial answer. Always state the $\\pm$ pair.</div></div>
<div class="calc-card"><div class="card-title">Direction of the hyperbola</div><div class="card-body">A minus sign in front of $y^2/b^2$ means the hyperbola opens horizontally (along the x-axis). A minus sign in front of $x^2/a^2$ means it opens vertically. The variable with the <em>positive</em> coefficient names the transverse axis.</div></div>
<div class="calc-card"><div class="card-title">$4p$ vs $p$ for parabola</div><div class="card-body">In $y^2 = 4px$ the coefficient on $x$ is $4p$, not $p$. Reading $y^2 = 8x$ as "$p = 8$" is wrong &mdash; the correct value is $p = 2$. Always divide the coefficient by 4 before reading off the focus.</div></div>
</div>

<h2 class="lesson-title">13. Worked Exercises</h2>

<p class="l-text">A short mixed set covering both halves of the lesson. Attempt each one before reading the solution.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1 &mdash; PARABOLA STANDARD FORM</div><div class="example-body"><strong>Find the focus and directrix of $x^2 = -12y$.</strong><br><br>Match against $x^2 = 4py$: $4p = -12$, so $p = -3$. Vertical axis, opens downward (negative $p$).<br><br>Focus: $(0, p) = \\mathbf{(0, -3)}$. Directrix: $y = -p = \\mathbf{y = 3}$. Vertex at origin.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 &mdash; PARABOLA FROM FOCUS &amp; DIRECTRIX</div><div class="example-body"><strong>Find the equation of the parabola with focus $(0, 4)$ and directrix $y = -4$.</strong><br><br>Vertex sits midway between focus and directrix: at $(0, 0)$. Axis vertical (focus on y-axis), opens upward.<br>Distance from vertex to focus: $p = 4$. Use $x^2 = 4py = 16y$.<br><br>Answer: $\\mathbf{x^2 = 16y}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 &mdash; SHIFTED PARABOLA</div><div class="example-body"><strong>Identify the parabola $(x - 2)^2 = 8(y + 1)$.</strong><br><br>Vertex form $(x - h)^2 = 4p(y - k)$ with $h = 2$, $k = -1$, $4p = 8 \\Rightarrow p = 2$.<br><br>Vertex: $\\mathbf{(2, -1)}$. Focus: $(h, k + p) = \\mathbf{(2, 1)}$. Directrix: $y = k - p = \\mathbf{y = -3}$. Opens upward.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 &mdash; HYPERBOLA STANDARD FORM</div><div class="example-body"><strong>Find foci, vertices and asymptotes of $\\dfrac{x^2}{25} - \\dfrac{y^2}{144} = 1$.</strong><br><br>$a^2 = 25 \\Rightarrow a = 5$, $b^2 = 144 \\Rightarrow b = 12$. Horizontal transverse axis.<br>$c^2 = a^2 + b^2 = 25 + 144 = 169 \\Rightarrow c = 13$.<br><br>Vertices: $\\mathbf{(\\pm 5, 0)}$. Foci: $\\mathbf{(\\pm 13, 0)}$. Asymptotes: $\\mathbf{y = \\pm \\tfrac{12}{5} x}$. Eccentricity $e = 13/5 = 2.6$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 &mdash; CONJUGATE HYPERBOLA</div><div class="example-body"><strong>Find vertices and foci of $\\dfrac{y^2}{4} - \\dfrac{x^2}{9} = 1$.</strong><br><br>Vertical transverse axis ($y^2$ positive). Here $b^2 = 4$ and $a^2 = 9$ in the form $y^2/b^2 - x^2/a^2 = 1$, so vertices on the y-axis at $(0, \\pm b) = \\mathbf{(0, \\pm 2)}$.<br>$c^2 = a^2 + b^2 = 9 + 4 = 13 \\Rightarrow c = \\sqrt{13}$. Foci: $\\mathbf{(0, \\pm \\sqrt{13})}$.<br><br>Asymptotes: $y = \\pm (b/a) x = \\mathbf{y = \\pm \\tfrac{2}{3} x}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 &mdash; HYPERBOLA FROM FOCI &amp; VERTICES</div><div class="example-body"><strong>A hyperbola has foci $(\\pm 10, 0)$ and vertices $(\\pm 6, 0)$. Find its equation.</strong><br><br>From vertices $(\\pm a, 0)$: $a = 6$, so $a^2 = 36$.<br>From foci $(\\pm c, 0)$: $c = 10$, so $c^2 = 100$.<br>Use $c^2 = a^2 + b^2 \\Rightarrow b^2 = 100 - 36 = 64$.<br><br>Equation: $\\mathbf{\\dfrac{x^2}{36} - \\dfrac{y^2}{64} = 1}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7 &mdash; ECCENTRICITY</div><div class="example-body"><strong>Find the eccentricity of $\\dfrac{x^2}{49} - \\dfrac{y^2}{576} = 1$.</strong><br><br>$a^2 = 49 \\Rightarrow a = 7$, $b^2 = 576 \\Rightarrow b = 24$.<br>$c^2 = a^2 + b^2 = 49 + 576 = 625 \\Rightarrow c = 25$.<br><br>$e = c/a = 25/7 \\approx \\mathbf{3.57}$. A wide-open hyperbola.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8 &mdash; PARABOLIC REFLECTOR</div><div class="example-body"><strong>A flashlight reflector is a parabola $x^2 = 16y$ (cm). Where do you place the bulb so that the emitted beam is parallel?</strong><br><br>$4p = 16 \\Rightarrow p = 4$. Focus at $(0, 4)$ &mdash; the bulb sits <strong>4 cm above the vertex</strong> on the axis. By the reflection property, every ray from F bounces off the parabola parallel to the y-axis, producing a tight forward-pointing beam.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><strong>Parabola</strong> = locus of points equidistant from a focus F and a directrix $\\ell$</li>
<li>Standard forms: $y^2 = 4px$ (horizontal, focus $(p, 0)$, directrix $x = -p$); $x^2 = 4py$ (vertical, focus $(0, p)$, directrix $y = -p$)</li>
<li>Shifted vertex form: $(y - k)^2 = 4p(x - h)$ for vertex $(h, k)$; analogous form for vertical axis</li>
<li>Reflection property: rays parallel to the axis converge at the focus &mdash; the principle behind satellite dishes and headlights</li>
<li><strong>Hyperbola</strong> = locus where $|\\,|PF_1| - |PF_2|\\,| = 2a$ is constant</li>
<li>Standard form $x^2/a^2 - y^2/b^2 = 1$ with foci $(\\pm c, 0)$, $c^2 = a^2 + b^2$, asymptotes $y = \\pm (b/a) x$</li>
<li>Eccentricity $e = c/a > 1$; the larger $e$, the wider the branches open</li>
<li>Conjugate form $y^2/b^2 - x^2/a^2 = 1$ rotates the picture 90&deg;; both forms share the same asymptotes</li>
<li><strong>Key sign rule:</strong> ellipse $c^2 = a^2 - b^2$; hyperbola $c^2 = a^2 + b^2$ &mdash; never confuse these</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Üç konik kesitten ikisi hâlâ bizi bekliyor.</strong> 80. Derste elipsi iki odak ve uzaklıkların sabit toplamı üzerinden inşa ettik. Şimdi ailenin diğer iki üyesine geçiyoruz: <em>parabol</em> &mdash; odaklardan biri sonsuza gönderildiğinde ortaya çıkan eğri &mdash; ve <em>hiperbol</em> &mdash; uzaklıkların sabit <em>toplamı</em> yerine sabit <em>farkı</em> alındığında ortaya çıkan eğri. Bu tek satırlık özete rağmen, bu iki eğrinin geometrisi, denklemleri ve uygulamaları elipsten ve birbirinden çarpıcı biçimde farklıdır.</p>

<p class="l-text">Parabol, atılan bir topun çizdiği eğridir; uydu çanağının kesitidir; her araba farının arkasındaki reflektör şeklidir. Hiperbol uzun mesafeli Loran navigasyon sinyallerini yönetir, Güneş'in yanından kaçış yörüngesiyle geçen bir kuyruklu yıldızın yolunu modeller ve süpersonik uçakların şok dalgası desenini tanımlar. İki eğri de aldatıcı biçimde basit cebirsel formlarla yazılır &mdash; ama o denklemlerin altındaki odak, doğrultman ve asimptot yapısı, onları güçlü kılan şeydir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Parabolü bir odak F ve bir doğrultman doğrusundan eşit uzaklıkta olan noktaların geometrik yeri olarak tanımlamayı</li>
<li>Yatay eksenli parabolü ($y^2 = 4px$) ve düşey eksenli parabolü ($x^2 = 4py$) standart formda yazmayı; katsayıdan odağı ve doğrultmanı okumayı</li>
<li>Bir parabolü $(y-k)^2 = 4p(x-h)$ ile yeni bir tepe noktasına ötelemeyi ve yeni odak ile doğrultmanı belirlemeyi</li>
<li>Hiperbolü, iki odağa olan uzaklıkların mutlak farkı sabit olan ($= 2a$) noktaların geometrik yeri olarak tanımlamayı</li>
<li>Hiperbolü $x^2/a^2 - y^2/b^2 = 1$ standart formunda yazmayı; $c^2 = a^2 + b^2$ ile odakları, $\\pm a$ ile köşeleri, $\\pm b/a$ eğimleriyle asimptotları yerleştirmeyi</li>
<li>Elips özdeşliği $c^2 = a^2 - b^2$ ile hiperbol özdeşliği $c^2 = a^2 + b^2$'yi karıştırmadan ayırt etmeyi</li>
<li>Parabolik yansıtıcıları farlara ve çanaklara, hiperbolik navigasyonu Loran tipi konum belirlemeye uygulamayı</li>
</ul>
</div>

<h2 class="lesson-title">A BÖLÜMÜ &mdash; PARABOL</h2>

<h2 class="lesson-title">1. Tanım: Bir Odak ve Bir Doğrultman</h2>

<div class="calc-highlight"><strong>Tek bir sabit nokta F (odak) ve F'den geçmeyen sabit bir doğru $\\ell$ (doğrultman) al.</strong> Parabol, düzlemde F'ye ve $\\ell$'ye eşit uzaklıkta olan tüm P noktalarının kümesidir. Bir odak, bir doğru, eşit uzaklıklar &mdash; tanımın tamamı bu.</div>

<p class="l-text">Elips iki odak ve uzaklıkların sabit <em>toplamını</em> kullanıyordu. Parabolde tek bir odak var ve iki uzaklığı toplamak yerine bir uzaklığı (F'ye) bir dik uzaklıkla (bir doğruya) karşılaştırıyoruz. Geometrik olarak parabol açık bir U-şekline benzer: tek bir tepe noktası vardır, merkezi yoktur, ikinci odağı yoktur ve sonsuza kadar bir yönde açılır. İkinci bir odaktan geçen bir simetri ekseni yoktur &mdash; simetri ekseni doğrudan F'den, doğrultmanına dik olarak geçer.</p>

<div class="calc-formula"><div class="formula-label">PARABOL &mdash; TANIM</div><div class="formula-main">$$\\text{Parabol} \\;=\\; \\{\\, P \\;:\\; \\text{uzaklik}(P, F) \\;=\\; \\text{uzaklik}(P, \\ell) \\,\\}$$</div><div class="formula-sub">Odak F'ye ve doğrultman doğrusu $\\ell$'ye eşit uzaklıkta olan noktaların geometrik yeri. Tepe noktası F ile $\\ell$'nin tam ortasında yer alır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Odak F</div><div class="card-body">Tek bir sabit nokta. Parabolik bir aynanın içinde yansıyan her ışın F'den geçer; uydu çanakları ve farların parabolik olmasının nedeni budur.</div></div>
<div class="calc-card"><div class="card-title">Doğrultman $\\ell$</div><div class="card-body">Sabit bir doğru. Parabol "F'ye ne kadar yakınsa $\\ell$'den o kadar uzak" &mdash; nokta ile doğru arasında sabit bir çekişme.</div></div>
<div class="calc-card"><div class="card-title">Tepe noktası V</div><div class="card-body">F'den $\\ell$'ye inen dik parçanın orta noktası. Parabolün hem F'ye hem $\\ell$'ye en yakın noktası.</div></div>
</div>

<h2 class="lesson-title">2. Standart Form &mdash; Yatay Eksen</h2>

<div class="calc-highlight"><strong>Tepe noktasını orijine, simetri eksenini x-eksenine yerleştir.</strong> Odak $F = (p, 0)$, doğrultman ise dikey doğru $x = -p$ olsun. Eşit uzaklık tanımını uygula; tek bir satır cebirle standart forma ulaşırsın.</div>

<p class="l-text">Bir $P = (x, y)$ noktası için $\\text{uzaklik}(P, F)$'i $\\text{uzaklik}(P, \\ell)$'ye eşitleyelim:</p>

<div class="calc-formula"><div class="formula-label">TÜRETME</div><div class="formula-main">$$\\sqrt{(x-p)^2 + y^2} \\;=\\; |x + p|$$</div><div class="formula-sub">İki yanın karesini al; çarpım terimleri güzel bir şekilde sadeleşir.</div></div>

<p class="l-text">Kare al: $(x-p)^2 + y^2 = (x+p)^2$. Açıp düzenle: $x^2 - 2px + p^2 + y^2 = x^2 + 2px + p^2$. $x^2$ ve $p^2$ sadeleşir; kalanları toparla:</p>

<div class="calc-formula"><div class="formula-label">PARABOL &mdash; STANDART FORM (YATAY EKSEN)</div><div class="formula-main">$$y^2 \\;=\\; 4px$$</div><div class="formula-sub">Tepe orijinde, odak $(p, 0)$, doğrultman $x = -p$, $p > 0$ ise sağa, $p < 0$ ise sola açılır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$p > 0$</div><div class="card-body"><strong>Sağa</strong> açılır. Odak pozitif x-ekseninde. U-şekli $x \\geq 0$ yarı düzleminde.</div></div>
<div class="calc-card"><div class="card-title">$p < 0$</div><div class="card-body"><strong>Sola</strong> açılır. Odak negatif x-ekseninde. U-şekli $x \\leq 0$ yarı düzleminde.</div></div>
<div class="calc-card"><div class="card-title">Katsayı = $4p$</div><div class="card-body">$x$'in önündeki sayı $4p$'ye eşittir. $y^2 = 12x$ okuyorsan, $4p = 12$, yani $p = 3$.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body"><strong>$y^2 = 8x$</strong> parabolünün odağını ve doğrultmanını bul.<br><br>$y^2 = 4px$ ile eşleştir: $4p = 8$, dolayısıyla $p = 2$.<br><br>Odak: $(p, 0) = \\mathbf{(2, 0)}$.<br>Doğrultman: $x = -p = \\mathbf{x = -2}$.<br>Parabol sağa açılır ($p > 0$); tepe orijinde.</div></div>

<h2 class="lesson-title">3. Standart Form &mdash; Düşey Eksen</h2>

<div class="calc-highlight"><strong>x ve y'nin rollerini değiştir.</strong> Tepeyi orijine, simetri eksenini y-eksenine, odağı $F = (0, p)$'ye, doğrultmanı $y = -p$'ye yerleştir. Aynı cebir x ile y yer değiştirmiş hâliyle çalışır.</div>

<div class="calc-formula"><div class="formula-label">PARABOL &mdash; STANDART FORM (DÜŞEY EKSEN)</div><div class="formula-main">$$x^2 \\;=\\; 4py$$</div><div class="formula-sub">Tepe orijinde, odak $(0, p)$, doğrultman $y = -p$. $p > 0$ yukarı, $p < 0$ aşağı açılır.</div></div>

<p class="l-text">Bu, gayri resmi olarak zaten tanıştığın formdur &mdash; her $y = ax^2$ ikinci derece denklemi $x^2 = (1/a) \\cdot y$ olarak yeniden yazılabilir ve dolayısıyla yukarı ($a > 0$) ya da aşağı ($a < 0$) açılan bir paraboldür. $a$ katsayısı U'nun "ne kadar dar" olduğunu kontrol eder.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$y^2 = 4px$ (YATAY)</div><div class="compare-item">Sağa veya sola açılır</div><div class="compare-item">Simetri ekseni: x-ekseni</div><div class="compare-item">Odak $(p, 0)$, doğrultman $x = -p$</div><div class="compare-item">Örnek: $y^2 = 12x \\implies p=3$, odak $(3,0)$, doğrultman $x=-3$</div></div><div class="compare-col"><div class="compare-title">$x^2 = 4py$ (DÜŞEY)</div><div class="compare-item">Yukarı veya aşağı açılır</div><div class="compare-item">Simetri ekseni: y-ekseni</div><div class="compare-item">Odak $(0, p)$, doğrultman $y = -p$</div><div class="compare-item">Örnek: $x^2 = -8y \\implies p=-2$, odak $(0,-2)$, doğrultman $y=2$, aşağı açılır</div></div></div>

<div class="calc-graph"><div id="plot-l81-parab-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y^2 = 8x$ parabolü ($p = 2$); $(2, 0)$'daki odak turuncu, $x = -2$ doğrultmanı kesikli düşey doğru olarak çizildi. Eğri üzerindeki herhangi bir P örnek noktasının doğrultmanına yatay uzaklığı ile odağa eğik uzaklığı eşittir &mdash; parabolün tanımlayıcı özelliği bu eşitliktir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pT=2;var yyT=[];var xxT=[];for(var i=-300;i<=300;i++){var y=i*0.04;yyT.push(y);xxT.push(y*y/(4*pT));}
var curveTR={x:xxT,y:yyT,mode:'lines',name:'y² = 8x',line:{color:'#3b82f6',width:3}};
var axTR={x:[-3,8],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var ayTR={x:[0,0],y:[-6,6],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var directrixTR={x:[-pT,-pT],y:[-6,6],mode:'lines',name:'doğrultman x = −2',line:{color:'#ef4444',width:2,dash:'dash'}};
var focusTR={x:[pT],y:[0],mode:'markers+text',name:'odak (2, 0)',marker:{color:'#f59e0b',size:11},text:['F'],textposition:'top right',textfont:{color:'#f59e0b',size:14}};
var vertexTR={x:[0],y:[0],mode:'markers+text',name:'tepe',marker:{color:'#10b981',size:9},text:['V'],textposition:'bottom right',textfont:{color:'#10b981',size:13}};
var samplePyT=3.2;var samplePxT=samplePyT*samplePyT/(4*pT);
var sampleTR={x:[samplePxT],y:[samplePyT],mode:'markers+text',name:'örnek P',marker:{color:'#ec4899',size:9},text:['P'],textposition:'top right',textfont:{color:'#ec4899',size:13}};
var distFT={x:[samplePxT,pT],y:[samplePyT,0],mode:'lines',name:'|PF|',line:{color:'#ec4899',width:1.5,dash:'dot'}};
var distDT={x:[samplePxT,-pT],y:[samplePyT,samplePyT],mode:'lines',name:'|P→doğrultman|',line:{color:'#ec4899',width:1.5,dash:'dot'},showlegend:false};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-4,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},yaxis:{range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l81-parab-tr',[curveTR,axTR,ayTR,directrixTR,distFT,distDT,vertexTR,focusTR,sampleTR],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Tepe Formu &mdash; Parabolü Ötele</h2>

<div class="calc-highlight"><strong>Tepe orijinde değilse ne olur?</strong> Tüm paraboleyi tepe noktası $(h, k)$ olacak şekilde kaydır. Denklem iki öteleme kazanır &mdash; sağda $x \\to x - h$, solda $y \\to y - k$ &mdash; başka hiçbir şey değişmez.</div>

<div class="calc-formula"><div class="formula-label">TEPE FORMU (YATAY EKSEN)</div><div class="formula-main">$$(y - k)^2 \\;=\\; 4p(x - h)$$</div><div class="formula-sub">Tepe $(h, k)$'de. Odak $(h+p, k)$. Doğrultman $x = h - p$. Simetri ekseni: $y = k$ doğrusu.</div></div>

<div class="calc-formula"><div class="formula-label">TEPE FORMU (DÜŞEY EKSEN)</div><div class="formula-main">$$(x - h)^2 \\;=\\; 4p(y - k)$$</div><div class="formula-sub">Tepe $(h, k)$'de. Odak $(h, k+p)$. Doğrultman $y = k - p$. Simetri ekseni: $x = h$ doğrusu.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body"><strong>$(y - 3)^2 = 12(x + 1)$</strong> parabolünün tepe, odak ve doğrultmanını bul.<br><br>$(y-k)^2 = 4p(x-h)$ ile eşleştir: $h = -1$, $k = 3$ ve $4p = 12$, yani $p = 3$.<br><br>Tepe: $(h, k) = \\mathbf{(-1, 3)}$.<br>Odak: $(h+p, k) = \\mathbf{(2, 3)}$.<br>Doğrultman: $x = h - p = \\mathbf{x = -4}$.<br>Sağa açılır.</div></div>

<div class="l-note"><strong>"$y = ax^2 + bx + c$"'den tepe formuna.</strong> Her $y = ax^2 + bx + c$ ikinci derece denklemi yukarı ya da aşağı açılan bir paraboldür. Tamkare hâline getir: $y = a(x - h)^2 + k$, burada $h = -b/(2a)$ ve $k = c - b^2/(4a)$. Sonra $(x-h)^2 = (1/a)(y - k)$ olarak yeniden yaz, $4p = 1/a$ olarak belirle ve tepe $(h,k)$, odak $(h, k + 1/(4a))$, doğrultman $y = k - 1/(4a)$'yı oku.</div>

<h2 class="lesson-title">5. Yansıma Özelliği ve Gerçek Dünyada Paraboller</h2>

<div class="calc-highlight"><strong>Parabolün çarpıcı bir optik özelliği vardır:</strong> simetri eksenine paralel gelen herhangi bir ışık ışını, parabolik aynanın iç yüzeyinden yansıdıktan sonra odaktan geçer. Tersine, odaktan yayılan herhangi bir ışın aynaya çarptıktan sonra eksene paralel olarak ayrılır. Optikte ve mühendislikte parabolleri her yerde görmemizin nedeni budur.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Uydu çanağı</div><div class="card-body">Uzaktaki bir uydudan gelen düzlem radyo dalgaları paraleldir. Parabolik çanak her ışını odaktaki antene yoğunlaştırır &mdash; minik bir hedef, devasa bir açıklıktaki tüm enerjiyi toplar.</div></div>
<div class="calc-card"><div class="card-title">Araba farı</div><div class="card-body">Parabolik reflektörün odağındaki ampul her yöne ışık yayar. Bir yansımadan sonra her ışın eksene paralel ayrılır &mdash; karanlık bir yolda istediğin türden dar, ileri yönlü bir demet.</div></div>
<div class="calc-card"><div class="card-title">Eğik atış</div><div class="card-body">Yatay yönde sabit yerçekimiyle atılan bir top parabol çizer. Yatay koordinat zamanla doğrusal büyür; düşey koordinat $y_0 + v_y t - \\tfrac{1}{2}g t^2$'dir &mdash; t'de ikinci derece, dolayısıyla x'de parabolik.</div></div>
<div class="calc-card"><div class="card-title">Köprü halatları</div><div class="card-body">Tabliye ağırlığı yatay eksen boyunca düzgün dağılmış bir asma köprünün halatı parabol şeklinde sarkar. (Tabliyesiz, serbest sarkan tek başına bir zincir ise ilişkili ama farklı bir şekil olan zincir eğrisi/katener çizer.)</div></div>
</div>

<div class="calc-example"><div class="example-label">TASARIM PROBLEMİ &mdash; UYDU ÇANAĞI</div><div class="example-body">Bir uydu çanağı $x^2 = 8y$ parabolü şeklindedir (x ve y metre cinsinden). Alıcı anten tepeden ne kadar yükseğe yerleştirilmelidir?<br><br>$x^2 = 8y$'yi $x^2 = 4py$ ile eşleştir: $4p = 8$, yani $p = 2$ m.<br><br>Tepesi orijinde, düşey açılan parabolün odağı $(0, p) = \\mathbf{(0, 2)}$'dir. <strong>Anten tepeden 2 m yukarıya, simetri ekseni üzerine</strong> yerleştirilir. Uydudan gelen her düzlem dalga, iç yüzeyden yansıdıktan sonra tam orada birleşir.</div></div>

<h2 class="lesson-title">B BÖLÜMÜ &mdash; HİPERBOL</h2>

<h2 class="lesson-title">6. Tanım: Sabit Uzaklık Farkı</h2>

<div class="calc-highlight"><strong>$F_1$ ve $F_2$ olarak adlandırdığımız iki sabit nokta &mdash; odaklar &mdash; al.</strong> Hiperbol, $|\\,|PF_1| - |PF_2|\\,|$ <em>mutlak farkının</em> sabit bir pozitif sayı $2a$'ya eşit olduğu P noktalarının kümesidir. Elipsle karşılaştır: o, sabit <em>toplam</em> kullanıyordu; toplamı farkla değiştirmek tek tanımsal değişikliktir, ama dramatik biçimde farklı görünen bir eğri üretir.</div>

<div class="calc-formula"><div class="formula-label">HİPERBOL &mdash; TANIM</div><div class="formula-main">$$\\text{Hiperbol} \\;=\\; \\{\\, P \\;:\\; \\bigl| \\, |PF_1| - |PF_2| \\, \\bigr| \\;=\\; 2a \\,\\}$$</div><div class="formula-sub">Uzaklıkların sabit mutlak farkı. Eğrinin var olabilmesi için sabitin $2a < |F_1 F_2|$ koşulunu sağlaması gerekir.</div></div>

<p class="l-text">Sınırlı ve kapalı olan elipsin aksine hiperbol <strong>iki ayrı koldan</strong> oluşur, her bir kol bir odağın etrafına sarılır. $F_1$'e yakın noktalar için $|PF_1|$ değeri $|PF_2|$'den çok daha küçüktür, dolayısıyla $|PF_2| - |PF_1|$ farkı büyük ve pozitiftir &mdash; bu bir kolu verir. $F_2$'ye yakın noktalar farkı diğer yönde verir ve ikinci kolu üretir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İki odak</div><div class="card-body">Tıpkı elipsteki gibi &mdash; simetri ekseninde, merkeze göre simetrik iki ayırt edilmiş nokta.</div></div>
<div class="calc-card"><div class="card-title">İki kol</div><div class="card-body">Elipsten farklı olarak: eğri kapanmaz. Her kol sonsuza doğru açılır, sonsuzda bir asimptota yaslanır.</div></div>
<div class="calc-card"><div class="card-title">İki asimptot</div><div class="card-body">Merkezden geçen ve X-şekli oluşturan, kolların yaklaştığı ama $|x| \\to \\infty$ olurken bile asla dokunmadığı bir çift doğru.</div></div>
</div>

<h2 class="lesson-title">7. Standart Form &mdash; Esas Eksen x-ekseni Üzerinde</h2>

<div class="calc-highlight"><strong>Merkezi orijine, iki odağı x-ekseninde $(\\pm c, 0)$ noktalarına yerleştir.</strong> Sabit fark tanımını uygula, sadeleştir ve standart denkleme ulaş. Anahtar sabit $a$, iki köşe arasındaki uzaklığın yarısıdır.</div>

<div class="calc-formula"><div class="formula-label">HİPERBOL &mdash; STANDART FORM</div><div class="formula-main">$$\\frac{x^2}{a^2} \\;-\\; \\frac{y^2}{b^2} \\;=\\; 1$$</div><div class="formula-sub">Merkez orijinde, esas eksen x-ekseni boyunca. <strong>Eksi işaretine</strong> dikkat &mdash; cebirsel olarak hiperbolü elipsten ayıran budur.</div></div>

<p class="l-text">Denklemden geometriyi okumak: $y = 0$ koy, $x^2 = a^2$, yani $x = \\pm a$ olur. Bunlar iki <strong>köşedir</strong> $(\\pm a, 0)$ &mdash; her kolun merkeze en yakın noktaları. $x = 0$ koyduğunda $-y^2/b^2 = 1$ olur ki gerçek bir çözümü yok. Hiperbol y-eksenini asla kesmez: esas eksen eğriyi keser, <em>eşlenik</em> eksen kesmez.</p>

<div class="calc-formula"><div class="formula-label">ODAKLAR &mdash; HİPERBOL ÖZDEŞLİĞİ</div><div class="formula-main">$$c^2 \\;=\\; a^2 \\;+\\; b^2$$</div><div class="formula-sub">Hiperbol için $c$, $a$'dan <strong>büyüktür</strong>. Elipsle karşılaştır: orada $c^2 = a^2 - b^2$ ve $c < a$. Bu işaret hatası yapılırsa sonraki her cevap yanlış çıkar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Köşeler</div><div class="card-body">$(\\pm a, 0)$. Esas eksen boyunca merkezden köşeye uzaklık.</div></div>
<div class="calc-card"><div class="card-title">Odaklar</div><div class="card-body">$c^2 = a^2 + b^2$ ile $(\\pm c, 0)$. Her zaman köşelerden daha uzaktadır ($c > a$).</div></div>
<div class="calc-card"><div class="card-title">Eşlenik yarı eksen</div><div class="card-body">$b$. $\\pm b$ y-koordinatları eğri üzerinde değildir ama asimptot eğimlerinde ve aşağıdaki kutu çiziminde görünür.</div></div>
</div>

<h2 class="lesson-title">8. Asimptotlar</h2>

<div class="calc-highlight"><strong>$|x|$ büyüdükçe denklemdeki $-y^2/b^2$ terimi $x^2/a^2$ ile dengelenmeye zorlanır.</strong> Merkezden uzakta hiperbol giderek $x^2/a^2 - y^2/b^2 = 0$ eğrisine benzer; bu da iki doğruya çarpanlarına ayrılır. İşte bu doğrular asimptotlardır &mdash; merkezden geçen görünmez bir X'in çapraz kolları.</div>

<div class="calc-formula"><div class="formula-label">$x^2/a^2 - y^2/b^2 = 1$'İN ASİMPTOTLARI</div><div class="formula-main">$$y \\;=\\; \\pm \\, \\frac{b}{a} \\, x$$</div><div class="formula-sub">Eğimleri $+b/a$ ve $-b/a$ olan, orijinden geçen iki doğru. Hiperbol $|x| \\to \\infty$ olurken bunlara yaklaşır ama asla kesmez.</div></div>

<div class="l-note"><strong>Kutu çizimi.</strong> Yatay yarı genişliği $a$, düşey yarı yüksekliği $b$ olan, orijin merkezli bir dikdörtgen çiz &mdash; köşeleri $(\\pm a, \\pm b)$. Asimptotlar bu dikdörtgenin iki köşegeninin uzantısıdır. Hiperbolün köşeleri dikdörtgenin üzerinde, $(\\pm a, 0)$ noktalarında durur. 30 saniyelik bu çizim sana şeklin ve yönelimin tamamını söyler.</div>

<h2 class="lesson-title">9. Hiperbolün Dış Merkezliği</h2>

<div class="calc-highlight"><strong>Dış merkezlik $e = c/a$, kolların ne kadar "açık" olduğunu ölçer.</strong> Elips için $e < 1$. Çember için $e = 0$. Parabol için tam olarak $e = 1$ (limit durumu). Hiperbol için <strong>$e > 1$</strong> ve $e$ büyüdükçe açıklık genişler &mdash; $e$ 1'in az üstündeyken asimptotlar neredeyse dik, $e$ büyükken neredeyse yatay olur.</div>

<div class="calc-formula"><div class="formula-label">DIŞ MERKEZLİK</div><div class="formula-main">$$e \\;=\\; \\frac{c}{a} \\;=\\; \\frac{\\sqrt{a^2 + b^2}}{a} \\;>\\; 1$$</div><div class="formula-sub">Şekli tanımlayan saf bir sayı. Aynı $e$ değerine sahip iki hiperbol benzerdir (aynı şekil, farklı boyut olabilir).</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$e$ HEMEN 1'İN ÜSTÜNDE</div><div class="compare-item">Kollar çok dar, x-eksenine yapışmış</div><div class="compare-item">Asimptot eğimleri $\\pm b/a$ küçük</div><div class="compare-item">Hiperbol "neredeyse parabol"</div><div class="compare-item">Örnek: $e = 1.05$ &rarr; $b/a \\approx 0.32$</div></div><div class="compare-col"><div class="compare-title">$e$ BÜYÜK</div><div class="compare-item">Kollar çok geniş, neredeyse düşey açılır</div><div class="compare-item">Asimptot eğimleri $\\pm b/a$ büyük</div><div class="compare-item">Hiperbol "neredeyse X"</div><div class="compare-item">Örnek: $e = 5$ &rarr; $b/a \\approx 4.9$</div></div></div>

<h2 class="lesson-title">10. Eşlenik Hiperbol &mdash; Esas Eksen y-ekseninde</h2>

<div class="calc-highlight"><strong>Resmi 90 derece döndür.</strong> Odakları y-eksenine $(0, \\pm c)$ noktalarına yerleştir. Standart form şu hâle gelir:</div>

<div class="calc-formula"><div class="formula-label">HİPERBOL &mdash; DÜŞEY ESAS EKSEN</div><div class="formula-main">$$\\frac{y^2}{b^2} \\;-\\; \\frac{x^2}{a^2} \\;=\\; 1$$</div><div class="formula-sub">Aynı $c^2 = a^2 + b^2$ özdeşliği geçerli. Köşeler $(0, \\pm b)$'de. Odaklar $(0, \\pm c)$'de. Asimptotlar $y = \\pm (b/a) x$ &mdash; yatay hiperbolünkiyle aynı doğrular!</div></div>

<p class="l-text">$x^2/a^2 - y^2/b^2 = 1$ ve $y^2/b^2 - x^2/a^2 = 1$ hiperbolleri aynı asimptotları paylaşır ama dik yönlerde açılır. Bunlara <strong>eşlenik hiperboller</strong> denir ve birlikte iki asimptot doğrusu arasındaki dört bölgeyi doldururlar.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3 &mdash; GEOMETRİYİ OKU</div><div class="example-body"><strong>$\\dfrac{x^2}{16} - \\dfrac{y^2}{9} = 1$</strong> hiperbolünün köşelerini, odaklarını, asimptotlarını ve dış merkezliğini bul.<br><br>$x^2/a^2 - y^2/b^2 = 1$ ile eşleştir: $a^2 = 16$, yani $a = 4$ ve $b^2 = 9$, yani $b = 3$.<br><br>Köşeler: $(\\pm a, 0) = \\mathbf{(\\pm 4, 0)}$.<br>Odaklar: $c^2 = a^2 + b^2 = 16 + 9 = 25$, yani $c = 5$. Odaklar $\\mathbf{(\\pm 5, 0)}$.<br>Asimptotlar: $y = \\pm (b/a) x = \\mathbf{y = \\pm \\tfrac{3}{4} x}$.<br>Dış merkezlik: $e = c/a = 5/4 = \\mathbf{1.25}$.</div></div>

<div class="calc-graph"><div id="plot-l81-hyper-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $x^2/16 - y^2/9 = 1$ hiperbolü (mavi, iki kol), odaklar $(\\pm 5, 0)$ turuncu, köşeler $(\\pm 4, 0)$ yeşil ve iki asimptot $y = \\pm \\tfrac{3}{4} x$ kesikli gri doğru olarak çizildi. Yarı genişliği 4, yarı yüksekliği 3 olan dikdörtgen soluk şekilde gösterildi &mdash; asimptotlar tam olarak bu dikdörtgenin köşegenlerinin uzantısıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var aHT=4,bHT=3,cHT=5;
var x1T=[];var y1UT=[];var y1LT=[];for(var i=0;i<=200;i++){var x=aHT+i*0.06;x1T.push(x);var y=bHT*Math.sqrt(x*x/(aHT*aHT)-1);y1UT.push(y);y1LT.push(-y);}
var x2T=[];var y2UT=[];var y2LT=[];for(var i=0;i<=200;i++){var x=-aHT-i*0.06;x2T.push(x);var y=bHT*Math.sqrt(x*x/(aHT*aHT)-1);y2UT.push(y);y2LT.push(-y);}
var rightUT={x:x1T,y:y1UT,mode:'lines',name:'sağ kol',line:{color:'#3b82f6',width:3}};
var rightLT={x:x1T,y:y1LT,mode:'lines',line:{color:'#3b82f6',width:3},showlegend:false};
var leftUT={x:x2T,y:y2UT,mode:'lines',name:'sol kol',line:{color:'#3b82f6',width:3},showlegend:false};
var leftLT={x:x2T,y:y2LT,mode:'lines',line:{color:'#3b82f6',width:3},showlegend:false};
var asyXmaxT=18;
var asy1T={x:[-asyXmaxT,asyXmaxT],y:[-bHT/aHT*asyXmaxT,bHT/aHT*asyXmaxT],mode:'lines',name:'asimptot y = +¾x',line:{color:'rgba(255,255,255,0.45)',width:1.4,dash:'dash'}};
var asy2T={x:[-asyXmaxT,asyXmaxT],y:[bHT/aHT*asyXmaxT,-bHT/aHT*asyXmaxT],mode:'lines',name:'asimptot y = −¾x',line:{color:'rgba(255,255,255,0.45)',width:1.4,dash:'dash'}};
var boxT={x:[-aHT,aHT,aHT,-aHT,-aHT],y:[-bHT,-bHT,bHT,bHT,-bHT],mode:'lines',name:'kutu',line:{color:'rgba(245,158,11,0.35)',width:1.2,dash:'dot'}};
var fociT={x:[-cHT,cHT],y:[0,0],mode:'markers+text',name:'odaklar',marker:{color:'#f59e0b',size:11},text:['F₁','F₂'],textposition:'bottom center',textfont:{color:'#f59e0b',size:13}};
var vertT={x:[-aHT,aHT],y:[0,0],mode:'markers+text',name:'köşeler',marker:{color:'#10b981',size:9},text:['(−4,0)','(4,0)'],textposition:'top center',textfont:{color:'#10b981',size:11}};
var axxHT={x:[-asyXmaxT,asyXmaxT],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var ayyHT={x:[0,0],y:[-asyXmaxT*0.75,asyXmaxT*0.75],mode:'lines',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var layHT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-14,14],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},yaxis:{range:[-10,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l81-hyper-tr',[axxHT,ayyHT,asy1T,asy2T,boxT,rightUT,rightLT,leftUT,leftLT,vertT,fociT],layHT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. Üç Konik Yan Yana</h2>

<div class="calc-highlight"><strong>Elips, parabol ve hiperbol &mdash; üçü de "konik kesitlerdir": bir çift koniyi bir düzlemle keserek elde edilen eğriler.</strong> Yatay bir kesim çember verir; bir koniyi keserken eğik kesim elips verir; eğik kenara paralel kesim parabol verir; daha dik bir kesim (her iki koniyi de kesen) hiperbol verir. Cebirsel olarak hepsi tek bir dış merkezlik sayısıyla birleşir.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Konik</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Geometrik yer kuralı</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Standart form</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$c$ ile $a, b$ ilişkisi</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Dış merkezlik $e$</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Çember</strong></td><td style="padding:0.5rem 0.8rem">$|PC| = r$</td><td style="padding:0.5rem 0.8rem">$x^2 + y^2 = r^2$</td><td style="padding:0.5rem 0.8rem">$c = 0$</td><td style="padding:0.5rem 0.8rem">0</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Elips</strong></td><td style="padding:0.5rem 0.8rem">$|PF_1| + |PF_2| = 2a$</td><td style="padding:0.5rem 0.8rem">$x^2/a^2 + y^2/b^2 = 1$</td><td style="padding:0.5rem 0.8rem">$c^2 = a^2 - b^2$</td><td style="padding:0.5rem 0.8rem">$0 \\leq e < 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Parabol</strong></td><td style="padding:0.5rem 0.8rem">$|PF| = \\text{uzaklik}(P, \\ell)$</td><td style="padding:0.5rem 0.8rem">$y^2 = 4px$ veya $x^2 = 4py$</td><td style="padding:0.5rem 0.8rem">&mdash; (tek odak)</td><td style="padding:0.5rem 0.8rem">$e = 1$</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>Hiperbol</strong></td><td style="padding:0.5rem 0.8rem">$|\\,|PF_1| - |PF_2|\\,| = 2a$</td><td style="padding:0.5rem 0.8rem">$x^2/a^2 - y^2/b^2 = 1$</td><td style="padding:0.5rem 0.8rem">$c^2 = a^2 + b^2$</td><td style="padding:0.5rem 0.8rem">$e > 1$</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l81-three-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> üç konik tek bir çerçevede, hepsi aynı ölçekte. Yeşildeki elips $x^2/16 + y^2/9 = 1$ kapalıdır; turuncudaki parabol $y^2 = 4x$ tek kol hâlinde sonsuza kadar sağa açılır; pembedeki hiperbol $x^2/4 - y^2/3 = 1$ iki açık kola sahiptir. Üçünü bir araya getirmek aile benzerliğini &mdash; ve aile farklılıklarını &mdash; bir bakışta görünür kılar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var exT=[];var eyT=[];for(var i=0;i<=400;i++){var a=2*Math.PI*i/400;exT.push(4*Math.cos(a));eyT.push(3*Math.sin(a));}
var ellipseT={x:exT,y:eyT,mode:'lines',name:'elips x²/16 + y²/9 = 1',line:{color:'#10b981',width:2.5}};
var pyArrT=[];var pxArrT=[];for(var i=-200;i<=200;i++){var y=i*0.04;pyArrT.push(y);pxArrT.push(y*y/4);}
var parabT={x:pxArrT,y:pyArrT,mode:'lines',name:'parabol y² = 4x',line:{color:'#f59e0b',width:2.5}};
var aHT2=2,bHT2=Math.sqrt(3);
var hx1T=[];var hy1UT=[];var hy1LT=[];for(var i=0;i<=160;i++){var x=aHT2+i*0.04;hx1T.push(x);var y=bHT2*Math.sqrt(x*x/(aHT2*aHT2)-1);hy1UT.push(y);hy1LT.push(-y);}
var hx2T=[];var hy2UT=[];var hy2LT=[];for(var i=0;i<=160;i++){var x=-aHT2-i*0.04;hx2T.push(x);var y=bHT2*Math.sqrt(x*x/(aHT2*aHT2)-1);hy2UT.push(y);hy2LT.push(-y);}
var hyperRT={x:hx1T,y:hy1UT,mode:'lines',name:'hiperbol x²/4 − y²/3 = 1',line:{color:'#ec4899',width:2.5}};
var hyperRLT={x:hx1T,y:hy1LT,mode:'lines',line:{color:'#ec4899',width:2.5},showlegend:false};
var hyperLT={x:hx2T,y:hy2UT,mode:'lines',line:{color:'#ec4899',width:2.5},showlegend:false};
var hyperLLT={x:hx2T,y:hy2LT,mode:'lines',line:{color:'#ec4899',width:2.5},showlegend:false};
var ax3T={x:[-9,9],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var ay3T={x:[0,0],y:[-6,6],mode:'lines',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var lay3T={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-9,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},yaxis:{range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l81-three-tr',[ax3T,ay3T,ellipseT,parabT,hyperRT,hyperRLT,hyperLT,hyperLLT],lay3T,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$c^2$ özdeşliğinin işareti</div><div class="card-body"><strong>Elips</strong> için $c^2 = a^2 - b^2$ ($c < a$, her iki odak da eğrinin içinde). <strong>Hiperbol</strong> için $c^2 = a^2 + b^2$ ($c > a$, odaklar köşelerin dışında). Bunları karıştırmak en sık yapılan hatadır. Bir bellek anahtarı: standart formdaki işaret, $c^2$ özdeşliğindeki işaretle eşleşir (elipste $+y^2/b^2$ var ve $c^2$ formülünde $-b^2$; hiperbolde $-y^2/b^2$ var ve $+b^2$).</div></div>
<div class="calc-card"><div class="card-title">Asimptot eğimi &mdash; $\\pm$ işareti</div><div class="card-body">Bir hiperbolün <em>iki</em> asimptotu vardır, $y = +\\tfrac{b}{a}x$ <strong>ve</strong> $y = -\\tfrac{b}{a}x$. Yalnızca birini yazmak yarım cevaptır. Her zaman $\\pm$ çiftini belirt.</div></div>
<div class="calc-card"><div class="card-title">Hiperbolün yönü</div><div class="card-body">$y^2/b^2$'nin önündeki eksi işaret hiperbolün yatay (x-ekseni boyunca) açıldığını söyler. $x^2/a^2$'nin önündeki eksi ise düşey açıldığını söyler. <em>Pozitif</em> katsayılı değişken esas ekseni adlandırır.</div></div>
<div class="calc-card"><div class="card-title">Parabolde $4p$ ile $p$</div><div class="card-body">$y^2 = 4px$'te $x$'in katsayısı $p$ değil $4p$'dir. $y^2 = 8x$'i "$p = 8$" diye okumak yanlış &mdash; doğru değer $p = 2$. Odağı okumadan önce her zaman katsayıyı 4'e böl.</div></div>
</div>

<h2 class="lesson-title">13. Çözümlü Egzersizler</h2>

<p class="l-text">Dersin her iki yarısını kapsayan kısa bir karışık set. Çözümü okumadan önce her birini kendin dene.</p>

<div class="calc-example"><div class="example-label">EGZERSİZ 1 &mdash; PARABOL STANDART FORM</div><div class="example-body"><strong>$x^2 = -12y$'nin odağını ve doğrultmanını bul.</strong><br><br>$x^2 = 4py$ ile eşleştir: $4p = -12$, yani $p = -3$. Düşey eksen, aşağı açılır (negatif $p$).<br><br>Odak: $(0, p) = \\mathbf{(0, -3)}$. Doğrultman: $y = -p = \\mathbf{y = 3}$. Tepe orijinde.</div></div>

<div class="calc-example"><div class="example-label">EGZERSİZ 2 &mdash; ODAK VE DOĞRULTMANDAN PARABOL</div><div class="example-body"><strong>Odağı $(0, 4)$ ve doğrultmanı $y = -4$ olan parabolün denklemini bul.</strong><br><br>Tepe odak ile doğrultmanın tam ortasındadır: $(0, 0)$. Eksen düşey (odak y-ekseninde), yukarı açılır.<br>Tepe-odak uzaklığı: $p = 4$. $x^2 = 4py = 16y$ kullan.<br><br>Cevap: $\\mathbf{x^2 = 16y}$.</div></div>

<div class="calc-example"><div class="example-label">EGZERSİZ 3 &mdash; ÖTELENMİŞ PARABOL</div><div class="example-body"><strong>$(x - 2)^2 = 8(y + 1)$ parabolünü tanımla.</strong><br><br>Tepe formu $(x - h)^2 = 4p(y - k)$ ile $h = 2$, $k = -1$, $4p = 8 \\Rightarrow p = 2$.<br><br>Tepe: $\\mathbf{(2, -1)}$. Odak: $(h, k + p) = \\mathbf{(2, 1)}$. Doğrultman: $y = k - p = \\mathbf{y = -3}$. Yukarı açılır.</div></div>

<div class="calc-example"><div class="example-label">EGZERSİZ 4 &mdash; HİPERBOL STANDART FORM</div><div class="example-body"><strong>$\\dfrac{x^2}{25} - \\dfrac{y^2}{144} = 1$'in odaklarını, köşelerini ve asimptotlarını bul.</strong><br><br>$a^2 = 25 \\Rightarrow a = 5$, $b^2 = 144 \\Rightarrow b = 12$. Yatay esas eksen.<br>$c^2 = a^2 + b^2 = 25 + 144 = 169 \\Rightarrow c = 13$.<br><br>Köşeler: $\\mathbf{(\\pm 5, 0)}$. Odaklar: $\\mathbf{(\\pm 13, 0)}$. Asimptotlar: $\\mathbf{y = \\pm \\tfrac{12}{5} x}$. Dış merkezlik $e = 13/5 = 2.6$.</div></div>

<div class="calc-example"><div class="example-label">EGZERSİZ 5 &mdash; EŞLENİK HİPERBOL</div><div class="example-body"><strong>$\\dfrac{y^2}{4} - \\dfrac{x^2}{9} = 1$'in köşelerini ve odaklarını bul.</strong><br><br>Düşey esas eksen ($y^2$ pozitif). Burada $y^2/b^2 - x^2/a^2 = 1$ formunda $b^2 = 4$ ve $a^2 = 9$, dolayısıyla köşeler y-ekseninde $(0, \\pm b) = \\mathbf{(0, \\pm 2)}$.<br>$c^2 = a^2 + b^2 = 9 + 4 = 13 \\Rightarrow c = \\sqrt{13}$. Odaklar: $\\mathbf{(0, \\pm \\sqrt{13})}$.<br><br>Asimptotlar: $y = \\pm (b/a) x = \\mathbf{y = \\pm \\tfrac{2}{3} x}$.</div></div>

<div class="calc-example"><div class="example-label">EGZERSİZ 6 &mdash; ODAK VE KÖŞELERDEN HİPERBOL</div><div class="example-body"><strong>Odakları $(\\pm 10, 0)$ ve köşeleri $(\\pm 6, 0)$ olan bir hiperbolün denklemini bul.</strong><br><br>Köşelerden $(\\pm a, 0)$: $a = 6$, yani $a^2 = 36$.<br>Odaklardan $(\\pm c, 0)$: $c = 10$, yani $c^2 = 100$.<br>$c^2 = a^2 + b^2 \\Rightarrow b^2 = 100 - 36 = 64$.<br><br>Denklem: $\\mathbf{\\dfrac{x^2}{36} - \\dfrac{y^2}{64} = 1}$.</div></div>

<div class="calc-example"><div class="example-label">EGZERSİZ 7 &mdash; DIŞ MERKEZLİK</div><div class="example-body"><strong>$\\dfrac{x^2}{49} - \\dfrac{y^2}{576} = 1$'in dış merkezliğini bul.</strong><br><br>$a^2 = 49 \\Rightarrow a = 7$, $b^2 = 576 \\Rightarrow b = 24$.<br>$c^2 = a^2 + b^2 = 49 + 576 = 625 \\Rightarrow c = 25$.<br><br>$e = c/a = 25/7 \\approx \\mathbf{3.57}$. Geniş açılı bir hiperbol.</div></div>

<div class="calc-example"><div class="example-label">EGZERSİZ 8 &mdash; PARABOLİK YANSITICI</div><div class="example-body"><strong>Bir el feneri reflektörü $x^2 = 16y$ parabolüdür (cm). Yayılan demetin paralel olması için ampul nereye yerleştirilir?</strong><br><br>$4p = 16 \\Rightarrow p = 4$. Odak $(0, 4)$ &mdash; ampul, simetri ekseni üzerinde <strong>tepeden 4 cm yukarıya</strong> yerleştirilir. Yansıma özelliği gereği F'den çıkan her ışın paraboleden y-eksenine paralel yansır ve dar, ileri yönlü bir demet üretir.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><strong>Parabol</strong> = odak F ile doğrultman $\\ell$'den eşit uzaklıkta noktaların geometrik yeri</li>
<li>Standart formlar: $y^2 = 4px$ (yatay, odak $(p, 0)$, doğrultman $x = -p$); $x^2 = 4py$ (düşey, odak $(0, p)$, doğrultman $y = -p$)</li>
<li>Ötelenmiş tepe formu: $(y - k)^2 = 4p(x - h)$ ile tepe $(h, k)$; düşey eksen için benzer form</li>
<li>Yansıma özelliği: eksene paralel ışınlar odakta birleşir &mdash; uydu çanakları ve farların arkasındaki ilke</li>
<li><strong>Hiperbol</strong> = $|\\,|PF_1| - |PF_2|\\,| = 2a$ sabit olan noktaların geometrik yeri</li>
<li>Standart form $x^2/a^2 - y^2/b^2 = 1$; odaklar $(\\pm c, 0)$ ile $c^2 = a^2 + b^2$, asimptotlar $y = \\pm (b/a) x$</li>
<li>Dış merkezlik $e = c/a > 1$; $e$ büyüdükçe kollar daha geniş açılır</li>
<li>Eşlenik form $y^2/b^2 - x^2/a^2 = 1$ resmi 90&deg; döndürür; iki form aynı asimptotları paylaşır</li>
<li><strong>Anahtar işaret kuralı:</strong> elips $c^2 = a^2 - b^2$; hiperbol $c^2 = a^2 + b^2$ &mdash; bunları asla karıştırma</li>
</ul>
</div>`
};
