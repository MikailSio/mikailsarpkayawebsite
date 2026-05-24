window.LISE_MAT_L95 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The previous lesson taught you what a probability <em>is</em>; this one teaches you what happens when probabilities combine.</strong> Real-life questions almost never involve a single event in isolation. You toss two coins, not one. You draw two cards, not one. A factory produces three components, and you want to know the chance that all of them work. In each case you have to combine the probabilities of the individual events — and the rule for combining them depends on whether the events affect each other.</p>

<p class="l-text">If the outcome of the first event does not change the probability of the second, the events are called <em>independent</em>, and the combined probability is simply the product $P(A) \\cdot P(B)$. If the first event changes the situation — for example, by removing a card from the deck — the events are <em>dependent</em>, and we have to multiply by a conditional probability $P(B \\mid A)$. This lesson teaches you to recognise which case you are in, write the multiplication rule correctly, and use a tree diagram to organise the calculation. By the end you will be able to attack any two-stage probability problem on autopilot.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define <em>independent events</em> and state the product rule $P(A \\cap B) = P(A) \\cdot P(B)$</li>
<li>Define <em>dependent events</em> and state the general multiplication rule $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$</li>
<li>Distinguish "with replacement" (independent) from "without replacement" (dependent) on the same physical experiment</li>
<li>Extend the product rule to many independent events: $P(A_1 \\cap A_2 \\cap \\dots \\cap A_n) = P(A_1) P(A_2) \\cdots P(A_n)$</li>
<li>Use the complement rule with independence to handle "at least one" questions across many trials</li>
<li>Draw and read a tree diagram, attaching the right probabilities to every branch and multiplying along paths</li>
</ul>
</div>

<h2 class="lesson-title">1. From One Event to Two — the Multiplication Idea</h2>

<div class="calc-highlight"><strong>The addition rule, from lesson 94, answers "what is the probability of A <em>or</em> B?".</strong> The multiplication rule, the subject of this lesson, answers a different question: "what is the probability of A <em>and</em> B?" — both happening, possibly one after the other. The two rules are not interchangeable; using the wrong one is one of the most common mistakes in school-level probability.</div>

<p class="l-text">Here is the basic example. Toss a fair coin twice. What is the probability of getting heads on the first toss <em>and</em> heads on the second toss? Intuitively, half the time you get heads on the first toss; and out of those, half again get heads on the second. So the answer should be one half of one half, which is one quarter. Multiplying the two probabilities $1/2 \\cdot 1/2 = 1/4$ matches the intuition exactly. This is the multiplication rule in its simplest form.</p>

<div class="calc-formula"><div class="formula-label">MULTIPLICATION — INTUITIVE FORM</div><div class="formula-main">$$P(A \\cap B) \\;=\\; P(A) \\cdot P(\\text{B given that A happened})$$</div><div class="formula-sub">"And" translates to multiplication. The second factor is the probability of B in the world where A has already occurred — which may or may not be the same as the unconditional $P(B)$.</div></div>

<p class="l-text">The key question is: <em>does the occurrence of A change the probability of B?</em> If not, we are in the simple case of independence, and the formula collapses to $P(A) \\cdot P(B)$. If yes, we need the conditional probability $P(B \\mid A)$, and we are in the more general case of dependence. Both cases share the same skeleton; the only difference is whether the second factor moves.</p>

<h2 class="lesson-title">2. Independent Events — the Product Rule</h2>

<div class="calc-highlight"><strong>Two events A and B are <em>independent</em> if the occurrence of A does not change the probability of B.</strong> Knowing that A happened gives you no new information about B. In symbols: $P(B \\mid A) = P(B)$, and equivalently $P(A \\cap B) = P(A) \\cdot P(B)$.</div>

<div class="calc-formula"><div class="formula-label">INDEPENDENT EVENTS — PRODUCT RULE</div><div class="formula-main">$$\\boxed{\\;P(A \\cap B) \\;=\\; P(A) \\cdot P(B)\\;} \\qquad \\text{(A and B independent)}$$</div><div class="formula-sub">Multiply the two probabilities. No correction term, because the events do not affect each other.</div></div>

<p class="l-text"><strong>How to recognise independence.</strong> The physical setups that produce independent events all share a common feature: the second experiment does not "remember" what happened in the first. Two separate coin tosses are independent — the coin has no memory. A roll of a die followed by a draw from a separate, untouched bag of marbles is independent — the bag knows nothing about the die. Drawing a card, putting it back, shuffling, and drawing again ("with replacement") is independent — the deck is in the same state both times.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Two coin tosses</div><div class="card-body">$P(\\text{HH}) = \\dfrac{1}{2} \\cdot \\dfrac{1}{2} = \\dfrac{1}{4}$. The first toss leaves no trace on the second.</div></div>
<div class="calc-card"><div class="card-title">Roll a die, toss a coin</div><div class="card-body">$P(6 \\text{ and heads}) = \\dfrac{1}{6} \\cdot \\dfrac{1}{2} = \\dfrac{1}{12}$. Two different physical devices, totally separate.</div></div>
<div class="calc-card"><div class="card-title">Draw with replacement</div><div class="card-body">Draw a card, look at it, put it back, shuffle, draw again. The second draw faces the full 52-card deck just like the first.</div></div>
<div class="calc-card"><div class="card-title">Two students from different classes</div><div class="card-body">Choosing one student at random from class A and one from class B independently — the choices do not influence each other.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 — TWO COINS</div><div class="example-body">Toss two fair coins. What is the probability of getting heads on both?<br><br>Let $A$ = "first toss is heads", $B$ = "second toss is heads".<br>$P(A) = 1/2$, $P(B) = 1/2$, and the tosses are independent.<br>$$P(A \\cap B) = \\dfrac{1}{2} \\cdot \\dfrac{1}{2} = \\dfrac{1}{4}.$$<br>Cross-check by listing the sample space $\\{HH, HT, TH, TT\\}$: one outcome out of four is HH, so $1/4$. Same answer.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — DIE AND COIN</div><div class="example-body">Roll a fair die and toss a fair coin. What is the probability of rolling a 6 and getting heads?<br><br>$P(6) = 1/6$ and $P(H) = 1/2$, independent because the die and the coin do not interact.<br>$$P(6 \\cap H) = \\dfrac{1}{6} \\cdot \\dfrac{1}{2} = \\dfrac{1}{12}.$$<br>Sample-space check: $|S| = 6 \\cdot 2 = 12$, and only one pair $(6, H)$ is favourable. Matches.</div></div>

<div class="l-note"><strong>The "independence test".</strong> Sometimes the problem does not tell you whether two events are independent — you have to check. The test is: does $P(A \\cap B) = P(A) \\cdot P(B)$? If yes, the events are independent. If $P(A \\cap B)$ differs from the product, they are not. We will see an example of this check in section 7.</div>

<h2 class="lesson-title">3. Dependent Events — the General Multiplication Rule</h2>

<div class="calc-highlight"><strong>Two events are <em>dependent</em> if the occurrence of A changes the probability of B.</strong> The first event leaves a mark on the situation — it removes an object, exhausts a resource, or otherwise alters the second experiment. We capture the change with a <em>conditional probability</em>, written $P(B \\mid A)$, read "the probability of B given A".</div>

<div class="calc-formula"><div class="formula-label">DEPENDENT EVENTS — GENERAL MULTIPLICATION RULE</div><div class="formula-main">$$\\boxed{\\;P(A \\cap B) \\;=\\; P(A) \\cdot P(B \\mid A)\\;}$$</div><div class="formula-sub">Multiply the probability of A by the probability of B in the new world where A has already happened. Lesson 96 will treat conditional probability in full; here we only need the multiplication form.</div></div>

<p class="l-text"><strong>The classic example: drawing without replacement.</strong> A deck of 52 cards. Draw one card, do not put it back, then draw a second card. The two draws are dependent because the first draw permanently changes the deck. If the first card was a king, only 3 kings remain among 51 cards for the second draw; the conditional probability of a second king is $3/51$, not $4/52$. The first event "uses up" some of the favourable outcomes for the second.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TWO KINGS WITHOUT REPLACEMENT</div><div class="example-body">Draw two cards from a 52-card deck, without putting the first back. What is the probability that both are kings?<br><br>Let $A$ = "first card is a king", $B$ = "second card is a king".<br>$P(A) = 4/52 = 1/13$.<br>Given that the first card was a king, only 3 kings remain among the 51 cards still in the deck, so $P(B \\mid A) = 3/51 = 1/17$.<br>$$P(A \\cap B) = \\dfrac{4}{52} \\cdot \\dfrac{3}{51} = \\dfrac{12}{2652} = \\dfrac{1}{221}.$$<br>About 0.45% — a little less than half a percent.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TWO KINGS WITH REPLACEMENT</div><div class="example-body">Same deck, but this time the first card is replaced and the deck is reshuffled before the second draw. Now the events are independent.<br><br>$P(\\text{both kings}) = \\dfrac{4}{52} \\cdot \\dfrac{4}{52} = \\dfrac{16}{2704} = \\dfrac{1}{169}.$<br>About 0.59% — a little higher than the without-replacement answer, because we did not "use up" a king on the first draw.</div></div>

<div class="l-note"><strong>The replacement keyword.</strong> Whenever a problem says "with replacement" the events are independent and you use $P(A) \\cdot P(B)$. "Without replacement" almost always signals dependence and the conditional form $P(A) \\cdot P(B \\mid A)$. Read this keyword carefully — it changes the whole calculation.</div>

<h2 class="lesson-title">4. Tree Diagrams for Two-Stage Experiments</h2>

<div class="calc-highlight"><strong>A tree diagram organises a two-stage experiment so that the multiplication rule becomes purely visual.</strong> Each level of the tree corresponds to one stage. Each branch carries a probability. To find the probability of a particular outcome (a path from root to leaf), you simply multiply the branch probabilities along the path.</div>

<p class="l-text">For independent events, the same probabilities appear on every level — the tree is "symmetric". For dependent events, the second-level branches have different probabilities depending on which first-level branch you came from. Drawing the tree forces you to write the right conditional probability on each branch, and once it is drawn the calculation is mechanical.</p>

<div class="calc-graph"><div id="plot-l95-tree-indep-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a two-stage tree for tossing two fair coins, an independent experiment. Each branch is labelled with its probability (1/2). Multiplying 1/2 by 1/2 along each path gives the four leaf probabilities, all equal to 1/4. Because the events are independent, the second-level branches do not depend on the first-level outcome.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var edges={x:[0,1,null,0,1,null,1,2,null,1,2,null,1,2,null,1,2,null],y:[0,1,null,0,-1,null,1,1.6,null,1,0.4,null,-1,-0.4,null,-1,-1.6,null],mode:'lines',name:'tree',line:{color:'rgba(255,255,255,0.45)',width:1.6}};
var nodes={x:[0,1,1,2,2,2,2],y:[0,1,-1,1.6,0.4,-0.4,-1.6],mode:'markers+text',name:'nodes',marker:{color:'#3b82f6',size:14},text:['start','H','T','HH','HT','TH','TT'],textposition:'top center',textfont:{color:'#e8e8e8',size:12},showlegend:false};
var probs={x:[0.5,0.5,1.5,1.5,1.5,1.5],y:[0.6,-0.6,1.4,0.8,-0.8,-1.4],mode:'text',name:'p',text:['1/2','1/2','1/2','1/2','1/2','1/2'],textfont:{color:'#f59e0b',size:11},showlegend:false};
var leaves={x:[2.85,2.85,2.85,2.85],y:[1.6,0.4,-0.4,-1.6],mode:'text',name:'P',text:['P=1/4','P=1/4','P=1/4','P=1/4'],textfont:{color:'#10b981',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.4,3.5],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-2.1,2.1],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l95-tree-indep-en',[edges,nodes,probs,leaves],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Contrast with a dependent experiment.</strong> Below we draw the tree for drawing two marbles without replacement from an urn with 3 red and 2 blue marbles. The first-level probabilities are 3/5 (red) and 2/5 (blue). But the second-level probabilities now depend on what happened first: after drawing a red, only 2 reds and 2 blues remain among 4 marbles; after drawing a blue, 3 reds and 1 blue remain among 4. The tree branches carry different numbers on the second level — that is the visual signature of dependence.</p>

<div class="calc-graph"><div id="plot-l95-tree-dep-en" class="plotly-graph" style="height:450px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a tree for drawing two marbles without replacement from an urn with 3 red and 2 blue. After the first draw the composition of the urn changes, so the second-level branch probabilities depend on the first-level outcome. Multiply along each path to get the joint probability of that two-marble sequence; the four leaf probabilities sum to 1.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var edges={x:[0,1,null,0,1,null,1,2,null,1,2,null,1,2,null,1,2,null],y:[0,1,null,0,-1,null,1,1.6,null,1,0.4,null,-1,-0.4,null,-1,-1.6,null],mode:'lines',name:'tree',line:{color:'rgba(255,255,255,0.45)',width:1.6}};
var nodes={x:[0,1,1,2,2,2,2],y:[0,1,-1,1.6,0.4,-0.4,-1.6],mode:'markers+text',name:'nodes',marker:{color:'#3b82f6',size:14},text:['start','R','B','RR','RB','BR','BB'],textposition:'top center',textfont:{color:'#e8e8e8',size:12},showlegend:false};
var probs={x:[0.5,0.5,1.5,1.5,1.5,1.5],y:[0.65,-0.65,1.4,0.8,-0.8,-1.4],mode:'text',name:'p',text:['3/5','2/5','2/4','2/4','3/4','1/4'],textfont:{color:'#f59e0b',size:12},showlegend:false};
var leaves={x:[2.95,2.95,2.95,2.95],y:[1.6,0.4,-0.4,-1.6],mode:'text',name:'P',text:['6/20','6/20','6/20','2/20'],textfont:{color:'#10b981',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.4,3.6],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-2.1,2.1],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l95-tree-dep-en',[edges,nodes,probs,leaves],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Check: do the leaf probabilities sum to 1?</strong> $6/20 + 6/20 + 6/20 + 2/20 = 20/20 = 1$. They must, because the four leaves enumerate the entire sample space. If your tree's leaves do not sum to 1, you have made an arithmetic mistake somewhere on the branches.</div>

<h2 class="lesson-title">5. Many Independent Events — the Generalised Product Rule</h2>

<div class="calc-highlight"><strong>If $n$ events $A_1, A_2, \\dots, A_n$ are mutually independent, the probability that they all happen is the product of their individual probabilities.</strong> This is the engine behind every "$n$ trials in a row" calculation: a string of coin tosses, a batch of factory components, a sequence of independent emails arriving with spam.</div>

<div class="calc-formula"><div class="formula-label">GENERALISED PRODUCT RULE</div><div class="formula-main">$$P(A_1 \\cap A_2 \\cap \\dots \\cap A_n) \\;=\\; P(A_1) \\cdot P(A_2) \\cdots P(A_n)$$</div><div class="formula-sub">Valid only when the events are mutually independent. For dependent events the rule extends with conditional factors: $P(A_1) P(A_2 \\mid A_1) P(A_3 \\mid A_1 \\cap A_2) \\cdots$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — FIVE COINS</div><div class="example-body">Toss five fair coins. What is the probability of getting heads on all five?<br><br>The five tosses are independent, each with $P(H) = 1/2$.<br>$$P(\\text{HHHHH}) = \\left(\\dfrac{1}{2}\\right)^5 = \\dfrac{1}{32}.$$<br>About 3.1%. Notice that as the number of coins grows, the probability of "all heads" shrinks geometrically.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — QUALITY CONTROL</div><div class="example-body">A device contains three components. Each component independently has a 5% chance of failing. What is the probability that all three work?<br><br>Each component works with probability $0.95$. By independence,<br>$$P(\\text{all three work}) = 0.95 \\cdot 0.95 \\cdot 0.95 = 0.95^3 \\approx 0.857.$$<br>So the device works about 85.7% of the time. Note that even though each individual component is very reliable (95%), stringing three of them together drops the overall reliability noticeably.</div></div>

<h2 class="lesson-title">6. The "At Least One" Pattern — Complement Meets Independence</h2>

<div class="calc-highlight"><strong>Combining the complement rule from lesson 94 with the product rule of this lesson gives the most useful single technique in high-school probability: the "at least one" trick.</strong> Many problems are awkward to attack directly but become trivial once you compute the probability that <em>none</em> of the events happen, and subtract.</div>

<div class="calc-formula"><div class="formula-label">"AT LEAST ONE" FORMULA</div><div class="formula-main">$$P(\\text{at least one } A_i) \\;=\\; 1 - P(\\text{no } A_i) \\;=\\; 1 - P(A_1') P(A_2') \\cdots P(A_n')$$</div><div class="formula-sub">Take the complement of every individual event, multiply (using independence), and subtract from 1. Works whenever the events are independent.</div></div>

<p class="l-text"><strong>Why this works.</strong> "At least one $A_i$ occurs" is the opposite of "no $A_i$ occurs", and these are complementary events that fill the sample space without overlap. The complement, "no $A_i$ occurs", means $A_1', A_2', \\dots, A_n'$ all happen, and if the $A_i$ are independent so are their complements, so we can use the product rule. Subtract that product from 1 and you have the answer.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — AT LEAST ONE HEAD IN 4 FLIPS</div><div class="example-body">Toss four fair coins. What is the probability of getting at least one head?<br><br>Direct counting would require summing over "exactly one head", "exactly two heads", ..., "exactly four heads" — laborious.<br><br>Complement: "no heads at all" means all four tosses are tails.<br>$P(\\text{no heads}) = (1/2)^4 = 1/16$.<br>$$P(\\text{at least one head}) = 1 - \\dfrac{1}{16} = \\dfrac{15}{16}.$$<br>About 93.75%. With four trials at 50%, it is almost certain you see at least one head.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — AT LEAST ONE SIX IN 4 DIE ROLLS</div><div class="example-body">Roll a fair die four times. What is the probability of getting at least one six?<br><br>Probability of no six on a single roll: $5/6$. Across four independent rolls: $(5/6)^4 = 625/1296 \\approx 0.482$.<br>$$P(\\text{at least one six}) = 1 - \\dfrac{625}{1296} = \\dfrac{671}{1296} \\approx 0.518.$$<br>About 51.8% — slightly better than even odds. This is the famous "Chevalier de Méré" problem from the 17th century, which sparked Pascal and Fermat's first letters on probability theory.</div></div>

<div class="calc-graph"><div id="plot-l95-atleast-en" class="plotly-graph" style="height:370px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the probability of "at least one head" in $n$ independent fair-coin tosses, plotted for $n = 1, 2, \\dots, 10$. The curve $1 - (1/2)^n$ rises sharply at first and approaches 1 as $n$ grows. Even by $n = 7$ the probability is already above 99% — the chance of "all tails" becomes negligible very quickly.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nArr=[];var pArr=[];var labArr=[];
for(var n=1;n<=10;n++){nArr.push(n);var p=1-Math.pow(0.5,n);pArr.push(p);labArr.push((p*100).toFixed(1)+'%');}
var bars={x:nArr,y:pArr,type:'bar',name:'P(at least one head)',marker:{color:'#3b82f6'},text:labArr,textposition:'outside',textfont:{color:'#e8e8e8',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Number of tosses n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'P(at least one head)',range:[0,1.15],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:55,l:60},showlegend:false};
Plotly.newPlot('plot-l95-atleast-en',[bars],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. The Independence Test in Action</h2>

<div class="calc-highlight"><strong>Sometimes a problem hands you the probabilities $P(A)$, $P(B)$, and $P(A \\cap B)$ and asks: are A and B independent?</strong> The test is simple. Compute the product $P(A) \\cdot P(B)$ and compare it to $P(A \\cap B)$. If they match, the events are independent. If they differ, they are not.</div>

<div class="calc-formula"><div class="formula-label">INDEPENDENCE TEST</div><div class="formula-main">$$A, B \\text{ independent} \\iff P(A \\cap B) = P(A) \\cdot P(B)$$</div><div class="formula-sub">Equivalently, $P(B \\mid A) = P(B)$: knowing A does not change the probability of B.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — INDEPENDENT?</div><div class="example-body">Roll a fair die. Let $A$ = "roll an even number" and $B$ = "roll a number greater than 3". Are A and B independent?<br><br>$A = \\{2,4,6\\}$, $P(A) = 3/6 = 1/2$.<br>$B = \\{4,5,6\\}$, $P(B) = 3/6 = 1/2$.<br>$A \\cap B = \\{4, 6\\}$, $P(A \\cap B) = 2/6 = 1/3$.<br>Product: $P(A) \\cdot P(B) = 1/2 \\cdot 1/2 = 1/4$.<br><br>$1/3 \\ne 1/4$, so A and B are <strong>not</strong> independent. Knowing the die came up even raises the probability that it is greater than 3 (from 1/2 to 2/3).</div></div>

<div class="l-note"><strong>Independence is not mutual exclusivity.</strong> Two events being independent does NOT mean they cannot both happen. In fact, if both have positive probability and they are mutually exclusive, they cannot be independent — because $P(A \\cap B) = 0$ while $P(A) \\cdot P(B) > 0$. The two concepts are genuinely different and the next section spells out why.</div>

<h2 class="lesson-title">8. Independent vs. Mutually Exclusive — Do Not Confuse Them</h2>

<div class="calc-highlight"><strong>"Independent" and "mutually exclusive" sound similar but mean opposite things.</strong> Mutually exclusive events <em>cannot</em> both happen ($A \\cap B = \\emptyset$). Independent events <em>can</em> both happen, and the probability of doing so is $P(A) \\cdot P(B)$. Confusing them is one of the top exam-question traps — the table below makes the distinction explicit.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">MUTUALLY EXCLUSIVE</div><div class="compare-item">$A \\cap B = \\emptyset$ — cannot both happen</div><div class="compare-item">$P(A \\cap B) = 0$</div><div class="compare-item">$P(A \\cup B) = P(A) + P(B)$</div><div class="compare-item">Example: rolling a 1 and rolling a 2 on a single die</div><div class="compare-item">About the <em>union</em> (or)</div></div><div class="compare-col"><div class="compare-title">INDEPENDENT</div><div class="compare-item">A and B can both happen; A does not affect B</div><div class="compare-item">$P(A \\cap B) = P(A) \\cdot P(B)$</div><div class="compare-item">Always different from 0 (if both probabilities are positive)</div><div class="compare-item">Example: heads on coin 1 and heads on coin 2</div><div class="compare-item">About the <em>intersection</em> (and)</div></div></div>

<p class="l-text"><strong>A sharper way to see the difference.</strong> Mutually exclusive events <em>cannot coexist in a single trial</em>: if A happens, B cannot. Independent events are quite different: A and B might or might not both happen, and the question is whether knowing one tells you anything about the other. In the mutually exclusive case, knowing A happened tells you a lot about B: it tells you B did not happen. So mutually exclusive events with positive probability are very far from independent — they are the most dependent two events can be.</p>

<h2 class="lesson-title">9. Common Mistakes</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Confusing "and" with "or"</div><div class="card-body">"And" multiplies (intersection); "or" adds with subtraction (union). Translate the English carefully. "Both" and "all" usually signal multiplication. "Either" and "at least one" can go either way — but the latter is almost always best done by complement plus multiplication.</div></div>
<div class="calc-card"><div class="card-title">Using $P(A) \\cdot P(B)$ when dependent</div><div class="card-body">For "without replacement" or any setup where the first event changes the second, you must use $P(A) \\cdot P(B \\mid A)$. The product of unconditional probabilities overcounts.</div></div>
<div class="calc-card"><div class="card-title">Confusing independent with mutually exclusive</div><div class="card-body">They are different and almost opposite. If A and B are mutually exclusive and both have positive probability, then they are necessarily dependent: knowing A happened tells you B did not.</div></div>
<div class="calc-card"><div class="card-title">Forgetting to update on the tree</div><div class="card-body">In a dependent tree the second-level branches must carry the updated probabilities. Writing 4/52 on both levels for "two kings without replacement" is the most common mistake of this kind.</div></div>
</div>

<h2 class="lesson-title">10. Worked Problems</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — TWO COINS, BOTH HEADS</div><div class="example-body"><strong>Toss two fair coins. What is the probability of getting heads on both?</strong><br><br>Independent: $P(\\text{HH}) = (1/2)(1/2) = 1/4$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — TWO CARDS WITHOUT REPLACEMENT</div><div class="example-body"><strong>Draw two cards from a 52-card deck without replacement. What is the probability that both are hearts?</strong><br><br>$P(\\text{first heart}) = 13/52 = 1/4$.<br>Given the first was a heart, 12 hearts remain among 51 cards: $P(\\text{second heart} \\mid \\text{first heart}) = 12/51$.<br>$$P(\\text{both hearts}) = \\dfrac{13}{52} \\cdot \\dfrac{12}{51} = \\dfrac{156}{2652} = \\dfrac{1}{17}.$$<br>About 5.88%.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — TWO CARDS WITH REPLACEMENT</div><div class="example-body"><strong>Same setup, but the first card is replaced and the deck reshuffled before the second draw. Probability that both are hearts?</strong><br><br>Independent: $P(\\text{both hearts}) = (13/52)(13/52) = 1/16 = 0.0625$. Slightly higher than the without-replacement case.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — AT LEAST ONE HEAD IN 4 FLIPS</div><div class="example-body"><strong>Toss four fair coins. What is the probability of getting at least one head?</strong><br><br>Complement: "no heads" means TTTT. $P(\\text{TTTT}) = (1/2)^4 = 1/16$.<br>$$P(\\text{at least one head}) = 1 - 1/16 = 15/16 \\approx 93.75\\%.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — QUALITY CONTROL</div><div class="example-body"><strong>A circuit has three independent components. Each fails with probability 5%. What is the probability that all three work?</strong><br><br>Each works with probability $0.95$.<br>$$P(\\text{all three work}) = 0.95^3 \\approx 0.857.$$<br>About 85.7%. Equivalently, the probability that at least one fails is $1 - 0.857 = 0.143$, or about 14.3%.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — TREE DIAGRAM, MARBLES WITHOUT REPLACEMENT</div><div class="example-body"><strong>An urn has 3 red and 2 blue marbles. Draw two without replacement. What is the probability of drawing one red and one blue (in either order)?</strong><br><br>Use the dependent tree.<br>$P(\\text{R then B}) = (3/5)(2/4) = 6/20$.<br>$P(\\text{B then R}) = (2/5)(3/4) = 6/20$.<br>These are disjoint events (different orderings), so we add:<br>$$P(\\text{one of each}) = 6/20 + 6/20 = 12/20 = 3/5.$$<br>That is 60%.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — INDEPENDENCE TEST</div><div class="example-body"><strong>On a fair die, let $A$ = "roll an even number" and $B$ = "roll greater than 4". Are A and B independent?</strong><br><br>$P(A) = 3/6 = 1/2$. $P(B) = 2/6 = 1/3$ (i.e. $\\{5, 6\\}$).<br>$A \\cap B = \\{6\\}$, so $P(A \\cap B) = 1/6$.<br>Product: $(1/2)(1/3) = 1/6$. <strong>Match.</strong><br><br>So A and B are independent. (Compare this with section 7's example where $B = \\{4,5,6\\}$ — there independence failed; here, with B trimmed to $\\{5, 6\\}$, it holds.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — BATCH OF EMAILS</div><div class="example-body"><strong>The probability that any given email is spam is 0.3, independently for each email. You receive 5 emails. What is the probability that at least one is spam?</strong><br><br>$P(\\text{not spam}) = 0.7$ for each. $P(\\text{none spam}) = 0.7^5 \\approx 0.168$.<br>$$P(\\text{at least one spam}) = 1 - 0.168 = 0.832.$$<br>About 83.2%. With five tries at 30% each, spam is overwhelmingly likely to appear.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The multiplication rule answers "and" questions: $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$.</li>
<li>If A and B are independent, the rule simplifies to $P(A \\cap B) = P(A) \\cdot P(B)$.</li>
<li>"With replacement" makes successive draws independent; "without replacement" makes them dependent.</li>
<li>Tree diagrams visualise two-stage experiments: multiply along the branches of each path.</li>
<li>For $n$ independent events, the joint probability is the product $P(A_1) P(A_2) \\cdots P(A_n)$.</li>
<li>"At least one" problems are usually easiest via the complement: $1 - P(\\text{none}) = 1 - \\prod P(A_i')$.</li>
<li>Independence test: A and B are independent iff $P(A \\cap B) = P(A) \\cdot P(B)$.</li>
<li>Independent and mutually exclusive are opposite ideas — never confuse them on an exam.</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bir önceki ders olasılığın <em>ne olduğunu</em> öğretti; bu ders olasılıkların birleştiğinde ne olduğunu öğretiyor.</strong> Gerçek hayattaki sorular neredeyse hiç tek bir olayı kapsamaz. İki para atarsın, bir tane değil. İki kart çekersin, bir tane değil. Bir fabrika üç bileşen üretir ve hepsinin çalışma olasılığını bilmek istersin. Her durumda tek tek olayların olasılıklarını birleştirmen gerekir — ve birleştirme kuralı olayların birbirini etkileyip etkilemediğine bağlıdır.</p>

<p class="l-text">Birinci olayın sonucu ikinci olayın olasılığını değiştirmiyorsa, olaylar <em>bağımsız</em> denir ve birleşik olasılık basitçe $P(A) \\cdot P(B)$ çarpımıdır. Birinci olay durumu değiştiriyorsa — örneğin desteden bir kart çıkarmışsa — olaylar <em>bağımlı</em>dır ve koşullu olasılık $P(B \\mid A)$ ile çarpmamız gerekir. Bu ders sana hangi durumda olduğunu tanımayı, çarpma kuralını doğru yazmayı ve hesabı düzenlemek için ağaç diyagramı kullanmayı öğretiyor. Dersin sonunda her iki aşamalı olasılık problemine otomatik pilotla saldırabileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><em>Bağımsız olayları</em> tanımlamayı ve çarpım kuralını $P(A \\cap B) = P(A) \\cdot P(B)$ ifade etmeyi</li>
<li><em>Bağımlı olayları</em> tanımlamayı ve genel çarpma kuralını $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$ ifade etmeyi</li>
<li>Aynı fiziksel deneyde "iadeli" (bağımsız) ile "iadesiz" (bağımlı) ayrımını yapmayı</li>
<li>Çarpım kuralını birçok bağımsız olaya genişletmeyi: $P(A_1 \\cap A_2 \\cap \\dots \\cap A_n) = P(A_1) P(A_2) \\cdots P(A_n)$</li>
<li>Birçok denemede "en az bir" sorularını çözmek için tümleyen kuralını bağımsızlıkla birleştirmeyi</li>
<li>Ağaç diyagramı çizmeyi ve okumayı, her dala doğru olasılığı yerleştirmeyi ve yollar boyunca çarpmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Tek Olaydan İki Olaya — Çarpma Fikri</h2>

<div class="calc-highlight"><strong>94. dersteki toplama kuralı "A <em>veya</em> B olma olasılığı nedir?" sorusunu yanıtlar.</strong> Bu dersin konusu olan çarpma kuralı farklı bir soruyu yanıtlar: "A <em>ve</em> B olma olasılığı nedir?" — ikisi de gerçekleşir, muhtemelen biri diğerinden sonra. İki kural değiştirilemez; yanlışını kullanmak okul düzeyinde olasılığın en yaygın hatalarından biridir.</div>

<p class="l-text">İşte temel örnek. Hilesiz bir parayı iki kez at. Birinci atışta yazı <em>ve</em> ikinci atışta yazı gelme olasılığı nedir? Sezgisel olarak, zamanın yarısında birinci atışta yazı gelir; ve bunlardan yarısında ikinci atışta da yazı gelir. Yani cevap yarının yarısı olmalı, yani dörtte bir. İki olasılığı çarpmak $1/2 \\cdot 1/2 = 1/4$ sezgiyle tam olarak uyuşur. Bu, çarpma kuralının en basit halidir.</p>

<div class="calc-formula"><div class="formula-label">ÇARPMA — SEZGİSEL HAL</div><div class="formula-main">$$P(A \\cap B) \\;=\\; P(A) \\cdot P(\\text{A gerçekleştiği bilindiğinde B})$$</div><div class="formula-sub">"Ve" çarpmaya çevrilir. İkinci çarpan, A'nın zaten gerçekleştiği dünyada B'nin olasılığıdır — bu, koşulsuz $P(B)$ ile aynı olabilir de olmayabilir de.</div></div>

<p class="l-text">Anahtar soru şudur: <em>A'nın gerçekleşmesi B'nin olasılığını değiştiriyor mu?</em> Değiştirmiyorsa, basit bağımsızlık durumundayız ve formül $P(A) \\cdot P(B)$ haline gelir. Değiştiriyorsa, koşullu olasılık $P(B \\mid A)$'ya ihtiyacımız vardır ve daha genel bağımlılık durumundayız. Her iki durum da aynı iskeleti paylaşır; tek fark ikinci çarpanın değişip değişmediğidir.</p>

<h2 class="lesson-title">2. Bağımsız Olaylar — Çarpım Kuralı</h2>

<div class="calc-highlight"><strong>A ve B olayları, A'nın gerçekleşmesi B'nin olasılığını değiştirmiyorsa <em>bağımsız</em>dır.</strong> A'nın gerçekleştiğini bilmek B hakkında yeni bilgi vermez. Sembolik olarak: $P(B \\mid A) = P(B)$, eşdeğer olarak $P(A \\cap B) = P(A) \\cdot P(B)$.</div>

<div class="calc-formula"><div class="formula-label">BAĞIMSIZ OLAYLAR — ÇARPIM KURALI</div><div class="formula-main">$$\\boxed{\\;P(A \\cap B) \\;=\\; P(A) \\cdot P(B)\\;} \\qquad \\text{(A ve B bağımsız)}$$</div><div class="formula-sub">İki olasılığı çarp. Düzeltme terimi yok, çünkü olaylar birbirini etkilemiyor.</div></div>

<p class="l-text"><strong>Bağımsızlığı nasıl tanırız.</strong> Bağımsız olaylar üreten fiziksel kurulumların hepsi ortak bir özelliği paylaşır: ikinci deney birincide ne olduğunu "hatırlamaz". İki ayrı para atışı bağımsızdır — paranın hafızası yoktur. Bir zar atışından sonra ayrı, dokunulmamış bir torbadan bilye çekmek bağımsızdır — torba zar hakkında hiçbir şey bilmez. Bir kart çekmek, geri koymak, karıştırmak ve tekrar çekmek ("iadeli") bağımsızdır — deste her iki seferinde de aynı durumdadır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İki para atışı</div><div class="card-body">$P(\\text{YY}) = \\dfrac{1}{2} \\cdot \\dfrac{1}{2} = \\dfrac{1}{4}$. Birinci atış ikincide iz bırakmaz.</div></div>
<div class="calc-card"><div class="card-title">Zar at, para at</div><div class="card-body">$P(6 \\text{ ve yazı}) = \\dfrac{1}{6} \\cdot \\dfrac{1}{2} = \\dfrac{1}{12}$. İki farklı fiziksel cihaz, tamamen ayrı.</div></div>
<div class="calc-card"><div class="card-title">İadeli çekiliş</div><div class="card-body">Kart çek, bak, geri koy, karıştır, tekrar çek. İkinci çekiliş birincisi gibi tüm 52 kartlık desteyle karşılaşır.</div></div>
<div class="calc-card"><div class="card-title">Farklı sınıflardan iki öğrenci</div><div class="card-body">A sınıfından bir öğrenci, B sınıfından bir öğrenci bağımsız olarak seçilir — seçimler birbirini etkilemez.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1 — İKİ PARA</div><div class="example-body">İki hilesiz para at. İkisinin de yazı gelme olasılığı nedir?<br><br>$A$ = "birinci atış yazı", $B$ = "ikinci atış yazı" olsun.<br>$P(A) = 1/2$, $P(B) = 1/2$ ve atışlar bağımsızdır.<br>$$P(A \\cap B) = \\dfrac{1}{2} \\cdot \\dfrac{1}{2} = \\dfrac{1}{4}.$$<br>Doğrulama: örnek uzay $\\{YY, YT, TY, TT\\}$, dört sonuçtan biri YY, yani $1/4$. Aynı cevap.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 — ZAR VE PARA</div><div class="example-body">Hilesiz bir zar at ve hilesiz bir para at. 6 gelmesi ve yazı gelmesi olasılığı nedir?<br><br>$P(6) = 1/6$ ve $P(Y) = 1/2$, bağımsızdır çünkü zar ve para etkileşmez.<br>$$P(6 \\cap Y) = \\dfrac{1}{6} \\cdot \\dfrac{1}{2} = \\dfrac{1}{12}.$$<br>Örnek uzay kontrolü: $|S| = 6 \\cdot 2 = 12$ ve yalnızca bir çift $(6, Y)$ uygundur. Uyuşur.</div></div>

<div class="l-note"><strong>"Bağımsızlık testi".</strong> Bazen problem iki olayın bağımsız olup olmadığını söylemez — kontrol etmen gerekir. Test şudur: $P(A \\cap B) = P(A) \\cdot P(B)$ mi? Evetse, olaylar bağımsızdır. $P(A \\cap B)$ çarpımdan farklıysa, değildir. 7. bölümde bu testin bir örneğini göreceğiz.</div>

<h2 class="lesson-title">3. Bağımlı Olaylar — Genel Çarpma Kuralı</h2>

<div class="calc-highlight"><strong>İki olay, A'nın gerçekleşmesi B'nin olasılığını değiştiriyorsa <em>bağımlı</em>dır.</strong> Birinci olay durumu üzerinde bir iz bırakır — bir nesneyi çıkarır, bir kaynağı tüketir ya da ikinci deneyi başka türlü değiştirir. Bu değişimi <em>koşullu olasılıkla</em> yakalarız, $P(B \\mid A)$ ile yazılır, "A verildiğinde B'nin olasılığı" diye okunur.</div>

<div class="calc-formula"><div class="formula-label">BAĞIMLI OLAYLAR — GENEL ÇARPMA KURALI</div><div class="formula-main">$$\\boxed{\\;P(A \\cap B) \\;=\\; P(A) \\cdot P(B \\mid A)\\;}$$</div><div class="formula-sub">A'nın olasılığını, A'nın zaten gerçekleştiği yeni dünyada B'nin olasılığıyla çarp. 96. ders koşullu olasılığı tüm yönleriyle ele alacak; burada yalnızca çarpma haline ihtiyacımız var.</div></div>

<p class="l-text"><strong>Klasik örnek: iadesiz çekiliş.</strong> 52 kartlık bir deste. Bir kart çek, geri koyma, sonra ikinci bir kart çek. İki çekiliş bağımlıdır çünkü birinci çekiliş desteyi kalıcı olarak değiştirir. Birinci kart papazsa, ikinci çekiliş için 51 kart arasında sadece 3 papaz kalır; ikinci papazın koşullu olasılığı $4/52$ değil $3/51$'dir. Birinci olay ikincisi için uygun sonuçların bir kısmını "tüketir".</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İADESİZ İKİ PAPAZ</div><div class="example-body">52'lik desteden iki kart çek, birinciyi geri koymadan. İkisinin de papaz olma olasılığı nedir?<br><br>$A$ = "birinci kart papaz", $B$ = "ikinci kart papaz" olsun.<br>$P(A) = 4/52 = 1/13$.<br>Birinci kart papaz olduğunda destede kalan 51 kart arasında yalnızca 3 papaz vardır, yani $P(B \\mid A) = 3/51 = 1/17$.<br>$$P(A \\cap B) = \\dfrac{4}{52} \\cdot \\dfrac{3}{51} = \\dfrac{12}{2652} = \\dfrac{1}{221}.$$<br>Yaklaşık %0.45 — yarım yüzdeden biraz az.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İADELİ İKİ PAPAZ</div><div class="example-body">Aynı deste, ama bu kez birinci kart geri konup deste karıştırıldıktan sonra ikinci çekiliş yapılıyor. Şimdi olaylar bağımsızdır.<br><br>$P(\\text{ikisi de papaz}) = \\dfrac{4}{52} \\cdot \\dfrac{4}{52} = \\dfrac{16}{2704} = \\dfrac{1}{169}.$<br>Yaklaşık %0.59 — iadesiz cevaptan biraz yüksek, çünkü birinci çekilişte bir papazı "tüketmedik".</div></div>

<div class="l-note"><strong>İade anahtar sözcüğü.</strong> Bir problemde "iadeli" geçiyorsa olaylar bağımsızdır ve $P(A) \\cdot P(B)$ kullanırsın. "İadesiz" neredeyse her zaman bağımlılığa ve koşullu hale $P(A) \\cdot P(B \\mid A)$'ya işaret eder. Bu kelimeyi dikkatle oku — tüm hesabı değiştirir.</div>

<h2 class="lesson-title">4. İki Aşamalı Deneyler için Ağaç Diyagramları</h2>

<div class="calc-highlight"><strong>Bir ağaç diyagramı iki aşamalı bir deneyi öyle düzenler ki çarpma kuralı tamamen görsel hale gelir.</strong> Ağacın her seviyesi bir aşamaya karşılık gelir. Her dal bir olasılık taşır. Belirli bir sonucun olasılığını bulmak için (kökten yaprağa giden bir yol) yol boyundaki dal olasılıklarını çarpman yeterlidir.</div>

<p class="l-text">Bağımsız olaylar için her seviyede aynı olasılıklar görünür — ağaç "simetrik"tir. Bağımlı olaylar içinse ikinci seviyenin dalları, hangi birinci seviyeden geldiğine bağlı olarak farklı olasılıklara sahiptir. Ağacı çizmek seni her dala doğru koşullu olasılığı yazmaya zorlar ve çizildikten sonra hesap mekanik hale gelir.</p>

<div class="calc-graph"><div id="plot-l95-tree-indep-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> iki hilesiz para atışı için iki aşamalı ağaç, bağımsız bir deney. Her dal kendi olasılığıyla (1/2) etiketlenmiştir. Her yol boyunca 1/2'yi 1/2 ile çarpınca dört yaprak olasılığı 1/4 olarak elde edilir. Olaylar bağımsız olduğundan ikinci seviye dalları birinci seviye sonucundan bağımsızdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var edgesT={x:[0,1,null,0,1,null,1,2,null,1,2,null,1,2,null,1,2,null],y:[0,1,null,0,-1,null,1,1.6,null,1,0.4,null,-1,-0.4,null,-1,-1.6,null],mode:'lines',name:'ağaç',line:{color:'rgba(255,255,255,0.45)',width:1.6}};
var nodesT={x:[0,1,1,2,2,2,2],y:[0,1,-1,1.6,0.4,-0.4,-1.6],mode:'markers+text',name:'düğüm',marker:{color:'#3b82f6',size:14},text:['başla','Y','T','YY','YT','TY','TT'],textposition:'top center',textfont:{color:'#e8e8e8',size:12},showlegend:false};
var probsT={x:[0.5,0.5,1.5,1.5,1.5,1.5],y:[0.6,-0.6,1.4,0.8,-0.8,-1.4],mode:'text',name:'p',text:['1/2','1/2','1/2','1/2','1/2','1/2'],textfont:{color:'#f59e0b',size:11},showlegend:false};
var leavesT={x:[2.85,2.85,2.85,2.85],y:[1.6,0.4,-0.4,-1.6],mode:'text',name:'P',text:['P=1/4','P=1/4','P=1/4','P=1/4'],textfont:{color:'#10b981',size:12},showlegend:false};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.4,3.5],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-2.1,2.1],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l95-tree-indep-tr',[edgesT,nodesT,probsT,leavesT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Bağımlı deneyle karşılaştırma.</strong> Aşağıda 3 kırmızı ve 2 mavi bilye olan bir torbadan iadesiz iki bilye çekmek için ağacı çiziyoruz. Birinci seviye olasılıkları 3/5 (kırmızı) ve 2/5 (mavi). Ama ikinci seviye olasılıkları artık birinci olayda ne olduğuna bağlıdır: bir kırmızı çekildikten sonra torbada 4 bilye arasında yalnızca 2 kırmızı ve 2 mavi kalır; bir mavi çekildikten sonra 4 bilye arasında 3 kırmızı ve 1 mavi kalır. Ağacın dalları ikinci seviyede farklı sayılar taşır — bağımlılığın görsel imzası budur.</p>

<div class="calc-graph"><div id="plot-l95-tree-dep-tr" class="plotly-graph" style="height:450px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> 3 kırmızı ve 2 mavi bilyeli bir torbadan iadesiz iki bilye çekmek için bir ağaç. Birinci çekilişten sonra torbanın bileşimi değiştiği için ikinci seviye dal olasılıkları birinci seviye sonucuna bağlıdır. Her yol boyunca çarp ki o iki bilye dizisinin birleşik olasılığını elde edesin; dört yaprak olasılığı toplamı 1'dir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var edgesT={x:[0,1,null,0,1,null,1,2,null,1,2,null,1,2,null,1,2,null],y:[0,1,null,0,-1,null,1,1.6,null,1,0.4,null,-1,-0.4,null,-1,-1.6,null],mode:'lines',name:'ağaç',line:{color:'rgba(255,255,255,0.45)',width:1.6}};
var nodesT={x:[0,1,1,2,2,2,2],y:[0,1,-1,1.6,0.4,-0.4,-1.6],mode:'markers+text',name:'düğüm',marker:{color:'#3b82f6',size:14},text:['başla','K','M','KK','KM','MK','MM'],textposition:'top center',textfont:{color:'#e8e8e8',size:12},showlegend:false};
var probsT={x:[0.5,0.5,1.5,1.5,1.5,1.5],y:[0.65,-0.65,1.4,0.8,-0.8,-1.4],mode:'text',name:'p',text:['3/5','2/5','2/4','2/4','3/4','1/4'],textfont:{color:'#f59e0b',size:12},showlegend:false};
var leavesT={x:[2.95,2.95,2.95,2.95],y:[1.6,0.4,-0.4,-1.6],mode:'text',name:'P',text:['6/20','6/20','6/20','2/20'],textfont:{color:'#10b981',size:12},showlegend:false};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.4,3.6],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-2.1,2.1],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l95-tree-dep-tr',[edgesT,nodesT,probsT,leavesT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Kontrol: yaprak olasılıkları toplamı 1 mi?</strong> $6/20 + 6/20 + 6/20 + 2/20 = 20/20 = 1$. Olmak zorunda, çünkü dört yaprak tüm örnek uzayı sıralar. Eğer ağacının yaprakları 1'e toplanmıyorsa, dallarda bir aritmetik hata yapmışsındır.</div>

<h2 class="lesson-title">5. Birçok Bağımsız Olay — Genelleştirilmiş Çarpım Kuralı</h2>

<div class="calc-highlight"><strong>$n$ olay $A_1, A_2, \\dots, A_n$ karşılıklı olarak bağımsızsa, hepsinin gerçekleşme olasılığı tek tek olasılıklarının çarpımıdır.</strong> Bu, her "$n$ ardışık deneme" hesabının arkasındaki motordur: arka arkaya bir dizi para atışı, fabrikada bir parti bileşen, gelen e-postaların bağımsız spam dizisi.</div>

<div class="calc-formula"><div class="formula-label">GENELLEŞTİRİLMİŞ ÇARPIM KURALI</div><div class="formula-main">$$P(A_1 \\cap A_2 \\cap \\dots \\cap A_n) \\;=\\; P(A_1) \\cdot P(A_2) \\cdots P(A_n)$$</div><div class="formula-sub">Yalnızca olaylar karşılıklı bağımsızken geçerli. Bağımlı olaylar için kural koşullu çarpanlarla uzar: $P(A_1) P(A_2 \\mid A_1) P(A_3 \\mid A_1 \\cap A_2) \\cdots$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — BEŞ PARA</div><div class="example-body">Beş hilesiz para at. Beşinin de yazı gelme olasılığı nedir?<br><br>Beş atış bağımsız, her biri için $P(Y) = 1/2$.<br>$$P(\\text{YYYYY}) = \\left(\\dfrac{1}{2}\\right)^5 = \\dfrac{1}{32}.$$<br>Yaklaşık %3.1. Para sayısı arttıkça "hepsi yazı" olasılığı geometrik olarak küçülür.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — KALİTE KONTROL</div><div class="example-body">Bir cihazda üç bileşen var. Her bileşen bağımsız olarak %5 ihtimalle bozulur. Üçünün de çalışma olasılığı nedir?<br><br>Her bileşen $0.95$ olasılıkla çalışır. Bağımsızlıkla,<br>$$P(\\text{üçü de çalışır}) = 0.95 \\cdot 0.95 \\cdot 0.95 = 0.95^3 \\approx 0.857.$$<br>Yani cihaz zamanın yaklaşık %85.7'sinde çalışır. Her tek bileşen çok güvenilir olsa da (%95), üçünü arka arkaya bağlamak genel güvenilirliği fark edilir biçimde düşürür.</div></div>

<h2 class="lesson-title">6. "En Az Bir" Deseni — Tümleyen ve Bağımsızlık Buluşması</h2>

<div class="calc-highlight"><strong>94. dersteki tümleyen kuralını bu dersin çarpım kuralıyla birleştirmek, lise olasılığındaki en kullanışlı tek tekniği verir: "en az bir" hilesi.</strong> Birçok problem doğrudan saldırması zor olsa da, olayların <em>hiçbirinin</em> gerçekleşmeme olasılığını hesaplayıp 1'den çıkarınca kolaylaşır.</div>

<div class="calc-formula"><div class="formula-label">"EN AZ BİR" FORMÜLÜ</div><div class="formula-main">$$P(\\text{en az bir } A_i) \\;=\\; 1 - P(\\text{hiç } A_i \\text{ yok}) \\;=\\; 1 - P(A_1') P(A_2') \\cdots P(A_n')$$</div><div class="formula-sub">Her tek tek olayın tümleyenini al, çarp (bağımsızlık kullanarak) ve 1'den çıkar. Olaylar bağımsız olduğunda her zaman çalışır.</div></div>

<p class="l-text"><strong>Neden çalışır.</strong> "En az bir $A_i$ gerçekleşir" ile "hiç $A_i$ gerçekleşmez", örnek uzayı örtüşmesiz dolduran tümleyen olaylardır. Tümleyen "hiç $A_i$ gerçekleşmez", $A_1', A_2', \\dots, A_n'$'in hepsinin gerçekleştiği anlamına gelir ve $A_i$ bağımsızsa tümleyenleri de bağımsızdır, böylece çarpım kuralını kullanabiliriz. O çarpımı 1'den çıkar — cevap budur.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — 4 ATIŞTA EN AZ BİR YAZI</div><div class="example-body">Dört hilesiz para at. En az bir yazı gelme olasılığı nedir?<br><br>Doğrudan saymak "tam bir yazı", "tam iki yazı", ..., "tam dört yazı" üzerinden toplam gerektirir — yorucu.<br><br>Tümleyen: "hiç yazı yok" demek dört atışın hepsi tura demek.<br>$P(\\text{hiç yazı yok}) = (1/2)^4 = 1/16$.<br>$$P(\\text{en az bir yazı}) = 1 - \\dfrac{1}{16} = \\dfrac{15}{16}.$$<br>Yaklaşık %93.75. %50'lik dört denemeyle en az bir yazı görmek neredeyse kesindir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — 4 ZAR ATIŞINDA EN AZ BİR 6</div><div class="example-body">Hilesiz bir zarı dört kez at. En az bir 6 gelme olasılığı nedir?<br><br>Tek atışta 6 gelmeme olasılığı: $5/6$. Dört bağımsız atışta: $(5/6)^4 = 625/1296 \\approx 0.482$.<br>$$P(\\text{en az bir 6}) = 1 - \\dfrac{625}{1296} = \\dfrac{671}{1296} \\approx 0.518.$$<br>Yaklaşık %51.8 — beraberden biraz daha iyi. Bu, Pascal ve Fermat'nın olasılık teorisi üzerine ilk mektuplarını ateşleyen 17. yüzyıldan ünlü "Chevalier de Méré" problemidir.</div></div>

<div class="calc-graph"><div id="plot-l95-atleast-tr" class="plotly-graph" style="height:370px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $n$ bağımsız hilesiz para atışında "en az bir yazı" olasılığı, $n = 1, 2, \\dots, 10$ için çizilmiş. $1 - (1/2)^n$ eğrisi başta dik yükselir ve $n$ büyüdükçe 1'e yaklaşır. $n = 7$'de bile olasılık zaten %99'un üstünde — "hepsi tura" olasılığı çok hızla ihmal edilebilir hale gelir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nArrT=[];var pArrT=[];var labArrT=[];
for(var n=1;n<=10;n++){nArrT.push(n);var p=1-Math.pow(0.5,n);pArrT.push(p);labArrT.push(('%'+(p*100).toFixed(1)));}
var barsT={x:nArrT,y:pArrT,type:'bar',name:'P(en az bir yazı)',marker:{color:'#3b82f6'},text:labArrT,textposition:'outside',textfont:{color:'#e8e8e8',size:11}};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Atış sayısı n',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'P(en az bir yazı)',range:[0,1.15],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:55,l:60},showlegend:false};
Plotly.newPlot('plot-l95-atleast-tr',[barsT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Bağımsızlık Testi Pratikte</h2>

<div class="calc-highlight"><strong>Bazen problem sana $P(A)$, $P(B)$ ve $P(A \\cap B)$ olasılıklarını verir ve sorar: A ve B bağımsız mı?</strong> Test basittir. $P(A) \\cdot P(B)$ çarpımını hesapla ve $P(A \\cap B)$ ile karşılaştır. Eşleşirlerse, olaylar bağımsızdır. Farklıysalar, değildir.</div>

<div class="calc-formula"><div class="formula-label">BAĞIMSIZLIK TESTİ</div><div class="formula-main">$$A, B \\text{ bağımsız} \\iff P(A \\cap B) = P(A) \\cdot P(B)$$</div><div class="formula-sub">Eşdeğer olarak, $P(B \\mid A) = P(B)$: A'yı bilmek B'nin olasılığını değiştirmez.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — BAĞIMSIZ MI?</div><div class="example-body">Hilesiz bir zarı at. $A$ = "çift sayı gelir" ve $B$ = "3'ten büyük sayı gelir" olsun. A ve B bağımsız mı?<br><br>$A = \\{2,4,6\\}$, $P(A) = 3/6 = 1/2$.<br>$B = \\{4,5,6\\}$, $P(B) = 3/6 = 1/2$.<br>$A \\cap B = \\{4, 6\\}$, $P(A \\cap B) = 2/6 = 1/3$.<br>Çarpım: $P(A) \\cdot P(B) = 1/2 \\cdot 1/2 = 1/4$.<br><br>$1/3 \\ne 1/4$, bu yüzden A ve B <strong>bağımsız değildir</strong>. Zarın çift geldiğini bilmek, 3'ten büyük olma olasılığını yükseltir (1/2'den 2/3'e).</div></div>

<div class="l-note"><strong>Bağımsızlık karşılıklı dışlama değildir.</strong> İki olayın bağımsız olması, ikisinin birlikte gerçekleşemeyeceği anlamına GELMEZ. Aslında, her ikisinin de pozitif olasılığı varsa ve karşılıklı dışlayanlarsa, bağımsız OLAMAZLAR — çünkü $P(A \\cap B) = 0$ iken $P(A) \\cdot P(B) > 0$. İki kavram gerçekten farklıdır ve sonraki bölüm nedenini açıklıyor.</div>

<h2 class="lesson-title">8. Bağımsız ile Karşılıklı Dışlayan — Karıştırma</h2>

<div class="calc-highlight"><strong>"Bağımsız" ve "karşılıklı dışlayan" benzer kulağa gelir ama zıt anlamlar taşır.</strong> Karşılıklı dışlayan olaylar birlikte gerçekleş<em>emez</em> ($A \\cap B = \\emptyset$). Bağımsız olaylar birlikte gerçekleş<em>ebilir</em>, ve bunun olasılığı $P(A) \\cdot P(B)$'dir. İkisini karıştırmak en sık sınav tuzaklarından biridir — aşağıdaki tablo ayrımı açıkça gösterir.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">KARŞILIKLI DIŞLAYAN</div><div class="compare-item">$A \\cap B = \\emptyset$ — birlikte olamaz</div><div class="compare-item">$P(A \\cap B) = 0$</div><div class="compare-item">$P(A \\cup B) = P(A) + P(B)$</div><div class="compare-item">Örnek: tek zarda 1 ve 2 gelmesi</div><div class="compare-item"><em>Birleşim</em> ile ilgili (veya)</div></div><div class="compare-col"><div class="compare-title">BAĞIMSIZ</div><div class="compare-item">A ve B birlikte olabilir; A B'yi etkilemez</div><div class="compare-item">$P(A \\cap B) = P(A) \\cdot P(B)$</div><div class="compare-item">Her zaman 0'dan farklı (her iki olasılık pozitifse)</div><div class="compare-item">Örnek: 1. parada yazı ve 2. parada yazı</div><div class="compare-item"><em>Kesişim</em> ile ilgili (ve)</div></div></div>

<p class="l-text"><strong>Farkı daha keskin görmenin bir yolu.</strong> Karşılıklı dışlayan olaylar <em>tek bir denemede birlikte var olamaz</em>: A olursa B olamaz. Bağımsız olaylar oldukça farklıdır: A ve B birlikte olabilir de olmayabilir de, soru birini bilmenin diğeri hakkında bilgi verip vermediğidir. Karşılıklı dışlayan durumda, A'nın olduğunu bilmek B hakkında çok şey söyler: B'nin olmadığını söyler. Yani pozitif olasılıkları olan karşılıklı dışlayan olaylar bağımsız olmaktan çok uzaktır — iki olayın olabileceği en bağımlı haldir.</p>

<h2 class="lesson-title">9. Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">"Ve" ile "veya"yı karıştırmak</div><div class="card-body">"Ve" çarpar (kesişim); "veya" çıkarmalı toplar (birleşim). Türkçeyi dikkatle çevir. "İkisi de", "hepsi" genelde çarpma işaretidir. "Ya da", "en az bir" iki yönlü olabilir — ama ikincisi neredeyse her zaman tümleyen + çarpma ile en kolay çözülür.</div></div>
<div class="calc-card"><div class="card-title">Bağımlıyken $P(A) \\cdot P(B)$ kullanmak</div><div class="card-body">"İadesiz" ya da birinci olayın ikinciyi değiştirdiği herhangi bir kurulumda $P(A) \\cdot P(B \\mid A)$ kullanmalısın. Koşulsuz olasılıkların çarpımı fazla sayar.</div></div>
<div class="calc-card"><div class="card-title">Bağımsızı karşılıklı dışlayanla karıştırmak</div><div class="card-body">Farklı ve neredeyse zıt kavramlardır. A ve B karşılıklı dışlayansa ve her ikisinin de pozitif olasılığı varsa, mutlaka bağımlıdırlar: A'nın olduğunu bilmek B'nin olmadığını söyler.</div></div>
<div class="calc-card"><div class="card-title">Ağacı güncellemeyi unutmak</div><div class="card-body">Bağımlı bir ağaçta ikinci seviye dallar güncellenmiş olasılıkları taşımalı. "İadesiz iki papaz" için her iki seviyeye de 4/52 yazmak bu tür hataların en yaygınıdır.</div></div>
</div>

<h2 class="lesson-title">10. Çözümlü Problemler</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — İKİ PARA, İKİSİ DE YAZI</div><div class="example-body"><strong>İki hilesiz para at. İkisinin de yazı gelme olasılığı nedir?</strong><br><br>Bağımsız: $P(\\text{YY}) = (1/2)(1/2) = 1/4$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — İADESİZ İKİ KART</div><div class="example-body"><strong>52'lik desteden iadesiz iki kart çek. İkisinin de kupa olma olasılığı nedir?</strong><br><br>$P(\\text{ilk kupa}) = 13/52 = 1/4$.<br>İlk kupa olduğunda, 51 kart arasında 12 kupa kalır: $P(\\text{ikinci kupa} \\mid \\text{ilk kupa}) = 12/51$.<br>$$P(\\text{ikisi de kupa}) = \\dfrac{13}{52} \\cdot \\dfrac{12}{51} = \\dfrac{156}{2652} = \\dfrac{1}{17}.$$<br>Yaklaşık %5.88.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — İADELİ İKİ KART</div><div class="example-body"><strong>Aynı kurulum, ama birinci kart iade edilip deste karıştırıldıktan sonra ikinci çekiliş yapılıyor. İkisinin de kupa olma olasılığı?</strong><br><br>Bağımsız: $P(\\text{ikisi de kupa}) = (13/52)(13/52) = 1/16 = 0.0625$. İadesiz duruma göre biraz daha yüksek.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — 4 ATIŞTA EN AZ BİR YAZI</div><div class="example-body"><strong>Dört hilesiz para at. En az bir yazı gelme olasılığı nedir?</strong><br><br>Tümleyen: "hiç yazı yok" demek TTTT. $P(\\text{TTTT}) = (1/2)^4 = 1/16$.<br>$$P(\\text{en az bir yazı}) = 1 - 1/16 = 15/16 \\approx \\%93.75.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — KALİTE KONTROL</div><div class="example-body"><strong>Bir devre üç bağımsız bileşen içerir. Her biri %5 olasılıkla bozulur. Üçünün de çalışma olasılığı nedir?</strong><br><br>Her biri $0.95$ olasılıkla çalışır.<br>$$P(\\text{üçü de çalışır}) = 0.95^3 \\approx 0.857.$$<br>Yaklaşık %85.7. Eşdeğer olarak en az birinin bozulma olasılığı $1 - 0.857 = 0.143$, yani yaklaşık %14.3.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — AĞAÇ DİYAGRAMI, İADESİZ BİLYELER</div><div class="example-body"><strong>Bir torbada 3 kırmızı ve 2 mavi bilye var. İadesiz iki bilye çek. Bir kırmızı ve bir mavi çekme olasılığı nedir (sıra fark etmez)?</strong><br><br>Bağımlı ağacı kullan.<br>$P(\\text{K sonra M}) = (3/5)(2/4) = 6/20$.<br>$P(\\text{M sonra K}) = (2/5)(3/4) = 6/20$.<br>Bunlar ayrık olaylardır (farklı sıralamalar), bu yüzden toplarız:<br>$$P(\\text{birer tane}) = 6/20 + 6/20 = 12/20 = 3/5.$$<br>Yani %60.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — BAĞIMSIZLIK TESTİ</div><div class="example-body"><strong>Hilesiz bir zarda $A$ = "çift sayı gelir" ve $B$ = "4'ten büyük gelir" olsun. A ve B bağımsız mı?</strong><br><br>$P(A) = 3/6 = 1/2$. $P(B) = 2/6 = 1/3$ (yani $\\{5, 6\\}$).<br>$A \\cap B = \\{6\\}$, yani $P(A \\cap B) = 1/6$.<br>Çarpım: $(1/2)(1/3) = 1/6$. <strong>Eşleşir.</strong><br><br>O halde A ve B bağımsızdır. (Bunu 7. bölümdeki $B = \\{4,5,6\\}$ örneğiyle karşılaştır — orada bağımsızlık çuvalladı; burada B $\\{5, 6\\}$'ya kırpılınca tutar.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — E-POSTA YIĞINI</div><div class="example-body"><strong>Bir e-postanın spam olma olasılığı her e-posta için bağımsız olarak 0.3'tür. 5 e-posta alıyorsun. En az birinin spam olma olasılığı nedir?</strong><br><br>Her biri için $P(\\text{spam değil}) = 0.7$. $P(\\text{hiçbiri spam değil}) = 0.7^5 \\approx 0.168$.<br>$$P(\\text{en az bir spam}) = 1 - 0.168 = 0.832.$$<br>Yaklaşık %83.2. Her biri %30 olan beş denemede spam görünmesi neredeyse kesindir.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Çarpma kuralı "ve" sorularını yanıtlar: $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$.</li>
<li>A ve B bağımsızsa kural sadeleşir: $P(A \\cap B) = P(A) \\cdot P(B)$.</li>
<li>"İadeli" ardışık çekilişleri bağımsız yapar; "iadesiz" bağımlı yapar.</li>
<li>Ağaç diyagramları iki aşamalı deneyleri görselleştirir: her yolun dalları boyunca çarp.</li>
<li>$n$ bağımsız olay için birleşik olasılık $P(A_1) P(A_2) \\cdots P(A_n)$ çarpımıdır.</li>
<li>"En az bir" problemleri genelde tümleyenle en kolay çözülür: $1 - P(\\text{hiç}) = 1 - \\prod P(A_i')$.</li>
<li>Bağımsızlık testi: A ve B bağımsızdır ancak ve ancak $P(A \\cap B) = P(A) \\cdot P(B)$ ise.</li>
<li>Bağımsız ile karşılıklı dışlayan zıt kavramlardır — sınavda asla karıştırma.</li>
</ul>
</div>`

};
