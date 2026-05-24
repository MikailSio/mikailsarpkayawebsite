window.LISE_MAT_L94 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Probability is the mathematics of uncertainty.</strong> When you toss a coin you do not know whether it will land heads or tails — yet you do know that, out of two equally likely outcomes, exactly one of them will occur. Probability theory turns that vague intuition into numbers between 0 and 1: a coin gives heads with probability 1/2, a fair die gives a six with probability 1/6, and drawing the ace of spades from a shuffled deck has probability 1/52. The numbers always say the same thing — "out of all the things that could happen, what fraction of them is the thing I care about?"</p>

<p class="l-text">In this lesson you will meet the four words that carry every probability calculation: <em>experiment, outcome, sample space, event</em>. You will see why probabilities must lie between 0 and 1, learn the three axioms that make probability a precise theory rather than a vague feeling, and use the addition rule and the complement rule to compute non-trivial probabilities by hand. By the end you will be able to read any probability problem and translate it, mechanically, into a counting question on a finite sample space.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Identify the <em>sample space</em> S of a random experiment and define an <em>event</em> as a subset A &sub; S</li>
<li>Compute classical probabilities using $P(A) = |A| / |S|$ when outcomes are equally likely</li>
<li>State the three Kolmogorov axioms and use the complement rule $P(A') = 1 - P(A)$</li>
<li>Apply the addition rule with overlap correction: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$</li>
<li>Recognise mutually exclusive (disjoint) events and compute their union directly</li>
<li>Distinguish theoretical probability from empirical (frequentist) probability and explain the law of large numbers in plain words</li>
</ul>
</div>

<h2 class="lesson-title">1. Random Experiments, Outcomes and Sample Space</h2>

<div class="calc-highlight"><strong>The first three vocabulary words.</strong> An <em>experiment</em> is any procedure whose result is not known in advance: tossing a coin, rolling a die, drawing a card, picking a name from a hat. An <em>outcome</em> is one possible result of that experiment. The <em>sample space</em>, written S, is the set of all possible outcomes.</div>

<p class="l-text">The sample space is the universe inside which every probability question lives. Before you can compute any probability you have to be able to list — at least in principle — every outcome that could happen. If your sample space is wrong, every probability you compute afterwards will be wrong.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Toss a coin</div><div class="card-body">Sample space: $S = \\{H, T\\}$. Two outcomes: heads and tails.</div></div>
<div class="calc-card"><div class="card-title">Roll a die</div><div class="card-body">Sample space: $S = \\{1, 2, 3, 4, 5, 6\\}$. Six outcomes.</div></div>
<div class="calc-card"><div class="card-title">Draw one card</div><div class="card-body">Sample space: all 52 cards. $|S| = 52$.</div></div>
<div class="calc-card"><div class="card-title">Toss two coins</div><div class="card-body">Sample space: $S = \\{HH, HT, TH, TT\\}$. Four outcomes.</div></div>
</div>

<div class="l-note"><strong>Pay attention to the size.</strong> The number of outcomes in S is written $|S|$. For a single die $|S|=6$; for two dice $|S| = 36$ (each of the 6 outcomes on die 1 can pair with each of the 6 on die 2). Counting $|S|$ correctly is half the work in a classical probability problem.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">List the sample space for the experiment "toss three coins in a row". How many outcomes does it have? (Answer: $S = \\{HHH, HHT, HTH, HTT, THH, THT, TTH, TTT\\}$, so $|S| = 8 = 2^3$.)</div></div>

<h2 class="lesson-title">2. Events as Subsets of the Sample Space</h2>

<div class="calc-highlight"><strong>An event is anything that might or might not happen — and mathematically, it is just a subset of S.</strong> The event "roll an even number" on a die is the subset $A = \\{2, 4, 6\\}$. The event "draw a heart" from a deck is the subset of the 13 hearts. Once you have S, every event is built by selecting outcomes from S.</div>

<div class="calc-formula"><div class="formula-label">EVENT — DEFINITION</div><div class="formula-main">$$A \\;\\subseteq\\; S \\qquad\\text{(A is an event, S is the sample space)}$$</div><div class="formula-sub">An event is a collection of outcomes. We say "A occurs" if the outcome of the experiment is one of the outcomes belonging to A.</div></div>

<p class="l-text">Two special events sit at the extremes. The whole sample space S is the <em>certain event</em> — whatever happens, the outcome lies in S, so S always occurs. The empty set $\\emptyset$ is the <em>impossible event</em> — it contains no outcomes, so it can never occur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">"Even" on a die</div><div class="card-body">$A = \\{2, 4, 6\\}$, with $|A| = 3$.</div></div>
<div class="calc-card"><div class="card-title">"Greater than 4" on a die</div><div class="card-body">$B = \\{5, 6\\}$, with $|B| = 2$.</div></div>
<div class="calc-card"><div class="card-title">"At least one head" in two tosses</div><div class="card-body">$C = \\{HH, HT, TH\\}$, with $|C| = 3$. Note TT is excluded.</div></div>
<div class="calc-card"><div class="card-title">Impossible event</div><div class="card-body">$\\emptyset$, the empty subset. Contains no outcomes.</div></div>
</div>

<h2 class="lesson-title">3. Classical Probability: Equally Likely Outcomes</h2>

<div class="calc-highlight"><strong>If every outcome in S is equally likely, the probability of an event is just a count divided by a count.</strong> This is the oldest and simplest definition of probability, going back to Cardano and Pascal in the 16th and 17th centuries. It works perfectly for fair coins, fair dice, and well-shuffled decks.</div>

<div class="calc-formula"><div class="formula-label">CLASSICAL PROBABILITY</div><div class="formula-main">$$P(A) \\;=\\; \\frac{|A|}{|S|} \\;=\\; \\frac{\\text{number of outcomes favourable to A}}{\\text{total number of outcomes}}$$</div><div class="formula-sub">Valid only when every outcome in S is equally likely. For loaded dice or biased coins this formula does not apply.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Roll a fair die. What is the probability of rolling an even number?<br><br>Sample space: $S = \\{1,2,3,4,5,6\\}$, $|S| = 6$.<br>Event: $A = \\{2, 4, 6\\}$, $|A| = 3$.<br>$$P(A) = \\dfrac{3}{6} = \\dfrac{1}{2}.$$<br>So the probability of rolling an even number is exactly one-half.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Draw one card from a standard 52-card deck. What is the probability that it is a heart?<br><br>$|S| = 52$. The hearts form the event $A$ with $|A| = 13$ (there are thirteen ranks: 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A).<br>$$P(A) = \\dfrac{13}{52} = \\dfrac{1}{4}.$$<br>One quarter of the deck is hearts, so the answer matches our intuition.</div></div>

<div class="calc-graph"><div id="plot-l94-die-en" class="plotly-graph" style="height:360px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the six outcomes of a fair die, each with equal probability 1/6. Because the bars all reach the same height, the die is "uniform" — every face is equally likely. Classical probability is exactly this picture.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var dieX=['1','2','3','4','5','6'];
var dieY=[1/6,1/6,1/6,1/6,1/6,1/6];
var bars={x:dieX,y:dieY,type:'bar',name:'P(face)',marker:{color:'#3b82f6'},text:['1/6','1/6','1/6','1/6','1/6','1/6'],textposition:'outside',textfont:{color:'#e8e8e8',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Die face',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'Probability',range:[0,0.22],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:55,l:60},showlegend:false};
Plotly.newPlot('plot-l94-die-en',[bars],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">A bag contains 5 red marbles and 3 blue marbles. You draw one marble at random. What is the probability that it is blue? (Answer: $|S| = 8$, $|A| = 3$, so $P = 3/8$.)</div></div>

<h2 class="lesson-title">4. The Probability Axioms</h2>

<div class="calc-highlight"><strong>In 1933 Andrey Kolmogorov wrote down three rules from which every theorem of probability theory follows.</strong> They are clean, short, and worth memorising. Every probability you will ever compute, in this course and beyond, obeys them.</div>

<div class="calc-formula"><div class="formula-label">KOLMOGOROV'S THREE AXIOMS</div><div class="formula-main">$$\\begin{aligned} &\\text{(1) Non-negativity:} && 0 \\leq P(A) \\leq 1 \\\\ &\\text{(2) Normalisation:} && P(S) = 1 \\\\ &\\text{(3) Additivity:} && A \\cap B = \\emptyset \\;\\Longrightarrow\\; P(A \\cup B) = P(A) + P(B) \\end{aligned}$$</div><div class="formula-sub">Probabilities live between 0 and 1; the whole sample space has probability 1; and disjoint events add.</div></div>

<p class="l-text"><strong>What the axioms are saying, in plain English.</strong> Axiom 1 says probabilities are never negative and never greater than 1 — you cannot be "minus 30 percent sure" of anything, and you cannot be "120 percent sure" either. Axiom 2 says <em>something</em> must happen: the probability that the outcome lies somewhere in S is always 1, i.e. 100%. Axiom 3 says if two events cannot both happen at the same time, the chance that one or the other happens is the sum of their separate chances.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Axiom 1 in pictures</div><div class="card-body">$P = 0$ means impossible. $P = 1$ means certain. Everything else sits in between.</div></div>
<div class="calc-card"><div class="card-title">Axiom 2 example</div><div class="card-body">When you roll a die, the probability you get one of 1, 2, 3, 4, 5, 6 is exactly 1 — because nothing else can happen.</div></div>
<div class="calc-card"><div class="card-title">Axiom 3 example</div><div class="card-body">"Roll a 1" and "roll a 2" cannot both happen on one roll. So $P(1 \\text{ or } 2) = 1/6 + 1/6 = 2/6 = 1/3$.</div></div>
</div>

<h2 class="lesson-title">5. The Complement Rule</h2>

<div class="calc-highlight"><strong>The complement of an event A is "everything in S except A".</strong> Written $A'$ (or $A^c$ or $\\bar{A}$). If A is "roll an even number", then $A'$ is "roll an odd number". A and $A'$ together fill the entire sample space and never overlap.</div>

<div class="calc-formula"><div class="formula-label">COMPLEMENT RULE</div><div class="formula-main">$$P(A') \\;=\\; 1 - P(A)$$</div><div class="formula-sub">Why it holds: $A \\cup A' = S$ and $A \\cap A' = \\emptyset$. By axioms 2 and 3, $P(A) + P(A') = P(S) = 1$.</div></div>

<p class="l-text"><strong>Why this is useful.</strong> Sometimes computing the complement is much easier than computing the event directly. A classic example is "at least one" type problems: "the probability of at least one head in three tosses" is awkward to count directly, but "no heads at all" is a single outcome, TTT, and its probability is easy. So:</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Toss three fair coins. What is the probability of getting at least one head?<br><br>Direct approach: count $\\{HHH, HHT, HTH, HTT, THH, THT, TTH\\}$ — that is 7 outcomes out of 8.<br><br>Complement approach: the complement is "no heads", i.e. TTT, which is 1 outcome out of 8. So<br>$$P(\\text{at least one head}) = 1 - P(\\text{no heads}) = 1 - \\dfrac{1}{8} = \\dfrac{7}{8}.$$<br>Both methods agree, but the complement method scales easily to 10 coins, 100 coins, ....</div></div>

<div class="l-note"><strong>Spotting the cue.</strong> The phrase "at least one" or "at least k" in a probability question is almost always a hint that the complement rule will be the cleanest path.</div>

<h2 class="lesson-title">6. The Addition Rule (Inclusion-Exclusion)</h2>

<div class="calc-highlight"><strong>What if two events <em>can</em> both happen?</strong> Axiom 3 assumes they are disjoint, but in real life events often overlap. For example, on a single card draw, "heart" and "face card" can both happen (J of hearts, Q of hearts, K of hearts). To handle this we extend axiom 3 with a correction term.</div>

<div class="calc-formula"><div class="formula-label">ADDITION RULE (INCLUSION-EXCLUSION)</div><div class="formula-main">$$P(A \\cup B) \\;=\\; P(A) + P(B) - P(A \\cap B)$$</div><div class="formula-sub">Sum the two events, then subtract the overlap so it is not counted twice.</div></div>

<p class="l-text"><strong>Why we subtract.</strong> If you add $P(A)$ and $P(B)$, every outcome that is in <em>both</em> A and B gets counted once in $P(A)$ and again in $P(B)$ — twice in total. The intersection $A \\cap B$ is exactly those double-counted outcomes, so we subtract $P(A \\cap B)$ once to fix the over-count. The Venn diagram below shows it visually.</p>

<div class="calc-graph"><div id="plot-l94-venn-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two overlapping events A and B inside the sample space S. The crescent on the left holds outcomes that are in A only; the crescent on the right holds outcomes in B only; the central lens-shaped region $A \\cap B$ holds outcomes that are in both. Adding $|A|$ and $|B|$ counts the central region twice, so we subtract it once.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var thV=[];var c1x=[];var c1y=[];var c2x=[];var c2y=[];
for(var i=0;i<=120;i++){var a=2*Math.PI*i/120;c1x.push(-0.6+1.0*Math.cos(a));c1y.push(1.0*Math.sin(a));c2x.push(0.6+1.0*Math.cos(a));c2y.push(1.0*Math.sin(a));}
var rectX=[-2.2,2.2,2.2,-2.2,-2.2];var rectY=[-1.4,-1.4,1.4,1.4,-1.4];
var box={x:rectX,y:rectY,mode:'lines',name:'S',line:{color:'rgba(255,255,255,0.35)',width:1.5},fill:'toself',fillcolor:'rgba(255,255,255,0.02)'};
var circA={x:c1x,y:c1y,mode:'lines',name:'A',line:{color:'#3b82f6',width:2.4},fill:'toself',fillcolor:'rgba(59,130,246,0.18)'};
var circB={x:c2x,y:c2y,mode:'lines',name:'B',line:{color:'#10b981',width:2.4},fill:'toself',fillcolor:'rgba(16,185,129,0.18)'};
var labs={x:[-1.55,1.55,0,-2.0,0],y:[0,0,0,1.2,-1.6],mode:'text',name:'labels',text:['<b>A only</b>','<b>B only</b>','<b>A &cap; B</b>','<b>S</b>','outside A and B'],textfont:{color:['#3b82f6','#10b981','#f59e0b','#e8e8e8','rgba(235,230,220,0.7)'],size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-2.4,2.4],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'y',scaleratio:1},yaxis:{range:[-1.8,1.5],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:30,l:30},showlegend:false};
Plotly.newPlot('plot-l94-venn-en',[box,circA,circB,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Draw one card from a 52-card deck. What is the probability that the card is a spade or a face card (J, Q, K)?<br><br>Let $A$ = "spade", $B$ = "face card".<br>$P(A) = 13/52 = 1/4$ (13 spades).<br>$P(B) = 12/52 = 3/13$ (4 jacks + 4 queens + 4 kings).<br>$P(A \\cap B) = 3/52$ (jack, queen, king of spades — three cards that are both).<br>$$P(A \\cup B) = \\dfrac{13}{52} + \\dfrac{12}{52} - \\dfrac{3}{52} = \\dfrac{22}{52} = \\dfrac{11}{26}.$$<br>Roughly 42% — a little less than half of all cards.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Roll a fair die. Let $A$ = "even" and $B$ = "greater than 3". Find $P(A \\cup B)$.<br><br>$A = \\{2, 4, 6\\}$, $P(A) = 3/6$.<br>$B = \\{4, 5, 6\\}$, $P(B) = 3/6$.<br>$A \\cap B = \\{4, 6\\}$, $P(A \\cap B) = 2/6$.<br>$$P(A \\cup B) = \\dfrac{3}{6} + \\dfrac{3}{6} - \\dfrac{2}{6} = \\dfrac{4}{6} = \\dfrac{2}{3}.$$<br>Cross-check by listing $A \\cup B = \\{2, 4, 5, 6\\}$ directly: 4 outcomes out of 6, same answer.</div></div>

<h2 class="lesson-title">7. Mutually Exclusive (Disjoint) Events</h2>

<div class="calc-highlight"><strong>Two events are mutually exclusive — also called disjoint — if they cannot both happen on the same trial.</strong> In set language: $A \\cap B = \\emptyset$. In this case the intersection has probability 0, and the inclusion-exclusion rule collapses to the simpler additivity axiom.</div>

<div class="calc-formula"><div class="formula-label">DISJOINT EVENTS</div><div class="formula-main">$$A \\cap B = \\emptyset \\;\\Longrightarrow\\; P(A \\cup B) = P(A) + P(B)$$</div><div class="formula-sub">No overlap to subtract. The general inclusion-exclusion rule becomes pure addition.</div></div>

<p class="l-text"><strong>Examples of disjoint events.</strong> On a single die roll, "roll a 1" and "roll a 6" are disjoint (you cannot get both faces from one roll). On a single card draw, "heart" and "spade" are disjoint (each card has exactly one suit). Drawing the same student twice is not disjoint with anything trivial — but "this student is in grade 9" and "this student is in grade 10" are disjoint.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A bag has 4 red, 3 green, and 5 blue marbles. Pick one marble. What is the probability it is red or green?<br><br>"Red" and "green" are disjoint (a marble has only one colour).<br>$P(\\text{red}) = 4/12 = 1/3$, $P(\\text{green}) = 3/12 = 1/4$.<br>$$P(\\text{red or green}) = \\dfrac{4}{12} + \\dfrac{3}{12} = \\dfrac{7}{12}.$$<br>Equivalently, the complement (blue) is $5/12$, and $1 - 5/12 = 7/12$. Both routes agree.</div></div>

<h2 class="lesson-title">8. Empirical Probability and the Long Run</h2>

<div class="calc-highlight"><strong>Classical probability assumes outcomes are equally likely. What if they are not?</strong> If you bend a coin so it lands heads more often, the equally-likely formula breaks. The fix is to <em>observe</em> the probability rather than compute it — that is the empirical or frequentist approach.</div>

<div class="calc-formula"><div class="formula-label">EMPIRICAL (FREQUENTIST) PROBABILITY</div><div class="formula-main">$$P(A) \\;\\approx\\; \\frac{\\text{number of trials in which A occurred}}{\\text{total number of trials}}$$</div><div class="formula-sub">A long-run estimate. The more trials you run, the closer the relative frequency gets to the true probability.</div></div>

<p class="l-text"><strong>The Law of Large Numbers</strong> says that as the number of trials grows, the relative frequency of an event approaches its true probability. Toss a fair coin 10 times and you might see 7 heads (frequency 0.7). Toss it 1000 times and you will almost certainly see something close to 500 (frequency near 0.5). Toss it 1,000,000 times and the frequency will be indistinguishable from 0.5. The "noisy" early ratios settle down into the theoretical probability as the sample grows.</p>

<div class="l-note"><strong>Both views agree where they should.</strong> For a fair coin, the classical answer is exactly $1/2$ and the empirical answer (in the limit) is also $1/2$. Classical probability is a special case of frequentist probability in which symmetry lets us shortcut the experiment.</div>

<h2 class="lesson-title">9. Tree Diagrams: Visualising Multi-Stage Experiments</h2>

<div class="calc-highlight"><strong>A tree diagram lays out every possible outcome of a multi-step experiment as a branching path.</strong> Each level of the tree corresponds to one stage, and each branch represents one outcome at that stage. Trees are the cleanest tool for organising sample spaces with two or more stages, and they prepare the ground for conditional probability in lesson 95.</div>

<p class="l-text">Consider the experiment: toss two fair coins, one after the other. Stage 1 has two branches (H, T). From each of those, stage 2 again branches into (H, T). Reading the leaves of the tree from top to bottom gives the four outcomes HH, HT, TH, TT — exactly the sample space we wrote down in section 1.</p>

<div class="calc-graph"><div id="plot-l94-tree-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a two-stage tree for tossing two fair coins. The root on the left splits into H and T (toss 1); each of those splits again into H and T (toss 2). The four leaves on the right enumerate the sample space $S = \\{HH, HT, TH, TT\\}$, each with probability 1/4.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var edges={x:[0,1,null,0,1,null,1,2,null,1,2,null,1,2,null,1,2,null],y:[0,1,null,0,-1,null,1,1.6,null,1,0.4,null,-1,-0.4,null,-1,-1.6,null],mode:'lines',name:'tree',line:{color:'rgba(255,255,255,0.45)',width:1.6}};
var nodes={x:[0,1,1,2,2,2,2],y:[0,1,-1,1.6,0.4,-0.4,-1.6],mode:'markers+text',name:'nodes',marker:{color:'#3b82f6',size:14},text:['start','H','T','HH','HT','TH','TT'],textposition:'top center',textfont:{color:'#e8e8e8',size:12},showlegend:false};
var probs={x:[0.5,0.5,1.5,1.5,1.5,1.5],y:[0.6,-0.6,1.4,0.8,-0.8,-1.4],mode:'text',name:'p',text:['1/2','1/2','1/2','1/2','1/2','1/2'],textfont:{color:'#f59e0b',size:11},showlegend:false};
var leaves={x:[2.7,2.7,2.7,2.7],y:[1.6,0.4,-0.4,-1.6],mode:'text',name:'P',text:['P=1/4','P=1/4','P=1/4','P=1/4'],textfont:{color:'#10b981',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.4,3.3],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-2.1,2.1],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l94-tree-en',[edges,nodes,probs,leaves],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Looking ahead.</strong> In lesson 95 we will attach <em>conditional</em> probabilities to the branches and use the tree to compute things like "given that the first toss was a head, what is the probability of two heads in total?". For now, just absorb the picture: every multi-stage sample space has a natural tree representation.</div>

<h2 class="lesson-title">10. Common Mistakes</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forgetting to subtract the overlap</div><div class="card-body">Writing $P(A \\cup B) = P(A) + P(B)$ when A and B can both happen. This double-counts the intersection. Always check: are the events disjoint? If not, subtract $P(A \\cap B)$.</div></div>
<div class="calc-card"><div class="card-title">Wrong sample space</div><div class="card-body">For two coins, students sometimes write $S = \\{0 H, 1 H, 2 H\\}$ — three outcomes — and conclude $P(\\text{one head}) = 1/3$. Wrong: the correct sample space has 4 equally-likely outcomes, and $P(\\text{exactly one head}) = 2/4 = 1/2$.</div></div>
<div class="calc-card"><div class="card-title">Assuming "equally likely" without checking</div><div class="card-body">A weighted die, a biased coin, or a card pile that has not been shuffled — the classical formula does not apply. You need data, not just counting.</div></div>
<div class="calc-card"><div class="card-title">Negative or above-1 answers</div><div class="card-body">If a calculation ever gives $P < 0$ or $P > 1$, there is a mistake. Probabilities live in $[0, 1]$.</div></div>
</div>

<h2 class="lesson-title">11. Worked Problems</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — DIE</div><div class="example-body"><strong>Roll a fair die. What is the probability of rolling a number less than 5?</strong><br><br>$S = \\{1,2,3,4,5,6\\}$, $A = \\{1,2,3,4\\}$, $|A| = 4$.<br>$$P(A) = \\dfrac{4}{6} = \\dfrac{2}{3}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — CARD</div><div class="example-body"><strong>Draw one card. What is the probability that it is a king or a heart?</strong><br><br>$P(\\text{king}) = 4/52$, $P(\\text{heart}) = 13/52$, $P(\\text{king of hearts}) = 1/52$.<br>$$P(\\text{king or heart}) = \\dfrac{4}{52} + \\dfrac{13}{52} - \\dfrac{1}{52} = \\dfrac{16}{52} = \\dfrac{4}{13}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — COMPLEMENT</div><div class="example-body"><strong>Toss four fair coins. What is the probability of getting at least one tail?</strong><br><br>Complement: "no tails", i.e. HHHH. $P(\\text{no tails}) = 1/16$.<br>$$P(\\text{at least one tail}) = 1 - \\dfrac{1}{16} = \\dfrac{15}{16}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — TWO COINS</div><div class="example-body"><strong>Toss two fair coins. What is the probability of exactly one head?</strong><br><br>$S = \\{HH, HT, TH, TT\\}$, $A = \\{HT, TH\\}$.<br>$$P(A) = \\dfrac{2}{4} = \\dfrac{1}{2}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — VENN DIAGRAM</div><div class="example-body"><strong>In a class of 30 students, 18 study English, 14 study French, and 8 study both. A student is chosen at random. What is the probability that the student studies English or French?</strong><br><br>$P(E) = 18/30$, $P(F) = 14/30$, $P(E \\cap F) = 8/30$.<br>$$P(E \\cup F) = \\dfrac{18}{30} + \\dfrac{14}{30} - \\dfrac{8}{30} = \\dfrac{24}{30} = \\dfrac{4}{5}.$$<br>So 24 out of 30 study at least one of the two languages; 6 study neither.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — DISJOINT</div><div class="example-body"><strong>A bag has 6 red, 4 yellow, and 10 green marbles. What is the probability of drawing a red or yellow marble?</strong><br><br>Red and yellow are disjoint.<br>$$P(\\text{red or yellow}) = \\dfrac{6}{20} + \\dfrac{4}{20} = \\dfrac{10}{20} = \\dfrac{1}{2}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — TWO DICE</div><div class="example-body"><strong>Roll two fair dice. What is the probability that the sum is 7?</strong><br><br>$|S| = 36$. The sum is 7 for $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$ — 6 outcomes.<br>$$P(\\text{sum}=7) = \\dfrac{6}{36} = \\dfrac{1}{6}.$$<br>This is the most likely single sum for two dice.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — EMPIRICAL ESTIMATE</div><div class="example-body"><strong>A coin is tossed 200 times and lands heads 112 times. Estimate the probability of heads on this coin.</strong><br><br>Empirical probability: $112/200 = 0.56$. Since this is noticeably above $0.5$, the coin may be biased — but with only 200 trials we cannot be certain. With more trials the estimate becomes sharper.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sample space S = set of all possible outcomes. An event A is a subset of S.</li>
<li>Classical probability: $P(A) = |A|/|S|$ when all outcomes are equally likely.</li>
<li>Three axioms: $0 \\leq P(A) \\leq 1$, $P(S) = 1$, disjoint events add.</li>
<li>Complement rule: $P(A') = 1 - P(A)$ — useful for "at least one" problems.</li>
<li>Addition rule: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$, with the intersection subtracted to avoid double-counting.</li>
<li>Mutually exclusive events have $A \\cap B = \\emptyset$, so the addition rule collapses to pure addition.</li>
<li>Empirical probability is relative frequency; by the Law of Large Numbers it approaches the theoretical probability as trials grow.</li>
<li>Tree diagrams organise multi-stage experiments and prepare the ground for conditional probability in lesson 95.</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Olasılık, belirsizliğin matematiğidir.</strong> Bir parayı havaya attığında yazı mı tura mı geleceğini bilmezsin — ama eşit olasılığa sahip iki sonuçtan tam olarak birinin gerçekleşeceğini bilirsin. Olasılık teorisi, bu belirsiz sezgiyi 0 ile 1 arasındaki sayılara dönüştürür: para 1/2 olasılıkla yazı verir, hilesiz bir zar 1/6 olasılıkla altı verir ve iyi karıştırılmış bir desteden maça asını çekme olasılığı 1/52'dir. Sayılar her zaman aynı şeyi söyler: "olabilecek tüm şeylerin içinde, ilgilendiğim şey hangi orana karşılık geliyor?"</p>

<p class="l-text">Bu derste her olasılık hesabını taşıyan dört kelimeyle tanışacaksın: <em>deney, sonuç, örnek uzay, olay</em>. Olasılıkların neden 0 ile 1 arasında olması gerektiğini göreceksin, olasılığı belirsiz bir hisse değil kesin bir teoriye dönüştüren üç aksiyomu öğreneceksin ve toplama kuralı ile tümleyen kuralını kullanarak elle çözülmesi zor olmayan olasılıkları hesaplayacaksın. Dersin sonunda herhangi bir olasılık problemini okuyup, otomatik olarak sonlu bir örnek uzayda sayma sorusuna çevirebileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir rastgele deneyin <em>örnek uzayını</em> S belirlemeyi ve <em>olayı</em> A &sub; S alt kümesi olarak tanımlamayı</li>
<li>Sonuçlar eşit olasılıklı iken klasik olasılığı $P(A) = |A| / |S|$ ile hesaplamayı</li>
<li>Kolmogorov'un üç aksiyomunu ifade etmeyi ve tümleyen kuralını $P(A') = 1 - P(A)$ kullanmayı</li>
<li>Ortak öğeleri düzelten toplama kuralını uygulamayı: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$</li>
<li>Ayrık (karşılıklı dışlayan) olayları tanımayı ve birleşimlerini doğrudan hesaplamayı</li>
<li>Teorik olasılığı deneysel (frekans) olasılıktan ayırt etmeyi ve büyük sayılar kanununu sade dille açıklamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Rastgele Deney, Sonuç ve Örnek Uzay</h2>

<div class="calc-highlight"><strong>İlk üç kelime.</strong> <em>Deney</em>, sonucu önceden bilinmeyen herhangi bir prosedürdür: para atmak, zar atmak, kart çekmek, bir torbadan isim çekmek. <em>Sonuç</em>, o deneyin olası bir bitiş halidir. <em>Örnek uzay</em>, S ile gösterilir ve tüm olası sonuçların kümesidir.</div>

<p class="l-text">Örnek uzay, her olasılık sorusunun içinde yaşadığı evrendir. Herhangi bir olasılığı hesaplayabilmek için, en azından prensipte, gerçekleşebilecek her sonucu sıralayabilmen gerekir. Eğer örnek uzayın yanlışsa, sonradan hesapladığın her olasılık da yanlış olur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Para atmak</div><div class="card-body">Örnek uzay: $S = \\{Y, T\\}$ (yazı, tura). İki sonuç.</div></div>
<div class="calc-card"><div class="card-title">Zar atmak</div><div class="card-body">Örnek uzay: $S = \\{1, 2, 3, 4, 5, 6\\}$. Altı sonuç.</div></div>
<div class="calc-card"><div class="card-title">Bir kart çekmek</div><div class="card-body">Örnek uzay: 52 kartın hepsi. $|S| = 52$.</div></div>
<div class="calc-card"><div class="card-title">İki para atmak</div><div class="card-body">Örnek uzay: $S = \\{YY, YT, TY, TT\\}$. Dört sonuç.</div></div>
</div>

<div class="l-note"><strong>Sonuç sayısına dikkat.</strong> S'deki sonuç sayısı $|S|$ ile gösterilir. Tek bir zar için $|S|=6$; iki zar için $|S| = 36$ (1. zarın 6 sonucunun her biri 2. zarın 6 sonucundan herhangi biriyle eşleşebilir). $|S|$'yi doğru saymak klasik bir olasılık probleminin yarısıdır.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">"Üç parayı arka arkaya at" deneyi için örnek uzayı yaz. Kaç sonucu var? (Cevap: $S = \\{YYY, YYT, YTY, YTT, TYY, TYT, TTY, TTT\\}$, yani $|S| = 8 = 2^3$.)</div></div>

<h2 class="lesson-title">2. Olaylar Örnek Uzayın Alt Kümeleri Olarak</h2>

<div class="calc-highlight"><strong>Bir olay, gerçekleşebilecek ya da gerçekleşmeyebilecek herhangi bir şeydir — matematiksel olarak, sadece S'nin bir alt kümesidir.</strong> Zarda "çift sayı gel" olayı $A = \\{2, 4, 6\\}$ alt kümesidir. Desteden "kupa çek" olayı 13 kupanın oluşturduğu alt kümedir. S'ye sahip olduğunda, her olay S'den sonuçlar seçilerek inşa edilir.</div>

<div class="calc-formula"><div class="formula-label">OLAY &mdash; TANIM</div><div class="formula-main">$$A \\;\\subseteq\\; S \\qquad\\text{(A olay, S örnek uzay)}$$</div><div class="formula-sub">Bir olay, sonuçların bir topluluğudur. Deneyin sonucu A'ya ait sonuçlardan biriyse "A gerçekleşti" deriz.</div></div>

<p class="l-text">İki özel olay uç noktalarda bulunur. Tüm örnek uzay S, <em>kesin olaydır</em> — ne olursa olsun sonuç S'de yer alır, yani S her zaman gerçekleşir. Boş küme $\\emptyset$ ise <em>imkansız olaydır</em> — hiçbir sonuç içermez, dolayısıyla asla gerçekleşemez.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Zarda "çift"</div><div class="card-body">$A = \\{2, 4, 6\\}$, $|A| = 3$.</div></div>
<div class="calc-card"><div class="card-title">Zarda "4'ten büyük"</div><div class="card-body">$B = \\{5, 6\\}$, $|B| = 2$.</div></div>
<div class="calc-card"><div class="card-title">İki atışta "en az bir yazı"</div><div class="card-body">$C = \\{YY, YT, TY\\}$, $|C| = 3$. TT dışlanır.</div></div>
<div class="calc-card"><div class="card-title">İmkansız olay</div><div class="card-body">$\\emptyset$, boş alt küme. Hiçbir sonuç içermez.</div></div>
</div>

<h2 class="lesson-title">3. Klasik Olasılık: Eşit Olasılıklı Sonuçlar</h2>

<div class="calc-highlight"><strong>S'deki her sonuç eşit olasılıklıysa, bir olayın olasılığı sadece bir sayının başka bir sayıya bölümüdür.</strong> Bu, olasılığın en eski ve en basit tanımıdır; 16. ve 17. yüzyılda Cardano ve Pascal'a kadar uzanır. Hilesiz paralar, hilesiz zarlar ve iyi karıştırılmış desteler için kusursuz çalışır.</div>

<div class="calc-formula"><div class="formula-label">KLASİK OLASILIK</div><div class="formula-main">$$P(A) \\;=\\; \\frac{|A|}{|S|} \\;=\\; \\frac{\\text{A'ya uygun sonuç sayısı}}{\\text{toplam sonuç sayısı}}$$</div><div class="formula-sub">Yalnızca S'deki her sonuç eşit olasılıklıysa geçerlidir. Hileli zar ya da taraflı para için bu formül uygulanmaz.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">Hilesiz bir zarı at. Çift sayı gelme olasılığı nedir?<br><br>Örnek uzay: $S = \\{1,2,3,4,5,6\\}$, $|S| = 6$.<br>Olay: $A = \\{2, 4, 6\\}$, $|A| = 3$.<br>$$P(A) = \\dfrac{3}{6} = \\dfrac{1}{2}.$$<br>Yani çift sayı gelme olasılığı tam olarak yarıdır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">Standart 52'lik desteden bir kart çek. Kupa çıkma olasılığı nedir?<br><br>$|S| = 52$. Kupalar $A$ olayını oluşturur, $|A| = 13$ (13 değer: 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A).<br>$$P(A) = \\dfrac{13}{52} = \\dfrac{1}{4}.$$<br>Destenin dörtte biri kupa olduğu için cevap sezgimizle uyuşur.</div></div>

<div class="calc-graph"><div id="plot-l94-die-tr" class="plotly-graph" style="height:360px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> hilesiz bir zarın altı sonucu, her biri 1/6 olasılıkla. Çubukların hepsi aynı yüksekliğe ulaştığı için zar "düzgün" dağılımlıdır — her yüz eşit olasılıklıdır. Klasik olasılık tam olarak bu resimdir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var dieX=['1','2','3','4','5','6'];
var dieY=[1/6,1/6,1/6,1/6,1/6,1/6];
var bars={x:dieX,y:dieY,type:'bar',name:'P(yüz)',marker:{color:'#3b82f6'},text:['1/6','1/6','1/6','1/6','1/6','1/6'],textposition:'outside',textfont:{color:'#e8e8e8',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Zar yüzü',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'Olasılık',range:[0,0.22],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:55,l:60},showlegend:false};
Plotly.newPlot('plot-l94-die-tr',[bars],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir torbada 5 kırmızı ve 3 mavi bilye vardır. Rastgele bir bilye çekiyorsun. Mavi olma olasılığı nedir? (Cevap: $|S| = 8$, $|A| = 3$, yani $P = 3/8$.)</div></div>

<h2 class="lesson-title">4. Olasılık Aksiyomları</h2>

<div class="calc-highlight"><strong>1933'te Andrey Kolmogorov, olasılık teorisinin tüm teoremlerinin türetilebileceği üç kuralı yazdı.</strong> Bu kurallar net, kısa ve ezberlemeye değer. Bu kursta ve sonrasında hesaplayacağın her olasılık bunlara uyar.</div>

<div class="calc-formula"><div class="formula-label">KOLMOGOROV'UN ÜÇ AKSİYOMU</div><div class="formula-main">$$\\begin{aligned} &\\text{(1) Negatif olmama:} && 0 \\leq P(A) \\leq 1 \\\\ &\\text{(2) Normalleştirme:} && P(S) = 1 \\\\ &\\text{(3) Toplanabilirlik:} && A \\cap B = \\emptyset \\;\\Longrightarrow\\; P(A \\cup B) = P(A) + P(B) \\end{aligned}$$</div><div class="formula-sub">Olasılıklar 0 ile 1 arasındadır; tüm örnek uzayın olasılığı 1'dir; ayrık olaylar toplanır.</div></div>

<p class="l-text"><strong>Aksiyomların sade Türkçesi.</strong> 1. aksiyom olasılıkların asla negatif veya 1'den büyük olmadığını söyler — hiçbir şeyden "eksi yüzde 30 emin" olamazsın, "yüzde 120 emin" de olamazsın. 2. aksiyom <em>bir şeyin</em> mutlaka olması gerektiğini söyler: sonucun S'de olma olasılığı her zaman 1, yani %100'dür. 3. aksiyom ise iki olay aynı anda olamazsa, birinin ya da diğerinin olma olasılığının ayrı ayrı olasılıklarının toplamı olduğunu söyler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. aksiyom resimli</div><div class="card-body">$P = 0$ imkansız demektir. $P = 1$ kesin demektir. Geri kalan her şey bu ikisi arasında yer alır.</div></div>
<div class="calc-card"><div class="card-title">2. aksiyom örneği</div><div class="card-body">Zar attığında 1, 2, 3, 4, 5, 6'dan birini gelme olasılığı tam olarak 1'dir — başka hiçbir şey olamaz.</div></div>
<div class="calc-card"><div class="card-title">3. aksiyom örneği</div><div class="card-body">"1 gelir" ve "2 gelir" tek atışta birlikte gerçekleşemez. Yani $P(1 \\text{ veya } 2) = 1/6 + 1/6 = 2/6 = 1/3$.</div></div>
</div>

<h2 class="lesson-title">5. Tümleyen Kuralı</h2>

<div class="calc-highlight"><strong>Bir A olayının tümleyeni "S içinde A dışındaki her şeydir".</strong> $A'$ ile yazılır ($A^c$ veya $\\bar{A}$ de denir). Eğer A "çift sayı gelir" ise, $A'$ "tek sayı gelir" demektir. A ve $A'$ birlikte tüm örnek uzayı doldurur ve hiç çakışmaz.</div>

<div class="calc-formula"><div class="formula-label">TÜMLEYEN KURALI</div><div class="formula-main">$$P(A') \\;=\\; 1 - P(A)$$</div><div class="formula-sub">Neden geçerli: $A \\cup A' = S$ ve $A \\cap A' = \\emptyset$. 2. ve 3. aksiyomlar nedeniyle $P(A) + P(A') = P(S) = 1$.</div></div>

<p class="l-text"><strong>Niye işe yarar.</strong> Bazen tümleyeni hesaplamak olayın kendisini hesaplamaktan çok daha kolaydır. Klasik bir örnek "en az bir" tipi problemlerdir: "üç atışta en az bir yazı gelme olasılığı" doğrudan saymakla zordur, ama "hiç yazı gelmez" tek bir sonuçtur — TTT — ve olasılığı kolaydır. Bu yüzden:</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Üç hilesiz para at. En az bir yazı gelme olasılığı nedir?<br><br>Doğrudan yaklaşım: $\\{YYY, YYT, YTY, YTT, TYY, TYT, TTY\\}$ — 8 sonuçtan 7'si.<br><br>Tümleyen yaklaşımı: tümleyen "hiç yazı yok", yani TTT, 8 sonuçtan 1'i. O zaman<br>$$P(\\text{en az bir yazı}) = 1 - P(\\text{hiç yazı yok}) = 1 - \\dfrac{1}{8} = \\dfrac{7}{8}.$$<br>Her iki yöntem aynı sonucu verir, ama tümleyen yöntemi 10 paraya, 100 paraya kolayca ölçeklenir.</div></div>

<div class="l-note"><strong>İpucunu fark et.</strong> Bir olasılık sorusunda "en az bir" ya da "en az k" ifadesi geçerse, neredeyse her zaman tümleyen kuralının en temiz yol olduğunu gösteren bir ipucu vardır.</div>

<h2 class="lesson-title">6. Toplama Kuralı (Dahil Etme-Dışlama)</h2>

<div class="calc-highlight"><strong>Peki iki olay <em>birlikte</em> gerçekleşebiliyorsa ne olur?</strong> 3. aksiyom olayların ayrık olduğunu varsayar, ama gerçek hayatta olaylar sık sık örtüşür. Örneğin tek bir kart çekiminde "kupa" ve "resimli kart" (J, Q, K) birlikte gerçekleşebilir (kupa J, kupa Q, kupa K). Bunu ele almak için 3. aksiyomu bir düzeltme terimiyle genişletiriz.</div>

<div class="calc-formula"><div class="formula-label">TOPLAMA KURALI (DAHİL ETME-DIŞLAMA)</div><div class="formula-main">$$P(A \\cup B) \\;=\\; P(A) + P(B) - P(A \\cap B)$$</div><div class="formula-sub">İki olayı topla, sonra örtüşmeyi bir kez çıkar — böylece iki kez sayılmamış olur.</div></div>

<p class="l-text"><strong>Neden çıkarıyoruz.</strong> $P(A)$ ve $P(B)$'yi topladığında, hem A hem de B'de yer alan her sonuç $P(A)$'da bir kez, $P(B)$'de bir kez daha sayılır — toplamda iki kez. Kesişim $A \\cap B$ tam olarak iki kez sayılan o sonuçlardır, bu yüzden fazla saymayı düzeltmek için $P(A \\cap B)$'yi bir kez çıkarırız. Aşağıdaki Venn şeması görsel olarak gösteriyor.</p>

<div class="calc-graph"><div id="plot-l94-venn-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> S örnek uzayı içinde örtüşen iki A ve B olayı. Soldaki hilal yalnızca A'da olan sonuçları, sağdaki hilal yalnızca B'de olan sonuçları, ortadaki mercek bölgesi $A \\cap B$ ise her ikisinde de olan sonuçları içerir. $|A|$ ve $|B|$'yi toplamak orta bölgeyi iki kez saydığı için, bir kez çıkarırız.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var c1xT=[];var c1yT=[];var c2xT=[];var c2yT=[];
for(var i=0;i<=120;i++){var a=2*Math.PI*i/120;c1xT.push(-0.6+1.0*Math.cos(a));c1yT.push(1.0*Math.sin(a));c2xT.push(0.6+1.0*Math.cos(a));c2yT.push(1.0*Math.sin(a));}
var rectXT=[-2.2,2.2,2.2,-2.2,-2.2];var rectYT=[-1.4,-1.4,1.4,1.4,-1.4];
var boxT={x:rectXT,y:rectYT,mode:'lines',name:'S',line:{color:'rgba(255,255,255,0.35)',width:1.5},fill:'toself',fillcolor:'rgba(255,255,255,0.02)'};
var circAT={x:c1xT,y:c1yT,mode:'lines',name:'A',line:{color:'#3b82f6',width:2.4},fill:'toself',fillcolor:'rgba(59,130,246,0.18)'};
var circBT={x:c2xT,y:c2yT,mode:'lines',name:'B',line:{color:'#10b981',width:2.4},fill:'toself',fillcolor:'rgba(16,185,129,0.18)'};
var labsT={x:[-1.55,1.55,0,-2.0,0],y:[0,0,0,1.2,-1.6],mode:'text',name:'etiket',text:['<b>yalnız A</b>','<b>yalnız B</b>','<b>A &cap; B</b>','<b>S</b>','A ve B dışı'],textfont:{color:['#3b82f6','#10b981','#f59e0b','#e8e8e8','rgba(235,230,220,0.7)'],size:13},showlegend:false};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-2.4,2.4],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'y',scaleratio:1},yaxis:{range:[-1.8,1.5],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:30,l:30},showlegend:false};
Plotly.newPlot('plot-l94-venn-tr',[boxT,circAT,circBT,labsT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">52'lik desteden bir kart çek. Kartın maça veya resimli kart (J, Q, K) olma olasılığı nedir?<br><br>$A$ = "maça", $B$ = "resimli kart" olsun.<br>$P(A) = 13/52 = 1/4$ (13 maça).<br>$P(B) = 12/52 = 3/13$ (4 vale + 4 kız + 4 papaz).<br>$P(A \\cap B) = 3/52$ (maça vale, kız, papaz — her ikisi de olan üç kart).<br>$$P(A \\cup B) = \\dfrac{13}{52} + \\dfrac{12}{52} - \\dfrac{3}{52} = \\dfrac{22}{52} = \\dfrac{11}{26}.$$<br>Yaklaşık %42 — tüm kartların yarısından biraz az.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">Hilesiz bir zar at. $A$ = "çift" ve $B$ = "3'ten büyük" olsun. $P(A \\cup B)$'yi bul.<br><br>$A = \\{2, 4, 6\\}$, $P(A) = 3/6$.<br>$B = \\{4, 5, 6\\}$, $P(B) = 3/6$.<br>$A \\cap B = \\{4, 6\\}$, $P(A \\cap B) = 2/6$.<br>$$P(A \\cup B) = \\dfrac{3}{6} + \\dfrac{3}{6} - \\dfrac{2}{6} = \\dfrac{4}{6} = \\dfrac{2}{3}.$$<br>Doğrulama: $A \\cup B = \\{2, 4, 5, 6\\}$, yani 6 sonuçtan 4'ü — aynı cevap.</div></div>

<h2 class="lesson-title">7. Ayrık (Karşılıklı Dışlayan) Olaylar</h2>

<div class="calc-highlight"><strong>İki olay aynı denemede birlikte gerçekleşemiyorsa karşılıklı dışlayan — ya da ayrık — olaylardır.</strong> Küme diliyle: $A \\cap B = \\emptyset$. Bu durumda kesişimin olasılığı 0 olur ve dahil etme-dışlama kuralı daha basit toplama aksiyomuna dönüşür.</div>

<div class="calc-formula"><div class="formula-label">AYRIK OLAYLAR</div><div class="formula-main">$$A \\cap B = \\emptyset \\;\\Longrightarrow\\; P(A \\cup B) = P(A) + P(B)$$</div><div class="formula-sub">Çıkarılacak örtüşme yok. Genel dahil etme-dışlama kuralı saf toplamaya indirgenir.</div></div>

<p class="l-text"><strong>Ayrık olay örnekleri.</strong> Tek bir zar atışında "1 gelir" ve "6 gelir" ayrıktır (tek atışta her iki yüz birden gelemez). Tek bir kart çekiminde "kupa" ve "maça" ayrıktır (her kartın tek bir simgesi vardır). "Bu öğrenci 9. sınıfta" ve "bu öğrenci 10. sınıfta" da ayrıktır.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir torbada 4 kırmızı, 3 yeşil ve 5 mavi bilye vardır. Bir bilye seçiliyor. Kırmızı veya yeşil olma olasılığı nedir?<br><br>"Kırmızı" ve "yeşil" ayrıktır (bilyenin tek bir rengi vardır).<br>$P(\\text{kırmızı}) = 4/12 = 1/3$, $P(\\text{yeşil}) = 3/12 = 1/4$.<br>$$P(\\text{kırmızı veya yeşil}) = \\dfrac{4}{12} + \\dfrac{3}{12} = \\dfrac{7}{12}.$$<br>Eşdeğer olarak, tümleyen (mavi) $5/12$'dir ve $1 - 5/12 = 7/12$. İki yol da uyuşur.</div></div>

<h2 class="lesson-title">8. Deneysel Olasılık ve Uzun Vadede Davranış</h2>

<div class="calc-highlight"><strong>Klasik olasılık sonuçların eşit olasılıklı olduğunu varsayar. Peki değilse?</strong> Bir parayı bükersen daha sık yazı gelir, eşit olasılık formülü çalışmaz. Çözüm olasılığı hesaplamak yerine <em>gözlemlemektir</em> — buna deneysel ya da frekans yaklaşımı denir.</div>

<div class="calc-formula"><div class="formula-label">DENEYSEL (FREKANS) OLASILIĞI</div><div class="formula-main">$$P(A) \\;\\approx\\; \\frac{\\text{A'nın gerçekleştiği deneme sayısı}}{\\text{toplam deneme sayısı}}$$</div><div class="formula-sub">Uzun vadeli bir tahmin. Ne kadar çok deneme yaparsan, bağıl frekans gerçek olasılığa o kadar yaklaşır.</div></div>

<p class="l-text"><strong>Büyük Sayılar Kanunu</strong>, deneme sayısı arttıkça bir olayın bağıl frekansının gerçek olasılığına yaklaştığını söyler. Hilesiz bir parayı 10 kez at — 7 yazı görebilirsin (frekans 0.7). 1000 kez at — 500'e yakın bir şey görmen neredeyse kesindir (frekans 0.5 civarında). 1.000.000 kez at — frekans 0.5'ten ayırt edilemez. Başlangıçtaki "gürültülü" oranlar, örneklem büyüdükçe teorik olasılığa oturur.</p>

<div class="l-note"><strong>İki bakış uyuşması gereken yerde uyuşur.</strong> Hilesiz bir para için klasik cevap tam olarak $1/2$ ve deneysel cevap da (limitte) $1/2$'dir. Klasik olasılık, simetri sayesinde deneye gerek kalmadan hesaplanabilen, frekans olasılığının özel bir durumudur.</div>

<h2 class="lesson-title">9. Ağaç Diyagramları: Çok Aşamalı Deneyleri Görselleştirme</h2>

<div class="calc-highlight"><strong>Bir ağaç diyagramı, çok aşamalı bir deneyin tüm olası sonuçlarını dallanan bir yol olarak gösterir.</strong> Ağacın her seviyesi bir aşamaya, her dal o aşamadaki bir sonuca karşılık gelir. Ağaçlar, iki veya daha fazla aşamalı örnek uzayları düzenlemek için en temiz araçtır ve 95. dersteki koşullu olasılığa zemin hazırlar.</div>

<p class="l-text">Şu deneyi düşün: arka arkaya iki hilesiz para at. 1. aşamada iki dal var (Y, T). Bunların her birinden 2. aşamada yine (Y, T) ikilisine dallanır. Ağacın yapraklarını yukarıdan aşağıya okuyunca dört sonucu elde ederiz: YY, YT, TY, TT — tam olarak 1. bölümde yazdığımız örnek uzay.</p>

<div class="calc-graph"><div id="plot-l94-tree-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> iki hilesiz para atışı için iki aşamalı bir ağaç. Soldaki kök Y ve T'ye ayrılır (1. atış); her biri tekrar Y ve T'ye dallanır (2. atış). Sağdaki dört yaprak örnek uzayı $S = \\{YY, YT, TY, TT\\}$ olarak listeler, her biri 1/4 olasılıkla.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var edgesT={x:[0,1,null,0,1,null,1,2,null,1,2,null,1,2,null,1,2,null],y:[0,1,null,0,-1,null,1,1.6,null,1,0.4,null,-1,-0.4,null,-1,-1.6,null],mode:'lines',name:'ağaç',line:{color:'rgba(255,255,255,0.45)',width:1.6}};
var nodesT={x:[0,1,1,2,2,2,2],y:[0,1,-1,1.6,0.4,-0.4,-1.6],mode:'markers+text',name:'düğüm',marker:{color:'#3b82f6',size:14},text:['başla','Y','T','YY','YT','TY','TT'],textposition:'top center',textfont:{color:'#e8e8e8',size:12},showlegend:false};
var probsT={x:[0.5,0.5,1.5,1.5,1.5,1.5],y:[0.6,-0.6,1.4,0.8,-0.8,-1.4],mode:'text',name:'p',text:['1/2','1/2','1/2','1/2','1/2','1/2'],textfont:{color:'#f59e0b',size:11},showlegend:false};
var leavesT={x:[2.7,2.7,2.7,2.7],y:[1.6,0.4,-0.4,-1.6],mode:'text',name:'P',text:['P=1/4','P=1/4','P=1/4','P=1/4'],textfont:{color:'#10b981',size:12},showlegend:false};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.4,3.3],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-2.1,2.1],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l94-tree-tr',[edgesT,nodesT,probsT,leavesT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>İleriye bakış.</strong> 95. derste ağacın dallarına <em>koşullu</em> olasılıklar ekleyeceğiz ve ağacı şu tür hesaplamalar için kullanacağız: "ilk atışın yazı geldiği bilindiğine göre toplamda iki yazı gelme olasılığı nedir?". Şimdilik resmi özümsemen yeterli: her çok aşamalı örnek uzayın doğal bir ağaç gösterimi vardır.</div>

<h2 class="lesson-title">10. Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Örtüşmeyi çıkarmayı unutmak</div><div class="card-body">A ve B birlikte gerçekleşebiliyorken $P(A \\cup B) = P(A) + P(B)$ yazmak. Bu kesişimi iki kez sayar. Her zaman kontrol et: olaylar ayrık mı? Değilse $P(A \\cap B)$'yi çıkar.</div></div>
<div class="calc-card"><div class="card-title">Yanlış örnek uzay</div><div class="card-body">İki para için bazen $S = \\{0 Y, 1 Y, 2 Y\\}$ — üç sonuç — yazılır ve $P(\\text{bir yazı}) = 1/3$ sonucuna varılır. Yanlış: doğru örnek uzayda 4 eşit olasılıklı sonuç vardır ve $P(\\text{tam bir yazı}) = 2/4 = 1/2$'dir.</div></div>
<div class="calc-card"><div class="card-title">Kontrol etmeden "eşit olasılıklı" varsaymak</div><div class="card-body">Hileli bir zar, taraflı bir para ya da karıştırılmamış bir kart yığını — klasik formül burada çalışmaz. Sadece saymak değil, veri gerekir.</div></div>
<div class="calc-card"><div class="card-title">Negatif ya da 1'den büyük cevaplar</div><div class="card-body">Bir hesap $P < 0$ ya da $P > 1$ veriyorsa, bir hata vardır. Olasılıklar $[0, 1]$ aralığında yaşar.</div></div>
</div>

<h2 class="lesson-title">11. Çözümlü Problemler</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — ZAR</div><div class="example-body"><strong>Hilesiz bir zar at. 5'ten küçük bir sayı gelme olasılığı nedir?</strong><br><br>$S = \\{1,2,3,4,5,6\\}$, $A = \\{1,2,3,4\\}$, $|A| = 4$.<br>$$P(A) = \\dfrac{4}{6} = \\dfrac{2}{3}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — KART</div><div class="example-body"><strong>Bir kart çek. Papaz veya kupa olma olasılığı nedir?</strong><br><br>$P(\\text{papaz}) = 4/52$, $P(\\text{kupa}) = 13/52$, $P(\\text{kupa papazı}) = 1/52$.<br>$$P(\\text{papaz veya kupa}) = \\dfrac{4}{52} + \\dfrac{13}{52} - \\dfrac{1}{52} = \\dfrac{16}{52} = \\dfrac{4}{13}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — TÜMLEYEN</div><div class="example-body"><strong>Dört hilesiz para at. En az bir tura gelme olasılığı nedir?</strong><br><br>Tümleyen: "hiç tura yok", yani YYYY. $P(\\text{hiç tura yok}) = 1/16$.<br>$$P(\\text{en az bir tura}) = 1 - \\dfrac{1}{16} = \\dfrac{15}{16}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — İKİ PARA</div><div class="example-body"><strong>İki hilesiz para at. Tam olarak bir yazı gelme olasılığı nedir?</strong><br><br>$S = \\{YY, YT, TY, TT\\}$, $A = \\{YT, TY\\}$.<br>$$P(A) = \\dfrac{2}{4} = \\dfrac{1}{2}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — VENN DİYAGRAMI</div><div class="example-body"><strong>30 öğrencilik bir sınıfta 18 öğrenci İngilizce, 14 öğrenci Fransızca ve 8 öğrenci her ikisini birden öğreniyor. Rastgele seçilen bir öğrencinin İngilizce veya Fransızca öğrenme olasılığı nedir?</strong><br><br>$P(I) = 18/30$, $P(F) = 14/30$, $P(I \\cap F) = 8/30$.<br>$$P(I \\cup F) = \\dfrac{18}{30} + \\dfrac{14}{30} - \\dfrac{8}{30} = \\dfrac{24}{30} = \\dfrac{4}{5}.$$<br>Yani 30 öğrenciden 24'ü en az bir dili öğreniyor; 6'sı hiçbirini öğrenmiyor.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — AYRIK</div><div class="example-body"><strong>Bir torbada 6 kırmızı, 4 sarı ve 10 yeşil bilye vardır. Kırmızı veya sarı bilye çekme olasılığı nedir?</strong><br><br>Kırmızı ve sarı ayrıktır.<br>$$P(\\text{kırmızı veya sarı}) = \\dfrac{6}{20} + \\dfrac{4}{20} = \\dfrac{10}{20} = \\dfrac{1}{2}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — İKİ ZAR</div><div class="example-body"><strong>İki hilesiz zar at. Toplamın 7 olma olasılığı nedir?</strong><br><br>$|S| = 36$. Toplam 7 olan: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$ — 6 sonuç.<br>$$P(\\text{toplam}=7) = \\dfrac{6}{36} = \\dfrac{1}{6}.$$<br>İki zar için tek bir toplam değeri olarak en olası olan değer budur.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — DENEYSEL TAHMİN</div><div class="example-body"><strong>Bir para 200 kez atılır ve 112 kez yazı gelir. Bu paranın yazı gelme olasılığını tahmin et.</strong><br><br>Deneysel olasılık: $112/200 = 0.56$. Bu değer $0.5$'in belirgin şekilde üzerinde olduğu için para taraflı olabilir — ama yalnızca 200 deneyle emin olamayız. Daha fazla denemeyle tahmin keskinleşir.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Örnek uzay S = tüm olası sonuçların kümesi. Bir A olayı, S'nin bir alt kümesidir.</li>
<li>Klasik olasılık: tüm sonuçlar eşit olasılıklıyken $P(A) = |A|/|S|$.</li>
<li>Üç aksiyom: $0 \\leq P(A) \\leq 1$, $P(S) = 1$, ayrık olaylar toplanır.</li>
<li>Tümleyen kuralı: $P(A') = 1 - P(A)$ — "en az bir" tipi problemler için faydalı.</li>
<li>Toplama kuralı: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$, kesişimi çıkararak iki kez saymaktan kaçınılır.</li>
<li>Karşılıklı dışlayan olaylar için $A \\cap B = \\emptyset$ olduğundan toplama kuralı saf toplamaya indirgenir.</li>
<li>Deneysel olasılık bağıl frekanstır; Büyük Sayılar Kanunu sayesinde deneme sayısı arttıkça teorik olasılığa yaklaşır.</li>
<li>Ağaç diyagramları çok aşamalı deneyleri düzenler ve 95. derste koşullu olasılığa zemin hazırlar.</li>
</ul>
</div>`

};
