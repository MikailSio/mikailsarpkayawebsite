window.LISE_MAT_L27 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>For twenty-six lessons you have been asking: given a function $F$, what is its slope $F'$?</strong> Today we reverse the question. Given a slope $f$, what function had that slope? This inverse problem is called the <em>antiderivative</em>, and the symbol for it — a tall stretched-out $S$ written $\\int$ — is the second great character of calculus, every bit as important as the prime mark $'$ you have grown used to.</p>

<p class="l-text">An antiderivative is never unique. The simple polynomial $F(x) = x^2$ has derivative $2x$, but so does $x^2 + 5$, and so does $x^2 - 17$. Any vertical shift leaves the slope unchanged. To capture this fact we always write the answer with a mysterious extra letter $C$ at the end — the <strong>constant of integration</strong>. By the end of this lesson you will understand exactly what $C$ means, how to find the right one when a starting condition is given, and how every motion problem in physics — "if I know the acceleration, what is the position?" — is really just a hidden antiderivative problem.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the definition: $F$ is an antiderivative of $f$ on an interval when $F'(x) = f(x)$ everywhere on it</li>
<li>Read and use the indefinite integral notation $\\int f(x)\\,dx = F(x) + C$ and explain every symbol</li>
<li>Explain why the constant $C$ is necessary and why infinitely many antiderivatives exist</li>
<li>Apply the basic rules: power rule $\\int x^n dx$, constant rule, sum rule, constant-multiple rule</li>
<li>Integrate the special functions $e^x$ and $1/x$, and the six elementary trigonometric building blocks</li>
<li>Use an initial condition $F(a) = b$ to pin down the specific antiderivative</li>
<li>Solve physics motion problems: given $a(t)$, recover $v(t)$ and $s(t)$ with two integrations and two initial conditions</li>
</ul>
</div>

<h2 class="lesson-title">1. The Reverse-Derivative Problem</h2>

<div class="calc-highlight"><strong>Everyday picture.</strong> You watch a car's speedometer for an hour and write down the speed at every instant. Can you reconstruct where the car is at every instant? Yes — that is exactly an antiderivative problem. The speed is the derivative of position, so the position is an antiderivative of the speed. The only thing you cannot recover from the speedometer alone is <em>where the car started</em>; you need one extra piece of information — the starting position — to nail down the answer.</div>

<p class="l-text">Up to now every derivative problem looked like this: <em>here is $F$, compute $f = F'$.</em> Reverse this. Suppose someone tells you a function $f$ and asks you to produce a function $F$ such that</p>

<div class="calc-formula"><div class="formula-main">$$F'(x) \\;=\\; f(x).$$</div></div>

<p class="l-text">Such an $F$ is called an <strong>antiderivative</strong> of $f$ (other names you may see: <em>primitive</em>, <em>indefinite integral</em>). The word <em>antiderivative</em> simply means "function whose derivative is $f$."</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forward direction</div><div class="card-body">Take a function, compute its slope. This is what you have done since Lesson 14. Example: $F(x) = x^3 \\;\\Rightarrow\\; F'(x) = 3x^2$.</div></div>
<div class="calc-card"><div class="card-title">Reverse direction</div><div class="card-body">Start with a slope, find the function. Example: given $f(x) = 3x^2$, can we guess an $F$ with $F' = f$? Yes: $F(x) = x^3$ works (and so do $x^3 + 7$, $x^3 - 2$, ...).</div></div>
<div class="calc-card"><div class="card-title">Why this is harder</div><div class="card-body">Differentiation is a mechanical recipe. Antidifferentiation is more like puzzle-solving — you have to <em>recognise</em> which functions, when differentiated, would give the one you see. This lesson teaches the basic patterns.</div></div>
</div>

<p class="l-text">Here are three small puzzles. Try each in your head before reading on.</p>

<div class="calc-example"><div class="example-label">QUICK WARM-UPS</div><div class="example-body">
<strong>(a)</strong> Find an $F$ with $F'(x) = 2x$. &nbsp;&nbsp;<em>Answer:</em> $F(x) = x^2$ (because $(x^2)' = 2x$).<br><br>
<strong>(b)</strong> Find an $F$ with $F'(x) = \\cos x$. &nbsp;&nbsp;<em>Answer:</em> $F(x) = \\sin x$ (because $(\\sin x)' = \\cos x$).<br><br>
<strong>(c)</strong> Find an $F$ with $F'(x) = e^x$. &nbsp;&nbsp;<em>Answer:</em> $F(x) = e^x$ (because $(e^x)' = e^x$).
</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">In puzzle (a) is $F(x) = x^2$ the <em>only</em> answer? What about $G(x) = x^2 + 100$? Differentiating gives $G'(x) = 2x$ as well — the constant $100$ vanishes. So both $F$ and $G$ are correct antiderivatives. Hold on to this observation; section 3 turns it into the most important idea of the lesson.</div></div>

<h2 class="lesson-title">2. The Indefinite Integral Notation</h2>

<p class="l-text">Leibniz introduced a beautiful symbol for the antiderivative. He stretched the letter $S$ (for <em>summa</em>, Latin for "sum") into the elongated</p>

<div class="calc-formula"><div class="formula-main">$$\\int$$</div></div>

<p class="l-text">that you now meet everywhere. Together with the differential $dx$ it forms what we call the <strong>indefinite integral</strong>:</p>

<div class="calc-formula"><div class="formula-label">INDEFINITE INTEGRAL</div><div class="formula-main">$$\\int f(x)\\,dx \\;=\\; F(x) + C, \\qquad \\text{where } F'(x) = f(x).$$</div><div class="formula-sub">Read aloud: "the integral of $f$ of $x$ with respect to $x$ equals $F$ of $x$ plus $C$."</div></div>

<p class="l-text">Every piece of that symbol carries meaning:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\int$ (integral sign)</div><div class="card-body">An elongated $S$. It says "find a function whose derivative is what follows."</div></div>
<div class="calc-card"><div class="card-title">$f(x)$ (integrand)</div><div class="card-body">The function whose antiderivative we are after — the known slope.</div></div>
<div class="calc-card"><div class="card-title">$dx$ (differential)</div><div class="card-body">Tells us the integration variable is $x$. In $\\int 2xt\\, dx$ the $x$ is the variable and $t$ is just a constant; $\\int 2xt\\, dt$ would mean the opposite.</div></div>
<div class="calc-card"><div class="card-title">$F(x)$ (antiderivative)</div><div class="card-body">Any specific function with $F'(x) = f(x)$.</div></div>
<div class="calc-card"><div class="card-title">$+\\,C$ (constant)</div><div class="card-body">A reminder that infinitely many antiderivatives differ by a constant. Section 3 explains exactly why.</div></div>
</div>

<p class="l-text">The word <em>indefinite</em> is key. The result is not a single number — it is an entire <em>family</em> of functions, one for each value of $C$. By contrast, the <em>definite</em> integral (Lesson 28) will produce a number representing an area. Symbol $\\int$ shows up in both, but its meaning is slightly different in each case.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — READING THE NOTATION</div><div class="example-body">
The statement $\\displaystyle \\int 2x\\,dx \\;=\\; x^2 + C$ is read as:<br><br>
"The integral of $2x$ with respect to $x$ equals $x^2$ plus $C$."<br><br>
Check by differentiating the right-hand side: $\\frac{d}{dx}(x^2 + C) = 2x + 0 = 2x$. The derivative of the answer reproduces the integrand — exactly what an antiderivative is supposed to do.
</div></div>

<div class="think-box"><div class="think-label">THE GOLDEN SANITY CHECK</div><div class="think-body">After every integration, <strong>differentiate your answer</strong> and check that you recover the integrand. If you computed $\\int 3x^2\\,dx = x^3 + C$ and differentiating gives $3x^2$, the answer is correct. Make this check automatic. It catches almost every careless error.</div></div>

<h2 class="lesson-title">3. Why the $+\\,C$? — Infinitely Many Antiderivatives</h2>

<div class="calc-highlight"><strong>The key fact.</strong> If $F$ is an antiderivative of $f$, then so is $F + C$ for <em>every</em> real constant $C$. There is not one antiderivative — there are infinitely many, all differing by a vertical shift.</div>

<p class="l-text"><strong>Why is this true?</strong> Suppose $F'(x) = f(x)$ and let $G(x) = F(x) + C$. Differentiate $G$:</p>

<div class="calc-formula"><div class="formula-main">$$G'(x) \\;=\\; (F(x) + C)' \\;=\\; F'(x) + C' \\;=\\; f(x) + 0 \\;=\\; f(x).$$</div></div>

<p class="l-text">The constant differentiates to zero (slope of a flat line is zero), so $G$ inherits the same derivative as $F$. Adding any constant is invisible to the derivative.</p>

<p class="l-text"><strong>Are these all the antiderivatives?</strong> Yes. A theorem from Lesson 22 (consequence of the Mean Value Theorem) says: if two functions have the same derivative on an interval, then they differ by a constant. So once we have <em>one</em> antiderivative $F$, every other antiderivative is forced to be of the form $F + C$. There are no surprises.</p>

<div class="calc-example"><div class="example-label">EXAMPLE — A FAMILY OF PARALLEL CURVES</div><div class="example-body">
$\\displaystyle \\int 2x\\,dx \\;=\\; x^2 + C$.<br><br>
Pick $C = 0$: $F_0(x) = x^2$ (parabola through origin).<br>
Pick $C = 3$: $F_3(x) = x^2 + 3$ (same parabola shifted up by 3).<br>
Pick $C = -3$: $F_{-3}(x) = x^2 - 3$ (same parabola shifted down by 3).<br><br>
All three have slope $2x$ at every $x$. They differ only in their height — at $x = 1$ they sit at heights $1$, $4$, and $-2$ respectively, but the tangent line at $x = 1$ to each one has slope $2 \\cdot 1 = 2$. The plot below makes this visual.
</div></div>

<div id="plot-l27-family-en" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-30;i<=30;i++)xs.push(i/10);
var y1=xs.map(function(x){return x*x-3;});
var y2=xs.map(function(x){return x*x;});
var y3=xs.map(function(x){return x*x+3;});
var t1={x:xs,y:y1,mode:"lines",name:"F(x) = x² − 3 (C = −3)",line:{color:"#f87171",width:2.5}};
var t2={x:xs,y:y2,mode:"lines",name:"F(x) = x² (C = 0)",line:{color:"#c8a96e",width:2.5}};
var t3={x:xs,y:y3,mode:"lines",name:"F(x) = x² + 3 (C = 3)",line:{color:"#60a5fa",width:2.5}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-3.2,3.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[-4,12]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-l27-family-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> three antiderivatives of $f(x) = 2x$, one for each of $C = -3, 0, 3$. The curves are <em>parallel</em> in the sense that at any fixed $x$ their tangent lines have identical slope $2x$ — the curves are just slid up or down by a constant amount. The whole infinite family $\\{x^2 + C : C \\in \\mathbb{R}\\}$ fills the plane with such shifted copies.</div></div>

<div class="think-box"><div class="think-label">A GEOMETRIC PICTURE</div><div class="think-body">Imagine the derivative $f(x) = 2x$ as a "slope-prescription" at every $x$. The prescription is the same regardless of which height you start at. So you can pick <em>any</em> starting height and produce a valid antiderivative — sliding the parabola up or down does not change its slope. The constant $C$ records exactly that choice of starting height.</div></div>

<p class="l-text">Here is the same idea for a different integrand. Consider $\\int x\\,dx = \\frac{x^2}{2} + C$. Sweep $C$ through five values $C = -2, -1, 0, 1, 2$ and you get five parallel parabolas — every member of the family has slope $x$ at every $x$. The five curves below are stacked exactly one vertical unit apart; the "$+C$" is literally the vertical translation that connects any one curve to the next.</p>

<div id="plot-l27-family-extra-en" class="plotly-graph" style="height:400px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-30;i<=30;i++)xs.push(i/10);
var mkY=function(C){return xs.map(function(x){return 0.5*x*x+C;});};
var Cs=[-2,-1,0,1,2];
var colors=["#f87171","#fbbf24","#c8a96e","#60a5fa","#3b82f6"];
var traces=Cs.map(function(C,i){return {x:xs,y:mkY(C),mode:"lines",name:"F(x) = x²/2 + ("+C+")",line:{color:colors[i],width:2.5}};});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-3.2,3.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"F(x) = x²/2 + C",range:[-3,7]},margin:{t:30,r:30,b:65,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.28}};
Plotly.newPlot("plot-l27-family-extra-en",traces,layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> the family $F(x) = \\frac{x^2}{2} + C$ for $C \\in \\{-2, -1, 0, 1, 2\\}$, all antiderivatives of $f(x) = x$. At any fixed $x$ the five curves all carry the same slope $x$; they are perfectly stacked vertical translates of one another. Choosing $C$ is exactly choosing which member of this infinite parallel ladder you want. An initial condition $F(a) = b$ (section 7) is what picks one rung out.</div></div>

<h2 class="lesson-title">4. The Basic Integration Rules</h2>

<p class="l-text">Every differentiation rule has an integration counterpart obtained by reading it backwards. Three of the most useful are below.</p>

<div class="calc-formula"><div class="formula-label">CONSTANT RULE</div><div class="formula-main">$$\\int k\\,dx \\;=\\; kx + C \\qquad (k \\text{ constant})$$</div><div class="formula-sub">Because $(kx)' = k$.</div></div>

<div class="calc-formula"><div class="formula-label">POWER RULE</div><div class="formula-main">$$\\int x^n\\,dx \\;=\\; \\frac{x^{n+1}}{n+1} + C \\qquad (n \\neq -1)$$</div><div class="formula-sub">Differentiate the right side: $\\frac{d}{dx}\\left(\\frac{x^{n+1}}{n+1}\\right) = \\frac{(n+1)x^n}{n+1} = x^n$. The exclusion $n \\neq -1$ is essential — for $n = -1$ the denominator would be $0$. The case $n = -1$ is handled separately in section 5 by the logarithm.</div></div>

<div class="calc-formula"><div class="formula-label">SUM AND CONSTANT-MULTIPLE RULES</div><div class="formula-main">$$\\int \\bigl[f(x) + g(x)\\bigr] dx \\;=\\; \\int f(x)\\,dx \\;+\\; \\int g(x)\\,dx, \\qquad \\int k f(x)\\,dx \\;=\\; k\\int f(x)\\,dx.$$</div><div class="formula-sub">Integration is <em>linear</em>: you may split a sum and pull constants out front, just like differentiation. There is, however, <strong>no product rule and no quotient rule</strong> for integration — those need more advanced techniques (substitution and integration by parts, taught at university level).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLES — POWER RULE</div><div class="example-body">
<strong>(a)</strong> $\\displaystyle \\int x^3\\,dx = \\frac{x^4}{4} + C$. &nbsp;&nbsp;<em>Check:</em> $\\bigl(\\tfrac{x^4}{4}\\bigr)' = x^3$. &#10003;<br><br>
<strong>(b)</strong> $\\displaystyle \\int x^5\\,dx = \\frac{x^6}{6} + C$. &nbsp;&nbsp;<em>Check:</em> $\\bigl(\\tfrac{x^6}{6}\\bigr)' = x^5$. &#10003;<br><br>
<strong>(c)</strong> $\\displaystyle \\int \\sqrt{x}\\,dx = \\int x^{1/2}\\,dx = \\frac{x^{3/2}}{3/2} + C = \\frac{2}{3}x^{3/2} + C$.<br><br>
<strong>(d)</strong> $\\displaystyle \\int \\frac{1}{x^2}\\,dx = \\int x^{-2}\\,dx = \\frac{x^{-1}}{-1} + C = -\\frac{1}{x} + C$.<br><br>
<strong>(e)</strong> $\\displaystyle \\int dx = \\int 1 \\cdot dx = x + C$ (the integral of $1$ is just $x$).
</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLES — COMBINING RULES</div><div class="example-body">
<strong>(a)</strong> $\\displaystyle \\int (3x^2 + 4x - 5)\\,dx \\;=\\; 3\\cdot\\frac{x^3}{3} + 4\\cdot\\frac{x^2}{2} - 5x + C \\;=\\; x^3 + 2x^2 - 5x + C$.<br><br>
<strong>(b)</strong> $\\displaystyle \\int 6x^2\\,dx \\;=\\; 6 \\cdot \\frac{x^3}{3} + C \\;=\\; 2x^3 + C$.<br><br>
<strong>(c)</strong> $\\displaystyle \\int \\bigl(x^4 - 2x + 7\\bigr) dx \\;=\\; \\frac{x^5}{5} - x^2 + 7x + C$.<br><br>
Each step uses linearity: split the sum, integrate each piece, pull constants out, and remember a <em>single</em> $C$ at the end (combining three separate constants $C_1 + C_2 + C_3$ produces just one $C$).
</div></div>

<div class="think-box"><div class="think-label">ONE C, NOT MANY</div><div class="think-body">In $\\int(3x^2 + 4x)\\,dx$ you might be tempted to write $x^3 + C_1 + 2x^2 + C_2$. Don't. The sum $C_1 + C_2$ is itself an arbitrary constant, so we simply call it $C$. Write only one $+\\,C$ at the very end of the final answer.</div></div>

<h2 class="lesson-title">5. Exponential and Logarithm</h2>

<p class="l-text">From Lesson 20 we know $(e^x)' = e^x$ and $(\\ln x)' = 1/x$. Reading these backwards gives:</p>

<div class="calc-formula"><div class="formula-label">EXPONENTIAL</div><div class="formula-main">$$\\int e^x\\,dx \\;=\\; e^x + C$$</div><div class="formula-sub">The unique function that is its own antiderivative (up to the constant). Differentiate the right side: $(e^x + C)' = e^x$. &#10003;</div></div>

<div class="calc-formula"><div class="formula-label">RECIPROCAL — THE MISSING POWER CASE</div><div class="formula-main">$$\\int \\frac{1}{x}\\,dx \\;=\\; \\ln|x| + C, \\qquad x \\neq 0$$</div><div class="formula-sub">This is the answer to the puzzle "what about $n = -1$ in the power rule?". The absolute value $|x|$ extends the formula to negative $x$: for $x < 0$ check that $\\frac{d}{dx}\\ln(-x) = \\frac{-1}{-x} = \\frac{1}{x}$ by the chain rule.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLES</div><div class="example-body">
<strong>(a)</strong> $\\displaystyle \\int (e^x + 2x)\\,dx \\;=\\; e^x + x^2 + C$.<br><br>
<strong>(b)</strong> $\\displaystyle \\int \\frac{3}{x}\\,dx \\;=\\; 3\\ln|x| + C$.<br><br>
<strong>(c)</strong> $\\displaystyle \\int \\Bigl(\\frac{5}{x} - e^x\\Bigr) dx \\;=\\; 5\\ln|x| - e^x + C$.<br><br>
<strong>(d)</strong> $\\displaystyle \\int \\frac{x^2 + 1}{x}\\,dx \\;=\\; \\int\\Bigl(x + \\frac{1}{x}\\Bigr) dx \\;=\\; \\frac{x^2}{2} + \\ln|x| + C$. &nbsp;&nbsp;<em>Trick:</em> first split the fraction algebraically, then integrate term by term.
</div></div>

<div class="think-box"><div class="think-label">WHY ABSOLUTE VALUE INSIDE THE LOG?</div><div class="think-body">Because $\\ln$ is only defined for positive numbers, but $1/x$ is defined for every nonzero $x$. Writing $\\ln|x|$ keeps both sides matched in domain: the antiderivative exists wherever $1/x$ does. On any interval that does not cross $0$ you can drop the bars, but the safe and complete form is always $\\ln|x| + C$.</div></div>

<h2 class="lesson-title">6. Trigonometric Integrals</h2>

<p class="l-text">Each of the six elementary trig derivatives gives a basic integral. Memorise these — they are unavoidable.</p>

<div class="calc-formula"><div class="formula-label">SIX BASIC TRIG INTEGRALS</div><div class="formula-main">$$\\begin{aligned}
\\int \\sin x\\,dx &\\;=\\; -\\cos x + C \\\\[4pt]
\\int \\cos x\\,dx &\\;=\\; \\sin x + C \\\\[4pt]
\\int \\sec^2 x\\,dx &\\;=\\; \\tan x + C \\\\[4pt]
\\int \\csc^2 x\\,dx &\\;=\\; -\\cot x + C \\\\[4pt]
\\int \\sec x \\tan x\\,dx &\\;=\\; \\sec x + C \\\\[4pt]
\\int \\csc x \\cot x\\,dx &\\;=\\; -\\csc x + C
\\end{aligned}$$</div><div class="formula-sub">Verify each by differentiating the right side. Notice the pattern: every integral whose derivative starts with a minus sign keeps that minus sign on the right.</div></div>

<div class="calc-example"><div class="example-label">WHY $\\int \\sin x\\,dx = -\\cos x + C$?</div><div class="example-body">
We know $(\\cos x)' = -\\sin x$. So $\\bigl(-\\cos x\\bigr)' = \\sin x$. That is, $-\\cos x$ is an antiderivative of $\\sin x$. Add $C$ and we are done. The sign-flip is the only thing to watch.
</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLES</div><div class="example-body">
<strong>(a)</strong> $\\displaystyle \\int (4\\sin x - 3\\cos x)\\,dx \\;=\\; -4\\cos x - 3\\sin x + C$.<br><br>
<strong>(b)</strong> $\\displaystyle \\int (\\sec^2 x + e^x)\\,dx \\;=\\; \\tan x + e^x + C$.<br><br>
<strong>(c)</strong> $\\displaystyle \\int (5x^2 - \\sin x)\\,dx \\;=\\; \\frac{5x^3}{3} + \\cos x + C$.<br><br>
<strong>(d) Using identities first.</strong> $\\displaystyle \\int \\tan^2 x\\,dx \\;=\\; \\int (\\sec^2 x - 1)\\,dx \\;=\\; \\tan x - x + C$ (we used $\\tan^2 x = \\sec^2 x - 1$).
</div></div>

<div class="think-box"><div class="think-label">A USEFUL PRE-PROCESSING HABIT</div><div class="think-body">Before integrating, look for an algebraic or trigonometric identity that simplifies the integrand. Examples: $\\sin^2 x + \\cos^2 x = 1$, $\\tan^2 x = \\sec^2 x - 1$, $\\cos 2x = 1 - 2\\sin^2 x$. Replacing a hard integrand by an equivalent easier one often turns an impossible-looking integral into one of the six basics.</div></div>

<p class="l-text">Before moving on, here is a one-glance reference of every basic antiderivative covered in sections 4–6. Pin this in memory — every elementary integral you will meet in high school is some combination of the rows below plus the linearity rules.</p>

<div style="overflow-x:auto;margin:1.4rem 0">
<table style="width:100%;border-collapse:collapse;background:rgba(20,20,25,0.55);color:rgba(235,230,220,0.94);font-size:0.93rem;border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden">
<thead>
<tr style="background:#3b82f6;color:#0b1020">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:1px solid rgba(255,255,255,0.18)">$f(x)$ &nbsp;(integrand)</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:1px solid rgba(255,255,255,0.18)">$F(x) = \\int f(x)\\,dx$ &nbsp;(antiderivative, $+C$ omitted)</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:1px solid rgba(255,255,255,0.18)">Condition / note</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x^n$</td><td style="padding:0.55rem 0.9rem">$\\dfrac{x^{n+1}}{n+1}$</td><td style="padding:0.55rem 0.9rem">$n \\neq -1$ (power rule)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{x}$</td><td style="padding:0.55rem 0.9rem">$\\ln|x|$</td><td style="padding:0.55rem 0.9rem">$x \\neq 0$ (covers $n = -1$)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$\\sin x$</td><td style="padding:0.55rem 0.9rem">$-\\cos x$</td><td style="padding:0.55rem 0.9rem">sign flip</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 0.9rem">$\\cos x$</td><td style="padding:0.55rem 0.9rem">$\\sin x$</td><td style="padding:0.55rem 0.9rem">no sign flip</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$\\sec^2 x$</td><td style="padding:0.55rem 0.9rem">$\\tan x$</td><td style="padding:0.55rem 0.9rem">$x \\neq \\tfrac{\\pi}{2} + k\\pi$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 0.9rem">$e^x$</td><td style="padding:0.55rem 0.9rem">$e^x$</td><td style="padding:0.55rem 0.9rem">unique self-antiderivative</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$a^x$</td><td style="padding:0.55rem 0.9rem">$\\dfrac{a^x}{\\ln a}$</td><td style="padding:0.55rem 0.9rem">$a > 0$, $a \\neq 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{1 + x^2}$</td><td style="padding:0.55rem 0.9rem">$\\arctan x$</td><td style="padding:0.55rem 0.9rem">defined for all real $x$</td></tr>
<tr><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{\\sqrt{1 - x^2}}$</td><td style="padding:0.55rem 0.9rem">$\\arcsin x$</td><td style="padding:0.55rem 0.9rem">$|x| < 1$</td></tr>
</tbody>
</table>
</div>

<div class="think-box"><div class="think-label">HOW TO USE THE TABLE</div><div class="think-body">Always remember to append "$+C$" to the antiderivative — the table drops it only to save space. To verify any row, differentiate the right column and check that you get the left column back. Two new rows you have not seen in the body of this lesson — $a^x \\to \\dfrac{a^x}{\\ln a}$ and the two inverse-trig integrals $\\dfrac{1}{1+x^2}, \\dfrac{1}{\\sqrt{1-x^2}}$ — appear on most national exam formula sheets, so it pays to memorise them now.</div></div>

<h2 class="lesson-title">7. Initial-Condition Problems</h2>

<div class="calc-highlight"><strong>The role of $C$.</strong> The indefinite integral gives a whole family. To pick out one specific member, we need extra information — usually a single point $(a, b)$ that the antiderivative must pass through, i.e. $F(a) = b$. This extra fact is called an <em>initial condition</em>.</div>

<p class="l-text">The recipe is always the same:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1</div><div class="card-body">Compute the indefinite integral, keeping the unknown $C$ in the answer.</div></div>
<div class="calc-card"><div class="card-title">Step 2</div><div class="card-body">Plug in the given point: replace $x$ by $a$ and demand that $F(a) = b$.</div></div>
<div class="calc-card"><div class="card-title">Step 3</div><div class="card-body">Solve the resulting equation for $C$.</div></div>
<div class="calc-card"><div class="card-title">Step 4</div><div class="card-body">Write the final particular antiderivative with that specific $C$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">
<strong>Find</strong> $F(x)$ such that $F'(x) = 3x^2$ and $F(0) = 5$.<br><br>
<em>Step 1:</em> $\\displaystyle F(x) = \\int 3x^2\\,dx = x^3 + C$.<br><br>
<em>Step 2:</em> use $F(0) = 5$: &nbsp; $0^3 + C = 5 \\;\\Rightarrow\\; C = 5$.<br><br>
<em>Step 3:</em> $\\boxed{F(x) = x^3 + 5}$.<br><br>
<em>Check:</em> $F'(x) = 3x^2$ &#10003; and $F(0) = 0 + 5 = 5$ &#10003;.
</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">
<strong>Find</strong> $F(x)$ with $F'(x) = \\cos x$ and $F(\\pi/2) = 3$.<br><br>
$F(x) = \\sin x + C$.<br>
$F(\\pi/2) = \\sin(\\pi/2) + C = 1 + C = 3 \\;\\Rightarrow\\; C = 2$.<br>
$\\boxed{F(x) = \\sin x + 2}$.
</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">
<strong>Find</strong> $F(x)$ with $F'(x) = e^x + \\frac{1}{x}$ and $F(1) = 0$.<br><br>
$F(x) = e^x + \\ln|x| + C$.<br>
$F(1) = e^1 + \\ln 1 + C = e + 0 + C = 0 \\;\\Rightarrow\\; C = -e$.<br>
$\\boxed{F(x) = e^x + \\ln|x| - e}$.
</div></div>

<div class="think-box"><div class="think-label">WHY ONE EQUATION DETERMINES ONE CONSTANT</div><div class="think-body">The family $F(x) + C$ has exactly one free parameter, $C$. One numerical equation ($F$ at one point equals one number) determines one unknown. This is the same reason that one initial position is enough to specify a single curve from the family — and is also why physics motion problems need <em>two</em> initial conditions (the initial position <em>and</em> the initial velocity), as we will see next.</div></div>

<h2 class="lesson-title">8. Motion Problems — Acceleration to Position</h2>

<p class="l-text">In physics, position $s(t)$, velocity $v(t)$, and acceleration $a(t)$ form a derivative chain:</p>

<div class="calc-formula"><div class="formula-main">$$v(t) \\;=\\; s'(t), \\qquad a(t) \\;=\\; v'(t) \\;=\\; s''(t).$$</div></div>

<p class="l-text">Knowing $s$, two differentiations give you $v$ and $a$ — straightforward. The interesting reverse problem: <strong>given $a$, recover $v$ and then $s$.</strong> Each step is an integration and brings one new constant:</p>

<div class="calc-formula"><div class="formula-label">INTEGRATING THE MOTION CHAIN</div><div class="formula-main">$$v(t) \\;=\\; \\int a(t)\\,dt + C_1, \\qquad s(t) \\;=\\; \\int v(t)\\,dt + C_2.$$</div><div class="formula-sub">Two integrations $\\Rightarrow$ two unknown constants. To pin them down we need two initial conditions: usually the starting velocity $v(0) = v_0$ and the starting position $s(0) = s_0$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — FREE FALL ON EARTH</div><div class="example-body">
A ball is thrown straight up from the ground with initial speed $v_0 = 20$ m/s. Gravity pulls down with constant acceleration $a(t) = -10$ m/s² (we use $g \\approx 10$). Find $v(t)$ and $s(t)$, the time it takes to come back to the ground, and the maximum height.<br><br>
<em>Step 1 — velocity.</em>
$\\displaystyle v(t) = \\int (-10)\\,dt = -10t + C_1.$<br>
Initial condition $v(0) = 20$: $-10(0) + C_1 = 20 \\Rightarrow C_1 = 20$. So $\\;v(t) = -10t + 20$.<br><br>
<em>Step 2 — position.</em>
$\\displaystyle s(t) = \\int v(t)\\,dt = \\int (-10t + 20)\\,dt = -5t^2 + 20t + C_2.$<br>
Initial condition $s(0) = 0$ (starts on the ground): $C_2 = 0$. So $\\;s(t) = -5t^2 + 20t$.<br><br>
<em>Maximum height:</em> happens when $v(t) = 0$, i.e. $-10t + 20 = 0 \\Rightarrow t = 2$ s. Plug into $s$: $s(2) = -5(4) + 20(2) = -20 + 40 = 20$ m.<br><br>
<em>Time to return:</em> set $s(t) = 0$: $-5t^2 + 20t = 0 \\Rightarrow t(-5t + 20) = 0 \\Rightarrow t = 0$ or $t = 4$. The ball returns at $t = 4$ s.<br><br>
<strong>Result:</strong> $v(t) = -10t + 20$, $s(t) = -5t^2 + 20t$, max height 20 m, total flight 4 s.
</div></div>

<div id="plot-l27-motion-en" class="plotly-graph" style="height:520px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ts=[];for(var i=0;i<=40;i++)ts.push(i/10);
var av=ts.map(function(){return -10;});
var vv=ts.map(function(t){return -10*t+20;});
var sv=ts.map(function(t){return -5*t*t+20*t;});
var tA={x:ts,y:av,mode:"lines",name:"a(t) = −10",line:{color:"#f87171",width:2.5},xaxis:"x1",yaxis:"y1"};
var tV={x:ts,y:vv,mode:"lines",name:"v(t) = −10t + 20",line:{color:"#60a5fa",width:2.5},xaxis:"x2",yaxis:"y2"};
var tS={x:ts,y:sv,mode:"lines",name:"s(t) = −5t² + 20t",line:{color:"#c8a96e",width:2.5},xaxis:"x3",yaxis:"y3"};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},
grid:{rows:3,columns:1,pattern:"independent"},
xaxis1:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"t (s)"},
yaxis1:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"a (m/s²)",range:[-12,2]},
xaxis2:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"t (s)"},
yaxis2:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"v (m/s)",range:[-22,22]},
xaxis3:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"t (s)"},
yaxis3:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"s (m)",range:[0,25]},
margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.10}};
Plotly.newPlot("plot-l27-motion-en",[tA,tV,tS],layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> the three layers of the free-fall problem stacked on top of each other. <em>Top</em> (red): acceleration $a = -10$ is a flat line — gravity is constant. <em>Middle</em> (blue): velocity $v(t) = -10t + 20$ is a straight line obtained by integrating $a$; it crosses zero at $t = 2$ s, when the ball momentarily stops at the top. <em>Bottom</em> (gold): position $s(t) = -5t^2 + 20t$ is a downward-opening parabola obtained by integrating $v$; it reaches the maximum height of 20 m at $t = 2$ s and returns to $0$ at $t = 4$ s. Each row is the integral of the row above.</div></div>

<div class="think-box"><div class="think-label">A USEFUL FORMULA TO MEMORISE</div><div class="think-body">For constant acceleration $a$, the same two integrations always give
$$v(t) = at + v_0, \\qquad s(t) = \\tfrac{1}{2}a t^2 + v_0 t + s_0.$$
You will meet this formula in every high-school physics problem about falling objects, accelerating cars, and projectiles. Now you know exactly where it comes from — two integrations of a constant.</div></div>

<h2 class="lesson-title">9. Practice Set — 8 Classical Problems</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body">
Compute $\\displaystyle \\int (4x^3 - 6x^2 + 2x - 7)\\,dx$.<br><br>
<em>Solution:</em> integrate term by term, divide each power by its new exponent.
$$\\int 4x^3\\,dx = x^4, \\;\\; \\int (-6x^2)\\,dx = -2x^3, \\;\\; \\int 2x\\,dx = x^2, \\;\\; \\int (-7)\\,dx = -7x.$$
$\\boxed{x^4 - 2x^3 + x^2 - 7x + C}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body">
Compute $\\displaystyle \\int \\Bigl(\\sqrt{x} + \\frac{1}{\\sqrt{x}}\\Bigr) dx$.<br><br>
<em>Solution:</em> rewrite with fractional powers. $\\sqrt{x} = x^{1/2}$, $1/\\sqrt{x} = x^{-1/2}$.
$$\\int x^{1/2}\\,dx = \\frac{x^{3/2}}{3/2} = \\frac{2}{3}x^{3/2}, \\qquad \\int x^{-1/2}\\,dx = \\frac{x^{1/2}}{1/2} = 2x^{1/2}.$$
$\\boxed{\\dfrac{2}{3}x^{3/2} + 2\\sqrt{x} + C}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body">
Compute $\\displaystyle \\int \\bigl(2e^x - \\frac{3}{x}\\bigr) dx$.<br><br>
$\\boxed{2e^x - 3\\ln|x| + C}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4</div><div class="example-body">
Compute $\\displaystyle \\int (5\\sin x + 2\\cos x - 3\\sec^2 x)\\,dx$.<br><br>
$\\boxed{-5\\cos x + 2\\sin x - 3\\tan x + C}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — Initial Condition</div><div class="example-body">
Find $F$ with $F'(x) = 6x^2 - 4x + 3$ and $F(1) = 10$.<br><br>
$F(x) = 2x^3 - 2x^2 + 3x + C$.<br>
$F(1) = 2 - 2 + 3 + C = 3 + C = 10 \\Rightarrow C = 7$.<br>
$\\boxed{F(x) = 2x^3 - 2x^2 + 3x + 7}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — Initial Condition with Trig</div><div class="example-body">
Find $F$ with $F'(x) = \\cos x + 2x$ and $F(0) = 4$.<br><br>
$F(x) = \\sin x + x^2 + C$. &nbsp;&nbsp;$F(0) = 0 + 0 + C = 4 \\Rightarrow C = 4$.<br>
$\\boxed{F(x) = \\sin x + x^2 + 4}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — Motion</div><div class="example-body">
A particle has $a(t) = 6t$ m/s², $v(0) = 4$ m/s, $s(0) = 0$. Find $v(t)$ and $s(t)$.<br><br>
$v(t) = \\int 6t\\,dt = 3t^2 + C_1$. &nbsp;Apply $v(0) = 4$: $C_1 = 4$. &nbsp;$v(t) = 3t^2 + 4$.<br>
$s(t) = \\int (3t^2 + 4)\\,dt = t^3 + 4t + C_2$. &nbsp;Apply $s(0) = 0$: $C_2 = 0$. &nbsp;$s(t) = t^3 + 4t$.<br>
$\\boxed{v(t) = 3t^2 + 4 \\;\\text{m/s}, \\quad s(t) = t^3 + 4t \\;\\text{m}}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — Algebraic Pre-Processing</div><div class="example-body">
Compute $\\displaystyle \\int \\frac{x^3 + 2x^2 + 1}{x^2}\\,dx$.<br><br>
<em>Trick:</em> first divide each term in the numerator by $x^2$, turning the messy fraction into a simple sum:
$$\\frac{x^3 + 2x^2 + 1}{x^2} = x + 2 + x^{-2}.$$
Now integrate term by term:
$$\\int x\\,dx = \\frac{x^2}{2}, \\;\\; \\int 2\\,dx = 2x, \\;\\; \\int x^{-2}\\,dx = \\frac{x^{-1}}{-1} = -\\frac{1}{x}.$$
$\\boxed{\\dfrac{x^2}{2} + 2x - \\dfrac{1}{x} + C}$.
</div></div>

<div class="l-note"><strong>What you learned.</strong> Antidifferentiation reverses differentiation, but the answer is always a <em>family</em> of functions differing by an additive constant $C$. The basic rules — power, exponential, logarithm, six trig — let you handle every elementary integrand you will meet in school. An initial condition $F(a) = b$ pins down a single member of the family. Two integrations turn an acceleration into a position, with one initial condition per integration. Lesson 28 introduces the <em>definite</em> integral — what happens when we use the same symbol $\\int$ to compute an actual <em>number</em> (an area under a curve) — and discovers the breathtaking Fundamental Theorem that ties indefinite and definite integrals together.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Yirmi altı ders boyunca sürekli aynı şeyi sordunuz: bir $F$ fonksiyonu verildiğinde eğimi $F'$ nedir?</strong> Bugün soruyu tersine çeviriyoruz. Bir $f$ eğimi verildiğinde, eğimi $f$ olan fonksiyon hangisidir? Bu tersine problem <em>ters türev</em> (antiderivative) adını alır ve onu temsil eden uzatılmış $S$ harfi $\\int$ — kalkülüsün ikinci büyük karakteridir, alıştığınız üs çizgisi $'$ kadar önemlidir.</p>

<p class="l-text">Bir ters türev asla tek değildir. Basit polinom $F(x) = x^2$ türev olarak $2x$ verir, ama $x^2 + 5$ de aynı türeve sahip, $x^2 - 17$ de öyle. Her dikey kaydırma eğimi değiştirmez. Bu gerçeği yakalamak için cevabın sonuna her zaman gizemli bir $C$ harfi yazarız — <strong>integral sabiti</strong>. Bu dersin sonunda $C$'nin tam olarak ne anlama geldiğini, başlangıç koşulu verildiğinde doğru olanı nasıl bulacağınızı ve fizikteki her hareket probleminin — "ivmeyi biliyorsam konum nedir?" — aslında gizli bir ters türev problemi olduğunu anlayacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tanımı bilirsiniz: bir aralıkta $F'(x) = f(x)$ ise $F$, $f$'nin ters türevidir</li>
<li>Belirsiz integral notasyonu $\\int f(x)\\,dx = F(x) + C$'yi okur ve her sembolün anlamını söylersiniz</li>
<li>$+\\,C$ sabitinin neden zorunlu olduğunu ve neden sonsuz ters türev bulunduğunu açıklarsınız</li>
<li>Temel kuralları uygularsınız: kuvvet kuralı $\\int x^n dx$, sabit, toplam ve sabit çarpan</li>
<li>Özel fonksiyonlar $e^x$ ve $1/x$'i, ayrıca altı temel trigonometrik yapıtaşını integrallersiniz</li>
<li>$F(a) = b$ başlangıç koşulunu kullanarak özel ters türevi belirlersiniz</li>
<li>Fizik hareket problemlerini çözersiniz: $a(t)$ verildiğinde iki integrasyon ve iki başlangıç koşuluyla $v(t)$ ve $s(t)$'yi bulursunuz</li>
</ul>
</div>

<h2 class="lesson-title">1. Ters Türev Problemi</h2>

<div class="calc-highlight"><strong>Günlük örnek.</strong> Bir saat boyunca arabanın hız göstergesini izliyor ve her an hızı not ediyorsunuz. Her andaki konumunu yeniden kurabilir misiniz? Evet — bu tam olarak bir ters türev problemidir. Hız, konumun türevidir; öyleyse konum hızın bir ters türevidir. Yalnızca hız göstergesinden çıkaramayacağınız tek şey <em>arabanın nereden başladığı</em>; cevabı kesinleştirmek için tek ek bilgiye — başlangıç konumuna — ihtiyacınız var.</div>

<p class="l-text">Şimdiye kadar her türev problemi şöyleydi: <em>işte $F$, türev $f = F'$'yi hesapla.</em> Tersine çevirin. Birisi size bir $f$ fonksiyonu söylesin ve $F'(x) = f(x)$ koşulunu sağlayan bir $F$ üretmenizi istesin:</p>

<div class="calc-formula"><div class="formula-main">$$F'(x) \\;=\\; f(x).$$</div></div>

<p class="l-text">Böyle bir $F$, $f$'nin <strong>ters türevi</strong> olarak adlandırılır (eş anlamlılar: <em>ilkel fonksiyon</em>, <em>belirsiz integral</em>). "Ters türev" sözcüğü tam olarak "türevi $f$ olan fonksiyon" anlamına gelir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İleri yön</div><div class="card-body">Bir fonksiyon al, eğimini hesapla. Ders 14'ten beri yaptığınız işlem. Örnek: $F(x) = x^3 \\;\\Rightarrow\\; F'(x) = 3x^2$.</div></div>
<div class="calc-card"><div class="card-title">Ters yön</div><div class="card-body">Bir eğimle başla, fonksiyonu bul. Örnek: $f(x) = 3x^2$ verildi, $F' = f$ koşulunu sağlayan bir $F$ tahmin edebilir miyiz? Evet: $F(x) = x^3$ çalışır (ve $x^3 + 7$, $x^3 - 2$, ... de çalışır).</div></div>
<div class="calc-card"><div class="card-title">Neden daha zor</div><div class="card-body">Türev mekanik bir tariftir. Ters türev daha çok bulmaca çözmeye benzer — hangi fonksiyonların türevi alındığında verilen ifadeyi vereceğini <em>tanımak</em> gerekir. Bu ders temel örüntüleri öğretir.</div></div>
</div>

<p class="l-text">İşte üç küçük bulmaca. Devam etmeden önce her birini zihninizde deneyin.</p>

<div class="calc-example"><div class="example-label">ISINMA SORULARI</div><div class="example-body">
<strong>(a)</strong> $F'(x) = 2x$ koşulunu sağlayan $F$'yi bulun. &nbsp;&nbsp;<em>Cevap:</em> $F(x) = x^2$ (çünkü $(x^2)' = 2x$).<br><br>
<strong>(b)</strong> $F'(x) = \\cos x$ koşulunu sağlayan $F$'yi bulun. &nbsp;&nbsp;<em>Cevap:</em> $F(x) = \\sin x$ (çünkü $(\\sin x)' = \\cos x$).<br><br>
<strong>(c)</strong> $F'(x) = e^x$ koşulunu sağlayan $F$'yi bulun. &nbsp;&nbsp;<em>Cevap:</em> $F(x) = e^x$ (çünkü $(e^x)' = e^x$).
</div></div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">(a) sorusunda $F(x) = x^2$ <em>tek</em> cevap mı? Peki ya $G(x) = x^2 + 100$? Türev alalım: $G'(x) = 2x$ — aynı sonuç. Sabit $100$ yok olur. Demek ki hem $F$ hem $G$ doğru ters türevdir. Bu gözleme tutunun; 3. bölüm onu dersin en önemli fikrine dönüştürecek.</div></div>

<h2 class="lesson-title">2. Belirsiz İntegral Notasyonu</h2>

<p class="l-text">Leibniz, ters türev için zarif bir sembol önerdi. $S$ harfini (Latincede "toplam" anlamına gelen <em>summa</em>'nın baş harfi) bugün her yerde gördüğünüz uzatılmış</p>

<div class="calc-formula"><div class="formula-main">$$\\int$$</div></div>

<p class="l-text">biçimine dönüştürdü. Diferansiyel $dx$ ile birlikte <strong>belirsiz integral</strong>'i oluşturur:</p>

<div class="calc-formula"><div class="formula-label">BELİRSİZ İNTEGRAL</div><div class="formula-main">$$\\int f(x)\\,dx \\;=\\; F(x) + C, \\qquad \\text{burada } F'(x) = f(x).$$</div><div class="formula-sub">Sesli okuma: "$f$'nin $x$'e göre integrali $F(x)$ artı $C$'ye eşittir."</div></div>

<p class="l-text">Sembolün her parçası bir anlam taşır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\int$ (integral işareti)</div><div class="card-body">Uzatılmış $S$. "Türevi sonraki ifade olan fonksiyonu bul" der.</div></div>
<div class="calc-card"><div class="card-title">$f(x)$ (integrant)</div><div class="card-body">Ters türevini aradığımız fonksiyon — bilinen eğim.</div></div>
<div class="calc-card"><div class="card-title">$dx$ (diferansiyel)</div><div class="card-body">İntegrasyon değişkeninin $x$ olduğunu söyler. $\\int 2xt\\, dx$'te $x$ değişken, $t$ sabittir; $\\int 2xt\\, dt$ bunun tam tersi anlamına gelir.</div></div>
<div class="calc-card"><div class="card-title">$F(x)$ (ters türev)</div><div class="card-body">$F'(x) = f(x)$ koşulunu sağlayan herhangi belirli bir fonksiyon.</div></div>
<div class="calc-card"><div class="card-title">$+\\,C$ (sabit)</div><div class="card-body">Sonsuz ters türevin bir sabitle farklılaştığını hatırlatır. 3. bölüm sebebini ayrıntılı açıklar.</div></div>
</div>

<p class="l-text">"Belirsiz" sözcüğü kilittir. Sonuç tek bir sayı değildir — her $C$ değeri için bir tane olmak üzere koca bir <em>aile</em> fonksiyondur. Buna karşılık <em>belirli</em> integral (Ders 28) bir <em>sayı</em> verecek (bir alan ifadesi). Aynı $\\int$ sembolü her ikisinde de görünür ama anlamı biraz farklıdır.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — NOTASYONU OKUMAK</div><div class="example-body">
$\\displaystyle \\int 2x\\,dx \\;=\\; x^2 + C$ ifadesi şöyle okunur:<br><br>
"$2x$'in $x$'e göre integrali, $x^2$ artı $C$'ye eşittir."<br><br>
Doğrulamak için sağ tarafın türevini alın: $\\frac{d}{dx}(x^2 + C) = 2x + 0 = 2x$. Cevabın türevi integranttı geri verdi — ters türevin yapması gereken tam olarak budur.
</div></div>

<div class="think-box"><div class="think-label">ALTIN KONTROL ALIŞKANLIĞI</div><div class="think-body">Her integrasyondan sonra <strong>cevabınızın türevini alın</strong> ve integrantı geri elde edip etmediğinizi kontrol edin. $\\int 3x^2\\,dx = x^3 + C$ bulduysanız türevin $3x^2$ vermesi cevabın doğru olduğunu gösterir. Bu kontrolü otomatikleştirin. Neredeyse her dikkatsizlik hatasını yakalar.</div></div>

<h2 class="lesson-title">3. Neden $+\\,C$? — Sonsuz Sayıda Ters Türev</h2>

<div class="calc-highlight"><strong>Temel gerçek.</strong> Eğer $F$, $f$'nin bir ters türeviyse, <em>her</em> reel sabit $C$ için $F + C$ de ters türevdir. Tek bir ters türev yoktur — sonsuz tane vardır ve hepsi birbirine bir dikey kaydırmayla bağlıdır.</div>

<p class="l-text"><strong>Neden doğru?</strong> $F'(x) = f(x)$ olsun ve $G(x) = F(x) + C$ tanımlayalım. $G$'nin türevini alalım:</p>

<div class="calc-formula"><div class="formula-main">$$G'(x) \\;=\\; (F(x) + C)' \\;=\\; F'(x) + C' \\;=\\; f(x) + 0 \\;=\\; f(x).$$</div></div>

<p class="l-text">Sabit, türev alındığında sıfır olur (yatay doğrunun eğimi sıfırdır), bu yüzden $G$, $F$ ile aynı türevi paylaşır. Bir sabit eklemek türev için görünmezdir.</p>

<p class="l-text"><strong>Tüm ters türevler bu mu?</strong> Evet. Ders 22'nin bir teoremi (Ortalama Değer Teoremi'nin sonucu) şöyle der: bir aralıkta aynı türeve sahip iki fonksiyon bir sabitle farklılaşır. Yani <em>bir</em> ters türev $F$ bulduğumuzda, diğer her ters türev zorunlu olarak $F + C$ biçimindedir. Beklenmedik bir alternatif yoktur.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — PARALEL EĞRİ AİLESİ</div><div class="example-body">
$\\displaystyle \\int 2x\\,dx \\;=\\; x^2 + C$.<br><br>
$C = 0$ seçin: $F_0(x) = x^2$ (orijinden geçen parabol).<br>
$C = 3$ seçin: $F_3(x) = x^2 + 3$ (aynı parabol 3 birim yukarı kaymış).<br>
$C = -3$ seçin: $F_{-3}(x) = x^2 - 3$ (aynı parabol 3 birim aşağı kaymış).<br><br>
Üçünün de her $x$ değerinde eğimi $2x$'tir. Yalnızca yükseklikte ayrışırlar — $x = 1$ noktasında sırasıyla $1$, $4$, $-2$ yüksekliklerinde dururlar, ama $x = 1$ noktasındaki teğet doğrusunun eğimi her birinde $2 \\cdot 1 = 2$'dir. Aşağıdaki grafik bunu görselleştirir.
</div></div>

<div id="plot-l27-family-tr" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-30;i<=30;i++)xs.push(i/10);
var y1=xs.map(function(x){return x*x-3;});
var y2=xs.map(function(x){return x*x;});
var y3=xs.map(function(x){return x*x+3;});
var t1={x:xs,y:y1,mode:"lines",name:"F(x) = x² − 3 (C = −3)",line:{color:"#f87171",width:2.5}};
var t2={x:xs,y:y2,mode:"lines",name:"F(x) = x² (C = 0)",line:{color:"#c8a96e",width:2.5}};
var t3={x:xs,y:y3,mode:"lines",name:"F(x) = x² + 3 (C = 3)",line:{color:"#60a5fa",width:2.5}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-3.2,3.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[-4,12]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-l27-family-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $f(x) = 2x$'in üç ters türevi, $C = -3, 0, 3$ değerleri için. Eğriler <em>paralel</em>dir: herhangi sabit bir $x$'te teğet doğrularının eğimi aynı ($2x$); eğriler birbirinden yalnızca sabit bir dikey kaymayla farklılaşır. $\\{x^2 + C : C \\in \\mathbb{R}\\}$ sonsuz ailesi düzlemi böyle kaymış kopyalarla doldurur.</div></div>

<div class="think-box"><div class="think-label">GEOMETRİK RESİM</div><div class="think-body">Türev $f(x) = 2x$'i her $x$ için bir "eğim reçetesi" gibi düşünün. Reçete, başladığınız yükseklikten bağımsızdır. Dolayısıyla <em>herhangi</em> bir başlangıç yüksekliği seçip geçerli bir ters türev üretebilirsiniz — paraboli yukarı aşağı kaydırmak eğimini değiştirmez. $C$ sabiti tam olarak bu başlangıç yüksekliği seçimini kaydeder.</div></div>

<p class="l-text">Aynı fikri farklı bir integrant için tekrarlayalım. $\\int x\\,dx = \\frac{x^2}{2} + C$ olduğunu düşünün. $C$'yi $C = -2, -1, 0, 1, 2$ değerleri arasında gezdirin; karşınıza beş paralel parabol çıkar — ailenin her üyesi her $x$'te $x$ eğimini taşır. Aşağıdaki beş eğri tam tam birer birim aralıklı dikey kopyalardır; "$+C$" tam anlamıyla bir eğriyi diğerine bağlayan dikey kaymadır.</p>

<div id="plot-l27-family-extra-tr" class="plotly-graph" style="height:400px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-30;i<=30;i++)xs.push(i/10);
var mkY=function(C){return xs.map(function(x){return 0.5*x*x+C;});};
var Cs=[-2,-1,0,1,2];
var colors=["#f87171","#fbbf24","#c8a96e","#60a5fa","#3b82f6"];
var traces=Cs.map(function(C,i){return {x:xs,y:mkY(C),mode:"lines",name:"F(x) = x²/2 + ("+C+")",line:{color:colors[i],width:2.5}};});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-3.2,3.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"F(x) = x²/2 + C",range:[-3,7]},margin:{t:30,r:30,b:65,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.28}};
Plotly.newPlot("plot-l27-family-extra-tr",traces,layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $F(x) = \\frac{x^2}{2} + C$ ailesi, $C \\in \\{-2, -1, 0, 1, 2\\}$ değerleri için — hepsi $f(x) = x$'in ters türevleri. Herhangi sabit bir $x$'te beş eğri aynı $x$ eğimini taşır; birbirinin mükemmel dikey kopyalarıdır. $C$'yi seçmek tam olarak bu sonsuz paralel merdivenden hangi basamağı istediğinizi seçmektir. Bir başlangıç koşulu $F(a) = b$ (bölüm 7) bu basamaklardan birini ayıklar.</div></div>

<h2 class="lesson-title">4. Temel İntegrasyon Kuralları</h2>

<p class="l-text">Her türev kuralının, tersine okunarak elde edilen bir integral karşılığı vardır. En yaygın üç tanesi aşağıdadır.</p>

<div class="calc-formula"><div class="formula-label">SABİT KURALI</div><div class="formula-main">$$\\int k\\,dx \\;=\\; kx + C \\qquad (k \\text{ sabit})$$</div><div class="formula-sub">Çünkü $(kx)' = k$.</div></div>

<div class="calc-formula"><div class="formula-label">KUVVET KURALI</div><div class="formula-main">$$\\int x^n\\,dx \\;=\\; \\frac{x^{n+1}}{n+1} + C \\qquad (n \\neq -1)$$</div><div class="formula-sub">Sağ tarafın türevini alın: $\\frac{d}{dx}\\left(\\frac{x^{n+1}}{n+1}\\right) = \\frac{(n+1)x^n}{n+1} = x^n$. $n \\neq -1$ istisnası vazgeçilmezdir — $n = -1$ için payda $0$ olurdu. $n = -1$ durumu bölüm 5'te logaritma ile özel olarak ele alınır.</div></div>

<div class="calc-formula"><div class="formula-label">TOPLAM VE SABİT ÇARPAN KURALLARI</div><div class="formula-main">$$\\int \\bigl[f(x) + g(x)\\bigr] dx \\;=\\; \\int f(x)\\,dx \\;+\\; \\int g(x)\\,dx, \\qquad \\int k f(x)\\,dx \\;=\\; k\\int f(x)\\,dx.$$</div><div class="formula-sub">İntegrasyon <em>doğrusaldır</em>: bir toplamı parçalayabilir, sabitleri dışarı çıkarabilirsiniz — tıpkı türevde olduğu gibi. Ancak integrasyon için <strong>çarpım kuralı ve bölüm kuralı yoktur</strong> — onlar daha ileri tekniklere (substitüsyon ve kısmi integrasyon, üniversitede) ihtiyaç duyar.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEKLER — KUVVET KURALI</div><div class="example-body">
<strong>(a)</strong> $\\displaystyle \\int x^3\\,dx = \\frac{x^4}{4} + C$. &nbsp;&nbsp;<em>Kontrol:</em> $\\bigl(\\tfrac{x^4}{4}\\bigr)' = x^3$. &#10003;<br><br>
<strong>(b)</strong> $\\displaystyle \\int x^5\\,dx = \\frac{x^6}{6} + C$. &nbsp;&nbsp;<em>Kontrol:</em> $\\bigl(\\tfrac{x^6}{6}\\bigr)' = x^5$. &#10003;<br><br>
<strong>(c)</strong> $\\displaystyle \\int \\sqrt{x}\\,dx = \\int x^{1/2}\\,dx = \\frac{x^{3/2}}{3/2} + C = \\frac{2}{3}x^{3/2} + C$.<br><br>
<strong>(d)</strong> $\\displaystyle \\int \\frac{1}{x^2}\\,dx = \\int x^{-2}\\,dx = \\frac{x^{-1}}{-1} + C = -\\frac{1}{x} + C$.<br><br>
<strong>(e)</strong> $\\displaystyle \\int dx = \\int 1 \\cdot dx = x + C$ ($1$'in integrali sadece $x$).
</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEKLER — KURALLARI BİRLEŞTİRMEK</div><div class="example-body">
<strong>(a)</strong> $\\displaystyle \\int (3x^2 + 4x - 5)\\,dx \\;=\\; 3\\cdot\\frac{x^3}{3} + 4\\cdot\\frac{x^2}{2} - 5x + C \\;=\\; x^3 + 2x^2 - 5x + C$.<br><br>
<strong>(b)</strong> $\\displaystyle \\int 6x^2\\,dx \\;=\\; 6 \\cdot \\frac{x^3}{3} + C \\;=\\; 2x^3 + C$.<br><br>
<strong>(c)</strong> $\\displaystyle \\int \\bigl(x^4 - 2x + 7\\bigr) dx \\;=\\; \\frac{x^5}{5} - x^2 + 7x + C$.<br><br>
Her adım doğrusallığı kullanır: toplamı parçala, her bir terimi integralle, sabitleri dışarı çıkar ve sonda <em>tek</em> bir $C$ yaz (üç farklı sabiti $C_1 + C_2 + C_3$ toplamak yine tek bir sabit verir, ona $C$ deriz).
</div></div>

<div class="think-box"><div class="think-label">TEK $C$, ÇOK DEĞİL</div><div class="think-body">$\\int(3x^2 + 4x)\\,dx$'te $x^3 + C_1 + 2x^2 + C_2$ yazma yanılgısına düşmeyin. $C_1 + C_2$ toplamı zaten keyfi bir sabittir, ona basitçe $C$ deriz. Cevabın en sonunda yalnızca tek bir $+\\,C$ yazın.</div></div>

<h2 class="lesson-title">5. Üstel ve Logaritma</h2>

<p class="l-text">Ders 20'den $(e^x)' = e^x$ ve $(\\ln x)' = 1/x$ olduğunu biliyoruz. Bunları tersine okuyalım:</p>

<div class="calc-formula"><div class="formula-label">ÜSTEL</div><div class="formula-main">$$\\int e^x\\,dx \\;=\\; e^x + C$$</div><div class="formula-sub">Kendi ters türevi olan tek fonksiyon (sabite kadar). Sağ tarafın türevi: $(e^x + C)' = e^x$. &#10003;</div></div>

<div class="calc-formula"><div class="formula-label">KARŞIT — EKSİK KUVVET DURUMU</div><div class="formula-main">$$\\int \\frac{1}{x}\\,dx \\;=\\; \\ln|x| + C, \\qquad x \\neq 0$$</div><div class="formula-sub">Bu, "kuvvet kuralında $n = -1$ ne olur?" bulmacasının cevabıdır. Mutlak değer $|x|$ formülü negatif $x$'lere de genişletir: $x < 0$ için zincir kuralıyla $\\frac{d}{dx}\\ln(-x) = \\frac{-1}{-x} = \\frac{1}{x}$ kontrolünü yapabilirsiniz.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEKLER</div><div class="example-body">
<strong>(a)</strong> $\\displaystyle \\int (e^x + 2x)\\,dx \\;=\\; e^x + x^2 + C$.<br><br>
<strong>(b)</strong> $\\displaystyle \\int \\frac{3}{x}\\,dx \\;=\\; 3\\ln|x| + C$.<br><br>
<strong>(c)</strong> $\\displaystyle \\int \\Bigl(\\frac{5}{x} - e^x\\Bigr) dx \\;=\\; 5\\ln|x| - e^x + C$.<br><br>
<strong>(d)</strong> $\\displaystyle \\int \\frac{x^2 + 1}{x}\\,dx \\;=\\; \\int\\Bigl(x + \\frac{1}{x}\\Bigr) dx \\;=\\; \\frac{x^2}{2} + \\ln|x| + C$. &nbsp;&nbsp;<em>Püf nokta:</em> önce kesri cebirsel olarak ayır, sonra terim terim integralle.
</div></div>

<div class="think-box"><div class="think-label">NEDEN MUTLAK DEĞER LOG'UN İÇİNDE?</div><div class="think-body">Çünkü $\\ln$ yalnızca pozitif sayılar için tanımlıdır, oysa $1/x$ sıfırdan farklı her $x$ için tanımlıdır. $\\ln|x|$ yazmak iki tarafın tanım kümesini eşler: ters türev, $1/x$'in tanımlı olduğu her yerde tanımlanır. Sıfırı içermeyen herhangi bir aralıkta mutlak değer çubukları kaldırılabilir, ama güvenli ve tam form her zaman $\\ln|x| + C$'dir.</div></div>

<h2 class="lesson-title">6. Trigonometrik İntegraller</h2>

<p class="l-text">Altı temel trigonometrik türevin her biri bir temel integral verir. Bunları ezberleyin — kaçınılmazdırlar.</p>

<div class="calc-formula"><div class="formula-label">ALTI TEMEL TRİGONOMETRİK İNTEGRAL</div><div class="formula-main">$$\\begin{aligned}
\\int \\sin x\\,dx &\\;=\\; -\\cos x + C \\\\[4pt]
\\int \\cos x\\,dx &\\;=\\; \\sin x + C \\\\[4pt]
\\int \\sec^2 x\\,dx &\\;=\\; \\tan x + C \\\\[4pt]
\\int \\csc^2 x\\,dx &\\;=\\; -\\cot x + C \\\\[4pt]
\\int \\sec x \\tan x\\,dx &\\;=\\; \\sec x + C \\\\[4pt]
\\int \\csc x \\cot x\\,dx &\\;=\\; -\\csc x + C
\\end{aligned}$$</div><div class="formula-sub">Her birini sağ tarafın türevini alarak doğrulayın. Örüntüye dikkat: türevi eksi ile başlayan her integral o eksiyi sağ tarafta korur.</div></div>

<div class="calc-example"><div class="example-label">NEDEN $\\int \\sin x\\,dx = -\\cos x + C$?</div><div class="example-body">
$(\\cos x)' = -\\sin x$ olduğunu biliyoruz. Demek ki $\\bigl(-\\cos x\\bigr)' = \\sin x$. Yani $-\\cos x$, $\\sin x$'in bir ters türevidir. $C$ ekleyelim, iş bitti. Dikkat edilecek tek nokta işaret değişikliğidir.
</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEKLER</div><div class="example-body">
<strong>(a)</strong> $\\displaystyle \\int (4\\sin x - 3\\cos x)\\,dx \\;=\\; -4\\cos x - 3\\sin x + C$.<br><br>
<strong>(b)</strong> $\\displaystyle \\int (\\sec^2 x + e^x)\\,dx \\;=\\; \\tan x + e^x + C$.<br><br>
<strong>(c)</strong> $\\displaystyle \\int (5x^2 - \\sin x)\\,dx \\;=\\; \\frac{5x^3}{3} + \\cos x + C$.<br><br>
<strong>(d) Önce özdeşlik kullanmak.</strong> $\\displaystyle \\int \\tan^2 x\\,dx \\;=\\; \\int (\\sec^2 x - 1)\\,dx \\;=\\; \\tan x - x + C$ ($\\tan^2 x = \\sec^2 x - 1$ özdeşliğini kullandık).
</div></div>

<div class="think-box"><div class="think-label">YARARLI BİR ÖN-İŞLEM ALIŞKANLIĞI</div><div class="think-body">İntegrasyondan önce integrandı sadeleştirebilecek bir cebirsel ya da trigonometrik özdeşlik arayın. Örnekler: $\\sin^2 x + \\cos^2 x = 1$, $\\tan^2 x = \\sec^2 x - 1$, $\\cos 2x = 1 - 2\\sin^2 x$. Zor görünen bir integrantı eşdeğer kolay bir integrantla değiştirmek, çoğu zaman çözülemez gibi görünen integrali altı temelden birine indirir.</div></div>

<p class="l-text">Devam etmeden önce, 4–6. bölümlerde geçen tüm temel ters türevlerin bir-bakışta referansı aşağıda. Bunu belleğinize iliştirin — lisede karşılaşacağınız her temel integral, aşağıdaki satırların bir kombinasyonu artı doğrusallık kurallarıdır.</p>

<div style="overflow-x:auto;margin:1.4rem 0">
<table style="width:100%;border-collapse:collapse;background:rgba(20,20,25,0.55);color:rgba(235,230,220,0.94);font-size:0.93rem;border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden">
<thead>
<tr style="background:#3b82f6;color:#0b1020">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:1px solid rgba(255,255,255,0.18)">$f(x)$ &nbsp;(integrant)</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:1px solid rgba(255,255,255,0.18)">$F(x) = \\int f(x)\\,dx$ &nbsp;(ters türev, $+C$ yazılmadı)</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:1px solid rgba(255,255,255,0.18)">Koşul / not</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x^n$</td><td style="padding:0.55rem 0.9rem">$\\dfrac{x^{n+1}}{n+1}$</td><td style="padding:0.55rem 0.9rem">$n \\neq -1$ (kuvvet kuralı)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{x}$</td><td style="padding:0.55rem 0.9rem">$\\ln|x|$</td><td style="padding:0.55rem 0.9rem">$x \\neq 0$ ($n = -1$ durumu)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$\\sin x$</td><td style="padding:0.55rem 0.9rem">$-\\cos x$</td><td style="padding:0.55rem 0.9rem">işaret değişir</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 0.9rem">$\\cos x$</td><td style="padding:0.55rem 0.9rem">$\\sin x$</td><td style="padding:0.55rem 0.9rem">işaret korunur</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$\\sec^2 x$</td><td style="padding:0.55rem 0.9rem">$\\tan x$</td><td style="padding:0.55rem 0.9rem">$x \\neq \\tfrac{\\pi}{2} + k\\pi$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 0.9rem">$e^x$</td><td style="padding:0.55rem 0.9rem">$e^x$</td><td style="padding:0.55rem 0.9rem">kendi ters türevi olan tek fonksiyon</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$a^x$</td><td style="padding:0.55rem 0.9rem">$\\dfrac{a^x}{\\ln a}$</td><td style="padding:0.55rem 0.9rem">$a > 0$, $a \\neq 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{1 + x^2}$</td><td style="padding:0.55rem 0.9rem">$\\arctan x$</td><td style="padding:0.55rem 0.9rem">tüm reel $x$ için tanımlı</td></tr>
<tr><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{\\sqrt{1 - x^2}}$</td><td style="padding:0.55rem 0.9rem">$\\arcsin x$</td><td style="padding:0.55rem 0.9rem">$|x| < 1$</td></tr>
</tbody>
</table>
</div>

<div class="think-box"><div class="think-label">TABLOYU NASIL KULLANMALI</div><div class="think-body">Ters türeve "$+C$" eklemeyi unutmayın — tablo yalnızca yer kazanmak için onu atlıyor. Herhangi bir satırı doğrulamak için sağ sütunun türevini alın ve sol sütunu geri elde ettiğinizi kontrol edin. Dersin gövdesinde geçmeyen iki yeni satır — $a^x \\to \\dfrac{a^x}{\\ln a}$ ve iki ters trig integrali $\\dfrac{1}{1+x^2}, \\dfrac{1}{\\sqrt{1-x^2}}$ — çoğu ulusal sınav formül kağıdında bulunur, şimdi ezberlemek karlıdır.</div></div>

<h2 class="lesson-title">7. Başlangıç Koşullu Problemler</h2>

<div class="calc-highlight"><strong>$C$'nin rolü.</strong> Belirsiz integral bütün bir aile verir. O aileden tek bir üyeyi seçmek için ek bilgi gerekir — genelde ters türevin geçmek zorunda olduğu bir nokta $(a, b)$, yani $F(a) = b$. Bu ek bilgiye <em>başlangıç koşulu</em> denir.</div>

<p class="l-text">Tarif her zaman aynıdır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Adım</div><div class="card-body">Belirsiz integrali hesapla; bilinmeyen $C$'yi cevapta tut.</div></div>
<div class="calc-card"><div class="card-title">2. Adım</div><div class="card-body">Verilen noktayı yerine koy: $x$ yerine $a$ yaz ve $F(a) = b$ olmasını talep et.</div></div>
<div class="calc-card"><div class="card-title">3. Adım</div><div class="card-body">Sonuçta çıkan denklemi $C$ için çöz.</div></div>
<div class="calc-card"><div class="card-title">4. Adım</div><div class="card-body">Bu özel $C$ değeriyle özel ters türevi yaz.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">
$F'(x) = 3x^2$ ve $F(0) = 5$ koşullarını sağlayan $F(x)$'i bulun.<br><br>
<em>1. Adım:</em> $\\displaystyle F(x) = \\int 3x^2\\,dx = x^3 + C$.<br><br>
<em>2. Adım:</em> $F(0) = 5$ koşulunu uygula: &nbsp; $0^3 + C = 5 \\;\\Rightarrow\\; C = 5$.<br><br>
<em>3. Adım:</em> $\\boxed{F(x) = x^3 + 5}$.<br><br>
<em>Kontrol:</em> $F'(x) = 3x^2$ &#10003; ve $F(0) = 0 + 5 = 5$ &#10003;.
</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">
$F'(x) = \\cos x$ ve $F(\\pi/2) = 3$ koşullarını sağlayan $F(x)$'i bulun.<br><br>
$F(x) = \\sin x + C$.<br>
$F(\\pi/2) = \\sin(\\pi/2) + C = 1 + C = 3 \\;\\Rightarrow\\; C = 2$.<br>
$\\boxed{F(x) = \\sin x + 2}$.
</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body">
$F'(x) = e^x + \\frac{1}{x}$ ve $F(1) = 0$ koşullarını sağlayan $F(x)$'i bulun.<br><br>
$F(x) = e^x + \\ln|x| + C$.<br>
$F(1) = e^1 + \\ln 1 + C = e + 0 + C = 0 \\;\\Rightarrow\\; C = -e$.<br>
$\\boxed{F(x) = e^x + \\ln|x| - e}$.
</div></div>

<div class="think-box"><div class="think-label">NEDEN BİR DENKLEM BİR SABİT BELİRLER</div><div class="think-body">$F(x) + C$ ailesinin tek bir özgür parametresi vardır: $C$. Tek bir sayısal denklem (bir noktada $F$ bir sayıya eşittir) tek bir bilinmeyeni belirler. Aynı mantıkla, bir başlangıç konumu aileden tek bir eğriyi seçmek için yeterlidir — ve aynı sebepten fizik hareket problemleri <em>iki</em> başlangıç koşulu ister (başlangıç konumu <em>ve</em> başlangıç hızı), bunu birazdan göreceğiz.</div></div>

<h2 class="lesson-title">8. Hareket Problemleri — İvmeden Konuma</h2>

<p class="l-text">Fizikte konum $s(t)$, hız $v(t)$ ve ivme $a(t)$ bir türev zinciri oluşturur:</p>

<div class="calc-formula"><div class="formula-main">$$v(t) \\;=\\; s'(t), \\qquad a(t) \\;=\\; v'(t) \\;=\\; s''(t).$$</div></div>

<p class="l-text">$s$ biliniyorsa iki türevle $v$ ve $a$ elde edilir — doğrudan. İlginç olan ters problem: <strong>$a$ verildiğinde önce $v$ sonra $s$'i geri kurmak.</strong> Her adım bir integrasyondur ve yeni bir sabit getirir:</p>

<div class="calc-formula"><div class="formula-label">HAREKET ZİNCİRİNİ İNTEGRALLEMEK</div><div class="formula-main">$$v(t) \\;=\\; \\int a(t)\\,dt + C_1, \\qquad s(t) \\;=\\; \\int v(t)\\,dt + C_2.$$</div><div class="formula-sub">İki integrasyon $\\Rightarrow$ iki bilinmeyen sabit. Bunları belirlemek için iki başlangıç koşulu gerekir: genelde başlangıç hızı $v(0) = v_0$ ve başlangıç konumu $s(0) = s_0$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — YERDE SERBEST DÜŞME</div><div class="example-body">
Bir top yerden $v_0 = 20$ m/s başlangıç hızıyla dikey olarak yukarı atılır. Yerçekimi sabit ivme $a(t) = -10$ m/s² ile aşağı çeker ($g \\approx 10$ alıyoruz). $v(t)$ ve $s(t)$'yi, yere dönme süresini ve maksimum yüksekliği bulun.<br><br>
<em>1. Adım — hız.</em>
$\\displaystyle v(t) = \\int (-10)\\,dt = -10t + C_1.$<br>
Başlangıç koşulu $v(0) = 20$: $-10(0) + C_1 = 20 \\Rightarrow C_1 = 20$. Yani $\\;v(t) = -10t + 20$.<br><br>
<em>2. Adım — konum.</em>
$\\displaystyle s(t) = \\int v(t)\\,dt = \\int (-10t + 20)\\,dt = -5t^2 + 20t + C_2.$<br>
Başlangıç koşulu $s(0) = 0$ (yerden başlar): $C_2 = 0$. Yani $\\;s(t) = -5t^2 + 20t$.<br><br>
<em>Maksimum yükseklik:</em> $v(t) = 0$ olduğunda gerçekleşir, yani $-10t + 20 = 0 \\Rightarrow t = 2$ s. $s$'e koyalım: $s(2) = -5(4) + 20(2) = -20 + 40 = 20$ m.<br><br>
<em>Dönüş süresi:</em> $s(t) = 0$ koy: $-5t^2 + 20t = 0 \\Rightarrow t(-5t + 20) = 0 \\Rightarrow t = 0$ veya $t = 4$. Top $t = 4$ saniyede yere döner.<br><br>
<strong>Sonuç:</strong> $v(t) = -10t + 20$, $s(t) = -5t^2 + 20t$, maks. yükseklik 20 m, toplam uçuş 4 s.
</div></div>

<div id="plot-l27-motion-tr" class="plotly-graph" style="height:520px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ts=[];for(var i=0;i<=40;i++)ts.push(i/10);
var av=ts.map(function(){return -10;});
var vv=ts.map(function(t){return -10*t+20;});
var sv=ts.map(function(t){return -5*t*t+20*t;});
var tA={x:ts,y:av,mode:"lines",name:"a(t) = −10",line:{color:"#f87171",width:2.5},xaxis:"x1",yaxis:"y1"};
var tV={x:ts,y:vv,mode:"lines",name:"v(t) = −10t + 20",line:{color:"#60a5fa",width:2.5},xaxis:"x2",yaxis:"y2"};
var tS={x:ts,y:sv,mode:"lines",name:"s(t) = −5t² + 20t",line:{color:"#c8a96e",width:2.5},xaxis:"x3",yaxis:"y3"};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},
grid:{rows:3,columns:1,pattern:"independent"},
xaxis1:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"t (s)"},
yaxis1:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"a (m/s²)",range:[-12,2]},
xaxis2:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"t (s)"},
yaxis2:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"v (m/s)",range:[-22,22]},
xaxis3:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"t (s)"},
yaxis3:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"s (m)",range:[0,25]},
margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.10}};
Plotly.newPlot("plot-l27-motion-tr",[tA,tV,tS],layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> serbest düşme probleminin üç katmanı üst üste. <em>Üst</em> (kırmızı): ivme $a = -10$ yatay bir doğru — yerçekimi sabittir. <em>Orta</em> (mavi): hız $v(t) = -10t + 20$, $a$'nın integralinden elde edilen bir doğru; $t = 2$ s'de sıfırı keser, top o anda tepede bir an için durur. <em>Alt</em> (altın): konum $s(t) = -5t^2 + 20t$, $v$'nin integralinden elde edilen aşağı açılan bir parabol; $t = 2$ s'de 20 m maksimum yüksekliğe ulaşır ve $t = 4$ s'de $0$'a döner. Her satır bir üst satırın integralidir.</div></div>

<div class="think-box"><div class="think-label">EZBERLENMESİ FAYDALI FORMÜL</div><div class="think-body">Sabit ivme $a$ için aynı iki integrasyon her zaman
$$v(t) = at + v_0, \\qquad s(t) = \\tfrac{1}{2}a t^2 + v_0 t + s_0$$
sonucunu verir. Düşen cisimler, ivmelenen arabalar ve eğik atış hakkındaki her lise fizik probleminde bu formülü göreceksiniz. Artık nereden geldiğini tam olarak biliyorsunuz — sabit bir ivmenin iki integrasyonu.</div></div>

<h2 class="lesson-title">9. Alıştırmalar — 8 Klasik Problem</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body">
$\\displaystyle \\int (4x^3 - 6x^2 + 2x - 7)\\,dx$ integralini hesaplayın.<br><br>
<em>Çözüm:</em> terim terim integralle, her kuvveti yeni üssüne böl.
$$\\int 4x^3\\,dx = x^4, \\;\\; \\int (-6x^2)\\,dx = -2x^3, \\;\\; \\int 2x\\,dx = x^2, \\;\\; \\int (-7)\\,dx = -7x.$$
$\\boxed{x^4 - 2x^3 + x^2 - 7x + C}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body">
$\\displaystyle \\int \\Bigl(\\sqrt{x} + \\frac{1}{\\sqrt{x}}\\Bigr) dx$ integralini hesaplayın.<br><br>
<em>Çözüm:</em> kesirli üslerle yeniden yazın. $\\sqrt{x} = x^{1/2}$, $1/\\sqrt{x} = x^{-1/2}$.
$$\\int x^{1/2}\\,dx = \\frac{x^{3/2}}{3/2} = \\frac{2}{3}x^{3/2}, \\qquad \\int x^{-1/2}\\,dx = \\frac{x^{1/2}}{1/2} = 2x^{1/2}.$$
$\\boxed{\\dfrac{2}{3}x^{3/2} + 2\\sqrt{x} + C}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body">
$\\displaystyle \\int \\bigl(2e^x - \\frac{3}{x}\\bigr) dx$ integralini hesaplayın.<br><br>
$\\boxed{2e^x - 3\\ln|x| + C}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4</div><div class="example-body">
$\\displaystyle \\int (5\\sin x + 2\\cos x - 3\\sec^2 x)\\,dx$ integralini hesaplayın.<br><br>
$\\boxed{-5\\cos x + 2\\sin x - 3\\tan x + C}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — Başlangıç Koşulu</div><div class="example-body">
$F'(x) = 6x^2 - 4x + 3$ ve $F(1) = 10$ koşullarını sağlayan $F$'yi bulun.<br><br>
$F(x) = 2x^3 - 2x^2 + 3x + C$.<br>
$F(1) = 2 - 2 + 3 + C = 3 + C = 10 \\Rightarrow C = 7$.<br>
$\\boxed{F(x) = 2x^3 - 2x^2 + 3x + 7}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — Trigonometri ile Başlangıç Koşulu</div><div class="example-body">
$F'(x) = \\cos x + 2x$ ve $F(0) = 4$ koşullarını sağlayan $F$'yi bulun.<br><br>
$F(x) = \\sin x + x^2 + C$. &nbsp;&nbsp;$F(0) = 0 + 0 + C = 4 \\Rightarrow C = 4$.<br>
$\\boxed{F(x) = \\sin x + x^2 + 4}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — Hareket</div><div class="example-body">
Bir parçacığın $a(t) = 6t$ m/s², $v(0) = 4$ m/s, $s(0) = 0$ verileri var. $v(t)$ ve $s(t)$'yi bulun.<br><br>
$v(t) = \\int 6t\\,dt = 3t^2 + C_1$. &nbsp;$v(0) = 4$ uygula: $C_1 = 4$. &nbsp;$v(t) = 3t^2 + 4$.<br>
$s(t) = \\int (3t^2 + 4)\\,dt = t^3 + 4t + C_2$. &nbsp;$s(0) = 0$ uygula: $C_2 = 0$. &nbsp;$s(t) = t^3 + 4t$.<br>
$\\boxed{v(t) = 3t^2 + 4 \\;\\text{m/s}, \\quad s(t) = t^3 + 4t \\;\\text{m}}$.
</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — Cebirsel Ön İşlem</div><div class="example-body">
$\\displaystyle \\int \\frac{x^3 + 2x^2 + 1}{x^2}\\,dx$ integralini hesaplayın.<br><br>
<em>Püf nokta:</em> önce pay terimlerinin her birini $x^2$'ye bölün, dağınık kesir basit bir toplama dönüşür:
$$\\frac{x^3 + 2x^2 + 1}{x^2} = x + 2 + x^{-2}.$$
Şimdi terim terim integralleyin:
$$\\int x\\,dx = \\frac{x^2}{2}, \\;\\; \\int 2\\,dx = 2x, \\;\\; \\int x^{-2}\\,dx = \\frac{x^{-1}}{-1} = -\\frac{1}{x}.$$
$\\boxed{\\dfrac{x^2}{2} + 2x - \\dfrac{1}{x} + C}$.
</div></div>

<div class="l-note"><strong>Ne öğrendiniz.</strong> Ters türev, türevi tersine çevirir; ama cevap her zaman bir toplamsal sabit $C$ ile farklılaşan bir <em>aile</em> fonksiyondur. Temel kurallar — kuvvet, üstel, logaritma, altı trig — okulda göreceğiniz her temel integrantı çözmenize yeter. Bir başlangıç koşulu $F(a) = b$ aileden tek bir üyeyi sabitler. İki integrasyon bir ivmeyi bir konuma çevirir; her integrasyon başına bir başlangıç koşulu gerekir. Ders 28 <em>belirli</em> integrali tanıtır — aynı $\\int$ sembolünü gerçek bir <em>sayıyı</em> (bir eğri altındaki alanı) hesaplamak için kullandığımızda ne olur — ve belirsiz ile belirli integralleri birbirine bağlayan göz alıcı Temel Teorem'i keşfeder.</div>`

};
