window.LISE_MAT_L99 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Combinations answer the question: how many ways can I choose <em>r</em> things out of <em>n</em> when the order does not matter?</strong> If permutations were about lining people up (where A-B-C and C-B-A are different), combinations are about putting them into a single unordered bag (where {A, B, C} and {C, B, A} are the same set). This one shift — order-free selection — is the gateway to binomial coefficients, Pascal's triangle, the binomial theorem in lesson 51, and a substantial chunk of probability and statistics later on.</p>

<p class="l-text">By the end of this lesson you will compute $\\binom{n}{r}$ from the factorial formula, derive it from permutations, use Pascal's triangle to look up small values, recognise the symmetry $\\binom{n}{r}=\\binom{n}{n-r}$, solve practical counting problems (committees, card hands, lottery), and pick the right tool — permutation or combination — by examining whether order matters.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a combination as an unordered selection of <em>r</em> objects from a set of <em>n</em></li>
<li>Compute $\\binom{n}{r}=\\dfrac{n!}{r!\\,(n-r)!}$ and explain where each factorial comes from</li>
<li>Derive combinations from permutations by dividing out the $r!$ orderings of the chosen items</li>
<li>Apply the symmetry rule $\\binom{n}{r}=\\binom{n}{n-r}$ and the special values $\\binom{n}{0}=\\binom{n}{n}=1$</li>
<li>Build Pascal's triangle and use the recursion $\\binom{n}{r}=\\binom{n-1}{r-1}+\\binom{n-1}{r}$</li>
<li>Decide quickly when a problem calls for permutations versus combinations by asking whether order matters</li>
</ul>
</div>

<h2 class="lesson-title">1. From Permutations to Combinations: the Order-Free Idea</h2>

<div class="calc-highlight"><strong>The hinge of this lesson:</strong> in lesson 98 we counted ordered arrangements. Every line-up of three letters from {A, B, C, D} — ABC, ACB, BAC, BCA, CAB, CBA — counted as a separate permutation, giving $P(4,3)=24$. But if we only care about <em>which three letters</em> are chosen, those six lists collapse into a single committee {A, B, C}. The number of distinct committees is therefore $24/6 = 4$. That ratio — permutations divided by the number of orderings of the chosen items — is exactly a combination.</div>

<p class="l-text">Think of a class of 10 students. Choosing 3 of them to stand in a row for a photo is a permutation problem (Ali-Banu-Cem is a different photo from Cem-Banu-Ali). Choosing 3 of them to form a committee is a combination problem (the committee {Ali, Banu, Cem} is the same body no matter what order I write the names). Same raw question — pick 3 out of 10 — but the count is dramatically different.</p>

<div class="calc-formula"><div class="formula-label">COMBINATION &mdash; DEFINITION</div><div class="formula-main">$$\\binom{n}{r} \\;=\\; C(n,r) \\;=\\; \\frac{n!}{r!\\,(n-r)!}$$</div><div class="formula-sub">The number of ways to choose <em>r</em> objects from a set of <em>n</em> distinct objects when the order of selection does not matter. Read "$\\binom{n}{r}$" as "n choose r".</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Inputs</div><div class="card-body"><em>n</em>: size of the pool. <em>r</em>: number we pick. Both must be non-negative integers with $0 \\leq r \\leq n$.</div></div>
<div class="calc-card"><div class="card-title">Output</div><div class="card-body">A whole number — the count of distinct subsets of size <em>r</em>. Never a fraction, never negative.</div></div>
<div class="calc-card"><div class="card-title">Notations</div><div class="card-body">$\\binom{n}{r}$, $C(n,r)$, $C_r^n$, $^nC_r$ — all the same thing. We will mainly use $\\binom{n}{r}$.</div></div>
</div>

<h2 class="lesson-title">2. The Formula and Where it Comes From</h2>

<div class="calc-highlight"><strong>One sentence derivation.</strong> $P(n,r)$ counts ordered lists of length <em>r</em>. Each unordered subset of size <em>r</em> can be written as $r!$ different ordered lists. So the number of unordered subsets is $P(n,r) / r!$, and substituting $P(n,r) = n!/(n-r)!$ gives the formula.</div>

<div class="calc-formula"><div class="formula-label">DERIVATION FROM PERMUTATIONS</div><div class="formula-main">$$\\binom{n}{r} \\;=\\; \\frac{P(n,r)}{r!} \\;=\\; \\frac{n!\\,/\\,(n-r)!}{r!} \\;=\\; \\frac{n!}{r!\\,(n-r)!}$$</div><div class="formula-sub">Combinations = permutations divided by the orderings we no longer care about.</div></div>

<p class="l-text"><strong>Worked test case.</strong> Choose 3 letters out of {A, B, C, D}. Let us enumerate by hand and check the formula:</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; ENUMERATION</div><div class="example-body">The four subsets of size 3 of {A, B, C, D} are:<br><br>{A, B, C}, {A, B, D}, {A, C, D}, {B, C, D}.<br><br>That's <strong>4</strong> committees.<br><br>Formula check: $\\binom{4}{3} = \\dfrac{4!}{3!\\,1!} = \\dfrac{24}{6\\cdot 1} = 4$. &check;<br><br>Compare with permutations: each committee can be arranged in $3!=6$ orders, so the number of ordered lists is $4 \\times 6 = 24 = P(4,3)$. &check;</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; CLASSIC COMMITTEE</div><div class="example-body">From a class of <strong>10 students</strong>, in how many ways can we form a committee of 3?<br><br>Order does not matter (a committee is just a set), so use combinations:<br><br>$\\binom{10}{3} = \\dfrac{10!}{3!\\,7!} = \\dfrac{10 \\cdot 9 \\cdot 8}{3 \\cdot 2 \\cdot 1} = \\dfrac{720}{6} = \\mathbf{120}$.<br><br>Notice we did not need to compute the full $10!$ — the $7!$ in the denominator cancels the tail of $10!$, leaving the three-term product on top.</div></div>

<div class="l-note"><strong>Practical computation tip.</strong> Always cancel before multiplying. Writing $\\binom{n}{r}$ as $\\dfrac{n(n-1)\\cdots(n-r+1)}{r!}$ keeps the numbers small. For $\\binom{52}{5}$ you compute $\\dfrac{52\\cdot 51\\cdot 50\\cdot 49\\cdot 48}{5!}$, not $52!/(47!\\cdot 5!)$ — the latter overflows even on a calculator.</div>

<h2 class="lesson-title">3. The Symmetry Property</h2>

<div class="calc-highlight"><strong>Choosing <em>r</em> things to keep is the same problem as choosing <em>n &minus; r</em> things to leave behind.</strong> Every subset of size <em>r</em> has a complement of size <em>n &minus; r</em>, and the pairing is one-to-one. So the counts must be equal.</div>

<div class="calc-formula"><div class="formula-label">SYMMETRY OF $\\binom{n}{r}$</div><div class="formula-main">$$\\binom{n}{r} \\;=\\; \\binom{n}{n-r}$$</div><div class="formula-sub">Algebraic proof: $\\dfrac{n!}{r!(n-r)!}$ swaps to $\\dfrac{n!}{(n-r)!\\,r!}$ — the same expression. Combinatorial proof: subset and its complement.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; SAVING WORK WITH SYMMETRY</div><div class="example-body">Compute $\\binom{20}{18}$.<br><br>A direct attack means six big factorials. Use symmetry: $\\binom{20}{18}=\\binom{20}{2}=\\dfrac{20\\cdot 19}{2}=\\mathbf{190}$.<br><br>Whenever <em>r</em> is close to <em>n</em>, flip it to <em>n &minus; r</em>.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Special: $\\binom{n}{0}$</div><div class="card-body">$\\binom{n}{0}=1$. There is exactly one empty subset (chose nothing). And $0!=1$ keeps the formula consistent.</div></div>
<div class="calc-card"><div class="card-title">Special: $\\binom{n}{n}$</div><div class="card-body">$\\binom{n}{n}=1$. There is one full subset (chose everything). By symmetry, equal to $\\binom{n}{0}$.</div></div>
<div class="calc-card"><div class="card-title">Special: $\\binom{n}{1}$</div><div class="card-body">$\\binom{n}{1}=n$. There are <em>n</em> single-element subsets — one for each element of the pool. By symmetry, $\\binom{n}{n-1}=n$ too.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Without any computation, which is larger: $\\binom{30}{2}$ or $\\binom{30}{28}$? Answer: they are equal, both 435, because symmetry says $\\binom{30}{28}=\\binom{30}{2}$. Whenever you see a binomial coefficient with <em>r</em> close to <em>n</em>, instantly flip it.</div></div>

<h2 class="lesson-title">4. Pascal's Triangle</h2>

<div class="calc-highlight"><strong>Pascal's triangle is a table of binomial coefficients.</strong> Row <em>n</em> contains $\\binom{n}{0}, \\binom{n}{1}, \\binom{n}{2}, \\dots, \\binom{n}{n}$. Each interior entry is the sum of the two entries diagonally above it. Memorising the first 8 rows lets you look up combinations up to $\\binom{7}{r}$ without any factorial arithmetic.</div>

<div class="calc-formula"><div class="formula-label">PASCAL'S RULE</div><div class="formula-main">$$\\binom{n}{r} \\;=\\; \\binom{n-1}{r-1} \\;+\\; \\binom{n-1}{r}$$</div><div class="formula-sub">Combinatorial proof: split the choices by whether they include the <em>n</em>-th element. If they do, we need <em>r &minus; 1</em> more from the remaining <em>n &minus; 1</em>. If they don't, we need all <em>r</em> from the remaining <em>n &minus; 1</em>.</div></div>

<p class="l-text">The first 8 rows of Pascal's triangle, with their row sums:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">n</th>
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">Entries $\\binom{n}{0}, \\binom{n}{1}, \\dots, \\binom{n}{n}$</th>
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">Row sum $2^n$</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">0</td><td style="padding:0.45rem 0.7rem">1</td><td style="padding:0.45rem 0.7rem">1</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">1</td><td style="padding:0.45rem 0.7rem">1, 1</td><td style="padding:0.45rem 0.7rem">2</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">2</td><td style="padding:0.45rem 0.7rem">1, 2, 1</td><td style="padding:0.45rem 0.7rem">4</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">3</td><td style="padding:0.45rem 0.7rem">1, 3, 3, 1</td><td style="padding:0.45rem 0.7rem">8</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">4</td><td style="padding:0.45rem 0.7rem">1, 4, 6, 4, 1</td><td style="padding:0.45rem 0.7rem">16</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">5</td><td style="padding:0.45rem 0.7rem">1, 5, 10, 10, 5, 1</td><td style="padding:0.45rem 0.7rem">32</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">6</td><td style="padding:0.45rem 0.7rem">1, 6, 15, 20, 15, 6, 1</td><td style="padding:0.45rem 0.7rem">64</td></tr>
<tr><td style="padding:0.45rem 0.7rem">7</td><td style="padding:0.45rem 0.7rem">1, 7, 21, 35, 35, 21, 7, 1</td><td style="padding:0.45rem 0.7rem">128</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l99-pascal-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the first 8 rows of Pascal's triangle as a heatmap. Each cell sits in row <em>n</em>, column <em>r</em>; brighter cells mean larger $\\binom{n}{r}$. Numbers are annotated on top. Notice the symmetry along the column $r=n/2$ — that is the rule $\\binom{n}{r}=\\binom{n}{n-r}$ rendered as a picture.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function binom(n,r){if(r<0||r>n)return 0;if(r===0||r===n)return 1;var k=Math.min(r,n-r);var v=1;for(var i=0;i<k;i++){v=v*(n-i)/(i+1);}return Math.round(v);}
var rows=[];var hover=[];for(var n=0;n<=7;n++){var row=[];var hov=[];for(var r=0;r<=7;r++){if(r>n){row.push(null);hov.push('');}else{var v=binom(n,r);row.push(v);hov.push('C('+n+','+r+') = '+v);}}rows.push(row);hover.push(hov);}
var xL=['r=0','r=1','r=2','r=3','r=4','r=5','r=6','r=7'];
var yL=['n=0','n=1','n=2','n=3','n=4','n=5','n=6','n=7'];
var heat={z:rows,x:xL,y:yL,type:'heatmap',colorscale:[[0,'#0a0a0a'],[0.15,'#1e3a5f'],[0.4,'#2563eb'],[0.7,'#3b82f6'],[1,'#93c5fd']],showscale:true,colorbar:{tickfont:{color:'#e8e8e8'}},hoverinfo:'text',text:hover};
var annotations=[];for(var n2=0;n2<=7;n2++){for(var r2=0;r2<=n2;r2++){annotations.push({x:'r='+r2,y:'n='+n2,text:String(binom(n2,r2)),showarrow:false,font:{color:'#fff',size:12,family:'Geist'}});}}
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{gridcolor:'rgba(255,255,255,0.04)'},yaxis:{autorange:'reversed',gridcolor:'rgba(255,255,255,0.04)'},margin:{t:30,r:30,b:60,l:60},annotations:annotations};
Plotly.newPlot('plot-l99-pascal-en',[heat],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">PATTERN SPOTTING</div><div class="think-body">Stare at the row sums column. $1, 2, 4, 8, 16, 32, 64, 128$ — each row sums to $2^n$. Combinatorial reason: $\\sum_{r=0}^{n} \\binom{n}{r}$ counts <em>all</em> subsets of an n-element set (size 0 through size <em>n</em>). And every element either goes in or stays out — two choices per element, $2^n$ subsets total.</div></div>

<h2 class="lesson-title">5. The Binomial Theorem (Preview)</h2>

<div class="calc-highlight"><strong>The numbers in row <em>n</em> of Pascal's triangle are exactly the coefficients when you expand $(a+b)^n$.</strong> Lesson 51 derives this in detail; for now, marvel at the connection.</div>

<div class="calc-formula"><div class="formula-label">BINOMIAL THEOREM</div><div class="formula-main">$$(a+b)^n \\;=\\; \\sum_{k=0}^{n}\\binom{n}{k}\\,a^{\\,n-k}\\,b^{\\,k}$$</div><div class="formula-sub">Each $\\binom{n}{k}$ counts the ways of choosing exactly <em>k</em> factors of <em>b</em> out of the <em>n</em> brackets when you multiply $(a+b)(a+b)\\cdots(a+b)$.</div></div>

<div class="calc-example"><div class="example-label">QUICK EXPANSION</div><div class="example-body">Expand $(a+b)^4$ using row 4 of Pascal's triangle: $1,4,6,4,1$.<br><br>$(a+b)^4 \\;=\\; a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4$.<br><br>The numerical coefficients are $\\binom{4}{0}=1,\\binom{4}{1}=4,\\binom{4}{2}=6,\\binom{4}{3}=4,\\binom{4}{4}=1$ — exactly row 4.</div></div>

<h2 class="lesson-title">6. Combinations with Repetition (Stars and Bars)</h2>

<div class="calc-highlight"><strong>What if items can be picked more than once?</strong> Example: a tea shop has 5 flavours and you order 3 cups, repeats allowed. The number of distinct orders (ignoring the order in which the cups are listed) is a "combination with repetition", and it is counted by a clever trick called stars and bars.</div>

<div class="calc-formula"><div class="formula-label">COMBINATIONS WITH REPETITION</div><div class="formula-main">$$C^{R}(n,r) \\;=\\; \\binom{n+r-1}{r}$$</div><div class="formula-sub">Number of multisets of size <em>r</em> drawn from <em>n</em> distinct types. Each cup of tea is a "star"; each switch between flavours is a "bar". Arrange $r$ stars and $n-1$ bars in a row — there are $\\binom{n+r-1}{r}$ ways.</div></div>

<div class="calc-example"><div class="example-label">TEA SHOP EXAMPLE</div><div class="example-body">Five flavours, three cups, repeats allowed.<br><br>$C^{R}(5,3) = \\binom{5+3-1}{3}=\\binom{7}{3}=\\dfrac{7\\cdot 6\\cdot 5}{6}=\\mathbf{35}$ distinct orders.<br><br>Listed: all-same (5 ways), exactly two same (5&middot;4=20 ways), all different ($\\binom{5}{3}=10$ ways) — total 35. &check;</div></div>

<div class="l-note">Stars and bars is the second-most useful counting trick after combinations themselves. We will revisit it briefly in lesson 52 when we discuss distributing identical objects into distinct boxes.</div>

<h2 class="lesson-title">7. Permutations vs Combinations: a Decision Rule</h2>

<div class="calc-highlight"><strong>Ask the single question: "does the order of the chosen items matter?"</strong> Yes &rarr; permutation. No &rarr; combination. Everything else flows from this one decision.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">PERMUTATION &mdash; ORDER MATTERS</div><div class="compare-item">Race finishing positions: 1st, 2nd, 3rd are distinct</div><div class="compare-item">Forming a password (A1B vs B1A are different)</div><div class="compare-item">Lining up for a photograph</div><div class="compare-item">Assigning roles (president, vice-president, secretary)</div><div class="compare-item">Formula: $P(n,r)=\\dfrac{n!}{(n-r)!}$</div></div><div class="compare-col"><div class="compare-title">COMBINATION &mdash; ORDER DOESN'T MATTER</div><div class="compare-item">Choosing a committee (set, not list)</div><div class="compare-item">Selecting a poker hand (5 cards, order irrelevant)</div><div class="compare-item">Picking lottery numbers</div><div class="compare-item">Choosing pizza toppings</div><div class="compare-item">Formula: $\\binom{n}{r}=\\dfrac{n!}{r!(n-r)!}$</div></div></div>

<div class="calc-example"><div class="example-label">MIXED EXAMPLE</div><div class="example-body">10 athletes finish a race. (a) In how many ways can the gold-silver-bronze medals be awarded? (b) In how many ways can 3 of them be chosen for a post-race interview?<br><br>(a) Order matters (gold &ne; silver), so $P(10,3)=10\\cdot 9\\cdot 8=720$.<br>(b) Order does not matter (the interview group is just a set), so $\\binom{10}{3}=\\dfrac{10\\cdot 9\\cdot 8}{3!}=120$.<br><br>Notice the factor of $3!=6$: each unordered group of 3 corresponds to 6 ordered podium arrangements.</div></div>

<p class="l-text"><strong>A side-by-side table to internalise the ratio.</strong> Notice that $P(n,r)$ is always exactly $r!$ times bigger than $\\binom{n}{r}$:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">$(n,r)$</th>
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">$P(n,r)$</th>
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">$\\binom{n}{r}$</th>
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">Ratio $r!$</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">(5, 2)</td><td style="padding:0.45rem 0.7rem">20</td><td style="padding:0.45rem 0.7rem">10</td><td style="padding:0.45rem 0.7rem">2</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">(6, 3)</td><td style="padding:0.45rem 0.7rem">120</td><td style="padding:0.45rem 0.7rem">20</td><td style="padding:0.45rem 0.7rem">6</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">(8, 4)</td><td style="padding:0.45rem 0.7rem">1680</td><td style="padding:0.45rem 0.7rem">70</td><td style="padding:0.45rem 0.7rem">24</td></tr>
<tr><td style="padding:0.45rem 0.7rem">(10, 5)</td><td style="padding:0.45rem 0.7rem">30{,}240</td><td style="padding:0.45rem 0.7rem">252</td><td style="padding:0.45rem 0.7rem">120</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l99-pvc-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $P(10,r)$ versus $\\binom{10}{r}$ for $r=0,1,\\dots,10$ on a log scale. The two coincide at $r=0$ and $r=1$ (only one way to choose nothing; choosing one item is the same with or without order), then diverge dramatically as $r$ grows because the $r!$ orderings inflate the permutation count. Around $r=10$, $P(10,10)=10!=3{,}628{,}800$ while $\\binom{10}{10}=1$ — a factor of $10!$ apart.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function fact(n){var v=1;for(var i=2;i<=n;i++)v*=i;return v;}
function Pnr(n,r){return fact(n)/fact(n-r);}
function Cnr(n,r){return fact(n)/(fact(r)*fact(n-r));}
var rs=[0,1,2,3,4,5,6,7,8,9,10];
var pv=rs.map(function(r){return Pnr(10,r);});
var cv=rs.map(function(r){return Cnr(10,r);});
var bar1={x:rs,y:pv,type:'bar',name:'P(10, r)',marker:{color:'#3b82f6'}};
var bar2={x:rs,y:cv,type:'bar',name:'C(10, r)',marker:{color:'#f59e0b'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'r (items chosen)',gridcolor:'rgba(255,255,255,0.06)',dtick:1},yaxis:{title:'count (log scale)',type:'log',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:80},barmode:'group',legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l99-pvc-en',[bar1,bar2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Card-Hand Problems: A Classic Playground</h2>

<div class="calc-highlight"><strong>A standard deck has 52 cards.</strong> A "hand" is 5 cards dealt at random — order within the hand does not matter. So every counting question about poker hands is a combination problem.</div>

<div class="calc-example"><div class="example-label">TOTAL NUMBER OF 5-CARD HANDS</div><div class="example-body">$\\binom{52}{5} \\;=\\; \\dfrac{52\\cdot 51\\cdot 50\\cdot 49\\cdot 48}{5!} \\;=\\; \\dfrac{311{,}875{,}200}{120} \\;=\\; \\mathbf{2{,}598{,}960}$.<br><br>About 2.6 million distinct hands — the denominator of every poker probability calculation.</div></div>

<div class="calc-example"><div class="example-label">HANDS WITH EXACTLY TWO ACES</div><div class="example-body">How many 5-card hands contain exactly 2 aces?<br><br>Step 1: choose 2 of the 4 aces: $\\binom{4}{2}=6$ ways.<br>Step 2: choose 3 non-ace cards from the remaining 48: $\\binom{48}{3}=\\dfrac{48\\cdot 47\\cdot 46}{6}=17{,}296$ ways.<br>Step 3: multiply (independent choices): $6 \\times 17{,}296 = \\mathbf{103{,}776}$ hands.</div></div>

<div class="calc-example"><div class="example-label">HANDS WITH ALL FOUR ACES</div><div class="example-body">$\\binom{4}{4}\\cdot\\binom{48}{1}=1\\cdot 48=\\mathbf{48}$ hands. The fifth card can be any of the 48 non-aces.</div></div>

<div class="calc-graph"><div id="plot-l99-select-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the six ways to choose 2 items from 4 (labelled A, B, C, D). Each row is one subset; filled dots are chosen, hollow dots are left behind. The count $\\binom{4}{2}=6$ matches what you see, and the diagram makes the symmetry concrete — choosing a 2-element subset is equivalent to choosing which 2 to leave behind.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var subsets=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
var labels=['A','B','C','D'];
var filledX=[];var filledY=[];var openX=[];var openY=[];var textX=[];var textY=[];var textT=[];
for(var s=0;s<subsets.length;s++){var rowY=subsets.length-s;var inSet=subsets[s];for(var c=0;c<4;c++){var isIn=(inSet.indexOf(c)>=0);if(isIn){filledX.push(c);filledY.push(rowY);}else{openX.push(c);openY.push(rowY);}}textX.push(-0.9);textY.push(rowY);textT.push('{ '+labels[inSet[0]]+', '+labels[inSet[1]]+' }');}
var trFilled={x:filledX,y:filledY,mode:'markers',name:'chosen',marker:{color:'#3b82f6',size:22,line:{color:'#93c5fd',width:2}}};
var trOpen={x:openX,y:openY,mode:'markers',name:'left out',marker:{color:'#0a0a0a',size:22,line:{color:'rgba(255,255,255,0.4)',width:1.5}}};
var trLabel={x:textX,y:textY,mode:'text',name:'subset',text:textT,textposition:'middle right',textfont:{color:'#e8e8e8',size:12},showlegend:false};
var headerX=[0,1,2,3];var headerY=[7,7,7,7];var trHeader={x:headerX,y:headerY,mode:'text',name:'items',text:labels,textfont:{color:'#f59e0b',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.5,4.5],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[0,8],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l99-select-en',[trHeader,trFilled,trOpen,trLabel],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Common Errors</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forgetting the $r!$ divisor</div><div class="card-body">Computing $P(n,r)$ when the problem is a combination question gives a count $r!$ times too large. Always check: "would swapping two chosen items create a new arrangement?" If no, divide by $r!$.</div></div>
<div class="calc-card"><div class="card-title">Forgetting the $(n-r)!$ in the denominator</div><div class="card-body">A frequent slip: writing $\\dfrac{n!}{r!}$ instead of $\\dfrac{n!}{r!(n-r)!}$. The $(n-r)!$ cancels the unused tail of $n!$. Without it the answer is enormously inflated.</div></div>
<div class="calc-card"><div class="card-title">Using $C$ when items are distinguishable by role</div><div class="card-body">"Choose a president and a vice-president from 5" is permutation $P(5,2)=20$, not $\\binom{5}{2}=10$. Roles are positions — order matters.</div></div>
<div class="calc-card"><div class="card-title">Forgetting the "must include / must exclude" twist</div><div class="card-body">If one item is forced in, choose the rest from the smaller pool: $\\binom{n-1}{r-1}$. If one item is forced out, choose all from the reduced pool: $\\binom{n-1}{r}$. Reduce the problem first, then count.</div></div>
</div>

<h2 class="lesson-title">10. Worked Practice</h2>

<p class="l-text">Try each problem on your own first, then check the solution. These cover every technique from the lesson.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; STUDENT COMMITTEE</div><div class="example-body"><strong>From 10 students, choose 3 to form a committee. How many committees?</strong><br><br>Order does not matter, so this is a combination.<br><br>$\\binom{10}{3}=\\dfrac{10\\cdot 9\\cdot 8}{3!}=\\dfrac{720}{6}=\\mathbf{120}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; CARD HAND</div><div class="example-body"><strong>How many distinct 5-card hands can be dealt from a standard 52-card deck?</strong><br><br>$\\binom{52}{5}=\\dfrac{52\\cdot 51\\cdot 50\\cdot 49\\cdot 48}{120}=\\mathbf{2{,}598{,}960}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; EXACTLY TWO ACES</div><div class="example-body"><strong>How many 5-card hands contain exactly 2 aces?</strong><br><br>Choose 2 aces from 4: $\\binom{4}{2}=6$.<br>Choose 3 non-aces from 48: $\\binom{48}{3}=17{,}296$.<br>Multiply: $6 \\cdot 17{,}296 = \\mathbf{103{,}776}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; A MUST-INCLUDE CONSTRAINT</div><div class="example-body"><strong>An exam has 10 questions; you must answer exactly 6, including question 5. How many ways to choose the set you answer?</strong><br><br>Question 5 is fixed in the set. Choose the other 5 from the remaining 9 questions: $\\binom{9}{5}=\\binom{9}{4}=\\dfrac{9\\cdot 8\\cdot 7\\cdot 6}{4!}=\\dfrac{3024}{24}=\\mathbf{126}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; SYMMETRY SHORTCUT</div><div class="example-body"><strong>Compute $\\binom{15}{13}$.</strong><br><br>Use $\\binom{n}{r}=\\binom{n}{n-r}$: $\\binom{15}{13}=\\binom{15}{2}=\\dfrac{15\\cdot 14}{2}=\\mathbf{105}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; PASCAL'S RULE</div><div class="example-body"><strong>Without the factorial formula, find $\\binom{8}{3}$ using $\\binom{7}{2}=21$ and $\\binom{7}{3}=35$.</strong><br><br>Pascal's rule: $\\binom{8}{3}=\\binom{7}{2}+\\binom{7}{3}=21+35=\\mathbf{56}$.<br><br>Check by formula: $\\binom{8}{3}=\\dfrac{8\\cdot 7\\cdot 6}{6}=56$. &check;</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; PERMUTATION vs COMBINATION</div><div class="example-body"><strong>From 7 books, how many ways can you (a) line up 3 on a shelf, (b) choose 3 to take to the beach?</strong><br><br>(a) Order on the shelf matters: $P(7,3)=7\\cdot 6\\cdot 5=\\mathbf{210}$.<br>(b) The beach bag is unordered: $\\binom{7}{3}=\\dfrac{210}{6}=\\mathbf{35}$.<br><br>Same raw question (pick 3 of 7) — different count because order matters in (a) but not in (b).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; LOTTERY ODDS</div><div class="example-body"><strong>A lottery picks 6 numbers from 49 (order irrelevant). How many distinct tickets are possible? What is the probability of winning with one ticket?</strong><br><br>$\\binom{49}{6}=\\dfrac{49\\cdot 48\\cdot 47\\cdot 46\\cdot 45\\cdot 44}{6!}=\\dfrac{10{,}068{,}347{,}520}{720}=\\mathbf{13{,}983{,}816}$.<br><br>Probability $=\\dfrac{1}{13{,}983{,}816}\\approx 7.15\\times 10^{-8}$. About 1 in 14 million — you are roughly 10 times more likely to be struck by lightning this year.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 9 &mdash; MIXED-GENDER COMMITTEE</div><div class="example-body"><strong>A club has 6 girls and 4 boys. In how many ways can a 4-person committee be formed with exactly 2 girls and 2 boys?</strong><br><br>Pick the girls independently of the boys, then multiply (rule of product).<br>Girls: $\\binom{6}{2}=\\dfrac{6\\cdot 5}{2}=15$.<br>Boys: $\\binom{4}{2}=\\dfrac{4\\cdot 3}{2}=6$.<br>Total: $15 \\times 6 = \\mathbf{90}$ committees.<br><br>Sanity check: the total number of unrestricted 4-person committees is $\\binom{10}{4}=210$, and this 90 is a fraction of that count, as expected.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> Lesson 51 takes Pascal's triangle and proves the binomial theorem $(a+b)^n=\\sum_k \\binom{n}{k}a^{n-k}b^k$. After that, lesson 52 returns to "distribute <em>n</em> identical balls into <em>k</em> distinct boxes" — another classic stars-and-bars problem — and lesson 53 connects everything to discrete probability. Combinations are the most-used object in all of those.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\binom{n}{r}=\\dfrac{n!}{r!\\,(n-r)!}$ counts unordered selections of <em>r</em> items from <em>n</em></li>
<li>Derivation: $\\binom{n}{r}=P(n,r)/r!$ — divide permutations by the $r!$ orderings we ignore</li>
<li>Symmetry: $\\binom{n}{r}=\\binom{n}{n-r}$; special values $\\binom{n}{0}=\\binom{n}{n}=1$, $\\binom{n}{1}=n$</li>
<li>Pascal's rule: $\\binom{n}{r}=\\binom{n-1}{r-1}+\\binom{n-1}{r}$ — interior entries are sums of the two above</li>
<li>Row <em>n</em> of Pascal's triangle sums to $2^n$ (total number of subsets of an n-element set)</li>
<li>Combinations with repetition: $\\binom{n+r-1}{r}$ — multisets via stars and bars</li>
<li>Decision rule: order matters &rarr; permutation $P(n,r)$; order ignored &rarr; combination $\\binom{n}{r}$</li>
<li>Constraints reduce the problem: forced-in element gives $\\binom{n-1}{r-1}$, forced-out gives $\\binom{n-1}{r}$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Kombinasyon şu soruyu yanıtlar: <em>n</em> nesneden <em>r</em> tanesini sıra önemsiz olarak kaç farklı şekilde seçebilirim?</strong> Permütasyon insanları sıraya dizmekti (A-B-C ile C-B-A farklıydı); kombinasyon ise onları sırasız bir torbaya atmaktır (orada {A, B, C} ile {C, B, A} aynı kümedir). Bu tek geçiş — sırasız seçim — bizi binom katsayılarına, Pascal üçgenine, 51. derste göreceğimiz binom teoremine ve sonradan olasılık-istatistiğin büyük bir kısmına açan kapıdır.</p>

<p class="l-text">Bu dersin sonunda $\\binom{n}{r}$ değerini faktöriyel formülüyle hesaplayacak, onu permütasyondan türetecek, küçük değerleri için Pascal üçgenini bakı tablosu gibi kullanacak, $\\binom{n}{r}=\\binom{n}{n-r}$ simetrisini tanıyacak, pratik sayma problemlerini (komite, iskambil eli, piyango) çözecek ve "sıra önemli mi?" sorusuyla doğru aracı — permütasyon mu kombinasyon mu — seçeceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NELER ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Kombinasyonu, <em>n</em> elemanlı bir kümeden <em>r</em> nesnenin sırasız seçimi olarak tanımlamak</li>
<li>$\\binom{n}{r}=\\dfrac{n!}{r!\\,(n-r)!}$ formülünü hesaplamak ve her faktöriyelin nereden geldiğini açıklamak</li>
<li>Kombinasyonu permütasyondan, seçilenlerin $r!$ sıralanışına bölerek türetmek</li>
<li>$\\binom{n}{r}=\\binom{n}{n-r}$ simetrisini ve $\\binom{n}{0}=\\binom{n}{n}=1$ özel değerlerini uygulamak</li>
<li>Pascal üçgenini kurmak ve $\\binom{n}{r}=\\binom{n-1}{r-1}+\\binom{n-1}{r}$ özyinelemesini kullanmak</li>
<li>"Sıra önemli mi?" sorusuyla bir problemin permütasyonla mı kombinasyonla mı çözüleceğine hızla karar vermek</li>
</ul>
</div>

<h2 class="lesson-title">1. Permütasyondan Kombinasyona: Sırasız Seçim Fikri</h2>

<div class="calc-highlight"><strong>Bu dersin menteşesi:</strong> 98. derste sıralı dizilişleri saydık. {A, B, C, D} kümesinden seçilen üç harfin her dizilişi — ABC, ACB, BAC, BCA, CAB, CBA — ayrı bir permütasyon olarak sayıldı ve $P(4,3)=24$ çıktı. Ama yalnızca <em>hangi üç harfin</em> seçildiğiyle ilgileniyorsak, o altı liste tek bir komiteye, {A, B, C}'ye, çöker. O zaman farklı komite sayısı $24/6 = 4$'tür. Bu oran — permütasyonlar bölü seçilenlerin sıralanış sayısı — tam olarak kombinasyondur.</div>

<p class="l-text">10 öğrencilik bir sınıf düşün. 3'ünü fotoğraf için bir sıraya dizmek bir permütasyon problemidir (Ali-Banu-Cem ile Cem-Banu-Ali farklı fotoğraflardır). 3'ünü bir komite kurmak için seçmek ise bir kombinasyon problemidir ({Ali, Banu, Cem} komitesi, isimleri hangi sırayla yazsam da aynı kuruldur). Ham soru aynı — 10'dan 3 seç — ama sayım dramatik biçimde farklıdır.</p>

<div class="calc-formula"><div class="formula-label">KOMBİNASYON &mdash; TANIM</div><div class="formula-main">$$\\binom{n}{r} \\;=\\; C(n,r) \\;=\\; \\frac{n!}{r!\\,(n-r)!}$$</div><div class="formula-sub">Sıra önemsiz olduğunda <em>n</em> farklı nesneden <em>r</em> tanesini seçme yollarının sayısı. "$\\binom{n}{r}$" sembolünü "n'in r'lisi" diye okuruz.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Girdiler</div><div class="card-body"><em>n</em>: havuzun büyüklüğü. <em>r</em>: seçilen miktar. İkisi de negatif olmayan tam sayı ve $0 \\leq r \\leq n$.</div></div>
<div class="calc-card"><div class="card-title">Çıktı</div><div class="card-body">Bir tam sayı — <em>r</em> büyüklüğündeki farklı altküme sayısı. Asla kesir, asla negatif değildir.</div></div>
<div class="calc-card"><div class="card-title">Notasyonlar</div><div class="card-body">$\\binom{n}{r}$, $C(n,r)$, $C_r^n$, $^nC_r$ — hepsi aynı nesne. Bu derste ağırlıkla $\\binom{n}{r}$ kullanacağız.</div></div>
</div>

<h2 class="lesson-title">2. Formül ve Nereden Geldiği</h2>

<div class="calc-highlight"><strong>Tek cümleyle türetim.</strong> $P(n,r)$, uzunluğu <em>r</em> olan sıralı listeleri sayar. Büyüklüğü <em>r</em> olan her sırasız altküme, $r!$ farklı sıralı liste olarak yazılabilir. O hâlde sırasız altküme sayısı $P(n,r) / r!$'dir; $P(n,r) = n!/(n-r)!$ yerine konunca formül çıkar.</div>

<div class="calc-formula"><div class="formula-label">PERMÜTASYONDAN TÜRETİM</div><div class="formula-main">$$\\binom{n}{r} \\;=\\; \\frac{P(n,r)}{r!} \\;=\\; \\frac{n!\\,/\\,(n-r)!}{r!} \\;=\\; \\frac{n!}{r!\\,(n-r)!}$$</div><div class="formula-sub">Kombinasyon = permütasyon bölü artık önemsemediğimiz sıralanışlar.</div></div>

<p class="l-text"><strong>Sınama örneği.</strong> {A, B, C, D} içinden 3 harf seç. Elle listeleyip formülle doğrulayalım:</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; LİSTELEME</div><div class="example-body">{A, B, C, D} kümesinin 3 elemanlı altkümeleri:<br><br>{A, B, C}, {A, B, D}, {A, C, D}, {B, C, D}.<br><br>Toplam <strong>4</strong> komite.<br><br>Formülle kontrol: $\\binom{4}{3} = \\dfrac{4!}{3!\\,1!} = \\dfrac{24}{6\\cdot 1} = 4$. &check;<br><br>Permütasyonla karşılaştır: her komite $3!=6$ sırada dizilebilir, yani sıralı liste sayısı $4 \\times 6 = 24 = P(4,3)$. &check;</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; KLASİK KOMİTE</div><div class="example-body"><strong>10 kişilik</strong> bir sınıftan 3 kişilik bir komite kaç farklı şekilde kurulur?<br><br>Sıra önemsiz (komite sadece bir kümedir), o yüzden kombinasyon:<br><br>$\\binom{10}{3} = \\dfrac{10!}{3!\\,7!} = \\dfrac{10 \\cdot 9 \\cdot 8}{3 \\cdot 2 \\cdot 1} = \\dfrac{720}{6} = \\mathbf{120}$.<br><br>$10!$'i bütünüyle hesaplamamıza gerek olmadığına dikkat et — paydadaki $7!$, $10!$'in kuyruğunu sadeleştirir ve geriye üç çarpan kalır.</div></div>

<div class="l-note"><strong>Pratik hesaplama ipucu.</strong> Çarpmadan önce daima sadeleştir. $\\binom{n}{r}$'yi $\\dfrac{n(n-1)\\cdots(n-r+1)}{r!}$ biçiminde yazmak sayıları küçük tutar. $\\binom{52}{5}$ için $\\dfrac{52\\cdot 51\\cdot 50\\cdot 49\\cdot 48}{5!}$ hesaplarsın, $52!/(47!\\cdot 5!)$ değil — ikincisi hesap makinesinde bile taşar.</div>

<h2 class="lesson-title">3. Simetri Özelliği</h2>

<div class="calc-highlight"><strong>Tutulacak <em>r</em> tanesini seçmek, geride bırakılacak <em>n &minus; r</em> tanesini seçmekle aynı problemdir.</strong> Büyüklüğü <em>r</em> olan her altkümenin <em>n &minus; r</em> büyüklüğünde bir tümleyeni vardır ve bu eşleşme birebirdir. Dolayısıyla sayılar eşit olmalıdır.</div>

<div class="calc-formula"><div class="formula-label">$\\binom{n}{r}$ SİMETRİSİ</div><div class="formula-main">$$\\binom{n}{r} \\;=\\; \\binom{n}{n-r}$$</div><div class="formula-sub">Cebirsel kanıt: $\\dfrac{n!}{r!(n-r)!}$, $\\dfrac{n!}{(n-r)!\\,r!}$'ye dönüşür — aynı ifade. Kombinatoryal kanıt: altküme ve onun tümleyeni.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; SİMETRİYLE İŞ YERİNE GETİRME</div><div class="example-body">$\\binom{20}{18}$ değerini hesapla.<br><br>Doğrudan saldırı altı büyük faktöriyel demektir. Simetri kullan: $\\binom{20}{18}=\\binom{20}{2}=\\dfrac{20\\cdot 19}{2}=\\mathbf{190}$.<br><br><em>r</em>, <em>n</em>'e yakın olduğunda <em>n &minus; r</em>'ye çevir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Özel: $\\binom{n}{0}$</div><div class="card-body">$\\binom{n}{0}=1$. Hiçbir şey seçmemenin tek bir yolu vardır (boş altküme). $0!=1$ tanımı formülü tutarlı kılar.</div></div>
<div class="calc-card"><div class="card-title">Özel: $\\binom{n}{n}$</div><div class="card-body">$\\binom{n}{n}=1$. Hepsini seçmenin tek yolu vardır. Simetri gereği $\\binom{n}{0}$ ile eşit.</div></div>
<div class="calc-card"><div class="card-title">Özel: $\\binom{n}{1}$</div><div class="card-body">$\\binom{n}{1}=n$. Tek elemanlı <em>n</em> tane altküme — her eleman için bir tane. Simetriyle $\\binom{n}{n-1}=n$.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Hiç hesap yapmadan: $\\binom{30}{2}$ ile $\\binom{30}{28}$'den hangisi büyüktür? Cevap: ikisi de eşit, her ikisi de 435. Çünkü simetri $\\binom{30}{28}=\\binom{30}{2}$ der. <em>r</em> değeri <em>n</em>'e yakın olan her binom katsayısını anında çevir.</div></div>

<h2 class="lesson-title">4. Pascal Üçgeni</h2>

<div class="calc-highlight"><strong>Pascal üçgeni binom katsayılarının bir tablosudur.</strong> <em>n</em>. satır $\\binom{n}{0}, \\binom{n}{1}, \\binom{n}{2}, \\dots, \\binom{n}{n}$ değerlerini içerir. İç hücrelerin her biri, hemen üstündeki iki hücrenin toplamıdır. İlk 8 satırı ezberlemek, $\\binom{7}{r}$'ye kadar tüm kombinasyonları faktöriyel aritmetiği yapmadan okumanı sağlar.</div>

<div class="calc-formula"><div class="formula-label">PASCAL KURALI</div><div class="formula-main">$$\\binom{n}{r} \\;=\\; \\binom{n-1}{r-1} \\;+\\; \\binom{n-1}{r}$$</div><div class="formula-sub">Kombinatoryal kanıt: seçimleri <em>n</em>. elemanın seçilip seçilmemesine göre ikiye ayır. Seçilirse, kalan <em>n &minus; 1</em>'den <em>r &minus; 1</em> tane daha lazım. Seçilmezse, kalan <em>n &minus; 1</em>'den <em>r</em> tanesinin tümünü almak gerek.</div></div>

<p class="l-text">Pascal üçgeninin ilk 8 satırı ve satır toplamları:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">n</th>
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">$\\binom{n}{0}, \\binom{n}{1}, \\dots, \\binom{n}{n}$ değerleri</th>
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">Satır toplamı $2^n$</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">0</td><td style="padding:0.45rem 0.7rem">1</td><td style="padding:0.45rem 0.7rem">1</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">1</td><td style="padding:0.45rem 0.7rem">1, 1</td><td style="padding:0.45rem 0.7rem">2</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">2</td><td style="padding:0.45rem 0.7rem">1, 2, 1</td><td style="padding:0.45rem 0.7rem">4</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">3</td><td style="padding:0.45rem 0.7rem">1, 3, 3, 1</td><td style="padding:0.45rem 0.7rem">8</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">4</td><td style="padding:0.45rem 0.7rem">1, 4, 6, 4, 1</td><td style="padding:0.45rem 0.7rem">16</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">5</td><td style="padding:0.45rem 0.7rem">1, 5, 10, 10, 5, 1</td><td style="padding:0.45rem 0.7rem">32</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">6</td><td style="padding:0.45rem 0.7rem">1, 6, 15, 20, 15, 6, 1</td><td style="padding:0.45rem 0.7rem">64</td></tr>
<tr><td style="padding:0.45rem 0.7rem">7</td><td style="padding:0.45rem 0.7rem">1, 7, 21, 35, 35, 21, 7, 1</td><td style="padding:0.45rem 0.7rem">128</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l99-pascal-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> Pascal üçgeninin ilk 8 satırı bir ısı haritası olarak. Her hücre <em>n</em>. satır, <em>r</em>. sütundadır; daha parlak hücreler daha büyük $\\binom{n}{r}$ demek. Sayılar üstüne işlenmiştir. $r=n/2$ sütununa göre simetriye dikkat et — bu, $\\binom{n}{r}=\\binom{n}{n-r}$ kuralının resme dökülmüş hâlidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function binom(n,r){if(r<0||r>n)return 0;if(r===0||r===n)return 1;var k=Math.min(r,n-r);var v=1;for(var i=0;i<k;i++){v=v*(n-i)/(i+1);}return Math.round(v);}
var rows=[];var hover=[];for(var n=0;n<=7;n++){var row=[];var hov=[];for(var r=0;r<=7;r++){if(r>n){row.push(null);hov.push('');}else{var v=binom(n,r);row.push(v);hov.push('C('+n+','+r+') = '+v);}}rows.push(row);hover.push(hov);}
var xLt=['r=0','r=1','r=2','r=3','r=4','r=5','r=6','r=7'];
var yLt=['n=0','n=1','n=2','n=3','n=4','n=5','n=6','n=7'];
var heatT={z:rows,x:xLt,y:yLt,type:'heatmap',colorscale:[[0,'#0a0a0a'],[0.15,'#1e3a5f'],[0.4,'#2563eb'],[0.7,'#3b82f6'],[1,'#93c5fd']],showscale:true,colorbar:{tickfont:{color:'#e8e8e8'}},hoverinfo:'text',text:hover};
var annotationsT=[];for(var n2=0;n2<=7;n2++){for(var r2=0;r2<=n2;r2++){annotationsT.push({x:'r='+r2,y:'n='+n2,text:String(binom(n2,r2)),showarrow:false,font:{color:'#fff',size:12,family:'Geist'}});}}
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{gridcolor:'rgba(255,255,255,0.04)'},yaxis:{autorange:'reversed',gridcolor:'rgba(255,255,255,0.04)'},margin:{t:30,r:30,b:60,l:60},annotations:annotationsT};
Plotly.newPlot('plot-l99-pascal-tr',[heatT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">ÖRÜNTÜ AVI</div><div class="think-body">Satır toplamı sütununa dikkatle bak. $1, 2, 4, 8, 16, 32, 64, 128$ — her satırın toplamı $2^n$'dir. Kombinatoryal nedeni şu: $\\sum_{r=0}^{n} \\binom{n}{r}$, <em>n</em> elemanlı bir kümenin <em>tüm</em> altkümelerini (büyüklüğü 0'dan <em>n</em>'e) sayar. Her eleman ya kümeye girer ya girmez — eleman başına iki seçenek, toplamda $2^n$ altküme.</div></div>

<h2 class="lesson-title">5. Binom Teoremi (Önizleme)</h2>

<div class="calc-highlight"><strong>Pascal üçgeninin <em>n</em>. satırındaki sayılar, $(a+b)^n$ açılımının katsayılarıdır.</strong> 51. derste bunu ayrıntılı olarak kanıtlayacağız; şimdilik bağlantıya hayran kal.</div>

<div class="calc-formula"><div class="formula-label">BİNOM TEOREMİ</div><div class="formula-main">$$(a+b)^n \\;=\\; \\sum_{k=0}^{n}\\binom{n}{k}\\,a^{\\,n-k}\\,b^{\\,k}$$</div><div class="formula-sub">$(a+b)(a+b)\\cdots(a+b)$ çarpımındaki <em>n</em> parantezden tam <em>k</em> tanesinden <em>b</em> seçmenin yollarının sayısı $\\binom{n}{k}$'dir.</div></div>

<div class="calc-example"><div class="example-label">HIZLI AÇILIM</div><div class="example-body">$(a+b)^4$ açılımını Pascal'ın 4. satırını ($1,4,6,4,1$) kullanarak yaz.<br><br>$(a+b)^4 \\;=\\; a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4$.<br><br>Sayısal katsayılar $\\binom{4}{0}=1,\\binom{4}{1}=4,\\binom{4}{2}=6,\\binom{4}{3}=4,\\binom{4}{4}=1$ — tam olarak 4. satır.</div></div>

<h2 class="lesson-title">6. Tekrarlı Kombinasyon (Yıldız ve Çubuk)</h2>

<div class="calc-highlight"><strong>Peki nesneler birden fazla kez seçilebiliyorsa?</strong> Örnek: bir çay dükkânında 5 çeşit var ve sen 3 bardak sipariş ediyorsun, tekrar serbest. Farklı siparişlerin sayısı (bardakların yazılış sırası önemsiz) bir "tekrarlı kombinasyon"dur ve "yıldız ve çubuk" denilen şık bir hileyle sayılır.</div>

<div class="calc-formula"><div class="formula-label">TEKRARLI KOMBİNASYON</div><div class="formula-main">$$C^{R}(n,r) \\;=\\; \\binom{n+r-1}{r}$$</div><div class="formula-sub"><em>n</em> türden <em>r</em> büyüklüğünde çoklu küme oluşturma sayısı. Her bardak çay bir "yıldız"; çeşit değişimi bir "çubuk". $r$ yıldız ile $n-1$ çubuğu bir sıraya dizmenin $\\binom{n+r-1}{r}$ yolu vardır.</div></div>

<div class="calc-example"><div class="example-label">ÇAY DÜKKÂNI ÖRNEĞİ</div><div class="example-body">Beş çeşit, üç bardak, tekrar serbest.<br><br>$C^{R}(5,3) = \\binom{5+3-1}{3}=\\binom{7}{3}=\\dfrac{7\\cdot 6\\cdot 5}{6}=\\mathbf{35}$ farklı sipariş.<br><br>Listeleyelim: hepsi aynı (5 yol), tam ikisi aynı (5&middot;4=20 yol), üçü farklı ($\\binom{5}{3}=10$ yol) — toplam 35. &check;</div></div>

<div class="l-note">Yıldız ve çubuk, kombinasyondan sonra en kullanışlı sayma hilesidir. Özdeş nesneleri farklı kutulara dağıtmayı tartışacağımız 52. derste kısaca yeniden değineceğiz.</div>

<h2 class="lesson-title">7. Permütasyon mu Kombinasyon mu? Karar Kuralı</h2>

<div class="calc-highlight"><strong>Tek bir soruyu sor: "seçilen nesnelerin sırası önemli mi?"</strong> Evet &rarr; permütasyon. Hayır &rarr; kombinasyon. Geri kalan her şey bu tek karardan akıp gelir.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">PERMÜTASYON &mdash; SIRA ÖNEMLİ</div><div class="compare-item">Yarış sıralaması: 1., 2., 3. ayrıdır</div><div class="compare-item">Şifre oluşturma (A1B ile B1A farklı)</div><div class="compare-item">Fotoğraf için sıraya dizilmek</div><div class="compare-item">Rol atama (başkan, başkan vekili, sekreter)</div><div class="compare-item">Formül: $P(n,r)=\\dfrac{n!}{(n-r)!}$</div></div><div class="compare-col"><div class="compare-title">KOMBİNASYON &mdash; SIRA ÖNEMSİZ</div><div class="compare-item">Komite kurma (küme, liste değil)</div><div class="compare-item">Poker eli seçimi (5 kart, sıra önemsiz)</div><div class="compare-item">Piyango sayılarının seçimi</div><div class="compare-item">Pizza malzemesi seçimi</div><div class="compare-item">Formül: $\\binom{n}{r}=\\dfrac{n!}{r!(n-r)!}$</div></div></div>

<div class="calc-example"><div class="example-label">KARIŞIK ÖRNEK</div><div class="example-body">10 atlet bir yarışı bitiriyor. (a) Altın-gümüş-bronz madalyaları kaç farklı şekilde dağıtılabilir? (b) Yarıştan sonra 3'ünü röportaj için kaç farklı şekilde seçebiliriz?<br><br>(a) Sıra önemli (altın &ne; gümüş): $P(10,3)=10\\cdot 9\\cdot 8=720$.<br>(b) Sıra önemsiz (röportaj grubu yalnız bir kümedir): $\\binom{10}{3}=\\dfrac{10\\cdot 9\\cdot 8}{3!}=120$.<br><br>Aradaki $3!=6$ çarpanına dikkat et: 3 kişilik her sırasız grup, 6 farklı sıralı kürsü dizilişine karşılık gelir.</div></div>

<p class="l-text"><strong>Oranı içselleştirmek için yan yana bir tablo.</strong> $P(n,r)$'nin her zaman $\\binom{n}{r}$'den tam olarak $r!$ kat büyük olduğuna dikkat et:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">$(n,r)$</th>
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">$P(n,r)$</th>
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">$\\binom{n}{r}$</th>
<th style="padding:0.55rem 0.7rem;text-align:left;color:#3b82f6">Oran $r!$</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">(5, 2)</td><td style="padding:0.45rem 0.7rem">20</td><td style="padding:0.45rem 0.7rem">10</td><td style="padding:0.45rem 0.7rem">2</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">(6, 3)</td><td style="padding:0.45rem 0.7rem">120</td><td style="padding:0.45rem 0.7rem">20</td><td style="padding:0.45rem 0.7rem">6</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.45rem 0.7rem">(8, 4)</td><td style="padding:0.45rem 0.7rem">1680</td><td style="padding:0.45rem 0.7rem">70</td><td style="padding:0.45rem 0.7rem">24</td></tr>
<tr><td style="padding:0.45rem 0.7rem">(10, 5)</td><td style="padding:0.45rem 0.7rem">30{.}240</td><td style="padding:0.45rem 0.7rem">252</td><td style="padding:0.45rem 0.7rem">120</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l99-pvc-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $r=0,1,\\dots,10$ için $P(10,r)$ ile $\\binom{10}{r}$ karşılaştırması, log ölçek. İkisi $r=0$ ve $r=1$'de çakışır (hiç seçmemenin tek yolu vardır; tek bir nesne seçmek sıraya bağlı değildir), ardından $r$ büyüdükçe dramatik biçimde ayrışırlar — çünkü $r!$ sıralanışları permütasyon sayısını şişirir. $r=10$ civarında $P(10,10)=10!=3{.}628{.}800$ iken $\\binom{10}{10}=1$ — aralarında $10!$ kat fark var.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function fact(n){var v=1;for(var i=2;i<=n;i++)v*=i;return v;}
function Pnr(n,r){return fact(n)/fact(n-r);}
function Cnr(n,r){return fact(n)/(fact(r)*fact(n-r));}
var rsT=[0,1,2,3,4,5,6,7,8,9,10];
var pvT=rsT.map(function(r){return Pnr(10,r);});
var cvT=rsT.map(function(r){return Cnr(10,r);});
var bar1T={x:rsT,y:pvT,type:'bar',name:'P(10, r)',marker:{color:'#3b82f6'}};
var bar2T={x:rsT,y:cvT,type:'bar',name:'C(10, r)',marker:{color:'#f59e0b'}};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'r (seçilen sayısı)',gridcolor:'rgba(255,255,255,0.06)',dtick:1},yaxis:{title:'sayım (log ölçek)',type:'log',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:80},barmode:'group',legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l99-pvc-tr',[bar1T,bar2T],layT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. İskambil Eli Problemleri: Klasik Bir Oyun Alanı</h2>

<div class="calc-highlight"><strong>Standart bir deste 52 karttan oluşur.</strong> Bir "el", rastgele dağıtılan 5 karttır — el içindeki sıra önemsizdir. Yani poker eliyle ilgili her sayma sorusu bir kombinasyon problemidir.</div>

<div class="calc-example"><div class="example-label">5 KARTLIK TOPLAM EL SAYISI</div><div class="example-body">$\\binom{52}{5} \\;=\\; \\dfrac{52\\cdot 51\\cdot 50\\cdot 49\\cdot 48}{5!} \\;=\\; \\dfrac{311{.}875{.}200}{120} \\;=\\; \\mathbf{2{.}598{.}960}$.<br><br>Yaklaşık 2,6 milyon farklı el — her poker olasılığı hesabının paydası.</div></div>

<div class="calc-example"><div class="example-label">TAM 2 AS İÇEREN ELLER</div><div class="example-body">5 kartlık bir el tam 2 as içeriyorsa, kaç farklı el vardır?<br><br>1. adım: 4 astan 2 tanesini seç: $\\binom{4}{2}=6$ yol.<br>2. adım: kalan 48 karttan 3 as-dışı seç: $\\binom{48}{3}=\\dfrac{48\\cdot 47\\cdot 46}{6}=17{.}296$ yol.<br>3. adım: çarp (bağımsız seçimler): $6 \\times 17{.}296 = \\mathbf{103{.}776}$ el.</div></div>

<div class="calc-example"><div class="example-label">DÖRT ASIN HEPSİNİ İÇEREN ELLER</div><div class="example-body">$\\binom{4}{4}\\cdot\\binom{48}{1}=1\\cdot 48=\\mathbf{48}$ el. Beşinci kart 48 as-dışından herhangi biri olabilir.</div></div>

<div class="calc-graph"><div id="plot-l99-select-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> 4 nesneden (A, B, C, D etiketli) 2 tanesini seçmenin altı yolu. Her satır bir altkümedir; dolu noktalar seçilen, içi boş noktalar dışarıda bırakılandır. $\\binom{4}{2}=6$ sayımı gördüğünle örtüşür; diyagram simetriyi de somutlaştırır: 2 elemanlı bir altküme seçmek, hangi 2'sinin geride bırakılacağını seçmekle eşdeğerdir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var subsetsT=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
var labelsT=['A','B','C','D'];
var fX=[];var fY=[];var oX=[];var oY=[];var tX=[];var tY=[];var tT=[];
for(var s=0;s<subsetsT.length;s++){var rowY=subsetsT.length-s;var inSet=subsetsT[s];for(var c=0;c<4;c++){var isIn=(inSet.indexOf(c)>=0);if(isIn){fX.push(c);fY.push(rowY);}else{oX.push(c);oY.push(rowY);}}tX.push(-0.9);tY.push(rowY);tT.push('{ '+labelsT[inSet[0]]+', '+labelsT[inSet[1]]+' }');}
var tFi={x:fX,y:fY,mode:'markers',name:'seçilen',marker:{color:'#3b82f6',size:22,line:{color:'#93c5fd',width:2}}};
var tOp={x:oX,y:oY,mode:'markers',name:'dışarıda',marker:{color:'#0a0a0a',size:22,line:{color:'rgba(255,255,255,0.4)',width:1.5}}};
var tLa={x:tX,y:tY,mode:'text',name:'altküme',text:tT,textposition:'middle right',textfont:{color:'#e8e8e8',size:12},showlegend:false};
var hX=[0,1,2,3];var hY=[7,7,7,7];var tHe={x:hX,y:hY,mode:'text',name:'nesneler',text:labelsT,textfont:{color:'#f59e0b',size:14},showlegend:false};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.5,4.5],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[0,8],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l99-select-tr',[tHe,tFi,tOp,tLa],layT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Sık Yapılan Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$r!$ bölenini unutmak</div><div class="card-body">Kombinasyon problemini permütasyon $P(n,r)$ ile hesaplamak, sonucu $r!$ kat şişirir. Daima sor: "seçilen iki nesneyi yer değiştirsem yeni bir düzenleme oluşur mu?" Hayırsa $r!$'ye böl.</div></div>
<div class="calc-card"><div class="card-title">Paydadaki $(n-r)!$'i unutmak</div><div class="card-body">Sık karşılaşılan hata: $\\dfrac{n!}{r!(n-r)!}$ yerine $\\dfrac{n!}{r!}$ yazmak. $(n-r)!$, $n!$'in kullanılmayan kuyruğunu sadeleştirir. Onsuz cevap muazzam biçimde şişer.</div></div>
<div class="calc-card"><div class="card-title">Rol farklıyken $C$ kullanmak</div><div class="card-body">"5 kişiden bir başkan ve bir başkan vekili seç" permütasyondur, $P(5,2)=20$; $\\binom{5}{2}=10$ değil. Roller konumdur — sıra önemlidir.</div></div>
<div class="calc-card"><div class="card-title">"İçermeli / içermemeli" kısıtını atlamak</div><div class="card-body">Bir nesne mecburen içerideyse, kalanları küçük havuzdan seç: $\\binom{n-1}{r-1}$. Mecburen dışarıdaysa, hepsini küçük havuzdan seç: $\\binom{n-1}{r}$. Önce problemi indirge, sonra say.</div></div>
</div>

<h2 class="lesson-title">10. Çözümlü Alıştırmalar</h2>

<p class="l-text">Her problemi önce kendin dene, sonra çözümü oku. Bu setteki sorular dersin tüm tekniklerini kapsıyor.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; ÖĞRENCİ KOMİTESİ</div><div class="example-body"><strong>10 öğrenciden 3 kişilik bir komite seç. Kaç komite vardır?</strong><br><br>Sıra önemsiz, yani kombinasyon.<br><br>$\\binom{10}{3}=\\dfrac{10\\cdot 9\\cdot 8}{3!}=\\dfrac{720}{6}=\\mathbf{120}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; İSKAMBİL ELİ</div><div class="example-body"><strong>52 kartlık standart bir desteden kaç farklı 5 kartlık el dağıtılabilir?</strong><br><br>$\\binom{52}{5}=\\dfrac{52\\cdot 51\\cdot 50\\cdot 49\\cdot 48}{120}=\\mathbf{2{.}598{.}960}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; TAM 2 AS</div><div class="example-body"><strong>5 kartlık bir el tam 2 as içeriyorsa kaç farklı el vardır?</strong><br><br>4 astan 2'sini seç: $\\binom{4}{2}=6$.<br>48 as-dışından 3 seç: $\\binom{48}{3}=17{.}296$.<br>Çarp: $6 \\cdot 17{.}296 = \\mathbf{103{.}776}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; ZORUNLU KAPSAMA KISITI</div><div class="example-body"><strong>Bir sınavda 10 soru var; tam 6 tanesini cevaplayacaksın ve 5. soruyu mutlaka çözmelisin. Cevaplanacak küme kaç farklı şekilde seçilir?</strong><br><br>5. soru kümede sabit. Diğer 5'i kalan 9 sorudan seç: $\\binom{9}{5}=\\binom{9}{4}=\\dfrac{9\\cdot 8\\cdot 7\\cdot 6}{4!}=\\dfrac{3024}{24}=\\mathbf{126}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; SİMETRİ KISA YOLU</div><div class="example-body"><strong>$\\binom{15}{13}$ değerini hesapla.</strong><br><br>$\\binom{n}{r}=\\binom{n}{n-r}$ kullan: $\\binom{15}{13}=\\binom{15}{2}=\\dfrac{15\\cdot 14}{2}=\\mathbf{105}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; PASCAL KURALI</div><div class="example-body"><strong>Faktöriyel formülü olmadan, $\\binom{7}{2}=21$ ve $\\binom{7}{3}=35$ değerlerini kullanarak $\\binom{8}{3}$'ü bul.</strong><br><br>Pascal kuralı: $\\binom{8}{3}=\\binom{7}{2}+\\binom{7}{3}=21+35=\\mathbf{56}$.<br><br>Formülle kontrol: $\\binom{8}{3}=\\dfrac{8\\cdot 7\\cdot 6}{6}=56$. &check;</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; PERMÜTASYON vs KOMBİNASYON</div><div class="example-body"><strong>7 kitaptan (a) 3'ünü rafa sıralı dizmek (b) 3'ünü sahile götürmek üzere seçmek — kaç yol vardır?</strong><br><br>(a) Rafın sırası önemli: $P(7,3)=7\\cdot 6\\cdot 5=\\mathbf{210}$.<br>(b) Çanta sırasızdır: $\\binom{7}{3}=\\dfrac{210}{6}=\\mathbf{35}$.<br><br>Aynı ham soru (7'den 3 seç) — (a)'da sıra önemli olduğu için (b)'den farklı sayım.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; PİYANGO ŞANSI</div><div class="example-body"><strong>Bir piyango 49 sayıdan 6'sını seçiyor (sıra önemsiz). Kaç farklı kupon vardır? Tek bir kuponla kazanma olasılığı nedir?</strong><br><br>$\\binom{49}{6}=\\dfrac{49\\cdot 48\\cdot 47\\cdot 46\\cdot 45\\cdot 44}{6!}=\\dfrac{10{.}068{.}347{.}520}{720}=\\mathbf{13{.}983{.}816}$.<br><br>Olasılık $=\\dfrac{1}{13{.}983{.}816}\\approx 7{,}15\\times 10^{-8}$. Yaklaşık 14 milyonda 1 — bir yıl içinde yıldırım çarpma olasılığından kabaca 10 kat daha küçük.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 9 &mdash; KARMA CİNSİYET KOMİTESİ</div><div class="example-body"><strong>Bir kulüpte 6 kız ve 4 erkek var. Tam 2 kız ve 2 erkek içeren 4 kişilik bir komite kaç farklı şekilde kurulabilir?</strong><br><br>Kızları erkeklerden bağımsız seç, sonra çarp (çarpma kuralı).<br>Kızlar: $\\binom{6}{2}=\\dfrac{6\\cdot 5}{2}=15$.<br>Erkekler: $\\binom{4}{2}=\\dfrac{4\\cdot 3}{2}=6$.<br>Toplam: $15 \\times 6 = \\mathbf{90}$ komite.<br><br>Mantık kontrolü: hiç kısıt olmadan 4 kişilik komite sayısı $\\binom{10}{4}=210$'dur ve 90, bunun bir kesridir — beklendiği gibi.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> 51. ders Pascal üçgenini alıp $(a+b)^n=\\sum_k \\binom{n}{k}a^{n-k}b^k$ binom teoremini kanıtlayacak. Sonra 52. ders, "<em>n</em> özdeş topu <em>k</em> farklı kutuya dağıt" sorusuna — başka bir klasik yıldız-çubuk problemi — geri dönecek; 53. ders ise her şeyi ayrık olasılığa bağlayacak. Kombinasyon hepsinin en çok kullanılan nesnesidir.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\binom{n}{r}=\\dfrac{n!}{r!\\,(n-r)!}$, <em>n</em> nesneden <em>r</em>'sinin sırasız seçimini sayar</li>
<li>Türetim: $\\binom{n}{r}=P(n,r)/r!$ — permütasyonu, artık önemsemediğimiz $r!$ sıralanışa böl</li>
<li>Simetri: $\\binom{n}{r}=\\binom{n}{n-r}$; özel değerler $\\binom{n}{0}=\\binom{n}{n}=1$, $\\binom{n}{1}=n$</li>
<li>Pascal kuralı: $\\binom{n}{r}=\\binom{n-1}{r-1}+\\binom{n-1}{r}$ — iç değerler iki üst değerin toplamıdır</li>
<li>Pascal üçgeninin <em>n</em>. satırı $2^n$'e toplanır (n elemanlı kümenin tüm altkümeleri)</li>
<li>Tekrarlı kombinasyon: $\\binom{n+r-1}{r}$ — yıldız ve çubukla çoklu kümeler</li>
<li>Karar kuralı: sıra önemli &rarr; permütasyon $P(n,r)$; sıra önemsiz &rarr; kombinasyon $\\binom{n}{r}$</li>
<li>Kısıtlar problemi indirger: zorunlu içerilen eleman $\\binom{n-1}{r-1}$, zorunlu dışlanan $\\binom{n-1}{r}$ verir</li>
</ul>
</div>`

};
