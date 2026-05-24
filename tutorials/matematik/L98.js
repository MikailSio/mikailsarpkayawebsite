window.LISE_MAT_L98 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>How many different ways can you arrange five books on a shelf?</strong> How many distinct three-letter passwords can you build from the alphabet without repeating a letter? How many seating orders are there around a round table of six people? Each of these questions is a counting question, and each one belongs to a single, surprisingly clean corner of mathematics called <em>permutations</em>. This lesson teaches you the rules for counting ordered arrangements — the language of probability, cryptography, scheduling, and many of the contest problems on your university-entrance exam.</p>

<p class="l-text">By the end of this lesson you will know exactly when to multiply, when to divide, and when factorials enter the picture. You will be able to count arrangements of distinct objects, of objects chosen from a larger pool, of objects with repetitions allowed, of objects where some items are identical, and of objects arranged around a circle. These five patterns cover almost every permutation problem you will ever meet in a Turkish high-school setting or a YKS-style question.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State and apply the <em>multiplication principle of counting</em> for sequential choices</li>
<li>Define the factorial $n!$ and compute it for small $n$, including the convention $0! = 1$</li>
<li>Count permutations of $n$ distinct objects ($n!$) and of $r$ chosen from $n$ ($P(n,r) = n!/(n-r)!$)</li>
<li>Handle two special cases: <em>repetitions allowed</em> ($n^r$) and <em>identical objects in groups</em> ($n!/n_1!n_2!\\cdots n_k!$)</li>
<li>Count circular arrangements of $n$ people as $(n-1)!$ and explain why we divide by $n$</li>
<li>Recognise common pitfalls: forgetting $0! = 1$, confusing $P(n,r)$ with $C(n,r)$, mishandling order</li>
</ul>
</div>

<h2 class="lesson-title">1. The Multiplication Principle of Counting</h2>

<div class="calc-highlight"><strong>One rule underlies every permutation formula in this lesson:</strong> if a task can be broken into independent steps and step $i$ can be done in $n_i$ ways, then the whole task can be done in $n_1 \\cdot n_2 \\cdot \\, \\cdots \\, \\cdot n_k$ ways. Multiplying the choices is the heart of counting.</div>

<p class="l-text">Imagine you are choosing an outfit. You own 3 shirts and 4 pairs of trousers. How many distinct outfits can you put together? For every shirt you can choose any of the 4 trousers, so the count is $3 \\times 4 = 12$. We did not list every outfit — we observed that the choice of shirt and the choice of trousers are <em>independent</em>, and we multiplied.</p>

<div class="calc-formula"><div class="formula-label">MULTIPLICATION PRINCIPLE</div><div class="formula-main">$$N \\;=\\; n_1 \\cdot n_2 \\cdot n_3 \\cdot \\, \\cdots \\, \\cdot n_k$$</div><div class="formula-sub">If a sequence of $k$ independent choices is made and the $i$-th choice has $n_i$ options, the total number of distinct outcomes is the product of all the $n_i$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A cafeteria menu offers <strong>4 soups, 6 main courses, and 3 desserts</strong>. How many different three-course meals can a customer compose?<br><br>The three choices are independent. By the multiplication principle:<br><br>$4 \\times 6 \\times 3 = \\mathbf{72}$ different meals.</div></div>

<div class="calc-graph"><div id="plot-l98-tree-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a tree diagram for arranging the three letters A, B, C in a row. The first level offers 3 choices, the second 2 (one letter is used up), the third 1. Counting the leaves at the bottom gives $3 \\cdot 2 \\cdot 1 = 6$ distinct orderings.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nodes=[{x:0,y:0,label:'start'}];
var level1=['A','B','C'];
var lvl1pos=[];
for(var i=0;i<3;i++){var x=(i-1)*4;var y=-2;lvl1pos.push({x:x,y:y,label:level1[i]});nodes.push({x:x,y:y,label:level1[i]});}
var lvl2pos=[];
var leaves=[];
for(var i=0;i<3;i++){var parent=lvl1pos[i];var others=level1.filter(function(L){return L!==level1[i];});for(var j=0;j<2;j++){var x=parent.x+(j-0.5)*1.6;var y=-4;lvl2pos.push({x:x,y:y,label:others[j],parent:parent});nodes.push({x:x,y:y,label:others[j]});var third=level1.filter(function(L){return L!==level1[i]&&L!==others[j];})[0];leaves.push({x:x,y:-6,label:level1[i]+others[j]+third,parent:{x:x,y:y}});}}
var edges={x:[],y:[],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1.2},showlegend:false,hoverinfo:'skip'};
for(var i=0;i<lvl1pos.length;i++){edges.x.push(0,lvl1pos[i].x,null);edges.y.push(0,lvl1pos[i].y,null);}
for(var i=0;i<lvl2pos.length;i++){var p=lvl2pos[i];edges.x.push(p.parent.x,p.x,null);edges.y.push(p.parent.y,p.y,null);}
for(var i=0;i<leaves.length;i++){var p=leaves[i];edges.x.push(p.parent.x,p.x,null);edges.y.push(p.parent.y,p.y,null);}
var rootNode={x:[0],y:[0],mode:'markers+text',name:'root',marker:{color:'#3b82f6',size:18},text:['start'],textposition:'top center',textfont:{color:'#e8e8e8',size:11},showlegend:false};
var l1x=lvl1pos.map(function(p){return p.x;});var l1y=lvl1pos.map(function(p){return p.y;});var l1t=lvl1pos.map(function(p){return p.label;});
var l1Node={x:l1x,y:l1y,mode:'markers+text',name:'choice 1',marker:{color:'#3b82f6',size:14},text:l1t,textposition:'middle right',textfont:{color:'#e8e8e8',size:12}};
var l2x=lvl2pos.map(function(p){return p.x;});var l2y=lvl2pos.map(function(p){return p.y;});var l2t=lvl2pos.map(function(p){return p.label;});
var l2Node={x:l2x,y:l2y,mode:'markers+text',name:'choice 2',marker:{color:'#10b981',size:12},text:l2t,textposition:'middle right',textfont:{color:'#e8e8e8',size:11}};
var leafx=leaves.map(function(p){return p.x;});var leafy=leaves.map(function(p){return p.y;});var leaft=leaves.map(function(p){return p.label;});
var leafNode={x:leafx,y:leafy,mode:'markers+text',name:'arrangement',marker:{color:'#f59e0b',size:11},text:leaft,textposition:'bottom center',textfont:{color:'#f59e0b',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-7,7],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-7,1.2],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:-6.3,y:0,text:'3 choices',showarrow:false,font:{color:'#3b82f6',size:11}},{x:-6.3,y:-2,text:'2 choices',showarrow:false,font:{color:'#10b981',size:11}},{x:-6.3,y:-4,text:'1 choice',showarrow:false,font:{color:'#f59e0b',size:11}},{x:0,y:-6.8,text:'6 distinct orderings: ABC, ACB, BAC, BCA, CAB, CBA',showarrow:false,font:{color:'rgba(235,230,220,0.7)',size:11}}]};
Plotly.newPlot('plot-l98-tree-en',[edges,rootNode,l1Node,l2Node,leafNode],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">A car license plate uses 2 letters followed by 3 digits, with no restriction (repetitions allowed, all 26 letters and all 10 digits). How many different plates can be issued? Answer: $26 \\times 26 \\times 10 \\times 10 \\times 10 = 676\\,000$.</div></div>

<h2 class="lesson-title">2. The Factorial: $n!$</h2>

<div class="calc-highlight"><strong>Most permutation formulas use the factorial</strong>, written $n!$ and read "n factorial". It is the product of all positive integers from 1 up to $n$. Factorials grow extraordinarily fast — by $n = 10$ we are already past three million.</div>

<div class="calc-formula"><div class="formula-label">DEFINITION OF $n!$</div><div class="formula-main">$$n! \\;=\\; n \\cdot (n-1) \\cdot (n-2) \\cdot \\, \\cdots \\, \\cdot 3 \\cdot 2 \\cdot 1$$</div><div class="formula-sub">Recursive form: $n! = n \\cdot (n-1)!$ for $n \\geq 1$. Special convention: $0! = 1$ (an empty product equals 1).</div></div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$n$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$n!$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Computation</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">0</td><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">empty product (convention)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">1</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">$2 \\cdot 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">3</td><td style="padding:0.5rem 0.8rem">6</td><td style="padding:0.5rem 0.8rem">$3 \\cdot 2 \\cdot 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">4</td><td style="padding:0.5rem 0.8rem">24</td><td style="padding:0.5rem 0.8rem">$4 \\cdot 3 \\cdot 2 \\cdot 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">5</td><td style="padding:0.5rem 0.8rem">120</td><td style="padding:0.5rem 0.8rem">$5 \\cdot 4!$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">6</td><td style="padding:0.5rem 0.8rem">720</td><td style="padding:0.5rem 0.8rem">$6 \\cdot 5!$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">7</td><td style="padding:0.5rem 0.8rem">5040</td><td style="padding:0.5rem 0.8rem">$7 \\cdot 6!$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">8</td><td style="padding:0.5rem 0.8rem">40 320</td><td style="padding:0.5rem 0.8rem">$8 \\cdot 7!$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">9</td><td style="padding:0.5rem 0.8rem">362 880</td><td style="padding:0.5rem 0.8rem">$9 \\cdot 8!$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">10</td><td style="padding:0.5rem 0.8rem">3 628 800</td><td style="padding:0.5rem 0.8rem">$10 \\cdot 9!$</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l98-factorial-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $n!$ plotted as a bar chart for $n = 0$ to $7$. Notice the explosive growth — by $n = 7$ we already have 5040, and by $n = 10$ over 3.6 million. Factorials outpace exponential functions for large $n$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[0,1,2,3,4,5,6,7];
var fs=[1,1,2,6,24,120,720,5040];
var bar={x:ns,y:fs,type:'bar',name:'n!',marker:{color:'#3b82f6',line:{color:'rgba(255,255,255,0.2)',width:1}},text:fs.map(String),textposition:'outside',textfont:{color:'#e8e8e8',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'n!',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,6000]},margin:{t:30,r:30,b:50,l:60},showlegend:false};
Plotly.newPlot('plot-l98-factorial-en',[bar],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why $0! = 1$:</strong> three good reasons. (1) The product over an <em>empty</em> set is conventionally 1 (just as the sum over an empty set is 0). (2) The recursion $n! = n \\cdot (n-1)!$ at $n = 1$ gives $1 = 1 \\cdot 0!$, forcing $0! = 1$. (3) Permutation formulas like $P(n,n) = n!/0!$ would otherwise fail. Accept the convention and move on.</div>

<h2 class="lesson-title">3. Permutations of $n$ Distinct Objects</h2>

<div class="calc-highlight"><strong>The simplest permutation question:</strong> how many ways can $n$ distinct objects be arranged in a row? Answer: $n$ choices for the first slot, $n - 1$ for the second (one object is used), $n - 2$ for the third, and so on down to 1 for the last slot. Multiply: $n!$.</div>

<div class="calc-formula"><div class="formula-label">PERMUTATIONS OF $n$ DISTINCT OBJECTS</div><div class="formula-main">$$P_n \\;=\\; n!$$</div><div class="formula-sub">There are exactly $n!$ distinct orderings of $n$ different items in a line. The order matters.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">In how many ways can <strong>5 different books</strong> be arranged on a shelf?<br><br>By the formula: $P_5 = 5! = 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = \\mathbf{120}$ different arrangements.<br><br>Reasoning: 5 choices for the leftmost spot, 4 for the next, 3 for the next, 2 for the next, 1 for the last. $5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 120$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A class of 7 students must line up for a photograph. How many different line-ups are possible?<br><br>$7! = 5040$. <strong>Five thousand and forty</strong> possibilities. This is why "line up randomly" almost never reproduces.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If you had only 3 books, you would have $3! = 6$ arrangements. If you had 10 books, the count would be $10! = 3\\,628\\,800$. Notice how adding one item multiplies the count by the new size.</div></div>

<h2 class="lesson-title">4. Permutations of $r$ Items Chosen from $n$</h2>

<div class="calc-highlight"><strong>Sometimes you do not arrange every object — you choose only $r$ of them and arrange those.</strong> Example: from 10 sprinters, the first, second, and third places give a podium of 3. Order matters (gold beats silver beats bronze) but only 3 of the 10 are picked. This is the permutation $P(n, r)$, also written $nPr$.</div>

<div class="calc-formula"><div class="formula-label">PERMUTATIONS OF $r$ FROM $n$</div><div class="formula-main">$$P(n, r) \\;=\\; \\frac{n!}{(n - r)!} \\;=\\; n \\cdot (n-1) \\cdot \\, \\cdots \\, \\cdot (n - r + 1)$$</div><div class="formula-sub">The product is exactly $r$ consecutive descending integers starting from $n$. Equivalently, divide $n!$ by the factorial of the leftover items.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">In a 10-runner race, how many different ways can <strong>first, second, and third</strong> place be filled?<br><br>$P(10, 3) = \\dfrac{10!}{7!} = 10 \\cdot 9 \\cdot 8 = \\mathbf{720}$ podium orderings.<br><br>You can compute it either as the product of 3 descending integers ($10 \\cdot 9 \\cdot 8$) or as the factorial ratio. Both give 720.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">From the 26 letters of the English alphabet, how many <strong>3-letter codes</strong> can be formed if no letter repeats?<br><br>$P(26, 3) = 26 \\cdot 25 \\cdot 24 = \\mathbf{15\\,600}$ codes.<br><br>Order matters (ABC differs from BCA). No repetition (since "no letter repeats"). This is exactly $P(n, r)$.</div></div>

<div class="l-note"><strong>$P(n, r)$ versus $C(n, r)$:</strong> in permutations $P(n, r)$ order matters; in combinations $C(n, r) = \\binom{n}{r}$ it does not. Combinations $C(n, r) = P(n, r) / r!$ because $r!$ different orderings of the same chosen set all collapse to one combination. Lesson 99 covers combinations in detail.</div>

<h2 class="lesson-title">5. Permutations With Repetition Allowed</h2>

<div class="calc-highlight"><strong>If repetition is allowed</strong> — for example, the same digit may appear twice in a PIN — the analysis is simpler. Each of the $r$ slots offers all $n$ options independently, so the multiplication principle gives $n^r$ outcomes.</div>

<div class="calc-formula"><div class="formula-label">PERMUTATIONS WITH REPETITION</div><div class="formula-main">$$P^{\\text{rep}}(n, r) \\;=\\; n^r$$</div><div class="formula-sub">$r$ ordered slots, each with $n$ choices, with reuse permitted. Sometimes called "ordered selection with replacement".</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">How many different <strong>4-digit PINs</strong> exist if each digit 0&ndash;9 can appear, with repetitions allowed?<br><br>$P^{\\text{rep}}(10, 4) = 10^4 = \\mathbf{10\\,000}$. From 0000 to 9999 inclusive.<br><br>If repetition were forbidden, the count would be $P(10, 4) = 10 \\cdot 9 \\cdot 8 \\cdot 7 = 5040$ — about half as many, because most "good" PINs would forbid repeats.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A binary string of length 8: how many different sequences exist?<br><br>$2^8 = \\mathbf{256}$ distinct strings, from 00000000 through 11111111. This is also why one byte stores 256 different values.</div></div>

<h2 class="lesson-title">6. Permutations With Identical Objects</h2>

<div class="calc-highlight"><strong>When some of the objects are identical, naive use of $n!$ overcounts.</strong> Two letters "S" that swap places give the same word, so we must divide by the number of ways those identicals can be rearranged among themselves. If the $n$ items split into $k$ groups of sizes $n_1, n_2, \\ldots, n_k$ (all identical within each group), the count of distinct arrangements is:</div>

<div class="calc-formula"><div class="formula-label">PERMUTATIONS WITH IDENTICAL GROUPS</div><div class="formula-main">$$P^{\\text{id}} \\;=\\; \\frac{n!}{n_1! \\, n_2! \\, \\cdots \\, n_k!}$$</div><div class="formula-sub">Total slots $n = n_1 + n_2 + \\cdots + n_k$. Each $n_i$ is the count of one identical group. Dividing removes the internal rearrangements that produce the same visible word.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">How many distinct rearrangements of the letters in <strong>MISSISSIPPI</strong> are there?<br><br>11 letters total. Count letter frequencies: M = 1, I = 4, S = 4, P = 2.<br><br>$\\dfrac{11!}{1! \\, 4! \\, 4! \\, 2!} = \\dfrac{39\\,916\\,800}{1 \\cdot 24 \\cdot 24 \\cdot 2} = \\dfrac{39\\,916\\,800}{1152} = \\mathbf{34\\,650}$.<br><br>If all 11 letters were distinct we would have $11! = 39\\,916\\,800$ — about 1150 times more. Most of those orderings collapse together because the I's and S's are indistinguishable.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">How many distinct arrangements of <strong>BANANA</strong> exist?<br><br>6 letters. B = 1, A = 3, N = 2.<br><br>$\\dfrac{6!}{1! \\, 3! \\, 2!} = \\dfrac{720}{1 \\cdot 6 \\cdot 2} = \\dfrac{720}{12} = \\mathbf{60}$ arrangements.</div></div>

<div class="l-note"><strong>Quick sanity check:</strong> if all groups have size 1 (all objects distinct), the denominator is $1! \\cdot 1! \\cdot \\, \\cdots \\, = 1$ and we recover $n!$ from the formula. So this formula contains the basic permutation as a special case.</div>

<h2 class="lesson-title">7. Circular Permutations</h2>

<div class="calc-highlight"><strong>When arranging $n$ people around a round table, rotations of the same seating count as the same arrangement.</strong> A linear formula $n!$ overcounts by a factor of $n$ (the number of distinct rotations). Therefore the number of <em>circular permutations</em> is $(n-1)!$.</div>

<div class="calc-formula"><div class="formula-label">CIRCULAR PERMUTATIONS</div><div class="formula-main">$$P^{\\text{circ}}(n) \\;=\\; (n - 1)!$$</div><div class="formula-sub">$n$ distinct people, around a round table, with rotational equivalence. Fix one person's seat and arrange the other $n-1$ in $(n-1)!$ ways.</div></div>

<p class="l-text"><strong>Why divide by $n$?</strong> Imagine seating 5 friends at a round table. If everyone shifts one seat clockwise, the relative positions are identical — the same person sits to your left, the same person to your right. There are exactly 5 such rotations of any given seating, all considered equivalent. So $5! / 5 = (5-1)! = 4! = 24$.</p>

<div class="calc-graph"><div id="plot-l98-circular-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> five people (P1 through P5) placed around a circular table. The five labelled rotations all produce the same seating because everyone's neighbours are unchanged. Dividing $5! = 120$ by 5 gives $(5-1)! = 24$ truly distinct seatings.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=5;
var xs=[],ys=[],txt=[];
for(var i=0;i<n;i++){var a=2*Math.PI*i/n+Math.PI/2;xs.push(Math.cos(a));ys.push(Math.sin(a));txt.push('P'+(i+1));}
var thR=[];var xR=[];var yR=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;thR.push(a);xR.push(Math.cos(a));yR.push(Math.sin(a));}
var table={x:xR.map(function(v){return 0.7*v;}),y:yR.map(function(v){return 0.7*v;}),mode:'lines',fill:'toself',fillcolor:'rgba(59,130,246,0.08)',line:{color:'rgba(59,130,246,0.3)',width:1.4},name:'table',showlegend:false,hoverinfo:'skip'};
var seats={x:xs,y:ys,mode:'markers+text',name:'seat',marker:{color:'#3b82f6',size:24,line:{color:'#e8e8e8',width:1.5}},text:txt,textposition:'middle center',textfont:{color:'#0a0a0a',size:11,family:'Geist'}};
var edges={x:[],y:[],mode:'lines',line:{color:'rgba(245,158,11,0.4)',width:1.2,dash:'dot'},showlegend:false,hoverinfo:'skip'};
for(var i=0;i<n;i++){var j=(i+1)%n;edges.x.push(xs[i],xs[j],null);edges.y.push(ys[i],ys[j],null);}
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.6,1.6],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'y',scaleratio:1},yaxis:{range:[-1.4,1.4],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:60,l:30},showlegend:false,annotations:[{x:0,y:-1.25,text:'5! = 120 linear orderings ÷ 5 rotations = (5-1)! = 24 distinct circular seatings',showarrow:false,font:{color:'rgba(235,230,220,0.75)',size:11}}]};
Plotly.newPlot('plot-l98-circular-en',[table,edges,seats],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">In how many distinct ways can <strong>6 people</strong> be seated around a round table?<br><br>$P^{\\text{circ}}(6) = (6 - 1)! = 5! = \\mathbf{120}$.<br><br>If the table were a long bench (a line), the count would be $6! = 720$, which is exactly 6 times larger — one factor for each of the 6 rotations that collapse to the same circular seating.</div></div>

<div class="l-note"><strong>Reflection variant:</strong> some textbooks distinguish a <em>mirror-image</em> seating as identical to its reflection (necklace problem). In that case divide by an additional 2 to get $(n-1)!/2$. Standard high-school problems use the simpler $(n-1)!$ formula unless explicitly stated otherwise.</div>

<h2 class="lesson-title">8. Summary Table of Permutation Patterns</h2>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Pattern</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Formula</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Typical question</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">All of $n$ distinct</td><td style="padding:0.5rem 0.8rem">$n!$</td><td style="padding:0.5rem 0.8rem">arrange 5 books on a shelf</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$r$ chosen from $n$, no repeat</td><td style="padding:0.5rem 0.8rem">$P(n,r) = n!/(n-r)!$</td><td style="padding:0.5rem 0.8rem">3 podium places from 10 runners</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$r$ slots, with repetition</td><td style="padding:0.5rem 0.8rem">$n^r$</td><td style="padding:0.5rem 0.8rem">4-digit PIN</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$n$ with identical groups</td><td style="padding:0.5rem 0.8rem">$n!/(n_1!n_2!\\cdots n_k!)$</td><td style="padding:0.5rem 0.8rem">rearrangements of MISSISSIPPI</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$n$ around a circle</td><td style="padding:0.5rem 0.8rem">$(n-1)!$</td><td style="padding:0.5rem 0.8rem">6 people at a round table</td></tr>
</tbody></table>
</div>

<h2 class="lesson-title">9. Worked Problems</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; LINE ARRANGEMENTS</div><div class="example-body"><strong>How many ways can 5 different paintings be hung in a row?</strong><br><br>5 distinct items, every one placed in some order. $P_5 = 5! = 120$ different displays.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; PODIUM ORDERING</div><div class="example-body"><strong>A competition has 8 finalists. In how many ways can the gold, silver, and bronze medals be assigned?</strong><br><br>Choose 3 from 8 with order. $P(8, 3) = 8 \\cdot 7 \\cdot 6 = 336$ ways.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; LETTER CODES, NO REPEAT</div><div class="example-body"><strong>How many 3-letter codes can be made from A, B, C, D, E, F if no letter repeats?</strong><br><br>$P(6, 3) = 6 \\cdot 5 \\cdot 4 = 120$ codes.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; LETTER CODES, REPEAT ALLOWED</div><div class="example-body"><strong>How many 3-letter codes can be made from A, B, C, D, E, F if repetition is allowed?</strong><br><br>$6^3 = 216$ codes. Each slot offers all 6 letters, independently.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; IDENTICAL LETTERS</div><div class="example-body"><strong>How many distinct rearrangements of the word "BALLOON" are there?</strong><br><br>7 letters. B = 1, A = 1, L = 2, O = 2, N = 1.<br><br>$\\dfrac{7!}{1! \\, 1! \\, 2! \\, 2! \\, 1!} = \\dfrac{5040}{4} = 1260$ rearrangements.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; ROUND TABLE</div><div class="example-body"><strong>In how many distinct ways can 7 people be seated at a round table?</strong><br><br>$(7 - 1)! = 6! = 720$ seatings (with rotations identified as the same).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; MIXED CONSTRAINT</div><div class="example-body"><strong>How many ways can 4 men and 3 women sit in a row if all women must sit together?</strong><br><br>Treat the women as a single block. Now we have 5 items (4 men + 1 block) to arrange: $5! = 120$ ways. Inside the block, the 3 women can be ordered in $3! = 6$ ways. Multiply: $120 \\cdot 6 = 720$ ways.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; FORBIDDEN PAIR</div><div class="example-body"><strong>How many ways can 5 people line up so that two specific people, Alice and Bob, are NOT next to each other?</strong><br><br>Total arrangements: $5! = 120$. Arrangements where Alice and Bob ARE next to each other: treat them as one block, so $4! \\cdot 2! = 48$ (the 2! covers their internal order). Subtract: $120 - 48 = 72$.</div></div>

<h2 class="lesson-title">10. Common Errors to Avoid</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forgetting $0! = 1$</div><div class="card-body">When $P(n, n) = n!/0!$ appears, students sometimes write $0$ instead of $1$ in the denominator, getting "undefined". Remember: $0! = 1$ by convention.</div></div>
<div class="calc-card"><div class="card-title">Confusing $P(n,r)$ with $C(n,r)$</div><div class="card-body">If order matters use $P$. If it does not, use $C$. "Choose a 3-person team" is $C$. "Choose president, VP, secretary" is $P$.</div></div>
<div class="calc-card"><div class="card-title">Forgetting to divide for identicals</div><div class="card-body">If letters repeat, $n!$ overcounts. Always check letter frequencies before answering.</div></div>
<div class="calc-card"><div class="card-title">Wrong formula for circular</div><div class="card-body">Around a circle the count is $(n - 1)!$, not $n!$. The rotational equivalence kills one factor of $n$.</div></div>
<div class="calc-card"><div class="card-title">With or without repetition</div><div class="card-body">Read carefully: "no repetition" $\\Rightarrow P(n,r)$. "Repetition allowed" $\\Rightarrow n^r$. The numbers differ by orders of magnitude.</div></div>
<div class="calc-card"><div class="card-title">Block constraints</div><div class="card-body">If certain items must stay together, treat them as one block and then multiply by the block's internal permutations.</div></div>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Multiplication principle: independent choices multiply</li>
<li>Factorial $n!$: product $1 \\cdot 2 \\cdot \\, \\cdots \\, \\cdot n$, with $0! = 1$</li>
<li>$n$ distinct objects: $n!$ orderings</li>
<li>$r$ chosen from $n$, order matters, no repeats: $P(n,r) = n!/(n-r)!$</li>
<li>$r$ slots, repetition allowed: $n^r$</li>
<li>$n$ items with identical groups of sizes $n_1, \\ldots, n_k$: $n!/(n_1!n_2!\\cdots n_k!)$</li>
<li>$n$ around a circle: $(n-1)!$</li>
<li>Lesson 99 introduces combinations $C(n,r)$ where order does not matter</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Beş kitabı bir rafa kaç farklı şekilde dizebilirsin?</strong> Alfabeden harf tekrarı olmadan kaç farklı üç harfli şifre üretilir? Altı kişilik yuvarlak bir masada kaç farklı oturma düzeni vardır? Bu soruların hepsi sayma sorularıdır ve hepsi matematiğin şaşırtıcı derecede temiz bir köşesine, <em>permütasyona</em> aittir. Bu ders, sıralı dizilişleri sayma kurallarını öğretir — olasılığın, kriptografinin, çizelgelemenin ve üniversite sınavındaki yarışma sorularının dili.</p>

<p class="l-text">Bu dersin sonunda ne zaman çarpacağını, ne zaman böleceğini ve faktöriyelin tabloya ne zaman gireceğini tam olarak bileceksin. Farklı nesnelerin dizilişlerini, daha büyük bir havuzdan seçilenleri, tekrara izin verilenleri, bazı elemanları özdeş olanları ve bir çember etrafına dizilmiş olanları sayabileceksin. Bu beş örüntü, Türk lise ortamında veya YKS tarzı bir soruda karşına çıkacak hemen hemen her permütasyon problemini kapsar.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sıralı seçimler için <em>çarpma ilkesini</em> ifade etmeyi ve uygulamayı</li>
<li>$n!$ faktöriyelini tanımlamayı, küçük $n$ için hesaplamayı ve $0! = 1$ sözleşmesini anlamayı</li>
<li>$n$ farklı nesnenin permütasyonlarını ($n!$) ve $n$'den seçilen $r$'nin permütasyonlarını ($P(n,r) = n!/(n-r)!$) saymayı</li>
<li>İki özel durumla baş etmeyi: <em>tekrara izin verilen</em> ($n^r$) ve <em>özdeş gruplar içeren</em> ($n!/n_1!n_2!\\cdots n_k!$)</li>
<li>$n$ kişinin dairesel dizilişlerini $(n-1)!$ olarak saymayı ve neden $n$'ye böldüğümüzü açıklamayı</li>
<li>Yaygın tuzakları tanımayı: $0!$'i unutmak, $P(n,r)$ ile $C(n,r)$'yi karıştırmak, sıralamayı yanlış ele almak</li>
</ul>
</div>

<h2 class="lesson-title">1. Çarpma İlkesi</h2>

<div class="calc-highlight"><strong>Bu dersteki her permütasyon formülünün temelinde tek bir kural yatar:</strong> bir iş bağımsız adımlara bölünebiliyor ve $i$. adım $n_i$ farklı yolla yapılabiliyorsa, tüm iş $n_1 \\cdot n_2 \\cdot \\, \\cdots \\, \\cdot n_k$ farklı yolla yapılır. Seçenekleri çarpmak, saymanın kalbidir.</div>

<p class="l-text">Bir kıyafet seçtiğini düşün. 3 gömleğin ve 4 pantolonun var. Kaç farklı kıyafet oluşturabilirsin? Her gömlek için 4 pantolondan herhangi birini seçebilirsin, dolayısıyla sayı $3 \\times 4 = 12$. Hepsini listelemedik — gömlek seçiminin ve pantolon seçiminin <em>bağımsız</em> olduğunu gözlemledik ve çarptık.</p>

<div class="calc-formula"><div class="formula-label">ÇARPMA İLKESİ</div><div class="formula-main">$$N \\;=\\; n_1 \\cdot n_2 \\cdot n_3 \\cdot \\, \\cdots \\, \\cdot n_k$$</div><div class="formula-sub">Bağımsız $k$ seçim arka arkaya yapılıyor ve $i$. seçimin $n_i$ seçeneği varsa, toplam farklı sonuç sayısı tüm $n_i$'lerin çarpımıdır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir yemekhane <strong>4 çorba, 6 ana yemek ve 3 tatlı</strong> sunuyor. Bir müşteri kaç farklı üç-kapsamlı menü oluşturabilir?<br><br>Üç seçim bağımsız. Çarpma ilkesiyle:<br><br>$4 \\times 6 \\times 3 = \\mathbf{72}$ farklı menü.</div></div>

<div class="calc-graph"><div id="plot-l98-tree-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> A, B, C harflerinin bir sıraya dizilmesi için ağaç diyagramı. İlk seviyede 3 seçenek, ikincide 2 (bir harf kullanılmış), üçüncüde 1 var. Alttaki yaprakları saymak $3 \\cdot 2 \\cdot 1 = 6$ farklı diziliş verir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var level1=['A','B','C'];
var lvl1pos=[];
for(var i=0;i<3;i++){var x=(i-1)*4;var y=-2;lvl1pos.push({x:x,y:y,label:level1[i]});}
var lvl2pos=[];
var leaves=[];
for(var i=0;i<3;i++){var parent=lvl1pos[i];var others=level1.filter(function(L){return L!==level1[i];});for(var j=0;j<2;j++){var x=parent.x+(j-0.5)*1.6;var y=-4;lvl2pos.push({x:x,y:y,label:others[j],parent:parent});var third=level1.filter(function(L){return L!==level1[i]&&L!==others[j];})[0];leaves.push({x:x,y:-6,label:level1[i]+others[j]+third,parent:{x:x,y:y}});}}
var edges={x:[],y:[],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1.2},showlegend:false,hoverinfo:'skip'};
for(var i=0;i<lvl1pos.length;i++){edges.x.push(0,lvl1pos[i].x,null);edges.y.push(0,lvl1pos[i].y,null);}
for(var i=0;i<lvl2pos.length;i++){var p=lvl2pos[i];edges.x.push(p.parent.x,p.x,null);edges.y.push(p.parent.y,p.y,null);}
for(var i=0;i<leaves.length;i++){var p=leaves[i];edges.x.push(p.parent.x,p.x,null);edges.y.push(p.parent.y,p.y,null);}
var rootNode={x:[0],y:[0],mode:'markers+text',name:'kök',marker:{color:'#3b82f6',size:18},text:['başla'],textposition:'top center',textfont:{color:'#e8e8e8',size:11},showlegend:false};
var l1x=lvl1pos.map(function(p){return p.x;});var l1y=lvl1pos.map(function(p){return p.y;});var l1t=lvl1pos.map(function(p){return p.label;});
var l1Node={x:l1x,y:l1y,mode:'markers+text',name:'seçim 1',marker:{color:'#3b82f6',size:14},text:l1t,textposition:'middle right',textfont:{color:'#e8e8e8',size:12}};
var l2x=lvl2pos.map(function(p){return p.x;});var l2y=lvl2pos.map(function(p){return p.y;});var l2t=lvl2pos.map(function(p){return p.label;});
var l2Node={x:l2x,y:l2y,mode:'markers+text',name:'seçim 2',marker:{color:'#10b981',size:12},text:l2t,textposition:'middle right',textfont:{color:'#e8e8e8',size:11}};
var leafx=leaves.map(function(p){return p.x;});var leafy=leaves.map(function(p){return p.y;});var leaft=leaves.map(function(p){return p.label;});
var leafNode={x:leafx,y:leafy,mode:'markers+text',name:'diziliş',marker:{color:'#f59e0b',size:11},text:leaft,textposition:'bottom center',textfont:{color:'#f59e0b',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-7,7],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-7,1.2],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:-6.3,y:0,text:'3 seçenek',showarrow:false,font:{color:'#3b82f6',size:11}},{x:-6.3,y:-2,text:'2 seçenek',showarrow:false,font:{color:'#10b981',size:11}},{x:-6.3,y:-4,text:'1 seçenek',showarrow:false,font:{color:'#f59e0b',size:11}},{x:0,y:-6.8,text:'6 farklı diziliş: ABC, ACB, BAC, BCA, CAB, CBA',showarrow:false,font:{color:'rgba(235,230,220,0.7)',size:11}}]};
Plotly.newPlot('plot-l98-tree-tr',[edges,rootNode,l1Node,l2Node,leafNode],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir araç plakası 2 harften sonra 3 rakam içeriyor; kısıtlama yok (tekrara izin var, 26 harf ve 10 rakamın hepsi). Kaç farklı plaka basılabilir? Cevap: $26 \\times 26 \\times 10 \\times 10 \\times 10 = 676\\,000$.</div></div>

<h2 class="lesson-title">2. Faktöriyel: $n!$</h2>

<div class="calc-highlight"><strong>Permütasyon formüllerinin çoğu faktöriyel kullanır</strong>, $n!$ şeklinde yazılır ve "n faktöriyel" okunur. 1'den $n$'ye kadar tüm pozitif tam sayıların çarpımıdır. Faktöriyeller olağanüstü hızla büyür — $n = 10$'da bile üç milyonu geçer.</div>

<div class="calc-formula"><div class="formula-label">$n!$'İN TANIMI</div><div class="formula-main">$$n! \\;=\\; n \\cdot (n-1) \\cdot (n-2) \\cdot \\, \\cdots \\, \\cdot 3 \\cdot 2 \\cdot 1$$</div><div class="formula-sub">Özyinelemeli biçim: $n \\geq 1$ için $n! = n \\cdot (n-1)!$. Özel sözleşme: $0! = 1$ (boş çarpım 1'dir).</div></div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$n$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$n!$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Hesap</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">0</td><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">boş çarpım (sözleşme)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">1</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">$2 \\cdot 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">3</td><td style="padding:0.5rem 0.8rem">6</td><td style="padding:0.5rem 0.8rem">$3 \\cdot 2 \\cdot 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">4</td><td style="padding:0.5rem 0.8rem">24</td><td style="padding:0.5rem 0.8rem">$4 \\cdot 3 \\cdot 2 \\cdot 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">5</td><td style="padding:0.5rem 0.8rem">120</td><td style="padding:0.5rem 0.8rem">$5 \\cdot 4!$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">6</td><td style="padding:0.5rem 0.8rem">720</td><td style="padding:0.5rem 0.8rem">$6 \\cdot 5!$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">7</td><td style="padding:0.5rem 0.8rem">5040</td><td style="padding:0.5rem 0.8rem">$7 \\cdot 6!$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">8</td><td style="padding:0.5rem 0.8rem">40 320</td><td style="padding:0.5rem 0.8rem">$8 \\cdot 7!$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">9</td><td style="padding:0.5rem 0.8rem">362 880</td><td style="padding:0.5rem 0.8rem">$9 \\cdot 8!$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">10</td><td style="padding:0.5rem 0.8rem">3 628 800</td><td style="padding:0.5rem 0.8rem">$10 \\cdot 9!$</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l98-factorial-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $n = 0$'dan $7$'ye kadar $n!$'in çubuk grafiği. Patlayıcı büyümeye dikkat et — $n = 7$'de bile 5040'a, $n = 10$'da ise 3.6 milyonun üzerine ulaşırız. Faktöriyeller, büyük $n$ için üstel fonksiyonları geride bırakır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[0,1,2,3,4,5,6,7];
var fs=[1,1,2,6,24,120,720,5040];
var bar={x:ns,y:fs,type:'bar',name:'n!',marker:{color:'#3b82f6',line:{color:'rgba(255,255,255,0.2)',width:1}},text:fs.map(String),textposition:'outside',textfont:{color:'#e8e8e8',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'n!',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,6000]},margin:{t:30,r:30,b:50,l:60},showlegend:false};
Plotly.newPlot('plot-l98-factorial-tr',[bar],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>$0! = 1$ neden:</strong> üç iyi sebep. (1) <em>Boş</em> bir küme üzerindeki çarpım sözleşme gereği 1'dir (boş küme üzerindeki toplam 0 olduğu gibi). (2) $n = 1$'de $n! = n \\cdot (n-1)!$ özyinelemesi $1 = 1 \\cdot 0!$ verir, bu da $0! = 1$'i zorunlu kılar. (3) $P(n,n) = n!/0!$ gibi permütasyon formülleri aksi halde başarısız olur. Sözleşmeyi kabul et ve devam et.</div>

<h2 class="lesson-title">3. $n$ Farklı Nesnenin Permütasyonu</h2>

<div class="calc-highlight"><strong>En basit permütasyon sorusu:</strong> $n$ farklı nesne kaç şekilde sıraya dizilebilir? Cevap: ilk yer için $n$ seçenek, ikinci için $n - 1$ (bir nesne kullanıldı), üçüncü için $n - 2$, ve son yere kadar 1'e kadar iner. Çarp: $n!$.</div>

<div class="calc-formula"><div class="formula-label">$n$ FARKLI NESNENİN PERMÜTASYONU</div><div class="formula-main">$$P_n \\;=\\; n!$$</div><div class="formula-sub">$n$ farklı elemanın sırada tam olarak $n!$ farklı dizilişi vardır. Sıra önemlidir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>5 farklı kitap</strong> bir rafa kaç şekilde dizilir?<br><br>Formülle: $P_5 = 5! = 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = \\mathbf{120}$ farklı diziliş.<br><br>Akıl yürütme: en soldaki yer için 5 seçenek, sonraki için 4, sonraki için 3, sonraki için 2, sonuncusu için 1. $5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 120$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">7 öğrencilik bir sınıf fotoğraf için sıraya dizilecek. Kaç farklı sıralama mümkün?<br><br>$7! = 5040$. <strong>Beş bin kırk</strong> olasılık. Bu yüzden "rastgele sıraya gir" demek neredeyse hiç aynı sonucu vermez.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Sadece 3 kitabın olsaydı $3! = 6$ dizilişin olurdu. 10 kitabın olsaydı sayı $10! = 3\\,628\\,800$ olurdu. Bir eleman daha eklemenin sayıyı yeni boyutla çarptığına dikkat et.</div></div>

<h2 class="lesson-title">4. $n$'den Seçilen $r$ Elemanın Permütasyonu</h2>

<div class="calc-highlight"><strong>Bazen her nesneyi sıralamazsın — sadece $r$ tanesini seçer ve onları sıralarsın.</strong> Örnek: 10 koşucudan birinci, ikinci ve üçüncü 3 kişilik bir kürsü oluşturur. Sıra önemli (altın, gümüşten önce gelir; gümüş bronzdan önce), ama 10'dan sadece 3'ü seçilir. Bu, $P(n, r)$ permütasyonudur, aynı zamanda $nPr$ olarak yazılır.</div>

<div class="calc-formula"><div class="formula-label">$n$'DEN $r$'NİN PERMÜTASYONU</div><div class="formula-main">$$P(n, r) \\;=\\; \\frac{n!}{(n - r)!} \\;=\\; n \\cdot (n-1) \\cdot \\, \\cdots \\, \\cdot (n - r + 1)$$</div><div class="formula-sub">Çarpım, $n$'den başlayan tam olarak $r$ ardışık azalan tam sayıdır. Eşdeğer olarak, $n!$'i kalan elemanların faktöriyeline böl.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">10 koşuculu bir yarışta <strong>birincilik, ikincilik ve üçüncülük</strong> kaç şekilde dağıtılır?<br><br>$P(10, 3) = \\dfrac{10!}{7!} = 10 \\cdot 9 \\cdot 8 = \\mathbf{720}$ kürsü sıralaması.<br><br>Sayı, ya 3 azalan tam sayının çarpımı olarak ($10 \\cdot 9 \\cdot 8$) ya da faktöriyel oranı olarak hesaplanabilir. Her ikisi de 720 verir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">İngiliz alfabesinin 26 harfinden harflerin tekrar etmediği <strong>3 harfli kod</strong> kaç farklı şekilde oluşturulabilir?<br><br>$P(26, 3) = 26 \\cdot 25 \\cdot 24 = \\mathbf{15\\,600}$ kod.<br><br>Sıra önemli (ABC, BCA'dan farklıdır). Tekrar yok ("hiçbir harf tekrar etmez"). Bu tam olarak $P(n, r)$.</div></div>

<div class="l-note"><strong>$P(n, r)$ ile $C(n, r)$:</strong> permütasyonlarda $P(n, r)$ sıra önemlidir; kombinasyonlarda $C(n, r) = \\binom{n}{r}$ ise önemsizdir. $C(n, r) = P(n, r) / r!$ çünkü seçilen kümenin $r!$ farklı dizilişi tek bir kombinasyona indirgenir. Ders 99 kombinasyonları ayrıntılı işler.</div>

<h2 class="lesson-title">5. Tekrarlı Permütasyon</h2>

<div class="calc-highlight"><strong>Tekrara izin verilirse</strong> — örneğin bir PIN'de aynı rakam iki kez görünebilirse — analiz daha basittir. $r$ yerin her biri tüm $n$ seçeneği bağımsız olarak sunar, dolayısıyla çarpma ilkesi $n^r$ sonuç verir.</div>

<div class="calc-formula"><div class="formula-label">TEKRARLI PERMÜTASYON</div><div class="formula-main">$$P^{\\text{tek}}(n, r) \\;=\\; n^r$$</div><div class="formula-sub">$r$ sıralı yer, her birinde $n$ seçenek, yeniden kullanma izinli. Bazen "yerine koymalı sıralı seçim" denir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Her rakam 0&ndash;9 olabiliyor ve tekrara izin varsa, kaç farklı <strong>4 haneli PIN</strong> vardır?<br><br>$P^{\\text{tek}}(10, 4) = 10^4 = \\mathbf{10\\,000}$. 0000'dan 9999'a kadar (her ikisi dahil).<br><br>Tekrar yasak olsaydı sayı $P(10, 4) = 10 \\cdot 9 \\cdot 8 \\cdot 7 = 5040$ olurdu — yaklaşık yarısı, çünkü çoğu "iyi" PIN tekrarı yasaklar.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">8 uzunluğundaki ikili (binary) dizgi: kaç farklı dizi vardır?<br><br>$2^8 = \\mathbf{256}$ farklı dizi, 00000000'dan 11111111'e kadar. Bir bayt da bu nedenle 256 farklı değer saklar.</div></div>

<h2 class="lesson-title">6. Özdeş Nesneler İçeren Permütasyon</h2>

<div class="calc-highlight"><strong>Bazı nesneler özdeş olduğunda $n!$ basitçe kullanılırsa fazla sayar.</strong> Yerlerini değiştiren iki "S" harfi aynı kelimeyi verir, dolayısıyla bu özdeşlerin kendi aralarında düzenlenme sayısına bölmeliyiz. $n$ eleman $n_1, n_2, \\ldots, n_k$ boyutlu $k$ özdeş gruba bölünüyorsa (her grup içinde özdeş), farklı diziliş sayısı:</div>

<div class="calc-formula"><div class="formula-label">ÖZDEŞ GRUPLU PERMÜTASYON</div><div class="formula-main">$$P^{\\text{id}} \\;=\\; \\frac{n!}{n_1! \\, n_2! \\, \\cdots \\, n_k!}$$</div><div class="formula-sub">Toplam yer $n = n_1 + n_2 + \\cdots + n_k$. Her $n_i$ bir özdeş grubun sayısıdır. Bölmek, aynı görünür kelimeyi üreten iç değişimleri kaldırır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>MISSISSIPPI</strong> kelimesinin harflerinin kaç farklı dizilişi vardır?<br><br>Toplam 11 harf. Harf frekansları: M = 1, I = 4, S = 4, P = 2.<br><br>$\\dfrac{11!}{1! \\, 4! \\, 4! \\, 2!} = \\dfrac{39\\,916\\,800}{1 \\cdot 24 \\cdot 24 \\cdot 2} = \\dfrac{39\\,916\\,800}{1152} = \\mathbf{34\\,650}$.<br><br>Tüm 11 harf farklı olsaydı $11! = 39\\,916\\,800$ olurdu — yaklaşık 1150 kat daha fazla. Çoğu diziliş çakışır çünkü I'lar ve S'ler ayırt edilemez.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>BANANA</strong> kelimesinin kaç farklı dizilişi vardır?<br><br>6 harf. B = 1, A = 3, N = 2.<br><br>$\\dfrac{6!}{1! \\, 3! \\, 2!} = \\dfrac{720}{1 \\cdot 6 \\cdot 2} = \\dfrac{720}{12} = \\mathbf{60}$ diziliş.</div></div>

<div class="l-note"><strong>Hızlı tutarlılık kontrolü:</strong> tüm gruplar 1 boyutluysa (tüm nesneler farklı), payda $1! \\cdot 1! \\cdot \\, \\cdots \\, = 1$ olur ve formülden $n!$'i geri alırız. Yani bu formül özel hâl olarak temel permütasyonu kapsar.</div>

<h2 class="lesson-title">7. Dairesel Permütasyon</h2>

<div class="calc-highlight"><strong>$n$ kişiyi yuvarlak bir masaya yerleştirirken, aynı oturma düzeninin döndürülmüş hâlleri aynı sayılır.</strong> Doğrusal formül $n!$, $n$ kat (farklı döndürme sayısı) fazla sayar. Bu nedenle <em>dairesel permütasyon</em> sayısı $(n-1)!$'dir.</div>

<div class="calc-formula"><div class="formula-label">DAİRESEL PERMÜTASYON</div><div class="formula-main">$$P^{\\text{dai}}(n) \\;=\\; (n - 1)!$$</div><div class="formula-sub">$n$ farklı kişi, yuvarlak bir masada, dönme eşdeğerliği ile. Bir kişinin yerini sabitle ve diğer $n-1$'i $(n-1)!$ yolla diz.</div></div>

<p class="l-text"><strong>Neden $n$'ye bölüyoruz?</strong> 5 arkadaşı yuvarlak bir masaya oturttuğunu düşün. Herkes bir koltuk saat yönünde kayarsa, göreceli konumlar aynı kalır — solunda hâlâ aynı kişi, sağında hâlâ aynı kişi oturur. Verilen herhangi bir oturma düzeninin tam olarak 5 böyle döndürmesi vardır ve hepsi eşdeğer sayılır. Yani $5! / 5 = (5-1)! = 4! = 24$.</p>

<div class="calc-graph"><div id="plot-l98-circular-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> dairesel bir masa etrafına yerleştirilmiş beş kişi (P1'den P5'e). Etiketli beş döndürme aynı oturma düzenini verir çünkü herkesin komşuları değişmez. $5! = 120$'yi 5'e bölmek $(5-1)! = 24$ gerçekten farklı oturma düzenini verir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=5;
var xs=[],ys=[],txt=[];
for(var i=0;i<n;i++){var a=2*Math.PI*i/n+Math.PI/2;xs.push(Math.cos(a));ys.push(Math.sin(a));txt.push('P'+(i+1));}
var xR=[];var yR=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;xR.push(Math.cos(a));yR.push(Math.sin(a));}
var table={x:xR.map(function(v){return 0.7*v;}),y:yR.map(function(v){return 0.7*v;}),mode:'lines',fill:'toself',fillcolor:'rgba(59,130,246,0.08)',line:{color:'rgba(59,130,246,0.3)',width:1.4},name:'masa',showlegend:false,hoverinfo:'skip'};
var seats={x:xs,y:ys,mode:'markers+text',name:'koltuk',marker:{color:'#3b82f6',size:24,line:{color:'#e8e8e8',width:1.5}},text:txt,textposition:'middle center',textfont:{color:'#0a0a0a',size:11,family:'Geist'}};
var edges={x:[],y:[],mode:'lines',line:{color:'rgba(245,158,11,0.4)',width:1.2,dash:'dot'},showlegend:false,hoverinfo:'skip'};
for(var i=0;i<n;i++){var j=(i+1)%n;edges.x.push(xs[i],xs[j],null);edges.y.push(ys[i],ys[j],null);}
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.6,1.6],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'y',scaleratio:1},yaxis:{range:[-1.4,1.4],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:60,l:30},showlegend:false,annotations:[{x:0,y:-1.25,text:'5! = 120 doğrusal diziliş ÷ 5 döndürme = (5-1)! = 24 farklı dairesel oturma',showarrow:false,font:{color:'rgba(235,230,220,0.75)',size:11}}]};
Plotly.newPlot('plot-l98-circular-tr',[table,edges,seats],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>6 kişi</strong> yuvarlak bir masada kaç farklı şekilde oturabilir?<br><br>$P^{\\text{dai}}(6) = (6 - 1)! = 5! = \\mathbf{120}$.<br><br>Masa uzun bir sıra olsaydı sayı $6! = 720$ olurdu, bu da tam 6 kat daha büyüktür — her biri aynı dairesel oturmaya çakışan 6 döndürmenin her birine bir çarpan.</div></div>

<div class="l-note"><strong>Yansıma çeşidi:</strong> bazı kitaplar bir oturma düzeninin <em>ayna görüntüsünü</em> aynı kabul eder (kolye problemi). Bu durumda ek olarak 2'ye bölüp $(n-1)!/2$ alırız. Standart lise soruları aksi belirtilmedikçe daha basit olan $(n-1)!$ formülünü kullanır.</div>

<h2 class="lesson-title">8. Permütasyon Örüntülerinin Özet Tablosu</h2>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Örüntü</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Formül</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Tipik soru</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$n$ farklı elemanın tamamı</td><td style="padding:0.5rem 0.8rem">$n!$</td><td style="padding:0.5rem 0.8rem">5 kitabı rafa dizmek</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$n$'den $r$ seçim, tekrarsız</td><td style="padding:0.5rem 0.8rem">$P(n,r) = n!/(n-r)!$</td><td style="padding:0.5rem 0.8rem">10 koşucudan 3 kürsü</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$r$ yer, tekrarlı</td><td style="padding:0.5rem 0.8rem">$n^r$</td><td style="padding:0.5rem 0.8rem">4 haneli PIN</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$n$, özdeş gruplar</td><td style="padding:0.5rem 0.8rem">$n!/(n_1!n_2!\\cdots n_k!)$</td><td style="padding:0.5rem 0.8rem">MISSISSIPPI dizilişleri</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$n$ çember etrafında</td><td style="padding:0.5rem 0.8rem">$(n-1)!$</td><td style="padding:0.5rem 0.8rem">yuvarlak masada 6 kişi</td></tr>
</tbody></table>
</div>

<h2 class="lesson-title">9. Çözümlü Problemler</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; SIRAYA DİZME</div><div class="example-body"><strong>5 farklı tablo bir sıraya kaç şekilde asılır?</strong><br><br>5 farklı eleman, her biri bir yere konuluyor. $P_5 = 5! = 120$ farklı sergi.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; KÜRSÜ SIRALAMASI</div><div class="example-body"><strong>Bir yarışmanın 8 finalisti var. Altın, gümüş ve bronz madalyalar kaç farklı şekilde verilebilir?</strong><br><br>8'den 3'ü sırayla seç. $P(8, 3) = 8 \\cdot 7 \\cdot 6 = 336$ yol.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; HARFLİ KOD, TEKRARSIZ</div><div class="example-body"><strong>A, B, C, D, E, F harflerinden harf tekrar etmiyorsa kaç 3 harfli kod oluşturulur?</strong><br><br>$P(6, 3) = 6 \\cdot 5 \\cdot 4 = 120$ kod.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; HARFLİ KOD, TEKRARLI</div><div class="example-body"><strong>A, B, C, D, E, F harflerinden tekrara izin verilirse kaç 3 harfli kod oluşturulur?</strong><br><br>$6^3 = 216$ kod. Her yer 6 harfin hepsini bağımsız olarak sunar.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; ÖZDEŞ HARFLER</div><div class="example-body"><strong>"BALON" kelimesinin harfleri kaç farklı şekilde dizilir?</strong><br><br>5 harf. B = 1, A = 1, L = 1, O = 1, N = 1. Hepsi farklı.<br><br>$5! = 120$ diziliş.<br><br>Daha zor: "BALLOON" kelimesi 7 harftir; B = 1, A = 1, L = 2, O = 2, N = 1. $\\dfrac{7!}{1! \\, 1! \\, 2! \\, 2! \\, 1!} = \\dfrac{5040}{4} = 1260$ diziliş.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; YUVARLAK MASA</div><div class="example-body"><strong>7 kişi yuvarlak bir masaya kaç farklı şekilde oturur?</strong><br><br>$(7 - 1)! = 6! = 720$ oturma düzeni (döndürmeler aynı sayılır).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; KARMAŞIK KOŞUL</div><div class="example-body"><strong>4 erkek ve 3 kadın, tüm kadınlar yan yana oturmak şartıyla bir sıraya kaç şekilde oturur?</strong><br><br>Kadınları tek bir blok say. Şimdi 5 eleman var (4 erkek + 1 blok), $5! = 120$ yolla dizilir. Blok içinde 3 kadın $3! = 6$ yolla sıralanır. Çarp: $120 \\cdot 6 = 720$ yol.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; YASAK İKİLİ</div><div class="example-body"><strong>5 kişi sıraya, iki belirli kişi Ali ve Burak yan yana OLMAYACAK şekilde kaç şekilde dizilir?</strong><br><br>Toplam diziliş: $5! = 120$. Ali ile Burak'ın yan yana OLDUĞU dizilişler: ikisini bir blok say, $4! \\cdot 2! = 48$ (2! iç sıralarını kapsar). Çıkar: $120 - 48 = 72$.</div></div>

<h2 class="lesson-title">10. Kaçınılması Gereken Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$0! = 1$'i unutmak</div><div class="card-body">$P(n, n) = n!/0!$ ortaya çıktığında öğrenciler bazen paydaya 1 yerine 0 yazar ve "tanımsız" elde eder. Hatırla: $0! = 1$ sözleşme gereği.</div></div>
<div class="calc-card"><div class="card-title">$P(n,r)$ ile $C(n,r)$ karıştırmak</div><div class="card-body">Sıra önemliyse $P$. Önemsizse $C$. "3 kişilik takım seç" $C$'dir. "Başkan, başkan yardımcısı, sekreter seç" $P$'dir.</div></div>
<div class="calc-card"><div class="card-title">Özdeş için bölmeyi unutmak</div><div class="card-body">Harfler tekrarlıysa $n!$ fazla sayar. Cevap vermeden önce her zaman harf frekanslarını kontrol et.</div></div>
<div class="calc-card"><div class="card-title">Dairesel için yanlış formül</div><div class="card-body">Çember etrafında sayı $(n - 1)!$, $n!$ değil. Dönme eşdeğerliği bir $n$ çarpanını eler.</div></div>
<div class="calc-card"><div class="card-title">Tekrarlı mı, tekrarsız mı</div><div class="card-body">Dikkatli oku: "tekrar yok" $\\Rightarrow P(n,r)$. "Tekrara izin var" $\\Rightarrow n^r$. Sayılar arasında büyüklük farkları var.</div></div>
<div class="calc-card"><div class="card-title">Blok kısıtları</div><div class="card-body">Belirli elemanların birlikte kalması gerekiyorsa, onları bir blok say ve sonra blokun iç permütasyonlarıyla çarp.</div></div>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Çarpma ilkesi: bağımsız seçimler çarpılır</li>
<li>Faktöriyel $n!$: $1 \\cdot 2 \\cdot \\, \\cdots \\, \\cdot n$ çarpımı, $0! = 1$ ile</li>
<li>$n$ farklı nesne: $n!$ diziliş</li>
<li>$n$'den $r$ seçim, sıralı, tekrarsız: $P(n,r) = n!/(n-r)!$</li>
<li>$r$ yer, tekrara izin: $n^r$</li>
<li>$n_1, \\ldots, n_k$ boyutlu özdeş grupları olan $n$ eleman: $n!/(n_1!n_2!\\cdots n_k!)$</li>
<li>Çember etrafında $n$: $(n-1)!$</li>
<li>Ders 99, sıranın önemsiz olduğu kombinasyonları $C(n,r)$ tanıtır</li>
</ul>
</div>`
};
