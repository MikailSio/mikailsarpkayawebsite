window.LISE_MAT_L45 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Until now every function you have studied followed a single rule.</strong> $f(x)=x^{2}$ squares whatever you give it — every input, no exceptions. $g(x)=\\sin x$ takes the sine — again, every input. But the world rarely behaves that politely. A taxi meter charges one rate for the first kilometre and a different rate for the rest. An electricity bill uses one price for the first 150 kWh, a higher price above that. Income tax climbs in steps. The temperature outside follows one function during the day and a different one at night. To describe situations like these we need a function that <em>changes its rule</em> depending on which interval the input lies in. That is a <strong>piecewise function</strong>.</p>

<p class="l-text">In this lesson you will learn to read the big-curly-brace notation that mathematicians use to glue several rules into a single function, sketch the graph piece by piece with the correct open/closed endpoints, and decide at every join whether the result is continuous (no jump) and differentiable (no corner). These three skills cover everything Turkish high-school and YKS-style problems will ask of you on this topic.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read and write piecewise functions using the big-curly-brace case notation</li>
<li>Recognise $|x|$ as the simplest non-trivial piecewise function and write it as two rules</li>
<li>Model real-life tiered systems (taxi fare, electricity, tax brackets) as piecewise functions</li>
<li>Sketch a piecewise graph correctly, including the open-circle / filled-circle convention at join points</li>
<li>Test continuity at a join point by checking left limit = right limit = function value</li>
<li>Test differentiability at a join point by checking left derivative = right derivative</li>
<li>Solve "find the parameter $a$ so that $f$ is continuous" problems by setting the two pieces equal at the join</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Piecewise Function?</h2>

<div class="calc-highlight"><strong>A piecewise function is a single function whose rule changes from one interval to another.</strong> The input set (domain) is split into disjoint pieces — for example $x<0$ and $x\\ge 0$ — and on each piece a different formula tells you how to compute the output.</div>

<p class="l-text">The key word is <em>single</em>. Even though we use two or three formulas to describe it, the result is one function $f$ with one graph. Each formula is responsible for its own slice of the x-axis; outside that slice, that formula is silent.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Subdomain</div><div class="card-body">An interval (or union of intervals) on which one of the rules is active. The subdomains must cover the whole domain of $f$ and must not overlap.</div></div>
<div class="calc-card"><div class="card-title">Piece (branch)</div><div class="card-body">The formula that applies on a particular subdomain. A piece can be linear, quadratic, constant, or any function you like.</div></div>
<div class="calc-card"><div class="card-title">Join point</div><div class="card-body">A value of $x$ where two subdomains meet. This is exactly the place where you must check continuity and (if you care) differentiability.</div></div>
</div>

<div class="l-note"><strong>Cover but do not overlap.</strong> When you write a piecewise function, make sure every $x$ in the domain hits exactly one branch. If both $x<2$ and $x\\le 2$ appear, the point $x=2$ is described twice and you must make sure both descriptions agree. A clean way is to use $<$ on one side and $\\ge$ on the other.</div>

<h2 class="lesson-title">2. The Big-Curly-Brace Notation</h2>

<div class="calc-highlight"><strong>Mathematicians glue the branches together with a single large left brace.</strong> Each line inside the brace lists a formula on the left and the subdomain on which it is valid on the right.</div>

<div class="calc-formula"><div class="formula-label">GENERAL FORM</div><div class="formula-main">$$f(x) \\;=\\; \\begin{cases} f_{1}(x), & x \\in I_{1} \\\\[4pt] f_{2}(x), & x \\in I_{2} \\\\[4pt] f_{3}(x), & x \\in I_{3} \\end{cases}$$</div><div class="formula-sub">Read every line as "if $x$ lies in $I_{k}$, then $f(x)=f_{k}(x)$." The intervals $I_{1},I_{2},I_{3}$ must cover the domain without overlap.</div></div>

<p class="l-text">As an example, here is a piecewise function with three branches:</p>

<div class="calc-formula"><div class="formula-label">EXAMPLE</div><div class="formula-main">$$f(x) \\;=\\; \\begin{cases} -x+1, & x<0 \\\\[4pt] x^{2}, & 0 \\le x < 2 \\\\[4pt] 4, & x \\ge 2 \\end{cases}$$</div><div class="formula-sub">A line on the negative half, a parabola on $[0,2)$, a constant from $2$ onwards. Three rules, one function.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — EVALUATING</div><div class="example-body">For the function above compute $f(-1)$, $f(0)$, $f(1)$, $f(2)$, $f(5)$.<br><br>$x=-1<0$ so use the first branch: $f(-1)=-(-1)+1=2$.<br>$x=0$ satisfies $0\\le x<2$ so use the second branch: $f(0)=0^{2}=0$.<br>$x=1$ satisfies $0\\le x<2$ so $f(1)=1^{2}=1$.<br>$x=2$ satisfies $x\\ge 2$ so use the third branch: $f(2)=4$.<br>$x=5\\ge 2$ so $f(5)=4$ as well.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Which branch you use at $x=2$ matters. If the second branch had been "$0\\le x \\le 2$" instead of "$0\\le x<2$", we would compute $f(2)=2^{2}=4$ from it. By coincidence the third branch also gives $4$, so the two definitions agree — but if they had disagreed, $f$ would be ill-defined at $x=2$. Always check that overlapping conditions give the same value (or use strict inequality on one side).</div></div>

<h2 class="lesson-title">3. Worked Example: The Absolute Value as a Piecewise Function</h2>

<div class="calc-highlight"><strong>The function $f(x)=|x|$ is the most famous piecewise function in mathematics.</strong> You already know its graph — a V with vertex at the origin. What you may not have seen is that the V is really two straight lines glued together at $x=0$, and the curly-brace notation lets you write that gluing precisely.</div>

<div class="calc-formula"><div class="formula-label">ABSOLUTE VALUE — TWO-PIECE FORM</div><div class="formula-main">$$|x| \\;=\\; \\begin{cases} -x, & x < 0 \\\\[4pt] x, & x \\ge 0 \\end{cases}$$</div><div class="formula-sub">If $x$ is negative, flipping its sign makes it positive. If $x$ is non-negative, leave it alone. Both branches agree at the join $x=0$, where they evaluate to $0$.</div></div>

<p class="l-text">Verify quickly: $|-3|=-(-3)=3$ (used the first branch, since $-3<0$). $|4|=4$ (used the second branch, since $4\\ge 0$). $|0|=0$ (used the second branch, since $0\\ge 0$, and indeed $-0=0$ so the first branch would also give $0$).</p>

<div class="calc-graph"><div id="plot-l45-abs-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the V-shape of $|x|$ obtained by gluing the line $y=-x$ on the left (red) to the line $y=x$ on the right (blue) at the join $x=0$. The two pieces share the single point $(0,0)$ — the value is the same on both sides, so the function is <em>continuous</em>.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];for(var i=0;i<=60;i++){var x=-3+3*i/60;xL.push(x);yL.push(-x);}
var xR=[];var yR=[];for(var j=0;j<=60;j++){var x=3*j/60;xR.push(x);yR.push(x);}
var leftEN={x:xL,y:yL,mode:'lines',name:'y = -x  (x<0)',line:{color:'#ef4444',width:3}};
var rightEN={x:xR,y:yR,mode:'lines',name:'y = x  (x>=0)',line:{color:'#3b82f6',width:3}};
var dotEN={x:[0],y:[0],mode:'markers',name:'join (0,0)',marker:{color:'#fbbf24',size:10,line:{color:'#0a0a0a',width:1.5}}};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.2,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'|x|',range:[-0.4,3.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l45-abs-en',[leftEN,rightEN,dotEN],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why this matters.</strong> The two-piece form lets you remove the absolute value bars when you solve equations or compute derivatives. For instance, to solve $|x|=2x-3$ you split into the case $x<0$ (becomes $-x=2x-3$, $x=1$, rejected because $1\\not<0$) and the case $x\\ge 0$ (becomes $x=2x-3$, $x=3$, accepted). The piecewise rewrite makes the split automatic.</div>

<h2 class="lesson-title">4. Worked Example: A Simplified Income-Tax Function</h2>

<div class="calc-highlight"><strong>Real-world tariffs are textbook examples of piecewise functions.</strong> Turkey's income-tax brackets, electricity tariffs, and even some mobile-phone plans all use a different rate on each interval of usage. Here is a stripped-down version designed to illustrate the structure cleanly.</div>

<p class="l-text">Imagine a fictional tax system in which annual income $x$ (in thousand TL) is taxed at:</p>

<ul class="l-text">
<li><strong>15 %</strong> on every lira up to 100 (first bracket: $0\\le x\\le 100$),</li>
<li><strong>25 %</strong> on every lira between 100 and 400 (second bracket: $100<x\\le 400$),</li>
<li><strong>35 %</strong> on every lira above 400 (third bracket: $x>400$).</li>
</ul>

<p class="l-text">The total tax $T(x)$ paid on an income $x$ is then built bracket-by-bracket. Up to 100 you have paid $0.15x$. Above 100 you have already paid the full first-bracket amount $0.15\\cdot 100=15$ and now add $0.25\\,(x-100)$ for whatever is above 100. Above 400 you have already paid $15+0.25\\cdot 300=90$ and add $0.35\\,(x-400)$. In one expression:</p>

<div class="calc-formula"><div class="formula-label">TOTAL TAX</div><div class="formula-main">$$T(x) \\;=\\; \\begin{cases} 0.15\\,x, & 0 \\le x \\le 100 \\\\[4pt] 15 + 0.25\\,(x-100), & 100 < x \\le 400 \\\\[4pt] 90 + 0.35\\,(x-400), & x > 400 \\end{cases}$$</div><div class="formula-sub">Each branch is a straight line, but the <em>slope</em> increases at every join. The graph is continuous (no jump in money paid) but has corners at $x=100$ and $x=400$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Compute $T(80)$, $T(100)$, $T(250)$, $T(500)$.<br><br>$T(80)=0.15\\cdot 80=\\mathbf{12}$ (first bracket).<br>$T(100)=0.15\\cdot 100=\\mathbf{15}$ (still in the first bracket).<br>$T(250)=15+0.25\\,(250-100)=15+37.5=\\mathbf{52.5}$ (second bracket).<br>$T(500)=90+0.35\\,(500-400)=90+35=\\mathbf{125}$ (third bracket).</div></div>

<div class="calc-graph"><div id="plot-l45-tax-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the tax function $T(x)$ over income from 0 to 600 thousand TL. The graph is a continuous broken line whose slope kinks at $x=100$ (from 0.15 to 0.25) and at $x=400$ (from 0.25 to 0.35). The corners are the join points; the graph itself has no jumps because the formulas were chosen to agree at each bracket boundary.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x1=[];var y1=[];for(var i=0;i<=20;i++){var x=100*i/20;x1.push(x);y1.push(0.15*x);}
var x2=[];var y2=[];for(var i=0;i<=30;i++){var x=100+300*i/30;x2.push(x);y2.push(15+0.25*(x-100));}
var x3=[];var y3=[];for(var i=0;i<=20;i++){var x=400+200*i/20;x3.push(x);y3.push(90+0.35*(x-400));}
var b1EN={x:x1,y:y1,mode:'lines',name:'bracket 1: 15%',line:{color:'#10b981',width:3}};
var b2EN={x:x2,y:y2,mode:'lines',name:'bracket 2: 25%',line:{color:'#3b82f6',width:3}};
var b3EN={x:x3,y:y3,mode:'lines',name:'bracket 3: 35%',line:{color:'#f59e0b',width:3}};
var dotsEN={x:[100,400],y:[15,90],mode:'markers',name:'bracket boundaries',marker:{color:'#fbbf24',size:9,line:{color:'#0a0a0a',width:1.5}}};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'income (thousand TL)',range:[0,620],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'tax (thousand TL)',range:[0,170],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l45-tax-en',[b1EN,b2EN,b3EN,dotsEN],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Sketching a Piecewise Graph — Open and Closed Endpoints</h2>

<div class="calc-highlight"><strong>The procedure is mechanical:</strong> for each branch, draw the graph of the corresponding formula but only on the subdomain assigned to that branch. At the boundary of a subdomain use a <em>filled</em> dot if the inequality is non-strict ($\\le$ or $\\ge$, i.e. the boundary point belongs to that branch) and an <em>open</em> dot if the inequality is strict ($<$ or $>$, i.e. the boundary point does not belong to that branch).</div>

<div class="calc-formula"><div class="formula-label">EXAMPLE — A FUNCTION WITH A JUMP</div><div class="formula-main">$$g(x) \\;=\\; \\begin{cases} x+1, & x<2 \\\\[4pt] x-1, & x \\ge 2 \\end{cases}$$</div><div class="formula-sub">Left branch is the line $y=x+1$ on $(-\\infty,2)$. Right branch is the line $y=x-1$ on $[2,\\infty)$. At $x=2$ the left side approaches $3$ (open dot) and the right side starts at $1$ (filled dot). There is a jump of size $-2$ at the join.</div></div>

<div class="calc-graph"><div id="plot-l45-jump-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the discontinuous function $g$ above. The blue segment is $y=x+1$ for $x<2$ and ends with an <em>open circle</em> at $(2,3)$ — that value is not taken by $g$. The red segment is $y=x-1$ for $x\\ge 2$ and starts with a <em>filled dot</em> at $(2,1)$ — that value <em>is</em> taken by $g$. The vertical gap between the two dots is the size of the jump.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];for(var i=0;i<=40;i++){var x=-1+3*i/40;xL.push(x);yL.push(x+1);}
var xR=[];var yR=[];for(var j=0;j<=40;j++){var x=2+3*j/40;xR.push(x);yR.push(x-1);}
var lEN={x:xL,y:yL,mode:'lines',name:'y = x+1  (x<2)',line:{color:'#3b82f6',width:3}};
var rEN={x:xR,y:yR,mode:'lines',name:'y = x-1  (x>=2)',line:{color:'#ef4444',width:3}};
var openEN={x:[2],y:[3],mode:'markers',name:'open: value not taken',marker:{color:'#0a0a0a',size:11,line:{color:'#3b82f6',width:2.5}}};
var closedEN={x:[2],y:[1],mode:'markers',name:'closed: value taken',marker:{color:'#ef4444',size:11,line:{color:'#0a0a0a',width:1.5}}};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.2,5.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'g(x)',range:[-0.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l45-jump-en',[lEN,rEN,openEN,closedEN],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>The dot convention in one sentence:</strong> <em>filled = included, open = excluded.</em> Marking dots correctly is half the points in an exam question on piecewise graphs.</div>

<h2 class="lesson-title">6. Continuity at a Join Point</h2>

<div class="calc-highlight"><strong>A piecewise function is continuous at a join point $x=c$ if and only if the left limit, the right limit, and the value all coincide.</strong> Symbolically: $\\lim_{x\\to c^{-}} f(x)=\\lim_{x\\to c^{+}} f(x)=f(c)$. In a piecewise definition the left limit is computed by plugging $c$ into the formula valid <em>just below</em> $c$, the right limit by plugging $c$ into the formula valid <em>just above</em>, and $f(c)$ by whichever branch actually owns the point $c$.</div>

<div class="calc-formula"><div class="formula-label">CONTINUITY TEST FOR PIECEWISE $f$ AT $x=c$</div><div class="formula-main">$$\\underbrace{\\lim_{x\\to c^{-}} f(x)}_{\\text{left branch at } c} \\;=\\; \\underbrace{\\lim_{x\\to c^{+}} f(x)}_{\\text{right branch at } c} \\;=\\; f(c)$$</div><div class="formula-sub">All three numbers must be equal. If even one of them disagrees, $f$ has a discontinuity at $c$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — IS IT CONTINUOUS?</div><div class="example-body">$f(x) = \\begin{cases} x^{2}, & x \\le 1 \\\\ 2x-1, & x>1 \\end{cases}$.<br><br>Left limit at $1$: $\\lim_{x\\to 1^{-}} x^{2}=1$.<br>Right limit at $1$: $\\lim_{x\\to 1^{+}} (2x-1)=1$.<br>Value: $f(1)=1^{2}=1$ (the first branch owns $x=1$).<br>All three equal $1$, so $f$ is <strong>continuous</strong> at $x=1$. No jump.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DISCONTINUOUS</div><div class="example-body">$h(x) = \\begin{cases} x+3, & x<0 \\\\ x^{2}, & x \\ge 0 \\end{cases}$.<br><br>Left limit at $0$: $\\lim_{x\\to 0^{-}} (x+3)=3$.<br>Right limit at $0$: $\\lim_{x\\to 0^{+}} x^{2}=0$.<br>The two one-sided limits disagree, so $h$ is <strong>discontinuous</strong> at $x=0$. The graph jumps from height $3$ down to height $0$.</div></div>

<h2 class="lesson-title">7. Differentiability at a Join Point</h2>

<div class="calc-highlight"><strong>Continuity alone is not enough for the graph to look smooth.</strong> The V-graph of $|x|$ is continuous at $x=0$, yet it has a sharp corner. To rule out corners we ask a second question at the join: does the slope from the left equal the slope from the right? That is the test for differentiability.</div>

<div class="calc-formula"><div class="formula-label">DIFFERENTIABILITY TEST AT $x=c$</div><div class="formula-main">$$f'_{-}(c) \\;=\\; f'_{+}(c) \\qquad\\text{where}\\qquad f'_{-}(c)=\\lim_{x\\to c^{-}} f'(x), \\quad f'_{+}(c)=\\lim_{x\\to c^{+}} f'(x)$$</div><div class="formula-sub">Two requirements together: $f$ must already be continuous at $c$, <em>and</em> the one-sided derivatives must match. If either fails, $f$ is not differentiable at $c$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — CONTINUOUS BUT NOT DIFFERENTIABLE</div><div class="example-body">Take $|x|$ at $x=0$. We already know it is continuous.<br><br>Left derivative: the left branch is $-x$, whose derivative is $-1$. So $f'_{-}(0)=-1$.<br>Right derivative: the right branch is $x$, whose derivative is $+1$. So $f'_{+}(0)=+1$.<br>The slopes disagree ($-1\\ne 1$), so $|x|$ is <strong>not differentiable</strong> at $x=0$. The V-corner is the geometric signature of this failure.</div></div>

<div class="calc-graph"><div id="plot-l45-corner-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a continuous piecewise function $p(x)$ that has a corner at the join. Specifically $p(x)=x^{2}$ for $x\\le 1$ and $p(x)=2x-1$ for $x>1$; both branches pass through $(1,1)$, so the graph is continuous and unbroken — but the left slope is $2$ (parabola slope $2x$ at $x=1$) and the right slope is $2$ as well, so this particular example is actually <em>smooth</em>. Compare with $|x-1|+1$ overlaid in red: same height at $x=1$ but a visible corner.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var p=[];var v=[];for(var i=0;i<=120;i++){var x=-0.5+3*i/120;xs.push(x);p.push(x<=1?x*x:2*x-1);v.push(Math.abs(x-1)+1);}
var smoothEN={x:xs,y:p,mode:'lines',name:'smooth piecewise (no corner)',line:{color:'#3b82f6',width:3}};
var cornerEN={x:xs,y:v,mode:'lines',name:'|x-1|+1 (corner at x=1)',line:{color:'#ef4444',width:3,dash:'dash'}};
var joinEN={x:[1],y:[1],mode:'markers',name:'join point (1,1)',marker:{color:'#fbbf24',size:10,line:{color:'#0a0a0a',width:1.5}}};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-0.3,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l45-corner-en',[smoothEN,cornerEN,joinEN],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Hierarchy to remember:</strong> differentiable $\\Rightarrow$ continuous, but continuous $\\not\\Rightarrow$ differentiable. A jump kills both, but a corner kills only differentiability while preserving continuity.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DIFFERENTIABLE PIECEWISE</div><div class="example-body">Decide whether $f(x)=\\begin{cases} x^{2}, & x \\le 1 \\\\ 2x-1, & x>1 \\end{cases}$ is differentiable at $x=1$.<br><br>Step 1 — Continuity. Left limit $=1^{2}=1$, right limit $=2(1)-1=1$, value $=1$. All three match, so $f$ is continuous at $1$.<br>Step 2 — Slopes. Left derivative: derivative of $x^{2}$ is $2x$, evaluated at $1$ gives $2$. Right derivative: derivative of $2x-1$ is $2$. Both equal $2$, so $f$ is <strong>differentiable</strong> at $x=1$, and $f'(1)=2$.<br><br>Geometrically the parabola and the line are tangent to one another at $(1,1)$ — they share both a point and a slope. The graph is perfectly smooth across the join.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SMOOTH PIECEWISE</div><div class="compare-item">All three numbers (left limit, right limit, value) agree.</div><div class="compare-item">Left derivative equals right derivative.</div><div class="compare-item">Graph has no jump and no corner.</div><div class="compare-item">Example: $x^{2}$ for $x\\le 1$, $2x-1$ for $x>1$.</div></div><div class="compare-col"><div class="compare-title">CORNER (CONTINUOUS, NOT DIFFERENTIABLE)</div><div class="compare-item">All three numbers agree.</div><div class="compare-item">Left derivative differs from right derivative.</div><div class="compare-item">Graph is unbroken but has a sharp corner.</div><div class="compare-item">Example: $|x|$ at $x=0$.</div></div></div>

<h2 class="lesson-title">8. Finding the Parameter that Makes a Function Continuous</h2>

<div class="calc-highlight"><strong>A very common exam question:</strong> a piecewise function depends on an unknown constant $a$ (or $k$), and you are asked to find the value of $a$ that makes $f$ continuous at the join. The trick is straightforward — set the two branches equal at the join and solve for $a$.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — FIND THE PARAMETER</div><div class="example-body">Find the value of $a$ that makes $f$ continuous at $x=2$, where $f(x)=\\begin{cases} ax+1, & x \\le 2 \\\\ x^{2}-3, & x>2 \\end{cases}$.<br><br>Left limit at $2$: $\\lim_{x\\to 2^{-}} (ax+1)=2a+1$.<br>Right limit at $2$: $\\lim_{x\\to 2^{+}} (x^{2}-3)=4-3=1$.<br>For continuity we need $2a+1=1$, so $2a=0$, giving $\\mathbf{a=0}$.<br>Sanity check: with $a=0$ the first branch is the constant $1$, and indeed $f(2)=1$ matches the right limit.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — FIND TWO PARAMETERS</div><div class="example-body">Find $a$ and $b$ so that $f$ is continuous everywhere, with $f(x)=\\begin{cases} x+1, & x<0 \\\\ ax+b, & 0 \\le x \\le 3 \\\\ 2x-5, & x>3 \\end{cases}$.<br><br>Continuity at $x=0$: left $=1$, right $=b$. So $b=1$.<br>Continuity at $x=3$: left $=3a+b=3a+1$, right $=6-5=1$. So $3a+1=1$, giving $a=0$.<br>Answer: $\\mathbf{a=0,\\;b=1}$. The middle branch becomes the constant function $1$.</div></div>

<div class="think-box"><div class="think-label">VARIATION — DIFFERENTIABLE PARAMETER</div><div class="think-body">If the question also requires differentiability at the join, write a <em>second</em> equation by equating the one-sided derivatives. Two equations in two unknowns $(a,b)$, solve as a linear system. Try it: find $a,b$ so that $f(x)=\\begin{cases} x^{2}, & x\\le 1 \\\\ ax+b, & x>1 \\end{cases}$ is both continuous and differentiable at $x=1$. (Continuity: $1=a+b$. Differentiability: $2=a$. So $a=2, b=-1$.)</div></div>

<h2 class="lesson-title">9. Classical Exercises</h2>

<p class="l-text">Try these without looking back. Full solutions are sketched at the end so that you can self-check after a serious attempt.</p>

<ol class="l-text" style="line-height:1.85">
<li>Sketch $f(x)=\\begin{cases} -x-1, & x<-1 \\\\ x^{2}, & -1\\le x \\le 1 \\\\ 2, & x>1 \\end{cases}$, marking all open and closed endpoints.</li>
<li>For the function in problem 1, decide whether $f$ is continuous at $x=-1$ and at $x=1$.</li>
<li>Write the piecewise form of $f(x)=|x-3|+|x+2|$, splitting at the critical points $x=-2$ and $x=3$.</li>
<li>Find $a$ so that $f(x)=\\begin{cases} 3x-2, & x \\le 1 \\\\ ax+5, & x>1 \\end{cases}$ is continuous at $x=1$.</li>
<li>Find $a$ and $b$ so that $f(x)=\\begin{cases} x^{2}+a, & x \\le 0 \\\\ bx+1, & x>0 \\end{cases}$ is continuous and differentiable at $x=0$.</li>
<li>Evaluate the piecewise function $h(x)=\\begin{cases} \\sin x, & x<0 \\\\ x^{2}+1, & 0\\le x<2 \\\\ 5-x, & x \\ge 2 \\end{cases}$ at $x=-\\pi/2, 0, 1, 2, 4$.</li>
<li>For the function in problem 6, is $h$ continuous at $x=0$? at $x=2$? Justify each answer with one-sided limits.</li>
<li>A parking lot charges 10 TL for the first hour and 6 TL for each additional hour (any fraction of an hour counts as a full hour). Write the price $P(t)$ as a piecewise function for $0<t\\le 4$ and sketch its graph (it is a staircase).</li>
</ol>

<div class="calc-example"><div class="example-label">ANSWERS (CHECK ONLY AFTER YOU TRIED)</div><div class="example-body"><strong>1)</strong> Line on left, parabola in middle, horizontal at $y=2$ on the right. Closed dot at $(-1,1)$ from middle, open from left side at $(-1,0)$; closed at $(1,1)$ from middle, open at $(1,2)$ from right. <br><strong>2)</strong> At $x=-1$: left limit $=-(-1)-1=0$, value $=(-1)^{2}=1$. Disagree, <em>discontinuous</em>. At $x=1$: left limit $=1^{2}=1$, right limit $=2$, value $=1$. Right limit disagrees, <em>discontinuous</em>. <br><strong>3)</strong> $|x-3|+|x+2|=\\begin{cases} -(x-3)-(x+2)=1-2x, & x<-2 \\\\ -(x-3)+(x+2)=5, & -2\\le x \\le 3 \\\\ (x-3)+(x+2)=2x-1, & x>3 \\end{cases}$. <br><strong>4)</strong> $3(1)-2=1$, $a(1)+5=a+5$, so $a+5=1$, $\\mathbf{a=-4}$. <br><strong>5)</strong> Continuity at $0$: $a=1$. Differentiability at $0$: left derivative $=2x|_{0}=0$, right derivative $=b$, so $b=0$. Answer: $\\mathbf{a=1, b=0}$. <br><strong>6)</strong> $h(-\\pi/2)=\\sin(-\\pi/2)=-1$, $h(0)=0^{2}+1=1$, $h(1)=1^{2}+1=2$, $h(2)=5-2=3$, $h(4)=5-4=1$. <br><strong>7)</strong> At $x=0$: left limit $\\sin 0=0$, right limit $0+1=1$, <em>discontinuous</em>. At $x=2$: left limit $4+1=5$, right limit $5-2=3$, value $=3$, <em>discontinuous</em>. <br><strong>8)</strong> $P(t)=\\begin{cases} 10, & 0<t\\le 1 \\\\ 16, & 1<t\\le 2 \\\\ 22, & 2<t\\le 3 \\\\ 28, & 3<t\\le 4 \\end{cases}$. The graph is a staircase rising by 6 at each integer; each step is closed on the right (filled dot at the top of the riser) and open on the left.</div></div>

<div class="calc-highlight"><strong>Where you are now.</strong> You can read and write piecewise notation, evaluate the function at any input, sketch the graph with the correct dots at every join, decide on continuity and differentiability with one-sided limits, and pin down parameters to force continuity. With the absolute-value trick you can convert any expression with $|\\,\\cdot\\,|$ inside into a piecewise expression without bars — which is exactly what you will need when piecewise functions reappear in derivative and integral problems later in calculus.</div>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Buraya kadar gördüğün her fonksiyon tek bir kurala uyuyordu.</strong> $f(x)=x^{2}$, sana verdiğin her sayının karesini alır — istisnasız. $g(x)=\\sin x$ aynı şekilde her girdinin sinüsünü hesaplar. Ama dünya nadiren bu kadar nazik davranır. Bir taksi metresi ilk kilometre için bir ücret, sonraki kilometreler için başka bir ücret keser. Elektrik faturası ilk 150 kWh'a bir tarife, üstüne daha pahalı tarife uygular. Gelir vergisi basamak basamak artar. Hava sıcaklığı gündüz başka, gece başka bir fonksiyonu izler. Bu tür durumları tarif edebilmek için girdinin hangi aralıkta olduğuna göre <em>kuralını değiştiren</em> bir fonksiyona ihtiyacımız var. İşte bu fonksiyon, <strong>parçalı fonksiyon</strong>dur.</p>

<p class="l-text">Bu derste matematikçilerin birkaç kuralı tek bir fonksiyona yapıştırmak için kullandığı büyük süslü-parantez gösterimini okumayı, grafiği parça parça doğru açık/kapalı uç-nokta işaretleriyle çizmeyi ve her birleşim noktasında sonucun sürekli (sıçramasız) ve türevlenebilir (köşesiz) olup olmadığına karar vermeyi öğreneceksin. Bu üç beceri, Türk lisesinin ve YKS-tarzı soruların bu konuda senden isteyebileceği her şeyi kapsar.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Büyük süslü parantezli durum gösterimiyle parçalı fonksiyonları okuyup yazma</li>
<li>$|x|$ fonksiyonunun en basit anlamlı parçalı fonksiyon olduğunu fark etme ve iki kural halinde yazma</li>
<li>Gerçek hayattaki dilim sistemlerini (taksi, elektrik, gelir vergisi) parçalı fonksiyon olarak modelleme</li>
<li>Parçalı bir grafiği, birleşim noktasında açık daire / dolu daire kuralına uyarak doğru çizme</li>
<li>Birleşim noktasında soldan limit = sağdan limit = fonksiyon değeri olup olmadığını kontrol ederek sürekliliği test etme</li>
<li>Birleşim noktasında soldan türev = sağdan türev olup olmadığını kontrol ederek türevlenebilirliği test etme</li>
<li>"Fonksiyonun sürekli olması için $a$ değerini bul" tipi soruları, iki parçayı birleşim noktasında eşitleyerek çözme</li>
</ul>
</div>

<h2 class="lesson-title">1. Parçalı Fonksiyon Nedir?</h2>

<div class="calc-highlight"><strong>Parçalı fonksiyon, kuralı bir aralıktan diğerine değişen tek bir fonksiyondur.</strong> Girdi kümesi (tanım kümesi) ayrık parçalara bölünür — örneğin $x<0$ ve $x\\ge 0$ — ve her parçada farklı bir formül çıktının nasıl hesaplanacağını söyler.</div>

<p class="l-text">Anahtar sözcük <em>tek</em>. Onu betimlemek için iki ya da üç formül kullansak da sonuç tek bir $f$ fonksiyonu ve tek bir grafiktir. Her formül x-ekseninin kendi diliminden sorumludur; o dilimin dışında o formül susar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Alt-tanım kümesi</div><div class="card-body">Üzerinde kurallardan birinin geçerli olduğu aralık (ya da aralıkların birleşimi). Alt-tanım kümeleri $f$'in bütün tanım kümesini örtmeli ve birbiriyle çakışmamalıdır.</div></div>
<div class="calc-card"><div class="card-title">Parça (dal)</div><div class="card-body">Belirli bir alt-tanım kümesinde geçerli olan formül. Bir parça doğrusal, ikinci dereceden, sabit ya da istediğin herhangi bir fonksiyon olabilir.</div></div>
<div class="calc-card"><div class="card-title">Birleşim noktası</div><div class="card-body">İki alt-tanım kümesinin birleştiği $x$ değeri. Sürekliliği ve (önemsiyorsan) türevlenebilirliği kontrol edeceğin yer tam burasıdır.</div></div>
</div>

<div class="l-note"><strong>Ört, ama çakışma.</strong> Bir parçalı fonksiyon yazarken tanım kümesindeki her $x$'in tam olarak bir dala düştüğünden emin ol. Hem $x<2$ hem de $x\\le 2$ ifadesi geçiyorsa $x=2$ noktası iki kez tanımlanmış olur ve iki tanımın aynı değeri vermesi gerekir. Temiz yol: bir tarafta $<$, diğer tarafta $\\ge$ kullanmak.</div>

<h2 class="lesson-title">2. Büyük Süslü Parantez Gösterimi</h2>

<div class="calc-highlight"><strong>Matematikçiler dalları tek bir büyük sol süslü parantez ile birbirine yapıştırır.</strong> Parantezin içindeki her satır, solda bir formülü, sağda ise o formülün geçerli olduğu alt-tanım kümesini listeler.</div>

<div class="calc-formula"><div class="formula-label">GENEL BİÇİM</div><div class="formula-main">$$f(x) \\;=\\; \\begin{cases} f_{1}(x), & x \\in I_{1} \\\\[4pt] f_{2}(x), & x \\in I_{2} \\\\[4pt] f_{3}(x), & x \\in I_{3} \\end{cases}$$</div><div class="formula-sub">Her satırı şöyle oku: "Eğer $x$, $I_{k}$ aralığında ise, o zaman $f(x)=f_{k}(x)$." $I_{1},I_{2},I_{3}$ aralıkları, tanım kümesini çakışmadan örtmelidir.</div></div>

<p class="l-text">Örneğin üç dallı şu parçalı fonksiyon:</p>

<div class="calc-formula"><div class="formula-label">ÖRNEK</div><div class="formula-main">$$f(x) \\;=\\; \\begin{cases} -x+1, & x<0 \\\\[4pt] x^{2}, & 0 \\le x < 2 \\\\[4pt] 4, & x \\ge 2 \\end{cases}$$</div><div class="formula-sub">Negatif yarım eksende bir doğru, $[0,2)$'de bir parabol, $2$'den sonra sabit. Üç kural, tek fonksiyon.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DEĞER HESAPLAMA</div><div class="example-body">Yukarıdaki fonksiyon için $f(-1)$, $f(0)$, $f(1)$, $f(2)$, $f(5)$ değerlerini hesapla.<br><br>$x=-1<0$ olduğundan ilk dalı kullan: $f(-1)=-(-1)+1=2$.<br>$x=0$ koşulu $0\\le x<2$ aralığını sağlar, ikinci dal: $f(0)=0^{2}=0$.<br>$x=1$ koşulu $0\\le x<2$ aralığında, $f(1)=1^{2}=1$.<br>$x=2$ koşulu $x\\ge 2$ aralığında, üçüncü dal: $f(2)=4$.<br>$x=5\\ge 2$ olduğundan $f(5)=4$.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$x=2$'de hangi dalı kullandığın önemlidir. Eğer ikinci dal "$0\\le x \\le 2$" olarak yazılmış olsaydı, oradan da $f(2)=2^{2}=4$ değeri çıkardık. Tesadüfen üçüncü dal da $4$ verdiği için iki tanım uyuşuyor — fakat çakışan koşullar farklı değerler verseydi $f$, $x=2$'de iyi tanımlanmamış olurdu. Çakışan koşulların aynı değeri vermesini her zaman kontrol et (ya da bir tarafta sıkı eşitsizlik kullan).</div></div>

<h2 class="lesson-title">3. Çözümlü Örnek: Mutlak Değer Parçalı Fonksiyon Olarak</h2>

<div class="calc-highlight"><strong>$f(x)=|x|$ fonksiyonu, matematiğin en ünlü parçalı fonksiyonudur.</strong> Grafiğini zaten biliyorsun — başlangıç noktasında köşesi olan bir V. Belki görmediğin şey şudur: bu V aslında $x=0$'da yapıştırılmış iki doğru parçasıdır, ve süslü-parantez gösterimi bu yapıştırma işini kesin biçimde yazmanı sağlar.</div>

<div class="calc-formula"><div class="formula-label">MUTLAK DEĞER — İKİ PARÇALI BİÇİM</div><div class="formula-main">$$|x| \\;=\\; \\begin{cases} -x, & x < 0 \\\\[4pt] x, & x \\ge 0 \\end{cases}$$</div><div class="formula-sub">Eğer $x$ negatifse, işaretini ters çevirmek onu pozitif yapar. Eğer $x$ negatif değilse, olduğu gibi bırak. İki dal da birleşim noktası $x=0$'da uyuşur ve her ikisi $0$ verir.</div></div>

<p class="l-text">Hızlıca doğrula: $|-3|=-(-3)=3$ (ilk dal kullanıldı, çünkü $-3<0$). $|4|=4$ (ikinci dal, çünkü $4\\ge 0$). $|0|=0$ (ikinci dal, $0\\ge 0$; zaten $-0=0$ olduğundan ilk dal da $0$ verirdi).</p>

<div class="calc-graph"><div id="plot-l45-abs-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $|x|$ fonksiyonunun V şeklini elde etmek için soldaki $y=-x$ doğrusu (kırmızı) ile sağdaki $y=x$ doğrusunun (mavi) birleşim noktası $x=0$'da yapıştırılması. İki parça tek bir $(0,0)$ noktasını paylaşıyor — değer her iki yandan aynı olduğu için fonksiyon <em>sürekli</em>.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];for(var i=0;i<=60;i++){var x=-3+3*i/60;xL.push(x);yL.push(-x);}
var xR=[];var yR=[];for(var j=0;j<=60;j++){var x=3*j/60;xR.push(x);yR.push(x);}
var leftTR={x:xL,y:yL,mode:'lines',name:'y = -x  (x<0)',line:{color:'#ef4444',width:3}};
var rightTR={x:xR,y:yR,mode:'lines',name:'y = x  (x>=0)',line:{color:'#3b82f6',width:3}};
var dotTR={x:[0],y:[0],mode:'markers',name:'birleşim (0,0)',marker:{color:'#fbbf24',size:10,line:{color:'#0a0a0a',width:1.5}}};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.2,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'|x|',range:[-0.4,3.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l45-abs-tr',[leftTR,rightTR,dotTR],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Neden önemli?</strong> İki parçalı biçim, denklem çözerken ya da türev alırken mutlak değer çubuklarını kaldırmanı sağlar. Örneğin $|x|=2x-3$ denklemini çözmek için $x<0$ durumuna ($-x=2x-3$, $x=1$, ama $1\\not<0$ olduğu için reddedilir) ve $x\\ge 0$ durumuna ($x=2x-3$, $x=3$, kabul) bölersin. Parçalı yeniden-yazım bu ayrımı otomatikleştirir.</div>

<h2 class="lesson-title">4. Çözümlü Örnek: Sadeleştirilmiş Bir Gelir Vergisi Fonksiyonu</h2>

<div class="calc-highlight"><strong>Gerçek hayattaki tarifeler, parçalı fonksiyonların ders kitabı örneğidir.</strong> Türkiye'nin gelir vergisi dilimleri, elektrik tarifeleri ve hatta bazı mobil abonelik planları her kullanım aralığında farklı oran uygular. Aşağıda yapıyı net biçimde göstermek için sadeleştirilmiş bir örnek var.</div>

<p class="l-text">Hayali bir vergi sistemini düşün: yıllık gelir $x$ (bin TL cinsinden) şu oranlarla vergilendirilsin:</p>

<ul class="l-text">
<li>100'e kadar her TL <strong>%15</strong> (birinci dilim: $0\\le x\\le 100$),</li>
<li>100 ile 400 arası her TL <strong>%25</strong> (ikinci dilim: $100<x\\le 400$),</li>
<li>400 üstü her TL <strong>%35</strong> (üçüncü dilim: $x>400$).</li>
</ul>

<p class="l-text">Bir $x$ gelirinde ödenen toplam vergi $T(x)$ dilim-dilim oluşur. 100'e kadar $0.15x$ ödemiştir. 100 üstüne çıkıldığında ilk dilim tamamen ödenmiş olur ($0.15\\cdot 100=15$) ve üzerine $0.25\\,(x-100)$ eklenir. 400 üstüne çıkıldığında ise $15+0.25\\cdot 300=90$ ödenmiştir ve buna $0.35\\,(x-400)$ eklenir. Tek ifadeyle:</p>

<div class="calc-formula"><div class="formula-label">TOPLAM VERGİ</div><div class="formula-main">$$T(x) \\;=\\; \\begin{cases} 0.15\\,x, & 0 \\le x \\le 100 \\\\[4pt] 15 + 0.25\\,(x-100), & 100 < x \\le 400 \\\\[4pt] 90 + 0.35\\,(x-400), & x > 400 \\end{cases}$$</div><div class="formula-sub">Her dal birer doğrudur, ancak <em>eğim</em> her birleşim noktasında artar. Grafik sürekli (ödenen parada sıçrama yok) ama $x=100$ ile $x=400$'de köşelere sahip.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$T(80)$, $T(100)$, $T(250)$, $T(500)$ değerlerini hesapla.<br><br>$T(80)=0.15\\cdot 80=\\mathbf{12}$ (birinci dilim).<br>$T(100)=0.15\\cdot 100=\\mathbf{15}$ (hâlâ birinci dilim).<br>$T(250)=15+0.25\\,(250-100)=15+37.5=\\mathbf{52.5}$ (ikinci dilim).<br>$T(500)=90+0.35\\,(500-400)=90+35=\\mathbf{125}$ (üçüncü dilim).</div></div>

<div class="calc-graph"><div id="plot-l45-tax-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> 0 ile 600 bin TL arasındaki gelir için $T(x)$ vergi fonksiyonu. Grafik, eğimi $x=100$'de (0.15'ten 0.25'e) ve $x=400$'de (0.25'ten 0.35'e) kırılan sürekli bir kırık doğrudur. Köşeler birleşim noktalarıdır; formüller her dilim sınırında uyuşacak şekilde seçildiği için grafiğin kendisinde sıçrama yoktur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x1=[];var y1=[];for(var i=0;i<=20;i++){var x=100*i/20;x1.push(x);y1.push(0.15*x);}
var x2=[];var y2=[];for(var i=0;i<=30;i++){var x=100+300*i/30;x2.push(x);y2.push(15+0.25*(x-100));}
var x3=[];var y3=[];for(var i=0;i<=20;i++){var x=400+200*i/20;x3.push(x);y3.push(90+0.35*(x-400));}
var b1TR={x:x1,y:y1,mode:'lines',name:'dilim 1: %15',line:{color:'#10b981',width:3}};
var b2TR={x:x2,y:y2,mode:'lines',name:'dilim 2: %25',line:{color:'#3b82f6',width:3}};
var b3TR={x:x3,y:y3,mode:'lines',name:'dilim 3: %35',line:{color:'#f59e0b',width:3}};
var dotsTR={x:[100,400],y:[15,90],mode:'markers',name:'dilim sınırları',marker:{color:'#fbbf24',size:9,line:{color:'#0a0a0a',width:1.5}}};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'gelir (bin TL)',range:[0,620],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'vergi (bin TL)',range:[0,170],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l45-tax-tr',[b1TR,b2TR,b3TR,dotsTR],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Parçalı Grafik Çizimi — Açık ve Kapalı Uç Noktalar</h2>

<div class="calc-highlight"><strong>Süreç mekaniktir:</strong> her dal için, ona ait alt-tanım kümesi üzerinde ilgili formülün grafiğini çiz. Bir alt-tanım kümesinin sınırında, eğer eşitsizlik sıkı değilse ($\\le$ ya da $\\ge$, yani sınır noktası o dala dahil) <em>dolu</em> bir nokta; eğer eşitsizlik sıkıysa ($<$ ya da $>$, yani sınır noktası o dala dahil değil) <em>açık</em> bir nokta kullan.</div>

<div class="calc-formula"><div class="formula-label">ÖRNEK — SIÇRAMALI FONKSİYON</div><div class="formula-main">$$g(x) \\;=\\; \\begin{cases} x+1, & x<2 \\\\[4pt] x-1, & x \\ge 2 \\end{cases}$$</div><div class="formula-sub">Sol dal $y=x+1$ doğrusu, $(-\\infty,2)$'de. Sağ dal $y=x-1$ doğrusu, $[2,\\infty)$'de. $x=2$'de sol taraf $3$'e yaklaşır (açık nokta), sağ taraf $1$'den başlar (dolu nokta). Birleşimde $-2$ büyüklüğünde bir sıçrama vardır.</div></div>

<div class="calc-graph"><div id="plot-l45-jump-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> yukarıdaki süreksiz $g$ fonksiyonu. Mavi parça $x<2$ için $y=x+1$ ve $(2,3)$ noktasında <em>açık daire</em> ile biter — bu değer $g$ tarafından alınmaz. Kırmızı parça $x\\ge 2$ için $y=x-1$ ve $(2,1)$'de <em>dolu nokta</em> ile başlar — bu değer $g$ tarafından alınır. İki nokta arasındaki dikey boşluk, sıçramanın büyüklüğüdür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];for(var i=0;i<=40;i++){var x=-1+3*i/40;xL.push(x);yL.push(x+1);}
var xR=[];var yR=[];for(var j=0;j<=40;j++){var x=2+3*j/40;xR.push(x);yR.push(x-1);}
var lTR={x:xL,y:yL,mode:'lines',name:'y = x+1  (x<2)',line:{color:'#3b82f6',width:3}};
var rTR={x:xR,y:yR,mode:'lines',name:'y = x-1  (x>=2)',line:{color:'#ef4444',width:3}};
var openTR={x:[2],y:[3],mode:'markers',name:'açık: değer alınmaz',marker:{color:'#0a0a0a',size:11,line:{color:'#3b82f6',width:2.5}}};
var closedTR={x:[2],y:[1],mode:'markers',name:'dolu: değer alınır',marker:{color:'#ef4444',size:11,line:{color:'#0a0a0a',width:1.5}}};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.2,5.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'g(x)',range:[-0.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l45-jump-tr',[lTR,rTR,openTR,closedTR],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Nokta kuralı tek cümlede:</strong> <em>dolu = dahil, açık = hariç.</em> Sınavda parçalı grafik sorularının puanının yarısı bu noktaları doğru işaretlemekten gelir.</div>

<h2 class="lesson-title">6. Birleşim Noktasında Süreklilik</h2>

<div class="calc-highlight"><strong>Parçalı bir fonksiyon, ancak ve ancak soldan limit, sağdan limit ve fonksiyon değeri birleşim noktası $x=c$'de aynı sayıya eşitse o noktada süreklidir.</strong> Sembolik olarak: $\\lim_{x\\to c^{-}} f(x)=\\lim_{x\\to c^{+}} f(x)=f(c)$. Parçalı tanımda soldan limit, $c$'nin <em>hemen altında</em> geçerli formüle $c$ koyarak; sağdan limit, $c$'nin <em>hemen üstünde</em> geçerli formüle $c$ koyarak; $f(c)$ ise $c$'yi gerçekten içeren dal yardımıyla hesaplanır.</div>

<div class="calc-formula"><div class="formula-label">PARÇALI $f$ İÇİN $x=c$'DE SÜREKLİLİK TESTİ</div><div class="formula-main">$$\\underbrace{\\lim_{x\\to c^{-}} f(x)}_{\\text{sol dal, } c} \\;=\\; \\underbrace{\\lim_{x\\to c^{+}} f(x)}_{\\text{sağ dal, } c} \\;=\\; f(c)$$</div><div class="formula-sub">Üç sayının da eşit olması gerekir. Biri bile uymazsa $f$, $c$'de süreksizdir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — SÜREKLİ Mİ?</div><div class="example-body">$f(x) = \\begin{cases} x^{2}, & x \\le 1 \\\\ 2x-1, & x>1 \\end{cases}$.<br><br>$1$'de soldan limit: $\\lim_{x\\to 1^{-}} x^{2}=1$.<br>$1$'de sağdan limit: $\\lim_{x\\to 1^{+}} (2x-1)=1$.<br>Değer: $f(1)=1^{2}=1$ (ilk dal $x=1$'i içerir).<br>Üçü de $1$'e eşit, dolayısıyla $f$, $x=1$'de <strong>sürekli</strong>. Sıçrama yok.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — SÜREKSİZ</div><div class="example-body">$h(x) = \\begin{cases} x+3, & x<0 \\\\ x^{2}, & x \\ge 0 \\end{cases}$.<br><br>$0$'da soldan limit: $\\lim_{x\\to 0^{-}} (x+3)=3$.<br>$0$'da sağdan limit: $\\lim_{x\\to 0^{+}} x^{2}=0$.<br>Tek yanlı limitler uyuşmadığı için $h$, $x=0$'da <strong>süreksizdir</strong>. Grafik $3$ yüksekliğinden $0$ yüksekliğine sıçrar.</div></div>

<h2 class="lesson-title">7. Birleşim Noktasında Türevlenebilirlik</h2>

<div class="calc-highlight"><strong>Grafiğin pürüzsüz görünmesi için süreklilik tek başına yetmez.</strong> $|x|$ fonksiyonunun V grafiği $x=0$'da süreklidir; yine de keskin bir köşesi vardır. Köşeleri elemek için birleşim noktasında ikinci bir soru sorarız: soldan eğim, sağdan eğime eşit mi? Bu, türevlenebilirlik testidir.</div>

<div class="calc-formula"><div class="formula-label">$x=c$'DE TÜREVLENEBİLİRLİK TESTİ</div><div class="formula-main">$$f'_{-}(c) \\;=\\; f'_{+}(c) \\qquad\\text{burada}\\qquad f'_{-}(c)=\\lim_{x\\to c^{-}} f'(x), \\quad f'_{+}(c)=\\lim_{x\\to c^{+}} f'(x)$$</div><div class="formula-sub">İki şart birlikte aranır: $f$ önce $c$'de sürekli olmalı, <em>ardından</em> tek-yanlı türevler eşleşmelidir. Biri bile çuvallarsa $f$, $c$'de türevlenebilir değildir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — SÜREKLİ AMA TÜREVLENEMEZ</div><div class="example-body">$|x|$ fonksiyonunu $x=0$'da ele al. Sürekli olduğunu biliyoruz.<br><br>Soldan türev: sol dal $-x$, türevi $-1$. Yani $f'_{-}(0)=-1$.<br>Sağdan türev: sağ dal $x$, türevi $+1$. Yani $f'_{+}(0)=+1$.<br>Eğimler uyuşmuyor ($-1\\ne 1$), dolayısıyla $|x|$ fonksiyonu $x=0$'da <strong>türevlenebilir değildir</strong>. V şeklindeki köşe, bu başarısızlığın geometrik imzasıdır.</div></div>

<div class="calc-graph"><div id="plot-l45-corner-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> birleşim noktasında köşeli olan sürekli bir parçalı fonksiyon. Özel olarak $p(x)=x^{2}$ için $x\\le 1$ ve $p(x)=2x-1$ için $x>1$; iki dal da $(1,1)$'den geçtiği için grafik sürekli ve kopuksuz — ama sol eğim $2$ (parabolün eğimi $2x$, $x=1$'de) ve sağ eğim de $2$ olduğundan bu özel örnek aslında <em>pürüzsüz</em>. Karşılaştırma için $|x-1|+1$ üzerine kırmızı kesik çizgi: aynı $(1,1)$ yüksekliği, ama belirgin bir köşe.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var p=[];var v=[];for(var i=0;i<=120;i++){var x=-0.5+3*i/120;xs.push(x);p.push(x<=1?x*x:2*x-1);v.push(Math.abs(x-1)+1);}
var smoothTR={x:xs,y:p,mode:'lines',name:'pürüzsüz parçalı (köşesiz)',line:{color:'#3b82f6',width:3}};
var cornerTR={x:xs,y:v,mode:'lines',name:'|x-1|+1 (x=1 köşeli)',line:{color:'#ef4444',width:3,dash:'dash'}};
var joinTR={x:[1],y:[1],mode:'markers',name:'birleşim (1,1)',marker:{color:'#fbbf24',size:10,line:{color:'#0a0a0a',width:1.5}}};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-0.3,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l45-corner-tr',[smoothTR,cornerTR,joinTR],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Hatırlanması gereken hiyerarşi:</strong> türevlenebilir $\\Rightarrow$ sürekli, ama sürekli $\\not\\Rightarrow$ türevlenebilir. Sıçrama her ikisini de öldürür; köşe ise sürekliliği bırakıp sadece türevlenebilirliği öldürür.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TÜREVLENEBİLİR PARÇALI</div><div class="example-body">$f(x)=\\begin{cases} x^{2}, & x \\le 1 \\\\ 2x-1, & x>1 \\end{cases}$ fonksiyonunun $x=1$'de türevlenebilir olup olmadığına karar ver.<br><br>1. Adım — Süreklilik. Soldan limit $=1^{2}=1$, sağdan limit $=2(1)-1=1$, değer $=1$. Üçü uyuşuyor, $f$ fonksiyonu $1$'de süreklidir.<br>2. Adım — Eğimler. Soldan türev: $x^{2}$'nin türevi $2x$, $1$'de $2$ verir. Sağdan türev: $2x-1$'in türevi $2$. İkisi de $2$ olduğundan $f$, $x=1$'de <strong>türevlenebilirdir</strong> ve $f'(1)=2$.<br><br>Geometrik olarak parabol ve doğru $(1,1)$ noktasında birbirine teğettir — hem bir noktayı hem de bir eğimi paylaşırlar. Grafik birleşim boyunca tamamen pürüzsüzdür.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">PÜRÜZSÜZ PARÇALI</div><div class="compare-item">Her üç sayı (soldan limit, sağdan limit, değer) uyuşur.</div><div class="compare-item">Soldan türev = sağdan türev.</div><div class="compare-item">Grafikte sıçrama da, köşe de yoktur.</div><div class="compare-item">Örnek: $x\\le 1$ için $x^{2}$, $x>1$ için $2x-1$.</div></div><div class="compare-col"><div class="compare-title">KÖŞE (SÜREKLİ, TÜREVLENEMEZ)</div><div class="compare-item">Her üç sayı uyuşur.</div><div class="compare-item">Soldan türev, sağdan türeve eşit değildir.</div><div class="compare-item">Grafik kopuksuz ama keskin bir köşeye sahiptir.</div><div class="compare-item">Örnek: $x=0$'da $|x|$.</div></div></div>

<h2 class="lesson-title">8. Sürekliliği Sağlayan Parametreyi Bulma</h2>

<div class="calc-highlight"><strong>Sınavda çok sık karşılaşılan soru türü:</strong> parçalı bir fonksiyon $a$ (veya $k$) bilinmeyen sabitine bağlıdır ve sana $f$'i birleşim noktasında sürekli yapan $a$ değeri sorulur. Püf nokta basittir — iki dalı birleşimde eşitle ve $a$'yı çek.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — PARAMETREYİ BUL</div><div class="example-body">$f(x)=\\begin{cases} ax+1, & x \\le 2 \\\\ x^{2}-3, & x>2 \\end{cases}$ fonksiyonunun $x=2$'de sürekli olması için $a$'yı bul.<br><br>$2$'de soldan limit: $\\lim_{x\\to 2^{-}} (ax+1)=2a+1$.<br>$2$'de sağdan limit: $\\lim_{x\\to 2^{+}} (x^{2}-3)=4-3=1$.<br>Süreklilik için $2a+1=1$ gerekir, yani $2a=0$, bulduğumuz $\\mathbf{a=0}$.<br>Kontrol: $a=0$ ile birinci dal sabit $1$ olur ve gerçekten $f(2)=1$, sağdan limitle uyuşur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İKİ PARAMETRE BUL</div><div class="example-body">$f(x)=\\begin{cases} x+1, & x<0 \\\\ ax+b, & 0 \\le x \\le 3 \\\\ 2x-5, & x>3 \\end{cases}$ fonksiyonunun her yerde sürekli olması için $a$ ve $b$'yi bul.<br><br>$x=0$'da süreklilik: sol $=1$, sağ $=b$. Yani $b=1$.<br>$x=3$'te süreklilik: sol $=3a+b=3a+1$, sağ $=6-5=1$. Yani $3a+1=1$, bulduğumuz $a=0$.<br>Cevap: $\\mathbf{a=0,\\;b=1}$. Orta dal sabit $1$ fonksiyonuna dönüşür.</div></div>

<div class="think-box"><div class="think-label">VARYASYON — TÜREVLENEBİLİR PARAMETRE</div><div class="think-body">Eğer soru birleşim noktasında türevlenebilirliği de istiyorsa, tek-yanlı türevleri eşitleyerek <em>ikinci</em> bir denklem yaz. İki bilinmeyenli $(a,b)$ iki denklemli doğrusal sistemi çöz. Denemek istersen: $f(x)=\\begin{cases} x^{2}, & x\\le 1 \\\\ ax+b, & x>1 \\end{cases}$ fonksiyonunun $x=1$'de hem sürekli hem türevlenebilir olması için $a,b$'yi bul. (Süreklilik: $1=a+b$. Türev: $2=a$. Yani $a=2,\\, b=-1$.)</div></div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>

<p class="l-text">Bunları geri dönmeden dene. Ciddi bir denemeden sonra kontrol edebilmen için çözümler aşağıda kısaca verildi.</p>

<ol class="l-text" style="line-height:1.85">
<li>$f(x)=\\begin{cases} -x-1, & x<-1 \\\\ x^{2}, & -1\\le x \\le 1 \\\\ 2, & x>1 \\end{cases}$ fonksiyonunu, tüm açık ve kapalı uç noktaları işaretleyerek çiz.</li>
<li>1. soruda verilen fonksiyon için $x=-1$ ve $x=1$ noktalarında sürekli olup olmadığına karar ver.</li>
<li>$f(x)=|x-3|+|x+2|$ fonksiyonunun parçalı biçimini, kritik noktalar $x=-2$ ve $x=3$'te bölerek yaz.</li>
<li>$f(x)=\\begin{cases} 3x-2, & x \\le 1 \\\\ ax+5, & x>1 \\end{cases}$ fonksiyonunun $x=1$'de sürekli olması için $a$'yı bul.</li>
<li>$f(x)=\\begin{cases} x^{2}+a, & x \\le 0 \\\\ bx+1, & x>0 \\end{cases}$ fonksiyonunun $x=0$'da sürekli ve türevlenebilir olması için $a$ ve $b$'yi bul.</li>
<li>Parçalı $h(x)=\\begin{cases} \\sin x, & x<0 \\\\ x^{2}+1, & 0\\le x<2 \\\\ 5-x, & x \\ge 2 \\end{cases}$ fonksiyonunu $x=-\\pi/2, 0, 1, 2, 4$ noktalarında hesapla.</li>
<li>6. sorudaki $h$ fonksiyonu $x=0$'da sürekli mi? $x=2$'de? Her cevabı tek-yanlı limitlerle gerekçelendir.</li>
<li>Bir otopark ilk saat için 10 TL, sonraki her saat için 6 TL alıyor (saatin herhangi bir parçası tam saat sayılır). $P(t)$ ücretini $0<t\\le 4$ aralığında parçalı fonksiyon olarak yaz ve grafiğini çiz (merdiven biçiminde olacak).</li>
</ol>

<div class="calc-example"><div class="example-label">CEVAPLAR (DENEDİKTEN SONRA AÇ)</div><div class="example-body"><strong>1)</strong> Solda doğru, ortada parabol, sağda $y=2$ yatay. Orta daldan $(-1,1)$'de dolu nokta, sol taraftan $(-1,0)$'da açık; orta daldan $(1,1)$'de dolu, sağ taraftan $(1,2)$'de açık. <br><strong>2)</strong> $x=-1$'de: soldan limit $=-(-1)-1=0$, değer $=(-1)^{2}=1$. Uyuşmuyor, <em>süreksiz</em>. $x=1$'de: soldan limit $=1^{2}=1$, sağdan limit $=2$, değer $=1$. Sağdan limit uyuşmuyor, <em>süreksiz</em>. <br><strong>3)</strong> $|x-3|+|x+2|=\\begin{cases} -(x-3)-(x+2)=1-2x, & x<-2 \\\\ -(x-3)+(x+2)=5, & -2\\le x \\le 3 \\\\ (x-3)+(x+2)=2x-1, & x>3 \\end{cases}$. <br><strong>4)</strong> $3(1)-2=1$, $a(1)+5=a+5$, yani $a+5=1$, $\\mathbf{a=-4}$. <br><strong>5)</strong> $0$'da süreklilik: $a=1$. $0$'da türevlenebilirlik: soldan türev $=2x|_{0}=0$, sağdan türev $=b$, yani $b=0$. Cevap: $\\mathbf{a=1, b=0}$. <br><strong>6)</strong> $h(-\\pi/2)=\\sin(-\\pi/2)=-1$, $h(0)=0^{2}+1=1$, $h(1)=1^{2}+1=2$, $h(2)=5-2=3$, $h(4)=5-4=1$. <br><strong>7)</strong> $x=0$'da: soldan limit $\\sin 0=0$, sağdan limit $0+1=1$, <em>süreksiz</em>. $x=2$'de: soldan limit $4+1=5$, sağdan limit $5-2=3$, değer $=3$, <em>süreksiz</em>. <br><strong>8)</strong> $P(t)=\\begin{cases} 10, & 0<t\\le 1 \\\\ 16, & 1<t\\le 2 \\\\ 22, & 2<t\\le 3 \\\\ 28, & 3<t\\le 4 \\end{cases}$. Grafik her tam saatte 6 birim yükselen merdivendir; her basamak sağda kapalı (dik kenarın üstünde dolu nokta), solda açıktır.</div></div>

<div class="calc-highlight"><strong>Şu an nerede olduğun.</strong> Parçalı gösterimi okuyup yazabilir, fonksiyonu istenen her girdide hesaplayabilir, grafiği her birleşim noktasında doğru noktalarla çizebilir, tek-yanlı limitlerle süreklilik ve türevlenebilirliğe karar verebilir, sürekliliği sağlamak için parametre belirleyebilirsin. Mutlak değer hilesiyle içinde $|\\,\\cdot\\,|$ geçen herhangi bir ifadeyi çubuksuz parçalı bir ifadeye çevirebilirsin — kalkülüsün ileriki bölümlerinde türev ve integral problemlerinde parçalı fonksiyonlar geri döndüğünde tam olarak buna ihtiyacın olacak.</div>
`
};
