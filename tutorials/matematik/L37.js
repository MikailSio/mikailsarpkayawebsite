window.LISE_MAT_L37 = {

en: `<p class="l-text"><strong>Logarithms come in many bases, but two of them dominate every textbook, every calculator, and every scientific paper.</strong> One is <em>base 10</em> — the base of our number system — and lives under the simple key labelled "log" on every handheld calculator. The other is <em>base e</em> — a strange irrational number close to 2.71828 — and lives under the key labelled "ln". This lesson explains why these two bases are special, how to switch between any two bases with a single short formula, and why the natural logarithm is the only logarithm that calculus ever needs.</p>

<p class="l-text">By the end of the lesson you will read "log" and "ln" without hesitation, compute $\\log_a x$ for any base from the values of $\\ln$ or $\\log_{10}$ alone, derive the change-of-base formula from scratch, and understand the limit definition that gives the number $e$ its value. Nothing in this lesson requires calculus — but everything in this lesson is the bridge to calculus.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read $\\ln x$ as the logarithm to base $e$ and $\\log x$ as the logarithm to base 10</li>
<li>Recognise the conventions used in mathematics, engineering, physics and computer science</li>
<li>State and derive the change-of-base formula $\\log_a x = \\dfrac{\\log_b x}{\\log_b a}$</li>
<li>Evaluate a logarithm in any base using only the $\\ln$ or $\\log$ keys on a calculator</li>
<li>Define $e$ either as the limit $\\lim_{n\\to\\infty}\\left(1 + \\tfrac{1}{n}\\right)^n$ or as the sum of an infinite series</li>
<li>Explain why $e^x$ is the unique exponential function whose own slope equals itself, and why that makes $e$ the "natural" base</li>
</ul>
</div>

<h2 class="lesson-title">1. The Natural Logarithm $\\ln x$</h2>

<div class="calc-highlight"><strong>The natural logarithm is the logarithm to base $e$.</strong> The number $e \\approx 2.71828$ is irrational (like $\\pi$), but it appears so often in calculus, physics, probability, and economics that mathematicians gave it its own symbol and its own dedicated notation. Instead of writing $\\log_e x$ — which is cumbersome — we write $\\ln x$, short for the Latin <em>logarithmus naturalis</em>.</div>

<div class="calc-formula"><div class="formula-label">DEFINITION OF THE NATURAL LOGARITHM</div><div class="formula-main">$$\\ln x \\;=\\; \\log_e x \\qquad (x > 0)$$</div><div class="formula-sub">"$\\ln x$ is the power to which $e$ must be raised to give $x$." The domain is $x > 0$, exactly as for any logarithm.</div></div>

<p class="l-text">The natural logarithm satisfies every property you already know from base-$a$ logarithms — because it <em>is</em> a logarithm, just with a particular base chosen:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\ln 1 = 0$</div><div class="card-body">Because $e^0 = 1$. The logarithm of 1 is zero in every base.</div></div>
<div class="calc-card"><div class="card-title">$\\ln e = 1$</div><div class="card-body">Because $e^1 = e$. The log of the base, in any base, is always 1.</div></div>
<div class="calc-card"><div class="card-title">$\\ln(xy) = \\ln x + \\ln y$</div><div class="card-body">Product rule — same as $\\log_a$.</div></div>
<div class="calc-card"><div class="card-title">$\\ln(x^n) = n \\ln x$</div><div class="card-body">Power rule — same as $\\log_a$.</div></div>
</div>

<p class="l-text"><strong>So why bother with a separate symbol?</strong> Because the moment you reach calculus, base $e$ becomes the only base whose logarithm and exponential have simple derivatives:</p>

<div class="calc-formula"><div class="formula-label">WHY $e$ IS THE NATURAL CHOICE FOR CALCULUS</div><div class="formula-main">$$\\frac{d}{dx} e^x \\;=\\; e^x \\qquad\\text{and}\\qquad \\frac{d}{dx} \\ln x \\;=\\; \\frac{1}{x}$$</div><div class="formula-sub">No other base gives you derivatives this clean. Every other exponential picks up an awkward factor of $\\ln a$.</div></div>

<p class="l-text">You will see the proof of the right-hand identity later in calculus. For now just absorb the message: <em>the natural logarithm is the logarithm whose derivative is the simplest possible function</em>, namely $1/x$. That is the single reason $\\ln$ deserves its special status.</p>

<div class="think-box"><div class="think-label">A QUICK MENTAL ANCHOR</div><div class="think-body">$\\ln e = 1$, $\\ln e^2 = 2$, $\\ln e^3 = 3$, and in general $\\ln e^n = n$. Because $e \\approx 2.718$, we get $\\ln 2.718 \\approx 1$, $\\ln 7.389 \\approx 2$, $\\ln 20.09 \\approx 3$. Memorise that $\\ln 2 \\approx 0.693$ and $\\ln 10 \\approx 2.303$ — these two values let you approximate almost any natural log in your head.</div></div>

<h2 class="lesson-title">2. The Common Logarithm $\\log x$</h2>

<div class="calc-highlight"><strong>The common logarithm is the logarithm to base 10.</strong> Because the decimal system is base 10, this logarithm has an immediate intuitive meaning: $\\log_{10} x$ counts (roughly) the number of digits of $x$. Hand calculators and most engineering tables historically gave only base-10 logarithms, which is why this base earned the name "common".</div>

<div class="calc-formula"><div class="formula-label">DEFINITION OF THE COMMON LOGARITHM</div><div class="formula-main">$$\\log x \\;=\\; \\log_{10} x \\qquad (x > 0)$$</div><div class="formula-sub">In high-school mathematics and on every handheld calculator, the symbol "log" with no base written means base 10. This is a convention you must respect.</div></div>

<p class="l-text">A few values you should memorise:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$\\log_{10} x$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Reason</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">0</td><td style="padding:0.5rem 0.8rem">$10^0 = 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">10</td><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">$10^1 = 10$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">100</td><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">$10^2 = 100$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1000</td><td style="padding:0.5rem 0.8rem">3</td><td style="padding:0.5rem 0.8rem">$10^3 = 1000$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">0.1</td><td style="padding:0.5rem 0.8rem">&minus;1</td><td style="padding:0.5rem 0.8rem">$10^{-1} = 0.1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">0.01</td><td style="padding:0.5rem 0.8rem">&minus;2</td><td style="padding:0.5rem 0.8rem">$10^{-2} = 0.01$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$\\sqrt{10}$</td><td style="padding:0.5rem 0.8rem">$\\tfrac{1}{2}$</td><td style="padding:0.5rem 0.8rem">$10^{1/2} = \\sqrt{10}$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>The "count the digits" rule.</strong> A positive integer with $d$ digits sits between $10^{d-1}$ and $10^d$. So its common log lies between $d-1$ and $d$. In other words:</p>

<div class="calc-formula"><div class="formula-label">A USEFUL ESTIMATE</div><div class="formula-main">$$\\lfloor \\log_{10} N \\rfloor + 1 \\;=\\; \\text{number of digits of the positive integer } N$$</div><div class="formula-sub">Example: $N = 7\\,318$, then $\\log_{10} 7318 \\approx 3.86$, floor is 3, plus 1 gives 4 — and indeed 7318 has 4 digits.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>How many digits does $2^{100}$ have?</strong><br><br>Take the base-10 log: $\\log_{10}(2^{100}) = 100 \\cdot \\log_{10} 2 \\approx 100 \\cdot 0.30103 = 30.103$.<br><br>Floor is 30, plus 1 gives 31. So $2^{100}$ has <strong>31 digits</strong>. (For reference, $2^{100} = 1\\,267\\,650\\,600\\,228\\,229\\,401\\,496\\,703\\,205\\,376$.)</div></div>

<h2 class="lesson-title">3. The Notation: "$\\log$", "$\\ln$", "$\\lg$"</h2>

<div class="calc-highlight"><strong>Notation is a minefield.</strong> Different fields write the symbol "$\\log$" to mean different bases. You must always read the context. The conventions below are the most widespread; deviating from them is a source of endless confusion in textbooks and software libraries.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Notation</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Base</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Used by</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\ln x$</td><td style="padding:0.5rem 0.8rem">$e$</td><td style="padding:0.5rem 0.8rem">Mathematics, calculus, physics, engineering, statistics</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\log x$ (handheld calculator)</td><td style="padding:0.5rem 0.8rem">10</td><td style="padding:0.5rem 0.8rem">High-school maths, chemistry (pH), acoustics (decibels), seismology (Richter)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\log x$ (research mathematics)</td><td style="padding:0.5rem 0.8rem">$e$</td><td style="padding:0.5rem 0.8rem">Number theory, complex analysis &mdash; "$\\log$" alone often means natural</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\log x$ (computer science)</td><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">Complexity analysis &mdash; "log" usually means base 2 (sometimes written $\\log_2$ or $\\lg$)</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$\\lg x$</td><td style="padding:0.5rem 0.8rem">2 (or 10)</td><td style="padding:0.5rem 0.8rem">European tradition: base 2 in CS, base 10 in older European maths texts</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>The Turkish high-school rule</strong> (and the rule we follow on every page from here on): "$\\log x$" written with no base means $\\log_{10} x$; "$\\ln x$" always means $\\log_e x$. We will never write "$\\log$" to mean anything other than base 10 without explicitly writing the base as a subscript.</p>

<div class="think-box"><div class="think-label">A WARNING WORTH REMEMBERING</div><div class="think-body">When you read a research paper, an engineering handbook, or a scientific software manual, always check which base the author uses for "$\\log$". In most scientific computing libraries the function called "log" means the natural logarithm (base $e$), and a separate function "log10" handles base 10. That is the exact opposite of the convention on a handheld calculator! Misreading the base of a logarithm can throw an answer off by a factor of 2.303 or by a factor of $1/0.434$ — neither of them small.</div></div>

<h2 class="lesson-title">4. The Change-of-Base Formula</h2>

<div class="calc-highlight"><strong>Every logarithm can be converted to any other base.</strong> The change-of-base formula is the single most useful identity in this lesson: it lets you express $\\log_a x$ in terms of logarithms in any other base $b$ that you find convenient — typically $b = e$ (for theory) or $b = 10$ (for hand calculation).</div>

<div class="calc-formula"><div class="formula-label">CHANGE-OF-BASE FORMULA</div><div class="formula-main">$$\\log_a x \\;=\\; \\frac{\\log_b x}{\\log_b a} \\qquad (a, b > 0;\\;\\; a, b \\neq 1;\\;\\; x > 0)$$</div><div class="formula-sub">Translate a logarithm in base $a$ to a logarithm in any other base $b$ by dividing by $\\log_b a$.</div></div>

<p class="l-text"><strong>Proof.</strong> Let $y = \\log_a x$. By the definition of a logarithm, this means $a^y = x$. Now apply $\\log_b$ to both sides of that equation:</p>

<div style="background:rgba(255,255,255,0.03);border-left:3px solid #3b82f6;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.95rem">
$\\log_b(a^y) = \\log_b x$<br><br>
$y \\cdot \\log_b a = \\log_b x \\qquad$ (power rule of $\\log_b$)<br><br>
$y = \\dfrac{\\log_b x}{\\log_b a} \\qquad$ (divide by $\\log_b a$, which is non-zero because $a \\neq 1$)<br><br>
Substituting back $y = \\log_a x$ gives the formula. <strong>QED.</strong>
</div>

<p class="l-text">The proof has only three lines. The formula has only one division. And yet it lets you compute logarithms in <em>any</em> base whatsoever from just one set of stored values — historically, base 10; today, base $e$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Choose $b = e$</div><div class="card-body">$\\log_a x = \\dfrac{\\ln x}{\\ln a}$. The version every calculus textbook uses.</div></div>
<div class="calc-card"><div class="card-title">Choose $b = 10$</div><div class="card-body">$\\log_a x = \\dfrac{\\log x}{\\log a}$. The version that suits a handheld calculator with no $\\ln$ key.</div></div>
<div class="calc-card"><div class="card-title">Special case: $x = b$</div><div class="card-body">$\\log_a b = \\dfrac{\\log_b b}{\\log_b a} = \\dfrac{1}{\\log_b a}$. The reciprocal identity.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute $\\log_2 7$.</strong><br><br>Use change-of-base with $b = 10$: $\\log_2 7 = \\dfrac{\\log 7}{\\log 2} \\approx \\dfrac{0.8451}{0.3010} \\approx \\mathbf{2.807}$.<br><br>Check with $b = e$: $\\log_2 7 = \\dfrac{\\ln 7}{\\ln 2} \\approx \\dfrac{1.9459}{0.6931} \\approx 2.807$. The two computations must agree — they do.</div></div>

<h2 class="lesson-title">5. Computing $\\log_a x$ in Terms of $\\ln$</h2>

<div class="calc-highlight"><strong>Almost every scientific calculator has both an "ln" key and a "log" key.</strong> But it has no "$\\log_a$" key — there is no button for an arbitrary base. The change-of-base formula tells you exactly what to do.</div>

<div class="calc-formula"><div class="formula-label">THE TWO PRACTICAL FORMS</div><div class="formula-main">$$\\log_a x \\;=\\; \\frac{\\ln x}{\\ln a} \\;=\\; \\frac{\\log x}{\\log a}$$</div><div class="formula-sub">Either pair of buttons works. The ratio is the same number.</div></div>

<p class="l-text">The procedure on a calculator:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1</div><div class="card-body">Type $x$, then press the $\\ln$ (or $\\log$) key. Read off the value.</div></div>
<div class="calc-card"><div class="card-title">Step 2</div><div class="card-body">Type $a$, then press the same key. Read off the value.</div></div>
<div class="calc-card"><div class="card-title">Step 3</div><div class="card-body">Divide. The quotient is $\\log_a x$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute $\\log_3 50$.</strong><br><br>$\\log_3 50 = \\dfrac{\\ln 50}{\\ln 3}$.<br><br>$\\ln 50 \\approx 3.9120$ and $\\ln 3 \\approx 1.0986$.<br><br>So $\\log_3 50 \\approx 3.9120 / 1.0986 \\approx \\mathbf{3.561}$.<br><br>Sanity check: $3^{3.561} = e^{3.561 \\cdot \\ln 3} = e^{3.561 \\cdot 1.0986} \\approx e^{3.912} \\approx 50$. The check works.</div></div>

<div class="calc-graph"><div id="plot-l37-ln-vs-log-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $y = \\ln x$ and $y = \\log_{10} x$ on the same axes, $0.05 \\leq x \\leq 10$. Both curves pass through $(1, 0)$ — every log of 1 is 0, in every base. Both are increasing and both diverge to $-\\infty$ as $x \\to 0^+$. But $\\ln$ grows faster, because $e < 10$ — the smaller the base, the steeper the climb. The vertical gap between the two curves at any $x$ is exactly $(\\ln 10 - 1)\\cdot \\log_{10} x \\approx 1.303 \\cdot \\log_{10} x$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var ynL=[];var ylL=[];
for(var i=0;i<=400;i++){var x=0.05+(10-0.05)*i/400;xL.push(x);ynL.push(Math.log(x));ylL.push(Math.log(x)/Math.log(10));}
var t1={x:xL,y:ynL,mode:'lines',name:'y = ln x',line:{color:'#3b82f6',width:2.6}};
var t2={x:xL,y:ylL,mode:'lines',name:'y = log₁₀ x',line:{color:'#f59e0b',width:2.6}};
var t3={x:[1],y:[0],mode:'markers',name:'(1, 0)',marker:{color:'#ec4899',size:10,line:{color:'#ebe6dc',width:1.5}}};
var t4={x:[Math.E],y:[1],mode:'markers',name:'(e, 1) on ln',marker:{color:'#3b82f6',size:9,symbol:'circle-open',line:{color:'#3b82f6',width:2}}};
var t5={x:[10],y:[1],mode:'markers',name:'(10, 1) on log',marker:{color:'#f59e0b',size:9,symbol:'circle-open',line:{color:'#f59e0b',width:2}}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#ebe6dc',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,10]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3.2,2.6]},margin:{t:30,r:30,b:55,l:55},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l37-ln-vs-log-en',[t1,t2,t3,t4,t5],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. The Definition of $e$</h2>

<div class="calc-highlight"><strong>$e$ is not invented; it is discovered.</strong> Several apparently unrelated processes in mathematics — compound interest, the number of derangements, the steady-state of a differential equation — all spit out the same irrational number $\\approx 2.71828$. The cleanest definition comes from compound interest.</div>

<p class="l-text"><strong>The compound-interest story.</strong> Invest 1 unit of money at 100% annual interest for one year. If the interest is paid once at the end of the year, the balance is $1 + 1 = 2$. If it is paid twice per year (50% at six months, 50% at year-end), the balance is $\\left(1 + \\tfrac{1}{2}\\right)^2 = 2.25$. If it is paid $n$ times per year (each instalment $1/n$), the balance is $\\left(1 + \\tfrac{1}{n}\\right)^n$. As $n$ grows the balance keeps creeping up, but never explodes — it converges to a fixed limit.</p>

<div class="calc-formula"><div class="formula-label">LIMIT DEFINITION OF $e$</div><div class="formula-main">$$e \\;=\\; \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n \\;\\approx\\; 2.71828\\,18284\\,59045\\,...$$</div><div class="formula-sub">The continuously-compounded value of a 1-unit, 100%-per-year, one-year investment.</div></div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$n$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$(1 + 1/n)^n$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">How close to $e$?</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">2.000000</td><td style="padding:0.5rem 0.8rem">0.718 below</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">2.250000</td><td style="padding:0.5rem 0.8rem">0.468 below</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">10</td><td style="padding:0.5rem 0.8rem">2.593742</td><td style="padding:0.5rem 0.8rem">0.125 below</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">100</td><td style="padding:0.5rem 0.8rem">2.704814</td><td style="padding:0.5rem 0.8rem">0.013 below</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1000</td><td style="padding:0.5rem 0.8rem">2.716924</td><td style="padding:0.5rem 0.8rem">0.0014 below</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">10000</td><td style="padding:0.5rem 0.8rem">2.718146</td><td style="padding:0.5rem 0.8rem">0.00014 below</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$\\infty$</td><td style="padding:0.5rem 0.8rem">$e \\approx 2.718282$</td><td style="padding:0.5rem 0.8rem">exact</td></tr>
</tbody></table>
</div>

<p class="l-text">The convergence is slow — every extra digit of accuracy in $e$ requires multiplying $n$ by ten. (That is a sign of "linear" convergence; faster methods exist.)</p>

<div class="calc-formula"><div class="formula-label">SERIES DEFINITION OF $e$</div><div class="formula-main">$$e \\;=\\; \\sum_{k=0}^{\\infty} \\frac{1}{k!} \\;=\\; 1 + 1 + \\frac{1}{2!} + \\frac{1}{3!} + \\frac{1}{4!} + \\cdots$$</div><div class="formula-sub">A much faster way to compute $e$: each new term shrinks by a factor of roughly $k$, so accuracy doubles every few terms.</div></div>

<p class="l-text">Adding the first eight terms of the series gives 2.7182788... — already accurate to four decimal places. Adding the first twelve gives accuracy to nine decimal places. This series, not the compound-interest limit, is how computers actually evaluate $e$.</p>

<div class="calc-graph"><div id="plot-l37-e-converge-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the sequence $a_n = (1 + 1/n)^n$ for $n = 1, 2, \\ldots, 200$. It increases monotonically toward the horizontal asymptote at $e \\approx 2.71828$ (dashed line). At $n = 200$ the value is still only 2.7115 — the convergence really is slow.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[];var vs=[];for(var n=1;n<=200;n++){ns.push(n);vs.push(Math.pow(1+1/n,n));}
var t1={x:ns,y:vs,mode:'lines+markers',name:'a_n = (1 + 1/n)^n',line:{color:'#3b82f6',width:2.4},marker:{size:4,color:'#3b82f6'}};
var t2={x:[0,210],y:[Math.E,Math.E],mode:'lines',name:'limit = e ≈ 2.71828',line:{color:'#f59e0b',width:2,dash:'dash'}};
var t3={x:[1,2,10,100],y:[2,2.25,Math.pow(1.1,10),Math.pow(1.01,100)],mode:'markers',name:'sample points',marker:{color:'#ec4899',size:9,symbol:'diamond'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#ebe6dc',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,210]},yaxis:{title:'(1 + 1/n)^n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[1.9,2.8]},margin:{t:30,r:30,b:55,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l37-e-converge-en',[t1,t2,t3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Why is $e$ the "Natural" Base?</h2>

<div class="calc-highlight"><strong>Of all real numbers, $e$ is special for one reason above all: the function $f(x) = e^x$ is its own derivative.</strong> No other exponential function $a^x$ has this property. That single fact — proved in calculus — is what makes $e$ the natural base for exponentials, logarithms, differential equations, probability distributions, and a dozen other fields.</div>

<p class="l-text">Let us peek at why. For any base $a > 0$, the derivative of $a^x$ at $x = 0$ measures the slope of the exponential curve where it crosses the y-axis. A short calculation (which you will do properly in lesson 38 and again in the calculus track) gives:</p>

<div class="calc-formula"><div class="formula-label">DERIVATIVE OF $a^x$ AT THE ORIGIN</div><div class="formula-main">$$\\frac{d}{dx}\\,a^x \\bigg|_{x=0} \\;=\\; \\ln a$$</div><div class="formula-sub">The slope of $y = a^x$ at $x = 0$ is exactly $\\ln a$.</div></div>

<p class="l-text">When $a = 2$, the slope at the origin is $\\ln 2 \\approx 0.693$ &mdash; less than 1. When $a = 3$, the slope is $\\ln 3 \\approx 1.099$ &mdash; more than 1. Somewhere between 2 and 3 the slope must be exactly 1, and that magic base is $e$, since $\\ln e = 1$.</p>

<div class="calc-formula"><div class="formula-label">THE DEFINING PROPERTY OF $e^x$</div><div class="formula-main">$$\\frac{d}{dx}\\,e^x \\;=\\; e^x$$</div><div class="formula-sub">$e^x$ is the <em>unique</em> non-zero function (up to a multiplicative constant) that equals its own derivative. Everything else — population growth, radioactive decay, RC circuits, Newton's cooling, normal distribution — reduces eventually to this one identity.</div></div>

<div class="calc-graph"><div id="plot-l37-logs-bases-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $y = \\log_a x$ for three bases $a = 2$ (steepest), $a = e$ (middle), $a = 10$ (shallowest), on the range $0.1 \\leq x \\leq 10$. All three pass through $(1, 0)$. The smaller the base, the faster the curve climbs — because $\\log_2 x = \\ln x / \\ln 2$ is the natural log divided by a smaller number than $\\log_{10} x = \\ln x / \\ln 10$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y2=[];var ye=[];var y10=[];
for(var i=0;i<=400;i++){var x=0.1+(10-0.1)*i/400;xs.push(x);y2.push(Math.log(x)/Math.log(2));ye.push(Math.log(x));y10.push(Math.log(x)/Math.log(10));}
var t1={x:xs,y:y2,mode:'lines',name:'y = log₂ x',line:{color:'#3b82f6',width:2.6}};
var t2={x:xs,y:ye,mode:'lines',name:'y = ln x  (base e)',line:{color:'#10b981',width:2.6}};
var t3={x:xs,y:y10,mode:'lines',name:'y = log₁₀ x',line:{color:'#f59e0b',width:2.6}};
var t4={x:[1],y:[0],mode:'markers',name:'(1, 0) shared',marker:{color:'#ec4899',size:10}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#ebe6dc',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,10]},yaxis:{title:'logₐ x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-4,4]},margin:{t:30,r:30,b:55,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l37-logs-bases-en',[t1,t2,t3,t4],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Worked Examples &mdash; Change of Base &amp; Practical Computation</h2>

<div class="calc-example"><div class="example-label">EXAMPLE 1 &mdash; STRAIGHT CHANGE OF BASE</div><div class="example-body"><strong>Express $\\log_5 200$ in terms of $\\ln$ and evaluate.</strong><br><br>By change-of-base, $\\log_5 200 = \\dfrac{\\ln 200}{\\ln 5}$.<br><br>$\\ln 200 \\approx 5.2983$ and $\\ln 5 \\approx 1.6094$.<br><br>$\\log_5 200 \\approx 5.2983 / 1.6094 \\approx \\mathbf{3.292}$.<br><br>Sanity check: $5^3 = 125$ and $5^4 = 625$; the answer must lie between 3 and 4. It does.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 &mdash; CONVERTING $\\ln$ TO $\\log$</div><div class="example-body"><strong>If $\\ln x = 4.5$, what is $\\log x$?</strong><br><br>Use the change-of-base identity in reverse: $\\log x = \\dfrac{\\ln x}{\\ln 10} = \\dfrac{4.5}{2.3026} \\approx \\mathbf{1.954}$.<br><br>So $x \\approx 10^{1.954} \\approx 90$. Check: $\\ln 90 \\approx 4.499$. Tick.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 &mdash; CONVERTING $\\log$ TO $\\ln$</div><div class="example-body"><strong>If $\\log x = 2.7$, what is $\\ln x$?</strong><br><br>$\\ln x = \\ln 10 \\cdot \\log x \\approx 2.3026 \\cdot 2.7 \\approx \\mathbf{6.217}$.<br><br>The conversion factor $\\ln 10 \\approx 2.3026$ is worth memorising &mdash; it lets you switch between the two bases mentally.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 &mdash; EVALUATING $\\log_7 49$ MENTALLY</div><div class="example-body"><strong>Compute $\\log_7 49$ without a calculator.</strong><br><br>Since $49 = 7^2$, by the definition of a logarithm $\\log_7 49 = \\mathbf{2}$. No change-of-base needed &mdash; whenever the argument is a clean power of the base, read the exponent off directly.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 5 &mdash; CHANGE OF BASE FOR AN EXPONENTIAL EQUATION</div><div class="example-body"><strong>Solve $3^x = 50$.</strong><br><br>Take $\\ln$ of both sides: $x \\ln 3 = \\ln 50$, so $x = \\dfrac{\\ln 50}{\\ln 3}$.<br><br>But notice: $\\dfrac{\\ln 50}{\\ln 3} = \\log_3 50$. The solution of an exponential equation is exactly a logarithm in the base of the exponential.<br><br>Numerically: $x \\approx 3.9120 / 1.0986 \\approx \\mathbf{3.561}$.</div></div>

<h2 class="lesson-title">9. Classical Exercises</h2>

<p class="l-text">Try every problem yourself before reading the solution. Use a calculator for the numerical answers; the structure of each problem is what matters.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body"><strong>Compute $\\log_4 64$ without a calculator.</strong><br><br>$64 = 4^3$, so $\\log_4 64 = \\mathbf{3}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body"><strong>Compute $\\log_2 0.125$ without a calculator.</strong><br><br>$0.125 = \\dfrac{1}{8} = 2^{-3}$, so $\\log_2 0.125 = \\mathbf{-3}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body"><strong>Compute $\\log_6 200$ using change-of-base.</strong><br><br>$\\log_6 200 = \\dfrac{\\ln 200}{\\ln 6} \\approx \\dfrac{5.2983}{1.7918} \\approx \\mathbf{2.957}$.<br><br>Check: $6^3 = 216$, just above 200; so the answer is slightly below 3. Tick.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4</div><div class="example-body"><strong>How many digits does $5^{50}$ have?</strong><br><br>$\\log_{10}(5^{50}) = 50 \\log_{10} 5 \\approx 50 \\cdot 0.69897 = 34.9485$.<br><br>Floor 34, plus 1 = <strong>35 digits</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5</div><div class="example-body"><strong>Solve $\\ln x = 3$ for $x$.</strong><br><br>By definition, $\\ln x = 3 \\iff x = e^3$. Numerically $x \\approx \\mathbf{20.0855}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6</div><div class="example-body"><strong>If $\\log_a 2 = 0.4307$, compute $\\log_a 32$.</strong><br><br>$\\log_a 32 = \\log_a (2^5) = 5 \\log_a 2 = 5 \\cdot 0.4307 = \\mathbf{2.1535}$. The power rule of logarithms makes this immediate.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> In lesson 38 we will solve exponential and logarithmic equations &mdash; every technique we use will lean on the change-of-base formula from section 4, and on the value $\\ln 10 \\approx 2.303$ that lets us switch between $\\ln$ and $\\log$ at will. Make sure the two notations and the one conversion formula feel automatic before moving on.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\ln x = \\log_e x$ &mdash; natural logarithm, base $e \\approx 2.71828$</li>
<li>$\\log x = \\log_{10} x$ on a handheld calculator and in high-school texts &mdash; common logarithm, base 10</li>
<li>Notation varies by field: in computer science $\\log$ usually means base 2; in research mathematics it often means base $e$</li>
<li>Change of base: $\\log_a x = \\dfrac{\\log_b x}{\\log_b a}$ &mdash; one formula, three lines of proof, valid for any allowed bases</li>
<li>Practical form: $\\log_a x = \\dfrac{\\ln x}{\\ln a} = \\dfrac{\\log x}{\\log a}$ &mdash; compute any logarithm with just $\\ln$ or $\\log$</li>
<li>$e = \\lim_{n \\to \\infty}(1 + 1/n)^n = \\sum_{k=0}^{\\infty} 1/k!$ &mdash; two equivalent definitions, one slow, one fast</li>
<li>$\\dfrac{d}{dx} e^x = e^x$ is the unique self-derivative property &mdash; the single reason $e$ is the "natural" base</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Logaritmaların pek çok tabanı vardır, ama bunlardan ikisi her ders kitabına, her hesap makinesine ve her bilimsel makaleye hâkimdir.</strong> Biri <em>10 tabanı</em>'dır — sayma sistemimizin tabanı — ve her el hesap makinesindeki sade "log" tuşunun altında yaşar. Diğeri <em>e tabanı</em>'dır — 2,71828'e yakın irrasyonel bir sayı — ve "ln" diye etiketlenmiş tuşun altında yaşar. Bu ders bu iki tabanın neden özel olduğunu, herhangi iki taban arasında tek bir kısa formülle nasıl geçebileceğimizi ve neden doğal logaritmanın kalkülüsün ihtiyaç duyduğu yegâne logaritma olduğunu anlatıyor.</p>

<p class="l-text">Dersin sonunda "log" ve "ln" sembollerini tereddütsüz okuyacaksın, sadece $\\ln$ veya $\\log_{10}$ değerlerinden istediğin tabandaki $\\log_a x$'i hesaplayabileceksin, taban değiştirme formülünü sıfırdan türetebileceksin ve $e$ sayısına değerini veren limit tanımını anlayacaksın. Hiçbir kısmı kalkülüs gerektirmiyor — fakat tamamı kalkülüse uzanan köprü.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\ln x$'in $e$ tabanında, $\\log x$'in ise 10 tabanında logaritma anlamına geldiğini</li>
<li>Matematik, mühendislik, fizik ve bilgisayar bilimleri alanlarındaki notasyon konvansiyonlarını ayırt etmeyi</li>
<li>Taban değiştirme formülü $\\log_a x = \\dfrac{\\log_b x}{\\log_b a}$'yı söylemeyi ve kanıtlamayı</li>
<li>Hesap makinesindeki yalnızca $\\ln$ ya da $\\log$ tuşunu kullanarak herhangi bir tabandaki logaritmayı hesaplamayı</li>
<li>$e$ sayısını ya $\\lim_{n \\to \\infty}\\left(1 + \\tfrac{1}{n}\\right)^n$ limiti ya da sonsuz seri toplamı olarak tanımlamayı</li>
<li>$e^x$'in kendi türevine eşit olan tek üstel fonksiyon olduğunu ve bu yüzden $e$'nin neden "doğal" tabanı oluşturduğunu açıklamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Doğal Logaritma $\\ln x$</h2>

<div class="calc-highlight"><strong>Doğal logaritma, $e$ tabanındaki logaritmadır.</strong> $e \\approx 2{,}71828$ sayısı, tıpkı $\\pi$ gibi irrasyoneldir; ama kalkülüste, fizikte, olasılıkta ve ekonomide o kadar sık karşımıza çıkar ki matematikçiler ona kendi sembolünü ve kendi notasyonunu armağan etmiştir. $\\log_e x$ yerine — ki uzun ve hantal kalır — Latince <em>logarithmus naturalis</em>'in kısaltması olan $\\ln x$ yazılır.</div>

<div class="calc-formula"><div class="formula-label">DOĞAL LOGARİTMA TANIMI</div><div class="formula-main">$$\\ln x \\;=\\; \\log_e x \\qquad (x > 0)$$</div><div class="formula-sub">"$\\ln x$, $e$ sayısının $x$ değerini vermesi için yükseltilmesi gereken üstür." Tanım kümesi tüm logaritmalarda olduğu gibi $x > 0$'dır.</div></div>

<p class="l-text">Doğal logaritma, $\\log_a$ için bildiğin tüm özellikleri sağlar — çünkü o da bir logaritmadır, sadece tabanı seçilmiştir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\ln 1 = 0$</div><div class="card-body">Çünkü $e^0 = 1$. 1'in logaritması her tabanda sıfırdır.</div></div>
<div class="calc-card"><div class="card-title">$\\ln e = 1$</div><div class="card-body">Çünkü $e^1 = e$. Bir tabanın kendi logaritması her zaman 1'dir.</div></div>
<div class="calc-card"><div class="card-title">$\\ln(xy) = \\ln x + \\ln y$</div><div class="card-body">Çarpım kuralı &mdash; $\\log_a$ ile aynı.</div></div>
<div class="calc-card"><div class="card-title">$\\ln(x^n) = n \\ln x$</div><div class="card-body">Üs kuralı &mdash; $\\log_a$ ile aynı.</div></div>
</div>

<p class="l-text"><strong>Peki neden ayrı bir sembol?</strong> Çünkü kalkülüse adım attığın an, $e$, logaritması ve üstel fonksiyonu basit türevleri olan tek tabandır:</p>

<div class="calc-formula"><div class="formula-label">$e$ NEDEN KALKÜLÜSÜN DOĞAL TERCİHİ</div><div class="formula-main">$$\\frac{d}{dx} e^x \\;=\\; e^x \\qquad\\text{ve}\\qquad \\frac{d}{dx} \\ln x \\;=\\; \\frac{1}{x}$$</div><div class="formula-sub">Hiçbir başka taban bu kadar temiz türevler vermez. Diğer her üstel, çirkin bir $\\ln a$ çarpanı getirir.</div></div>

<p class="l-text">Sağ taraftaki özdeşliğin ispatını ileride kalkülüste göreceksin. Şimdilik mesajı içselleştir: <em>doğal logaritma, türevi mümkün olan en basit fonksiyon — yani $1/x$ — olan logaritmadır.</em> $\\ln$'in özel statüsünü hak etmesinin tek nedeni budur.</p>

<div class="think-box"><div class="think-label">HIZLI ZİHİNSEL ÇIPA</div><div class="think-body">$\\ln e = 1$, $\\ln e^2 = 2$, $\\ln e^3 = 3$ ve genel olarak $\\ln e^n = n$. $e \\approx 2{,}718$ olduğundan $\\ln 2{,}718 \\approx 1$, $\\ln 7{,}389 \\approx 2$, $\\ln 20{,}09 \\approx 3$ olur. $\\ln 2 \\approx 0{,}693$ ve $\\ln 10 \\approx 2{,}303$ değerlerini ezberle &mdash; bu ikili neredeyse her doğal logaritmayı kafadan tahmin etmeni sağlar.</div></div>

<h2 class="lesson-title">2. Bayağı Logaritma $\\log x$</h2>

<div class="calc-highlight"><strong>Bayağı logaritma, 10 tabanındaki logaritmadır.</strong> Ondalık sistem 10 tabanlı olduğu için bu logaritmanın doğrudan sezgisel bir anlamı vardır: $\\log_{10} x$, kabaca $x$'in basamak sayısını verir. El hesap makineleri ve mühendislik tabloları tarihsel olarak yalnızca 10 tabanlı logaritma içerdiğinden bu tabana "bayağı" (Türkçede "yaygın, sıradan" anlamında, İngilizce "common") adı verilmiştir.</div>

<div class="calc-formula"><div class="formula-label">BAYAĞI LOGARİTMA TANIMI</div><div class="formula-main">$$\\log x \\;=\\; \\log_{10} x \\qquad (x > 0)$$</div><div class="formula-sub">Lise matematiğinde ve her el hesap makinesinde, tabanı yazılmamış "log" sembolü 10 tabanı demektir. Bu, uymak zorunda olduğun bir konvansiyondur.</div></div>

<p class="l-text">Ezberlemen gereken birkaç değer:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$\\log_{10} x$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Neden</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">0</td><td style="padding:0.5rem 0.8rem">$10^0 = 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">10</td><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">$10^1 = 10$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">100</td><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">$10^2 = 100$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1000</td><td style="padding:0.5rem 0.8rem">3</td><td style="padding:0.5rem 0.8rem">$10^3 = 1000$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">0,1</td><td style="padding:0.5rem 0.8rem">&minus;1</td><td style="padding:0.5rem 0.8rem">$10^{-1} = 0{,}1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">0,01</td><td style="padding:0.5rem 0.8rem">&minus;2</td><td style="padding:0.5rem 0.8rem">$10^{-2} = 0{,}01$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$\\sqrt{10}$</td><td style="padding:0.5rem 0.8rem">$\\tfrac{1}{2}$</td><td style="padding:0.5rem 0.8rem">$10^{1/2} = \\sqrt{10}$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>"Basamak sayısı" kuralı.</strong> $d$ basamaklı bir pozitif tam sayı $10^{d-1}$ ile $10^d$ arasındadır. Yani bayağı logaritması $d-1$ ile $d$ arasındadır. Başka bir ifadeyle:</p>

<div class="calc-formula"><div class="formula-label">PRATİK TAHMİN</div><div class="formula-main">$$\\lfloor \\log_{10} N \\rfloor + 1 \\;=\\; N \\text{ pozitif tam sayısının basamak sayısı}$$</div><div class="formula-sub">Örnek: $N = 7\\,318$ için $\\log_{10} 7318 \\approx 3{,}86$, tam kısmı 3, eklediğimiz 1 ile 4 &mdash; ve gerçekten 7318'in 4 basamağı var.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>$2^{100}$ sayısının kaç basamağı vardır?</strong><br><br>10 tabanında logaritma alalım: $\\log_{10}(2^{100}) = 100 \\cdot \\log_{10} 2 \\approx 100 \\cdot 0{,}30103 = 30{,}103$.<br><br>Tam kısmı 30, eklediğimiz 1 ile 31. Yani $2^{100}$ sayısının <strong>31 basamağı</strong> vardır. (Karşılaştırma için $2^{100} = 1\\,267\\,650\\,600\\,228\\,229\\,401\\,496\\,703\\,205\\,376$.)</div></div>

<h2 class="lesson-title">3. Notasyon: "$\\log$", "$\\ln$", "$\\lg$"</h2>

<div class="calc-highlight"><strong>Notasyon bir mayın tarlasıdır.</strong> Farklı disiplinler "$\\log$" sembolünü farklı tabanlar için kullanır. Daima bağlama bakman gerekir. Aşağıdaki konvansiyonlar en yaygın olanlarıdır; bunlardan sapmak kitaplarda ve yazılım kütüphanelerinde sonsuz karışıklık kaynağıdır.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Notasyon</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Taban</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Kullanan alan</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\ln x$</td><td style="padding:0.5rem 0.8rem">$e$</td><td style="padding:0.5rem 0.8rem">Matematik, kalkülüs, fizik, mühendislik, istatistik</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\log x$ (el hesap makinesi)</td><td style="padding:0.5rem 0.8rem">10</td><td style="padding:0.5rem 0.8rem">Lise matematiği, kimya (pH), akustik (desibel), sismoloji (Richter)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\log x$ (akademik matematik)</td><td style="padding:0.5rem 0.8rem">$e$</td><td style="padding:0.5rem 0.8rem">Sayılar teorisi, kompleks analiz &mdash; "$\\log$" tek başına genellikle doğal logaritmadır</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\log x$ (bilgisayar bilimleri)</td><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">Karmaşıklık analizi &mdash; "log" genellikle 2 tabanı (bazen $\\log_2$ veya $\\lg$ yazılır)</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$\\lg x$</td><td style="padding:0.5rem 0.8rem">2 (veya 10)</td><td style="padding:0.5rem 0.8rem">Avrupa geleneği: BS'de 2 tabanı, eski Avrupa matematik metinlerinde 10 tabanı</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Türk lisesinde kural</strong> (ve bundan sonra her sayfada izleyeceğimiz kural): tabansız yazılmış "$\\log x$" $\\log_{10} x$ demektir; "$\\ln x$" her zaman $\\log_e x$ anlamındadır. Tabanı alt indis olarak açıkça yazmadığımız sürece "$\\log$" sembolünü asla 10'dan başka bir taban için kullanmayacağız.</p>

<div class="think-box"><div class="think-label">UNUTULMAMASI GEREKEN BİR UYARI</div><div class="think-body">Bir araştırma makalesi, bir mühendislik el kitabı veya bir bilimsel yazılım kılavuzu okurken yazarın "$\\log$" için hangi tabanı kullandığını mutlaka kontrol et. Pek çok bilimsel hesaplama kütüphanesinde "log" adındaki fonksiyon doğal logaritmadır ($e$ tabanı); 10 tabanı ise ayrı bir "log10" fonksiyonudur. El hesap makinesinin tam tersi konvansiyon! Bir logaritmanın tabanını yanlış okumak, cevabı 2,303 çarpan ya da $1/0{,}434$ çarpan kadar saptırabilir &mdash; ikisi de küçük değil.</div></div>

<h2 class="lesson-title">4. Taban Değiştirme Formülü</h2>

<div class="calc-highlight"><strong>Her logaritma istenen herhangi bir tabana çevrilebilir.</strong> Taban değiştirme formülü bu dersin en kullanışlı özdeşliğidir: $\\log_a x$'i, sana uygun gelen herhangi bir $b$ tabanındaki logaritmalar cinsinden ifade etmeni sağlar &mdash; genellikle teori için $b = e$, el hesabı için $b = 10$.</div>

<div class="calc-formula"><div class="formula-label">TABAN DEĞİŞTİRME FORMÜLÜ</div><div class="formula-main">$$\\log_a x \\;=\\; \\frac{\\log_b x}{\\log_b a} \\qquad (a, b > 0;\\;\\; a, b \\neq 1;\\;\\; x > 0)$$</div><div class="formula-sub">Bir logaritmayı $a$ tabanından $b$ tabanına çevirmek için $\\log_b a$'ya bölmek yeterli.</div></div>

<p class="l-text"><strong>Kanıt.</strong> $y = \\log_a x$ olsun. Logaritmanın tanımı gereği bu, $a^y = x$ demektir. Şimdi bu eşitliğin her iki tarafına $\\log_b$ uygulayalım:</p>

<div style="background:rgba(255,255,255,0.03);border-left:3px solid #3b82f6;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 6px 6px 0;font-size:0.95rem">
$\\log_b(a^y) = \\log_b x$<br><br>
$y \\cdot \\log_b a = \\log_b x \\qquad$ ($\\log_b$ üs kuralı)<br><br>
$y = \\dfrac{\\log_b x}{\\log_b a} \\qquad$ ($a \\neq 1$ olduğundan $\\log_b a \\neq 0$, bölebiliriz)<br><br>
$y = \\log_a x$'i geri yerine koyarsak formülü elde ederiz. <strong>İspat tamam.</strong>
</div>

<p class="l-text">Kanıt yalnızca üç satır. Formül yalnızca tek bir bölme. Buna rağmen tek bir depolanmış değerler kümesinden &mdash; tarihsel olarak 10 tabanı, bugün $e$ tabanı &mdash; her tabandaki logaritmayı hesaplamana yetiyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$b = e$ seçilir</div><div class="card-body">$\\log_a x = \\dfrac{\\ln x}{\\ln a}$. Her kalkülüs kitabının kullandığı versiyon.</div></div>
<div class="calc-card"><div class="card-title">$b = 10$ seçilir</div><div class="card-body">$\\log_a x = \\dfrac{\\log x}{\\log a}$. $\\ln$ tuşu olmayan eski tip hesap makinesine uygun versiyon.</div></div>
<div class="calc-card"><div class="card-title">Özel durum: $x = b$</div><div class="card-body">$\\log_a b = \\dfrac{\\log_b b}{\\log_b a} = \\dfrac{1}{\\log_b a}$. Çarpımsal ters özdeşliği.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>$\\log_2 7$'yi hesapla.</strong><br><br>$b = 10$ ile taban değiştirme: $\\log_2 7 = \\dfrac{\\log 7}{\\log 2} \\approx \\dfrac{0{,}8451}{0{,}3010} \\approx \\mathbf{2{,}807}$.<br><br>$b = e$ ile kontrol: $\\log_2 7 = \\dfrac{\\ln 7}{\\ln 2} \\approx \\dfrac{1{,}9459}{0{,}6931} \\approx 2{,}807$. İki hesap mutlaka örtüşmeli &mdash; örtüşüyor.</div></div>

<h2 class="lesson-title">5. $\\ln$ Cinsinden $\\log_a x$ Hesabı</h2>

<div class="calc-highlight"><strong>Neredeyse her bilimsel hesap makinesinde hem "ln" hem "log" tuşu vardır.</strong> Ama "$\\log_a$" tuşu yoktur &mdash; keyfi taban için ayrı bir düğme yok. Taban değiştirme formülü tam olarak ne yapacağını söylüyor.</div>

<div class="calc-formula"><div class="formula-label">İKİ PRATİK FORMA</div><div class="formula-main">$$\\log_a x \\;=\\; \\frac{\\ln x}{\\ln a} \\;=\\; \\frac{\\log x}{\\log a}$$</div><div class="formula-sub">İki tuş çiftinden hangisini kullansan, oran aynı sayıyı verir.</div></div>

<p class="l-text">Hesap makinesinde işlem adımları:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1</div><div class="card-body">$x$'i yaz, $\\ln$ (veya $\\log$) tuşuna bas. Değeri oku.</div></div>
<div class="calc-card"><div class="card-title">Adım 2</div><div class="card-body">$a$'yı yaz, aynı tuşa bas. Değeri oku.</div></div>
<div class="calc-card"><div class="card-title">Adım 3</div><div class="card-body">Böl. Bölüm $\\log_a x$'tir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>$\\log_3 50$ değerini hesapla.</strong><br><br>$\\log_3 50 = \\dfrac{\\ln 50}{\\ln 3}$.<br><br>$\\ln 50 \\approx 3{,}9120$ ve $\\ln 3 \\approx 1{,}0986$.<br><br>Yani $\\log_3 50 \\approx 3{,}9120 / 1{,}0986 \\approx \\mathbf{3{,}561}$.<br><br>Tutarlılık kontrolü: $3^{3{,}561} = e^{3{,}561 \\cdot \\ln 3} = e^{3{,}561 \\cdot 1{,}0986} \\approx e^{3{,}912} \\approx 50$. Kontrol tutuyor.</div></div>

<div class="calc-graph"><div id="plot-l37-ln-vs-log-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik neyi gösteriyor:</strong> aynı eksende $y = \\ln x$ ve $y = \\log_{10} x$, $0{,}05 \\leq x \\leq 10$ aralığında. İki eğri de $(1, 0)$ noktasından geçer &mdash; her tabanda 1'in logaritması 0'dır. İkisi de artandır ve $x \\to 0^+$ olurken $-\\infty$'a giderler. Ama $\\ln$ daha hızlı büyür çünkü $e < 10$ &mdash; taban küçüldükçe eğri dikleşir. Herhangi bir $x$'te iki eğri arasındaki düşey fark tam olarak $(\\ln 10 - 1)\\cdot \\log_{10} x \\approx 1{,}303 \\cdot \\log_{10} x$'tir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var ynL=[];var ylL=[];
for(var i=0;i<=400;i++){var x=0.05+(10-0.05)*i/400;xL.push(x);ynL.push(Math.log(x));ylL.push(Math.log(x)/Math.log(10));}
var t1={x:xL,y:ynL,mode:'lines',name:'y = ln x',line:{color:'#3b82f6',width:2.6}};
var t2={x:xL,y:ylL,mode:'lines',name:'y = log₁₀ x',line:{color:'#f59e0b',width:2.6}};
var t3={x:[1],y:[0],mode:'markers',name:'(1, 0)',marker:{color:'#ec4899',size:10,line:{color:'#ebe6dc',width:1.5}}};
var t4={x:[Math.E],y:[1],mode:'markers',name:'(e, 1) ln üzerinde',marker:{color:'#3b82f6',size:9,symbol:'circle-open',line:{color:'#3b82f6',width:2}}};
var t5={x:[10],y:[1],mode:'markers',name:'(10, 1) log üzerinde',marker:{color:'#f59e0b',size:9,symbol:'circle-open',line:{color:'#f59e0b',width:2}}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#ebe6dc',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,10]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3.2,2.6]},margin:{t:30,r:30,b:55,l:55},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l37-ln-vs-log-tr',[t1,t2,t3,t4,t5],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. $e$ Sayısının Tanımı</h2>

<div class="calc-highlight"><strong>$e$ icat edilmez; keşfedilir.</strong> Matematikte ilk bakışta birbirleriyle alakasız görünen pek çok süreç &mdash; bileşik faiz, düzensiz permütasyon sayısı, bir diferansiyel denklemin kararlı durumu &mdash; aynı irrasyonel sayıyı $\\approx 2{,}71828$ ortaya çıkarır. En temiz tanım bileşik faiz hikâyesinden gelir.</div>

<p class="l-text"><strong>Bileşik faiz hikâyesi.</strong> Yıllık %100 faizle bir birim parayı bir yıl yatır. Faiz yılda bir kez yıl sonunda ödenirse bakiye $1 + 1 = 2$ olur. İki kez ödenirse (altı ayda %50, yıl sonunda %50), bakiye $\\left(1 + \\tfrac{1}{2}\\right)^2 = 2{,}25$ olur. Faiz yılda $n$ kez ödenirse (her taksit $1/n$), bakiye $\\left(1 + \\tfrac{1}{n}\\right)^n$ olur. $n$ büyüdükçe bakiye sürekli yukarı kayar ama sonsuza patlamaz &mdash; sabit bir limite yakınsar.</p>

<div class="calc-formula"><div class="formula-label">$e$ SAYISININ LİMİT TANIMI</div><div class="formula-main">$$e \\;=\\; \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n \\;\\approx\\; 2{,}71828\\,18284\\,59045\\,...$$</div><div class="formula-sub">1 birimlik, yıllık %100, bir yıllık yatırımın sürekli bileşiklenmiş değeri.</div></div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$n$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$(1 + 1/n)^n$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$e$'ye ne kadar yakın?</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">2,000000</td><td style="padding:0.5rem 0.8rem">0,718 altında</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">2,250000</td><td style="padding:0.5rem 0.8rem">0,468 altında</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">10</td><td style="padding:0.5rem 0.8rem">2,593742</td><td style="padding:0.5rem 0.8rem">0,125 altında</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">100</td><td style="padding:0.5rem 0.8rem">2,704814</td><td style="padding:0.5rem 0.8rem">0,013 altında</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1000</td><td style="padding:0.5rem 0.8rem">2,716924</td><td style="padding:0.5rem 0.8rem">0,0014 altında</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">10000</td><td style="padding:0.5rem 0.8rem">2,718146</td><td style="padding:0.5rem 0.8rem">0,00014 altında</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$\\infty$</td><td style="padding:0.5rem 0.8rem">$e \\approx 2{,}718282$</td><td style="padding:0.5rem 0.8rem">tam</td></tr>
</tbody></table>
</div>

<p class="l-text">Yakınsama yavaştır &mdash; $e$'nin her ek doğru basamağı için $n$'yi on katına çıkarmak gerekiyor. (Bu "doğrusal" yakınsama işaretidir; daha hızlı yöntemler vardır.)</p>

<div class="calc-formula"><div class="formula-label">$e$ SAYISININ SERİ TANIMI</div><div class="formula-main">$$e \\;=\\; \\sum_{k=0}^{\\infty} \\frac{1}{k!} \\;=\\; 1 + 1 + \\frac{1}{2!} + \\frac{1}{3!} + \\frac{1}{4!} + \\cdots$$</div><div class="formula-sub">$e$'yi hesaplamak için çok daha hızlı bir yol: her yeni terim, yaklaşık $k$ çarpanı kadar küçülür, dolayısıyla doğruluk birkaç terimde bir ikiye katlanır.</div></div>

<p class="l-text">Serinin ilk sekiz teriminin toplamı 2,7182788... &mdash; dört ondalık basamağa kadar zaten doğru. İlk on iki terim toplandığında dokuz ondalık basamağa kadar doğru. Bilgisayarların $e$'yi gerçekten nasıl hesapladığı bileşik faiz limiti değil, bu seridir.</p>

<div class="calc-graph"><div id="plot-l37-e-converge-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik neyi gösteriyor:</strong> $n = 1, 2, \\ldots, 200$ için $a_n = (1 + 1/n)^n$ dizisi. Monotonik olarak $e \\approx 2{,}71828$ değerine (kesikli yatay çizgi) yakınsıyor. $n = 200$'de bile değer henüz sadece 2,7115 &mdash; yakınsama gerçekten yavaş.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[];var vs=[];for(var n=1;n<=200;n++){ns.push(n);vs.push(Math.pow(1+1/n,n));}
var t1={x:ns,y:vs,mode:'lines+markers',name:'a_n = (1 + 1/n)^n',line:{color:'#3b82f6',width:2.4},marker:{size:4,color:'#3b82f6'}};
var t2={x:[0,210],y:[Math.E,Math.E],mode:'lines',name:'limit = e ≈ 2,71828',line:{color:'#f59e0b',width:2,dash:'dash'}};
var t3={x:[1,2,10,100],y:[2,2.25,Math.pow(1.1,10),Math.pow(1.01,100)],mode:'markers',name:'örnek noktalar',marker:{color:'#ec4899',size:9,symbol:'diamond'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#ebe6dc',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,210]},yaxis:{title:'(1 + 1/n)^n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[1.9,2.8]},margin:{t:30,r:30,b:55,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l37-e-converge-tr',[t1,t2,t3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. $e$ Sayısı Neden "Doğal"?</h2>

<div class="calc-highlight"><strong>Tüm reel sayılar içinde $e$, her şeyden önce tek bir nedenle özeldir: $f(x) = e^x$ fonksiyonu kendi türevine eşittir.</strong> Hiçbir başka $a^x$ üstel fonksiyonu bu özelliğe sahip değildir. Kalkülüste kanıtlanan bu tek olgu, $e$'yi üsteller, logaritmalar, diferansiyel denklemler, olasılık dağılımları ve düzinelerce diğer alan için doğal taban yapar.</div>

<p class="l-text">Şimdi sebebine bir göz atalım. Herhangi bir $a > 0$ tabanı için $a^x$'in $x = 0$'daki türevi, üstel eğrinin y-eksenini kestiği yerdeki eğimini ölçer. Kısa bir hesap (Ders 38'de ve ardından kalkülüs serisinde düzgün şekilde yapacaksın) şunu verir:</p>

<div class="calc-formula"><div class="formula-label">$a^x$'İN BAŞLANGIÇTAKİ TÜREVİ</div><div class="formula-main">$$\\frac{d}{dx}\\,a^x \\bigg|_{x=0} \\;=\\; \\ln a$$</div><div class="formula-sub">$y = a^x$'in $x = 0$'daki eğimi tam olarak $\\ln a$'dır.</div></div>

<p class="l-text">$a = 2$ iken başlangıçtaki eğim $\\ln 2 \\approx 0{,}693$ &mdash; 1'den küçük. $a = 3$ iken eğim $\\ln 3 \\approx 1{,}099$ &mdash; 1'den büyük. Demek ki 2 ile 3 arasında bir yerde eğimin tam olarak 1 olduğu bir taban vardır; bu büyülü taban $e$'dir, çünkü $\\ln e = 1$.</p>

<div class="calc-formula"><div class="formula-label">$e^x$'İN TANIMLAYICI ÖZELLİĞİ</div><div class="formula-main">$$\\frac{d}{dx}\\,e^x \\;=\\; e^x$$</div><div class="formula-sub">$e^x$, kendi türevine eşit olan <em>tek</em> (bir çarpan sabiti dışında) sıfırdan farklı fonksiyondur. Geri kalan her şey &mdash; nüfus büyümesi, radyoaktif bozunma, RC devresi, Newton soğuması, normal dağılım &mdash; sonunda bu tek özdeşliğe indirgenir.</div></div>

<div class="calc-graph"><div id="plot-l37-logs-bases-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik neyi gösteriyor:</strong> üç farklı tabanda $y = \\log_a x$ &mdash; $a = 2$ (en dik), $a = e$ (orta), $a = 10$ (en yatık) &mdash; $0{,}1 \\leq x \\leq 10$ aralığında. Hepsi $(1, 0)$ noktasından geçer. Taban küçüldükçe eğri daha hızlı yükselir &mdash; çünkü $\\log_2 x = \\ln x / \\ln 2$, $\\log_{10} x = \\ln x / \\ln 10$'a kıyasla doğal logaritmayı daha küçük bir sayıya böler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y2=[];var ye=[];var y10=[];
for(var i=0;i<=400;i++){var x=0.1+(10-0.1)*i/400;xs.push(x);y2.push(Math.log(x)/Math.log(2));ye.push(Math.log(x));y10.push(Math.log(x)/Math.log(10));}
var t1={x:xs,y:y2,mode:'lines',name:'y = log₂ x',line:{color:'#3b82f6',width:2.6}};
var t2={x:xs,y:ye,mode:'lines',name:'y = ln x  (e tabanı)',line:{color:'#10b981',width:2.6}};
var t3={x:xs,y:y10,mode:'lines',name:'y = log₁₀ x',line:{color:'#f59e0b',width:2.6}};
var t4={x:[1],y:[0],mode:'markers',name:'ortak (1, 0)',marker:{color:'#ec4899',size:10}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#ebe6dc',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,10]},yaxis:{title:'logₐ x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-4,4]},margin:{t:30,r:30,b:55,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l37-logs-bases-tr',[t1,t2,t3,t4],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Çözümlü Örnekler &mdash; Taban Değiştirme ve Hesap</h2>

<div class="calc-example"><div class="example-label">ÖRNEK 1 &mdash; DOĞRUDAN TABAN DEĞİŞTİRME</div><div class="example-body"><strong>$\\log_5 200$'ü $\\ln$ cinsinden ifade et ve hesapla.</strong><br><br>Taban değiştirme ile $\\log_5 200 = \\dfrac{\\ln 200}{\\ln 5}$.<br><br>$\\ln 200 \\approx 5{,}2983$ ve $\\ln 5 \\approx 1{,}6094$.<br><br>$\\log_5 200 \\approx 5{,}2983 / 1{,}6094 \\approx \\mathbf{3{,}292}$.<br><br>Tutarlılık kontrolü: $5^3 = 125$ ve $5^4 = 625$; cevap 3 ile 4 arasında olmalı. Öyle.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 &mdash; $\\ln$'DEN $\\log$'A ÇEVİRME</div><div class="example-body"><strong>$\\ln x = 4{,}5$ ise $\\log x$ nedir?</strong><br><br>Taban değiştirme özdeşliğini ters yönde kullan: $\\log x = \\dfrac{\\ln x}{\\ln 10} = \\dfrac{4{,}5}{2{,}3026} \\approx \\mathbf{1{,}954}$.<br><br>Yani $x \\approx 10^{1{,}954} \\approx 90$. Kontrol: $\\ln 90 \\approx 4{,}499$. Tamam.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 &mdash; $\\log$'DAN $\\ln$'E ÇEVİRME</div><div class="example-body"><strong>$\\log x = 2{,}7$ ise $\\ln x$ nedir?</strong><br><br>$\\ln x = \\ln 10 \\cdot \\log x \\approx 2{,}3026 \\cdot 2{,}7 \\approx \\mathbf{6{,}217}$.<br><br>$\\ln 10 \\approx 2{,}3026$ dönüşüm çarpanını ezberlemek değer &mdash; iki taban arasında kafadan geçiş yapmanı sağlar.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 &mdash; $\\log_7 49$'U KAFADAN HESAPLAMA</div><div class="example-body"><strong>$\\log_7 49$'u hesap makinesi kullanmadan hesapla.</strong><br><br>$49 = 7^2$ olduğundan logaritmanın tanımı gereği $\\log_7 49 = \\mathbf{2}$. Taban değiştirmeye gerek yok &mdash; argüman, tabanın temiz bir kuvvetiyse üssü doğrudan oku.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 5 &mdash; ÜSTEL DENKLEM İÇİN TABAN DEĞİŞTİRME</div><div class="example-body"><strong>$3^x = 50$ denklemini çöz.</strong><br><br>İki tarafın $\\ln$'ini al: $x \\ln 3 = \\ln 50$, dolayısıyla $x = \\dfrac{\\ln 50}{\\ln 3}$.<br><br>Ama dikkat: $\\dfrac{\\ln 50}{\\ln 3} = \\log_3 50$. Bir üstel denklemin çözümü tam olarak üstelin tabanındaki logaritmadır.<br><br>Sayısal olarak: $x \\approx 3{,}9120 / 1{,}0986 \\approx \\mathbf{3{,}561}$.</div></div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>

<p class="l-text">Her problemi çözümü okumadan önce kendin dene. Sayısal cevaplar için hesap makinesi kullanabilirsin; önemli olan her problemin yapısı.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body"><strong>$\\log_4 64$ değerini hesap makinesi kullanmadan bul.</strong><br><br>$64 = 4^3$, dolayısıyla $\\log_4 64 = \\mathbf{3}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body"><strong>$\\log_2 0{,}125$ değerini hesap makinesi kullanmadan bul.</strong><br><br>$0{,}125 = \\dfrac{1}{8} = 2^{-3}$, dolayısıyla $\\log_2 0{,}125 = \\mathbf{-3}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body"><strong>$\\log_6 200$ değerini taban değiştirme ile hesapla.</strong><br><br>$\\log_6 200 = \\dfrac{\\ln 200}{\\ln 6} \\approx \\dfrac{5{,}2983}{1{,}7918} \\approx \\mathbf{2{,}957}$.<br><br>Kontrol: $6^3 = 216$, 200'ün hemen üstünde; demek ki cevap 3'ün biraz altında olmalı. Tamam.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4</div><div class="example-body"><strong>$5^{50}$ sayısının kaç basamağı vardır?</strong><br><br>$\\log_{10}(5^{50}) = 50 \\log_{10} 5 \\approx 50 \\cdot 0{,}69897 = 34{,}9485$.<br><br>Tam kısmı 34, eklenen 1 = <strong>35 basamak</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5</div><div class="example-body"><strong>$\\ln x = 3$ denklemini $x$ için çöz.</strong><br><br>Tanım gereği $\\ln x = 3 \\iff x = e^3$. Sayısal olarak $x \\approx \\mathbf{20{,}0855}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6</div><div class="example-body"><strong>$\\log_a 2 = 0{,}4307$ veriliyor. $\\log_a 32$ değerini hesapla.</strong><br><br>$\\log_a 32 = \\log_a (2^5) = 5 \\log_a 2 = 5 \\cdot 0{,}4307 = \\mathbf{2{,}1535}$. Logaritmanın üs kuralı bunu anında verir.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Ders 38'de üstel ve logaritmik denklemleri çözeceğiz &mdash; kullandığımız her teknik bölüm 4'teki taban değiştirme formülüne ve $\\ln$ ile $\\log$ arasında anında geçiş yapmamızı sağlayan $\\ln 10 \\approx 2{,}303$ değerine dayanıyor olacak. Devam etmeden önce bu iki notasyonun ve tek dönüşüm formülünün otomatik gelmesini sağla.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\ln x = \\log_e x$ &mdash; doğal logaritma, $e \\approx 2{,}71828$ tabanı</li>
<li>El hesap makinesinde ve lise metinlerinde $\\log x = \\log_{10} x$ &mdash; bayağı logaritma, 10 tabanı</li>
<li>Notasyon disipline göre değişir: bilgisayar bilimlerinde $\\log$ genellikle 2 tabanı, akademik matematikte sıklıkla $e$ tabanı demektir</li>
<li>Taban değiştirme: $\\log_a x = \\dfrac{\\log_b x}{\\log_b a}$ &mdash; tek formül, üç satırlık kanıt, izin verilen her tabanda geçerli</li>
<li>Pratik biçim: $\\log_a x = \\dfrac{\\ln x}{\\ln a} = \\dfrac{\\log x}{\\log a}$ &mdash; sadece $\\ln$ ya da $\\log$ tuşuyla her logaritmayı hesapla</li>
<li>$e = \\lim_{n \\to \\infty}(1 + 1/n)^n = \\sum_{k=0}^{\\infty} 1/k!$ &mdash; iki denk tanım, biri yavaş biri hızlı</li>
<li>$\\dfrac{d}{dx} e^x = e^x$ &mdash; kendi türevine eşitlik tek bu fonksiyona ait, $e$'yi "doğal" taban yapan tek özellik</li>
</ul>
</div>`
};
