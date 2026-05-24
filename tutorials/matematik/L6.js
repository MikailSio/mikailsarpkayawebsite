/* ============================================================
   tutorials/matematik/L6.js
   Lise Matematik · Ders 6: Trigonometrik Denklemler
   Bilingual EN + TR · KaTeX + Plotly · NO Python, NO ML
   ============================================================ */
window.LISE_MAT_L6 = {

/* ========================================================================
   ENGLISH VERSION
   ======================================================================== */
en: `
<p class="l-text"><strong>A trigonometric equation</strong> is an equation in which the unknown sits inside a trigonometric function such as $\\sin$, $\\cos$, or $\\tan$. Because these functions repeat their values over and over again as the angle keeps turning around the unit circle, a single trigonometric equation typically has <em>infinitely many</em> solutions. Our job in this lesson is twofold: find one fundamental solution, and then describe the whole infinite family in one compact formula.</p>

<p class="l-text">High school students often meet trig equations for the first time in Grade 11. The mechanics are not difficult — you only need clear pictures of the unit circle, comfort with reference angles, and patience to write the general solution correctly. We work in radians throughout, but the same ideas apply in degrees.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Solve the three basic equations $\\sin x = a$, $\\cos x = a$, $\\tan x = a$.</li>
<li>Write the <em>general solution</em> using a free integer $k$ to capture every periodic copy.</li>
<li>List all solutions of a trigonometric equation inside a finite interval such as $[0, 2\\pi]$.</li>
<li>Recognise quadratic-in-$\\sin$ (or in $\\cos$, $\\tan$) equations and reduce them by substitution.</li>
<li>Factor mixed equations such as $\\sin 2x = \\sin x$ using identities.</li>
<li>Detect when a trigonometric equation has <em>no</em> solution (e.g. $\\sin x = 2$).</li>
</ul>
</div>

<!-- ============================================================
     SECTION 1
     ============================================================ -->
<h2 class="l-title">1. What is a Trigonometric Equation?</h2>

<p class="l-text">An <strong>algebraic equation</strong> like $3x - 7 = 5$ has the unknown $x$ standing on its own. A <strong>trigonometric equation</strong> wraps the unknown inside a periodic function. For example:</p>

<div class="calc-formula">
<div class="formula-label">EXAMPLES OF TRIG EQUATIONS</div>
<div class="formula-main">$$\\sin x = \\tfrac{1}{2}, \\qquad \\cos x = -1, \\qquad \\tan x = \\sqrt{3}, \\qquad 2\\sin^2 x - \\sin x - 1 = 0$$</div>
<div class="formula-sub">The unknown $x$ is an <em>angle</em>. Because trig functions are periodic, each equation has infinitely many solutions.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Periodic nature</div><div class="card-body">$\\sin$ and $\\cos$ repeat every $2\\pi$. $\\tan$ repeats every $\\pi$. So if $x_0$ solves the equation, so does $x_0 + 2\\pi$, $x_0 - 2\\pi$, $x_0 + 4\\pi$, and so on.</div></div>
<div class="calc-card"><div class="card-title">Bounded outputs</div><div class="card-body">$-1 \\le \\sin x \\le 1$ and $-1 \\le \\cos x \\le 1$. So $\\sin x = 2$ has <em>no</em> solution. $\\tan x$, by contrast, can equal any real number.</div></div>
<div class="calc-card"><div class="card-title">Two answers per period</div><div class="card-body">Inside one full turn $[0, 2\\pi)$, a typical equation $\\sin x = a$ usually has two solutions (mirror images about the y-axis on the unit circle). $\\cos x = a$ also gives two. $\\tan x = a$ gives one per period of $\\pi$.</div></div>
<div class="calc-card"><div class="card-title">General solution</div><div class="card-body">We summarise the infinite family with a free integer $k \\in \\mathbb{Z}$. Each value of $k$ gives one specific solution.</div></div>
</div>

<div class="think-box"><div class="think-label">A QUICK MENTAL PICTURE</div><div class="think-body">Imagine spinning the radius arm of the unit circle. Each time it points "the right way", $\\sin x$ takes the value you want. Because spinning is endless, the moments at which $\\sin x = a$ happen again and again, separated by full turns of $2\\pi$.</div></div>

<!-- ============================================================
     SECTION 2
     ============================================================ -->
<h2 class="l-title">2. Basic Equation: $\\sin x = a$</h2>

<p class="l-text">We want the angle(s) whose sine equals a given value $a$. First check feasibility: $\\sin$ never leaves the strip $[-1, 1]$, so we need $|a| \\le 1$.</p>

<div class="calc-formula">
<div class="formula-label">GENERAL SOLUTION OF $\\sin x = a$ (for $|a| \\le 1$)</div>
<div class="formula-main">$$x = \\alpha + 2k\\pi \\quad \\text{or} \\quad x = \\pi - \\alpha + 2k\\pi, \\qquad k \\in \\mathbb{Z}$$</div>
<div class="formula-sub">Here $\\alpha = \\arcsin a$ is the <em>reference</em> (principal) solution in $[-\\pi/2, \\pi/2]$. The mirror solution $\\pi - \\alpha$ comes from the symmetry of $\\sin$ about $\\pi/2$.</div>
</div>

<p class="l-text"><strong>Why two solution families?</strong> On the unit circle, $\\sin x$ is the $y$-coordinate of the point at angle $x$. A horizontal line $y = a$ that crosses the unit circle hits it in (generically) two points — one on the right half, one on the left half. These two points correspond to angles $\\alpha$ and $\\pi - \\alpha$, both with the same $y$-coordinate $a$.</p>

<div id="plot-sin-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xs=[];for(var i=0;i<=720;i++){xs.push(i*Math.PI/180-Math.PI);}
  var ys=xs.map(function(x){return Math.sin(x);});
  var line={x:xs,y:ys,mode:"lines",name:"y = sin x",line:{color:"#c8a96e",width:2.5}};
  var hor={x:[-Math.PI, 3*Math.PI],y:[0.5,0.5],mode:"lines",name:"y = 0.5",line:{color:"#f87171",width:1.5,dash:"dash"}};
  var hits={x:[Math.PI/6, 5*Math.PI/6, Math.PI/6+2*Math.PI],y:[0.5,0.5,0.5],mode:"markers+text",name:"solutions",text:["π/6","5π/6","π/6+2π"],textposition:"top center",marker:{size:10,color:"#4de87a"},textfont:{color:"#4de87a",size:11}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (radians)",range:[-Math.PI, 3*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"sin x",range:[-1.3,1.3]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-sin-en",[line,hor,hits],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The horizontal line $y = 1/2$ cuts the sine curve in many places. Three of them are highlighted: $\\pi/6$, $5\\pi/6$, and $\\pi/6 + 2\\pi$. The first two are the two basic solutions in $[0, 2\\pi)$; the third is the periodic copy.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Solve</strong> $\\sin x = \\tfrac{1}{2}$.<br><br>The reference angle is $\\alpha = \\arcsin(\\tfrac{1}{2}) = \\pi/6$. The general solution is therefore<br>$$x = \\tfrac{\\pi}{6} + 2k\\pi \\quad \\text{or} \\quad x = \\pi - \\tfrac{\\pi}{6} + 2k\\pi = \\tfrac{5\\pi}{6} + 2k\\pi, \\quad k \\in \\mathbb{Z}.$$<br>Inside $[0, 2\\pi)$ the only two solutions are $\\pi/6$ and $5\\pi/6$.</div></div>

<div class="calc-example"><div class="example-label">EDGE CASES</div><div class="example-body"><strong>$\\sin x = 1$:</strong> single solution per period, $x = \\pi/2 + 2k\\pi$.<br><strong>$\\sin x = -1$:</strong> single solution per period, $x = -\\pi/2 + 2k\\pi = 3\\pi/2 + 2k\\pi$.<br><strong>$\\sin x = 0$:</strong> $x = k\\pi$ (sine is zero at every multiple of $\\pi$).<br><strong>$\\sin x = 2$:</strong> <em>no solution</em> — the value 2 lies outside the range of sine.</div></div>

<!-- ============================================================
     SECTION 3
     ============================================================ -->
<h2 class="l-title">3. Basic Equation: $\\cos x = a$</h2>

<p class="l-text">Now we want $\\cos x = a$. Again we need $|a| \\le 1$. The cosine, being the $x$-coordinate on the unit circle, is symmetric about the horizontal axis. A vertical line $x = a$ cuts the unit circle in two points placed symmetrically above and below the $x$-axis: their angles are $\\alpha$ and $-\\alpha$.</p>

<div class="calc-formula">
<div class="formula-label">GENERAL SOLUTION OF $\\cos x = a$ (for $|a| \\le 1$)</div>
<div class="formula-main">$$x = \\pm \\alpha + 2k\\pi, \\qquad k \\in \\mathbb{Z}$$</div>
<div class="formula-sub">Here $\\alpha = \\arccos a \\in [0, \\pi]$. The compact $\\pm$ packages two families: $x = \\alpha + 2k\\pi$ and $x = -\\alpha + 2k\\pi$.</div>
</div>

<div id="plot-cos-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xs=[];for(var i=0;i<=720;i++){xs.push(i*Math.PI/180-Math.PI);}
  var ys=xs.map(function(x){return Math.cos(x);});
  var line={x:xs,y:ys,mode:"lines",name:"y = cos x",line:{color:"#06b6d4",width:2.5}};
  var hor={x:[-Math.PI, 3*Math.PI],y:[-1,-1],mode:"lines",name:"y = -1",line:{color:"#f87171",width:1.5,dash:"dash"}};
  var hits={x:[-Math.PI, Math.PI],y:[-1,-1],mode:"markers+text",name:"solutions",text:["-π","π"],textposition:"bottom center",marker:{size:11,color:"#4de87a"},textfont:{color:"#4de87a",size:11}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (radians)",range:[-Math.PI, 3*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"cos x",range:[-1.35,1.35]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-cos-en",[line,hor,hits],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The line $y = -1$ touches the cosine curve only at its bottom points $x = \\pi, 3\\pi, -\\pi, \\dots$ — every odd multiple of $\\pi$. Because $\\pm$ collapses to a single value when $\\alpha = \\pi$, the "two families" formula merges into one.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Solve</strong> $\\cos x = -1$.<br><br>Here $\\alpha = \\arccos(-1) = \\pi$. The formula gives $x = \\pm \\pi + 2k\\pi$. But $-\\pi + 2k\\pi = (2k - 1)\\pi$ and $+\\pi + 2k\\pi = (2k + 1)\\pi$ together cover all <em>odd multiples</em> of $\\pi$, so we write more cleanly:<br>$$x = (2k + 1)\\pi = \\pi + 2k\\pi, \\quad k \\in \\mathbb{Z}.$$<br>Inside $[0, 2\\pi)$ the only solution is $x = \\pi$.</div></div>

<div class="calc-example"><div class="example-label">SYMMETRY EXAMPLE</div><div class="example-body"><strong>Solve</strong> $\\cos x = \\tfrac{1}{2}$.<br><br>$\\alpha = \\arccos(\\tfrac{1}{2}) = \\pi/3$. General solution: $x = \\pm \\pi/3 + 2k\\pi$. Inside $[0, 2\\pi)$ we get $\\pi/3$ and $-\\pi/3 + 2\\pi = 5\\pi/3$.</div></div>

<!-- ============================================================
     SECTION 4
     ============================================================ -->
<h2 class="l-title">4. Basic Equation: $\\tan x = a$</h2>

<p class="l-text">Tangent is unbounded — for any real $a$, the equation $\\tan x = a$ has solutions. There is no feasibility check. But tangent has a shorter period of $\\pi$ (instead of $2\\pi$), so the general solution uses $k\\pi$ rather than $2k\\pi$.</p>

<div class="calc-formula">
<div class="formula-label">GENERAL SOLUTION OF $\\tan x = a$ (for any real $a$)</div>
<div class="formula-main">$$x = \\alpha + k\\pi, \\qquad k \\in \\mathbb{Z}$$</div>
<div class="formula-sub">Here $\\alpha = \\arctan a \\in (-\\pi/2, \\pi/2)$. A single reference angle plus all $\\pi$-translates capture every solution.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why only one family?</div><div class="card-body">Within one $\\pi$-wide period of $\\tan$, the function rises monotonically from $-\\infty$ to $+\\infty$. So each horizontal level $y = a$ is hit exactly once.</div></div>
<div class="calc-card"><div class="card-title">Forbidden angles</div><div class="card-body">$\\tan x$ is undefined at $x = \\pi/2 + k\\pi$ (vertical asymptotes). These are never solutions — they are simply excluded from the domain.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Solve</strong> $\\tan x = \\sqrt{3}$.<br><br>$\\alpha = \\arctan \\sqrt{3} = \\pi/3$. General solution: $x = \\pi/3 + k\\pi$, $k \\in \\mathbb{Z}$.<br><br>In $[0, 2\\pi)$ the solutions are $\\pi/3$ and $\\pi/3 + \\pi = 4\\pi/3$.</div></div>

<!-- ============================================================
     SECTION 5
     ============================================================ -->
<h2 class="l-title">5. The General Solution in Words</h2>

<p class="l-text">A quick reference table that you can copy into your notebook:</p>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">$\\sin x = a$, $|a| \\le 1$</div>
<div class="compare-item">$\\alpha = \\arcsin a$</div>
<div class="compare-item">$x = \\alpha + 2k\\pi$</div>
<div class="compare-item">$x = \\pi - \\alpha + 2k\\pi$</div>
<div class="compare-item">$k \\in \\mathbb{Z}$</div>
</div>
<div class="compare-col">
<div class="compare-title">$\\cos x = a$, $|a| \\le 1$</div>
<div class="compare-item">$\\alpha = \\arccos a$</div>
<div class="compare-item">$x = +\\alpha + 2k\\pi$</div>
<div class="compare-item">$x = -\\alpha + 2k\\pi$</div>
<div class="compare-item">$k \\in \\mathbb{Z}$</div>
</div>
<div class="compare-col">
<div class="compare-title">$\\tan x = a$, $a \\in \\mathbb{R}$</div>
<div class="compare-item">$\\alpha = \\arctan a$</div>
<div class="compare-item">$x = \\alpha + k\\pi$</div>
<div class="compare-item">(one family suffices)</div>
<div class="compare-item">$k \\in \\mathbb{Z}$</div>
</div>
</div>

<div class="think-box"><div class="think-label">WHY THE INTEGER $k$?</div><div class="think-body">The integer $k$ is a label for "which copy am I picking?". $k = 0$ gives the principal solution, $k = 1$ gives the solution one period later, $k = -1$ gives the solution one period earlier, and so on. Every choice of $k$ produces a legitimate solution.</div></div>

<!-- ============================================================
     SECTION 6
     ============================================================ -->
<h2 class="l-title">6. Listing Solutions in a Finite Interval</h2>

<p class="l-text">In school problems we are often asked: "list all solutions in $[0, 2\\pi)$" (or $[0, 360^\\circ)$ in degree mode). The recipe is mechanical:</p>

<div class="calc-formula">
<div class="formula-label">RECIPE: SOLUTIONS IN $[0, 2\\pi)$</div>
<div class="formula-main">$$\\text{1) Write the general solution.} \\quad \\text{2) Loop } k = \\dots, -1, 0, 1, 2, \\dots \\quad \\text{3) Keep only } x \\in [0, 2\\pi).$$</div>
<div class="formula-sub">For sine and cosine equations you usually find 2 solutions per period. For tangent you find 2 solutions in $[0, 2\\pi)$ because $2\\pi / \\pi = 2$ periods fit.</div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>List every $x$ in $[0, 2\\pi)$ with $\\sin x = -\\tfrac{\\sqrt{2}}{2}$.</strong><br><br>$\\alpha = \\arcsin(-\\sqrt{2}/2) = -\\pi/4$. General solution:<br>$x = -\\pi/4 + 2k\\pi$ or $x = \\pi - (-\\pi/4) + 2k\\pi = 5\\pi/4 + 2k\\pi$.<br><br>Take $k = 0$ in the first family: $-\\pi/4 \\notin [0, 2\\pi)$. Take $k = 1$: $-\\pi/4 + 2\\pi = 7\\pi/4$. ✓<br>Take $k = 0$ in the second family: $5\\pi/4 \\in [0, 2\\pi)$. ✓<br><br><strong>Answer:</strong> $x = 5\\pi/4$ and $x = 7\\pi/4$.</div></div>

<div class="calc-example"><div class="example-label">DEGREE-MODE EXAMPLE</div><div class="example-body"><strong>List every $\\theta \\in [0^\\circ, 360^\\circ)$ with $\\cos \\theta = \\tfrac{\\sqrt{3}}{2}$.</strong><br><br>$\\alpha = 30^\\circ$. Solutions: $\\theta = \\pm 30^\\circ + 360^\\circ k$. In $[0^\\circ, 360^\\circ)$: $\\theta = 30^\\circ$ and $\\theta = -30^\\circ + 360^\\circ = 330^\\circ$.</div></div>

<!-- ============================================================
     SECTION 7
     ============================================================ -->
<h2 class="l-title">7. Equation Types: Quadratic Form & Factoring</h2>

<p class="l-text">More involved trig equations often reduce to <strong>quadratic</strong> equations in $\\sin x$, $\\cos x$, or $\\tan x$. The trick is a clean substitution.</p>

<div class="calc-formula">
<div class="formula-label">QUADRATIC-IN-SINE PATTERN</div>
<div class="formula-main">$$a \\sin^2 x + b \\sin x + c = 0 \\quad \\xrightarrow{u = \\sin x} \\quad a u^2 + b u + c = 0$$</div>
<div class="formula-sub">Solve the quadratic for $u$, then re-substitute and solve $\\sin x = u_1$ or $\\sin x = u_2$ using the basic recipe.</div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Solve</strong> $2\\sin^2 x - \\sin x - 1 = 0$.<br><br>Let $u = \\sin x$. Then $2u^2 - u - 1 = 0$. Factor: $(2u + 1)(u - 1) = 0$, giving $u = -\\tfrac{1}{2}$ or $u = 1$.<br><br><strong>Case A:</strong> $\\sin x = 1 \\Rightarrow x = \\pi/2 + 2k\\pi$.<br><strong>Case B:</strong> $\\sin x = -\\tfrac{1}{2} \\Rightarrow x = -\\pi/6 + 2k\\pi$ or $x = 7\\pi/6 + 2k\\pi$.<br><br>Combine all three families to get the full solution set.</div></div>

<div class="calc-example"><div class="example-label">FACTORING EXAMPLE</div><div class="example-body"><strong>Solve</strong> $\\sin x \\cos x = 0$.<br><br>A product is zero iff one factor is zero. So $\\sin x = 0$ <em>or</em> $\\cos x = 0$.<br>$\\sin x = 0 \\Rightarrow x = k\\pi$.<br>$\\cos x = 0 \\Rightarrow x = \\pi/2 + k\\pi$.<br>Combined: $x = k \\cdot \\pi/2$, $k \\in \\mathbb{Z}$.</div></div>

<div class="think-box"><div class="think-label">WATCH OUT FOR EXTRANEOUS ROOTS</div><div class="think-body">When you square both sides, multiply by an expression that could be zero, or divide by $\\sin x$ or $\\cos x$, you may either introduce false solutions or accidentally <em>lose</em> real ones. Always check candidate solutions back in the <em>original</em> equation.</div></div>

<!-- ============================================================
     SECTION 8
     ============================================================ -->
<h2 class="l-title">8. Equations Mixing Several Trig Functions</h2>

<p class="l-text">If an equation has both $\\sin x$ and $\\cos x$, a useful first move is to use identities so that only <em>one</em> trig function remains. The two everyday tools are:</p>

<div class="calc-formula">
<div class="formula-label">TWO RESCUE IDENTITIES</div>
<div class="formula-main">$$\\sin^2 x + \\cos^2 x = 1, \\qquad \\sin(2x) = 2 \\sin x \\cos x$$</div>
<div class="formula-sub">The first lets you replace $\\sin^2 x$ by $1 - \\cos^2 x$ (or vice versa). The second collapses a product $\\sin x \\cos x$ into a single $\\sin$ at the doubled angle.</div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Solve</strong> $\\sin x = \\cos x$.<br><br>Divide both sides by $\\cos x$ (we will check separately that $\\cos x = 0$ is not a solution; indeed $\\sin x = 0$ does not coincide with $\\cos x = 0$).<br>$$\\tan x = 1 \\implies x = \\pi/4 + k\\pi.$$<br>Inside $[0, 2\\pi)$: $x = \\pi/4$ and $x = 5\\pi/4$.</div></div>

<div class="calc-example"><div class="example-label">DOUBLE-ANGLE EXAMPLE</div><div class="example-body"><strong>Solve</strong> $2 \\sin x \\cos x = 1$ on $[0, 2\\pi)$.<br><br>Use the identity $2 \\sin x \\cos x = \\sin(2x)$. The equation becomes $\\sin(2x) = 1$.<br>Reference: $2x = \\pi/2 + 2k\\pi$, i.e. $x = \\pi/4 + k\\pi$.<br>Inside $[0, 2\\pi)$: $x = \\pi/4$ and $x = 5\\pi/4$.</div></div>

<div id="plot-double-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xs=[];for(var i=0;i<=720;i++){xs.push(i*Math.PI/180);}
  var ys=xs.map(function(x){return Math.sin(2*x);});
  var line={x:xs,y:ys,mode:"lines",name:"y = sin 2x",line:{color:"#a855f7",width:2.5}};
  var hor={x:[0, 2*Math.PI],y:[1,1],mode:"lines",name:"y = 1",line:{color:"#f87171",width:1.5,dash:"dash"}};
  var hits={x:[Math.PI/4, 5*Math.PI/4],y:[1,1],mode:"markers+text",name:"solutions",text:["π/4","5π/4"],textposition:"top center",marker:{size:11,color:"#4de87a"},textfont:{color:"#4de87a",size:11}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (radians)",range:[0, 2*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"sin 2x",range:[-1.3,1.3]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-double-en",[line,hor,hits],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The curve $y = \\sin(2x)$ has period $\\pi$ — twice as fast as ordinary sine. The horizontal line $y = 1$ touches its peaks at $x = \\pi/4$ and $x = 5\\pi/4$ inside $[0, 2\\pi)$, exactly matching the algebraic solution.</div></div>

<!-- ============================================================
     SECTION 9
     ============================================================ -->
<h2 class="l-title">9. Classic Exercises</h2>

<p class="l-text">Work each one out on paper before reading the solution. All angles are in radians unless stated.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body">Solve $\\sin x = \\tfrac{\\sqrt{2}}{2}$ in $[0, 2\\pi)$.<br><br><strong>Solution.</strong> $\\alpha = \\pi/4$. Two solutions: $x = \\pi/4$ and $x = \\pi - \\pi/4 = 3\\pi/4$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body">Solve $\\cos x = 0$ in $[0, 2\\pi)$.<br><br><strong>Solution.</strong> $\\alpha = \\pi/2$. Solutions: $x = \\pi/2$ and $x = -\\pi/2 + 2\\pi = 3\\pi/2$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body">Solve $\\tan x = -1$ in $[0, 2\\pi)$.<br><br><strong>Solution.</strong> $\\alpha = -\\pi/4$. General: $x = -\\pi/4 + k\\pi$. In $[0, 2\\pi)$: $k = 1 \\Rightarrow 3\\pi/4$; $k = 2 \\Rightarrow 7\\pi/4$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body">Solve $2 \\cos x - \\sqrt{3} = 0$ for all $x$.<br><br><strong>Solution.</strong> $\\cos x = \\sqrt{3}/2$, so $\\alpha = \\pi/6$. General: $x = \\pm \\pi/6 + 2k\\pi$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body">Solve $2 \\sin^2 x + 3 \\sin x + 1 = 0$.<br><br><strong>Solution.</strong> Let $u = \\sin x$. Then $2u^2 + 3u + 1 = (2u + 1)(u + 1) = 0$, so $u = -1/2$ or $u = -1$.<br>$\\sin x = -1/2 \\Rightarrow x = -\\pi/6 + 2k\\pi$ or $x = 7\\pi/6 + 2k\\pi$.<br>$\\sin x = -1 \\Rightarrow x = -\\pi/2 + 2k\\pi$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6</div><div class="example-body">Solve $\\cos^2 x - \\sin^2 x = 1/2$.<br><br><strong>Solution.</strong> Use the double-angle identity $\\cos^2 x - \\sin^2 x = \\cos(2x)$. The equation becomes $\\cos(2x) = 1/2$, so $2x = \\pm \\pi/3 + 2k\\pi$, hence $x = \\pm \\pi/6 + k\\pi$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7</div><div class="example-body">Solve $\\sin x = \\cos x$ in $[0, 2\\pi)$ (without using $\\tan$).<br><br><strong>Solution.</strong> Square both sides: $\\sin^2 x = \\cos^2 x$, so $1 - \\cos^2 x = \\cos^2 x$, giving $\\cos^2 x = 1/2$ and $\\cos x = \\pm 1/\\sqrt{2}$. Candidates: $\\pi/4, 3\\pi/4, 5\\pi/4, 7\\pi/4$. Check in original: $\\pi/4$ ✓, $3\\pi/4$ ✗ ($\\sin = +\\sqrt{2}/2$, $\\cos = -\\sqrt{2}/2$), $5\\pi/4$ ✓, $7\\pi/4$ ✗. Squaring introduced two extraneous roots — that is why we check.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8</div><div class="example-body">Solve $\\sin(3x) = 0$ in $[0, 2\\pi)$.<br><br><strong>Solution.</strong> $3x = k\\pi$, so $x = k\\pi/3$. In $[0, 2\\pi)$ we get $x = 0, \\pi/3, 2\\pi/3, \\pi, 4\\pi/3, 5\\pi/3$ — six solutions.</div></div>

<div class="think-box"><div class="think-label">CLOSING THOUGHT</div><div class="think-body">Trig equations are one of those topics where careful bookkeeping pays off. Write the general solution once, then strip it down to the interval the question asks for. Check candidates in the original equation — never trust an answer obtained by squaring or dividing without verifying.</div></div>

<p class="l-text"><em>End of lesson 6.</em> The next lesson moves from solving equations to solving <em>inequalities</em> involving trig functions — a natural continuation.</p>
`,

/* ========================================================================
   TURKISH VERSION
   ======================================================================== */
tr: `
<p class="l-text"><strong>Trigonometrik denklem</strong>, bilinmeyenin $\\sin$, $\\cos$ veya $\\tan$ gibi bir trigonometrik fonksiyon içinde yer aldığı denklemdir. Bu fonksiyonlar birim çember etrafında dönerken değerlerini sürekli tekrarladığından, tek bir trigonometrik denklemin tipik olarak <em>sonsuz</em> çözümü vardır. Bu derste iki şey yapacağız: önce bir temel çözüm bulup ardından tüm bu sonsuz aileyi tek bir formülle ifade edeceğiz.</p>

<p class="l-text">Lise öğrencileri trigonometrik denklemlerle ilk kez 11. sınıfta tanışır. Mekanizma zor değildir — sadece birim çemberin net bir resmine, referans açılarla rahat çalışmaya ve genel çözümü dikkatli yazmaya ihtiyacın var. Tüm boyunca radyan kullanacağız, ancak aynı fikirler dereceler için de geçerlidir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NELER ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\sin x = a$, $\\cos x = a$, $\\tan x = a$ olmak üzere üç temel denklemi çözmek.</li>
<li>Tüm periyodik kopyaları yakalayan <em>genel çözümü</em> bir serbest tamsayı $k$ ile yazmak.</li>
<li>$[0, 2\\pi]$ gibi sonlu bir aralıkta tüm çözümleri listelemek.</li>
<li>$\\sin$ (veya $\\cos$, $\\tan$) cinsinden kuadratik denklemleri tanıyıp değişken değiştirmeyle indirgemek.</li>
<li>$\\sin 2x = \\sin x$ gibi karışık denklemleri özdeşlik kullanarak çarpanlara ayırmak.</li>
<li>$\\sin x = 2$ gibi durumlarda denklemin <em>çözümsüz</em> olduğunu fark etmek.</li>
</ul>
</div>

<!-- ============================================================
     BÖLÜM 1
     ============================================================ -->
<h2 class="l-title">1. Trigonometrik Denklem Nedir?</h2>

<p class="l-text">$3x - 7 = 5$ gibi bir <strong>cebirsel denklemde</strong> bilinmeyen $x$ tek başınadır. <strong>Trigonometrik denklem</strong> ise bilinmeyeni periyodik bir fonksiyonun içine sarar. Birkaç örnek:</p>

<div class="calc-formula">
<div class="formula-label">TRİG DENKLEM ÖRNEKLERİ</div>
<div class="formula-main">$$\\sin x = \\tfrac{1}{2}, \\qquad \\cos x = -1, \\qquad \\tan x = \\sqrt{3}, \\qquad 2\\sin^2 x - \\sin x - 1 = 0$$</div>
<div class="formula-sub">Bilinmeyen $x$ bir <em>açıdır</em>. Trig fonksiyonlar periyodik olduğundan her denklemin sonsuz çözümü vardır.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Periyodik yapı</div><div class="card-body">$\\sin$ ve $\\cos$ her $2\\pi$'de bir tekrarlanır. $\\tan$ ise her $\\pi$'de tekrarlanır. $x_0$ bir çözümse $x_0 + 2\\pi$, $x_0 - 2\\pi$, $x_0 + 4\\pi$ vb. de çözümdür.</div></div>
<div class="calc-card"><div class="card-title">Sınırlı değer aralığı</div><div class="card-body">$-1 \\le \\sin x \\le 1$ ve $-1 \\le \\cos x \\le 1$. Dolayısıyla $\\sin x = 2$ denkleminin çözümü <em>yoktur</em>. $\\tan x$ ise her gerçek değeri alabilir.</div></div>
<div class="calc-card"><div class="card-title">Periyot başına iki cevap</div><div class="card-body">Bir tam tur $[0, 2\\pi)$ içinde tipik bir $\\sin x = a$ denkleminin genellikle iki çözümü vardır (birim çemberde $y$ eksenine göre simetrik). $\\cos x = a$ da iki tane verir. $\\tan x = a$ ise $\\pi$ periyodu başına bir tane verir.</div></div>
<div class="calc-card"><div class="card-title">Genel çözüm</div><div class="card-body">Sonsuz aileyi serbest bir tamsayı $k \\in \\mathbb{Z}$ ile özetleriz. $k$'nın her değeri belirli bir çözüm üretir.</div></div>
</div>

<div class="think-box"><div class="think-label">HIZLI BİR ZİHİN RESMİ</div><div class="think-body">Birim çemberin yarıçap kolunu döndürdüğünü hayal et. Her "doğru yöne" işaret ettiğinde $\\sin x$ aradığın değeri alır. Dönme sonsuz olduğundan, $\\sin x = a$ olan anlar tekrar tekrar gelir; aralarında tam $2\\pi$ dönüş vardır.</div></div>

<!-- ============================================================
     BÖLÜM 2
     ============================================================ -->
<h2 class="l-title">2. Temel Denklem: $\\sin x = a$</h2>

<p class="l-text">Sinüsü belirli bir $a$ değerine eşit olan açıyı (ya da açıları) arıyoruz. İlk önce uygunluğu kontrol et: $\\sin$ asla $[-1, 1]$ aralığından çıkmadığı için $|a| \\le 1$ olmalıdır.</p>

<div class="calc-formula">
<div class="formula-label">$\\sin x = a$ DENKLEMİNİN GENEL ÇÖZÜMÜ ($|a| \\le 1$ için)</div>
<div class="formula-main">$$x = \\alpha + 2k\\pi \\quad \\text{veya} \\quad x = \\pi - \\alpha + 2k\\pi, \\qquad k \\in \\mathbb{Z}$$</div>
<div class="formula-sub">Burada $\\alpha = \\arcsin a$, $[-\\pi/2, \\pi/2]$ aralığındaki <em>referans</em> (asal) çözümdür. $\\pi - \\alpha$ aynalı çözümü ise $\\sin$'in $\\pi/2$ etrafındaki simetrisinden gelir.</div>
</div>

<p class="l-text"><strong>Neden iki çözüm ailesi?</strong> Birim çemberde $\\sin x$, açıya karşılık gelen noktanın $y$ koordinatıdır. Birim çemberi kesen yatay bir $y = a$ doğrusu, çemberi (genelde) iki noktada keser — biri sağ yarımda, biri sol yarımda. Bu iki nokta $\\alpha$ ve $\\pi - \\alpha$ açılarına karşılık gelir ve ikisi de aynı $y$ koordinatına sahiptir.</p>

<div id="plot-sin-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xs=[];for(var i=0;i<=720;i++){xs.push(i*Math.PI/180-Math.PI);}
  var ys=xs.map(function(x){return Math.sin(x);});
  var line={x:xs,y:ys,mode:"lines",name:"y = sin x",line:{color:"#c8a96e",width:2.5}};
  var hor={x:[-Math.PI, 3*Math.PI],y:[0.5,0.5],mode:"lines",name:"y = 0.5",line:{color:"#f87171",width:1.5,dash:"dash"}};
  var hits={x:[Math.PI/6, 5*Math.PI/6, Math.PI/6+2*Math.PI],y:[0.5,0.5,0.5],mode:"markers+text",name:"çözümler",text:["π/6","5π/6","π/6+2π"],textposition:"top center",marker:{size:10,color:"#4de87a"},textfont:{color:"#4de87a",size:11}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (radyan)",range:[-Math.PI, 3*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"sin x",range:[-1.3,1.3]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-sin-tr",[line,hor,hits],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $y = 1/2$ yatay doğrusu sinüs eğrisini birçok noktada keser. Üçü işaretlendi: $\\pi/6$, $5\\pi/6$ ve $\\pi/6 + 2\\pi$. İlk ikisi $[0, 2\\pi)$ aralığındaki iki temel çözüm; üçüncüsü ise periyodik kopya.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Çöz:</strong> $\\sin x = \\tfrac{1}{2}$.<br><br>Referans açı $\\alpha = \\arcsin(\\tfrac{1}{2}) = \\pi/6$. Genel çözüm:<br>$$x = \\tfrac{\\pi}{6} + 2k\\pi \\quad \\text{veya} \\quad x = \\pi - \\tfrac{\\pi}{6} + 2k\\pi = \\tfrac{5\\pi}{6} + 2k\\pi, \\quad k \\in \\mathbb{Z}.$$<br>$[0, 2\\pi)$ içindeki tek iki çözüm $\\pi/6$ ve $5\\pi/6$'dır.</div></div>

<div class="calc-example"><div class="example-label">UÇ DURUMLAR</div><div class="example-body"><strong>$\\sin x = 1$:</strong> periyot başına tek çözüm, $x = \\pi/2 + 2k\\pi$.<br><strong>$\\sin x = -1$:</strong> periyot başına tek çözüm, $x = -\\pi/2 + 2k\\pi = 3\\pi/2 + 2k\\pi$.<br><strong>$\\sin x = 0$:</strong> $x = k\\pi$ (sinüs $\\pi$'nin her katında sıfırdır).<br><strong>$\\sin x = 2$:</strong> <em>çözüm yok</em> — 2 değeri sinüsün değer kümesinin dışındadır.</div></div>

<!-- ============================================================
     BÖLÜM 3
     ============================================================ -->
<h2 class="l-title">3. Temel Denklem: $\\cos x = a$</h2>

<p class="l-text">Şimdi $\\cos x = a$'yı istiyoruz. Yine $|a| \\le 1$ gerekir. Kosinüs, birim çemberin $x$ koordinatı olduğundan yatay eksene göre simetriktir. Dikey bir $x = a$ doğrusu birim çemberi $x$ ekseninin altında ve üstünde simetrik iki noktada keser: açıları $\\alpha$ ve $-\\alpha$'dır.</p>

<div class="calc-formula">
<div class="formula-label">$\\cos x = a$ DENKLEMİNİN GENEL ÇÖZÜMÜ ($|a| \\le 1$ için)</div>
<div class="formula-main">$$x = \\pm \\alpha + 2k\\pi, \\qquad k \\in \\mathbb{Z}$$</div>
<div class="formula-sub">Burada $\\alpha = \\arccos a \\in [0, \\pi]$. Kısa $\\pm$ işareti iki aileyi paketler: $x = \\alpha + 2k\\pi$ ve $x = -\\alpha + 2k\\pi$.</div>
</div>

<div id="plot-cos-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xs=[];for(var i=0;i<=720;i++){xs.push(i*Math.PI/180-Math.PI);}
  var ys=xs.map(function(x){return Math.cos(x);});
  var line={x:xs,y:ys,mode:"lines",name:"y = cos x",line:{color:"#06b6d4",width:2.5}};
  var hor={x:[-Math.PI, 3*Math.PI],y:[-1,-1],mode:"lines",name:"y = -1",line:{color:"#f87171",width:1.5,dash:"dash"}};
  var hits={x:[-Math.PI, Math.PI],y:[-1,-1],mode:"markers+text",name:"çözümler",text:["-π","π"],textposition:"bottom center",marker:{size:11,color:"#4de87a"},textfont:{color:"#4de87a",size:11}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (radyan)",range:[-Math.PI, 3*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"cos x",range:[-1.35,1.35]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-cos-tr",[line,hor,hits],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $y = -1$ doğrusu kosinüs eğrisine yalnızca alt noktalarında $x = \\pi, 3\\pi, -\\pi, \\dots$ — yani $\\pi$'nin tüm tek katlarında değer. $\\alpha = \\pi$ olduğunda $\\pm$ tek bir değere indiği için "iki aile" formülü tek bir aileye çöker.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Çöz:</strong> $\\cos x = -1$.<br><br>Burada $\\alpha = \\arccos(-1) = \\pi$. Formül $x = \\pm \\pi + 2k\\pi$ verir. Ancak $-\\pi + 2k\\pi = (2k - 1)\\pi$ ve $+\\pi + 2k\\pi = (2k + 1)\\pi$ birlikte $\\pi$'nin tüm <em>tek katlarını</em> kapsadığından daha temiz yazabiliriz:<br>$$x = (2k + 1)\\pi = \\pi + 2k\\pi, \\quad k \\in \\mathbb{Z}.$$<br>$[0, 2\\pi)$ içindeki tek çözüm $x = \\pi$'dir.</div></div>

<div class="calc-example"><div class="example-label">SİMETRİ ÖRNEĞİ</div><div class="example-body"><strong>Çöz:</strong> $\\cos x = \\tfrac{1}{2}$.<br><br>$\\alpha = \\arccos(\\tfrac{1}{2}) = \\pi/3$. Genel çözüm: $x = \\pm \\pi/3 + 2k\\pi$. $[0, 2\\pi)$ içinde $\\pi/3$ ve $-\\pi/3 + 2\\pi = 5\\pi/3$ buluruz.</div></div>

<!-- ============================================================
     BÖLÜM 4
     ============================================================ -->
<h2 class="l-title">4. Temel Denklem: $\\tan x = a$</h2>

<p class="l-text">Tanjant sınırsızdır — herhangi bir reel $a$ için $\\tan x = a$ denkleminin çözümü vardır. Uygunluk kontrolüne gerek yoktur. Ancak tanjantın periyodu daha kısadır ($2\\pi$ yerine $\\pi$), bu yüzden genel çözüm $2k\\pi$ yerine $k\\pi$ kullanır.</p>

<div class="calc-formula">
<div class="formula-label">$\\tan x = a$ DENKLEMİNİN GENEL ÇÖZÜMÜ (herhangi bir reel $a$ için)</div>
<div class="formula-main">$$x = \\alpha + k\\pi, \\qquad k \\in \\mathbb{Z}$$</div>
<div class="formula-sub">Burada $\\alpha = \\arctan a \\in (-\\pi/2, \\pi/2)$. Tek bir referans açı artı tüm $\\pi$-ötelemeleri her çözümü kapsar.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden tek aile?</div><div class="card-body">$\\tan$'ın bir $\\pi$ genişliğindeki periyodunda fonksiyon $-\\infty$'dan $+\\infty$'a tek yönlü artar. Bu yüzden her yatay seviye $y = a$ tam olarak bir kez kesilir.</div></div>
<div class="calc-card"><div class="card-title">Yasak açılar</div><div class="card-body">$\\tan x$, $x = \\pi/2 + k\\pi$ noktalarında tanımsızdır (düşey asimptotlar). Bunlar asla çözüm olmaz — basitçe tanım kümesinin dışındadır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Çöz:</strong> $\\tan x = \\sqrt{3}$.<br><br>$\\alpha = \\arctan \\sqrt{3} = \\pi/3$. Genel çözüm: $x = \\pi/3 + k\\pi$, $k \\in \\mathbb{Z}$.<br><br>$[0, 2\\pi)$ içindeki çözümler $\\pi/3$ ve $\\pi/3 + \\pi = 4\\pi/3$'tür.</div></div>

<!-- ============================================================
     BÖLÜM 5
     ============================================================ -->
<h2 class="l-title">5. Genel Çözüm Özeti</h2>

<p class="l-text">Defterine kopyalayabileceğin hızlı bir referans tablosu:</p>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">$\\sin x = a$, $|a| \\le 1$</div>
<div class="compare-item">$\\alpha = \\arcsin a$</div>
<div class="compare-item">$x = \\alpha + 2k\\pi$</div>
<div class="compare-item">$x = \\pi - \\alpha + 2k\\pi$</div>
<div class="compare-item">$k \\in \\mathbb{Z}$</div>
</div>
<div class="compare-col">
<div class="compare-title">$\\cos x = a$, $|a| \\le 1$</div>
<div class="compare-item">$\\alpha = \\arccos a$</div>
<div class="compare-item">$x = +\\alpha + 2k\\pi$</div>
<div class="compare-item">$x = -\\alpha + 2k\\pi$</div>
<div class="compare-item">$k \\in \\mathbb{Z}$</div>
</div>
<div class="compare-col">
<div class="compare-title">$\\tan x = a$, $a \\in \\mathbb{R}$</div>
<div class="compare-item">$\\alpha = \\arctan a$</div>
<div class="compare-item">$x = \\alpha + k\\pi$</div>
<div class="compare-item">(tek aile yeterli)</div>
<div class="compare-item">$k \\in \\mathbb{Z}$</div>
</div>
</div>

<div class="think-box"><div class="think-label">$k$ TAMSAYISI NEDEN VAR?</div><div class="think-body">$k$ tamsayısı "hangi kopyayı alıyorum?" etiketidir. $k = 0$ asal çözümü, $k = 1$ bir periyot ileri çözümü, $k = -1$ bir periyot geri çözümü verir, vb. $k$'nın her seçimi geçerli bir çözüm üretir.</div></div>

<!-- ============================================================
     BÖLÜM 6
     ============================================================ -->
<h2 class="l-title">6. Sonlu Aralıkta Çözümleri Listeleme</h2>

<p class="l-text">Okul sorularında sıkça "tüm çözümleri $[0, 2\\pi)$ içinde listele" (ya da derece modunda $[0, 360^\\circ)$) istenir. Tarif mekaniktir:</p>

<div class="calc-formula">
<div class="formula-label">TARİF: $[0, 2\\pi)$ İÇİNDEKİ ÇÖZÜMLER</div>
<div class="formula-main">$$\\text{1) Genel çözümü yaz.} \\quad \\text{2) } k = \\dots, -1, 0, 1, 2, \\dots \\text{ döngüsü kur.} \\quad \\text{3) Sadece } x \\in [0, 2\\pi) \\text{ olanları sakla.}$$</div>
<div class="formula-sub">Sinüs ve kosinüs denklemleri için genellikle periyot başına 2 çözüm bulursun. Tanjant için $[0, 2\\pi)$ içinde 2 çözüm vardır çünkü $2\\pi / \\pi = 2$ periyot sığar.</div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>$[0, 2\\pi)$ içinde $\\sin x = -\\tfrac{\\sqrt{2}}{2}$ olan tüm $x$'leri listele.</strong><br><br>$\\alpha = \\arcsin(-\\sqrt{2}/2) = -\\pi/4$. Genel çözüm:<br>$x = -\\pi/4 + 2k\\pi$ veya $x = \\pi - (-\\pi/4) + 2k\\pi = 5\\pi/4 + 2k\\pi$.<br><br>Birinci ailede $k = 0$: $-\\pi/4 \\notin [0, 2\\pi)$. $k = 1$: $-\\pi/4 + 2\\pi = 7\\pi/4$. ✓<br>İkinci ailede $k = 0$: $5\\pi/4 \\in [0, 2\\pi)$. ✓<br><br><strong>Cevap:</strong> $x = 5\\pi/4$ ve $x = 7\\pi/4$.</div></div>

<div class="calc-example"><div class="example-label">DERECE-MODU ÖRNEĞİ</div><div class="example-body"><strong>$[0^\\circ, 360^\\circ)$ içinde $\\cos \\theta = \\tfrac{\\sqrt{3}}{2}$ olan tüm $\\theta$'ları listele.</strong><br><br>$\\alpha = 30^\\circ$. Çözümler: $\\theta = \\pm 30^\\circ + 360^\\circ k$. $[0^\\circ, 360^\\circ)$ içinde: $\\theta = 30^\\circ$ ve $\\theta = -30^\\circ + 360^\\circ = 330^\\circ$.</div></div>

<!-- ============================================================
     BÖLÜM 7
     ============================================================ -->
<h2 class="l-title">7. Denklem Tipleri: Kuadratik Form & Çarpanlama</h2>

<p class="l-text">Daha karmaşık trig denklemleri çoğunlukla $\\sin x$, $\\cos x$ ya da $\\tan x$ cinsinden <strong>kuadratik</strong> denklemlere indirgenir. Numara temiz bir değişken değiştirmedir.</p>

<div class="calc-formula">
<div class="formula-label">SİNÜS CİNSİNDEN KUADRATİK KALIBI</div>
<div class="formula-main">$$a \\sin^2 x + b \\sin x + c = 0 \\quad \\xrightarrow{u = \\sin x} \\quad a u^2 + b u + c = 0$$</div>
<div class="formula-sub">Kuadratiği $u$ için çöz, sonra geri yerleştirip temel tarifle $\\sin x = u_1$ veya $\\sin x = u_2$'yi çöz.</div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Çöz:</strong> $2\\sin^2 x - \\sin x - 1 = 0$.<br><br>$u = \\sin x$ olsun. O zaman $2u^2 - u - 1 = 0$. Çarpanlara ayır: $(2u + 1)(u - 1) = 0$, yani $u = -\\tfrac{1}{2}$ veya $u = 1$.<br><br><strong>Durum A:</strong> $\\sin x = 1 \\Rightarrow x = \\pi/2 + 2k\\pi$.<br><strong>Durum B:</strong> $\\sin x = -\\tfrac{1}{2} \\Rightarrow x = -\\pi/6 + 2k\\pi$ veya $x = 7\\pi/6 + 2k\\pi$.<br><br>Bu üç aileyi birleştirince tam çözüm kümesini elde edersin.</div></div>

<div class="calc-example"><div class="example-label">ÇARPANLAMA ÖRNEĞİ</div><div class="example-body"><strong>Çöz:</strong> $\\sin x \\cos x = 0$.<br><br>Çarpım sıfırdır ancak ve ancak çarpanlardan biri sıfırdır. Yani $\\sin x = 0$ <em>veya</em> $\\cos x = 0$.<br>$\\sin x = 0 \\Rightarrow x = k\\pi$.<br>$\\cos x = 0 \\Rightarrow x = \\pi/2 + k\\pi$.<br>Birleşik: $x = k \\cdot \\pi/2$, $k \\in \\mathbb{Z}$.</div></div>

<div class="think-box"><div class="think-label">YABANCI KÖKLERE DİKKAT</div><div class="think-body">İki tarafın karesini aldığında, sıfır olabilecek bir ifadeyle çarptığında ya da $\\sin x$ / $\\cos x$'e böldüğünde, sahte çözümler eklemiş ya da gerçek çözümleri kaybetmiş olabilirsin. Aday çözümleri her zaman <em>orijinal</em> denklemde kontrol et.</div></div>

<!-- ============================================================
     BÖLÜM 8
     ============================================================ -->
<h2 class="l-title">8. Birden Fazla Trig Fonksiyonu İçeren Denklemler</h2>

<p class="l-text">Bir denklemde hem $\\sin x$ hem $\\cos x$ varsa, faydalı ilk hamle özdeşliklerle yalnızca <em>tek bir</em> trig fonksiyonu bırakmaktır. İki günlük araç şunlardır:</p>

<div class="calc-formula">
<div class="formula-label">İKİ KURTARICI ÖZDEŞLİK</div>
<div class="formula-main">$$\\sin^2 x + \\cos^2 x = 1, \\qquad \\sin(2x) = 2 \\sin x \\cos x$$</div>
<div class="formula-sub">Birincisi $\\sin^2 x$ yerine $1 - \\cos^2 x$ (ya da tersi) yazmana izin verir. İkincisi $\\sin x \\cos x$ çarpımını iki katlı açıdaki tek bir $\\sin$'e indirir.</div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Çöz:</strong> $\\sin x = \\cos x$.<br><br>İki tarafı $\\cos x$'e böl ($\\cos x = 0$ durumu ayrıca incelenir; gerçekten $\\sin x = 0$ ile $\\cos x = 0$ aynı anda olmaz).<br>$$\\tan x = 1 \\implies x = \\pi/4 + k\\pi.$$<br>$[0, 2\\pi)$ içinde: $x = \\pi/4$ ve $x = 5\\pi/4$.</div></div>

<div class="calc-example"><div class="example-label">ÇİFT AÇI ÖRNEĞİ</div><div class="example-body"><strong>$[0, 2\\pi)$'de çöz:</strong> $2 \\sin x \\cos x = 1$.<br><br>$2 \\sin x \\cos x = \\sin(2x)$ özdeşliğini kullan. Denklem $\\sin(2x) = 1$ olur.<br>Referans: $2x = \\pi/2 + 2k\\pi$, yani $x = \\pi/4 + k\\pi$.<br>$[0, 2\\pi)$ içinde: $x = \\pi/4$ ve $x = 5\\pi/4$.</div></div>

<div id="plot-double-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xs=[];for(var i=0;i<=720;i++){xs.push(i*Math.PI/180);}
  var ys=xs.map(function(x){return Math.sin(2*x);});
  var line={x:xs,y:ys,mode:"lines",name:"y = sin 2x",line:{color:"#a855f7",width:2.5}};
  var hor={x:[0, 2*Math.PI],y:[1,1],mode:"lines",name:"y = 1",line:{color:"#f87171",width:1.5,dash:"dash"}};
  var hits={x:[Math.PI/4, 5*Math.PI/4],y:[1,1],mode:"markers+text",name:"çözümler",text:["π/4","5π/4"],textposition:"top center",marker:{size:11,color:"#4de87a"},textfont:{color:"#4de87a",size:11}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (radyan)",range:[0, 2*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"sin 2x",range:[-1.3,1.3]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-double-tr",[line,hor,hits],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $y = \\sin(2x)$ eğrisinin periyodu $\\pi$'dir — sıradan sinüsten iki kat hızlıdır. $y = 1$ yatay doğrusu, $[0, 2\\pi)$ içinde tepeleri $x = \\pi/4$ ve $x = 5\\pi/4$ noktalarında değer; cebirsel çözümle tam olarak örtüşür.</div></div>

<!-- ============================================================
     BÖLÜM 9
     ============================================================ -->
<h2 class="l-title">9. Klasik Alıştırmalar</h2>

<p class="l-text">Her birini önce kağıt üzerinde çözüp sonra çözümünü oku. Aksi belirtilmedikçe tüm açılar radyandır.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body">$[0, 2\\pi)$'de çöz: $\\sin x = \\tfrac{\\sqrt{2}}{2}$.<br><br><strong>Çözüm.</strong> $\\alpha = \\pi/4$. İki çözüm: $x = \\pi/4$ ve $x = \\pi - \\pi/4 = 3\\pi/4$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body">$[0, 2\\pi)$'de çöz: $\\cos x = 0$.<br><br><strong>Çözüm.</strong> $\\alpha = \\pi/2$. Çözümler: $x = \\pi/2$ ve $x = -\\pi/2 + 2\\pi = 3\\pi/2$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body">$[0, 2\\pi)$'de çöz: $\\tan x = -1$.<br><br><strong>Çözüm.</strong> $\\alpha = -\\pi/4$. Genel: $x = -\\pi/4 + k\\pi$. $[0, 2\\pi)$'de: $k = 1 \\Rightarrow 3\\pi/4$; $k = 2 \\Rightarrow 7\\pi/4$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body">Tüm $x$ için çöz: $2 \\cos x - \\sqrt{3} = 0$.<br><br><strong>Çözüm.</strong> $\\cos x = \\sqrt{3}/2$, yani $\\alpha = \\pi/6$. Genel: $x = \\pm \\pi/6 + 2k\\pi$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body">Çöz: $2 \\sin^2 x + 3 \\sin x + 1 = 0$.<br><br><strong>Çözüm.</strong> $u = \\sin x$ olsun. O zaman $2u^2 + 3u + 1 = (2u + 1)(u + 1) = 0$, yani $u = -1/2$ veya $u = -1$.<br>$\\sin x = -1/2 \\Rightarrow x = -\\pi/6 + 2k\\pi$ veya $x = 7\\pi/6 + 2k\\pi$.<br>$\\sin x = -1 \\Rightarrow x = -\\pi/2 + 2k\\pi$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6</div><div class="example-body">Çöz: $\\cos^2 x - \\sin^2 x = 1/2$.<br><br><strong>Çözüm.</strong> Çift açı özdeşliği $\\cos^2 x - \\sin^2 x = \\cos(2x)$. Denklem $\\cos(2x) = 1/2$ olur, yani $2x = \\pm \\pi/3 + 2k\\pi$, dolayısıyla $x = \\pm \\pi/6 + k\\pi$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7</div><div class="example-body">$[0, 2\\pi)$'de $\\tan$ kullanmadan çöz: $\\sin x = \\cos x$.<br><br><strong>Çözüm.</strong> İki tarafın karesini al: $\\sin^2 x = \\cos^2 x$, yani $1 - \\cos^2 x = \\cos^2 x$, buradan $\\cos^2 x = 1/2$ ve $\\cos x = \\pm 1/\\sqrt{2}$. Adaylar: $\\pi/4, 3\\pi/4, 5\\pi/4, 7\\pi/4$. Orijinalde kontrol: $\\pi/4$ ✓, $3\\pi/4$ ✗ ($\\sin = +\\sqrt{2}/2$, $\\cos = -\\sqrt{2}/2$), $5\\pi/4$ ✓, $7\\pi/4$ ✗. Kare alma iki yabancı kök ekledi — bu yüzden kontrol şart.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8</div><div class="example-body">$[0, 2\\pi)$'de çöz: $\\sin(3x) = 0$.<br><br><strong>Çözüm.</strong> $3x = k\\pi$, yani $x = k\\pi/3$. $[0, 2\\pi)$'de altı çözüm: $x = 0, \\pi/3, 2\\pi/3, \\pi, 4\\pi/3, 5\\pi/3$.</div></div>

<div class="think-box"><div class="think-label">KAPANIŞ DÜŞÜNCESİ</div><div class="think-body">Trig denklemleri, dikkatli kayıt tutmanın bedelini ödediği konulardandır. Genel çözümü bir kez yaz, sonra sorunun istediği aralığa indir. Aday çözümleri orijinal denklemde kontrol et — kare alma ya da bölme sonrası bulunan bir cevaba doğrulamadan asla güvenme.</div></div>

<p class="l-text"><em>Ders 6 sonu.</em> Bir sonraki ders denklem çözmekten trig fonksiyonu içeren <em>eşitsizlik</em> çözmeye geçer — doğal bir devam.</p>
`

};
