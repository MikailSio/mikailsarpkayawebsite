window.DISCRETE_L1 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/65" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Sum Formulas (Σ)</a> <span style="opacity:0.55;font-size:0.82em">(Math L65)</span></li>
<li><a href="/tutorials/matematik/98" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Permutations</a> <span style="opacity:0.55;font-size:0.82em">(Math L98)</span></li>
<li><a href="/tutorials/matematik/99" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Combinations</a> <span style="opacity:0.55;font-size:0.82em">(Math L99)</span></li>
</ul>
</div>
<p class="l-text"><strong>Counting sounds like the easiest thing in mathematics — until you actually try to do it.</strong> "How many passwords of length 8 are there?" "How many poker hands beat three of a kind?" "How many ways can I split twelve donuts among four students?" The honest answer to each of these is in the millions, billions, or trillions, and listing them is hopeless. Combinatorics is the discipline of getting the right number without listing anything. It is the art of counting <em>without</em> counting.</p>

<p class="l-text">By the end of this lesson you will look at a problem like "how many distinct anagrams of MISSISSIPPI are there?" and write the answer in one line: <em>11! / (4! · 4! · 2! · 1!) = 34 650</em>. No enumeration, no brute force — just a clean factorial expression that captures the structure of the problem. That habit of reading the structure first and computing later is the entire point of this course's first lesson.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Apply the sum rule and product rule cleanly, and tell at a glance which one a counting problem needs</li>
<li>Distinguish permutations (order matters) from combinations (order does not) and pick the right formula every time</li>
<li>Handle counting <em>with repetition</em>: multinomial permutations like MISSISSIPPI, stars-and-bars for distributing candies</li>
<li>Expand <em>(x+y)<sup>n</sup></em> with the binomial theorem and read identities like <em>Σ C(n,k) = 2<sup>n</sup></em> straight off Pascal's triangle</li>
<li>Use inclusion-exclusion to count unions of overlapping sets, and apply it to derangements and surjective functions</li>
<li>Invoke the pigeonhole principle to prove existence results in one or two lines — birthday months, Ramsey R(3,3), and more</li>
</ul>
</div>

<h2 class="lesson-title">1. The Two Basic Rules of Counting</h2>

<div class="calc-highlight"><strong>Almost every counting problem reduces to two rules.</strong> Sum rule: when you are choosing between mutually exclusive cases, <em>add</em>. Product rule: when you are making a sequence of independent choices, <em>multiply</em>. Get fluent at recognising which one applies and you are halfway to a working combinatorial argument.</div>

<div class="calc-formula"><div class="formula-label">SUM RULE</div><div class="formula-main">$$|A \\cup B| = |A| + |B| \\quad \\text{when } A \\cap B = \\emptyset$$</div><div class="formula-sub">If two sets of choices do not overlap, count them separately and add. Generalises to any finite number of disjoint sets.</div></div>

<div class="calc-formula"><div class="formula-label">PRODUCT RULE</div><div class="formula-main">$$|A_1 \\times A_2 \\times \\cdots \\times A_k| \\;=\\; n_1 \\cdot n_2 \\cdots n_k$$</div><div class="formula-sub">If a procedure is a sequence of k independent steps with n_i options at step i, the total number of outcomes is the product of the n_i.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — LUNCH</div><div class="example-body">A cafeteria offers 4 main courses, 3 sides, and 5 drinks. How many distinct lunch trays (one of each)?<br><br><strong>Product rule:</strong> 4 · 3 · 5 = <strong>60</strong> different trays. The choices are independent, so we multiply.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — LICENCE PLATES</div><div class="example-body">A Turkish licence plate looks like <em>34 ABC 123</em>: two digits (the city code, here 34), three letters (A–Z, 26 options each), three digits (0–9, 10 options each). Ignoring restrictions on the city code, how many plates are possible?<br><br><strong>Product rule:</strong> 26³ · 10³ = 17 576 · 1000 = <strong>17 576 000</strong>. Plenty of room.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SUM RULE</div><div class="example-body">A student travels from Istanbul to Ankara by either bus (8 daily departures), train (3 daily departures), or plane (12 daily departures). The cases are mutually exclusive (one trip, one mode). How many travel options today?<br><br><strong>Sum rule:</strong> 8 + 3 + 12 = <strong>23</strong> options.</div></div>

<div class="l-note"><strong>The mental test:</strong> ask "am I doing one thing OR another thing?" → sum. "Am I doing one thing AND THEN another?" → product. The English words "or / and-then" are reliable triggers.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">How many 4-digit PIN codes are possible (digits 0–9, repetition allowed)? Answer: 10⁴ = 10 000. How many if no digit may repeat? Answer: 10 · 9 · 8 · 7 = 5040 (sneak preview of permutations).</div></div>

<h2 class="lesson-title">2. Permutations</h2>

<div class="calc-highlight"><strong>A permutation is an arrangement in which order matters.</strong> "ABC" and "CBA" are different permutations of the same three letters. As soon as the question hints at <em>arranging</em>, <em>ordering</em>, <em>ranking</em>, or <em>lining up</em> — reach for a permutation formula.</div>

<div class="calc-formula"><div class="formula-label">PERMUTATIONS OF k FROM n (NO REPETITION)</div><div class="formula-main">$$P(n, k) \\;=\\; \\frac{n!}{(n-k)!} \\;=\\; n \\cdot (n-1) \\cdots (n-k+1)$$</div><div class="formula-sub">Pick k items from n distinct items, where order matters and each item is used at most once.</div></div>

<p class="l-text"><strong>Where does this formula come from?</strong> Pure product rule. Position 1: <em>n</em> choices. Position 2: <em>n − 1</em> choices (one used up). Position 3: <em>n − 2</em>. Continue for k positions: the product n · (n−1) · (n−2) · · · (n−k+1) has exactly k factors, which is the same as n! / (n−k)!.</p>

<div class="calc-formula"><div class="formula-label">SPECIAL CASE: PERMUTING ALL n</div><div class="formula-main">$$P(n, n) \\;=\\; n!$$</div><div class="formula-sub">If you arrange ALL n items, every one of the n! orderings is a distinct permutation.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — BOOKS ON A SHELF</div><div class="example-body">How many ways to arrange 5 distinct books on a shelf?<br><br><strong>P(5, 5) = 5! = 120</strong> arrangements. Position 1 has 5 candidates, position 2 has 4, …, position 5 has 1 — product 5 · 4 · 3 · 2 · 1.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — 3-LETTER WORDS</div><div class="example-body">How many 3-letter "words" (any combination, real or not) can you form from the 26 English letters if no letter repeats?<br><br><strong>P(26, 3) = 26 · 25 · 24 = 15 600.</strong></div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — RACE PODIUM</div><div class="example-body">Ten sprinters race for gold, silver, and bronze. How many possible podium outcomes?<br><br><strong>P(10, 3) = 10 · 9 · 8 = 720.</strong> Order matters here — gold ≠ silver.</div></div>

<div class="l-note"><strong>Why factorials grow ferociously:</strong> 10! ≈ 3.6 · 10⁶, 20! ≈ 2.4 · 10¹⁸, 100! ≈ 9.3 · 10¹⁵⁷. By n = 70 you already exceed the number of atoms in the observable universe. This explosive growth is why brute-force enumeration fails almost immediately, and why a closed-form count is so precious.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">In how many ways can 6 people sit around a <em>round</em> table? (Bonus: only relative positions matter on a round table.) Answer: (6−1)! = 120. Fix one person, permute the other five.</div></div>

<h2 class="lesson-title">3. Combinations</h2>

<div class="calc-highlight"><strong>A combination is a selection in which order does NOT matter.</strong> {Alice, Bob, Carol} and {Carol, Alice, Bob} are the same committee. Whenever you read "choose", "pick", "select a group", or "form a team" — reach for a combination.</div>

<div class="calc-formula"><div class="formula-label">COMBINATIONS OF k FROM n (NO REPETITION)</div><div class="formula-main">$$C(n, k) \\;=\\; \\binom{n}{k} \\;=\\; \\frac{n!}{k!\\,(n-k)!}$$</div><div class="formula-sub">Pick k items from n distinct items, order irrelevant. Pronounced "n choose k".</div></div>

<p class="l-text"><strong>Where does this formula come from?</strong> Start with P(n, k) = n!/(n−k)! permutations. Every <em>set</em> of k items can be arranged in k! orders, so the permutations overcount by exactly a factor of k!. Divide it out: C(n, k) = P(n, k) / k! = n! / (k! (n−k)!).</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — POKER HAND</div><div class="example-body">How many distinct 5-card hands from a 52-card deck? (Order of cards in your hand is irrelevant.)<br><br><strong>C(52, 5) = 52! / (5! · 47!) = 2 598 960.</strong> About 2.6 million hands — this is the denominator every probability in poker uses.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — COMMITTEE</div><div class="example-body">From a class of 10 students, choose a 3-person committee. How many possible committees?<br><br><strong>C(10, 3) = 10! / (3! · 7!) = (10·9·8)/(3·2·1) = 120.</strong> Compare to P(10, 3) = 720 for a podium: combinations are smaller by a factor of 3! = 6 because committee members are not ranked.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Symmetry identity</div><div class="card-body">C(n, k) = C(n, n−k). Choosing k to include is the same as choosing n−k to exclude.</div><div class="card-formula">C(10,3) = C(10,7)</div></div>
<div class="calc-card"><div class="card-title">Boundary values</div><div class="card-body">C(n, 0) = C(n, n) = 1. There is exactly one way to pick none, and exactly one way to pick all.</div><div class="card-formula">C(n,0)=1</div></div>
<div class="calc-card"><div class="card-title">Adjacent values</div><div class="card-body">C(n, 1) = n. There are n ways to pick a single item.</div><div class="card-formula">C(n,1)=n</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT — PERMUTATION OR COMBINATION?</div><div class="think-body"><strong>(a)</strong> Selecting 5 lottery numbers from 1–49. Order? No → combination, C(49, 5).<br><strong>(b)</strong> Setting a 4-digit ATM PIN. Order? Yes → permutation/product, 10⁴ = 10 000.<br><strong>(c)</strong> Choosing 3 books to bring on holiday from 12 unread ones. Order? No → C(12, 3) = 220.</div></div>

<h2 class="lesson-title">4. Permutations with Repetition</h2>

<div class="calc-highlight"><strong>Two repetition scenarios appear constantly.</strong> (a) k-length sequences from n options where each option may repeat — answer is <em>n<sup>k</sup></em>. (b) Permutations of a multiset (some letters repeated) — answer is the <em>multinomial coefficient</em> n! / (k_1! k_2! … k_m!).</div>

<div class="calc-formula"><div class="formula-label">SEQUENCES WITH REPETITION</div><div class="formula-main">$$n^k$$</div><div class="formula-sub">Number of k-length sequences from n symbols, each symbol reusable.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — PASSWORDS</div><div class="example-body">How many 8-character passwords using 26 letters (case-sensitive: 52 letters) and 10 digits — that is 62 symbols — with repetition allowed?<br><br><strong>62⁸ ≈ 2.18 · 10¹⁴ ≈ 218 trillion.</strong> A modern GPU brute-forcing 10⁹ hashes/second still takes ~60 hours. That is the entire reason 8 characters is the practical minimum for passwords; for 12 it is millions of years.</div></div>

<div class="calc-formula"><div class="formula-label">MULTINOMIAL PERMUTATION</div><div class="formula-main">$$\\frac{n!}{k_1! \\, k_2! \\, \\cdots \\, k_m!} \\qquad \\text{with } k_1+k_2+\\cdots+k_m = n$$</div><div class="formula-sub">Number of distinct arrangements of n objects where there are k_i indistinguishable copies of type i.</div></div>

<p class="l-text"><strong>Why divide by k_i! ?</strong> If all n letters were distinguishable, we would have n! arrangements. But the k_1 copies of letter 1 are indistinguishable, so each true arrangement has been overcounted k_1! times by the permutations among those copies. Same for each other repeated letter. Divide the overcount out.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — MISSISSIPPI</div><div class="example-body">How many distinct anagrams of <strong>MISSISSIPPI</strong>?<br><br>Letters: M (1), I (4), S (4), P (2). Total length n = 11. So the count is:<br><br>$$\\frac{11!}{1! \\cdot 4! \\cdot 4! \\cdot 2!} = \\frac{39\\,916\\,800}{1 \\cdot 24 \\cdot 24 \\cdot 2} = \\frac{39\\,916\\,800}{1152} = \\mathbf{34\\,650}.$$<br><br>Try listing them by hand — you would not finish in your lifetime, and yet the answer dropped out of a single ratio of factorials.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — BANANA</div><div class="example-body"><strong>BANANA:</strong> B (1), A (3), N (2). n = 6.<br><br>6! / (1! · 3! · 2!) = 720 / 12 = <strong>60</strong> anagrams.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">How many distinct anagrams of "ANTHROPIC"? All 9 letters are distinct → 9! = 362 880. What about "AARDVARK"? A (3), R (2), D (1), V (1), K (1), n = 8 → 8! / (3! · 2!) = 40 320 / 12 = 3360.</div></div>

<h2 class="lesson-title">5. Combinations with Repetition (Stars and Bars)</h2>

<div class="calc-highlight"><strong>Picking k items from n types where each type can be picked any number of times.</strong> This is the secret weapon for distribution problems: "how many ways to split 10 candies among 4 kids?", "how many monomials of degree 5 in 3 variables?", "how many ways to fill a 6-scoop ice cream cup from 8 flavours?".</div>

<div class="calc-formula"><div class="formula-label">COMBINATIONS WITH REPETITION</div><div class="formula-main">$$\\binom{n + k - 1}{k} \\;=\\; \\binom{n + k - 1}{n - 1}$$</div><div class="formula-sub">Number of multisets of size k from n types, equivalently the number of non-negative integer solutions to x_1 + x_2 + ... + x_n = k.</div></div>

<p class="l-text"><strong>The stars-and-bars proof.</strong> Imagine k identical stars and (n−1) bars used as dividers between n bins. Any arrangement of these k + (n−1) = n + k − 1 symbols in a row encodes a distribution: the number of stars between the i-th and (i+1)-th bar is the count assigned to bin i. The total number of arrangements is C(n+k−1, k), because we choose which k of the n+k−1 positions hold stars.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — CANDIES</div><div class="example-body">How many ways to distribute 10 identical candies to 4 distinguishable kids (any kid may receive zero)?<br><br>n = 4 (types/bins), k = 10 (items). Answer = C(10 + 4 − 1, 10) = <strong>C(13, 10) = C(13, 3) = 286</strong>.<br><br>One such distribution is **⋅⋅⋅⋅|⋅⋅|⋅⋅⋅|⋅, encoding (4, 2, 3, 1).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — ICE CREAM</div><div class="example-body">An ice-cream shop has 8 flavours. You buy 6 scoops, order does not matter, repetition allowed. How many distinct cups?<br><br>C(8 + 6 − 1, 6) = C(13, 6) = <strong>1716</strong>. With 6 scoops and 8 flavours you already have 1716 distinct cups.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — INTEGER COMPOSITIONS</div><div class="example-body">How many non-negative integer solutions to x_1 + x_2 + x_3 = 10?<br><br>n = 3 variables, k = 10. Answer = C(12, 10) = C(12, 2) = <strong>66</strong>.<br><br>If we instead require POSITIVE integers (each x_i ≥ 1), substitute y_i = x_i − 1 ≥ 0 to get y_1 + y_2 + y_3 = 7, giving C(9, 7) = C(9, 2) = 36.</div></div>

<div class="l-note"><strong>Pattern to memorise:</strong> "k things into n bins, repeats allowed, order in each bin irrelevant" ⇒ C(n+k−1, k). Forget the formula and you will be reciting "stars and bars" at the whiteboard forever, which is also fine.</div>

<h2 class="lesson-title">6. The Binomial Theorem and Pascal's Triangle</h2>

<div class="calc-highlight"><strong>The binomial coefficient C(n, k) does double duty.</strong> It counts subsets — and it appears as the coefficient of x<sup>n−k</sup>y<sup>k</sup> in the expansion of (x+y)<sup>n</sup>. The two interpretations are not a coincidence; the algebra and the counting are the same fact in two notations.</div>

<div class="calc-formula"><div class="formula-label">BINOMIAL THEOREM</div><div class="formula-main">$$(x + y)^n \\;=\\; \\sum_{k=0}^{n} \\binom{n}{k} \\, x^{n-k} \\, y^k$$</div><div class="formula-sub">When you fully expand (x+y)^n, the coefficient of x^(n-k) y^k is exactly the number of subsets of size k from an n-element set.</div></div>

<p class="l-text"><strong>Combinatorial proof.</strong> Write (x+y)<sup>n</sup> as the product (x+y)(x+y)···(x+y) with n factors. To form a term, pick either x or y from each factor and multiply. The total degree of y in the resulting monomial equals the number of factors from which y was picked. The number of ways to pick y from exactly k of the n factors is C(n, k), and each such choice produces the same monomial x<sup>n−k</sup>y<sup>k</sup>. Sum over k.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — EXPAND (x+y)^4</div><div class="example-body">$$(x+y)^4 = \\binom{4}{0}x^4 + \\binom{4}{1}x^3 y + \\binom{4}{2}x^2 y^2 + \\binom{4}{3}x y^3 + \\binom{4}{4}y^4$$<br><br>= 1·x⁴ + 4·x³y + 6·x²y² + 4·xy³ + 1·y⁴. The row of coefficients (1, 4, 6, 4, 1) is line n = 4 of Pascal's triangle.</div></div>

<div class="calc-graph"><div id="plot-l1-pascal-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> Pascal's triangle as a heatmap for rows 0 through 15. Cell (n, k) is C(n, k), shown on a log-colour scale because the values explode near the middle of each row. Notice the symmetry C(n, k) = C(n, n−k) reflected across the diagonal of each row, and how the largest entry of row n always sits at k = ⌊n/2⌋.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=15;var z=[];var txt=[];
function bin(n,k){if(k<0||k>n)return 0;var r=1;if(k>n-k)k=n-k;for(var i=0;i<k;i++){r=r*(n-i)/(i+1);}return Math.round(r);}
for(var n=0;n<=N;n++){var row=[];var tr=[];for(var k=0;k<=N;k++){if(k<=n){var v=bin(n,k);row.push(Math.log10(v+1));tr.push(String(v));}else{row.push(null);tr.push('');}}z.push(row);txt.push(tr);}
var ks=[];for(var i=0;i<=N;i++)ks.push(i);
var data=[{z:z,x:ks,y:ks,text:txt,texttemplate:'%{text}',type:'heatmap',colorscale:[[0,'#0a0a0a'],[0.2,'#1e3a8a'],[0.5,'#3b82f6'],[0.8,'#93c5fd'],[1,'#fef3c7']],showscale:false,hovertemplate:'n=%{y}, k=%{x}<br>C(n,k)=%{text}<extra></extra>'}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist',size:11},xaxis:{title:'k',dtick:1,gridcolor:'rgba(255,255,255,0.05)'},yaxis:{title:'n',dtick:1,autorange:'reversed',gridcolor:'rgba(255,255,255,0.05)'},margin:{t:30,r:30,b:55,l:55}};
Plotly.newPlot('plot-l1-pascal-en',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h3 style="margin-top:1.6rem;color:#3b82f6">Three identities you should own</h3>

<div class="calc-formula"><div class="formula-label">PASCAL'S RULE</div><div class="formula-main">$$\\binom{n}{k} \\;=\\; \\binom{n-1}{k-1} + \\binom{n-1}{k}$$</div><div class="formula-sub">The recursion that generates Pascal's triangle: every interior entry is the sum of the two entries directly above it.</div></div>

<p class="l-text"><strong>Combinatorial proof of Pascal's rule.</strong> Fix one specific person, call her Alice, in your n-element set. A size-k subset either <em>includes</em> Alice (choose the remaining k−1 from the other n−1 people: C(n−1, k−1) ways) or <em>excludes</em> her (choose all k from the other n−1: C(n−1, k) ways). The two cases are disjoint, so add. Done — no algebra required.</p>

<div class="calc-formula"><div class="formula-label">SUM OF A ROW</div><div class="formula-main">$$\\sum_{k=0}^{n} \\binom{n}{k} \\;=\\; 2^n$$</div><div class="formula-sub">The total number of subsets of an n-set, including the empty set and the full set. Set x = y = 1 in the binomial theorem and read it off.</div></div>

<p class="l-text"><strong>Combinatorial proof.</strong> An n-set has 2<sup>n</sup> subsets (each element is in or out — product rule, 2 choices each). Split them by size: there are C(n, k) subsets of size k. Summing over k recovers the total. Same two numbers, two ways of arranging the count.</p>

<div class="calc-formula"><div class="formula-label">WEIGHTED ROW SUM</div><div class="formula-main">$$\\sum_{k=0}^{n} k \\binom{n}{k} \\;=\\; n \\cdot 2^{n-1}$$</div><div class="formula-sub">The total number of (subset, chosen-element) pairs from an n-set.</div></div>

<p class="l-text"><strong>Combinatorial proof.</strong> Count pairs (S, x) where S ⊆ {1,…,n} and x ∈ S in two ways. One way: pick S first (size k contributes k pairs), giving Σ k·C(n,k). Other way: pick x first (n choices), then any subset of the remaining n−1 elements that x will join (2<sup>n−1</sup> options). Both expressions count the same pairs, so they are equal.</p>

<div class="calc-graph"><div id="plot-l1-binompmf-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the binomial distribution Pr[X=k] = C(20, k)·(1/2)^20 for n = 20 fair coin flips. The bell shape is no accident — it is the central limit theorem operating on the discrete binomial. The mean sits exactly at k = 10 and the standard deviation is √(n·p·(1−p)) = √5 ≈ 2.24. Notice how C(20, 10) = 184 756 is the largest single coefficient, dwarfing C(20, 0) = 1.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function bin(n,k){var r=1;if(k>n-k)k=n-k;for(var i=0;i<k;i++){r=r*(n-i)/(i+1);}return r;}
var n=20;var xs=[],ys=[],txt=[];var denom=Math.pow(2,n);
for(var k=0;k<=n;k++){xs.push(k);var p=bin(n,k)/denom;ys.push(p);txt.push('C(20,'+k+')='+Math.round(bin(n,k)));}
var data=[{x:xs,y:ys,type:'bar',marker:{color:'#3b82f6'},hovertext:txt,hovertemplate:'k=%{x}<br>P=%{y:.4f}<br>%{hovertext}<extra></extra>',name:'P(X=k)'}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'k',dtick:2,gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'Pr[X = k]',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-binompmf-en',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l1-cvsp-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> for a fixed selection size k = 3, the orange curve P(n, 3) = n(n−1)(n−2) grows like n³, while the blue C(n, 3) = P(n,3)/6 grows like n³/6. They differ by exactly the factor k! = 6 at every n. The vertical separation is constant in log scale because the ratio is fixed.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],c=[],p=[];
for(var n=3;n<=30;n++){xs.push(n);var perm=n*(n-1)*(n-2);p.push(perm);c.push(perm/6);}
var d1={x:xs,y:c,mode:'lines+markers',name:'C(n, 3)',line:{color:'#3b82f6',width:2.6},marker:{size:6}};
var d2={x:xs,y:p,mode:'lines+markers',name:'P(n, 3)',line:{color:'#f59e0b',width:2.6,dash:'dot'},marker:{size:6}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'count (log)',type:'log',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-cvsp-en',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Expand (1 + x)<sup>5</sup> by reading off row 5 of Pascal's triangle: (1, 5, 10, 10, 5, 1). Answer: 1 + 5x + 10x² + 10x³ + 5x⁴ + x⁵. Now set x = 1: you recover 32 = 2<sup>5</sup>, confirming the row-sum identity.</div></div>

<h2 class="lesson-title">7. The Multinomial Theorem</h2>

<div class="calc-highlight"><strong>Generalising (x+y)<sup>n</sup> to (x_1 + x_2 + ... + x_m)<sup>n</sup>.</strong> Same algebraic identity, larger alphabet. The coefficients are exactly the multinomial coefficients you saw in the MISSISSIPPI count of section 4.</div>

<div class="calc-formula"><div class="formula-label">MULTINOMIAL THEOREM</div><div class="formula-main">$$(x_1 + x_2 + \\cdots + x_m)^n \\;=\\; \\sum_{k_1+k_2+\\cdots+k_m = n} \\binom{n}{k_1, k_2, \\ldots, k_m} \\, x_1^{k_1} x_2^{k_2} \\cdots x_m^{k_m}$$</div><div class="formula-sub">Sum runs over non-negative integer tuples (k_1, ..., k_m) summing to n. The coefficient C(n; k_1, ..., k_m) = n! / (k_1! k_2! ... k_m!) counts the number of arrangements of the multiset.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TRINOMIAL</div><div class="example-body">Find the coefficient of x² y³ z in the expansion of (x + y + z)<sup>6</sup>.<br><br>k_1 = 2, k_2 = 3, k_3 = 1, sum = 6. ✓<br><br>Coefficient = 6! / (2! · 3! · 1!) = 720 / (2 · 6 · 1) = <strong>60</strong>.<br><br>So the term is 60 x² y³ z.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DICE</div><div class="example-body">Roll five 6-sided dice. How many distinct outcomes have exactly two 1s, two 2s, and one 6?<br><br>This is a multinomial permutation of the multiset {1, 1, 2, 2, 6}: 5! / (2! · 2! · 1!) = <strong>30</strong> arrangements.</div></div>

<div class="l-note"><strong>Number of distinct terms in (x_1+...+x_m)^n:</strong> equals the number of non-negative integer solutions to k_1 + ... + k_m = n, which by stars-and-bars is C(n + m − 1, n). For (x+y+z)<sup>6</sup>: C(8, 6) = 28 distinct monomials.</div>

<h2 class="lesson-title">8. The Inclusion-Exclusion Principle</h2>

<div class="calc-highlight"><strong>How do you count |A ∪ B| when A and B overlap?</strong> The naive |A| + |B| double-counts the intersection, so subtract it once: |A ∪ B| = |A| + |B| − |A ∩ B|. For three sets it gets more delicate; for n sets it becomes an alternating sum.</div>

<div class="calc-formula"><div class="formula-label">INCLUSION-EXCLUSION (TWO SETS)</div><div class="formula-main">$$|A \\cup B| \\;=\\; |A| + |B| - |A \\cap B|$$</div><div class="formula-sub">Add the singles, subtract the overlap. The simplest non-trivial case.</div></div>

<div class="calc-formula"><div class="formula-label">INCLUSION-EXCLUSION (THREE SETS)</div><div class="formula-main">$$|A \\cup B \\cup C| \\;=\\; |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|$$</div><div class="formula-sub">Triple intersection added BACK at the end. The signs alternate.</div></div>

<div class="calc-formula"><div class="formula-label">GENERAL INCLUSION-EXCLUSION</div><div class="formula-main">$$\\left| \\bigcup_{i=1}^{n} A_i \\right| \\;=\\; \\sum_{k=1}^{n} (-1)^{k+1} \\sum_{|S|=k} \\left| \\bigcap_{i \\in S} A_i \\right|$$</div><div class="formula-sub">Sum over all non-empty subsets S of {1,...,n}, weighted by (-1)^(|S|+1).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — STUDENTS</div><div class="example-body">In a class of 50 students, 28 study French, 24 study German, and 10 study both. How many study at least one language?<br><br>|F ∪ G| = |F| + |G| − |F ∩ G| = 28 + 24 − 10 = <strong>42</strong>. So 50 − 42 = 8 students study neither.</div></div>

<h3 style="margin-top:1.4rem;color:#3b82f6">Application 1: Derangements</h3>

<p class="l-text">A <em>derangement</em> is a permutation with NO fixed points — nobody stays in their original seat. The number of derangements of n elements, written D_n or !n, is one of the most beautiful inclusion-exclusion results.</p>

<div class="calc-formula"><div class="formula-label">DERANGEMENT FORMULA</div><div class="formula-main">$$D_n \\;=\\; n! \\sum_{k=0}^{n} \\frac{(-1)^k}{k!} \\;\\approx\\; \\frac{n!}{e}$$</div><div class="formula-sub">Strikingly, D_n / n! → 1/e ≈ 0.368 as n grows. The probability that a random permutation has no fixed point is ≈ 36.8%, regardless of n.</div></div>

<p class="l-text"><strong>Derivation sketch.</strong> Let A_i be the set of permutations where element i IS fixed. We want permutations in none of the A_i, i.e. n! − |A_1 ∪ A_2 ∪ ... ∪ A_n|. The k-fold intersection |A_{i_1} ∩ ... ∩ A_{i_k}| equals (n−k)! (fix those k positions, permute the rest), and there are C(n, k) such intersections. Apply inclusion-exclusion and simplify to get the alternating sum above.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SECRET SANTA</div><div class="example-body">5 friends draw names from a hat. How many ways can the draw result in nobody picking themselves?<br><br>D_5 = 5! (1 − 1 + 1/2 − 1/6 + 1/24 − 1/120) = 120 · 44/120 = <strong>44</strong>. Out of 5! = 120 total assignments, 44 are valid Secret Santas. Probability of a valid draw on the first try ≈ 0.367 ≈ 1/e.</div></div>

<h3 style="margin-top:1.4rem;color:#3b82f6">Application 2: Surjective Functions</h3>

<p class="l-text">A function f: A → B with |A| = n and |B| = m is <em>surjective</em> (onto) if every element of B is hit by at least one element of A. Inclusion-exclusion gives a closed form:</p>

<div class="calc-formula"><div class="formula-label">NUMBER OF SURJECTIONS</div><div class="formula-main">$$S(n, m) \\;=\\; \\sum_{k=0}^{m} (-1)^k \\binom{m}{k} (m-k)^n$$</div><div class="formula-sub">Counts functions {1,...,n} → {1,...,m} that hit every target. Related to Stirling numbers of the second kind via S(n,m) = m! · S2(n,m).</div></div>

<h2 class="lesson-title">9. The Pigeonhole Principle</h2>

<div class="calc-highlight"><strong>If you put more than n pigeons into n holes, some hole has at least 2 pigeons.</strong> Trivial-sounding, yet one of the most powerful existence-proof tools in mathematics. The strength of pigeonhole comes from how easy it is to dress an ordinary problem up so the principle applies.</div>

<div class="calc-formula"><div class="formula-label">PIGEONHOLE PRINCIPLE (BASIC)</div><div class="formula-main">$$\\text{If } n+1 \\text{ pigeons are placed into } n \\text{ holes, some hole contains } \\ge 2 \\text{ pigeons.}$$</div><div class="formula-sub">Equivalently: any function f: {1,...,n+1} → {1,...,n} has at least two inputs mapping to the same output.</div></div>

<div class="calc-formula"><div class="formula-label">PIGEONHOLE PRINCIPLE (STRONG)</div><div class="formula-main">$$\\text{If } n \\cdot k + 1 \\text{ pigeons are placed into } n \\text{ holes, some hole contains } \\ge k+1 \\text{ pigeons.}$$</div><div class="formula-sub">Generalisation: more pigeons force a fuller hole.</div></div>

<div class="calc-graph"><div id="plot-l1-pigeon-en" class="plotly-graph" style="height:330px"></div><div class="graph-caption"><strong>What this plot shows:</strong> 9 pigeons stuffed into 4 holes. By the strong pigeonhole principle with n=4, k=2 (since 4·2+1 = 9), at least one hole MUST contain 3 or more pigeons. The actual distribution shown (3,2,2,2) is one of the tightest possible packings — but no distribution avoids the conclusion.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var holes=['Hole 1','Hole 2','Hole 3','Hole 4'];var counts=[3,2,2,2];
var data=[{x:holes,y:counts,type:'bar',marker:{color:['#ef4444','#3b82f6','#3b82f6','#3b82f6']},text:counts.map(String),textposition:'outside',name:'pigeons'}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{gridcolor:'rgba(255,255,255,0.05)'},yaxis:{title:'# of pigeons',range:[0,4],dtick:1,gridcolor:'rgba(255,255,255,0.07)'},margin:{t:40,r:30,b:50,l:60},shapes:[{type:'line',x0:-0.5,x1:3.5,y0:2.25,y1:2.25,line:{color:'#f59e0b',dash:'dash',width:2}}],annotations:[{x:3.5,y:2.45,xanchor:'right',text:'avg = 9/4 = 2.25 → ceil = 3',font:{color:'#f59e0b'},showarrow:false}]};
Plotly.newPlot('plot-l1-pigeon-en',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — BIRTH MONTHS</div><div class="example-body">Among any 13 people, at least two share a birth month.<br><br>13 pigeons, 12 holes (months). By the basic principle, some month has ≥ 2 people. The principle does not tell us WHICH month, just that one exists.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SOCKS</div><div class="example-body">A drawer contains red socks and blue socks. How many do you need to draw, in the dark, to be sure of a matching pair?<br><br><strong>3.</strong> Two colours = 2 holes. The third sock must match one of the first two. (Drawing only 2 gives the worst case of one red + one blue.)</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — RAMSEY R(3, 3) = 6</div><div class="example-body">Among any 6 people at a party, either 3 of them all know each other or 3 of them are mutual strangers. (Famous proof:) pick any person, call her Alice. She has 5 other relationships — friend or stranger — so by pigeonhole at least 3 of those are the same type. Say Alice has 3 friends, Bob, Carol, Dave. If any two of them are friends, those two + Alice form a friendly triangle. Otherwise Bob, Carol, Dave are mutual strangers. Either way, we have our triangle. <br><br>This is the smallest case of Ramsey theory: chaos is impossible, structure is forced.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — BIRTHDAY PARADOX</div><div class="example-body">By pigeonhole, 366 people guarantee a shared birthday. But the surprising fact is how few you need for the PROBABILITY to exceed 50%: just <strong>23</strong> people. With 50 people the probability is 97%, with 70 it is 99.9%. The growth comes from the C(n, 2) = n(n−1)/2 pairs of people, not from n.</div></div>

<div class="calc-graph"><div id="plot-l1-birthday-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the probability of at least one shared birthday in a room of n people, computed as 1 − (365·364···(365−n+1)) / 365<sup>n</sup>. The dashed line at 0.5 crosses the curve at n = 23 — the famous threshold. By n = 70 the probability is essentially 1. The C(n, 2) ≈ n²/2 number of pairs grows quadratically, which is why coincidences become near-certain so quickly.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];var prod=1;
for(var n=1;n<=80;n++){prod*=(365-n+1)/365;xs.push(n);ys.push(1-prod);}
var d1={x:xs,y:ys,mode:'lines+markers',name:'P(shared birthday)',line:{color:'#3b82f6',width:2.6},marker:{size:4}};
var d2={x:[23,23],y:[0,1],mode:'lines',name:'n = 23 (P > 0.5)',line:{color:'#f59e0b',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'number of people n',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'P(at least one shared birthday)',range:[0,1.02],gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},shapes:[{type:'line',x0:0,x1:80,y0:0.5,y1:0.5,line:{color:'rgba(255,255,255,0.25)',dash:'dot',width:1}}]};
Plotly.newPlot('plot-l1-birthday-en',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l1-stirling-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> Stirling's approximation log(n!) ≈ n·log(n) − n becomes spectacularly accurate as n grows. The blue curve is the exact log(n!), the orange dashed curve is the simple n·log(n) − n bound, and the green curve adds the refinement 0.5·log(2π·n). The refined version is within 1% of the truth even for n = 5. This approximation is the secret weapon behind every large-n combinatorial calculation in statistical mechanics and machine learning.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],exact=[],simple=[],refined=[];var lf=0;
for(var n=1;n<=60;n++){lf+=Math.log(n);xs.push(n);exact.push(lf);simple.push(n*Math.log(n)-n);refined.push(n*Math.log(n)-n+0.5*Math.log(2*Math.PI*n));}
var d1={x:xs,y:exact,mode:'lines+markers',name:'log(n!) exact',line:{color:'#3b82f6',width:2.6},marker:{size:4}};
var d2={x:xs,y:simple,mode:'lines',name:'n·log n − n (simple)',line:{color:'#f59e0b',width:2,dash:'dot'}};
var d3={x:xs,y:refined,mode:'lines',name:'+ ½·log(2πn) (refined)',line:{color:'#10b981',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'log(n!)',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-stirling-en',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Generating Functions (Brief Preview)</h2>

<div class="calc-highlight"><strong>A generating function packages an entire infinite sequence of counts as the coefficients of a single power series.</strong> It turns counting problems into algebra problems — and then back again. This is the single most powerful idea in advanced combinatorics. We will spend all of lesson L2 on it; this is a one-paragraph teaser.</div>

<p class="l-text">The simplest example: (1 + x)<sup>n</sup> = Σ C(n, k) x<sup>k</sup> is the generating function for the row of Pascal's triangle. The polynomial (1 + x + x² + x³ + ...) = 1/(1 − x) is the generating function for the constant sequence (1, 1, 1, ...). Multiplying generating functions corresponds to convolving sequences, which is precisely the kind of operation that appears when you combine independent counting problems. We will see how to use generating functions to solve recurrences, partition problems, and even derive the Catalan numbers — all of which are recurring themes when analysing AI algorithms like beam search.</p>

<h2 class="lesson-title">11. (Brief) Connection to Machine Learning</h2>

<p class="l-text">Combinatorics is classical mathematics — the bulk of this lesson lives in card games, lotteries, and Secret Santa rather than ML. But a few specific connections are worth flagging. The <strong>softmax</strong> denominator Σ exp(z_i) is structurally a multinomial-style normalising sum, and softmax over n classes is a smooth surrogate for the C(n, 1) hardmax choice. <strong>Beam search</strong> in language models is literally a constrained tree exploration whose path count is governed by combinatorial multipliers (beam width × vocabulary size, with combinatorial pruning of duplicate prefixes). <strong>Attention masks</strong> in Transformers — particularly causal masks — exhibit a Pascal-triangle structure: the number of context tokens that contribute to position t is a triangular partial sum directly readable off the row C(t, k). And the <strong>birthday paradox</strong> appears in hashing-based ML pipelines (locality-sensitive hashing, feature hashing) as the rule of thumb for when collisions become unavoidable.</p>

<h2 class="lesson-title">12. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What to play with:</strong> Change the multiset in <code>multinomial(...)</code> to count anagrams of "ALGORITHM" (all distinct → 9!) or "STATISTICS" (S:3, T:3, A:1, I:2, C:1 → 50 400). Set <code>N = 20</code> to grow Pascal's triangle and watch the central column dominate. Run the birthday simulation with <code>trials = 10000</code> and you will see the Monte Carlo markers lock onto the exact curve within ~1%.</p>

<h2 class="lesson-title">13. Summary &amp; What You Can Now Do</h2>

<p class="l-text">Every technique on this page returns over and over again — in probability, in algorithm analysis, in graph theory, and (occasionally) in ML. Keep this one-page mental model close at hand.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sum / Product rules</div><div class="card-body">Disjoint cases → add. Sequential independent choices → multiply. These two cover 80% of all elementary counting.</div><div class="card-formula">|A∪B| = |A|+|B|, ∏ n_i</div></div>
<div class="calc-card"><div class="card-title">Permutations</div><div class="card-body">Order matters. P(n, k) = n!/(n−k)!. Special case: P(n, n) = n!.</div><div class="card-formula">P(n,k) = n!/(n−k)!</div></div>
<div class="calc-card"><div class="card-title">Combinations</div><div class="card-body">Order does not. C(n, k) = n!/(k!(n−k)!). Symmetric: C(n, k) = C(n, n−k).</div><div class="card-formula">C(n,k) = n!/(k!(n−k)!)</div></div>
<div class="calc-card"><div class="card-title">With repetition</div><div class="card-body">Sequences: n^k. Multiset permutation: n!/(k_1!...k_m!). Multiset selection: C(n+k−1, k) by stars-and-bars.</div><div class="card-formula">n!/(k_1!·k_2!...)</div></div>
<div class="calc-card"><div class="card-title">Binomial theorem</div><div class="card-body">(x+y)^n = Σ C(n,k) x^(n−k) y^k. Row sums to 2^n. Pascal's rule: C(n,k) = C(n−1,k−1) + C(n−1,k).</div><div class="card-formula">(x+y)^n = Σ C(n,k)x^(n−k)y^k</div></div>
<div class="calc-card"><div class="card-title">Inclusion-Exclusion</div><div class="card-body">|A∪B| = |A|+|B|−|A∩B|. Generalises with alternating sign. Powers derangements and surjection counts.</div><div class="card-formula">Σ (−1)^(k+1) Σ |∩A_i|</div></div>
<div class="calc-card"><div class="card-title">Pigeonhole</div><div class="card-body">n+1 pigeons in n holes ⇒ some hole has ≥ 2. Stronger: nk+1 ⇒ ≥ k+1. The simplest existence-proof tool in mathematics.</div><div class="card-formula">|A| &gt; |B| ⇒ f not injective</div></div>
<div class="calc-card"><div class="card-title">Stirling</div><div class="card-body">log(n!) ≈ n·log(n) − n, refined to n·log(n) − n + ½·log(2πn). Indispensable when n is large.</div><div class="card-formula">n! ~ √(2πn) (n/e)^n</div></div>
</div>

<div class="l-warn"><strong>Coming next (Lesson 2):</strong> generating functions. We will encode counting problems as power-series identities and unlock partition theory, the Catalan numbers, and recurrence solving. The factorial expressions you mastered here will reappear as polynomial coefficients.</p>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/65" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Toplam Formülleri (Σ)</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L65)</span></li>
<li><a href="/tutorials/matematik/98" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Permütasyon</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L98)</span></li>
<li><a href="/tutorials/matematik/99" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Kombinasyon</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L99)</span></li>
</ul>
</div>
<p class="l-text"><strong>Saymak matematikteki en kolay şey gibi durur — gerçekten yapmaya kalkana kadar.</strong> "8 karakterli kaç parola var?" "Üçlüden iyi kaç poker eli var?" "On iki donutu dört öğrenciye kaç şekilde paylaştırabilirim?" Bu sorulara verilecek dürüst yanıt milyonlar, milyarlar, trilyonlardır; tek tek listelemek imkânsız. Kombinatorik, hiçbir şey listelemeden doğru sayıyı elde etme disiplinidir. <em>Saymadan</em> sayma sanatıdır.</p>

<p class="l-text">Bu dersin sonunda "MISSISSIPPI'nin kaç farklı anagramı vardır?" gibi bir soruya tek satırda yanıt veriyor olacaksın: <em>11! / (4! · 4! · 2! · 1!) = 34 650</em>. Listeleme yok, kaba kuvvet yok — sadece problemin yapısını yakalayan temiz bir faktöriyel ifadesi. Önce yapıyı okuyup sonra hesaplama alışkanlığı, bu dersin tüm meselesidir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Toplama ve çarpma kurallarını temiz uygulamayı ve bir sayma probleminde hangisini kullanacağını anında görmeyi</li>
<li>Permütasyon (sıra önemli) ile kombinasyonu (sıra önemsiz) ayırt edip her seferinde doğru formülü seçmeyi</li>
<li>Tekrarla saymayı: MISSISSIPPI gibi multinom permütasyonları ve şekerleri çocuklara dağıtmak için yıldız-çubuk yöntemini</li>
<li>Binom teoremiyle <em>(x+y)<sup>n</sup></em>'yi açmayı; <em>Σ C(n,k) = 2<sup>n</sup></em> gibi özdeşlikleri Pascal üçgeninden doğrudan okumayı</li>
<li>Üst üste binen kümelerin birleşimini saymak için içerme-dışlama ilkesini ve bunu derangement ile örten fonksiyon sayımına uygulamayı</li>
<li>Güvercin yuvası ilkesini kullanarak bir-iki satırda varlık ispatı yapmayı — doğum ayları, Ramsey R(3,3) ve fazlası</li>
</ul>
</div>

<h2 class="lesson-title">1. Saymanın İki Temel Kuralı</h2>

<div class="calc-highlight"><strong>Neredeyse her sayma problemi iki kurala indirgenir.</strong> Toplama kuralı: ayrık (örtüşmeyen) durumlar arasında seçim yapıyorsan, <em>topla</em>. Çarpma kuralı: bağımsız bir seçimler dizisi yapıyorsan, <em>çarp</em>. Hangisinin geçerli olduğunu görmek alışkanlık olduğunda, kombinatorik argümanın yarısı kurulmuş demektir.</div>

<div class="calc-formula"><div class="formula-label">TOPLAMA KURALI</div><div class="formula-main">$$|A \\cup B| = |A| + |B| \\quad \\text{when } A \\cap B = \\emptyset$$</div><div class="formula-sub">İki seçenek kümesi örtüşmüyorsa ayrı ayrı say ve topla. Herhangi sayıda ayrık kümeye genellenir.</div></div>

<div class="calc-formula"><div class="formula-label">ÇARPMA KURALI</div><div class="formula-main">$$|A_1 \\times A_2 \\times \\cdots \\times A_k| \\;=\\; n_1 \\cdot n_2 \\cdots n_k$$</div><div class="formula-sub">Bir işlem k bağımsız adımdan oluşuyorsa ve i. adımda n_i seçenek varsa, toplam sonuç sayısı n_i'lerin çarpımıdır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ÖĞLE YEMEĞİ</div><div class="example-body">Bir yemekhanede 4 ana yemek, 3 yan ürün ve 5 içecek var. Birer tane seçilen kaç farklı tepsi var?<br><br><strong>Çarpma kuralı:</strong> 4 · 3 · 5 = <strong>60</strong> farklı tepsi. Seçimler bağımsız, bu yüzden çarpıyoruz.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — PLAKALAR</div><div class="example-body">Bir Türk plakası <em>34 ABC 123</em> biçimindedir: iki rakamlı il kodu (örnekte 34), üç harf (A–Z, 26 seçenek) ve üç rakam (0–9, 10 seçenek). İl kodu kısıtlamalarını yok sayarsak kaç plaka mümkün?<br><br><strong>Çarpma kuralı:</strong> 26³ · 10³ = 17 576 · 1000 = <strong>17 576 000</strong>. Bolca yer.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TOPLAMA KURALI</div><div class="example-body">Bir öğrenci İstanbul'dan Ankara'ya otobüsle (günlük 8 sefer), trenle (günlük 3 sefer) veya uçakla (günlük 12 sefer) gidiyor. Durumlar ayrık (tek yolculuk, tek araç). Bugün için kaç seyahat seçeneği var?<br><br><strong>Toplama kuralı:</strong> 8 + 3 + 12 = <strong>23</strong> seçenek.</div></div>

<div class="l-note"><strong>Zihinsel test:</strong> "Bir şeyi YA DA başka bir şeyi mi yapıyorum?" → toplama. "Önce bir şeyi VE SONRA başka bir şeyi mi yapıyorum?" → çarpma. Türkçedeki "veya / ve ardından" tetikleyicileri güvenilirdir.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Tekrara izin verilen 4 haneli kaç PIN kodu mümkün (0–9 rakamları)? Cevap: 10⁴ = 10 000. Hiçbir rakam tekrar edemiyorsa? Cevap: 10 · 9 · 8 · 7 = 5040 (permütasyondan küçük bir tat).</div></div>

<h2 class="lesson-title">2. Permütasyonlar</h2>

<div class="calc-highlight"><strong>Permütasyon, sıranın önemli olduğu bir dizilimdir.</strong> "ABC" ile "CBA" aynı üç harfin farklı permütasyonlarıdır. Soru "düzenleme", "sıralama", "sıraya dizme", "sıralamaya sokma" çağrışımı yapıyorsa — bir permütasyon formülü düşün.</div>

<div class="calc-formula"><div class="formula-label">n'DEN k'NIN PERMÜTASYONU (TEKRARSIZ)</div><div class="formula-main">$$P(n, k) \\;=\\; \\frac{n!}{(n-k)!} \\;=\\; n \\cdot (n-1) \\cdots (n-k+1)$$</div><div class="formula-sub">n farklı eşyadan k tanesini sıralı seç; her eşya en fazla bir kez kullanılır.</div></div>

<p class="l-text"><strong>Bu formül nereden geliyor?</strong> Saf çarpma kuralı. 1. pozisyon: <em>n</em> seçenek. 2. pozisyon: <em>n − 1</em> seçenek (biri kullanıldı). 3. pozisyon: <em>n − 2</em>. k pozisyon boyunca böyle devam et: n · (n−1) · (n−2) · · · (n−k+1) çarpımının tam olarak k çarpanı vardır, bu da n! / (n−k)! ile aynıdır.</p>

<div class="calc-formula"><div class="formula-label">ÖZEL DURUM: n EŞYANIN HEPSİNİ DİZME</div><div class="formula-main">$$P(n, n) \\;=\\; n!$$</div><div class="formula-sub">n eşyanın HEPSİNİ diziyorsan, n! dizilimin her biri ayrı bir permütasyondur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — RAFTAKİ KİTAPLAR</div><div class="example-body">5 farklı kitabı bir rafa kaç şekilde dizebiliriz?<br><br><strong>P(5, 5) = 5! = 120</strong> dizilim. 1. yer için 5 aday, 2. yer için 4, …, 5. yer için 1 — çarpım 5 · 4 · 3 · 2 · 1.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — 3 HARFLİ KELİMELER</div><div class="example-body">İngiliz alfabesindeki 26 harften, hiçbir harf tekrar etmeden kaç 3 harfli "kelime" (anlamlı olsun olmasın) oluşturulabilir?<br><br><strong>P(26, 3) = 26 · 25 · 24 = 15 600.</strong></div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — YARIŞ POZUMU</div><div class="example-body">On koşucu altın, gümüş ve bronz için yarışıyor. Kaç olası podyum sonucu var?<br><br><strong>P(10, 3) = 10 · 9 · 8 = 720.</strong> Sıra burada önemli — altın ≠ gümüş.</div></div>

<div class="l-note"><strong>Faktöriyel neden bu kadar hızlı büyüyor:</strong> 10! ≈ 3.6 · 10⁶, 20! ≈ 2.4 · 10¹⁸, 100! ≈ 9.3 · 10¹⁵⁷. n = 70'te zaten gözlemlenebilir evrendeki atom sayısını aşarsın. Bu patlayıcı büyüme, kaba-kuvvet enümerasyonunun neden saniyeler içinde çöktüğünü ve kapalı-form bir sayımın neden bu kadar değerli olduğunu açıklar.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">6 kişi <em>yuvarlak</em> bir masaya kaç şekilde oturabilir? (İpucu: yuvarlak masada sadece göreli pozisyonlar önemli.) Cevap: (6−1)! = 120. Bir kişiyi sabitle, diğer beşi permüte et.</div></div>

<h2 class="lesson-title">3. Kombinasyonlar</h2>

<div class="calc-highlight"><strong>Kombinasyon, sıranın önemli OLMADIĞI bir seçimdir.</strong> {Ali, Banu, Cem} ile {Cem, Ali, Banu} aynı komitedir. Soruda "seç", "topla", "grup oluştur", "ekip kur" geçtiğinde — kombinasyonu düşün.</div>

<div class="calc-formula"><div class="formula-label">n'DEN k'NIN KOMBİNASYONU (TEKRARSIZ)</div><div class="formula-main">$$C(n, k) \\;=\\; \\binom{n}{k} \\;=\\; \\frac{n!}{k!\\,(n-k)!}$$</div><div class="formula-sub">n farklı eşyadan k tanesini sırasız seç. "n'den k'lı" diye okunur.</div></div>

<p class="l-text"><strong>Bu formül nereden geliyor?</strong> P(n, k) = n!/(n−k)! permütasyondan başla. k elemanlı her <em>küme</em> k! farklı sırada dizilebilir; yani permütasyonlar her kümeyi tam olarak k! kere fazla saymıştır. Bu çarpanı böl: C(n, k) = P(n, k) / k! = n! / (k! (n−k)!).</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — POKER ELİ</div><div class="example-body">52 kartlık desten kaç farklı 5 kartlık el dağılabilir? (Eldeki kartların sırası önemsiz.)<br><br><strong>C(52, 5) = 52! / (5! · 47!) = 2 598 960.</strong> Yaklaşık 2.6 milyon el — pokerdeki her olasılığın paydası budur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — KOMİTE</div><div class="example-body">10 kişilik bir sınıftan 3 kişilik komite seç. Kaç olası komite vardır?<br><br><strong>C(10, 3) = 10! / (3! · 7!) = (10·9·8)/(3·2·1) = 120.</strong> Podyum için P(10, 3) = 720 ile karşılaştır: kombinasyonlar 3! = 6 çarpanı kadar küçük, çünkü komite üyeleri sıralanmıyor.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Simetri özdeşliği</div><div class="card-body">C(n, k) = C(n, n−k). Dahil edilecek k'yı seçmek, dışarıda kalacak n−k'yı seçmekle aynıdır.</div><div class="card-formula">C(10,3) = C(10,7)</div></div>
<div class="calc-card"><div class="card-title">Sınır değerleri</div><div class="card-body">C(n, 0) = C(n, n) = 1. Hiçbir şey seçmenin tek yolu, hepsini seçmenin de tek yolu vardır.</div><div class="card-formula">C(n,0)=1</div></div>
<div class="calc-card"><div class="card-title">Komşu değerler</div><div class="card-body">C(n, 1) = n. Tek bir öğe seçmenin n yolu vardır.</div><div class="card-formula">C(n,1)=n</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI — PERMÜTASYON MU KOMBİNASYON MU?</div><div class="think-body"><strong>(a)</strong> 1–49 arasından 5 piyango numarası seçmek. Sıra? Hayır → kombinasyon, C(49, 5).<br><strong>(b)</strong> 4 haneli ATM PIN'i belirlemek. Sıra? Evet → permütasyon/çarpım, 10⁴ = 10 000.<br><strong>(c)</strong> Tatile götürmek için 12 okumamış kitaptan 3'ünü seçmek. Sıra? Hayır → C(12, 3) = 220.</div></div>

<h2 class="lesson-title">4. Tekrarlı Permütasyonlar</h2>

<div class="calc-highlight"><strong>İki tekrar senaryosu sürekli karşımıza çıkar.</strong> (a) n seçenek arasından k uzunlukta diziler ve her seçenek tekrar edebilir — yanıt <em>n<sup>k</sup></em>. (b) Çoklu kümenin permütasyonları (bazı harfler tekrar ediyor) — yanıt <em>multinom katsayısı</em> n! / (k_1! k_2! … k_m!).</div>

<div class="calc-formula"><div class="formula-label">TEKRARLI DİZİLER</div><div class="formula-main">$$n^k$$</div><div class="formula-sub">n sembolden k uzunlukta dizi sayısı; her sembol istendiği kadar kullanılır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — PAROLALAR</div><div class="example-body">26 harf (büyük/küçük duyarlı: 52 harf) ve 10 rakam — toplam 62 sembol — kullanarak tekrara izinli 8 karakter parola sayısı?<br><br><strong>62⁸ ≈ 2.18 · 10¹⁴ ≈ 218 trilyon.</strong> Saniyede 10⁹ hash deneyen modern bir GPU yine de ~60 saat çalışır. 8 karakterin neden parolalar için pratik minimum olduğu; 12 karakter için bu süre milyonlarca yıla çıkar.</div></div>

<div class="calc-formula"><div class="formula-label">MULTİNOM PERMÜTASYON</div><div class="formula-main">$$\\frac{n!}{k_1! \\, k_2! \\, \\cdots \\, k_m!} \\qquad \\text{with } k_1+k_2+\\cdots+k_m = n$$</div><div class="formula-sub">n nesnenin, türü i olan k_i tane ayırt edilemez kopyası varken farklı dizilim sayısı.</div></div>

<p class="l-text"><strong>k_i!'lara neden bölüyoruz?</strong> Eğer n harfin hepsi ayırt edilebilir olsaydı, n! dizilim olurdu. Ama 1. harften k_1 kopya ayırt edilemez, o yüzden her gerçek dizilim o kopyaların kendi aralarındaki permütasyonlar yüzünden tam olarak k_1! kere fazla sayılmış. Diğer tekrarlı harfler için de aynı. Fazlalığı böl.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — MISSISSIPPI</div><div class="example-body"><strong>MISSISSIPPI</strong> kelimesinin kaç farklı anagramı vardır?<br><br>Harfler: M (1), I (4), S (4), P (2). Toplam uzunluk n = 11. Sayım:<br><br>$$\\frac{11!}{1! \\cdot 4! \\cdot 4! \\cdot 2!} = \\frac{39\\,916\\,800}{1 \\cdot 24 \\cdot 24 \\cdot 2} = \\frac{39\\,916\\,800}{1152} = \\mathbf{34\\,650}.$$<br><br>Elle listelemeye kalk — ömrün yetmez. Yine de yanıt tek bir faktöriyel oranından düştü.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — BANANA</div><div class="example-body"><strong>BANANA:</strong> B (1), A (3), N (2). n = 6.<br><br>6! / (1! · 3! · 2!) = 720 / 12 = <strong>60</strong> anagram.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">"ANTHROPIC" için kaç farklı anagram? 9 harfin tümü ayrı → 9! = 362 880. "AARDVARK" için? A (3), R (2), D (1), V (1), K (1), n = 8 → 8! / (3! · 2!) = 40 320 / 12 = 3360.</div></div>

<h2 class="lesson-title">5. Tekrarlı Kombinasyonlar (Yıldız-Çubuk)</h2>

<div class="calc-highlight"><strong>n türden, her türden istenildiği kadar olmak üzere k öğe seçmek.</strong> Dağıtım problemleri için gizli silah: "10 şekeri 4 çocuğa kaç şekilde paylaştırırım?", "3 değişkenli 5. derecedeki kaç tek terimli var?", "8 çeşitten 6 toplu dondurma kabı kaç şekilde doldurulur?".</div>

<div class="calc-formula"><div class="formula-label">TEKRARLI KOMBİNASYONLAR</div><div class="formula-main">$$\\binom{n + k - 1}{k} \\;=\\; \\binom{n + k - 1}{n - 1}$$</div><div class="formula-sub">n türden k boyutlu çoklu küme sayısı; eşdeğer olarak x_1 + x_2 + ... + x_n = k denkleminin negatif olmayan tam sayı çözüm sayısı.</div></div>

<p class="l-text"><strong>Yıldız-çubuk ispatı.</strong> k tane özdeş yıldız ve n bin arasında ayraç olarak (n−1) çubuk düşün. Bu k + (n−1) = n + k − 1 sembolün bir sıradaki herhangi bir dizilimi bir dağıtım kodlar: i. çubuk ile (i+1). çubuk arasındaki yıldız sayısı, i. binin payıdır. Toplam dizilim sayısı C(n+k−1, k); çünkü n+k−1 pozisyondan hangi k tanesinin yıldız olduğunu seçiyoruz.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ŞEKERLER</div><div class="example-body">10 özdeş şekeri 4 ayırt edilebilir çocuğa kaç şekilde paylaştırırız (bir çocuk sıfır alabilir)?<br><br>n = 4 (tür/bin), k = 10 (öğe). Yanıt = C(10 + 4 − 1, 10) = <strong>C(13, 10) = C(13, 3) = 286</strong>.<br><br>Örnek bir dağıtım ⋅⋅⋅⋅|⋅⋅|⋅⋅⋅|⋅, (4, 2, 3, 1) anlamına gelir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DONDURMA</div><div class="example-body">Bir dondurmacıda 8 çeşit var. 6 top alıyorsun, sıra önemsiz, tekrar serbest. Kaç farklı kap?<br><br>C(8 + 6 − 1, 6) = C(13, 6) = <strong>1716</strong>. 8 çeşit ve 6 top ile zaten 1716 farklı kap.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TAM SAYI BİLEŞİMLERİ</div><div class="example-body">x_1 + x_2 + x_3 = 10 denkleminin kaç negatif olmayan tam sayı çözümü vardır?<br><br>n = 3 değişken, k = 10. Yanıt = C(12, 10) = C(12, 2) = <strong>66</strong>.<br><br>POZİTİF tam sayı istiyorsak (her x_i ≥ 1), y_i = x_i − 1 ≥ 0 değişimini yap; y_1 + y_2 + y_3 = 7 olur, yanıt C(9, 7) = C(9, 2) = 36.</div></div>

<div class="l-note"><strong>Akılda tutulacak desen:</strong> "n bine k şey, tekrar serbest, bin içinde sıra önemsiz" ⇒ C(n+k−1, k). Formülü unutursan tahtada "yıldız-çubuk" diye mırıldanmaya başlarsın; o da yeterli.</div>

<h2 class="lesson-title">6. Binom Teoremi ve Pascal Üçgeni</h2>

<div class="calc-highlight"><strong>Binom katsayısı C(n, k) iki işi birden yapar.</strong> Alt küme sayar — ve (x+y)<sup>n</sup>'nin açılımında x<sup>n−k</sup>y<sup>k</sup>'nin katsayısı olarak görünür. İki yorum tesadüf değildir; cebir ile sayma iki notasyonda aynı olgudur.</div>

<div class="calc-formula"><div class="formula-label">BİNOM TEOREMİ</div><div class="formula-main">$$(x + y)^n \\;=\\; \\sum_{k=0}^{n} \\binom{n}{k} \\, x^{n-k} \\, y^k$$</div><div class="formula-sub">(x+y)^n tamamen açıldığında, x^(n-k) y^k'nin katsayısı tam olarak n elemanlı kümenin k boyutlu alt kümelerinin sayısıdır.</div></div>

<p class="l-text"><strong>Kombinatorik ispat.</strong> (x+y)<sup>n</sup>'yi n çarpan ile (x+y)(x+y)···(x+y) olarak yaz. Bir terim oluşturmak için her çarpandan ya x ya y seç ve çarp. Ortaya çıkan tek terimlinin y derecesi, y'nin seçildiği çarpan sayısına eşittir. n çarpanın tam olarak k tanesinden y seçmenin yolu sayısı C(n, k)'dır ve her seçim aynı x<sup>n−k</sup>y<sup>k</sup> tek terimlisini üretir. k üzerinden topla.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — (x+y)^4 AÇILIMI</div><div class="example-body">$$(x+y)^4 = \\binom{4}{0}x^4 + \\binom{4}{1}x^3 y + \\binom{4}{2}x^2 y^2 + \\binom{4}{3}x y^3 + \\binom{4}{4}y^4$$<br><br>= 1·x⁴ + 4·x³y + 6·x²y² + 4·xy³ + 1·y⁴. (1, 4, 6, 4, 1) katsayı dizisi Pascal üçgeninin n = 4 satırıdır.</div></div>

<div class="calc-graph"><div id="plot-l1-pascal-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> 0'dan 15'e kadar satırlarda Pascal üçgeni, ısı haritası olarak. (n, k) hücresi C(n, k); değerler her satırın ortasına doğru patladığı için log-renk ölçeği kullanıldı. C(n, k) = C(n, n−k) simetrisi her satırın köşegeni boyunca yansıyor; n. satırın en büyük değeri her zaman k = ⌊n/2⌋'de oturuyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=15;var z=[];var txt=[];
function bin(n,k){if(k<0||k>n)return 0;var r=1;if(k>n-k)k=n-k;for(var i=0;i<k;i++){r=r*(n-i)/(i+1);}return Math.round(r);}
for(var n=0;n<=N;n++){var row=[];var tr=[];for(var k=0;k<=N;k++){if(k<=n){var v=bin(n,k);row.push(Math.log10(v+1));tr.push(String(v));}else{row.push(null);tr.push('');}}z.push(row);txt.push(tr);}
var ks=[];for(var i=0;i<=N;i++)ks.push(i);
var data=[{z:z,x:ks,y:ks,text:txt,texttemplate:'%{text}',type:'heatmap',colorscale:[[0,'#0a0a0a'],[0.2,'#1e3a8a'],[0.5,'#3b82f6'],[0.8,'#93c5fd'],[1,'#fef3c7']],showscale:false,hovertemplate:'n=%{y}, k=%{x}<br>C(n,k)=%{text}<extra></extra>'}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist',size:11},xaxis:{title:'k',dtick:1,gridcolor:'rgba(255,255,255,0.05)'},yaxis:{title:'n',dtick:1,autorange:'reversed',gridcolor:'rgba(255,255,255,0.05)'},margin:{t:30,r:30,b:55,l:55}};
Plotly.newPlot('plot-l1-pascal-tr',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h3 style="margin-top:1.6rem;color:#3b82f6">Sahip olman gereken üç özdeşlik</h3>

<div class="calc-formula"><div class="formula-label">PASCAL KURALI</div><div class="formula-main">$$\\binom{n}{k} \\;=\\; \\binom{n-1}{k-1} + \\binom{n-1}{k}$$</div><div class="formula-sub">Pascal üçgenini üreten özyineleme: her iç değer, doğrudan üstündeki iki değerin toplamıdır.</div></div>

<p class="l-text"><strong>Pascal kuralının kombinatorik ispatı.</strong> n elemanlı kümede belirli birini sabitle, Ayşe diyelim. k boyutlu bir alt küme ya Ayşe'yi <em>içerir</em> (kalan k−1 üyeyi diğer n−1 kişiden seç: C(n−1, k−1) yol) ya da onu <em>dışlar</em> (k üyenin tümünü diğer n−1 kişiden seç: C(n−1, k) yol). İki durum ayrık, topla. Bitti — cebire gerek yok.</p>

<div class="calc-formula"><div class="formula-label">BİR SATIRIN TOPLAMI</div><div class="formula-main">$$\\sum_{k=0}^{n} \\binom{n}{k} \\;=\\; 2^n$$</div><div class="formula-sub">n elemanlı kümenin boş küme ve kendisi dahil tüm alt küme sayısı. Binom teoreminde x = y = 1 koy ve doğrudan oku.</div></div>

<p class="l-text"><strong>Kombinatorik ispat.</strong> n elemanlı bir kümenin 2<sup>n</sup> alt kümesi vardır (her eleman ya içeride ya dışarıda — çarpma kuralı, her biri için 2 seçenek). Bunları boyuta göre ayır: k boyutlu C(n, k) alt küme var. k üzerinde toplama toplamı geri verir. Aynı iki sayı, sayımı düzenlemenin iki yolu.</p>

<div class="calc-formula"><div class="formula-label">AĞIRLIKLI SATIR TOPLAMI</div><div class="formula-main">$$\\sum_{k=0}^{n} k \\binom{n}{k} \\;=\\; n \\cdot 2^{n-1}$$</div><div class="formula-sub">n elemanlı kümeden (alt küme, içinden seçilen eleman) ikilisi sayısı.</div></div>

<p class="l-text"><strong>Kombinatorik ispat.</strong> S ⊆ {1,…,n} ve x ∈ S olacak şekilde (S, x) ikililerini iki yoldan say. Birinci yol: önce S'yi seç (k boyutlu olan k tane ikili katkı yapar), Σ k·C(n,k) elde edilir. İkinci yol: önce x'i seç (n yol), sonra x'in katılacağı kalan n−1 elemanın herhangi alt kümesi (2<sup>n−1</sup> seçenek). İki ifade aynı ikilileri sayar, dolayısıyla eşittirler.</p>

<div class="calc-graph"><div id="plot-l1-binompmf-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> n = 20 adil yazı-tura atışında binom dağılımı Pr[X=k] = C(20, k)·(1/2)^20. Çan şekli tesadüf değil — kesikli binom üzerinde işleyen merkezi limit teoremidir. Ortalama tam olarak k = 10'da, standart sapma √(n·p·(1−p)) = √5 ≈ 2.24. C(20, 10) = 184 756'nın en büyük tek katsayı olduğuna ve C(20, 0) = 1'in yanında nasıl ezildiğine dikkat et.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function bin(n,k){var r=1;if(k>n-k)k=n-k;for(var i=0;i<k;i++){r=r*(n-i)/(i+1);}return r;}
var n=20;var xs=[],ys=[],txt=[];var denom=Math.pow(2,n);
for(var k=0;k<=n;k++){xs.push(k);var p=bin(n,k)/denom;ys.push(p);txt.push('C(20,'+k+')='+Math.round(bin(n,k)));}
var data=[{x:xs,y:ys,type:'bar',marker:{color:'#3b82f6'},hovertext:txt,hovertemplate:'k=%{x}<br>P=%{y:.4f}<br>%{hovertext}<extra></extra>',name:'P(X=k)'}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'k',dtick:2,gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'Pr[X = k]',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-binompmf-tr',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l1-cvsp-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> sabit seçim boyutu k = 3 için, turuncu eğri P(n, 3) = n(n−1)(n−2) yaklaşık n³ gibi büyürken mavi C(n, 3) = P(n,3)/6 yaklaşık n³/6 gibi büyür. Her n'de tam olarak k! = 6 çarpanı kadar farklılar. Logaritmik ölçekte dikey ayrım sabit, çünkü oran sabit.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],c=[],p=[];
for(var n=3;n<=30;n++){xs.push(n);var perm=n*(n-1)*(n-2);p.push(perm);c.push(perm/6);}
var d1={x:xs,y:c,mode:'lines+markers',name:'C(n, 3)',line:{color:'#3b82f6',width:2.6},marker:{size:6}};
var d2={x:xs,y:p,mode:'lines+markers',name:'P(n, 3)',line:{color:'#f59e0b',width:2.6,dash:'dot'},marker:{size:6}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'sayı (log)',type:'log',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-cvsp-tr',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">(1 + x)<sup>5</sup>'i Pascal üçgeninin 5. satırını (1, 5, 10, 10, 5, 1) okuyarak aç. Cevap: 1 + 5x + 10x² + 10x³ + 5x⁴ + x⁵. Şimdi x = 1 koy: 32 = 2<sup>5</sup>'i geri alıp satır toplamı özdeşliğini doğrulamış olursun.</div></div>

<h2 class="lesson-title">7. Multinom Teoremi</h2>

<div class="calc-highlight"><strong>(x+y)<sup>n</sup>'yi (x_1 + x_2 + ... + x_m)<sup>n</sup>'ye genellemek.</strong> Aynı cebirsel özdeşlik, daha büyük alfabe. Katsayılar 4. bölümdeki MISSISSIPPI sayımında gördüğün multinom katsayılarıdır.</div>

<div class="calc-formula"><div class="formula-label">MULTİNOM TEOREMİ</div><div class="formula-main">$$(x_1 + x_2 + \\cdots + x_m)^n \\;=\\; \\sum_{k_1+k_2+\\cdots+k_m = n} \\binom{n}{k_1, k_2, \\ldots, k_m} \\, x_1^{k_1} x_2^{k_2} \\cdots x_m^{k_m}$$</div><div class="formula-sub">Toplam, n'e toplanan negatif olmayan tam sayı (k_1, ..., k_m) demetleri üzerinden alınır. Katsayı C(n; k_1, ..., k_m) = n! / (k_1! k_2! ... k_m!), çoklu kümenin dizilim sayısını verir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TRİNOM</div><div class="example-body">(x + y + z)<sup>6</sup> açılımında x² y³ z teriminin katsayısını bul.<br><br>k_1 = 2, k_2 = 3, k_3 = 1, toplam = 6. ✓<br><br>Katsayı = 6! / (2! · 3! · 1!) = 720 / (2 · 6 · 1) = <strong>60</strong>.<br><br>Yani terim 60 x² y³ z.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ZARLAR</div><div class="example-body">Beş tane 6 yüzlü zar at. Tam olarak iki 1, iki 2 ve bir 6 içeren kaç farklı sonuç vardır?<br><br>{1, 1, 2, 2, 6} çoklu kümesinin multinom permütasyonu: 5! / (2! · 2! · 1!) = <strong>30</strong> dizilim.</div></div>

<div class="l-note"><strong>(x_1+...+x_m)^n'nin farklı terim sayısı:</strong> k_1 + ... + k_m = n denkleminin negatif olmayan tam sayı çözüm sayısına eşit; yıldız-çubuk ile C(n + m − 1, n). (x+y+z)<sup>6</sup> için: C(8, 6) = 28 farklı tek terimli.</div>

<h2 class="lesson-title">8. İçerme-Dışlama (Dahil Etme-Hariç Tutma) İlkesi</h2>

<div class="calc-highlight"><strong>A ve B kesişiyorsa |A ∪ B|'yi nasıl sayarsın?</strong> Saf |A| + |B| kesişimi iki kez sayar, bir kez çıkar: |A ∪ B| = |A| + |B| − |A ∩ B|. Üç küme için biraz daha zarif; n küme için alternatif (işaret değiştiren) toplam olur.</div>

<div class="calc-formula"><div class="formula-label">İÇERME-DIŞLAMA (İKİ KÜME)</div><div class="formula-main">$$|A \\cup B| \\;=\\; |A| + |B| - |A \\cap B|$$</div><div class="formula-sub">Tek tekleri topla, örtüşeni çıkar. En basit önemsiz durum.</div></div>

<div class="calc-formula"><div class="formula-label">İÇERME-DIŞLAMA (ÜÇ KÜME)</div><div class="formula-main">$$|A \\cup B \\cup C| \\;=\\; |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|$$</div><div class="formula-sub">Üçlü kesişim sonda GERİ eklenir. İşaretler alternatif.</div></div>

<div class="calc-formula"><div class="formula-label">GENEL İÇERME-DIŞLAMA</div><div class="formula-main">$$\\left| \\bigcup_{i=1}^{n} A_i \\right| \\;=\\; \\sum_{k=1}^{n} (-1)^{k+1} \\sum_{|S|=k} \\left| \\bigcap_{i \\in S} A_i \\right|$$</div><div class="formula-sub">{1,...,n}'nin boş olmayan tüm alt kümeleri S üzerinden toplam, (-1)^(|S|+1) ile ağırlıklı.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ÖĞRENCİLER</div><div class="example-body">50 kişilik bir sınıfta 28 öğrenci Fransızca, 24 öğrenci Almanca, 10 öğrenci ise her ikisini de öğreniyor. En az bir dil öğrenen kaç öğrenci var?<br><br>|F ∪ A| = |F| + |A| − |F ∩ A| = 28 + 24 − 10 = <strong>42</strong>. Yani 50 − 42 = 8 öğrenci hiçbirini öğrenmiyor.</div></div>

<h3 style="margin-top:1.4rem;color:#3b82f6">Uygulama 1: Derangementler</h3>

<p class="l-text">Bir <em>derangement</em>, HİÇBİR sabit noktası olmayan permütasyondur — kimse orijinal koltuğunda kalmaz. n elemanın derangement sayısı, D_n ya da !n olarak yazılan bu sayı, içerme-dışlamanın en güzel sonuçlarından biridir.</p>

<div class="calc-formula"><div class="formula-label">DERANGEMENT FORMÜLÜ</div><div class="formula-main">$$D_n \\;=\\; n! \\sum_{k=0}^{n} \\frac{(-1)^k}{k!} \\;\\approx\\; \\frac{n!}{e}$$</div><div class="formula-sub">Çarpıcı biçimde, D_n / n! → 1/e ≈ 0.368, n büyüdükçe. Rastgele bir permütasyonun hiç sabit noktasının olmama olasılığı n'den bağımsız olarak ≈ %36.8.</div></div>

<p class="l-text"><strong>Türev özeti.</strong> A_i, i. elemanın SABİT olduğu permütasyon kümesi olsun. Hiçbirinde olmayanları, yani n! − |A_1 ∪ A_2 ∪ ... ∪ A_n|'yi istiyoruz. k-katlı kesişim |A_{i_1} ∩ ... ∩ A_{i_k}| = (n−k)! (o k pozisyonu sabitle, kalanları permüte et) ve böyle C(n, k) tane kesişim var. İçerme-dışlamayı uygulayıp sadeleştirerek yukarıdaki alternatif toplamı elde ederiz.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — SECRET SANTA</div><div class="example-body">5 arkadaş şapkadan isim çekiyor. Kimsenin kendi adını çekmediği kaç çekiliş sonucu vardır?<br><br>D_5 = 5! (1 − 1 + 1/2 − 1/6 + 1/24 − 1/120) = 120 · 44/120 = <strong>44</strong>. 5! = 120 toplam atamadan 44'ü geçerli Secret Santa. İlk denemede geçerli çekiliş olasılığı ≈ 0.367 ≈ 1/e.</div></div>

<h3 style="margin-top:1.4rem;color:#3b82f6">Uygulama 2: Örten Fonksiyonlar</h3>

<p class="l-text">|A| = n ve |B| = m için f: A → B fonksiyonu <em>örten</em> (üzerine) ise, B'nin her elemanı A'dan en az bir eleman tarafından vurulur. İçerme-dışlama kapalı bir form verir:</p>

<div class="calc-formula"><div class="formula-label">ÖRTEN FONKSİYON SAYISI</div><div class="formula-main">$$S(n, m) \\;=\\; \\sum_{k=0}^{m} (-1)^k \\binom{m}{k} (m-k)^n$$</div><div class="formula-sub">Her hedefi vuran {1,...,n} → {1,...,m} fonksiyonlarını sayar. İkinci tür Stirling sayılarıyla S(n,m) = m! · S2(n,m) bağıyla ilişkilidir.</div></div>

<h2 class="lesson-title">9. Güvercin Yuvası İlkesi</h2>

<div class="calc-highlight"><strong>n yuvaya n'den fazla güvercin koyarsan, bazı yuvada en az 2 güvercin olur.</strong> Önemsiz görünür, ama matematikteki en güçlü varlık-ispat araçlarından biridir. Güvercin yuvasının gücü, sıradan bir problemi ilke uygulanacak kılığa sokmanın ne kadar kolay olduğundan gelir.</div>

<div class="calc-formula"><div class="formula-label">GÜVERCİN YUVASI İLKESİ (TEMEL)</div><div class="formula-main">$$\\text{If } n+1 \\text{ pigeons are placed into } n \\text{ holes, some hole contains } \\ge 2 \\text{ pigeons.}$$</div><div class="formula-sub">Eşdeğer olarak: herhangi f: {1,...,n+1} → {1,...,n} fonksiyonunun aynı çıktıya giden en az iki girdisi vardır.</div></div>

<div class="calc-formula"><div class="formula-label">GÜVERCİN YUVASI İLKESİ (GÜÇLÜ)</div><div class="formula-main">$$\\text{If } n \\cdot k + 1 \\text{ pigeons are placed into } n \\text{ holes, some hole contains } \\ge k+1 \\text{ pigeons.}$$</div><div class="formula-sub">Genelleme: daha çok güvercin daha dolu bir yuvayı zorunlu kılar.</div></div>

<div class="calc-graph"><div id="plot-l1-pigeon-tr" class="plotly-graph" style="height:330px"></div><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> 4 yuvaya 9 güvercin tıkılmış. Güçlü güvercin yuvası ilkesiyle n=4, k=2 (çünkü 4·2+1 = 9), en az bir yuvada 3 veya daha fazla güvercin OLMAK ZORUNDA. Gösterilen dağılım (3,2,2,2) en sıkı olası paketlemelerden biri — ama hiçbir dağılım sonucu engelleyemez.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var holes=['Yuva 1','Yuva 2','Yuva 3','Yuva 4'];var counts=[3,2,2,2];
var data=[{x:holes,y:counts,type:'bar',marker:{color:['#ef4444','#3b82f6','#3b82f6','#3b82f6']},text:counts.map(String),textposition:'outside',name:'güvercinler'}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{gridcolor:'rgba(255,255,255,0.05)'},yaxis:{title:'güvercin sayısı',range:[0,4],dtick:1,gridcolor:'rgba(255,255,255,0.07)'},margin:{t:40,r:30,b:50,l:60},shapes:[{type:'line',x0:-0.5,x1:3.5,y0:2.25,y1:2.25,line:{color:'#f59e0b',dash:'dash',width:2}}],annotations:[{x:3.5,y:2.45,xanchor:'right',text:'ort = 9/4 = 2.25 → tavan = 3',font:{color:'#f59e0b'},showarrow:false}]};
Plotly.newPlot('plot-l1-pigeon-tr',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DOĞUM AYLARI</div><div class="example-body">Herhangi 13 kişi arasında, en az ikisi aynı doğum ayını paylaşır.<br><br>13 güvercin, 12 yuva (ay). Temel ilkeyle bazı ayda ≥ 2 kişi olur. İlke HANGİ ay olduğunu söylemez, sadece birinin var olduğunu söyler.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ÇORAPLAR</div><div class="example-body">Bir çekmecede kırmızı ve mavi çoraplar var. Karanlıkta eşleşen bir çift elde etmek için kaç tane çekmelisin?<br><br><strong>3.</strong> İki renk = 2 yuva. Üçüncü çorap ilk ikisinden birine eşleşmek zorunda. (Sadece 2 çekmek en kötü senaryoda bir kırmızı + bir mavi verir.)</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — RAMSEY R(3, 3) = 6</div><div class="example-body">Bir partide herhangi 6 kişiden ya 3'ü birbirini tanır ya da 3'ü birbirine yabancıdır. (Ünlü ispat:) herhangi birini seç, Ayşe diyelim. Diğer 5 kişiyle ilişkisi var — arkadaş ya da yabancı — yani güvercin yuvasıyla bunların en az 3'ü aynı türden. Diyelim Ayşe'nin 3 arkadaşı var: Bilal, Cem, Demir. Aralarında herhangi ikisi arkadaşsa, o ikisi + Ayşe arkadaş üçgeni oluşturur. Aksi halde Bilal, Cem, Demir birbirine yabancıdır. Her durumda üçgenimiz var. <br><br>Bu Ramsey teorisinin en küçük durumudur: kaos imkânsız, yapı zorunludur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DOĞUM GÜNÜ PARADOKSU</div><div class="example-body">Güvercin yuvasıyla, 366 kişi paylaşılan bir doğum gününü garantiler. Ama şaşırtıcı olan, OLASILIĞIN %50'yi aşması için ne kadar az kişi gerektiğidir: sadece <strong>23</strong> kişi. 50 kişiyle olasılık %97, 70 ile %99.9. Büyüme C(n, 2) = n(n−1)/2 kişi çiftinden gelir, n'den değil.</div></div>

<div class="calc-graph"><div id="plot-l1-birthday-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> n kişilik bir odada en az bir paylaşılan doğum günü olasılığı; 1 − (365·364···(365−n+1)) / 365<sup>n</sup> olarak hesaplandı. 0.5'teki kesikli çizgi eğriyi n = 23'te kesiyor — meşhur eşik. n = 70'te olasılık esasen 1. C(n, 2) ≈ n²/2 çift sayısı karesel büyüdüğü için tesadüfler bu kadar hızlı kesinleşiyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];var prod=1;
for(var n=1;n<=80;n++){prod*=(365-n+1)/365;xs.push(n);ys.push(1-prod);}
var d1={x:xs,y:ys,mode:'lines+markers',name:'P(paylaşılan doğum günü)',line:{color:'#3b82f6',width:2.6},marker:{size:4}};
var d2={x:[23,23],y:[0,1],mode:'lines',name:'n = 23 (P > 0.5)',line:{color:'#f59e0b',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'kişi sayısı n',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'P(en az bir paylaşılan doğum günü)',range:[0,1.02],gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},shapes:[{type:'line',x0:0,x1:80,y0:0.5,y1:0.5,line:{color:'rgba(255,255,255,0.25)',dash:'dot',width:1}}]};
Plotly.newPlot('plot-l1-birthday-tr',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l1-stirling-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Stirling yaklaşıklığı log(n!) ≈ n·log(n) − n, n büyüdükçe görkemli biçimde doğrulaşır. Mavi eğri tam log(n!), turuncu kesikli eğri basit n·log(n) − n sınırı, yeşil eğri ise 0.5·log(2π·n) iyileştirmesini ekler. İyileştirilmiş hali n = 5 için bile gerçeğin %1 yakınında. Bu yaklaşıklık istatistiksel mekanik ve makine öğrenmesindeki her büyük-n kombinatorik hesaplamasının arkasındaki gizli silahtır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],exact=[],simple=[],refined=[];var lf=0;
for(var n=1;n<=60;n++){lf+=Math.log(n);xs.push(n);exact.push(lf);simple.push(n*Math.log(n)-n);refined.push(n*Math.log(n)-n+0.5*Math.log(2*Math.PI*n));}
var d1={x:xs,y:exact,mode:'lines+markers',name:'log(n!) tam',line:{color:'#3b82f6',width:2.6},marker:{size:4}};
var d2={x:xs,y:simple,mode:'lines',name:'n·log n − n (basit)',line:{color:'#f59e0b',width:2,dash:'dot'}};
var d3={x:xs,y:refined,mode:'lines',name:'+ ½·log(2πn) (iyileştirilmiş)',line:{color:'#10b981',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'log(n!)',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-stirling-tr',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Üreteç Fonksiyonlar (Kısa Önizleme)</h2>

<div class="calc-highlight"><strong>Üreteç fonksiyon, sonsuz bir sayı dizisini tek bir güç serisinin katsayıları olarak paketler.</strong> Sayma problemlerini cebir problemlerine çevirir — ve sonra geri çevirir. İleri kombinatorikteki tek en güçlü fikirdir. L2'de tümünü buna ayıracağız; bu tek paragraflık bir tanıtım.</div>

<p class="l-text">En basit örnek: (1 + x)<sup>n</sup> = Σ C(n, k) x<sup>k</sup>, Pascal üçgeninin bir satırı için üreteç fonksiyondur. (1 + x + x² + x³ + ...) = 1/(1 − x) polinomu, (1, 1, 1, ...) sabit dizisinin üreteç fonksiyonudur. Üreteç fonksiyonların çarpımı dizilerin konvolüsyonuna karşılık gelir; bu da bağımsız sayma problemlerini birleştirirken karşımıza çıkan tam o işlemdir. Üreteç fonksiyonları kullanarak yinelemeleri çözeceğiz, bölünme problemlerini ele alacağız, hatta Catalan sayılarını türeteceğiz — bunların hepsi beam search gibi AI algoritmalarını analiz ederken tekrar eden temalardır.</p>

<h2 class="lesson-title">11. (Kısa) Makine Öğrenmesiyle Bağlantı</h2>

<p class="l-text">Kombinatorik klasik matematiktir — bu dersin büyük kısmı kart oyunları, piyangolar ve Secret Santa'da geçti, ML'de değil. Yine de işaretlemeye değer birkaç bağlantı var. <strong>Softmax</strong> paydası Σ exp(z_i) yapısal olarak multinom tarzı normalleştirici bir toplamdır; n sınıf üzerinden softmax, C(n, 1) hardmax seçimine pürüzsüz bir vekil. <strong>Beam search</strong> dil modellerinde, yol sayısı kombinatorik çarpanlarla yönetilen kısıtlı bir ağaç keşfidir (beam genişliği × kelime dağarcığı boyutu, yinelenen öneklerin kombinatorik budanmasıyla). Transformer'lardaki <strong>attention maskeleri</strong> — özellikle nedensel maskeler — Pascal-üçgen yapısı gösterir: t pozisyonuna katkı yapan bağlam token sayısı, doğrudan C(t, k) satırından okunabilen üçgen kısmi toplamıdır. Ve <strong>doğum günü paradoksu</strong>, hashleme tabanlı ML pipeline'larında (yerellik-duyarlı hashleme, özellik hashleme) çarpışmaların kaçınılmaz hale geldiği kural olarak ortaya çıkar.</p>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Oynanacak yerler:</strong> <code>multinomial(...)</code>'daki çoklu kümeyi değiştir; "ALGORITHM" (hepsi farklı → 9!) ya da "STATISTICS" (S:3, T:3, A:1, I:2, C:1 → 50 400) anagramlarını say. <code>N = 20</code> yap, Pascal üçgenini büyüt ve orta sütunun nasıl baskın olduğunu izle. Doğum günü simülasyonunu <code>trials = 10000</code> ile çalıştır; Monte Carlo işaretçilerinin tam eğriye ~%1 içinde oturduğunu göreceksin.</p>

<h2 class="lesson-title">13. Özet &amp; Artık Yapabileceklerin</h2>

<p class="l-text">Bu sayfadaki her teknik defalarca dönüp dolaşıp gelir — olasılıkta, algoritma analizinde, çizge teorisinde ve (zaman zaman) ML'de. Bu tek sayfalık zihinsel modeli yanında tut.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Toplama / Çarpma kuralı</div><div class="card-body">Ayrık durumlar → topla. Sıralı bağımsız seçimler → çarp. İkisi tüm temel saymanın %80'ini kapsar.</div><div class="card-formula">|A∪B| = |A|+|B|, ∏ n_i</div></div>
<div class="calc-card"><div class="card-title">Permütasyonlar</div><div class="card-body">Sıra önemli. P(n, k) = n!/(n−k)!. Özel durum: P(n, n) = n!.</div><div class="card-formula">P(n,k) = n!/(n−k)!</div></div>
<div class="calc-card"><div class="card-title">Kombinasyonlar</div><div class="card-body">Sıra önemsiz. C(n, k) = n!/(k!(n−k)!). Simetrik: C(n, k) = C(n, n−k).</div><div class="card-formula">C(n,k) = n!/(k!(n−k)!)</div></div>
<div class="calc-card"><div class="card-title">Tekrarlı</div><div class="card-body">Diziler: n^k. Çoklu küme permütasyonu: n!/(k_1!...k_m!). Çoklu küme seçimi: yıldız-çubuk ile C(n+k−1, k).</div><div class="card-formula">n!/(k_1!·k_2!...)</div></div>
<div class="calc-card"><div class="card-title">Binom teoremi</div><div class="card-body">(x+y)^n = Σ C(n,k) x^(n−k) y^k. Satır toplamı 2^n. Pascal kuralı: C(n,k) = C(n−1,k−1) + C(n−1,k).</div><div class="card-formula">(x+y)^n = Σ C(n,k)x^(n−k)y^k</div></div>
<div class="calc-card"><div class="card-title">İçerme-Dışlama</div><div class="card-body">|A∪B| = |A|+|B|−|A∩B|. Alternatif işaretle genelleşir. Derangement ve örten sayımının motoru.</div><div class="card-formula">Σ (−1)^(k+1) Σ |∩A_i|</div></div>
<div class="calc-card"><div class="card-title">Güvercin yuvası</div><div class="card-body">n yuvada n+1 güvercin ⇒ bazısında ≥ 2 var. Daha güçlü: nk+1 ⇒ ≥ k+1. Matematikteki en basit varlık-ispat aracı.</div><div class="card-formula">|A| &gt; |B| ⇒ f bire-bir değil</div></div>
<div class="calc-card"><div class="card-title">Stirling</div><div class="card-body">log(n!) ≈ n·log(n) − n, iyileştirilmiş hali n·log(n) − n + ½·log(2πn). n büyük olduğunda vazgeçilmez.</div><div class="card-formula">n! ~ √(2πn) (n/e)^n</div></div>
</div>

<div class="l-warn"><strong>Sıradaki (Ders 2):</strong> üreteç fonksiyonlar. Sayma problemlerini güç serisi özdeşlikleri olarak kodlayıp bölünme teorisini, Catalan sayılarını ve yineleme çözümünü açacağız. Burada öğrendiğin faktöriyel ifadeler polinom katsayıları olarak yeniden ortaya çıkacak.</p>`

};
