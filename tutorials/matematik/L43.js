window.LISE_MAT_L43 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Some operations come in pairs: first one happens, then another.</strong> You wake up, then you have breakfast. You enter a password, then the door unlocks. In mathematics we describe this kind of "first this function, then that function" rule with the <em>composite</em> of two functions. The composite is itself a new function, and learning to read, build, and pull apart composites is one of the most useful algebraic habits you will pick up in high school. It will reappear in derivatives (the chain rule), in inverse functions, in transformations of graphs — almost everywhere.</p>

<p class="l-text">In this lesson we focus on the mechanics: what $(f\\circ g)(x)$ means, how to compute it, why the order matters, and how to find the domain of a composite. We also learn the reverse trick — given a complicated function, decompose it as the composite of two simpler ones. That decomposition skill is what makes the chain rule (next year, in calculus) feel natural rather than mysterious.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define the composite $(f\\circ g)(x) = f(g(x))$ as "apply $g$ first, then apply $f$ to the result"</li>
<li>Compute composites at a number ($f(g(2))$) and at an algebraic expression ($f(g(x))$)</li>
<li>Determine the domain of a composite by combining the domain of the inner function with the requirement that its output lie in the domain of the outer</li>
<li>Show by counter-example that $f\\circ g$ and $g\\circ f$ are usually <em>different</em> functions</li>
<li>Decompose a given function $h(x)$ as $h = f\\circ g$ by spotting an inner block and an outer wrapper</li>
<li>Handle triple composites $f\\circ g\\circ h$ by working right-to-left, and recognise the identity function $I(x)=x$ as the "do-nothing" element of composition</li>
</ul>
</div>

<h2 class="lesson-title">1. Composite Functions: The Intuition</h2>

<div class="calc-highlight"><strong>A composite is a pipeline of two machines.</strong> The input flows into the first machine, the first machine spits out an intermediate value, that intermediate value becomes the input of the second machine, and the second machine produces the final output. The composite is the single "super-machine" that does both steps in one.</div>

<p class="l-text">Imagine two simple function-machines side by side. The first one, call it $g$, takes any number and adds 3. The second, call it $f$, takes any number and squares it. If we feed the number 5 into $g$ first and then push the result through $f$, we get:</p>

<div class="calc-formula"><div class="formula-label">PIPELINE: INPUT &rarr; g &rarr; INTERMEDIATE &rarr; f &rarr; OUTPUT</div><div class="formula-main">$$5 \\;\\xrightarrow{\\;g\\;}\\; 5+3 = 8 \\;\\xrightarrow{\\;f\\;}\\; 8^2 = 64$$</div><div class="formula-sub">First apply $g$ (add 3), then apply $f$ (square). The combined effect is "add 3, then square", which we write $f(g(5)) = 64$.</div></div>

<p class="l-text">The order matters! If we had run them the other way around — first square, then add 3 — we would get $5^2 + 3 = 28$, a completely different answer. Composition is in general <em>not commutative</em>: $f\\circ g$ and $g\\circ f$ usually disagree. We will see this carefully in section 4.</p>

<div class="calc-graph"><div id="plot-l43-pipeline-en" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a three-box pipeline. The input $x$ enters the first box (the <em>inner</em> function $g$), produces an intermediate value $u = g(x)$, which enters the second box (the <em>outer</em> function $f$) and produces the final output $f(g(x))$. The arrows mark the direction of flow.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var boxes={x:[1,1,3,3,1,null,5,5,7,7,5,null,9,9,11,11,9],y:[0.5,1.5,1.5,0.5,0.5,null,0.5,1.5,1.5,0.5,0.5,null,0.5,1.5,1.5,0.5,0.5],mode:'lines',line:{color:'#3b82f6',width:2.5},name:'boxes',showlegend:false,hoverinfo:'skip'};
var arrows={x:[3,5,null,7,9],y:[1,1,null,1,1],mode:'lines',line:{color:'#f59e0b',width:2,dash:'dot'},name:'flow',showlegend:false,hoverinfo:'skip'};
var labels={x:[2,6,10,4,8,0.4,12],y:[1,1,1,1.75,1.75,1,1],mode:'text',text:['input x','inner g','outer f','&rarr;','&rarr;','x','f(g(x))'],textfont:{color:'#e8e8e8',size:13},showlegend:false,hoverinfo:'skip'};
var labels2={x:[6,10],y:[0.25,0.25],mode:'text',text:['u = g(x)','final output'],textfont:{color:'rgba(235,230,220,0.65)',size:11},showlegend:false,hoverinfo:'skip'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.5,12.5],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-0.3,2.3],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'x',scaleratio:0.6},margin:{t:20,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l43-pipeline-en',[boxes,arrows,labels,labels2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If $g$ multiplies by 2 and $f$ adds 7, then $f(g(5))$ first doubles 5 (to get 10) and then adds 7 (to get 17). What is $g(f(5))$? Answer: $f(5)=12$, then $g(12)=24$. So $f(g(5))=17$ but $g(f(5))=24$ — different!</div></div>

<h2 class="lesson-title">2. The Notation (f &compfn; g)(x) = f(g(x))</h2>

<div class="calc-highlight"><strong>One symbol, one definition.</strong> The little circle "&compfn;" between two function names means "compose them — apply the right one first." It is read aloud as "$f$ composed with $g$" or simply "$f$ of $g$".</div>

<div class="calc-formula"><div class="formula-label">DEFINITION OF COMPOSITION</div><div class="formula-main">$$(f \\circ g)(x) \\;=\\; f(g(x))$$</div><div class="formula-sub">Reading right to left: $g$ is applied to $x$ first; the result $g(x)$ is then fed into $f$. The function $f$ is called the <strong>outer</strong> function, $g$ is called the <strong>inner</strong> function.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Outer function $f$</div><div class="card-body">The function written on the <em>left</em> of the circle. It acts <strong>last</strong>. It receives whatever the inner function produced.</div></div>
<div class="calc-card"><div class="card-title">Inner function $g$</div><div class="card-body">The function written on the <em>right</em> of the circle. It acts <strong>first</strong>. It receives the original input $x$.</div></div>
<div class="calc-card"><div class="card-title">Symbol "&compfn;"</div><div class="card-body">A small open ring. Do not confuse it with multiplication "$\\cdot$" or the regular letter "o". In typed mathematics you may also see "$\\circ$" written out.</div></div>
</div>

<p class="l-text"><strong>Two ways to write the same thing.</strong> The notation $(f\\circ g)(x)$ and the notation $f(g(x))$ mean exactly the same thing. Some textbooks prefer one, some the other. Be comfortable switching between them at sight.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Let $f(x) = 2x + 1$ and $g(x) = x^2$. Find $(f\\circ g)(3)$ and $(g\\circ f)(3)$.<br><br><strong>Step 1.</strong> $(f\\circ g)(3) = f(g(3))$. First compute $g(3) = 3^2 = 9$. Then compute $f(9) = 2\\cdot 9 + 1 = 19$.<br><br><strong>Step 2.</strong> $(g\\circ f)(3) = g(f(3))$. First $f(3) = 2\\cdot 3 + 1 = 7$. Then $g(7) = 7^2 = 49$.<br><br>So $(f\\circ g)(3) = 19$ and $(g\\circ f)(3) = 49$. Different — the order is everything.</div></div>

<div class="l-note"><strong>The most common student mistake</strong> is to read $(f\\circ g)(x)$ as "$f$ first, then $g$" because $f$ is written first. The circle is read right-to-left, like a phone-number-style "$f$ of $g$ of $x$" — $g$ is closest to the input $x$, so $g$ acts first.</div>

<h2 class="lesson-title">3. The Domain of a Composite</h2>

<div class="calc-highlight"><strong>The composite has a fussier domain than either ingredient.</strong> Two conditions must hold for $(f\\circ g)(x)$ to make sense: (i) $x$ must be in the domain of $g$, otherwise $g(x)$ is not even defined; and (ii) the value $g(x)$ must lie in the domain of $f$, otherwise $f$ cannot accept it as input.</div>

<div class="calc-formula"><div class="formula-label">DOMAIN OF $f \\circ g$</div><div class="formula-main">$$\\text{Dom}(f \\circ g) \\;=\\; \\{\\, x \\in \\text{Dom}(g) \\;:\\; g(x) \\in \\text{Dom}(f) \\,\\}$$</div><div class="formula-sub">In words: start with the domain of the inner function $g$, then throw out any $x$ whose image $g(x)$ would crash the outer function $f$.</div></div>

<div class="calc-graph"><div id="plot-l43-domain-en" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two overlapping rectangles representing $\\text{Dom}(g)$ (left) and the inputs $x$ for which $g(x)\\in\\text{Dom}(f)$ (right). The intersection — the dark middle region — is the domain of the composite $f\\circ g$. Anything outside the intersection is excluded.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var leftBox={x:[0,0,5,5,0],y:[0,2,2,0,0],fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'#3b82f6',width:2},mode:'lines',name:'Dom(g)',hoverinfo:'name'};
var rightBox={x:[3,3,8,8,3],y:[0,2,2,0,0],fill:'toself',fillcolor:'rgba(239,68,68,0.18)',line:{color:'#ef4444',width:2},mode:'lines',name:'{x : g(x)∈Dom(f)}',hoverinfo:'name'};
var midBox={x:[3,3,5,5,3],y:[0,2,2,0,0],fill:'toself',fillcolor:'rgba(245,158,11,0.5)',line:{color:'#f59e0b',width:2.5},mode:'lines',name:'Dom(f∘g) — intersection',hoverinfo:'name'};
var labs={x:[1.5,4,6.5],y:[1,1,1],mode:'text',text:['Dom(g)<br>(g defined here)','Dom(f∘g)','g(x)∈Dom(f)<br>(f can accept g(x))'],textfont:{color:'#e8e8e8',size:11},showlegend:false,hoverinfo:'skip'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.5,8.5],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-0.5,2.7],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'x',scaleratio:0.5},margin:{t:20,r:20,b:20,l:20},legend:{orientation:'h',y:-0.05,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l43-domain-en',[leftBox,rightBox,midBox,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 — DENOMINATOR</div><div class="example-body">Let $f(x) = \\dfrac{1}{x}$ and $g(x) = x - 4$. Find the domain of $(f\\circ g)(x)$.<br><br>$(f\\circ g)(x) = f(g(x)) = f(x-4) = \\dfrac{1}{x-4}$.<br><br>$g$ is defined everywhere ($\\text{Dom}(g) = \\mathbb{R}$). $f$ is defined for all $u \\neq 0$. So we need $g(x) \\neq 0$, i.e. $x - 4 \\neq 0$, i.e. $x \\neq 4$.<br><br>Domain: $\\boxed{\\mathbb{R} \\setminus \\{4\\}}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — SQUARE ROOT</div><div class="example-body">Let $f(x) = \\sqrt{x}$ and $g(x) = x - 5$. Find the domain of $(f\\circ g)(x)$.<br><br>$(f\\circ g)(x) = \\sqrt{x - 5}$.<br><br>$g$ is defined everywhere. $f$ requires its input to be $\\geq 0$. So we need $g(x) \\geq 0$, i.e. $x - 5 \\geq 0$, i.e. $x \\geq 5$.<br><br>Domain: $\\boxed{[5, \\infty)}$.</div></div>

<div class="l-note"><strong>Cautionary note:</strong> the algebraic simplification $f(g(x))$ sometimes <em>hides</em> the original restriction. For example, $f(x)=x^2$ and $g(x)=\\sqrt{x}$ give $(f\\circ g)(x) = (\\sqrt{x})^2 = x$, which looks defined everywhere. But $g$ requires $x \\geq 0$, so the composite's domain is $[0,\\infty)$ — not all of $\\mathbb{R}$. Always check the inner function first.</div>

<h2 class="lesson-title">4. f &compfn; g &ne; g &compfn; f (Order Matters)</h2>

<div class="calc-highlight"><strong>Composition is not commutative.</strong> Unlike addition ($a+b = b+a$) or multiplication ($ab = ba$), the order of composition usually changes the answer. We say $f\\circ g$ and $g\\circ f$ are, in general, <em>different functions</em>.</div>

<p class="l-text">Why? Because "add 3 then square" produces a different rule than "square then add 3". Let us verify this with two short examples, both algebraic and numerical.</p>

<div class="calc-example"><div class="example-label">EXAMPLE A — POLYNOMIAL CASE</div><div class="example-body">$f(x) = x + 3$, $g(x) = x^2$.<br><br>$(f\\circ g)(x) = f(g(x)) = f(x^2) = x^2 + 3$.<br>$(g\\circ f)(x) = g(f(x)) = g(x+3) = (x+3)^2 = x^2 + 6x + 9$.<br><br>At $x=2$: $(f\\circ g)(2) = 7$ but $(g\\circ f)(2) = 25$. Completely different functions.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE B — RATIONAL CASE</div><div class="example-body">$f(x) = \\dfrac{1}{x}$, $g(x) = x + 1$.<br><br>$(f\\circ g)(x) = f(x+1) = \\dfrac{1}{x+1}$ (defined for $x \\neq -1$).<br>$(g\\circ f)(x) = g(1/x) = \\dfrac{1}{x} + 1 = \\dfrac{1+x}{x}$ (defined for $x \\neq 0$).<br><br>Even the <em>domains</em> are different — one excludes $-1$, the other excludes $0$. The two composites are very much not the same function.</div></div>

<div class="calc-graph"><div id="plot-l43-noncomm-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the graphs of $(f\\circ g)(x) = x^2 + 3$ and $(g\\circ f)(x) = (x+3)^2$ on the same axes, for $f(x)=x+3$ and $g(x)=x^2$. Notice how they meet only at one point and diverge everywhere else — visual proof that $f\\circ g \\neq g\\circ f$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var fg=[];var gf=[];for(var i=0;i<=100;i++){var x=-5+10*i/100;xs.push(x);fg.push(x*x+3);gf.push((x+3)*(x+3));}
var tr1={x:xs,y:fg,mode:'lines',name:'(f∘g)(x) = x² + 3',line:{color:'#3b82f6',width:2.5}};
var tr2={x:xs,y:gf,mode:'lines',name:'(g∘f)(x) = (x+3)²',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-2,50],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l43-noncomm-en',[tr1,tr2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>When does $f\\circ g = g\\circ f$?</strong> Only in special cases — for example when $f$ and $g$ are inverses of each other (then both composites equal the identity $I(x)=x$), or when both are linear of the form $ax+b$ with carefully matched coefficients. In <em>general</em>, assume they differ.</p>

<h2 class="lesson-title">5. Computing Composites — Worked Examples</h2>

<div class="calc-highlight"><strong>The mechanics are always the same:</strong> wherever you see $x$ inside the outer function $f$, substitute the entire expression for $g(x)$. Then simplify. That is the whole procedure. Practise it until it becomes muscle memory.</div>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — POLYNOMIAL INTO LINEAR</div><div class="example-body">Let $f(x) = 3x - 2$ and $g(x) = x^2 + 1$. Find $(f\\circ g)(x)$.<br><br>$(f\\circ g)(x) = f(g(x)) = f(x^2+1) = 3(x^2+1) - 2 = 3x^2 + 3 - 2 = \\boxed{3x^2 + 1}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — SQUARE ROOT INTO LINEAR</div><div class="example-body">Let $f(x) = \\sqrt{x}$ and $g(x) = 2x + 5$. Find $(f\\circ g)(x)$ and its domain.<br><br>$(f\\circ g)(x) = \\sqrt{2x+5}$.<br><br>Domain: need $2x+5 \\geq 0$, so $x \\geq -\\dfrac{5}{2}$. Domain: $\\left[-\\dfrac{5}{2}, \\infty\\right)$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — LINEAR INTO RATIONAL</div><div class="example-body">Let $f(x) = \\dfrac{1}{x+2}$ and $g(x) = x - 3$. Find $(f\\circ g)(x)$.<br><br>$(f\\circ g)(x) = f(x-3) = \\dfrac{1}{(x-3) + 2} = \\dfrac{1}{x-1}$.<br><br>Domain: $x \\neq 1$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 — COMPOSITE EVALUATED FROM A TABLE</div><div class="example-body">Suppose the table gives: $f(1)=4,\\; f(2)=7,\\; f(3)=1,\\; f(4)=5$ and $g(1)=3,\\; g(2)=1,\\; g(3)=4,\\; g(4)=2$. Compute $(f\\circ g)(2)$, $(g\\circ f)(1)$, $(f\\circ f)(3)$.<br><br>$(f\\circ g)(2) = f(g(2)) = f(1) = 4$.<br>$(g\\circ f)(1) = g(f(1)) = g(4) = 2$.<br>$(f\\circ f)(3) = f(f(3)) = f(1) = 4$.<br><br>This is how composition appears on most exam problems involving tables — pure look-up, two steps each time.</div></div>

<h2 class="lesson-title">6. Decomposing: Writing h = f &compfn; g</h2>

<div class="calc-highlight"><strong>The reverse operation: given $h$, find $f$ and $g$ with $h = f\\circ g$.</strong> This is one of the most useful algebraic skills you can develop — it tells your future calculus self exactly how to apply the chain rule when computing derivatives.</div>

<p class="l-text">The trick is to look at $h(x)$ and ask: "What is the <em>innermost block</em> being acted on?" That block is $g(x)$. Whatever the outer wrapper does to that block is $f$.</p>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — SQUARE ROOT WRAPPER</div><div class="example-body">Decompose $h(x) = \\sqrt{3x + 7}$ as $f\\circ g$.<br><br>The inner block being square-rooted is $3x+7$. So $g(x) = 3x+7$. The outer wrapper takes a square root, so $f(u) = \\sqrt{u}$.<br><br>Check: $f(g(x)) = f(3x+7) = \\sqrt{3x+7}$. ✓</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — POWER WRAPPER</div><div class="example-body">Decompose $h(x) = (x^2 - 4)^5$.<br><br>Innermost block: $x^2 - 4$. So $g(x) = x^2 - 4$. Outer wrapper: raise to the fifth power, so $f(u) = u^5$.<br><br>Check: $f(g(x)) = (x^2-4)^5$. ✓</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — RATIONAL WRAPPER</div><div class="example-body">Decompose $h(x) = \\dfrac{1}{2x - 9}$.<br><br>Innermost block: $2x - 9$. So $g(x) = 2x-9$. Outer wrapper: take the reciprocal, so $f(u) = 1/u$.<br><br>Check: $f(g(x)) = \\dfrac{1}{2x-9}$. ✓</div></div>

<div class="l-note"><strong>Decompositions are not unique.</strong> The function $h(x) = (x^2-4)^5$ could also be split as $g(x) = (x^2-4)^5$ with $f(u)=u$ (trivial — outer is identity) or $g(x)=x^2$ and $f(u) = (u-4)^5$ (also valid). The "best" split is usually the one where the outer $f$ is as simple as possible — typically a power, a square root, or a reciprocal.</div>

<h2 class="lesson-title">7. Triple Composites: f &compfn; g &compfn; h</h2>

<div class="calc-highlight"><strong>Three functions in a row — work right to left.</strong> The notation $(f\\circ g\\circ h)(x) = f(g(h(x)))$ means: first apply $h$, then $g$, then $f$. Three machines in sequence.</div>

<div class="calc-formula"><div class="formula-label">TRIPLE COMPOSITION</div><div class="formula-main">$$(f \\circ g \\circ h)(x) \\;=\\; f\\big(g(h(x))\\big)$$</div><div class="formula-sub">Read right to left: $h$ acts first on $x$, then $g$ acts on $h(x)$, then $f$ acts on $g(h(x))$. The composition is <em>associative</em>: $(f\\circ g)\\circ h = f\\circ(g\\circ h)$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TRIPLE COMPOSITE</div><div class="example-body">Let $f(x) = x + 1$, $g(x) = 2x$, $h(x) = x^2$. Find $(f\\circ g\\circ h)(3)$.<br><br><strong>Step 1.</strong> $h(3) = 3^2 = 9$.<br><strong>Step 2.</strong> $g(9) = 2 \\cdot 9 = 18$.<br><strong>Step 3.</strong> $f(18) = 18 + 1 = 19$.<br><br>So $(f\\circ g\\circ h)(3) = \\boxed{19}$. Each step uses the previous step's output.</div></div>

<div class="calc-example"><div class="example-label">SAME COMPOSITE, ALGEBRAIC FORM</div><div class="example-body">Using the same $f, g, h$, find the formula $(f\\circ g\\circ h)(x)$.<br><br>$h(x) = x^2$.<br>$g(h(x)) = g(x^2) = 2x^2$.<br>$f(g(h(x))) = f(2x^2) = 2x^2 + 1$.<br><br>Result: $(f\\circ g\\circ h)(x) = \\boxed{2x^2 + 1}$. Check at $x=3$: $2\\cdot 9 + 1 = 19$. ✓</div></div>

<p class="l-text"><strong>Associativity is real and useful.</strong> Because $(f\\circ g)\\circ h$ equals $f\\circ(g\\circ h)$, you can group however you like — pair up $f\\circ g$ first and then compose with $h$, or pair $g\\circ h$ and feed into $f$. Both routes land on the same final function. This freedom often simplifies decomposition exercises.</p>

<h2 class="lesson-title">8. The Identity Function I(x) = x</h2>

<div class="calc-highlight"><strong>Every algebraic structure has a "do-nothing" element.</strong> For addition it is $0$ (because $a + 0 = a$). For multiplication it is $1$ (because $a \\cdot 1 = a$). For composition of functions it is the <em>identity function</em>, $I(x) = x$ — the function that returns whatever input it is given, unchanged.</div>

<div class="calc-formula"><div class="formula-label">IDENTITY FUNCTION AND ITS PROPERTY</div><div class="formula-main">$$I(x) = x \\quad\\Longrightarrow\\quad f \\circ I \\;=\\; I \\circ f \\;=\\; f$$</div><div class="formula-sub">Composing any function $f$ with the identity (on either side) returns $f$ unchanged. The identity is the neutral element for composition.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Let $f(x) = 3x + 5$ and $I(x) = x$. Verify $f\\circ I = I\\circ f = f$.<br><br>$(f\\circ I)(x) = f(I(x)) = f(x) = 3x+5$. ✓<br>$(I\\circ f)(x) = I(f(x)) = f(x) = 3x+5$. ✓<br><br>Both directions give $f$ back — the identity does nothing.</div></div>

<p class="l-text"><strong>Looking ahead to inverses.</strong> Two functions $f$ and $g$ are called <em>inverses</em> of each other precisely when their composition (in either order) is the identity: $f\\circ g = g\\circ f = I$. We will study inverse functions in a later lesson; for now, just notice that the identity is the "target" the two halves must combine to produce.</p>

<h2 class="lesson-title">9. Classical Exercises</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — BASIC COMPOSITION AT A NUMBER</div><div class="example-body"><strong>Let $f(x) = x^2 - 1$ and $g(x) = 3x + 2$. Compute $(f\\circ g)(4)$ and $(g\\circ f)(4)$.</strong><br><br>$(f\\circ g)(4) = f(g(4)) = f(14) = 14^2 - 1 = 195$.<br>$(g\\circ f)(4) = g(f(4)) = g(15) = 3\\cdot 15 + 2 = 47$.<br><br>Answer: <strong>$(f\\circ g)(4) = 195$, $(g\\circ f)(4) = 47$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — COMPOSITE FORMULA</div><div class="example-body"><strong>Let $f(x) = 2x + 3$ and $g(x) = x - 5$. Find $(f\\circ g)(x)$ and $(g\\circ f)(x)$.</strong><br><br>$(f\\circ g)(x) = f(x-5) = 2(x-5) + 3 = 2x - 10 + 3 = 2x - 7$.<br>$(g\\circ f)(x) = g(2x+3) = (2x+3) - 5 = 2x - 2$.<br><br>Answer: <strong>$2x-7$ and $2x-2$</strong> — different linear functions.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — DOMAIN OF A COMPOSITE</div><div class="example-body"><strong>Let $f(x) = \\sqrt{x}$ and $g(x) = 9 - x^2$. Find the domain of $(f\\circ g)(x)$.</strong><br><br>$(f\\circ g)(x) = \\sqrt{9 - x^2}$. We need $9 - x^2 \\geq 0$, i.e. $x^2 \\leq 9$, i.e. $-3 \\leq x \\leq 3$.<br><br>Answer: <strong>$[-3, 3]$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — DECOMPOSITION</div><div class="example-body"><strong>Decompose $h(x) = (4x - 1)^3$ as $f\\circ g$.</strong><br><br>Innermost block: $4x-1$. So $g(x) = 4x - 1$. Outer wrapper: cubing, so $f(u) = u^3$.<br><br>Answer: <strong>$f(u) = u^3$, $g(x) = 4x-1$</strong>. Check: $f(g(x)) = (4x-1)^3$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — DECOMPOSITION OF A RATIONAL</div><div class="example-body"><strong>Decompose $h(x) = \\dfrac{2}{\\sqrt{x+3}}$ as $f\\circ g$.</strong><br><br>Innermost block: $x+3$. So $g(x) = x+3$. Outer wrapper: take square root then reciprocate and double, so $f(u) = \\dfrac{2}{\\sqrt{u}}$.<br><br>Answer: <strong>$f(u) = 2/\\sqrt{u}$, $g(x) = x+3$</strong>. (You could split further into three pieces if you want — see triple composites.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — TRIPLE COMPOSITION AT A NUMBER</div><div class="example-body"><strong>Let $f(x) = x + 4$, $g(x) = x^2$, $h(x) = x - 1$. Compute $(f\\circ g\\circ h)(3)$.</strong><br><br>$h(3) = 3 - 1 = 2$. Then $g(2) = 4$. Then $f(4) = 8$.<br><br>Answer: <strong>8</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — FROM A TABLE</div><div class="example-body"><strong>Given:</strong> $f(1)=2,\\;f(2)=5,\\;f(3)=4,\\;f(4)=3,\\;f(5)=1$ and $g(1)=4,\\;g(2)=3,\\;g(3)=5,\\;g(4)=2,\\;g(5)=1$. <strong>Compute $(f\\circ g)(2)$, $(g\\circ f)(2)$, $(f\\circ f)(1)$, $(g\\circ g)(4)$.</strong><br><br>$(f\\circ g)(2) = f(g(2)) = f(3) = 4$.<br>$(g\\circ f)(2) = g(f(2)) = g(5) = 1$.<br>$(f\\circ f)(1) = f(f(1)) = f(2) = 5$.<br>$(g\\circ g)(4) = g(g(4)) = g(2) = 3$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — RECOVER g FROM f AND f &compfn; g</div><div class="example-body"><strong>If $f(x) = 2x + 1$ and $(f\\circ g)(x) = 6x - 3$, find $g(x)$.</strong><br><br>We have $f(g(x)) = 2g(x) + 1 = 6x - 3$. Solve for $g(x)$:<br>$2g(x) = 6x - 4$, so $g(x) = 3x - 2$.<br><br>Answer: <strong>$g(x) = 3x - 2$</strong>. Check: $f(3x-2) = 2(3x-2) + 1 = 6x - 4 + 1 = 6x - 3$. ✓</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Definition: $(f\\circ g)(x) = f(g(x))$ — read right to left ($g$ first, then $f$)</li>
<li>$f$ is the <em>outer</em> function, $g$ is the <em>inner</em>; the inner block sits closest to $x$</li>
<li>Domain: $x$ must be in $\\text{Dom}(g)$ <em>and</em> $g(x)$ must be in $\\text{Dom}(f)$</li>
<li>Composition is <strong>not</strong> commutative: $f\\circ g \\neq g\\circ f$ in general — order matters</li>
<li>To compute a composite, substitute the entire $g(x)$ wherever $x$ appears in $f$, then simplify</li>
<li>To decompose $h = f\\circ g$, find the innermost block ($g$) and the outer wrapper ($f$)</li>
<li>Triple composites $f\\circ g\\circ h$ are computed right to left and are associative</li>
<li>Identity $I(x) = x$ is the neutral element: $f\\circ I = I\\circ f = f$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bazı işlemler ikili gelir: önce biri olur, sonra diğeri.</strong> Önce uyanırsın, sonra kahvaltı edersin. Önce şifreyi girersin, sonra kapı açılır. Matematikte bu "önce şu fonksiyon, sonra şu fonksiyon" kuralını iki fonksiyonun <em>bileşkesi</em> ile tarif ederiz. Bileşke kendi başına yeni bir fonksiyondur ve bileşkeleri okuma, kurma ve ayrıştırma becerisi lisede edineceğin en faydalı cebirsel alışkanlıklardan biridir. Türev derslerinde (zincir kuralı), ters fonksiyonlarda, grafik dönüşümlerinde — neredeyse her yerde tekrar tekrar karşına çıkacak.</p>

<p class="l-text">Bu derste mekaniğe odaklanıyoruz: $(f\\circ g)(x)$ ne demek, nasıl hesaplanır, sıra neden önemli ve bileşke fonksiyonun tanım kümesi nasıl bulunur. Bir de ters numaraya bakıyoruz — karmaşık bir fonksiyon verildiğinde, onu daha basit iki fonksiyonun bileşkesi olarak ayrıştırmak. Bu ayrıştırma yeteneği zincir kuralını (önümüzdeki yıl, kalkülüste) gizemli değil doğal hissettirecek olan şeydir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$(f\\circ g)(x) = f(g(x))$ bileşkesini "önce $g$ uygulanır, sonra sonuca $f$ uygulanır" diye tanımlamayı</li>
<li>Bileşkeyi bir sayıda ($f(g(2))$) ve cebirsel bir ifadede ($f(g(x))$) hesaplamayı</li>
<li>Bileşkenin tanım kümesini, iç fonksiyonun tanım kümesiyle "$g(x)$'in dış fonksiyonun tanım kümesinde olması" koşulunu birleştirerek bulmayı</li>
<li>Bir karşı örnekle $f\\circ g$ ile $g\\circ f$'nin genellikle <em>farklı</em> fonksiyonlar olduğunu göstermeyi</li>
<li>Verilen bir $h(x)$ fonksiyonunu, bir iç blok ve bir dış sarmalayıcı tespit ederek $h = f\\circ g$ olarak ayrıştırmayı</li>
<li>$f\\circ g\\circ h$ üçlü bileşkesini sağdan sola hesaplamayı ve $I(x)=x$ birim fonksiyonunu bileşkenin "hiçbir şey yapmayan" elemanı olarak tanımayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Bileşke Fonksiyon: Sezgi</h2>

<div class="calc-highlight"><strong>Bileşke, iki makinenin bir boru hattıdır.</strong> Girdi ilk makineye akar, ilk makine bir ara değer üretir, o ara değer ikinci makinenin girdisi olur ve ikinci makine son çıktıyı üretir. Bileşke, her iki adımı tek seferde yapan tek bir "süper-makinedir".</div>

<p class="l-text">Yan yana iki basit fonksiyon-makinesi düşün. Birincisi, adına $g$ diyelim, herhangi bir sayıyı alır ve 3 ekler. İkincisi, adına $f$ diyelim, herhangi bir sayıyı alır ve karesini alır. 5 sayısını önce $g$'ye besler ve sonucu $f$'ye iletirsek:</p>

<div class="calc-formula"><div class="formula-label">BORU HATTI: GİRDİ &rarr; g &rarr; ARA &rarr; f &rarr; ÇIKTI</div><div class="formula-main">$$5 \\;\\xrightarrow{\\;g\\;}\\; 5+3 = 8 \\;\\xrightarrow{\\;f\\;}\\; 8^2 = 64$$</div><div class="formula-sub">Önce $g$ uygula (3 ekle), sonra $f$ uygula (karesini al). Birleşik etki "3 ekle, sonra karesini al" — bunu $f(g(5)) = 64$ olarak yazarız.</div></div>

<p class="l-text">Sıra önemli! İşlemleri ters çevirseydik — önce karesini al, sonra 3 ekle — $5^2 + 3 = 28$ elde ederdik, tamamen farklı bir cevap. Bileşke genellikle <em>değişmeli değildir</em>: $f\\circ g$ ve $g\\circ f$ çoğu zaman birbirinden farklıdır. 4. bölümde bunu dikkatle inceleyeceğiz.</p>

<div class="calc-graph"><div id="plot-l43-pipeline-tr" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> üç kutulu bir boru hattı. Girdi $x$ ilk kutuya (<em>iç</em> fonksiyon $g$) girer, bir ara değer $u = g(x)$ üretir; bu ara değer ikinci kutuya (<em>dış</em> fonksiyon $f$) girer ve son çıktı $f(g(x))$ üretilir. Oklar akış yönünü gösterir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var boxes={x:[1,1,3,3,1,null,5,5,7,7,5,null,9,9,11,11,9],y:[0.5,1.5,1.5,0.5,0.5,null,0.5,1.5,1.5,0.5,0.5,null,0.5,1.5,1.5,0.5,0.5],mode:'lines',line:{color:'#3b82f6',width:2.5},name:'kutular',showlegend:false,hoverinfo:'skip'};
var arrows={x:[3,5,null,7,9],y:[1,1,null,1,1],mode:'lines',line:{color:'#f59e0b',width:2,dash:'dot'},name:'akış',showlegend:false,hoverinfo:'skip'};
var labels={x:[2,6,10,4,8,0.4,12],y:[1,1,1,1.75,1.75,1,1],mode:'text',text:['girdi x','iç g','dış f','&rarr;','&rarr;','x','f(g(x))'],textfont:{color:'#e8e8e8',size:13},showlegend:false,hoverinfo:'skip'};
var labels2={x:[6,10],y:[0.25,0.25],mode:'text',text:['u = g(x)','son çıktı'],textfont:{color:'rgba(235,230,220,0.65)',size:11},showlegend:false,hoverinfo:'skip'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.5,12.5],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-0.3,2.3],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'x',scaleratio:0.6},margin:{t:20,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l43-pipeline-tr',[boxes,arrows,labels,labels2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$g$ 2 ile çarpıyor ve $f$ 7 ekliyorsa, $f(g(5))$ önce 5'i ikiye katlar (10) sonra 7 ekler (17). Peki $g(f(5))$ kaç? Cevap: $f(5)=12$, sonra $g(12)=24$. Yani $f(g(5))=17$ ama $g(f(5))=24$ — farklı!</div></div>

<h2 class="lesson-title">2. (f &compfn; g)(x) = f(g(x)) Notasyonu</h2>

<div class="calc-highlight"><strong>Tek sembol, tek tanım.</strong> İki fonksiyon adı arasındaki küçük "&compfn;" daire "onları bileştir — sağdakini önce uygula" demektir. Sesli okurken "$f$ bileşke $g$" veya kısaca "$f$ of $g$" denir.</div>

<div class="calc-formula"><div class="formula-label">BİLEŞKE TANIMI</div><div class="formula-main">$$(f \\circ g)(x) \\;=\\; f(g(x))$$</div><div class="formula-sub">Sağdan sola oku: önce $g$, $x$'e uygulanır; sonuç $g(x)$ daha sonra $f$'ye verilir. $f$ fonksiyonuna <strong>dış</strong> fonksiyon, $g$'ye <strong>iç</strong> fonksiyon denir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dış fonksiyon $f$</div><div class="card-body">Dairenin <em>solundaki</em> fonksiyon. <strong>En son</strong> hareket eder. İç fonksiyonun ürettiğini girdi olarak alır.</div></div>
<div class="calc-card"><div class="card-title">İç fonksiyon $g$</div><div class="card-body">Dairenin <em>sağındaki</em> fonksiyon. <strong>İlk önce</strong> hareket eder. Asıl girdiyi ($x$'i) alır.</div></div>
<div class="calc-card"><div class="card-title">"&compfn;" sembolü</div><div class="card-body">Küçük bir boş halka. Çarpma "$\\cdot$" ile veya "o" harfiyle karıştırma. Yazılı matematikte "$\\circ$" şeklinde de görebilirsin.</div></div>
</div>

<p class="l-text"><strong>Aynı şeyi yazmanın iki yolu.</strong> $(f\\circ g)(x)$ ile $f(g(x))$ tam olarak aynı anlama gelir. Bazı ders kitapları birini, bazıları diğerini tercih eder. Bir bakışta ikisi arasında geçiş yapabilmelisin.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$f(x) = 2x + 1$ ve $g(x) = x^2$ olsun. $(f\\circ g)(3)$ ve $(g\\circ f)(3)$ değerlerini bul.<br><br><strong>Adım 1.</strong> $(f\\circ g)(3) = f(g(3))$. Önce $g(3) = 3^2 = 9$ hesaplanır. Sonra $f(9) = 2\\cdot 9 + 1 = 19$.<br><br><strong>Adım 2.</strong> $(g\\circ f)(3) = g(f(3))$. Önce $f(3) = 2\\cdot 3 + 1 = 7$. Sonra $g(7) = 7^2 = 49$.<br><br>Demek ki $(f\\circ g)(3) = 19$ ve $(g\\circ f)(3) = 49$. Farklı — sıra her şeydir.</div></div>

<div class="l-note"><strong>En sık yapılan öğrenci hatası</strong> $(f\\circ g)(x)$ ifadesini "önce $f$, sonra $g$" diye okumaktır çünkü $f$ önce yazılmıştır. Daire sağdan sola okunur, telefon numarası gibi "$f$ of $g$ of $x$" — $g$ girdi $x$'e en yakın olduğundan ilk önce $g$ hareket eder.</div>

<h2 class="lesson-title">3. Bileşkenin Tanım Kümesi</h2>

<div class="calc-highlight"><strong>Bileşkenin tanım kümesi her iki bileşene göre daha titizdir.</strong> $(f\\circ g)(x)$ ifadesinin anlamlı olması için iki koşul sağlanmalı: (i) $x$ $g$'nin tanım kümesinde olmalı, aksi halde $g(x)$ tanımlı bile değildir; ve (ii) $g(x)$ değeri $f$'nin tanım kümesinde olmalı, aksi halde $f$ onu girdi olarak kabul edemez.</div>

<div class="calc-formula"><div class="formula-label">$f \\circ g$'NİN TANIM KÜMESİ</div><div class="formula-main">$$\\text{Tan}(f \\circ g) \\;=\\; \\{\\, x \\in \\text{Tan}(g) \\;:\\; g(x) \\in \\text{Tan}(f) \\,\\}$$</div><div class="formula-sub">Sözlü: iç fonksiyon $g$'nin tanım kümesinden başla, sonra görüntüsü $g(x)$ dış fonksiyon $f$'yi çökertecek tüm $x$'leri at.</div></div>

<div class="calc-graph"><div id="plot-l43-domain-tr" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> iki çakışan dikdörtgen $\\text{Tan}(g)$ (solda) ve $g(x)\\in\\text{Tan}(f)$ olan $x$'leri (sağda) temsil ediyor. Kesişim — koyu orta bölge — bileşke $f\\circ g$'nin tanım kümesidir. Kesişimin dışındaki her şey hariç tutulur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var leftBox={x:[0,0,5,5,0],y:[0,2,2,0,0],fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'#3b82f6',width:2},mode:'lines',name:'Tan(g)',hoverinfo:'name'};
var rightBox={x:[3,3,8,8,3],y:[0,2,2,0,0],fill:'toself',fillcolor:'rgba(239,68,68,0.18)',line:{color:'#ef4444',width:2},mode:'lines',name:'{x : g(x)∈Tan(f)}',hoverinfo:'name'};
var midBox={x:[3,3,5,5,3],y:[0,2,2,0,0],fill:'toself',fillcolor:'rgba(245,158,11,0.5)',line:{color:'#f59e0b',width:2.5},mode:'lines',name:'Tan(f∘g) — kesişim',hoverinfo:'name'};
var labs={x:[1.5,4,6.5],y:[1,1,1],mode:'text',text:['Tan(g)<br>(g burada tanımlı)','Tan(f∘g)','g(x)∈Tan(f)<br>(f, g(x)\\'i alabilir)'],textfont:{color:'#e8e8e8',size:11},showlegend:false,hoverinfo:'skip'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.5,8.5],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-0.5,2.7],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'x',scaleratio:0.5},margin:{t:20,r:20,b:20,l:20},legend:{orientation:'h',y:-0.05,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l43-domain-tr',[leftBox,rightBox,midBox,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1 — PAYDA</div><div class="example-body">$f(x) = \\dfrac{1}{x}$ ve $g(x) = x - 4$ olsun. $(f\\circ g)(x)$'in tanım kümesini bul.<br><br>$(f\\circ g)(x) = f(g(x)) = f(x-4) = \\dfrac{1}{x-4}$.<br><br>$g$ her yerde tanımlı ($\\text{Tan}(g) = \\mathbb{R}$). $f$ ise $u \\neq 0$ olan tüm $u$ için tanımlı. Yani $g(x) \\neq 0$, yani $x - 4 \\neq 0$, yani $x \\neq 4$ olmalı.<br><br>Tanım kümesi: $\\boxed{\\mathbb{R} \\setminus \\{4\\}}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 — KAREKÖK</div><div class="example-body">$f(x) = \\sqrt{x}$ ve $g(x) = x - 5$ olsun. $(f\\circ g)(x)$'in tanım kümesini bul.<br><br>$(f\\circ g)(x) = \\sqrt{x - 5}$.<br><br>$g$ her yerde tanımlı. $f$ girdisinin $\\geq 0$ olmasını ister. Yani $g(x) \\geq 0$, yani $x - 5 \\geq 0$, yani $x \\geq 5$ olmalı.<br><br>Tanım kümesi: $\\boxed{[5, \\infty)}$.</div></div>

<div class="l-note"><strong>Dikkat edilmesi gereken bir nokta:</strong> $f(g(x))$ cebirsel sadeleştirmesi bazen orijinal kısıtlamayı <em>gizler</em>. Örneğin $f(x)=x^2$ ve $g(x)=\\sqrt{x}$ alırsak $(f\\circ g)(x) = (\\sqrt{x})^2 = x$ buluruz; bu her yerde tanımlı gibi görünür. Ama $g$ için $x \\geq 0$ şartı vardır, dolayısıyla bileşkenin tanım kümesi $[0,\\infty)$'dur — tüm $\\mathbb{R}$ değil. Her zaman önce iç fonksiyonu kontrol et.</div>

<h2 class="lesson-title">4. f &compfn; g &ne; g &compfn; f (Sıra Önemlidir)</h2>

<div class="calc-highlight"><strong>Bileşke değişmeli değildir.</strong> Toplama ($a+b = b+a$) veya çarpmanın ($ab = ba$) aksine, bileşke sırası genellikle sonucu değiştirir. $f\\circ g$ ve $g\\circ f$ genelde <em>farklı fonksiyonlardır</em>.</div>

<p class="l-text">Neden? Çünkü "önce 3 ekle sonra kare al" ile "önce kare al sonra 3 ekle" farklı kurallar üretir. Bunu iki kısa örnekle, hem cebirsel hem sayısal olarak doğrulayalım.</p>

<div class="calc-example"><div class="example-label">ÖRNEK A — POLİNOM DURUMU</div><div class="example-body">$f(x) = x + 3$, $g(x) = x^2$.<br><br>$(f\\circ g)(x) = f(g(x)) = f(x^2) = x^2 + 3$.<br>$(g\\circ f)(x) = g(f(x)) = g(x+3) = (x+3)^2 = x^2 + 6x + 9$.<br><br>$x=2$'de: $(f\\circ g)(2) = 7$ ama $(g\\circ f)(2) = 25$. Tamamen farklı fonksiyonlar.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK B — RASYONEL DURUM</div><div class="example-body">$f(x) = \\dfrac{1}{x}$, $g(x) = x + 1$.<br><br>$(f\\circ g)(x) = f(x+1) = \\dfrac{1}{x+1}$ ($x \\neq -1$ için tanımlı).<br>$(g\\circ f)(x) = g(1/x) = \\dfrac{1}{x} + 1 = \\dfrac{1+x}{x}$ ($x \\neq 0$ için tanımlı).<br><br><em>Tanım kümeleri</em> bile farklı — biri $-1$'i, diğeri $0$'ı dışlar. İki bileşke kesinlikle aynı fonksiyon değildir.</div></div>

<div class="calc-graph"><div id="plot-l43-noncomm-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $f(x)=x+3$ ve $g(x)=x^2$ için $(f\\circ g)(x) = x^2 + 3$ ile $(g\\circ f)(x) = (x+3)^2$ grafiklerini aynı eksende. İkisi yalnızca tek bir noktada kesişir, geri kalan her yerde ayrılır — $f\\circ g \\neq g\\circ f$ olduğunun görsel kanıtı.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var fg=[];var gf=[];for(var i=0;i<=100;i++){var x=-5+10*i/100;xs.push(x);fg.push(x*x+3);gf.push((x+3)*(x+3));}
var tr1={x:xs,y:fg,mode:'lines',name:'(f∘g)(x) = x² + 3',line:{color:'#3b82f6',width:2.5}};
var tr2={x:xs,y:gf,mode:'lines',name:'(g∘f)(x) = (x+3)²',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-2,50],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l43-noncomm-tr',[tr1,tr2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Ne zaman $f\\circ g = g\\circ f$ olur?</strong> Yalnızca özel durumlarda — örneğin $f$ ve $g$ birbirinin tersiyse (o zaman her iki bileşke birim fonksiyon $I(x)=x$'e eşittir), ya da her ikisi de katsayıları özenle eşleşmiş $ax+b$ biçiminde doğrusal ise. <em>Genel olarak</em> farklı olduklarını varsay.</p>

<h2 class="lesson-title">5. Bileşke Hesaplama — Çözümlü Örnekler</h2>

<div class="calc-highlight"><strong>Mekanik her zaman aynıdır:</strong> dış fonksiyon $f$ içindeki $x$'in her görüldüğü yere $g(x)$ ifadesinin tamamını yerleştir. Sonra sadeleştir. Tüm yöntem bu. Kas hafızasına yerleşene kadar pratik yap.</div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — DOĞRUSALIN İÇİNE POLİNOM</div><div class="example-body">$f(x) = 3x - 2$ ve $g(x) = x^2 + 1$ olsun. $(f\\circ g)(x)$'i bul.<br><br>$(f\\circ g)(x) = f(g(x)) = f(x^2+1) = 3(x^2+1) - 2 = 3x^2 + 3 - 2 = \\boxed{3x^2 + 1}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — DOĞRUSALIN İÇİNE KAREKÖK</div><div class="example-body">$f(x) = \\sqrt{x}$ ve $g(x) = 2x + 5$ olsun. $(f\\circ g)(x)$'i ve tanım kümesini bul.<br><br>$(f\\circ g)(x) = \\sqrt{2x+5}$.<br><br>Tanım kümesi: $2x+5 \\geq 0$ olmalı, yani $x \\geq -\\dfrac{5}{2}$. Tanım kümesi: $\\left[-\\dfrac{5}{2}, \\infty\\right)$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — RASYONELİN İÇİNE DOĞRUSAL</div><div class="example-body">$f(x) = \\dfrac{1}{x+2}$ ve $g(x) = x - 3$ olsun. $(f\\circ g)(x)$'i bul.<br><br>$(f\\circ g)(x) = f(x-3) = \\dfrac{1}{(x-3) + 2} = \\dfrac{1}{x-1}$.<br><br>Tanım kümesi: $x \\neq 1$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — TABLODAN BİLEŞKE</div><div class="example-body">Tablonun verdiği değerler: $f(1)=4,\\; f(2)=7,\\; f(3)=1,\\; f(4)=5$ ve $g(1)=3,\\; g(2)=1,\\; g(3)=4,\\; g(4)=2$. $(f\\circ g)(2)$, $(g\\circ f)(1)$, $(f\\circ f)(3)$ değerlerini hesapla.<br><br>$(f\\circ g)(2) = f(g(2)) = f(1) = 4$.<br>$(g\\circ f)(1) = g(f(1)) = g(4) = 2$.<br>$(f\\circ f)(3) = f(f(3)) = f(1) = 4$.<br><br>Tablo içeren sınav sorularında bileşke çoğunlukla böyle görünür — saf tablo okuması, her defasında iki adım.</div></div>

<h2 class="lesson-title">6. Ayrıştırma: h = f &compfn; g Olarak Yazma</h2>

<div class="calc-highlight"><strong>Tersine işlem: $h$ veriliyor, $h = f\\circ g$ olacak $f$ ve $g$'yi bul.</strong> Bu, geliştirebileceğin en faydalı cebirsel becerilerden biri — gelecekteki kalkülüs öğrencisi haline, türev alırken zincir kuralını tam olarak nasıl uygulayacağını söyler.</div>

<p class="l-text">İpucu şu: $h(x)$'e bak ve sor: "Üzerinde işlem yapılan <em>en içteki blok</em> nedir?" O blok $g(x)$'tir. Dış sarmalayıcının o bloka yaptığı şey de $f$'dir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — KAREKÖK SARMALAYICISI</div><div class="example-body">$h(x) = \\sqrt{3x + 7}$ fonksiyonunu $f\\circ g$ olarak ayrıştır.<br><br>Karekök alınan iç blok $3x+7$. Yani $g(x) = 3x+7$. Dış sarmalayıcı karekök aldığından $f(u) = \\sqrt{u}$.<br><br>Kontrol: $f(g(x)) = f(3x+7) = \\sqrt{3x+7}$. ✓</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — KUVVET SARMALAYICISI</div><div class="example-body">$h(x) = (x^2 - 4)^5$ ifadesini ayrıştır.<br><br>En içteki blok: $x^2 - 4$. Yani $g(x) = x^2 - 4$. Dış sarmalayıcı: beşinci kuvvete yükseltme, yani $f(u) = u^5$.<br><br>Kontrol: $f(g(x)) = (x^2-4)^5$. ✓</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — RASYONEL SARMALAYICI</div><div class="example-body">$h(x) = \\dfrac{1}{2x - 9}$ ifadesini ayrıştır.<br><br>En içteki blok: $2x - 9$. Yani $g(x) = 2x-9$. Dış sarmalayıcı: tersini al, yani $f(u) = 1/u$.<br><br>Kontrol: $f(g(x)) = \\dfrac{1}{2x-9}$. ✓</div></div>

<div class="l-note"><strong>Ayrıştırmalar tek değildir.</strong> $h(x) = (x^2-4)^5$ ifadesi $g(x) = (x^2-4)^5$ ile $f(u)=u$ olarak (önemsiz — dış birim) veya $g(x)=x^2$ ve $f(u) = (u-4)^5$ olarak da bölünebilir (yine geçerli). "En iyi" ayrım genellikle dış $f$'nin mümkün olduğunca basit olduğu — tipik olarak bir kuvvet, karekök veya çarpmaya tersi olan — ayrımdır.</div>

<h2 class="lesson-title">7. Üçlü Bileşke: f &compfn; g &compfn; h</h2>

<div class="calc-highlight"><strong>Arka arkaya üç fonksiyon — sağdan sola çalış.</strong> $(f\\circ g\\circ h)(x) = f(g(h(x)))$ notasyonu şu demektir: önce $h$ uygula, sonra $g$, sonra $f$. Dizi halinde üç makine.</div>

<div class="calc-formula"><div class="formula-label">ÜÇLÜ BİLEŞKE</div><div class="formula-main">$$(f \\circ g \\circ h)(x) \\;=\\; f\\big(g(h(x))\\big)$$</div><div class="formula-sub">Sağdan sola oku: $h$ önce $x$'e etki eder, sonra $g$ $h(x)$'e etki eder, sonra $f$ $g(h(x))$'e etki eder. Bileşke <em>birleşmelidir</em>: $(f\\circ g)\\circ h = f\\circ(g\\circ h)$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ÜÇLÜ BİLEŞKE</div><div class="example-body">$f(x) = x + 1$, $g(x) = 2x$, $h(x) = x^2$ olsun. $(f\\circ g\\circ h)(3)$ değerini bul.<br><br><strong>Adım 1.</strong> $h(3) = 3^2 = 9$.<br><strong>Adım 2.</strong> $g(9) = 2 \\cdot 9 = 18$.<br><strong>Adım 3.</strong> $f(18) = 18 + 1 = 19$.<br><br>Demek ki $(f\\circ g\\circ h)(3) = \\boxed{19}$. Her adım önceki adımın çıktısını kullanır.</div></div>

<div class="calc-example"><div class="example-label">AYNI BİLEŞKE, CEBİRSEL BİÇİM</div><div class="example-body">Aynı $f, g, h$ ile $(f\\circ g\\circ h)(x)$ formülünü bul.<br><br>$h(x) = x^2$.<br>$g(h(x)) = g(x^2) = 2x^2$.<br>$f(g(h(x))) = f(2x^2) = 2x^2 + 1$.<br><br>Sonuç: $(f\\circ g\\circ h)(x) = \\boxed{2x^2 + 1}$. $x=3$'te kontrol: $2\\cdot 9 + 1 = 19$. ✓</div></div>

<p class="l-text"><strong>Birleşme özelliği gerçek ve kullanışlıdır.</strong> $(f\\circ g)\\circ h$, $f\\circ(g\\circ h)$ ile eşit olduğu için, istediğin gibi gruplandırabilirsin — önce $f\\circ g$'yi eşle ve sonra $h$ ile bileştir, ya da $g\\circ h$'yi eşle ve $f$'ye besle. Her iki rota da aynı son fonksiyona iniş yapar. Bu özgürlük çoğu zaman ayrıştırma alıştırmalarını basitleştirir.</p>

<h2 class="lesson-title">8. Birim Fonksiyon I(x) = x</h2>

<div class="calc-highlight"><strong>Her cebirsel yapının bir "hiçbir şey yapmayan" elemanı vardır.</strong> Toplama için bu $0$'dır (çünkü $a + 0 = a$). Çarpma için $1$'dir (çünkü $a \\cdot 1 = a$). Fonksiyon bileşkesi için ise <em>birim fonksiyondur</em>, $I(x) = x$ — kendisine verilen girdiyi değiştirmeden geri döndüren fonksiyon.</div>

<div class="calc-formula"><div class="formula-label">BİRİM FONKSİYON VE ÖZELLİĞİ</div><div class="formula-main">$$I(x) = x \\quad\\Longrightarrow\\quad f \\circ I \\;=\\; I \\circ f \\;=\\; f$$</div><div class="formula-sub">Herhangi bir $f$ fonksiyonunu birim ile (her iki taraftan) bileştirmek $f$'yi değiştirmeden geri verir. Birim, bileşke için nötr elemandır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$f(x) = 3x + 5$ ve $I(x) = x$ olsun. $f\\circ I = I\\circ f = f$ olduğunu doğrula.<br><br>$(f\\circ I)(x) = f(I(x)) = f(x) = 3x+5$. ✓<br>$(I\\circ f)(x) = I(f(x)) = f(x) = 3x+5$. ✓<br><br>Her iki yön de $f$'yi geri verir — birim hiçbir şey yapmaz.</div></div>

<p class="l-text"><strong>Ters fonksiyonlara hazırlık.</strong> İki fonksiyon $f$ ve $g$, ancak ve ancak bileşkeleri (her iki sırada da) birim fonksiyon olduğunda birbirinin <em>tersi</em> olarak adlandırılır: $f\\circ g = g\\circ f = I$. Ters fonksiyonları sonraki bir derste inceleyeceğiz; şimdilik birimin, iki yarımın üretmek için birleşmesi gereken "hedef" olduğunu fark etmek yeterli.</p>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — BİR SAYIDA TEMEL BİLEŞKE</div><div class="example-body"><strong>$f(x) = x^2 - 1$ ve $g(x) = 3x + 2$ olsun. $(f\\circ g)(4)$ ve $(g\\circ f)(4)$ hesapla.</strong><br><br>$(f\\circ g)(4) = f(g(4)) = f(14) = 14^2 - 1 = 195$.<br>$(g\\circ f)(4) = g(f(4)) = g(15) = 3\\cdot 15 + 2 = 47$.<br><br>Cevap: <strong>$(f\\circ g)(4) = 195$, $(g\\circ f)(4) = 47$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — BİLEŞKE FORMÜLÜ</div><div class="example-body"><strong>$f(x) = 2x + 3$ ve $g(x) = x - 5$ olsun. $(f\\circ g)(x)$ ve $(g\\circ f)(x)$ bul.</strong><br><br>$(f\\circ g)(x) = f(x-5) = 2(x-5) + 3 = 2x - 10 + 3 = 2x - 7$.<br>$(g\\circ f)(x) = g(2x+3) = (2x+3) - 5 = 2x - 2$.<br><br>Cevap: <strong>$2x-7$ ve $2x-2$</strong> — farklı doğrusal fonksiyonlar.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — BİLEŞKENİN TANIM KÜMESİ</div><div class="example-body"><strong>$f(x) = \\sqrt{x}$ ve $g(x) = 9 - x^2$ olsun. $(f\\circ g)(x)$'in tanım kümesini bul.</strong><br><br>$(f\\circ g)(x) = \\sqrt{9 - x^2}$. $9 - x^2 \\geq 0$, yani $x^2 \\leq 9$, yani $-3 \\leq x \\leq 3$ gerekir.<br><br>Cevap: <strong>$[-3, 3]$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — AYRIŞTIRMA</div><div class="example-body"><strong>$h(x) = (4x - 1)^3$ ifadesini $f\\circ g$ olarak ayrıştır.</strong><br><br>En içteki blok: $4x-1$. Yani $g(x) = 4x - 1$. Dış sarmalayıcı: küp alma, yani $f(u) = u^3$.<br><br>Cevap: <strong>$f(u) = u^3$, $g(x) = 4x-1$</strong>. Kontrol: $f(g(x)) = (4x-1)^3$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — RASYONEL AYRIŞTIRMA</div><div class="example-body"><strong>$h(x) = \\dfrac{2}{\\sqrt{x+3}}$ ifadesini $f\\circ g$ olarak ayrıştır.</strong><br><br>En içteki blok: $x+3$. Yani $g(x) = x+3$. Dış sarmalayıcı: karekök al, tersini al, iki katına çıkar — yani $f(u) = \\dfrac{2}{\\sqrt{u}}$.<br><br>Cevap: <strong>$f(u) = 2/\\sqrt{u}$, $g(x) = x+3$</strong>. (İstersen üç parçaya daha ayırabilirsin — üçlü bileşkeye bak.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — BİR SAYIDA ÜÇLÜ BİLEŞKE</div><div class="example-body"><strong>$f(x) = x + 4$, $g(x) = x^2$, $h(x) = x - 1$ olsun. $(f\\circ g\\circ h)(3)$ hesapla.</strong><br><br>$h(3) = 3 - 1 = 2$. Sonra $g(2) = 4$. Sonra $f(4) = 8$.<br><br>Cevap: <strong>8</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — TABLODAN</div><div class="example-body"><strong>Verilen:</strong> $f(1)=2,\\;f(2)=5,\\;f(3)=4,\\;f(4)=3,\\;f(5)=1$ ve $g(1)=4,\\;g(2)=3,\\;g(3)=5,\\;g(4)=2,\\;g(5)=1$. <strong>$(f\\circ g)(2)$, $(g\\circ f)(2)$, $(f\\circ f)(1)$, $(g\\circ g)(4)$ hesapla.</strong><br><br>$(f\\circ g)(2) = f(g(2)) = f(3) = 4$.<br>$(g\\circ f)(2) = g(f(2)) = g(5) = 1$.<br>$(f\\circ f)(1) = f(f(1)) = f(2) = 5$.<br>$(g\\circ g)(4) = g(g(4)) = g(2) = 3$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — f VE f &compfn; g VERİLDİĞİNDE g'Yİ BUL</div><div class="example-body"><strong>$f(x) = 2x + 1$ ve $(f\\circ g)(x) = 6x - 3$ ise, $g(x)$'i bul.</strong><br><br>$f(g(x)) = 2g(x) + 1 = 6x - 3$ elimizdedir. $g(x)$'i çöz:<br>$2g(x) = 6x - 4$, yani $g(x) = 3x - 2$.<br><br>Cevap: <strong>$g(x) = 3x - 2$</strong>. Kontrol: $f(3x-2) = 2(3x-2) + 1 = 6x - 4 + 1 = 6x - 3$. ✓</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tanım: $(f\\circ g)(x) = f(g(x))$ — sağdan sola oku (önce $g$, sonra $f$)</li>
<li>$f$ <em>dış</em>, $g$ <em>iç</em> fonksiyon; iç blok $x$'e en yakın olandır</li>
<li>Tanım kümesi: $x$ $\\text{Tan}(g)$'de olmalı <em>ve</em> $g(x)$ $\\text{Tan}(f)$'de olmalı</li>
<li>Bileşke <strong>değişmeli değildir</strong>: $f\\circ g \\neq g\\circ f$ genellikle — sıra önemlidir</li>
<li>Bileşkeyi hesaplamak için, $f$'deki her $x$ yerine tüm $g(x)$ ifadesini koy, sonra sadeleştir</li>
<li>$h = f\\circ g$ olarak ayrıştırmak için en içteki bloku ($g$) ve dış sarmalayıcıyı ($f$) bul</li>
<li>Üçlü bileşke $f\\circ g\\circ h$ sağdan sola hesaplanır ve birleşmelidir</li>
<li>Birim $I(x) = x$ nötr elemandır: $f\\circ I = I\\circ f = f$</li>
</ul>
</div>`
};
