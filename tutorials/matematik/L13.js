window.LISE_MAT_L13 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Some limits cannot be read off by simply plugging in the value.</strong> When you try to evaluate $\\lim_{x \\to 0} \\frac{\\sin x}{x}$ by direct substitution, you get $\\frac{0}{0}$ — a symbol that, on its own, has no value. Does that mean the limit does not exist? Not at all. The numerator and the denominator are both shrinking to zero, and the limit depends on <em>how fast</em> each is shrinking compared to the other. The result, as we shall see, is exactly $1$. Calculus calls a situation like this an <em>indeterminate form</em>: a tug-of-war between two opposing tendencies whose winner can only be settled by closer analysis.</p>

<p class="l-text">This lesson introduces the seven classical indeterminate forms and presents the single most powerful tool for resolving them — <strong>L'Hôpital's rule</strong>. Discovered by Johann Bernoulli in 1694 but published a year later in the textbook of the Marquis de l'Hôpital, the rule says something almost magical: when a limit has the form $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$, you can replace the numerator and the denominator by their <em>derivatives</em> and the limit is unchanged. A problem that seemed impossible to evaluate becomes a single differentiation away.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recognise the seven indeterminate forms ($0/0$, $\\infty/\\infty$, $0 \\cdot \\infty$, $\\infty - \\infty$, $1^\\infty$, $0^0$, $\\infty^0$) and know why each one is genuinely undetermined</li>
<li>State L'Hôpital's rule precisely and check its three preconditions before applying it</li>
<li>Understand the intuitive proof of L'Hôpital from local linear approximations</li>
<li>Resolve $0/0$ and $\\infty/\\infty$ limits by repeated differentiation when the first pass still gives an indeterminate form</li>
<li>Convert other indeterminate forms ($0 \\cdot \\infty$, $\\infty - \\infty$, $1^\\infty$, $0^0$, $\\infty^0$) into $0/0$ or $\\infty/\\infty$ by algebraic manipulation or logarithms</li>
<li>Spot the classical traps: when L'Hôpital does not apply, when it loops without converging, and when a faster method (algebra, factoring, conjugate) is preferable</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is an Indeterminate Form?</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> imagine two cars approaching a finish line. Both slow down to zero speed exactly at the line. Which car wins? Saying "they both end at zero" tells you nothing about the race — you need to know how each car decelerated. An indeterminate form is exactly the same situation in mathematics: two quantities both tending to zero (or both to infinity), and the answer depends on <em>how</em> they get there, not just <em>where</em> they end up.</div>

<p class="l-text">When you compute a limit like $\\lim_{x \\to a} \\frac{f(x)}{g(x)}$, the safest first move is direct substitution. If $g(a) \\neq 0$, the result is just $\\frac{f(a)}{g(a)}$ and you are done. But suppose direct substitution gives one of the following symbols:</p>

<div class="calc-formula"><div class="formula-label">THE INDETERMINATE SYMBOLS</div><div class="formula-main">$$\\frac{0}{0}, \\quad \\frac{\\infty}{\\infty}, \\quad 0 \\cdot \\infty, \\quad \\infty - \\infty, \\quad 1^{\\infty}, \\quad 0^0, \\quad \\infty^0$$</div><div class="formula-sub">Each of these is <em>not</em> a number. It is shorthand for "two tendencies are pulling against each other and the answer is undetermined without further work."</div></div>

<p class="l-text"><strong>The key insight:</strong> the limit itself almost always exists (and often has a perfectly clean value). What fails is the <em>shortcut</em> of plugging in. The numerator and denominator each individually tend to a problematic value, but their <em>ratio</em>, computed carefully, can be any real number, $+\\infty$, $-\\infty$, or even nonexistent. This is precisely why we call the symbol <em>indeterminate</em> — it does not determine the answer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Determinate cases</div><div class="card-body">If direct substitution gives a finite number, $+\\infty$, $-\\infty$, $\\frac{c}{0^+} = \\pm\\infty$, $c \\cdot 0 = 0$ with $c$ finite — the answer is settled. No further work needed.</div></div>
<div class="calc-card"><div class="card-title">Indeterminate cases</div><div class="card-body">If direct substitution gives one of the seven symbols above, the answer is not yet settled. You must rewrite the expression algebraically or use a tool like L'Hôpital's rule.</div></div>
<div class="calc-card"><div class="card-title">The goal</div><div class="card-body">Transform the indeterminate expression into a determinate one. Either factor, simplify, use a conjugate, take logarithms, or differentiate — whatever resolves the tug-of-war.</div></div>
</div>

<div class="calc-example"><div class="example-label">A FIRST EXAMPLE OF $0/0$</div><div class="example-body">Compute $\\lim_{x \\to 2} \\dfrac{x^2 - 4}{x - 2}$.<br><br>Direct substitution: $\\dfrac{4 - 4}{2 - 2} = \\dfrac{0}{0}$ — indeterminate.<br><br>Factor: $\\dfrac{x^2 - 4}{x - 2} = \\dfrac{(x-2)(x+2)}{x - 2} = x + 2$ for $x \\neq 2$.<br><br>Now substitute: $\\lim_{x \\to 2}(x + 2) = 4$. The limit exists and equals $\\mathbf{4}$, even though the unprocessed expression looked undefined.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Try three quick experiments. (i) $\\lim_{x \\to 0} \\frac{x}{x} = 1$. (ii) $\\lim_{x \\to 0} \\frac{x^2}{x} = 0$. (iii) $\\lim_{x \\to 0} \\frac{x}{x^2}$ does not exist (it blows up). Each has the form $\\frac{0}{0}$ on the surface, but the answers are radically different. The symbol $\\frac{0}{0}$ alone tells you almost nothing.</div></div>

<h2 class="lesson-title">2. The Seven Indeterminate Forms</h2>

<div class="calc-highlight"><strong>Mathematics has identified exactly seven indeterminate algebraic forms.</strong> Three are quotients, two are products and differences, three are exponentials. Memorise them — every problem you will meet in this lesson reduces to one of these seven shapes.</div>

<p class="l-text">Here they are, grouped by structure:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Form</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Typical setting</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Standard strategy</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$0/0$</td><td style="padding:0.5rem 0.8rem">Both $f \\to 0$ and $g \\to 0$</td><td style="padding:0.5rem 0.8rem">Factor, simplify, or L'Hôpital</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\infty/\\infty$</td><td style="padding:0.5rem 0.8rem">Both $f \\to \\infty$ and $g \\to \\infty$</td><td style="padding:0.5rem 0.8rem">Divide by dominant term, or L'Hôpital</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$0 \\cdot \\infty$</td><td style="padding:0.5rem 0.8rem">$f \\to 0$, $g \\to \\infty$</td><td style="padding:0.5rem 0.8rem">Rewrite as $f / (1/g)$ to get $0/0$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\infty - \\infty$</td><td style="padding:0.5rem 0.8rem">$f \\to \\infty$, $g \\to \\infty$</td><td style="padding:0.5rem 0.8rem">Common denominator, factor out, or conjugate</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$1^{\\infty}$</td><td style="padding:0.5rem 0.8rem">$f \\to 1$, $g \\to \\infty$</td><td style="padding:0.5rem 0.8rem">Take $\\ln$, use $\\ln(f^g) = g \\ln f$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$0^0$</td><td style="padding:0.5rem 0.8rem">$f \\to 0^+$, $g \\to 0$</td><td style="padding:0.5rem 0.8rem">Take $\\ln$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$\\infty^0$</td><td style="padding:0.5rem 0.8rem">$f \\to \\infty$, $g \\to 0$</td><td style="padding:0.5rem 0.8rem">Take $\\ln$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Why exactly these seven?</strong> Each is the unique combination of "tendencies" that creates a contradiction in the naïve evaluation rule. For example: $\\frac{0}{0}$ is indeterminate because $0$ in the numerator "wants to pull the answer to zero" while $0$ in the denominator "wants to blow it up." Neither wins automatically. Similarly $1^{\\infty}$ is indeterminate because $1$ raised to anything is $1$, but anything raised to $\\infty$ should blow up — the two intuitions clash.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">DETERMINATE (NOT INDETERMINATE)</div><div class="compare-item">$0 + \\infty = \\infty$ — both push the same direction</div><div class="compare-item">$0 / \\infty = 0$ — numerator pushes to zero, denominator confirms</div><div class="compare-item">$\\infty + \\infty = \\infty$</div><div class="compare-item">$\\infty \\cdot \\infty = \\infty$</div><div class="compare-item">$0^{\\infty} = 0$ — shrinking base raised to growing power vanishes</div><div class="compare-item">$\\infty^{\\infty} = \\infty$</div></div><div class="compare-col"><div class="compare-title">INDETERMINATE</div><div class="compare-item">$0/0$ — both shrink, who wins?</div><div class="compare-item">$\\infty/\\infty$ — both grow, who wins?</div><div class="compare-item">$0 \\cdot \\infty$ — one shrinks, one grows</div><div class="compare-item">$\\infty - \\infty$ — both grow, subtracting</div><div class="compare-item">$1^{\\infty}$ — base is exactly 1, exponent diverges</div><div class="compare-item">$0^0$ — both base and exponent vanish</div><div class="compare-item">$\\infty^0$ — base diverges, exponent vanishes</div></div></div>

<div class="l-note"><strong>Trap to avoid:</strong> beginners sometimes see $0 + 0 = 0$ as "indeterminate." It is <em>not</em>. Two quantities both shrinking to zero, added together, definitely tend to zero. The mistake is to conflate "two zeros" with "an indeterminate form." Only the seven listed above are indeterminate. Everything else has a determined value.</div>

<h2 class="lesson-title">3. L'Hôpital's Rule (Statement)</h2>

<div class="calc-highlight"><strong>L'Hôpital's rule, in one sentence:</strong> if the limit of $f(x) / g(x)$ has the indeterminate form $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$, then it equals the limit of the ratio of derivatives, $f'(x) / g'(x)$, provided that second limit exists.</div>

<div class="calc-formula"><div class="formula-label">L'HÔPITAL'S RULE</div><div class="formula-main">$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} \\;=\\; \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$$</div><div class="formula-sub">Valid when (i) the left-hand limit has form $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$, (ii) $f$ and $g$ are differentiable near $a$ (with $g'(x) \\neq 0$), and (iii) the right-hand limit exists (possibly $\\pm \\infty$). Here $a$ may be a finite real number, or $\\pm \\infty$.</div></div>

<p class="l-text"><strong>Three preconditions to check.</strong> Before applying L'Hôpital, always confirm:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Indeterminate form</div><div class="card-body">Substitute $x = a$ first. The expression $f/g$ must give $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$. If it does not, L'Hôpital does not apply — and using it anyway will produce the wrong answer.</div></div>
<div class="calc-card"><div class="card-title">2. Differentiability</div><div class="card-body">Both $f$ and $g$ must be differentiable in some open interval around $a$ (excluding $a$ itself). For polynomials, exponentials, trig functions on their natural domain — this is automatic.</div></div>
<div class="calc-card"><div class="card-title">3. The new limit exists</div><div class="card-body">$\\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$ must exist (finite or infinite). If the differentiated limit oscillates or fails to exist, you cannot conclude anything about the original limit using L'Hôpital — try a different method.</div></div>
</div>

<div class="l-note"><strong>Common confusion:</strong> L'Hôpital says replace $f/g$ with $f'/g'$. This is <em>not</em> the same as the quotient rule! The quotient rule computes $\\frac{d}{dx}\\!\\left(\\frac{f}{g}\\right) = \\frac{f' g - f g'}{g^2}$. L'Hôpital uses only $\\frac{f'}{g'}$ — numerator and denominator are differentiated independently. Mixing them up is one of the most frequent errors on exams.</div>

<div class="calc-example"><div class="example-label">QUICK APPLICATION</div><div class="example-body">Compute $\\lim_{x \\to 0} \\dfrac{\\sin x}{x}$.<br><br>Substitute: $\\dfrac{\\sin 0}{0} = \\dfrac{0}{0}$ — indeterminate. Apply L'Hôpital:<br><br>$\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = \\lim_{x \\to 0} \\dfrac{(\\sin x)'}{(x)'} = \\lim_{x \\to 0} \\dfrac{\\cos x}{1} = \\dfrac{\\cos 0}{1} = \\mathbf{1}$.<br><br>This famous limit — used to derive the derivative of $\\sin$ itself in the first place — is verified instantly by L'Hôpital.</div></div>

<h2 class="lesson-title">4. Why L'Hôpital Works (Intuitive Proof)</h2>

<div class="calc-highlight"><strong>The intuition is short and beautiful.</strong> Near the point $x = a$, every well-behaved function looks approximately like its tangent line. If both $f$ and $g$ vanish at $a$, then near $a$ we have $f(x) \\approx f'(a)(x - a)$ and $g(x) \\approx g'(a)(x - a)$. Divide them: the common factor $(x - a)$ cancels and what remains is $f'(a) / g'(a)$.</div>

<p class="l-text">Let us write the argument carefully. Suppose $f(a) = 0$ and $g(a) = 0$, and that $f$ and $g$ are differentiable at $a$. Recall the linear approximation:</p>

<div class="calc-formula"><div class="formula-label">LINEAR APPROXIMATION NEAR $a$</div><div class="formula-main">$$f(x) \\;\\approx\\; f(a) + f'(a)\\,(x - a) \\quad\\text{and}\\quad g(x) \\;\\approx\\; g(a) + g'(a)\\,(x - a)$$</div><div class="formula-sub">For $x$ close to $a$, the function is well-approximated by its tangent line. The error tends to zero faster than $x - a$ itself.</div></div>

<p class="l-text">Since $f(a) = 0$ and $g(a) = 0$, the linearisations simplify to:</p>

<p class="l-text">$$f(x) \\approx f'(a) \\,(x - a) \\qquad g(x) \\approx g'(a) \\, (x - a)$$</p>

<p class="l-text">Form the ratio and watch the common factor $(x - a)$ cancel:</p>

<p class="l-text">$$\\frac{f(x)}{g(x)} \\;\\approx\\; \\frac{f'(a)\\,(x - a)}{g'(a)\\,(x - a)} \\;=\\; \\frac{f'(a)}{g'(a)}.$$</p>

<p class="l-text">Taking the limit as $x \\to a$ makes the approximation exact, provided $g'(a) \\neq 0$. This is the heart of the proof. A rigorous treatment (Cauchy's mean value theorem) handles the case $f'(a) = g'(a) = 0$ by iterating the argument, and the case $a = \\infty$ by a substitution $x = 1/u$.</p>

<div class="think-box"><div class="think-label">GEOMETRICAL PICTURE</div><div class="think-body">Plot $f$ and $g$ near $a$. Both curves pass through the same point on the $x$-axis. Zoom in. The two curves become two straight lines through that common point. The ratio $f/g$, near $a$, behaves like the ratio of the <em>slopes</em> of those two lines — which is exactly $f'(a) / g'(a)$. L'Hôpital is "look at the slopes, not the values."</div></div>

<h2 class="lesson-title">5. Examples of the $0/0$ Form</h2>

<div class="calc-highlight"><strong>The $0/0$ form is the bread-and-butter of L'Hôpital.</strong> It appears whenever you compute a derivative directly from the definition, whenever you evaluate a limit involving trig at $0$, and in countless physical applications. Here are the three classics every student must know.</div>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — $\\lim_{x \\to 0} \\dfrac{\\sin x}{x}$</div><div class="example-body">Form: $\\dfrac{\\sin 0}{0} = \\dfrac{0}{0}$. Apply L'Hôpital.<br><br>$\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = \\lim_{x \\to 0} \\dfrac{\\cos x}{1} = \\dfrac{1}{1} = \\mathbf{1}$.<br><br>This is the most famous limit in calculus. It is the reason all derivative formulas for $\\sin$ and $\\cos$ work.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — $\\lim_{x \\to 0} \\dfrac{e^x - 1}{x}$</div><div class="example-body">Form: $\\dfrac{e^0 - 1}{0} = \\dfrac{0}{0}$. Apply L'Hôpital.<br><br>$\\lim_{x \\to 0} \\dfrac{e^x - 1}{x} = \\lim_{x \\to 0} \\dfrac{e^x}{1} = \\dfrac{1}{1} = \\mathbf{1}$.<br><br>This limit is the definition of "$e^x$ has slope $1$ at $x = 0$" — equivalently, $\\frac{d}{dx} e^x \\big|_{x=0} = 1$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — $\\lim_{x \\to 0} \\dfrac{1 - \\cos x}{x^2}$</div><div class="example-body">Form: $\\dfrac{1 - 1}{0} = \\dfrac{0}{0}$. Apply L'Hôpital once:<br><br>$\\lim_{x \\to 0} \\dfrac{1 - \\cos x}{x^2} = \\lim_{x \\to 0} \\dfrac{\\sin x}{2x}$.<br><br>Substitute $x = 0$: $\\dfrac{0}{0}$ again. Apply L'Hôpital a second time:<br><br>$= \\lim_{x \\to 0} \\dfrac{\\cos x}{2} = \\dfrac{1}{2} = \\mathbf{\\dfrac{1}{2}}$.<br><br>This limit appears in the second derivative of $\\cos$ and in the small-angle approximation $\\cos x \\approx 1 - x^2/2$.</div></div>

<div class="calc-graph"><div id="plot-l13-sinx-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the function $f(x) = \\sin(x) / x$. At $x = 0$ the expression is undefined (division by zero), and yet the graph clearly approaches the height $y = 1$ from both sides. The hollow circle at $(0, 1)$ marks the missing value: the function does not reach it, but the <em>limit</em> at $x = 0$ is exactly $1$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];for(var i=-60;i<=-1;i++){var x=i/10;xL.push(x);yL.push(Math.sin(x)/x);}
var xR=[];var yR=[];for(var i=1;i<=60;i++){var x=i/10;xR.push(x);yR.push(Math.sin(x)/x);}
var t1={x:xL,y:yL,mode:'lines',name:'sin(x)/x (x<0)',line:{color:'#3b82f6',width:2.5}};
var t2={x:xR,y:yR,mode:'lines',name:'sin(x)/x (x>0)',line:{color:'#3b82f6',width:2.5},showlegend:false};
var t3={x:[0],y:[1],mode:'markers',name:'limit at x=0 is 1',marker:{size:13,color:'rgba(0,0,0,0)',line:{color:'#f59e0b',width:2.5}}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'sin(x)/x',range:[-0.3,1.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l13-sinx-en',[t1,t2,t3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Examples of the $\\infty/\\infty$ Form (Growth Race)</h2>

<div class="calc-highlight"><strong>L'Hôpital is also the standard tool for comparing how fast two functions grow at infinity.</strong> Exponentials beat polynomials. Polynomials beat logarithms. These growth comparisons appear in algorithm analysis, in physics asymptotics, in probability tails — almost everywhere.</div>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — $\\lim_{x \\to \\infty} \\dfrac{x^2}{e^x}$</div><div class="example-body">Form: $\\dfrac{\\infty}{\\infty}$. Apply L'Hôpital:<br><br>$\\lim_{x \\to \\infty} \\dfrac{x^2}{e^x} = \\lim_{x \\to \\infty} \\dfrac{2x}{e^x}$.<br><br>Still $\\dfrac{\\infty}{\\infty}$. Apply again:<br><br>$= \\lim_{x \\to \\infty} \\dfrac{2}{e^x} = \\dfrac{2}{\\infty} = \\mathbf{0}$.<br><br>The exponential overwhelms the polynomial. In fact $\\lim_{x \\to \\infty} \\frac{x^n}{e^x} = 0$ for every fixed $n$, no matter how large — exponentials grow faster than every polynomial.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — $\\lim_{x \\to \\infty} \\dfrac{\\ln x}{x}$</div><div class="example-body">Form: $\\dfrac{\\infty}{\\infty}$. Apply L'Hôpital:<br><br>$\\lim_{x \\to \\infty} \\dfrac{\\ln x}{x} = \\lim_{x \\to \\infty} \\dfrac{1/x}{1} = \\lim_{x \\to \\infty} \\dfrac{1}{x} = \\mathbf{0}$.<br><br>The logarithm grows, but very slowly. By the same logic $\\lim_{x \\to \\infty} \\frac{(\\ln x)^k}{x} = 0$ for every $k > 0$: any power of a logarithm is eventually beaten by the first power of $x$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — A POLYNOMIAL RATIO</div><div class="example-body">Compute $\\lim_{x \\to \\infty} \\dfrac{3x^2 + 5x}{2x^2 - x + 7}$.<br><br>Form: $\\dfrac{\\infty}{\\infty}$. Apply L'Hôpital:<br><br>$= \\lim_{x \\to \\infty} \\dfrac{6x + 5}{4x - 1}$.<br><br>Still $\\dfrac{\\infty}{\\infty}$. Apply again:<br><br>$= \\lim_{x \\to \\infty} \\dfrac{6}{4} = \\dfrac{3}{2} = \\mathbf{\\dfrac{3}{2}}$.<br><br>For a rational function with equal-degree polynomials, the limit at infinity is the ratio of leading coefficients. L'Hôpital confirms this.</div></div>

<p class="l-text"><strong>The growth hierarchy.</strong> At infinity, every standard function fits into a strict pecking order:</p>

<div class="calc-formula"><div class="formula-label">GROWTH ORDER AT INFINITY</div><div class="formula-main">$$\\ln x \\;\\ll\\; x^a \\;\\ll\\; b^x \\;\\ll\\; x! \\;\\ll\\; x^x \\qquad (a > 0,\\; b > 1)$$</div><div class="formula-sub">The symbol $\\ll$ means "grows much slower than" — formally, the ratio tends to zero. L'Hôpital can verify every comparison on this chain.</div></div>

<div class="calc-graph"><div id="plot-l13-exp-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $e^x$ (orange) vs $x^2$ (blue) on $[0, 6]$. The polynomial briefly leads near the origin, but the exponential overtakes it permanently and the gap grows without bound. Computing $\\lim_{x \\to \\infty} \\frac{x^2}{e^x}$ via L'Hôpital confirms the visual: the ratio collapses to zero.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];var ye=[];var yp=[];for(var i=0;i<=120;i++){var t=i/20;x.push(t);ye.push(Math.exp(t));yp.push(t*t);}
var t1={x:x,y:ye,mode:'lines',name:'e^x',line:{color:'#f59e0b',width:2.5}};
var t2={x:x,y:yp,mode:'lines',name:'x²',line:{color:'#3b82f6',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[0,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[0,400],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l13-exp-en',[t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l13-log-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $\\ln x$ (orange) vs $x$ (blue) on $[1, 100]$. Both grow, but the logarithm flattens dramatically. The ratio $\\ln x / x$ approaches zero — which L'Hôpital makes precise in one differentiation.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];var yl=[];var yi=[];for(var i=10;i<=1000;i++){var t=i/10;x.push(t);yl.push(Math.log(t));yi.push(t);}
var t1={x:x,y:yl,mode:'lines',name:'ln(x)',line:{color:'#f59e0b',width:2.5}};
var t2={x:x,y:yi,mode:'lines',name:'x',line:{color:'#3b82f6',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[1,100],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[0,100],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l13-log-en',[t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Applying L'Hôpital to the Other Five Forms</h2>

<div class="calc-highlight"><strong>L'Hôpital directly handles only $0/0$ and $\\infty/\\infty$.</strong> The other five forms — $0 \\cdot \\infty$, $\\infty - \\infty$, $1^{\\infty}$, $0^0$, $\\infty^0$ — must first be rewritten as one of those two. The standard tricks are: convert a product into a quotient, take a common denominator, or take a logarithm.</div>

<p class="l-text"><strong>Form $0 \\cdot \\infty$: rewrite as $0/0$ or $\\infty/\\infty$.</strong> If $f \\to 0$ and $g \\to \\infty$, write $f \\cdot g$ as $\\frac{f}{1/g}$ (which is now $\\frac{0}{0}$) or as $\\frac{g}{1/f}$ (which is now $\\frac{\\infty}{\\infty}$). Choose whichever differentiates more cleanly.</p>

<div class="calc-example"><div class="example-label">EXAMPLE — $0 \\cdot \\infty$</div><div class="example-body">Compute $\\lim_{x \\to 0^+} x \\ln x$.<br><br>Form: $0 \\cdot (-\\infty)$. Rewrite as a quotient:<br><br>$x \\ln x = \\dfrac{\\ln x}{1/x}$.<br><br>At $x \\to 0^+$ this is $\\dfrac{-\\infty}{\\infty}$. Apply L'Hôpital:<br><br>$\\lim_{x \\to 0^+} \\dfrac{\\ln x}{1/x} = \\lim_{x \\to 0^+} \\dfrac{1/x}{-1/x^2} = \\lim_{x \\to 0^+} (-x) = \\mathbf{0}$.<br><br>Even though $\\ln x \\to -\\infty$, the factor $x \\to 0$ wins fast enough to drag the product to zero.</div></div>

<p class="l-text"><strong>Form $\\infty - \\infty$: combine into a single fraction.</strong> If $f \\to \\infty$ and $g \\to \\infty$, but you want $f - g$, write a common denominator. The result is usually $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$.</p>

<div class="calc-example"><div class="example-label">EXAMPLE — $\\infty - \\infty$</div><div class="example-body">Compute $\\lim_{x \\to 0} \\left( \\dfrac{1}{x} - \\dfrac{1}{\\sin x} \\right)$.<br><br>Form: $\\infty - \\infty$. Common denominator:<br><br>$\\dfrac{1}{x} - \\dfrac{1}{\\sin x} = \\dfrac{\\sin x - x}{x \\sin x}$.<br><br>Substitute $x = 0$: $\\dfrac{0 - 0}{0 \\cdot 0} = \\dfrac{0}{0}$. Apply L'Hôpital:<br><br>$= \\lim_{x \\to 0} \\dfrac{\\cos x - 1}{\\sin x + x \\cos x}$. Still $\\dfrac{0}{0}$. Apply again:<br><br>$= \\lim_{x \\to 0} \\dfrac{-\\sin x}{2 \\cos x - x \\sin x} = \\dfrac{0}{2} = \\mathbf{0}$.</div></div>

<p class="l-text"><strong>Forms $1^{\\infty}, 0^0, \\infty^0$: take the logarithm.</strong> If $y = f(x)^{g(x)}$ has an indeterminate exponential form, compute $\\ln y = g(x) \\ln f(x)$ instead. Once you find $\\lim \\ln y = L$, exponentiate: $\\lim y = e^L$.</p>

<div class="calc-example"><div class="example-label">EXAMPLE — $1^{\\infty}$</div><div class="example-body">Compute $\\lim_{x \\to \\infty} \\left(1 + \\dfrac{1}{x}\\right)^x$.<br><br>Form: $1^{\\infty}$. Set $y = (1 + 1/x)^x$ and take logs:<br><br>$\\ln y = x \\ln\\!\\left(1 + \\dfrac{1}{x}\\right)$.<br><br>Form: $\\infty \\cdot 0$. Rewrite as $\\dfrac{\\ln(1 + 1/x)}{1/x}$ — which is $\\dfrac{0}{0}$. Apply L'Hôpital:<br><br>$\\lim_{x \\to \\infty} \\dfrac{\\dfrac{1}{1 + 1/x} \\cdot \\left(-\\dfrac{1}{x^2}\\right)}{-\\dfrac{1}{x^2}} = \\lim_{x \\to \\infty} \\dfrac{1}{1 + 1/x} = 1$.<br><br>So $\\ln y \\to 1$, hence $y \\to e^1 = \\mathbf{e}$. This is, in fact, the classical definition of Euler's number.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — $0^0$</div><div class="example-body">Compute $\\lim_{x \\to 0^+} x^x$.<br><br>Form: $0^0$. Let $y = x^x$. Then $\\ln y = x \\ln x$. From section 7 we already know $\\lim_{x \\to 0^+} x \\ln x = 0$, so $\\ln y \\to 0$ and therefore $y \\to e^0 = \\mathbf{1}$.<br><br>A pleasant surprise: $x^x$ tends to $1$, not to $0$ as one might naïvely guess.</div></div>

<h2 class="lesson-title">8. The Traps of L'Hôpital</h2>

<div class="calc-highlight"><strong>L'Hôpital is powerful but not magical.</strong> Three pitfalls trap careless students: (1) using it when the form is <em>not</em> indeterminate; (2) iterating it forever when it never resolves; (3) using it when a simpler method is far better.</div>

<p class="l-text"><strong>Trap 1: applying L'Hôpital when the form is not indeterminate.</strong> Always check the form first. Skipping this step is the most common mistake.</p>

<div class="calc-example"><div class="example-label">WHY YOU MUST CHECK THE FORM</div><div class="example-body">Wrong calculation:<br><br>$\\lim_{x \\to 0} \\dfrac{x + 1}{x + 2} \\stackrel{?}{=} \\lim_{x \\to 0} \\dfrac{1}{1} = 1$.<br><br>This applies L'Hôpital. But the original form is $\\dfrac{0 + 1}{0 + 2} = \\dfrac{1}{2}$ — already a number. L'Hôpital does <em>not</em> apply. The correct answer is $\\dfrac{1}{2}$, not $1$.<br><br><strong>Moral:</strong> always substitute first to see whether you have $0/0$ or $\\infty/\\infty$. If you don't, simplify directly.</div></div>

<p class="l-text"><strong>Trap 2: the rule loops without resolving.</strong> If repeated differentiation gives back the same indeterminate form forever, L'Hôpital is not the right tool. Try algebraic simplification instead.</p>

<div class="calc-example"><div class="example-label">A LOOPING CASE</div><div class="example-body">Compute $\\lim_{x \\to \\infty} \\dfrac{\\sqrt{x^2 + 1}}{x}$.<br><br>Form $\\dfrac{\\infty}{\\infty}$. Apply L'Hôpital:<br><br>$= \\lim_{x \\to \\infty} \\dfrac{x / \\sqrt{x^2 + 1}}{1} = \\lim_{x \\to \\infty} \\dfrac{x}{\\sqrt{x^2 + 1}}$.<br><br>Apply again — you get back $\\dfrac{\\sqrt{x^2 + 1}}{x}$. L'Hôpital is going in circles.<br><br><strong>Use algebra:</strong> divide numerator and denominator by $x$:<br><br>$\\dfrac{\\sqrt{x^2 + 1}}{x} = \\sqrt{1 + \\dfrac{1}{x^2}} \\to \\sqrt{1 + 0} = \\mathbf{1}$.</div></div>

<p class="l-text"><strong>Trap 3: algebra is sometimes simpler.</strong> When the limit can be resolved by factoring or by a conjugate trick, doing so is often faster — and avoids the bookkeeping of repeated differentiation.</p>

<div class="calc-example"><div class="example-label">ALGEBRA BEATS L'HÔPITAL</div><div class="example-body">Compute $\\lim_{x \\to 4} \\dfrac{x^2 - 16}{x - 4}$.<br><br>Form $\\dfrac{0}{0}$. You <em>could</em> apply L'Hôpital and get $\\dfrac{2x}{1}\\big|_{x=4} = 8$. Correct.<br><br>But: $\\dfrac{x^2 - 16}{x - 4} = \\dfrac{(x-4)(x+4)}{x-4} = x + 4 \\to 8$ by direct substitution. Two lines, no derivative needed.<br><br><strong>Moral:</strong> recognise easy factorisations before reaching for the rule.</div></div>

<div class="l-note"><strong>The right mental order:</strong> (i) substitute and check if you already have a number — if so, you're done. (ii) Try algebra — factor, common denominator, conjugate, divide by dominant term. (iii) If the form is $0/0$ or $\\infty/\\infty$ and algebra does not simplify, then apply L'Hôpital. (iv) For other indeterminate forms, convert first, then apply.</div>

<h2 class="lesson-title">9. Classical Practice Problems</h2>

<div class="calc-highlight"><strong>Eight problems, one from each indeterminate family.</strong> Try each on your own before reading the solution. The patterns you learn here cover the vast majority of Turkish university-entrance and first-year calculus questions.</div>

<div class="calc-example"><div class="example-label">PROBLEM 1 — $0/0$ TRIG</div><div class="example-body"><strong>$\\lim_{x \\to 0} \\dfrac{\\tan(3x)}{x}$.</strong><br><br>Form $\\dfrac{0}{0}$. By L'Hôpital: $\\lim \\dfrac{3 \\sec^2(3x)}{1} = 3 \\cdot 1 = \\mathbf{3}$.<br><br>Alternative: $\\tan(3x)/x = 3 \\cdot \\sin(3x)/(3x) \\cdot 1/\\cos(3x) \\to 3 \\cdot 1 \\cdot 1 = 3$. Same answer.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — $\\infty / \\infty$ POLYNOMIAL-LOG</div><div class="example-body"><strong>$\\lim_{x \\to \\infty} \\dfrac{(\\ln x)^2}{x}$.</strong><br><br>Form $\\dfrac{\\infty}{\\infty}$. By L'Hôpital: $\\lim \\dfrac{2 \\ln x / x}{1} = \\lim \\dfrac{2 \\ln x}{x}$. Again $\\dfrac{\\infty}{\\infty}$: $\\lim \\dfrac{2/x}{1} = \\mathbf{0}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — $0 \\cdot \\infty$</div><div class="example-body"><strong>$\\lim_{x \\to \\infty} x \\sin(1/x)$.</strong><br><br>Form $\\infty \\cdot 0$. Rewrite as $\\dfrac{\\sin(1/x)}{1/x}$. Set $u = 1/x$: as $x \\to \\infty$, $u \\to 0^+$, and the expression becomes $\\sin(u)/u \\to \\mathbf{1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — $\\infty - \\infty$</div><div class="example-body"><strong>$\\lim_{x \\to \\infty} (\\sqrt{x^2 + x} - x)$.</strong><br><br>Form $\\infty - \\infty$. Multiply and divide by the conjugate $\\sqrt{x^2 + x} + x$:<br><br>$\\dfrac{(x^2 + x) - x^2}{\\sqrt{x^2 + x} + x} = \\dfrac{x}{\\sqrt{x^2 + x} + x} = \\dfrac{1}{\\sqrt{1 + 1/x} + 1} \\to \\dfrac{1}{2} = \\mathbf{\\dfrac{1}{2}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — $1^{\\infty}$</div><div class="example-body"><strong>$\\lim_{x \\to 0} (1 + 2x)^{1/x}$.</strong><br><br>Form $1^{\\infty}$. Take logs: $\\ln y = \\dfrac{\\ln(1 + 2x)}{x}$. Form $\\dfrac{0}{0}$. L'Hôpital: $\\dfrac{2/(1+2x)}{1} \\to 2$. So $\\ln y \\to 2$ and $y \\to e^2$. Answer: $\\mathbf{e^2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — $0^0$</div><div class="example-body"><strong>$\\lim_{x \\to 0^+} (\\sin x)^x$.</strong><br><br>Form $0^0$. Take logs: $\\ln y = x \\ln(\\sin x)$. Form $0 \\cdot (-\\infty)$. Rewrite as $\\dfrac{\\ln(\\sin x)}{1/x}$. Form $\\dfrac{-\\infty}{\\infty}$. L'Hôpital:<br><br>$\\dfrac{\\cos x / \\sin x}{-1/x^2} = -\\dfrac{x^2 \\cos x}{\\sin x} = -\\dfrac{x \\cos x \\cdot x}{\\sin x} \\to -(0)(1)(1) = 0$.<br><br>So $\\ln y \\to 0$ and $y \\to e^0 = \\mathbf{1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — $\\infty^0$</div><div class="example-body"><strong>$\\lim_{x \\to \\infty} x^{1/x}$.</strong><br><br>Form $\\infty^0$. Take logs: $\\ln y = \\dfrac{\\ln x}{x}$. From section 6, $\\lim_{x \\to \\infty} \\dfrac{\\ln x}{x} = 0$. So $\\ln y \\to 0$ and $y \\to e^0 = \\mathbf{1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — REPEATED L'HÔPITAL</div><div class="example-body"><strong>$\\lim_{x \\to 0} \\dfrac{x - \\sin x}{x^3}$.</strong><br><br>Form $\\dfrac{0}{0}$. L'Hôpital: $\\dfrac{1 - \\cos x}{3 x^2}$. Still $\\dfrac{0}{0}$. Again: $\\dfrac{\\sin x}{6x}$. Again: $\\dfrac{\\cos x}{6} \\to \\dfrac{1}{6}$. Answer: $\\mathbf{\\dfrac{1}{6}}$.<br><br>This famous limit underlies the Taylor expansion $\\sin x = x - x^3/6 + \\dots$</div></div>

<h2 class="lesson-title">10. Visualising L'Hôpital and a Forms Cheat-Sheet</h2>

<div class="calc-highlight"><strong>One picture is worth a thousand symbols.</strong> The plot below makes L'Hôpital's rule visible: both $f(x)=\\sin(x)$ and $g(x)=x$ vanish at $x=0$, so $f/g$ is the indeterminate $0/0$ there. Yet the ratio $\\sin(x)/x$ approaches $1$ smoothly, and the ratio of derivatives $\\cos(x)/1$ approaches the very same value $1$ — visually confirming the rule. The cheat-sheet that follows lists all seven forms with a worked example and the standard trick for each.</div>

<div class="calc-graph"><div id="plot-l13-lhopital-en-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the blue curve is $\\sin(x)/x$ and the orange curve is $\\cos(x)/1$, the ratio of the two derivatives. Near $x=0$, the original ratio is the indeterminate form $0/0$, but both curves pass smoothly through (or toward) the height $y=1$. L'Hôpital's rule says the two limits at $x=0$ must agree — and the graph shows exactly that: both meet at $1$. The orange curve also illustrates how the differentiated ratio is often much easier to evaluate than the original.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];var dL=[];for(var i=-50;i<=-1;i++){var x=i/10;xL.push(x);yL.push(Math.sin(x)/x);dL.push(Math.cos(x));}
var xR=[];var yR=[];var dR=[];for(var i=1;i<=50;i++){var x=i/10;xR.push(x);yR.push(Math.sin(x)/x);dR.push(Math.cos(x));}
var t1={x:xL.concat([null]).concat(xR),y:yL.concat([null]).concat(yR),mode:'lines',name:'sin(x)/x  (original 0/0)',line:{color:'#3b82f6',width:2.8}};
var t2={x:xL.concat([null]).concat(xR),y:dL.concat([null]).concat(dR),mode:'lines',name:"cos(x)/1  (derivatives' ratio)",line:{color:'#f59e0b',width:2.2,dash:'dash'}};
var t3={x:[0],y:[1],mode:'markers',name:'common limit = 1',marker:{size:13,color:'rgba(0,0,0,0)',line:{color:'#22c55e',width:2.5}}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'value',range:[-0.4,1.25],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},shapes:[{type:'line',x0:-5,x1:5,y0:1,y1:1,line:{color:'rgba(34,197,94,0.35)',width:1,dash:'dot'}}]};
Plotly.newPlot('plot-l13-lhopital-en-extra',[t1,t2,t3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div style="overflow-x:auto;margin:1.4rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:#0a0a0a;color:rgba(235,230,220,0.92)">
<thead><tr style="background:#3b82f6;color:#0a0a0a">
<th style="padding:0.65rem 0.85rem;text-align:left;font-weight:700">Indeterminate form</th>
<th style="padding:0.65rem 0.85rem;text-align:left;font-weight:700">Canonical example</th>
<th style="padding:0.65rem 0.85rem;text-align:left;font-weight:700">Standard trick</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.85rem">$\\dfrac{0}{0}$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = 1$</td><td style="padding:0.55rem 0.85rem">L'Hôpital, or factor / Taylor expand</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.85rem">$\\dfrac{\\infty}{\\infty}$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to \\infty} \\dfrac{x^2}{e^x} = 0$</td><td style="padding:0.55rem 0.85rem">L'Hôpital, or divide by dominant term</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.85rem">$0 \\cdot \\infty$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to 0^+} x \\ln x = 0$</td><td style="padding:0.55rem 0.85rem">Rewrite as $\\dfrac{f}{1/g}$ to get $0/0$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.85rem">$\\infty - \\infty$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to \\infty} (\\sqrt{x^2 + x} - x) = \\tfrac{1}{2}$</td><td style="padding:0.55rem 0.85rem">Common denominator or conjugate</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.85rem">$0^0$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to 0^+} x^x = 1$</td><td style="padding:0.55rem 0.85rem">Set $y=f^g$, take $\\ln y = g \\ln f$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.85rem">$\\infty^0$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to \\infty} x^{1/x} = 1$</td><td style="padding:0.55rem 0.85rem">Set $y=f^g$, take $\\ln y = g \\ln f$</td></tr>
<tr><td style="padding:0.55rem 0.85rem">$1^{\\infty}$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to \\infty} (1 + 1/x)^x = e$</td><td style="padding:0.55rem 0.85rem">Set $y=f^g$, take $\\ln y = g \\ln f$</td></tr>
</tbody></table>
</div>

<div class="l-note"><strong>Looking ahead.</strong> In Lesson 14 we begin a careful treatment of <em>continuity</em>: when a function has no breaks, no jumps, no holes. Continuity is closely tied to limits — in fact a function is continuous at $a$ exactly when $\\lim_{x \\to a} f(x) = f(a)$. Indeterminate forms typically appear at points of "removable" discontinuity, where the function is undefined but the limit nevertheless exists.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>An indeterminate form is a symbolic expression — $0/0$, $\\infty/\\infty$, $0 \\cdot \\infty$, $\\infty - \\infty$, $1^{\\infty}$, $0^0$, $\\infty^0$ — whose value cannot be read from the symbol alone</li>
<li>L'Hôpital's rule: for $0/0$ or $\\infty/\\infty$ limits, $\\lim f/g = \\lim f'/g'$ provided differentiability and existence of the new limit</li>
<li>Check the form <em>before</em> applying L'Hôpital — using it on a determinate form gives wrong answers</li>
<li>Standard $0/0$ trio: $\\sin x/x \\to 1$, $(e^x - 1)/x \\to 1$, $(1 - \\cos x)/x^2 \\to 1/2$</li>
<li>Growth race: $\\ln x \\ll x^a \\ll b^x \\ll x! \\ll x^x$ — exponentials beat polynomials beat logarithms</li>
<li>For $0 \\cdot \\infty$ rewrite as a quotient; for $\\infty - \\infty$ use a common denominator or conjugate; for $1^{\\infty}, 0^0, \\infty^0$ take logarithms</li>
<li>Traps: do not iterate L'Hôpital forever; recognise when algebra is faster; never apply L'Hôpital to a non-indeterminate form</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bazı limitler değeri doğrudan yerine koyarak okunamaz.</strong> $\\lim_{x \\to 0} \\frac{\\sin x}{x}$ limitini doğrudan yerine koyarak hesaplamaya çalıştığında $\\frac{0}{0}$ elde edersin — tek başına hiçbir değeri olmayan bir sembol. Bu, limitin var olmadığı anlamına mı geliyor? Hiç de değil. Hem pay hem de payda sıfıra gidiyor, ve limit her birinin diğerine kıyasla <em>ne kadar hızlı</em> sıfıra gittiğine bağlı. Sonuç, göreceğimiz gibi, tam olarak $1$'dir. Kalkülüs böyle bir duruma <em>belirsizlik durumu</em> der: kazananın ancak daha yakın bir incelemeyle belirlenebileceği, birbirine zıt iki eğilim arasındaki bir çekişme.</p>

<p class="l-text">Bu ders, yedi klasik belirsizlik durumunu tanıtıyor ve bunları çözmek için en güçlü tek aleti sunuyor — <strong>L'Hôpital kuralı</strong>. 1694'te Johann Bernoulli tarafından keşfedilen ama bir yıl sonra Marquis de l'Hôpital'in ders kitabında yayımlanan kural, neredeyse büyülü bir şey söyler: bir limit $\\frac{0}{0}$ veya $\\frac{\\infty}{\\infty}$ biçimine sahip olduğunda, pay ile paydayı <em>türevleriyle</em> değiştirebilirsin ve limit değişmez. Hesaplanması imkânsız görünen bir problem, tek bir türev uzağına gelir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Yedi belirsizlik durumunu ($0/0$, $\\infty/\\infty$, $0 \\cdot \\infty$, $\\infty - \\infty$, $1^\\infty$, $0^0$, $\\infty^0$) tanımayı ve her birinin neden gerçekten belirsiz olduğunu bilmeyi</li>
<li>L'Hôpital kuralını kesin biçimde ifade etmeyi ve uygulamadan önce üç önkoşulunu kontrol etmeyi</li>
<li>L'Hôpital'in sezgisel ispatını yerel doğrusal yaklaşımlardan anlamayı</li>
<li>İlk adım hâlâ belirsizlik veriyorsa $0/0$ ve $\\infty/\\infty$ limitlerini tekrarlı türev alarak çözmeyi</li>
<li>Diğer belirsizlik durumlarını ($0 \\cdot \\infty$, $\\infty - \\infty$, $1^\\infty$, $0^0$, $\\infty^0$) cebirsel manipülasyon veya logaritma yoluyla $0/0$ ya da $\\infty/\\infty$ biçimine dönüştürmeyi</li>
<li>Klasik tuzakları fark etmeyi: L'Hôpital'in uygulanamadığı durumlar, döngüye girip yakınsamadığı durumlar, ve daha hızlı bir yöntemin (cebir, çarpanlara ayırma, eşlenik) tercih edilebileceği durumlar</li>
</ul>
</div>

<h2 class="lesson-title">1. Belirsizlik Durumu Nedir?</h2>

<div class="calc-highlight"><strong>Günlük bir resim:</strong> bitiş çizgisine yaklaşan iki arabayı hayal et. Her ikisi de tam çizgide sıfır hıza yavaşlar. Hangisi kazanır? "Her ikisi de sıfırda biter" demek yarış hakkında hiçbir şey söylemez — her arabanın nasıl yavaşladığını bilmen gerekir. Bir belirsizlik durumu matematikte tam olarak aynı durumdur: iki nicelik de sıfıra (ya da her ikisi de sonsuza) yöneliyor ve cevap sadece <em>nerede</em> bittiklerine değil, <em>nasıl</em> oraya vardıklarına bağlı.</div>

<p class="l-text">$\\lim_{x \\to a} \\frac{f(x)}{g(x)}$ gibi bir limit hesapladığında, en güvenli ilk hamle doğrudan yerine koymadır. Eğer $g(a) \\neq 0$ ise, sonuç sadece $\\frac{f(a)}{g(a)}$'dır ve iş biter. Ama doğrudan yerine koymanın aşağıdaki sembollerden birini verdiğini varsay:</p>

<div class="calc-formula"><div class="formula-label">BELİRSİZLİK SEMBOLLERİ</div><div class="formula-main">$$\\frac{0}{0}, \\quad \\frac{\\infty}{\\infty}, \\quad 0 \\cdot \\infty, \\quad \\infty - \\infty, \\quad 1^{\\infty}, \\quad 0^0, \\quad \\infty^0$$</div><div class="formula-sub">Bunların hiçbiri bir sayı <em>değildir</em>. Her biri "iki eğilim birbirine ters yönde çekiyor ve cevap daha fazla çalışma olmadan belirsizdir" demenin kısa yoludur.</div></div>

<p class="l-text"><strong>Kilit nokta:</strong> limit kendisi neredeyse her zaman vardır (ve çoğu zaman çok temiz bir değere sahiptir). Başarısız olan, yerine koyma <em>kısa yolu</em>dur. Pay ve payda her biri bireysel olarak sorunlu bir değere gider, ama <em>oranları</em> dikkatlice hesaplandığında herhangi bir reel sayı, $+\\infty$, $-\\infty$, hatta var olmayan bir değer çıkabilir. Sembole <em>belirsiz</em> dememizin nedeni budur — cevabı belirlemiyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Belirli durumlar</div><div class="card-body">Doğrudan yerine koyma sonlu bir sayı, $+\\infty$, $-\\infty$, $\\frac{c}{0^+} = \\pm\\infty$, $c$ sonlu olmak üzere $c \\cdot 0 = 0$ veriyorsa — cevap belirlenmiştir. Ekstra çalışma gerekmez.</div></div>
<div class="calc-card"><div class="card-title">Belirsiz durumlar</div><div class="card-body">Doğrudan yerine koyma yukarıdaki yedi sembolden birini veriyorsa, cevap henüz belirlenmemiştir. İfadeyi cebirsel olarak yeniden yazmalı ya da L'Hôpital kuralı gibi bir araç kullanmalısın.</div></div>
<div class="calc-card"><div class="card-title">Amaç</div><div class="card-body">Belirsiz ifadeyi belirli bir ifadeye dönüştürmek. Çarpanlara ayır, sadeleştir, eşlenik kullan, logaritma al ya da türev al — çekişmeyi ne çözüyorsa onu kullan.</div></div>
</div>

<div class="calc-example"><div class="example-label">İLK $0/0$ ÖRNEĞİ</div><div class="example-body">$\\lim_{x \\to 2} \\dfrac{x^2 - 4}{x - 2}$ değerini hesapla.<br><br>Doğrudan yerine koyma: $\\dfrac{4 - 4}{2 - 2} = \\dfrac{0}{0}$ — belirsiz.<br><br>Çarpanlarına ayır: $\\dfrac{x^2 - 4}{x - 2} = \\dfrac{(x-2)(x+2)}{x - 2} = x + 2$ ($x \\neq 2$ için).<br><br>Şimdi yerine koy: $\\lim_{x \\to 2}(x + 2) = 4$. İşlenmemiş ifade tanımsız görünse de limit vardır ve $\\mathbf{4}$'tür.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">Üç hızlı deney yap. (i) $\\lim_{x \\to 0} \\frac{x}{x} = 1$. (ii) $\\lim_{x \\to 0} \\frac{x^2}{x} = 0$. (iii) $\\lim_{x \\to 0} \\frac{x}{x^2}$ yoktur (patlar). Her birinin yüzeyde $\\frac{0}{0}$ biçimi var, ama cevaplar köklü biçimde farklı. $\\frac{0}{0}$ sembolü tek başına neredeyse hiçbir şey söylemez.</div></div>

<h2 class="lesson-title">2. Yedi Belirsizlik Durumu</h2>

<div class="calc-highlight"><strong>Matematik tam olarak yedi cebirsel belirsizlik durumu belirlemiştir.</strong> Üçü bölüm, ikisi çarpım ve fark, üçü üs alma. Onları ezberle — bu derste karşılaşacağın her problem bu yedi şekilden birine indirgenir.</div>

<p class="l-text">İşte yapıya göre gruplanmış halleri:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Durum</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Tipik ortam</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Standart strateji</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$0/0$</td><td style="padding:0.5rem 0.8rem">Hem $f \\to 0$ hem $g \\to 0$</td><td style="padding:0.5rem 0.8rem">Çarpanlara ayır, sadeleştir veya L'Hôpital</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\infty/\\infty$</td><td style="padding:0.5rem 0.8rem">Hem $f \\to \\infty$ hem $g \\to \\infty$</td><td style="padding:0.5rem 0.8rem">Baskın terime böl ya da L'Hôpital</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$0 \\cdot \\infty$</td><td style="padding:0.5rem 0.8rem">$f \\to 0$, $g \\to \\infty$</td><td style="padding:0.5rem 0.8rem">$f / (1/g)$ olarak yaz, $0/0$ olur</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\infty - \\infty$</td><td style="padding:0.5rem 0.8rem">$f \\to \\infty$, $g \\to \\infty$</td><td style="padding:0.5rem 0.8rem">Ortak payda, çarpan parantezleme, eşlenik</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$1^{\\infty}$</td><td style="padding:0.5rem 0.8rem">$f \\to 1$, $g \\to \\infty$</td><td style="padding:0.5rem 0.8rem">$\\ln$ al, $\\ln(f^g) = g \\ln f$ kullan</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$0^0$</td><td style="padding:0.5rem 0.8rem">$f \\to 0^+$, $g \\to 0$</td><td style="padding:0.5rem 0.8rem">$\\ln$ al</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$\\infty^0$</td><td style="padding:0.5rem 0.8rem">$f \\to \\infty$, $g \\to 0$</td><td style="padding:0.5rem 0.8rem">$\\ln$ al</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Neden tam olarak bu yedi tane?</strong> Her biri, saf değerlendirme kuralında çelişki yaratan "eğilim" kombinasyonunun benzersiz halidir. Örneğin: $\\frac{0}{0}$ belirsizdir çünkü payda $0$ "cevabı sıfıra çekmek ister" iken paydadaki $0$ "patlatmak ister." Hiçbiri otomatik olarak kazanmaz. Benzer şekilde $1^{\\infty}$ belirsizdir çünkü $1$'in herhangi bir kuvveti $1$'dir, ama herhangi bir şeyin $\\infty$ kuvveti patlamalıdır — iki sezgi çarpışır.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">BELİRLİ (BELİRSİZ DEĞİL)</div><div class="compare-item">$0 + \\infty = \\infty$ — ikisi de aynı yöne iter</div><div class="compare-item">$0 / \\infty = 0$ — pay sıfıra iter, payda onaylar</div><div class="compare-item">$\\infty + \\infty = \\infty$</div><div class="compare-item">$\\infty \\cdot \\infty = \\infty$</div><div class="compare-item">$0^{\\infty} = 0$ — büyüyen kuvvete yükseltilen küçülen taban kaybolur</div><div class="compare-item">$\\infty^{\\infty} = \\infty$</div></div><div class="compare-col"><div class="compare-title">BELİRSİZ</div><div class="compare-item">$0/0$ — ikisi de küçülür, kim kazanır?</div><div class="compare-item">$\\infty/\\infty$ — ikisi de büyür, kim kazanır?</div><div class="compare-item">$0 \\cdot \\infty$ — biri küçülür, biri büyür</div><div class="compare-item">$\\infty - \\infty$ — ikisi de büyür, çıkartılır</div><div class="compare-item">$1^{\\infty}$ — taban tam $1$, üs ıraksar</div><div class="compare-item">$0^0$ — hem taban hem üs sıfıra gider</div><div class="compare-item">$\\infty^0$ — taban ıraksar, üs sıfıra gider</div></div></div>

<div class="l-note"><strong>Kaçınılması gereken tuzak:</strong> başlangıç seviyesindekiler bazen $0 + 0 = 0$'ı "belirsiz" sanır. <em>Değildir</em>. Sıfıra giden iki nicelik toplanırsa, kesinlikle sıfıra gider. Hata, "iki sıfır"ı "belirsizlik durumuyla" karıştırmaktır. Yalnızca yukarıdaki yedi durum belirsizdir. Diğer her şeyin belirlenmiş bir değeri vardır.</div>

<h2 class="lesson-title">3. L'Hôpital Kuralı (Tanım)</h2>

<div class="calc-highlight"><strong>L'Hôpital kuralı bir cümlede:</strong> $f(x) / g(x)$ limiti $\\frac{0}{0}$ veya $\\frac{\\infty}{\\infty}$ belirsizlik biçimine sahipse, türevlerin oranı $f'(x) / g'(x)$'in limitine eşittir — yeter ki bu ikinci limit var olsun.</div>

<div class="calc-formula"><div class="formula-label">L'HÔPITAL KURALI</div><div class="formula-main">$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} \\;=\\; \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$$</div><div class="formula-sub">Geçerlilik için: (i) soldaki limit $\\frac{0}{0}$ veya $\\frac{\\infty}{\\infty}$ biçiminde olmalı, (ii) $f$ ve $g$ $a$ yakınında türevlenebilir olmalı ($g'(x) \\neq 0$ ile), (iii) sağdaki limit var olmalı (sonlu ya da $\\pm \\infty$). Burada $a$ sonlu bir reel sayı veya $\\pm \\infty$ olabilir.</div></div>

<p class="l-text"><strong>Kontrol edilmesi gereken üç önkoşul.</strong> L'Hôpital'i uygulamadan önce daima şunları doğrula:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Belirsizlik biçimi</div><div class="card-body">Önce $x = a$ koy. $f/g$ ifadesi $\\frac{0}{0}$ veya $\\frac{\\infty}{\\infty}$ vermeli. Vermiyorsa L'Hôpital uygulanmaz — yine de kullanmak yanlış cevap üretir.</div></div>
<div class="calc-card"><div class="card-title">2. Türevlenebilirlik</div><div class="card-body">Hem $f$ hem $g$ $a$ etrafında bir açık aralıkta türevlenebilir olmalı ($a$ noktası hariç). Polinomlar, üstel fonksiyonlar, doğal tanım kümesinde trigonometrik fonksiyonlar için — bu otomatiktir.</div></div>
<div class="calc-card"><div class="card-title">3. Yeni limit var olmalı</div><div class="card-body">$\\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$ var olmalı (sonlu ya da sonsuz). Türevlenmiş limit salınıyor ya da yoksa, L'Hôpital kullanarak orijinal limit hakkında bir sonuç çıkaramazsın — farklı bir yöntem dene.</div></div>
</div>

<div class="l-note"><strong>Sık karışıklık:</strong> L'Hôpital $f/g$'yi $f'/g'$ ile değiştir der. Bu, bölüm kuralı <em>değildir</em>! Bölüm kuralı $\\frac{d}{dx}\\!\\left(\\frac{f}{g}\\right) = \\frac{f' g - f g'}{g^2}$ hesaplar. L'Hôpital ise yalnızca $\\frac{f'}{g'}$'yi kullanır — pay ve payda bağımsız olarak türev alınır. Bunları karıştırmak sınavlardaki en sık hatalardan biridir.</div>

<div class="calc-example"><div class="example-label">HIZLI UYGULAMA</div><div class="example-body">$\\lim_{x \\to 0} \\dfrac{\\sin x}{x}$ değerini hesapla.<br><br>Yerine koy: $\\dfrac{\\sin 0}{0} = \\dfrac{0}{0}$ — belirsiz. L'Hôpital uygula:<br><br>$\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = \\lim_{x \\to 0} \\dfrac{(\\sin x)'}{(x)'} = \\lim_{x \\to 0} \\dfrac{\\cos x}{1} = \\dfrac{\\cos 0}{1} = \\mathbf{1}$.<br><br>Bu meşhur limit — $\\sin$'in türevini ilk başta türetirken kullanılan — L'Hôpital ile anında doğrulanır.</div></div>

<h2 class="lesson-title">4. L'Hôpital Neden Çalışır (Sezgisel İspat)</h2>

<div class="calc-highlight"><strong>Sezgi kısa ve güzeldir.</strong> $x = a$ noktası yakınında, iyi davranışlı her fonksiyon yaklaşık olarak teğet doğrusuna benzer. Hem $f$ hem $g$ $a$'da sıfırsa, $a$ yakınında $f(x) \\approx f'(a)(x - a)$ ve $g(x) \\approx g'(a)(x - a)$ olur. Böldüğünde ortak çarpan $(x - a)$ sadeleşir ve geriye $f'(a) / g'(a)$ kalır.</div>

<p class="l-text">Argümanı dikkatle yazalım. $f(a) = 0$ ve $g(a) = 0$ olduğunu, ve $f$ ile $g$'nin $a$'da türevlenebilir olduğunu varsay. Doğrusal yaklaşımı hatırla:</p>

<div class="calc-formula"><div class="formula-label">$a$ YAKININDA DOĞRUSAL YAKLAŞIM</div><div class="formula-main">$$f(x) \\;\\approx\\; f(a) + f'(a)\\,(x - a) \\quad\\text{ve}\\quad g(x) \\;\\approx\\; g(a) + g'(a)\\,(x - a)$$</div><div class="formula-sub">$a$'ya yakın $x$ için fonksiyon teğet doğrusuyla iyi yaklaştırılır. Hata, $x - a$'dan daha hızlı sıfıra gider.</div></div>

<p class="l-text">$f(a) = 0$ ve $g(a) = 0$ olduğundan, doğrusallaştırmalar şu hale gelir:</p>

<p class="l-text">$$f(x) \\approx f'(a) \\,(x - a) \\qquad g(x) \\approx g'(a) \\, (x - a)$$</p>

<p class="l-text">Oranı oluştur ve ortak çarpan $(x - a)$'nın sadeleştiğine bak:</p>

<p class="l-text">$$\\frac{f(x)}{g(x)} \\;\\approx\\; \\frac{f'(a)\\,(x - a)}{g'(a)\\,(x - a)} \\;=\\; \\frac{f'(a)}{g'(a)}.$$</p>

<p class="l-text">$x \\to a$ limitini alınca yaklaşım eşitliğe dönüşür ($g'(a) \\neq 0$ olması koşuluyla). Bu ispatın kalbidir. Daha titiz bir yaklaşım (Cauchy ortalama değer teoremi) $f'(a) = g'(a) = 0$ durumunu argümanı yineleyerek ele alır, $a = \\infty$ durumunu da $x = 1/u$ değişken değişimiyle.</p>

<div class="think-box"><div class="think-label">GEOMETRİK RESİM</div><div class="think-body">$a$ yakınında $f$ ve $g$'yi çiz. Her iki eğri de $x$-ekseninde aynı noktadan geçer. Yakınlaştır. İki eğri, o ortak noktadan geçen iki düz doğru gibi görünür. $a$ yakınında $f/g$ oranı, o iki doğrunun <em>eğimlerinin</em> oranı gibi davranır — ki bu tam olarak $f'(a) / g'(a)$'dır. L'Hôpital "değerlere değil, eğimlere bak" demektir.</div></div>

<h2 class="lesson-title">5. $0/0$ Biçiminin Örnekleri</h2>

<div class="calc-highlight"><strong>$0/0$ biçimi L'Hôpital'in temel ekmek-tereyağıdır.</strong> Türevi tanımdan doğrudan hesaplarken, $0$'da trigonometrik bir limit hesaplarken ve sayısız fiziksel uygulamada ortaya çıkar. İşte her öğrencinin bilmesi gereken üç klasik.</div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — $\\lim_{x \\to 0} \\dfrac{\\sin x}{x}$</div><div class="example-body">Biçim: $\\dfrac{\\sin 0}{0} = \\dfrac{0}{0}$. L'Hôpital uygula.<br><br>$\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = \\lim_{x \\to 0} \\dfrac{\\cos x}{1} = \\dfrac{1}{1} = \\mathbf{1}$.<br><br>Bu kalkülüsteki en ünlü limittir. $\\sin$ ve $\\cos$ için bütün türev formüllerinin çalışmasının nedenidir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — $\\lim_{x \\to 0} \\dfrac{e^x - 1}{x}$</div><div class="example-body">Biçim: $\\dfrac{e^0 - 1}{0} = \\dfrac{0}{0}$. L'Hôpital uygula.<br><br>$\\lim_{x \\to 0} \\dfrac{e^x - 1}{x} = \\lim_{x \\to 0} \\dfrac{e^x}{1} = \\dfrac{1}{1} = \\mathbf{1}$.<br><br>Bu limit "$e^x$'in $x = 0$'da eğimi $1$'dir" ifadesinin tanımıdır — yani $\\frac{d}{dx} e^x \\big|_{x=0} = 1$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — $\\lim_{x \\to 0} \\dfrac{1 - \\cos x}{x^2}$</div><div class="example-body">Biçim: $\\dfrac{1 - 1}{0} = \\dfrac{0}{0}$. L'Hôpital'i bir kez uygula:<br><br>$\\lim_{x \\to 0} \\dfrac{1 - \\cos x}{x^2} = \\lim_{x \\to 0} \\dfrac{\\sin x}{2x}$.<br><br>$x = 0$ yerine koy: yine $\\dfrac{0}{0}$. L'Hôpital'i ikinci kez uygula:<br><br>$= \\lim_{x \\to 0} \\dfrac{\\cos x}{2} = \\dfrac{1}{2} = \\mathbf{\\dfrac{1}{2}}$.<br><br>Bu limit $\\cos$'un ikinci türevinde ve küçük açı yaklaşımı $\\cos x \\approx 1 - x^2/2$'de görünür.</div></div>

<div class="calc-graph"><div id="plot-l13-sinx-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $f(x) = \\sin(x) / x$ fonksiyonu. $x = 0$'da ifade tanımsızdır (sıfıra bölüm), yine de grafik her iki yandan da $y = 1$ yüksekliğine yaklaşır. $(0, 1)$ noktasındaki içi boş daire eksik değeri işaretler: fonksiyon ona ulaşmaz, ama $x = 0$'daki <em>limit</em> tam olarak $1$'dir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];for(var i=-60;i<=-1;i++){var x=i/10;xL.push(x);yL.push(Math.sin(x)/x);}
var xR=[];var yR=[];for(var i=1;i<=60;i++){var x=i/10;xR.push(x);yR.push(Math.sin(x)/x);}
var t1={x:xL,y:yL,mode:'lines',name:'sin(x)/x (x<0)',line:{color:'#3b82f6',width:2.5}};
var t2={x:xR,y:yR,mode:'lines',name:'sin(x)/x (x>0)',line:{color:'#3b82f6',width:2.5},showlegend:false};
var t3={x:[0],y:[1],mode:'markers',name:'x=0 limiti 1',marker:{size:13,color:'rgba(0,0,0,0)',line:{color:'#f59e0b',width:2.5}}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'sin(x)/x',range:[-0.3,1.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l13-sinx-tr',[t1,t2,t3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. $\\infty/\\infty$ Biçiminin Örnekleri (Büyüme Yarışı)</h2>

<div class="calc-highlight"><strong>L'Hôpital aynı zamanda iki fonksiyonun sonsuzda ne kadar hızlı büyüdüğünü karşılaştırmak için standart araçtır.</strong> Üstel fonksiyonlar polinomları yener. Polinomlar logaritmaları yener. Bu büyüme karşılaştırmaları algoritma analizinde, fizik asimptotiklerinde, olasılık kuyruk dağılımlarında — neredeyse her yerde görünür.</div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — $\\lim_{x \\to \\infty} \\dfrac{x^2}{e^x}$</div><div class="example-body">Biçim: $\\dfrac{\\infty}{\\infty}$. L'Hôpital uygula:<br><br>$\\lim_{x \\to \\infty} \\dfrac{x^2}{e^x} = \\lim_{x \\to \\infty} \\dfrac{2x}{e^x}$.<br><br>Hâlâ $\\dfrac{\\infty}{\\infty}$. Tekrar uygula:<br><br>$= \\lim_{x \\to \\infty} \\dfrac{2}{e^x} = \\dfrac{2}{\\infty} = \\mathbf{0}$.<br><br>Üstel polinomu ezer. Aslında $\\lim_{x \\to \\infty} \\frac{x^n}{e^x} = 0$ her sabit $n$ için, ne kadar büyük olursa olsun — üstel fonksiyonlar her polinomdan hızlı büyür.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — $\\lim_{x \\to \\infty} \\dfrac{\\ln x}{x}$</div><div class="example-body">Biçim: $\\dfrac{\\infty}{\\infty}$. L'Hôpital uygula:<br><br>$\\lim_{x \\to \\infty} \\dfrac{\\ln x}{x} = \\lim_{x \\to \\infty} \\dfrac{1/x}{1} = \\lim_{x \\to \\infty} \\dfrac{1}{x} = \\mathbf{0}$.<br><br>Logaritma büyür, ama çok yavaş. Aynı mantıkla $\\lim_{x \\to \\infty} \\frac{(\\ln x)^k}{x} = 0$ her $k > 0$ için: logaritmanın herhangi bir kuvveti, sonunda $x$'in birinci kuvveti tarafından yenilir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — POLİNOMLARIN ORANI</div><div class="example-body">$\\lim_{x \\to \\infty} \\dfrac{3x^2 + 5x}{2x^2 - x + 7}$ değerini hesapla.<br><br>Biçim: $\\dfrac{\\infty}{\\infty}$. L'Hôpital uygula:<br><br>$= \\lim_{x \\to \\infty} \\dfrac{6x + 5}{4x - 1}$.<br><br>Hâlâ $\\dfrac{\\infty}{\\infty}$. Tekrar:<br><br>$= \\lim_{x \\to \\infty} \\dfrac{6}{4} = \\dfrac{3}{2} = \\mathbf{\\dfrac{3}{2}}$.<br><br>Eşit dereceli polinomlardan oluşan rasyonel bir fonksiyon için sonsuzdaki limit, baş katsayıların oranıdır. L'Hôpital bunu doğrular.</div></div>

<p class="l-text"><strong>Büyüme hiyerarşisi.</strong> Sonsuzda, standart fonksiyonların hepsi katı bir sıraya girer:</p>

<div class="calc-formula"><div class="formula-label">SONSUZDA BÜYÜME SIRASI</div><div class="formula-main">$$\\ln x \\;\\ll\\; x^a \\;\\ll\\; b^x \\;\\ll\\; x! \\;\\ll\\; x^x \\qquad (a > 0,\\; b > 1)$$</div><div class="formula-sub">$\\ll$ sembolü "çok daha yavaş büyür" demektir — biçimsel olarak, oran sıfıra gider. L'Hôpital bu zincirdeki her karşılaştırmayı doğrulayabilir.</div></div>

<div class="calc-graph"><div id="plot-l13-exp-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $[0, 6]$ aralığında $e^x$ (turuncu) ve $x^2$ (mavi). Polinom orijin yakınında kısaca öne geçer, ama üstel onu kalıcı olarak yakalar ve aradaki fark sınırsız büyür. $\\lim_{x \\to \\infty} \\frac{x^2}{e^x}$'yi L'Hôpital ile hesaplamak görsel olanı doğrular: oran sıfıra çöker.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];var ye=[];var yp=[];for(var i=0;i<=120;i++){var t=i/20;x.push(t);ye.push(Math.exp(t));yp.push(t*t);}
var t1={x:x,y:ye,mode:'lines',name:'e^x',line:{color:'#f59e0b',width:2.5}};
var t2={x:x,y:yp,mode:'lines',name:'x²',line:{color:'#3b82f6',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[0,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[0,400],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l13-exp-tr',[t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l13-log-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $[1, 100]$ aralığında $\\ln x$ (turuncu) ve $x$ (mavi). İkisi de büyür, ama logaritma çarpıcı biçimde yatay hale gelir. $\\ln x / x$ oranı sıfıra yaklaşır — L'Hôpital bunu tek bir türevle kesinleştirir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];var yl=[];var yi=[];for(var i=10;i<=1000;i++){var t=i/10;x.push(t);yl.push(Math.log(t));yi.push(t);}
var t1={x:x,y:yl,mode:'lines',name:'ln(x)',line:{color:'#f59e0b',width:2.5}};
var t2={x:x,y:yi,mode:'lines',name:'x',line:{color:'#3b82f6',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[1,100],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[0,100],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l13-log-tr',[t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. L'Hôpital'i Diğer Beş Duruma Uygulamak</h2>

<div class="calc-highlight"><strong>L'Hôpital doğrudan yalnızca $0/0$ ve $\\infty/\\infty$ durumlarını işler.</strong> Diğer beş durum — $0 \\cdot \\infty$, $\\infty - \\infty$, $1^{\\infty}$, $0^0$, $\\infty^0$ — önce bunlardan birine yeniden yazılmalıdır. Standart numaralar şunlar: bir çarpımı bir bölüme dönüştür, ortak payda al, ya da logaritma al.</div>

<p class="l-text"><strong>$0 \\cdot \\infty$ biçimi: $0/0$ veya $\\infty/\\infty$ olarak yeniden yaz.</strong> $f \\to 0$ ve $g \\to \\infty$ ise, $f \\cdot g$ ifadesini $\\frac{f}{1/g}$ olarak (şimdi $\\frac{0}{0}$) ya da $\\frac{g}{1/f}$ olarak (şimdi $\\frac{\\infty}{\\infty}$) yaz. Hangisi daha temiz türev veriyorsa onu seç.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — $0 \\cdot \\infty$</div><div class="example-body">$\\lim_{x \\to 0^+} x \\ln x$ değerini hesapla.<br><br>Biçim: $0 \\cdot (-\\infty)$. Bir bölüm olarak yeniden yaz:<br><br>$x \\ln x = \\dfrac{\\ln x}{1/x}$.<br><br>$x \\to 0^+$'da bu $\\dfrac{-\\infty}{\\infty}$. L'Hôpital uygula:<br><br>$\\lim_{x \\to 0^+} \\dfrac{\\ln x}{1/x} = \\lim_{x \\to 0^+} \\dfrac{1/x}{-1/x^2} = \\lim_{x \\to 0^+} (-x) = \\mathbf{0}$.<br><br>$\\ln x \\to -\\infty$ olsa da, $x \\to 0$ çarpanı çarpımı sıfıra çekecek kadar hızlı kazanır.</div></div>

<p class="l-text"><strong>$\\infty - \\infty$ biçimi: tek bir kesirde birleştir.</strong> $f \\to \\infty$ ve $g \\to \\infty$ ama $f - g$ istiyorsan, ortak payda yaz. Sonuç genellikle $\\frac{0}{0}$ veya $\\frac{\\infty}{\\infty}$ olur.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — $\\infty - \\infty$</div><div class="example-body">$\\lim_{x \\to 0} \\left( \\dfrac{1}{x} - \\dfrac{1}{\\sin x} \\right)$ değerini hesapla.<br><br>Biçim: $\\infty - \\infty$. Ortak payda:<br><br>$\\dfrac{1}{x} - \\dfrac{1}{\\sin x} = \\dfrac{\\sin x - x}{x \\sin x}$.<br><br>$x = 0$ koy: $\\dfrac{0 - 0}{0 \\cdot 0} = \\dfrac{0}{0}$. L'Hôpital uygula:<br><br>$= \\lim_{x \\to 0} \\dfrac{\\cos x - 1}{\\sin x + x \\cos x}$. Hâlâ $\\dfrac{0}{0}$. Tekrar uygula:<br><br>$= \\lim_{x \\to 0} \\dfrac{-\\sin x}{2 \\cos x - x \\sin x} = \\dfrac{0}{2} = \\mathbf{0}$.</div></div>

<p class="l-text"><strong>$1^{\\infty}, 0^0, \\infty^0$ biçimleri: logaritma al.</strong> $y = f(x)^{g(x)}$ ifadesinin belirsiz üstel biçimi varsa, onun yerine $\\ln y = g(x) \\ln f(x)$'yi hesapla. $\\lim \\ln y = L$'yi bulduktan sonra üstel al: $\\lim y = e^L$.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — $1^{\\infty}$</div><div class="example-body">$\\lim_{x \\to \\infty} \\left(1 + \\dfrac{1}{x}\\right)^x$ değerini hesapla.<br><br>Biçim: $1^{\\infty}$. $y = (1 + 1/x)^x$ koy ve logaritma al:<br><br>$\\ln y = x \\ln\\!\\left(1 + \\dfrac{1}{x}\\right)$.<br><br>Biçim: $\\infty \\cdot 0$. $\\dfrac{\\ln(1 + 1/x)}{1/x}$ olarak yeniden yaz — bu $\\dfrac{0}{0}$. L'Hôpital uygula:<br><br>$\\lim_{x \\to \\infty} \\dfrac{\\dfrac{1}{1 + 1/x} \\cdot \\left(-\\dfrac{1}{x^2}\\right)}{-\\dfrac{1}{x^2}} = \\lim_{x \\to \\infty} \\dfrac{1}{1 + 1/x} = 1$.<br><br>O halde $\\ln y \\to 1$, yani $y \\to e^1 = \\mathbf{e}$. Bu, aslında Euler sayısının klasik tanımıdır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — $0^0$</div><div class="example-body">$\\lim_{x \\to 0^+} x^x$ değerini hesapla.<br><br>Biçim: $0^0$. $y = x^x$ olsun. O zaman $\\ln y = x \\ln x$. 7. bölümden $\\lim_{x \\to 0^+} x \\ln x = 0$ olduğunu biliyoruz, yani $\\ln y \\to 0$ ve dolayısıyla $y \\to e^0 = \\mathbf{1}$.<br><br>Hoş bir sürpriz: $x^x$ saf bakışla tahmin edilebileceği gibi $0$'a değil, $1$'e gider.</div></div>

<h2 class="lesson-title">8. L'Hôpital'in Tuzakları</h2>

<div class="calc-highlight"><strong>L'Hôpital güçlüdür ama sihirli değildir.</strong> Üç tuzak dikkatsiz öğrencileri yakalar: (1) biçim belirsiz <em>değilken</em> kullanmak; (2) çözüme ulaşmadan sonsuz kez yinelemek; (3) çok daha basit bir yöntem varken kullanmak.</div>

<p class="l-text"><strong>Tuzak 1: biçim belirsiz değilken L'Hôpital uygulamak.</strong> Önce biçimi her zaman kontrol et. Bu adımı atlamak en yaygın hatadır.</p>

<div class="calc-example"><div class="example-label">BİÇİMİ NEDEN KONTROL ETMELİSİN</div><div class="example-body">Yanlış hesap:<br><br>$\\lim_{x \\to 0} \\dfrac{x + 1}{x + 2} \\stackrel{?}{=} \\lim_{x \\to 0} \\dfrac{1}{1} = 1$.<br><br>Bu, L'Hôpital uygular. Ama orijinal biçim $\\dfrac{0 + 1}{0 + 2} = \\dfrac{1}{2}$ — zaten bir sayı. L'Hôpital uygulanmaz. Doğru cevap $\\dfrac{1}{2}$'dir, $1$ değil.<br><br><strong>Ders:</strong> $0/0$ ya da $\\infty/\\infty$ olup olmadığını görmek için her zaman önce yerine koy. Değilse, doğrudan sadeleştir.</div></div>

<p class="l-text"><strong>Tuzak 2: kural çözüme ulaşmadan döngüye girer.</strong> Tekrarlı türev sonsuza dek aynı belirsizlik biçimini veriyorsa, L'Hôpital doğru araç değildir. Onun yerine cebirsel sadeleştirme dene.</p>

<div class="calc-example"><div class="example-label">DÖNGÜYE GİREN BİR DURUM</div><div class="example-body">$\\lim_{x \\to \\infty} \\dfrac{\\sqrt{x^2 + 1}}{x}$ değerini hesapla.<br><br>Biçim $\\dfrac{\\infty}{\\infty}$. L'Hôpital uygula:<br><br>$= \\lim_{x \\to \\infty} \\dfrac{x / \\sqrt{x^2 + 1}}{1} = \\lim_{x \\to \\infty} \\dfrac{x}{\\sqrt{x^2 + 1}}$.<br><br>Tekrar uygula — $\\dfrac{\\sqrt{x^2 + 1}}{x}$ geri gelir. L'Hôpital daireler içinde dönüyor.<br><br><strong>Cebir kullan:</strong> pay ve paydayı $x$'e böl:<br><br>$\\dfrac{\\sqrt{x^2 + 1}}{x} = \\sqrt{1 + \\dfrac{1}{x^2}} \\to \\sqrt{1 + 0} = \\mathbf{1}$.</div></div>

<p class="l-text"><strong>Tuzak 3: cebir bazen daha basittir.</strong> Limit çarpanlara ayırma veya eşlenik numarasıyla çözülebiliyorsa, bunu yapmak çoğu zaman daha hızlıdır — ve tekrarlı türev almanın muhasebesini önler.</p>

<div class="calc-example"><div class="example-label">CEBİR L'HÔPITAL'İ YENER</div><div class="example-body">$\\lim_{x \\to 4} \\dfrac{x^2 - 16}{x - 4}$ değerini hesapla.<br><br>Biçim $\\dfrac{0}{0}$. L'Hôpital uygulayıp $\\dfrac{2x}{1}\\big|_{x=4} = 8$ <em>elde edebilirsin</em>. Doğru.<br><br>Ama: $\\dfrac{x^2 - 16}{x - 4} = \\dfrac{(x-4)(x+4)}{x-4} = x + 4 \\to 8$ doğrudan yerine koymayla. İki satır, türev gerekmez.<br><br><strong>Ders:</strong> kurala uzanmadan önce kolay çarpanlara ayırmaları fark et.</div></div>

<div class="l-note"><strong>Doğru zihinsel sıra:</strong> (i) yerine koy ve zaten bir sayın varsa — işin biter. (ii) Cebir dene — çarpanlara ayır, ortak payda, eşlenik, baskın terime böl. (iii) Biçim $0/0$ veya $\\infty/\\infty$ ise ve cebir sadeleştirmiyorsa, o zaman L'Hôpital uygula. (iv) Diğer belirsizlik durumları için önce dönüştür, sonra uygula.</div>

<h2 class="lesson-title">9. Klasik Alıştırma Soruları</h2>

<div class="calc-highlight"><strong>Her belirsizlik ailesinden bir tane, sekiz problem.</strong> Çözümü okumadan önce her birini kendin dene. Burada öğrendiğin örüntüler Türk üniversite giriş sınavının ve birinci sınıf kalkülüs sorularının büyük çoğunluğunu kapsar.</div>

<div class="calc-example"><div class="example-label">PROBLEM 1 — $0/0$ TRİGONOMETRİ</div><div class="example-body"><strong>$\\lim_{x \\to 0} \\dfrac{\\tan(3x)}{x}$.</strong><br><br>Biçim $\\dfrac{0}{0}$. L'Hôpital ile: $\\lim \\dfrac{3 \\sec^2(3x)}{1} = 3 \\cdot 1 = \\mathbf{3}$.<br><br>Alternatif: $\\tan(3x)/x = 3 \\cdot \\sin(3x)/(3x) \\cdot 1/\\cos(3x) \\to 3 \\cdot 1 \\cdot 1 = 3$. Aynı cevap.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — $\\infty / \\infty$ POLİNOM-LOGARİTMA</div><div class="example-body"><strong>$\\lim_{x \\to \\infty} \\dfrac{(\\ln x)^2}{x}$.</strong><br><br>Biçim $\\dfrac{\\infty}{\\infty}$. L'Hôpital: $\\lim \\dfrac{2 \\ln x / x}{1} = \\lim \\dfrac{2 \\ln x}{x}$. Yine $\\dfrac{\\infty}{\\infty}$: $\\lim \\dfrac{2/x}{1} = \\mathbf{0}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — $0 \\cdot \\infty$</div><div class="example-body"><strong>$\\lim_{x \\to \\infty} x \\sin(1/x)$.</strong><br><br>Biçim $\\infty \\cdot 0$. $\\dfrac{\\sin(1/x)}{1/x}$ olarak yeniden yaz. $u = 1/x$ kabul et: $x \\to \\infty$ iken $u \\to 0^+$, ifade $\\sin(u)/u \\to \\mathbf{1}$ olur.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — $\\infty - \\infty$</div><div class="example-body"><strong>$\\lim_{x \\to \\infty} (\\sqrt{x^2 + x} - x)$.</strong><br><br>Biçim $\\infty - \\infty$. $\\sqrt{x^2 + x} + x$ eşleniğiyle çarp ve böl:<br><br>$\\dfrac{(x^2 + x) - x^2}{\\sqrt{x^2 + x} + x} = \\dfrac{x}{\\sqrt{x^2 + x} + x} = \\dfrac{1}{\\sqrt{1 + 1/x} + 1} \\to \\dfrac{1}{2} = \\mathbf{\\dfrac{1}{2}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — $1^{\\infty}$</div><div class="example-body"><strong>$\\lim_{x \\to 0} (1 + 2x)^{1/x}$.</strong><br><br>Biçim $1^{\\infty}$. Logaritma al: $\\ln y = \\dfrac{\\ln(1 + 2x)}{x}$. Biçim $\\dfrac{0}{0}$. L'Hôpital: $\\dfrac{2/(1+2x)}{1} \\to 2$. O halde $\\ln y \\to 2$ ve $y \\to e^2$. Cevap: $\\mathbf{e^2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — $0^0$</div><div class="example-body"><strong>$\\lim_{x \\to 0^+} (\\sin x)^x$.</strong><br><br>Biçim $0^0$. Logaritma al: $\\ln y = x \\ln(\\sin x)$. Biçim $0 \\cdot (-\\infty)$. $\\dfrac{\\ln(\\sin x)}{1/x}$ olarak yeniden yaz. Biçim $\\dfrac{-\\infty}{\\infty}$. L'Hôpital:<br><br>$\\dfrac{\\cos x / \\sin x}{-1/x^2} = -\\dfrac{x^2 \\cos x}{\\sin x} = -\\dfrac{x \\cos x \\cdot x}{\\sin x} \\to -(0)(1)(1) = 0$.<br><br>O halde $\\ln y \\to 0$ ve $y \\to e^0 = \\mathbf{1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — $\\infty^0$</div><div class="example-body"><strong>$\\lim_{x \\to \\infty} x^{1/x}$.</strong><br><br>Biçim $\\infty^0$. Logaritma al: $\\ln y = \\dfrac{\\ln x}{x}$. 6. bölümden $\\lim_{x \\to \\infty} \\dfrac{\\ln x}{x} = 0$. O halde $\\ln y \\to 0$ ve $y \\to e^0 = \\mathbf{1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — TEKRARLI L'HÔPITAL</div><div class="example-body"><strong>$\\lim_{x \\to 0} \\dfrac{x - \\sin x}{x^3}$.</strong><br><br>Biçim $\\dfrac{0}{0}$. L'Hôpital: $\\dfrac{1 - \\cos x}{3 x^2}$. Hâlâ $\\dfrac{0}{0}$. Tekrar: $\\dfrac{\\sin x}{6x}$. Tekrar: $\\dfrac{\\cos x}{6} \\to \\dfrac{1}{6}$. Cevap: $\\mathbf{\\dfrac{1}{6}}$.<br><br>Bu meşhur limit $\\sin x = x - x^3/6 + \\dots$ Taylor açılımının temelinde yatar.</div></div>

<h2 class="lesson-title">10. L'Hôpital'in Görselleştirilmesi ve Belirsizlik Tablosu</h2>

<div class="calc-highlight"><strong>Bir resim bin sembole bedeldir.</strong> Aşağıdaki grafik L'Hôpital kuralını gözle görülür kılar: hem $f(x)=\\sin(x)$ hem de $g(x)=x$, $x=0$ noktasında sıfırlanıyor, yani $f/g$ orada belirsiz $0/0$ biçiminde. Buna rağmen $\\sin(x)/x$ oranı yumuşak biçimde $1$'e yaklaşıyor, ve türevlerin oranı $\\cos(x)/1$ de aynı $1$ değerine yaklaşıyor — kuralı görsel olarak doğruluyor. Hemen ardından gelen özet tablosu, yedi biçimin her birini çözülmüş bir örnek ve standart hile ile listeliyor.</div>

<div class="calc-graph"><div id="plot-l13-lhopital-tr-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> mavi eğri $\\sin(x)/x$ fonksiyonu, turuncu eğri ise iki türevin oranı $\\cos(x)/1$. $x=0$ civarında orijinal oran belirsiz $0/0$ biçimindedir, ama her iki eğri de $y=1$ yüksekliğinden geçiyor (ya da ona yaklaşıyor). L'Hôpital kuralı, $x=0$'daki iki limitin eşit olması gerektiğini söyler — grafik tam olarak bunu gösteriyor: ikisi de $1$ değerinde buluşuyor. Turuncu eğri ayrıca türevlenmiş oranın çoğu zaman orijinalden çok daha kolay değerlendirilebildiğini örnekliyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];var dL=[];for(var i=-50;i<=-1;i++){var x=i/10;xL.push(x);yL.push(Math.sin(x)/x);dL.push(Math.cos(x));}
var xR=[];var yR=[];var dR=[];for(var i=1;i<=50;i++){var x=i/10;xR.push(x);yR.push(Math.sin(x)/x);dR.push(Math.cos(x));}
var t1={x:xL.concat([null]).concat(xR),y:yL.concat([null]).concat(yR),mode:'lines',name:'sin(x)/x  (orijinal 0/0)',line:{color:'#3b82f6',width:2.8}};
var t2={x:xL.concat([null]).concat(xR),y:dL.concat([null]).concat(dR),mode:'lines',name:'cos(x)/1  (türevlerin oranı)',line:{color:'#f59e0b',width:2.2,dash:'dash'}};
var t3={x:[0],y:[1],mode:'markers',name:'ortak limit = 1',marker:{size:13,color:'rgba(0,0,0,0)',line:{color:'#22c55e',width:2.5}}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'değer',range:[-0.4,1.25],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},shapes:[{type:'line',x0:-5,x1:5,y0:1,y1:1,line:{color:'rgba(34,197,94,0.35)',width:1,dash:'dot'}}]};
Plotly.newPlot('plot-l13-lhopital-tr-extra',[t1,t2,t3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div style="overflow-x:auto;margin:1.4rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:#0a0a0a;color:rgba(235,230,220,0.92)">
<thead><tr style="background:#3b82f6;color:#0a0a0a">
<th style="padding:0.65rem 0.85rem;text-align:left;font-weight:700">Belirsizlik biçimi</th>
<th style="padding:0.65rem 0.85rem;text-align:left;font-weight:700">Klasik örnek</th>
<th style="padding:0.65rem 0.85rem;text-align:left;font-weight:700">Standart hile</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.85rem">$\\dfrac{0}{0}$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = 1$</td><td style="padding:0.55rem 0.85rem">L'Hôpital, ya da çarpanlara ayır / Taylor aç</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.85rem">$\\dfrac{\\infty}{\\infty}$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to \\infty} \\dfrac{x^2}{e^x} = 0$</td><td style="padding:0.55rem 0.85rem">L'Hôpital, ya da baskın terime böl</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.85rem">$0 \\cdot \\infty$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to 0^+} x \\ln x = 0$</td><td style="padding:0.55rem 0.85rem">$\\dfrac{f}{1/g}$ olarak yeniden yaz, $0/0$ olur</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.85rem">$\\infty - \\infty$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to \\infty} (\\sqrt{x^2 + x} - x) = \\tfrac{1}{2}$</td><td style="padding:0.55rem 0.85rem">Ortak payda ya da eşlenikle çarp</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.85rem">$0^0$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to 0^+} x^x = 1$</td><td style="padding:0.55rem 0.85rem">$y=f^g$ koy, $\\ln y = g \\ln f$ al</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.85rem">$\\infty^0$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to \\infty} x^{1/x} = 1$</td><td style="padding:0.55rem 0.85rem">$y=f^g$ koy, $\\ln y = g \\ln f$ al</td></tr>
<tr><td style="padding:0.55rem 0.85rem">$1^{\\infty}$</td><td style="padding:0.55rem 0.85rem">$\\lim_{x \\to \\infty} (1 + 1/x)^x = e$</td><td style="padding:0.55rem 0.85rem">$y=f^g$ koy, $\\ln y = g \\ln f$ al</td></tr>
</tbody></table>
</div>

<div class="l-note"><strong>İleriye bakış.</strong> 14. derste <em>süreklilik</em> kavramının dikkatli incelemesine başlıyoruz: bir fonksiyonun kırılmasının, sıçramasının, deliğinin olmadığı durum. Süreklilik limitle yakından bağlıdır — aslında bir fonksiyon $a$'da tam olarak $\\lim_{x \\to a} f(x) = f(a)$ olduğunda süreklidir. Belirsizlik durumları tipik olarak "kaldırılabilir" süreksizlik noktalarında görünür, yani fonksiyonun tanımsız olduğu ama limitin yine de var olduğu noktalarda.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir belirsizlik durumu — $0/0$, $\\infty/\\infty$, $0 \\cdot \\infty$, $\\infty - \\infty$, $1^{\\infty}$, $0^0$, $\\infty^0$ — değeri tek başına sembolden okunamayan sembolik bir ifadedir</li>
<li>L'Hôpital kuralı: $0/0$ veya $\\infty/\\infty$ limitleri için $\\lim f/g = \\lim f'/g'$ — türevlenebilirlik ve yeni limitin varlığı koşuluyla</li>
<li>L'Hôpital uygulamadan <em>önce</em> biçimi kontrol et — belirli bir biçimde kullanmak yanlış cevap verir</li>
<li>Standart $0/0$ üçlüsü: $\\sin x/x \\to 1$, $(e^x - 1)/x \\to 1$, $(1 - \\cos x)/x^2 \\to 1/2$</li>
<li>Büyüme yarışı: $\\ln x \\ll x^a \\ll b^x \\ll x! \\ll x^x$ — üsteller polinomları, polinomlar logaritmaları yener</li>
<li>$0 \\cdot \\infty$ için bölüm olarak yeniden yaz; $\\infty - \\infty$ için ortak payda veya eşlenik kullan; $1^{\\infty}, 0^0, \\infty^0$ için logaritma al</li>
<li>Tuzaklar: L'Hôpital'i sonsuz kez yineleme; cebrin daha hızlı olduğu zaman tanı; belirsiz olmayan bir biçime asla L'Hôpital uygulama</li>
</ul>
</div>`

};
