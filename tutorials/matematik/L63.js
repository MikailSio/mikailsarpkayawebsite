window.LISE_MAT_L63 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Some lists of numbers feel orderly because each step adds the same amount.</strong> Counting by fives — 5, 10, 15, 20, 25 — is the simplest example you have known since primary school. The temperature dropping two degrees every hour, a stack of chairs each 4 cm taller than the one below it, a savings plan that adds the same lira every week to a starting balance: all of these are <em>arithmetic sequences</em>. The pattern is identical in every case: take a starting number, add a fixed step to get the next one, and keep going.</p>

<p class="l-text">By the end of this lesson you will read off the common difference of an arithmetic sequence at a glance, write any term you want from a closed formula in $n$, switch between the recursive form $a_{n+1} = a_n + d$ and the explicit form $a_n = a_1 + (n-1)d$, sum the first $n$ terms with the Gauss pairing trick, and solve real-world word problems about salaries, savings, and stadium seating. These are also exactly the skills the YKS / TYT and most university entrance exams test in their sequence questions.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recognise an arithmetic sequence and compute its common difference $d$ from any two consecutive terms</li>
<li>Use the general term formula $a_n = a_1 + (n-1)d$ to find any term without listing all the ones before it</li>
<li>Translate between recursive and explicit definitions of the same sequence</li>
<li>Apply the sum formula $S_n = \\dfrac{n(a_1 + a_n)}{2}$ and derive it from the Gauss pairing trick</li>
<li>Use the arithmetic mean property: in an arithmetic sequence each middle term equals the average of its neighbours</li>
<li>Solve word problems about salaries, savings, stadium seating, and other real-life situations modelled by arithmetic sequences</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Sequence?</h2>

<div class="calc-highlight"><strong>A sequence is an ordered list of numbers.</strong> The order matters: the list 2, 5, 8, 11 is different from 11, 8, 5, 2 even though the same numbers appear. The first number is called $a_1$, the second $a_2$, the third $a_3$, and so on. The general term — the rule that tells you the number in position $n$ — is written $a_n$.</div>

<p class="l-text">In primary school you have already met dozens of sequences without calling them that. The natural numbers $1, 2, 3, 4, \\ldots$, the even numbers $2, 4, 6, 8, \\ldots$, the squares $1, 4, 9, 16, \\ldots$, and the powers of two $1, 2, 4, 8, \\ldots$ are all sequences. A sequence does not have to follow an obvious pattern at all — the digits of $\\pi$ form a perfectly valid sequence even though there is no simple closed-form rule. But in this lesson and the next we focus on the two simplest patterns: <em>arithmetic</em> (constant addition) and <em>geometric</em> (constant multiplication).</p>

<div class="calc-formula"><div class="formula-label">NOTATION FOR A SEQUENCE</div><div class="formula-main">$$(a_n) \\;=\\; a_1, \\, a_2, \\, a_3, \\, \\ldots, \\, a_n, \\, \\ldots$$</div><div class="formula-sub">$a_n$ denotes the term in position $n$. The subscript $n$ is a positive integer: $n = 1, 2, 3, \\ldots$. Some textbooks start at $n = 0$ instead — pay attention to the convention in your source.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Finite vs infinite</div><div class="card-body">A sequence may stop at some $a_N$ (finite) or continue forever (infinite). Both kinds appear in this lesson; the formulas treat them identically.</div></div>
<div class="calc-card"><div class="card-title">Term vs position</div><div class="card-body">$a_n$ is the <em>value</em> at position $n$. The position $n$ itself is just a counter; the value is what changes from one term to the next.</div></div>
<div class="calc-card"><div class="card-title">Closed vs recursive</div><div class="card-body">"Closed form" means a formula that gives $a_n$ directly from $n$. "Recursive form" means a rule that gives $a_{n+1}$ from earlier terms. Both have their uses.</div></div>
</div>

<h2 class="lesson-title">2. Arithmetic Sequence: The Definition</h2>

<div class="calc-highlight"><strong>An arithmetic sequence is one in which the difference between any two consecutive terms is the same constant.</strong> That constant is called the <em>common difference</em>, written $d$. The whole sequence is determined by just two numbers: the first term $a_1$ and the common difference $d$.</div>

<div class="calc-formula"><div class="formula-label">DEFINING PROPERTY</div><div class="formula-main">$$a_{n+1} - a_n \\;=\\; d \\qquad \\text{for every } n \\geq 1$$</div><div class="formula-sub">The gap from one term to the next is always the same. If $d > 0$ the sequence is increasing, if $d < 0$ it is decreasing, and if $d = 0$ every term equals $a_1$ (a constant sequence).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Is the sequence $3, 7, 11, 15, 19, \\ldots$ arithmetic? If so, find $d$.<br><br>Check the gaps:<br>$7 - 3 = 4$, $11 - 7 = 4$, $15 - 11 = 4$, $19 - 15 = 4$.<br><br>All gaps equal 4, so yes — it is arithmetic with $\\mathbf{d = 4}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Is the sequence $1, 4, 9, 16, 25, \\ldots$ (the squares) arithmetic?<br><br>$4 - 1 = 3$, $9 - 4 = 5$, $16 - 9 = 7$. The differences themselves are <em>not</em> constant (they grow by 2 each time). So <strong>no</strong> — the squares are not an arithmetic sequence. They form a <em>quadratic</em> sequence, which we will not study in this lesson.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$d > 0$: increasing</div><div class="card-body">Each term is larger than the previous. Example: $2, 5, 8, 11, \\ldots$ with $d = 3$.</div></div>
<div class="calc-card"><div class="card-title">$d < 0$: decreasing</div><div class="card-body">Each term is smaller than the previous. Example: $20, 17, 14, 11, \\ldots$ with $d = -3$.</div></div>
<div class="calc-card"><div class="card-title">$d = 0$: constant</div><div class="card-body">All terms equal. Example: $7, 7, 7, 7, \\ldots$. Technically still arithmetic, just boring.</div></div>
</div>

<h2 class="lesson-title">3. The General Term Formula</h2>

<div class="calc-highlight"><strong>You can write down $a_n$ for any $n$ without listing the terms before it.</strong> Start at $a_1$ and add $d$ a total of $n - 1$ times to reach $a_n$. That gives the single most useful formula in the whole lesson.</div>

<div class="calc-formula"><div class="formula-label">GENERAL TERM (EXPLICIT FORMULA)</div><div class="formula-main">$$a_n \\;=\\; a_1 + (n - 1) \\, d$$</div><div class="formula-sub">First term plus $n - 1$ steps of size $d$. The off-by-one is critical: $a_1$ has zero steps of $d$ added, $a_2$ has one step, $a_n$ has $n - 1$ steps.</div></div>

<p class="l-text"><strong>Why $n - 1$ and not $n$?</strong> Walk through the first few terms:<br>$a_1 = a_1 + 0 \\cdot d$ (zero steps)<br>$a_2 = a_1 + 1 \\cdot d$ (one step)<br>$a_3 = a_1 + 2 \\cdot d$ (two steps)<br>$a_n = a_1 + (n - 1) \\cdot d$ (since the pattern is "step count = position minus one")<br>This off-by-one is the single most common mistake students make. Always double-check by setting $n = 1$ — you should recover $a_1$ exactly.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — FIND A SPECIFIC TERM</div><div class="example-body"><strong>Given</strong> $a_1 = 3$ and $d = 5$. Find $a_{20}$ (the 20th term).<br><br>$a_{20} = a_1 + (20 - 1) \\cdot d = 3 + 19 \\cdot 5 = 3 + 95 = \\mathbf{98}$.<br><br>No need to list the 20 terms one by one — the formula jumps straight to the answer.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — FIND $d$ FROM TWO TERMS</div><div class="example-body"><strong>Given</strong> $a_4 = 17$ and $a_{10} = 41$ in an arithmetic sequence. Find $d$.<br><br>From $a_4$ to $a_{10}$ you take $10 - 4 = 6$ steps of size $d$. So $a_{10} - a_4 = 6d$, which gives $41 - 17 = 6d$, hence $24 = 6d$, so $\\mathbf{d = 4}$.<br><br>Once you know $d$, you can also recover $a_1$: $a_4 = a_1 + 3d = a_1 + 12 = 17$, so $a_1 = 5$. The full sequence is $5, 9, 13, 17, 21, \\ldots$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TWO LINEAR EQUATIONS</div><div class="example-body"><strong>Given</strong> $a_3 = 11$ and $a_8 = 31$ in an arithmetic sequence. Find $a_1$ and $d$, then write the general term.<br><br>Subtract: $a_8 - a_3 = (8 - 3) d = 5 d$, so $31 - 11 = 5 d \\Rightarrow \\mathbf{d = 4}$.<br>Substitute back: $a_3 = a_1 + 2 d = a_1 + 8 = 11 \\Rightarrow \\mathbf{a_1 = 3}$.<br>General term: $a_n = 3 + (n - 1) \\cdot 4 = 4 n - 1$.<br><br>Quick check at $n = 8$: $4 \\cdot 8 - 1 = 31$. ✓</div></div>

<div class="l-note"><strong>A clean recipe for "find $d$ given $a_p$ and $a_q$".</strong> The formula $a_q - a_p = (q - p) \\, d$ rearranges instantly to $d = \\dfrac{a_q - a_p}{q - p}$. Memorise this; it answers most "given two terms" questions in one line.</div>

<div class="calc-graph"><div id="plot-l63-terms-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the first ten terms of the arithmetic sequence $3, 7, 11, 15, 19, 23, 27, 31, 35, 39$ (with $a_1 = 3$ and $d = 4$) drawn as a bar chart. Each bar is exactly 4 units taller than the one to its left — that is the common difference. The pattern grows in equal steps.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a1=3,d=4;var n=[];var a=[];for(var i=1;i<=10;i++){n.push(i);a.push(a1+(i-1)*d);}
var bars={x:n,y:a,type:'bar',marker:{color:'#3b82f6'},text:a,textposition:'outside',textfont:{color:'#e5e5e5'},name:'a_n'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'position n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'a_n (term value)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,45]},margin:{t:30,r:30,b:60,l:60},showlegend:false};
Plotly.newPlot('plot-l63-terms-en',[bars],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. The Recursive Formula</h2>

<div class="calc-highlight"><strong>An arithmetic sequence can also be defined recursively.</strong> Instead of giving a closed formula in $n$, you say "start at $a_1$, and to get from any term to the next, add $d$." This matches the way the sequence actually grows.</div>

<div class="calc-formula"><div class="formula-label">RECURSIVE DEFINITION</div><div class="formula-main">$$a_1 \\text{ given}, \\qquad a_{n+1} \\;=\\; a_n + d \\quad \\text{for all } n \\geq 1$$</div><div class="formula-sub">The recursion needs two pieces of information: an initial value (the "base case") and a step rule. Without the base case, the recursion floats — you need to anchor it somewhere.</div></div>

<p class="l-text">The recursive form mirrors how computers actually generate the sequence — start with $a_1$, repeatedly apply the rule, write down each result. The explicit form $a_n = a_1 + (n-1)d$ is the same information in a form that lets you jump straight to any term you want without computing the intermediate ones. Both forms describe the same sequence; choose whichever is more convenient for the question at hand.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">RECURSIVE</div><div class="compare-item">Easy to write down the rule</div><div class="compare-item">Easy to generate term by term</div><div class="compare-item">Slow if you want the 100th term (must compute 99 first)</div><div class="compare-item">Matches the natural language: "start, then add $d$"</div></div><div class="compare-col"><div class="compare-title">EXPLICIT</div><div class="compare-item">Slightly trickier formula to derive</div><div class="compare-item">Lets you jump straight to any $a_n$</div><div class="compare-item">Fast for any $n$, no matter how large</div><div class="compare-item">Best for solving equations like "find $n$ with $a_n = 100$"</div></div></div>

<div class="calc-graph"><div id="plot-l63-linear-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same arithmetic sequence as before ($a_1 = 3$, $d = 4$), but now drawn as a line plot of position $n$ versus term value $a_n$. The points lie on a perfectly straight line — that is the signature of an arithmetic sequence. The slope of the line is exactly $d = 4$, and the $y$-intercept is $a_1 - d = -1$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a1=3,d=4;var n=[];var a=[];for(var i=1;i<=10;i++){n.push(i);a.push(a1+(i-1)*d);}
var pts={x:n,y:a,mode:'lines+markers',line:{color:'#3b82f6',width:2.5},marker:{color:'#3b82f6',size:9},name:'a_n = 3 + 4(n-1)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'position n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1,range:[0,11]},yaxis:{title:'a_n (term value)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,45]},margin:{t:30,r:30,b:60,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l63-linear-en',[pts],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>A linear function in disguise.</strong> The formula $a_n = a_1 + (n - 1) d$ can be rewritten as $a_n = d \\cdot n + (a_1 - d)$. This is a linear function of $n$ with slope $d$ and intercept $a_1 - d$. That is why the plot above is a perfectly straight line — an arithmetic sequence is just a linear function evaluated at the positive integers.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Convert the recursive definition $a_1 = 10$, $a_{n+1} = a_n - 2$ to an explicit formula and write the first six terms. (Answer: $d = -2$ so $a_n = 10 + (n-1)(-2) = 12 - 2n$. First six terms: $10, 8, 6, 4, 2, 0$.) Then ask yourself: when does the sequence first become negative? (At $n = 7$, $a_7 = -2$.)</div></div>

<h2 class="lesson-title">5. The Sum Formula: Gauss's Trick</h2>

<div class="calc-highlight"><strong>Adding up the first $n$ terms of an arithmetic sequence has a beautiful shortcut.</strong> The legend says that the young Carl Friedrich Gauss, around the age of nine, was asked by his teacher to add the integers from 1 to 100 — and answered 5050 in a few seconds. His trick works for any arithmetic sequence.</div>

<p class="l-text"><strong>Gauss's idea.</strong> Write the sum forward and backward and add the two rows term by term. The clever part is that every column sums to the same number — the first term plus the last term — because as the top row goes up by $d$, the bottom row goes down by $d$, leaving the column sums unchanged.</p>

<div class="calc-formula"><div class="formula-label">PAIRING — STEP BY STEP</div><div class="formula-main">$$\\begin{aligned} S_n &= a_1 + a_2 + a_3 + \\cdots + a_{n-1} + a_n \\\\ S_n &= a_n + a_{n-1} + a_{n-2} + \\cdots + a_2 + a_1 \\\\ \\hline 2 S_n &= (a_1 + a_n) + (a_1 + a_n) + \\cdots + (a_1 + a_n) = n (a_1 + a_n) \\end{aligned}$$</div><div class="formula-sub">Each column on the right sums to $a_1 + a_n$ (you can check column by column using $a_k + a_{n+1-k} = a_1 + a_n$), and there are $n$ columns. Divide by 2 and you have the sum formula.</div></div>

<div class="calc-formula"><div class="formula-label">SUM OF THE FIRST $n$ TERMS</div><div class="formula-main">$$S_n \\;=\\; \\frac{n \\, (a_1 + a_n)}{2} \\;=\\; \\frac{n \\, [\\, 2 a_1 + (n-1) d \\,]}{2}$$</div><div class="formula-sub">Two equivalent forms. Use the first when you know $a_1$ and $a_n$; use the second when you know $a_1$ and $d$. They give identical numerical answers.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — GAUSS'S CLASSIC</div><div class="example-body">Compute $1 + 2 + 3 + \\cdots + 100$.<br><br>Arithmetic sequence with $a_1 = 1$, $a_{100} = 100$, $n = 100$.<br><br>$S_{100} = \\dfrac{100 \\cdot (1 + 100)}{2} = \\dfrac{100 \\cdot 101}{2} = \\dfrac{10100}{2} = \\mathbf{5050}$.<br><br>The young Gauss saw this in seconds — pairs $(1, 100), (2, 99), (3, 98), \\ldots, (50, 51)$, each summing to 101, with 50 pairs total. Same answer.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SUM OF THE FIRST 50 ODD NUMBERS</div><div class="example-body">Compute $1 + 3 + 5 + 7 + \\cdots$ for the first 50 odd numbers.<br><br>Arithmetic sequence with $a_1 = 1$, $d = 2$, $n = 50$.<br><br>The 50th term: $a_{50} = 1 + 49 \\cdot 2 = 99$.<br><br>$S_{50} = \\dfrac{50 \\cdot (1 + 99)}{2} = \\dfrac{50 \\cdot 100}{2} = \\mathbf{2500}$.<br><br>Notice the elegant pattern: the sum of the first $n$ odd numbers equals $n^2$. Here $50^2 = 2500$. ✓</div></div>

<div class="calc-graph"><div id="plot-l63-sum-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the cumulative sum $S_n$ of the arithmetic sequence $3, 7, 11, 15, \\ldots$ for $n = 1, 2, \\ldots, 10$. While the terms themselves grow linearly, the cumulative sum grows <em>quadratically</em>: $S_n = \\dfrac{n(2 a_1 + (n-1) d)}{2}$ is a quadratic in $n$. That is why the bars accelerate — each new bar adds more than the previous.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a1=3,d=4;var n=[];var s=[];var running=0;for(var i=1;i<=10;i++){running+=a1+(i-1)*d;n.push(i);s.push(running);}
var bars={x:n,y:s,type:'bar',marker:{color:'#3b82f6'},text:s,textposition:'outside',textfont:{color:'#e5e5e5'},name:'S_n'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'number of terms n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'cumulative sum S_n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,250]},margin:{t:30,r:30,b:60,l:60},showlegend:false};
Plotly.newPlot('plot-l63-sum-en',[bars],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5b. $S_n$ as a Quadratic in $n$</h2>

<div class="calc-highlight"><strong>The sum $S_n$ itself is a quadratic function of $n$.</strong> If you expand $S_n = \\dfrac{n [2 a_1 + (n-1) d]}{2}$, you get a polynomial of degree two in $n$. This explains why the cumulative-sum bars grow faster and faster: a quadratic accelerates.</div>

<div class="calc-formula"><div class="formula-label">EXPANDED SUM FORMULA</div><div class="formula-main">$$S_n \\;=\\; \\frac{d}{2} \\, n^2 + \\left(a_1 - \\frac{d}{2}\\right) n$$</div><div class="formula-sub">A quadratic in $n$ with no constant term (because $S_0 = 0$ by convention). The leading coefficient is $d/2$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — GO BACKWARDS</div><div class="example-body">An arithmetic sequence has $S_n = 2 n^2 + 3 n$ for every $n \\geq 1$. Find $a_1$ and $d$.<br><br>Compare with $S_n = \\dfrac{d}{2} n^2 + \\left(a_1 - \\dfrac{d}{2}\\right) n$. So $\\dfrac{d}{2} = 2 \\Rightarrow d = 4$ and $a_1 - \\dfrac{d}{2} = 3 \\Rightarrow a_1 = 3 + 2 = 5$.<br><br>Quick check: $S_1 = 5$, so $a_1 = 5$ ✓. $S_2 = 8 + 6 = 14$, so $a_2 = 14 - 5 = 9 = 5 + 4 = a_1 + d$. ✓</div></div>

<div class="l-note"><strong>Recovering individual terms from $S_n$.</strong> For any $n \\geq 2$, $a_n = S_n - S_{n-1}$. This is the discrete analogue of "to recover a derivative, subtract neighbouring antiderivatives." It works for any sequence, not just arithmetic — though for arithmetic the difference is always exactly $d$ from one $a_n$ to the next.</div>

<h2 class="lesson-title">6. The Arithmetic Mean Property</h2>

<div class="calc-highlight"><strong>In an arithmetic sequence, every middle term is the average of its two neighbours.</strong> That is why the constant gap is called the <em>arithmetic</em> mean — it makes every interior term the simple average of the term before and the term after.</div>

<div class="calc-formula"><div class="formula-label">THE MIDDLE-TERM PROPERTY</div><div class="formula-main">$$a_n \\;=\\; \\frac{a_{n-1} + a_{n+1}}{2} \\qquad \\text{for every } n \\geq 2$$</div><div class="formula-sub">Equivalently $2 a_n = a_{n-1} + a_{n+1}$. This is a quick test for arithmeticity: pick any three consecutive terms and check whether the middle equals the average of the outer two.</div></div>

<p class="l-text"><strong>Why it works.</strong> By definition $a_n - a_{n-1} = d$ and $a_{n+1} - a_n = d$. Adding these two: $a_{n+1} - a_{n-1} = 2 d$. But also $a_{n+1} + a_{n-1} = (a_n + d) + (a_n - d) = 2 a_n$. Divide by 2 and the property follows.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — FIND THE MISSING MIDDLE TERM</div><div class="example-body">In an arithmetic sequence the terms $a_{n-1} = 14$ and $a_{n+1} = 26$ are known. Find $a_n$.<br><br>By the middle-term property, $a_n = \\dfrac{14 + 26}{2} = \\dfrac{40}{2} = \\mathbf{20}$.<br><br>Cross-check: the common difference is $\\dfrac{26 - 14}{2} = 6$. So the three terms are $14, 20, 26$ with $d = 6$. ✓</div></div>

<div class="l-note"><strong>Generalisation.</strong> The same averaging idea extends to any pair of terms equidistant from $a_n$: $a_n = \\dfrac{a_{n-k} + a_{n+k}}{2}$ for any positive integer $k$ where the indices make sense. Every term in an arithmetic sequence sits exactly halfway between any two terms symmetrically placed around it.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — INSERTING ARITHMETIC MEANS</div><div class="example-body">Insert three numbers between $4$ and $20$ so that the five numbers form an arithmetic sequence.<br><br>The full sequence is $a_1 = 4, a_2, a_3, a_4, a_5 = 20$ with $n = 5$ terms. So $a_5 = a_1 + 4 d \\Rightarrow 20 = 4 + 4 d \\Rightarrow \\mathbf{d = 4}$.<br><br>Then $a_2 = 8, a_3 = 12, a_4 = 16$, and the sequence is $\\mathbf{4, 8, 12, 16, 20}$. The three inserted numbers are called the <em>arithmetic means</em> between 4 and 20.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If five consecutive terms of an arithmetic sequence sum to 75, what is the middle term? (Hint: by the mean property, $a_3$ is the average of all five, so $a_3 = 75 / 5 = 15$.) The same trick works for any odd number of consecutive terms — the middle one always equals the average.</div></div>

<h2 class="lesson-title">7. Word Problems</h2>

<p class="l-text">Arithmetic sequences appear constantly in everyday life whenever something grows or shrinks by a fixed amount each step. The pattern is always the same: identify $a_1$ (the starting value), identify $d$ (the fixed step), then apply either the general-term formula $a_n = a_1 + (n - 1) d$ or the sum formula $S_n = \\dfrac{n (a_1 + a_n)}{2}$ depending on whether the question asks about a single term or about an accumulated total. Here are three classic problem types.</p>

<div class="calc-example"><div class="example-label">PROBLEM A — SALARY INCREASE</div><div class="example-body">A starting engineer earns 30,000 lira per month in year 1. The company gives a fixed annual raise of 4,500 lira. What is the monthly salary in year 10? How much total has the engineer earned per month across the 10 years combined?<br><br>Arithmetic sequence with $a_1 = 30000$, $d = 4500$, $n = 10$.<br><br>Year 10 salary: $a_{10} = 30000 + 9 \\cdot 4500 = 30000 + 40500 = \\mathbf{70{,}500}$ lira per month.<br><br>Total monthly salaries across 10 years (i.e. summing $a_1 + a_2 + \\cdots + a_{10}$):<br>$S_{10} = \\dfrac{10 \\cdot (30000 + 70500)}{2} = \\dfrac{10 \\cdot 100500}{2} = \\mathbf{502{,}500}$ lira.<br><br>(The total <em>annual</em> earnings would be 12 times this, since salaries are monthly.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM B — STADIUM SEATING</div><div class="example-body">A stadium has 20 rows of seats. The first row has 30 seats, and each subsequent row has 4 more seats than the one in front. How many seats are in the back row? How many seats does the stadium hold in total?<br><br>Arithmetic sequence: $a_1 = 30$, $d = 4$, $n = 20$.<br><br>Back row: $a_{20} = 30 + 19 \\cdot 4 = 30 + 76 = \\mathbf{106}$ seats.<br><br>Total seats: $S_{20} = \\dfrac{20 \\cdot (30 + 106)}{2} = \\dfrac{20 \\cdot 136}{2} = \\mathbf{1360}$ seats.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM C — ACCUMULATED SAVINGS</div><div class="example-body">Ayşe starts a savings habit. In week 1 she deposits 100 lira. Each week she increases her deposit by 20 lira (so week 2 is 120 lira, week 3 is 140 lira, and so on). How much does she deposit in week 25? How much has she saved in total by the end of week 52 (one full year)?<br><br>Arithmetic with $a_1 = 100$, $d = 20$.<br><br>Week 25 deposit: $a_{25} = 100 + 24 \\cdot 20 = 100 + 480 = \\mathbf{580}$ lira.<br><br>Total after 52 weeks: $a_{52} = 100 + 51 \\cdot 20 = 1120$. Then $S_{52} = \\dfrac{52 \\cdot (100 + 1120)}{2} = \\dfrac{52 \\cdot 1220}{2} = 26 \\cdot 1220 = \\mathbf{31{,}720}$ lira.<br><br>A modest weekly habit with a fixed increment grows into a substantial yearly total.</div></div>

<h2 class="lesson-title">7b. Proof by Induction (Optional Deepening)</h2>

<div class="calc-highlight"><strong>The general term and sum formulas can be proved rigorously by mathematical induction.</strong> This is optional reading for the curious: most exam questions accept the formulas as given. But if you have met induction in another lesson, here is the cleanest way to see why these formulas are correct rather than merely plausible.</div>

<p class="l-text"><strong>Inductive proof of $a_n = a_1 + (n - 1) d$.</strong></p>
<p class="l-text"><em>Base case</em> ($n = 1$): the formula gives $a_1 + 0 \\cdot d = a_1$. ✓</p>
<p class="l-text"><em>Inductive step</em>: assume the formula holds for some $n = k$, i.e. $a_k = a_1 + (k - 1) d$. Then by the recursive definition $a_{k+1} = a_k + d = a_1 + (k - 1) d + d = a_1 + k \\cdot d = a_1 + ((k + 1) - 1) d$. So the formula holds at $n = k + 1$ too. By induction it holds for all $n \\geq 1$. $\\blacksquare$</p>

<p class="l-text"><strong>Inductive proof of $S_n = \\dfrac{n (a_1 + a_n)}{2}$.</strong></p>
<p class="l-text"><em>Base case</em> ($n = 1$): $S_1 = a_1$, and the formula gives $\\dfrac{1 \\cdot (a_1 + a_1)}{2} = a_1$. ✓</p>
<p class="l-text"><em>Inductive step</em>: assume $S_k = \\dfrac{k (a_1 + a_k)}{2}$. Then $S_{k+1} = S_k + a_{k+1} = \\dfrac{k (a_1 + a_k)}{2} + a_{k+1}$. Using $a_k = a_1 + (k-1) d$ and $a_{k+1} = a_k + d$, careful algebra rearranges this to $\\dfrac{(k+1)(a_1 + a_{k+1})}{2}$, exactly the formula at $n = k + 1$. $\\blacksquare$</p>

<div class="l-note"><strong>Why mathematicians like induction.</strong> The Gauss pairing trick "feels" obvious but is actually a clever rearrangement. Induction makes the same conclusion airtight by reducing the claim for arbitrary $n$ to one starting case plus one rule of inheritance. Every claim about "all positive integers" can in principle be proved this way.</div>

<h2 class="lesson-title">8. Common Mistakes</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Off-by-one in $(n-1) d$</div><div class="card-body">Writing $a_n = a_1 + n d$ instead of $a_n = a_1 + (n-1) d$ is the most common error. Always double-check by plugging in $n = 1$: you should get back $a_1$, not $a_1 + d$.</div></div>
<div class="calc-card"><div class="card-title">Confusing $a_n$ with $S_n$</div><div class="card-body">$a_n$ is the value of the $n$-th term. $S_n$ is the sum of the first $n$ terms. Word problems often ask for one but tempt you toward the other.</div></div>
<div class="calc-card"><div class="card-title">Forgetting the negative sign of $d$</div><div class="card-body">In a decreasing sequence $d < 0$. Substituting a positive value where a negative is needed flips every later term.</div></div>
<div class="calc-card"><div class="card-title">Step count vs index</div><div class="card-body">Going from $a_p$ to $a_q$ takes $q - p$ steps of size $d$, not $q$ steps. So $a_q - a_p = (q - p) \\, d$ — the difference of indices is the step count.</div></div>
<div class="calc-card"><div class="card-title">"Average × number of terms"</div><div class="card-body">A clean way to remember the sum: $S_n = (\\text{average of first and last}) \\times (\\text{number of terms}) = \\dfrac{a_1 + a_n}{2} \\cdot n$. Same formula, easier to recall.</div></div>
<div class="calc-card"><div class="card-title">Checking arithmeticity</div><div class="card-body">A common trap: students assume any "increasing" sequence is arithmetic. Always test that <em>consecutive differences are equal</em>. $1, 4, 9, 16$ increases but is not arithmetic.</div></div>
</div>

<h2 class="lesson-title">9. Practice Problems</h2>

<p class="l-text">Work each one before reading the solution. Aim to get five or more without help — that is the threshold for being exam-ready.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — FIND THE 15th TERM</div><div class="example-body">Given $a_1 = 7$ and $d = 3$, find $a_{15}$.<br><br>$a_{15} = 7 + (15 - 1) \\cdot 3 = 7 + 42 = \\mathbf{49}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — FIND $d$</div><div class="example-body">Given $a_5 = 22$ and $a_{12} = 50$ in an arithmetic sequence, find $d$ and $a_1$.<br><br>$a_{12} - a_5 = 7 d$, so $50 - 22 = 28 = 7 d$, hence $\\mathbf{d = 4}$.<br><br>Then $a_1 = a_5 - 4 d = 22 - 16 = \\mathbf{6}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — SUM OF FIRST 20 TERMS</div><div class="example-body">Compute the sum of the first 20 terms of the sequence $2, 5, 8, 11, \\ldots$<br><br>Arithmetic with $a_1 = 2$, $d = 3$. The 20th term: $a_{20} = 2 + 19 \\cdot 3 = 59$.<br><br>$S_{20} = \\dfrac{20 \\cdot (2 + 59)}{2} = \\dfrac{20 \\cdot 61}{2} = \\mathbf{610}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — SOLVE FOR $n$</div><div class="example-body">In the sequence $4, 7, 10, 13, \\ldots$, which term equals 100? (That is, find $n$ with $a_n = 100$.)<br><br>$a_n = 4 + (n - 1) \\cdot 3 = 100 \\Rightarrow 3 (n - 1) = 96 \\Rightarrow n - 1 = 32 \\Rightarrow \\mathbf{n = 33}$.<br><br>Check: $a_{33} = 4 + 32 \\cdot 3 = 4 + 96 = 100$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — MIDDLE TERM</div><div class="example-body">Three consecutive terms of an arithmetic sequence are $x - 3$, $2x + 1$, and $5x - 7$. Find $x$.<br><br>By the middle-term property: $2(2x + 1) = (x - 3) + (5x - 7)$.<br><br>$4x + 2 = 6x - 10 \\Rightarrow 12 = 2x \\Rightarrow \\mathbf{x = 6}$.<br><br>Check: the terms become $3, 13, 23$ with common difference 10. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — SUM OF EVEN NUMBERS</div><div class="example-body">Compute $2 + 4 + 6 + \\cdots + 200$ (the sum of the first 100 even numbers).<br><br>Arithmetic with $a_1 = 2$, $d = 2$, $a_{100} = 200$, $n = 100$.<br><br>$S_{100} = \\dfrac{100 \\cdot (2 + 200)}{2} = \\dfrac{100 \\cdot 202}{2} = \\mathbf{10{,}100}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — DECREASING SEQUENCE</div><div class="example-body">A sequence has $a_1 = 50$ and $d = -3$. Find the smallest term still positive and its position $n$.<br><br>$a_n = 50 + (n - 1)(-3) = 53 - 3n$. We want the largest $n$ with $a_n > 0$, i.e. $53 - 3n > 0$, i.e. $n < \\tfrac{53}{3} \\approx 17.67$. So the largest integer is $n = 17$.<br><br>$a_{17} = 53 - 51 = \\mathbf{2}$, the smallest positive term, occurring at position $\\mathbf{n = 17}$. The next term $a_{18} = -1$ is already negative.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — SALARY OVER A CAREER</div><div class="example-body">An employee earns 40,000 lira in year 1, with a fixed 5,000 lira raise per year. Over a 25-year career, what is the total of all annual salaries combined?<br><br>$a_1 = 40000$, $d = 5000$, $n = 25$. Final year: $a_{25} = 40000 + 24 \\cdot 5000 = 160000$.<br><br>$S_{25} = \\dfrac{25 \\cdot (40000 + 160000)}{2} = \\dfrac{25 \\cdot 200000}{2} = \\mathbf{2{,}500{,}000}$ lira lifetime earnings.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 9 — MULTIPLES OF 7</div><div class="example-body">Find the sum of all multiples of 7 between 1 and 1000 (inclusive of any equal endpoint).<br><br>The multiples of 7 in this range are $7, 14, 21, \\ldots, 994$ (since $7 \\cdot 142 = 994$ and $7 \\cdot 143 = 1001 > 1000$). This is arithmetic with $a_1 = 7$, $d = 7$, $a_n = 994$.<br><br>Number of terms: $n - 1 = \\dfrac{994 - 7}{7} = 141$, so $n = 142$.<br><br>Sum: $S_{142} = \\dfrac{142 \\cdot (7 + 994)}{2} = \\dfrac{142 \\cdot 1001}{2} = 71 \\cdot 1001 = \\mathbf{71{,}071}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 10 — SUM EQUATION</div><div class="example-body">For an arithmetic sequence with $a_1 = 2$ and $d = 3$, find the smallest $n$ such that $S_n \\geq 1000$.<br><br>$S_n = \\dfrac{n [2 \\cdot 2 + (n - 1) \\cdot 3]}{2} = \\dfrac{n (3 n + 1)}{2}$. Set this $\\geq 1000$: $n (3 n + 1) \\geq 2000$, i.e. $3 n^2 + n - 2000 \\geq 0$.<br><br>Solve the boundary $3 n^2 + n - 2000 = 0$: $n = \\dfrac{-1 + \\sqrt{1 + 24000}}{6} = \\dfrac{-1 + \\sqrt{24001}}{6} \\approx \\dfrac{-1 + 154.92}{6} \\approx 25.65$.<br><br>So the smallest integer $n$ with $S_n \\geq 1000$ is $\\mathbf{n = 26}$. Check: $S_{26} = \\dfrac{26 \\cdot 79}{2} = 1027 \\geq 1000$ ✓, and $S_{25} = \\dfrac{25 \\cdot 76}{2} = 950 < 1000$. ✓</div></div>

<div class="l-note"><strong>Looking ahead.</strong> The next lesson studies <em>geometric</em> sequences, where each term is obtained by <em>multiplying</em> the previous one by a fixed ratio $r$ instead of adding a fixed difference $d$. Many of the patterns you have just met carry over with the obvious changes: the general term becomes $a_n = a_1 \\, r^{n-1}$, and the sum has a corresponding closed form involving $r^n$. The contrast between addition (arithmetic, linear growth) and multiplication (geometric, exponential growth) is one of the most important conceptual jumps in all of pre-calculus.</div>

<h2 class="lesson-title">10. Side-by-Side: How $d$ Shapes the Sequence</h2>

<div class="calc-highlight"><strong>The single number $d$ controls everything about how the sequence behaves.</strong> Below, three arithmetic sequences share the same starting term $a_1 = 5$ but use different common differences: $d = 1$ (slow upward drift), $d = 3$ (faster climb), and $d = -2$ (steady decline). Each plot is a perfectly straight line because an arithmetic sequence is linear in $n$ — only the slope changes.</div>

<div class="calc-graph"><div id="plot-l63-compare-en-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three arithmetic sequences with the same first term $a_1 = 5$ and different common differences $d$. The slope of each line is exactly $d$. Positive $d$ gives an increasing sequence, negative $d$ gives a decreasing one, and the magnitude of $d$ controls how steep the climb or fall is.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a1=5;var n=[];for(var i=1;i<=10;i++){n.push(i);}
function build(d){var arr=[];for(var i=0;i<10;i++){arr.push(a1+i*d);}return arr;}
var s1={x:n,y:build(1),mode:'lines+markers',line:{color:'#3b82f6',width:2.5},marker:{color:'#3b82f6',size:9},name:'d = 1 (slow rise)'};
var s2={x:n,y:build(3),mode:'lines+markers',line:{color:'#60a5fa',width:2.5,dash:'dash'},marker:{color:'#60a5fa',size:9,symbol:'square'},name:'d = 3 (fast rise)'};
var s3={x:n,y:build(-2),mode:'lines+markers',line:{color:'#93c5fd',width:2.5,dash:'dot'},marker:{color:'#93c5fd',size:9,symbol:'diamond'},name:'d = -2 (decline)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'position n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1,range:[0,11]},yaxis:{title:'a_n (term value)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:60,r:30,b:60,l:60},legend:{orientation:'h',y:1.14,xanchor:'center',x:0.5,bgcolor:'rgba(0,0,0,0)'}};
Plotly.newPlot('plot-l63-compare-en-extra',[s1,s2,s3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Reading the plot.</strong> For $d = 1$ the sequence is $5, 6, 7, 8, \\ldots$ — a gentle climb of one unit per step. For $d = 3$ it is $5, 8, 11, 14, \\ldots$ — three times as steep. For $d = -2$ it is $5, 3, 1, -1, -3, \\ldots$ — sliding into negative territory by position $n = 4$. The same starting point can lead anywhere depending on the sign and size of $d$.</p>

<h2 class="lesson-title">11. Formula Reference Table</h2>

<div class="calc-highlight"><strong>Every formula you need in one place.</strong> Use this table as a cheat sheet while you work through the practice problems. Each row shows the quantity, the closed-form formula, and a worked example you can plug numbers into.</div>

<div style="overflow-x:auto;margin:1.5rem 0">
<table style="width:100%;border-collapse:collapse;background:rgba(20,20,20,0.6);border-radius:8px;overflow:hidden;font-size:0.92rem">
<thead>
<tr style="background:rgba(59,130,246,0.18);color:#3b82f6">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:2px solid #3b82f6">Quantity</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:2px solid #3b82f6">Formula</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:2px solid #3b82f6">Example</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
<td style="padding:0.7rem 0.9rem;color:#e5e5e5"><strong>General term $a_n$</strong></td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.92)">$a_n = a_1 + (n - 1) \\, d$</td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.82)">$a_1 = 3$, $d = 4$, $n = 20$: $\\;a_{20} = 3 + 19 \\cdot 4 = 79$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02)">
<td style="padding:0.7rem 0.9rem;color:#e5e5e5"><strong>Sum $S_n$ (knowing $a_n$)</strong></td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.92)">$S_n = \\dfrac{n(a_1 + a_n)}{2}$</td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.82)">$a_1 = 1$, $a_{100} = 100$: $\\;S_{100} = \\dfrac{100 \\cdot 101}{2} = 5050$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
<td style="padding:0.7rem 0.9rem;color:#e5e5e5"><strong>Sum $S_n$ (knowing $d$)</strong></td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.92)">$S_n = \\dfrac{n[2 a_1 + (n-1) d]}{2}$</td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.82)">$a_1 = 2$, $d = 3$, $n = 20$: $\\;S_{20} = \\dfrac{20 \\cdot 61}{2} = 610$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02)">
<td style="padding:0.7rem 0.9rem;color:#e5e5e5"><strong>Common difference $d$</strong></td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.92)">$d = \\dfrac{a_q - a_p}{q - p}$</td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.82)">$a_4 = 17$, $a_{10} = 41$: $\\;d = \\dfrac{41 - 17}{10 - 4} = 4$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
<td style="padding:0.7rem 0.9rem;color:#e5e5e5"><strong>Middle term</strong></td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.92)">$a_n = \\dfrac{a_{n-1} + a_{n+1}}{2}$</td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.82)">$a_{n-1} = 14$, $a_{n+1} = 26$: $\\;a_n = \\dfrac{14 + 26}{2} = 20$</td>
</tr>
<tr style="background:rgba(255,255,255,0.02)">
<td style="padding:0.7rem 0.9rem;color:#e5e5e5"><strong>Arithmetic mean of $a, b$</strong></td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.92)">$\\text{AM}(a, b) = \\dfrac{a + b}{2}$</td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.82)">Between $4$ and $20$: $\\;\\text{AM} = \\dfrac{4 + 20}{2} = 12$</td>
</tr>
</tbody>
</table>
</div>

<div class="l-note"><strong>How to use the table.</strong> Identify which quantity the question asks for, locate that row, then read off the formula and plug in the values you know. Most exam problems map directly onto a single row — the challenge is usually translating the word problem into the right $a_1$ and $d$.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>An arithmetic sequence has constant common difference $d$; the whole sequence is determined by $a_1$ and $d$</li>
<li>General term (explicit): $a_n = a_1 + (n - 1) d$; this is a linear function of $n$</li>
<li>Recursive: $a_{n+1} = a_n + d$ with $a_1$ given</li>
<li>Sum formula: $S_n = \\dfrac{n(a_1 + a_n)}{2} = \\dfrac{n[2 a_1 + (n - 1) d]}{2}$ — Gauss's pairing trick</li>
<li>$S_n$ expanded is a quadratic in $n$: $S_n = \\dfrac{d}{2} n^2 + \\left(a_1 - \\dfrac{d}{2}\\right) n$</li>
<li>Middle-term property: $a_n = \\dfrac{a_{n-1} + a_{n+1}}{2}$ for every interior term</li>
<li>Use $d = \\dfrac{a_q - a_p}{q - p}$ to find the common difference from any two terms</li>
<li>Watch out: off-by-one in $(n-1)d$, confusing $a_n$ with $S_n$, sign of $d$ in decreasing sequences</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bazı sayı listeleri düzenli hisseder, çünkü her adım aynı miktarı ekler.</strong> Beşer beşer saymak — 5, 10, 15, 20, 25 — ilkokuldan beri bildiğin en basit örnek. Saatte iki derece düşen sıcaklık, altındakinden 4 cm uzun olan üst üste dizilmiş sandalyeler, başlangıç bakiyesine her hafta aynı lirayı ekleyen bir tasarruf planı: hepsi <em>aritmetik dizilerdir</em>. Kalıp her durumda aynıdır: bir başlangıç sayısı al, bir sonrakini elde etmek için sabit bir adım ekle, devam et.</p>

<p class="l-text">Bu dersin sonunda bir aritmetik dizinin ortak farkını bir bakışta okuyabileceksin, $n$ cinsinden kapalı formülden istediğin terimi yazabileceksin, $a_{n+1} = a_n + d$ özyinelemeli formu ile $a_n = a_1 + (n-1)d$ açık formu arasında geçiş yapabileceksin, ilk $n$ terimi Gauss eşleme hilesiyle toplayabileceksin ve maaş artışı, birikim, stadyum koltuk düzeni gibi gerçek hayat problemlerini çözebileceksin. Bunlar aynı zamanda YKS / TYT ve üniversite giriş sınavlarının dizi sorularında ölçtüğü becerilerdir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir aritmetik diziyi tanımayı ve herhangi iki ardışık terimden ortak fark $d$'yi hesaplamayı</li>
<li>Genel terim formülü $a_n = a_1 + (n-1)d$ ile öncekileri listelemeden istediğin terimi bulmayı</li>
<li>Aynı dizinin özyinelemeli ve açık tanımları arasında çeviri yapmayı</li>
<li>Toplam formülü $S_n = \\dfrac{n(a_1 + a_n)}{2}$ uygulamayı ve onu Gauss eşleme hilesinden türetmeyi</li>
<li>Aritmetik ortalama özelliğini kullanmayı: aritmetik dizide her orta terim, komşularının ortalamasıdır</li>
<li>Maaş, birikim, stadyum koltuk düzeni ve aritmetik dizilerle modellenen diğer günlük durumlarla ilgili sözel problemleri çözmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Dizi Nedir?</h2>

<div class="calc-highlight"><strong>Dizi, sıralı bir sayı listesidir.</strong> Sıra önemlidir: 2, 5, 8, 11 listesi, aynı sayılar geçse de 11, 8, 5, 2'den farklıdır. İlk sayıya $a_1$, ikinciye $a_2$, üçüncüye $a_3$ ve böylece devam eder. Genel terim — yani $n$ konumundaki sayıyı veren kural — $a_n$ olarak yazılır.</div>

<p class="l-text">İlkokulda farkına varmadan onlarca dizi gördün. Doğal sayılar $1, 2, 3, 4, \\ldots$, çift sayılar $2, 4, 6, 8, \\ldots$, kareler $1, 4, 9, 16, \\ldots$ ve ikinin kuvvetleri $1, 2, 4, 8, \\ldots$ hepsi birer dizidir. Bir dizinin belirgin bir kalıbı olmak zorunda değildir — $\\pi$'nin basamakları hiçbir basit kapalı formül kuralı olmamasına rağmen geçerli bir dizidir. Ama bu derste ve bir sonrakinde en basit iki kalıba odaklanıyoruz: <em>aritmetik</em> (sabit ekleme) ve <em>geometrik</em> (sabit çarpma).</p>

<div class="calc-formula"><div class="formula-label">DİZİ İÇİN GÖSTERİM</div><div class="formula-main">$$(a_n) \\;=\\; a_1, \\, a_2, \\, a_3, \\, \\ldots, \\, a_n, \\, \\ldots$$</div><div class="formula-sub">$a_n$, $n$ konumundaki terimi gösterir. Alt indis $n$ pozitif tam sayıdır: $n = 1, 2, 3, \\ldots$. Bazı kitaplar $n = 0$'dan başlar — kaynağındaki kurala dikkat et.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sonlu ve sonsuz</div><div class="card-body">Bir dizi bir $a_N$'de durabilir (sonlu) ya da sonsuza kadar devam edebilir (sonsuz). Bu derste her iki tür de geçer; formüller her ikisini aynı şekilde işler.</div></div>
<div class="calc-card"><div class="card-title">Terim ve konum</div><div class="card-body">$a_n$, $n$ konumundaki <em>değerdir</em>. Konum $n$ sadece bir sayaçtır; değişen şey her terimde değerdir.</div></div>
<div class="calc-card"><div class="card-title">Kapalı ve özyinelemeli</div><div class="card-body">"Kapalı biçim" $a_n$'yi doğrudan $n$'den veren bir formüldür. "Özyinelemeli biçim" $a_{n+1}$'i önceki terimlerden veren bir kuraldır. Her ikisinin kendi yararı vardır.</div></div>
</div>

<h2 class="lesson-title">2. Aritmetik Dizi: Tanım</h2>

<div class="calc-highlight"><strong>Aritmetik dizi, herhangi iki ardışık terim arasındaki farkın aynı sabit olduğu dizidir.</strong> Bu sabite <em>ortak fark</em> denir ve $d$ ile gösterilir. Tüm dizi yalnızca iki sayı ile belirlenir: ilk terim $a_1$ ve ortak fark $d$.</div>

<div class="calc-formula"><div class="formula-label">TANIMLAYICI ÖZELLİK</div><div class="formula-main">$$a_{n+1} - a_n \\;=\\; d \\qquad \\text{her } n \\geq 1 \\text{ için}$$</div><div class="formula-sub">Bir terimden sonrakine geçişteki boşluk hep aynıdır. $d > 0$ ise dizi artar, $d < 0$ ise azalır ve $d = 0$ ise her terim $a_1$'e eşittir (sabit dizi).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$3, 7, 11, 15, 19, \\ldots$ dizisi aritmetik mi? Öyleyse $d$'yi bul.<br><br>Boşlukları kontrol et:<br>$7 - 3 = 4$, $11 - 7 = 4$, $15 - 11 = 4$, $19 - 15 = 4$.<br><br>Tüm boşluklar 4'e eşit, evet — aritmetik ve $\\mathbf{d = 4}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$1, 4, 9, 16, 25, \\ldots$ (kareler) dizisi aritmetik mi?<br><br>$4 - 1 = 3$, $9 - 4 = 5$, $16 - 9 = 7$. Farkların kendisi sabit <em>değil</em> (her seferinde 2 artıyor). Yani <strong>hayır</strong> — kareler aritmetik bir dizi değildir. Bu derste işlemeyeceğimiz <em>kuadratik</em> bir dizi oluştururlar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$d > 0$: artan</div><div class="card-body">Her terim öncekinden büyüktür. Örnek: $2, 5, 8, 11, \\ldots$ ve $d = 3$.</div></div>
<div class="calc-card"><div class="card-title">$d < 0$: azalan</div><div class="card-body">Her terim öncekinden küçüktür. Örnek: $20, 17, 14, 11, \\ldots$ ve $d = -3$.</div></div>
<div class="calc-card"><div class="card-title">$d = 0$: sabit</div><div class="card-body">Tüm terimler eşit. Örnek: $7, 7, 7, 7, \\ldots$. Teknik olarak hâlâ aritmetik, sadece sıkıcı.</div></div>
</div>

<h2 class="lesson-title">3. Genel Terim Formülü</h2>

<div class="calc-highlight"><strong>Önceki terimleri listelemeden istediğin $n$ için $a_n$ değerini yazabilirsin.</strong> $a_1$'den başla, $a_n$'ye ulaşmak için toplam $n - 1$ kez $d$ ekle. Bu, tüm dersin en kullanışlı tek formülünü verir.</div>

<div class="calc-formula"><div class="formula-label">GENEL TERİM (AÇIK FORMÜL)</div><div class="formula-main">$$a_n \\;=\\; a_1 + (n - 1) \\, d$$</div><div class="formula-sub">İlk terim artı $n - 1$ tane $d$ adımı. Birim kayması kritiktir: $a_1$'e sıfır adım $d$ eklenir, $a_2$'ye bir adım, $a_n$'ye $n - 1$ adım.</div></div>

<p class="l-text"><strong>Neden $n$ değil $n - 1$?</strong> İlk birkaç terimi düşün:<br>$a_1 = a_1 + 0 \\cdot d$ (sıfır adım)<br>$a_2 = a_1 + 1 \\cdot d$ (bir adım)<br>$a_3 = a_1 + 2 \\cdot d$ (iki adım)<br>$a_n = a_1 + (n - 1) \\cdot d$ (kalıp "adım sayısı = konum eksi bir")<br>Bu birim kayması, öğrencilerin yaptığı en yaygın hatadır. Her zaman $n = 1$ koyup denetle — tam olarak $a_1$ elde etmelisin.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — BELİRLİ BİR TERİMİ BUL</div><div class="example-body"><strong>Verilen:</strong> $a_1 = 3$ ve $d = 5$. $a_{20}$'yi (20. terim) bul.<br><br>$a_{20} = a_1 + (20 - 1) \\cdot d = 3 + 19 \\cdot 5 = 3 + 95 = \\mathbf{98}$.<br><br>20 terimi tek tek listelemeye gerek yok — formül doğrudan cevaba atlar.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İKİ TERİMDEN $d$'Yİ BUL</div><div class="example-body"><strong>Verilen:</strong> bir aritmetik dizide $a_4 = 17$ ve $a_{10} = 41$. $d$'yi bul.<br><br>$a_4$'ten $a_{10}$'a $10 - 4 = 6$ adım atılır. Yani $a_{10} - a_4 = 6d$, dolayısıyla $41 - 17 = 6d$, yani $24 = 6d$, sonuç $\\mathbf{d = 4}$.<br><br>$d$'yi bildiğin için $a_1$'i de bulabilirsin: $a_4 = a_1 + 3d = a_1 + 12 = 17$, yani $a_1 = 5$. Tüm dizi: $5, 9, 13, 17, 21, \\ldots$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İKİ DOĞRUSAL DENKLEM</div><div class="example-body"><strong>Verilen:</strong> bir aritmetik dizide $a_3 = 11$ ve $a_8 = 31$. $a_1$ ve $d$'yi bul, sonra genel terimi yaz.<br><br>Çıkar: $a_8 - a_3 = (8 - 3) d = 5 d$, yani $31 - 11 = 5 d \\Rightarrow \\mathbf{d = 4}$.<br>Yerine koy: $a_3 = a_1 + 2 d = a_1 + 8 = 11 \\Rightarrow \\mathbf{a_1 = 3}$.<br>Genel terim: $a_n = 3 + (n - 1) \\cdot 4 = 4 n - 1$.<br><br>$n = 8$'de hızlı denetim: $4 \\cdot 8 - 1 = 31$. ✓</div></div>

<div class="l-note"><strong>"$a_p$ ve $a_q$ verildiğinde $d$'yi bul" için temiz tarif.</strong> $a_q - a_p = (q - p) \\, d$ formülü hemen $d = \\dfrac{a_q - a_p}{q - p}$ olarak düzenlenir. Bunu ezberle; çoğu "iki terim verilmiş" sorusuna tek satırda cevap verir.</div>

<div class="calc-graph"><div id="plot-l63-terms-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $3, 7, 11, 15, 19, 23, 27, 31, 35, 39$ aritmetik dizisinin ilk on terimi ($a_1 = 3$, $d = 4$) bir çubuk grafik olarak çiziliyor. Her çubuk solundaki çubuktan tam olarak 4 birim daha uzundur — bu ortak farktır. Kalıp eşit adımlarla büyür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a1=3,d=4;var n=[];var a=[];for(var i=1;i<=10;i++){n.push(i);a.push(a1+(i-1)*d);}
var bars={x:n,y:a,type:'bar',marker:{color:'#3b82f6'},text:a,textposition:'outside',textfont:{color:'#e5e5e5'},name:'a_n'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'konum n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'a_n (terim değeri)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,45]},margin:{t:30,r:30,b:60,l:60},showlegend:false};
Plotly.newPlot('plot-l63-terms-tr',[bars],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Özyinelemeli Formül</h2>

<div class="calc-highlight"><strong>Bir aritmetik dizi özyinelemeli olarak da tanımlanabilir.</strong> $n$ cinsinden kapalı bir formül vermek yerine "$a_1$'den başla ve herhangi bir terimden bir sonrakine geçmek için $d$ ekle" dersin. Bu, dizinin gerçekten büyüme biçimine uyar.</div>

<div class="calc-formula"><div class="formula-label">ÖZYİNELEMELİ TANIM</div><div class="formula-main">$$a_1 \\text{ verilmiş}, \\qquad a_{n+1} \\;=\\; a_n + d \\quad \\text{her } n \\geq 1 \\text{ için}$$</div><div class="formula-sub">Özyinelemenin iki bilgiye ihtiyacı var: bir başlangıç değeri ("temel durum") ve bir adım kuralı. Temel durum olmadan özyineleme havada kalır — bir yere demir atmalısın.</div></div>

<p class="l-text">Özyinelemeli biçim, bilgisayarların diziyi gerçekten ürettiği yolu yansıtır — $a_1$ ile başla, kuralı tekrar tekrar uygula, her sonucu yaz. Açık biçim $a_n = a_1 + (n-1)d$ aynı bilgidir; ara terimleri hesaplamadan istediğin terime atlamana izin verir. Her iki form aynı diziyi tanımlar; soruna uygun olanı seç.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ÖZYİNELEMELİ</div><div class="compare-item">Kuralı yazması kolay</div><div class="compare-item">Terim terim üretmesi kolay</div><div class="compare-item">100. terimi istersen yavaş (önce 99'u hesaplamak gerek)</div><div class="compare-item">Doğal dile uyar: "başla, sonra $d$ ekle"</div></div><div class="compare-col"><div class="compare-title">AÇIK</div><div class="compare-item">Türetmesi biraz daha karmaşık</div><div class="compare-item">Herhangi bir $a_n$'ye doğrudan atlatır</div><div class="compare-item">Ne kadar büyük $n$ olsa da hızlı</div><div class="compare-item">"$a_n = 100$ olan $n$'yi bul" gibi denklemler için en iyisi</div></div></div>

<div class="calc-graph"><div id="plot-l63-linear-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> aynı aritmetik dizi ($a_1 = 3$, $d = 4$), ama bu kez konum $n$ ile terim değeri $a_n$ arasında çizgi grafik. Noktalar tamamen doğrusal bir hatta yatıyor — bu aritmetik dizinin imzasıdır. Hattın eğimi tam olarak $d = 4$, $y$-kesişimi ise $a_1 - d = -1$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a1=3,d=4;var n=[];var a=[];for(var i=1;i<=10;i++){n.push(i);a.push(a1+(i-1)*d);}
var pts={x:n,y:a,mode:'lines+markers',line:{color:'#3b82f6',width:2.5},marker:{color:'#3b82f6',size:9},name:'a_n = 3 + 4(n-1)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'konum n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1,range:[0,11]},yaxis:{title:'a_n (terim değeri)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,45]},margin:{t:30,r:30,b:60,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l63-linear-tr',[pts],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Gizli bir doğrusal fonksiyon.</strong> $a_n = a_1 + (n - 1) d$ formülü $a_n = d \\cdot n + (a_1 - d)$ olarak yeniden yazılabilir. Bu, eğimi $d$ ve kesişimi $a_1 - d$ olan $n$'nin doğrusal fonksiyonudur. Yukarıdaki grafiğin neden tam düz olduğunun açıklaması bu — aritmetik dizi, pozitif tam sayılarda hesaplanan bir doğrusal fonksiyondur.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$a_1 = 10$, $a_{n+1} = a_n - 2$ özyinelemeli tanımını açık formüle çevir ve ilk altı terimi yaz. (Cevap: $d = -2$ olduğu için $a_n = 10 + (n-1)(-2) = 12 - 2n$. İlk altı terim: $10, 8, 6, 4, 2, 0$.) Sonra kendine sor: dizi ilk ne zaman negatif olur? ($n = 7$'de, $a_7 = -2$.)</div></div>

<h2 class="lesson-title">5. Toplam Formülü: Gauss'un Hilesi</h2>

<div class="calc-highlight"><strong>Bir aritmetik dizinin ilk $n$ teriminin toplamı için güzel bir kısayol vardır.</strong> Efsaneye göre, dokuz yaşındaki Carl Friedrich Gauss'a öğretmeni 1'den 100'e kadar olan sayıları toplamasını söyledi — birkaç saniye içinde 5050 cevabını verdi. Hilesi her aritmetik dizide işler.</div>

<p class="l-text"><strong>Gauss'un fikri.</strong> Toplamı ileri ve geri yaz, iki satırı terim terim topla. İşin parlak kısmı şudur: her sütun aynı sayıya — ilk terim artı son terim — toplanır, çünkü üst satır $d$ kadar artarken alt satır $d$ kadar azalır ve sütun toplamları değişmeden kalır.</p>

<div class="calc-formula"><div class="formula-label">EŞLEME — ADIM ADIM</div><div class="formula-main">$$\\begin{aligned} S_n &= a_1 + a_2 + a_3 + \\cdots + a_{n-1} + a_n \\\\ S_n &= a_n + a_{n-1} + a_{n-2} + \\cdots + a_2 + a_1 \\\\ \\hline 2 S_n &= (a_1 + a_n) + (a_1 + a_n) + \\cdots + (a_1 + a_n) = n (a_1 + a_n) \\end{aligned}$$</div><div class="formula-sub">Sağdaki her sütun $a_1 + a_n$'ye toplanır ($a_k + a_{n+1-k} = a_1 + a_n$ özelliğiyle sütun sütun denetleyebilirsin) ve $n$ tane sütun var. 2'ye böl, toplam formülünü elde edersin.</div></div>

<div class="calc-formula"><div class="formula-label">İLK $n$ TERİMİN TOPLAMI</div><div class="formula-main">$$S_n \\;=\\; \\frac{n \\, (a_1 + a_n)}{2} \\;=\\; \\frac{n \\, [\\, 2 a_1 + (n-1) d \\,]}{2}$$</div><div class="formula-sub">İki eşdeğer form. $a_1$ ve $a_n$'yi biliyorsan birinciyi, $a_1$ ve $d$'yi biliyorsan ikinciyi kullan. Sayısal olarak aynı sonucu verirler.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — GAUSS'UN KLASİĞİ</div><div class="example-body">$1 + 2 + 3 + \\cdots + 100$ değerini hesapla.<br><br>$a_1 = 1$, $a_{100} = 100$, $n = 100$ olan aritmetik dizi.<br><br>$S_{100} = \\dfrac{100 \\cdot (1 + 100)}{2} = \\dfrac{100 \\cdot 101}{2} = \\dfrac{10100}{2} = \\mathbf{5050}$.<br><br>Genç Gauss bunu saniyeler içinde gördü — $(1, 100), (2, 99), (3, 98), \\ldots, (50, 51)$ çiftleri her biri 101'e toplanır, toplam 50 çift. Aynı cevap.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İLK 50 TEK SAYININ TOPLAMI</div><div class="example-body">$1 + 3 + 5 + 7 + \\cdots$ ifadesini ilk 50 tek sayı için hesapla.<br><br>$a_1 = 1$, $d = 2$, $n = 50$ olan aritmetik dizi.<br><br>50. terim: $a_{50} = 1 + 49 \\cdot 2 = 99$.<br><br>$S_{50} = \\dfrac{50 \\cdot (1 + 99)}{2} = \\dfrac{50 \\cdot 100}{2} = \\mathbf{2500}$.<br><br>Zarif bir kalıba dikkat: ilk $n$ tek sayının toplamı $n^2$'ye eşittir. Burada $50^2 = 2500$. ✓</div></div>

<div class="calc-graph"><div id="plot-l63-sum-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $3, 7, 11, 15, \\ldots$ aritmetik dizisinin $n = 1, 2, \\ldots, 10$ için kümülatif toplamı $S_n$. Terimlerin kendisi doğrusal büyürken, kümülatif toplam <em>kuadratik</em> büyür: $S_n = \\dfrac{n(2 a_1 + (n-1) d)}{2}$ $n$'nin bir kuadratik fonksiyonudur. Bu yüzden çubuklar hızlanır — her yeni çubuk öncekinden daha fazla ekler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a1=3,d=4;var n=[];var s=[];var running=0;for(var i=1;i<=10;i++){running+=a1+(i-1)*d;n.push(i);s.push(running);}
var bars={x:n,y:s,type:'bar',marker:{color:'#3b82f6'},text:s,textposition:'outside',textfont:{color:'#e5e5e5'},name:'S_n'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'terim sayısı n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'kümülatif toplam S_n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,250]},margin:{t:30,r:30,b:60,l:60},showlegend:false};
Plotly.newPlot('plot-l63-sum-tr',[bars],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5b. $S_n$ — $n$'nin Kuadratiği</h2>

<div class="calc-highlight"><strong>$S_n$ toplamının kendisi $n$'nin bir kuadratik fonksiyonudur.</strong> $S_n = \\dfrac{n [2 a_1 + (n-1) d]}{2}$'i açarsan, $n$'nin ikinci derece polinomunu elde edersin. Kümülatif toplam çubuklarının neden gittikçe daha hızlı büyüdüğünü açıklar: kuadratik hızlanır.</div>

<div class="calc-formula"><div class="formula-label">AÇILMIŞ TOPLAM FORMÜLÜ</div><div class="formula-main">$$S_n \\;=\\; \\frac{d}{2} \\, n^2 + \\left(a_1 - \\frac{d}{2}\\right) n$$</div><div class="formula-sub">Sabit terimi olmayan $n$'nin kuadratiği ($S_0 = 0$ kuralı gereği). Baş katsayı $d/2$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TERS GİT</div><div class="example-body">Bir aritmetik dizide her $n \\geq 1$ için $S_n = 2 n^2 + 3 n$. $a_1$ ve $d$'yi bul.<br><br>$S_n = \\dfrac{d}{2} n^2 + \\left(a_1 - \\dfrac{d}{2}\\right) n$ ile karşılaştır. Yani $\\dfrac{d}{2} = 2 \\Rightarrow d = 4$ ve $a_1 - \\dfrac{d}{2} = 3 \\Rightarrow a_1 = 3 + 2 = 5$.<br><br>Hızlı denetim: $S_1 = 5$, yani $a_1 = 5$ ✓. $S_2 = 8 + 6 = 14$, yani $a_2 = 14 - 5 = 9 = 5 + 4 = a_1 + d$. ✓</div></div>

<div class="l-note"><strong>$S_n$'den terimleri kurtarma.</strong> Her $n \\geq 2$ için $a_n = S_n - S_{n-1}$. Bu "türevi kurtarmak için komşu ters türevleri çıkar" yaklaşımının ayrık karşılığıdır. Yalnızca aritmetik için değil, her dizi için işler — fakat aritmetik için bir $a_n$'den diğerine fark her zaman tam olarak $d$'dir.</div>

<h2 class="lesson-title">6. Aritmetik Ortalama Özelliği</h2>

<div class="calc-highlight"><strong>Bir aritmetik dizide her orta terim, iki komşusunun ortalamasıdır.</strong> Sabit boşluğun adının <em>aritmetik</em> ortalama olmasının sebebi budur — her iç terimi önceki ve sonraki terimin sade ortalaması yapar.</div>

<div class="calc-formula"><div class="formula-label">ORTA TERİM ÖZELLİĞİ</div><div class="formula-main">$$a_n \\;=\\; \\frac{a_{n-1} + a_{n+1}}{2} \\qquad \\text{her } n \\geq 2 \\text{ için}$$</div><div class="formula-sub">Eşdeğer olarak $2 a_n = a_{n-1} + a_{n+1}$. Bu, aritmetiklik için hızlı bir testtir: üç ardışık terim seç ve ortanın dış ikisinin ortalamasına eşit olup olmadığını kontrol et.</div></div>

<p class="l-text"><strong>Neden işliyor.</strong> Tanım gereği $a_n - a_{n-1} = d$ ve $a_{n+1} - a_n = d$. İkisini topla: $a_{n+1} - a_{n-1} = 2 d$. Aynı zamanda $a_{n+1} + a_{n-1} = (a_n + d) + (a_n - d) = 2 a_n$. 2'ye böl ve özellik çıkar.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — EKSİK ORTA TERİMİ BUL</div><div class="example-body">Bir aritmetik dizide $a_{n-1} = 14$ ve $a_{n+1} = 26$ terimleri biliniyor. $a_n$'yi bul.<br><br>Orta terim özelliğine göre, $a_n = \\dfrac{14 + 26}{2} = \\dfrac{40}{2} = \\mathbf{20}$.<br><br>Çapraz denetim: ortak fark $\\dfrac{26 - 14}{2} = 6$. Yani üç terim $14, 20, 26$ ve $d = 6$. ✓</div></div>

<div class="l-note"><strong>Genelleme.</strong> Aynı ortalama fikri, $a_n$'den eşit uzaklıktaki herhangi bir terim çiftine genişler: indislerin anlamlı olduğu her pozitif tam sayı $k$ için $a_n = \\dfrac{a_{n-k} + a_{n+k}}{2}$. Aritmetik dizideki her terim, etrafına simetrik yerleştirilmiş herhangi iki terimin tam ortasında yer alır.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ARİTMETİK ORTALAMA EKLEME</div><div class="example-body">$4$ ile $20$ arasına üç sayı yerleştir, böylece beş sayı bir aritmetik dizi oluştursun.<br><br>Tam dizi $a_1 = 4, a_2, a_3, a_4, a_5 = 20$ ve $n = 5$ terim. Yani $a_5 = a_1 + 4 d \\Rightarrow 20 = 4 + 4 d \\Rightarrow \\mathbf{d = 4}$.<br><br>Sonra $a_2 = 8, a_3 = 12, a_4 = 16$ ve dizi $\\mathbf{4, 8, 12, 16, 20}$. Eklenen üç sayıya 4 ile 20 arasındaki <em>aritmetik ortalamalar</em> denir.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir aritmetik dizinin beş ardışık terimi 75'e toplanıyorsa, orta terim kaçtır? (İpucu: ortalama özelliğine göre $a_3$ beş terimin ortalamasıdır, yani $a_3 = 75 / 5 = 15$.) Aynı hile herhangi bir tek sayıdaki ardışık terim için de işler — ortadaki terim her zaman ortalamaya eşittir.</div></div>

<h2 class="lesson-title">7. Sözel Problemler</h2>

<p class="l-text">Aritmetik diziler, her adımda sabit bir miktar büyüyen ya da küçülen bir şey olduğunda günlük hayatta sürekli ortaya çıkar. Kalıp her zaman aynıdır: $a_1$'i (başlangıç değeri) belirle, $d$'yi (sabit adım) belirle, sonra sorunun tek bir terim mi yoksa birikmiş toplam mı istediğine göre genel terim formülü $a_n = a_1 + (n - 1) d$ veya toplam formülü $S_n = \\dfrac{n (a_1 + a_n)}{2}$ uygula. İşte üç klasik problem türü.</p>

<div class="calc-example"><div class="example-label">PROBLEM A — MAAŞ ARTIŞI</div><div class="example-body">Yeni başlayan bir mühendis 1. yılda ayda 30.000 lira kazanıyor. Şirket sabit 4.500 lira yıllık zam veriyor. 10. yılda aylık maaş ne kadar? 10 yıl boyunca aylık maaşların toplamı ne kadardır?<br><br>$a_1 = 30000$, $d = 4500$, $n = 10$ olan aritmetik dizi.<br><br>10. yıl maaşı: $a_{10} = 30000 + 9 \\cdot 4500 = 30000 + 40500 = \\mathbf{70{.}500}$ lira/ay.<br><br>10 yıl boyunca aylık maaşların toplamı (yani $a_1 + a_2 + \\cdots + a_{10}$):<br>$S_{10} = \\dfrac{10 \\cdot (30000 + 70500)}{2} = \\dfrac{10 \\cdot 100500}{2} = \\mathbf{502{.}500}$ lira.<br><br>(Yıllık toplam kazanç bunun 12 katı olur, çünkü maaşlar aylıktır.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM B — STADYUM KOLTUK DÜZENİ</div><div class="example-body">Bir stadyumda 20 sıra koltuk var. İlk sırada 30 koltuk, her arka sırada öndekine göre 4 koltuk daha. Arka sırada kaç koltuk var? Stadyum toplamda kaç koltuk barındırır?<br><br>Aritmetik dizi: $a_1 = 30$, $d = 4$, $n = 20$.<br><br>Arka sıra: $a_{20} = 30 + 19 \\cdot 4 = 30 + 76 = \\mathbf{106}$ koltuk.<br><br>Toplam koltuk: $S_{20} = \\dfrac{20 \\cdot (30 + 106)}{2} = \\dfrac{20 \\cdot 136}{2} = \\mathbf{1360}$ koltuk.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM C — BİRİKEN TASARRUFLAR</div><div class="example-body">Ayşe bir tasarruf alışkanlığı başlatıyor. 1. haftada 100 lira yatırıyor. Her hafta yatırımını 20 lira artırıyor (yani 2. hafta 120 lira, 3. hafta 140 lira, vs.). 25. haftada ne kadar yatırır? 52. haftanın sonuna kadar (bir tam yıl) toplam ne kadar biriktirmiştir?<br><br>$a_1 = 100$, $d = 20$ olan aritmetik dizi.<br><br>25. hafta yatırımı: $a_{25} = 100 + 24 \\cdot 20 = 100 + 480 = \\mathbf{580}$ lira.<br><br>52 haftalık toplam: $a_{52} = 100 + 51 \\cdot 20 = 1120$. Sonra $S_{52} = \\dfrac{52 \\cdot (100 + 1120)}{2} = \\dfrac{52 \\cdot 1220}{2} = 26 \\cdot 1220 = \\mathbf{31{.}720}$ lira.<br><br>Sabit artışlı mütevazı haftalık bir alışkanlık, kayda değer bir yıllık toplama dönüşür.</div></div>

<h2 class="lesson-title">7b. Tümevarımla Kanıt (İsteğe Bağlı Derinleşme)</h2>

<div class="calc-highlight"><strong>Genel terim ve toplam formülleri matematiksel tümevarımla kesin biçimde kanıtlanabilir.</strong> Bu meraklılar için isteğe bağlı okumadır: çoğu sınav sorusu formülleri verilmiş olarak kabul eder. Ama tümevarımla başka bir derste tanışmışsan, bu formüllerin neden yalnızca makul değil, doğru olduğunu görmenin en temiz yolu burada.</div>

<p class="l-text"><strong>$a_n = a_1 + (n - 1) d$ için tümevarımsal kanıt.</strong></p>
<p class="l-text"><em>Temel durum</em> ($n = 1$): formül $a_1 + 0 \\cdot d = a_1$ verir. ✓</p>
<p class="l-text"><em>Tümevarım adımı</em>: formülün bir $n = k$ için geçerli olduğunu varsay, yani $a_k = a_1 + (k - 1) d$. Özyinelemeli tanım gereği $a_{k+1} = a_k + d = a_1 + (k - 1) d + d = a_1 + k \\cdot d = a_1 + ((k + 1) - 1) d$. Yani formül $n = k + 1$'de de geçerli. Tümevarımla her $n \\geq 1$ için geçerlidir. $\\blacksquare$</p>

<p class="l-text"><strong>$S_n = \\dfrac{n (a_1 + a_n)}{2}$ için tümevarımsal kanıt.</strong></p>
<p class="l-text"><em>Temel durum</em> ($n = 1$): $S_1 = a_1$ ve formül $\\dfrac{1 \\cdot (a_1 + a_1)}{2} = a_1$ verir. ✓</p>
<p class="l-text"><em>Tümevarım adımı</em>: $S_k = \\dfrac{k (a_1 + a_k)}{2}$ varsay. Sonra $S_{k+1} = S_k + a_{k+1} = \\dfrac{k (a_1 + a_k)}{2} + a_{k+1}$. $a_k = a_1 + (k-1) d$ ve $a_{k+1} = a_k + d$ kullanarak dikkatli bir cebir bunu $\\dfrac{(k+1)(a_1 + a_{k+1})}{2}$ olarak yeniden düzenler — tam olarak $n = k + 1$'deki formül. $\\blacksquare$</p>

<div class="l-note"><strong>Matematikçiler neden tümevarımı sever.</strong> Gauss eşleme hilesi "açık görünür" ama aslında zekice bir yeniden düzenlemedir. Tümevarım, keyfi $n$ için iddiayı tek bir başlangıç durumuna artı bir miras kuralına indirgeyerek aynı sonucu hava geçirmez yapar. "Tüm pozitif tam sayılar hakkında" her iddia, prensipte bu yolla kanıtlanabilir.</div>

<h2 class="lesson-title">8. Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$(n-1) d$'de birim kayması</div><div class="card-body">$a_n = a_1 + (n-1) d$ yerine $a_n = a_1 + n d$ yazmak en yaygın hatadır. Her zaman $n = 1$ koyup kontrol et: $a_1 + d$ değil, $a_1$ elde etmelisin.</div></div>
<div class="calc-card"><div class="card-title">$a_n$ ile $S_n$ karıştırmak</div><div class="card-body">$a_n$ $n$. terimin değeridir. $S_n$ ilk $n$ terimin toplamıdır. Sözel problemler genelde birini ister ama seni diğerine çeker.</div></div>
<div class="calc-card"><div class="card-title">$d$'nin negatif işaretini unutmak</div><div class="card-body">Azalan dizide $d < 0$. Negatif gereken yere pozitif koymak sonraki tüm terimleri ters çevirir.</div></div>
<div class="calc-card"><div class="card-title">Adım sayısı ve indis</div><div class="card-body">$a_p$'den $a_q$'ya gitmek $q$ değil $q - p$ adım alır. Yani $a_q - a_p = (q - p) \\, d$ — indis farkı adım sayısıdır.</div></div>
<div class="calc-card"><div class="card-title">"Ortalama × terim sayısı"</div><div class="card-body">Toplamı hatırlamanın temiz bir yolu: $S_n = (\\text{ilk ve son ortalaması}) \\times (\\text{terim sayısı}) = \\dfrac{a_1 + a_n}{2} \\cdot n$. Aynı formül, daha kolay hatırlanır.</div></div>
<div class="calc-card"><div class="card-title">Aritmetiklik denetimi</div><div class="card-body">Yaygın tuzak: öğrenciler her "artan" diziyi aritmetik sanır. Her zaman <em>ardışık farkların eşit olduğunu</em> test et. $1, 4, 9, 16$ artar ama aritmetik değildir.</div></div>
</div>

<h2 class="lesson-title">9. Alıştırma Problemleri</h2>

<p class="l-text">Çözümü okumadan önce her birini dene. Yardımsız beş veya daha fazlasını çözmeyi hedefle — sınava hazır olmanın eşiği budur.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — 15. TERİMİ BUL</div><div class="example-body">$a_1 = 7$ ve $d = 3$ verildiğinde $a_{15}$'i bul.<br><br>$a_{15} = 7 + (15 - 1) \\cdot 3 = 7 + 42 = \\mathbf{49}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — $d$'Yİ BUL</div><div class="example-body">Aritmetik dizide $a_5 = 22$ ve $a_{12} = 50$ verildiğinde $d$ ve $a_1$'i bul.<br><br>$a_{12} - a_5 = 7 d$, yani $50 - 22 = 28 = 7 d$, dolayısıyla $\\mathbf{d = 4}$.<br><br>Sonra $a_1 = a_5 - 4 d = 22 - 16 = \\mathbf{6}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — İLK 20 TERİMİN TOPLAMI</div><div class="example-body">$2, 5, 8, 11, \\ldots$ dizisinin ilk 20 teriminin toplamını hesapla.<br><br>Aritmetik, $a_1 = 2$, $d = 3$. 20. terim: $a_{20} = 2 + 19 \\cdot 3 = 59$.<br><br>$S_{20} = \\dfrac{20 \\cdot (2 + 59)}{2} = \\dfrac{20 \\cdot 61}{2} = \\mathbf{610}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — $n$'Yİ ÇÖZ</div><div class="example-body">$4, 7, 10, 13, \\ldots$ dizisinde hangi terim 100'e eşittir? (Yani $a_n = 100$ olan $n$'yi bul.)<br><br>$a_n = 4 + (n - 1) \\cdot 3 = 100 \\Rightarrow 3 (n - 1) = 96 \\Rightarrow n - 1 = 32 \\Rightarrow \\mathbf{n = 33}$.<br><br>Denetim: $a_{33} = 4 + 32 \\cdot 3 = 4 + 96 = 100$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — ORTA TERİM</div><div class="example-body">Bir aritmetik dizinin üç ardışık terimi $x - 3$, $2x + 1$ ve $5x - 7$. $x$'i bul.<br><br>Orta terim özelliği: $2(2x + 1) = (x - 3) + (5x - 7)$.<br><br>$4x + 2 = 6x - 10 \\Rightarrow 12 = 2x \\Rightarrow \\mathbf{x = 6}$.<br><br>Denetim: terimler $3, 13, 23$ olur, ortak fark 10. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — ÇİFT SAYILARIN TOPLAMI</div><div class="example-body">$2 + 4 + 6 + \\cdots + 200$ (ilk 100 çift sayının toplamı) değerini hesapla.<br><br>Aritmetik, $a_1 = 2$, $d = 2$, $a_{100} = 200$, $n = 100$.<br><br>$S_{100} = \\dfrac{100 \\cdot (2 + 200)}{2} = \\dfrac{100 \\cdot 202}{2} = \\mathbf{10{.}100}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — AZALAN DİZİ</div><div class="example-body">Bir dizide $a_1 = 50$ ve $d = -3$. Hâlâ pozitif olan en küçük terimi ve onun konumunu $n$ bul.<br><br>$a_n = 50 + (n - 1)(-3) = 53 - 3n$. $a_n > 0$ olan en büyük $n$'yi istiyoruz, yani $53 - 3n > 0$, yani $n < \\tfrac{53}{3} \\approx 17{,}67$. Yani en büyük tam sayı $n = 17$.<br><br>$a_{17} = 53 - 51 = \\mathbf{2}$, en küçük pozitif terim, konum $\\mathbf{n = 17}$. Sonraki terim $a_{18} = -1$ zaten negatiftir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — KARİYER BOYUNCA MAAŞ</div><div class="example-body">Bir çalışan 1. yılda 40.000 lira kazanıyor, yılda sabit 5.000 lira zamla. 25 yıllık bir kariyerde tüm yıllık maaşların toplamı nedir?<br><br>$a_1 = 40000$, $d = 5000$, $n = 25$. Son yıl: $a_{25} = 40000 + 24 \\cdot 5000 = 160000$.<br><br>$S_{25} = \\dfrac{25 \\cdot (40000 + 160000)}{2} = \\dfrac{25 \\cdot 200000}{2} = \\mathbf{2{.}500{.}000}$ lira ömür boyu kazanç.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 9 — 7'NİN KATLARI</div><div class="example-body">1 ile 1000 arasındaki 7'nin tüm katlarının toplamını bul.<br><br>Bu aralıktaki 7'nin katları $7, 14, 21, \\ldots, 994$ ($7 \\cdot 142 = 994$ ve $7 \\cdot 143 = 1001 > 1000$). Bu aritmetik, $a_1 = 7$, $d = 7$, $a_n = 994$.<br><br>Terim sayısı: $n - 1 = \\dfrac{994 - 7}{7} = 141$, yani $n = 142$.<br><br>Toplam: $S_{142} = \\dfrac{142 \\cdot (7 + 994)}{2} = \\dfrac{142 \\cdot 1001}{2} = 71 \\cdot 1001 = \\mathbf{71{.}071}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 10 — TOPLAM DENKLEMİ</div><div class="example-body">$a_1 = 2$ ve $d = 3$ olan bir aritmetik dizide $S_n \\geq 1000$ olan en küçük $n$'yi bul.<br><br>$S_n = \\dfrac{n [2 \\cdot 2 + (n - 1) \\cdot 3]}{2} = \\dfrac{n (3 n + 1)}{2}$. Bunu $\\geq 1000$ yap: $n (3 n + 1) \\geq 2000$, yani $3 n^2 + n - 2000 \\geq 0$.<br><br>Sınır denklemini çöz: $3 n^2 + n - 2000 = 0 \\Rightarrow n = \\dfrac{-1 + \\sqrt{1 + 24000}}{6} = \\dfrac{-1 + \\sqrt{24001}}{6} \\approx \\dfrac{-1 + 154{,}92}{6} \\approx 25{,}65$.<br><br>Yani $S_n \\geq 1000$ olan en küçük tam sayı $\\mathbf{n = 26}$. Denetim: $S_{26} = \\dfrac{26 \\cdot 79}{2} = 1027 \\geq 1000$ ✓ ve $S_{25} = \\dfrac{25 \\cdot 76}{2} = 950 < 1000$. ✓</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Bir sonraki ders <em>geometrik</em> dizileri çalışır; her terim, sabit bir fark $d$ eklemek yerine, öncekinin sabit bir oran $r$ ile <em>çarpılmasıyla</em> elde edilir. Az önce gördüğün kalıpların çoğu açık değişikliklerle taşınır: genel terim $a_n = a_1 \\, r^{n-1}$ olur ve toplamın da $r^n$ içeren karşılık gelen kapalı bir formu vardır. Toplama (aritmetik, doğrusal büyüme) ile çarpma (geometrik, üstel büyüme) arasındaki karşıtlık, tüm sınav öncesi matematikte en önemli kavramsal sıçramalardan biridir.</div>

<h2 class="lesson-title">10. Yan Yana: $d$ Diziyi Nasıl Şekillendirir</h2>

<div class="calc-highlight"><strong>Tek bir $d$ sayısı dizinin davranışıyla ilgili her şeyi kontrol eder.</strong> Aşağıda, aynı başlangıç terimi $a_1 = 5$ ile üç aritmetik dizi, farklı ortak farklarla çiziliyor: $d = 1$ (yavaş yukarı kayma), $d = 3$ (daha hızlı tırmanış) ve $d = -2$ (sabit düşüş). Her grafik tam düz bir hattır çünkü aritmetik dizi $n$'nin doğrusal fonksiyonudur — yalnızca eğim değişir.</div>

<div class="calc-graph"><div id="plot-l63-compare-tr-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> aynı ilk terim $a_1 = 5$ ve farklı ortak farklar $d$ ile üç aritmetik dizi. Her hattın eğimi tam olarak $d$'dir. Pozitif $d$ artan, negatif $d$ azalan dizi verir ve $d$'nin büyüklüğü tırmanışın veya düşüşün ne kadar dik olduğunu kontrol eder.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a1=5;var n=[];for(var i=1;i<=10;i++){n.push(i);}
function build(d){var arr=[];for(var i=0;i<10;i++){arr.push(a1+i*d);}return arr;}
var s1={x:n,y:build(1),mode:'lines+markers',line:{color:'#3b82f6',width:2.5},marker:{color:'#3b82f6',size:9},name:'d = 1 (yavaş artış)'};
var s2={x:n,y:build(3),mode:'lines+markers',line:{color:'#60a5fa',width:2.5,dash:'dash'},marker:{color:'#60a5fa',size:9,symbol:'square'},name:'d = 3 (hızlı artış)'};
var s3={x:n,y:build(-2),mode:'lines+markers',line:{color:'#93c5fd',width:2.5,dash:'dot'},marker:{color:'#93c5fd',size:9,symbol:'diamond'},name:'d = -2 (düşüş)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e5e5e5',family:'Geist'},xaxis:{title:'konum n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1,range:[0,11]},yaxis:{title:'a_n (terim değeri)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:60,r:30,b:60,l:60},legend:{orientation:'h',y:1.14,xanchor:'center',x:0.5,bgcolor:'rgba(0,0,0,0)'}};
Plotly.newPlot('plot-l63-compare-tr-extra',[s1,s2,s3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Grafiği okumak.</strong> $d = 1$ için dizi $5, 6, 7, 8, \\ldots$ — adım başına bir birimlik nazik tırmanış. $d = 3$ için $5, 8, 11, 14, \\ldots$ — üç kat daha dik. $d = -2$ için $5, 3, 1, -1, -3, \\ldots$ — konum $n = 4$'te negatif bölgeye kayıyor. $d$'nin işaretine ve büyüklüğüne bağlı olarak aynı başlangıç noktası her yere götürebilir.</p>

<h2 class="lesson-title">11. Formül Referans Tablosu</h2>

<div class="calc-highlight"><strong>İhtiyacın olan tüm formüller tek bir yerde.</strong> Alıştırma problemlerini çözerken bu tabloyu bir kopya kağıdı gibi kullan. Her satır miktarı, kapalı form formülü ve sayıları yerleştirebileceğin çözümlü bir örneği gösterir.</div>

<div style="overflow-x:auto;margin:1.5rem 0">
<table style="width:100%;border-collapse:collapse;background:rgba(20,20,20,0.6);border-radius:8px;overflow:hidden;font-size:0.92rem">
<thead>
<tr style="background:rgba(59,130,246,0.18);color:#3b82f6">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:2px solid #3b82f6">Miktar</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:2px solid #3b82f6">Formül</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:2px solid #3b82f6">Örnek</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
<td style="padding:0.7rem 0.9rem;color:#e5e5e5"><strong>Genel terim $a_n$</strong></td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.92)">$a_n = a_1 + (n - 1) \\, d$</td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.82)">$a_1 = 3$, $d = 4$, $n = 20$: $\\;a_{20} = 3 + 19 \\cdot 4 = 79$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02)">
<td style="padding:0.7rem 0.9rem;color:#e5e5e5"><strong>Toplam $S_n$ ($a_n$ biliniyor)</strong></td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.92)">$S_n = \\dfrac{n(a_1 + a_n)}{2}$</td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.82)">$a_1 = 1$, $a_{100} = 100$: $\\;S_{100} = \\dfrac{100 \\cdot 101}{2} = 5050$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
<td style="padding:0.7rem 0.9rem;color:#e5e5e5"><strong>Toplam $S_n$ ($d$ biliniyor)</strong></td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.92)">$S_n = \\dfrac{n[2 a_1 + (n-1) d]}{2}$</td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.82)">$a_1 = 2$, $d = 3$, $n = 20$: $\\;S_{20} = \\dfrac{20 \\cdot 61}{2} = 610$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02)">
<td style="padding:0.7rem 0.9rem;color:#e5e5e5"><strong>Ortak fark $d$</strong></td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.92)">$d = \\dfrac{a_q - a_p}{q - p}$</td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.82)">$a_4 = 17$, $a_{10} = 41$: $\\;d = \\dfrac{41 - 17}{10 - 4} = 4$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
<td style="padding:0.7rem 0.9rem;color:#e5e5e5"><strong>Orta terim</strong></td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.92)">$a_n = \\dfrac{a_{n-1} + a_{n+1}}{2}$</td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.82)">$a_{n-1} = 14$, $a_{n+1} = 26$: $\\;a_n = \\dfrac{14 + 26}{2} = 20$</td>
</tr>
<tr style="background:rgba(255,255,255,0.02)">
<td style="padding:0.7rem 0.9rem;color:#e5e5e5"><strong>$a, b$ aritmetik ortalaması</strong></td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.92)">$\\text{AO}(a, b) = \\dfrac{a + b}{2}$</td>
<td style="padding:0.7rem 0.9rem;color:rgba(235,230,220,0.82)">$4$ ile $20$ arasında: $\\;\\text{AO} = \\dfrac{4 + 20}{2} = 12$</td>
</tr>
</tbody>
</table>
</div>

<div class="l-note"><strong>Tabloyu nasıl kullanırım.</strong> Sorunun hangi miktarı sorduğunu belirle, o satırı bul, formülü oku ve bildiğin değerleri yerleştir. Çoğu sınav sorusu doğrudan tek bir satırla eşleşir — zorluk genellikle sözel problemi doğru $a_1$ ve $d$'ye çevirmektir.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Aritmetik dizi sabit ortak fark $d$'ye sahiptir; tüm dizi $a_1$ ve $d$ ile belirlenir</li>
<li>Genel terim (açık): $a_n = a_1 + (n - 1) d$; bu $n$'nin bir doğrusal fonksiyonudur</li>
<li>Özyinelemeli: $a_{n+1} = a_n + d$ ve $a_1$ verilmiş</li>
<li>Toplam formülü: $S_n = \\dfrac{n(a_1 + a_n)}{2} = \\dfrac{n[2 a_1 + (n - 1) d]}{2}$ — Gauss'un eşleme hilesi</li>
<li>Açılmış $S_n$ $n$'nin bir kuadratiğidir: $S_n = \\dfrac{d}{2} n^2 + \\left(a_1 - \\dfrac{d}{2}\\right) n$</li>
<li>Orta terim özelliği: her iç terim için $a_n = \\dfrac{a_{n-1} + a_{n+1}}{2}$</li>
<li>İki terimden ortak farkı bulmak için $d = \\dfrac{a_q - a_p}{q - p}$ kullan</li>
<li>Dikkat: $(n-1)d$'de birim kayması, $a_n$ ile $S_n$ karıştırma, azalan dizilerde $d$'nin işareti</li>
</ul>
</div>`
};
