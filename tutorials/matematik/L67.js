window.LISE_MAT_L67 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A sequence is a list of numbers written in a definite order.</strong> Up to now you have studied functions whose input could be any real number — a continuous spectrum of values. A sequence narrows this down: the input is a positive whole number $n = 1, 2, 3, 4, \\dots$ and the output is some real number $a_n$. Sequences are how we encode growth, repayments, recursive procedures, decimal expansions, and — most importantly for the rest of mathematics — the very idea of "what happens in the long run."</p>

<p class="l-text">In this lesson we ask the central question about sequences: as $n$ grows without bound, where do the terms $a_n$ go? Sometimes they settle on a single number (we call that number the <em>limit</em>). Sometimes they grow forever. Sometimes they oscillate and never settle. Three small properties — being <em>monotonic</em>, being <em>bounded</em>, and having a <em>limit</em> — turn out to be tightly connected, and understanding them is the foundation for series, calculus and every modern numerical method.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a sequence as a function from the natural numbers $\\mathbb{N}$ to the real numbers $\\mathbb{R}$, and read sequence notation fluently</li>
<li>State the meaning of $\\lim_{n \\to \\infty} a_n = L$ both intuitively and using the &epsilon; (tolerance) picture</li>
<li>Compute limits of rational sequences by dividing numerator and denominator by the highest power of $n$</li>
<li>Decide whether a sequence is monotonic (increasing or decreasing), strictly or weakly</li>
<li>Decide whether a sequence is bounded above, bounded below, or bounded</li>
<li>Apply the <em>Monotone Convergence Theorem</em>: monotonic plus bounded implies convergent</li>
<li>Identify divergent sequences and the typical reasons divergence occurs</li>
</ul>
</div>

<h2 class="lesson-title">1. Sequences: Functions on the Natural Numbers</h2>

<div class="calc-highlight"><strong>A sequence is just a function with a restricted input.</strong> Instead of accepting any real number, the function only accepts a positive integer. We write $a_n$ instead of $a(n)$, but the idea is exactly the same: feed in a counting number, get out a real value.</div>

<p class="l-text">Formally, a sequence is a function</p>

<div class="calc-formula"><div class="formula-label">SEQUENCE — DEFINITION</div><div class="formula-main">$$a: \\mathbb{N} \\to \\mathbb{R}, \\qquad n \\mapsto a_n$$</div><div class="formula-sub">We list the outputs in order: $a_1, a_2, a_3, a_4, \\dots$ The subscript $n$ tells us which term we are looking at. The whole infinite list is the sequence, often written $(a_n)$ or $\\{a_n\\}$.</div></div>

<p class="l-text">There are three common ways to describe a sequence:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">By a formula in n</div><div class="card-body">A direct rule, e.g. $a_n = \\dfrac{1}{n}$ gives $1, \\tfrac{1}{2}, \\tfrac{1}{3}, \\tfrac{1}{4}, \\dots$ — plug in $n$ to get $a_n$ immediately.</div></div>
<div class="calc-card"><div class="card-title">By listing</div><div class="card-body">Just write the first few terms and trust the reader to see the pattern, e.g. $2, 4, 6, 8, \\dots$ for the even numbers. Risky — patterns can be ambiguous.</div></div>
<div class="calc-card"><div class="card-title">By recursion</div><div class="card-body">Give the first term (or first few terms) and a rule that tells you how to get the next term from the previous one, e.g. $a_1 = 1$, $a_{n+1} = a_n + 2$ gives the odd numbers.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Write out the first five terms of the sequence defined by $a_n = \\dfrac{n}{n+1}$.<br><br>$a_1 = \\dfrac{1}{2} = 0.5$<br>$a_2 = \\dfrac{2}{3} \\approx 0.667$<br>$a_3 = \\dfrac{3}{4} = 0.75$<br>$a_4 = \\dfrac{4}{5} = 0.8$<br>$a_5 = \\dfrac{5}{6} \\approx 0.833$<br><br>The terms are slowly creeping upward, getting closer and closer to $1$ but never reaching it. We will make this precise in the next section.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Is a sequence the same thing as a set? (No: a set has no order, $\\{1, 2, 3\\} = \\{3, 1, 2\\}$. A sequence has order: $1, 2, 3$ is different from $3, 1, 2$.) Can two terms be equal? (Yes: the sequence $1, 1, 1, \\dots$ is constant, every term equals the previous.)</div></div>

<h2 class="lesson-title">2. The Limit of a Sequence</h2>

<div class="calc-highlight"><strong>The central question:</strong> as $n$ marches off to infinity, do the terms $a_n$ settle down to a single number? If yes, that number is the <em>limit</em> of the sequence. If no, the sequence is divergent.</div>

<div class="calc-formula"><div class="formula-label">LIMIT OF A SEQUENCE</div><div class="formula-main">$$\\lim_{n \\to \\infty} a_n \\;=\\; L$$</div><div class="formula-sub">Read aloud: "the limit, as $n$ tends to infinity, of $a_n$, equals $L$." It means: by going far enough out in the sequence, we can make $a_n$ as close to $L$ as we please, and stay close.</div></div>

<p class="l-text"><strong>The intuitive picture.</strong> Plot the terms $(n, a_n)$ as dots in the plane. A sequence has limit $L$ if, eventually, every dot is squeezed inside a horizontal band of height $\\pm \\varepsilon$ around $y = L$, no matter how thin we make that band. The band can shrink to any tolerance you like; only finitely many dots may sit outside.</p>

<div class="calc-formula"><div class="formula-label">EPSILON DEFINITION (FORMAL)</div><div class="formula-main">$$\\lim_{n \\to \\infty} a_n = L \\;\\iff\\; \\forall \\varepsilon > 0, \\; \\exists N \\in \\mathbb{N} \\text{ such that } |a_n - L| < \\varepsilon \\text{ for all } n \\geq N$$</div><div class="formula-sub">Translation: pick any tolerance $\\varepsilon$ — however small. There is a starting index $N$ from which point onwards, every single term sits within $\\varepsilon$ of $L$. The smaller you pick $\\varepsilon$, the larger $N$ has to be — but it always exists.</div></div>

<p class="l-text">A sequence with a limit is called <strong>convergent</strong>. A sequence with no limit is called <strong>divergent</strong>. The two flagship examples to keep in your head:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a_n = \\dfrac{1}{n}$</div><div class="card-body">Terms: $1, \\tfrac{1}{2}, \\tfrac{1}{3}, \\tfrac{1}{4}, \\dots$ Converges to $0$. As $n$ grows, $\\tfrac{1}{n}$ shrinks toward zero — and for any $\\varepsilon$, choose $N > 1/\\varepsilon$ and every later term is within $\\varepsilon$ of $0$.</div></div>
<div class="calc-card"><div class="card-title">$a_n = (-1)^n$</div><div class="card-body">Terms: $-1, 1, -1, 1, \\dots$ Diverges. The terms never settle anywhere; they keep flipping between $-1$ and $+1$. No limit exists.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">A FUNDAMENTAL LIMIT TO MEMORISE</div><div class="formula-main">$$\\lim_{n \\to \\infty} \\frac{1}{n} \\;=\\; 0 \\qquad\\qquad \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n \\;=\\; e \\approx 2.71828$$</div><div class="formula-sub">The first is the prototype of "shrinking to zero." The second is where the number $e$ enters the world. You will use both constantly.</div></div>

<h2 class="lesson-title">3. Computing Limits of Rational Sequences</h2>

<div class="calc-highlight"><strong>The most useful technique:</strong> when $a_n$ is a ratio of polynomials in $n$, divide every term in numerator and denominator by the highest power of $n$ that appears. Then send $n \\to \\infty$. Every $1/n$, $1/n^2$, $\\dots$ vanishes, leaving the leading coefficients face to face.</div>

<p class="l-text">The recipe in three lines:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1</div><div class="card-body">Identify the highest power of $n$ in the entire fraction. Call it $n^k$.</div></div>
<div class="calc-card"><div class="card-title">Step 2</div><div class="card-body">Divide every term, both numerator and denominator, by $n^k$. The fraction does not change value.</div></div>
<div class="calc-card"><div class="card-title">Step 3</div><div class="card-body">Let $n \\to \\infty$. Each term of the form $\\dfrac{\\text{constant}}{n^j}$ with $j > 0$ goes to $0$. Read off what is left.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body"><strong>Compute</strong> $\\displaystyle\\lim_{n \\to \\infty} \\frac{n}{n+1}$.<br><br>Highest power of $n$ is $n^1$. Divide top and bottom by $n$:<br>$$\\frac{n}{n+1} \\;=\\; \\frac{n/n}{(n+1)/n} \\;=\\; \\frac{1}{1 + \\tfrac{1}{n}}.$$<br>As $n \\to \\infty$, $\\tfrac{1}{n} \\to 0$, so the denominator $\\to 1$. Therefore the whole fraction $\\to \\mathbf{1}$.<br><br>Numerical check: $a_{100} = \\tfrac{100}{101} \\approx 0.9901$, $a_{1000} \\approx 0.9990$. Confirmed.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body"><strong>Compute</strong> $\\displaystyle\\lim_{n \\to \\infty} \\frac{n^2 + 1}{2n^2 - 3}$.<br><br>Highest power is $n^2$. Divide top and bottom by $n^2$:<br>$$\\frac{n^2 + 1}{2n^2 - 3} \\;=\\; \\frac{1 + \\tfrac{1}{n^2}}{2 - \\tfrac{3}{n^2}}.$$<br>As $n \\to \\infty$, the two small terms vanish, leaving $\\dfrac{1 + 0}{2 - 0} = \\mathbf{\\dfrac{1}{2}}$.<br><br>Numerical check: $a_{100} = \\tfrac{10001}{19997} \\approx 0.50013$. Confirmed.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body"><strong>Compute</strong> $\\displaystyle\\lim_{n \\to \\infty} \\frac{3n + 5}{n^2 + 2}$.<br><br>Highest power is $n^2$. Divide:<br>$$\\frac{3n + 5}{n^2 + 2} \\;=\\; \\frac{\\tfrac{3}{n} + \\tfrac{5}{n^2}}{1 + \\tfrac{2}{n^2}}.$$<br>The numerator $\\to 0 + 0 = 0$, the denominator $\\to 1$. Limit $= \\mathbf{0}$.<br><br>Whenever the bottom polynomial has higher degree than the top, the sequence shrinks to zero.</div></div>

<div class="l-note"><strong>Quick rule from the worked examples:</strong> for a rational sequence $\\dfrac{P(n)}{Q(n)}$ with $\\deg P = p$ and $\\deg Q = q$, the limit is:<br>&bull; $0$ if $p < q$ &nbsp;|&nbsp; &bull; the ratio of leading coefficients if $p = q$ &nbsp;|&nbsp; &bull; $\\pm\\infty$ (divergent) if $p > q$.</div>

<div class="calc-graph"><div id="plot-l67-converge-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the sequence $a_n = n/(n+1)$ plotted as dots for $n = 1, 2, \\dots, 50$. The dashed horizontal line is $y = 1$, the limit. The dots creep upward and squeeze into any horizontal band around $y = 1$, no matter how thin.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xN=[],yN=[];for(var n=1;n<=50;n++){xN.push(n);yN.push(n/(n+1));}
var pts={x:xN,y:yN,mode:'markers',name:'a_n = n/(n+1)',marker:{color:'#3b82f6',size:8}};
var asym={x:[0,52],y:[1,1],mode:'lines',name:'limit L = 1',line:{color:'#f59e0b',width:2,dash:'dash'}};
var band1={x:[0,52],y:[1.05,1.05],mode:'lines',name:'L + ε',line:{color:'rgba(245,158,11,0.35)',width:1,dash:'dot'}};
var band2={x:[0,52],y:[0.95,0.95],mode:'lines',name:'L − ε',line:{color:'rgba(245,158,11,0.35)',width:1,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',range:[0,52],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'a_n',range:[0.3,1.15],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l67-converge-en',[pts,asym,band1,band2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Monotonic Sequences</h2>

<div class="calc-highlight"><strong>A sequence is monotonic if it moves in only one direction.</strong> Either every term is at least as large as the previous one (increasing), or every term is at most as large (decreasing). A monotonic sequence has no back-and-forth motion — it climbs or it descends, never both.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">INCREASING</div><div class="compare-item">Strictly: $a_{n+1} > a_n$ for all $n$</div><div class="compare-item">Weakly (non-decreasing): $a_{n+1} \\geq a_n$</div><div class="compare-item">Example: $a_n = n$ gives $1, 2, 3, 4, \\dots$ — strictly increasing</div><div class="compare-item">Example: $a_n = \\dfrac{n}{n+1}$ — strictly increasing</div></div><div class="compare-col"><div class="compare-title">DECREASING</div><div class="compare-item">Strictly: $a_{n+1} < a_n$ for all $n$</div><div class="compare-item">Weakly (non-increasing): $a_{n+1} \\leq a_n$</div><div class="compare-item">Example: $a_n = \\dfrac{1}{n}$ gives $1, \\tfrac{1}{2}, \\tfrac{1}{3}, \\dots$ — strictly decreasing</div><div class="compare-item">Example: $a_n = -n$ — strictly decreasing</div></div></div>

<p class="l-text"><strong>How to test it.</strong> Two reliable methods:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Difference test</div><div class="card-body">Compute $a_{n+1} - a_n$. If this is always positive, the sequence is strictly increasing; always negative, strictly decreasing; always zero, constant.</div></div>
<div class="calc-card"><div class="card-title">Ratio test (positive terms)</div><div class="card-body">If $a_n > 0$ for all $n$, compute $\\dfrac{a_{n+1}}{a_n}$. If this ratio is always $> 1$, strictly increasing; always $< 1$, strictly decreasing.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Show that</strong> $a_n = \\dfrac{n}{n+1}$ <strong>is strictly increasing.</strong><br><br>Compute the difference:<br>$$a_{n+1} - a_n \\;=\\; \\frac{n+1}{n+2} - \\frac{n}{n+1} \\;=\\; \\frac{(n+1)^2 - n(n+2)}{(n+1)(n+2)} \\;=\\; \\frac{n^2 + 2n + 1 - n^2 - 2n}{(n+1)(n+2)} \\;=\\; \\frac{1}{(n+1)(n+2)}.$$<br>This is always positive (denominator is a product of positive integers, numerator is $1$). So $a_{n+1} > a_n$ for every $n$ — strictly increasing. <strong>QED.</strong></div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Is the sequence $1, 1, 2, 2, 3, 3, 4, 4, \\dots$ monotonic? (Yes — non-decreasing, but not strictly increasing because consecutive terms can be equal.) Is $1, 2, 1, 2, 1, 2, \\dots$ monotonic? (No — it goes up, then down, then up. Not monotonic.)</div></div>

<h2 class="lesson-title">5. Bounded Sequences</h2>

<div class="calc-highlight"><strong>A sequence is bounded if it stays within a finite horizontal strip forever.</strong> No term escapes upward beyond a fixed ceiling, and no term escapes downward beyond a fixed floor. Both halves of the rule are needed.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bounded above</div><div class="card-body">There exists a constant $M$ such that $a_n \\leq M$ for every $n$. The number $M$ is called an <em>upper bound</em>.</div></div>
<div class="calc-card"><div class="card-title">Bounded below</div><div class="card-body">There exists a constant $m$ such that $a_n \\geq m$ for every $n$. The number $m$ is called a <em>lower bound</em>.</div></div>
<div class="calc-card"><div class="card-title">Bounded</div><div class="card-body">Bounded above <em>and</em> bounded below. Equivalently, there is some $K > 0$ with $|a_n| \\leq K$ for every $n$.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">EXAMPLES TO INTERNALISE</div><div class="formula-main">$$\\begin{array}{l|l|l} \\text{Sequence} & \\text{Bounded above?} & \\text{Bounded below?} \\\\ \\hline a_n = \\tfrac{1}{n} & \\text{Yes, by }1 & \\text{Yes, by }0 \\\\ a_n = n & \\text{No (grows forever)} & \\text{Yes, by }1 \\\\ a_n = (-1)^n & \\text{Yes, by }1 & \\text{Yes, by }-1 \\\\ a_n = -n & \\text{Yes, by }-1 & \\text{No (drops forever)} \\\\ a_n = \\tfrac{n}{n+1} & \\text{Yes, by }1 & \\text{Yes, by }\\tfrac{1}{2} \\end{array}$$</div><div class="formula-sub">A sequence can be bounded above without converging (look at the alternating one), and convergent sequences are always bounded.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Show that</strong> $a_n = \\dfrac{n}{n+1}$ <strong>is bounded.</strong><br><br>Lower bound: every term is positive (numerator and denominator are both positive integers), and $a_1 = \\tfrac{1}{2}$ is the smallest. So $a_n \\geq \\tfrac{1}{2}$ for all $n \\geq 1$.<br><br>Upper bound: rewrite $a_n = 1 - \\dfrac{1}{n+1}$. Since $\\dfrac{1}{n+1} > 0$, we have $a_n < 1$ for every $n$.<br><br>So $\\tfrac{1}{2} \\leq a_n < 1$ — the sequence is bounded.</div></div>

<h2 class="lesson-title">6. The Monotone Convergence Theorem</h2>

<div class="calc-highlight"><strong>One of the most useful theorems in all of analysis, and yet a sentence long:</strong> a sequence that is monotonic and bounded must converge. You do not even need to compute the limit to know it exists.</div>

<div class="calc-formula"><div class="formula-label">MONOTONE CONVERGENCE THEOREM</div><div class="formula-main">$$\\text{If } (a_n) \\text{ is monotonic and bounded, then } \\lim_{n \\to \\infty} a_n \\text{ exists.}$$</div><div class="formula-sub">More specifically: an increasing bounded sequence converges to its <em>supremum</em> (least upper bound). A decreasing bounded sequence converges to its <em>infimum</em> (greatest lower bound).</div></div>

<p class="l-text"><strong>Intuition (no formal proof).</strong> Picture an increasing sequence sitting under a ceiling — say the ceiling is at height $M$. The terms keep climbing, but they can never break through $M$. They cannot oscillate (monotonic = no back-and-forth). They cannot blow up to infinity (bounded). The only option left is to slow down and accumulate just below some specific height $L \\leq M$. That accumulation height is the limit.</p>

<div class="calc-example"><div class="example-label">APPLICATION</div><div class="example-body">We have already shown that $a_n = \\dfrac{n}{n+1}$ is strictly increasing (section 4) and bounded above by $1$ (section 5). By the Monotone Convergence Theorem, the sequence converges. By direct computation (section 3), the limit is exactly $1$.<br><br>Notice the two-step argument: the theorem first guarantees that <em>some</em> limit exists, then a separate calculation tells us <em>which</em> limit. This split is enormously useful in problems where the formula for $a_n$ is awkward but the monotonic-bounded check is easy.</div></div>

<div class="l-note"><strong>Why the theorem matters:</strong> in many problems (especially recursive ones, section 7) we cannot write $a_n$ as a clean function of $n$. We may still be able to show monotonic and bounded — and then the theorem hands us the existence of a limit for free. Once we know the limit exists, we can solve for it algebraically.</div>

<h2 class="lesson-title">7. Recursive Sequences and Fixed Points</h2>

<div class="calc-highlight"><strong>A recursive (or recurrence) sequence specifies the next term as a function of previous terms.</strong> The classic form is $a_{n+1} = f(a_n)$ with some starting value $a_1$. To find the limit (if one exists), we use a beautiful observation: if $a_n \\to L$, then $a_{n+1} \\to L$ too — and that pins down $L$ as a solution of $L = f(L)$.</div>

<p class="l-text"><strong>The fixed-point trick.</strong> Suppose $a_{n+1} = f(a_n)$ and assume the sequence converges, say $a_n \\to L$. Take the limit of both sides of the recurrence. The left side $\\to L$ (because $(a_{n+1})$ is just $(a_n)$ shifted by one — same limit). The right side $\\to f(L)$ if $f$ is continuous. Therefore:</p>

<div class="calc-formula"><div class="formula-label">FIXED POINT EQUATION</div><div class="formula-main">$$L \\;=\\; f(L)$$</div><div class="formula-sub">Any limit $L$ of a recursive sequence $a_{n+1} = f(a_n)$ must be a <em>fixed point</em> of $f$ — a value the function sends to itself.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Let</strong> $a_1 = 1$ <strong>and</strong> $a_{n+1} = \\sqrt{2 + a_n}$. <strong>Find the limit, assuming it exists.</strong><br><br>If $a_n \\to L$, then by the fixed-point equation $L = \\sqrt{2 + L}$.<br>Square both sides: $L^2 = 2 + L$, hence $L^2 - L - 2 = 0$, hence $(L - 2)(L + 1) = 0$.<br>So $L = 2$ or $L = -1$. Since $a_n > 0$ for every $n$ (the square root is positive), the only viable limit is $L = \\mathbf{2}$.<br><br>Numerical check: $a_1 = 1$, $a_2 = \\sqrt{3} \\approx 1.732$, $a_3 \\approx 1.932$, $a_4 \\approx 1.983$, $a_5 \\approx 1.996$. Quickly converging to $2$. Confirmed.</div></div>

<p class="l-text"><strong>Warning.</strong> The fixed-point equation only gives us the candidate values for $L$ assuming the sequence converges. We still owe a separate argument (often via the Monotone Convergence Theorem) that the sequence actually does converge. Otherwise we may report a "limit" for a sequence that diverges.</p>

<h2 class="lesson-title">8. Famous Worked Examples</h2>

<p class="l-text">Three sequences whose limits should become old friends.</p>

<div class="calc-example"><div class="example-label">EXAMPLE A: $a_n = \\dfrac{n}{n+1}$</div><div class="example-body">Already analysed: strictly increasing, bounded by $\\tfrac{1}{2}$ below and $1$ above, converges to $1$. The graph in section 3 visualises the convergence.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE B: $a_n = \\dfrac{n^2 + 1}{2n^2 - 3}$</div><div class="example-body">Divide numerator and denominator by $n^2$: $a_n = \\dfrac{1 + 1/n^2}{2 - 3/n^2}$. As $n \\to \\infty$ this $\\to \\dfrac{1}{2}$.<br><br>Numerical check: $a_5 = \\tfrac{26}{47} \\approx 0.553$, $a_{10} = \\tfrac{101}{197} \\approx 0.513$, $a_{100} \\approx 0.50013$. Confirmed: limit is $\\tfrac{1}{2}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE C: Fibonacci ratios</div><div class="example-body">The Fibonacci numbers satisfy $F_1 = F_2 = 1$ and $F_{n+1} = F_n + F_{n-1}$. Let $r_n = \\dfrac{F_{n+1}}{F_n}$ be the ratio of consecutive Fibonacci numbers.<br><br>First values: $r_1 = 1, r_2 = 2, r_3 = 1.5, r_4 \\approx 1.667, r_5 = 1.6, r_6 = 1.625, r_7 \\approx 1.615, r_8 \\approx 1.619, \\dots$<br><br>Notice the ratios bounce up and down but with shrinking amplitude — they are converging. The limit is the famous <em>golden ratio</em>:<br>$$L = \\frac{1 + \\sqrt{5}}{2} \\approx 1.61803398\\dots = \\varphi.$$<br><br>To see why: divide $F_{n+1} = F_n + F_{n-1}$ by $F_n$ to get $r_n = 1 + \\dfrac{1}{r_{n-1}}$. Fixed-point equation $L = 1 + \\tfrac{1}{L}$ gives $L^2 - L - 1 = 0$, whose positive root is $\\varphi$.</div></div>

<div class="calc-graph"><div id="plot-l67-fibonacci-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the Fibonacci ratios $r_n = F_{n+1}/F_n$ for $n = 1$ to $20$. The ratios oscillate above and below the golden ratio $\\varphi \\approx 1.618$ (dashed line), with the oscillation amplitude rapidly decaying. By $n = 12$ the ratio matches $\\varphi$ to four decimal places.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var F=[1,1];for(var i=2;i<=22;i++)F.push(F[i-1]+F[i-2]);
var xR=[],yR=[];for(var n=1;n<=20;n++){xR.push(n);yR.push(F[n]/F[n-1]);}
var pts={x:xR,y:yR,mode:'lines+markers',name:'r_n = F_{n+1}/F_n',line:{color:'#3b82f6',width:2},marker:{color:'#3b82f6',size:8}};
var phi=(1+Math.sqrt(5))/2;
var asym={x:[0,21],y:[phi,phi],mode:'lines',name:'φ ≈ 1.618',line:{color:'#f59e0b',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',range:[0,21],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:2},yaxis:{title:'r_n',range:[0.9,2.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l67-fibonacci-en',[pts,asym],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Divergent Sequences</h2>

<div class="calc-highlight"><strong>A sequence that fails to have a limit is called <em>divergent</em>.</strong> There are two common ways for this to happen: the terms <em>blow up</em> to $\\pm\\infty$, or the terms <em>oscillate</em> and never settle.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Divergence to infinity</div><div class="card-body">$a_n = n$ grows past every fixed bound. We write $\\lim_{n \\to \\infty} n = +\\infty$, but this is shorthand — strictly speaking, no real-number limit exists.</div></div>
<div class="calc-card"><div class="card-title">Oscillating divergence</div><div class="card-body">$a_n = (-1)^n$ flips between $-1$ and $+1$. The terms stay bounded but never settle on one value, so no limit exists.</div></div>
<div class="calc-card"><div class="card-title">Wild oscillation</div><div class="card-body">$a_n = (-1)^n \\cdot n$ gives $-1, 2, -3, 4, -5, \\dots$ The signs alternate and the magnitudes grow. Neither well-behaved nor convergent.</div></div>
</div>

<div class="calc-graph"><div id="plot-l67-oscillate-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the alternating sequence $a_n = (-1)^n$ for $n = 1, 2, \\dots, 20$. The dots strictly alternate between $-1$ and $+1$. No single horizontal band of small height contains all the late terms — so the sequence has no limit. It is a textbook divergent (oscillating) example.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xO=[],yO=[];for(var n=1;n<=20;n++){xO.push(n);yO.push(Math.pow(-1,n));}
var pts={x:xO,y:yO,mode:'markers',name:'a_n = (−1)^n',marker:{color:'#3b82f6',size:9}};
var hi={x:[0,21],y:[1,1],mode:'lines',name:'upper visit y=1',line:{color:'rgba(245,158,11,0.6)',width:1.5,dash:'dot'}};
var lo={x:[0,21],y:[-1,-1],mode:'lines',name:'lower visit y=−1',line:{color:'rgba(239,68,68,0.6)',width:1.5,dash:'dot'}};
var zero={x:[0,21],y:[0,0],mode:'lines',name:'no settling height',line:{color:'rgba(255,255,255,0.25)',width:1}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',range:[0,21],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:2},yaxis:{title:'a_n',range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:0.5},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l67-oscillate-en',[pts,hi,lo,zero],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Common Errors</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">"Every monotonic sequence converges."</div><div class="card-body"><strong>False.</strong> Counter-example: $a_n = n$ is strictly increasing but diverges to infinity. Monotonic <em>and bounded</em> is the correct condition.</div></div>
<div class="calc-card"><div class="card-title">"Every bounded sequence converges."</div><div class="card-body"><strong>False.</strong> Counter-example: $a_n = (-1)^n$ is bounded between $-1$ and $1$ but never settles. Bounded <em>and monotonic</em> is the correct combination.</div></div>
<div class="calc-card"><div class="card-title">Solving fixed-point equation without checking convergence</div><div class="card-body">$L = f(L)$ only tells us what the limit <em>would be</em> if one existed. Always verify the sequence actually converges, e.g. via monotonic + bounded.</div></div>
<div class="calc-card"><div class="card-title">Forgetting sign in alternating sequences</div><div class="card-body">If $a_n = (-1)^n \\cdot \\tfrac{1}{n}$, the terms shrink but alternate. The limit is still $0$ — the magnitude controls it. Compute carefully.</div></div>
</div>

<h2 class="lesson-title">11. Practice Exercises</h2>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body"><strong>Compute</strong> $\\displaystyle\\lim_{n \\to \\infty} \\frac{2n + 1}{3n - 4}$.<br><br>Highest power $n^1$. Divide top and bottom by $n$: $\\dfrac{2 + 1/n}{3 - 4/n} \\to \\dfrac{2}{3}$. Limit $= \\mathbf{\\tfrac{2}{3}}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body"><strong>Compute</strong> $\\displaystyle\\lim_{n \\to \\infty} \\frac{5n^2 - 2n}{3n^3 + 7}$.<br><br>Bottom degree ($3$) exceeds top degree ($2$). By the quick rule, limit $= \\mathbf{0}$. Verify by dividing top and bottom by $n^3$: numerator $\\to 0$, denominator $\\to 3$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body"><strong>Is</strong> $a_n = \\dfrac{2n+3}{n+1}$ <strong>monotonic? Bounded? Find its limit.</strong><br><br>Difference: $a_{n+1} - a_n = \\dfrac{2(n+1)+3}{n+2} - \\dfrac{2n+3}{n+1} = \\dfrac{(2n+5)(n+1) - (2n+3)(n+2)}{(n+1)(n+2)} = \\dfrac{-1}{(n+1)(n+2)} < 0$. <strong>Strictly decreasing.</strong><br>Rewrite: $a_n = 2 + \\dfrac{1}{n+1}$. Since $\\tfrac{1}{n+1} > 0$, $a_n > 2$ — <strong>lower bound $2$</strong>. And $a_1 = 2.5$ is the max — <strong>upper bound $2.5$</strong>.<br>Monotonic + bounded $\\Rightarrow$ convergent. Limit by direct computation $= \\mathbf{2}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body"><strong>Recursive sequence:</strong> $a_1 = 2$, $a_{n+1} = \\dfrac{a_n + 6}{2}$. <strong>Find its limit (assuming it exists).</strong><br><br>Fixed-point equation: $L = \\dfrac{L+6}{2} \\Rightarrow 2L = L + 6 \\Rightarrow L = \\mathbf{6}$.<br>Numerical check: $a_1 = 2, a_2 = 4, a_3 = 5, a_4 = 5.5, a_5 = 5.75, a_6 = 5.875, \\dots$ Converging toward $6$. Confirmed.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body"><strong>Decide if</strong> $a_n = \\dfrac{\\cos n}{n}$ <strong>converges and find the limit.</strong><br><br>The cosine oscillates between $-1$ and $1$, so $-\\dfrac{1}{n} \\leq a_n \\leq \\dfrac{1}{n}$. Both bounds $\\to 0$ as $n \\to \\infty$. By the squeeze argument (informal: trapped between two sequences that go to zero), $a_n \\to \\mathbf{0}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6</div><div class="example-body"><strong>Does</strong> $a_n = (-1)^n + \\dfrac{1}{n}$ <strong>converge?</strong><br><br>The $1/n$ part tends to $0$. The $(-1)^n$ part flips between $-1$ and $+1$ forever. So $a_n$ alternates near $-1$ and $+1$ — never settling. <strong>Divergent.</strong> No limit.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7</div><div class="example-body"><strong>Compute</strong> $\\displaystyle\\lim_{n \\to \\infty} \\left(1 + \\dfrac{1}{n}\\right)^n$ <strong>and verify numerically for $n = 100$.</strong><br><br>This is the famous limit defining the number $e \\approx 2.71828$.<br>$n = 1$: $2^1 = 2$. $n = 10$: $(1.1)^{10} \\approx 2.594$. $n = 100$: $(1.01)^{100} \\approx 2.7048$. $n = 1000$: $\\approx 2.7169$. Slowly creeping toward $e$. Confirmed.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8</div><div class="example-body"><strong>Show that</strong> $a_n = \\sqrt{2 + \\sqrt{2 + \\sqrt{2 + \\cdots}}}$ <strong>(n nested square roots) converges, and find its limit.</strong><br><br>Defined recursively: $a_1 = \\sqrt{2}$, $a_{n+1} = \\sqrt{2 + a_n}$.<br>Fixed-point equation: $L = \\sqrt{2 + L} \\Rightarrow L^2 = 2 + L \\Rightarrow L^2 - L - 2 = 0 \\Rightarrow (L-2)(L+1) = 0$.<br>Positive root: $L = \\mathbf{2}$.<br>Numerical: $\\sqrt{2} \\approx 1.414$, $\\sqrt{2 + 1.414} \\approx 1.848$, $\\sqrt{2 + 1.848} \\approx 1.962$, $\\sqrt{2 + 1.962} \\approx 1.990$. Rapidly approaching $2$.</div></div>

<h2 class="lesson-title">12. Summary</h2>

<div class="calc-formula"><div class="formula-label">KEY IDEAS — ONE LINE EACH</div><div class="formula-main">$$\\begin{array}{l} \\bullet \\;\\; \\text{A sequence is a function } a: \\mathbb{N} \\to \\mathbb{R}. \\\\ \\bullet \\;\\; \\text{Limit } L: \\text{ terms get arbitrarily close to } L \\text{ for large } n. \\\\ \\bullet \\;\\; \\text{Rational sequences: divide by highest power of } n. \\\\ \\bullet \\;\\; \\text{Monotonic + bounded } \\Rightarrow \\text{ convergent (MCT)}. \\\\ \\bullet \\;\\; \\text{Recursive } a_{n+1} = f(a_n): \\text{ limit solves } L = f(L). \\\\ \\bullet \\;\\; \\text{Bounded alone is not enough; monotonic alone is not enough.} \\end{array}$$</div></div>

<div class="l-note"><strong>What comes next:</strong> with sequences in hand we can study <em>series</em> (infinite sums), the formal $\\varepsilon$-$\\delta$ definition of limits at finite points, and ultimately the derivative — defined as the limit of a sequence of difference quotients. Sequences are the gateway.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Dizi, belirli bir sırada yazılmış sayı listesidir.</strong> Şimdiye kadar girdisi herhangi bir reel sayı olabilen fonksiyonları gördün — sürekli bir değerler tayfı. Dizi bunu daraltır: girdi pozitif tam sayıdır $n = 1, 2, 3, 4, \\dots$, çıktı ise bir reel sayı $a_n$. Diziler; büyümeyi, geri ödemeleri, özyinelemeli prosedürleri, ondalık açılımları ve — matematiğin geri kalanı için en önemlisi — "uzun vadede ne oluyor" fikrini kodlama yoludur.</p>

<p class="l-text">Bu derste dizilerle ilgili merkezi soruyu soruyoruz: $n$ sınırsızca büyüdüğünde $a_n$ terimleri nereye gider? Bazen tek bir sayıya yerleşir (buna <em>limit</em> deriz). Bazen sonsuza kaçar. Bazen salınır ve hiç yerleşmez. Üç küçük özellik — <em>monoton</em> olmak, <em>sınırlı</em> olmak ve bir <em>limite</em> sahip olmak — birbirine sıkıca bağlıdır ve bunları anlamak; seriler, analiz ve modern tüm sayısal yöntemler için temeldir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Diziyi doğal sayılar $\\mathbb{N}$'den reel sayılar $\\mathbb{R}$'ye giden bir fonksiyon olarak tanımlamayı ve dizi gösterimini rahatça okumayı</li>
<li>$\\lim_{n \\to \\infty} a_n = L$ ifadesinin hem sezgisel hem de &epsilon; (tolerans) tablosundaki anlamını söylemeyi</li>
<li>Pay ve paydayı $n$'in en yüksek kuvvetine bölerek rasyonel dizilerin limitini hesaplamayı</li>
<li>Bir dizinin monoton (artan veya azalan) olup olmadığına — kesin veya zayıf — karar vermeyi</li>
<li>Bir dizinin üstten sınırlı, alttan sınırlı veya sınırlı olup olmadığına karar vermeyi</li>
<li><em>Monoton Yakınsaklık Teoremi</em>'ni uygulamayı: monoton ve sınırlı dizi yakınsar</li>
<li>Iraksak dizileri ve ıraksamanın tipik nedenlerini tanımlamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Diziler: Doğal Sayılar Üzerinde Fonksiyonlar</h2>

<div class="calc-highlight"><strong>Dizi, girdisi kısıtlanmış bir fonksiyondur.</strong> Herhangi bir reel sayı kabul etmek yerine, fonksiyon yalnızca pozitif tam sayıları kabul eder. $a(n)$ yerine $a_n$ yazarız, fakat fikir tamamen aynıdır: bir sayma sayısı ver, bir reel değer al.</div>

<p class="l-text">Biçimsel olarak bir dizi, aşağıdaki fonksiyondur:</p>

<div class="calc-formula"><div class="formula-label">DİZİ — TANIM</div><div class="formula-main">$$a: \\mathbb{N} \\to \\mathbb{R}, \\qquad n \\mapsto a_n$$</div><div class="formula-sub">Çıktıları sırayla listeleriz: $a_1, a_2, a_3, a_4, \\dots$ Alt indis $n$, hangi terime baktığımızı söyler. Sonsuz listenin tamamı dizidir; çoğu zaman $(a_n)$ veya $\\{a_n\\}$ yazılır.</div></div>

<p class="l-text">Bir diziyi tanımlamanın üç yaygın yolu vardır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">n'ye bağlı formülle</div><div class="card-body">Doğrudan kural, örn. $a_n = \\dfrac{1}{n}$ → $1, \\tfrac{1}{2}, \\tfrac{1}{3}, \\tfrac{1}{4}, \\dots$ — $n$'yi yerine koy, $a_n$'yi anında al.</div></div>
<div class="calc-card"><div class="card-title">Liste vererek</div><div class="card-body">İlk birkaç terimi yaz ve okuyucunun deseni görmesine güven, örn. çift sayılar için $2, 4, 6, 8, \\dots$. Riskli — desenler belirsiz olabilir.</div></div>
<div class="calc-card"><div class="card-title">Özyinelemeyle</div><div class="card-body">İlk terimi (veya ilk birkaç terimi) ver, ardından sonraki terimi öncekinden üreten kuralı ver, örn. $a_1 = 1$, $a_{n+1} = a_n + 2$ → tek sayılar.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$a_n = \\dfrac{n}{n+1}$ ile tanımlı dizinin ilk beş terimini yaz.<br><br>$a_1 = \\dfrac{1}{2} = 0.5$<br>$a_2 = \\dfrac{2}{3} \\approx 0.667$<br>$a_3 = \\dfrac{3}{4} = 0.75$<br>$a_4 = \\dfrac{4}{5} = 0.8$<br>$a_5 = \\dfrac{5}{6} \\approx 0.833$<br><br>Terimler yavaşça yükseliyor, $1$'e gittikçe yaklaşıyor ama asla ulaşmıyor. Bunu bir sonraki bölümde kesinleştireceğiz.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Dizi ile küme aynı şey midir? (Hayır: kümede sıra yoktur, $\\{1, 2, 3\\} = \\{3, 1, 2\\}$. Dizide sıra vardır: $1, 2, 3$ ile $3, 1, 2$ farklıdır.) İki terim eşit olabilir mi? (Evet: $1, 1, 1, \\dots$ sabit dizisinde her terim bir öncekiyle aynıdır.)</div></div>

<h2 class="lesson-title">2. Bir Dizinin Limiti</h2>

<div class="calc-highlight"><strong>Merkezi soru:</strong> $n$ sonsuza doğru ilerlerken $a_n$ terimleri tek bir sayıya mı yerleşir? Cevap evetse, o sayı dizinin <em>limitidir</em>. Cevap hayırsa, dizi ıraksaktır.</div>

<div class="calc-formula"><div class="formula-label">BİR DİZİNİN LİMİTİ</div><div class="formula-main">$$\\lim_{n \\to \\infty} a_n \\;=\\; L$$</div><div class="formula-sub">Sesli okuma: "n sonsuza giderken $a_n$'in limiti $L$'dir." Anlamı: dizide yeterince ileri giderek $a_n$'yi $L$'ye istediğimiz kadar yakın tutabiliriz ve öyle kalır.</div></div>

<p class="l-text"><strong>Sezgisel görüntü.</strong> $(n, a_n)$ terimlerini düzlemde noktalar olarak çiz. Bir dizinin limiti $L$ ise, eninde sonunda her nokta $y = L$ etrafında $\\pm \\varepsilon$ yüksekliğinde yatay bir bandın içine sıkışır — bandı ne kadar inceltirsek o kadar. Bandı istediğin toleransa kadar daraltabilirsin; yalnızca sonlu sayıda nokta dışarıda kalabilir.</p>

<div class="calc-formula"><div class="formula-label">EPSİLON TANIMI (BİÇİMSEL)</div><div class="formula-main">$$\\lim_{n \\to \\infty} a_n = L \\;\\iff\\; \\forall \\varepsilon > 0, \\; \\exists N \\in \\mathbb{N} \\text{ s.t. } |a_n - L| < \\varepsilon, \\; \\forall n \\geq N$$</div><div class="formula-sub">Çeviri: ne kadar küçük olursa olsun herhangi bir tolerans $\\varepsilon$ seç. Bir başlangıç indeksi $N$ vardır ki bu noktadan itibaren her terim $L$'ye $\\varepsilon$ kadar yakındır. $\\varepsilon$'yi ne kadar küçük seçersen $N$ o kadar büyük olmalıdır — ama her zaman vardır.</div></div>

<p class="l-text">Limiti olan diziye <strong>yakınsak</strong>, olmayana <strong>ıraksak</strong> denir. Kafanda taşıman gereken iki bayrak örnek:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a_n = \\dfrac{1}{n}$</div><div class="card-body">Terimler: $1, \\tfrac{1}{2}, \\tfrac{1}{3}, \\tfrac{1}{4}, \\dots$ Limit $0$'a yakınsar. $n$ büyüdükçe $\\tfrac{1}{n}$ sıfıra doğru küçülür — herhangi bir $\\varepsilon$ için $N > 1/\\varepsilon$ seç, sonraki her terim $0$'a $\\varepsilon$ kadar yakındır.</div></div>
<div class="calc-card"><div class="card-title">$a_n = (-1)^n$</div><div class="card-body">Terimler: $-1, 1, -1, 1, \\dots$ Iraksaktır. Terimler hiçbir yere yerleşmez; $-1$ ile $+1$ arasında salınır. Limit yoktur.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">EZBERLENMESİ GEREKEN TEMEL LİMİT</div><div class="formula-main">$$\\lim_{n \\to \\infty} \\frac{1}{n} \\;=\\; 0 \\qquad\\qquad \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n \\;=\\; e \\approx 2.71828$$</div><div class="formula-sub">Birincisi "sıfıra büzülmenin" prototipidir. İkincisi ise $e$ sayısının doğduğu yerdir. İkisini de sürekli kullanacaksın.</div></div>

<h2 class="lesson-title">3. Rasyonel Dizilerin Limitleri</h2>

<div class="calc-highlight"><strong>En kullanışlı teknik:</strong> $a_n$, $n$'nin polinomlarının oranıysa, pay ve paydadaki her terimi $n$'nin en yüksek kuvvetine böl. Sonra $n \\to \\infty$ al. Her $1/n$, $1/n^2$, $\\dots$ yok olur ve baş katsayılar yüz yüze kalır.</div>

<p class="l-text">Üç satırda yöntem:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1</div><div class="card-body">Kesirin tamamındaki en yüksek $n$ kuvvetini belirle. Buna $n^k$ de.</div></div>
<div class="calc-card"><div class="card-title">Adım 2</div><div class="card-body">Pay ve paydadaki her terimi $n^k$'ye böl. Kesirin değeri değişmez.</div></div>
<div class="calc-card"><div class="card-title">Adım 3</div><div class="card-body">$n \\to \\infty$ al. $\\dfrac{\\text{sabit}}{n^j}$ biçimindeki her terim ($j > 0$) sıfıra gider. Kalanı oku.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle\\lim_{n \\to \\infty} \\frac{n}{n+1}$.<br><br>En yüksek kuvvet $n^1$. Pay ve paydayı $n$'ye böl:<br>$$\\frac{n}{n+1} \\;=\\; \\frac{n/n}{(n+1)/n} \\;=\\; \\frac{1}{1 + \\tfrac{1}{n}}.$$<br>$n \\to \\infty$ iken $\\tfrac{1}{n} \\to 0$, yani payda $\\to 1$. Tüm kesir $\\to \\mathbf{1}$.<br><br>Sayısal kontrol: $a_{100} = \\tfrac{100}{101} \\approx 0.9901$, $a_{1000} \\approx 0.9990$. Onaylandı.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle\\lim_{n \\to \\infty} \\frac{n^2 + 1}{2n^2 - 3}$.<br><br>En yüksek kuvvet $n^2$. Böl:<br>$$\\frac{n^2 + 1}{2n^2 - 3} \\;=\\; \\frac{1 + \\tfrac{1}{n^2}}{2 - \\tfrac{3}{n^2}}.$$<br>$n \\to \\infty$ iken iki küçük terim yok olur, $\\dfrac{1 + 0}{2 - 0} = \\mathbf{\\dfrac{1}{2}}$ kalır.<br><br>Sayısal kontrol: $a_{100} = \\tfrac{10001}{19997} \\approx 0.50013$. Onaylandı.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle\\lim_{n \\to \\infty} \\frac{3n + 5}{n^2 + 2}$.<br><br>En yüksek kuvvet $n^2$. Böl:<br>$$\\frac{3n + 5}{n^2 + 2} \\;=\\; \\frac{\\tfrac{3}{n} + \\tfrac{5}{n^2}}{1 + \\tfrac{2}{n^2}}.$$<br>Pay $\\to 0 + 0 = 0$, payda $\\to 1$. Limit $= \\mathbf{0}$.<br><br>Alt polinomun derecesi üsttekinden büyük olduğunda dizi sıfıra büzülür.</div></div>

<div class="l-note"><strong>Çözümlü örneklerden hızlı kural:</strong> $\\dfrac{P(n)}{Q(n)}$ rasyonel dizisi için $\\deg P = p$, $\\deg Q = q$ olsun:<br>&bull; $p < q$ ise limit $0$ &nbsp;|&nbsp; &bull; $p = q$ ise baş katsayıların oranı &nbsp;|&nbsp; &bull; $p > q$ ise $\\pm\\infty$ (ıraksak).</div>

<div class="calc-graph"><div id="plot-l67-converge-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $a_n = n/(n+1)$ dizisi $n = 1, 2, \\dots, 50$ için noktalar halinde. Kesik çizgili yatay doğru $y = 1$, yani limit. Noktalar yukarı doğru süzülüyor ve $y = 1$ etrafındaki ne kadar dar olursa olsun her yatay banda sıkışıyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xN=[],yN=[];for(var n=1;n<=50;n++){xN.push(n);yN.push(n/(n+1));}
var pts={x:xN,y:yN,mode:'markers',name:'a_n = n/(n+1)',marker:{color:'#3b82f6',size:8}};
var asym={x:[0,52],y:[1,1],mode:'lines',name:'limit L = 1',line:{color:'#f59e0b',width:2,dash:'dash'}};
var band1={x:[0,52],y:[1.05,1.05],mode:'lines',name:'L + ε',line:{color:'rgba(245,158,11,0.35)',width:1,dash:'dot'}};
var band2={x:[0,52],y:[0.95,0.95],mode:'lines',name:'L − ε',line:{color:'rgba(245,158,11,0.35)',width:1,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',range:[0,52],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'a_n',range:[0.3,1.15],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l67-converge-tr',[pts,asym,band1,band2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Monoton Diziler</h2>

<div class="calc-highlight"><strong>Bir dizi yalnızca tek yönde hareket ediyorsa monotondur.</strong> Ya her terim bir öncekinden büyük veya eşittir (artan) ya da her terim bir öncekinden küçük veya eşittir (azalan). Monoton bir dizide ileri-geri hareket yoktur — ya tırmanır ya iner, ikisi birden olmaz.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ARTAN</div><div class="compare-item">Kesin: $a_{n+1} > a_n$, her $n$ için</div><div class="compare-item">Zayıf (azalmayan): $a_{n+1} \\geq a_n$</div><div class="compare-item">Örnek: $a_n = n$ → $1, 2, 3, 4, \\dots$ kesin artan</div><div class="compare-item">Örnek: $a_n = \\dfrac{n}{n+1}$ — kesin artan</div></div><div class="compare-col"><div class="compare-title">AZALAN</div><div class="compare-item">Kesin: $a_{n+1} < a_n$, her $n$ için</div><div class="compare-item">Zayıf (artmayan): $a_{n+1} \\leq a_n$</div><div class="compare-item">Örnek: $a_n = \\dfrac{1}{n}$ → $1, \\tfrac{1}{2}, \\tfrac{1}{3}, \\dots$ kesin azalan</div><div class="compare-item">Örnek: $a_n = -n$ — kesin azalan</div></div></div>

<p class="l-text"><strong>Test yöntemleri.</strong> İki güvenilir yöntem:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fark testi</div><div class="card-body">$a_{n+1} - a_n$'yi hesapla. Her zaman pozitifse kesin artan; her zaman negatifse kesin azalan; her zaman sıfırsa sabit.</div></div>
<div class="calc-card"><div class="card-title">Oran testi (pozitif terimler)</div><div class="card-body">Her $n$ için $a_n > 0$ ise $\\dfrac{a_{n+1}}{a_n}$'yi hesapla. Bu oran her zaman $> 1$ ise kesin artan; her zaman $< 1$ ise kesin azalan.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Göster ki:</strong> $a_n = \\dfrac{n}{n+1}$ <strong>kesin artandır.</strong><br><br>Farkı hesapla:<br>$$a_{n+1} - a_n \\;=\\; \\frac{n+1}{n+2} - \\frac{n}{n+1} \\;=\\; \\frac{(n+1)^2 - n(n+2)}{(n+1)(n+2)} \\;=\\; \\frac{n^2 + 2n + 1 - n^2 - 2n}{(n+1)(n+2)} \\;=\\; \\frac{1}{(n+1)(n+2)}.$$<br>Bu her zaman pozitiftir (payda pozitif tam sayıların çarpımı, pay $1$). Yani her $n$ için $a_{n+1} > a_n$ — kesin artan. <strong>İspat tamam.</strong></div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$1, 1, 2, 2, 3, 3, 4, 4, \\dots$ dizisi monoton mudur? (Evet — azalmayan, ama kesin artan değil çünkü ardışık terimler eşit olabiliyor.) Peki $1, 2, 1, 2, 1, 2, \\dots$? (Hayır — yukarı, aşağı, yukarı. Monoton değil.)</div></div>

<h2 class="lesson-title">5. Sınırlı Diziler</h2>

<div class="calc-highlight"><strong>Bir dizi, sonsuza dek sonlu bir yatay şerit içinde kalıyorsa sınırlıdır.</strong> Hiçbir terim sabit bir tavanın üstüne çıkmaz, hiçbir terim sabit bir tabanın altına inmez. Kuralın iki yarısı da gereklidir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Üstten sınırlı</div><div class="card-body">Her $n$ için $a_n \\leq M$ olacak şekilde bir $M$ sabiti vardır. $M$ sayısına <em>üst sınır</em> denir.</div></div>
<div class="calc-card"><div class="card-title">Alttan sınırlı</div><div class="card-body">Her $n$ için $a_n \\geq m$ olacak şekilde bir $m$ sabiti vardır. $m$ sayısına <em>alt sınır</em> denir.</div></div>
<div class="calc-card"><div class="card-title">Sınırlı</div><div class="card-body">Hem üstten hem alttan sınırlı. Eşdeğer olarak: her $n$ için $|a_n| \\leq K$ olacak şekilde bir $K > 0$ vardır.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">SİNDİRİLMESİ GEREKEN ÖRNEKLER</div><div class="formula-main">$$\\begin{array}{l|l|l} \\text{Dizi} & \\text{Ust sinir?} & \\text{Alt sinir?} \\\\ \\hline a_n = \\tfrac{1}{n} & \\text{Evet, }1 & \\text{Evet, }0 \\\\ a_n = n & \\text{Yok (sonsuza)} & \\text{Evet, }1 \\\\ a_n = (-1)^n & \\text{Evet, }1 & \\text{Evet, }-1 \\\\ a_n = -n & \\text{Evet, }-1 & \\text{Yok (sonsuza)} \\\\ a_n = \\tfrac{n}{n+1} & \\text{Evet, }1 & \\text{Evet, }\\tfrac{1}{2} \\end{array}$$</div><div class="formula-sub">Bir dizi yakınsamadan da üstten sınırlı olabilir (alternat dizisine bak), ama yakınsak diziler her zaman sınırlıdır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Göster ki:</strong> $a_n = \\dfrac{n}{n+1}$ <strong>sınırlıdır.</strong><br><br>Alt sınır: her terim pozitiftir (pay ve payda pozitif tam sayılar) ve en küçük $a_1 = \\tfrac{1}{2}$'dir. Yani $n \\geq 1$ için $a_n \\geq \\tfrac{1}{2}$.<br><br>Üst sınır: $a_n = 1 - \\dfrac{1}{n+1}$ olarak yaz. $\\dfrac{1}{n+1} > 0$ olduğundan her $n$ için $a_n < 1$.<br><br>Yani $\\tfrac{1}{2} \\leq a_n < 1$ — dizi sınırlıdır.</div></div>

<h2 class="lesson-title">6. Monoton Yakınsaklık Teoremi</h2>

<div class="calc-highlight"><strong>Tüm analizin en kullanışlı teoremlerinden biri ve yine de tek cümle uzunluğunda:</strong> monoton ve sınırlı bir dizi yakınsamak zorundadır. Limitin var olduğunu bilmek için hesaplamana bile gerek yoktur.</div>

<div class="calc-formula"><div class="formula-label">MONOTON YAKINSAKLIK TEOREMİ</div><div class="formula-main">$$(a_n) \\text{ monoton ve sinirli} \\Rightarrow \\lim_{n \\to \\infty} a_n \\text{ vardir.}$$</div><div class="formula-sub">Daha kesin: artan ve sınırlı dizi <em>supremumuna</em> (en küçük üst sınır) yakınsar. Azalan ve sınırlı dizi <em>infimumuna</em> (en büyük alt sınır) yakınsar.</div></div>

<p class="l-text"><strong>Sezgi (biçimsel ispatsız).</strong> Bir tavanın altında oturan artan bir dizi düşün — tavan $M$ yüksekliğinde olsun. Terimler tırmanmaya devam eder, ama asla $M$'yi geçemez. Salınamazlar (monoton = ileri-geri yok). Sonsuza patlayamazlar (sınırlı). Geriye tek seçenek kalır: yavaşlamak ve $L \\leq M$ yüksekliğinin tam altına birikmek. O birikim yüksekliği limittir.</p>

<div class="calc-example"><div class="example-label">UYGULAMA</div><div class="example-body">$a_n = \\dfrac{n}{n+1}$'in kesin artan (bölüm 4) ve $1$ ile üstten sınırlı (bölüm 5) olduğunu zaten gösterdik. Monoton Yakınsaklık Teoremi'ne göre dizi yakınsar. Doğrudan hesaplamayla (bölüm 3) limit tam olarak $1$'dir.<br><br>İki adımlı argümana dikkat et: teorem önce <em>bir</em> limitin var olduğunu garanti eder, sonra ayrı bir hesap <em>hangi</em> limit olduğunu söyler. Bu ayrım, $a_n$ formülünün karışık olduğu ama monoton-sınırlı kontrolünün kolay olduğu problemlerde son derece kullanışlıdır.</div></div>

<div class="l-note"><strong>Teoremin önemi:</strong> Birçok problemde (özellikle özyinelemeli olanlarda, bölüm 7) $a_n$'yi $n$'nin temiz bir fonksiyonu olarak yazamayız. Yine de monoton ve sınırlı olduğunu gösterebilirsek — teorem limitin varlığını bize ücretsiz verir. Limitin var olduğunu öğrendikten sonra cebirsel olarak çözebiliriz.</div>

<h2 class="lesson-title">7. Özyinelemeli Diziler ve Sabit Noktalar</h2>

<div class="calc-highlight"><strong>Özyinelemeli (recurrence) dizi, bir sonraki terimi önceki terimlerin fonksiyonu olarak verir.</strong> Klasik biçim: $a_{n+1} = f(a_n)$, başlangıç değeri $a_1$. Limiti (varsa) bulmak için şu güzel gözlemi kullanırız: $a_n \\to L$ ise, $a_{n+1} \\to L$ olur — ve bu, $L$'yi $L = f(L)$ denkleminin çözümü olarak sabitler.</div>

<p class="l-text"><strong>Sabit nokta numarası.</strong> $a_{n+1} = f(a_n)$ olsun ve dizinin yakınsadığını varsayalım, $a_n \\to L$. Özyinelemenin her iki tarafının limitini al. Sol taraf $\\to L$ (çünkü $(a_{n+1})$, $(a_n)$'nin bir kaydırılmışıdır — aynı limit). Sağ taraf $\\to f(L)$ ($f$ sürekli ise). Dolayısıyla:</p>

<div class="calc-formula"><div class="formula-label">SABİT NOKTA DENKLEMİ</div><div class="formula-main">$$L \\;=\\; f(L)$$</div><div class="formula-sub">Özyinelemeli $a_{n+1} = f(a_n)$ dizisinin her limiti $L$, $f$'in bir <em>sabit noktası</em> olmalıdır — yani fonksiyonun kendine gönderdiği bir değer.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Olsun:</strong> $a_1 = 1$ <strong>ve</strong> $a_{n+1} = \\sqrt{2 + a_n}$. <strong>Limit var olduğunu varsayarak bul.</strong><br><br>$a_n \\to L$ ise sabit nokta denklemiyle $L = \\sqrt{2 + L}$.<br>Karesini al: $L^2 = 2 + L$, yani $L^2 - L - 2 = 0$, yani $(L - 2)(L + 1) = 0$.<br>Yani $L = 2$ veya $L = -1$. Her $n$ için $a_n > 0$ olduğundan (karekök pozitif), tek geçerli limit $L = \\mathbf{2}$.<br><br>Sayısal kontrol: $a_1 = 1$, $a_2 = \\sqrt{3} \\approx 1.732$, $a_3 \\approx 1.932$, $a_4 \\approx 1.983$, $a_5 \\approx 1.996$. Hızla $2$'ye yakınsıyor. Onaylandı.</div></div>

<p class="l-text"><strong>Uyarı.</strong> Sabit nokta denklemi yalnızca dizinin yakınsadığını varsayarak $L$ için aday değerleri verir. Dizinin gerçekten yakınsadığını ayrıca (genellikle Monoton Yakınsaklık Teoremi ile) göstermemiz gerekir. Aksi halde ıraksak bir dizi için "limit" raporlayabiliriz.</p>

<h2 class="lesson-title">8. Ünlü Çözümlü Örnekler</h2>

<p class="l-text">Limitleri eski dost olması gereken üç dizi.</p>

<div class="calc-example"><div class="example-label">ÖRNEK A: $a_n = \\dfrac{n}{n+1}$</div><div class="example-body">Zaten incelendi: kesin artan, alttan $\\tfrac{1}{2}$ ve üstten $1$ ile sınırlı, $1$'e yakınsar. Bölüm 3'teki grafik yakınsamayı görselleştirir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK B: $a_n = \\dfrac{n^2 + 1}{2n^2 - 3}$</div><div class="example-body">Pay ve paydayı $n^2$'ye böl: $a_n = \\dfrac{1 + 1/n^2}{2 - 3/n^2}$. $n \\to \\infty$ iken bu $\\to \\dfrac{1}{2}$.<br><br>Sayısal kontrol: $a_5 = \\tfrac{26}{47} \\approx 0.553$, $a_{10} = \\tfrac{101}{197} \\approx 0.513$, $a_{100} \\approx 0.50013$. Onaylandı: limit $\\tfrac{1}{2}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK C: Fibonacci oranları</div><div class="example-body">Fibonacci sayıları $F_1 = F_2 = 1$ ve $F_{n+1} = F_n + F_{n-1}$ kuralıyla tanımlıdır. Ardışık Fibonacci sayılarının oranı $r_n = \\dfrac{F_{n+1}}{F_n}$ olsun.<br><br>İlk değerler: $r_1 = 1, r_2 = 2, r_3 = 1.5, r_4 \\approx 1.667, r_5 = 1.6, r_6 = 1.625, r_7 \\approx 1.615, r_8 \\approx 1.619, \\dots$<br><br>Oranların yukarı-aşağı sıçradığına ama genliğin küçüldüğüne dikkat — yakınsıyorlar. Limit ünlü <em>altın orandır</em>:<br>$$L = \\frac{1 + \\sqrt{5}}{2} \\approx 1.61803398\\dots = \\varphi.$$<br><br>Nedeni: $F_{n+1} = F_n + F_{n-1}$ ifadesini $F_n$'ye böl, $r_n = 1 + \\dfrac{1}{r_{n-1}}$ elde et. Sabit nokta denklemi $L = 1 + \\tfrac{1}{L}$ → $L^2 - L - 1 = 0$. Pozitif kök $\\varphi$.</div></div>

<div class="calc-graph"><div id="plot-l67-fibonacci-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $n = 1$'den $20$'ye Fibonacci oranları $r_n = F_{n+1}/F_n$. Oranlar altın oran $\\varphi \\approx 1.618$ etrafında (kesik çizgi) yukarı ve aşağı salınır, salınım genliği hızla küçülür. $n = 12$'ye gelindiğinde oran $\\varphi$'yi dört ondalık basamağa kadar yakalar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var F=[1,1];for(var i=2;i<=22;i++)F.push(F[i-1]+F[i-2]);
var xR=[],yR=[];for(var n=1;n<=20;n++){xR.push(n);yR.push(F[n]/F[n-1]);}
var pts={x:xR,y:yR,mode:'lines+markers',name:'r_n = F_{n+1}/F_n',line:{color:'#3b82f6',width:2},marker:{color:'#3b82f6',size:8}};
var phi=(1+Math.sqrt(5))/2;
var asym={x:[0,21],y:[phi,phi],mode:'lines',name:'φ ≈ 1.618',line:{color:'#f59e0b',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',range:[0,21],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:2},yaxis:{title:'r_n',range:[0.9,2.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l67-fibonacci-tr',[pts,asym],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Iraksak Diziler</h2>

<div class="calc-highlight"><strong>Limiti olmayan diziye <em>ıraksak</em> denir.</strong> Bunun olmasının iki yaygın yolu vardır: terimler $\\pm\\infty$'a <em>patlar</em> veya terimler <em>salınır</em> ve hiç yerleşmez.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sonsuza ıraksama</div><div class="card-body">$a_n = n$ her sabit sınırı geçer. $\\lim_{n \\to \\infty} n = +\\infty$ yazarız, ama bu kısaltmadır — kesin olarak söylersek reel sayı limiti yoktur.</div></div>
<div class="calc-card"><div class="card-title">Salınımlı ıraksama</div><div class="card-body">$a_n = (-1)^n$ $-1$ ile $+1$ arasında dolaşır. Terimler sınırlı kalır ama tek bir değere yerleşmez, yani limit yoktur.</div></div>
<div class="calc-card"><div class="card-title">Vahşi salınım</div><div class="card-body">$a_n = (-1)^n \\cdot n$ → $-1, 2, -3, 4, -5, \\dots$ İşaretler değişir, büyüklükler artar. Ne uslu ne yakınsak.</div></div>
</div>

<div class="calc-graph"><div id="plot-l67-oscillate-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $a_n = (-1)^n$ alternat dizisi, $n = 1, 2, \\dots, 20$. Noktalar kesin olarak $-1$ ile $+1$ arasında değişir. Geç terimlerin hepsini içeren ne kadar küçük olursa olsun tek bir yatay bant yoktur — yani dizi limitsiz. Ders kitabı ıraksak (salınımlı) örnek.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xO=[],yO=[];for(var n=1;n<=20;n++){xO.push(n);yO.push(Math.pow(-1,n));}
var pts={x:xO,y:yO,mode:'markers',name:'a_n = (−1)^n',marker:{color:'#3b82f6',size:9}};
var hi={x:[0,21],y:[1,1],mode:'lines',name:'üst ziyaret y=1',line:{color:'rgba(245,158,11,0.6)',width:1.5,dash:'dot'}};
var lo={x:[0,21],y:[-1,-1],mode:'lines',name:'alt ziyaret y=−1',line:{color:'rgba(239,68,68,0.6)',width:1.5,dash:'dot'}};
var zero={x:[0,21],y:[0,0],mode:'lines',name:'yerleşme yok',line:{color:'rgba(255,255,255,0.25)',width:1}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',range:[0,21],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:2},yaxis:{title:'a_n',range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:0.5},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l67-oscillate-tr',[pts,hi,lo,zero],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Sık Yapılan Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">"Her monoton dizi yakınsar."</div><div class="card-body"><strong>Yanlış.</strong> Karşı örnek: $a_n = n$ kesin artandır ama sonsuza ıraksar. Doğru koşul monoton <em>ve sınırlı</em>'dır.</div></div>
<div class="calc-card"><div class="card-title">"Her sınırlı dizi yakınsar."</div><div class="card-body"><strong>Yanlış.</strong> Karşı örnek: $a_n = (-1)^n$ $-1$ ile $1$ arasında sınırlıdır ama hiç yerleşmez. Doğru kombinasyon sınırlı <em>ve monoton</em>'dur.</div></div>
<div class="calc-card"><div class="card-title">Yakınsamayı kontrol etmeden sabit nokta denklemini çözmek</div><div class="card-body">$L = f(L)$ yalnızca limit <em>var olsaydı</em> ne olacağını söyler. Her zaman dizinin gerçekten yakınsadığını doğrula, örn. monoton + sınırlı ile.</div></div>
<div class="calc-card"><div class="card-title">Alternat dizilerde işaret unutmak</div><div class="card-body">$a_n = (-1)^n \\cdot \\tfrac{1}{n}$ ise terimler küçülür ama işaret değiştirir. Limit yine $0$'dır — büyüklük kontrolü sağlar. Dikkatli hesapla.</div></div>
</div>

<h2 class="lesson-title">11. Alıştırmalar</h2>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle\\lim_{n \\to \\infty} \\frac{2n + 1}{3n - 4}$.<br><br>En yüksek kuvvet $n^1$. Pay ve paydayı $n$'ye böl: $\\dfrac{2 + 1/n}{3 - 4/n} \\to \\dfrac{2}{3}$. Limit $= \\mathbf{\\tfrac{2}{3}}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle\\lim_{n \\to \\infty} \\frac{5n^2 - 2n}{3n^3 + 7}$.<br><br>Payda derecesi ($3$) pay derecesinden ($2$) büyük. Hızlı kurala göre limit $= \\mathbf{0}$. Pay ve paydayı $n^3$'e bölerek doğrula: pay $\\to 0$, payda $\\to 3$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body"><strong>$a_n = \\dfrac{2n+3}{n+1}$ monoton mu? Sınırlı mı? Limitini bul.</strong><br><br>Fark: $a_{n+1} - a_n = \\dfrac{2(n+1)+3}{n+2} - \\dfrac{2n+3}{n+1} = \\dfrac{(2n+5)(n+1) - (2n+3)(n+2)}{(n+1)(n+2)} = \\dfrac{-1}{(n+1)(n+2)} < 0$. <strong>Kesin azalan.</strong><br>Yeniden yaz: $a_n = 2 + \\dfrac{1}{n+1}$. $\\tfrac{1}{n+1} > 0$ olduğundan $a_n > 2$ — <strong>alt sınır $2$</strong>. Ve $a_1 = 2.5$ en büyük — <strong>üst sınır $2.5$</strong>.<br>Monoton + sınırlı $\\Rightarrow$ yakınsak. Doğrudan hesapla limit $= \\mathbf{2}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body"><strong>Özyinelemeli dizi:</strong> $a_1 = 2$, $a_{n+1} = \\dfrac{a_n + 6}{2}$. <strong>Limit varsa bul.</strong><br><br>Sabit nokta denklemi: $L = \\dfrac{L+6}{2} \\Rightarrow 2L = L + 6 \\Rightarrow L = \\mathbf{6}$.<br>Sayısal kontrol: $a_1 = 2, a_2 = 4, a_3 = 5, a_4 = 5.5, a_5 = 5.75, a_6 = 5.875, \\dots$ $6$'ya yakınsıyor. Onaylandı.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body"><strong>$a_n = \\dfrac{\\cos n}{n}$ yakınsar mı? Limiti bul.</strong><br><br>Kosinüs $-1$ ile $1$ arasında salınır, yani $-\\dfrac{1}{n} \\leq a_n \\leq \\dfrac{1}{n}$. Her iki sınır $n \\to \\infty$ iken $\\to 0$. Sıkıştırma argümanıyla (gayri resmi: sıfıra giden iki dizi arasında kapalı), $a_n \\to \\mathbf{0}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6</div><div class="example-body"><strong>$a_n = (-1)^n + \\dfrac{1}{n}$ yakınsar mı?</strong><br><br>$1/n$ kısmı $0$'a gider. $(-1)^n$ kısmı sonsuza dek $-1$ ile $+1$ arasında değişir. Yani $a_n$ $-1$ ve $+1$ civarında alternat eder — hiç yerleşmez. <strong>Iraksak.</strong> Limit yok.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle\\lim_{n \\to \\infty} \\left(1 + \\dfrac{1}{n}\\right)^n$ <strong>ve $n = 100$ için sayısal olarak doğrula.</strong><br><br>Bu, $e \\approx 2.71828$ sayısını tanımlayan ünlü limittir.<br>$n = 1$: $2^1 = 2$. $n = 10$: $(1.1)^{10} \\approx 2.594$. $n = 100$: $(1.01)^{100} \\approx 2.7048$. $n = 1000$: $\\approx 2.7169$. Yavaşça $e$'ye süzülüyor. Onaylandı.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8</div><div class="example-body"><strong>Göster ki:</strong> $a_n = \\sqrt{2 + \\sqrt{2 + \\sqrt{2 + \\cdots}}}$ <strong>(n iç içe karekök) yakınsaktır ve limitini bul.</strong><br><br>Özyinelemeli tanım: $a_1 = \\sqrt{2}$, $a_{n+1} = \\sqrt{2 + a_n}$.<br>Sabit nokta denklemi: $L = \\sqrt{2 + L} \\Rightarrow L^2 = 2 + L \\Rightarrow L^2 - L - 2 = 0 \\Rightarrow (L-2)(L+1) = 0$.<br>Pozitif kök: $L = \\mathbf{2}$.<br>Sayısal: $\\sqrt{2} \\approx 1.414$, $\\sqrt{2 + 1.414} \\approx 1.848$, $\\sqrt{2 + 1.848} \\approx 1.962$, $\\sqrt{2 + 1.962} \\approx 1.990$. Hızla $2$'ye yaklaşıyor.</div></div>

<h2 class="lesson-title">12. Özet</h2>

<div class="calc-formula"><div class="formula-label">TEMEL FİKİRLER — HER BİRİ TEK SATIR</div><div class="formula-main">$$\\begin{array}{l} \\bullet \\;\\; \\text{Dizi: } a: \\mathbb{N} \\to \\mathbb{R}. \\\\ \\bullet \\;\\; \\text{Limit } L: \\text{ buyuk } n \\text{ icin terimler } L \\text{'ye yakin.} \\\\ \\bullet \\;\\; \\text{Rasyonel: en yuksek } n \\text{ kuvvetine bol.} \\\\ \\bullet \\;\\; \\text{Monoton + sinirli } \\Rightarrow \\text{ yakinsak (MYT).} \\\\ \\bullet \\;\\; \\text{Recursive } a_{n+1} = f(a_n): \\;\\; L = f(L). \\\\ \\bullet \\;\\; \\text{Yalniz biri yetmez; iki sart da gerekli.} \\end{array}$$</div></div>

<div class="l-note"><strong>Sırada ne var:</strong> diziler elimizde olunca <em>serileri</em> (sonsuz toplamlar), sonlu noktalarda biçimsel $\\varepsilon$-$\\delta$ limit tanımını ve nihayet türevi — fark oranı dizisinin limiti olarak tanımlı — çalışabiliriz. Diziler kapıdır.</div>`
};
