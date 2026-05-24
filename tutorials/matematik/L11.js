window.LISE_MAT_L11 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The idea of a limit is the doorway to all of calculus.</strong> Before this lesson you knew how to evaluate a function at a single point — you plug in a number, you read off the answer. From now on you will learn to ask a different question: not "what is the function <em>at</em> a point?" but "what is the function <em>approaching</em> as we get closer and closer to a point?" The difference between those two questions is small in words and enormous in mathematics.</p>

<p class="l-text">In this lesson we build the intuition slowly. We watch x crawl toward a target value and we ask where f(x) goes. We look at graphs with holes, with jumps, with infinite spikes, and with wild oscillations, and we decide in each case whether a limit exists. By the end you will read a graph and announce the limit at any point on it as automatically as you read a clock.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read the intuitive meaning of "x approaches a" and distinguish it from "x equals a"</li>
<li>Write and read the formal limit notation $\\lim_{x \\to a} f(x) = L$ with confidence</li>
<li>Compute one-sided limits from the left and from the right, and decide when the two-sided limit exists</li>
<li>Read off a limit value directly from a graph at any point, even when the graph has a hole or a jump</li>
<li>Estimate a limit numerically by making a table of x values that close in on a from both sides</li>
<li>Recognise the three classical ways a limit can fail to exist: jump, oscillation, and divergence to infinity</li>
</ul>
</div>

<h2 class="lesson-title">1. The Idea of Approaching</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> imagine walking toward a wall. First you stand 1 metre away. Then 0.5 metres. Then 0.25 metres. Then 0.125 metres. You keep halving the distance. You can get as close to the wall as you wish, but the act of walking never finishes — there is always a smaller step available. The wall is the <em>limit</em> of your position: the value you approach, even though you never literally land on it.</div>

<p class="l-text">Up to this point in school mathematics, the only question we ever asked about a function f was "what is f(a)?" — substitute the number, get an answer. A limit asks a more delicate question:</p>

<div class="calc-formula"><div class="formula-label">THE LIMIT QUESTION</div><div class="formula-main">$$\\text{As } x \\text{ gets very close to } a, \\;\\text{ what value does } f(x) \\text{ get close to?}$$</div><div class="formula-sub">Notice the wording. We do not ask what f does <em>at</em> a. We ask what f does <em>near</em> a. These can be different.</div></div>

<p class="l-text">Why does this matter? Because there are many useful functions that are not defined at a single troublesome point, and yet the values of the function at nearby points settle down to a clear, single answer. The limit captures that settled answer even when direct substitution fails. We will see examples of exactly this kind throughout the lesson.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Approaching</div><div class="card-body">Getting arbitrarily close. The word "arbitrarily" matters: you may demand any tolerance, no matter how small, and the values still fit inside.</div></div>
<div class="calc-card"><div class="card-title">x &rarr; a</div><div class="card-body">Read "x tends to a" or "x approaches a". The variable x takes a sequence of values that close in on a from both sides, but never has to equal a.</div></div>
<div class="calc-card"><div class="card-title">f(x) &rarr; L</div><div class="card-body">Read "f of x tends to L". As x slides closer to a, the outputs f(x) cluster around the single value L.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Is "x is close to 2" the same as "x equals 2"? (No.) Can x be close to 2 without ever being 2 itself? (Yes — e.g. x = 1.999, 2.001, 1.9999, 2.0001 are all close to 2 but none equal 2.) This subtle distinction is the engine of every limit.</div></div>

<h2 class="lesson-title">2. Limit Notation</h2>

<div class="calc-highlight"><strong>The standard symbol for a limit is one of the most economical pieces of notation in all of mathematics.</strong> Three small symbols on the left, an equals sign, and a number on the right encode the entire idea of "approaching".</div>

<div class="calc-formula"><div class="formula-label">LIMIT NOTATION</div><div class="formula-main">$$\\lim_{x \\to a} f(x) \\;=\\; L$$</div><div class="formula-sub">Read aloud: "the limit, as x approaches a, of f of x, equals L."</div></div>

<p class="l-text">Let us decode each piece:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">lim</div><div class="card-body">Short for "limit". This word announces that we are about to ask the limit question, not the substitution question.</div></div>
<div class="calc-card"><div class="card-title">x &rarr; a</div><div class="card-body">Subscript under "lim". It tells us which variable is moving (x) and where it is heading (a).</div></div>
<div class="calc-card"><div class="card-title">f(x)</div><div class="card-body">The expression whose behaviour we are watching as x moves toward a.</div></div>
<div class="calc-card"><div class="card-title">L</div><div class="card-body">The single value that f(x) is settling onto. If no such value exists, we will say the limit does not exist.</div></div>
</div>

<p class="l-text"><strong>A first easy example.</strong> Consider $f(x) = x + 3$. As x gets close to 2 — say x = 1.99, 2.01, 1.999, 2.001 — the values of f(x) get close to 5. Symbolically:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 2} (x + 3) \\;=\\; 5$$</div></div>

<p class="l-text">For a function this simple, the limit equals the value: $f(2) = 5$ as well. The limit and the substitution agree. But that is a feature of "nice" functions, not a universal law — section 6 will show functions where the two disagree.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute</strong> $\\lim_{x \\to 1} (x^2 + 4)$.<br><br>The function is the polynomial $x^2 + 4$. As x slides toward 1, $x^2$ slides toward 1 and the whole expression slides toward $1 + 4 = 5$.<br><br>So $\\lim_{x \\to 1} (x^2 + 4) = \\mathbf{5}$.<br><br>Sanity check: $f(0.99) = 0.9801 + 4 = 4.9801$, $f(1.01) = 1.0201 + 4 = 5.0201$. Both close to 5. The limit is confirmed.</div></div>

<h2 class="lesson-title">3. Left-Hand and Right-Hand Limits</h2>

<div class="calc-highlight"><strong>The key refinement:</strong> there are two ways to approach a point on the number line — from the left and from the right. A complete limit picture must check both directions.</div>

<p class="l-text">Imagine the number line. To approach the point $a = 2$ from the left, we feed in values like $x = 1.9, 1.99, 1.999, 1.9999, \\dots$ — every value is smaller than 2, every value is closer than the last. To approach from the right, we feed in $x = 2.1, 2.01, 2.001, 2.0001, \\dots$ — every value is larger than 2, every value is closer than the last.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">LEFT-HAND LIMIT</div><div class="compare-item">Notation: $\\lim_{x \\to a^-} f(x)$</div><div class="compare-item">x approaches a from the <strong>left</strong> (smaller values)</div><div class="compare-item">Sample sequence: x = 1.9, 1.99, 1.999, 1.9999, …</div><div class="compare-item">Read: "limit as x approaches a from the left"</div></div><div class="compare-col"><div class="compare-title">RIGHT-HAND LIMIT</div><div class="compare-item">Notation: $\\lim_{x \\to a^+} f(x)$</div><div class="compare-item">x approaches a from the <strong>right</strong> (larger values)</div><div class="compare-item">Sample sequence: x = 2.1, 2.01, 2.001, 2.0001, …</div><div class="compare-item">Read: "limit as x approaches a from the right"</div></div></div>

<div class="calc-formula"><div class="formula-label">TWO-SIDED LIMIT EXISTENCE RULE</div><div class="formula-main">$$\\lim_{x \\to a} f(x) \\text{ exists} \\;\\iff\\; \\lim_{x \\to a^-} f(x) \\;=\\; \\lim_{x \\to a^+} f(x)$$</div><div class="formula-sub">The two one-sided limits must both exist and be equal. If they are unequal — or if either one fails to exist — then the two-sided limit does not exist.</div></div>

<p class="l-text"><strong>Why both directions?</strong> Because a function can behave very differently on the two sides of a point. Imagine a step function that equals 1 for x &lt; 2 and equals 5 for x &gt; 2. Approaching 2 from the left gives 1; approaching 2 from the right gives 5. There is no single number f is approaching — so the two-sided limit does not exist.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Let</strong> $f(x) = \\begin{cases} x + 1 & \\text{if } x < 2 \\\\ 4 - x & \\text{if } x \\geq 2 \\end{cases}$<br><br><strong>Compute the one-sided limits at a = 2.</strong><br><br>From the left, we use the first branch ($x + 1$):<br>$\\lim_{x \\to 2^-} f(x) = 2 + 1 = 3$.<br><br>From the right, we use the second branch ($4 - x$):<br>$\\lim_{x \\to 2^+} f(x) = 4 - 2 = 2$.<br><br>The two one-sided limits are $3$ and $2$. They disagree. Therefore $\\lim_{x \\to 2} f(x)$ <strong>does not exist</strong>.</div></div>

<div class="calc-graph"><div id="plot-l11-jump-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this graph shows:</strong> the piecewise function from the worked example. The blue branch on the left climbs to height 3 just before x = 2 (open dot, value 3). The blue branch on the right starts at height 2 right after x = 2 (closed dot, value 2). The two heights disagree, so the two-sided limit at x = 2 does not exist.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[],yL=[];for(var i=-10;i<=20;i++){var x=i/10;xL.push(x);yL.push(x+1);}
var xR=[],yR=[];for(var i=20;i<=40;i++){var x=i/10;xR.push(x);yR.push(4-x);}
var leftT={x:xL,y:yL,mode:'lines',name:'f(x) = x+1, x < 2',line:{color:'#3b82f6',width:3}};
var rightT={x:xR,y:yR,mode:'lines',name:'f(x) = 4−x, x ≥ 2',line:{color:'#3b82f6',width:3},showlegend:false};
var openDot={x:[2],y:[3],mode:'markers',name:'open: left limit 3',marker:{size:13,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}}};
var closedDot={x:[2],y:[2],mode:'markers',name:'closed: f(2) = 2',marker:{size:11,color:'#3b82f6'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.2,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-0.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l11-jump-en',[leftT,rightT,openDot,closedDot],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Notation reminder:</strong> the small minus or plus sign sits as a superscript on the target value, never on x. We write $x \\to 2^-$, not $x^- \\to 2$. The superscript answers "from which side?".</div>

<h2 class="lesson-title">4. Reading a Limit from a Graph</h2>

<div class="calc-highlight"><strong>Once you have a graph in front of you, finding a limit is a visual exercise.</strong> Cover the point itself with your finger. Look at the curve just to the left of the point and follow it as your eye slides toward x = a — what height does the curve approach? That height is the left-hand limit. Do the same on the right. If both heights agree, the two-sided limit is that common height.</div>

<p class="l-text">Below is a piecewise function with three interesting points: a smooth point (a = 1), a removable hole (a = 2), and a jump (a = 3). We will read the limit at each one.</p>

<div class="calc-graph"><div id="plot-l11-readgraph-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this graph shows:</strong> a function with three labelled points. At x = 1 the graph passes smoothly — limit equals function value. At x = 2 there is a hole at height 3 (open circle) and a separate closed dot at height 1 — limit exists but does not equal f(2). At x = 3 the graph jumps from height 2 to height 4 — limit does not exist.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
// Branch 1: 0 <= x < 2, parabola y = (x-1)^2 + 2 (so y(1)=2)
var xa=[],ya=[];for(var i=0;i<=20;i++){var x=i/10;xa.push(x);ya.push((x-1)*(x-1)+2);}
// Branch 2: x = 2 to x = 3, line y = -2x + 7 (so y(2+) = 3, y(3-) = 1, but jump at 3+)
// We need the graph to approach 3 from both sides at x=2 (hole), with f(2)=1 closed dot
// Then linear from (2,3) DOWN to (3,1) so left-limit at 3 is 1; right side jumps to 4 then up.
var xb=[],yb=[];for(var i=20;i<=30;i++){var x=i/10;xb.push(x);yb.push(-2*x+7);}
// Branch 3: x > 3, line y = x + 1 (so y(3+) = 4)
var xc=[],yc=[];for(var i=30;i<=45;i++){var x=i/10;xc.push(x);yc.push(x+1);}
var t1={x:xa,y:ya,mode:'lines',name:'branch 1',line:{color:'#3b82f6',width:3}};
var t2={x:xb,y:yb,mode:'lines',name:'branch 2',line:{color:'#3b82f6',width:3},showlegend:false};
var t3={x:xc,y:yc,mode:'lines',name:'branch 3',line:{color:'#3b82f6',width:3},showlegend:false};
// At x=2: hole at y=3 (open), closed dot at y=1 (f(2) defined separately)
var holeAt2={x:[2],y:[3],mode:'markers',name:'hole at x=2',marker:{size:12,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}}};
var closedAt2={x:[2],y:[1],mode:'markers',name:'f(2) = 1',marker:{size:11,color:'#ef4444'}};
// At x=3: left limit = 1 (open), right limit = 4 (open), f(3) undefined (or skipped)
var holeLeft3={x:[3],y:[1],mode:'markers',name:'open at x=3⁻',marker:{size:12,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}},showlegend:false};
var holeRight3={x:[3],y:[4],mode:'markers',name:'open at x=3⁺',marker:{size:12,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}},showlegend:false};
// Smooth point at x=1
var smoothAt1={x:[1],y:[2],mode:'markers',name:'smooth at x=1',marker:{size:10,color:'#10b981'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.3,4.7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'f(x)',range:[0,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l11-readgraph-en',[t1,t2,t3,holeAt2,closedAt2,holeLeft3,holeRight3,smoothAt1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Reading the limit at a = 1 (smooth point).</strong> Slide your eye along the curve from the left, approaching x = 1: the curve is at height 2. Slide from the right: again height 2. So $\\lim_{x \\to 1^-} f(x) = 2$ and $\\lim_{x \\to 1^+} f(x) = 2$. They agree, so</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 1} f(x) \\;=\\; 2$$</div></div>

<p class="l-text">And by inspection of the graph $f(1) = 2$ as well — limit and function value agree.</p>

<p class="l-text"><strong>Reading the limit at a = 2 (hole).</strong> The curve climbs toward height 3 from the left and arrives at height 3 from the right too — so both one-sided limits equal 3. The two-sided limit exists:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 2} f(x) \\;=\\; 3$$</div></div>

<p class="l-text">But notice the red dot — the function value at x = 2 is defined separately as $f(2) = 1$. The limit (3) and the function value (1) disagree. <em>This is allowed.</em> Limits ask "where is the curve going?", not "what was specified at the exact point?".</p>

<p class="l-text"><strong>Reading the limit at a = 3 (jump).</strong> From the left the curve descends toward height 1; from the right it begins at height 4 and rises. The one-sided limits are 1 and 4. They disagree, so</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 3} f(x) \\;\\text{ does not exist.}$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — READING A GRAPH</div><div class="example-body">From the graph above, fill in each blank:<br><br>(a) $\\lim_{x \\to 1} f(x) = $ <strong>2</strong> &nbsp; (smooth, limit = function value)<br>(b) $\\lim_{x \\to 2^-} f(x) = $ <strong>3</strong>, &nbsp; $\\lim_{x \\to 2^+} f(x) = $ <strong>3</strong>, &nbsp; $\\lim_{x \\to 2} f(x) = $ <strong>3</strong>, &nbsp; $f(2) = $ <strong>1</strong><br>(c) $\\lim_{x \\to 3^-} f(x) = $ <strong>1</strong>, &nbsp; $\\lim_{x \\to 3^+} f(x) = $ <strong>4</strong>, &nbsp; $\\lim_{x \\to 3} f(x) = $ <strong>DNE</strong> (does not exist)</div></div>

<h2 class="lesson-title">5. Estimating a Limit with a Table</h2>

<div class="calc-highlight"><strong>If you do not have a graph, you can still hunt for a limit by hand</strong> — pick a sequence of x values that approach the target from both sides, compute f(x) at each one, and watch where the numbers settle.</div>

<p class="l-text">This is called the <strong>numerical method</strong> for estimating a limit. It is not a proof — a table of finitely many values cannot guarantee what happens in the rest of the infinitely many points nearby — but it is a very reliable detective tool, and it builds your intuition fast.</p>

<p class="l-text">Let us estimate</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}$$</div></div>

<p class="l-text">Direct substitution at $x = 1$ gives $\\frac{0}{0}$, which is undefined. So we make a table:</p>

<div class="calc-formula"><div class="formula-label">NUMERICAL TABLE</div><div class="formula-main">$$\\begin{array}{c|c} x & f(x) = \\frac{x^2 - 1}{x - 1} \\\\ \\hline 0.9 & 1.9 \\\\ 0.99 & 1.99 \\\\ 0.999 & 1.999 \\\\ 1 & \\text{undefined} \\\\ 1.001 & 2.001 \\\\ 1.01 & 2.01 \\\\ 1.1 & 2.1 \\end{array}$$</div></div>

<p class="l-text">From the left, f(x) creeps up: 1.9, 1.99, 1.999. From the right, f(x) creeps down: 2.001, 2.01, 2.1. Both sides settle on the value 2. So we conclude:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1} \\;=\\; 2$$</div></div>

<p class="l-text"><strong>Why does this work?</strong> The numerator factors as a difference of squares: $x^2 - 1 = (x - 1)(x + 1)$. For every $x \\neq 1$ we can cancel the common factor:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{x^2 - 1}{x - 1} \\;=\\; \\frac{(x - 1)(x + 1)}{x - 1} \\;=\\; x + 1 \\quad (x \\neq 1)$$</div></div>

<p class="l-text">So the function agrees with $x + 1$ everywhere except at $x = 1$. As $x \\to 1$, the simpler expression $x + 1 \\to 2$. The table gave us the right answer; the factoring gives us a proof.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TABLE METHOD</div><div class="example-body"><strong>Estimate</strong> $\\lim_{x \\to 0} \\dfrac{\\sin x}{x}$ by making a table with x in radians.<br><br>$\\begin{array}{c|c} x & \\sin(x)/x \\\\ \\hline -0.1 & 0.99833 \\\\ -0.01 & 0.99998 \\\\ -0.001 & 1.00000 \\\\ 0 & \\text{undefined} \\\\ 0.001 & 1.00000 \\\\ 0.01 & 0.99998 \\\\ 0.1 & 0.99833 \\end{array}$<br><br>Both sides creep toward 1. So $\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = \\mathbf{1}$. (This famous limit is the backbone of every derivative of a trig function in later lessons.)</div></div>

<div class="l-note"><strong>Warning about tables:</strong> a table tells you what is likely true, not what is certainly true. Some functions oscillate so wildly near a point that any finite sample of values looks like it is settling on a number, but in fact the limit does not exist. We will meet exactly such a case in section 7.</div>

<h2 class="lesson-title">6. The Limit Does Not Have to Equal f(a)</h2>

<div class="calc-highlight"><strong>This is the single most important conceptual point of the whole lesson.</strong> The limit at a point a measures what f(x) is approaching as x &rarr; a. The function value f(a) is what was simply written down at the exact point. These are two different ideas, and they can produce two different numbers.</div>

<p class="l-text">Three things can happen at a point $a$ in the domain:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Limit exists, equals f(a)</div><div class="card-body">The function is <em>continuous</em> at a. You can draw through the point without lifting your pen.</div></div>
<div class="calc-card"><div class="card-title">Limit exists, but limit &ne; f(a)</div><div class="card-body">The function has a "hole" at a — the limit approaches one value but the function was defined as a different value (or a single point was moved).</div></div>
<div class="calc-card"><div class="card-title">Limit does not exist</div><div class="card-body">The two one-sided limits disagree, or the function oscillates, or it shoots to infinity. We will catalogue these in section 7.</div></div>
</div>

<p class="l-text"><strong>Example with a hole.</strong> Define</p>

<div class="calc-formula"><div class="formula-main">$$f(x) \\;=\\; \\frac{x^2 - 4}{x - 2}$$</div></div>

<p class="l-text">For every $x \\neq 2$ we can cancel: $f(x) = x + 2$. So the function behaves exactly like the line $y = x + 2$ everywhere except at $x = 2$, where it is undefined (division by zero). The limit is:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} \\;=\\; \\lim_{x \\to 2} (x + 2) \\;=\\; 4$$</div></div>

<p class="l-text">But $f(2)$ is undefined. So we have a limit (4) without a function value. The graph is a straight line with a single open dot at the point $(2, 4)$.</p>

<div class="calc-graph"><div id="plot-l11-hole-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this graph shows:</strong> the function $(x^2 - 4)/(x - 2)$ is identical to the line $y = x + 2$ for every $x \\neq 2$. At $x = 2$ the function is undefined (open circle marks the hole). The limit at $x = 2$ is still 4 because the curve approaches the height 4 from both sides.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[],yL=[];for(var i=-20;i<20;i++){var x=i/10;xL.push(x);yL.push(x+2);}
var xR=[],yR=[];for(var i=21;i<=50;i++){var x=i/10;xR.push(x);yR.push(x+2);}
var leftT={x:xL,y:yL,mode:'lines',name:'f(x) = x+2, x < 2',line:{color:'#3b82f6',width:3}};
var rightT={x:xR,y:yR,mode:'lines',name:'f(x) = x+2, x > 2',line:{color:'#3b82f6',width:3},showlegend:false};
var hole={x:[2],y:[4],mode:'markers',name:'hole at (2, 4)',marker:{size:13,color:'rgba(0,0,0,0)',line:{color:'#ef4444',width:3}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-1,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l11-hole-en',[leftT,rightT,hole],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Example with a redefined point.</strong> Consider the piecewise function</p>

<div class="calc-formula"><div class="formula-main">$$g(x) \\;=\\; \\begin{cases} x + 2 & x \\neq 2 \\\\ 0 & x = 2 \\end{cases}$$</div></div>

<p class="l-text">Here $g$ is the same line $x + 2$ everywhere except at $x = 2$, where it has been arbitrarily redefined to take the value 0. The limit as $x \\to 2$ does not care about the value at exactly $x = 2$ — it only inspects nearby points. So:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 2} g(x) \\;=\\; 4, \\qquad g(2) \\;=\\; 0$$</div></div>

<p class="l-text">The limit and the function value disagree by 4. This is a perfectly legal mathematical situation. Limit and substitution are different operations.</p>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why on earth would anyone define a function to disagree with its own limit? Sometimes it happens by accident — a formula is undefined at a single point (like the $0/0$ case above) and someone patches it with the "wrong" value. Sometimes it happens on purpose — a function might model a measurement that is taken at an unusual sample point. Either way, the limit and the function value live independent lives.</div></div>

<h2 class="lesson-title">7. Three Ways a Limit Can Fail to Exist</h2>

<div class="calc-highlight"><strong>Not every limit exists.</strong> When the function does not settle on a single value as x approaches a, we say the limit does not exist (DNE). There are three classical reasons.</div>

<p class="l-text"><strong>Reason 1 — Jump (the one-sided limits disagree).</strong> We already met this in section 3 and section 4. If the left-hand limit and the right-hand limit are two different numbers, no single value of L works for both. The two-sided limit fails to exist.</p>

<p class="l-text"><strong>Reason 2 — Divergence to infinity.</strong> Sometimes the function grows without any upper bound (or falls without any lower bound) as x approaches a. The classical example:</p>

<div class="calc-formula"><div class="formula-main">$$f(x) \\;=\\; \\frac{1}{x^2}$$</div></div>

<p class="l-text">As $x \\to 0$ from either side, $1/x^2$ blows up: at $x = 0.1$ it is 100, at $x = 0.01$ it is 10000, at $x = 0.001$ it is one million. No finite number $L$ can be the limit. We sometimes write</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 0} \\frac{1}{x^2} \\;=\\; +\\infty$$</div></div>

<p class="l-text">as shorthand for "f(x) grows beyond any bound", but strictly speaking the limit (as a real number) does not exist.</p>

<p class="l-text"><strong>Reason 3 — Wild oscillation.</strong> The trickiest case. The function $\\sin(1/x)$ oscillates faster and faster as $x \\to 0$ — between $-1$ and $+1$ infinitely many times in any neighbourhood of zero. There is no single value the function settles on, so:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 0} \\sin\\!\\left(\\frac{1}{x}\\right) \\;\\text{ does not exist.}$$</div></div>

<div class="calc-graph"><div id="plot-l11-osc-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this graph shows:</strong> $\\sin(1/x)$ as x approaches 0. The function oscillates between −1 and +1 with infinitely many cycles compressed into any tiny interval around zero. No matter how closely x approaches 0, the value of f(x) keeps swinging — there is no single height it settles on.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xv=[],yv=[];for(var i=1;i<=2000;i++){var x=i/2000*0.6+0.001;xv.push(x);yv.push(Math.sin(1/x));}
var xN=[],yN=[];for(var i=1;i<=2000;i++){var x=-i/2000*0.6-0.001;xN.push(x);yN.push(Math.sin(1/x));}
var t1={x:xv,y:yv,mode:'lines',name:'sin(1/x)',line:{color:'#3b82f6',width:1.2}};
var t2={x:xN,y:yN,mode:'lines',name:'sin(1/x), x<0',line:{color:'#3b82f6',width:1.2},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.6,0.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'sin(1/x)',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l11-osc-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Why a numerical table can fool you here.</strong> If you happen to sample $x = 1/(n\\pi)$ for whole numbers $n$, you will get $\\sin(n\\pi) = 0$ every single time and conclude the limit is zero. But if you sample $x = 2/((2n+1)\\pi)$ you will get $\\sin((2n+1)\\pi/2) = \\pm 1$. A table at unlucky sample points can announce a limit that does not exist. This is the rare case where the numerical method is misleading.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Jump (sides disagree)</div><div class="card-body">$\\lim_{x \\to a^-} \\neq \\lim_{x \\to a^+}$. Each side has a clear limit, but the two values disagree. Example: piecewise step.</div></div>
<div class="calc-card"><div class="card-title">Divergence (unbounded)</div><div class="card-body">$|f(x)|$ grows beyond any bound near $a$. No finite real number $L$ works. Example: $1/x^2$ near 0.</div></div>
<div class="calc-card"><div class="card-title">Oscillation</div><div class="card-body">$f(x)$ keeps swinging between values without settling. Example: $\\sin(1/x)$ near 0.</div></div>
</div>

<div class="calc-highlight"><strong>A close-up: the famous limit $\\lim_{x \\to 0} \\sin(x)/x$.</strong> This is the limit we estimated by table in section 5. The graph below shows the function on both sides of zero. The function is undefined at $x = 0$ exactly (a hole), but the curve climbs symmetrically toward height $1$ from both directions. The red markers show sample points on the left and right that close in on the limit value $L = 1$.</div>

<div class="calc-graph"><div id="plot-l11-sinxx-en-extra" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this graph shows:</strong> $f(x) = \\sin(x)/x$ on $[-4, 4]$. The function is undefined at $x = 0$ (open circle marks the hole), but the limit from both sides is $L = 1$. The red markers at $x = \\pm 0.5$ and $x = \\pm 0.1$ show how f(x) closes in on 1 as x approaches 0.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[],yL=[];for(var i=-400;i<=-1;i++){var x=i/100;xL.push(x);yL.push(Math.sin(x)/x);}
var xR=[],yR=[];for(var i=1;i<=400;i++){var x=i/100;xR.push(x);yR.push(Math.sin(x)/x);}
var leftT={x:xL,y:yL,mode:'lines',name:'sin(x)/x, x < 0',line:{color:'#3b82f6',width:3}};
var rightT={x:xR,y:yR,mode:'lines',name:'sin(x)/x, x > 0',line:{color:'#3b82f6',width:3},showlegend:false};
var hole={x:[0],y:[1],mode:'markers',name:'hole at x = 0',marker:{size:13,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}}};
var leftApproach={x:[-0.5,-0.1],y:[Math.sin(-0.5)/-0.5,Math.sin(-0.1)/-0.1],mode:'markers+text',name:'left approach → 1',marker:{size:10,color:'#ef4444'},text:['x=-0.5','x=-0.1'],textposition:'top center',textfont:{color:'#ef4444',size:11}};
var rightApproach={x:[0.1,0.5],y:[Math.sin(0.1)/0.1,Math.sin(0.5)/0.5],mode:'markers+text',name:'right approach → 1',marker:{size:10,color:'#ef4444'},text:['x=0.1','x=0.5'],textposition:'top center',textfont:{color:'#ef4444',size:11}};
var limitLine={x:[-4,4],y:[1,1],mode:'lines',name:'L = 1',line:{color:'rgba(239,68,68,0.45)',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4.2,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'sin(x)/x',range:[-0.35,1.25],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l11-sinxx-en-extra',[leftT,rightT,limitLine,hole,leftApproach,rightApproach],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Reading the markers.</strong> At $x = \\pm 0.5$ the function value is $\\sin(0.5)/0.5 \\approx 0.9589$ — already close to 1. At $x = \\pm 0.1$ the value is $\\sin(0.1)/0.1 \\approx 0.9983$ — closer still. As x slides even nearer to 0 from either side, the heights press up against the dashed line $L = 1$. The function never reaches 1 (it is undefined at 0), but the limit does: $\\lim_{x \\to 0} \\sin(x)/x = 1$.</p>

<div class="calc-highlight"><strong>Summary table — the four canonical cases.</strong> Use this as a quick reference for diagnosing any limit.</div>

<div style="margin:1.2rem 0;overflow-x:auto;border-radius:8px;border:1px solid rgba(59,130,246,0.25)">
<table style="width:100%;border-collapse:collapse;background:#0a0a0a;color:rgba(235,230,220,0.92);font-size:0.92rem">
<thead>
<tr style="background:#3b82f6;color:#0a0a0a">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-right:1px solid rgba(10,10,10,0.2)">Case</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-right:1px solid rgba(10,10,10,0.2)">Example</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em">Result</th>
</tr>
</thead>
<tbody>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Two-sided limit exists</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">Left limit = right limit; both finite</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$\\displaystyle \\lim_{x \\to 0} \\frac{\\sin x}{x}$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">Hole at $x = 0$, both sides → 1</span></td>
<td style="padding:0.65rem 0.9rem;color:#10b981;font-weight:600">$L = 1$ (exists)</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Left ≠ right (jump)</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">One-sided limits both exist but disagree</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$f(x) = \\begin{cases} x+1 & x < 2 \\\\ 4-x & x \\geq 2 \\end{cases}$ at $a = 2$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">Left → 3, right → 2</span></td>
<td style="padding:0.65rem 0.9rem;color:#ef4444;font-weight:600">DNE (jump)</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Infinite limit</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">Function grows beyond any bound</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$\\displaystyle \\lim_{x \\to 0} \\frac{1}{x^2}$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">Both sides shoot to $+\\infty$</span></td>
<td style="padding:0.65rem 0.9rem;color:#ef4444;font-weight:600">DNE (write $+\\infty$)</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Oscillating</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">Function swings without settling</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$\\displaystyle \\lim_{x \\to 0} \\sin\\!\\left(\\frac{1}{x}\\right)$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">Infinitely many cycles in $[-1, 1]$</span></td>
<td style="padding:0.65rem 0.9rem;color:#ef4444;font-weight:600">DNE (oscillation)</td>
</tr>
</tbody>
</table>
</div>

<h2 class="lesson-title">8. Classical Practice — Reading Limits from a Graph</h2>

<div class="calc-highlight"><strong>Below is a single graph with several interesting features.</strong> Use it to compute six limits. Take your time. Cover the point with your finger and ask: "what height am I approaching from the left? from the right?"</div>

<div class="calc-graph"><div id="plot-l11-practice-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this graph shows:</strong> a single function $f$ defined on $-1 \\leq x \\leq 6$. It has a smooth point near $x = 0$ (value 1), a removable hole at $x = 2$ (limit 3, but $f(2) = 5$), a jump at $x = 4$ (left limit 2, right limit 4), and a vertical asymptote at $x = 5$ (the function shoots to $+\\infty$). Use the graph to answer the six practice problems below.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
// Branch 1: -1 <= x < 2, smooth parabola y = 0.5*(x+1)^2 + 0.5, joins (2, 3) as limit
// Engineer so y(0)=1, y(2-)=3.
// Pick y = 0.5*x^2 + x + 1: y(0)=1, y(2)=0.5*4+2+1=5. Doesn't work. Try y = x + 1: y(0)=1, y(2)=3.
var xa=[],ya=[];for(var i=-10;i<=20;i++){var x=i/10;xa.push(x);ya.push(x+1);}
// Branch 2: x = 2 to x = 4, line that arrives at (4-)= 2. From (2, 3) to (4, 2): slope -0.5. y = -0.5x + 4.
var xb=[],yb=[];for(var i=20;i<=40;i++){var x=i/10;xb.push(x);yb.push(-0.5*x+4);}
// Branch 3: x = 4 to x close to 5, jumps to (4+)=4 and rises with vertical asymptote at x=5.
// Use y = 4 + 0.5/(5-x). At x=4: 4+0.5/1=4.5. Want y(4+)=4. So shift: y = 4 + 0.5/(5-x) - 0.5 = 3.5 + 0.5/(5-x). At x=4: 3.5+0.5=4. Good.
var xc=[],yc=[];for(var i=40;i<=49;i++){var x=i/10;xc.push(x);yc.push(3.5+0.5/(5-x));}
// To show asymptotic blowup we let x reach close to 5
for(var i=490;i<=499;i++){var x=i/100;xc.push(x);yc.push(3.5+0.5/(5-x));}
// Branch 4: x > 5, function decreasing from large to small, say y = 7/(x-5) + 0.5 nope. Let's keep simple: y = -x + 7. At x=5+: y=2; at x=6: y=1.
var xd=[],yd=[];for(var i=51;i<=60;i++){var x=i/10;xd.push(x);yd.push(-x+7);}
// extend to bigger values briefly
var t1={x:xa,y:ya,mode:'lines',name:'branch [-1, 2)',line:{color:'#3b82f6',width:3}};
var t2={x:xb,y:yb,mode:'lines',name:'branch [2, 4)',line:{color:'#3b82f6',width:3},showlegend:false};
var t3={x:xc,y:yc,mode:'lines',name:'branch [4, 5)',line:{color:'#3b82f6',width:3},showlegend:false};
var t4={x:xd,y:yd,mode:'lines',name:'branch (5, 6]',line:{color:'#3b82f6',width:3},showlegend:false};
// Hole at (2, 3) - open dot; closed dot at (2, 5) for f(2)=5
var holeAt2={x:[2],y:[3],mode:'markers',name:'hole',marker:{size:12,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}}};
var dotAt2={x:[2],y:[5],mode:'markers',name:'f(2) = 5',marker:{size:11,color:'#ef4444'}};
// Open dots at x=4 left (y=2) and right (y=4); f(4) closed at y=4
var holeLeft4={x:[4],y:[2],mode:'markers',name:'open at x=4⁻',marker:{size:12,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}},showlegend:false};
var holeRight4={x:[4],y:[4],mode:'markers',name:'f(4) = 4',marker:{size:11,color:'#3b82f6'}};
// Asymptote line
var asymp={x:[5,5],y:[0,7],mode:'lines',name:'asymptote x=5',line:{color:'rgba(239,68,68,0.5)',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'f(x)',range:[0,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l11-practice-en',[t1,t2,t3,t4,holeAt2,dotAt2,holeLeft4,holeRight4,asymp],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Six limits to read from the graph above.</strong> Try each one yourself before reading the answer.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body"><strong>Find</strong> $\\lim_{x \\to 0} f(x)$.<br><br>At $x = 0$ the graph is on the smooth left branch $y = x + 1$. As x slides toward 0 from either side, the curve approaches height $0 + 1 = 1$. The limit is <strong>1</strong>. (And $f(0) = 1$ as well.)</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body"><strong>Find</strong> $\\lim_{x \\to 2^-} f(x)$.<br><br>From the left of $x = 2$ we are on the branch $y = x + 1$. As $x \\to 2^-$, $y \\to 2 + 1 = 3$. The left-hand limit is <strong>3</strong>.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body"><strong>Find</strong> $\\lim_{x \\to 2^+} f(x)$ and $\\lim_{x \\to 2} f(x)$.<br><br>From the right of $x = 2$ we are on the branch $y = -0.5x + 4$. As $x \\to 2^+$, $y \\to -1 + 4 = 3$. The right-hand limit is <strong>3</strong>.<br><br>Left limit = right limit = 3, so the two-sided limit is <strong>3</strong>. Notice that $f(2) = 5$ (the red dot). Limit and function value disagree — a removable hole.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body"><strong>Find</strong> $\\lim_{x \\to 4^-} f(x)$, $\\lim_{x \\to 4^+} f(x)$, and $\\lim_{x \\to 4} f(x)$.<br><br>From the left at $x = 4$ the line $y = -0.5x + 4$ reaches $y = 2$. Left-hand limit = <strong>2</strong>.<br><br>From the right at $x = 4$ the next branch arrives at $y = 4$. Right-hand limit = <strong>4</strong>.<br><br>$2 \\neq 4$, so $\\lim_{x \\to 4} f(x)$ <strong>does not exist</strong> (a jump).</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body"><strong>Find</strong> $\\lim_{x \\to 5^-} f(x)$.<br><br>As $x \\to 5^-$ the branch $y = 3.5 + 0.5/(5 - x)$ shoots to $+\\infty$ (the denominator $5 - x$ approaches 0 from positive values, so the fraction blows up). The limit <strong>does not exist as a real number</strong>. We can write $\\lim_{x \\to 5^-} f(x) = +\\infty$ as shorthand.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6</div><div class="example-body"><strong>Find</strong> $\\lim_{x \\to 6} f(x)$.<br><br>At $x = 6$ the graph is on the smooth right branch $y = -x + 7$. As $x \\to 6$ from either side, $y \\to -6 + 7 = 1$. The limit is <strong>1</strong>. (No drama at this point — the function is smooth there.)</div></div>

<div class="think-box"><div class="think-label">SUMMARY — HOW TO READ A LIMIT FROM A GRAPH</div><div class="think-body">(1) Find the target x-value $a$ on the horizontal axis. (2) Cover the point itself; do not look at $f(a)$. (3) Slide your eye along the curve from the left toward $a$ — the height the curve approaches is the left-hand limit. (4) Repeat from the right — that height is the right-hand limit. (5) If they agree, the two-sided limit equals their common value. If they disagree, the two-sided limit does not exist.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU LEARNED</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>A limit asks where f(x) is <em>going</em>, not what f(a) is. The two can differ.</li>
<li>The notation $\\lim_{x \\to a} f(x) = L$ encodes the entire idea in five symbols.</li>
<li>A two-sided limit exists if and only if the left-hand and right-hand limits agree.</li>
<li>You can find a limit by reading a graph (cover the point and slide), by making a numerical table, or by algebraic manipulation.</li>
<li>The function value at $a$ is completely separate from the limit. A hole, a jump, a re-defined point — all leave the limit unaffected.</li>
<li>A limit may fail to exist for three reasons: the two sides disagree (jump), the function diverges to infinity, or the function oscillates without settling.</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Limit fikri, tüm analizin kapısıdır.</strong> Bu derse kadar bir fonksiyonu tek bir noktada hesaplamayı biliyordun — bir sayı koyar, cevabı okurdun. Bundan sonra farklı bir soru soracaksın: "fonksiyon o noktada <em>kaç</em>?" değil, "o noktaya gittikçe fonksiyon hangi değere <em>yaklaşıyor</em>?" Sözcüklerde küçük olan bu fark, matematikte devasadır.</p>

<p class="l-text">Bu derste sezgiyi yavaşça inşa ediyoruz. x'in bir hedefe doğru süründüğünü izliyoruz ve f(x)'in nereye gittiğini soruyoruz. Deliği olan, sıçraması olan, sonsuza fırlayan, vahşice salınan grafiklere bakıyoruz ve her durumda limitin var olup olmadığına karar veriyoruz. Dersin sonunda, bir grafik gördüğünde, üzerindeki herhangi bir noktada limit değerini saat okur gibi otomatik söyleyebileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>"x, a'ya yaklaşıyor" ifadesinin sezgisel anlamını okumayı ve onu "x, a'ya eşit" ifadesinden ayırt etmeyi</li>
<li>Resmi limit gösterimini $\\lim_{x \\to a} f(x) = L$ rahatlıkla yazmayı ve okumayı</li>
<li>Sol ve sağ tek taraflı limitleri hesaplamayı ve iki taraflı limitin ne zaman var olduğuna karar vermeyi</li>
<li>Bir grafikten doğrudan limit değerini okumayı — grafikte delik veya sıçrama olsa bile</li>
<li>İki taraftan a'ya yaklaşan x değerleriyle bir tablo yaparak limiti sayısal olarak tahmin etmeyi</li>
<li>Bir limitin var olmamasının üç klasik nedenini tanımayı: sıçrama, salınım ve sonsuza ıraksama</li>
</ul>
</div>

<h2 class="lesson-title">1. Yaklaşma Fikri</h2>

<div class="calc-highlight"><strong>Günlük bir resim:</strong> bir duvara doğru yürüdüğünü hayal et. Önce 1 metre uzaktasın. Sonra 0.5 metre. Sonra 0.25 metre. Sonra 0.125 metre. Mesafeyi sürekli ikiye bölüyorsun. Duvara istediğin kadar yaklaşabilirsin, ama yürüme eylemi hiç bitmez — her zaman alabileceğin daha küçük bir adım vardır. Duvar, konumunun <em>limitidir</em>: tam olarak ulaşmasan bile yaklaştığın değer.</div>

<p class="l-text">Okul matematiğinde bu noktaya kadar bir f fonksiyonu hakkında sorduğumuz tek soru "f(a) kaç?" idi — sayıyı yerine koy, cevabı al. Bir limit daha hassas bir soru sorar:</p>

<div class="calc-formula"><div class="formula-label">LİMİT SORUSU</div><div class="formula-main">$$x, \\;a\\text{'ya çok yaklaşırken, } f(x) \\text{ hangi değere yaklaşır?}$$</div><div class="formula-sub">Sözcüklere dikkat et. f'in a <em>noktasında</em> ne yaptığını sormuyoruz. f'in a'nın <em>yakınında</em> ne yaptığını soruyoruz. Bu ikisi farklı olabilir.</div></div>

<p class="l-text">Bu neden önemli? Çünkü tek bir sorunlu noktada tanımlı olmayan ama yakın noktalarda fonksiyon değerleri net, tek bir cevaba yaklaşan birçok kullanışlı fonksiyon vardır. Doğrudan yerine koymanın başarısız olduğu durumlarda bile limit bu yerleşmiş cevabı yakalar. Bu tür örnekleri dersin her yerinde göreceğiz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yaklaşma</div><div class="card-body">Keyfi yakın olmak. "Keyfi" kelimesi önemli: ne kadar küçük olursa olsun herhangi bir tolerans isteyebilirsin, ve değerler hala içinde kalır.</div></div>
<div class="calc-card"><div class="card-title">x &rarr; a</div><div class="card-body">"x, a'ya yaklaşıyor" diye okunur. x değişkeni, a'ya iki taraftan yaklaşan bir değerler dizisi alır, ama hiçbir zaman a'ya eşit olmak zorunda değildir.</div></div>
<div class="calc-card"><div class="card-title">f(x) &rarr; L</div><div class="card-body">"f(x), L'ye yaklaşıyor" diye okunur. x, a'ya yaklaştıkça f(x) çıktıları tek bir L değeri etrafında kümelenir.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">"x, 2'ye yakın" ile "x, 2'ye eşit" aynı şey midir? (Hayır.) x, hiçbir zaman 2 olmadan 2'ye yakın olabilir mi? (Evet — örneğin x = 1.999, 2.001, 1.9999, 2.0001 hepsi 2'ye yakındır ama hiçbiri 2 değildir.) Bu ince ayrım, her limitin motorudur.</div></div>

<h2 class="lesson-title">2. Limit Gösterimi</h2>

<div class="calc-highlight"><strong>Limit için standart sembol, tüm matematiğin en ekonomik gösterimlerinden biridir.</strong> Solda üç küçük sembol, bir eşittir işareti ve sağda bir sayı — tüm "yaklaşma" fikrini kodlar.</div>

<div class="calc-formula"><div class="formula-label">LİMİT GÖSTERİMİ</div><div class="formula-main">$$\\lim_{x \\to a} f(x) \\;=\\; L$$</div><div class="formula-sub">Sesli okuma: "x, a'ya yaklaşırken f(x)'in limiti L'ye eşittir."</div></div>

<p class="l-text">Her parçayı çözelim:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">lim</div><div class="card-body">"Limit" kelimesinin kısaltması. Bu kelime, yerine koyma sorusu değil, limit sorusu sormak üzere olduğumuzu duyurur.</div></div>
<div class="calc-card"><div class="card-title">x &rarr; a</div><div class="card-body">"lim"in altındaki alt yazı. Hangi değişkenin hareket ettiğini (x) ve nereye gittiğini (a) söyler.</div></div>
<div class="calc-card"><div class="card-title">f(x)</div><div class="card-body">x, a'ya doğru hareket ederken davranışını izlediğimiz ifade.</div></div>
<div class="calc-card"><div class="card-title">L</div><div class="card-body">f(x)'in üzerine yerleştiği tek değer. Böyle bir değer yoksa, limitin var olmadığını söyleyeceğiz.</div></div>
</div>

<p class="l-text"><strong>Bir ilk kolay örnek.</strong> $f(x) = x + 3$'ü düşün. x, 2'ye yaklaşırken — örneğin x = 1.99, 2.01, 1.999, 2.001 — f(x) değerleri 5'e yaklaşır. Sembolik olarak:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 2} (x + 3) \\;=\\; 5$$</div></div>

<p class="l-text">Bu kadar basit bir fonksiyon için limit, değere eşittir: $f(2) = 5$. Limit ve yerine koyma uyuşur. Ama bu "iyi" fonksiyonların özelliğidir, evrensel bir yasa değil — bölüm 6, ikisinin uyuşmadığı fonksiyonları gösterecek.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Hesapla:</strong> $\\lim_{x \\to 1} (x^2 + 4)$.<br><br>Fonksiyon $x^2 + 4$ polinomudur. x, 1'e doğru kayarken $x^2$, 1'e doğru kayar ve tüm ifade $1 + 4 = 5$'e doğru kayar.<br><br>Yani $\\lim_{x \\to 1} (x^2 + 4) = \\mathbf{5}$.<br><br>Sağlama: $f(0.99) = 0.9801 + 4 = 4.9801$, $f(1.01) = 1.0201 + 4 = 5.0201$. İkisi de 5'e yakın. Limit doğrulandı.</div></div>

<h2 class="lesson-title">3. Sol ve Sağ Limitler</h2>

<div class="calc-highlight"><strong>Önemli incelik:</strong> sayı doğrusu üzerinde bir noktaya yaklaşmanın iki yolu vardır — soldan ve sağdan. Tam bir limit resmi her iki yönü de kontrol etmelidir.</div>

<p class="l-text">Sayı doğrusunu hayal et. $a = 2$ noktasına soldan yaklaşmak için $x = 1.9, 1.99, 1.999, 1.9999, \\dots$ gibi değerler veririz — her değer 2'den küçük, her değer öncekinden daha yakın. Sağdan yaklaşmak için $x = 2.1, 2.01, 2.001, 2.0001, \\dots$ veririz — her değer 2'den büyük, her değer öncekinden daha yakın.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SOL LİMİT</div><div class="compare-item">Gösterim: $\\lim_{x \\to a^-} f(x)$</div><div class="compare-item">x, a'ya <strong>soldan</strong> yaklaşır (küçük değerler)</div><div class="compare-item">Örnek dizi: x = 1.9, 1.99, 1.999, 1.9999, …</div><div class="compare-item">Okuma: "x, a'ya soldan yaklaşırken limit"</div></div><div class="compare-col"><div class="compare-title">SAĞ LİMİT</div><div class="compare-item">Gösterim: $\\lim_{x \\to a^+} f(x)$</div><div class="compare-item">x, a'ya <strong>sağdan</strong> yaklaşır (büyük değerler)</div><div class="compare-item">Örnek dizi: x = 2.1, 2.01, 2.001, 2.0001, …</div><div class="compare-item">Okuma: "x, a'ya sağdan yaklaşırken limit"</div></div></div>

<div class="calc-formula"><div class="formula-label">İKİ TARAFLI LİMİT VARLIK KURALI</div><div class="formula-main">$$\\lim_{x \\to a} f(x) \\text{ vardır} \\;\\iff\\; \\lim_{x \\to a^-} f(x) \\;=\\; \\lim_{x \\to a^+} f(x)$$</div><div class="formula-sub">İki tek taraflı limit hem var olmalı hem de birbirine eşit olmalıdır. Eşit değilseler — veya biri var değilse — iki taraflı limit yoktur.</div></div>

<p class="l-text"><strong>Neden her iki yön?</strong> Çünkü bir fonksiyon bir noktanın iki yanında çok farklı davranabilir. x &lt; 2 için 1'e, x &gt; 2 için 5'e eşit olan bir basamak fonksiyonu hayal et. 2'ye soldan yaklaşmak 1 verir; sağdan yaklaşmak 5 verir. f'in yaklaştığı tek bir sayı yoktur — yani iki taraflı limit yoktur.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Şu fonksiyon verilsin:</strong> $f(x) = \\begin{cases} x + 1 & x < 2 \\text{ ise} \\\\ 4 - x & x \\geq 2 \\text{ ise} \\end{cases}$<br><br><strong>a = 2'de tek taraflı limitleri hesapla.</strong><br><br>Soldan, ilk dalı kullanırız ($x + 1$):<br>$\\lim_{x \\to 2^-} f(x) = 2 + 1 = 3$.<br><br>Sağdan, ikinci dalı kullanırız ($4 - x$):<br>$\\lim_{x \\to 2^+} f(x) = 4 - 2 = 2$.<br><br>İki tek taraflı limit $3$ ve $2$'dir. Uyuşmazlar. Bu nedenle $\\lim_{x \\to 2} f(x)$ <strong>yoktur</strong>.</div></div>

<div class="calc-graph"><div id="plot-l11-jump-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> çözümlü örnekteki parçalı fonksiyon. Sol mavi dal, x = 2'den hemen önce 3 yüksekliğine tırmanır (boş daire, değer 3). Sağ mavi dal, x = 2'den hemen sonra 2 yüksekliğinden başlar (dolu daire, değer 2). İki yükseklik uyuşmuyor, yani x = 2'de iki taraflı limit yok.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[],yL=[];for(var i=-10;i<=20;i++){var x=i/10;xL.push(x);yL.push(x+1);}
var xR=[],yR=[];for(var i=20;i<=40;i++){var x=i/10;xR.push(x);yR.push(4-x);}
var leftT={x:xL,y:yL,mode:'lines',name:'f(x) = x+1, x < 2',line:{color:'#3b82f6',width:3}};
var rightT={x:xR,y:yR,mode:'lines',name:'f(x) = 4−x, x ≥ 2',line:{color:'#3b82f6',width:3},showlegend:false};
var openDot={x:[2],y:[3],mode:'markers',name:'boş: sol limit 3',marker:{size:13,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}}};
var closedDot={x:[2],y:[2],mode:'markers',name:'dolu: f(2) = 2',marker:{size:11,color:'#3b82f6'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.2,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-0.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l11-jump-tr',[leftT,rightT,openDot,closedDot],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Gösterim hatırlatması:</strong> küçük eksi veya artı işareti hedef değerin üzerine üst simge olarak oturur, x'in üzerine değil. $x \\to 2^-$ yazarız, $x^- \\to 2$ değil. Üst simge "hangi taraftan?" sorusuna cevap verir.</div>

<h2 class="lesson-title">4. Grafikten Limit Okuma</h2>

<div class="calc-highlight"><strong>Bir grafik önündeyse, limit bulmak görsel bir alıştırmadır.</strong> Noktanın kendisini parmağınla kapat. Noktanın hemen solundaki eğriye bak ve gözünü x = a'ya doğru kaydırırken eğriyi takip et — eğri hangi yüksekliğe yaklaşıyor? O yükseklik sol limittir. Aynısını sağda yap. İki yükseklik uyuşuyorsa, iki taraflı limit o ortak yüksekliktir.</div>

<p class="l-text">Aşağıda üç ilginç nokta içeren parçalı bir fonksiyon var: düzgün bir nokta (a = 1), giderilebilir bir delik (a = 2) ve bir sıçrama (a = 3). Her birinde limiti okuyacağız.</p>

<div class="calc-graph"><div id="plot-l11-readgraph-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> üç etiketli noktası olan bir fonksiyon. x = 1'de grafik düzgün geçer — limit, fonksiyon değerine eşittir. x = 2'de 3 yüksekliğinde bir delik vardır (boş daire) ve 1 yüksekliğinde ayrı bir dolu nokta vardır — limit vardır ama f(2)'ye eşit değildir. x = 3'te grafik 2 yüksekliğinden 4 yüksekliğine sıçrar — limit yoktur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xa=[],ya=[];for(var i=0;i<=20;i++){var x=i/10;xa.push(x);ya.push((x-1)*(x-1)+2);}
var xb=[],yb=[];for(var i=20;i<=30;i++){var x=i/10;xb.push(x);yb.push(-2*x+7);}
var xc=[],yc=[];for(var i=30;i<=45;i++){var x=i/10;xc.push(x);yc.push(x+1);}
var t1={x:xa,y:ya,mode:'lines',name:'dal 1',line:{color:'#3b82f6',width:3}};
var t2={x:xb,y:yb,mode:'lines',name:'dal 2',line:{color:'#3b82f6',width:3},showlegend:false};
var t3={x:xc,y:yc,mode:'lines',name:'dal 3',line:{color:'#3b82f6',width:3},showlegend:false};
var holeAt2={x:[2],y:[3],mode:'markers',name:'x=2 deliği',marker:{size:12,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}}};
var closedAt2={x:[2],y:[1],mode:'markers',name:'f(2) = 1',marker:{size:11,color:'#ef4444'}};
var holeLeft3={x:[3],y:[1],mode:'markers',name:'x=3⁻ boş',marker:{size:12,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}},showlegend:false};
var holeRight3={x:[3],y:[4],mode:'markers',name:'x=3⁺ boş',marker:{size:12,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}},showlegend:false};
var smoothAt1={x:[1],y:[2],mode:'markers',name:'x=1 düzgün',marker:{size:10,color:'#10b981'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.3,4.7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'f(x)',range:[0,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l11-readgraph-tr',[t1,t2,t3,holeAt2,closedAt2,holeLeft3,holeRight3,smoothAt1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>a = 1'de limit okuma (düzgün nokta).</strong> Gözünü eğriden soldan x = 1'e doğru kaydır: eğri 2 yüksekliğindedir. Sağdan kaydır: yine 2 yüksekliğindedir. Yani $\\lim_{x \\to 1^-} f(x) = 2$ ve $\\lim_{x \\to 1^+} f(x) = 2$. Uyuşurlar, yani</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 1} f(x) \\;=\\; 2$$</div></div>

<p class="l-text">Grafikten gözle $f(1) = 2$ de görülür — limit ve fonksiyon değeri uyuşuyor.</p>

<p class="l-text"><strong>a = 2'de limit okuma (delik).</strong> Eğri soldan 3 yüksekliğine tırmanır ve sağdan da 3 yüksekliğine varır — iki tek taraflı limit 3'e eşittir. İki taraflı limit vardır:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 2} f(x) \\;=\\; 3$$</div></div>

<p class="l-text">Ama kırmızı noktayı fark et — fonksiyon değeri x = 2'de ayrı olarak $f(2) = 1$ tanımlanmıştır. Limit (3) ve fonksiyon değeri (1) uyuşmuyor. <em>Buna izin verilir.</em> Limit "eğri nereye gidiyor?" diye sorar, "tam noktada ne belirtildi?" diye değil.</p>

<p class="l-text"><strong>a = 3'te limit okuma (sıçrama).</strong> Soldan eğri 1 yüksekliğine iner; sağdan 4 yüksekliğinde başlar ve yükselir. Tek taraflı limitler 1 ve 4'tür. Uyuşmazlar, yani</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 3} f(x) \\;\\text{ yoktur.}$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — GRAFİK OKUMA</div><div class="example-body">Yukarıdaki grafikten her boşluğu doldur:<br><br>(a) $\\lim_{x \\to 1} f(x) = $ <strong>2</strong> &nbsp; (düzgün, limit = fonksiyon değeri)<br>(b) $\\lim_{x \\to 2^-} f(x) = $ <strong>3</strong>, &nbsp; $\\lim_{x \\to 2^+} f(x) = $ <strong>3</strong>, &nbsp; $\\lim_{x \\to 2} f(x) = $ <strong>3</strong>, &nbsp; $f(2) = $ <strong>1</strong><br>(c) $\\lim_{x \\to 3^-} f(x) = $ <strong>1</strong>, &nbsp; $\\lim_{x \\to 3^+} f(x) = $ <strong>4</strong>, &nbsp; $\\lim_{x \\to 3} f(x) = $ <strong>YOK</strong></div></div>

<h2 class="lesson-title">5. Tablo Yöntemi ile Limit Tahmini</h2>

<div class="calc-highlight"><strong>Grafiğin yoksa bile limiti elle araştırabilirsin</strong> — hedefe iki taraftan yaklaşan x değerlerinden bir dizi seç, her birinde f(x)'i hesapla ve sayıların nereye yerleştiğini izle.</div>

<p class="l-text">Buna limit tahmini için <strong>sayısal yöntem</strong> denir. Bir kanıt değildir — sonlu sayıda değerden oluşan bir tablo, yakındaki sonsuz çok diğer noktada ne olacağını garanti edemez — ama çok güvenilir bir dedektif aracıdır ve sezgini hızlı geliştirir.</p>

<p class="l-text">Şunu tahmin edelim:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}$$</div></div>

<p class="l-text">$x = 1$'de doğrudan yerine koyma $\\frac{0}{0}$ verir, tanımsız. Bu yüzden bir tablo yaparız:</p>

<div class="calc-formula"><div class="formula-label">SAYISAL TABLO</div><div class="formula-main">$$\\begin{array}{c|c} x & f(x) = \\frac{x^2 - 1}{x - 1} \\\\ \\hline 0.9 & 1.9 \\\\ 0.99 & 1.99 \\\\ 0.999 & 1.999 \\\\ 1 & \\text{tanımsız} \\\\ 1.001 & 2.001 \\\\ 1.01 & 2.01 \\\\ 1.1 & 2.1 \\end{array}$$</div></div>

<p class="l-text">Soldan, f(x) yukarı doğru süzülür: 1.9, 1.99, 1.999. Sağdan, f(x) aşağı doğru süzülür: 2.001, 2.01, 2.1. İki taraf da 2 değerine yerleşir. Yani:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1} \\;=\\; 2$$</div></div>

<p class="l-text"><strong>Bu neden çalışıyor?</strong> Pay, iki kare farkı olarak çarpanlarına ayrılır: $x^2 - 1 = (x - 1)(x + 1)$. Her $x \\neq 1$ için ortak çarpanı sadeleştirebiliriz:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{x^2 - 1}{x - 1} \\;=\\; \\frac{(x - 1)(x + 1)}{x - 1} \\;=\\; x + 1 \\quad (x \\neq 1)$$</div></div>

<p class="l-text">Yani fonksiyon, $x = 1$ hariç her yerde $x + 1$ ile aynıdır. $x \\to 1$ giderken daha basit ifade $x + 1 \\to 2$. Tablo bize doğru cevabı verdi; çarpanlara ayırma ise kanıtı verdi.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TABLO YÖNTEMİ</div><div class="example-body"><strong>Tahmin et:</strong> $\\lim_{x \\to 0} \\dfrac{\\sin x}{x}$, x radyan cinsinden.<br><br>$\\begin{array}{c|c} x & \\sin(x)/x \\\\ \\hline -0.1 & 0.99833 \\\\ -0.01 & 0.99998 \\\\ -0.001 & 1.00000 \\\\ 0 & \\text{tanımsız} \\\\ 0.001 & 1.00000 \\\\ 0.01 & 0.99998 \\\\ 0.1 & 0.99833 \\end{array}$<br><br>İki taraf da 1'e doğru süzülür. Yani $\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = \\mathbf{1}$. (Bu ünlü limit, sonraki derslerdeki her trig türevinin omurgasıdır.)</div></div>

<div class="l-note"><strong>Tablolar hakkında uyarı:</strong> bir tablo neyin muhtemelen doğru olduğunu söyler, neyin kesinlikle doğru olduğunu değil. Bazı fonksiyonlar bir noktanın yakınında öyle vahşice salınır ki, sonlu sayıda örnek değer bir sayıya yerleşiyor gibi görünür, ama aslında limit yoktur. Bölüm 7'de tam böyle bir durumla karşılaşacağız.</div>

<h2 class="lesson-title">6. Limit, f(a)'ya Eşit Olmak Zorunda Değildir</h2>

<div class="calc-highlight"><strong>Bu, tüm dersin en önemli kavramsal noktasıdır.</strong> Bir a noktasındaki limit, x &rarr; a giderken f(x)'in neye yaklaştığını ölçer. f(a) fonksiyon değeri, tam noktada basitçe yazılmış olandır. Bunlar iki farklı fikirdir ve iki farklı sayı üretebilirler.</div>

<p class="l-text">Tanım kümesindeki bir $a$ noktasında üç şey olabilir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Limit var, f(a)'ya eşit</div><div class="card-body">Fonksiyon a'da <em>süreklidir</em>. Kalemini kaldırmadan noktadan geçebilirsin.</div></div>
<div class="calc-card"><div class="card-title">Limit var, fakat limit &ne; f(a)</div><div class="card-body">Fonksiyonun a'da bir "deliği" vardır — limit bir değere yaklaşır ama fonksiyon farklı bir değer olarak tanımlanmıştır (veya tek bir nokta taşınmıştır).</div></div>
<div class="calc-card"><div class="card-title">Limit yok</div><div class="card-body">İki tek taraflı limit uyuşmuyor, ya fonksiyon salınıyor, ya da sonsuza fırlıyor. Bunları bölüm 7'de kataloglayacağız.</div></div>
</div>

<p class="l-text"><strong>Delikli örnek.</strong> Şunu tanımla:</p>

<div class="calc-formula"><div class="formula-main">$$f(x) \\;=\\; \\frac{x^2 - 4}{x - 2}$$</div></div>

<p class="l-text">Her $x \\neq 2$ için sadeleştirebiliriz: $f(x) = x + 2$. Yani fonksiyon, $y = x + 2$ doğrusu gibi davranır — $x = 2$ hariç, orada tanımsızdır (sıfıra bölme). Limit:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} \\;=\\; \\lim_{x \\to 2} (x + 2) \\;=\\; 4$$</div></div>

<p class="l-text">Ama $f(2)$ tanımsızdır. Yani fonksiyon değeri olmadan bir limitimiz (4) var. Grafik, $(2, 4)$ noktasında tek bir boş daire olan düz bir doğrudur.</p>

<div class="calc-graph"><div id="plot-l11-hole-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $(x^2 - 4)/(x - 2)$ fonksiyonu, her $x \\neq 2$ için $y = x + 2$ doğrusu ile özdeştir. $x = 2$'de fonksiyon tanımsızdır (boş daire deliği gösterir). $x = 2$'deki limit hala 4'tür çünkü eğri iki taraftan 4 yüksekliğine yaklaşır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[],yL=[];for(var i=-20;i<20;i++){var x=i/10;xL.push(x);yL.push(x+2);}
var xR=[],yR=[];for(var i=21;i<=50;i++){var x=i/10;xR.push(x);yR.push(x+2);}
var leftT={x:xL,y:yL,mode:'lines',name:'f(x) = x+2, x < 2',line:{color:'#3b82f6',width:3}};
var rightT={x:xR,y:yR,mode:'lines',name:'f(x) = x+2, x > 2',line:{color:'#3b82f6',width:3},showlegend:false};
var hole={x:[2],y:[4],mode:'markers',name:'(2, 4) deliği',marker:{size:13,color:'rgba(0,0,0,0)',line:{color:'#ef4444',width:3}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-1,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l11-hole-tr',[leftT,rightT,hole],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Yeniden tanımlı nokta örneği.</strong> Şu parçalı fonksiyonu düşün:</p>

<div class="calc-formula"><div class="formula-main">$$g(x) \\;=\\; \\begin{cases} x + 2 & x \\neq 2 \\\\ 0 & x = 2 \\end{cases}$$</div></div>

<p class="l-text">Burada $g$, $x = 2$ dışında her yerde aynı $x + 2$ doğrusudur — orada keyfi olarak 0 değerini alacak şekilde yeniden tanımlanmıştır. $x \\to 2$ giderken limit, tam olarak $x = 2$'deki değeri umursamaz — sadece yakındaki noktaları inceler. Yani:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 2} g(x) \\;=\\; 4, \\qquad g(2) \\;=\\; 0$$</div></div>

<p class="l-text">Limit ve fonksiyon değeri 4 farkla uyuşmuyor. Bu, tamamen yasal bir matematiksel durumdur. Limit ve yerine koyma farklı işlemlerdir.</p>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">Yeryüzünde neden biri bir fonksiyonu kendi limiti ile uyuşmayacak şekilde tanımlasın? Bazen kazara olur — bir formül tek bir noktada tanımsızdır (yukarıdaki $0/0$ durumu gibi) ve biri onu "yanlış" değerle yamalır. Bazen kasten olur — bir fonksiyon, alışılmadık bir örnek noktada alınan bir ölçümü modelliyor olabilir. Her iki durumda da limit ve fonksiyon değeri bağımsız hayatlar yaşar.</div></div>

<h2 class="lesson-title">7. Limitin Var Olmamasının Üç Yolu</h2>

<div class="calc-highlight"><strong>Her limit var olmaz.</strong> Fonksiyon, x, a'ya yaklaşırken tek bir değere yerleşmediğinde, limitin var olmadığını (yok, DNE) söyleriz. Üç klasik neden vardır.</div>

<p class="l-text"><strong>Neden 1 — Sıçrama (tek taraflı limitler uyuşmuyor).</strong> Bunu bölüm 3 ve 4'te zaten gördük. Sol ve sağ limit iki farklı sayı ise, hiçbir tek L değeri her ikisi için işe yaramaz. İki taraflı limit yoktur.</p>

<p class="l-text"><strong>Neden 2 — Sonsuza ıraksama.</strong> Bazen fonksiyon x, a'ya yaklaşırken üst sınır olmadan büyür (veya alt sınır olmadan düşer). Klasik örnek:</p>

<div class="calc-formula"><div class="formula-main">$$f(x) \\;=\\; \\frac{1}{x^2}$$</div></div>

<p class="l-text">$x \\to 0$ giderken her iki taraftan $1/x^2$ patlar: $x = 0.1$'de 100, $x = 0.01$'de 10000, $x = 0.001$'de bir milyon. Hiçbir sonlu $L$ sayısı limit olamaz. Bazen</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 0} \\frac{1}{x^2} \\;=\\; +\\infty$$</div></div>

<p class="l-text">yazarız, "f(x), herhangi bir sınırın ötesine büyür" anlamında kısaltma olarak, ama tam anlamıyla (gerçek sayı olarak) limit yoktur.</p>

<p class="l-text"><strong>Neden 3 — Vahşi salınım.</strong> En zor durum. $\\sin(1/x)$ fonksiyonu, $x \\to 0$ giderken daha hızlı ve hızlı salınır — sıfırın herhangi bir komşuluğunda sonsuz çok kez $-1$ ile $+1$ arasında. Fonksiyonun yerleştiği tek bir değer yoktur, yani:</p>

<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 0} \\sin\\!\\left(\\frac{1}{x}\\right) \\;\\text{ yoktur.}$$</div></div>

<div class="calc-graph"><div id="plot-l11-osc-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> x, 0'a yaklaşırken $\\sin(1/x)$. Fonksiyon, sıfır etrafındaki herhangi bir küçük aralığa sıkıştırılmış sonsuz çok döngü ile −1 ve +1 arasında salınır. x, 0'a ne kadar yakın olursa olsun, f(x) değeri sallanmaya devam eder — yerleştiği tek bir yükseklik yoktur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xv=[],yv=[];for(var i=1;i<=2000;i++){var x=i/2000*0.6+0.001;xv.push(x);yv.push(Math.sin(1/x));}
var xN=[],yN=[];for(var i=1;i<=2000;i++){var x=-i/2000*0.6-0.001;xN.push(x);yN.push(Math.sin(1/x));}
var t1={x:xv,y:yv,mode:'lines',name:'sin(1/x)',line:{color:'#3b82f6',width:1.2}};
var t2={x:xN,y:yN,mode:'lines',name:'sin(1/x), x<0',line:{color:'#3b82f6',width:1.2},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.6,0.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'sin(1/x)',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l11-osc-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Burada sayısal bir tablo seni neden kandırabilir.</strong> Tam sayılar $n$ için $x = 1/(n\\pi)$ örnekleyecek olursan, her seferinde $\\sin(n\\pi) = 0$ alırsın ve limit sıfırdır sonucuna varırsın. Ama $x = 2/((2n+1)\\pi)$ örneklersen $\\sin((2n+1)\\pi/2) = \\pm 1$ alırsın. Şanssız örnek noktalarda bir tablo, var olmayan bir limit ilan edebilir. Sayısal yöntemin yanıltıcı olduğu nadir durumdur bu.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sıçrama (taraflar uyuşmuyor)</div><div class="card-body">$\\lim_{x \\to a^-} \\neq \\lim_{x \\to a^+}$. Her tarafın açık limiti vardır, ama iki değer uyuşmuyor. Örnek: parçalı basamak.</div></div>
<div class="calc-card"><div class="card-title">Iraksama (sınırsız)</div><div class="card-body">$|f(x)|$, $a$ yakınında herhangi bir sınırın ötesine büyür. Hiçbir sonlu gerçek sayı $L$ çalışmaz. Örnek: 0 yakınında $1/x^2$.</div></div>
<div class="calc-card"><div class="card-title">Salınım</div><div class="card-body">$f(x)$, yerleşmeden değerler arasında sallanmaya devam eder. Örnek: 0 yakınında $\\sin(1/x)$.</div></div>
</div>

<div class="calc-highlight"><strong>Yakın çekim: ünlü limit $\\lim_{x \\to 0} \\sin(x)/x$.</strong> Bu, bölüm 5'te tablo ile tahmin ettiğimiz limit. Aşağıdaki grafik, fonksiyonu sıfırın iki tarafında gösteriyor. Fonksiyon tam olarak $x = 0$'da tanımsız (bir delik), ama eğri iki yönden de $1$ yüksekliğine simetrik olarak tırmanıyor. Kırmızı işaretçiler, sol ve sağdan örnek noktaları gösteriyor ve limit değeri $L = 1$'e yaklaşıyor.</div>

<div class="calc-graph"><div id="plot-l11-sinxx-tr-extra" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $[-4, 4]$ üzerinde $f(x) = \\sin(x)/x$. Fonksiyon $x = 0$'da tanımsızdır (boş daire deliği gösterir), ama iki taraftan limit $L = 1$'dir. $x = \\pm 0.5$ ve $x = \\pm 0.1$'deki kırmızı işaretçiler, x, 0'a yaklaşırken f(x)'in 1'e nasıl yaklaştığını gösterir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[],yL=[];for(var i=-400;i<=-1;i++){var x=i/100;xL.push(x);yL.push(Math.sin(x)/x);}
var xR=[],yR=[];for(var i=1;i<=400;i++){var x=i/100;xR.push(x);yR.push(Math.sin(x)/x);}
var leftT={x:xL,y:yL,mode:'lines',name:'sin(x)/x, x < 0',line:{color:'#3b82f6',width:3}};
var rightT={x:xR,y:yR,mode:'lines',name:'sin(x)/x, x > 0',line:{color:'#3b82f6',width:3},showlegend:false};
var hole={x:[0],y:[1],mode:'markers',name:'x = 0 deliği',marker:{size:13,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}}};
var leftApproach={x:[-0.5,-0.1],y:[Math.sin(-0.5)/-0.5,Math.sin(-0.1)/-0.1],mode:'markers+text',name:'sol yaklaşım → 1',marker:{size:10,color:'#ef4444'},text:['x=-0.5','x=-0.1'],textposition:'top center',textfont:{color:'#ef4444',size:11}};
var rightApproach={x:[0.1,0.5],y:[Math.sin(0.1)/0.1,Math.sin(0.5)/0.5],mode:'markers+text',name:'sağ yaklaşım → 1',marker:{size:10,color:'#ef4444'},text:['x=0.1','x=0.5'],textposition:'top center',textfont:{color:'#ef4444',size:11}};
var limitLine={x:[-4,4],y:[1,1],mode:'lines',name:'L = 1',line:{color:'rgba(239,68,68,0.45)',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4.2,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'sin(x)/x',range:[-0.35,1.25],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l11-sinxx-tr-extra',[leftT,rightT,limitLine,hole,leftApproach,rightApproach],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>İşaretçileri okumak.</strong> $x = \\pm 0.5$'te fonksiyon değeri $\\sin(0.5)/0.5 \\approx 0.9589$ — zaten 1'e yakın. $x = \\pm 0.1$'de değer $\\sin(0.1)/0.1 \\approx 0.9983$ — daha da yakın. x, 0'a iki taraftan daha da yaklaştıkça yükseklikler, kesik çizgi $L = 1$'e dayanır. Fonksiyon hiçbir zaman 1'e ulaşmaz (0'da tanımsız), ama limit ulaşır: $\\lim_{x \\to 0} \\sin(x)/x = 1$.</p>

<div class="calc-highlight"><strong>Özet tablo — dört kanonik durum.</strong> Herhangi bir limiti teşhis etmek için bunu hızlı bir referans olarak kullan.</div>

<div style="margin:1.2rem 0;overflow-x:auto;border-radius:8px;border:1px solid rgba(59,130,246,0.25)">
<table style="width:100%;border-collapse:collapse;background:#0a0a0a;color:rgba(235,230,220,0.92);font-size:0.92rem">
<thead>
<tr style="background:#3b82f6;color:#0a0a0a">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-right:1px solid rgba(10,10,10,0.2)">Durum</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-right:1px solid rgba(10,10,10,0.2)">Örnek</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em">Sonuç</th>
</tr>
</thead>
<tbody>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">İki taraflı limit var</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">Sol limit = sağ limit; ikisi de sonlu</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$\\displaystyle \\lim_{x \\to 0} \\frac{\\sin x}{x}$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$x = 0$'da delik, iki taraf da → 1</span></td>
<td style="padding:0.65rem 0.9rem;color:#10b981;font-weight:600">$L = 1$ (var)</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Sol ≠ sağ (sıçrama)</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">İki tek taraflı limit de var ama uyuşmuyor</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$f(x) = \\begin{cases} x+1 & x < 2 \\\\ 4-x & x \\geq 2 \\end{cases}$, $a = 2$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">Sol → 3, sağ → 2</span></td>
<td style="padding:0.65rem 0.9rem;color:#ef4444;font-weight:600">YOK (sıçrama)</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Sonsuz limit</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">Fonksiyon her sınırın ötesine büyür</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$\\displaystyle \\lim_{x \\to 0} \\frac{1}{x^2}$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">İki taraf da $+\\infty$'a fırlar</span></td>
<td style="padding:0.65rem 0.9rem;color:#ef4444;font-weight:600">YOK ($+\\infty$ yaz)</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Salınımlı</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">Fonksiyon yerleşmeden sallanır</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$\\displaystyle \\lim_{x \\to 0} \\sin\\!\\left(\\frac{1}{x}\\right)$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$[-1, 1]$ içinde sonsuz çok döngü</span></td>
<td style="padding:0.65rem 0.9rem;color:#ef4444;font-weight:600">YOK (salınım)</td>
</tr>
</tbody>
</table>
</div>

<h2 class="lesson-title">8. Klasik Alıştırma — Grafikten Limit Okuma</h2>

<div class="calc-highlight"><strong>Aşağıda birkaç ilginç özelliği olan tek bir grafik var.</strong> Onu kullanarak altı limit hesapla. Acele etme. Noktayı parmağınla kapat ve sor: "soldan hangi yüksekliğe yaklaşıyorum? sağdan?"</div>

<div class="calc-graph"><div id="plot-l11-practice-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $-1 \\leq x \\leq 6$ üzerinde tanımlı tek bir $f$ fonksiyonu. $x = 0$ yakınında düzgün bir noktası vardır (değer 1), $x = 2$'de giderilebilir bir delik vardır (limit 3, ama $f(2) = 5$), $x = 4$'te bir sıçrama vardır (sol limit 2, sağ limit 4), ve $x = 5$'te dikey bir asimptot vardır (fonksiyon $+\\infty$'a fırlar). Aşağıdaki altı alıştırmayı cevaplamak için grafiği kullan.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xa=[],ya=[];for(var i=-10;i<=20;i++){var x=i/10;xa.push(x);ya.push(x+1);}
var xb=[],yb=[];for(var i=20;i<=40;i++){var x=i/10;xb.push(x);yb.push(-0.5*x+4);}
var xc=[],yc=[];for(var i=40;i<=49;i++){var x=i/10;xc.push(x);yc.push(3.5+0.5/(5-x));}
for(var i=490;i<=499;i++){var x=i/100;xc.push(x);yc.push(3.5+0.5/(5-x));}
var xd=[],yd=[];for(var i=51;i<=60;i++){var x=i/10;xd.push(x);yd.push(-x+7);}
var t1={x:xa,y:ya,mode:'lines',name:'[-1, 2) dalı',line:{color:'#3b82f6',width:3}};
var t2={x:xb,y:yb,mode:'lines',name:'[2, 4) dalı',line:{color:'#3b82f6',width:3},showlegend:false};
var t3={x:xc,y:yc,mode:'lines',name:'[4, 5) dalı',line:{color:'#3b82f6',width:3},showlegend:false};
var t4={x:xd,y:yd,mode:'lines',name:'(5, 6] dalı',line:{color:'#3b82f6',width:3},showlegend:false};
var holeAt2={x:[2],y:[3],mode:'markers',name:'delik',marker:{size:12,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}}};
var dotAt2={x:[2],y:[5],mode:'markers',name:'f(2) = 5',marker:{size:11,color:'#ef4444'}};
var holeLeft4={x:[4],y:[2],mode:'markers',name:'x=4⁻ boş',marker:{size:12,color:'rgba(0,0,0,0)',line:{color:'#3b82f6',width:3}},showlegend:false};
var holeRight4={x:[4],y:[4],mode:'markers',name:'f(4) = 4',marker:{size:11,color:'#3b82f6'}};
var asymp={x:[5,5],y:[0,7],mode:'lines',name:'asimptot x=5',line:{color:'rgba(239,68,68,0.5)',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'f(x)',range:[0,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l11-practice-tr',[t1,t2,t3,t4,holeAt2,dotAt2,holeLeft4,holeRight4,asymp],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Yukarıdaki grafikten okunacak altı limit.</strong> Cevabı okumadan önce her birini kendin dene.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body"><strong>Bul:</strong> $\\lim_{x \\to 0} f(x)$.<br><br>$x = 0$'da grafik, düzgün sol dal $y = x + 1$ üzerindedir. x, 0'a iki taraftan kayarken eğri $0 + 1 = 1$ yüksekliğine yaklaşır. Limit <strong>1</strong>. (Ve $f(0) = 1$.)</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body"><strong>Bul:</strong> $\\lim_{x \\to 2^-} f(x)$.<br><br>$x = 2$'nin solunda $y = x + 1$ dalı üzerindeyiz. $x \\to 2^-$ giderken $y \\to 2 + 1 = 3$. Sol limit <strong>3</strong>.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body"><strong>Bul:</strong> $\\lim_{x \\to 2^+} f(x)$ ve $\\lim_{x \\to 2} f(x)$.<br><br>$x = 2$'nin sağında $y = -0.5x + 4$ dalı üzerindeyiz. $x \\to 2^+$ giderken $y \\to -1 + 4 = 3$. Sağ limit <strong>3</strong>.<br><br>Sol limit = sağ limit = 3, yani iki taraflı limit <strong>3</strong>. $f(2) = 5$ (kırmızı nokta) olduğuna dikkat et. Limit ve fonksiyon değeri uyuşmuyor — giderilebilir bir delik.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body"><strong>Bul:</strong> $\\lim_{x \\to 4^-} f(x)$, $\\lim_{x \\to 4^+} f(x)$ ve $\\lim_{x \\to 4} f(x)$.<br><br>$x = 4$'te soldan $y = -0.5x + 4$ doğrusu $y = 2$'ye ulaşır. Sol limit = <strong>2</strong>.<br><br>$x = 4$'te sağdan sonraki dal $y = 4$'te başlar. Sağ limit = <strong>4</strong>.<br><br>$2 \\neq 4$, yani $\\lim_{x \\to 4} f(x)$ <strong>yoktur</strong> (sıçrama).</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body"><strong>Bul:</strong> $\\lim_{x \\to 5^-} f(x)$.<br><br>$x \\to 5^-$ giderken $y = 3.5 + 0.5/(5 - x)$ dalı $+\\infty$'a fırlar (payda $5 - x$ pozitif değerlerden 0'a yaklaşır, yani kesir patlar). Limit <strong>gerçek sayı olarak yoktur</strong>. Kısaltma olarak $\\lim_{x \\to 5^-} f(x) = +\\infty$ yazabiliriz.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6</div><div class="example-body"><strong>Bul:</strong> $\\lim_{x \\to 6} f(x)$.<br><br>$x = 6$'da grafik düzgün sağ dal $y = -x + 7$ üzerindedir. $x \\to 6$ giderken iki taraftan $y \\to -6 + 7 = 1$. Limit <strong>1</strong>. (Bu noktada drama yok — fonksiyon orada düzgün.)</div></div>

<div class="think-box"><div class="think-label">ÖZET — GRAFİKTEN LİMİT NASIL OKUNUR</div><div class="think-body">(1) Yatay eksende hedef x-değeri $a$'yı bul. (2) Noktanın kendisini kapat; $f(a)$'ya bakma. (3) Gözünü eğriden soldan $a$'ya doğru kaydır — eğrinin yaklaştığı yükseklik sol limittir. (4) Sağdan tekrarla — o yükseklik sağ limittir. (5) Uyuşurlarsa, iki taraflı limit ortak değerleridir. Uyuşmazlarsa, iki taraflı limit yoktur.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENDİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Limit, f(x)'in nereye <em>gittiğini</em> sorar, f(a)'nın ne olduğunu değil. İkisi farklı olabilir.</li>
<li>$\\lim_{x \\to a} f(x) = L$ gösterimi, tüm fikri beş sembolde kodlar.</li>
<li>İki taraflı limit, ancak ve ancak sol ve sağ limit uyuştuğunda vardır.</li>
<li>Bir limiti grafiği okuyarak (noktayı kapat ve kaydır), sayısal tablo yaparak veya cebirsel işlemle bulabilirsin.</li>
<li>$a$'daki fonksiyon değeri, limitten tamamen ayrıdır. Bir delik, bir sıçrama, yeniden tanımlanmış bir nokta — hiçbiri limiti etkilemez.</li>
<li>Bir limit üç nedenle var olmayabilir: iki taraf uyuşmaz (sıçrama), fonksiyon sonsuza ıraksar veya fonksiyon yerleşmeden salınır.</li>
</ul>
</div>`
};
