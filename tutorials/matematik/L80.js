window.LISE_MAT_L80 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Take a piece of string, fix its two ends to a board with thumbtacks, and pull a pencil tight against the loop.</strong> Now move the pencil around the board keeping the string taut. The curve you trace is not a circle — it is something subtler. It is an <em>ellipse</em>: the locus of all points whose <em>sum of distances</em> to two fixed points stays constant. Replace one thumbtack with the Sun and the moving pencil with the Earth, and you have just sketched a planetary orbit. The same shape describes elliptical reflectors in cardiology machines, whispering galleries in old domes, and the cross-section of a flashlight beam hitting a wall at an angle.</p>

<p class="l-text">By the end of this lesson you will know the geometric definition of an ellipse, the standard equation $x^2/a^2 + y^2/b^2 = 1$, the meaning of every parameter in it ($a$, $b$, $c$, eccentricity $e$), where the foci sit, how to translate the ellipse to an arbitrary centre $(h, k)$, the length of the latus rectum, the tangent line at a point, and how to read Kepler's first law in this language. We will work through three full sketching examples and catalogue the most common errors students make.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define an ellipse as the locus of points whose sum of distances to two fixed foci equals a constant $2a$</li>
<li>Read off semi-major axis $a$, semi-minor axis $b$, focal distance $c$, and eccentricity $e = c/a$ from the standard equation $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$</li>
<li>Use the fundamental relation $c^2 = a^2 - b^2$ to find any of $a$, $b$, $c$ given the other two</li>
<li>Translate an ellipse to centre $(h, k)$ via $\\frac{(x-h)^2}{a^2} + \\frac{(y-k)^2}{b^2} = 1$</li>
<li>Compute the latus rectum length $2b^2/a$ and write the tangent line at a point on the ellipse</li>
<li>Connect the equation to physical reality through Kepler's first law: planetary orbits are ellipses with the Sun at one focus</li>
</ul>
</div>

<h2 class="lesson-title">1. The Garden-String Definition</h2>

<div class="calc-highlight"><strong>An ellipse is defined by a sum, not a single distance.</strong> A circle has one centre; an ellipse has two special points called <em>foci</em> (singular: focus). The ellipse is the set of all points whose <em>sum of distances</em> to those two foci stays the same as you move around. That fixed sum is traditionally written as $2a$, and $a$ — the <em>semi-major axis</em> — will turn out to be one of the most important numbers attached to the curve.</div>

<p class="l-text">Geometrically, an <strong>ellipse</strong> with foci $F_1$ and $F_2$ is the locus:</p>

<div class="calc-formula"><div class="formula-label">ELLIPSE &mdash; THE FUNDAMENTAL DEFINITION</div><div class="formula-main">$$\\{ P : \\; |PF_1| + |PF_2| \\;=\\; 2a \\}$$</div><div class="formula-sub">Pick two points $F_1, F_2$ in the plane and a constant $2a$ greater than the distance $|F_1 F_2|$. The set of points whose total distance to the two foci equals $2a$ is an ellipse.</div></div>

<p class="l-text"><strong>Why the constant must exceed $|F_1 F_2|$.</strong> If $2a$ were less than $|F_1 F_2|$, no point could be close enough to both foci — the triangle inequality would forbid it. If $2a$ equalled $|F_1 F_2|$, only points on the segment between the two foci would qualify, and the locus would degenerate into that segment. We always require $2a > |F_1 F_2|$ to get a proper closed curve.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Foci $F_1, F_2$</div><div class="card-body">Two fixed points in the plane. The ellipse "lives between them" in a sense — the curve always wraps around both.</div></div>
<div class="calc-card"><div class="card-title">Sum $2a$</div><div class="card-body">A fixed positive constant strictly larger than $|F_1 F_2|$. Determines the size of the ellipse. Half of it, $a$, is the semi-major axis.</div></div>
<div class="calc-card"><div class="card-title">Centre</div><div class="card-body">The midpoint of $F_1 F_2$. The ellipse is symmetric about this point.</div></div>
</div>

<div class="l-note"><strong>Special case &mdash; the circle.</strong> If you push both foci to the same point ($F_1 = F_2$), the condition $|PF_1| + |PF_2| = 2a$ becomes $2 |PF| = 2a$, i.e. $|PF| = a$. That is a circle of radius $a$. A circle is an ellipse with coincident foci — the limiting case of zero eccentricity.</div>

<h2 class="lesson-title">2. The Standard Form at the Origin</h2>

<div class="calc-highlight"><strong>To turn the geometric definition into an equation, we place the foci symmetrically on the x-axis.</strong> Put $F_1 = (-c, 0)$ and $F_2 = (c, 0)$ for some positive $c$. Then "the sum of distances to the foci equals $2a$" becomes an algebraic statement about a point $(x, y)$, which we can simplify into the famous standard form.</div>

<p class="l-text">Start with the definition. A point $P = (x, y)$ on the ellipse satisfies:</p>

<div class="calc-formula"><div class="formula-label">FROM DEFINITION TO EQUATION</div><div class="formula-main">$$\\sqrt{(x+c)^2 + y^2} + \\sqrt{(x-c)^2 + y^2} \\;=\\; 2a$$</div><div class="formula-sub">Two square roots from the distance formula, applied to each focus.</div></div>

<p class="l-text">The algebra to clear those square roots is a one-time exercise (isolate one root, square, simplify, isolate the remaining root, square again). The result, after substituting $b^2 = a^2 - c^2$, is one of the cleanest equations in mathematics:</p>

<div class="calc-formula"><div class="formula-label">STANDARD FORM &mdash; ELLIPSE CENTRED AT THE ORIGIN, MAJOR AXIS ON $x$</div><div class="formula-main">$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} \\;=\\; 1 \\qquad (a > b > 0)$$</div><div class="formula-sub">$a$ is the semi-major axis (longer), $b$ is the semi-minor axis (shorter). The two are connected to the focal distance $c$ by the relation $c^2 = a^2 - b^2$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Semi-major axis $a$</div><div class="card-body">Half the longest diameter of the ellipse. Lies along the focal axis. Always the larger of the two semi-axes.</div></div>
<div class="calc-card"><div class="card-title">Semi-minor axis $b$</div><div class="card-body">Half the shortest diameter. Perpendicular to the major axis through the centre. Satisfies $b < a$.</div></div>
<div class="calc-card"><div class="card-title">Focal distance $c$</div><div class="card-body">Distance from the centre to each focus. Computed from $c = \\sqrt{a^2 - b^2}$. Always less than $a$.</div></div>
</div>

<p class="l-text"><strong>Vertices.</strong> The ellipse crosses the x-axis at $(\\pm a, 0)$ and the y-axis at $(0, \\pm b)$. The points $(\\pm a, 0)$ are called the <em>major vertices</em> (or simply vertices), and $(0, \\pm b)$ are the <em>minor vertices</em> (sometimes called <em>co-vertices</em>). They are the extreme points of the curve in each axis direction.</p>

<div class="calc-formula"><div class="formula-label">KEY POINTS ON THE STANDARD ELLIPSE</div><div class="formula-main">$$\\text{vertices: } (\\pm a, 0) \\qquad \\text{co-vertices: } (0, \\pm b) \\qquad \\text{foci: } (\\pm c, 0)$$</div><div class="formula-sub">All three pairs lie on the symmetry axes. Reading them off the equation lets you sketch the ellipse in seconds.</div></div>

<h2 class="lesson-title">3. The $a^2 = b^2 + c^2$ Relation</h2>

<div class="calc-highlight"><strong>The three parameters $a$, $b$, $c$ are not independent.</strong> They are bound by a single Pythagorean-looking identity that comes directly from the geometry: $c^2 = a^2 - b^2$. Equivalently, $a^2 = b^2 + c^2$. Whenever you know two of them, the third is determined.</div>

<p class="l-text"><strong>Where this relation comes from.</strong> Pick the co-vertex $(0, b)$ on the top of the ellipse. By definition, the sum of its distances to the two foci equals $2a$. By symmetry, both distances are equal, so each equals $a$. Now look at the right triangle with vertices at the origin, the focus $(c, 0)$, and the co-vertex $(0, b)$. Its legs are $c$ and $b$, its hypotenuse is the distance from $(c, 0)$ to $(0, b)$, which equals $a$. Pythagoras gives $a^2 = b^2 + c^2$ directly.</p>

<div class="calc-formula"><div class="formula-label">THE FUNDAMENTAL RELATION</div><div class="formula-main">$$c^2 \\;=\\; a^2 - b^2 \\qquad\\Leftrightarrow\\qquad a^2 \\;=\\; b^2 + c^2$$</div><div class="formula-sub">Memorise the minus sign. It is the most common source of error in problems on this topic.</div></div>

<div class="l-note"><strong>Compare with the hyperbola.</strong> The next lesson studies the hyperbola, where the analogous relation is $c^2 = a^2 + b^2$ (a plus sign). The signs differ because for a hyperbola the foci sit <em>outside</em> the curve, while for an ellipse they sit <em>inside</em>. Mixing the two up is the single most common conic-section mistake on exams.</div>

<h2 class="lesson-title">4. Eccentricity: How "Squashed" Is the Ellipse?</h2>

<div class="calc-highlight"><strong>The eccentricity is one number that summarises the shape of an ellipse.</strong> Defined as $e = c/a$, it lies strictly between 0 and 1 for any non-degenerate ellipse. Small $e$ means the foci are bunched near the centre and the ellipse is nearly circular. Large $e$ (close to 1) means the foci are pushed near the vertices and the ellipse is very elongated, almost a thin sliver.</div>

<div class="calc-formula"><div class="formula-label">ECCENTRICITY</div><div class="formula-main">$$e \\;=\\; \\frac{c}{a} \\qquad 0 \\;\\le\\; e \\;<\\; 1$$</div><div class="formula-sub">$e = 0$ corresponds to a circle ($c = 0$, foci collapse to the centre). $e \\to 1$ corresponds to an ellipse stretched out to look almost like a line segment.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$e = 0$ (circle)</div><div class="card-body">Foci coincide at the centre. The locus condition reduces to a single distance: $|PF| = a$, a circle of radius $a$.</div></div>
<div class="calc-card"><div class="card-title">$e \\approx 0.5$ (Mars)</div><div class="card-body">Mars orbits the Sun with $e \\approx 0.0934$. Earth has $e \\approx 0.0167$ — almost circular. The classroom "garden string" picture is exaggerated; real planetary orbits are nearly circles.</div></div>
<div class="calc-card"><div class="card-title">$e \\approx 0.97$ (Halley's comet)</div><div class="card-body">Halley's comet has $e \\approx 0.967$ — extremely elongated. Its orbit takes it from inside Mercury's orbit to beyond Neptune.</div></div>
</div>

<div class="calc-graph"><div id="plot-l80-ellipse-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the ellipse $x^2/25 + y^2/9 = 1$ with $a = 5$, $b = 3$, $c = 4$. The two foci sit at $(\\pm 4, 0)$ on the major axis. Vertices are at $(\\pm 5, 0)$ and co-vertices at $(0, \\pm 3)$. The dashed orange chord through the top focus is the latus rectum of length $2b^2/a = 18/5 = 3.6$. The eccentricity is $e = 4/5 = 0.8$ — moderately elongated.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;th.push(a);xc.push(5*Math.cos(a));yc.push(3*Math.sin(a));}
var ellipse={x:xc,y:yc,mode:'lines',name:'x²/25 + y²/9 = 1',line:{color:'#3b82f6',width:3}};
var foci={x:[-4,4],y:[0,0],mode:'markers+text',name:'foci (±4, 0)',marker:{color:'#ef4444',size:11,symbol:'x'},text:['F₁(−4,0)','F₂(4,0)'],textposition:'bottom center',textfont:{color:'#ef4444',size:12}};
var vert={x:[-5,5,0,0],y:[0,0,-3,3],mode:'markers+text',name:'vertices / co-vertices',marker:{color:'#f59e0b',size:10},text:['(−5,0)','(5,0)','(0,−3)','(0,3)'],textposition:['bottom right','bottom left','bottom center','top center'],textfont:{color:'#e8e8e8',size:11}};
var majA={x:[-5,5],y:[0,0],mode:'lines',name:'major axis (2a = 10)',line:{color:'rgba(245,158,11,0.7)',width:2,dash:'dot'}};
var minA={x:[0,0],y:[-3,3],mode:'lines',name:'minor axis (2b = 6)',line:{color:'rgba(16,185,129,0.7)',width:2,dash:'dot'}};
var lrY = 9/5;
var latus={x:[4,4],y:[-lrY,lrY],mode:'lines',name:'latus rectum (2b²/a = 3.6)',line:{color:'rgba(245,158,11,0.95)',width:2.5,dash:'dash'}};
var axX={x:[-6.5,6.5],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var axY={x:[0,0],y:[-4.5,4.5],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-4.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l80-ellipse-en',[axX,axY,majA,minA,ellipse,latus,foci,vert],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; READING OFF PARAMETERS</div><div class="example-body">For the ellipse $\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1$, identify $a$, $b$, $c$, the vertices, the foci, and the eccentricity.<br><br>$a^2 = 25 \\Rightarrow a = 5$. $b^2 = 9 \\Rightarrow b = 3$. Since $25 > 9$ the major axis lies on $x$.<br>$c^2 = a^2 - b^2 = 25 - 9 = 16 \\Rightarrow c = 4$.<br>Vertices: $(\\pm 5, 0)$. Co-vertices: $(0, \\pm 3)$. Foci: $(\\pm 4, 0)$.<br>Eccentricity: $e = c/a = 4/5 = \\mathbf{0.8}$.</div></div>

<h2 class="lesson-title">5. Major Axis on the y-Axis</h2>

<div class="calc-highlight"><strong>If the denominator under $y^2$ is the larger one, the ellipse is "tall and thin" — its major axis lies along the y-axis instead of the x-axis.</strong> The equation looks identical except that the larger constant now sits below $y^2$, and the foci move to the y-axis.</div>

<div class="calc-formula"><div class="formula-label">STANDARD FORM &mdash; MAJOR AXIS ON $y$</div><div class="formula-main">$$\\frac{x^2}{b^2} + \\frac{y^2}{a^2} \\;=\\; 1 \\qquad (a > b > 0)$$</div><div class="formula-sub">Vertices at $(0, \\pm a)$. Co-vertices at $(\\pm b, 0)$. Foci at $(0, \\pm c)$. Same $c^2 = a^2 - b^2$.</div></div>

<p class="l-text"><strong>How to tell which is which.</strong> Look at the two denominators. The bigger one tells you which axis the major axis sits on. If the bigger denominator is under $x^2$, the ellipse is "wide and short" with horizontal major axis. If the bigger denominator is under $y^2$, the ellipse is "tall and thin" with vertical major axis. Always set $a^2$ to be the bigger denominator — this is a convention many students forget, and it is the source of countless sign errors.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Sketch and identify the parameters of $\\dfrac{x^2}{9} + \\dfrac{y^2}{25} = 1$.<br><br>The bigger denominator (25) sits under $y^2$, so the major axis is vertical.<br>$a^2 = 25 \\Rightarrow a = 5$ (along y). $b^2 = 9 \\Rightarrow b = 3$ (along x).<br>$c^2 = 25 - 9 = 16 \\Rightarrow c = 4$.<br>Vertices: $(0, \\pm 5)$. Co-vertices: $(\\pm 3, 0)$. Foci: $(0, \\pm 4)$.<br>This is the same ellipse as the previous example, rotated 90° — a useful sanity check.</div></div>

<h2 class="lesson-title">6. The Ellipse Translated to Centre $(h, k)$</h2>

<div class="calc-highlight"><strong>Move the whole picture by $h$ units right and $k$ units up.</strong> Each $x$ in the equation becomes $x - h$, and each $y$ becomes $y - k$. The shape stays the same; only the centre shifts.</div>

<div class="calc-formula"><div class="formula-label">ELLIPSE CENTRED AT $(h, k)$, MAJOR AXIS HORIZONTAL</div><div class="formula-main">$$\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} \\;=\\; 1$$</div><div class="formula-sub">Vertices: $(h \\pm a, k)$. Co-vertices: $(h, k \\pm b)$. Foci: $(h \\pm c, k)$.</div></div>

<p class="l-text">If the major axis is vertical instead, swap $a^2$ and $b^2$:</p>

<div class="calc-formula"><div class="formula-label">ELLIPSE CENTRED AT $(h, k)$, MAJOR AXIS VERTICAL</div><div class="formula-main">$$\\frac{(x - h)^2}{b^2} + \\frac{(y - k)^2}{a^2} \\;=\\; 1$$</div><div class="formula-sub">Vertices: $(h, k \\pm a)$. Co-vertices: $(h \\pm b, k)$. Foci: $(h, k \\pm c)$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Sketch $\\dfrac{(x - 2)^2}{16} + \\dfrac{(y + 1)^2}{4} = 1$.<br><br>Centre: $(h, k) = (2, -1)$.<br>$a^2 = 16 \\Rightarrow a = 4$ (horizontal, since 16 sits under $x^2$). $b^2 = 4 \\Rightarrow b = 2$.<br>$c^2 = 16 - 4 = 12 \\Rightarrow c = 2\\sqrt{3} \\approx 3.46$.<br>Vertices: $(2 \\pm 4, -1) = (-2, -1)$ and $(6, -1)$.<br>Co-vertices: $(2, -1 \\pm 2) = (2, -3)$ and $(2, 1)$.<br>Foci: $(2 \\pm 2\\sqrt{3}, -1)$.</div></div>

<h2 class="lesson-title">7. Completing the Square: From General to Standard Form</h2>

<div class="calc-highlight"><strong>Most ellipse equations in textbooks do not arrive in standard form.</strong> A general second-degree equation $Ax^2 + Cy^2 + Dx + Ey + F = 0$ (with $A$ and $C$ both positive but unequal) hides an ellipse — you just have to dig it out by completing the square in both $x$ and $y$.</div>

<p class="l-text">The algorithm:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1: Group $x$ and $y$ terms</div><div class="card-body">Collect all $x^2$ and $x$ terms together, all $y^2$ and $y$ terms together. Move constants to the right side.</div></div>
<div class="calc-card"><div class="card-title">Step 2: Factor out leading coefficients</div><div class="card-body">Pull $A$ out of the $x$-group and $C$ out of the $y$-group, leaving a clean $x^2 + \\ldots$ and $y^2 + \\ldots$ inside each parenthesis.</div></div>
<div class="calc-card"><div class="card-title">Step 3: Complete the square</div><div class="card-body">Inside each parenthesis, add half-of-the-linear-coefficient squared. Compensate on the right side, remembering the factored leading coefficient.</div></div>
<div class="calc-card"><div class="card-title">Step 4: Divide to make the right side 1</div><div class="card-body">Final cleanup gives the standard form $\\frac{(x-h)^2}{a^2} + \\frac{(y-k)^2}{b^2} = 1$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; CONVERTING $9x^2 + 16y^2 - 144 = 0$</div><div class="example-body"><strong>Start:</strong> $9x^2 + 16y^2 = 144$.<br><br>No linear terms, so completing the square is unnecessary. Just divide both sides by 144 to make the right side 1:<br><br>$\\dfrac{9x^2}{144} + \\dfrac{16y^2}{144} = 1 \\;\\Rightarrow\\; \\dfrac{x^2}{16} + \\dfrac{y^2}{9} = 1$.<br><br>Read off: $a^2 = 16$, $b^2 = 9$, so $a = 4$, $b = 3$, $c = \\sqrt{16 - 9} = \\sqrt{7}$. Major axis horizontal. Vertices $(\\pm 4, 0)$, foci $(\\pm \\sqrt{7}, 0)$, eccentricity $e = \\sqrt{7}/4 \\approx 0.66$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; A FULL COMPLETE-THE-SQUARE</div><div class="example-body">Convert $4x^2 + 9y^2 - 16x + 18y - 11 = 0$ to standard form.<br><br><strong>Group:</strong> $(4x^2 - 16x) + (9y^2 + 18y) = 11$.<br><strong>Factor:</strong> $4(x^2 - 4x) + 9(y^2 + 2y) = 11$.<br><strong>Complete squares:</strong> $4(x^2 - 4x + 4) + 9(y^2 + 2y + 1) = 11 + 16 + 9 = 36$.<br><strong>Rewrite:</strong> $4(x - 2)^2 + 9(y + 1)^2 = 36$.<br><strong>Divide by 36:</strong> $\\dfrac{(x-2)^2}{9} + \\dfrac{(y+1)^2}{4} = 1$.<br><br>Centre $(2, -1)$, $a = 3$, $b = 2$, $c = \\sqrt{5}$. Horizontal major axis. Foci at $(2 \\pm \\sqrt{5}, -1)$.</div></div>

<h2 class="lesson-title">8. The Latus Rectum (Focal Chord)</h2>

<div class="calc-highlight"><strong>The latus rectum is the chord of the ellipse that passes through a focus perpendicular to the major axis.</strong> Its length, $2b^2/a$, gives a quick measure of how "wide" the ellipse is at the focus level — important in astronomy (orbital parameters) and optics (reflector geometry).</div>

<p class="l-text"><strong>Derivation.</strong> Plug $x = c$ into the standard equation $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$:</p>

<div class="calc-formula"><div class="formula-label">SOLVING FOR THE FOCAL-CHORD HEIGHT</div><div class="formula-main">$$\\frac{c^2}{a^2} + \\frac{y^2}{b^2} = 1 \\;\\Rightarrow\\; y^2 = b^2 \\left(1 - \\frac{c^2}{a^2}\\right) = \\frac{b^2(a^2 - c^2)}{a^2} = \\frac{b^4}{a^2}$$</div><div class="formula-sub">In the last step we used $a^2 - c^2 = b^2$, the fundamental relation in reverse.</div></div>

<p class="l-text">So $y = \\pm b^2/a$ at the focus level. The chord goes from $(c, -b^2/a)$ to $(c, b^2/a)$, which has total length:</p>

<div class="calc-formula"><div class="formula-label">LATUS RECTUM LENGTH</div><div class="formula-main">$$\\ell \\;=\\; \\frac{2 b^2}{a}$$</div><div class="formula-sub">A clean, symmetric formula. The same length holds at both foci — the ellipse is symmetric.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">For the ellipse $\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1$, the latus rectum length is $\\dfrac{2 \\cdot 9}{5} = \\dfrac{18}{5} = \\mathbf{3.6}$. So the chord through either focus, perpendicular to the major axis, measures 3.6 units. Compare with the major-axis length $2a = 10$ — the ellipse is much wider than it is at the focus level, as expected.</div></div>

<h2 class="lesson-title">9. Tangent Line at a Point on the Ellipse</h2>

<div class="calc-highlight"><strong>There is a remarkably symmetric formula for the tangent to an ellipse at a point on it.</strong> If $P_0 = (x_0, y_0)$ lies on $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$, then the tangent line at $P_0$ has equation $\\frac{x x_0}{a^2} + \\frac{y y_0}{b^2} = 1$. Just replace one $x$ with $x_0$ and one $y$ with $y_0$ in the standard equation.</div>

<div class="calc-formula"><div class="formula-label">TANGENT LINE TO THE ELLIPSE AT $P_0 = (x_0, y_0)$</div><div class="formula-main">$$\\frac{x \\, x_0}{a^2} + \\frac{y \\, y_0}{b^2} \\;=\\; 1$$</div><div class="formula-sub">$P_0$ must actually lie on the ellipse — that is, satisfy the standard equation. Otherwise the formula does not produce a tangent.</div></div>

<p class="l-text">For an ellipse centred at $(h, k)$, the analogous tangent at a point $(x_0, y_0)$ on it is:</p>

<div class="calc-formula"><div class="formula-label">TRANSLATED TANGENT</div><div class="formula-main">$$\\frac{(x - h)(x_0 - h)}{a^2} + \\frac{(y - k)(y_0 - k)}{b^2} \\;=\\; 1$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the tangent line to $\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1$ at the point $(3, 12/5)$.<br><br>Check it lies on the ellipse: $\\dfrac{9}{25} + \\dfrac{144/25}{9} = \\dfrac{9}{25} + \\dfrac{16}{25} = 1$ &check;.<br><br>Apply the tangent formula with $x_0 = 3$, $y_0 = 12/5$:<br>$\\dfrac{3x}{25} + \\dfrac{(12/5)y}{9} = 1 \\;\\Rightarrow\\; \\dfrac{3x}{25} + \\dfrac{12y}{45} = 1 \\;\\Rightarrow\\; \\dfrac{3x}{25} + \\dfrac{4y}{15} = 1$.<br><br>Multiply through by 75 to clear fractions: $9x + 20y = 75$. That is the tangent line.</div></div>

<h2 class="lesson-title">10. Kepler's First Law: The Solar System Runs on Ellipses</h2>

<div class="calc-highlight"><strong>Johannes Kepler announced in 1609 that each planet sweeps out an ellipse with the Sun at one focus &mdash; not the centre, one focus.</strong> This single observation, drawn from Tycho Brahe's tables of Mars's positions, broke 2000 years of Greek astronomy and set the stage for Newton's law of gravitation. The conic section you just learned about is not a textbook abstraction; it is the trajectory of every planet, moon, and comet in the Solar System.</div>

<p class="l-text"><strong>Kepler's three laws,</strong> stated together for context (we will not derive the second and third here — they belong in calculus):</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">First Law (the geometry)</div><div class="card-body">Each planet moves along an ellipse with the Sun at one of the two foci. The other focus is empty space — there is no twin star there.</div></div>
<div class="calc-card"><div class="card-title">Second Law (equal areas)</div><div class="card-body">The line connecting the planet to the Sun sweeps out equal areas in equal times. Implies the planet moves faster near perihelion (closest point) and slower at aphelion (farthest).</div></div>
<div class="calc-card"><div class="card-title">Third Law (periods)</div><div class="card-body">$T^2 \\propto a^3$: the square of the orbital period is proportional to the cube of the semi-major axis. Lets us measure the size of the Solar System.</div></div>
</div>

<p class="l-text"><strong>Perihelion and aphelion.</strong> The closest approach of a planet to the Sun is called <em>perihelion</em>; the farthest, <em>aphelion</em>. From the geometry of the ellipse:</p>

<div class="calc-formula"><div class="formula-label">EXTREME DISTANCES FROM THE FOCUS</div><div class="formula-main">$$r_{\\min} \\;=\\; a(1 - e) \\qquad r_{\\max} \\;=\\; a(1 + e)$$</div><div class="formula-sub">$a$ is the semi-major axis; $e$ is the eccentricity. The two distances add to $2a$, as the focal definition demands.</div></div>

<div class="calc-graph"><div id="plot-l80-orbit-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a planetary orbit with eccentricity $e = 0.6$ (exaggerated for visibility — real planets are closer to circles). The Sun sits at the left focus (red), the other focus is empty (grey cross). Perihelion is on the right; aphelion on the left. The dashed segments illustrate the focal distances from the Sun to a point on the orbit, summing to $2a$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var aE=5;var eE=0.6;var bE=aE*Math.sqrt(1-eE*eE);var cE=aE*eE;
var th=[];var xc=[];var yc=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;th.push(a);xc.push(aE*Math.cos(a));yc.push(bE*Math.sin(a));}
var orbit={x:xc,y:yc,mode:'lines',name:'planetary orbit (e=0.6)',line:{color:'#3b82f6',width:3}};
var sun={x:[-cE],y:[0],mode:'markers+text',name:'Sun (focus)',marker:{color:'#fbbf24',size:18,line:{color:'#f59e0b',width:2}},text:['☉ Sun'],textposition:'bottom center',textfont:{color:'#fbbf24',size:13}};
var emptyF={x:[cE],y:[0],mode:'markers+text',name:'empty focus',marker:{color:'rgba(255,255,255,0.5)',size:10,symbol:'x'},text:['(empty)'],textposition:'bottom center',textfont:{color:'rgba(235,230,220,0.6)',size:10}};
var peri={x:[aE],y:[0],mode:'markers+text',name:'perihelion',marker:{color:'#10b981',size:11},text:['perihelion'],textposition:'top right',textfont:{color:'#10b981',size:11}};
var apo={x:[-aE],y:[0],mode:'markers+text',name:'aphelion',marker:{color:'#ef4444',size:11},text:['aphelion'],textposition:'top left',textfont:{color:'#ef4444',size:11}};
var planetAngle = 2.1;
var planetX = aE*Math.cos(planetAngle);
var planetY = bE*Math.sin(planetAngle);
var planet={x:[planetX],y:[planetY],mode:'markers+text',name:'planet',marker:{color:'#60a5fa',size:13},text:['planet'],textposition:'top center',textfont:{color:'#60a5fa',size:11}};
var r1={x:[-cE,planetX],y:[0,planetY],mode:'lines',name:'r₁ (to Sun)',line:{color:'rgba(251,191,36,0.7)',width:2,dash:'dash'}};
var r2={x:[cE,planetX],y:[0,planetY],mode:'lines',name:'r₂ (to empty focus)',line:{color:'rgba(255,255,255,0.4)',width:1.5,dash:'dot'}};
var axX={x:[-7,7],y:[0,0],mode:'lines',name:'major axis',line:{color:'rgba(255,255,255,0.2)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l80-orbit-en',[axX,orbit,r1,r2,sun,emptyF,peri,apo,planet],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Real eccentricities, for perspective.</strong> Earth $e \\approx 0.017$ (nearly a perfect circle). Mars $e \\approx 0.093$. Pluto $e \\approx 0.249$. Halley's comet $e \\approx 0.967$. Highly elliptical satellites like Molniya have $e \\approx 0.74$. The classroom plot above with $e = 0.6$ is dramatic but not extreme.</div>

<h2 class="lesson-title">11. Comparing Eccentricities Side by Side</h2>

<p class="l-text">Plotting several ellipses with the same semi-major axis but different eccentricities makes the geometric meaning of $e$ concrete. Low $e$: nearly round. High $e$: increasingly squashed.</p>

<div class="calc-graph"><div id="plot-l80-eccentric-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> four ellipses all with semi-major axis $a = 5$ but different eccentricities $e \\in \\{0.0, 0.4, 0.7, 0.9\\}$. As $e$ grows the foci spread outward and the ellipse stretches into a thinner, longer shape. At $e = 0$ (the inner curve) you see a perfect circle.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var aE=5;var traces=[];var colors=['#3b82f6','#10b981','#f59e0b','#ef4444'];var ecc=[0.0,0.4,0.7,0.9];
for(var k=0;k<ecc.length;k++){
  var eK=ecc[k];var bK=aE*Math.sqrt(1-eK*eK);var cK=aE*eK;
  var xs=[];var ys=[];for(var i=0;i<=360;i++){var ang=2*Math.PI*i/360;xs.push(aE*Math.cos(ang));ys.push(bK*Math.sin(ang));}
  traces.push({x:xs,y:ys,mode:'lines',name:'e = '+eK.toFixed(1),line:{color:colors[k],width:2.6}});
  if(eK>0){traces.push({x:[-cK,cK],y:[0,0],mode:'markers',name:'foci (e='+eK.toFixed(1)+')',marker:{color:colors[k],size:9,symbol:'x'},showlegend:false});}
}
var axX={x:[-6,6],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.2)',width:1},showlegend:false};
var axY={x:[0,0],y:[-5.5,5.5],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.2)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-5.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l80-eccentric-en',[axX,axY].concat(traces),lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Building an Ellipse from Foci and a Vertex</h2>

<p class="l-text">Going the other direction is just as useful: given the foci and one vertex, reconstruct the standard equation. The recipe uses the focal-sum definition plus $c^2 = a^2 - b^2$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the equation of the ellipse with foci at $(\\pm 4, 0)$ and a vertex at $(5, 0)$.<br><br>The vertex $(5, 0)$ lies on the major axis (the x-axis here, since both foci are on it). So $a = 5$, giving $a^2 = 25$.<br><br>Foci at $(\\pm 4, 0)$ means $c = 4$, so $c^2 = 16$.<br><br>$b^2 = a^2 - c^2 = 25 - 16 = 9$.<br><br>Equation: $\\boxed{\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; ECCENTRICITY GIVEN</div><div class="example-body">Find the equation of the ellipse whose centre is the origin, major axis is along the x-axis, eccentricity is $1/2$, and which passes through $(2, 3)$.<br><br>$e = c/a = 1/2 \\Rightarrow c = a/2$, hence $c^2 = a^2/4$. Then $b^2 = a^2 - c^2 = 3a^2/4$.<br><br>The equation is $\\dfrac{x^2}{a^2} + \\dfrac{y^2}{3a^2/4} = 1$.<br><br>Plug in $(2, 3)$: $\\dfrac{4}{a^2} + \\dfrac{9}{3a^2/4} = 1 \\Rightarrow \\dfrac{4}{a^2} + \\dfrac{12}{a^2} = 1 \\Rightarrow \\dfrac{16}{a^2} = 1 \\Rightarrow a^2 = 16$.<br><br>So $b^2 = 12$. Equation: $\\boxed{\\dfrac{x^2}{16} + \\dfrac{y^2}{12} = 1}$.</div></div>

<h2 class="lesson-title">13. Common Errors and How to Avoid Them</h2>

<p class="l-text">A short catalogue of the mistakes that cost the most marks on exams. None of them comes from deep misunderstanding — they all come from rushing.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Error 1: confusing $a$ and $b$</div><div class="card-body">Always set $a^2$ equal to the <em>larger</em> denominator. If the equation is $\\frac{x^2}{9} + \\frac{y^2}{25} = 1$, then $a^2 = 25$ (not 9) and the major axis is vertical. Forgetting this gives the wrong axes, vertices, and foci.</div></div>
<div class="calc-card"><div class="card-title">Error 2: wrong sign in $c^2$</div><div class="card-body">For an ellipse, $c^2 = a^2 - b^2$. <em>Minus</em>, not plus. Confusing this with the hyperbola formula (which has a plus) is the most common conic-section error on standardised tests.</div></div>
<div class="calc-card"><div class="card-title">Error 3: putting the foci on the wrong axis</div><div class="card-body">The foci always sit on the <em>major</em> axis. If $a^2$ is under $x^2$, foci are on the x-axis at $(\\pm c, 0)$. If $a^2$ is under $y^2$, foci are on the y-axis at $(0, \\pm c)$. Never put them on the minor axis.</div></div>
<div class="calc-card"><div class="card-title">Error 4: forgetting to square-root</div><div class="card-body">After computing $a^2 = 25$ you have $a^2$, not $a$. Take the square root: $a = 5$. Same for $b$ and $c$. The denominators of the standard equation are squared quantities.</div></div>
<div class="calc-card"><div class="card-title">Error 5: misreading translated ellipses</div><div class="card-body">In $\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1$ the centre is $(h, k)$, not $(-h, -k)$. The sign in the formula is "minus" so the centre's coordinates appear directly.</div></div>
<div class="calc-card"><div class="card-title">Error 6: forgetting the constraint $a > b$</div><div class="card-body">An ellipse has $a > b > 0$ by convention; if you end up with $b > a$ after labelling, you have mis-labelled the axes. Swap them and re-identify which axis is major.</div></div>
</div>

<h2 class="lesson-title">14. Practice Problems</h2>

<p class="l-text">An exercise set bringing together everything in this lesson. Try each one yourself first; then read the solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; SKETCH AND IDENTIFY</div><div class="example-body"><strong>For the ellipse $\\dfrac{x^2}{36} + \\dfrac{y^2}{25} = 1$, find $a$, $b$, $c$, the eccentricity, the vertices, and the foci.</strong><br><br>$a^2 = 36 \\Rightarrow a = 6$. $b^2 = 25 \\Rightarrow b = 5$. Major axis on x (since 36 > 25).<br>$c^2 = 36 - 25 = 11 \\Rightarrow c = \\sqrt{11}$.<br>$e = c/a = \\sqrt{11}/6 \\approx 0.553$.<br>Vertices: $(\\pm 6, 0)$. Co-vertices: $(0, \\pm 5)$. Foci: $(\\pm \\sqrt{11}, 0)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; STANDARD FORM FROM FOCI AND VERTEX</div><div class="example-body"><strong>Find the equation of the ellipse with foci $(\\pm 3, 0)$ and a vertex at $(5, 0)$.</strong><br><br>$a = 5$ from the vertex. $c = 3$ from the foci.<br>$b^2 = a^2 - c^2 = 25 - 9 = 16 \\Rightarrow b = 4$.<br>Equation: $\\boxed{\\dfrac{x^2}{25} + \\dfrac{y^2}{16} = 1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; CONVERTING GENERAL FORM</div><div class="example-body"><strong>Convert $9x^2 + 16y^2 - 144 = 0$ to standard form and identify the foci.</strong><br><br>$9x^2 + 16y^2 = 144 \\;\\Rightarrow\\; \\dfrac{x^2}{16} + \\dfrac{y^2}{9} = 1$.<br>$a^2 = 16$, $b^2 = 9$, $c^2 = 7 \\Rightarrow c = \\sqrt{7}$.<br>Foci: $\\mathbf{(\\pm \\sqrt{7}, 0)}$. Eccentricity $e = \\sqrt{7}/4 \\approx 0.661$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; TRANSLATED ELLIPSE</div><div class="example-body"><strong>Sketch $\\dfrac{(x + 3)^2}{25} + \\dfrac{(y - 2)^2}{9} = 1$ and find its centre and foci.</strong><br><br>Centre: $(-3, 2)$. $a = 5$, $b = 3$, $c = 4$.<br>Major axis horizontal (parallel to x-axis), so foci shift left/right by $c$ from the centre:<br>Foci: $(-3 \\pm 4, 2) = \\mathbf{(-7, 2) \\text{ and } (1, 2)}$.<br>Vertices: $(-3 \\pm 5, 2) = (-8, 2)$ and $(2, 2)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; LATUS RECTUM</div><div class="example-body"><strong>Find the length of the latus rectum of $\\dfrac{x^2}{49} + \\dfrac{y^2}{24} = 1$.</strong><br><br>$a^2 = 49$, $b^2 = 24$. Length $= 2b^2/a = 2 \\cdot 24 / 7 = 48/7 \\approx \\mathbf{6.857}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; TANGENT LINE</div><div class="example-body"><strong>Find the tangent line to $\\dfrac{x^2}{16} + \\dfrac{y^2}{9} = 1$ at the point $(2, 3\\sqrt{3}/2)$.</strong><br><br>First check the point lies on the ellipse: $\\dfrac{4}{16} + \\dfrac{27/4}{9} = \\dfrac{1}{4} + \\dfrac{3}{4} = 1$ &check;.<br>Apply $\\dfrac{x \\cdot 2}{16} + \\dfrac{y \\cdot 3\\sqrt{3}/2}{9} = 1$.<br>Simplify: $\\dfrac{x}{8} + \\dfrac{\\sqrt{3} y}{6} = 1$, or equivalently $\\mathbf{3x + 4\\sqrt{3} y = 24}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; KEPLER, PERIHELION/APHELION</div><div class="example-body"><strong>A satellite orbits Earth in an ellipse with semi-major axis $a = 8000$ km and eccentricity $e = 0.1$. Compute perihelion and aphelion distances (from the focus where Earth sits).</strong><br><br>$r_{\\min} = a(1 - e) = 8000 \\cdot 0.9 = 7200$ km.<br>$r_{\\max} = a(1 + e) = 8000 \\cdot 1.1 = 8800$ km.<br><br>The satellite's distance from Earth oscillates between 7200 km (perigee) and 8800 km (apogee). Check: their average $(7200+8800)/2 = 8000 = a$ &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; ECCENTRICITY GIVEN POINT</div><div class="example-body"><strong>An ellipse has its centre at the origin, major axis along $x$, passes through $(4, 0)$ as a vertex, and through $(2, \\sqrt{3})$. Find its eccentricity.</strong><br><br>Vertex $(4, 0)$ gives $a = 4$, $a^2 = 16$.<br>Plug $(2, \\sqrt{3})$ into $\\dfrac{x^2}{16} + \\dfrac{y^2}{b^2} = 1$: $\\dfrac{4}{16} + \\dfrac{3}{b^2} = 1 \\Rightarrow \\dfrac{3}{b^2} = \\dfrac{3}{4} \\Rightarrow b^2 = 4$.<br>$c^2 = a^2 - b^2 = 16 - 4 = 12 \\Rightarrow c = 2\\sqrt{3}$.<br>$e = c/a = 2\\sqrt{3}/4 = \\mathbf{\\sqrt{3}/2 \\approx 0.866}$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Ellipse = locus of points whose <em>sum</em> of distances to two foci equals a constant $2a$</li>
<li>Standard form at origin: $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ with $a > b > 0$; major axis along $x$</li>
<li>If the larger denominator sits under $y^2$, the major axis is vertical instead</li>
<li>Fundamental relation: $c^2 = a^2 - b^2$ (minus, not plus &mdash; that is the hyperbola)</li>
<li>Vertices $(\\pm a, 0)$, co-vertices $(0, \\pm b)$, foci $(\\pm c, 0)$ &mdash; foci always on the major axis</li>
<li>Eccentricity $e = c/a$ lives in $[0, 1)$: 0 is a circle, near 1 is a very elongated ellipse</li>
<li>Translated form: $\\frac{(x-h)^2}{a^2} + \\frac{(y-k)^2}{b^2} = 1$ has centre $(h, k)$</li>
<li>Latus rectum length: $2b^2/a$; tangent at $(x_0, y_0)$: $\\frac{x x_0}{a^2} + \\frac{y y_0}{b^2} = 1$</li>
<li>Kepler's first law: planets orbit the Sun in ellipses with the Sun at one focus; $r_{\\min} = a(1-e)$, $r_{\\max} = a(1+e)$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bir parça ip al, iki ucunu bir tahtaya raptiyelerle sabitle, sonra ipin oluşturduğu halkayı bir kalemle dış kenardan gergin tut.</strong> Şimdi kalemi tahta üzerinde gezdir; ip her zaman gergin kalsın. İzlediğin eğri bir çember değil, daha incelikli bir şey: bir <em>elips</em>. İki sabit noktaya olan <em>uzaklıkların toplamı</em> sabit kalan tüm noktaların kümesi. Bir raptiyeyi Güneş ile, hareket eden kalemi de Dünya ile değiştirirsen, az önce bir gezegen yörüngesi çizmişsindir. Aynı şekil kardiyolojide kullanılan eliptik yansıtıcıları, eski kubbelerdeki fısıltı galerilerini ve bir el feneri ışığının duvara açıyla düşmesi sonucu oluşan kesiti de tanımlar.</p>

<p class="l-text">Bu dersin sonunda elipsin geometrik tanımını, $x^2/a^2 + y^2/b^2 = 1$ standart denklemini, içerdiği her parametrenin ($a$, $b$, $c$, dış merkezlik $e$) anlamını, odakların konumunu, elipsi keyfi bir merkez $(h, k)$'ye nasıl öteleyeceğini, latus rectum (odak kirişi) uzunluğunu, bir noktadaki teğet doğrusunu ve Kepler'in birinci yasasını bu dilde nasıl okuyacağını öğreneceksin. Üç tam çizim örneği üzerinde çalışacağız ve öğrencilerin yaptığı en yaygın hataları katalogluyacağız.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Elipsi, iki sabit odağa olan uzaklıkları toplamı $2a$ sabitine eşit olan noktaların kümesi olarak tanımlamak</li>
<li>$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ standart denkleminden büyük yarı eksen $a$, küçük yarı eksen $b$, odak uzaklığı $c$ ve dış merkezlik $e = c/a$'yı okumak</li>
<li>$c^2 = a^2 - b^2$ temel bağıntısını kullanarak $a$, $b$, $c$'den herhangi birini diğer ikisinden bulmak</li>
<li>Elipsi merkez $(h, k)$'ye $\\frac{(x-h)^2}{a^2} + \\frac{(y-k)^2}{b^2} = 1$ ile ötelemek</li>
<li>Latus rectum uzunluğunu $2b^2/a$ hesaplamak ve elips üzerindeki bir noktadaki teğet doğruyu yazmak</li>
<li>Denklemi fiziksel gerçeklikle ilişkilendirmek &mdash; Kepler'in birinci yasası: gezegen yörüngeleri Güneş bir odakta olan elipslerdir</li>
</ul>
</div>

<h2 class="lesson-title">1. Bahçe-İpi Tanımı</h2>

<div class="calc-highlight"><strong>Bir elips tek bir uzaklıkla değil, bir <em>toplam</em>la tanımlanır.</strong> Çemberin tek bir merkezi vardır; elipsin <em>odak</em> denen iki özel noktası vardır (tekil: odak). Elips, bu iki odağa olan <em>uzaklıkları toplamı</em> sabit kalan tüm noktaların kümesidir. O sabit toplam geleneksel olarak $2a$ ile gösterilir ve $a$ &mdash; <em>büyük yarı eksen</em> &mdash; eğriye bağlı en önemli sayılardan biri olacaktır.</div>

<p class="l-text">Geometrik olarak, odakları $F_1$ ve $F_2$ olan bir <strong>elips</strong> şu yerdir:</p>

<div class="calc-formula"><div class="formula-label">ELİPS &mdash; TEMEL TANIM</div><div class="formula-main">$$\\{ P : \\; |PF_1| + |PF_2| \\;=\\; 2a \\}$$</div><div class="formula-sub">Düzlemde iki nokta $F_1, F_2$ ve $|F_1 F_2|$ uzaklığından büyük bir $2a$ sabiti seç. İki odağa olan uzaklıkları toplamı $2a$'ya eşit olan noktaların kümesi bir elipstir.</div></div>

<p class="l-text"><strong>Sabit neden $|F_1 F_2|$'den büyük olmalı.</strong> Eğer $2a$, $|F_1 F_2|$'den küçük olsaydı, hiçbir nokta iki odağa birden yeterince yakın olamazdı &mdash; üçgen eşitsizliği buna izin vermezdi. Eğer $2a$, $|F_1 F_2|$'ye eşit olsaydı, sadece iki odak arasındaki segment üzerindeki noktalar koşulu sağlardı ve yer (locus), o segmente dejenere olurdu. Düzgün, kapalı bir eğri elde etmek için her zaman $2a > |F_1 F_2|$ olmasını isteriz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Odaklar $F_1, F_2$</div><div class="card-body">Düzlemde iki sabit nokta. Elips bir anlamda "onların arasında yaşar" &mdash; eğri her zaman her iki odağı da sarar.</div></div>
<div class="calc-card"><div class="card-title">Toplam $2a$</div><div class="card-body">$|F_1 F_2|$'den kesinlikle büyük, pozitif, sabit. Elipsin boyutunu belirler. Yarısı, $a$, büyük yarı eksendir.</div></div>
<div class="calc-card"><div class="card-title">Merkez</div><div class="card-body">$F_1 F_2$'nin orta noktası. Elips bu nokta etrafında simetriktir.</div></div>
</div>

<div class="l-note"><strong>Özel durum &mdash; çember.</strong> İki odağı da aynı noktaya getirirsen ($F_1 = F_2$), $|PF_1| + |PF_2| = 2a$ koşulu $2 |PF| = 2a$, yani $|PF| = a$ olur. Bu, $a$ yarıçaplı bir çemberdir. Çember, odakları çakışan bir elipstir &mdash; sıfır dış merkezlikli limit durumu.</div>

<h2 class="lesson-title">2. Orijinde Standart Form</h2>

<div class="calc-highlight"><strong>Geometrik tanımı bir denkleme dönüştürmek için odakları x-ekseni üzerine simetrik olarak yerleştirelim.</strong> $F_1 = (-c, 0)$ ve $F_2 = (c, 0)$ olsun (bir pozitif $c$ için). O zaman "odaklara uzaklıkların toplamı $2a$'ya eşit" ifadesi $(x, y)$ noktası için cebirsel bir ifade haline gelir; bu ifadeyi sadeleştirip ünlü standart formu elde edebiliriz.</div>

<p class="l-text">Tanımdan başla. Elips üzerindeki bir $P = (x, y)$ noktası şunu sağlar:</p>

<div class="calc-formula"><div class="formula-label">TANIMDAN DENKLEME</div><div class="formula-main">$$\\sqrt{(x+c)^2 + y^2} + \\sqrt{(x-c)^2 + y^2} \\;=\\; 2a$$</div><div class="formula-sub">Her odak için uzaklık formülünden gelen iki kare kök.</div></div>

<p class="l-text">Bu kare kökleri temizlemek için yapılan cebir, bir defalık bir alıştırmadır (bir kökü yalnız bırak, kare al, sadeleştir, kalan kökü yalnız bırak, tekrar kare al). $b^2 = a^2 - c^2$ koyduktan sonra sonuç, matematikteki en temiz denklemlerden biri olur:</p>

<div class="calc-formula"><div class="formula-label">STANDART FORM &mdash; ORİJİNDE MERKEZLİ, BÜYÜK EKSEN $x$ ÜZERİNDE</div><div class="formula-main">$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} \\;=\\; 1 \\qquad (a > b > 0)$$</div><div class="formula-sub">$a$ büyük yarı eksen (daha uzun), $b$ küçük yarı eksendir (daha kısa). İki yarı eksen, odak uzaklığı $c$ ile $c^2 = a^2 - b^2$ bağıntısı üzerinden bağlantılıdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Büyük yarı eksen $a$</div><div class="card-body">Elipsin en uzun çapının yarısı. Odak ekseni boyunca uzanır. İki yarı eksenden her zaman daha büyük olanı.</div></div>
<div class="calc-card"><div class="card-title">Küçük yarı eksen $b$</div><div class="card-body">En kısa çapın yarısı. Merkez boyunca büyük eksene diktir. $b < a$'yı sağlar.</div></div>
<div class="calc-card"><div class="card-title">Odak uzaklığı $c$</div><div class="card-body">Merkezden her bir odağa olan uzaklık. $c = \\sqrt{a^2 - b^2}$ ile hesaplanır. Her zaman $a$'dan küçüktür.</div></div>
</div>

<p class="l-text"><strong>Köşeler.</strong> Elips x-eksenini $(\\pm a, 0)$'da, y-eksenini ise $(0, \\pm b)$'de keser. $(\\pm a, 0)$ noktalarına <em>büyük köşeler</em> (ya da kısaca köşeler), $(0, \\pm b)$ noktalarına ise <em>küçük köşeler</em> (bazen <em>yardımcı köşeler</em>) denir. Her bir eksen yönünde eğrinin uç noktalarıdır.</p>

<div class="calc-formula"><div class="formula-label">STANDART ELİPSTEKİ ÖNEMLİ NOKTALAR</div><div class="formula-main">$$\\text{köşeler: } (\\pm a, 0) \\qquad \\text{yardımcı köşeler: } (0, \\pm b) \\qquad \\text{odaklar: } (\\pm c, 0)$$</div><div class="formula-sub">Her üç çift de simetri eksenleri üzerindedir. Onları denklemden okumak elipsi saniyeler içinde çizmeni sağlar.</div></div>

<h2 class="lesson-title">3. $a^2 = b^2 + c^2$ Bağıntısı</h2>

<div class="calc-highlight"><strong>$a$, $b$, $c$ parametreleri bağımsız değildir.</strong> Doğrudan geometriden gelen Pisagor benzeri tek bir özdeşlikle birbirlerine bağlıdırlar: $c^2 = a^2 - b^2$. Eşdeğer olarak, $a^2 = b^2 + c^2$. İkisini bildiğin her durumda üçüncüsü belirlenmiştir.</div>

<p class="l-text"><strong>Bu bağıntının nereden geldiği.</strong> Elipsin üst kısmındaki yardımcı köşe $(0, b)$'yi seç. Tanım gereği, iki odağa olan uzaklıkları toplamı $2a$'dır. Simetri gereği, her iki uzaklık eşittir, dolayısıyla her biri $a$'dır. Şimdi köşeleri orijin, odak $(c, 0)$ ve yardımcı köşe $(0, b)$ olan dik üçgene bak. Dik kenarları $c$ ve $b$, hipotenüsü $(c, 0)$'dan $(0, b)$'ye uzaklık olup $a$'ya eşittir. Pisagor doğrudan $a^2 = b^2 + c^2$ verir.</p>

<div class="calc-formula"><div class="formula-label">TEMEL BAĞINTI</div><div class="formula-main">$$c^2 \\;=\\; a^2 - b^2 \\qquad\\Leftrightarrow\\qquad a^2 \\;=\\; b^2 + c^2$$</div><div class="formula-sub">Eksi işaretini ezberle. Bu konudaki sorularda en yaygın hata kaynağıdır.</div></div>

<div class="l-note"><strong>Hiperbol ile karşılaştır.</strong> Bir sonraki ders hiperbolü inceler; orada analog bağıntı $c^2 = a^2 + b^2$'dir (artı işareti). İşaretler farklıdır çünkü hiperbol için odaklar eğrinin <em>dışında</em>, elips için ise <em>içindedir</em>. İkisini karıştırmak, sınavlarda en sık yapılan konik kesiti hatasıdır.</div>

<h2 class="lesson-title">4. Dış Merkezlik: Elips Ne Kadar "Ezilmiş"?</h2>

<div class="calc-highlight"><strong>Dış merkezlik (eksantrisite), bir elipsin şeklini özetleyen tek bir sayıdır.</strong> $e = c/a$ olarak tanımlanır ve dejenere olmayan herhangi bir elips için kesin olarak 0 ile 1 arasındadır. Küçük $e$, odakların merkeze yakın toplandığı ve elipsin neredeyse çembersel olduğu anlamına gelir. Büyük $e$ (1'e yakın), odakların köşelere itildiği ve elipsin çok uzun, neredeyse ince bir şerit gibi olduğu anlamına gelir.</div>

<div class="calc-formula"><div class="formula-label">DIŞ MERKEZLİK</div><div class="formula-main">$$e \\;=\\; \\frac{c}{a} \\qquad 0 \\;\\le\\; e \\;<\\; 1$$</div><div class="formula-sub">$e = 0$ çembere karşılık gelir ($c = 0$, odaklar merkezde çakışır). $e \\to 1$, neredeyse bir doğru parçasına benzeyene kadar gerilmiş bir elipse karşılık gelir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$e = 0$ (çember)</div><div class="card-body">Odaklar merkezde çakışır. Yer koşulu tek bir uzaklığa indirgenir: $|PF| = a$, $a$ yarıçaplı bir çember.</div></div>
<div class="calc-card"><div class="card-title">$e \\approx 0.5$ (Mars)</div><div class="card-body">Mars, Güneş etrafında $e \\approx 0.0934$ ile yörüngede döner. Dünya'nın $e \\approx 0.0167$ &mdash; neredeyse çembersel. Sınıftaki "bahçe ipi" resmi abartılıdır; gerçek gezegen yörüngeleri neredeyse çemberdir.</div></div>
<div class="calc-card"><div class="card-title">$e \\approx 0.97$ (Halley kuyrukluyıldızı)</div><div class="card-body">Halley kuyrukluyıldızının $e \\approx 0.967$ &mdash; son derece uzun. Yörüngesi onu Merkür'ün yörüngesinin içinden Neptün'ün ötesine taşır.</div></div>
</div>

<div class="calc-graph"><div id="plot-l80-ellipse-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> $x^2/25 + y^2/9 = 1$ elipsi, $a = 5$, $b = 3$, $c = 4$ ile. İki odak büyük eksen üzerinde $(\\pm 4, 0)$'da. Köşeler $(\\pm 5, 0)$, yardımcı köşeler $(0, \\pm 3)$. Üst odaktan geçen turuncu kesik çizgi latus rectum'dur; uzunluğu $2b^2/a = 18/5 = 3.6$. Dış merkezlik $e = 4/5 = 0.8$ &mdash; orta düzeyde uzun.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;th.push(a);xc.push(5*Math.cos(a));yc.push(3*Math.sin(a));}
var ellipse={x:xc,y:yc,mode:'lines',name:'x²/25 + y²/9 = 1',line:{color:'#3b82f6',width:3}};
var foci={x:[-4,4],y:[0,0],mode:'markers+text',name:'odaklar (±4, 0)',marker:{color:'#ef4444',size:11,symbol:'x'},text:['F₁(−4,0)','F₂(4,0)'],textposition:'bottom center',textfont:{color:'#ef4444',size:12}};
var vert={x:[-5,5,0,0],y:[0,0,-3,3],mode:'markers+text',name:'köşeler / yardımcı köşeler',marker:{color:'#f59e0b',size:10},text:['(−5,0)','(5,0)','(0,−3)','(0,3)'],textposition:['bottom right','bottom left','bottom center','top center'],textfont:{color:'#e8e8e8',size:11}};
var majA={x:[-5,5],y:[0,0],mode:'lines',name:'büyük eksen (2a = 10)',line:{color:'rgba(245,158,11,0.7)',width:2,dash:'dot'}};
var minA={x:[0,0],y:[-3,3],mode:'lines',name:'küçük eksen (2b = 6)',line:{color:'rgba(16,185,129,0.7)',width:2,dash:'dot'}};
var lrY = 9/5;
var latus={x:[4,4],y:[-lrY,lrY],mode:'lines',name:'latus rectum (2b²/a = 3.6)',line:{color:'rgba(245,158,11,0.95)',width:2.5,dash:'dash'}};
var axX={x:[-6.5,6.5],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var axY={x:[0,0],y:[-4.5,4.5],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-4.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l80-ellipse-tr',[axX,axY,majA,minA,ellipse,latus,foci,vert],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; PARAMETRELERİ OKUMAK</div><div class="example-body">$\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1$ elipsi için $a$, $b$, $c$, köşeleri, odakları ve dış merkezliği belirle.<br><br>$a^2 = 25 \\Rightarrow a = 5$. $b^2 = 9 \\Rightarrow b = 3$. $25 > 9$ olduğundan büyük eksen $x$ üzerindedir.<br>$c^2 = a^2 - b^2 = 25 - 9 = 16 \\Rightarrow c = 4$.<br>Köşeler: $(\\pm 5, 0)$. Yardımcı köşeler: $(0, \\pm 3)$. Odaklar: $(\\pm 4, 0)$.<br>Dış merkezlik: $e = c/a = 4/5 = \\mathbf{0.8}$.</div></div>

<h2 class="lesson-title">5. Büyük Eksen y-Ekseni Üzerinde</h2>

<div class="calc-highlight"><strong>$y^2$ altındaki payda daha büyükse, elips "uzun ve ince"dir &mdash; büyük ekseni x-ekseni yerine y-ekseni boyuncadır.</strong> Denklem aynı görünür ama daha büyük sabit şimdi $y^2$'nin altındadır ve odaklar y-eksenine taşınır.</div>

<div class="calc-formula"><div class="formula-label">STANDART FORM &mdash; BÜYÜK EKSEN $y$ ÜZERİNDE</div><div class="formula-main">$$\\frac{x^2}{b^2} + \\frac{y^2}{a^2} \\;=\\; 1 \\qquad (a > b > 0)$$</div><div class="formula-sub">Köşeler $(0, \\pm a)$. Yardımcı köşeler $(\\pm b, 0)$. Odaklar $(0, \\pm c)$. Aynı $c^2 = a^2 - b^2$.</div></div>

<p class="l-text"><strong>Hangisinin hangisi olduğunu nasıl anlarsın.</strong> İki paydaya bak. Büyük olanı, büyük eksenin hangi eksen üzerinde olduğunu söyler. Büyük payda $x^2$ altındaysa, elips "geniş ve kısa"dır ve büyük ekseni yataydır. Büyük payda $y^2$ altındaysa, elips "uzun ve ince"dir ve büyük ekseni dikeydir. $a^2$'yi her zaman büyük paydaya eşitle &mdash; bu, birçok öğrencinin unuttuğu bir kuraldır ve sayısız işaret hatasının kaynağıdır.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\dfrac{x^2}{9} + \\dfrac{y^2}{25} = 1$ elipsini çiz ve parametrelerini belirle.<br><br>Büyük payda (25) $y^2$ altında, dolayısıyla büyük eksen dikeydir.<br>$a^2 = 25 \\Rightarrow a = 5$ ($y$ boyunca). $b^2 = 9 \\Rightarrow b = 3$ ($x$ boyunca).<br>$c^2 = 25 - 9 = 16 \\Rightarrow c = 4$.<br>Köşeler: $(0, \\pm 5)$. Yardımcı köşeler: $(\\pm 3, 0)$. Odaklar: $(0, \\pm 4)$.<br>Bu, önceki örnekteki elipsin 90° döndürülmüş halidir &mdash; faydalı bir sağlamlık kontrolü.</div></div>

<h2 class="lesson-title">6. Merkez $(h, k)$'ye Ötelenmiş Elips</h2>

<div class="calc-highlight"><strong>Tüm resmi $h$ birim sağa ve $k$ birim yukarı taşı.</strong> Denklemdeki her $x$ $x - h$ olur, her $y$ ise $y - k$ olur. Şekil aynı kalır; sadece merkez kayar.</div>

<div class="calc-formula"><div class="formula-label">$(h, k)$'DE MERKEZLİ ELİPS, BÜYÜK EKSEN YATAY</div><div class="formula-main">$$\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} \\;=\\; 1$$</div><div class="formula-sub">Köşeler: $(h \\pm a, k)$. Yardımcı köşeler: $(h, k \\pm b)$. Odaklar: $(h \\pm c, k)$.</div></div>

<p class="l-text">Büyük eksen dikeyse, $a^2$ ve $b^2$'yi yer değiştir:</p>

<div class="calc-formula"><div class="formula-label">$(h, k)$'DE MERKEZLİ ELİPS, BÜYÜK EKSEN DİKEY</div><div class="formula-main">$$\\frac{(x - h)^2}{b^2} + \\frac{(y - k)^2}{a^2} \\;=\\; 1$$</div><div class="formula-sub">Köşeler: $(h, k \\pm a)$. Yardımcı köşeler: $(h \\pm b, k)$. Odaklar: $(h, k \\pm c)$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\dfrac{(x - 2)^2}{16} + \\dfrac{(y + 1)^2}{4} = 1$ elipsini çiz.<br><br>Merkez: $(h, k) = (2, -1)$.<br>$a^2 = 16 \\Rightarrow a = 4$ (yatay, çünkü 16 $x^2$ altında). $b^2 = 4 \\Rightarrow b = 2$.<br>$c^2 = 16 - 4 = 12 \\Rightarrow c = 2\\sqrt{3} \\approx 3.46$.<br>Köşeler: $(2 \\pm 4, -1) = (-2, -1)$ ve $(6, -1)$.<br>Yardımcı köşeler: $(2, -1 \\pm 2) = (2, -3)$ ve $(2, 1)$.<br>Odaklar: $(2 \\pm 2\\sqrt{3}, -1)$.</div></div>

<h2 class="lesson-title">7. Tam Kare Tamamlama: Genel Formdan Standart Forma</h2>

<div class="calc-highlight"><strong>Ders kitaplarındaki çoğu elips denklemi standart formda gelmez.</strong> $Ax^2 + Cy^2 + Dx + Ey + F = 0$ genel ikinci dereceden denklemi ($A$ ve $C$ her ikisi de pozitif ama eşit değil) bir elipsi gizler &mdash; onu hem $x$ hem $y$'de tam kareye tamamlayarak ortaya çıkarman gerekir.</div>

<p class="l-text">Algoritma:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1: $x$ ve $y$ terimlerini grupla</div><div class="card-body">Tüm $x^2$ ve $x$ terimlerini bir araya, tüm $y^2$ ve $y$ terimlerini bir araya topla. Sabitleri sağ tarafa taşı.</div></div>
<div class="calc-card"><div class="card-title">Adım 2: Baş katsayıları parantez dışına çıkar</div><div class="card-body">$x$ grubundan $A$, $y$ grubundan $C$ parantez dışına çıkar; her parantezin içinde temiz $x^2 + \\ldots$ ve $y^2 + \\ldots$ kalsın.</div></div>
<div class="calc-card"><div class="card-title">Adım 3: Tam kareye tamamla</div><div class="card-body">Her parantezin içinde, doğrusal katsayının yarısının karesini ekle. Sağ tarafta dengeyi sağla, parantez dışına aldığın katsayıyı unutma.</div></div>
<div class="calc-card"><div class="card-title">Adım 4: Sağ tarafı 1 yapmak için böl</div><div class="card-body">Son temizlik, standart formu verir: $\\frac{(x-h)^2}{a^2} + \\frac{(y-k)^2}{b^2} = 1$.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; $9x^2 + 16y^2 - 144 = 0$ DÖNÜŞÜMÜ</div><div class="example-body"><strong>Başla:</strong> $9x^2 + 16y^2 = 144$.<br><br>Doğrusal terim yok, dolayısıyla tam kareye tamamlamak gereksiz. Sadece her iki tarafı 144'e bölerek sağ tarafı 1 yap:<br><br>$\\dfrac{9x^2}{144} + \\dfrac{16y^2}{144} = 1 \\;\\Rightarrow\\; \\dfrac{x^2}{16} + \\dfrac{y^2}{9} = 1$.<br><br>Oku: $a^2 = 16$, $b^2 = 9$, yani $a = 4$, $b = 3$, $c = \\sqrt{16 - 9} = \\sqrt{7}$. Büyük eksen yatay. Köşeler $(\\pm 4, 0)$, odaklar $(\\pm \\sqrt{7}, 0)$, dış merkezlik $e = \\sqrt{7}/4 \\approx 0.66$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; TAM-KARE-TAMAMLAMA</div><div class="example-body">$4x^2 + 9y^2 - 16x + 18y - 11 = 0$ ifadesini standart forma dönüştür.<br><br><strong>Grupla:</strong> $(4x^2 - 16x) + (9y^2 + 18y) = 11$.<br><strong>Parantez dışına çıkar:</strong> $4(x^2 - 4x) + 9(y^2 + 2y) = 11$.<br><strong>Tam kareye tamamla:</strong> $4(x^2 - 4x + 4) + 9(y^2 + 2y + 1) = 11 + 16 + 9 = 36$.<br><strong>Yeniden yaz:</strong> $4(x - 2)^2 + 9(y + 1)^2 = 36$.<br><strong>36'ya böl:</strong> $\\dfrac{(x-2)^2}{9} + \\dfrac{(y+1)^2}{4} = 1$.<br><br>Merkez $(2, -1)$, $a = 3$, $b = 2$, $c = \\sqrt{5}$. Yatay büyük eksen. Odaklar $(2 \\pm \\sqrt{5}, -1)$'de.</div></div>

<h2 class="lesson-title">8. Latus Rectum (Odak Kirişi)</h2>

<div class="calc-highlight"><strong>Latus rectum, bir odaktan geçen ve büyük eksene dik olan elips kirişidir.</strong> Uzunluğu $2b^2/a$, elipsin odak seviyesinde ne kadar "geniş" olduğunun hızlı bir ölçüsünü verir &mdash; astronomide (yörünge parametreleri) ve optikte (yansıtıcı geometrisi) önemlidir.</div>

<p class="l-text"><strong>Türetme.</strong> $x = c$'yi standart denkleme $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$'e yerleştir:</p>

<div class="calc-formula"><div class="formula-label">ODAK KİRİŞİ YÜKSEKLİĞİNİ ÇÖZME</div><div class="formula-main">$$\\frac{c^2}{a^2} + \\frac{y^2}{b^2} = 1 \\;\\Rightarrow\\; y^2 = b^2 \\left(1 - \\frac{c^2}{a^2}\\right) = \\frac{b^2(a^2 - c^2)}{a^2} = \\frac{b^4}{a^2}$$</div><div class="formula-sub">Son adımda temel bağıntıyı tersine kullandık: $a^2 - c^2 = b^2$.</div></div>

<p class="l-text">Yani odak seviyesinde $y = \\pm b^2/a$. Kiriş $(c, -b^2/a)$'dan $(c, b^2/a)$'ya gider; toplam uzunluğu:</p>

<div class="calc-formula"><div class="formula-label">LATUS RECTUM UZUNLUĞU</div><div class="formula-main">$$\\ell \\;=\\; \\frac{2 b^2}{a}$$</div><div class="formula-sub">Temiz, simetrik bir formül. Aynı uzunluk her iki odakta da geçerlidir &mdash; elips simetriktir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1$ elipsinin latus rectum uzunluğu $\\dfrac{2 \\cdot 9}{5} = \\dfrac{18}{5} = \\mathbf{3.6}$'dır. Yani her bir odaktan geçen, büyük eksene dik olan kiriş 3.6 birim uzunluğundadır. Büyük-eksen uzunluğu $2a = 10$ ile karşılaştır &mdash; elips, beklendiği gibi odak seviyesinde olduğundan çok daha geniştir.</div></div>

<h2 class="lesson-title">9. Elips Üzerindeki Bir Noktada Teğet Doğru</h2>

<div class="calc-highlight"><strong>Elipsin üzerindeki bir noktada teğet için son derece simetrik bir formül vardır.</strong> $P_0 = (x_0, y_0)$, $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ üzerindeyse, $P_0$'daki teğet doğrunun denklemi $\\frac{x x_0}{a^2} + \\frac{y y_0}{b^2} = 1$'dir. Standart denklemde bir $x$'i $x_0$ ile ve bir $y$'yi $y_0$ ile değiştir.</div>

<div class="calc-formula"><div class="formula-label">ELİPS ÜZERİNDE $P_0 = (x_0, y_0)$'DAKİ TEĞET DOĞRU</div><div class="formula-main">$$\\frac{x \\, x_0}{a^2} + \\frac{y \\, y_0}{b^2} \\;=\\; 1$$</div><div class="formula-sub">$P_0$ gerçekten elips üzerinde olmalı &mdash; yani standart denklemi sağlamalı. Aksi takdirde formül bir teğet üretmez.</div></div>

<p class="l-text">$(h, k)$'de merkezli bir elips için, $(x_0, y_0)$ noktasındaki analog teğet:</p>

<div class="calc-formula"><div class="formula-label">ÖTELENMİŞ TEĞET</div><div class="formula-main">$$\\frac{(x - h)(x_0 - h)}{a^2} + \\frac{(y - k)(y_0 - k)}{b^2} \\;=\\; 1$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1$ elipsinde $(3, 12/5)$ noktasındaki teğet doğruyu bul.<br><br>Önce noktanın elips üzerinde olduğunu kontrol et: $\\dfrac{9}{25} + \\dfrac{144/25}{9} = \\dfrac{9}{25} + \\dfrac{16}{25} = 1$ &check;.<br><br>Teğet formülünü uygula: $x_0 = 3$, $y_0 = 12/5$.<br>$\\dfrac{3x}{25} + \\dfrac{(12/5)y}{9} = 1 \\;\\Rightarrow\\; \\dfrac{3x}{25} + \\dfrac{12y}{45} = 1 \\;\\Rightarrow\\; \\dfrac{3x}{25} + \\dfrac{4y}{15} = 1$.<br><br>Kesirleri temizlemek için 75 ile çarp: $9x + 20y = 75$. İşte teğet doğru.</div></div>

<h2 class="lesson-title">10. Kepler'in Birinci Yasası: Güneş Sistemi Elipslerle Çalışır</h2>

<div class="calc-highlight"><strong>Johannes Kepler 1609'da her gezegenin Güneş bir odakta olmak üzere &mdash; merkezde değil, bir odakta &mdash; bir elips çizdiğini duyurdu.</strong> Tycho Brahe'nin Mars konumlarına ait tablolarından çıkarılan bu tek gözlem, 2000 yıllık Yunan astronomisini yıktı ve Newton'un kütleçekim yasasına zemin hazırladı. Yeni öğrendiğin konik kesit, bir ders kitabı soyutlaması değil; Güneş Sistemi'ndeki her gezegen, ay ve kuyrukluyıldızın yörüngesidir.</div>

<p class="l-text"><strong>Kepler'in üç yasası,</strong> bağlam için bir arada belirtilmiştir (ikincisini ve üçüncüsünü burada türetmeyeceğiz &mdash; onlar kalkülüse aittir):</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Birinci Yasa (geometri)</div><div class="card-body">Her gezegen, Güneş'in iki odaktan birinde olduğu bir elips boyunca hareket eder. Diğer odak boş uzaydır &mdash; orada bir ikiz yıldız yoktur.</div></div>
<div class="calc-card"><div class="card-title">İkinci Yasa (eşit alanlar)</div><div class="card-body">Gezegeni Güneş'e bağlayan doğru, eşit zamanlarda eşit alanlar tarar. Bu, gezegenin günberi (en yakın nokta) yakınında daha hızlı, günöte (en uzak) yakınında daha yavaş hareket ettiği anlamına gelir.</div></div>
<div class="calc-card"><div class="card-title">Üçüncü Yasa (periyotlar)</div><div class="card-body">$T^2 \\propto a^3$: yörünge periyodunun karesi, büyük yarı eksenin küpüyle orantılıdır. Bu, Güneş Sistemi'nin boyutunu ölçmemizi sağlar.</div></div>
</div>

<p class="l-text"><strong>Günberi ve günöte.</strong> Bir gezegenin Güneş'e en yakın yaklaşmasına <em>günberi</em>, en uzak olduğu yere ise <em>günöte</em> denir. Elips geometrisinden:</p>

<div class="calc-formula"><div class="formula-label">ODAKTAN UÇ UZAKLIKLAR</div><div class="formula-main">$$r_{\\min} \\;=\\; a(1 - e) \\qquad r_{\\max} \\;=\\; a(1 + e)$$</div><div class="formula-sub">$a$ büyük yarı eksen; $e$ dış merkezlik. İki uzaklığın toplamı $2a$'dır, odak tanımının gerektirdiği gibi.</div></div>

<div class="calc-graph"><div id="plot-l80-orbit-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> $e = 0.6$ dış merkezliğe sahip bir gezegen yörüngesi (görünür olması için abartılı &mdash; gerçek gezegenler çembere daha yakındır). Güneş sol odakta (kırmızı) oturur; diğer odak boştur (gri çarpı). Günberi sağda; günöte solda. Kesik çizgiler, Güneş'ten yörünge üzerindeki bir noktaya olan odak uzaklıklarını gösterir; toplamları $2a$'dır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var aE=5;var eE=0.6;var bE=aE*Math.sqrt(1-eE*eE);var cE=aE*eE;
var th=[];var xc=[];var yc=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;th.push(a);xc.push(aE*Math.cos(a));yc.push(bE*Math.sin(a));}
var orbit={x:xc,y:yc,mode:'lines',name:'gezegen yörüngesi (e=0.6)',line:{color:'#3b82f6',width:3}};
var sun={x:[-cE],y:[0],mode:'markers+text',name:'Güneş (odak)',marker:{color:'#fbbf24',size:18,line:{color:'#f59e0b',width:2}},text:['☉ Güneş'],textposition:'bottom center',textfont:{color:'#fbbf24',size:13}};
var emptyF={x:[cE],y:[0],mode:'markers+text',name:'boş odak',marker:{color:'rgba(255,255,255,0.5)',size:10,symbol:'x'},text:['(boş)'],textposition:'bottom center',textfont:{color:'rgba(235,230,220,0.6)',size:10}};
var peri={x:[aE],y:[0],mode:'markers+text',name:'günberi',marker:{color:'#10b981',size:11},text:['günberi'],textposition:'top right',textfont:{color:'#10b981',size:11}};
var apo={x:[-aE],y:[0],mode:'markers+text',name:'günöte',marker:{color:'#ef4444',size:11},text:['günöte'],textposition:'top left',textfont:{color:'#ef4444',size:11}};
var planetAngle = 2.1;
var planetX = aE*Math.cos(planetAngle);
var planetY = bE*Math.sin(planetAngle);
var planet={x:[planetX],y:[planetY],mode:'markers+text',name:'gezegen',marker:{color:'#60a5fa',size:13},text:['gezegen'],textposition:'top center',textfont:{color:'#60a5fa',size:11}};
var r1={x:[-cE,planetX],y:[0,planetY],mode:'lines',name:'r₁ (Güneşe)',line:{color:'rgba(251,191,36,0.7)',width:2,dash:'dash'}};
var r2={x:[cE,planetX],y:[0,planetY],mode:'lines',name:'r₂ (boş odağa)',line:{color:'rgba(255,255,255,0.4)',width:1.5,dash:'dot'}};
var axX={x:[-7,7],y:[0,0],mode:'lines',name:'büyük eksen',line:{color:'rgba(255,255,255,0.2)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l80-orbit-tr',[axX,orbit,r1,r2,sun,emptyF,peri,apo,planet],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Gerçek dış merkezlikler, bakış açısı için.</strong> Dünya $e \\approx 0.017$ (neredeyse mükemmel çember). Mars $e \\approx 0.093$. Plüton $e \\approx 0.249$. Halley kuyrukluyıldızı $e \\approx 0.967$. Molniya gibi yüksek dış merkezlikli uydular $e \\approx 0.74$. Yukarıdaki $e = 0.6$ olan sınıf grafiği dramatik ama aşırı değil.</div>

<h2 class="lesson-title">11. Dış Merkezlikleri Yan Yana Karşılaştırma</h2>

<p class="l-text">Aynı büyük yarı eksene ama farklı dış merkezliklere sahip birkaç elipsi çizmek, $e$'nin geometrik anlamını somutlaştırır. Düşük $e$: neredeyse yuvarlak. Yüksek $e$: giderek daha ezilmiş.</p>

<div class="calc-graph"><div id="plot-l80-eccentric-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> hepsi $a = 5$ büyük yarı eksenli, farklı dış merkezliklere $e \\in \\{0.0, 0.4, 0.7, 0.9\\}$ sahip dört elips. $e$ büyüdükçe odaklar dışarı yayılır ve elips daha ince, daha uzun bir şekle gerilir. $e = 0$'da (iç eğri) mükemmel bir çember görürsün.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var aE=5;var traces=[];var colors=['#3b82f6','#10b981','#f59e0b','#ef4444'];var ecc=[0.0,0.4,0.7,0.9];
for(var k=0;k<ecc.length;k++){
  var eK=ecc[k];var bK=aE*Math.sqrt(1-eK*eK);var cK=aE*eK;
  var xs=[];var ys=[];for(var i=0;i<=360;i++){var ang=2*Math.PI*i/360;xs.push(aE*Math.cos(ang));ys.push(bK*Math.sin(ang));}
  traces.push({x:xs,y:ys,mode:'lines',name:'e = '+eK.toFixed(1),line:{color:colors[k],width:2.6}});
  if(eK>0){traces.push({x:[-cK,cK],y:[0,0],mode:'markers',name:'odaklar (e='+eK.toFixed(1)+')',marker:{color:colors[k],size:9,symbol:'x'},showlegend:false});}
}
var axX={x:[-6,6],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.2)',width:1},showlegend:false};
var axY={x:[0,0],y:[-5.5,5.5],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.2)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-5.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l80-eccentric-tr',[axX,axY].concat(traces),lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Odaklardan ve Bir Köşeden Elips Kurma</h2>

<p class="l-text">Ters yönde gitmek de bir o kadar kullanışlıdır: odaklar ve bir köşe verildiğinde, standart denklemi yeniden oluştur. Tarif, odak-toplamı tanımı ve $c^2 = a^2 - b^2$'yi kullanır.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Odakları $(\\pm 4, 0)$'da ve bir köşesi $(5, 0)$'da olan elipsin denklemini bul.<br><br>$(5, 0)$ köşesi büyük eksen üzerinde (burada x-ekseni, çünkü her iki odak da onun üzerinde). Yani $a = 5$, $a^2 = 25$.<br><br>$(\\pm 4, 0)$'daki odaklar $c = 4$, dolayısıyla $c^2 = 16$ anlamına gelir.<br><br>$b^2 = a^2 - c^2 = 25 - 16 = 9$.<br><br>Denklem: $\\boxed{\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; DIŞ MERKEZLİK VERİLMİŞ</div><div class="example-body">Merkezi orijin, büyük ekseni $x$ boyunca, dış merkezliği $1/2$ ve $(2, \\sqrt{3})$ noktasından geçen elipsin denklemini bul.<br><br>$e = c/a = 1/2 \\Rightarrow c = a/2$, dolayısıyla $c^2 = a^2/4$. O zaman $b^2 = a^2 - c^2 = 3a^2/4$.<br><br>Denklem $\\dfrac{x^2}{a^2} + \\dfrac{y^2}{3a^2/4} = 1$.<br><br>$(2, \\sqrt{3})$'ü yerleştir: $\\dfrac{4}{a^2} + \\dfrac{3}{3a^2/4} = 1 \\Rightarrow \\dfrac{4}{a^2} + \\dfrac{4}{a^2} = 1 \\Rightarrow \\dfrac{8}{a^2} = 1 \\Rightarrow a^2 = 8$.<br><br>O zaman $b^2 = 6$. Denklem: $\\boxed{\\dfrac{x^2}{8} + \\dfrac{y^2}{6} = 1}$.</div></div>

<h2 class="lesson-title">13. Yaygın Hatalar ve Onlardan Nasıl Kaçınılır</h2>

<p class="l-text">Sınavlarda en fazla puan kaybettiren hataların kısa bir kataloğu. Hiçbiri derin bir kavram yanlışlığından gelmez &mdash; hepsi acele etmekten kaynaklanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hata 1: $a$ ve $b$'yi karıştırmak</div><div class="card-body">Her zaman $a^2$'yi <em>büyük</em> paydaya eşitle. Denklem $\\frac{x^2}{9} + \\frac{y^2}{25} = 1$ ise, $a^2 = 25$ (9 değil) ve büyük eksen dikeydir. Bunu unutmak yanlış eksenler, köşeler ve odaklar verir.</div></div>
<div class="calc-card"><div class="card-title">Hata 2: $c^2$'de yanlış işaret</div><div class="card-body">Elips için $c^2 = a^2 - b^2$. <em>Eksi</em>, artı değil. Bunu hiperbol formülüyle (artı işaretli) karıştırmak, standart testlerdeki en yaygın konik kesiti hatasıdır.</div></div>
<div class="calc-card"><div class="card-title">Hata 3: odakları yanlış eksene koymak</div><div class="card-body">Odaklar her zaman <em>büyük</em> eksen üzerindedir. $a^2$, $x^2$ altındaysa, odaklar x-ekseninde $(\\pm c, 0)$'dadır. $a^2$, $y^2$ altındaysa, odaklar y-ekseninde $(0, \\pm c)$'dedir. Asla küçük eksene koymayın.</div></div>
<div class="calc-card"><div class="card-title">Hata 4: karekökü unutmak</div><div class="card-body">$a^2 = 25$'i hesapladıktan sonra elinde $a^2$ var, $a$ değil. Karekökünü al: $a = 5$. $b$ ve $c$ için de aynısı. Standart denklemin paydaları karesi alınmış miktarlardır.</div></div>
<div class="calc-card"><div class="card-title">Hata 5: ötelenmiş elipsleri yanlış okumak</div><div class="card-body">$\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1$ ifadesinde merkez $(h, k)$'dir, $(-h, -k)$ değil. Formüldeki işaret "eksi"dir, dolayısıyla merkez koordinatları doğrudan görünür.</div></div>
<div class="calc-card"><div class="card-title">Hata 6: $a > b$ kuralını unutmak</div><div class="card-body">Bir elipste konvansiyon gereği $a > b > 0$'dır; etiketleme sonrası $b > a$ ile karşılaşırsan eksenleri yanlış etiketlemiş demektir. Onları değiştir ve hangi eksenin büyük olduğunu yeniden belirle.</div></div>
</div>

<h2 class="lesson-title">14. Çözümlü Problemler</h2>

<p class="l-text">Bu dersteki her şeyi bir araya getiren bir alıştırma seti. Önce her birini kendin çözmeyi dene, sonra çözümü oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; ÇİZ VE TANIMLA</div><div class="example-body"><strong>$\\dfrac{x^2}{36} + \\dfrac{y^2}{25} = 1$ elipsi için $a$, $b$, $c$, dış merkezliği, köşeleri ve odakları bul.</strong><br><br>$a^2 = 36 \\Rightarrow a = 6$. $b^2 = 25 \\Rightarrow b = 5$. Büyük eksen $x$ üzerinde (36 > 25 olduğundan).<br>$c^2 = 36 - 25 = 11 \\Rightarrow c = \\sqrt{11}$.<br>$e = c/a = \\sqrt{11}/6 \\approx 0.553$.<br>Köşeler: $(\\pm 6, 0)$. Yardımcı köşeler: $(0, \\pm 5)$. Odaklar: $(\\pm \\sqrt{11}, 0)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; ODAKLARDAN VE KÖŞEDEN STANDART FORM</div><div class="example-body"><strong>Odakları $(\\pm 3, 0)$'da ve bir köşesi $(5, 0)$'da olan elipsin denklemini bul.</strong><br><br>Köşeden $a = 5$. Odaklardan $c = 3$.<br>$b^2 = a^2 - c^2 = 25 - 9 = 16 \\Rightarrow b = 4$.<br>Denklem: $\\boxed{\\dfrac{x^2}{25} + \\dfrac{y^2}{16} = 1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; GENEL FORMU DÖNÜŞTÜRME</div><div class="example-body"><strong>$9x^2 + 16y^2 - 144 = 0$ ifadesini standart forma dönüştür ve odakları belirle.</strong><br><br>$9x^2 + 16y^2 = 144 \\;\\Rightarrow\\; \\dfrac{x^2}{16} + \\dfrac{y^2}{9} = 1$.<br>$a^2 = 16$, $b^2 = 9$, $c^2 = 7 \\Rightarrow c = \\sqrt{7}$.<br>Odaklar: $\\mathbf{(\\pm \\sqrt{7}, 0)}$. Dış merkezlik $e = \\sqrt{7}/4 \\approx 0.661$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; ÖTELENMİŞ ELİPS</div><div class="example-body"><strong>$\\dfrac{(x + 3)^2}{25} + \\dfrac{(y - 2)^2}{9} = 1$ elipsini çiz ve merkezini ve odaklarını bul.</strong><br><br>Merkez: $(-3, 2)$. $a = 5$, $b = 3$, $c = 4$.<br>Büyük eksen yatay (x-eksenine paralel), dolayısıyla odaklar merkezden $c$ kadar sola/sağa kayar:<br>Odaklar: $(-3 \\pm 4, 2) = \\mathbf{(-7, 2) \\text{ ve } (1, 2)}$.<br>Köşeler: $(-3 \\pm 5, 2) = (-8, 2)$ ve $(2, 2)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; LATUS RECTUM</div><div class="example-body"><strong>$\\dfrac{x^2}{49} + \\dfrac{y^2}{24} = 1$ elipsinin latus rectum uzunluğunu bul.</strong><br><br>$a^2 = 49$, $b^2 = 24$. Uzunluk $= 2b^2/a = 2 \\cdot 24 / 7 = 48/7 \\approx \\mathbf{6.857}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; TEĞET DOĞRU</div><div class="example-body"><strong>$\\dfrac{x^2}{16} + \\dfrac{y^2}{9} = 1$ elipsinde $(2, 3\\sqrt{3}/2)$ noktasındaki teğet doğruyu bul.</strong><br><br>Önce noktanın elips üzerinde olduğunu kontrol et: $\\dfrac{4}{16} + \\dfrac{27/4}{9} = \\dfrac{1}{4} + \\dfrac{3}{4} = 1$ &check;.<br>$\\dfrac{x \\cdot 2}{16} + \\dfrac{y \\cdot 3\\sqrt{3}/2}{9} = 1$'i uygula.<br>Sadeleştir: $\\dfrac{x}{8} + \\dfrac{\\sqrt{3} y}{6} = 1$, ya da eşdeğer olarak $\\mathbf{3x + 4\\sqrt{3} y = 24}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; KEPLER, GÜNBERİ/GÜNÖTE</div><div class="example-body"><strong>Bir uydu, büyük yarı ekseni $a = 8000$ km ve dış merkezliği $e = 0.1$ olan bir elips boyunca Dünya etrafında yörüngededir. Günberi ve günöte uzaklıklarını (Dünya'nın oturduğu odaktan) hesapla.</strong><br><br>$r_{\\min} = a(1 - e) = 8000 \\cdot 0.9 = 7200$ km.<br>$r_{\\max} = a(1 + e) = 8000 \\cdot 1.1 = 8800$ km.<br><br>Uydunun Dünya'ya uzaklığı 7200 km (yerberi) ile 8800 km (yeröte) arasında salınır. Doğrulama: ortalama $(7200+8800)/2 = 8000 = a$ &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; NOKTADAN DIŞ MERKEZLİK</div><div class="example-body"><strong>Bir elipsin merkezi orijinde, büyük ekseni $x$ boyunca, köşesi olarak $(4, 0)$'dan geçiyor ve $(2, \\sqrt{3})$'ten de geçiyor. Dış merkezliğini bul.</strong><br><br>$(4, 0)$ köşesi $a = 4$, $a^2 = 16$ verir.<br>$(2, \\sqrt{3})$'ü $\\dfrac{x^2}{16} + \\dfrac{y^2}{b^2} = 1$'e yerleştir: $\\dfrac{4}{16} + \\dfrac{3}{b^2} = 1 \\Rightarrow \\dfrac{3}{b^2} = \\dfrac{3}{4} \\Rightarrow b^2 = 4$.<br>$c^2 = a^2 - b^2 = 16 - 4 = 12 \\Rightarrow c = 2\\sqrt{3}$.<br>$e = c/a = 2\\sqrt{3}/4 = \\mathbf{\\sqrt{3}/2 \\approx 0.866}$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Elips = iki odağa olan uzaklıkları <em>toplamı</em> $2a$ sabitine eşit olan noktaların kümesi</li>
<li>Orijinde standart form: $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ ($a > b > 0$); büyük eksen $x$ boyunca</li>
<li>Daha büyük payda $y^2$ altındaysa, büyük eksen onun yerine dikeydir</li>
<li>Temel bağıntı: $c^2 = a^2 - b^2$ (eksi, artı değil &mdash; o hiperboldur)</li>
<li>Köşeler $(\\pm a, 0)$, yardımcı köşeler $(0, \\pm b)$, odaklar $(\\pm c, 0)$ &mdash; odaklar her zaman büyük eksende</li>
<li>Dış merkezlik $e = c/a$, $[0, 1)$ aralığında: 0 çemberdir, 1'e yakın çok uzun bir elipstir</li>
<li>Ötelenmiş form: $\\frac{(x-h)^2}{a^2} + \\frac{(y-k)^2}{b^2} = 1$ merkezi $(h, k)$'dedir</li>
<li>Latus rectum uzunluğu: $2b^2/a$; $(x_0, y_0)$'daki teğet: $\\frac{x x_0}{a^2} + \\frac{y y_0}{b^2} = 1$</li>
<li>Kepler'in birinci yasası: gezegenler Güneş bir odakta olmak üzere elipsler boyunca dolanır; $r_{\\min} = a(1-e)$, $r_{\\max} = a(1+e)$</li>
</ul>
</div>`

};
