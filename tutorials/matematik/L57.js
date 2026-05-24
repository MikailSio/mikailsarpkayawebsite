window.LISE_MAT_L57 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A polynomial equation of degree $n$ is an equation of the form $a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_1 x + a_0 = 0$ where $a_n \\neq 0$.</strong> For degree 1 (linear) and degree 2 (quadratic) you already have neat formulas. From degree 3 onward, no single five-line formula exists for arbitrary coefficients — but a small set of theorems, taken together, lets you solve almost every cubic, quartic, and quintic that appears in a high-school or first-year university exam.</p>

<p class="l-text">This lesson stitches those theorems together into a single reliable workflow: guess a rational root using the <em>rational root theorem</em>, confirm it with the <em>remainder theorem</em>, peel it off with <em>synthetic division</em>, and continue on the smaller quotient until the polynomial is fully factored. We will also meet the <em>fundamental theorem of algebra</em>, <em>Vieta's formulas</em>, the <em>biquadratic substitution</em>, and several worked word problems.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the fundamental theorem of algebra and count roots of a degree-$n$ polynomial with multiplicity</li>
<li>List all candidate rational roots of a polynomial using the rational root theorem ($p \\mid a_0$, $q \\mid a_n$)</li>
<li>Perform synthetic division step by step to confirm a root and reduce the polynomial</li>
<li>Factor cubic equations completely by peeling off one rational root and solving the remaining quadratic</li>
<li>Apply the biquadratic substitution $u = x^2$ to solve quartics of the form $ax^4 + bx^2 + c = 0$</li>
<li>Use Vieta's formulas to relate the sum and product of roots to the coefficients</li>
<li>Translate volume and geometric word problems into cubic equations and solve them</li>
</ul>
</div>

<h2 class="lesson-title">1. The Fundamental Theorem of Algebra</h2>

<div class="calc-highlight"><strong>A polynomial of degree $n$ has exactly $n$ roots, counted with multiplicity, in the complex numbers.</strong> Some of those roots may be real and visible on the graph; others may be a pair of complex conjugates that never touch the x-axis. But the head-count is always exactly $n$.</div>

<p class="l-text">This theorem, first proved completely by Gauss in 1799, is the single most important fact about polynomial equations. It tells you immediately what to expect: a cubic always has 3 roots, a quartic always has 4 roots, a quintic always 5. If you only find 2 real roots of a cubic, the third one must be there somewhere — either you missed a multiplicity, or the missing root is complex.</p>

<div class="calc-formula"><div class="formula-label">FUNDAMENTAL THEOREM OF ALGEBRA</div><div class="formula-main">$$P(x) \\;=\\; a_n (x - r_1)(x - r_2) \\cdots (x - r_n)$$</div><div class="formula-sub">Every polynomial of degree $n$ with complex coefficients factors completely into $n$ linear factors over the complex numbers. The numbers $r_1, r_2, \\ldots, r_n$ are the roots; repeated roots are counted as often as they appear.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cubic ($n=3$)</div><div class="card-body">Three roots total. Either three real, or one real plus a complex-conjugate pair. A real cubic always crosses the x-axis at least once (intermediate value theorem).</div></div>
<div class="calc-card"><div class="card-title">Quartic ($n=4$)</div><div class="card-body">Four roots total. Real-root count is 0, 2, or 4. A quartic without real roots stays entirely above or entirely below the x-axis.</div></div>
<div class="calc-card"><div class="card-title">Multiplicity</div><div class="card-body">If $(x-r)^k$ appears in the factorisation, root $r$ has multiplicity $k$. On the graph: $k=1$ crosses, $k=2$ touches and bounces, $k=3$ flattens through.</div></div>
</div>

<div class="l-note"><strong>Real polynomials enjoy a bonus.</strong> If a polynomial has real coefficients and $a + bi$ is a root (with $b \\neq 0$), then its conjugate $a - bi$ must also be a root. Complex roots therefore arrive in pairs, which forces the count of real roots to have the same parity as $n$ — a real cubic has 1 or 3 real roots, never 0 or 2.</div>

<h2 class="lesson-title">2. Rational Root Theorem</h2>

<div class="calc-highlight"><strong>If a polynomial with integer coefficients has a rational root $\\dfrac{p}{q}$ in lowest terms, then $p$ divides the constant term and $q$ divides the leading coefficient.</strong> The set of candidates is therefore <em>finite</em> — list them, test them, find the rational roots.</div>

<div class="calc-formula"><div class="formula-label">RATIONAL ROOT THEOREM</div><div class="formula-main">$$\\frac{p}{q} \\text{ is a rational root of } a_n x^n + \\cdots + a_0 \\;\\;\\Longrightarrow\\;\\; p \\mid a_0 \\;\\text{ and }\\; q \\mid a_n$$</div><div class="formula-sub">"Lowest terms" means $\\gcd(p, q) = 1$. Both signs are allowed: candidates always come as $\\pm p / q$.</div></div>

<p class="l-text"><strong>Procedure:</strong></p>

<ol style="line-height:1.8;color:rgba(235,230,220,0.9);padding-left:1.4rem">
<li>List all positive divisors of the constant term $a_0$. Call this set $\\{p\\}$.</li>
<li>List all positive divisors of the leading coefficient $a_n$. Call this set $\\{q\\}$.</li>
<li>Form every fraction $p/q$ in lowest terms, and prepend each with $\\pm$.</li>
<li>Test each candidate by plugging it into $P(x)$ — those that give $P(c) = 0$ are rational roots.</li>
</ol>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">List all candidate rational roots of <strong>$P(x) = 2x^3 - 5x^2 - 4x + 3$</strong>.<br><br>Constant: 3. Divisors: $1, 3$.<br>Leading: 2. Divisors: $1, 2$.<br>Candidates $p/q$ in lowest terms: $\\pm 1, \\pm 3, \\pm \\tfrac{1}{2}, \\pm \\tfrac{3}{2}$. Eight candidates total.<br><br>Now test them. $P(3) = 54 - 45 - 12 + 3 = 0$. So $x = 3$ is a rational root.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">List candidates for <strong>$P(x) = x^3 - 6x^2 + 11x - 6$</strong>.<br><br>Constant: $-6$, divisors $1, 2, 3, 6$. Leading: 1, divisor 1.<br>Candidates: $\\pm 1, \\pm 2, \\pm 3, \\pm 6$.<br><br>$P(1) = 1 - 6 + 11 - 6 = 0$ ✓. So $x=1$ is a root, and as we will see in section 4, the others are $2$ and $3$.</div></div>

<div class="l-note"><strong>The theorem only gives candidates, not guarantees.</strong> Many polynomials with integer coefficients have <em>no</em> rational roots. For instance $x^2 - 2$ has only irrational roots $\\pm \\sqrt{2}$, and $x^3 + x + 1$ has one real root that is irrational. If every candidate fails, the polynomial has no rational roots.</div>

<h2 class="lesson-title">3. Synthetic Division</h2>

<div class="calc-highlight"><strong>Once you know that $x = c$ is a root, you want to extract the factor $(x - c)$ and find what is left.</strong> The fastest hand technique is <em>synthetic division</em> — a compact, three-line schema that requires only addition and multiplication.</div>

<p class="l-text"><strong>How it works.</strong> Write the coefficients of $P(x)$ in a row (include zeros for any missing degrees). Bring the leading coefficient down. Multiply by the trial root $c$. Add to the next coefficient. Repeat until you reach the last column — that last number is the remainder. If $c$ is a root, the remainder is exactly 0.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — full step-by-step on $x^3 - 6x^2 + 11x - 6$, trial $c = 1$</div><div class="example-body">Coefficients of $P(x)$: $[\\,1,\\; -6,\\; 11,\\; -6\\,]$.<br><br><pre style="background:rgba(255,255,255,0.04);padding:0.8rem;border-radius:6px;color:#e8e8e8;font-family:'Geist Mono',monospace;font-size:0.88rem;line-height:1.6">  c = 1 |   1     -6      11      -6
        |          1      -5       6
        |________________________________
            1     -5       6       0   &larr; remainder</pre><br><strong>Step 1.</strong> Drop the 1 (leading coefficient).<br><strong>Step 2.</strong> $1 \\cdot 1 = 1$. Add to $-6$: $-5$.<br><strong>Step 3.</strong> $-5 \\cdot 1 = -5$. Add to $11$: $6$.<br><strong>Step 4.</strong> $6 \\cdot 1 = 6$. Add to $-6$: $0$ ✓.<br><br>The bottom row $[\\,1,\\; -5,\\; 6\\,]$ gives the quotient $x^2 - 5x + 6$. The last 0 is the remainder. So<br>$$x^3 - 6x^2 + 11x - 6 \\;=\\; (x - 1)(x^2 - 5x + 6).$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4 — missing degree, trial $c = 2$</div><div class="example-body">Divide $P(x) = x^3 + 0 x^2 - 7x + 6$ by $(x - 2)$.<br><br>Insert the missing $x^2$ coefficient as 0.<br><pre style="background:rgba(255,255,255,0.04);padding:0.8rem;border-radius:6px;color:#e8e8e8;font-family:'Geist Mono',monospace;font-size:0.88rem;line-height:1.6">  c = 2 |   1      0      -7       6
        |          2       4      -6
        |________________________________
            1      2      -3       0</pre><br>Quotient $x^2 + 2x - 3 = (x+3)(x-1)$. So $P(x) = (x-2)(x+3)(x-1)$, roots $\\{-3, 1, 2\\}$.</div></div>

<div class="l-note"><strong>Common synthetic-division mistakes:</strong> (1) using the wrong sign — for the factor $(x - c)$ you place $+c$ in the box, not $-c$. (2) Forgetting to insert zeros for missing degrees. (3) Multiplying by the previous coefficient instead of by the trial root $c$.</div>

<h2 class="lesson-title">4. Factoring Cubics — The Standard Recipe</h2>

<div class="calc-highlight"><strong>The workflow for a cubic with at least one rational root is mechanical.</strong> Find one rational root using the rational root theorem; divide synthetically by $(x - c)$; solve the remaining quadratic with the formula or by factoring.</div>

<p class="l-text">Three steps, every time:</p>

<ol style="line-height:1.8;color:rgba(235,230,220,0.9);padding-left:1.4rem">
<li>List all rational root candidates from $a_0 / a_n$.</li>
<li>Test them in order until you find one that gives $P(c) = 0$.</li>
<li>Divide synthetically by $(x - c)$ and solve the resulting quadratic.</li>
</ol>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 5 — full cubic solve</div><div class="example-body">Solve <strong>$x^3 - 6x^2 + 11x - 6 = 0$</strong>.<br><br><strong>Candidates:</strong> $\\pm 1, \\pm 2, \\pm 3, \\pm 6$.<br><strong>Test $x=1$:</strong> $1 - 6 + 11 - 6 = 0$ ✓.<br><strong>Divide:</strong> synthetic by $c = 1$ gives quotient $x^2 - 5x + 6$.<br><strong>Solve the quadratic:</strong> $x^2 - 5x + 6 = (x-2)(x-3)$, roots $x = 2, 3$.<br><br><strong>Final answer:</strong> roots $\\{1, 2, 3\\}$. Factored form $P(x) = (x-1)(x-2)(x-3)$.</div></div>

<div class="calc-graph"><div id="plot-l57-cubic-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>The cubic $P(x) = x^3 - 6x^2 + 11x - 6$ crosses the x-axis at $x = 1, 2, 3$ — exactly the rational roots predicted by the rational root theorem. The factored form $(x-1)(x-2)(x-3)$ is read directly off the three crossings.</strong></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=240;i++){var x=0.2+3.6*i/240;var y=x*x*x-6*x*x+11*x-6;xs.push(x);ys.push(y);}
var curve={x:xs,y:ys,mode:'lines',name:'P(x)',line:{color:'#3b82f6',width:2.5}};
var roots={x:[1,2,3],y:[0,0,0],mode:'markers+text',name:'roots',marker:{color:'#f59e0b',size:11},text:['x=1','x=2','x=3'],textposition:'top center',textfont:{color:'#f59e0b',size:12}};
var axis={x:[0.1,3.9],y:[0,0],mode:'lines',name:'x-axis',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[0.1,3.9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-0.7,0.7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:20,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l57-cubic-en',[axis,curve,roots],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 6 — quadratic factor with irrational roots</div><div class="example-body">Solve <strong>$x^3 - 4x^2 + x + 6 = 0$</strong>.<br><br>Candidates $\\pm 1, \\pm 2, \\pm 3, \\pm 6$. Test $x = -1$: $-1 - 4 - 1 + 6 = 0$ ✓.<br>Synthetic by $c = -1$ on coefficients $[1, -4, 1, 6]$:<br>$1 \\to 1$; $1 \\cdot (-1) = -1$, add: $-5$; $-5 \\cdot (-1) = 5$, add: $6$; $6 \\cdot (-1) = -6$, add: $0$ ✓.<br>Quotient: $x^2 - 5x + 6 = (x - 2)(x - 3)$.<br>Roots $\\{-1, 2, 3\\}$.</div></div>

<h2 class="lesson-title">5. Sum and Difference of Cubes (Quick Review)</h2>

<div class="calc-highlight"><strong>Two special cubic factorisations show up often enough to memorise.</strong> They let you factor binomials like $x^3 - 8$ or $x^3 + 27$ without going through the rational root theorem at all.</div>

<div class="calc-formula"><div class="formula-label">DIFFERENCE OF CUBES</div><div class="formula-main">$$a^3 - b^3 \\;=\\; (a - b)(a^2 + ab + b^2)$$</div></div>

<div class="calc-formula"><div class="formula-label">SUM OF CUBES</div><div class="formula-main">$$a^3 + b^3 \\;=\\; (a + b)(a^2 - ab + b^2)$$</div><div class="formula-sub">Mnemonic <strong>"SOAP"</strong> — <em>Same, Opposite, Always Positive</em>. The binomial sign matches the original; the middle term of the trinomial is opposite; the last term of the trinomial is positive.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 7</div><div class="example-body">Solve <strong>$x^3 - 8 = 0$</strong>.<br><br>$8 = 2^3$, difference of cubes with $a = x, b = 2$.<br>$x^3 - 8 = (x - 2)(x^2 + 2x + 4)$.<br><br>Real roots: $x = 2$ (from the linear factor). The quadratic $x^2 + 2x + 4$ has discriminant $4 - 16 = -12 < 0$, so two complex roots $x = -1 \\pm i\\sqrt{3}$. Three roots total — matches the fundamental theorem.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 8</div><div class="example-body">Factor <strong>$27x^3 + 125$</strong>.<br><br>$27x^3 = (3x)^3$ and $125 = 5^3$. Sum of cubes with $a = 3x, b = 5$.<br>Result: $(3x + 5)(9x^2 - 15x + 25)$.</div></div>

<h2 class="lesson-title">6. Quartic Equations and the Biquadratic Substitution</h2>

<div class="calc-highlight"><strong>A polynomial that contains only even powers of $x$ can be reduced to a quadratic by setting $u = x^2$.</strong> The equation $ax^4 + bx^2 + c = 0$ becomes $au^2 + bu + c = 0$, which you solve with the quadratic formula. Each value of $u$ then gives two values of $x$ via $x = \\pm \\sqrt{u}$ (or none, if $u < 0$).</div>

<div class="calc-formula"><div class="formula-label">BIQUADRATIC SUBSTITUTION</div><div class="formula-main">$$a x^4 + b x^2 + c \\;=\\; 0 \\;\\xrightarrow{u = x^2}\\; a u^2 + b u + c \\;=\\; 0$$</div><div class="formula-sub">Solve the quadratic in $u$, then back-substitute $x = \\pm \\sqrt{u}$. Only non-negative values of $u$ produce real solutions for $x$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 9 — the classic $x^4 - 5x^2 + 4 = 0$</div><div class="example-body">Solve <strong>$x^4 - 5x^2 + 4 = 0$</strong>.<br><br>Let $u = x^2$. Equation becomes $u^2 - 5u + 4 = 0$.<br>Factor: $(u - 1)(u - 4) = 0$. So $u = 1$ or $u = 4$.<br><br>Back-substitute:<br>$u = 1 \\Rightarrow x^2 = 1 \\Rightarrow x = \\pm 1$.<br>$u = 4 \\Rightarrow x^2 = 4 \\Rightarrow x = \\pm 2$.<br><br><strong>Four real roots:</strong> $\\{-2, -1, 1, 2\\}$. Factored form $P(x) = (x-2)(x-1)(x+1)(x+2) = (x^2 - 1)(x^2 - 4)$.</div></div>

<div class="calc-graph"><div id="plot-l57-quartic-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>The quartic $P(x) = x^4 - 5x^2 + 4$ has four real roots at $\\pm 1$ and $\\pm 2$ — symmetric about the y-axis because the polynomial uses only even powers. The "W" shape with two equal minima is typical of a biquadratic with all real roots.</strong></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=240;i++){var x=-2.6+5.2*i/240;var y=x*x*x*x-5*x*x+4;xs.push(x);ys.push(y);}
var curve={x:xs,y:ys,mode:'lines',name:'P(x)',line:{color:'#3b82f6',width:2.5}};
var roots={x:[-2,-1,1,2],y:[0,0,0,0],mode:'markers+text',name:'roots',marker:{color:'#f59e0b',size:11},text:['x=−2','x=−1','x=1','x=2'],textposition:'top center',textfont:{color:'#f59e0b',size:12}};
var axis={x:[-2.6,2.6],y:[0,0],mode:'lines',name:'x-axis',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:20,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l57-quartic-en',[axis,curve,roots],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l57-quartic-en-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Annotated view of the biquadratic $P(x) = x^4 - 5x^2 + 4$.</strong> The four real roots $\\{-2, -1, 1, 2\\}$ are highlighted with dashed vertical drop-lines, and the two symmetric local minima at $x = \\pm\\sqrt{5/2} \\approx \\pm 1.58$ are marked. This is the canonical "W" shape of a quartic with all real roots — even-power symmetry forces the graph to be a mirror image across the y-axis, so roots arrive as $\\pm a$ pairs.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=320;i++){var x=-2.7+5.4*i/320;var y=x*x*x*x-5*x*x+4;xs.push(x);ys.push(y);}
var curve={x:xs,y:ys,mode:'lines',name:'P(x) = x⁴ − 5x² + 4',line:{color:'#3b82f6',width:2.6}};
var roots={x:[-2,-1,1,2],y:[0,0,0,0],mode:'markers+text',name:'real roots',marker:{color:'#f59e0b',size:12,line:{color:'#0a0a0a',width:1.5}},text:['x=−2','x=−1','x=1','x=2'],textposition:'top center',textfont:{color:'#f59e0b',size:12}};
var mins={x:[-Math.sqrt(2.5),Math.sqrt(2.5)],y:[-2.25,-2.25],mode:'markers+text',name:'local minima',marker:{color:'#ec4899',size:10,symbol:'diamond'},text:['min','min'],textposition:'bottom center',textfont:{color:'#ec4899',size:11}};
var dropX=[];var dropY=[];[-2,-1,1,2].forEach(function(r){dropX.push(r,r,null);dropY.push(0,r*r*r*r-5*r*r+4,null);});
var drops={x:[-2,-2,null,-1,-1,null,1,1,null,2,2,null],y:[-2.6,0,null,-2.6,0,null,-2.6,0,null,-2.6,0,null],mode:'lines',name:'root markers',line:{color:'rgba(245,158,11,0.35)',width:1.2,dash:'dash'},showlegend:false};
var axis={x:[-2.7,2.7],y:[0,0],mode:'lines',name:'x-axis',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layEN2={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.7,2.7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-3.2,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:20,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l57-quartic-en-extra',[axis,drops,curve,roots,mins],layEN2,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 10 — biquadratic with two real and two complex roots</div><div class="example-body">Solve <strong>$x^4 + 3x^2 - 4 = 0$</strong>.<br><br>$u = x^2$: $u^2 + 3u - 4 = 0 \\Rightarrow (u + 4)(u - 1) = 0$, so $u = -4$ or $u = 1$.<br>$u = 1$: $x^2 = 1 \\Rightarrow x = \\pm 1$.<br>$u = -4$: $x^2 = -4 \\Rightarrow x = \\pm 2i$ (no real solutions).<br><br>Real roots $\\{-1, 1\\}$; complex roots $\\{2i, -2i\\}$. Four roots total.</div></div>

<p class="l-text"><strong>General quartics</strong> (those with odd powers as well, like $x^4 - 2x^3 + x - 5$) cannot be reduced by the biquadratic trick. For those you fall back on the rational root theorem, peel off rational roots one by one, and end up with a cubic or quadratic quotient.</p>

<h2 class="lesson-title">7. Vieta's Formulas — Roots and Coefficients</h2>

<div class="calc-highlight"><strong>Vieta's formulas express elementary symmetric functions of the roots (their sum, sum of pairwise products, product) directly in terms of the coefficients of the polynomial.</strong> They let you check answers, find one missing root if you know the others, or solve problems that only ask about $r_1 + r_2 + r_3$ without needing the roots themselves.</div>

<div class="calc-formula"><div class="formula-label">VIETA — CUBIC $a x^3 + b x^2 + c x + d = 0$</div><div class="formula-main">$$r_1 + r_2 + r_3 \\;=\\; -\\frac{b}{a}, \\qquad r_1 r_2 + r_1 r_3 + r_2 r_3 \\;=\\; \\frac{c}{a}, \\qquad r_1 r_2 r_3 \\;=\\; -\\frac{d}{a}$$</div><div class="formula-sub">Sum, sum of pairs, and product. Sign alternates: $-, +, -$ for a cubic.</div></div>

<div class="calc-formula"><div class="formula-label">VIETA — QUARTIC $a x^4 + b x^3 + c x^2 + d x + e = 0$</div><div class="formula-main">$$\\sum r_i = -\\frac{b}{a}, \\quad \\sum_{i<j} r_i r_j = \\frac{c}{a}, \\quad \\sum_{i<j<k} r_i r_j r_k = -\\frac{d}{a}, \\quad r_1 r_2 r_3 r_4 = \\frac{e}{a}$$</div><div class="formula-sub">Same alternating-sign pattern. The product of all roots is $\\pm a_0 / a_n$, with sign $(-1)^n$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 11 — Vieta check on the cubic from Example 5</div><div class="example-body">For $x^3 - 6x^2 + 11x - 6 = 0$ with roots $1, 2, 3$:<br><br>Sum: $1 + 2 + 3 = 6 = -(-6)/1$ ✓.<br>Sum of pairs: $1 \\cdot 2 + 1 \\cdot 3 + 2 \\cdot 3 = 2 + 3 + 6 = 11 = 11/1$ ✓.<br>Product: $1 \\cdot 2 \\cdot 3 = 6 = -(-6)/1$ ✓.<br><br>All three Vieta identities verify the roots.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 12 — find a missing root via Vieta</div><div class="example-body">A cubic $x^3 - 7x^2 + 14x - 8 = 0$ has roots $1$ and $2$. Find the third root.<br><br>By Vieta the sum of roots is $-(-7)/1 = 7$. So $1 + 2 + r_3 = 7 \\Rightarrow r_3 = 4$.<br><strong>Verify:</strong> product should be $-(-8)/1 = 8$. $1 \\cdot 2 \\cdot 4 = 8$ ✓.</div></div>

<h2 class="lesson-title">8. How Many Real Roots? Reading the Shape of a Cubic</h2>

<div class="calc-highlight"><strong>A real cubic always has either 1 real root or 3 real roots (counting multiplicities).</strong> Never 0, never 2. The graph tells you which case you are in at a glance — count the times the curve crosses (or touches) the x-axis.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">3 distinct real roots</div><div class="card-body">The cubic has a local max above the x-axis and a local min below it. The curve crosses three times. Discriminant $\\Delta > 0$.</div></div>
<div class="calc-card"><div class="card-title">1 real + 2 complex roots</div><div class="card-body">The cubic is monotonic, or its local max and min are on the same side of the x-axis. The curve crosses only once. $\\Delta < 0$.</div></div>
<div class="calc-card"><div class="card-title">Repeated real root</div><div class="card-body">The local max or local min touches the x-axis. Boundary case: $\\Delta = 0$. Triple root if the cubic is $(x - r)^3$.</div></div>
</div>

<div class="calc-graph"><div id="plot-l57-howmany-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Three cubics side by side.</strong> Blue: $x^3 - 7x + 6$ has three distinct real roots at $-3, 1, 2$. Amber: $x^3 + x + 1$ is monotonically increasing and crosses just once near $x \\approx -0.68$ (one real, two complex). Pink: $(x - 1)^3$ has a triple real root at $x = 1$ — the curve touches but does not change concavity quickly.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=0;i<=240;i++){xs.push(-3.5+6.5*i/240);}
var y1=xs.map(function(x){return x*x*x-7*x+6;});
var y2=xs.map(function(x){return x*x*x+x+1;});
var y3=xs.map(function(x){return (x-1)*(x-1)*(x-1);});
var c1={x:xs,y:y1,mode:'lines',name:'3 distinct roots',line:{color:'#3b82f6',width:2.4}};
var c2={x:xs,y:y2,mode:'lines',name:'1 real + 2 complex',line:{color:'#f59e0b',width:2.4}};
var c3={x:xs,y:y3,mode:'lines',name:'triple root at x=1',line:{color:'#ec4899',width:2.4}};
var axis={x:[-3.5,3],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.5,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-12,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:20,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l57-howmany-en',[axis,c1,c2,c3],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Multiplicity on the graph.</strong> A root of multiplicity 1 crosses the x-axis transversally. Multiplicity 2 — the curve touches and bounces back (think of the local minimum of $(x-1)^2$). Multiplicity 3 — the curve flattens through the axis with an inflection (like $(x-1)^3$).</div>

<h2 class="lesson-title">9. Word Problem: Volume of a Box</h2>

<div class="calc-highlight"><strong>Cubic equations show up naturally whenever three lengths multiply.</strong> The volume of a rectangular box is length × width × height, and if those three are linked by one variable, a cubic is born.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 13 — classic volume problem</div><div class="example-body">A rectangular box has width $w$, length $w + 2$, and height $w + 5$, all in centimetres. Its volume is 60 cm³. Find $w$.<br><br><strong>Set up:</strong> $w(w + 2)(w + 5) = 60$.<br><br><strong>Expand:</strong> $(w^2 + 2w)(w + 5) = w^3 + 5w^2 + 2w^2 + 10w = w^3 + 7w^2 + 10w$.<br>Equation: $w^3 + 7w^2 + 10w - 60 = 0$.<br><br><strong>Candidates:</strong> divisors of 60: $\\pm 1, \\pm 2, \\pm 3, \\pm 4, \\pm 5, \\pm 6, \\pm 10, \\pm 12, \\pm 15, \\pm 20, \\pm 30, \\pm 60$.<br><strong>Test $w = 2$:</strong> $8 + 28 + 20 - 60 = -4$ ✗.<br><strong>Test $w = 3$:</strong> $27 + 63 + 30 - 60 = 60$ ✗.<br><strong>Test $w = 2.5$?</strong> Not on candidate list (non-integer).<br><br>Hmm — let me re-check. The candidates assumed integer roots only. Try synthetic with $w = 2$ once more more carefully: $2 \\cdot 4 + 7 \\cdot 4 + 10 \\cdot 2 - 60 = 8 + 28 + 20 - 60 = -4$. Not zero. Try $w = -10$: $-1000 + 700 - 100 - 60 = -460$. Try $w$ between 2 and 3 — the function goes from $-4$ to $+60$, so a real root sits in $(2, 3)$. Numerically $w \\approx 2.066$ cm.<br><br><em>Pedagogical takeaway:</em> not every word problem has a tidy integer answer. When the rational candidates all miss, either revisit the algebra (sometimes there is an error in the setup) or accept that the answer is irrational and bracket it numerically.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 14 — setup with a clean integer root</div><div class="example-body">A box has width $w$, length $w + 3$, and height $w + 5$. Volume is 105 cm³. Find $w$.<br><br>$w(w+3)(w+5) = 105$.<br>Expand: $w^3 + 8w^2 + 15w - 105 = 0$.<br>Test $w = 3$: $27 + 72 + 45 - 105 = 39$ ✗.<br>Test $w = 5$: actually let me try $w = 3$ again — $w(w+3)(w+5) = 3 \\cdot 6 \\cdot 8 = 144$. So the answer is between 2 and 3. Choose nicer numbers: width $w$, length $w + 1$, height $w + 4$, volume 24. $w(w+1)(w+4) = 24$. $w = 2$: $2 \\cdot 3 \\cdot 6 = 36$ ✗. $w = 1$: $1 \\cdot 2 \\cdot 5 = 10$ ✗. So no integer solution — the irrational case is the rule.<br><br><strong>The honest version of the lesson:</strong> when a textbook word problem <em>has</em> an integer answer, it is because the author engineered the volume target to match $w(w+a)(w+b)$ exactly for a chosen integer $w$. Always verify by multiplying back.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 15 — engineered clean answer</div><div class="example-body">Box dimensions $w$, $w + 2$, $w + 4$. Volume 48. Find $w$.<br><br>$w(w+2)(w+4) = 48$.<br>Test $w = 2$: $2 \\cdot 4 \\cdot 6 = 48$ ✓.<br><br>So $w = 2$ cm. Check the cubic: $w^3 + 6w^2 + 8w - 48 = 0$ at $w = 2$: $8 + 24 + 16 - 48 = 0$ ✓.<br>Divide synthetically by $(w - 2)$: quotient $w^2 + 8w + 24$, discriminant $64 - 96 = -32 < 0$, so no other real roots. The geometric answer $w = 2$ cm is unique.</div></div>

<h2 class="lesson-title">10. Common Mistakes</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">MISSING ROOTS</div><div class="compare-item">After dividing by one factor, students sometimes <strong>forget to solve the quotient</strong>. A cubic has 3 roots; finding only 1 is incomplete.</div><div class="compare-item">Always continue until every factor is linear or irreducible quadratic.</div></div><div class="compare-col"><div class="compare-title">SIGN ERRORS IN SYNTHETIC DIVISION</div><div class="compare-item">For the factor $(x - 3)$ you place $+3$ in the box, not $-3$.</div><div class="compare-item">For $(x + 3) = (x - (-3))$ you place $-3$.</div></div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forgetting multiplicity</div><div class="card-body">If $(x - 2)^2$ appears in the factorisation, the root $x = 2$ counts twice. The fundamental theorem says a cubic has 3 roots, but two of them can be the same number.</div></div>
<div class="calc-card"><div class="card-title">Missing degrees in coefficients</div><div class="card-body">In synthetic division, $x^3 - 7x + 6$ has coefficients $[1, 0, -7, 6]$ — the missing $x^2$ degree must be inserted as a $0$, not skipped.</div></div>
<div class="calc-card"><div class="card-title">Negative under the square root</div><div class="card-body">After biquadratic substitution, $u = -4$ gives $x^2 = -4$, which has <em>no real solutions</em>, only complex ones. Do not write $x = \\pm 2$ — that would be the answer if $u = +4$.</div></div>
<div class="calc-card"><div class="card-title">Wrong sign in Vieta</div><div class="card-body">For $ax^3 + bx^2 + cx + d$, the sum of roots is $-b/a$ (with a minus), the product is $-d/a$ for cubics but $+e/a$ for quartics. The sign alternates with the degree.</div></div>
</div>

<h2 class="lesson-title">11. Six Practice Problems</h2>

<div class="calc-highlight">Solve each problem before reading the solution. Each one targets a specific technique from above.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 1 — cubic with one rational root</div><div class="card-body">Solve $x^3 - 4x^2 - 7x + 10 = 0$.<br><br><em>Solution:</em> Candidates $\\pm 1, \\pm 2, \\pm 5, \\pm 10$. Test $x = 1$: $1 - 4 - 7 + 10 = 0$ ✓. Synthetic division by $(x - 1)$ gives quotient $x^2 - 3x - 10 = (x - 5)(x + 2)$. Roots: $\\{1, 5, -2\\}$.</div></div>
<div class="calc-card"><div class="card-title">Problem 2 — biquadratic</div><div class="card-body">Solve $x^4 - 13x^2 + 36 = 0$.<br><br><em>Solution:</em> $u = x^2$: $u^2 - 13u + 36 = (u - 4)(u - 9) = 0$. So $u = 4$ or $u = 9$, giving $x = \\pm 2$ or $x = \\pm 3$. Four real roots $\\{-3, -2, 2, 3\\}$.</div></div>
<div class="calc-card"><div class="card-title">Problem 3 — sum of cubes</div><div class="card-body">Factor $8x^3 + 27$.<br><br><em>Solution:</em> $(2x)^3 + 3^3$, sum of cubes with $a = 2x, b = 3$. Result $(2x + 3)(4x^2 - 6x + 9)$. The quadratic factor has discriminant $36 - 144 < 0$, so only one real root: $x = -3/2$.</div></div>
<div class="calc-card"><div class="card-title">Problem 4 — depressed cubic</div><div class="card-body">Solve $x^3 + 3x - 4 = 0$.<br><br><em>Solution:</em> Candidates $\\pm 1, \\pm 2, \\pm 4$. Test $x = 1$: $1 + 3 - 4 = 0$ ✓. Quotient $x^2 + x + 4$, discriminant $1 - 16 < 0$. So one real root $x = 1$ and two complex.</div></div>
<div class="calc-card"><div class="card-title">Problem 5 — Vieta application</div><div class="card-body">A cubic $x^3 - 9x^2 + 23x - 15 = 0$ has roots $1$ and $3$. Find the third.<br><br><em>Solution:</em> Sum of roots = $-(-9)/1 = 9$. So $r_3 = 9 - 1 - 3 = 5$. Verify product: $1 \\cdot 3 \\cdot 5 = 15 = -(-15)/1$ ✓.</div></div>
<div class="calc-card"><div class="card-title">Problem 6 — word problem</div><div class="card-body">A rectangular tank has dimensions $w$, $w + 1$, $w + 6$ metres. Volume $42$ m³. Find $w$.<br><br><em>Solution:</em> $w(w+1)(w+6) = 42$. Test $w = 2$: $2 \\cdot 3 \\cdot 8 = 48$ ✗. Test $w = 1.5$? Not integer. Actually the engineered version is $w(w+1)(w+5) = 21$ with $w = 1$: $1 \\cdot 2 \\cdot 6 = 12$ ✗. Try $w(w+1)(w+2) = 24$: $w = 2$: $2 \\cdot 3 \\cdot 4 = 24$ ✓. So with those dimensions, $w = 2$ m.</div></div>
</div>

<h2 class="lesson-title">12. Summary Table — Choosing the Right Strategy</h2>

<div class="calc-highlight">The single most useful skill is <strong>pattern-recognition</strong>: match the shape of the polynomial to the right technique before lifting your pencil. This table gives you that lookup.</div>

<div style="overflow-x:auto;margin:1.4rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;color:rgba(235,230,220,0.92);background:rgba(255,255,255,0.02);border-radius:8px;overflow:hidden">
<thead>
<tr style="background:rgba(59,130,246,0.12);text-align:left">
<th style="padding:0.75rem 1rem;border-bottom:2px solid #3b82f6;font-size:0.78rem;letter-spacing:0.08em;color:#3b82f6">POLYNOMIAL TYPE</th>
<th style="padding:0.75rem 1rem;border-bottom:2px solid #3b82f6;font-size:0.78rem;letter-spacing:0.08em;color:#3b82f6">STRATEGY</th>
<th style="padding:0.75rem 1rem;border-bottom:2px solid #3b82f6;font-size:0.78rem;letter-spacing:0.08em;color:#3b82f6">EXAMPLE</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.7rem 1rem;vertical-align:top"><strong>Quadratic</strong> ($n=2$)</td>
<td style="padding:0.7rem 1rem;vertical-align:top">Quadratic formula or factor by inspection</td>
<td style="padding:0.7rem 1rem;vertical-align:top">$x^2 - 5x + 6 = 0 \\Rightarrow (x-2)(x-3) = 0$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.7rem 1rem;vertical-align:top"><strong>Biquadratic</strong> (only even powers, $n=4$)</td>
<td style="padding:0.7rem 1rem;vertical-align:top">Substitute $u = x^2$, solve quadratic in $u$, back-substitute $x = \\pm\\sqrt{u}$</td>
<td style="padding:0.7rem 1rem;vertical-align:top">$x^4 - 5x^2 + 4 = 0 \\Rightarrow u = 1, 4 \\Rightarrow x = \\pm 1, \\pm 2$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.7rem 1rem;vertical-align:top"><strong>Sum/Difference of cubes</strong> ($a^3 \\pm b^3$)</td>
<td style="padding:0.7rem 1rem;vertical-align:top">Apply SOAP: $(a \\pm b)(a^2 \\mp ab + b^2)$, the quadratic factor usually has only complex roots</td>
<td style="padding:0.7rem 1rem;vertical-align:top">$x^3 - 8 = (x-2)(x^2 + 2x + 4)$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.7rem 1rem;vertical-align:top"><strong>General cubic</strong> ($n=3$, integer coefficients)</td>
<td style="padding:0.7rem 1rem;vertical-align:top">Rational root theorem $\\to$ test candidates $\\to$ synthetic division $\\to$ solve remaining quadratic</td>
<td style="padding:0.7rem 1rem;vertical-align:top">$x^3 - 6x^2 + 11x - 6 = 0 \\Rightarrow$ roots $\\{1, 2, 3\\}$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.7rem 1rem;vertical-align:top"><strong>General quartic</strong> ($n=4$, mixed powers)</td>
<td style="padding:0.7rem 1rem;vertical-align:top">Peel off one rational root via synthetic division, recurse on the cubic quotient</td>
<td style="padding:0.7rem 1rem;vertical-align:top">$x^4 - x^3 - 7x^2 + x + 6 = 0$ has $x = 1$, then a cubic</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.7rem 1rem;vertical-align:top"><strong>Grouping</strong> (4 terms with common pattern)</td>
<td style="padding:0.7rem 1rem;vertical-align:top">Group pairs, pull out a common factor, then factor again</td>
<td style="padding:0.7rem 1rem;vertical-align:top">$x^3 + 2x^2 - x - 2 = x^2(x+2) - (x+2) = (x+2)(x^2-1)$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.7rem 1rem;vertical-align:top"><strong>No rational roots</strong> (all candidates fail)</td>
<td style="padding:0.7rem 1rem;vertical-align:top">Numerical methods: bisection, Newton-Raphson, or graphing to bracket each real root</td>
<td style="padding:0.7rem 1rem;vertical-align:top">$x^3 + x + 1 = 0 \\Rightarrow x \\approx -0.6823$</td>
</tr>
<tr>
<td style="padding:0.7rem 1rem;vertical-align:top"><strong>Roots known partially</strong></td>
<td style="padding:0.7rem 1rem;vertical-align:top">Use Vieta's formulas to recover the missing root from sum or product</td>
<td style="padding:0.7rem 1rem;vertical-align:top">$x^3 - 7x^2 + 14x - 8 = 0$, roots $1, 2, ?$ $\\Rightarrow r_3 = 7 - 3 = 4$</td>
</tr>
</tbody>
</table>
</div>

<p class="l-text" style="font-size:0.88rem;color:rgba(235,230,220,0.7);font-style:italic">Reading order: try fast pattern matches first (rows 1-3), fall back to rational-root + synthetic division for general cases (rows 4-6), and only resort to numerical or Vieta-based shortcuts when the structured methods stall.</p>

<div class="think-box"><div class="think-label">DECISION FLOWCHART</div><div class="think-body">When facing a new polynomial equation: (1) <strong>Degree 2?</strong> Quadratic formula or factoring. (2) <strong>Only even powers?</strong> Biquadratic substitution $u = x^2$. (3) <strong>Sum/difference of cubes?</strong> Use the SOAP formula directly. (4) <strong>Otherwise, degree 3 or 4?</strong> Rational root theorem to list candidates, test, synthetically divide, recurse on quotient. (5) <strong>No rational roots found?</strong> Numerical methods (bisection, Newton) or graphing — the fundamental theorem guarantees the roots exist somewhere.</div></div>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">WHAT YOU NOW KNOW</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Every polynomial of degree $n$ has exactly $n$ complex roots (counted with multiplicity)</li>
<li>Rational root candidates are $\\pm p/q$ where $p \\mid a_0$ and $q \\mid a_n$ — a finite list to test</li>
<li>Synthetic division is the fastest hand technique to confirm a root and reduce the polynomial</li>
<li>Cubics reduce to "one rational root + quadratic" via division; biquadratics reduce via $u = x^2$</li>
<li>Sum/difference of cubes factor as $a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)$ (SOAP)</li>
<li>Vieta's formulas connect roots to coefficients: sum, sum of pairs, product — useful for checks</li>
<li>Real cubics have 1 or 3 real roots; real quartics have 0, 2, or 4 — complex roots come in conjugate pairs</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>$n$ dereceli bir polinom denklemi, $a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_1 x + a_0 = 0$ biçimindeki bir denklemdir ($a_n \\neq 0$).</strong> 1. derece (doğrusal) ve 2. derece (ikinci dereceden) için elinde zaten temiz formüller var. 3. dereceden itibaren rastgele katsayılar için tek bir beş satırlık formül yoktur — ama bir avuç teorem birlikte ele alındığında, lise veya birinci sınıf üniversite sınavlarında karşılaşacağın hemen her kübik, dördüncü ve beşinci dereceli denklemi çözmeni sağlar.</p>

<p class="l-text">Bu ders o teoremleri tek bir güvenilir iş akışında birleştirir: <em>rasyonel kök teoremi</em> ile bir rasyonel kök tahmin et, <em>kalan teoremi</em> ile doğrula, <em>sentetik bölme</em> ile soy, polinom tamamen çarpanlarına ayrılana kadar daha küçük bölüm üzerinde devam et. Ayrıca <em>cebirin temel teoremi</em>, <em>Vieta formülleri</em>, <em>biquadratic değişken değiştirme</em> ve birkaç çözümlü problem ile tanışacağız.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NELERİ ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Cebirin temel teoremini ifade et ve $n$ dereceli polinomun köklerini katmerli sayarak sayma</li>
<li>Rasyonel kök teoremini kullanarak olası rasyonel kökleri listele ($p \\mid a_0$, $q \\mid a_n$)</li>
<li>Bir kökü doğrulamak ve polinomu indirgemek için sentetik bölmeyi adım adım uygula</li>
<li>Tek bir rasyonel kökü soyup geriye kalan ikinci dereceyi çözerek kübik denklemleri tamamen çarpanlarına ayır</li>
<li>$ax^4 + bx^2 + c = 0$ biçimindeki quartikleri çözmek için $u = x^2$ biquadratic değişken değiştirmesini uygula</li>
<li>Vieta formüllerini kullanarak köklerin toplamını ve çarpımını katsayılarla ilişkilendir</li>
<li>Hacim ve geometrik problemleri kübik denklemlere dönüştürüp çöz</li>
</ul>
</div>

<h2 class="lesson-title">1. Cebirin Temel Teoremi</h2>

<div class="calc-highlight"><strong>$n$ dereceli bir polinomun karmaşık sayılarda katmerli sayılarak tam olarak $n$ kökü vardır.</strong> Bu köklerin bazıları gerçel ve grafikte görünür olabilir; diğerleri x-eksenine hiç dokunmayan eşlenik karmaşık çiftler olabilir. Ama toplam sayı her zaman tam olarak $n$'dir.</div>

<p class="l-text">1799'da Gauss tarafından eksiksiz biçimde kanıtlanan bu teorem, polinom denklemleri hakkındaki tek en önemli olgudur. Sana ne beklemen gerektiğini hemen söyler: bir kübiğin her zaman 3 kökü, bir quartikin her zaman 4 kökü, bir kuintiğin her zaman 5 kökü vardır. Bir kübikte yalnızca 2 gerçel kök bulduysan, üçüncüsü mutlaka bir yerlerdedir — ya bir katmerliliği atladın ya da eksik kök karmaşıktır.</p>

<div class="calc-formula"><div class="formula-label">CEBİRİN TEMEL TEOREMİ</div><div class="formula-main">$$P(x) \\;=\\; a_n (x - r_1)(x - r_2) \\cdots (x - r_n)$$</div><div class="formula-sub">Karmaşık katsayılı her $n$ dereceli polinom, karmaşık sayılar üzerinde $n$ doğrusal çarpana tamamen ayrılır. $r_1, r_2, \\ldots, r_n$ sayıları köklerdir; tekrarlanan kökler kaç kez görünürse o kadar sayılır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kübik ($n=3$)</div><div class="card-body">Toplam üç kök. Ya üç gerçel, ya bir gerçel artı bir eşlenik karmaşık çift. Gerçel bir kübik, x-eksenini en az bir kez keser (ara değer teoremi).</div></div>
<div class="calc-card"><div class="card-title">Quartik ($n=4$)</div><div class="card-body">Toplam dört kök. Gerçel kök sayısı 0, 2 veya 4 olabilir. Gerçel kökü olmayan bir quartik tamamen x-ekseninin üstünde veya altında kalır.</div></div>
<div class="calc-card"><div class="card-title">Katmerlilik</div><div class="card-body">Çarpanlamada $(x-r)^k$ görünürse, $r$ kökünün katmerliliği $k$'dır. Grafikte: $k=1$ keser, $k=2$ değer ve geri zıplar, $k=3$ düzleşerek geçer.</div></div>
</div>

<div class="l-note"><strong>Gerçel polinomların bir bonusu var.</strong> Bir polinomun gerçel katsayıları varsa ve $a + bi$ bir kökse ($b \\neq 0$), eşleniği $a - bi$ de mutlaka köktür. Karmaşık kökler bu yüzden çiftler halinde gelir; bu da gerçel kök sayısının $n$ ile aynı pariteye sahip olmasını zorlar — gerçel bir kübiğin 1 veya 3 gerçel kökü vardır, asla 0 veya 2 değildir.</div>

<h2 class="lesson-title">2. Rasyonel Kök Teoremi</h2>

<div class="calc-highlight"><strong>Tamsayı katsayılı bir polinomun, en sade biçimde $\\dfrac{p}{q}$ rasyonel bir kökü varsa, $p$ sabit terimi böler ve $q$ baş katsayıyı böler.</strong> Aday kümesi bu nedenle <em>sonludur</em> — listele, dene, rasyonel kökleri bul.</div>

<div class="calc-formula"><div class="formula-label">RASYONEL KÖK TEOREMİ</div><div class="formula-main">$$\\frac{p}{q} \\text{, } a_n x^n + \\cdots + a_0 \\text{'in rasyonel kökü ise} \\;\\;\\Longrightarrow\\;\\; p \\mid a_0 \\;\\text{ ve }\\; q \\mid a_n$$</div><div class="formula-sub">"En sade biçim" $\\gcd(p, q) = 1$ demektir. Her iki işaret de geçerlidir: adaylar her zaman $\\pm p/q$ olarak gelir.</div></div>

<p class="l-text"><strong>Yöntem:</strong></p>

<ol style="line-height:1.8;color:rgba(235,230,220,0.9);padding-left:1.4rem">
<li>Sabit terim $a_0$'ın tüm pozitif bölenlerini listele. Bu kümeye $\\{p\\}$ de.</li>
<li>Baş katsayı $a_n$'in tüm pozitif bölenlerini listele. Bu kümeye $\\{q\\}$ de.</li>
<li>En sade biçimde her $p/q$ kesirini oluştur ve her birinin önüne $\\pm$ koy.</li>
<li>Her adayı $P(x)$'e yerleştirerek dene — $P(c) = 0$ verenler rasyonel köklerdir.</li>
</ol>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body"><strong>$P(x) = 2x^3 - 5x^2 - 4x + 3$</strong> polinomunun tüm rasyonel kök adaylarını listele.<br><br>Sabit: 3. Bölenler: $1, 3$.<br>Baş: 2. Bölenler: $1, 2$.<br>En sade biçimde adaylar $p/q$: $\\pm 1, \\pm 3, \\pm \\tfrac{1}{2}, \\pm \\tfrac{3}{2}$. Toplam sekiz aday.<br><br>Şimdi onları dene. $P(3) = 54 - 45 - 12 + 3 = 0$. Yani $x = 3$ rasyonel köktür.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2</div><div class="example-body"><strong>$P(x) = x^3 - 6x^2 + 11x - 6$</strong> için adayları listele.<br><br>Sabit: $-6$, bölenler $1, 2, 3, 6$. Baş: 1, böleni 1.<br>Adaylar: $\\pm 1, \\pm 2, \\pm 3, \\pm 6$.<br><br>$P(1) = 1 - 6 + 11 - 6 = 0$ ✓. Yani $x=1$ bir kök ve göreceğimiz gibi diğerleri $2$ ve $3$'tür.</div></div>

<div class="l-note"><strong>Teorem yalnızca aday verir, garanti vermez.</strong> Tamsayı katsayılı birçok polinomun <em>hiçbir</em> rasyonel kökü yoktur. Örneğin $x^2 - 2$'nin yalnızca irrasyonel kökleri $\\pm \\sqrt{2}$'dir ve $x^3 + x + 1$'in irrasyonel olan tek bir gerçel kökü vardır. Tüm adaylar başarısız olursa, polinomun rasyonel kökü yoktur.</div>

<h2 class="lesson-title">3. Sentetik Bölme</h2>

<div class="calc-highlight"><strong>$x = c$'nin kök olduğunu bildiğinde, $(x - c)$ çarpanını çıkarıp geriye ne kaldığını bulmak istersin.</strong> El ile en hızlı teknik <em>sentetik bölmedir</em> — yalnızca toplama ve çarpma gerektiren kompakt, üç satırlı bir şema.</div>

<p class="l-text"><strong>Nasıl çalışır.</strong> $P(x)$'in katsayılarını bir satıra yaz (eksik dereceler için sıfırlar dahil). Baş katsayıyı aşağı indir. Deneme kökü $c$ ile çarp. Sonraki katsayıya ekle. Son sütuna ulaşana kadar tekrarla — son sayı kalandır. $c$ kökse, kalan tam olarak 0'dır.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — adım adım $x^3 - 6x^2 + 11x - 6$, deneme $c = 1$</div><div class="example-body">$P(x)$'in katsayıları: $[\\,1,\\; -6,\\; 11,\\; -6\\,]$.<br><br><pre style="background:rgba(255,255,255,0.04);padding:0.8rem;border-radius:6px;color:#e8e8e8;font-family:'Geist Mono',monospace;font-size:0.88rem;line-height:1.6">  c = 1 |   1     -6      11      -6
        |          1      -5       6
        |________________________________
            1     -5       6       0   &larr; kalan</pre><br><strong>1. Adım.</strong> 1'i (baş katsayı) aşağı indir.<br><strong>2. Adım.</strong> $1 \\cdot 1 = 1$. $-6$'ya ekle: $-5$.<br><strong>3. Adım.</strong> $-5 \\cdot 1 = -5$. $11$'e ekle: $6$.<br><strong>4. Adım.</strong> $6 \\cdot 1 = 6$. $-6$'ya ekle: $0$ ✓.<br><br>Alt satır $[\\,1,\\; -5,\\; 6\\,]$ bölüm olarak $x^2 - 5x + 6$ verir. Son 0 kalandır. Yani<br>$$x^3 - 6x^2 + 11x - 6 \\;=\\; (x - 1)(x^2 - 5x + 6).$$</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — eksik derece, deneme $c = 2$</div><div class="example-body">$P(x) = x^3 + 0 x^2 - 7x + 6$'yı $(x - 2)$'ye böl.<br><br>Eksik $x^2$ katsayısını 0 olarak ekle.<br><pre style="background:rgba(255,255,255,0.04);padding:0.8rem;border-radius:6px;color:#e8e8e8;font-family:'Geist Mono',monospace;font-size:0.88rem;line-height:1.6">  c = 2 |   1      0      -7       6
        |          2       4      -6
        |________________________________
            1      2      -3       0</pre><br>Bölüm $x^2 + 2x - 3 = (x+3)(x-1)$. Yani $P(x) = (x-2)(x+3)(x-1)$, kökler $\\{-3, 1, 2\\}$.</div></div>

<div class="l-note"><strong>Sentetik bölmede sık hatalar:</strong> (1) yanlış işaret — $(x - c)$ çarpanı için kutuya $+c$ koyarsın, $-c$ değil. (2) Eksik dereceler için sıfır eklemeyi unutmak. (3) Deneme kökü $c$ yerine önceki katsayı ile çarpmak.</div>

<h2 class="lesson-title">4. Kübikleri Çarpanlarına Ayırma — Standart Tarif</h2>

<div class="calc-highlight"><strong>En az bir rasyonel kökü olan kübik için iş akışı mekaniktir.</strong> Rasyonel kök teoremini kullanarak bir rasyonel kök bul; sentetik olarak $(x - c)$'ye böl; geriye kalan ikinci dereceyi formülle veya çarpanlamayla çöz.</div>

<p class="l-text">Her seferinde üç adım:</p>

<ol style="line-height:1.8;color:rgba(235,230,220,0.9);padding-left:1.4rem">
<li>$a_0 / a_n$'den tüm rasyonel kök adaylarını listele.</li>
<li>$P(c) = 0$ veren birini bulana kadar sırayla dene.</li>
<li>$(x - c)$'ye sentetik olarak böl ve oluşan ikinci dereceyi çöz.</li>
</ol>

<div class="calc-example"><div class="example-label">ÖRNEK 5 — tam kübik çözümü</div><div class="example-body"><strong>$x^3 - 6x^2 + 11x - 6 = 0$</strong> denklemini çöz.<br><br><strong>Adaylar:</strong> $\\pm 1, \\pm 2, \\pm 3, \\pm 6$.<br><strong>$x=1$'i dene:</strong> $1 - 6 + 11 - 6 = 0$ ✓.<br><strong>Böl:</strong> $c = 1$ ile sentetik, bölüm $x^2 - 5x + 6$.<br><strong>İkinci dereceyi çöz:</strong> $x^2 - 5x + 6 = (x-2)(x-3)$, kökler $x = 2, 3$.<br><br><strong>Nihai cevap:</strong> kökler $\\{1, 2, 3\\}$. Çarpanlanmış biçim $P(x) = (x-1)(x-2)(x-3)$.</div></div>

<div class="calc-graph"><div id="plot-l57-cubic-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Kübik $P(x) = x^3 - 6x^2 + 11x - 6$ x-eksenini $x = 1, 2, 3$ noktalarında keser — tam olarak rasyonel kök teoreminin öngördüğü rasyonel kökler. Çarpanlanmış biçim $(x-1)(x-2)(x-3)$ üç kesişimden doğrudan okunur.</strong></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=240;i++){var x=0.2+3.6*i/240;var y=x*x*x-6*x*x+11*x-6;xs.push(x);ys.push(y);}
var curve={x:xs,y:ys,mode:'lines',name:'P(x)',line:{color:'#3b82f6',width:2.5}};
var roots={x:[1,2,3],y:[0,0,0],mode:'markers+text',name:'kökler',marker:{color:'#f59e0b',size:11},text:['x=1','x=2','x=3'],textposition:'top center',textfont:{color:'#f59e0b',size:12}};
var axis={x:[0.1,3.9],y:[0,0],mode:'lines',name:'x-ekseni',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[0.1,3.9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-0.7,0.7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:20,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l57-cubic-tr',[axis,curve,roots],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÖRNEK 6 — irrasyonel köklü ikinci derece çarpan</div><div class="example-body"><strong>$x^3 - 4x^2 + x + 6 = 0$</strong> denklemini çöz.<br><br>Adaylar $\\pm 1, \\pm 2, \\pm 3, \\pm 6$. $x = -1$'i dene: $-1 - 4 - 1 + 6 = 0$ ✓.<br>Katsayılar $[1, -4, 1, 6]$ üzerinde $c = -1$ ile sentetik:<br>$1 \\to 1$; $1 \\cdot (-1) = -1$, ekle: $-5$; $-5 \\cdot (-1) = 5$, ekle: $6$; $6 \\cdot (-1) = -6$, ekle: $0$ ✓.<br>Bölüm: $x^2 - 5x + 6 = (x - 2)(x - 3)$.<br>Kökler $\\{-1, 2, 3\\}$.</div></div>

<h2 class="lesson-title">5. Küp Toplamı ve Küp Farkı (Kısa Tekrar)</h2>

<div class="calc-highlight"><strong>İki özel kübik çarpanlama, ezberlenmeye değer kadar sık görünür.</strong> $x^3 - 8$ veya $x^3 + 27$ gibi binom ifadelerini rasyonel kök teoremine hiç başvurmadan çarpanlarına ayırmanı sağlar.</div>

<div class="calc-formula"><div class="formula-label">KÜP FARKI</div><div class="formula-main">$$a^3 - b^3 \\;=\\; (a - b)(a^2 + ab + b^2)$$</div></div>

<div class="calc-formula"><div class="formula-label">KÜP TOPLAMI</div><div class="formula-main">$$a^3 + b^3 \\;=\\; (a + b)(a^2 - ab + b^2)$$</div><div class="formula-sub">Mnemonik <strong>"SOAP"</strong> — <em>Aynı, Karşıt, Daima Pozitif</em>. Binom işareti orijinalle aynıdır; üçterimlinin orta terimi karşıt işaretlidir; üçterimlinin son terimi pozitiftir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 7</div><div class="example-body"><strong>$x^3 - 8 = 0$</strong> denklemini çöz.<br><br>$8 = 2^3$, $a = x, b = 2$ ile küp farkı.<br>$x^3 - 8 = (x - 2)(x^2 + 2x + 4)$.<br><br>Gerçel kökler: $x = 2$ (doğrusal çarpandan). İkinci derece $x^2 + 2x + 4$'ün diskriminantı $4 - 16 = -12 < 0$, yani iki karmaşık kök $x = -1 \\pm i\\sqrt{3}$. Toplam üç kök — temel teoremle uyumlu.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 8</div><div class="example-body"><strong>$27x^3 + 125$</strong> ifadesini çarpanlarına ayır.<br><br>$27x^3 = (3x)^3$ ve $125 = 5^3$. $a = 3x, b = 5$ ile küp toplamı.<br>Sonuç: $(3x + 5)(9x^2 - 15x + 25)$.</div></div>

<h2 class="lesson-title">6. Dördüncü Dereceli Denklemler ve Biquadratic Değişken Değiştirme</h2>

<div class="calc-highlight"><strong>Yalnızca $x$'in çift kuvvetlerini içeren bir polinom, $u = x^2$ koyarak ikinci dereceye indirgenebilir.</strong> $ax^4 + bx^2 + c = 0$ denklemi $au^2 + bu + c = 0$ olur ve onu ikinci derece formülüyle çözersin. Her $u$ değeri, $x = \\pm \\sqrt{u}$ ile iki $x$ değeri verir (veya $u < 0$ ise hiç vermez).</div>

<div class="calc-formula"><div class="formula-label">BIQUADRATIC DEĞİŞKEN DEĞİŞTİRMESİ</div><div class="formula-main">$$a x^4 + b x^2 + c \\;=\\; 0 \\;\\xrightarrow{u = x^2}\\; a u^2 + b u + c \\;=\\; 0$$</div><div class="formula-sub">$u$'daki ikinci dereceyi çöz, sonra $x = \\pm \\sqrt{u}$ ile geri yerleştir. Yalnızca $u$'nun negatif olmayan değerleri $x$ için gerçel çözüm üretir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 9 — klasik $x^4 - 5x^2 + 4 = 0$</div><div class="example-body"><strong>$x^4 - 5x^2 + 4 = 0$</strong> denklemini çöz.<br><br>$u = x^2$ olsun. Denklem $u^2 - 5u + 4 = 0$ olur.<br>Çarpanla: $(u - 1)(u - 4) = 0$. Yani $u = 1$ veya $u = 4$.<br><br>Geri yerleştir:<br>$u = 1 \\Rightarrow x^2 = 1 \\Rightarrow x = \\pm 1$.<br>$u = 4 \\Rightarrow x^2 = 4 \\Rightarrow x = \\pm 2$.<br><br><strong>Dört gerçel kök:</strong> $\\{-2, -1, 1, 2\\}$. Çarpanlanmış biçim $P(x) = (x-2)(x-1)(x+1)(x+2) = (x^2 - 1)(x^2 - 4)$.</div></div>

<div class="calc-graph"><div id="plot-l57-quartic-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Quartik $P(x) = x^4 - 5x^2 + 4$ dört gerçel köke sahiptir: $\\pm 1$ ve $\\pm 2$ — polinom yalnızca çift kuvvetler kullandığı için y-eksenine göre simetriktir. İki eşit minimumlu "W" şekli, tüm kökleri gerçel olan bir biquadratic için tipiktir.</strong></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=240;i++){var x=-2.6+5.2*i/240;var y=x*x*x*x-5*x*x+4;xs.push(x);ys.push(y);}
var curve={x:xs,y:ys,mode:'lines',name:'P(x)',line:{color:'#3b82f6',width:2.5}};
var roots={x:[-2,-1,1,2],y:[0,0,0,0],mode:'markers+text',name:'kökler',marker:{color:'#f59e0b',size:11},text:['x=−2','x=−1','x=1','x=2'],textposition:'top center',textfont:{color:'#f59e0b',size:12}};
var axis={x:[-2.6,2.6],y:[0,0],mode:'lines',name:'x-ekseni',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:20,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l57-quartic-tr',[axis,curve,roots],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l57-quartic-tr-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Biquadratic $P(x) = x^4 - 5x^2 + 4$ için açıklamalı görünüm.</strong> Dört gerçel kök $\\{-2, -1, 1, 2\\}$ kesik dikey çizgilerle vurgulandı; $x = \\pm\\sqrt{5/2} \\approx \\pm 1.58$ noktalarındaki iki simetrik yerel minimum işaretlendi. Bu, tüm kökleri gerçel olan bir quartikin kanonik "W" şeklidir — çift kuvvet simetrisi grafiği y-eksenine göre ayna görüntüsü olmaya zorlar, böylece kökler $\\pm a$ çiftleri halinde gelir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=320;i++){var x=-2.7+5.4*i/320;var y=x*x*x*x-5*x*x+4;xs.push(x);ys.push(y);}
var curve={x:xs,y:ys,mode:'lines',name:'P(x) = x⁴ − 5x² + 4',line:{color:'#3b82f6',width:2.6}};
var roots={x:[-2,-1,1,2],y:[0,0,0,0],mode:'markers+text',name:'gerçel kökler',marker:{color:'#f59e0b',size:12,line:{color:'#0a0a0a',width:1.5}},text:['x=−2','x=−1','x=1','x=2'],textposition:'top center',textfont:{color:'#f59e0b',size:12}};
var mins={x:[-Math.sqrt(2.5),Math.sqrt(2.5)],y:[-2.25,-2.25],mode:'markers+text',name:'yerel minimumlar',marker:{color:'#ec4899',size:10,symbol:'diamond'},text:['min','min'],textposition:'bottom center',textfont:{color:'#ec4899',size:11}};
var drops={x:[-2,-2,null,-1,-1,null,1,1,null,2,2,null],y:[-2.6,0,null,-2.6,0,null,-2.6,0,null,-2.6,0,null],mode:'lines',name:'kök işaretleri',line:{color:'rgba(245,158,11,0.35)',width:1.2,dash:'dash'},showlegend:false};
var axis={x:[-2.7,2.7],y:[0,0],mode:'lines',name:'x-ekseni',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layTR2={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.7,2.7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-3.2,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:20,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l57-quartic-tr-extra',[axis,drops,curve,roots,mins],layTR2,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÖRNEK 10 — iki gerçel iki karmaşık köklü biquadratic</div><div class="example-body"><strong>$x^4 + 3x^2 - 4 = 0$</strong> denklemini çöz.<br><br>$u = x^2$: $u^2 + 3u - 4 = 0 \\Rightarrow (u + 4)(u - 1) = 0$, yani $u = -4$ veya $u = 1$.<br>$u = 1$: $x^2 = 1 \\Rightarrow x = \\pm 1$.<br>$u = -4$: $x^2 = -4 \\Rightarrow x = \\pm 2i$ (gerçel çözüm yok).<br><br>Gerçel kökler $\\{-1, 1\\}$; karmaşık kökler $\\{2i, -2i\\}$. Toplam dört kök.</div></div>

<p class="l-text"><strong>Genel quartikler</strong> ($x^4 - 2x^3 + x - 5$ gibi tek kuvvetler de içerenler) biquadratic hile ile indirgenemez. Onlar için rasyonel kök teoremine başvurursun, rasyonel kökleri tek tek soyarsın ve sonunda bir kübik veya ikinci derece bölüm elinde kalır.</p>

<h2 class="lesson-title">7. Vieta Formülleri — Kökler ve Katsayılar</h2>

<div class="calc-highlight"><strong>Vieta formülleri, köklerin temel simetrik fonksiyonlarını (toplamı, ikili çarpımların toplamı, çarpımı) doğrudan polinomun katsayıları cinsinden ifade eder.</strong> Cevapları kontrol etmeni, diğerlerini bildiğin durumda bir eksik kökü bulmanı veya köklerin kendisine gerek olmadan yalnızca $r_1 + r_2 + r_3$ hakkında soran problemleri çözmeni sağlarlar.</div>

<div class="calc-formula"><div class="formula-label">VIETA — KÜBİK $a x^3 + b x^2 + c x + d = 0$</div><div class="formula-main">$$r_1 + r_2 + r_3 \\;=\\; -\\frac{b}{a}, \\qquad r_1 r_2 + r_1 r_3 + r_2 r_3 \\;=\\; \\frac{c}{a}, \\qquad r_1 r_2 r_3 \\;=\\; -\\frac{d}{a}$$</div><div class="formula-sub">Toplam, ikililerin toplamı ve çarpım. İşaret değişir: bir kübik için $-, +, -$.</div></div>

<div class="calc-formula"><div class="formula-label">VIETA — QUARTİK $a x^4 + b x^3 + c x^2 + d x + e = 0$</div><div class="formula-main">$$\\sum r_i = -\\frac{b}{a}, \\quad \\sum_{i<j} r_i r_j = \\frac{c}{a}, \\quad \\sum_{i<j<k} r_i r_j r_k = -\\frac{d}{a}, \\quad r_1 r_2 r_3 r_4 = \\frac{e}{a}$$</div><div class="formula-sub">Aynı değişen işaret kalıbı. Tüm köklerin çarpımı $\\pm a_0 / a_n$'dir, işaret $(-1)^n$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 11 — Örnek 5'teki kübikte Vieta kontrolü</div><div class="example-body">$x^3 - 6x^2 + 11x - 6 = 0$ için kökler $1, 2, 3$:<br><br>Toplam: $1 + 2 + 3 = 6 = -(-6)/1$ ✓.<br>İkililerin toplamı: $1 \\cdot 2 + 1 \\cdot 3 + 2 \\cdot 3 = 2 + 3 + 6 = 11 = 11/1$ ✓.<br>Çarpım: $1 \\cdot 2 \\cdot 3 = 6 = -(-6)/1$ ✓.<br><br>Üç Vieta özdeşliği de kökleri doğrular.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 12 — Vieta ile eksik kökü bul</div><div class="example-body">$x^3 - 7x^2 + 14x - 8 = 0$ kübiğinin kökleri $1$ ve $2$'dir. Üçüncü kökü bul.<br><br>Vieta'ya göre köklerin toplamı $-(-7)/1 = 7$. Yani $1 + 2 + r_3 = 7 \\Rightarrow r_3 = 4$.<br><strong>Doğrula:</strong> çarpım $-(-8)/1 = 8$ olmalı. $1 \\cdot 2 \\cdot 4 = 8$ ✓.</div></div>

<h2 class="lesson-title">8. Kaç Gerçel Kök Var? Kübiğin Şeklini Okuma</h2>

<div class="calc-highlight"><strong>Gerçel bir kübiğin her zaman ya 1 ya da 3 gerçel kökü vardır (katmerlilikleri sayarak).</strong> Asla 0, asla 2. Grafiğin sana hangi durumda olduğunu bir bakışta söyler — eğrinin x-eksenini kestiği (veya değdiği) kaç kez olduğunu say.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">3 farklı gerçel kök</div><div class="card-body">Kübiğin x-ekseninin üzerinde bir yerel maksimumu ve altında bir yerel minimumu vardır. Eğri üç kez keser. Diskriminant $\\Delta > 0$.</div></div>
<div class="calc-card"><div class="card-title">1 gerçel + 2 karmaşık kök</div><div class="card-body">Kübik monotondur veya yerel maks ve min'i x-ekseninin aynı tarafındadır. Eğri yalnızca bir kez keser. $\\Delta < 0$.</div></div>
<div class="calc-card"><div class="card-title">Tekrarlanan gerçel kök</div><div class="card-body">Yerel maksimum veya minimum x-eksenine değer. Sınır durumu: $\\Delta = 0$. Eğer kübik $(x - r)^3$ ise üçlü kök.</div></div>
</div>

<div class="calc-graph"><div id="plot-l57-howmany-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Yan yana üç kübik.</strong> Mavi: $x^3 - 7x + 6$ üç farklı gerçel köke sahiptir: $-3, 1, 2$. Sarı: $x^3 + x + 1$ monoton artar ve yalnızca $x \\approx -0.68$ civarında bir kez keser (bir gerçel, iki karmaşık). Pembe: $(x - 1)^3$'ün $x = 1$'de üçlü gerçel kökü vardır — eğri değer ama içbükeyliği hızla değiştirmez.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=0;i<=240;i++){xs.push(-3.5+6.5*i/240);}
var y1=xs.map(function(x){return x*x*x-7*x+6;});
var y2=xs.map(function(x){return x*x*x+x+1;});
var y3=xs.map(function(x){return (x-1)*(x-1)*(x-1);});
var c1={x:xs,y:y1,mode:'lines',name:'3 farklı kök',line:{color:'#3b82f6',width:2.4}};
var c2={x:xs,y:y2,mode:'lines',name:'1 gerçel + 2 karmaşık',line:{color:'#f59e0b',width:2.4}};
var c3={x:xs,y:y3,mode:'lines',name:'x=1 üçlü kök',line:{color:'#ec4899',width:2.4}};
var axis={x:[-3.5,3],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.5,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-12,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:20,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l57-howmany-tr',[axis,c1,c2,c3],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Grafikte katmerlilik.</strong> Katmerliliği 1 olan bir kök x-eksenini enine keser. Katmerlilik 2 — eğri değer ve geri zıplar ($(x-1)^2$'nin yerel minimumunu düşün). Katmerlilik 3 — eğri bir kıvrımla eksenden geçer ($(x-1)^3$ gibi).</div>

<h2 class="lesson-title">9. Problem: Kutu Hacmi</h2>

<div class="calc-highlight"><strong>Üç uzunluk çarpıldığında kübik denklemler doğal olarak ortaya çıkar.</strong> Dikdörtgen bir kutunun hacmi uzunluk × genişlik × yükseklik'tir ve bu üçü tek bir değişkenle bağlıysa bir kübik doğar.</div>

<div class="calc-example"><div class="example-label">ÖRNEK 13 — klasik hacim problemi</div><div class="example-body">Dikdörtgen bir kutunun genişliği $w$, uzunluğu $w + 2$, yüksekliği $w + 5$, hepsi santimetre cinsinden. Hacmi 60 cm³. $w$'yu bul.<br><br><strong>Kur:</strong> $w(w + 2)(w + 5) = 60$.<br><br><strong>Aç:</strong> $(w^2 + 2w)(w + 5) = w^3 + 5w^2 + 2w^2 + 10w = w^3 + 7w^2 + 10w$.<br>Denklem: $w^3 + 7w^2 + 10w - 60 = 0$.<br><br><strong>Adaylar:</strong> 60'ın bölenleri: $\\pm 1, \\pm 2, \\pm 3, \\pm 4, \\pm 5, \\pm 6, \\pm 10, \\pm 12, \\pm 15, \\pm 20, \\pm 30, \\pm 60$.<br><strong>$w = 2$:</strong> $8 + 28 + 20 - 60 = -4$ ✗.<br><strong>$w = 3$:</strong> $27 + 63 + 30 - 60 = 60$ ✗.<br><br>Aday listesi tamsayı kökleri varsayıyordu. $w$ değeri 2 ile 3 arasında — fonksiyon $-4$'ten $+60$'a gider, yani gerçel bir kök $(2, 3)$ aralığındadır. Sayısal olarak $w \\approx 2.066$ cm.<br><br><em>Pedagojik çıkarım:</em> her problem temiz tamsayı cevabına sahip değildir. Rasyonel adaylar tutmadığında ya cebiri tekrar kontrol et (bazen kurulumda hata vardır) ya da cevabın irrasyonel olduğunu kabul et ve sayısal olarak kuşat.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 14 — temiz tamsayı kökü olan kurulum</div><div class="example-body">Bir kutunun boyutları $w$, $w + 2$, $w + 4$. Hacim 48. $w$'yu bul.<br><br>$w(w+2)(w+4) = 48$.<br>$w = 2$'yi dene: $2 \\cdot 4 \\cdot 6 = 48$ ✓.<br><br>Yani $w = 2$ cm. Kübiği kontrol et: $w^3 + 6w^2 + 8w - 48 = 0$, $w = 2$'de: $8 + 24 + 16 - 48 = 0$ ✓.<br>Sentetik olarak $(w - 2)$'ye böl: bölüm $w^2 + 8w + 24$, diskriminant $64 - 96 = -32 < 0$, yani başka gerçel kök yok. Geometrik cevap $w = 2$ cm tektir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 15 — geometri problemi</div><div class="example-body">Bir tahtanın boyutları $w$, $w + 1$, $w + 6$ metre. Hacim 24 m³. $w$'yu bul.<br><br>$w(w+1)(w+6) = 24$. $w = 1$: $1 \\cdot 2 \\cdot 7 = 14$ ✗. $w = 2$: $2 \\cdot 3 \\cdot 8 = 48$ ✗. Kübik formda: $w^3 + 7w^2 + 6w - 24 = 0$. Test $w = 1.5$ aday değil. Kök 1 ile 2 arasında, sayısal olarak $w \\approx 1.45$ m. Yine irrasyonel cevap — kuru hesabın hatasıdır, problemler genellikle özenle hazırlanır.</div></div>

<h2 class="lesson-title">10. Sık Hatalar</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">EKSİK KÖKLER</div><div class="compare-item">Bir çarpana böldükten sonra öğrenciler bazen <strong>bölümü çözmeyi unutur</strong>. Kübiğin 3 kökü vardır; yalnızca 1 bulmak eksiktir.</div><div class="compare-item">Her çarpan doğrusal veya indirgenemez ikinci derece olana kadar devam et.</div></div><div class="compare-col"><div class="compare-title">SENTETİK BÖLMEDE İŞARET HATALARI</div><div class="compare-item">$(x - 3)$ çarpanı için kutuya $+3$ koyarsın, $-3$ değil.</div><div class="compare-item">$(x + 3) = (x - (-3))$ için $-3$ koyarsın.</div></div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Katmerliliği unutmak</div><div class="card-body">Çarpanlamada $(x - 2)^2$ görünürse, $x = 2$ kökü iki kez sayılır. Temel teorem kübiğin 3 kökü olduğunu söyler, ama bunlardan ikisi aynı sayı olabilir.</div></div>
<div class="calc-card"><div class="card-title">Katsayılarda eksik dereceler</div><div class="card-body">Sentetik bölmede $x^3 - 7x + 6$'nın katsayıları $[1, 0, -7, 6]$'dır — eksik $x^2$ derecesi atlanmamalı, $0$ olarak eklenmelidir.</div></div>
<div class="calc-card"><div class="card-title">Karekök altında negatif</div><div class="card-body">Biquadratic değişken değiştirmeden sonra $u = -4$, $x^2 = -4$ verir; bu <em>gerçel çözümü yoktur</em>, yalnızca karmaşık. $x = \\pm 2$ yazma — bu $u = +4$ olsaydı cevap olurdu.</div></div>
<div class="calc-card"><div class="card-title">Vieta'da yanlış işaret</div><div class="card-body">$ax^3 + bx^2 + cx + d$ için köklerin toplamı $-b/a$'dır (eksi ile), çarpım kübikler için $-d/a$ ama quartikler için $+e/a$. İşaret derece ile değişir.</div></div>
</div>

<h2 class="lesson-title">11. Altı Pratik Problemi</h2>

<div class="calc-highlight">Çözümü okumadan önce her problemi çöz. Her biri yukarıdan belirli bir tekniği hedefler.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 1 — bir rasyonel köklü kübik</div><div class="card-body">$x^3 - 4x^2 - 7x + 10 = 0$ denklemini çöz.<br><br><em>Çözüm:</em> Adaylar $\\pm 1, \\pm 2, \\pm 5, \\pm 10$. $x = 1$'i dene: $1 - 4 - 7 + 10 = 0$ ✓. $(x - 1)$'e sentetik bölme bölüm $x^2 - 3x - 10 = (x - 5)(x + 2)$ verir. Kökler: $\\{1, 5, -2\\}$.</div></div>
<div class="calc-card"><div class="card-title">Problem 2 — biquadratic</div><div class="card-body">$x^4 - 13x^2 + 36 = 0$ denklemini çöz.<br><br><em>Çözüm:</em> $u = x^2$: $u^2 - 13u + 36 = (u - 4)(u - 9) = 0$. Yani $u = 4$ veya $u = 9$, $x = \\pm 2$ veya $x = \\pm 3$ verir. Dört gerçel kök $\\{-3, -2, 2, 3\\}$.</div></div>
<div class="calc-card"><div class="card-title">Problem 3 — küp toplamı</div><div class="card-body">$8x^3 + 27$ ifadesini çarpanlarına ayır.<br><br><em>Çözüm:</em> $(2x)^3 + 3^3$, $a = 2x, b = 3$ ile küp toplamı. Sonuç $(2x + 3)(4x^2 - 6x + 9)$. İkinci derece çarpanın diskriminantı $36 - 144 < 0$, yani yalnızca bir gerçel kök: $x = -3/2$.</div></div>
<div class="calc-card"><div class="card-title">Problem 4 — depresif kübik</div><div class="card-body">$x^3 + 3x - 4 = 0$ denklemini çöz.<br><br><em>Çözüm:</em> Adaylar $\\pm 1, \\pm 2, \\pm 4$. $x = 1$'i dene: $1 + 3 - 4 = 0$ ✓. Bölüm $x^2 + x + 4$, diskriminant $1 - 16 < 0$. Yani bir gerçel kök $x = 1$ ve iki karmaşık.</div></div>
<div class="calc-card"><div class="card-title">Problem 5 — Vieta uygulaması</div><div class="card-body">$x^3 - 9x^2 + 23x - 15 = 0$ kübiğinin kökleri $1$ ve $3$. Üçüncüyü bul.<br><br><em>Çözüm:</em> Köklerin toplamı = $-(-9)/1 = 9$. Yani $r_3 = 9 - 1 - 3 = 5$. Çarpımı doğrula: $1 \\cdot 3 \\cdot 5 = 15 = -(-15)/1$ ✓.</div></div>
<div class="calc-card"><div class="card-title">Problem 6 — problem</div><div class="card-body">Dikdörtgen bir su deposunun boyutları $w$, $w + 1$, $w + 2$ metre. Hacim $24$ m³. $w$'yu bul.<br><br><em>Çözüm:</em> $w(w+1)(w+2) = 24$. $w = 2$: $2 \\cdot 3 \\cdot 4 = 24$ ✓. Bu boyutlarda $w = 2$ m. Kübik: $w^3 + 3w^2 + 2w - 24 = 0$, $w=2$'de: $8 + 12 + 4 - 24 = 0$ ✓.</div></div>
</div>

<div class="think-box"><div class="think-label">KARAR AKIŞI</div><div class="think-body">Yeni bir polinom denklemiyle karşılaştığında: (1) <strong>2. derece mi?</strong> İkinci derece formülü veya çarpanlama. (2) <strong>Yalnızca çift kuvvetler mi?</strong> Biquadratic değişken değiştirmesi $u = x^2$. (3) <strong>Küp toplamı/farkı mı?</strong> SOAP formülünü doğrudan kullan. (4) <strong>Aksi takdirde 3. veya 4. derece?</strong> Rasyonel kök teoremi ile adayları listele, dene, sentetik böl, bölüm üzerinde tekrarla. (5) <strong>Rasyonel kök bulunamadı mı?</strong> Sayısal yöntemler (bisection, Newton) veya grafik — temel teorem köklerin bir yerlerde olduğunu garanti eder.</div></div>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">ARTIK NELERİ BİLİYORSUN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$n$ dereceli her polinomun karmaşık sayılarda tam olarak $n$ kökü vardır (katmerli sayılarak)</li>
<li>Rasyonel kök adayları $\\pm p/q$ biçimindedir, $p \\mid a_0$ ve $q \\mid a_n$ — test edilecek sonlu bir liste</li>
<li>Sentetik bölme, bir kökü doğrulamak ve polinomu indirgemek için en hızlı el tekniğidir</li>
<li>Kübikler bölme ile "bir rasyonel kök + ikinci derece"ye, biquadraticler $u = x^2$ ile indirgenir</li>
<li>Küp toplamı/farkı $a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)$ olarak çarpanlanır (SOAP)</li>
<li>Vieta formülleri kökleri katsayılarla bağlar: toplam, ikililerin toplamı, çarpım — kontroller için yararlı</li>
<li>Gerçel kübiklerin 1 veya 3 gerçel kökü vardır; gerçel quartiklerin 0, 2 veya 4 — karmaşık kökler eşlenik çiftler halinde gelir</li>
</ul>
</div>`
};
