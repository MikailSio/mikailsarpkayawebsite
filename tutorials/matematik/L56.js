window.LISE_MAT_L56 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A quadratic inequality is just a quadratic equation with the equals sign replaced by an inequality symbol.</strong> Instead of asking "for which x is $ax^2+bx+c$ equal to zero?", we now ask "for which x is $ax^2+bx+c$ <em>positive</em> (or negative, or non-negative, or non-positive)?". The roots of the quadratic are still the key landmarks, but the answer is no longer a finite list of numbers — it is a set of intervals on the real line.</p>

<p class="l-text">In this lesson you learn to read the answer straight off the parabola. The graph of $y = ax^2+bx+c$ is a U-shape (when $a>0$) or an upside-down U (when $a<0$). Wherever the curve sits above the x-axis, $y$ is positive; below the x-axis, $y$ is negative; on the x-axis, $y$ is zero. So solving a quadratic inequality reduces to a single question with a visual answer: <em>where does the parabola live?</em> Get fluent with this picture and a whole class of problems collapses to a 30-second sketch.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Write any quadratic inequality in standard form $ax^2+bx+c \\;\\square\\; 0$ where $\\square \\in \\{<, \\le, >, \\ge\\}$</li>
<li>Use the discriminant $\\Delta = b^2 - 4ac$ together with the sign of $a$ to sketch the parabola without plotting points</li>
<li>Build a sign chart from the roots and read the solution set as a union of intervals</li>
<li>Handle all three discriminant cases: $\\Delta>0$ (two roots), $\\Delta=0$ (double root), $\\Delta<0$ (no real roots)</li>
<li>Switch correctly between strict and non-strict inequalities (open vs closed brackets)</li>
<li>Extend the sign-chart technique to factored polynomial inequalities of degree three or higher</li>
<li>Translate word problems (projectile height, area constraints) into quadratic inequalities and solve</li>
</ul>
</div>

<h2 class="lesson-title">1. Standard Form of a Quadratic Inequality</h2>

<div class="calc-highlight"><strong>Always rewrite the inequality so that one side is zero.</strong> The parabola you will analyse is $y = ax^2+bx+c$, and the only question is whether this $y$ is positive, negative, or zero. Moving everything to one side keeps the picture clean.</div>

<p class="l-text">A <strong>quadratic inequality</strong> in one variable $x$ has one of the four standard forms below. The coefficient $a$ is non-zero (otherwise it would not be quadratic), and $a$, $b$, $c$ are real numbers.</p>

<div class="calc-formula"><div class="formula-label">FOUR STANDARD FORMS</div><div class="formula-main">$$ax^2 + bx + c \\;<\\; 0 \\qquad ax^2 + bx + c \\;\\le\\; 0$$ $$ax^2 + bx + c \\;>\\; 0 \\qquad ax^2 + bx + c \\;\\ge\\; 0$$</div><div class="formula-sub">The first two are <em>negative</em> (or non-positive); the last two are <em>positive</em> (or non-negative). With $\\le$ and $\\ge$ the roots themselves are included in the solution; with $<$ and $>$ they are excluded.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; REWRITING</div><div class="example-body">Rewrite $3x^2 + 5 \\;\\ge\\; 2x^2 + 4x + 9$ in standard form.<br><br>Move everything to the left: $3x^2 + 5 - 2x^2 - 4x - 9 \\;\\ge\\; 0$, which simplifies to $x^2 - 4x - 4 \\;\\ge\\; 0$. Now $a=1$, $b=-4$, $c=-4$ and the picture is the parabola $y=x^2-4x-4$, asking where it sits at or above the x-axis.</div></div>

<div class="l-note"><strong>Why "move everything to one side"?</strong> Because the geometric picture only makes sense when we have a single parabola to look at. Comparing two parabolas at once is harder than comparing one parabola to a flat horizontal line (the x-axis).</div>

<h2 class="lesson-title">2. Reading the Sign of a Parabola from Its Graph</h2>

<div class="calc-highlight"><strong>Two ingredients fully determine the shape:</strong> the sign of the leading coefficient $a$ (does the parabola open upward or downward?) and the sign of the discriminant $\\Delta = b^2 - 4ac$ (does it cross the x-axis twice, touch it once, or miss it entirely?). Combine those two pieces and you can sketch the graph &mdash; and therefore solve the inequality &mdash; in seconds.</div>

<p class="l-text">Recall from the quadratic-formula lesson: the roots of $ax^2+bx+c=0$ are $x = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a}$. The discriminant lives under the square root, so its sign decides whether real roots exist at all.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a > 0$</div><div class="card-body">Parabola opens <strong>upward</strong> (U-shape). The lowest point is the vertex; the curve goes to $+\\infty$ on both sides.</div></div>
<div class="calc-card"><div class="card-title">$a < 0$</div><div class="card-body">Parabola opens <strong>downward</strong> (upside-down U). The highest point is the vertex; the curve goes to $-\\infty$ on both sides.</div></div>
<div class="calc-card"><div class="card-title">$\\Delta > 0$</div><div class="card-body">Two distinct real roots $r_1 < r_2$. The parabola crosses the x-axis at two points.</div></div>
<div class="calc-card"><div class="card-title">$\\Delta = 0$</div><div class="card-body">One double root $r$. The parabola just touches the x-axis at a single point (the vertex).</div></div>
<div class="calc-card"><div class="card-title">$\\Delta < 0$</div><div class="card-body">No real roots. The parabola lies entirely above or entirely below the x-axis, depending on the sign of $a$.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">SIGN RULE (THE KEY FACT)</div><div class="formula-main">$$\\text{sign of } ax^2+bx+c \\;=\\; \\begin{cases} \\text{same sign as } a, & x \\text{ outside the roots} \\\\ \\text{opposite sign of } a, & x \\text{ between the roots} \\end{cases}$$</div><div class="formula-sub">When $\\Delta > 0$, the roots split the real line into three pieces: outside both roots (same sign as $a$) and between them (opposite sign). When $\\Delta \\le 0$ there is no "between" region.</div></div>

<div class="calc-graph"><div id="plot-l56-discriminants-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three parabolas with $a=1$ and varying constant term, illustrating each discriminant case. <span style="color:#3b82f6"><strong>Blue</strong></span>: $y=x^2-5x+6$, two roots at $x=2,3$ ($\\Delta=1>0$). <span style="color:#10b981"><strong>Green</strong></span>: $y=x^2-4x+4$, double root at $x=2$ ($\\Delta=0$). <span style="color:#ef4444"><strong>Red</strong></span>: $y=x^2-2x+3$, no real roots, the parabola lies entirely above the x-axis ($\\Delta=-8<0$).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined'||!document.getElementById('plot-l56-discriminants-en'))return;
var xs=[];for(var i=0;i<=200;i++){xs.push(-2+7*i/200);}
var y1=xs.map(function(x){return x*x-5*x+6;});
var y2=xs.map(function(x){return x*x-4*x+4;});
var y3=xs.map(function(x){return x*x-2*x+3;});
var t1={x:xs,y:y1,mode:'lines',name:'y=x²−5x+6 (Δ>0)',line:{color:'#3b82f6',width:2.8}};
var t2={x:xs,y:y2,mode:'lines',name:'y=x²−4x+4 (Δ=0)',line:{color:'#10b981',width:2.8}};
var t3={x:xs,y:y3,mode:'lines',name:'y=x²−2x+3 (Δ<0)',line:{color:'#ef4444',width:2.8}};
var roots1={x:[2,3],y:[0,0],mode:'markers',name:'Δ>0 roots',marker:{color:'#3b82f6',size:9,symbol:'circle'}};
var root2={x:[2],y:[0],mode:'markers',name:'Δ=0 double root',marker:{color:'#10b981',size:11,symbol:'diamond'}};
var axisLine={x:[-2,5],y:[0,0],mode:'lines',name:'x-axis',line:{color:'rgba(255,255,255,0.35)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'x',range:[-1.5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-3,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l56-discriminants-en',[axisLine,t1,t2,t3,roots1,root2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. The Sign Chart: A Bookkeeping Device</h2>

<div class="calc-highlight"><strong>A sign chart (or sign table) lists every root on a horizontal axis, then writes "+" or "&minus;" in each interval that the roots create.</strong> It is the cleanest way to record what the parabola is doing, especially when you have to combine the answer with another inequality later.</div>

<p class="l-text">Procedure for a quadratic with two real roots $r_1 < r_2$:</p>

<ol class="l-text" style="margin:0.6rem 0 1rem 1.2rem;line-height:1.7">
<li>Solve $ax^2+bx+c=0$ to find $r_1$ and $r_2$.</li>
<li>Draw a number line and mark $r_1$ and $r_2$ on it. The line is now divided into three intervals: $(-\\infty, r_1)$, $(r_1, r_2)$, $(r_2, +\\infty)$.</li>
<li>Pick any one test point in each interval and plug into $ax^2+bx+c$. The sign of the result is the sign of the polynomial on that entire interval (a polynomial does not change sign except at a root).</li>
<li>Write "+" or "&minus;" under each interval. Read off the solution to your inequality.</li>
</ol>

<div class="calc-example"><div class="example-label">EXAMPLE &mdash; FIRST SIGN CHART</div><div class="example-body">Build the sign chart for $f(x) = x^2 - 5x + 6$.<br><br>Roots: $x^2-5x+6=(x-2)(x-3)=0$, so $r_1=2$, $r_2=3$.<br><br>Test points: $x=0$ gives $f(0)=6>0$ (interval $(-\\infty,2)$, sign +). $x=2.5$ gives $f(2.5)=6.25-12.5+6=-0.25<0$ (interval $(2,3)$, sign &minus;). $x=4$ gives $f(4)=16-20+6=2>0$ (interval $(3,\\infty)$, sign +).<br><br>Sign chart: $\\;\\;+\\;\\;|_{2}\\;\\;-\\;\\;|_{3}\\;\\;+$. This matches the rule: $a=1>0$, so outside the roots is positive and between them is negative.</div></div>

<h2 class="lesson-title">4. Worked Example A: x² &minus; 5x + 6 &gt; 0</h2>

<p class="l-text">Using the sign chart from section 3, the question "for which $x$ is $x^2-5x+6$ strictly positive?" asks us to mark the intervals labelled "+". Those are $(-\\infty, 2)$ and $(3, +\\infty)$. Strict inequality means the roots themselves are <em>excluded</em>, so we use round brackets:</p>

<div class="calc-formula"><div class="formula-label">SOLUTION SET</div><div class="formula-main">$$x^2 - 5x + 6 \\;>\\; 0 \\quad\\Longleftrightarrow\\quad x \\in (-\\infty,\\, 2) \\,\\cup\\, (3,\\, +\\infty)$$</div><div class="formula-sub">Equivalently: $x < 2$ or $x > 3$.</div></div>

<div class="calc-graph"><div id="plot-l56-parabola-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the parabola $y = x^2 - 5x + 6$ with the region where $y > 0$ shaded. The shaded green strips on the x-axis indicate the solution set $(-\\infty, 2) \\cup (3, \\infty)$. Notice the parabola dips <em>below</em> the x-axis only on the open interval $(2,3)$ &mdash; exactly where the inequality fails.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined'||!document.getElementById('plot-l56-parabola-en'))return;
var xs=[];for(var i=0;i<=240;i++){xs.push(-1+6*i/240);}
var ys=xs.map(function(x){return x*x-5*x+6;});
var parab={x:xs,y:ys,mode:'lines',name:'y=x²−5x+6',line:{color:'#3b82f6',width:2.8},fill:'tonexty',fillcolor:'rgba(59,130,246,0.1)'};
var zeroBase={x:xs,y:xs.map(function(){return 0;}),mode:'lines',name:'',line:{color:'rgba(255,255,255,0)',width:0},showlegend:false};
var roots={x:[2,3],y:[0,0],mode:'markers+text',name:'roots',marker:{color:'#f59e0b',size:10},text:['r₁=2','r₂=3'],textposition:'bottom center',textfont:{color:'#f59e0b',size:12}};
var posL={x:[-1,2],y:[0.15,0.15],mode:'lines',name:'y>0 region',line:{color:'#10b981',width:6}};
var posR={x:[3,5],y:[0.15,0.15],mode:'lines',name:'',line:{color:'#10b981',width:6},showlegend:false};
var negM={x:[2,3],y:[0.15,0.15],mode:'lines',name:'y<0 region',line:{color:'#ef4444',width:6}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'x',range:[-1,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.3)'},yaxis:{title:'y',range:[-1.5,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.3)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l56-parabola-en',[zeroBase,parab,negM,posL,posR,roots],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Worked Example B: x² &minus; 5x + 6 &le; 0</h2>

<p class="l-text">Now we want where the parabola is at or below the x-axis. From the sign chart, the negative interval is $(2,3)$, and at the roots themselves the value is exactly zero. Since the inequality is <em>non-strict</em> ($\\le$, not $<$), the roots are <em>included</em>:</p>

<div class="calc-formula"><div class="formula-label">SOLUTION SET</div><div class="formula-main">$$x^2 - 5x + 6 \\;\\le\\; 0 \\quad\\Longleftrightarrow\\quad x \\in [2,\\, 3]$$</div><div class="formula-sub">A single closed interval. Both endpoints are part of the answer.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">STRICT (&lt;, &gt;)</div><div class="compare-item">Roots are <strong>excluded</strong></div><div class="compare-item">Use round brackets: $(r_1, r_2)$</div><div class="compare-item">Open dots on the number-line picture</div><div class="compare-item">Example: $x^2-5x+6<0 \\Rightarrow x \\in (2,3)$</div></div><div class="compare-col"><div class="compare-title">NON-STRICT (&le;, &ge;)</div><div class="compare-item">Roots are <strong>included</strong></div><div class="compare-item">Use square brackets: $[r_1, r_2]$</div><div class="compare-item">Filled dots on the number-line picture</div><div class="compare-item">Example: $x^2-5x+6 \\le 0 \\Rightarrow x \\in [2,3]$</div></div></div>

<h2 class="lesson-title">6. The Three Discriminant Cases in Detail</h2>

<div class="calc-highlight"><strong>The discriminant determines whether you have two intervals, one interval, or a degenerate case.</strong> Master the three cases below and any quadratic inequality reduces to a quick checklist.</div>

<p class="l-text"><strong>Case 1: $\\Delta > 0$ &mdash; two real roots.</strong> Parabola crosses the x-axis twice at $r_1 < r_2$. The number line is split into three intervals with alternating signs.</p>

<div class="calc-formula"><div class="formula-label">CASE Δ &gt; 0 SUMMARY (assume $a>0$)</div><div class="formula-main">$$ax^2+bx+c > 0 \\Leftrightarrow x<r_1 \\text{ or } x>r_2$$ $$ax^2+bx+c < 0 \\Leftrightarrow r_1<x<r_2$$</div><div class="formula-sub">If $a<0$, flip the conclusions (positive becomes the inside interval, negative becomes the outside two).</div></div>

<p class="l-text"><strong>Case 2: $\\Delta = 0$ &mdash; one double root.</strong> The parabola just touches the x-axis at $r = -b/(2a)$ but never crosses. The polynomial is therefore $\\ge 0$ everywhere (if $a>0$) or $\\le 0$ everywhere (if $a<0$), with equality only at $x=r$.</p>

<div class="calc-example"><div class="example-label">EXAMPLE &mdash; Δ = 0 CASE</div><div class="example-body">Solve $x^2 - 4x + 4 \\;\\ge\\; 0$.<br><br>$\\Delta = 16 - 16 = 0$, double root at $x=2$. Since $a=1>0$, the parabola opens up and touches the x-axis at $x=2$. Therefore $x^2-4x+4 = (x-2)^2 \\ge 0$ for <strong>every</strong> real $x$ &mdash; the solution set is $\\mathbb{R} = (-\\infty,+\\infty)$.<br><br>What about $x^2-4x+4 > 0$ (strict)? Same picture, but now $x=2$ is excluded: the answer is $\\mathbb{R} \\setminus \\{2\\} = (-\\infty,2) \\cup (2,+\\infty)$.<br><br>And $x^2-4x+4 \\le 0$? Only at $x=2$ does the value equal zero; nowhere is it negative. Answer: $\\{2\\}$ &mdash; a single point.<br><br>Finally, $x^2-4x+4 < 0$? The polynomial is never strictly negative. Answer: $\\varnothing$ (empty set).</div></div>

<p class="l-text"><strong>Case 3: $\\Delta < 0$ &mdash; no real roots.</strong> The parabola misses the x-axis entirely. If $a>0$ it sits entirely above; if $a<0$ entirely below. The sign of the polynomial is constant on all of $\\mathbb{R}$.</p>

<div class="calc-example"><div class="example-label">EXAMPLE &mdash; Δ &lt; 0 CASE</div><div class="example-body">Solve $x^2 - 2x + 3 \\;>\\; 0$.<br><br>$\\Delta = 4 - 12 = -8 < 0$. With $a=1>0$, the parabola has no real roots and opens upward, so it lies entirely above the x-axis. Thus $x^2-2x+3 > 0$ for <strong>every</strong> real $x$. Solution: $\\mathbb{R}$.<br><br>Sanity check by completing the square: $x^2-2x+3 = (x-1)^2 + 2 \\ge 2 > 0$. Confirmed.</div></div>

<div class="calc-formula"><div class="formula-label">QUICK REFERENCE TABLE</div><div class="formula-main">$$\\begin{array}{c|c|c} \\Delta & a > 0 & a < 0 \\\\ \\hline >0 & +,\\,-,\\,+ & -,\\,+,\\,- \\\\ =0 & \\ge 0 \\text{ everywhere, } = 0 \\text{ at } r & \\le 0 \\text{ everywhere, } = 0 \\text{ at } r \\\\ <0 & > 0 \\text{ everywhere} & < 0 \\text{ everywhere} \\end{array}$$</div><div class="formula-sub">For Δ&gt;0 the three entries are the signs in the intervals $(-\\infty,r_1)$, $(r_1,r_2)$, $(r_2,\\infty)$ from left to right.</div></div>

<h2 class="lesson-title">7. Negative Leading Coefficient</h2>

<div class="calc-highlight"><strong>If $a < 0$, the parabola opens downward and the sign pattern of "outside vs. between" flips.</strong> Many students get this wrong; the easiest fix is to multiply both sides by $-1$ <em>first</em> &mdash; remembering to flip the inequality sign &mdash; so the leading coefficient becomes positive.</div>

<div class="calc-example"><div class="example-label">EXAMPLE &mdash; NEGATIVE a</div><div class="example-body">Solve $-x^2 + 4x - 3 \\;\\ge\\; 0$.<br><br><strong>Method 1 (flip first):</strong> multiply both sides by $-1$, flip the inequality: $x^2 - 4x + 3 \\;\\le\\; 0$. Factor: $(x-1)(x-3) \\le 0$. Roots $1,3$. With $a=1>0$ the polynomial is negative between the roots, so the solution is $[1,3]$.<br><br><strong>Method 2 (direct):</strong> $-x^2+4x-3 = -(x-1)(x-3)$. Roots still $1,3$. With $a=-1<0$ the parabola opens downward, so the polynomial is positive <em>between</em> the roots and negative outside. We want non-negative, so the answer is $[1,3]$. Same result.</div></div>

<h2 class="lesson-title">8. Higher-Degree Polynomial Inequalities</h2>

<div class="calc-highlight"><strong>The sign-chart technique extends directly to any factored polynomial.</strong> List the roots, draw a number line, mark them, then determine the sign in each interval by a test point or by tracking how each factor changes sign across each root.</div>

<p class="l-text">A polynomial $p(x) = (x-r_1)(x-r_2)\\cdots(x-r_n)$ with distinct real roots changes sign at every root (each factor flips from negative to positive as $x$ crosses its own root). So the sign pattern alternates $\\pm\\,\\pm\\,\\pm\\cdots$ across the intervals. At a <em>repeated</em> root (factor like $(x-r)^2$), the polynomial touches zero but does <em>not</em> change sign.</p>

<div class="calc-example"><div class="example-label">EXAMPLE &mdash; CUBIC INEQUALITY</div><div class="example-body">Solve $(x-1)(x+2)(x-3) \\;>\\; 0$.<br><br>Roots are $-2$, $1$, $3$ (already in order). The cubic has leading coefficient $+1$ (when expanded), so for $x \\to +\\infty$ the polynomial goes to $+\\infty$ &mdash; sign in the rightmost interval $(3, \\infty)$ is positive. Signs alternate as we cross each root:<br><br>$(-\\infty, -2)$: &minus;,&nbsp; $(-2, 1)$: +,&nbsp; $(1, 3)$: &minus;,&nbsp; $(3, +\\infty)$: +.<br><br>We want strictly positive, so the solution is $(-2, 1) \\cup (3, +\\infty)$.<br><br>Quick check at $x=0$: $(0-1)(0+2)(0-3) = (-1)(2)(-3) = 6 > 0$. Yes, $x=0 \\in (-2,1)$ where the sign is "+". Consistent.</div></div>

<div class="calc-graph"><div id="plot-l56-cubic-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the cubic $y=(x-1)(x+2)(x-3)$ with its sign-chart annotation. The roots at $x=-2, 1, 3$ split the real line into four intervals. The shaded green strips on the x-axis show where the cubic is strictly positive &mdash; the solution to $y > 0$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined'||!document.getElementById('plot-l56-cubic-en'))return;
var xs=[];for(var i=0;i<=300;i++){xs.push(-3.5+7*i/300);}
var ys=xs.map(function(x){return (x-1)*(x+2)*(x-3);});
var cur={x:xs,y:ys,mode:'lines',name:'y=(x−1)(x+2)(x−3)',line:{color:'#3b82f6',width:2.8}};
var axisLine={x:[-3.5,3.5],y:[0,0],mode:'lines',name:'',line:{color:'rgba(255,255,255,0.35)',width:1},showlegend:false};
var roots={x:[-2,1,3],y:[0,0,0],mode:'markers+text',name:'roots',marker:{color:'#f59e0b',size:10},text:['x=−2','x=1','x=3'],textposition:'top center',textfont:{color:'#f59e0b',size:11}};
var pos1={x:[-2,1],y:[-0.8,-0.8],mode:'lines',name:'y>0',line:{color:'#10b981',width:6}};
var pos2={x:[3,3.5],y:[-0.8,-0.8],mode:'lines',name:'',line:{color:'#10b981',width:6},showlegend:false};
var neg1={x:[-3.5,-2],y:[-0.8,-0.8],mode:'lines',name:'y<0',line:{color:'#ef4444',width:6}};
var neg2={x:[1,3],y:[-0.8,-0.8],mode:'lines',name:'',line:{color:'#ef4444',width:6},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'x',range:[-3.5,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.3)'},yaxis:{title:'y',range:[-8,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.3)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l56-cubic-en',[axisLine,cur,neg1,pos1,neg2,pos2,roots],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Word Problems</h2>

<div class="calc-highlight"><strong>Real-world quadratic inequalities almost always come from projectile motion or area / dimension constraints.</strong> The skill is to translate the question into "for which $t$ (or $x$) does this quadratic exceed (or stay below) some threshold?" and then apply the sign-chart technique.</div>

<div class="calc-example"><div class="example-label">PROBLEM A &mdash; PROJECTILE HEIGHT</div><div class="example-body">A ball is thrown straight up from ground level. Its height above the ground, in metres, after $t$ seconds is $h(t) = -5t^2 + 25t$. For which time interval is the ball <strong>higher than 30 metres</strong>?<br><br>We need $h(t) > 30$: $-5t^2 + 25t > 30 \\;\\Rightarrow\\; -5t^2 + 25t - 30 > 0 \\;\\Rightarrow\\; t^2 - 5t + 6 < 0$ (multiplied by $-\\tfrac{1}{5}$, flipped). Factor: $(t-2)(t-3) < 0$, so $2 < t < 3$.<br><br>Interpretation: the ball is above 30 m only between the 2nd and 3rd second after release. It rises through 30 m at $t=2\\,\\text{s}$, reaches its peak (at $t=2.5\\,\\text{s}$, height $31.25$ m), then falls back through 30 m at $t=3\\,\\text{s}$. Time aloft above 30 m: 1 second.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM B &mdash; AREA CONSTRAINT</div><div class="example-body">A rectangular flower bed has length $(x+3)$ metres and width $(x-1)$ metres, where $x$ is a positive parameter. For which values of $x$ is the area <strong>at most 12 square metres</strong>?<br><br>Area $= (x+3)(x-1) = x^2 + 2x - 3$. We need $x^2 + 2x - 3 \\le 12$, i.e. $x^2 + 2x - 15 \\le 0$.<br><br>Solve $x^2 + 2x - 15 = 0$: $\\Delta = 4 + 60 = 64$, $x = \\dfrac{-2 \\pm 8}{2}$, giving $x = 3$ or $x = -5$. Sign chart: $a=1>0$, so the polynomial is non-positive on $[-5, 3]$.<br><br>But the geometric constraint requires $x > 1$ (so the width is positive). Intersecting $[-5, 3]$ with $(1, +\\infty)$ gives $(1, 3]$.<br><br>Answer: $1 < x \\le 3$ metres. At $x=3$ the bed measures $6\\,\\text{m} \\times 2\\,\\text{m} = 12\\,\\text{m}^2$ exactly.</div></div>

<div class="l-note"><strong>Common modelling pitfall:</strong> when the unknown is a physical length, time, or count, always intersect the algebraic solution with the natural domain ($x > 0$, $t \\ge 0$, etc.). The algebra alone does not know that a negative length is meaningless.</div>

<h2 class="lesson-title">10. Common Errors and How to Avoid Them</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dividing by a variable expression</div><div class="card-body">Never divide both sides of an inequality by $x$ or $(x-k)$ without knowing its sign &mdash; you might be dividing by a negative number, which silently flips the inequality. Multiply across by the squared expression instead, or move everything to one side and use a sign chart.</div></div>
<div class="calc-card"><div class="card-title">Forgetting to flip when multiplying by a negative</div><div class="card-body">Multiplying or dividing both sides by $-1$ <strong>reverses</strong> the inequality: $-x > -3$ becomes $x < 3$, not $x > 3$. Habitually circle the inequality sign before doing the multiplication.</div></div>
<div class="calc-card"><div class="card-title">Confusing strict and non-strict</div><div class="card-body">A $<$ excludes the roots, a $\\le$ includes them. Use parentheses for "excluded" and square brackets for "included" &mdash; matching dots on the number line (open vs filled).</div></div>
<div class="calc-card"><div class="card-title">Writing the empty set as 0</div><div class="card-body">If a quadratic is never negative ($\\Delta<0$ and $a>0$), the solution of $ax^2+bx+c<0$ is the <strong>empty set</strong> $\\varnothing$, not "0" and not "no solution". Use the right symbol.</div></div>
<div class="calc-card"><div class="card-title">Ignoring the leading coefficient's sign</div><div class="card-body">For $-x^2 + 2x + 8 > 0$ the parabola opens <em>downward</em>, so the polynomial is positive <em>between</em> its roots, not outside. Sketch a quick U or upside-down U before writing the answer.</div></div>
<div class="calc-card"><div class="card-title">Wrong direction at infinity</div><div class="card-body">For high-degree polynomials, check the leading-term sign to know what happens as $x\\to\\pm\\infty$. The sign in the outermost intervals follows from this, and the rest alternate (with appropriate behaviour at repeated roots).</div></div>
</div>

<h2 class="lesson-title">11. Practice Problems</h2>

<p class="l-text">Work through each problem first, then check the solution. The set covers the full range: positive leading coefficient, negative leading coefficient, $\\Delta>0$, $\\Delta=0$, $\\Delta<0$, strict, non-strict, and one word problem.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 1 &mdash; Standard monic quadratic</div><div class="card-body"><strong>Solve $x^2 - x - 6 \\le 0$.</strong><br><br>Factor: $(x-3)(x+2) \\le 0$, roots $-2, 3$. With $a=1>0$, the polynomial is negative between the roots. Non-strict, so include roots. <strong>Answer:</strong> $x \\in [-2, 3]$.</div></div>

<div class="calc-card"><div class="card-title">Problem 2 &mdash; Strict positive</div><div class="card-body"><strong>Solve $2x^2 + 5x - 3 > 0$.</strong><br><br>Roots from quadratic formula: $\\Delta = 25 + 24 = 49$, $x = \\dfrac{-5 \\pm 7}{4}$, giving $x = -3$ or $x = \\tfrac{1}{2}$. With $a=2>0$, positive outside the roots. Strict, so exclude. <strong>Answer:</strong> $x \\in (-\\infty, -3) \\cup (\\tfrac{1}{2}, +\\infty)$.</div></div>

<div class="calc-card"><div class="card-title">Problem 3 &mdash; Negative leading coefficient</div><div class="card-body"><strong>Solve $-x^2 + 6x - 8 \\ge 0$.</strong><br><br>Multiply by $-1$ and flip: $x^2 - 6x + 8 \\le 0$. Factor: $(x-2)(x-4) \\le 0$, roots $2, 4$. Solution between the roots, inclusive. <strong>Answer:</strong> $x \\in [2, 4]$.</div></div>

<div class="calc-card"><div class="card-title">Problem 4 &mdash; Δ = 0 case</div><div class="card-body"><strong>Solve $x^2 - 6x + 9 \\ge 0$.</strong><br><br>$\\Delta = 36 - 36 = 0$, double root at $x = 3$. The expression equals $(x-3)^2$, which is always $\\ge 0$. <strong>Answer:</strong> $\\mathbb{R} = (-\\infty, +\\infty)$.<br><br>Bonus: solve $x^2 - 6x + 9 < 0$ &rarr; never negative &rarr; <strong>empty set $\\varnothing$</strong>.</div></div>

<div class="calc-card"><div class="card-title">Problem 5 &mdash; Δ &lt; 0 case</div><div class="card-body"><strong>Solve $x^2 + x + 1 < 0$.</strong><br><br>$\\Delta = 1 - 4 = -3 < 0$, no real roots. With $a=1>0$, parabola opens up and stays entirely above the x-axis, so the expression is always strictly positive. <strong>Answer:</strong> $\\varnothing$ (empty set).</div></div>

<div class="calc-card"><div class="card-title">Problem 6 &mdash; Δ &lt; 0, the other direction</div><div class="card-body"><strong>Solve $-x^2 - 2x - 5 \\le 0$.</strong><br><br>$\\Delta = 4 - 20 = -16 < 0$. With $a=-1<0$, parabola opens down and lies entirely below the x-axis. So $-x^2-2x-5 < 0$ for all real $x$, hence certainly $\\le 0$ for all $x$. <strong>Answer:</strong> $\\mathbb{R}$.</div></div>

<div class="calc-card"><div class="card-title">Problem 7 &mdash; Cubic via sign chart</div><div class="card-body"><strong>Solve $(x+1)(x-2)(x-5) \\ge 0$.</strong><br><br>Roots $-1, 2, 5$. Leading coefficient $+1$, so the sign in $(5,\\infty)$ is $+$ and signs alternate going left: $(-\\infty,-1)$ is $-$, $(-1,2)$ is $+$, $(2,5)$ is $-$, $(5,\\infty)$ is $+$. Non-strict, so include the roots. <strong>Answer:</strong> $[-1, 2] \\cup [5, +\\infty)$.</div></div>

<div class="calc-card"><div class="card-title">Problem 8 &mdash; Word problem (projectile)</div><div class="card-body"><strong>A rocket has height $h(t) = -4t^2 + 32t$ metres at time $t$ seconds. For which $t$ is the rocket at or above 60 m?</strong><br><br>$-4t^2 + 32t \\ge 60 \\Rightarrow t^2 - 8t + 15 \\le 0$ (divide by $-4$, flip). Factor: $(t-3)(t-5) \\le 0$, so $t \\in [3, 5]$. Both endpoints are physically valid (positive times). <strong>Answer:</strong> the rocket is at or above 60 m for $3 \\le t \\le 5$ seconds &mdash; a 2-second window centred on the peak at $t=4$.</div></div>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Move every quadratic inequality to standard form $ax^2+bx+c \\;\\square\\; 0$ with one side equal to zero</li>
<li>The shape of the parabola is fixed by (i) the sign of $a$ and (ii) the sign of $\\Delta = b^2-4ac$</li>
<li>Sign rule: same sign as $a$ outside the roots, opposite sign between the roots ($\\Delta>0$ case)</li>
<li>$\\Delta=0$: polynomial is $\\ge 0$ (or $\\le 0$) everywhere, with equality only at the double root</li>
<li>$\\Delta<0$: no real roots; the polynomial keeps a constant sign on all of $\\mathbb{R}$</li>
<li>Strict ($<,>$) excludes the roots, non-strict ($\\le,\\ge$) includes them</li>
<li>The sign-chart method extends to factored polynomials of any degree</li>
<li>For modelling problems, always intersect the algebraic solution with the physical domain</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Karesel bir eşitsizlik, eşittir işareti yerine eşitsizlik sembolü konmuş bir karesel denklemden başka bir şey değildir.</strong> "Hangi $x$ için $ax^2+bx+c$ sıfıra eşittir?" sorusu yerine artık "hangi $x$ için $ax^2+bx+c$ <em>pozitiftir</em> (ya da negatiftir, ya da pozitif değildir, ya da negatif değildir)?" sorusunu soruyoruz. Karesel ifadenin kökleri yine ana sınır noktalarıdır, ama cevap artık sonlu bir sayı listesi değil &mdash; reel doğru üzerindeki bir aralık birleşimidir.</p>

<p class="l-text">Bu derste cevabı doğrudan parabolden okumayı öğreniyorsun. $y = ax^2+bx+c$ grafiği bir U şeklidir ($a>0$ iken) ya da ters bir U şeklidir ($a<0$ iken). Eğri x-ekseninin <em>üstünde</em> kaldığı her yerde $y$ pozitiftir; altında negatiftir; eksen üzerinde sıfırdır. Yani bir karesel eşitsizliği çözmek tek bir görsel soruya indirgenir: <em>parabol nerede yaşıyor?</em> Bu resimle akıcılaştığında, koca bir problem sınıfı 30 saniyelik bir taslağa dönüşür.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Herhangi bir karesel eşitsizliği $ax^2+bx+c \\;\\square\\; 0$ standart formunda yazmayı ($\\square \\in \\{<, \\le, >, \\ge\\}$)</li>
<li>$\\Delta = b^2-4ac$ diskriminantını ve $a$'nın işaretini kullanarak parabolü nokta plotlamadan çizmeyi</li>
<li>Köklerden işaret tablosu kurmayı ve çözüm kümesini aralıkların birleşimi olarak okumayı</li>
<li>Üç diskriminant durumunu da ele almayı: $\\Delta>0$ (iki kök), $\\Delta=0$ (çift kök), $\\Delta<0$ (reel kök yok)</li>
<li>Sıkı ve sıkı olmayan eşitsizlikler arasında doğru şekilde geçiş yapmayı (açık &harr; kapalı parantez)</li>
<li>İşaret tablosu tekniğini üç ya da daha yüksek dereceli çarpanlanmış polinomlara genişletmeyi</li>
<li>Sözel problemleri (atılan cismin yüksekliği, alan kısıtları) karesel eşitsizliklere çevirip çözmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Karesel Eşitsizliğin Standart Formu</h2>

<div class="calc-highlight"><strong>Eşitsizliği her zaman bir tarafı sıfır olacak şekilde yeniden yaz.</strong> İnceleyeceğin parabol $y = ax^2+bx+c$ olacak ve tek soru bu $y$'nin pozitif mi, negatif mi yoksa sıfır mı olduğu olacak. Her şeyi bir tarafa toplamak resmi temiz tutar.</div>

<p class="l-text">Bir değişkenli bir <strong>karesel eşitsizlik</strong>, aşağıdaki dört standart formdan birine sahiptir. $a$ katsayısı sıfırdan farklıdır (aksi halde karesel olmazdı), ve $a$, $b$, $c$ gerçel sayılardır.</p>

<div class="calc-formula"><div class="formula-label">DÖRT STANDART FORM</div><div class="formula-main">$$ax^2 + bx + c \\;<\\; 0 \\qquad ax^2 + bx + c \\;\\le\\; 0$$ $$ax^2 + bx + c \\;>\\; 0 \\qquad ax^2 + bx + c \\;\\ge\\; 0$$</div><div class="formula-sub">İlk iki form <em>negatif</em> (ya da pozitif olmayan); son iki form <em>pozitif</em> (ya da negatif olmayan) sorularını sorar. $\\le$ ve $\\ge$ ile kökler çözüme <em>dahildir</em>; $<$ ve $>$ ile <em>hariçtir</em>.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; YENİDEN YAZMA</div><div class="example-body">$3x^2 + 5 \\;\\ge\\; 2x^2 + 4x + 9$ eşitsizliğini standart forma getir.<br><br>Her şeyi sol tarafa al: $3x^2 + 5 - 2x^2 - 4x - 9 \\;\\ge\\; 0$, yani $x^2 - 4x - 4 \\;\\ge\\; 0$. Şimdi $a=1$, $b=-4$, $c=-4$ ve resmimiz $y=x^2-4x-4$ paraboünün x-ekseninde ya da üzerinde nerede oturduğunu soruyor.</div></div>

<div class="l-note"><strong>Neden "her şeyi bir tarafa al"?</strong> Çünkü geometrik resim ancak bakacağımız tek bir parabol olduğunda anlamlıdır. İki parabolü aynı anda kıyaslamak, tek bir parabolü düz yatay bir doğruyla (x-ekseni) kıyaslamaktan daha zordur.</div>

<h2 class="lesson-title">2. Parabolün İşaretini Grafiğinden Okumak</h2>

<div class="calc-highlight"><strong>Şekli tam olarak iki bileşen belirler:</strong> baş katsayı $a$'nın işareti (parabol yukarı mı yoksa aşağı mı açılır?) ve $\\Delta = b^2-4ac$ diskriminantının işareti (parabol x-eksenini iki kez mi kesiyor, bir kez mi değiyor, yoksa hiç değmiyor mu?). Bu iki bilgiyi birleştir &mdash; ve böylece eşitsizliği &mdash; saniyeler içinde çözebilirsin.</div>

<p class="l-text">Karesel formül dersinden hatırla: $ax^2+bx+c=0$ denkleminin kökleri $x = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a}$ ile verilir. Diskriminant karekökün altında olduğundan, işareti gerçel köklerin var olup olmadığını belirler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a > 0$</div><div class="card-body">Parabol <strong>yukarı</strong> açılır (U şekli). En düşük nokta tepe noktasıdır; eğri iki tarafta da $+\\infty$'a gider.</div></div>
<div class="calc-card"><div class="card-title">$a < 0$</div><div class="card-body">Parabol <strong>aşağı</strong> açılır (ters U). En yüksek nokta tepe noktasıdır; eğri iki tarafta da $-\\infty$'a gider.</div></div>
<div class="calc-card"><div class="card-title">$\\Delta > 0$</div><div class="card-body">İki ayrı gerçel kök $r_1 < r_2$. Parabol x-eksenini iki noktada keser.</div></div>
<div class="calc-card"><div class="card-title">$\\Delta = 0$</div><div class="card-body">Bir çift kök $r$. Parabol x-eksenine yalnızca tek bir noktada (tepe noktasında) değer.</div></div>
<div class="calc-card"><div class="card-title">$\\Delta < 0$</div><div class="card-body">Gerçel kök yok. $a$'nın işaretine göre parabol tamamen x-ekseninin üzerinde ya da tamamen altındadır.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">İŞARET KURALI (ANA GERÇEK)</div><div class="formula-main">$$\\text{sign of } ax^2+bx+c \\;=\\; \\begin{cases} \\text{same sign as } a, & x \\text{ outside roots} \\\\ \\text{opposite of } a, & x \\text{ between roots} \\end{cases}$$</div><div class="formula-sub">$\\Delta > 0$ olduğunda kökler reel doğruyu üç parçaya böler: köklerin dışı ($a$ ile aynı işaret) ve aralarındaki kısım (ters işaret). $\\Delta \\le 0$ olduğunda "ara" bölgesi yoktur.</div></div>

<div class="calc-graph"><div id="plot-l56-discriminants-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $a=1$ olan ve sabit terimi değişen üç parabol, her diskriminant durumunu örnekliyor. <span style="color:#3b82f6"><strong>Mavi</strong></span>: $y=x^2-5x+6$, iki kök $x=2,3$ ($\\Delta=1>0$). <span style="color:#10b981"><strong>Yeşil</strong></span>: $y=x^2-4x+4$, çift kök $x=2$ ($\\Delta=0$). <span style="color:#ef4444"><strong>Kırmızı</strong></span>: $y=x^2-2x+3$, gerçel kök yok, parabol tamamen x-ekseninin üzerinde ($\\Delta=-8<0$).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined'||!document.getElementById('plot-l56-discriminants-tr'))return;
var xs=[];for(var i=0;i<=200;i++){xs.push(-2+7*i/200);}
var y1=xs.map(function(x){return x*x-5*x+6;});
var y2=xs.map(function(x){return x*x-4*x+4;});
var y3=xs.map(function(x){return x*x-2*x+3;});
var t1={x:xs,y:y1,mode:'lines',name:'y=x²−5x+6 (Δ>0)',line:{color:'#3b82f6',width:2.8}};
var t2={x:xs,y:y2,mode:'lines',name:'y=x²−4x+4 (Δ=0)',line:{color:'#10b981',width:2.8}};
var t3={x:xs,y:y3,mode:'lines',name:'y=x²−2x+3 (Δ<0)',line:{color:'#ef4444',width:2.8}};
var roots1={x:[2,3],y:[0,0],mode:'markers',name:'Δ>0 kökler',marker:{color:'#3b82f6',size:9,symbol:'circle'}};
var root2={x:[2],y:[0],mode:'markers',name:'Δ=0 çift kök',marker:{color:'#10b981',size:11,symbol:'diamond'}};
var axisLine={x:[-2,5],y:[0,0],mode:'lines',name:'',line:{color:'rgba(255,255,255,0.35)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'x',range:[-1.5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-3,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l56-discriminants-tr',[axisLine,t1,t2,t3,roots1,root2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. İşaret Tablosu: Bir Defter Tutma Aracı</h2>

<div class="calc-highlight"><strong>İşaret tablosu, her kökü yatay bir eksen üzerine sıralar, sonra kökleri yarattığı her aralığa "+" ya da "&minus;" yazar.</strong> Parabolün ne yaptığını kaydetmenin en temiz yoludur, özellikle de cevabı daha sonra başka bir eşitsizlikle birleştirmen gerektiğinde.</div>

<p class="l-text">İki gerçel kökü $r_1 < r_2$ olan bir karesel için yöntem:</p>

<ol class="l-text" style="margin:0.6rem 0 1rem 1.2rem;line-height:1.7">
<li>$ax^2+bx+c=0$ denklemini çöz ve $r_1$ ile $r_2$'yi bul.</li>
<li>Bir sayı doğrusu çiz ve $r_1$ ile $r_2$'yi işaretle. Doğru artık üç aralığa ayrılmış: $(-\\infty, r_1)$, $(r_1, r_2)$, $(r_2, +\\infty)$.</li>
<li>Her aralıktan bir test noktası seç ve $ax^2+bx+c$'ye yerleştir. Sonucun işareti, polinomun o aralık üzerindeki işaretidir (bir polinom kök dışında işaret değiştirmez).</li>
<li>Her aralığın altına "+" ya da "&minus;" yaz. Eşitsizliğinin çözümünü oradan oku.</li>
</ol>

<div class="calc-example"><div class="example-label">ÖRNEK &mdash; İLK İŞARET TABLOSU</div><div class="example-body">$f(x) = x^2 - 5x + 6$ için işaret tablosunu kur.<br><br>Kökler: $x^2-5x+6=(x-2)(x-3)=0$, yani $r_1=2$, $r_2=3$.<br><br>Test noktaları: $x=0$ verir $f(0)=6>0$ (aralık $(-\\infty,2)$, işaret +). $x=2.5$ verir $f(2.5)=6.25-12.5+6=-0.25<0$ (aralık $(2,3)$, işaret &minus;). $x=4$ verir $f(4)=16-20+6=2>0$ (aralık $(3,\\infty)$, işaret +).<br><br>İşaret tablosu: $\\;\\;+\\;\\;|_{2}\\;\\;-\\;\\;|_{3}\\;\\;+$. Bu kurala uyuyor: $a=1>0$, dolayısıyla köklerin dışı pozitif, arası negatif.</div></div>

<h2 class="lesson-title">4. Çözümlü Örnek A: x² &minus; 5x + 6 &gt; 0</h2>

<p class="l-text">3. bölümdeki işaret tablosunu kullanarak "$x^2-5x+6$ hangi $x$ için kesin pozitiftir?" sorusu, "+" etiketli aralıkları işaretlememizi ister. Bunlar $(-\\infty, 2)$ ve $(3, +\\infty)$. Sıkı eşitsizlik kökleri <em>hariç</em> tuttuğu için yuvarlak parantez kullanırız:</p>

<div class="calc-formula"><div class="formula-label">ÇÖZÜM KÜMESİ</div><div class="formula-main">$$x^2 - 5x + 6 \\;>\\; 0 \\quad\\Longleftrightarrow\\quad x \\in (-\\infty,\\, 2) \\,\\cup\\, (3,\\, +\\infty)$$</div><div class="formula-sub">Eşdeğer biçimde: $x < 2$ ya da $x > 3$.</div></div>

<div class="calc-graph"><div id="plot-l56-parabola-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = x^2 - 5x + 6$ parabolü, $y > 0$ olan bölge taranmış. X-ekseni üzerindeki yeşil şeritler $(-\\infty, 2) \\cup (3, \\infty)$ çözüm kümesini gösterir. Parabolün x-ekseninin <em>altına</em> yalnızca açık $(2,3)$ aralığında inişine dikkat et &mdash; eşitsizliğin başarısız olduğu tek yer.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined'||!document.getElementById('plot-l56-parabola-tr'))return;
var xs=[];for(var i=0;i<=240;i++){xs.push(-1+6*i/240);}
var ys=xs.map(function(x){return x*x-5*x+6;});
var parab={x:xs,y:ys,mode:'lines',name:'y=x²−5x+6',line:{color:'#3b82f6',width:2.8},fill:'tonexty',fillcolor:'rgba(59,130,246,0.1)'};
var zeroBase={x:xs,y:xs.map(function(){return 0;}),mode:'lines',name:'',line:{color:'rgba(255,255,255,0)',width:0},showlegend:false};
var roots={x:[2,3],y:[0,0],mode:'markers+text',name:'kökler',marker:{color:'#f59e0b',size:10},text:['r₁=2','r₂=3'],textposition:'bottom center',textfont:{color:'#f59e0b',size:12}};
var posL={x:[-1,2],y:[0.15,0.15],mode:'lines',name:'y>0 bölgesi',line:{color:'#10b981',width:6}};
var posR={x:[3,5],y:[0.15,0.15],mode:'lines',name:'',line:{color:'#10b981',width:6},showlegend:false};
var negM={x:[2,3],y:[0.15,0.15],mode:'lines',name:'y<0 bölgesi',line:{color:'#ef4444',width:6}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'x',range:[-1,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.3)'},yaxis:{title:'y',range:[-1.5,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.3)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l56-parabola-tr',[zeroBase,parab,negM,posL,posR,roots],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Çözümlü Örnek B: x² &minus; 5x + 6 &le; 0</h2>

<p class="l-text">Şimdi parabolün x-ekseninde ya da altında olduğu yeri istiyoruz. İşaret tablosundan negatif aralık $(2,3)$ ve köklerin kendisinde değer tam olarak sıfır. Eşitsizlik <em>sıkı olmadığı</em> için ($\\le$, $<$ değil) kökler de <em>dahildir</em>:</p>

<div class="calc-formula"><div class="formula-label">ÇÖZÜM KÜMESİ</div><div class="formula-main">$$x^2 - 5x + 6 \\;\\le\\; 0 \\quad\\Longleftrightarrow\\quad x \\in [2,\\, 3]$$</div><div class="formula-sub">Tek bir kapalı aralık. Her iki uç da cevabın parçası.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SIKI (&lt;, &gt;)</div><div class="compare-item">Kökler <strong>hariçtir</strong></div><div class="compare-item">Yuvarlak parantez kullan: $(r_1, r_2)$</div><div class="compare-item">Sayı doğrusunda boş daire</div><div class="compare-item">Örnek: $x^2-5x+6<0 \\Rightarrow x \\in (2,3)$</div></div><div class="compare-col"><div class="compare-title">SIKI OLMAYAN (&le;, &ge;)</div><div class="compare-item">Kökler <strong>dahildir</strong></div><div class="compare-item">Köşeli parantez kullan: $[r_1, r_2]$</div><div class="compare-item">Sayı doğrusunda dolu daire</div><div class="compare-item">Örnek: $x^2-5x+6 \\le 0 \\Rightarrow x \\in [2,3]$</div></div></div>

<h2 class="lesson-title">6. Üç Diskriminant Durumu Ayrıntılı</h2>

<div class="calc-highlight"><strong>Diskriminant, iki aralık, bir aralık ya da yozlaşmış bir duruma sahip olup olmadığını belirler.</strong> Aşağıdaki üç duruma hakim ol, sonra herhangi bir karesel eşitsizlik hızlı bir kontrol listesine indirgenir.</div>

<p class="l-text"><strong>Durum 1: $\\Delta > 0$ &mdash; iki gerçel kök.</strong> Parabol x-eksenini $r_1 < r_2$ noktalarında iki kez keser. Sayı doğrusu, işaretleri sırayla değişen üç aralığa bölünür.</p>

<div class="calc-formula"><div class="formula-label">Δ &gt; 0 DURUMU ÖZETİ ($a>0$ varsayımıyla)</div><div class="formula-main">$$ax^2+bx+c > 0 \\Leftrightarrow x<r_1 \\text{ veya } x>r_2$$ $$ax^2+bx+c < 0 \\Leftrightarrow r_1<x<r_2$$</div><div class="formula-sub">$a<0$ ise sonuçları ters çevir (pozitif iç aralık olur, negatif dış iki aralık olur).</div></div>

<p class="l-text"><strong>Durum 2: $\\Delta = 0$ &mdash; bir çift kök.</strong> Parabol $r = -b/(2a)$ noktasında x-eksenine sadece değer ama hiç kesmez. Dolayısıyla polinom her yerde $\\ge 0$ ($a>0$ ise) ya da $\\le 0$ ($a<0$ ise) olur, eşitlik yalnızca $x=r$'de.</p>

<div class="calc-example"><div class="example-label">ÖRNEK &mdash; Δ = 0 DURUMU</div><div class="example-body">$x^2 - 4x + 4 \\;\\ge\\; 0$ eşitsizliğini çöz.<br><br>$\\Delta = 16 - 16 = 0$, çift kök $x=2$. $a=1>0$ olduğundan parabol yukarı açılır ve $x=2$'de x-eksenine değer. Dolayısıyla $x^2-4x+4 = (x-2)^2 \\ge 0$ <strong>her</strong> gerçel $x$ için &mdash; çözüm kümesi $\\mathbb{R} = (-\\infty,+\\infty)$.<br><br>Peki $x^2-4x+4 > 0$ (sıkı)? Aynı resim, ama bu kez $x=2$ hariç: cevap $\\mathbb{R} \\setminus \\{2\\} = (-\\infty,2) \\cup (2,+\\infty)$.<br><br>Ve $x^2-4x+4 \\le 0$? Yalnızca $x=2$'de değer sıfır; hiçbir yerde negatif olmuyor. Cevap: $\\{2\\}$ &mdash; tek bir nokta.<br><br>Son olarak, $x^2-4x+4 < 0$? Polinom hiçbir yerde kesin negatif değil. Cevap: $\\varnothing$ (boş küme).</div></div>

<p class="l-text"><strong>Durum 3: $\\Delta < 0$ &mdash; gerçel kök yok.</strong> Parabol x-eksenine hiç değmez. $a>0$ ise tamamen üstte; $a<0$ ise tamamen altta oturur. Polinomun işareti tüm $\\mathbb{R}$ üzerinde sabittir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK &mdash; Δ &lt; 0 DURUMU</div><div class="example-body">$x^2 - 2x + 3 \\;>\\; 0$ eşitsizliğini çöz.<br><br>$\\Delta = 4 - 12 = -8 < 0$. $a=1>0$ olduğundan parabolün gerçel kökü yok ve yukarı açılır, yani tamamen x-ekseninin üzerinde. Dolayısıyla $x^2-2x+3 > 0$ <strong>her</strong> gerçel $x$ için. Çözüm: $\\mathbb{R}$.<br><br>Tam kareye tamamlayarak doğrulama: $x^2-2x+3 = (x-1)^2 + 2 \\ge 2 > 0$. Onaylandı.</div></div>

<div class="calc-formula"><div class="formula-label">HIZLI REFERANS TABLOSU</div><div class="formula-main">$$\\begin{array}{c|c|c} \\Delta & a > 0 & a < 0 \\\\ \\hline >0 & +,\\,-,\\,+ & -,\\,+,\\,- \\\\ =0 & \\ge 0 \\text{ everywhere, } = 0 \\text{ at } r & \\le 0 \\text{ everywhere, } = 0 \\text{ at } r \\\\ <0 & > 0 \\text{ everywhere} & < 0 \\text{ everywhere} \\end{array}$$</div><div class="formula-sub">$\\Delta>0$ için üç giriş, soldan sağa $(-\\infty,r_1)$, $(r_1,r_2)$, $(r_2,\\infty)$ aralıklarındaki işaretlerdir.</div></div>

<h2 class="lesson-title">7. Negatif Baş Katsayı</h2>

<div class="calc-highlight"><strong>$a < 0$ ise parabol aşağı açılır ve "dış &harr; iç" işaret düzeni ters döner.</strong> Pek çok öğrenci burada hata yapar; en kolay çözüm <em>önce</em> iki tarafı $-1$ ile çarpmak &mdash; eşitsizlik işaretini ters çevirmeyi unutma &mdash; böylece baş katsayı pozitif olur.</div>

<div class="calc-example"><div class="example-label">ÖRNEK &mdash; NEGATİF a</div><div class="example-body">$-x^2 + 4x - 3 \\;\\ge\\; 0$ eşitsizliğini çöz.<br><br><strong>Yöntem 1 (önce ters çevir):</strong> iki tarafı $-1$ ile çarp, eşitsizliği ters çevir: $x^2 - 4x + 3 \\;\\le\\; 0$. Çarpanlara ayır: $(x-1)(x-3) \\le 0$. Kökler $1,3$. $a=1>0$ ile polinom kökler arasında negatif, yani çözüm $[1,3]$.<br><br><strong>Yöntem 2 (doğrudan):</strong> $-x^2+4x-3 = -(x-1)(x-3)$. Kökler yine $1,3$. $a=-1<0$ ile parabol aşağı açılır, yani polinom kökler <em>arasında</em> pozitif, dışında negatif. Negatif olmayan istiyoruz, dolayısıyla cevap $[1,3]$. Aynı sonuç.</div></div>

<h2 class="lesson-title">8. Daha Yüksek Dereceli Polinom Eşitsizlikleri</h2>

<div class="calc-highlight"><strong>İşaret tablosu tekniği herhangi bir çarpanlanmış polinoma doğrudan genişler.</strong> Kökleri sırala, sayı doğrusu çiz, işaretle ve her aralığın işaretini bir test noktasıyla ya da her çarpanın her kökten geçerken işaret değiştirmesini izleyerek belirle.</div>

<p class="l-text">Farklı gerçel kökleri olan bir polinom $p(x) = (x-r_1)(x-r_2)\\cdots(x-r_n)$ her kökte işaret değiştirir (her çarpan, $x$ kendi kökünü geçerken negatiften pozitife döner). Yani işaret deseni aralıklar arasında $\\pm\\,\\pm\\,\\pm\\cdots$ şeklinde değişir. <em>Tekrarlı</em> bir kökte (örneğin $(x-r)^2$ gibi çarpan), polinom sıfıra değer ama işaret <em>değiştirmez</em>.</p>

<div class="calc-example"><div class="example-label">ÖRNEK &mdash; KÜBİK EŞİTSİZLİK</div><div class="example-body">$(x-1)(x+2)(x-3) \\;>\\; 0$ eşitsizliğini çöz.<br><br>Kökler $-2$, $1$, $3$ (sıralanmış). Kübik açıldığında baş katsayı $+1$, dolayısıyla $x \\to +\\infty$ için polinom $+\\infty$'a gider &mdash; en sağdaki aralık $(3, \\infty)$ pozitif. İşaretler her kökü geçerken değişir:<br><br>$(-\\infty, -2)$: &minus;,&nbsp; $(-2, 1)$: +,&nbsp; $(1, 3)$: &minus;,&nbsp; $(3, +\\infty)$: +.<br><br>Sıkı pozitif istiyoruz, dolayısıyla çözüm $(-2, 1) \\cup (3, +\\infty)$.<br><br>$x=0$'da hızlı doğrulama: $(0-1)(0+2)(0-3) = (-1)(2)(-3) = 6 > 0$. Evet, $x=0 \\in (-2,1)$ ve işaret "+". Tutarlı.</div></div>

<div class="calc-graph"><div id="plot-l56-cubic-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y=(x-1)(x+2)(x-3)$ kübik fonksiyonu, işaret tablosu açıklamasıyla. $x=-2, 1, 3$ kökleri reel doğruyu dört aralığa böler. X-ekseni üzerindeki yeşil şeritler kübiğin kesin pozitif olduğu yerleri gösterir &mdash; $y > 0$ eşitsizliğinin çözümü.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined'||!document.getElementById('plot-l56-cubic-tr'))return;
var xs=[];for(var i=0;i<=300;i++){xs.push(-3.5+7*i/300);}
var ys=xs.map(function(x){return (x-1)*(x+2)*(x-3);});
var cur={x:xs,y:ys,mode:'lines',name:'y=(x−1)(x+2)(x−3)',line:{color:'#3b82f6',width:2.8}};
var axisLine={x:[-3.5,3.5],y:[0,0],mode:'lines',name:'',line:{color:'rgba(255,255,255,0.35)',width:1},showlegend:false};
var roots={x:[-2,1,3],y:[0,0,0],mode:'markers+text',name:'kökler',marker:{color:'#f59e0b',size:10},text:['x=−2','x=1','x=3'],textposition:'top center',textfont:{color:'#f59e0b',size:11}};
var pos1={x:[-2,1],y:[-0.8,-0.8],mode:'lines',name:'y>0',line:{color:'#10b981',width:6}};
var pos2={x:[3,3.5],y:[-0.8,-0.8],mode:'lines',name:'',line:{color:'#10b981',width:6},showlegend:false};
var neg1={x:[-3.5,-2],y:[-0.8,-0.8],mode:'lines',name:'y<0',line:{color:'#ef4444',width:6}};
var neg2={x:[1,3],y:[-0.8,-0.8],mode:'lines',name:'',line:{color:'#ef4444',width:6},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'x',range:[-3.5,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.3)'},yaxis:{title:'y',range:[-8,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.3)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l56-cubic-tr',[axisLine,cur,neg1,pos1,neg2,pos2,roots],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Sözel Problemler</h2>

<div class="calc-highlight"><strong>Gerçek hayattaki karesel eşitsizlikler neredeyse her zaman atılan cisim hareketinden ya da alan / boyut kısıtlarından gelir.</strong> Beceri, soruyu "hangi $t$ (ya da $x$) için bu karesel ifade bir eşiği aşar (ya da altında kalır)?" şeklinde ifade edip sonra işaret tablosu tekniğini uygulamaktır.</div>

<div class="calc-example"><div class="example-label">PROBLEM A &mdash; ATILAN CİSİM YÜKSEKLİĞİ</div><div class="example-body">Bir top, yer seviyesinden dik yukarı atılıyor. $t$ saniye sonra yerden yüksekliği metre cinsinden $h(t) = -5t^2 + 25t$. Top hangi zaman aralığında <strong>30 metreden daha yüksektedir</strong>?<br><br>$h(t) > 30$ istiyoruz: $-5t^2 + 25t > 30 \\;\\Rightarrow\\; -5t^2 + 25t - 30 > 0 \\;\\Rightarrow\\; t^2 - 5t + 6 < 0$ ($-\\tfrac{1}{5}$ ile çarpıldı, ters çevrildi). Çarpanlara ayır: $(t-2)(t-3) < 0$, yani $2 < t < 3$.<br><br>Yorum: top 30 m'nin üzerinde yalnızca atıldıktan sonraki 2. ile 3. saniye arasında. $t=2\\,\\text{s}$'de 30 m'den yukarı çıkar, en yüksek noktasına ulaşır ($t=2.5\\,\\text{s}$, yükseklik $31.25$ m), sonra $t=3\\,\\text{s}$'de tekrar 30 m'den aşağı düşer. 30 m üzerinde geçirdiği süre: 1 saniye.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM B &mdash; ALAN KISITI</div><div class="example-body">Bir dikdörtgen çiçek tarhının uzunluğu $(x+3)$ metre, genişliği $(x-1)$ metre, burada $x$ pozitif bir parametre. Alan hangi $x$ değerleri için <strong>en fazla 12 metrekare</strong>?<br><br>Alan $= (x+3)(x-1) = x^2 + 2x - 3$. $x^2 + 2x - 3 \\le 12$ olmasını isteriz, yani $x^2 + 2x - 15 \\le 0$.<br><br>$x^2 + 2x - 15 = 0$ çöz: $\\Delta = 4 + 60 = 64$, $x = \\dfrac{-2 \\pm 8}{2}$, yani $x = 3$ ya da $x = -5$. İşaret tablosu: $a=1>0$, yani polinom $[-5, 3]$ üzerinde pozitif değil.<br><br>Ama geometrik kısıt $x > 1$ (genişlik pozitif olsun diye). $[-5, 3]$ ile $(1, +\\infty)$ kesişimi $(1, 3]$.<br><br>Cevap: $1 < x \\le 3$ metre. $x=3$'te tarh tam olarak $6\\,\\text{m} \\times 2\\,\\text{m} = 12\\,\\text{m}^2$ ölçer.</div></div>

<div class="l-note"><strong>Yaygın modelleme tuzağı:</strong> bilinmeyen fiziksel bir uzunluk, zaman ya da sayı olduğunda, cebirsel çözümü doğal tanım kümesiyle ($x > 0$, $t \\ge 0$, vb.) her zaman kesiştir. Cebir tek başına negatif uzunluğun anlamsız olduğunu bilmez.</div>

<h2 class="lesson-title">10. Yaygın Hatalar ve Bunlardan Nasıl Kaçınılır</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Değişken bir ifadeye bölmek</div><div class="card-body">Bir eşitsizliğin iki tarafını işaretini bilmediğin $x$ ya da $(x-k)$ ile asla bölme &mdash; negatif bir sayıya bölüyor olabilirsin, bu sessizce eşitsizliği ters çevirir. Onun yerine karesi alınmış ifadeyle çarp ya da her şeyi bir tarafa al ve işaret tablosu kullan.</div></div>
<div class="calc-card"><div class="card-title">Negatifle çarparken ters çevirmeyi unutmak</div><div class="card-body">İki tarafı $-1$ ile çarpmak ya da bölmek eşitsizliği <strong>ters çevirir</strong>: $-x > -3$, $x < 3$ olur, $x > 3$ değil. Çarpma yapmadan önce eşitsizlik işaretini alışkanlık olarak yuvarlak içine al.</div></div>
<div class="calc-card"><div class="card-title">Sıkı ve sıkı olmayanı karıştırmak</div><div class="card-body">$<$ kökleri hariç tutar, $\\le$ dahil eder. "Hariç" için parantez, "dahil" için köşeli parantez kullan &mdash; sayı doğrusundaki noktalarla eşleşir (boş &harr; dolu).</div></div>
<div class="calc-card"><div class="card-title">Boş kümeyi 0 olarak yazmak</div><div class="card-body">Bir karesel hiç negatif değilse ($\\Delta<0$ ve $a>0$), $ax^2+bx+c<0$ çözümü <strong>boş küme</strong> $\\varnothing$'dir, "0" değil ve "çözüm yok" değil. Doğru sembolü kullan.</div></div>
<div class="calc-card"><div class="card-title">Baş katsayı işaretini görmezden gelmek</div><div class="card-body">$-x^2 + 2x + 8 > 0$ için parabol <em>aşağı</em> açılır, dolayısıyla polinom kökleri <em>arasında</em> pozitif, dışında değil. Cevabı yazmadan önce hızlıca U ya da ters U çiz.</div></div>
<div class="calc-card"><div class="card-title">Sonsuzda yanlış yön</div><div class="card-body">Yüksek dereceli polinomlar için $x\\to\\pm\\infty$ olduğunda ne olduğunu bilmek için baş terim işaretini kontrol et. En dıştaki aralıklardaki işaret bundan çıkar; kalanlar dönüşümlüdür (tekrarlı köklerde uygun davranışla).</div></div>
</div>

<h2 class="lesson-title">11. Alıştırma Problemleri</h2>

<p class="l-text">Önce her problemi kendin çöz, sonra çözüme bak. Set tüm yelpazeyi kapsıyor: pozitif baş katsayı, negatif baş katsayı, $\\Delta>0$, $\\Delta=0$, $\\Delta<0$, sıkı, sıkı olmayan ve bir sözel problem.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 1 &mdash; Standart monik karesel</div><div class="card-body"><strong>Çöz: $x^2 - x - 6 \\le 0$.</strong><br><br>Çarpanlara ayır: $(x-3)(x+2) \\le 0$, kökler $-2, 3$. $a=1>0$ olduğundan polinom kökler arasında negatif. Sıkı olmayan, dolayısıyla kökleri dahil et. <strong>Cevap:</strong> $x \\in [-2, 3]$.</div></div>

<div class="calc-card"><div class="card-title">Problem 2 &mdash; Sıkı pozitif</div><div class="card-body"><strong>Çöz: $2x^2 + 5x - 3 > 0$.</strong><br><br>Karesel formülden kökler: $\\Delta = 25 + 24 = 49$, $x = \\dfrac{-5 \\pm 7}{4}$, yani $x = -3$ ya da $x = \\tfrac{1}{2}$. $a=2>0$ ile köklerin dışında pozitif. Sıkı, dolayısıyla hariç tut. <strong>Cevap:</strong> $x \\in (-\\infty, -3) \\cup (\\tfrac{1}{2}, +\\infty)$.</div></div>

<div class="calc-card"><div class="card-title">Problem 3 &mdash; Negatif baş katsayı</div><div class="card-body"><strong>Çöz: $-x^2 + 6x - 8 \\ge 0$.</strong><br><br>$-1$ ile çarp ve ters çevir: $x^2 - 6x + 8 \\le 0$. Çarpanlara ayır: $(x-2)(x-4) \\le 0$, kökler $2, 4$. Çözüm kökler arasında, kökler dahil. <strong>Cevap:</strong> $x \\in [2, 4]$.</div></div>

<div class="calc-card"><div class="card-title">Problem 4 &mdash; Δ = 0 durumu</div><div class="card-body"><strong>Çöz: $x^2 - 6x + 9 \\ge 0$.</strong><br><br>$\\Delta = 36 - 36 = 0$, çift kök $x = 3$. İfade $(x-3)^2$'ye eşit, bu her zaman $\\ge 0$. <strong>Cevap:</strong> $\\mathbb{R} = (-\\infty, +\\infty)$.<br><br>Bonus: $x^2 - 6x + 9 < 0$ çöz &rarr; hiç negatif değil &rarr; <strong>boş küme $\\varnothing$</strong>.</div></div>

<div class="calc-card"><div class="card-title">Problem 5 &mdash; Δ &lt; 0 durumu</div><div class="card-body"><strong>Çöz: $x^2 + x + 1 < 0$.</strong><br><br>$\\Delta = 1 - 4 = -3 < 0$, gerçel kök yok. $a=1>0$ ile parabol yukarı açılır ve tamamen x-ekseninin üzerinde kalır, yani ifade her zaman kesin pozitif. <strong>Cevap:</strong> $\\varnothing$ (boş küme).</div></div>

<div class="calc-card"><div class="card-title">Problem 6 &mdash; Δ &lt; 0, diğer yön</div><div class="card-body"><strong>Çöz: $-x^2 - 2x - 5 \\le 0$.</strong><br><br>$\\Delta = 4 - 20 = -16 < 0$. $a=-1<0$ ile parabol aşağı açılır ve tamamen x-ekseninin altında oturur. Yani $-x^2-2x-5 < 0$ tüm gerçel $x$ için, dolayısıyla kesinlikle tüm $x$ için $\\le 0$. <strong>Cevap:</strong> $\\mathbb{R}$.</div></div>

<div class="calc-card"><div class="card-title">Problem 7 &mdash; İşaret tablosuyla kübik</div><div class="card-body"><strong>Çöz: $(x+1)(x-2)(x-5) \\ge 0$.</strong><br><br>Kökler $-1, 2, 5$. Baş katsayı $+1$, dolayısıyla $(5,\\infty)$'da işaret $+$ ve sola giderek işaretler değişir: $(-\\infty,-1)$ $-$, $(-1,2)$ $+$, $(2,5)$ $-$, $(5,\\infty)$ $+$. Sıkı olmayan, dolayısıyla kökleri dahil et. <strong>Cevap:</strong> $[-1, 2] \\cup [5, +\\infty)$.</div></div>

<div class="calc-card"><div class="card-title">Problem 8 &mdash; Sözel problem (atış)</div><div class="card-body"><strong>Bir roketin $t$ saniyede yüksekliği $h(t) = -4t^2 + 32t$ metre. Roket hangi $t$ için 60 m'de ya da üzerinde?</strong><br><br>$-4t^2 + 32t \\ge 60 \\Rightarrow t^2 - 8t + 15 \\le 0$ ($-4$'e böl, ters çevir). Çarpanlara ayır: $(t-3)(t-5) \\le 0$, yani $t \\in [3, 5]$. Her iki uç da fiziksel olarak geçerli (pozitif zamanlar). <strong>Cevap:</strong> roket $3 \\le t \\le 5$ saniye için 60 m'de ya da üzerinde &mdash; $t=4$'teki tepe etrafında 2 saniyelik bir pencere.</div></div>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Her karesel eşitsizliği bir tarafı sıfır olan standart forma $ax^2+bx+c \\;\\square\\; 0$ getir</li>
<li>Parabolün şeklini (i) $a$'nın işareti ve (ii) $\\Delta = b^2-4ac$'nin işareti belirler</li>
<li>İşaret kuralı: $a$ ile aynı işaret köklerin dışında, ters işaret kökler arasında ($\\Delta>0$ durumu)</li>
<li>$\\Delta=0$: polinom her yerde $\\ge 0$ (ya da $\\le 0$), eşitlik yalnızca çift kökte</li>
<li>$\\Delta<0$: gerçel kök yok; polinom tüm $\\mathbb{R}$ üzerinde sabit işaret tutar</li>
<li>Sıkı ($<,>$) kökleri hariç tutar, sıkı olmayan ($\\le,\\ge$) dahil eder</li>
<li>İşaret tablosu yöntemi herhangi bir derecede çarpanlanmış polinomlara genişler</li>
<li>Modelleme problemlerinde cebirsel çözümü her zaman fiziksel tanım kümesiyle kesiştir</li>
</ul>
</div>`
};
