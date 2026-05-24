window.LISE_MAT_L65 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Imagine you had to write out the sum</strong> $1 + 2 + 3 + \\cdots + 100$ on a piece of paper. The dots in the middle are doing a lot of work — they tell the reader "keep going in the obvious pattern until you reach 100". For three or four terms this is fine. For thousands of terms, it becomes painful. For sums that appear inside larger formulas — like the average of a list, the variance of a sample, or the area under a curve — we need a shorthand that can be manipulated algebraically.</p>

<p class="l-text">That shorthand is the Greek capital letter sigma, $\\Sigma$. By the end of this lesson you will read sigma notation as fluently as a sentence, know the four standard closed-form sums by heart, recognise telescoping patterns, and apply the formulas for arithmetic and geometric series in a single line. These tools turn pages of arithmetic into a few symbols and a tidy algebraic step.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read and write the sigma notation $\\sum_{k=1}^{n} a_k$ — index, bounds, summand, dummy variable</li>
<li>Memorise the four basic closed forms: $\\sum 1$, $\\sum k$, $\\sum k^2$, $\\sum k^3$</li>
<li>Apply the linearity property $\\sum (a_k + b_k) = \\sum a_k + \\sum b_k$ and $\\sum c \\, a_k = c \\sum a_k$</li>
<li>Use the closed-form sums for arithmetic and geometric series in one step</li>
<li>Spot telescoping patterns where most terms cancel, leaving only the first and last</li>
<li>Avoid the two classic mistakes: off-by-one index errors and dropping the $(n+1)$ factor</li>
</ul>
</div>

<h2 class="lesson-title">1. From Three Dots to Sigma Notation</h2>

<div class="calc-highlight"><strong>The notation is one symbol that does the work of an entire sentence.</strong> $\\sum_{k=1}^{n} a_k$ means "add up the values $a_k$ as $k$ runs from $1$ to $n$, one integer at a time". The capital sigma $\\Sigma$ is just the Greek letter S — the same S as in "Sum".</div>

<p class="l-text">Read every sigma expression as four pieces, in this exact order. First, the <strong>dummy index</strong> below the sigma (here $k$) — the name of the variable that will step from one value to the next. Second, the <strong>lower bound</strong> ($k = 1$) — the starting value. Third, the <strong>upper bound</strong> on top ($n$) — the final value. Fourth, the <strong>summand</strong> $a_k$ to the right of the sigma — the expression that produces each term.</p>

<div class="calc-formula"><div class="formula-label">SIGMA NOTATION — ANATOMY</div><div class="formula-main">$$\\sum_{k=1}^{n} a_k \\;=\\; a_1 + a_2 + a_3 + \\cdots + a_n$$</div><div class="formula-sub">$k$ is the dummy index; $1$ is the lower bound; $n$ is the upper bound; $a_k$ is the summand.</div></div>

<p class="l-text"><strong>The index is "dummy" because the name does not matter.</strong> $\\sum_{k=1}^{n} a_k$, $\\sum_{i=1}^{n} a_i$, and $\\sum_{j=1}^{n} a_j$ all denote exactly the same sum. The letter is a placeholder — you can rename it freely the way you can rename the variable inside a function definition. Once the sum is expanded, the dummy disappears altogether.</p>

<div class="calc-example"><div class="example-label">EXPANSION EXAMPLE</div><div class="example-body">Expand $\\displaystyle\\sum_{k=1}^{5} k^2$.<br><br>The summand is $k^2$. Substitute $k = 1, 2, 3, 4, 5$ in order and add:<br><br>$1^2 + 2^2 + 3^2 + 4^2 + 5^2 = 1 + 4 + 9 + 16 + 25 = \\mathbf{55}$.</div></div>

<div class="calc-example"><div class="example-label">EXPANSION EXAMPLE</div><div class="example-body">Expand $\\displaystyle\\sum_{k=2}^{6} (2k - 1)$.<br><br>Substitute $k = 2, 3, 4, 5, 6$:<br><br>$(2 \\cdot 2 - 1) + (2 \\cdot 3 - 1) + (2 \\cdot 4 - 1) + (2 \\cdot 5 - 1) + (2 \\cdot 6 - 1)$<br>$= 3 + 5 + 7 + 9 + 11 = \\mathbf{35}$.</div></div>

<div class="l-note"><strong>Index conventions.</strong> The lower bound need not be $1$. We often start from $0$ (especially for geometric series, where $r^0 = 1$ is the natural first term), and sometimes from a negative integer. Whatever the lower bound, the index always increases by $1$ at each step.</div>

<h2 class="lesson-title">2. The Four Standard Closed Forms</h2>

<div class="calc-highlight"><strong>Some sums are so common that we keep their closed forms in working memory.</strong> A "closed form" is an exact formula in $n$ — no dots, no sigma, no recursion. The four below cover an enormous fraction of the sums you will ever meet.</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">2.1 The sum of $n$ ones</h3>

<div class="calc-formula"><div class="formula-label">SUM OF ONES</div><div class="formula-main">$$\\sum_{k=1}^{n} 1 \\;=\\; \\underbrace{1 + 1 + \\cdots + 1}_{n \\text{ terms}} \\;=\\; n$$</div><div class="formula-sub">Adding the number $1$ to itself $n$ times gives $n$. Trivial but used constantly inside longer derivations.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">2.2 The sum of the first $n$ integers (Gauss)</h3>

<p class="l-text">The story is told often, but it is worth telling once more because it gives the proof. The young Gauss (age 8 or 9, depending on the version) was set the busy-work task of adding $1 + 2 + \\cdots + 100$. He noticed that if you write the sum forward and backward and add column by column,</p>

<div class="calc-formula"><div class="formula-label">GAUSS'S TRICK</div><div class="formula-main">$$\\begin{aligned} S \\;&=\\; 1 + 2 + 3 + \\cdots + 100 \\\\ S \\;&=\\; 100 + 99 + 98 + \\cdots + 1 \\\\ \\hline 2S \\;&=\\; 101 + 101 + 101 + \\cdots + 101 \\;=\\; 100 \\cdot 101 \\end{aligned}$$</div><div class="formula-sub">Each pair sums to $101$, and there are $100$ pairs. So $S = \\frac{100 \\cdot 101}{2} = 5050$.</div></div>

<p class="l-text">The same argument with $n$ in place of $100$ gives the general formula:</p>

<div class="calc-formula"><div class="formula-label">SUM OF FIRST $n$ INTEGERS</div><div class="formula-main">$$\\sum_{k=1}^{n} k \\;=\\; \\frac{n(n+1)}{2}$$</div><div class="formula-sub">Also called the $n$-th triangular number $T_n$. The $(n+1)$ factor is the single most common dropped piece — always double-check it is there.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">2.3 The sum of the first $n$ squares</h3>

<div class="calc-formula"><div class="formula-label">SUM OF FIRST $n$ SQUARES</div><div class="formula-main">$$\\sum_{k=1}^{n} k^2 \\;=\\; \\frac{n(n+1)(2n+1)}{6}$$</div><div class="formula-sub">Three factors on top, divided by $6$. Quick sanity check: $n = 1$ gives $\\frac{1 \\cdot 2 \\cdot 3}{6} = 1$, which matches $1^2 = 1$.</div></div>

<p class="l-text">A quick check at $n = 4$: $1 + 4 + 9 + 16 = 30$, and the formula gives $\\frac{4 \\cdot 5 \\cdot 9}{6} = \\frac{180}{6} = 30$. Perfect.</p>

<h3 style="color:#3b82f6;margin-top:1.4rem">2.4 The sum of the first $n$ cubes</h3>

<div class="calc-formula"><div class="formula-label">SUM OF FIRST $n$ CUBES</div><div class="formula-main">$$\\sum_{k=1}^{n} k^3 \\;=\\; \\left[\\frac{n(n+1)}{2}\\right]^2 \\;=\\; \\left(\\sum_{k=1}^{n} k\\right)^2$$</div><div class="formula-sub">A beautiful identity: the sum of the first $n$ cubes equals the <em>square</em> of the sum of the first $n$ integers.</div></div>

<p class="l-text">Check at $n = 3$: $1^3 + 2^3 + 3^3 = 1 + 8 + 27 = 36$, and $\\left[\\frac{3 \\cdot 4}{2}\\right]^2 = 6^2 = 36$. The relationship is sometimes called Nicomachus's theorem and has been known since the first century.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\sum 1$</div><div class="card-body">$n$. Memorise as "one added $n$ times is $n$".</div></div>
<div class="calc-card"><div class="card-title">$\\sum k$</div><div class="card-body">$\\frac{n(n+1)}{2}$. Triangular number, Gauss's trick.</div></div>
<div class="calc-card"><div class="card-title">$\\sum k^2$</div><div class="card-body">$\\frac{n(n+1)(2n+1)}{6}$. Three factors, divided by $6$.</div></div>
<div class="calc-card"><div class="card-title">$\\sum k^3$</div><div class="card-body">$\\left[\\frac{n(n+1)}{2}\\right]^2$. Square of the triangle sum.</div></div>
</div>

<div class="calc-graph"><div id="plot-l65-partial-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the partial sums $S_n = 1 + 2 + \\cdots + n$ plotted as bars against $n$. The growth is quadratic — the bar heights follow the curve $n(n+1)/2$, which rises roughly as $n^2/2$. The first ten partial sums are $1, 3, 6, 10, 15, 21, 28, 36, 45, 55$ (the triangular numbers).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nsA=[];var ssA=[];for(var i=1;i<=20;i++){nsA.push(i);ssA.push(i*(i+1)/2);}
var bars={x:nsA,y:ssA,type:'bar',name:'partial sum',marker:{color:'#3b82f6'}};
var nsC=[];var ssC=[];for(var j=0;j<=200;j++){var nv=j/200*20;nsC.push(nv);ssC.push(nv*(nv+1)/2);}
var curve={x:nsC,y:ssC,mode:'lines',name:'n(n+1)/2',line:{color:'#f59e0b',width:2.5,dash:'dot'}};
var layA={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'S_n = 1 + 2 + ... + n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l65-partial-en',[bars,curve],layA,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Two Properties: Linearity</h2>

<div class="calc-highlight"><strong>Sigma sums are linear.</strong> That single word packages two rules that you will use in every problem from now on: you can split a sigma over a $+$ or $-$, and you can pull a constant multiplier outside.</div>

<div class="calc-formula"><div class="formula-label">LINEARITY OF SIGMA</div><div class="formula-main">$$\\sum_{k=1}^{n} (a_k + b_k) \\;=\\; \\sum_{k=1}^{n} a_k + \\sum_{k=1}^{n} b_k \\qquad \\sum_{k=1}^{n} c \\, a_k \\;=\\; c \\sum_{k=1}^{n} a_k$$</div><div class="formula-sub">Splitting and constant-pulling. Both rules let you reduce a complicated summand to a combination of the four standard closed forms.</div></div>

<p class="l-text">The proofs are one line each — they follow from the associative and distributive laws of addition. The first rule says: regrouping pairs $(a_k + b_k)$ into all the $a$'s first and then all the $b$'s does not change the total. The second rule says: a common factor $c$ in every term can come out front of the sum.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Compute $\\displaystyle\\sum_{k=1}^{10} (3k + 2)$ without expanding term by term.<br><br>Use linearity to split and pull constants:<br>$\\displaystyle\\sum_{k=1}^{10} (3k + 2) = 3\\sum_{k=1}^{10} k + \\sum_{k=1}^{10} 2 = 3 \\cdot \\frac{10 \\cdot 11}{2} + 2 \\cdot 10$<br><br>$= 3 \\cdot 55 + 20 = 165 + 20 = \\mathbf{185}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Compute $\\displaystyle\\sum_{k=1}^{20} k^2$.<br><br>Direct application of the closed form with $n = 20$:<br><br>$\\sum_{k=1}^{20} k^2 = \\frac{20 \\cdot 21 \\cdot 41}{6} = \\frac{17220}{6} = \\mathbf{2870}$.<br><br>Try checking on a calculator that $1^2 + 2^2 + \\cdots + 20^2$ really is $2870$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Compute $\\displaystyle\\sum_{k=1}^{5} (k^2 + 4k + 1)$.<br><br>Split into three pieces using linearity:<br><br>$\\sum k^2 + 4\\sum k + \\sum 1 = \\frac{5 \\cdot 6 \\cdot 11}{6} + 4 \\cdot \\frac{5 \\cdot 6}{2} + 5 = 55 + 60 + 5 = \\mathbf{120}$.</div></div>

<h2 class="lesson-title">4. Arithmetic Series</h2>

<div class="calc-highlight"><strong>An arithmetic series is a sum of terms whose successive differences are constant.</strong> $2 + 5 + 8 + 11 + 14$ is arithmetic because the gap from each term to the next is the same number $3$. That constant gap is the common difference $d$.</div>

<p class="l-text">If the first term is $a_1$ and the common difference is $d$, the $k$-th term is $a_k = a_1 + (k-1)d$. The sum of the first $n$ terms uses Gauss's pairing argument: write the sum forward and backward, add column by column, and notice that each column gives $a_1 + a_n$.</p>

<div class="calc-formula"><div class="formula-label">ARITHMETIC SERIES — SUM</div><div class="formula-main">$$S_n \\;=\\; \\sum_{k=1}^{n} \\big[a_1 + (k-1)d\\big] \\;=\\; \\frac{n(a_1 + a_n)}{2}$$</div><div class="formula-sub">$n$ terms, average of the first and last, times the number of terms — divided by $2$.</div></div>

<p class="l-text">An equivalent form, useful when you only know $a_1, d, n$ and want to avoid computing $a_n$ separately:</p>

<div class="calc-formula"><div class="formula-label">ARITHMETIC SERIES — ALTERNATIVE FORM</div><div class="formula-main">$$S_n \\;=\\; \\frac{n}{2}\\big[2a_1 + (n-1)d\\big]$$</div><div class="formula-sub">Same formula, with $a_n = a_1 + (n-1)d$ substituted in directly.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Sum the arithmetic series $2 + 5 + 8 + 11 + \\cdots + 59$.<br><br>First find $n$. With $a_1 = 2$ and $d = 3$, the $n$-th term is $a_n = 2 + 3(n-1) = 3n - 1$. Set $3n - 1 = 59$ so $n = 20$.<br><br>Now apply the formula:<br>$S_{20} = \\frac{20 (2 + 59)}{2} = 10 \\cdot 61 = \\mathbf{610}$.</div></div>

<h2 class="lesson-title">5. Geometric Series</h2>

<div class="calc-highlight"><strong>A geometric series is a sum of terms whose successive ratios are constant.</strong> $1 + 2 + 4 + 8 + 16$ is geometric because each term is twice the previous; the constant ratio is $r = 2$.</div>

<p class="l-text">If the first term is $a_1$ and the common ratio is $r$, the $k$-th term is $a_k = a_1 r^{k-1}$. A clever trick gives the closed form: write $S_n = a_1 + a_1 r + a_1 r^2 + \\cdots + a_1 r^{n-1}$, then multiply both sides by $r$ to get $rS_n = a_1 r + a_1 r^2 + \\cdots + a_1 r^n$. Subtract: every middle term cancels, leaving $S_n - rS_n = a_1 - a_1 r^n$, so $S_n(1 - r) = a_1(1 - r^n)$.</p>

<div class="calc-formula"><div class="formula-label">GEOMETRIC SERIES — SUM</div><div class="formula-main">$$S_n \\;=\\; \\sum_{k=1}^{n} a_1 r^{k-1} \\;=\\; \\frac{a_1(1 - r^n)}{1 - r} \\;=\\; \\frac{a_1(r^n - 1)}{r - 1} \\qquad (r \\neq 1)$$</div><div class="formula-sub">Both forms are equivalent — pick the one whose denominator is positive for cleaner arithmetic. If $r = 1$ the series is just $n a_1$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Compute $\\displaystyle 1 + \\frac{1}{2} + \\frac{1}{4} + \\cdots + \\frac{1}{2^9}$.<br><br>This is geometric with $a_1 = 1$, $r = \\frac{1}{2}$, $n = 10$ (the terms are $r^0$ through $r^9$).<br><br>$S_{10} = \\dfrac{1 \\cdot \\left(1 - (1/2)^{10}\\right)}{1 - 1/2} = \\dfrac{1 - 1/1024}{1/2} = 2 \\cdot \\dfrac{1023}{1024} = \\mathbf{\\dfrac{1023}{512}} \\approx 1.998$.</div></div>

<div class="l-note"><strong>Where this hides in real life:</strong> compound interest, exponential decay of a drug in the bloodstream, the geometric distribution in probability, the area under the staircase approximation of an exponential function. Geometric sums are everywhere.</div>

<div class="calc-graph"><div id="plot-l65-compare-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two growth curves for the partial sums $\\sum_{k=1}^{n} k$ (linear sum) and $\\sum_{k=1}^{n} k^2$ (quadratic sum) on the same axes. The cubic-style growth of $\\sum k^2$ dwarfs the quadratic growth of $\\sum k$ very quickly — by $n = 20$, $\\sum k = 210$ but $\\sum k^2 = 2870$, more than ten times larger.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nsB=[];var lin=[];var quad=[];for(var i=1;i<=25;i++){nsB.push(i);lin.push(i*(i+1)/2);quad.push(i*(i+1)*(2*i+1)/6);}
var t1={x:nsB,y:lin,mode:'lines+markers',name:'Σ k',line:{color:'#3b82f6',width:3},marker:{size:7}};
var t2={x:nsB,y:quad,mode:'lines+markers',name:'Σ k²',line:{color:'#ef4444',width:3},marker:{size:7}};
var layB={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'partial sum',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:70},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l65-compare-en',[t1,t2],layB,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Telescoping Sums</h2>

<div class="calc-highlight"><strong>Some sums collapse like a folded telescope.</strong> If the summand can be written as $f(k+1) - f(k)$, then when you write the sum out term by term, almost everything cancels — only the very first $f$ and the very last $f$ survive.</div>

<p class="l-text">The pattern is best seen directly. Suppose $a_k = f(k+1) - f(k)$. Then</p>

<div class="calc-formula"><div class="formula-label">TELESCOPING IDENTITY</div><div class="formula-main">$$\\sum_{k=1}^{n} \\big[f(k+1) - f(k)\\big] \\;=\\; f(n+1) - f(1)$$</div><div class="formula-sub">Internal terms come in $+f(k+1)$, $-f(k+1)$ pairs and cancel. Only the endpoints survive.</div></div>

<p class="l-text">Why does this work? Write the sum out:</p>

<div class="calc-formula"><div class="formula-label">TELESCOPING UNFOLDED</div><div class="formula-main">$$\\big[f(2) - f(1)\\big] + \\big[f(3) - f(2)\\big] + \\big[f(4) - f(3)\\big] + \\cdots + \\big[f(n+1) - f(n)\\big]$$</div><div class="formula-sub">$f(2)$ cancels with $-f(2)$, $f(3)$ cancels with $-f(3)$, and so on. Only $-f(1)$ at the start and $+f(n+1)$ at the end have no partner.</div></div>

<div class="calc-example"><div class="example-label">CLASSIC TELESCOPING EXAMPLE</div><div class="example-body">Compute $\\displaystyle\\sum_{k=1}^{n} \\frac{1}{k(k+1)}$.<br><br>Use partial fractions: $\\dfrac{1}{k(k+1)} = \\dfrac{1}{k} - \\dfrac{1}{k+1}$.<br><br>Apply the telescoping identity with $f(k) = \\dfrac{1}{k}$ (so the summand is $f(k) - f(k+1) = -[f(k+1) - f(k)]$):<br><br>$\\displaystyle\\sum_{k=1}^{n} \\left(\\frac{1}{k} - \\frac{1}{k+1}\\right) = \\frac{1}{1} - \\frac{1}{n+1} = \\mathbf{1 - \\frac{1}{n+1}}$.<br><br>Check at $n = 3$: $\\frac{1}{1 \\cdot 2} + \\frac{1}{2 \\cdot 3} + \\frac{1}{3 \\cdot 4} = \\frac{1}{2} + \\frac{1}{6} + \\frac{1}{12} = \\frac{6 + 2 + 1}{12} = \\frac{9}{12} = \\frac{3}{4}$, and $1 - \\frac{1}{4} = \\frac{3}{4}$. Match.</div></div>

<div class="calc-graph"><div id="plot-l65-telescope-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the individual terms $\\frac{1}{k(k+1)}$ as blue bars, alongside the running partial sum as an orange curve. The bars shrink rapidly: $\\frac{1}{2}, \\frac{1}{6}, \\frac{1}{12}, \\frac{1}{20}, \\ldots$. The running sum climbs toward $1$ but never quite reaches it — the gap is always $\\frac{1}{n+1}$, which shrinks to zero as $n \\to \\infty$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ksT=[];var trms=[];var psum=[];var run=0;for(var i=1;i<=12;i++){ksT.push(i);var v=1/(i*(i+1));trms.push(v);run+=v;psum.push(run);}
var bT={x:ksT,y:trms,type:'bar',name:'1/(k(k+1))',marker:{color:'#3b82f6'}};
var lT={x:ksT,y:psum,mode:'lines+markers',name:'partial sum',line:{color:'#f59e0b',width:3},marker:{size:8}};
var limT={x:[0,13],y:[1,1],mode:'lines',name:'limit = 1',line:{color:'rgba(255,255,255,0.4)',width:1.5,dash:'dash'}};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'k',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'value',range:[0,1.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l65-telescope-en',[bT,lT,limT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Common Mistakes and How to Avoid Them</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">OFF-BY-ONE</div><div class="compare-item">Writing $\\sum_{k=1}^{n}$ when you meant $\\sum_{k=0}^{n}$ — that is $n+1$ terms, not $n$</div><div class="compare-item">Forgetting that $\\sum_{k=1}^{n} 1 = n$, not $n + 1$</div><div class="compare-item">Fix: always count the terms by hand for $n = 3$ or $4$ and check against your formula</div></div><div class="compare-col"><div class="compare-title">DROPPED $(n+1)$ FACTOR</div><div class="compare-item">Writing $\\sum k = \\frac{n^2}{2}$ instead of $\\frac{n(n+1)}{2}$</div><div class="compare-item">For $n = 4$ the wrong answer is $8$, the right one is $10$. Easy to verify, easy to miss</div><div class="compare-item">Fix: every time you write the formula, mentally say "n times n plus one over two"</div></div></div>

<div class="l-note"><strong>Another classic.</strong> $\\sum_{k=1}^{n} a_k b_k$ is <em>not</em> equal to $\\left(\\sum a_k\\right)\\left(\\sum b_k\\right)$. Linearity splits over $+$, not over $\\times$. There is no rule that lets you separate a product summand.</div>

<h2 class="lesson-title">8. Worked Problems</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body">Compute $\\displaystyle\\sum_{k=1}^{50} k$.<br><br>Direct closed form: $\\dfrac{50 \\cdot 51}{2} = \\dfrac{2550}{2} = \\mathbf{1275}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body">Compute $\\displaystyle\\sum_{k=1}^{15} (4k - 3)$.<br><br>Linearity: $4\\sum k - 3\\sum 1 = 4 \\cdot \\dfrac{15 \\cdot 16}{2} - 3 \\cdot 15 = 4 \\cdot 120 - 45 = 480 - 45 = \\mathbf{435}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body">Compute $\\displaystyle\\sum_{k=1}^{12} k^2$.<br><br>$\\dfrac{12 \\cdot 13 \\cdot 25}{6} = \\dfrac{3900}{6} = \\mathbf{650}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4</div><div class="example-body">Sum the arithmetic series $7 + 11 + 15 + \\cdots + 99$.<br><br>$a_1 = 7$, $d = 4$. From $a_n = 7 + 4(n-1) = 4n + 3 = 99$ we get $n = 24$.<br><br>$S_{24} = \\dfrac{24(7 + 99)}{2} = 12 \\cdot 106 = \\mathbf{1272}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5</div><div class="example-body">Compute the geometric series $3 + 6 + 12 + 24 + 48 + 96 + 192$.<br><br>$a_1 = 3$, $r = 2$, $n = 7$. $S_7 = \\dfrac{3(2^7 - 1)}{2 - 1} = 3 \\cdot 127 = \\mathbf{381}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — TELESCOPING</div><div class="example-body">Compute $\\displaystyle\\sum_{k=1}^{50} \\frac{1}{k(k+1)}$.<br><br>Telescoping: $1 - \\dfrac{1}{51} = \\dfrac{50}{51} \\approx \\mathbf{0.9804}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — MIXED</div><div class="example-body">Compute $\\displaystyle\\sum_{k=1}^{10} (k^2 + 3k - 1)$.<br><br>$\\sum k^2 + 3\\sum k - \\sum 1 = \\dfrac{10 \\cdot 11 \\cdot 21}{6} + 3 \\cdot \\dfrac{10 \\cdot 11}{2} - 10 = 385 + 165 - 10 = \\mathbf{540}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — CUBES</div><div class="example-body">Compute $\\displaystyle\\sum_{k=1}^{6} k^3$.<br><br>By Nicomachus: $\\left[\\dfrac{6 \\cdot 7}{2}\\right]^2 = 21^2 = \\mathbf{441}$.<br><br>Direct check: $1 + 8 + 27 + 64 + 125 + 216 = 441$. Match.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\sum_{k=1}^{n} a_k$ means "add $a_k$ for $k$ from $1$ to $n$"; the index is a dummy and can be renamed</li>
<li>Four standard closed forms: $\\sum 1 = n$, $\\sum k = \\frac{n(n+1)}{2}$, $\\sum k^2 = \\frac{n(n+1)(2n+1)}{6}$, $\\sum k^3 = \\left[\\frac{n(n+1)}{2}\\right]^2$</li>
<li>Linearity: split over $+$, pull constants outside; <em>not</em> over $\\times$</li>
<li>Arithmetic series: $S_n = \\frac{n(a_1 + a_n)}{2}$</li>
<li>Geometric series: $S_n = \\frac{a_1(r^n - 1)}{r - 1}$ when $r \\neq 1$</li>
<li>Telescoping: $\\sum_{k=1}^{n} [f(k+1) - f(k)] = f(n+1) - f(1)$; partial fractions often expose this pattern</li>
<li>Watch out for off-by-one bounds and the dropped $(n+1)$ factor</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bir kâğıt parçasına</strong> $1 + 2 + 3 + \\cdots + 100$ toplamını yazmak zorunda olduğunu hayal et. Ortadaki üç nokta çok iş yapıyor — okuyucuya "100'e kadar aynı düzende devam et" diyor. Üç dört terim için bu fena değil. Binlerce terim için işkenceye dönüşür. Bir listenin ortalaması, bir örneklemin varyansı veya bir eğri altındaki alan gibi daha büyük formüller içinde geçen toplamlar için, cebirsel olarak işlenebilen bir kısaltma gerekir.</p>

<p class="l-text">Bu kısaltma, Yunan büyük sigma harfidir, $\\Sigma$. Bu dersin sonunda sigma gösterimini bir cümle gibi akıcı okuyacak, dört standart kapalı form toplamı ezberden bilecek, teleskopik desenleri tanıyacak ve aritmetik ile geometrik serilerin formüllerini tek satırda uygulayacaksın. Bu araçlar sayfalarca aritmetiği birkaç sembol ve düzgün bir cebir adımına dönüştürür.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\sum_{k=1}^{n} a_k$ sigma gösterimini okumayı ve yazmayı — indis, sınırlar, toplananın ifadesi, kukla değişken</li>
<li>Dört temel kapalı formu ezberlemeyi: $\\sum 1$, $\\sum k$, $\\sum k^2$, $\\sum k^3$</li>
<li>Doğrusallık özelliğini uygulamayı: $\\sum (a_k + b_k) = \\sum a_k + \\sum b_k$ ve $\\sum c \\, a_k = c \\sum a_k$</li>
<li>Aritmetik ve geometrik seriler için kapalı form toplamları tek adımda kullanmayı</li>
<li>Çoğu terimin sadeleşip yalnızca ilk ve son terimin kaldığı teleskopik desenleri görmeyi</li>
<li>İki klasik hatadan kaçınmayı: bir kayma indis hatası ve $(n+1)$ çarpanını düşürmek</li>
</ul>
</div>

<h2 class="lesson-title">1. Üç Noktadan Sigma Gösterimine</h2>

<div class="calc-highlight"><strong>Gösterim, koca bir cümlenin işini yapan tek bir semboldür.</strong> $\\sum_{k=1}^{n} a_k$ "her seferinde bir tam sayı kayarak $k$ değeri $1$'den $n$'e giderken $a_k$ değerlerini topla" demektir. Büyük sigma $\\Sigma$ aslında Yunan alfabesindeki S harfidir — "Sum / Toplam" kelimesindeki S ile aynı.</div>

<p class="l-text">Her sigma ifadesini şu sırada dört parça halinde oku. Birinci olarak sigmanın altındaki <strong>kukla indis</strong> (burada $k$) — bir değerden ötekine adım atacak değişkenin adı. İkinci olarak <strong>alt sınır</strong> ($k = 1$) — başlangıç değeri. Üçüncü olarak üstteki <strong>üst sınır</strong> ($n$) — son değer. Dördüncü olarak sigmanın sağındaki <strong>toplanan</strong> $a_k$ — her terimi üreten ifade.</p>

<div class="calc-formula"><div class="formula-label">SİGMA GÖSTERİMİ &mdash; ANATOMİ</div><div class="formula-main">$$\\sum_{k=1}^{n} a_k \\;=\\; a_1 + a_2 + a_3 + \\cdots + a_n$$</div><div class="formula-sub">$k$ kukla indistir; $1$ alt sınır; $n$ üst sınır; $a_k$ toplanan ifade.</div></div>

<p class="l-text"><strong>İndis "kukla"dır çünkü adı önemli değildir.</strong> $\\sum_{k=1}^{n} a_k$, $\\sum_{i=1}^{n} a_i$ ve $\\sum_{j=1}^{n} a_j$ ifadelerinin hepsi tam olarak aynı toplamı belirtir. Harf bir yer tutucudur — bir fonksiyon tanımı içindeki değişkeni nasıl serbestçe yeniden adlandırabiliyorsan, indisi de öyle yeniden adlandırabilirsin. Toplam açıldığında, kukla indis tamamen kaybolur.</p>

<div class="calc-example"><div class="example-label">AÇMA ÖRNEĞİ</div><div class="example-body">$\\displaystyle\\sum_{k=1}^{5} k^2$ ifadesini aç.<br><br>Toplanan $k^2$'dir. Sırayla $k = 1, 2, 3, 4, 5$ yerleştir ve topla:<br><br>$1^2 + 2^2 + 3^2 + 4^2 + 5^2 = 1 + 4 + 9 + 16 + 25 = \\mathbf{55}$.</div></div>

<div class="calc-example"><div class="example-label">AÇMA ÖRNEĞİ</div><div class="example-body">$\\displaystyle\\sum_{k=2}^{6} (2k - 1)$ ifadesini aç.<br><br>$k = 2, 3, 4, 5, 6$ yerleştir:<br><br>$(2 \\cdot 2 - 1) + (2 \\cdot 3 - 1) + (2 \\cdot 4 - 1) + (2 \\cdot 5 - 1) + (2 \\cdot 6 - 1)$<br>$= 3 + 5 + 7 + 9 + 11 = \\mathbf{35}$.</div></div>

<div class="l-note"><strong>İndis sözleşmeleri.</strong> Alt sınırın $1$ olması zorunlu değildir. Çoğu kez $0$'dan başlarız (özellikle geometrik serilerde, çünkü $r^0 = 1$ doğal birinci terimdir) ve bazen negatif bir tam sayıdan. Alt sınır ne olursa olsun, indis her adımda $1$ artar.</div>

<h2 class="lesson-title">2. Dört Standart Kapalı Form</h2>

<div class="calc-highlight"><strong>Bazı toplamlar o kadar yaygındır ki kapalı formlarını çalışma belleğinde tutarız.</strong> "Kapalı form", $n$ cinsinden tam bir formüldür — noktasız, sigmasız, özyinelemesiz. Aşağıdaki dört formül, karşılaşacağın toplamların büyük bir kısmını kapsar.</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">2.1 $n$ tane birin toplamı</h3>

<div class="calc-formula"><div class="formula-label">BİRLER TOPLAMI</div><div class="formula-main">$$\\sum_{k=1}^{n} 1 \\;=\\; \\underbrace{1 + 1 + \\cdots + 1}_{n \\text{ terim}} \\;=\\; n$$</div><div class="formula-sub">$1$ sayısını kendisiyle $n$ kez toplamak $n$ verir. Önemsiz görünür ama uzun türetmelerin içinde sık kullanılır.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">2.2 İlk $n$ tam sayının toplamı (Gauss)</h3>

<p class="l-text">Hikâye sık anlatılır, ama ispatı verdiği için bir kez daha anlatmaya değer. Genç Gauss'a (sürüme göre 8 ya da 9 yaşında) $1 + 2 + \\cdots + 100$ toplamını yapması bir oyalama ödevi olarak verilmiş. Toplamı düz ve ters yazıp sütun sütun toplarsan,</p>

<div class="calc-formula"><div class="formula-label">GAUSS'UN HİLESİ</div><div class="formula-main">$$\\begin{aligned} S \\;&=\\; 1 + 2 + 3 + \\cdots + 100 \\\\ S \\;&=\\; 100 + 99 + 98 + \\cdots + 1 \\\\ \\hline 2S \\;&=\\; 101 + 101 + 101 + \\cdots + 101 \\;=\\; 100 \\cdot 101 \\end{aligned}$$</div><div class="formula-sub">Her çift $101$ verir, çift sayısı $100$'dür. Yani $S = \\frac{100 \\cdot 101}{2} = 5050$.</div></div>

<p class="l-text">Aynı argümanı $100$ yerine $n$ ile yaparsan genel formül çıkar:</p>

<div class="calc-formula"><div class="formula-label">İLK $n$ TAM SAYININ TOPLAMI</div><div class="formula-main">$$\\sum_{k=1}^{n} k \\;=\\; \\frac{n(n+1)}{2}$$</div><div class="formula-sub">$n$-inci üçgensel sayı $T_n$ olarak da bilinir. $(n+1)$ çarpanı en sık düşürülen parçadır — her zaman orada olduğundan emin ol.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">2.3 İlk $n$ tam sayının kareleri toplamı</h3>

<div class="calc-formula"><div class="formula-label">İLK $n$ KARENİN TOPLAMI</div><div class="formula-main">$$\\sum_{k=1}^{n} k^2 \\;=\\; \\frac{n(n+1)(2n+1)}{6}$$</div><div class="formula-sub">Üç çarpan üstte, $6$ ile bölünür. Hızlı doğrulama: $n = 1$ için $\\frac{1 \\cdot 2 \\cdot 3}{6} = 1$, bu da $1^2 = 1$ ile uyuşur.</div></div>

<p class="l-text">$n = 4$'te hızlı doğrulama: $1 + 4 + 9 + 16 = 30$ ve formül $\\frac{4 \\cdot 5 \\cdot 9}{6} = \\frac{180}{6} = 30$ verir. Tam isabet.</p>

<h3 style="color:#3b82f6;margin-top:1.4rem">2.4 İlk $n$ tam sayının küpleri toplamı</h3>

<div class="calc-formula"><div class="formula-label">İLK $n$ KÜPÜN TOPLAMI</div><div class="formula-main">$$\\sum_{k=1}^{n} k^3 \\;=\\; \\left[\\frac{n(n+1)}{2}\\right]^2 \\;=\\; \\left(\\sum_{k=1}^{n} k\\right)^2$$</div><div class="formula-sub">Çok güzel bir özdeşlik: ilk $n$ küpün toplamı, ilk $n$ tam sayının toplamının <em>karesine</em> eşittir.</div></div>

<p class="l-text">$n = 3$'te doğrulama: $1^3 + 2^3 + 3^3 = 1 + 8 + 27 = 36$ ve $\\left[\\frac{3 \\cdot 4}{2}\\right]^2 = 6^2 = 36$. Bu ilişki Nicomachus teoremi olarak bilinir ve birinci yüzyıldan beri biliniyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\sum 1$</div><div class="card-body">$n$. "Bir, $n$ kez toplandığında $n$ olur" şeklinde ezberle.</div></div>
<div class="calc-card"><div class="card-title">$\\sum k$</div><div class="card-body">$\\frac{n(n+1)}{2}$. Üçgensel sayı, Gauss'un hilesi.</div></div>
<div class="calc-card"><div class="card-title">$\\sum k^2$</div><div class="card-body">$\\frac{n(n+1)(2n+1)}{6}$. Üç çarpan, $6$ ile bölünür.</div></div>
<div class="calc-card"><div class="card-title">$\\sum k^3$</div><div class="card-body">$\\left[\\frac{n(n+1)}{2}\\right]^2$. Üçgen toplamının karesi.</div></div>
</div>

<div class="calc-graph"><div id="plot-l65-partial-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $S_n = 1 + 2 + \\cdots + n$ kısmi toplamlarını $n$'ye göre çubuk olarak çizdik. Büyüme kareseldir — çubuk yükseklikleri $n(n+1)/2$ eğrisini izler, bu da yaklaşık $n^2/2$ gibi yükselir. İlk on kısmi toplam $1, 3, 6, 10, 15, 21, 28, 36, 45, 55$'tir (üçgensel sayılar).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nsA2=[];var ssA2=[];for(var i=1;i<=20;i++){nsA2.push(i);ssA2.push(i*(i+1)/2);}
var barsTR={x:nsA2,y:ssA2,type:'bar',name:'kısmi toplam',marker:{color:'#3b82f6'}};
var nsC2=[];var ssC2=[];for(var j=0;j<=200;j++){var nv=j/200*20;nsC2.push(nv);ssC2.push(nv*(nv+1)/2);}
var curveTR={x:nsC2,y:ssC2,mode:'lines',name:'n(n+1)/2',line:{color:'#f59e0b',width:2.5,dash:'dot'}};
var layA2={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'S_n = 1 + 2 + ... + n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l65-partial-tr',[barsTR,curveTR],layA2,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. İki Özellik: Doğrusallık</h2>

<div class="calc-highlight"><strong>Sigma toplamları doğrusaldır.</strong> Bu tek kelime, şu andan itibaren her problemde kullanacağın iki kuralı paketler: bir sigmayı $+$ veya $-$ üzerinden bölebilirsin ve sabit bir çarpanı dışarı çıkarabilirsin.</div>

<div class="calc-formula"><div class="formula-label">SİGMANIN DOĞRUSALLIĞI</div><div class="formula-main">$$\\sum_{k=1}^{n} (a_k + b_k) \\;=\\; \\sum_{k=1}^{n} a_k + \\sum_{k=1}^{n} b_k \\qquad \\sum_{k=1}^{n} c \\, a_k \\;=\\; c \\sum_{k=1}^{n} a_k$$</div><div class="formula-sub">Bölme ve sabit dışarı çıkarma. Her iki kural da karmaşık bir toplananı dört standart kapalı formun bir kombinasyonuna indirgemeni sağlar.</div></div>

<p class="l-text">İspatlar birer satırdır — toplamanın birleşme ve dağılma özelliklerinden çıkar. Birinci kural şunu söyler: $(a_k + b_k)$ çiftlerini önce tüm $a$'lar, sonra tüm $b$'ler olarak yeniden gruplamak toplamı değiştirmez. İkinci kural şunu söyler: her terimdeki ortak çarpan $c$, toplamın önüne çekilebilir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\displaystyle\\sum_{k=1}^{10} (3k + 2)$ toplamını terim terim açmadan hesapla.<br><br>Doğrusallıkla böl ve sabitleri çıkar:<br>$\\displaystyle\\sum_{k=1}^{10} (3k + 2) = 3\\sum_{k=1}^{10} k + \\sum_{k=1}^{10} 2 = 3 \\cdot \\frac{10 \\cdot 11}{2} + 2 \\cdot 10$<br><br>$= 3 \\cdot 55 + 20 = 165 + 20 = \\mathbf{185}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\displaystyle\\sum_{k=1}^{20} k^2$ toplamını hesapla.<br><br>$n = 20$ ile kapalı formu doğrudan uygula:<br><br>$\\sum_{k=1}^{20} k^2 = \\frac{20 \\cdot 21 \\cdot 41}{6} = \\frac{17220}{6} = \\mathbf{2870}$.<br><br>Hesap makinesiyle $1^2 + 2^2 + \\cdots + 20^2$'nin gerçekten $2870$ olduğunu doğrulayabilirsin.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\displaystyle\\sum_{k=1}^{5} (k^2 + 4k + 1)$ toplamını hesapla.<br><br>Doğrusallıkla üç parçaya böl:<br><br>$\\sum k^2 + 4\\sum k + \\sum 1 = \\frac{5 \\cdot 6 \\cdot 11}{6} + 4 \\cdot \\frac{5 \\cdot 6}{2} + 5 = 55 + 60 + 5 = \\mathbf{120}$.</div></div>

<h2 class="lesson-title">4. Aritmetik Seriler</h2>

<div class="calc-highlight"><strong>Aritmetik seri, ardışık farkları sabit olan terimlerin toplamıdır.</strong> $2 + 5 + 8 + 11 + 14$ aritmetiktir çünkü her terimden bir sonrakine geçişte fark hep aynı sayı: $3$. Bu sabit farka ortak fark $d$ denir.</div>

<p class="l-text">İlk terim $a_1$ ve ortak fark $d$ ise, $k$-inci terim $a_k = a_1 + (k-1)d$ olur. İlk $n$ terimin toplamı için Gauss'un eşleme argümanı çalışır: toplamı düz ve ters yaz, sütun sütun topla, her sütunun $a_1 + a_n$ verdiğini fark et.</p>

<div class="calc-formula"><div class="formula-label">ARİTMETİK SERİ &mdash; TOPLAM</div><div class="formula-main">$$S_n \\;=\\; \\sum_{k=1}^{n} \\big[a_1 + (k-1)d\\big] \\;=\\; \\frac{n(a_1 + a_n)}{2}$$</div><div class="formula-sub">$n$ terim, ilk ve son terimin ortalaması, terim sayısıyla çarpılır — sonra $2$'ye bölünür.</div></div>

<p class="l-text">Eşdeğer bir başka biçim, yalnızca $a_1, d, n$ biliniyor ve $a_n$ ayrıca hesaplanmak istenmiyorsa kullanışlıdır:</p>

<div class="calc-formula"><div class="formula-label">ARİTMETİK SERİ &mdash; ALTERNATİF BİÇİM</div><div class="formula-main">$$S_n \\;=\\; \\frac{n}{2}\\big[2a_1 + (n-1)d\\big]$$</div><div class="formula-sub">Aynı formül, $a_n = a_1 + (n-1)d$ doğrudan yerine konmuş hali.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$2 + 5 + 8 + 11 + \\cdots + 59$ aritmetik serisini topla.<br><br>Önce $n$'i bul. $a_1 = 2$ ve $d = 3$ ile $n$-inci terim $a_n = 2 + 3(n-1) = 3n - 1$. $3n - 1 = 59$'dan $n = 20$.<br><br>Şimdi formülü uygula:<br>$S_{20} = \\frac{20 (2 + 59)}{2} = 10 \\cdot 61 = \\mathbf{610}$.</div></div>

<h2 class="lesson-title">5. Geometrik Seriler</h2>

<div class="calc-highlight"><strong>Geometrik seri, ardışık oranları sabit olan terimlerin toplamıdır.</strong> $1 + 2 + 4 + 8 + 16$ geometriktir çünkü her terim bir öncekinin iki katıdır; sabit oran $r = 2$.</div>

<p class="l-text">İlk terim $a_1$ ve ortak oran $r$ ise, $k$-inci terim $a_k = a_1 r^{k-1}$ olur. Akıllı bir hile kapalı formu verir: $S_n = a_1 + a_1 r + a_1 r^2 + \\cdots + a_1 r^{n-1}$ yaz, sonra her iki tarafı $r$ ile çarp; $rS_n = a_1 r + a_1 r^2 + \\cdots + a_1 r^n$ elde edersin. Çıkar: ortadaki tüm terimler sadeleşir, geriye $S_n - rS_n = a_1 - a_1 r^n$ kalır, yani $S_n(1 - r) = a_1(1 - r^n)$.</p>

<div class="calc-formula"><div class="formula-label">GEOMETRİK SERİ &mdash; TOPLAM</div><div class="formula-main">$$S_n \\;=\\; \\sum_{k=1}^{n} a_1 r^{k-1} \\;=\\; \\frac{a_1(1 - r^n)}{1 - r} \\;=\\; \\frac{a_1(r^n - 1)}{r - 1} \\qquad (r \\neq 1)$$</div><div class="formula-sub">İki biçim eşdeğerdir — paydası pozitif olanı seçersen aritmetik daha temiz olur. $r = 1$ ise seri yalnızca $n a_1$'dir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\displaystyle 1 + \\frac{1}{2} + \\frac{1}{4} + \\cdots + \\frac{1}{2^9}$ toplamını hesapla.<br><br>Bu, $a_1 = 1$, $r = \\frac{1}{2}$, $n = 10$ olan bir geometrik seridir (terimler $r^0$'dan $r^9$'a kadar).<br><br>$S_{10} = \\dfrac{1 \\cdot \\left(1 - (1/2)^{10}\\right)}{1 - 1/2} = \\dfrac{1 - 1/1024}{1/2} = 2 \\cdot \\dfrac{1023}{1024} = \\mathbf{\\dfrac{1023}{512}} \\approx 1.998$.</div></div>

<div class="l-note"><strong>Gerçek hayatta nerede saklı:</strong> bileşik faiz, ilacın kandan üstel azalması, olasılıkta geometrik dağılım, bir üstel fonksiyonun merdiven yaklaşımı altındaki alan. Geometrik toplamlar her yerdedir.</div>

<div class="calc-graph"><div id="plot-l65-compare-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> aynı eksenler üzerinde $\\sum_{k=1}^{n} k$ (doğrusal toplam) ve $\\sum_{k=1}^{n} k^2$ (karesel toplam) kısmi toplamlarının büyüme eğrileri. $\\sum k^2$'nin kübik tarz büyümesi, $\\sum k$'nin karesel büyümesini çok hızlı geçer — $n = 20$'de $\\sum k = 210$ ama $\\sum k^2 = 2870$, on katından fazla.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nsB2=[];var lin2=[];var quad2=[];for(var i=1;i<=25;i++){nsB2.push(i);lin2.push(i*(i+1)/2);quad2.push(i*(i+1)*(2*i+1)/6);}
var t1TR={x:nsB2,y:lin2,mode:'lines+markers',name:'Σ k',line:{color:'#3b82f6',width:3},marker:{size:7}};
var t2TR={x:nsB2,y:quad2,mode:'lines+markers',name:'Σ k²',line:{color:'#ef4444',width:3},marker:{size:7}};
var layB2={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'kısmi toplam',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:70},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l65-compare-tr',[t1TR,t2TR],layB2,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Teleskopik Toplamlar</h2>

<div class="calc-highlight"><strong>Bazı toplamlar katlanmış bir teleskop gibi büzülür.</strong> Toplanan $f(k+1) - f(k)$ biçiminde yazılabilirse, toplamı terim terim yazdığında neredeyse her şey sadeleşir — yalnızca en baştaki $f$ ile en sondaki $f$ ayakta kalır.</div>

<p class="l-text">Desen doğrudan görüldüğünde en iyi anlaşılır. $a_k = f(k+1) - f(k)$ olduğunu varsay. O zaman</p>

<div class="calc-formula"><div class="formula-label">TELESKOPİK ÖZDEŞLİK</div><div class="formula-main">$$\\sum_{k=1}^{n} \\big[f(k+1) - f(k)\\big] \\;=\\; f(n+1) - f(1)$$</div><div class="formula-sub">İçerideki terimler $+f(k+1)$, $-f(k+1)$ çiftleri olarak gelir ve sadeleşir. Sadece uç noktalar kalır.</div></div>

<p class="l-text">Bu neden işe yarar? Toplamı açarak yaz:</p>

<div class="calc-formula"><div class="formula-label">TELESKOP AÇILMIŞ</div><div class="formula-main">$$\\big[f(2) - f(1)\\big] + \\big[f(3) - f(2)\\big] + \\big[f(4) - f(3)\\big] + \\cdots + \\big[f(n+1) - f(n)\\big]$$</div><div class="formula-sub">$f(2)$, $-f(2)$ ile sadeleşir; $f(3)$, $-f(3)$ ile sadeleşir; böyle gider. Sadece baştaki $-f(1)$ ve sondaki $+f(n+1)$ eşsiz kalır.</div></div>

<div class="calc-example"><div class="example-label">KLASİK TELESKOP ÖRNEĞİ</div><div class="example-body">$\\displaystyle\\sum_{k=1}^{n} \\frac{1}{k(k+1)}$ toplamını hesapla.<br><br>Basit kesirler kullan: $\\dfrac{1}{k(k+1)} = \\dfrac{1}{k} - \\dfrac{1}{k+1}$.<br><br>$f(k) = \\dfrac{1}{k}$ alarak teleskopik özdeşliği uygula (toplanan $f(k) - f(k+1) = -[f(k+1) - f(k)]$ biçiminde):<br><br>$\\displaystyle\\sum_{k=1}^{n} \\left(\\frac{1}{k} - \\frac{1}{k+1}\\right) = \\frac{1}{1} - \\frac{1}{n+1} = \\mathbf{1 - \\frac{1}{n+1}}$.<br><br>$n = 3$'te doğrulama: $\\frac{1}{1 \\cdot 2} + \\frac{1}{2 \\cdot 3} + \\frac{1}{3 \\cdot 4} = \\frac{1}{2} + \\frac{1}{6} + \\frac{1}{12} = \\frac{6 + 2 + 1}{12} = \\frac{9}{12} = \\frac{3}{4}$ ve $1 - \\frac{1}{4} = \\frac{3}{4}$. Uyuşuyor.</div></div>

<div class="calc-graph"><div id="plot-l65-telescope-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $\\frac{1}{k(k+1)}$ tek tek terimleri mavi çubuklarla, yürüyen kısmi toplam ise turuncu eğriyle. Çubuklar hızla küçülür: $\\frac{1}{2}, \\frac{1}{6}, \\frac{1}{12}, \\frac{1}{20}, \\ldots$. Yürüyen toplam $1$'e doğru tırmanır ama tam ulaşamaz — boşluk her zaman $\\frac{1}{n+1}$'dir ve $n \\to \\infty$ iken sıfıra iner.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ksT2=[];var trms2=[];var psum2=[];var run2=0;for(var i=1;i<=12;i++){ksT2.push(i);var v=1/(i*(i+1));trms2.push(v);run2+=v;psum2.push(run2);}
var bT2={x:ksT2,y:trms2,type:'bar',name:'1/(k(k+1))',marker:{color:'#3b82f6'}};
var lT2={x:ksT2,y:psum2,mode:'lines+markers',name:'kısmi toplam',line:{color:'#f59e0b',width:3},marker:{size:8}};
var limT2={x:[0,13],y:[1,1],mode:'lines',name:'limit = 1',line:{color:'rgba(255,255,255,0.4)',width:1.5,dash:'dash'}};
var layT2={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'k',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'değer',range:[0,1.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l65-telescope-tr',[bT2,lT2,limT2],layT2,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Yaygın Hatalar ve Onlardan Nasıl Kaçınılır</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">BİR KAYMA</div><div class="compare-item">$\\sum_{k=0}^{n}$ demek istiyorken $\\sum_{k=1}^{n}$ yazmak — birincisi $n+1$ terim, ikincisi $n$ terim</div><div class="compare-item">$\\sum_{k=1}^{n} 1 = n$ olduğunu unutmak (yanlışlıkla $n + 1$ demek)</div><div class="compare-item">Düzeltme: $n = 3$ veya $4$ için terimleri elle say, formülünle karşılaştır</div></div><div class="compare-col"><div class="compare-title">DÜŞÜRÜLEN $(n+1)$</div><div class="compare-item">$\\sum k = \\frac{n^2}{2}$ yazmak — doğrusu $\\frac{n(n+1)}{2}$</div><div class="compare-item">$n = 4$ için yanlış cevap $8$, doğrusu $10$. Kolay doğrulanır, kolay kaçar</div><div class="compare-item">Düzeltme: formülü her yazdığında zihninde "n çarpı n artı bir bölü iki" de</div></div></div>

<div class="l-note"><strong>Bir başka klasik.</strong> $\\sum_{k=1}^{n} a_k b_k$ ifadesi $\\left(\\sum a_k\\right)\\left(\\sum b_k\\right)$ ifadesine <em>eşit değildir</em>. Doğrusallık $+$ üzerinden bölünür, $\\times$ üzerinden değil. Çarpım biçimindeki bir toplananı ayırmana izin veren bir kural yoktur.</div>

<h2 class="lesson-title">8. Çözümlü Problemler</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body">$\\displaystyle\\sum_{k=1}^{50} k$ toplamını hesapla.<br><br>Doğrudan kapalı form: $\\dfrac{50 \\cdot 51}{2} = \\dfrac{2550}{2} = \\mathbf{1275}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body">$\\displaystyle\\sum_{k=1}^{15} (4k - 3)$ toplamını hesapla.<br><br>Doğrusallık: $4\\sum k - 3\\sum 1 = 4 \\cdot \\dfrac{15 \\cdot 16}{2} - 3 \\cdot 15 = 4 \\cdot 120 - 45 = 480 - 45 = \\mathbf{435}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body">$\\displaystyle\\sum_{k=1}^{12} k^2$ toplamını hesapla.<br><br>$\\dfrac{12 \\cdot 13 \\cdot 25}{6} = \\dfrac{3900}{6} = \\mathbf{650}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4</div><div class="example-body">$7 + 11 + 15 + \\cdots + 99$ aritmetik serisini topla.<br><br>$a_1 = 7$, $d = 4$. $a_n = 7 + 4(n-1) = 4n + 3 = 99$'dan $n = 24$.<br><br>$S_{24} = \\dfrac{24(7 + 99)}{2} = 12 \\cdot 106 = \\mathbf{1272}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5</div><div class="example-body">$3 + 6 + 12 + 24 + 48 + 96 + 192$ geometrik serisini hesapla.<br><br>$a_1 = 3$, $r = 2$, $n = 7$. $S_7 = \\dfrac{3(2^7 - 1)}{2 - 1} = 3 \\cdot 127 = \\mathbf{381}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; TELESKOP</div><div class="example-body">$\\displaystyle\\sum_{k=1}^{50} \\frac{1}{k(k+1)}$ toplamını hesapla.<br><br>Teleskop: $1 - \\dfrac{1}{51} = \\dfrac{50}{51} \\approx \\mathbf{0.9804}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; KARIŞIK</div><div class="example-body">$\\displaystyle\\sum_{k=1}^{10} (k^2 + 3k - 1)$ toplamını hesapla.<br><br>$\\sum k^2 + 3\\sum k - \\sum 1 = \\dfrac{10 \\cdot 11 \\cdot 21}{6} + 3 \\cdot \\dfrac{10 \\cdot 11}{2} - 10 = 385 + 165 - 10 = \\mathbf{540}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; KÜPLER</div><div class="example-body">$\\displaystyle\\sum_{k=1}^{6} k^3$ toplamını hesapla.<br><br>Nicomachus ile: $\\left[\\dfrac{6 \\cdot 7}{2}\\right]^2 = 21^2 = \\mathbf{441}$.<br><br>Doğrudan doğrulama: $1 + 8 + 27 + 64 + 125 + 216 = 441$. Uyuşuyor.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\sum_{k=1}^{n} a_k$ "k $1$'den $n$'e kadar giderken $a_k$'ları topla" demektir; indis kukladır, yeniden adlandırılabilir</li>
<li>Dört standart kapalı form: $\\sum 1 = n$, $\\sum k = \\frac{n(n+1)}{2}$, $\\sum k^2 = \\frac{n(n+1)(2n+1)}{6}$, $\\sum k^3 = \\left[\\frac{n(n+1)}{2}\\right]^2$</li>
<li>Doğrusallık: $+$ üzerinden böl, sabitleri dışarı çıkar; $\\times$ üzerinden bölünmez</li>
<li>Aritmetik seri: $S_n = \\frac{n(a_1 + a_n)}{2}$</li>
<li>Geometrik seri: $r \\neq 1$ iken $S_n = \\frac{a_1(r^n - 1)}{r - 1}$</li>
<li>Teleskop: $\\sum_{k=1}^{n} [f(k+1) - f(k)] = f(n+1) - f(1)$; basit kesirler bu deseni sık sık ortaya çıkarır</li>
<li>Bir kayma sınır hatalarına ve düşürülen $(n+1)$ çarpanına dikkat</li>
</ul>
</div>`

};
