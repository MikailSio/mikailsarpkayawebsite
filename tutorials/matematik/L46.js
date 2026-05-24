window.LISE_MAT_L46 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Four functions, one common idea: they all "round," "select," or "reflect" a real input into a more restricted output.</strong> The absolute value strips the sign, the floor pulls a real number down to the nearest integer, the ceiling lifts it up, and the sign function reports the direction only. None of these are polynomials and none are smooth — they bend, jump, or step. They are the natural language of magnitudes, indices, switches and thresholds.</p>

<p class="l-text">By the end of this lesson, you will write each function's piecewise definition, sketch its graph from memory, simplify combined expressions, recognise their key algebraic identities, and use the unit step (Heaviside) function to describe on/off behaviour. These functions appear in trigonometry (the absolute value of cosine), in calculus (jump discontinuities), in probability (indicator functions) and in engineering (rectifiers and switches). Today's investment pays off everywhere.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define the absolute value $|x|$ piecewise and interpret it as a distance on the real line</li>
<li>Prove and apply the key absolute value identities: $|xy|=|x||y|$, $|x+y|\\le|x|+|y|$, $|x|^2=x^2$</li>
<li>Define the floor $\\lfloor x \\rfloor$ and ceiling $\\lceil x \\rceil$ functions and read their graphs</li>
<li>Use the symmetry rule $\\lfloor -x \\rfloor = -\\lceil x \\rceil$ and the identity $\\lfloor x \\rfloor + \\lceil x \\rceil$</li>
<li>Define the sign function $\\operatorname{sgn}(x)$ and write the decomposition $x = |x|\\cdot\\operatorname{sgn}(x)$</li>
<li>Define the unit step (Heaviside) function $H(x)$ and use it to build "switched on" signals</li>
</ul>
</div>

<h2 class="lesson-title">1. The Absolute Value Function $|x|$</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> picture a number line. The absolute value of a number is simply <em>how far it is from zero</em>, ignoring whether it sits to the left or to the right. $|3|=3$ because 3 is three units to the right of zero. $|-3|=3$ because $-3$ is also three units away from zero, just on the other side. Distance is never negative.</div>

<p class="l-text">Formally, the absolute value function is defined <strong>piecewise</strong>. The rule splits at $x=0$ because the "stripping the sign" idea behaves differently on either side:</p>

<div class="calc-formula"><div class="formula-label">ABSOLUTE VALUE &mdash; PIECEWISE DEFINITION</div><div class="formula-main">$$|x| \\;=\\; \\begin{cases} \\,x, & x \\ge 0 \\\\ -x, & x < 0 \\end{cases}$$</div><div class="formula-sub">For non-negative inputs the function does nothing. For negative inputs it flips the sign. The two pieces meet smoothly in value at $x=0$ (both give 0) but the slope changes abruptly from $-1$ to $+1$.</div></div>

<p class="l-text"><strong>Geometric meaning.</strong> A more general view: for any two real numbers $a$ and $b$, the quantity $|a-b|$ is the distance between them on the number line. The standard absolute value $|x|$ is just the special case $|x-0|$, the distance from $x$ to the origin. This interpretation is the single most useful way to remember every absolute value identity.</p>

<div class="calc-formula"><div class="formula-label">DISTANCE INTERPRETATION</div><div class="formula-main">$$|a-b| \\;=\\; \\text{distance from } a \\text{ to } b \\text{ on the real line.}$$</div><div class="formula-sub">Symmetric in $a$ and $b$: $|a-b|=|b-a|$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Domain</div><div class="card-body">All real numbers: $\\mathbb{R}$. There is no input where the rule fails.</div></div>
<div class="calc-card"><div class="card-title">Range</div><div class="card-body">$[0,\\infty)$. Distances are never negative.</div></div>
<div class="calc-card"><div class="card-title">Symmetry</div><div class="card-body">Even function: $|-x| = |x|$ for every real $x$. The graph is mirror-symmetric across the y-axis.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Compute $|{-7}| + |2-5| - |3|$.<br><br>$|-7|=7$. $|2-5|=|-3|=3$. $|3|=3$.<br>Sum: $7 + 3 - 3 = \\mathbf{7}$.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Translate to plain language: "$|x-4|<2$" means "the distance from $x$ to 4 is less than 2." Which interval does this describe? Answer: $2 < x < 6$, that is the open interval $(2,6)$.</div></div>

<h2 class="lesson-title">2. Properties of Absolute Value</h2>

<div class="calc-highlight"><strong>Five identities to memorise.</strong> They are used in every inequality, every distance argument, and every error bound you will ever write. The first three are routine; the last two are the famous triangle inequalities.</div>

<div class="calc-formula"><div class="formula-label">FIVE CORE IDENTITIES</div><div class="formula-main">$$|x| \\ge 0, \\qquad |x|=0 \\iff x=0, \\qquad |{-x}|=|x|$$ $$|xy|=|x|\\cdot|y|, \\qquad \\left|\\frac{x}{y}\\right|=\\frac{|x|}{|y|} \\;(y\\ne 0)$$ $$\\big||x|-|y|\\big| \\;\\le\\; |x \\pm y| \\;\\le\\; |x|+|y|$$</div><div class="formula-sub">The chain on the bottom row is the <em>triangle inequality</em>: the right-hand side bounds sums and differences from above; the left-hand side gives a lower bound.</div></div>

<p class="l-text"><strong>Why "triangle"?</strong> Place three points on a plane; the longest side of the triangle they form is at most the sum of the other two. On the real line the same idea works: $|x+y|$ is the distance from $-y$ to $x$, and that distance can never exceed $|x| + |y|$ (going through 0 in two hops). Equality holds when $x$ and $y$ have the same sign.</p>

<div class="calc-formula"><div class="formula-label">SQUARE IDENTITY</div><div class="formula-main">$$|x|^2 = x^2 \\qquad\\text{and}\\qquad |x| = \\sqrt{x^2}$$</div><div class="formula-sub">This is the algebraic bridge between absolute value and the square root. It is the reason $|x|$ shows up in distance formulas: $\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$ uses the same idea in two dimensions.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; USING $|xy|=|x||y|$</div><div class="example-body">Simplify $|{-3}\\cdot 4 \\cdot (-2)|$.<br><br>Direct route: the product is $24$, so $|24|=24$.<br>Identity route: $|-3|\\cdot|4|\\cdot|-2| = 3\\cdot 4\\cdot 2 = 24$. Same answer.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; TRIANGLE INEQUALITY CHECK</div><div class="example-body">Verify $|3+(-5)| \\le |3|+|-5|$.<br><br>Left side: $|{-2}|=2$. Right side: $3+5=8$. Indeed $2 \\le 8$. The inequality holds strictly because $3$ and $-5$ have opposite signs.</div></div>

<div class="l-note"><strong>A common pitfall:</strong> students sometimes "distribute" the absolute value into a sum: $|x+y| = |x|+|y|$. This is <em>false in general</em> — it only holds when $x$ and $y$ share a sign. The correct relation is the inequality, not an equality.</div>

<h2 class="lesson-title">3. The Floor Function $\\lfloor x \\rfloor$</h2>

<div class="calc-highlight"><strong>The floor function rounds down.</strong> Given any real number $x$, $\\lfloor x \\rfloor$ is the largest integer that is less than or equal to $x$. So $\\lfloor 3.7 \\rfloor = 3$, $\\lfloor 5 \\rfloor = 5$, and $\\lfloor -2.3 \\rfloor = -3$ (careful: rounding "down" for negatives means more negative, not toward zero).</div>

<div class="calc-formula"><div class="formula-label">FLOOR &mdash; DEFINITION</div><div class="formula-main">$$\\lfloor x \\rfloor \\;=\\; \\max\\{\\, n \\in \\mathbb{Z} \\;:\\; n \\le x \\,\\}$$</div><div class="formula-sub">Equivalently: the unique integer $n$ such that $n \\le x < n+1$.</div></div>

<p class="l-text"><strong>Graph shape.</strong> The graph of $y=\\lfloor x \\rfloor$ is a staircase. On each interval $[n,n+1)$ the function is the constant integer $n$. At each integer the graph jumps up by 1. Conventionally the left endpoint of every step is filled (the value $n$ is attained) and the right endpoint is hollow (the value $n+1$ has moved up to the next step).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Domain &amp; range</div><div class="card-body">Domain: $\\mathbb{R}$. Range: $\\mathbb{Z}$ (every output is an integer).</div></div>
<div class="calc-card"><div class="card-title">Key values</div><div class="card-body">$\\lfloor 0 \\rfloor = 0$, $\\lfloor 3.99 \\rfloor = 3$, $\\lfloor -0.5 \\rfloor = -1$, $\\lfloor \\pi \\rfloor = 3$.</div></div>
<div class="calc-card"><div class="card-title">Discontinuities</div><div class="card-body">Jumps of size $+1$ at every integer. Between consecutive integers the function is constant (slope 0).</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; FLOOR OF NEGATIVES</div><div class="example-body">Compute $\\lfloor -2.3 \\rfloor$, $\\lfloor -2 \\rfloor$ and $\\lfloor -1.7 \\rfloor$.<br><br>For $-2.3$: largest integer $\\le -2.3$ is $-3$ (because $-2 > -2.3$, so $-2$ is too big).<br>For $-2$ exactly: $\\lfloor -2 \\rfloor = -2$ (integers are unchanged).<br>For $-1.7$: largest integer $\\le -1.7$ is $-2$.<br><br>Pattern: the floor of a negative non-integer is strictly more negative than the number itself.</div></div>

<div class="l-note"><strong>Notation note:</strong> some Turkish textbooks write the floor as $[x]$ (square brackets) and call it the "tamdeğer" function. In international notation $\\lfloor x \\rfloor$ is unambiguous. We'll stick with the brackets that look like a floor: opening downwards.</div>

<h2 class="lesson-title">4. The Ceiling Function $\\lceil x \\rceil$</h2>

<div class="calc-highlight"><strong>The ceiling function rounds up.</strong> The mirror of the floor: $\\lceil x \\rceil$ is the smallest integer greater than or equal to $x$. So $\\lceil 3.2 \\rceil = 4$, $\\lceil 5 \\rceil = 5$, and $\\lceil -2.7 \\rceil = -2$ (rounding "up" for negatives means closer to zero).</div>

<div class="calc-formula"><div class="formula-label">CEILING &mdash; DEFINITION</div><div class="formula-main">$$\\lceil x \\rceil \\;=\\; \\min\\{\\, n \\in \\mathbb{Z} \\;:\\; n \\ge x \\,\\}$$</div><div class="formula-sub">Equivalently: the unique integer $n$ such that $n-1 < x \\le n$.</div></div>

<p class="l-text"><strong>Graph shape.</strong> Also a staircase, but the steps are shifted. On each interval $(n,n+1]$ the function is the constant integer $n+1$. At each integer the value drops back down to the integer itself.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Quick rule</div><div class="card-body">If $x$ is already an integer, $\\lceil x \\rceil = x = \\lfloor x \\rfloor$. Otherwise $\\lceil x \\rceil = \\lfloor x \\rfloor + 1$.</div></div>
<div class="calc-card"><div class="card-title">Sample values</div><div class="card-body">$\\lceil 0 \\rceil = 0$, $\\lceil 3.01 \\rceil = 4$, $\\lceil -0.5 \\rceil = 0$, $\\lceil \\pi \\rceil = 4$.</div></div>
<div class="calc-card"><div class="card-title">Real-world use</div><div class="card-body">"How many buses do we need?" — passengers divided by capacity, then $\\lceil \\cdot \\rceil$. You always round up because you cannot run half a bus.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; CEILING IN A WORD PROBLEM</div><div class="example-body">A bus carries 45 passengers. A school trip has 200 children. How many buses are required?<br><br>$200 / 45 \\approx 4.44$ buses.<br>$\\lceil 4.44 \\rceil = 5$. So <strong>5 buses</strong> are needed (4 leaves 20 children stranded).</div></div>

<h2 class="lesson-title">5. Floor &amp; Ceiling Identities and the Visual Comparison</h2>

<div class="calc-highlight"><strong>Four identities you should know.</strong> They tie floor and ceiling together and to negation, and they let you simplify any expression mixing the two.</div>

<div class="calc-formula"><div class="formula-label">CORE IDENTITIES</div><div class="formula-main">$$\\lceil x \\rceil = -\\lfloor -x \\rfloor \\qquad\\text{and}\\qquad \\lfloor x \\rfloor = -\\lceil -x \\rceil$$ $$\\lfloor x \\rfloor + \\lceil x \\rceil = \\begin{cases} 2x & \\text{if } x \\in \\mathbb{Z} \\\\ 2\\lfloor x \\rfloor + 1 & \\text{if } x \\notin \\mathbb{Z} \\end{cases}$$ $$\\lfloor x+n \\rfloor = \\lfloor x \\rfloor + n \\quad\\text{for any integer } n$$</div><div class="formula-sub">The negation rule mirrors floors and ceilings through the origin. The sum rule says: at integers both equal $x$ (sum $2x$); off integers they straddle by exactly $1$ (sum $2\\lfloor x \\rfloor + 1$). The shift rule says adding an integer just shifts the staircase.</div></div>

<div class="calc-graph"><div id="plot-l46-special-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the four special functions of this lesson side by side on the interval $[-3,3]$. Top-left: $|x|$, the absolute value V-shape with corner at the origin. Top-right: $\\lfloor x \\rfloor$, the rounded-down staircase. Bottom-left: $\\lceil x \\rceil$, the rounded-up staircase shifted up by one step. Bottom-right: $\\operatorname{sgn}(x)$, the three-level switch.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var absX=[];var absY=[];for(var i=0;i<=120;i++){var v=-3+6*i/120;absX.push(v);absY.push(Math.abs(v));}
var absT={x:absX,y:absY,mode:'lines',name:'|x|',line:{color:'#3b82f6',width:3},xaxis:'x1',yaxis:'y1'};
var floorXs=[],floorYs=[];for(var n=-3;n<=2;n++){floorXs.push(n,n+1,null);floorYs.push(n,n,null);}
var floorT={x:floorXs,y:floorYs,mode:'lines',name:'floor(x)',line:{color:'#22c55e',width:3},xaxis:'x2',yaxis:'y2'};
var ceilXs=[],ceilYs=[];for(var n=-3;n<=2;n++){ceilXs.push(n,n+1,null);ceilYs.push(n+1,n+1,null);}
var ceilT={x:ceilXs,y:ceilYs,mode:'lines',name:'ceil(x)',line:{color:'#f59e0b',width:3},xaxis:'x3',yaxis:'y3'};
var sgnX=[-3,0,0,0,3];var sgnY=[-1,-1,0,1,1];
var sgnT={x:[-3,0],y:[-1,-1],mode:'lines',name:'sgn(x)',line:{color:'#ef4444',width:3},xaxis:'x4',yaxis:'y4'};
var sgnT2={x:[0,3],y:[1,1],mode:'lines',showlegend:false,line:{color:'#ef4444',width:3},xaxis:'x4',yaxis:'y4'};
var sgnT3={x:[0],y:[0],mode:'markers',showlegend:false,marker:{color:'#ef4444',size:10,symbol:'circle'},xaxis:'x4',yaxis:'y4'};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist',size:11},showlegend:false,
grid:{rows:2,columns:2,pattern:'independent'},
xaxis1:{title:'|x|',domain:[0,0.46],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,3]},
yaxis1:{domain:[0.55,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-0.3,3.2]},
xaxis2:{title:'floor(x)',domain:[0.54,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,3]},
yaxis2:{domain:[0.55,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3.5,3.5]},
xaxis3:{title:'ceil(x)',domain:[0,0.46],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,3]},
yaxis3:{domain:[0,0.45],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3.5,3.5]},
xaxis4:{title:'sgn(x)',domain:[0.54,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,3]},
yaxis4:{domain:[0,0.45],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-1.5,1.5]},
margin:{t:20,r:30,b:40,l:50}};
Plotly.newPlot('plot-l46-special-en',[absT,floorT,ceilT,sgnT,sgnT2,sgnT3],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l46-stairs-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> floor (green, solid) and ceiling (orange, dashed) on the same axes, $-3 \\le x \\le 3$. Both are staircases; the ceiling sits exactly one step above the floor whenever $x$ is non-integer, and they coincide at integers (marked with the dotted vertical guides).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var fX=[],fY=[];for(var n=-3;n<=2;n++){fX.push(n,n+1,null);fY.push(n,n,null);}
var cX=[],cY=[];for(var n=-3;n<=2;n++){cX.push(n,n+1,null);cY.push(n+1,n+1,null);}
var f={x:fX,y:fY,mode:'lines',name:'floor(x)',line:{color:'#22c55e',width:3}};
var c={x:cX,y:cY,mode:'lines',name:'ceil(x)',line:{color:'#f59e0b',width:3,dash:'dash'}};
var gridXs=[],gridYs=[];for(var k=-3;k<=3;k++){gridXs.push(k,k,null);gridYs.push(-3.5,3.5,null);}
var gridL={x:gridXs,y:gridYs,mode:'lines',name:'integers',line:{color:'rgba(255,255,255,0.12)',width:1,dash:'dot'},showlegend:false};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-3.5,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l46-stairs-en',[gridL,f,c],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; USING NEGATION</div><div class="example-body">Compute $\\lceil -3.4 \\rceil$ via the negation identity.<br><br>$\\lceil -3.4 \\rceil = -\\lfloor 3.4 \\rfloor = -3$.<br><br>Double-check directly: the smallest integer $\\ge -3.4$ is $-3$. Match.</div></div>

<h2 class="lesson-title">6. The Sign Function $\\operatorname{sgn}(x)$</h2>

<div class="calc-highlight"><strong>The sign function reports direction only.</strong> It throws away magnitude and keeps the answer to the question "is $x$ positive, negative or zero?" The three possible answers $+1, -1, 0$ are returned as the function's output.</div>

<div class="calc-formula"><div class="formula-label">SIGN &mdash; PIECEWISE DEFINITION</div><div class="formula-main">$$\\operatorname{sgn}(x) \\;=\\; \\begin{cases} \\,+1, & x > 0 \\\\ \\;\\;\\,0, & x = 0 \\\\ -1, & x < 0 \\end{cases}$$</div><div class="formula-sub">Three constant pieces. The function is odd: $\\operatorname{sgn}(-x) = -\\operatorname{sgn}(x)$.</div></div>

<p class="l-text"><strong>The fundamental decomposition.</strong> The sign and absolute value fit together cleanly: every nonzero real number is its magnitude times its direction.</p>

<div class="calc-formula"><div class="formula-label">SIGN&times;MAGNITUDE DECOMPOSITION</div><div class="formula-main">$$x \\;=\\; |x| \\cdot \\operatorname{sgn}(x) \\qquad\\text{and}\\qquad |x| \\;=\\; x \\cdot \\operatorname{sgn}(x)$$</div><div class="formula-sub">A useful identity in physics: split a force vector $F$ into its magnitude $|F|$ and direction $\\operatorname{sgn}(F)$ when working in 1D.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Range</div><div class="card-body">Just three values: $\\{-1, 0, +1\\}$. The smallest range of any function we've defined so far.</div></div>
<div class="calc-card"><div class="card-title">Symmetry</div><div class="card-body">Odd function: graph is point-symmetric about the origin. Compare with $|x|$ which is even.</div></div>
<div class="calc-card"><div class="card-title">Alternate formula</div><div class="card-body">For $x \\ne 0$: $\\operatorname{sgn}(x) = x / |x|$. The ratio extracts the sign because magnitudes cancel.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Evaluate $\\operatorname{sgn}(-7) + \\operatorname{sgn}(0) + \\operatorname{sgn}(\\pi)$.<br><br>$\\operatorname{sgn}(-7) = -1$. $\\operatorname{sgn}(0) = 0$. $\\operatorname{sgn}(\\pi) = +1$ (since $\\pi > 0$).<br>Sum: $-1 + 0 + 1 = \\mathbf{0}$.</div></div>

<h2 class="lesson-title">7. The Unit Step (Heaviside) Function $H(x)$</h2>

<div class="calc-highlight"><strong>The unit step is a "switch."</strong> It is zero before the origin and one after — useful any time you want to model "the source turns on at time zero." Named after Oliver Heaviside, the British engineer who pioneered using such functions in circuit analysis.</div>

<div class="calc-formula"><div class="formula-label">HEAVISIDE &mdash; DEFINITION</div><div class="formula-main">$$H(x) \\;=\\; \\begin{cases} \\,0, & x < 0 \\\\ \\,1, & x \\ge 0 \\end{cases}$$</div><div class="formula-sub">A single jump of size $+1$ at $x=0$. Some conventions set $H(0) = 1/2$ (the average of the two pieces); for our purposes the value at the jump rarely matters.</div></div>

<p class="l-text"><strong>Shifted steps.</strong> If you want the switch to flip at $x=a$ instead of $0$, just shift the input:</p>

<div class="calc-formula"><div class="formula-label">SHIFTED STEP</div><div class="formula-main">$$H(x - a) \\;=\\; \\begin{cases} \\,0, & x < a \\\\ \\,1, & x \\ge a \\end{cases}$$</div></div>

<p class="l-text"><strong>Step combinations make "rectangles."</strong> A common engineering trick is to model a pulse — on between $a$ and $b$ — by subtracting two steps:</p>

<div class="calc-formula"><div class="formula-label">PULSE OF WIDTH $b-a$</div><div class="formula-main">$$P_{[a,b]}(x) \\;=\\; H(x-a) - H(x-b)$$</div><div class="formula-sub">Equal to 1 on $[a,b)$, zero everywhere else.</div></div>

<div class="calc-graph"><div id="plot-l46-step-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the sign function $\\operatorname{sgn}(x)$ (red) compared with the Heaviside step $H(x)$ (cyan). Both jump at the origin, but sign goes from $-1$ to $+1$ (range $\\{-1,0,1\\}$) while Heaviside goes from $0$ to $1$. They are linked by the identity $H(x) = \\tfrac{1}{2}(1+\\operatorname{sgn}(x))$ for $x\\ne 0$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var sN={x:[-3,0],y:[-1,-1],mode:'lines',name:'sgn(x)',line:{color:'#ef4444',width:3}};
var sP={x:[0,3],y:[1,1],mode:'lines',name:'sgn(x) (right)',line:{color:'#ef4444',width:3},showlegend:false};
var sZ={x:[0],y:[0],mode:'markers',name:'sgn(0)=0',marker:{color:'#ef4444',size:10}};
var hN={x:[-3,0],y:[0,0],mode:'lines',name:'H(x)',line:{color:'#06b6d4',width:3,dash:'dash'}};
var hP={x:[0,3],y:[1,1],mode:'lines',name:'H(x) (right)',line:{color:'#06b6d4',width:3,dash:'dash'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1.5,1.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l46-step-en',[sN,sP,sZ,hN,hP],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Worked Examples: Combining Transformations</h2>

<p class="l-text">Most exam problems do not show these functions in isolation; they combine them with horizontal/vertical shifts, reflections and scalings. We saw graph transformations in earlier lessons. Apply the same rules here.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 &mdash; SHIFTED ABSOLUTE VALUE</div><div class="example-body"><strong>Sketch $y = |x-2| - 1$ and find its minimum.</strong><br><br>Start with $y=|x|$ (V-shape with vertex at origin). Shift right by 2 to get $y=|x-2|$ (vertex at $(2,0)$). Shift down by 1 to get $y=|x-2|-1$ (vertex at $(2,-1)$).<br><br>The minimum value is $\\mathbf{-1}$, attained at $x=2$. For $x < 2$ the function decreases with slope $-1$; for $x > 2$ it increases with slope $+1$.</div></div>

<div class="calc-graph"><div id="plot-l46-shift-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the basic V-shape $y=|x|$ (dashed grey) and its transformed version $y=|x-2|-1$ (blue). The vertex has moved 2 units right and 1 unit down. The two slopes $\\pm 1$ are unchanged.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var b1=[];var b2=[];for(var i=0;i<=120;i++){var v=-3+8*i/120;xs.push(v);b1.push(Math.abs(v));b2.push(Math.abs(v-2)-1);}
var T1={x:xs,y:b1,mode:'lines',name:'|x|',line:{color:'rgba(255,255,255,0.4)',width:2,dash:'dash'}};
var T2={x:xs,y:b2,mode:'lines',name:'|x-2|-1',line:{color:'#3b82f6',width:3}};
var vMark={x:[2],y:[-1],mode:'markers+text',name:'vertex',marker:{color:'#3b82f6',size:10},text:['(2,-1)'],textposition:'bottom right',showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-2,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l46-shift-en',[T1,T2,vMark],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; SOLVING $|2x-3| = 5$</div><div class="example-body">Recall $|A|=k$ (with $k\\ge 0$) splits into $A = k$ or $A = -k$.<br><br>$2x - 3 = 5 \\implies x = 4$.<br>$2x - 3 = -5 \\implies x = -1$.<br><br>Solution set: $\\boxed{x \\in \\{-1, 4\\}}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 &mdash; FRACTIONAL PART</div><div class="example-body">The <em>fractional part</em> of $x$ is defined as $\\{x\\} = x - \\lfloor x \\rfloor$. Compute the fractional parts of $5.7$, $3$, and $-2.3$.<br><br>$\\{5.7\\} = 5.7 - 5 = 0.7$.<br>$\\{3\\} = 3 - 3 = 0$.<br>$\\{-2.3\\} = -2.3 - (-3) = -2.3 + 3 = 0.7$.<br><br>By construction $0 \\le \\{x\\} < 1$ always &mdash; including for negative $x$. That is a nice property of the floor (rather than truncation toward zero).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4 &mdash; PIECE-BY-PIECE FORMULA</div><div class="example-body">Rewrite $f(x) = |x| + \\operatorname{sgn}(x)$ as a piecewise function on three intervals.<br><br>For $x > 0$: $|x| = x$ and $\\operatorname{sgn}(x) = 1$, so $f(x) = x + 1$.<br>For $x = 0$: $|x| = 0$ and $\\operatorname{sgn}(0) = 0$, so $f(0) = 0$.<br>For $x < 0$: $|x| = -x$ and $\\operatorname{sgn}(x) = -1$, so $f(x) = -x - 1$.<br><br>$$f(x) = \\begin{cases} x+1 & x > 0 \\\\ 0 & x = 0 \\\\ -x-1 & x < 0 \\end{cases}$$<br>Notice the jump: as $x \\to 0^+$, $f \\to 1$; as $x \\to 0^-$, $f \\to -1$; but $f(0) = 0$. Three different "values near 0."</div></div>

<h2 class="lesson-title">9. Classical Exercises</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; ABSOLUTE VALUE EQUATION</div><div class="example-body"><strong>Solve $|3x + 2| = 7$.</strong><br><br>$3x+2 = 7 \\Rightarrow x = \\dfrac{5}{3}$.<br>$3x+2 = -7 \\Rightarrow x = -3$.<br><br>Answer: $x \\in \\left\\{-3, \\dfrac{5}{3}\\right\\}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; ABSOLUTE VALUE INEQUALITY</div><div class="example-body"><strong>Solve $|x - 4| < 3$.</strong><br><br>Distance interpretation: $x$ is within 3 units of 4. So $4-3 < x < 4+3$, i.e. $1 < x < 7$.<br><br>Answer: $x \\in (1, 7)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; FLOOR EQUATION</div><div class="example-body"><strong>Find all real $x$ with $\\lfloor x \\rfloor = 5$.</strong><br><br>By definition, $\\lfloor x \\rfloor = 5$ means $5 \\le x < 6$. The solution is the half-open interval $[5, 6)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; CEILING EQUATION</div><div class="example-body"><strong>Find all real $x$ with $\\lceil x \\rceil = -2$.</strong><br><br>$\\lceil x \\rceil = -2$ means $-3 < x \\le -2$. The solution is the half-open interval $(-3, -2]$.<br><br>Note the difference from PROBLEM 3 in which side is open vs closed — floor steps include the left endpoint, ceiling steps include the right one.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; SIGN IDENTITY</div><div class="example-body"><strong>Express $|3x|$ without absolute value, using the sign function.</strong><br><br>For any real $x$: $|3x| = 3x \\cdot \\operatorname{sgn}(3x) = 3x \\cdot \\operatorname{sgn}(x)$ (since 3 is positive).<br><br>Sanity check: at $x = -2$, left side $|-6| = 6$. Right side $3(-2) \\cdot (-1) = -6 \\cdot -1 = 6$. Match.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; PULSE WITH HEAVISIDE</div><div class="example-body"><strong>Write the function "equal to 1 on $[2,5)$, zero elsewhere" using Heaviside steps.</strong><br><br>$f(x) = H(x-2) - H(x-5)$.<br>Verification: for $x < 2$ both terms are 0, so $f=0$. For $2 \\le x < 5$, $H(x-2)=1$ and $H(x-5)=0$, so $f=1$. For $x \\ge 5$, both are 1 and $f=0$. Match.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> In the next lesson you'll meet rational functions and asymptotes — there absolute value reappears when we describe limits like $|f(x)| \\to \\infty$. The floor function reappears whenever number theory enters (counting integers in a range). The sign and step functions return in calculus when you study discontinuities and the Dirac delta.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Absolute value: $|x| = x$ if $x\\ge 0$, else $-x$. V-shape graph with vertex at the origin</li>
<li>$|a-b|$ is the distance between $a$ and $b$ on the real line</li>
<li>Triangle inequality: $|x+y| \\le |x|+|y|$, with equality only when $x,y$ share a sign</li>
<li>Floor: $\\lfloor x \\rfloor$ rounds down to the nearest integer; staircase graph</li>
<li>Ceiling: $\\lceil x \\rceil$ rounds up; $\\lceil x \\rceil = -\\lfloor -x \\rfloor$ links them</li>
<li>Sign: $\\operatorname{sgn}(x) \\in \\{-1,0,+1\\}$; gives the decomposition $x = |x| \\cdot \\operatorname{sgn}(x)$</li>
<li>Heaviside step: $H(x) = 0$ for $x<0$, $1$ for $x\\ge 0$; combine to form pulses</li>
<li>All four functions are non-smooth: they bend (abs) or jump (floor, ceil, sgn, H) at integer points or at the origin</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Dört fonksiyon, tek ortak fikir: hepsi bir reel girdiyi daha kısıtlı bir çıktıya "yuvarlar," "seçer" ya da "yansıtır."</strong> Mutlak değer işareti kaldırır, taban fonksiyonu reel sayıyı en yakın tamsayıya aşağı çeker, tavan fonksiyonu yukarı kaldırır ve işaret fonksiyonu yalnızca yönü bildirir. Hiçbiri polinom değil, hiçbiri pürüzsüz değil — bükülür, sıçrar ya da basamaklanır. Büyüklüklerin, indekslerin, anahtarların ve eşiklerin doğal dilidirler.</p>

<p class="l-text">Bu dersin sonunda her fonksiyonun parçalı tanımını yazabilecek, grafiğini ezberden çizebilecek, birleşik ifadeleri sadeleştirebilecek, temel cebirsel özdeşliklerini tanıyabilecek ve aç/kapa davranışını betimlemek için birim adım (Heaviside) fonksiyonunu kullanabileceksin. Bu fonksiyonlar trigonometride (kosinüsün mutlak değeri), kalkülüste (sıçrama süreksizlikleri), olasılıkta (indikatör fonksiyonlar) ve mühendislikte (doğrultucular ve anahtarlar) karşına çıkar. Bugünkü yatırım her yerde geri döner.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Mutlak değer $|x|$'i parçalı tanımlamayı ve reel doğru üzerinde uzaklık olarak yorumlamayı</li>
<li>Temel mutlak değer özdeşliklerini kanıtlamayı ve kullanmayı: $|xy|=|x||y|$, $|x+y|\\le|x|+|y|$, $|x|^2=x^2$</li>
<li>Taban $\\lfloor x \\rfloor$ ve tavan $\\lceil x \\rceil$ fonksiyonlarını tanımlamayı ve grafiklerini okumayı</li>
<li>Simetri kuralı $\\lfloor -x \\rfloor = -\\lceil x \\rceil$ ve $\\lfloor x \\rfloor + \\lceil x \\rceil$ özdeşliğini kullanmayı</li>
<li>İşaret fonksiyonu $\\operatorname{sgn}(x)$'i tanımlamayı ve $x = |x|\\cdot\\operatorname{sgn}(x)$ ayrışımını yazmayı</li>
<li>Birim adım (Heaviside) fonksiyonu $H(x)$'i tanımlamayı ve "açılan" sinyalleri kurmak için kullanmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Mutlak Değer Fonksiyonu $|x|$</h2>

<div class="calc-highlight"><strong>Günlük bir resim:</strong> bir sayı doğrusunu hayal et. Bir sayının mutlak değeri, basitçe <em>onun sıfıra olan uzaklığıdır</em> — sağda mı solda mı durduğunu önemsemeden. $|3|=3$, çünkü 3 sıfırın üç birim sağındadır. $|-3|=3$, çünkü $-3$ de sıfıra üç birim uzaktadır, sadece diğer tarafta. Uzaklık asla negatif olmaz.</div>

<p class="l-text">Resmi olarak mutlak değer fonksiyonu <strong>parçalı</strong> tanımlanır. Kural $x=0$'da ayrılır, çünkü "işareti kaldırma" fikri iki tarafta farklı davranır:</p>

<div class="calc-formula"><div class="formula-label">MUTLAK DEĞER &mdash; PARÇALI TANIM</div><div class="formula-main">$$|x| \\;=\\; \\begin{cases} \\,x, & x \\ge 0 \\\\ -x, & x < 0 \\end{cases}$$</div><div class="formula-sub">Negatif olmayan girdiler için fonksiyon hiçbir şey yapmaz. Negatif girdiler için işareti çevirir. İki parça $x=0$'da değer olarak uyumlu buluşur (ikisi de 0 verir) ama eğim $-1$'den $+1$'e ani değişir.</div></div>

<p class="l-text"><strong>Geometrik anlam.</strong> Daha genel bir bakış: herhangi iki reel sayı $a$ ve $b$ için, $|a-b|$ ifadesi sayı doğrusu üzerinde aralarındaki uzaklıktır. Standart mutlak değer $|x|$ ise sadece özel hali, $|x-0|$, yani $x$'in başlangıca uzaklığıdır. Bu yorum, tüm mutlak değer özdeşliklerini hatırlamanın en yararlı yoludur.</p>

<div class="calc-formula"><div class="formula-label">UZAKLIK YORUMU</div><div class="formula-main">$$|a-b| \\;=\\; a \\text{ ile } b \\text{ arasındaki reel doğru uzaklığı.}$$</div><div class="formula-sub">$a$ ve $b$'de simetriktir: $|a-b|=|b-a|$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tanım kümesi</div><div class="card-body">Tüm reel sayılar: $\\mathbb{R}$. Kuralın başarısız olduğu hiçbir girdi yoktur.</div></div>
<div class="calc-card"><div class="card-title">Görüntü kümesi</div><div class="card-body">$[0,\\infty)$. Uzaklıklar asla negatif olmaz.</div></div>
<div class="calc-card"><div class="card-title">Simetri</div><div class="card-body">Çift fonksiyon: her reel $x$ için $|-x| = |x|$. Grafik y-eksenine göre ayna-simetriktir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$|{-7}| + |2-5| - |3|$ ifadesini hesapla.<br><br>$|-7|=7$. $|2-5|=|-3|=3$. $|3|=3$.<br>Toplam: $7 + 3 - 3 = \\mathbf{7}$.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Düz Türkçeye çevir: "$|x-4|<2$" demek, "$x$'in 4'e uzaklığı 2'den az" demektir. Bu hangi aralığı betimler? Cevap: $2 < x < 6$, yani açık aralık $(2,6)$.</div></div>

<h2 class="lesson-title">2. Mutlak Değerin Özellikleri</h2>

<div class="calc-highlight"><strong>Ezberlenmesi gereken beş özdeşlik.</strong> Yazacağın her eşitsizlikte, her uzaklık argümanında ve her hata kestirmesinde kullanılırlar. İlk üçü standarttır; son ikisi ünlü üçgen eşitsizlikleridir.</div>

<div class="calc-formula"><div class="formula-label">BEŞ TEMEL ÖZDEŞLİK</div><div class="formula-main">$$|x| \\ge 0, \\qquad |x|=0 \\iff x=0, \\qquad |{-x}|=|x|$$ $$|xy|=|x|\\cdot|y|, \\qquad \\left|\\frac{x}{y}\\right|=\\frac{|x|}{|y|} \\;(y\\ne 0)$$ $$\\big||x|-|y|\\big| \\;\\le\\; |x \\pm y| \\;\\le\\; |x|+|y|$$</div><div class="formula-sub">Alt satırdaki zincir <em>üçgen eşitsizliğidir</em>: sağ taraf toplam ve farkları yukarıdan sınırlar; sol taraf alt sınır verir.</div></div>

<p class="l-text"><strong>Neden "üçgen"?</strong> Bir düzleme üç nokta yerleştir; oluşturdukları üçgenin en uzun kenarı en fazla diğer iki kenarın toplamına eşit olabilir. Reel doğruda da aynı fikir işler: $|x+y|$, $-y$'den $x$'e olan uzaklıktır ve bu uzaklık $|x| + |y|$'yi geçemez (0'dan iki adımda geçerek). Eşitlik $x$ ile $y$ aynı işaretli olduğunda olur.</p>

<div class="calc-formula"><div class="formula-label">KARE ÖZDEŞLİĞİ</div><div class="formula-main">$$|x|^2 = x^2 \\qquad\\text{ve}\\qquad |x| = \\sqrt{x^2}$$</div><div class="formula-sub">Bu, mutlak değer ile karekök arasındaki cebirsel köprüdür. $|x|$'in uzaklık formüllerinde görünmesinin nedeni budur: $\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$ aynı fikri iki boyutta kullanır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; $|xy|=|x||y|$ KULLANIMI</div><div class="example-body">$|{-3}\\cdot 4 \\cdot (-2)|$ ifadesini sadeleştir.<br><br>Doğrudan yol: çarpım $24$, yani $|24|=24$.<br>Özdeşlik yolu: $|-3|\\cdot|4|\\cdot|-2| = 3\\cdot 4\\cdot 2 = 24$. Aynı cevap.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; ÜÇGEN EŞİTSİZLİĞİ KONTROLÜ</div><div class="example-body">$|3+(-5)| \\le |3|+|-5|$ eşitsizliğini doğrula.<br><br>Sol taraf: $|{-2}|=2$. Sağ taraf: $3+5=8$. Gerçekten $2 \\le 8$. $3$ ve $-5$ zıt işaretli olduğu için eşitsizlik kesin.</div></div>

<div class="l-note"><strong>Yaygın bir tuzak:</strong> öğrenciler bazen mutlak değeri toplama "dağıtır": $|x+y| = |x|+|y|$. Bu <em>genelde yanlıştır</em> — yalnızca $x$ ve $y$ aynı işaretli olduğunda doğrudur. Doğru ilişki eşitlik değil eşitsizliktir.</div>

<h2 class="lesson-title">3. Taban Fonksiyonu $\\lfloor x \\rfloor$</h2>

<div class="calc-highlight"><strong>Taban fonksiyonu aşağı yuvarlar.</strong> Herhangi bir reel sayı $x$ verildiğinde, $\\lfloor x \\rfloor$ $x$'ten küçük veya eşit en büyük tamsayıdır. Yani $\\lfloor 3.7 \\rfloor = 3$, $\\lfloor 5 \\rfloor = 5$ ve $\\lfloor -2.3 \\rfloor = -3$ (dikkat: negatifler için "aşağı" yuvarlama daha negatife gitmek demektir, sıfıra doğru değil).</div>

<div class="calc-formula"><div class="formula-label">TABAN &mdash; TANIM</div><div class="formula-main">$$\\lfloor x \\rfloor \\;=\\; \\max\\{\\, n \\in \\mathbb{Z} \\;:\\; n \\le x \\,\\}$$</div><div class="formula-sub">Eşdeğer olarak: $n \\le x < n+1$ koşulunu sağlayan tek tamsayı $n$.</div></div>

<p class="l-text"><strong>Grafik şekli.</strong> $y=\\lfloor x \\rfloor$'in grafiği bir merdivendir. Her $[n,n+1)$ aralığında fonksiyon sabit tamsayı $n$'ye eşittir. Her tamsayıda grafik 1 birim yukarı sıçrar. Geleneksel olarak her basamağın sol uç noktası dolu çizilir ($n$ değeri alınır) ve sağ uç noktası boştur ($n+1$ değeri bir sonraki basamağa geçmiştir).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tanım &amp; görüntü</div><div class="card-body">Tanım: $\\mathbb{R}$. Görüntü: $\\mathbb{Z}$ (her çıktı bir tamsayıdır).</div></div>
<div class="calc-card"><div class="card-title">Temel değerler</div><div class="card-body">$\\lfloor 0 \\rfloor = 0$, $\\lfloor 3.99 \\rfloor = 3$, $\\lfloor -0.5 \\rfloor = -1$, $\\lfloor \\pi \\rfloor = 3$.</div></div>
<div class="calc-card"><div class="card-title">Süreksizlikler</div><div class="card-body">Her tamsayıda $+1$ büyüklüğünde sıçrama. Ardışık tamsayılar arasında fonksiyon sabittir (eğim 0).</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; NEGATİFLERİN TABANI</div><div class="example-body">$\\lfloor -2.3 \\rfloor$, $\\lfloor -2 \\rfloor$ ve $\\lfloor -1.7 \\rfloor$ değerlerini hesapla.<br><br>$-2.3$ için: $\\le -2.3$ olan en büyük tamsayı $-3$'tür (çünkü $-2 > -2.3$, yani $-2$ çok büyük).<br>Tam $-2$ için: $\\lfloor -2 \\rfloor = -2$ (tamsayılar değişmez).<br>$-1.7$ için: $\\le -1.7$ olan en büyük tamsayı $-2$'dir.<br><br>Örüntü: negatif bir non-tamsayının tabanı, sayının kendisinden kesinlikle daha negatiftir.</div></div>

<div class="l-note"><strong>Notasyon notu:</strong> bazı Türk lise ders kitapları taban fonksiyonunu $[x]$ (köşeli parantez) yazar ve "tamdeğer" fonksiyonu olarak adlandırır. Uluslararası gösterimde $\\lfloor x \\rfloor$ daha açıktır. Biz tabana benzeyen parantezi kullanacağız: aşağı doğru açılan.</div>

<h2 class="lesson-title">4. Tavan Fonksiyonu $\\lceil x \\rceil$</h2>

<div class="calc-highlight"><strong>Tavan fonksiyonu yukarı yuvarlar.</strong> Tabanın aynası: $\\lceil x \\rceil$, $x$'ten büyük veya eşit en küçük tamsayıdır. Yani $\\lceil 3.2 \\rceil = 4$, $\\lceil 5 \\rceil = 5$ ve $\\lceil -2.7 \\rceil = -2$ (negatifler için "yukarı" yuvarlama sıfıra yaklaşmak demektir).</div>

<div class="calc-formula"><div class="formula-label">TAVAN &mdash; TANIM</div><div class="formula-main">$$\\lceil x \\rceil \\;=\\; \\min\\{\\, n \\in \\mathbb{Z} \\;:\\; n \\ge x \\,\\}$$</div><div class="formula-sub">Eşdeğer olarak: $n-1 < x \\le n$ koşulunu sağlayan tek tamsayı $n$.</div></div>

<p class="l-text"><strong>Grafik şekli.</strong> Yine bir merdiven, ama basamaklar kaymıştır. Her $(n,n+1]$ aralığında fonksiyon sabit tamsayı $n+1$'e eşittir. Her tamsayıda değer o tamsayıya geri düşer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hızlı kural</div><div class="card-body">$x$ zaten tamsayı ise $\\lceil x \\rceil = x = \\lfloor x \\rfloor$. Aksi halde $\\lceil x \\rceil = \\lfloor x \\rfloor + 1$.</div></div>
<div class="calc-card"><div class="card-title">Örnek değerler</div><div class="card-body">$\\lceil 0 \\rceil = 0$, $\\lceil 3.01 \\rceil = 4$, $\\lceil -0.5 \\rceil = 0$, $\\lceil \\pi \\rceil = 4$.</div></div>
<div class="calc-card"><div class="card-title">Gerçek hayat kullanımı</div><div class="card-body">"Kaç otobüse ihtiyacımız var?" — yolcu sayısı kapasiteye bölünür, sonra $\\lceil \\cdot \\rceil$. Her zaman yukarı yuvarlarsın, çünkü yarım otobüs koşturamazsın.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; KELİME PROBLEMİNDE TAVAN</div><div class="example-body">Bir otobüs 45 yolcu taşıyor. Bir okul gezisinde 200 öğrenci var. Kaç otobüs gerekir?<br><br>$200 / 45 \\approx 4.44$ otobüs.<br>$\\lceil 4.44 \\rceil = 5$. Yani <strong>5 otobüs</strong> gerekir (4 otobüs 20 öğrenciyi mahsur bırakır).</div></div>

<h2 class="lesson-title">5. Taban &amp; Tavan Özdeşlikleri ve Görsel Karşılaştırma</h2>

<div class="calc-highlight"><strong>Bilmen gereken dört özdeşlik.</strong> Taban ve tavanı birbirine ve negasyona bağlar; ikisini karıştıran her ifadeyi sadeleştirmeni sağlar.</div>

<div class="calc-formula"><div class="formula-label">TEMEL ÖZDEŞLİKLER</div><div class="formula-main">$$\\lceil x \\rceil = -\\lfloor -x \\rfloor \\qquad\\text{ve}\\qquad \\lfloor x \\rfloor = -\\lceil -x \\rceil$$ $$\\lfloor x \\rfloor + \\lceil x \\rceil = \\begin{cases} 2x & x \\in \\mathbb{Z} \\\\ 2\\lfloor x \\rfloor + 1 & x \\notin \\mathbb{Z} \\end{cases}$$ $$\\lfloor x+n \\rfloor = \\lfloor x \\rfloor + n \\quad\\text{her tamsayı } n \\text{ için}$$</div><div class="formula-sub">Negasyon kuralı, taban ve tavanı başlangıç noktasından yansıtır. Toplam kuralı: tamsayılarda ikisi de $x$'e eşit (toplam $2x$); tamsayı olmayanlarda tam $1$ fark vardır (toplam $2\\lfloor x \\rfloor + 1$). Kaydırma kuralı: bir tamsayı eklemek sadece merdiveni kaydırır.</div></div>

<div class="calc-graph"><div id="plot-l46-special-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> bu dersin dört özel fonksiyonu $[-3,3]$ aralığında yan yana. Sol üst: $|x|$, başlangıçta köşeli V şekli. Sağ üst: $\\lfloor x \\rfloor$, aşağı yuvarlanan merdiven. Sol alt: $\\lceil x \\rceil$, bir basamak yukarı kaymış yuvarlanan merdiven. Sağ alt: $\\operatorname{sgn}(x)$, üç-seviyeli anahtar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var absX=[];var absY=[];for(var i=0;i<=120;i++){var v=-3+6*i/120;absX.push(v);absY.push(Math.abs(v));}
var absT={x:absX,y:absY,mode:'lines',name:'|x|',line:{color:'#3b82f6',width:3},xaxis:'x1',yaxis:'y1'};
var floorXs=[],floorYs=[];for(var n=-3;n<=2;n++){floorXs.push(n,n+1,null);floorYs.push(n,n,null);}
var floorT={x:floorXs,y:floorYs,mode:'lines',name:'floor(x)',line:{color:'#22c55e',width:3},xaxis:'x2',yaxis:'y2'};
var ceilXs=[],ceilYs=[];for(var n=-3;n<=2;n++){ceilXs.push(n,n+1,null);ceilYs.push(n+1,n+1,null);}
var ceilT={x:ceilXs,y:ceilYs,mode:'lines',name:'ceil(x)',line:{color:'#f59e0b',width:3},xaxis:'x3',yaxis:'y3'};
var sgnT={x:[-3,0],y:[-1,-1],mode:'lines',name:'sgn(x)',line:{color:'#ef4444',width:3},xaxis:'x4',yaxis:'y4'};
var sgnT2={x:[0,3],y:[1,1],mode:'lines',showlegend:false,line:{color:'#ef4444',width:3},xaxis:'x4',yaxis:'y4'};
var sgnT3={x:[0],y:[0],mode:'markers',showlegend:false,marker:{color:'#ef4444',size:10,symbol:'circle'},xaxis:'x4',yaxis:'y4'};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist',size:11},showlegend:false,
grid:{rows:2,columns:2,pattern:'independent'},
xaxis1:{title:'|x|',domain:[0,0.46],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,3]},
yaxis1:{domain:[0.55,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-0.3,3.2]},
xaxis2:{title:'floor(x)',domain:[0.54,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,3]},
yaxis2:{domain:[0.55,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3.5,3.5]},
xaxis3:{title:'ceil(x)',domain:[0,0.46],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,3]},
yaxis3:{domain:[0,0.45],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3.5,3.5]},
xaxis4:{title:'sgn(x)',domain:[0.54,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,3]},
yaxis4:{domain:[0,0.45],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-1.5,1.5]},
margin:{t:20,r:30,b:40,l:50}};
Plotly.newPlot('plot-l46-special-tr',[absT,floorT,ceilT,sgnT,sgnT2,sgnT3],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l46-stairs-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> taban (yeşil, kesintisiz) ve tavan (turuncu, kesikli) aynı eksenlerde, $-3 \\le x \\le 3$. İkisi de merdivendir; tavan, $x$ tamsayı olmadığında tam bir basamak tabanın üstündedir ve tamsayılarda çakışır (noktalı dikey çizgilerle gösterilmiş).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var fX=[],fY=[];for(var n=-3;n<=2;n++){fX.push(n,n+1,null);fY.push(n,n,null);}
var cX=[],cY=[];for(var n=-3;n<=2;n++){cX.push(n,n+1,null);cY.push(n+1,n+1,null);}
var f={x:fX,y:fY,mode:'lines',name:'floor(x)',line:{color:'#22c55e',width:3}};
var c={x:cX,y:cY,mode:'lines',name:'ceil(x)',line:{color:'#f59e0b',width:3,dash:'dash'}};
var gridXs=[],gridYs=[];for(var k=-3;k<=3;k++){gridXs.push(k,k,null);gridYs.push(-3.5,3.5,null);}
var gridL={x:gridXs,y:gridYs,mode:'lines',name:'tamsayılar',line:{color:'rgba(255,255,255,0.12)',width:1,dash:'dot'},showlegend:false};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-3.5,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l46-stairs-tr',[gridL,f,c],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; NEGASYONU KULLANMAK</div><div class="example-body">$\\lceil -3.4 \\rceil$ değerini negasyon özdeşliğiyle hesapla.<br><br>$\\lceil -3.4 \\rceil = -\\lfloor 3.4 \\rfloor = -3$.<br><br>Doğrudan kontrol: $\\ge -3.4$ olan en küçük tamsayı $-3$. Uyumlu.</div></div>

<h2 class="lesson-title">6. İşaret Fonksiyonu $\\operatorname{sgn}(x)$</h2>

<div class="calc-highlight"><strong>İşaret fonksiyonu yalnızca yönü bildirir.</strong> Büyüklüğü atar ve "$x$ pozitif mi, negatif mi, sıfır mı?" sorusunun cevabını tutar. Üç olası cevap $+1, -1, 0$ fonksiyonun çıktısı olarak verilir.</div>

<div class="calc-formula"><div class="formula-label">İŞARET &mdash; PARÇALI TANIM</div><div class="formula-main">$$\\operatorname{sgn}(x) \\;=\\; \\begin{cases} \\,+1, & x > 0 \\\\ \\;\\;\\,0, & x = 0 \\\\ -1, & x < 0 \\end{cases}$$</div><div class="formula-sub">Üç sabit parça. Fonksiyon tektir: $\\operatorname{sgn}(-x) = -\\operatorname{sgn}(x)$.</div></div>

<p class="l-text"><strong>Temel ayrışım.</strong> İşaret ve mutlak değer temiz biçimde birbirine oturur: her sıfırdan farklı reel sayı, büyüklüğü çarpı yönüdür.</p>

<div class="calc-formula"><div class="formula-label">İŞARET&times;BÜYÜKLÜK AYRIŞIMI</div><div class="formula-main">$$x \\;=\\; |x| \\cdot \\operatorname{sgn}(x) \\qquad\\text{ve}\\qquad |x| \\;=\\; x \\cdot \\operatorname{sgn}(x)$$</div><div class="formula-sub">Fizikte yararlı bir özdeşlik: 1B'de çalışırken bir kuvvet vektörü $F$'yi büyüklüğü $|F|$ ve yönü $\\operatorname{sgn}(F)$ olarak ayır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Görüntü kümesi</div><div class="card-body">Yalnızca üç değer: $\\{-1, 0, +1\\}$. Şimdiye kadar tanımladığımız herhangi bir fonksiyonun en küçük görüntü kümesi.</div></div>
<div class="calc-card"><div class="card-title">Simetri</div><div class="card-body">Tek fonksiyon: grafik orijine göre nokta-simetriktir. Çift olan $|x|$ ile karşılaştır.</div></div>
<div class="calc-card"><div class="card-title">Alternatif formül</div><div class="card-body">$x \\ne 0$ için: $\\operatorname{sgn}(x) = x / |x|$. Oran işareti çıkarır çünkü büyüklükler sadeleşir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\operatorname{sgn}(-7) + \\operatorname{sgn}(0) + \\operatorname{sgn}(\\pi)$ değerini hesapla.<br><br>$\\operatorname{sgn}(-7) = -1$. $\\operatorname{sgn}(0) = 0$. $\\operatorname{sgn}(\\pi) = +1$ ($\\pi > 0$ olduğu için).<br>Toplam: $-1 + 0 + 1 = \\mathbf{0}$.</div></div>

<h2 class="lesson-title">7. Birim Adım (Heaviside) Fonksiyonu $H(x)$</h2>

<div class="calc-highlight"><strong>Birim adım bir "anahtardır."</strong> Başlangıçtan önce sıfırdır, sonra birdir — "kaynak sıfır anında devreye girer" gibi bir şeyi modellemek istediğinde yararlıdır. Bu tür fonksiyonları devre analizinde öncülük eden İngiliz mühendis Oliver Heaviside'ın adıyla anılır.</div>

<div class="calc-formula"><div class="formula-label">HEAVISIDE &mdash; TANIM</div><div class="formula-main">$$H(x) \\;=\\; \\begin{cases} \\,0, & x < 0 \\\\ \\,1, & x \\ge 0 \\end{cases}$$</div><div class="formula-sub">$x=0$'da $+1$ büyüklüğünde tek bir sıçrama. Bazı sözleşmeler $H(0) = 1/2$ alır (iki parçanın ortalaması); bizim amaçlarımız için sıçramanın anındaki değer nadiren önemlidir.</div></div>

<p class="l-text"><strong>Kaydırılmış adımlar.</strong> Anahtarın $0$ yerine $x=a$'da değişmesini istersen, sadece girdi kaydır:</p>

<div class="calc-formula"><div class="formula-label">KAYDIRILMIŞ ADIM</div><div class="formula-main">$$H(x - a) \\;=\\; \\begin{cases} \\,0, & x < a \\\\ \\,1, & x \\ge a \\end{cases}$$</div></div>

<p class="l-text"><strong>Adım kombinasyonları "dikdörtgenler" oluşturur.</strong> Mühendislikte yaygın bir hile: $a$ ile $b$ arasında açık olan bir pals'i iki adımı çıkararak modellemek:</p>

<div class="calc-formula"><div class="formula-label">$b-a$ GENİŞLİĞİNDE PALS</div><div class="formula-main">$$P_{[a,b]}(x) \\;=\\; H(x-a) - H(x-b)$$</div><div class="formula-sub">$[a,b)$'de 1'e eşit, başka yerde sıfır.</div></div>

<div class="calc-graph"><div id="plot-l46-step-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> işaret fonksiyonu $\\operatorname{sgn}(x)$ (kırmızı) Heaviside adımı $H(x)$ (camgöbeği) ile karşılaştırılıyor. İkisi de başlangıçta sıçrar, ancak işaret $-1$'den $+1$'e gider (görüntü $\\{-1,0,1\\}$), Heaviside ise $0$'dan $1$'e gider. $x\\ne 0$ için $H(x) = \\tfrac{1}{2}(1+\\operatorname{sgn}(x))$ özdeşliğiyle bağlıdırlar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var sN={x:[-3,0],y:[-1,-1],mode:'lines',name:'sgn(x)',line:{color:'#ef4444',width:3}};
var sP={x:[0,3],y:[1,1],mode:'lines',name:'sgn(x) (sağ)',line:{color:'#ef4444',width:3},showlegend:false};
var sZ={x:[0],y:[0],mode:'markers',name:'sgn(0)=0',marker:{color:'#ef4444',size:10}};
var hN={x:[-3,0],y:[0,0],mode:'lines',name:'H(x)',line:{color:'#06b6d4',width:3,dash:'dash'}};
var hP={x:[0,3],y:[1,1],mode:'lines',name:'H(x) (sağ)',line:{color:'#06b6d4',width:3,dash:'dash'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1.5,1.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l46-step-tr',[sN,sP,sZ,hN,hP],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Çözümlü Örnekler: Dönüşümleri Birleştirme</h2>

<p class="l-text">Sınav problemlerinin çoğu bu fonksiyonları tek başına göstermez; yatay/dikey kaydırmalar, yansımalar ve ölçeklemelerle birleştirir. Önceki derslerde grafik dönüşümlerini gördük. Aynı kuralları burada uygula.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1 &mdash; KAYDIRILMIŞ MUTLAK DEĞER</div><div class="example-body"><strong>$y = |x-2| - 1$'i çiz ve minimumunu bul.</strong><br><br>$y=|x|$ ile başla (köşesi başlangıçta V şekli). 2 birim sağa kaydır, $y=|x-2|$ elde et (köşe $(2,0)$'da). 1 birim aşağı kaydır, $y=|x-2|-1$ elde et (köşe $(2,-1)$'de).<br><br>Minimum değer $\\mathbf{-1}$, $x=2$'de alınır. $x < 2$ için fonksiyon $-1$ eğimiyle azalır; $x > 2$ için $+1$ eğimiyle artar.</div></div>

<div class="calc-graph"><div id="plot-l46-shift-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> temel V şekli $y=|x|$ (kesikli gri) ve dönüştürülmüş hali $y=|x-2|-1$ (mavi). Köşe 2 birim sağa ve 1 birim aşağı kaymış. $\\pm 1$ olan iki eğim değişmemiş.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var b1=[];var b2=[];for(var i=0;i<=120;i++){var v=-3+8*i/120;xs.push(v);b1.push(Math.abs(v));b2.push(Math.abs(v-2)-1);}
var T1={x:xs,y:b1,mode:'lines',name:'|x|',line:{color:'rgba(255,255,255,0.4)',width:2,dash:'dash'}};
var T2={x:xs,y:b2,mode:'lines',name:'|x-2|-1',line:{color:'#3b82f6',width:3}};
var vMark={x:[2],y:[-1],mode:'markers+text',name:'köşe',marker:{color:'#3b82f6',size:10},text:['(2,-1)'],textposition:'bottom right',showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-2,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l46-shift-tr',[T1,T2,vMark],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 &mdash; $|2x-3| = 5$ ÇÖZÜMÜ</div><div class="example-body">$|A|=k$ (ile $k\\ge 0$) iki duruma ayrılır: $A = k$ veya $A = -k$.<br><br>$2x - 3 = 5 \\implies x = 4$.<br>$2x - 3 = -5 \\implies x = -1$.<br><br>Çözüm kümesi: $\\boxed{x \\in \\{-1, 4\\}}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3 &mdash; KESİRLİ KISIM</div><div class="example-body">$x$'in <em>kesirli kısmı</em> $\\{x\\} = x - \\lfloor x \\rfloor$ olarak tanımlanır. $5.7$, $3$ ve $-2.3$'ün kesirli kısımlarını hesapla.<br><br>$\\{5.7\\} = 5.7 - 5 = 0.7$.<br>$\\{3\\} = 3 - 3 = 0$.<br>$\\{-2.3\\} = -2.3 - (-3) = -2.3 + 3 = 0.7$.<br><br>Yapı gereği $0 \\le \\{x\\} < 1$ her zaman geçerlidir &mdash; negatif $x$ için de. Bu, tabanın (sıfıra doğru kesmenin yerine) güzel bir özelliğidir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 4 &mdash; PARÇA-PARÇA FORMÜL</div><div class="example-body">$f(x) = |x| + \\operatorname{sgn}(x)$'i üç aralıkta parçalı fonksiyon olarak yeniden yaz.<br><br>$x > 0$ için: $|x| = x$ ve $\\operatorname{sgn}(x) = 1$, yani $f(x) = x + 1$.<br>$x = 0$ için: $|x| = 0$ ve $\\operatorname{sgn}(0) = 0$, yani $f(0) = 0$.<br>$x < 0$ için: $|x| = -x$ ve $\\operatorname{sgn}(x) = -1$, yani $f(x) = -x - 1$.<br><br>$$f(x) = \\begin{cases} x+1 & x > 0 \\\\ 0 & x = 0 \\\\ -x-1 & x < 0 \\end{cases}$$<br>Sıçramaya dikkat: $x \\to 0^+$ iken $f \\to 1$; $x \\to 0^-$ iken $f \\to -1$; ama $f(0) = 0$. "0 yakınında üç farklı değer."</div></div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; MUTLAK DEĞER DENKLEMİ</div><div class="example-body"><strong>$|3x + 2| = 7$ denklemini çöz.</strong><br><br>$3x+2 = 7 \\Rightarrow x = \\dfrac{5}{3}$.<br>$3x+2 = -7 \\Rightarrow x = -3$.<br><br>Cevap: $x \\in \\left\\{-3, \\dfrac{5}{3}\\right\\}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; MUTLAK DEĞER EŞİTSİZLİĞİ</div><div class="example-body"><strong>$|x - 4| < 3$ eşitsizliğini çöz.</strong><br><br>Uzaklık yorumu: $x$, 4'e 3 birimden daha yakındır. Yani $4-3 < x < 4+3$, yani $1 < x < 7$.<br><br>Cevap: $x \\in (1, 7)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; TABAN DENKLEMİ</div><div class="example-body"><strong>$\\lfloor x \\rfloor = 5$ olan tüm reel $x$ değerlerini bul.</strong><br><br>Tanım gereği, $\\lfloor x \\rfloor = 5$, $5 \\le x < 6$ demektir. Çözüm yarı-açık aralık $[5, 6)$'dır.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; TAVAN DENKLEMİ</div><div class="example-body"><strong>$\\lceil x \\rceil = -2$ olan tüm reel $x$ değerlerini bul.</strong><br><br>$\\lceil x \\rceil = -2$, $-3 < x \\le -2$ demektir. Çözüm yarı-açık aralık $(-3, -2]$'dir.<br><br>PROBLEM 3'ten farkını gözle: hangi taraf açık, hangisi kapalı — taban basamakları sol uç noktayı içerir, tavan basamakları sağ uç noktayı.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; İŞARET ÖZDEŞLİĞİ</div><div class="example-body"><strong>$|3x|$'i mutlak değer kullanmadan, işaret fonksiyonuyla ifade et.</strong><br><br>Herhangi bir reel $x$ için: $|3x| = 3x \\cdot \\operatorname{sgn}(3x) = 3x \\cdot \\operatorname{sgn}(x)$ (3 pozitif olduğu için).<br><br>Sağlık kontrolü: $x = -2$'de, sol taraf $|-6| = 6$. Sağ taraf $3(-2) \\cdot (-1) = -6 \\cdot -1 = 6$. Uyumlu.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; HEAVISIDE İLE PALS</div><div class="example-body"><strong>"$[2,5)$ üzerinde 1'e eşit, başka yerde sıfır" olan fonksiyonu Heaviside adımlarıyla yaz.</strong><br><br>$f(x) = H(x-2) - H(x-5)$.<br>Doğrulama: $x < 2$ için iki terim de 0, yani $f=0$. $2 \\le x < 5$ için, $H(x-2)=1$ ve $H(x-5)=0$, yani $f=1$. $x \\ge 5$ için, ikisi de 1 ve $f=0$. Uyumlu.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Sonraki derste rasyonel fonksiyonlar ve asimptotlarla tanışacaksın — orada $|f(x)| \\to \\infty$ gibi limitleri betimlerken mutlak değer yeniden çıkar. Taban fonksiyonu sayı kuramı devreye girdiğinde (bir aralıktaki tamsayıları saymak) yeniden çıkar. İşaret ve adım fonksiyonları, süreksizlikleri ve Dirac delta'yı çalıştığında kalkülüste geri döner.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Mutlak değer: $|x| = x$ ($x\\ge 0$ ise), aksi halde $-x$. Başlangıçta köşeli V şekli grafiği</li>
<li>$|a-b|$, reel doğru üzerinde $a$ ile $b$ arasındaki uzaklıktır</li>
<li>Üçgen eşitsizliği: $|x+y| \\le |x|+|y|$, eşitlik yalnızca $x,y$ aynı işaretli olduğunda</li>
<li>Taban: $\\lfloor x \\rfloor$ en yakın tamsayıya aşağı yuvarlar; merdiven grafiği</li>
<li>Tavan: $\\lceil x \\rceil$ yukarı yuvarlar; $\\lceil x \\rceil = -\\lfloor -x \\rfloor$ ile bağlıdırlar</li>
<li>İşaret: $\\operatorname{sgn}(x) \\in \\{-1,0,+1\\}$; $x = |x| \\cdot \\operatorname{sgn}(x)$ ayrışımını verir</li>
<li>Heaviside adımı: $H(x) = 0$ ($x<0$ için), $1$ ($x\\ge 0$ için); pals oluşturmak için birleştir</li>
<li>Dört fonksiyon da pürüzsüz değildir: tamsayı noktalarında veya başlangıçta bükülürler (mutlak değer) ya da sıçrarlar (taban, tavan, işaret, H)</li>
</ul>
</div>`

};
