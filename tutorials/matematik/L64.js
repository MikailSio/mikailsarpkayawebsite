window.LISE_MAT_L64 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>An arithmetic sequence grows by <em>adding</em> the same number each step. A geometric sequence grows by <em>multiplying</em> by the same number each step.</strong> That single swap — addition replaced by multiplication — turns straight-line growth into something far more dramatic: numbers that double or triple from term to term, balances that compound, populations that explode, signals that decay to zero. Every situation where a quantity scales by the same proportion at each step is described by a geometric sequence.</p>

<p class="l-text">By the end of this lesson you will recognise a geometric sequence from any small handful of its terms, write down the general term $a_n = a_1 \\cdot r^{n-1}$ without thinking, sum any finite chunk of consecutive terms with the closed-form formula, predict whether the sequence grows, decays, or alternates based on the common ratio $r$, and apply the formula to real-world problems — bacteria that double every hour, money that compounds in a savings account, the first whisper of how loan amortisation works. The same algebra also unlocks the geometric mean, a slick way to find the middle term between two given terms, and the comparison with arithmetic sequences that explains why exponential growth always overtakes linear growth in the long run.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a geometric sequence and identify the first term $a_1$ and the common ratio $r$ from any consecutive pair</li>
<li>Write the general term $a_n = a_1 \\cdot r^{n-1}$ and use it to jump to any position in the sequence</li>
<li>Use the recursive form $a_{n+1} = r \\cdot a_n$ and convert between recursive and explicit definitions</li>
<li>Sum a finite geometric series with $S_n = a_1 \\dfrac{1 - r^n}{1 - r}$ for $r \\neq 1$, and recognise the special case $r = 1$</li>
<li>Classify the sequence by behaviour: growth ($|r| > 1$), decay ($0 < r < 1$), alternating ($r < 0$), constant ($r = 1$)</li>
<li>Apply geometric sequences to compound interest $A = P(1 + r/n)^{nt}$ and bacterial doubling</li>
<li>Use the geometric mean property $a_n^2 = a_{n-1} \\cdot a_{n+1}$ to find missing middle terms</li>
</ul>
</div>

<h2 class="lesson-title">1. Definition: Multiply, Don't Add</h2>

<div class="calc-highlight"><strong>A <em>geometric sequence</em> is a list of numbers in which each term after the first is obtained by multiplying the previous term by a fixed non-zero constant.</strong> That constant is called the <em>common ratio</em> and is universally written $r$. So while an arithmetic sequence steps forward by a constant <em>difference</em>, a geometric sequence steps forward by a constant <em>ratio</em>.</div>

<p class="l-text">Concretely: take a starting number — call it $a_1$ — and pick a multiplier $r$. The sequence is $a_1, \\; a_1 r, \\; a_1 r^2, \\; a_1 r^3, \\; \\ldots$ In each successive term the exponent of $r$ goes up by one. The first term has $r^0 = 1$, the second has $r^1$, the third has $r^2$, and so on. Notice that the exponent is always <strong>one less</strong> than the position number — a small detail that the general-term formula in the next section makes precise.</p>

<div class="calc-formula"><div class="formula-label">GEOMETRIC SEQUENCE &mdash; DEFINITION</div><div class="formula-main">$$a_1, \\; a_1 r, \\; a_1 r^2, \\; a_1 r^3, \\; \\ldots \\;\\;\\text{ with }\\;\\; r = \\frac{a_{n+1}}{a_n} \\;\\text{ constant for every } n$$</div><div class="formula-sub">$a_1$ is the first term; $r$ is the common ratio, equal to the quotient of any two consecutive terms (later divided by earlier). The ratio must be the same no matter which consecutive pair you pick.</div></div>

<div class="calc-example"><div class="example-label">CHECKING THE PATTERN</div><div class="example-body">Is the sequence $3, 6, 12, 24, 48, \\ldots$ geometric? Test the ratio of each consecutive pair:<br><br>$\\dfrac{6}{3} = 2$, $\\dfrac{12}{6} = 2$, $\\dfrac{24}{12} = 2$, $\\dfrac{48}{24} = 2$.<br><br>All four ratios agree — the sequence is geometric with $a_1 = 3$ and $r = 2$. Every term is double the one before it.</div></div>

<div class="calc-example"><div class="example-label">A NON-EXAMPLE</div><div class="example-body">Is $2, 4, 8, 14, 22$ geometric? Test the ratios: $\\dfrac{4}{2} = 2$, $\\dfrac{8}{4} = 2$, but $\\dfrac{14}{8} = 1.75$. The ratios do not stay constant. The sequence starts <em>looking</em> geometric but breaks at the fourth term. So no — and a single counterexample is enough to disqualify it.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Two ingredients</div><div class="card-body">A geometric sequence is fully determined by two numbers: the first term $a_1$ and the common ratio $r$. Tell me those two, and I can hand you every term.</div></div>
<div class="calc-card"><div class="card-title">Why "non-zero"</div><div class="card-body">If $r = 0$, every term after the first would be zero — a boring constant sequence in disguise, not a true geometric one. The definition excludes this.</div></div>
<div class="calc-card"><div class="card-title">Reading off $r$</div><div class="card-body">Pick any two consecutive terms and divide later by earlier. If the answer agrees for every adjacent pair, the sequence is geometric and that answer is $r$.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Quick: for the sequence $81, 27, 9, 3, 1, \\ldots$, what is $r$? Answer: $r = \\dfrac{27}{81} = \\dfrac{1}{3}$. The terms shrink by a factor of three at each step, a classic geometric decay.</div></div>

<h2 class="lesson-title">2. The General Term: $a_n = a_1 \\cdot r^{n-1}$</h2>

<div class="calc-highlight"><strong>Once you know $a_1$ and $r$, the $n$-th term is one power of $r$ away from $a_1$.</strong> Specifically, the exponent of $r$ is $n - 1$ — not $n$, because the first term carries $r^0$, not $r^1$. This off-by-one is the single most common slip in geometric-sequence problems; commit it to memory now.</div>

<div class="calc-formula"><div class="formula-label">GENERAL TERM (EXPLICIT FORMULA)</div><div class="formula-main">$$a_n \\;=\\; a_1 \\cdot r^{n-1}$$</div><div class="formula-sub">$n$ is the position (starting from 1). The exponent $n - 1$ counts how many multiplications by $r$ you have done to get from $a_1$ to $a_n$. Going from $a_1$ to $a_5$ takes four multiplications, hence $r^4$, hence $r^{5-1}$.</div></div>

<p class="l-text"><strong>Why the formula works.</strong> Starting from $a_1$, you apply $r$ once to get $a_2 = a_1 r$. Apply $r$ again and you get $a_3 = a_1 r \\cdot r = a_1 r^2$. Each step adds one more factor of $r$. To land at the $n$-th term you apply $r$ a total of $n - 1$ times — so the formula counts multiplications, not positions.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">A geometric sequence has $a_1 = 5$ and $r = 3$. Find the 7th term.<br><br>$a_7 = a_1 \\cdot r^{7-1} = 5 \\cdot 3^6 = 5 \\cdot 729 = \\mathbf{3645}$.<br><br>You could also list the terms: $5, 15, 45, 135, 405, 1215, 3645$. The formula gives the same answer in one line.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; SOLVING FOR $r$</div><div class="example-body">A geometric sequence has $a_1 = 2$ and $a_5 = 162$. Find $r$.<br><br>$a_5 = 2 \\cdot r^4 = 162 \\;\\;\\Rightarrow\\;\\; r^4 = 81 \\;\\;\\Rightarrow\\;\\; r = 3$ (taking the positive fourth root).<br><br>Sequence: $2, 6, 18, 54, 162$. ✓</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 &mdash; SOLVING FOR THE POSITION</div><div class="example-body">In the sequence $4, 8, 16, 32, \\ldots$, which term equals 2048?<br><br>$a_1 = 4$, $r = 2$, $a_n = 4 \\cdot 2^{n-1} = 2048$.<br><br>$2^{n-1} = 512 = 2^9 \\;\\;\\Rightarrow\\;\\; n - 1 = 9 \\;\\;\\Rightarrow\\;\\; \\mathbf{n = 10}$.<br><br>The 10th term is 2048.</div></div>

<div class="calc-graph"><div id="plot-l64-bars-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the first seven terms of the geometric sequence $3, 6, 12, 24, 48, 96, 192$ (with $a_1 = 3$, $r = 2$). Each bar is exactly double the height of the one before it — that's what "common ratio 2" means visually. Notice how the gap between successive bars grows wider and wider; this is the fingerprint of exponential growth, completely different from the equally-spaced bars an arithmetic sequence would produce.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=[1,2,3,4,5,6,7];var a=[3,6,12,24,48,96,192];
var bars={x:n,y:a,type:'bar',marker:{color:'#3b82f6',line:{color:'#60a5fa',width:1}},text:a.map(function(v){return v.toString();}),textposition:'outside',textfont:{color:'#e8e8e8'},name:'aₙ = 3 · 2^(n-1)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'position n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'term value aₙ',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,230]},margin:{t:40,r:30,b:55,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l64-bars-en',[bars],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. The Recursive Form: $a_{n+1} = r \\cdot a_n$</h2>

<div class="calc-highlight"><strong>Geometric sequences also admit a recursive definition: each term is $r$ times the previous one.</strong> This form is closer to how the sequence is actually generated step by step, and it is the natural way to describe processes that update one period at a time — population each year, balance each month, signal strength each second.</div>

<div class="calc-formula"><div class="formula-label">RECURSIVE DEFINITION</div><div class="formula-main">$$a_1 \\;\\text{ given,} \\qquad a_{n+1} \\;=\\; r \\cdot a_n \\;\\text{ for } n \\geq 1$$</div><div class="formula-sub">Two ingredients: a starting value $a_1$ and a recipe $a_{n+1} = r \\cdot a_n$ that tells you how to get the next term from the current one. Apply the recipe repeatedly to generate the sequence.</div></div>

<p class="l-text"><strong>Converting between forms.</strong> The recursive and explicit forms are two views of the same object. From the recursive $a_{n+1} = r \\cdot a_n$ with $a_1$ given, you can unroll the recursion: $a_2 = r a_1$, $a_3 = r a_2 = r^2 a_1$, $a_4 = r a_3 = r^3 a_1$, and in general $a_n = r^{n-1} a_1$ — which is the explicit formula from section 2. Going the other way, given the explicit form $a_n = a_1 r^{n-1}$, you can read off the recursive form by noticing $a_{n+1} / a_n = r$.</p>

<div class="calc-example"><div class="example-label">UNROLLING A RECURSION</div><div class="example-body">A sequence is defined by $a_1 = 4$ and $a_{n+1} = -\\dfrac{1}{2} a_n$. Find the first five terms and the explicit formula.<br><br>$a_1 = 4$<br>$a_2 = -\\dfrac{1}{2} \\cdot 4 = -2$<br>$a_3 = -\\dfrac{1}{2} \\cdot (-2) = 1$<br>$a_4 = -\\dfrac{1}{2} \\cdot 1 = -\\dfrac{1}{2}$<br>$a_5 = -\\dfrac{1}{2} \\cdot \\left( -\\dfrac{1}{2} \\right) = \\dfrac{1}{4}$<br><br>Explicit form: $a_n = 4 \\cdot \\left( -\\dfrac{1}{2} \\right)^{n-1}$. The signs alternate because $r$ is negative.</div></div>

<div class="l-note"><strong>When to use which.</strong> The explicit form is best when you need a specific distant term (the 100th, the 1000th) without computing all the ones in between. The recursive form is best when you are simulating a process step by step, or when the problem itself is naturally described as "each new value depends on the previous one."</div>

<h2 class="lesson-title">4. The Sum of a Finite Geometric Series</h2>

<div class="calc-highlight"><strong>Adding the first $n$ terms of a geometric sequence has a clean closed-form answer.</strong> No need to compute each term and add them by hand — a single formula gives the total. The derivation is short, well worth understanding once because it explains <em>why</em> the formula looks the way it does.</div>

<p class="l-text"><strong>Derivation.</strong> Write $S_n$ for the sum of the first $n$ terms:</p>

$$S_n \\;=\\; a_1 + a_1 r + a_1 r^2 + \\cdots + a_1 r^{n-1}.$$

<p class="l-text">Multiply both sides by $r$:</p>

$$r \\cdot S_n \\;=\\; a_1 r + a_1 r^2 + a_1 r^3 + \\cdots + a_1 r^n.$$

<p class="l-text">Subtract the second equation from the first. Every middle term cancels (it appears in both rows), leaving only $a_1$ on the top and $a_1 r^n$ on the bottom:</p>

$$S_n - r S_n \\;=\\; a_1 - a_1 r^n \\;\\;\\Longrightarrow\\;\\; S_n (1 - r) \\;=\\; a_1 (1 - r^n).$$

<p class="l-text">Divide both sides by $(1 - r)$ — legal as long as $r \\neq 1$ — and the formula falls out:</p>

<div class="calc-formula"><div class="formula-label">FINITE GEOMETRIC SUM</div><div class="formula-main">$$S_n \\;=\\; a_1 \\cdot \\frac{1 - r^n}{1 - r} \\qquad (r \\neq 1)$$</div><div class="formula-sub">$a_1$ is the first term, $r$ is the common ratio, $n$ is how many terms you are summing. The formula works for any $r$ except $r = 1$, where the denominator would be zero.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Equivalent form</div><div class="card-body">Multiplying numerator and denominator by $-1$ gives $S_n = a_1 \\dfrac{r^n - 1}{r - 1}$. Use whichever form keeps both pieces positive — the answer is identical.</div></div>
<div class="calc-card"><div class="card-title">Special case $r = 1$</div><div class="card-body">If $r = 1$, every term equals $a_1$ and there are $n$ of them, so $S_n = n \\cdot a_1$. The closed-form formula fails (division by zero), but the answer is trivial.</div></div>
<div class="calc-card"><div class="card-title">Special case $r = -1$</div><div class="card-body">The terms alternate $a_1, -a_1, a_1, -a_1, \\ldots$ Sum is $0$ if $n$ is even, $a_1$ if $n$ is odd. The formula handles this automatically: $r^n$ alternates between $-1$ and $1$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Sum the first 6 terms of $2, 6, 18, 54, \\ldots$ (so $a_1 = 2$, $r = 3$).<br><br>$S_6 = 2 \\cdot \\dfrac{1 - 3^6}{1 - 3} = 2 \\cdot \\dfrac{1 - 729}{-2} = 2 \\cdot \\dfrac{-728}{-2} = 2 \\cdot 364 = \\mathbf{728}$.<br><br>Check by direct addition: $2 + 6 + 18 + 54 + 162 + 486 = 728$. ✓</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; DECAY CASE</div><div class="example-body">Sum the first 8 terms of $1, \\dfrac{1}{2}, \\dfrac{1}{4}, \\dfrac{1}{8}, \\ldots$ (so $a_1 = 1$, $r = \\dfrac{1}{2}$).<br><br>$S_8 = 1 \\cdot \\dfrac{1 - (1/2)^8}{1 - 1/2} = \\dfrac{1 - 1/256}{1/2} = \\dfrac{255/256}{1/2} = \\dfrac{255}{128} \\approx \\mathbf{1.9922}$.<br><br>As $n$ grows, the sum approaches but never reaches 2 — a hint of the infinite geometric series, which you will meet in calculus.</div></div>

<h2 class="lesson-title">5. Special Cases: Growth, Decay, Alternating, Constant</h2>

<div class="calc-highlight"><strong>The single number $r$ controls everything about how the sequence behaves.</strong> Four cases divide the picture cleanly: rapid growth, decay toward zero, sign-flipping alternation, and the degenerate constant case.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$r > 1$: Exponential growth</div><div class="card-body">Every term is bigger than the one before. Terms shoot off to infinity. Examples: $r = 2$ (doubling), $r = 1.05$ (5% annual growth), $r = 10$ (ten-fold each step).</div></div>
<div class="calc-card"><div class="card-title">$0 < r < 1$: Decay toward zero</div><div class="card-body">Every term is smaller than the one before (in magnitude). Terms shrink toward 0 but never reach it. Examples: $r = 1/2$ (halving), $r = 0.9$ (10% loss each step), $r = 1/10$.</div></div>
<div class="calc-card"><div class="card-title">$r < 0$: Alternating signs</div><div class="card-body">Successive terms flip sign. If $|r| > 1$ they alternate <em>and</em> grow; if $|r| < 1$ they alternate <em>and</em> decay. Example: $r = -2$ gives $1, -2, 4, -8, 16, \\ldots$</div></div>
<div class="calc-card"><div class="card-title">$r = 1$: Constant</div><div class="card-body">All terms equal $a_1$. Technically geometric but uninteresting. The sum formula degenerates (we already handled this above).</div></div>
</div>

<p class="l-text">The boundary $r = -1$ is a curious special case: terms become $a_1, -a_1, a_1, -a_1, \\ldots$ — they neither grow nor decay, just toggle. The sum over an even number of terms is exactly zero; over an odd number, it is $a_1$.</p>

<div class="calc-graph"><div id="plot-l64-compare-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> arithmetic vs geometric growth on the same axes. The arithmetic sequence $2, 4, 6, 8, \\ldots$ (common difference $d = 2$) climbs as a straight line. The geometric sequence $2, 4, 8, 16, \\ldots$ (common ratio $r = 2$) starts at the same place but quickly accelerates away, leaving the arithmetic line far behind by term 8. This is the visual signature of "exponential beats linear" — true for any $r > 1$ and any $d$, no matter how favourable, given enough terms.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=[1,2,3,4,5,6,7,8,9,10];
var arith=n.map(function(k){return 2*k;});
var geo=n.map(function(k){return 2*Math.pow(2,k-1);});
var arithTr={x:n,y:arith,mode:'lines+markers',name:'arithmetic d=2',line:{color:'#10b981',width:2.5},marker:{size:8,color:'#10b981'}};
var geoTr={x:n,y:geo,mode:'lines+markers',name:'geometric r=2',line:{color:'#3b82f6',width:2.5},marker:{size:8,color:'#3b82f6'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'position n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'term value (log scale)',type:'log',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:55,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l64-compare-en',[arithTr,geoTr],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why a log scale?</strong> On a linear y-axis the geometric line shoots out of the top of the chart by term 8 and you can no longer compare. On a log scale (where each gridline is ten times the previous), the geometric line becomes a <em>straight line</em> with slope $\\log r$, while the arithmetic line curves over and flattens. Reading two-decade differences on the geometric curve makes the dominance over arithmetic instantly visible.</div>

<h2 class="lesson-title">6. Compound Interest: Geometric Sequences in Finance</h2>

<div class="calc-highlight"><strong>If you deposit money in an account that pays interest, your balance grows geometrically.</strong> Each compounding period multiplies the previous balance by a fixed factor $(1 + i)$, where $i$ is the periodic interest rate. The familiar compound-interest formula is just the general-term formula of a geometric sequence in disguise.</div>

<div class="calc-formula"><div class="formula-label">COMPOUND INTEREST</div><div class="formula-main">$$A \\;=\\; P \\left( 1 + \\frac{r}{n} \\right)^{n t}$$</div><div class="formula-sub">$P$ is the principal (initial deposit). $r$ is the annual interest rate (as a decimal). $n$ is the number of compounding periods per year. $t$ is the number of years. $A$ is the balance after $t$ years.</div></div>

<p class="l-text"><strong>The geometric-sequence view.</strong> Let $B_k$ be the balance after $k$ compounding periods. Each period the balance is multiplied by the periodic factor $(1 + r/n)$, so $B_{k+1} = (1 + r/n) B_k$. This is exactly a geometric sequence with first term $B_0 = P$ and common ratio $(1 + r/n)$. After $n t$ periods (one for each compounding event in $t$ years) the balance is $B_{n t} = P (1 + r/n)^{n t}$ — precisely the compound-interest formula.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; ANNUAL COMPOUNDING</div><div class="example-body">You deposit ₺10,000 at 8% annual interest, compounded once a year. How much do you have after 5 years?<br><br>$P = 10000$, $r = 0.08$, $n = 1$, $t = 5$:<br><br>$A = 10000 \\cdot (1 + 0.08)^5 = 10000 \\cdot 1.08^5 = 10000 \\cdot 1.46933 \\approx \\mathbf{₺14{,}693.28}$.<br><br>Geometric-sequence reading: balance is $10000, 10800, 11664, 12597.12, 13604.89, 14693.28$ — first term ₺10,000, common ratio 1.08, sixth term (year 0 through year 5 is six values) ₺14,693.28.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; MONTHLY COMPOUNDING</div><div class="example-body">Same deposit (₺10,000 at 8%), but now compounded <em>monthly</em>. After 5 years?<br><br>$P = 10000$, $r = 0.08$, $n = 12$, $t = 5$:<br><br>$A = 10000 \\cdot \\left( 1 + \\dfrac{0.08}{12} \\right)^{60} = 10000 \\cdot (1.006667)^{60} \\approx 10000 \\cdot 1.48985 \\approx \\mathbf{₺14{,}898.46}$.<br><br>More frequent compounding gives a slightly larger answer — about ₺205 more in this case. The same principal multiplied 60 times by a smaller factor beats being multiplied 5 times by a larger one.</div></div>

<div class="l-note"><strong>A preview of loan amortisation.</strong> Loans run the same arithmetic in reverse. If you borrow $P$ at periodic rate $i$ and make $n$ equal payments of size $M$, the outstanding balance after $k$ payments is $P (1+i)^k - M \\cdot \\dfrac{(1+i)^k - 1}{i}$ — the first piece is geometric growth of the debt, the second is a finite geometric sum of the payment stream pulled back to the present. Setting the balance to zero at the end determines $M$. You will see this formula again in finance courses, but the bones are pure geometric-sequence algebra.</div>

<h2 class="lesson-title">7. The Geometric Mean</h2>

<div class="calc-highlight"><strong>In a geometric sequence, every middle term is the geometric mean of its two neighbours.</strong> Just as the arithmetic mean (average) of two numbers $a$ and $b$ is $(a+b)/2$ and shows up as the middle term of an arithmetic sequence, the <em>geometric mean</em> $\\sqrt{a \\cdot b}$ shows up as the middle term of a geometric sequence.</div>

<div class="calc-formula"><div class="formula-label">GEOMETRIC MEAN PROPERTY</div><div class="formula-main">$$a_n^2 \\;=\\; a_{n-1} \\cdot a_{n+1} \\qquad\\Longleftrightarrow\\qquad a_n \\;=\\; \\pm\\sqrt{a_{n-1} \\cdot a_{n+1}}$$</div><div class="formula-sub">The middle term is the geometric mean of its neighbours: its square equals the product of the two adjacent terms.</div></div>

<p class="l-text"><strong>Why the property holds.</strong> Write the three terms in their general form:</p>

$$a_{n-1} = a_1 r^{n-2}, \\qquad a_n = a_1 r^{n-1}, \\qquad a_{n+1} = a_1 r^n.$$

<p class="l-text">Multiply the outer two:</p>

$$a_{n-1} \\cdot a_{n+1} = a_1 r^{n-2} \\cdot a_1 r^n = a_1^2 \\, r^{2n-2} = \\bigl( a_1 r^{n-1} \\bigr)^2 = a_n^2.$$

<p class="l-text">That is the identity. So whenever you know two terms with one missing in between, you can recover the missing one by taking a square root.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Three consecutive terms of a geometric sequence are $a, 12, 48$. Find $a$.<br><br>By the geometric-mean property: $12^2 = a \\cdot 48 \\;\\Rightarrow\\; 144 = 48 a \\;\\Rightarrow\\; \\mathbf{a = 3}$.<br><br>Check: the three terms are $3, 12, 48$, with ratios $12/3 = 4$ and $48/12 = 4$ — both equal, confirming geometric with $r = 4$.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ARITHMETIC MEAN</div><div class="compare-item">Middle term of arithmetic sequence</div><div class="compare-item">$a_n = \\dfrac{a_{n-1} + a_{n+1}}{2}$</div><div class="compare-item">Always defined for real numbers</div><div class="compare-item">"Average" in everyday language</div></div><div class="compare-col"><div class="compare-title">GEOMETRIC MEAN</div><div class="compare-item">Middle term of geometric sequence</div><div class="compare-item">$a_n = \\pm\\sqrt{a_{n-1} \\cdot a_{n+1}}$</div><div class="compare-item">Requires non-negative product</div><div class="compare-item">Used for ratios, growth rates, geometric averages</div></div></div>

<h2 class="lesson-title">8. Comparison with Arithmetic Sequences</h2>

<div class="calc-highlight"><strong>Arithmetic sequences grow linearly; geometric sequences grow exponentially.</strong> No matter how large the common difference $d$ of an arithmetic sequence, and no matter how small the common ratio $r > 1$ of a geometric sequence, the geometric one eventually overtakes the arithmetic one and never looks back.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ARITHMETIC</div><div class="compare-item">Step rule: $a_{n+1} = a_n + d$</div><div class="compare-item">General term: $a_n = a_1 + (n-1) d$</div><div class="compare-item">Sum: $S_n = \\dfrac{n}{2}(a_1 + a_n)$</div><div class="compare-item">Graph: straight line in $n$</div><div class="compare-item">Doubles? Slowly — every fixed increment</div></div><div class="compare-col"><div class="compare-title">GEOMETRIC</div><div class="compare-item">Step rule: $a_{n+1} = r \\cdot a_n$</div><div class="compare-item">General term: $a_n = a_1 \\cdot r^{n-1}$</div><div class="compare-item">Sum: $S_n = a_1 \\dfrac{1-r^n}{1-r}$</div><div class="compare-item">Graph: exponential curve (straight on log scale)</div><div class="compare-item">Doubles? Quickly — every fixed multiple</div></div></div>

<p class="l-text"><strong>A famous illustration.</strong> The legend of the chessboard and the rice grains. A king is asked to put 1 grain on the first square, 2 on the second, 4 on the third, doubling each time. That is a geometric sequence with $a_1 = 1$ and $r = 2$. By the 64th square the count is $2^{63} \\approx 9.2 \\times 10^{18}$ grains — more rice than has been grown in human history. The same calculation done arithmetically (1, 2, 3, 4, ... by adding 1) would land at just 64 on the final square. That gap is the moral.</p>

<div class="calc-graph"><div id="plot-l64-cumul-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the cumulative sum of the geometric sequence $1, 2, 4, 8, 16, \\ldots$ as a line plot. The y-coordinate at position $n$ is $S_n = 2^n - 1$ (using $a_1 = 1$, $r = 2$, applying the sum formula). The curve climbs nearly vertically by the end — at $n = 10$ the partial sum is 1023, at $n = 15$ it is 32767. Each new term roughly doubles the total so far, which is why geometric partial sums explode rather than settle.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=[1,2,3,4,5,6,7,8,9,10,11,12];
var S=n.map(function(k){return Math.pow(2,k)-1;});
var trace={x:n,y:S,mode:'lines+markers',name:'Sₙ = 2ⁿ - 1',line:{color:'#3b82f6',width:2.5},marker:{size:8,color:'#3b82f6'},text:S.map(function(v){return v.toString();}),textposition:'top center',textfont:{color:'#e8e8e8',size:10}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'number of terms n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'cumulative sum Sₙ',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:55,l:70},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l64-cumul-en',[trace],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Common Errors and How to Avoid Them</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Confusing $r$ with $d$</div><div class="card-body">Some students compute $a_{n+1} - a_n$ (a <em>difference</em>) when they should compute $a_{n+1} / a_n$ (a <em>ratio</em>). Always check: in a geometric sequence the <em>ratio</em> is constant, not the difference.</div></div>
<div class="calc-card"><div class="card-title">Off-by-one in the exponent</div><div class="card-body">The formula is $a_n = a_1 r^{n-1}$, not $a_1 r^n$. The first term has $r^0$, not $r^1$. Test on $n = 1$: the formula gives $a_1 \\cdot r^0 = a_1$, correct.</div></div>
<div class="calc-card"><div class="card-title">Sign errors when $r < 0$</div><div class="card-body">When $r$ is negative, odd-power terms are negative and even-power terms are positive (assuming $a_1 > 0$). Don't drop the sign in $r^{n-1}$ — keep brackets around the negative ratio: $(-2)^{n-1}$, not $-2^{n-1}$.</div></div>
<div class="calc-card"><div class="card-title">Using $S_n$ formula with $r = 1$</div><div class="card-body">Division by zero. If you spot $r = 1$, the answer is just $n \\cdot a_1$ directly — no formula needed.</div></div>
<div class="calc-card"><div class="card-title">Power vs index confusion</div><div class="card-body">$2^{n-1}$ and $2 \\cdot (n-1)$ are very different. The first is exponential growth, the second is linear. Read the exponent carefully — it is in the <em>superscript</em>, not the multiplier.</div></div>
<div class="calc-card"><div class="card-title">Geometric mean with negative product</div><div class="card-body">$\\sqrt{a \\cdot b}$ requires $a \\cdot b \\geq 0$. If the two neighbours have opposite signs (which can happen with $r < 0$), use the formula carefully — both square roots ($\\pm$) are candidates and only one matches the actual sequence.</div></div>
</div>

<h2 class="lesson-title">10. Practice Problems</h2>

<p class="l-text">Eight standard exercises covering every operation in the lesson. Try each one before reading the solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; IDENTIFY THE RATIO</div><div class="example-body"><strong>Is the sequence</strong> $5, 15, 45, 135, 405$ <strong>geometric? If so, what are $a_1$ and $r$?</strong><br><br>Ratios: $15/5 = 3$, $45/15 = 3$, $135/45 = 3$, $405/135 = 3$. All equal, so yes. $\\mathbf{a_1 = 5, \\; r = 3}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; GENERAL TERM</div><div class="example-body"><strong>For the sequence above, find the 8th term.</strong><br><br>$a_8 = 5 \\cdot 3^{8-1} = 5 \\cdot 3^7 = 5 \\cdot 2187 = \\mathbf{10{,}935}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; SOLVING FOR $r$</div><div class="example-body"><strong>A geometric sequence has</strong> $a_1 = 7$ <strong>and</strong> $a_4 = 189$. <strong>Find $r$.</strong><br><br>$a_4 = 7 r^3 = 189 \\;\\Rightarrow\\; r^3 = 27 \\;\\Rightarrow\\; \\mathbf{r = 3}$. Sequence: $7, 21, 63, 189$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; FINITE SUM</div><div class="example-body"><strong>Sum the first 7 terms of</strong> $3, 6, 12, 24, \\ldots$ <strong>($a_1 = 3$, $r = 2$).</strong><br><br>$S_7 = 3 \\cdot \\dfrac{1 - 2^7}{1 - 2} = 3 \\cdot \\dfrac{1 - 128}{-1} = 3 \\cdot 127 = \\mathbf{381}$.<br><br>Check: $3 + 6 + 12 + 24 + 48 + 96 + 192 = 381$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; DECAY SUM</div><div class="example-body"><strong>Sum the first 10 terms of</strong> $9, 3, 1, 1/3, \\ldots$ <strong>($a_1 = 9$, $r = 1/3$).</strong><br><br>$S_{10} = 9 \\cdot \\dfrac{1 - (1/3)^{10}}{1 - 1/3} = 9 \\cdot \\dfrac{1 - 1/59049}{2/3} = 9 \\cdot \\dfrac{3}{2} \\cdot \\dfrac{59048}{59049} = \\dfrac{27}{2} \\cdot \\dfrac{59048}{59049} \\approx \\mathbf{13.4998}$.<br><br>The total is creeping toward 13.5 — the infinite-sum limit, which equals $a_1 / (1 - r) = 9 / (2/3) = 13.5$ exactly.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; COMPOUND INTEREST</div><div class="example-body"><strong>You deposit ₺5,000 at 6% annual interest, compounded quarterly. How much after 3 years?</strong><br><br>$P = 5000$, $r = 0.06$, $n = 4$, $t = 3$:<br><br>$A = 5000 \\cdot \\left( 1 + \\dfrac{0.06}{4} \\right)^{12} = 5000 \\cdot (1.015)^{12} \\approx 5000 \\cdot 1.19562 \\approx \\mathbf{₺5{,}978.09}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; GEOMETRIC MEAN</div><div class="example-body"><strong>Three consecutive terms of a geometric sequence are</strong> $5, x, 80$. <strong>Find $x$.</strong><br><br>$x^2 = 5 \\cdot 80 = 400 \\;\\Rightarrow\\; x = \\pm 20$.<br><br>Both work: $5, 20, 80$ has $r = 4$, and $5, -20, 80$ has $r = -4$. Without extra constraints both are valid answers.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; BACTERIAL DOUBLING</div><div class="example-body"><strong>A bacterial culture doubles every 20 minutes. Starting with 500 cells, how many cells are there after 4 hours?</strong><br><br>4 hours = 240 minutes = 12 doubling periods. Each period multiplies the count by 2. So this is a geometric sequence with $a_1 = 500$ and $r = 2$, evaluated at position $n = 13$ (initial state plus 12 doublings):<br><br>$a_{13} = 500 \\cdot 2^{12} = 500 \\cdot 4096 = \\mathbf{2{,}048{,}000}$ cells.<br><br>Two million cells from five hundred in just four hours — that is the power of geometric growth.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Geometric sequence: each term is the previous one multiplied by a fixed ratio $r$</li>
<li>General term: $a_n = a_1 \\cdot r^{n-1}$ — note the off-by-one in the exponent</li>
<li>Recursive form: $a_{n+1} = r \\cdot a_n$, useful when describing step-by-step processes</li>
<li>Finite sum: $S_n = a_1 \\dfrac{1 - r^n}{1 - r}$ for $r \\neq 1$; for $r = 1$ use $S_n = n \\cdot a_1$</li>
<li>Behaviour depends on $r$: growth ($|r| > 1$), decay ($0 < |r| < 1$), alternation ($r < 0$), constant ($r = 1$)</li>
<li>Compound interest $A = P(1 + r/n)^{nt}$ is a geometric sequence applied to money</li>
<li>Geometric mean: $a_n^2 = a_{n-1} \\cdot a_{n+1}$, recovers a missing middle term from its neighbours</li>
<li>Compared with arithmetic: exponential always overtakes linear given enough terms</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Aritmetik dizi her adımda aynı sayıyı <em>ekleyerek</em> büyür. Geometrik dizi ise her adımda aynı sayıyla <em>çarparak</em> büyür.</strong> Toplama yerine çarpmanın geçtiği bu tek değişiklik, doğrusal büyümeyi çok daha çarpıcı bir şeye dönüştürür: terimden terime ikiye veya üçe katlanan sayılar, bileşik faiz ile büyüyen bakiyeler, patlayarak artan popülasyonlar, sıfıra doğru sönen sinyaller. Bir niceliğin her adımda aynı oranda ölçeklendiği her durum bir geometrik diziyle açıklanır.</p>

<p class="l-text">Bu dersin sonunda küçük bir kaç terimden geometrik diziyi tanıyacak, genel terim $a_n = a_1 \\cdot r^{n-1}$ formülünü hiç düşünmeden yazacak, ardışık terimlerden oluşan herhangi bir sonlu parçayı kapalı formülle toplayacak, ortak çarpan $r$'ye bakarak dizinin büyüyüp büyümeyeceğini, söneceğini ya da işaret değiştireceğini öngörecek ve formülü gerçek dünya problemlerine uygulayacaksın — her saat ikiye katlanan bakteriler, tasarruf hesabında büyüyen para, kredi taksitlendirmesinin nasıl çalıştığına dair ilk ipuçları. Aynı cebir, iki bilinen terim arasındaki orta terimi bulmanın zarif yolu olan geometrik ortalamayı da açar; aritmetik dizilerle karşılaştırma ise üstel büyümenin uzun vadede neden doğrusal büyümeyi her zaman geçtiğini gösterir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Geometrik diziyi tanımla ve herhangi bir ardışık ikiliden ilk terim $a_1$ ile ortak çarpan $r$'yi belirle</li>
<li>Genel terimi $a_n = a_1 \\cdot r^{n-1}$ şeklinde yaz ve dizide herhangi bir konuma sıçra</li>
<li>Özyinelemeli formu $a_{n+1} = r \\cdot a_n$ kullan ve özyinelemeli ile açık tanım arasında geçiş yap</li>
<li>$r \\neq 1$ için sonlu geometrik toplamı $S_n = a_1 \\dfrac{1 - r^n}{1 - r}$ ile hesapla; $r = 1$ özel durumunu fark et</li>
<li>Diziyi davranışına göre sınıflandır: büyüme ($|r| > 1$), sönüm ($0 < r < 1$), işaret değişimi ($r < 0$), sabit ($r = 1$)</li>
<li>Geometrik diziyi bileşik faize $A = P(1 + r/n)^{nt}$ ve bakteri çoğalmasına uygula</li>
<li>Geometrik ortalama özelliği $a_n^2 = a_{n-1} \\cdot a_{n+1}$ ile eksik orta terimi bul</li>
</ul>
</div>

<h2 class="lesson-title">1. Tanım: Topla Değil, Çarp</h2>

<div class="calc-highlight"><strong><em>Geometrik dizi</em>, ilk terimden sonra her terimin önceki terimi sabit ve sıfırdan farklı bir sayıyla çarparak elde edildiği bir sayı listesidir.</strong> Bu sabit sayıya <em>ortak çarpan</em> denir ve evrensel olarak $r$ ile gösterilir. Yani aritmetik dizi sabit bir <em>fark</em> ile ilerlerken, geometrik dizi sabit bir <em>oran</em> ile ilerler.</div>

<p class="l-text">Somut olarak: bir başlangıç sayısı al — buna $a_1$ diyelim — ve bir çarpan $r$ seç. Dizi $a_1, \\; a_1 r, \\; a_1 r^2, \\; a_1 r^3, \\; \\ldots$ şeklindedir. Her bir sonraki terimde $r$'nin üssü bir artar. İlk terimde $r^0 = 1$, ikincide $r^1$, üçüncüde $r^2$, ve böyle devam eder. Dikkat: üs her zaman konum numarasından <strong>bir eksiktir</strong> — bir sonraki bölümdeki genel terim formülünün netleştirdiği küçük bir ayrıntı.</p>

<div class="calc-formula"><div class="formula-label">GEOMETRİK DİZİ &mdash; TANIM</div><div class="formula-main">$$a_1, \\; a_1 r, \\; a_1 r^2, \\; a_1 r^3, \\; \\ldots \\;\\;\\text{ ve }\\;\\; r = \\frac{a_{n+1}}{a_n} \\;\\text{ her } n \\text{ için sabit}$$</div><div class="formula-sub">$a_1$ ilk terim; $r$ ortak çarpan, herhangi iki ardışık terimin oranına (sonraki bölü önceki) eşittir. Hangi ardışık çifti seçersen seç oran aynı olmalıdır.</div></div>

<div class="calc-example"><div class="example-label">DESEN KONTROLÜ</div><div class="example-body">$3, 6, 12, 24, 48, \\ldots$ dizisi geometrik midir? Her ardışık ikilinin oranını sına:<br><br>$\\dfrac{6}{3} = 2$, $\\dfrac{12}{6} = 2$, $\\dfrac{24}{12} = 2$, $\\dfrac{48}{24} = 2$.<br><br>Dört oran da aynı — dizi geometriktir ve $a_1 = 3$, $r = 2$. Her terim bir öncekinin iki katıdır.</div></div>

<div class="calc-example"><div class="example-label">KARŞI ÖRNEK</div><div class="example-body">$2, 4, 8, 14, 22$ geometrik midir? Oranları sına: $\\dfrac{4}{2} = 2$, $\\dfrac{8}{4} = 2$, ama $\\dfrac{14}{8} = 1.75$. Oranlar sabit kalmıyor. Dizi <em>başlangıçta</em> geometrik gibi görünse de dördüncü terimde bozuluyor. Cevap hayır — ve tek bir karşı örnek diziyi diskalifiye etmeye yeter.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İki bileşen</div><div class="card-body">Bir geometrik dizi iki sayıyla tamamen belirlenir: ilk terim $a_1$ ve ortak çarpan $r$. Bunları söyle, her terimini sana çıkarırım.</div></div>
<div class="calc-card"><div class="card-title">"Sıfırdan farklı" niye</div><div class="card-body">$r = 0$ olsaydı ilk terimden sonraki her terim sıfır olurdu — kılık değiştirmiş sıkıcı bir sabit dizi, gerçek bir geometrik dizi değil. Tanım bunu dışarıda bırakır.</div></div>
<div class="calc-card"><div class="card-title">$r$'yi okumak</div><div class="card-body">Ardışık iki terim seç ve sonrakini önceki üzerine böl. Her komşu çift için aynı cevap çıkıyorsa dizi geometriktir ve cevap $r$'dir.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Hızlı soru: $81, 27, 9, 3, 1, \\ldots$ dizisi için $r$ nedir? Cevap: $r = \\dfrac{27}{81} = \\dfrac{1}{3}$. Terimler her adımda üçe bölünür — klasik bir geometrik sönüm.</div></div>

<h2 class="lesson-title">2. Genel Terim: $a_n = a_1 \\cdot r^{n-1}$</h2>

<div class="calc-highlight"><strong>$a_1$ ve $r$'yi bildiğinde, $n$'inci terim $a_1$'den bir $r$ kuvveti uzaklıktadır.</strong> Daha kesin: $r$'nin üssü $n$ değil $n - 1$'dir, çünkü ilk terim $r^1$ değil $r^0$ taşır. Bu bir-fark, geometrik dizi problemlerinde en sık yapılan hatadır; hemen ezberle.</div>

<div class="calc-formula"><div class="formula-label">GENEL TERİM (AÇIK FORMÜL)</div><div class="formula-main">$$a_n \\;=\\; a_1 \\cdot r^{n-1}$$</div><div class="formula-sub">$n$ konum numarasıdır (1'den başlar). $n - 1$ üssü, $a_1$'den $a_n$'ye gitmek için kaç kez $r$ ile çarptığını sayar. $a_1$'den $a_5$'e dört çarpma var, dolayısıyla $r^4$, yani $r^{5-1}$.</div></div>

<p class="l-text"><strong>Formül neden çalışıyor.</strong> $a_1$'den başla, $r$'yi bir kez uygula: $a_2 = a_1 r$. Tekrar uygula: $a_3 = a_1 r \\cdot r = a_1 r^2$. Her adım bir $r$ çarpanı ekler. $n$'inci terime ulaşmak için $r$'yi toplamda $n - 1$ kez uygularsın — yani formül konumları değil çarpmaları sayar.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">Bir geometrik dizide $a_1 = 5$ ve $r = 3$. 7. terimi bul.<br><br>$a_7 = a_1 \\cdot r^{7-1} = 5 \\cdot 3^6 = 5 \\cdot 729 = \\mathbf{3645}$.<br><br>Terimleri listele kontrol: $5, 15, 45, 135, 405, 1215, 3645$. Formül aynı cevabı tek satırda verdi.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 &mdash; $r$ İÇİN ÇÖZME</div><div class="example-body">Bir geometrik dizide $a_1 = 2$ ve $a_5 = 162$. $r$'yi bul.<br><br>$a_5 = 2 \\cdot r^4 = 162 \\;\\;\\Rightarrow\\;\\; r^4 = 81 \\;\\;\\Rightarrow\\;\\; r = 3$ (pozitif dördüncü kök).<br><br>Dizi: $2, 6, 18, 54, 162$. ✓</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3 &mdash; KONUM İÇİN ÇÖZME</div><div class="example-body">$4, 8, 16, 32, \\ldots$ dizisinde hangi terim 2048'e eşittir?<br><br>$a_1 = 4$, $r = 2$, $a_n = 4 \\cdot 2^{n-1} = 2048$.<br><br>$2^{n-1} = 512 = 2^9 \\;\\;\\Rightarrow\\;\\; n - 1 = 9 \\;\\;\\Rightarrow\\;\\; \\mathbf{n = 10}$.<br><br>10. terim 2048'dir.</div></div>

<div class="calc-graph"><div id="plot-l64-bars-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $3, 6, 12, 24, 48, 96, 192$ geometrik dizisinin ilk yedi terimi ($a_1 = 3$, $r = 2$). Her çubuk bir öncekinin tam iki katı yüksekliktedir — "ortak çarpan 2" görsel olarak budur. Ardışık çubuklar arasındaki farkın gittikçe büyüdüğüne dikkat et; bu üstel büyümenin parmak izidir, aritmetik dizinin üreteceği eşit aralıklı çubuklardan tamamen farklıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=[1,2,3,4,5,6,7];var a=[3,6,12,24,48,96,192];
var bars={x:n,y:a,type:'bar',marker:{color:'#3b82f6',line:{color:'#60a5fa',width:1}},text:a.map(function(v){return v.toString();}),textposition:'outside',textfont:{color:'#e8e8e8'},name:'aₙ = 3 · 2^(n-1)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'konum n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'terim değeri aₙ',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,230]},margin:{t:40,r:30,b:55,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l64-bars-tr',[bars],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Özyinelemeli Form: $a_{n+1} = r \\cdot a_n$</h2>

<div class="calc-highlight"><strong>Geometrik diziler özyinelemeli tanımı da kabul eder: her terim bir öncekinin $r$ katıdır.</strong> Bu form, dizinin adım adım üretilme biçimine daha yakındır ve dönemler halinde güncellenen süreçleri tanımlamanın doğal yoludur — her yıl popülasyon, her ay bakiye, her saniye sinyal gücü.</div>

<div class="calc-formula"><div class="formula-label">ÖZYİNELEMELİ TANIM</div><div class="formula-main">$$a_1 \\;\\text{ verilir,} \\qquad a_{n+1} \\;=\\; r \\cdot a_n \\;\\text{ ve } n \\geq 1$$</div><div class="formula-sub">İki bileşen: başlangıç değeri $a_1$ ve sonraki terimi şimdikinden üreten kural $a_{n+1} = r \\cdot a_n$. Kuralı tekrar tekrar uygulayarak diziyi üret.</div></div>

<p class="l-text"><strong>Formlar arasında geçiş.</strong> Özyinelemeli ve açık formlar aynı nesnenin iki görünümüdür. $a_1$ verili özyineleme $a_{n+1} = r \\cdot a_n$'den özyinelemeyi açabilirsin: $a_2 = r a_1$, $a_3 = r a_2 = r^2 a_1$, $a_4 = r a_3 = r^3 a_1$ ve genel olarak $a_n = r^{n-1} a_1$ — bu da 2. bölümdeki açık formüldür. Diğer yönde, açık form $a_n = a_1 r^{n-1}$ verildiğinde $a_{n+1} / a_n = r$ olduğunu fark ederek özyinelemeli formu okuyabilirsin.</p>

<div class="calc-example"><div class="example-label">ÖZYİNELEMEYİ AÇMAK</div><div class="example-body">Bir dizi $a_1 = 4$ ve $a_{n+1} = -\\dfrac{1}{2} a_n$ ile tanımlanmıştır. İlk beş terimi ve açık formülü bul.<br><br>$a_1 = 4$<br>$a_2 = -\\dfrac{1}{2} \\cdot 4 = -2$<br>$a_3 = -\\dfrac{1}{2} \\cdot (-2) = 1$<br>$a_4 = -\\dfrac{1}{2} \\cdot 1 = -\\dfrac{1}{2}$<br>$a_5 = -\\dfrac{1}{2} \\cdot \\left( -\\dfrac{1}{2} \\right) = \\dfrac{1}{4}$<br><br>Açık form: $a_n = 4 \\cdot \\left( -\\dfrac{1}{2} \\right)^{n-1}$. $r$ negatif olduğu için işaretler değişir.</div></div>

<div class="l-note"><strong>Hangisini ne zaman kullanmalı.</strong> Açık form, aradakileri hesaplamadan belirli bir uzak terime (100., 1000.) ihtiyacın olduğunda en iyisidir. Özyinelemeli form, adım adım bir süreci simüle ediyorsan ya da problem doğal olarak "her yeni değer öncekine bağlı" şeklinde tanımlanıyorsa en iyisidir.</div>

<h2 class="lesson-title">4. Sonlu Geometrik Serinin Toplamı</h2>

<div class="calc-highlight"><strong>Bir geometrik dizinin ilk $n$ teriminin toplamı temiz bir kapalı formül kabul eder.</strong> Her terimi hesaplayıp elle toplamana gerek yok — tek bir formül toplamı verir. Türev kısa ve formülün neden o şekilde göründüğünü açıkladığı için bir kez anlaşılmaya değer.</div>

<p class="l-text"><strong>Türev.</strong> $S_n$ ile ilk $n$ terimin toplamını gösterelim:</p>

$$S_n \\;=\\; a_1 + a_1 r + a_1 r^2 + \\cdots + a_1 r^{n-1}.$$

<p class="l-text">Her iki tarafı $r$ ile çarp:</p>

$$r \\cdot S_n \\;=\\; a_1 r + a_1 r^2 + a_1 r^3 + \\cdots + a_1 r^n.$$

<p class="l-text">İkinci denklemi birinciden çıkar. Ortadaki bütün terimler birbirini götürür (her iki satırda da var), geriye üstte $a_1$, altta $a_1 r^n$ kalır:</p>

$$S_n - r S_n \\;=\\; a_1 - a_1 r^n \\;\\;\\Longrightarrow\\;\\; S_n (1 - r) \\;=\\; a_1 (1 - r^n).$$

<p class="l-text">Her iki tarafı $(1 - r)$'ye böl — $r \\neq 1$ olduğu sürece geçerlidir — ve formül ortaya çıkar:</p>

<div class="calc-formula"><div class="formula-label">SONLU GEOMETRİK TOPLAM</div><div class="formula-main">$$S_n \\;=\\; a_1 \\cdot \\frac{1 - r^n}{1 - r} \\qquad (r \\neq 1)$$</div><div class="formula-sub">$a_1$ ilk terim, $r$ ortak çarpan, $n$ kaç terim topladığın. Formül $r = 1$ dışında her $r$ için çalışır — orada payda sıfır olurdu.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eşdeğer biçim</div><div class="card-body">Pay ve paydayı $-1$ ile çarparak $S_n = a_1 \\dfrac{r^n - 1}{r - 1}$ elde edilir. İki parçayı da pozitif tutan biçimi kullan — cevap aynıdır.</div></div>
<div class="calc-card"><div class="card-title">$r = 1$ özel durumu</div><div class="card-body">$r = 1$ ise her terim $a_1$'e eşit ve $n$ tane var, yani $S_n = n \\cdot a_1$. Kapalı formül başarısız olur (sıfıra bölme), ama cevap basittir.</div></div>
<div class="calc-card"><div class="card-title">$r = -1$ özel durumu</div><div class="card-body">Terimler $a_1, -a_1, a_1, -a_1, \\ldots$ şeklinde dönüşür. $n$ çift ise toplam $0$, tek ise $a_1$. Formül bunu otomatik halleder: $r^n$ $-1$ ile $1$ arasında dönüşür.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$2, 6, 18, 54, \\ldots$ dizisinin ilk 6 terimini topla ($a_1 = 2$, $r = 3$).<br><br>$S_6 = 2 \\cdot \\dfrac{1 - 3^6}{1 - 3} = 2 \\cdot \\dfrac{1 - 729}{-2} = 2 \\cdot \\dfrac{-728}{-2} = 2 \\cdot 364 = \\mathbf{728}$.<br><br>Doğrudan toplama ile kontrol et: $2 + 6 + 18 + 54 + 162 + 486 = 728$. ✓</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 &mdash; SÖNÜM DURUMU</div><div class="example-body">$1, \\dfrac{1}{2}, \\dfrac{1}{4}, \\dfrac{1}{8}, \\ldots$ dizisinin ilk 8 terimini topla ($a_1 = 1$, $r = \\dfrac{1}{2}$).<br><br>$S_8 = 1 \\cdot \\dfrac{1 - (1/2)^8}{1 - 1/2} = \\dfrac{1 - 1/256}{1/2} = \\dfrac{255/256}{1/2} = \\dfrac{255}{128} \\approx \\mathbf{1.9922}$.<br><br>$n$ büyüdükçe toplam 2'ye yaklaşır ama hiçbir zaman ulaşmaz — kalkülüsteki sonsuz geometrik serinin habercisi.</div></div>

<h2 class="lesson-title">5. Özel Durumlar: Büyüme, Sönüm, İşaret Değişimi, Sabit</h2>

<div class="calc-highlight"><strong>Tek bir sayı $r$ dizinin nasıl davrandığı hakkında her şeyi belirler.</strong> Resim dört duruma temiz biçimde ayrılır: hızlı büyüme, sıfıra sönüm, işaret değişimi ve dejenere sabit durum.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$r > 1$: Üstel büyüme</div><div class="card-body">Her terim bir öncekinden büyük. Terimler sonsuza fırlar. Örnekler: $r = 2$ (ikiye katlama), $r = 1.05$ (%5 yıllık büyüme), $r = 10$ (her adımda on kat).</div></div>
<div class="calc-card"><div class="card-title">$0 < r < 1$: Sıfıra sönüm</div><div class="card-body">Her terim bir öncekinden (mutlak değerce) küçük. Terimler 0'a doğru küçülür ama hiç ulaşmaz. Örnekler: $r = 1/2$ (yarıya), $r = 0.9$ (her adımda %10 kayıp), $r = 1/10$.</div></div>
<div class="calc-card"><div class="card-title">$r < 0$: İşaret değişimi</div><div class="card-body">Ardışık terimler işaret değiştirir. $|r| > 1$ ise hem değişir hem büyür; $|r| < 1$ ise hem değişir hem söner. Örnek: $r = -2$ verir $1, -2, 4, -8, 16, \\ldots$</div></div>
<div class="calc-card"><div class="card-title">$r = 1$: Sabit</div><div class="card-body">Tüm terimler $a_1$'e eşit. Teknik olarak geometrik ama ilgisiz. Toplam formülü bozulur (yukarıda bunu zaten ele aldık).</div></div>
</div>

<p class="l-text">$r = -1$ sınır durumu ilgi çekici özel bir durumdur: terimler $a_1, -a_1, a_1, -a_1, \\ldots$ olur — ne büyür ne söner, sadece değişir. Çift sayıda terim üzerinden toplam tam olarak sıfır, tek sayıda terim üzerinden ise $a_1$'dir.</p>

<div class="calc-graph"><div id="plot-l64-compare-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> aynı eksenler üzerinde aritmetik karşı geometrik büyüme. $2, 4, 6, 8, \\ldots$ aritmetik dizisi (ortak fark $d = 2$) düz çizgi olarak yükselir. $2, 4, 8, 16, \\ldots$ geometrik dizisi (ortak çarpan $r = 2$) aynı yerden başlar ama hızla hızlanır ve 8. terime gelindiğinde aritmetik doğruyu çok geride bırakır. Bu "üstel doğrusalı yener"in görsel imzasıdır — yeterince terim verildiğinde her $r > 1$ ve her $d$ için doğrudur, fark ne kadar büyük olursa olsun.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=[1,2,3,4,5,6,7,8,9,10];
var arith=n.map(function(k){return 2*k;});
var geo=n.map(function(k){return 2*Math.pow(2,k-1);});
var arithTr={x:n,y:arith,mode:'lines+markers',name:'aritmetik d=2',line:{color:'#10b981',width:2.5},marker:{size:8,color:'#10b981'}};
var geoTr={x:n,y:geo,mode:'lines+markers',name:'geometrik r=2',line:{color:'#3b82f6',width:2.5},marker:{size:8,color:'#3b82f6'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'konum n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'terim değeri (log eksen)',type:'log',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:55,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l64-compare-tr',[arithTr,geoTr],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Neden log eksen?</strong> Doğrusal y-ekseninde geometrik çizgi 8. terimde grafiğin tepesinden taşar ve karşılaştırma yapamazsın. Log eksende (her ızgara çizgisi öncekinin on katı), geometrik çizgi eğimi $\\log r$ olan bir <em>doğruya</em> dönüşür, aritmetik çizgi ise bükülerek düzleşir. Geometrik eğri üzerindeki iki dekatlık farkları okumak, aritmetiğe olan üstünlüğünü anında görünür kılar.</div>

<h2 class="lesson-title">6. Bileşik Faiz: Finansta Geometrik Diziler</h2>

<div class="calc-highlight"><strong>Faiz ödeyen bir hesaba para yatırırsan, bakiyen geometrik olarak büyür.</strong> Her dönem önceki bakiyeyi sabit bir çarpan $(1 + i)$ ile çarpar; burada $i$ dönemlik faiz oranıdır. Tanıdık bileşik faiz formülü, kılık değiştirmiş bir geometrik dizinin genel terim formülünden başka bir şey değildir.</div>

<div class="calc-formula"><div class="formula-label">BİLEŞİK FAİZ</div><div class="formula-main">$$A \\;=\\; P \\left( 1 + \\frac{r}{n} \\right)^{n t}$$</div><div class="formula-sub">$P$ ana para (başlangıç yatırımı). $r$ yıllık faiz oranı (ondalık). $n$ yıllık bileşikleştirme dönemlerinin sayısı. $t$ yıl sayısı. $A$ $t$ yıl sonraki bakiye.</div></div>

<p class="l-text"><strong>Geometrik dizi bakışı.</strong> $B_k$ ile $k$ bileşikleştirme döneminden sonraki bakiyeyi gösterelim. Her dönem bakiye dönemlik çarpan $(1 + r/n)$ ile çarpılır, yani $B_{k+1} = (1 + r/n) B_k$. Bu, ilk terimi $B_0 = P$ ve ortak çarpanı $(1 + r/n)$ olan tam bir geometrik dizidir. $n t$ dönem sonunda ($t$ yıldaki her bileşikleştirme için bir) bakiye $B_{n t} = P (1 + r/n)^{n t}$ olur — tam olarak bileşik faiz formülü.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; YILLIK BİLEŞİKLEŞTİRME</div><div class="example-body">Yıllık %8 faizle 10.000₺ yatırdın ve faiz yılda bir kez bileşikleşiyor. 5 yıl sonra ne kadar olur?<br><br>$P = 10000$, $r = 0.08$, $n = 1$, $t = 5$:<br><br>$A = 10000 \\cdot (1 + 0.08)^5 = 10000 \\cdot 1.08^5 = 10000 \\cdot 1.46933 \\approx \\mathbf{14.693,28 \\text{ ₺}}$.<br><br>Geometrik dizi okuması: bakiye $10000, 10800, 11664, 12597.12, 13604.89, 14693.28$ — ilk terim 10.000₺, ortak çarpan 1.08, altıncı terim (0. yıldan 5. yıla altı değer) 14.693,28₺.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; AYLIK BİLEŞİKLEŞTİRME</div><div class="example-body">Aynı yatırım (10.000₺, %8), ama bu sefer <em>aylık</em> bileşikleşiyor. 5 yıl sonra?<br><br>$P = 10000$, $r = 0.08$, $n = 12$, $t = 5$:<br><br>$A = 10000 \\cdot \\left( 1 + \\dfrac{0.08}{12} \\right)^{60} = 10000 \\cdot (1.006667)^{60} \\approx 10000 \\cdot 1.48985 \\approx \\mathbf{14.898,46 \\text{ ₺}}$.<br><br>Daha sık bileşikleştirme biraz daha büyük bir cevap verir — bu durumda yaklaşık 205₺ fazla. Aynı ana paranın 60 kez küçük bir çarpanla çarpılması, 5 kez büyük bir çarpanla çarpılmasını geçer.</div></div>

<div class="l-note"><strong>Kredi taksidinin önizlemesi.</strong> Krediler aynı hesabı tersinden yapar. $P$'yi dönemlik faiz $i$ ile borçlanırsan ve $n$ eşit taksit $M$ büyüklüğünde ödersen, $k$ ödemeden sonra kalan bakiye $P (1+i)^k - M \\cdot \\dfrac{(1+i)^k - 1}{i}$ olur — ilk parça borcun geometrik büyümesi, ikinci parça ise ödeme akışının bugüne çekilmiş sonlu geometrik toplamıdır. Sonda bakiyeyi sıfıra ayarlamak $M$'yi belirler. Bu formülü finans derslerinde tekrar göreceksin, ama iskeleti tamamen geometrik dizi cebridir.</div>

<h2 class="lesson-title">7. Geometrik Ortalama</h2>

<div class="calc-highlight"><strong>Bir geometrik dizide her orta terim, iki komşusunun geometrik ortalamasıdır.</strong> İki sayı $a$ ve $b$'nin aritmetik ortalaması (ortalama) $(a+b)/2$ olup aritmetik dizinin orta terimi olarak ortaya çıktığı gibi, <em>geometrik ortalama</em> $\\sqrt{a \\cdot b}$ da geometrik dizinin orta terimi olarak ortaya çıkar.</div>

<div class="calc-formula"><div class="formula-label">GEOMETRİK ORTALAMA ÖZELLİĞİ</div><div class="formula-main">$$a_n^2 \\;=\\; a_{n-1} \\cdot a_{n+1} \\qquad\\Longleftrightarrow\\qquad a_n \\;=\\; \\pm\\sqrt{a_{n-1} \\cdot a_{n+1}}$$</div><div class="formula-sub">Orta terim komşularının geometrik ortalamasıdır: karesi yan iki terimin çarpımına eşittir.</div></div>

<p class="l-text"><strong>Özellik neden geçerli.</strong> Üç terimi genel formda yaz:</p>

$$a_{n-1} = a_1 r^{n-2}, \\qquad a_n = a_1 r^{n-1}, \\qquad a_{n+1} = a_1 r^n.$$

<p class="l-text">Dış iki terimi çarp:</p>

$$a_{n-1} \\cdot a_{n+1} = a_1 r^{n-2} \\cdot a_1 r^n = a_1^2 \\, r^{2n-2} = \\bigl( a_1 r^{n-1} \\bigr)^2 = a_n^2.$$

<p class="l-text">İşte özdeşlik. Yani arada eksik bir terimle iki terim bildiğinde, kare kök alarak eksik olanı geri alabilirsin.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir geometrik dizinin üç ardışık terimi $a, 12, 48$. $a$'yı bul.<br><br>Geometrik ortalama özelliği ile: $12^2 = a \\cdot 48 \\;\\Rightarrow\\; 144 = 48 a \\;\\Rightarrow\\; \\mathbf{a = 3}$.<br><br>Kontrol: üç terim $3, 12, 48$ olup oranlar $12/3 = 4$ ve $48/12 = 4$ — ikisi de eşit, $r = 4$ olan geometrik diziyi doğrular.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ARİTMETİK ORTALAMA</div><div class="compare-item">Aritmetik dizinin orta terimi</div><div class="compare-item">$a_n = \\dfrac{a_{n-1} + a_{n+1}}{2}$</div><div class="compare-item">Reel sayılar için her zaman tanımlı</div><div class="compare-item">Günlük dilde "ortalama"</div></div><div class="compare-col"><div class="compare-title">GEOMETRİK ORTALAMA</div><div class="compare-item">Geometrik dizinin orta terimi</div><div class="compare-item">$a_n = \\pm\\sqrt{a_{n-1} \\cdot a_{n+1}}$</div><div class="compare-item">Çarpımın negatif olmaması gerekir</div><div class="compare-item">Oranlar, büyüme hızları, geometrik ortalamalar için kullanılır</div></div></div>

<h2 class="lesson-title">8. Aritmetik Dizilerle Karşılaştırma</h2>

<div class="calc-highlight"><strong>Aritmetik diziler doğrusal büyür; geometrik diziler üstel büyür.</strong> Aritmetik dizinin ortak farkı $d$ ne kadar büyük olursa olsun ve geometrik dizinin ortak çarpanı $r > 1$ ne kadar küçük olursa olsun, geometrik olan eninde sonunda aritmetik olanı geçer ve bir daha geri dönmez.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ARİTMETİK</div><div class="compare-item">Adım kuralı: $a_{n+1} = a_n + d$</div><div class="compare-item">Genel terim: $a_n = a_1 + (n-1) d$</div><div class="compare-item">Toplam: $S_n = \\dfrac{n}{2}(a_1 + a_n)$</div><div class="compare-item">Grafik: $n$'de düz çizgi</div><div class="compare-item">İkiye katlanıyor mu? Yavaş — her sabit artım</div></div><div class="compare-col"><div class="compare-title">GEOMETRİK</div><div class="compare-item">Adım kuralı: $a_{n+1} = r \\cdot a_n$</div><div class="compare-item">Genel terim: $a_n = a_1 \\cdot r^{n-1}$</div><div class="compare-item">Toplam: $S_n = a_1 \\dfrac{1-r^n}{1-r}$</div><div class="compare-item">Grafik: üstel eğri (log eksende düz)</div><div class="compare-item">İkiye katlanıyor mu? Hızlı — her sabit katsayı</div></div></div>

<p class="l-text"><strong>Ünlü bir örnek.</strong> Satranç tahtası ve pirinç taneleri efsanesi. Bir krala ilk kareye 1 tane, ikinciye 2, üçüncüye 4 koyup her seferinde ikiye katlaması istenir. Bu $a_1 = 1$ ve $r = 2$ olan bir geometrik dizidir. 64. kareye gelindiğinde sayı $2^{63} \\approx 9.2 \\times 10^{18}$ tanedir — insanlık tarihinde yetiştirilen toplam pirinçten daha fazla. Aynı hesap aritmetik olarak yapılsa (1, 2, 3, 4, ... 1 ekleyerek) son kareye sadece 64 düşerdi. Bu uçurum dersin özüdür.</p>

<div class="calc-graph"><div id="plot-l64-cumul-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $1, 2, 4, 8, 16, \\ldots$ geometrik dizisinin kümülatif toplamı çizgi olarak. $n$ konumundaki y-değeri $S_n = 2^n - 1$'dir (toplam formülünü $a_1 = 1$, $r = 2$ ile uygulayarak). Eğri sona doğru neredeyse dikey yükselir — $n = 10$'da kısmi toplam 1023, $n = 15$'te 32767. Her yeni terim toplama kabaca aynı kadar daha ekler, bu yüzden geometrik kısmi toplamlar oturmaz, patlar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=[1,2,3,4,5,6,7,8,9,10,11,12];
var S=n.map(function(k){return Math.pow(2,k)-1;});
var trace={x:n,y:S,mode:'lines+markers',name:'Sₙ = 2ⁿ - 1',line:{color:'#3b82f6',width:2.5},marker:{size:8,color:'#3b82f6'},text:S.map(function(v){return v.toString();}),textposition:'top center',textfont:{color:'#e8e8e8',size:10}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'terim sayısı n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'kümülatif toplam Sₙ',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:55,l:70},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l64-cumul-tr',[trace],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Yaygın Hatalar ve Bunlardan Kaçınma</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$r$ ile $d$'yi karıştırma</div><div class="card-body">Bazı öğrenciler $a_{n+1} / a_n$ (bir <em>oran</em>) yapmaları gerekirken $a_{n+1} - a_n$ (bir <em>fark</em>) hesaplar. Her zaman kontrol et: geometrik dizide sabit olan <em>orandır</em>, fark değil.</div></div>
<div class="calc-card"><div class="card-title">Üstte bir-fark</div><div class="card-body">Formül $a_n = a_1 r^{n-1}$'dir, $a_1 r^n$ değil. İlk terim $r^1$ değil $r^0$ taşır. $n = 1$ ile sına: formül $a_1 \\cdot r^0 = a_1$ verir, doğru.</div></div>
<div class="calc-card"><div class="card-title">$r < 0$ ile işaret hataları</div><div class="card-body">$r$ negatif olduğunda, tek üslü terimler negatif ve çift üslü terimler pozitiftir (varsayım $a_1 > 0$). $r^{n-1}$'deki işareti düşürme — negatif çarpanı parantez içinde tut: $(-2)^{n-1}$, $-2^{n-1}$ değil.</div></div>
<div class="calc-card"><div class="card-title">$r = 1$ ile $S_n$ formülünü kullanmak</div><div class="card-body">Sıfıra bölme. $r = 1$ olduğunu görürsen, cevap doğrudan $n \\cdot a_1$'dir — formüle gerek yok.</div></div>
<div class="calc-card"><div class="card-title">Üs ile çarpan karışıklığı</div><div class="card-body">$2^{n-1}$ ile $2 \\cdot (n-1)$ çok farklıdır. İlki üstel büyüme, ikincisi doğrusal. Üssü dikkatli oku — <em>üst simge</em>de, çarpanda değil.</div></div>
<div class="calc-card"><div class="card-title">Negatif çarpımlı geometrik ortalama</div><div class="card-body">$\\sqrt{a \\cdot b}$ için $a \\cdot b \\geq 0$ gerekir. İki komşunun işareti zıt ise (bu $r < 0$ ile olabilir), formülü dikkatli kullan — iki kare kök ($\\pm$) de adaydır ve sadece biri gerçek diziyle eşleşir.</div></div>
</div>

<h2 class="lesson-title">10. Alıştırma Problemleri</h2>

<p class="l-text">Derste geçen her işlemi kapsayan sekiz standart alıştırma. Çözümü okumadan önce her birini dene.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; ORANI TANIMLA</div><div class="example-body"><strong>Şu dizi geometrik midir:</strong> $5, 15, 45, 135, 405$? <strong>Öyleyse $a_1$ ve $r$ nedir?</strong><br><br>Oranlar: $15/5 = 3$, $45/15 = 3$, $135/45 = 3$, $405/135 = 3$. Hepsi eşit, evet. $\\mathbf{a_1 = 5, \\; r = 3}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; GENEL TERİM</div><div class="example-body"><strong>Yukarıdaki dizi için 8. terimi bul.</strong><br><br>$a_8 = 5 \\cdot 3^{8-1} = 5 \\cdot 3^7 = 5 \\cdot 2187 = \\mathbf{10.935}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; $r$ İÇİN ÇÖZME</div><div class="example-body"><strong>Bir geometrik dizide</strong> $a_1 = 7$ <strong>ve</strong> $a_4 = 189$. <strong>$r$'yi bul.</strong><br><br>$a_4 = 7 r^3 = 189 \\;\\Rightarrow\\; r^3 = 27 \\;\\Rightarrow\\; \\mathbf{r = 3}$. Dizi: $7, 21, 63, 189$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; SONLU TOPLAM</div><div class="example-body"><strong>İlk 7 terimi topla:</strong> $3, 6, 12, 24, \\ldots$ <strong>($a_1 = 3$, $r = 2$).</strong><br><br>$S_7 = 3 \\cdot \\dfrac{1 - 2^7}{1 - 2} = 3 \\cdot \\dfrac{1 - 128}{-1} = 3 \\cdot 127 = \\mathbf{381}$.<br><br>Kontrol: $3 + 6 + 12 + 24 + 48 + 96 + 192 = 381$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; SÖNÜM TOPLAMI</div><div class="example-body"><strong>İlk 10 terimi topla:</strong> $9, 3, 1, 1/3, \\ldots$ <strong>($a_1 = 9$, $r = 1/3$).</strong><br><br>$S_{10} = 9 \\cdot \\dfrac{1 - (1/3)^{10}}{1 - 1/3} = 9 \\cdot \\dfrac{1 - 1/59049}{2/3} = 9 \\cdot \\dfrac{3}{2} \\cdot \\dfrac{59048}{59049} = \\dfrac{27}{2} \\cdot \\dfrac{59048}{59049} \\approx \\mathbf{13.4998}$.<br><br>Toplam 13.5'e doğru sürünüyor — sonsuz toplam limiti, $a_1 / (1 - r) = 9 / (2/3) = 13.5$ tam.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; BİLEŞİK FAİZ</div><div class="example-body"><strong>5.000₺'yi yıllık %6 ile 3 ay vadeli bileşikleştirerek yatırıyorsun. 3 yıl sonra ne kadar?</strong><br><br>$P = 5000$, $r = 0.06$, $n = 4$, $t = 3$:<br><br>$A = 5000 \\cdot \\left( 1 + \\dfrac{0.06}{4} \\right)^{12} = 5000 \\cdot (1.015)^{12} \\approx 5000 \\cdot 1.19562 \\approx \\mathbf{5.978,09 \\text{ ₺}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; GEOMETRİK ORTALAMA</div><div class="example-body"><strong>Bir geometrik dizinin üç ardışık terimi:</strong> $5, x, 80$. <strong>$x$'i bul.</strong><br><br>$x^2 = 5 \\cdot 80 = 400 \\;\\Rightarrow\\; x = \\pm 20$.<br><br>İkisi de çalışır: $5, 20, 80$ için $r = 4$, $5, -20, 80$ için $r = -4$. Ek kısıtlama olmadan iki cevap da geçerlidir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; BAKTERİ ÇOĞALMASI</div><div class="example-body"><strong>Bir bakteri kültürü her 20 dakikada bir ikiye katlanır. 500 hücreyle başlayarak 4 saat sonra kaç hücre olur?</strong><br><br>4 saat = 240 dakika = 12 katlanma dönemi. Her dönem sayıyı 2 ile çarpar. Yani bu $a_1 = 500$, $r = 2$ olan ve $n = 13$ konumunda değerlendirilen bir geometrik dizidir (başlangıç durumu artı 12 katlanma):<br><br>$a_{13} = 500 \\cdot 2^{12} = 500 \\cdot 4096 = \\mathbf{2.048.000}$ hücre.<br><br>Sadece dört saatte beş yüzden iki milyona — geometrik büyümenin gücü budur.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Geometrik dizi: her terim, bir öncekinin sabit bir oran $r$ ile çarpımıdır</li>
<li>Genel terim: $a_n = a_1 \\cdot r^{n-1}$ — üsteki bir-farka dikkat</li>
<li>Özyinelemeli form: $a_{n+1} = r \\cdot a_n$, adım adım süreçleri tanımlamada kullanışlı</li>
<li>Sonlu toplam: $r \\neq 1$ için $S_n = a_1 \\dfrac{1 - r^n}{1 - r}$; $r = 1$ için $S_n = n \\cdot a_1$ kullan</li>
<li>Davranış $r$'ye bağlı: büyüme ($|r| > 1$), sönüm ($0 < |r| < 1$), değişim ($r < 0$), sabit ($r = 1$)</li>
<li>Bileşik faiz $A = P(1 + r/n)^{nt}$, paraya uygulanmış bir geometrik dizidir</li>
<li>Geometrik ortalama: $a_n^2 = a_{n-1} \\cdot a_{n+1}$, eksik bir orta terimi komşulardan kurtarır</li>
<li>Aritmetikle karşılaştırma: yeterince terim verilirse üstel her zaman doğrusalı geçer</li>
</ul>
</div>`

};
