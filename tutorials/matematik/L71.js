window.LISE_MAT_L71 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>In the previous lesson you discovered the polar form's killer feature:</strong> multiplying complex numbers reduces to multiplying lengths and adding angles. The last worked example took it one tiny step further and computed $(1 + i)^4$ by repeated multiplication of the same factor. Hidden inside that one example is one of the most useful identities in all of mathematics — <em>De Moivre's theorem</em> — which turns the awkward business of raising a complex number to a power into a one-line operation.</p>

<p class="l-text">From De Moivre's theorem follows a beautiful geometric fact: every complex number has exactly $n$ different $n$-th roots, and they always sit at the vertices of a regular polygon inscribed in a circle. The roots of $z^n = 1$ in particular — the <em>roots of unity</em> — divide the unit circle into $n$ equal arcs. By the end of this lesson you will be able to compute powers of any complex number, list all the $n$-th roots, and recognise the regular polygons that pop out of the algebra.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State and prove De Moivre's theorem $(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta$ by induction</li>
<li>Compute powers $z^n = r^n\\,\\text{cis}(n\\theta)$ from polar form, including high powers like $(1+i)^{10}$</li>
<li>Derive trigonometric identities such as $\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta$ using De Moivre with $n = 2, 3$</li>
<li>Solve $z^n = w$ to find all $n$ distinct complex $n$-th roots of a given number $w$</li>
<li>List the $n$-th roots of unity $1, \\omega, \\omega^2, \\ldots, \\omega^{n-1}$ where $\\omega = \\text{cis}(2\\pi/n)$</li>
<li>Recognise that the $n$-th roots of any complex number form a regular $n$-gon inscribed in a circle</li>
</ul>
</div>

<h2 class="lesson-title">1. De Moivre's Theorem</h2>

<div class="calc-highlight"><strong>De Moivre's theorem is the multiplication-in-polar-form rule, applied to a single complex number multiplied by itself.</strong> If multiplying two factors adds the arguments and multiplies the moduli, then multiplying $n$ identical factors adds the argument $n$ times (so it becomes $n\\theta$) and multiplies the modulus $n$ times (so it becomes $r^n$). The result deserves to be named.</div>

<div class="calc-formula"><div class="formula-label">DE MOIVRE'S THEOREM</div><div class="formula-main">$$(\\cos\\theta + i\\sin\\theta)^n \\;=\\; \\cos n\\theta + i\\sin n\\theta$$</div><div class="formula-sub">Or in cis notation: $(\\text{cis}\\,\\theta)^n = \\text{cis}(n\\theta)$. For any integer $n$ — positive, negative, or zero — and any real angle $\\theta$.</div></div>

<p class="l-text"><strong>The full polar version,</strong> for a complex number with arbitrary modulus $r$, follows immediately by pulling the $r$ outside:</p>

<div class="calc-formula"><div class="formula-label">DE MOIVRE FOR ANY MODULUS</div><div class="formula-main">$$\\bigl(r\\,\\text{cis}\\,\\theta\\bigr)^n \\;=\\; r^n\\,\\text{cis}(n\\theta) \\;=\\; r^n(\\cos n\\theta + i\\sin n\\theta)$$</div><div class="formula-sub">Take the $n$-th power of the modulus. Multiply the argument by $n$. That is the entire procedure.</div></div>

<h2 class="lesson-title">2. Proof by Induction (Sketch)</h2>

<p class="l-text">The proof is a short induction on $n$. Let $P(n)$ denote the statement $(\\text{cis}\\,\\theta)^n = \\text{cis}(n\\theta)$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Base case ($n = 1$)</div><div class="card-body">$(\\text{cis}\\,\\theta)^1 = \\text{cis}\\,\\theta = \\text{cis}(1 \\cdot \\theta)$. Trivially true.</div></div>
<div class="calc-card"><div class="card-title">Inductive step</div><div class="card-body">Assume $P(k)$: $(\\text{cis}\\,\\theta)^k = \\text{cis}(k\\theta)$. Then $(\\text{cis}\\,\\theta)^{k+1} = (\\text{cis}\\,\\theta)^k \\cdot \\text{cis}\\,\\theta = \\text{cis}(k\\theta) \\cdot \\text{cis}\\,\\theta = \\text{cis}(k\\theta + \\theta) = \\text{cis}((k+1)\\theta)$. So $P(k+1)$ holds.</div></div>
<div class="calc-card"><div class="card-title">Conclusion</div><div class="card-body">By induction, $P(n)$ holds for every positive integer $n$. The case $n = 0$ gives the trivial identity $1 = \\text{cis}\\,0 = 1$. Negative integers are handled by the reciprocal rule $1/z = (1/r)\\,\\text{cis}(-\\theta)$ from the previous lesson.</div></div>
</div>

<div class="l-note"><strong>The key step.</strong> The inductive step uses only the polar multiplication rule $\\text{cis}\\,\\alpha \\cdot \\text{cis}\\,\\beta = \\text{cis}(\\alpha + \\beta)$, which is itself a re-packaging of the cosine and sine addition formulas. So De Moivre's theorem is, at heart, the addition formulas applied repeatedly.</div>

<h2 class="lesson-title">3. Computing Powers</h2>

<div class="calc-highlight"><strong>Raising a complex number to a high power is now trivial.</strong> Convert to polar, raise the modulus, multiply the argument, then (if needed) convert back. No FOIL, no sign juggling, no exhaustion.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — A SMALL POWER</div><div class="example-body">Compute $(1 + i)^2$ two ways and check.<br><br>Polar: $1 + i = \\sqrt 2\\,\\text{cis}(\\pi/4)$. By De Moivre, $(1 + i)^2 = (\\sqrt 2)^2\\,\\text{cis}(2 \\cdot \\pi/4) = 2\\,\\text{cis}(\\pi/2) = 2(0 + i \\cdot 1) = \\mathbf{2i}$.<br>FOIL: $(1+i)^2 = 1 + 2i + i^2 = 1 + 2i - 1 = 2i$. Match.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — THE BIG ONE: $(1+i)^{10}$</div><div class="example-body">Computing $(1+i)^{10}$ by FOIL would mean expanding ten factors — pages of work, dozens of cancellations, easy to slip a sign. De Moivre handles it in three lines.<br><br>$1 + i = \\sqrt 2\\,\\text{cis}(\\pi/4)$.<br>$(1+i)^{10} = (\\sqrt 2)^{10}\\,\\text{cis}(10 \\cdot \\pi/4) = 32\\,\\text{cis}(10\\pi/4) = 32\\,\\text{cis}(5\\pi/2)$.<br>Reduce the angle: $5\\pi/2 = 2\\pi + \\pi/2$, so $\\text{cis}(5\\pi/2) = \\text{cis}(\\pi/2) = i$.<br><br>Answer: $(1+i)^{10} = 32 \\cdot i = \\mathbf{32 i}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — NEGATIVE POWER</div><div class="example-body">Compute $(1 + i)^{-3}$.<br><br>$1 + i = \\sqrt 2\\,\\text{cis}(\\pi/4)$. By De Moivre, $(1+i)^{-3} = (\\sqrt 2)^{-3}\\,\\text{cis}(-3\\pi/4) = \\dfrac{1}{2\\sqrt 2}\\,\\text{cis}(-3\\pi/4)$.<br>$\\cos(-3\\pi/4) = -\\dfrac{\\sqrt 2}{2}$, $\\sin(-3\\pi/4) = -\\dfrac{\\sqrt 2}{2}$.<br>Result: $\\dfrac{1}{2\\sqrt 2}\\left(-\\dfrac{\\sqrt 2}{2} - \\dfrac{\\sqrt 2}{2} i\\right) = -\\dfrac{1}{4} - \\dfrac{1}{4} i$.</div></div>

<div class="l-note"><strong>Sanity check on negative powers.</strong> $(1+i)^{-3} = 1/(1+i)^3$. By the previous lesson, the reciprocal in polar form simply flips the sign of the argument and inverts the modulus — which is exactly what we got. De Moivre is consistent for all integer exponents.</div>

<h2 class="lesson-title">4. Deriving Trigonometric Identities</h2>

<div class="calc-highlight"><strong>De Moivre's theorem is a factory for trig identities.</strong> By setting $n = 2, 3, 4, \\ldots$ and expanding the left-hand side with the binomial theorem, you get formulas for $\\cos n\\theta$ and $\\sin n\\theta$ in terms of $\\cos\\theta$ and $\\sin\\theta$. The double-angle and triple-angle formulas drop out instantly.</div>

<p class="l-text"><strong>Case $n = 2$ (double angle).</strong> Start from the left-hand side, expand:</p>

<div class="calc-formula"><div class="formula-label">DE MOIVRE WITH $n = 2$</div><div class="formula-main">$$(\\cos\\theta + i\\sin\\theta)^2 \\;=\\; \\cos 2\\theta + i\\sin 2\\theta$$</div></div>

<p class="l-text">Expand the square on the left: $(\\cos\\theta + i\\sin\\theta)^2 = \\cos^2\\theta + 2i\\cos\\theta\\sin\\theta + i^2\\sin^2\\theta = (\\cos^2\\theta - \\sin^2\\theta) + i\\,(2\\cos\\theta\\sin\\theta)$. Compare real and imaginary parts with the right-hand side:</p>

<div class="calc-formula"><div class="formula-label">DOUBLE-ANGLE FORMULAS FROM DE MOIVRE</div><div class="formula-main">$$\\cos 2\\theta \\;=\\; \\cos^2\\theta - \\sin^2\\theta \\qquad \\sin 2\\theta \\;=\\; 2\\cos\\theta\\sin\\theta$$</div><div class="formula-sub">Two identities for the price of one. The real parts match; the imaginary parts match.</div></div>

<p class="l-text"><strong>Case $n = 3$ (triple angle).</strong> Expand $(\\cos\\theta + i\\sin\\theta)^3$ using the binomial theorem:</p>

<div class="calc-formula"><div class="formula-label">TRIPLE-ANGLE EXPANSION</div><div class="formula-main">$$(\\cos\\theta + i\\sin\\theta)^3 \\;=\\; \\cos^3\\theta + 3i\\cos^2\\theta\\sin\\theta - 3\\cos\\theta\\sin^2\\theta - i\\sin^3\\theta$$</div><div class="formula-sub">Used $i^2 = -1$ and $i^3 = -i$.</div></div>

<p class="l-text">Equate real and imaginary parts with $\\cos 3\\theta + i\\sin 3\\theta$:</p>

<div class="calc-formula"><div class="formula-label">TRIPLE-ANGLE FORMULAS</div><div class="formula-main">$$\\cos 3\\theta \\;=\\; \\cos^3\\theta - 3\\cos\\theta\\sin^2\\theta \\qquad \\sin 3\\theta \\;=\\; 3\\cos^2\\theta\\sin\\theta - \\sin^3\\theta$$</div><div class="formula-sub">Using $\\sin^2\\theta = 1 - \\cos^2\\theta$ on the cosine gives the equivalent form $\\cos 3\\theta = 4\\cos^3\\theta - 3\\cos\\theta$.</div></div>

<div class="l-note"><strong>This is why De Moivre matters in trigonometry.</strong> The "remember the double-angle formula" homework problem becomes a derivation, not a memorisation. Squaring or cubing $\\cos\\theta + i\\sin\\theta$ is mechanical; the identities fall out automatically.</div>

<h2 class="lesson-title">5. The Equation $z^n = w$: How Many Solutions?</h2>

<div class="calc-highlight"><strong>For a real number $w > 0$, the equation $z^n = w$ has exactly one positive real solution $z = w^{1/n}$ (the "principal" $n$-th root).</strong> Over the complex numbers, the equation has exactly $n$ solutions. This is a special case of the fundamental theorem of algebra: a polynomial of degree $n$ has $n$ roots counted with multiplicity, and for $z^n - w$ all $n$ roots are distinct.</div>

<p class="l-text">To find them, write $w$ in polar form $w = R\\,\\text{cis}\\,\\phi$ with $R > 0$, and look for a candidate root $z = r\\,\\text{cis}\\,\\theta$. By De Moivre, $z^n = r^n\\,\\text{cis}(n\\theta)$. Setting this equal to $w$:</p>

<div class="calc-formula"><div class="formula-label">MATCHING THE TWO POLAR FORMS</div><div class="formula-main">$$r^n \\,=\\, R \\qquad\\text{and}\\qquad n\\theta \\,\\equiv\\, \\phi \\pmod{2\\pi}$$</div><div class="formula-sub">The modulus equation has the unique positive real solution $r = R^{1/n}$. The argument equation has infinitely many solutions, but they collapse into $n$ distinct values modulo $2\\pi$.</div></div>

<p class="l-text">Solving for $\\theta$: $n\\theta = \\phi + 2\\pi k$ for some integer $k$, so $\\theta = (\\phi + 2\\pi k)/n$. Taking $k = 0, 1, 2, \\ldots, n-1$ gives $n$ distinct angles before the pattern repeats.</p>

<div class="calc-formula"><div class="formula-label">THE $n$ COMPLEX $n$-TH ROOTS OF $w = R\\,\\text{cis}\\,\\phi$</div><div class="formula-main">$$z_k \\;=\\; R^{1/n}\\,\\text{cis}\\!\\left(\\frac{\\phi + 2\\pi k}{n}\\right), \\qquad k = 0, 1, 2, \\ldots, n-1$$</div><div class="formula-sub">Each value of $k$ gives a different root. All $n$ roots share the same modulus $R^{1/n}$, so they sit on a circle. Their arguments differ by $2\\pi/n$, so they are equally spaced around that circle.</div></div>

<h2 class="lesson-title">6. The Regular Polygon Hidden in Every Root Computation</h2>

<div class="calc-highlight"><strong>Look at the formula again.</strong> Every $n$-th root of $w$ has the same modulus $R^{1/n}$. Consecutive arguments differ by exactly $2\\pi/n$. That means the $n$ roots are $n$ equally-spaced points on a circle of radius $R^{1/n}$ — the vertices of a <em>regular $n$-gon</em> inscribed in that circle. Algebra becomes geometry.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$n = 2$ (square roots)</div><div class="card-body">Two points, $\\pi$ apart. They sit at opposite ends of a diameter. Example: square roots of $4 = 4\\,\\text{cis}\\,0$ are $2\\,\\text{cis}\\,0 = 2$ and $2\\,\\text{cis}\\,\\pi = -2$.</div></div>
<div class="calc-card"><div class="card-title">$n = 3$ (cube roots)</div><div class="card-body">Three points, $2\\pi/3 = 120^\\circ$ apart. Vertices of an equilateral triangle.</div></div>
<div class="calc-card"><div class="card-title">$n = 4$ (fourth roots)</div><div class="card-body">Four points, $\\pi/2 = 90^\\circ$ apart. Vertices of a square.</div></div>
<div class="calc-card"><div class="card-title">$n = 6$ (sixth roots)</div><div class="card-body">Six points, $\\pi/3 = 60^\\circ$ apart. Vertices of a regular hexagon.</div></div>
</div>

<h2 class="lesson-title">7. Roots of Unity</h2>

<div class="calc-highlight"><strong>The $n$-th roots of $1$ are special — they are called the <em>$n$-th roots of unity</em>.</strong> Set $w = 1 = 1\\,\\text{cis}\\,0$ in the formula. The modulus of every root is $1^{1/n} = 1$. The arguments are $2\\pi k / n$ for $k = 0, 1, \\ldots, n-1$. So the $n$-th roots of unity are $n$ equally-spaced points on the <em>unit circle</em>, starting at the point $1$.</div>

<div class="calc-formula"><div class="formula-label">$n$-TH ROOTS OF UNITY</div><div class="formula-main">$$z_k \\;=\\; \\text{cis}\\!\\left(\\frac{2\\pi k}{n}\\right) \\;=\\; \\cos\\!\\frac{2\\pi k}{n} + i\\sin\\!\\frac{2\\pi k}{n}, \\qquad k = 0, 1, \\ldots, n-1$$</div><div class="formula-sub">A single symbol does the work of all of them. Define the <em>primitive</em> $n$-th root of unity as $\\omega = \\text{cis}(2\\pi/n)$. Then the full list is $1, \\omega, \\omega^2, \\omega^3, \\ldots, \\omega^{n-1}$ — powers of one fixed number.</div></div>

<p class="l-text">The vertex at $k = 0$ is the number $1$ itself. The next vertex, at angle $2\\pi/n$, is the primitive root $\\omega$. The remaining vertices are simply $\\omega^2, \\omega^3, \\ldots, \\omega^{n-1}$ — De Moivre rotating $\\omega$ around the unit circle. Vertex $n$ would wrap back to angle $2\\pi$ and coincide with the original $1$, which is why we stop at $k = n-1$.</p>

<h2 class="lesson-title">8. Worked Examples of Roots</h2>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — FOURTH ROOTS OF UNITY</div><div class="example-body">Find all solutions of $z^4 = 1$.<br><br>$1 = 1\\,\\text{cis}\\,0$. Modulus of each root: $1^{1/4} = 1$. Arguments: $\\dfrac{2\\pi k}{4} = \\dfrac{\\pi k}{2}$ for $k = 0, 1, 2, 3$.<br><br>$z_0 = \\text{cis}\\,0 = \\mathbf{1}$<br>$z_1 = \\text{cis}(\\pi/2) = \\mathbf{i}$<br>$z_2 = \\text{cis}\\,\\pi = \\mathbf{-1}$<br>$z_3 = \\text{cis}(3\\pi/2) = \\mathbf{-i}$<br><br>The four fourth roots of unity are $\\{1, i, -1, -i\\}$ — the four corners of a square inscribed in the unit circle.</div></div>

<div class="calc-graph"><div id="plot-l71-fourth-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the four fourth roots of unity as red dots on the unit circle. Their arguments are $0, \\pi/2, \\pi, 3\\pi/2$ — equal spacing of $\\pi/2 = 90^\\circ$. The dashed lines connecting consecutive dots trace out the inscribed square; the dotted radial lines show the rays from the origin to each root.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ringX=[],ringY=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;ringX.push(Math.cos(a));ringY.push(Math.sin(a));}
var ring={x:ringX,y:ringY,mode:'lines',name:'unit circle',line:{color:'rgba(255,255,255,0.35)',width:1.4}};
var angs=[0,Math.PI/2,Math.PI,3*Math.PI/2];
var rx=[],ry=[];for(var k=0;k<angs.length;k++){rx.push(Math.cos(angs[k]));ry.push(Math.sin(angs[k]));}
var rxClose=rx.concat([rx[0]]),ryClose=ry.concat([ry[0]]);
var sq={x:rxClose,y:ryClose,mode:'lines',name:'inscribed square',line:{color:'#3b82f6',width:1.8,dash:'dash'}};
var spokes={x:[],y:[],mode:'lines',name:'radii',line:{color:'rgba(245,158,11,0.55)',width:1.2,dash:'dot'}};
for(var m=0;m<angs.length;m++){spokes.x.push(0,Math.cos(angs[m]),null);spokes.y.push(0,Math.sin(angs[m]),null);}
var pts={x:rx,y:ry,mode:'markers+text',name:'fourth roots',marker:{color:'#ef4444',size:13,line:{color:'#fff',width:1.5}},text:['1','i','-1','-i'],textposition:['middle right','top center','middle left','bottom center'],textfont:{color:'#e8e8e8',size:14}};
var axX={x:[-1.4,1.4],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-1.4,1.4],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l71-fourth-en',[axX,axY,ring,sq,spokes,pts],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — CUBE ROOTS OF 8</div><div class="example-body">Find all solutions of $z^3 = 8$.<br><br>$8 = 8\\,\\text{cis}\\,0$. Modulus of each root: $8^{1/3} = 2$. Arguments: $\\dfrac{2\\pi k}{3}$ for $k = 0, 1, 2$.<br><br>$z_0 = 2\\,\\text{cis}\\,0 = \\mathbf{2}$<br>$z_1 = 2\\,\\text{cis}(2\\pi/3) = 2(-1/2 + i\\sqrt 3/2) = \\mathbf{-1 + \\sqrt 3\\, i}$<br>$z_2 = 2\\,\\text{cis}(4\\pi/3) = 2(-1/2 - i\\sqrt 3/2) = \\mathbf{-1 - \\sqrt 3\\, i}$<br><br>The three cube roots of 8 form an equilateral triangle inscribed in the circle of radius 2. Notice that $z_0 = 2$ is the familiar real cube root — but it is only one of three.</div></div>

<div class="calc-graph"><div id="plot-l71-cube8-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the three cube roots of 8 plotted on a circle of radius 2. They sit at angles $0^\\circ$, $120^\\circ$, $240^\\circ$ — equal spacing of $120^\\circ$. Joining the three roots in order draws an equilateral triangle. The familiar real cube root $\\sqrt[3]{8} = 2$ is only the rightmost vertex.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var R=2;var ringX=[],ringY=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;ringX.push(R*Math.cos(a));ringY.push(R*Math.sin(a));}
var ring={x:ringX,y:ringY,mode:'lines',name:'circle r=2',line:{color:'rgba(255,255,255,0.3)',width:1.4}};
var unitX=[],unitY=[];for(var ii=0;ii<=200;ii++){var aa=2*Math.PI*ii/200;unitX.push(Math.cos(aa));unitY.push(Math.sin(aa));}
var unit={x:unitX,y:unitY,mode:'lines',name:'unit circle',line:{color:'rgba(255,255,255,0.15)',width:1,dash:'dot'}};
var angs=[0,2*Math.PI/3,4*Math.PI/3];
var rx=[],ry=[];for(var k=0;k<angs.length;k++){rx.push(R*Math.cos(angs[k]));ry.push(R*Math.sin(angs[k]));}
var rxClose=rx.concat([rx[0]]),ryClose=ry.concat([ry[0]]);
var tri={x:rxClose,y:ryClose,mode:'lines',name:'equilateral triangle',line:{color:'#3b82f6',width:1.8,dash:'dash'}};
var spokes={x:[],y:[],mode:'lines',name:'radii',line:{color:'rgba(245,158,11,0.55)',width:1.2,dash:'dot'}};
for(var m=0;m<angs.length;m++){spokes.x.push(0,R*Math.cos(angs[m]),null);spokes.y.push(0,R*Math.sin(angs[m]),null);}
var pts={x:rx,y:ry,mode:'markers+text',name:'cube roots of 8',marker:{color:'#ef4444',size:13,line:{color:'#fff',width:1.5}},text:['2','-1+√3 i','-1-√3 i'],textposition:['middle right','top left','bottom left'],textfont:{color:'#e8e8e8',size:13}};
var axX={x:[-2.6,2.6],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-2.6,2.6],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-2.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-2.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l71-cube8-en',[axX,axY,unit,ring,tri,spokes,pts],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — CUBE ROOTS OF $-1$</div><div class="example-body">Find all solutions of $z^3 = -1$.<br><br>$-1 = 1\\,\\text{cis}\\,\\pi$. Modulus of each root: $1^{1/3} = 1$. Arguments: $\\dfrac{\\pi + 2\\pi k}{3}$ for $k = 0, 1, 2$.<br><br>$z_0 = \\text{cis}(\\pi/3) = \\dfrac{1}{2} + \\dfrac{\\sqrt 3}{2} i$<br>$z_1 = \\text{cis}(\\pi) = \\mathbf{-1}$<br>$z_2 = \\text{cis}(5\\pi/3) = \\dfrac{1}{2} - \\dfrac{\\sqrt 3}{2} i$<br><br>One of the three roots is the familiar real cube root $-1$; the other two are conjugate complex pairs in the right half-plane.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SIXTH ROOTS OF UNITY</div><div class="example-body">Find all solutions of $z^6 = 1$.<br><br>All six roots have modulus 1. Arguments: $\\dfrac{2\\pi k}{6} = \\dfrac{\\pi k}{3}$ for $k = 0, 1, 2, 3, 4, 5$.<br><br>$z_0 = 1, \\;\\; z_1 = \\text{cis}(60^\\circ) = \\dfrac{1}{2} + \\dfrac{\\sqrt 3}{2} i$<br>$z_2 = \\text{cis}(120^\\circ) = -\\dfrac{1}{2} + \\dfrac{\\sqrt 3}{2} i, \\;\\; z_3 = -1$<br>$z_4 = \\text{cis}(240^\\circ) = -\\dfrac{1}{2} - \\dfrac{\\sqrt 3}{2} i, \\;\\; z_5 = \\text{cis}(300^\\circ) = \\dfrac{1}{2} - \\dfrac{\\sqrt 3}{2} i$<br><br>The six sixth roots of unity form a regular hexagon inscribed in the unit circle. Notice that they include the second roots ($\\pm 1$), the third roots ($1, z_2, z_4$), and three new ones — every divisor of 6 contributes.</div></div>

<div class="calc-graph"><div id="plot-l71-sixth-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the six sixth roots of unity on the unit circle. They occupy angles $0^\\circ, 60^\\circ, 120^\\circ, 180^\\circ, 240^\\circ, 300^\\circ$. Joining adjacent roots draws the regular hexagon. The square roots of unity $\\{1, -1\\}$ and the cube roots of unity $\\{1, \\text{cis}(120^\\circ), \\text{cis}(240^\\circ)\\}$ are visible as sub-patterns.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ringX=[],ringY=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;ringX.push(Math.cos(a));ringY.push(Math.sin(a));}
var ring={x:ringX,y:ringY,mode:'lines',name:'unit circle',line:{color:'rgba(255,255,255,0.35)',width:1.4}};
var angs=[];for(var k=0;k<6;k++){angs.push(2*Math.PI*k/6);}
var rx=[],ry=[];for(var kk=0;kk<angs.length;kk++){rx.push(Math.cos(angs[kk]));ry.push(Math.sin(angs[kk]));}
var rxClose=rx.concat([rx[0]]),ryClose=ry.concat([ry[0]]);
var hex={x:rxClose,y:ryClose,mode:'lines',name:'regular hexagon',line:{color:'#3b82f6',width:1.8,dash:'dash'}};
var spokes={x:[],y:[],mode:'lines',name:'radii',line:{color:'rgba(245,158,11,0.55)',width:1.2,dash:'dot'}};
for(var m=0;m<angs.length;m++){spokes.x.push(0,Math.cos(angs[m]),null);spokes.y.push(0,Math.sin(angs[m]),null);}
var labs=['1','ω','ω²','ω³ = -1','ω⁴','ω⁵'];
var tpos=['middle right','top right','top left','middle left','bottom left','bottom right'];
var pts={x:rx,y:ry,mode:'markers+text',name:'sixth roots',marker:{color:'#ef4444',size:13,line:{color:'#fff',width:1.5}},text:labs,textposition:tpos,textfont:{color:'#e8e8e8',size:13}};
var axX={x:[-1.5,1.5],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-1.5,1.5],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-1.5,1.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-1.5,1.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l71-sixth-en',[axX,axY,ring,hex,spokes,pts],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. The Sum of the $n$-th Roots of Unity is Zero</h2>

<div class="calc-highlight"><strong>A beautiful algebraic fact with a purely geometric proof.</strong> For every $n \\geq 2$, the sum $1 + \\omega + \\omega^2 + \\cdots + \\omega^{n-1} = 0$.</div>

<p class="l-text"><strong>Geometric reason.</strong> The $n$ roots are the vertices of a regular $n$-gon centred at the origin. By symmetry, the centroid of the vertices coincides with the centre — that is, the average of the position vectors is the zero vector. Multiplying by $n$ (the number of vertices), the <em>sum</em> of the position vectors is also zero.</p>

<p class="l-text"><strong>Algebraic reason.</strong> The polynomial $z^n - 1$ factors as $(z - 1)(z^{n-1} + z^{n-2} + \\cdots + z + 1)$. The roots $\\omega, \\omega^2, \\ldots, \\omega^{n-1}$ are exactly the roots of the second factor, since $\\omega \\neq 1$ for $n \\geq 2$. By Vieta's formulas, the sum of the roots of $z^{n-1} + z^{n-2} + \\cdots + z + 1$ equals $-1$. Adding the root $z = 1$ (which we excluded) back in gives $1 + \\omega + \\cdots + \\omega^{n-1} = 1 + (-1) = 0$.</p>

<div class="l-note"><strong>Useful consequence.</strong> For any $n \\geq 2$ and any integer $k$ not divisible by $n$, $\\sum_{j=0}^{n-1} \\omega^{jk} = 0$. This identity is the algebraic heart of the discrete Fourier transform and underlies fast multiplication algorithms like the FFT.</div>

<h2 class="lesson-title">10. Common Errors</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forgetting $n$ distinct roots</div><div class="card-body">Writing $\\sqrt[3]{8} = 2$ as if it were the only cube root. In the complex setting it is only one of three. Always run $k = 0, 1, \\ldots, n-1$ when solving $z^n = w$.</div></div>
<div class="calc-card"><div class="card-title">Wrong base angle</div><div class="card-body">Starting from $\\phi = 0$ when $w$ has nonzero argument. Convert $w$ to polar form <em>first</em> and read off $\\phi$, then apply $\\theta_k = (\\phi + 2\\pi k)/n$.</div></div>
<div class="calc-card"><div class="card-title">Off-by-one in $k$</div><div class="card-body">Running $k$ from $1$ to $n$ (which double-counts $k = 0$ and $k = n$) or stopping at $k = n - 2$ (missing one root). The correct range is $k = 0, 1, \\ldots, n-1$.</div></div>
<div class="calc-card"><div class="card-title">Misapplying De Moivre to non-integer $n$</div><div class="card-body">$(\\text{cis}\\,\\theta)^{1/2}$ does <em>not</em> have a unique value — it has two. De Moivre's theorem as stated assumes integer $n$; fractional powers go through the $n$-th root formula instead.</div></div>
</div>

<h2 class="lesson-title">11. Worked Practice Problems</h2>

<p class="l-text">Work each problem yourself before reading the solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — POWER VIA DE MOIVRE</div><div class="example-body"><strong>Compute $(\\sqrt 3 + i)^6$.</strong><br><br>$|\\sqrt 3 + i| = \\sqrt{3 + 1} = 2$. $\\arg(\\sqrt 3 + i) = \\arctan(1/\\sqrt 3) = \\pi/6$. So $\\sqrt 3 + i = 2\\,\\text{cis}(\\pi/6)$.<br><br>By De Moivre: $(\\sqrt 3 + i)^6 = 2^6 \\, \\text{cis}(6 \\cdot \\pi/6) = 64 \\, \\text{cis}(\\pi) = 64(-1) = \\mathbf{-64}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — SQUARE ROOTS OF $i$</div><div class="example-body"><strong>Find all solutions of $z^2 = i$.</strong><br><br>$i = 1\\,\\text{cis}(\\pi/2)$. Modulus of each root: $1$. Arguments: $\\dfrac{\\pi/2 + 2\\pi k}{2}$ for $k = 0, 1$.<br><br>$z_0 = \\text{cis}(\\pi/4) = \\dfrac{\\sqrt 2}{2} + \\dfrac{\\sqrt 2}{2} i$<br>$z_1 = \\text{cis}(\\pi/4 + \\pi) = \\text{cis}(5\\pi/4) = -\\dfrac{\\sqrt 2}{2} - \\dfrac{\\sqrt 2}{2} i$<br><br>The two square roots of $i$ are antipodal (180° apart) on the unit circle, as expected for $n = 2$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — CUBE ROOTS OF UNITY</div><div class="example-body"><strong>List the three cube roots of unity and verify their sum is zero.</strong><br><br>$z_0 = 1, \\;\\; z_1 = \\text{cis}(2\\pi/3) = -\\dfrac{1}{2} + \\dfrac{\\sqrt 3}{2} i, \\;\\; z_2 = \\text{cis}(4\\pi/3) = -\\dfrac{1}{2} - \\dfrac{\\sqrt 3}{2} i$.<br><br>Sum: $1 + \\left(-\\dfrac{1}{2} + \\dfrac{\\sqrt 3}{2} i\\right) + \\left(-\\dfrac{1}{2} - \\dfrac{\\sqrt 3}{2} i\\right) = 1 - 1 + 0i = \\mathbf{0}$. As predicted.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — FOURTH ROOTS OF $-16$</div><div class="example-body"><strong>Find all solutions of $z^4 = -16$.</strong><br><br>$-16 = 16\\,\\text{cis}\\,\\pi$. Modulus of each root: $16^{1/4} = 2$. Arguments: $\\dfrac{\\pi + 2\\pi k}{4}$ for $k = 0, 1, 2, 3$.<br><br>$z_0 = 2\\,\\text{cis}(\\pi/4) = \\sqrt 2 + \\sqrt 2\\, i$<br>$z_1 = 2\\,\\text{cis}(3\\pi/4) = -\\sqrt 2 + \\sqrt 2\\, i$<br>$z_2 = 2\\,\\text{cis}(5\\pi/4) = -\\sqrt 2 - \\sqrt 2\\, i$<br>$z_3 = 2\\,\\text{cis}(7\\pi/4) = \\sqrt 2 - \\sqrt 2\\, i$<br><br>Four corners of a square of side $2\\sqrt 2$, inscribed in the circle of radius 2.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — DERIVE $\\sin 3\\theta$</div><div class="example-body"><strong>Use De Moivre with $n = 3$ to derive $\\sin 3\\theta = 3\\sin\\theta - 4\\sin^3\\theta$.</strong><br><br>From the triple-angle expansion: $\\sin 3\\theta = 3\\cos^2\\theta\\sin\\theta - \\sin^3\\theta$.<br>Replace $\\cos^2\\theta = 1 - \\sin^2\\theta$: $\\sin 3\\theta = 3(1 - \\sin^2\\theta)\\sin\\theta - \\sin^3\\theta = 3\\sin\\theta - 3\\sin^3\\theta - \\sin^3\\theta = \\mathbf{3\\sin\\theta - 4\\sin^3\\theta}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — FIFTH ROOTS OF $32$</div><div class="example-body"><strong>Find all five fifth roots of $z^5 = 32$.</strong><br><br>$32 = 32\\,\\text{cis}\\,0$. Modulus of each root: $32^{1/5} = 2$. Arguments: $\\dfrac{2\\pi k}{5}$ for $k = 0, 1, 2, 3, 4$.<br><br>$z_0 = 2\\,\\text{cis}\\,0 = 2$<br>$z_1 = 2\\,\\text{cis}(72^\\circ) \\approx 0.618 + 1.902\\, i$<br>$z_2 = 2\\,\\text{cis}(144^\\circ) \\approx -1.618 + 1.176\\, i$<br>$z_3 = 2\\,\\text{cis}(216^\\circ) \\approx -1.618 - 1.176\\, i$<br>$z_4 = 2\\,\\text{cis}(288^\\circ) \\approx 0.618 - 1.902\\, i$<br><br>Five vertices of a regular pentagon inscribed in the circle of radius 2. Notice that the numerical coordinates involve $(\\sqrt 5 - 1)/4$ — connected to the golden ratio via the regular pentagon.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — POWER OF A ROOT OF UNITY</div><div class="example-body"><strong>Let $\\omega = \\text{cis}(2\\pi/5)$ be a primitive fifth root of unity. Compute $\\omega^{17}$.</strong><br><br>Use De Moivre: $\\omega^{17} = \\text{cis}(17 \\cdot 2\\pi/5) = \\text{cis}(34\\pi/5)$. Reduce modulo $2\\pi$: $34\\pi/5 = 30\\pi/5 + 4\\pi/5 = 6\\pi + 4\\pi/5$. Subtract $6\\pi$ ($= 3 \\cdot 2\\pi$): leftover $4\\pi/5$.<br><br>Answer: $\\omega^{17} = \\text{cis}(4\\pi/5) = \\omega^2$.<br><br>Shortcut: since $\\omega^5 = 1$, we have $\\omega^{17} = \\omega^{17 \\bmod 5} = \\omega^2$. The exponent always wraps around modulo $n$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — FACTOR $z^4 + 4$</div><div class="example-body"><strong>Find all complex roots of $z^4 = -4$ and use them to factor $z^4 + 4$ over the complex numbers.</strong><br><br>$-4 = 4\\,\\text{cis}\\,\\pi$. Modulus of each root: $4^{1/4} = \\sqrt 2$. Arguments: $\\dfrac{\\pi + 2\\pi k}{4}$ for $k = 0, 1, 2, 3$.<br><br>$z_0 = \\sqrt 2\\,\\text{cis}(\\pi/4) = 1 + i$<br>$z_1 = \\sqrt 2\\,\\text{cis}(3\\pi/4) = -1 + i$<br>$z_2 = \\sqrt 2\\,\\text{cis}(5\\pi/4) = -1 - i$<br>$z_3 = \\sqrt 2\\,\\text{cis}(7\\pi/4) = 1 - i$<br><br>Factorisation: $z^4 + 4 = (z - 1 - i)(z + 1 - i)(z + 1 + i)(z - 1 + i)$. Pairing conjugates gives the real quadratic factorisation $z^4 + 4 = (z^2 - 2z + 2)(z^2 + 2z + 2)$. A famous factoring identity, derived in one line via roots of unity.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> Roots of unity are not just an algebraic curiosity. They are the building blocks of the discrete Fourier transform, the FFT algorithm, signal processing, and large stretches of number theory. The single identity $\\omega^n = 1$ — extracted from a high-school exercise — unlocks all of it.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>De Moivre's theorem: $(r\\,\\text{cis}\\,\\theta)^n = r^n\\,\\text{cis}(n\\theta)$ for every integer $n$; proved by induction from the polar product rule</li>
<li>Computes powers like $(1+i)^{10} = 32 i$ in three lines instead of pages of FOIL</li>
<li>Expanding with the binomial theorem gives the double-angle, triple-angle, and all multi-angle trig identities</li>
<li>Equation $z^n = w$ has exactly $n$ complex solutions, $z_k = R^{1/n}\\,\\text{cis}((\\phi + 2\\pi k)/n)$ for $k = 0, 1, \\ldots, n-1$</li>
<li>All $n$ roots lie on a circle of radius $R^{1/n}$, equally spaced — they form a regular $n$-gon</li>
<li>Roots of unity: $z^n = 1$ gives $\\omega^k$ for $k = 0, \\ldots, n-1$, with $\\omega = \\text{cis}(2\\pi/n)$, inscribed in the unit circle</li>
<li>Sum of all $n$-th roots of unity is zero — proven geometrically (centroid at origin) and algebraically (Vieta)</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Önceki derste kutupsal formun en büyük üstünlüğünü keşfettin:</strong> karmaşık sayıları çarpmak, uzunlukları çarpıp açıları toplamaya iner. Son çözümlü örnek bunu bir adım ileri taşıdı ve aynı çarpanı tekrar tekrar çarparak $(1 + i)^4$ ifadesini hesapladı. O tek örneğin içinde matematiğin en kullanışlı özdeşliklerinden biri gizli — <em>De Moivre teoremi</em> — bir karmaşık sayıyı bir kuvvete yükseltmenin hantal işini tek satırlık bir işleme dönüştürür.</p>

<p class="l-text">De Moivre teoreminden güzel bir geometrik gerçek çıkar: her karmaşık sayının tam olarak $n$ farklı $n$-inci kökü vardır ve bu kökler her zaman bir çembere içkin düzgün bir çokgenin köşelerinde otururlar. Özellikle $z^n = 1$ denkleminin kökleri — <em>birim kökler</em> — birim çemberi $n$ eşit yaya böler. Dersin sonunda herhangi bir karmaşık sayının kuvvetlerini hesaplayabilecek, tüm $n$-inci köklerini listeleyebilecek ve cebirden fışkıran düzgün çokgenleri tanıyabileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>De Moivre teoremini $(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta$ ifadesini söylemeyi ve tümevarımla kanıtlamayı</li>
<li>Kutupsal formdan $z^n = r^n\\,\\text{cis}(n\\theta)$ ile kuvvetleri hesaplamayı, $(1+i)^{10}$ gibi yüksek kuvvetler dahil</li>
<li>De Moivre ile $n = 2, 3$ kullanarak $\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta$ gibi trigonometrik özdeşlikleri türetmeyi</li>
<li>$z^n = w$ denklemini çözüp verilen $w$ sayısının $n$ tane farklı karmaşık $n$-inci kökünü bulmayı</li>
<li>$\\omega = \\text{cis}(2\\pi/n)$ ile $n$-inci birim kökleri $1, \\omega, \\omega^2, \\ldots, \\omega^{n-1}$ listelemeyi</li>
<li>Herhangi bir karmaşık sayının $n$-inci köklerinin bir çembere içkin düzgün $n$-gen oluşturduğunu görmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. De Moivre Teoremi</h2>

<div class="calc-highlight"><strong>De Moivre teoremi, kutupsal formda çarpma kuralının, tek bir karmaşık sayının kendisi ile çarpılmasına uygulanmış halidir.</strong> İki çarpanı çarpmak argümanları topluyor ve modülleri çarpıyorsa, $n$ özdeş çarpanı çarpmak argümanı $n$ kez ekler (yani $n\\theta$ olur) ve modülü $n$ kez çarpar (yani $r^n$ olur). Sonuç bir isim hak ediyor.</div>

<div class="calc-formula"><div class="formula-label">DE MOIVRE TEOREMİ</div><div class="formula-main">$$(\\cos\\theta + i\\sin\\theta)^n \\;=\\; \\cos n\\theta + i\\sin n\\theta$$</div><div class="formula-sub">Ya da cis gösteriminde: $(\\text{cis}\\,\\theta)^n = \\text{cis}(n\\theta)$. Her tam sayı $n$ için — pozitif, negatif ya da sıfır — ve her reel açı $\\theta$ için.</div></div>

<p class="l-text"><strong>Keyfi modüllü tam kutupsal versiyonu,</strong> $r$'yi dışarı çekerek hemen elde edilir:</p>

<div class="calc-formula"><div class="formula-label">HER MODÜL İÇİN DE MOIVRE</div><div class="formula-main">$$\\bigl(r\\,\\text{cis}\\,\\theta\\bigr)^n \\;=\\; r^n\\,\\text{cis}(n\\theta) \\;=\\; r^n(\\cos n\\theta + i\\sin n\\theta)$$</div><div class="formula-sub">Modülün $n$-inci kuvvetini al. Argümanı $n$ ile çarp. İşlem bu kadar.</div></div>

<h2 class="lesson-title">2. Tümevarımla Kanıt (Taslak)</h2>

<p class="l-text">Kanıt $n$ üzerinde kısa bir tümevarımdır. $P(n)$, $(\\text{cis}\\,\\theta)^n = \\text{cis}(n\\theta)$ ifadesini göstersin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Temel durum ($n = 1$)</div><div class="card-body">$(\\text{cis}\\,\\theta)^1 = \\text{cis}\\,\\theta = \\text{cis}(1 \\cdot \\theta)$. Aşikar şekilde doğru.</div></div>
<div class="calc-card"><div class="card-title">Tümevarım adımı</div><div class="card-body">$P(k)$ varsayalım: $(\\text{cis}\\,\\theta)^k = \\text{cis}(k\\theta)$. O zaman $(\\text{cis}\\,\\theta)^{k+1} = (\\text{cis}\\,\\theta)^k \\cdot \\text{cis}\\,\\theta = \\text{cis}(k\\theta) \\cdot \\text{cis}\\,\\theta = \\text{cis}(k\\theta + \\theta) = \\text{cis}((k+1)\\theta)$. Yani $P(k+1)$ doğrudur.</div></div>
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">Tümevarımla $P(n)$ her pozitif tam sayı $n$ için doğrudur. $n = 0$ durumu aşikar $1 = \\text{cis}\\,0 = 1$ özdeşliğini verir. Negatif tam sayılar önceki derste gördüğümüz $1/z = (1/r)\\,\\text{cis}(-\\theta)$ tersine alma kuralıyla halledilir.</div></div>
</div>

<div class="l-note"><strong>Kilit adım.</strong> Tümevarım adımı sadece kutupsal çarpma kuralı $\\text{cis}\\,\\alpha \\cdot \\text{cis}\\,\\beta = \\text{cis}(\\alpha + \\beta)$ kullanır, bu da kosinüs ve sinüs toplam formüllerinin yeniden paketlenmesidir. Yani De Moivre teoremi özünde, toplam formüllerinin tekrar tekrar uygulanmasıdır.</div>

<h2 class="lesson-title">3. Kuvvetleri Hesaplama</h2>

<div class="calc-highlight"><strong>Bir karmaşık sayıyı yüksek bir kuvvete yükseltmek artık önemsiz.</strong> Kutupsala dönüştür, modülü kuvvete yükselt, argümanı çarp, sonra (gerekirse) geri dönüştür. FOIL yok, işaret hokkabazlığı yok, yorgunluk yok.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — KÜÇÜK BİR KUVVET</div><div class="example-body">$(1 + i)^2$ ifadesini iki yolla hesapla ve kontrol et.<br><br>Kutupsal: $1 + i = \\sqrt 2\\,\\text{cis}(\\pi/4)$. De Moivre ile $(1 + i)^2 = (\\sqrt 2)^2\\,\\text{cis}(2 \\cdot \\pi/4) = 2\\,\\text{cis}(\\pi/2) = 2(0 + i \\cdot 1) = \\mathbf{2i}$.<br>FOIL: $(1+i)^2 = 1 + 2i + i^2 = 1 + 2i - 1 = 2i$. Uyuşur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — BÜYÜK OLAN: $(1+i)^{10}$</div><div class="example-body">FOIL ile $(1+i)^{10}$ hesaplamak on çarpan açmak anlamına gelirdi — sayfalarca iş, onlarca sadeleştirme, kolayca işaret kaçırma. De Moivre bunu üç satırda halleder.<br><br>$1 + i = \\sqrt 2\\,\\text{cis}(\\pi/4)$.<br>$(1+i)^{10} = (\\sqrt 2)^{10}\\,\\text{cis}(10 \\cdot \\pi/4) = 32\\,\\text{cis}(10\\pi/4) = 32\\,\\text{cis}(5\\pi/2)$.<br>Açıyı sadeleştir: $5\\pi/2 = 2\\pi + \\pi/2$, dolayısıyla $\\text{cis}(5\\pi/2) = \\text{cis}(\\pi/2) = i$.<br><br>Cevap: $(1+i)^{10} = 32 \\cdot i = \\mathbf{32 i}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — NEGATİF KUVVET</div><div class="example-body">$(1 + i)^{-3}$ hesapla.<br><br>$1 + i = \\sqrt 2\\,\\text{cis}(\\pi/4)$. De Moivre ile $(1+i)^{-3} = (\\sqrt 2)^{-3}\\,\\text{cis}(-3\\pi/4) = \\dfrac{1}{2\\sqrt 2}\\,\\text{cis}(-3\\pi/4)$.<br>$\\cos(-3\\pi/4) = -\\dfrac{\\sqrt 2}{2}$, $\\sin(-3\\pi/4) = -\\dfrac{\\sqrt 2}{2}$.<br>Sonuç: $\\dfrac{1}{2\\sqrt 2}\\left(-\\dfrac{\\sqrt 2}{2} - \\dfrac{\\sqrt 2}{2} i\\right) = -\\dfrac{1}{4} - \\dfrac{1}{4} i$.</div></div>

<div class="l-note"><strong>Negatif kuvvetlerde mantık kontrolü.</strong> $(1+i)^{-3} = 1/(1+i)^3$. Önceki derse göre kutupsal formda tersini alma sadece argümanın işaretini ters çevirir ve modülü tersine çevirir — tam da elde ettiğimiz şey. De Moivre tüm tam sayı üsler için tutarlıdır.</div>

<h2 class="lesson-title">4. Trigonometrik Özdeşlikleri Türetme</h2>

<div class="calc-highlight"><strong>De Moivre teoremi bir trigonometrik özdeşlik fabrikasıdır.</strong> $n = 2, 3, 4, \\ldots$ koyarak ve sol tarafı binom teoremi ile açarak, $\\cos n\\theta$ ve $\\sin n\\theta$ için $\\cos\\theta$ ve $\\sin\\theta$ cinsinden formüller elde edersin. İki kat ve üç kat açı formülleri anında düşer.</div>

<p class="l-text"><strong>Durum $n = 2$ (iki kat açı).</strong> Sol taraftan başla, aç:</p>

<div class="calc-formula"><div class="formula-label">$n = 2$ İLE DE MOIVRE</div><div class="formula-main">$$(\\cos\\theta + i\\sin\\theta)^2 \\;=\\; \\cos 2\\theta + i\\sin 2\\theta$$</div></div>

<p class="l-text">Soldaki kareyi aç: $(\\cos\\theta + i\\sin\\theta)^2 = \\cos^2\\theta + 2i\\cos\\theta\\sin\\theta + i^2\\sin^2\\theta = (\\cos^2\\theta - \\sin^2\\theta) + i\\,(2\\cos\\theta\\sin\\theta)$. Reel ve sanal kısımları sağ tarafla karşılaştır:</p>

<div class="calc-formula"><div class="formula-label">DE MOIVRE'DEN İKİ KAT AÇI FORMÜLLERİ</div><div class="formula-main">$$\\cos 2\\theta \\;=\\; \\cos^2\\theta - \\sin^2\\theta \\qquad \\sin 2\\theta \\;=\\; 2\\cos\\theta\\sin\\theta$$</div><div class="formula-sub">Bir fiyatına iki özdeşlik. Reel kısımlar eşleşir; sanal kısımlar eşleşir.</div></div>

<p class="l-text"><strong>Durum $n = 3$ (üç kat açı).</strong> Binom teoremi ile $(\\cos\\theta + i\\sin\\theta)^3$ ifadesini aç:</p>

<div class="calc-formula"><div class="formula-label">ÜÇ KAT AÇI AÇILIMI</div><div class="formula-main">$$(\\cos\\theta + i\\sin\\theta)^3 \\;=\\; \\cos^3\\theta + 3i\\cos^2\\theta\\sin\\theta - 3\\cos\\theta\\sin^2\\theta - i\\sin^3\\theta$$</div><div class="formula-sub">$i^2 = -1$ ve $i^3 = -i$ kullanıldı.</div></div>

<p class="l-text">Reel ve sanal kısımları $\\cos 3\\theta + i\\sin 3\\theta$ ile eşitle:</p>

<div class="calc-formula"><div class="formula-label">ÜÇ KAT AÇI FORMÜLLERİ</div><div class="formula-main">$$\\cos 3\\theta \\;=\\; \\cos^3\\theta - 3\\cos\\theta\\sin^2\\theta \\qquad \\sin 3\\theta \\;=\\; 3\\cos^2\\theta\\sin\\theta - \\sin^3\\theta$$</div><div class="formula-sub">Kosinüste $\\sin^2\\theta = 1 - \\cos^2\\theta$ kullanmak eşdeğer formu verir: $\\cos 3\\theta = 4\\cos^3\\theta - 3\\cos\\theta$.</div></div>

<div class="l-note"><strong>De Moivre'in trigonometride bu kadar önemli olmasının nedeni.</strong> "İki kat açı formülünü ezberle" ödev problemi bir türetme olur, ezberleme değil. $\\cos\\theta + i\\sin\\theta$ ifadesinin karesini veya küpünü almak mekanik bir iştir; özdeşlikler kendiliğinden dışarı düşer.</div>

<h2 class="lesson-title">5. $z^n = w$ Denklemi: Kaç Tane Çözüm?</h2>

<div class="calc-highlight"><strong>Reel sayı $w > 0$ için $z^n = w$ denkleminin tam olarak bir pozitif reel çözümü vardır: $z = w^{1/n}$ ("esas" $n$-inci kök).</strong> Karmaşık sayılar üzerinde denklemin tam olarak $n$ çözümü vardır. Bu cebirin temel teoreminin özel bir halidir: $n$. dereceden bir polinomun katlılıkla sayılan $n$ kökü vardır ve $z^n - w$ için tüm $n$ kök farklıdır.</div>

<p class="l-text">Onları bulmak için $w$'yi $w = R\\,\\text{cis}\\,\\phi$ ($R > 0$) kutupsal formuna yaz ve aday kök $z = r\\,\\text{cis}\\,\\theta$ olarak ara. De Moivre ile $z^n = r^n\\,\\text{cis}(n\\theta)$. Bunu $w$'ye eşitle:</p>

<div class="calc-formula"><div class="formula-label">İKİ KUTUPSAL FORMU EŞLEŞTİRME</div><div class="formula-main">$$r^n \\,=\\, R \\qquad\\text{ve}\\qquad n\\theta \\,\\equiv\\, \\phi \\pmod{2\\pi}$$</div><div class="formula-sub">Modül denkleminin tek pozitif reel çözümü $r = R^{1/n}$. Argüman denkleminin sonsuz çözümü vardır ama bunlar mod $2\\pi$ ile $n$ farklı değere iner.</div></div>

<p class="l-text">$\\theta$ için çöz: $n\\theta = \\phi + 2\\pi k$, bir tam sayı $k$ için, yani $\\theta = (\\phi + 2\\pi k)/n$. $k = 0, 1, 2, \\ldots, n-1$ alırsak desen tekrar etmeden önce $n$ farklı açı elde ederiz.</p>

<div class="calc-formula"><div class="formula-label">$w = R\\,\\text{cis}\\,\\phi$ SAYISININ $n$ KARMAŞIK $n$-İNCİ KÖKÜ</div><div class="formula-main">$$z_k \\;=\\; R^{1/n}\\,\\text{cis}\\!\\left(\\frac{\\phi + 2\\pi k}{n}\\right), \\qquad k = 0, 1, 2, \\ldots, n-1$$</div><div class="formula-sub">$k$'nın her değeri farklı bir kök verir. Tüm $n$ kök aynı modüle sahiptir: $R^{1/n}$, yani bir çember üzerinde otururlar. Argümanları $2\\pi/n$ kadar farklıdır, yani o çember etrafında eşit aralıklarla dağılırlar.</div></div>

<h2 class="lesson-title">6. Her Kök Hesaplamasında Saklı Olan Düzgün Çokgen</h2>

<div class="calc-highlight"><strong>Formüle tekrar bak.</strong> $w$'nin her $n$-inci kökü aynı modüle sahiptir: $R^{1/n}$. Ardışık argümanlar tam olarak $2\\pi/n$ kadar farklıdır. Yani $n$ kök, $R^{1/n}$ yarıçaplı bir çember üzerinde $n$ eşit aralıklı noktadır — o çembere içkin bir <em>düzgün $n$-genin</em> köşeleri. Cebir geometriye dönüşür.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$n = 2$ (karekök)</div><div class="card-body">İki nokta, $\\pi$ aralıklı. Bir çapın iki ucunda otururlar. Örnek: $4 = 4\\,\\text{cis}\\,0$ sayısının kökleri $2\\,\\text{cis}\\,0 = 2$ ve $2\\,\\text{cis}\\,\\pi = -2$.</div></div>
<div class="calc-card"><div class="card-title">$n = 3$ (küp kök)</div><div class="card-body">Üç nokta, $2\\pi/3 = 120^\\circ$ aralıklı. Eşkenar üçgenin köşeleri.</div></div>
<div class="calc-card"><div class="card-title">$n = 4$ (dördüncü kök)</div><div class="card-body">Dört nokta, $\\pi/2 = 90^\\circ$ aralıklı. Karenin köşeleri.</div></div>
<div class="calc-card"><div class="card-title">$n = 6$ (altıncı kök)</div><div class="card-body">Altı nokta, $\\pi/3 = 60^\\circ$ aralıklı. Düzgün altıgenin köşeleri.</div></div>
</div>

<h2 class="lesson-title">7. Birim Kökler</h2>

<div class="calc-highlight"><strong>$1$ sayısının $n$-inci kökleri özeldir — bunlara <em>$n$-inci birim kökler</em> denir.</strong> Formülde $w = 1 = 1\\,\\text{cis}\\,0$ koy. Her kökün modülü $1^{1/n} = 1$. Argümanları $2\\pi k / n$, $k = 0, 1, \\ldots, n-1$ için. Yani $n$-inci birim kökler <em>birim çember</em> üzerinde $n$ eşit aralıklı noktadır ve $1$ noktasından başlar.</div>

<div class="calc-formula"><div class="formula-label">$n$-İNCİ BİRİM KÖKLER</div><div class="formula-main">$$z_k \\;=\\; \\text{cis}\\!\\left(\\frac{2\\pi k}{n}\\right) \\;=\\; \\cos\\!\\frac{2\\pi k}{n} + i\\sin\\!\\frac{2\\pi k}{n}, \\qquad k = 0, 1, \\ldots, n-1$$</div><div class="formula-sub">Tek bir sembol hepsinin işini yapar. <em>İlkel</em> $n$-inci birim kök $\\omega = \\text{cis}(2\\pi/n)$ olarak tanımla. O zaman tam liste $1, \\omega, \\omega^2, \\omega^3, \\ldots, \\omega^{n-1}$ olur — tek bir sabit sayının kuvvetleri.</div></div>

<p class="l-text">$k = 0$ köşesi $1$ sayısının kendisidir. Bir sonraki köşe, $2\\pi/n$ açısında, ilkel kök $\\omega$. Kalan köşeler basitçe $\\omega^2, \\omega^3, \\ldots, \\omega^{n-1}$ — De Moivre $\\omega$'yu birim çember etrafında döndürüyor. $n$ numaralı köşe $2\\pi$ açısına sarar ve orijinal $1$ ile çakışır, bu yüzden $k = n-1$'de dururuz.</p>

<h2 class="lesson-title">8. Köklerle İlgili Çözümlü Örnekler</h2>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DÖRDÜNCÜ BİRİM KÖKLER</div><div class="example-body">$z^4 = 1$ denkleminin tüm çözümlerini bul.<br><br>$1 = 1\\,\\text{cis}\\,0$. Her kökün modülü: $1^{1/4} = 1$. Argümanlar: $\\dfrac{2\\pi k}{4} = \\dfrac{\\pi k}{2}$, $k = 0, 1, 2, 3$ için.<br><br>$z_0 = \\text{cis}\\,0 = \\mathbf{1}$<br>$z_1 = \\text{cis}(\\pi/2) = \\mathbf{i}$<br>$z_2 = \\text{cis}\\,\\pi = \\mathbf{-1}$<br>$z_3 = \\text{cis}(3\\pi/2) = \\mathbf{-i}$<br><br>Birim sayısının dört dördüncü kökü $\\{1, i, -1, -i\\}$ — birim çembere içkin bir karenin dört köşesi.</div></div>

<div class="calc-graph"><div id="plot-l71-fourth-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> dört birim dördüncü kök, birim çember üzerinde kırmızı nokta olarak. Argümanları $0, \\pi/2, \\pi, 3\\pi/2$ — $\\pi/2 = 90^\\circ$ eşit aralık. Ardışık noktaları birleştiren kesik çizgiler içkin kareyi çizer; noktalı yarıçap çizgileri her kökün başlangıçtan olan ışınını gösterir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ringX=[],ringY=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;ringX.push(Math.cos(a));ringY.push(Math.sin(a));}
var ring={x:ringX,y:ringY,mode:'lines',name:'birim çember',line:{color:'rgba(255,255,255,0.35)',width:1.4}};
var angs=[0,Math.PI/2,Math.PI,3*Math.PI/2];
var rx=[],ry=[];for(var k=0;k<angs.length;k++){rx.push(Math.cos(angs[k]));ry.push(Math.sin(angs[k]));}
var rxClose=rx.concat([rx[0]]),ryClose=ry.concat([ry[0]]);
var sq={x:rxClose,y:ryClose,mode:'lines',name:'içkin kare',line:{color:'#3b82f6',width:1.8,dash:'dash'}};
var spokes={x:[],y:[],mode:'lines',name:'yarıçaplar',line:{color:'rgba(245,158,11,0.55)',width:1.2,dash:'dot'}};
for(var m=0;m<angs.length;m++){spokes.x.push(0,Math.cos(angs[m]),null);spokes.y.push(0,Math.sin(angs[m]),null);}
var pts={x:rx,y:ry,mode:'markers+text',name:'dördüncü kökler',marker:{color:'#ef4444',size:13,line:{color:'#fff',width:1.5}},text:['1','i','-1','-i'],textposition:['middle right','top center','middle left','bottom center'],textfont:{color:'#e8e8e8',size:14}};
var axX={x:[-1.4,1.4],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-1.4,1.4],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l71-fourth-tr',[axX,axY,ring,sq,spokes,pts],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — 8'İN KÜP KÖKLERİ</div><div class="example-body">$z^3 = 8$ denkleminin tüm çözümlerini bul.<br><br>$8 = 8\\,\\text{cis}\\,0$. Her kökün modülü: $8^{1/3} = 2$. Argümanlar: $\\dfrac{2\\pi k}{3}$, $k = 0, 1, 2$ için.<br><br>$z_0 = 2\\,\\text{cis}\\,0 = \\mathbf{2}$<br>$z_1 = 2\\,\\text{cis}(2\\pi/3) = 2(-1/2 + i\\sqrt 3/2) = \\mathbf{-1 + \\sqrt 3\\, i}$<br>$z_2 = 2\\,\\text{cis}(4\\pi/3) = 2(-1/2 - i\\sqrt 3/2) = \\mathbf{-1 - \\sqrt 3\\, i}$<br><br>8'in üç küp kökü, 2 yarıçaplı çembere içkin bir eşkenar üçgen oluşturur. $z_0 = 2$'nin tanıdık reel küp kök olduğuna dikkat et — ama üçten yalnızca biridir.</div></div>

<div class="calc-graph"><div id="plot-l71-cube8-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> 8'in üç küp kökü, 2 yarıçaplı bir çember üzerinde çizilmiş. $0^\\circ$, $120^\\circ$, $240^\\circ$ açılarında otururlar — $120^\\circ$ eşit aralık. Üç kökü sırayla birleştirmek bir eşkenar üçgen çizer. Tanıdık reel küp kök $\\sqrt[3]{8} = 2$ yalnızca en sağdaki köşedir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var R=2;var ringX=[],ringY=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;ringX.push(R*Math.cos(a));ringY.push(R*Math.sin(a));}
var ring={x:ringX,y:ringY,mode:'lines',name:'çember r=2',line:{color:'rgba(255,255,255,0.3)',width:1.4}};
var unitX=[],unitY=[];for(var ii=0;ii<=200;ii++){var aa=2*Math.PI*ii/200;unitX.push(Math.cos(aa));unitY.push(Math.sin(aa));}
var unit={x:unitX,y:unitY,mode:'lines',name:'birim çember',line:{color:'rgba(255,255,255,0.15)',width:1,dash:'dot'}};
var angs=[0,2*Math.PI/3,4*Math.PI/3];
var rx=[],ry=[];for(var k=0;k<angs.length;k++){rx.push(R*Math.cos(angs[k]));ry.push(R*Math.sin(angs[k]));}
var rxClose=rx.concat([rx[0]]),ryClose=ry.concat([ry[0]]);
var tri={x:rxClose,y:ryClose,mode:'lines',name:'eşkenar üçgen',line:{color:'#3b82f6',width:1.8,dash:'dash'}};
var spokes={x:[],y:[],mode:'lines',name:'yarıçaplar',line:{color:'rgba(245,158,11,0.55)',width:1.2,dash:'dot'}};
for(var m=0;m<angs.length;m++){spokes.x.push(0,R*Math.cos(angs[m]),null);spokes.y.push(0,R*Math.sin(angs[m]),null);}
var pts={x:rx,y:ry,mode:'markers+text',name:'8 küp kökleri',marker:{color:'#ef4444',size:13,line:{color:'#fff',width:1.5}},text:['2','-1+√3 i','-1-√3 i'],textposition:['middle right','top left','bottom left'],textfont:{color:'#e8e8e8',size:13}};
var axX={x:[-2.6,2.6],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-2.6,2.6],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-2.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-2.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l71-cube8-tr',[axX,axY,unit,ring,tri,spokes,pts],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — $-1$ SAYISININ KÜP KÖKLERİ</div><div class="example-body">$z^3 = -1$ denkleminin tüm çözümlerini bul.<br><br>$-1 = 1\\,\\text{cis}\\,\\pi$. Her kökün modülü: $1^{1/3} = 1$. Argümanlar: $\\dfrac{\\pi + 2\\pi k}{3}$, $k = 0, 1, 2$ için.<br><br>$z_0 = \\text{cis}(\\pi/3) = \\dfrac{1}{2} + \\dfrac{\\sqrt 3}{2} i$<br>$z_1 = \\text{cis}(\\pi) = \\mathbf{-1}$<br>$z_2 = \\text{cis}(5\\pi/3) = \\dfrac{1}{2} - \\dfrac{\\sqrt 3}{2} i$<br><br>Üç kökten biri tanıdık reel küp kök $-1$; diğer ikisi sağ yarı düzlemdeki eşlenik karmaşık çiftleri.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ALTINCI BİRİM KÖKLER</div><div class="example-body">$z^6 = 1$ denkleminin tüm çözümlerini bul.<br><br>Altı kökün hepsinin modülü 1. Argümanlar: $\\dfrac{2\\pi k}{6} = \\dfrac{\\pi k}{3}$, $k = 0, 1, 2, 3, 4, 5$ için.<br><br>$z_0 = 1, \\;\\; z_1 = \\text{cis}(60^\\circ) = \\dfrac{1}{2} + \\dfrac{\\sqrt 3}{2} i$<br>$z_2 = \\text{cis}(120^\\circ) = -\\dfrac{1}{2} + \\dfrac{\\sqrt 3}{2} i, \\;\\; z_3 = -1$<br>$z_4 = \\text{cis}(240^\\circ) = -\\dfrac{1}{2} - \\dfrac{\\sqrt 3}{2} i, \\;\\; z_5 = \\text{cis}(300^\\circ) = \\dfrac{1}{2} - \\dfrac{\\sqrt 3}{2} i$<br><br>Altı birim altıncı kök, birim çembere içkin bir düzgün altıgen oluşturur. İkinci kökleri ($\\pm 1$), üçüncü kökleri ($1, z_2, z_4$) ve üç yeni kökü içerdiğine dikkat et — 6'nın her böleni katkıda bulunur.</div></div>

<div class="calc-graph"><div id="plot-l71-sixth-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> altı birim altıncı kök, birim çember üzerinde. $0^\\circ, 60^\\circ, 120^\\circ, 180^\\circ, 240^\\circ, 300^\\circ$ açılarını işgal ediyorlar. Komşu kökleri birleştirmek düzgün altıgeni çizer. Birim sayısının karekökleri $\\{1, -1\\}$ ve küp kökleri $\\{1, \\text{cis}(120^\\circ), \\text{cis}(240^\\circ)\\}$ alt desen olarak görünür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ringX=[],ringY=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;ringX.push(Math.cos(a));ringY.push(Math.sin(a));}
var ring={x:ringX,y:ringY,mode:'lines',name:'birim çember',line:{color:'rgba(255,255,255,0.35)',width:1.4}};
var angs=[];for(var k=0;k<6;k++){angs.push(2*Math.PI*k/6);}
var rx=[],ry=[];for(var kk=0;kk<angs.length;kk++){rx.push(Math.cos(angs[kk]));ry.push(Math.sin(angs[kk]));}
var rxClose=rx.concat([rx[0]]),ryClose=ry.concat([ry[0]]);
var hex={x:rxClose,y:ryClose,mode:'lines',name:'düzgün altıgen',line:{color:'#3b82f6',width:1.8,dash:'dash'}};
var spokes={x:[],y:[],mode:'lines',name:'yarıçaplar',line:{color:'rgba(245,158,11,0.55)',width:1.2,dash:'dot'}};
for(var m=0;m<angs.length;m++){spokes.x.push(0,Math.cos(angs[m]),null);spokes.y.push(0,Math.sin(angs[m]),null);}
var labs=['1','ω','ω²','ω³ = -1','ω⁴','ω⁵'];
var tpos=['middle right','top right','top left','middle left','bottom left','bottom right'];
var pts={x:rx,y:ry,mode:'markers+text',name:'altıncı kökler',marker:{color:'#ef4444',size:13,line:{color:'#fff',width:1.5}},text:labs,textposition:tpos,textfont:{color:'#e8e8e8',size:13}};
var axX={x:[-1.5,1.5],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-1.5,1.5],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-1.5,1.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-1.5,1.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l71-sixth-tr',[axX,axY,ring,hex,spokes,pts],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. $n$-İnci Birim Köklerin Toplamı Sıfırdır</h2>

<div class="calc-highlight"><strong>Sırf geometrik bir kanıtı olan güzel bir cebirsel gerçek.</strong> Her $n \\geq 2$ için $1 + \\omega + \\omega^2 + \\cdots + \\omega^{n-1} = 0$.</div>

<p class="l-text"><strong>Geometrik gerekçe.</strong> $n$ kök başlangıca merkezi düzgün bir $n$-genin köşeleridir. Simetri gereği köşelerin ağırlık merkezi merkez ile çakışır — yani konum vektörlerinin ortalaması sıfır vektörüdür. $n$ ile çarpılırsa (köşe sayısı), konum vektörlerinin <em>toplamı</em> da sıfır olur.</p>

<p class="l-text"><strong>Cebirsel gerekçe.</strong> $z^n - 1$ polinomu $(z - 1)(z^{n-1} + z^{n-2} + \\cdots + z + 1)$ olarak çarpanlara ayrılır. $\\omega, \\omega^2, \\ldots, \\omega^{n-1}$ kökleri tam olarak ikinci çarpanın kökleridir, çünkü $n \\geq 2$ için $\\omega \\neq 1$. Vieta formüllerine göre $z^{n-1} + z^{n-2} + \\cdots + z + 1$ köklerinin toplamı $-1$'dir. Dışladığımız $z = 1$ kökünü ekleyince $1 + \\omega + \\cdots + \\omega^{n-1} = 1 + (-1) = 0$.</p>

<div class="l-note"><strong>Yararlı sonuç.</strong> Her $n \\geq 2$ ve $n$'in böleni olmayan her tam sayı $k$ için $\\sum_{j=0}^{n-1} \\omega^{jk} = 0$. Bu özdeşlik ayrık Fourier dönüşümünün cebirsel kalbidir ve FFT gibi hızlı çarpma algoritmalarının temelidir.</div>

<h2 class="lesson-title">10. Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$n$ farklı kökü unutmak</div><div class="card-body">$\\sqrt[3]{8} = 2$ yazmak, sanki tek küp kökmüş gibi. Karmaşık ortamda üçten biridir. $z^n = w$ çözerken her zaman $k = 0, 1, \\ldots, n-1$ çalıştır.</div></div>
<div class="calc-card"><div class="card-title">Yanlış temel açı</div><div class="card-body">$w$'nin argümanı sıfır olmadığında $\\phi = 0$'dan başlamak. <em>Önce</em> $w$'yi kutupsal forma dönüştür ve $\\phi$ değerini oku, sonra $\\theta_k = (\\phi + 2\\pi k)/n$ uygula.</div></div>
<div class="calc-card"><div class="card-title">$k$ değerinde bir-fazla/bir-eksik hata</div><div class="card-body">$k$'yi $1$'den $n$'e kadar çalıştırmak ($k = 0$ ve $k = n$ aynı kökü iki kere sayar) ya da $k = n - 2$'de durmak (bir kök eksik). Doğru aralık: $k = 0, 1, \\ldots, n-1$.</div></div>
<div class="calc-card"><div class="card-title">Tam sayı olmayan $n$ için De Moivre'i yanlış uygulamak</div><div class="card-body">$(\\text{cis}\\,\\theta)^{1/2}$ ifadesinin <em>tek</em> bir değeri yoktur — iki değeri vardır. Yazılan haliyle De Moivre teoremi tam sayı $n$ varsayar; kesirli kuvvetler $n$-inci kök formülünden geçer.</div></div>
</div>

<h2 class="lesson-title">11. Çözümlü Pratik Soruları</h2>

<p class="l-text">Çözümü okumadan önce her soruyu kendin yap.</p>

<div class="calc-example"><div class="example-label">SORU 1 — DE MOIVRE ARACILIĞIYLA KUVVET</div><div class="example-body"><strong>$(\\sqrt 3 + i)^6$ hesapla.</strong><br><br>$|\\sqrt 3 + i| = \\sqrt{3 + 1} = 2$. $\\arg(\\sqrt 3 + i) = \\arctan(1/\\sqrt 3) = \\pi/6$. Yani $\\sqrt 3 + i = 2\\,\\text{cis}(\\pi/6)$.<br><br>De Moivre ile: $(\\sqrt 3 + i)^6 = 2^6 \\, \\text{cis}(6 \\cdot \\pi/6) = 64 \\, \\text{cis}(\\pi) = 64(-1) = \\mathbf{-64}$.</div></div>

<div class="calc-example"><div class="example-label">SORU 2 — $i$ SAYISININ KAREKÖKLERİ</div><div class="example-body"><strong>$z^2 = i$ denkleminin tüm çözümlerini bul.</strong><br><br>$i = 1\\,\\text{cis}(\\pi/2)$. Her kökün modülü: $1$. Argümanlar: $\\dfrac{\\pi/2 + 2\\pi k}{2}$, $k = 0, 1$ için.<br><br>$z_0 = \\text{cis}(\\pi/4) = \\dfrac{\\sqrt 2}{2} + \\dfrac{\\sqrt 2}{2} i$<br>$z_1 = \\text{cis}(\\pi/4 + \\pi) = \\text{cis}(5\\pi/4) = -\\dfrac{\\sqrt 2}{2} - \\dfrac{\\sqrt 2}{2} i$<br><br>$i$'nin iki karekökü, $n = 2$ için beklendiği gibi birim çember üzerinde antipodal (180° aralıklı) konumdadır.</div></div>

<div class="calc-example"><div class="example-label">SORU 3 — BİRİM KÜP KÖKLER</div><div class="example-body"><strong>Üç birim küp kökü listele ve toplamlarının sıfır olduğunu doğrula.</strong><br><br>$z_0 = 1, \\;\\; z_1 = \\text{cis}(2\\pi/3) = -\\dfrac{1}{2} + \\dfrac{\\sqrt 3}{2} i, \\;\\; z_2 = \\text{cis}(4\\pi/3) = -\\dfrac{1}{2} - \\dfrac{\\sqrt 3}{2} i$.<br><br>Toplam: $1 + \\left(-\\dfrac{1}{2} + \\dfrac{\\sqrt 3}{2} i\\right) + \\left(-\\dfrac{1}{2} - \\dfrac{\\sqrt 3}{2} i\\right) = 1 - 1 + 0i = \\mathbf{0}$. Tahmin edildiği gibi.</div></div>

<div class="calc-example"><div class="example-label">SORU 4 — $-16$ SAYISININ DÖRDÜNCÜ KÖKLERİ</div><div class="example-body"><strong>$z^4 = -16$ denkleminin tüm çözümlerini bul.</strong><br><br>$-16 = 16\\,\\text{cis}\\,\\pi$. Her kökün modülü: $16^{1/4} = 2$. Argümanlar: $\\dfrac{\\pi + 2\\pi k}{4}$, $k = 0, 1, 2, 3$ için.<br><br>$z_0 = 2\\,\\text{cis}(\\pi/4) = \\sqrt 2 + \\sqrt 2\\, i$<br>$z_1 = 2\\,\\text{cis}(3\\pi/4) = -\\sqrt 2 + \\sqrt 2\\, i$<br>$z_2 = 2\\,\\text{cis}(5\\pi/4) = -\\sqrt 2 - \\sqrt 2\\, i$<br>$z_3 = 2\\,\\text{cis}(7\\pi/4) = \\sqrt 2 - \\sqrt 2\\, i$<br><br>Kenar uzunluğu $2\\sqrt 2$ olan bir karenin dört köşesi, 2 yarıçaplı çembere içkin.</div></div>

<div class="calc-example"><div class="example-label">SORU 5 — $\\sin 3\\theta$ TÜRET</div><div class="example-body"><strong>$n = 3$ ile De Moivre kullanarak $\\sin 3\\theta = 3\\sin\\theta - 4\\sin^3\\theta$ türet.</strong><br><br>Üç kat açı açılımından: $\\sin 3\\theta = 3\\cos^2\\theta\\sin\\theta - \\sin^3\\theta$.<br>$\\cos^2\\theta = 1 - \\sin^2\\theta$ yerine koy: $\\sin 3\\theta = 3(1 - \\sin^2\\theta)\\sin\\theta - \\sin^3\\theta = 3\\sin\\theta - 3\\sin^3\\theta - \\sin^3\\theta = \\mathbf{3\\sin\\theta - 4\\sin^3\\theta}$.</div></div>

<div class="calc-example"><div class="example-label">SORU 6 — $32$ SAYISININ BEŞİNCİ KÖKLERİ</div><div class="example-body"><strong>$z^5 = 32$ denkleminin beş beşinci kökünün hepsini bul.</strong><br><br>$32 = 32\\,\\text{cis}\\,0$. Her kökün modülü: $32^{1/5} = 2$. Argümanlar: $\\dfrac{2\\pi k}{5}$, $k = 0, 1, 2, 3, 4$ için.<br><br>$z_0 = 2\\,\\text{cis}\\,0 = 2$<br>$z_1 = 2\\,\\text{cis}(72^\\circ) \\approx 0.618 + 1.902\\, i$<br>$z_2 = 2\\,\\text{cis}(144^\\circ) \\approx -1.618 + 1.176\\, i$<br>$z_3 = 2\\,\\text{cis}(216^\\circ) \\approx -1.618 - 1.176\\, i$<br>$z_4 = 2\\,\\text{cis}(288^\\circ) \\approx 0.618 - 1.902\\, i$<br><br>2 yarıçaplı çembere içkin düzgün beşgenin beş köşesi. Sayısal koordinatların $(\\sqrt 5 - 1)/4$ içerdiğine dikkat et — düzgün beşgen aracılığıyla altın orana bağlanır.</div></div>

<div class="calc-example"><div class="example-label">SORU 7 — BİR BİRİM KÖKÜN KUVVETİ</div><div class="example-body"><strong>$\\omega = \\text{cis}(2\\pi/5)$ ilkel beşinci birim kök olsun. $\\omega^{17}$ hesapla.</strong><br><br>De Moivre kullan: $\\omega^{17} = \\text{cis}(17 \\cdot 2\\pi/5) = \\text{cis}(34\\pi/5)$. Mod $2\\pi$ ile sadeleştir: $34\\pi/5 = 30\\pi/5 + 4\\pi/5 = 6\\pi + 4\\pi/5$. $6\\pi$ ($= 3 \\cdot 2\\pi$) çıkar: kalan $4\\pi/5$.<br><br>Cevap: $\\omega^{17} = \\text{cis}(4\\pi/5) = \\omega^2$.<br><br>Kısayol: $\\omega^5 = 1$ olduğu için $\\omega^{17} = \\omega^{17 \\bmod 5} = \\omega^2$. Üs her zaman mod $n$ ile sarar.</div></div>

<div class="calc-example"><div class="example-label">SORU 8 — $z^4 + 4$ ÇARPANLAŞTIR</div><div class="example-body"><strong>$z^4 = -4$ denkleminin tüm karmaşık köklerini bul ve bunları kullanarak $z^4 + 4$ ifadesini karmaşık sayılar üzerinde çarpanlarına ayır.</strong><br><br>$-4 = 4\\,\\text{cis}\\,\\pi$. Her kökün modülü: $4^{1/4} = \\sqrt 2$. Argümanlar: $\\dfrac{\\pi + 2\\pi k}{4}$, $k = 0, 1, 2, 3$ için.<br><br>$z_0 = \\sqrt 2\\,\\text{cis}(\\pi/4) = 1 + i$<br>$z_1 = \\sqrt 2\\,\\text{cis}(3\\pi/4) = -1 + i$<br>$z_2 = \\sqrt 2\\,\\text{cis}(5\\pi/4) = -1 - i$<br>$z_3 = \\sqrt 2\\,\\text{cis}(7\\pi/4) = 1 - i$<br><br>Çarpanlaştırma: $z^4 + 4 = (z - 1 - i)(z + 1 - i)(z + 1 + i)(z - 1 + i)$. Eşlenikleri eşleştirmek reel ikinci derece çarpanlaştırmasını verir: $z^4 + 4 = (z^2 - 2z + 2)(z^2 + 2z + 2)$. Ünlü bir çarpanlaştırma özdeşliği, birim kökler aracılığıyla tek satırda türetildi.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Birim kökler sadece cebirsel bir tuhaflık değildir. Ayrık Fourier dönüşümünün, FFT algoritmasının, sinyal işlemenin ve sayılar teorisinin büyük bölümünün yapı taşlarıdır. Bir lise alıştırmasından çıkarılan tek bir özdeşlik — $\\omega^n = 1$ — hepsinin kilidini açar.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>De Moivre teoremi: her tam sayı $n$ için $(r\\,\\text{cis}\\,\\theta)^n = r^n\\,\\text{cis}(n\\theta)$; kutupsal çarpım kuralından tümevarımla kanıtlanır</li>
<li>$(1+i)^{10} = 32 i$ gibi kuvvetleri sayfalarca FOIL yerine üç satırda hesaplar</li>
<li>Binom teoremi ile açmak iki kat açı, üç kat açı ve tüm çok kat açı trigonometrik özdeşliklerini verir</li>
<li>$z^n = w$ denkleminin tam olarak $n$ karmaşık çözümü vardır: $z_k = R^{1/n}\\,\\text{cis}((\\phi + 2\\pi k)/n)$, $k = 0, 1, \\ldots, n-1$</li>
<li>Tüm $n$ kök $R^{1/n}$ yarıçaplı bir çember üzerinde, eşit aralıklı — düzgün bir $n$-gen oluştururlar</li>
<li>Birim kökler: $z^n = 1$ denklemi $\\omega = \\text{cis}(2\\pi/n)$ ile $\\omega^k$, $k = 0, \\ldots, n-1$ verir, birim çembere içkin</li>
<li>Tüm $n$-inci birim köklerin toplamı sıfırdır — geometrik (merkez başlangıçtadır) ve cebirsel (Vieta) olarak kanıtlanır</li>
</ul>
</div>`
};
