window.LISE_MAT_L79 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A circle is the simplest curve in the plane, and it has the simplest equation.</strong> Every point of a circle is the same distance from a single fixed point — that distance is the <em>radius</em>, and that point is the <em>centre</em>. Apply the distance formula to that one condition and a clean algebraic identity falls out. Once you know the equation, you can pull the centre and radius back out of any algebraic mess, draw tangent lines that just graze the curve, measure chords that cut straight through it, and compute the length of the tangent from an outside point. This lesson is a complete tour of those tools.</p>

<p class="l-text">By the end of this lesson you will be able to write down the equation of any circle given its centre and radius, recognise a circle hiding inside a general second-degree equation, recover the centre and radius by completing the square, write the equation of the tangent at any point of the circle, distinguish tangents from secants from chords, and compute the length of a tangent drawn from an external point.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive the standard equation $(x-a)^2 + (y-b)^2 = r^2$ from the distance formula</li>
<li>Convert the general form $x^2 + y^2 + Dx + Ey + F = 0$ into standard form by completing the square</li>
<li>Recover centre and radius from any circle equation, and detect degenerate or empty cases</li>
<li>Write the equation of the tangent line at a point on the circle using $(x-a)(x_0-a) + (y-b)(y_0-b) = r^2$</li>
<li>Distinguish chords, secants, and tangents, and use the fact that the perpendicular from the centre bisects every chord</li>
<li>Compute the tangent length $L = \\sqrt{d^2 - r^2}$ from an external point at distance $d$ from the centre</li>
</ul>
</div>

<h2 class="lesson-title">1. The Standard Form of a Circle</h2>

<div class="calc-highlight"><strong>One sentence definition.</strong> A circle is the set of all points in the plane whose distance from a fixed centre is a constant radius. Apply the distance formula to that condition and you get a clean algebraic equation — the <em>standard form</em>. It is the version of the circle equation you should always try to reach, because every piece of information (centre, radius) is written in plain sight.</div>

<div class="calc-formula"><div class="formula-label">STANDARD FORM &mdash; CENTRE $(a, b)$, RADIUS $r$</div><div class="formula-main">$$(x - a)^2 + (y - b)^2 \\;=\\; r^2$$</div><div class="formula-sub">The point $(a, b)$ is the centre. The positive number $r$ is the radius. Read both off the equation directly — no algebra needed.</div></div>

<p class="l-text">When the centre is the origin (so $a = b = 0$), the equation simplifies to $x^2 + y^2 = r^2$. That is the version you have already met in the unit-circle and analytic-geometry chapters. Every other circle is just this one shifted: move it $a$ units right and $b$ units up, and the equation picks up the parentheses $(x - a)$ and $(y - b)$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Centre $(a, b)$</div><div class="card-body">The fixed point inside the circle, equidistant from every point on the curve. Read it off the equation as the values that make each squared term zero.</div></div>
<div class="calc-card"><div class="card-title">Radius $r$</div><div class="card-body">The constant distance from the centre to any point on the circle. Always positive. In the standard form it is the square root of the right-hand side.</div></div>
<div class="calc-card"><div class="card-title">Watch the signs</div><div class="card-body">The standard form has minus signs inside the parentheses. If you see $(x + 3)^2$, the centre coordinate is $-3$, not $+3$. The sign flips.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Write the equation of the circle with centre $C = (3, 4)$ and radius $r = 5$.<br><br>Plug $a = 3$, $b = 4$, $r = 5$ into the standard form:<br><br>$(x - 3)^2 + (y - 4)^2 = 25$.<br><br>Notice that this circle passes through the origin, because $(0 - 3)^2 + (0 - 4)^2 = 9 + 16 = 25 = r^2$. The origin is exactly one radius away from the centre.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">A circle has equation $(x + 2)^2 + (y - 1)^2 = 16$. Find its centre and radius.<br><br>Rewrite to match the standard form: $(x - (-2))^2 + (y - 1)^2 = 4^2$.<br><br>Centre $= (-2, 1)$, radius $= 4$. The sign in $(x + 2)$ flips to give $-2$ for the x-coordinate of the centre.</div></div>

<div class="calc-graph"><div id="plot-l79-standard-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the circle $(x - 3)^2 + (y - 4)^2 = 25$ with its centre marked at $(3, 4)$ and one radius drawn out to the origin. Every point on the blue circumference is exactly 5 units from the centre.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;th.push(a);xc.push(3+5*Math.cos(a));yc.push(4+5*Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'circle (x-3)^2+(y-4)^2=25',line:{color:'#3b82f6',width:3}};
var ctr={x:[3],y:[4],mode:'markers+text',name:'centre C(3,4)',marker:{color:'#f59e0b',size:12,symbol:'diamond'},text:['C(3,4)'],textposition:'top right',textfont:{color:'#f59e0b',size:13}};
var rad={x:[3,0],y:[4,0],mode:'lines+markers',name:'radius r=5',line:{color:'#10b981',width:2.4,dash:'dash'},marker:{color:'#10b981',size:8}};
var org={x:[0],y:[0],mode:'markers+text',name:'origin O(0,0)',marker:{color:'#e8e8e8',size:9},text:['O(0,0)'],textposition:'bottom left',textfont:{color:'#e8e8e8',size:12}};
var axX={x:[-3,9],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-2,10],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-2,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l79-standard-en',[axX,axY,ring,rad,ctr,org],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">2. Derivation from the Distance Formula</h2>

<div class="calc-highlight"><strong>Why does the equation look like that?</strong> Because the defining geometric condition — every point of the circle is at distance $r$ from the centre — translates word-for-word into the distance formula. Square both sides to kill the square root and you have the equation. No magic, just one algebraic step.</div>

<p class="l-text">Start with the condition. A point $P = (x, y)$ lies on the circle of centre $C = (a, b)$ and radius $r$ if and only if</p>

<div class="calc-formula"><div class="formula-label">GEOMETRIC CONDITION</div><div class="formula-main">$$d(P, C) \\;=\\; r$$</div></div>

<p class="l-text">Apply the distance formula to the pair $P = (x, y)$ and $C = (a, b)$:</p>

<div class="calc-formula"><div class="formula-label">DISTANCE FORMULA INSERTED</div><div class="formula-main">$$\\sqrt{(x - a)^2 + (y - b)^2} \\;=\\; r$$</div></div>

<p class="l-text">Both sides are non-negative, so squaring preserves equality and removes the square root:</p>

<div class="calc-formula"><div class="formula-label">STANDARD FORM &mdash; THE FINAL EQUATION</div><div class="formula-main">$$(x - a)^2 + (y - b)^2 \\;=\\; r^2$$</div><div class="formula-sub">That is the entire derivation. One condition, one formula, one squaring step.</div></div>

<div class="l-note"><strong>Why squaring is safe here.</strong> In general, squaring an equation can introduce extra solutions (because $-r$ and $+r$ both square to $r^2$). But the distance $d(P, C)$ is always non-negative, and the radius $r$ is by assumption positive, so both sides of the equation are non-negative before squaring. No spurious solutions appear.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">What set does $(x - 3)^2 + (y - 4)^2 = 0$ describe? A sum of two squares is zero only when each square is zero, so $x = 3$ and $y = 4$ — the equation collapses to a single point, the would-be centre. And what about $(x - 3)^2 + (y - 4)^2 = -1$? No real point satisfies it (a sum of squares is never negative). The standard form only gives a genuine circle when the right-hand side is strictly positive.</div></div>

<h2 class="lesson-title">3. The General Form $x^2 + y^2 + Dx + Ey + F = 0$</h2>

<div class="calc-highlight"><strong>Expand the standard form and you get a second-degree equation in $x$ and $y$ with three constant terms.</strong> This expanded version is called the <em>general form</em>. It looks messier, but it is what circles often look like when they arise from algebraic problems (intersections, locus arguments, geometric proofs). Recognising a circle in this disguised form and recovering the centre and radius is one of the most useful skills in coordinate geometry.</div>

<p class="l-text">Expand the standard form:</p>

<div class="calc-formula"><div class="formula-label">EXPANDING THE STANDARD FORM</div><div class="formula-main">$$(x - a)^2 + (y - b)^2 = r^2 \\;\\Longleftrightarrow\\; x^2 - 2ax + a^2 + y^2 - 2by + b^2 = r^2$$</div></div>

<p class="l-text">Move everything to the left:</p>

<div class="calc-formula"><div class="formula-label">GENERAL FORM</div><div class="formula-main">$$x^2 + y^2 + D\\,x + E\\,y + F \\;=\\; 0$$</div><div class="formula-sub">where $D = -2a$, $E = -2b$, $F = a^2 + b^2 - r^2$. The coefficients of $x^2$ and $y^2$ are both $1$ and equal — that is the signature of a circle.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Read $a$ from $D$</div><div class="card-body">$D = -2a$, so $a = -D/2$. Take half of the $x$-coefficient and flip the sign.</div></div>
<div class="calc-card"><div class="card-title">Read $b$ from $E$</div><div class="card-body">$E = -2b$, so $b = -E/2$. Same recipe applied to the $y$-coefficient.</div></div>
<div class="calc-card"><div class="card-title">Recover $r$</div><div class="card-body">$F = a^2 + b^2 - r^2$, so $r^2 = a^2 + b^2 - F = \\dfrac{D^2 + E^2}{4} - F$. Compute, then take the positive square root.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">QUICK CENTRE-AND-RADIUS RECIPE</div><div class="formula-main">$$\\text{centre} = \\left(-\\tfrac{D}{2}, \\, -\\tfrac{E}{2}\\right), \\quad r^2 = \\tfrac{D^2 + E^2}{4} - F$$</div><div class="formula-sub">Two formulas memorise once and use forever. Both follow directly from the expansion above.</div></div>

<div class="l-note"><strong>When is it not a circle?</strong> The general form gives a real circle only when $r^2 > 0$, i.e. when $\\dfrac{D^2+E^2}{4} - F > 0$. If $r^2 = 0$ the equation collapses to a single point. If $r^2 < 0$ no real point satisfies it (the locus is empty). Always check this before claiming you have a circle.</div>

<h2 class="lesson-title">4. Completing the Square: General &rarr; Standard</h2>

<div class="calc-highlight"><strong>The shortcut formulas above are handy, but the more reliable technique is <em>completing the square</em>.</strong> It works mechanically for every circle equation and never lets you down. The recipe: group the $x$-terms, group the $y$-terms, complete each group into a perfect square, and move the constants.</div>

<p class="l-text"><strong>The recipe in five lines.</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1</div><div class="card-body">Group: $(x^2 + Dx) + (y^2 + Ey) + F = 0$.</div></div>
<div class="calc-card"><div class="card-title">Step 2</div><div class="card-body">Halve the linear coefficients: $D/2$ and $E/2$.</div></div>
<div class="calc-card"><div class="card-title">Step 3</div><div class="card-body">Add and subtract their squares: $(x^2 + Dx + (D/2)^2) + (y^2 + Ey + (E/2)^2) + F - (D/2)^2 - (E/2)^2 = 0$.</div></div>
<div class="calc-card"><div class="card-title">Step 4</div><div class="card-body">Factor each perfect square: $\\big(x + D/2\\big)^2 + \\big(y + E/2\\big)^2 = (D/2)^2 + (E/2)^2 - F$.</div></div>
<div class="calc-card"><div class="card-title">Step 5</div><div class="card-body">Read off centre $(-D/2, -E/2)$ and $r^2$ on the right-hand side.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Find the centre and radius of $x^2 + y^2 - 4x + 6y - 3 = 0$.<br><br>Group: $(x^2 - 4x) + (y^2 + 6y) - 3 = 0$.<br><br>Halve coefficients: $-4/2 = -2$ and $6/2 = 3$. Squares are $4$ and $9$.<br><br>Add and subtract: $(x^2 - 4x + 4) + (y^2 + 6y + 9) - 3 - 4 - 9 = 0$.<br><br>Factor: $(x - 2)^2 + (y + 3)^2 = 16$.<br><br>Centre $= (2, -3)$, radius $= 4$. Sanity check with the shortcut: $a = -D/2 = -(-4)/2 = 2$ &check;, $b = -E/2 = -6/2 = -3$ &check;, $r^2 = (16 + 36)/4 - (-3) = 13 + 3 = 16$ &check;.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Identify the locus of $x^2 + y^2 - 2x + 4y + 5 = 0$.<br><br>Group and complete: $(x - 1)^2 - 1 + (y + 2)^2 - 4 + 5 = 0 \\;\\Rightarrow\\; (x-1)^2 + (y+2)^2 = 0$.<br><br>Right-hand side is zero, not positive — the locus is just the single point $(1, -2)$, not a circle.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">What about $x^2 + y^2 + 2x + 2y + 5 = 0$?<br><br>$(x + 1)^2 - 1 + (y + 1)^2 - 1 + 5 = 0 \\;\\Rightarrow\\; (x+1)^2 + (y+1)^2 = -3$.<br><br>Negative right-hand side. No real point can satisfy this — the locus is empty.</div></div>

<div class="l-note"><strong>Common error: forgetting to halve.</strong> Beginners often square the full coefficient instead of half of it. For $x^2 - 4x$ the constant you add to complete the square is $(-4/2)^2 = 4$, <em>not</em> $(-4)^2 = 16$. Always halve before squaring.</div>

<h2 class="lesson-title">5. Tangent Lines to a Circle</h2>

<div class="calc-highlight"><strong>A tangent to a circle is a line that touches the circle at exactly one point.</strong> Geometrically, the tangent is perpendicular to the radius at the point of contact — a fact that is both intuitive (the tangent cannot "lean toward" the centre, or it would cut through the circle) and algebraically powerful.</div>

<p class="l-text">Three lines you must distinguish:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tangent</div><div class="card-body">Touches the circle at exactly <strong>one</strong> point. The point of contact lies on both the line and the circle. Perpendicular to the radius at that point.</div></div>
<div class="calc-card"><div class="card-title">Secant</div><div class="card-body">Cuts the circle at <strong>two</strong> points. The segment of the secant inside the circle is a chord.</div></div>
<div class="calc-card"><div class="card-title">External line</div><div class="card-body">Does not meet the circle at all. Distance from the centre to the line is greater than $r$.</div></div>
</div>

<p class="l-text"><strong>The radius-tangent perpendicularity theorem.</strong> If $T$ is the point of tangency and $C$ is the centre, then $CT \\perp \\text{tangent line at } T$. This is the single most useful fact about circles. Every tangent-line problem ultimately uses it.</p>

<h3 style="margin-top:1.4rem;color:#3b82f6">5.1 Equation of the tangent at a point on the circle</h3>

<p class="l-text">If $(x_0, y_0)$ is a point on the circle with centre $(a, b)$ and radius $r$, the tangent line at $(x_0, y_0)$ has equation</p>

<div class="calc-formula"><div class="formula-label">TANGENT AT A POINT ON THE CIRCLE</div><div class="formula-main">$$(x - a)(x_0 - a) + (y - b)(y_0 - b) \\;=\\; r^2$$</div><div class="formula-sub">Replace one factor in each squared term of $(x-a)^2 + (y-b)^2 = r^2$ by the coordinates of the point of tangency. That is the entire trick.</div></div>

<p class="l-text"><strong>Why this works.</strong> The vector from $C = (a, b)$ to $T = (x_0, y_0)$ is $(x_0 - a, y_0 - b)$. The tangent line at $T$ is perpendicular to this radius. The general equation of a line through $T$ perpendicular to that direction has exactly the form on the left-hand side, equal to $(x_0-a)^2 + (y_0-b)^2 = r^2$ (because $T$ is on the circle). Hence the equation.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; TANGENT AT A GIVEN POINT</div><div class="example-body">Find the tangent line to the circle $(x - 2)^2 + (y - 1)^2 = 25$ at the point $T = (5, 5)$.<br><br>First check that $T$ is on the circle: $(5-2)^2 + (5-1)^2 = 9 + 16 = 25$ &check;.<br><br>Apply the formula with $a=2$, $b=1$, $r^2=25$, $(x_0, y_0)=(5, 5)$:<br><br>$(x - 2)(5 - 2) + (y - 1)(5 - 1) = 25$<br><br>$3(x - 2) + 4(y - 1) = 25$<br><br>$3x - 6 + 4y - 4 = 25 \\;\\Rightarrow\\; \\mathbf{3x + 4y = 35}$.<br><br>Quick check: the slope of the radius from $C=(2,1)$ to $T=(5,5)$ is $(5-1)/(5-2) = 4/3$. The tangent must have slope $-3/4$ (negative reciprocal). From $3x + 4y = 35$ we get $y = -\\tfrac{3}{4}x + \\tfrac{35}{4}$ — slope $-3/4$ &check;.</div></div>

<div class="calc-graph"><div id="plot-l79-tangent-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the circle $(x-2)^2 + (y-1)^2 = 25$ with a chord (orange) cutting through two points and a tangent line (green) touching the circle at $(5, 5)$. The dashed grey radius to the point of tangency is perpendicular to the green tangent line — the defining property of tangency.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;th.push(a);xc.push(2+5*Math.cos(a));yc.push(1+5*Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'circle',line:{color:'#3b82f6',width:3}};
var ctr={x:[2],y:[1],mode:'markers+text',name:'centre C(2,1)',marker:{color:'#e8e8e8',size:10,symbol:'cross'},text:['C(2,1)'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:12}};
var T={x:[5],y:[5],mode:'markers+text',name:'point of tangency T(5,5)',marker:{color:'#10b981',size:12,symbol:'diamond'},text:['T(5,5)'],textposition:'top right',textfont:{color:'#10b981',size:12}};
var rad={x:[2,5],y:[1,5],mode:'lines',name:'radius CT',line:{color:'rgba(255,255,255,0.5)',width:2,dash:'dash'}};
var tx=[];var ty=[];for(var k=-3;k<=3;k+=0.2){tx.push(5+k*4);ty.push(5-k*3);}
var tan={x:tx,y:ty,mode:'lines',name:'tangent: 3x+4y=35',line:{color:'#10b981',width:2.4}};
var sx=[];var sy=[];for(var m=-3;m<=3;m+=0.2){sx.push(2+m*5);sy.push(-2+m*2);}
var sec={x:sx,y:sy,mode:'lines',name:'chord (secant inside)',line:{color:'#f59e0b',width:2.2}};
var axX={x:[-5,9],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-5,8],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-5,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l79-tangent-en',[axX,axY,ring,sec,rad,tan,ctr,T],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Chords and the Perpendicular from the Centre</h2>

<div class="calc-highlight"><strong>A chord is any straight segment whose endpoints lie on the circle.</strong> The diameter is the longest possible chord — it passes through the centre and has length $2r$. The key geometric fact: <em>the perpendicular dropped from the centre onto a chord bisects that chord.</em> This is one of the cleanest theorems in classical geometry, and it follows from the Pythagorean theorem applied to the two congruent right triangles formed.</div>

<p class="l-text"><strong>Why the perpendicular bisects the chord.</strong> Let the chord be $AB$ and let $M$ be the foot of the perpendicular from the centre $C$. Triangles $CMA$ and $CMB$ are both right-angled at $M$, share the leg $CM$, and have equal hypotenuses $CA = CB = r$. By the hypotenuse-leg congruence, the two triangles are congruent. Therefore $MA = MB$ — the perpendicular foot is exactly halfway along the chord.</p>

<div class="calc-formula"><div class="formula-label">CHORD LENGTH FROM PERPENDICULAR DISTANCE</div><div class="formula-main">$$|AB| \\;=\\; 2\\sqrt{r^2 - h^2}$$</div><div class="formula-sub">Here $h$ is the perpendicular distance from the centre to the chord. The right triangle $CMA$ has hypotenuse $r$, leg $h$, and remaining leg $|MA| = \\sqrt{r^2 - h^2}$. Double it for the full chord.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A chord of the circle $x^2 + y^2 = 25$ is at perpendicular distance $3$ from the centre. Find its length.<br><br>$r = 5$, $h = 3$. Chord length $= 2\\sqrt{25 - 9} = 2\\sqrt{16} = 2 \\cdot 4 = \\mathbf{8}$.<br><br>Sanity check: the chord at distance $0$ would be the diameter, length $2 \\cdot 5 = 10$. A chord at distance $5$ (touching the circle) would have length $0$ — it would degenerate to the point of tangency. Length $8$ at distance $3$ sits sensibly in between.</div></div>

<div class="l-note"><strong>Connecting back to tangents.</strong> A tangent is the limit of a secant as the two intersection points coalesce. As the two endpoints of a chord slide together along the circle, the chord shrinks to a point and the secant line becomes the tangent line at that point. The perpendicular from the centre — which has length $h < r$ for a secant — increases until it equals $r$ at the tangent.</div>

<h2 class="lesson-title">7. Tangent Length from an External Point</h2>

<div class="calc-highlight"><strong>Stand outside a circle and draw the two tangent lines from your position.</strong> Each touches the circle at one point. The segment from you to the point of tangency has a fixed length — and that length is the same for both tangent lines. It is determined entirely by your distance from the centre and the radius of the circle.</div>

<p class="l-text">Let $P$ be an external point at distance $d$ from the centre $C$ of a circle of radius $r$ (so $d > r$). Let $T$ be a point of tangency. The triangle $PTC$ has a right angle at $T$ (because the tangent is perpendicular to the radius at $T$), with hypotenuse $PC = d$ and one leg $CT = r$. By Pythagoras:</p>

<div class="calc-formula"><div class="formula-label">TANGENT LENGTH FROM AN EXTERNAL POINT</div><div class="formula-main">$$L \\;=\\; |PT| \\;=\\; \\sqrt{d^2 - r^2}$$</div><div class="formula-sub">where $d$ is the distance from $P$ to the centre, and $r$ is the radius. The formula requires $d > r$; if $d = r$ then $P$ is on the circle and $L = 0$; if $d < r$ then $P$ is inside and no tangent exists.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Both tangents have equal length</div><div class="card-body">The two tangent segments from the same external point are congruent. They form an isosceles configuration around the line $PC$.</div></div>
<div class="calc-card"><div class="card-title">$L > 0 \\Leftrightarrow d > r$</div><div class="card-body">Tangent length is positive only when $P$ is strictly outside the circle. On the boundary $L = 0$; inside, no real tangent exists.</div></div>
<div class="calc-card"><div class="card-title">$L^2$ from the general form</div><div class="card-body">If the circle is $x^2 + y^2 + Dx + Ey + F = 0$ and $P = (x_1, y_1)$, then $L^2 = x_1^2 + y_1^2 + Dx_1 + Ey_1 + F$ — substitute the point into the left-hand side.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Find the tangent length from $P = (8, 0)$ to the circle $x^2 + y^2 = 9$.<br><br>Centre $C = (0, 0)$, radius $r = 3$. Distance $d = |OP| = 8$.<br><br>$L = \\sqrt{d^2 - r^2} = \\sqrt{64 - 9} = \\sqrt{55} \\approx \\mathbf{7.416}$.<br><br>Check via the substitution shortcut: $L^2 = x_1^2 + y_1^2 - 9 = 64 + 0 - 9 = 55$ &check;.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Tangent length from $P = (10, 7)$ to $(x - 2)^2 + (y - 1)^2 = 25$.<br><br>Centre $C = (2, 1)$, radius $r = 5$. Distance:<br><br>$d^2 = (10 - 2)^2 + (7 - 1)^2 = 64 + 36 = 100 \\;\\Rightarrow\\; d = 10$.<br><br>$L = \\sqrt{100 - 25} = \\sqrt{75} = 5\\sqrt{3} \\approx \\mathbf{8.66}$.</div></div>

<div class="calc-graph"><div id="plot-l79-external-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the circle $x^2 + y^2 = 9$ with an external point $P = (8, 0)$. The two tangent lines from $P$ touch the circle at symmetric points above and below the x-axis. The dashed grey segments are the two tangent lengths, both equal to $\\sqrt{55}$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;th.push(a);xc.push(3*Math.cos(a));yc.push(3*Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'circle x^2+y^2=9',line:{color:'#3b82f6',width:3}};
var Px=8,Py=0,r=3,d=8;
var T1x=r*r/d;
var T1y=(r/d)*Math.sqrt(d*d-r*r);
var T2x=T1x, T2y=-T1y;
var ext={x:[Px],y:[Py],mode:'markers+text',name:'external point P(8,0)',marker:{color:'#f59e0b',size:12,symbol:'star'},text:['P(8,0)'],textposition:'top right',textfont:{color:'#f59e0b',size:13}};
var tan1={x:[Px,T1x],y:[Py,T1y],mode:'lines+markers',name:'tangent length L=√55',line:{color:'#10b981',width:2.6,dash:'dash'},marker:{color:'#10b981',size:9}};
var tan2={x:[Px,T2x],y:[Py,T2y],mode:'lines+markers',name:'tangent (other)',line:{color:'#ef4444',width:2.6,dash:'dash'},marker:{color:'#ef4444',size:9}};
var ctr={x:[0],y:[0],mode:'markers+text',name:'centre O(0,0)',marker:{color:'#e8e8e8',size:9,symbol:'cross'},text:['O'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:12}};
var radOT={x:[0,T1x],y:[0,T1y],mode:'lines',name:'radius (r⊥tangent)',line:{color:'rgba(255,255,255,0.5)',width:1.6,dash:'dot'}};
var axX={x:[-4,10],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-5,5],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l79-external-en',[axX,axY,ring,radOT,tan1,tan2,ctr,ext],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Common Errors to Watch For</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sign flip in completing the square</div><div class="card-body">The centre of $(x + 3)^2 + (y - 4)^2 = 25$ is $(-3, 4)$, not $(3, -4)$. The signs inside the parentheses flip when you read them as $(x - a)$ and $(y - b)$.</div></div>
<div class="calc-card"><div class="card-title">Forgetting to halve the coefficient</div><div class="card-body">For $x^2 - 6x$, the constant to add is $(-6/2)^2 = 9$, not $(-6)^2 = 36$. Always halve before squaring.</div></div>
<div class="calc-card"><div class="card-title">Calling everything a chord</div><div class="card-body">A tangent touches at one point. A chord is a segment <em>between two intersection points</em>. A secant is the full line containing a chord. They are three different objects.</div></div>
<div class="calc-card"><div class="card-title">Using $L = \\sqrt{d - r}$ instead of $\\sqrt{d^2 - r^2}$</div><div class="card-body">The Pythagorean theorem uses squared quantities. Do not drop the squares from inside the square root.</div></div>
<div class="calc-card"><div class="card-title">Not checking if the point is on the circle</div><div class="card-body">Before writing a tangent equation at $(x_0, y_0)$, verify $(x_0 - a)^2 + (y_0 - b)^2 = r^2$. If not, the tangent formula does not apply.</div></div>
<div class="calc-card"><div class="card-title">Forgetting that $r^2$ must be positive</div><div class="card-body">If completing the square gives a zero or negative right-hand side, the equation is not a circle — it is a point or has no real solution.</div></div>
</div>

<h2 class="lesson-title">9. Practice Exercises</h2>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body">Write the equation of the circle with centre $(-1, 2)$ and radius $\\sqrt{10}$.<br><br><strong>Solution.</strong> $(x + 1)^2 + (y - 2)^2 = 10$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body">A circle has centre at the origin and passes through $(6, 8)$. Find its equation.<br><br><strong>Solution.</strong> Radius $r = \\sqrt{36 + 64} = 10$. Equation: $x^2 + y^2 = 100$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body">Find the centre and radius of $x^2 + y^2 + 8x - 6y + 9 = 0$.<br><br><strong>Solution.</strong> Complete the square: $(x + 4)^2 - 16 + (y - 3)^2 - 9 + 9 = 0 \\Rightarrow (x+4)^2 + (y-3)^2 = 16$. Centre $(-4, 3)$, radius $4$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body">Write the tangent to $(x - 1)^2 + (y + 2)^2 = 13$ at the point $(3, 1)$.<br><br><strong>Solution.</strong> Verify point on circle: $(3-1)^2 + (1+2)^2 = 4 + 9 = 13$ &check;. Apply tangent formula: $(x - 1)(3 - 1) + (y + 2)(1 + 2) = 13 \\Rightarrow 2(x - 1) + 3(y + 2) = 13 \\Rightarrow 2x + 3y = 9$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body">Find the tangent length from $(7, 1)$ to the circle $(x - 1)^2 + (y - 1)^2 = 9$.<br><br><strong>Solution.</strong> Distance from centre $(1, 1)$ to $(7, 1)$: $d = 6$. Radius $r = 3$. $L = \\sqrt{36 - 9} = \\sqrt{27} = 3\\sqrt{3}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6</div><div class="example-body">A chord of the circle $x^2 + y^2 = 100$ has length $12$. What is its perpendicular distance from the centre?<br><br><strong>Solution.</strong> Use $|AB| = 2\\sqrt{r^2 - h^2}$: $12 = 2\\sqrt{100 - h^2} \\Rightarrow 6 = \\sqrt{100 - h^2} \\Rightarrow 36 = 100 - h^2 \\Rightarrow h^2 = 64 \\Rightarrow h = 8$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7</div><div class="example-body">Determine whether $x^2 + y^2 - 4x - 4y + 12 = 0$ represents a real circle.<br><br><strong>Solution.</strong> $(x - 2)^2 - 4 + (y - 2)^2 - 4 + 12 = 0 \\Rightarrow (x-2)^2 + (y-2)^2 = -4$. Right-hand side negative — no real circle, locus is empty.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8</div><div class="example-body">A circle passes through $A=(0, 0)$ and $B=(6, 0)$ and has centre on the line $x = 3$. If its radius is $5$, find its equation.<br><br><strong>Solution.</strong> Centre at $(3, k)$ for some $k$. Distance to origin equals 5: $\\sqrt{9 + k^2} = 5 \\Rightarrow k^2 = 16 \\Rightarrow k = \\pm 4$. Two circles: $(x-3)^2 + (y-4)^2 = 25$ or $(x-3)^2 + (y+4)^2 = 25$.</div></div>

<div class="calc-highlight" style="margin-top:2rem"><strong>Summary.</strong> Every circle problem reduces to two skills: (1) move between standard and general forms by completing the square, and (2) use the right-angle between the radius and the tangent at a point of contact. Master these and you can handle every chord, tangent, and intersection question that high-school analytic geometry will throw at you.</div>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Çember düzlemdeki en basit eğridir ve denklemi de bir o kadar basittir.</strong> Çember üzerindeki her nokta sabit bir noktaya eşit uzaklıktadır — bu uzaklık <em>yarıçap</em>, bu sabit nokta da <em>merkez</em>'dir. Bu tek koşula uzaklık formülünü uyguladığınızda temiz bir cebirsel özdeşlik çıkar. Denklemi bildiğinizde herhangi bir cebirsel karmaşadan merkez ve yarıçapı geri çekebilir, eğriye yalnızca dokunan teğet doğruları çizebilir, çemberin içinden geçen kirişleri ölçebilir ve dış noktadan çekilen teğetin uzunluğunu hesaplayabilirsiniz. Bu ders bu araçların eksiksiz bir turu.</p>

<p class="l-text">Bu dersin sonunda merkezi ve yarıçapı verilen herhangi bir çemberin denklemini yazabilecek, ikinci dereceden bir denklemin içine saklanmış çemberi tanıyabilecek, kare tamamlama yöntemiyle merkez ve yarıçapı geri kazanabilecek, çember üzerindeki bir noktada teğetin denklemini yazabilecek, teğet-kesen-kiriş ayrımını yapabilecek ve dış noktadan çekilen teğet uzunluğunu hesaplayabileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Standart denklem $(x-a)^2 + (y-b)^2 = r^2$ ifadesini uzaklık formülünden çıkarmak</li>
<li>Genel form $x^2 + y^2 + Dx + Ey + F = 0$ ifadesini kare tamamlayarak standart forma çevirmek</li>
<li>Herhangi bir çember denkleminden merkez ve yarıçapı geri okumak; dejenere ve boş durumları tespit etmek</li>
<li>Çember üzerindeki bir noktada teğetin denklemini $(x-a)(x_0-a) + (y-b)(y_0-b) = r^2$ formülüyle yazmak</li>
<li>Kiriş, kesen ve teğet kavramlarını birbirinden ayırt etmek; merkezden inen dikmenin her kirişi ortaladığını kullanmak</li>
<li>Merkeze $d$ uzaklıktaki dış noktadan teğet uzunluğunu $L = \\sqrt{d^2 - r^2}$ ile hesaplamak</li>
</ul>
</div>

<h2 class="lesson-title">1. Çemberin Standart Formu</h2>

<div class="calc-highlight"><strong>Tek cümlelik tanım.</strong> Çember, düzlemde sabit bir merkeze sabit bir yarıçap uzaklıkta bulunan tüm noktaların kümesidir. Bu koşula uzaklık formülünü uygulayın; ortaya temiz bir cebirsel denklem çıkar — <em>standart form</em>. Her zaman ulaşmaya çalışmanız gereken biçim budur; çünkü her bilgi (merkez, yarıçap) gözle görülecek şekilde yazılıdır.</div>

<div class="calc-formula"><div class="formula-label">STANDART FORM &mdash; MERKEZ $(a, b)$, YARIÇAP $r$</div><div class="formula-main">$$(x - a)^2 + (y - b)^2 \\;=\\; r^2$$</div><div class="formula-sub">Nokta $(a, b)$ merkezdir. Pozitif $r$ sayısı yarıçaptır. İkisini de denklemden doğrudan okuyun — cebir gerekmez.</div></div>

<p class="l-text">Merkez orijinde ise (yani $a = b = 0$) denklem $x^2 + y^2 = r^2$ biçimine sadeleşir. Birim çember ve analitik geometri bölümlerinden tanıdığınız hali bu. Diğer her çember bunun ötelenmiş hali: $a$ birim sağa ve $b$ birim yukarı taşıyın, denklem $(x - a)$ ve $(y - b)$ parantezlerini alır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Merkez $(a, b)$</div><div class="card-body">Çemberin içindeki sabit nokta; eğrinin her noktasına eşit uzaklıkta. Her kare terimini sıfır yapan değerler olarak denklemden okunur.</div></div>
<div class="calc-card"><div class="card-title">Yarıçap $r$</div><div class="card-body">Merkezden çember üzerindeki herhangi bir noktaya olan sabit uzaklık. Daima pozitiftir. Standart formda sağ tarafın karekökü olarak bulunur.</div></div>
<div class="calc-card"><div class="card-title">İşaretlere dikkat</div><div class="card-body">Standart formda parantez içinde eksi vardır. $(x + 3)^2$ görürseniz merkezin x-koordinatı $+3$ değil $-3$'tür. İşaret döner.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body">Merkezi $C = (3, 4)$ ve yarıçapı $r = 5$ olan çemberin denklemini yazın.<br><br>$a = 3$, $b = 4$, $r = 5$ değerlerini standart forma yerleştirin:<br><br>$(x - 3)^2 + (y - 4)^2 = 25$.<br><br>Dikkat: bu çember orijinden geçer çünkü $(0 - 3)^2 + (0 - 4)^2 = 9 + 16 = 25 = r^2$. Orijin merkeze tam olarak bir yarıçap uzaklıktadır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2</div><div class="example-body">Bir çemberin denklemi $(x + 2)^2 + (y - 1)^2 = 16$. Merkez ve yarıçapı bulun.<br><br>Standart forma uyacak biçimde tekrar yazın: $(x - (-2))^2 + (y - 1)^2 = 4^2$.<br><br>Merkez $= (-2, 1)$, yarıçap $= 4$. $(x + 2)$ ifadesindeki işaret merkez x-koordinatı olarak $-2$ verir.</div></div>

<div class="calc-graph"><div id="plot-l79-standard-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Bu grafik şunu gösteriyor:</strong> $(x - 3)^2 + (y - 4)^2 = 25$ çemberi; merkezi $(3, 4)$'te işaretlenmiş ve orijine bir yarıçap çizilmiş. Mavi çemberin üzerindeki her nokta merkeze tam olarak 5 birim uzaklıktadır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;th.push(a);xc.push(3+5*Math.cos(a));yc.push(4+5*Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'çember (x-3)^2+(y-4)^2=25',line:{color:'#3b82f6',width:3}};
var ctr={x:[3],y:[4],mode:'markers+text',name:'merkez C(3,4)',marker:{color:'#f59e0b',size:12,symbol:'diamond'},text:['C(3,4)'],textposition:'top right',textfont:{color:'#f59e0b',size:13}};
var rad={x:[3,0],y:[4,0],mode:'lines+markers',name:'yarıçap r=5',line:{color:'#10b981',width:2.4,dash:'dash'},marker:{color:'#10b981',size:8}};
var org={x:[0],y:[0],mode:'markers+text',name:'orijin O(0,0)',marker:{color:'#e8e8e8',size:9},text:['O(0,0)'],textposition:'bottom left',textfont:{color:'#e8e8e8',size:12}};
var axX={x:[-3,9],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-2,10],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-2,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l79-standard-tr',[axX,axY,ring,rad,ctr,org],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">2. Uzaklık Formülünden Türetim</h2>

<div class="calc-highlight"><strong>Denklem neden bu şekilde?</strong> Çünkü tanımlayıcı geometrik koşul — çemberin her noktasının merkeze $r$ uzaklıkta olması — kelimesi kelimesine uzaklık formülüne çevrilir. İki tarafı karelemek karekökü yok eder ve denkleminiz hazırdır. Sihir değil, tek bir cebirsel adım.</div>

<p class="l-text">Koşulla başlayın. $P = (x, y)$ noktası, merkezi $C = (a, b)$ ve yarıçapı $r$ olan çember üzerindedir ancak ve ancak</p>

<div class="calc-formula"><div class="formula-label">GEOMETRİK KOŞUL</div><div class="formula-main">$$d(P, C) \\;=\\; r$$</div></div>

<p class="l-text">Uzaklık formülünü $P = (x, y)$ ve $C = (a, b)$ noktalarına uygulayın:</p>

<div class="calc-formula"><div class="formula-label">UZAKLIK FORMÜLÜ YERLEŞTİRİLDİ</div><div class="formula-main">$$\\sqrt{(x - a)^2 + (y - b)^2} \\;=\\; r$$</div></div>

<p class="l-text">İki taraf da negatif değildir, dolayısıyla kareleme eşitliği korur ve karekökü temizler:</p>

<div class="calc-formula"><div class="formula-label">STANDART FORM &mdash; SON DENKLEM</div><div class="formula-main">$$(x - a)^2 + (y - b)^2 \\;=\\; r^2$$</div><div class="formula-sub">Türetim bu kadar. Bir koşul, bir formül, bir kareleme adımı.</div></div>

<div class="l-note"><strong>Kareleme neden burada güvenli?</strong> Genelde bir denklemin iki tarafını karelemek fazladan çözüm doğurabilir (çünkü $-r$ ve $+r$ ikisi de $r^2$ verir). Ama $d(P, C)$ uzaklığı her zaman negatif değildir ve yarıçap $r$ pozitif kabul edilir; dolayısıyla iki taraf da kareleme öncesi negatif olmayan değerlerdir. Yapay çözüm girmez.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$(x - 3)^2 + (y - 4)^2 = 0$ hangi kümeyi tarif eder? İki karenin toplamı yalnızca her ikisi sıfırsa sıfırdır; dolayısıyla $x = 3$, $y = 4$ — denklem tek bir noktaya, sözde merkeze çöker. Peki $(x - 3)^2 + (y - 4)^2 = -1$? Hiçbir gerçek nokta bunu sağlamaz (karelerin toplamı negatif olamaz). Standart form, sağ taraf kesin pozitifse gerçek çember verir.</div></div>

<h2 class="lesson-title">3. Genel Form $x^2 + y^2 + Dx + Ey + F = 0$</h2>

<div class="calc-highlight"><strong>Standart formu açarsanız üç sabit terimli ikinci dereceden bir denklem elde edersiniz.</strong> Bu açılmış sürüm <em>genel form</em>'dur. Daha karmaşık görünür ama çemberler cebirsel problemlerden (kesişim, geometrik yer, geometrik ispat) çıktığında genelde bu biçimde görünür. Bu kılığa girmiş çemberi tanımak ve merkez ile yarıçapı geri çıkarmak koordinat geometrisinin en kullanışlı becerilerinden biridir.</div>

<p class="l-text">Standart formu açın:</p>

<div class="calc-formula"><div class="formula-label">STANDART FORMU AÇMAK</div><div class="formula-main">$$(x - a)^2 + (y - b)^2 = r^2 \\;\\Longleftrightarrow\\; x^2 - 2ax + a^2 + y^2 - 2by + b^2 = r^2$$</div></div>

<p class="l-text">Her şeyi sola taşıyın:</p>

<div class="calc-formula"><div class="formula-label">GENEL FORM</div><div class="formula-main">$$x^2 + y^2 + D\\,x + E\\,y + F \\;=\\; 0$$</div><div class="formula-sub">Burada $D = -2a$, $E = -2b$, $F = a^2 + b^2 - r^2$. $x^2$ ve $y^2$ katsayıları ikisi de $1$ ve eşittir — bu çember olmanın imzasıdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a$'yı $D$'den oku</div><div class="card-body">$D = -2a$, yani $a = -D/2$. $x$ katsayısının yarısını al ve işaretini ters çevir.</div></div>
<div class="calc-card"><div class="card-title">$b$'yi $E$'den oku</div><div class="card-body">$E = -2b$, yani $b = -E/2$. Aynı tarif $y$ katsayısına uygulanır.</div></div>
<div class="calc-card"><div class="card-title">$r$'yi geri kazan</div><div class="card-body">$F = a^2 + b^2 - r^2$, yani $r^2 = a^2 + b^2 - F = \\dfrac{D^2 + E^2}{4} - F$. Hesapla, pozitif kareköküyle yarıçapı bul.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">MERKEZ-VE-YARIÇAP HIZLI TARİFİ</div><div class="formula-main">$$\\text{merkez} = \\left(-\\tfrac{D}{2}, \\, -\\tfrac{E}{2}\\right), \\quad r^2 = \\tfrac{D^2 + E^2}{4} - F$$</div><div class="formula-sub">Bir kez ezberlenip sonsuza dek kullanılan iki formül. Her ikisi de yukarıdaki açılımdan doğrudan çıkar.</div></div>

<div class="l-note"><strong>Ne zaman çember değildir?</strong> Genel form yalnızca $r^2 > 0$, yani $\\dfrac{D^2+E^2}{4} - F > 0$ olduğunda gerçek bir çember verir. $r^2 = 0$ ise denklem tek noktaya çöker. $r^2 < 0$ ise hiçbir gerçek nokta sağlayamaz (geometrik yer boştur). Çember diye iddia etmeden önce daima bunu kontrol edin.</div>

<h2 class="lesson-title">4. Kare Tamamlama: Genel &rarr; Standart</h2>

<div class="calc-highlight"><strong>Yukarıdaki kısayol formülleri pratik ama daha güvenilir teknik <em>kare tamamlama</em>'dır.</strong> Her çember denklemi için mekanik şekilde işler, sizi asla yarı yolda bırakmaz. Tarif: $x$ terimlerini grupla, $y$ terimlerini grupla, her grubu tam kareye tamamla, sabitleri taşı.</div>

<p class="l-text"><strong>Beş satırlık tarif.</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1</div><div class="card-body">Grupla: $(x^2 + Dx) + (y^2 + Ey) + F = 0$.</div></div>
<div class="calc-card"><div class="card-title">Adım 2</div><div class="card-body">Doğrusal katsayıları yarıla: $D/2$ ve $E/2$.</div></div>
<div class="calc-card"><div class="card-title">Adım 3</div><div class="card-body">Karelerini ekle ve çıkar: $(x^2 + Dx + (D/2)^2) + (y^2 + Ey + (E/2)^2) + F - (D/2)^2 - (E/2)^2 = 0$.</div></div>
<div class="calc-card"><div class="card-title">Adım 4</div><div class="card-body">Her tam kareyi çarpanlara ayır: $\\big(x + D/2\\big)^2 + \\big(y + E/2\\big)^2 = (D/2)^2 + (E/2)^2 - F$.</div></div>
<div class="calc-card"><div class="card-title">Adım 5</div><div class="card-body">Merkez $(-D/2, -E/2)$ ve sağ tarafta $r^2$ olarak okunur.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body">$x^2 + y^2 - 4x + 6y - 3 = 0$ çemberinin merkez ve yarıçapını bulun.<br><br>Grupla: $(x^2 - 4x) + (y^2 + 6y) - 3 = 0$.<br><br>Katsayıları yarıla: $-4/2 = -2$ ve $6/2 = 3$. Kareleri $4$ ve $9$.<br><br>Ekle ve çıkar: $(x^2 - 4x + 4) + (y^2 + 6y + 9) - 3 - 4 - 9 = 0$.<br><br>Çarpanlara ayır: $(x - 2)^2 + (y + 3)^2 = 16$.<br><br>Merkez $= (2, -3)$, yarıçap $= 4$. Kısayolla doğrulama: $a = -D/2 = -(-4)/2 = 2$ &check;, $b = -E/2 = -6/2 = -3$ &check;, $r^2 = (16 + 36)/4 - (-3) = 13 + 3 = 16$ &check;.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2</div><div class="example-body">$x^2 + y^2 - 2x + 4y + 5 = 0$ ifadesinin geometrik yerini belirleyin.<br><br>Grupla ve tamamla: $(x - 1)^2 - 1 + (y + 2)^2 - 4 + 5 = 0 \\;\\Rightarrow\\; (x-1)^2 + (y+2)^2 = 0$.<br><br>Sağ taraf pozitif değil sıfır — geometrik yer çember değil, sadece $(1, -2)$ tek noktasıdır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3</div><div class="example-body">Peki ya $x^2 + y^2 + 2x + 2y + 5 = 0$?<br><br>$(x + 1)^2 - 1 + (y + 1)^2 - 1 + 5 = 0 \\;\\Rightarrow\\; (x+1)^2 + (y+1)^2 = -3$.<br><br>Sağ taraf negatif. Hiçbir gerçek nokta bunu sağlayamaz — geometrik yer boştur.</div></div>

<div class="l-note"><strong>Sık hata: yarılamayı unutmak.</strong> Öğrenciler genelde tam katsayının karesini alırlar. $x^2 - 4x$ için tam kareye tamamlamak üzere eklenmesi gereken sabit $(-4/2)^2 = 4$'tür, $(-4)^2 = 16$ değil. Kare almadan önce daima yarılayın.</div>

<h2 class="lesson-title">5. Çembere Teğet Doğrular</h2>

<div class="calc-highlight"><strong>Çembere teğet, çembere tam olarak tek noktada dokunan doğrudur.</strong> Geometrik olarak teğet, dokunma noktasındaki yarıçapa diktir — hem sezgisel (teğet merkeze "doğru eğilemez", aksi takdirde çemberi keserdi) hem de cebirsel olarak güçlü bir gerçek.</div>

<p class="l-text">Ayırt etmeniz gereken üç doğru:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Teğet</div><div class="card-body">Çembere tam olarak <strong>tek</strong> noktada dokunur. Dokunma noktası hem doğru hem de çember üzerindedir. O noktadaki yarıçapa diktir.</div></div>
<div class="calc-card"><div class="card-title">Kesen</div><div class="card-body">Çemberi <strong>iki</strong> noktada keser. Kesenin çemberin içinde kalan kesimi bir kiriştir.</div></div>
<div class="calc-card"><div class="card-title">Dış doğru</div><div class="card-body">Çemberle hiç buluşmaz. Merkezden doğruya olan uzaklık $r$'den büyüktür.</div></div>
</div>

<p class="l-text"><strong>Yarıçap-teğet diklik teoremi.</strong> $T$ dokunma noktası ve $C$ merkez ise $CT$ doğru parçası, $T$ noktasındaki teğet doğruya diktir. Bu, çemberler hakkında en kullanışlı tek gerçektir. Her teğet problemi nihayetinde bunu kullanır.</p>

<h3 style="margin-top:1.4rem;color:#3b82f6">5.1 Çember üzerindeki bir noktada teğetin denklemi</h3>

<p class="l-text">$(x_0, y_0)$ noktası merkezi $(a, b)$ ve yarıçapı $r$ olan çember üzerinde ise, $(x_0, y_0)$ noktasındaki teğetin denklemi</p>

<div class="calc-formula"><div class="formula-label">ÇEMBER ÜZERİNDEKİ NOKTADA TEĞET</div><div class="formula-main">$$(x - a)(x_0 - a) + (y - b)(y_0 - b) \\;=\\; r^2$$</div><div class="formula-sub">$(x-a)^2 + (y-b)^2 = r^2$ denkleminde her kare teriminin bir çarpanını dokunma noktasının koordinatıyla değiştirin. Tüm hile bu kadar.</div></div>

<p class="l-text"><strong>Neden işliyor.</strong> $C = (a, b)$ merkezinden $T = (x_0, y_0)$'a giden vektör $(x_0 - a, y_0 - b)$'dir. $T$'deki teğet bu yarıçapa diktir. $T$'den geçen ve bu yöne dik olan doğrunun genel denklemi tam olarak sol tarafa benzer; sağ taraf da $(x_0-a)^2 + (y_0-b)^2 = r^2$ (çünkü $T$ çember üzerinde). Sonuç olarak denklem.</p>

<div class="calc-example"><div class="example-label">ÖRNEK &mdash; VERİLEN NOKTADA TEĞET</div><div class="example-body">$(x - 2)^2 + (y - 1)^2 = 25$ çemberine $T = (5, 5)$ noktasındaki teğetin denklemini bulun.<br><br>Önce $T$'nin çember üzerinde olduğunu doğrulayın: $(5-2)^2 + (5-1)^2 = 9 + 16 = 25$ &check;.<br><br>Formülü $a=2$, $b=1$, $r^2=25$, $(x_0, y_0)=(5, 5)$ ile uygula:<br><br>$(x - 2)(5 - 2) + (y - 1)(5 - 1) = 25$<br><br>$3(x - 2) + 4(y - 1) = 25$<br><br>$3x - 6 + 4y - 4 = 25 \\;\\Rightarrow\\; \\mathbf{3x + 4y = 35}$.<br><br>Hızlı doğrulama: $C=(2,1)$'den $T=(5,5)$'e giden yarıçapın eğimi $(5-1)/(5-2) = 4/3$. Teğetin eğimi $-3/4$ olmalı (negatif ters). $3x + 4y = 35$ ifadesinden $y = -\\tfrac{3}{4}x + \\tfrac{35}{4}$ — eğim $-3/4$ &check;.</div></div>

<div class="calc-graph"><div id="plot-l79-tangent-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Bu grafik şunu gösteriyor:</strong> $(x-2)^2 + (y-1)^2 = 25$ çemberinin üzerinde iki noktayı kesen bir kiriş (turuncu) ve $(5, 5)$'te çembere dokunan bir teğet doğrusu (yeşil). Dokunma noktasına çizilmiş kesik gri yarıçap, yeşil teğet doğrusuna diktir — teğetliğin tanımlayıcı özelliği.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;th.push(a);xc.push(2+5*Math.cos(a));yc.push(1+5*Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'çember',line:{color:'#3b82f6',width:3}};
var ctr={x:[2],y:[1],mode:'markers+text',name:'merkez C(2,1)',marker:{color:'#e8e8e8',size:10,symbol:'cross'},text:['C(2,1)'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:12}};
var T={x:[5],y:[5],mode:'markers+text',name:'dokunma noktası T(5,5)',marker:{color:'#10b981',size:12,symbol:'diamond'},text:['T(5,5)'],textposition:'top right',textfont:{color:'#10b981',size:12}};
var rad={x:[2,5],y:[1,5],mode:'lines',name:'yarıçap CT',line:{color:'rgba(255,255,255,0.5)',width:2,dash:'dash'}};
var tx=[];var ty=[];for(var k=-3;k<=3;k+=0.2){tx.push(5+k*4);ty.push(5-k*3);}
var tan={x:tx,y:ty,mode:'lines',name:'teğet: 3x+4y=35',line:{color:'#10b981',width:2.4}};
var sx=[];var sy=[];for(var m=-3;m<=3;m+=0.2){sx.push(2+m*5);sy.push(-2+m*2);}
var sec={x:sx,y:sy,mode:'lines',name:'kiriş (iç kesen)',line:{color:'#f59e0b',width:2.2}};
var axX={x:[-5,9],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-5,8],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-5,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l79-tangent-tr',[axX,axY,ring,sec,rad,tan,ctr,T],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Kirişler ve Merkezden İnen Dikme</h2>

<div class="calc-highlight"><strong>Kiriş, uç noktaları çember üzerinde bulunan herhangi bir doğru parçasıdır.</strong> Çap, mümkün olan en uzun kiriştir — merkezden geçer ve uzunluğu $2r$'dir. Anahtar geometrik gerçek: <em>merkezden bir kirişin üzerine indirilen dikme o kirişi ortadan ikiye böler.</em> Bu, klasik geometrinin en temiz teoremlerinden biridir ve oluşan iki eş dik üçgene Pisagor uygulanarak elde edilir.</div>

<p class="l-text"><strong>Neden dikme kirişi ortalar.</strong> Kiriş $AB$ olsun ve $M$, merkez $C$'den inen dikmenin ayağı olsun. $CMA$ ve $CMB$ üçgenleri ikisi de $M$'de dik açılıdır, $CM$ bacağını paylaşırlar ve hipotenüsleri $CA = CB = r$ eşittir. Hipotenüs-bacak eşliği gereği iki üçgen eştir. Dolayısıyla $MA = MB$ — dikme ayağı kirişin tam yarısındadır.</p>

<div class="calc-formula"><div class="formula-label">DİKME UZAKLIĞINDAN KİRİŞ UZUNLUĞU</div><div class="formula-main">$$|AB| \\;=\\; 2\\sqrt{r^2 - h^2}$$</div><div class="formula-sub">Burada $h$, merkezden kirişe olan dik uzaklıktır. $CMA$ dik üçgeninin hipotenüsü $r$, bacağı $h$, kalan bacağı $|MA| = \\sqrt{r^2 - h^2}$'dir. İkiye katlayın, tam kiriş uzunluğunu elde edin.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body">$x^2 + y^2 = 25$ çemberinin bir kirişi merkeze dik uzaklıkta $3$ birimde bulunuyor. Uzunluğunu bulun.<br><br>$r = 5$, $h = 3$. Kiriş uzunluğu $= 2\\sqrt{25 - 9} = 2\\sqrt{16} = 2 \\cdot 4 = \\mathbf{8}$.<br><br>Mantık kontrolü: $0$ uzaklıktaki kiriş çap olur, uzunluk $2 \\cdot 5 = 10$. $5$ uzaklıktaki kiriş (çembere değen) uzunluk $0$ — dokunma noktasına çökerdi. $3$ uzaklıkta uzunluk $8$ aradaki mantıklı yerde duruyor.</div></div>

<div class="l-note"><strong>Teğete bağlanma.</strong> Teğet, iki kesişim noktası birleştiğinde kesenin limitidir. Kirişin iki ucu çember üzerinde birbirine kayarken kiriş bir noktaya çöker ve kesen doğrusu o noktadaki teğet doğrusuna dönüşür. Merkezden inen dikme — bir kesen için $h < r$ uzunluğunda — teğette $r$'ye eşit olana kadar artar.</div>

<h2 class="lesson-title">7. Dış Noktadan Teğet Uzunluğu</h2>

<div class="calc-highlight"><strong>Bir çemberin dışında durun ve bulunduğunuz noktadan iki teğet doğrusu çizin.</strong> Her biri çembere bir noktada dokunur. Sizden dokunma noktasına olan parçanın uzunluğu sabittir — ve bu uzunluk her iki teğet için aynıdır. Yalnızca merkeze olan uzaklığınız ve çemberin yarıçapı tarafından belirlenir.</div>

<p class="l-text">$P$, merkezi $C$ ve yarıçapı $r$ olan çemberden $d$ uzaklıktaki bir dış nokta olsun (yani $d > r$). $T$ bir dokunma noktası olsun. $PTC$ üçgeninde $T$'de dik açı vardır (çünkü teğet $T$'deki yarıçapa diktir), hipotenüsü $PC = d$ ve bir bacağı $CT = r$'dir. Pisagor'la:</p>

<div class="calc-formula"><div class="formula-label">DIŞ NOKTADAN TEĞET UZUNLUĞU</div><div class="formula-main">$$L \\;=\\; |PT| \\;=\\; \\sqrt{d^2 - r^2}$$</div><div class="formula-sub">$d$ noktanın merkeze uzaklığı, $r$ yarıçap. Formül $d > r$ gerektirir; $d = r$ ise $P$ çember üzerindedir ve $L = 0$; $d < r$ ise $P$ içeridedir ve gerçek teğet yoktur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İki teğet eşit uzunluktadır</div><div class="card-body">Aynı dış noktadan iki teğet parçası eştir. $PC$ doğrusu etrafında ikizkenar bir yapı oluştururlar.</div></div>
<div class="calc-card"><div class="card-title">$L > 0 \\Leftrightarrow d > r$</div><div class="card-body">Teğet uzunluğu yalnızca $P$ kesinlikle çemberin dışındaysa pozitiftir. Sınırda $L = 0$; içeride gerçek teğet yoktur.</div></div>
<div class="calc-card"><div class="card-title">Genel formdan $L^2$</div><div class="card-body">Çember $x^2 + y^2 + Dx + Ey + F = 0$ ve $P = (x_1, y_1)$ ise $L^2 = x_1^2 + y_1^2 + Dx_1 + Ey_1 + F$ — noktayı sol tarafa yerleştirin.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body">$P = (8, 0)$ noktasından $x^2 + y^2 = 9$ çemberine teğet uzunluğunu bulun.<br><br>Merkez $C = (0, 0)$, yarıçap $r = 3$. Uzaklık $d = |OP| = 8$.<br><br>$L = \\sqrt{d^2 - r^2} = \\sqrt{64 - 9} = \\sqrt{55} \\approx \\mathbf{7.416}$.<br><br>Yerine koyma kısayoluyla doğrulama: $L^2 = x_1^2 + y_1^2 - 9 = 64 + 0 - 9 = 55$ &check;.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2</div><div class="example-body">$P = (10, 7)$ noktasından $(x - 2)^2 + (y - 1)^2 = 25$ çemberine teğet uzunluğu.<br><br>Merkez $C = (2, 1)$, yarıçap $r = 5$. Uzaklık:<br><br>$d^2 = (10 - 2)^2 + (7 - 1)^2 = 64 + 36 = 100 \\;\\Rightarrow\\; d = 10$.<br><br>$L = \\sqrt{100 - 25} = \\sqrt{75} = 5\\sqrt{3} \\approx \\mathbf{8.66}$.</div></div>

<div class="calc-graph"><div id="plot-l79-external-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Bu grafik şunu gösteriyor:</strong> $x^2 + y^2 = 9$ çemberi ve $P = (8, 0)$ dış noktası. $P$'den çıkan iki teğet doğrusu x-ekseninin simetrik olarak üst ve altında çembere dokunur. Kesik gri parçalar iki teğet uzunluğudur ve ikisi de $\\sqrt{55}$ değerine eşittir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;th.push(a);xc.push(3*Math.cos(a));yc.push(3*Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'çember x^2+y^2=9',line:{color:'#3b82f6',width:3}};
var Px=8,Py=0,r=3,d=8;
var T1x=r*r/d;
var T1y=(r/d)*Math.sqrt(d*d-r*r);
var T2x=T1x, T2y=-T1y;
var ext={x:[Px],y:[Py],mode:'markers+text',name:'dış nokta P(8,0)',marker:{color:'#f59e0b',size:12,symbol:'star'},text:['P(8,0)'],textposition:'top right',textfont:{color:'#f59e0b',size:13}};
var tan1={x:[Px,T1x],y:[Py,T1y],mode:'lines+markers',name:'teğet uzunluğu L=√55',line:{color:'#10b981',width:2.6,dash:'dash'},marker:{color:'#10b981',size:9}};
var tan2={x:[Px,T2x],y:[Py,T2y],mode:'lines+markers',name:'teğet (diğer)',line:{color:'#ef4444',width:2.6,dash:'dash'},marker:{color:'#ef4444',size:9}};
var ctr={x:[0],y:[0],mode:'markers+text',name:'merkez O(0,0)',marker:{color:'#e8e8e8',size:9,symbol:'cross'},text:['O'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:12}};
var radOT={x:[0,T1x],y:[0,T1y],mode:'lines',name:'yarıçap (r⊥teğet)',line:{color:'rgba(255,255,255,0.5)',width:1.6,dash:'dot'}};
var axX={x:[-4,10],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-5,5],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l79-external-tr',[axX,axY,ring,radOT,tan1,tan2,ctr,ext],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Dikkat Edilmesi Gereken Sık Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kare tamamlamada işaret çevirisi</div><div class="card-body">$(x + 3)^2 + (y - 4)^2 = 25$ çemberinin merkezi $(-3, 4)$'tür, $(3, -4)$ değil. Parantez içindeki işaret $(x - a)$ ve $(y - b)$ olarak okurken döner.</div></div>
<div class="calc-card"><div class="card-title">Katsayıyı yarılamayı unutmak</div><div class="card-body">$x^2 - 6x$ için eklenmesi gereken sabit $(-6/2)^2 = 9$'dur, $(-6)^2 = 36$ değil. Kare almadan önce daima yarıla.</div></div>
<div class="calc-card"><div class="card-title">Her şeye kiriş demek</div><div class="card-body">Teğet bir noktada dokunur. Kiriş <em>iki kesişim noktası arasındaki parçadır</em>. Kesen, kirişi içeren tam doğrudur. Bunlar üç farklı nesnedir.</div></div>
<div class="calc-card"><div class="card-title">$L = \\sqrt{d - r}$ yerine $\\sqrt{d^2 - r^2}$ kullanmak</div><div class="card-body">Pisagor teoremi karesel büyüklükler kullanır. Karekökün içinden kareleri düşürmeyin.</div></div>
<div class="calc-card"><div class="card-title">Noktanın çember üzerinde olup olmadığını kontrol etmemek</div><div class="card-body">$(x_0, y_0)$'da teğet denklemi yazmadan önce $(x_0 - a)^2 + (y_0 - b)^2 = r^2$ olduğunu doğrulayın. Değilse teğet formülü uygulanmaz.</div></div>
<div class="calc-card"><div class="card-title">$r^2$'nin pozitif olması gerektiğini unutmak</div><div class="card-body">Kare tamamlama sıfır veya negatif sağ taraf verirse denklem çember değildir — nokta veya boş kümedir.</div></div>
</div>

<h2 class="lesson-title">9. Alıştırmalar</h2>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body">Merkezi $(-1, 2)$ ve yarıçapı $\\sqrt{10}$ olan çemberin denklemini yazın.<br><br><strong>Çözüm.</strong> $(x + 1)^2 + (y - 2)^2 = 10$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body">Merkezi orijin olan ve $(6, 8)$ noktasından geçen çemberin denklemini bulun.<br><br><strong>Çözüm.</strong> Yarıçap $r = \\sqrt{36 + 64} = 10$. Denklem: $x^2 + y^2 = 100$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body">$x^2 + y^2 + 8x - 6y + 9 = 0$ çemberinin merkez ve yarıçapını bulun.<br><br><strong>Çözüm.</strong> Kare tamamla: $(x + 4)^2 - 16 + (y - 3)^2 - 9 + 9 = 0 \\Rightarrow (x+4)^2 + (y-3)^2 = 16$. Merkez $(-4, 3)$, yarıçap $4$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body">$(x - 1)^2 + (y + 2)^2 = 13$ çemberine $(3, 1)$ noktasındaki teğeti yazın.<br><br><strong>Çözüm.</strong> Noktanın çember üzerinde olduğunu doğrula: $(3-1)^2 + (1+2)^2 = 4 + 9 = 13$ &check;. Teğet formülünü uygula: $(x - 1)(3 - 1) + (y + 2)(1 + 2) = 13 \\Rightarrow 2(x - 1) + 3(y + 2) = 13 \\Rightarrow 2x + 3y = 9$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body">$(7, 1)$ noktasından $(x - 1)^2 + (y - 1)^2 = 9$ çemberine teğet uzunluğunu bulun.<br><br><strong>Çözüm.</strong> Merkez $(1, 1)$'den $(7, 1)$'e uzaklık: $d = 6$. Yarıçap $r = 3$. $L = \\sqrt{36 - 9} = \\sqrt{27} = 3\\sqrt{3}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6</div><div class="example-body">$x^2 + y^2 = 100$ çemberinin bir kirişinin uzunluğu $12$. Merkeze dik uzaklığı nedir?<br><br><strong>Çözüm.</strong> $|AB| = 2\\sqrt{r^2 - h^2}$ formülünü kullan: $12 = 2\\sqrt{100 - h^2} \\Rightarrow 6 = \\sqrt{100 - h^2} \\Rightarrow 36 = 100 - h^2 \\Rightarrow h^2 = 64 \\Rightarrow h = 8$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7</div><div class="example-body">$x^2 + y^2 - 4x - 4y + 12 = 0$ ifadesinin gerçek bir çember olup olmadığını belirleyin.<br><br><strong>Çözüm.</strong> $(x - 2)^2 - 4 + (y - 2)^2 - 4 + 12 = 0 \\Rightarrow (x-2)^2 + (y-2)^2 = -4$. Sağ taraf negatif — gerçek çember yok, geometrik yer boş.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8</div><div class="example-body">Bir çember $A=(0, 0)$ ve $B=(6, 0)$ noktalarından geçiyor, merkezi $x = 3$ doğrusu üzerindedir. Yarıçapı $5$ ise denklemini bulun.<br><br><strong>Çözüm.</strong> Merkez bir $k$ için $(3, k)$ olsun. Orijine uzaklık 5'e eşit: $\\sqrt{9 + k^2} = 5 \\Rightarrow k^2 = 16 \\Rightarrow k = \\pm 4$. İki çember: $(x-3)^2 + (y-4)^2 = 25$ veya $(x-3)^2 + (y+4)^2 = 25$.</div></div>

<div class="calc-highlight" style="margin-top:2rem"><strong>Özet.</strong> Her çember problemi iki beceriye indirgenir: (1) kare tamamlama ile standart ve genel formlar arasında geçiş, ve (2) dokunma noktasındaki yarıçap-teğet diklik özelliğini kullanma. Bu ikisinde uzmanlaşın; lise analitik geometrisinin önünüze atacağı her kiriş, teğet ve kesişim sorusuyla baş edebilirsiniz.</div>
`
};
