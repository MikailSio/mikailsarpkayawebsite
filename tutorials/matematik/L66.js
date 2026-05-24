window.LISE_MAT_L66 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Add infinitely many numbers and get a finite answer.</strong> At first sight this sounds impossible — you keep adding, the sum keeps growing, so how can it ever stop? The Greeks puzzled over this 2500 years ago and produced Zeno's famous paradoxes about motion. Modern mathematics resolves them in a single line: if the terms shrink fast enough, the total really does settle on a finite limit. The cleanest case where everything works out perfectly is the <em>infinite geometric series</em>, and that is what this lesson is about.</p>

<p class="l-text">By the end of the lesson, you will know exactly when an infinite geometric series converges (the condition is just $|r| < 1$), you will be able to compute its sum in two seconds with the formula $S = a / (1 - r)$, and you will recognise the same idea hidden inside repeating decimals, super-balls bouncing on the floor, and Achilles racing the tortoise. Every one of these problems reduces to plugging two numbers into one tiny formula.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define the sum of an infinite series as the limit of partial sums $S_n$</li>
<li>Recognise an infinite geometric series and read off its first term $a$ and ratio $r$</li>
<li>Apply the convergence test: an infinite geometric series sums to a finite number if and only if $|r| < 1$</li>
<li>Use the closed-form formula $S = \\dfrac{a}{1 - r}$ to compute the sum in one step</li>
<li>Convert repeating decimals into exact fractions by treating them as geometric series</li>
<li>Solve word problems involving bouncing balls, perpetual annuities, and Zeno's paradox</li>
<li>Avoid the two classic mistakes: blindly applying the formula when $|r| \\geq 1$, and dropping the sign in $(1 - r)$</li>
</ul>
</div>

<h2 class="lesson-title">1. What Does It Mean to Add Infinitely Many Numbers?</h2>

<div class="calc-highlight"><strong>The honest answer:</strong> you never actually finish adding. Instead you watch the running total $S_n$ and ask what number it gets closer and closer to as $n$ grows. If it homes in on a single value, we call that value the <em>sum</em> of the infinite series. If the running total wanders off or oscillates, the series has no sum.</div>

<p class="l-text">Start with a sequence of numbers $a_1, a_2, a_3, \\ldots$. Build the <strong>partial sums</strong> by adding more and more of them:</p>

<div class="calc-formula"><div class="formula-label">PARTIAL SUMS</div><div class="formula-main">$$S_1 = a_1, \\quad S_2 = a_1 + a_2, \\quad S_3 = a_1 + a_2 + a_3, \\;\\ldots\\; S_n = \\sum_{k=1}^{n} a_k$$</div><div class="formula-sub">Each $S_n$ is an ordinary finite sum — no infinity yet. The interesting question is what happens to the list $S_1, S_2, S_3, \\ldots$ as $n$ keeps growing.</div></div>

<p class="l-text">Two things can happen. Either the partial sums march steadily toward some fixed number $S$ — in which case we say the series <strong>converges</strong> to $S$ and write the infinite sum as that limit — or they do not, and the series <strong>diverges</strong> (no sum).</p>

<div class="calc-formula"><div class="formula-label">SUM OF AN INFINITE SERIES</div><div class="formula-main">$$\\sum_{k=1}^{\\infty} a_k \\;=\\; \\lim_{n \\to \\infty} S_n$$</div><div class="formula-sub">The infinite sum is defined as the limit of partial sums. If the limit does not exist, the series has no sum.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Consider $1 + 1 + 1 + 1 + \\ldots$. The partial sums are $1, 2, 3, 4, \\ldots$ which clearly grow without bound. This series <em>diverges</em>. Now consider $1 - 1 + 1 - 1 + \\ldots$. Partial sums oscillate between 1 and 0 forever — they never settle. This series also <em>diverges</em>, even though the terms are bounded.</div></div>

<h2 class="lesson-title">2. The Geometric Series Itself</h2>

<div class="calc-highlight"><strong>A geometric series is the kind where each term is the previous term multiplied by a fixed ratio.</strong> You already know finite geometric sums from earlier lessons. Letting that finite sum run to infinity is the topic of today's lesson — and unlike most infinite series, it can be answered with a single clean formula.</div>

<p class="l-text">A geometric sequence has the form $a, ar, ar^2, ar^3, \\ldots$ where $a$ is the first term and $r$ is the common ratio. The infinite geometric series is the sum of all of them:</p>

<div class="calc-formula"><div class="formula-label">INFINITE GEOMETRIC SERIES</div><div class="formula-main">$$S \\;=\\; a + ar + ar^2 + ar^3 + \\cdots \\;=\\; \\sum_{k=0}^{\\infty} a r^k$$</div><div class="formula-sub">Two parameters: $a$ (the first term) and $r$ (the common ratio). The question is: for which values of $r$ does this infinite sum equal a finite number?</div></div>

<p class="l-text">From earlier lessons you know the finite sum:</p>

<div class="calc-formula"><div class="formula-label">FINITE GEOMETRIC SUM (for reference)</div><div class="formula-main">$$S_n \\;=\\; a + ar + ar^2 + \\cdots + ar^{n-1} \\;=\\; a \\cdot \\frac{1 - r^n}{1 - r} \\quad (r \\neq 1)$$</div><div class="formula-sub">This formula is exact for any finite $n$. To get the infinite sum we let $n \\to \\infty$ and study what happens to $r^n$.</div></div>

<p class="l-text">Everything hinges on the behaviour of $r^n$ as $n \\to \\infty$. There are three cases, and they decide whether the series converges:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$|r| < 1$</div><div class="card-body">Powers of $r$ shrink toward zero: $r^n \\to 0$. The finite sum $\\frac{a(1 - r^n)}{1 - r}$ approaches $\\frac{a}{1 - r}$. <strong>Series converges.</strong></div></div>
<div class="calc-card"><div class="card-title">$|r| \\geq 1$ (and $r \\neq 1$)</div><div class="card-body">$|r^n|$ either stays at 1 or grows without bound. The partial sums never settle. <strong>Series diverges.</strong></div></div>
<div class="calc-card"><div class="card-title">$r = 1$</div><div class="card-body">Then $S_n = a + a + \\cdots + a = n a$, which grows linearly. <strong>Series diverges</strong> (unless $a = 0$).</div></div>
</div>

<div class="calc-formula"><div class="formula-label">SUM FORMULA — THE BIG RESULT</div><div class="formula-main">$$\\boxed{\\;S_\\infty \\;=\\; \\frac{a}{1 - r} \\quad \\text{when } |r| < 1\\;}$$</div><div class="formula-sub">This is the headline of the whole lesson. Memorise it. The condition $|r| < 1$ is just as important as the formula itself.</div></div>

<div class="l-note"><strong>Reading the formula:</strong> the numerator is whatever the first term is (call it $a$). The denominator is "one minus the ratio". That's it. Plug in two numbers and read off the answer. We will spend the rest of the lesson seeing why this single formula handles so many different-looking problems.</div>

<h2 class="lesson-title">3. Why $|r| &lt; 1$ Matters: A Visual Argument</h2>

<div class="calc-highlight"><strong>The whole story comes down to one question: does $r^n$ shrink to zero?</strong> When $|r|$ is less than 1, multiplying by $r$ makes things smaller. Multiply enough times and you get arbitrarily close to zero. When $|r| \\geq 1$, multiplying does the opposite — it keeps things at least as big or makes them bigger.</div>

<p class="l-text">Let us watch concretely. Take $r = 0.5$. Then the powers go $0.5, 0.25, 0.125, 0.0625, 0.03125, \\ldots$ — each one is half the previous, and after 20 steps you are below one in a million. The terms are getting so small so fast that adding more of them barely changes the total.</p>

<p class="l-text">Now take $r = 2$. Powers go $2, 4, 8, 16, 32, \\ldots$ — each term is bigger than the last, the partial sums explode, no finite limit exists.</p>

<p class="l-text">The borderline cases $r = 1$ and $r = -1$ also fail. At $r = 1$ every term equals $a$ and the partial sums grow linearly. At $r = -1$ partial sums oscillate between $a$ and $0$ and never settle.</p>

<div class="calc-graph"><div id="plot-l66-rn-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the absolute value of $r^n$ as $n$ grows, plotted on a logarithmic vertical scale, for four values of $r$. For $r = 0.3$ and $r = 0.7$ the lines go down — these series converge. For $r = 1$ the line stays flat. For $r = 1.4$ the line goes up — series diverges. The condition $|r| < 1$ is exactly the condition that the line goes down.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=0;i<=30;i++)xs.push(i);
function pw(r){var out=[];for(var i=0;i<=30;i++)out.push(Math.pow(Math.abs(r),i));return out;}
var t1={x:xs,y:pw(0.3),mode:'lines+markers',name:'|r|=0.3 (converges)',line:{color:'#3b82f6',width:2.4},marker:{size:5}};
var t2={x:xs,y:pw(0.7),mode:'lines+markers',name:'|r|=0.7 (converges)',line:{color:'#10b981',width:2.4},marker:{size:5}};
var t3={x:xs,y:pw(1),mode:'lines+markers',name:'|r|=1 (diverges)',line:{color:'#f59e0b',width:2.4,dash:'dash'},marker:{size:5}};
var t4={x:xs,y:pw(1.4),mode:'lines+markers',name:'|r|=1.4 (diverges)',line:{color:'#ef4444',width:2.4},marker:{size:5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'|r|^n (log scale)',type:'log',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l66-rn-en',[t1,t2,t3,t4],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">WHY THE FORMULA WORKS</div><div class="think-body">From the finite sum $S_n = a \\cdot (1 - r^n) / (1 - r)$, when $|r| < 1$ we have $r^n \\to 0$, so $1 - r^n \\to 1$, so $S_n \\to a / (1 - r)$. The formula is just the limit of the finite formula. No magic — every step is honest algebra plus one limit.</div></div>

<h2 class="lesson-title">4. First Worked Examples</h2>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — THE CLASSIC HALVING SERIES</div><div class="example-body">Find $S = 1 + \\dfrac{1}{2} + \\dfrac{1}{4} + \\dfrac{1}{8} + \\cdots$.<br><br>First term $a = 1$. Ratio $r = 1/2$ (each term is half the previous). Since $|1/2| < 1$ the series converges and<br><br>$S = \\dfrac{a}{1 - r} = \\dfrac{1}{1 - 1/2} = \\dfrac{1}{1/2} = \\mathbf{2}$.<br><br>Sanity check: $S_4 = 1 + 0.5 + 0.25 + 0.125 = 1.875$, $S_8 \\approx 1.9961$, $S_{20} \\approx 1.999999\\ldots$. The partial sums creep up toward 2 and never quite reach it.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — AN ALTERNATING SERIES</div><div class="example-body">Find $S = 1 - \\dfrac{1}{3} + \\dfrac{1}{9} - \\dfrac{1}{27} + \\cdots$.<br><br>First term $a = 1$. Ratio $r = -1/3$ (each term is the previous times $-1/3$, hence the alternating sign). Since $|-1/3| = 1/3 < 1$ the series converges:<br><br>$S = \\dfrac{1}{1 - (-1/3)} = \\dfrac{1}{1 + 1/3} = \\dfrac{1}{4/3} = \\mathbf{\\dfrac{3}{4}}$.<br><br>Notice the trap: $1 - r = 1 - (-1/3) = 1 + 1/3$. Forgetting the sign here is the most common mistake students make.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — DOES IT CONVERGE?</div><div class="example-body">Does $2 + 3 + 4.5 + 6.75 + \\cdots$ converge?<br><br>Ratio: $3/2 = 1.5$, $4.5/3 = 1.5$, $6.75/4.5 = 1.5$. So $r = 1.5$. Since $|1.5| \\geq 1$ the series <strong>diverges</strong> — no sum exists. Applying $a/(1-r) = 2/(1 - 1.5) = -4$ would give a nonsense answer; the formula does not apply here.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 — SERIES STARTING AT A LATER TERM</div><div class="example-body">Find $S = \\dfrac{1}{4} + \\dfrac{1}{8} + \\dfrac{1}{16} + \\cdots$.<br><br>First term $a = 1/4$ (not 1 — be careful!). Ratio $r = 1/2$.<br><br>$S = \\dfrac{1/4}{1 - 1/2} = \\dfrac{1/4}{1/2} = \\mathbf{\\dfrac{1}{2}}$.<br><br>This is consistent with example 1: $1 + 1/2 + 1/4 + 1/8 + \\cdots = 2$, and the part from $1/4$ onward is $2 - 1 - 1/2 = 1/2$. The formula recovers exactly that.</div></div>

<h2 class="lesson-title">5. Partial Sums Climbing to the Limit</h2>

<div class="calc-highlight"><strong>The picture to keep in mind:</strong> partial sums of a convergent geometric series climb a staircase whose steps get smaller and smaller, asymptotically approaching the limit $S$ but never crossing it. Below we draw the staircase for $1 + 1/2 + 1/4 + \\cdots \\to 2$.</div>

<div class="calc-graph"><div id="plot-l66-partial-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the partial sums $S_1 = 1$, $S_2 = 1.5$, $S_3 = 1.75$, $S_4 = 1.875$, ... of $\\sum 1/2^k$ as a function of $n$. The dashed horizontal line at $y = 2$ marks the limit. Each new term adds half of the previous gap, so the curve approaches 2 forever but never crosses it. This is the geometric picture of "converges to 2".</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[];var ss=[];var s=0;for(var n=1;n<=18;n++){s+=Math.pow(0.5,n-1);ns.push(n);ss.push(s);}
var bars={x:ns,y:ss,mode:'lines+markers',name:'partial sum S_n',line:{color:'#3b82f6',width:2.6},marker:{size:7,color:'#3b82f6'}};
var limit={x:[0.5,18.5],y:[2,2],mode:'lines',name:'limit S = 2',line:{color:'#10b981',width:2,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n (number of terms)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'S_n',range:[0.8,2.15],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l66-partial-en',[bars,limit],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Decay of the terms themselves.</strong> Beneath the staircase lies an even simpler picture: the individual terms $a, ar, ar^2, \\ldots$ form a sequence that decays toward zero. The bar chart below shows them for $a = 1$, $r = 1/2$.</div>

<div class="calc-graph"><div id="plot-l66-terms-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the size of each successive term $a r^k$ as a bar. The bars shrink by a factor of $r$ at each step. The sum of all bar heights equals $S = a / (1 - r)$. For $a = 1$, $r = 1/2$ the heights are $1, 0.5, 0.25, 0.125, \\ldots$ which add to 2.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ks=[];var ts=[];for(var k=0;k<10;k++){ks.push('a·r^'+k);ts.push(Math.pow(0.5,k));}
var bar={x:ks,y:ts,type:'bar',name:'term value',marker:{color:'#3b82f6'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'term index',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'value',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:80,l:60},showlegend:false};
Plotly.newPlot('plot-l66-terms-en',[bar],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Side-by-side: three ratios, three fates.</strong> To really see the role of $|r|$, watch partial sums for three different ratios all with the same first term $a = 1$. For $r = 0.5$ the sum hurries to its limit $S = 2$. For $r = 0.9$ the sum drifts much more slowly toward $S = 10$ — same formula, much later convergence. For $r = 1.1$ there is no limit at all: the partial sums grow without bound.</div>

<div class="calc-graph"><div id="plot-l66-en-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> partial sums $S_n$ of three geometric series with $a = 1$ but different ratios. Blue $r = 0.5$ races to its limit $S = 2$ within ten terms. Green $r = 0.9$ converges to $S = 10$ but extremely slowly — even at $n = 60$ it is still well short. Red $r = 1.1$ diverges: $S_n$ climbs past every horizontal line and never settles. The dashed limit lines mark $S = 2$ and $S = 10$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[];var s05=[];var s09=[];var s11=[];var a05=0,a09=0,a11=0;
for(var n=1;n<=60;n++){a05+=Math.pow(0.5,n-1);a09+=Math.pow(0.9,n-1);a11+=Math.pow(1.1,n-1);ns.push(n);s05.push(a05);s09.push(a09);s11.push(a11);}
var tr1={x:ns,y:s05,mode:'lines+markers',name:'r = 0.5 (limit 2)',line:{color:'#3b82f6',width:2.4},marker:{size:4}};
var tr2={x:ns,y:s09,mode:'lines+markers',name:'r = 0.9 (limit 10)',line:{color:'#10b981',width:2.4},marker:{size:4}};
var tr3={x:ns,y:s11,mode:'lines+markers',name:'r = 1.1 (diverges)',line:{color:'#ef4444',width:2.4},marker:{size:4}};
var lim2={x:[0,60],y:[2,2],mode:'lines',name:'S = 2',line:{color:'#3b82f6',width:1.4,dash:'dot'}};
var lim10={x:[0,60],y:[10,10],mode:'lines',name:'S = 10',line:{color:'#10b981',width:1.4,dash:'dot'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n (number of terms)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'S_n',range:[0,22],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l66-en-extra',[tr1,tr2,tr3,lim2,lim10],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Reading the curves:</strong> the rate of convergence is controlled by how close $|r|$ is to 1. Small $|r|$ means terms shrink fast and the sum settles quickly; $|r|$ near 1 means terms shrink slowly and you need many of them before the partial sum is close to the limit; $|r| \\geq 1$ means no convergence at all.</div>

<div class="calc-highlight"><strong>The full convergence map.</strong> The table below classifies every possible value of $r$ into one of five regimes — three diverge, one converges (the cell that powers this whole lesson), and one is the trivial constant case. Memorise this table and you will never plug a bad $r$ into the formula.</div>

<div style="margin:1.4rem 0;overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:0.9rem;background:rgba(20,20,20,0.4);border:1px solid rgba(59,130,246,0.25);border-radius:6px;overflow:hidden"><thead><tr style="background:rgba(59,130,246,0.1)"><th style="padding:0.65rem 0.85rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.3);color:#3b82f6;font-weight:700;letter-spacing:0.04em">$r$ range</th><th style="padding:0.65rem 0.85rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.3);color:#3b82f6;font-weight:700;letter-spacing:0.04em">behaviour</th><th style="padding:0.65rem 0.85rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.3);color:#3b82f6;font-weight:700;letter-spacing:0.04em">sum formula</th></tr></thead><tbody><tr><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">$r < -1$</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">diverges — $|r^n|$ grows, partial sums oscillate with growing amplitude</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">no finite sum</td></tr><tr><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">$r = -1$</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">diverges — partial sums oscillate between $a$ and $0$, never settle</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">no finite sum</td></tr><tr style="background:rgba(59,130,246,0.06)"><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06);color:#3b82f6;font-weight:600">$-1 < r < 1$</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06);color:#3b82f6;font-weight:600">converges — $r^n \\to 0$, partial sums approach a finite limit</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06);color:#3b82f6;font-weight:600">$S = \\dfrac{a}{1 - r}$</td></tr><tr><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">$r = 1$</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">diverges — $S_n = n a$ grows linearly (unless $a = 0$)</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">no finite sum</td></tr><tr><td style="padding:0.6rem 0.85rem">$r > 1$</td><td style="padding:0.6rem 0.85rem">diverges — terms grow geometrically, partial sums explode to $\\pm\\infty$</td><td style="padding:0.6rem 0.85rem">no finite sum</td></tr></tbody></table></div>

<h2 class="lesson-title">6. Repeating Decimals as Geometric Series</h2>

<div class="calc-highlight"><strong>Every repeating decimal is secretly an infinite geometric series.</strong> Once you see this, the trick "$0.333\\ldots = 1/3$" stops being a memorised fact and becomes a one-line calculation. The same trick converts $0.121212\\ldots$ into a clean fraction with no algebra-with-variables required.</div>

<p class="l-text">Take $0.333\\ldots$ . Write it out as a sum of place values:</p>

<div class="calc-formula"><div class="formula-label">UNPACKING 0.333...</div><div class="formula-main">$$0.333\\ldots \\;=\\; \\frac{3}{10} + \\frac{3}{100} + \\frac{3}{1000} + \\cdots$$</div><div class="formula-sub">Each next term is the previous divided by 10. That is an infinite geometric series with $a = 3/10$ and $r = 1/10$.</div></div>

<p class="l-text">Apply the formula:</p>

<div class="calc-formula"><div class="formula-label">SUM IT</div><div class="formula-main">$$S \\;=\\; \\frac{a}{1 - r} \\;=\\; \\frac{3/10}{1 - 1/10} \\;=\\; \\frac{3/10}{9/10} \\;=\\; \\frac{3}{9} \\;=\\; \\frac{1}{3}$$</div><div class="formula-sub">So $0.333\\ldots = 1/3$ exactly — not approximately, exactly. The infinite series is just the fraction in disguise.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — TWO-DIGIT REPEAT</div><div class="example-body">Convert $0.121212\\ldots$ to a fraction.<br><br>Write as place values: $\\dfrac{12}{100} + \\dfrac{12}{10000} + \\dfrac{12}{1000000} + \\cdots$.<br><br>This is geometric with $a = 12/100$ and $r = 1/100$.<br><br>$S = \\dfrac{12/100}{1 - 1/100} = \\dfrac{12/100}{99/100} = \\dfrac{12}{99} = \\dfrac{4}{33}$.<br><br>Check: $4 / 33 = 0.121212\\ldots$ on a calculator. Confirmed.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — MIXED DECIMAL</div><div class="example-body">Convert $0.5\\overline{27} = 0.5272727\\ldots$ to a fraction.<br><br>Split off the non-repeating part: $0.5 + 0.0272727\\ldots = 1/2 + 0.0\\overline{27}$.<br><br>The repeating tail $0.0272727\\ldots = \\dfrac{27}{1000} + \\dfrac{27}{100000} + \\cdots$ is geometric with $a = 27/1000$, $r = 1/100$.<br><br>$S_{\\text{tail}} = \\dfrac{27/1000}{1 - 1/100} = \\dfrac{27/1000}{99/100} = \\dfrac{27}{990} = \\dfrac{3}{110}$.<br><br>Total: $1/2 + 3/110 = 55/110 + 3/110 = \\mathbf{58/110 = 29/55}$.</div></div>

<div class="calc-graph"><div id="plot-l66-third-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the partial sums of $3/10 + 3/100 + 3/1000 + \\cdots$ climbing toward the limit $1/3 \\approx 0.3333$. After only six terms the partial sum is correct to six decimal places. The dashed line marks $y = 1/3$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[];var ss=[];var s=0;for(var n=1;n<=10;n++){s+=3*Math.pow(0.1,n);ns.push(n);ss.push(s);}
var bars={x:ns,y:ss,mode:'lines+markers',name:'partial sum',line:{color:'#3b82f6',width:2.6},marker:{size:7,color:'#3b82f6'}};
var limit={x:[0.5,10.5],y:[1/3,1/3],mode:'lines',name:'limit = 1/3',line:{color:'#10b981',width:2,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n (number of decimal digits)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'partial sum',range:[0.25,0.35],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l66-third-en',[bars,limit],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Two-line rule for pure repeating decimals.</strong> If the repeating block has $d$ digits and equals the integer $N$, then $0.\\overline{N}$ (with the bar over the $d$-digit block) equals $N / (10^d - 1)$. So $0.\\overline{3} = 3/9 = 1/3$, $0.\\overline{12} = 12/99 = 4/33$, $0.\\overline{142857} = 142857/999999 = 1/7$. This is just the geometric series formula in disguise.</div>

<h2 class="lesson-title">7. Zeno's Paradox: Achilles and the Tortoise</h2>

<div class="calc-highlight"><strong>The ancient puzzle:</strong> Achilles (the fast Greek hero) races a tortoise that gets a head start. Zeno argued that Achilles can never catch up — by the time he reaches where the tortoise was, the tortoise has crawled a bit further; by the time he reaches that point, it has moved again; and so on, infinitely many times. So motion is impossible! Yet clearly Achilles overtakes the tortoise. Geometric series resolve the paradox.</div>

<p class="l-text">Pick numbers to make it concrete. Suppose the tortoise starts 100 metres ahead and crawls at 1 m/s while Achilles runs at 10 m/s.</p>

<ul class="l-text" style="line-height:1.7">
<li><strong>Stage 1:</strong> Achilles needs $100/10 = 10$ s to reach the tortoise's start. In those 10 s the tortoise has moved 10 m.</li>
<li><strong>Stage 2:</strong> Achilles needs $10/10 = 1$ s to cover those new 10 m. In that 1 s the tortoise has moved 0.1 m.</li>
<li><strong>Stage 3:</strong> Achilles needs $0.1/10 = 0.01$ s for that. Tortoise moves $0.01 \\cdot 1 = 0.01$ m.</li>
<li>And so on. At each stage Achilles needs $1/10$ of the previous time and the tortoise moves $1/10$ of the previous distance.</li>
</ul>

<p class="l-text">Total time Achilles spends "catching up forever":</p>

<div class="calc-formula"><div class="formula-label">ZENO TIME SERIES</div><div class="formula-main">$$T \\;=\\; 10 + 1 + 0.1 + 0.01 + \\cdots \\;=\\; \\frac{10}{1 - 1/10} \\;=\\; \\frac{10}{9/10} \\;=\\; \\frac{100}{9} \\approx 11.11 \\;\\text{s}$$</div><div class="formula-sub">Geometric series with $a = 10$, $r = 1/10$. The infinitely many stages add up to a finite time — Achilles catches the tortoise in just over 11 seconds.</div></div>

<p class="l-text"><strong>What Zeno missed</strong>: infinitely many <em>stages</em> does not mean infinitely much <em>time</em>. If each stage is ten times shorter than the previous, the total time is finite, the catch-up is real, and the paradox dissolves.</p>

<div class="l-note"><strong>Cross-check by elementary algebra.</strong> Achilles catches the tortoise when their positions are equal: $10 t = 100 + t$, giving $t = 100/9 \\approx 11.11$ s. Same answer, no infinite series needed — which is the modern resolution: motion is naturally described in continuous terms, and the "infinitely many stages" decomposition is artificial. But the geometric-series sum confirms the answer.</div>

<h2 class="lesson-title">8. The Bouncing Super-Ball</h2>

<div class="calc-highlight"><strong>Drop a ball from height $h$ that bounces back to a fraction $r$ of its previous height each time.</strong> If $r < 1$ the ball bounces infinitely often (in principle) but covers only a finite total distance. The total distance is one of the friendliest geometric-series word problems.</div>

<p class="l-text">A ball is dropped from height $h_0 = 10$ m. Each bounce rises to 60% of the previous height (so $r = 0.6$). What is the total distance the ball travels before coming to rest?</p>

<p class="l-text"><strong>First fall:</strong> $10$ m down.</p>

<p class="l-text"><strong>First rise + first fall back:</strong> Up to $10 r = 6$ m, then down 6 m. Total: $2 \\cdot 6 = 12$ m.</p>

<p class="l-text"><strong>Second rise + second fall:</strong> Up to $10 r^2 = 3.6$ m, then down 3.6 m. Total: $2 \\cdot 3.6 = 7.2$ m.</p>

<p class="l-text">In general the $k$th round-trip after the first fall covers $2 \\cdot 10 \\cdot r^k$ metres. So:</p>

<div class="calc-formula"><div class="formula-label">TOTAL DISTANCE</div><div class="formula-main">$$D \\;=\\; h_0 + 2 h_0 r + 2 h_0 r^2 + 2 h_0 r^3 + \\cdots \\;=\\; h_0 + 2 h_0 \\sum_{k=1}^{\\infty} r^k \\;=\\; h_0 + \\frac{2 h_0 r}{1 - r}$$</div><div class="formula-sub">First fall is unpaired (no rise before it); all subsequent legs come in up-down pairs.</div></div>

<p class="l-text">Plug in $h_0 = 10$, $r = 0.6$:</p>

<div class="calc-formula"><div class="formula-label">NUMERICAL ANSWER</div><div class="formula-main">$$D \\;=\\; 10 + \\frac{2 \\cdot 10 \\cdot 0.6}{1 - 0.6} \\;=\\; 10 + \\frac{12}{0.4} \\;=\\; 10 + 30 \\;=\\; \\mathbf{40 \\text{ m}}$$</div></div>

<p class="l-text">The ball travels 40 metres total despite bouncing infinitely many times. The "infinite" part is allowed because each new bounce is shorter, and the bounces add to a finite sum thanks to $|r| = 0.6 < 1$.</p>

<div class="l-note"><strong>Real-world caveat:</strong> in reality the ball stops after finitely many bounces — friction, air resistance and material limits eventually take over. The mathematical model with infinite bounces is an idealisation, but the total distance is so close to the real answer that engineers use it routinely.</div>

<h2 class="lesson-title">9. Another Application: Perpetual Annuity</h2>

<div class="calc-highlight"><strong>Finance question:</strong> what is a contract worth that pays you 1000 TL every year forever, if the annual interest rate is 5%? The "present value" of a payment made $k$ years from now is its face value divided by $(1.05)^k$. Adding up all future payments gives an infinite geometric series.</div>

<p class="l-text">Present value of the perpetual annuity:</p>

<div class="calc-formula"><div class="formula-label">PERPETUITY</div><div class="formula-main">$$PV \\;=\\; \\sum_{k=1}^{\\infty} \\frac{1000}{(1 + 0.05)^k} \\;=\\; \\frac{1000 / 1.05}{1 - 1/1.05}$$</div></div>

<p class="l-text">Simplify: $1 - 1/1.05 = 0.05/1.05$, so</p>

<div class="calc-formula"><div class="formula-label">CLEAN FORM</div><div class="formula-main">$$PV \\;=\\; \\frac{1000/1.05}{0.05/1.05} \\;=\\; \\frac{1000}{0.05} \\;=\\; \\mathbf{20\\,000 \\text{ TL}}$$</div><div class="formula-sub">A perpetuity paying $C$ per period at rate $i$ is worth $C/i$. This is the standard "present value of a perpetuity" formula in finance, and it comes straight from the geometric series sum.</div></div>

<div class="think-box"><div class="think-label">SANITY CHECK</div><div class="think-body">Compare two scenarios. (a) Put 20 000 TL in an account at 5% annual interest. Each year you can withdraw 1000 TL (the interest) and the balance stays at 20 000. You can do this forever. (b) Buy the perpetuity for 20 000 TL and receive 1000 TL/year forever. The two are equivalent — which is why $PV = C/i = 1000 / 0.05 = 20\\,000$.</div></div>

<h2 class="lesson-title">10. Common Mistakes</h2>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">PITFALL 1 — APPLYING THE FORMULA WHEN $|r| \\geq 1$</div><div class="compare-item">The series $2 + 4 + 8 + 16 + \\cdots$ has $a = 2$, $r = 2$.</div><div class="compare-item">A student writes $S = 2 / (1 - 2) = -2$. Nonsense — a sum of positive numbers cannot be negative.</div><div class="compare-item"><strong>The fix:</strong> always check $|r| < 1$ <em>before</em> applying the formula. If $|r| \\geq 1$ the series diverges and there is no sum.</div></div>
<div class="compare-col"><div class="compare-title">PITFALL 2 — SIGN ERROR IN $(1 - r)$</div><div class="compare-item">For $r = -1/3$, the denominator is $1 - (-1/3) = 1 + 1/3 = 4/3$, not $1 - 1/3 = 2/3$.</div><div class="compare-item">Students often write $S = 1 / (2/3) = 3/2$ — wrong answer (true answer is $3/4$).</div><div class="compare-item"><strong>The fix:</strong> write out $1 - r$ in full with the sign of $r$ kept explicit. The formula does not care whether $r$ is positive or negative; you just must not lose its sign.</div></div>
</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">PITFALL 3 — IDENTIFYING $a$</div><div class="compare-item">In $\\dfrac{1}{4} + \\dfrac{1}{8} + \\dfrac{1}{16} + \\cdots$ the first term is $a = 1/4$, not 1.</div><div class="compare-item">Always read $a$ as the very first number written down — the head of the series.</div></div>
<div class="compare-col"><div class="compare-title">PITFALL 4 — FORGETTING THE FIRST FALL</div><div class="compare-item">In the bouncing ball problem, the first fall is unpaired. If you forget it and write $D = 2 h_0 / (1 - r)$ you double-count the bounces and overshoot.</div><div class="compare-item">Always sketch the trajectory before plugging into a formula.</div></div>
</div>

<h2 class="lesson-title">11. Practice Problems</h2>

<p class="l-text">Try each one yourself with paper and pencil first. The full solutions are written out below.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — STRAIGHT FORMULA</div><div class="example-body"><strong>Find</strong> $S = 5 + 5/2 + 5/4 + 5/8 + \\cdots$.<br><br>$a = 5$, $r = 1/2$. $|r| = 1/2 < 1$, so converges.<br><br>$S = \\dfrac{5}{1 - 1/2} = \\dfrac{5}{1/2} = \\mathbf{10}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — NEGATIVE RATIO</div><div class="example-body"><strong>Find</strong> $S = 4 - 4/5 + 4/25 - 4/125 + \\cdots$.<br><br>$a = 4$, $r = -1/5$. $|r| = 1/5 < 1$, so converges.<br><br>$S = \\dfrac{4}{1 - (-1/5)} = \\dfrac{4}{6/5} = \\dfrac{4 \\cdot 5}{6} = \\dfrac{20}{6} = \\mathbf{\\dfrac{10}{3}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — DOES IT CONVERGE?</div><div class="example-body"><strong>Decide</strong> whether $3 + 3.6 + 4.32 + 5.184 + \\cdots$ has a finite sum.<br><br>Ratio: $3.6 / 3 = 1.2$. Since $|1.2| \\geq 1$ the series <strong>diverges</strong>. No sum.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — REPEATING DECIMAL</div><div class="example-body"><strong>Express</strong> $0.444\\ldots$ as a fraction.<br><br>$0.444\\ldots = \\dfrac{4}{10} + \\dfrac{4}{100} + \\dfrac{4}{1000} + \\cdots$, geometric with $a = 4/10$, $r = 1/10$.<br><br>$S = \\dfrac{4/10}{1 - 1/10} = \\dfrac{4/10}{9/10} = \\mathbf{\\dfrac{4}{9}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — TWO-DIGIT REPEAT</div><div class="example-body"><strong>Express</strong> $0.\\overline{36} = 0.363636\\ldots$ as a fraction in lowest terms.<br><br>Geometric with $a = 36/100$, $r = 1/100$.<br><br>$S = \\dfrac{36/100}{99/100} = \\dfrac{36}{99} = \\mathbf{\\dfrac{4}{11}}$ (dividing top and bottom by 9).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — BOUNCING BALL</div><div class="example-body">A ball dropped from <strong>20 m</strong> bounces back to <strong>80%</strong> of its previous height. Find the total distance travelled.<br><br>$h_0 = 20$, $r = 0.8$. Use $D = h_0 + 2 h_0 r / (1 - r) = 20 + 2 \\cdot 20 \\cdot 0.8 / 0.2 = 20 + 32/0.2 = 20 + 160 = \\mathbf{180 \\text{ m}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — FIND THE RATIO</div><div class="example-body">An infinite geometric series has first term 6 and sum 9. <strong>What is $r$?</strong><br><br>Use $S = a / (1 - r)$: $9 = 6 / (1 - r) \\implies 1 - r = 6/9 = 2/3 \\implies r = \\mathbf{1/3}$.<br><br>Check: $|1/3| < 1$, so a convergent series with these parameters does exist.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — SQUARE INSIDE SQUARE</div><div class="example-body">Inside a square of side 1 you draw a smaller square whose vertices are the midpoints of the outer square's sides (so its side is $\\sqrt{2}/2$ of the original). Inside that you draw another in the same way, and so on forever. <strong>Find the total area of all squares.</strong><br><br>Side of square $k$: $(\\sqrt{2}/2)^k$, so area is $(1/2)^k$. Total area: $\\sum_{k=0}^{\\infty} (1/2)^k = 1/(1 - 1/2) = \\mathbf{2}$.<br><br>Two original squares' worth of area — even though each new square fits strictly inside the previous one. The infinitely-many-but-shrinking idea again.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Infinite sum = limit of partial sums $S_n$ as $n \\to \\infty$ (if that limit exists)</li>
<li>Geometric series $a + ar + ar^2 + \\cdots$ converges if and only if $|r| < 1$</li>
<li>Closed form: $S = a / (1 - r)$ when $|r| < 1$; otherwise the series diverges</li>
<li>Repeating decimals are geometric series in disguise: $0.\\overline{N}$ with a $d$-digit block equals $N / (10^d - 1)$</li>
<li>Zeno's paradox dissolves: infinitely many stages can take finite total time when each is a fixed fraction shorter</li>
<li>Bouncing-ball total distance: $D = h_0 + 2 h_0 r / (1 - r)$ — remember the unpaired first fall</li>
<li>Perpetual annuity: $PV = C / i$ — the geometric-series limit of an endless stream of payments</li>
<li>Two classic mistakes to dodge: applying the formula when $|r| \\geq 1$, and dropping the sign of $r$ in the denominator</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Sonsuz sayıda sayıyı topla ve sonlu bir cevap elde et.</strong> İlk bakışta imkansız geliyor — toplamaya devam ediyorsun, toplam büyümeye devam ediyor, nasıl olur da durur? Yunanlılar 2500 yıl önce bunu kafalarına takmış ve Zeno'nun ünlü hareket paradokslarını üretmişlerdi. Modern matematik bunları tek satırla çözer: eğer terimler yeterince hızlı küçülürse, toplam gerçekten de sonlu bir limite yerleşir. Her şeyin mükemmel biçimde işlediği en temiz durum <em>sonsuz geometrik seridir</em> ve bu dersin konusu tam olarak budur.</p>

<p class="l-text">Bu dersin sonunda, bir sonsuz geometrik serinin tam olarak ne zaman yakınsadığını bileceksin (koşul yalnızca $|r| < 1$), iki saniyede toplamını $S = a / (1 - r)$ formülüyle hesaplayabileceksin ve aynı fikrin tekrarlı ondalıklarda, yerdeki süper-topların zıplamasında ve Aşil ile kaplumbağa yarışında saklı olduğunu fark edeceksin. Bu problemlerin her biri tek küçük formüle iki sayı yerleştirmeye indirgenir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sonsuz bir serinin toplamını, kısmi toplamların $S_n$ limiti olarak tanımlamayı</li>
<li>Bir sonsuz geometrik seriyi tanımayı ve ilk terim $a$ ile oran $r$'yi okumayı</li>
<li>Yakınsaklık testini uygulamayı: bir sonsuz geometrik seri yalnızca $|r| < 1$ olduğunda sonlu bir sayıya toplanır</li>
<li>Kapalı formül $S = \\dfrac{a}{1 - r}$ ile toplamı tek adımda hesaplamayı</li>
<li>Tekrarlı ondalıkları geometrik seri olarak ele alarak tam kesirlere çevirmeyi</li>
<li>Zıplayan top, kalıcı gelir ve Zeno paradoksu içeren problem çözmeyi</li>
<li>İki klasik hatadan kaçınmayı: $|r| \\geq 1$ iken formülü körü körüne uygulamak ve $(1 - r)$'de işaret düşürmek</li>
</ul>
</div>

<h2 class="lesson-title">1. Sonsuz Sayıda Sayıyı Toplamak Ne Demek?</h2>

<div class="calc-highlight"><strong>Dürüst cevap:</strong> aslında hiçbir zaman toplamayı bitirmezsin. Onun yerine yürüyen toplam $S_n$'i izler ve $n$ büyüdükçe hangi sayıya gittikçe yaklaştığını sorarsın. Eğer tek bir değere yerleşiyorsa, o değere sonsuz serinin <em>toplamı</em> deriz. Eğer yürüyen toplam dolaşıp duruyorsa veya salınıyorsa, serinin toplamı yoktur.</div>

<p class="l-text">Bir $a_1, a_2, a_3, \\ldots$ sayı dizisiyle başla. Daha fazlasını ekleyerek <strong>kısmi toplamları</strong> oluştur:</p>

<div class="calc-formula"><div class="formula-label">KISMİ TOPLAMLAR</div><div class="formula-main">$$S_1 = a_1, \\quad S_2 = a_1 + a_2, \\quad S_3 = a_1 + a_2 + a_3, \\;\\ldots\\; S_n = \\sum_{k=1}^{n} a_k$$</div><div class="formula-sub">Her $S_n$ sıradan bir sonlu toplamdır — henüz sonsuzluk yok. İlginç soru, $n$ büyümeye devam ettikçe $S_1, S_2, S_3, \\ldots$ listesine ne olacağıdır.</div></div>

<p class="l-text">İki şey olabilir. Ya kısmi toplamlar sabit bir $S$ sayısına doğru kararlı biçimde yürür — bu durumda serinin $S$'ye <strong>yakınsadığını</strong> söyler ve sonsuz toplamı bu limit olarak yazarız — ya da yürümez ve seri <strong>ıraksar</strong> (toplam yok).</p>

<div class="calc-formula"><div class="formula-label">SONSUZ SERİNİN TOPLAMI</div><div class="formula-main">$$\\sum_{k=1}^{\\infty} a_k \\;=\\; \\lim_{n \\to \\infty} S_n$$</div><div class="formula-sub">Sonsuz toplam, kısmi toplamların limiti olarak tanımlanır. Limit yoksa, serinin toplamı yoktur.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$1 + 1 + 1 + 1 + \\ldots$ serisini düşün. Kısmi toplamlar $1, 2, 3, 4, \\ldots$, açıkça sınırsız büyüyor. Bu seri <em>ıraksar</em>. Şimdi $1 - 1 + 1 - 1 + \\ldots$ serisini düşün. Kısmi toplamlar 1 ile 0 arasında sonsuza dek salınır — asla yerleşmez. Terimler sınırlı olsa da bu seri de <em>ıraksar</em>.</div></div>

<h2 class="lesson-title">2. Geometrik Serinin Kendisi</h2>

<div class="calc-highlight"><strong>Geometrik seri, her terimin bir öncekinin sabit bir oranla çarpılmasıyla elde edildiği seridir.</strong> Önceki derslerden sonlu geometrik toplamları zaten biliyorsun. O sonlu toplamı sonsuza koşturmak bugünkü dersin konusudur — ve çoğu sonsuz serinin aksine, tek temiz bir formülle cevap alınabilir.</div>

<p class="l-text">Bir geometrik dizi $a, ar, ar^2, ar^3, \\ldots$ biçimindedir; burada $a$ ilk terim, $r$ ortak orandır. Sonsuz geometrik seri hepsinin toplamıdır:</p>

<div class="calc-formula"><div class="formula-label">SONSUZ GEOMETRİK SERİ</div><div class="formula-main">$$S \\;=\\; a + ar + ar^2 + ar^3 + \\cdots \\;=\\; \\sum_{k=0}^{\\infty} a r^k$$</div><div class="formula-sub">İki parametre: $a$ (ilk terim) ve $r$ (ortak oran). Soru şudur: $r$'nin hangi değerleri için bu sonsuz toplam sonlu bir sayıya eşittir?</div></div>

<p class="l-text">Önceki derslerden sonlu toplamı biliyorsun:</p>

<div class="calc-formula"><div class="formula-label">SONLU GEOMETRİK TOPLAM (referans için)</div><div class="formula-main">$$S_n \\;=\\; a + ar + ar^2 + \\cdots + ar^{n-1} \\;=\\; a \\cdot \\frac{1 - r^n}{1 - r} \\quad (r \\neq 1)$$</div><div class="formula-sub">Bu formül herhangi bir sonlu $n$ için tamdır. Sonsuz toplamı elde etmek için $n \\to \\infty$ alır ve $r^n$'e ne olduğunu inceleriz.</div></div>

<p class="l-text">Her şey $r^n$'in $n \\to \\infty$ iken davranışına bağlıdır. Üç durum vardır ve bunlar serinin yakınsayıp yakınsamadığını belirler:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$|r| < 1$</div><div class="card-body">$r$'nin kuvvetleri sıfıra doğru küçülür: $r^n \\to 0$. Sonlu toplam $\\frac{a(1 - r^n)}{1 - r}$ ifadesi $\\frac{a}{1 - r}$'e yaklaşır. <strong>Seri yakınsar.</strong></div></div>
<div class="calc-card"><div class="card-title">$|r| \\geq 1$ (ve $r \\neq 1$)</div><div class="card-body">$|r^n|$ ya 1'de kalır ya da sınırsız büyür. Kısmi toplamlar asla yerleşmez. <strong>Seri ıraksar.</strong></div></div>
<div class="calc-card"><div class="card-title">$r = 1$</div><div class="card-body">$S_n = a + a + \\cdots + a = n a$ olur, doğrusal büyür. <strong>Seri ıraksar</strong> ($a = 0$ olmadıkça).</div></div>
</div>

<div class="calc-formula"><div class="formula-label">TOPLAM FORMÜLÜ — ANA SONUÇ</div><div class="formula-main">$$\\boxed{\\;S_\\infty \\;=\\; \\frac{a}{1 - r} \\quad \\text{eğer } |r| < 1\\;}$$</div><div class="formula-sub">Tüm dersin başlığı. Ezberle. $|r| < 1$ koşulu formülün kendisi kadar önemlidir.</div></div>

<div class="l-note"><strong>Formülü okumak:</strong> pay, ilk terim ne ise odur ($a$ deyin). Payda "bir eksi oran". Hepsi bu. İki sayıyı yerleştir, cevabı oku. Dersin geri kalanında bu tek formülün neden bu kadar farklı görünen probleme çözüm verdiğini göreceğiz.</div>

<h2 class="lesson-title">3. $|r| &lt; 1$ Neden Önemli: Görsel Bir Argüman</h2>

<div class="calc-highlight"><strong>Tüm hikaye tek bir soruya iniyor: $r^n$ sıfıra mı küçülüyor?</strong> $|r|$ 1'den küçük olduğunda, $r$ ile çarpmak şeyleri küçültür. Yeterince çarp, sıfıra istediğin kadar yaklaşırsın. $|r| \\geq 1$ olduğunda çarpmak tersini yapar — şeyleri en az olduğu kadar büyük tutar ya da büyütür.</div>

<p class="l-text">Somut olarak gözlemleyelim. $r = 0.5$ alalım. Kuvvetler $0.5, 0.25, 0.125, 0.0625, 0.03125, \\ldots$ — her biri bir öncekinin yarısı ve 20 adım sonra milyonda birin altına iniyorsun. Terimler o kadar hızlı küçülüyor ki daha fazlasını eklemek toplamı çok az değiştirir.</p>

<p class="l-text">Şimdi $r = 2$ alalım. Kuvvetler $2, 4, 8, 16, 32, \\ldots$ — her terim öncekinden büyük, kısmi toplamlar patlar, sonlu limit yok.</p>

<p class="l-text">Sınır durumları $r = 1$ ve $r = -1$ de işlemez. $r = 1$ için her terim $a$'ya eşit ve kısmi toplamlar doğrusal büyür. $r = -1$ için kısmi toplamlar $a$ ile $0$ arasında salınır ve hiç yerleşmez.</p>

<div class="calc-graph"><div id="plot-l66-rn-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $n$ büyürken $r^n$'nin mutlak değerini, dört farklı $r$ değeri için logaritmik dikey eksende çizdik. $r = 0.3$ ve $r = 0.7$ için çizgiler aşağı iniyor — bu seriler yakınsar. $r = 1$ için çizgi düz kalıyor. $r = 1.4$ için çizgi yükseliyor — seri ıraksar. $|r| < 1$ koşulu tam olarak çizginin aşağı inme koşuludur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=0;i<=30;i++)xs.push(i);
function pw(r){var out=[];for(var i=0;i<=30;i++)out.push(Math.pow(Math.abs(r),i));return out;}
var t1={x:xs,y:pw(0.3),mode:'lines+markers',name:'|r|=0.3 (yakınsar)',line:{color:'#3b82f6',width:2.4},marker:{size:5}};
var t2={x:xs,y:pw(0.7),mode:'lines+markers',name:'|r|=0.7 (yakınsar)',line:{color:'#10b981',width:2.4},marker:{size:5}};
var t3={x:xs,y:pw(1),mode:'lines+markers',name:'|r|=1 (ıraksar)',line:{color:'#f59e0b',width:2.4,dash:'dash'},marker:{size:5}};
var t4={x:xs,y:pw(1.4),mode:'lines+markers',name:'|r|=1.4 (ıraksar)',line:{color:'#ef4444',width:2.4},marker:{size:5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'|r|^n (log ölçek)',type:'log',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l66-rn-tr',[t1,t2,t3,t4],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">FORMÜL NEDEN ÇALIŞIYOR</div><div class="think-body">Sonlu toplam $S_n = a \\cdot (1 - r^n) / (1 - r)$ ifadesinden, $|r| < 1$ iken $r^n \\to 0$ olur, dolayısıyla $1 - r^n \\to 1$ olur, dolayısıyla $S_n \\to a / (1 - r)$ olur. Formül, sonlu formülün limitinden başka bir şey değildir. Sihir yok — her adım dürüst cebir artı bir limit.</div></div>

<h2 class="lesson-title">4. İlk Çözümlü Örnekler</h2>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — KLASİK YARIYA BÖLME SERİSİ</div><div class="example-body">$S = 1 + \\dfrac{1}{2} + \\dfrac{1}{4} + \\dfrac{1}{8} + \\cdots$ değerini bulun.<br><br>İlk terim $a = 1$. Oran $r = 1/2$ (her terim bir öncekinin yarısı). $|1/2| < 1$ olduğundan seri yakınsar ve<br><br>$S = \\dfrac{a}{1 - r} = \\dfrac{1}{1 - 1/2} = \\dfrac{1}{1/2} = \\mathbf{2}$.<br><br>Sağlama: $S_4 = 1 + 0.5 + 0.25 + 0.125 = 1.875$, $S_8 \\approx 1.9961$, $S_{20} \\approx 1.999999\\ldots$. Kısmi toplamlar 2'ye doğru sürünür ve hiçbir zaman tam olarak ulaşmaz.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — ALMAŞIK SERİ</div><div class="example-body">$S = 1 - \\dfrac{1}{3} + \\dfrac{1}{9} - \\dfrac{1}{27} + \\cdots$ değerini bul.<br><br>İlk terim $a = 1$. Oran $r = -1/3$ (her terim öncekinin $-1/3$ katı, dolayısıyla almaşık işaret). $|-1/3| = 1/3 < 1$ olduğundan seri yakınsar:<br><br>$S = \\dfrac{1}{1 - (-1/3)} = \\dfrac{1}{1 + 1/3} = \\dfrac{1}{4/3} = \\mathbf{\\dfrac{3}{4}}$.<br><br>Tuzağa dikkat: $1 - r = 1 - (-1/3) = 1 + 1/3$. Burada işareti unutmak öğrencilerin yaptığı en yaygın hatadır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — YAKINSAR MI?</div><div class="example-body">$2 + 3 + 4.5 + 6.75 + \\cdots$ yakınsar mı?<br><br>Oran: $3/2 = 1.5$, $4.5/3 = 1.5$, $6.75/4.5 = 1.5$. Yani $r = 1.5$. $|1.5| \\geq 1$ olduğundan seri <strong>ıraksar</strong> — toplam yok. $a/(1-r) = 2/(1 - 1.5) = -4$ uygulamak saçma bir cevap verirdi; formül burada geçerli değil.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — DAHA SONRAKİ TERİMDEN BAŞLAYAN SERİ</div><div class="example-body">$S = \\dfrac{1}{4} + \\dfrac{1}{8} + \\dfrac{1}{16} + \\cdots$ değerini bul.<br><br>İlk terim $a = 1/4$ (1 değil — dikkat!). Oran $r = 1/2$.<br><br>$S = \\dfrac{1/4}{1 - 1/2} = \\dfrac{1/4}{1/2} = \\mathbf{\\dfrac{1}{2}}$.<br><br>Bu Örnek 1 ile tutarlıdır: $1 + 1/2 + 1/4 + 1/8 + \\cdots = 2$ ve $1/4$'ten itibaren olan kısım $2 - 1 - 1/2 = 1/2$'dir. Formül tam olarak bunu verir.</div></div>

<h2 class="lesson-title">5. Limite Tırmanan Kısmi Toplamlar</h2>

<div class="calc-highlight"><strong>Akılda tutulacak resim:</strong> yakınsak geometrik bir serinin kısmi toplamları, basamakları gittikçe küçülen ve limit $S$'ye asimptotik olarak yaklaşan ama hiç geçmeyen bir merdiveni tırmanır. Aşağıda $1 + 1/2 + 1/4 + \\cdots \\to 2$ için merdiveni çiziyoruz.</div>

<div class="calc-graph"><div id="plot-l66-partial-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $\\sum 1/2^k$'nın kısmi toplamları $S_1 = 1$, $S_2 = 1.5$, $S_3 = 1.75$, $S_4 = 1.875$, ... $n$'nin bir fonksiyonu olarak. $y = 2$'deki kesik yatay çizgi limiti işaretler. Her yeni terim önceki boşluğun yarısını ekler, böylece eğri 2'ye sonsuza dek yaklaşır ama hiç geçmez. "2'ye yakınsar" ifadesinin geometrik resmidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[];var ss=[];var s=0;for(var n=1;n<=18;n++){s+=Math.pow(0.5,n-1);ns.push(n);ss.push(s);}
var bars={x:ns,y:ss,mode:'lines+markers',name:'kısmi toplam S_n',line:{color:'#3b82f6',width:2.6},marker:{size:7,color:'#3b82f6'}};
var limit={x:[0.5,18.5],y:[2,2],mode:'lines',name:'limit S = 2',line:{color:'#10b981',width:2,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n (terim sayısı)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'S_n',range:[0.8,2.15],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l66-partial-tr',[bars,limit],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Terimlerin kendisinin azalması.</strong> Merdivenin altında daha basit bir resim daha var: $a, ar, ar^2, \\ldots$ tek tek terimleri sıfıra azalan bir dizi oluşturur. Aşağıdaki çubuk grafik $a = 1$, $r = 1/2$ için bunları gösterir.</div>

<div class="calc-graph"><div id="plot-l66-terms-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> art arda gelen her $a r^k$ teriminin büyüklüğü bir çubuk olarak. Çubuklar her adımda $r$ çarpanıyla küçülür. Tüm çubuk yüksekliklerinin toplamı $S = a / (1 - r)$'ye eşittir. $a = 1$, $r = 1/2$ için yükseklikler $1, 0.5, 0.25, 0.125, \\ldots$ olup 2'ye toplanır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ks=[];var ts=[];for(var k=0;k<10;k++){ks.push('a·r^'+k);ts.push(Math.pow(0.5,k));}
var bar={x:ks,y:ts,type:'bar',name:'terim değeri',marker:{color:'#3b82f6'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'terim indeksi',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'değer',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:80,l:60},showlegend:false};
Plotly.newPlot('plot-l66-terms-tr',[bar],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Yan yana karşılaştırma: üç farklı oran, üç farklı kader.</strong> $|r|$'nin rolünü gerçekten görmek için, ilk terimi aynı olan ($a = 1$) ancak üç farklı orana sahip serilerin kısmi toplamlarını izleyelim. $r = 0.5$ için toplam $S = 2$ limitine hızla koşar. $r = 0.9$ için toplam $S = 10$'a doğru çok daha yavaş sürüklenir — aynı formül, çok daha geç yakınsama. $r = 1.1$ için limit hiç yoktur: kısmi toplamlar sınırsız büyür.</div>

<div class="calc-graph"><div id="plot-l66-tr-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> ilk terimi $a = 1$ olan üç geometrik serinin farklı oranlarla kısmi toplamları $S_n$. Mavi $r = 0.5$ on terim içinde limiti $S = 2$'ye ulaşır. Yeşil $r = 0.9$ limiti $S = 10$'a yakınsar ama son derece yavaş — $n = 60$ olsa bile hâlâ epey uzakta. Kırmızı $r = 1.1$ ıraksar: $S_n$ her yatay çizgiyi geçerek tırmanır ve hiç yerleşmez. Kesik limit çizgileri $S = 2$ ve $S = 10$'u işaretler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[];var s05=[];var s09=[];var s11=[];var a05=0,a09=0,a11=0;
for(var n=1;n<=60;n++){a05+=Math.pow(0.5,n-1);a09+=Math.pow(0.9,n-1);a11+=Math.pow(1.1,n-1);ns.push(n);s05.push(a05);s09.push(a09);s11.push(a11);}
var tr1={x:ns,y:s05,mode:'lines+markers',name:'r = 0.5 (limit 2)',line:{color:'#3b82f6',width:2.4},marker:{size:4}};
var tr2={x:ns,y:s09,mode:'lines+markers',name:'r = 0.9 (limit 10)',line:{color:'#10b981',width:2.4},marker:{size:4}};
var tr3={x:ns,y:s11,mode:'lines+markers',name:'r = 1.1 (ıraksar)',line:{color:'#ef4444',width:2.4},marker:{size:4}};
var lim2={x:[0,60],y:[2,2],mode:'lines',name:'S = 2',line:{color:'#3b82f6',width:1.4,dash:'dot'}};
var lim10={x:[0,60],y:[10,10],mode:'lines',name:'S = 10',line:{color:'#10b981',width:1.4,dash:'dot'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n (terim sayısı)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'S_n',range:[0,22],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l66-tr-extra',[tr1,tr2,tr3,lim2,lim10],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Eğrileri okumak:</strong> yakınsama hızı $|r|$'nin 1'e ne kadar yakın olduğu ile belirlenir. Küçük $|r|$ terimlerin hızla küçülmesi ve toplamın çabucak yerleşmesi demektir; $|r|$'nin 1'e yakın olması terimlerin yavaş küçülmesi ve kısmi toplamın limite yaklaşması için çok terim gerekmesi demektir; $|r| \\geq 1$ ise hiç yakınsama yoktur.</div>

<div class="calc-highlight"><strong>Tam yakınsama haritası.</strong> Aşağıdaki tablo $r$'nin her olası değerini beş bölgeden birine sınıflar — üçü ıraksar, biri yakınsar (tüm dersi besleyen hücre) ve biri önemsiz sabit durumdur. Bu tabloyu ezberle ve formüle asla yanlış bir $r$ koymazsın.</div>

<div style="margin:1.4rem 0;overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:0.9rem;background:rgba(20,20,20,0.4);border:1px solid rgba(59,130,246,0.25);border-radius:6px;overflow:hidden"><thead><tr style="background:rgba(59,130,246,0.1)"><th style="padding:0.65rem 0.85rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.3);color:#3b82f6;font-weight:700;letter-spacing:0.04em">$r$ aralığı</th><th style="padding:0.65rem 0.85rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.3);color:#3b82f6;font-weight:700;letter-spacing:0.04em">davranış</th><th style="padding:0.65rem 0.85rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.3);color:#3b82f6;font-weight:700;letter-spacing:0.04em">toplam formülü</th></tr></thead><tbody><tr><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">$r < -1$</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">ıraksar — $|r^n|$ büyür, kısmi toplamlar büyüyen genlikle salınır</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">sonlu toplam yok</td></tr><tr><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">$r = -1$</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">ıraksar — kısmi toplamlar $a$ ile $0$ arasında salınır, yerleşmez</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">sonlu toplam yok</td></tr><tr style="background:rgba(59,130,246,0.06)"><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06);color:#3b82f6;font-weight:600">$-1 < r < 1$</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06);color:#3b82f6;font-weight:600">yakınsar — $r^n \\to 0$, kısmi toplamlar sonlu bir limite yaklaşır</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06);color:#3b82f6;font-weight:600">$S = \\dfrac{a}{1 - r}$</td></tr><tr><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">$r = 1$</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">ıraksar — $S_n = n a$ doğrusal büyür ($a = 0$ olmadıkça)</td><td style="padding:0.6rem 0.85rem;border-bottom:1px solid rgba(255,255,255,0.06)">sonlu toplam yok</td></tr><tr><td style="padding:0.6rem 0.85rem">$r > 1$</td><td style="padding:0.6rem 0.85rem">ıraksar — terimler geometrik büyür, kısmi toplamlar $\\pm\\infty$'a patlar</td><td style="padding:0.6rem 0.85rem">sonlu toplam yok</td></tr></tbody></table></div>

<h2 class="lesson-title">6. Geometrik Seri Olarak Tekrarlı Ondalıklar</h2>

<div class="calc-highlight"><strong>Her tekrarlı ondalık aslında bir sonsuz geometrik seridir.</strong> Bunu bir kez gördüğünde, "$0.333\\ldots = 1/3$" hilesi ezberlenmiş bir gerçek olmaktan çıkar ve tek satırlık bir hesaba dönüşür. Aynı hile $0.121212\\ldots$ değerini, harfli cebir gerektirmeden temiz bir kesre çevirir.</div>

<p class="l-text">$0.333\\ldots$ alalım. Basamak değerlerinin toplamı olarak yaz:</p>

<div class="calc-formula"><div class="formula-label">0.333... AÇILIŞI</div><div class="formula-main">$$0.333\\ldots \\;=\\; \\frac{3}{10} + \\frac{3}{100} + \\frac{3}{1000} + \\cdots$$</div><div class="formula-sub">Her sonraki terim bir öncekinin 10'a bölünmesidir. Bu, $a = 3/10$ ve $r = 1/10$ ile bir sonsuz geometrik seridir.</div></div>

<p class="l-text">Formülü uygula:</p>

<div class="calc-formula"><div class="formula-label">TOPLAYALIM</div><div class="formula-main">$$S \\;=\\; \\frac{a}{1 - r} \\;=\\; \\frac{3/10}{1 - 1/10} \\;=\\; \\frac{3/10}{9/10} \\;=\\; \\frac{3}{9} \\;=\\; \\frac{1}{3}$$</div><div class="formula-sub">Yani $0.333\\ldots = 1/3$ tam olarak — yaklaşık değil, tam. Sonsuz seri, gizli kesrin ta kendisidir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — İKİ BASAMAKLI TEKRAR</div><div class="example-body">$0.121212\\ldots$ değerini kesre çevir.<br><br>Basamak değerleri olarak yaz: $\\dfrac{12}{100} + \\dfrac{12}{10000} + \\dfrac{12}{1000000} + \\cdots$.<br><br>Bu, $a = 12/100$ ve $r = 1/100$ ile geometriktir.<br><br>$S = \\dfrac{12/100}{1 - 1/100} = \\dfrac{12/100}{99/100} = \\dfrac{12}{99} = \\dfrac{4}{33}$.<br><br>Sağlama: hesap makinesinde $4 / 33 = 0.121212\\ldots$. Doğrulandı.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — KARIŞIK ONDALIK</div><div class="example-body">$0.5\\overline{27} = 0.5272727\\ldots$ değerini kesre çevir.<br><br>Tekrarsız kısmı ayır: $0.5 + 0.0272727\\ldots = 1/2 + 0.0\\overline{27}$.<br><br>Tekrarlı kuyruk $0.0272727\\ldots = \\dfrac{27}{1000} + \\dfrac{27}{100000} + \\cdots$, $a = 27/1000$, $r = 1/100$ ile geometriktir.<br><br>$S_{\\text{kuyruk}} = \\dfrac{27/1000}{1 - 1/100} = \\dfrac{27/1000}{99/100} = \\dfrac{27}{990} = \\dfrac{3}{110}$.<br><br>Toplam: $1/2 + 3/110 = 55/110 + 3/110 = \\mathbf{58/110 = 29/55}$.</div></div>

<div class="calc-graph"><div id="plot-l66-third-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $3/10 + 3/100 + 3/1000 + \\cdots$ serisinin kısmi toplamları $1/3 \\approx 0.3333$ limitine tırmanıyor. Yalnızca altı terimden sonra kısmi toplam altı ondalık basamağa kadar doğrudur. Kesik çizgi $y = 1/3$'ü işaretler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[];var ss=[];var s=0;for(var n=1;n<=10;n++){s+=3*Math.pow(0.1,n);ns.push(n);ss.push(s);}
var bars={x:ns,y:ss,mode:'lines+markers',name:'kısmi toplam',line:{color:'#3b82f6',width:2.6},marker:{size:7,color:'#3b82f6'}};
var limit={x:[0.5,10.5],y:[1/3,1/3],mode:'lines',name:'limit = 1/3',line:{color:'#10b981',width:2,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n (ondalık basamak sayısı)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'kısmi toplam',range:[0.25,0.35],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l66-third-tr',[bars,limit],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Saf tekrarlı ondalıklar için iki satırlık kural.</strong> Tekrar eden blok $d$ basamaklı ise ve $N$ tamsayısına eşitse, $0.\\overline{N}$ (çubuk $d$-basamaklı blok üzerinde) $N / (10^d - 1)$'e eşittir. Yani $0.\\overline{3} = 3/9 = 1/3$, $0.\\overline{12} = 12/99 = 4/33$, $0.\\overline{142857} = 142857/999999 = 1/7$. Bu, kılık değiştirmiş geometrik seri formülünden başka bir şey değildir.</div>

<h2 class="lesson-title">7. Zeno Paradoksu: Aşil ve Kaplumbağa</h2>

<div class="calc-highlight"><strong>Antik bulmaca:</strong> Aşil (hızlı Yunan kahramanı) bir kaplumbağa ile yarışıyor ve kaplumbağaya avantaj veriliyor. Zeno, Aşil'in onu asla yakalayamayacağını savundu — kaplumbağanın bulunduğu yere vardığında, kaplumbağa biraz daha sürünmüş olur; o noktaya vardığında, kaplumbağa yine ilerlemiştir; ve böylece sonsuz kez. Yani hareket imkansız! Oysa Aşil kaplumbağayı geçer. Geometrik seriler paradoksu çözer.</div>

<p class="l-text">Somutlaştırmak için sayı seçelim. Kaplumbağa 100 metre önde başlasın ve 1 m/s hızla sürünsün, Aşil 10 m/s koşsun.</p>

<ul class="l-text" style="line-height:1.7">
<li><strong>Aşama 1:</strong> Aşil'in kaplumbağanın başlangıcına ulaşması $100/10 = 10$ s sürer. O 10 s'de kaplumbağa 10 m ilerlemiştir.</li>
<li><strong>Aşama 2:</strong> Aşil'in o yeni 10 m'yi kat etmesi $10/10 = 1$ s sürer. O 1 s'de kaplumbağa 0.1 m ilerler.</li>
<li><strong>Aşama 3:</strong> Aşil için $0.1/10 = 0.01$ s gerekir. Kaplumbağa $0.01 \\cdot 1 = 0.01$ m ilerler.</li>
<li>Ve böyle devam. Her aşamada Aşil önceki sürenin $1/10$'una ihtiyaç duyar ve kaplumbağa önceki mesafenin $1/10$'unu kat eder.</li>
</ul>

<p class="l-text">Aşil'in "sonsuza dek yakalama" toplam süresi:</p>

<div class="calc-formula"><div class="formula-label">ZENO ZAMAN SERİSİ</div><div class="formula-main">$$T \\;=\\; 10 + 1 + 0.1 + 0.01 + \\cdots \\;=\\; \\frac{10}{1 - 1/10} \\;=\\; \\frac{10}{9/10} \\;=\\; \\frac{100}{9} \\approx 11.11 \\;\\text{s}$$</div><div class="formula-sub">$a = 10$, $r = 1/10$ ile geometrik seri. Sonsuz sayıdaki aşama sonlu bir zamana toplanır — Aşil kaplumbağayı 11 saniyenin biraz üzerinde yakalar.</div></div>

<p class="l-text"><strong>Zeno'nun atladığı şey</strong>: sonsuz sayıda <em>aşama</em>, sonsuz <em>zaman</em> demek değildir. Her aşama bir öncekinden on kat kısa ise, toplam zaman sonludur, yakalama gerçektir ve paradoks erir.</p>

<div class="l-note"><strong>Temel cebirle çapraz kontrol.</strong> Aşil kaplumbağayı, konumları eşit olduğunda yakalar: $10 t = 100 + t$, $t = 100/9 \\approx 11.11$ s verir. Aynı cevap, sonsuz seri gerekmeden — modern çözüm budur: hareket doğal olarak sürekli terimlerle tanımlanır ve "sonsuz aşama" ayrıştırması yapaydır. Ama geometrik seri toplamı cevabı doğrular.</div>

<h2 class="lesson-title">8. Zıplayan Süper-Top</h2>

<div class="calc-highlight"><strong>Bir topu $h$ yüksekliğinden bırak, top her zıplamada bir önceki yüksekliğin $r$ kesri kadar yükselsin.</strong> $r < 1$ ise top sonsuz kez zıplar (ilkesel olarak) ama yalnızca sonlu toplam yol kat eder. Toplam yol, en sevimli geometrik seri problemlerinden biridir.</div>

<p class="l-text">Bir top $h_0 = 10$ m yükseklikten bırakılıyor. Her zıplama önceki yüksekliğin %60'ına kadar çıkıyor (yani $r = 0.6$). Top durana kadar kat ettiği toplam yol nedir?</p>

<p class="l-text"><strong>İlk düşüş:</strong> $10$ m aşağı.</p>

<p class="l-text"><strong>İlk yükselme + ilk geri düşüş:</strong> $10 r = 6$ m'ye kadar yukarı, sonra 6 m aşağı. Toplam: $2 \\cdot 6 = 12$ m.</p>

<p class="l-text"><strong>İkinci yükselme + ikinci düşüş:</strong> $10 r^2 = 3.6$ m'ye kadar yukarı, sonra 3.6 m aşağı. Toplam: $2 \\cdot 3.6 = 7.2$ m.</p>

<p class="l-text">Genel olarak ilk düşüşten sonraki $k$-inci gidiş-dönüş $2 \\cdot 10 \\cdot r^k$ metredir. Yani:</p>

<div class="calc-formula"><div class="formula-label">TOPLAM YOL</div><div class="formula-main">$$D \\;=\\; h_0 + 2 h_0 r + 2 h_0 r^2 + 2 h_0 r^3 + \\cdots \\;=\\; h_0 + 2 h_0 \\sum_{k=1}^{\\infty} r^k \\;=\\; h_0 + \\frac{2 h_0 r}{1 - r}$$</div><div class="formula-sub">İlk düşüş eşsizdir (öncesinde yükselme yok); sonraki tüm bacaklar yukarı-aşağı çift olarak gelir.</div></div>

<p class="l-text">$h_0 = 10$, $r = 0.6$ yerleştir:</p>

<div class="calc-formula"><div class="formula-label">SAYISAL CEVAP</div><div class="formula-main">$$D \\;=\\; 10 + \\frac{2 \\cdot 10 \\cdot 0.6}{1 - 0.6} \\;=\\; 10 + \\frac{12}{0.4} \\;=\\; 10 + 30 \\;=\\; \\mathbf{40 \\text{ m}}$$</div></div>

<p class="l-text">Top sonsuz kez zıplamasına rağmen toplamda 40 metre yol alır. "Sonsuz" kısmına izin verilir çünkü her yeni zıplama daha kısadır ve $|r| = 0.6 < 1$ sayesinde zıplamalar sonlu bir toplama eklenir.</p>

<div class="l-note"><strong>Gerçek dünya uyarısı:</strong> gerçekte top sonlu sayıda zıplamadan sonra durur — sürtünme, hava direnci ve madde sınırları sonunda devreye girer. Sonsuz zıplamalı matematiksel model bir idealizasyondur, ama toplam yol gerçek cevaba o kadar yakındır ki mühendisler bunu rutin olarak kullanır.</div>

<h2 class="lesson-title">9. Başka Bir Uygulama: Kalıcı Gelir</h2>

<div class="calc-highlight"><strong>Finans sorusu:</strong> yıllık faiz oranı %5 iken, her yıl sonsuza dek 1000 TL ödeyen bir sözleşme ne değerdedir? $k$ yıl sonra yapılan bir ödemenin "bugünkü değeri", nominal değerinin $(1.05)^k$'ya bölünmüş halidir. Tüm gelecek ödemeleri toplamak sonsuz bir geometrik seri verir.</div>

<p class="l-text">Kalıcı gelirin bugünkü değeri:</p>

<div class="calc-formula"><div class="formula-label">KALICI GELİR (PERPETUITY)</div><div class="formula-main">$$PV \\;=\\; \\sum_{k=1}^{\\infty} \\frac{1000}{(1 + 0.05)^k} \\;=\\; \\frac{1000 / 1.05}{1 - 1/1.05}$$</div></div>

<p class="l-text">Sadeleştir: $1 - 1/1.05 = 0.05/1.05$, yani</p>

<div class="calc-formula"><div class="formula-label">TEMİZ HAL</div><div class="formula-main">$$PV \\;=\\; \\frac{1000/1.05}{0.05/1.05} \\;=\\; \\frac{1000}{0.05} \\;=\\; \\mathbf{20\\,000 \\text{ TL}}$$</div><div class="formula-sub">Dönemde $C$ ödeyen ve $i$ faiz oranı olan bir kalıcı gelir $C/i$ değerindedir. Bu, finanstaki standart "kalıcı gelirin bugünkü değeri" formülüdür ve doğrudan geometrik seri toplamından gelir.</div></div>

<div class="think-box"><div class="think-label">SAĞLAMA</div><div class="think-body">İki senaryoyu karşılaştır. (a) Yıllık %5 faizle 20 000 TL'yi hesaba koy. Her yıl 1000 TL (faiz) çekebilirsin ve bakiye 20 000 olarak kalır. Bunu sonsuza dek yapabilirsin. (b) Kalıcı geliri 20 000 TL'ye al ve sonsuza dek yılda 1000 TL al. İkisi eşdeğer — bu yüzden $PV = C/i = 1000 / 0.05 = 20\\,000$.</div></div>

<h2 class="lesson-title">10. Yaygın Hatalar</h2>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">TUZAK 1 — $|r| \\geq 1$ İKEN FORMÜLÜ UYGULAMAK</div><div class="compare-item">$2 + 4 + 8 + 16 + \\cdots$ serisinde $a = 2$, $r = 2$.</div><div class="compare-item">Bir öğrenci $S = 2 / (1 - 2) = -2$ yazar. Saçma — pozitif sayıların toplamı negatif olamaz.</div><div class="compare-item"><strong>Çözüm:</strong> formülü uygulamadan <em>önce</em> daima $|r| < 1$'i kontrol et. $|r| \\geq 1$ ise seri ıraksar ve toplam yoktur.</div></div>
<div class="compare-col"><div class="compare-title">TUZAK 2 — $(1 - r)$'DE İŞARET HATASI</div><div class="compare-item">$r = -1/3$ için payda $1 - (-1/3) = 1 + 1/3 = 4/3$'tür, $1 - 1/3 = 2/3$ değildir.</div><div class="compare-item">Öğrenciler sıklıkla $S = 1 / (2/3) = 3/2$ yazar — yanlış cevap (doğru cevap $3/4$).</div><div class="compare-item"><strong>Çözüm:</strong> $1 - r$ ifadesini, $r$'nin işareti açıkça korunarak baştan sona yaz. Formül $r$'nin pozitif ya da negatif olmasıyla ilgilenmez; sadece işareti kaybetmemek gerekir.</div></div>
</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">TUZAK 3 — $a$'YI BELİRLEMEK</div><div class="compare-item">$\\dfrac{1}{4} + \\dfrac{1}{8} + \\dfrac{1}{16} + \\cdots$ ifadesinde ilk terim $a = 1/4$'tür, 1 değil.</div><div class="compare-item">$a$'yı her zaman yazılan en ilk sayı olarak oku — serinin başı.</div></div>
<div class="compare-col"><div class="compare-title">TUZAK 4 — İLK DÜŞÜŞÜ UNUTMAK</div><div class="compare-item">Zıplayan top probleminde ilk düşüş eşsizdir. Onu unutup $D = 2 h_0 / (1 - r)$ yazarsan zıplamaları iki kez sayar ve aşarsın.</div><div class="compare-item">Formüle yerleştirmeden önce yörüngeyi her zaman çiz.</div></div>
</div>

<h2 class="lesson-title">11. Alıştırma Problemleri</h2>

<p class="l-text">Önce her birini kağıt-kalemle kendin dene. Tam çözümler aşağıda yazılı.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — DOĞRUDAN FORMÜL</div><div class="example-body">$S = 5 + 5/2 + 5/4 + 5/8 + \\cdots$ değerini bulun.<br><br>$a = 5$, $r = 1/2$. $|r| = 1/2 < 1$, yakınsar.<br><br>$S = \\dfrac{5}{1 - 1/2} = \\dfrac{5}{1/2} = \\mathbf{10}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — NEGATİF ORAN</div><div class="example-body">$S = 4 - 4/5 + 4/25 - 4/125 + \\cdots$ değerini bul.<br><br>$a = 4$, $r = -1/5$. $|r| = 1/5 < 1$, yakınsar.<br><br>$S = \\dfrac{4}{1 - (-1/5)} = \\dfrac{4}{6/5} = \\dfrac{4 \\cdot 5}{6} = \\dfrac{20}{6} = \\mathbf{\\dfrac{10}{3}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — YAKINSAR MI?</div><div class="example-body">$3 + 3.6 + 4.32 + 5.184 + \\cdots$ sonlu bir toplama sahip mi?<br><br>Oran: $3.6 / 3 = 1.2$. $|1.2| \\geq 1$ olduğundan seri <strong>ıraksar</strong>. Toplam yok.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — TEKRARLI ONDALIK</div><div class="example-body">$0.444\\ldots$ değerini kesir olarak ifade et.<br><br>$0.444\\ldots = \\dfrac{4}{10} + \\dfrac{4}{100} + \\dfrac{4}{1000} + \\cdots$, $a = 4/10$, $r = 1/10$ ile geometrik.<br><br>$S = \\dfrac{4/10}{1 - 1/10} = \\dfrac{4/10}{9/10} = \\mathbf{\\dfrac{4}{9}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — İKİ BASAMAKLI TEKRAR</div><div class="example-body">$0.\\overline{36} = 0.363636\\ldots$ değerini en sade kesir olarak ifade et.<br><br>$a = 36/100$, $r = 1/100$ ile geometrik.<br><br>$S = \\dfrac{36/100}{99/100} = \\dfrac{36}{99} = \\mathbf{\\dfrac{4}{11}}$ (pay ve paydayı 9'a bölerek).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — ZIPLAYAN TOP</div><div class="example-body"><strong>20 m</strong>'den bırakılan bir top önceki yüksekliğin <strong>%80</strong>'ine zıplıyor. Toplam kat edilen yolu bul.<br><br>$h_0 = 20$, $r = 0.8$. $D = h_0 + 2 h_0 r / (1 - r) = 20 + 2 \\cdot 20 \\cdot 0.8 / 0.2 = 20 + 32/0.2 = 20 + 160 = \\mathbf{180 \\text{ m}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — ORANI BUL</div><div class="example-body">Sonsuz bir geometrik serinin ilk terimi 6 ve toplamı 9. <strong>$r$ nedir?</strong><br><br>$S = a / (1 - r)$ kullan: $9 = 6 / (1 - r) \\implies 1 - r = 6/9 = 2/3 \\implies r = \\mathbf{1/3}$.<br><br>Sağlama: $|1/3| < 1$, dolayısıyla bu parametrelerle yakınsak bir seri vardır.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — KARE İÇİNDE KARE</div><div class="example-body">Kenarı 1 olan bir karenin içinde, köşeleri dış karenin kenarlarının orta noktaları olan daha küçük bir kare çiziyorsun (yani kenarı orijinalin $\\sqrt{2}/2$ katı). Onun içine aynı şekilde bir tane daha, ve böyle sonsuza dek. <strong>Tüm karelerin toplam alanını bul.</strong><br><br>$k$-inci karenin kenarı: $(\\sqrt{2}/2)^k$, yani alanı $(1/2)^k$. Toplam alan: $\\sum_{k=0}^{\\infty} (1/2)^k = 1/(1 - 1/2) = \\mathbf{2}$.<br><br>İki orijinal karelik alan — her yeni kare bir öncekinin tam içinde olsa da. Sonsuz-ama-küçülen fikri yine.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sonsuz toplam = $n \\to \\infty$ iken kısmi toplamların $S_n$ limiti (eğer limit varsa)</li>
<li>Geometrik seri $a + ar + ar^2 + \\cdots$ yalnızca ve yalnızca $|r| < 1$ ise yakınsar</li>
<li>Kapalı form: $|r| < 1$ iken $S = a / (1 - r)$; aksi halde seri ıraksar</li>
<li>Tekrarlı ondalıklar gizli geometrik serilerdir: $d$-basamaklı blok ile $0.\\overline{N}$, $N / (10^d - 1)$'e eşittir</li>
<li>Zeno paradoksu erir: her aşama sabit kesir kadar daha kısa ise sonsuz aşama sonlu toplam zamana sığar</li>
<li>Zıplayan top toplam yol: $D = h_0 + 2 h_0 r / (1 - r)$ — eşsiz ilk düşüşü unutma</li>
<li>Kalıcı gelir: $PV = C / i$ — bitmeyen ödeme akışının geometrik seri limiti</li>
<li>Kaçınılacak iki klasik hata: $|r| \\geq 1$ iken formülü uygulamak ve paydada $r$'nin işaretini düşürmek</li>
</ul>
</div>`
};
