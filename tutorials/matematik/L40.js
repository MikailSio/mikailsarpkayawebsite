window.LISE_MAT_L40 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A function is the most useful idea in all of mathematics.</strong> Every formula you have ever written down — the area of a circle as a function of its radius, the temperature as a function of time, the price of a tomato as a function of its weight — has been a function in disguise. In this lesson we strip the idea down to its core, give it a precise definition, learn the standard notation that every mathematician on the planet uses, and learn the two skills that every high-school student must master: identifying the <em>domain</em> (what inputs are allowed) and the <em>range</em> (what outputs are produced).</p>

<p class="l-text">By the end of this lesson you will be able to read the symbol $f(x)$ correctly, decide whether a given rule defines a function, find the natural domain of a formula by spotting the two classical "danger zones" (zero denominators and negative square-root arguments), and apply the <em>vertical line test</em> to any graph to instantly tell whether the curve drawn in front of you is a function or merely a relation. These are the foundations on which the next ten lessons (linear functions, quadratic functions, polynomial functions, inverse functions, composition) will sit.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a function as a rule that assigns to each input exactly one output</li>
<li>Read and write the standard notation $f: A \\to B$ and $y = f(x)$ fluently</li>
<li>Find the domain (set of allowed inputs) and the range (set of produced outputs) of a function</li>
<li>Determine the natural domain of an algebraic formula using the "no zero in the denominator" and "no negative under the square root" rules</li>
<li>Read a function from a table, an arrow diagram, an equation, or a graph</li>
<li>Apply the vertical line test to decide whether a curve in the plane is the graph of a function</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Function? The Plain-Language Definition</h2>

<div class="calc-highlight"><strong>One sentence:</strong> a function is a rule that takes any element of one set (the input) and gives back <em>exactly one</em> element of another set (the output). No input is ever left without an output. No input ever produces two different outputs. That is the entire definition.</div>

<p class="l-text">Picture a vending machine. You press the button labelled "B7" and a chocolate bar drops out. You press "B7" again and the <em>same</em> chocolate bar (well, an identical one) drops out. It would be a broken machine if pressing "B7" sometimes gave you chocolate and sometimes gave you crisps. A function is a vending machine that never breaks: the same input always yields the same output.</p>

<p class="l-text">More formally, a function $f$ from a set $A$ to a set $B$ is an assignment that pairs each element $a \\in A$ with exactly one element $b \\in B$. We call $A$ the <strong>domain</strong> (the set of allowed inputs), $B$ the <strong>codomain</strong> (the set in which outputs are searched), and we write $f(a) = b$ to mean "the function $f$ sends the input $a$ to the output $b$".</p>

<div class="calc-formula"><div class="formula-label">FUNCTION &mdash; DEFINITION</div><div class="formula-main">$$f: A \\to B \\qquad\\text{such that}\\qquad \\forall a \\in A,\\;\\exists!\\; b \\in B \\text{ with } f(a) = b$$</div><div class="formula-sub">"For every $a$ in $A$, there exists exactly one $b$ in $B$ such that $f(a) = b$." The symbol $\\exists!$ means "there exists exactly one".</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Domain (tanım kümesi)</div><div class="card-body">The set $A$ of allowed inputs. Every element of $A$ must be sent somewhere.</div></div>
<div class="calc-card"><div class="card-title">Codomain</div><div class="card-body">The set $B$ in which outputs live. Not every element of $B$ needs to be hit &mdash; only those that are actually produced count.</div></div>
<div class="calc-card"><div class="card-title">Range (görüntü kümesi)</div><div class="card-body">The subset of $B$ that <em>is</em> actually hit by the function. Always a subset of the codomain.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Which of these is a function? <br><br>(a) The rule that assigns to each Turkish citizen his or her national ID number. <br>(b) The rule that assigns to each phone number the people who own it. <br>(c) The rule that assigns to each positive real number its square. <br><br>Answer: (a) and (c) are functions (each input has exactly one output). (b) is <em>not</em> a function &mdash; a single phone number can belong to multiple people, so a single input would produce multiple outputs.</div></div>

<h2 class="lesson-title">2. From Words to Symbols: Function Notation</h2>

<div class="calc-highlight"><strong>The shorthand $y = f(x)$ replaces an entire English sentence.</strong> It says: "$y$ is what the function $f$ gives you when you feed it the input $x$." Once you internalise this notation, every formula in the rest of the curriculum becomes shorter and clearer.</div>

<p class="l-text">In English: "Take a number, double it, then add 1." In symbols: $f(x) = 2x + 1$. The symbol $f$ is the <em>name</em> of the function (any letter will do &mdash; $g$, $h$, $\\phi$ are all common). The letter $x$ inside the parentheses is the <em>input variable</em> (any symbol works &mdash; $f(t)$, $f(u)$, $f(\\square)$ all mean the same function, just with the input called by a different name). The expression on the right is the <em>rule</em>.</p>

<div class="calc-formula"><div class="formula-label">STANDARD NOTATION</div><div class="formula-main">$$f: A \\to B,\\qquad x \\mapsto f(x)$$</div><div class="formula-sub">Read aloud: "$f$ is a function from $A$ to $B$ that sends $x$ to $f(x)$." The arrow $\\mapsto$ ("maps to") is the action of the function; the arrow $\\to$ between sets describes the domain and codomain.</div></div>

<p class="l-text"><strong>Evaluating a function.</strong> To find $f(3)$, replace every $x$ in the rule with the number 3 and compute. The parentheses are not multiplication &mdash; they hold the input.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Let $f(x) = 2x + 1$. Find $f(0)$, $f(3)$, $f(-2)$, and $f(a + 1)$.<br><br>$f(0) = 2 \\cdot 0 + 1 = \\mathbf{1}$.<br>$f(3) = 2 \\cdot 3 + 1 = \\mathbf{7}$.<br>$f(-2) = 2 \\cdot (-2) + 1 = \\mathbf{-3}$.<br>$f(a + 1) = 2(a + 1) + 1 = 2a + 2 + 1 = \\mathbf{2a + 3}$.<br><br>Notice: in the last evaluation the "input" is a whole expression. The rule still works &mdash; replace every $x$ with the input, no matter how complicated.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">FUNCTION NAME vs INPUT</div><div class="compare-item">$f$ &mdash; the function (the rule itself)</div><div class="compare-item">$x$ &mdash; the input (a placeholder)</div><div class="compare-item">$f(x)$ &mdash; the output (a number, once $x$ is fixed)</div><div class="compare-item">$f$ and $f(x)$ are <em>different objects</em> &mdash; one is the machine, the other is what comes out of it.</div></div><div class="compare-col"><div class="compare-title">COMMON SYMBOLS</div><div class="compare-item">$y = f(x)$ &mdash; "y depends on x via f"</div><div class="compare-item">$g(t)$, $h(u)$ &mdash; different letters, same idea</div><div class="compare-item">$f^{-1}$ &mdash; inverse function (lesson L47)</div><div class="compare-item">$f \\circ g$ &mdash; composition (lesson L48)</div></div></div>

<div class="l-note"><strong>A common mistake:</strong> students write $f \\cdot (3)$ thinking the parentheses mean multiplication. They do not. $f(3)$ is the value of the function $f$ at the input 3 &mdash; a single number, not a product. The notation predates algebra by two centuries; it is a historical artefact, but it is universal.</div>

<h2 class="lesson-title">3. Domain (Tanım Kümesi) and Range (Görüntü Kümesi)</h2>

<div class="calc-highlight"><strong>Every function carries two sets:</strong> the set of inputs you are allowed to feed in (domain), and the set of outputs that actually come out (range). Specifying a function without specifying its domain is like ordering a pizza without saying the size &mdash; technically possible, practically useless.</div>

<p class="l-text">Look at the simple function $f(x) = x^2$, declared on the domain $A = \\{-2, -1, 0, 1, 2\\}$. Evaluating one input at a time gives the outputs $\\{4, 1, 0, 1, 4\\}$. The <strong>range</strong> is the set $\\{0, 1, 4\\}$ &mdash; the duplicate values are listed once (sets do not count multiplicities).</p>

<div class="calc-formula"><div class="formula-label">DOMAIN AND RANGE</div><div class="formula-main">$$\\text{dom}(f) = A \\qquad\\qquad \\text{ran}(f) = \\{f(a) : a \\in A\\} \\subseteq B$$</div><div class="formula-sub">The domain is given (declared in advance). The range is computed (the actual set of outputs produced by running through every input).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Let $f: \\{1, 2, 3, 4\\} \\to \\mathbb{N}$ with $f(x) = x + 5$. Find dom $f$ and ran $f$.<br><br>The domain is given: $\\text{dom}(f) = \\{1, 2, 3, 4\\}$.<br>Compute the outputs: $f(1)=6, f(2)=7, f(3)=8, f(4)=9$. So $\\text{ran}(f) = \\mathbf{\\{6, 7, 8, 9\\}}$.<br><br>The codomain is $\\mathbb{N}$ (all natural numbers); the range is a much smaller subset.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Let $g: \\{-3, -2, -1, 0, 1, 2, 3\\} \\to \\mathbb{Z}$ with $g(x) = x^2 - 4$. Find ran $g$.<br><br>Compute each: $g(-3)=5, g(-2)=0, g(-1)=-3, g(0)=-4, g(1)=-3, g(2)=0, g(3)=5$.<br>List unique values: $\\text{ran}(g) = \\mathbf{\\{-4, -3, 0, 5\\}}$.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If $f(x) = 3x - 7$ on the domain $\\{0, 1, 2, 3\\}$, write the range. (Answer: $\\{-7, -4, -1, 2\\}$.)</div></div>

<h2 class="lesson-title">4. Natural Domain: The Two Danger Zones</h2>

<div class="calc-highlight"><strong>When a function is given by a formula with no domain stated, the convention is to take the largest possible subset of $\\mathbb{R}$ on which the formula makes sense.</strong> That set is called the <em>natural domain</em>. Two rules cover almost every problem you will see in high school.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rule 1: No zero in the denominator</div><div class="card-body">Division by zero is undefined. So in $f(x) = \\dfrac{1}{x - 2}$, the input $x = 2$ is forbidden. The natural domain is $\\mathbb{R} \\setminus \\{2\\}$.</div></div>
<div class="calc-card"><div class="card-title">Rule 2: No negative under an even-index root</div><div class="card-body">$\\sqrt{x}$ is only defined for $x \\geq 0$ in the real numbers. So $f(x) = \\sqrt{x - 3}$ needs $x - 3 \\geq 0$, i.e. $x \\geq 3$. Natural domain: $[3, \\infty)$.</div></div>
<div class="calc-card"><div class="card-title">Combination case</div><div class="card-body">When a formula mixes both, intersect the two constraints. Example: $f(x) = \\dfrac{\\sqrt{x - 1}}{x - 4}$ needs $x \\geq 1$ AND $x \\neq 4$. Natural domain: $[1, 4) \\cup (4, \\infty)$.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">NATURAL DOMAIN &mdash; ALGORITHM</div><div class="formula-main">$$\\text{dom}(f) \\;=\\; \\mathbb{R} \\;\\cap\\; \\bigcap_i (\\text{constraint}_i)$$</div><div class="formula-sub">Start with all reals, then chip away the inputs that break the formula. Each "danger zone" (denominator $\\neq 0$, root argument $\\geq 0$, log argument $> 0$) gives one constraint.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 &mdash; FRACTION</div><div class="example-body">Find the natural domain of $f(x) = \\dfrac{2x + 1}{x^2 - 9}$.<br><br>Denominator zero when $x^2 - 9 = 0$, i.e. $x = \\pm 3$. These two values are forbidden.<br>Natural domain: $\\mathbf{\\mathbb{R} \\setminus \\{-3, 3\\}}$, or equivalently $(-\\infty, -3) \\cup (-3, 3) \\cup (3, \\infty)$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; SQUARE ROOT</div><div class="example-body">Find the natural domain of $f(x) = \\sqrt{2x - 6}$.<br><br>Need $2x - 6 \\geq 0$, i.e. $x \\geq 3$.<br>Natural domain: $\\mathbf{[3, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 &mdash; MIXED</div><div class="example-body">Find the natural domain of $f(x) = \\dfrac{\\sqrt{x + 2}}{x - 5}$.<br><br>Two constraints: $x + 2 \\geq 0$ (root) AND $x - 5 \\neq 0$ (denominator).<br>From the first: $x \\geq -2$. From the second: $x \\neq 5$.<br>Natural domain: $\\mathbf{[-2, 5) \\cup (5, \\infty)}$.</div></div>

<div class="l-note"><strong>A subtle point.</strong> Odd-index roots have no domain restriction in the reals. $\\sqrt[3]{x}$ is defined for every real $x$ (including negative numbers, e.g. $\\sqrt[3]{-8} = -2$). Only <em>even-index</em> roots are restricted to non-negative arguments.</div>

<h2 class="lesson-title">5. The Function Table: Input &rarr; Output</h2>

<div class="calc-highlight"><strong>The cleanest way to display a small function is a table.</strong> Two columns: input on the left, output on the right. Every row is one input-output pair. The "function rule" (vending machine) need not be a formula &mdash; it can simply be the list.</div>

<p class="l-text">Suppose Ali earns 50 TL for every package he delivers in one day. The function $f$ that maps "number of packages" to "daily earnings" is described by the table:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;max-width:400px;border-collapse:collapse;font-size:0.92rem;margin:0 auto">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:center;color:#3b82f6">Packages ($x$)</th>
<th style="padding:0.6rem 0.8rem;text-align:center;color:#3b82f6">Earnings $f(x)$ (TL)</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;text-align:center">0</td><td style="padding:0.5rem 0.8rem;text-align:center">0</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;text-align:center">1</td><td style="padding:0.5rem 0.8rem;text-align:center">50</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;text-align:center">2</td><td style="padding:0.5rem 0.8rem;text-align:center">100</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;text-align:center">3</td><td style="padding:0.5rem 0.8rem;text-align:center">150</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;text-align:center">4</td><td style="padding:0.5rem 0.8rem;text-align:center">200</td></tr>
<tr><td style="padding:0.5rem 0.8rem;text-align:center">5</td><td style="padding:0.5rem 0.8rem;text-align:center">250</td></tr>
</tbody></table>
</div>

<p class="l-text">From the table we can read off the formula by spotting the pattern: $f(x) = 50x$. Domain: $\\{0, 1, 2, 3, 4, 5\\}$. Range: $\\{0, 50, 100, 150, 200, 250\\}$.</p>

<p class="l-text"><strong>Arrow diagrams.</strong> An equivalent picture draws two ovals (domain on the left, codomain on the right) and an arrow from each input to its output. The "exactly one output per input" rule becomes <em>at most one arrow leaving each element of the domain</em>. If two arrows ever leave the same input point, the diagram is not a function.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; ARROW DIAGRAM</div><div class="example-body">Let $A = \\{1, 2, 3\\}$, $B = \\{a, b, c, d\\}$. Consider three rules:<br><br><strong>(i)</strong> $1 \\to a$, $2 \\to b$, $3 \\to c$. Function? <em>Yes</em> &mdash; each input has exactly one arrow leaving it.<br><strong>(ii)</strong> $1 \\to a$, $2 \\to b$, $3 \\to b$. Function? <em>Yes</em> &mdash; nothing in the definition forbids two inputs sharing an output.<br><strong>(iii)</strong> $1 \\to a$, $1 \\to b$, $2 \\to c$, $3 \\to d$. Function? <em>No</em> &mdash; the input 1 has two arrows leaving it.<br><strong>(iv)</strong> $1 \\to a$, $2 \\to b$. Function? <em>No</em> &mdash; the input 3 has no arrow leaving it; every element of the domain must be sent somewhere.</div></div>

<h2 class="lesson-title">6. The Function Graph: A Picture in the Plane</h2>

<div class="calc-highlight"><strong>The graph of a function is the set of all points $(x, f(x))$ in the Cartesian plane.</strong> One coordinate (the $x$) is the input. The other coordinate (the $y$) is the output. As $x$ sweeps across the domain, the point $(x, f(x))$ traces a curve.</div>

<div class="calc-formula"><div class="formula-label">GRAPH OF A FUNCTION</div><div class="formula-main">$$\\text{Graph}(f) \\;=\\; \\{(x, y) \\in \\mathbb{R}^2 \\;:\\; x \\in \\text{dom}(f),\\; y = f(x)\\}$$</div><div class="formula-sub">A subset of the plane. Reading the graph from left to right is the same as letting $x$ grow from its smallest value to its largest.</div></div>

<p class="l-text">Reading values from a graph is the inverse of evaluating a formula. To find $f(2)$, locate $x = 2$ on the horizontal axis, go straight up (or down) to the curve, then read off the height &mdash; that is the value of $f(2)$. To find an input that produces a given output $y_0$, draw a horizontal line at height $y_0$ and read the $x$-coordinates where it meets the curve.</p>

<div class="calc-graph"><div id="plot-l40-graph-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the graph of $f(x) = x^2 - 4$ restricted to the domain $[-3, 3]$. The curve is a parabola opening upward. The vertical dotted line at $x = 1.5$ marks the input we are evaluating; the horizontal dotted line shows the resulting output $f(1.5) = -1.75$. Reading the graph: input 1.5 on the x-axis, follow the dotted vertical up to the curve, follow the dotted horizontal across to the y-axis &mdash; arrive at $-1.75$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=120;i++){var x=-3+6*i/120;xs.push(x);ys.push(x*x-4);}
var curveEN={x:xs,y:ys,mode:'lines',name:'f(x) = x² − 4',line:{color:'#3b82f6',width:3}};
var xEval=1.5;var yEval=xEval*xEval-4;
var vDotEN={x:[xEval,xEval],y:[0,yEval],mode:'lines',name:'input x=1.5',line:{color:'#f59e0b',width:1.6,dash:'dot'}};
var hDotEN={x:[-3,xEval],y:[yEval,yEval],mode:'lines',name:'output f(1.5)=−1.75',line:{color:'#f59e0b',width:1.6,dash:'dot'}};
var ptEN={x:[xEval],y:[yEval],mode:'markers+text',name:'(1.5, −1.75)',marker:{color:'#f59e0b',size:11},text:['  (1.5, −1.75)'],textposition:'middle right',textfont:{color:'#e8e8e8',size:11}};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x (input)',range:[-3.3,3.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y = f(x) (output)',range:[-5,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l40-graph-en',[curveEN,vDotEN,hDotEN,ptEN],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Reading the domain and range from a graph.</strong> The <em>domain</em> is the shadow of the curve on the horizontal axis (the set of $x$-values it covers). The <em>range</em> is the shadow on the vertical axis (the set of $y$-values it covers). In the plot above, the domain is the interval $[-3, 3]$ and the range is the interval $[-4, 5]$ (minimum at the vertex, maximum at the endpoints).</p>

<h2 class="lesson-title">7. The Vertical Line Test</h2>

<div class="calc-highlight"><strong>The vertical line test answers a single question:</strong> is this curve drawn in the plane the graph of a function? It is the visual counterpart of "each input has exactly one output" and it takes three seconds to apply.</div>

<div class="calc-formula"><div class="formula-label">VERTICAL LINE TEST</div><div class="formula-main">$$\\text{A curve is the graph of a function } \\iff \\text{every vertical line meets it in at most one point.}$$</div><div class="formula-sub">If any vertical line $x = a$ crosses the curve in two or more points, the input $a$ would have two different outputs &mdash; violating the function definition.</div></div>

<p class="l-text"><strong>Why it works.</strong> A vertical line $x = a$ is the set of points $\\{(a, y) : y \\in \\mathbb{R}\\}$. If this line crosses the curve at two points $(a, y_1)$ and $(a, y_2)$ with $y_1 \\neq y_2$, then the input $a$ would correspond to two outputs at the same time. That violates the rule "each input has exactly one output", so the curve cannot be the graph of a function.</p>

<div class="calc-graph"><div id="plot-l40-vlt-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two curves side by side. The <em>blue</em> curve is $y = x^2$ &mdash; the parabola from lesson 4. Any vertical line meets it in exactly one point: this <em>is</em> a function. The <em>red</em> curve is the circle $x^2 + y^2 = 4$. Vertical lines in the interior (e.g. $x = 0$, shown dotted) meet the circle in <em>two</em> points: the circle is <em>not</em> the graph of a function. It is a relation, but not a function.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pxs=[];var pys=[];for(var i=0;i<=120;i++){var x=-2.2+4.4*i/120;pxs.push(x);pys.push(x*x);}
var parabolaEN={x:pxs,y:pys,mode:'lines',name:'y = x² (function)',line:{color:'#3b82f6',width:3}};
var cxsT=[];var cysT=[];var cxsB=[];var cysB=[];for(var k=0;k<=80;k++){var th=Math.PI*k/80;cxsT.push(2*Math.cos(th));cysT.push(2*Math.sin(th));cxsB.push(2*Math.cos(-th));cysB.push(2*Math.sin(-th));}
var circleTopEN={x:cxsT,y:cysT,mode:'lines',name:'x²+y²=4 upper (red)',line:{color:'#ef4444',width:3}};
var circleBotEN={x:cxsB,y:cysB,mode:'lines',name:'x²+y²=4 lower',line:{color:'#ef4444',width:3},showlegend:false};
var vLine1EN={x:[1,1],y:[-3,5],mode:'lines',name:'vertical x=1 (1 hit on parabola)',line:{color:'rgba(59,130,246,0.5)',width:1.5,dash:'dot'}};
var vLine2EN={x:[0,0],y:[-3,5],mode:'lines',name:'vertical x=0 (2 hits on circle)',line:{color:'rgba(239,68,68,0.5)',width:1.5,dash:'dot'}};
var hits1EN={x:[1],y:[1],mode:'markers',name:'parabola hit',marker:{color:'#3b82f6',size:11}};
var hits2EN={x:[0,0],y:[2,-2],mode:'markers',name:'circle hits (2!)',marker:{color:'#ef4444',size:11}};
var layoutVLT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l40-vlt-en',[parabolaEN,circleTopEN,circleBotEN,vLine1EN,vLine2EN,hits1EN,hits2EN],layoutVLT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; APPLY THE TEST</div><div class="example-body">Decide whether each curve is the graph of a function.<br><br>(a) The line $y = 2x + 3$. <em>Every vertical line meets it in exactly one point. Yes &mdash; function.</em><br>(b) The parabola opening sideways $x = y^2$. <em>Vertical line $x = 1$ meets it at $(1, 1)$ and $(1, -1)$. Not a function.</em><br>(c) The semicircle $y = \\sqrt{1 - x^2}$. <em>Every vertical line in $[-1, 1]$ meets it in one point (the upper half only). Yes &mdash; function.</em><br>(d) An ellipse $\\frac{x^2}{4} + \\frac{y^2}{9} = 1$. <em>Vertical lines in the interior meet it twice. Not a function.</em></div></div>

<div class="l-note"><strong>Why the distinction matters.</strong> Many shapes in geometry (circles, ellipses, hyperbolas drawn fully) are not functions of $x$. To handle them with the function machinery, we either split them into upper and lower halves (each a function on its own), or we use a different framework: <em>parametric equations</em> (lesson L52) or <em>polar coordinates</em>.</div>

<h2 class="lesson-title">8. Equal Functions: Same Domain + Same Rule</h2>

<div class="calc-highlight"><strong>Two functions $f$ and $g$ are equal if and only if they have the same domain AND they produce the same output for every input.</strong> Two formulas that look algebraically identical can still define <em>different</em> functions if their declared domains differ.</div>

<div class="calc-formula"><div class="formula-label">EQUALITY OF FUNCTIONS</div><div class="formula-main">$$f = g \\iff \\Big(\\text{dom}(f) = \\text{dom}(g)\\Big) \\;\\text{AND}\\; \\Big(\\forall x \\in \\text{dom}(f),\\; f(x) = g(x)\\Big)$$</div><div class="formula-sub">Both conditions must hold. Same domain alone is not enough. Same rule alone is not enough.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Let $f(x) = x$ on the domain $\\mathbb{R}$, and $g(x) = \\dfrac{x^2}{x}$ on its natural domain.<br><br>Algebraically, $\\dfrac{x^2}{x} = x$ when $x \\neq 0$. So they have the same rule. But the natural domain of $g$ excludes 0 (denominator), while $f$ is defined at $0$. Hence $\\text{dom}(f) = \\mathbb{R} \\neq \\mathbb{R}\\setminus\\{0\\} = \\text{dom}(g)$.<br><br>Conclusion: $\\mathbf{f \\neq g}$. Even though the formulas simplify to the same thing, the domains differ.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Let $f(x) = (x+1)^2$ and $g(x) = x^2 + 2x + 1$, both on the domain $\\mathbb{R}$.<br><br>Domains: both $\\mathbb{R}$. Equal. Rules: $(x+1)^2 = x^2 + 2x + 1$ (binomial expansion). Equal.<br><br>Conclusion: $\\mathbf{f = g}$.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Are $f(x) = |x|$ and $g(x) = \\sqrt{x^2}$ equal as functions on $\\mathbb{R}$? (Yes &mdash; both have domain $\\mathbb{R}$ and both produce the non-negative version of $x$ for every input.)</div></div>

<h2 class="lesson-title">9. Practice Set &mdash; 8 Classical Problems</h2>

<div class="calc-graph"><div id="plot-l40-range-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the function $f(x) = -x^2 + 6$ on the domain $[-2, 2]$. The shaded vertical band on the x-axis marks the <em>domain</em>; the shaded horizontal band on the y-axis marks the <em>range</em>. The maximum output 6 is achieved at $x = 0$ (vertex); the minimum output 2 is achieved at the endpoints $x = \\pm 2$. So the range is $[2, 6]$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var rxs=[];var rys=[];for(var i=0;i<=80;i++){var x=-2+4*i/80;rxs.push(x);rys.push(-x*x+6);}
var curveRangeEN={x:rxs,y:rys,mode:'lines',name:'f(x) = −x² + 6',line:{color:'#3b82f6',width:3}};
var domainBandEN={x:[-2,2,2,-2,-2],y:[-0.4,-0.4,-0.05,-0.05,-0.4],fill:'toself',mode:'lines',name:'domain [−2, 2]',line:{color:'#22c55e',width:1},fillcolor:'rgba(34,197,94,0.25)'};
var rangeBandEN={x:[-3.4,-3.05,-3.05,-3.4,-3.4],y:[2,2,6,6,2],fill:'toself',mode:'lines',name:'range [2, 6]',line:{color:'#f59e0b',width:1},fillcolor:'rgba(245,158,11,0.25)'};
var endPtsEN={x:[-2,0,2],y:[2,6,2],mode:'markers+text',name:'endpoints + vertex',marker:{color:'#e8e8e8',size:9},text:['  (−2, 2)','  (0, 6)','  (2, 2)'],textposition:'top right',textfont:{color:'#e8e8e8',size:10}};
var layoutRangeEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.6,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y = f(x)',range:[-0.8,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l40-range-en',[curveRangeEN,domainBandEN,rangeBandEN,endPtsEN],layoutRangeEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; EVALUATION</div><div class="example-body"><strong>Let $f(x) = 3x^2 - 2x + 5$. Find $f(0)$, $f(-1)$, $f(2)$.</strong><br><br>$f(0) = 3 \\cdot 0 - 2 \\cdot 0 + 5 = \\mathbf{5}$.<br>$f(-1) = 3(-1)^2 - 2(-1) + 5 = 3 + 2 + 5 = \\mathbf{10}$.<br>$f(2) = 3 \\cdot 4 - 2 \\cdot 2 + 5 = 12 - 4 + 5 = \\mathbf{13}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; DOMAIN OF A FRACTION</div><div class="example-body"><strong>Find the natural domain of $f(x) = \\dfrac{x + 3}{x^2 - 4x + 3}$.</strong><br><br>Factor the denominator: $x^2 - 4x + 3 = (x - 1)(x - 3)$. It vanishes at $x = 1$ and $x = 3$.<br>Natural domain: $\\mathbf{\\mathbb{R} \\setminus \\{1, 3\\}}$, i.e. $(-\\infty, 1) \\cup (1, 3) \\cup (3, \\infty)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; DOMAIN OF A SQUARE ROOT</div><div class="example-body"><strong>Find the natural domain of $f(x) = \\sqrt{9 - x^2}$.</strong><br><br>Need $9 - x^2 \\geq 0 \\iff x^2 \\leq 9 \\iff -3 \\leq x \\leq 3$.<br>Natural domain: $\\mathbf{[-3, 3]}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; DOMAIN MIXED</div><div class="example-body"><strong>Find the natural domain of $f(x) = \\dfrac{\\sqrt{x + 1}}{x - 2}$.</strong><br><br>Root constraint: $x + 1 \\geq 0 \\iff x \\geq -1$.<br>Denominator constraint: $x \\neq 2$.<br>Intersection: $\\mathbf{[-1, 2) \\cup (2, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; RANGE FROM A FINITE DOMAIN</div><div class="example-body"><strong>Let $f: \\{-2, -1, 0, 1, 2\\} \\to \\mathbb{Z}$ with $f(x) = x^3 - x$. Find the range.</strong><br><br>$f(-2) = -8 + 2 = -6$.<br>$f(-1) = -1 + 1 = 0$.<br>$f(0) = 0$.<br>$f(1) = 1 - 1 = 0$.<br>$f(2) = 8 - 2 = 6$.<br>Unique values: $\\mathbf{\\{-6, 0, 6\\}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; VERTICAL LINE TEST</div><div class="example-body"><strong>Decide whether each curve is the graph of a function.</strong><br><br>(a) $y = x^3 - 2x + 1$. Cubic polynomial &mdash; passes the test. <em>Function.</em><br>(b) $x = y^2 - 4$. Sideways parabola; for $x = 0$ we get $y = \\pm 2$ &mdash; two outputs. <em>Not a function.</em><br>(c) The unit circle $x^2 + y^2 = 1$. Vertical line $x = 0$ meets at $y = \\pm 1$. <em>Not a function.</em><br>(d) $y = \\sqrt{x}$. Each non-negative $x$ has one positive root. <em>Function.</em></div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; EVALUATING WITH AN EXPRESSION</div><div class="example-body"><strong>Let $f(x) = x^2 + 1$. Find $f(2a)$ and $f(a + 1) - f(a)$.</strong><br><br>$f(2a) = (2a)^2 + 1 = \\mathbf{4a^2 + 1}$.<br>$f(a + 1) = (a+1)^2 + 1 = a^2 + 2a + 2$.<br>$f(a) = a^2 + 1$.<br>$f(a+1) - f(a) = (a^2 + 2a + 2) - (a^2 + 1) = \\mathbf{2a + 1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; EQUAL FUNCTIONS?</div><div class="example-body"><strong>Are $f(x) = \\dfrac{x^2 - 1}{x - 1}$ and $g(x) = x + 1$ equal?</strong><br><br>Simplify: $\\dfrac{x^2 - 1}{x - 1} = \\dfrac{(x-1)(x+1)}{x-1} = x + 1$ for $x \\neq 1$.<br>Natural domain of $f$: $\\mathbb{R}\\setminus\\{1\\}$. Natural domain of $g$: $\\mathbb{R}$.<br>Domains differ &mdash; hence $\\mathbf{f \\neq g}$. They agree on $\\mathbb{R}\\setminus\\{1\\}$ but $g$ is also defined at $x = 1$ (giving $g(1) = 2$) while $f$ is not.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> In lesson L41 we will use this notation to study a special family: <em>linear functions</em> of the form $f(x) = ax + b$. We will learn to read slope and intercept off a graph and to fit a line through two given points. Make sure the notation $f(x)$, the concepts of domain and range, and the vertical line test are second nature before moving on.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>A function assigns to each input <em>exactly one</em> output</li>
<li>Notation: $f: A \\to B$, $x \\mapsto f(x)$, value at input read as "f of x"</li>
<li>Domain = allowed inputs; range = produced outputs; codomain = target set</li>
<li>Natural domain rules: no zero in denominators; no negative under even-index roots</li>
<li>A function can be presented as a table, an arrow diagram, a formula, or a graph</li>
<li>Vertical line test: every vertical line meets a function graph in at most one point</li>
<li>Two functions are equal iff their domains match AND their rules agree on every input</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Fonksiyon, matematiğin en kullanışlı fikridir.</strong> Şu ana kadar yazdığınız her formül — dairenin alanı yarıçapın bir fonksiyonu olarak, sıcaklık zamanın fonksiyonu olarak, bir domatesin fiyatı ağırlığının fonksiyonu olarak — aslında kılık değiştirmiş bir fonksiyondur. Bu derste fikri özüne indirgeyecek, kesin bir tanım vereceğiz, dünyanın her köşesindeki matematikçilerin kullandığı standart notasyonu öğreneceğiz ve her lise öğrencisinin ustalaşması gereken iki temel beceriyi kazanacağız: <em>tanım kümesini</em> (hangi girdilere izin var) ve <em>görüntü kümesini</em> (hangi çıktılar üretiliyor) bulmak.</p>

<p class="l-text">Bu dersin sonunda $f(x)$ sembolünü doğru okuyabilecek, verilen bir kuralın bir fonksiyon tanımlayıp tanımlamadığını söyleyebilecek, bir formülün doğal tanım kümesini iki klasik "tehlike bölgesini" (paydanın sıfıra eşitlenmesi ve karekök içinin negatif olması) kontrol ederek bulabilecek ve karşınıza çıkan herhangi bir grafiğe <em>dikey doğru testini</em> uygulayarak grafiğin bir fonksiyon mu yoksa sadece bir bağıntı mı olduğuna anında karar verebileceksiniz. Bunlar, sonraki on dersin (doğrusal fonksiyonlar, ikinci dereceden fonksiyonlar, polinom fonksiyonlar, ters fonksiyon, bileşke fonksiyon) üzerine inşa edileceği temellerdir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NELERİ ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Fonksiyonu, her girdiye <em>tam olarak bir</em> çıktı atayan kural olarak tanımlamak</li>
<li>$f: A \\to B$ ve $y = f(x)$ standart notasyonunu akıcı biçimde okuyup yazmak</li>
<li>Bir fonksiyonun tanım kümesini (izinli girdiler) ve görüntü kümesini (üretilen çıktılar) bulmak</li>
<li>Cebirsel bir formülün doğal tanım kümesini "payda sıfır olmayacak" ve "kök içi negatif olmayacak" kurallarıyla belirlemek</li>
<li>Bir fonksiyonu tablo, ok diyagramı, denklem veya grafik biçiminde okumak</li>
<li>Düzlemdeki bir eğrinin bir fonksiyonun grafiği olup olmadığına dikey doğru testiyle karar vermek</li>
</ul>
</div>

<h2 class="lesson-title">1. Fonksiyon Nedir? Günlük Dilden Tanım</h2>

<div class="calc-highlight"><strong>Tek cümleyle:</strong> fonksiyon, bir kümenin (girdiler) herhangi bir elemanını alıp, başka bir kümenin <em>tam olarak bir</em> elemanını döndüren bir kuraldır. Hiçbir girdi çıktısız kalmaz. Hiçbir girdi iki farklı çıktı üretmez. Tanımın tamamı bu kadar.</div>

<p class="l-text">Bir otomatı düşünün. "B7" düğmesine basıyorsunuz ve bir çikolata düşüyor. Tekrar "B7"ye basıyorsunuz, <em>aynı</em> çikolata (peki, tıpatıp benzeri) düşüyor. "B7"ye bastığınızda bazen çikolata bazen cips veren bir makine bozuk olurdu. Fonksiyon, hiçbir zaman bozulmayan bir otomattır: aynı girdi daima aynı çıktıyı verir.</p>

<p class="l-text">Daha biçimsel: $A$ kümesinden $B$ kümesine bir $f$ fonksiyonu, $A$'nın her bir $a$ elemanını $B$'nin tam olarak bir $b$ elemanıyla eşleştiren bir atamadır. $A$'ya <strong>tanım kümesi</strong> (allowed inputs), $B$'ye <strong>değer kümesi (codomain)</strong> (çıktıların aranacağı küme) denir; "$f$ fonksiyonu $a$ girdisini $b$ çıktısına gönderir" demek için $f(a) = b$ yazarız.</p>

<div class="calc-formula"><div class="formula-label">FONKSİYON &mdash; TANIM</div><div class="formula-main">$$f: A \\to B \\qquad\\text{şu şekilde ki}\\qquad \\forall a \\in A,\\;\\exists!\\; b \\in B \\text{ ile } f(a) = b$$</div><div class="formula-sub">"$A$'daki her $a$ için, $f(a) = b$ olacak şekilde $B$'de tam olarak bir $b$ vardır." $\\exists!$ sembolü "tam olarak bir tane vardır" demektir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tanım kümesi (Domain)</div><div class="card-body">İzinli girdilerin oluşturduğu $A$ kümesi. $A$'nın her elemanı bir yere gönderilmek zorunda.</div></div>
<div class="calc-card"><div class="card-title">Değer kümesi (Codomain)</div><div class="card-body">Çıktıların yer aldığı $B$ kümesi. $B$'nin her elemanına ulaşılması zorunlu değildir &mdash; sadece gerçekten üretilenler sayılır.</div></div>
<div class="calc-card"><div class="card-title">Görüntü kümesi (Range)</div><div class="card-body">$B$'nin gerçekten fonksiyon tarafından <em>ulaşılan</em> alt kümesi. Her zaman değer kümesinin bir alt kümesidir.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Aşağıdakilerden hangisi bir fonksiyondur? <br><br>(a) Her Türk vatandaşına TC kimlik numarasını atayan kural. <br>(b) Her telefon numarasına o numarayı kullanan kişileri atayan kural. <br>(c) Her pozitif gerçel sayıya karesini atayan kural. <br><br>Cevap: (a) ve (c) fonksiyondur (her girdiye bir çıktı). (b) fonksiyon <em>değildir</em> &mdash; tek bir numara birden fazla kişiye ait olabilir, yani tek girdi birden fazla çıktı üretir.</div></div>

<h2 class="lesson-title">2. Sözcükten Sembol Notasyonuna</h2>

<div class="calc-highlight"><strong>$y = f(x)$ kısaltması bir cümlenin tamamını yazmaktan kurtarır.</strong> Şunu söyler: "$y$, $f$ fonksiyonuna $x$ girdisini verdiğinizde elde ettiğiniz şeydir." Bu notasyonu içselleştirdiğinizde, müfredatın geri kalanındaki her formül daha kısa ve daha açık hale gelir.</div>

<p class="l-text">Türkçesi: "Bir sayı al, iki katına çıkar, 1 ekle." Sembolde: $f(x) = 2x + 1$. $f$ sembolü fonksiyonun <em>adıdır</em> (herhangi bir harf olabilir &mdash; $g$, $h$, $\\phi$ yaygındır). Parantez içindeki $x$ harfi <em>girdi değişkenidir</em> (herhangi bir sembol çalışır &mdash; $f(t)$, $f(u)$, $f(\\square)$ aynı fonksiyonu farklı bir girdi adıyla anlatır). Sağdaki ifade ise <em>kuraldır</em>.</p>

<div class="calc-formula"><div class="formula-label">STANDART NOTASYON</div><div class="formula-main">$$f: A \\to B,\\qquad x \\mapsto f(x)$$</div><div class="formula-sub">Sesli okuyunuz: "$f$, $A$'dan $B$'ye bir fonksiyondur ve $x$'i $f(x)$'e gönderir." $\\mapsto$ oku ("gönderilir") fonksiyonun eylemini, kümeler arasındaki $\\to$ oku tanım ve değer kümesini gösterir.</div></div>

<p class="l-text"><strong>Fonksiyon değerini hesaplama.</strong> $f(3)$'ü bulmak için kuraldaki her $x$ yerine 3 sayısını koyup hesaplayın. Parantez çarpma anlamına gelmez &mdash; girdiyi tutar.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$f(x) = 2x + 1$ olsun. $f(0)$, $f(3)$, $f(-2)$ ve $f(a + 1)$ değerlerini bul.<br><br>$f(0) = 2 \\cdot 0 + 1 = \\mathbf{1}$.<br>$f(3) = 2 \\cdot 3 + 1 = \\mathbf{7}$.<br>$f(-2) = 2 \\cdot (-2) + 1 = \\mathbf{-3}$.<br>$f(a + 1) = 2(a + 1) + 1 = 2a + 2 + 1 = \\mathbf{2a + 3}$.<br><br>Dikkat: son hesaplamada "girdi" koca bir ifade. Kural yine işliyor &mdash; her $x$ yerine girdiyi yaz, ne kadar karmaşık olursa olsun.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">FONKSİYON ADI vs GİRDİ</div><div class="compare-item">$f$ &mdash; fonksiyon (kuralın kendisi)</div><div class="compare-item">$x$ &mdash; girdi (yer tutucu)</div><div class="compare-item">$f(x)$ &mdash; çıktı ($x$ sabitlendiğinde bir sayı)</div><div class="compare-item">$f$ ile $f(x)$ <em>farklı nesnelerdir</em> &mdash; biri makine, diğeri makineden çıkan şey.</div></div><div class="compare-col"><div class="compare-title">YAYGIN SEMBOLLER</div><div class="compare-item">$y = f(x)$ &mdash; "y, f aracılığıyla x'e bağlıdır"</div><div class="compare-item">$g(t)$, $h(u)$ &mdash; farklı harfler, aynı fikir</div><div class="compare-item">$f^{-1}$ &mdash; ters fonksiyon (L47'de)</div><div class="compare-item">$f \\circ g$ &mdash; bileşke fonksiyon (L48'de)</div></div></div>

<div class="l-note"><strong>Sık yapılan hata:</strong> öğrenciler parantezi çarpma sanarak $f \\cdot (3)$ yazıyorlar. Öyle değil. $f(3)$, $f$ fonksiyonunun 3 girdisindeki değeridir &mdash; çarpım değil, tek bir sayı. Bu notasyon cebirden iki yüzyıl öncesine dayanır; tarihi bir gelenektir ama evrenseldir.</div>

<h2 class="lesson-title">3. Tanım Kümesi ve Görüntü Kümesi</h2>

<div class="calc-highlight"><strong>Her fonksiyon iki küme taşır:</strong> beslemeye izin verilen girdilerin kümesi (tanım kümesi) ve gerçekten çıkan çıktıların kümesi (görüntü kümesi). Tanım kümesini belirtmeden bir fonksiyon vermek, boyutunu söylemeden pizza sipariş etmeye benzer &mdash; teknik olarak mümkün, pratik olarak işe yaramaz.</div>

<p class="l-text">Basit bir örneğe bakalım: $f(x) = x^2$, $A = \\{-2, -1, 0, 1, 2\\}$ tanım kümesinde. Tek tek değerlendirelim: çıktılar $\\{4, 1, 0, 1, 4\\}$. <strong>Görüntü kümesi</strong> $\\{0, 1, 4\\}$ &mdash; küme olduğu için tekrar eden değerleri tek kez yazıyoruz (kümeler katlılığı saymaz).</p>

<div class="calc-formula"><div class="formula-label">TANIM VE GÖRÜNTÜ KÜMELERİ</div><div class="formula-main">$$\\text{dom}(f) = A \\qquad\\qquad \\text{ran}(f) = \\{f(a) : a \\in A\\} \\subseteq B$$</div><div class="formula-sub">Tanım kümesi verilir (önceden bildirilir). Görüntü kümesi hesaplanır (her girdiyi tarayarak gerçekten üretilen çıktıların kümesi).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$f: \\{1, 2, 3, 4\\} \\to \\mathbb{N}$, $f(x) = x + 5$ olsun. dom $f$ ve ran $f$'i bul.<br><br>Tanım kümesi verilmiş: $\\text{dom}(f) = \\{1, 2, 3, 4\\}$.<br>Çıktıları hesapla: $f(1)=6, f(2)=7, f(3)=8, f(4)=9$. Yani $\\text{ran}(f) = \\mathbf{\\{6, 7, 8, 9\\}}$.<br><br>Değer kümesi $\\mathbb{N}$ (tüm doğal sayılar); görüntü kümesi çok daha küçük bir alt küme.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$g: \\{-3, -2, -1, 0, 1, 2, 3\\} \\to \\mathbb{Z}$, $g(x) = x^2 - 4$ olsun. ran $g$'yi bul.<br><br>Her birini hesapla: $g(-3)=5, g(-2)=0, g(-1)=-3, g(0)=-4, g(1)=-3, g(2)=0, g(3)=5$.<br>Tekrar etmeyen değerleri listele: $\\text{ran}(g) = \\mathbf{\\{-4, -3, 0, 5\\}}$.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$f(x) = 3x - 7$ ve tanım kümesi $\\{0, 1, 2, 3\\}$ ise görüntü kümesini yaz. (Cevap: $\\{-7, -4, -1, 2\\}$.)</div></div>

<h2 class="lesson-title">4. Doğal Tanım Kümesi: İki Tehlike Bölgesi</h2>

<div class="calc-highlight"><strong>Bir fonksiyon tanım kümesi belirtilmeden formülle verildiğinde, gelenek $\\mathbb{R}$'nin formülün anlam taşıdığı en büyük alt kümesini almaktır.</strong> Bu kümeye <em>doğal tanım kümesi</em> denir. Lisede karşılaşacağınız hemen hemen her problemi iki kural çözer.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kural 1: Paydada sıfır yok</div><div class="card-body">Sıfıra bölme tanımsızdır. Yani $f(x) = \\dfrac{1}{x - 2}$ için $x = 2$ girdisi yasaktır. Doğal tanım kümesi $\\mathbb{R} \\setminus \\{2\\}$.</div></div>
<div class="calc-card"><div class="card-title">Kural 2: Çift indisli kök içi negatif olamaz</div><div class="card-body">$\\sqrt{x}$ gerçel sayılarda yalnız $x \\geq 0$ için tanımlıdır. Bu nedenle $f(x) = \\sqrt{x - 3}$ için $x - 3 \\geq 0$, yani $x \\geq 3$ gerekir. Doğal tanım kümesi $[3, \\infty)$.</div></div>
<div class="calc-card"><div class="card-title">Birleşik durum</div><div class="card-body">Bir formülde her iki kural birlikte varsa kısıtlamaların kesişimini alın. Örnek: $f(x) = \\dfrac{\\sqrt{x - 1}}{x - 4}$ için $x \\geq 1$ VE $x \\neq 4$. Doğal tanım kümesi $[1, 4) \\cup (4, \\infty)$.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">DOĞAL TANIM KÜMESİ &mdash; YÖNTEM</div><div class="formula-main">$$\\text{dom}(f) \\;=\\; \\mathbb{R} \\;\\cap\\; \\bigcap_i (\\text{kısıt}_i)$$</div><div class="formula-sub">Tüm gerçellerden başla, formülü bozan girdileri tek tek çıkar. Her "tehlike bölgesi" (payda $\\neq 0$, kök içi $\\geq 0$, logaritma içi $> 0$) bir kısıtlama doğurur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1 &mdash; KESİR</div><div class="example-body">$f(x) = \\dfrac{2x + 1}{x^2 - 9}$ fonksiyonunun doğal tanım kümesini bul.<br><br>Payda $x^2 - 9 = 0$ olduğunda sıfırdır, yani $x = \\pm 3$. Bu iki değer yasak.<br>Doğal tanım kümesi: $\\mathbf{\\mathbb{R} \\setminus \\{-3, 3\\}}$, yani $(-\\infty, -3) \\cup (-3, 3) \\cup (3, \\infty)$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 &mdash; KAREKÖK</div><div class="example-body">$f(x) = \\sqrt{2x - 6}$ fonksiyonunun doğal tanım kümesini bul.<br><br>$2x - 6 \\geq 0$, yani $x \\geq 3$ gerekir.<br>Doğal tanım kümesi: $\\mathbf{[3, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3 &mdash; KARIŞIK</div><div class="example-body">$f(x) = \\dfrac{\\sqrt{x + 2}}{x - 5}$ fonksiyonunun doğal tanım kümesini bul.<br><br>İki kısıt: $x + 2 \\geq 0$ (kök) VE $x - 5 \\neq 0$ (payda).<br>Birinciden: $x \\geq -2$. İkinciden: $x \\neq 5$.<br>Doğal tanım kümesi: $\\mathbf{[-2, 5) \\cup (5, \\infty)}$.</div></div>

<div class="l-note"><strong>İnce bir nokta.</strong> Tek indisli köklerin gerçellerde tanım kısıtı yoktur. $\\sqrt[3]{x}$ her gerçel $x$ için tanımlıdır (negatif sayılar da dahil, ör. $\\sqrt[3]{-8} = -2$). Sadece <em>çift indisli</em> kökler negatif olmayan argümanla sınırlıdır.</div>

<h2 class="lesson-title">5. Fonksiyon Tablosu: Girdi &rarr; Çıktı</h2>

<div class="calc-highlight"><strong>Küçük bir fonksiyonu göstermenin en temiz yolu tablodur.</strong> İki sütun: solda girdi, sağda çıktı. Her satır bir girdi-çıktı çifti. "Fonksiyon kuralı" (otomat) bir formül olmak zorunda değildir &mdash; sadece bir liste de olabilir.</div>

<p class="l-text">Ali bir günde teslim ettiği her paket için 50 TL kazanıyor. "Paket sayısı"nı "günlük kazanç"a eşleyen $f$ fonksiyonu şu tabloyla verilir:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;max-width:400px;border-collapse:collapse;font-size:0.92rem;margin:0 auto">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:center;color:#3b82f6">Paket ($x$)</th>
<th style="padding:0.6rem 0.8rem;text-align:center;color:#3b82f6">Kazanç $f(x)$ (TL)</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;text-align:center">0</td><td style="padding:0.5rem 0.8rem;text-align:center">0</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;text-align:center">1</td><td style="padding:0.5rem 0.8rem;text-align:center">50</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;text-align:center">2</td><td style="padding:0.5rem 0.8rem;text-align:center">100</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;text-align:center">3</td><td style="padding:0.5rem 0.8rem;text-align:center">150</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;text-align:center">4</td><td style="padding:0.5rem 0.8rem;text-align:center">200</td></tr>
<tr><td style="padding:0.5rem 0.8rem;text-align:center">5</td><td style="padding:0.5rem 0.8rem;text-align:center">250</td></tr>
</tbody></table>
</div>

<p class="l-text">Tablodan örüntüyü görerek formülü okuyabiliriz: $f(x) = 50x$. Tanım kümesi: $\\{0, 1, 2, 3, 4, 5\\}$. Görüntü kümesi: $\\{0, 50, 100, 150, 200, 250\\}$.</p>

<p class="l-text"><strong>Ok diyagramları.</strong> Eşdeğer bir resim: iki oval çiz (solda tanım kümesi, sağda değer kümesi) ve her girdiden çıktısına bir ok at. "Her girdinin tam olarak bir çıktısı vardır" kuralı, <em>tanım kümesinin her elemanından en fazla bir ok çıkar</em> haline gelir. Bir girdi noktasından iki ok çıkıyorsa diyagram bir fonksiyon değildir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; OK DİYAGRAMI</div><div class="example-body">$A = \\{1, 2, 3\\}$, $B = \\{a, b, c, d\\}$ olsun. Üç kuralı düşün:<br><br><strong>(i)</strong> $1 \\to a$, $2 \\to b$, $3 \\to c$. Fonksiyon mu? <em>Evet</em> &mdash; her girdiden tam bir ok çıkıyor.<br><strong>(ii)</strong> $1 \\to a$, $2 \\to b$, $3 \\to b$. Fonksiyon mu? <em>Evet</em> &mdash; tanımda "iki farklı girdi aynı çıktıya gitsin" yasağı yok.<br><strong>(iii)</strong> $1 \\to a$, $1 \\to b$, $2 \\to c$, $3 \\to d$. Fonksiyon mu? <em>Hayır</em> &mdash; 1 girdisinden iki ok çıkıyor.<br><strong>(iv)</strong> $1 \\to a$, $2 \\to b$. Fonksiyon mu? <em>Hayır</em> &mdash; 3 girdisinden hiç ok çıkmıyor; tanım kümesinin her elemanı bir yere gönderilmeli.</div></div>

<h2 class="lesson-title">6. Fonksiyon Grafiği: Düzlemdeki Bir Resim</h2>

<div class="calc-highlight"><strong>Bir fonksiyonun grafiği, kartezyen düzlemdeki tüm $(x, f(x))$ noktalarının kümesidir.</strong> Bir koordinat (yatay $x$) girdidir. Diğer koordinat (dikey $y$) çıktıdır. $x$, tanım kümesi boyunca süpürdükçe, $(x, f(x))$ noktası bir eğri çizer.</div>

<div class="calc-formula"><div class="formula-label">FONKSİYONUN GRAFİĞİ</div><div class="formula-main">$$\\text{Graf}(f) \\;=\\; \\{(x, y) \\in \\mathbb{R}^2 \\;:\\; x \\in \\text{dom}(f),\\; y = f(x)\\}$$</div><div class="formula-sub">Düzlemin bir alt kümesidir. Grafiği soldan sağa okumak, $x$'in en küçük değerinden en büyüğüne büyümesiyle aynı şeydir.</div></div>

<p class="l-text">Grafikten değer okumak, formül değerlendirmenin tersidir. $f(2)$'yi bulmak için yatay eksende $x = 2$'yi bul, dik olarak yukarı (veya aşağı) çık, eğriye değdiğin yerden yüksekliği oku &mdash; $f(2)$ değeri budur. Verilen bir $y_0$ çıktısını üreten girdiyi bulmak için $y_0$ yüksekliğinde yatay bir doğru çiz ve eğriyle kesiştiği yerlerdeki $x$ koordinatlarını oku.</p>

<div class="calc-graph"><div id="plot-l40-graph-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $f(x) = x^2 - 4$ fonksiyonunun $[-3, 3]$ tanım kümesindeki grafiği. Eğri yukarı açılan bir paraboldür. $x = 1.5$'taki dikey kesik çizgi değerlendirdiğimiz girdiyi işaret eder; yatay kesik çizgi ise ortaya çıkan $f(1.5) = -1.75$ çıktısını gösterir. Grafiği okuma: yatay eksende 1.5 girdisini bul, dikey kesik çizgiyi takip ederek eğriye çık, yatay kesik çizgiyi izleyerek $y$ eksenine git &mdash; $-1.75$'e var.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=120;i++){var x=-3+6*i/120;xs.push(x);ys.push(x*x-4);}
var curveTR={x:xs,y:ys,mode:'lines',name:'f(x) = x² − 4',line:{color:'#3b82f6',width:3}};
var xEval=1.5;var yEval=xEval*xEval-4;
var vDotTR={x:[xEval,xEval],y:[0,yEval],mode:'lines',name:'girdi x=1.5',line:{color:'#f59e0b',width:1.6,dash:'dot'}};
var hDotTR={x:[-3,xEval],y:[yEval,yEval],mode:'lines',name:'çıktı f(1.5)=−1.75',line:{color:'#f59e0b',width:1.6,dash:'dot'}};
var ptTR={x:[xEval],y:[yEval],mode:'markers+text',name:'(1.5, −1.75)',marker:{color:'#f59e0b',size:11},text:['  (1.5, −1.75)'],textposition:'middle right',textfont:{color:'#e8e8e8',size:11}};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x (girdi)',range:[-3.3,3.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y = f(x) (çıktı)',range:[-5,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l40-graph-tr',[curveTR,vDotTR,hDotTR,ptTR],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Grafikten tanım ve görüntü kümesini okuma.</strong> <em>Tanım kümesi</em>, eğrinin yatay eksene düşen gölgesidir (kapsadığı $x$ değerleri). <em>Görüntü kümesi</em>, dikey eksene düşen gölgedir (kapsadığı $y$ değerleri). Yukarıdaki grafikte tanım kümesi $[-3, 3]$ aralığı, görüntü kümesi ise $[-4, 5]$ aralığıdır (minimum tepe noktasında, maksimum uç noktalarda).</p>

<h2 class="lesson-title">7. Dikey Doğru Testi</h2>

<div class="calc-highlight"><strong>Dikey doğru testi tek bir soruya cevap verir:</strong> bu çizilen eğri bir fonksiyonun grafiği midir? "Her girdinin tam olarak bir çıktısı vardır" tanımının görsel karşılığıdır ve uygulanması üç saniye sürer.</div>

<div class="calc-formula"><div class="formula-label">DİKEY DOĞRU TESTİ</div><div class="formula-main">$$\\text{Bir eğri bir fonksiyonun grafiğidir} \\iff \\text{her dikey doğru ona en fazla bir noktada değer.}$$</div><div class="formula-sub">Herhangi bir dikey $x = a$ doğrusu eğriyi iki veya daha fazla noktada keserse, $a$ girdisinin iki farklı çıktısı olur &mdash; fonksiyon tanımı çiğnenir.</div></div>

<p class="l-text"><strong>Neden işliyor.</strong> Dikey $x = a$ doğrusu $\\{(a, y) : y \\in \\mathbb{R}\\}$ noktalarının kümesidir. Bu doğru eğriyi $y_1 \\neq y_2$ olmak üzere $(a, y_1)$ ve $(a, y_2)$ noktalarında keserse, $a$ girdisi aynı anda iki farklı çıktıyla eşleşir. Bu "her girdinin tam bir çıktısı vardır" kuralını ihlal eder, dolayısıyla eğri bir fonksiyonun grafiği olamaz.</p>

<div class="calc-graph"><div id="plot-l40-vlt-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> yan yana iki eğri. <em>Mavi</em> eğri $y = x^2$ &mdash; 4. bölümdeki parabol. Herhangi bir dikey doğru ona tam olarak bir noktada değer: <em>fonksiyondur</em>. <em>Kırmızı</em> eğri ise $x^2 + y^2 = 4$ çemberi. İç bölgedeki dikey doğrular (ör. kesik çizgili $x = 0$) çemberi <em>iki</em> noktada keser: çember bir fonksiyonun grafiği <em>değildir</em>. Bağıntıdır ama fonksiyon değildir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pxs=[];var pys=[];for(var i=0;i<=120;i++){var x=-2.2+4.4*i/120;pxs.push(x);pys.push(x*x);}
var parabolaTR={x:pxs,y:pys,mode:'lines',name:'y = x² (fonksiyon)',line:{color:'#3b82f6',width:3}};
var cxsT=[];var cysT=[];var cxsB=[];var cysB=[];for(var k=0;k<=80;k++){var th=Math.PI*k/80;cxsT.push(2*Math.cos(th));cysT.push(2*Math.sin(th));cxsB.push(2*Math.cos(-th));cysB.push(2*Math.sin(-th));}
var circleTopTR={x:cxsT,y:cysT,mode:'lines',name:'x²+y²=4 üst (kırmızı)',line:{color:'#ef4444',width:3}};
var circleBotTR={x:cxsB,y:cysB,mode:'lines',name:'x²+y²=4 alt',line:{color:'#ef4444',width:3},showlegend:false};
var vLine1TR={x:[1,1],y:[-3,5],mode:'lines',name:'dikey x=1 (parabole 1 değme)',line:{color:'rgba(59,130,246,0.5)',width:1.5,dash:'dot'}};
var vLine2TR={x:[0,0],y:[-3,5],mode:'lines',name:'dikey x=0 (çembere 2 değme)',line:{color:'rgba(239,68,68,0.5)',width:1.5,dash:'dot'}};
var hits1TR={x:[1],y:[1],mode:'markers',name:'parabol değme',marker:{color:'#3b82f6',size:11}};
var hits2TR={x:[0,0],y:[2,-2],mode:'markers',name:'çember değmeleri (2!)',marker:{color:'#ef4444',size:11}};
var layoutVLTtr={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l40-vlt-tr',[parabolaTR,circleTopTR,circleBotTR,vLine1TR,vLine2TR,hits1TR,hits2TR],layoutVLTtr,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; TESTİ UYGULA</div><div class="example-body">Aşağıdaki eğrilerin her birinin bir fonksiyonun grafiği olup olmadığına karar ver.<br><br>(a) $y = 2x + 3$ doğrusu. <em>Her dikey doğru ona tam olarak bir noktada değiyor. Evet &mdash; fonksiyon.</em><br>(b) Yana açılan parabol $x = y^2$. <em>$x = 1$ dikey doğrusu $(1, 1)$ ve $(1, -1)$ noktalarında kesiyor. Fonksiyon değil.</em><br>(c) Yarım çember $y = \\sqrt{1 - x^2}$. <em>$[-1, 1]$ aralığındaki her dikey doğru bir noktada değiyor (yalnız üst yarı). Evet &mdash; fonksiyon.</em><br>(d) Bir elips $\\frac{x^2}{4} + \\frac{y^2}{9} = 1$. <em>İç bölgedeki dikey doğrular iki noktada değiyor. Fonksiyon değil.</em></div></div>

<div class="l-note"><strong>Ayrımın neden önemli olduğu.</strong> Geometrideki birçok şekil (çemberler, elipsler, tam çizilmiş hiperboller) $x$'in fonksiyonu değildir. Onları fonksiyon makinesiyle ele almak için ya üst ve alt yarılara ayırırız (her biri kendi başına bir fonksiyon), ya da farklı bir çerçeve kullanırız: <em>parametrik denklemler</em> (L52'de) veya <em>kutupsal koordinatlar</em>.</div>

<h2 class="lesson-title">8. Eşit Fonksiyonlar: Aynı Tanım Kümesi + Aynı Kural</h2>

<div class="calc-highlight"><strong>İki $f$ ve $g$ fonksiyonu, ancak ve ancak aynı tanım kümesine sahipse VE her girdi için aynı çıktıyı üretiyorsa eşittir.</strong> Cebirsel olarak özdeş görünen iki formül, ilan edilen tanım kümeleri farklıysa <em>farklı</em> fonksiyon tanımlar.</div>

<div class="calc-formula"><div class="formula-label">FONKSİYONLARIN EŞİTLİĞİ</div><div class="formula-main">$$f = g \\iff \\Big(\\text{dom}(f) = \\text{dom}(g)\\Big) \\;\\text{VE}\\; \\Big(\\forall x \\in \\text{dom}(f),\\; f(x) = g(x)\\Big)$$</div><div class="formula-sub">Her iki koşul birden sağlanmalı. Yalnızca aynı tanım kümesi yetmez. Yalnızca aynı kural yetmez.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$f(x) = x$, tanım kümesi $\\mathbb{R}$, ve $g(x) = \\dfrac{x^2}{x}$, doğal tanım kümesinde olsun.<br><br>Cebirsel olarak $x \\neq 0$ iken $\\dfrac{x^2}{x} = x$. Yani kuralları aynı. Ama $g$'nin doğal tanım kümesi 0'ı dışlar (payda), $f$ ise $0$'da tanımlıdır. Dolayısıyla $\\text{dom}(f) = \\mathbb{R} \\neq \\mathbb{R}\\setminus\\{0\\} = \\text{dom}(g)$.<br><br>Sonuç: $\\mathbf{f \\neq g}$. Formüller aynı şeye sadeleşse de tanım kümeleri farklı.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$f(x) = (x+1)^2$ ve $g(x) = x^2 + 2x + 1$, her ikisi de $\\mathbb{R}$ tanım kümesinde olsun.<br><br>Tanım kümeleri: her ikisi de $\\mathbb{R}$. Eşit. Kurallar: $(x+1)^2 = x^2 + 2x + 1$ (iki terimlinin açılımı). Eşit.<br><br>Sonuç: $\\mathbf{f = g}$.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$f(x) = |x|$ ile $g(x) = \\sqrt{x^2}$, $\\mathbb{R}$ üzerinde fonksiyon olarak eşit midir? (Evet &mdash; her ikisi de $\\mathbb{R}$ tanım kümesinde tanımlı ve her ikisi de $x$'in negatif olmayan sürümünü üretir.)</div></div>

<h2 class="lesson-title">9. Klasik Alıştırmalar &mdash; 8 Problem</h2>

<div class="calc-graph"><div id="plot-l40-range-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $f(x) = -x^2 + 6$ fonksiyonu, $[-2, 2]$ tanım kümesinde. $x$ ekseni üzerindeki gölgeli dikey bant <em>tanım kümesini</em>; $y$ ekseni üzerindeki gölgeli yatay bant <em>görüntü kümesini</em> işaret ediyor. Maksimum çıktı 6, $x = 0$'da (tepe noktası) elde edilir; minimum çıktı 2, uç noktalarda $x = \\pm 2$'de elde edilir. Yani görüntü kümesi $[2, 6]$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var rxs=[];var rys=[];for(var i=0;i<=80;i++){var x=-2+4*i/80;rxs.push(x);rys.push(-x*x+6);}
var curveRangeTR={x:rxs,y:rys,mode:'lines',name:'f(x) = −x² + 6',line:{color:'#3b82f6',width:3}};
var domainBandTR={x:[-2,2,2,-2,-2],y:[-0.4,-0.4,-0.05,-0.05,-0.4],fill:'toself',mode:'lines',name:'tanım kümesi [−2, 2]',line:{color:'#22c55e',width:1},fillcolor:'rgba(34,197,94,0.25)'};
var rangeBandTR={x:[-3.4,-3.05,-3.05,-3.4,-3.4],y:[2,2,6,6,2],fill:'toself',mode:'lines',name:'görüntü kümesi [2, 6]',line:{color:'#f59e0b',width:1},fillcolor:'rgba(245,158,11,0.25)'};
var endPtsTR={x:[-2,0,2],y:[2,6,2],mode:'markers+text',name:'uç noktalar + tepe',marker:{color:'#e8e8e8',size:9},text:['  (−2, 2)','  (0, 6)','  (2, 2)'],textposition:'top right',textfont:{color:'#e8e8e8',size:10}};
var layoutRangeTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.6,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y = f(x)',range:[-0.8,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l40-range-tr',[curveRangeTR,domainBandTR,rangeBandTR,endPtsTR],layoutRangeTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; DEĞER HESAPLAMA</div><div class="example-body"><strong>$f(x) = 3x^2 - 2x + 5$ olsun. $f(0)$, $f(-1)$, $f(2)$ değerlerini bul.</strong><br><br>$f(0) = 3 \\cdot 0 - 2 \\cdot 0 + 5 = \\mathbf{5}$.<br>$f(-1) = 3(-1)^2 - 2(-1) + 5 = 3 + 2 + 5 = \\mathbf{10}$.<br>$f(2) = 3 \\cdot 4 - 2 \\cdot 2 + 5 = 12 - 4 + 5 = \\mathbf{13}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; KESİRİN TANIM KÜMESİ</div><div class="example-body"><strong>$f(x) = \\dfrac{x + 3}{x^2 - 4x + 3}$ fonksiyonunun doğal tanım kümesini bul.</strong><br><br>Paydayı çarpanlara ayır: $x^2 - 4x + 3 = (x - 1)(x - 3)$. $x = 1$ ve $x = 3$'te sıfırdır.<br>Doğal tanım kümesi: $\\mathbf{\\mathbb{R} \\setminus \\{1, 3\\}}$, yani $(-\\infty, 1) \\cup (1, 3) \\cup (3, \\infty)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; KAREKÖKÜN TANIM KÜMESİ</div><div class="example-body"><strong>$f(x) = \\sqrt{9 - x^2}$ fonksiyonunun doğal tanım kümesini bul.</strong><br><br>$9 - x^2 \\geq 0 \\iff x^2 \\leq 9 \\iff -3 \\leq x \\leq 3$ gerekir.<br>Doğal tanım kümesi: $\\mathbf{[-3, 3]}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; KARIŞIK TANIM KÜMESİ</div><div class="example-body"><strong>$f(x) = \\dfrac{\\sqrt{x + 1}}{x - 2}$ fonksiyonunun doğal tanım kümesini bul.</strong><br><br>Kök kısıtı: $x + 1 \\geq 0 \\iff x \\geq -1$.<br>Payda kısıtı: $x \\neq 2$.<br>Kesişim: $\\mathbf{[-1, 2) \\cup (2, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; SONLU TANIM KÜMESİNDE GÖRÜNTÜ</div><div class="example-body"><strong>$f: \\{-2, -1, 0, 1, 2\\} \\to \\mathbb{Z}$, $f(x) = x^3 - x$ olsun. Görüntü kümesini bul.</strong><br><br>$f(-2) = -8 + 2 = -6$.<br>$f(-1) = -1 + 1 = 0$.<br>$f(0) = 0$.<br>$f(1) = 1 - 1 = 0$.<br>$f(2) = 8 - 2 = 6$.<br>Tekrarsız değerler: $\\mathbf{\\{-6, 0, 6\\}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; DİKEY DOĞRU TESTİ</div><div class="example-body"><strong>Her eğrinin bir fonksiyonun grafiği olup olmadığına karar ver.</strong><br><br>(a) $y = x^3 - 2x + 1$. Kübik polinom &mdash; testten geçer. <em>Fonksiyon.</em><br>(b) $x = y^2 - 4$. Yan parabol; $x = 0$ için $y = \\pm 2$ &mdash; iki çıktı. <em>Fonksiyon değil.</em><br>(c) Birim çember $x^2 + y^2 = 1$. $x = 0$ dikey doğrusu $y = \\pm 1$'de kesişir. <em>Fonksiyon değil.</em><br>(d) $y = \\sqrt{x}$. Her negatif olmayan $x$ için bir pozitif kök. <em>Fonksiyon.</em></div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; İFADEDEN DEĞER HESABI</div><div class="example-body"><strong>$f(x) = x^2 + 1$ olsun. $f(2a)$ ve $f(a + 1) - f(a)$ değerlerini bul.</strong><br><br>$f(2a) = (2a)^2 + 1 = \\mathbf{4a^2 + 1}$.<br>$f(a + 1) = (a+1)^2 + 1 = a^2 + 2a + 2$.<br>$f(a) = a^2 + 1$.<br>$f(a+1) - f(a) = (a^2 + 2a + 2) - (a^2 + 1) = \\mathbf{2a + 1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; EŞİT FONKSİYON MU?</div><div class="example-body"><strong>$f(x) = \\dfrac{x^2 - 1}{x - 1}$ ile $g(x) = x + 1$ eşit midir?</strong><br><br>Sadeleştir: $\\dfrac{x^2 - 1}{x - 1} = \\dfrac{(x-1)(x+1)}{x-1} = x + 1$ ($x \\neq 1$ için).<br>$f$'nin doğal tanım kümesi: $\\mathbb{R}\\setminus\\{1\\}$. $g$'nin doğal tanım kümesi: $\\mathbb{R}$.<br>Tanım kümeleri farklı &mdash; dolayısıyla $\\mathbf{f \\neq g}$. $\\mathbb{R}\\setminus\\{1\\}$ üzerinde uyuşurlar ama $g$ ek olarak $x = 1$'de tanımlıdır ($g(1) = 2$), $f$ ise tanımlı değildir.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> L41 dersinde bu notasyonu özel bir aileyi incelemek için kullanacağız: $f(x) = ax + b$ biçimindeki <em>doğrusal fonksiyonlar</em>. Grafikten eğim ve kesim noktasını okumayı ve verilen iki noktadan geçen doğruyu uydurmayı öğreneceğiz. İleri gitmeden önce $f(x)$ notasyonunun, tanım ve görüntü kümesi kavramlarının ve dikey doğru testinin refleks haline geldiğinden emin ol.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Fonksiyon her girdiye <em>tam olarak bir</em> çıktı atar</li>
<li>Notasyon: $f: A \\to B$, $x \\mapsto f(x)$; değer "f of x" diye okunur</li>
<li>Tanım kümesi = izinli girdiler; görüntü kümesi = üretilen çıktılar; değer kümesi = hedef küme</li>
<li>Doğal tanım kümesi kuralları: paydada sıfır yok; çift indisli kök içinde negatif yok</li>
<li>Bir fonksiyon tablo, ok diyagramı, formül veya grafik biçiminde sunulabilir</li>
<li>Dikey doğru testi: her dikey doğru bir fonksiyon grafiğine en fazla bir noktada değer</li>
<li>İki fonksiyon ancak tanım kümeleri eşit VE kuralları her girdide uyuşuyorsa eşittir</li>
</ul>
</div>`

};
