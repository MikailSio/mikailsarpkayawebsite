window.LISE_MAT_L96 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Conditional probability is what happens when you learn something new mid-way through an experiment.</strong> You start out with a probability for some event — say, the probability that a randomly chosen person has a particular disease — and then a piece of information arrives that changes the picture. Maybe a medical test came back positive. Maybe a witness reported seeing a red car. Maybe the first card drawn from the deck turned out to be an ace. In each case the original probability is no longer the right number; you must <em>update</em> it to reflect the new information. The mathematics of that update is conditional probability.</p>

<p class="l-text">In this lesson you will meet a single formula, $P(A \\mid B) = P(A \\cap B) / P(B)$, and watch it unlock a long list of real problems: card draws without replacement, urn problems, two-stage experiments laid out on trees, and the famous medical-test problem in which a 95%-accurate test can still be wrong more often than it is right. You will also see exactly what it means for two events to be "independent" — independence is just the special case where conditioning on B does not change the probability of A.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define conditional probability via $P(A \\mid B) = P(A \\cap B) / P(B)$ and interpret it as "the probability of A in the new reduced sample space where B is known to have occurred"</li>
<li>Use the multiplication rule $P(A \\cap B) = P(B) \\cdot P(A \\mid B)$ to compute joint probabilities</li>
<li>Apply the law of total probability $P(A) = P(A \\mid B) P(B) + P(A \\mid B') P(B')$ to split a probability over a partition</li>
<li>Lay out two-stage experiments as trees with conditional probabilities on the branches, and multiply along a path</li>
<li>Recognise independence as the condition $P(A \\mid B) = P(A)$ and use it to simplify joint probabilities</li>
<li>Solve the medical-test problem: given prevalence, sensitivity and specificity, compute $P(\\text{disease} \\mid \\text{positive})$ directly</li>
</ul>
</div>

<h2 class="lesson-title">1. The Idea: New Information Reshapes the Sample Space</h2>

<div class="calc-highlight"><strong>Think of probability as a fraction of "what could happen".</strong> Originally the denominator is the whole sample space S. But the moment you learn that some event B has occurred, the universe of possibilities shrinks: only the outcomes inside B are still in play. Every probability you compute from that point on uses B — not S — as the new denominator. That is conditional probability in one sentence.</div>

<p class="l-text">Concrete example. Roll a fair die. Before any information, the sample space is $S = \\{1, 2, 3, 4, 5, 6\\}$ and the probability of rolling a 4 is $1/6$. Now suppose somebody peeks at the die and tells you "the outcome is even". The set of outcomes still in play is now only $B = \\{2, 4, 6\\}$ — three outcomes, all equally likely. Of those three, exactly one is a 4. So given the new information, the probability of having rolled a 4 is $1/3$, not $1/6$.</p>

<div class="calc-formula"><div class="formula-label">CONDITIONAL PROBABILITY &mdash; DEFINITION</div><div class="formula-main">$$P(A \\mid B) \\;=\\; \\frac{P(A \\cap B)}{P(B)}, \\qquad\\text{provided } P(B) > 0.$$</div><div class="formula-sub">Read aloud: "the probability of A given B". The vertical bar means "given that". P(B) must be positive — you cannot condition on an event of probability zero.</div></div>

<p class="l-text">Why does the formula take this exact shape? Inside the reduced sample space B, the event "A also occurred" corresponds to the outcomes that are in both A and B — i.e. the intersection $A \\cap B$. To get a probability we divide that by the total weight of the new sample space, which is $P(B)$. So conditional probability is just the relative weight of $A \\cap B$ inside B.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Old picture</div><div class="card-body">Whole sample space S. Probability of A is $P(A) = |A|/|S|$ (for equally likely outcomes).</div></div>
<div class="calc-card"><div class="card-title">New picture after learning B</div><div class="card-body">Reduced sample space B. Probability of A becomes $P(A \\mid B) = |A \\cap B|/|B|$.</div></div>
<div class="calc-card"><div class="card-title">Vocabulary</div><div class="card-body">B is called the "conditioning event" or the "given event". A is called the "target event".</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Roll a fair die. Given that the outcome is greater than 3, what is the probability that the outcome is exactly 5? (Reduced sample space $B = \\{4, 5, 6\\}$ has 3 outcomes; exactly one is a 5; answer $1/3$.)</div></div>

<h2 class="lesson-title">2. A Geometric View: Ratio of Areas Inside B</h2>

<div class="calc-highlight"><strong>Picture the sample space as a rectangle of total area 1.</strong> Events A and B are regions inside that rectangle, possibly overlapping. The intersection $A \\cap B$ is the lens-shaped region where they overlap. Conditional probability $P(A \\mid B)$ is the area of $A \\cap B$ divided by the area of B — the fraction of B that also lies inside A.</div>

<div class="calc-graph"><div id="plot-l96-venn-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two overlapping events A and B inside the sample space S. The shaded lens is the intersection $A \\cap B$. Conditioning on B means "zoom in on the B circle and ignore everything outside it"; inside that smaller world, A occupies exactly the lens. So $P(A \\mid B) = \\text{area}(A \\cap B) / \\text{area}(B)$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var c1x=[];var c1y=[];var c2x=[];var c2y=[];
for(var i=0;i<=160;i++){var a=2*Math.PI*i/160;c1x.push(-0.55+1.0*Math.cos(a));c1y.push(1.0*Math.sin(a));c2x.push(0.55+1.0*Math.cos(a));c2y.push(1.0*Math.sin(a));}
var rectX=[-2.2,2.2,2.2,-2.2,-2.2];var rectY=[-1.4,-1.4,1.4,1.4,-1.4];
var box={x:rectX,y:rectY,mode:'lines',name:'S',line:{color:'rgba(255,255,255,0.35)',width:1.5},fill:'toself',fillcolor:'rgba(255,255,255,0.02)'};
var circA={x:c1x,y:c1y,mode:'lines',name:'A',line:{color:'#3b82f6',width:2.2},fill:'toself',fillcolor:'rgba(59,130,246,0.12)'};
var circB={x:c2x,y:c2y,mode:'lines',name:'B',line:{color:'#10b981',width:2.2},fill:'toself',fillcolor:'rgba(16,185,129,0.18)'};
var lensX=[];var lensY=[];
for(var i=0;i<=80;i++){var a=Math.PI/3-2*Math.PI/3*i/80;lensX.push(-0.55+1.0*Math.cos(a));lensY.push(1.0*Math.sin(a));}
for(var i=0;i<=80;i++){var a=Math.PI+Math.PI/3-2*Math.PI/3*i/80;lensX.push(0.55+1.0*Math.cos(a));lensY.push(1.0*Math.sin(a));}
var lens={x:lensX,y:lensY,mode:'lines',name:'A and B',line:{color:'#f59e0b',width:0.5},fill:'toself',fillcolor:'rgba(245,158,11,0.45)'};
var labs={x:[-1.45,1.45,0,-2.0,0,0.95],y:[0,0,0,1.2,-1.65,0.65],mode:'text',name:'labels',text:['<b>A only</b>','<b>B only</b>','<b>A &cap; B</b>','<b>S</b>','outside A and B','zoom into B'],textfont:{color:['#3b82f6','#10b981','#f59e0b','#e8e8e8','rgba(235,230,220,0.7)','rgba(16,185,129,0.95)'],size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-2.4,2.4],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'y',scaleratio:1},yaxis:{range:[-1.9,1.5],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:30,l:30},showlegend:false};
Plotly.newPlot('plot-l96-venn-en',[box,circA,circB,lens,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Two ways of reading the formula.</strong> The first reading is "ratio of areas": $P(A \\mid B)$ is the slice of B that also lies in A. The second reading is "renormalised probability": you take $P(A \\cap B)$ — a number between 0 and $P(B)$ — and divide by $P(B)$ to scale it up to a probability that lives in $[0, 1]$ relative to the new universe. Both readings give the same number; both are useful.</p>

<div class="l-note"><strong>Sanity checks.</strong> If $A \\subseteq B$, then $A \\cap B = A$, so $P(A \\mid B) = P(A)/P(B)$. If A and B are disjoint, $A \\cap B = \\emptyset$, so $P(A \\mid B) = 0$. If $A = B$, then $P(A \\mid B) = P(B)/P(B) = 1$.</div>

<h2 class="lesson-title">3. The Multiplication Rule</h2>

<div class="calc-highlight"><strong>Rearrange the definition.</strong> Multiplying both sides of $P(A \\mid B) = P(A \\cap B) / P(B)$ by $P(B)$ gives a formula for the joint probability $P(A \\cap B)$ in terms of a conditional probability. This is the rule that powers every tree-diagram calculation.</div>

<div class="calc-formula"><div class="formula-label">MULTIPLICATION RULE</div><div class="formula-main">$$P(A \\cap B) \\;=\\; P(B) \\cdot P(A \\mid B) \\;=\\; P(A) \\cdot P(B \\mid A)$$</div><div class="formula-sub">The joint probability of A and B both happening is the probability of the first event times the conditional probability of the second given the first. Either order works.</div></div>

<p class="l-text"><strong>How it gets used.</strong> Most multi-stage problems are easiest to handle by walking through the stages in order and multiplying conditional probabilities along the way. "First draw an ace, then draw an ace again" is $P(\\text{ace}_1) \\cdot P(\\text{ace}_2 \\mid \\text{ace}_1)$, which is $(4/52) \\cdot (3/51)$ for a deck drawn without replacement.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 &mdash; TWO CARDS</div><div class="example-body">Draw two cards from a standard 52-card deck without replacement. What is the probability that both are aces?<br><br>Let $A_1$ = "first card is an ace", $A_2$ = "second card is an ace".<br>$P(A_1) = 4/52 = 1/13$.<br>Given the first card was an ace, only 3 aces remain in a 51-card deck, so $P(A_2 \\mid A_1) = 3/51 = 1/17$.<br>$$P(A_1 \\cap A_2) = \\dfrac{1}{13} \\cdot \\dfrac{1}{17} = \\dfrac{1}{221} \\approx 0.0045.$$<br>So just under half a percent — drawing two aces in a row is rare.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; URN</div><div class="example-body">An urn contains 5 red and 3 blue balls. Two balls are drawn without replacement. Find the probability that the second ball is blue, given that the first ball was red.<br><br>If the first ball was red, the urn now has 4 red and 3 blue, total 7. So<br>$$P(B_2 \\mid R_1) = \\dfrac{3}{7}.$$<br>Without conditioning, $P(B_2) = 3/8$. Knowing that the first ball was red has actually <em>increased</em> the chance the second is blue (from $3/8 = 0.375$ to $3/7 \\approx 0.429$).</div></div>

<h2 class="lesson-title">4. Tree Diagrams for Conditional Probability</h2>

<div class="calc-highlight"><strong>Tree diagrams turn multi-stage experiments into a calculation you can do by hand.</strong> Each branch from a parent node to a child node is labelled with the <em>conditional</em> probability of that child given everything that came before. To find the probability of any leaf, multiply the probabilities along the unique path from the root to that leaf. To find the probability of an event spread across several leaves, multiply along each path and add.</div>

<p class="l-text">Consider a two-stage urn problem. An urn has 5 red and 3 blue balls. Draw two balls in succession <em>without</em> replacement. The first draw splits into two branches — Red with probability $5/8$ and Blue with probability $3/8$. From the Red branch the second draw splits into Red (now $4/7$) and Blue (now $3/7$), because one red ball is missing. From the Blue branch the second draw splits into Red ($5/7$) and Blue ($2/7$). The four leaves give probabilities $5/8 \\cdot 4/7$, $5/8 \\cdot 3/7$, $3/8 \\cdot 5/7$, $3/8 \\cdot 2/7$. These must add to 1 — and they do.</p>

<div class="calc-graph"><div id="plot-l96-tree-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a tree for the two-stage urn problem with 5 red and 3 blue balls drawn without replacement. Each branch is labelled with its conditional probability; each leaf is labelled with the joint probability obtained by multiplying along the path. The four leaf probabilities sum to 1.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var edges={x:[0,1,null,0,1,null,1,2,null,1,2,null,1,2,null,1,2,null],y:[0,1.3,null,0,-1.3,null,1.3,2.0,null,1.3,0.6,null,-1.3,-0.6,null,-1.3,-2.0,null],mode:'lines',name:'tree',line:{color:'rgba(255,255,255,0.45)',width:1.6}};
var nodes={x:[0,1,1,2,2,2,2],y:[0,1.3,-1.3,2.0,0.6,-0.6,-2.0],mode:'markers+text',name:'nodes',marker:{color:'#3b82f6',size:14},text:['start','R1','B1','R2','B2','R2','B2'],textposition:'top center',textfont:{color:'#e8e8e8',size:13},showlegend:false};
var branchLabels={x:[0.5,0.5,1.5,1.5,1.5,1.5],y:[0.85,-0.85,1.78,0.85,-0.85,-1.78],mode:'text',name:'p',text:['5/8','3/8','4/7','3/7','5/7','2/7'],textfont:{color:'#f59e0b',size:13},showlegend:false};
var leaves={x:[2.95,2.95,2.95,2.95],y:[2.0,0.6,-0.6,-2.0],mode:'text',name:'P',text:['P=20/56','P=15/56','P=15/56','P=6/56'],textfont:{color:'#10b981',size:12},showlegend:false};
var pathLabels={x:[3.7,3.7,3.7,3.7],y:[2.0,0.6,-0.6,-2.0],mode:'text',name:'tag',text:['RR','RB','BR','BB'],textfont:{color:'rgba(235,230,220,0.75)',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.4,4.2],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-2.5,2.5],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l96-tree-en',[edges,nodes,branchLabels,leaves,pathLabels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; USING THE TREE</div><div class="example-body">From the tree above, what is the probability that both balls drawn are the same colour?<br><br>"Same colour" is RR or BB. The two leaf probabilities are<br>$P(RR) = 20/56$ and $P(BB) = 6/56$.<br>$$P(\\text{same colour}) = \\dfrac{20}{56} + \\dfrac{6}{56} = \\dfrac{26}{56} = \\dfrac{13}{28} \\approx 0.464.$$</div></div>

<div class="l-note"><strong>Why trees work.</strong> Each path from root to leaf corresponds to one specific sequence of stage outcomes. The multiplication rule, applied repeatedly along the path, gives the joint probability of that whole sequence. Adding leaf probabilities is just the addition axiom for disjoint events — different leaves describe different sequences and cannot happen at the same time.</div>

<h2 class="lesson-title">5. The Law of Total Probability</h2>

<div class="calc-highlight"><strong>Suppose B is some event that either happens or does not happen.</strong> Then any other event A can be split into "A and B both happened" or "A happened while B did not". These two cases are disjoint and together cover every way A can occur. Adding their probabilities gives a formula for $P(A)$ that is often much easier than computing $P(A)$ directly.</div>

<div class="calc-formula"><div class="formula-label">LAW OF TOTAL PROBABILITY (TWO CASES)</div><div class="formula-main">$$P(A) \\;=\\; P(A \\mid B) \\cdot P(B) \\;+\\; P(A \\mid B') \\cdot P(B')$$</div><div class="formula-sub">Split A by whether B happened or not, then weight each piece by the probability of its case.</div></div>

<p class="l-text"><strong>More generally,</strong> if $B_1, B_2, \\ldots, B_k$ is a partition of S (disjoint events that together cover everything), then:</p>

<div class="calc-formula"><div class="formula-label">LAW OF TOTAL PROBABILITY (PARTITION)</div><div class="formula-main">$$P(A) \\;=\\; \\sum_{i=1}^{k} P(A \\mid B_i) \\cdot P(B_i)$$</div><div class="formula-sub">Same idea, k pieces instead of 2. Each $B_i$ is one of the mutually exclusive cases that B could be in.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; TWO MACHINES</div><div class="example-body">A factory has two machines. Machine 1 produces 60% of the items and 3% of its items are defective. Machine 2 produces 40% and 5% are defective. Pick a random item. What is the probability it is defective?<br><br>Let $D$ = "defective", $M_1, M_2$ = "made by machine 1, 2".<br>$$P(D) = P(D \\mid M_1) P(M_1) + P(D \\mid M_2) P(M_2)$$<br>$$= 0.03 \\cdot 0.6 + 0.05 \\cdot 0.4 = 0.018 + 0.020 = 0.038 = 3.8\\%.$$<br>Roughly 4 of every 100 items is defective.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">In the factory above, of the defective items, what fraction came from machine 1? (This is asking $P(M_1 \\mid D)$ — by the definition, $P(M_1 \\cap D) / P(D) = 0.018 / 0.038 \\approx 0.474$, about 47%.)</div></div>

<h2 class="lesson-title">6. Independence Revisited</h2>

<div class="calc-highlight"><strong>Two events are independent if knowing one happened does not change the probability of the other.</strong> Formally: A and B are independent if and only if $P(A \\mid B) = P(A)$. Equivalently, $P(A \\cap B) = P(A) \\cdot P(B)$. Independence is exactly the case where conditional probability collapses back to the original (unconditional) probability.</div>

<div class="calc-formula"><div class="formula-label">INDEPENDENCE &mdash; THREE EQUIVALENT FORMS</div><div class="formula-main">$$P(A \\mid B) = P(A) \\quad\\Longleftrightarrow\\quad P(B \\mid A) = P(B) \\quad\\Longleftrightarrow\\quad P(A \\cap B) = P(A) \\cdot P(B)$$</div><div class="formula-sub">Any one of these implies the other two. Most textbooks take the rightmost as the definition because it is symmetric in A and B.</div></div>

<p class="l-text"><strong>Examples of independent events.</strong> Toss a coin twice: the first and second tosses are independent because the coin has no memory. Roll two separate dice: the outcome of die 1 is independent of die 2. Draw a card, replace it and shuffle, then draw again: the two draws are independent because replacement restores the deck.</p>

<p class="l-text"><strong>Examples of dependent events.</strong> Draw two cards <em>without</em> replacement: knowing the first card removes it from the second draw's pool, so the two events are dependent. The weather today and tomorrow are dependent (a rainy day is followed by another rainy day more often than chance would suggest). The grades a student gets in algebra and geometry are dependent (a strong student tends to be strong in both).</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; INDEPENDENT COINS</div><div class="example-body">Toss a fair coin twice. Let $H_1$ = "first toss is heads", $H_2$ = "second toss is heads". Show that $H_1$ and $H_2$ are independent and compute $P(H_1 \\cap H_2)$.<br><br>$P(H_1) = 1/2$, $P(H_2) = 1/2$. After observing $H_1$ the second toss is still a fresh fair coin, so $P(H_2 \\mid H_1) = 1/2 = P(H_2)$. So $H_1, H_2$ are independent.<br>$$P(H_1 \\cap H_2) = \\dfrac{1}{2} \\cdot \\dfrac{1}{2} = \\dfrac{1}{4}.$$<br>Equivalently, $S = \\{HH, HT, TH, TT\\}$ and $|H_1 \\cap H_2| = 1$.</div></div>

<div class="l-note"><strong>Independence is NOT the same as "mutually exclusive".</strong> Two events that cannot happen together are <em>highly</em> dependent — knowing one happened tells you the other did not. If A and B are disjoint with $P(A), P(B) > 0$, then $P(A \\mid B) = 0 \\ne P(A)$, so they are dependent. Beginners often confuse the two; do not.</div>

<h2 class="lesson-title">7. Conditioning Shifts the Probability</h2>

<div class="calc-highlight"><strong>The whole point of conditional probability is that learning B happened can change what you know about A.</strong> The change can go either way: conditioning on B can raise the probability of A, lower it, or leave it unchanged (the independent case). Let us look at all three cases side by side with a single example.</div>

<p class="l-text">Roll a fair die. Compare three probabilities:</p>

<ul class="l-list">
<li>$P(\\text{outcome is 4}) = 1/6 \\approx 0.167$ — no conditioning.</li>
<li>$P(\\text{outcome is 4} \\mid \\text{outcome is even}) = 1/3 \\approx 0.333$ — conditioning on "even" raises the probability (the new sample space has only 3 outcomes, one of which is 4).</li>
<li>$P(\\text{outcome is 4} \\mid \\text{outcome is odd}) = 0$ — conditioning on "odd" drops it to zero (4 cannot be odd).</li>
</ul>

<div class="calc-graph"><div id="plot-l96-shift-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same target event "die shows 4" under three different conditioning scenarios. With no condition the probability is $1/6$. Given the outcome is even, it jumps to $1/3$. Given the outcome is odd, it collapses to 0. Conditioning literally <em>reshapes</em> probability.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var labels=['P(4)','P(4 | even)','P(4 | odd)'];
var vals=[1/6,1/3,0];
var bars={x:labels,y:vals,type:'bar',name:'probability',marker:{color:['#3b82f6','#10b981','#ef4444']},text:['1/6 ≈ 0.167','1/3 ≈ 0.333','0'],textposition:'outside',textfont:{color:'#e8e8e8',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Conditioning event',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'Probability outcome is 4',range:[0,0.45],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:55,l:60},showlegend:false};
Plotly.newPlot('plot-l96-shift-en',[bars],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Symmetry and asymmetry.</strong> Conditioning is asymmetric in general: $P(A \\mid B)$ is usually different from $P(B \\mid A)$. The famous "prosecutor's fallacy" comes from confusing these two — for example, treating $P(\\text{positive test} \\mid \\text{disease}) = 0.95$ as if it meant $P(\\text{disease} \\mid \\text{positive test}) = 0.95$, which can be wildly wrong when the disease is rare.</div>

<h2 class="lesson-title">8. The Medical Test Problem</h2>

<div class="calc-highlight"><strong>A classic and counter-intuitive result.</strong> Suppose a disease affects 1% of the population. A diagnostic test is 95% accurate when the disease is present (sensitivity = 95%) and 90% accurate when it is absent (specificity = 90%, so the false-positive rate is 10%). If your test comes back positive, what is the probability you actually have the disease?</div>

<p class="l-text">Most people, including many medical students, guess "about 95% — the test is 95% accurate, so a positive result is 95% likely to be right". The actual answer, derived purely from the conditional-probability formula, is about <strong>8.7%</strong>. Let us work through it.</p>

<p class="l-text"><strong>Imagine 10,000 people.</strong> One per cent — 100 people — have the disease. Of those 100, the test is positive for 95 (sensitivity 95%). The other 9,900 are healthy; of those, the test is positive for 990 (10% false positive rate). So the total number of positive tests is $95 + 990 = 1085$. Among those 1085 positives, only 95 truly have the disease. Therefore:</p>

<div class="calc-formula"><div class="formula-label">P(DISEASE | POSITIVE) &mdash; THE CALCULATION</div><div class="formula-main">$$P(\\text{disease} \\mid +) \\;=\\; \\dfrac{P(\\text{disease} \\cap +)}{P(+)} \\;=\\; \\dfrac{95}{1085} \\;\\approx\\; 0.0876.$$</div><div class="formula-sub">About 8.7%, not 95%. The rarity of the disease swamps the accuracy of the test.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; SAME PROBLEM, FORMULAS</div><div class="example-body">Let $D$ = "disease", $+$ = "test positive".<br>Given: $P(D) = 0.01$, $P(+ \\mid D) = 0.95$, $P(+ \\mid D') = 0.10$.<br><br>Numerator: $P(D \\cap +) = P(D) \\cdot P(+ \\mid D) = 0.01 \\cdot 0.95 = 0.0095$.<br>Denominator (total probability):<br>$P(+) = P(+ \\mid D) P(D) + P(+ \\mid D') P(D') = 0.95 \\cdot 0.01 + 0.10 \\cdot 0.99 = 0.0095 + 0.099 = 0.1085$.<br>$$P(D \\mid +) = \\dfrac{0.0095}{0.1085} \\approx 0.0876.$$<br>The two routes — counting 10,000 imaginary people and computing with formulas — give the same number.</div></div>

<p class="l-text"><strong>Why does the answer feel so low?</strong> Because the population is mostly healthy. There are far more healthy people than sick people, so even a small false-positive rate produces a large absolute number of false positives. The 990 false positives outnumber the 95 true positives by more than 10 to 1, so a randomly chosen positive result is much more likely to be false than true.</p>

<div class="l-note"><strong>Lesson for life.</strong> When evaluating tests, screenings, alarms, or any kind of detector, the answer always depends on the base rate (the prior probability before testing). High accuracy alone is not enough if the thing you are testing for is rare. This is one of the most practically important consequences of conditional probability and the reason we taught the topic.</div>

<h2 class="lesson-title">9. Common Mistakes</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Swapping the roles of A and B</div><div class="card-body">$P(A \\mid B)$ is not the same as $P(B \\mid A)$. The vertical bar reads "given" — what comes <em>after</em> the bar is the event you assume happened. Always identify which is the given event and which is the target before you write any number.</div></div>
<div class="calc-card"><div class="card-title">Forgetting to renormalise</div><div class="card-body">After conditioning on B, the new sample space has total probability $P(B)$, not 1. You divide by $P(B)$ to scale things back to a proper probability. Skipping this division gives a joint probability ($P(A \\cap B)$) instead of a conditional one.</div></div>
<div class="calc-card"><div class="card-title">Mixing up independence and disjoint</div><div class="card-body">Independence means knowing B happened tells you nothing about A. Disjoint means knowing B happened tells you A definitely did <em>not</em> happen. These are opposite kinds of information, not the same.</div></div>
<div class="calc-card"><div class="card-title">Ignoring the base rate</div><div class="card-body">In the medical-test problem the answer is dominated by how rare the disease is, not by how accurate the test is. Forgetting the base rate is the most common mistake in real-world risk reasoning.</div></div>
</div>

<h2 class="lesson-title">10. Worked Problems</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; DIE GIVEN EVEN</div><div class="example-body"><strong>A fair die is rolled. Given that the outcome is even, what is the probability that it is greater than 3?</strong><br><br>Conditioning event: $B = \\{2, 4, 6\\}$, $|B| = 3$. Target inside B: outcomes greater than 3 are $\\{4, 6\\}$, two of them.<br>$$P(>3 \\mid \\text{even}) = \\dfrac{2}{3}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; TWO CARDS</div><div class="example-body"><strong>Two cards are drawn from a 52-card deck without replacement. Given that the first card was an Ace, what is the probability that the second is also an Ace?</strong><br><br>After removing one Ace, 51 cards remain with 3 Aces left.<br>$$P(\\text{Ace}_2 \\mid \\text{Ace}_1) = \\dfrac{3}{51} = \\dfrac{1}{17}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; URN, BOTH BLUE</div><div class="example-body"><strong>An urn contains 4 red and 6 blue balls. Two balls are drawn without replacement. What is the probability that both are blue?</strong><br><br>$P(B_1) = 6/10$. Given the first was blue, $P(B_2 \\mid B_1) = 5/9$.<br>$$P(B_1 \\cap B_2) = \\dfrac{6}{10} \\cdot \\dfrac{5}{9} = \\dfrac{30}{90} = \\dfrac{1}{3}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; TWO MACHINES</div><div class="example-body"><strong>Factory A produces 70% of items with a 2% defect rate; factory B produces 30% with a 6% defect rate. Pick an item at random. What is the probability it is defective?</strong><br><br>Law of total probability:<br>$$P(D) = 0.02 \\cdot 0.7 + 0.06 \\cdot 0.3 = 0.014 + 0.018 = 0.032 = 3.2\\%.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; CARDS GIVEN SUIT</div><div class="example-body"><strong>A card is drawn from a standard deck. Given that it is a heart, what is the probability that it is a face card (J, Q, K)?</strong><br><br>Conditioning event: heart, $|B| = 13$. Face cards within hearts: J&hearts;, Q&hearts;, K&hearts; — three.<br>$$P(\\text{face} \\mid \\text{heart}) = \\dfrac{3}{13}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; MEDICAL TEST</div><div class="example-body"><strong>A disease has prevalence 2%. A test has sensitivity 90% and specificity 85% (so false positive rate 15%). Given a positive result, what is the probability the patient has the disease?</strong><br><br>Imagine 10,000 people. $0.02 \\cdot 10000 = 200$ have the disease, of which $0.9 \\cdot 200 = 180$ test positive. $9800$ are healthy, of which $0.15 \\cdot 9800 = 1470$ test positive (false positives). Total positives: $180 + 1470 = 1650$.<br>$$P(D \\mid +) = \\dfrac{180}{1650} \\approx 0.109 = 10.9\\%.$$<br>Less than 11% — even with a "90% accurate" test, most positive results are false positives because the disease is rare.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; AT LEAST ONE</div><div class="example-body"><strong>Toss three fair coins. Given that at least one toss is a head, what is the probability that all three are heads?</strong><br><br>Sample space has 8 outcomes; "at least one head" has 7 (everything except TTT); "all heads" is just HHH.<br>$$P(HHH \\mid \\text{at least one H}) = \\dfrac{1}{7}.$$<br>Without the condition, $P(HHH) = 1/8$. Conditioning raised it slightly.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; INDEPENDENCE CHECK</div><div class="example-body"><strong>Two fair dice are rolled. Let $A$ = "the first die is 6" and $B$ = "the sum is 7". Are A and B independent?</strong><br><br>$P(A) = 1/6$. $P(B) = 6/36 = 1/6$ (pairs summing to 7 are $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$, six of them out of 36). $A \\cap B$ = "first die is 6 and sum is 7" = $\\{(6,1)\\}$, so $P(A \\cap B) = 1/36$.<br>Check: $P(A) \\cdot P(B) = (1/6)(1/6) = 1/36 = P(A \\cap B)$. Yes, A and B are independent.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Conditional probability: $P(A \\mid B) = P(A \\cap B) / P(B)$, valid when $P(B) > 0$.</li>
<li>Interpretation: after learning B occurred, B becomes the new (reduced) sample space.</li>
<li>Multiplication rule: $P(A \\cap B) = P(B) \\cdot P(A \\mid B) = P(A) \\cdot P(B \\mid A)$.</li>
<li>Tree diagrams: branches carry conditional probabilities; multiply along a path to find joint probability of a leaf.</li>
<li>Law of total probability: $P(A) = P(A \\mid B) P(B) + P(A \\mid B') P(B')$ — useful when A is hard to compute directly.</li>
<li>Independence: $P(A \\mid B) = P(A)$, equivalently $P(A \\cap B) = P(A) P(B)$. NOT the same as disjoint.</li>
<li>Medical test problem: when the condition is rare, even a very accurate test produces mostly false positives.</li>
<li>$P(A \\mid B)$ and $P(B \\mid A)$ are usually different — never confuse the two.</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Koşullu olasılık, bir deneyin ortasında yeni bir bilgi öğrendiğinde olan şeydir.</strong> Önce bir olayın olasılığını bilirsin — diyelim ki rastgele seçilen bir kişinin belirli bir hastalığa sahip olma olasılığı — sonra bir bilgi gelir ve resmi değiştirir. Belki tıbbi test pozitif çıkmıştır. Belki bir tanık kırmızı bir araba gördüğünü söylemiştir. Belki desteden çekilen ilk kart as çıkmıştır. Her durumda başlangıçtaki olasılık artık doğru sayı değildir; onu yeni bilgiyi yansıtacak şekilde <em>güncellemelisin</em>. Bu güncellemenin matematiği koşullu olasılıktır.</p>

<p class="l-text">Bu derste tek bir formülle tanışacaksın, $P(A \\mid B) = P(A \\cap B) / P(B)$, ve bu formülün uzun bir gerçek problem listesini nasıl çözdüğünü göreceksin: yerine koymadan kart çekimi, torba problemleri, ağaç üzerinde gösterilen iki aşamalı deneyler ve %95 doğrulukta bir testin bile sıklıkla yanlış olabileceğini gösteren ünlü tıbbi test problemi. Ayrıca iki olayın "bağımsız" olmasının tam olarak ne anlama geldiğini göreceksin — bağımsızlık, B'ye koşullamanın A'nın olasılığını değiştirmediği özel durumdan başka bir şey değildir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Koşullu olasılığı $P(A \\mid B) = P(A \\cap B) / P(B)$ ile tanımlamayı ve onu "B'nin gerçekleştiği bilindiği indirgenmiş örnek uzayda A'nın olasılığı" olarak yorumlamayı</li>
<li>Çarpma kuralını $P(A \\cap B) = P(B) \\cdot P(A \\mid B)$ kullanarak birleşik olasılıkları hesaplamayı</li>
<li>Toplam olasılık kuralını $P(A) = P(A \\mid B) P(B) + P(A \\mid B') P(B')$ uygulayarak bir olasılığı bir bölüntü üzerinde parçalamayı</li>
<li>İki aşamalı deneyleri dallarında koşullu olasılık olan ağaçlar olarak çizmeyi ve bir yol boyunca çarpmayı</li>
<li>Bağımsızlığı $P(A \\mid B) = P(A)$ koşulu olarak tanımayı ve birleşik olasılıkları sadeleştirmek için kullanmayı</li>
<li>Tıbbi test problemini çözmeyi: yaygınlık, duyarlılık ve özgüllük verildiğinde $P(\\text{hastalık} \\mid \\text{pozitif})$ değerini doğrudan hesaplamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Fikir: Yeni Bilgi Örnek Uzayı Yeniden Şekillendirir</h2>

<div class="calc-highlight"><strong>Olasılığı "olabilecek şeylerin" bir kesri olarak düşün.</strong> Başlangıçta payda tüm örnek uzay S'dir. Ama bir B olayının gerçekleştiğini öğrendiğin anda olasılıklar evreni daralır: artık yalnızca B'nin içindeki sonuçlar oyundadır. O noktadan sonra hesapladığın her olasılık S'yi değil, B'yi yeni payda olarak kullanır. Bu, koşullu olasılığın tek bir cümlede özetidir.</div>

<p class="l-text">Somut bir örnek. Hilesiz bir zar at. Hiçbir bilgi olmadan örnek uzay $S = \\{1, 2, 3, 4, 5, 6\\}$ ve 4 gelme olasılığı $1/6$'dır. Şimdi birisi zara bakıp sana "sonuç çift" dediğini düşün. Hâlâ oyunda olan sonuçlar artık yalnızca $B = \\{2, 4, 6\\}$ — üç sonuç, hepsi eşit olasılıklı. Bu üçünden tam olarak biri 4'tür. Yani yeni bilgi verildiğinde, 4 atmış olma olasılığın $1/6$ değil $1/3$'tür.</p>

<div class="calc-formula"><div class="formula-label">KOŞULLU OLASILIK &mdash; TANIM</div><div class="formula-main">$$P(A \\mid B) \\;=\\; \\frac{P(A \\cap B)}{P(B)}, \\qquad P(B) > 0 \\text{ koşuluyla.}$$</div><div class="formula-sub">Sesli okunuşu: "B verildiğinde A'nın olasılığı". Dikey çubuk "verildiğinde" anlamına gelir. P(B) pozitif olmalıdır — olasılığı sıfır olan bir olaya koşullama yapamazsın.</div></div>

<p class="l-text">Formül neden tam olarak bu şekilde? İndirgenmiş örnek uzay B'nin içinde "A da gerçekleşti" olayı hem A'da hem de B'de olan sonuçlara — yani $A \\cap B$ kesişimine — karşılık gelir. Bunu olasılığa çevirmek için yeni örnek uzayın toplam ağırlığı olan $P(B)$'ye böleriz. Yani koşullu olasılık, $A \\cap B$'nin B içindeki bağıl ağırlığıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eski resim</div><div class="card-body">Tüm örnek uzay S. A'nın olasılığı $P(A) = |A|/|S|$ (eşit olasılıklı sonuçlar için).</div></div>
<div class="calc-card"><div class="card-title">B öğrenildikten sonraki yeni resim</div><div class="card-body">İndirgenmiş örnek uzay B. A'nın olasılığı $P(A \\mid B) = |A \\cap B|/|B|$ olur.</div></div>
<div class="calc-card"><div class="card-title">Terminoloji</div><div class="card-body">B'ye "koşullama olayı" veya "verilen olay" denir. A ise "hedef olay" olarak adlandırılır.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Hilesiz bir zar at. Sonucun 3'ten büyük olduğu verildiğinde, sonucun tam olarak 5 olma olasılığı nedir? (İndirgenmiş örnek uzay $B = \\{4, 5, 6\\}$ — 3 sonuç; tam olarak biri 5; cevap $1/3$.)</div></div>

<h2 class="lesson-title">2. Geometrik Bakış: B İçindeki Alanların Oranı</h2>

<div class="calc-highlight"><strong>Örnek uzayı toplam alanı 1 olan bir dikdörtgen olarak hayal et.</strong> A ve B olayları o dikdörtgenin içinde, muhtemelen örtüşen bölgelerdir. $A \\cap B$ kesişimi, örtüştükleri mercek şeklindeki bölgedir. Koşullu olasılık $P(A \\mid B)$, $A \\cap B$'nin alanının B'nin alanına bölümüdür — B'nin A'nın içinde de olan kısmının oranı.</div>

<div class="calc-graph"><div id="plot-l96-venn-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> S örnek uzayı içinde örtüşen iki A ve B olayı. Gölgeli mercek $A \\cap B$ kesişimidir. B'ye koşullamak demek "B dairesine yakınlaş ve dışındaki her şeyi göz ardı et" demektir; o küçük dünyada A tam olarak merceği işgal eder. Yani $P(A \\mid B) = \\text{alan}(A \\cap B) / \\text{alan}(B)$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var c1xT=[];var c1yT=[];var c2xT=[];var c2yT=[];
for(var i=0;i<=160;i++){var a=2*Math.PI*i/160;c1xT.push(-0.55+1.0*Math.cos(a));c1yT.push(1.0*Math.sin(a));c2xT.push(0.55+1.0*Math.cos(a));c2yT.push(1.0*Math.sin(a));}
var rectXT=[-2.2,2.2,2.2,-2.2,-2.2];var rectYT=[-1.4,-1.4,1.4,1.4,-1.4];
var boxT={x:rectXT,y:rectYT,mode:'lines',name:'S',line:{color:'rgba(255,255,255,0.35)',width:1.5},fill:'toself',fillcolor:'rgba(255,255,255,0.02)'};
var circAT={x:c1xT,y:c1yT,mode:'lines',name:'A',line:{color:'#3b82f6',width:2.2},fill:'toself',fillcolor:'rgba(59,130,246,0.12)'};
var circBT={x:c2xT,y:c2yT,mode:'lines',name:'B',line:{color:'#10b981',width:2.2},fill:'toself',fillcolor:'rgba(16,185,129,0.18)'};
var lensXT=[];var lensYT=[];
for(var i=0;i<=80;i++){var a=Math.PI/3-2*Math.PI/3*i/80;lensXT.push(-0.55+1.0*Math.cos(a));lensYT.push(1.0*Math.sin(a));}
for(var i=0;i<=80;i++){var a=Math.PI+Math.PI/3-2*Math.PI/3*i/80;lensXT.push(0.55+1.0*Math.cos(a));lensYT.push(1.0*Math.sin(a));}
var lensT={x:lensXT,y:lensYT,mode:'lines',name:'A ve B',line:{color:'#f59e0b',width:0.5},fill:'toself',fillcolor:'rgba(245,158,11,0.45)'};
var labsT={x:[-1.45,1.45,0,-2.0,0,0.95],y:[0,0,0,1.2,-1.65,0.65],mode:'text',name:'etiket',text:['<b>yalnız A</b>','<b>yalnız B</b>','<b>A &cap; B</b>','<b>S</b>','A ve B dışı','B icine yakinlas'],textfont:{color:['#3b82f6','#10b981','#f59e0b','#e8e8e8','rgba(235,230,220,0.7)','rgba(16,185,129,0.95)'],size:13},showlegend:false};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-2.4,2.4],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'y',scaleratio:1},yaxis:{range:[-1.9,1.5],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:30,l:30},showlegend:false};
Plotly.newPlot('plot-l96-venn-tr',[boxT,circAT,circBT,lensT,labsT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Formülün iki okuma yolu.</strong> Birinci okuma "alanların oranı"dır: $P(A \\mid B)$, B'nin A'nın içinde de bulunan dilimidir. İkinci okuma "yeniden normalize edilmiş olasılık"tır: 0 ile $P(B)$ arasında bir sayı olan $P(A \\cap B)$'yi alırsın ve $P(B)$'ye bölerek yeni evren içinde $[0, 1]$ aralığında yaşayan bir olasılığa ölçeklersin. İki okuma da aynı sayıyı verir; ikisi de kullanışlıdır.</p>

<div class="l-note"><strong>Tutarlılık kontrolleri.</strong> Eğer $A \\subseteq B$ ise $A \\cap B = A$, dolayısıyla $P(A \\mid B) = P(A)/P(B)$. A ve B ayrık ise $A \\cap B = \\emptyset$ olur, $P(A \\mid B) = 0$. $A = B$ ise $P(A \\mid B) = P(B)/P(B) = 1$ olur.</div>

<h2 class="lesson-title">3. Çarpma Kuralı</h2>

<div class="calc-highlight"><strong>Tanımı yeniden düzenle.</strong> $P(A \\mid B) = P(A \\cap B) / P(B)$ eşitliğinin her iki tarafını $P(B)$ ile çarparsan, birleşik olasılık $P(A \\cap B)$ için koşullu olasılık cinsinden bir formül elde edersin. Bu kural her ağaç-diyagramı hesabını çalıştıran kuraldır.</div>

<div class="calc-formula"><div class="formula-label">ÇARPMA KURALI</div><div class="formula-main">$$P(A \\cap B) \\;=\\; P(B) \\cdot P(A \\mid B) \\;=\\; P(A) \\cdot P(B \\mid A)$$</div><div class="formula-sub">A ve B'nin birlikte gerçekleşme olasılığı, ilk olayın olasılığı çarpı ilk olay verildiğinde ikincisinin koşullu olasılığıdır. Her iki sıra da çalışır.</div></div>

<p class="l-text"><strong>Nasıl kullanılır.</strong> Çoğu çok aşamalı problem aşamaları sırayla yürüyüp yol boyunca koşullu olasılıkları çarparak en kolay biçimde çözülür. "Önce as çek, sonra tekrar as çek" $P(\\text{as}_1) \\cdot P(\\text{as}_2 \\mid \\text{as}_1)$ olur — yerine koymadan çekilen bir deste için bu $(4/52) \\cdot (3/51)$'dir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1 &mdash; İKİ KART</div><div class="example-body">Standart 52'lik desteden yerine koymadan iki kart çek. Her ikisinin de as olma olasılığı nedir?<br><br>$A_1$ = "ilk kart as", $A_2$ = "ikinci kart as" olsun.<br>$P(A_1) = 4/52 = 1/13$.<br>İlk kart as iken destede yalnızca 3 as kalır ve toplam 51 kart vardır, dolayısıyla $P(A_2 \\mid A_1) = 3/51 = 1/17$.<br>$$P(A_1 \\cap A_2) = \\dfrac{1}{13} \\cdot \\dfrac{1}{17} = \\dfrac{1}{221} \\approx 0{,}0045.$$<br>Yani yarım yüzde biraz altında — arka arkaya iki as çekmek nadirdir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 &mdash; TORBA</div><div class="example-body">Bir torbada 5 kırmızı ve 3 mavi bilye vardır. Yerine koymadan iki bilye çekilir. İlk bilye kırmızı iken ikinci bilyenin mavi olma olasılığını bul.<br><br>İlk bilye kırmızı ise torbada 4 kırmızı ve 3 mavi kalır, toplam 7 bilye. Bu yüzden<br>$$P(M_2 \\mid K_1) = \\dfrac{3}{7}.$$<br>Koşullama yapmadan, $P(M_2) = 3/8$. İlk bilyenin kırmızı olduğunu bilmek ikinci bilyenin mavi olma şansını aslında <em>artırmıştır</em> ($3/8 = 0{,}375$ değerinden $3/7 \\approx 0{,}429$ değerine).</div></div>

<h2 class="lesson-title">4. Koşullu Olasılık için Ağaç Diyagramları</h2>

<div class="calc-highlight"><strong>Ağaç diyagramları çok aşamalı deneyleri elle yapabileceğin bir hesaba dönüştürür.</strong> Bir ana düğümden bir çocuk düğüme giden her dal, o çocuğun önceki her şey verildiğinde <em>koşullu</em> olasılığıyla etiketlenir. Herhangi bir yaprağın olasılığını bulmak için kökten o yaprağa giden tek yol boyunca olasılıkları çarpman yeterlidir. Birkaç yaprağa yayılmış bir olayın olasılığını bulmak için her yol boyunca çarp ve sonuçları topla.</div>

<p class="l-text">İki aşamalı bir torba problemini düşün. Bir torbada 5 kırmızı ve 3 mavi bilye var. Yerine koymadan iki bilye çek. İlk çekiş iki dala ayrılır — Kırmızı, olasılığı $5/8$ ve Mavi, olasılığı $3/8$. Kırmızı dalından ikinci çekiş Kırmızı (şimdi $4/7$) ve Mavi'ye (şimdi $3/7$) ayrılır, çünkü bir kırmızı bilye eksiktir. Mavi dalından ikinci çekiş Kırmızı'ya ($5/7$) ve Mavi'ye ($2/7$) ayrılır. Dört yaprak şu olasılıkları verir: $5/8 \\cdot 4/7$, $5/8 \\cdot 3/7$, $3/8 \\cdot 5/7$, $3/8 \\cdot 2/7$. Bunlar 1'e toplanmalıdır — ve toplanır.</p>

<div class="calc-graph"><div id="plot-l96-tree-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> yerine koymadan çekilen 5 kırmızı ve 3 mavi bilyenin iki aşamalı torba problemi için bir ağaç. Her dal kendi koşullu olasılığıyla, her yaprak ise yol boyunca çarpımla elde edilen birleşik olasılıkla etiketlenmiştir. Dört yaprak olasılığı 1'e toplanır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var edgesT={x:[0,1,null,0,1,null,1,2,null,1,2,null,1,2,null,1,2,null],y:[0,1.3,null,0,-1.3,null,1.3,2.0,null,1.3,0.6,null,-1.3,-0.6,null,-1.3,-2.0,null],mode:'lines',name:'ağaç',line:{color:'rgba(255,255,255,0.45)',width:1.6}};
var nodesT={x:[0,1,1,2,2,2,2],y:[0,1.3,-1.3,2.0,0.6,-0.6,-2.0],mode:'markers+text',name:'düğüm',marker:{color:'#3b82f6',size:14},text:['başla','K1','M1','K2','M2','K2','M2'],textposition:'top center',textfont:{color:'#e8e8e8',size:13},showlegend:false};
var branchLabelsT={x:[0.5,0.5,1.5,1.5,1.5,1.5],y:[0.85,-0.85,1.78,0.85,-0.85,-1.78],mode:'text',name:'p',text:['5/8','3/8','4/7','3/7','5/7','2/7'],textfont:{color:'#f59e0b',size:13},showlegend:false};
var leavesT={x:[2.95,2.95,2.95,2.95],y:[2.0,0.6,-0.6,-2.0],mode:'text',name:'P',text:['P=20/56','P=15/56','P=15/56','P=6/56'],textfont:{color:'#10b981',size:12},showlegend:false};
var pathLabelsT={x:[3.7,3.7,3.7,3.7],y:[2.0,0.6,-0.6,-2.0],mode:'text',name:'etiket',text:['KK','KM','MK','MM'],textfont:{color:'rgba(235,230,220,0.75)',size:12},showlegend:false};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.4,4.2],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-2.5,2.5],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l96-tree-tr',[edgesT,nodesT,branchLabelsT,leavesT,pathLabelsT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; AĞACI KULLANMAK</div><div class="example-body">Yukarıdaki ağaçtan, çekilen iki bilyenin aynı renkte olma olasılığı nedir?<br><br>"Aynı renk" KK veya MM'dir. İki yaprak olasılığı:<br>$P(KK) = 20/56$ ve $P(MM) = 6/56$.<br>$$P(\\text{aynı renk}) = \\dfrac{20}{56} + \\dfrac{6}{56} = \\dfrac{26}{56} = \\dfrac{13}{28} \\approx 0{,}464.$$</div></div>

<div class="l-note"><strong>Ağaçlar neden çalışır.</strong> Kökten yaprağa giden her yol, aşama sonuçlarından oluşan belirli bir diziye karşılık gelir. Çarpma kuralı, yol boyunca tekrar tekrar uygulandığında o tüm dizinin birleşik olasılığını verir. Yaprak olasılıklarını toplamak ise ayrık olaylar için toplama aksiyomudur — farklı yapraklar farklı dizileri tanımlar ve aynı anda gerçekleşemez.</div>

<h2 class="lesson-title">5. Toplam Olasılık Kuralı</h2>

<div class="calc-highlight"><strong>B'nin gerçekleşip gerçekleşmediği bir olay olsun.</strong> O zaman herhangi başka bir A olayı "hem A hem B gerçekleşti" veya "B gerçekleşmedi ama A gerçekleşti" şeklinde iki parçaya ayrılabilir. Bu iki durum ayrıktır ve birlikte A'nın gerçekleşebileceği her yolu kapsar. Olasılıklarını toplamak A'yı doğrudan hesaplamaktan çoğu zaman çok daha kolay bir formül verir.</div>

<div class="calc-formula"><div class="formula-label">TOPLAM OLASILIK KURALI (İKİ DURUM)</div><div class="formula-main">$$P(A) \\;=\\; P(A \\mid B) \\cdot P(B) \\;+\\; P(A \\mid B') \\cdot P(B')$$</div><div class="formula-sub">A'yı B'nin gerçekleşip gerçekleşmemesine göre ayır, sonra her parçayı kendi durumunun olasılığıyla ağırlıkla.</div></div>

<p class="l-text"><strong>Daha genel olarak,</strong> $B_1, B_2, \\ldots, B_k$ S'nin bir bölüntüsü ise (ayrık olaylar ve hepsi birlikte tüm uzayı kaplar):</p>

<div class="calc-formula"><div class="formula-label">TOPLAM OLASILIK KURALI (BÖLÜNTÜ)</div><div class="formula-main">$$P(A) \\;=\\; \\sum_{i=1}^{k} P(A \\mid B_i) \\cdot P(B_i)$$</div><div class="formula-sub">Aynı fikir, 2 yerine k parça. Her $B_i$ B'nin olabileceği karşılıklı dışlayan durumlardan biridir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; İKİ MAKİNE</div><div class="example-body">Bir fabrikada iki makine var. 1. makine ürünlerin %60'ını üretir ve ürünlerinin %3'ü kusurludur. 2. makine %40'ını üretir ve %5'i kusurludur. Rastgele bir ürün seç. Kusurlu olma olasılığı nedir?<br><br>$D$ = "kusurlu", $M_1, M_2$ = "1. veya 2. makine yapımı" olsun.<br>$$P(D) = P(D \\mid M_1) P(M_1) + P(D \\mid M_2) P(M_2)$$<br>$$= 0{,}03 \\cdot 0{,}6 + 0{,}05 \\cdot 0{,}4 = 0{,}018 + 0{,}020 = 0{,}038 = \\%3{,}8.$$<br>Her 100 üründen yaklaşık 4'ü kusurludur.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Yukarıdaki fabrikada kusurlu ürünlerin ne kadarı 1. makineden gelmiştir? (Bu $P(M_1 \\mid D)$ sorusudur — tanım gereği $P(M_1 \\cap D) / P(D) = 0{,}018 / 0{,}038 \\approx 0{,}474$, yaklaşık %47.)</div></div>

<h2 class="lesson-title">6. Bağımsızlığa Yeniden Bakış</h2>

<div class="calc-highlight"><strong>İki olay, birinin gerçekleştiğini bilmek diğerinin olasılığını değiştirmiyorsa bağımsızdır.</strong> Biçimsel olarak: A ve B bağımsızdır ancak ve ancak $P(A \\mid B) = P(A)$. Eşdeğer olarak $P(A \\cap B) = P(A) \\cdot P(B)$. Bağımsızlık tam olarak koşullu olasılığın koşulsuz (orijinal) olasılığa geri çöktüğü durumdur.</div>

<div class="calc-formula"><div class="formula-label">BAĞIMSIZLIK &mdash; ÜÇ EŞDEĞER BİÇİM</div><div class="formula-main">$$P(A \\mid B) = P(A) \\quad\\Longleftrightarrow\\quad P(B \\mid A) = P(B) \\quad\\Longleftrightarrow\\quad P(A \\cap B) = P(A) \\cdot P(B)$$</div><div class="formula-sub">Üçünden herhangi biri diğer ikisini gerektirir. Çoğu ders kitabı en sağdakini tanım olarak alır çünkü A ve B'de simetriktir.</div></div>

<p class="l-text"><strong>Bağımsız olay örnekleri.</strong> Bir parayı iki kez at: birinci ve ikinci atışlar bağımsızdır çünkü paranın hafızası yoktur. İki ayrı zar at: 1. zarın sonucu 2. zardan bağımsızdır. Bir kart çek, yerine koy ve karıştır, sonra tekrar çek: yerine koymak desteyi yenilediği için iki çekiş bağımsızdır.</p>

<p class="l-text"><strong>Bağımlı olay örnekleri.</strong> Yerine koymadan iki kart çek: ilk kartı bilmek onu ikinci çekişin havuzundan kaldırır, bu yüzden iki olay bağımlıdır. Bugünün ve yarının havası bağımlıdır (yağışlı bir günü diğer bir yağışlı gün, şansın söylediğinden daha sık takip eder). Bir öğrencinin cebir ve geometri notları bağımlıdır (güçlü bir öğrenci ikisinde de güçlü olma eğilimindedir).</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; BAĞIMSIZ PARALAR</div><div class="example-body">Hilesiz bir parayı iki kez at. $Y_1$ = "ilk atış yazı", $Y_2$ = "ikinci atış yazı" olsun. $Y_1$ ve $Y_2$'nin bağımsız olduğunu göster ve $P(Y_1 \\cap Y_2)$'yi hesapla.<br><br>$P(Y_1) = 1/2$, $P(Y_2) = 1/2$. $Y_1$'i gözlemledikten sonra ikinci atış hâlâ taze hilesiz bir paradır, dolayısıyla $P(Y_2 \\mid Y_1) = 1/2 = P(Y_2)$. Demek ki $Y_1, Y_2$ bağımsızdır.<br>$$P(Y_1 \\cap Y_2) = \\dfrac{1}{2} \\cdot \\dfrac{1}{2} = \\dfrac{1}{4}.$$<br>Eşdeğer olarak, $S = \\{YY, YT, TY, TT\\}$ ve $|Y_1 \\cap Y_2| = 1$.</div></div>

<div class="l-note"><strong>Bağımsızlık "karşılıklı dışlayan" ile aynı şey DEĞİLDİR.</strong> Birlikte gerçekleşemeyen iki olay <em>son derece</em> bağımlıdır — birinin gerçekleştiğini bilmek diğerinin gerçekleşmediğini söyler. A ve B ayrık ise ve $P(A), P(B) > 0$ ise, $P(A \\mid B) = 0 \\ne P(A)$ olur, yani bağımlıdırlar. Yeni başlayanlar bu ikisini sık sık karıştırır; sen karıştırma.</div>

<h2 class="lesson-title">7. Koşullama Olasılığı Kaydırır</h2>

<div class="calc-highlight"><strong>Koşullu olasılığın tüm amacı, B'nin gerçekleştiğini öğrenmenin A hakkında bildiklerini değiştirebilmesidir.</strong> Değişim her iki yöne de olabilir: B'ye koşullamak A'nın olasılığını artırabilir, azaltabilir veya değiştirmeyebilir (bağımsız durum). Üç durumu da tek bir örnekle yan yana inceleyelim.</div>

<p class="l-text">Hilesiz bir zar at. Üç olasılığı karşılaştır:</p>

<ul class="l-list">
<li>$P(\\text{sonuç 4}) = 1/6 \\approx 0{,}167$ — koşullama yok.</li>
<li>$P(\\text{sonuç 4} \\mid \\text{sonuç çift}) = 1/3 \\approx 0{,}333$ — "çift"e koşullamak olasılığı artırır (yeni örnek uzayda yalnızca 3 sonuç vardır, biri 4'tür).</li>
<li>$P(\\text{sonuç 4} \\mid \\text{sonuç tek}) = 0$ — "tek"e koşullamak olasılığı sıfıra düşürür (4 tek olamaz).</li>
</ul>

<div class="calc-graph"><div id="plot-l96-shift-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> "zar 4 gösterir" hedef olayı üç farklı koşullama senaryosu altında. Koşulsuz iken olasılık $1/6$. Sonucun çift olduğu verildiğinde $1/3$'e sıçrar. Sonucun tek olduğu verildiğinde 0'a çöker. Koşullama olasılığı kelimenin tam anlamıyla <em>yeniden şekillendirir</em>.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var labelsT=['P(4)','P(4 | cift)','P(4 | tek)'];
var valsT=[1/6,1/3,0];
var barsT={x:labelsT,y:valsT,type:'bar',name:'olasılık',marker:{color:['#3b82f6','#10b981','#ef4444']},text:['1/6 ≈ 0,167','1/3 ≈ 0,333','0'],textposition:'outside',textfont:{color:'#e8e8e8',size:12}};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Koşullama olayı',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'Sonuç 4 olasılığı',range:[0,0.45],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:55,l:60},showlegend:false};
Plotly.newPlot('plot-l96-shift-tr',[barsT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Simetri ve asimetri.</strong> Koşullama genelde asimetriktir: $P(A \\mid B)$ ile $P(B \\mid A)$ çoğu zaman farklıdır. Ünlü "savcı yanılgısı" bu ikisinin karıştırılmasından doğar — örneğin $P(\\text{pozitif test} \\mid \\text{hastalık}) = 0{,}95$ değerini sanki $P(\\text{hastalık} \\mid \\text{pozitif test}) = 0{,}95$ anlamına geliyormuş gibi kullanmak; hastalık nadir iken bu çok yanlış olabilir.</div>

<h2 class="lesson-title">8. Tıbbi Test Problemi</h2>

<div class="calc-highlight"><strong>Klasik ve sezgiye aykırı bir sonuç.</strong> Bir hastalığın nüfusun %1'inde görüldüğünü varsay. Tanı testi hastalık varken %95 doğrudur (duyarlılık = %95), yokken ise %90 doğrudur (özgüllük = %90, dolayısıyla yanlış pozitif oranı %10). Testin pozitif çıkması durumunda gerçekten hastalığa sahip olma olasılığın nedir?</div>

<p class="l-text">Birçok kişi, hatta tıp öğrencileri bile "yaklaşık %95 — test %95 doğru, yani pozitif sonuç %95 olasılıkla doğrudur" der. Saf koşullu olasılık formülünden elde edilen gerçek cevap yaklaşık <strong>%8,7</strong>'dir. Adım adım inceleyelim.</p>

<p class="l-text"><strong>10.000 kişiyi hayal et.</strong> Yüzde bir — 100 kişi — hastalığa sahiptir. O 100 kişiden 95'inin testi pozitif çıkar (duyarlılık %95). Diğer 9.900 kişi sağlıklıdır; onlardan 990'ının testi pozitif çıkar (%10 yanlış pozitif oranı). Yani toplam pozitif test sayısı $95 + 990 = 1085$. Bu 1085 pozitif arasında yalnızca 95'i gerçekten hastalığa sahiptir. Dolayısıyla:</p>

<div class="calc-formula"><div class="formula-label">P(HASTALIK | POZİTİF) &mdash; HESAP</div><div class="formula-main">$$P(\\text{hastalık} \\mid +) \\;=\\; \\dfrac{P(\\text{hastalık} \\cap +)}{P(+)} \\;=\\; \\dfrac{95}{1085} \\;\\approx\\; 0{,}0876.$$</div><div class="formula-sub">Yaklaşık %8,7; %95 değil. Hastalığın nadirliği testin doğruluğunu bastırır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; AYNI PROBLEM, FORMÜLLERLE</div><div class="example-body">$D$ = "hastalık", $+$ = "test pozitif" olsun.<br>Verilen: $P(D) = 0{,}01$, $P(+ \\mid D) = 0{,}95$, $P(+ \\mid D') = 0{,}10$.<br><br>Pay: $P(D \\cap +) = P(D) \\cdot P(+ \\mid D) = 0{,}01 \\cdot 0{,}95 = 0{,}0095$.<br>Payda (toplam olasılık):<br>$P(+) = P(+ \\mid D) P(D) + P(+ \\mid D') P(D') = 0{,}95 \\cdot 0{,}01 + 0{,}10 \\cdot 0{,}99 = 0{,}0095 + 0{,}099 = 0{,}1085$.<br>$$P(D \\mid +) = \\dfrac{0{,}0095}{0{,}1085} \\approx 0{,}0876.$$<br>İki yol — 10.000 sanal kişi saymak ve formüllerle hesaplamak — aynı sayıyı verir.</div></div>

<p class="l-text"><strong>Cevap neden bu kadar düşük geliyor?</strong> Çünkü nüfus büyük ölçüde sağlıklıdır. Hasta olanlardan çok daha fazla sağlıklı insan vardır, dolayısıyla küçük bir yanlış pozitif oranı bile büyük bir mutlak yanlış pozitif sayısı üretir. 990 yanlış pozitif, 95 gerçek pozitiften 10'dan fazla katıdır, bu yüzden rastgele seçilen pozitif bir sonucun yanlış olma olasılığı doğru olma olasılığından çok daha yüksektir.</p>

<div class="l-note"><strong>Hayata dair ders.</strong> Testleri, taramaları, alarmları ya da her türlü dedektörü değerlendirirken cevap her zaman temel orana (test öncesi olasılığa) bağlıdır. Test ettiğin şey nadirse yüksek doğruluk tek başına yetmez. Bu, koşullu olasılığın en pratik olarak önemli sonuçlarından biridir ve konuyu öğrettiğimiz başlıca nedendir.</div>

<h2 class="lesson-title">9. Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">A ve B'nin rollerini yer değiştirmek</div><div class="card-body">$P(A \\mid B)$ ile $P(B \\mid A)$ aynı şey değildir. Dikey çubuk "verildiğinde" okunur — çubuktan <em>sonra</em> gelen, gerçekleştiğini varsaydığın olaydır. Sayı yazmadan önce her zaman hangisinin verilen, hangisinin hedef olay olduğunu belirle.</div></div>
<div class="calc-card"><div class="card-title">Yeniden normalleştirmeyi unutmak</div><div class="card-body">B'ye koşulladıktan sonra yeni örnek uzayın toplam olasılığı 1 değil $P(B)$'dir. Düzgün bir olasılığa geri ölçeklemek için $P(B)$'ye bölersin. Bu bölme atlanırsa koşullu olasılık yerine birleşik olasılık ($P(A \\cap B)$) elde edilir.</div></div>
<div class="calc-card"><div class="card-title">Bağımsızlık ile ayrık olmayı karıştırmak</div><div class="card-body">Bağımsızlık B'nin gerçekleştiğini bilmenin A hakkında hiçbir bilgi vermediği anlamına gelir. Ayrıklık B'nin gerçekleştiğini bilmenin A'nın kesinlikle gerçekleşmediğini söylediği anlamına gelir. Bunlar zıt türde bilgilerdir, aynı şey değil.</div></div>
<div class="calc-card"><div class="card-title">Temel oranı göz ardı etmek</div><div class="card-body">Tıbbi test probleminde cevap, testin ne kadar doğru olduğundan değil, hastalığın ne kadar nadir olduğundan etkilenir. Temel oranı unutmak gerçek dünya risk muhakemesindeki en yaygın hatadır.</div></div>
</div>

<h2 class="lesson-title">10. Çözümlü Problemler</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; ZAR, ÇİFT VERİLDİĞİNDE</div><div class="example-body"><strong>Hilesiz bir zar atılır. Sonucun çift olduğu verildiğinde, 3'ten büyük olma olasılığı nedir?</strong><br><br>Koşullama olayı: $B = \\{2, 4, 6\\}$, $|B| = 3$. B içindeki hedef: 3'ten büyük sonuçlar $\\{4, 6\\}$, iki tane.<br>$$P(>3 \\mid \\text{çift}) = \\dfrac{2}{3}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; İKİ KART</div><div class="example-body"><strong>52'lik desteden yerine koymadan iki kart çekilir. İlk kart As iken ikincinin de As olma olasılığı nedir?</strong><br><br>Bir As çıkarıldıktan sonra 51 kart kalır, 3 As mevcuttur.<br>$$P(\\text{As}_2 \\mid \\text{As}_1) = \\dfrac{3}{51} = \\dfrac{1}{17}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; TORBA, HER İKİSİ MAVİ</div><div class="example-body"><strong>Bir torbada 4 kırmızı ve 6 mavi bilye vardır. Yerine koymadan iki bilye çekilir. Her ikisinin de mavi olma olasılığı nedir?</strong><br><br>$P(M_1) = 6/10$. İlk mavi iken $P(M_2 \\mid M_1) = 5/9$.<br>$$P(M_1 \\cap M_2) = \\dfrac{6}{10} \\cdot \\dfrac{5}{9} = \\dfrac{30}{90} = \\dfrac{1}{3}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; İKİ MAKİNE</div><div class="example-body"><strong>A fabrikası ürünlerin %70'ini %2 kusur oranıyla, B fabrikası %30'unu %6 kusur oranıyla üretir. Rastgele bir ürün seç. Kusurlu olma olasılığı nedir?</strong><br><br>Toplam olasılık kuralı:<br>$$P(D) = 0{,}02 \\cdot 0{,}7 + 0{,}06 \\cdot 0{,}3 = 0{,}014 + 0{,}018 = 0{,}032 = \\%3{,}2.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; KART, SİMGE VERİLDİĞİNDE</div><div class="example-body"><strong>Standart bir desteden bir kart çekilir. Kupa olduğu verildiğinde, resimli kart (J, Q, K) olma olasılığı nedir?</strong><br><br>Koşullama olayı: kupa, $|B| = 13$. Kupalar arasında resimli kartlar: J&hearts;, Q&hearts;, K&hearts; — üç tane.<br>$$P(\\text{resimli} \\mid \\text{kupa}) = \\dfrac{3}{13}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; TIBBİ TEST</div><div class="example-body"><strong>Bir hastalığın yaygınlığı %2'dir. Test duyarlılığı %90, özgüllüğü %85 (yani yanlış pozitif oranı %15). Pozitif sonuç verildiğinde, hastanın hastalığa sahip olma olasılığı nedir?</strong><br><br>10.000 kişiyi hayal et. $0{,}02 \\cdot 10000 = 200$ kişide hastalık var; onların $0{,}9 \\cdot 200 = 180$'inin testi pozitif. $9800$ kişi sağlıklı; onların $0{,}15 \\cdot 9800 = 1470$'inin testi pozitif (yanlış pozitif). Toplam pozitifler: $180 + 1470 = 1650$.<br>$$P(D \\mid +) = \\dfrac{180}{1650} \\approx 0{,}109 = \\%10{,}9.$$<br>%11'den az — "%90 doğru" bir testle bile, hastalık nadir olduğu için pozitif sonuçların çoğu yanlış pozitiftir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; EN AZ BİR</div><div class="example-body"><strong>Üç hilesiz para atılır. En az bir atışın yazı olduğu verildiğinde, üçünün de yazı olma olasılığı nedir?</strong><br><br>Örnek uzayda 8 sonuç var; "en az bir yazı"da 7 (TTT hariç hepsi); "hepsi yazı" yalnızca YYY.<br>$$P(YYY \\mid \\text{en az bir Y}) = \\dfrac{1}{7}.$$<br>Koşulsuz olarak $P(YYY) = 1/8$. Koşullama olasılığı biraz artırmış.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; BAĞIMSIZLIK KONTROLÜ</div><div class="example-body"><strong>İki hilesiz zar atılır. $A$ = "ilk zar 6" ve $B$ = "toplam 7" olsun. A ve B bağımsız mı?</strong><br><br>$P(A) = 1/6$. $P(B) = 6/36 = 1/6$ (toplamı 7 olan ikililer $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$, 36 sonuçtan altı tane). $A \\cap B$ = "ilk zar 6 ve toplam 7" = $\\{(6,1)\\}$, dolayısıyla $P(A \\cap B) = 1/36$.<br>Kontrol: $P(A) \\cdot P(B) = (1/6)(1/6) = 1/36 = P(A \\cap B)$. Evet, A ve B bağımsızdır.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Koşullu olasılık: $P(A \\mid B) = P(A \\cap B) / P(B)$, $P(B) > 0$ koşuluyla.</li>
<li>Yorum: B'nin gerçekleştiği öğrenildikten sonra B yeni (indirgenmiş) örnek uzay olur.</li>
<li>Çarpma kuralı: $P(A \\cap B) = P(B) \\cdot P(A \\mid B) = P(A) \\cdot P(B \\mid A)$.</li>
<li>Ağaç diyagramları: dallar koşullu olasılık taşır; bir yaprağın birleşik olasılığı için yol boyunca çarpılır.</li>
<li>Toplam olasılık kuralı: $P(A) = P(A \\mid B) P(B) + P(A \\mid B') P(B')$ — A'yı doğrudan hesaplamak zor olduğunda kullanışlıdır.</li>
<li>Bağımsızlık: $P(A \\mid B) = P(A)$, eşdeğer olarak $P(A \\cap B) = P(A) P(B)$. Ayrık olmakla AYNI şey DEĞİLDİR.</li>
<li>Tıbbi test problemi: koşul nadirse, çok doğru bir test bile çoğu zaman yanlış pozitifler üretir.</li>
<li>$P(A \\mid B)$ ile $P(B \\mid A)$ genelde farklıdır — ikisini asla karıştırma.</li>
</ul>
</div>`
};
