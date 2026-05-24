window.LISE_MAT_L44 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>An inverse function is a function that undoes another function.</strong> If $f$ sends 3 to 10, then $f^{-1}$ sends 10 back to 3. That is the entire idea. Add 7 and subtract 7. Multiply by 4 and divide by 4. Cube and take the cube root. Every elementary operation you have ever learned has an inverse, and pairing each operation with its inverse is the bookkeeping that lets you solve equations.</p>

<p class="l-text">By the end of this lesson you will be able to decide whether a given function has an inverse (the one-to-one test), construct the inverse algebraically by a clean five-step recipe, sketch the inverse graph as the mirror image of the original across the line $y = x$, and restrict the domain of a non-one-to-one function so that an inverse exists. These skills are the foundation for logarithms (inverse of the exponential), inverse trigonometric functions, and every equation-solving technique in the rest of high-school mathematics.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the meaning of an inverse function as the operation that reverses the input-output direction of $f$</li>
<li>Test whether a function is <em>one-to-one</em> using the horizontal line test on its graph</li>
<li>Construct $f^{-1}$ from $f$ using the five-step recipe (write $y=f(x)$, solve for $x$, swap $x$ and $y$, declare $f^{-1}$, verify by composition)</li>
<li>Recognise that the graphs of $f$ and $f^{-1}$ are reflections of each other across the line $y = x$</li>
<li>Restrict the domain of a non-one-to-one function (such as $y = x^2$) so that an inverse can be defined</li>
<li>Identify the standard inverse pairs: exponential and logarithm, sine and arcsine, cube and cube root</li>
</ul>
</div>

<h2 class="lesson-title">1. The Intuition: Reversing Input and Output</h2>

<div class="calc-highlight"><strong>Picture a function as a machine.</strong> You drop in a number $x$, the machine processes it, and out comes $f(x)$. An <em>inverse</em> machine takes that output $f(x)$ as its input and gives back the original $x$. The two machines, run in sequence, leave the number unchanged. That round-trip property is the whole definition of an inverse function.</div>

<p class="l-text">A concrete example. Let $f(x) = x + 7$ — the "add seven" machine. Drop in 3 and out comes 10. What machine reverses this? The "subtract seven" machine. Drop 10 into "subtract seven" and out comes 3 again. So the inverse of "add seven" is "subtract seven". We write this as $f^{-1}(x) = x - 7$.</p>

<div class="calc-formula"><div class="formula-label">THE ROUND-TRIP IDENTITY</div><div class="formula-main">$$f^{-1}(f(x)) \\;=\\; x \\qquad \\text{and} \\qquad f(f^{-1}(x)) \\;=\\; x$$</div><div class="formula-sub">Applying $f$ then $f^{-1}$ (or the other way round) returns the original number. This is the operational definition of an inverse function.</div></div>

<p class="l-text"><strong>Symbol watch.</strong> The notation $f^{-1}$ does <em>not</em> mean $1/f$. It means "the function that undoes $f$". The superscript &minus;1 here is functional notation, just like $\\sin^{-1}$ or $\\log$. The reciprocal $1/f(x)$ is a completely different object. Confusing the two is the most common mistake in this whole topic — be careful.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Add &harr; Subtract</div><div class="card-body">$f(x) = x + 5$ and $f^{-1}(x) = x - 5$. Adding 5 then subtracting 5 returns the input.</div></div>
<div class="calc-card"><div class="card-title">Multiply &harr; Divide</div><div class="card-body">$f(x) = 4x$ and $f^{-1}(x) = x/4$. Quadrupling then quartering returns the input.</div></div>
<div class="calc-card"><div class="card-title">Cube &harr; Cube root</div><div class="card-body">$f(x) = x^3$ and $f^{-1}(x) = \\sqrt[3]{x}$. Cubing then taking the cube root returns the input.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">What is the inverse of $f(x) = 3x - 6$? In words: triple, then subtract 6. To undo it, reverse the order and reverse each operation: <em>add</em> 6 first, then <em>divide</em> by 3. So $f^{-1}(x) = (x + 6)/3$. Verify by trying $x = 4$: $f(4) = 6$, and then $f^{-1}(6) = (6+6)/3 = 4$. Round trip succeeds.</div></div>

<h2 class="lesson-title">2. One-to-One Functions and the Horizontal Line Test</h2>

<div class="calc-highlight"><strong>Not every function has an inverse.</strong> For an inverse to exist, the original function must be <em>one-to-one</em>: every output must come from exactly one input. If two different inputs produce the same output, the inverse machine cannot know which input to return — the mapping is ambiguous and no inverse function exists.</div>

<p class="l-text">A function $f$ is <strong>one-to-one</strong> (sometimes called <em>injective</em>) if whenever $f(a) = f(b)$, we must have $a = b$. Equivalently, different inputs always produce different outputs. The function $f(x) = x + 7$ is one-to-one: every output comes from one and only one input. The function $g(x) = x^2$ is <em>not</em> one-to-one on the whole real line: $g(2) = 4$ and $g(-2) = 4$, so the output 4 comes from two different inputs (2 and &minus;2).</p>

<div class="calc-formula"><div class="formula-label">ONE-TO-ONE — FORMAL DEFINITION</div><div class="formula-main">$$f \\text{ is one-to-one} \\iff \\bigl(\\, f(a) = f(b) \\implies a = b \\,\\bigr)$$</div><div class="formula-sub">Equivalent contrapositive: if $a \\neq b$, then $f(a) \\neq f(b)$. Distinct inputs go to distinct outputs.</div></div>

<p class="l-text"><strong>The horizontal line test.</strong> The graphical version of one-to-oneness is a beautiful picture. Take the graph of $f$ and slide a horizontal line up and down across it. If at every height the horizontal line crosses the graph in <em>at most one point</em>, then $f$ is one-to-one. If at some height the line crosses the graph in two or more points, then $f$ is not one-to-one — the heights of those crossings are y-values produced by multiple x-values, exactly the ambiguity we wanted to rule out.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">PASSES HORIZONTAL TEST</div><div class="compare-item">$f(x) = x + 7$ (a straight line of slope 1)</div><div class="compare-item">$f(x) = x^3$ (the cubic — always increasing)</div><div class="compare-item">$f(x) = e^x$ (the exponential)</div><div class="compare-item">$f(x) = 1/x$ on $x &gt; 0$</div><div class="compare-item">Inverse exists on the entire domain</div></div><div class="compare-col"><div class="compare-title">FAILS HORIZONTAL TEST</div><div class="compare-item">$f(x) = x^2$ on all reals (parabola)</div><div class="compare-item">$f(x) = |x|$ (V-shape)</div><div class="compare-item">$f(x) = \\sin x$ (oscillates forever)</div><div class="compare-item">Any periodic function on its full period</div><div class="compare-item">Inverse requires domain restriction — see section 7</div></div></div>

<div class="calc-graph"><div id="plot-l44-htest-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two functions side by side. On the left, $f(x) = x^3$ — every horizontal line (dashed) crosses the curve exactly once, so the function is one-to-one. On the right, $g(x) = x^2$ — the horizontal line $y = 4$ crosses the parabola twice (at $x = -2$ and $x = 2$), so the function is <em>not</em> one-to-one and has no inverse on its full domain.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var cube=[];var sq=[];for(var i=-25;i<=25;i++){var x=i/10;xs.push(x);cube.push(x*x*x);sq.push(x*x);}
var cubeT={x:xs,y:cube,mode:'lines',name:'f(x)=x³',line:{color:'#10b981',width:3},xaxis:'x1',yaxis:'y1'};
var hLineCubeA={x:[-2.5,2.5],y:[3,3],mode:'lines',name:'y=3 line',line:{color:'rgba(255,255,255,0.35)',width:1.5,dash:'dash'},xaxis:'x1',yaxis:'y1',showlegend:false};
var hLineCubeB={x:[-2.5,2.5],y:[-5,-5],mode:'lines',line:{color:'rgba(255,255,255,0.35)',width:1.5,dash:'dash'},xaxis:'x1',yaxis:'y1',showlegend:false};
var crossCube={x:[Math.cbrt(3),Math.cbrt(-5)],y:[3,-5],mode:'markers',name:'single crossing',marker:{color:'#f59e0b',size:11,symbol:'circle'},xaxis:'x1',yaxis:'y1'};
var sqT={x:xs,y:sq,mode:'lines',name:'g(x)=x²',line:{color:'#ef4444',width:3},xaxis:'x2',yaxis:'y2'};
var hLineSq={x:[-2.5,2.5],y:[4,4],mode:'lines',name:'y=4 line',line:{color:'rgba(255,255,255,0.35)',width:1.5,dash:'dash'},xaxis:'x2',yaxis:'y2',showlegend:false};
var crossSq={x:[-2,2],y:[4,4],mode:'markers',name:'two crossings',marker:{color:'#f59e0b',size:11,symbol:'x'},xaxis:'x2',yaxis:'y2'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',domain:[0,0.46],range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-8,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},xaxis2:{title:'x',domain:[0.54,1],range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis2:{title:'y',range:[-1,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',anchor:'x2'},margin:{t:30,r:30,b:50,l:50},annotations:[{xref:'x1',yref:'y1',x:0,y:7.2,text:'<b>one-to-one ✓</b>',showarrow:false,font:{color:'#10b981',size:13}},{xref:'x2',yref:'y2',x:0,y:7.2,text:'<b>not one-to-one ✗</b>',showarrow:false,font:{color:'#ef4444',size:13}}],showlegend:false};
Plotly.newPlot('plot-l44-htest-en',[cubeT,hLineCubeA,hLineCubeB,crossCube,sqT,hLineSq,crossSq],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Vertical vs. horizontal line test.</strong> Do not mix the two. The <em>vertical</em> line test (from earlier lessons) checks whether a graph defines a function at all — each $x$ must have one $y$. The <em>horizontal</em> line test checks whether a function is one-to-one — each $y$ must come from one $x$. A function passes vertical; one-to-one functions pass both.</div>

<h2 class="lesson-title">3. The Formal Definition of an Inverse Function</h2>

<div class="calc-highlight"><strong>If $f$ is one-to-one, then its inverse $f^{-1}$ is the function that satisfies the round-trip identity for every $x$.</strong> Formally, $f^{-1}$ is defined on the <em>range</em> of $f$, and for every $y$ in that range, $f^{-1}(y)$ is the unique $x$ that $f$ maps to $y$.</div>

<div class="calc-formula"><div class="formula-label">INVERSE FUNCTION — FORMAL DEFINITION</div><div class="formula-main">$$f^{-1}(y) = x \\iff f(x) = y$$</div><div class="formula-sub">The inverse sends $y$ to the unique $x$ that $f$ sends to $y$. The domain of $f^{-1}$ is the range of $f$; the range of $f^{-1}$ is the domain of $f$.</div></div>

<p class="l-text"><strong>Domain and range swap.</strong> A subtle but important consequence: the input of $f^{-1}$ is the output of $f$. So the domain of $f^{-1}$ is the range of $f$, and the range of $f^{-1}$ is the domain of $f$. This swap is automatic and you should always double-check it when you compute an inverse.</p>

<div class="calc-formula"><div class="formula-label">DOMAIN-RANGE SWAP</div><div class="formula-main">$$\\text{dom}(f^{-1}) = \\text{ran}(f), \\qquad \\text{ran}(f^{-1}) = \\text{dom}(f)$$</div></div>

<p class="l-text"><strong>Composition law as identity.</strong> Another way to phrase the inverse is using the identity function $I(x) = x$. If $f$ and $g$ are inverses, then $f \\circ g = I$ and $g \\circ f = I$. The composition of a function with its inverse is "do nothing to the input" — exactly the round-trip property from section 1.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Show that $f(x) = 2x + 3$ and $g(x) = (x-3)/2$ are inverses of each other.<br><br>Compute $f(g(x))$:<br>$f(g(x)) = 2 \\cdot \\dfrac{x-3}{2} + 3 = (x - 3) + 3 = x$. ✓<br><br>Compute $g(f(x))$:<br>$g(f(x)) = \\dfrac{(2x+3) - 3}{2} = \\dfrac{2x}{2} = x$. ✓<br><br>Both compositions give the identity, so $g = f^{-1}$.</div></div>

<h2 class="lesson-title">4. Finding the Inverse: The Five-Step Recipe</h2>

<div class="calc-highlight"><strong>The recipe for computing an inverse algebraically is short and mechanical.</strong> Follow these five steps in order and the answer falls out. The recipe works on any one-to-one function you can solve algebraically.</div>

<div style="background:rgba(16,185,129,0.08);border-left:3px solid #10b981;padding:1rem 1.2rem;margin:1.2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#10b981;margin-bottom:0.6rem">THE FIVE STEPS</div>
<ol style="margin:0;padding-left:1.4rem;line-height:1.7;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><strong>Write $y = f(x)$.</strong> Replace the function name with a single variable on the left.</li>
<li><strong>Solve for $x$ in terms of $y$.</strong> Use algebra — addition, subtraction, multiplication, division, roots — to isolate $x$.</li>
<li><strong>Swap $x$ and $y$.</strong> Now the equation expresses the inverse: the new $y$ is the inverse evaluated at the new $x$.</li>
<li><strong>Declare $f^{-1}(x) = $ (the new right side).</strong> Rename $y$ back to $f^{-1}(x)$.</li>
<li><strong>Verify by composition.</strong> Compute $f(f^{-1}(x))$ and confirm it simplifies to $x$. This catches algebra slips.</li>
</ol>
</div>

<p class="l-text">Steps 1 and 3 together encode the conceptual swap: the input of $f^{-1}$ is what was the output of $f$, and vice versa. Step 2 does the actual work — solving an equation. Step 5 is your insurance policy: if the round-trip fails, an algebra mistake crept in at step 2.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — RECIPE IN ACTION</div><div class="example-body">Find the inverse of $f(x) = 5x - 8$.<br><br><strong>Step 1.</strong> Write $y = 5x - 8$.<br><strong>Step 2.</strong> Solve for $x$. Add 8: $y + 8 = 5x$. Divide by 5: $x = (y + 8)/5$.<br><strong>Step 3.</strong> Swap $x$ and $y$: $y = (x + 8)/5$.<br><strong>Step 4.</strong> Declare: $f^{-1}(x) = \\dfrac{x + 8}{5}$.<br><strong>Step 5.</strong> Verify: $f(f^{-1}(x)) = 5 \\cdot \\dfrac{x+8}{5} - 8 = (x + 8) - 8 = x$. ✓</div></div>

<div class="l-note"><strong>Why do we swap in step 3?</strong> Because traditionally we write functions with $x$ as input and $y$ as output. After solving for $x$, you have an expression where the <em>input</em> letter is $y$. Swapping renames the input back to $x$, giving the inverse in the familiar form $y = f^{-1}(x)$. The swap is a cosmetic relabelling — the function would be the same without it, but the standard convention is to display the input variable as $x$.</div>

<h2 class="lesson-title">5. Four Worked Examples</h2>

<p class="l-text">Four functions, four inverses. Each one shows a different algebraic skill — linear inversion, cubic inversion, rational inversion, and root inversion. Work through them yourself with paper and pen before reading the solutions.</p>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — LINEAR FUNCTION</div><div class="example-body"><strong>Find the inverse of $f(x) = 3x + 2$.</strong><br><br>Step 1: $y = 3x + 2$.<br>Step 2: $y - 2 = 3x \\implies x = (y - 2)/3$.<br>Step 3: Swap: $y = (x - 2)/3$.<br>Step 4: $f^{-1}(x) = \\dfrac{x - 2}{3}$.<br>Step 5 (verify): $f(f^{-1}(x)) = 3 \\cdot \\dfrac{x - 2}{3} + 2 = (x - 2) + 2 = x$. ✓<br><br>Domain of $f^{-1}$: all reals (same as range of $f$). Both functions are linear and one-to-one everywhere.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — CUBIC FUNCTION</div><div class="example-body"><strong>Find the inverse of $f(x) = x^3 - 1$.</strong><br><br>Step 1: $y = x^3 - 1$.<br>Step 2: $y + 1 = x^3 \\implies x = \\sqrt[3]{y + 1}$. (Cube root is defined for every real, so no domain issue.)<br>Step 3: Swap: $y = \\sqrt[3]{x + 1}$.<br>Step 4: $f^{-1}(x) = \\sqrt[3]{x + 1}$.<br>Step 5: $f(f^{-1}(x)) = (\\sqrt[3]{x + 1})^3 - 1 = (x + 1) - 1 = x$. ✓<br><br>The cubic $x^3$ is strictly increasing, so it passes the horizontal line test on all of $\\mathbb{R}$. Inverse exists everywhere.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — RATIONAL FUNCTION</div><div class="example-body"><strong>Find the inverse of $f(x) = \\dfrac{2x + 1}{x - 3}$ (defined for $x \\neq 3$).</strong><br><br>Step 1: $y = \\dfrac{2x + 1}{x - 3}$.<br>Step 2: Clear the fraction: $y(x - 3) = 2x + 1 \\implies xy - 3y = 2x + 1$.<br>Gather $x$ on one side: $xy - 2x = 3y + 1 \\implies x(y - 2) = 3y + 1$.<br>Solve: $x = \\dfrac{3y + 1}{y - 2}$ (requires $y \\neq 2$).<br>Step 3: Swap: $y = \\dfrac{3x + 1}{x - 2}$.<br>Step 4: $f^{-1}(x) = \\dfrac{3x + 1}{x - 2}$ (defined for $x \\neq 2$).<br><br>Notice the value 2 is excluded from $\\text{dom}(f^{-1})$ — that is because 2 is the value $f$ <em>never reaches</em> (the horizontal asymptote). Domain-range swap in action.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 — SQUARE ROOT FUNCTION</div><div class="example-body"><strong>Find the inverse of $f(x) = \\sqrt{x - 4}$ (defined for $x \\geq 4$, with range $y \\geq 0$).</strong><br><br>Step 1: $y = \\sqrt{x - 4}$.<br>Step 2: Square both sides: $y^2 = x - 4 \\implies x = y^2 + 4$.<br>Step 3: Swap: $y = x^2 + 4$.<br>Step 4: $f^{-1}(x) = x^2 + 4$ — but with restricted domain $x \\geq 0$ (because the range of $f$ was $y \\geq 0$).<br>Step 5: $f(f^{-1}(x)) = \\sqrt{(x^2 + 4) - 4} = \\sqrt{x^2} = |x| = x$ for $x \\geq 0$. ✓<br><br>Without the domain restriction, $g(x) = x^2 + 4$ on all reals is <em>not</em> one-to-one, so it would not be the inverse. The restriction $x \\geq 0$ is essential.</div></div>

<h2 class="lesson-title">6. The Graph: Reflection Across $y = x$</h2>

<div class="calc-highlight"><strong>The graphs of $f$ and $f^{-1}$ are mirror images of each other across the line $y = x$.</strong> If $(a, b)$ is on the graph of $f$, then $(b, a)$ is on the graph of $f^{-1}$. Swapping the two coordinates is exactly what reflection across the 45-degree line $y = x$ does geometrically.</div>

<p class="l-text">The reason is direct. The graph of $f$ is the set of pairs $\\{(x, f(x))\\}$. The graph of $f^{-1}$ is the set of pairs $\\{(y, f^{-1}(y))\\}$. But $f^{-1}(y)$ is exactly the $x$ that $f$ sends to $y$, so the pair $(y, x)$ is on $f^{-1}$ precisely when $(x, y)$ is on $f$. Swapping the entries of every pair on the graph of $f$ produces the graph of $f^{-1}$ — and "swap the entries" is the algebraic description of reflection across $y = x$.</p>

<div class="calc-formula"><div class="formula-label">REFLECTION PRINCIPLE</div><div class="formula-main">$$(a, b) \\in \\text{graph}(f) \\iff (b, a) \\in \\text{graph}(f^{-1})$$</div><div class="formula-sub">Reflection across $y = x$ swaps the x- and y-coordinates of every point. This relates the two graphs perfectly.</div></div>

<div class="calc-graph"><div id="plot-l44-reflect-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three function-inverse pairs and the mirror line $y = x$ (white dashed). For each pair, the inverse is the reflection of the original across the line. <br>• Linear: $f(x) = 2x - 1$ (blue) and $f^{-1}(x) = (x + 1)/2$ (light blue).<br>• Cubic: $f(x) = x^3$ (green) and $f^{-1}(x) = \\sqrt[3]{x}$ (light green).<br>• Exponential vs. log: $f(x) = e^x$ (orange) and $f^{-1}(x) = \\ln x$ (light orange).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-30;i<=30;i++){xs.push(i/10);}
var linF=xs.map(function(x){return 2*x-1;});
var linInvX=[];var linInvY=[];for(var i=0;i<xs.length;i++){var y=2*xs[i]-1;linInvX.push(y);linInvY.push(xs[i]);}
var cubF=xs.map(function(x){return x*x*x;});
var cubInv=xs.map(function(x){return Math.cbrt(x);});
var expXs=[];var expYs=[];var lnXs=[];var lnYs=[];
for(var i=-30;i<=30;i++){var x=i/10;if(x>-3&&x<3){expXs.push(x);expYs.push(Math.exp(x));}}
for(var i=1;i<=300;i++){var x=i/30;if(x<=10){lnXs.push(x);lnYs.push(Math.log(x));}}
var yx={x:[-4,4],y:[-4,4],mode:'lines',name:'y = x (mirror)',line:{color:'rgba(255,255,255,0.45)',width:1.5,dash:'dash'}};
var fLin={x:xs,y:linF,mode:'lines',name:'f(x)=2x−1',line:{color:'#3b82f6',width:2.5}};
var fLinI={x:linInvX,y:linInvY,mode:'lines',name:'f⁻¹(x)=(x+1)/2',line:{color:'#93c5fd',width:2.5,dash:'dot'}};
var fCub={x:xs,y:cubF,mode:'lines',name:'f(x)=x³',line:{color:'#10b981',width:2.5}};
var fCubI={x:xs,y:cubInv,mode:'lines',name:'f⁻¹(x)=∛x',line:{color:'#6ee7b7',width:2.5,dash:'dot'}};
var fExp={x:expXs,y:expYs,mode:'lines',name:'f(x)=eˣ',line:{color:'#f59e0b',width:2.5}};
var fLn={x:lnXs,y:lnYs,mode:'lines',name:'f⁻¹(x)=ln x',line:{color:'#fcd34d',width:2.5,dash:'dot'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l44-reflect-en',[yx,fLin,fLinI,fCub,fCubI,fExp,fLn],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If the point $(3, 17)$ lies on the graph of $f$, what point must lie on the graph of $f^{-1}$? Answer: $(17, 3)$. Swap the coordinates. This works for every point on the graph without exception.</div></div>

<div class="l-note"><strong>Self-inverse functions.</strong> A few special functions are their own inverse — meaning their graph is symmetric about the line $y = x$. Examples: $f(x) = x$ (the identity), $f(x) = -x$ (negation), $f(x) = 1/x$ (the reciprocal on $x \\neq 0$), and any function of the form $f(x) = a - x$ for a constant $a$. Reflecting these across $y = x$ returns the same graph.</div>

<h2 class="lesson-title">7. Restricting the Domain to Get an Inverse</h2>

<div class="calc-highlight"><strong>When a function is not one-to-one on its full domain, we can often <em>restrict</em> the domain to a subset on which it <em>is</em> one-to-one, and then the inverse exists on that restricted piece.</strong> This is the standard trick for inverting parabolas, absolute values, sines, cosines, and many other familiar functions.</div>

<p class="l-text">The classic case is $f(x) = x^2$. On the full real line, it fails the horizontal line test (any positive output comes from two inputs). But restricted to $x \\geq 0$ (the right half of the parabola), it is strictly increasing — every output comes from exactly one input — and the inverse is the principal square root: $f^{-1}(x) = \\sqrt{x}$ on $x \\geq 0$.</p>

<div class="calc-formula"><div class="formula-label">RESTRICTED SQUARE</div><div class="formula-main">$$f: [0, \\infty) \\to [0, \\infty), \\quad f(x) = x^2 \\quad\\Longrightarrow\\quad f^{-1}(x) = \\sqrt{x}$$</div><div class="formula-sub">By restricting the domain to $x \\geq 0$, the parabola becomes one-to-one and an inverse exists.</div></div>

<p class="l-text">You could equally well restrict to $x \\leq 0$ (the left half). Then the inverse would be $f^{-1}(x) = -\\sqrt{x}$ on $x \\geq 0$. Either restriction works; the convention is to pick the positive branch because it matches the principal square root.</p>

<div class="calc-graph"><div id="plot-l44-restrict-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the parabola $y = x^2$ in faint grey (full domain — not one-to-one) and the restricted right half $y = x^2$ for $x \\geq 0$ in green. Its inverse, the principal square root $y = \\sqrt{x}$ in orange, is the reflection of the green branch across the dashed line $y = x$. Together the green and orange curves are mirror images, exactly as section 6 predicts.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xsAll=[];var sqAll=[];for(var i=-25;i<=25;i++){var x=i/10;xsAll.push(x);sqAll.push(x*x);}
var xsR=[];var sqR=[];for(var i=0;i<=25;i++){var x=i/10;xsR.push(x);sqR.push(x*x);}
var sqRoot={x:sqR.slice(),y:xsR.slice()};
var fullPara={x:xsAll,y:sqAll,mode:'lines',name:'y=x² (full, not 1-1)',line:{color:'rgba(255,255,255,0.25)',width:2,dash:'dot'}};
var rightPara={x:xsR,y:sqR,mode:'lines',name:'y=x² for x≥0 (1-1)',line:{color:'#10b981',width:3}};
var rootCurve={x:sqRoot.x,y:sqRoot.y,mode:'lines',name:'y=√x (inverse)',line:{color:'#f59e0b',width:3}};
var yxLine={x:[-3,7],y:[-3,7],mode:'lines',name:'y=x (mirror)',line:{color:'rgba(255,255,255,0.4)',width:1.3,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l44-restrict-en',[fullPara,rightPara,rootCurve,yxLine],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>The same trick applied to $\\sin x$.</strong> Sine oscillates between &minus;1 and 1 forever, so on the whole real line every output between &minus;1 and 1 comes from infinitely many inputs. To define $\\arcsin$, mathematicians restrict $\\sin$ to the interval $[-\\pi/2, \\pi/2]$ — the right half of one wave — on which it is strictly increasing. The inverse $\\arcsin: [-1, 1] \\to [-\\pi/2, \\pi/2]$ exists on this restricted domain. We will study this in detail when we meet inverse trig functions.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — RESTRICTED PARABOLA</div><div class="example-body">Let $f(x) = (x - 2)^2$, restricted to $x \\geq 2$. Find $f^{-1}$.<br><br>On $x \\geq 2$, $f$ is increasing (the parabola opens up, vertex at $x = 2$, only the right branch). Range of $f$ on this restriction: $y \\geq 0$.<br><br>Step 1: $y = (x - 2)^2$.<br>Step 2: Take the positive square root (because $x - 2 \\geq 0$ on the restricted domain): $\\sqrt{y} = x - 2 \\implies x = \\sqrt{y} + 2$.<br>Step 3: Swap: $y = \\sqrt{x} + 2$.<br>Step 4: $f^{-1}(x) = \\sqrt{x} + 2$ on $x \\geq 0$.<br>Step 5: $f(f^{-1}(x)) = (\\sqrt{x} + 2 - 2)^2 = (\\sqrt{x})^2 = x$ for $x \\geq 0$. ✓</div></div>

<h2 class="lesson-title">8. Standard Inverse Pairs You Must Know</h2>

<div class="calc-highlight"><strong>A few inverse pairs come up so often that you should recognise them on sight.</strong> They are the toolkit for solving every equation in the rest of high-school mathematics. Memorise the table; the rest of the year leans on it.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Function $f(x)$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Inverse $f^{-1}(x)$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Domain of $f^{-1}$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Use</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x + a$</td><td style="padding:0.5rem 0.8rem">$x - a$</td><td style="padding:0.5rem 0.8rem">$\\mathbb{R}$</td><td style="padding:0.5rem 0.8rem">solve $x + a = b$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$ax$ (with $a \\neq 0$)</td><td style="padding:0.5rem 0.8rem">$x / a$</td><td style="padding:0.5rem 0.8rem">$\\mathbb{R}$</td><td style="padding:0.5rem 0.8rem">solve $ax = b$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x^2$ on $x \\geq 0$</td><td style="padding:0.5rem 0.8rem">$\\sqrt{x}$</td><td style="padding:0.5rem 0.8rem">$x \\geq 0$</td><td style="padding:0.5rem 0.8rem">solve $x^2 = b$ (positive root)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x^3$</td><td style="padding:0.5rem 0.8rem">$\\sqrt[3]{x}$</td><td style="padding:0.5rem 0.8rem">$\\mathbb{R}$</td><td style="padding:0.5rem 0.8rem">solve $x^3 = b$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$e^x$</td><td style="padding:0.5rem 0.8rem">$\\ln x$</td><td style="padding:0.5rem 0.8rem">$x &gt; 0$</td><td style="padding:0.5rem 0.8rem">solve exponential equations</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$a^x$ (with $a &gt; 0$, $a \\neq 1$)</td><td style="padding:0.5rem 0.8rem">$\\log_a x$</td><td style="padding:0.5rem 0.8rem">$x &gt; 0$</td><td style="padding:0.5rem 0.8rem">solve $a^x = b$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\sin x$ on $[-\\pi/2, \\pi/2]$</td><td style="padding:0.5rem 0.8rem">$\\arcsin x$</td><td style="padding:0.5rem 0.8rem">$[-1, 1]$</td><td style="padding:0.5rem 0.8rem">solve $\\sin x = b$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\cos x$ on $[0, \\pi]$</td><td style="padding:0.5rem 0.8rem">$\\arccos x$</td><td style="padding:0.5rem 0.8rem">$[-1, 1]$</td><td style="padding:0.5rem 0.8rem">solve $\\cos x = b$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$\\tan x$ on $(-\\pi/2, \\pi/2)$</td><td style="padding:0.5rem 0.8rem">$\\arctan x$</td><td style="padding:0.5rem 0.8rem">$\\mathbb{R}$</td><td style="padding:0.5rem 0.8rem">solve $\\tan x = b$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>The deepest pair: $e^x$ and $\\ln x$.</strong> The exponential function $e^x$ takes any real input and produces a strictly positive output. Its inverse, the natural logarithm $\\ln x$, takes any positive input and produces any real output. The two share the round-trip identity $\\ln(e^x) = x$ and $e^{\\ln x} = x$. Logarithms exist precisely <em>because</em> we want to invert exponentials — that is the entire reason logarithms were invented (by John Napier in the early 1600s).</p>

<div class="l-note"><strong>One more useful family: linear-rational inverse pairs.</strong> Functions of the form $f(x) = (ax + b)/(cx + d)$ with $ad - bc \\neq 0$ are called Mobius transformations. Their inverses are also linear-rational, given by $f^{-1}(x) = (dx - b)/(-cx + a)$. You will not need this formula for high school, but you saw the pattern in Example 3 of section 5.</div>

<h2 class="lesson-title">9. Practice Problems</h2>

<p class="l-text">Eight problems pulling together all the techniques in this lesson. Try each one yourself first — really put pencil to paper — before reading the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — IS IT ONE-TO-ONE?</div><div class="example-body"><strong>Decide whether $f(x) = 4x - 9$ is one-to-one. If yes, find $f^{-1}$.</strong><br><br>$f$ is a straight line of slope 4. A non-zero slope means strictly monotonic, so $f$ passes the horizontal line test — it is one-to-one.<br><br>Five-step recipe: $y = 4x - 9 \\implies y + 9 = 4x \\implies x = (y + 9)/4$. Swap: $y = (x + 9)/4$. Hence $\\mathbf{f^{-1}(x) = \\dfrac{x + 9}{4}}$.<br><br>Verify: $f(f^{-1}(x)) = 4 \\cdot (x+9)/4 - 9 = (x + 9) - 9 = x$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — CUBIC INVERSE</div><div class="example-body"><strong>Find the inverse of $f(x) = (x - 1)^3 + 2$.</strong><br><br>Step 1: $y = (x - 1)^3 + 2$.<br>Step 2: $y - 2 = (x - 1)^3 \\implies x - 1 = \\sqrt[3]{y - 2} \\implies x = \\sqrt[3]{y - 2} + 1$.<br>Step 3: Swap: $y = \\sqrt[3]{x - 2} + 1$.<br>Step 4: $\\mathbf{f^{-1}(x) = \\sqrt[3]{x - 2} + 1}$.<br>Step 5: $f(f^{-1}(x)) = (\\sqrt[3]{x - 2} + 1 - 1)^3 + 2 = (x - 2) + 2 = x$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — RATIONAL INVERSE</div><div class="example-body"><strong>Find the inverse of $f(x) = \\dfrac{x + 5}{x - 1}$ (defined for $x \\neq 1$).</strong><br><br>$y = \\dfrac{x + 5}{x - 1} \\implies y(x - 1) = x + 5 \\implies xy - y = x + 5$.<br>Gather $x$: $xy - x = y + 5 \\implies x(y - 1) = y + 5 \\implies x = \\dfrac{y + 5}{y - 1}$ (need $y \\neq 1$).<br>Swap: $\\mathbf{f^{-1}(x) = \\dfrac{x + 5}{x - 1}}$ on $x \\neq 1$.<br><br>Notice this function is its own inverse — it is a self-inverse Mobius transformation.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — SQUARE ROOT INVERSE</div><div class="example-body"><strong>Find the inverse of $f(x) = \\sqrt{2x - 6}$ (defined for $x \\geq 3$).</strong><br><br>Step 1: $y = \\sqrt{2x - 6}$, with $y \\geq 0$.<br>Step 2: Square: $y^2 = 2x - 6 \\implies x = (y^2 + 6)/2$.<br>Step 3: Swap: $y = (x^2 + 6)/2$.<br>Step 4: $\\mathbf{f^{-1}(x) = \\dfrac{x^2 + 6}{2}}$ on $x \\geq 0$.<br>Step 5: $f(f^{-1}(x)) = \\sqrt{2 \\cdot (x^2 + 6)/2 - 6} = \\sqrt{x^2 + 6 - 6} = \\sqrt{x^2} = x$ for $x \\geq 0$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — POINT ON INVERSE GRAPH</div><div class="example-body"><strong>The graph of $f$ passes through the points $(0, 3)$, $(2, 7)$, and $(5, -1)$. List three points on the graph of $f^{-1}$.</strong><br><br>Swap each coordinate pair (section 6): the inverse graph passes through $\\mathbf{(3, 0)}$, $\\mathbf{(7, 2)}$, and $\\mathbf{(-1, 5)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — RESTRICTED PARABOLA</div><div class="example-body"><strong>The function $f(x) = x^2 + 4x + 5$ is not one-to-one on $\\mathbb{R}$. Restrict its domain to make it one-to-one, then find $f^{-1}$.</strong><br><br>Complete the square: $f(x) = (x + 2)^2 + 1$. Vertex at $x = -2$. Restrict to $x \\geq -2$ (the right branch).<br><br>Step 1: $y = (x + 2)^2 + 1 \\implies y - 1 = (x + 2)^2$.<br>Step 2: Since $x + 2 \\geq 0$, take the positive root: $\\sqrt{y - 1} = x + 2 \\implies x = \\sqrt{y - 1} - 2$.<br>Step 3: Swap: $y = \\sqrt{x - 1} - 2$.<br>Step 4: $\\mathbf{f^{-1}(x) = \\sqrt{x - 1} - 2}$ on $x \\geq 1$ (since range of $f$ on the restricted domain is $y \\geq 1$).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — VERIFY INVERSE BY COMPOSITION</div><div class="example-body"><strong>Are $f(x) = (x + 3)/2$ and $g(x) = 2x - 3$ inverses of each other?</strong><br><br>Compute $f(g(x))$: $f(2x - 3) = ((2x - 3) + 3)/2 = 2x/2 = x$. ✓<br>Compute $g(f(x))$: $g((x + 3)/2) = 2 \\cdot (x + 3)/2 - 3 = (x + 3) - 3 = x$. ✓<br><br>Both round trips return $x$. Yes, they are inverses.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — DOMAIN AND RANGE OF AN INVERSE</div><div class="example-body"><strong>The function $f: [1, 5] \\to [2, 14]$ is defined by $f(x) = 3x - 1$. What is the domain and range of $f^{-1}$?</strong><br><br>By the domain-range swap (section 3):<br>$\\text{dom}(f^{-1}) = \\text{ran}(f) = [2, 14]$.<br>$\\text{ran}(f^{-1}) = \\text{dom}(f) = [1, 5]$.<br><br>And the formula: $y = 3x - 1 \\implies x = (y + 1)/3$, so $f^{-1}(x) = (x + 1)/3$. Check the endpoints: $f^{-1}(2) = 1$ ✓ and $f^{-1}(14) = 5$ ✓.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> In the next lesson we will use inverses to solve exponential and logarithmic equations — the most important application of this topic. Pay particular attention to the standard pair $e^x \\leftrightarrow \\ln x$: every exponential equation in calculus is solved by applying $\\ln$ to both sides, and every logarithmic equation is solved by exponentiating.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>An inverse function $f^{-1}$ reverses the input-output direction of $f$: $f^{-1}(f(x)) = x$ and $f(f^{-1}(x)) = x$</li>
<li>An inverse exists only when $f$ is one-to-one — every output comes from exactly one input</li>
<li>Horizontal line test: $f$ is one-to-one iff every horizontal line crosses the graph in at most one point</li>
<li>Five-step recipe: write $y = f(x)$, solve for $x$, swap $x$ and $y$, declare $f^{-1}$, verify by composition</li>
<li>Graphs of $f$ and $f^{-1}$ are mirror images across the line $y = x$ — swap each coordinate pair</li>
<li>If $f$ is not one-to-one on its full domain, restrict the domain to a piece where it is, then invert on that piece</li>
<li>Key standard pairs: $x^2 \\leftrightarrow \\sqrt{x}$ (on $x \\geq 0$), $x^3 \\leftrightarrow \\sqrt[3]{x}$, $e^x \\leftrightarrow \\ln x$, $\\sin \\leftrightarrow \\arcsin$ on $[-\\pi/2, \\pi/2]$</li>
<li>The notation $f^{-1}$ never means $1/f$ — that is the reciprocal, a different function entirely</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Ters fonksiyon, başka bir fonksiyonu geri alan fonksiyondur.</strong> Eğer $f$, 3'ü 10'a gönderiyorsa, $f^{-1}$ de 10'u tekrar 3'e geri gönderir. Olay bundan ibaret. 7 ekle ve 7 çıkar. 4 ile çarp ve 4'e böl. Küp al ve küp kökü al. Şu ana kadar öğrendiğin her temel işlemin bir tersi vardır ve her işlemi tersiyle eşleştirmek, denklem çözmeyi mümkün kılan defter tutmadır.</p>

<p class="l-text">Bu dersin sonunda, verilen bir fonksiyonun tersinin olup olmadığına karar verebileceksin (bire-bir testi), beş adımlı temiz bir tarifle tersi cebirsel olarak inşa edebileceksin, ters fonksiyonun grafiğini orijinal grafiğin $y = x$ doğrusu boyunca yansıması olarak çizebileceksin ve bire-bir olmayan bir fonksiyonun tanım kümesini ters bulunabilecek şekilde kısıtlayabileceksin. Bu beceriler logaritmanın (üstel fonksiyonun tersi), ters trigonometrik fonksiyonların ve lise matematiğinin geri kalanındaki tüm denklem çözme tekniklerinin temelidir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Ters fonksiyonun anlamını, $f$'nin girdi-çıktı yönünü tersine çeviren işlem olarak ifade etmeyi</li>
<li>Bir fonksiyonun grafiği üzerinde <em>yatay doğru testi</em> ile bire-bir olup olmadığını belirlemeyi</li>
<li>$f^{-1}$'i $f$'den beş adımlı tarifle kurmayı (yaz $y=f(x)$, $x$ için çöz, $x$ ve $y$'yi değiştir, $f^{-1}$'i tanımla, bileşke ile doğrula)</li>
<li>$f$ ile $f^{-1}$ grafiklerinin $y = x$ doğrusu boyunca birbirinin yansıması olduğunu görmeyi</li>
<li>Bire-bir olmayan bir fonksiyonun (örneğin $y = x^2$) tanım kümesini kısıtlayarak tersinin tanımlanmasını sağlamayı</li>
<li>Standart ters çiftlerini tanımayı: üstel ve logaritma, sinüs ve arcsin, küp ve küp kök</li>
</ul>
</div>

<h2 class="lesson-title">1. Sezgi: Girdi ve Çıktıyı Tersine Çevirmek</h2>

<div class="calc-highlight"><strong>Bir fonksiyonu makine olarak hayal et.</strong> İçine bir $x$ sayısı atarsın, makine onu işler ve dışarı $f(x)$ çıkar. <em>Ters</em> makine, o çıktıyı $f(x)$'i kendi girdisi olarak alır ve orijinal $x$'i geri verir. İki makineyi peş peşe çalıştırmak sayıyı değiştirmez. Bu gidiş-dönüş özelliği, ters fonksiyonun tanımının tamamıdır.</div>

<p class="l-text">Somut bir örnek. $f(x) = x + 7$ olsun — "yedi ekle" makinesi. 3 at, 10 çıkar. Bunu hangi makine tersine çevirir? "Yedi çıkar" makinesi. 10'u "yedi çıkar" makinesine at, tekrar 3 çıkar. Yani "yedi ekle"nin tersi "yedi çıkar"dır. Bunu $f^{-1}(x) = x - 7$ olarak yazarız.</p>

<div class="calc-formula"><div class="formula-label">GİDİŞ-DÖNÜŞ ÖZDEŞLİĞİ</div><div class="formula-main">$$f^{-1}(f(x)) \\;=\\; x \\qquad \\text{ve} \\qquad f(f^{-1}(x)) \\;=\\; x$$</div><div class="formula-sub">Önce $f$, sonra $f^{-1}$ (ya da tersi) uygulamak orijinal sayıyı geri verir. Bu, ters fonksiyonun işlemsel tanımıdır.</div></div>

<p class="l-text"><strong>Sembol uyarısı.</strong> $f^{-1}$ gösterimi $1/f$ <em>anlamına gelmez</em>. "$f$'yi geri alan fonksiyon" demektir. Buradaki &minus;1 üst indisi, tıpkı $\\sin^{-1}$ ya da $\\log$ gibi fonksiyonel bir gösterimdir. Çarpmaya göre tersi olan $1/f(x)$ tamamen farklı bir nesnedir. İkisini karıştırmak bu konunun en sık yapılan hatasıdır — dikkatli ol.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Topla &harr; Çıkar</div><div class="card-body">$f(x) = x + 5$ ve $f^{-1}(x) = x - 5$. 5 ekleyip sonra 5 çıkarmak girdiyi geri verir.</div></div>
<div class="calc-card"><div class="card-title">Çarp &harr; Böl</div><div class="card-body">$f(x) = 4x$ ve $f^{-1}(x) = x/4$. Dörtle çarpıp sonra dörde bölmek girdiyi geri verir.</div></div>
<div class="calc-card"><div class="card-title">Küp &harr; Küp kök</div><div class="card-body">$f(x) = x^3$ ve $f^{-1}(x) = \\sqrt[3]{x}$. Küp alıp sonra küp kökünü almak girdiyi geri verir.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$f(x) = 3x - 6$'nın tersi nedir? Sözel olarak: üçle çarp, sonra 6 çıkar. Geri almak için sırayı ve her işlemi tersine çevir: önce <em>6 ekle</em>, sonra <em>3'e böl</em>. Yani $f^{-1}(x) = (x + 6)/3$. $x = 4$ ile doğrula: $f(4) = 6$ ve $f^{-1}(6) = (6+6)/3 = 4$. Gidiş-dönüş başarılı.</div></div>

<h2 class="lesson-title">2. Bire-bir Fonksiyonlar ve Yatay Doğru Testi</h2>

<div class="calc-highlight"><strong>Her fonksiyonun tersi yoktur.</strong> Tersin var olabilmesi için orijinal fonksiyonun <em>bire-bir</em> olması gerekir: her çıktı tam olarak bir girdiden gelmelidir. İki farklı girdi aynı çıktıyı üretirse, ters makine hangi girdiyi döndüreceğini bilemez — eşleştirme belirsizdir ve ters fonksiyon yoktur.</div>

<p class="l-text">Bir $f$ fonksiyonu, $f(a) = f(b)$ olduğunda mutlaka $a = b$ oluyorsa <strong>bire-bir</strong> (bazen <em>injektif</em>) denir. Eşdeğer ifadeyle, farklı girdiler her zaman farklı çıktılar üretir. $f(x) = x + 7$ bire-birdir: her çıktı tek bir girdiden gelir. $g(x) = x^2$ tüm reel sayılarda bire-bir <em>değildir</em>: $g(2) = 4$ ve $g(-2) = 4$, yani 4 çıktısı iki farklı girdiden (2 ve &minus;2) gelir.</p>

<div class="calc-formula"><div class="formula-label">BİRE-BİR &mdash; RESMİ TANIM</div><div class="formula-main">$$f \\text{ bire-birdir} \\iff \\bigl(\\, f(a) = f(b) \\implies a = b \\,\\bigr)$$</div><div class="formula-sub">Eşdeğer karşıt: $a \\neq b$ ise $f(a) \\neq f(b)$. Farklı girdiler farklı çıktılara gider.</div></div>

<p class="l-text"><strong>Yatay doğru testi.</strong> Bire-birliğin grafiksel hali güzel bir resimdir. $f$'nin grafiğini al ve üzerinde bir yatay doğruyu yukarı-aşağı kaydır. Her yükseklikte yatay doğru grafiği <em>en fazla bir noktada</em> kesiyorsa $f$ bire-birdir. Bazı yüksekliklerde doğru grafiği iki ya da daha fazla noktada kesiyorsa $f$ bire-bir değildir — bu kesişimlerin yükseklikleri birden fazla x-değeri tarafından üretilen y-değerleridir, tam olarak elemek istediğimiz belirsizlik.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">YATAY TESTİ GEÇER</div><div class="compare-item">$f(x) = x + 7$ (eğimi 1 olan doğru)</div><div class="compare-item">$f(x) = x^3$ (kübik — her zaman artan)</div><div class="compare-item">$f(x) = e^x$ (üstel)</div><div class="compare-item">$x &gt; 0$ üzerinde $f(x) = 1/x$</div><div class="compare-item">Tüm tanım kümesinde ters mevcuttur</div></div><div class="compare-col"><div class="compare-title">YATAY TESTİ GEÇEMEZ</div><div class="compare-item">$\\mathbb{R}$ üzerinde $f(x) = x^2$ (parabol)</div><div class="compare-item">$f(x) = |x|$ (V şekli)</div><div class="compare-item">$f(x) = \\sin x$ (sonsuza dek salınır)</div><div class="compare-item">Tam periyodunda herhangi bir periyodik fonksiyon</div><div class="compare-item">Tersi tanım kısıtlaması gerektirir — bkz. bölüm 7</div></div></div>

<div class="calc-graph"><div id="plot-l44-htest-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> iki fonksiyon yan yana. Solda $f(x) = x^3$ — her yatay doğru (kesikli) eğriyi tam bir kez keser, yani fonksiyon bire-birdir. Sağda $g(x) = x^2$ — $y = 4$ yatay doğrusu parabolü iki noktada keser ($x = -2$ ve $x = 2$), yani fonksiyon bire-bir <em>değildir</em> ve tüm tanım kümesinde tersi yoktur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var cube=[];var sq=[];for(var i=-25;i<=25;i++){var x=i/10;xs.push(x);cube.push(x*x*x);sq.push(x*x);}
var cubeT={x:xs,y:cube,mode:'lines',name:'f(x)=x³',line:{color:'#10b981',width:3},xaxis:'x1',yaxis:'y1'};
var hLineCubeA={x:[-2.5,2.5],y:[3,3],mode:'lines',name:'y=3 doğrusu',line:{color:'rgba(255,255,255,0.35)',width:1.5,dash:'dash'},xaxis:'x1',yaxis:'y1',showlegend:false};
var hLineCubeB={x:[-2.5,2.5],y:[-5,-5],mode:'lines',line:{color:'rgba(255,255,255,0.35)',width:1.5,dash:'dash'},xaxis:'x1',yaxis:'y1',showlegend:false};
var crossCube={x:[Math.cbrt(3),Math.cbrt(-5)],y:[3,-5],mode:'markers',name:'tek kesişim',marker:{color:'#f59e0b',size:11,symbol:'circle'},xaxis:'x1',yaxis:'y1'};
var sqT={x:xs,y:sq,mode:'lines',name:'g(x)=x²',line:{color:'#ef4444',width:3},xaxis:'x2',yaxis:'y2'};
var hLineSq={x:[-2.5,2.5],y:[4,4],mode:'lines',name:'y=4 doğrusu',line:{color:'rgba(255,255,255,0.35)',width:1.5,dash:'dash'},xaxis:'x2',yaxis:'y2',showlegend:false};
var crossSq={x:[-2,2],y:[4,4],mode:'markers',name:'iki kesişim',marker:{color:'#f59e0b',size:11,symbol:'x'},xaxis:'x2',yaxis:'y2'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',domain:[0,0.46],range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-8,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},xaxis2:{title:'x',domain:[0.54,1],range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis2:{title:'y',range:[-1,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',anchor:'x2'},margin:{t:30,r:30,b:50,l:50},annotations:[{xref:'x1',yref:'y1',x:0,y:7.2,text:'<b>bire-bir ✓</b>',showarrow:false,font:{color:'#10b981',size:13}},{xref:'x2',yref:'y2',x:0,y:7.2,text:'<b>bire-bir değil ✗</b>',showarrow:false,font:{color:'#ef4444',size:13}}],showlegend:false};
Plotly.newPlot('plot-l44-htest-tr',[cubeT,hLineCubeA,hLineCubeB,crossCube,sqT,hLineSq,crossSq],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Dikey ve yatay doğru testi.</strong> İkisini karıştırma. <em>Dikey</em> doğru testi (önceki derslerden) bir grafiğin fonksiyon olup olmadığını kontrol eder — her $x$ tek bir $y$'ye karşılık gelmelidir. <em>Yatay</em> doğru testi ise fonksiyonun bire-bir olup olmadığını kontrol eder — her $y$ tek bir $x$'ten gelmelidir. Bir fonksiyon dikeyi geçer; bire-bir fonksiyonlar ikisini de geçer.</div>

<h2 class="lesson-title">3. Ters Fonksiyonun Resmi Tanımı</h2>

<div class="calc-highlight"><strong>$f$ bire-bir ise tersi $f^{-1}$, her $x$ için gidiş-dönüş özdeşliğini sağlayan fonksiyondur.</strong> Resmi olarak $f^{-1}$, $f$'nin <em>görüntü kümesi</em> üzerinde tanımlıdır ve o görüntü kümesindeki her $y$ için $f^{-1}(y)$, $f$'nin $y$'ye gönderdiği tek $x$'tir.</div>

<div class="calc-formula"><div class="formula-label">TERS FONKSİYON &mdash; RESMİ TANIM</div><div class="formula-main">$$f^{-1}(y) = x \\iff f(x) = y$$</div><div class="formula-sub">Ters, $y$'yi $f$'nin $y$'ye gönderdiği tek $x$'e götürür. $f^{-1}$'in tanım kümesi $f$'nin görüntü kümesidir; $f^{-1}$'in görüntü kümesi $f$'nin tanım kümesidir.</div></div>

<p class="l-text"><strong>Tanım ve görüntü kümesi takası.</strong> İncelikli ama önemli bir sonuç: $f^{-1}$'in girdisi $f$'nin çıktısıdır. Yani $f^{-1}$'in tanım kümesi $f$'nin görüntü kümesidir, $f^{-1}$'in görüntü kümesi $f$'nin tanım kümesidir. Bu takas otomatiktir ve bir ters hesapladığında her zaman iki kez kontrol etmelisin.</p>

<div class="calc-formula"><div class="formula-label">TANIM-GÖRÜNTÜ TAKASI</div><div class="formula-main">$$\\text{tan}(f^{-1}) = \\text{gör}(f), \\qquad \\text{gör}(f^{-1}) = \\text{tan}(f)$$</div></div>

<p class="l-text"><strong>Özdeşlik olarak bileşke yasası.</strong> Tersi ifade etmenin bir başka yolu da birim fonksiyon $I(x) = x$'i kullanmaktır. $f$ ile $g$ ters ise $f \\circ g = I$ ve $g \\circ f = I$ olur. Bir fonksiyonun tersiyle bileşkesi "girdiye hiçbir şey yapma" anlamına gelir — tam olarak bölüm 1'deki gidiş-dönüş özelliğidir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$f(x) = 2x + 3$ ile $g(x) = (x-3)/2$ fonksiyonlarının birbirinin tersi olduğunu göster.<br><br>$f(g(x))$'i hesapla:<br>$f(g(x)) = 2 \\cdot \\dfrac{x-3}{2} + 3 = (x - 3) + 3 = x$. ✓<br><br>$g(f(x))$'i hesapla:<br>$g(f(x)) = \\dfrac{(2x+3) - 3}{2} = \\dfrac{2x}{2} = x$. ✓<br><br>İki bileşke de birim fonksiyonu verir, yani $g = f^{-1}$.</div></div>

<h2 class="lesson-title">4. Tersi Bulma: Beş Adımlı Tarif</h2>

<div class="calc-highlight"><strong>Tersi cebirsel olarak hesaplamak için kullanılan tarif kısa ve mekaniktir.</strong> Bu beş adımı sırayla takip et, cevap kendiliğinden çıkar. Tarif, cebirsel olarak çözebileceğin her bire-bir fonksiyonda işe yarar.</div>

<div style="background:rgba(16,185,129,0.08);border-left:3px solid #10b981;padding:1rem 1.2rem;margin:1.2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#10b981;margin-bottom:0.6rem">BEŞ ADIM</div>
<ol style="margin:0;padding-left:1.4rem;line-height:1.7;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><strong>$y = f(x)$ yaz.</strong> Sol tarafa tek bir değişken yaz ve fonksiyon adını değiştir.</li>
<li><strong>$y$ cinsinden $x$ için çöz.</strong> Cebir kullan — toplama, çıkarma, çarpma, bölme, kök — $x$'i yalnız bırak.</li>
<li><strong>$x$ ile $y$'yi değiştir.</strong> Şimdi denklem tersi ifade eder: yeni $y$, yeni $x$'te değerlendirilmiş tersin değeridir.</li>
<li><strong>$f^{-1}(x) = $ (yeni sağ taraf) olarak tanımla.</strong> $y$'yi tekrar $f^{-1}(x)$ olarak adlandır.</li>
<li><strong>Bileşke ile doğrula.</strong> $f(f^{-1}(x))$'i hesapla ve $x$'e sadeleştiğini onayla. Bu cebir hatalarını yakalar.</li>
</ol>
</div>

<p class="l-text">1. ve 3. adımlar birlikte kavramsal takası kodlar: $f^{-1}$'in girdisi $f$'nin çıktısıydı, ve tersi. 2. adım asıl işi yapar — denklem çözmek. 5. adım sigorta poliçendir: gidiş-dönüş başarısız olursa 2. adımda bir cebir hatası girmiştir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; TARİF İŞ BAŞINDA</div><div class="example-body">$f(x) = 5x - 8$'in tersini bul.<br><br><strong>Adım 1.</strong> $y = 5x - 8$ yaz.<br><strong>Adım 2.</strong> $x$ için çöz. 8 ekle: $y + 8 = 5x$. 5'e böl: $x = (y + 8)/5$.<br><strong>Adım 3.</strong> $x$ ile $y$'yi değiştir: $y = (x + 8)/5$.<br><strong>Adım 4.</strong> Tanımla: $f^{-1}(x) = \\dfrac{x + 8}{5}$.<br><strong>Adım 5.</strong> Doğrula: $f(f^{-1}(x)) = 5 \\cdot \\dfrac{x+8}{5} - 8 = (x + 8) - 8 = x$. ✓</div></div>

<div class="l-note"><strong>3. adımda neden değiştiriyoruz?</strong> Çünkü geleneksel olarak fonksiyonları girdi $x$ ve çıktı $y$ olacak şekilde yazarız. $x$ için çözdükten sonra <em>girdi</em> harfinin $y$ olduğu bir ifade elde edersin. Değiştirmek girdiyi tekrar $x$ olarak adlandırır ve tersi tanıdık $y = f^{-1}(x)$ formunda verir. Değiştirme kozmetik bir yeniden adlandırmadır — yapılmasa da fonksiyon aynı olurdu, ama standart sözleşme girdi değişkenini $x$ olarak göstermektir.</div>

<h2 class="lesson-title">5. Dört Çözümlü Örnek</h2>

<p class="l-text">Dört fonksiyon, dört ters. Her biri farklı bir cebirsel beceriyi gösterir — doğrusal ters, kübik ters, rasyonel ters ve köklü ters. Çözümleri okumadan önce kendin kâğıt-kalemle çöz.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 1 &mdash; DOĞRUSAL FONKSİYON</div><div class="example-body"><strong>$f(x) = 3x + 2$'nin tersini bul.</strong><br><br>Adım 1: $y = 3x + 2$.<br>Adım 2: $y - 2 = 3x \\implies x = (y - 2)/3$.<br>Adım 3: Değiştir: $y = (x - 2)/3$.<br>Adım 4: $f^{-1}(x) = \\dfrac{x - 2}{3}$.<br>Adım 5 (doğrula): $f(f^{-1}(x)) = 3 \\cdot \\dfrac{x - 2}{3} + 2 = (x - 2) + 2 = x$. ✓<br><br>$f^{-1}$'in tanım kümesi: tüm reeller ($f$'nin görüntü kümesiyle aynı). İki fonksiyon da her yerde doğrusal ve bire-birdir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 &mdash; KÜBİK FONKSİYON</div><div class="example-body"><strong>$f(x) = x^3 - 1$'in tersini bul.</strong><br><br>Adım 1: $y = x^3 - 1$.<br>Adım 2: $y + 1 = x^3 \\implies x = \\sqrt[3]{y + 1}$. (Küp kök her reel için tanımlı, tanım sorunu yok.)<br>Adım 3: Değiştir: $y = \\sqrt[3]{x + 1}$.<br>Adım 4: $f^{-1}(x) = \\sqrt[3]{x + 1}$.<br>Adım 5: $f(f^{-1}(x)) = (\\sqrt[3]{x + 1})^3 - 1 = (x + 1) - 1 = x$. ✓<br><br>$x^3$ kübiği kesin olarak artandır, dolayısıyla tüm $\\mathbb{R}$'de yatay doğru testini geçer. Her yerde ters mevcuttur.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 &mdash; RASYONEL FONKSİYON</div><div class="example-body"><strong>$f(x) = \\dfrac{2x + 1}{x - 3}$'in tersini bul ($x \\neq 3$ için tanımlı).</strong><br><br>Adım 1: $y = \\dfrac{2x + 1}{x - 3}$.<br>Adım 2: Kesri at: $y(x - 3) = 2x + 1 \\implies xy - 3y = 2x + 1$.<br>$x$'i bir tarafta topla: $xy - 2x = 3y + 1 \\implies x(y - 2) = 3y + 1$.<br>Çöz: $x = \\dfrac{3y + 1}{y - 2}$ ($y \\neq 2$ gerekli).<br>Adım 3: Değiştir: $y = \\dfrac{3x + 1}{x - 2}$.<br>Adım 4: $f^{-1}(x) = \\dfrac{3x + 1}{x - 2}$ ($x \\neq 2$ için tanımlı).<br><br>2 değerinin $\\text{tan}(f^{-1})$'den hariç tutulduğuna dikkat et — çünkü 2, $f$'nin <em>asla ulaşmadığı</em> değerdir (yatay asimptot). Tanım-görüntü takası iş başında.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 &mdash; KAREKÖK FONKSİYON</div><div class="example-body"><strong>$f(x) = \\sqrt{x - 4}$'ün tersini bul ($x \\geq 4$ için tanımlı, görüntü kümesi $y \\geq 0$).</strong><br><br>Adım 1: $y = \\sqrt{x - 4}$.<br>Adım 2: İki tarafın karesini al: $y^2 = x - 4 \\implies x = y^2 + 4$.<br>Adım 3: Değiştir: $y = x^2 + 4$.<br>Adım 4: $f^{-1}(x) = x^2 + 4$ — ama kısıtlı tanım kümesi $x \\geq 0$ ile (çünkü $f$'nin görüntü kümesi $y \\geq 0$'dı).<br>Adım 5: $f(f^{-1}(x)) = \\sqrt{(x^2 + 4) - 4} = \\sqrt{x^2} = |x| = x$ ($x \\geq 0$ için). ✓<br><br>Tanım kısıtlaması olmadan tüm reellerde $g(x) = x^2 + 4$ bire-bir <em>değildir</em>, dolayısıyla ters olmaz. $x \\geq 0$ kısıtı zorunludur.</div></div>

<h2 class="lesson-title">6. Grafik: $y = x$ Doğrusunda Yansıma</h2>

<div class="calc-highlight"><strong>$f$ ile $f^{-1}$ grafikleri $y = x$ doğrusu boyunca birbirinin yansımasıdır.</strong> $(a, b)$ noktası $f$'nin grafiğindeyse $(b, a)$ noktası $f^{-1}$'in grafiğindedir. İki koordinatı yer değiştirmek, geometrik olarak 45 derecelik $y = x$ doğrusu boyunca yansımanın tam olarak yaptığı şeydir.</div>

<p class="l-text">Nedeni doğrudan. $f$'nin grafiği $\\{(x, f(x))\\}$ çiftler kümesidir. $f^{-1}$'in grafiği $\\{(y, f^{-1}(y))\\}$ çiftler kümesidir. Ama $f^{-1}(y)$ tam olarak $f$'nin $y$'ye gönderdiği $x$'tir, dolayısıyla $(y, x)$ çifti $f^{-1}$ üzerindedir tam ve tam $(x, y)$ çifti $f$ üzerinde olduğunda. $f$'nin grafiği üzerindeki her çiftin girişlerini değiştirmek $f^{-1}$'in grafiğini üretir — ve "girişleri değiştir" $y = x$ boyunca yansımanın cebirsel tanımıdır.</p>

<div class="calc-formula"><div class="formula-label">YANSIMA İLKESİ</div><div class="formula-main">$$(a, b) \\in \\text{grafik}(f) \\iff (b, a) \\in \\text{grafik}(f^{-1})$$</div><div class="formula-sub">$y = x$ boyunca yansıma her noktanın x ve y koordinatlarını yer değiştirir. Bu iki grafiği tam olarak birbirine bağlar.</div></div>

<div class="calc-graph"><div id="plot-l44-reflect-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> üç fonksiyon-ters çifti ve $y = x$ ayna doğrusu (beyaz kesikli). Her çift için ters, orijinalin doğru boyunca yansımasıdır. <br>• Doğrusal: $f(x) = 2x - 1$ (mavi) ve $f^{-1}(x) = (x + 1)/2$ (açık mavi).<br>• Kübik: $f(x) = x^3$ (yeşil) ve $f^{-1}(x) = \\sqrt[3]{x}$ (açık yeşil).<br>• Üstel ve log: $f(x) = e^x$ (turuncu) ve $f^{-1}(x) = \\ln x$ (açık turuncu).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-30;i<=30;i++){xs.push(i/10);}
var linF=xs.map(function(x){return 2*x-1;});
var linInvX=[];var linInvY=[];for(var i=0;i<xs.length;i++){var y=2*xs[i]-1;linInvX.push(y);linInvY.push(xs[i]);}
var cubF=xs.map(function(x){return x*x*x;});
var cubInv=xs.map(function(x){return Math.cbrt(x);});
var expXs=[];var expYs=[];var lnXs=[];var lnYs=[];
for(var i=-30;i<=30;i++){var x=i/10;if(x>-3&&x<3){expXs.push(x);expYs.push(Math.exp(x));}}
for(var i=1;i<=300;i++){var x=i/30;if(x<=10){lnXs.push(x);lnYs.push(Math.log(x));}}
var yx={x:[-4,4],y:[-4,4],mode:'lines',name:'y = x (ayna)',line:{color:'rgba(255,255,255,0.45)',width:1.5,dash:'dash'}};
var fLin={x:xs,y:linF,mode:'lines',name:'f(x)=2x−1',line:{color:'#3b82f6',width:2.5}};
var fLinI={x:linInvX,y:linInvY,mode:'lines',name:'f⁻¹(x)=(x+1)/2',line:{color:'#93c5fd',width:2.5,dash:'dot'}};
var fCub={x:xs,y:cubF,mode:'lines',name:'f(x)=x³',line:{color:'#10b981',width:2.5}};
var fCubI={x:xs,y:cubInv,mode:'lines',name:'f⁻¹(x)=∛x',line:{color:'#6ee7b7',width:2.5,dash:'dot'}};
var fExp={x:expXs,y:expYs,mode:'lines',name:'f(x)=eˣ',line:{color:'#f59e0b',width:2.5}};
var fLn={x:lnXs,y:lnYs,mode:'lines',name:'f⁻¹(x)=ln x',line:{color:'#fcd34d',width:2.5,dash:'dot'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l44-reflect-tr',[yx,fLin,fLinI,fCub,fCubI,fExp,fLn],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$(3, 17)$ noktası $f$'nin grafiğindeyse $f^{-1}$'in grafiğinde hangi nokta olmalıdır? Cevap: $(17, 3)$. Koordinatları değiştir. Bu, grafik üzerindeki her nokta için istisnasız geçerlidir.</div></div>

<div class="l-note"><strong>Kendi kendine ters fonksiyonlar.</strong> Birkaç özel fonksiyon kendi tersidir — yani grafikleri $y = x$ doğrusuna göre simetriktir. Örnekler: $f(x) = x$ (birim), $f(x) = -x$ (negatif alma), $x \\neq 0$'da $f(x) = 1/x$ (ters çarpan) ve bir $a$ sabiti için $f(x) = a - x$ formundaki herhangi bir fonksiyon. Bunları $y = x$'e göre yansıtmak aynı grafiği geri verir.</div>

<h2 class="lesson-title">7. Ters Elde Etmek İçin Tanım Kümesini Kısıtlama</h2>

<div class="calc-highlight"><strong>Bir fonksiyon tüm tanım kümesinde bire-bir değilse, çoğu zaman tanım kümesini bire-bir olduğu bir alt kümeye <em>kısıtlayabiliriz</em> ve ters o kısıtlanmış parçada var olur.</strong> Bu paraboller, mutlak değerler, sinüsler, kosinüsler ve diğer birçok tanıdık fonksiyonu tersine çevirmenin standart hilesidir.</div>

<p class="l-text">Klasik örnek $f(x) = x^2$'dir. Tüm reel doğru üzerinde yatay doğru testini geçemez (her pozitif çıktı iki girdiden gelir). Ama $x \\geq 0$'a (parabolün sağ yarısı) kısıtlandığında kesin artan olur — her çıktı tam bir girdiden gelir — ve ters fonksiyon temel karekök olur: $x \\geq 0$'da $f^{-1}(x) = \\sqrt{x}$.</p>

<div class="calc-formula"><div class="formula-label">KISITLANMIŞ KARE</div><div class="formula-main">$$f: [0, \\infty) \\to [0, \\infty), \\quad f(x) = x^2 \\quad\\Longrightarrow\\quad f^{-1}(x) = \\sqrt{x}$$</div><div class="formula-sub">Tanım kümesini $x \\geq 0$'a kısıtlayarak parabol bire-bir olur ve ters var olur.</div></div>

<p class="l-text">Pekala $x \\leq 0$'a (sol yarı) da kısıtlayabilirdik. O zaman ters $x \\geq 0$'da $f^{-1}(x) = -\\sqrt{x}$ olurdu. İki kısıtlama da işe yarar; sözleşme, temel karekökle eşleştiği için pozitif dalı seçmektir.</p>

<div class="calc-graph"><div id="plot-l44-restrict-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $y = x^2$ parabolü soluk gri (tam tanım kümesi — bire-bir değil) ve $x \\geq 0$ için kısıtlanmış sağ yarı $y = x^2$ yeşil. Tersi olan temel karekök $y = \\sqrt{x}$ turuncu, yeşil dalın $y = x$ kesikli doğru boyunca yansımasıdır. Yeşil ve turuncu eğriler birlikte bölüm 6'da öngörüldüğü gibi tam ayna görüntüleridir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xsAll=[];var sqAll=[];for(var i=-25;i<=25;i++){var x=i/10;xsAll.push(x);sqAll.push(x*x);}
var xsR=[];var sqR=[];for(var i=0;i<=25;i++){var x=i/10;xsR.push(x);sqR.push(x*x);}
var sqRoot={x:sqR.slice(),y:xsR.slice()};
var fullPara={x:xsAll,y:sqAll,mode:'lines',name:'y=x² (tam, 1-1 değil)',line:{color:'rgba(255,255,255,0.25)',width:2,dash:'dot'}};
var rightPara={x:xsR,y:sqR,mode:'lines',name:'y=x² için x≥0 (1-1)',line:{color:'#10b981',width:3}};
var rootCurve={x:sqRoot.x,y:sqRoot.y,mode:'lines',name:'y=√x (ters)',line:{color:'#f59e0b',width:3}};
var yxLine={x:[-3,7],y:[-3,7],mode:'lines',name:'y=x (ayna)',line:{color:'rgba(255,255,255,0.4)',width:1.3,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l44-restrict-tr',[fullPara,rightPara,rootCurve,yxLine],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Aynı hile $\\sin x$'e uygulandı.</strong> Sinüs &minus;1 ile 1 arasında sonsuza dek salınır, dolayısıyla tüm reel doğru üzerinde &minus;1 ile 1 arasındaki her çıktı sonsuz sayıda girdiden gelir. $\\arcsin$'i tanımlamak için matematikçiler $\\sin$'i $[-\\pi/2, \\pi/2]$ aralığına — bir dalganın sağ yarısı — kısıtlar, bu aralıkta kesin artan olur. Ters $\\arcsin: [-1, 1] \\to [-\\pi/2, \\pi/2]$ bu kısıtlı tanım kümesinde mevcuttur. Ters trig fonksiyonlarını gördüğümüzde detaylı çalışacağız.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; KISITLANMIŞ PARABOL</div><div class="example-body">$f(x) = (x - 2)^2$, $x \\geq 2$'ye kısıtlı olsun. $f^{-1}$'i bul.<br><br>$x \\geq 2$'de $f$ artandır (parabol yukarı açılır, tepe $x = 2$'de, sadece sağ dal). Bu kısıtta $f$'nin görüntü kümesi: $y \\geq 0$.<br><br>Adım 1: $y = (x - 2)^2$.<br>Adım 2: Pozitif karekök al (çünkü kısıtlı tanım kümesinde $x - 2 \\geq 0$): $\\sqrt{y} = x - 2 \\implies x = \\sqrt{y} + 2$.<br>Adım 3: Değiştir: $y = \\sqrt{x} + 2$.<br>Adım 4: $f^{-1}(x) = \\sqrt{x} + 2$ ($x \\geq 0$'da).<br>Adım 5: $f(f^{-1}(x)) = (\\sqrt{x} + 2 - 2)^2 = (\\sqrt{x})^2 = x$ ($x \\geq 0$ için). ✓</div></div>

<h2 class="lesson-title">8. Bilmen Gereken Standart Ters Çiftleri</h2>

<div class="calc-highlight"><strong>Birkaç ters çifti o kadar sık karşına çıkar ki ilk bakışta tanıman gerekir.</strong> Lise matematiğinin geri kalanındaki her denklemi çözmek için araç takımıdır. Tabloyu ezberle; yılın geri kalanı buna yaslanır.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Fonksiyon $f(x)$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Ters $f^{-1}(x)$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$f^{-1}$'in tanım kümesi</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Kullanım</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x + a$</td><td style="padding:0.5rem 0.8rem">$x - a$</td><td style="padding:0.5rem 0.8rem">$\\mathbb{R}$</td><td style="padding:0.5rem 0.8rem">$x + a = b$'yi çöz</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$ax$ ($a \\neq 0$ ile)</td><td style="padding:0.5rem 0.8rem">$x / a$</td><td style="padding:0.5rem 0.8rem">$\\mathbb{R}$</td><td style="padding:0.5rem 0.8rem">$ax = b$'yi çöz</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x^2$ ($x \\geq 0$'da)</td><td style="padding:0.5rem 0.8rem">$\\sqrt{x}$</td><td style="padding:0.5rem 0.8rem">$x \\geq 0$</td><td style="padding:0.5rem 0.8rem">$x^2 = b$'yi çöz (pozitif kök)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x^3$</td><td style="padding:0.5rem 0.8rem">$\\sqrt[3]{x}$</td><td style="padding:0.5rem 0.8rem">$\\mathbb{R}$</td><td style="padding:0.5rem 0.8rem">$x^3 = b$'yi çöz</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$e^x$</td><td style="padding:0.5rem 0.8rem">$\\ln x$</td><td style="padding:0.5rem 0.8rem">$x &gt; 0$</td><td style="padding:0.5rem 0.8rem">üstel denklemleri çöz</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$a^x$ ($a &gt; 0$, $a \\neq 1$ ile)</td><td style="padding:0.5rem 0.8rem">$\\log_a x$</td><td style="padding:0.5rem 0.8rem">$x &gt; 0$</td><td style="padding:0.5rem 0.8rem">$a^x = b$'yi çöz</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\sin x$ ($[-\\pi/2, \\pi/2]$'de)</td><td style="padding:0.5rem 0.8rem">$\\arcsin x$</td><td style="padding:0.5rem 0.8rem">$[-1, 1]$</td><td style="padding:0.5rem 0.8rem">$\\sin x = b$'yi çöz</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\cos x$ ($[0, \\pi]$'de)</td><td style="padding:0.5rem 0.8rem">$\\arccos x$</td><td style="padding:0.5rem 0.8rem">$[-1, 1]$</td><td style="padding:0.5rem 0.8rem">$\\cos x = b$'yi çöz</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$\\tan x$ ($(-\\pi/2, \\pi/2)$'de)</td><td style="padding:0.5rem 0.8rem">$\\arctan x$</td><td style="padding:0.5rem 0.8rem">$\\mathbb{R}$</td><td style="padding:0.5rem 0.8rem">$\\tan x = b$'yi çöz</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>En derin çift: $e^x$ ve $\\ln x$.</strong> Üstel fonksiyon $e^x$ herhangi bir reel girdiyi alır ve kesin pozitif bir çıktı üretir. Tersi olan doğal logaritma $\\ln x$, pozitif girdileri alır ve reel çıktılar üretir. İkisi gidiş-dönüş özdeşliğini paylaşır: $\\ln(e^x) = x$ ve $e^{\\ln x} = x$. Logaritmalar tam olarak üstelleri tersine çevirmek <em>istediğimiz</em> için var olur — logaritmaların icat edilmesinin tüm sebebi budur (John Napier tarafından 1600'lerin başında).</p>

<div class="l-note"><strong>Yararlı bir aile daha: doğrusal-rasyonel ters çiftler.</strong> $f(x) = (ax + b)/(cx + d)$ formundaki, $ad - bc \\neq 0$ olan fonksiyonlara Möbius dönüşümleri denir. Tersleri de doğrusal-rasyoneldir, $f^{-1}(x) = (dx - b)/(-cx + a)$ formülüyle verilir. Bu formüle lise için ihtiyacın olmayacak, ama deseni 5. bölümün 3. örneğinde gördün.</div>

<h2 class="lesson-title">9. Alıştırma Problemleri</h2>

<p class="l-text">Bu derste işlenen tüm teknikleri bir araya getiren sekiz problem. Çözümü okumadan önce kendin dene — kalemi kâğıda gerçekten değdir.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; BİRE-BİR Mİ?</div><div class="example-body"><strong>$f(x) = 4x - 9$ bire-bir mi? Evetse $f^{-1}$'i bul.</strong><br><br>$f$ eğimi 4 olan bir doğrudur. Sıfırdan farklı eğim kesin monotonluk demektir, yani $f$ yatay doğru testini geçer — bire-birdir.<br><br>Beş adımlı tarif: $y = 4x - 9 \\implies y + 9 = 4x \\implies x = (y + 9)/4$. Değiştir: $y = (x + 9)/4$. Dolayısıyla $\\mathbf{f^{-1}(x) = \\dfrac{x + 9}{4}}$.<br><br>Doğrula: $f(f^{-1}(x)) = 4 \\cdot (x+9)/4 - 9 = (x + 9) - 9 = x$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; KÜBİK TERS</div><div class="example-body"><strong>$f(x) = (x - 1)^3 + 2$'nin tersini bul.</strong><br><br>Adım 1: $y = (x - 1)^3 + 2$.<br>Adım 2: $y - 2 = (x - 1)^3 \\implies x - 1 = \\sqrt[3]{y - 2} \\implies x = \\sqrt[3]{y - 2} + 1$.<br>Adım 3: Değiştir: $y = \\sqrt[3]{x - 2} + 1$.<br>Adım 4: $\\mathbf{f^{-1}(x) = \\sqrt[3]{x - 2} + 1}$.<br>Adım 5: $f(f^{-1}(x)) = (\\sqrt[3]{x - 2} + 1 - 1)^3 + 2 = (x - 2) + 2 = x$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; RASYONEL TERS</div><div class="example-body"><strong>$f(x) = \\dfrac{x + 5}{x - 1}$'in tersini bul ($x \\neq 1$ için tanımlı).</strong><br><br>$y = \\dfrac{x + 5}{x - 1} \\implies y(x - 1) = x + 5 \\implies xy - y = x + 5$.<br>$x$'i topla: $xy - x = y + 5 \\implies x(y - 1) = y + 5 \\implies x = \\dfrac{y + 5}{y - 1}$ ($y \\neq 1$ gerekli).<br>Değiştir: $\\mathbf{f^{-1}(x) = \\dfrac{x + 5}{x - 1}}$ ($x \\neq 1$'de).<br><br>Bu fonksiyon kendi tersidir — kendi kendine ters bir Möbius dönüşümüdür.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; KAREKÖK TERSİ</div><div class="example-body"><strong>$f(x) = \\sqrt{2x - 6}$'nın tersini bul ($x \\geq 3$ için tanımlı).</strong><br><br>Adım 1: $y = \\sqrt{2x - 6}$, $y \\geq 0$ ile.<br>Adım 2: Kareyi al: $y^2 = 2x - 6 \\implies x = (y^2 + 6)/2$.<br>Adım 3: Değiştir: $y = (x^2 + 6)/2$.<br>Adım 4: $\\mathbf{f^{-1}(x) = \\dfrac{x^2 + 6}{2}}$ ($x \\geq 0$'da).<br>Adım 5: $f(f^{-1}(x)) = \\sqrt{2 \\cdot (x^2 + 6)/2 - 6} = \\sqrt{x^2 + 6 - 6} = \\sqrt{x^2} = x$ ($x \\geq 0$ için). ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; TERS GRAFİĞİNDEKİ NOKTA</div><div class="example-body"><strong>$f$'nin grafiği $(0, 3)$, $(2, 7)$ ve $(5, -1)$ noktalarından geçer. $f^{-1}$'in grafiğinde üç nokta yaz.</strong><br><br>Her koordinat çiftini değiştir (bölüm 6): ters grafik $\\mathbf{(3, 0)}$, $\\mathbf{(7, 2)}$ ve $\\mathbf{(-1, 5)}$ noktalarından geçer.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; KISITLANMIŞ PARABOL</div><div class="example-body"><strong>$f(x) = x^2 + 4x + 5$ fonksiyonu $\\mathbb{R}$'de bire-bir değildir. Bire-bir olacak şekilde tanım kümesini kısıtla, sonra $f^{-1}$'i bul.</strong><br><br>Kareyi tamamla: $f(x) = (x + 2)^2 + 1$. Tepe $x = -2$'de. $x \\geq -2$'ye kısıtla (sağ dal).<br><br>Adım 1: $y = (x + 2)^2 + 1 \\implies y - 1 = (x + 2)^2$.<br>Adım 2: $x + 2 \\geq 0$ olduğundan pozitif kökü al: $\\sqrt{y - 1} = x + 2 \\implies x = \\sqrt{y - 1} - 2$.<br>Adım 3: Değiştir: $y = \\sqrt{x - 1} - 2$.<br>Adım 4: $\\mathbf{f^{-1}(x) = \\sqrt{x - 1} - 2}$ ($x \\geq 1$'de, çünkü kısıtlı tanım kümesinde $f$'nin görüntü kümesi $y \\geq 1$).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; BİLEŞKE İLE TERSİ DOĞRULA</div><div class="example-body"><strong>$f(x) = (x + 3)/2$ ile $g(x) = 2x - 3$ birbirinin tersi mi?</strong><br><br>$f(g(x))$'i hesapla: $f(2x - 3) = ((2x - 3) + 3)/2 = 2x/2 = x$. ✓<br>$g(f(x))$'i hesapla: $g((x + 3)/2) = 2 \\cdot (x + 3)/2 - 3 = (x + 3) - 3 = x$. ✓<br><br>İki gidiş-dönüş de $x$'i verir. Evet, birbirinin tersidir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; TERS FONKSİYONUN TANIM VE GÖRÜNTÜ KÜMESİ</div><div class="example-body"><strong>$f: [1, 5] \\to [2, 14]$ fonksiyonu $f(x) = 3x - 1$ olarak tanımlı. $f^{-1}$'in tanım ve görüntü kümesi nedir?</strong><br><br>Tanım-görüntü takasıyla (bölüm 3):<br>$\\text{tan}(f^{-1}) = \\text{gör}(f) = [2, 14]$.<br>$\\text{gör}(f^{-1}) = \\text{tan}(f) = [1, 5]$.<br><br>Ve formül: $y = 3x - 1 \\implies x = (y + 1)/3$, yani $f^{-1}(x) = (x + 1)/3$. Uç noktaları kontrol et: $f^{-1}(2) = 1$ ✓ ve $f^{-1}(14) = 5$ ✓.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Sonraki derste tersleri üstel ve logaritmik denklemleri çözmek için kullanacağız — bu konunun en önemli uygulaması. Özellikle $e^x \\leftrightarrow \\ln x$ standart çiftine dikkat et: kalkülüsteki her üstel denklem iki tarafa $\\ln$ uygulanarak çözülür ve her logaritmik denklem üs alarak çözülür.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Ters fonksiyon $f^{-1}$, $f$'nin girdi-çıktı yönünü tersine çevirir: $f^{-1}(f(x)) = x$ ve $f(f^{-1}(x)) = x$</li>
<li>Ters yalnızca $f$ bire-bir olduğunda mevcuttur — her çıktı tam bir girdiden gelir</li>
<li>Yatay doğru testi: $f$ bire-birdir $\\iff$ her yatay doğru grafiği en fazla bir noktada keser</li>
<li>Beş adımlı tarif: $y = f(x)$ yaz, $x$ için çöz, $x$ ile $y$'yi değiştir, $f^{-1}$'i tanımla, bileşke ile doğrula</li>
<li>$f$ ile $f^{-1}$ grafikleri $y = x$ doğrusu boyunca birbirinin yansımasıdır — her koordinat çiftini değiştir</li>
<li>$f$ tüm tanım kümesinde bire-bir değilse, bire-bir olduğu bir parçaya kısıtla ve o parçada tersini al</li>
<li>Anahtar standart çiftler: $x^2 \\leftrightarrow \\sqrt{x}$ ($x \\geq 0$'da), $x^3 \\leftrightarrow \\sqrt[3]{x}$, $e^x \\leftrightarrow \\ln x$, $\\sin \\leftrightarrow \\arcsin$ ($[-\\pi/2, \\pi/2]$'de)</li>
<li>$f^{-1}$ gösterimi asla $1/f$ anlamına gelmez — bu çarpmaya göre ters, tamamen farklı bir fonksiyon</li>
</ul>
</div>`
};
