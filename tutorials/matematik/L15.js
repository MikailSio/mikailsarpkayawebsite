/* ============================================================
   tutorials/matematik/L15.js
   Lise Matematik · Ders 15: Süreklilik ve Süreksizlik
   Bilingual EN + TR · KaTeX + Plotly · NO Python, NO ML
   ============================================================ */
window.LISE_MAT_L15 = {

/* ========================================================================
   ENGLISH VERSION
   ======================================================================== */
en: `
<p class="l-text"><strong>Continuity</strong> is the mathematical word for what your eye sees when a graph has no gaps, no holes, no jumps and no sudden flights to infinity. Lesson 14 taught us when a function shoots off to infinity; this lesson asks the opposite question — at which points is the function so well behaved that you could draw its graph there without lifting your pencil from the paper? Surprisingly, this informal pencil-test can be turned into a precise three-line definition using the limit ideas you already know.</p>

<p class="l-text">In Turkish high school, continuity sits at the end of Grade 11. You will see it again at the start of derivatives (every differentiable function is continuous) and at the start of integrals (continuous functions can always be integrated on a closed interval). Mastering the three-step continuity check now will pay off for the next two years of mathematics.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the three conditions that make a function continuous at a point.</li>
<li>Distinguish the four types of discontinuity: removable, jump, infinite, and oscillating.</li>
<li>Read off the discontinuity type from the graph or from the one-sided limits.</li>
<li>Use the algebra of continuity — sums, products, quotients, compositions of continuous functions stay continuous.</li>
<li>Find the parameter $a$ that makes a piecewise function continuous at its joining point.</li>
<li>Recognise when a function is continuous on a closed interval $[a, b]$ — the prelude to the Intermediate Value Theorem.</li>
</ul>
</div>

<!-- ============================================================
     SECTION 1
     ============================================================ -->
<h2 class="l-title">1. Intuition: Drawing Without Lifting the Pencil</h2>

<p class="l-text">Take a sheet of paper, pick up a pencil, and start drawing the graph of $y = x^2$ from left to right. Your pencil never leaves the paper. The graph is a smooth, single, unbroken curve. We call such a function <strong>continuous</strong>. Now try the same with the integer-part function $y = \\lfloor x \\rfloor$: every time $x$ crosses an integer your pencil has to jump up by one unit. The graph is made of disconnected pieces; we call this function <strong>discontinuous</strong> at every integer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Continuous function</div><div class="card-body">No breaks. Small changes in $x$ produce small changes in $f(x)$. The graph is a single unbroken curve over the interval where the function is continuous.</div></div>
<div class="calc-card"><div class="card-title">Discontinuous at $x = a$</div><div class="card-body">At the single point $x = a$ the graph is broken — either by a hole, a jump, a vertical asymptote, or rapid oscillation. The function may still be perfectly continuous everywhere else.</div></div>
<div class="calc-card"><div class="card-title">Local property</div><div class="card-body">Continuity is checked one point at a time. A function can be continuous at $x = 1$ but discontinuous at $x = 2$. We always say <em>continuous at $x = a$</em> — never just "continuous" without context.</div></div>
</div>

<div id="plot-continuous-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xs=[];var ys=[];for(var i=-30;i<=30;i++){var x=i/10;xs.push(x);ys.push(x*x*x*0.1 - x + 1);}
  var curve={x:xs,y:ys,mode:"lines",name:"f(x) = 0.1x³ - x + 1",line:{color:"#c8a96e",width:2.5}};
  var pencil={x:[-3,-2,-1,0,1,2,3],y:[-2.7+3+1,-0.8+2+1,-0.1+1+1,1,0.1-1+1,0.8-2+1,2.7-3+1].map(function(){return 0;}),mode:"markers",name:"pencil never lifts",marker:{size:1,color:"rgba(0,0,0,0)"},showlegend:false};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-3.2,3.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)",range:[-3.5,5]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-continuous-en",[curve],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The polynomial $f(x) = 0.1x^3 - x + 1$ is continuous everywhere. The whole curve is a single unbroken arc — you can trace it from left to right with one pencil stroke. Polynomials are the simplest example of functions that are continuous on the entire real line.</div></div>

<div class="think-box"><div class="think-label">PENCIL TEST</div><div class="think-body">The pencil test is a useful intuition, not a proof. Some functions look continuous but have very subtle discontinuities (like $\\sin(1/x)$ near zero), and some functions have a vertical asymptote that the pencil intuition handles poorly. The formal three-condition definition in Section 2 is the real test.</div></div>

<!-- ============================================================
     SECTION 2
     ============================================================ -->
<h2 class="l-title">2. The Three Conditions for Continuity at a Point</h2>

<p class="l-text">A function $f$ is <strong>continuous at the point $x = a$</strong> if and only if all three of the following conditions hold:</p>

<div class="calc-formula">
<div class="formula-label">CONTINUITY AT $x = a$</div>
<div class="formula-main">$$\\text{(C1)} \\;\\; f(a) \\text{ is defined.} \\qquad \\text{(C2)} \\;\\; \\lim_{x \\to a} f(x) \\text{ exists.} \\qquad \\text{(C3)} \\;\\; \\lim_{x \\to a} f(x) = f(a).$$</div>
<div class="formula-sub">All three conditions must hold simultaneously. If <em>any one</em> of them fails, $f$ is discontinuous at $a$.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">C1: $f(a)$ defined</div><div class="card-body">The function must produce a real number when you plug in $x = a$. If $a$ is not in the domain (for example $a$ makes a denominator zero, or a square-root negative), C1 fails.</div></div>
<div class="calc-card"><div class="card-title">C2: limit exists</div><div class="card-body">Both one-sided limits at $a$ exist and equal each other. If the left limit and the right limit disagree, the two-sided limit does not exist and C2 fails.</div></div>
<div class="calc-card"><div class="card-title">C3: values agree</div><div class="card-body">The limit value and the function value at $a$ are <em>the same number</em>. If the limit exists and $f(a)$ is defined but they happen to be different numbers, C3 fails.</div></div>
</div>

<p class="l-text"><strong>How to use the three conditions.</strong> Given a function and a point, check the conditions in order. The first one that fails tells you exactly <em>why</em> the function is discontinuous and what type of discontinuity you are dealing with (Section 3 onwards).</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 (CONTINUOUS)</div><div class="example-body"><strong>Is $f(x) = x^2 + 3x - 1$ continuous at $x = 2$?</strong><br><br>C1: $f(2) = 4 + 6 - 1 = 9$ — defined. ✓<br>C2: $\\lim_{x \\to 2} (x^2 + 3x - 1) = 9$ — exists (polynomials are well-behaved). ✓<br>C3: limit $= 9 = f(2)$. ✓<br><br>All three conditions hold, so $f$ is <strong>continuous at $x = 2$</strong>.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 (FAILS C1)</div><div class="example-body"><strong>Is $f(x) = \\dfrac{1}{x - 3}$ continuous at $x = 3$?</strong><br><br>C1: $f(3) = 1/0$ — <em>not defined</em>. ✗<br><br>C1 already fails, so $f$ is <strong>discontinuous at $x = 3$</strong>. (It is in fact an <em>infinite</em> discontinuity — see Section 5.)</div></div>

<!-- ============================================================
     SECTION 3
     ============================================================ -->
<h2 class="l-title">3. Discontinuity Type 1: Removable (the "Hole")</h2>

<p class="l-text">A <strong>removable discontinuity</strong> at $x = a$ happens when the two-sided limit at $a$ exists and is some finite number $L$, but either $f(a)$ is not defined or $f(a) \\neq L$. The graph has a single missing point (a hole) at $x = a$, or a single misplaced point sitting off the curve. We call it <em>removable</em> because we could redefine $f(a) := L$ and the function would become continuous at $a$ — the hole is "filled in".</p>

<div class="calc-formula">
<div class="formula-label">REMOVABLE DISCONTINUITY</div>
<div class="formula-main">$$\\lim_{x \\to a^-} f(x) \\;=\\; \\lim_{x \\to a^+} f(x) \\;=\\; L, \\quad \\text{but} \\quad f(a) \\neq L \\;\\text{or}\\; f(a) \\text{ undefined.}$$</div>
<div class="formula-sub">A redefinition $f(a) := L$ would patch the function and make it continuous.</div>
</div>

<div id="plot-removable-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xL=[];var yL=[];for(var i=-30;i<20;i++){var x=i/10;xL.push(x);yL.push((x*x-4)/(x-2));}
  var xR=[];var yR=[];for(var i=21;i<=50;i++){var x=i/10;xR.push(x);yR.push((x*x-4)/(x-2));}
  var t1={x:xL,y:yL,mode:"lines",name:"f(x) = (x²-4)/(x-2)",line:{color:"#c8a96e",width:2.5}};
  var t2={x:xR,y:yR,mode:"lines",name:"right of 2",line:{color:"#c8a96e",width:2.5},showlegend:false};
  var hole={x:[2],y:[4],mode:"markers",name:"hole at x = 2",marker:{size:14,color:"rgba(0,0,0,0)",line:{color:"#f87171",width:2.5}}};
  var ann=[{x:2,y:4,text:"limit = 4 but f(2) undefined",showarrow:true,arrowhead:2,ax:80,ay:-30,font:{color:"#f87171",size:13}}];
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-3,5.5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)",range:[-2,8]},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-removable-en",[t1,t2,hole],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> $f(x) = (x^2 - 4)/(x - 2)$ simplifies to $x + 2$ for every $x \\neq 2$, so its graph is the line $y = x + 2$ except for a single missing point — a hole — at $(2, 4)$. The two-sided limit at $x = 2$ exists (it is 4), but $f(2)$ itself is undefined. Removable.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Classify the discontinuity of $f(x) = \\dfrac{x^2 - 9}{x - 3}$ at $x = 3$.</strong><br><br>C1: $f(3) = 0/0$ — undefined. ✗ So $f$ is discontinuous at 3.<br><br>To classify, factor: $(x^2 - 9)/(x - 3) = (x-3)(x+3)/(x-3) = x + 3$ for $x \\neq 3$. The limit $\\lim_{x \\to 3} (x + 3) = 6$ exists.<br><br>Two-sided limit exists ($L = 6$), but $f(3)$ undefined. This is a <strong>removable</strong> discontinuity. Define $f(3) := 6$ and the function becomes continuous everywhere.</div></div>

<div class="think-box"><div class="think-label">PATTERN</div><div class="think-body">Whenever you see a rational function with a factor cancelling between numerator and denominator, expect a removable discontinuity at the cancelled root. If the factor does not cancel, the discontinuity is usually infinite (Section 5).</div></div>

<!-- ============================================================
     SECTION 4
     ============================================================ -->
<h2 class="l-title">4. Discontinuity Type 2: Jump</h2>

<p class="l-text">A <strong>jump discontinuity</strong> at $x = a$ happens when the left-hand limit and the right-hand limit both exist as finite numbers, but they are different. The graph jumps vertically by a finite amount at $x = a$. There is no single value of $f(a)$ that could fix the discontinuity — whatever you set $f(a)$ to, only one of the two sides can "agree" with it.</p>

<div class="calc-formula">
<div class="formula-label">JUMP DISCONTINUITY</div>
<div class="formula-main">$$\\lim_{x \\to a^-} f(x) = L_1, \\;\\; \\lim_{x \\to a^+} f(x) = L_2, \\;\\; L_1 \\neq L_2 \\quad \\text{(both finite)}.$$</div>
<div class="formula-sub">The "jump size" is $|L_2 - L_1|$. C2 fails because the two-sided limit does not exist.</div>
</div>

<p class="l-text">Jump discontinuities show up naturally in <em>piecewise functions</em> — functions defined by different formulas on different intervals. A real-world example: the cost of a taxi ride as a function of distance often has a small jump at the boundary between "starting fee only" and "starting fee plus per-kilometre rate".</p>

<div id="plot-jump-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xL=[];var yL=[];for(var i=-30;i<20;i++){var x=i/10;xL.push(x);yL.push(x+1);}
  var xR=[];var yR=[];for(var i=20;i<=50;i++){var x=i/10;xR.push(x);yR.push(x*x-1);}
  var t1={x:xL,y:yL,mode:"lines",name:"f(x) = x+1 for x < 2",line:{color:"#c8a96e",width:2.5}};
  var t2={x:xR,y:yR,mode:"lines",name:"f(x) = x²-1 for x ≥ 2",line:{color:"#06b6d4",width:2.5}};
  var openDot={x:[2],y:[3],mode:"markers",name:"left limit (open)",marker:{size:13,color:"rgba(0,0,0,0)",line:{color:"#c8a96e",width:2.5}}};
  var closedDot={x:[2],y:[3],mode:"markers",name:"f(2) = 3 (closed)",marker:{size:11,color:"#06b6d4"}};
  var ann=[{x:2,y:1.8,text:"jump size = 2",showarrow:false,font:{color:"#f87171",size:13}}];
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-3,5.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)",range:[-2.5,8]},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.25}};
  Plotly.newPlot("plot-jump-en",[t1,t2,openDot,closedDot],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> A piecewise function with two branches that meet at $x = 2$. The left branch and the right branch reach different heights at the joining point, producing a vertical gap — a jump. Whenever the left and right one-sided limits give two different finite numbers, the function has a jump discontinuity at that point and no choice of $f(2)$ can repair it.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Classify the discontinuity at $x = 0$ of</strong><br>$$f(x) = \\begin{cases} x - 1 & x < 0 \\\\ x + 1 & x \\geq 0 \\end{cases}$$<br><br>Left limit: $\\lim_{x \\to 0^-} (x - 1) = -1$.<br>Right limit: $\\lim_{x \\to 0^+} (x + 1) = +1$.<br><br>Both one-sided limits are finite, but $-1 \\neq +1$. This is a <strong>jump discontinuity</strong> with jump size $|1 - (-1)| = 2$. No reassignment of $f(0)$ can fix it.</div></div>

<div class="calc-example"><div class="example-label">SIGN FUNCTION</div><div class="example-body">The <strong>sign function</strong> $\\operatorname{sgn}(x) = -1$ for $x < 0$, $\\operatorname{sgn}(0) = 0$, $\\operatorname{sgn}(x) = +1$ for $x > 0$ has a jump discontinuity at $x = 0$ of size 2 — the canonical example. Similarly, the <strong>floor function</strong> $\\lfloor x \\rfloor$ has a jump discontinuity of size 1 at every integer.</div></div>

<!-- ============================================================
     SECTION 5
     ============================================================ -->
<h2 class="l-title">5. Discontinuity Type 3: Infinite (Vertical Asymptote)</h2>

<p class="l-text">An <strong>infinite discontinuity</strong> at $x = a$ happens when at least one of the one-sided limits is $+\\infty$ or $-\\infty$. The graph shoots off the visible window as $x$ approaches $a$, and the line $x = a$ is a vertical asymptote (Lesson 14). The function does not have a finite value to "fill in" — the two-sided limit fails because it is unbounded, not just disagreeing.</p>

<div class="calc-formula">
<div class="formula-label">INFINITE DISCONTINUITY</div>
<div class="formula-main">$$\\lim_{x \\to a^-} f(x) = \\pm\\infty \\quad \\text{or} \\quad \\lim_{x \\to a^+} f(x) = \\pm\\infty.$$</div>
<div class="formula-sub">At least one side blows up. The graph has a vertical asymptote at $x = a$.</div>
</div>

<div id="plot-infinite-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xL=[];var yL=[];for(var i=-50;i<-2;i++){var x=i/10;xL.push(x);yL.push(1/x);}
  var xR=[];var yR=[];for(var i=2;i<=50;i++){var x=i/10;xR.push(x);yR.push(1/x);}
  var t1={x:xL,y:yL,mode:"lines",name:"f(x) = 1/x (x < 0)",line:{color:"#c8a96e",width:2.5}};
  var t2={x:xR,y:yR,mode:"lines",name:"f(x) = 1/x (x > 0)",line:{color:"#c8a96e",width:2.5},showlegend:false};
  var asym={x:[0,0],y:[-10,10],mode:"lines",name:"asymptote x = 0",line:{color:"#f87171",width:1.5,dash:"dash"}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-5,5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)",range:[-6,6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-infinite-en",[t1,t2,asym],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> $f(x) = 1/x$ has an infinite discontinuity at $x = 0$: the left-hand limit is $-\\infty$ and the right-hand limit is $+\\infty$. The dashed vertical line $x = 0$ is the asymptote. Neither side reaches a finite value, and no value of $f(0)$ can patch the gap.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Classify the discontinuity of $f(x) = \\dfrac{1}{(x - 2)^2}$ at $x = 2$.</strong><br><br>C1: $f(2) = 1/0$ — undefined. ✗<br>One-sided limits: $\\lim_{x \\to 2^-} \\dfrac{1}{(x-2)^2} = +\\infty$ and $\\lim_{x \\to 2^+} \\dfrac{1}{(x-2)^2} = +\\infty$.<br><br>Both sides go to $+\\infty$ (because the square is always positive). This is an <strong>infinite discontinuity</strong>; the line $x = 2$ is a vertical asymptote.</div></div>

<!-- ============================================================
     SECTION 6
     ============================================================ -->
<h2 class="l-title">6. Discontinuity Type 4: Oscillating</h2>

<p class="l-text">An <strong>oscillating discontinuity</strong> at $x = a$ happens when as $x$ approaches $a$ the function values do not approach any single number — instead they keep wobbling through a range of values without settling. The textbook example is $f(x) = \\sin(1/x)$ at $x = 0$: as $x \\to 0$, $1/x \\to \\pm\\infty$, and $\\sin(1/x)$ keeps cycling through all values between $-1$ and $+1$ infinitely many times. No one-sided limit exists.</p>

<div class="calc-formula">
<div class="formula-label">OSCILLATING DISCONTINUITY</div>
<div class="formula-main">$$\\lim_{x \\to a^-} f(x) \\text{ and/or } \\lim_{x \\to a^+} f(x) \\text{ does not exist (oscillation).}$$</div>
<div class="formula-sub">The function values do not approach any single number or even $\\pm\\infty$ — they oscillate without limit.</div>
</div>

<p class="l-text">Oscillating discontinuities are less common in standard high-school problems than the first three types, but they appear in advanced examples and serve as a reminder that "the limit does not exist" can happen for reasons other than left ≠ right or blow-up to infinity.</p>

<div class="calc-example"><div class="example-label">CLASSIC EXAMPLE</div><div class="example-body">$f(x) = \\sin(1/x)$ has an oscillating discontinuity at $x = 0$. Pick the sequence $x_n = 1/(n\\pi)$ — then $\\sin(1/x_n) = \\sin(n\\pi) = 0$. Pick instead $x_n = 1/((2n + 1/2)\\pi)$ — then $\\sin(1/x_n) = 1$. Two different sequences approaching 0 give different limit values for $f$, so $\\lim_{x \\to 0} \\sin(1/x)$ does not exist.</div></div>

<!-- ============================================================
     SECTION 7
     ============================================================ -->
<h2 class="l-title">7. Algebra of Continuous Functions</h2>

<p class="l-text">Once you know that two functions $f$ and $g$ are continuous at $x = a$, you can build new continuous functions from them without rechecking the three-condition definition. The following rules are an immediate consequence of the limit laws (Lesson 11):</p>

<div class="calc-formula">
<div class="formula-label">CONTINUITY-PRESERVING OPERATIONS</div>
<div class="formula-main">$$\\text{If } f, g \\text{ are continuous at } a, \\text{ then so are } \\;\\; f + g, \\;\\; f - g, \\;\\; f \\cdot g, \\;\\; cf, \\;\\; \\dfrac{f}{g} \\;(\\text{if } g(a) \\neq 0).$$</div>
<div class="formula-sub">Composition: if $f$ is continuous at $a$ and $g$ is continuous at $f(a)$, then $g \\circ f$ is continuous at $a$.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Polynomials</div><div class="card-body">Every polynomial $p(x) = a_n x^n + \\dots + a_0$ is built from the constant function and $x$ — both continuous everywhere — using addition and multiplication. So polynomials are continuous on the entire real line $\\mathbb{R}$.</div></div>
<div class="calc-card"><div class="card-title">Rational functions</div><div class="card-body">A rational $p(x)/q(x)$ is continuous everywhere $q(x) \\neq 0$. The roots of the denominator are the only candidates for discontinuity.</div></div>
<div class="calc-card"><div class="card-title">Trig, exp, log</div><div class="card-body">$\\sin x$ and $\\cos x$ are continuous on all of $\\mathbb{R}$. $\\tan x$ is continuous wherever $\\cos x \\neq 0$. $e^x$ is continuous everywhere; $\\ln x$ is continuous on $(0, \\infty)$.</div></div>
<div class="calc-card"><div class="card-title">Compositions</div><div class="card-body">$\\sin(x^2 + 1)$, $\\sqrt{x^2 + 1}$, $e^{\\cos x}$ — all continuous on their natural domains, by the composition rule.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Where is $f(x) = \\dfrac{x^2 + 1}{x^2 - 5x + 6}$ continuous?</strong><br><br>Numerator $x^2 + 1$: polynomial, continuous everywhere.<br>Denominator $x^2 - 5x + 6 = (x-2)(x-3)$: zero at $x = 2$ and $x = 3$.<br><br>By the quotient rule for continuity, $f$ is continuous everywhere except $x = 2$ and $x = 3$. At those two points the denominator is zero and the numerator is not, so we have infinite discontinuities (vertical asymptotes).</div></div>

<!-- ============================================================
     SECTION 8
     ============================================================ -->
<h2 class="l-title">8. Continuity on an Interval & a Look Ahead</h2>

<p class="l-text">A function is <strong>continuous on the open interval $(a, b)$</strong> if it is continuous at every point inside $(a, b)$. It is <strong>continuous on the closed interval $[a, b]$</strong> if, in addition, the one-sided limits at the endpoints match the values $f(a)$ and $f(b)$:</p>

<div class="calc-formula">
<div class="formula-label">CONTINUITY ON $[a, b]$</div>
<div class="formula-main">$$f \\text{ continuous on } (a, b), \\;\\; \\lim_{x \\to a^+} f(x) = f(a), \\;\\; \\lim_{x \\to b^-} f(x) = f(b).$$</div>
<div class="formula-sub">At the endpoints we only need a one-sided match (the function does not exist beyond the interval).</div>
</div>

<p class="l-text">Continuity on a closed interval unlocks two of the most powerful theorems in elementary analysis:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Intermediate Value Theorem (IVT)</div><div class="card-body">If $f$ is continuous on $[a, b]$ and $N$ is any number strictly between $f(a)$ and $f(b)$, then there is some $c \\in (a, b)$ with $f(c) = N$. In particular, sign changes guarantee a root.</div></div>
<div class="calc-card"><div class="card-title">Extreme Value Theorem (EVT)</div><div class="card-body">If $f$ is continuous on $[a, b]$, then $f$ attains both a maximum and a minimum value somewhere on $[a, b]$. The function cannot "escape to infinity" on a closed bounded interval.</div></div>
<div class="calc-card"><div class="card-title">Next lesson</div><div class="card-body">Lesson 16 takes a deeper look at the Intermediate Value Theorem, proves the existence of roots, and uses it to build a numerical root-finding procedure (the bisection method).</div></div>
</div>

<!-- ============================================================
     SECTION 9
     ============================================================ -->
<h2 class="l-title">9. Piecewise Functions: Finding the Parameter that Makes f Continuous</h2>

<p class="l-text">A very common high-school exam question asks: <em>for which value of the parameter $a$ is the following piecewise function continuous at its joining point?</em> The recipe is simple — use the third continuity condition at the joining point: set the limit from the left equal to the limit from the right (and to the function value).</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>For which value of $a$ is the function</strong><br>$$f(x) = \\begin{cases} x^2 + 1 & x \\leq 2 \\\\ ax - 3 & x > 2 \\end{cases}$$<br><strong>continuous at $x = 2$?</strong><br><br>Left limit: $\\lim_{x \\to 2^-} (x^2 + 1) = 5$. Also $f(2) = 5$ (using the first piece).<br>Right limit: $\\lim_{x \\to 2^+} (ax - 3) = 2a - 3$.<br><br>Set them equal: $2a - 3 = 5$, so $2a = 8$, hence $a = 4$.<br><br>At $a = 4$ the function becomes continuous; for any other $a$ there is a jump discontinuity at 2.</div></div>

<div class="calc-example"><div class="example-label">TWO-PARAMETER EXAMPLE</div><div class="example-body"><strong>Find $a$ and $b$ that make</strong><br>$$g(x) = \\begin{cases} x + 1 & x < 1 \\\\ ax + b & 1 \\leq x \\leq 3 \\\\ x^2 - 2 & x > 3 \\end{cases}$$<br><strong>continuous on $\\mathbb{R}$.</strong><br><br>At $x = 1$: left limit $= 2$, right limit $= a + b$. Set $a + b = 2$.<br>At $x = 3$: left limit $= 3a + b$, right limit $= 7$. Set $3a + b = 7$.<br><br>Subtract: $2a = 5$, so $a = 5/2$ and $b = 2 - 5/2 = -1/2$.<br><br>For $a = 5/2, b = -1/2$ the function is continuous everywhere.</div></div>

<div class="think-box"><div class="think-label">CHECKLIST</div><div class="think-body">When solving a parameter problem, always: (1) compute the one-sided limits at the joining point using the formulas on each side; (2) set them equal; (3) solve for the parameter. If there are two joining points, you get two equations — a small linear system.</div></div>

<!-- ============================================================
     SECTION 10
     ============================================================ -->
<h2 class="l-title">10. Classical Exercises</h2>

<p class="l-text">Eight exercises ranging from quick identification of the discontinuity type to parameter problems. Solve each one with pencil and paper before reading the worked solution.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body"><strong>Classify the discontinuity of $f(x) = \\dfrac{x^2 - 1}{x - 1}$ at $x = 1$.</strong><br><br><strong>Solution.</strong> Factor: $(x^2 - 1)/(x - 1) = (x-1)(x+1)/(x-1) = x + 1$ for $x \\neq 1$. Limit at 1 is $2$, but $f(1)$ is $0/0$ undefined. Two-sided limit exists, $f(1)$ undefined → <strong>removable</strong>. Redefine $f(1) := 2$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body"><strong>Classify the discontinuity of $f(x) = \\dfrac{|x|}{x}$ at $x = 0$.</strong><br><br><strong>Solution.</strong> For $x > 0$, $|x|/x = 1$; for $x < 0$, $|x|/x = -1$; at $x = 0$, undefined. Left limit $= -1$, right limit $= +1$. Both finite but different → <strong>jump</strong>, size 2.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body"><strong>Classify the discontinuity of $f(x) = \\dfrac{1}{x - 4}$ at $x = 4$.</strong><br><br><strong>Solution.</strong> $f(4) = 1/0$ undefined. Left limit at 4: numerator $1$, denominator approaches $0^-$, so limit is $-\\infty$. Right limit: $+\\infty$. <strong>Infinite</strong> discontinuity; vertical asymptote $x = 4$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body"><strong>For which $a$ is $f(x) = \\begin{cases} 3x + 1 & x < 1 \\\\ x^2 + a & x \\geq 1 \\end{cases}$ continuous at $x = 1$?</strong><br><br><strong>Solution.</strong> Left limit $= 4$, right limit $= 1 + a$. Set $1 + a = 4$, hence $a = 3$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body"><strong>Is $f(x) = \\dfrac{\\sin x}{x}$ continuous at $x = 0$ (with $f(0)$ undefined)? What discontinuity type, and how to fix it?</strong><br><br><strong>Solution.</strong> $f(0) = 0/0$ undefined → C1 fails. But $\\lim_{x \\to 0} \\sin(x)/x = 1$ (the famous limit). Limit exists ($L = 1$) and $f(0)$ undefined → <strong>removable</strong>. Redefine $f(0) := 1$ and the function becomes continuous at 0.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6</div><div class="example-body"><strong>Find all points of discontinuity of $f(x) = \\dfrac{x + 2}{x^2 - x - 6}$.</strong><br><br><strong>Solution.</strong> Denominator factors as $(x - 3)(x + 2)$, zero at $x = 3$ and $x = -2$.<br>At $x = 3$: numerator $= 5 \\neq 0$ → <strong>infinite</strong> discontinuity, vertical asymptote.<br>At $x = -2$: numerator $= 0$, so $(x+2)/[(x-3)(x+2)] = 1/(x-3)$ for $x \\neq -2$. Limit at $-2$ is $1/(-5) = -1/5$, finite. $f(-2)$ undefined → <strong>removable</strong>.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7</div><div class="example-body"><strong>Find $a$ and $b$ that make $f(x) = \\begin{cases} ax + 3 & x < 2 \\\\ 5 & x = 2 \\\\ x^2 + b & x > 2 \\end{cases}$ continuous at $x = 2$.</strong><br><br><strong>Solution.</strong> Need left limit $= f(2) = $ right limit $= 5$.<br>Left: $2a + 3 = 5$, hence $a = 1$.<br>Right: $4 + b = 5$, hence $b = 1$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8</div><div class="example-body"><strong>Where is $f(x) = \\dfrac{\\tan x}{x}$ discontinuous on $[-\\pi, \\pi]$? Classify each point.</strong><br><br><strong>Solution.</strong><br>At $x = 0$: $f(0) = 0/0$ undefined. Limit $= \\lim_{x \\to 0} \\tan(x)/x = 1$ (use $\\tan x \\sim x$ near 0). <strong>Removable</strong>.<br>At $x = \\pm \\pi/2$: $\\tan(\\pm \\pi/2)$ blows up; one-sided limits are $\\pm \\infty$. <strong>Infinite</strong> discontinuities at $\\pm \\pi/2$.<br>At $x = \\pm \\pi$: $\\tan(\\pm \\pi) = 0$, $f(\\pm \\pi) = 0/(\\pm \\pi) = 0$, continuous.<br>Everywhere else on $[-\\pi, \\pi]$ the function is continuous.</div></div>

<div class="think-box"><div class="think-label">CLOSING THOUGHT</div><div class="think-body">The three-condition test is short, but applying it well requires a clear head. First compute $f(a)$ — is it defined? Then compute the one-sided limits. Then compare. The first failure tells you everything: which condition fails, and therefore which type of discontinuity you have, and therefore whether anything can be done to repair it.</div></div>

<p class="l-text"><em>End of lesson 15.</em> Next lesson: the Intermediate Value Theorem — the first major theorem that uses continuity to prove the existence of a root.</p>
`,

/* ========================================================================
   TURKISH VERSION
   ======================================================================== */
tr: `
<p class="l-text"><strong>Süreklilik</strong>, bir grafikte boşluk, delik, sıçrama veya aniden sonsuza fırlama olmaması durumuna verilen matematiksel addır. Ders 14, fonksiyonun sonsuza fırladığı durumları inceledi; bu ders ise tam tersini soruyor — bir fonksiyon hangi noktalarda öyle düzgün davranır ki, grafiğini orada kalemini kâğıttan kaldırmadan çizebilirsin? Şaşırtıcı biçimde, bu kalem-testi sezgisi, bildiğin limit kavramları kullanılarak üç satırlık kesin bir tanıma çevrilebilir.</p>

<p class="l-text">Türk lise müfredatında süreklilik 11. sınıfın sonlarına denk düşer. Türev derslerinin başında (her türevlenebilir fonksiyon süreklidir) ve integral derslerinin başında (kapalı aralıkta sürekli fonksiyonlar her zaman integrallenebilir) tekrar karşına çıkacak. Üç koşullu süreklilik kontrolünü şimdi sağlam öğrenmek, önümüzdeki iki yılın matematiğinde sana büyük kazanç olarak geri dönecek.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NELER ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir noktada sürekliliğin üç temel koşulunu ifade etmek.</li>
<li>Dört süreksizlik türünü ayırt etmek: kaldırılabilir, sıçrama, sonsuz ve salınımlı.</li>
<li>Grafiğe veya tek-yönlü limitlere bakarak süreksizlik türünü tanımak.</li>
<li>Süreklilik cebrini kullanmak — sürekli fonksiyonların toplam, çarpım, bölüm ve bileşkesi yine süreklidir.</li>
<li>Parçalı bir fonksiyonun ekleme noktasında sürekli olmasını sağlayan $a$ parametresini bulmak.</li>
<li>Kapalı aralık $[a, b]$ üzerinde sürekliliği tanımak — Ara Değer Teoremi'ne giriş.</li>
</ul>
</div>

<!-- ============================================================
     BÖLÜM 1
     ============================================================ -->
<h2 class="l-title">1. Sezgi: Kalemi Kaldırmadan Çizmek</h2>

<p class="l-text">Eline bir kâğıt ve kalem al; soldan sağa doğru $y = x^2$ grafiğini çizmeye başla. Kalemin kâğıttan hiç kalkmaz. Grafik düzgün, tek parça, kesintisiz bir eğridir. Böyle fonksiyonlara <strong>sürekli</strong> diyoruz. Şimdi aynı şeyi tam-değer fonksiyonu $y = \\lfloor x \\rfloor$ için dene: $x$ her tamsayıdan geçtiğinde kalemin bir birim yukarı zıplamak zorunda kalır. Grafik kopuk parçalardan oluşur; bu fonksiyon her tamsayıda <strong>süreksizdir</strong>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sürekli fonksiyon</div><div class="card-body">Kopukluk yoktur. $x$'teki küçük değişiklikler $f(x)$'te küçük değişiklikler üretir. Fonksiyonun sürekli olduğu aralık boyunca grafik tek parça kesintisiz bir eğridir.</div></div>
<div class="calc-card"><div class="card-title">$x = a$ noktasında süreksiz</div><div class="card-body">Tek $x = a$ noktasında grafik kopuktur — bir delik, sıçrama, dikey asimptot ya da hızlı salınım nedeniyle. Fonksiyon başka her yerde mükemmel şekilde sürekli olabilir.</div></div>
<div class="calc-card"><div class="card-title">Yerel özellik</div><div class="card-body">Süreklilik nokta nokta kontrol edilir. Bir fonksiyon $x = 1$'de sürekli, $x = 2$'de süreksiz olabilir. Her zaman <em>$x = a$ noktasında sürekli</em> deriz — bağlamsız "sürekli" demeyiz.</div></div>
</div>

<div id="plot-continuous-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xs=[];var ys=[];for(var i=-30;i<=30;i++){var x=i/10;xs.push(x);ys.push(x*x*x*0.1 - x + 1);}
  var curve={x:xs,y:ys,mode:"lines",name:"f(x) = 0.1x³ - x + 1",line:{color:"#c8a96e",width:2.5}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-3.2,3.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)",range:[-3.5,5]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-continuous-tr",[curve],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $f(x) = 0.1x^3 - x + 1$ polinomu her yerde süreklidir. Eğrinin tamamı tek parça kesintisiz bir yaydır — soldan sağa tek bir kalem darbesiyle çizebilirsin. Polinomlar, tüm reel doğrunda sürekli olan fonksiyonların en basit örneğidir.</div></div>

<div class="think-box"><div class="think-label">KALEM TESTİ</div><div class="think-body">Kalem testi yararlı bir sezgidir, kanıt değildir. Bazı fonksiyonlar sürekli gibi görünür ama çok ince süreksizlikleri vardır ($x = 0$ yakınında $\\sin(1/x)$ gibi); bazılarının ise dikey asimptotu vardır ve kalem sezgisi bunu iyi yakalayamaz. Bölüm 2'deki resmi üç-koşul tanımı asıl testtir.</div></div>

<!-- ============================================================
     BÖLÜM 2
     ============================================================ -->
<h2 class="l-title">2. Bir Noktada Sürekliliğin Üç Koşulu</h2>

<p class="l-text">Bir $f$ fonksiyonu <strong>$x = a$ noktasında sürekli</strong>dir ancak ve ancak aşağıdaki üç koşulun hepsi aynı anda sağlanıyorsa:</p>

<div class="calc-formula">
<div class="formula-label">$x = a$ NOKTASINDA SÜREKLİLİK</div>
<div class="formula-main">$$\\text{(K1)} \\;\\; f(a) \\text{ tanımlı.} \\qquad \\text{(K2)} \\;\\; \\lim_{x \\to a} f(x) \\text{ var.} \\qquad \\text{(K3)} \\;\\; \\lim_{x \\to a} f(x) = f(a).$$</div>
<div class="formula-sub">Üç koşulun hepsi birden sağlanmalıdır. Eğer <em>herhangi biri</em> bile başarısız olursa, $f$ noktada süreksizdir.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">K1: $f(a)$ tanımlı</div><div class="card-body">$x = a$ konulduğunda fonksiyon bir reel sayı üretmelidir. Eğer $a$ tanım kümesinde değilse (örneğin $a$, paydayı sıfır yapıyorsa veya karekök içini negatife düşürüyorsa), K1 başarısız olur.</div></div>
<div class="calc-card"><div class="card-title">K2: Limit var</div><div class="card-body">$a$ noktasında her iki tek-yönlü limit var ve birbirine eşit olmalıdır. Soldan ve sağdan limitler farklıysa iki-yönlü limit yoktur ve K2 başarısız olur.</div></div>
<div class="calc-card"><div class="card-title">K3: Değerler eşit</div><div class="card-body">Limit değeri ve fonksiyonun $a$'daki değeri <em>aynı sayı</em> olmalıdır. Limit var ve $f(a)$ tanımlı, ama farklı sayılar çıkıyorsa K3 başarısız olur.</div></div>
</div>

<p class="l-text"><strong>Üç koşulu nasıl kullanırsın.</strong> Bir fonksiyon ve nokta verildiğinde, koşulları sırasıyla kontrol et. Başarısız olan ilk koşul sana fonksiyonun <em>neden</em> süreksiz olduğunu ve hangi tür süreksizlikle uğraştığını söyler (Bölüm 3'ten itibaren).</p>

<div class="calc-example"><div class="example-label">ÖRNEK 1 (SÜREKLİ)</div><div class="example-body"><strong>$f(x) = x^2 + 3x - 1$ fonksiyonu $x = 2$'de sürekli midir?</strong><br><br>K1: $f(2) = 4 + 6 - 1 = 9$ — tanımlı. ✓<br>K2: $\\lim_{x \\to 2} (x^2 + 3x - 1) = 9$ — var (polinomlar güzel davranır). ✓<br>K3: limit $= 9 = f(2)$. ✓<br><br>Üç koşul da sağlanır, yani $f$ <strong>$x = 2$'de süreklidir</strong>.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 (K1 BAŞARISIZ)</div><div class="example-body"><strong>$f(x) = \\dfrac{1}{x - 3}$ fonksiyonu $x = 3$'te sürekli midir?</strong><br><br>K1: $f(3) = 1/0$ — <em>tanımsız</em>. ✗<br><br>K1 zaten başarısız, dolayısıyla $f$ <strong>$x = 3$'te süreksizdir</strong>. (Aslında bu bir <em>sonsuz</em> süreksizliktir — Bölüm 5'e bak.)</div></div>

<!-- ============================================================
     BÖLÜM 3
     ============================================================ -->
<h2 class="l-title">3. Süreksizlik Türü 1: Kaldırılabilir ("Delik")</h2>

<p class="l-text">$x = a$'da bir <strong>kaldırılabilir süreksizlik</strong> şu durumlarda oluşur: $a$'daki iki-yönlü limit var ve sonlu bir $L$ sayısına eşit; ancak ya $f(a)$ tanımsız ya da $f(a) \\neq L$. Grafiğin $x = a$ noktasında tek bir eksik nokta (delik) bulunur ya da eğrinin dışında tek bir yanlış yerleştirilmiş nokta vardır. Buna <em>kaldırılabilir</em> dememizin nedeni: $f(a) := L$ olarak yeniden tanımlarsak fonksiyon $a$'da sürekli hale gelir — delik "doldurulmuş" olur.</p>

<div class="calc-formula">
<div class="formula-label">KALDIRILABİLİR SÜREKSİZLİK</div>
<div class="formula-main">$$\\lim_{x \\to a^-} f(x) \\;=\\; \\lim_{x \\to a^+} f(x) \\;=\\; L, \\quad \\text{ama} \\quad f(a) \\neq L \\;\\text{ya da}\\; f(a) \\text{ tanımsız.}$$</div>
<div class="formula-sub">$f(a) := L$ yeniden tanımı fonksiyonu yamayıp sürekli hale getirir.</div>
</div>

<div id="plot-removable-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xL=[];var yL=[];for(var i=-30;i<20;i++){var x=i/10;xL.push(x);yL.push((x*x-4)/(x-2));}
  var xR=[];var yR=[];for(var i=21;i<=50;i++){var x=i/10;xR.push(x);yR.push((x*x-4)/(x-2));}
  var t1={x:xL,y:yL,mode:"lines",name:"f(x) = (x²-4)/(x-2)",line:{color:"#c8a96e",width:2.5}};
  var t2={x:xR,y:yR,mode:"lines",name:"x = 2 sağı",line:{color:"#c8a96e",width:2.5},showlegend:false};
  var hole={x:[2],y:[4],mode:"markers",name:"x = 2'de delik",marker:{size:14,color:"rgba(0,0,0,0)",line:{color:"#f87171",width:2.5}}};
  var ann=[{x:2,y:4,text:"limit = 4 ama f(2) tanımsız",showarrow:true,arrowhead:2,ax:80,ay:-30,font:{color:"#f87171",size:13}}];
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-3,5.5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)",range:[-2,8]},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-removable-tr",[t1,t2,hole],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $f(x) = (x^2 - 4)/(x - 2)$, $x \\neq 2$ olan her noktada $x + 2$'ye sadeleşir. Bu yüzden grafiği $y = x + 2$ doğrusunun bir tek eksik noktası — $(2, 4)$ noktasındaki delik — dışındaki halidir. $x = 2$ noktasındaki iki-yönlü limit vardır (değeri 4) fakat $f(2)$ tanımsızdır. Kaldırılabilirdir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>$f(x) = \\dfrac{x^2 - 9}{x - 3}$ fonksiyonunun $x = 3$'teki süreksizliğini sınıflandır.</strong><br><br>K1: $f(3) = 0/0$ — tanımsız. ✗ Yani $f$, 3'te süreksizdir.<br><br>Sınıflandırmak için çarpanlara ayır: $(x^2 - 9)/(x - 3) = (x-3)(x+3)/(x-3) = x + 3$, $x \\neq 3$ için. Limit $\\lim_{x \\to 3} (x + 3) = 6$ vardır.<br><br>İki-yönlü limit var ($L = 6$), ama $f(3)$ tanımsız. Bu bir <strong>kaldırılabilir</strong> süreksizliktir. $f(3) := 6$ tanımlayınca fonksiyon her yerde sürekli hale gelir.</div></div>

<div class="think-box"><div class="think-label">DESEN</div><div class="think-body">Pay ve payda arasında sadeleşen bir çarpanı olan bir rasyonel fonksiyon gördüğünde, sadeleşen kökte bir kaldırılabilir süreksizlik beklemelisin. Çarpan sadeleşmiyorsa süreksizlik genellikle sonsuzdur (Bölüm 5).</div></div>

<!-- ============================================================
     BÖLÜM 4
     ============================================================ -->
<h2 class="l-title">4. Süreksizlik Türü 2: Sıçrama</h2>

<p class="l-text">$x = a$'daki <strong>sıçrama süreksizliği</strong> şu durumda oluşur: hem soldan hem de sağdan limit sonlu sayı olarak var, ama farklılar. Grafik $x = a$'da sonlu miktarda dikey olarak sıçrar. $f(a)$'ya verebileceğin tek bir değer süreksizliği gideremez — hangi değeri verirsen ver, iki taraftan sadece biri "denk düşebilir".</p>

<div class="calc-formula">
<div class="formula-label">SIÇRAMA SÜREKSİZLİĞİ</div>
<div class="formula-main">$$\\lim_{x \\to a^-} f(x) = L_1, \\;\\; \\lim_{x \\to a^+} f(x) = L_2, \\;\\; L_1 \\neq L_2 \\quad \\text{(her ikisi de sonlu).}$$</div>
<div class="formula-sub">"Sıçrama büyüklüğü" $|L_2 - L_1|$. K2 başarısız olur çünkü iki-yönlü limit yoktur.</div>
</div>

<p class="l-text">Sıçrama süreksizlikleri doğal olarak <em>parçalı fonksiyonlar</em>da — farklı aralıklarda farklı formüllerle tanımlanan fonksiyonlarda — ortaya çıkar. Gerçek hayattan bir örnek: bir taksi yolculuğunun mesafeye göre ücreti, çoğu zaman "sadece açılış" ile "açılış artı km başına ücret" arasındaki sınırda küçük bir sıçramaya sahiptir.</p>

<div id="plot-jump-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xL=[];var yL=[];for(var i=-30;i<20;i++){var x=i/10;xL.push(x);yL.push(x+1);}
  var xR=[];var yR=[];for(var i=20;i<=50;i++){var x=i/10;xR.push(x);yR.push(x*x-1);}
  var t1={x:xL,y:yL,mode:"lines",name:"x<2 için f(x) = x+1",line:{color:"#c8a96e",width:2.5}};
  var t2={x:xR,y:yR,mode:"lines",name:"x≥2 için f(x) = x²-1",line:{color:"#06b6d4",width:2.5}};
  var openDot={x:[2],y:[3],mode:"markers",name:"soldan limit (açık)",marker:{size:13,color:"rgba(0,0,0,0)",line:{color:"#c8a96e",width:2.5}}};
  var closedDot={x:[2],y:[3],mode:"markers",name:"f(2) (kapalı)",marker:{size:11,color:"#06b6d4"}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-3,5.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)",range:[-2.5,8]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.25}};
  Plotly.newPlot("plot-jump-tr",[t1,t2,openDot,closedDot],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> İki parçalı bir fonksiyon. Soldan ve sağdan farklı sonlu limitler, ekleme noktasında dikey bir sıçrama oluşturur. Anahtar fikir: soldan ve sağdan tek-yönlü limitler iki farklı sonlu sayı verdiğinde sıçrama oluşur.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>$x = 0$ noktasındaki süreksizliği sınıflandır:</strong><br>$$f(x) = \\begin{cases} x - 1 & x < 0 \\\\ x + 1 & x \\geq 0 \\end{cases}$$<br><br>Soldan limit: $\\lim_{x \\to 0^-} (x - 1) = -1$.<br>Sağdan limit: $\\lim_{x \\to 0^+} (x + 1) = +1$.<br><br>Her iki tek-yönlü limit sonlu, ama $-1 \\neq +1$. Bu bir <strong>sıçrama süreksizliği</strong>, sıçrama büyüklüğü $|1 - (-1)| = 2$. $f(0)$'ı hangi değerle yeniden tanımlarsan tanımla, düzeltilemez.</div></div>

<div class="calc-example"><div class="example-label">İŞARET FONKSİYONU</div><div class="example-body"><strong>İşaret fonksiyonu</strong> $\\operatorname{sgn}(x) = -1$ ($x < 0$ için), $\\operatorname{sgn}(0) = 0$, $\\operatorname{sgn}(x) = +1$ ($x > 0$ için), $x = 0$'da büyüklüğü 2 olan bir sıçrama süreksizliğine sahiptir — kanonik örnek. Benzer şekilde <strong>tam-değer fonksiyonu</strong> $\\lfloor x \\rfloor$ her tamsayıda büyüklüğü 1 olan bir sıçrama süreksizliğine sahiptir.</div></div>

<!-- ============================================================
     BÖLÜM 5
     ============================================================ -->
<h2 class="l-title">5. Süreksizlik Türü 3: Sonsuz (Dikey Asimptot)</h2>

<p class="l-text">$x = a$'daki <strong>sonsuz süreksizlik</strong> şu durumda oluşur: tek-yönlü limitlerden en az biri $+\\infty$ ya da $-\\infty$'dur. $x$, $a$'ya yaklaşırken grafik görünüş penceresinden dışarı fırlar ve $x = a$ doğrusu bir dikey asimptot olur (Ders 14). Fonksiyonun "doldurulacak" sonlu bir değeri yoktur — iki-yönlü limit yalnızca uyumsuz olmadığı için değil, sınırsız olduğu için de başarısız olur.</p>

<div class="calc-formula">
<div class="formula-label">SONSUZ SÜREKSİZLİK</div>
<div class="formula-main">$$\\lim_{x \\to a^-} f(x) = \\pm\\infty \\quad \\text{ya da} \\quad \\lim_{x \\to a^+} f(x) = \\pm\\infty.$$</div>
<div class="formula-sub">En az bir taraf patlar. Grafiğin $x = a$'da dikey asimptotu vardır.</div>
</div>

<div id="plot-infinite-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  var xL=[];var yL=[];for(var i=-50;i<-2;i++){var x=i/10;xL.push(x);yL.push(1/x);}
  var xR=[];var yR=[];for(var i=2;i<=50;i++){var x=i/10;xR.push(x);yR.push(1/x);}
  var t1={x:xL,y:yL,mode:"lines",name:"f(x) = 1/x (x < 0)",line:{color:"#c8a96e",width:2.5}};
  var t2={x:xR,y:yR,mode:"lines",name:"f(x) = 1/x (x > 0)",line:{color:"#c8a96e",width:2.5},showlegend:false};
  var asym={x:[0,0],y:[-10,10],mode:"lines",name:"x = 0 asimptotu",line:{color:"#f87171",width:1.5,dash:"dash"}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-5,5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)",range:[-6,6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-infinite-tr",[t1,t2,asym],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $f(x) = 1/x$ fonksiyonu $x = 0$'da sonsuz süreksizliğe sahiptir: soldan limit $-\\infty$, sağdan limit $+\\infty$. Kesik dikey çizgi $x = 0$ asimptotudur. Hiçbir taraf sonlu bir değere ulaşmaz ve $f(0)$ için verilecek hiçbir değer boşluğu yamayamaz.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>$f(x) = \\dfrac{1}{(x - 2)^2}$ fonksiyonunun $x = 2$'deki süreksizliğini sınıflandır.</strong><br><br>K1: $f(2) = 1/0$ — tanımsız. ✗<br>Tek-yönlü limitler: $\\lim_{x \\to 2^-} \\dfrac{1}{(x-2)^2} = +\\infty$ ve $\\lim_{x \\to 2^+} \\dfrac{1}{(x-2)^2} = +\\infty$.<br><br>İki taraf da $+\\infty$'a gider (kare her zaman pozitif). Bu bir <strong>sonsuz süreksizlik</strong>tir; $x = 2$ doğrusu bir dikey asimptottur.</div></div>

<!-- ============================================================
     BÖLÜM 6
     ============================================================ -->
<h2 class="l-title">6. Süreksizlik Türü 4: Salınımlı</h2>

<p class="l-text">$x = a$'daki <strong>salınımlı süreksizlik</strong> şu durumda oluşur: $x$, $a$'ya yaklaşırken fonksiyon değerleri tek bir sayıya yaklaşmaz — bunun yerine bir değer aralığında durmadan sallanır. Ders kitabı örneği: $x = 0$'da $f(x) = \\sin(1/x)$. $x \\to 0$ olurken $1/x \\to \\pm\\infty$ olur ve $\\sin(1/x)$ $-1$ ile $+1$ arasındaki tüm değerleri sonsuz kez taramaya devam eder. Hiçbir tek-yönlü limit yoktur.</p>

<div class="calc-formula">
<div class="formula-label">SALINIMLI SÜREKSİZLİK</div>
<div class="formula-main">$$\\lim_{x \\to a^-} f(x) \\text{ ve/veya } \\lim_{x \\to a^+} f(x) \\text{ yok (salınım).}$$</div>
<div class="formula-sub">Fonksiyon değerleri tek bir sayıya hatta $\\pm\\infty$'a bile yaklaşmaz — limitsiz salınır.</div>
</div>

<p class="l-text">Salınımlı süreksizlikler standart lise problemlerinde ilk üç türden daha az yaygındır, ancak ileri örneklerde karşımıza çıkar ve "limit yoktur" durumunun sol ≠ sağ veya sonsuza patlama dışında nedenlerle de oluşabileceğini hatırlatır.</p>

<div class="calc-example"><div class="example-label">KLASİK ÖRNEK</div><div class="example-body">$f(x) = \\sin(1/x)$ fonksiyonu $x = 0$'da salınımlı süreksizliğe sahiptir. $x_n = 1/(n\\pi)$ dizisini al — o zaman $\\sin(1/x_n) = \\sin(n\\pi) = 0$. Bu kez $x_n = 1/((2n + 1/2)\\pi)$ al — o zaman $\\sin(1/x_n) = 1$. 0'a yaklaşan iki farklı dizi, $f$ için farklı limit değerleri verir, dolayısıyla $\\lim_{x \\to 0} \\sin(1/x)$ yoktur.</div></div>

<!-- ============================================================
     BÖLÜM 7
     ============================================================ -->
<h2 class="l-title">7. Sürekli Fonksiyonların Cebri</h2>

<p class="l-text">$f$ ve $g$'nin $x = a$'da sürekli olduğunu bildiğinde, üç-koşul tanımını yeniden kontrol etmeden bu iki fonksiyondan yeni sürekli fonksiyonlar inşa edebilirsin. Aşağıdaki kurallar limit kurallarının (Ders 11) doğrudan sonuçlarıdır:</p>

<div class="calc-formula">
<div class="formula-label">SÜREKLİLİĞİ KORUYAN İŞLEMLER</div>
<div class="formula-main">$$f, g \\text{ $a$'da sürekliyse, şunlar da süreklidir:} \\;\\; f + g, \\;\\; f - g, \\;\\; f \\cdot g, \\;\\; cf, \\;\\; \\dfrac{f}{g} \\;(g(a) \\neq 0 \\text{ ise}).$$</div>
<div class="formula-sub">Bileşke: $f$ $a$'da sürekli ve $g$ $f(a)$'da sürekli ise, $g \\circ f$ $a$'da süreklidir.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Polinomlar</div><div class="card-body">Her $p(x) = a_n x^n + \\dots + a_0$ polinomu, sabit fonksiyon ve $x$ — her ikisi de her yerde sürekli — kullanılarak toplam ve çarpımla inşa edilir. Yani polinomlar tüm reel doğru $\\mathbb{R}$ üzerinde süreklidir.</div></div>
<div class="calc-card"><div class="card-title">Rasyonel fonksiyonlar</div><div class="card-body">Bir $p(x)/q(x)$ rasyoneli, $q(x) \\neq 0$ olan her yerde süreklidir. Süreksizlik için tek aday paydanın kökleridir.</div></div>
<div class="calc-card"><div class="card-title">Trig, üstel, log</div><div class="card-body">$\\sin x$ ve $\\cos x$ tüm $\\mathbb{R}$ üzerinde süreklidir. $\\tan x$, $\\cos x \\neq 0$ olan her yerde süreklidir. $e^x$ her yerde süreklidir; $\\ln x$ ise $(0, \\infty)$ üzerinde süreklidir.</div></div>
<div class="calc-card"><div class="card-title">Bileşkeler</div><div class="card-body">$\\sin(x^2 + 1)$, $\\sqrt{x^2 + 1}$, $e^{\\cos x}$ — hepsi doğal tanım kümeleri üzerinde, bileşke kuralı sayesinde süreklidir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>$f(x) = \\dfrac{x^2 + 1}{x^2 - 5x + 6}$ nerede süreklidir?</strong><br><br>Pay $x^2 + 1$: polinom, her yerde sürekli.<br>Payda $x^2 - 5x + 6 = (x-2)(x-3)$: $x = 2$ ve $x = 3$'te sıfır.<br><br>Süreklilik için bölüm kuralı ile, $f$ $x = 2$ ve $x = 3$ dışında her yerde süreklidir. Bu iki noktada payda sıfır ve pay sıfır değil, dolayısıyla sonsuz süreksizliklerimiz (dikey asimptotlar) vardır.</div></div>

<!-- ============================================================
     BÖLÜM 8
     ============================================================ -->
<h2 class="l-title">8. Aralıkta Süreklilik ve İleriye Bakış</h2>

<p class="l-text">Bir fonksiyon <strong>$(a, b)$ açık aralığında sürekli</strong>dir ancak ve ancak $(a, b)$ içindeki her noktada sürekliyse. <strong>Kapalı aralık $[a, b]$'de sürekli</strong>dir ancak ve ancak buna ek olarak uç noktalardaki tek-yönlü limitler $f(a)$ ve $f(b)$ değerleriyle uyuşuyorsa:</p>

<div class="calc-formula">
<div class="formula-label">$[a, b]$ ÜZERİNDE SÜREKLİLİK</div>
<div class="formula-main">$$f \\text{ $(a, b)$'de sürekli}, \\;\\; \\lim_{x \\to a^+} f(x) = f(a), \\;\\; \\lim_{x \\to b^-} f(x) = f(b).$$</div>
<div class="formula-sub">Uç noktalarda yalnızca tek-yönlü bir uyuma ihtiyacımız var (fonksiyon aralık dışında zaten yoktur).</div>
</div>

<p class="l-text">Kapalı bir aralıkta süreklilik, temel analizdeki en güçlü iki teoreminin kapılarını açar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ara Değer Teoremi (ADT)</div><div class="card-body">$f$ $[a, b]$'de sürekli ve $N$, $f(a)$ ile $f(b)$ arasında herhangi bir sayı ise, $f(c) = N$ olacak şekilde bir $c \\in (a, b)$ vardır. Özellikle, işaret değişimleri bir kökün varlığını garantiler.</div></div>
<div class="calc-card"><div class="card-title">Ekstrem Değer Teoremi (EDT)</div><div class="card-body">$f$ $[a, b]$'de sürekli ise, $f$ $[a, b]$ üzerinde hem bir maksimum hem de bir minimum değere ulaşır. Fonksiyon kapalı sınırlı bir aralıkta "sonsuza kaçamaz".</div></div>
<div class="calc-card"><div class="card-title">Sonraki ders</div><div class="card-body">Ders 16, Ara Değer Teoremi'ne daha derin bakacak, köklerin varlığını kanıtlayacak ve bunu kullanarak sayısal bir kök bulma yordamı (ikiye-bölme yöntemi) inşa edecek.</div></div>
</div>

<!-- ============================================================
     BÖLÜM 9
     ============================================================ -->
<h2 class="l-title">9. Parçalı Fonksiyonlar: f'yi Sürekli Yapan Parametre</h2>

<p class="l-text">Çok yaygın bir lise sınav sorusu şudur: <em>aşağıdaki parçalı fonksiyon, ekleme noktasında hangi $a$ parametresi değeri için süreklidir?</em> Yöntem basittir — ekleme noktasında üçüncü süreklilik koşulunu kullan: soldan limiti sağdan limite (ve fonksiyon değerine) eşitle.</p>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>$f(x) = \\begin{cases} x^2 + 1 & x \\leq 2 \\\\ ax - 3 & x > 2 \\end{cases}$ fonksiyonu $x = 2$'de hangi $a$ değeri için süreklidir?</strong><br><br>Soldan limit: $\\lim_{x \\to 2^-} (x^2 + 1) = 5$. Ayrıca $f(2) = 5$ (ilk parça kullanılarak).<br>Sağdan limit: $\\lim_{x \\to 2^+} (ax - 3) = 2a - 3$.<br><br>Eşitle: $2a - 3 = 5$, yani $2a = 8$, dolayısıyla $a = 4$.<br><br>$a = 4$'te fonksiyon sürekli hale gelir; başka herhangi bir $a$ için 2'de bir sıçrama süreksizliği vardır.</div></div>

<div class="calc-example"><div class="example-label">İKİ PARAMETRELİ ÖRNEK</div><div class="example-body"><strong>$g(x) = \\begin{cases} x + 1 & x < 1 \\\\ ax + b & 1 \\leq x \\leq 3 \\\\ x^2 - 2 & x > 3 \\end{cases}$ fonksiyonunu $\\mathbb{R}$ üzerinde sürekli yapan $a$ ve $b$ değerlerini bul.</strong><br><br>$x = 1$'de: soldan limit $= 2$, sağdan limit $= a + b$. $a + b = 2$.<br>$x = 3$'te: soldan limit $= 3a + b$, sağdan limit $= 7$. $3a + b = 7$.<br><br>Çıkar: $2a = 5$, yani $a = 5/2$ ve $b = 2 - 5/2 = -1/2$.<br><br>$a = 5/2, b = -1/2$ için fonksiyon her yerde süreklidir.</div></div>

<div class="think-box"><div class="think-label">KONTROL LİSTESİ</div><div class="think-body">Bir parametre problemini çözerken her zaman: (1) ekleme noktasında her iki taraftaki formülleri kullanarak tek-yönlü limitleri hesapla; (2) eşitle; (3) parametreyi çöz. İki ekleme noktası varsa iki denklem elde edersin — küçük bir doğrusal sistem.</div></div>

<!-- ============================================================
     BÖLÜM 10
     ============================================================ -->
<h2 class="l-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Süreksizlik türünü hızlı tanımlamadan parametre problemlerine uzanan sekiz alıştırma. Çözüme bakmadan önce her birini kalem-kâğıtla çöz.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body"><strong>$f(x) = \\dfrac{x^2 - 1}{x - 1}$ fonksiyonunun $x = 1$'deki süreksizliğini sınıflandır.</strong><br><br><strong>Çözüm.</strong> Çarpanlara ayır: $(x^2 - 1)/(x - 1) = (x-1)(x+1)/(x-1) = x + 1$, $x \\neq 1$ için. 1'deki limit $2$; ama $f(1)$ $0/0$ tanımsızdır. İki-yönlü limit var, $f(1)$ tanımsız → <strong>kaldırılabilir</strong>. $f(1) := 2$ yeniden tanımı çözer.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body"><strong>$f(x) = \\dfrac{|x|}{x}$ fonksiyonunun $x = 0$'daki süreksizliğini sınıflandır.</strong><br><br><strong>Çözüm.</strong> $x > 0$ için $|x|/x = 1$; $x < 0$ için $|x|/x = -1$; $x = 0$'da tanımsız. Soldan limit $= -1$, sağdan limit $= +1$. İkisi de sonlu ama farklı → <strong>sıçrama</strong>, büyüklük 2.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body"><strong>$f(x) = \\dfrac{1}{x - 4}$ fonksiyonunun $x = 4$'teki süreksizliğini sınıflandır.</strong><br><br><strong>Çözüm.</strong> $f(4) = 1/0$ tanımsız. 4'te soldan limit: pay $1$, payda $0^-$'a yaklaşır, yani limit $-\\infty$. Sağdan limit: $+\\infty$. <strong>Sonsuz</strong> süreksizlik; $x = 4$ dikey asimptot.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body"><strong>$f(x) = \\begin{cases} 3x + 1 & x < 1 \\\\ x^2 + a & x \\geq 1 \\end{cases}$ fonksiyonu $x = 1$'de hangi $a$ için süreklidir?</strong><br><br><strong>Çözüm.</strong> Soldan limit $= 4$, sağdan limit $= 1 + a$. $1 + a = 4$ eşitliğinden $a = 3$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body"><strong>$f(x) = \\dfrac{\\sin x}{x}$ ($f(0)$ tanımsız) $x = 0$'da sürekli midir? Hangi süreksizlik türü ve nasıl düzeltilir?</strong><br><br><strong>Çözüm.</strong> $f(0) = 0/0$ tanımsız → K1 başarısız. Ama $\\lim_{x \\to 0} \\sin(x)/x = 1$ (ünlü limit). Limit var ($L = 1$) ve $f(0)$ tanımsız → <strong>kaldırılabilir</strong>. $f(0) := 1$ yeniden tanımı 0'da sürekli yapar.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6</div><div class="example-body"><strong>$f(x) = \\dfrac{x + 2}{x^2 - x - 6}$ fonksiyonunun tüm süreksizlik noktalarını bul.</strong><br><br><strong>Çözüm.</strong> Payda $(x - 3)(x + 2)$, $x = 3$ ve $x = -2$'de sıfır.<br>$x = 3$'te: pay $= 5 \\neq 0$ → <strong>sonsuz</strong> süreksizlik, dikey asimptot.<br>$x = -2$'de: pay $= 0$, yani $(x+2)/[(x-3)(x+2)] = 1/(x-3)$, $x \\neq -2$ için. $-2$'deki limit $1/(-5) = -1/5$, sonlu. $f(-2)$ tanımsız → <strong>kaldırılabilir</strong>.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7</div><div class="example-body"><strong>$f(x) = \\begin{cases} ax + 3 & x < 2 \\\\ 5 & x = 2 \\\\ x^2 + b & x > 2 \\end{cases}$ fonksiyonunu $x = 2$'de sürekli yapan $a$ ve $b$'yi bul.</strong><br><br><strong>Çözüm.</strong> Soldan limit $= f(2) = $ sağdan limit $= 5$ olmalı.<br>Sol: $2a + 3 = 5$, yani $a = 1$.<br>Sağ: $4 + b = 5$, yani $b = 1$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8</div><div class="example-body"><strong>$f(x) = \\dfrac{\\tan x}{x}$ fonksiyonu $[-\\pi, \\pi]$ aralığında nerede süreksizdir? Her noktayı sınıflandır.</strong><br><br><strong>Çözüm.</strong><br>$x = 0$'da: $f(0) = 0/0$ tanımsız. Limit $= \\lim_{x \\to 0} \\tan(x)/x = 1$ (0 yakınında $\\tan x \\sim x$). <strong>Kaldırılabilir</strong>.<br>$x = \\pm \\pi/2$'de: $\\tan(\\pm \\pi/2)$ patlar; tek-yönlü limitler $\\pm \\infty$. $\\pm \\pi/2$'de <strong>sonsuz</strong> süreksizlikler.<br>$x = \\pm \\pi$'de: $\\tan(\\pm \\pi) = 0$, $f(\\pm \\pi) = 0/(\\pm \\pi) = 0$, sürekli.<br>$[-\\pi, \\pi]$ üzerinde başka her yerde fonksiyon süreklidir.</div></div>

<div class="think-box"><div class="think-label">KAPANIŞ DÜŞÜNCESİ</div><div class="think-body">Üç-koşul testi kısadır, ancak doğru uygulanması net bir kafa gerektirir. Önce $f(a)$'yı hesapla — tanımlı mı? Sonra tek-yönlü limitleri hesapla. Sonra karşılaştır. İlk başarısızlık her şeyi söyler: hangi koşul başarısız oldu, dolayısıyla hangi süreksizlik türüne sahipsin ve dolayısıyla onarılıp onarılamayacağı.</div></div>

<p class="l-text"><em>Ders 15 sonu.</em> Sonraki ders: Ara Değer Teoremi — sürekliliği bir kökün varlığını kanıtlamak için kullanan ilk büyük teorem.</p>
`
};
