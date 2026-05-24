window.LISE_MAT_L51 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>This lesson is about a single, powerful idea: certain algebraic expressions are <em>always</em> equal, no matter what numbers you plug in.</strong> These are called <em>identities</em>. The five or six identities in this lesson — the square of a sum, the difference of two squares, the cube of a sum, the sum and difference of cubes, and the binomial expansion of $(a+b)^n$ — appear on almost every exam paper you will ever sit. Memorising them turns three lines of factoring into one. Misremembering them turns a five-mark question into zero marks.</p>

<p class="l-text">We will also meet a beautiful number triangle attributed to Blaise Pascal, in which every row tells you the coefficients of one binomial expansion at a glance. By the end of the lesson you will be able to expand $(2x-3y)^4$ in your head, find the sixth term of $(x+2)^{10}$ without writing out the rest, and recognise the geometric shape behind every "magic" algebraic identity.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recall and apply the basic square identities $(a\\pm b)^2$ and the three-term $(a+b+c)^2$ expansion</li>
<li>Use the difference-of-squares identity $a^2-b^2 = (a-b)(a+b)$ both ways, with a geometric area proof</li>
<li>Expand $(a\\pm b)^3$ algebraically and verify each coefficient by combinatorial counting</li>
<li>Factor sums and differences of cubes $a^3 \\pm b^3$ using the standard formulas</li>
<li>Build Pascal's triangle row by row and read off binomial coefficients $\\binom{n}{k}$ directly from it</li>
<li>State and apply the Binomial Theorem $(a+b)^n = \\sum_{k=0}^{n}\\binom{n}{k}a^{n-k}b^{k}$ to find specific terms in any expansion</li>
</ul>
</div>

<h2 class="lesson-title">1. The Basic Square Identities</h2>

<div class="calc-highlight"><strong>The first identity you ever met</strong> was probably $(a+b)^2 = a^2 + 2ab + b^2$. It looks innocent. But notice the middle term: a careless student writes $(a+b)^2 = a^2 + b^2$ and gets every problem wrong. The <em>cross term</em> $2ab$ is the whole point.</div>

<p class="l-text">Let us derive the four most common quadratic identities from scratch. Each one is just careful FOIL (First, Outer, Inner, Last) — no magic involved.</p>

<div class="calc-formula"><div class="formula-label">SQUARE OF A SUM</div><div class="formula-main">$$(a+b)^2 \\;=\\; a^2 + 2ab + b^2$$</div><div class="formula-sub">Derivation: $(a+b)(a+b) = a\\cdot a + a\\cdot b + b\\cdot a + b\\cdot b = a^2 + 2ab + b^2$.</div></div>

<div class="calc-formula"><div class="formula-label">SQUARE OF A DIFFERENCE</div><div class="formula-main">$$(a-b)^2 \\;=\\; a^2 - 2ab + b^2$$</div><div class="formula-sub">Replace b with -b in the previous identity: the cross term picks up one minus sign, the last term picks up two and stays positive.</div></div>

<div class="calc-formula"><div class="formula-label">SQUARE OF A THREE-TERM SUM</div><div class="formula-main">$$(a+b+c)^2 \\;=\\; a^2 + b^2 + c^2 + 2ab + 2ac + 2bc$$</div><div class="formula-sub">Three squares plus three cross terms — one cross term for each pair of variables.</div></div>

<div class="calc-formula"><div class="formula-label">SQUARE OF A MIXED-SIGN TRIPLE</div><div class="formula-main">$$(a-b+c)^2 \\;=\\; a^2 + b^2 + c^2 - 2ab + 2ac - 2bc$$</div><div class="formula-sub">Same six terms as above, but each cross term takes the sign of the product of its two factors.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pattern in two terms</div><div class="card-body">$(a\\pm b)^2$ always produces three terms: a square, a cross term with coefficient $\\pm 2$, and another square.</div></div>
<div class="calc-card"><div class="card-title">Pattern in three terms</div><div class="card-body">$(a \\pm b \\pm c)^2$ always produces six terms: three squares plus three cross terms, one for each pair.</div></div>
<div class="calc-card"><div class="card-title">Pattern in n terms</div><div class="card-body">In general $(a_1 + \\ldots + a_n)^2$ produces $n$ squares plus $\\binom{n}{2}$ cross terms — for $n=3$ that is $3 + 3 = 6$ terms, for $n=4$ that is $4 + 6 = 10$ terms.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Expand $(3x + 5)^2$.<br><br>Use $(a+b)^2 = a^2 + 2ab + b^2$ with $a = 3x$, $b = 5$.<br><br>$a^2 = (3x)^2 = 9x^2$.<br>$2ab = 2(3x)(5) = 30x$.<br>$b^2 = 25$.<br><br>Answer: $\\mathbf{(3x+5)^2 = 9x^2 + 30x + 25}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Expand $(2x - 7y)^2$.<br><br>Use $(a-b)^2 = a^2 - 2ab + b^2$ with $a = 2x$, $b = 7y$.<br><br>$a^2 = 4x^2$, $2ab = 28xy$, $b^2 = 49y^2$.<br><br>Answer: $\\mathbf{(2x-7y)^2 = 4x^2 - 28xy + 49y^2}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">Expand $(x + 2y + 3)^2$.<br><br>Use the three-term square with $a = x$, $b = 2y$, $c = 3$.<br><br>Squares: $x^2 + 4y^2 + 9$.<br>Cross terms: $2(x)(2y) + 2(x)(3) + 2(2y)(3) = 4xy + 6x + 12y$.<br><br>Answer: $\\mathbf{x^2 + 4y^2 + 9 + 4xy + 6x + 12y}$.</div></div>

<div class="calc-graph"><div id="plot-l51-areasq-en-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a square of side $(a+b)$ split into four regions. The big blue square is $a \\times a = a^2$, the small pink square is $b \\times b = b^2$, and the two green rectangles each have area $a \\times b = ab$ — together $2ab$. Add the four areas: $a^2 + ab + ab + b^2 = a^2 + 2ab + b^2 = (a+b)^2$. The "missing" cross term $2ab$ is literally the two rectangles you cannot ignore.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a=4,b=2;
var sqA={x:[0,a,a,0,0],y:[0,0,a,a,0],mode:'lines',fill:'toself',name:'a² (a×a)',fillcolor:'rgba(59,130,246,0.35)',line:{color:'#3b82f6',width:2}};
var rect1={x:[a,a+b,a+b,a,a],y:[0,0,a,a,0],mode:'lines',fill:'toself',name:'ab (a×b)',fillcolor:'rgba(16,185,129,0.32)',line:{color:'#10b981',width:2}};
var rect2={x:[0,a,a,0,0],y:[a,a,a+b,a+b,a],mode:'lines',fill:'toself',name:'ab (b×a)',fillcolor:'rgba(16,185,129,0.32)',line:{color:'#10b981',width:2},showlegend:false};
var sqB={x:[a,a+b,a+b,a,a],y:[a,a,a+b,a+b,a],mode:'lines',fill:'toself',name:'b² (b×b)',fillcolor:'rgba(236,72,153,0.38)',line:{color:'#ec4899',width:2}};
var labels={x:[a/2,a+b/2,a/2,a+b/2,a/2,a+b/2],y:[a/2,a/2,a+b/2,a+b/2,-0.5,-0.5],mode:'text',text:['a²','ab','ab','b²','side a','side b'],textfont:{color:'#e8e8e8',size:14},showlegend:false};
var sideLabels={x:[-0.55,-0.55],y:[a/2,a+b/2],mode:'text',text:['a','b'],textfont:{color:'#e8e8e8',size:14},showlegend:false};
var totalLabel={x:[(a+b)/2],y:[a+b+0.55],mode:'text',text:['(a+b)² = a² + 2ab + b²'],textfont:{color:'#3b82f6',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.2,a+b+0.8],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,title:'area decomposition of (a+b)²'},yaxis:{range:[-1.2,a+b+1.2],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:60,l:50},legend:{orientation:'h',y:-0.15,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l51-areasq-en-extra',[sqA,rect1,rect2,sqB,labels,sideLabels,totalLabel],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">COMMON MISTAKE</div><div class="think-body">Writing $(a+b)^2 = a^2 + b^2$ (forgetting the cross term) is the single most common algebra error among high-school students. If you only remember one rule from this lesson, make it: <strong>squaring a sum produces three terms, not two</strong>.</div></div>

<h2 class="lesson-title">2. The Difference of Two Squares — A Geometric Proof</h2>

<div class="calc-highlight"><strong>The difference of two squares</strong> $a^2 - b^2$ can always be rewritten as the product $(a-b)(a+b)$. This is one of the most useful factoring identities in all of algebra — it turns a hard subtraction into a friendly multiplication, and it has a beautiful one-picture proof.</div>

<div class="calc-formula"><div class="formula-label">DIFFERENCE OF SQUARES</div><div class="formula-main">$$a^2 - b^2 \\;=\\; (a-b)(a+b)$$</div><div class="formula-sub">Algebraic check: $(a-b)(a+b) = a^2 + ab - ab - b^2 = a^2 - b^2$. The two cross terms cancel exactly.</div></div>

<p class="l-text"><strong>Geometric proof (the area argument).</strong> Imagine a square of side $a$. Cut a smaller square of side $b$ from one corner. The remaining L-shaped region has area $a^2 - b^2$. Now slice that L-shape along a clever line and rearrange the two pieces into a rectangle: one side has length $(a-b)$, the other side has length $(a+b)$. The area of the rectangle is $(a-b)(a+b)$. The areas must match — so $a^2 - b^2 = (a-b)(a+b)$.</p>

<div class="calc-graph"><div id="plot-l51-diffsq-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> on the left, a square of side $a$ with a small square of side $b$ removed from the corner — total area $a^2 - b^2$. On the right, the same area arranged as a rectangle of dimensions $(a+b) \\times (a-b)$. The colours match up: the two regions have the same area, just rearranged.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a=5,b=2;
var leftRect={x:[0,a,a,0,0],y:[0,0,a,a,0],mode:'lines',fill:'toself',name:'a × a',fillcolor:'rgba(59,130,246,0.25)',line:{color:'#3b82f6',width:2}};
var leftHole={x:[a-b,a,a,a-b,a-b],y:[a-b,a-b,a,a,a-b],mode:'lines',fill:'toself',name:'remove b × b',fillcolor:'rgba(10,10,10,1)',line:{color:'#ef4444',width:2,dash:'dash'}};
var leftLabel={x:[a/2,a-b/2,(a-b)/2+0.3],y:[-0.4,a+0.3,a-b/2],mode:'text',text:['side a','b','area a²-b²'],textfont:{color:'#e8e8e8',size:12},showlegend:false};
var offset=8;
var rightRect={x:[offset,offset+(a+b),offset+(a+b),offset,offset],y:[0,0,a-b,a-b,0],mode:'lines',fill:'toself',name:'(a+b) × (a-b)',fillcolor:'rgba(16,185,129,0.25)',line:{color:'#10b981',width:2}};
var splitLine={x:[offset+a,offset+a],y:[0,a-b],mode:'lines',name:'cut line',line:{color:'rgba(255,255,255,0.4)',width:1.4,dash:'dot'}};
var rightLabel={x:[offset+(a+b)/2,offset-0.6,offset+a/2,offset+a+b/2],y:[-0.4,(a-b)/2,(a-b)/2,(a-b)/2],mode:'text',text:['side a+b','a-b','piece A','piece B'],textfont:{color:'#e8e8e8',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1,offset+a+b+1],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,title:'rearranged area'},yaxis:{range:[-1.2,a+1],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l51-diffsq-en',[leftRect,leftHole,leftLabel,rightRect,splitLine,rightLabel],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Factor $x^2 - 49$.<br><br>Write 49 as $7^2$. Then $x^2 - 49 = x^2 - 7^2 = (x-7)(x+7)$.<br><br>Answer: $\\mathbf{(x-7)(x+7)}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Compute $103 \\times 97$ mentally.<br><br>Notice $103 = 100 + 3$ and $97 = 100 - 3$. So $103 \\times 97 = (100+3)(100-3) = 100^2 - 3^2 = 10000 - 9 = \\mathbf{9991}$.<br><br>This is the difference-of-squares trick used as a mental-arithmetic shortcut.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">Factor $9x^4 - 16y^2$.<br><br>Write each term as a square: $9x^4 = (3x^2)^2$ and $16y^2 = (4y)^2$. So $9x^4 - 16y^2 = (3x^2 - 4y)(3x^2 + 4y)$.<br><br>Answer: $\\mathbf{(3x^2 - 4y)(3x^2 + 4y)}$.</div></div>

<div class="l-note"><strong>Important caveat:</strong> the sum of two squares $a^2 + b^2$ does <em>not</em> factor over the real numbers. Only the <em>difference</em> $a^2 - b^2$ has the nice factoring. Confusing the two is another common error.</div>

<h2 class="lesson-title">3. The Cubes — Expanding $(a \\pm b)^3$</h2>

<div class="calc-highlight"><strong>The cube of a sum or difference is the next step up.</strong> Instead of three terms (as in the square), we get four. The coefficients form the pattern 1, 3, 3, 1 — and those four numbers will appear again when we meet Pascal's triangle in section 6. Memorise the pattern now and the binomial theorem becomes effortless later.</div>

<div class="calc-formula"><div class="formula-label">CUBE OF A SUM</div><div class="formula-main">$$(a+b)^3 \\;=\\; a^3 + 3a^2 b + 3ab^2 + b^3$$</div><div class="formula-sub">Coefficients: 1, 3, 3, 1. Exponents of a decrease from 3 to 0, exponents of b increase from 0 to 3. The two exponents always add to 3.</div></div>

<div class="calc-formula"><div class="formula-label">CUBE OF A DIFFERENCE</div><div class="formula-main">$$(a-b)^3 \\;=\\; a^3 - 3a^2 b + 3ab^2 - b^3$$</div><div class="formula-sub">Same coefficients (1, 3, 3, 1) but the signs alternate: +, -, +, -.</div></div>

<p class="l-text"><strong>Proof of the cube of a sum.</strong> Compute step by step:</p>

<div class="calc-formula"><div class="formula-label">DERIVATION</div><div class="formula-main">$$(a+b)^3 = (a+b)(a+b)^2 = (a+b)(a^2 + 2ab + b^2)$$ $$= a^3 + 2a^2 b + ab^2 + a^2 b + 2ab^2 + b^3$$ $$= a^3 + 3a^2 b + 3ab^2 + b^3$$</div><div class="formula-sub">Three middle terms collapse into two: 2a²b + a²b = 3a²b, and ab² + 2ab² = 3ab².</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Expand $(x + 2)^3$.<br><br>Use $(a+b)^3 = a^3 + 3a^2 b + 3ab^2 + b^3$ with $a = x$, $b = 2$.<br><br>$a^3 = x^3$.<br>$3a^2 b = 3 \\cdot x^2 \\cdot 2 = 6x^2$.<br>$3ab^2 = 3 \\cdot x \\cdot 4 = 12x$.<br>$b^3 = 8$.<br><br>Answer: $\\mathbf{(x+2)^3 = x^3 + 6x^2 + 12x + 8}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Expand $(2x - 3)^3$.<br><br>Use $(a-b)^3 = a^3 - 3a^2 b + 3ab^2 - b^3$ with $a = 2x$, $b = 3$.<br><br>$a^3 = 8x^3$.<br>$3a^2 b = 3 \\cdot 4x^2 \\cdot 3 = 36x^2$.<br>$3ab^2 = 3 \\cdot 2x \\cdot 9 = 54x$.<br>$b^3 = 27$.<br><br>Answer: $\\mathbf{8x^3 - 36x^2 + 54x - 27}$.</div></div>

<div class="calc-graph"><div id="plot-l51-cube-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a cube of side $(a+b)$ split into eight smaller pieces. There is one $a \\times a \\times a$ piece in one corner, one $b \\times b \\times b$ piece in the opposite corner, three slab-shaped pieces of size $a \\times a \\times b$, and three slab pieces of size $a \\times b \\times b$. Counting the pieces produces $a^3 + 3a^2 b + 3ab^2 + b^3$ — exactly the cube-of-a-sum identity.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var labels=['a³ (1 piece)','3a²b (3 slabs)','3ab² (3 slabs)','b³ (1 piece)'];
var counts=[1,3,3,1];
var colors=['#3b82f6','#10b981','#f59e0b','#ec4899'];
var trace={x:labels,y:counts,type:'bar',marker:{color:colors},text:counts.map(function(c){return c+' piece(s)';}),textposition:'auto',hovertemplate:'%{x}: %{y}<extra></extra>',name:'piece count'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'piece type inside the (a+b)³ cube',gridcolor:'rgba(255,255,255,0.05)'},yaxis:{title:'how many of this piece',gridcolor:'rgba(255,255,255,0.05)',range:[0,4]},margin:{t:30,r:30,b:60,l:60},showlegend:false};
Plotly.newPlot('plot-l51-cube-en',[trace],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Verify $(1+1)^3 = 8$ from the identity. With $a=b=1$: $1 + 3 + 3 + 1 = 8$. Now try $(2)^3 = 8$ directly. They match.</div></div>

<h2 class="lesson-title">4. Sum and Difference of Cubes — Factoring Identities</h2>

<div class="calc-highlight"><strong>The sum and difference of cubes</strong> $a^3 \\pm b^3$ each factor into a linear factor times a quadratic factor. These are not as famous as the difference of squares, but they show up everywhere in algebra exams and in calculus problems involving limits.</div>

<div class="calc-formula"><div class="formula-label">SUM OF CUBES</div><div class="formula-main">$$a^3 + b^3 \\;=\\; (a+b)(a^2 - ab + b^2)$$</div><div class="formula-sub">Sign pattern: first factor has + (matches a^3 + b^3); middle term of second factor has the opposite sign (-ab).</div></div>

<div class="calc-formula"><div class="formula-label">DIFFERENCE OF CUBES</div><div class="formula-main">$$a^3 - b^3 \\;=\\; (a-b)(a^2 + ab + b^2)$$</div><div class="formula-sub">Sign pattern: first factor has - (matches a^3 - b^3); middle term of second factor has the opposite sign (+ab).</div></div>

<p class="l-text"><strong>Mnemonic — "SOAP":</strong> Same, Opposite, Always Positive. The first factor matches the sign of the original cube (Same), the middle term of the quadratic gets the Opposite sign, and the last term of the quadratic is Always Positive.</p>

<p class="l-text"><strong>Verification of the sum-of-cubes formula:</strong></p>

<div class="calc-formula"><div class="formula-label">CHECK BY EXPANSION</div><div class="formula-main">$$(a+b)(a^2 - ab + b^2) \\;=\\; a^3 - a^2 b + ab^2 + a^2 b - ab^2 + b^3 \\;=\\; a^3 + b^3$$</div><div class="formula-sub">Four of the six middle terms cancel in pairs, leaving only the two cubes.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Factor $x^3 + 8$.<br><br>Write 8 as $2^3$. Use sum of cubes with $a=x$, $b=2$:<br><br>$x^3 + 8 = x^3 + 2^3 = (x+2)(x^2 - 2x + 4)$.<br><br>Answer: $\\mathbf{(x+2)(x^2 - 2x + 4)}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Factor $27y^3 - 64$.<br><br>Write $27y^3 = (3y)^3$ and $64 = 4^3$. Use difference of cubes with $a=3y$, $b=4$:<br><br>$27y^3 - 64 = (3y-4)((3y)^2 + (3y)(4) + 4^2) = (3y-4)(9y^2 + 12y + 16)$.<br><br>Answer: $\\mathbf{(3y-4)(9y^2 + 12y + 16)}$.</div></div>

<div class="l-note"><strong>The quadratic factor cannot be factored further (over the reals).</strong> If you try the discriminant $b^2 - 4ac$ on $a^2 \\mp ab + b^2$ with $a$ as the variable, you get a negative number — so the quadratic has no real roots. The factoring stops at this step.</div>

<h2 class="lesson-title">5. The Three-Term Square Revisited</h2>

<div class="calc-highlight"><strong>Although we already met $(a+b+c)^2$ in section 1</strong>, it deserves its own short section because it appears in every geometry exam (think of expanding the square of a side written as a sum of three pieces) and in every probability calculation (the square of a sum of three events).</div>

<div class="calc-formula"><div class="formula-label">$(a+b+c)^2$ — FULL EXPANSION</div><div class="formula-main">$$(a+b+c)^2 \\;=\\; a^2 + b^2 + c^2 + 2(ab + ac + bc)$$</div><div class="formula-sub">Compactly: the sum of the three squares plus twice the sum of the three pairwise products.</div></div>

<p class="l-text"><strong>How to derive it without confusion.</strong> Treat $(a+b+c)^2$ as $((a+b) + c)^2$. By the square-of-a-sum identity with two terms:</p>

<div class="calc-formula"><div class="formula-label">STEP-BY-STEP DERIVATION</div><div class="formula-main">$$((a+b)+c)^2 \\;=\\; (a+b)^2 + 2(a+b)c + c^2$$ $$= a^2 + 2ab + b^2 + 2ac + 2bc + c^2$$ $$= a^2 + b^2 + c^2 + 2ab + 2ac + 2bc$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Given $a + b + c = 10$ and $ab + ac + bc = 25$, find $a^2 + b^2 + c^2$.<br><br>Use $(a+b+c)^2 = a^2 + b^2 + c^2 + 2(ab+ac+bc)$.<br><br>$100 = (a^2+b^2+c^2) + 2(25) = (a^2+b^2+c^2) + 50$.<br><br>So $a^2 + b^2 + c^2 = \\mathbf{50}$.</div></div>

<div class="think-box"><div class="think-label">USEFUL IDENTITY</div><div class="think-body">Rearranging the three-term square gives a tool that appears in <em>countless</em> exam problems: $$a^2 + b^2 + c^2 = (a+b+c)^2 - 2(ab+ac+bc).$$ If a problem gives you both the sum and the pairwise-product sum, the sum of squares falls out instantly.</div></div>

<h2 class="lesson-title">6. Pascal's Triangle</h2>

<div class="calc-highlight"><strong>Pascal's triangle</strong> is a triangular arrangement of numbers in which every entry is the sum of the two entries directly above it. The pattern was known to Indian, Persian and Chinese mathematicians centuries before Pascal — but the French mathematician Blaise Pascal (1623-1662) was the first to systematically connect it to probability and to the binomial expansion.</div>

<p class="l-text"><strong>How to build it.</strong> Start with a single 1 at the top (row 0). Each new row starts and ends with 1; every interior entry is the sum of the two entries above it (one to the upper-left, one to the upper-right). Treating empty positions as 0, the rule never breaks down.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.95rem;text-align:center">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.5rem 0.6rem;color:#3b82f6">Row n</th>
<th style="padding:0.5rem 0.6rem;color:#3b82f6">Entries</th>
<th style="padding:0.5rem 0.6rem;color:#3b82f6">Row sum (2ⁿ)</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.9)">
<tr><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>1   1</td><td>2</td></tr>
<tr><td>2</td><td>1   2   1</td><td>4</td></tr>
<tr><td>3</td><td>1   3   3   1</td><td>8</td></tr>
<tr><td>4</td><td>1   4   6   4   1</td><td>16</td></tr>
<tr><td>5</td><td>1   5  10  10   5   1</td><td>32</td></tr>
<tr><td>6</td><td>1   6  15  20  15   6   1</td><td>64</td></tr>
<tr><td>7</td><td>1   7  21  35  35  21   7   1</td><td>128</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l51-pascal-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the first ten rows of Pascal's triangle as a heat map. Each row $n$ has $n+1$ entries; warm colours mark large central entries, cool colours mark the 1s at the edges. Notice how the largest entry of each row sits in (or near) the middle — exactly the symmetry $\\binom{n}{k} = \\binom{n}{n-k}$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var maxRow=10;
var triangle=[];
for(var n=0;n<=maxRow;n++){var row=[];for(var k=0;k<=maxRow;k++){if(k>n){row.push(null);continue;}var v=1;for(var i=1;i<=k;i++){v=v*(n-i+1)/i;}row.push(Math.round(v));}triangle.push(row);}
var trace={z:triangle,type:'heatmap',colorscale:[[0,'rgba(15,15,30,0.4)'],[0.1,'#1e3a8a'],[0.3,'#3b82f6'],[0.6,'#f59e0b'],[1.0,'#ef4444']],showscale:true,colorbar:{title:{text:'C(n,k)',font:{color:'#e8e8e8'}},tickfont:{color:'#e8e8e8'}},hovertemplate:'row n=%{y}, position k=%{x}<br>C(n,k)=%{z}<extra></extra>'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'k (position in row)',gridcolor:'rgba(255,255,255,0.05)',dtick:1},yaxis:{title:'n (row index)',gridcolor:'rgba(255,255,255,0.05)',autorange:'reversed',dtick:1},margin:{t:30,r:30,b:60,l:60}};
Plotly.newPlot('plot-l51-pascal-en',[trace],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Key patterns hidden in Pascal's triangle.</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Symmetry</div><div class="card-body">Every row reads the same left-to-right as right-to-left. The kth entry from the left equals the kth entry from the right.</div></div>
<div class="calc-card"><div class="card-title">Row sum = 2ⁿ</div><div class="card-body">Adding the entries in row n gives $2^n$. (Row 4: $1+4+6+4+1 = 16 = 2^4$.) This is because $(1+1)^n = 2^n$ — the binomial theorem with $a=b=1$.</div></div>
<div class="calc-card"><div class="card-title">Hockey stick</div><div class="card-body">Sum along a diagonal starting from the left edge equals the entry just below and to the right of the diagonal's end. A beautiful identity that appears in combinatorial proofs.</div></div>
</div>

<h2 class="lesson-title">7. Binomial Coefficients</h2>

<div class="calc-highlight"><strong>Every entry in Pascal's triangle has a name and a formula.</strong> The entry in row $n$, position $k$ (counting from $k=0$) is called the <em>binomial coefficient</em> "n choose k" and written $\\binom{n}{k}$. It counts the number of ways to pick $k$ objects out of $n$ without caring about order.</div>

<div class="calc-formula"><div class="formula-label">BINOMIAL COEFFICIENT — DEFINITION</div><div class="formula-main">$$\\binom{n}{k} \\;=\\; \\frac{n!}{k!\\,(n-k)!}$$</div><div class="formula-sub">Read as "n choose k". n!, "n factorial", means $n \\cdot (n-1) \\cdot (n-2) \\cdots 2 \\cdot 1$. By convention $0! = 1$.</div></div>

<p class="l-text"><strong>Factorials to know:</strong></p>

<div style="overflow-x:auto;margin:1rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;text-align:center">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.5rem 0.6rem;color:#3b82f6">n</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.9)">
<tr><td style="padding:0.4rem 0.6rem">n!</td><td>1</td><td>1</td><td>2</td><td>6</td><td>24</td><td>120</td><td>720</td><td>5040</td><td>40320</td></tr>
</tbody></table>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Compute $\\binom{5}{2}$.<br><br>$\\binom{5}{2} = \\dfrac{5!}{2! \\, 3!} = \\dfrac{120}{2 \\cdot 6} = \\dfrac{120}{12} = 10$.<br><br>Cross-check: row 5 of Pascal's triangle is 1, 5, 10, 10, 5, 1. The entry at position $k=2$ is indeed 10.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Compute $\\binom{7}{3}$.<br><br>$\\binom{7}{3} = \\dfrac{7!}{3! \\, 4!} = \\dfrac{5040}{6 \\cdot 24} = \\dfrac{5040}{144} = 35$.<br><br>Cross-check: row 7 of Pascal's triangle is 1, 7, 21, 35, 35, 21, 7, 1. Position $k=3$ gives 35.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Symmetry property</div><div class="card-body">$\\binom{n}{k} = \\binom{n}{n-k}$. Choosing $k$ to include is the same as choosing $n-k$ to leave out.</div></div>
<div class="calc-card"><div class="card-title">Edge cases</div><div class="card-body">$\\binom{n}{0} = \\binom{n}{n} = 1$. There is exactly one way to pick nothing, and exactly one way to pick everything.</div></div>
<div class="calc-card"><div class="card-title">Pascal's rule</div><div class="card-body">$\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$. This is exactly the "sum of the two above" rule that builds the triangle.</div></div>
</div>

<h2 class="lesson-title">8. The Binomial Theorem</h2>

<div class="calc-highlight"><strong>The binomial theorem</strong> combines everything in this lesson into one master identity. It tells you how to expand any power $(a+b)^n$ — for any positive integer $n$ — into a sum of $(n+1)$ terms whose coefficients are exactly the entries of row $n$ in Pascal's triangle.</div>

<div class="calc-formula"><div class="formula-label">THE BINOMIAL THEOREM</div><div class="formula-main">$$(a+b)^n \\;=\\; \\sum_{k=0}^{n} \\binom{n}{k} \\, a^{n-k} \\, b^{k}$$</div><div class="formula-sub">Each term has the form (coefficient) × (a to some power) × (b to some power). The exponents of a decrease from n down to 0; the exponents of b increase from 0 up to n; the two exponents always sum to n.</div></div>

<p class="l-text"><strong>What the theorem says in words.</strong> The expansion of $(a+b)^n$ produces $n+1$ terms. The $k$th term (counting from $k=0$) is $\\binom{n}{k} a^{n-k} b^{k}$. Every "ingredient" of every term comes from one of three places: the binomial coefficient from Pascal's triangle, the power of $a$ from how many of the $n$ factors gave us an $a$, and the power of $b$ from how many gave us a $b$. The sum of the two powers is always $n$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — VERIFY $(a+b)^4$</div><div class="example-body">Row 4 of Pascal's triangle is $1, 4, 6, 4, 1$. So<br><br>$(a+b)^4 = a^4 + 4a^3 b + 6a^2 b^2 + 4ab^3 + b^4$.<br><br>Check by FOIL: $(a+b)^4 = ((a+b)^2)^2 = (a^2 + 2ab + b^2)^2$. Squaring this three-term expression gives the same six-term answer — match.</div></div>

<h2 class="lesson-title">9. Worked Examples — Specific-Term Extraction</h2>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 — EXPAND $(x+2)^5$</div><div class="example-body">Row 5 coefficients: $1, 5, 10, 10, 5, 1$. With $a=x$, $b=2$:<br><br>$(x+2)^5 = x^5 + 5x^4(2) + 10x^3(4) + 10x^2(8) + 5x(16) + 32$<br>$= x^5 + 10x^4 + 40x^3 + 80x^2 + 80x + 32$.<br><br>Answer: $\\mathbf{x^5 + 10x^4 + 40x^3 + 80x^2 + 80x + 32}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — EXPAND $(2x - 3y)^4$</div><div class="example-body">Row 4 coefficients: $1, 4, 6, 4, 1$. With $a = 2x$ and $b = -3y$:<br><br>$(2x-3y)^4 = (2x)^4 + 4(2x)^3(-3y) + 6(2x)^2(-3y)^2 + 4(2x)(-3y)^3 + (-3y)^4$<br>$= 16x^4 - 96x^3 y + 216 x^2 y^2 - 216 x y^3 + 81 y^4$.<br><br>Notice the alternating signs (-, +, -, +) caused by $b = -3y$: every other term picks up a minus.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — FIND A SPECIFIC TERM</div><div class="example-body">Find the term containing $x^3$ in the expansion of $(x + 4)^7$.<br><br>The general term is $\\binom{7}{k} x^{7-k} \\cdot 4^k$. We want the exponent of $x$ to be 3, so $7 - k = 3 \\Rightarrow k = 4$.<br><br>That term is $\\binom{7}{4} x^3 \\cdot 4^4 = 35 \\cdot x^3 \\cdot 256 = 8960\\, x^3$.<br><br>Answer: the $x^3$ term is $\\mathbf{8960 x^3}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4 — MIDDLE TERM OF $(x + 1/x)^{10}$</div><div class="example-body">There are 11 terms (k = 0, 1, ..., 10). The middle is at $k = 5$.<br><br>General term: $\\binom{10}{k} x^{10-k} (1/x)^k = \\binom{10}{k} x^{10-2k}$.<br><br>At $k=5$: $\\binom{10}{5} x^{0} = 252$.<br><br>Answer: middle term is the constant $\\mathbf{252}$.</div></div>

<div class="think-box"><div class="think-label">PATTERN TO MEMORISE</div><div class="think-body">To find the term containing a specific power of $x$ in $(a + b)^n$ where $a$ and $b$ each carry one or more $x$ factors: write the general term $\\binom{n}{k} a^{n-k} b^{k}$, collect the total exponent of $x$, set it equal to the target, solve for $k$, then plug in. The whole procedure takes 30 seconds once you have practiced.</div></div>

<h2 class="lesson-title">10. Classical Exercises</h2>

<p class="l-text">Try each problem yourself first. Answers and solutions follow.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body">Expand $(2x + 3)^2$.<br><br>Solution: $4x^2 + 12x + 9$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body">Factor $25x^2 - 16y^2$.<br><br>Solution: $(5x - 4y)(5x + 4y)$ using $a^2 - b^2$ with $a = 5x$, $b = 4y$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body">Compute $98 \\times 102$ mentally.<br><br>Solution: $(100-2)(100+2) = 10000 - 4 = \\mathbf{9996}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4</div><div class="example-body">Expand $(x - 5)^3$.<br><br>Solution: $x^3 - 3(x^2)(5) + 3(x)(25) - 125 = x^3 - 15x^2 + 75x - 125$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5</div><div class="example-body">Factor $x^3 + 27$.<br><br>Solution: $x^3 + 3^3 = (x+3)(x^2 - 3x + 9)$ by sum of cubes.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6</div><div class="example-body">If $x + y = 7$ and $xy = 12$, find $x^2 + y^2$ and $x^3 + y^3$.<br><br>Solution: $(x+y)^2 = x^2 + 2xy + y^2 \\Rightarrow 49 = (x^2+y^2) + 24 \\Rightarrow x^2 + y^2 = 25$.<br>Use $x^3+y^3 = (x+y)(x^2 - xy + y^2) = 7 \\cdot (25 - 12) = 7 \\cdot 13 = \\mathbf{91}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7</div><div class="example-body">Expand $(1 + x)^6$ in full.<br><br>Solution: row 6 coefficients are $1, 6, 15, 20, 15, 6, 1$. So $$(1+x)^6 = 1 + 6x + 15x^2 + 20x^3 + 15x^4 + 6x^5 + x^6.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8</div><div class="example-body">Find the coefficient of $x^4$ in $(2x - 1)^7$.<br><br>Solution: general term is $\\binom{7}{k}(2x)^{7-k}(-1)^k$. We want the exponent of $x$ to be 4, so $7-k=4 \\Rightarrow k=3$. The term is $\\binom{7}{3}(2x)^4(-1)^3 = 35 \\cdot 16 x^4 \\cdot (-1) = -560 x^4$. So the coefficient is $\\mathbf{-560}$.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> In the next lesson we will use the difference of squares and difference of cubes to factor more elaborate polynomial expressions, and in later lessons the binomial theorem will return as a tool for computing probabilities, approximating $(1+x)^n$ for small $x$, and even (in calculus) generating Taylor series.</div>

<h2 class="lesson-title">11. Identity Quick-Reference Table</h2>

<p class="l-text">All the algebraic identities in this lesson at a glance. Print this table, stick it on your desk, and refer back to it until every row feels automatic.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:#0a0a0a;color:rgba(235,230,220,0.92);border:1px solid rgba(59,130,246,0.18)">
<thead><tr style="background:rgba(59,130,246,0.15);border-bottom:2px solid #3b82f6">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6;font-weight:700">Identity</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6;font-weight:700">Expansion / Factoring</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6;font-weight:700">When to use it</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Square of a sum</td><td style="padding:0.55rem 0.8rem">$(a+b)^2 = a^2 + 2ab + b^2$</td><td style="padding:0.55rem 0.8rem">Expanding any $(\\square + \\square)^2$; quadratic completing-the-square.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Square of a difference</td><td style="padding:0.55rem 0.8rem">$(a-b)^2 = a^2 - 2ab + b^2$</td><td style="padding:0.55rem 0.8rem">Same as above with a minus sign; distance formulas.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Difference of squares</td><td style="padding:0.55rem 0.8rem">$a^2 - b^2 = (a-b)(a+b)$</td><td style="padding:0.55rem 0.8rem">Factoring; mental arithmetic shortcuts like $103 \\times 97$.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Three-term square</td><td style="padding:0.55rem 0.8rem">$(a+b+c)^2 = a^2 + b^2 + c^2 + 2(ab+ac+bc)$</td><td style="padding:0.55rem 0.8rem">When given $a+b+c$ and $ab+ac+bc$, recover $a^2+b^2+c^2$.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Cube of a sum</td><td style="padding:0.55rem 0.8rem">$(a+b)^3 = a^3 + 3a^2 b + 3ab^2 + b^3$</td><td style="padding:0.55rem 0.8rem">Expanding cubes; coefficients 1, 3, 3, 1 (row 3 of Pascal).</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Cube of a difference</td><td style="padding:0.55rem 0.8rem">$(a-b)^3 = a^3 - 3a^2 b + 3ab^2 - b^3$</td><td style="padding:0.55rem 0.8rem">Same coefficients, alternating signs $+, -, +, -$.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Sum of cubes</td><td style="padding:0.55rem 0.8rem">$a^3 + b^3 = (a+b)(a^2 - ab + b^2)$</td><td style="padding:0.55rem 0.8rem">Factoring; remember "SOAP" — Same, Opposite, Always Positive.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Difference of cubes</td><td style="padding:0.55rem 0.8rem">$a^3 - b^3 = (a-b)(a^2 + ab + b^2)$</td><td style="padding:0.55rem 0.8rem">Factoring; calculus limits like $\\lim_{x\\to a}\\frac{x^3-a^3}{x-a}$.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Pascal's rule</td><td style="padding:0.55rem 0.8rem">$\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$</td><td style="padding:0.55rem 0.8rem">Builds the triangle row by row; combinatorial proofs.</td></tr>
<tr><td style="padding:0.55rem 0.8rem">Binomial theorem (general)</td><td style="padding:0.55rem 0.8rem">$(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^{k}$</td><td style="padding:0.55rem 0.8rem">Any positive-integer power; finding a single term without writing the rest.</td></tr>
</tbody></table>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$(a \\pm b)^2 = a^2 \\pm 2ab + b^2$ — never forget the cross term</li>
<li>$a^2 - b^2 = (a-b)(a+b)$ — backed by a one-picture area proof</li>
<li>$(a \\pm b)^3 = a^3 \\pm 3a^2 b + 3ab^2 \\pm b^3$ — coefficients 1, 3, 3, 1</li>
<li>$a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)$ — remember "SOAP" for the signs</li>
<li>$(a+b+c)^2 = a^2 + b^2 + c^2 + 2(ab + ac + bc)$ — three squares plus three pair products</li>
<li>Pascal's triangle: each entry = sum of the two above; row $n$ has $n+1$ entries summing to $2^n$</li>
<li>$\\binom{n}{k} = \\dfrac{n!}{k!(n-k)!}$ — counts the ways to pick $k$ from $n$</li>
<li>Binomial theorem: $(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^{k}$ — coefficients are exactly row $n$ of Pascal</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bu ders tek bir güçlü fikir üzerine kurulu:</strong> bazı cebirsel ifadeler, içlerine hangi sayıyı koyarsan koy, <em>her zaman</em> birbirine eşittir. Bunlara <em>özdeşlik</em> denir. Bu dersteki beş-altı özdeşlik — toplamın karesi, iki kare farkı, toplamın küpü, küp toplamı ve farkı, ve $(a+b)^n$'in binom açılımı — gireceğin neredeyse her sınav kâğıdında karşına çıkar. Onları ezberlemek, üç satırlık bir çarpanlara ayırmayı tek satıra indirir. Yanlış ezberlemek, beş puanlık bir soruyu sıfır puana indirir.</p>

<p class="l-text">Aynı zamanda Blaise Pascal'a atfedilen güzel bir sayı üçgeniyle tanışacağız. Bu üçgende her satır, bir binom açılımının katsayılarını tek bakışta sana söyler. Dersin sonunda $(2x-3y)^4$'ü kafanda açabilecek, $(x+2)^{10}$ açılımında geri kalanını yazmadan altıncı terimi bulabilecek ve her "sihirli" cebirsel özdeşliğin arkasındaki geometrik şekli tanıyabileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Temel kare özdeşliklerini $(a\\pm b)^2$ ve üç-terimli $(a+b+c)^2$ açılımını hatırlamayı ve uygulamayı</li>
<li>İki kare farkı özdeşliğini $a^2-b^2 = (a-b)(a+b)$ her iki yönde kullanmayı, geometrik alan ispatıyla</li>
<li>$(a\\pm b)^3$'ü cebirsel olarak açmayı ve her katsayıyı kombinatoryal sayımla doğrulamayı</li>
<li>Küp toplamı ve farkı $a^3 \\pm b^3$'ü standart formüllerle çarpanlarına ayırmayı</li>
<li>Pascal üçgenini satır satır kurmayı ve binom katsayılarını $\\binom{n}{k}$ doğrudan ondan okumayı</li>
<li>Binom Teoremi $(a+b)^n = \\sum_{k=0}^{n}\\binom{n}{k}a^{n-k}b^{k}$'yi ifade etmeyi ve herhangi bir açılımda belirli terimleri bulmak için uygulamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Temel Kare Özdeşlikleri</h2>

<div class="calc-highlight"><strong>Karşılaştığın ilk özdeşlik</strong> büyük olasılıkla $(a+b)^2 = a^2 + 2ab + b^2$'ydi. Masum görünüyor. Ama orta terime dikkat et: dikkatsiz bir öğrenci $(a+b)^2 = a^2 + b^2$ yazar ve her soruyu yanlış yapar. <em>Çarpraz terim</em> $2ab$, işin tüm özüdür.</div>

<p class="l-text">En çok karşılaşılan dört ikinci dereceden özdeşliği sıfırdan türetelim. Her biri sadece dikkatli bir dağılma (Birinci-Dış-İç-Son, yani FOIL) — sihir yok.</p>

<div class="calc-formula"><div class="formula-label">TOPLAMIN KARESİ</div><div class="formula-main">$$(a+b)^2 \\;=\\; a^2 + 2ab + b^2$$</div><div class="formula-sub">Türetme: $(a+b)(a+b) = a\\cdot a + a\\cdot b + b\\cdot a + b\\cdot b = a^2 + 2ab + b^2$.</div></div>

<div class="calc-formula"><div class="formula-label">FARKIN KARESİ</div><div class="formula-main">$$(a-b)^2 \\;=\\; a^2 - 2ab + b^2$$</div><div class="formula-sub">Önceki özdeşlikte b yerine -b koy: çarpraz terim bir eksi işareti alır, son terim iki eksi alır ve pozitif kalır.</div></div>

<div class="calc-formula"><div class="formula-label">ÜÇ-TERİMLİ TOPLAMIN KARESİ</div><div class="formula-main">$$(a+b+c)^2 \\;=\\; a^2 + b^2 + c^2 + 2ab + 2ac + 2bc$$</div><div class="formula-sub">Üç kare artı üç çarpraz terim — değişkenlerin her bir çifti için bir çarpraz terim.</div></div>

<div class="calc-formula"><div class="formula-label">KARIŞIK İŞARETLİ ÜÇLÜ</div><div class="formula-main">$$(a-b+c)^2 \\;=\\; a^2 + b^2 + c^2 - 2ab + 2ac - 2bc$$</div><div class="formula-sub">Yukarıdakiyle aynı altı terim, ama her çarpraz terim iki çarpanının çarpımının işaretini alır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İki terimli desen</div><div class="card-body">$(a\\pm b)^2$ her zaman üç terim üretir: bir kare, $\\pm 2$ katsayılı bir çarpraz terim ve başka bir kare.</div></div>
<div class="calc-card"><div class="card-title">Üç terimli desen</div><div class="card-body">$(a \\pm b \\pm c)^2$ her zaman altı terim üretir: üç kare artı üç çarpraz terim, her çift için bir tane.</div></div>
<div class="calc-card"><div class="card-title">n terimli desen</div><div class="card-body">Genelde $(a_1 + \\ldots + a_n)^2$ $n$ kare artı $\\binom{n}{2}$ çarpraz terim üretir — $n=3$ için $3 + 3 = 6$ terim, $n=4$ için $4 + 6 = 10$ terim.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$(3x + 5)^2$ ifadesini aç.<br><br>$(a+b)^2 = a^2 + 2ab + b^2$'yi $a = 3x$, $b = 5$ ile kullan.<br><br>$a^2 = (3x)^2 = 9x^2$.<br>$2ab = 2(3x)(5) = 30x$.<br>$b^2 = 25$.<br><br>Cevap: $\\mathbf{(3x+5)^2 = 9x^2 + 30x + 25}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$(2x - 7y)^2$ ifadesini aç.<br><br>$(a-b)^2 = a^2 - 2ab + b^2$'yi $a = 2x$, $b = 7y$ ile kullan.<br><br>$a^2 = 4x^2$, $2ab = 28xy$, $b^2 = 49y^2$.<br><br>Cevap: $\\mathbf{(2x-7y)^2 = 4x^2 - 28xy + 49y^2}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body">$(x + 2y + 3)^2$ ifadesini aç.<br><br>Üç-terimli kareyi $a = x$, $b = 2y$, $c = 3$ ile kullan.<br><br>Kareler: $x^2 + 4y^2 + 9$.<br>Çarpraz terimler: $2(x)(2y) + 2(x)(3) + 2(2y)(3) = 4xy + 6x + 12y$.<br><br>Cevap: $\\mathbf{x^2 + 4y^2 + 9 + 4xy + 6x + 12y}$.</div></div>

<div class="calc-graph"><div id="plot-l51-areasq-tr-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> kenarı $(a+b)$ olan bir kare dört bölgeye ayrılmış. Büyük mavi kare $a \\times a = a^2$, küçük pembe kare $b \\times b = b^2$ ve iki yeşil dikdörtgenin her birinin alanı $a \\times b = ab$ — toplamda $2ab$. Dört alanı topla: $a^2 + ab + ab + b^2 = a^2 + 2ab + b^2 = (a+b)^2$. "Eksik" çarpraz terim $2ab$ tam olarak göz ardı edemediğin iki dikdörtgendir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a=4,b=2;
var sqA={x:[0,a,a,0,0],y:[0,0,a,a,0],mode:'lines',fill:'toself',name:'a² (a×a)',fillcolor:'rgba(59,130,246,0.35)',line:{color:'#3b82f6',width:2}};
var rect1={x:[a,a+b,a+b,a,a],y:[0,0,a,a,0],mode:'lines',fill:'toself',name:'ab (a×b)',fillcolor:'rgba(16,185,129,0.32)',line:{color:'#10b981',width:2}};
var rect2={x:[0,a,a,0,0],y:[a,a,a+b,a+b,a],mode:'lines',fill:'toself',name:'ab (b×a)',fillcolor:'rgba(16,185,129,0.32)',line:{color:'#10b981',width:2},showlegend:false};
var sqB={x:[a,a+b,a+b,a,a],y:[a,a,a+b,a+b,a],mode:'lines',fill:'toself',name:'b² (b×b)',fillcolor:'rgba(236,72,153,0.38)',line:{color:'#ec4899',width:2}};
var labels={x:[a/2,a+b/2,a/2,a+b/2,a/2,a+b/2],y:[a/2,a/2,a+b/2,a+b/2,-0.5,-0.5],mode:'text',text:['a²','ab','ab','b²','kenar a','kenar b'],textfont:{color:'#e8e8e8',size:14},showlegend:false};
var sideLabels={x:[-0.55,-0.55],y:[a/2,a+b/2],mode:'text',text:['a','b'],textfont:{color:'#e8e8e8',size:14},showlegend:false};
var totalLabel={x:[(a+b)/2],y:[a+b+0.55],mode:'text',text:['(a+b)² = a² + 2ab + b²'],textfont:{color:'#3b82f6',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.2,a+b+0.8],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,title:'(a+b)² alan ayrışımı'},yaxis:{range:[-1.2,a+b+1.2],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:60,l:50},legend:{orientation:'h',y:-0.15,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l51-areasq-tr-extra',[sqA,rect1,rect2,sqB,labels,sideLabels,totalLabel],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">YAYGIN HATA</div><div class="think-body">$(a+b)^2 = a^2 + b^2$ yazmak (çarpraz terimi unutmak) lise öğrencileri arasında en sık görülen cebir hatasıdır. Bu dersten sadece tek bir kuralı hatırlayacaksan, şu olsun: <strong>bir toplamın karesi üç terim üretir, iki değil</strong>.</div></div>

<h2 class="lesson-title">2. İki Kare Farkı — Geometrik İspat</h2>

<div class="calc-highlight"><strong>İki kare farkı</strong> $a^2 - b^2$ her zaman $(a-b)(a+b)$ çarpımı olarak yeniden yazılabilir. Bu, tüm cebirdeki en kullanışlı çarpanlara ayırma özdeşliklerinden biridir — zor bir çıkarmayı dostane bir çarpmaya dönüştürür ve güzel bir tek-resimlik ispatı vardır.</div>

<div class="calc-formula"><div class="formula-label">İKİ KARE FARKI</div><div class="formula-main">$$a^2 - b^2 \\;=\\; (a-b)(a+b)$$</div><div class="formula-sub">Cebirsel doğrulama: $(a-b)(a+b) = a^2 + ab - ab - b^2 = a^2 - b^2$. İki çarpraz terim tam olarak yok olur.</div></div>

<p class="l-text"><strong>Geometrik ispat (alan argümanı).</strong> Kenarı $a$ olan bir kare düşün. Bir köşesinden kenarı $b$ olan küçük bir kare çıkar. Geriye kalan L şeklindeki bölgenin alanı $a^2 - b^2$'dir. Şimdi o L şeklini akıllıca bir çizgi boyunca kes ve iki parçayı bir dikdörtgene yeniden düzenle: bir kenarı $(a-b)$ uzunluğunda, diğer kenarı $(a+b)$ uzunluğunda olur. Dikdörtgenin alanı $(a-b)(a+b)$'dir. Alanların eşleşmesi gerekir — yani $a^2 - b^2 = (a-b)(a+b)$.</p>

<div class="calc-graph"><div id="plot-l51-diffsq-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> solda, bir köşesinden kenarı $b$ olan küçük bir kare çıkarılmış, kenarı $a$ olan bir kare — toplam alan $a^2 - b^2$. Sağda, aynı alan $(a+b) \\times (a-b)$ boyutlarında bir dikdörtgen olarak düzenlenmiş. Renkler eşleşiyor: iki bölge aynı alana sahip, sadece yeniden düzenlenmiş.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a=5,b=2;
var leftRect={x:[0,a,a,0,0],y:[0,0,a,a,0],mode:'lines',fill:'toself',name:'a × a',fillcolor:'rgba(59,130,246,0.25)',line:{color:'#3b82f6',width:2}};
var leftHole={x:[a-b,a,a,a-b,a-b],y:[a-b,a-b,a,a,a-b],mode:'lines',fill:'toself',name:'b × b çıkar',fillcolor:'rgba(10,10,10,1)',line:{color:'#ef4444',width:2,dash:'dash'}};
var leftLabel={x:[a/2,a-b/2,(a-b)/2+0.3],y:[-0.4,a+0.3,a-b/2],mode:'text',text:['kenar a','b','alan a²-b²'],textfont:{color:'#e8e8e8',size:12},showlegend:false};
var offset=8;
var rightRect={x:[offset,offset+(a+b),offset+(a+b),offset,offset],y:[0,0,a-b,a-b,0],mode:'lines',fill:'toself',name:'(a+b) × (a-b)',fillcolor:'rgba(16,185,129,0.25)',line:{color:'#10b981',width:2}};
var splitLine={x:[offset+a,offset+a],y:[0,a-b],mode:'lines',name:'kesim çizgisi',line:{color:'rgba(255,255,255,0.4)',width:1.4,dash:'dot'}};
var rightLabel={x:[offset+(a+b)/2,offset-0.6,offset+a/2,offset+a+b/2],y:[-0.4,(a-b)/2,(a-b)/2,(a-b)/2],mode:'text',text:['kenar a+b','a-b','parça A','parça B'],textfont:{color:'#e8e8e8',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1,offset+a+b+1],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,title:'yeniden düzenlenmiş alan'},yaxis:{range:[-1.2,a+1],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l51-diffsq-tr',[leftRect,leftHole,leftLabel,rightRect,splitLine,rightLabel],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$x^2 - 49$ ifadesini çarpanlarına ayır.<br><br>49'u $7^2$ olarak yaz. O zaman $x^2 - 49 = x^2 - 7^2 = (x-7)(x+7)$.<br><br>Cevap: $\\mathbf{(x-7)(x+7)}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$103 \\times 97$'yi zihinden hesapla.<br><br>Dikkat: $103 = 100 + 3$ ve $97 = 100 - 3$. O zaman $103 \\times 97 = (100+3)(100-3) = 100^2 - 3^2 = 10000 - 9 = \\mathbf{9991}$.<br><br>Bu, iki kare farkı hilesinin zihinden hesap için kullanılışıdır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body">$9x^4 - 16y^2$ ifadesini çarpanlarına ayır.<br><br>Her terimi kare olarak yaz: $9x^4 = (3x^2)^2$ ve $16y^2 = (4y)^2$. O zaman $9x^4 - 16y^2 = (3x^2 - 4y)(3x^2 + 4y)$.<br><br>Cevap: $\\mathbf{(3x^2 - 4y)(3x^2 + 4y)}$.</div></div>

<div class="l-note"><strong>Önemli uyarı:</strong> iki karenin <em>toplamı</em> $a^2 + b^2$ reel sayılar üzerinde çarpanlarına ayrılmaz. Sadece <em>fark</em> $a^2 - b^2$'nin güzel bir çarpanlaması vardır. İkisini karıştırmak başka bir yaygın hatadır.</div>

<h2 class="lesson-title">3. Küpler — $(a \\pm b)^3$ Açılımı</h2>

<div class="calc-highlight"><strong>Toplamın veya farkın küpü bir sonraki adımdır.</strong> (Karedeki gibi) üç terim yerine dört terim elde ederiz. Katsayılar 1, 3, 3, 1 desenini oluşturur — ve bu dört sayı 6. bölümde Pascal üçgeniyle tanıştığımızda yeniden karşımıza çıkacak. Deseni şimdi ezberle, binom teoremi daha sonra zahmetsiz olacak.</div>

<div class="calc-formula"><div class="formula-label">TOPLAMIN KÜPÜ</div><div class="formula-main">$$(a+b)^3 \\;=\\; a^3 + 3a^2 b + 3ab^2 + b^3$$</div><div class="formula-sub">Katsayılar: 1, 3, 3, 1. a'nın üsleri 3'ten 0'a azalır, b'nin üsleri 0'dan 3'e artar. İki üs toplamı her zaman 3'tür.</div></div>

<div class="calc-formula"><div class="formula-label">FARKIN KÜPÜ</div><div class="formula-main">$$(a-b)^3 \\;=\\; a^3 - 3a^2 b + 3ab^2 - b^3$$</div><div class="formula-sub">Aynı katsayılar (1, 3, 3, 1) ama işaretler değişiyor: +, -, +, -.</div></div>

<p class="l-text"><strong>Toplamın küpünün ispatı.</strong> Adım adım hesapla:</p>

<div class="calc-formula"><div class="formula-label">TÜRETİM</div><div class="formula-main">$$(a+b)^3 = (a+b)(a+b)^2 = (a+b)(a^2 + 2ab + b^2)$$ $$= a^3 + 2a^2 b + ab^2 + a^2 b + 2ab^2 + b^3$$ $$= a^3 + 3a^2 b + 3ab^2 + b^3$$</div><div class="formula-sub">Üç orta terim ikiye iner: 2a²b + a²b = 3a²b ve ab² + 2ab² = 3ab².</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$(x + 2)^3$ ifadesini aç.<br><br>$(a+b)^3 = a^3 + 3a^2 b + 3ab^2 + b^3$'ü $a = x$, $b = 2$ ile kullan.<br><br>$a^3 = x^3$.<br>$3a^2 b = 3 \\cdot x^2 \\cdot 2 = 6x^2$.<br>$3ab^2 = 3 \\cdot x \\cdot 4 = 12x$.<br>$b^3 = 8$.<br><br>Cevap: $\\mathbf{(x+2)^3 = x^3 + 6x^2 + 12x + 8}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$(2x - 3)^3$ ifadesini aç.<br><br>$(a-b)^3 = a^3 - 3a^2 b + 3ab^2 - b^3$'ü $a = 2x$, $b = 3$ ile kullan.<br><br>$a^3 = 8x^3$.<br>$3a^2 b = 3 \\cdot 4x^2 \\cdot 3 = 36x^2$.<br>$3ab^2 = 3 \\cdot 2x \\cdot 9 = 54x$.<br>$b^3 = 27$.<br><br>Cevap: $\\mathbf{8x^3 - 36x^2 + 54x - 27}$.</div></div>

<div class="calc-graph"><div id="plot-l51-cube-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> kenarı $(a+b)$ olan bir küp, sekiz daha küçük parçaya bölünmüş. Bir köşede bir tane $a \\times a \\times a$ parça, ters köşede bir tane $b \\times b \\times b$ parça, üç tane $a \\times a \\times b$ levha şeklinde parça ve üç tane $a \\times b \\times b$ levha parça vardır. Parçaları saymak $a^3 + 3a^2 b + 3ab^2 + b^3$ üretir — tam olarak toplam-küpü özdeşliği.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var labels=['a³ (1 parça)','3a²b (3 levha)','3ab² (3 levha)','b³ (1 parça)'];
var counts=[1,3,3,1];
var colors=['#3b82f6','#10b981','#f59e0b','#ec4899'];
var trace={x:labels,y:counts,type:'bar',marker:{color:colors},text:counts.map(function(c){return c+' adet';}),textposition:'auto',hovertemplate:'%{x}: %{y}<extra></extra>',name:'parça sayısı'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'(a+b)³ küpünün içindeki parça tipi',gridcolor:'rgba(255,255,255,0.05)'},yaxis:{title:'bu parçadan kaç tane',gridcolor:'rgba(255,255,255,0.05)',range:[0,4]},margin:{t:30,r:30,b:60,l:60},showlegend:false};
Plotly.newPlot('plot-l51-cube-tr',[trace],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Özdeşlikten $(1+1)^3 = 8$'i doğrula. $a=b=1$ ile: $1 + 3 + 3 + 1 = 8$. Şimdi $(2)^3 = 8$'i doğrudan dene. Eşleşiyor.</div></div>

<h2 class="lesson-title">4. Küp Toplamı ve Farkı — Çarpanlara Ayırma Özdeşlikleri</h2>

<div class="calc-highlight"><strong>Küp toplamı ve farkı</strong> $a^3 \\pm b^3$ her biri bir doğrusal çarpan ile bir ikinci dereceden çarpana ayrılır. Bunlar iki kare farkı kadar ünlü değildir, ama cebir sınavlarında ve kalkülüsteki limit sorularında her yerde karşına çıkar.</div>

<div class="calc-formula"><div class="formula-label">KÜP TOPLAMI</div><div class="formula-main">$$a^3 + b^3 \\;=\\; (a+b)(a^2 - ab + b^2)$$</div><div class="formula-sub">İşaret deseni: birinci çarpan + (a^3 + b^3'le eşleşir); ikinci çarpanın orta terimi zıt işaret (-ab).</div></div>

<div class="calc-formula"><div class="formula-label">KÜP FARKI</div><div class="formula-main">$$a^3 - b^3 \\;=\\; (a-b)(a^2 + ab + b^2)$$</div><div class="formula-sub">İşaret deseni: birinci çarpan - (a^3 - b^3'le eşleşir); ikinci çarpanın orta terimi zıt işaret (+ab).</div></div>

<p class="l-text"><strong>Anımsatma — "SOAP":</strong> Same (Aynı), Opposite (Zıt), Always Positive (Her Zaman Pozitif). Birinci çarpan orijinal küpün işaretiyle aynıdır, ikinci dereceden çarpanın orta terimi Zıt işareti alır, ikinci dereceden çarpanın son terimi Her Zaman Pozitiftir.</p>

<p class="l-text"><strong>Küp-toplamı formülünün doğrulanması:</strong></p>

<div class="calc-formula"><div class="formula-label">AÇILIMLA KONTROL</div><div class="formula-main">$$(a+b)(a^2 - ab + b^2) \\;=\\; a^3 - a^2 b + ab^2 + a^2 b - ab^2 + b^3 \\;=\\; a^3 + b^3$$</div><div class="formula-sub">Altı orta terimin dördü çiftler hâlinde yok olur, sadece iki küp kalır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$x^3 + 8$ ifadesini çarpanlarına ayır.<br><br>8'i $2^3$ olarak yaz. Küp toplamını $a=x$, $b=2$ ile kullan:<br><br>$x^3 + 8 = x^3 + 2^3 = (x+2)(x^2 - 2x + 4)$.<br><br>Cevap: $\\mathbf{(x+2)(x^2 - 2x + 4)}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$27y^3 - 64$ ifadesini çarpanlarına ayır.<br><br>$27y^3 = (3y)^3$ ve $64 = 4^3$ olarak yaz. Küp farkını $a=3y$, $b=4$ ile kullan:<br><br>$27y^3 - 64 = (3y-4)((3y)^2 + (3y)(4) + 4^2) = (3y-4)(9y^2 + 12y + 16)$.<br><br>Cevap: $\\mathbf{(3y-4)(9y^2 + 12y + 16)}$.</div></div>

<div class="l-note"><strong>İkinci dereceden çarpan daha fazla çarpanlarına ayrılamaz (reel sayılar üzerinde).</strong> $a^2 \\mp ab + b^2$'de $a$'yı değişken alıp diskriminant $b^2 - 4ac$'ı denersen negatif bir sayı çıkar — yani ikinci dereceden ifadenin reel kökü yoktur. Çarpanlara ayırma burada durur.</div>

<h2 class="lesson-title">5. Üç-Terimli Karenin Yeniden Ele Alınması</h2>

<div class="calc-highlight"><strong>Bölüm 1'de $(a+b+c)^2$ ile zaten tanışmış olsak da</strong>, kendi kısa bölümünü hak ediyor çünkü her geometri sınavında (üç parçanın toplamı olarak yazılmış bir kenarın karesini açmayı düşün) ve her olasılık hesabında (üç olayın toplamının karesi) karşına çıkar.</div>

<div class="calc-formula"><div class="formula-label">$(a+b+c)^2$ — TAM AÇILIM</div><div class="formula-main">$$(a+b+c)^2 \\;=\\; a^2 + b^2 + c^2 + 2(ab + ac + bc)$$</div><div class="formula-sub">Sıkıştırılmış hâli: üç karenin toplamı artı üç ikili çarpımın iki katı.</div></div>

<p class="l-text"><strong>Karışıklığa düşmeden nasıl türetilir.</strong> $(a+b+c)^2$'yi $((a+b) + c)^2$ olarak ele al. İki terimli toplamın karesi özdeşliğiyle:</p>

<div class="calc-formula"><div class="formula-label">ADIM ADIM TÜRETİM</div><div class="formula-main">$$((a+b)+c)^2 \\;=\\; (a+b)^2 + 2(a+b)c + c^2$$ $$= a^2 + 2ab + b^2 + 2ac + 2bc + c^2$$ $$= a^2 + b^2 + c^2 + 2ab + 2ac + 2bc$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$a + b + c = 10$ ve $ab + ac + bc = 25$ verildiğinde, $a^2 + b^2 + c^2$'yi bul.<br><br>$(a+b+c)^2 = a^2 + b^2 + c^2 + 2(ab+ac+bc)$'yi kullan.<br><br>$100 = (a^2+b^2+c^2) + 2(25) = (a^2+b^2+c^2) + 50$.<br><br>O zaman $a^2 + b^2 + c^2 = \\mathbf{50}$.</div></div>

<div class="think-box"><div class="think-label">FAYDALI ÖZDEŞLİK</div><div class="think-body">Üç-terimli kareyi yeniden düzenlemek, <em>sayısız</em> sınav sorusunda karşına çıkacak bir araç verir: $$a^2 + b^2 + c^2 = (a+b+c)^2 - 2(ab+ac+bc).$$ Bir soruda hem toplam hem de ikili çarpım toplamı verilirse, karelerin toplamı anında düşer.</div></div>

<h2 class="lesson-title">6. Pascal Üçgeni</h2>

<div class="calc-highlight"><strong>Pascal üçgeni</strong>, her girişin doğrudan üstündeki iki girişin toplamı olduğu üçgen şeklindeki bir sayı dizilimidir. Bu desen, Pascal'dan yüzyıllar önce Hint, İran ve Çin matematikçileri tarafından biliniyordu — ama bunu olasılık ve binom açılımıyla sistematik olarak ilk ilişkilendiren Fransız matematikçi Blaise Pascal (1623-1662) oldu.</div>

<p class="l-text"><strong>Nasıl kurulur.</strong> En üstte (0. satır) tek bir 1 ile başla. Her yeni satır 1 ile başlar ve 1 ile biter; her iç giriş üstündeki iki girişin toplamıdır (biri sol üst, biri sağ üst). Boş konumları 0 olarak ele alırsan kural hiç bozulmaz.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.95rem;text-align:center">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.5rem 0.6rem;color:#3b82f6">Satır n</th>
<th style="padding:0.5rem 0.6rem;color:#3b82f6">Girişler</th>
<th style="padding:0.5rem 0.6rem;color:#3b82f6">Satır toplamı (2ⁿ)</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.9)">
<tr><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>1   1</td><td>2</td></tr>
<tr><td>2</td><td>1   2   1</td><td>4</td></tr>
<tr><td>3</td><td>1   3   3   1</td><td>8</td></tr>
<tr><td>4</td><td>1   4   6   4   1</td><td>16</td></tr>
<tr><td>5</td><td>1   5  10  10   5   1</td><td>32</td></tr>
<tr><td>6</td><td>1   6  15  20  15   6   1</td><td>64</td></tr>
<tr><td>7</td><td>1   7  21  35  35  21   7   1</td><td>128</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l51-pascal-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> Pascal üçgeninin ilk on satırı ısı haritası olarak. Her satır $n$'in $n+1$ girişi vardır; sıcak renkler büyük merkez girişlerini, soğuk renkler kenarlardaki 1'leri işaret eder. Her satırın en büyük girişinin (yaklaşık) ortasında olduğuna dikkat — tam olarak $\\binom{n}{k} = \\binom{n}{n-k}$ simetrisi.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var maxRow=10;
var triangle=[];
for(var n=0;n<=maxRow;n++){var row=[];for(var k=0;k<=maxRow;k++){if(k>n){row.push(null);continue;}var v=1;for(var i=1;i<=k;i++){v=v*(n-i+1)/i;}row.push(Math.round(v));}triangle.push(row);}
var trace={z:triangle,type:'heatmap',colorscale:[[0,'rgba(15,15,30,0.4)'],[0.1,'#1e3a8a'],[0.3,'#3b82f6'],[0.6,'#f59e0b'],[1.0,'#ef4444']],showscale:true,colorbar:{title:{text:'C(n,k)',font:{color:'#e8e8e8'}},tickfont:{color:'#e8e8e8'}},hovertemplate:'satır n=%{y}, konum k=%{x}<br>C(n,k)=%{z}<extra></extra>'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'k (satırdaki konum)',gridcolor:'rgba(255,255,255,0.05)',dtick:1},yaxis:{title:'n (satır indeksi)',gridcolor:'rgba(255,255,255,0.05)',autorange:'reversed',dtick:1},margin:{t:30,r:30,b:60,l:60}};
Plotly.newPlot('plot-l51-pascal-tr',[trace],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Pascal üçgeninde gizlenen önemli desenler.</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Simetri</div><div class="card-body">Her satır soldan sağa ve sağdan sola aynı okunur. Soldan k. giriş sağdan k. girişe eşittir.</div></div>
<div class="calc-card"><div class="card-title">Satır toplamı = 2ⁿ</div><div class="card-body">n. satırdaki girişleri topladığımızda $2^n$ elde ederiz. (4. satır: $1+4+6+4+1 = 16 = 2^4$.) Bunun nedeni $(1+1)^n = 2^n$ — binom teoreminin $a=b=1$ ile uygulanması.</div></div>
<div class="calc-card"><div class="card-title">Hokey sopası</div><div class="card-body">Sol kenardan başlayan bir köşegen boyunca toplam, köşegenin sonundan tam altında ve sağında olan girişe eşittir. Kombinatoryal ispatlarda karşına çıkacak güzel bir özdeşlik.</div></div>
</div>

<h2 class="lesson-title">7. Binom Katsayıları</h2>

<div class="calc-highlight"><strong>Pascal üçgenindeki her girişin bir adı ve bir formülü vardır.</strong> n. satırda, k konumundaki giriş (k=0'dan saymaya başlanarak) <em>binom katsayısı</em> "n'in k'lisi" olarak adlandırılır ve $\\binom{n}{k}$ şeklinde yazılır. Sıraya önem vermeden $n$ nesneden $k$ tanesini seçmenin yollarının sayısını verir.</div>

<div class="calc-formula"><div class="formula-label">BİNOM KATSAYISI — TANIM</div><div class="formula-main">$$\\binom{n}{k} \\;=\\; \\frac{n!}{k!\\,(n-k)!}$$</div><div class="formula-sub">"n'in k'lisi" diye okunur. n!, "n faktöriyel", $n \\cdot (n-1) \\cdot (n-2) \\cdots 2 \\cdot 1$ demektir. Sözleşme gereği $0! = 1$.</div></div>

<p class="l-text"><strong>Bilinmesi gereken faktöriyeller:</strong></p>

<div style="overflow-x:auto;margin:1rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;text-align:center">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.5rem 0.6rem;color:#3b82f6">n</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.9)">
<tr><td style="padding:0.4rem 0.6rem">n!</td><td>1</td><td>1</td><td>2</td><td>6</td><td>24</td><td>120</td><td>720</td><td>5040</td><td>40320</td></tr>
</tbody></table>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$\\binom{5}{2}$ hesapla.<br><br>$\\binom{5}{2} = \\dfrac{5!}{2! \\, 3!} = \\dfrac{120}{2 \\cdot 6} = \\dfrac{120}{12} = 10$.<br><br>Çapraz kontrol: Pascal üçgeninin 5. satırı 1, 5, 10, 10, 5, 1'dir. $k=2$ konumundaki giriş gerçekten 10.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$\\binom{7}{3}$ hesapla.<br><br>$\\binom{7}{3} = \\dfrac{7!}{3! \\, 4!} = \\dfrac{5040}{6 \\cdot 24} = \\dfrac{5040}{144} = 35$.<br><br>Çapraz kontrol: Pascal üçgeninin 7. satırı 1, 7, 21, 35, 35, 21, 7, 1'dir. $k=3$ konumu 35 verir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Simetri özelliği</div><div class="card-body">$\\binom{n}{k} = \\binom{n}{n-k}$. $k$ tane seçmek, geriye $n-k$ tane bırakmaya eşittir.</div></div>
<div class="calc-card"><div class="card-title">Uç durumlar</div><div class="card-body">$\\binom{n}{0} = \\binom{n}{n} = 1$. Hiçbir şey seçmenin tam olarak bir yolu, her şeyi seçmenin de tam olarak bir yolu vardır.</div></div>
<div class="calc-card"><div class="card-title">Pascal kuralı</div><div class="card-body">$\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$. Bu tam olarak üçgeni kuran "üstteki ikisinin toplamı" kuralıdır.</div></div>
</div>

<h2 class="lesson-title">8. Binom Teoremi</h2>

<div class="calc-highlight"><strong>Binom teoremi</strong> bu dersteki her şeyi tek bir ana özdeşlikte birleştirir. Sana herhangi bir kuvvetin $(a+b)^n$'ini — herhangi bir pozitif tam sayı $n$ için — $(n+1)$ terimin toplamına nasıl açılacağını söyler ve bu terimlerin katsayıları tam olarak Pascal üçgeninin n. satırının girişleridir.</div>

<div class="calc-formula"><div class="formula-label">BİNOM TEOREMİ</div><div class="formula-main">$$(a+b)^n \\;=\\; \\sum_{k=0}^{n} \\binom{n}{k} \\, a^{n-k} \\, b^{k}$$</div><div class="formula-sub">Her terim (katsayı) × (a'nın bir kuvveti) × (b'nin bir kuvveti) şeklindedir. a'nın üsleri n'den 0'a iner; b'nin üsleri 0'dan n'e çıkar; iki üs toplamı her zaman n'dir.</div></div>

<p class="l-text"><strong>Teorem sözel olarak ne diyor.</strong> $(a+b)^n$'in açılımı $n+1$ terim üretir. $k$. terim ($k=0$'dan saymaya başla) $\\binom{n}{k} a^{n-k} b^{k}$'dır. Her terimin her "malzemesi" üç yerden birinden gelir: Pascal üçgeninden binom katsayısı, $n$ çarpandan kaç tanesinin bize $a$ verdiğinden $a$'nın kuvveti ve kaç tanesinin bize $b$ verdiğinden $b$'nin kuvveti. İki kuvvetin toplamı her zaman $n$'dir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — $(a+b)^4$ DOĞRULAMA</div><div class="example-body">Pascal üçgeninin 4. satırı $1, 4, 6, 4, 1$. O zaman<br><br>$(a+b)^4 = a^4 + 4a^3 b + 6a^2 b^2 + 4ab^3 + b^4$.<br><br>FOIL ile kontrol: $(a+b)^4 = ((a+b)^2)^2 = (a^2 + 2ab + b^2)^2$. Bu üç-terimli ifadenin karesini almak aynı altı-terimli cevabı verir — eşleşiyor.</div></div>

<h2 class="lesson-title">9. Çözümlü Örnekler — Belirli Terim Bulma</h2>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1 — $(x+2)^5$'İ AÇ</div><div class="example-body">5. satır katsayıları: $1, 5, 10, 10, 5, 1$. $a=x$, $b=2$ ile:<br><br>$(x+2)^5 = x^5 + 5x^4(2) + 10x^3(4) + 10x^2(8) + 5x(16) + 32$<br>$= x^5 + 10x^4 + 40x^3 + 80x^2 + 80x + 32$.<br><br>Cevap: $\\mathbf{x^5 + 10x^4 + 40x^3 + 80x^2 + 80x + 32}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 — $(2x - 3y)^4$'Ü AÇ</div><div class="example-body">4. satır katsayıları: $1, 4, 6, 4, 1$. $a = 2x$ ve $b = -3y$ ile:<br><br>$(2x-3y)^4 = (2x)^4 + 4(2x)^3(-3y) + 6(2x)^2(-3y)^2 + 4(2x)(-3y)^3 + (-3y)^4$<br>$= 16x^4 - 96x^3 y + 216 x^2 y^2 - 216 x y^3 + 81 y^4$.<br><br>$b = -3y$ yüzünden oluşan değişen işaretlere (-, +, -, +) dikkat: bir aşırı her terim eksi alır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3 — BELİRLİ TERİM</div><div class="example-body">$(x + 4)^7$ açılımında $x^3$ içeren terimi bul.<br><br>Genel terim $\\binom{7}{k} x^{7-k} \\cdot 4^k$. $x$'in üssünün 3 olmasını istiyoruz, yani $7 - k = 3 \\Rightarrow k = 4$.<br><br>O terim $\\binom{7}{4} x^3 \\cdot 4^4 = 35 \\cdot x^3 \\cdot 256 = 8960\\, x^3$.<br><br>Cevap: $x^3$ terimi $\\mathbf{8960 x^3}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 4 — $(x + 1/x)^{10}$'UN ORTA TERİMİ</div><div class="example-body">11 terim vardır (k = 0, 1, ..., 10). Orta $k = 5$'tedir.<br><br>Genel terim: $\\binom{10}{k} x^{10-k} (1/x)^k = \\binom{10}{k} x^{10-2k}$.<br><br>$k=5$'te: $\\binom{10}{5} x^{0} = 252$.<br><br>Cevap: orta terim sabit $\\mathbf{252}$.</div></div>

<div class="think-box"><div class="think-label">EZBERLENECEK DESEN</div><div class="think-body">$(a + b)^n$'de $a$ ve $b$'nin her biri bir veya daha fazla $x$ çarpanı taşıyorsa, belirli bir $x$ kuvveti içeren terimi bulmak için: genel terimi $\\binom{n}{k} a^{n-k} b^{k}$ yaz, $x$'in toplam üssünü topla, hedefe eşitle, $k$'yı çöz, sonra yerine koy. Tüm prosedür alıştırma yaptıktan sonra 30 saniye sürer.</div></div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Her problemi önce kendin dene. Cevaplar ve çözümler aşağıdadır.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body">$(2x + 3)^2$ ifadesini aç.<br><br>Çözüm: $4x^2 + 12x + 9$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body">$25x^2 - 16y^2$ ifadesini çarpanlarına ayır.<br><br>Çözüm: $a^2 - b^2$'yi $a = 5x$, $b = 4y$ ile kullanarak $(5x - 4y)(5x + 4y)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body">$98 \\times 102$'yi zihinden hesapla.<br><br>Çözüm: $(100-2)(100+2) = 10000 - 4 = \\mathbf{9996}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4</div><div class="example-body">$(x - 5)^3$ ifadesini aç.<br><br>Çözüm: $x^3 - 3(x^2)(5) + 3(x)(25) - 125 = x^3 - 15x^2 + 75x - 125$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5</div><div class="example-body">$x^3 + 27$ ifadesini çarpanlarına ayır.<br><br>Çözüm: küp toplamıyla $x^3 + 3^3 = (x+3)(x^2 - 3x + 9)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6</div><div class="example-body">$x + y = 7$ ve $xy = 12$ ise $x^2 + y^2$ ve $x^3 + y^3$ değerlerini bul.<br><br>Çözüm: $(x+y)^2 = x^2 + 2xy + y^2 \\Rightarrow 49 = (x^2+y^2) + 24 \\Rightarrow x^2 + y^2 = 25$.<br>$x^3+y^3 = (x+y)(x^2 - xy + y^2) = 7 \\cdot (25 - 12) = 7 \\cdot 13 = \\mathbf{91}$ kullan.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7</div><div class="example-body">$(1 + x)^6$ ifadesini tamamen aç.<br><br>Çözüm: 6. satır katsayıları $1, 6, 15, 20, 15, 6, 1$. O zaman $$(1+x)^6 = 1 + 6x + 15x^2 + 20x^3 + 15x^4 + 6x^5 + x^6.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8</div><div class="example-body">$(2x - 1)^7$ açılımında $x^4$'ün katsayısını bul.<br><br>Çözüm: genel terim $\\binom{7}{k}(2x)^{7-k}(-1)^k$. $x$'in üssünün 4 olmasını istiyoruz, yani $7-k=4 \\Rightarrow k=3$. Terim $\\binom{7}{3}(2x)^4(-1)^3 = 35 \\cdot 16 x^4 \\cdot (-1) = -560 x^4$. Yani katsayı $\\mathbf{-560}$.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Sonraki derste, iki kare farkı ve küp farkını kullanarak daha karmaşık polinom ifadelerini çarpanlarına ayıracağız ve sonraki derslerde binom teoremi olasılık hesaplamak, küçük $x$ için $(1+x)^n$'i yaklaşıklamak ve hatta (kalkülüste) Taylor serileri üretmek için bir araç olarak geri dönecek.</div>

<h2 class="lesson-title">11. Özdeşlikler Hızlı Başvuru Tablosu</h2>

<p class="l-text">Bu dersteki tüm cebirsel özdeşlikler tek bakışta. Bu tabloyu yazdır, masana yapıştır ve her satır otomatik gelene dek dön bak.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:#0a0a0a;color:rgba(235,230,220,0.92);border:1px solid rgba(59,130,246,0.18)">
<thead><tr style="background:rgba(59,130,246,0.15);border-bottom:2px solid #3b82f6">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6;font-weight:700">Özdeşlik</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6;font-weight:700">Açılım / Çarpanlama</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6;font-weight:700">Ne zaman kullanılır</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Toplamın karesi</td><td style="padding:0.55rem 0.8rem">$(a+b)^2 = a^2 + 2ab + b^2$</td><td style="padding:0.55rem 0.8rem">Herhangi bir $(\\square + \\square)^2$ açma; kareyi tamamlama yöntemi.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Farkın karesi</td><td style="padding:0.55rem 0.8rem">$(a-b)^2 = a^2 - 2ab + b^2$</td><td style="padding:0.55rem 0.8rem">Yukarıdaki ile aynı, eksi işaretiyle; uzaklık formülleri.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">İki kare farkı</td><td style="padding:0.55rem 0.8rem">$a^2 - b^2 = (a-b)(a+b)$</td><td style="padding:0.55rem 0.8rem">Çarpanlama; $103 \\times 97$ gibi zihinden hesap kısayolları.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Üç-terimli kare</td><td style="padding:0.55rem 0.8rem">$(a+b+c)^2 = a^2 + b^2 + c^2 + 2(ab+ac+bc)$</td><td style="padding:0.55rem 0.8rem">$a+b+c$ ve $ab+ac+bc$ verildiğinde $a^2+b^2+c^2$ bulmak.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Toplamın küpü</td><td style="padding:0.55rem 0.8rem">$(a+b)^3 = a^3 + 3a^2 b + 3ab^2 + b^3$</td><td style="padding:0.55rem 0.8rem">Küp açma; katsayılar 1, 3, 3, 1 (Pascal'ın 3. satırı).</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Farkın küpü</td><td style="padding:0.55rem 0.8rem">$(a-b)^3 = a^3 - 3a^2 b + 3ab^2 - b^3$</td><td style="padding:0.55rem 0.8rem">Aynı katsayılar, değişen işaretler $+, -, +, -$.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Küp toplamı</td><td style="padding:0.55rem 0.8rem">$a^3 + b^3 = (a+b)(a^2 - ab + b^2)$</td><td style="padding:0.55rem 0.8rem">Çarpanlama; "SOAP"u hatırla — Same, Opposite, Always Positive.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Küp farkı</td><td style="padding:0.55rem 0.8rem">$a^3 - b^3 = (a-b)(a^2 + ab + b^2)$</td><td style="padding:0.55rem 0.8rem">Çarpanlama; $\\lim_{x\\to a}\\frac{x^3-a^3}{x-a}$ gibi kalkülüs limitleri.</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.8rem">Pascal kuralı</td><td style="padding:0.55rem 0.8rem">$\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$</td><td style="padding:0.55rem 0.8rem">Üçgeni satır satır kurar; kombinatoryal ispatlar.</td></tr>
<tr><td style="padding:0.55rem 0.8rem">Binom teoremi (genel)</td><td style="padding:0.55rem 0.8rem">$(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^{k}$</td><td style="padding:0.55rem 0.8rem">Herhangi pozitif tam sayı kuvveti; gerisini yazmadan tek terim bulma.</td></tr>
</tbody></table>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$(a \\pm b)^2 = a^2 \\pm 2ab + b^2$ — çarpraz terimi asla unutma</li>
<li>$a^2 - b^2 = (a-b)(a+b)$ — tek-resimlik alan ispatıyla desteklenir</li>
<li>$(a \\pm b)^3 = a^3 \\pm 3a^2 b + 3ab^2 \\pm b^3$ — katsayılar 1, 3, 3, 1</li>
<li>$a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)$ — işaretler için "SOAP"u hatırla</li>
<li>$(a+b+c)^2 = a^2 + b^2 + c^2 + 2(ab + ac + bc)$ — üç kare artı üç ikili çarpım</li>
<li>Pascal üçgeni: her giriş = üstteki ikisinin toplamı; n. satırın $n+1$ girişi vardır, toplamları $2^n$</li>
<li>$\\binom{n}{k} = \\dfrac{n!}{k!(n-k)!}$ — $n$'den $k$ seçmenin yollarını sayar</li>
<li>Binom teoremi: $(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^{k}$ — katsayılar tam olarak Pascal'ın n. satırı</li>
</ul>
</div>`
};
